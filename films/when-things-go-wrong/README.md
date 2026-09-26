# When things go wrong

*A series of short films, in development. In Spanish: Cuando algo sale mal.*

**Tagline:** Fail safely. Fix once.

*The Inner Life of Data* showed how data should flow through a university's platform. This series shows what happens when it doesn't. Each episode takes one way things go wrong, follows it from the person it reaches to its cause, and shows how a good platform notices, contains the damage, fixes the cause and learns. Same two audiences: a newcomer understands it, and a data engineer agrees with it.

## Episodes

| # | Episode | What goes wrong | What it teaches | Status |
|---|---|---|---|---|
| 1 | [Silent change](1-silent-change/treatment.md) | A new enrolment status that the business and the student system team each saw only half of | A change needs visibility on both the technical and the business side; data contracts, checked constantly | Treatment agreed; [story outline](1-silent-change/story.md) for review |
| 2 | [Too good to be true](2-too-good-to-be-true/treatment.md) | Applications jump 38% overnight because a sync copied a week of them twice in the source system | Expectations on numbers, warning and error levels, and why stale and labelled beats fresh and wrong; re-ingesting from a fixed source | Treatment agreed |

**Candidates for later episodes**, each with one mechanism:

| Working title | What goes wrong | What it would teach |
|---|---|---|
| Late | A nightly file doesn't arrive, and a report goes out on yesterday's data | Freshness checks, service levels, and saying how old data is |
| Overwritten | A table is replaced by mistake on a Friday afternoon | Delta versions, time travel and `RESTORE`, and who can write where |
| Broken promise | A data product changes shape, and a dashboard downstream breaks | Model contracts and versions on the side that publishes data, and exposures that say who depends on it |
| Wrong eyes | A column with personal data becomes visible to people who shouldn't see it | Access control, masking and audit in Unity Catalog |

## What every episode shares

- **The same world.** The fictional university and the platform of light from the first film, with its components: vaults, tiles, the dbt line, the sketch, the paintings.
- **The same square of people.** Four characters: technical and business, on the side that produces the data and the side that uses it. A change is only safe when all four corners can see it. Sam Okafor, the data engineer, is the guide in every episode; the other corners change with the part of the university where things go wrong. See [the character sheet](characters/README.md).
- **The same way in.** A person meets the problem first, then the camera goes through Sam's screen into the platform and follows the lineage to the cause.
- **The same objects.** The data contract card at the platform's door, the quarantine tray, status lights, and the version panes behind each vault. An object introduced in one episode means the same in every other.
- **The same craft.** Narration only, with characters who act but don't speak; room to think at about 115 words a minute; "Pause and think" questions; labs and scenarios on Learning Data; English and Spanish from the same code. See [PLAYBOOK.md](../../PLAYBOOK.md).
- **The same tone.** Calm, specific and blameless: in every episode, each person did something reasonable, and the platform's job is to fail safely.

Each episode ends with a few seconds that hint at the next one. Episodes stand on their own, and make most sense after *The Inner Life of Data*.
