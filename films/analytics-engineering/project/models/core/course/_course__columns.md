# Course domain: columns

Columns the course domain owns: the awards the university offers. Each is described once,
here, and shown with `doc()` wherever it appears.

{% docs award_key %}
The award's hash key: the sha-256 of `award_bk`.
{% enddocs %}

{% docs award_bk %}
The award's business key, readable and qualified by its key set: `SIS|GCDA`.
{% enddocs %}

{% docs award_code %}
The registrar's code for the award, like `GCDA`.
{% enddocs %}

{% docs award_name %}
The award's name.
{% enddocs %}

{% docs award_type %}
The kind of award: `graduate certificate` or `master`.
{% enddocs %}

{% docs faculty_code %}
The code of the faculty that offers the award, like `EIT`.
{% enddocs %}

{% docs faculty_name %}
The name of the faculty that offers the award.
{% enddocs %}

{% docs credit_points_required %}
The credit points the award requires, as the student system holds it.
{% enddocs %}
