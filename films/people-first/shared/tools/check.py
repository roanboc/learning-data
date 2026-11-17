"""Check the film before a long render: python tools/check.py
First From words to data's checks, unchanged: every moment draws, 30 a second, as the video does (check.py there), and no text is
drawn smaller than 28 px after the camera's zoom, the smallest that reads on a phone (legible.py there). Then, as in the agent
films: each place the film paints (AG_PLACES), painted again from nothing, leaves the page drawing again within LIMIT seconds,
since the site's player paints the places one by one while the film plays. Then the governance films' checks that nothing shows
twice where the film changes shot or chapter (films/data-governance/shared/tools/twice.py) and that nothing jumps there (jump.py),
which follow the kit's people too (people.watch). Last, the kit's own check on the people (people.py, here): nobody a half-figure,
out of scale, in a row, waving a hand about, jumping from one pose to the next, under a box of words or frozen."""
import jump, people, runpy, twice
from lang import *
from run import FW
from playwright.sync_api import sync_playwright

LIMIT = 2.0  # seconds from a place's first stroke until two frames after it

failed = []
for tool in ('check.py', 'legible.py'):
    try:  # twice.py runs below, with the people followed, so From words to data's check.py leaves it (TWICE)
        runpy.run_path(str(FW / tool), init_globals={'TWICE': False}, run_name='__main__')
    except SystemExit as e:
        if e.code:
            failed.append(str(e.code))

with sync_playwright() as p:
    b, pg = render_page(p)
    r = pg.evaluate("""async () => {
      const frame = () => new Promise(f => requestAnimationFrame(() => f()));
      const ks = Object.keys(AG_PLACES), out = [];
      const c = document.createElement('canvas'); c.width = 480; c.height = 270; document.body.appendChild(c); const x = c.getContext('2d');
      for (const k of ks) { delete AG_KEPT['place:' + k]; await frame(); await frame();
        const a = performance.now(); x.drawImage(ag_place(k), 0, 0, 480, 270); await frame(); await frame();
        out.push([k, (performance.now() - a) / 1000]); }
      return out; }""")
    people.watch(pg)  # from here on the checks below follow everyone the kit draws
    tw = twice.check(pg)
    jp = jump.check(pg)
    pe = people.check(pg)
    b.close()
slow = [(k, s) for k, s in r if s > LIMIT]
print('painted %d places, each in %s s' % (len(r), ' '.join('%s %.2f' % (k, s) for k, s in r)) if r else 'no places to paint')
for k, s in slow:
    print('  %-12s held the page for %.1f s (at most %.1f)' % (k, s, LIMIT))
if slow:
    failed.append('%s held the page too long while painting' % ', '.join(k for k, s in slow))
else:
    print('every place paints without holding the page')
for (head, lines), bad, good in ((tw, '%d changes of shot or chapter show something twice', 'nothing shows twice where the film changes shot or chapter'),
                                 (jp, '%d moments jump where the film changes shot or chapter', 'nothing jumps where the film changes shot or chapter'),
                                 (pe, '%d things about the people to put right', 'the people stand whole, in scale and at ease; nobody jumps, waves a hand about or stays frozen')):
    print(head)
    for l in lines:
        print('  ' + l)
    if lines:
        failed.append(bad % len(lines))
    else:
        print(good)
if failed:
    raise SystemExit('; '.join(failed))
