# Rebuilding A platform that watches itself

*A platform that watches itself*, film 2 of 2 of *Data as software*, the second series of the module *Modern data basics*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts, logos and voice model, *A Sharper Sketch*'s `scene()`, the agent films' shots and people ([`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/)), and the module's look and tools in [`../../../data-that-moves/shared/`](../../../data-that-moves/shared/), whose [README](../../../data-that-moves/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `pw_` or `PW_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (Genie ZeroOps's inbox, a second into "By morning"), the words the voice respells (Noor, Jun, AI, HR, Linh Nguyen, MIT, ZeroOps), its opening story (`alarm`), no chapter where the score may pulse, and `"logos": true` (Databricks and GitHub). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. Where the voice says a number or a time in words (`say`), the caption keeps the figures. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/pw_apollo.js` | Apollo 11, 20 July 1969, drawn in the module's night: the Moon below and the Earth in the black sky (`pwSpace`), the lunar module drawn anew with no flag, insignia or agency mark, its descent and the dust it lifts; the panel round its display and keyboard (`pwPanel`), with the PROG light, the registers and the code 1202; Mission Control from the back of the room (`pwHouston`) and the guidance console (`pwConsole`), with the guidance officer, a composite of 1969 named by role; and the computer's work in a cycle of its time, which keeps the steering and the display when it starts again. |
| `src/pw_night.js` | The night on the platform map, and the morning after: the map's parts (the claims app on Lakebase with its hours and its contract, the platform with the claims job and its two tasks, the payroll system, payroll's export and casual teaching cost, the owners' names); Genie ZeroOps's page, with what it watches, its insight in four steps (the failed task, the lineage traced from it, what it touches, the fix) and its inbox; the morning (`pwMorning`); the confirm card and the branch; the pull request with GitHub's mark; the agent's card; pay day; the decision; and Apollo 11 again, the two systems and the document between them, and the descent checklist. |
| `src/scenes.js` | The six chapters, each a few shots. The map is one room from the job's failure to the agent's inbox (chapters 2 and 3 join on a glide), and the night of the last two chapters is one room too: there the camera glides on, and a new picture waits for the last one to leave. Between rooms it cuts, or dissolves where the whole picture changes. The title card ends chapter 1 and the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a terpsitone, the platform that senses, and a second, lower terpsitone, the people who decide, sounding only where a person decides, reviews or approves. B-flat major, G minor for what goes wrong, tuned pure from B flat; no urgent pulse. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../data-that-moves/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/data-as-software/2-a-platform-that-watches-itself/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, no word under 28 px, every place paints in time, nothing shows twice or jumps, and people stay inside their pictures
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/a-platform-that-watches-itself.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/a-platform-that-watches-itself/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/a-platform-that-watches-itself-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/a-platform-that-watches-itself/think.en.js` and `think.es.js`: it stops after *Watching overnight*, *A person approves* and *The contract first*, with one question each. The release workflow renders the video, `a-platform-that-watches-itself.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The film's night is in the example project too: [`examples/the-night-the-claims-job-failed/`](../../../analytics-engineering/project/examples/the-night-the-claims-job-failed/) tells it, with the fix and the pull request a person approved.
