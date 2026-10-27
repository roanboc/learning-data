# Rebuilding Who decides

*Who decides*, the film after *Off the shelf* in the series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`, with the register and the sign-off sheet the first pack's films share), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Yusuf Demir, Mei, Jun, Noor, and *andon*, said as in Japanese), and the moment its poster shows (the lamp lit on the andon board). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the line stopped, then the title; and the end card). |
| `src/plan.js` | This film's pictures (prefixed `wd_`), in watercolour: a car maker's engine line in 1960s Japan (the hall, the conveyor and the engines gaining a part at each station, the cord and the call buttons, the andon board's lamps, the workers in their caps and the supervisor); Yusuf's desk, and binder 2 open on it, policy 2 on one page and the register of areas on the other, its "TBC"s giving way to names; his inbox and the thread about *award*; the data team's printed list, *Who we ask*; the three roles' cards; Mei's desk, her log book *Same learner?* and the course area's decision book; Sam's screens; Yusuf's board of areas under governance's gold band, and the stewards' whiteboard; the sign-off sheet on Jun's desk, sent back and then signed; the council's minutes; a change request and its routing slip; the four cards of a decision; Mei's calendar, the registrar who agrees her time, and the cards of her role; and the five places *award* is defined, round Mei, which *One word, one home* opens on. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The ten chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 10. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a cello and a vibraphone, its motor off. The vibraphone is a call: answered (the lamp lights and the supervisor comes; the slip in Mei's hands), a gap ("TBC", the sheet sent back, a name with no time) and a gap filled (the names confirmed, Clara signs, the time given back); Mei's question at the end is a call with no answer yet. The cello is a person who answers, and plucked, it walks with the engine line until it stops. G mixolydian for the line, E-flat major for the university, turning on G, in just tuning; the series' mark, 1-5-4-8, on the cello at the title and the end. Each effect (a knock, paper, a pen, a cork pin, a rubber stamp, a clip) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | Checks the music keeps the series' rule: after the engine line, no more than half of any chapter, nothing held longer than 12 s, nothing that beats or pulses. Run it after `tools/audio.py`. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/2-who-decides/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes and goes, and nothing in it beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/who-decides.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start. `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/who-decides/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/who-decides-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/who-decides/think.en.js` and `think.es.js`: it stops after `cord`, `roles` and `asked`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-who-decides`. The release workflow renders the video, `who-decides.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
