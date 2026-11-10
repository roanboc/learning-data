"""Draw the site's poster from the film itself: python tools/poster.py (or FILM_LANG=es python tools/poster.py).
The poster is the home page's background and the player's first frame: the whole platform from "The layers together", with
every part shown, seen from afar, as the film's end and the labs' map draw it. It's drawn without captions at 1280x720 from
dist/render.html (run tools/build.py first), so it always matches the film, and writes site/assets/poster.jpg (poster.es.jpg in
Spanish). Seen from afar the platform is a picture, not something to read, so it keeps the sizes it was drawn at: the phone
layer acts only on the film's own frame (src/phonefit.js)."""
import base64
from lang import *
from playwright.sync_api import sync_playwright

CAM = dict(x=1125, y=532, z=0.869)
REPO = ROOT.parents[2]
JS = """(cam)=>{const c=document.createElement('canvas');c.width=1280;c.height=720;const x=c.getContext('2d'),S=1280/1920;
  const L=SCENES.find(s=>s.id==="layers"),done={};L.vo.forEach(v=>done[v.id]=-100);
  x.save();L.draw(x,S,50,Object.assign({},L,{cues:done,_cam:cam}));x.restore();return c.toDataURL('image/jpeg',0.9);}"""
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page()
    pg.goto((DIST / 'render.html').as_uri()); pg.wait_for_function("window.__READY__===true", timeout=120000)
    d = pg.evaluate(JS, CAM)
    b.close()
out = REPO / 'site' / 'assets' / ('poster.jpg' if EN else 'poster.%s.jpg' % LANG)
out.write_bytes(base64.b64decode(d[23:]))
print('drew', out.relative_to(REPO))
