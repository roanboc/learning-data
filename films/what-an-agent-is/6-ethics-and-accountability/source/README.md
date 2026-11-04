# Rebuilding Ethics we can't read, accountability it can't hold

*Ethics we can't read, accountability it can't hold*, film 6 of 9 of *What an agent is*, the first series of the module on AI agents in data work, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, and uses the module's look, marble and oak: its room, its people, the agent and its cards, in [`../../shared/src/`](../../shared/src/), bundled as they are. Only what is new in this film lives here, each name with the prefix `ox_` (or `OX_`):

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the line on what the colours mean, its own source files, the opening story (`story`) and the one chapter where the score may pulse (`urgent`: the counter in *Whoever holds the rope*), the words the voice respells (Jun, Yusuf, Mei, Noor, and "AI" said whole), and the moment its poster shows (the pair of oxen ploughing with blunt horns, the owner at the rope). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: the title card after the opening, and the end card. |
| `src/babylon.js` | Babylon, about 1750 BC, in the module's matte way: the humpless, long-horned cattle of the time (walking, chewing, lowering their horns, rasped round), the pair at the plough and the cart, the field by the canal, the street of mud-brick houses, the temple courtyard and its tall black stone, date palms, the people in their wrapped, fringed garments (the owner, an elder, a scribe, a passer-by, a hired worker, a stranger, a woman and her children, a neighbour), the balance with its coils of silver and its duck weight, the basket of dates, the post and the rope, the hoe, the rasp and the three suns. |
| `src/lab6.js` | The lab as this film needs it: the framed picture on the wall and where the camera finds it, the count card and its states (checks pass, check failed, rerunning, failed again) with its tag, the clock, notes and bubbles, the calendar strip of the 37, the three streams the agent learned from, the field of numbers and the magnifier, the cards of what answering takes and the empty places, the team's memory, the card of who's a person in law, the message with its hidden line, Jun's key and the gloved hand, the counter, the warning cards, the list of names masked on their way, the oak rail round the test copy, the gate and its two stamps, the log and the "Stop" buttons, the agent's report, Mei's office, and the night lamp. |
| `src/scenes.js` | The seven chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line: *un control* for a check, *una copia de prueba* for the test copy, *una corrección* for a fix, *estudiantes* for students (never *inscripciones*), *la oficina de registro*; in Babylon, *un buey*, *cornear*, *despuntar los cuernos*, *siclos de plata*, *un jornalero*. Numbers keep the picture's comma (18,412). |
| `tools/score.py` | The film's music and sounds: a slate lithophone (the call, struck stone) and a melodica (the answer, a person's breath), both made here. D minor for Babylon's problem, F major once the law answers, D major at the end, every chord tuned pure; one urgent sound, the counter's clicks, from "its speed" to "shut the attackers out". Each effect (the plough, hooves, the cart, the silver, the rasp, the rope, keys, paper, a stamp, a lock, the gate, the rail, steps) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/what-an-agent-is/6-ethics-and-accountability/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, nothing beats, and only the counter pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/ethics-and-accountability.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/ethics-and-accountability/`, with the Spanish captions (as `captions.es.js`), and draws the poster, `site/assets/ethics-and-accountability-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/ethics-and-accountability/think.en.js` and `think.es.js`: it stops after `values`, `sorry` and `horns`, with one question each. The release workflow renders the video, `ethics-and-accountability.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
