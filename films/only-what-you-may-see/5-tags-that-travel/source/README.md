# Rebuilding Tags that travel

*Tags that travel*, film 5 of 8 of *Only what you may see*, the second series of *Data protection and privacy*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, two files of the agent films' kit, and the module's look and tools in [`../../../locks-before-the-data/shared/`](../../../locks-before-the-data/shared/), whose [README](../../../locks-before-the-data/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `tt_` or `TT_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the study's copy as its classes arrive), the words the voice respells (Jun, AI and HR, as in every film of the module, and Mei, Anil and Okafor), its opening story (`forest`), no chapter where the score may pulse, and `"logos": true` for the tools' pages. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice reads differently from its caption (a number or a date in words) says it in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/tt_forest.js` | The opening's places, painted once in the module's night light: a tropical forest's edge, its canopy and mist beside a slope cut bare, with stumps and a felled trunk; and the chain, a frieze of four stations along one road under lamps (the forest's log pile, a sawmill's planks, a workshop's chair, a shop's chair behind glass), with the bin where two kinds of planks are mixed. No people, no flag, no FSC logo or label. |
| `src/tt_hall.js` | The university's places in the module's hall (the rooms of Sam, Mei and Jun, the wide hall and the studies' workspace), the class chips as *Know what you hold* draws them (`pseudonymous` with its key, `none` a grey pill, an empty outline where it's no tag), the level pills, the tables drawn as Catalog Explorer with a slot for each column's tag, the lines of lineage and a chip riding one, and the name cards. |
| `src/tt_pages.js` | The tools' pages, drawn as their docs show them: Mei's card of classes and levels; Databricks' Governed tags page and its permissions; the Data classification results; GitHub's pull request with each class beside its column; dbt's build and the three steps after it; the Tag propagation dialog; the opening's small panes; the studies' workspace with its door; a file downloaded; a small window on a place. |
| `src/scenes.js` | The eight chapters, each a few shots. In one room the camera glides on and only what changes fades; between rooms it cuts, and between the forest and its chain it dissolves. The title card ends chapter 1 and the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a bray harp, whose gut strings each buzz against a small wooden pin set once at their foot, one string for each class, the strictest the lowest, and a plain string for no class; and an octobass, one long, low note at a time, under the opening, the value set in advance, and the end. A minor for the opening's problem, C major after, tuned pure from C. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/only-what-you-may-see/5-tags-that-travel/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every word reads and stands out, places and people paint in time, nothing shows twice or jumps
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, held notes keep their level, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/tags-that-travel.mp4
```

`tts.py` reuses a line's voice only while its spoken words, the voice and the model match what made it, so a changed line is voiced again by itself; don't delete the files by hand. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/tags-that-travel/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/tags-that-travel-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/media.py index --film tags-that-travel-en` from the repository's root if the soundtrack changed (it writes the film's `audio.json`), and `python site-tools/build_series.py`: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/tags-that-travel/think.en.js` and `think.es.js`. The release workflow renders the video, `tags-that-travel.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
