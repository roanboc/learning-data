-- What has casual teaching cost Health this semester, so far?
-- The query Genie ran for Rohan Desai, in Finance, on Thursday 5 November 2026, as Reports on demand shows it under
-- Show code. It reads the one measure of the metric view casual_teaching_cost, which Rohan defined in September 2026
-- (Defined in the open, the next film, adds it to Finance's marts). Semester 2 2026 is still running, so its total is a
-- total so far: A$1.84 million that day, in the films' numbers. Databricks only: a metric view doesn't run on DuckDB.
SELECT faculty_name, MEASURE(casual_teaching_cost)
FROM university.prod_marts.casual_teaching_cost
WHERE faculty_name = 'Faculty of Health'
  AND teaching_period = '2026-S2'
GROUP BY faculty_name
