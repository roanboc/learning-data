# Rebuilding An agreement first

*An agreement first*, film 1 of 8 of *Only what you may see*, the second series of *Data protection and privacy*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, two files of the agent films' kit, and the module's look and tools in [`../../../locks-before-the-data/shared/`](../../../locks-before-the-data/shared/), whose [README](../../../locks-before-the-data/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `af_` or `AF_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the data sharing agreement 2026-14, written line by line and signed), the words the voice respells (Jun, AI and HR, as in every film of the module, and Mei, Yusuf, Demir, Anil and Kurian), its opening story (`first`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice reads differently from its caption (a number or a date in words) says it in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/af_papers.js` | The film's papers, on the kit's glass: a pane with a folded corner; a paper of rows, each a label and its words, with lines to sign on, a signature written along one and the gold chip; the confidentiality agreement's six lines and the data sharing agreement 2026-14, word for word as the module's numbers have them; the agreement's contract; Yusuf's two registers (the book of signed promises, and the table of agreements: what was agreed, by whom, until when); a group's badge and its member; the totals that may leave. |
| `src/af_wartime.js` | Bletchley Park in 1939, in the module's night light: the house and its lawn, the huts that come up row after row, people crossing between them, the hut where the recruit signs the declaration under a lamp, the commander's office where the officer brings a sheet, waits while it's read, takes it back and burns it, and the sea chart (coasts from Natural Earth) where a convoy is steered round submarines. Its places are painted once (`AG_PLACES`); the recruit, the officer and the commander are drawn with the kit's people, in lamp light. |
| `src/af_hall.js` | The university: the hall with the platform and the study's own space in it, and the rooms of Anil, Mei, Yusuf and Sam, each a pane of the hall with a desk; the door to the data and its Access pill; name cards; the study's request; the two papers side by side; Anil's screen with a gap in its chart; what a yes with nothing written would let out (names beside results, frosted, and copies to a laptop and a shared folder); the agent's card; the labels of the Five Safes. |
| `src/scenes.js` | The six chapters, each a few shots. In one room the camera glides on and only what changes fades; between rooms it cuts, and between the past and the present it dissolves. The title card ends chapter 1 and the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a viola organista, Leonardo da Vinci's bowed keyboard, whose note sounds only while its key is held, as access lasts only while its agreement does; and a chalumeau, one low register and one voice, each person's promise, its note the one left sounding after the last chord ends. E minor for the war's secret at risk, G major after, tuned pure from G. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/only-what-you-may-see/1-an-agreement-first/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every word reads and stands out, places and people paint in time, nothing shows twice or jumps
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, held notes keep their level, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/an-agreement-first.mp4
```

`tts.py` reuses a line's voice only while its spoken words, the voice and the model match what made it, so a changed line is voiced again by itself; don't delete the files by hand. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/an-agreement-first/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/an-agreement-first-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/media.py index --film an-agreement-first-en` from the repository's root if the soundtrack changed (it writes the film's `audio.json`), and `python site-tools/build_series.py`: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/an-agreement-first/think.en.js` and `think.es.js`. The release workflow renders the video, `an-agreement-first.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
