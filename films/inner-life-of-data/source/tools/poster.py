"""Draw the site's poster from the film itself: python tools/poster.py (or FILM_LANG=es python tools/poster.py).
The poster is the home page's background and the player's first frame: the whole platform, from "The layers together", drawn
without captions at 1280x720 from dist/render.html (run tools/build.py first), so it always matches the film. It writes
site/assets/poster.jpg (poster.es.jpg in Spanish). The moment is a chapter, a cue in it, and seconds after the cue."""
import base64
from lang import *
from playwright.sync_api import sync_playwright

MOMENT = ('layers', 'dbx', 2.0)
REPO = ROOT.parents[2]
sid, cid, off = MOMENT
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page()
    pg.goto((DIST / 'render.html').as_uri()); pg.wait_for_function("window.__READY__===true", timeout=120000)
    info = pg.evaluate("filmInfo()")
    s = next(x for x in info['scenes'] if x['id'] == sid)
    t = s['start'] + s['cues'][cid] + off
    pg.evaluate("CAPS_ON=false")
    d = pg.evaluate("""(t)=>{const c=document.createElement('canvas');c.width=1280;c.height=720;renderFrame(c.getContext('2d'),1280/1920,t);return c.toDataURL('image/jpeg',0.9);}""", t)
    b.close()
out = REPO / 'site' / 'assets' / ('poster.jpg' if EN else 'poster.%s.jpg' % LANG)
out.write_bytes(base64.b64decode(d[23:]))
print('drew %s at %.1f s (%s/%s %+.1f s)' % (out.relative_to(REPO), t, sid, cid, off))
