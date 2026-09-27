# A Sharper Sketch

A 5½-minute film from Learning Data about data modelling. Two trusted numbers disagree about how many students were enrolled in Data Science 101 on census date. To find out why, the film goes back to the sketch from *The Inner Life of Data*, calls it what it was, an oversimplification, and sharpens it one question at a time, checking each change against a reference model. It notes that MortarCAPS (MCDS) is the standard many universities actually use, and checks against TCSI, one of the choices, because it is public. It is written for anyone aged 14 and up, with nothing a data modeller would need to correct, and it is about modelling only: what the model says, not how the pipelines build it.

- **Watch, with labs and scenarios:** [https://roanboc.github.io/learning-data/sketch/](https://roanboc.github.io/learning-data/sketch/)
- **In Spanish, around the English film:** [https://roanboc.github.io/learning-data/es/sketch/](https://roanboc.github.io/learning-data/es/sketch/)
- **Download the video (MP4, 1080p):** [https://github.com/roanboc/learning-data/releases/latest/download/a-sharper-sketch.mp4](https://github.com/roanboc/learning-data/releases/latest/download/a-sharper-sketch.mp4)
- **Script, with rigour notes and sources:** [script.md](script.md)
- **Treatment:** [treatment.md](treatment.md)
- **Captions:** [en.vtt](captions/en.vtt), [en.srt](captions/en.srt)

## Chapters

| Time | Chapter |
|---|---|
| 0:00 | The sketch we drew |
| 0:25 | Two numbers |
| 1:39 | What is a class? |
| 2:23 | Whose census date? |
| 2:51 | One student, two courses |
| 3:26 | Enrolled when? |
| 3:54 | Three levels of precision |
| 4:34 | Check, adopt, extend, record |
| 5:09 | Pull back |

To link to a chapter, add `#t=` and its start in seconds, rounded up, to the page's address: for example [`/sketch/#t=207`](https://roanboc.github.io/learning-data/sketch/#t=207) for *Enrolled when?* (it starts at 206.2 s). Rounding down lands on the last frame of the chapter before.

## What it teaches

- **Add precision when a question can't be answered in only one way.** Each chapter is one disagreement, and one change to the sketch: the class splits into unit, unit offering and class; the census date moves to the offering; a course admission joins student and course; enrolments keep their history.
- **Ask how this kind of business generally works, and check a reference model before you draw.** Many industries have published models that make a good first template, and there is often more than one, so choose deliberately and record why. Check it, don't copy it: adopt it where it fits the business, extend it where it doesn't, and record every difference in a fit register.
- **Models evolve: not often, but always.** The sketch carries a version stamp, from v1 to v2, and a new question hints at v3.
- **Conceptual, logical, physical:** the same meaning at three levels of detail.

How the physical tables are built, including dimensional and entity-centric modelling, is left for a later film for engineers (see the treatment).

## Customising it

The chapters don't depend on TCSI. To make an internal version with your own reference model, change the reference boxes (`REFE` and `REFR` in `source/src/sketch3.js`), the labels in `source/src/scenes.js`, the narration in `source/src/narration.js`, and the fit register in the *fit* scene. Keep the four questions and the check, adopt, extend and record steps.

## How it was made

Like *The Inner Life of Data*, it is generated entirely from code, and it draws with that film's components and engine, so the two look like one world. The source and the rebuild steps are in [source/](source/).

The film carries no number. It opens with the recap "In The Inner Life of Data, we drew a sketch of the university: a student, a class, an enrolment, a term and a course." The board reads "Conceptual model · the sketch we drew", and the end card "Learning Data · Data modelling".

The film is in English; `site/es/sketch/` introduces it in Spanish.

## On the site

The film is the *Data modelling* topic (Topics › Data modelling), and builds on the chapter *The sketch* of *The Inner Life of Data*.

| Page | What it holds |
|---|---|
| `site/sketch/` | The film, with chapters, and a "Where next?" panel when it ends (`site/assets/learn/next.js`, from the page's `<template id="next-panel">`). |
| `site/sketch/labs/` | *Sharpen it*: six training labs (grain, where details live, course admissions, status history, choosing a reference model, and a fit check). |
| `site/sketch/scenarios/` | *Make the call*: twelve evaluation scenarios in three formats, then "Where next". |
| `site/es/sketch/` | A Spanish page around the English film: Spanish text, chapter names and player controls. The narration, captions, labs and scenarios stay in English, and the page says so. |

The pages draw with the film's own components from `site/assets/film3/film.js`, and their code and words are in `site/assets/sketch/sketch.js`. The Spanish page sets the player's control labels in `window.L10N` before loading the film, and renames the chapters in `SCENES` just after it; the film itself is unchanged. The Sketch pages don't load `site/assets/learn/path.js`: `sketch.js` paints their stepper and keeps progress in the browser, under `ld3:`, a historical prefix that must not be renamed, or visitors lose their progress. English and Spanish share it.

After changing the film, rebuild it (see [source/](source/)), then copy `source/dist/film.js` and `source/dist/soundtrack.mp3` to `site/assets/film3/`. The release workflow runs `tools/tts.py --keep-timings` and `tools/build.py`, and fails unless its `dist/film.js` is byte-identical to `site/assets/film3/film.js`, so never edit the site copy by hand. If a chapter's start moves, update the chapter table and the `#t=` example above.
