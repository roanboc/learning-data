# Files as data and as context: questions and assumptions

*Modern data basics* · *Documents as data*, film 1 · open, PR #181 · [pull request](https://github.com/roanboc/learning-data/pull/181)

On the site once PR #181 merges: https://data.learn-all.org/documents-as-data/files-as-data-and-context/

> Copied from the film thread's notes on 10 November 2026. Paths such as `../briefs.md` point to the thread's working folder, not to this repository.

Kept by the film's thread ("Make data basics film 9 Files as data and context"), as Rodrigo asked on 5 November 2026, 11:53 UTC: "Work on the films with assumptions and merge them all. Give me a final checklist with the questions you had for each topic and the assumption and I will later review the entire report and will fix when I see the assumption was incorrect." The module's own questions are in `../assumptions.md`; this file holds the film's. One line each: the question, the assumption made instead, and where it shows. The film's decisions are in `films/documents-as-data/1-files-as-data-and-context/decided.md`, its sources in its `script.md`.

## The opening (chapter 1, *Logbooks into charts*)

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 1 | Should the opening name Matthew Fontaine Maury, the naval officer behind the wind charts, who later served the Confederacy and argued for slavery's spread to the Amazon? | No. The narration tells the story through the logbooks, the Navy's office in Washington that read them, the captains who kept the new log, and the ten nations at Brussels. His name, and why it's left out, are in the script's sources. | Chapter 1 | One or two lines of narration name him |
| 2 | May the screen name the office, though the voice says only "a small office of the United States Navy"? | Yes: "The Navy's Depot of Charts and Instruments" is on screen under "Washington, 1842", from the Navy's own histories (NHHC, the Naval Meteorology and Oceanography Command) and the Library of Congress. | Chapter 1, the first shot | One card's words |
| 3 | Which number shows the benefit? | The office's own count, said as its own: the average passage to California, round Cape Horn, from 183 days to 135, from *The Physical Geography of the Sea* (1855). Other counts found (144.5 against 187.5 days; 38 days to Rio) are secondary and left out. | Chapter 1, Benefits | One line and one card |
| 4 | How exact are the routes and winds on the chart? | A picture of the idea, not a ship's track: the habit's road far to the east and through the calms, the charts' more direct one, the winds by belt and the currents as lanes of light. The land is Natural Earth's 1:110m, in the public domain, credited in NOTICE.md. | Chapter 1, the chart | The chart is redrawn |
| 5 | How are the people of the time drawn? | A captain, not named, and Adolphe Quetelet, as figures of the time, not portraits, in the agent films' people: dark coats, white shirts and a black stock, as the 1850s wore them, each holding the 1853 log. | Chapter 1 | Two people redrawn |
| 6 | Is "nations began to share their weather data, as they still do today" fair? | Yes: the 1853 conference led to the International Meteorological Organization (1873) and WMO, whose members still exchange weather data (WMO's data exchange policy). | Chapter 1 | One line |
| 7 | How are the logs "read again" at the close? | ICOADS holds the US Maury Collection, about 1.3 million reports from 1784 to 1863, so the voice says "over a million weather reports", read by climate scientists over a century later; it never calls the logs the oldest. | Chapter 5 | One line |

## The invoices (chapter 2, *Invoices, read into data*)

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 8 | What are the invoices' numbers? | Invented, believable for a university: 3,860 supplier invoices in October; 3,734 pass every check, 126 go to a person (72 a field not read, 31 an unknown supplier, 14 lines that don't add up, 9 sent twice); in September one invoice sent twice was paid twice. The four suppliers (Larkspur Catering, Northfield Lab Supply, Tidewater Print, Corella Cleaning) are invented, each invoice's GST 10% of its lines. | Chapter 2, `check_invoices.sql` | Cards and a line or two |
| 9 | Which checks are data tests and which are Finance's rules? | Jun Park's data project tests the data (every field read, the lines add up to the total); Finance's own rules follow (the same supplier and number sent before, a supplier Finance knows), as the project's rule that dbt tests check data and business rules sort for a person. Each invoice that stops keeps its first reason, in that order. | Chapter 2, Pause and think | Chapter 2's checks and one question |
| 10 | Does anything get paid without a person? | No: Rohan Desai's team still approves every payment; the function reads, the checks sort, people decide. | Chapter 2 | One line |
| 11 | Where do the files live, and what are they called? | A Unity Catalog volume, `/Volumes/finance/supplier_invoices/incoming/`; each row keeps its `file_path`. `ai_parse_document` reads each file once and its output is kept, `ai_extract` takes out the fields. The SQL is written from Databricks' docs, for Databricks only, and hasn't been run on a workspace. | Chapter 2, `read_invoices.sql` | The example's SQL |

## The contracts (chapter 3, *Contracts, kept as signed*)

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 12 | What changed between Linh's offer and her contract? | The offer, sent on 9 July, ended on 13 November; the contract she signed on 14 July adds a week for marking and ends on 20 November, as the example project's `contracts.csv` has it (`ends_on` 2026-11-20). | Chapter 3 | A line and two cards |
| 13 | What metadata does the HR system write beside a contract's file? | The contract's ID, its version, its kind (offer or signed), the day it was signed and where its file is (`/Volumes/hr/contracts/files/T-26188_v1.pdf` and `_v2.pdf`); a Unity Catalog function finds a contract's signed file, for a person or an agent to open and cite. | Chapter 3, `contract_documents.csv`, `signed_contract_file.sql` | Cards and the example |
| 14 | How much does the film say about who may read a contract, and about documents as an agent's context? | One line each: who may read a contract is Ingrid Holm's to decide, in HR, and *Data protection and privacy* teaches the rest; *Context engineering* and *Context and memory, governed* show how a document becomes an agent's context. | Chapter 3 | Two lines |

## Written as data (chapter 4)

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 15 | How did claims for hours come in before the claims app? | As spreadsheets by email, each tutor's its own way, typed into payroll by hand, until February 2026. | Chapter 4 | One line |
| 16 | What does the claim on screen show? | The example project's own claim, CL-103807, from the claims app's table (*One copy, one platform*'s): who claimed (E-4417), on which contract (T-26188), whether it's approved and when. Never its amount, a person's pay. It depends on that film's columns (`status`, `approved_at`); if they change, this card does. | Chapter 4 | One card and one line |
| 17 | Who keeps the claims app's data contract, and in what form? | The app's team, with the app's own code, as a YAML file in the Open Data Contract Standard (v3.1.0), valid against the standard's schema in `governance/7-standards/`; HR, as Ingrid Holm, answers for what each field means. The fields are the app's own table's, `hours` kept as text, as the app keeps it. | Chapter 4, `claims_contract.yaml` | The YAML and one line |
| 18 | Who reads the claims? | Payroll, Finance and the reports, each from the same row. | Chapter 4 | One card |

## The close, the page and the release

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 19 | Whose three answers are they? | Noor Rahman's, the data architect: write what's yours as data, in a standard structure such as JSON or YAML; keep what's official as it is, its metadata beside it; read what's written for people, with the platform's functions or a scraper, only where a use case needs it, and keep the file. Your own words from the brief, made one rule. | Chapter 5, Pause and think | A line or two |
| 20 | How does the module end? | On what each series did (moving data, running the platform, serving it to people and agents, reading documents), that each once took a whole team, and that what's left for people is agreeing what the data means; then the four steps, "Investigate, adapt, implement, iterate", and the Databricks and dbt logos. | Chapter 5 | The close's last lines |
| 21 | What sound does the film have? | Its own: an optophone's tones (the reading machine of 1913 that turned letters into chords) and tuned paper tubes, the tubes charts are rolled in; F sharp minor for the problem, A major for the answer; no shanty or ship's bell. | The whole film | The score |
| 22 | What do the Spanish captions and pages call things? | Latin American Spanish: Finanzas, RR. HH., facturas de proveedores, el proyecto de datos, la arquitecta de datos, metadatos, volumen, bitácora, cartas de vientos y corrientes, solicitudes de pago de horas, la app de solicitudes, "ingresar a mano"; the platform's names as on screen, and numbers with the picture's comma (3,860). | Captions, page | Captions and the page's Spanish |
| 23 | What does the page's next panel ask, with no film after it? | "You've seen documents read, kept and written as data, and that closes Modern data basics. Which answer does each of your own documents need?", with links to the official docs (ai_parse_document, ai_extract, volumes, intelligent document processing, ODCS). | The film's page | The page's text |
| 24 | How is it released, and when? | Merged as part of the draft series (`series.json` has `"draft": true`; the film's own `site.json` sets none), so its pages carry the draft label; the merge is its release; not rendered here, no review page. It merged once its checks passed on 10 November, before *From tables to decisions*'s three films rather than after them as first planned: you asked that day for every ready film to be merged, and a series' first film doesn't wait for the series before it. Its close names that series' work, which reaches the site with those films. | The site | A label on the page, or the close's one line on serving data |
