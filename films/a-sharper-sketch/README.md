# A Sharper Sketch

A 7½-minute film from Learning Data about data modelling, film 2 of 2 in [Model the business](../model-the-business/README.md), after *The map behind the sketch*. It opens in China in 1391, on the four columns of the Ming household registers: what each household held, what came in, what went out, and what it holds now. Then two trusted numbers disagree about how many students were enrolled in Data Science 101 on census date. To find out why, the film goes back to the sketch from *The Inner Life of Data*, now on the university's map, calls it what it is, an oversimplification, and sharpens it one question at a time, checking each change against a reference model. It notes that MortarCAPS (MCDS) is the standard many universities actually use, and checks against TCSI, one of the choices, because it is public. It is written for anyone aged 14 and up, with nothing a data modeller would need to correct, and it is about modelling only: what the model says, not how the pipelines build it.

- **Watch, with labs and scenarios:** [https://data.learn-all.org/sketch/](https://data.learn-all.org/sketch/)
- **In Spanish, around the English film:** [https://data.learn-all.org/es/sketch/](https://data.learn-all.org/es/sketch/)
- **Download the video (MP4, 1080p):** [https://github.com/roanboc/learning-data/releases/latest/download/a-sharper-sketch.mp4](https://github.com/roanboc/learning-data/releases/latest/download/a-sharper-sketch.mp4)
- **Script, with rigour notes and sources:** [script.md](script.md)
- **Treatment:** [treatment.md](treatment.md)
- **Captions:** [en.vtt](captions/en.vtt), [en.srt](captions/en.srt), in Spanish [es.vtt](captions/es.vtt), [es.srt](captions/es.srt)

## Chapters

| Time | Chapter |
|---|---|
| 0:00 | Four columns |
| 1:16 | The sketch on the map |
| 1:44 | Two numbers |
| 2:58 | What is a class? |
| 3:42 | Whose census date? |
| 4:11 | One student, two courses |
| 4:45 | Enrolled when? |
| 5:22 | Three levels of precision |
| 6:02 | Check, adopt, extend, record |
| 6:38 | Pull back |

To link to a chapter, add `#t=` and its start in seconds, rounded up, to the page's address: for example [`/sketch/#t=286`](https://data.learn-all.org/sketch/#t=286) for *Enrolled when?* (it starts at 285.7 s). Rounding down lands on the last frame of the chapter before.

## What it teaches

- **Add precision when a question can't be answered in only one way.** Each chapter is one disagreement, and one change to the sketch: the class splits into unit, unit offering and class; the census date moves to the offering; a course admission joins student and course; enrolments keep their history.
- **Ask how this kind of business generally works, and check a reference model before you draw.** Many industries have published models that make a good first template, and there is often more than one, so choose deliberately and record why. Check it, don't copy it: adopt it where it fits the business, extend it where it doesn't, and record every difference in a fit register.
- **Models evolve: not often, but always.** The sketch carries a version stamp, from v1 to v2, and a new question hints at v3.
- **Conceptual, logical, physical:** the same meaning at three levels of detail.

How the physical tables are built, including dimensional and entity-centric modelling, is left for a later film for engineers (see the treatment).

## Customising it

The chapters don't depend on TCSI. To make an internal version with your own reference model, change the reference boxes (`REFE` and `REFR` in `source/src/sketch3.js`), the labels in `source/src/scenes.js`, the narration in `source/src/narration.js`, and the fit register in the *fit* scene. Keep the four questions and the check, adopt, extend and record steps.

## How it was made

Like *The Inner Life of Data*, it is generated entirely from code, and it draws with that film's components and engine, so the two look like one world. The source and the rebuild steps are in [source/](source/). Where one chapter fades into the next, nothing shows twice: *Check, adopt, extend, record* shows the same words in another place, so what was there leaves first, and then the chapter comes in (5 November 2026: `CHAPTER_JOINS` in `source/src/scenes.js`, read by From words to data's `shared/src/joins.js`; `source/tools/check.py` runs the governance films' `twice.py` on every join).

The film carries no number. It opens with the recap "In The Inner Life of Data, we drew a sketch of the university: a student, a class, an enrolment, a term and a course." The board reads "Conceptual model · the sketch we drew", and the end card "Learning Data · Data modelling".

The film is in English; `site/es/sketch/` introduces it in Spanish.

## On the site

The film is the *Data modelling* topic (Topics › Data modelling), and builds on the chapter *The sketch* of *The Inner Life of Data*.

| Page | What it holds |
|---|---|
| `site/sketch/` | The film, with chapters, and a "Where next?" panel when it ends (`site/assets/learn/next.js`, from the page's `<template id="next-panel">`). |
| `site/sketch/labs/`, `site/sketch/scenarios/` | Its old labs and scenarios pages, made by `site-tools/build_series.py`: they lead to its series' playground, *Sharpen the sketch* (`model-the-business/labs/#sharpen`), and to its six situations in the series' evaluation (`model-the-business/scenarios/#film-2`). Until 19 November 2026 they held six labs and twelve scenarios of its own. |
| `site/es/sketch/` | A Spanish page around the English film: Spanish text, chapter names and player controls, and the film's Spanish captions. The narration stays in English, and the page says so; the series' playground and situations are in Spanish too. |

The film's lab and situations are its series': the playground *Sharpen the sketch* and six situations, with their words in `site/assets/model-the-business/learn.en.js` and `learn.es.js`, drawn by the series' `learn.js`. The page's buttons to them, in its "Where next?" panel and in *Take it apart, then make the call*, are made by `site-tools/build_series.py` between the marks it names (`<!-- model-the-business next -->`, `<!-- model-the-business labs -->`). The page loads `site/assets/learn/path.js`, which records the film as watched under `ld3:` (`data-store` on `section#watch`), a historical prefix that must not be renamed, or visitors lose their progress; English and Spanish share it. The Spanish page sets the player's control labels in `window.L10N` before loading the film, and renames the chapters in `SCENES` just after it; the film itself is unchanged.

After changing the film, rebuild it (see [source/](source/)), then copy `source/dist/film.js` and `source/dist/soundtrack.mp3` to `site/assets/film3/`. The release workflow runs `tools/tts.py --keep-timings` and `tools/build.py`, and fails unless its `dist/film.js` is byte-identical to `site/assets/film3/film.js`, so never edit the site copy by hand. If a chapter's start moves, update the chapter table and the `#t=` example above.
