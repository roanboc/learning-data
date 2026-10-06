"""Checks the semantic layer's metric against the census report, faculty by faculty.

The metric learners_near_graduate_certificate is what BI reads; the reconciliation test checks
the mart under it. This checks the metric itself, queried with MetricFlow on DuckDB:

    pip install dbt-metricflow==0.15.0
    dbt build --profiles-dir .
    DBT_PROFILES_DIR=. mf query --metrics learners_near_graduate_certificate \\
        --group-by learner_award__faculty_name,learner_award__census_date --csv target/metric.csv
    python scripts/check/check_metric.py
"""
import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def main():
    metric = {}
    with open(ROOT / "target" / "metric.csv") as f:
        for row in csv.DictReader(f):
            day = row["learner_award__census_date__day"][:10]
            metric[(day, row["learner_award__faculty_name"])] = int(row["learners_near_graduate_certificate"])
    report = {}
    with open(ROOT / "seeds" / "expected" / "planning" / "census_report.csv") as f:
        for row in csv.DictReader(f):
            report[(row["census_date"], row["faculty_name"])] = int(row["learners_near_graduate_certificate"])

    different = {key for key in metric.keys() | report.keys() if metric.get(key, 0) != report.get(key, 0)}
    for census_date, faculty in sorted(different):
        print(f"{census_date} {faculty}: metric {metric.get((census_date, faculty), 0)}, "
              f"census report {report.get((census_date, faculty), 0)}", file=sys.stderr)
    if different:
        return 1
    print(f"the metric matches the census report: {sum(metric.values())} learners, {len(metric)} faculties")
    return 0


if __name__ == "__main__":
    sys.exit(main())
