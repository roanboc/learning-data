"""The site's player keeps up: python tools/check.py runs it, in every film drawn in this series' watercolour (master data's
check.py, data governance's check.py).
The site's player draws the film live, in the visitor's browser, so what each moment costs there is what the visitor waits for.
The governance films froze again and again on a laptop (5 November 2026): the player painted each place while the film played,
a tenth of a second to half a second each, several times that on a phone, and kept every canvas it made, past a gigabyte in one
viewing. Now tools/publish.py draws the places as pictures, and the player shows them, keeps only what it uses, and washes people
in fewer layers (wash.js, people.js). This opens the film as the player draws it (the render page, with window.__RENDER__ false),
shows each place as its picture, as the site's player does, and draws the film through:
- at four moments a second, 1118 px wide (a laptop's window): nothing painted while the film plays takes longer than PAINT_LIMIT
  (a place painted outside WC_PLACES takes a tenth of a second or more: list it there, and publish.py draws it as a picture),
  nine moments in ten take at most TYPICAL_LIMIT and none longer than FRAME_LIMIT, what the player keeps stays within its budget
  (WC_KEEP, with room for what one moment uses), and it makes at most CANVAS_LIMIT new canvases a moment on average;
- then with the processor slowed four times, as on a phone, 559 px wide (the size the player falls back to on a slow device),
  a moment every two seconds: none takes longer than SLOW_LIMIT, so nothing holds the page for long.
The limits leave room for a slower machine than the one that drew the films (a browser with no graphics card, as the checks run,
draws several times slower than a laptop's); the times are printed, film by film, to compare."""

PAINT_LIMIT = 0.1     # seconds for anything painted once and kept while the film plays (a card, a sheet: a few hundredths)
TYPICAL_LIMIT = 0.1   # seconds that nine moments in ten take at most at 1118 px (the films: 0.02 to 0.04 s)
FRAME_LIMIT = 0.5     # seconds for the slowest moment at 1118 px (the films: about 0.1 s)
SLOW_LIMIT = 0.5      # seconds for one moment at 559 px with the processor slowed four times (the films: about 0.2 s)
CANVAS_LIMIT = 0.5    # new canvases a moment, on average: a film that makes one each moment fills the memory again
STEP, WIDTH, SLOW_STEP, SLOW_WIDTH = 0.25, 1118, 2.0, 559

# window.__RENDER__ stays false whatever the render page sets, so the film draws as the site's player draws it
INIT = "Object.defineProperty(window,'__RENDER__',{get:()=>false,set:()=>{},configurable:false});"

PASS = """async ({ step, width, half }) => {
  await FILM.ready; if (!WC.ready) await wc_prepSoft();
  const fn = typeof gv_place === 'function' ? 'gv_place' : 'wc_place', ks = typeof WC_PLACES !== 'undefined' ? Object.keys(WC_PLACES) : [];
  for (const k of ks) { const c = window[fn](k); WC_PICS.pic[k] = c; if (WC.bg['place:' + k] === c) { delete WC.bg['place:' + k]; WC_PX.bg -= c.width * c.height; } }
  const ce = document.createElement.bind(document); let made = 0;
  document.createElement = function (t) { if (String(t).toLowerCase() === 'canvas') made++; return ce(t); };
  const kept = wc_kept, painted = []; let now = 0;
  window.wc_kept = function (key, w, h) { if (WC.bg[key]) return kept.apply(this, arguments); const a = performance.now(), c = kept.apply(this, arguments);
    painted.push([key, (w || W) * (h || H) >= half, +((performance.now() - a) / 1000).toFixed(3), +now.toFixed(2)]); return c; };
  const cv = ce('canvas'); cv.width = width; cv.height = Math.round(width * 9 / 16); const x = cv.getContext('2d'), times = [];
  try { for (now = 0.05; now < TL.total; now += step) { const a = performance.now(); x.setTransform(1, 0, 0, 1, 0, 0); renderFrame(x, width / W, now); x.getImageData(0, 0, 1, 1);
      times.push([+((performance.now() - a) / 1000).toFixed(3), +now.toFixed(2), SCENES[sceneIndex(now)].id]); } }
  finally { window.wc_kept = kept; document.createElement = ce; }
  const over = Object.keys(WC_KEEP).filter(k => WC_PX[k] > WC_KEEP[k] * 1.5).map(k => [k, Math.round(WC_PX[k] / 1e6), Math.round(WC_KEEP[k] / 1e6)]);
  return { times, painted, made, over, places: ks.length, tooth: !!WC.tooth }; }"""

SLOW = """async ({ step, width }) => { const cv = document.createElement('canvas'); cv.width = width; cv.height = Math.round(width * 9 / 16); const x = cv.getContext('2d'), times = [];
  for (let t = 0.05; t < TL.total; t += step) { const a = performance.now(); x.setTransform(1, 0, 0, 1, 0, 0); renderFrame(x, width / W, t); x.getImageData(0, 0, 1, 1);
    times.push([+((performance.now() - a) / 1000).toFixed(3), +t.toFixed(2), SCENES[sceneIndex(t)].id]); }
  return times; }"""


def spread(times):
    s = sorted(t for t, *_ in times)
    return 'median %.3f s, 9 in 10 under %.3f s, slowest %.3f s' % (s[len(s) // 2], s[int(len(s) * 0.9)], s[-1]) if s else 'no moments'


def check(p, render_html):
    """(summary, faults) for the film at render_html (its dist/render.html), drawn as the site's player draws it"""
    b = p.chromium.launch(args=["--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1280, "height": 800})
    pg.add_init_script(INIT)
    pg.goto(render_html.as_uri())
    pg.wait_for_function("window.FILM&&typeof TL!=='undefined'", timeout=120000)
    r = pg.evaluate(PASS, {"step": STEP, "width": WIDTH, "half": 1920 * 1080 / 2})
    cdp = pg.context.new_cdp_session(pg)
    cdp.send('Emulation.setCPUThrottlingRate', {'rate': 4})
    slow = pg.evaluate(SLOW, {"step": SLOW_STEP, "width": SLOW_WIDTH})
    cdp.send('Emulation.setCPUThrottlingRate', {'rate': 1})
    b.close()
    faults, n = [], len(r['times'])
    if not r['tooth']:
        faults.append('the player has no paint texture (WC.tooth), so it washes people the video\'s way, which costs a third more')
    for key, big, s, at in r['painted']:
        if s > PAINT_LIMIT:
            faults.append('%.2f s: %s took %.2f s to paint while the film plays (at most %.2f): %s' % (at, key, s, PAINT_LIMIT,
                          'list it in WC_PLACES, so tools/publish.py draws it as a picture' if big else 'make it lighter, or a place in WC_PLACES'))
    ts = sorted(t for t, *_ in r['times'])
    if ts and ts[int(len(ts) * 0.9)] > TYPICAL_LIMIT:
        faults.append('one moment in ten takes more than %.2f s to draw at %d px (at most %.2f): the film draws too much each moment'
                      % (ts[int(len(ts) * 0.9)], WIDTH, TYPICAL_LIMIT))
    for s, at, sc in sorted(r['times'], reverse=True):
        if s <= FRAME_LIMIT:
            break
        faults.append('%.2f s (%s): the moment took %.2f s to draw at %d px (at most %.2f)' % (at, sc, s, WIDTH, FRAME_LIMIT))
    for s, at, sc in sorted(slow, reverse=True):
        if s <= SLOW_LIMIT:
            break
        faults.append('%.2f s (%s): with the processor slowed four times, the moment took %.2f s at %d px (at most %.2f)' % (at, sc, s, SLOW_WIDTH, SLOW_LIMIT))
    for kind, mb, keep in r['over']:
        faults.append('the player keeps %d million pixels of %s, past its budget of %d million (WC_KEEP): something it keeps is never let go' % (mb, kind, keep))
    if n and r['made'] / n > CANVAS_LIMIT:
        faults.append('the player made %d canvases in %d moments (at most %.2f a moment): something makes a new canvas as it draws, '
                      'and the memory fills; keep and reuse it (wc_buf, wc_bufAt)' % (r['made'], n, CANVAS_LIMIT))
    summary = ('as the site\'s player draws it (%d places as pictures), %d moments at %d px: %s; %d canvases made; '
               'slowed four times at %d px: %s' % (r['places'], n, WIDTH, spread(r['times']), r['made'], SLOW_WIDTH, spread(slow)))
    return summary, faults


if __name__ == '__main__':
    from lang import DIST
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        s, f = check(p, DIST / 'render.html')
    print(s)
    for l in f:
        print('  ' + l)
    if f:
        raise SystemExit('%d faults in how the player keeps up' % len(f))
    print('the player keeps up')
