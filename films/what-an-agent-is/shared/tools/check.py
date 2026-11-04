"""Check the film before a long render: python tools/check.py
First From words to data's check, unchanged: every moment draws, 30 a second, as the video does. Then one of the module's own:
each place the film paints (AG_PLACES), painted again from nothing (with the oak and the grain it shares), leaves the page drawing
again within LIMIT seconds. The site's player paints the places one by one while the film plays, so a place that keeps the browser
busy for seconds holds up the film, its soundtrack and the whole page. Paint what is soft anyway at a lower resolution and scale it up,
as room.js does with the marble. Last, the governance films' checks that nothing shows twice where the film changes shot or chapter
(films/data-governance/shared/tools/twice.py) and that nobody's arm jumps in one frame (steady.py there)."""
import runpy, steady, twice
from lang import *
from run import FW
from playwright.sync_api import sync_playwright

LIMIT = 2.0  # seconds from a place's first stroke until two frames after it; the lab takes about half a second

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
      const ks = Object.keys(AG_PLACES), out = [];
      const c = document.createElement('canvas'); c.width = 480; c.height = 270; document.body.appendChild(c); const x = c.getContext('2d');
      for (const k of ks) { for (const q of Object.keys(AG_KEPT)) if (q === 'place:' + k || q === 'oak' || q.startsWith('grain:')) delete AG_KEPT[q];
        await frame(); await frame();
        const a = performance.now(); x.drawImage(ag_place(k), 0, 0, 480, 270); await frame(); await frame();
        out.push([k, (performance.now() - a) / 1000]); }
      return out; }""")
    tw = twice.check(pg)
    st = steady.check(pg)
    b.close()
slow = [(k, s) for k, s in r if s > LIMIT]
print('painted %d places, each in %s s' % (len(r), ' '.join('%s %.2f' % (k, s) for k, s in r)) if r else 'no places to paint')
for k, s in slow:
    print('  %-12s held the page for %.1f s (at most %.1f)' % (k, s, LIMIT))
if slow:
    failed.append('%s held the page too long while painting' % ', '.join(k for k, s in slow))
else:
    print('every place paints without holding the page')
print(tw[0])
for l in tw[1]:
    print('  ' + l)
if tw[1]:
    failed.append('%d changes of shot or chapter show something twice' % len(tw[1]))
else:
    print('nothing shows twice where the film changes shot or chapter')
print(st[0])
for l in st[1]:
    print('  ' + l)
if st[1]:
    failed.append('%d arms jump in one frame' % len(st[1]))
else:
    print('no arm jumps in one frame')
if failed:
    raise SystemExit('; '.join(failed))
