"""Lab 2 · The foraging loop

An animal that forages doesn't stop when the first patch is empty: it notices the surprise, looks somewhere else, and remembers
what it found. Here an agent reads three weeks of nightly registration extracts, each with something wrong in it somewhere (a
column renamed, a field left empty, a campus that sent nothing, numbers in another unit). Its loop: say what it expects, load,
measure every gap, go looking where a gap is big, adapt where it's safe, and hand the rest to a person. It must never crash.

Setup:  python make_data.py   (once, in this folder)      Run:  python lab2_foraging_loop.py
Stuck?  solutions/lab2.py has one way to do it. Check yours:  python check.py 2

Fill in the three functions marked TODO: match_columns, load and night. The rest is done for you.

Each night the agent says what it expects, loads the extract, measures every gap between the two, goes looking for the cause
where a gap is big, adapts where it safely can, and writes down what it did. It never crashes on a surprise, and it never decides
alone what a surprise means: whatever changes a number in a report goes on a list for a person."""
import csv
import datetime as dt
import difflib
import pathlib
import statistics
import sys
from collections import Counter, defaultdict

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent / "solutions"))
from common import DATA, expect, read_counts  # noqa: E402

EXPECTED_COLUMNS = ["student_id", "course_id", "campus", "credits", "registered_at"]
CAMPUSES = {"North", "South", "City"}
TOLERANCE = 0.15        # rows, against the same weekday
MAX_EMPTY = 0.01        # credits left empty: at most 1 in 100
CREDIT_DRIFT = 0.25     # a campus's mean credits may move a quarter from what it was
KNOWN_ALIASES = {"course_code": "course_id"}   # names the team has already agreed mean the same thing


class Memory:
    """What the agent has learned so far: column mappings it has adopted, and each campus's usual credits."""
    def __init__(self):
        self.mapping = {}
        self.credits = {}        # campus -> mean credits on normal nights
        self.open = set()        # what's already with a person, so it's said once, then only noted


def expectations(day, totals, memory):
    """Before looking: what tonight's extract should be."""
    return {"columns": EXPECTED_COLUMNS, "rows": expect(totals, day), "campuses": CAMPUSES,
            "max_empty": MAX_EMPTY, "credits": dict(memory.credits)}


def match_columns(found, memory, log):
    """Map tonight's columns onto the expected ones. A known alias or a close name is adopted and noted; anything else stops
    only that column, never the run.
    For each expected column that isn't in `found` (after the mappings already in memory.mapping):
      - look for a known alias (KNOWN_ALIASES) or a close name (difflib.get_close_matches(want, found, n=1, cutoff=0.6));
      - if there is one, adopt it: add {found name: expected name} to memory.mapping, and log ("adapted", what you did);
      - if there isn't, log ("for a person", which column is missing).
    Return the new mappings."""
    raise NotImplementedError("TODO: a loop over EXPECTED_COLUMNS")


def load(path, memory, log):
    """Act: read the extract, columns mapped. A file that can't be read is a finding, not a crash.
    Open the CSV, read its header, call match_columns, rename the columns through memory.mapping, and return a list of dicts.
    If the file is missing or empty, log ("for a person", why) and return []: a surprise is a finding, not a crash."""
    raise NotImplementedError("TODO: about ten lines")


def credits_of(rows):
    out = defaultdict(list)
    empty = Counter()
    for r in rows:
        v = (r.get("credits") or "").strip()
        if v:
            out[r["campus"]].append(float(v))
        else:
            empty[r["campus"]] += 1
    return out, empty


def night(day, totals, memory):
    """One night of the loop: expect, act, measure, go looking, adapt where it's safe, and hand the rest to a person.
    Return (rows read, log), where log is a list of (kind, text) and kind is "adapted", "noted" or "for a person".
      1. Expect: exp = expectations(day, totals, memory).
      2. Act: rows = load(DATA / "extracts" / f"{day}.csv", memory, log).
      3. Measure: the rows' prediction error against exp["rows"]; if it's beyond TOLERANCE, forage: count rows by campus and
         name any expected campus that sent nothing.
      4. For each campus: the share of rows with credits empty (credits_of helps). Over MAX_EMPTY: keep the rows, set the
         credits aside, and tell a person. Then its mean credits against memory.credits: learn it the first night; if it moved
         more than CREDIT_DRIFT, tell a person once (memory.open) and only note it after; otherwise learn slowly from it."""
    raise NotImplementedError("TODO: the loop itself")


def run(start=dt.date(2026, 3, 9), end=dt.date(2026, 3, 29)):
    totals = {d: sum(c.values()) for d, c in read_counts().items()}
    memory, report = Memory(), []
    day = start
    while day <= end:
        n, log = night(day, totals, memory)
        for kind, text in log:
            print(f"{day} {day:%a}  {kind:12s} {text}")
            report.append((day, kind, text))
        day += dt.timedelta(days=1)
    people = [r for r in report if r[1] == "for a person"]
    print(f"\n{len(people)} findings for a person to decide, over {(end - start).days + 1} nights; the run never stopped.")
    return report


if __name__ == "__main__":
    run()
