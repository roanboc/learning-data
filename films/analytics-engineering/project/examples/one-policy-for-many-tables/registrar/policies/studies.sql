-- The study's own shelf, studies.health_progress, where its copy of the learners and the tables it makes
-- from it live. Every column with a class is masked whole, but for the study's group and the registrar's
-- builder. The copy's columns bring their classes with them (Tags that travel), so a table the study makes
-- is covered the day it's made. Databricks only.
--
-- Run by the registrar's job after policies.sql, as registrar-loader. Production's names.

create or replace policy hide_outside_the_study
on schema studies.health_progress
comment 'Every class masked whole, but for the study (agreement 2026-14, until 30 June 2027)'
column mask registrar.policies.mask_whole
to `account users`
except registrar_owners, health_progress_study
for tables
match columns has_tag('personal_data') as v
on column v;
