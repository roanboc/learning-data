"""Chooses the films the release workflow renders, from its "films" input.

python plan.py films.json CHOICE

CHOICE is "changed" (the films whose paths changed since the latest release), "all", or keys separated by commas.
Writes matrix, count and films to $GITHUB_OUTPUT, and a table of what it chose to $GITHUB_STEP_SUMMARY.
"""
import json, os, subprocess, sys


def run(*cmd):
    try:
        r = subprocess.run(cmd, capture_output=True, text=True)
    except FileNotFoundError:
        return None
    return r.stdout.strip() if r.returncode == 0 else None


def fail(msg):
    print(f"::error title=Which films to render::{msg}")
    sys.exit(1)


films = json.load(open(sys.argv[1]))
choice = (sys.argv[2] if len(sys.argv) > 2 else "changed").strip().lower() or "changed"
keys = [f["key"] for f in films]

# the commit of the latest published release: films changed since then need rendering again
# (PLAN_BASE sets another tag or commit to compare with, to try this locally)
tag = os.environ.get("PLAN_BASE") or run("gh", "release", "view", "--json", "tagName", "--jq", ".tagName")
base = run("git", "rev-list", "-n", "1", tag) if tag else None
changed = {}
for f in films:
    if base:
        diff = run("git", "diff", "--name-only", base, "HEAD", "--", *f["paths"])
        changed[f["key"]] = bool(diff) if diff is not None else True
    else:
        changed[f["key"]] = True  # no earlier release to compare with

if choice == "all":
    pick = keys
elif choice == "changed":
    pick = [k for k in keys if changed[k]]
else:
    pick = [k.strip() for k in choice.split(",") if k.strip()]
    unknown = [k for k in pick if k not in keys]
    if unknown:
        fail(f"Unknown film {', '.join(unknown)}. Use changed, all, or some of: {', '.join(keys)}")

since = f"release {tag}" if base else "no earlier release: every film counts as changed"
lines = [f"### Films to render ({choice}; compared with {since})", "", "| Film | Changed | Rendered |", "|---|---|---|"]
for f in films:
    k = f["key"]
    lines.append(f"| {f['name']} (`{k}`) | {'yes' if changed[k] else 'no'} | {'yes' if k in pick else 'no, carried over'} |")
    if changed[k] and k not in pick:
        print(f"::warning title=Not rendered, but changed::{f['name']} changed since {tag}, and its video is carried over from that release.")
print("\n".join(lines))

matrix = [{k: v for k, v in f.items() if k != "paths"} for f in films if f["key"] in pick]
with open(os.environ.get("GITHUB_OUTPUT", os.devnull), "a") as o:
    o.write(f"matrix={json.dumps(matrix)}\ncount={len(matrix)}\nfilms={', '.join(f['name'] for f in matrix)}\n")
with open(os.environ.get("GITHUB_STEP_SUMMARY", os.devnull), "a") as o:
    o.write("\n".join(lines) + "\n")
