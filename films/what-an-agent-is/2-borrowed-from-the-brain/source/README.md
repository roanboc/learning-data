# Rebuilding Borrowed from the brain

*Borrowed from the brain*, film 2 of 10 of *What an agent is*, the first series of the module on AI agents in data work, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, and uses the module's look, marble and oak: its room, its people, the agent and its cards, in [`../../shared/src/`](../../shared/src/), bundled as they are. Only what is new in this film lives here, each name with the prefix `bb_` (or `BB_`, and `bbNavy`, `bbRoom`, `bbTissue` and the like for its places):

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the line on what the colours mean, its own source files, the opening story (`story`: *Why look to nature* and *A thicket*), no chapter where the score may pulse (`urgent` is empty), the words the voice respells (Ramón y Cajal, Camillo Golgi, McCulloch, Wiesel, Kandel, and "AI" said whole), and the moment its poster shows (Cajal's whole drawing, in *A thicket*). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The longer pauses after a line (`hold`), where an idea or a picture needs a moment, and the two wordless moments: the title card after the opening story, and the end card. |
| `src/bb_kit.js` | The film's own colours (Cajal's ink and paper, brass and walnut, the stained slide's gold, the living cell's warm tones) and the helpers every chapter uses: a place-and-year tag, pills and cards, a nerve cell grown from a seed (its body, branches and one long fibre, each a tapering curve), the signal's warm spark, a microscope's round field, a sheet of paper, ink drawn on along a line, a unit and the perceptron. |
| `src/bb_past.js` | The places of the opening and of the story, painted once, full-frame: a laboratory of 1958, a sheet of drawing paper, an open sky with buzzards, the dunes at Kitty Hawk (1902), a maple's branch, a brain as an anatomy book draws it, a microscope's field, Cajal's room in Barcelona (1888), a ward's corner, Berlin's table of microscopes (1889) and Stockholm's hall (1906); and the people of the story, dressed from photographs of the day, never as likenesses. |
| `src/bb_life.js` | Living things: tissue under a lamp and the gap between two cells, open water, a meadow, a reef, a garden's branch and an eye cut in half; and, drawn live, the cells and their signals, the jellyfish, the sea slug, the bee and its dance, the octopus, the finches, the rabbit and the eye's light. |
| `src/bb_model.js` | What people built on the nerve cell, in the module's colours: 1943's unit, units in layers, 1959's cat and its screen, a picture read in layers, a field of weights, one nerve cell and the network it took to mimic it, the next word's chances (as bars, as a wheel's slices, and the temperature dial), the 2025 study's dates and test, and an electron microscope's picture of the gap. |
| `src/scenes.js` | The nine chapters, each a few shots under a slow camera (`ag_shots`), cut or dissolved. The title card ends chapter 2, the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line: *la célula nerviosa* and *la neurona*, *el espacio* for the gap between cells, *la maraña* for the thicket, *una tinción* for Golgi's stain, *el perceptrón*, *los pesos*, *la temperatura* and *las porciones de la ruleta*, *verificar* for a check, as in the series, and *mil millones* for billions. |
| `tools/score.py` | The film's music and sounds: an Aeolian harp, played by the wind, for nature, and a toy piano for the units people built, both made here, every chord the harmonics of one string or tuned pure from E. The mark is the wind's note struck again, short, on the toy piano: the idea borrowed, not the living thing. A nerve impulse is a soft, low tock, always the same; each word the model draws is a toy note, the same note for the same word all through. No pulse anywhere. Each effect fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/what-an-agent-is/2-borrowed-from-the-brain/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error; places, dissolves, arms and people's edges too
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/borrowed-from-the-brain.mp4
```

`build.py` stops if two files declare the same top-level name, if a key is named twice in one object, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/borrowed-from-the-brain/`, with the Spanish captions (as `captions.es.js`), and draws the poster, `site/assets/borrowed-from-the-brain-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links three of Learning Systems' worlds. "Pause and think" is `site/assets/borrowed-from-the-brain/think.en.js` and `think.es.js`: it stops after `cell`, `borrowed` and `sure`, with one question each. The release workflow renders the video, `borrowed-from-the-brain.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
