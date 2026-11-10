"""Sets up the platform's monitoring of the sample sources, on Databricks: the checks for what no rule
names. Kept as code, so a change to a monitor is reviewed like a change to a test.

- Anomaly detection (in Public Preview) on the three source schemas: it learns when each table
  usually arrives and how many rows it brings, with no rule written, and marks a table unhealthy
  when it's late or short. The schema's owner is told: meta.owner on its source, at the address in
  governance/2-owners/owners.yml.
- A data profile of learning_platform.badges, by day of issued_at, refreshed each night: each
  column's statistics over time, in quality_monitoring.badges_profile_metrics, among them how many
  badges carry no credit.
- A SQL alert, Badges with no credit, on that profile (analyses/quality/badges_with_no_credit.sql):
  when more than 20 in 100 of a day's badges carry no credit, the badges' owner, the learning team,
  is told. Usually it's about 1 in 12, the welcome badges (DEC-LMS-03).

Their results land on the platform (system.data_quality_monitoring.table_results, and the profile's
metric table), where analyses/quality/platform_results.sql reads them for the scorecard.

Run it once, as a workspace admin, after the loading pipeline's first run
(scripts/setup/loading_pipeline.sql), when the tables are there. It uses the Databricks CLI's or the
environment's credentials (DATABRICKS_HOST and DATABRICKS_TOKEN), and calls the platform's REST APIs
as they're documented. Run again, it reports what's already set up and changes nothing.

    pip install databricks-sdk pyyaml
    dbt compile --target databricks --select badges_with_no_credit --profiles-dir .
    python scripts/setup/monitoring.py --catalog main --warehouse <SQL warehouse ID>
"""
import argparse
import json
from pathlib import Path

import yaml
from databricks.sdk import WorkspaceClient
from databricks.sdk.errors import DatabricksError

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "target" / "manifest.json"
REGISTER = ROOT / "governance" / "2-owners" / "owners.yml"
ALERT_QUERY = ROOT / "target" / "compiled" / "credentials" / "analyses" / "quality" / "badges_with_no_credit.sql"
SYSTEMS = ["student_system", "learning_platform", "short_courses"]
OUTPUT = "quality_monitoring"  # the profile's metric tables, and the loading pipeline's event log


def set_up(what, call):
    """Make one thing, or say why not: most often, it's there already."""
    try:
        call()
        print(f"set up: {what}")
    except DatabricksError as error:
        print(f"not set up: {what}: {error}")


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--catalog", required=True, help="the catalog the sources are in")
    parser.add_argument("--warehouse", required=True, help="the SQL warehouse the alert runs on")
    parser.add_argument("--timezone", default="UTC", help="the time zone of the nightly schedules")
    args = parser.parse_args()
    for path in (MANIFEST, ALERT_QUERY):
        if not path.exists():
            raise SystemExit(f"{path.relative_to(ROOT)} is missing: run dbt compile --target databricks "
                             "--select badges_with_no_credit --profiles-dir . first")
    manifest = json.loads(MANIFEST.read_text())
    emails = {o["name"]: o["email"] for o in yaml.safe_load(REGISTER.read_text())["owners"]}
    owner = {s["source_name"]: s["meta"]["owner"] for s in manifest["sources"].values()}
    w = WorkspaceClient()
    post = lambda path, body: w.api_client.do("POST", path, body=body)

    # Anomaly detection, a schema at a time, telling the schema's owner when a table is unhealthy
    for system in SYSTEMS:
        schema = w.schemas.get(full_name=f"{args.catalog}.{system}")
        set_up(f"anomaly detection on {system}, telling {owner[system]}",
               lambda: post("/api/data-quality/v1/monitors", {
                   "object_type": "schema", "object_id": schema.schema_id,
                   "anomaly_detection_config": {"notification_settings": {
                       "on_unhealthy_table": {"email_addresses": [emails[owner[system]]]}}}}))

    # The badges' profile, by day, refreshed each night at 3, after the load and the build
    set_up(f"the schema {OUTPUT}", lambda: w.schemas.create(name=OUTPUT, catalog_name=args.catalog))
    output = w.schemas.get(full_name=f"{args.catalog}.{OUTPUT}")
    badges = w.tables.get(full_name=f"{args.catalog}.learning_platform.badges")
    set_up("a data profile of learning_platform.badges",
           lambda: post("/api/data-quality/v1/monitors", {
               "object_type": "table", "object_id": badges.table_id,
               "data_profiling_config": {
                   "output_schema_id": output.schema_id,
                   "time_series": {"timestamp_column": "issued_at",
                                   "granularities": ["AGGREGATION_GRANULARITY_1_DAY"]},
                   "schedule": {"quartz_cron_expression": "0 0 3 * * ?", "timezone_id": args.timezone}}}))

    # The alert, each night at 4, to the badges' owner: a notification destination for the owner's
    # address, made once, since the alert's subscribers are workspace users or destinations
    team = owner["learning_platform"]
    found = w.api_client.do("GET", "/api/2.0/notification-destinations").get("results", [])
    destination = next((d["id"] for d in found if d["display_name"] == team), None)
    if not destination:
        destination = post("/api/2.0/notification-destinations",
                           {"display_name": team, "config": {"email": {"addresses": [emails[team]]}}})["id"]
    if any(a["display_name"] == "Badges with no credit"
           for a in w.api_client.do("GET", "/api/2.0/alerts").get("results", [])):
        print("not set up: the alert Badges with no credit: it's there already")
        return
    set_up(f"the alert Badges with no credit, telling {team}",
           lambda: post("/api/2.0/alerts", {
               "display_name": "Badges with no credit",
               "query_text": ALERT_QUERY.read_text(),
               "warehouse_id": args.warehouse,
               "evaluation": {
                   "source": {"name": "percent_zeros"},
                   "comparison_operator": "GREATER_THAN",
                   "threshold": {"value": {"double_value": 20}},
                   "notification": {"subscriptions": [{"destination_id": destination}], "notify_on_ok": True},
                   "empty_result_state": "OK"},
               "schedule": {"quartz_cron_schedule": "0 0 4 * * ?", "timezone_id": args.timezone}}))


if __name__ == "__main__":
    main()
