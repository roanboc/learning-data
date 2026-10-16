"""Chooses the checks a change needs, so a change to one film doesn't check every film and the whole site.

python .github/scripts/affected.py               list the checks this branch needs, compared with origin/main
python .github/scripts/affected.py --run         ... and run them here
python .github/scripts/affected.py --all         every check (add --run to run them)
python .github/scripts/affected.py --base REF    compare with another branch or commit

A change is what differs from where this branch left REF (git merge-base), counting uncommitted and new files.
The checks it picks from:
  site       site-tools/check_site.py, the static checks: a few seconds, and they read every page, the Markdown
             docs, each series' series.json and site.json, and the films' Spanish captions
  browser    site-tools/smoke.py, the browser checks: minutes, so only when site/ or site-tools/ changed
  films      for each film whose source changed (its "paths" in the release workflow's FILMS, shared code included,
             so a change to the first film's engine checks every film that draws with it): build the player, check
             that the site's copy is the one it builds, and check that every moment draws (tools/check.py)
The dbt project (films/analytics-engineering/project) has its own workflow, credential-project.yml.
A change to the checks themselves (this script, checks.yml, release.yml's FILMS) runs every check.

In CI, --github writes site, browser, films (a matrix) and count to $GITHUB_OUTPUT, and a table to $GITHUB_STEP_SUMMARY.
"""
import argparse, json, os, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
RELEASE_YML = ROOT / ".github/workflows/release.yml"
# a change here can change what any check does, so it runs them all
EVERYTHING = [".github/scripts/affected.py", ".github/workflows/checks.yml", ".github/workflows/release.yml"]
BROWSER = ["site", "site-tools"]
# what check_site.py reads besides site/ and site-tools/
SITE_EXTRA = [re.compile(p) for p in [r".*\.md$", r"films/[^/]+/series\.json$", r"films/[^/]+/site\.json$",
                                      r"films/.*/source/src/i18n/es/captions\.js$", r"films/.*/source/film\.json$"]]


def films():
    """The release workflow's FILMS list: one entry per video, with the paths it is built from."""
    m = re.search(r"cat > films\.json <<'EOF'\n(.*?)\n\s*EOF\n", RELEASE_YML.read_text(), re.S)
    if not m:
        sys.exit(f"Can't find the FILMS list in {RELEASE_YML.relative_to(ROOT)}")
    return json.loads(m.group(1))


def under(path, prefixes):
    return any(path == p or path.startswith(p.rstrip("/") + "/") for p in prefixes)


def touches(path, specs):
    """git pathspec, as the release workflow writes them: folders or files, and :(exclude) entries."""
    keep = [s for s in specs if not s.startswith(":(exclude)")]
    drop = [s[len(":(exclude)"):] for s in specs if s.startswith(":(exclude)")]
    return under(path, keep) and not under(path, drop)


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, check=True).stdout.split("\n")


def changed(base):
    mb = git("merge-base", base, "HEAD")[0]
    files = git("diff", "--name-only", mb) + git("ls-files", "--others", "--exclude-standard")
    return sorted({f for f in files if f})


def plan(files, everything):
    fl = films()
    everything = everything or any(f in EVERYTHING for f in files)
    if everything:
        pick = fl
    else:
        pick = [f for f in fl if any(touches(p, f["paths"] + [f["site_player"]]) for p in files)]
    browser = everything or any(under(p, BROWSER) for p in files)
    site = browser or any(r.match(p) for p in files for r in SITE_EXTRA)
    matrix = [{k: f[k] for k in ("name", "key", "dir", "lang", "player", "site_player")} for f in pick]
    return dict(site=site, browser=browser, films=matrix, everything=everything)


def summary(p, files, base):
    what = "every check" if p["everything"] else f"{len(files)} changed files, compared with {base}"
    yes = lambda b: "yes" if b else "no"
    lines = [f"### Checks to run ({what})", "", "| Check | Runs |", "|---|---|",
             f"| Site, static (`site-tools/check_site.py`) | {yes(p['site'])} |",
             f"| Site, in a browser (`site-tools/smoke.py`) | {yes(p['browser'])} |",
             f"| Films (`tools/build.py`, `tools/check.py`) | {', '.join(f['key'] for f in p['films']) or 'none'} |"]
    return "\n".join(lines)


def run(p):
    py = sys.executable
    steps = []
    if p["site"]:
        steps.append(("Site, static", [py, "site-tools/check_site.py"], ROOT, None))
    if p["browser"]:
        steps.append(("Site, in a browser", [py, "site-tools/smoke.py"], ROOT, None))
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
    files = [] if o.all else changed(o.base)
    p = plan(files, o.all)
    text = summary(p, files, o.base)
    print(text)
    if not o.all and files:
        print("\nChanged:\n" + "\n".join("  " + f for f in files))
    if o.github:
        with open(os.environ.get("GITHUB_OUTPUT", os.devnull), "a") as out:
            out.write(f"site={str(p['site']).lower()}\nbrowser={str(p['browser']).lower()}\n"
                      f"films={json.dumps(p['films'])}\ncount={len(p['films'])}\n")
        with open(os.environ.get("GITHUB_STEP_SUMMARY", os.devnull), "a") as out:
            out.write(text + "\n")
    if o.run:
        sys.exit(run(p))


if __name__ == "__main__":
    main()
