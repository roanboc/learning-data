-- Loads the sample sources into Databricks: three schemas, seven tables, one per CSV file in data/.
--
-- 1. Upload data/ to a Unity Catalog volume, from the project folder, with the Databricks CLI:
--      databricks fs cp -r data dbfs:/Volumes/<catalog>/<schema>/<volume>/data
-- 2. Run this file in the SQL editor, with two parameters:
--      catalog  the catalog the sources go in, like main
--      data     the folder you uploaded, like /Volumes/main/landing/files/data
-- 3. Point the project at them: DBT_SOURCES_CATALOG=<catalog> (README, "Run it on Databricks").
--
-- The files keep every version (SCD2), so the tables do too. Types are inferred; staging casts
-- every column anyway, as it does for DuckDB's text columns.

use catalog identifier(:catalog);

create schema if not exists student_system;
create schema if not exists learning_platform;
create schema if not exists short_courses;

create or replace table student_system.learners as
select * from read_files(:data || '/student_system/learners.csv', format => 'csv', header => true);

create or replace table student_system.awards as
select * from read_files(:data || '/student_system/awards.csv', format => 'csv', header => true);

create or replace table student_system.results as
select * from read_files(:data || '/student_system/results.csv', format => 'csv', header => true);

create or replace table learning_platform.users as
select * from read_files(:data || '/learning_platform/users.csv', format => 'csv', header => true);

create or replace table learning_platform.badges as
select * from read_files(:data || '/learning_platform/badges.csv', format => 'csv', header => true);

create or replace table short_courses.learners as
select * from read_files(:data || '/short_courses/learners.csv', format => 'csv', header => true);

create or replace table short_courses.enrolments as
select * from read_files(:data || '/short_courses/enrolments.csv', format => 'csv', header => true);
