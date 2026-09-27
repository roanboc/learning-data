# A Sharper Sketch

A five-minute film, the third from Learning Data, about data modelling. Two trusted numbers disagree about how many students were enrolled in Data Science 101 on census date. To find out why, the film goes back to the first film's sketch, calls it what it was, an oversimplification, and sharpens it one question at a time, checking each change against a public reference model, TCSI. It is written for anyone aged 14 and up, with nothing a data modeller would need to correct, and it is about modelling only: what the model says, not how the pipelines build it.

- **Watch, with labs and scenarios:** [https://roanboc.github.io/learning-data/sketch/](https://roanboc.github.io/learning-data/sketch/)
- **Script, with rigour notes and sources:** [script.md](script.md)
- **Treatment:** [treatment.md](treatment.md)
- **Captions:** [en.vtt](captions/en.vtt), [en.srt](captions/en.srt)

## Chapters

| Time | Chapter |
|---|---|
| 0:00 | The sketch we drew |
| 0:24 | Two numbers |
| 1:29 | What is a class? |
| 2:13 | Whose census date? |
| 2:41 | One student, two courses |
| 3:16 | Enrolled when? |
| 3:44 | Three levels of precision |
| 4:24 | Check, adopt, extend, record |
| 4:59 | Pull back |

## What it teaches

- **Add precision when a question can't be answered in only one way.** Each chapter is one disagreement, and one change to the sketch: the class splits into unit, unit offering and class; the census date moves to the offering; a course admission joins student and course; enrolments keep their history.
- **Ask how this kind of business generally works, and check a reference model before you draw.** Many industries have published models that make a good first template, and there is often more than one, so choose deliberately and record why. Check it, don't copy it: adopt it where it fits the business, extend it where it doesn't, and record every difference in a fit register.
- **Models evolve: not often, but always.** The sketch carries a version stamp, from v1 to v2, and a new question hints at v3.
- **Conceptual, logical, physical:** the same meaning at three levels of detail.

How the physical tables are built, including dimensional and entity-centric modelling, is left for a later film for engineers (see the treatment).

## Customising it

The chapters don't depend on TCSI. To make an internal version with your own reference model, change the reference boxes (`REFE` and `REFR` in `source/src/sketch3.js`), the labels in `source/src/scenes.js`, the narration in `source/src/narration.js`, and the fit register in the *fit* scene. Keep the four questions and the check, adopt, extend and record steps.

## How it was made

Like the first film, it is generated entirely from code, and it draws with the first film's components and engine, so the two look like one world. The source and the rebuild steps are in [source/](source/). There is no Spanish version yet.

## On the site

The film has its own three pages under `site/sketch/`: *Watch* (the film, with chapters), *Sharpen it* (`labs/`, six training labs: grain, where details live, course admissions, status history, choosing a reference model, and a fit check) and *Make the call* (`scenarios/`, twelve evaluation scenarios in three formats). They draw with the film's own components from `site/assets/film3/film.js`, and their code and words are in `site/assets/sketch/sketch.js`. Progress stays in the browser. After changing the film, copy `source/dist/film.js` and `source/dist/soundtrack.mp3` to `site/assets/film3/`.
