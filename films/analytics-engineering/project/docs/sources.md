# Sources

The three systems the credential model is built from. Ingestion is out of scope: each table
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

{% docs source_student_system %}
The student system (SIS): the registrar's office's system of record for students, the awards the
university offers, and unit results. Key set `SIS`. Every version of every row is kept; see
`docs/sources.md` for the four version columns. Status codes: ENR, LOA, WD, CMP.
{% enddocs %}

{% docs source_learning_platform %}
The learning platform (LMS): accounts, and the badges and microcredentials it issues. Key set
`LMS`. Every version of every row is kept; see `docs/sources.md` for the four version columns.
Account statuses: active, inactive. It holds a student ID only when staff type one in, and it
can't flag a revoked badge: it deletes it.
{% enddocs %}

{% docs source_short_courses %}
The short-course platform (SC), bought from a vendor: customers (learners), keyed by email, and
their enrolments and certificates. Key set `SC`. Every version of every row is kept; see
`docs/sources.md` for the four version columns. Customer status: 1 (active), 0 (inactive).
{% enddocs %}
