# Rebuilding Memory: from one chat to the team

*Memory: from one chat to the team*, film 4 of 9 of *Agents at work on data*, the second series of the module on AI agents in data work, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, and the module's look and tools in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/), whose [README](../../../what-an-agent-is/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `tm_`, `TM_` or `TM`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the team's memory reaching three agents), the words the voice respells (Tulving, Mei, Jun, AI), and its opening story (`approach`). No chapter may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year or a count says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines (the longest after the crash, in silence), and two wordless moments: the title card after the opening, and the end card. |
| `src/places.js` | The opening's places, painted once in the module's matte style, each with its place and year on a tag: the low cloud over the hills west of Washington, with the ridge in the way and the jets of the time, plain, with no airline's colours; the approach control room of 1974 in the dark, lit by its radar; the side view of the approach, not to scale, with the crew's path and the chart's heights; the three crew rooms, their pinboards and the notice that stops at the wall; NASA's office of 1976, its cabinets and its tray; and the people of the time, dressed for it (pilots, controllers, a mechanic, NASA's analyst), composites, never real people. Cloud, rain and the radar's light are never the module's meaning colours. |
| `src/memory.js` | The lab's pieces, in the module's colours: the agents, the session's card and its closed pill, an agent's own memory, the team's notes kept by hand, the long session record with its masked sample rows, the fact, preference and decision cards, the proposed entry and its fields (Lesson, Learned in, Confirmed by, Approved by, History), the stamps, the team's memory as an oak card file on the wall with its ticked cards and the dashed blue lines to each agent, a lesson's three homes, the planted file and its hidden line. |
| `src/scenes.js` | The seven chapters, each a few shots. `tm_shots` is the module's `ag_shots`: in one room the camera glides on and never cuts, and what changes fades; a later moment there, or a new page, passes through the bare lab or crew rooms (`later: true`); where something stays while the moment goes on, it's one shot, and what stays slides (the proposed entry, which Mei reads; Mei comes over to Jun, as in *Context engineering*); between rooms a shot dissolves in. The chapters that open in the lab the last one ends in glide on from its camera (`ag_cutInto`). The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a viola d'amore, bowed softly, whose seven sympathetic strings, tuned to B major, ring on by themselves after the bow stops (the team's memory: what one string learns, the others answer), damped in 1974 and wherever a lesson stays with one person, in a small wooden room whose level is set by what it rings below 1.9 kHz, each held note kept at its own level; and a dry alto ocarina, which stops the moment the breath does, for a session and for the warning one airline kept to its own pilots. G sharp minor for the night of the crash, B major after, tuned pure from B. No music and no sound from just before the jet strikes the ridge to "Six weeks before". Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/agents-at-work-on-data/4-memory-for-the-team/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice, no arm jumps, nothing jumps where a shot changes, nothing painted past a person's picture
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, nothing beats, nothing pulses, and held notes keep their level in the room
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/memory-for-the-team.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/memory-for-the-team/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/memory-for-the-team-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/memory-for-the-team/think.en.js` and `think.es.js`: it stops after `weeks`, `kinds`, `team` and `wrong`, with one question each. The release workflow renders the video, `memory-for-the-team.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
