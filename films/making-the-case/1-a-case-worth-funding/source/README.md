# Rebuilding A case worth funding

*A case worth funding*, film 1 of 4 of *Making the case*, the second series of the module *Data management*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, the module's mark (`films/a-plan-in-ninety-days/shared/src/mark.js`), and the look and tools both people modules share, in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/), whose [README](../../../the-new-skills/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `cwf_` or `CWF_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order (the module's mark first), the moment its poster shows (the one page on the council's screen, its ask answered), the words the voice respells (Haudenosaunee, Rohan Desai, Novak, HR, Jun), its opening story (`ditch`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year, a date or a sum says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the team's room, once the case's parts have left the wall, as it becomes the title card, and the one page's four parts, as they become the end card. |
| `src/cwf_canal.js` | The opening's places and pictures, New York State from 1816 to 1825, drawn plainly in the module's light: the state from above (the lakes, the Hudson, the Mohawk's valley, hills and the sea), with its names, the wagon road, the canal's route, dug and open, the boat and the Haudenosaunee nations' names drawn live over it; a farm at the forest's edge; the legislature's hall in Albany; the cutting, being dug; a ton's cost before and after, the tolls adding up to what the canal cost, and the case to the legislature, on sheets; a farm family, DeWitt Clinton and two diggers, dressed for their time, never likenesses. |
| `src/cwf_uni.js` | The university's places and the case's pieces: the team's room in May's morning light, and the council's room with its timber dado; the old warehouse; the Five Case Model's questions as a checklist; the three options; the warehouse's own logs; option C's costs, once and every year; what stops and what starts, and the saving; the payback, month by month; the benefits with their owners and dates; the one page on the council's screen, whose words come in only once the camera is close enough to read them; the page's four parts; and Rohan Desai, as the module's numbers seed him. |
| `src/cwf_scenes.js` | The seven chapters. The opening dissolves from place to place over the map, the farm, the hall and the cutting, and ends on the team's room. Chapters 2 to 5 are one room, where the camera stays and the sheets on the wall change, and they glide on into each other (`ag_cutInto`); chapter 6 cuts to the council's room, where the camera glides close to the page and to Mei, and back. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: an Aeolsklavier, the keyboard of wooden free reeds that Schortmann of Buttelstedt made about 1825, the year the canal opened, played plain, soft and mid-low; its partner, the same instrument's pedal rank an octave lower. The mark: three short chords side by side, the options, then the third again, held, coming home to E: one clear ask, answered. E major, C sharp minor for the opening's problem, tuned pure. Each sound uses the same word and offset as the picture in `src/cwf_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the shared tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/making-the-case/1-a-case-worth-funding/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, hands stay steady, and nothing is painted past a person's picture
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/a-case-worth-funding.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/a-case-worth-funding/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/a-case-worth-funding-poster.jpg`, at the moment `film.json` names. The soundtrack's pointer is the film's `audio.json`, written by `python site-tools/media.py index --film a-case-worth-funding-en`; the MP3 is committed beside it (`git add -f`), and *Store audio outside Git* publishes its release when the change reaches main ([docs/maintenance.md](../../../../docs/maintenance.md), *Add or replace audio*). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the guidance and sources the film hands over to. "Pause and think" is `site/assets/a-case-worth-funding/think.en.js` and `think.es.js`: it stops after `options`, `costs` and `benefits`, with one question each. The release workflow renders the video, `a-case-worth-funding.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The film adds nothing to the example project: it shows the job, not the data work.
