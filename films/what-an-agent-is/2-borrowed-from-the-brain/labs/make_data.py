"""Make the labs' data: invented course registrations at a university with three campuses, North, South and City.

    python make_data.py            # writes data/ next to this file (about 2 MB), the same every time

What it writes:
  data/daily_counts.csv       Labs 1 and 3: one row per day and campus, 5 January to 26 April 2026 (16 weeks), the rows each campus
                              sent that night. Mondays are busiest (about 4,100 rows), weekends quiet (about 400 to 600).
  data/extracts/YYYY-MM-DD.csv  Lab 2: the registration rows themselves for 9 to 29 March 2026 (three weeks), one file a night:
                              student_id, course_id, campus, credits, registered_at.

What happens in it, on purpose (the labs ask you to find these, so read this only after you've tried):
  * Thursday 5 March: the night's load ran twice, so every row came twice (about 6,000 rows instead of about 3,000).
  * Monday 16 March: City sent nothing. North sent 1,010 rows and South 1,020: 2,030 in all, against about 4,100 on most Mondays.
  * From Monday 13 April (Lab 3): a fourth campus, East, opens and sends rows every night from then on.
  * In the extracts (Lab 2): from 11 March, the student system names the course column course_code instead of course_id; on
    18 March, City leaves credits empty on every row; from 23 March, South sends credits in hours (ten times the number).

Everything here is invented: the university, its campuses and every number. Only the standard library is needed (Python 3.9+).
"""
import csv
import datetime as dt
import pathlib
import random

HERE = pathlib.Path(__file__).resolve().parent
DATA = HERE / "data"
START = dt.date(2026, 1, 5)          # a Monday
DAYS = 16 * 7
WEEKDAY = [4100, 3600, 3300, 3000, 2400, 600, 400]   # Monday .. Sunday, all campuses
SHARE = {"North": 0.25, "South": 0.25, "City": 0.50}
DOUBLED = dt.date(2026, 3, 5)
OUTAGE = dt.date(2026, 3, 16)
EAST_FROM = dt.date(2026, 4, 13)
EXTRACT_FROM, EXTRACT_TO = dt.date(2026, 3, 9), dt.date(2026, 3, 29)
RENAMED_FROM = dt.date(2026, 3, 11)   # the course column renamed: course_code
EMPTY_CREDITS = dt.date(2026, 3, 18)  # City: credits empty
HOURS_FROM = dt.date(2026, 3, 23)     # South: credits in hours


def counts():
    """{(day, campus): rows}, the same every time."""
    rnd = random.Random(1888)
    out = {}
    for i in range(DAYS):
        day = START + dt.timedelta(days=i)
        base = WEEKDAY[day.weekday()]
        for campus, share in SHARE.items():
            n = round(base * share * rnd.uniform(0.96, 1.04))
            if day == DOUBLED:
                n *= 2
            if day == OUTAGE:
                n = {"North": 1010, "South": 1020, "City": 0}[campus]
            out[(day, campus)] = n
        if day >= EAST_FROM:
            out[(day, "East")] = round(base * 0.22 * rnd.uniform(0.96, 1.04))
    return out


def write_counts(c):
    with open(DATA / "daily_counts.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["date", "weekday", "campus", "rows"])
        for (day, campus), n in sorted(c.items(), key=lambda kv: (kv[0][0], kv[0][1])):
            w.writerow([day.isoformat(), day.strftime("%A"), campus, n])


def write_extracts(c):
    rnd = random.Random(1906)
    ex = DATA / "extracts"
    ex.mkdir(parents=True, exist_ok=True)
    day = EXTRACT_FROM
    while day <= EXTRACT_TO:
        rows = []
        for campus in SHARE:
            for k in range(c[(day, campus)]):
                credits = rnd.choice([5, 5, 10, 10, 10, 15])
                rows.append({"student_id": f"S{rnd.randrange(100000, 999999)}",
                             "course": f"{campus[:1]}{rnd.randrange(100, 400)}",
                             "campus": campus,
                             "credits": credits,
                             "registered_at": f"{day.isoformat()}T{rnd.randrange(7, 23):02d}:{rnd.randrange(60):02d}"})
        rnd.shuffle(rows)
        with open(ex / f"{day.isoformat()}.csv", "w", newline="") as f:
            renamed = day >= RENAMED_FROM
            cols = ["student_id", "course_code" if renamed else "course_id", "campus", "credits", "registered_at"]
            w = csv.writer(f)
            w.writerow(cols)
            for r in rows:
                cr = r["credits"]
                if day == EMPTY_CREDITS and r["campus"] == "City":
                    cr = ""
                elif day >= HOURS_FROM and r["campus"] == "South":
                    cr = cr * 10
                w.writerow([r["student_id"], r["course"], r["campus"], cr, r["registered_at"]])
        day += dt.timedelta(days=1)


def main():
    DATA.mkdir(exist_ok=True)
    c = counts()
    write_counts(c)
    write_extracts(c)
    print(f"wrote {DATA / 'daily_counts.csv'} and {len(list((DATA / 'extracts').glob('*.csv')))} nightly extracts in {DATA / 'extracts'}")


if __name__ == "__main__":
    main()
