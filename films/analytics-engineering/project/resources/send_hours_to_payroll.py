"""The claims job's second task: sends the hours to pay to the payroll system.

The first task built and tested mart_payroll__hours_to_pay, and this one runs only when it passed,
so nothing its tests stopped reaches payroll (resources/claims.job.yml). The payroll system, which
the university buys and doesn't run on the platform, imports one file a pay run from its inbox,
named by the pay day. The file goes to the volume payroll.outbox, which only the platform's
service principal and the university's file transfer can read; the transfer copies it to the
inbox. On a Monday that isn't before a pay day, no pay run is open and nothing is sent.

Databricks only. Its parameters, from the job: --catalog <catalog> --schema <schema>
"""
import argparse
import csv

from pyspark.sql import SparkSession

COLUMNS = ["staff_id", "contract_id", "unit_code", "duty", "worked_on", "hours", "amount"]


def system_id(business_key):
    """The HR system's own ID, after its key set: HR|E-4417 is E-4417."""
    return business_key.split("|", 1)[1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", required=True)
    parser.add_argument("--schema", required=True)
    args = parser.parse_args()

    spark = SparkSession.builder.getOrCreate()
    table = f"{args.catalog}.{args.schema}_marts.mart_payroll__hours_to_pay"
    rows = spark.table(table).orderBy("staff_bk", "worked_on", "claim_key").collect()
    if not rows:
        print("No pay run is open today: nothing to send.")
        return

    pay_day = rows[0]["pay_day"]
    path = f"/Volumes/{args.catalog}/payroll/outbox/hours_to_pay_{pay_day:%Y-%m-%d}.csv"
    with open(path, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(COLUMNS)
        for row in rows:
            writer.writerow([system_id(row["staff_bk"]), system_id(row["contract_bk"]), row["unit_code"],
                             row["duty"], row["worked_on"], row["hours"], row["amount"]])
    # counts only: the rows are people's pay, and stay out of the job's log
    print(f"Sent {len(rows)} claims for the pay day of {pay_day:%Y-%m-%d} to {path}")


if __name__ == "__main__":
    main()
