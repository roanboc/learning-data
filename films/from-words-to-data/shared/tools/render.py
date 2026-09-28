"""Render the film to a 1080p MP4 in resumable chunks: python tools/render.py --workers 4
The video is dist/<key>.mp4. It needs build/mix.wav, from tools/audio.py."""
import argparse, base64, hashlib, os, subprocess, time
from multiprocessing import Process
import imageio_ffmpeg
from lang import *
from playwright.sync_api import sync_playwright

FF = imageio_ffmpeg.get_ffmpeg_exe()
fps = 30; CH = 600; D = BUILD / 'chunks'
OUT = DIST / (META['key'] + '.mp4')


def work(chunks, n, t0):
    with sync_playwright() as p:
        b, pg = render_page(p)
        for c0 in chunks:
            fn = '%s/c%05d.mp4' % (D, c0)
            proc = subprocess.Popen([FF, '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', fn], stdin=subprocess.PIPE)
            for i in range(c0, min(n, c0 + CH)):
                d = pg.evaluate("renderAt(%f,0.93)" % (i / fps)); proc.stdin.write(base64.b64decode(d[23:]))
            proc.stdin.close(); proc.wait(); open(fn + '.ok', 'w').write('1')
            print('chunk', c0, 'of', n, '%.0fs' % (time.time() - t0), flush=True)
        b.close()


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--workers', type=int, default=1, help='browsers rendering at the same time (default 1); about one per CPU core')
    A = ap.parse_args(); t0 = time.time()
    # finished chunks are reused only while the film is unchanged: a rebuilt render.html starts from scratch
    stamp = hashlib.sha1((DIST / 'render.html').read_bytes()).hexdigest()
    if not (D / 'stamp').exists() or (D / 'stamp').read_text() != stamp:
        for f in D.glob('c*'):
            f.unlink()
        (D / 'stamp').write_text(stamp)
    with sync_playwright() as p:
        b, pg = render_page(p); n = int(pg.evaluate("filmInfo().total") * fps); b.close()
    names = ['%s/c%05d.mp4' % (D, c0) for c0 in range(0, n, CH)]
    todo = [c0 for c0 in range(0, n, CH) if not os.path.exists('%s/c%05d.mp4.ok' % (D, c0))]
    ps = [Process(target=work, args=(todo[k::A.workers], n, t0)) for k in range(min(A.workers, len(todo)))]
    [x.start() for x in ps]; [x.join() for x in ps]
    if any(x.exitcode for x in ps):
        raise SystemExit('a render worker failed: run again to resume from the finished chunks')
    open(D / 'list.txt', 'w').write(''.join("file '%s'\n" % f for f in names))
    subprocess.run([FF, '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(D / 'list.txt'), '-c', 'copy', str(BUILD / 'video.mp4')], check=True)
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', str(BUILD / 'video.mp4'), '-i', str(BUILD / 'mix.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', str(OUT)], check=True)
    print('done', OUT.relative_to(ROOT), '%.0fs' % (time.time() - t0), flush=True)
