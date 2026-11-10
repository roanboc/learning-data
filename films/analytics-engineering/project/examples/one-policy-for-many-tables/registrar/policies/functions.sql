-- The registrar's ways to hide a value, each a small function, written once, on the catalog's shelf for
-- policies. The policies in policies.sql and studies.sql call them, and nobody else needs to. Databricks only.
--
-- Each is a few plain lines: no lookups, no regular expressions, nothing that can throw, the same answer
-- for the same value. A mask gives back the column's own type, or the query fails, so mask_whole and
-- generalise take and give a VARIANT: one function for every type of column.
--
-- Run first by the registrar's job (resources/policies.job.yml), as registrar-loader, which owns the
-- catalog through registrar_owners. Production's names, as the film shows them.

-- Mask it whole: words become three stars, and anything else (a date, a number) is left empty.
create or replace function registrar.policies.mask_whole(v variant)
returns variant
deterministic
comment 'Mask it whole: words become three stars, and anything else is left empty, so the column keeps its type.'
return case
    when schema_of_variant(v) = 'STRING' then '***'::variant
    else null::variant
end;

-- Mask it in part, for the help desk: a student number keeps its last two digits (S-***12), an email its
-- first letter and its domain (s***@mail.example), and anything else its first letter.
create or replace function registrar.policies.mask_in_part(v string)
returns string
deterministic
comment 'Mask it in part, for the help desk: S-20412 becomes S-***12, samuel.osei@mail.example becomes s***@mail.example, anything else keeps its first letter.'
return case
    when v is null then null
    when left(v, 2) = 'S-' and length(v) = 7 then concat('S-***', right(v, 2))
    when instr(v, '@') > 1 then concat(left(v, 1), '***', substring(v, instr(v, '@')))
    else concat(left(v, 1), '***')
end;

-- Generalise: a date of birth becomes the first of January of its year (1987-05-14 becomes 1987-01-01),
-- still a date. Anything else the registrar classes indirect is left empty until it has a way of its own.
create or replace function registrar.policies.generalise(v variant)
returns variant
deterministic
comment 'Generalise: a date becomes the first of January of its year, still a date; anything else is left empty.'
return case
    when schema_of_variant(v) = 'DATE' then trunc(cast(v as date), 'YEAR')::variant
    else null::variant
end;

-- Filter rows: a yes or a no for each row. Is this learner in the faculty the policy names (HLT, the
-- Faculty of Health)? A row with no faculty is a no.
create or replace function registrar.policies.in_faculty(faculty string, allowed string)
returns boolean
deterministic
comment 'Filter rows: true only for rows whose faculty is the one the policy names, such as HLT.'
return coalesce(faculty = allowed, false);

-- Close a table: no rows for anyone the policy covers.
create or replace function registrar.policies.no_rows()
returns boolean
deterministic
comment 'Shows no rows: used to close a table until its owner gives it a level.'
return false;
