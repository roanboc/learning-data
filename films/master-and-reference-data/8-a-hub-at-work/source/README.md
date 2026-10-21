# Rebuilding A hub at work

*A hub at work*, the eighth film of *The same one, everywhere*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, *In the weeds of data crafting*'s motion helpers, *The map before the data*'s people, and the series' own watercolour in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Rafael, Mei, Linh), and the moment its poster shows (the waterfall, with 74 in the band where a person decides). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). Eight lines carry a `say`, so the voice reads their numbers as words: "twelve hundred and forty", "seventy-four", "twenty nineteen". The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the weekend's count on the hub's screen, then the title; this week's result under the Friday rule; and the end card). |
| `src/plan.js` | This film's people, places and pictures (prefixed `m8_` and `M8_`): Rafael (`PEOPLE.rafael`), and Mei and Leila from behind, with their own hair (`m8_personBack`, `m8_hairBack`, `m8_hairLong`, `m8_back`); Mei's office, on Monday and on Friday evening, and Leila's (`m8_office`, `m8_officeAt`), its wall clock (`m8_clockFace`, `m8_hands`) and the monitor the camera moves into (`M8_MON`, `m8_monitor`, `m8_onMon`, `m8_shot`); the hub's screen, drawn for this film (`m8_screen`, `m8_when`, `m8_hubGlyph`); Saturday's street (`m8_street`) and paper for the chapters that explain (`m8_plain`); the rules the series wrote (`m8_ruleCard`); the weekend's changes, their four systems, the rules and the dabs that flow through them into three bars (`m8_source`, `m8_count`, `m8_rulesBox`, `m8_dabs`, `m8_outlet`); Mei's inbox (`m8_inbox`); the application that searches first, what it finds, and the new number it doesn't make (`m8_app`, `m8_lens`, `m8_old`, `m8_noStamp`); the waterfall of weights (`M8_WROWS`, `m8_wtable`, `m8_wchart`); the AI helper's draft, the form and the old record, and the buttons only a person presses (`m8_note`, `m8_spark`, `m8_form`, `m8_record`, `m8_buttons`, `m8_case`); Mei's decision, its versions, and what the helper learns from (`m8_decision`, `m8_learns`); the published feed, the systems that read it, and the masked birth date (`m8_feed`, `m8_sys`, `m8_read`, `m8_masked`); Rafael's record, a source on every value (`m8_val`, `m8_src`); the Friday check and the office's rule (`m8_check`, `m8_rule`); the five questions and their marks (`M8_Q`, `m8_icon`, `m8_ind`); and the three parts and the week, for the end (`m8_part`, `m8_week`). |
| `src/scenes.js` | The eleven chapters. The title card ends chapter 1, the end card chapter 11. The camera moves into the monitor until the hub's screen fills the frame, and things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds, a new palette: a soft synthesiser plays the chords, one voice to a note in equal temperament, its odd harmonics falling fast, so nothing beats on a phone's speaker; the rules are a felt marimba, the AI helper a vibraphone with its motor off, people deciding a horn; the series' mark (1-8-5-1) stays on its clarinet, and the person's interval from *One person, many roles* comes back when Rafael stands as white paper. As the series' sound asks, music plays under the opening until the title (the chapter `film.json` lists in `story`), then only from time to time: a chord at a chapter's turn, an instrument's few notes at a moment on screen, and the last chord and the mark on the end card; `tools/quiet.py` checks it. Each effect (a muffled key, a mouse's click, a felt-tip pen, a breath of air) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/master-and-reference-data/8-a-hub-at-work/source/`:

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
python tools/render.py --workers 4   # dist/a-hub-at-work.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/a-hub-at-work/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/a-hub-at-work-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its pages, its Spanish chapter names, and its row in the series' table of openings: this film has none, and says so). "Pause and think" is `site/assets/a-hub-at-work/think.en.js` and `think.es.js`: it stops after `why`, `ai`, `publish` and `friday`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-a-hub-at-work`. The release workflow renders the video, `a-hub-at-work.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

To review a new cut, `python films/master-and-reference-data/shared/tools/review_page.py films/master-and-reference-data/8-a-hub-at-work --pr <number> --note "<what changed>" --name <new name>.mp4`, from the repository's root, makes a page in the series' look with a 720p copy, a button for each chapter, and both captions.
