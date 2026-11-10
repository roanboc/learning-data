# Rebuilding The hidden factory

*The hidden factory*, film 1 of 4 of *Quality as a habit*, the second series of the module *Data quality*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, the agent films' kit, and the module's own look in [`../../../fit-for-use/shared/`](../../../fit-for-use/shared/): the quality bench, its people, the cards, gauges and tags, the tools' windows, and the tools that build and check a film ([`../../../fit-for-use/shared/README.md`](../../../fit-for-use/shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Jun, Mei and "A I", as the module says them, and Malia, Fonoti, Andrés, Peñaloza, Noor, Beatriz, Fonseca, Cavalcanti, Feigenbaum and Kaoru), its opening story's chapter, no urgent chapter, the moment its poster shows (Patti Lyle Collins at her desk in the Dead Letter Office), and the tools' marks (`"logos": true`). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the graduations office becoming the title card, and the end card). |
| `src/hf_past.js` | Washington in 1899, 1943 and 1963 (prefixed `hf_`, as all of this film's own pieces): the street, the Dead Letter Office's reading room and its clerks, Patti Lyle Collins's desk, the sorting case, and the envelopes written by hand, each place painted once in the module's matte look, dressed for its time, with no flag, lettering or maker on any building and nobody a likeness. |
| `src/hf_office.js` | The graduations office, a place of this film's own in the module's look: two desks in pale oak, shelves of closed enrolment files, the window on the right; Malia, with the headset she phones graduates on, and her colleague, never named; the spreadsheet on her screen, and the platform's page that takes its place. |
| `src/hf_bench.js` | The film's things on the quality bench: sheets drawn on in pencil (Redman's two teams, Feigenbaum's second line, the fishbone), the team's calendar, the bars of hours, two stopwatches, the copy against the list, Beatriz's record, the five whys, the tools' pages (Databricks' system tables and lineage, dbt's checks at the source) and the scorecard. |
| `src/scenes.js` | The eight chapters, each a run of shots. The opening's places dissolve into each other where the whole picture changes, and glide on in one room; the bench is one room from chapter 2 on. A person who leaves or comes is drawn whole and faded as one picture. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. The project's files on the tools' pages are the example project's own, trimmed: the three checks at the source in `tests/rules/_rules__tests.yml`, the student system's record, and the scorecard. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: tuned anvils, two sets made here, the small ones struck softly and damped for the work nobody sees, and the large ones struck once and left to ring for the fix made once. The mark, at the title and the end: a small anvil's A struck three times, then the large anvil's F once. F major for what's put right, D minor for the problem. Music plays under the opening story, and after that only now and then; nothing pulses. Each effect fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../fit-for-use/shared/tools/run.py`) on this film: the module's own `build.py` and `quiet.py`, and the agent films' and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/quality-as-a-habit/1-the-hidden-factory/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints without holding the page, nothing shows twice, no arm jumps, nothing jumps in one room, nothing reaches past a person's picture
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, as low as the governance films', nothing beats, nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/the-hidden-factory.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).

`tts.py` reuses a line's voice only when its spoken words, voice and model match; a changed line is voiced again. `python tools/tts.py --keep-timings` keeps `src/vodur.js` and fails if a line comes out more than 0.05 s off it.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/the-hidden-factory/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/the-hidden-factory-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). After a new soundtrack, `python site-tools/media.py index --film the-hidden-factory-en` writes the film's `audio.json`. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page, its Spanish chapter names, the example project's files it links under *See it in the project*, and its Draft label). "Pause and think" is `site/assets/the-hidden-factory/think.en.js` and `think.es.js`: it stops after `hidden`, `count`, `back` and `born`, with one question each. Progress is stored in the browser under `ld-the-hidden-factory`. The release workflow renders the video, `the-hidden-factory.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
