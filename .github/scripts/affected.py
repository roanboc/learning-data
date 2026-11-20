"""Chooses the checks a change needs, so a change to one film doesn't check every film and the whole site.

python .github/scripts/affected.py               list the checks this branch needs, compared with origin/main
python .github/scripts/affected.py --run         ... and run them here
python .github/scripts/affected.py --all         every check (add --run to run them)
python .github/scripts/affected.py --base REF    compare with another branch or commit

A change is what differs from where this branch left REF (git merge-base), counting uncommitted and new files.
The checks it picks from:
  site       site-tools/check_site.py, the static checks: a few seconds, and they read every page, the Markdown
             docs, each series' series.json and site.json, the films' Spanish captions, and each film's scenes
             and score for the words its pictures and sounds wait for
  browser    site-tools/smoke.py, the browser checks: minutes, so only on the pages a change touched. A changed page is
             checked, and so is every page that loads a changed file (a script, a stylesheet, an image, a soundtrack); a
             file no page names counts for the pages that load the files beside it. A page whose only change is the versions
             its links carry (?v=, site-tools/build_series.py's stamp()) isn't checked for that: the file that changed picks
             the pages that load it. A change to the browser checks
             themselves checks every page, and one to a series' play script (site-tools/smoke/<series>.js) its labs and
             scenarios pages
  films      for each film whose source changed (its "paths" in its release.json, shared code included,
             so a change to the first film's engine checks every film that draws with it): build the player, check
             that the site's copy is the one it builds, check that every moment draws (tools/check.py), that every piece
             of text stays inside its box (site-tools/fits.py), that every shot comes on screen long enough to be seen
             (site-tools/shots.py), and check the sound (tools/quiet.py), in the films that have that check. A change
             to only the film's published files
             under site/assets/<key>/ (a soundtrack, a poster, the places' pictures) checks no frame: the site checks
             cover it (every link resolves, and the players check the right soundtrack is selected). A change to only
             the site's copy of the player (site/assets/<key>/film.js) builds the film and compares the two, but draws
             no frame, since the picture didn't change.
The example dbt project lives in its own repository, roanboc/learning-data-project, with its own checks.
Changes to the planner and workflow are covered by the tooling regression suite, not every film.
A change to a film's release.json checks that film. --all remains the explicit full regression run.
A change to the build's cue-word reading (films/data-governance/shared/tools/cues.py) picks no film: it draws nothing, the
static checks hold every film to it, and the tooling tests hold the reading itself.
A change to the check that nothing shows twice where a film changes shot or chapter (films/data-governance/shared/tools/twice.py)
picks no film either, as a change to site-tools/fits.py or shots.py picks none: it changes no player, the tooling tests hold it on a
made-up film, and each film runs it again with its own checks whenever the film changes. Before such a change merges, run it on
every film (twice.py --all, after building them) and list in site-tools/twice_later.json what it newly finds, to fix film by film.

A file most pages load (more than SHARED_OVER of them: site.css, ambient.js, path.js, the film pages' seek.js) checks a sample of
its pages, a few of each kind (sample()), and so does a change to more than PAGES_OVER pages at once; the nightly run
(--every-page) checks every page. In CI the browser checks run in parallel jobs of about SHARD_PAGES pages each (shards()).

In CI, --github writes site, browser, pages (a JSON list, or "all"), shards (the browser jobs' matrix), tooling, films (a
matrix) and count to $GITHUB_OUTPUT, and a table to $GITHUB_STEP_SUMMARY.
"""
import argparse, html.parser, json, os, pathlib, posixpath, re, subprocess, sys, urllib.parse

import films as release_films  # .github/scripts/films.py: every film's release.json

ROOT = pathlib.Path(__file__).resolve().parents[2]
# The tooling suite exercises selection against fixtures and the real inventory without drawing frames.
TOOLING = [".github/scripts", ".github/workflows", ".github/actions", "tests", "modules", "site-tools"]


def production_tool(path):
    # These tools produce audio, not the player. Their cache/synthesis contracts are
    # tested without rechecking every frame. Changed timings or published audio still
    # select their normal film/page checks independently.
    return path == "site-tools/voice_cache.py" or (path.startswith("films/") and path.endswith(("/tools/tts.py", "/tools/audio_es.py")))
# What a film's build reads its cue words with: it stops the build on a word that isn't in its line, draws nothing and changes no
# player. site-tools/check_site.py holds every film to it (Cue words), as each build calls it, and tests/test_cues.py holds the
# reading itself. So a change to it runs those two and picks no film, though every film of six series names it in its paths.
READS = ["films/data-governance/shared/tools/cues.py"]
# The check that nothing shows twice where a film changes shot or chapter: every film's tools/check.py runs it, so every film names it
# in its paths, but it changes no player. A change to it runs the tooling tests (tests/test_twice.py) and picks no film; it is run on
# every film before it merges, and what it newly finds waits in site-tools/twice_later.json, as with site-tools/fits.py and shots.py.
CHECKS = ["films/data-governance/shared/tools/twice.py"]
SMOKE = ["site-tools/smoke.py"]  # the browser checks themselves: a change runs them on every page
PLAYS = "site-tools/smoke"        # a series' play script: its labs and scenarios pages
USED = ["site-tools/check_site.py", "site-tools/build_series.py"]  # what smoke.py imports: a change starts it, with no page
WEB = ROOT / "site"
# A file this many pages load is the site's own (site.css, ambient.js, path.js, and the film pages' seek.js, next.js and think.js).
# A change to it checks a sample of its pages, one or more of each kind (see sample()), not all of them: all ~600 pages took
# 2.5 hours in one job (19 Nov 2026). The nightly run (checks.yml, schedule) still checks every page.
SHARED_OVER = 100
# More changed pages than this, as when a change to build_series.py rewrites every page, are sampled the same way.
PAGES_OVER = 150
SAMPLE_EVERY = 15  # one page of a kind for every 15 of it, and at least one
ALWAYS = ["", "es/", "topics/", "es/topics/"]  # the pages the header, route and tour checks run on
# The browser checks run in parallel jobs (checks.yml's Browser matrix), about this many pages each, in at most MAX_SHARDS jobs.
SHARD_PAGES = 40
MAX_SHARDS = 8
# what check_site.py reads besides site/ and site-tools/
SITE_EXTRA = [re.compile(p) for p in [r".*\.md$", r"films/[^/]+/series\.json$", r"films/.*/site\.json$",
                                      r"films/.*/source/src/i18n/es/captions\.js$", r"films/.*/source/film\.json$",
                                      r"films/.*release\.json$", r"films/.*release-note\.md$", r"films/.*/audio\.json$",
                                      # the words a film's pictures and sounds wait for: its scenes, its series' and its score
                                      r"films/.*/src/[^/]+\.js$", r"films/.*/tools/score\.py$"]]


def films():
    """The FILMS list (films.py): one entry per video, with the paths it is built from, and the release.json it is in."""
    return [dict(e, release=f.relative_to(ROOT).as_posix()) for f in release_films.files() for e in release_films.entries(f)]


def under(path, prefixes):
    return any(path == p or path.startswith(p.rstrip("/") + "/") for p in prefixes)


def touches(path, specs):
    """git pathspec, as the release workflow writes them: folders or files, and :(exclude) entries."""
    keep = [s for s in specs if not s.startswith(":(exclude)")]
    drop = [s[len(":(exclude)"):] for s in specs if s.startswith(":(exclude)")]
    return under(path, keep) and not under(path, drop)


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, check=True).stdout.split("\n")


class Loads(html.parser.HTMLParser):
    """The files a page loads by name: scripts, stylesheets, icons, images, posters and media."""
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "link" and (a.get("rel") or "").lower() in ("alternate", "canonical", "next", "prev"):
            return
        for k in ("src", "poster") + (("href",) if tag == "link" else ()):
            if a.get(k):
                self.refs.append(a[k])
        if a.get("srcset"):
            self.refs += [c.strip().split(" ")[0] for c in a["srcset"].split(",") if c.strip()]


def loads():
    """Every page, by its key as smoke.py names it ("" for site/index.html, "sketch/labs/" for site/sketch/labs/index.html), with the
    files under site/ it loads by name."""
    out = {}
    for p in sorted(WEB.rglob("*.html")):
        f = p.relative_to(WEB).as_posix()
        L = Loads()
        L.feed(p.read_text(encoding="utf-8"))
        here, got = posixpath.dirname(f), set()
        for ref in L.refs:
            u = urllib.parse.urlsplit(ref)
            if u.scheme or u.netloc or not u.path:
                continue
            path = urllib.parse.unquote(u.path)
            if path.startswith("/"):
                path = path[1:]
            else:
                path = posixpath.normpath(posixpath.join(here, path))
            got.add(path)
        out[f[:-len("index.html")] if f.endswith("index.html") else f] = got
    return out


def audio_paths(path, files, base):
    """Only audio whose served bytes or availability changed needs playback checks.

    Initial pointers to unchanged tracked MP3s and URL-only edits are transport metadata.
    The separate media check verifies any local bytes before a plan is executed.
    """
    current = json.loads((ROOT / path).read_text(encoding="utf-8"))["files"] if (ROOT / path).is_file() else []
    previous = {}
    if base:
        old = subprocess.run(["git", "show", f"{base}:{path}"], cwd=ROOT, capture_output=True, text=True)
        if old.returncode == 0:
            previous = {e["path"]: e for e in json.loads(old.stdout)["files"]}
    changed = []
    for entry in current:
        name = entry["path"]
        old = previous.get(name)
        if old and old["sha256"] == entry["sha256"]:
            continue
        if base and not old and name not in files:
            # A tree lookup only: do not fetch historical audio blobs in a partial clone.
            tracked = subprocess.run(["git", "rev-parse", "--verify", f"{base}:{name}"], cwd=ROOT, capture_output=True)
            if tracked.returncode == 0:
                continue
        changed.append(name)
    changed.extend(name for name in previous if name not in {e["path"] for e in current})
    return changed


# The versions a page links its files by (?v=<hash>, made by site-tools/build_series.py's stamp(), and the labs engine's "v" and "lv"
# in data-films): a page whose only change is these follows a file that changed, and that file's change picks its pages itself.
VERSION = re.compile(r'\?v=[0-9a-f]+|&quot;l?v&quot;:&quot;[0-9a-f]+&quot;,')


def versions_only(path, base):
    """True when a page differs from base only in the versions its links carry: a changed player, script, stylesheet, poster or
    soundtrack gives every page that loads it a new version, so a change to one shared file doesn't browser-check every page."""
    if not base:
        return False
    old = subprocess.run(["git", "show", f"{base}:{path}"], cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
    return old.returncode == 0 and VERSION.sub("", old.stdout) == VERSION.sub("", (ROOT / path).read_text(encoding="utf-8"))


def kinds(L):
    """Pages grouped by kind: their language, their place (home, a topic or series, a film, labs, scenarios, evaluation, the Topics
    page) and the shared scripts and stylesheets they load (a labs engine, the film player's seek.js), not a film's own player."""
    own = {posixpath.dirname(f["site_player"])[len("site/"):] + "/" for f in films()}
    count = {}
    for got in L.values():
        for f in got:
            count[f] = count.get(f, 0) + 1
    shared = {f for f, n in count.items() if n >= 5 and f.endswith((".js", ".css")) and not any(f.startswith(d) for d in own)}
    out = {}
    for k, got in L.items():
        parts = [s for s in k.split("/") if s]
        lang = "es" if parts[:1] == ["es"] else "en"
        parts = parts[1:] if lang == "es" else parts
        last = parts[-1] if parts else ""
        place = last if last in ("labs", "scenarios", "evaluation", "topics") else f"depth {len(parts)}"
        out.setdefault((lang, place, frozenset(got & shared)), []).append(k)
    return out


def sample(keys, L):
    """A few pages of each kind among keys, spread through the kind, and the pages in ALWAYS: what a change to a file every page
    loads is checked on."""
    keys = set(keys)
    out = {k for k in ALWAYS if k in keys}
    for group in kinds({k: L[k] for k in keys if k in L}).values():
        group = sorted(group)
        n = max(1, -(-len(group) // SAMPLE_EVERY))
        out |= {group[round(i * (len(group) - 1) / max(1, n - 1))] for i in range(n)}
    return out


def shards(keys, size=SHARD_PAGES, most=MAX_SHARDS):
    """Split pages into parallel jobs, dealt in turn so each job gets every kind of page (the checks' cost differs by kind)."""
    keys = sorted(keys)
    n = max(1, min(most, -(-len(keys) // size)))
    return [keys[i::n] for i in range(n) if keys[i::n]]


def pages(files, base="HEAD", note=None):
    """The pages the browser checks run on: None for every page, else the keys of the pages a change touched."""
    if any(f in SMOKE for f in files):
        return None
    # Compare pointer contents, so bookkeeping alone doesn't retest unchanged audio.
    files = list(files)
    for f in list(files):
        if f.startswith("films/") and f.endswith("/audio.json"):
            files.extend(audio_paths(f, files, base))
            if not (ROOT / f).is_file() and not base:
                # A removed manifest still has an owner in release.json.
                files.extend(e["site_player"] for e in films() if e["release"] == f.removesuffix("audio.json") + "release.json")
    L = loads()
    out, html, wide = set(), set(), set()
    for f in files:
        if under(f, [PLAYS]):
            series = pathlib.PurePosixPath(f).stem
            mine = {k for k in L if k in (f"{series}/labs/", f"{series}/scenarios/", f"es/{series}/labs/", f"es/{series}/scenarios/")}
            if not mine:
                return None
            out |= mine
        if not under(f, ["site"]):
            continue
        rel = f[len("site/"):]
        if rel.endswith(".html"):
            if (WEB / rel).exists() and not versions_only(f, base):
                html.add(rel[:-len("index.html")] if rel.endswith("index.html") else rel)
            continue
        users = {k for k, got in L.items() if rel in got}
        if len(users) > SHARED_OVER:  # a file of the whole site's: a sample of its pages
            wide |= users
            continue
        if not users and rel.startswith("assets/"):
            # JS loads nested assets (places/*.webp, for example) at runtime. Follow the owning
            # asset bundle, not just files in exactly the same directory. This also works for deletions.
            parts = rel.split("/")
            if len(parts) >= 3:
                owner = "/".join(parts[:2]) + "/"
                users = {k for k, got in L.items() if any(x.startswith(owner) for x in got)}
        out |= users  # a file nothing loads, such as a page's Markdown source, checks no page
    if len(html) > PAGES_OVER:  # a change to every page, as from build_series.py: a sample of them
        wide |= html
    else:
        out |= html
    if wide:
        picked = sample(wide - out, L)
        if note is not None:
            note["sampled"] = (len(picked), len(wide | out) - len(out))
        out |= picked
    return out


def changed(base):
    mb = git("merge-base", base, "HEAD")[0]
    # Both sides of a rename matter: the former owner's dependants must be checked too.
    files = git("diff", "--name-only", "--no-renames", mb) + git("ls-files", "--others", "--exclude-standard")
    return mb, sorted({f for f in files if f})


def plan(files, everything, base="HEAD", every_page=False):
    """What to check. Each picked film carries checks: full (source changed), or player (only the site's
    copy of its player changed: build and compare, draw no frame). A change to only a film's other published
    files, such as a soundtrack or a poster, picks no film job: the site checks cover those files."""
    fl = films()
    assets_only = []
    reasons = {}
    if everything:
        pick = [dict(f, checks="full") for f in fl]
    else:
        pick = []
        for f in fl:
            source = [p for p in files if not p.endswith((".md", ".rst")) and not production_tool(p) and p not in READS
                      and p not in CHECKS and touches(p, f["paths"] + [f["release"]])]
            if source:
                pick.append(dict(f, checks="full"))
                reasons[f["key"]] = source
            elif f["site_player"] in files:
                pick.append(dict(f, checks="player"))
                reasons[f["key"]] = [f["site_player"]]
            elif any(touches(p, [posixpath.dirname(f["site_player"])]) for p in files):
                assets_only.append(f)
    note = {}
    keys = None if everything or every_page else pages(files, base, note)  # None: every page
    browser = keys is None or bool(keys) or any(p in USED for p in files)
    site = (browser or any(under(p, ["site", "site-tools", "modules"]) or p in READS for p in files)
            or any(r.match(p) for p in files for r in SITE_EXTRA))
    matrix = [{k: f[k] for k in ("name", "key", "dir", "lang", "player", "site_player", "checks")} for f in pick]
    if every_page:  # the nightly run: the site, every page in a browser, and no film
        pick, matrix, reasons, assets_only, site = [], [], {}, [], True
    every = sorted(loads()) if keys is None else sorted(keys)
    split = shards(every) if browser else []
    return dict(site=site, browser=browser, pages=None if keys is None else sorted(keys), sampled=note.get("sampled"),
                shards=[{"shard": f"{i + 1} of {len(split)}", "pages": json.dumps(s)} for i, s in enumerate(split)],
                films=matrix, assets=assets_only, everything=everything, reasons=reasons,
                tooling=everything or any(under(p, TOOLING) or production_tool(p) or p in READS or p in CHECKS for p in files),
                media=everything or "site-tools/media.py" in files or any(p.endswith(("/audio.json", ".mp3")) for p in files))


def where(p):
    """what the browser checks run on, in the summary"""
    if not p["browser"]:
        return "no"
    if p["pages"] is None:
        return "every page" + (f", in {len(p['shards'])} parallel jobs" if len(p.get("shards") or []) > 1 else "")
    n = len(p["pages"])
    if not n:
        return "no page (only that the checks start)"
    shown = ", ".join("/" + k for k in p["pages"][:8])
    text = f"{n} page{'s' if n > 1 else ''}: {shown}" + (f" and {n - 8} more" if n > 8 else "")
    if p.get("sampled"):
        got, of = p["sampled"]
        text += f" ({got} of them a sample of the {of} pages that load a file the whole site loads, or that all changed)"
    if len(p.get("shards") or []) > 1:
        text += f", in {len(p['shards'])} parallel jobs"
    return text


def summary(p, files, base):
    what = "every check" if p["everything"] else f"{len(files)} changed files, compared with {base}"
    yes = lambda b: "yes" if b else "no"
    lines = [f"### Checks to run ({what})", "", "| Check | Runs |", "|---|---|",
             f"| Site, static (`site-tools/check_site.py`) | {yes(p['site'])} |",
             f"| Site, in a browser (`site-tools/smoke.py`) | {where(p)} |",
             f"| Tooling regression tests | {yes(p['tooling'])} |",
             f"| Audio manifests and local checksums | {yes(p['media'])} |",
             f"| Films | {', '.join(f['key'] + ' (' + f['checks'] + ')' for f in p['films']) or 'none'} |"]
    if p["assets"]:
        lines.append(f"| Film assets only (a soundtrack, a poster; covered by the site checks) | "
                     f"{', '.join(f['key'] for f in p['assets'])} |")
    for key, paths in p["reasons"].items():
        lines.append(f"\n- `{key}`: " + ", ".join(f"`{path}`" for path in paths))
    return "\n".join(lines)


def steps(p):
    """The executable plan, shared by local runs and the CI matrix runner."""
    py = sys.executable
    out = []
    if p["tooling"]:
        out.append(("Tooling regression tests", [py, "-m", "unittest", "discover", "-s", "tests"], ROOT, None))
    if p["media"]:
        out.append(("Audio manifests and local checksums", [py, "site-tools/media.py", "check"], ROOT, None))
    if p["site"]:
        out.append(("Site, static", [py, "site-tools/check_site.py"], ROOT, None))
    if p["browser"]:
        scope = [] if p["pages"] is None else ["--pages", json.dumps(p["pages"])]
        out.append(("Restore the selected pages' audio", [py, "site-tools/media.py", "fetch", "--pages",
                                                        "all" if p["pages"] is None else json.dumps(p["pages"])], ROOT, None))
        out.append(("Site, in a browser", [py, "site-tools/smoke.py"] + scope, ROOT, None))
    for f in p["films"]:
        env = dict(os.environ, FILM_LANG=f["lang"])
        out.append((f"{f['name']}: build", [py, "tools/build.py"], ROOT / f["dir"], env))
        out.append((f"{f['name']}: the site plays this build", [py, str(ROOT / ".github/scripts/check_player.py"), f["key"]], ROOT, env))
        if f["checks"] == "full":
            out.append((f"{f['name']}: every moment draws", [py, "tools/check.py"], ROOT / f["dir"], env))
            out.append((f"{f['name']}: text stays in its box", [py, str(ROOT / "site-tools/fits.py")], ROOT / f["dir"], env))
            out.append((f"{f['name']}: every shot is seen", [py, str(ROOT / "site-tools/shots.py")], ROOT / f["dir"], env))
            if (ROOT / f["dir"] / "tools" / "quiet.py").exists():
                out.append((f"{f['name']}: the sound", [py, "tools/quiet.py"], ROOT / f["dir"], env))
    return out


def run(p):
    commands = steps(p)
    failed = []
    for name, cmd, cwd, env in commands:
        print(f"\n== {name}", flush=True)
        if subprocess.run(cmd, cwd=cwd, env=env).returncode:
            failed.append(name)
    print(f"\n{len(commands) - len(failed)} of {len(commands)} checks passed." + (" Failed: " + "; ".join(failed) if failed else ""))
    return 1 if failed else 0


def main():
    a = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    a.add_argument("--base", default="origin/main", help="the branch or commit to compare with (default origin/main)")
    a.add_argument("--all", action="store_true", help="every check, whatever changed")
    a.add_argument("--every-page", action="store_true", help="the site's checks on every page, and no film (the nightly run)")
    a.add_argument("--run", action="store_true", help="run the checks here")
    a.add_argument("--github", action="store_true", help="write the plan to $GITHUB_OUTPUT and $GITHUB_STEP_SUMMARY")
    a.add_argument("--json", action="store_true", help="print the machine-readable plan")
    a.add_argument("--film", action="append", help="explicit release key to check; may be repeated")
    a.add_argument("--tier", choices=("full", "player"), default="full", help="checks for --film (CI uses this too)")
    o = a.parse_args()
    mb, files = (None, []) if o.all or o.film or o.every_page else changed(o.base)
    p = plan(files, o.all, base=mb, every_page=o.every_page)
    if o.film:
        if o.all:
            a.error("--film and --all are mutually exclusive")
        p = plan([], False)
        inventory = {f["key"]: f for f in films()}
        for key in dict.fromkeys(o.film):
            if key not in inventory:
                a.error(f"unknown film key {key!r}")
            p["films"].append(dict(inventory[key], checks=o.tier))
            p["reasons"][key] = ["explicit --film selection"]
    text = summary(p, files, o.base)
    print(json.dumps(p, indent=2) if o.json else text)
    if not o.json and not o.all and files and not o.film:
        print("\nChanged:\n" + "\n".join("  " + f for f in files))
    if o.github:
        with open(os.environ.get("GITHUB_OUTPUT", os.devnull), "a") as out:
            out.write(f"site={str(p['site']).lower()}\nbrowser={str(p['browser']).lower()}\n"
                      f"pages={'all' if p['pages'] is None else json.dumps(p['pages'])}\n"
                      f"films={json.dumps(p['films'])}\ncount={len(p['films'])}\n"
                      f"shards={json.dumps(p['shards'])}\ntooling={str(p['tooling']).lower()}\n")
        with open(os.environ.get("GITHUB_STEP_SUMMARY", os.devnull), "a") as out:
            out.write(text + "\n")
    if o.run:
        sys.exit(run(p))


if __name__ == "__main__":
    main()
