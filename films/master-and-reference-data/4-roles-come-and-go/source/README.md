# Rebuilding Roles come and go

*Roles come and go*, the fourth film of *The same one, everywhere* (a working title), is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, *In the weeds of data crafting*'s motion helpers, *The map before the data*'s people and ArchiMate glyphs, and the series' own watercolour in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Nguyen, Linh, HR, Cato), and the moment its poster shows (her whole timeline at the end, roles starting and ending all along it, and the line at today). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). Eight lines carry a `say`, so the voice reads dates and years as said: "the thirty-first of March", "twenty twenty-five". The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the census list and the word "census", then the title; Linh's table, read before it's asked about; and the end card). |
| `src/plan.js` | This film's places and pictures (prefixed `m4_` and `M4_`): Cato in his toga, as in 204 BC (`m4_togate`, `m4_toga`, `m4_wrapArm`); Rome before its marble, with its temples, senate house, portico, houses, cypresses and stone pines (`m4_forum`, `m4_temple`, `m4_curia`, `m4_portico`, `m4_house`, `m4_cypress`, `m4_pine`); the campus, plain paper, the data architect's office and the energy company's street (`m4_campus`, `m4_plain`, `m4_office`, `m4_street`, `m4_meterBox`); the tablet and its carved offices, the ladder of terracotta rungs and the census scroll (`m4_tablet`, `m4_carve`, `m4_ladderSheet`, `m4_rung`, `m4_scroll`); the calendar page, the questions people ask and the ghost of *One person, many roles*' email (`m4_calendar`, `m4_ask`, `m4_ghost`); the four systems' statuses, rubbed out and written again each night, the platform's copy, the moon and Planning's card (`m4_sys`, `m4_copy`, `m4_moon`, `m4_planAsk`); Linh's roles, dated (`M4_ROWS`, `M4_OWN`, `M4_PER`, `M4_TUT`, `M4_NOW`), and her timeline: her banded figure, each row's lane, name and owner, the periods, the tutor's contracts, the line of years and the line at today (`m4_tl`, `m4_fig`, `m4_lane`, `m4_per`, `m4_tutor`, `m4_axis`, `m4_today`), with what's drawn on it (`m4_dot`, `m4_pin`, `m4_rule`, `m4_arrow`, `m4_loop`); the form every role fills in (`m4_form`, `m4_formStrip`); HR's card, Planning's count and the alumni office's filter (`m4_hrCard`, `m4_planCount`, `m4_alumFilter`); the "relates to" tags (`m4_rel`); the energy company's sheet and the heart (`m4_energySheet`, `m4_heart`); and the role table, its tests and its query (`m4_table`, `m4_yaml`, `m4_query`). |
| `src/scenes.js` | The ten chapters. The title card ends chapter 1, the end card chapter 10. In the timeline chapters the camera stays still and the line of years widens or narrows to the dates the narration is about, so labels keep their size; elsewhere the camera moves in on whatever the narration is about. Things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds, a new palette: a choir humming "oo", one voice to a note; a felt piano note for each role, the same in every chapter; a glass harmonica's D and A for the person; the series' clarinet mark (1-8-5-1), on G under the title and on D at the end; from G minor in Rome to D major at the end. Music plays under the opening, Rome, then comes in from time to time: the choir at a few turns, one chord sung in tune with itself, and between them the notes of what's on screen. Nothing trembles or pulses: no vibrato, and no note played twice a little out of tune. Each effect (a chisel, parchment, a pencil and its rubber, a card, a pin, a brush, footsteps, a heartbeat) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. `check.py` first compares every date the film shows (the offices' cards, her bands and the role table) with the example project's data, in `films/analytics-engineering/project/data/`. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/master-and-reference-data/4-roles-come-and-go/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # the film's dates must be the example project's, and every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone (28 px or more in the frame), and none may overlap
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/roles-come-and-go.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/roles-come-and-go/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/roles-come-and-go-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its pages and its Spanish chapter names). "Pause and think" is `site/assets/roles-come-and-go/think.en.js` and `think.es.js`: it stops after `flags`, `terms`, `line` and `table`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-roles-come-and-go`. The release workflow renders the video, `roles-come-and-go.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
