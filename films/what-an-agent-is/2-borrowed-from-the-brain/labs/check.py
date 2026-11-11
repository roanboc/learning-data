"""Check a lab against what it should find:   python check.py 1   (or 2, or 3; no number checks all three)
Add --solutions to check the solutions instead (the repository's tests do this, so the labs and their answers stay in step)."""
import contextlib
import datetime as dt
import importlib.util
import io
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
FILES = {1: "lab1_reflex_vs_predictor.py", 2: "lab2_foraging_loop.py", 3: "lab3_learning_from_the_miss.py"}
D = dt.date


def module(n, solutions):
    path = HERE / ("solutions/lab%d.py" % n if solutions else FILES[n])
    spec = importlib.util.spec_from_file_location("lab%d_under_check" % n, path)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def quietly(fn, *a):
    with contextlib.redirect_stdout(io.StringIO()):
        return fn(*a)


def check1(m):
    f = quietly(m.run)
    assert f["reflex"] == [], "the reflex should pass every night: no night was empty"
    assert len(f["threshold"]) == 29 and D(2026, 3, 16) not in f["threshold"], \
        "the fixed range should cry wolf on all 28 weekend nights, catch the double load on 5 March, and miss 16 March"
    assert f["predictor"] == [D(2026, 3, 5), D(2026, 3, 16)], "the predictor should flag exactly 5 March and 16 March"
    return "reflex 0 nights, fixed range 29 (28 of them weekends, and it misses 16 March), predictor 2: 5 and 16 March"


def check2(m):
    report = quietly(m.run)
    people = {(d, t.split(":")[0].split(" ")[0]) for d, k, t in report if k == "for a person"}
    days = sorted({d for d, k, t in report if k == "for a person"})
    assert days == [D(2026, 3, 16), D(2026, 3, 18), D(2026, 3, 23)], "a person should hear about 16, 18 and 23 March, once each: %s" % days
    assert any(d == D(2026, 3, 11) and k == "adapted" and "course_code" in t for d, k, t in report), "11 March: adopt course_code as course_id, and say so"
    assert any(d == D(2026, 3, 16) and "City" in t for d, k, t in report if k == "for a person"), "16 March: say which campus sent nothing"
    assert people, "the loop ran"
    return "21 nights, no crash; course_code adopted on 11 March; a person hears about City's empty night, City's empty credits and South's hours"


def check3(m):
    counts = m.read_counts()
    n = {mode: len(quietly(m.run, mode, counts)) for mode in ("never", "blindly", "gated")}
    assert n == {"never": 15, "blindly": 10, "gated": 2}, "flagged nights should be never 15, blindly 10, gated 2: %s" % n
    return "never learning flags East every night (15); learning blindly learns the outage and cries wolf after it (10); gated: 2"


def main(argv):
    sol = "--solutions" in argv
    labs = [int(a) for a in argv if a.isdigit()] or [1, 2, 3]
    if not (HERE / "data" / "daily_counts.csv").exists():
        import runpy
        quietly(runpy.run_path, str(HERE / "make_data.py"), None, "__main__")
    ok = True
    for n in labs:
        try:
            print("Lab %d: ok · %s" % (n, {1: check1, 2: check2, 3: check3}[n](module(n, sol))))
        except NotImplementedError as e:
            ok = False
            print("Lab %d: not finished yet (%s)" % (n, e))
        except AssertionError as e:
            ok = False
            print("Lab %d: not yet · %s" % (n, e))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
