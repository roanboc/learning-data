# Rebuilding Read by an agent

*Read by an agent*, film 3 of 4 of *Quality as a habit*, the second series of the module *Data quality*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../../fit-for-use/shared/`](../../../fit-for-use/shared/), whose [README](../../../fit-for-use/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `ra_` or `RA_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the agent's answer, 412), the words the voice respells (Jun, Mei, Malia Fonoti), its opening story (`cupertino`), no chapter where the score may pulse, and `"logos": true` for Databricks' and dbt's marks. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year or a date says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/ra_places.js` | The opening's two places, painted once in the module's way: an office of about 2000 (a pale plaster wall, a window with a venetian blind, a beige monitor of the time on a beech desk, no maker's name or mark anywhere) and the same desk seen from above, where the opening's papers lie. The university's places are the module's: the bench and the bench from above. |
| `src/ra_props.js` | The film's own pictures: the page on the office's monitor, with the checker's red wavy line, its plain menu of offered words, the mouse pointer of the time and the word being swapped in place; the checker's word list, printed on continuous paper, its missing word a dashed box; a printed page with one real line; many small web pages, each with its Cupertino; the graduations team's agent's page, with Malia's question and its answer in violet; and a column's description, row by row. |
| `src/scenes.js` | The seven chapters. The opening cuts between the office and its desk; the university's chapters are one room, the bench, where the camera glides on from shot to shot and from chapter to chapter (`ag_cutInto`), and a later moment there lets what was there leave first (`later:true`). The agent is one sphere, always in one place over the bench (`RA_AG`); Genie Code, in chapter 5, is a sphere of its own. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: the pulse tones of an early stored-program computer, as the first computers played tunes in 1950 and 1951, playing the checker and the agent, what they offer, as written; and their partner, the machine's own second voice, the same tones an octave lower and filtered round, which plays only after the first voice has and a person has read it. The mark: a short phrase with one wrong note, left hanging, then played right by the second voice; the machine plays it right itself only at the agent's 38. C major, A minor for the problem. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../fit-for-use/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/quality-as-a-habit/3-read-by-an-agent/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/read-by-an-agent.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/read-by-an-agent/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/read-by-an-agent-poster.jpg`, at the moment `film.json` names. The soundtrack stays out of Git: `python site-tools/media.py index --film read-by-an-agent-en` writes the film's `audio.json`, and the audio is published to its own release before the pointer is merged ([docs/maintenance.md](../../../../docs/maintenance.md), *Add or replace audio*). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the standard and the official docs the film hands over to. "Pause and think" is `site/assets/read-by-an-agent/think.en.js` and `think.es.js`: it stops after `empty`, `proposes` and `before`, with one question each. The release workflow renders the video, `read-by-an-agent.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

What the film shows is in the example project, [`films/analytics-engineering/project/`](../../../analytics-engineering/project/): the paper form at its source (`data/student_system/graduation_applications.csv`), `name_confirmed_how` and the descriptions in Mei's words on the graduation list (`models/marts/graduations/`), the two checks Genie Code proposed and people kept (`tests/rules/`), Malia's weekly count (`mart_graduations__names_to_confirm`), and the worked example, with the Genie Agent's set-up, in [`examples/read-by-an-agent/`](../../../analytics-engineering/project/examples/read-by-an-agent/).
