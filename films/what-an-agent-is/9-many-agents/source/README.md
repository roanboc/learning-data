# Rebuilding Many agents, and what emerges

*Many agents, and what emerges*, film 9 of 9 of *What an agent is*, the first series of the module on AI agents in data work, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, and the module's look and tools in [`../../shared/`](../../shared/), whose [README](../../shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `ma_` or `MA_` (the scenes' own helpers with `mb_`, `mc_` and `ms_`):

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (Eastgate by day), the words the voice respells (Harare, Humberto, Maturana, Varela, Jun, AI), its opening story (`breathes`) and the one chapter where the score may pulse (`trace`, the market crash). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/places.js` | The opening's and the close's places, painted once in the module's matte style, each with its place and year on a tag: the Harare street of 1992; the drawing board with the architect's pencil sketch, the air-conditioning plant and the title block; the termite mound on the savanna, whole and cut through, with the idea of the time; Eastgate's section by day and by night, its fans, floors and 48 chimneys; Eastgate finished, with its shops; and its plant room, with the engineer who looks after it (a person of the story). Warm air is a pale terracotta, cool air a pale mist grey and the termites' scent a pale gold, never one of the module's meaning colours. |
| `src/nature.js` | Much from little and the brain: inside a mound, termites carrying pellets of mud, two pillars rising into an arch; the ants' two bridges in a laboratory, 1989; a flock of starlings over Rome, with a lens on one bird and its nearest neighbours; and a field of neurons, signals passing from cell to cell. |
| `src/world.js` | The market and the living: the trading room of 6 May 2010, its index with the fall and the rebound, and the programs passing contracts back and forth; a cell, as a biology book draws it; the robot tortoise near Bristol, its battery and its hutch; and a microscope's view of the frog-cell bodies. |
| `src/plan.js` | The university's pieces, in the series' colours: the faculty cards, piles of notes and emails, a desk calendar, the agents (each with a slight delay and settle of its own), the drafts, the blue table of counts with its gear, the oak trays and locks, the shared board and its pins, the dots of the 31 students, the status card, Clara's stamp and Jun's test. |
| `src/scenes.js` | The seven chapters, each a few shots cut together with short dissolves. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: many small voices, pure and rounded, each a drop where something small appears on screen, scattered at first, then falling into step as one chord (the film's mark for emergence); and a bass clarinet, low and steady. E flat major, tuned pure, with the Lydian A at the turns; the film ends on that chord, left open. The only pulse is the market crash's. Each sound uses the same word and offset as the picture in `src/scenes.js`, or the same sums for what moves on its own (the termites, the crowd, the signals, the cell's parts, the dots): change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/what-an-agent-is/9-many-agents/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, and every place paints in time
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, nothing beats, and only the crash pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/many-agents.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/many-agents/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/many-agents-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/many-agents/think.en.js` and `think.es.js`: it stops after `little`, `many`, `board` and `alive`, with one question each. The release workflow renders the video, `many-agents.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
