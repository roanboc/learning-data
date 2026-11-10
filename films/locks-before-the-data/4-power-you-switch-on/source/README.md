# Rebuilding Power you switch on

*Power you switch on*, film 4 of 9 of *Locks before the data*, the first series of the module *Data protection and privacy*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, the agent films' people, and the module's own look, *Night glass*, in [`../../shared/`](../../shared/): the hall of frosted panes, its panels, cards, pills and badges, the agent's sphere, and the finishing pass ([`../../shared/README.md`](../../shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Jun, Mei, Deland, Sargent, HR and "A I", as the series says them), its opening story's chapters (`taken` and `clock`), its one urgent chapter (`taken`), and the moment its poster shows (the morning's switch-on card, approved and lit). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, a beat for each switch-on and switch-off, and the wordless moments (the title card after the opening, and the end card). |
| `src/pw_past.js` | The 1870s (prefixed `pw_`, as all of this film's own pieces), painted once each in the module's night light: a town's main street with its bank, a side street of wooden houses, Great Barrington's street, the bank inside with the round iron door of its vault, and a lock maker's bench in Rochester; what moves is drawn live: the vault's door (its dial, the three slots that fill as it turns, its bolts and its time lock), the lanterns, the windows, James Sargent and Fred Deland, and each place's tag. |
| `src/pw_hall.js` | Two rooms of the module's hall. The team's room: Sam and Jun at the left, and their board, each one's everyday account, then their admin account, then the shelf of the three powers, with a lock between each step; the passkey card, the switch-on card and its ring, the platform team's pane and its bell, and the record. The platform: the catalog's ring, the storage and its back door, the admin settings, a table's history, a file opened, the table of rows set aside, the registrar's office, and the break-glass case. Colours keep the module's meanings. |
| `src/scenes.js` | The eight chapters, each a run of shots. Each room is one room: in it the camera glides, and a chapter that opens where the last one ends glides on from it; between rooms the film cuts, and it dissolves only where the whole picture changes: into Sargent's bench, and from the 1870s into the hall, in the second chapter and the last. The title card ends chapter 2, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, with the series' words in its header. |
| `tools/score.py` | The film's music and sounds: a diaphone, the lighthouse fog signal, for great power switched on (one low note swells in at each switch-on and falls as the power goes off), and a square piano of the 1870s for the everyday, dry except while a power is on; tuned pure from G, E minor for the danger, and the robbers' steps the one pulse, in the first chapter only. Each effect fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py`, `check.py`, `contrast.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/locks-before-the-data/4-power-you-switch-on/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every word reads and stands out, every place paints without holding the page, nothing shows twice, no arm jumps, nothing jumps in one room, nothing reaches past a person's picture
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, as low as the governance films', nothing beats, the pulse only where it's urgent
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/publish.py    # the player, poster and soundtrack to site/assets/ (--keep-sound when only the pictures changed)
python tools/render.py --workers 4   # dist/power-you-switch-on.mp4
```
