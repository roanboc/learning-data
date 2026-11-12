"""Chooses the checks a change needs, so a change to one film doesn't check every film and the whole site.

python .github/scripts/affected.py               list the checks this branch needs, compared with origin/main
python .github/scripts/affected.py --run         ... and run them here
python .github/scripts/affected.py --all         every check (add --run to run them)
python .github/scripts/affected.py --base REF    compare with another branch or commit

A change is what differs from where this branch left REF (git merge-base), counting uncommitted and new files.
The checks it picks from:
  site       site-tools/check_site.py, the static checks: a few seconds, and they read every page, the Markdown
             docs, each series' series.json and site.json, and the films' Spanish captions
  browser    site-tools/smoke.py, the browser checks: minutes, so only on the pages a change touched. A changed page is
             checked, and so is every page that loads a changed file (a script, a stylesheet, an image, a soundtrack); a
             file no page names counts for the pages that load the files beside it. A change to the browser checks
             themselves checks every page, and one to a series' play script (site-tools/smoke/<series>.js) its labs and
             scenarios pages
  films      for each film whose source changed (its "paths" in its release.json, shared code included,
             so a change to the first film's engine checks every film that draws with it): build the player, check
             that the site's copy is the one it builds, check that every moment draws (tools/check.py), that every piece
             of text stays inside its box (site-tools/fits.py), and check the sound (tools/quiet.py), in the films that
             have that check. A change to only the film's published files
             under site/assets/<key>/ (a soundtrack, a poster, the places' pictures) checks no frame: the site checks
             cover it (every link resolves, and the players check the right soundtrack is selected). A change to only
             the site's copy of the player (site/assets/<key>/film.js) builds the film and compares the two, but draws
             no frame, since the picture didn't change.
The dbt project (films/analytics-engineering/project) has its own workflow, credential-project.yml.
Changes to the planner and workflow are covered by the tooling regression suite, not every film.
A change to a film's release.json checks that film. --all remains the explicit full regression run.

In CI, --github writes site, browser, pages (a JSON list, or "all"), films (a matrix) and count to $GITHUB_OUTPUT, and a table
to $GITHUB_STEP_SUMMARY.
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
SMOKE = ["site-tools/smoke.py"]  # the browser checks themselves: a change runs them on every page
PLAYS = "site-tools/smoke"        # a series' play script: its labs and scenarios pages
USED = ["site-tools/check_site.py", "site-tools/build_series.py"]  # what smoke.py imports: a change starts it, with no page
WEB = ROOT / "site"
# what check_site.py reads besides site/ and site-tools/
SITE_EXTRA = [re.compile(p) for p in [r".*\.md$", r"films/[^/]+/series\.json$", r"films/.*/site\.json$",
                                      r"films/.*/source/src/i18n/es/captions\.js$", r"films/.*/source/film\.json$",
                                      r"films/.*release\.json$", r"films/.*release-note\.md$", r"films/.*/audio\.json$"]]


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


def pages(files, base="HEAD"):
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
    out = set()
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
            if (WEB / rel).exists():
                out.add(rel[:-len("index.html")] if rel.endswith("index.html") else rel)
            continue
        users = {k for k, got in L.items() if rel in got}
        if not users and rel.startswith("assets/"):
            # JS loads nested assets (places/*.webp, for example) at runtime. Follow the owning
            # asset bundle, not just files in exactly the same directory. This also works for deletions.
            parts = rel.split("/")
            if len(parts) >= 3:
                owner = "/".join(parts[:2]) + "/"
                users = {k for k, got in L.items() if any(x.startswith(owner) for x in got)}
        out |= users  # a file nothing loads, such as a page's Markdown source, checks no page
    return out


def changed(base):
    mb = git("merge-base", base, "HEAD")[0]
    # Both sides of a rename matter: the former owner's dependants must be checked too.
    files = git("diff", "--name-only", "--no-renames", mb) + git("ls-files", "--others", "--exclude-standard")
    return mb, sorted({f for f in files if f})


def plan(files, everything, base="HEAD"):
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
            source = [p for p in files if not p.endswith((".md", ".rst")) and not production_tool(p) and touches(p, f["paths"] + [f["release"]])]
            if source:
                pick.append(dict(f, checks="full"))
                reasons[f["key"]] = source
            elif f["site_player"] in files:
                pick.append(dict(f, checks="player"))
                reasons[f["key"]] = [f["site_player"]]
            elif any(touches(p, [posixpath.dirname(f["site_player"])]) for p in files):
                assets_only.append(f)
    keys = None if everything else pages(files, base)  # None: every page
    browser = keys is None or bool(keys) or any(p in USED for p in files)
    site = browser or any(under(p, ["site", "site-tools", "modules"]) for p in files) or any(r.match(p) for p in files for r in SITE_EXTRA)
    matrix = [{k: f[k] for k in ("name", "key", "dir", "lang", "player", "site_player", "checks")} for f in pick]
    return dict(site=site, browser=browser, pages=None if keys is None else sorted(keys),
                films=matrix, assets=assets_only, everything=everything, reasons=reasons,
                tooling=everything or any(under(p, TOOLING) or production_tool(p) for p in files),
                media=everything or "site-tools/media.py" in files or any(p.endswith(("/audio.json", ".mp3")) for p in files))


def where(p):
    """what the browser checks run on, in the summary"""
    if not p["browser"]:
        return "no"
    if p["pages"] is None:
        return "every page"
    n = len(p["pages"])
    if not n:
        return "no page (only that the checks start)"
    shown = ", ".join("/" + k for k in p["pages"][:8])
    return f"{n} page{'s' if n > 1 else ''}: {shown}" + (f" and {n - 8} more" if n > 8 else "")


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
    a.add_argument("--run", action="store_true", help="run the checks here")
    a.add_argument("--github", action="store_true", help="write the plan to $GITHUB_OUTPUT and $GITHUB_STEP_SUMMARY")
    a.add_argument("--json", action="store_true", help="print the machine-readable plan")
    a.add_argument("--film", action="append", help="explicit release key to check; may be repeated")
    a.add_argument("--tier", choices=("full", "player"), default="full", help="checks for --film (CI uses this too)")
    o = a.parse_args()
    mb, files = (None, []) if o.all or o.film else changed(o.base)
    p = plan(files, o.all, base=mb)
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
                      f"films={json.dumps(p['films'])}\ncount={len(p['films'])}\n")
        with open(os.environ.get("GITHUB_STEP_SUMMARY", os.devnull), "a") as out:
            out.write(text + "\n")
    if o.run:
        sys.exit(run(p))


if __name__ == "__main__":
    main()
