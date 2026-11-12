# Rebuilding Late is wrong too

*Late is wrong too*, film 4 of 4 of *Fit for use*, the first series of the module *Data quality*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../shared/`](../../shared/), whose [README](../../shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `lw_` or `LW_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the list's age on the printer's page, beside the volunteers' flags), the words the voice respells (Jun, Mei, Malia Fonoti, Andrés Peñaloza, and "A I"), its opening story (`story`), the one chapter where the score may pulse (`hours`), and `"logos": true` for Databricks' and dbt's marks. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number, a year or a time says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/lw_coast.js` | The opening's places, one coast seen the same way at four moments: dusk on 12 November 1970, that night under the surge, the same coast by day from 1972 with the flags' bamboo pole and a cyclone shelter, and dusk on 15 November 2007, the shelter's windows lit. Painted once, matte and softly lit with no outlines; drawn live over them, the flags, people walking, the volunteers with their megaphones, the rain and the surge's water. People are small and far, with no faces; no emblem is drawn, and nothing is borrowed from Bengali art. The facts are in the script's *Rigour*. |
| `src/lw_bench.js` | The university's side, on the kit's places (the workroom's wall and its granite seen from above) and one of its own, the bench at night under its lamp, the same room as the bench by day: the night's file, the graduation list, Databricks' monitoring and dbt's freshness check drawn for the film, the send to the printer, the uses and their clocks, the six dimensions as *Rules that run* left them, a record's three dates (when it happened, when its source saved it and when its file arrived), the list with its age, the printer's page, the receipts (their newest record's column lit in steel for the age, their received column lit plain for the second alarm), and the two jobs in Lakeflow Jobs with their run conditions, the night's with both checks one over the other. People behind the bench are drawn whole, then faded as one picture. |
| `src/scenes.js` | The seven chapters. The coast is one room, and so is the bench: in each, the camera glides from one framing to the next and what changes fades; a later moment lets what was there leave first. The bench chapters open where the one before ends (`ag_cutInto`), so the night turns to Thursday morning, Thursday to Monday's meeting, and the meeting to the bench seen from above. Between the coast and the bench, a dissolve. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: ice bells, small bells of ice struck softly with felt, with a short ring, and their partner, a larger, lower set, struck once and left to ring out. The mark: the student system's bell, struck clear when its night's file comes and dull when the file, or what's in it, is a day old, turned round at the end. B-flat major, G minor for the late night, tuned pure; one urgent pulse, in *Thirty hours* only. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/fit-for-use/4-late-is-wrong-too/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and the pulse stays in Thirty hours
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/late-is-wrong-too.mp4
```

The voice cache knows each line's words: after changing a line, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only what changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/late-is-wrong-too/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/late-is-wrong-too-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film late-is-wrong-too-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the official docs the film hands over to. "Pause and think" is `site/assets/late-is-wrong-too/think.en.js` and `think.es.js`: it stops after `green`, `fresh`, `age` and `stop`, with one question each. The release workflow renders the video, `late-is-wrong-too.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The list the film shows is in the example project, [`films/analytics-engineering/project/`](../../../analytics-engineering/project/): each source's receipts in `data/student_system/nightly_files.csv` and `data/portal/nightly_files.csv` (when each night's file arrived, and when the source saved the newest record in it), their freshness, read from the newest record, in `sources/student_system/` and `sources/portal/`, the list's age in `models/marts/graduations/mart_graduations__graduation_list.sql`, its timeliness rules in `models/marts/graduations/_graduations__models.yml`, the second alarm, for a source that goes silent, in `tests/quality/nightly_file_from_each_source_tonight.sql`, the send's own check in `tests/quality/graduation_list_at_most_a_day_old_at_the_send.sql`, its latency in `governance/4-data-products/graduation_list.yml`, and the night, a record's three dates and the two jobs in `examples/a-late-file/`.
