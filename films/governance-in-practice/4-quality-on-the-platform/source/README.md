# Rebuilding Quality on the platform

*Quality on the platform*, film 4 of 6 of the third series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, the master and reference data series' watercolour and its people in pencil and wash, and *Governance principles*' university: its rooms and the things in them, its people, and what a film needs before it starts (all in [`../../../data-governance/shared/src/`](../../../data-governance/shared/src/)). This series' own pictures, painted once for its six films, are in [`../../shared/src/tools.js`](../../shared/src/tools.js): files as paper sheets, a tool's page drawn as a form, the data team's board with the series' six cards, name cards and tags. Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files (the series' `tools.js` first), the word the voice respells (Yusuf), and the moment its poster shows (this morning: Clara at her desk, the scorecard on her screen with its one amber cell). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and five wordless moments: the fourth card on the data team's board becoming the title, the governance check turning green, the four places along the data's way lighting together, the alert crossing the campus to the learning team, and the end card. |
| `src/plan.js` | This film's pictures (prefixed `gq_` and `GQ_`): Planning's office, wide and close at Clara's desk, with the census numbers and where they go; Clara's line from *Off the shelf*; the night's log, with its red line and a card that asks whose data it is; the shared inbox, a year of the same warning; the survey; the census envelope; a check's card, with its owner, its dimension and its level; Sam's desk, and the tables monitoring watches; the scorecard and an owner's issue, as the Markdown the two scripts write; the learning team's office, close at Tom's desk, with its clock; the files the film opens, each line copied from the example project or its worked example (the owner by folder, the dimension by kind, the level and its decision, the clean-up in staging, the test on the source, the loading pipeline, credit points' tests); a pull request's checks; the data's way, with its four places to check; an email as typed; the loading pipeline, and the rows it keeps out; the badges, their *Quality* tab and their profile; the alert's flight across the campus; the platform's results, in the SQL editor and in the scorecard; the governance check's measures; and the data team's desk from above, for files that run the frame's whole width. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The nine chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: an accordion, one dry reed to a note, with no tremolo and no musette, and a steel-string guitar, fingerpicked, one string to a note, both made in the score, in G major, every chord tuned pure. The accordion plays under the opening story and after that only at a chapter's turn, under a moment on screen or in a wordless pause; the guitar's marks mean the same all through (two notes rising a third when a cell or a check turns green, a single low note when a check stops something going on, two notes falling a fifth when an issue or an alert reaches its owner). The series' mark, 1-5-4-8, plays at the title and the end. Nothing loops or pulses, and each effect (a knock, the air of a card lifting, keys at night, a tap, a page from the printer, paper, a pin, a pencil and its stroke, a highlighter, a card slid, a stamp) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs *Governance principles*' tool (`../../../data-governance/shared/tools/run.py`) on this film: that series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/governance-in-practice/4-quality-on-the-platform/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/quality-on-the-platform.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead). Seven lines are read differently from their captions (each number is said in words: "160" is "a hundred and sixty", "3.9" is "three point nine", and "the 19th" is "the nineteenth"), so a moment on those lines waits for a word of what the voice says. `python ../../../data-governance/shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/quality-on-the-platform/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/quality-on-the-platform-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/quality-on-the-platform/think.en.js` and `think.es.js`: it stops after `owner`, `where` and `watch`, with one question each. Progress is stored in the browser under `ld-quality-on-the-platform`. The release workflow renders the video, `quality-on-the-platform.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
