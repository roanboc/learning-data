-- The census-day count of one faculty, written once, as a function any agent can call: through the
-- Unity Catalog functions tool server, or in SQL. Databricks only; CI doesn't run it.
--
-- It reads Planning's census-day count (examples/planning/models/planning_enrolments_at_census.sql)
-- and adds nothing to it, so the count keeps one home: the census rule, and the test against the
-- census report, stay with the model. Its comment is what an agent reads as the tool's description.
--
-- Created in production after review (Jun Park, the code) and approval (Noor Rahman), like any change
-- to production. Faculty names are Planning's own, as in seeds/expected/planning/census_report.csv.

create or replace function <production catalog>.<planning schema>.census_day_students(
    faculty string comment 'The faculty, by its name, as Planning writes it, such as Faculty of Health'
)
returns bigint
comment 'Students on census day in one faculty, each counted once, as their record stood that day. Not student load: load is in full-time equivalents. Students of a joint degree in no faculty, such as Health data, count in no faculty.'
return
    select learners_enrolled
    from <production catalog>.<planning schema>.planning_enrolments_at_census
    where faculty_name = census_day_students.faculty;
