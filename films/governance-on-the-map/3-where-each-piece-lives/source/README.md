# Rebuilding Where each piece lives

*Where each piece lives*, film 3 of 3 of *Governance on the map*, the second series on data governance, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, the master and reference data series' watercolour and its people in pencil and wash, and *Governance principles*' university: its rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`), in [`../../../data-governance/shared/src/`](../../../data-governance/shared/src/), bundled as they are. Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the opening story (`story`, for `tools/quiet.py`), the words the voice respells (Joseon, Jeonju, Yusuf, Noor), and the moment its poster shows (the two scholars keeping watch over Jeonju's copy, in the snow). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title card after the annals, and the end card). |
| `src/plan.js` | This film's places for the opening (prefixed `oh_` and `OH`), in watercolour, painted once and kept: a hall of the court in the morning, seen from beside the king's seat; the office that makes a reign's annals; the printers' room; the books laid in their chests; a road through the hills; Jeonju's archive, a raised hall inside its walls; a mountain path among pines, and in autumn; a cave's mouth at night, in summer and in snow; an archive high in the mountains, its books aired in the sun; a long shelf of the books, and a reader in a library today. The archives are also small views, pinned on paper like a map. Nothing on screen is in Korean or Chinese: writing is columns of marks too small to read, and the corner names the place. |
| `src/past.js` | The people of the opening: officials in long robes with round collars and the black hat with two flat wings, the historians in green at low desks, the office's members, the printers, the archive's keepers, the two scholars in white robes and wide black hats, the historian sent to air the books, and the reader today; their poses, and what they hold. |
| `src/annals.js` | What moves in the opening: the historians writing, the office and its printers at work, the books laid in their chests, the archives pinned on paper (smoke over three of them, a chest landing on each of the five, the gold lines from Jeonju's copy), the road in 1592, the scholars and the keepers carrying the chests up the mountain, the cave by night, the books aired in the sun, the shelf and the reader; and the same for data, a home and its copies. |
| `src/uni.js` | The university: the planner's desk in the Faculty of Business, the data team's room, Planning's room, the platform team's desk, Yusuf's desk from above and his office, Noor's room, the floor where the work is done; the table's page on the data platform (its owner's line, typed by hand), the planner's request and Jun's pile, the faculty's wall calendar, the request as Jun passed it on, the seven cards Yusuf writes, the rule's table, a product's owner and its copies, the night's check and what it puts right, the sheet on Yusuf's board, and the six cards for the next series. Words near the frame's edge fade as a card's block, so the frame never cuts one. |
| `src/map.js` | Noor's map, close: its application band, with the seven places as cards and the pieces each holds as chips (a home solid, with a house mark at its corner; a copy dashed), the three tools that read the glossary, and the flows between them, one way each, with one arrowhead; the arrow back from the platform, stopped with a cross; a pen at each home and an eye at each copy. |
| `src/scenes.js` | The seven chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 7, with *Next: Governance you can use* under it. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in the series' words: *hogar* for a piece's home, *copia*, *en un solo sentido* for one way, *desviarse* for drift, and *un control* for a check. |
| `tools/score.py` | The film's music and sounds: a harpsichord and a clavichord, made here, the harpsichord on its softest stop and low in its range. The harpsichord plays each thing at its home, and the clavichord copies it, a moment later and further away, note for note. In the opening (D minor, coming to D major as the five sets reach the mountains) the historians' writing is the home's figure and each archive's copy answers it, until three fall silent as their archives burn; at the university (B-flat major) the planner's request is a two-note call left unanswered, the page typed by hand plays the owner's phrase one note off until the morning's sync, and on Noor's map each flow plays forward, never back. Every note is tuned pure, from D, and nothing pulses or trembles; the whole score is low-passed last, below about 2.5 kHz. Each effect (brushes, a printing block, books in chests, pins, wind, far fire, footsteps, a small fire at night, keys, cards, a pen, a click as a name changes) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs the series' tool (`../../../data-governance/shared/tools/run.py`) on this film: *Governance principles*' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/governance-on-the-map/3-where-each-piece-lives/source/`:

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
python tools/render.py --workers 4   # dist/where-each-piece-lives.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start (the score stops instead). `python ../../../data-governance/shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

A new place is painted once, when the film starts (`prepAssets`): a painter that throws there keeps `render.html` from ever being ready, so `check.py` and `stills.py` time out without saying why. Try a new place on its own first, in the page's console.

`legible.py --overlaps` lists one moment that is right as it is: as the title card comes in at the end of chapter 1, its veil covers the words of the last shot behind it, which the check can't see.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/where-each-piece-lives/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/where-each-piece-lives-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/where-each-piece-lives/think.en.js` and `think.es.js`: it stops after `nine`, `home` and `check`, with one question each. Progress is stored in the browser under `ld-where-each-piece-lives`. The release workflow renders the video, `where-each-piece-lives.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
