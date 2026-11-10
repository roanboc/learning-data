# HR system

The source and the columns only it holds. Each is described once, here, and shown with `doc()`.

{% docs source_hr_system %}
The HR system: HR's system of record for staff, their contracts of employment and their wishes about being contacted. Key set `HR`.
Every version of every row is kept; see the version columns in `models/_shared/_shared__columns.md`.
It sends each change as it's made, and its whole file again at the start of each teaching period.
A casual academic gets a contract for each teaching period they teach, for one unit.
{% enddocs %}

{% docs pay_type %}
The pay type payroll pays a contract under: CAS (casual), FT (fixed-term) or CON (continuing).
{% enddocs %}

{% docs position_type %}
HR's kind of position: Casual Academic, paid by the hour for one teaching period, or Academic.
{% enddocs %}

{% docs wish_purpose %}
What a staff member may be contacted for, in HR's words, like News of tutoring work: HR's news of
casual tutoring work for the next teaching period. A wish is asked, and kept, for one purpose at a time.
{% enddocs %}

{% docs wish_answer %}
The staff member's answer for that purpose: yes or no. A no, given in any way, is kept on their
record in HR's system, where every list for that purpose is made from, so a list rebuilt later
can't add them back.
{% enddocs %}
