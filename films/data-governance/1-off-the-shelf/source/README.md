# Rebuilding Off the shelf

*Off the shelf*, the opening film of the series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Yusuf Demir), and the moment its poster shows (the shelf). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the sign out ticked on the checklist and the title, the floor once everyone knows what to keep and who keeps it, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `os_`), in watercolour: 2008 (the operating room and its surgical team, the patient, the drip, the trolley and the count board; a hospital office's shelf of guidelines; a map of the world with the study's eight cities; the checklist on its clipboard, its boxes ticked as each step is confirmed; the card of deaths before and with the checklist); Yusuf's box, and the newest DMBOK on his desk, where the prologue leaves it; the shelf of binders, the score, the chart and the council's minutes; Planning's census screen, the draft submission, the reports' cards, Jun's glossary screen and his screen of rules, the registrar's manual and tent card; binder 12, open and closed, the sticky notes, the highlighters and policy 12's page; the answers on Yusuf's board, and the gold cards of what's worth keeping under them; the owners' decision cards on the glass, and governance's; the nine binders, Noor's architecture map and the cards on it for the films that draw governance as one model, and the cards for the films with the tools. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The nine chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a soft brass choir in D for the operating room before 2008 and F major for today, all through the story from history and then only at a chapter's turn, under a few moments and at the end; a low music box for the moments that land; and the series' mark, 1-5-4-8, on a horn at the title and the end. Nothing loops or pulses, and each effect (a knock, paper, a pencil, a binder drawn from its shelf, a cork pin, a rubber stamp) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | Checks the music keeps the series' rule: after the story from history, no more than half of any chapter, nothing held longer than 12 s, nothing that beats or pulses. Run it after `tools/audio.py`. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/1-off-the-shelf/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes and goes, and nothing in it beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/off-the-shelf.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start. `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/off-the-shelf/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/off-the-shelf-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/off-the-shelf/think.en.js` and `think.es.js`: it stops after `decides`, `for`, `runs` and `keep`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-off-the-shelf`. The release workflow renders the video, `off-the-shelf.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
