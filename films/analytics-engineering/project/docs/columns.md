# Columns used in more than one model

Each column that appears in more than one model is described once, here, and shown everywhere
with `doc()`. A column in one model only is described in that model's YAML.

## Keys

{% docs learner_key %}
The learner's hash key: the sha-256 of `learner_bk`, as 64 hex characters. The same learner has
the same key in every model, on every engine.
{% enddocs %}

{% docs learner_bk %}
The learner's business key, readable and qualified by its key set: `SIS|S-20417` for a learner
with a student ID; `LMS|u-...` or `SC|email` for a learner the student system doesn't know.
Contains a student ID or an email: personal data.
{% enddocs %}

{% docs award_key %}
The award's hash key: the sha-256 of `award_bk`.
{% enddocs %}

{% docs award_bk %}
The award's business key, readable and qualified by its key set: `SIS|GCDA`.
{% enddocs %}

{% docs credential_key %}
The credential's hash key: the sha-256 of `credential_bk`.
{% enddocs %}

{% docs credential_bk %}
The credential's business key, readable and qualified by the key set of the system that issued
it: `LMS|B-5010`, `SC|C-88`, `SIS|S-20417|GCDA`.
{% enddocs %}

{% docs learner_award_key %}
The key of a learner and an award together: the sha-256 of `learner_bk` and `award_bk`, joined.
{% enddocs %}

{% docs qualified_key %}
A system key qualified by its key set: `SIS|S-20417`, `LMS|u-88213`, `SC|aisha.k@mail.com`. Two
keys that look alike in different systems stay apart.
{% enddocs %}

{% docs key_set %}
Where a key comes from: `SIS` (student system), `LMS` (learning platform) or `SC` (short-course
platform). The list is in `seeds/key_sets.csv`.
{% enddocs %}

## Time

{% docs valid_from %}
The first day this version was true, inclusive. Where the source says when a change took effect,
that date; otherwise the day the platform recorded it.
{% enddocs %}

{% docs valid_to %}
The first day this version was no longer true, exclusive. Null while it's still true.
{% enddocs %}

{% docs is_current %}
True for the version that holds now: `valid_to` is null.
{% enddocs %}

{% docs recorded_at %}
When the platform recorded the latest change behind this version. It can be later than
`valid_from`: a withdrawal entered a week after it happened is valid from the day it happened.
{% enddocs %}

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

{% docs loaded_at %}
When ingestion last wrote the row (the source's `_loaded_at`).
{% enddocs %}

{% docs census_date %}
Planning's census date: the date the numbers are as at. Set once, as the `census_date` var.
{% enddocs %}

## Status and credit

{% docs learner_status %}
The learner's status, in the canonical set: `studying`, `inactive`, `withdrawn` or `completed`.
Each system's own codes (ENR, active, 1, ...) are mapped in `seeds/status_map.csv`, owned by the
registrar's office. The student system's status wins over the platforms'.
{% enddocs %}

{% docs credential_kind %}
The kind of credential: `award` (conferred by the registrar), `microcredential` (carries credit
points) or `badge` (carries none).
{% enddocs %}

{% docs credential_status %}
`valid`, `expired` or `revoked`. The learning platform can't flag a revoked badge; it deletes it,
so a badge that disappears is treated as revoked from that day (see `docs/gaps.md`). No credential
in these sources expires yet.
{% enddocs %}

{% docs revoked_on %}
The day the credential stopped counting: for a badge, the day the learning platform stopped
showing it. Null if it wasn't revoked.
{% enddocs %}

{% docs credit_points_required %}
The credit points the award requires, as the student system holds it.
{% enddocs %}

{% docs credit_points_earned %}
Credit points from units and microcredentials that count towards the award, under the rule in
the credit towards an award definition.
{% enddocs %}

{% docs credit_points_remaining %}
Credit points still needed for the award: required minus earned, and never below zero.
{% enddocs %}

## Learners

{% docs learner_key_set %}
The key set of the learner's business key: `SIS` for every learner with a student ID.
{% enddocs %}

{% docs keys_held %}
How many keys, across the three systems, belong to the learner.
{% enddocs %}

{% docs has_student_id %}
True when the student system knows the learner.
{% enddocs %}

{% docs effective_date %}
The date a version of a student record takes effect, as the registrar's office entered it. It
can be earlier than the date ingestion recorded it, when a change is entered late.
{% enddocs %}

{% docs decided_by %}
Who decided, when a person did: a named person and their office.
{% enddocs %}

{% docs decided_on %}
The date they decided.
{% enddocs %}

## Awards and credentials

{% docs award_type %}
The kind of award: `graduate certificate` or `master`.
{% enddocs %}

{% docs faculty_code %}
The code of the faculty that offers the award, like `EIT`.
{% enddocs %}

{% docs faculty_name %}
The name of the faculty that offers the award.
{% enddocs %}

{% docs credential_name %}
What the credential is for, as the system that issued it names it.
{% enddocs %}

{% docs credential_credit_points %}
The credit points the credential carries: zero for a badge; for an award, the points it requires.
{% enddocs %}

{% docs issued_on %}
The date the credential was issued, or the award conferred.
{% enddocs %}

{% docs certificate_type %}
`completion` or `attendance`. A certificate of attendance isn't a credential.
{% enddocs %}

{% docs result_date %}
The date a unit result was released, or last amended.
{% enddocs %}

{% docs credit_points_from_units %}
Credit points from units passed under the award.
{% enddocs %}

{% docs credit_points_from_microcredentials %}
Credit points from the microcredentials the award recognises, up to the limit.
{% enddocs %}
