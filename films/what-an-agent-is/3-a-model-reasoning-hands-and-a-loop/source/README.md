# Rebuilding A model, reasoning, hands and a loop

*A model, reasoning, hands and a loop*, film 3 of 10 of *What an agent is*, the first series of the module on AI agents in data work, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, and uses the module's look, marble and oak: its room, its people, the agent and its cards, in [`../../shared/src/`](../../shared/src/), bundled as they are. Only what is new in this film lives here, each name with the prefix `ml_` (or `ML_`, and `mlSeine`, `mlSky`, `mlDeck` for its places):

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the line on what the colours mean, its own source files, the opening story (`story`), no chapter where the score may pulse (`urgent` is empty), the words the voice respells (Cachin, Noor, Jun, and "AI" said whole), and the moment its poster shows (Cachin on the wing as the box brings it back). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: the agent dropping into Sperry's loop, becoming the title card, and the end card. |
| `src/past.js` | 1914 and the flight deck today: the Seine at Bezons (its bridges, poplars, the grandstand and the judges' tent), the June sky, the flying boat side on and from behind (from photographs of the Curtiss flying boats of 1914), the crowd of 1914 from behind, Sperry's box cut open (four gyroscopes, a valve, a piston, a lever to the wing's hinged edge) and its spirit level, today's flight deck, and the people of 1914 and today (Sperry, Cachin, a judge, two airline pilots), dressed from photographs of the day, never as likenesses. |
| `src/plan.js` | The room's own pieces: where Jun, his goal card, the agent's ring and its three tools stand; the tool cards with their tool servers and the same plug on every arm; the four parts under the kicker; the calendar and clock cards; the afternoon by hand; the pages streaming into the model and the card it writes on; the cabinet of student records; the plan, the team's rules and the queries; the answer by Jun with its five pieces of evidence and the line a person signs; the recipe and its test; a violet thought, the web, and the two columns, steps known and steps nobody can write in advance. |
| `src/scenes.js` | The nine chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice; the light on the agent's ring reaches each step as the voice names it. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line: *el día del censo* and *el informe del censo*, *Planificación*, *una verificación* for a check, *el bucle*, *la retroalimentación*; the tools keep their names on screen (Catalog, Query, Docs); *un servidor de herramientas*, *una receta* and its *prueba*, *un script sencillo*. Numbers keep the picture's comma (18,412). |
| `tools/score.py` | The film's music and sounds: a clean electric guitar, plucked with the thumb or held by an e-bow, and an electric bass, both made here, every chord tuned pure from G. G major, E minor for 1914's problem, B minor for reasoning; the loop's mark (G, C and D, one for each step as the light reaches it), held on its fourth while a check fails and home when it passes; a harmonic for a passing check, a muted note for a failing one. No pulse anywhere. Each effect (the river, the crowd, the engine, a gust, the gyroscopes, a valve's puff, cards, the arms' joints, a lock, a plug, the paperclip, a calendar page, a pen) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/what-an-agent-is/3-a-model-reasoning-hands-and-a-loop/source/`:

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
python tools/render.py --workers 4   # dist/a-model-reasoning-hands-and-a-loop.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/a-model-reasoning-hands-and-a-loop/`, with the Spanish captions (as `captions.es.js`), and draws the poster, `site/assets/a-model-reasoning-hands-and-a-loop-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/a-model-reasoning-hands-and-a-loop/think.en.js` and `think.es.js`: it stops after `writes`, `hands` and `script`, with one question each. The release workflow renders the video, `a-model-reasoning-hands-and-a-loop.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
