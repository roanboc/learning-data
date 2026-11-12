# Good enough for what?: questions and assumptions

*Data quality* · *Fit for use*, film 1 · merged, PR #203 · [pull request](https://github.com/roanboc/learning-data/pull/203); Rodrigo confirmed DAMA's six dimensions on 12 November 2026 (no change to the film)

[Watch it on the site](https://data.learn-all.org/fit-for-use/good-enough-for-what/)

> Copied from the film thread's notes on 10 November 2026. Paths such as `../briefs.md` point to the thread's working folder, not to this repository.

Film 1 of *Fit for use*, `films/fit-for-use/1-good-enough-for-what`, and the graduation list's core in the example project (PR #163, merged 5 November 2026, c9b512e8). Kept by the film's thread from 5 November 2026, as Rodrigo asked at 11:53 that day: every question below would have gone to him, and was answered instead with the best-reasoned option, for him to review in the module's final report.

## The example project (PR #163)

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| 1 | What is one row of the list: a graduate per ceremony, or a certificate? | A certificate: a graduate, an award and a ceremony, so a double degree is two rows (agreed with films 2, 3, 6 and 7). Graduates are counted as graduates, not rows | `mart_graduations__graduation_list`; numbers.md, *Shared names* |
| 2 | What is the model called? | `mart_graduations__graduation_list`, in `models/marts/graduations/`, after the project's naming (`mart_<domain>__<name>`), not `graduation_list.sql` as the plan suggested | The example project |
| 3 | Are names stored with their accents? | As the platform received them: the student system's nightly file lost every accent until September 2026, so December 2025's rows have none; a name a graduate corrected in the portal keeps its accents | `data/student_system/graduations.csv`; LIM-SIS-02 |
| 4 | Where do the four uses live? | As dbt exposures: the seating plan, the certificates and the programme owned by Malia Fonoti's graduations office, and the government's count of awards (`awards_return`) owned by Planning, who sends it | `exposures/graduations/`, `exposures/planning/` |
| 5 | What level does each use need, and who agreed it? | Seating: each ceremony's count within 2% (Malia). Certificates: zero wrong (Malia). Programme: no difference from the certificates; a change after it's printed goes on a slip (Malia). The government's count: each award once, exact (Planning). Each owned by Mei Tanaka | The model's `meta.quality`; its contract |
| 6 | How is critical data recorded? | `meta.critical_for` on each column, naming the uses that can't do without it; the contract marks those columns `criticalDataElement`; on Databricks the build tags them `critical_data`, a key-only governed tag | The model's YAML; `macros/governance/critical_data.sql`; `docs/databricks-governance.md`, section 11 |
| 7 | Does a rebuilt table keep its tags? The docs don't say | The macro doesn't depend on it: it reads which columns carry the tag (`information_schema.column_tags`), tags the critical ones that don't, and untags the rest. The domain tags' macro (`domain_tag.sql`) sets its tag every build and may fail if a table keeps it; not changed here, since it isn't this film's | `macros/governance/critical_data.sql` |
| 8 | Malia's email? | `malia.fonoti@uni.example`, as the project's other owners are written | `governance/2-owners/owners.yml` |
| 9 | Where do the portal's answers come from? | A source of their own, `portal.name_confirmations`, with its own key set (`SP`, owner Mei Tanaka), one row per answer, kept per graduate per ceremony | `sources/portal/`; `key_sets.csv` |
| 10 | Does a correction count as soon as the graduate types it? | No: once the registrar's office has checked it against the document seen at enrolment (`checked_on`, empty until then), as film 6 asked so its 14 October fix holds; a confirmation counts at once | The list's model; numbers.md |
| 11 | What is the conferral date? | The date the faculty's exam board approved the award, the date printed on the certificate, typed in from the board's list. The student system's own records still have none (GAP-SIS-03), so the core keeps dating awards by DEC-SIS-03 | LIM-SIS-03 |
| 12 | `dbt_project.yml` sets each folder's test owner on lines other films cite. How does the list's checks get their owner? | In each check's own `config: meta: owner`, so no cited line moves | The list's YAML |
| 13 | Is Andrés in the project's learners? | No: his record (S-16874, "Andres Penaloza") is only on the list's slice, so the core's counts (46 learners) don't change; agreed with film 6 | `data/student_system/graduations.csv` |
| 14 | The project or the film first? | The project's core in its own pull request, merged first, so films 2 to 8 could build on it while film 1 was made | PR #163 |
| 15 | Other films quote the project's counts (160 checks on the scorecard, 10 contracts, 6 products). Update them? | No: each is that film's dated snapshot. They are now 178, 11 and 7 | PR #163's description |
| 16 | The project README's tree gains a line. Is any cited line moved? | The two films that cite the README by line number already cite lines that had moved on main (232 to 234 is now 239; 104 to 106 is now 123); the new line moves the tree's rest by one. Noted for those films' next change | PR #163's description |

## The film (10 November 2026)

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| 17 | Which opening story? | Mercator's chart of 1569, as `openings.md` proposed, checked against Wikipedia's *Mercator 1569 world map*, *Mercator projection*, *Africa* and *Greenland*: made "for the use of sailors"; a straight line on the plane charts wasn't a bearing a ship could hold; Mercator stretched the chart so it is; Wright worked out the stretch in 1599; the price is that sizes swell towards the poles | `script.md`, *Opening story*; chapter 1 |
| 18 | Draw a person of 1569? | No. The chart, its two ports, a ruler and a small ship stand for the pilot, so no period figure is invented | Chapter 1 |
| 19 | Which crossing does the chart show? | Lisbon to St John's, the film's own example, not from a source. Its numbers are in the script's *Rigour*: the plane chart's line (78.5° west of north) held reaches St John's longitude 2.3° (about 137 nautical miles) south; the right bearing is 74.4°. What missing the coast cost ("days more at sea, short of water") is said in general, with no named voyage | `script.md`, *Rigour* |
| 20 | "Greenland looks as big as Africa, which is about 14 times larger"? | Yes: Africa about 30.4 million km², Greenland about 2.17 million km² (14.0 times) | Chapter 1 |
| 21 | How is Andrés introduced? | By his name, Andrés Peñaloza, then as the student system holds it, "Andres Penaloza", without its accents. His record (S-16874) comes in on a cut, so his number is never beside his face | Chapter 2 |
| 22 | Whose row is the list's sample? | Hamid Karimi (S-19530, DEC25-3, Master of Data Analytics), from the example project | Chapter 2 |
| 23 | "It passed every check on it" and "about four weeks before the first ceremony"? | Yes, from `numbers.md`: sent at 5 pm on Thursday 13 November 2025, the first ceremony four weeks later; every check on the list passed that day | Chapter 2 |
| 24 | Give Juran's year? | No: he is named in a line ("quality is fitness for use"), without a year, since the phrase is older than any one book of his | Chapter 3 |
| 25 | How many dimensions? | DAMA's six, asked as six questions; ISO/IEC 25012's fifteen named in one line ("six are enough to start"). **Answered by Rodrigo on 12 November 2026: yes, fine (the last section).** | Chapter 4 |
| 26 | Which partner instrument? | A second set of glass bowls, larger and lower, struck once and left to ring under each use's card as its level is agreed. Written into the module's `palettes.md` | `source/tools/score.py` |
| 27 | Where does the chart sit? | On an oak worktable, the film's one place of its own, drawn in ink, its name in a cartouche in the sea. The kicker shows on the wall and the granite, not in the Great Hall or on the oak, where the picture fills the frame | `source/src/chart.js` |
| 28 | Which poster? | The chart with its two verdicts, Steering and Comparing sizes, at 80.8 s | `site/assets/good-enough-for-what-poster.jpg` |
| 29 | Which Spanish words? | Latin American Spanish: el Aula Magna for the Great Hall, la carta and los navegantes, el rumbo for a bearing, aptitud para el uso for fitness for use; the module's words for the rest | `source/src/i18n/es/captions.js` |
| 30 | Where does Pause and think stop? | After *Forty-one certificates*, *One list, four uses* and *What each use needs*: one question each, the right answers in three places, a near miss each | `site/assets/good-enough-for-what/think.en.js` |
| 31 | Link ISO/IEC 25012 on the page? | No: its sites refused an automated check on 10 November, so it couldn't be checked on the day. It stays in the script's sources. The page links ODCS, dbt, DAMA and Databricks (Microsoft Learn), all checked that day | `site.json`, `elsewhere` |
| 32 | How is the soundtrack stored? | Outside Git in the end: the film commits its `audio.json` pointer (release `audio-good-enough-for-what-dbee9e70866ebde95989`), and, as the coordinator set for every thread on 10 November, the MP3 is tracked beside it (`git add -f`, its own last commit), so CI and the site's deploy use that copy until the release exists. Not run here: the audio workflow. For Rodrigo: publish that prerelease (the workflow on main, or by hand from the tar and README in this folder's `audio-release/`), then `media.py untrack` takes the MP3 out of Git. It stays in main's history (6 MB) | `audio.json`; `audio-release/README.md` |
| 33 | How is it a draft? | By the series' `"draft": true` and the pull request's Draft label; `site.json` sets no draft of its own, so a `"draft": false` there takes the label off once he has reviewed it | `films/fit-for-use/series.json` |

## Rodrigo's answer of 12 November 2026: DAMA's six dimensions

Row 25 was the one put to Rodrigo for this film: *Assumed: DAMA's six dimensions, with ISO/IEC 25012's fifteen named in one line. Is DAMA's six the right starting set?* His answer, on 12 November 2026:

> Yes, fine.

The question is closed, and the film isn't changed: row 25 stands as made, and so does the module's row R4. Recorded in the thread "Apply review answers to Data quality" (PR #NNN).
