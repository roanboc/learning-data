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
pictures changed, since dist/ is not in git and can hold a soundtrack older than the site's.
A film drawn in the master data series' watercolour (its places in WC_PLACES) also gets each place it shows as a picture, and
anything else it keeps (wc_kept) at the frame's size or larger, such as a place at twice the size for close-ups, or that takes
SLOW_PAINT or longer to paint, painted here as the video paints them, in site/assets/<key>/places/, with places.json: the player
they were drawn from, and when the film shows each one, found by playing the film through at four moments a second. The site's
player shows those pictures instead of painting them while the film plays (wash.js), and site-tools/check_site.py fails pictures
drawn from any other player."""
import base64, hashlib, json, re, shutil, sys
from lang import *
from playwright.sync_api import sync_playwright

KEEP_SOUND = '--keep-sound' in sys.argv


STEP = 0.25        # seconds between the moments at which the film is played through, to find when it shows each picture
SLOW_PAINT = 0.05  # seconds: a kept picture that takes this long to paint here is drawn as a picture too (smooth.py, the same)
# Paints every place (WC_PLACES) as the video does, then plays the film through at a tenth of its size, a moment every STEP seconds,
# with the people and the paper left out (they never paint a place), noting each picture the film keeps (wc_kept) that each moment
# shows. Then paints again, with the people in, each kept picture the size of the frame or larger (such as a place at twice the size
# for close-ups) and each that takes SLOW_PAINT or longer (an open binder, a sketch). Returns {what wc_kept calls it: [the picture as
# a WebP data URL, [the moments], [width, height]]}: the places, and those other pictures.
PLACES_JS = """async ({ step, slow }) => {
  const fn = typeof gv_place === 'function' ? 'gv_place' : 'wc_place', out = {}, seen = {}, size = {}, paint = {}, big = W * H;
  for (const k of Object.keys(WC_PLACES)) { const key = 'place:' + k, c = window[fn](k); out[key] = c.toDataURL('image/webp', 0.8); size[key] = [c.width, c.height];
    await new Promise(r => setTimeout(r, 0)); }
  let now = null; const keep = { outlined: window.outlined, wc_paperOver: window.wc_paperOver, wc_kept: window.wc_kept };
  window.wc_kept = function (key, w, h, p) { if (now) now.add(key); if (!(key in out) && !(key in paint)) { paint[key] = p; size[key] = [w || W, h || H]; }
    return keep.wc_kept.apply(this, arguments); };
  window.outlined = function () {}; window.wc_paperOver = function (ctx, S) { setScreen(ctx, S); };
  try { const c = document.createElement('canvas'); c.width = 192; c.height = 108; const x = c.getContext('2d');
    for (let t = 0; t < TL.total; t += step) { now = new Set(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
      renderFrame(x, 0.1, t); for (const k of now) (seen[k] = seen[k] || []).push(+t.toFixed(2)); } }
  finally { Object.assign(window, keep); now = null; }
  for (const key in paint) { const [w, h] = size[key], c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), a = performance.now();
    paint[key](x); x.getImageData(0, 0, 1, 1); if (w * h >= big || performance.now() - a >= slow * 1000) out[key] = c.toDataURL('image/webp', 0.8);
    await new Promise(r => setTimeout(r, 0)); }
  const r = {}; for (const k in out) r[k] = [out[k], seen[k] || [], size[k]]; return r; }"""


def spans(ts):
    """the moments a place shows, as [from, to] spans, each widened by a step on both sides (it may show between two moments)"""
    out = []
    for t in ts:
        if out and t - out[-1][1] <= STEP * 1.5:
            out[-1][1] = t
        else:
            out.append([t, t])
    return [[round(max(0, a - STEP), 2), round(b + STEP, 2)] for a, b in out]


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
    places = pg.evaluate(PLACES_JS, {'step': STEP, 'slow': SLOW_PAINT}) if pg.evaluate("typeof WC_PLACES!=='undefined'&&typeof wc_pic==='function'") else None
    b.close()
player = hashlib.sha256((dst / 'film.js').read_bytes()).hexdigest()[:16]
pics = dst / 'places'
if places:
    pics.mkdir(exist_ok=True)
    names, listed, unseen = {}, {}, []
    for k, (url, seen, (w, h)) in places.items():
        if not seen:
            unseen.append(k[6:] if k.startswith('place:') else k)
            continue
        f = re.sub(r'[^A-Za-z0-9_-]', '_', k[6:] if k.startswith('place:') else k) + '.webp'
        if f.lower() in names:
            raise SystemExit('%s and %s would share the picture %s; rename one' % (names[f.lower()], k, f))
        names[f.lower()] = k
        (pics / f).write_bytes(base64.b64decode(url.split(',', 1)[1]))
        listed[k] = {'file': f, 'w': w, 'h': h, 'shows': spans(seen)}
    for old in pics.iterdir():
        if old.name != 'places.json' and old.name.lower() not in names:
            old.unlink()
    order = sorted(listed, key=lambda k: listed[k]['shows'][0][0])
    (pics / 'places.json').write_text(json.dumps({'player': player, 'note': 'Drawn by tools/publish.py: each place of the film, and anything '
        'else it keeps at the frame\'s size or larger or that is slow to paint, as a picture, by what wc_kept calls it, with its size and '
        'when the film shows it ([from, to] in seconds). The site\'s player shows these instead of painting them.',
        'places': {k: listed[k] for k in order}}, indent=1) + '\n')
    kb = sum((pics / listed[k]['file']).stat().st_size for k in listed) / 1024
    copied.append('%d places as pictures (%.0f KB)' % (len(listed), kb))
    if unseen:
        print('left out these places, which the film never shows (painted inside another picture, or not used):', ', '.join(unseen))
elif pics.exists():
    shutil.rmtree(pics)
note = 'Drawn by tools/publish.py from the player %s at %s/%s%+g (%.2f s)' % (player, sid, cid, off, t)
(REPO / 'site' / 'assets' / (META['key'] + '-poster.jpg')).write_bytes(stamp(base64.b64decode(d[23:]), note))
print('copied %s to site/assets/%s/, and drew the poster at %.1f s from the player %s' % (', '.join(copied), META['key'], t, player))
