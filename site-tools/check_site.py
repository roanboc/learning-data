#!/usr/bin/env python3
"""Static checks for the Learning Data site. Run before every commit, from anywhere:

    python site-tools/check_site.py

It only reads files: no browser and no network (site-tools/smoke.py does the browser checks).
It prints what each check found, and exits with 1 if anything fails.

What it checks, page by page (every .html under site/):
- links: every local href and src resolves to a file (a folder means its index.html; /learning-data/... and
  https://roanboc.github.io/learning-data/... map to site/), every #id exists on its target page (except #t=,
  and the lab and old home hashes that scripts read), GitHub blob/tree links name a file in this repo, and
  download links name a file the release workflow publishes. Links inside the "Pause and think" packs count too.
- header: Start here, Topics, Making of, then EN and ES, with the right targets and the right current page.
- no leftover labels in the nav (Watch, Take it apart, Sharpen it, All films, Mira, Desarma).
- hreflang: exactly the pairs of real twins, each pointing back.
- the footer's one link (the source on GitHub), breadcrumbs, and the course bar (the sticky Watch · Labs · Scenarios steps).
- no film numbering (on the site and in the Markdown docs), and no stale film lengths.
- one film bundle per page, scripts in order, and each film's progress prefix where it belongs.
- Spanish pages: in Spanish, linking to Spanish pages when a twin exists, and marking links to English-only pages.
- the journey pages are what site-tools/build_pages.py makes from their Markdown.
"""
import html.parser
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse
from collections import Counter, defaultdict

ROOT = pathlib.Path(__file__).resolve().parents[1]
WEB = ROOT / "site"
SITE = "https://roanboc.github.io/learning-data/"
REPO = "https://github.com/roanboc/learning-data"
RELEASE_YML = ROOT / ".github/workflows/release.yml"

# ---------------------------------------------------------------- the site's rules, in one place
# pages with a real twin in the other language (§3.2); everything else has no hreflang
TWINS = ["", "labs/", "scenarios/", "journey/", "topics/", "sketch/", "when-things-go-wrong/",
         "when-things-go-wrong/silent-change/", "when-things-go-wrong/too-good-to-be-true/",
         "when-things-go-wrong/too-good-to-be-true/labs/", "when-things-go-wrong/too-good-to-be-true/scenarios/"]
# English-only pages and where their ES toggle goes
ES_TOGGLE = {"sketch/labs/": "es/sketch/", "sketch/scenarios/": "es/sketch/"}
NAV = {"en": ["Start here", "Topics", "Making of"], "es": ["Empieza aquí", "Temas", "Cómo se hizo"]}
# the footer holds no second navigation, only the source
FOOT = {"en": "Source on GitHub", "es": "Código en GitHub"}
OLD_NAV = {"Watch", "Take it apart", "Sharpen it", "All films", "Mira", "Desarma", "Labs", "Scenarios", "Situaciones"}
CRUMBS = {  # page: (text, the pages its links go to, in order)
    "labs/": ("Start here › The Inner Life of Data", [""]),
    "scenarios/": ("Start here › The Inner Life of Data", [""]),
    "es/labs/": ("Empieza aquí › La vida interior de los datos", ["es/"]),
    "es/scenarios/": ("Empieza aquí › La vida interior de los datos", ["es/"]),
    "sketch/": ("Topics › Data modelling", ["topics/"]),
    "es/sketch/": ("Temas › Modelado de datos", ["es/topics/"]),
    "sketch/labs/": ("Topics › Data modelling", ["topics/", "sketch/"]),
    "sketch/scenarios/": ("Topics › Data modelling", ["topics/", "sketch/"]),
    "when-things-go-wrong/": ("Topics › When things go wrong", ["topics/"]),
    "es/when-things-go-wrong/": ("Temas › Cuando algo sale mal", ["es/topics/"]),
    "when-things-go-wrong/silent-change/": ("Topics › When things go wrong", ["topics/", "when-things-go-wrong/"]),
    "es/when-things-go-wrong/silent-change/": ("Temas › Cuando algo sale mal", ["es/topics/", "es/when-things-go-wrong/"]),
    **{f"{lg}when-things-go-wrong/too-good-to-be-true/{sub}": crumb
       for lg, crumb in (("", ("Topics › When things go wrong", ["topics/", "when-things-go-wrong/"])),
                         ("es/", ("Temas › Cuando algo sale mal", ["es/topics/", "es/when-things-go-wrong/"])))
       for sub in ("", "labs/", "scenarios/")},
}
# the film bundles (one per page: they declare the same top-level names) and the progress prefix of each film
BUNDLES = {"assets/film/film.js": "ld", "assets/film/film.es.js": "ld",
           "assets/film3/film.js": "ld3", "assets/silent-change/film.js": "ld-silent-change",
           "assets/too-good-to-be-true/film.js": "ld-too-good-to-be-true"}
# the Making of films, sealed in a function each with their own element prefix, so both can play on one page; they record no progress
SEALED = {"assets/making-of/data-for-films.js": "dff", "assets/making-of/thats-not-quite-right.js": "nqr"}
PACKS = {"assets/learn/learn.en.js", "assets/learn/learn.es.js",
         "assets/silent-change/think.en.js", "assets/silent-change/think.es.js",
         "assets/too-good-to-be-true/think.en.js", "assets/too-good-to-be-true/think.es.js"}
# "Pause and think" packs whose stops are the film's own labs (the rest point to The Inner Life of Data's): the labs page, and the pack that names its labs
OWN_LABS = {"assets/too-good-to-be-true/think.en.js": ("when-things-go-wrong/too-good-to-be-true/labs/index.html", "assets/too-good-to-be-true/learn.en.js"),
            "assets/too-good-to-be-true/think.es.js": ("es/when-things-go-wrong/too-good-to-be-true/labs/index.html", "assets/too-good-to-be-true/learn.es.js")}
# a film's labs and scenarios, as its stepper and topic cards count them (None: it has none)
COUNTS = {"ld": ("8", "12"), "ld3": ("6", "12"), "ld-silent-change": (None, None), "ld-too-good-to-be-true": ("3", "10")}
# no film numbering (§8); only these code comments may match, and film3/film.js's recap line if it was never re-voiced
NUMBERING = re.compile(r"film (one|two|three|[123])\b|(first|second|third) film|(primera|segunda|tercera) película|"
                       r"episod(e|io) [0-9]|\b(first|second|third) (video|episode)\b|"
                       r"\b(primer|segundo|tercer)[oa]? (video|episodio)\b|película (uno|dos|tres|[123])\b", re.I)
COMMENT_OK = {"assets/film3/film.js", "assets/silent-change/film.js", "assets/too-good-to-be-true/film.js"}
LENGTHS = re.compile(r"eight-minute|five-minute|six-minute|nueve minutos|seis minutos|· 8 min|· 9 min|· 5 min|"
                     r"\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)-minute\b|"
                     r"\b(un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez) minutos\b|"
                     r"(?<![\d½.,:])\d+ ?(min|minute|minutes|minuto|minutos)\b", re.I)
# the stated lengths: 7½ (intro, EN), 8½ (intro, ES), 5½ (A Sharper Sketch, Silent change), and 6 min (Too good to be true)
HALVES = {"en": {"5½", "7½"}, "es": {"5½", "8½"}}
WHOLE = {"6 min"}
# the Making of page states its two films' lengths: 5 min (Data for Films) and 4½ min (That's not quite right)
MAKING_OF_PAGES = {"journey/index.html", "es/journey/index.html", "journey/index.md", "es/journey/index.md"}
WORDS = {"en": "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen "
               "seventeen eighteen nineteen twenty".split(),
         "es": "uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis "
               "diecisiete dieciocho diecinueve veinte".split()}
TEXT_EXT = {".html", ".js", ".css", ".md", ".json", ".txt", ".svg", ".xml", ".vtt", ".srt", ".webmanifest"}
BLOCK = {"address", "article", "aside", "blockquote", "br", "dd", "details", "div", "dl", "dt", "figcaption", "figure",
         "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li", "main", "nav", "ol", "p", "section",
         "summary", "table", "td", "th", "tr", "ul"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}


# ---------------------------------------------------------------- a small DOM, from the standard library's parser
class Node:
    def __init__(self, tag, attrs, parent, line):
        self.tag, self.attrs, self.parent, self.line, self.kids = tag, attrs, parent, line, []

    @property
    def cls(self):
        return (self.attrs.get("class") or "").split()

    def walk(self):
        for k in self.kids:
            if isinstance(k, Node):
                yield k
                yield from k.walk()

    def all(self, tag=None, cls=None, **attrs):
        out = []
        for n in self.walk():
            if tag and n.tag != tag:
                continue
            if cls and cls not in n.cls:
                continue
            if any(n.attrs.get(k.replace("_", "-")) != v if v is not True else k.replace("_", "-") not in n.attrs
                   for k, v in attrs.items()):
                continue
            out.append(n)
        return out

    def first(self, tag=None, cls=None, **attrs):
        r = self.all(tag, cls, **attrs)
        return r[0] if r else None

    def elements(self):
        return [k for k in self.kids if isinstance(k, Node)]

    def text(self):
        out = []
        for k in self.kids:
            if isinstance(k, Node):
                if k.tag not in ("script", "style"):
                    out.append(f" {k.text()} " if k.tag in BLOCK else k.text())
            else:
                out.append(k)
        return re.sub(r"\s+", " ", "".join(out)).strip()

    def up(self, pred):
        n = self.parent
        while n is not None:
            if pred(n):
                return n
            n = n.parent
        return None

    def lang(self):
        n = self
        while n is not None:
            if "lang" in n.attrs:
                return n.attrs["lang"]
            n = n.parent
        return None


class Parser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", {}, None, 0)
        self.cur = self.root
        self.problems = []

    def handle_starttag(self, tag, attrs):
        n = Node(tag, {k: (v if v is not None else "") for k, v in attrs}, self.cur, self.getpos()[0])
        self.cur.kids.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.kids.append(Node(tag, {k: (v if v is not None else "") for k, v in attrs}, self.cur, self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if self.cur.tag != tag:
            self.problems.append(f"line {self.getpos()[0]}: </{tag}> closes <{self.cur.tag}> (from line {self.cur.line})")
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.kids.append(data)


# ---------------------------------------------------------------- pages
class Page:
    def __init__(self, path):
        self.path = path
        self.file = path.relative_to(WEB).as_posix()                       # "sketch/labs/index.html"
        self.key = self.file[:-len("index.html")] if self.file.endswith("index.html") else self.file  # "sketch/labs/"
        self.url = SITE + self.key
        self.src = path.read_text(encoding="utf-8")
        p = Parser()
        p.feed(self.src)
        p.close()
        if p.cur is not p.root:
            p.problems.append(f"<{p.cur.tag}> from line {p.cur.line} is never closed")
        self.markup = p.problems
        self.dom = p.root
        h = self.dom.first("html")
        self.lang = h.attrs.get("lang", "") if h else ""
        self.ids = Counter(n.attrs["id"] for n in self.dom.walk() if n.attrs.get("id"))
        self.redirect = bool(self.dom.first("meta", http_equiv="refresh"))
        self.is404 = self.file == "404.html"
        self.scripts = [n for n in self.dom.all("script")]
        self.local_scripts = []
        for s in self.scripts:
            if s.attrs.get("src"):
                kind, target, _ = resolve(self, s.attrs["src"])
                if kind == "site":
                    self.local_scripts.append(target)
        self.bundles = [s for s in self.local_scripts if s in BUNDLES]
        self.sealed = [s for s in self.local_scripts if s in SEALED]

    @property
    def es(self):
        return self.key.startswith("es/")

    def twin_key(self):
        base = self.key[3:] if self.es else self.key
        if base not in TWINS:
            return None
        return base if self.es else "es/" + base


def resolve(page, ref):
    """-> (kind, target, fragment). kind: site (target = path under site/), repo (path in this repo),
    release (file name), external, special."""
    ref = ref.strip()
    if not ref or re.match(r"(mailto|tel|javascript|data|blob):", ref, re.I):
        return "special", None, None
    url, frag = urllib.parse.urldefrag(urllib.parse.urljoin(page.url, ref))
    if url.startswith(SITE) or url + "/" == SITE:
        path = urllib.parse.unquote(urllib.parse.urlsplit(url).path)[len("/learning-data/"):]
        return "site", path, frag
    if urllib.parse.urlsplit(url).netloc == urllib.parse.urlsplit(SITE).netloc:
        return "outside", url, frag  # too many ../: the link climbs out of /learning-data/
    m = re.match(re.escape(REPO) + r"/(?:blob|tree)/main/(.*)$", url)
    if m:
        return "repo", urllib.parse.unquote(m.group(1)).rstrip("/"), frag
    m = re.match(re.escape(REPO) + r"/releases/(?:latest/)?download/(?:[^/]+/)?([^/]+)$", url)
    if m:
        return "release", m.group(1), frag
    return "external", url, frag


def file_of(path):
    """site/ path of a link target -> (file under site/ or None, problem or None)"""
    if path == "" or path.endswith("/"):
        f = path + "index.html"
    else:
        f = path
    if (WEB / f).is_file():
        return f, None
    if (WEB / f).is_dir():
        return None, "is a folder: add a trailing /"
    return None, "missing"


def key_of(f):
    return f[:-len("index.html")] if f.endswith("index.html") else f


# ---------------------------------------------------------------- report
class Report:
    def __init__(self):
        self.sections = []

    def check(self, name):
        s = {"name": name, "fails": [], "notes": []}
        self.sections.append(s)
        return s

    def done(self):
        bad = 0
        for s in self.sections:
            ok = not s["fails"]
            bad += not ok
            print(f"{'PASS' if ok else 'FAIL'}  {s['name']}" + ("" if ok else f"  ({len(s['fails'])})"))
            for f in s["fails"]:
                print(f"      - {f}")
            for n in s["notes"]:
                print(f"      · {n}")
        print()
        print(f"{len(self.sections) - bad} of {len(self.sections)} checks passed." +
              (" All good." if not bad else f" {bad} failed."))
        return 1 if bad else 0


def js_comment_spans(src):
    """Where the comments are in a JavaScript file: [(start, end)]. Skips strings, template literals and
    (roughly) regular expressions, so a // inside a string isn't taken for a comment."""
    spans, i, n = [], 0, len(src)
    prev = ""  # last significant character, to tell a regex from a division
    while i < n:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            j = n if j < 0 else j
            spans.append((i, j))
            i = j
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            spans.append((i, j))
            i = j
            continue
        if c in "'\"`":
            j = i + 1
            while j < n and src[j] != c:
                j += 2 if src[j] == "\\" else 1
            i = j + 1
            prev = c
            continue
        if c == "/" and (prev == "" or prev in "(,=:[!&|?{};+-*%<>~^\n" or re.search(r"\b(return|typeof|case|in|of)\s*$", src[max(0, i - 12):i])):
            j, cls = i + 1, False
            while j < n and src[j] != "\n":
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == "[":
                    cls = True
                elif src[j] == "]":
                    cls = False
                elif src[j] == "/" and not cls:
                    break
                j += 1
            i = j + 1
            prev = "/"
            continue
        if not c.isspace():
            prev = c
        i += 1
    return spans


# ---------------------------------------------------------------- the checks
def main():
    rep = Report()
    pages = {}
    for p in sorted(WEB.rglob("*.html")):
        pg = Page(p)
        pages[pg.file] = pg
    by_key = {pg.key: pg for pg in pages.values()}
    normal = [pg for pg in pages.values() if not pg.redirect]
    release_names = RELEASE_YML.read_text() if RELEASE_YML.exists() else ""
    intro_stops = re.findall(r'\["(\w+)","\w+",\[', (WEB / "assets/learn/learn.js").read_text())
    sketch_labs = re.findall(r'\bid:"(\w+)"', (WEB / "assets/sketch/sketch.js").read_text())

    # -- markup
    s = rep.check("Markup: tags balanced, ids unique, labels point at real ids, images have alt text")
    for pg in pages.values():
        for m in pg.markup:
            s["fails"].append(f"{pg.file}: {m}")
        for i, c in pg.ids.items():
            if c > 1:
                s["fails"].append(f"{pg.file}: id \"{i}\" appears {c} times")
        for n in pg.dom.walk():
            for a in ("aria-labelledby", "aria-describedby", "for"):
                for ref in (n.attrs.get(a) or "").split():
                    if ref not in pg.ids:
                        s["fails"].append(f"{pg.file}:{n.line}: {a}=\"{ref}\" has no element with that id")
            if n.tag == "img" and "alt" not in n.attrs:
                s["fails"].append(f"{pg.file}:{n.line}: <img> without alt")
        if pg.lang != ("es" if pg.es else "en"):
            s["fails"].append(f"{pg.file}: <html lang=\"{pg.lang}\">, expected \"{'es' if pg.es else 'en'}\"")

    # -- links
    s = rep.check("Links: every local href and src resolves, and every #id exists on its target page")
    checked = 0

    def check_link(pg, ref, where, frag_ok=True):
        nonlocal checked
        kind, target, frag = resolve(pg, ref)
        checked += 1
        if kind == "site":
            f, problem = file_of(target)
            if problem:
                s["fails"].append(f"{where}: {ref} → site/{target} {problem}")
                return None
            if frag and f in pages and frag_ok:
                check_frag(pg, ref, where, pages[f], frag)
            return f
        if kind == "outside":
            s["fails"].append(f"{where}: {ref} climbs out of the site (to {target})")
        if kind == "repo":
            if target and not (ROOT / target).exists():
                s["fails"].append(f"{where}: {ref} → {target} is not in the repository")
        elif kind == "release":
            if target not in release_names:
                s["fails"].append(f"{where}: {ref} → the release workflow publishes no file named {target}")
        return None

    def check_frag(pg, ref, where, tp, frag):
        frag = urllib.parse.unquote(frag)
        if frag in tp.ids:
            return
        if re.fullmatch(r"t=\d+(:\d{1,2})?(\.\d+)?", frag):
            if tp.dom.first("canvas", id="film") or tp.redirect:
                return
            s["fails"].append(f"{where}: {ref}: #{frag} goes to a page without a film")
            return
        if tp.key in ("labs/", "es/labs/") and re.fullmatch(r"(explore[-/])?(\w+)", frag) and \
                re.fullmatch(r"(explore[-/])?(\w+)", frag).group(2) in intro_stops:
            return
        if tp.key == "sketch/labs/" and frag in sketch_labs:
            return
        if tp.dom.first(cls="path", data_home=True) and re.fullmatch(r"(explore|practise)([-/]\w+)?", frag):
            return
        s["fails"].append(f"{where}: {ref}: no id \"{frag}\" on {tp.file}")

    for pg in pages.values():
        for n in pg.dom.walk():
            for a in ("href", "src", "poster"):
                v = n.attrs.get(a)
                if v is None or (n.tag == "link" and n.attrs.get("rel") in ("preconnect", "dns-prefetch")):
                    continue
                if pg.is404 and not re.match(r"(/learning-data/|https?:|#|mailto:)", v):
                    s["fails"].append(f"{pg.file}:{n.line}: {a}=\"{v}\" is relative; the 404 page is served at any depth, so use /learning-data/…")
                check_link(pg, v, f"{pg.file}:{n.line}")
            if n.tag == "img" and n.attrs.get("srcset"):
                for part in n.attrs["srcset"].split(","):
                    check_link(pg, part.split()[0], f"{pg.file}:{n.line}")
            if n.tag == "meta" and (n.attrs.get("property") in ("og:image", "og:url") or n.attrs.get("name") == "twitter:image"):
                check_link(pg, n.attrs.get("content", ""), f"{pg.file}:{n.line}")
            if n.tag == "meta" and n.attrs.get("http-equiv", "").lower() == "refresh":
                m = re.search(r"url=(.+)$", n.attrs.get("content", ""), re.I)
                if m:
                    check_link(pg, m.group(1).strip(), f"{pg.file}:{n.line} (refresh)")
        for sc in pg.scripts:
            if not sc.attrs.get("src"):
                for m in re.finditer(r"location\.(?:replace|assign)\(\s*\"([^\"]*)\"", sc.text()):
                    check_link(pg, m.group(1), f"{pg.file}:{sc.line} (redirect)", frag_ok=False)
        # links the "Pause and think" packs add: "more" links, and each question's lab
        packs = [x for x in pg.local_scripts if x in PACKS]
        for pk in packs:
            src = (WEB / pk).read_text()
            # only think.js uses the pack's links (the labs and scenarios pages load the pack for other things)
            if "assets/learn/think.js" in pg.local_scripts:
                for m in re.finditer(r'href:"([^"]*)"', src):
                    check_link(pg, m.group(1), f"{pg.file} (via {pk})")
                player = pg.dom.first(cls="player")
                labs = player.attrs.get("data-labs", "labs/") if player is not None else "labs/"
                if labs:
                    f = check_link(pg, labs, f"{pg.file} (.player data-labs, via {pk})")
                    want = OWN_LABS[pk][0] if pk in OWN_LABS else "es/labs/index.html" if pg.es else "labs/index.html"
                    if f and f != want:
                        s["fails"].append(f"{pg.file}: \"Pause and think\" lab links go to site/{f}, expected site/{want}")
                    own = re.findall(r'\{id:"(\w+)"', (WEB / OWN_LABS[pk][1]).read_text()) if pk in OWN_LABS else None
                    for stop in sorted(set(re.findall(r'stop:"([a-z]\w*)"', src))):
                        if own is not None and stop not in own:
                            s["fails"].append(f"{pk}: stop \"{stop}\" is not one of this film's labs ({', '.join(own)})")
                        elif own is None and stop not in intro_stops:
                            s["fails"].append(f"{pk}: stop \"{stop}\" is not a lab of The Inner Life of Data ({', '.join(intro_stops)})")
    s["notes"].append(f"{checked} links on {len(pages)} pages")

    # -- header
    s = rep.check("Header: Start here · Topics · Making of · EN/ES on every page, with the right current page")
    for pg in normal:
        lang = "es" if pg.es else "en"
        head = pg.dom.first("header", cls="top")
        nav = head.first("nav") if head else None
        if nav is None:
            s["fails"].append(f"{pg.file}: no header.top nav")
            continue
        kids = nav.elements()
        links = [k for k in kids if k.tag == "a"]
        lang_box = [k for k in kids if k.tag == "span" and "lang" in k.cls]
        labels = [a.text() for a in links]
        want = NAV[lang]
        if labels != want or [k.tag for k in kids] != ["a"] * 3 + ["span"] or not lang_box:
            s["fails"].append(f"{pg.file}: nav reads {labels + ['EN/ES' if lang_box else '(no .lang)']}, expected {want + ['EN/ES']}")
            continue
        home = "es/" if pg.es else ""
        targets = [home, home + "topics/", home + "journey/"]
        for a, t in zip(links[:3], targets):
            kind, target, _ = resolve(pg, a.attrs.get("href", ""))
            f, _ = file_of(target) if kind == "site" else (None, None)
            if f != t + "index.html":
                s["fails"].append(f"{pg.file}: nav \"{a.text()}\" → {a.attrs.get('href')}, expected site/{t}")
        if any("nav-extra" in a.cls for a in links):
            s["fails"].append(f"{pg.file}: every nav link stays visible on phones (no nav-extra)")
        brand = head.first("a", cls="brand")
        bk, bt, _ = resolve(pg, brand.attrs.get("href", "")) if brand is not None else (None, None, None)
        if bk != "site" or file_of(bt)[0] != home + "index.html":
            s["fails"].append(f"{pg.file}: the brand must link to site/{home}")
        # language toggle
        tl = lang_box[0].all("a")
        if [a.text() for a in tl] != ["EN", "ES"]:
            s["fails"].append(f"{pg.file}: language toggle reads {[a.text() for a in tl]}, expected ['EN', 'ES']")
        else:
            for a, lg in zip(tl, ("en", "es")):
                kind, target, _ = resolve(pg, a.attrs.get("href", ""))
                f, problem = file_of(target) if kind == "site" else (None, "not a site page")
                if problem:
                    s["fails"].append(f"{pg.file}: {lg.upper()} → {a.attrs.get('href')} {problem}")
                    continue
                if pages[f].lang != lg:
                    s["fails"].append(f"{pg.file}: {lg.upper()} → site/{f}, which is not in {lg}")
                if lg == lang:
                    if not pg.is404 and f != pg.file:
                        s["fails"].append(f"{pg.file}: {lg.upper()} should stay on this page, goes to site/{f}")
                    if not pg.is404 and a.attrs.get("aria-current") != "true":
                        s["fails"].append(f"{pg.file}: {lg.upper()} is this page's language: add aria-current=\"true\"")
                else:
                    twin = pg.twin_key()
                    expect = twin if twin is not None else ("" if pg.es else ES_TOGGLE.get(pg.key, "es/" if not pg.is404 else "es/"))
                    if pg.is404:
                        expect = "es/"
                    if key_of(f) != expect:
                        s["fails"].append(f"{pg.file}: {lg.upper()} → site/{f}, expected site/{expect}")
                    has = a.attrs.get("hreflang") == lg
                    if twin is not None and not has:
                        s["fails"].append(f"{pg.file}: {lg.upper()} goes to this page's twin: add hreflang=\"{lg}\"")
                    if twin is None and has and not pg.is404:
                        s["fails"].append(f"{pg.file}: {lg.upper()} has hreflang, but this page has no twin")
        # current page
        cur = [(i, a.attrs.get("aria-current")) for i, a in enumerate(links) if "aria-current" in a.attrs]
        if sum(1 for _, v in cur if v == "page") > 1:
            s["fails"].append(f"{pg.file}: more than one nav link has aria-current=\"page\"")
        base = pg.key[3:] if pg.es else pg.key
        exp = None
        if base == "":
            exp = (0, "page")
        elif base == "topics/":
            exp = (1, "page")
        elif base == "journey/":
            exp = (2, "page")
        elif base.startswith(("labs/", "scenarios/")):
            exp = (0, "true")
        elif base.startswith(("sketch/", "when-things-go-wrong/")):
            exp = (1, "true")
        if pg.is404:
            exp = None
        if cur != ([exp] if exp else []):
            name = lambda c: f"{links[c[0]].text()}={c[1]}"
            s["fails"].append(f"{pg.file}: current marker {[name(c) for c in cur] or 'none'}, expected {[name(exp)] if exp else 'none'}")
    s["notes"].append(f"{len(normal)} pages with a header; {len(pages) - len(normal)} redirect pages skipped")

    # -- leftover labels
    s = rep.check("Nav: no leftover labels (Watch, Take it apart, Sharpen it, All films, Mira, Desarma…)")
    for pg in pages.values():
        for nav in pg.dom.all("nav"):
            for a in nav.all("a"):
                if a.text() in OLD_NAV:
                    s["fails"].append(f"{pg.file}:{a.line}: \"{a.text()}\" in <nav>")

    # -- hreflang
    s = rep.check("hreflang: exactly the pairs of real twins, each pointing back")
    alts = {}
    for pg in normal:
        alts[pg.file] = {n.attrs.get("hreflang"): n.attrs.get("href") for n in pg.dom.all("link", rel="alternate") if n.attrs.get("hreflang")}
    for pg in normal:
        a = alts[pg.file]
        twin = pg.twin_key()
        if twin is None:
            if a:
                s["fails"].append(f"{pg.file}: has hreflang links, but no twin page: remove them")
            continue
        en, es = (twin, pg.key) if pg.es else (pg.key, twin)
        if twin + "index.html" not in pages:
            s["fails"].append(f"{pg.file}: its twin site/{twin} is missing")
            continue
        for lg, k in (("en", en), ("es", es)):
            if a.get(lg) != SITE + k:
                s["fails"].append(f"{pg.file}: hreflang=\"{lg}\" is {a.get(lg)}, expected {SITE + k}")
        if set(a) - {"en", "es"}:
            s["fails"].append(f"{pg.file}: unexpected hreflang {sorted(set(a) - {'en', 'es'})}")
        if alts.get(twin + "index.html") != a:
            s["fails"].append(f"{pg.file}: its twin site/{twin} lists different hreflang links")
    s["notes"].append(f"{len(TWINS)} pairs expected")

    # -- footer
    s = rep.check("Footer: one link, to the source on GitHub, in the page's language; no second navigation row")
    for pg in normal:
        rows = [p for p in pg.dom.all("p", cls="foot-links") if p.up(lambda n: n.tag == "footer")]
        lg = "es" if pg.es else "en"
        if len(rows) != 1:
            s["fails"].append(f"{pg.file}: {len(rows)} footer rows, expected 1")
            continue
        links = rows[0].all("a")
        if [a.text() for a in links] != [FOOT[lg]] or links[0].attrs.get("href", "").rstrip("/") != REPO:
            s["fails"].append(f"{pg.file}: footer row reads {[a.text() for a in links]}, expected [{FOOT[lg]!r}] → {REPO}")
        if not pg.is404 and len(pg.dom.first("footer").all("p")) < 2:
            s["fails"].append(f"{pg.file}: the footer needs its licence text under the row")

    # -- course bar
    s = rep.check("Course bar: a film's steps sit in nav.course, right after the hero, never inside it")
    for pg in normal:
        path = pg.dom.first("ol", cls="path")
        if path is None:
            continue
        bar = path.up(lambda n: n.tag == "nav" and "course" in n.cls)
        if bar is None:
            s["fails"].append(f"{pg.file}: ol.path outside a nav.course")
            continue
        sibs = bar.parent.elements()
        k = sibs.index(bar)
        if k == 0 or not ({"hero", "page-head"} & set(sibs[k - 1].cls)):
            s["fails"].append(f"{pg.file}: nav.course should come right after the hero")
        if not bar.attrs.get("aria-label"):
            s["fails"].append(f"{pg.file}: nav.course needs an aria-label naming the film")

    # -- breadcrumbs
    s = rep.check("Breadcrumbs: on every page except home, topics and the journey, in place of the eyebrow")
    for pg in normal:
        base = pg.key[3:] if pg.es else pg.key
        crumbs = pg.dom.all("p", cls="crumbs")
        want = CRUMBS.get(pg.key)
        if want is None and base.startswith(("sketch/", "when-things-go-wrong/", "labs/", "scenarios/")):
            s["fails"].append(f"{pg.file}: a new page under a topic: add it to CRUMBS in check_site.py")
            continue
        if want is None:
            if crumbs:
                s["fails"].append(f"{pg.file}: has breadcrumbs, but home, topics and journey pages don't")
            continue
        if len(crumbs) != 1:
            s["fails"].append(f"{pg.file}: {len(crumbs)} breadcrumbs, expected 1")
            continue
        c = crumbs[0]
        if "eyebrow" not in c.cls:
            s["fails"].append(f"{pg.file}: the breadcrumb should be p.eyebrow.crumbs")
        if c.text() != want[0]:
            s["fails"].append(f"{pg.file}: breadcrumb reads \"{c.text()}\", expected \"{want[0]}\"")
        got = []
        for a in c.all("a"):
            kind, target, _ = resolve(pg, a.attrs.get("href", ""))
            got.append(key_of(file_of(target)[0] or "?") if kind == "site" else "?")
        if got != want[1]:
            s["fails"].append(f"{pg.file}: breadcrumb links go to {got}, expected {want[1]}")
        hero = c.up(lambda n: n.tag == "section")
        if hero is not None and [e for e in hero.all("p", cls="eyebrow") if "crumbs" not in e.cls]:
            s["fails"].append(f"{pg.file}: an eyebrow next to the breadcrumb; the breadcrumb replaces it")

    # -- numbering and lengths
    s = rep.check("No film numbering anywhere on the site (only allowlisted code comments)")
    t = rep.check("No stale film lengths (7½, 8½, 5½, 5½ and 6 min; the journey says \"short film\")")
    allowed = []
    for p in sorted(WEB.rglob("*")):
        if not p.is_file() or p.suffix not in TEXT_EXT:
            continue
        rel = p.relative_to(WEB).as_posix()
        src = p.read_text(encoding="utf-8", errors="replace")
        spans = js_comment_spans(src) if rel in COMMENT_OK else []
        for m in NUMBERING.finditer(src):
            line = src.count("\n", 0, m.start()) + 1
            if any(a <= m.start() < b for a, b in spans):
                allowed.append(f"site/{rel}:{line}")
                continue
            s["fails"].append(f"site/{rel}:{line}: \"{m.group(0)}\"")
        if rel in BUNDLES or rel in SEALED:
            continue  # the players' own code (timings, comments) is not site copy
        mk = rel in MAKING_OF_PAGES
        for m in LENGTHS.finditer(src):
            if m.group(0) in WHOLE or mk and m.group(0).lstrip("· ") == "5 min":
                continue
            t["fails"].append(f"site/{rel}:{src.count(chr(10), 0, m.start()) + 1}: \"{m.group(0)}\"")
        if p.suffix == ".html":
            lg = "es" if rel.startswith("es/") else "en"
            for m in re.finditer(r"\d½", src):
                if m.group(0) not in HALVES[lg] and not (mk and m.group(0) == "4½"):
                    t["fails"].append(f"site/{rel}:{src.count(chr(10), 0, m.start()) + 1}: \"{m.group(0)}\" (this language's films are {' and '.join(sorted(HALVES[lg]))} min)")
    if allowed:
        s["notes"].append("allowed, in code comments: " + ", ".join(allowed))

    s = rep.check("No film numbering in the repository's Markdown docs either")
    docs = 0
    for md in sorted(ROOT.rglob("*.md")):
        if any(part in ("build", "dist", "models", "node_modules", ".git") for part in md.relative_to(ROOT).parts):
            continue
        docs += 1
        for i, line in enumerate(md.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            for m in NUMBERING.finditer(line):
                s["fails"].append(f"{md.relative_to(ROOT)}:{i}: \"{m.group(0)}\"")
    s["notes"].append(f"{docs} Markdown files")

    # -- scripts and progress
    s = rep.check("Scripts: one film bundle per page, in order, and each film's progress prefix")
    for pg in normal:
        ls = pg.local_scripts
        if len(pg.bundles) > 1:
            s["fails"].append(f"{pg.file}: {len(pg.bundles)} film bundles ({', '.join(pg.bundles)}); only one can load")
        order = [x for x in ls if x in BUNDLES or x in PACKS or x in ("assets/learn/think.js", "assets/learn/path.js", "assets/learn/next.js", "assets/sketch/sketch.js")]
        rank = lambda x: 0 if x in BUNDLES else 1 if x in PACKS else {"assets/learn/think.js": 2, "assets/sketch/sketch.js": 2, "assets/learn/path.js": 3, "assets/learn/next.js": 4}[x]
        if [rank(x) for x in order] != sorted(rank(x) for x in order):
            s["fails"].append(f"{pg.file}: scripts load as {order}; the order is film bundle → pack → think.js → path.js → next.js")
        film = pg.bundles[0] if pg.bundles else None
        tpl = pg.dom.first("template", id="next-panel")
        if ("assets/learn/next.js" in ls) != bool(tpl) and pg.dom.first("canvas", id="film"):
            s["fails"].append(f"{pg.file}: next.js and <template id=\"next-panel\"> go together")
        if "assets/learn/think.js" in ls and not any(x in PACKS for x in ls):
            s["fails"].append(f"{pg.file}: think.js without a language pack")
        if film == "assets/film3/film.js":
            if "assets/learn/path.js" in ls:
                s["fails"].append(f"{pg.file}: A Sharper Sketch's pages never load path.js (sketch.js paints the stepper)")
            if "assets/sketch/sketch.js" not in ls:
                s["fails"].append(f"{pg.file}: loads A Sharper Sketch without sketch.js")
        watch = pg.dom.first(id="watch")
        if film and watch is not None and watch.first("canvas", id="film") is not None:
            ds = watch.attrs.get("data-store")
            if ds is None and "assets/learn/path.js" in ls:
                s["fails"].append(f"{pg.file}: section#watch needs data-store=\"{BUNDLES[film]}\", or \"watched\" is never recorded")
            elif ds is not None and ds != BUNDLES[film]:
                s["fails"].append(f"{pg.file}: section#watch data-store=\"{ds}\", but the film here is {BUNDLES[film]}")
        path = pg.dom.first("ol", cls="path")
        if path is not None:
            try:
                json.loads(path.attrs.get("data-text", "{}"))
            except ValueError as e:
                s["fails"].append(f"{pg.file}: .path data-text is not JSON ({e})")
            ds = path.attrs.get("data-store", "ld")
            if film and ds != BUNDLES[film]:
                s["fails"].append(f"{pg.file}: .path data-store=\"{ds}\", but the film here is {BUNDLES[film]}")

    # -- the Making of films: sealed players, each with its own prefixed elements
    s = rep.check("Sealed films: each player's prefixed elements, and no unsealed film bundle beside them")
    for pg in normal:
        for sb in pg.sealed:
            p = SEALED[sb]
            for el in ("film", "play", "scrub", "time", "cc", "fs", "chapters", "snd"):
                if pg.ids.get(f"{p}-{el}", 0) != 1:
                    s["fails"].append(f"{pg.file}: loads {sb}, but has no #{p}-{el}")
            if pg.bundles:
                s["fails"].append(f"{pg.file}: a sealed film beside {', '.join(pg.bundles)}: that film would take the ids its player needs")
        if pg.sealed:
            s["notes"].append(f"{pg.file}: {len(pg.sealed)} sealed films")

    # -- topic cards
    s = rep.check("Topic cards: one link each, the linked film's progress prefix and counts, a real poster")
    ncards = 0
    for pg in normal:
        for card in pg.dom.all("article", cls="topic-card"):
            ncards += 1
            where = f"{pg.file}:{card.line}"
            box = card.up(lambda n: "data-progress-text" in n.attrs)
            prog = card.first(cls="tc-progress")
            links = card.first("h3").all("a") if card.first("h3") else []
            if "soon" in card.cls:
                if links or prog is not None:
                    s["fails"].append(f"{where}: an \"In the works\" card has no link and no progress")
                continue
            if len(links) != 1:
                s["fails"].append(f"{where}: the card's h3 needs exactly one link")
                continue
            for extra in card.all("a"):
                if extra is not links[0] and not extra.up(lambda n: "cta" in n.cls):
                    s["fails"].append(f"{where}: a link inside the card outside its buttons ({extra.text()}): the whole card is already a link")
            img = card.first("img")
            if img is None or img.attrs.get("alt") != "":
                s["fails"].append(f"{where}: the card's poster needs alt=\"\" (the title names it)")
            kind, target, _ = resolve(pg, links[0].attrs.get("href", ""))
            f = file_of(target)[0] if kind == "site" else None
            if not f:
                continue
            tb = pages[f].bundles
            prefix = BUNDLES[tb[0]] if tb else None
            if prefix is None:
                s["fails"].append(f"{where}: the card links to site/{f}, which has no film")
                continue
            if prog is None or box is None:
                s["fails"].append(f"{where}: needs p.tc-progress inside [data-progress-text]")
                continue
            try:
                T = json.loads(box.attrs["data-progress-text"])
                if set(T) != {"watched", "labs", "quiz"}:
                    s["fails"].append(f"{where}: data-progress-text keys {sorted(T)}")
                if pg.es and T.get("watched") != "Vista" or not pg.es and T.get("watched") != "Watched":
                    s["fails"].append(f"{where}: data-progress-text is not in the page's language")
            except ValueError as e:
                s["fails"].append(f"{where}: data-progress-text is not JSON ({e})")
            if prog.attrs.get("data-progress") != prefix:
                s["fails"].append(f"{where}: data-progress=\"{prog.attrs.get('data-progress')}\", but the card links to {f} ({prefix})")
            elif (prog.attrs.get("data-labs"), prog.attrs.get("data-quiz")) != COUNTS[prefix]:
                s["fails"].append(f"{where}: data-labs/data-quiz {prog.attrs.get('data-labs'), prog.attrs.get('data-quiz')}, expected {COUNTS[prefix]}")
            if "hidden" not in prog.attrs:
                s["fails"].append(f"{where}: p.tc-progress starts hidden")
    s["notes"].append(f"{ncards} cards")

    # -- Spanish
    s = rep.check("Spanish pages: link to Spanish pages when a twin exists, mark English-only links, differ from the English twin")
    for pg in normal:
        if pg.is404:
            continue
        for a in pg.dom.all("a"):
            if a.up(lambda n: "lang" in n.cls and n.tag == "span"):
                continue  # the language toggle
            kind, target, _ = resolve(pg, a.attrs.get("href", ""))
            if kind != "site":
                continue
            f = file_of(target)[0]
            if not f or not f.endswith(".html"):
                continue
            tk = key_of(f)
            if pg.es and not tk.startswith("es/"):
                if tk in TWINS:
                    s["fails"].append(f"{pg.file}:{a.line}: \"{a.text()}\" goes to the English page site/{tk}; link to site/es/{tk}")
                else:
                    if a.attrs.get("hreflang") != "en" and a.lang() != "en":
                        s["fails"].append(f"{pg.file}:{a.line}: \"{a.text()}\" goes to an English-only page: add hreflang=\"en\"")
                    ctx = a.text() + " " + (a.parent.text() if a.parent is not None else "")
                    if "inglés" not in ctx:
                        s["fails"].append(f"{pg.file}:{a.line}: \"{a.text()}\" goes to an English-only page: say \"(en inglés)\"")
            if not pg.es and tk.startswith("es/") and a.lang() != "es":
                s["fails"].append(f"{pg.file}:{a.line}: \"{a.text()}\" goes to a Spanish page from an English one")
        twin = pg.twin_key()
        if pg.es and twin is not None and twin + "index.html" in pages:
            en = pages[twin + "index.html"]
            for what, get in (("title", lambda d: d.first("title").text() if d.first("title") else ""),
                              ("description", lambda d: (d.first("meta", name="description") or Node("", {}, None, 0)).attrs.get("content", ""))):
                a, b = get(pg.dom), get(en.dom)
                if b and not a:
                    s["fails"].append(f"{pg.file}: no {what}, and the English page has one")
                elif a and a == b:
                    s["fails"].append(f"{pg.file}: the {what} is the same as the English page's")
            ft = lambda d: " ".join(p.text() for p in d.first("footer").all("p") if "foot-links" not in p.cls) if d.first("footer") else ""
            if ft(pg.dom) == ft(en.dom):
                s["fails"].append(f"{pg.file}: the footer text is the same as the English page's")

    # -- generated pages
    s = rep.check("Journey pages: the same as site-tools/build_pages.py makes from their Markdown")
    try:
        with tempfile.TemporaryDirectory() as tmp:
            tmp = pathlib.Path(tmp)
            shutil.copytree(ROOT / "site-tools", tmp / "site-tools")
            mds = [p for d in ["journey", "paths", "es/journey", "es/paths"] for p in WEB.glob(d + "/**/*.md")]
            for md in mds:
                dst = tmp / "site" / md.relative_to(WEB)
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy(md, dst)
            r = subprocess.run([sys.executable, str(tmp / "site-tools/build_pages.py")], capture_output=True, text=True)
            if r.returncode:
                s["fails"].append("build_pages.py failed: " + (r.stderr.strip().splitlines() or ["?"])[-1])
            for md in mds:
                rel = md.relative_to(WEB).with_suffix(".html")
                built, have = tmp / "site" / rel, WEB / rel
                if not built.exists():
                    continue
                if not have.exists() or built.read_text() != have.read_text():
                    s["fails"].append(f"site/{rel.as_posix()} differs from what build_pages.py makes: run python site-tools/build_pages.py (never hand-edit it)")
            s["notes"].append(f"{len(mds)} Markdown pages rebuilt in a scratch folder")
    except Exception as e:  # noqa: BLE001
        s["fails"].append(f"could not run build_pages.py: {e}")

    return rep.done()


if __name__ == "__main__":
    sys.exit(main())
