# Claims app

The source and the columns only it holds. Each is described once, here, and shown with `doc()`.

{% docs source_claims_app %}
The casual claims app: the small app the university built on Lakebase, Databricks' Postgres, live
since Monday 23 February 2026, the first day of Semester 1's casual contracts. Key set `CLM`; owner
HR. Casual staff claim the hours they worked, by unit, duty and day, and the unit's coordinator
approves each claim or returns it for a correction. Claims approved by noon on the Monday before a
pay day are paid that Thursday.

The app writes each claim once, as a row in its own Postgres table. Payroll and Finance read that
same row through Unity Catalog, where the app's database is registered as the catalog `claims_app`:
no nightly copy and no change capture between them (DEC-CLM-01). Each table has one writer: the app
writes the claims; the contracts it checks each claim against are the HR system's, which the
platform serves to the app.

On DuckDB, `data/claims_app/claims.csv` holds a few claims as they stood at noon on Monday 2
November 2026, when the pay run of Thursday 5 November took its claims.
{% enddocs %}

{% docs claim_duty %}
What the hours were for: tutorial, marking or consultation, which are teaching, or training, which
isn't.
{% enddocs %}

{% docs claim_hours %}
The hours worked, in decimal hours as the claims app's contract with the platform says: 1.50 for an
hour and a half. The app keeps them as text; staging reads them as a number.
{% enddocs %}

{% docs claim_amount %}
What the claim pays, in Australian dollars: the hours times the duty's casual rate, before on-costs.
It's a person's pay: show it only in totals, by unit, faculty or pay day, never for one person.
{% enddocs %}

{% docs claim_status %}
Where the claim stands: submitted (waiting for the unit coordinator), approved, or returned (sent
back to its claimant for a correction).
{% enddocs %}
