# Model the business

*The series that opens the topic Data modelling, in two films: a new one, then* A Sharper Sketch, *which keeps its own folder, [`../a-sharper-sketch/`](../a-sharper-sketch/), its page at `sketch/`, its player and its progress.*

The intro ends on a promise: *what it means, and who decides, is the rest of the story*. Noor, the data architect, is about to make the intro's sketch (a student, a class, an enrolment, a term and a course) the university's shared model. *The map behind the sketch* places each box on the university's map first: what the university does (its capabilities, adopted from HERM), what it needs to know (data domains, each with one owner), where each thing is first written (systems of record) and what each word means (the business glossary). Three boxes find their place; two don't, because the registrar's office speaks of unit offerings, not classes, and the term's census date is Planning's. *A Sharper Sketch* then makes the boxes right, against a reference model. One true story runs through both: the Ming court's two registers, from 1381, the warp and the weft. The plan is in the [proposal](proposal.md).

**Status:** a draft, made on 19 November 2026 as the author asked, with the Draft label until the author reviews it. On the site, the series sits under the topic *Data modelling*, at `model-the-business/`, before *From words to data*, and takes *A Sharper Sketch*'s place on the learning route's *start with data*.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [The map behind the sketch](https://data.learn-all.org/model-the-business/the-map-behind-the-sketch/) | The map before the model | 6½ min | 10 | 4 questions | [script](1-the-map-behind-the-sketch/script.md) · [source](1-the-map-behind-the-sketch/source/README.md) |
| [A Sharper Sketch](https://data.learn-all.org/sketch/) | Reference models | 7½ min | 10 | none | [script](../a-sharper-sketch/script.md) · [source](../a-sharper-sketch/source/README.md) |

For the whole series, on the site: [6 labs](https://data.learn-all.org/model-the-business/labs/) and [12 scenarios](https://data.learn-all.org/model-the-business/scenarios/), in English and Spanish, from the words in [site/assets/model-the-business/](../../site/assets/model-the-business/).
<!-- /films -->

## How the films are made

*The map behind the sketch* is generated from code like the site's other films, with the engine, components, fonts and voice of *The Inner Life of Data*, *A Sharper Sketch*'s diagrams and *From words to data*'s tools, and checked with the governance films' checks (`twice.py`, `quiet.py` with `held.py`). The series' own pictures, the story's registers, fields and people, are in [`shared/src/registers.js`](shared/src/registers.js), and its tools in [`shared/tools/`](shared/tools/): its own `build.py` and `quiet.py`, and *From words to data*'s other tools, used as they are. The university's map comes from the example project, [`learning-data-project`](https://github.com/roanboc/learning-data-project): its capabilities, data domains and systems of record in `10-enterprise-architecture/`, and its glossary in `20-data-governance/`. *A Sharper Sketch* is made as it always was, from its own folder.

The series' playgrounds and its evaluation are on its own pages, from the words in [`site/assets/model-the-business/`](../../site/assets/model-the-business/): up to four playgrounds for each film, the most interactive and meaningful, and one evaluation of at most twelve questions for the series, as the author set on 18 and 19 November 2026. *The map behind the sketch* has *Place the sketch*; *A Sharper Sketch* has *Sharpen the sketch*, *Choose a reference model*, *Where does it live?* and *Enrolled when?*.
