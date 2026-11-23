#!/usr/bin/env python3
"""One guard for Claude Code's hooks and for GitHub's checks.

The same file sits in roanboc/learning-data and roanboc/learning-data-project; each repository's own rules are in
local.py beside it. Keep the two copies identical: change one, copy it to the other.

Claude Code runs it from .claude/settings.json, with the hook's JSON on stdin:

    guard.py pre-bash       before a shell command: safety, long runs, big files, trims noisy output
    guard.py pre-edit       before Edit or Write: secrets, generated files, protected files
    guard.py pre-read       before Read: no whole huge or built file
    guard.py pre-merge      before a GitHub merge or workflow run through the GitHub tools
    guard.py post-edit      after Edit or Write: the repository's fast checks on that one file
    guard.py session-start  a few lines of state and rules
    guard.py stop           before a turn ends: commits not pushed, and the repository's own reminders

A session that starts in the folder holding both repositories loads neither's settings, so the cloud environment's setup script
runs `guard.py install .` there: that folder's .claude/settings.json then calls `guard.py dispatch <event>`, which runs every
repository's guard and joins their answers.

GitHub runs it on every pull request and push to main (.github/workflows/guards.yml):

    guard.py ci --base REF [--main]   the same file checks on every changed file, and the commit messages

and `guard.py trim` keeps a long output to its failures and its end (pre-bash pipes noisy commands through it).
Every hook is fast (well under a second, apart from one `git fetch` before a merge) and says what to do instead.
"""
import fnmatch
import importlib.util
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile
import time

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]


def _local():
    spec = importlib.util.spec_from_file_location("hooks_local", HERE / "local.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


L = _local()

# ---------------------------------------------------------------- shared rules (both repositories)
# Main's history is roanboc's alone: squash merges with an explicit message, no Claude trailers (Rodrigo, 5 and 12 Nov 2026).
TRAILER = re.compile(r"^\s*(co-authored-by:|claude-session:)|generated with \[?claude code|noreply@anthropic\.com", re.I | re.M)
SECRET = re.compile(
    r"dapi[0-9a-f]{32}"                       # Databricks personal access token
    r"|gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{60,}"   # GitHub tokens
    r"|AKIA[0-9A-Z]{16}"                       # AWS access key
    r"|sk-ant-[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{40,}"            # model API keys
    r"|xox[abpr]-[A-Za-z0-9-]{10,}"            # Slack
    r"|-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----")
SECRET_FILE = re.compile(r"(^|/)(\.env(\..*)?|.*\.pem|.*\.key|id_(rsa|ed25519|ecdsa)(\.pub)?|\.databrickscfg|credentials\.json"
                         r"|\.netrc|\.pypirc|settings\.local\.json)$")
GENERATED = re.compile(r"(generated|made) by\b.{0,160}(don'?t|do not|never) edit", re.I | re.S)
BIG_BYTES = 300_000          # a file this big is read in parts or searched, never read whole
LOG_DIR = pathlib.Path(tempfile.gettempdir()) / "claude-hook-logs"


# ---------------------------------------------------------------- helpers
def out(obj):
    print(json.dumps(obj))
    sys.exit(0)


def deny(reason, event="PreToolUse"):
    out({"hookSpecificOutput": {"hookEventName": event, "permissionDecision": "deny", "permissionDecisionReason": reason}})


def ask(reason):
    out({"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "ask", "permissionDecisionReason": reason}})


def git(*args, cwd=ROOT, timeout=10):
    try:
        r = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, timeout=timeout)
        return r.stdout.strip() if r.returncode == 0 else None
    except (OSError, subprocess.TimeoutExpired):
        return None


def rel_path(path, cwd=None):
    """the path inside this repository, or None if it's outside it"""
    if not path:
        return None
    p = pathlib.Path(path)
    if not p.is_absolute():
        p = pathlib.Path(cwd or os.getcwd()) / p
    try:
        return p.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return None


def head_text(rel, ref="HEAD"):
    t = git("show", f"{ref}:{rel}")
    return t if t is not None else ""


def matches(rel, globs):
    """fnmatch on the whole path: * reaches across folders"""
    return any(fnmatch.fnmatch(rel, g) for g in globs)


# ---------------------------------------------------------------- shell commands
def _segments(cmd):
    """a command line split at ; && || | and newlines, roughly: enough to look at each git or gh call"""
    return [s.strip() for s in re.split(r"&&|\|\||[;|\n]", cmd) if s.strip()]


def bash_problem(cmd, cwd=None):
    """why a shell command is refused, or None"""
    for seg in _segments(cmd):
        words = seg.split()
        if not words:
            continue
        if re.match(r"(sudo\s+)?git\s+push\b", seg):
            if re.search(r"(\s|^)(--force(?!-with-lease)|-f\b|-[a-zA-Z]*f[a-zA-Z]*\b)|\s\+\S+", seg):
                return ("Force-push is blocked: it rewrites shared history. Merge instead "
                        "(git fetch origin <branch> && git merge --no-edit FETCH_HEAD), or use --force-with-lease only on a "
                        "branch whose pull request has merged.")
            if re.search(r"(\s|:)(main|master)(\s|$)", seg) or re.search(r"\sHEAD:(refs/heads/)?(main|master)\b", seg):
                return "Pushing to main is blocked: push your branch and open a pull request; main changes only by squash merge."
            if len(words) <= 3 and git("rev-parse", "--abbrev-ref", "HEAD", cwd=cwd or ROOT) in ("main", "master"):
                return "You are on main: create a branch (git checkout -b <branch>) and push that instead."
        if re.match(r"git\s+commit\b", seg) and TRAILER.search(cmd):
            return ("Commit messages here carry no Co-authored-by, Claude-Session or 'Generated with Claude Code' lines "
                    "(main's history is roanboc's alone). Remove them and commit again.")
        if re.match(r"gh\s+pr\s+merge\b", seg):
            return merge_problem({"merge_method": "squash" if "--squash" in seg else ("merge" if "--merge" in seg else "rebase" if "--rebase" in seg else ""),
                                  "commit_title": "x" if re.search(r"--subject|-t\b", seg) else "",
                                  "commit_message": cmd if re.search(r"--body|-b\b", seg) else ""})
        if re.match(r"gh\s+(workflow\s+run|api\b.*dispatches)", seg) and re.search(r"release", seg):
            return "The release workflow runs only when Rodrigo starts it (AGENTS.md, Heavy jobs). Merge, and tell him what to release."
        if re.match(r"rm\s", seg) and re.search(r"\s-[a-zA-Z]*r[a-zA-Z]*f|\s-[a-zA-Z]*f[a-zA-Z]*r", seg) and \
                re.search(r"\s(/|~|\$HOME|\.git|\.\.|\*)(/)?(\s|$)", seg):
            return "rm -rf on /, ~, .git, .. or * is blocked: name the files or folder you mean."
    for pattern, message in getattr(L, "BASH_RULES", []):
        if re.search(pattern, cmd):
            return message
    for pattern, message in getattr(L, "LONG_RUNS", []):
        if re.search(pattern, cmd):
            return ("This run takes over ten minutes; long runs go to GitHub's checks (Rodrigo, 19 Nov 2026): push the branch and "
                    "open a (draft) pull request, then read its checks. " + message)
    big = big_cat(cmd, cwd)
    if big:
        return big
    return None


def big_cat(cmd, cwd):
    m = re.match(r"\s*(cat|less|more)\s+([^|;&<>]+)$", cmd.strip())
    if not m:
        return None
    for name in m.group(2).split():
        p = pathlib.Path(name if os.path.isabs(name) else os.path.join(cwd or os.getcwd(), name))
        if p.is_file() and p.stat().st_size > BIG_BYTES:
            return (f"{name} is {p.stat().st_size // 1000} KB: reading it whole wastes tokens. Search it (grep -n), or read "
                    "a part (sed -n 'a,bp', head, tail).")
    return None


def trim_command(tool_input):
    """a noisy command piped through `guard.py trim`, which keeps failures and the end; None to leave it alone"""
    cmd = tool_input.get("command", "")
    if tool_input.get("run_in_background") or "guard.py trim" in cmd or re.search(r"[|>]", cmd):
        return None
    if not any(re.search(p, cmd) for p in getattr(L, "TRIM", [])):
        return None
    q = f'"{(HERE / "guard.py").as_posix()}"'
    py = f'"{pathlib.Path(sys.executable).as_posix()}"'
    return f"set -o pipefail; {{ {cmd.strip()}\n}} 2>&1 | {py} {q} trim"


def trim(stream=sys.stdin, keep_tail=25, most=80):
    lines = stream.read().splitlines()
    if len(lines) <= most:
        print("\n".join(lines))
        return
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log = LOG_DIR / f"run-{time.strftime('%Y%m%d-%H%M%S')}-{os.getpid()}.log"
    log.write_text("\n".join(lines) + "\n", encoding="utf-8")
    bad = re.compile(r"\b(FAIL|FAILED|ERROR|Error|error:|Traceback|AssertionError|fails?:|✗|✘|Exception)\b")
    keep = set()
    for i, line in enumerate(lines[:-keep_tail]):
        if bad.search(line):
            keep.update(range(max(0, i - 2), min(len(lines) - keep_tail, i + 4)))
    picked = sorted(keep)[:most]
    print(f"[output trimmed by .github/hooks/guard.py: {len(lines)} lines; the full log is {log}]")
    last = -2
    for i in picked:
        if i != last + 1:
            print("…")
        print(lines[i])
        last = i
    print(f"… last {keep_tail} lines:")
    print("\n".join(lines[-keep_tail:]))


# ---------------------------------------------------------------- merges and workflow runs through the GitHub tools
def merge_problem(inp):
    if inp.get("merge_method") != "squash":
        return "Merge with merge_method \"squash\": main keeps one commit per pull request, never a merge commit."
    if not inp.get("commit_title") or not inp.get("commit_message"):
        return ("Give the squash an explicit commit_title (\"<PR title> (#N)\") and commit_message (what changed and why): "
                "GitHub's default message strings every branch commit together, Claude trailers included.")
    if TRAILER.search(inp.get("commit_message", "") + "\n" + inp.get("commit_title", "")):
        return "Remove the Co-authored-by, Claude-Session and 'Generated with Claude Code' lines from the squash message."
    return None


def latest_main_problem(repo_dir):
    if not getattr(L, "MERGE_NEEDS_LATEST_MAIN", False):
        return None
    branch = git("rev-parse", "--abbrev-ref", "HEAD", cwd=repo_dir)
    if not branch or branch in ("main", "master", "HEAD"):
        return None
    git("fetch", "-q", "origin", "main", cwd=repo_dir, timeout=20)
    if git("merge-base", "--is-ancestor", "origin/main", "HEAD", cwd=repo_dir) is None:
        return (f"Branch {branch} doesn't hold the latest main. Parallel merges left pages stale and broke the site (19 Nov): "
                "merge origin/main locally, run the regenerators (python site-tools/build_series.py) and the static checks, and "
                "merge on green; push the merge only if it changed files.")
    return None


def pre_merge(data):
    name, inp = data.get("tool_name", ""), data.get("tool_input", {}) or {}
    if inp.get("repo") and inp.get("repo") != ROOT.name:
        sys.exit(0)          # another repository's guard, if it has one, decides
    if name.endswith("actions_run_trigger") or name.endswith("run_workflow"):
        wf = json.dumps(inp).lower()
        if "release" in wf:
            deny("The release workflow runs only when Rodrigo starts it (AGENTS.md, Heavy jobs). Merge, and tell him what to release.")
        sys.exit(0)
    problem = merge_problem(inp) or latest_main_problem(ROOT)
    if problem:
        deny(problem)
    sys.exit(0)


# ---------------------------------------------------------------- edits
def edit_text(inp):
    """the text an Edit or Write puts in the file"""
    if "content" in inp:
        return inp.get("content") or ""
    if "edits" in inp:
        return "\n".join(e.get("new_string", "") for e in inp.get("edits") or [])
    return inp.get("new_string", "") or ""


def edit_problem(rel, new_text, current):
    """why an edit to `rel` is refused: ('deny'|'ask', reason), or None"""
    if SECRET_FILE.search(rel):
        return "deny", f"{rel} holds credentials: keep it out of the repository and out of edits (use environment variables or a secret store)."
    if SECRET.search(new_text):
        return "deny", "The text looks like a token, key or password. Never write one into a file: read it from an environment variable."
    if current and GENERATED.search(current[:600]):
        return "deny", f"{rel} is generated (its first lines say so): change its source and run the generator its header names."
    for globs, decision, reason in getattr(L, "PROTECTED", []):
        if matches(rel, globs):
            return decision, reason
    return None


def pre_edit(data):
    inp = data.get("tool_input", {}) or {}
    rel = rel_path(inp.get("file_path"), data.get("cwd"))
    if rel is None:
        sys.exit(0)
    p = ROOT / rel
    current = p.read_text(encoding="utf-8", errors="replace")[:2000] if p.is_file() else ""
    found = edit_problem(rel, edit_text(inp), current)
    if found:
        (deny if found[0] == "deny" else ask)(found[1])
    sys.exit(0)


def post_edit(data):
    inp = data.get("tool_input", {}) or {}
    rel = rel_path(inp.get("file_path"), data.get("cwd"))
    if rel is None or not (ROOT / rel).is_file():
        sys.exit(0)
    problems = L.check_file(rel, head_text(rel), (ROOT / rel).read_text(encoding="utf-8", errors="replace"))
    if problems:
        print(f"{rel}:\n- " + "\n- ".join(problems), file=sys.stderr)
        sys.exit(2)
    sys.exit(0)


# ---------------------------------------------------------------- reads
def pre_read(data):
    inp = data.get("tool_input", {}) or {}
    path = inp.get("file_path") or ""
    if inp.get("limit") or inp.get("offset") or inp.get("pages"):
        sys.exit(0)
    rel = rel_path(path, data.get("cwd")) or ""
    built = matches(rel, getattr(L, "BUILT", [])) or path.endswith(".min.js")
    p = pathlib.Path(path)
    size = p.stat().st_size if p.is_file() else 0
    if built or size > BIG_BYTES:
        why = "is built output" if built else f"is {size // 1000} KB"
        deny(f"{rel or path} {why}: reading it whole wastes tokens. Grep for what you need, or Read with offset and limit; "
             "for built output, read its source instead.")
    sys.exit(0)


# ---------------------------------------------------------------- session start and stop
def session_start(data):
    branch = git("rev-parse", "--abbrev-ref", "HEAD") or "?"
    counts = git("rev-list", "--left-right", "--count", "origin/main...HEAD")
    behind, ahead = (counts.split() if counts else ("?", "?"))
    dirty = len((git("status", "--porcelain") or "").splitlines())
    print(f"[{ROOT.name}] branch {branch}: {ahead} commits ahead of origin/main, {behind} behind; {dirty} files changed.")
    print(L.SUMMARY.strip())
    sys.exit(0)


def stop(data):
    if data.get("stop_hook_active"):
        sys.exit(0)
    notes = []
    branch = git("rev-parse", "--abbrev-ref", "HEAD")
    if branch and branch not in ("main", "master", "HEAD"):
        upstream = git("rev-parse", "--abbrev-ref", "@{u}")
        unpushed = git("rev-list", "--count", "@{u}..HEAD") if upstream else git("rev-list", "--count", "origin/main..HEAD")
        if unpushed and unpushed != "0":
            notes.append(f"{ROOT.name}: commits on {branch} up to {(git('rev-parse', '--short', 'HEAD') or '?')} aren't pushed; this container is reclaimed when idle. "
                         f"Push them (git push -u origin {branch}).")
        ahead = (git("diff", "--name-only", "origin/main...HEAD") or "").splitlines()
        if ahead:
            notes += getattr(L, "stop_checks", lambda files: [])(ahead)
    # each reminder once a session, so a turn that ends with a reason given isn't stopped again for the same point
    seen_file = LOG_DIR / f"stop-{re.sub(r'[^A-Za-z0-9_-]', '', str(data.get('session_id') or 'none'))}.json"
    try:
        seen = set(json.loads(seen_file.read_text()))
    except (OSError, ValueError):
        seen = set()
    notes = [n for n in notes if n not in seen]
    if notes:
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        seen_file.write_text(json.dumps(sorted(seen | set(notes))))
        out({"decision": "block", "reason": "Before you stop:\n- " + "\n- ".join(notes) +
             "\n(If a point doesn't apply, say why in one line and stop.)"})
    sys.exit(0)


# ---------------------------------------------------------------- GitHub
def ci(base, main_push=False):
    fails, warns = [], []
    files = (git("diff", "--name-only", "--diff-filter=AM", f"{base}...HEAD", timeout=60) or "").splitlines()
    for rel in files:
        p = ROOT / rel
        if not p.is_file():
            continue
        if SECRET_FILE.search(rel):
            fails.append(f"{rel}: a credentials file; remove it from the repository")
            continue
        added = "\n".join(l[1:] for l in (git("diff", "-U0", f"{base}...HEAD", "--", rel, timeout=60) or "").splitlines()
                          if l.startswith("+") and not l.startswith("+++"))
        if SECRET.search(added):
            fails.append(f"{rel}: an added line looks like a token or key")
        try:
            new = p.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        before = head_text(rel, git("merge-base", base, "HEAD") or base)
        for problem in L.check_file(rel, before, new):
            (fails if problem.startswith("!") else warns).append(f"{rel}: {problem.lstrip('!')}")
    log = git("log", "--format=%H%x00%an%x00%B%x01", f"{base}..HEAD", timeout=60) or ""
    for entry in filter(str.strip, log.split("\x01")):
        sha, author, body = (entry.strip().split("\x00") + ["", ""])[:3]
        if TRAILER.search(body) or author.lower() == "claude":
            msg = f"commit {sha[:8]}: Claude author or trailer (Co-authored-by, Claude-Session, Generated with Claude Code)"
            (fails if main_push else warns).append(msg + ("" if main_push else "; the squash message must leave it out"))
    for w in warns:
        print(f"::warning::{w}")
    for f in fails:
        print(f"::error::{f}")
    print(f"{len(files)} changed files read; {len(fails)} failures, {len(warns)} warnings")
    return 1 if fails else 0


# ---------------------------------------------------------------- a folder that holds both repositories
# Claude Code reads .claude/settings.json from the folder a session starts in. This project's cloud sessions start in the folder
# that holds both repositories, so the environment's setup script runs `guard.py install .` there: it writes that folder's
# .claude/settings.json from this repository's own, each hook calling `guard.py dispatch <event>`, which runs the guard of every
# repository beside it and joins their answers. Each guard already leaves alone a path, a cwd or a GitHub repository not its own.
def install(parent):
    parent = pathlib.Path(parent).resolve()
    mine = json.loads((ROOT / ".claude" / "settings.json").read_text(encoding="utf-8"))
    me = (HERE / "guard.py").as_posix()

    def point(hook):
        m = re.search(r"guard\.py (\S+)$", hook.get("command", ""))
        return dict(hook, command=f'python "{me}" dispatch {m.group(1)}') if m else hook

    hooks = {event: [dict(group, hooks=[point(h) for h in group.get("hooks", [])]) for group in groups]
             for event, groups in mine["hooks"].items()}
    target = parent / ".claude" / "settings.json"
    try:
        settings = json.loads(target.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        settings = {}
    settings["hooks"] = hooks
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(settings, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {target}: hooks for {', '.join(r.name for r in repos(ROOT.parent))}")
    return 0


def repos(parent):
    return [d for d in sorted(pathlib.Path(parent).iterdir()) if (d / ".github" / "hooks" / "guard.py").is_file()]


def dispatch(event, raw):
    """run `event` in every repository's guard beside this one and join the answers: a deny wins, then an ask, then a rewrite"""
    answers = []
    for repo in repos(ROOT.parent):
        try:
            r = subprocess.run([sys.executable, str(repo / ".github" / "hooks" / "guard.py"), event], input=raw,
                               capture_output=True, text=True, timeout=45)
        except subprocess.TimeoutExpired:
            continue
        try:
            o = json.loads(r.stdout) if r.stdout.strip().startswith("{") else None
        except ValueError:
            o = None
        answers.append((r.returncode, o, r.stdout, r.stderr))
    if event.startswith("pre-"):
        for want in ("deny", "ask", "allow"):
            for _, o, _, _ in answers:
                if o and o.get("hookSpecificOutput", {}).get("permissionDecision") == want:
                    out(o)
        return 0
    if event == "post-edit":
        errs = [e.strip() for code, _, _, e in answers if code == 2 and e.strip()]
        if errs:
            print("\n".join(errs), file=sys.stderr)
            return 2
        return 0
    if event == "stop":
        reasons = [o["reason"] for _, o, _, _ in answers if o and o.get("decision") == "block"]
        if reasons:
            out({"decision": "block", "reason": "\n".join(reasons)})
        return 0
    print("\n".join(text.strip() for _, _, text, _ in answers if text.strip()))
    return 0


# ---------------------------------------------------------------- entry
def main(argv):
    if not argv:
        print(__doc__)
        return 0
    cmd = argv[0]
    if cmd == "trim":
        trim()
        return 0
    if cmd == "install":
        return install(argv[1] if len(argv) > 1 else ROOT.parent)
    if cmd == "dispatch":
        return dispatch(argv[1], sys.stdin.read())
    if cmd == "ci":
        base = argv[argv.index("--base") + 1] if "--base" in argv else "origin/main"
        return ci(base, "--main" in argv)
    try:
        data = json.load(sys.stdin)
    except ValueError:
        data = {}
    if cmd == "pre-bash":
        inp = data.get("tool_input", {}) or {}
        problem = bash_problem(inp.get("command", ""), data.get("cwd"))
        if problem:
            deny(problem)
        wrapped = trim_command(inp)
        if wrapped:
            out({"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "allow",
                                        "permissionDecisionReason": "long output kept to its failures and its end",
                                        "updatedInput": dict(inp, command=wrapped)}})
        return 0
    handler = {"pre-edit": pre_edit, "pre-read": pre_read, "pre-merge": pre_merge, "post-edit": post_edit,
               "session-start": session_start, "stop": stop}.get(cmd)
    if not handler:
        print(f"unknown hook {cmd!r}", file=sys.stderr)
        return 0         # an unknown hook never blocks the work
    handler(data)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
