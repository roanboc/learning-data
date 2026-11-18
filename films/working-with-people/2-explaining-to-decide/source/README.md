# Rebuilding Explaining so people can decide

*Explaining so people can decide*, film 2 of 3 of *Working with people*, the second series of *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../../people-first/shared/`](../../../people-first/shared/README.md)): whole people in the places where they live, work and meet, the film's ideas written by hand at a board and in notebooks. It was first drawn in the module's *Sunlit plaster* and made again on 18 November 2026, word for word on the voice. Every name it declares starts with `ed_`, `ED_`, `edp_` or `EDP_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the week's picture at the peak, beside the week's average), the words the voice respells (Reyes, Mei, Tufte, Knaflic and Nussbaumer, and Jun and AI, as in every film of the module), its opening story (`story`: the first chapter), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice reads differently from its caption says it in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the week's average splitting into its hours as it becomes the title card, and the page with its picture, alone, as it becomes the end card. |
| `src/edp_air.js` | The United States Air Force, 1950 to 1952, in ink line (prefix `edp_`): the measuring room, the designers' office, a doorway, a cockpit's mock-up, Daniels's office with its board and typewriter, a street with a car; and the people of the time, nobody's likeness. |
| `src/ed_uni.js` | The university in 2027, in the kit's places (the team's room, Graham's corner, the campus, a teaching room, the board seen close, the notebook): who sits where, a screen's callout, the boards' rows and the notebooks' pages. |
| `src/ed_scenes.js` | The seven chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand. Every moment is timed to a line's start or to a word in it (`wAt()`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish; the words used are listed at its top. |
| `tools/score.py` | The film's music and sounds: an aluphone (spun aluminium bells, struck softly with a yarn mallet and stopped by a hand), and its own largest bells with a softer mallet as its partner; G minor for the doorway, the cockpit and what isn't known, B-flat major for the rest, every note tuned pure from B-flat. The mark is one note set apart, then the chord it belongs to. Each sound uses the same word and offset as the picture in `src/ed_scenes.js`: change one, change both. The boards' and the notebooks' sounds come from the film itself, as each row is written (the people kit's `tools/pens.py`). |
| `tools/` | Each other tool runs the people kit's tool (`../../../people-first/shared/tools/run.py`) on this film. |

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
