# Rebuilding Network, storage and keys

*Network, storage and keys*, film 7 of 9 of *Locks before the data*, the first series of the module *Data protection and privacy*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../shared/`](../../shared/), whose [README](../../shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `nw_` or `NW_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (no way around the catalog left: the keys and the link refused, the six people through the catalog, and the catalog's own identity at the files), the words the voice respells (Jun, HR, Okafor, IP), its opening story (`holes` and `tank`), no chapter where the score may pulse, and `"logos": true` for the marks of Azure Databricks, Azure Storage, Key Vault and GitHub. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/nw_rome.js` | Rome in the year 97, painted in the module's night: three places (an aqueduct crossing a valley at dawn, its channel under the ground; a distribution tank with its basin, its bronze nozzles at one level and its lead pipes out to the public basins and fountains, the baths and the houses with a grant; a street of shops, with secret branch pipes under its paving and a public basin), what is drawn live in them (the water, the holes and the garden's pipe, the branch pipes lifted out and the lead piled up, the records on their shelf, the stamped nozzle close up), and the people of the story: Frontinus with his tablet, a water-man with a jar, a woman at the basin, a shopkeeper and two workmen of the gangs, in the agent films' geometry, lit at night. |
| `src/nw_hall.js` | The university's platform in the module's hall, drawn from a state each chapter keeps: the three workspaces, Unity Catalog's tank with its checks (grant, mask, filter), the production storage account and its five containers, the internet and its doors, the university's network with a private door for each workspace, the job compute and the build service, serverless compute and the ways out, the one door for admin accounts, and the key vault with its two sealed keys. |
| `src/scenes.js` | The nine chapters. Rome's three places are one story: between them the whole picture changes, so the film dissolves; at the same place, the camera glides. From the end of chapter 2 to the end, the film is in one room, the hall: each chapter glides on from where the last left it (`ag_cutInto`), and only what changes fades. The title card ends chapter 2 and the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: slap tubes (plain water pipes, each cut to one note, struck at the open end) lead, a note only where a pipe is struck at its mouth, as water was drawn only at the tank; a bass flute, low and breathy, holds the few long notes under the opening, at the one door switched on and at the end. F major for the city's water and the university, D minor for the holes in the channels and the ways around the catalog, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/locks-before-the-data/7-network-storage-and-keys/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every word reads at 4.5 to 1, places and people paint in time, nothing shows twice or jumps, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/network-storage-and-keys.mp4
```

`tts.py` keeps each line's voice until its words, or a word the voice respells in `film.json`, change: it voices that line again by itself.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/network-storage-and-keys/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/network-storage-and-keys-poster.jpg`, at the moment `film.json` names. The soundtrack's pointer is `../audio.json`, made by `python site-tools/media.py index --film network-storage-and-keys-en` from the repository's root ([docs/maintenance.md](../../../../docs/maintenance.md), *Add or replace audio*). Commit a new soundtrack with `git add -f` beside its pointer: *Store audio outside Git* publishes and verifies its release when the change reaches main. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the official docs the film follows. "Pause and think" is `site/assets/network-storage-and-keys/think.en.js` and `think.es.js`: it stops after `files`, `walls` and `key`, with one question each. The release workflow renders the video, `network-storage-and-keys.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
