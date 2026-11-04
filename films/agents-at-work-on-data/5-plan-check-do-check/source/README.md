# Rebuilding Plan, define the check, do, check

*Plan, define the check, do, check*, film 5 of 9 of *Agents at work on data*, the second series of the module on AI agents in data work, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, and the module's look and tools in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/), whose [README](../../../what-an-agent-is/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `pc_` or `PC_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the parade, the bottles raised), the words the voice respells (Jun, Noor, Mei, AI), its opening story (`water`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year or a number says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the answer taking its tick and becoming the title card, and the end card. |
| `src/past.js` | Singapore, 1998 to 2003, painted once in the module's matte style, lit from the right: the island city across the water, with rain; the map of the island, the strait and the two pipes; a street cut through, from a sink to the plant; a kitchen of the time; the test plant, with the list of 190 measures and a bottle filled to its mark; the panel at its long table; the stadium at the parade, its crowd from behind and the bottles raised; a reservoir; and today's lab bench. Water is a pale sea-glass green and the rain a pale grey, neither one of the module's meaning colours. Nobody is a likeness, and the bottles have no label. |
| `src/plan.js` | The room's pieces, in the module's colours: Jun at his desk, the four steps across the top, the one-page plan and its rows, the two test cards with their locks, the count by level, the agent's three read-only tools and its arms, the web and its pages for *The long way*, a clock, the four steps on an oak ring, the shelf where what the loop leaves is kept, and the card the count goes into, "To the government". The pull request, its evidence and the pane of glass are the module's own. |
| `src/scenes.js` | The eight chapters, each a few shots cut together, a dissolve only where a shot adds a veil and a card. The title card ends chapter 1 and the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: tuned bottles, blown across the neck, each filled with water to a mark before it's played, and a contrabassoon that answers a bottle's note two octaves down where a person holds the work to its mark. The film's mark is a pour up to the line, the note it sets, then the answer. F-sharp major, D-sharp minor for the problems, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/agents-at-work-on-data/5-plan-check-do-check/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice in a dissolve, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/plan-check-do-check.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/plan-check-do-check/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/plan-check-do-check-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/plan-check-do-check/think.en.js` and `think.es.js`: it stops after `long`, `define`, `do` and `check`, with one question each. The release workflow renders the video, `plan-check-do-check.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
