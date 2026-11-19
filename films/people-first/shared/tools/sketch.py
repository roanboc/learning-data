"""Draw a style frame with the people kit, before a film exists: python sketch.py draft.js out.png [--scale 2] [--t 0,1.5,3]
draft.js defines function draft(ctx, t), drawing one 1920 by 1080 frame with the kit's calls (PK.person, PK.card and the rest: the
shared README says what each does) and the agent films' camera and places (kit.js); it may return something to print. The page loads
the same helpers and fonts as a film, and prints how long the drawing took and any error. Use it to try a composition, a person, a pose
or a new place at full size before it goes into a film's scenes. Run it from anywhere; it needs no film.json.
  python films/people-first/shared/tools/sketch.py my-draft.js build/draft.png
--scale 2 saves the frame at 3840 by 2160, for a picture someone else will look at.
--t 0,1.5,3 draws the frame at each of those times: out-0.png, out-1.5.png, out-3.png.
--look tint (or soft, paper) draws it in another look than the default, ink line."""
import base64, pathlib, re, sys
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
PKS = HERE.parent / 'src'
FILMS = HERE.parents[2]
SS = FILMS / 'inner-life-of-data' / 'source'
AGS = FILMS / 'what-an-agent-is' / 'shared' / 'src'
KIT = ('core.js', 'people.js', 'things.js', 'words.js', 'places.js', 'kalam.js', 'hand.js', 'concepts.js', 'talk.js', 'sketch.js')
opt = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
skip = {i + 1 for i, a in enumerate(sys.argv) if a in ('--scale', '--t', '--look')}
args = [a for i, a in enumerate(sys.argv[1:], 1) if not a.startswith('--') and i not in skip]
if len(args) != 2:
    raise SystemExit(__doc__)
draft, out = pathlib.Path(args[0]).resolve(), pathlib.Path(args[1]).resolve()
scale = float(opt('--scale', 1.0))
times = [float(x) for x in opt('--t', '0').split(',')]
files = [SS / 'src' / f for f in ('core.js', 'style2.js', 'ui3.js')] + \
        [FILMS / 'a-sharper-sketch' / 'source' / 'src' / 'sketch3.js', AGS / 'kit.js'] + [PKS / f for f in KIT if (PKS / f).exists()] + [draft]
js = '\n'.join(f.read_text() for f in files)
fd = SS / 'fonts'
fonts = re.sub(r'url\(([\w.-]+\.woff2)\)', lambda m: 'url(data:font/woff2;base64,%s)' % base64.b64encode((fd / m.group(1)).read_bytes()).decode(),
               (fd / 'fonts.css').read_text())
page = HERE.parent / '.sketch.html'
page.write_text('<!doctype html><html><head><meta charset="utf-8"><style>%s body{margin:0;background:#000}</style></head><body>'
                '<canvas id="c" width="%d" height="%d"></canvas><script>\nconst NARR={};\n%s\n</script></body></html>' % (fonts, 1920 * scale, 1080 * scale, js))
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': 1920, 'height': 1080})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: print('console:', m.text))
        pg.goto(page.as_uri())
        pg.evaluate("""async (look) => { await Promise.all(["600 28px Manrope", "700 36px Manrope", "800 40px Manrope"]
                       .map(f => document.fonts.load(f))); await document.fonts.ready; if (look) PK.use(look); }""", opt('--look'))
        for t in times:
            r = pg.evaluate("""async ([s, t]) => { const c = document.getElementById('c'), ctx = c.getContext('2d'); ctx.setTransform(s, 0, 0, s, 0, 0);
                               const t0 = performance.now(); const info = await draft(ctx, t);
                               return {ms: performance.now() - t0, info: info === undefined ? null : info, url: c.toDataURL('image/png')}; }""", [scale, t])
            o = out if len(times) == 1 else out.with_name('%s-%g%s' % (out.stem, t, out.suffix))
            o.parent.mkdir(parents=True, exist_ok=True)
            o.write_bytes(base64.b64decode(r['url'].split(',', 1)[1]))
            print('drew %s in %d ms%s' % (o, r['ms'], '' if r['info'] is None else ': %s' % r['info']))
        b.close()
finally:
    page.unlink(missing_ok=True)
if errs:
    raise SystemExit('Errors while drawing:\n  ' + '\n  '.join(errs))
