# Rebuilding Moving is easy, agreeing is the work

*Moving is easy, agreeing is the work*, film 1 of 3 of *Data that moves*, the first series of the module *Modern data basics*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../shared/`](../../shared/), whose [README](../../shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `mv_` or `MV_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the HR system's contract, at its fourth part, what's personal), the words the voice respells (Jun, HR, Linh Nguyen, Noor, Rohan Desai, Hohpe, Albury), its opening story (`gauge`), no chapter where the score may pulse, and `"logos": true` for Databricks', dbt's and Microsoft Fabric's marks. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number or a code says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/rail.js` | The opening's world, drawn as a railway diagram in the module's night: the Murray River between Victoria and New South Wales, the line from Melbourne on its gauge (1,600 mm) across the 1883 bridge to Albury's long platform, the line from Sydney on the other (1,435 mm), the trains that met there and everything lifted from one to the other, the gauge seen end-on with its 165 mm, and in 1962 the line built to one agreed gauge, in gold, that every train runs straight through. |
| `src/world.js` | The university's side: the module's platform map composed for this film (the HR system and the finance system on the left, the platform with bronze and the ledger read in place, and who reads on the right: Microsoft Fabric, a partner, an app), the five ways between them, the file that once went to Finance, the four things that used to take whole teams, the tools' pages drawn for the film (Lakeflow Connect's managed connector, Fabric's mirrored catalog, the dbt tests), the HR system's contract and its four parts, and the wheel of the close. |
| `src/scenes.js` | The five chapters. The railway at Albury is one room and the university's map another: in each, the camera glides from one framing to the next and what changes fades, and *Five ways to move it* runs on into *The work that's left*. The title card ends chapter 1 and the end card chapter 5. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: steel reeds sung by electromagnets, as in the harmonic telegraphs of the 1870s, each railway and each way data moves on its own pitch; and their partner, the receiver's reeds, an octave or two lower, which answer only the pitch their sender agreed. The mark: two reeds a little apart, then tuned to the same note, and only then does a phrase pass from one to the other. D major, B minor for the break of gauge and the file that took two days, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/data-that-moves/1-moving-is-easy/source/`:

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
python tools/render.py --workers 4   # dist/moving-is-easy.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, or a word the voice respells in `film.json`, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/moving-is-easy/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/moving-is-easy-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the official docs the film hands over to. "Pause and think" is `site/assets/moving-is-easy/think.en.js` and `think.es.js`: it stops after `promise`, `ways` and `contract`, with one question each. The release workflow renders the video, `moving-is-easy.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The contract the film shows is in the example project, [`films/analytics-engineering/project/examples/hr-system-interface/`](../../../analytics-engineering/project/examples/hr-system-interface/): the HR system's data contract, written by hand in the Open Data Contract Standard and valid against the version the project pins. The tests that check it are the project's own, on the HR system's staging models (`models/staging/hr_system/_hr_system__models.yml`).
