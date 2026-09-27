# When things go wrong

*A series of short films. In Spanish: Cuando algo sale mal.*

**Tagline:** Fail safely. Fix once.

*The Inner Life of Data* showed how data should flow through a university's platform. This series shows what happens when it doesn't. Each film takes one way things go wrong, follows it from the person it reaches to its cause, and shows how a good platform notices, contains the damage, fixes the cause and learns. Same two audiences: a newcomer understands it, and a data engineer agrees with it.

**On the site:** [When things go wrong](https://roanboc.github.io/learning-data/when-things-go-wrong/), in Spanish [Cuando algo sale mal](https://roanboc.github.io/learning-data/es/when-things-go-wrong/). The films can be watched in any order, and make most sense after *The Inner Life of Data*.

## The films

| Film | Topic | What goes wrong | What it teaches | Status |
|---|---|---|---|---|
| [Silent change](1-silent-change/treatment.md) | Changes and data contracts | A new enrolment status that the business and the student system team each saw only half of | A change needs visibility on both the technical and the business side; data contracts, checked constantly | Published at [/when-things-go-wrong/silent-change/](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/) |
| [Too good to be true](2-too-good-to-be-true/treatment.md) | Data quality checks | Applications jump 38% overnight because a sync copied a week of them twice in the source system | Expectations on numbers, warning and error levels, and why stale and labelled beats fresh and wrong; re-ingesting from a fixed source | Published at [/when-things-go-wrong/too-good-to-be-true/](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/), with three labs and ten scenarios |

Each film has a folder here. The number in a folder's name only keeps the folders in order. The release workflow and the site's links to GitHub use these names, so don't rename a folder, and never show the number to visitors.

**Candidates for later films**, each with one mechanism:

| Working title | What goes wrong | What it would teach |
|---|---|---|
| Late | A nightly file doesn't arrive, and a report goes out on yesterday's data | Freshness checks, service levels, and saying how old data is |
| Overwritten | A table is replaced by mistake on a Friday afternoon | Delta versions, time travel and `RESTORE`, and who can write where |
| Broken promise | A data product changes shape, and a dashboard downstream breaks | Model contracts and versions on the side that publishes data, and exposures that say who depends on it |
| Wrong eyes | A column with personal data becomes visible to people who shouldn't see it | Access control, masking and audit in Unity Catalog |

## Silent change

A 5½-minute film (5:36) in English, with English captions and a synthetic voice.

At 7:58 on the morning before census date, Ana, the Head of School, opens her dashboard, in the style of a Databricks dashboard. Its KPI card shows how full Data Science 101 is, from yesterday's numbers, and an amber note says: last good data, as of 11:02 last night. Enrolment changes reach the platform all day, as events or in files, and dbt builds the numbers from them once a night. Overnight, a dbt test found a status it had never seen, waitlisted, and stopped the build, so the last good numbers stayed. Sam, the data engineer on call, follows the lineage back to bronze, where the rows arrived as they were sent, and finds two announcements that never met: the registrar's office introduced waitlists, and the student system team built them. Mei, from the registrar's office, decides that a waitlisted student isn't enrolled yet, and the conceptual model gains the new status; the film draws it as the sharper model from *A Sharper Sketch*. The fix is small, the skipped models run again, and the four people agree a data contract that the platform checks on every load and on every proposed change. Three weeks later, the contract catches the next change before it ships.

- **Watch, with chapters:** [https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/). Turn on *Pause and think* to stop after four chapters for one question each; every question links to the lab of *The Inner Life of Data* that teaches the idea.
- **In Spanish, around the English film:** [https://roanboc.github.io/learning-data/es/when-things-go-wrong/silent-change/](https://roanboc.github.io/learning-data/es/when-things-go-wrong/silent-change/). The page, the chapter names and the questions are in Spanish.
- **Story outline:** [story.md](1-silent-change/story.md). **Treatment:** [treatment.md](1-silent-change/treatment.md).
- **Captions:** [en.vtt](1-silent-change/captions/en.vtt), [en.srt](1-silent-change/captions/en.srt)
- **Source, and how to rebuild and publish it:** [source/](1-silent-change/source/README.md)

| Time | Chapter |
|---|---|
| 0:00 | [Yesterday's numbers](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=0) |
| 0:29 | [Six hours earlier](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=30) |
| 1:15 | [Sam](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=76) |
| 1:36 | [Follow the thread](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=97) |
| 2:03 | [The cause](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=124) |
| 2:24 | [Two halves of one change](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=145) |
| 3:28 | [The fix](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=209) |
| 3:43 | [Recover](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=224) |
| 4:17 | [The contract](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=258) |
| 4:52 | [Three weeks later](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=293) |
| 5:18 | [Pull back](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/#t=319) |

## Too good to be true

A 6-minute film (6:10) in English, with English captions and a synthetic voice.

On a Tuesday in admissions season, the planning committee sees applications for next year up 38% overnight, and approves 600 extra first-year places. That's one version of Tuesday. On Monday night, the admissions system's sync timed out, restarted and copied a week of applications again, each copy with a new ID. Every row check passed; only a test on the total saw the jump, with two levels agreed with Leila from the admissions office: a warning above 10% and an error above 25%. Three versions of Tuesday play side by side: with no test, the wrong number is acted on; with a warning, it's acted on anyway; with an error, the dashboard keeps Monday's number, labelled, and David moves the decision to Wednesday. Sam follows the thread to bronze and finds pairs that share applicant, course and intake; Rosa's team removes the copies at the source and makes the sync safe to run twice; the platform replaces the week and rebuilds, and time travel shows 11,340 before and 8,240 after. The last line: "Stale and labelled beats fresh and wrong."

- **Watch, with chapters:** [https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/). Turn on *Pause and think* to stop after four chapters for one question each; every question links to one of the film's own labs.
- **Take it apart:** three labs: *Set the levels*, *Which test catches it?* and *Fix it once*. **Make the call:** ten scenarios.
- **In Spanish, around the English film:** [https://roanboc.github.io/learning-data/es/when-things-go-wrong/too-good-to-be-true/](https://roanboc.github.io/learning-data/es/when-things-go-wrong/too-good-to-be-true/). The page, the chapter names, the questions, the labs and the scenarios are in Spanish.
- **Script, with the rigour sheet and sources on the cost of a wrong number:** [script.md](2-too-good-to-be-true/script.md). **Treatment:** [treatment.md](2-too-good-to-be-true/treatment.md). **Style frames:** [frames/](2-too-good-to-be-true/frames/README.md).
- **Captions:** [en.vtt](2-too-good-to-be-true/captions/en.vtt), [en.srt](2-too-good-to-be-true/captions/en.srt)
- **Source, and how to rebuild and publish it:** [source/](2-too-good-to-be-true/source/README.md)

| Time | Chapter |
|---|---|
| 0:00 | [One version of Tuesday](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/#t=0) |
| 0:34 | [The number and its limits](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/#t=35) |
| 1:28 | [Monday night](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/#t=89) |
| 2:25 | [Three Tuesdays](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/#t=146) |
| 3:41 | [Choosing the level](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/#t=222) |
| 4:25 | [Follow the thread](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/#t=266) |
| 5:02 | [Fix at the source](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/#t=303) |
| 5:48 | [Pull back](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/#t=349) |

## What every film shares

- **The same world.** The fictional university and the platform of light from *The Inner Life of Data*, with its components: vaults, tiles, the dbt line, the sketch, the paintings.
- **The same square of people.** Four characters: technical and business, on the side that produces the data and the side that uses it. A change is only safe when all four corners can see it. Sam Okafor, the data engineer, is the guide in every film; the other corners change with the part of the university where things go wrong. See [the character sheet](characters/README.md).
- **The same way in.** A person meets the problem first, then the camera goes through Sam's screen into the platform and follows the lineage to the cause.
- **The same objects.** The data contract card at the platform's door, the quarantine tray, status lights, and the version panes behind each vault. An object introduced in one film means the same in every other.
- **The same craft.** Narration only, with characters who act but don't speak; a flowing pace of about 125 to 135 words a minute, with a natural beat after every sentence and few long stops; "Pause and think" questions; labs and scenarios on Learning Data; English and Spanish from the same code. See [PLAYBOOK.md](../../PLAYBOOK.md).
- **The same tone.** Calm, specific and blameless: in every film, each person did something reasonable, and the platform's job is to fail safely.

Each film ends with a few seconds that hint at another film in the series: *Silent change* at *Too good to be true*, and *Too good to be true* at *Late*. The films stand on their own, and make most sense after *The Inner Life of Data*.
