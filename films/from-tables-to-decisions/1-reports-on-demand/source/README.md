# Rebuilding Reports on demand

*Reports on demand*, film 1 of 3 of *From tables to decisions*, the third series of *Modern data basics*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' people and shots, and the module's look and tools in [`../../../data-that-moves/shared/`](../../../data-that-moves/shared/), whose [README](../../../data-that-moves/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `rd_` or `RD_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (Genie One's answer, A$1.84 million), the words the voice respells (Jun, AI, HR, Rohan, Desai, Nguyen, Linh), its opening story (`clock`), no chapter where the score may pulse, and `"logos": true` for the Databricks logo on the tools' pages. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number or a date says it in words (`say`), and shows the figures in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/rd_places.js` | London in 1936, in its own warm lamplight on the module's navy: the exchange, its switchboard of jacks and lamps and its clock on the wall; the operator, with her headset and rolled hair; the speaking clock's machine, its glass discs and its clock; Jane Cain, her waved bob, at a microphone; a watch; and a telephone dial. |
| `src/rd_tools.js` | Today's places, painted once in the map's cool light (Finance's office, Rohan's glass desk, and a tutorial room); Genie One's window, with Rohan's question, its answer, what it counted and the query it ran; a question's card and the week a report took; the fortnightly pay report and its retirement; the Genie Agent's window and its four pages (Data, Rules, Examples, Tests); the dashboard of the fortnightly figures, with its Ask Genie button, and who it's sent to; and a statement over a veil. The tools' pages are drawn at the level of architecture, with nothing on them naming a release status. |
| `src/scenes.js` | The five chapters, each a few shots. 1936's places are rooms of their own, so one dissolves into the next where the whole picture changes; on the map the camera glides on from shot to shot, and a new moment waits for the last to leave (`later:true`); *The questions that come back* opens on the map the chapter before ends on (`ag_cutInto`). The title card ends chapter 1 and the end card chapter 5. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: repeater gongs, the two coiled steel gongs a repeater clock strikes only when asked the time, made in the score; the mark, both struck once, as an answer comes. F major, D minor for the problem, tuned pure from F. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../data-that-moves/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/from-tables-to-decisions/1-reports-on-demand/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps where the shot changes
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/reports-on-demand.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/reports-on-demand/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/reports-on-demand-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/reports-on-demand/think.en.js` and `think.es.js`: it stops after `ask`, `context` and `back`, with one question each. The release workflow renders the video, `reports-on-demand.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
