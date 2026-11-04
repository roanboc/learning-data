# Rebuilding Tools are hands, and every hand is a permission

*Tools are hands, and every hand is a permission*, film 3 of 9 of *Agents at work on data*, the second series of the module on AI agents in data work, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, and the module's look and tools in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/), whose [README](../../../what-an-agent-is/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `th_` or `TH` (Oxford's old library and its people) or `tl_` or `TL` (the film's pieces in the lab):

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the librarian showing the king the rule, 1645), the words the voice respells (Jun, Mei, Noor, AI), its opening story (`rule`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the restored library becoming the title card, and the end card. |
| `src/th_kit.js` | The colours of the old library, the people of its past (the module's people, with the gowns, hoods, caps, ruffs and collars of their time drawn over them, none a likeness), and small helpers the scenes share. |
| `src/th_past.js` | Oxford's old library, painted once in the module's matte style, lit from the right: the long room of the 1400s with its lecterns and chained books, the bare room of 1556, Bodley's oak cases of 1602 with a chain from each book to a rod, the room in 1645 and today, and a room in London in 1598. |
| `src/th_things.js` | The opening's close views: a page copied by hand, an empty chain, Bodley's letter in his own spelling, the rule's painted board, a chained book on its desk with a notebook and a candle, the statute book in the librarian's hands, and the reader's declaration card. |
| `src/th_lab.js` | The film's pieces in the module's lab: the agent's six tools in an arc, each with what it may do; a tool server and its plug; the rules card (the example project's `AGENTS.md`, word for word) and the rights card with its lock; Sam's checklist; the ticket it's given, the sample with names masked, the pull request; the empty slots no hand reaches; Clara's ticket, the pasted email and its hidden line, the file card, the agent's reply; the three circles of a leak; Sam's log; the count by faculty; and the framed pictures of the old library on the wall. |
| `src/scenes.js` | The seven chapters, each a few shots cut together, a dissolve only where a shot adds a veil and a card. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a hurdy-gurdy, its melody string only, whose player's hand acts only through its keys, and a rackett, the soft low double reed of Bodley's time, answering it two octaves down; the mark is a key pressed and its one note, answered low, where a rule holds. D-flat major, B-flat minor for the emptied library and the king at war, tuned pure from D flat. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/agents-at-work-on-data/3-tools-are-hands/source/`:

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
python tools/render.py --workers 4   # dist/tools-are-hands.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/tools-are-hands/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/tools-are-hands-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/tools-are-hands/think.en.js` and `think.es.js`: it stops after `rights`, `six` and `line`, with one question each. The release workflow renders the video, `tools-are-hands.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
