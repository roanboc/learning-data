# The same one, everywhere

*A series on master and reference data. The title is a working one.*

Linh Nguyen graduated from the university in 2022 and came back to study health informatics, under a new student number that nothing linked to her old one. She tutors a first-year unit, and this year she joined a research project. Four systems hold five records of her, and none of them knows the others are her. Over nine films the university learns to keep the person apart from her roles, decide once who is who and which value wins, date the roles, own the lists that sort people, use each role's data only for its purpose, share one person across its systems, and keep it right, with the same pattern shown in other industries each time. The plan is in the [proposal](proposal.md).

**Status:** the films in the table below are built and [on the site](https://roanboc.github.io/learning-data/master-and-reference-data/); the others are being made. Labs and scenarios will come later. On the site, the series sits under the topic *Master and reference data*.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [One person, many roles](https://roanboc.github.io/learning-data/master-and-reference-data/one-person-many-roles/) | Master data, and the person behind the role | 6 min | 12 | 4 questions | [script](1-one-person-many-roles/script.md) · [source](1-one-person-many-roles/source/README.md) |
| [Roles come and go](https://roanboc.github.io/learning-data/master-and-reference-data/roles-come-and-go/) | Roles and relationships, with dates | 5½ min | 10 | 4 questions | [script](4-roles-come-and-go/script.md) · [source](4-roles-come-and-go/source/README.md) |
<!-- /films -->

## The look and the sound

- **Watercolour.** Daylight landscapes in soft washes on warm paper, drawn in pencil, chosen from seven looks ([reference frames](look/)). The past is the same watercolour, with the year in the corner.
- **Colour means something.** Each role has its own colour, the same in every film: student teal, applicant amber, researcher coral, tutor violet, alumna green. The person, as the master record, is the white of the paper in a pencil line, banded in her roles' colours. Each industry has its own colour too. Text is dark ink on paper-light cards, and every colour comes with a label.
- **People.** Linh, the person the data is about, has no side colour, so she can wear her roles'. Noor, the data architect, and Jun, the analytics engineer, are edged in cyan (the technical side); Mei, whose office looks after the person, in gold (the business side).
- **Made to read on a phone.** Text is at least 28 px in the 1920-pixel frame, the camera moves in on what the narration is about, and `tools/legible.py` checks every frame.
- **A sound for each film.** Each film has its own palette, which its script's *Built* section describes, and keeps the series' mark, a clarinet rising 1-8-5-1. Nothing loops, every effect is something on screen, and the music sits about 21 dB under the voice, with a pulse only where the story turns to an error.

## How the films are made

Like the other series, each film is generated from code. The series keeps what's its own in [`shared/`](shared/):

| File | What it holds |
|---|---|
| `shared/src/wash.js` | The watercolour look: the paper and the pigment's grain, washes and the pencil line (`wc_wash`, `wc_pencil`), skies, land, trees and buildings for the places, the colours of the roles, the industries and the sides (`WC_ROLE`, `WC_IND`, `WC_SIDE`), cards, tags, chips, envelopes, ticks and crosses, the person as white paper banded in her roles (`wc_whiteFig`), and the title and end cards (`wc_title`, `wc_end`) |
| `shared/src/people.js` | The series' people in pencil and wash: Linh, Noor, Mei and Minh, drawn from the cast of *When things go wrong* |
| `shared/src/post.js` | What a film paints before it starts (the paper, then each place, once), and the video's motion blur |
| `shared/src/page.html` | The standalone player page |
| `shared/tools/lang.py`, `build.py` | Where everything lives, and what a film is made of |
| `shared/tools/run.py` | Runs a tool on a film: this series' own `lang.py` and `build.py`, and *From words to data*'s other tools and instruments unchanged |
| `shared/tools/review_page.py` | The page the author reviews a film on: it runs `site-tools/review_page.py`, then lays the page out on watercolour paper, with the new chapters marked (`--new 2,3`) and the copy under a new name for each version (`--name`) |
