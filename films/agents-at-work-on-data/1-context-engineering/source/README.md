# Rebuilding Context engineering

*Context engineering*, film 1 of 9 of *Agents at work on data*, the second series of the module on AI agents in data work, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, and the module's look and tools in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/), whose [README](../../../what-an-agent-is/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `ce_` or `CE_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the page with Guido's lines), the words the voice respells (Arezzo, Mei, Jun, AI), its opening story (`lines`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the meaning settling onto the page as it becomes the title card, and the end card. |
| `src/past.js` | The opening's places and people, painted once in the module's matte style, lit from the right: the cathedral school at Arezzo, about 1025, with its lectern and great book; the open book close up; a room in Rome, about 1028; the chant's words and its signs, before Guido's lines (at rough heights) and after (each on its line or space); the lines a quill draws, the red F and the yellow C; the choirboys from behind; the chant books with their masters' names; and Guido, two masters and Pope John, dressed from pictures of their time, never likenesses. |
| `src/plan.js` | The room's pieces, in the module's colours: Jun at his desk, the agent's place and its three read-only tools, a file's lines in the mono face, the count worked out, the four kinds of context round the agent, the test's four students, the inbox with the old email, the glossary on a screen, a word with nothing written for it, and Lucía Ortega, as *Context and memory, governed* draws her. |
| `src/scenes.js` | The seven chapters, each a few shots cut together, a dissolve only where a shot adds a veil and a card. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a monochord, the instrument Guido taught with, which names a note wherever a meaning is set down (its harmonic is a test that passes), and a twelve-string guitar, each note on a pair of strings, which takes up what the monochord names as a chord (the film's mark) and plays the story's chords; a guess is one of its low notes, the wrong one, stopped short, and a muted pair is something not found. E Dorian, then E major, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/agents-at-work-on-data/1-context-engineering/source/`:

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
python tools/render.py --workers 4   # dist/context-engineering.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/context-engineering/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/context-engineering-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/context-engineering/think.en.js` and `think.es.js`: it stops after `word`, `reads` and `team`, with one question each. The release workflow renders the video, `context-engineering.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
