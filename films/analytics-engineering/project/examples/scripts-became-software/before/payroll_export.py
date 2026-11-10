# Payroll's export, as it ran until March 2026: a script on one person's laptop, run by hand before
# 6 a.m. on each pay day. It worked, for years. It's kept here only to show what moved into the
# project, and why it had to: nobody is to blame for it. Not run, and not part of the project.
#
# Its author moved to another team in 2024, and it kept running. When the claims moved into the
# claims app in February 2026, the spreadsheets it read stopped coming, and nobody else could change
# it safely: one copy, no history of why it was written this way, and no test to say whether a change
# broke it. Compare it with the project's way: models/marts/finance/mart_finance__casual_pay_paid.sql,
# its tests, macros/payroll/pay_day.sql, and the job in resources/payroll_export.job.yml.

import csv
import datetime
import glob
import os

FOLDER = os.path.expanduser("~/Payroll/approved claims")   # each faculty's approved claims, as spreadsheets
OUT = os.path.expanduser("~/Desktop/payroll_export.csv")    # then attached to an email to Finance

# Units to faculties, kept by hand. Add new units here.
FACULTY = {"HI101": "Faculty of Health", "DA101": "Faculty of Engineering and IT"}

NEXT_PAY_DAY = datetime.date(2026, 2, 26)   # change before each run


def pay_day(approved):
    # Paid on the next pay day if approved by 12:00 on the Monday before it, otherwise two weeks later.
    # Easter and the summer break move the close: change it by hand that week.
    monday_noon = datetime.datetime.combine(NEXT_PAY_DAY - datetime.timedelta(days=3), datetime.time(12))
    return NEXT_PAY_DAY if approved <= monday_noon else NEXT_PAY_DAY + datetime.timedelta(days=14)


totals = {}
for path in glob.glob(os.path.join(FOLDER, "*.csv")):
    for row in csv.DictReader(open(path)):
        approved = datetime.datetime.strptime(row["Approved"], "%d/%m/%Y %H:%M")
        key = (pay_day(approved), FACULTY.get(row["Unit"], "?"), row["Unit"])
        hours, pay, people = totals.get(key, (0.0, 0.0, set()))
        totals[key] = (hours + float(row["Hours"]), pay + float(row["Amount"]), people | {row["Staff ID"]})

with open(OUT, "w", newline="") as f:
    out = csv.writer(f)
    out.writerow(["Pay day", "Faculty", "Unit", "Casual staff", "Hours", "Pay"])
    for (day, faculty, unit), (hours, pay, people) in sorted(totals.items()):
        out.writerow([day, faculty, unit, len(people), round(hours, 2), round(pay, 2)])
print("done, email it to Finance")
