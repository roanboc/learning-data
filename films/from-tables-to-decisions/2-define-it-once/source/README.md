# Rebuilding Defined in the open

*Defined in the open*, film 2 of 3 of *From tables to decisions*, the third series of *Modern data basics*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts, logos and voice model, *A Sharper Sketch*'s `scene()`, the agent films' camera, places and people, and the module's look and tools in [`../../../data-that-moves/shared/`](../../../data-that-moves/shared/), whose [README](../../../data-that-moves/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `dn_`, but for its warm colours, `DN`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the definition card, full, with Rohan beside it), the words the voice respells (Jun, AI, HR, Rohan, Desai, Noor, Ossie, MetricFlow, YAML, BI), its opening story (`kilo`), no chapter where the score may pulse, and `"logos": true` for Databricks' and dbt's marks. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number or a year says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/kilo.js` | The opening's place and pieces, in the warm light of its vault: the vault near Paris, the cylinder of platinum and iridium under two nested bell jars, the forty copies and their countries, the balance, the three verifications, the drift's fan, the scratch on the glass, the constant's card and the Kibble balance. |
| `src/measure.js` | The university's pictures on the module's map: the three windows and their numbers, the faculty's question, the budget bar and its seven tutorials, Rohan's report, the definition card and the other two counts' names, the catalog's tree with the fact and the metric view, the groupings, the lock and the readers, the YAML, the pull request and its two approvals, the old BI tools' definitions, the two homes, the Ossie hub and its spokes, dbt's Ossie document, the converter's notice, Genie One and the dashboard. |
| `src/scenes.js` | The seven chapters, each one shot in each place it visits; the vault and the map are two rooms, joined by a cut. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds: two organettes reading the same paper strip, a small one and a larger one an octave lower, tuned pure from C; the mark is a short tune read from the strip, the same on both. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../data-that-moves/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/from-tables-to-decisions/2-define-it-once/source/`:

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
python tools/render.py --workers 4   # dist/define-it-once.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/define-it-once/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/define-it-once-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/define-it-once/think.en.js` and `think.es.js`: it stops after `three`, `dbt` and `open`, with one question each. The release workflow renders the video, `define-it-once.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
