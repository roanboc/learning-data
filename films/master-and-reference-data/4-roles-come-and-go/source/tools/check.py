# Runs the series' check.py (films/master-and-reference-data/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
# First it checks that the film's dates are the example project's (films/analytics-engineering/project/data/): each office's card in
# chapter 4 shows its own dates, the last day included; the bands and the role table's valid_to, exclusive, end the day after; and
# recorded_at is the day the platform recorded the row's latest change (a source's _valid_from), so no row knows its end too early.
import csv, datetime, json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve()
DATA = HERE.parents[4] / "analytics-engineering" / "project" / "data"
PLAN = (HERE.parents[1] / "src" / "plan.js").read_text()


def const(name):  # a constant of src/plan.js, as data
    lit = re.search(r"const %s=(\[.*?\]);" % name, PLAN, re.S).group(1)
    return json.loads(re.sub(r"([{,])(\w+):", r'\1"\2":', lit))


def rows(path, **match):  # the source's rows for her, as the platform holds them
    with open(DATA / path, newline="", encoding="utf-8") as f:
        return [r for r in csv.DictReader(f) if all(r[k] == v for k, v in match.items())]


day = datetime.date.fromisoformat
after = lambda d: (day(d) + datetime.timedelta(days=1)).isoformat()
on = lambda r: r["_valid_from"][:10]  # the day the platform recorded it
card = lambda d, year=True: "%d %s" % (day(d).day, day(d).strftime("%b")) + (" %d" % day(d).year if year else "")
today = re.search(r'M4_NOW=m4_d\("([\d-]+)"\)', PLAN).group(1)
cards = {c[0]: c[3] for c in const("M4_SYS")}
per = {p["k"]: (p["a"], p["b"]) for p in const("M4_PER")}
table = {(r[0], r[2]): r[3:] for r in const("M4_TROWS") if len(r) > 3}

first = rows("student_system/past_learners.csv", student_id="S-17142")
enrolled, completed = [r for r in first if r["status_code"] == "ENR"][0], [r for r in first if r["status_code"] == "CMP"][0]
again = rows("student_system/learners.csv", student_id="S-20436", status_code="ENR")[0]
alum = rows("alumni_system/alumni.csv", alumni_id="A-61207")[0]
known = sorted((r for r in rows("hr_system/contracts.csv", staff_id="E-4417") if on(r) <= today), key=lambda r: r["starts_on"])
s1 = known[-1]
res = rows("research_system/project_members.csv", member_id="R-3082", project_code="RP-26017")[0]

want = [
    ("the student system's card", cards["student"], "from " + card(again["effective_date"])),
    ("HR's card", cards["tutor"], card(s1["starts_on"], False) + " – " + card(s1["ends_on"])),
    ("the research office's card", cards["researcher"], card(res["starts_on"], False) + " – " + card(res["ends_on"])),
    ("the alumni office's card", cards["alumna"], "since " + card(alum["graduated_on"])),
    ("the tutor's contracts known on " + today, const("M4_TERMS"),
     [[r["teaching_period"][-2:], r["starts_on"], after(r["ends_on"])] for r in known]),
    ("her first student band", list(per["stu1"]), [enrolled["effective_date"], completed["effective_date"]]),
    ("her second student band", list(per["stu2"]), [again["effective_date"], None]),
    ("her alumna band", list(per["alu"]), [alum["graduated_on"], None]),
    ("her researcher band", list(per["res"]), [res["starts_on"], after(res["ends_on"])]),
    # an applicant role ends when she enrols, and is recorded with it; admissions isn't a source in the project yet
    ("the first applicant row", table[("applicant", "bachelor's")][1:], [enrolled["effective_date"], on(enrolled)]),
    ("the first student row", table[("student", "bachelor's")], [enrolled["effective_date"], completed["effective_date"], on(completed)]),
    # a role is keyed by the record that grants it (the project's DEC-PER-03): the alumna role by her alumni record
    ("the alumni row", table[("alumna", "bachelor's")], [alum["graduated_on"], None, on(alum)]),
    ("the second applicant row", table[("applicant", "master's")][1:], [again["effective_date"], on(again)]),
    ("the second student row", table[("student", "master's")], [again["effective_date"], None, on(again)]),
    ("the Semester 1 2026 row", table[("tutor", "unit · S1 2026")], [s1["starts_on"], after(s1["ends_on"]), on(s1)]),
    ("the researcher row", table[("researcher", "project")], [res["starts_on"], after(res["ends_on"]), on(res)]),
]
wrong = [(what, got, should) for what, got, should in want if got != should]
for what, got, should in wrong:
    print("  %s: the film has %s, the project's data says %s" % (what, got, should))
if wrong:
    sys.exit("%d of the film's dates differ from the example project's" % len(wrong))
print("the film's dates are the example project's: %d checked, with %d contracts known on %s" % (len(want), len(known), today))

sys.path.insert(0, str(HERE.parents[3] / "shared" / "tools"))
import run; run.tool("check.py")
