# Rebuilding A capability, not a project

*A capability, not a project*, the opening film of *Governance on the map*, the second series on data governance, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, the master and reference data series' watercolour and its people in pencil and wash, and *Governance principles*' university: its rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`), in [`../../../data-governance/shared/src/`](../../../data-governance/shared/src/), bundled as they are. Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the opening story (`story`, for `tools/quiet.py`), the words the voice respells (Yusuf, Noor), and the moment its poster shows (the board walking the dike). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the title card after the dike, the storm barrier's stages, and the end card). |
| `src/plan.js` | This film's places (prefixed `cp_` and `CP`), in watercolour, painted once and kept: Holland around 1300, the land behind a dike from a farm's mound, the same land cut through at a ditch so its sinking under the river's level shows, the dike along its crest with one stretch slumped, a farm in the flood, a charter on a table, and the same kind of land today; the deputy vice-chancellor's office, a new place; Noor's map with its strategy and business bands drawn large; and the papers: the project's final report, *Budget 2027*, the wall planner, one page of services. No windmills (they came later), and nothing in Dutch or Latin. |
| `src/past.js` | The people of 1300: the farmers, the board's members with their staffs, the clerk with his tally, the landowners, in wool undyed or dyed with weld, woad and madder; their poses and what they hold. |
| `src/holland.js` | What moves on the land: a channel cut and the wet land drained; the river through the slumped stretch, the flood over the fields, the farms and the cattle; the family carrying the winter's grain into the loft. |
| `src/board.js` | The water board's work: three small pictures of a dike that's never finished, the gap mended, the board gathered on the dike, each landowner's stretch staked out and seen from above, the board walking the crest and the fine, three cards on the sky, the land kept and ploughed, the charter of 1255, two people cycling on the dike today. |
| `src/storm.js` | Holland in 1953: the storm on a dike at night; the storm barrier built across an estuary in stages, its gates closing and the last crane leaving; and today, two of the water board's people walking a dike in the rain. |
| `src/uni.js` | The university: the floor where the work is done and the two reports' cards on its glass; David's office, his desk, the wall planner for 2027, the report, the budget; Noor's map, the strategy band with *Govern data* and its eight capabilities, their tokens, notes and colours, and the business band with the seven services, their dotted lines and their promises; Planning's screen, Anil's locked page, the stewards' meeting; and the corner pill and tags. Text drawn small on purpose, such as a card's words while it turns, is drawn under `PH_OFF`, which the legibility check leaves out. |
| `src/scenes.js` | The eight chapters, each a few shots joined by short dissolves. Two shots of one moment, Noor's room and her map close, cut instead (`cp_shots` in `src/uni.js`), so nothing in them shows twice. The title card ends chapter 1, the end card chapter 8, with the next film's name under it. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. The five lines the film quotes from *What it must be able to do* keep that film's captions. |
| `tools/score.py` | The film's music and sounds: a saxophone quartet, soprano, alto, tenor and baritone, made here, under the opening story in Holland (F major) and after that only now and then (the storm of 1953 in F minor, the university in D-flat major, tuned from the same F). Its one figure is a note handed on from voice to voice that never stops, whoever plays it; a project is a phrase that ends; the water boards' five-note tune comes back whenever the film goes back to Holland; the series' mark, 1-5-4-8, on the alto, answered by the baritone, plays at the title and the end. Every chord is tuned pure, and no note pulses or trembles; the whole score is low-passed last, below about 2.5 kHz. Each effect (water, wind, rain, the sea, a spade, stakes, a staff, a notch, a coin, a plough, bicycles, the barrier's gates, a crane; paper, pins, a pen, a marker, a knock, a padlock) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs the series' tool (`../../../data-governance/shared/tools/run.py`) on this film: *Governance principles*' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/governance-on-the-map/1-a-capability-not-a-project/source/`:

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
python tools/render.py --workers 4   # dist/a-capability-not-a-project.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start (the score stops instead). `python ../../../data-governance/shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/a-capability-not-a-project/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/a-capability-not-a-project-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/a-capability-not-a-project/think.en.js` and `think.es.js`: it stops after `what`, `colour` and `ask`, with one question each. Progress is stored in the browser under `ld-a-capability-not-a-project`. The release workflow renders the video, `a-capability-not-a-project.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
