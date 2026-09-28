"""Copy the film into the site: python tools/publish.py
The player (dist/film.js) and the soundtrack (dist/soundtrack.mp3) go to site/assets/<key>/, and the poster,
drawn at the moment film.json names ("poster": [chapter, cue, seconds after it]) without captions, goes to
site/assets/<key>-poster.jpg at 1280×720. Never edit the site's copies by hand: the release workflow checks that
the site's film.js is byte for byte the one this source builds."""
import base64, io, shutil
from lang import *
from playwright.sync_api import sync_playwright

dst = REPO / 'site' / 'assets' / META['key']
dst.mkdir(parents=True, exist_ok=True)
shutil.copyfile(DIST / 'film.js', dst / 'film.js')
if (DIST / 'soundtrack.mp3').exists():
    shutil.copyfile(DIST / 'soundtrack.mp3', dst / 'soundtrack.mp3')
else:
    print('no dist/soundtrack.mp3 yet: run tools/audio.py first')
sid, cid, off = META['poster']
with sync_playwright() as p:
    b, pg = render_page(p)
    info = pg.evaluate("filmInfo()")
    s = next(x for x in info['scenes'] if x['id'] == sid)
    t = s['start'] + s['cues'][cid] + off
    pg.evaluate("CAPS_ON=false")
    d = pg.evaluate("""(t)=>{const c=document.createElement('canvas');c.width=1280;c.height=720;renderFrame(c.getContext('2d'),1280/1920,t);return c.toDataURL('image/jpeg',0.88);}""", t)
    b.close()
(REPO / 'site' / 'assets' / (META['key'] + '-poster.jpg')).write_bytes(base64.b64decode(d[23:]))
print('copied film.js and soundtrack.mp3 to site/assets/%s/, and drew the poster at %.1f s' % (META['key'], t))
