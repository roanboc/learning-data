# Rebuilding Files as data and as context

*Files as data and as context*, film 1 of 2 in *Documents and closing remarks*, the last series of *Modern data basics*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' people and shots, and the module's look and tools in [`../../../data-that-moves/shared/`](../../../data-that-moves/shared/), whose [README](../../../data-that-moves/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `fd_` or `FD_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (an invoice read into its row, with its file's path), the words the voice respells (Jun, AI, HR, Nguyen, Linh, Noor, Rohan, Desai, Quetelet, YAML), its opening story (`logs`), no chapter where the score may pulse, and `"logos": true` for the Databricks and dbt logos. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number or a date says it in words (`say`), and shows the figures in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/fd_world.js` | The opening's world, 1842 to 1855, lamp-lit on the module's navy: the chart of the oceans (Natural Earth's 1:110m land, in the public domain, credited in `NOTICE.md`), with the winds, the currents, the two roads to California round Cape Horn and the five-degree squares; the Navy's office in Washington, the hall in Brussels and the night sea, each painted once; a logbook's page in three hands, a logbook shut, and the log agreed at Brussels in 1853; and a captain and Adolphe Quetelet, dressed for the 1850s. |
| `src/fd_docs.js` | The documents of today, drawn as pictures, their small words decoration on purpose: four suppliers' invoices, each in its own layout (the suppliers are invented); a file and its name; Linh Nguyen's offer and her signed contract; a tutor's spreadsheet of claims; and the cards of fields and of code or YAML that say what matters at 28 px or more. |
| `src/scenes.js` | The five chapters, each a few shots. The opening's rooms are rooms of their own, so one dissolves into the next where the whole picture changes; on the map the camera glides on from shot to shot, and a new moment waits for the last to leave (`later:true`); each chapter after the opening opens on the one before (`ag_cutInto`). The title card ends chapter 1 and the end card chapter 5. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: the tones of an optophone, the reading machine of 1913 that turned each printed letter into a chord, and tuned paper tubes, the tubes charts are rolled in, struck softly, both made in the score; the mark, a short line read letter by letter, then held as one chord. F sharp minor for the problem, A major for the answer, tuned pure from A. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../data-that-moves/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/documents-as-data/1-files-as-data-and-context/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps where the shot changes
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/files-as-data-and-context.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/files-as-data-and-context/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/files-as-data-and-context-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/files-as-data-and-context/think.en.js` and `think.es.js`: it stops after `invoices`, `contracts` and `written`, with one question each. The release workflow renders the video, `files-as-data-and-context.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

## The example project

What the film shows on the platform is in the example project, [`../../../analytics-engineering/project/examples/files-as-data/`](../../../analytics-engineering/project/examples/files-as-data/README.md), for Databricks only: the invoices read and checked, the metadata beside each contract and the function that finds a contract's signed file, and the claims app's data contract.
