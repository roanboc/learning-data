-- The platform team's nightly load, as a Lakeflow pipeline: the sample sources, each system's files
-- into its own schema, as scripts/setup/load_databricks.sql loads them by hand. Use one or the
-- other: both make the same seven tables, in student_system, learning_platform and short_courses.
--
-- Each table checks one thing as it's loaded, the expectation has_an_id: a row with no system key
-- (meta.system_key on its source) can't be told apart from another, or versioned, so it's kept out
-- (on violation drop row), and counted. The counts are on each table's Data quality tab and in the
-- pipeline's event log; analyses/quality/platform_results.sql reads them for the scorecard, which
-- gives each count to the table's owner (meta.owner on its source). The row itself is fixed where
-- it's kept, in its system, and loads the next night. Staging's not_null on each key stays.
--
-- 1. Upload data/ to a Unity Catalog volume, as for load_databricks.sql.
-- 2. Create an ETL pipeline (Jobs & Pipelines) with this file as its source code, the catalog the
--    sources go in as its default catalog, and in its settings:
--      parameters   data: the folder you uploaded, like /Volumes/main/landing/files/data
--      event log    published, as quality_monitoring.loading_pipeline_events (Advanced settings)
-- 3. Schedule it each night, before the build. Then set up the monitors: scripts/setup/monitoring.py.

create or refresh streaming table student_system.learners (
  constraint has_an_id expect (student_id is not null) on violation drop row
) as select * from stream read_files(:data || '/student_system/learners.csv', format => 'csv', header => true);

create or refresh streaming table student_system.awards (
  constraint has_an_id expect (award_code is not null) on violation drop row
) as select * from stream read_files(:data || '/student_system/awards.csv', format => 'csv', header => true);

create or refresh streaming table student_system.results (
  constraint has_an_id expect (result_id is not null) on violation drop row
) as select * from stream read_files(:data || '/student_system/results.csv', format => 'csv', header => true);

create or refresh streaming table learning_platform.users (
  constraint has_an_id expect (user_id is not null) on violation drop row
) as select * from stream read_files(:data || '/learning_platform/users.csv', format => 'csv', header => true);

create or refresh streaming table learning_platform.badges (
  constraint has_an_id expect (badge_id is not null) on violation drop row
) as select * from stream read_files(:data || '/learning_platform/badges.csv', format => 'csv', header => true);

create or refresh streaming table short_courses.learners (
  constraint has_an_id expect (customer_email is not null) on violation drop row
) as select * from stream read_files(:data || '/short_courses/learners.csv', format => 'csv', header => true);

create or refresh streaming table short_courses.enrolments (
  constraint has_an_id expect (enrolment_id is not null) on violation drop row
) as select * from stream read_files(:data || '/short_courses/enrolments.csv', format => 'csv', header => true);
