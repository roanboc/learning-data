# Rebuilding Small, every week

*Small, every week*, film 4 of 4 of *Quality as a habit*, the second series of the module *Data quality*, and the module's last film, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../../fit-for-use/shared/`](../../../fit-for-use/shared/), whose [README](../../../fit-for-use/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `sw_` or `SW_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the Great Hall, as Mei reads Andrés Peñaloza's name from the list), the words the voice respells (Jun, Mei, Malia Fonoti, Andrés Peñaloza, dbt, Shewhart, Borlaug), its opening story (`harvests`), no chapter where the score may pulse, and `"logos": true` for Databricks' and dbt's marks. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year, a date or a number says it in words for the voice (`say`), and shows it as written in its caption; the voice also reads Yaqui and Deming as they're said. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/sw_map.js` | Mexico and its neighbours, from Natural Earth's outlines (public domain), projected once into the frame: generated, not drawn by hand. |
| `src/sw_world.js` | The opening's places, painted once in the module's light and matte language: the highlands near Mexico City in summer, a field of wheat under a high sky with a broad volcano far off (`swField`); the wheat close up (`swStems`); the map of Mexico on paper (`swMap`); a page of a field book, for the calendar of generations (`swSheet`); and the Yaqui Valley in winter, flat and irrigated to the hills, with a plain wooden table in front (`swValley`, and `swValley2` without the table). Live pieces: the near wheat (healthy, ruined by the rust, or ripe), stems with the rust's spots, sprigs, seed envelopes with their names, sacks of grain, and the corner that names the place and the year. The rust's red-brown is the rust's own, never the module's red; nothing stands for Mexico but the corner's words. |
| `src/sw_people.js` | The people of Mexico's wheat, 1945 to 1955, through the kit's `dq_person`: young Mexican agronomists, Norman Borlaug and four farmers, in plain field shirts and work clothes of their time, some in a felt or straw field hat inside the head's picture; and, at the university, a graduate of December 2025 in her gown and the admissions officer asked to a Thursday. No sombreros, serapes or flag colours, and no clothes in the module's colours that mean something. |
| `src/sw_cards.js` | The film's own helpers: timing, the corner, the team in the wheat, the field book's calendar of generations, the map's dots, route, sacks and wash, a certificate, a folder held open, and the bench's cards: plan, do, check, act as a wheel (with the wheat's sow, look, keep the best, sow again), the order of measure, simplify, standardise, automate, the year's ledger of changes and their keepers, the week on the dashboard, and the eight films' cards, each by its title under its series' name. |
| `src/scenes.js` | The seven chapters. The opening dissolves between its places (the field, the stems, the map, the field book, the valley) and comes to the university, the bench seen from above, the Great Hall and the bench; from chapter 2 to chapter 6 the film stays at the bench, where each chapter glides on from where the last one ends (`ag_cutInto`) and a later moment lets what was there leave first (`later:true`), except for one dissolve to Mexico in 1955. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a hydraulophone, played by blocking jets of water with the fingers, each jet a note that settles up into its pitch as the water's pressure builds and holds plain and even, B-flat 3 to G 5; and its partner, the hydraulophone's own low jets, E-flat 2 to E-flat 3, which swell in, hold and die away. The mark: one short phrase rising through E-flat major, a note longer each time it comes back (two notes where the team grows two generations a year, seven under the end card): a week's small change, kept. E-flat major for what grows and is kept, C minor for the rust and December's 41, A-flat major for the people at the table, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../fit-for-use/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/quality-as-a-habit/4-small-every-week/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/small-every-week.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/small-every-week/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/small-every-week-poster.jpg`, at the moment `film.json` names. The soundtrack stays out of Git: `python site-tools/media.py index --film small-every-week-en` writes the film's `audio.json`, and the audio is published to its own release before the pointer is merged ([docs/maintenance.md](../../../../docs/maintenance.md), *Add or replace audio*). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the loop's source, the official docs the film hands over to and the two films it builds on. "Pause and think" is `site/assets/small-every-week/think.en.js` and `think.es.js`: it stops after `thursdays`, `cycle`, `order` and `kept`, with one question each. The release workflow renders the video, `small-every-week.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

What the film shows is in the example project, [`films/analytics-engineering/project/`](../../../analytics-engineering/project/): the Thursday meeting, its three questions, the turn from 1 October, the order and each change with its keeper ([`docs/every-week.md`](../../../analytics-engineering/project/docs/every-week.md)); the last step of every run, `on-run-end` in [`dbt_project.yml`](../../../analytics-engineering/project/dbt_project.yml), which keeps each night's checks in one table ([`macros/governance/keep_check_results.sql`](../../../analytics-engineering/project/macros/governance/keep_check_results.sql)); and the week, night by night, that the dashboard reads ([`analyses/quality/checks_by_night.sql`](../../../analytics-engineering/project/analyses/quality/checks_by_night.sql)).
