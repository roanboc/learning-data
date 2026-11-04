# Rebuilding Skills and workflows

*Skills and workflows*, film 2 of 9 of *Agents at work on data*, the second series of the module on AI agents in data work, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, and the module's look and tools in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/), whose [README](../../../what-an-agent-is/shared/README.md) says what each shared file holds. Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files in order, the moment its poster shows (the book open, the square drawn as the worked example's steps are said), the words the voice respells (al-Khwarizmi, Noor, Mei, Jun, "A I"), its opening story's chapter, and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the book's square settling into the title card, and the end card. |
| `src/sw_past.js` | Baghdad, about 820, painted in the module's matte way and lit from the right: the Tigris in the morning with a round boat and a sail, a house's courtyard, a scholar's room in the House of Wisdom, and the book open on a low desk; the people (al-Khwarizmi in a turban and a robe, a widow, her son and daughter, two reckoners), dressed for their time; and the pieces drawn live: a low table, sheets of working, a closed book, the drawn square that proves the steps, an equation in words on tiles, the six forms, and the boats. |
| `src/sw_lab.js` | The lab's pieces, in the module's colours: Jun at his oak desk, a file from the example project on a card (its path, then its lines), a skill folded to its name and line, a cause met so far, the nightly workflow's rail of fixed steps, the chat, the note and the email where answers used to stay, the clock's tag, and the lab at night, its lamp in the far corner. The skills' names and lines, the causes and the workflow's steps are copied here from the example project's files. |
| `src/scenes.js` | The seven chapters, each a few shots cut together, a dissolve only where the place changes. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: an autoharp, its bars pressed and its strings strummed softly with the thumb, one bar for each of the book's six forms, and a cornett, the curved wooden horn of the sixteenth century, soft and without vibrato, for the person who works a problem out by hand. The mark is the cornett's phrase, E flat, A flat, B flat, C, then the autoharp's A-flat chord that keeps it. A-flat major, F minor for the problem, D flat for the forms and the skill's steps, every chord tuned pure from A flat. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/agents-at-work-on-data/2-skills-and-workflows/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice in a dissolve, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/skills-and-workflows.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).
