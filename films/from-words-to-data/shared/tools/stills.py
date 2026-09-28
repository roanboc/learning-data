"""Render stills for review: python tools/stills.py [chapter ...] [--at SECONDS ...] [--every N] [--size 960]
By default, one still a second after every narration cue and one at each chapter's wordless ending ("breath"), for the
chapters named (or all of them), into build/stills/<chapter>_<cue>.jpg, with captions on. --at renders those seconds of the film
instead, and --every N renders one still every N seconds of each chapter named."""
import argparse, base64
from lang import *
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('chapters', nargs='*')
ap.add_argument('--at', type=float, nargs='*', default=None)
ap.add_argument('--every', type=float, default=None)
ap.add_argument('--size', type=int, default=960)
ap.add_argument('--nocaps', action='store_true')
A = ap.parse_args()
out = BUILD / 'stills'; out.mkdir(exist_ok=True)
with sync_playwright() as p:
    b, pg = render_page(p)
    info = pg.evaluate("filmInfo()")
    # the video has no captions on its picture, but the site's player shows them: review with them on, unless --nocaps
    pg.evaluate("CAPS_ON=%s" % ('false' if A.nocaps else 'true'))
    shots = []
    if A.at:
        shots = [('t%06.1f' % t, t) for t in A.at]
    else:
        for s in info['scenes']:
            if A.chapters and s['id'] not in A.chapters:
                continue
            if A.every:
                k = 0; t = 0.3
                while t < s['dur']:
                    shots.append(('%s_%03d' % (s['id'], k), s['start'] + t)); t += A.every; k += 1
                continue
            for cid, t in sorted(s['cues'].items(), key=lambda kv: kv[1]):
                shots.append(('%s_%s' % (s['id'], cid), s['start'] + t + (1.0 if cid != 'breath' else min(1.5, max(0.2, s['breathe'] - 0.5)))))
    pg.evaluate("""(w)=>{window.__SC=document.createElement('canvas');__SC.width=w;__SC.height=Math.round(w*9/16);}""", A.size)
    for name, t in shots:
        d = pg.evaluate("(t)=>{const x=__SC.getContext('2d');renderFrame(x,__SC.width/1920,t);return __SC.toDataURL('image/jpeg',0.85);}", t)
        (out / (name + '.jpg')).write_bytes(base64.b64decode(d[23:]))
    b.close()
print('wrote', len(shots), 'stills to build/stills/')
