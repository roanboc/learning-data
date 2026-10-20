# Alumni system

The source and the columns only it holds. Each is described once, here, and shown with `doc()`.

{% docs source_alumni_system %}
The alumni system: the alumni office's list of the university's graduates, kept in Advancement.
Key set `ALU`. Every version of every row is kept; see the version columns in
`models/_shared/_shared__columns.md`. A graduate is added from the student system's list of
graduates, with the student ID they graduated under and the award's name on that day.
{% enddocs %}
