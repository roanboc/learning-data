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
             that the site's copy is the one it builds, and check that every moment draws (tools/check.py)
The dbt project (films/analytics-engineering/project) has its own workflow, credential-project.yml.
A change to the checks themselves (this script, checks.yml, films.py) runs every check. A change to a film's release.json
checks that film.

In CI, --github writes site, browser, pages (a JSON list, or "all"), films (a matrix) and count to $GITHUB_OUTPUT, and a table
to $GITHUB_STEP_SUMMARY.
"""
import argparse, html.parser, json, os, pathlib, posixpath, re, subprocess, sys, urllib.parse

import films as release_films  # .github/scripts/films.py: every film's release.json

ROOT = pathlib.Path(__file__).resolve().parents[2]
# a change here can change what any check does, so it runs them all
EVERYTHING = [".github/scripts/affected.py", ".github/workflows/checks.yml", ".github/scripts/films.py"]
SMOKE = ["site-tools/smoke.py"]  # the browser checks themselves: a change runs them on every page
PLAYS = "site-tools/smoke"        # a series' play script: its labs and scenarios pages
USED = ["site-tools/check_site.py", "site-tools/build_series.py"]  # what smoke.py imports: a change starts it, with no page
WEB = ROOT / "site"
# what check_site.py reads besides site/ and site-tools/
SITE_EXTRA = [re.compile(p) for p in [r".*\.md$", r"films/[^/]+/series\.json$", r"films/.*/site\.json$",
                                      r"films/.*/source/src/i18n/es/captions\.js$", r"films/.*/source/film\.json$",
                                      r"films/.*release\.json$", r"films/.*release-note\.md$"]]


def films():
    """The FILMS list (films.py): one entry per video, with the paths it is built from, and the release.json it is in."""
    return [dict(e, release=f.relative_to(ROOT).as_posix()) for f in release_films.files() for e in json.loads(f.read_text())]


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
                if not path.startswith("/"):
                    continue
                path = path[len("/"):]
            else:
                path = posixpath.normpath(posixpath.join(here, path))
            got.add(path)
        out[f[:-len("index.html")] if f.endswith("index.html") else f] = got
    return out


def pages(files):
    """The pages the browser checks run on: None for every page, else the keys of the pages a change touched."""
    if any(f in SMOKE for f in files):
        return None
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
            # loaded by a script rather than by name: the pages that load the files beside it
            d = posixpath.dirname(rel)
            users = {k for k, got in L.items() if d != "assets" and any(posixpath.dirname(x) == d for x in got)}
        out |= users  # a file nothing loads, such as a page's Markdown source, checks no page
    return out


def changed(base):
    mb = git("merge-base", base, "HEAD")[0]
    files = git("diff", "--name-only", mb) + git("ls-files", "--others", "--exclude-standard")
    return mb, sorted({f for f in files if f})


def plan(files, everything):
    """What to check."""
    fl = films()
    everything = everything or any(f in EVERYTHING for f in files)
    if everything:
        pick = fl
    else:
        pick = [f for f in fl if any(touches(p, f["paths"] + [f["site_player"], f["release"]]) for p in files)]
    keys = None if everything else pages(files)  # None: every page
    browser = keys is None or bool(keys) or any(p in USED for p in files)
    site = browser or any(under(p, ["site", "site-tools"]) for p in files) or any(r.match(p) for p in files for r in SITE_EXTRA)
    matrix = [{k: f[k] for k in ("name", "key", "dir", "lang", "player", "site_player")} for f in pick]
    return dict(site=site, browser=browser, pages=None if keys is None else sorted(keys), films=matrix, everything=everything)


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
             f"| Films (`tools/build.py`, `tools/check.py`) | {', '.join(f['key'] for f in p['films']) or 'none'} |"]
    return "\n".join(lines)


def run(p):
    py = sys.executable
    steps = []
    if p["site"]:
        steps.append(("Site, static", [py, "site-tools/check_site.py"], ROOT, None))
    if p["browser"]:
        scope = [] if p["pages"] is None else ["--pages", json.dumps(p["pages"])]
        steps.append(("Site, in a browser", [py, "site-tools/smoke.py"] + scope, ROOT, None))
    for f in p["films"]:
        env = dict(os.environ, FILM_LANG=f["lang"])
        steps.append((f"{f['name']}: build", [py, "tools/build.py"], ROOT / f["dir"], env))
        steps.append((f"{f['name']}: the site plays this build", ["cmp", f["player"], str(ROOT / f["site_player"])], ROOT / f["dir"], env))
        steps.append((f"{f['name']}: every moment draws", [py, "tools/check.py"], ROOT / f["dir"], env))
    failed = []
    for name, cmd, cwd, env in steps:
        print(f"\n== {name}", flush=True)
        if subprocess.run(cmd, cwd=cwd, env=env).returncode:
            failed.append(name)
    print(f"\n{len(steps) - len(failed)} of {len(steps)} checks passed." + (" Failed: " + "; ".join(failed) if failed else ""))
    return 1 if failed else 0


def main():
    a = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    a.add_argument("--base", default="origin/main", help="the branch or commit to compare with (default origin/main)")
    a.add_argument("--all", action="store_true", help="every check, whatever changed")
    a.add_argument("--run", action="store_true", help="run the checks here")
    a.add_argument("--github", action="store_true", help="write the plan to $GITHUB_OUTPUT and $GITHUB_STEP_SUMMARY")
    o = a.parse_args()
    mb, files = (None, []) if o.all else changed(o.base)
    p = plan(files, o.all)
    text = summary(p, files, o.base)
    print(text)
    if not o.all and files:
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
