# Columns shared by every domain

Columns that mean the same in every domain, because they follow the conventions every domain
shares: keys qualified by their key set, and the version columns. Each is described once, here,
and shown everywhere with `doc()`. A column that belongs to one domain is described in that
domain's folder; a column in one model only is described in that model's YAML.

## Keys

{% docs qualified_key %}
A system key qualified by its key set: `SIS|S-20417`, `LMS|u-88213`, `SC|aisha.k@mail.example`. Two
keys that look alike in different systems stay apart.
{% enddocs %}

{% docs key_set %}
Where a key comes from: `SIS` (student system), `LMS` (learning platform) or `SC` (short-course
platform). Each key set is an attribute of the source that issues it (`meta.key_set` in `sources/<system>/`), and they're listed in the `key_sets` seed.
{% enddocs %}

## Time

{% docs valid_from %}
The first day this version was true, inclusive. Where the source says when a change took effect,
that date; otherwise the day the platform recorded it.
{% enddocs %}

{% docs valid_to %}
The first day this version was no longer true, exclusive. Null for the last version.
{% enddocs %}

{% docs is_current %}
True for the version valid on the day of the build (or the `as_is_date` var): as it is now. A
change dated in the future isn't current until its day.
{% enddocs %}

{% docs recorded_at %}
When the platform recorded the latest change behind this version. It can be later than
`valid_from`: a withdrawal entered a week after it happened is valid from the day it happened.
{% enddocs %}

{% docs loaded_at %}
When ingestion last wrote the row (the source's `_loaded_at`).
{% enddocs %}

## Source versions

Ingestion is out of scope for this project: each table
arrives with every version of every row kept, and its system key identified. Four columns,
named the same in every table, record the versions:

| Column | What it records |
|---|---|
| `_valid_from` | When ingestion recorded this version |
| `_valid_to` | When ingestion recorded the next version, or saw the row disappear. Empty for the current version |
| `_is_current` | `true` for the version that holds now |
| `_loaded_at` | When ingestion last wrote this row: when it was recorded, or when it was closed |

These dates record when the platform saw a change, not when it was true. Where a system says when
something was true (the student system's `effective_date` and `result_date`), the model uses that.

{% docs recorded_from %}
When ingestion recorded this version of the source row (the source's `_valid_from`).
{% enddocs %}

{% docs recorded_to %}
When ingestion recorded the next version, or saw the row disappear (the source's `_valid_to`).
Null for the current version.
{% enddocs %}

{% docs is_current_version %}
True for the source row's current version (the source's `_is_current`).
{% enddocs %}
