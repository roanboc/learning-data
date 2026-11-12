# Rebuilding Proof it held

*Proof it held*, film 8 of 8 of *Only what you may see*, the second series of the module *Data protection and privacy*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, two files of the agent films' kit, and the module's look and tools in [`../../../locks-before-the-data/shared/`](../../../locks-before-the-data/shared/), whose [README](../../../locks-before-the-data/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `ph_` or `PH_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`proof-it-held`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `held`, at `hope`), the words the voice respells (Jun, "A I", HR, Mei, Yusuf, Demir, Anil, Kurian, PATH, UNICEF, Yogyakarta, Lindgren), its opening story (`square`), no chapter where the score may pulse and `"logos": true` for the logos it shows. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's wordless moments, such as the title card and the end card. |
| `src/ph_vial.js` | The opening story: a vial of polio vaccine with the vaccine vial monitor on its label, a square inside a circle that darkens with heat, gradually and for good. |
| `src/ph_pages.js` | The agreement as *An agreement first* draws it, its four promises word for word; the card of its four proofs, each a dashed slot until a record proves it; and the pages the proofs are read from, drawn as the tools lay them out and named as their docs name them. |
| `src/ph_lineage.js` | Lineage as the catalog's lineage graph lays it out: a card for each of three tables, its columns listed, and a line from each column to the columns made from it. |
| `src/ph_close.js` | Two masked values that look the same, one whose protection held and one whose didn't; the question a learner can ask; and the series' eight films in two rows of four. |
| `src/scenes.js` | The seven chapters, shot by shot, on the module's camera and shots. Every moment is timed to a line's start or to a word in it (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a round lyre, the early medieval lyre of northern Europe, and a tam-tam, both made here. The mark is two strings: the outer one the reference, as the monitor's circle is, and the inner one plucked a step higher each time until it meets it. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/only-what-you-may-see/8-proof-it-held/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, and nothing shows twice or jumps where the shot changes
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python ../../../../site-tools/fits.py   # every piece of text inside its box, and the captions on a phone
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/proof-it-held.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/proof-it-held/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/proof-it-held-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film proof-it-held-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. The release workflow renders the video, `proof-it-held.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
