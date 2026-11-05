# Rebuilding Why we govern them

*Why we govern them*, film 8 of 10 of *What an agent is*, the first series of the module *AI agents in data work*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, and the series' own look in [`../../shared/`](../../shared/): the lab, its people, the agent and its loop, the cards, and the finishing pass ([`../../shared/README.md`](../../shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Jun, Yusuf, Noor, Feng, Zhang, ISO/IEC 42001 and NIST, as the series says them), its opening story's chapter, and the moment its poster shows (the train at the platform, on the morning in 1964 when the line opens). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the title card after the opening, and the end card). |
| `src/japan.js` | Japan in 1964, and the line today, drawn in the module's matte language (prefixed `wg_`): the platform in morning light, the line along an embankment, plain track at night for Tokyo in 1962, a carriage of passengers, the driver's cab with the speed allowed above the needle, and the control room; the train of 1964 and today's, a signal beside the track, and the people of 1964, dressed for their time. No Japanese words, patterns, art styles or landmarks: signs are blank, and a corner tag names the place and the year. |
| `src/plan.js` | The room's own pieces (prefixed `wg_`): where things stand in the room's usual shot; the four question cards that turn over to the four needs; the census count, the plain job and its night; the word cards from films 1.3, 1.4 and 1.6; the owner tag, the switch and its wire, the badge and the log; the role card, the rails along the agent's arms, the bars and the mandate; the approve box, the frame where it works in test, the report and production behind glass; the numbered rules, the shelf of three references, and the cards for what comes next. Colours keep the module's meanings. |
| `src/scenes.js` | The eight chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: an ondes Martenot quartet, one player to a note, held steady, through the *palme* speaker, and a cornet, alone, both made here. The film's figure is a ceiling: the cornet holds the limit and one of the ondes climbs to it and stops just under it; where the limit is lowered, the cornet steps down and the figure follows; at the close they reach it together. D major for Japan in 1964, F major for the university, every chord tuned pure from D. Music plays under the opening story, and after that only now and then. Each effect (a rush of air beside the train, knocks, keys, paper, a pencil, a pen struck through, stamps) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/what-an-agent-is/8-why-we-govern-them/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, and every place paints without holding the page
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/why-we-govern-them.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/why-we-govern-them/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/why-we-govern-them-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/why-we-govern-them/think.en.js` and `think.es.js`: it stops after `identity`, `limits` and `review`, with one question each. Progress is stored in the browser under `ld-why-we-govern-them`. The release workflow renders the video, `why-we-govern-them.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
