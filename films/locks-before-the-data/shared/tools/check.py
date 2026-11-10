"""Check the film before a long render: python tools/check.py
First From words to data's checks, unchanged: every moment draws, 30 a second, as the video does (check.py there), and no text is
drawn smaller than 28 px after the camera's zoom, the smallest that reads on a phone (legible.py there). Then the module's own: every
word stands out at least 4.5 to 1 from what is behind it (contrast.py, here); each place the film paints (AG_PLACES) and its frost,
painted again from nothing, leaves the page drawing again within LIMIT seconds; and each person the film lists in DP_PEOPLE, painted
again in their light, picture by picture, within PERSON seconds each (the quickest of TRIES paints, so a busy machine doesn't fail it). The site's player makes these one at a time while the film
plays, so a picture that keeps the browser busy holds up the film, its soundtrack and the whole page; a phone is about four times
slower than the machine that checks. Last, the governance films' checks that nothing shows twice where the film changes shot or
chapter (films/data-governance/shared/tools/twice.py), that nobody's arm jumps in one frame (steady.py there) and that nothing jumps
where the film changes shot or chapter (jump.py there), and the agent films' check that nothing painted for a person reaches past the
edge of their picture, where it would be cut off in a straight line (edges.py, in films/what-an-agent-is/shared/tools/)."""
import edges, jump, runpy, steady, twice
from lang import *
from run import FW, HERE
from playwright.sync_api import sync_playwright

LIMIT = 2.0    # seconds from a place's first stroke until two frames after it
PERSON = 0.12  # seconds for each picture of a person in their light (a head, or a body): on a phone, about half a second
TRIES = 3      # each picture of a person is painted this many times, and the quickest counts

failed = []
for f in (FW / 'check.py', FW / 'legible.py', HERE / 'contrast.py'):
    try:  # twice.py runs below, with this check's own, so From words to data's check.py leaves it (TWICE)
        runpy.run_path(str(f), init_globals={'TWICE': False}, run_name='__main__')
    except SystemExit as e:
        if e.code:
            failed.append(str(e.code))

with sync_playwright() as p:
    b, pg = render_page(p)
    edges.watch(pg)  # from here on each person's pictures are made again as the checks draw them, and edges.check looks at them
    r = pg.evaluate("""async (TRIES) => {
      const frame = () => new Promise(f => requestAnimationFrame(() => f()));
      const c = document.createElement('canvas'); c.width = 480; c.height = 270; document.body.appendChild(c); const x = c.getContext('2d');
      const time = async (k, f) => { await frame(); await frame(); const a = performance.now(); f(); await frame(); await frame(); return [k, (performance.now() - a) / 1000]; };
      const places = [], people = [];
      for (const k of Object.keys(AG_PLACES)) { delete AG_KEPT['place:' + k];
        places.push(await time(k, () => x.drawImage(ag_place(k), 0, 0, 480, 270)));
        DP_FROSTED.delete(ag_place(k)); places.push(await time(k + ' frost', () => x.drawImage(dp_frostPlace(k), 0, 0, 480, 270))); }
      // each picture of a person is painted three times from nothing, and the quickest counts: one paint can take half as long again
      // when the machine is busy with something else (film 17's thread measured 0.08 to 0.13 s for the same body), and the best of three
      // measures the paint, not the machine. A body is timed alone: its head is made first, untimed
      for (const q of DP_PEOPLE) { const [who, light] = Array.isArray(q) ? q : [q], N = dp_night(who, light);
        const st = dp_prepSteps(who, light), what = ['head', 'body', 'body holding'];
        for (let i = 0; i < st.length; i++) { let best = Infinity;
          for (let k = 0; k < TRIES; k++) { delete AG_PEOPLE[N.key]; if (i) ag_fig(N); best = Math.min(best, (await time('', st[i]))[1]); }
          people.push([N.key + ' ' + what[i], best]); } }
      return {places, people}; }""", TRIES)
    tw = twice.check(pg)
    st = steady.check(pg)
    jp = jump.check(pg)
    ed = edges.check(pg)
    b.close()
for kind, rows, lim in (('places', r['places'], LIMIT), ('pictures of people', r['people'], PERSON)):
    slow = [(k, s) for k, s in rows if s > lim]
    print('painted %d %s, each in %s s' % (len(rows), kind, ' '.join('%s %.2f' % (k, s) for k, s in rows)) if rows else 'no %s to paint' % kind)
    for k, s in slow:
        print('  %-24s held the page for %.2f s (at most %.2f)' % (k, s, lim))
    if slow:
        failed.append('%s held the page too long while painting' % ', '.join(k for k, s in slow))
    elif rows:
        print('every one of them paints without holding the page')
for (msg, lines), fault, fine in ((tw, 'changes of shot or chapter show something twice', 'nothing shows twice where the film changes shot or chapter'),
                                  (st, 'arms jump in one frame', 'no arm jumps in one frame'),
                                  (jp, 'moments jump where the film changes shot or chapter', 'nothing jumps where the film changes shot or chapter'),
                                  (ed, "people's pictures that cut off what is painted past their edge", "nothing painted for a person reaches past their picture's edge")):
    print(msg)
    for l in lines:
        print('  ' + l)
    if lines:
        failed.append('%d %s' % (len(lines), fault))
    else:
        print(fine)
if failed:
    raise SystemExit('; '.join(failed))
