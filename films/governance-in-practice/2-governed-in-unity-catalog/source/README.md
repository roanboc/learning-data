# Rebuilding Governed in Unity Catalog

*Governed in Unity Catalog*, film 2 of 6 of the third series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, the master and reference data series' watercolour and its people in pencil and wash, and *Governance principles*' university: its rooms and the things in them, its people, and what a film needs before it starts (all in [`../../../data-governance/shared/src/`](../../../data-governance/shared/src/)). This series' own pictures, painted once for its six films, are in [`../../shared/src/tools.js`](../../shared/src/tools.js): files as paper sheets, a tool's page drawn as a form, the data team's board with the series' six cards, name cards and tags. Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files (the series' `tools.js` first), the words the voice respells (Yusuf, Mei, Noor), and the moment its poster shows (Clara's query, with stars where the names and emails are). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the second card on the data team's board becoming the title, and the end card. |
| `src/plan.js` | This film's pictures (prefixed `gc_` and `GC_`): the platform team's room and Sam's line from *Off the shelf*; the old path, on Yusuf's desk; the learner table's page on the platform, drawn as a form (its sample data, columns, grants and lineage); the forty-one names, gathering into groups; the catalog as a cabinet of drawers, one policy over it, and tomorrow's table; the Discover page's areas; the files the film opens, each line copied from the example project (the learner table's YAML and its classes, the post-hook and the macro that tags each column, the wallet's email); the governed tag and its three values; the classifier's suggestion; the policy's page; Clara's and Mei's queries; the machine that scrambles a student number, and the registrar's list; Planning's list; Clara's request, and Mei's yes; the university's directory, a card index on the wall; the check's message; the audit log and the access review; and Noor's map. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The nine chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: low brass, a tuba, a euphonium and a tenor horn, one player to a note and no vibrato, and bowed crotales, both made in the score, in E-flat major, every chord tuned pure. The brass plays under the opening story and after that only at a chapter's turn, under a moment on screen or in a wordless pause; the crotales' marks mean the same all through (one note when a tag reaches its column, a rising fifth when the policy covers a table, a falling step when someone's access ends), and the tuba says no when a value is refused or the check stops a table. The series' mark, 1-5-4-8, plays at the title and the end. Nothing loops or pulses, and each effect (keys, paper, a tap, a pencil, a highlighter, a card, a tag's string, a band of stars, a padlock, a tick, a pin, a signature) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs *Governance principles*' tool (`../../../data-governance/shared/tools/run.py`) on this film: that series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/governance-in-practice/2-governed-in-unity-catalog/source/`:

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
python tools/render.py --workers 4   # dist/governed-in-unity-catalog.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead). Two lines are read differently from their captions ("15 December" is said "the fifteenth of December"), so a moment on those lines waits for a word of what the voice says. `python ../../../data-governance/shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/governed-in-unity-catalog/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/governed-in-unity-catalog-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/governed-in-unity-catalog/think.en.js` and `think.es.js`: it stops after `tag`, `key` and `groups`, with one question each. Progress is stored in the browser under `ld-governed-in-unity-catalog`. The release workflow renders the video, `governed-in-unity-catalog.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
