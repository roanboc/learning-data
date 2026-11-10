# Finance's pay-day agent

The agent that drafts Rohan Desai's note to the deans every pay day: each faculty's casual teaching
cost so far this semester (exposure `finance_payday_agent`, DEC-FIN-06). It drafts; Rohan checks the
note and sends it. Databricks only; nothing here runs on DuckDB or in CI.

**Owner:** Rohan Desai, Finance.

## Its name: a service principal of its own

It works alone, on a schedule, with no person to act for, so it reads as itself: the service
principal `finance-payday-agent`, under the same rules as people.

## Its rights: only what its job reads

It asks Genie One through Genie One's MCP server, so it has EXECUTE on that server, as the docs page
*Databricks-provided MCPs* describes. And it may read the measure, nothing under it:

```sql
-- finance-payday-agent, by its application ID: the metric view, and the catalog and schema it's in.
-- No grant on mart_finance__casual_claims: it can't read who worked which hours, or what they were paid.
GRANT USE CATALOG ON CATALOG university TO `<finance-payday-agent's application ID>`;
GRANT USE SCHEMA ON SCHEMA university.prod_marts TO `<finance-payday-agent's application ID>`;
GRANT SELECT ON university.prod_marts.casual_teaching_cost TO `<finance-payday-agent's application ID>`;
```

Its note covers every faculty, so it's in `all_faculties`, the group the row filter lets read every
faculty's rows (`macros/finance/faculty_row_filter.sql`). A group there says which rows it sees; its
grants say what it may read at all, and they stop at the metric view.

## Its instructions

> Draft the pay-day note to the deans: each faculty's sessional teaching cost so far this semester,
> from Genie One, with the date it's as at. Totals only, never a person's pay. Rohan Desai checks
> the note and sends it.

"Sessional teaching cost" is one of the measure's synonyms (`models/marts/finance/casual_teaching_cost.sql`),
so Genie One knows the word, and answers from the same definition as every other reader.
