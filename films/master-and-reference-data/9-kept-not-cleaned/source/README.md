# Rebuilding Kept, not cleaned

*Kept, not cleaned*, the ninth and last film of *The same one, everywhere*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, *In the weeds of data crafting*'s motion helpers, *The map before the data*'s people, and the series' own watercolour in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Nguyen, Linh, HR, Sichuan, Chengdu, Li Bing, Dujiangyan), and the moment its poster shows (the steward's five gauges, settled, each within the iron bar at its limit). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). Five lines carry a `say`, so the voice reads their years as years ("two fifty-six B C", "twenty twenty-four", "twenty twenty-five", "twenty twenty-six", "twenty twenty-seven"). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the river in spring, then the title; the steward's five measures, settled; and the end card). |
| `src/plan.js` | This film's places and pictures (prefixed `m9_` and `M9_`): Dujiangyan from above the plain, in the flood season and the dry one (`m9_valley`, `m9_rivers`, `m9_water`, `m9_innerWater`, `m9_gorge`, `m9_fields`, `m9_clumps`), the gravel down the outer channel (`m9_gravel`), the tripods that close the inner channel (`m9_tripods`), the diggers (`m9_diggers`), the cut through the riverbed with its stone horse and iron bars (`m9_section`, `m9_trench`, `m9_horsePic`, `m9_barsPic`) and the rule (`m9_rule`); the campus, the paper for the chapters that explain, and the offices (`m9_campus`, `m9_plain`, `m9_room`); Mei, Leila, Yusuf, and Linh as the person (`m9_person`); the clean-up's board and the chart of duplicates (`m9_board`, `m9_plot`, `m9_waiting`), the intakes and the two applications (`m9_intakes`, `m9_app`, `m9_stamping`); the search before create and Mei's queue (`m9_search`, `m9_glass`, `m9_stack`); the river in the dry season, small (`m9_inset`); the dashboard and its five gauges, each with an iron bar at its limit (`m9_cell`, `m9_gauge`, `m9_barPic`, `m9_tool`); the tutor whose term ended (`m9_tutor`); the alert and its case (`m9_alert`, `m9_case`); the government's list of visa types, the university's list and the change an agent drafts (`m9_govList`, `m9_uniList`, `m9_change`); the governance scorecard (`m9_scorecard`); and a bank's duplicates, cleaned up every three years (`m9_bankLine`, `m9_indChip`). |
| `src/scenes.js` | The ten chapters. The title card ends chapter 1, the end card chapter 10. The camera moves in on whatever the narration is about, and things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds, a palette of its own: a choir of flutes, one player on each note, under the opening and after that only from time to time (at each chapter's turn, in the wordless moment on the five gauges, and from the water let back in to the end); a celesta for each role, on the note it has had since *One person, many roles*; the bowed cello's D and A for the person; a clarinet for the series' mark (1-8-5-1); and a tubular bell for each of the steward's measures, its iron bar, struck again when the oldest case goes past its limit. From G minor in the dry season to D major when the water is let back in. Nothing pulses or trembles, as the series decided on 20 October 2026. Each effect (the river, gravel, spades, the tripods' poles, a strip of paper, a pencil, cards, stamps, a few muffled keys, a gauge filling like a bottle) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/master-and-reference-data/9-kept-not-cleaned/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone (28 px or more in the frame), and none may overlap
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/kept-not-cleaned.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/kept-not-cleaned/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/kept-not-cleaned-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its pages, its Spanish chapter names, and its row in "Every film opens somewhere else"). "Pause and think" is `site/assets/kept-not-cleaned/think.en.js` and `think.es.js`: it stops after `return`, `entry`, `measures` and `agent`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-kept-not-cleaned`. The release workflow renders the video, `kept-not-cleaned.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
