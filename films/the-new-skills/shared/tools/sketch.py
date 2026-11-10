"""Draw a style frame with the module's look, before a film exists: python sketch.py draft.js out.png [--scale 2]
draft.js defines function draft(ctx), drawing one 1920 by 1080 frame with the module's calls (look.js, people.js, cards.js, things.js,
section.js, and the agent films' kit, people and agent; the shared README says what each does); it may return something to print. The
page loads the same helpers, fonts and logos as a film that says "logos": true, paints each place on first use, and prints how long the
drawing took and any error. Use it to try a composition, a person or a new picture at full size before it goes into a film's scenes.
Run it from anywhere; it needs no film.json.
  python films/the-new-skills/shared/tools/sketch.py my-draft.js build/draft.png
--scale 2 saves the frame at 3840 by 2160, for a picture someone else will look at."""
import base64, pathlib, re, sys
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
LPS = HERE.parent / 'src'
FILMS = HERE.parents[2]
SS = FILMS / 'inner-life-of-data' / 'source'
AGS = FILMS / 'what-an-agent-is' / 'shared' / 'src'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
if len(args) != 2:
    raise SystemExit(__doc__)
draft, out = pathlib.Path(args[0]).resolve(), pathlib.Path(args[1]).resolve()
scale = float(sys.argv[sys.argv.index('--scale') + 1]) if '--scale' in sys.argv else 1.0
files = [SS / 'src' / f for f in ('core.js', 'logos.js', 'style2.js', 'ui3.js')] + \
        [FILMS / 'a-sharper-sketch' / 'source' / 'src' / 'sketch3.js'] + [AGS / f for f in ('kit.js', 'people.js', 'agent.js')] + \
        [LPS / f for f in ('look.js', 'people.js', 'cards.js', 'things.js', 'section.js')] + [draft]
js = '\n'.join(f.read_text() for f in files)
fd = SS / 'fonts'
fonts = re.sub(r'url\(([\w.-]+\.woff2)\)', lambda m: 'url(data:font/woff2;base64,%s)' % base64.b64encode((fd / m.group(1)).read_bytes()).decode(),
               (fd / 'fonts.css').read_text())
page = HERE.parent / '.sketch.html'
page.write_text('<!doctype html><html><head><meta charset="utf-8"><style>%s body{margin:0;background:#000}</style></head><body>'
                '<canvas id="c" width="%d" height="%d"></canvas><script>\n%s\n</script></body></html>' % (fonts, 1920 * scale, 1080 * scale, js))
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': 1920, 'height': 1080})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: print('console:', m.text))
        pg.goto(page.as_uri())
        pg.evaluate("""async () => { await Promise.all(["600 28px Manrope", "700 36px Manrope", "800 40px Manrope", "500 28px 'IBM Plex Mono'"]
                       .map(f => document.fonts.load(f))); await document.fonts.ready; await loadLogos(); }""")
        r = pg.evaluate("""async (s) => { const c = document.getElementById('c'), ctx = c.getContext('2d'); ctx.scale(s, s);
                           const t0 = performance.now(); const info = await draft(ctx);
                           return {ms: performance.now() - t0, info: info === undefined ? null : info, url: c.toDataURL('image/png')}; }""", scale)
        b.close()
finally:
    page.unlink(missing_ok=True)
out.parent.mkdir(parents=True, exist_ok=True)
out.write_bytes(base64.b64decode(r['url'].split(',', 1)[1]))
print('drew %s in %d ms%s' % (out, r['ms'], '' if r['info'] is None else ': %s' % r['info']))
if errs:
    raise SystemExit('Errors while drawing:\n  ' + '\n  '.join(errs))
