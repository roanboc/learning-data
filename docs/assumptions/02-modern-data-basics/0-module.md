# Modern data basics: the module's own questions and assumptions

> Copied from the film thread's notes on 10 November 2026. Paths such as `../briefs.md` point to the thread's working folder, not to this repository.

Rodrigo, 5 November 2026, 11:53 UTC: "Work on the films with assumptions and merge them all. Give me a final checklist with the questions you had for each topic and the assumption and I will later review the entire report and will fix when I see the assumption was incorrect."

So every question we would have asked him is listed here with the assumption made instead. What his approved plan already says (the name, the tagline, the four series and nine films, the reference, the tools each film shows, the changes to other modules) is not listed: it isn't an assumption.

- **The module's own** are below, kept by the setup thread ("Set up Modern data basics module").
- **Each film's own** are in its folder here, `<n>-<slug>/assumptions.md`, kept by the film's thread, one line each: the question, the assumption, and where it shows in the film. The final checklist gathers them all.

## The module

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 1 | Which look should the films have? | The intro's platform map, drawn up close: the dark navy map of *The Inner Life of Data*, with people drawn to the agent films' rules and lit for the dark. Chosen because the module goes deeper into the intro's map, and should look apart from the agents' lab. | Every film's pictures; the module's kit in `films/data-that-moves/shared/`; `films/data-that-moves/decided.md` (PR #147) | The kit is changed or replaced, and each film is drawn again from it |
| 2 | What story runs through the module? | A casual tutor's contract and pay, and what teaching costs: Linh Nguyen's contract T-26188, from the HR system to payroll and Finance. HR and Finance, as you asked; census and student counts left out. | Every film's data story; `numbers.md` | Each film's story changes; the openings and tools stay |
| 3 | Who are the new people? | Two new people: Ingrid Holm in HR (owns the HR system's data and what each field means) and Rohan Desai in Finance (asks what teaching costs), with Noor Rahman, Sam Okafor and Jun Park as the earlier films draw them. | Most films; looks and say rules in `numbers.md` | Names, roles or looks change in the kit and the films |
| 4 | Which opening story for each film? | A standard or practice someone worked out long ago, one per film, each checked against its sources by the film's thread: the break of gauge at Albury; the seed vault on Svalbard; the Bank of Amsterdam; Pacioli's double entry; Apollo 11's 1202 alarm; the speaking clock; the kilogram; the Vienna road signs; ships' logbooks made into wind charts. | `openings.md`; each film's first minute | That film's opening is replaced (each has a fallback in `openings.md`) |
| 5 | Should the logbooks film name Matthew Maury, who later fought for the Confederacy? | The film's thread decides with care and centres the logbooks and the Brussels log; it may leave him unnamed. | The documents film's opening | One line of narration changes |
| 6 | Which instruments for the music? | A lead per film the site doesn't have yet (telegraph reeds, pyrophone, log drum, ophicleide, terpsitone, repeater gongs, organette, horn violin, optophone tones), each thread choosing its partner. | Each film's score; `palettes.md` | That film's score is made again |
| 7 | Should the films show the tools' official logos? | Yes, where a film names a tool, as you asked for films 2.7 to 2.9 on 5 November: Databricks, dbt and GitHub, and Microsoft Fabric's and Power BI's where they're named, unaltered and credited in `NOTICE.md`. | Tool cards in every film | Logos come off; the product's name stays |
| 8 | Real screenshots of Databricks, or drawn pages? | Drawn pages, at the level of architecture, never a click-by-click tour. Real screenshots are the open question you raised for agentic series 3. | Every tool on screen | Tool pages are replaced with dated screenshots, if you choose that route |
| 9 | Which documents does the documents film read? | Two kinds, from your practice and the plan: documents the university's applications write themselves, in a standard structure with their metadata (the claims app's JSON, HR's signed contracts with version and date), so nobody reads them back; and, once, supplier invoices read into a table with `ai_parse_document` and `ai_extract`, to show the functions and point to the docs. | The documents film | The invoices give way to another example |
| 10 | Where do documents as agents' context go, now that agentic series 3 is paused? | Named in a line in the documents film, pointing to *Context engineering* and *Context and memory, governed*; not taught here. | The documents film | A later series takes it up |
| 11 | Spanish names of the four series? | *Datos que se mueven*, *Datos como software*, *De las tablas a las decisiones*, *Documentos como datos*. | The site's pages and captions | Renamed in `build_series.py` and the series' files |
| 12 | How does a series of one film read on the site? | "A single film" (*Una sola película*), never "Film 1 of 1". | *Documents as data*'s page and card | One line in `build_series.py` |
| 13 | How much do the films repeat earlier films (*Both at once* on one platform for both kinds of work, *Meaning on the platform* on metric views, *Silent change* on contracts)? | They name each earlier film in a line and build on it, never teach it again; *One copy, one platform* tells why integration services consolidate, not how the engines work. | Films 1, 3, 4, 7 and 8 of the module | The films say more where you want the module to stand alone |

## Each film's questions

In each film's folder here:

1. *Moving is easy, agreeing is the work*: `1-moving-is-easy/assumptions.md`
2. *Hot, warm, cold*: `2-hot-warm-cold/assumptions.md`
3. *One copy, one platform*: `3-one-copy-one-platform/assumptions.md`
4. *Scripts became software*: `4-scripts-became-software/assumptions.md`
5. *A platform that watches itself*: `5-a-platform-that-watches-itself/assumptions.md`
6. *Reports on demand*: `6-reports-on-demand/assumptions.md`
7. *Define it once*: `7-define-it-once/assumptions.md`
8. *More readers than people*: `8-more-readers-than-people/assumptions.md`
9. *Files as data and as context*: `9-files-as-data-and-context/assumptions.md`
