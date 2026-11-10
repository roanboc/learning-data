# Rebuilding One copy, one platform

*One copy, one platform*, film 3 of 3 of *Data that moves*, the first series of *Modern data basics*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts, logos and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../shared/`](../../shared/), whose [README](../../shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `oc_` or `OC_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the readers on one copy), the words the voice respells (Jun, AI, HR, Linh Nguyen, Noor, Rohan, the Wisselbank), its opening story (`ledger`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the ledger's line becoming the claims app's row as the title card comes, and the end card. |
| `src/ledger.js` | Amsterdam around 1600, painted once in warm lamplight: the quay at dusk with its ships, the counting table, and the Wisselbank's room in the town hall, with its window, table, balance and ledger. Drawn live in them: the merchants, the trader and the bank's clerk (unnamed, in the dress of 1609, lit by the window), coins of every kind (one clipped, one worn thin), the bag, the balance and its weights, the ledger's two pages with their lines and balances, the bills of exchange, and the shadows they cast. |
| `src/claims.js` | The university's side, in the module's look: a tutor's spreadsheet and the mail it went in, the claims app's page on Lakebase with a claim typed as a row and approved, the usual design (the app on its own database, a pipeline, an analytics platform with its copy, reports), and one copy on one platform (the app, the HR system, Lakebase and the lakehouse over one copy of the claims and contracts, the three readers through Unity Catalog, and the hours to pay leaving for the payroll system). |
| `src/scenes.js` | The six chapters, each a few shots in one room that glide, with a dissolve only where the whole picture changes. The title card ends chapter 1 and the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a log drum, a wooden box with tongues cut in its top, struck softly with felt mallets, and a bigger one an octave lower, both made here. Each tongue is its own note, and all of a box's tongues ring in one body; the mark strikes two tongues apart, then together over the bigger drum, as two pages share one ledger and two engines one copy. A-flat major, F minor for the problem, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/data-that-moves/3-one-copy-one-platform/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice, nothing jumps
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/publish.py    # the site's player and poster (--keep-sound when only the pictures changed)
python tools/render.py --workers 4   # dist/one-copy-one-platform.mp4
```
