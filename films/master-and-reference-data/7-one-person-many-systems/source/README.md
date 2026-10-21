# Rebuilding One person, many systems

*One person, many systems*, the seventh film of *The same one, everywhere*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, and everything *One person, many roles* draws with: the series' watercolour in [`../../shared/src/`](../../shared/src/), its people, Linh's white figure and her roles' colours. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Nguyen, Linh, PhD, dbt, HR), the moment its poster shows (from the opening story: the treaty signed at Bern on 9 October 1874, over the tangle of routes it replaced), and its opening's story (`story`: chapter 1, 1874), where `tools/quiet.py` lets music play throughout. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). One line carries a `say`, so the voice reads its year as a year: "eighteen seventy-four". The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the letter crossing the one postal territory, then the title; the lightest way, settled, with Bern beside it; and the end card). |
| `src/plan.js` | This film's places and pictures (prefixed `m7_` and `M7_`): the valley of 1874, the campus, plain paper and Noor's office (`m7_valley`, `m7_campus`, `m7_plain`, `m7_plainB`, `m7_office`, `m7_place`); the seven post offices, each with its horn (`M7_PO`, `m7_po`, `m7_horn`); a treaty for every pair, each with its wax (`M7_PAIRS`, `m7_treaties`, `m7_wax`); the letters and their stamps (`m7_stamp`, `m7_letter`, `m7_letter25`); the treaty of Bern, its twenty-one signatures and its seal (`m7_treaty`, `M7_SIG`, `m7_seal`); the territory, the coins, the post office nobody built and the rules (`m7_territory`, `m7_coin`, `m7_ghost`, `m7_rules`), and the valley kept small for later chapters (`m7_bernKept`, `m7_inset`); the stamp and the numbers it stamps (`m7_stamper`, `m7_stampOn`); the four systems, Linh's bands, the application and the empty record of a third number (`M7_SYS`, `m7_sys`, `m7_bands`, `m7_app`, `m7_ghostRec`); the four ways on Noor's wall (`M7_WAYS`, `m7_way`, `m7_arrow`), the doors where people are created (`m7_door2`) and the shadow a growing figure stands on (`m7_shadow`); a bank's hub and a country's register (`m7_panel`, `m7_hub`, `m7_rchip`); the search's lanes and Mei's queue (`M7_LANES`, `m7_queue`); who may create a person (`m7_rule`); the search's table for the second Linh (`m7_compare`); and the person as a data product, with its settings on the data platform and who may read it (`m7_product`, `m7_yaml`, `m7_grant`). |
| `src/scenes.js` | The twelve chapters. The title card ends chapter 1, the end card chapter 12. The camera moves in on whatever the narration is about (`m7_focus` keeps it inside the frame, so a key far off centre is pulled back), and things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds, a new palette: a reed organ's soft stop, one reed to a note, under the opening's story in the valley of 1874, then only at the turn into a chapter that starts something new, as chapter 5's diagram opens out, and in the pause after it; a soft horn for the series' mark (1-8-5-1), a nod to the post horn, with its echo off the valley; a harp for each role, on the notes the roles have had since *One person, many roles*; a low flute, D and A, for the person. Nothing pulses or trembles, and `tools/quiet.py`, the series' check, runs after `tools/audio.py` to say so. Each effect (a pencil, a quill, paper, a brush, a stamp, the treaty's wax, a coin, a pin, a few muffled keys) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/master-and-reference-data/7-one-person-many-systems/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone (28 px or more in the frame), and none may overlap
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the series' sound: after the opening, music only from time to time, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/one-person-many-systems.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/one-person-many-systems/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/one-person-many-systems-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its pages, its Spanish chapter names, and the row it adds to *Every film opens somewhere else*). "Pause and think" is `site/assets/one-person-many-systems/think.en.js` and `think.es.js`: it stops after `after`, `lightest`, `search` and `apart`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-one-person-many-systems`. The release workflow renders the video, `one-person-many-systems.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
