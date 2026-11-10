# Rebuilding Grants by design

*Grants by design*, film 4 of 8 of *Only what you may see*, the second series of the module *Data protection and privacy*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../../locks-before-the-data/shared/`](../../../locks-before-the-data/shared/), whose [README](../../../locks-before-the-data/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `gd_` or `GD_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the shelves and their readers, as the registrar's office gets core and reference and exam support its own shelf), the words the voice respells (Galápagos, Mei, Anil Kurian, Jun, HR, AI), its opening story (`islands`), no chapter where the score may pulse, and `"logos": true` for Databricks' and GitHub's marks. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number, a date or the platform's words says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/gd_kit.js` | The film's small helpers: a chapter's moments made once, a value that fades in at a word and out at another, the kicker, a person drawn whole and faded as one picture, a line of code on a dark strip, and a group, a table and a lock as this film draws them. |
| `src/gd_islands.js` | The opening's world, painted in the module's night light: a shore of the Galápagos at dusk in the 1970s, with its landing rock, black lava, saltbush, palo santo and a lagoon (the place `gdShore`); and what moves on it, drawn live: boats with a lamp, small far-off visitors with their guide, in the clothes of the time, the animals (sea lions, boobies on their nests, a marine iguana, flamingos), the trail and its stakes, and the frosted zones that keep most of the land from visitors. No one's likeness is drawn. |
| `src/gd_room.js` | The university's side, in the module's hall (the place `gdHall`): the registrar's catalog as a room of glass with its shelves, each a long pane with its tables; the groups on the left, pills of glass with three heads, never one person; a grant as a line of light from a group to a shelf, green, and `BROWSE` dashed; the three doors a table needs (the room's door, the shelf's gate, the table); the owners' plate; and the studies' workspace, bound read only. |
| `src/gd_pages.js` | GitHub and Databricks as the film shows them, drawn with the kit's pages: the platform repository's file tree, the two files of grants in the code font, the code owners' review, and the catalog's permissions. |
| `src/scenes.js` | The nine chapters. The islands are one room and the hall another: in each, the camera glides from one framing to the next and what changes fades, and from *One table at a time* to *Written once, kept as code* every chapter glides on from where the last one left the camera (`ag_cutInto`). The title card ends chapter 1 and the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a Cristal Baschet, glass rods stroked with wet fingers that set steel rods ringing, its mark a chord touched once and heard again an octave and two octaves lower without being touched, as a grant on a shelf reaches every table on it; and its partner, a French horn, soft and low, for the guides, with one note stopped in the bell where a door stays shut. E-flat major, C minor for the grants made one at a time, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/only-what-you-may-see/4-grants-by-design/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/grants-by-design.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, or a word the voice respells in `film.json`, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/grants-by-design/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/grants-by-design-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the official docs the film hands over to. "Pause and think" is `site/assets/grants-by-design/think.en.js` and `think.es.js`: it stops after `doors`, `tomorrow` and `code`, with one question each. The soundtrack is kept outside Git: `python site-tools/media.py index --film grants-by-design-en` writes the film's `audio.json`, which points at its copy in the repository's releases. The release workflow renders the video, `grants-by-design.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The grants the film shows are those of the module's fictional platform repository, `uni-example/data-platform`: the registrar's bundle, `registrar/resources/catalog.yml` and `registrar/resources/schemas.yml`, drawn on screen as [the script](../script.md) gives them. They aren't files in this repository.
