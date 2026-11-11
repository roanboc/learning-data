"""Lab 2, the foraging loop: a solution. Run it from the labs folder:  python solutions/lab2.py

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

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
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
    only that column, never the run."""
    found = [memory.mapping.get(c, c) for c in found]
    mapping = {}
    for want in EXPECTED_COLUMNS:
        if want in found:
            continue
        cand = [c for c in found if KNOWN_ALIASES.get(c) == want] or difflib.get_close_matches(want, found, n=1, cutoff=0.6)
        if cand:
            mapping[cand[0]] = want
            log.append(("adapted", f"column '{want}' is missing; '{cand[0]}' holds the same thing, so it is read as '{want}' from now on"))
        else:
            log.append(("for a person", f"column '{want}' is missing and nothing looks like it"))
    memory.mapping.update(mapping)
    return mapping


def load(path, memory, log):
    """Act: read the extract, columns mapped. A file that can't be read is a finding, not a crash."""
    try:
        with open(path, newline="") as f:
            r = csv.reader(f)
            header = next(r)
            match_columns(header, memory, log)
            names = [memory.mapping.get(c, c) for c in header]
            return [dict(zip(names, row)) for row in r]
    except (OSError, StopIteration, csv.Error) as e:
        log.append(("for a person", f"couldn't read {path.name}: {e}"))
        return []


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
    """One night of the loop: expect, act, measure, go looking, adapt where it's safe, and hand the rest to a person."""
    log = []
    exp = expectations(day, totals, memory)
    rows = load(DATA / "extracts" / f"{day}.csv", memory, log)
    by_campus = Counter(r.get("campus", "?") for r in rows)
    # rows: the prediction error, and where it comes from
    if exp["rows"]:
        err = (len(rows) - exp["rows"]) / exp["rows"]
        if abs(err) > TOLERANCE:
            missing = sorted(exp["campuses"] - set(by_campus))
            where = f"{', '.join(missing)} sent nothing" if missing else f"by campus: {dict(by_campus)}"
            log.append(("for a person", f"{len(rows):,} rows against about {exp['rows']:,.0f} ({err:+.0%}); foraged by campus: {where}"))
    # credits: empty values, and a shift in what they mean
    vals, empty = credits_of(rows)
    for campus, n in sorted(by_campus.items()):
        share = empty[campus] / n
        if share > exp["max_empty"]:
            log.append(("adapted", f"{campus}: credits empty on {share:.0%} of its {n:,} rows; those rows are kept, their credits set aside, not guessed"))
            log.append(("for a person", f"{campus} sent no credits tonight"))
        if vals[campus]:
            mean = statistics.fmean(vals[campus])
            usual = exp["credits"].get(campus)
            if usual is None:
                memory.credits[campus] = mean
            elif abs(mean - usual) / usual > CREDIT_DRIFT:
                if ("credits", campus) in memory.open:
                    log.append(("noted", f"{campus}: credits still about x{mean / usual:.0f}; still with a person"))
                else:
                    memory.open.add(("credits", campus))
                    log.append(("for a person", f"{campus}: credits average {mean:.1f}, usually {usual:.1f} (x{mean / usual:.0f}); not converted until someone says what changed"))
            else:
                memory.credits[campus] = 0.8 * usual + 0.2 * mean   # learn slowly, only from nights that look normal
    return len(rows), log


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
