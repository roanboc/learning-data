# Rebuilding More than a junior

*More than a junior*, film 4 of 9 of *What an agent is*, the first series of the module on AI agents in data work, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, and uses the module's look, marble and oak: its room, its people, the agent and its cards, in [`../../shared/src/`](../../shared/src/), bundled as they are. Only what is new in this film lives here, each name with the prefix `mj_` (or `MJ_`):

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the line on what the colours mean, its own source files, the opening story (`story`), no chapter where the score may pulse (`urgent` is empty), the words the voice respells (Jun, Noor, Hans, Pfungst, von Osten, Wilhelm, and "AI" said whole), and the moment its poster shows (noon in the courtyard, as the papers call him Clever Hans). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: the title card after the opening, and the end card. |
| `src/berlin.js` | Berlin in 1904: the courtyard at noon and in autumn, from four cameras, its houses, stable wall and cobbles; Hans (standing, tapping with weight, blinking, in blinkers); von Osten, Pfungst, the visitors and the thirteen men of the commission in their clothes of 1904; the blackboard, the slate on its easel and its calendar page; the papers, the thought clouds, the dot grids, the line of sight, the lens, the envelope, Pfungst's laboratory, its table and the hand mirror. |
| `src/plan.js` | The room's own pieces: the paper junior and its badge, its ladder and the hook on the agent's stand; the agent with its badge; the two-column card (`MJ_ROWS`); the 33 tables (`MJ_T`, the path of the award count); the shelves, the clock, the week and the months; the sessions, the faculty bars (`MJ_FAC`, the film's own split of 4,812), the team's notes (`MJ_LESSON`); the draft, the stamps, the question bubbles, the calendar with one day ringed, the agent's review and its reasoning card. |
| `src/scenes.js` | The seven chapters, each a few shots joined by `mj_shots`: a cut between two framings of one moment, and a short dissolve where time passes or something changes in one place, the new shot starting where the last one's camera ended, so nothing shows twice. The title card ends chapter 1, the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line: *Hans el Listo*, *un junior* and *un sandbox* kept, *títulos* for awards, *el glosario*, *una sesión*, *las notas del equipo para agentes*, *sus permisos*, *una revisión solo de referencia*. Numbers keep the picture's comma (4,812). |
| `tools/score.py` | The film's music and sounds: a concert zither (the count, one F a tap or a card, stopping on B flat, or a semitone short when the count is wrong) and a heckelphone (the lift: A rising to B flat, whenever an answer is given away without knowing), both made here, in B-flat major, every chord tuned pure, with no urgent pulse. Each effect (hoof taps, chalk, the papers, a pencil, the blinkers' leather, cards, the clock, a pin, the lock, stamps, the tray, the badge's clip) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/what-an-agent-is/4-more-than-a-junior/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/more-than-a-junior.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/more-than-a-junior/`, with the Spanish captions (as `captions.es.js`), and draws the poster, `site/assets/more-than-a-junior-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/more-than-a-junior/think.en.js` and `think.es.js`: it stops after `more`, `lose` and `asked`, with one question each. The release workflow renders the video, `more-than-a-junior.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
