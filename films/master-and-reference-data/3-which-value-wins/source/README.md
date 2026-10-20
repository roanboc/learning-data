# Rebuilding Which value wins

*Which value wins*, in *The same one, everywhere*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, *In the weeds of data crafting*'s motion helpers, *The map before the data*'s people, and the series' own watercolour in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Nguyễn, Nguyen, Thị, Linh, HR, HMS), and the moment its poster shows (Linh's five records, linked, beside the person's sheet with every value that disagrees). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). Five lines carry a `say`, so the voice reads the years, "14 March" and "1,284" as people say them. The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the cabin of ticking clocks, then the title; the rules, written and tested; and the end card). |
| `src/fonts.js` | Manrope's Vietnamese subset, so Linh's legal name, Nguyễn Thị Linh, keeps its accents. It holds only the letters Vietnamese adds, and takes the weights of the page's own Manrope faces, since a face with other weights would take the family over and leave every other letter to the next font. Where those faces already carry Vietnamese, on the site and in the standalone player, it adds nothing. It's registered before anything is drawn. |
| `src/plan.js` | This film's places and pictures (prefixed `m3_` and `M3_`): Plymouth Sound in December 1831, the Beagle's chronometer cabin, the campus, the data team's office, plain paper and Falmouth in October 1836 (`m3_sound`, `m3_cabin`, `m3_campus`, `m3_office`, `m3_plain`, `m3_plainB`, `m3_falmouth`); the Beagle, its twenty-two chronometers with their boxes and dials, how a ship finds its longitude, and the rate book (`m3_ship`, `M3_CLK`, `m3_box`, `m3_dial`, `m3_lon`, `m3_rateBook`); Linh's five records, a value's tag in its source's colour, the person's sheet and a value carried to it (`m3_rec5`, `m3_val`, `m3_sheet`, `m3_fly`); the model's SQL, HR's file and her transcript (`m3_code`, `m3_file`, `m3_transcript`); her names, her passport and how each name is used (`m3_nameParts`, `m3_passport`, `m3_variant`, `m3_use`); the rules file, the fallback order, the SQL and tests written from the rules, and the same rule on a master data tool's screen (`m3_yaml`, `m3_chain`, `m3_sqlCard`, `m3_testCard`, `m3_screen`); a contact point (`m3_contact`); a rule, the dry run and the registrar's stamp (`m3_rule`, `m3_dry`, `m3_stamp`); and the bank's and shop's panels (`m3_panel`, `m3_phone`). Jun's figure is copied here from *In the weeds of data crafting*'s people, which this series' build doesn't load. |
| `src/scenes.js` | The ten chapters. The title card ends chapter 1, the end card chapter 10. The camera moves in on whatever the narration is about, and things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds, a new palette that keeps what the series carries from film to film: sackbuts holding chords that follow the chapters, in E flat and its relative C minor, one player to a note, and a note the next chord keeps held through the change; the series' mark on the clarinet, 1-8-5-1 in E flat, over a low harpsichord note; a harpsichord note for each source, on the note of the role whose colour it wears (the student system D, HR A, the research office G, the alumni office the D above), the same all film long, so a value carried from a record sounds where it came from; the person's D and the A above it on a cor anglais, which also brings in, on its D, a value Linh gives herself; the sea under the two harbours; and the Beagle's chronometers, each ticking where its own second hand steps. A low pulse, at 96 a minute, rises only while HR's resent file takes Linh's record in chapter 3. Each effect (a pencil that writes, rings, ticks and crosses out, a card set down, a book set down and shut, muffled keys, a click, a stamp, a pin) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. The music sits about 21 dB under the voice as it speaks, and the pulse about 9 dB under the rest of the music. When a chord changes under a source's note, keep that note in the chord. One player to a note: two on one note beat into a slow pulse on a phone's speaker. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/master-and-reference-data/3-which-value-wins/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone (28 px or more in the frame), and none may overlap
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/which-value-wins.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/which-value-wins/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/which-value-wins-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its pages, its Spanish chapter names, and the moment from the past its page recalls). "Pause and think" is `site/assets/which-value-wins/think.en.js` and `think.es.js`: it stops after `hidden`, `rules`, `emails` and `dryrun`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-which-value-wins`. The release workflow renders the video, `which-value-wins.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
