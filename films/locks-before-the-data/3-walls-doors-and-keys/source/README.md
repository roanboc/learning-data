# Rebuilding Walls, doors and keys

*Walls, doors and keys*, film 3 of 9 of *Locks before the data*, the first series of the module *Data protection and privacy*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, the agent films' kit, and the module's own look, *Night glass*, in [`../../shared/`](../../shared/): the hall of frosted panes, its people lit at night, the cards, pills and sealed cards, and the tools ([`../../shared/README.md`](../../shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Okafor, Jun, "A I", HR, Mrkan and Cavtat), its opening story's chapters (`gates`, `apart`), its one urgent chapter (`inside`, where the intruder walks the hall), and the moment its poster shows (the hall with Sam, as Sam walks the attacker's path once more). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the two wordless moments (the title card after the opening, and the end card). |
| `src/wd_city.js` | Ragusa in 1377 (prefixed `wd_`, as all of this film's own pieces), painted once in the module's night light: the walled city from the sea at dusk, at night and at dawn, a gate from the quay, the street up to the rector's palace, the Great Council's hall, the table where the law is sealed, and the coast as a frosted map; and what moves over them, drawn live: ships, the gates' light and doors, small people with their loads and lanterns, the haze of the sickness, the moons of the month apart. |
| `src/wd_hall.js` | The university's hall: the platform's block of clear glass, its room or rooms, the five areas' panes, the catalog's ring, the side door, storage, the doors, the corridor from the university's network, the provider's case and the university's vault, the copies and their place apart, the board and the map, and the state of each chapter (`wd_state`). Names round the block fade out over the last 44 px before the frame's edge, so the camera never cuts a word in half. |
| `src/scenes.js` | The nine chapters, each a run of shots. The hall is one room: *If someone got in*, *Who secures what*, *Few doors* and *The walk again* open where the chapter before ends (`ag_cutInto`), gliding on in the hall, or cutting from the hall to the board in its corner. The title card ends chapter 2, the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a douçaine, the soft reed of the 1300s, and two soft timpani tuned to D and A, made here. D Dorian for Ragusa, its flat sixth for the plague, every note tuned pure from D; the film's mark, D, F, A, one note for each gate as it lights, then E, left open. Music plays under the opening story, and after that only now and then; the one pulse is in *If someone got in*. Each effect fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py`, `check.py`, `contrast.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/locks-before-the-data/3-walls-doors-and-keys/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every word reads on a phone and stands out from what's behind it, every place paints without holding the page, nothing shows twice, no arm jumps, nothing jumps in one room, nothing reaches past a person's picture
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, as low as the governance films', nothing beats, the pulse only where the film is urgent
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/walls-doors-and-keys.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/walls-doors-and-keys/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/walls-doors-and-keys-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack lives outside Git, in its own audio release: after a new mix, `python site-tools/media.py index --film walls-doors-and-keys-en` from the repository's root writes the film's `audio.json`, and the release is published and checked as [docs/maintenance.md](../../../../docs/maintenance.md) says; `python site-tools/media.py fetch` brings it back on a fresh clone. Then run `python site-tools/build_series.py`: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names, by chapter id). "Pause and think" is `site/assets/walls-doors-and-keys/think.en.js` and `think.es.js`: it stops after `who`, `doors` and `copies`, with one question each. Progress is stored in the browser under `ld-walls-doors-and-keys`. The release workflow renders the video, `walls-doors-and-keys.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
