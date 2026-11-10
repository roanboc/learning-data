# Short-course platform

The source and the columns only it holds. Each is described once, here, and shown with `doc()`.

{% docs source_short_courses %}
The short-course platform (SC), bought from a vendor: customers (learners), keyed by email, and
their enrolments and certificates. Key set `SC`. Every version of every row is kept; see
the version columns in `models/_shared/_shared__columns.md`. Customer status: 1 (active), 0 (inactive).
{% enddocs %}

{% docs certificate_type %}
`completion` or `attendance`. A certificate of attendance isn't a credential.
{% enddocs %}
