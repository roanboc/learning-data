# Learning platform

The source and the columns only it holds. Each is described once, here, and shown with `doc()`.

{% docs source_learning_platform %}
The learning platform (LMS): accounts, and the badges and microcredentials it issues. Key set
`LMS`. Every version of every row is kept; see the version columns in `models/_shared/_shared__columns.md`.
Account statuses: active, inactive. It holds a student ID only when staff type one in, and it
can't flag a revoked badge: it deletes it.
{% enddocs %}
