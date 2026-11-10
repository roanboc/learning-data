# Rebuilding A mandate, written and enforced

*A mandate, written and enforced*, film 7 of 7 of *From helper to colleague*, the third series of the module *AI agents in data work*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers (with its tools' logos), *A Sharper Sketch*'s scenes, and the module's own look in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/): the lab, its people, the agent, the cards, and the finishing pass ([`../../../what-an-agent-is/shared/README.md`](../../../what-an-agent-is/shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Anil Kurian, Anil, Jun, Noor, HR and "A I", as the series says them), its opening story's chapter, no urgent chapter, the tools' logos (`"logos": true`), and the moment its poster shows (the page being written). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the title card after the opening, and the end card). |
| `src/marks.js` | GitHub's mark, from GitHub's official logo pack, unaltered: the white Invertocat, drawn only on a graphite tile. Databricks' and dbt's come from *The Inner Life of Data*'s `logos.js`. Each is credited in `NOTICE.md`. |
| `src/world.js` | The film's places and small pieces (every name prefixed `wm_`): the lab by day and by night, one room, so the camera stays and only the light changes (Anil's desk and screen, the wall clock, test as an oak tray, production behind glass); the quiet wall, for the page, the map and the tools; the workload agent and its badge; the three tutors' contracts, each held twice; and the pills, tags, arrows and fades the chapters use. |
| `src/mandate.js` | The mandate and everything that holds it: the page and its lines, a line opened up, the tools' cards and tiles with their marks, the agent's report, the pull requests, the agent's model and its one-line fix, the switches, a table's versions, the map's notation and the stage list with the mandate's line, the folders of `governance/` and the file's first lines, the project's check, Europe's AI law, the fourteen nights, and the tutor who moved. |
| `src/stages.js` | The five stages and their gates, *Five stages, not a switch*'s `fs_stages`, copied whole under this film's prefix (`wm_stages`), so they keep that film's look, words and colours. If that film changes it before this one merges, it's copied again. |
| `src/close.js` | The series' close: its seven films and their lessons, four over three, and the module's road, its four series on an oak rail, the next still to come. |
| `src/scenes.js` | The six chapters, each a run of shots. In the lab and on the quiet wall the camera stays where it is: from shot to shot only what changes fades, and a picture that names what the last one showed somewhere else is a later moment (`later:true`); *Held in every tool* and *Alone in test, a draft in production* open where the chapter before ends (`ag_cutInto`); between the lab and the wall the whole picture changes, so the shot dissolves. The title card ends chapter 1, the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: drawn sound, after the Oramics machine, each wave and each note's loudness a line drawn by hand, and a bass trumpet in E flat only where a person signs, approves, decides or holds the switch; E flat major by day and C minor for the night, every note tuned pure from E flat. Music plays under the opening story, and after that only now and then; nothing pulses. Each effect (paper, a pen, a soft knock, a gear, a soft tap) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/from-helper-to-colleague/7-a-written-mandate/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints without holding the page, nothing shows twice, no arm jumps, nothing jumps in one room, nothing reaches past a person's picture
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, as low as the governance films', nothing beats, nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/a-written-mandate.mp4
```

`build.py` stops if two files declare the same top-level name, if a key is named twice in one object, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).

`tts.py` voices again only the lines whose words changed: it keeps each line's voice beside the words it was made from.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/a-written-mandate/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/a-written-mandate-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git, in the repository's audio store: `python site-tools/media.py index --film a-written-mandate-en` writes the film's `../audio.json`, which points at it by its checksum (`docs/maintenance.md`). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page, its Spanish chapter names, and the example project's files it links under *See it in the project*). "Pause and think" is `site/assets/a-written-mandate/think.en.js` and `think.es.js`: it stops after `page`, `held` and `alone`, with one question each. Progress is stored in the browser under `ld-a-written-mandate`. The release workflow renders the video, `a-written-mandate.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
