# Rebuilding Explaining so people can decide

*Explaining so people can decide*, film 2 of 3 of *Working with people*, the second series of *Leading data people*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit, and the module's look and tools in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/), whose [README](../../../the-new-skills/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `ed_` or `ED_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the week's picture at the peak, beside the week's average), the words the voice respells (Reyes, Mei, Tufte, Knaflic and Nussbaumer, and Jun and AI, as in every film of the module), its opening story (`story`: the first chapter), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice reads differently from its caption says it in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the week's average splitting into its hours as it becomes the title card, and the page with its picture, alone, as it becomes the end card. |
| `src/ed_pilot.js` | The opening, 1950 to 1952, in the module's matte language, lit from the right like the team's rooms: the measuring room (`edLab`), the designers' drawing office (`edDraw`) and Daniels's office (`edOffice`); the flyers in a row, the average man as a jointed template, the doorway, the cockpit cut open and its pilots' reach, the curve with its middle 30%, the count's 4,063 dots and its table, the note typed again in its own words, and the range to design for. No aircraft, no jet and no radio. |
| `src/ed_uni.js` | The university, May and June 2027: Graham's office, the registrar's office, the team's room late and on a Monday morning, and the University Council's room; the week's bookings by day and hour (the module's `numbers.md`), Ivy's twelve-page draft, Minto's pyramid, Graham's one page, the week's picture (a heat map), Helena's route, the booked hours nobody used, and the University Council's table. |
| `src/ed_scenes.js` | The seven chapters, each a run of shots: no average pilot, the opening, to the title; one page for the University Council; the decision first; what it turns on; what isn't known, in their words; they decide; and on Monday, back to Daniels and what to do. In one room the camera glides on and only what changes fades; where two shots show the same page, the film cuts (into the registrar's office, to the three copies, into the University Council's room). Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish; the words used are listed at its top. |
| `tools/score.py` | The film's music and sounds: an aluphone (spun aluminium bells, struck softly with a yarn mallet and stopped by a hand), and its own largest bells with a softer mallet as its partner; G minor for the doorway, the cockpit and what isn't known, B-flat major for the rest, every note tuned pure from B-flat. The mark is one note set apart, then the chord it belongs to. Each sound uses the same word and offset as the picture in `src/ed_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/working-with-people/2-explaining-to-decide/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every word reads, places paint in time, nothing shows twice or jumps, no arm jumps, nothing reaches past a person's picture
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, held notes keep their level, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/explaining-to-decide.mp4
```

`tts.py` reuses a line's voice only while its spoken words, voice and model are unchanged, so an edited line is voiced again on its own. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/explaining-to-decide/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/explaining-to-decide-poster.jpg`, at the moment `film.json` names. After a new soundtrack, `python site-tools/media.py index --film explaining-to-decide-en` from the repository's root records it in `../audio.json` (see [Audio outside Git](../../../../docs/maintenance.md#audio-outside-git)). Then run `python site-tools/build_series.py`: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/explaining-to-decide/think.en.js` and `think.es.js`. The release workflow renders the video, `explaining-to-decide.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
