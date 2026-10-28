# Rebuilding Rules that run

*Rules that run*, the fifth film of the first series on data governance, *Governance principles*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Fustat, Yusuf, Mei and Jun), and the moment its poster shows (the Nilometer's well, its sixteenth mark lit gold and the water a cubit under it). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines (the longest on the survey's numbers and the scorecard's last cell), and two wordless moments (the water settling at the mark, then the title; and the end card). |
| `src/past.js` | The opening's places and people (prefixed `rr_` and `RR`), in watercolour: Fustat and Roda Island in 861, the Nile in flood with boats under lateen sails and palms, a farmer's field in a flood year and in a low one with his family's house behind it, the Nilometer's well as the sources describe it (its stair, its three arches, the octagonal column marked in cubits and its beam; no dome, which came later), the column close, and an office in Fustat. Its people wear their own time: linen tunics, mantles and turbans, and the official in the Abbasid black. The walls' bands and the papyri carry no lettering. |
| `src/plan.js` | This film's pictures (prefixed `rr_` and `RR_`): Yusuf's office, binder 9's page, his screen and his board; the data team's room, its board and Jun's desk; Planning's room; the learning team's office, Tom's screen and his desk. The papers, in plain words: the survey form and its chart, the page of the night's checks, the rule register, the scorecard (a copy of the series' with three-line cells), the rule cards (the series' sign-off sheet), the level's counter, the warning slips, the enrolment cards, the follow-up list, the issue log and the report covers held back. Painters this film shares with *Fixed where it starts* are copied here with this film's names, so neither film changes the other's, and `rr_fadeCut` fades a word as the frame's edge comes to it. No files, code or tool screens: the film is in the series' first pack. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The ten chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 10. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: two clarinets hold the chords over a low bowed string, and a harp plays each reading (the keeper's, each check named, each cell that lights), with an open fifth when a measure meets its level. D minor for the river and the low year, F major for the university and today; every pitch comes from one scale tuned pure on D, so a note two chords share never beats. One low bowed note for the red cell, and the series' mark, 1-5-4-8, on a clarinet with the harp an octave above, at the title and the end. Music plays under the opening story, then only at a chapter's turn, under a moment on screen and in the wordless ending. Each effect (the river's wash, water in a channel, wind, footsteps, a scroll, oars, paper, pins, a pencil, a pen, a marker, keys, a rubber stamp, a sieve) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The check on when the music plays: after the opening, no chapter has music for more than half its length or 12 seconds without a break, nothing beats on a phone's one speaker, and nothing pulses. |
| `tools/edges.py` | The film's own check that the frame never cuts a word, decoration included: a sheet slides in from the edge and the camera closes on the scorecard beside its chart, so their words fade as the frame comes to them (`rr_fadeCut`). A copy of *Fixed where it starts*' check; `tools/check.py` runs it after the series' check. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/5-rules-that-run/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error, every place paint, and the frame never cut a word
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # when the music plays, and that nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/rules-that-run.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "now" would land on "knows". The score's `W()` stops with an error when a word isn't there. `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/rules-that-run/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/rules-that-run-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/rules-that-run/think.en.js` and `think.es.js`: it stops after `runs`, `level` and `list`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-rules-that-run`. The release workflow renders the video, `rules-that-run.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
