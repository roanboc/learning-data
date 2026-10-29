# Rebuilding The marketplace

*The marketplace*, film 6 of 6 of the third series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, the master and reference data series' watercolour and its people in pencil and wash, and *Governance principles*' university: its rooms and the things in them, its people, and what a film needs before it starts (all in [`../../../data-governance/shared/src/`](../../../data-governance/shared/src/)). This series' own pictures, painted once for its six films, are in [`../../shared/src/tools.js`](../../shared/src/tools.js): files as paper sheets, a tool's page drawn as a form, the data team's board with the series' six cards, name cards and tags. Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files (the series' `tools.js` first), the words the voice respells (Ontos and OpenSharing), and the moment its poster shows (the shop window in the opening, a request card beside it, "why" and "until"). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a date says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the sixth card on the data team's board becoming the title, and the end card, the series' last, held long enough for the series' mark to play whole. |
| `src/plan.js` | This film's pictures (prefixed `gk_` and `GK_`): Anil's screen with next semester's places; the certificate's four units, the last a placement in a hospital, and a calendar; learners as plain shapes, each with a bar of credit, never a face or a name; the emails across the campus, and the copy that came back, its codes in pale plum, beside the census report; the place cards; the inbox, with nobody's yes and no end date; a shop window on a street, its six products as tiles with their owners, and a smaller one, locked, for the private exchange; the catalogue's pages drawn as forms, from Ontos's user guide and workflows (the marketplace, a product's page and its contract, the request, the owner's approval, the reminder, the readers); the platform's table page, its request button and its permissions; the small key on a ring, its tag dated in its owner's words; the university's directory, a card index on the platform team's wall, as *Governed in Unity Catalog* drew it; Planning's office, close at Clara's desk, as *Products in open formats* drew it; the exposure's file and the impact check's report; the sharing page, the partner's window, and a partner university far off; and the data team's desk from above, for papers that run the frame's width. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The nine chapters, each a few shots cut together with short dissolves; shots in a row in the same place share one camera (`gk_run`). The title card ends chapter 1, the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a hammered dulcimer, one steel string to a note, struck softly with felt hammers and damped, and two cup-muted trumpets, low and quiet, that answer it, both made in the score, in A major, every chord tuned pure. The two play under the opening story and after that only at a chapter's turn, under a moment on screen or in a wordless pause; the marks mean the same all through (a request, two notes rising on the dulcimer; the owner's yes, the trumpets' soft third; the key with a date, one trumpet note held, which ends without a fall; the shop window, the dulcimer's figure across its range). The series' mark, 1-5-4-8, plays at the title, and both play it whole under the end card. Nothing loops or pulses, and each effect (a knock, a breath of air as something crosses the frame, keys, a tap, paper, a pin, a pencil and its stroke, an email's whoosh, an envelope opened, a card into a tray, a stamp, a small key on its ring, a drawer) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs *Governance principles*' tool (`../../../data-governance/shared/tools/run.py`) on this film: that series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/governance-in-practice/6-the-marketplace/source/`:

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
python tools/render.py --workers 4   # dist/the-marketplace.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead). Two lines are read differently from their captions ("the 31st of January" is "the thirty-first of January"), so a moment on those lines waits for a word of what the voice says. `python ../../../data-governance/shared/tools/cues.py` lists them on their own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/the-marketplace/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/the-marketplace-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/the-marketplace/think.en.js` and `think.es.js`: it stops after `read`, `key` and `outside`, with one question each. Progress is stored in the browser under `ld-the-marketplace`. The release workflow renders the video, `the-marketplace.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
