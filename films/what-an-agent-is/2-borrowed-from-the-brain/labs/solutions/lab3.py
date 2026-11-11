"""Lab 3, learning from the miss: a solution. Run it from the labs folder:  python solutions/lab3.py

A brain learns from its prediction errors, but not from every one: a stumble on a stopped escalator doesn't teach your legs that
escalators never move. Here the agent keeps an expectation for each campus and each weekday, and compares three ways to learn:
  never      the expectation stays what it was in March
  blindly    every night moves the expectation, the outage included
  gated      it learns only from nights that matched, and from a change a person has confirmed is the new normal"""
import datetime as dt
import pathlib
import statistics
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import read_counts  # noqa: E402

START, END = dt.date(2026, 3, 9), dt.date(2026, 4, 26)
TOLERANCE, ALPHA = 0.15, 0.5
# what people decided, by date: the agent proposes, a person confirms (the agents never approve their own changes)
DECISIONS = {dt.date(2026, 4, 13): ("new normal", "East", "East campus opened on 13 April; its rows are expected from now on")}


def seed(counts, before):
    """The first expectation: each campus's rows on each weekday, the median of the four weeks before `before` (a median, so
    one odd night, such as 5 March's double load, doesn't move it)."""
    exp = {}
    for d, c in counts.items():
        if before - dt.timedelta(days=28) <= d < before:
            for campus, n in c.items():
                exp.setdefault((campus, d.weekday()), []).append(n)
    return {k: statistics.median(v) for k, v in exp.items()}


def learn(mode, surprised, confirmed):
    """Should tonight's rows move the expectation? Never; always; or only from a night that matched, or a change a person confirmed."""
    if mode == "never":
        return False
    if mode == "blindly":
        return True
    return (not surprised) or bool(confirmed)


def run(mode, counts, quiet=False):
    exp = seed(counts, START)
    flagged = []
    for day, c in counts.items():
        if not START <= day <= END:
            continue
        wd = day.weekday()
        surprises = []
        for campus, n in c.items():
            e = exp.get((campus, wd))
            if e is None:
                surprises.append((campus, None, n))
            elif abs(n - e) / e > TOLERANCE:
                surprises.append((campus, e, n))
        if surprises:
            flagged.append(day)
            if not quiet:
                print(f"  {day} {day:%a}: " + "; ".join(f"{k} {n:,} (expected {'nothing' if e is None else f'about {e:,.0f}'})" for k, e, n in surprises))
        decision = DECISIONS.get(day)
        for campus, n in c.items():
            key, e = (campus, wd), exp.get((campus, wd))
            surprised = any(s[0] == campus for s in surprises)
            confirmed = decision and decision[0] == "new normal" and decision[1] == campus
            if learn(mode, surprised, confirmed):
                exp[key] = n if e is None else (1 - ALPHA) * e + ALPHA * n
            if confirmed and mode == "gated":
                # a new source with only one night seen: expect it on the other weekdays in the same proportion as the rest
                others = sum(v for k, v in c.items() if k != campus)
                for w in range(7):
                    if (campus, w) not in exp:
                        rest = sum(v for (k, ww), v in exp.items() if ww == w and k != campus)
                        exp[(campus, w)] = n * rest / others
    return flagged


def main():
    counts = read_counts()
    out = {}
    for mode in ("never", "blindly", "gated"):
        print(f"{mode}:")
        out[mode] = run(mode, counts)
        print(f"  {len(out[mode])} nights flagged\n")
    return out


if __name__ == "__main__":
    main()
