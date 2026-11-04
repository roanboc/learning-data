"""Copy the film into the site: python tools/publish.py [--keep-sound]
The player (dist/film.js), the soundtrack (dist/soundtrack.mp3) and the Spanish captions (src/i18n/es/captions.js,
as captions.es.js, which the Spanish page loads before the film) go to site/assets/<key>/, and the poster,
drawn at the moment film.json names ("poster": [chapter, cue, seconds after it]) without captions, goes to
site/assets/<key>-poster.jpg at 1280×720. Never edit the site's copies by hand: the release workflow checks that
the site's film.js is byte for byte the one this source builds, and site-tools/check_site.py that the poster was drawn
from that same film.js. This writes the proof into the poster: a comment in the JPEG (which viewers ignore) naming the
player it was drawn from and the moment. A player rebuilt without its poster, such as after a fix in a series' shared code,
then fails the site's checks instead of leaving the old picture on the film's page and cards.
--keep-sound copies the player, the captions and the poster, and leaves the site's soundtrack as it is: use it when only the
pictures changed, since dist/ is not in git and can hold a soundtrack older than the site's."""
import base64, hashlib, shutil, sys
from lang import *
from playwright.sync_api import sync_playwright

KEEP_SOUND = '--keep-sound' in sys.argv


def stamp(jpg, text):
    """the JPEG with a comment (a COM segment) after its JFIF or Exif header; site-tools/check_site.py reads it"""
    if jpg[:2] != b'\xff\xd8':
        raise SystemExit('the poster is not a JPEG')
    i = 2
    while jpg[i] == 0xFF and jpg[i + 1] in (0xE0, 0xE1):
        i += 2 + int.from_bytes(jpg[i + 2:i + 4], 'big')
    b = text.encode()
    return jpg[:i] + b'\xff\xfe' + (len(b) + 2).to_bytes(2, 'big') + b + jpg[i:]


dst = REPO / 'site' / 'assets' / META['key']
dst.mkdir(parents=True, exist_ok=True)
shutil.copyfile(DIST / 'film.js', dst / 'film.js')
copied = ['film.js']
if KEEP_SOUND:
    print('left the site\'s soundtrack as it is (--keep-sound)')
elif (DIST / 'soundtrack.mp3').exists():
    shutil.copyfile(DIST / 'soundtrack.mp3', dst / 'soundtrack.mp3')
    copied.append('soundtrack.mp3')
else:
    print('no dist/soundtrack.mp3 yet: run tools/audio.py first')
if (ROOT / 'src' / 'i18n' / 'es' / 'captions.js').exists():
    shutil.copyfile(ROOT / 'src' / 'i18n' / 'es' / 'captions.js', dst / 'captions.es.js')
    copied.append('captions.es.js')
else:
    print('no src/i18n/es/captions.js yet: the Spanish page needs it')
sid, cid, off = META['poster']
with sync_playwright() as p:
    b, pg = render_page(p)
    info = pg.evaluate("filmInfo()")
    s = next(x for x in info['scenes'] if x['id'] == sid)
    t = s['start'] + s['cues'][cid] + off
    pg.evaluate("CAPS_ON=false")
    d = pg.evaluate("""(t)=>{const c=document.createElement('canvas');c.width=1280;c.height=720;renderFrame(c.getContext('2d'),1280/1920,t);return c.toDataURL('image/jpeg',0.88);}""", t)
    b.close()
player = hashlib.sha256((dst / 'film.js').read_bytes()).hexdigest()[:16]
note = 'Drawn by tools/publish.py from the player %s at %s/%s%+g (%.2f s)' % (player, sid, cid, off, t)
(REPO / 'site' / 'assets' / (META['key'] + '-poster.jpg')).write_bytes(stamp(base64.b64decode(d[23:]), note))
print('copied %s to site/assets/%s/, and drew the poster at %.1f s from the player %s' % (', '.join(copied), META['key'], t, player))
