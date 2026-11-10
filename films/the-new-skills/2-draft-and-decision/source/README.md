# Rebuilding The draft and the decision

*The draft and the decision*, film 2 of 3 of *The new skills*, the first series of the module *Leading data people*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../shared/`](../../shared/), whose [README](../../shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `dd_` or `DD_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the agent's notes, the line "A booked hour is a used hour" ringed in amber), the words the voice respells (Kasparov, Topalov, León, "timetabling", Reyes, Jun, and "A I"), its opening story (`chess`), no chapter where the score may pulse, and `"logos": true` for dbt's mark. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the draft and the hand's one change, as they become the title card; and the four steps leaving the agent and the person at one table, as it becomes the end card. |
| `src/dd_marks.js` | GitHub's Invertocat, the black version from GitHub's official logo pack, unaltered, for Ivy's pull request (credited in [`NOTICE.md`](../../../../NOTICE.md)). |
| `src/dd_chess.js` | The opening's places and people, in the module's matte language and lit from the right like its rooms: the hall in New York in May 1997 (`ddHall`), the stage in León in 1998 (`ddLeon`) and a room at home on an evening in 2005 (`ddHome`); the champion, his opponent in León and the two amateurs, drawn as people of their time, never as likenesses; the machines as machines of their years, with no maker named or shown; the boards, the screens with each program's move as an arrow, and the 2005 tournament's sheet. |
| `src/dd_uni.js` | The university's side: the team's room on an April morning (`ddMorning`), Graham's office on a grey day (`ddGraham`) and the room late in the day (`ddLate`); the team's agent, the agent films' ceramic sphere with its violet band (`dd_agent`); its draft, notes and tests; the 100 booked hours as the sensors saw them; the glossary's word; room 1.02's week by hand; and the pull request. |
| `src/dd_scenes.js` | The seven chapters, shot by shot. In one room the camera glides from one framing to the next and only what changes fades; a later moment in a room (`later:true`) lets what was there leave first; between rooms a shot dissolves, or cuts where both would show the same people. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a tangent piano, dry and light, one string to a note, and its partner, the same instrument's bass strings under the left hand, touched softly and heard only under a person's decision. The mark: one phrase played evenly for the agent's draft (G B D E D B A), then with its last note changed by the hand (home on G, held) for a person's check and decision. G major, E minor for the opening's problem and for what the draft assumed, tuned pure from G. Each sound uses the same word and offset as the picture in `src/dd_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film. |

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
