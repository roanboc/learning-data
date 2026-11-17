"""What each look costs to draw: the numbers behind docs/styles/index.html.

    python site-tools/style_stats.py --measure            every film (about 40 minutes; it picks up where it stopped)
    python site-tools/style_stats.py --measure --film off-the-shelf --film borrowed-rights
    python site-tools/style_stats.py --page               docs/styles/index.html, from docs/styles/stats.json

The site's player draws each film live, in the visitor's browser, so a look that is heavy to draw is a film that stutters on a
phone. The watercolour films froze on a laptop (5 November 2026) before their places became pictures. This measures every film the
same way, so the looks can be compared and a new one can be judged before a series is drawn in it:

- each film is built (tools/build.py) and opened as the site's player draws it (window.__RENDER__ false, the film's own
  preparation awaited), in a browser with no graphics card, as the checks run;
- MOMENTS moments, evenly spaced through the film, are each drawn at 1920 x 1080 with the processor slowed four times, as on a
  phone: once (the first paint: whatever the look paints once and keeps is painted then), once more, and then three times, of which
  the middle time is the moment's (drawn, then one pixel read back, as smooth.py does);
- the same moments at 960 px (the size the player falls back to when it can't keep up), and at 1920 px with the processor at
  full speed (a laptop);
- a moment's time is split in two: the film's own script (until its drawing calls return), and the browser's painting (which
  it does when the pixel is read; a device with a graphics chip does that part far quicker than this browser);
- each moment is then drawn twice more to time its people: around every function that draws one person (person, ag_person,
  lp_person, daPerson, PK.person and the films' own, found by name, the outermost call only; never a card, a number, an icon or
  a label that only carries the name) the picture is brought up to date, so that person's painting is counted and nobody
  else's, and the quicker of the two draws is kept;
- after the film's moments, the canvases still alive are added up: what the look keeps in memory;
- from the published site: the player's size (film.js, as sent: gzip), and the pictures a film ships beside it (its places).

The numbers are from a slow browser, so a real phone draws faster: read them against each other, and against 33 ms, the time one
frame has at 30 a second. --page draws the page from the numbers; it never measures."""
import argparse, base64, datetime, gzip, io, json, pathlib, statistics, subprocess, sys, time

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'styles'
MOMENTS = 16

# every look in use: its name, the module it was made for, what it is, and the series (film folders) drawn in it
LOOKS = [
    ('dark-glass', 'Dark glass', 'Data platforms and the first films',
     'A dark navy map with lanes of light, cards of dark glass, and tools\' pages drawn for the film.',
     ['inner-life-of-data', 'more-than-a-platform', 'a-sharper-sketch', 'when-things-go-wrong', 'making-of']),
    ('clay', 'Clay and dark glass', 'Data modelling',
     'The past drawn warm, like clay and parchment; the present in the first films\' dark glass.',
     ['from-words-to-data']),
    ('blueprint', 'Blueprint and code', 'Analytics engineering',
     'White lines on blue for the model, code on dark glass for the building work.',
     ['analytics-engineering']),
    ('night-map', 'The night map', 'Modern data basics',
     'The first film\'s platform map, up close, at night, with people lit for the dark.',
     ['data-that-moves', 'data-as-software', 'from-tables-to-decisions', 'documents-as-data']),
    ('bench', 'The quality bench', 'Data quality',
     'A wall of warm limestone over a granite bench, lit from a window on the right.',
     ['fit-for-use', 'quality-as-a-habit']),
    ('paper-glass', 'Paper and glass', 'Enterprise architecture',
     'Paper notes on a wall are drafts, glass in the layers\' colours is the confirmed model; each series has a story in its own light.',
     ['enterprise-architecture', 'business-architecture-for-data', 'data-architecture', 'platform-and-solution-architecture', 'ai-and-continuous-architecture']),
    ('wash', 'Watercolour, pencil and wash', 'Master and reference data',
     'Painted in watercolour, with people in pencil and wash.',
     ['master-and-reference-data']),
    ('watercolour', 'Watercolour', 'Data governance',
     'Painted in watercolour, in the university\'s own rooms, with a soft wash of each person\'s side behind them.',
     ['data-governance', 'governance-on-the-map', 'governance-in-practice']),
    ('night-glass', 'Night glass', 'Data protection',
     'A dark hall of frosted panes: frosted where what is behind may not be read, clear where it may.',
     ['locks-before-the-data', 'only-what-you-may-see', 'kept-for-a-reason']),
    ('marble-oak', 'Marble and oak', 'AI agents',
     'Matte shapes in a white lab, a pale marble wall over an oak floor; the agent is a ceramic sphere, never a person.',
     ['what-an-agent-is', 'agents-at-work-on-data', 'from-helper-to-colleague']),
    ('plaster', 'Sunlit plaster', 'Data management and Leading data people',
     'The team\'s rooms in daylight, with sheets pinned to the wall and people lit by the window.',
     ['a-plan-in-ninety-days', 'making-the-case', 'architecture-that-keeps-up', 'small-steps-measured', 'the-new-skills', 'working-with-people',
      'leading-a-data-team', 'ownership-and-performance', 'people-first']),
    ('ink-line', 'Ink line', 'Leading data people, from November 2026',
     'Flat colour inside one dark line, whole people in rooms painted once and kept (the people kit).',
     []),
]
# films drawn in a look other than their series' (a film remade in a new look before the rest of its series)
FILM_LOOK = {'owning-the-outcome': 'ink-line'}
# the picture of each look on the page: a film and a moment of it, in seconds (python site-tools/style_stats.py --stills)
STILLS = {
    'dark-glass': ('inner-life-of-data', 68.3), 'clay': ('many-ways-to-read', 39.6), 'blueprint': ('declare-it-then-build-it', 117.5),
    'night-map': ('hot-warm-cold', 164.6), 'bench': ('a-hundred-records', 230.0), 'paper-glass': ('the-pyramid-taken-apart', 365.0),
    'wash': ('who-is-it', 264.7), 'watercolour': ('off-the-shelf', 93.3), 'night-glass': ('know-what-you-hold', 181.7),
    'marble-oak': ('borrowed-rights', 246.9), 'plaster': ('measure-the-work', 231.7), 'ink-line': ('owning-the-outcome', 350.4),
}

# window.__RENDER__ stays false whatever the render page sets, so the film draws as the site's player draws it; and every canvas
# the film makes is noted, from before its first script runs
INIT = """Object.defineProperty(window,'__RENDER__',{get:()=>false,set:()=>{},configurable:false});
window.__SS={on:false,n:0,ms:0,depth:0,made:[]};
(()=>{const ce=document.createElement.bind(document);document.createElement=function(t){const c=ce(t);if(String(t).toLowerCase()==='canvas')window.__SS.made.push(new WeakRef(c));return c;};})();"""

PREP = r"""async () => {
  const H = window.__SS;
  if (window.FILM && FILM.ready) await FILM.ready; else await new Promise(r => { const i = setInterval(() => { if (window.__READY__) { clearInterval(i); r(); } }, 50); });
  if (typeof WC !== 'undefined' && !WC.ready && typeof wc_prepSoft === 'function') await wc_prepSoft();
  // everything that draws a person: the kits' own functions and the films', the outermost call only
  // while H.on is 2, the picture a person is drawn on is brought up to date before and after (one pixel read back), so what the
  // browser paints for this person is counted, and for nobody else
  const names = [], on = a => (a && a.canvas && a.getImageData ? a : H.x), wrap = (obj, k, nm) => { const f = obj[k]; if (typeof f !== 'function' || f.__ss) return;
    const g = function () { if (!H.on || H.depth) { H.depth++; try { return f.apply(this, arguments); } finally { H.depth--; } }
      const c = H.on === 2 ? on(arguments[0]) : null; H.depth++; if (c) c.getImageData(0, 0, 1, 1); const a = performance.now();
      try { return f.apply(this, arguments); } finally { if (c) c.getImageData(0, 0, 1, 1); H.depth--; H.ms += performance.now() - a; H.n++; } };
    g.__ss = true; try { obj[k] = g; if (obj[k] === g) names.push(nm); } catch (e) {} };
  // a person by its name (person, bust, folk, walker..., and a figure that isn't a card of words or a number), drawn on a picture
  const first = f => { const m = Function.prototype.toString.call(f).slice(0, 400).match(/^(?:async\s+)?function\s*[\w$]*\s*\(([^)]*)\)/); return m ? m[1].split(',').map(p => p.trim().split('=')[0].trim()) : []; };
  for (const k of Object.getOwnPropertyNames(window)) if (/^(person|personBack|[a-z0-9]+_(person|figure|body|bust|folk|walker|child|clerk|judge)(Back|At|R)?|[a-z][a-z0-9]*(Person|Walker)(Back|At|R)?)$/.test(k) && typeof window[k] === 'function') {
    const ps = first(window[k]); if (ps.length < 3 || !/^(ctx|c|x|g|cx)$/.test(ps[0] || '') || ps.some(p => /^(words|value|label|box|draw|text|seed|bays|lx|n|name|role)$/.test(p))) continue;
    wrap(window, k, k); }
  if (typeof PK !== 'undefined' && PK.person) wrap(PK, 'person', 'PK.person');
  return { total: TL.total, chapters: SCENES.length, people: names };
}"""

# one pass over the film's moments at one size: first (the first draw, timed), then warm more draws, then timed draws (the middle
# one is the moment's time), then painted draws: the moment drawn with every person painted on its own (see PREP), the quicker
# of them kept as pp (all the people of the moment) over ppn (how many). only: the moments to draw
PASS = """async ({ n, w, first, warm, timed, painted, only }) => {
  const H = window.__SS, cv = document.createElement('canvas'); cv.width = w; cv.height = Math.round(w * 9 / 16); const x = cv.getContext('2d'), S = w / 1920, out = [];
  H.x = x;
  // a moment drawn, then one pixel read back: [all of it, the film's script alone (the browser paints when the pixel is read)]
  const one = t => { const a = performance.now(); x.setTransform(1, 0, 0, 1, 0, 0); renderFrame(x, S, t); const b = performance.now(); x.getImageData(0, 0, 1, 1); return [performance.now() - a, b - a]; };
  for (let i = 0; i < n; i++) { const t = TL.total * (i + 0.5) / n, r = { t: +t.toFixed(2) };
    if (only && !only.includes(i)) { out.push(r); continue; }
    try { if (first) r.first = +one(t)[0].toFixed(2); for (let k = 0; k < warm; k++) one(t);
      if (timed) { const v = []; for (let k = 0; k < timed; k++) v.push(one(t));
        v.sort((a, b) => a[0] - b[0]); const m = v[v.length >> 1]; r.ms = +m[0].toFixed(2); r.js = +m[1].toFixed(2); }
      if (painted) {
        // what reading one pixel back costs when nothing is waiting to be painted: taken off each person
        const e = []; for (let k = 0; k < 9; k++) { x.getImageData(0, 0, 1, 1); const a = performance.now(); x.getImageData(0, 0, 1, 1); e.push(performance.now() - a); } e.sort((a, b) => a - b);
        const v = []; for (let k = 0; k < painted; k++) { H.n = 0; H.ms = 0; H.on = 2; one(t); H.on = false; v.push([H.ms - H.n * e[4], H.n]); }
        v.sort((a, b) => a[0] - b[0]); r.pp = +Math.max(0, v[0][0]).toFixed(2); r.ppn = v[0][1]; } }
    catch (e) { H.on = false; r.err = String(e).slice(0, 120); }
    out.push(r); await new Promise(q => setTimeout(q, 0)); }
  return out;
}"""

# the least any look pays here: one kept picture, the size of the frame, drawn under a camera that has moved a little
FLOOR = """(w) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = Math.round(w * 9 / 16); const x = cv.getContext('2d'), pic = document.createElement('canvas'); pic.width = 1920; pic.height = 1080;
  const p = pic.getContext('2d'); for (let i = 0; i < 600; i++) { p.fillStyle = 'hsl(' + (i * 37 % 360) + ' 45% ' + (40 + i % 40) + '%)'; p.fillRect((i * 97) % 1900, (i * 61) % 1060, 120, 90); }
  const v = []; for (let i = 0; i < 9; i++) { const a = performance.now(); x.setTransform(w / 1920 * 1.06, 0, 0, w / 1920 * 1.06, -31.4, -17.7); x.drawImage(pic, 0, 0, 1920, 1080); x.getImageData(0, 0, 1, 1); v.push(performance.now() - a); }
  v.sort((a, b) => a - b); return +v[4].toFixed(1); }"""

KEPT = """() => { if (typeof gc === 'function') { gc(); gc(); } let px = 0, n = 0; for (const r of window.__SS.made) { const c = r.deref(); if (c && c.width * c.height > 4) { px += c.width * c.height; n++; } }
  return { canvases: n, mb: +(px * 4 / 1048576).toFixed(1) }; }"""


def dump(data):
    """The numbers as text: one film a line, so a film measured again changes one line."""
    rows = ',\n'.join('  %s: %s' % (json.dumps(k), json.dumps(v, sort_keys=True, separators=(',', ':'))) for k, v in sorted(data['films'].items()))
    rest = ''.join(',\n "%s": %s' % (k, json.dumps(v, sort_keys=True)) for k, v in sorted(data.items()) if k != 'films')
    return '{\n "films": {\n%s\n }%s\n}\n' % (rows, rest)


def films():
    """Every film: its key on the site, its name, its series folder and its source folder."""
    out = []
    for f in sorted(ROOT.glob('films/**/release.json')):
        r = json.loads(f.read_text())
        e = next((x for x in r if x.get('lang') == 'en'), None)
        if not e or not (ROOT / e['dir'] / 'tools' / 'build.py').exists():
            continue
        site = pathlib.PurePosixPath(e['site_player'])
        out.append({'key': e['key'][:-3] if e['key'].endswith('-en') else e['key'], 'assets': site.parent.name, 'player': site.name, 'name': e['name'].replace(', English', ''),
                    'series': f.relative_to(ROOT).parts[1], 'dir': e['dir']})
    return out


def look_of(film):
    if film['key'] in FILM_LOOK:
        return FILM_LOOK[film['key']]
    return next((l[0] for l in LOOKS if film['series'] in l[4]), None)


def static(film):
    """What the site sends for a film: the player, and the pictures beside it."""
    a = ROOT / 'site' / 'assets' / film['assets']
    js = a / film['player']
    out = {}
    if js.exists():
        b = js.read_bytes()
        out['player_kb'] = round(len(b) / 1024)
        out['player_gz_kb'] = round(len(gzip.compress(b, 6)) / 1024)
    pics = [p for p in (a / 'places').glob('*') if p.suffix.lower() in ('.webp', '.jpg', '.jpeg', '.png', '.avif')] if (a / 'places').is_dir() else []
    out['pictures'] = len(pics)
    out['pictures_kb'] = round(sum(p.stat().st_size for p in pics) / 1024)
    return out


DEVICES = (('slow', 4, 1920), ('half', 4, 960), ('fast', 1, 1920))   # the processor slowed four times at both sizes, then at full speed


def open_film(pw, film, build=True):
    """The film built and opened as the site's player draws it: (browser, page, session, what PREP found) or an error's words."""
    src = ROOT / film['dir']
    page = src / 'dist' / 'render.html'
    if build or not page.exists():
        r = subprocess.run([sys.executable, 'tools/build.py'], cwd=src, capture_output=True, text=True)
        if r.returncode or not page.exists():
            return 'build: ' + ((r.stderr or r.stdout).strip().splitlines() or ['failed'])[-1][:200]
    b = pw.chromium.launch(args=['--js-flags=--expose-gc'])
    pg = b.new_page()
    pg.errs = []
    pg.on('pageerror', lambda e: pg.errs.append(str(e)[:160]))
    pg.add_init_script(INIT)
    cdp = pg.context.new_cdp_session(pg)
    try:
        t0 = time.time()
        pg.goto(page.as_uri())
        info = pg.evaluate(PREP)
        info['prep_s'] = round(time.time() - t0, 1)
        return b, pg, cdp, info
    except Exception as e:
        b.close()
        return str(e).splitlines()[0][:200]


def measure(pw, film, moments, build=True, had=None):
    """A film's numbers. had: the numbers it already has, to add only what each person costs with its painting (pp, ppn)."""
    o = open_film(pw, film, build)
    if isinstance(o, str):
        return dict(had, people_err=o) if had else {'err': o}      # a film keeps the numbers it has
    b, pg, cdp, info = o
    try:
        if had:
            got = {}
            try:
                for name, rate, w in DEVICES:
                    cdp.send('Emulation.setCPUThrottlingRate', {'rate': rate})
                    got[name] = pg.evaluate(PASS, {'n': len(had[name]), 'w': w, 'first': False, 'warm': 1, 'timed': 0, 'painted': 2, 'only': None})
            except Exception as e:
                return dict(had, people_err=str(e).splitlines()[0][:200])
            out = {k: v for k, v in had.items() if k != 'people_err'}
            out['person_fns'] = info['people']
            for name, ms in got.items():
                for i, m in enumerate(ms):
                    out[name][i].update({k: m[k] for k in ('pp', 'ppn') if k in m})
            return out
        out = {'total': round(info['total'], 1), 'chapters': info['chapters'], 'person_fns': info['people'], 'prep_s': info['prep_s']}
        for name, rate, w in DEVICES:
            cdp.send('Emulation.setCPUThrottlingRate', {'rate': rate})
            out[name] = pg.evaluate(PASS, {'n': moments, 'w': w, 'first': name == 'slow', 'warm': 1, 'timed': 3, 'painted': 2, 'only': None})
            if name == 'slow':
                out['kept'] = pg.evaluate(KEPT)
        if pg.errs:
            out['page_errors'] = pg.errs[:3]
        return out
    except Exception as e:  # a film that doesn't open is listed, and the others go on
        return {'err': str(e).splitlines()[0][:200]}
    finally:
        b.close()


STILL = """({ t, w, q }) => { try { CAPS_ON = false; } catch (e) {} const cv = document.createElement('canvas'); cv.width = w; cv.height = Math.round(w * 9 / 16); const x = cv.getContext('2d');
  renderFrame(x, w / 1920, t); x.setTransform(1, 0, 0, 1, 0, 0); renderFrame(x, w / 1920, t); return cv.toDataURL('image/jpeg', q); }"""


def stills(pw, film, times, w=960, q=0.86, build=False):
    """Moments of a film as the site's player draws them: JPEG bytes, one for each time."""
    o = open_film(pw, film, build)
    if isinstance(o, str):
        raise SystemExit(film['key'] + ': ' + o)
    b, pg, cdp, info = o
    try:
        return [base64.b64decode(pg.evaluate(STILL, {'t': min(t, info['total'] - 0.05), 'w': w, 'q': q}).split(',', 1)[1]) for t in times]
    finally:
        b.close()


def floor(pw):
    """One kept picture under a moving camera, with nothing else: slowed four times at both sizes, and at full speed."""
    b = pw.chromium.launch()
    pg = b.new_page()
    cdp = pg.context.new_cdp_session(pg)
    pg.goto('about:blank')
    out = {}
    for name, rate, w in (('slow', 4, 1920), ('half', 4, 960), ('fast', 1, 1920)):
        cdp.send('Emulation.setCPUThrottlingRate', {'rate': rate})
        out[name] = pg.evaluate(FLOOR, w)
    b.close()
    return out


def run_measure(args):
    from playwright.sync_api import sync_playwright
    OUT.mkdir(parents=True, exist_ok=True)
    dest = pathlib.Path(args.out) if args.out else OUT / 'stats.json'
    data = json.loads(dest.read_text()) if dest.exists() else {'films': {}}
    if args.floor:
        with sync_playwright() as pw:
            data['floor'] = floor(pw)
        dest.write_text(dump(data))
        print('one kept picture under a moving camera:', data['floor'])
        return
    todo = [f for f in films() if (not args.film or f['key'] in args.film) and
            (args.again or (args.people and 'slow' in data['films'].get(f['key'], {}) and not any('pp' in m for m in data['films'][f['key']]['slow']))
             or (not args.people and (f['key'] not in data['films'] or 'err' in data['films'][f['key']])))]
    if args.part:
        i, n = map(int, args.part.split('/'))
        todo = todo[i::n]
    print('%d films to measure' % len(todo), flush=True)
    with sync_playwright() as pw:
        for k, f in enumerate(todo):
            t0 = time.time()
            m = measure(pw, f, args.moments, build=not args.no_build, had=data['films'].get(f['key']) if args.people else None)
            m.update(static(f), name=f['name'], series=f['series'], look=look_of(f))
            data['films'][f['key']] = m
            data['measured'] = datetime.date.today().strftime('%-d %B %Y')
            dest.write_text(dump(data))
            ok = [x['ms'] for x in m.get('slow', []) if 'ms' in x]
            pp, ppn = sum(x.get('pp', 0) for x in m.get('slow', [])), sum(x.get('ppn', 0) for x in m.get('slow', []))
            print('%3d/%d %-44s %s%s  %.0f s' % (k + 1, len(todo), f['key'], 'median %.0f ms, worst %.0f ms slowed' % (statistics.median(ok), max(ok)) if ok else m.get('err', '?'),
                                                 ', a person %.1f ms' % (pp / ppn) if ppn else '', time.time() - t0), flush=True)


def run_stills(args):
    """docs/styles/img/<look>.jpg: one moment of each look, as the site's player draws it (STILLS says which)."""
    from playwright.sync_api import sync_playwright
    by = {f['key']: f for f in films()}
    (OUT / 'img').mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        for look, (key, t) in STILLS.items():
            if args.look and look not in args.look:
                continue
            (OUT / 'img' / (look + '.jpg')).write_bytes(stills(pw, by[key], [t], build=not args.no_build)[0])
            print(look, key, t, flush=True)


def run_sheet(args):
    """A sheet of a film's measured moments, to choose a look's still from: --sheet <film key> <file.jpg>."""
    from playwright.sync_api import sync_playwright
    from PIL import Image, ImageDraw
    f = next(x for x in films() if x['key'] == args.sheet[0])
    with sync_playwright() as pw:
        o = open_film(pw, f, not args.no_build)
        if isinstance(o, str):
            raise SystemExit(o)
        total = o[3]['total']
        o[0].close()
        times = [total * (i + 0.5) / args.moments for i in range(args.moments)]
        pics = stills(pw, f, times, w=320, q=0.8, build=False)
    sheet = Image.new('RGB', (320 * 4, 198 * ((len(pics) + 3) // 4)), 'white')
    d = ImageDraw.Draw(sheet)
    for i, b in enumerate(pics):
        x, y = (i % 4) * 320, (i // 4) * 198
        sheet.paste(Image.open(io.BytesIO(b)), (x, y + 18))
        d.text((x + 4, y + 3), '%s  %.1f s' % (f['key'], times[i]), fill='black')
    sheet.save(args.sheet[1], quality=78)


def keep_version(args):
    """An earlier version of a film, measured in a checkout of its commit (--measure --film KEY --out FILE there), kept beside
    the numbers so the page can set it against the film as it is now: --keep-version FILE KEY NAME NOTE LOOK."""
    file, key, name, note, look = args.keep_version
    dest = OUT / 'versions.json'
    vs = json.loads(dest.read_text()) if dest.exists() else []
    film = json.loads(pathlib.Path(file).read_text())['films'].get(key) if file != '-' else None   # '-': the film as stats.json has it
    if file != '-' and (not film or 'slow' not in film):
        raise SystemExit('no numbers for %s in %s' % (key, file))
    vs = [v for v in vs if (v['key'], v['name']) != (key, name)] + [{'key': key, 'name': name, 'note': note, 'look': look, 'film': film}]
    dest.write_text(json.dumps(vs, indent=1, sort_keys=True))
    print('docs/styles/versions.json:', ', '.join(v['name'] for v in vs if v['key'] == key))


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('--measure', action='store_true')
    ap.add_argument('--page', action='store_true')
    ap.add_argument('--film', action='append', help='only this film (its key on the site); repeat for more')
    ap.add_argument('--again', action='store_true', help='measure films that already have numbers')
    ap.add_argument('--part', help='i/n: every n-th film from the i-th, to measure in n runs side by side')
    ap.add_argument('--out', help='where the numbers go (docs/styles/stats.json by default)')
    ap.add_argument('--moments', type=int, default=MOMENTS)
    ap.add_argument('--floor', action='store_true', help='with --measure: only the cost of one kept picture under a moving camera')
    ap.add_argument('--people', action='store_true', help='with --measure: only what each person costs with its painting, added to films already measured')
    ap.add_argument('--no-build', action='store_true', help="don't build a film that has a build")
    ap.add_argument('--stills', action='store_true', help='draw the picture of each look (docs/styles/img)')
    ap.add_argument('--look', action='append', help='with --stills: only this look')
    ap.add_argument('--sheet', nargs=2, metavar=('FILM', 'FILE'), help="a sheet of a film's measured moments, to choose a still from")
    ap.add_argument('--keep-version', nargs=5, metavar=('FILE', 'KEY', 'NAME', 'NOTE', 'LOOK'), help="keep an earlier version's numbers for the page's before and after ('-' as FILE: the film as it is now)")
    ap.add_argument('--artifact', metavar='FILE', help='with --page: also the page as one file, its pictures inside, to share for review')
    args = ap.parse_args()
    if args.measure:
        run_measure(args)
    if args.stills:
        run_stills(args)
    if args.sheet:
        run_sheet(args)
    if args.keep_version:
        keep_version(args)
    if args.page:
        import style_page
        style_page.write(OUT)
        if args.artifact:
            style_page.write_artifact(OUT, args.artifact)
    if not (args.measure or args.page or args.stills or args.sheet or args.keep_version):
        ap.print_help()
