# HR system

The source and the columns only it holds. Each is described once, here, and shown with `doc()`.

{% docs source_hr_system %}
The HR system: HR's system of record for staff and their contracts of employment. Key set `HR`.
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
