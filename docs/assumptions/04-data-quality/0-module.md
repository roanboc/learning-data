# Data quality: the module's own questions and assumptions

> Kept by the module's setup thread, "Build the data quality module", from 5 November 2026, and brought up to date on 10 November, after all eight films merged. Files named without a path, such as `numbers.md`, `openings.md` or `palettes.md`, are that thread's working notes, outside this repository.

Rodrigo asked, at 11:53 on 5 November, away for the night: "Work on the films with assumptions and merge them all. Give me a final checklist with the questions you had for each topic and the assumption and I will later review the entire report and will fix when I see the assumption was incorrect." So every question below was answered with the best-reasoned option instead of waiting, and is listed here for him to review.

## The films

All eight are on main with the Draft label, merged in order on 10 November. Each film's own questions are in its file:

| Film | Pull request | Its questions and assumptions |
|---|---|---|
| 1. *Good enough for what?* | [#203](https://github.com/roanboc/learning-data/pull/203) | [33 rows](2-fit-for-use/1-good-enough-for-what.md) |
| 2. *A hundred records* | [#213](https://github.com/roanboc/learning-data/pull/213) | [34 rows](2-fit-for-use/2-a-hundred-records.md) |
| 3. *Valid isn't true* | [#211](https://github.com/roanboc/learning-data/pull/211) | [34 rows](2-fit-for-use/3-valid-isnt-true.md) |
| 4. *Late is wrong too* | [#226](https://github.com/roanboc/learning-data/pull/226) | [35 rows](2-fit-for-use/4-late-is-wrong-too.md) |
| 5. *The hidden factory* | [#231](https://github.com/roanboc/learning-data/pull/231) | [41 rows](3-quality-as-a-habit/1-the-hidden-factory.md) |
| 6. *Report, fix, tell* | [#209](https://github.com/roanboc/learning-data/pull/209) | [40 rows](3-quality-as-a-habit/2-report-fix-tell.md) |
| 7. *Read by an agent* | [#196](https://github.com/roanboc/learning-data/pull/196) | [43 rows](3-quality-as-a-habit/3-read-by-an-agent.md) |
| 8. *Small, every week* | [#218](https://github.com/roanboc/learning-data/pull/218) | [36 rows](3-quality-as-a-habit/4-small-every-week.md) |

The rows below number the films 1 to 8 across the module: films 1 to 4 are *Fit for use*, films 5 to 8 *Quality as a habit*.

## Where to start

If he reads only a few rows, these shape the most: R3 (his own practice in data quality, which wasn't asked), W1 (the graduation list as the one story), L1 (the quality bench look), O1 (the eight opening stories) and M4 (where the module sits on the site).

## The module

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| M1 | What does the module cover, against the other new modules? | The craft of data quality, on one list, end to end: what good means for each use, how to measure it, accuracy against a reference, timeliness, where errors are born, the loop with the people who report them, quality for agents, and improving in small steps. Business cases, strategy, budgets and keeping a team engaged belong to *Data management*; leadership, ownership and soft skills to *Leading data people*; owners, decisions and the scorecard stay in the governance films, named by title, not taught again | `films/fit-for-use/proposal.md`, *The brief* and *Decided* |
| M2 | How many films, and in how many series? | Eight films in two series of four: *Fit for use* (what good means, and how to measure it) and *Quality as a habit* (keeping it good, and making it better). Four per series keeps each series' page short and gives the module a turn in the middle: from measuring to improving | Both series' `series.json` and `proposal.md` |
| M3 | What are the series called, in English and Spanish? | *Fit for use* (*Apto para su uso*), after Juran's definition of quality; *Quality as a habit* (*La calidad como hábito*). Folders `films/fit-for-use/` and `films/quality-as-a-habit/`, on the site at `fit-for-use/` and `quality-as-a-habit/` | The site's pages, once a film is out |
| M4 | Where does the module sit on the site? | In the topic that already holds *When things go wrong*, renamed from *Data quality and change* to *Data quality* (*Calidad de datos*), with the same id, so links don't change: *When things go wrong* first (its films on contracts and levels of warning come before), then *Fit for use*, then *Quality as a habit*. The topic stays where it is in the site's order, after *In the weeds of data crafting* | `site-tools/build_series.py`, `TOPICS` |
| M5 | Should the topic move after *Data governance*, since the films build on its owners and scorecard? | No: moving a topic changes the site's path for every visitor, which he didn't ask for. The films name the governance films they build on, in a line, so a viewer who hasn't seen them knows where to go | Each film's narration and page |
| M6 | How is "draft" shown? | Each series' `series.json` has `"draft": true`; the badge itself comes from one shared change to `build_series.py`, made once for every module in its own work, not built again here. Films never remove it | Both `series.json` |
| M7 | When is a film released? | When it merges into main with its draft label, as he said at 12:02: "Merge everything with a draft label, that's the release per film as it's get built". `release.yml` isn't run | Every film's pull request |
| M8 | Labs and real-life situations? | Not now: each film has its Pause and think questions; the module's labs and situations come later, as one set, as *Modern data basics* does | `proposal.md`, *Rules from the plan* |

## The reference and the practice

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| R1 | Which framework is the reference? | DAMA-DMBOK's data quality chapter as the map (dimensions, critical data, profiling, rules, root causes, issue management, service levels); Danette McGilvray's *Executing Data Quality Projects: Ten Steps* (2nd edition, 2021) and Thomas Redman's practice as the spine (the Friday afternoon measurement, the hidden data factory, data's customers and creators, the rule of ten); the quality movement underneath: Juran's fitness for use, Deming's plan-do-check-act, Ishikawa's fishbone, the five whys. ISO 8000 and ISO/IEC 25012 for the words, named in a line | `proposal.md`, *The reference, and its alternatives* |
| R2 | Which others were considered? | MIT's Total Data Quality Management (Richard Wang), which the dimensions come from; Larry English's TIQM; Six Sigma's DMAIC; ISO 9001; data observability's five signals (freshness, volume, schema, distribution, lineage), named without any vendor. Each is named where a film uses its idea; none is a syllabus | Same table |
| R3 | What's his own practice in data quality: what works, what goes wrong, what he'd tell a newcomer? | Not asked tonight. Taken from what he has said for other modules: "If you are struggling with those, you probably need to improve either your governance or your tooling" (5 November), people's engagement first (27 October), checks with owners and levels set in advance (the governance films), and fixing where problems start. The rest of the advice is practitioners' (Redman, McGilvray) and is marked so in the insights table, for him to confirm or correct | `proposal.md`, *The insights* and *Practical advice* |
| R4 | Which dimensions does the module name? | DAMA's six as questions (complete? unique? valid? consistent? accurate? on time?), with ISO/IEC 25012's fifteen named in a line. Timeliness gets a film of its own because the governance scorecard left it out | Films 1 and 4 |

## The world and the people

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| W1 | Which data story? | The graduation list: who graduates, at which ceremony, with which award, and the name printed on their certificate, followed for one year, December 2025 to December 2026. Chosen because he found the census and student counts repetitive (11:13), and because everyone understands a name spelled wrong on a degree certificate. 41 certificates printed again in December 2025; 3 in December 2026 | `numbers.md`; every film |
| W2 | Who are the people? | Mei Tanaka (registrar's office, owns the names and awards), Jun Park (builds the list), Sam Okafor (runs the platform) and Noor Rahman (architect), drawn as the agent films draw them; two new people: Malia Fonoti, the graduations officer who uses the list, and Andrés Peñaloza, a graduate whose name lost its accents. Every story blameless | `numbers.md`, *The people* |
| W3 | Is a real name of a person on a certificate all right to show? | Yes for the fictional graduate's name, which is the story. No identity document, date of birth or contact details on screen, and no student number next to a face | `numbers.md` |
| W4 | Where does the data live? | In the example dbt project, beside the student and alumni systems it already holds: the opening film adds the list's core; later films add their own parts | `films/analytics-engineering/project/` |

## The look

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| L1 | Which look? | A look of its own, *the quality bench*: the data team's workroom, a wall of warm limestone lit from the right and a long bench of dark speckled granite, the flat stone inspectors measure on, under a lamp in graphite enamel (not brass, which means the requirement); records as cream index cards, checks as gauges and tolerance bands, results as tags in the verdict's colour, tied on with string (green passes, amber holds for a person, red stops, grey not checked); brass for what good means for a use, steel blue for a measure; the Great Hall for the ceremonies. People and the camera exactly as the agent films' kit draws them, so every check of 4 and 5 November holds. The other options were the agent films' marble and oak as it is, the governance films' watercolour, and *Modern data basics*' navy map. Chosen because a module needs one design language of its own, and this one is built on what quality work is: measuring against a reference | `films/fit-for-use/shared/` (the kit) and every film |
| L2 | Who builds the look? | The setup thread, as a kit of its own merged before any film's pictures, so eight threads can build at the same time without drawing it eight ways | The kit's pull request |
| L3 | How do Malia and Andrés look? | Malia Fonoti: long dark hair, glasses, small earrings, a plum blazer over a cream top. Andrés Peñaloza: short side-parted dark hair, a navy sweater. Both drawn to the agent films' rules and looked at full size, facing both ways, on 5 November; their clothes wear none of the six colours that mean something | `films/fit-for-use/shared/src/people.js` (`DQ_CAST`), and every film that shows them |
| L4 | What does Andrés wear at the ceremony? | A plain black gown, a white shirt and a dark tie, its hood lined in amethyst for the Master of Data Analytics (an invented colour: amethyst means nothing else in these films), and no cap on his head, as the numbers set | `people.js` (`andresGown`); films 1, 6 and 8 |
| L5 | What are the places? | Three, each painted once: the bench (the limestone wall and the granite bench, people standing behind it), the bench seen from above (records, tags and gauges lying on it), and the Great Hall at the height of the stage (leaded windows, oak panelling, a plum backcloth, an oak lectern). The lamp is a prop a film hangs where no card goes over it, not part of the wall | `films/fit-for-use/shared/src/look.js` |

## The openings and the sound

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| O1 | Which opening stories? | Eight, on one theme, *quality was managed long before data*, none used before on the site: Mercator's chart (1569); Gosset, "Student", at a Dublin brewery (1908); Ino Tadataka's survey of Japan (1800 to 1821); Bangladesh's cyclone warnings (1970 to 2007); the Dead Letter Office and the ZIP code (1890s to 1963); smallpox search and containment in India (1974 to 1975); the "Cupertino effect" (about 2000); Borlaug's shuttle breeding in Mexico (1945 to 1956). Each thread checks its story against its own sources and may change it with a reason | `openings.md`; each script's *Opening story* table |
| O2 | Which instruments? | A lead for each film that the site doesn't have, checked against every score on main: cloud-chamber bowls, a Savart wheel, a singing arc, ice bells, tuned anvils, a string telephone, an early computer's pulse tones, a hydraulophone. Each thread chooses its partner | `palettes.md`; each film's `tools/score.py` |

## The tools

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| T1 | Which tools does the module show? | dbt's data tests (with their dimension and owner), source freshness and stored failures; each use's quality rule written in words in the list's model file (`meta.quality`, with each column's `critical_for`), since the list, a mart, has no open-standard contract (F1); Databricks' data profiling, data quality monitoring, Unity Catalog's lineage, comments and governed tags, SQL alerts, and Genie. Each film checks each name and what it does in the docs on the day, and never says a release status | Each brief's *Tools*; each film's sources |
| T2 | A rule about what people do (a report answered in two working days)? | Tracked in its own model, owned and reviewed, never failed as a dbt test, as he set on 20 October | Film 6 |

## After Rodrigo's findings of 10 November

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| F1 | Does the graduation list have an enterprise data contract, in the open standard, when in Rodrigo's practice only canonical models have one, written by the governance team's information architect and built by the data team? | No. PR #236 (merged 10 November) applies the rule: only the core tables keep an open-standard contract, written first by the information architect. The list is a mart, so its contract was deleted and it keeps its dbt contract. Each use and its level are rules in words in the list's model file (`meta.quality`, with each column's `critical_for`), the data team's, and its support channel is in its product descriptor (the Open Data Product Standard). #236's thread asked you on a card at 04:01 that day and took the recommended option; before #236, this row had kept the list's contract as one of the few. PR #277 (merged 10 November) changed films 1, 3 and 4 to match. Film 1 now says "Jun wrote it all down beside the data, in the file that describes the list" and shows that file. Film 3 says "And the test it runs names its method: reconciliation, award by award". Film 4 says "it goes beside the list's columns, in dbt". Films 5 to 7 dropped their mart contracts before merging, film 6 points to the Open Data Product Standard for its support channel, and film 8's ledger card reads "The uses and their levels, written beside the list" | Films 1, 3 and 4 (PR #277), film 6 (script and page), film 8 (the year's ledger card), the example project's `products.py` (PR #236) |
| F2 | Do the films show owners or stewards reviewing pull requests? | No. Checked in every film's narration on 10 November: Jun and the data team review code (film 7: "Jun reviews each one, and Mei sets the levels"); owners decide what good means, written in the glossary and beside the list, and are told of impact. Each open film's thread was asked the same day to check its pictures and page too (film 6: none, its weekly review is Mei's team reading the reports' own model; film 8: nobody reviews or approves a pull request). Since the review-order fix (PR #216) reached main, the example project's CODEOWNERS names the data team as reviewers and its impact check tells owners what a change touches; film 6 took it in, and its script says so | Films 1 to 8; `CODEOWNERS` |
| F3 | How long may a film's page text be? | As PR #206 sets for every film: a kicker of at most 32 characters, a title of at most 75 and an intro of at most 300, in English and Spanish, with no opening story in the intro. On 10 November two films were over and trimmed before merging: film 5 (intro 314 to 280, Spanish intro 345 to 297, Spanish kicker 33 to 28) and film 6 (Spanish intro 302 to 298). All eight are within the limits | Each film's `site.json` |
| F4 | Labs and evaluations, one per film or per series? | Per series, as he asked: none per film. The module's labs and real-life situations come later, one pack for each series (M8) | Both series |
