-- One policy for each class that's hidden, on the whole registrar catalog, found by each column's governed
-- tag personal_data, one that closes a table with no level, and, on the core shelf, one that shows the
-- study only the Faculty of Health's learners. Databricks only.
--
-- A policy covers everyone it names in TO except the groups in EXCEPT: owning a table isn't enough, nor
-- is an admin account. Who is on each list is the data owner's decision (Mei Tanaka's; the data team
-- reviews this file). registrar_owners, whose only member is registrar-loader, is let through every one, or each
-- table it builds would hold stars. Each reader gets one mask for each column: two different masks for
-- one person stop the query with an error, so the help desk is let through hide_direct and given
-- direct_in_part. An agent is never on a list: it reads with its own role's rights.
--
-- Run by the registrar's job after functions.sql, as registrar-loader. Each statement replaces its policy
-- whole, so what this file says is what runs. Production's names, as the film shows them.

create or replace policy hide_special
on catalog registrar
comment 'special: masked whole, but for the exam support team'
column mask registrar.policies.mask_whole
to `account users`
except registrar_owners, registrar_exam_support
for tables
match columns has_tag_value('personal_data', 'special') as v
on column v;

create or replace policy hide_direct
on catalog registrar
comment 'direct: masked whole, but for the registrar''s office and the help desk, which gets direct_in_part'
column mask registrar.policies.mask_whole
to `account users`
except registrar_owners, registrar_office, help_desk
for tables
match columns has_tag_value('personal_data', 'direct') as v
on column v;

create or replace policy direct_in_part
on catalog registrar
comment 'direct, for the help desk: masked in part'
column mask registrar.policies.mask_in_part
to help_desk
for tables
match columns has_tag_value('personal_data', 'direct') as v
on column v;

create or replace policy hide_pseudonymous
on catalog registrar
comment 'pseudonymous: masked whole, but for the office, the study (agreement 2026-14) and Planning'
column mask registrar.policies.mask_whole
to `account users`
except registrar_owners, registrar_office, health_progress_study, planning_learner_readers
for tables
match columns has_tag_value('personal_data', 'pseudonymous') as v
on column v;

create or replace policy generalise_indirect
on catalog registrar
comment 'indirect: a date becomes the first of January of its year, but for the registrar''s office'
column mask registrar.policies.generalise
to `account users`
except registrar_owners, registrar_office
for tables
match columns has_tag_value('personal_data', 'indirect') as v
on column v;

-- A table that comes without its level shows no rows to anyone but its builder, until its owner gives it
-- one. The level is a table's own tag: never set it on the catalog or a shelf, or every table inherits it.
create or replace policy close_until_levelled
on catalog registrar
comment 'A table with no level is closed to all but its builder'
row filter registrar.policies.no_rows
to `account users`
except registrar_owners
for tables
when not has_tag('level');

-- The study sees only the Faculty of Health's learners, in each table on core with a column tagged
-- faculty. A table with learners and no faculty column isn't filtered at all, so check.sql fails the job
-- if one appears. A table with no level is close_until_levelled's: one row filter for each reader.
create or replace policy health_rows_only
on schema registrar.core
comment 'The study (agreement 2026-14) sees only rows whose faculty is HLT'
row filter registrar.policies.in_faculty
to health_progress_study
for tables
when has_tag('level')
match columns has_tag('faculty') as fac
using columns (fac, 'HLT');
