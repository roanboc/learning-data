# Rebuilding Deleted means deleted

*Deleted means deleted*, film 4 of 5 of *Kept for a reason*, the third series of *Data protection and privacy*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts, logos and voice model, *A Sharper Sketch*'s `scene()`, two files of the agent films' kit, and the module's look and tools in [`../../../locks-before-the-data/shared/`](../../../locks-before-the-data/shared/), whose [README](../../../locks-before-the-data/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `dd_` or `DD_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the tools' logos (`logos`: Databricks, Azure Blob Storage and GitHub stand beside their names), the moment its poster shows (the purge: a new file without her beside the old one), the words the voice respells (Jun, AI and HR, as in every film of the module, and Nguyen, Linh, Kanesh and Ashur), its opening story (`story`: chapters 1 and 2), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice reads differently from its caption (a year or a date in words) says it in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/dd_kanesh.js` | The opening's places, each painted once (`AG_PLACES`) by lamplight or moonlight: a merchant's room in Kanesh at night, with its table, lamp and shelf of tablets (`ddRoom`); the road to Ashur over bare hills (`ddRoad`); a house in Ashur by moonlight (`ddAshur`). The room's live things: the flame, the tin and cloth, the silver on its scale, the shelf's tablets and their coral rims, the story's tablet as it's written, sealed, shelved, lifted and broken, the receipt and its seal, the caravan, and the house's ledge, where the old tablet greys under "Void". The people of Kanesh are never drawn. |
| `src/dd_platform.js` | The platform's places in the module's hall (`ddHall`, `ddInside`, `ddVault`) and the pieces several chapters share: the platform's block, a table's file drawn as a small tablet, the catalog's table page, code cards, the table's history card, the job's badge, a locked copy, a chip, the timeline, and cards and pills placed in the frame; and the smoked-glass wash that keeps words readable over the warm places of Kanesh (`dd_dark`). |
| `src/scenes.js` | The eight chapters, each a run of shots, with the pieces only one chapter uses beside it (the shelf of frosted tablets, the mailing list's page and its seven days, HR's record, the restricted table of keys, the lineage, the mailing tool, the archive's years and tiers, the query history, the trace, the gateway's table, the issue and the clones): the opening in Kanesh, to the title; the delete and its receipt; delete where it starts; every copy; the archive; what people type; and the end, back in Kanesh. In one room the camera glides on and only what changes fades; chapters 2 to 5 open where the last one ends (`ag_cutInto`); between rooms it cuts. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish; the words used are listed at its top. |
| `tools/score.py` | The film's music and sounds: a straw fiddle (wooden bars on ropes of straw, struck softly, low, dry and short), one note for each tablet and each copy, and one low hummed voice, one note at a time, no vibrato, the witness to the receipt and the record; C minor for the problem in Kanesh, E-flat major for the rest, every note tuned pure from E-flat. The mark is six notes, one for each copy, which lose their notes one by one at the end. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/kept-for-a-reason/4-deleted-means-deleted/source/`:

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
python tools/render.py --workers 4   # dist/deleted-means-deleted.mp4
```

`tts.py` reuses a line's voice only while its spoken words, voice and model are unchanged, so an edited line is voiced again on its own. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/deleted-means-deleted/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/deleted-means-deleted-poster.jpg`, at the moment `film.json` names. After a new soundtrack, `python site-tools/media.py index --film deleted-means-deleted-en` from the repository's root records it in `../audio.json` (see [Audio outside Git](../../../../docs/maintenance.md#audio-outside-git)). Then run `python site-tools/build_series.py`: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/deleted-means-deleted/think.en.js` and `think.es.js`. The release workflow renders the video, `deleted-means-deleted.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
