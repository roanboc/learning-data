# Rebuilding Report, fix, tell

*Report, fix, tell*, film 2 of 4 of *Quality as a habit*, the second series of the module *Data quality*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../../fit-for-use/shared/`](../../../fit-for-use/shared/), whose [README](../../../fit-for-use/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `rf_` or `RF_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (Andrés's name typed in the portal, the button pressed), the words the voice respells (Jun, Mei, Andrés, Peñaloza), its opening story (`report`), no chapter where the score may pulse, and `"logos": true` for Databricks' and dbt's marks. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number or a date says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/rf_india.js` | The opening's places, painted once in the module's matte look and lit from the right: a village lane in 1974 at midday and at dusk, the same village from above as a plan (its houses ticked as they're vaccinated, a few left grey, the chain a dark umber mark, never red, and the brass ring of containment), a house's door where a health worker meets the woman who reports a case, the reward's poster, and a station platform at dusk, empty. Its two people of 1974, dressed for their time, nobody ill. |
| `src/rf_home.js` | Andrés's room on a Monday evening, his laptop open on the table, and its screen, close: the university's graduation portal, his name as it will be printed, its two amber rings, the button "This isn't my name", the field he types his name in, the promise, and the answer. |
| `src/rf_cards.js` | The university's cards: the place-and-date tag and each chapter's title, the report as a row of data, the ledger of reports (a dbt model of its own), the alert on Databricks, the village framed on the stone wall, the line a fix travels from the student system to every copy, the month's count, the note to the admissions team, the check a report becomes, the names it holds and the table dbt keeps them in, the letter, the seven names given back their accents, the issue log, the certificate and the graduate's empty folder. |
| `src/scenes.js` | The seven chapters. India's places dissolve into one another; in each room the camera glides from one framing to the next and only what changes comes in or leaves. *Fixed where it started* and *Every case, a check* glide on from the bench where the chapter before ends (`ag_cutInto`). The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a string telephone made into an instrument, a wire between two tins, plucked and stroked, a message along the line and an answer back; and its partner, tuned tins struck softly with felt, sounding only where a person answers or tells. The mark: a note plucked at one end, answered a step higher at the other, then a tin, once. A major, F-sharp minor for the problem, tuned pure from A. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../fit-for-use/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/quality-as-a-habit/2-report-fix-tell/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/report-fix-tell.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, change.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/report-fix-tell/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/report-fix-tell-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git once its release exists: `python site-tools/media.py index --film report-fix-tell-en` from the repository's root writes the film's `audio.json` after a new soundtrack. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the official docs the film hands over to. "Pause and think" is `site/assets/report-fix-tell/think.en.js` and `think.es.js`: it stops after `owner`, `source` and `check`, with one question each. The release workflow renders the video, `report-fix-tell.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

What the film shows is in the example project, [`films/analytics-engineering/project/`](../../../analytics-engineering/project/): the portal's reports (`data/portal/name_confirmations.csv`), the reports' own model (`models/marts/graduations/mart_graduations__name_reports.sql`), the morning alert's query (`analyses/alerts/name_reports_due_today.sql`, set up as section 13 of `docs/databricks-governance.md` says), and the old form's check (`tests/rules/old_form_names_not_yet_confirmed.sql`).
