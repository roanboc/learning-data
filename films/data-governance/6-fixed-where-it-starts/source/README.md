# Rebuilding Fixed where it starts

*Fixed where it starts*, film 6 of the series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the opening story (`story`, for `tools/quiet.py`), the words the voice respells (Semmelweis, Yusuf), and the moment its poster shows (Jun mopping under the leak). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the hands at the basin and the title, the clamps going on, and binder 15's line marked green before the end card). |
| `src/plan.js` | This film's pictures (prefixed `fw_`), in watercolour: Vienna's general hospital in 1847 (its courtyard, the maternity corridor and its doors, the basin, the hands in the lime, the first clinic's register and ward) and Pest from 1858 to 1862 (his papers, his book, his desk and the open letters); Yusuf's office wall and binder 15, policy 15's page and the scorecard; the issue cards; the leak in the data team's room (the pipe, its joints and their drops, the tin buckets, the mop, the clamps and the sensor); the staging code, the wallets and the lineage; Tom's office, his desk and screens (the sign-up form, the learners, the microcredentials, the alert); a learner's phone, its keyboard and the thumb that types; the platform team's night (the badges, the tests, the wallet, monitoring's usual shape); the rule's file, and prevent, test and watch. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The eight chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a glass harmonica for the chords, under the opening story in Vienna (E minor, then G major once the hands are washed) and after that only now and then (the present in D major); handbells for the moments that land (where a problem shows, where it starts, prevent, test and watch, and a low bell for what's still going wrong); the series' mark, 1-5-4-8, on the handbells at the title and the end. Every chord is tuned pure, and no note pulses or trembles. Nothing loops, and each effect (water in the basin, the drops into the tin bucket, the mop, the clamps, a pen, paper, pins, stamps, keys) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`; the drops follow `fw_drip()` in `src/plan.js`, drop by drop: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/6-fixed-where-it-starts/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/fixed-where-it-starts.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start (the score stops instead). `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/fixed-where-it-starts/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/fixed-where-it-starts-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/fixed-where-it-starts/think.en.js` and `think.es.js`: it stops after `back`, `never` and `rule`, with one question each. Progress is stored in the browser under `ld-fixed-where-it-starts`. The release workflow renders the video, `fixed-where-it-starts.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
