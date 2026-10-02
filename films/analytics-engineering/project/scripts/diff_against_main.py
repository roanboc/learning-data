"""Compares one table between this branch's build and main's, by its key.

Build main into target/main.duckdb and this branch into target/credentials.duckdb first (see
skills/reconcile-and-diff/SKILL.md). Then, for example:

    python scripts/diff_against_main.py dev_marts.mart_planning__near_award learner_award_key
    python scripts/diff_against_main.py dev_core.core_credential_v2 credential_key
    python scripts/diff_against_main.py dev_core.core_learner_v1 learner_key,valid_from

Prints the keys only in this branch, the keys only in main, and, for keys in both, how many
rows changed in each column. Counts only: no personal data leaves the database.
"""
import argparse
import sys

import duckdb

BRANCH = "target/credentials.duckdb"
MAIN = "target/main.duckdb"


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("table", help="schema.table, as in the DuckDB build (dev_marts.mart_planning__near_award)")
    parser.add_argument("key", help="the table's key: one column, or several joined by commas")
    args = parser.parse_args()

    db = duckdb.connect(BRANCH, read_only=True)
    db.execute(f"attach '{MAIN}' as main_build (read_only)")
    branch, main_table, key = args.table, f"main_build.{args.table}", args.key

    only = "select count(*) from (select {key} from {a} except select {key} from {b})"
    print(f"{args.table}, by {key}")
    print(f"  keys only in this branch: {db.sql(only.format(key=key, a=branch, b=main_table)).fetchone()[0]}")
    print(f"  keys only in main:        {db.sql(only.format(key=key, a=main_table, b=branch)).fetchone()[0]}")

    key_columns = [part.strip() for part in key.split(",")]
    columns = [row[0] for row in db.sql(f"describe {branch}").fetchall() if row[0] not in key_columns]
    main_columns = {row[0] for row in db.sql(f"describe {main_table}").fetchall()}
    for column in columns:
        if column not in main_columns:
            print(f"  {column}: new in this branch")
            continue
        changed = db.sql(
            f"select count(*) from {branch} as b inner join {main_table} as m using ({key}) "
            f"where b.{column} is distinct from m.{column}"
        ).fetchone()[0]
        if changed:
            print(f"  {column}: {changed} rows changed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
