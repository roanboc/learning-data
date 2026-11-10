# Rebuilding Scripts became software

*Scripts became software*, film 1 of 2 of *Data as software*, the second series of the module *Modern data basics*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts, logos and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/), and the module's look, people, cards and tools in [`../../../data-that-moves/shared/`](../../../data-that-moves/shared/), whose [README](../../../data-that-moves/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `sb_` or `SB_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the bridge of 1950, tested before it was built), the words the voice respells (Jun, AI, HR, Noor, Rohan, Desai, Farquharson), its opening story (`gertie`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with numbers says them in words (`say`), and shows the figures in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/sb_bridge.js` | The opening: the Tacoma Narrows at dusk, painted once (`sbNarrows`), with its hills, water and wooded banks; the bridges of 1940 and 1950 (towers, cables, lamps, the thin plate-girder deck and the deep truss), the deck's gallop and twist, its middle tearing into three pieces that fall and meet the water; the wind; the splashes; the wind tunnel with its fan and a model of each deck on springs; Frederick Farquharson, drawn as a man of the 1940s; and the two rows of a practice taken up from next door (wings, then bridges; software, then data work). |
| `src/sb_work.js` | The data story: the laptop and its script, the envelope, payroll's rule, HR's calendar of pay days, the test at the rule's edge, the GitHub window with the project's files and history, a pull request with its checks, review and merge (an agent's too), a branch, a file such as `databricks.yml`, a stage on the road to production, and the runs of the job. |
| `src/scenes.js` | The seven chapters, each a few shots. On the map the camera glides on from shot to shot, and a new picture waits for the last one to leave (`later:true`); between the Narrows, the tunnel and the map it cuts. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: two ophicleides, the lead low and soft and the partner an octave higher reading the same part; the mark played once a little uneven by one player, then by both, note for note. G major, E minor for the problem, tuned pure from G. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../data-that-moves/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/data-as-software/1-scripts-became-software/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice, nothing jumps, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, held notes keep their level, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/scripts-became-software.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/scripts-became-software/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/scripts-became-software-poster.jpg`, at the moment `film.json` names; after a change to the pictures alone, `python tools/publish.py --keep-sound`. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/scripts-became-software/think.en.js` and `think.es.js`: it stops after `laptop`, `project` and `release`, with one question each. The release workflow renders the video, `scripts-became-software.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
