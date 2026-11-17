# The people kit: Leading data people's look and tools

The films of *Leading data people* are about people, so they draw people first: whole, in a place where they act, meet or move, with faces that react and hands that rest on things. The author found the module's films disappointing: half-figures lined up in front of a plain wall, a giant bust beside small whole people, cards and charts carrying the story while the people stood by ([issue 391](https://github.com/roanboc/learning-data/issues/391), and 17 November 2026). He asked for "a more cartoon or soft style", easy to draw people in and light to play, and chose **Ink line** among four looks on 17 November 2026: flat colour, with one even dark line round every form.

The kit is that look, a person who can stand, walk, sit, kneel, turn and react, the things people work with, the words on the frame, the university's places, and the tools that build and check a film. *Owning the outcome* was drawn with it before any other film.

Never change these files for one film. A film's own pictures, places and helpers go in its own `source/src/`, with a prefix of its own (such as `oo_` for *Owning the outcome*); a change every film needs goes in a pull request of its own, and it is a new version of every film whose `release.json` names this folder (AGENTS.md, *A shared drawing/timeline fix is a new version of every consumer*).

## The rules a film is staged by

Each rule comes from a fault the author named. Where a rule can be measured, `tools/people.py` checks it, and `tools/check.py` runs that check on every frame.

| Rule | How | The check stops on |
|---|---|---|
| **Whole people, in a place.** Everyone is drawn from head to feet, standing on a floor, in a room, on a path or a hill. | `PK.person`, `PK.atDesk`, `PK.seated`; a place from `PK.place`, or the film's own | a half-figure: someone's upper half with no lower half |
| **One eye line in each place.** A standing adult's eyes are on the place's eye line wherever they stand, so near people are large and far people small, and all belong to one picture. | `PK.hAt(floor, eye)` gives the height at each depth | two grown people whose eye lines differ by more than a tenth of their height |
| **Nobody in a row.** People stand at different depths, in twos, one seated, one nearer. | stage by depth: `floor` and `PK.hAt` | three or more standing at one depth and one size, apart, for 3 s or more |
| **Hands hold, carry, give, take, write, rest or greet.** Nobody waves a hand about to explain. | `o.reachN`, `o.reachF`, `o.hold`; the stances `ease`, `clasp`, `listen` | a raised forearm with nothing held or reached for, for 2.5 s or more |
| **A body that folds is seen from the side.** Someone who sits, kneels, crouches or bends forward is drawn from the side, as their legs are; a standing person is three-quarters on (the author, 17 November 2026). | `PK.side(pose)` does it; `o.side` sets it by hand | |
| **Every pose is taken up from the one before**, over 0.3 to 0.5 s. Sitting down and standing up lean forward on the way. | `PK.poseMix`, `PK.walk`, `PK.poseSit` | a limb that jumps in one frame; a stand and a sit mixed, which is someone falling into a seat |
| **Faces react.** A listener takes in what is said: a nod, a look, a smile, a change of stance. | `PK.face(t, base, events)`; always give `o.t` | someone seen large who stays as they are for 14 s or more; someone drawn without the time, who is a statue |
| **Words hold a place, a name, something said, or one line to keep.** What people say is said, in a bubble over their head, in their own words. Charts and cards stay small and never stand in for a person. | `PK.card`, `PK.tag`, `PK.nameTag`, `PK.say` | a box of words over someone's head for 0.3 s or more |
| **People in every chapter, in more than one place.** | | a chapter with a person in view in less than 85% of its frames; a film with one place only |

The film ends on a person, with its last line (`PK.end`).

## How a film uses it

A film lives in its series' folder, such as `films/ownership-and-performance/<n>-<slug>/`: `script.md`, `site.json`, `release.json`, `decided.md`, `captions/`, and `source/` with:

- `film.json`: `key`, `title`, `sub`, `howto` (the page's line on what the colours mean), `src` (its own files, in order), `poster` ([chapter, line, offset] for the poster's moment), `say` (the voice's respellings, each name spelled as `site-tools/check_site.py`'s `VOICE_NAMES` has it), `story` (the chapters of its opening story, where music may play throughout) and `urgent` (the chapters where its story turns to an error or a rush, the only ones where the score may pulse).
- `src/narration.js` (one line per id, chapter by chapter), `src/vodur.js` (made by `tools/tts.py`), `src/breath.js` (longer pauses), its own pictures and scenes, and `src/i18n/es/captions.js`.
- `tools/score.py` (its music and sounds) and, for every other tool, a four-line runner. In a film of any series but *People first*:

  ```python
  # Runs the people kit's build.py (films/people-first/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
  import pathlib, sys
  sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[4] / "people-first" / "shared" / "tools"))
  import run; run.tool("build.py")
  ```

  In a film of *People first*, the path is `pathlib.Path(__file__).resolve().parents[3] / "shared" / "tools"`. One each for `tts.py`, `build.py`, `check.py`, `legible.py`, `pace.py`, `stills.py`, `audio.py`, `quiet.py`, `captions.py`, `render.py` and `publish.py`.

Its `release.json` `paths` name its own `source` (less its Spanish captions), this folder, the agent films' camera and finishing pass, *From words to data*'s tools, the governance films' checks, *A Sharper Sketch*'s scene and *The Inner Life of Data*'s engine. For a film at `films/<series>/<n>-<slug>/`:

```json
"paths": [
  "films/<series>/<n>-<slug>/source",
  ":(exclude)films/<series>/<n>-<slug>/source/src/i18n/es/captions.js",
  "films/people-first/shared",
  "films/what-an-agent-is/shared/src/kit.js",
  "films/what-an-agent-is/shared/src/finish.js",
  "films/from-words-to-data/shared/tools",
  "films/data-governance/shared/tools/names.py",
  "films/data-governance/shared/tools/cues.py",
  "films/data-governance/shared/tools/twice.py",
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

Then, from the film's `source/`: `python tools/tts.py`, `build.py`, `check.py`, `legible.py --overlaps`, `python ../../../../site-tools/fits.py`, `pace.py`, `stills.py --size 1920`, `quiet.py` (the sound, before it's mixed, and again after every change to `tools/score.py`), `audio.py`, `build.py` again, `captions.py` (and `FILM_LANG=es python tools/captions.py`), and `publish.py` for the site (`--keep-sound` when only the pictures changed).

To try a frame before a film exists, write `async function draft(ctx, t) { ... }` in a file and run `python films/people-first/shared/tools/sketch.py draft.js build/draft.png`: it draws one 1920 by 1080 frame with every call below (`--t 0,1.5,3` at several times, `--scale 2` at twice the size, `--look tint` in another look). Look at every new person at full size, facing both ways and in every pose the film gives them, before the film uses them.

## What each file holds

Sizes are in the 1920 by 1080 frame. Every word is at least 28 px as seen, and nothing but the captions goes below y 890. Each file is closed in a function of its own, so the only name the kit adds to a film is `PK`. Each file's first comment says how to call what it holds, option by option.

**`src/core.js`**: the helpers (`PK.u`: easing, colour mixing, a smooth curve through points, a tapering limb) and the looks. A look says how a shape, a line of detail and a shadow are painted, and how a person is proportioned. `PK.use("line")` is Ink line, the default and the module's look. The other three are skins of the same drawing, kept so a film is staged once for any of them: `"tint"` (soft line), `"soft"` (soft shapes) and `"paper"` (cut paper). `PK.C` holds the colours that mean something in every film of the module: **blue** plans and rules, **green** something done or of value, **amber** a risk or a cost, **orange** data, **violet** only an agent. They are for words and marks; people's clothes are soft, muted colours and never one of the five.

**`src/people.js`**: a person is a row in a table (skin, hair, clothes, what they wear on the face), a pose is a row of angles, and a face is three numbers.

- `PK.person(ctx, who, x, floor, h, pose, o)` draws anyone in any pose, whole, with their feet on the floor, and returns where their joints are (`J.hc` the head's centre, `J.hdN` the near hand). `o.flip` faces them left, or turns them round through the front; `o.expr`, `o.gaze` and `o.nod` are the face; `o.reachN` and `o.reachF` rest a hand on a point; `o.hold` draws what a hand holds; `o.part` draws the legs and the rest apart, for someone behind a table; `o.a` fades them as one picture; `o.t` is the time, for breath, blinks and the small life of someone who stays where they are.
- The cast, `PK.CAST`: `ivy`, `helena`, `graham`, `mei`, `sam`, `jun`, `noor`, `yusuf`, `marta`, `erin` and `tomas`, the university's people as the module's films know them. `PK.extra(i)` is one of many people nobody names, the same every time; `PK.KID` gives a child's proportions. A film's own people are rows like the cast's, in its own source.
- The poses, `PK.POSES`: `stand`, `listen`, `ease`, `clasp`, `armful`, `can`, `bend`, `sit`, `sitBack`, `sitWork`, `kneel`, `crouch`, and `wave` for a greeting. `PK.poseMix(a, b, t)` blends two; `PK.poseSit(k)` sits someone down or stands them up; `PK.poseWalk(step)` is a stride.
- `PK.walk(ctx, who, t, w, o)` walks someone from `w.x0` to `w.x1` between `w.t0` and `w.t1`: the stride grows out of the pose they stood in and dies into the pose they stop in. `PK.walkAt(t, w)` says where they are.
- The faces, `PK.EXPR`: `neutral`, `smile`, `worry`, `talk`, `listen`, `relief`, `think`, `glad`. `PK.face(t, base, events)` is a face through a shot in one row: a nod, a look, a smile, a line spoken, each at its moment. `PK.talk(t, t0, t1)` opens and closes a mouth while someone speaks.
- `PK.hAt(floor, eye)` is a standing adult's height where their eyes are on a place's eye line. `PK.among(t, points, dwell)` moves a hand at work from one thing to the next. `PK.side(pose)` says how far a pose turns the body to the side.

**`src/things.js`**: what people sit at, hold and work with: `PK.chair` (it turns round with whoever sits on it), `PK.table`, `PK.desk`, `PK.laptop`, `PK.monitor` (`o.draw` draws what it shows), `PK.board`, `PK.sheet`, `PK.mug`, `PK.pot`, `PK.plant`, `PK.clock`, `PK.door`, `PK.seedling`, `PK.potted`, `PK.tree`, `PK.cloud`, `PK.tick`. `PK.PAL` holds the colours of places and things.

**`src/words.js`**: words on the frame, each box made from its words as they are drawn, so the words can't leave it (`site-tools/fits.py`): `PK.card` (where and when, or a number), `PK.tag` (a few words in a pill), `PK.nameTag` (a name and a role over a head), `PK.bubble` and `PK.say` (something said, over the head of whoever `PK.person` returned; `o.cam` keeps it inside what the camera sees), `PK.kicker`, `PK.sceneTag` (*The university, 2027 · imagined*), `PK.mark` (the module's mark: five people in a ring), `PK.title` and `PK.end` (the title and end cards, over the picture, with whoever is there still in view; a last line that needs two lines breaks evenly, after a comma where one falls near the middle, never leaving a word or two alone).

**`src/places.js`**: the university's places, each painted once and kept as a picture (the agent films' `AG_PLACES`): `PK.place.team` (the data team's room), `PK.place.corner` (the manager's corner, close enough for faces), `PK.place.campus` and `PK.place.lecture` (a teaching room). A film lists the ones it uses, its opening place first: `AG_PLACES.ooTeam = PK.place.team`. `PK.ROOMS.<place>` holds each place's eye line, its floor lines and where its things are. A place paints only what is behind everyone; what people sit at or stand behind is drawn every frame with them, by the sets: `PK.atDesk` (someone working at a desk), `PK.seated`, `PK.audience` (a teaching room's seats, some taken), `PK.atBoard` (someone writing on a wall board, line by line), `PK.window` and `PK.windowFrame`. A camera closes in to about 1.3 at most on a kept picture; for faces, cut to a place painted closer.

**`src/page.html`**: the standalone player page.

**`tools/`**:

- `lang.py`: where everything lives.
- `build.py`: what a film is made of, in order, and its checks: no name declared in two files, no key named twice in one object, every cue word whole in its line, no caption over 140 characters.
- `check.py`: the film before a long render. It draws every moment, 30 a second, and stops on text under 28 px and on words that name a release status (*From words to data*'s `check.py` and `legible.py`); it times each place, painted from nothing; it finds anything shown twice, and anything that jumps, where the film changes shot or chapter (the governance films' `twice.py` and `jump.py`, which follow the kit's people too); then it runs `people.py`.
- `people.py`: the rules above, measured. Its limits are named at its top (`ROW`, `SCALE`, `AIR`, `JUMP`, `OVER_S`, `STILL`, `SHARE`, `PLACES`).
- `quiet.py`: the governance films' sound check, run with this kit's `lang.py`.
- `run.py`: runs a tool on a film: the kit's own first, then *From words to data*'s (`tts.py`, `audio.py`, `captions.py`, `legible.py`, `pace.py`, `stills.py`, `render.py`, `publish.py`).
- `sketch.py`: one frame, before a film exists.

The films bundle the agent films' `kit.js` (the camera and its shots, places painted once, words and timing) and `finish.js`, but not their people, rooms or cards: those are that module's look.

## What it costs to draw

Nothing is painted per pixel, blurred or filtered, and a place is painted once and kept. With the processor slowed four times, as on a phone, *Owning the outcome* takes 73 ms a frame at full size, where the same film took 132 ms in the module's first look, and one person takes 6 ms, where one took 70. [docs/styles/index.html](../../../docs/styles/index.html) sets the look beside every look in use, measured the same way (`site-tools/style_stats.py`). In a usual moment the people are about four tenths of the frame's cost. A crowd far off that stays still can be painted once and kept (the agent films' `ag_kept`, under a key that starts `pk:`), so each frame draws only who moves or reacts.
