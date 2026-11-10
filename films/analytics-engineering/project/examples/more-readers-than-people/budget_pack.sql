-- Finance's budget pack (exposure budget_pack, DEC-FIN-06): the query its Power BI report sends to
-- Databricks since pay day, 5 November 2026. Power BI's Azure Databricks connector, in DirectQuery,
-- runs it as the analyst who opens the report (single sign-on with Microsoft Entra ID, in the Power BI
-- service), so the row filter on the claims sees that analyst. It asks for the measure by name, so the
-- report counts casual teaching cost as the metric view defines it: A$1.84 million for Health so far.
-- Databricks only.
SELECT
    faculty_name,
    MEASURE(casual_teaching_cost) AS casual_teaching_cost
FROM university.prod_marts.casual_teaching_cost
WHERE teaching_period = '2026-S2'
GROUP BY faculty_name
ORDER BY faculty_name
