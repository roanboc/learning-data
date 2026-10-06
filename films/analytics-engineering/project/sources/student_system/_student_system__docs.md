# Student system

The source and the columns only it holds. Each is described once, here, and shown with `doc()`.

{% docs source_student_system %}
The student system (SIS): the registrar's office's system of record for students, the awards the
university offers, and unit results. Key set `SIS`. Every version of every row is kept; see
the version columns in `models/_shared/_shared__columns.md`. Status codes: ENR, LOA, WD, CMP.
{% enddocs %}

{% docs effective_date %}
The date a version of a student record takes effect, as the registrar's office entered it. It
can be earlier than the date ingestion recorded it, when a change is entered late.
{% enddocs %}

{% docs result_date %}
The date a unit result was released, or last amended.
{% enddocs %}
