"""Check the film before a long render: python tools/check.py
First From words to data's check, unchanged: every moment draws, 30 a second, as the video does. Then one of this series' own:
each place the film paints, painted again from nothing, leaves the page drawing again within LIMIT seconds. The site's player
paints the places one by one while the film plays, so a place that keeps the browser busy for seconds holds up the film, its
soundtrack and the whole page. A blur set before many strokes of a full-size picture (the browser blurs every stroke) once held
the page for seven seconds; paint such a picture sharp on a layer and blur the layer once."""
import runpy
from lang import *
from run import FW
from playwright.sync_api import sync_playwright

LIMIT = 2.0  # seconds from a place's first stroke until two frames after it; Off the shelf's 19 places take 0.1 to 0.4

failed = []
try:
    runpy.run_path(str(FW / 'check.py'), run_name='__main__')
except SystemExit as e:
    if e.code:
        failed.append(str(e.code))

with sync_playwright() as p:
    b, pg = render_page(p)
    r = pg.evaluate("""async () => {
      const frame = () => new Promise(f => requestAnimationFrame(() => f()));
      const ks = typeof WC_PLACES !== 'undefined' ? Object.keys(WC_PLACES) : [], out = [];
      const c = document.createElement('canvas'); c.width = 480; c.height = 270; document.body.appendChild(c); const x = c.getContext('2d');
      for (const k of ks) { delete WC.bg['place:' + k]; await frame(); await frame();
        const a = performance.now(); x.drawImage(gv_place(k), 0, 0, 480, 270); await frame(); await frame();
        out.push([k, (performance.now() - a) / 1000]); }
      return out; }""")
    b.close()
slow = [(k, s) for k, s in r if s > LIMIT]
print('painted %d places, each in %s s' % (len(r), ' '.join('%s %.2f' % (k, s) for k, s in r)) if r else 'no places to paint')
for k, s in slow:
    print('  %-12s held the page for %.1f s (at most %.1f)' % (k, s, LIMIT))
if slow:
    failed.append('%s held the page too long while painting' % ', '.join(k for k, s in slow))
else:
    print('every place paints without holding the page')
if failed:
    raise SystemExit('; '.join(failed))
