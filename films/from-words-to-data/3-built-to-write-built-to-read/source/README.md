# Rebuilding Built to write, built to read

*Built to write, built to read*, a film in the series *From words to data*, on the shapes data takes for writing and for reading, is generated from code like *What's in a word*. It shares the engine, components, fonts and voice of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams and tables, the series' people (*When things go wrong*) and the series' own components (`../../shared/src/words.js`), and runs the series' tools (`../../shared/tools/`). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, colour key, its own source files, and the moment its poster shows (the two shapes side by side). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/breath.js` | The few longer pauses: a beat after most sentences, and three wordless moments (the title, the star's answer, the ending). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/write.js` | This film's components: the merchants' books of 1494 (paper, a quill, ink that bleeds in, a journal and a ledger), tables with keys and links, a transaction, a signed document, a star with its fact and dimensions, and the pictures of the labs and scenarios (`LV`), whose words come from the site's language packs. |
| `src/scenes.js` | The eight chapters. The title is part of the first one. |
| `tools/score.py` | The music and sounds, in B-flat major: a marimba and woodblock in sixteenths for writing, string pads and a felt piano for reading, a harp and a reed pad for 1494. |
| `tools/*.py` | Thin wrappers that run the series' shared tools on this film. |

## Rebuild

Run from this folder, `films/from-words-to-data/3-built-to-write-built-to-read/source/`:

```
python tools/build.py      # dist/render.html, dist/film.js and dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/pace.py       # pacing, chapter by chapter
python tools/stills.py [chapter ...] [--every 2] --size 960   # review stills in build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
```

The voice files are in `build/vo/` and their lengths in `src/vodur.js`. After changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run `python tools/tts.py`, which voices only the missing lines and rewrites `vodur.js`.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/built-to-write-built-to-read/` and draws the poster, `site/assets/built-to-write-built-to-read-poster.jpg`, at the moment `film.json` names. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds.

The labs and scenarios are in `site/assets/built-to-write-built-to-read/learn.en.js` and `learn.es.js` (with `vis`, the words the pictures draw), and "Pause and think" in `think.en.js` and `think.es.js`, stopping after `ledger`, `wrong`, `read` and `side`. The labs' "Watch this part" buttons find their chapter by id (`wrong`, `read`, `side`). Progress is stored under the prefix `ld-built-to-write-built-to-read`: keep it.

A change to a shared component (The Inner Life of Data's engine and components, `sketch3.js`, `people.js`, `silent.js` or the series' `words.js`) also changes this film: run `tools/check.py` here after one, then build and publish again.
