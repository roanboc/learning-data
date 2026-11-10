"""The site's player keeps up: python tools/check.py runs it, in every film drawn in this series' watercolour (master data's
check.py, data governance's check.py).
The site's player draws the film live, in the visitor's browser, so what each moment costs there is what the visitor waits for.
The governance films froze again and again on a laptop (5 November 2026): the player painted each place while the film played,
a tenth of a second to half a second each, several times that on a phone, and kept every canvas it made, past a gigabyte in one
viewing. Now tools/publish.py draws the places as pictures, and the player shows them, keeps only what it uses, and washes people
in fewer layers (wash.js, people.js). This opens the film as the player draws it (the render page, with window.__RENDER__ false),
shows each place, and each other picture publish.py draws (anything kept at the frame's size or larger, or slow to paint), as the
site's player does: decoded, one the frame's size or larger at no more than twice the width drawn at, and drawn at its size in the
film. Then it draws the film through:
- at four moments a second, 1118 px wide (a laptop's window): nothing painted while the film plays takes longer than PAINT_LIMIT
  (publish.py draws as a picture anything kept that takes SLOW_PAINT or longer, so one this slow is one it missed), the film never
  reads the size of a picture the player decodes smaller, nine moments in ten take at most TYPICAL_LIMIT and none longer than
  FRAME_LIMIT, what the player keeps stays within its budget (WC_KEEP, with room for what one moment uses), and it makes at most
  CANVAS_LIMIT new canvases a moment on average;
- then with the processor slowed four times, as on a phone, 559 px wide (the size the player falls back to on a slow device),
  a moment every two seconds: none takes longer than SLOW_LIMIT, so nothing holds the page for long.
The limits leave room, about twice, for a slower machine than the one that drew the films (a browser with no graphics card, as
the checks run, draws several times slower than a laptop's); the times are printed, film by film, to compare. On 5 November 2026,
in that browser, nine moments in ten took at most 0.08 s at 1118 px and the slowest 0.28 s, and slowed four times the slowest took
0.7 s: nine to twenty people painted every frame in Who decides and Teachers of data, and fourteen shadows blurred every frame
in A product with an owner. Before, Rules that run took 3.2 s."""

PAINT_LIMIT = 0.15    # seconds for anything painted once and kept while the film plays (a card, a sheet: a few hundredths)
TYPICAL_LIMIT = 0.15  # seconds that nine moments in ten take at most at 1118 px (the films: 0.02 to 0.08 s)
FRAME_LIMIT = 0.6     # seconds for the slowest moment at 1118 px (the films: 0.05 to 0.28 s)
SLOW_LIMIT = 1.5      # seconds for one moment at 559 px with the processor slowed four times (the films: 0.06 to 0.7 s)
CANVAS_LIMIT = 0.5    # new canvases a moment, on average: a film that makes one each moment fills the memory again
SLOW_PAINT = 0.05     # seconds: a kept picture this slow to paint is drawn as a picture by tools/publish.py (its SLOW_PAINT)
STEP, WIDTH, SLOW_STEP, SLOW_WIDTH = 0.25, 1118, 2.0, 559

# window.__RENDER__ stays false whatever the render page sets, so the film draws as the site's player draws it
INIT = "Object.defineProperty(window,'__RENDER__',{get:()=>false,set:()=>{},configurable:false});"

PASS = """async ({ step, width, pub, slow }) => {
  await FILM.ready; if (!WC.ready) await wc_prepSoft();
  const fn = typeof gv_place === 'function' ? 'gv_place' : 'wc_place', ks = typeof WC_PLACES !== 'undefined' ? Object.keys(WC_PLACES) : [];
  // what tools/publish.py draws as pictures, which the player shows and never paints: the film's places, and the kept pictures its
  // places.json lists, or, before the film is published, those publish.py would draw (the size of the frame or larger, or slow to
  // paint). Here each is painted the first time it shows, and that time is left out of the moment's; it is read back, so the
  // browser paints it then rather than when it is first drawn (the player decodes a picture before it shows it). After the moment,
  // it becomes what the player shows: a decoded picture (createImageBitmap), one the frame's size or larger at no more than twice
  // the width drawn at, drawn at its size in the film (WC_SMALL); the film reading such a one's width or height is noted
  const published = (key, w, h, s) => pub ? pub.includes(key) : w * h >= W * H || s >= slow;
  const fresh = [], sized = new Set();
  const pic = (key, c) => { c.getContext('2d').getImageData(0, 0, 1, 1); WC_PICS.pic[key] = c; fresh.push(key); if (WC.bg[key] === c) { delete WC.bg[key]; WC_PX.bg -= c.width * c.height; } };
  const decoded = async () => { for (const key of fresh.splice(0)) { const c = WC_PICS.pic[key], w = c.width * c.height >= W * H ? Math.min(c.width, Math.ceil(width * 2)) : c.width;
      const b = await createImageBitmap(c, w < c.width ? { resizeWidth: w, resizeHeight: Math.round(w * c.height / c.width), resizeQuality: 'medium' } : {});
      if (w < c.width) { WC_SMALL.set(b, [c.width, c.height, b.width / c.width, b.height / c.height]);
        for (const d of ['width', 'height']) { const v = b[d]; Object.defineProperty(b, d, { get() { sized.add(key); return v; } }); } }
      WC_PICS.pic[key] = b; } };
  for (const k of ks) pic('place:' + k, window[fn](k));
  await decoded();
  const ce = document.createElement.bind(document); let made = 0, spare = 0;
  document.createElement = function (t) { if (String(t).toLowerCase() === 'canvas') made++; return ce(t); };
  const kept = wc_kept, painted = []; let now = 0;
  window.wc_kept = function (key, w, h) { if (WC.bg[key] || WC_PICS.pic[key]) return kept.apply(this, arguments); const a = performance.now(), c = kept.apply(this, arguments);
    c.getContext('2d').getImageData(0, 0, 1, 1); const s = (performance.now() - a) / 1000;
    if (published(key, w || W, h || H, s)) { pic(key, c); spare += s * 1000; made--; } else painted.push([key, false, +s.toFixed(3), +now.toFixed(2)]); return c; };
  const cv = ce('canvas'); cv.width = width; cv.height = Math.round(width * 9 / 16); const x = cv.getContext('2d'), times = [];
  try { for (now = 0.05; now < TL.total; now += step) { spare = 0; const a = performance.now(); x.setTransform(1, 0, 0, 1, 0, 0); renderFrame(x, width / W, now); x.getImageData(0, 0, 1, 1);
      times.push([+((performance.now() - a - spare) / 1000).toFixed(3), +now.toFixed(2), SCENES[sceneIndex(now)].id]); if (fresh.length) await decoded(); } }
  finally { window.wc_kept = kept; document.createElement = ce; }
  const over = Object.keys(WC_KEEP).filter(k => WC_PX[k] > WC_KEEP[k] * 1.5).map(k => [k, Math.round(WC_PX[k] / 1e6), Math.round(WC_KEEP[k] / 1e6)]);
  return { times, painted, made, over, sized: [...sized], places: ks.length, pictures: Object.keys(WC_PICS.pic).length, tooth: !!WC.tooth }; }"""

SLOW = """async ({ step, width }) => { const cv = document.createElement('canvas'); cv.width = width; cv.height = Math.round(width * 9 / 16); const x = cv.getContext('2d'), times = [];
  for (let t = 0.05; t < TL.total; t += step) { const a = performance.now(); x.setTransform(1, 0, 0, 1, 0, 0); renderFrame(x, width / W, t); x.getImageData(0, 0, 1, 1);
    times.push([+((performance.now() - a) / 1000).toFixed(3), +t.toFixed(2), SCENES[sceneIndex(t)].id]); }
  return times; }"""


def spread(times):
    s = sorted(t for t, *_ in times)
    return 'median %.3f s, 9 in 10 under %.3f s, slowest %.3f s' % (s[len(s) // 2], s[int(len(s) * 0.9)], s[-1]) if s else 'no moments'


def published(render_html, places):
    """the kept pictures tools/publish.py drew for this build (places/places.json, stamped with its film.js), or None"""
    import hashlib, json
    f = places / 'places.json' if places else None
    if not f or not f.exists():
        return None
    m = json.loads(f.read_text())
    return list(m.get('places', {})) if m.get('player') == hashlib.sha256((render_html.parent / 'film.js').read_bytes()).hexdigest()[:16] else None


def check(p, render_html, places=None):
    """(summary, faults) for the film at render_html (its dist/render.html), drawn as the site's player draws it; places is the
    folder tools/publish.py draws its pictures in (site/assets/<key>/places), whose list is used if it was drawn from this build"""
    pub = published(render_html, places)
    b = p.chromium.launch(args=["--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1280, "height": 800})
    pg.add_init_script(INIT)
    pg.goto(render_html.as_uri())
    pg.wait_for_function("window.FILM&&typeof TL!=='undefined'", timeout=120000)
    r = pg.evaluate(PASS, {"step": STEP, "width": WIDTH, "pub": pub, "slow": SLOW_PAINT})
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
            faults.append('%.2f s: %s took %.2f s to paint while the film plays (at most %.2f), and tools/publish.py did not draw it as a '
                          'picture: run it again, or make the picture lighter' % (at, key, s, PAINT_LIMIT))
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
    for key in r['sized']:
        faults.append('%s: the film reads the width or height of this picture, which the player decodes smaller on a small screen '
                      '(WC_SMALL): draw it at its size in the film, and leave its size alone' % key)
    for kind, mb, keep in r['over']:
        faults.append('the player keeps %d million pixels of %s, past its budget of %d million (WC_KEEP): something it keeps is never let go' % (mb, kind, keep))
    if n and r['made'] / n > CANVAS_LIMIT:
        faults.append('the player made %d canvases in %d moments (at most %.2f a moment): something makes a new canvas as it draws, '
                      'and the memory fills; keep and reuse it (wc_buf, wc_bufAt)' % (r['made'], n, CANVAS_LIMIT))
    summary = ('as the site\'s player draws it (%d pictures, %s), %d moments at %d px: %s; %d canvases made; slowed four times at %d px: %s'
               % (r['pictures'], 'as published' if pub is not None else 'as tools/publish.py would draw them', n, WIDTH, spread(r['times']),
                  r['made'], SLOW_WIDTH, spread(slow)))
    return summary, faults


if __name__ == '__main__':
    from lang import DIST, META, REPO
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        s, f = check(p, DIST / 'render.html', REPO / 'site' / 'assets' / META['key'] / 'places')
    print(s)
    for l in f:
        print('  ' + l)
    if f:
        raise SystemExit('%d faults in how the player keeps up' % len(f))
    print('the player keeps up')
