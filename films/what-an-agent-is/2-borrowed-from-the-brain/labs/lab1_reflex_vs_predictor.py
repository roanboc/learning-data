"""Lab 1 · The reflex and the predictor

A nightly script that waits for its trigger, runs, and checks one rule is a reflex. A brain does something else: before the
senses report, it says what it expects, and it pays attention only to the gap. Here you build both and run them on fourteen weeks
of one university's nightly course registrations (invented), then see which one notices what.

Setup:  python make_data.py   (once, in this folder)      Run:  python lab1_reflex_vs_predictor.py
Stuck?  solutions/lab1.py has one way to do it. Check yours:  python check.py 1

Fill in the four functions marked TODO. Everything else is done for you.
"""
import datetime as dt
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent / "solutions"))
from common import expect, read_counts  # noqa: E402  (reading the data, and the median of the same weekday)

LAST_DAY = dt.date(2026, 4, 12)
TOLERANCE = 0.15   # how big a surprise has to be before it's worth a person's time


def reflex(n):
    """The script's one rule: the table isn't empty. Return True when the night passes."""
    raise NotImplementedError("TODO: one line")


def threshold(n, low=2000, high=5000):
    """A fixed rule someone tuned once, by eye: between `low` and `high` rows. Return True when the night passes."""
    raise NotImplementedError("TODO: one line")


def prediction_error(expected, actual):
    """How far off the guess was, as a share of the guess: 2,030 against 4,100 is about -0.5."""
    raise NotImplementedError("TODO: one line")


def predictor(totals, day):
    """Say what's expected before looking, then look and measure the gap.
    totals: {date: rows that night}. Return (expected, error, passes).
    1. expected = expect(totals, day): the median of the same weekday over the last four weeks, or None in the first weeks.
    2. If it's None, there's nothing to compare with yet: return (None, None, True).
    3. Otherwise measure the prediction error, and pass the night only if it's within TOLERANCE either way."""
    raise NotImplementedError("TODO: a few lines")


def run():
    counts = read_counts(until=LAST_DAY)
    totals = {d: sum(c.values()) for d, c in counts.items()}
    flagged = {"reflex": [], "threshold": [], "predictor": []}
    for day, n in totals.items():
        if not reflex(n):
            flagged["reflex"].append(day)
        if not threshold(n):
            flagged["threshold"].append(day)
        exp, err, ok = predictor(totals, day)
        if not ok:
            flagged["predictor"].append(day)
            print(f"{day} {day:%a}: expected about {exp:,.0f}, got {n:,} ({err:+.0%}). By campus: {counts[day]}")
    for k, days in flagged.items():
        weekends = sum(d.weekday() >= 5 for d in days)
        print(f"{k:10s} flags {len(days):2d} days ({weekends} of them weekends): {', '.join(str(d) for d in days if d.weekday() < 5) or '-'}")
    return flagged


if __name__ == "__main__":
    run()
