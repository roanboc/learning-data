# Rebuilding Meaning machines can read

*Meaning machines can read*, a film in the series *From words to data*, on glossaries, taxonomies, ontologies, semantic layers and standards, and what an AI assistant needs to answer right, is generated from code like the series' other films. It draws with *The Inner Life of Data*'s engine and components, *A Sharper Sketch*'s diagrams and Genie, the series' people and *Silent change*'s components, and the series' own components in [`../../shared/src/words.js`](../../shared/src/words.js). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, and the moment its poster shows (the four floors, with the thread through them). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: the title, the four floors standing together, and the ending. Every sentence already gets a beat of 0.8 s from `narration.js`. |
| `src/machines.js` | This film's components: the organic past (tapering branches, leaves, breathing paper, the robin, Linnaeus's tree, Nightingale's forms), the four floors of meaning and their contents, Genie and the policy document, the semantic layer's metric card and the tools that ask it, the shelf of standards, the three definitions, the knowledge graph, a digital credential, and `LV`, the pictures of the labs and scenarios. |
| `src/scenes.js` | The eight chapters. The title is part of the first one. |
| `tools/score.py` | The film's music and sounds, in C Lydian: FM bells, glass pads and a celesta; a harp over strings for the history; plucks for Genie; a soft pulse for the semantic layer. |
| `tools/` | The series' tools (in `../../shared/tools/`), pointed at this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/from-words-to-data/6-meaning-machines-can-read/source/`:

```
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--every 2] --size 960   # review stills, into build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
```

The voice files are in `build/vo/`. `tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run `python tools/tts.py`, which voices only the missing lines and rewrites `src/vodur.js`.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/meaning-machines-can-read/`, and draws the poster, `site/assets/meaning-machines-can-read-poster.jpg`, at the moment `film.json` names. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds. The labs and scenarios load the same file, for their pictures (`LV` in `src/machines.js`), so a change to `machines.js` needs this copy too.

The words of the labs, scenarios and "Pause and think" questions are in `site/assets/meaning-machines-can-read/learn.en.js`, `learn.es.js`, `think.en.js` and `think.es.js`; every word a lab or scenario picture draws comes from their `vis` entries. Progress is stored in the browser under `ld-meaning-machines-can-read`. The pauses stop after `before`, `guesses`, `four` and `standards`; the labs' "Watch this part" buttons find their chapters by id (`four`, `standards`, `again`).
