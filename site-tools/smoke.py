#!/usr/bin/env python3
"""Browser checks for the Learning Data site, in Chromium with Playwright. Run from anywhere:

    python site-tools/smoke.py

It serves site/ at http://localhost:8110/learning-data/, as GitHub Pages does, with http-server (npx), which
answers HTTP Range requests: the players seek their soundtrack, and Python's http.server can't do that.
It stops the server at the end. It prints what each check found, and exits with 1 if anything fails.

Needs: pip install playwright, Chromium for Playwright, and Node (for npx http-server).
Options:
  --port N          serve on another port (default 8110)
  --base URL        test a copy of this checkout that is already served, such as https://roanboc.github.io/learning-data/
                    after a push (the pages and links to test still come from site/ here)
  --only a,b        run only these checks (see --list)
  --shots DIR       also save screenshots for a visual review
  --list            list the checks

Google Fonts are fetched by Python (so they work behind a proxy that Chromium doesn't trust) and handed to the
browser; if they can't be fetched, the pages use fallback fonts and the run says so. Nothing else leaves the machine.
"""
import argparse
import asyncio
import json
import math
import os
import pathlib
import re
import shutil
import signal
import ssl
import subprocess
import sys
import tempfile
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
WEB = ROOT / "site"
sys.path.insert(0, str(ROOT / "site-tools"))
sys.dont_write_bytecode = True  # no __pycache__ in site-tools/
import check_site  # noqa: E402  (the same page parser and rules as the static checks)

WIDTHS = [320, 360, 390, 768, 1280]
THEMES = ["light", "dark"]
PUBLIC = "https://roanboc.github.io/learning-data/"
# film pages: their chapter count, and the Spanish chapter names of the English films on Spanish pages
FILMS = {
    "": 11, "es/": 11, "sketch/": 9, "es/sketch/": 9,
    "when-things-go-wrong/silent-change/": 11, "es/when-things-go-wrong/silent-change/": 11,
    "when-things-go-wrong/too-good-to-be-true/": 8, "es/when-things-go-wrong/too-good-to-be-true/": 8,
}
ES_NAMES = {
    "es/sketch/": {"drawn": "El boceto que dibujamos", "two": "Dos cifras", "cls": "¿Qué es una clase?",
                   "census": "¿La fecha de corte de quién?", "courses": "Un estudiante, dos carreras",
                   "time": "¿Inscrito cuándo?", "levels": "Tres niveles de precisión",
                   "fit": "Revisar, adoptar, extender, registrar", "end": "Vista completa"},
    "es/when-things-go-wrong/silent-change/": {
        "banner": "Las cifras de ayer", "night": "Seis horas antes", "sam": "Sam", "thread": "Sigue el hilo",
        "bronze": "La causa", "halves": "Dos mitades de un cambio", "fix": "La corrección",
        "recover": "La recuperación", "contract": "El contrato", "later": "Tres semanas después",
        "end": "Vista completa"},
    "es/when-things-go-wrong/too-good-to-be-true/": {
        "open": "Una versión del martes", "limits": "La cifra y sus límites", "night": "La noche del lunes",
        "tuesdays": "Tres martes", "level": "Elegir el nivel", "thread": "Sigue el hilo", "reload": "Corregir en el origen",
        "end": "Vista completa"},
}
# the series (From words to data, In the weeds of data crafting): their films' chapter counts and Spanish chapter names come from
# their own data (site-tools/build_series.py)
for _f in check_site.build_series.all_films():
    _sl = _f["series"]["slug"]
    FILMS[f"{_sl}/{_f['key']}/"] = FILMS[f"es/{_sl}/{_f['key']}/"] = len(_f["chapters"])
    ES_NAMES[f"es/{_sl}/{_f['key']}/"] = _f["site"]["chapters_es"]
# Silent change as re-cut: 336.9 s, and its chapter starts
SILENT = {"total": 336.9, "starts": {"banner": 0, "night": 29.9, "sam": 75.9, "thread": 96.7, "bronze": 124.0,
                                     "halves": 144.7, "fix": 208.1, "recover": 223.7, "contract": 257.4,
                                     "later": 292.7, "end": 318.2},
          "names": {"banner": "Yesterday's numbers", "night": "Six hours earlier", "thread": "Follow the thread",
                    "bronze": "The cause", "halves": "Two halves of one change", "later": "Three weeks later",
                    "end": "Pull back"}}
UI = {"en": {"play": "Play", "pause": "Pause", "fs": "Full screen", "fsExit": "Exit full screen"},
      "es": {"play": "Reproducir", "pause": "Pausa", "fs": "Pantalla completa", "fsExit": "Salir de pantalla completa"}}
CA = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")


# ---------------------------------------------------------------- report
class Report:
    def __init__(self):
        self.sections = {}
        self.order = []

    def sec(self, name, title):
        if name not in self.sections:
            self.sections[name] = {"title": title, "fails": [], "notes": [], "n": 0}
            self.order.append(name)
        return self.sections[name]

    def done(self):
        bad = 0
        for k in self.order:
            s = self.sections[k]
            ok = not s["fails"]
            bad += not ok
            print(f"{'PASS' if ok else 'FAIL'}  {s['title']}" + (f"  [{s['n']} checks]" if s["n"] else "") +
                  ("" if ok else f"  ({len(s['fails'])} failed)"))
            for f in s["fails"][:60]:
                print(f"      - {f}")
            if len(s["fails"]) > 60:
                print(f"      - … and {len(s['fails']) - 60} more")
            for n in s["notes"]:
                print(f"      · {n}")
        print()
        print(f"{len(self.order) - bad} of {len(self.order)} checks passed." + (" All good." if not bad else f" {bad} failed."))
        return 1 if bad else 0


def expect(sec, cond, msg):
    sec["n"] += 1
    if not cond:
        sec["fails"].append(msg)
    return bool(cond)


def fill(s, o):
    return re.sub(r"\{(\w+)\}", lambda m: str(o[m.group(1)]) if m.group(1) in o else m.group(0), s)


# ---------------------------------------------------------------- server
def start_server(port):
    if shutil.which("npx") is None:
        sys.exit("smoke.py needs Node's npx (for http-server), or --base to test a site that is already served")
    root = pathlib.Path(tempfile.mkdtemp(prefix=f"ld-srv-{port}-"))
    (root / "learning-data").symlink_to(WEB)
    proc = subprocess.Popen(["npx", "--yes", "http-server", str(root), "-p", str(port), "-c-1", "-s"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    base = f"http://127.0.0.1:{port}/learning-data/"
    for _ in range(120):
        try:
            with urllib.request.urlopen(base, timeout=1) as r:
                if r.status == 200:
                    return proc, root, base
        except Exception:  # noqa: BLE001
            pass
        if proc.poll() is not None:
            break
        time.sleep(0.5)
    stop_server(proc, root)
    sys.exit(f"http-server didn't start on port {port}")


def stop_server(proc, root):
    try:
        os.killpg(proc.pid, signal.SIGTERM)
        proc.wait(timeout=5)
    except Exception:  # noqa: BLE001
        try:
            os.killpg(proc.pid, signal.SIGKILL)
        except Exception:  # noqa: BLE001
            pass
    shutil.rmtree(root, ignore_errors=True)


# ---------------------------------------------------------------- fonts: fetched here, handed to the browser
FONTS = {}
FONT_STATE = {"ok": 0, "failed": 0}


def fetch(url, ua):
    if url not in FONTS:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": ua})
            with urllib.request.urlopen(req, context=ssl.create_default_context(cafile=CA) if CA else None, timeout=20) as r:
                FONTS[url] = (200, r.headers.get("content-type", "application/octet-stream"), r.read())
                FONT_STATE["ok"] += 1
        except Exception:  # noqa: BLE001
            FONTS[url] = None
            FONT_STATE["failed"] += 1
    return FONTS[url]


async def route_external(route):
    url = route.request.url
    host = urllib.parse.urlsplit(url).netloc
    if host in ("fonts.googleapis.com", "fonts.gstatic.com"):
        got = await asyncio.to_thread(fetch, url, route.request.headers.get("user-agent", "Mozilla/5.0 Chrome/140"))
        if got:
            await route.fulfill(status=got[0], headers={"content-type": got[1], "access-control-allow-origin": "*"}, body=got[2])
        elif host == "fonts.googleapis.com":
            await route.fulfill(status=200, headers={"content-type": "text/css"}, body="/* fonts unavailable */")
        else:
            await route.abort()
        return
    await route.abort()


# ---------------------------------------------------------------- browser helpers
class Run:
    def __init__(self, browser, base, rep, shots):
        self.browser, self.base, self.rep, self.shots = browser, base, rep, shots
        self.origin = "{0.scheme}://{0.netloc}".format(urllib.parse.urlsplit(base))
        self.sem = asyncio.Semaphore(6)
        self.static = {}
        for p in sorted(WEB.rglob("*.html")):
            pg = check_site.Page(p)
            self.static[pg.key] = pg

    def url(self, key):
        return self.base + key

    def key(self, url):
        u = url.split("#")[0]
        return u[len(self.base):] if u.startswith(self.base) else u

    async def context(self, width=1280, theme="light", init=None, height=None):
        ctx = await self.browser.new_context(viewport={"width": width, "height": height or (800 if width > 700 else 740)},
                                             color_scheme=theme, reduced_motion="no-preference")
        await ctx.route(re.compile(r"^(?!" + re.escape(self.origin) + r")https?://"), route_external)
        if init:
            await ctx.add_init_script(init)
        return ctx

    async def page(self, ctx, key=None, url=None, main_status_ok=False):
        pg = await ctx.new_page()
        log = {"console": [], "errors": [], "failed": []}
        origin = self.origin

        def on_console(m):
            if m.type == "error":
                loc = m.location.get("url", "") if m.location else ""
                if main_status_ok and loc.split("#")[0] == (url or self.url(key or "")).split("#")[0]:
                    return  # the page itself answers 404 on purpose
                log["console"].append((m.text + (f" ({loc})" if loc else ""))[:300])

        def on_failed(r):
            f = r.failure or ""
            if not r.url.startswith(origin):
                return
            if "ERR_ABORTED" in f and (r.resource_type in ("media", "document") or r.url.endswith(".mp3")):
                return  # a seek aborts the soundtrack's range request; a redirect page aborts its own load
            log["failed"].append(f"{r.url[len(origin):]} {f}")

        def on_response(r):
            if r.url.startswith(origin) and r.status >= 400 and not (main_status_ok and r.request.resource_type == "document"):
                log["failed"].append(f"{r.url[len(origin):]} HTTP {r.status}")

        pg.on("console", on_console)
        pg.on("pageerror", lambda e: log["errors"].append(str(e)[:300]))
        pg.on("requestfailed", on_failed)
        pg.on("response", on_response)
        if key is not None or url is not None:
            await pg.goto(url or self.url(key), wait_until="load", timeout=30000)
        return pg, log

    @staticmethod
    async def ready(pg, timeout=20000):
        """waits for the film's assets; on a page with a player, also for its controls"""
        has = await pg.evaluate("() => !!(window.FILM && FILM.ready)")
        if has:
            await pg.evaluate("() => Promise.race([FILM.ready, new Promise(r => setTimeout(r, %d))])" % timeout)
            if await pg.evaluate("() => !!document.getElementById('film')"):
                await pg.wait_for_function("() => typeof FILM.time === 'function'", timeout=timeout)
        return has

    @staticmethod
    async def settle(pg):
        """waits for a smooth scroll to finish"""
        last = None
        for _ in range(30):
            y = await pg.evaluate("() => scrollY")
            if y == last:
                return
            last = y
            await pg.wait_for_timeout(150)

    @staticmethod
    async def think(pg, on):
        """turns "Pause and think" on or off (the choice is kept in storage, so a click alone could do either)"""
        if (await pg.get_attribute("#think", "aria-pressed") == "true") != on:
            await pg.click("#think")


def log_problems(log):
    out = []
    out += [f"page error: {e}" for e in log["errors"]]
    out += [f"console error: {e}" for e in log["console"]]
    out += [f"failed request: {e}" for e in log["failed"]]
    return out


# ---------------------------------------------------------------- 1. every page, every width, both themes
async def check_pages(run):
    sec = run.rep.sec("pages", f"Every page at {', '.join(map(str, WIDTHS))} px, light and dark: no errors, no failed request, no sideways scroll, a compact header")
    keys = [k for k, pg in run.static.items() if not pg.redirect and not pg.is404]

    async def one(key, width, theme):
        async with run.sem:
            ctx = await run.context(width, theme)
            try:
                pg, log = await run.page(ctx, key)
                await run.ready(pg)
                await pg.wait_for_timeout(250)
                m = await pg.evaluate("""() => {
                  const top = document.querySelector('header.top'), r = top ? top.getBoundingClientRect() : null;
                  const vis = e => e && getComputedStyle(e).display !== 'none' && e.getClientRects().length > 0;
                  const items = [...document.querySelectorAll('header.top .brand, header.top nav > a, header.top nav > .lang')];
                  return {sw: document.documentElement.scrollWidth, iw: innerWidth, h: r ? r.height : null,
                    shown: items.filter(vis).map(e => ({t: e.textContent.trim(), y: Math.round(e.getBoundingClientRect().top)})),
                    hidden: items.filter(e => !vis(e)).map(e => e.textContent.trim())};}""")
                where = f"{key or '/'} @{width} {theme}"
                for p in log_problems(log):
                    expect(sec, False, f"{where}: {p}")
                expect(sec, m["sw"] <= m["iw"], f"{where}: scrolls sideways ({m['sw']} > {m['iw']} px)")
                if m["h"] is None:
                    expect(sec, False, f"{where}: no header.top")
                    return
                if width <= 360:
                    expect(sec, m["h"] <= 100, f"{where}: the header is {m['h']:.0f} px tall (at most 100)")
                if width <= 640:
                    shown = [x["t"] for x in m["shown"]]
                    rows = []
                    for x in m["shown"]:
                        if not any(abs(x["y"] - y) <= 6 for y in rows):
                            rows.append(x["y"])
                    expect(sec, len(shown) == 5 and len(rows) == 1,
                           f"{where}: the header shows {shown} on {len(rows)} lines; expected the brand, Start here, Topics, Making of and EN/ES on one")
                else:
                    expect(sec, not m["hidden"], f"{where}: header items hidden on a wide screen: {m['hidden']}")
            finally:
                await ctx.close()

    await asyncio.gather(*(one(k, w, t) for k in keys for w in WIDTHS for t in THEMES))
    sec["notes"].append(f"{len(keys)} pages × {len(WIDTHS)} widths × 2 themes = {len(keys) * len(WIDTHS) * 2} loads")
    if FONT_STATE["failed"] and not FONT_STATE["ok"]:
        sec["notes"].append("Google Fonts couldn't be fetched: fallback fonts were used")


# ---------------------------------------------------------------- 2. the 404 page, at a deep missing path
async def check_404(run):
    sec = run.rep.sec("notfound", "404: served at a deep missing path, its stylesheet and links load")
    body = (WEB / "404.html").read_bytes()
    deep = run.base + "no/such/page/"
    ctx = await run.context(390)
    try:
        await ctx.route(deep, lambda r: r.fulfill(status=404, headers={"content-type": "text/html; charset=utf-8"}, body=body))
        pg, log = await run.page(ctx, url=deep, main_status_ok=True)
        await pg.wait_for_timeout(300)
        for p in log_problems(log):
            expect(sec, False, f"404 at {deep}: {p}")
        styled = await pg.evaluate("() => getComputedStyle(document.querySelector('header.top')).position")
        expect(sec, styled in ("sticky", "fixed"), f"404: site.css didn't load (header position {styled})")
        links = await pg.evaluate("() => [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith(location.origin))")
        for h in sorted(set(links)):
            r = await pg.request.get(h.split("#")[0])
            expect(sec, r.status == 200, f"404: link {h} answers HTTP {r.status}")
        sw = await pg.evaluate("() => document.documentElement.scrollWidth <= innerWidth")
        expect(sec, sw, "404: scrolls sideways at 390 px")
    finally:
        await ctx.close()


# ---------------------------------------------------------------- 3. deep links
async def check_deeplinks(run):
    sec = run.rep.sec("deeplinks", "Deep links and old links land where they should")
    ctx = await run.context(1280)
    try:
        async def land(src, want, hash_re=None):
            pg, _ = await run.page(ctx)
            await pg.goto(run.url(src), wait_until="load")
            try:
                await pg.wait_for_url(lambda u: u.split("#")[0] == run.url(want).split("#")[0], timeout=6000)
            except Exception:  # noqa: BLE001
                pass
            await pg.wait_for_timeout(400)
            got = pg.url
            path_ok = got.split("#")[0] == run.url(want).split("#")[0]
            h = got.split("#", 1)[1] if "#" in got else ""
            want_h = want.split("#", 1)[1] if "#" in want else None
            hash_ok = (re.fullmatch(hash_re, h) is not None) if hash_re else (want_h is None or h == want_h)
            expect(sec, path_ok and hash_ok, f"/{src} → {run.key(got) or '/'}{'#' + h if h and '#' not in run.key(got) else ''}, expected /{want}")
            return pg

        stops = "|".join(re.findall(r'\["(\w+)","\w+",\[', (WEB / "assets/learn/learn.js").read_text()))
        pg = await land("#explore-refine", "labs/#refine")
        await pg.close()
        pg = await land("#explore", "labs/", hash_re=f"({stops})?")
        await pg.close()
        pg = await land("#practise", "scenarios/")
        await pg.close()
        pg = await land("es/#explore-gold", "es/labs/#gold")
        await pg.close()
        for src in ("labs/#explore-gold", "labs/#gold"):
            pg, _ = await run.page(ctx, src)
            await pg.wait_for_timeout(300)
            sel = await pg.evaluate("() => { const t = document.getElementById('tab-gold'); return t && t.getAttribute('aria-selected'); }")
            expect(sec, sel == "true", f"/{src}: the Gold stop isn't open")
            await pg.close()
        pg = await land("films/inner-life-of-data/#t=75", "#t=75")
        await pg.close()
        pg = await land("es/films/inner-life-of-data/", "es/#watch")
        await pg.close()
        pg = await land("films/", "topics/")
        await pg.close()
        pg = await land("es/films/", "es/topics/")
        await pg.close()
        # the old "film three" band's anchor lands on "Go deeper"
        for lang in ("", "es/"):
            pg, _ = await run.page(ctx, lang + "#film-three")
            await run.settle(pg)
            r = await pg.evaluate("""() => { const g = document.getElementById('go-deeper'), s = document.getElementById('film-three'), h = g && g.querySelector('h2');
              return {inside: !!(g && s && g.contains(s)), top: h ? h.getBoundingClientRect().top : null,
                      head: document.querySelector('header.top').getBoundingClientRect().bottom}; }""")
            expect(sec, r["inside"] and r["top"] is not None and r["head"] - 1 <= r["top"] <= 300,
                   f"/{lang}#film-three: doesn't land on #go-deeper ({r})")
            await pg.close()
        # chapter links: the page scrolls to the film and seeks; the chapter is highlighted
        for key, scene in (("", "refine"), ("sketch/", "time"), ("es/sketch/", "time"),
                           ("when-things-go-wrong/silent-change/", "halves"), ("es/when-things-go-wrong/silent-change/", "halves")):
            pg, _ = await run.page(ctx, key)
            await run.ready(pg)
            sc = await pg.evaluate("id => { const s = SCENES.find(x => x.id === id); return s && {start: s.start, name: s.name}; }", scene)
            await pg.close()
            if not expect(sec, sc, f"/{key}: no chapter \"{scene}\""):
                continue
            n = math.ceil(sc["start"])
            pg, _ = await run.page(ctx, f"{key}#t={n}")
            await run.ready(pg)
            try:
                await pg.wait_for_function(f"() => Math.abs(FILM.time() - {n}) < 0.6", timeout=8000)
            except Exception:  # noqa: BLE001
                pass
            await run.settle(pg)
            r = await pg.evaluate("""() => { const w = document.getElementById('watch').getBoundingClientRect(), on = document.querySelector('#chapters button.on');
              return {t: FILM.time(), top: w.top, on: on ? on.lastChild.textContent : null}; }""")
            expect(sec, abs(r["t"] - n) < 0.6, f"/{key}#t={n}: the film is at {r['t']:.1f} s")
            expect(sec, -2 <= r["top"] <= 160, f"/{key}#t={n}: the film isn't in view (top {r['top']:.0f} px)")
            expect(sec, r["on"] == sc["name"], f"/{key}#t={n}: the highlighted chapter is {r['on']!r}, expected {sc['name']!r}")
            await pg.close()
        # the Sketch labs' "Watch this part" links use the rounded-up starts (sketch.js: Math.ceil)
        pg, _ = await run.page(ctx, "sketch/labs/#time")
        await run.ready(pg)
        await pg.wait_for_timeout(300)
        r = await pg.evaluate("""() => { const on = document.querySelector('#labs3-app [role=tab][aria-selected=true]');
          const a = [...document.querySelectorAll('#labs3-app a.btn')].find(a => /#t=/.test(a.getAttribute('href')));
          const s = SCENES.find(x => x.id === 'time'); return {on: on && on.dataset.id, href: a && a.getAttribute('href'), start: s.start}; }""")
        expect(sec, r["on"] == "time", f"/sketch/labs/#time: the lab open is {r['on']!r}, expected \"time\"")
        expect(sec, r["href"] == f"../#t={math.ceil(r['start'])}", f"/sketch/labs/#time: \"Watch this part\" → {r['href']}, expected ../#t={math.ceil(r['start'])}")
        labs = await pg.evaluate("() => [...document.querySelectorAll('#labs3-app [role=tab]')].map(b => b.dataset.id)")
        for lab in labs:
            await pg.click(f"#labs3-app [role=tab][data-id='{lab}']")
            r = await pg.evaluate("""() => { const a = [...document.querySelectorAll('#labs3-app a.btn')].find(a => /#t=/.test(a.getAttribute('href')));
              const n = a ? +a.getAttribute('href').split('#t=')[1] : null; return {n, ok: SCENES.some(s => Math.ceil(s.start) === n)}; }""")
            expect(sec, r["ok"], f"/sketch/labs/#{lab}: \"Watch this part\" goes to #t={r['n']}, not a chapter start")
        await pg.close()
    finally:
        await ctx.close()


# ---------------------------------------------------------------- 4. every #t= link, on the site and in the docs
async def check_chapter_links(run):
    sec = run.rep.sec("chapters", "Every #t= link, on the site and in the docs, lands on a chapter start (rounded up)")
    links = []  # (source, target page key, n)
    for key, pg in run.static.items():
        for n in pg.dom.walk():
            href = n.attrs.get("href") or ""
            if "#t=" in href:
                kind, target, frag = check_site.resolve(pg, href)
                if kind == "site":
                    links.append((f"site/{pg.file}:{n.line}", check_site.key_of(check_site.file_of(target)[0] or target), frag[2:]))
    for md in sorted(ROOT.rglob("*.md")):
        if any(part in ("build", "dist", "models", "node_modules", ".git") for part in md.parts):
            continue
        for i, line in enumerate(md.read_text(errors="replace").splitlines(), 1):
            for m in re.finditer(re.escape(PUBLIC) + r"([\w\-/]*)#t=([0-9.:]+)", line):
                links.append((f"{md.relative_to(ROOT)}:{i}", m.group(1), m.group(2)))
    targets = sorted({t for _, t, _ in links})
    ctx = await run.context(1280)
    starts = {}
    try:
        for t in targets:
            pg, _ = await run.page(ctx, t)
            await pg.wait_for_timeout(300)
            if pg.url.split("#")[0] != run.url(t):  # a redirect page: follow it
                await pg.wait_for_load_state("load")
            await run.ready(pg)
            starts[t] = await pg.evaluate("() => typeof SCENES === 'undefined' ? null : SCENES.map(s => [s.id, s.name, s.start])")
            await pg.close()
    finally:
        await ctx.close()
    for src, t, n in links:
        sc = starts.get(t)
        if not expect(sec, sc, f"{src}: /{t} has no film"):
            continue
        q = [float(x) for x in n.split(":")]
        v = q[0] * 60 + q[1] if len(q) > 1 else q[0]
        hit = [s for s in sc if math.ceil(s[2]) == v]
        near = min(sc, key=lambda s: abs(s[2] - v))
        expect(sec, hit, f"{src}: /{t}#t={n} isn't a chapter start; the nearest chapter, {near[1]!r}, starts at {near[2]:.2f} s → #t={math.ceil(near[2])}")
    sec["notes"].append(f"{len(links)} links to {len(targets)} films")


# ---------------------------------------------------------------- 5. the players
async def check_players(run):
    sec = run.rep.sec("players", "Players: play with sound, chapters, captions, full screen, Spanish controls and chapter names")
    ctx = await run.context(1280)
    try:
        for key, count in FILMS.items():
            lang = "es" if key.startswith("es/") else "en"
            pg, log = await run.page(ctx, key)
            await run.ready(pg)
            info = await pg.evaluate("""() => ({total: TL.total, scenes: SCENES.map(s => ({id: s.id, name: s.name, start: s.start})),
              buttons: [...document.querySelectorAll('#chapters button')].map(b => b.lastChild.textContent),
              badge: (document.querySelector('.poster .play-badge') || {}).textContent || ''})""")
            where = "/" + key
            expect(sec, len(info["buttons"]) == count == len(info["scenes"]), f"{where}: {len(info['buttons'])} chapter buttons, {len(info['scenes'])} chapters, expected {count}")
            # the stated length on the play badge matches the film, to the half minute
            m = re.search(r"(\d+)(½)?\s*min", info["badge"])
            said = (int(m.group(1)) + (0.5 if m.group(2) else 0)) if m else None
            real = round(info["total"] / 30) / 2
            expect(sec, said == real, f"{where}: the play badge says {info['badge']!r}; the film is {info['total']:.1f} s ({real:g} min)")
            if key in ES_NAMES:
                want = [ES_NAMES[key].get(s["id"], "?") for s in info["scenes"]]
                expect(sec, info["buttons"] == want, f"{where}: chapter names {info['buttons']}, expected {want}")
            if key.endswith("silent-change/"):
                st = {s["id"]: s["start"] for s in info["scenes"]}
                expect(sec, abs(info["total"] - SILENT["total"]) < 0.1, f"{where}: Silent change is {info['total']:.1f} s; the re-cut is {SILENT['total']} s")
                bad = {k: round(st.get(k, -1), 1) for k, v in SILENT["starts"].items() if abs(st.get(k, -99) - v) > 0.1}
                expect(sec, not bad, f"{where}: chapter starts differ from the re-cut: {bad}")
                if lang == "en":
                    names = {s["id"]: s["name"] for s in info["scenes"]}
                    bad = {k: names.get(k) for k, v in SILENT["names"].items() if names.get(k) != v}
                    expect(sec, not bad, f"{where}: chapter names differ from the re-cut: {bad}")
            # play, with the soundtrack
            await pg.click(".poster .play-badge")
            try:
                await pg.wait_for_function("() => FILM.playing() && FILM.time() > 0.5", timeout=10000)
            except Exception:  # noqa: BLE001
                pass
            r = await pg.evaluate("() => ({playing: FILM.playing(), t: FILM.time(), au: document.getElementById('snd').currentTime, paused: document.getElementById('snd').paused})")
            expect(sec, r["playing"] and r["t"] > 0.5, f"{where}: Play doesn't play ({r})")
            expect(sec, not r["paused"] and r["au"] > 0.3, f"{where}: the soundtrack doesn't play ({r})")
            try:
                await pg.wait_for_function(f"() => document.getElementById('play').textContent === {json.dumps(UI[lang]['pause'])}", timeout=5000)
            except Exception:  # noqa: BLE001
                pass
            label = await pg.text_content("#play")
            expect(sec, label == UI[lang]["pause"], f"{where}: while playing the button reads {label!r}, expected {UI[lang]['pause']!r}")
            await pg.click("#play")
            label = await pg.text_content("#play")
            expect(sec, label == UI[lang]["play"], f"{where}: when paused the button reads {label!r}, expected {UI[lang]['play']!r}")
            # captions
            await pg.click("#cc")
            off = await pg.get_attribute("#cc", "aria-pressed")
            await pg.click("#cc")
            on = await pg.get_attribute("#cc", "aria-pressed")
            expect(sec, off == "false" and on == "true", f"{where}: Captions doesn't toggle (aria-pressed {off} then {on})")
            # full screen (a page opened in the background can't take the screen, so bring it forward first)
            await pg.bring_to_front()
            await pg.click("#fs")
            try:
                await pg.wait_for_function("l => document.fullscreenElement && document.fullscreenElement.classList.contains('player') && document.getElementById('fs').textContent === l", arg=UI[lang]["fsExit"], timeout=3000, polling=100)
                fs = True
            except Exception:  # noqa: BLE001
                fs = False
            lab = await pg.text_content("#fs")
            why = "" if fs else await pg.evaluate("() => document.querySelector('.player').requestFullscreen().then(() => 'a direct request works', e => e.name + ': ' + e.message)")
            expect(sec, fs and lab == UI[lang]["fsExit"], f"{where}: Full screen doesn't open the player (label {lab!r}; {why})")
            await pg.evaluate("() => document.fullscreenElement && document.exitFullscreen()")
            await pg.wait_for_timeout(200)
            for p in log_problems(log):
                expect(sec, False, f"{where}: {p}")
            await pg.close()
    finally:
        await ctx.close()


# the Making of page's two sealed players: their elements carry a prefix, so both can play on one page
SEALED = {"dff": 9, "nqr": 9}
ES_SEALED = {"dff": ["Un cuadro", "Una imagen son datos", "Instrucciones, no píxeles", "Capas", "Componentes", "La cámara", "El tiempo",
                     "Dos formas de verla", "El 2:31, otra vez"],
             "nqr": ["Un mensaje", "Dos lados", "Opciones, no respuestas", "Los datos", "Eso no está del todo bien",
                     "Una nota, no volver a empezar", "Lo que salió mal", "Publicar", "Quién hace qué"]}


async def check_sealed(run):
    sec = run.rep.sec("sealed", "Making of: both films play on one page, each with its own chapters, sound, captions and labels")
    ctx = await run.context(1280)
    try:
        for key in ("journey/", "es/journey/"):
            lang = "es" if key.startswith("es/") else "en"
            pg, log = await run.page(ctx, key)
            await pg.wait_for_function("() => ['dff', 'nqr'].every(p => document.querySelectorAll('#' + p + '-chapters button').length)", timeout=30000)
            for p, count in SEALED.items():
                where = f"/{key} ({p})"
                info = await pg.evaluate("""p => ({buttons: [...document.querySelectorAll('#' + p + '-chapters button')].map(b => b.lastChild.textContent),
                  badge: document.getElementById(p + '-film').closest('.player').querySelector('.play-badge').textContent})""", p)
                expect(sec, len(info["buttons"]) == count, f"{where}: {len(info['buttons'])} chapter buttons, expected {count}")
                if lang == "es":
                    expect(sec, info["buttons"] == ES_SEALED[p], f"{where}: chapter names {info['buttons']}")
                await pg.evaluate("p => document.getElementById(p + '-film').closest('.player').scrollIntoView()", p)
                await pg.click(f"#{p}-film >> xpath=.. >> .play-badge")
                try:
                    await pg.wait_for_function("p => document.getElementById(p + '-snd').currentTime > 0.5", arg=p, timeout=10000)
                except Exception:  # noqa: BLE001
                    pass
                r = await pg.evaluate("p => ({au: document.getElementById(p + '-snd').currentTime, label: document.getElementById(p + '-play').textContent})", p)
                expect(sec, r["au"] > 0.5 and r["label"] == UI[lang]["pause"], f"{where}: Play doesn't play with sound ({r})")
                await pg.click(f"#{p}-play")
                label = await pg.text_content(f"#{p}-play")
                expect(sec, label == UI[lang]["play"], f"{where}: when paused the button reads {label!r}")
                await pg.click(f"#{p}-cc")
                off = await pg.get_attribute(f"#{p}-cc", "aria-pressed")
                await pg.click(f"#{p}-cc")
                expect(sec, off == "false" and await pg.get_attribute(f"#{p}-cc", "aria-pressed") == "true", f"{where}: Captions doesn't toggle")
            for prob in log_problems(log):
                expect(sec, False, f"/{key}: {prob}")
            await pg.close()
    finally:
        await ctx.close()


# ---------------------------------------------------------------- 6. "Where next?" when a film ends
async def check_next(run):
    sec = run.rep.sec("nextpanel", "\"Where next?\": appears when a film ends, with the page's links; Watch again and Escape work; keyboard focus behaves")
    ctx = await run.context(1280)
    try:
        for key in FILMS:
            where = "/" + key
            pg, log = await run.page(ctx, key)
            await run.ready(pg)
            tpl = await pg.evaluate("() => { const t = document.getElementById('next-panel'); return t ? [...t.content.querySelectorAll('a')].map(a => a.getAttribute('href')) : null; }")
            if not expect(sec, tpl, f"{where}: no <template id=\"next-panel\">"):
                await pg.close()
                continue
            await pg.evaluate("() => { FILM.seek(TL.total - 0.3); FILM.play(); }")
            try:
                await pg.wait_for_selector(".player .think.next", timeout=5000)
            except Exception:  # noqa: BLE001
                expect(sec, False, f"{where}: no \"Where next?\" panel at the end")
                await pg.close()
                continue
            r = await pg.evaluate("""() => { const p = document.querySelector('.player .think.next');
              return {hrefs: [...p.querySelectorAll('a')].map(a => a.getAttribute('href')), abs: [...p.querySelectorAll('a')].map(a => a.href),
                      focus: !!(document.activeElement && p.contains(document.activeElement)), label: p.getAttribute('aria-labelledby'),
                      h: (p.querySelector('h3') || {}).id}; }""")
            expect(sec, r["hrefs"] == tpl, f"{where}: the panel's links {r['hrefs']} differ from the template's {tpl}")
            expect(sec, r["focus"], f"{where}: focus didn't move into the panel")
            expect(sec, r["label"] and r["label"] == r["h"], f"{where}: the panel isn't labelled by its heading")
            for h in r["abs"]:
                if h.startswith(run.origin):
                    resp = await pg.request.get(h.split("#")[0])
                    expect(sec, resp.status == 200, f"{where}: panel link {run.key(h)} answers HTTP {resp.status}")
            await pg.click(".player .think.next [data-again]")
            try:
                await pg.wait_for_function("() => !document.querySelector('.player .think.next') && FILM.playing() && FILM.time() < 1", timeout=4000)
                again = True
            except Exception:  # noqa: BLE001
                again = False
            expect(sec, again, f"{where}: Watch again doesn't hide the panel and start from 0")
            await pg.evaluate("() => FILM.pause()")
            await end_panel(pg)
            # Space on a link in the panel is the link's, not the player's: the film doesn't start again
            await pg.focus(".player .think.next a")
            await pg.keyboard.press("Space")
            await pg.wait_for_timeout(400)
            r = await pg.evaluate("() => ({panel: !!document.querySelector('.player .think.next'), playing: FILM.playing()})")
            expect(sec, r["panel"] and not r["playing"], f"{where}: Space on a panel link starts the film again ({r})")
            await pg.focus(".player .think.next a")
            await pg.keyboard.press("Escape")
            await pg.wait_for_timeout(700)
            r = await pg.evaluate("() => ({gone: !document.querySelector('.player .think.next'), focus: document.activeElement.id})")
            expect(sec, r["gone"], f"{where}: Escape doesn't close the panel, or it comes back while the film is stopped")
            expect(sec, r["focus"] == "play", f"{where}: after Escape, focus is on {'#' + r['focus'] if r['focus'] else 'the page body'}, expected the Play button")
            # "Watch again" from the keyboard hands focus to the Play button too
            await end_panel(pg)
            await pg.focus(".player .think.next [data-again]")
            await pg.keyboard.press("Enter")
            await pg.wait_for_timeout(300)
            r = await pg.evaluate("() => ({focus: document.activeElement.id, playing: FILM.playing()})")
            expect(sec, r["focus"] == "play" and r["playing"], f"{where}: after Watch again, focus is on {'#' + r['focus'] if r['focus'] else 'the page body'} (playing {r['playing']}), expected the Play button")
            await pg.evaluate("() => FILM.pause()")
            # someone reading elsewhere on the page keeps their place when the film ends
            await pg.evaluate("() => document.querySelector('footer a').focus({preventScroll: true})")
            await end_panel(pg)
            r = await pg.evaluate("() => document.activeElement.closest('footer') !== null")
            expect(sec, r, f"{where}: the end of the film took focus from the footer link into the panel")
            for p in log_problems(log):
                expect(sec, False, f"{where}: {p}")
            await pg.close()
    finally:
        await ctx.close()


async def end_panel(pg):
    """plays the last 0.3 s of the film and waits for the "Where next?" panel of that ending (not one left from before)"""
    await pg.evaluate("() => { FILM.seek(TL.total - 0.3); FILM.play(); }")
    await pg.wait_for_function("() => FILM.playing() && !document.querySelector('.player .think.next')", timeout=4000, polling=20)
    await pg.wait_for_selector(".player .think.next", timeout=5000)
    await pg.wait_for_timeout(100)


# ---------------------------------------------------------------- 7. "Pause and think" on Silent change
async def check_think_silent(run):
    sec = run.rep.sec("think-silent", "\"Pause and think\" on Silent change: the pause, its lab link, the answer, the question list, the keyboard")
    ctx = await run.context(1280)
    en_q = None
    try:
        for key in ("when-things-go-wrong/silent-change/", "es/when-things-go-wrong/silent-change/"):
            lang = "es" if key.startswith("es/") else "en"
            where = "/" + key
            pg, log = await run.page(ctx, key)
            await run.ready(pg)
            X = await pg.evaluate("() => ({lang: LEARN.lang, ui: LEARN.think.ui, qs: LEARN.think.qs, names: Object.fromEntries(SCENES.map(s => [s.id, s.name]))})")
            expect(sec, X["lang"] == lang, f"{where}: the question pack is in {X['lang']!r}")
            pos = {k: [i for i, o in enumerate(q["opts"]) if o.get("ok")] for k, q in X["qs"].items()}
            expect(sec, all(len(v) == 1 for v in pos.values()) and len({v[0] for v in pos.values()}) > 1,
                   f"{where}: the right answers sit at {pos}; each question needs one, and not always in the same place")
            if lang == "en":
                en_q = X["qs"]
            elif en_q:
                same = [k for k in X["qs"] if en_q.get(k, {}).get("q") == X["qs"][k]["q"]]
                expect(sec, not same, f"{where}: questions still in English: {same}")
            await run.think(pg, True)
            expect(sec, await pg.get_attribute("#think", "aria-pressed") == "true", f"{where}: Pause and think doesn't turn on")
            await pg.evaluate("() => { const s = SCENES.find(x => x.id === 'night'); FILM.seek(s.start + s.dur - 1.2); FILM.play(); }")
            try:
                await pg.wait_for_selector(".player .think:not(.next)", timeout=8000)
            except Exception:  # noqa: BLE001
                expect(sec, False, f"{where}: the film didn't pause after \"night\" to ask a question")
                await pg.close()
                continue
            r = await pg.evaluate("""() => { const p = document.querySelector('.player .think:not(.next)'), a = p.querySelector('a.think-lab');
              return {k: p.querySelector('.think-k').textContent, q: p.querySelector('h3').textContent, lab: a && a.href, labText: a && a.textContent,
                      t: FILM.time(), playing: FILM.playing()}; }""")
            q = X["qs"]["night"]
            expect(sec, r["k"] == f"{X['ui']['kicker']} · {X['names']['night']}", f"{where}: the panel's kicker is {r['k']!r}")
            expect(sec, r["q"] == q["q"], f"{where}: the panel asks {r['q']!r}")
            want = run.url(("es/" if lang == "es" else "") + "labs/#" + q["stop"])
            expect(sec, r["lab"] == want, f"{where}: the lab link goes to {r['lab']}, expected {want}")
            expect(sec, q["stop"] == "refine", f"{where}: the \"night\" question's lab is {q['stop']!r}, expected \"refine\"")
            expect(sec, not r["playing"], f"{where}: the film didn't stop for the question")
            ok = [i for i, o in enumerate(q["opts"]) if o.get("ok")][0]
            await pg.click(f".player .think .think-opt >> nth={ok}")
            why = await pg.text_content(".player .think .think-why")
            expect(sec, q["why"] in why and why.startswith(X["ui"]["right"]), f"{where}: the answer reads {why!r}")
            if lang == "en":
                expect(sec, "banner" not in why.lower() and "note" in why, f"{where}: the answer should call the amber message a note: {why!r}")
            await pg.click(".player .think [data-go]")
            await pg.wait_for_timeout(500)
            expect(sec, await pg.evaluate("() => FILM.playing() && !document.querySelector('.player .think:not(.next)')"), f"{where}: Continue doesn't carry on")
            expect(sec, await pg.evaluate("() => document.activeElement.id") == "play", f"{where}: after Continue, focus isn't on the Play button")
            await pg.evaluate("() => FILM.pause()")
            # Space on the panel's lab link is the link's; Escape hands focus back to the Play button
            await pg.evaluate("() => { const s = SCENES.find(x => x.id === 'bronze'); FILM.seek(s.start + s.dur - 1.2); FILM.play(); }")
            await pg.wait_for_selector(".player .think:not(.next)", timeout=8000)
            await pg.focus(".player .think a.think-lab")
            await pg.keyboard.press("Space")
            await pg.wait_for_timeout(300)
            r = await pg.evaluate("() => ({panel: !!document.querySelector('.player .think:not(.next)'), playing: FILM.playing()})")
            expect(sec, r["panel"] and not r["playing"], f"{where}: Space on the lab link starts the film ({r})")
            await pg.focus(".player .think a.think-lab")
            await pg.keyboard.press("Escape")
            await pg.wait_for_timeout(300)
            expect(sec, await pg.evaluate("() => document.activeElement.id") == "play", f"{where}: after Escape on a question, focus isn't on the Play button")
            await pg.evaluate("() => FILM.pause()")
            # the question list, from the same pack
            L = await pg.evaluate("""() => [...document.querySelectorAll('#think-list details')].map(d => ({
              id: d.querySelector('[data-scene]').dataset.scene, k: d.querySelector('.tq-k').textContent,
              lab: (d.querySelector('a.think-lab') || {}).href, ok: (d.querySelector('li.ok') || {}).textContent }))""")
            expect(sec, [x["id"] for x in L] == ["night", "bronze", "halves", "contract"], f"{where}: #think-list has {[x['id'] for x in L]}, expected night, bronze, halves, contract")
            for x in L:
                expect(sec, x["k"] == X["names"][x["id"]], f"{where}: the list names {x['id']} {x['k']!r}, expected {X['names'][x['id']]!r}")
                want = run.url(("es/" if lang == "es" else "") + "labs/#" + X["qs"][x["id"]]["stop"])
                expect(sec, x["lab"] == want, f"{where}: {x['id']}'s lab link goes to {x['lab']}, expected {want}")
            # the +/− sign isn't part of a question's name
            snap = await pg.accessibility.snapshot(root=await pg.query_selector("#think-list summary"))
            name = (snap or {}).get("name", "")
            expect(sec, name and not name.rstrip().endswith(("+", "−")), f"{where}: the first question's name is {name!r}")
            await run.think(pg, False)
            # Space on a question opens it, and doesn't reach the player (which listens for Space while it is on screen)
            await pg.evaluate("() => { document.querySelector('#think-list summary').focus({preventScroll: true}); document.querySelector('.player').scrollIntoView({block: 'center', behavior: 'instant'}); }")
            await pg.wait_for_timeout(500)
            await pg.keyboard.press("Space")
            await pg.wait_for_timeout(300)
            r = await pg.evaluate("() => ({open: document.querySelector('#think-list details').open, playing: FILM.playing()})")
            expect(sec, r["open"] and not r["playing"], f"{where}: Space on a question {r}; expected it to open, with the film still")
            await pg.evaluate("() => { FILM.pause(); document.querySelector('#think-list details').open = false; }")
            # "Watch this part" plays that chapter only (the soundtrack runs fast to get there quickly), and hands focus to Play
            await pg.evaluate("() => { const d = [...document.querySelectorAll('#think-list details')].find(d => d.querySelector('[data-scene=halves]')); d.open = true; }")
            await pg.click("#think-list [data-scene=halves]")
            await run.settle(pg)
            r = await pg.evaluate("() => { const s = SCENES.find(x => x.id === 'halves'); return {t: FILM.time(), start: s.start, end: s.start + s.dur, playing: FILM.playing(), top: document.getElementById('watch').getBoundingClientRect().top}; }")
            expect(sec, r["playing"] and r["start"] <= r["t"] < r["start"] + 3, f"{where}: \"Watch this part\" doesn't play \"halves\" from its start ({r})")
            expect(sec, -2 <= r["top"] <= 160, f"{where}: \"Watch this part\" doesn't bring the film into view")
            expect(sec, await pg.evaluate("() => document.activeElement.id") == "play", f"{where}: after \"Watch this part\", focus isn't on the Play button")
            await pg.evaluate("() => { document.getElementById('snd').playbackRate = 16; }")
            try:
                await pg.wait_for_function("() => !FILM.playing()", timeout=90000)
            except Exception:  # noqa: BLE001
                pass
            t = await pg.evaluate("() => FILM.time()")
            expect(sec, abs(t - (r["end"] - 0.05)) < 0.4, f"{where}: \"Watch this part\" stopped at {t:.2f} s, expected the end of \"halves\" ({r['end']:.2f} s)")
            for p in log_problems(log):
                expect(sec, False, f"{where}: {p}")
            await pg.close()
    finally:
        await ctx.close()


# ---------------------------------------------------------------- 8. "Pause and think" on the home page
async def check_think_home(run):
    sec = run.rep.sec("think-home", "\"Pause and think\" on the home page: lab links stay labs/#…, and \"Go deeper\" appears after an answer")
    ctx = await run.context(1280)
    try:
        for key in ("", "es/"):
            where = "/" + key
            pg, log = await run.page(ctx, key)
            await run.ready(pg)
            q = await pg.evaluate("() => LEARN.think.qs.sketch")
            await run.think(pg, True)
            await pg.evaluate("() => { const s = SCENES.find(x => x.id === 'sketch'); FILM.seek(s.start + s.dur - 1.2); FILM.play(); }")
            try:
                await pg.wait_for_selector(".player .think:not(.next)", timeout=8000)
            except Exception:  # noqa: BLE001
                expect(sec, False, f"{where}: the film didn't pause after \"sketch\"")
                await pg.close()
                continue
            lab = await pg.get_attribute(".player .think a.think-lab", "href")
            expect(sec, lab == "labs/#" + q["stop"], f"{where}: the lab link is {lab!r}, expected 'labs/#{q['stop']}'")
            more = await pg.evaluate("() => !!document.querySelector('.player .think a.think-more')")
            expect(sec, not more, f"{where}: \"Go deeper\" shows before the viewer answers")
            ok = [i for i, o in enumerate(q["opts"]) if o.get("ok")][0]
            await pg.click(f".player .think .think-opt >> nth={ok}")
            r = await pg.evaluate("() => { const a = document.querySelector('.player .think a.think-more'); return a && {href: a.href, text: a.textContent}; }")
            want = run.url(key + "sketch/")
            expect(sec, r and r["href"] == want, f"{where}: \"Go deeper\" goes to {r and r['href']}, expected {want}")
            expect(sec, r and r["text"] == q["more"]["label"] + " →", f"{where}: \"Go deeper\" reads {r and r['text']!r}")
            for p in log_problems(log):
                expect(sec, False, f"{where}: {p}")
            await pg.close()
    finally:
        await ctx.close()


# ---------------------------------------------------------------- 9. progress, kept in this browser
async def check_progress(run):
    sec = run.rep.sec("progress", "Progress: steppers, topic-card chips and series' counts from seeded storage; \"watched\" goes to the right film only")
    # path.js fills the chips; on A Sharper Sketch's pages, sketch.js does
    chip_pages = [k for k, pg in run.static.items() if not pg.redirect and pg.dom.first(cls="tc-progress")
                  and ("assets/learn/path.js" in pg.local_scripts or "assets/sketch/sketch.js" in pg.local_scripts)]
    missing = [k for k, pg in run.static.items() if not pg.redirect and pg.dom.first(cls="tc-progress") and k not in chip_pages]
    expect(sec, not missing, f"topic cards whose progress no script fills: {missing}")
    stepper = {k: pg for k, pg in run.static.items() if pg.dom.first("ol", cls="path")}

    async def chips(pg):
        return await pg.evaluate("""() => [...document.querySelectorAll('[data-progress]')].map(e => ({p: e.dataset.progress, hidden: e.hidden, t: e.textContent,
            T: JSON.parse(e.closest('[data-progress-text]').dataset.progressText), labs: e.dataset.labs, quiz: e.dataset.quiz}))""")

    async def series_chips(pg):  # a series' card: how many of its films were watched
        return await pg.evaluate("""() => [...document.querySelectorAll('[data-films]')].map(e => ({ps: e.dataset.films.split(' '), hidden: e.hidden, t: e.textContent,
            T: JSON.parse(e.closest('[data-series-text]').dataset.seriesText)}))""")

    async def steps(pg):
        return await pg.evaluate("""() => { const p = document.querySelector('ol.path'); return p && {T: JSON.parse(p.dataset.text),
            li: [...p.querySelectorAll('li')].map(l => ({done: l.classList.contains('done'), t: l.querySelector('span:last-child').textContent}))}; }""")

    def defaults(key):
        return [li.all("span")[-1].text() for li in stepper[key].dom.first("ol", cls="path").all("li")]

    async def seeded(seed):
        ctx = await run.context(1280)
        pg, _ = await run.page(ctx, "404.html")
        await pg.evaluate("s => { localStorage.clear(); for (const k in s) localStorage.setItem(k, JSON.stringify(s[k])); }", seed)
        await pg.close()
        return ctx

    stops = re.findall(r'\["(\w+)","\w+",\[', (WEB / "assets/learn/learn.js").read_text())
    # seed 1: the intro watched, every lab, two answers
    ctx = await seeded({"ld:watched": True, "ld:visited": stops, "ld:quiz": {"cur": 3, "ans": {"0": {"ok": True}, "1": {"ok": False}}, "sum": {}}})
    try:
        for key in ("", "es/"):
            pg, _ = await run.page(ctx, key)
            s = await steps(pg)
            want = [(True, s["T"]["watched"]), (True, fill(s["T"]["labs"], {"n": len(stops)})), (False, fill(s["T"]["quiz"], {"n": 2, "ok": 1}))]
            got = [(x["done"], x["t"]) for x in s["li"]]
            expect(sec, got == want, f"/{key} (intro seeded): stepper {got}, expected {want}")
            await pg.close()
        for key in chip_pages:
            pg, _ = await run.page(ctx, key)
            for c in await chips(pg):
                if c["p"] == "ld":
                    want = " · ".join([c["T"]["watched"], fill(c["T"]["labs"], {"n": len(stops), "of": c["labs"]}), fill(c["T"]["quiz"], {"n": 2, "of": c["quiz"], "ok": 1})])
                    expect(sec, not c["hidden"] and c["t"] == want, f"/{key} (intro seeded): intro chip {c['t']!r}, expected {want!r}")
                else:
                    expect(sec, c["hidden"], f"/{key} (intro seeded): the {c['p']} chip shows {c['t']!r}")
            await pg.close()
    finally:
        await ctx.close()
    # seed 2: A Sharper Sketch, one lab and two answers
    ctx = await seeded({"ld3:quiz": {"0": {"ok": True}, "5": {"ok": True}}, "ld3:visited": ["grain"]})
    try:
        for key in chip_pages:
            pg, _ = await run.page(ctx, key)
            for c in await chips(pg):
                if c["p"] == "ld3":
                    want = " · ".join([fill(c["T"]["labs"], {"n": 1, "of": c["labs"]}), fill(c["T"]["quiz"], {"n": 2, "of": c["quiz"], "ok": 2})])
                    expect(sec, not c["hidden"] and c["t"] == want, f"/{key} (Sketch seeded): Sketch chip {c['t']!r}, expected {want!r}")
                else:
                    expect(sec, c["hidden"], f"/{key} (Sketch seeded): the {c['p']} chip shows {c['t']!r}")
            await pg.close()
        got = {}
        for key in ("sketch/", "es/sketch/"):
            pg, _ = await run.page(ctx, key)
            s = await steps(pg)
            d = defaults(key)
            want = [(False, d[0]), (False, fill(s["T"]["labs"], {"n": 1})), (False, fill(s["T"]["quiz"], {"n": 2, "ok": 2}))]
            got[key] = [(x["done"], x["t"]) for x in s["li"]]
            expect(sec, got[key] == want, f"/{key} (Sketch seeded): stepper {got[key]}, expected {want}")
            await pg.close()
    finally:
        await ctx.close()
    # seed 3: a scenario started, nothing answered
    ctx = await seeded({"ld:quiz": {"cur": 0}})
    try:
        pg, _ = await run.page(ctx, "")
        s = await steps(pg)
        expect(sec, [(x["done"], x["t"]) for x in s["li"]][2] == (False, defaults("")[2]), f"/ (ld:quiz={{cur:0}}): step 3 reads {s['li'][2]}")
        await pg.close()
        pg, _ = await run.page(ctx, "topics/")
        expect(sec, all(c["hidden"] for c in await chips(pg)), "/topics/ (ld:quiz={cur:0}): a chip shows; the cur key is not an answer")
        await pg.close()
    finally:
        await ctx.close()
    # seed 3b: two films of From words to data watched: its card on the Topics pages counts them, and no other series' card shows
    two = ["ld-whats-in-a-word", "ld-keeping-it-true"]
    ctx = await seeded({f"{p}:watched": True for p in two})
    try:
        for key in ("topics/", "es/topics/"):
            pg, _ = await run.page(ctx, key)
            cs = await series_chips(pg)
            expect(sec, len(cs) >= 4, f"/{key}: {len(cs)} series cards with a count, expected one per series")
            for c in cs:
                if set(two) <= set(c["ps"]):
                    want = fill(c["T"]["films"], {"n": 2, "of": len(c["ps"])})
                    expect(sec, not c["hidden"] and c["t"] == want, f"/{key} (two films seeded): From words to data's card reads {c['t']!r}, expected {want!r}")
                else:
                    expect(sec, c["hidden"], f"/{key} (two films seeded): the card of {c['ps'][0]}'s series shows {c['t']!r}")
            await pg.close()
    finally:
        await ctx.close()
    # seed 4: nothing. Labs pages mark their open lab as visited on load, so they come last
    ctx = await seeded({})
    try:
        order = sorted(set(chip_pages) | set(stepper), key=lambda k: k.endswith("labs/"))
        for key in order:
            pg, _ = await run.page(ctx, key)
            await pg.wait_for_timeout(150)
            for c in await chips(pg):
                expect(sec, c["hidden"], f"/{key} (empty storage): the {c['p']} chip shows {c['t']!r}")
            for c in await series_chips(pg):
                expect(sec, c["hidden"], f"/{key} (empty storage): the card of {c['ps'][0]}'s series shows {c['t']!r}")
            if key in stepper and not key.endswith("labs/"):
                s = await steps(pg)
                got = [(x["done"], x["t"]) for x in s["li"]]
                want = [(False, t) for t in defaults(key)]
                expect(sec, got == want, f"/{key} (empty storage): stepper {got}, expected {want}")
            await pg.close()
    finally:
        await ctx.close()
    # "watched" counts seconds actually played: a seek to the end, or one late chapter, isn't the film.
    # To play most of a film quickly, the soundtrack runs 16 times faster and the page's clock (performance.now) 20 times.
    fast = "{ const pn = performance.now.bind(performance); performance.now = () => pn() * 20; }"
    sec["notes"].append("\"watched\": each film played at 16× with the page clock at 20×")

    async def watch_film(key, store, others):
        async with run.sem:
            ctx = await seeded({})
            try:
                pg, _ = await run.page(ctx, key)
                await run.ready(pg)
                await pg.evaluate("() => FILM.seek(TL.total * 0.9)")
                await pg.wait_for_timeout(3500)
                r = await pg.evaluate("k => localStorage.getItem(k)", store + ":watched")
                expect(sec, r is None, f"/{key}: a seek to 90% of the film marked it watched")
                await pg.close()
                await ctx.close()
                ctx = await seeded({})
                await ctx.add_init_script(fast)
                pg, _ = await run.page(ctx, key)
                await run.ready(pg)
                late = await pg.evaluate("() => SCENES[SCENES.length - 2].id")
                await pg.evaluate("id => { FILM.playScene(id, true); document.getElementById('snd').playbackRate = 16; }", late)
                await pg.wait_for_function("() => !FILM.playing()", timeout=30000)
                await pg.wait_for_timeout(2500)
                r = await pg.evaluate("k => localStorage.getItem(k)", store + ":watched")
                expect(sec, r is None, f"/{key}: playing only the chapter {late!r} marked the film watched")
                await pg.evaluate("() => { FILM.seek(0); FILM.play(); document.getElementById('snd').playbackRate = 16; }")
                try:
                    await pg.wait_for_function(f"() => localStorage.getItem({json.dumps(store + ':watched')}) === 'true'", timeout=90000)
                except Exception:  # noqa: BLE001
                    pass
                r = await pg.evaluate("ks => ks.map(k => localStorage.getItem(k + ':watched'))", [store] + others)
                t = await pg.evaluate("() => [FILM.time(), TL.total]")
                expect(sec, r[0] == "true", f"/{key}: after playing {t[0]:.0f} of {t[1]:.0f} s, {store}:watched is {r[0]}")
                expect(sec, all(x is None for x in r[1:]), f"/{key}: watching this film marked another one watched: {dict(zip(others, r[1:]))}")
                await pg.close()
                if store == "ld-silent-change":
                    tk = ("es/" if key.startswith("es/") else "") + "topics/"
                    pg, _ = await run.page(ctx, tk)
                    c = [c for c in await series_chips(pg) if store in c["ps"]]
                    want = c and fill(c[0]["T"]["films"], {"n": 1, "of": len(c[0]["ps"])})
                    expect(sec, c and not c[0]["hidden"] and c[0]["t"] == want, f"/{tk}: the When things go wrong card reads {c and c[0]['t']!r} after watching Silent change, expected {want!r}")
                    await pg.close()
            finally:
                await ctx.close()

    await asyncio.gather(*(watch_film(*a) for a in (("", "ld", ["ld3", "ld-silent-change"]), ("sketch/", "ld3", ["ld", "ld-silent-change"]),
                                                    ("when-things-go-wrong/silent-change/", "ld-silent-change", ["ld", "ld3"]),
                                                    ("es/when-things-go-wrong/silent-change/", "ld-silent-change", ["ld", "ld3"]))))
    # the pop-up player on /labs/ never marks the intro as watched
    ctx = await seeded({})
    try:
        pg, _ = await run.page(ctx, "labs/#people")
        await run.ready(pg)
        await pg.click("#stop-panel .stop-nav button")
        await pg.wait_for_timeout(500)
        await pg.evaluate("() => { document.getElementById('snd').playbackRate = 16; }")
        try:
            await pg.wait_for_function("() => !FILM.playing()", timeout=60000)
        except Exception:  # noqa: BLE001
            pass
        await pg.wait_for_timeout(3500)
        r = await pg.evaluate("() => ({w: localStorage.getItem('ld:watched'), t: FILM.time(), total: TL.total})")
        expect(sec, r["t"] > r["total"] * 0.85, f"/labs/#people: the clip didn't play to the end of the film ({r['t']:.1f} of {r['total']:.1f} s)")
        expect(sec, r["w"] is None, "/labs/: playing the \"people\" clip marked the intro as watched")
        await pg.close()
    finally:
        await ctx.close()


# ---------------------------------------------------------------- 10. storage blocked
async def check_nostorage(run):
    sec = run.rep.sec("nostorage", "Storage blocked (private window): every page still renders, with no chips and no errors")
    init = "Object.defineProperty(window, 'localStorage', {get() { throw new DOMException('blocked', 'SecurityError'); }});"
    keys = [k for k, pg in run.static.items() if not pg.redirect and not pg.is404]

    async def one(key):
        async with run.sem:
            ctx = await run.context(1280, init=init)
            try:
                pg, log = await run.page(ctx, key)
                await run.ready(pg)
                await pg.wait_for_timeout(300)
                for p in log_problems(log):
                    expect(sec, False, f"/{key}: {p}")
                r = await pg.evaluate("() => ({chips: [...document.querySelectorAll('[data-progress]')].filter(e => !e.hidden).length, h1: !!document.querySelector('h1')})")
                expect(sec, r["chips"] == 0 and r["h1"], f"/{key}: with storage blocked, {r['chips']} chips show, heading {r['h1']}")
            finally:
                await ctx.close()

    await asyncio.gather(*(one(k) for k in keys))


# ---------------------------------------------------------------- 11. phones
async def check_mobile(run):
    sec = run.rep.sec("mobile", "Phones and tablets: cards stack and the whole card is a link, anchors clear the header and the course bar, panels sit below the film up to 900 px and inside it above")
    grids = [k for k, pg in run.static.items() if not pg.redirect and (pg.dom.first(cls="topic-grid") or pg.dom.first(cls="topic-tiles"))]
    ctx = await run.context(390)
    try:
        for key in grids:
            pg, _ = await run.page(ctx, key)
            xs = await pg.evaluate("() => [...document.querySelectorAll('.topic-grid')].map(g => [...g.querySelectorAll(':scope > .topic-card')].map(c => Math.round(c.getBoundingClientRect().left)))")
            expect(sec, all(len(set(g)) <= 1 for g in xs), f"/{key} @390: topic cards don't stack in one column ({xs})")
            ts = await pg.evaluate("() => [...document.querySelectorAll('.topic-tiles > .topic-tile')].map(c => Math.round(c.getBoundingClientRect().left))")
            expect(sec, len(set(ts)) <= 1, f"/{key} @390: the topics' tiles don't stack in one column ({ts})")
            await pg.close()
        # the whole card is one link, and the buttons inside the wide card still work
        for width in (390, 1280):
            c2 = await run.context(width)
            try:
                async def tap(sel):  # a real tap at the element's centre: the card's link covers the whole card
                    el = pg.locator(sel).first
                    await el.scroll_into_view_if_needed()
                    b = await el.bounding_box()
                    await pg.mouse.click(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)
                    await pg.wait_for_load_state("load")
                    await pg.wait_for_timeout(200)

                pg, _ = await run.page(c2, "topics/")
                await tap("#data-modelling .topic-card:not(.series-card) img")
                expect(sec, run.key(pg.url) == "sketch/", f"/topics/ @{width}: tapping the Sketch card's picture went to /{run.key(pg.url)}")
                await pg.goto(run.url("topics/"), wait_until="load")
                await tap("#data-platforms .topic-card .tc-body > p:not(.kicker)")
                expect(sec, run.key(pg.url) == "", f"/topics/ @{width}: tapping the intro card's text went to /{run.key(pg.url)}")
                await pg.goto(run.url("topics/"), wait_until="load")
                await tap("#enterprise-architecture .series-card .sc-media")
                expect(sec, run.key(pg.url) == "enterprise-architecture/", f"/topics/ @{width}: tapping The map before the data's picture went to /{run.key(pg.url)}")
                await pg.close()
            finally:
                await c2.close()
        # anchors land below the sticky header
        for width in (390, 1280):
            c2 = await run.context(width)
            try:
                for key, anchor in (("", "watch"), ("", "go-deeper"), ("topics/", "data-modelling"), ("topics/", "enterprise-architecture"), ("es/", "go-deeper"),
                                    ("when-things-go-wrong/silent-change/", "think-it-through")):
                    pg, _ = await run.page(c2, f"{key}#{anchor}")
                    await run.settle(pg)
                    r = await pg.evaluate("a => ({top: document.getElementById(a).getBoundingClientRect().top, head: Math.max(...[...document.querySelectorAll('header.top, nav.course')].map(e => e.getBoundingClientRect().bottom)), ih: innerHeight})", anchor)
                    expect(sec, r["head"] - 1 <= r["top"] < r["ih"], f"/{key}#{anchor} @{width}: lands at {r['top']:.0f} px, under the header ({r['head']:.0f} px) or off screen")
                    await pg.close()
            finally:
                await c2.close()
        # up to 900 px the panels sit below the film (the longer questions are taller than the frame there), and their buttons wrap;
        # wider, the panel sits on the frame and never covers the controls
        BOX = """sel => { const p = document.querySelector(sel), c = document.getElementById('film').getBoundingClientRect(), b = p.getBoundingClientRect(),
              bar = document.querySelector('.player .bar').getBoundingClientRect();
              return {below: b.top >= c.bottom - 1, inside: b.top >= c.top - 1 && b.bottom <= bar.top + 1, fits: p.scrollWidth <= p.clientWidth + 1,
                      page: document.documentElement.scrollWidth <= innerWidth}; }"""
        for width in (390, 768, 1024):
            c2 = await run.context(width)
            try:
                for key in ("", "when-things-go-wrong/silent-change/", "es/when-things-go-wrong/silent-change/", "sketch/"):
                    pg, _ = await run.page(c2, key)
                    await run.ready(pg)
                    ok = (lambda r: r["below"] and r["fits"] and r["page"]) if width <= 900 else (lambda r: r["inside"] and r["page"])
                    await pg.evaluate("() => { FILM.seek(TL.total - 0.3); FILM.play(); }")
                    await pg.wait_for_selector(".player .think.next", timeout=5000)
                    r = await pg.evaluate(BOX, ".player .think.next")
                    expect(sec, ok(r), f"/{key} @{width}: the \"Where next?\" panel {r}")
                    if await pg.evaluate("() => !!document.getElementById('think') && !!(window.LEARN && LEARN.think)"):
                        await pg.keyboard.press("Escape")
                        await run.think(pg, True)
                        # the longest question, answered (the answer makes the card tallest)
                        sid = await pg.evaluate("() => Object.keys(LEARN.think.qs).sort((a, b) => { const n = q => q.q.length + q.why.length + q.opts.map(o => o.t).join('').length; return n(LEARN.think.qs[b]) - n(LEARN.think.qs[a]); })[0]")
                        await pg.evaluate("id => { const s = SCENES.find(x => x.id === id); FILM.seek(s.start + s.dur - 1); FILM.play(); }", sid)
                        try:
                            await pg.wait_for_selector(".player .think:not(.next)", timeout=6000)
                            await pg.click(".player .think .think-opt >> nth=0")
                            await pg.wait_for_timeout(100)
                            r = await pg.evaluate(BOX, ".player .think:not(.next)")
                            expect(sec, ok(r), f"/{key} @{width}: the \"Pause and think\" panel ({sid}, answered) {r}")
                        except Exception:  # noqa: BLE001
                            expect(sec, False, f"/{key} @{width}: no \"Pause and think\" panel after {sid}")
                        await run.think(pg, False)
                    await pg.close()
            finally:
                await c2.close()
    finally:
        await ctx.close()


# ---------------------------------------------------------------- 11b. headings and text contrast
CONTRAST_JS = """() => {
  // text on the page (not on the films' dark stages, which have their own colours), against the colour behind it
  const skip = '.player, .stage, .lab, .map, .qvis, canvas, dialog, .think, noscript, .sr, [hidden]';
  const rgba = c => { let m = c.match(/^rgba?\\(([^)]+)\\)/); if (m) { const p = m[1].split(/[\\s,\\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
    m = c.match(/^color\\(srgb ([^)]+)\\)/); if (m) { const p = m[1].split(/[\\s\\/]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; }
    return null; };
  const over = (top, under) => { const a = top[3]; return [0, 1, 2].map(i => top[i] * a + under[i] * (1 - a)).concat([1]); };
  const lum = c => { const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  function behind(el) {  // the backgrounds from el up to the first opaque one, composited; null over an image or a gradient
    const layers = [];
    for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.backgroundImage !== 'none') return null;
      const c = rgba(cs.backgroundColor); if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; } }
    let bg = [255, 255, 255, 1]; for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg); return bg; }
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest(skip) || !el.getClientRects().length) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const cs = getComputedStyle(el); if (cs.visibility !== 'visible') continue;
    let op = 1; for (let n = el; n; n = n.parentElement) op *= +getComputedStyle(n).opacity;
    if (op < 0.5) continue;  // a disabled control, faded on purpose
    const bg = behind(el), fg = rgba(cs.color); if (!bg || !fg) continue;
    const r = ratio(over([fg[0], fg[1], fg[2], fg[3] * op], bg), bg), size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    if (r < need) out.push({t: el.textContent.trim().slice(0, 40), sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).join('.') : ''), r: Math.round(r * 100) / 100, need});
  }
  return out; }"""


async def check_a11y(run):
    sec = run.rep.sec("a11y", "Headings never skip a level, and page text meets WCAG AA contrast, in light and dark")
    keys = [k for k, pg in run.static.items() if not pg.redirect]
    # some progress, so the cards' chips show too
    seed = "try { localStorage.setItem('ld:watched', 'true'); localStorage.setItem('ld3:visited', '[\"grain\"]'); localStorage.setItem('ld-silent-change:watched', 'true'); } catch (e) {}"

    async def one(key, theme):
        async with run.sem:
            ctx = await run.context(1280, theme, init=seed)
            try:
                pg, _ = await run.page(ctx, key)
                await run.ready(pg)
                await pg.wait_for_timeout(300)
                await pg.evaluate("() => document.querySelectorAll('details').forEach(d => { d.open = true; })")
                if theme == "light":
                    hs = await pg.evaluate("() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => !h.closest('template')).map(h => [+h.tagName[1], h.textContent.trim().slice(0, 40)])")
                    expect(sec, sum(1 for h in hs if h[0] == 1) == 1, f"/{key}: {sum(1 for h in hs if h[0] == 1)} h1 headings")
                    for a, b in zip(hs, hs[1:]):
                        expect(sec, b[0] <= a[0] + 1, f"/{key}: h{a[0]} {a[1]!r} is followed by h{b[0]} {b[1]!r}")
                for x in await pg.evaluate(CONTRAST_JS):
                    expect(sec, False, f"/{key} {theme}: {x['sel']} {x['t']!r} is {x['r']}:1 (needs {x['need']}:1)")
            finally:
                await ctx.close()

    await asyncio.gather(*(one(k, t) for k in keys for t in THEMES))
    sec["notes"].append(f"{len(keys)} pages × 2 themes, after their scripts ran")


# ---------------------------------------------------------------- 12. the words drawn in the films
NUM = check_site.NUMBERING
DRAWN_JS = """async (step) => {
  const seen = new Set(), P = CanvasRenderingContext2D.prototype, f = P.fillText, s = P.strokeText;
  P.fillText = function (t, ...a) { seen.add(String(t)); return f.call(this, t, ...a); };
  P.strokeText = function (t, ...a) { seen.add(String(t)); return s.call(this, t, ...a); };
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
  try { for (let t = 0; t < TL.total; t += step) renderFrame(ctx, 1, t); renderFrame(ctx, 1, TL.total - 3); }
  finally { P.fillText = f; P.strokeText = s; }
  return [...seen]; }"""


async def check_drawn(run):
    sec = run.rep.sec("drawn", "Films: no numbering drawn on screen or in captions; the Sketch board and end card name no film")
    ctx = await run.context(1280)
    try:
        for key, step in (("", 1.0), ("es/", 1.0), ("sketch/", 0.5), ("when-things-go-wrong/silent-change/", 1.0)):
            pg, log = await run.page(ctx, key)
            await run.ready(pg)
            texts = await pg.evaluate(DRAWN_JS, step)
            bad = sorted({t for t in texts if NUM.search(t)})
            expect(sec, not bad, f"/{key}: the film draws {bad}")
            if key == "sketch/":
                for want in ("Conceptual model · the sketch we drew", "Learning Data · Data modelling"):
                    expect(sec, want in texts, f"/sketch/: the film never draws {want!r}")
            sec["notes"].append(f"/{key}: {len(texts)} distinct strings drawn")
            await pg.close()
    finally:
        await ctx.close()


# ---------------------------------------------------------------- 13. screenshots for a visual review
async def take_shots(run):
    sec = run.rep.sec("shots", "Screenshots for a visual review")
    out = pathlib.Path(run.shots)
    out.mkdir(parents=True, exist_ok=True)
    n = 0
    for key in ("", "topics/", "when-things-go-wrong/", "when-things-go-wrong/silent-change/", "sketch/", "es/sketch/",
                "es/", "es/topics/", "es/when-things-go-wrong/silent-change/", "404.html"):
        for width in (390, 1280):
            for theme in THEMES:
                ctx = await run.context(width, theme)
                try:
                    pg, _ = await run.page(ctx, key)
                    await run.ready(pg)
                    await pg.wait_for_timeout(400)
                    name = (key.strip("/").replace("/", "_") or "home") + f"-{width}-{theme}.png"
                    await pg.screenshot(path=str(out / name), full_page=True)
                    n += 1
                finally:
                    await ctx.close()
    sec["notes"].append(f"{n} screenshots in {out}")


CHECKS = {"pages": check_pages, "notfound": check_404, "deeplinks": check_deeplinks, "chapters": check_chapter_links,
          "players": check_players, "sealed": check_sealed, "nextpanel": check_next, "think-silent": check_think_silent,
          "think-home": check_think_home, "progress": check_progress, "nostorage": check_nostorage,
          "mobile": check_mobile, "a11y": check_a11y, "drawn": check_drawn}


async def amain(args):
    from playwright.async_api import async_playwright
    rep = Report()
    proc = root = None
    if args.base:
        base = args.base if args.base.endswith("/") else args.base + "/"
    else:
        proc, root, base = start_server(args.port)
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
            run = Run(browser, base, rep, args.shots)
            names = args.only.split(",") if args.only else list(CHECKS)
            for n in names:
                if n not in CHECKS:
                    sys.exit(f"no check named {n!r}; see --list")
            print(f"Testing {base} in Chromium {browser.version}: {', '.join(names)}", flush=True)
            for n in names:
                t0 = time.time()
                try:
                    await CHECKS[n](run)
                except Exception as e:  # noqa: BLE001
                    rep.sec(n, n)["fails"].append(f"the check stopped: {type(e).__name__}: {str(e).splitlines()[0][:300]}")
                print(f"  {n}: {time.time() - t0:.0f} s", flush=True)
            if args.shots:
                await take_shots(run)
            await browser.close()
    finally:
        if proc:
            stop_server(proc, root)
    print()
    return rep.done()


def main():
    ap = argparse.ArgumentParser(description="Browser checks for the Learning Data site.")
    ap.add_argument("--port", type=int, default=8110)
    ap.add_argument("--base")
    ap.add_argument("--only")
    ap.add_argument("--shots")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()
    if args.list:
        print("\n".join(CHECKS))
        return 0
    return asyncio.run(amain(args))


if __name__ == "__main__":
    sys.exit(main())
