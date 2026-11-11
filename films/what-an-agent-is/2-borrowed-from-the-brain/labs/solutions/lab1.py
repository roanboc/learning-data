"""Lab 1, the reflex and the predictor: a solution. Run it from the labs folder:  python solutions/lab1.py"""
import datetime as dt
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import expect, read_counts  # noqa: E402

LAST_DAY = dt.date(2026, 4, 12)   # Lab 3 picks up from 13 April
TOLERANCE = 0.15                  # how big a surprise has to be before it's worth a person's time


def reflex(n):
    """The script's one rule: the table isn't empty. True means it passes."""
    return n > 0


def threshold(n, low=2000, high=5000):
    """A fixed rule someone tuned once, by eye. True means it passes."""
    return low <= n <= high


def prediction_error(expected, actual):
    """How far off the guess was, as a share of the guess: -0.5 is half of what was expected."""
    return (actual - expected) / expected


def predictor(totals, day):
    """Say what's expected before looking; then look, and measure the gap. Returns (expected, error, passes)."""
    expected = expect(totals, day)
    if expected is None:
        return None, None, True   # still learning what a normal week looks like: nothing to compare with yet
    err = prediction_error(expected, totals[day])
    return expected, err, abs(err) <= TOLERANCE


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
            short = {c: v for c, v in counts[day].items()}
            print(f"{day} {day:%a}: expected about {exp:,.0f}, got {n:,} ({err:+.0%}). By campus: {short}")
    for k, days in flagged.items():
        weekends = sum(d.weekday() >= 5 for d in days)
        print(f"{k:10s} flags {len(days):2d} days ({weekends} of them weekends): {', '.join(str(d) for d in days if d.weekday() < 5) or '-'}")
    return flagged


if __name__ == "__main__":
    run()
