# Rebuilding Who is it?

*Who is it?*, the film after *One person, many roles* in *The same one, everywhere* (a working title), is generated from code like every other film here. It draws with the same engine, components, fonts, voice model and people as *One person, many roles*, and with the series' own watercolour in [`../../shared/src/`](../../shared/src/), which it doesn't change. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Nguyen, Linh, HR, Guerre, Bertrande), and the moment its poster shows (HR's record weighed against her new student record, the score settled at 74). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). Three lines carry a `say`, so the voice reads the year as a year ("fifteen forty-eight") and the weights as numbers ("plus three point two"). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the two men side by side, then the title; Linh's five records, joined to one person; and the end card). |
| `src/fonts.js` | The Vietnamese letters of Linh's legal name, NGUYỄN Thị Linh: the Vietnamese subsets of the series' two fonts (Manrope and IBM Plex Mono), from Google Fonts, under the same SIL Open Font License, loaded before the film starts, with the weights of the page's own faces of each font. On the site, whose fonts already have Vietnamese letters, it adds nothing. |
| `src/plan.js` | This film's places and pictures (prefixed `m2_` and `M2_`): Artigat in 1548, the court in 1560, the campus, plain paper and Mei's office (`m2_village`, `m2_court`, `m2_campus`, `m2_plain`, `m2_plainB`, `m2_office`, `m2_place`), and a veil of paper that quiets a place (`m2_hush`); the people of Artigat, walking and standing, the real Martin with a wooden leg and a crutch (`M2_FOLK`, `m2_folk`, `m2_stride`), and the judges at their bench (`m2_judge`, `m2_bench`); what the village knew, the witnesses' record and its tallies, and a name struck through (`m2_knew`, `m2_witness`, `m2_tally`, `m2_strike`); the two shelves and their things, lists and tags (`m2_shelf`, `m2_scroll`, `m2_crate`, `m2_meter`, `m2_list`, `m2_tags`); the master record, its stamp, its best values and their sources, and Linh's five records (`m2_master`, `m2_stampOn`, `M2_BEST`, `m2_src`, `M2_RECI`, `m2_rec`); the university's systems as columns of records, every pair, the pairs that share a key, the key chips and the person queue (`M2_SYS`, `m2_dot`, `m2_web`, `M2_PAIRS`, `m2_pairLine`, `M2_KEYS`, `m2_keyChip`, `m2_queue`); Mei's name card and figure (`m2_nameCard`, `m2_person`); records side by side, the score's gauge and the score from the weights (`m2_card`, `m2_fieldCard`, `m2_gauge`, `m2_score`); her application, the decisions and their cards (`m2_app`, `M2_DEC`, `m2_decision`); the AI helper's note and her contract (`m2_spark`, `m2_note`, `m2_contract`); the balance, the padlock and a result (`m2_scale`, `m2_lock`, `m2_result`); the hospital's wristbands and test result (`m2_band`, `m2_labSlip`); and the cards of the pairs, the queue, its test and the links, with no tool's logo (`m2_tool`). |
| `src/scenes.js` | The eleven chapters. The title card ends chapter 1, the end card chapter 11. The camera moves in on whatever the narration is about, and things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds, a new palette: a consort of viols for the chords under the opening story (A minor) and the end card (A major), and nothing held under the chapters between (`bed()`); a harp that spreads each of those chapters' chord as it starts (`turn()`); a lute for the village's tune; a dulcian for each person; a plucked harp note for each role, the same in every chapter; the series' clarinet for the mark (1-8-5-1). The score's needle plays a harp note for each step it crosses. Nothing trembles: the dulcian and the clarinet play without vibrato, the lute has one string to a note, the viols' pitch drifts together, the end chord, held on its own, is tuned pure (`PURE_A`), and the person's D sits a pure fifth under her A (`PURE_D`), so no two voices are a little out of tune on one note. Each effect (footsteps and a wooden peg, a quill, tallies, a stamp, a wax seal for each decision, keys typing, paper) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film, `quiet.py` among them: after the opening, the music comes in from time to time, and nothing beats or pulses. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/master-and-reference-data/2-who-is-it/source/`:

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
python tools/render.py --workers 4   # dist/who-is-it.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/who-is-it/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/who-is-it-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its pages, its Spanish chapter names, and its row in the series' table of openings). "Pause and think" is `site/assets/who-is-it/think.en.js` and `think.es.js`: it stops after `words`, `golden`, `weights` and `aisha`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-who-is-it`. The release workflow renders the video, `who-is-it.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

To share a new cut for review, run `python films/master-and-reference-data/shared/tools/review_page.py films/master-and-reference-data/2-who-is-it --pr <number> --note "<what changed>"` from the repository's root: it makes a page in `dist/review/` with a 720p copy, a button for each chapter and the captions in each language, to publish as a private artifact, one page for the film.
