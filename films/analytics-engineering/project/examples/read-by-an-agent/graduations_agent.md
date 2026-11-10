# The graduations team's agent

The Genie Agent the data team set up for the graduations office, written down here so that a change
to it is reviewed like a change to the code. A Genie Agent is set up from datasets registered in
Unity Catalog, instructions in the organisation's own words, example SQL queries, and benchmarks:
test questions, each with its answer in SQL. It reads each table's and each column's description in
Unity Catalog, as dbt writes them on every run. Databricks only; nothing here runs on DuckDB or in CI.

**Owner:** the graduations office (Malia Fonoti), which asks it questions; set up by the data team
(Jun Park). **The meaning in what it reads:** Mei Tanaka, registrar's office, who answers for the
graduation list (`meta.owner` in `models/marts/graduations/_graduations__models.yml`).

## Data

| Dataset | What it is |
|---|---|
| `<production catalog>.<marts schema>.mart_graduations__graduation_list` | The graduation list: one row per certificate, with the name to be printed, and how and when the graduate confirmed it |
| `<production catalog>.<marts schema>.mart_graduations__names_to_confirm` | The follow-up: the graduates of a round whose names haven't gone to the printer yet who haven't confirmed their name, in the portal or on paper |

## Instructions

Each line takes its words from where the meaning is kept:

1. A graduate has confirmed their name for a ceremony when `name_confirmed_how` is portal or paper.
   An empty `name_confirmed_on` doesn't mean not confirmed: a name confirmed on the paper form has
   no date. (Mei's description of the two columns.)
2. Count graduates, not certificates: a graduate with two awards at one ceremony confirms once.
   (The follow-up's grain.)
3. Show what you counted, and with which columns, in every answer about confirmations. (The data
   team's own line, agreed with the graduations office after the 412.)

## Trusted answer

```sql
-- Which graduates haven't confirmed their name for a round's ceremonies?
select ceremony_id, count(*) as graduates
from <production catalog>.<marts schema>.mart_graduations__names_to_confirm
where ceremony_id like :ceremony_prefix || '%'
group by ceremony_id
order by ceremony_id
```

## Benchmarks

The team runs them after every change to the agent, or to the descriptions it reads.

| Benchmark | Question | SQL answer | Answer on 22 October 2026 |
|---|---|---|---|
| December's names not confirmed | Which December graduates haven't confirmed their name? | `select count(*) from <production catalog>.<marts schema>.mart_graduations__names_to_confirm where ceremony_id like 'DEC26%'` | 38 |
| December's names confirmed on paper | How many December graduates confirmed their name on the paper form? | `select count(distinct student_bk) from <production catalog>.<marts schema>.mart_graduations__graduation_list where ceremony_id like 'DEC26%' and name_confirmed_how = 'paper'` | 374 |

The answers are the film's numbers; the example data holds a slice of December's graduates.
