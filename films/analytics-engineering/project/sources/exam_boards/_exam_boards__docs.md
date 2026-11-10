# Exam boards

The source and the columns only it holds. Each is described once, here, and shown with `doc()`.

{% docs source_exam_boards %}
The exam boards' register: each faculty's exam board approves, at its meeting, who completed each
award and on which day, and the board's secretary records each approval here, from the meeting's
own decision. It's kept apart from the student system, and nothing in it is copied from there, so it
can show what the student system lost or got wrong, where a copy of the student system would agree
with it. The registrar's office types each conferral date into the student system from the board's
list (LIM-SIS-03). Key set `EB`. Its approvals come to the platform on their own, every night. Every
version of every row is kept; see the version columns in `models/_shared/_shared__columns.md`.
{% enddocs %}
