# A worked example: more readers than people

On pay day, Thursday 5 November 2026, casual teaching cost has five readers. Each reads it where
it's defined, the metric view `university.prod_marts.casual_teaching_cost`, as the person it acts
for or as itself, with only what it may see. Every reader gives Health the same A$1.84 million so far
this semester, and each is written down in the project as an exposure, with its owner
(`exposures/finance/_finance__exposures.yml`), so a change to the measure names who it touches.
*More readers than people*, film 3 of 3 of *From tables to decisions*, shows them; the decision is
DEC-FIN-06 (`models/marts/finance/_finance__decisions.yml`).

Databricks only: nothing here runs on DuckDB or in CI. The numbers are the film's; the example data
counts far less.

| Reader | Reads as | Through | Sees | Exposure |
|---|---|---|---|---|
| Genie One | The person asking | The data team's Genie Agent *Casual teaching cost* (`examples/reports-on-demand/`) | Their own faculty, or every faculty for Finance | `casual_teaching_genie` |
| Finance's budget pack, a Power BI report | Each analyst, signed in as themselves | Power BI's Azure Databricks connector, in DirectQuery, with a native query (`budget_pack.sql`) | Every faculty | `budget_pack` |
| The faculties' tutor planning, an app | The person using it | Databricks Apps, with user authorization (`tutor_planning_app.md`) | Their own faculty | `tutor_planning` |
| Finance's pay-day agent | Itself: the service principal `finance-payday-agent` | Genie One's MCP server (`finance_payday_agent.md`) | Every faculty's totals, never the claims | `finance_payday_agent` |
| A group of universities | Itself: a recipient outside Databricks | The OpenSharing share `teaching_costs` (`faculty_totals_share.sql`) | Totals by faculty, for the periods Finance has reported | `faculty_totals_share` |

The rules are kept where the data lives, not in any reader:

- **Who reads which faculty** is a row filter on the claims, `mart_finance__casual_claims`: a Unity
  Catalog function that sees who is asking (`macros/finance/faculty_row_filter.sql`), set on the
  table after each build, on Databricks, when the var `faculty_readers` names the groups. It holds
  through the metric view, for every reader, so no reader's code repeats it.
- **What goes outside** is one small table, `mart_finance__faculty_totals`: the measure by faculty,
  for the teaching periods Finance has reported (`seeds/reference/finance/reported_periods.csv`),
  never by unit, since a unit with one tutor would give away that tutor's pay (Ingrid Holm, HR). A
  metric view can't be shared when a table under it has a row filter, and a recipient outside
  Databricks can't read one, so the share holds a table made from the measure.
- **The mirror** of the catalog in Microsoft Fabric stays, for what every reader there may see (Noor's
  rule): metric views don't appear in it, and every query through it runs as the one sign-in that
  set it up, so the catalog's rights stay behind. That's how the budget pack once summed the pay
  paid under the measure's name, A$1.56 million.

To list who a change to the measure touches, on Databricks, where the readers are:

```
dbt ls --target databricks --select casual_teaching_cost+ --resource-type exposure
```

| File | What it is |
|---|---|
| `budget_pack.sql` | The query Finance's budget pack sends to Databricks: the measure by name, by faculty, for the semester so far |
| `tutor_planning_app.md` | How the faculties' planning app reads: as the person using it, with the `sql` scope, and the query it runs |
| `finance_payday_agent.md` | The pay-day agent: its service principal, its rights (Genie One's MCP server and the metric view, never the claims), its instructions, and the person who sends its draft |
| `faculty_totals_share.sql` | The share with the group of universities: one table, and a recipient outside Databricks |
