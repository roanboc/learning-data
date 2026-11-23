"""learning-data's own rules for .github/hooks/guard.py (the guard itself is the same file in both repositories).

Each rule says what to do instead. A problem that starts with "!" fails GitHub's check; the others warn there. In Claude
Code every problem is fed back after the edit.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]

# Shell commands refused, with what to do instead
BASH_RULES = [
    (r"tools/render\.py|review_copy\.py",
     "Films aren't rendered in sessions (Rodrigo, 28 Oct and 10 Nov 2026): open the pull request and merge on green; he renders "
     "with the release workflow."),
    (r"media\.py\s+untrack",
     "Audio is untracked only once its release copies verify, and the audio workflow does that: commit the MP3 beside its audio.json."),
    (r"git\s+rm\b[^;&|]*\.mp3",
     "Don't remove a published soundtrack by hand: the audio workflow untracks it once its release copy verifies."),
]

# Runs over about ten minutes: they go to GitHub's checks
LONG_RUNS = [
    (r"affected\.py\b[^;&|]*--all\b[^;&|]*--run|affected\.py\b[^;&|]*--run\b[^;&|]*--all\b",
     "Run Actions → Checks → Run workflow (scope all) on the branch instead."),
    (r"smoke\.py\b(?![^;&|]*--pages)(?![^;&|]*--help)",
     "smoke.py on every page takes over 20 minutes: pass --pages (affected.py --github lists them) or let the pull request's checks run it."),
    (r"twice\.py\b[^;&|]*--all",
     "twice.py --all builds every film: run it from a pull request's checks or Actions → Checks → Run workflow."),
]

# Noisy commands whose output is kept to the failures and the end (the full log is saved, and its path printed)
TRIM = [r"affected\.py\b[^;&|]*--run", r"check_site\.py", r"python3?\s+-m\s+unittest", r"smoke\.py", r"tools/check\.py",
        r"fits\.py", r"shots\.py", r"tools/quiet\.py", r"tools/pace\.py", r"legible\.py", r"\bpytest\b"]

# Files an edit is refused for ("deny"), or asks Rodrigo about first ("ask")
PROTECTED = [
    (["site/assets/*.mp3", "films/*.mp3"], "deny",
     "Soundtracks are made by the film's tools and published by media.py; don't write them by hand."),
    ([".github/workflows/release.yml", ".github/workflows/pages.yml", ".github/workflows/audio.yml"], "ask",
     "This workflow releases films, publishes the site or publishes audio: Rodrigo approves a change to it."),
    (["site/assets/learn/search.*.json"], "deny",
     "The search file is made at publish (build_series.py --search) and never committed."),
]

# Built output: never read whole (read the source, or grep)
BUILT = ["site/assets/*/film.js", "films/*/source/build/*", "films/*/source/dist/*", "site/assets/learn/search.*.json",
         "films/*/film.js"]

MERGE_NEEDS_LATEST_MAIN = True

SUMMARY = """
Hooks in .github/hooks/ enforce (README there): no force-push or push to main; no Claude trailers in commits or squash
messages; squash merges only, from a branch that holds the latest main; no renders, release runs or full suites here
(long runs go to GitHub's checks); no secrets; generated files only by their generator; no whole reads of built or huge
files (grep, or Read with offset/limit). After an edit, a film's site.json, narration and captions get the fast checks:
page text limits (kicker 32, h1 75, lead 300, EN and ES), no release status, no stock turn, "topic" never "module".
"""

_check_site = None


def check_site():
    """site-tools/check_site.py's own rules, so the limits live in one place (imported only when needed)"""
    global _check_site
    if _check_site is None:
        sys.path.insert(0, str(ROOT / "site-tools"))
        import check_site as cs
        _check_site = cs
    return _check_site


MODULE = re.compile(r"\b(modules?|m[oó]dulos?)\b", re.I)


def _visible(html):
    html = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", html)
    html = re.sub(r"(?s)<!--.*?-->", " ", html)
    return re.sub(r"(?s)<[^>]+>", " ", html)


def _strings(obj):
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from _strings(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from _strings(v)


def _count(regex, text):
    return len(regex.findall(text or ""))


def check_file(rel, before, after):
    """the fast checks for one changed file: a list of problems ("!" fails GitHub's check)"""
    problems = []
    if rel.startswith("films/") and rel.endswith("/site.json"):
        try:
            page = json.loads(after)
        except ValueError as e:
            return [f"!not valid JSON: {e}"]
        try:
            old = json.loads(before) if before else {}
        except ValueError:
            old = {}
        for key, most in check_site().INTRO_MOST.items():
            for k in (key, key + "_es"):
                if len(page.get(k) or "") > most:
                    problems.append(f"!{k} is {len(page[k])} characters, at most {most} (say who, what goes wrong and what is done)")
            en_changed = page.get(key) != old.get(key)
            es_changed = page.get(key + "_es") != old.get(key + "_es")
            if old and en_changed != es_changed and page.get(key) and page.get(key + "_es"):
                problems.append(f"{key} changed in {'English' if en_changed else 'Spanish'} only: change {key}{'_es' if en_changed else ''} to match")
        text_now, text_then = " ".join(_strings(page)), " ".join(_strings(old))
        if _count(MODULE, text_now) > _count(MODULE, text_then):
            problems.append("!the page says \"module\": on the site it's \"topic\" (Rodrigo, 20 Nov 2026)")
    elif rel.startswith("site/") and rel.endswith(".html"):
        if _count(MODULE, _visible(after)) > _count(MODULE, _visible(before)):
            problems.append("!the page says \"module\": on the site it's \"topic\" (Rodrigo, 20 Nov 2026)")
    elif re.search(r"films/.+/source/src/(narration\.js|i18n/es/captions\.js)$", rel):
        cs = check_site()
        now, then = cs.plain_words(after), cs.plain_words(before)
        if len(cs.release_status(now)) > len(cs.release_status(then)):
            problems.append("!a feature's release status (preview, beta, generally available): say what it does; its status goes in the script's sources")
        if _count(cs.STOCK_TURN, now) > _count(cs.STOCK_TURN, then):
            problems.append("!the stock \"Something had to change\": say what had to stop, or what people needed, in the story's own words")
        if _count(re.compile(r"\bA I\b"), now) > _count(re.compile(r"\bA I\b"), then):
            problems.append("!\"A I\": write AI whole; the voice reads \"A I\" as \"uh eye\"")
    return problems


def stop_checks(files):
    """reminders before a turn ends, from the files this branch changed against main"""
    notes = []
    film_sources = {f.split("/source/")[0] for f in files if re.match(r"films/[^/]+/[^/]+/source/", f)}
    if film_sources and not any(f.startswith("docs/assumptions/") for f in files):
        notes.append("This branch changes a film's source but no file under docs/assumptions/: a new or changed film's questions and "
                     "assumptions go in its own file there, in the same pull request.")
    if film_sources and not any(f.startswith("site/") for f in files):
        notes.append("Films changed but no page under site/: run python site-tools/build_series.py so the pages and links match.")
    return notes
