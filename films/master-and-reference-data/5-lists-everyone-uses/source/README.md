# Rebuilding Lists everyone uses

*Lists everyone uses*, the fifth film of *The same one, everywhere*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, *In the weeds of data crafting*'s motion helpers, *The map before the data*'s people, and the series' own watercolour in [`../../shared/src/`](../../shared/src/). Jun comes from *In the weeds of data crafting*'s people (`films/analytics-engineering/shared/src/people.js`, named in `film.json`). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Nguyen, Linh, HR, YYZ, SGN, ENR, CAS, VN), and the moment its poster shows (from the opening story: two suitcases at an airport, tagged YYZ and SGN). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). Two lines carry a `say`, so the voice reads "nineteen seventy-six" and "ISO 3166" as people say them. The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the two luggage tags and everyone who reads them, then the title; the list, with every test that reads it pinned to it; and the end card). |
| `src/plan.js` | This film's places and pictures (prefixed `m5_` and `M5_`): the airport terminal and its runway, the campus, plain paper and the office window (`m5_terminal`, `m5_campus`, `m5_plain`, `m5_plainB`, `m5_office`); the suitcases, their luggage tags, the plane, the old names and everyone who reads a code (`m5_case`, `m5_tag`, `m5_smallTag`, `m5_plane`, `m5_rename`, `M5_USERS`); Linh's card and her role bands (`m5_linhCard`, `m5_bands`); a system's card, HR's email and a test or mapping file (`m5_sys`, `m5_email`, `m5_file`); the count by country and its bracket (`m5_report`, `m5_bracket`); a list with a yellow tab, a table, and a small list card (`m5_list`, `m5_grid`, `m5_mini`); a code's drum and a label's reader (`m5_drum`, `m5_reader`); the platform's lineage and the pin where a test reads a list (`m5_platform`, `m5_node`, `m5_pin`); the pull request, the years and the past contracts (`m5_pr`, `m5_years`, `m5_contract`); the form's choices (`m5_choices`); and an industry's panel (`m5_ind`). |
| `src/scenes.js` | The eleven chapters. The title card ends chapter 1, the end card chapter 11. The camera moves in on whatever the narration is about, and things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds, a new palette: chords on a small string section, from B minor at the airport to D major at the end; a plucked guitar note for each role and a B for a list's value; a bowed cello for the person; the series' clarinet mark. The strings play under the airport's story and the title, then only at moments: a chord at a chapter's turn, in a pause, on the first of January and on the end card. Nothing pulses or trembles, and every note is tuned pure over D (`tune()` picks each chord's ratios), so no chord beats on a phone's speaker. Each effect (a tag swinging in, a card or a sheet set down, a felt-tip pen that writes, rings, ticks and strikes through, a pin, a few muffled keys, a plane's engines far off) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/master-and-reference-data/5-lists-everyone-uses/source/`:

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
python tools/render.py --workers 4   # dist/lists-everyone-uses.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/lists-everyone-uses/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/lists-everyone-uses-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its pages, its Spanish chapter names, and the moment from the past its page recalls). "Pause and think" is `site/assets/lists-everyone-uses/think.en.js` and `think.es.js`: it stops after `typed`, `home`, `change` and `people`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-lists-everyone-uses`. The release workflow renders the video, `lists-everyone-uses.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
