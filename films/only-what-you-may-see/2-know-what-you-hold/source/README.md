# Rebuilding Know what you hold

*Know what you hold*, from *Only what you may see* in the module *Data protection and privacy*, is generated from code like every other film here. It follows *An agreement first* and hands over to *Show the least*. It opens in Chile, where from 2016 a black octagon on the front of each food packet over a limit said which ones to be careful with, put there by the maker who knows the recipe; then a university names what its data holds: a class for every column, the strictest that applies, and a level for every table, set once at the source by the data's owner, the class following the column into everything made from it. It names no product, cloud or tool.

It is drawn in the module's look, *Night glass*, with the module's kit in [`../../../locks-before-the-data/shared/`](../../../locks-before-the-data/shared/) (`glass.js`, `hall.js`, `night.js`, `sphere.js`, `pages.js`, `finish.js`), which uses the agent films' `kit.js` and `people.js` and *The Inner Life of Data*'s engine, unchanged. Only what is new in this film lives here, prefixed `kw_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Mei, Yusuf, Anil, Kurian, and the module's Jun, A I and HR), the moment its poster shows (the wide hall, every column with its class and every table with its level), and its opening-story chapter. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The pauses: a short hold after some lines, and two wordless moments, the title card after the opening story and the end card. |
| `src/kw_world.js` | The university's things: the five class chips (`KW_CLASS`, violet for personal data, grey for `none`), a table's level on a slip (`KW_LEVEL`, and how far its pane is frosted), the learner table, the support table, cards, name cards, the dotted lines between them and the light that runs along the glass. |
| `src/kw_chile.js` | Chile, painted in the module's night light: the supermarket aisle in 2012 and in 2016, the box close up, the end of the aisle, the cereal box with its back in Spanish and its front with octagons, the recipe card, the backpacks, the drinks chart, and the parent of 2012 (`KW_PARENT`). |
| `src/kw_hall.js` | The three rooms of the hall (the registrar's office, data governance and the wide hall), where people stand in them, the people the film shows (`DP_PEOPLE`: Mei and Yusuf; Anil is on cards only), and the chapters' headings. |
| `src/scenes.js`, `scenes2.js`, `scenes3.js` | The eight chapters. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. In one room the camera glides on and only what changes fades; between rooms it cuts where both shots show the same person or table (`cut:true`, and `ag_cutInto` for the chapters at the end of `scenes3.js`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: porcelain bells, one for each class, the strictest the lowest, and a sordun's few long notes under the opening story, as Chile comes back, and at the end. A class first named on screen is its bell, struck once; the five together are the title and the end. Every effect fires at the same word and offset as the thing it belongs to in the scenes: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film: the module's `build.py`, `check.py`, `contrast.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/only-what-you-may-see/2-know-what-you-hold/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame draws; every word reads on a phone and stands out from what's behind it; nothing jumps or shows twice
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes and goes, and nothing in it beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/publish.py    # the site's player, its Spanish captions and the poster
python tools/render.py --workers 4   # dist/know-what-you-hold.mp4
```

The soundtrack is stored outside Git: after `tools/audio.py`, run `python site-tools/media.py index --film know-what-you-hold-en` from the repository's root and commit `../audio.json` ([docs/maintenance.md](../../../../docs/maintenance.md), *Audio outside Git*).
