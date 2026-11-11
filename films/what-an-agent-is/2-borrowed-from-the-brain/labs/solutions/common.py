"""What the three labs share: reading the data, and the same-weekday expectation (Lab 1's predictor)."""
import csv
import datetime as dt
import pathlib
import statistics
from collections import defaultdict

DATA = pathlib.Path(__file__).resolve().parents[1] / "data"


def need_data():
    if not (DATA / "daily_counts.csv").exists():
        raise SystemExit("No data yet: run  python make_data.py  in the labs folder first.")


def read_counts(until=None):
    """{date: {campus: rows}} from daily_counts.csv, up to and including `until` (a date), if given."""
    need_data()
    out = defaultdict(dict)
    with open(DATA / "daily_counts.csv", newline="") as f:
        for r in csv.DictReader(f):
            d = dt.date.fromisoformat(r["date"])
            if until is None or d <= until:
                out[d][r["campus"]] = int(r["rows"])
    return dict(sorted(out.items()))


def same_weekday(history, day, weeks=4):
    """The values in `history` ({date: number}) on the same weekday as `day`, in the `weeks` weeks before it, oldest first."""
    return [history[d] for d in (day - dt.timedelta(days=7 * k) for k in range(weeks, 0, -1)) if d in history]


def expect(history, day, weeks=4, least=2):
    """What a brain would expect for `day`: the median of the same weekday in the last few weeks (None until it has seen `least`)."""
    seen = same_weekday(history, day, weeks)
    return statistics.median(seen) if len(seen) >= least else None
