# Rebuilding Who is it, really?

*Who is it, really?*, film 1 of 9 of *Locks before the data*, the first series of the module *Data protection and privacy*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, and draws with the module's kit, *Night glass* ([`../../shared/`](../../shared/README.md)), whose README says how a film uses it.

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the line on what the colours mean, its own source files, the poster's moment (the commander's list, a cross for the messenger and a tick for the match), the words the voice respells (Jun, AI, HR, Okafor, Mei, Qin, Zhao, Handan, Wei, Xinling, Jin Bi, Xi'an, NIST's and `registrar-loader`), the opening story (`story`: *Two halves* and *When the halves match*) and no chapter where the score may pulse (`urgent` is empty). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line's `say` is what the voice reads where it differs from the caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The longer pauses after a line (`hold`), where a picture needs a moment, and the two wordless moments: the title card after the opening story, and the end card. |
| `src/wi_past.js` | The opening's pictures, prefixed `wi_`: the places, painted once (the road between a capital and an army on its border, Handan under siege, a commander's tent, a king's rooms, the tally's table, a museum's room in Xi'an, the road near the camp); the bronze tiger and its two halves, parting and fitting together, its inlay drawn as strokes too small to read; the bamboo slips, fires and torches; and the people of the time, dressed from the period's own evidence (the script's rigour sheet). |
| `src/wi_hall.js` | The pictures of the chapters at the university, in one hall, so the camera glides from one moment to the next: glass discs round a person, a job's gear or the agent, lists of checks, the platform, the wall round the network, the 41 who could read the learner table, the confidentiality agreement and its six lines, and a request. |
| `src/scenes.js` | The eight chapters, each a few shots under a slow camera, gliding on in one room and cut between rooms (where the tiger would show twice across a change of place, it cuts). The title card ends chapter 2, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line: *la tarja* for the tally, *el proceso* for the nightly job, *entrar* for signing in, *el permiso* for a right, *el rol de carga* for the loader role, *confianza cero*. |
| `tools/score.py` | The film's music and sounds: a crwth, the bowed lyre of Wales, whose paired strings sound each note with its octave twin, and a regal, the small reed organ of the 1500s, both made here. G major, E minor for the problem, tuned pure from G. The mark is one note split into its two strings, then bowed together, where the halves match and where a request proves who it is. Every sound is timed by the same word as its picture. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py`, `check.py`, `contrast.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/locks-before-the-data/1-who-is-it-really/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame draws; text size and contrast, places, dissolves, arms, jumps and people's edges
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/who-is-it-really.mp4
```

`build.py` stops if two files declare the same top-level name, if a key is named twice in one object, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/who-is-it-really/`, with the Spanish captions (as `captions.es.js`), and draws the poster, `site/assets/who-is-it-really-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack's pointer is `../audio.json` (`python site-tools/media.py index --film who-is-it-really-en`). Then run `python site-tools/build_series.py` from the repository's root.
