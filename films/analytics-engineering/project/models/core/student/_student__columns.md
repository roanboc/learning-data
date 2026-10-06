# Student domain: columns

Columns the student domain owns: learners, the credentials they hold, and the credit they hold
towards an award. Each is described once, here, and shown with `doc()` wherever it appears, in
this domain or in the marts built on it.

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

## Learners

{% docs learner_status %}
The learner's status, in the canonical set: `studying`, `inactive`, `withdrawn` or `completed`.
Each system's own codes (ENR, active, 1, ...) are mapped in `seeds/reference/student/status_map.csv`, owned by the
registrar's office. The student system's status wins over the platforms'.
{% enddocs %}

{% docs learner_key_set %}
The key set of the learner's business key: `SIS` for every learner with a student ID.
{% enddocs %}

{% docs keys_held %}
How many keys, across the three systems, belong to the learner.
{% enddocs %}

{% docs has_student_id %}
True when the student system knows the learner.
{% enddocs %}

{% docs decided_by %}
Who decided, when a person did: a named person and their office.
{% enddocs %}

{% docs decided_on %}
The date they decided.
{% enddocs %}

## Credentials

{% docs credential_kind %}
The kind of credential: `award` (conferred by the registrar), `microcredential` (carries credit
points) or `badge` (carries none).
{% enddocs %}

{% docs credential_status %}
`valid`, `expired` or `revoked`. The learning platform can't flag a revoked badge; it deletes it,
so a badge that disappears is treated as revoked from that day (see GAP-LMS-01 in `docs/registers.md`). No credential
in these sources expires yet.
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

{% docs revoked_on %}
The day the credential stopped counting: for a badge, the day the learning platform stopped
showing it; for a short-course certificate, the day its enrolment stopped being completed; for
an award, the day a later record of it stopped being completed. Null if it wasn't revoked.
{% enddocs %}

## Credit towards an award

{% docs credit_points_earned %}
Credit points from units and microcredentials that count towards the award, under the rule in
the credit towards an award definition.
{% enddocs %}

{% docs credit_points_from_units %}
Credit points from units passed under the award.
{% enddocs %}

{% docs credit_points_from_microcredentials %}
Credit points from the microcredentials the award recognises, up to the limit.
{% enddocs %}

{% docs credit_points_remaining %}
Credit points still needed for the award: required minus earned, and never below zero.
{% enddocs %}
