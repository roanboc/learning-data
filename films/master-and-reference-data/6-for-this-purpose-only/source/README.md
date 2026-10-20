# Rebuilding For this purpose only

*For this purpose only*, the sixth film of *The same one, everywhere* (a working title), is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, *In the weeds of data crafting*'s motion helpers, *The map before the data*'s people, and the series' own watercolour in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Charaka Samhita, Nguyen, Linh, Mei, Jun), the moment its poster shows (the end of chapter 5: Linh's no on her as the person, and her four doors, each with its purposes and a latch from her wish), and the opening's story (`story`: chapter 1), where the music may play throughout. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). Three lines carry a `say`, so the voice reads their numbers in words: "twenty twenty-two", "two thousand, one hundred and forty" and "thirty-seven". The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the road, the closed door and its light, then the title; the appeal's numbers; and the end card). |
| `src/past.js` | India, about two thousand years ago (prefixed `m6_` and `M6_`): the plain, the teacher's shelter under a banyan and its brick fire altar (`m6_ashram`, `m6_altar`, `m6_fire`); the village street, its house, its door and the lamplight inside (`m6_village`, `m6_house`, `m6_houseDoor`, `m6_windowGlow`, `m6_inside`); the teacher, the student who becomes a healer and the woman next door, dressed after Indian sculpture of the period (`m6_old`, `m6_oldBody`), whose feet fall in step with their footsteps; and the palm-leaf book and its oath (`m6_book`, `m6_leaf`, `m6_board`, `m6_cloth`, `m6_oath`). |
| `src/plan.js` | This film's places and pictures of today (prefixed `m6_` and `M6_`): the campus, the plains and the registrar's office (`m6_campus`, `m6_plain`, `m6_plainB`, `m6_office`, `m6_place`), a veil of paper (`m6_hush`) and Linh as the person (`m6_person`); each role's record, its values behind a door in the role's colour with its purposes on a tag (`m6_rec`, `m6_door`, `m6_doorLeaf`, `m6_frame`; a door's face is kept as a picture, so it swings as the same door), the pencil latch and rings (`m6_latch`, `m6_ring`) and the slip a request holds up when it knocks (`m6_ask`); her wish, a note that moves from her alumni record to her (`m6_note`, `m6_wish`); the appeal, the results it takes, the list and the email (`m6_appeal`, `m6_results`, `m6_list`, `m6_email`, `m6_rec3`); the list of purposes and the pencil rail under the records (`m6_purposes`, `m6_rail`); the model's YAML and the policies' cards, and the test (`m6_code`, `m6_test`); the table as the appeals team sees it, the appeal's count and its list (`m6_table`, `m6_count`, `m6_alist`); her request, the four offices' searches, her records and the answer (`m6_request`, `m6_search`, `m6_rec8`, `m6_answer`); and the industries' panels and who asks there (`m6_panel`, `m6_asker`). A card that grows a row at a time keeps one picture per size, not one per frame (`m6_panelH`). |
| `src/scenes.js` | The ten chapters. The title card ends chapter 1, the end card chapter 10. The camera moves in on whatever the narration is about, except in chapter 8, and things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds, a new palette: a string section holds the chords, bowed softly, every note starting together and swelling slowly; a harp plucks each role on its note in the series, so a door rings its role's note when it arrives or opens; a horn, softly, plays the person's D and the A above whenever Linh stands in white paper; the clarinet carries the series' mark (1-8-5-1); from E minor by the fire to E major at the end. The strings play under the opening (the chapter `film.json` lists in `story`); after it, music comes in only at each chapter's turn, under a moment on screen and on the end card, never as a bed under the voice, and nothing has a vibrato or a pulse, as the series decided on 20 October 2026. The A that the horn and the harp play with the person's D is a pure fifth above it, so the two don't beat. Each effect (a book's board, the fire, footsteps, a latch, hinges and a knock, cards and tags, a pencil, a few muffled keys, drawers, a phone) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. A word the score times a sound by must be in its line, or the mix stops. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/master-and-reference-data/6-for-this-purpose-only/source/`:

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
python tools/render.py --workers 4   # dist/for-this-purpose-only.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/for-this-purpose-only/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/for-this-purpose-only-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its pages and its Spanish chapter names). "Pause and think" is `site/assets/for-this-purpose-only/think.en.js` and `think.es.js`: it stops after `wish`, `wishes`, `platform` and `request`, with one question each. The series' labs come with its interactive learning, so the questions link to none yet. Progress is stored in the browser under `ld-for-this-purpose-only`. The release workflow renders the video, `for-this-purpose-only.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
