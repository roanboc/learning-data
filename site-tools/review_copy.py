"""Make a 720p copy of a rendered film, for its review page: python site-tools/review_copy.py <video.mp4> [--mb 15]
A full render is too big to share for review (renders of 74 and 152 MB couldn't be previewed or downloaded from the chat), and an
artifact takes files of up to 15 MB, so the copy is the same film at 720p, fitted under --mb by two passes of x264 (adaptive
quantisation that keeps faint lines in dark scenes), with its sound at 96 kb/s. It's written beside the video as <name>.review.mp4,
and review_page.py puts it on the page the author is sent (AGENTS.md, "Share the video for review")."""
import argparse, os, pathlib, re, subprocess, tempfile
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('video')
ap.add_argument('--mb', type=float, default=15, help='the most the copy may weigh, in MB (default 15)')
ap.add_argument('--height', type=int, default=720)
ap.add_argument('--out', help='default: <name>.review.mp4 beside the video')
A = ap.parse_args()
src = pathlib.Path(A.video)
out = pathlib.Path(A.out) if A.out else src.with_name(src.stem + '.review.mp4')
info = subprocess.run([FF, '-i', str(src)], capture_output=True, text=True).stderr
h, m, s = re.search(r'Duration: (\d+):(\d+):([\d.]+)', info).groups()
dur = int(h) * 3600 + int(m) * 60 + float(s)
audio, kbps = 96, A.mb * 8000 * 0.97 / dur  # 3% for the container
for attempt in range(3):
    video = int(kbps - audio)
    with tempfile.TemporaryDirectory() as tmp:
        x264 = [FF, '-y', '-loglevel', 'error', '-i', str(src), '-vf', 'scale=-2:%d:flags=lanczos' % A.height, '-c:v', 'libx264',
                '-preset', 'slow', '-aq-mode', '3', '-b:v', '%dk' % video, '-passlogfile', os.path.join(tmp, 'pass')]
        subprocess.run(x264 + ['-pass', '1', '-an', '-f', 'mp4', os.devnull], check=True)
        subprocess.run(x264 + ['-pass', '2', '-c:a', 'aac', '-b:a', '%dk' % audio, '-movflags', '+faststart', str(out)], check=True)
    size = out.stat().st_size
    if size <= A.mb * 1e6:
        break
    kbps *= A.mb * 1e6 / size * 0.97  # rarely needed: two passes land within a few per cent
else:
    raise SystemExit('%s is %.1f MB, over %g MB: try a lower --height' % (out, size / 1e6, A.mb))
print('wrote %s: %.1f MB, %dp, video at %d kb/s' % (out, size / 1e6, A.height, video))
