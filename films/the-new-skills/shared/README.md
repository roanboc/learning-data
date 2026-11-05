# The modules' shared look and tools

Everything the films of *Leading data people* and of *Data management* share: the look assumed on 5 November 2026 for the author to review, **Sunlit plaster** (the module's *Decided* table, in [`../proposal.md`](../proposal.md)), the team's rooms and their light, the people lit by the room, sheets on the wall, the things in a room, the teaching building cut open, and the tools that build and check a film. *The new skills* keeps it here; the other series of both modules (*Working with people*, *Leading a data team*, *Ownership and performance*; *A plan in ninety days*, *Making the case*, *Small steps, measured*) bundle it as it is, as the agent films' later series bundle `films/what-an-agent-is/shared/`.

Never change these files for one film. A film's own pictures, places and helpers go in its own `source/src/`, with a prefix of its own (such as `mh_` for *Many hats, one picture*); a change every film needs goes in a pull request of its own, and it is a new version of every film whose `release.json` names this folder (AGENTS.md, *A shared fix is a new version of every film*).

## How a film uses it

A film lives in its series' folder, such as `films/the-new-skills/<n>-<slug>/` or `films/making-the-case/<n>-<slug>/`: `script.md`, `site.json`, `release.json`, `decided.md`, `captions/`, and `source/` with:

- `film.json`: `key`, `title`, `sub`, `howto` (the page's line on what the colours mean), `src` (its own files, in order), `poster` ([chapter, line, offset] for the poster's moment), `say` (the voice's respellings: `["\\bJun\\b", "Joon"]` and `["\\bA I\\b", "AI"]` in every film, `["\\bNoor\\b", "Nuur"]` where Noor is said, and each name the voice gets wrong), `story` (the chapters of its opening story, where music may play throughout), `urgent` (the chapters where its story turns to an error or a rush, the only ones where the score may pulse), and `"logos": true` for a film that shows Databricks' or dbt's marks (*The Inner Life of Data*'s `logos.js`).
- `src/narration.js` (one line per id, chapter by chapter), `src/vodur.js` (made by `tools/tts.py`), `src/breath.js` (longer pauses), its own pictures and `scenes.js`, and `src/i18n/es/captions.js`.
- `tools/score.py` (its music and sounds) and, for every other tool, a three-line runner. In a film of *The new skills*:

  ```python
  # Runs the module's build.py (films/the-new-skills/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
  import pathlib, sys
  sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / "shared" / "tools"))
  import run; run.tool("build.py")
  ```

  In a film of any other series of either module, the same three lines point here from its own `tools/`: `pathlib.Path(__file__).resolve().parents[4] / "the-new-skills" / "shared" / "tools"`. One each for `tts.py`, `build.py`, `check.py`, `legible.py`, `pace.py`, `stills.py`, `audio.py`, `quiet.py`, `captions.py`, `render.py` and `publish.py`.

Its `release.json` `paths` name its own `source` (less its Spanish captions), this folder, the agent films' kit, *From words to data*'s tools, the governance films' checks, *A Sharper Sketch*'s scene and *The Inner Life of Data*'s engine. For a film at `films/<series>/<n>-<slug>/`:

```json
"paths": [
  "films/<series>/<n>-<slug>/source",
  ":(exclude)films/<series>/<n>-<slug>/source/src/i18n/es/captions.js",
  "films/the-new-skills/shared",
  "films/what-an-agent-is/shared",
  "films/from-words-to-data/shared/tools",
  "films/data-governance/shared/tools/names.py",
  "films/data-governance/shared/tools/cues.py",
  "films/data-governance/shared/tools/twice.py",
  "films/data-governance/shared/tools/steady.py",
  "films/data-governance/shared/tools/jump.py",
  "films/data-governance/shared/tools/quiet.py",
  "films/data-governance/shared/tools/held.py",
  "films/a-sharper-sketch/source/src/sketch3.js",
  "films/inner-life-of-data/source/src/core.js",
  "films/inner-life-of-data/source/src/style2.js",
  "films/inner-life-of-data/source/src/ui3.js",
  "films/inner-life-of-data/source/src/engine3.js",
  "films/inner-life-of-data/source/fonts"
]
```

and `films/inner-life-of-data/source/src/logos.js` too, with `"logos": true`.

Then, from the film's `source/`: `python tools/tts.py`, `build.py`, `check.py`, `legible.py --overlaps`, `pace.py`, `stills.py --size 1920`, `quiet.py` (the sound, before it's mixed, and again after every change to `tools/score.py`), `audio.py`, `build.py` again, `captions.py` (and `FILM_LANG=es python tools/captions.py`), and `publish.py` for the site (`--keep-sound` when only the pictures changed).

To try a frame before a film exists, write `async function draft(ctx) { ... }` in a file and run `python films/the-new-skills/shared/tools/sketch.py draft.js build/draft.png`: it draws one 1920 by 1080 frame with every call below.

## What each file holds

Sizes are in the 1920 by 1080 frame. Every word is at least 28 px as seen, drawn with `lp_T` (so `legible.py` measures it), and nothing but the captions goes below y 890. Every top-level name starts with `lp_` or `LP_`. Each file's first comment says how to call what it holds, option by option.

**`src/look.js`**: the colours, and what each means in every film of both modules (`LP`): **blue** design and plans, **green** done or value, **amber** risk, cost or waiting, **orange** data, **violet** only an agent; the wall, the shade, the sun, the floor, timber and graphite mean nothing, and people wear none of the five. Words: `lp_T`, `lp_tw`, `lp_wrap`, `lp_label`. The room: `lp_paintRoom(c, o)` paints a limewash wall lit from a window on the right, the sun's patch of panes and leaf shadows on it, a skirting and a timber floor (only under the captions), in one of five lights, `LP_LIGHT`: `"day"` (the afternoon, the default), `"morning"`, `"late"`, `"grey"` and `"evening"` (the window dark, a lamp's pool at `o.lamp`). The module's place is `lpRoom`, the team's room on an afternoon; a film adds its own in its own source, painted once: `AG_PLACES.mhMorning = c => lp_paintRoom(c, {light: "morning", seed: 2})`. `lp_roomLight` lays a place's light over things drawn in it, and `lp_sun` the sun's patch on anything.

**`src/people.js`**: `lp_person(ctx, who, x, y, s, o)` draws a person exactly as the agent films' `ag_person` does (an adult's proportions, one three-quarter head, arms down, a hand only on what the story is about with `pose: "hold"`; the same `x`, `y`, `s` and `o`), lit by the room: the side towards the window a little warm, the side away from it in the room's shade, and their soft shadow on the wall behind, down and to the left (`o.light`: `light`, the place's light; `warm`; `shade`; `wall`, 0 for someone far from a wall or out of doors). `o.a` fades a person, whole. The cast it adds, `LP_CAST`: `"helena"` (Helena Novak, the data manager), `"ivy"` (Ivy Reyes, a data analyst) and `"graham"` (Graham Ellis, Facilities); everyone else is the agent films' (`"noor"`, `"sam"`, `"jun"`, `"mei"`, `"yusuf"`, `"clara"`, `"anil"`, `"david"`) or a spec of the film's own. `lp_crowd(i)` is one of eight people for a crowd, such as students in a teaching room. `lp_nameTag` writes a name and a role. While a check follows people (`steady.py`, `jump.py`, `twice.py`), `lp_person` hands each person to it on the frame too, unseen, so a person drawn on a canvas of their own is still followed.

**`src/cards.js`**: words on sheets of thick paper pinned to the wall, with a band of colour only when the colour means something: `lp_sheet`, `lp_textSheet(ctx, x, y, w, {kick, title, lines, sub}, o)` (a sheet that fits its words, springing with `o.k`, its lines coming in with `o.u`), `lp_figure` (one big number), `lp_bars` (bars on a sheet, with a dashed level across them); `lp_pill` (a verdict, white words on its colour), `lp_tag` (an outlined tag), `lp_icon`; `lp_kicker(ctx, "1", "Many hats, one picture")`; `lp_sceneTag(ctx)` (*The university, 2027 · imagined*, top right); `lp_mark` (the module's mark: five people in a ring, joined, drawing itself); `lp_title(ctx, S, t, t0, title, sub, line)` and `lp_end(ctx, S, t, t0, title, line, "Film 1 of 3", series)`. *Data management* passes `o.module` and `o.mark` (its own mark) to both.

**`src/things.js`**: what stands in a room, matte, with soft shadows down and to the left: `lp_table` (it returns the height to cut people at behind it: draw them first with that `cut`, then the table), `lp_screen` (a screen on the wall, `o.draw` drawing what it shows), `lp_laptop`, `lp_door`, `lp_chairs`.

**`src/section.js`**: the university's buildings cut open like an architect's section, drawn live so the camera can go close: `LP_TEACHING` (the teaching building: four floors, fourteen rooms, `"G.01"` to `"3.03"`), `lp_section(ctx, plan, {room: (id, box) => ({lit, dim, edge})})` (each room lit when it's in use, dimmed when it's not part of the story, outlined in a colour when the colour means something), `lp_roomBox`, `lp_roomCam` (a camera key that frames a room), `lp_seat` (where a person sits behind a room's desk, and where to cut them). The sky and the ground behind it are the place `lpSky`.

**`src/page.html`**: the standalone player page.

**`tools/`**: `lang.py` (where everything lives), `build.py` (what a film is made of, in order, and its checks: no name declared twice, no key named twice in one object, every cue word whole in its line, no caption over 140 characters), `quiet.py` (the governance films' sound check, run with this module's `lang.py`), `run.py` (runs these, then the agent films' `check.py` and `edges.py`, then *From words to data*'s other tools, on a film) and `sketch.py`. The agent films' `check.py` draws every frame and runs the governance films' `twice.py`, `steady.py` and `jump.py` and its own `edges.py`, along with the 28 px rule, the places' paint times and the release-status words.

The films bundle the agent films' `kit.js` (the camera and its shots, places painted once, words and timing), `people.js`, `agent.js` (the agent, where a film has one: the ceramic sphere with its violet band) and `finish.js`, but not their `room.js` or `cards.js`: the white lab and its cards are that module's look, not this one's. On 5 November 2026 the kit was run end to end in a throwaway film (every frame drawn and checked, the 28 px rule, the places' paint times, `legible.py --overlaps`, `pace.py` and full-size stills): every check passed.
