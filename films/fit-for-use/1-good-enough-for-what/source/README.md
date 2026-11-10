# Rebuilding Good enough for what?

*Good enough for what?*, film 1 of 4 of *Fit for use*, the first series of the module *Data quality*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../shared/`](../../shared/), whose [README](../../shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `ge_` or `GE_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (Mercator's chart with its two verdicts, Steering and Comparing sizes), the words the voice respells (Jun, Mei, Malia Fonoti, Andrés Peñaloza, Duisburg, Juran, and "A I"), its opening story (`chart`), no chapter where the score may pulse, and `"logos": true` for Databricks' and dbt's marks. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number or a code says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/coast.js` | The coasts the chart draws, as longitude and latitude: the world's outlines from *Off the shelf* (`OS_LAND`), with a closer coast where the North Atlantic chart shows it (the Gulf of St Lawrence and Nova Scotia), Newfoundland, and the Azores. |
| `src/chart.js` | The opening, on the film's own place, an oak worktable seen from above (`ge_table`): Mercator's chart of the North Atlantic, drawn in ink, a plane chart of the time that stretches into his in front of the viewer, its name in a cartouche in the sea; the course from Lisbon to St John's ruled on the plane chart, held by a small ship and missing the coast, and the course his chart shows, which reaches the port; the ruler, the compass card, the chart's two verdicts, and Greenland beside Africa as the chart draws them and as they are. The numbers are in the script's *Rigour*. |
| `src/world.js` | The university's side, on the kit's three places (the workroom's wall, its granite seen from above, the Great Hall): the graduation list as a card, its four uses with their levels in brass and who agreed them, the empty certificate folder, cards of words, the six questions as chips, and each person drawn whole, then faded as one picture. |
| `src/scenes.js` | The five chapters. The oak table, the wall, the granite and the Great Hall are each one room: in each, the camera glides from one framing to the next and what changes fades. Between rooms a shot dissolves, or comes in on a cut where both would show the same person or words, so Andrés is never shown beside his student number. The title card ends chapter 1 and the end card chapter 5. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: the module's cloud-chamber bowls, small glass shells struck softly with felt and damped, each ringing in its own modes at one pitch; and their partner, a larger, lower set, struck once and left to ring under each use's card as its level is agreed. The mark: the small A alone, the large D it belongs with, then the small A again, now heard as the fifth. D major, B minor for the problem, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/fit-for-use/1-good-enough-for-what/source/`:

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
python tools/render.py --workers 4   # dist/good-enough-for-what.mp4
```

The voice cache knows each line's words: after changing a line, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only what changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/good-enough-for-what/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/good-enough-for-what-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film good-enough-for-what-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the official docs the film hands over to. "Pause and think" is `site/assets/good-enough-for-what/think.en.js` and `think.es.js`: it stops after `reprint`, `uses` and `needs`, with one question each. The release workflow renders the video, `good-enough-for-what.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The list the film shows is in the example project, [`films/analytics-engineering/project/`](../../../analytics-engineering/project/): its rows in `data/student_system/graduations.csv`, its model and checks in `models/marts/graduations/`, its four uses as exposures in `exposures/graduations/` and `exposures/planning/`, its data contract in `governance/5-data-contracts/mart_graduations__graduation_list.yaml`, and the governed tag on its critical columns in `macros/governance/critical_data.sql`.
