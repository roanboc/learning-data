# Rebuilding The draft and the decision

*The draft and the decision*, film 2 of 3 of *The new skills*, the first series of the module *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../../people-first/shared/`](../../../people-first/shared/README.md)): whole people in the places where they work and meet, the film's ideas written by hand at a board and in notebooks. It was first drawn in the module's *Sunlit plaster* and made again on 18 November 2026, word for word on the voice.

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the agent's notes, the line "A booked hour is a used hour" ringed in amber), the words the voice respells (Kasparov, Topalov, León, "timetabling", Reyes, Jun, and "A I"), its opening story (`chess`), no chapter where the score may pulse, and `"logos": true` for dbt's mark. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the draft and the hand's one change, as they become the title card; and the four steps leaving the agent and the person at one table, as it becomes the end card. |
| `src/ddc_chess.js` | The opening, chess from 1997 to 2005, in ink line (prefix `ddc_`): the match hall in New York, a chess club, the hall in León, a home at night with three screens, a supercomputer's cold room; a chessboard on a table seen from the side; the players, nobody's likeness; and `ddc_desk`, someone at a desk with a screen drawn on it. |
| `src/dd_uni.js` | The university in April 2027, in the kit's places (the team's room, Helena's corner, the campus, a teaching room, the board seen close, the notebook): who sits where, a screen's callout, the boards' rows (what tests check, the three things, either side of the draft, the Future of Jobs Report) and the five pages of notes. |
| `src/dd_scenes.js` | The seven chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand. Every moment is timed to a line's start or to a word in it (`wAt()`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a tangent piano, dry and light, one string to a note, and its partner, the same instrument's bass strings under the left hand, touched softly and heard only under a person's decision. The mark: one phrase played evenly for the agent's draft (G B D E D B A), then with its last note changed by the hand (home on G, held) for a person's check and decision. G major, E minor for the opening's problem and for what the draft assumed, tuned pure from G. Each sound uses the same word and offset as the picture in `src/dd_scenes.js`: change one, change both. The boards' and the notebooks' sounds come from the film itself, as each row is written (the people kit's `tools/pens.py`). |
| `tools/` | Each other tool runs the people kit's tool (`../../../people-first/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/the-new-skills/2-draft-and-decision/source/`:

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
python tools/render.py --workers 4   # dist/draft-and-decision.mp4
```

The voice cache knows each line's words: after changing a line, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only what changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/draft-and-decision/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/draft-and-decision-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film draft-and-decision-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the readings the film hands over to. "Pause and think" is `site/assets/draft-and-decision/think.en.js` and `think.es.js`: it stops after `assumed`, `frame` and `review`, with one question each. The release workflow renders the video, `draft-and-decision.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The film shows no code from the example project: its draft is a card, and the glossary's *Room use* is the one the data management film *Prototype first* uses.
