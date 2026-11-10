# Rebuilding A hundred records

*A hundred records*, film 2 of 4 of *Fit for use*, the first series of the module *Data quality*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../shared/`](../../shared/), whose [README](../../shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `hr_` or `HR_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the hundred, two hours later: 79 perfect), the words the voice respells (Jun, Mei, Malia Fonoti, Andrés Peñaloza, Gosset), its opening story (`first`), no chapter where the score may pulse, and `"logos": true` for Databricks' and dbt's marks. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year, a date or a number says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/brewery.js` | The opening's two places, painted once in the module's light: the brewery's laboratory in Dublin from 1899 (a whitewashed brick wall, a cabinet of glassware, a tall sash window, an oak bench) and the barley trial plots seen from a little above; William Gosset, drawn as a young chemist of 1899 from the period, not from a photograph; and the opening's paper and glass: two sample jars of barley ears, the card of the day's arithmetic, the pile of 3,000 cards and the four he drew, the journal page of 1908, the card with his name, and the plan of the eleven pairs of plots. Nothing Irish is borrowed and the brewery isn't named. |
| `src/bench.js` | What the team looks at on the module's bench: the list as a tray of index cards, the hundred most recent records as small cards, ten by ten, one record close, the measure (79 of 100) with its margin in steel, the errors by kind, and the certificates printed again. The hundred's errors are fixed once (`HR_HUNDRED`), so every shot shows the same cards marked the same way. |
| `src/profile.js` | The tools' pages, drawn for the film with the module's window (its bar names the product, with its official logo), in the platform's own words as its docs give them: a notebook's cell with the + menu open on Data Profile, Catalog Explorer's Quality tab, the Data Quality Monitoring dialog and its Data profiling, the profile's metrics column by column, family_name's most frequent values, Add custom metric filled in, and the three checks in the example project. |
| `src/close.js` | The close's own piece: a dashed steel pointer on the margin card for the next time they measure. |
| `src/scenes.js` | The six chapters. The opening cuts between the laboratory and the plots; the four cards Gosset drew become the bench's first four records, in the same places (`cut:true`). The university's chapters are one room, the bench, where the camera glides on from shot to shot and from chapter to chapter, and a later moment there lets what was there leave first (`later:true`). The title card ends chapter 1 and the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: one scientist, Félix Savart, measuring sound two ways. The lead, a Savart wheel, a card held against turning teeth whose clicks become a note, counts (plots lit, cards drawn, a pointer settling, a tag); its partner, Savart's trapezoid violin of 1819, bowed softly and low, is the people who know, listening. The mark: a few separate clicks that, faster, become one clear note, G, where a few records come to say how good a whole list is, and at the end card, where the violin plays that note on. G major, E minor for the problem, tuned pure; the wheel and the violin never on one note together. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/fit-for-use/2-a-hundred-records/source/`:

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
python tools/render.py --workers 4   # dist/a-hundred-records.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/a-hundred-records/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/a-hundred-records-poster.jpg`, at the moment `film.json` names. The soundtrack's pointer is the film's `audio.json`, written by `python site-tools/media.py index --film a-hundred-records-en`; the MP3 stays tracked beside it until the author publishes its audio release ([docs/maintenance.md](../../../../docs/maintenance.md), *Add or replace audio*). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the docs and sources the film hands over to. "Pause and think" is `site/assets/a-hundred-records/think.en.js` and `think.es.js`: it stops after `look`, `profile` and `checks`, with one question each. The release workflow renders the video, `a-hundred-records.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

What the film shows is in the example project, [`films/analytics-engineering/project/`](../../../analytics-engineering/project/): the hundred most recent records of a ceremony round (`analyses/quality/hundred_most_recent.sql`), the profile's columns and Jun's three counts, as portable SQL (`analyses/profiling/profile_graduation_list.sql`, whose header gives the custom metrics as Databricks' data profiling takes them), and the three checks written from what the profile showed, each a warning owned by Mei (`tests/quality/`).
