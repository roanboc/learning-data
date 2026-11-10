-- The graduation list's two confirmation columns agree: a day in name_confirmed_on exactly when
-- name_confirmed_how is portal. Both come from the same answers, so a difference is a fault in the
-- code that joins them. Fails with one row per certificate where they don't, for Jun Park.
{{ config(group='graduations', severity='warn') }}

select
    graduation_bk,
    name_confirmed_on,
    name_confirmed_how
from {{ ref('mart_graduations__graduation_list') }}
where (name_confirmed_on is not null) <> coalesce(name_confirmed_how = 'portal', false)
