# The faculties' tutor planning

The app the faculties plan their tutors in, built by the data team with Databricks Apps (exposure
`tutor_planning`, DEC-FIN-06). It shows what casual teaching has cost the faculty so far, beside the
tutor hours each unit will need. Every faculty uses it, and each may see only its own. Databricks
only; nothing here runs on DuckDB or in CI.

**Owner:** the faculties, who plan in it. The data team builds and runs it.

## How it reads: as the person using it

An app can read in two ways. With app authorization it reads as its own service principal, so
everyone using it shares the app's rights. With user authorization, Databricks forwards the user's
access token to the app, and the app reads as that person. This one has user authorization, with
the scope `sql` only, so it may run queries for the person and do nothing else in their name. The
token comes in the request's `x-forwarded-access-token` header; the docs page *Configure
authorization in a Databricks app* has the code that opens a connection with it.

So the row filter on the claims (`macros/finance/faculty_row_filter.sql`) sees the person: Anil
Kurian, in `health_planners`, gets the Faculty of Health's numbers, and nothing in the app's code
decides who sees what.

## The query it runs

```sql
-- What casual teaching has cost the faculty so far this semester: the person's own faculty, since
-- the row filter returns no other. Run with the person's token.
SELECT
    faculty_name,
    MEASURE(casual_teaching_cost) AS casual_teaching_cost
FROM university.prod_marts.casual_teaching_cost
WHERE teaching_period = '2026-S2'
GROUP BY faculty_name
```

The tutor hours each unit will need are the faculty's own plan, kept in the app. Tutor counts and
hours only: the app shows no one's pay.
