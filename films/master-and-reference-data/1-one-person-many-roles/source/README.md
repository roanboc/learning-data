# Rebuilding One person, many roles

*One person, many roles*, the opening film of *The same one, everywhere* (a working title), is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, *In the weeds of data crafting*'s motion helpers, *The map before the data*'s people and ArchiMate glyphs, and the series' own watercolour in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Nguyen, Linh, DAMA, HR), and the moment its poster shows (the person, her roles, her contact points and her identifiers, drawn apart). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). Two lines carry a `say`, so the voice reads their years as years: "sixteen eighty-six" and "nineteen forty-seven". The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the two parish books side by side, then the title; the four lanes, settled; and the end card). |
| `src/plan.js` | This film's places and pictures (prefixed `m1_` and `M1_`): the parish in 1686 and the campus today (`m1_parish`, `m1_campus`), plain paper for the chapters that explain (`m1_plain`), Noor's office (`m1_office`); the parish books, the quill, the moving certificate and the walker on the road (`m1_book`, `m1_quill`, `m1_cert`, `m1_walker`); the 1947 card and its stamp (`m1_card47`, `m1_stampOn`), which stamps her new student number too; Linh's five records, blank until each is named, joined to her by lines, and the rings that point at their numbers and notes (`M1_REC`, `M1_RECI`, `m1_rec`, `m1_blank`, `m1_toLinh`, `m1_ringId`, `m1_ringNote`); her application and the alumni office's email, as they are in chapter 3 and as they end (`m1_app`, `m1_mail`); her roles in July 2025, for the end (`m1_july`); the shelves of the kinds of data, their lists and slips (`m1_shelf`, `m1_list`, `m1_slip`, `m1_term`); Linh as the person (`m1_person`); the university's model, the learner's keys and the decision card (`m1_map`, `m1_keys`, `m1_decision`); the actor and its roles in ArchiMate's notation (`m1_ea`); the inventory of who keeps what (`m1_keeps`); the industries (`m1_panel`, `m1_ind`, `m1_wall`, `m1_meter`, `m1_heart`); DAMA's wheel and the four ways to keep master data (`m1_wheel`, `m1_wedge`, `m1_style`); the gallery and the four questions (`M1_GAL`, `M1_QS`, `M1_EX`); and the series in four parts on one line (`m1_part`, `m1_film`). |
| `src/scenes.js` | The twelve chapters. The title card ends chapter 1, the end card chapter 12. The camera moves in on whatever the narration is about, and things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds, a new palette that follows the watercolour: chords that bloom note by note, like paint on wet paper; a clarinet for the series' mark (1-8-5-1); a plucked cello note for each role, the same in every chapter; a bowed D and A for the person; from D minor in 1686 to D major at the end. The chords play under the opening's story (the chapters `film.json` lists in `story`), and after that only from time to time, one voice to a note, with no pulse, as the series decided on 20 October 2026. Each effect (a quill or a pencil, a wet brush, paper, a stamp, a few muffled keys) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/master-and-reference-data/1-one-person-many-roles/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone (28 px or more in the frame), and none may overlap
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # after the opening, the music comes in from time to time, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/one-person-many-roles.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/one-person-many-roles/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/one-person-many-roles-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its pages and its Spanish chapter names). "Pause and think" is `site/assets/one-person-many-roles/think.en.js` and `think.es.js`: it stops after `five`, `apart`, `keeps` and `entities`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-one-person-many-roles`. The release workflow renders the video, `one-person-many-roles.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
