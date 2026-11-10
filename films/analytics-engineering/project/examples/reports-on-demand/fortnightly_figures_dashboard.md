# *The fortnightly figures*, an AI/BI dashboard

The three questions asked every pay day, by the same people, on one AI/BI dashboard, as Sam Okafor
sets it up and the data team reviews it, written down here so that a change to it is reviewed like a
change to the code. It refreshes after each pay run and goes to the people who act on it. It replaced
the fortnightly pay report, a 40-page PDF emailed every pay day, whose three figures were on its
first page; that report is retired. Databricks only; nothing here runs on DuckDB or in CI.

**Owner:** the data team (Sam Okafor). **Its figures:** payroll's, in HR (Ingrid Holm), and
Finance's. Totals only, never one person's pay.

## Why these three, and nothing else

A question deserves a dashboard when it comes back on a schedule, and someone acts on what it shows.
Every other question is asked when it's needed, of Genie One. These three come back every pay day,
every second Thursday, and each has someone who acts on it:

| Tile | The question | Who acts on it | On 5 November 2026 |
|---|---|---|---|
| The pay run | What did the pay run cost? | Finance, which pays it, and payroll, which runs it | A$9.6 million, paid to 2,960 people |
| Casual hours | How many casual hours, in each faculty? | Each faculty's manager, who plans the next teaching period | Arts 1,950, Business 3,120, Engineering 2,380, Health 2,640: 10,090 hours in all |
| Claims waiting | How many claims still wait for approval? | Payroll, who remind the coordinators before the next pay run closes | 143, for the pay run of 19 November |

Casual teaching cost isn't a tile: what casual teaching has cost a faculty this semester is asked
when it's needed, as Rohan asks it, and the dashboard's Ask Genie button opens the agent that
answers it. The numbers are the films'; the example data counts far fewer.

## Its datasets

| Tile | Reads |
|---|---|
| The pay run | Payroll's total for each pay run, for all staff paid: people paid and pay, as the payroll system reports it. The example project doesn't hold it |
| Casual hours | Payroll's export, `mart_finance__casual_pay_paid` (Finance's marts): `hours_paid` summed by faculty for the pay day |
| Claims waiting | The claims app's claims, read where they live: those still waiting for a coordinator's approval, for the next pay run |

## Refresh, subscribers and Ask Genie

- **Schedule:** on each pay day, once the pay run's figures are in, the dashboard refreshes, and its
  subscribers get a PDF snapshot by email.
- **Subscribers:** payroll, Finance and the four faculties' managers, the people who act on it.
- **Ask Genie:** on the published dashboard, linked to the existing Genie Agent *Casual teaching
  cost* (`casual_teaching_cost_genie_agent.md`), not one made from the dashboard's own datasets, so
  a question the dashboard doesn't show gets the same answer as in Genie One.
