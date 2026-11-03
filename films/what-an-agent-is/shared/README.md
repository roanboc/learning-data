# The module's shared look and tools

Everything the films of the module on AI agents in data work share: the look the author chose on 3 November 2026 (the white lab made Nordic, style X of the style prototype), its people, the agent, the cards, and the tools that build and check a film. *What an agent is* keeps it here; the module's later series bundle it as it is, as the governance series bundle `films/data-governance/shared/`.

Never change these files for one film. A film's own pictures, places and helpers go in its own `source/src/`, with a prefix of its own (such as `dm_` for *Decades in the making*); a change everyone needs goes through the series thread, in its own pull request.

## How a film uses it

A film lives in `films/what-an-agent-is/<n>-<slug>/`: `script.md`, `site.json`, `release.json`, `decided.md`, `captions/`, and `source/` with:

- `film.json`: `key`, `title`, `sub`, `howto` (the page's line on what the colours mean), `src` (its own files, in order), `poster` ([chapter, line, offset] for the poster's moment), `say` (the voice's respellings: `["\\bJun\\b", "Joon"]` and `["\\bA I\\b", "AI"]` in every film, and each name the voice gets wrong), `story` (the chapters of its opening story, where music may play throughout; the first by default), and `urgent` (the chapters where its story turns to an error or a rush, the only ones where the score may pulse; none by default).
- `src/narration.js` (one line per id, chapter by chapter), `src/vodur.js` (made by `tools/tts.py`), `src/breath.js` (longer pauses), its own pictures and `scenes.js`, and `src/i18n/es/captions.js`.
- `tools/score.py` (its music and sounds) and, for every other tool, a three-line runner:

  ```python
  # Runs the module's build.py (films/what-an-agent-is/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
  import pathlib, sys
  sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / "shared" / "tools"))
  import run; run.tool("build.py")
  ```

  one each for `tts.py`, `build.py`, `check.py`, `legible.py`, `pace.py`, `stills.py`, `audio.py`, `quiet.py`, `captions.py`, `render.py` and `publish.py`. A film of a later series points at this folder instead (`parents[4] / "what-an-agent-is" / "shared" / "tools"` from its own `tools/`).

Then, from the film's `source/`: `python tools/tts.py`, `build.py`, `check.py`, `legible.py --overlaps`, `pace.py`, `stills.py --size 1920`, `audio.py`, `quiet.py`, `build.py` again, `captions.py` (and `FILM_LANG=es python tools/captions.py`), `render.py`, and `publish.py` for the site.

To try a frame before a film exists, write `function draft(ctx) { ... }` in a file and run `python films/what-an-agent-is/shared/tools/sketch.py draft.js build/draft.png`: it draws one 1920 by 1080 frame with every call below.

## What each file holds

Sizes are in the 1920 by 1080 frame. Every word is at least 28 px as seen, drawn live with `ag_T` (so `legible.py` measures it), and nothing but the captions goes below y 890.

**`src/kit.js`**: the palette (`AG`: `ink`, `mut`, and the colours that mean the same in every film: `blue` tools and structure, `violet` the model thinking, `orange` data coming back, `green` a check that passes, `amber` a check that fails or a loop; `AG_OAK` for wood); words (`ag_T(ctx, s, x, y, {w, size, col, a, ls, align, f})`, `ag_tw`, `ag_wrap`, `ag_lines`); timing (`wAt(sc, "line", "word", offset)`, the moment a word is said, which `build.py` checks: call it directly, not through a helper of your own; `ag_in`, `ag_io`, `ag_sine`, `ag_eo`, `ag_spr` a spring that settles, `ag_keys`); the camera (`ag_shots(ctx, S, t, end, [{at, place, keys: [[t, x, y, zoom]], draw(ctx, t, cam)}], dissolve)`, glides of at least 1.4 s, and a slow push in each shot); places painted once (`AG_PLACES.name = ctx => ...`, `ag_place(name)`; `check.py` times each, at most 2 s); scratch canvases (`ag_buf`); matte shapes (`ag_soft`, `ag_inner`, `ag_floorShadow`, `ag_rect`: shape functions never call `beginPath`; an inner shadow is cast only from the area round its shape, so a place of many shapes paints fast).

**`src/room.js`**: the lab, `ag_place("lab")`, and at night, `ag_place("labNight")`, with a floor lamp. A variant with quieter marble where a film puts words: `AG_PLACES.labLeft = c => ag_paintLab(c, {quiet: [[x, y, rx, ry, k]]})`. Draw what stands in the room, then `ag_roomLight(ctx, 1)` (or `{night: true}`) over it, then the words and cards. Things in it: `ag_desk(ctx, x, y, w, {depth})`, `ag_screen(ctx, x, y, w, h, {draw, stand})`, `ag_picture(ctx, x, y, w, h, {img, draw, frame})` (a framed picture on the marble, for a scene from the opening that comes back), `ag_sandbox(ctx, x, y, w, {label})` (an oak tray on the floor where drafts go, "Sandbox · drafts only"; it returns its inside) and `ag_glass(ctx, x, y, w, h, {label})` (a pane of glass in front of production, "Read only").

**`src/people.js`**: `ag_person(ctx, who, x, y, s, o)` draws a person from the waist up, with an adult's proportions, facing right (`flip` for left); `(x, y)` is where the neck meets the shoulders and `s = 1` is a head 225 px tall. `who` is one of the cast (`"jun"`, `"yusuf"`, `"mei"`, `"noor"`, `"sam"`, `"anil"`, `"clara"`, `"david"`) or a spec for someone of another time (see the file's head: skin, hair, top, a hat or clothes of their own). `o`: `t`, `pose` (`"point"`, `"explain"`, `"hold"`, `"desk"`, `"chin"`, or angles), `pose2` and `mix` to move between two, `hold` (what the hand holds), `talk` (`ag_talk(sc, "line", t)` while their line is said), `gaze`, `nod`, `smile`. People end flat under the waist, 504·s below the neck: keep `y + 504·s` at least 1080, or draw a desk first and pass `cut` (its back edge), or `covered` when a card hides it; a render or a check stops with an error where the cut shows. `cut` hides only the body and the arms that hang: an arm moving between `pose` and `pose2` still shows below it, so behind a desk a gesture starts and ends at `"desk"` (or a pose whose arms stay above the desk), never at `"hang"`.

**`src/agent.js`**: `ag_model` (the sphere; `core`, `think`, `label`; `{only: "light"}` redraws its band glowing over a night pass), `ag_modelLight`, `ag_ring`, `ag_step`, `ag_loop(ctx, x, y, {p, lit, col, pulse, steps})` (the model in its ring with Plan, Act and Check, or steps of your own; it returns the steps' boxes), `ag_reach(ctx, curve, u, {data, grip})` (a hand reaching along a curve, with data coming back), `ag_tool(ctx, x, y, w, h, name, {sub, icon, touch})` (a tool, read only unless it says otherwise), `ag_pellet`, `ag_verdict(ctx, x, y, text, "pass" | "loop" | "fail", a)`, `ag_badge(ctx, x, y, text, {t, drop})` (a badge on a lanyard, such as "Junior").

**`src/cards.js`**: `ag_textCard(ctx, x, y, w, {kick, title, sub}, {tail, edge, k})` (a card that fits its words, with a tail that points, springing from it), `ag_box`, `ag_card`, `ag_pill`, `ag_label`, `ag_evidence(ctx, x, y, w, words, items, {open, side})` (an answer with a paperclip and "Evidence attached", its evidence cards clipped behind it until `open` fans them out, each in the colour that says what it is), icons (`ag_tick`, `ag_loopIcon`, `ag_lock`, `ag_warn`, `ag_pen`, `ag_arrowHead`, `ag_clip`), `ag_kicker(ctx, "1.1", "Decades in the making")`, `ag_mark` (the series' mark: an oak ring drawing itself round a small sphere), `ag_title(ctx, S, t, t0, title, sub, "FILM 1 OF 9 · WHAT AN AGENT IS")` and `ag_end(ctx, S, t, t0, title, line, "Film 1 of 9", series)`.

**`src/finish.js`** and **`src/page.html`**: what a film needs before it starts (the fonts, each place, painted once: the video at once, the site's player the first at once and the others after Play) and the video's motion blur; the standalone player page.

**`tools/`**: `lang.py` (where everything lives), `build.py` (what a film is made of, in order, and three checks: no name declared twice, every cue word whole in its line, no caption over 140 characters), `check.py` (every moment draws, and every place paints in time), `quiet.py` (when the music plays, and what may pulse), `run.py` (runs these, the governance films' `names.py` and `cues.py`, and *From words to data*'s other tools on a film), and `sketch.py`.
