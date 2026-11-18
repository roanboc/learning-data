# The people kit: Leading data people's look and tools

The films of *Leading data people* are about people, so they draw people first: whole, in a place where they act, meet or move, with faces that react and hands that rest on things. The author found the module's films disappointing: half-figures lined up in front of a plain wall, a giant bust beside small whole people, cards and charts carrying the story while the people stood by ([issue 391](https://github.com/roanboc/learning-data/issues/391), and 17 November 2026). He asked for "a more cartoon or soft style", easy to draw people in and light to play, and chose **Ink line** among four looks on 17 November 2026: flat colour, with one even dark line round every form.

The kit is that look, a person who can stand, walk, sit, kneel, turn and react, the things people work with, the words on the frame, the university's places, a board and a notebook for a film's key ideas, a chat and a call, and the tools that build and check a film. *Owning the outcome* was drawn with it before any other film.

Never change these files for one film. A film's own pictures, places and helpers go in its own `source/src/`, with a prefix of its own (such as `oo_` for *Owning the outcome*); a change every film needs goes in a pull request of its own, and it is a new version of every film whose `release.json` names this folder (AGENTS.md, *A shared drawing/timeline fix is a new version of every consumer*).

## The rules a film is staged by

Each rule comes from a fault the author named. Where a rule can be measured, `tools/people.py` checks it, and `tools/check.py` runs that check on every frame. Last, `tools/shown.py` checks what a film times but never shows: a shot that never comes on screen, and a row still being written when its chapter ends.

| Rule | How | The check stops on |
|---|---|---|
| **Whole people, in a place.** Everyone is drawn from head to feet, standing on a floor, in a room, on a path or a hill. | `PK.person`, `PK.atDesk`, `PK.seated`; a place from `PK.place`, or the film's own | a half-figure: someone's upper half with no lower half |
| **One eye line in each place.** A standing adult's eyes are on the place's eye line wherever they stand, so near people are large and far people small, and all belong to one picture. | `PK.hAt(floor, eye)` gives the height at each depth | two grown people whose eye lines differ by more than a tenth of their height |
| **Nobody in a row.** People stand at different depths, in twos, one seated, one nearer. | stage by depth: `floor` and `PK.hAt` | three or more standing at one depth and one size, apart, for 3 s or more |
| **Hands hold, carry, give, take, write, rest or greet.** Nobody waves a hand about to explain. | `o.reachN`, `o.reachF`, `o.hold`; the stances `ease`, `clasp`, `listen` | a raised forearm with nothing held or reached for, for 2.5 s or more |
| **A body that folds is seen from the side.** Someone who sits, kneels, crouches or bends forward is drawn from the side, as their legs are; a standing person is three-quarters on (the author, 17 November 2026). | `PK.side(pose)` does it; `o.side` sets it by hand | |
| **Every pose is taken up from the one before**, over 0.3 to 0.5 s. Sitting down and standing up lean forward on the way. | `PK.poseMix`, `PK.walk`, `PK.poseSit` | a limb that jumps in one frame; a stand and a sit mixed, which is someone falling into a seat |
| **Faces react.** A listener takes in what is said: a nod, a look, a smile, a change of stance. | `PK.face(t, base, events)`; always give `o.t` | someone seen large who stays as they are for 14 s or more; someone drawn without the time, who is a statue |
| **Words on a scene hold a place and a time, a name, or something said.** What people say is said, in a bubble over their head, in their own words. Charts and cards stay small and never stand in for a person, and an idea is never a label on a scene. | `PK.card`, `PK.tag`, `PK.nameTag`, `PK.say` | a box of words over someone's head for 0.3 s or more |
| **Key ideas stand apart from the scenes, written by hand.** The ideas a film opens with are explained by someone at a board. What to remember, a remark or a conclusion, is a person's colourful notes in a book. The film goes from its people to the board or the page, and back (the author, 17 November 2026). | `PK.teach` at a board, `PK.notes` on a page, their rows paced once with `PK.pace`: *Key ideas: a board and a notebook*, below | a film with no board and no page of notes; whoever explains standing in front of their own words for 1.6 s or more; a row they can't reach in time, or written 1.2 s or more after the voice says it; writing less than 24 px from the edge of a board or a page; a hand that jumps over a page |
| **People also talk from where they are, and meet in person at least once.** Where the story has people in two places, they write to each other or call, in a panel that comes out of the screen or the phone of someone in the scene (the author, 17 November 2026). | `PK.callout` with `PK.chat` or `PK.call`: *A chat and a call*, below | a film where no two people are in one place, near each other and turned to each other, for 3 s or more |
| **People in every chapter, in more than one place.** | | a chapter with a person, or the notes one of them is writing, in view in less than 85% of its frames, or a person themselves in less than 60%; a film with one place only |
| **What is timed is shown.** Each shot comes on screen long enough to be seen, and each row of a board or a page is written before its chapter ends, with a second to read it. | list a chapter's shots in the order they start (`ag_shots` shows the last one whose time has come); give a chapter that ends on a page a pause at its end (`breathe`), and write the page from it | a shot on screen for less than a second, or never; words finished less than a second before their chapter ends, a mark less than 0.3 s, or either after it (`shown.py`) |

The film ends on a person, with its last line (`PK.end`).

## Key ideas: a board and a notebook

The author found the film much better in ink line, and its key ideas lost: "important information now too merged in the scene" (17 November 2026). The ideas had been labels on the scenes. Now a film goes between its people and its key ideas, and someone in the story writes each idea by hand:

- **A board** holds the ideas a film opens with: a reference named once, what it calls the idea, a chart's letters. Someone explains them there, with a name and a role: a consultant, a teacher, a colleague, as Carmen Vidal is in *Owning the outcome*.
- **A notebook** holds what to remember: a remark, a conclusion, the lesson of a chapter in the words of whoever keeps it ("What I own"), and the film's takeaway on its last page.

Both keep a person in the picture. A scene shows who writes and where: the team turned to its board, or Ivy opening the notebook on her desk. Then the film cuts to the board, or dissolves to the page, close enough to read, and comes back to the people.

**The rows.** A board's or a page's rows are a function of the film's own, from the chapter and the moment a word is said, in the board's or the page's own px:

```js
const oo_boardA = (sc, w) => [
  {s: "Zhamak Dehghani, data mesh", x: 70, y: 92, size: 42, col: "mut", at: sc.cues.mesh + 0.1, d: 1.0},
  {s: "Data product owner", x: 70, y: 188, size: 76, w: 700, col: "blue", at: w("mesh", "data product", -0.5), d: 1.2},
  {s: "answers for what the product does", x: 70, y: 296, size: 50, at: w("mesh", "answers", -0.1), d: 1.5},
  {s: "for its readers", size: 50, w: 700, col: "green", at: w("mesh", "for its", -0.1), d: 0.8}];   // no x: on along the line
```

Each row has the moment the voice says it (`at`) and how long the pen takes (`d`). The scene paces the rows once, `const BA = PK.pace(ctx, "carmen", oo_boardA(sc, w))` (`null` in place of a name for a page of notes), and hands the result to everything that shows them, so whoever writes is at the same row everywhere:

- the room's own board in a wide shot, small on purpose: `PK.teach(x, "carmen", tt, BA, {x, y, k: 0.35, deco: true, floor, rest})`;
- the board seen close, a place of its own (`AG_PLACES.ooBoard = PK.place.board`), reached by a cut (`cut: true`), since the room shows the same person and words: `PK.teach(x, "carmen", tt, BA, {say: [[t0, t1]]})`;
- a page, a place too (`AG_PLACES.ooNotes = PK.place.notes`), reached by a short dissolve (`dis: 0.6`): `PK.notes(x, "ivy", tt, N1, {})`;
- the score: `tools/pens.py` gives it every stroke's time.

`src/hand.js` and `src/concepts.js` say every option in their first comments. *Owning the outcome* is the worked example: its `source/src/oo_uni.js` holds three boards and five pages, and its `oo_scenes.js` the shots round them.

**A board is laid out for someone who walks.** Whoever explains walks to each row, writes it facing the board, then turns to the room and steps to the right of everything written, so nobody reads round them. A row can't start before their legs bring them to it: `PK.pace` makes it wait, and a row that waits is written after the voice has said it.

| Lay a board out so that | Why |
|---|---|
| it reads on from left to right: words in another colour go on along their line (a row with no `x`); a short row under a long one starts where the long one ended; what the voice says first is written first | a new row at the left costs the walk back, about 0.8 s for a row 500 px long |
| nothing is underlined or struck through back along its words | the writer would end at the words' start, standing on the rows above. Words in a colour need no walk; a tick or a cross before a row, made before it, needs none either |
| what is added later to rows that are there, such as a letter beside each, goes to their right | to their left, the writer stands on the rows |
| what comes after the writer has stepped clear goes at the board's right | a short walk, and what is there stays in view |
| every baseline is inside the band a hand reaches (`PK.ROOMS.board.reach`), and the ink ends 24 px or more inside the board | the hand can't write above or below it, and writing at the edge reads as cut off |
| there is time to read: about 1 s for the writer to step clear, then 1 s or more, before the film cuts away | writing below the top of their head is hidden while they stand in front of it. Give the line a longer pause in `src/breath.js` |
| it has six to eight short rows, written with markers: words in a colour, a line under a heading, a ring, a box, a tick, a cross, an arrow | a highlighter's band belongs to a notebook |

In the room, the floor in front of the board is the explainer's: seat the others to the side, turned to it. A speech bubble there goes over a window or a wall, clear of the board's rows and of every head, and comes in with its first line.

**A page is written by one pen.** Its strokes come one after the other, in the order the rows are given, each with the time the hand needs to cross to it. `PK.pace(ctx, null, rows)` moves a stroke that would start before the one before it has ended.

| Lay a page out so that | Why |
|---|---|
| a row is written in about a second or less, and starts within about 0.6 s of its word | the voice doesn't wait for a pen. Shorten `d` before moving `at` |
| the finished page stays about 2 s before the film moves on | a page is read at the end. Give the chapter's last line a longer pause in `src/breath.js` |
| it has a heading and four or five rows, in the keeper's own words, never the narration copied out | it is someone's notes, and it has to be read in the time it is written |
| what explains a row sits beside it in one column, smaller and in muted ink | glosses scattered over a page read as noise |
| a mark fits its row: a highlighter's band after the words, a line under a heading, a ring round the one row that sums up (and no bullet before that row: the ring would run through it) | the pen goes back for a mark only when there is time: give the mark its own moment |
| the ink ends 24 px or more inside the page, and nothing but the desk and the hand is below y 890 | the captions are there |

A page comes at the end of a chapter, or where the voice draws a conclusion, and at most once a chapter. Show the keeper writing in the scene before or after (a notebook on the desk or a knee, a pen in the hand: `PK.inHand.notebook`, `PK.inHand.pen`), and keep a person themselves in view for 60% or more of every chapter.

**Sizes and colours.** Handwriting is 40 px or more as it is seen. On a board seen close: a heading 58 to 76 px (weight 700), a line 50 to 56, a source's name 42 in muted ink. On a page: a heading 84 to 96, a line 58 to 84, a gloss 42. The five colours keep their meaning in handwriting: ink for the words; blue a plan, a rule or the idea's name; green something done or of value; amber a risk, a cost or what isn't so; orange data. A page uses two or three of them, never all.

**The sound.** A marker on a board and a pen on a page are heard where the picture writes. A paced row's moment isn't a word's time plus an offset, so the score asks the film: in `tools/score.py`, `PEN = pens.written({'A': ('owns', 'carmen', 'oo_boardA'), 'N1': ('owns', None, 'oo_note1')})` gives every stroke with the film's own times. One soft sound for each stroke of 0.28 s or more, panned to where it is written, and a chord for a page's last mark keep within the sound rules (`tools/quiet.py`).

## A chat and a call

People don't only walk over to each other. The author asked for people who "communicate with others via chat or call, so not only jumping in personally. But personally always at least once should be shown" (17 November 2026). So where the story has people in two places, a film shows a chat or a call, once or twice, and it still brings people face to face: in *Owning the outcome*, in most scenes.

A chat and a call are panels that come out of the screen or the phone someone in the scene is using (`PK.callout`, its tail at the screen). That person stays in the picture, whole, at their desk or on a path, and reacts to what the panel shows.

- **A chat** (`PK.chat`): its messages are what the voice says, a message for each sentence, sent as the voice ends it. Mine are typed in the field first (`type` seconds), a word at a time; the others' come in after three dots. Size the panel from its words (`PK.chatSize`). Then show the other side: the reader with a phone in the hand, the same chat as their screen has it (`me` is them), and a short answer. The small screen in the scene shows the chat meanwhile (`PK.onScreen.chat(k, {rows})`), never a blank screen.
- **A call** (`PK.call`): a tile for each person, with their face, their name and what they do (`o.stack`). They join one after the other (`a`), each says their line out of their tile (`PK.say` with what `PK.call` returns), and the one in the room listens and answers. The sound is a soft ring, and a tone as each joins.
- A panel is a box of words: keep it off the heads of the people in the scene, inside the frame and above y 890. Its words are 28 px or more.
- What a chat or a call says is in the film's rigour sheet like any other line: who says it, and that it adds no fact the voice doesn't give.

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

## Making a film of the module again

Every film of *Leading data people* made before the kit is made again with it, one film to a pull request. *Owning the outcome* is the worked example: its `script.md` (*How it is staged*), its `source/src/oo_uni.js` and `oo_scenes.js`, and its `source/tools/score.py`.

**What stays.** The film's idea and its references, each named once; its opening story and the four beats; its takeaway; its people, numbers and dates, as the series' `proposal.md` and the films before it have them; its folder, key, page address and Pause and think keys. A line of the voice that still fits keeps its id and its words, so it keeps its recording.

**What changes.** The module is about people, so its films show people (the author, 17 November 2026: "more people context and less about data challenges"). Nine rules, each with a row in the film's `script.md` saying how the film keeps it:

1. **The problem is the occasion, not the subject.** A data fault takes a line and one small picture. What people do about it, and with whom, takes the rest. Cut the words that retell the fault: two chapters of *Owning the outcome* lost about half of theirs.
2. **Two worlds:** the opening story's, with its own people at work, and the university's, in more than one place.
3. **Moments between people.** A scene is someone handing, showing, asking, answering or deciding with someone else.
4. **What people say is said,** in a bubble, in their own words, close to the voice's line, adding no fact.
5. **Charts stay small:** a callout from someone's screen, for a line or two.
6. **End on a person,** with the film's last line.
7. **An idea is explained at a board,** by someone with a name and a role.
8. **What to keep is a page of notes,** in the keeper's own hand and words.
9. **People talk from where they are, too:** a chat or a call where the story has people in two places, and people face to face at least once.

**The order of work.**

1. **Keep the version before.** Take the film's video as the site has it (`https://github.com/roanboc/learning-data/releases/latest/download/<key>.mp4`), or render its source before you change it, and make its review copy: `python site-tools/review_copy.py <video> --out <somewhere>/<key>.before.review.mp4`. Note where its chapters start and where it ends, and keep a copy of its `captions/`.
2. **Stage it in words.** In `script.md`, write *How it is staged* (the nine rules), *What each object stands for*, and each chapter's picture: the place, who is there and what each does, what is said aloud, the rows of each board and each page, and where people write or call. Cut the narration there too. The *Opening story* table still quotes the narration, word for word.
3. **People and places.** A new person is a row like the cast's, in the film's own source; a new place is the film's own too. Look at each new person at full size, facing both ways and in every pose (`tools/sketch.py`).
4. **Stage it,** chapter by chapter, with the agent films' shots (`ag_shots`): each board's and page's rows as a function, paced once.
5. **Voice and look.** `python tools/tts.py` (it voices only the lines that changed), `tools/build.py`, then look before any check: a sheet of every chapter, a frame every 2 s; every board and page a frame every half second while it is written; every cut frame by frame at full size.
6. **Check:** `tools/check.py`, `tools/legible.py --overlaps`, `site-tools/fits.py`, `tools/pace.py`. Fix what they list in the film. Where `people.py` lists a row written long after the voice, lay the board out again; the voice stays. Where `shown.py` lists a shot that never shows, list the chapter's shots in the order they start.
7. **Sound:** `tools/score.py`, with a new palette: music under the opening story, then only at a turn; one soft sound for what happens on screen (the pen and the marker from `pens.written`, a tone as someone joins a call, a blip for a message). Then `tools/quiet.py`, `tools/audio.py` and `tools/build.py` again.
8. **Words round the film:** `script.md` (every section, and the pacing report), a dated row in `decided.md` for each decision, a row in the film's assumptions file for each choice made without the author, the captions in both languages, the page's words in `site.json` where the story's changed, Pause and think (each question and its explanation still true of the film), and the legibility row in `release.json`.
9. **Publish and check:** `tools/publish.py`, `python site-tools/media.py index --film <release key>` and the MP3 beside `audio.json` (`git add -f`), `python site-tools/build_series.py`, `python .github/scripts/affected.py --run`.
10. **Share it beside the version before.** `tools/render.py --workers 4`, then `python site-tools/review_page.py <film folder> --pr <n> --note "<what changed>" --before <key>.before.review.mp4 --before-label "On the site" --label "Made again" --before-chapters "<m:ss, …, its end>" --before-captions <the copy of its captions> --pair "<what to look at>|<time before>|<time now>"`, with a pair for every board, page, chat and call. Publish the page as a private artifact, one page per film, and share its link with the pull request's. The film isn't done until the author approves it.

## What each file holds

Sizes are in the 1920 by 1080 frame. Every word is at least 28 px as seen, and nothing but the captions goes below y 890. Each file is closed in a function of its own, so the only name the kit adds to a film is `PK`. Each file's first comment says how to call what it holds, option by option.

**`src/core.js`**: the helpers (`PK.u`: easing, colour mixing, a smooth curve through points, a tapering limb) and the looks. A look says how a shape, a line of detail and a shadow are painted, and how a person is proportioned. `PK.use("line")` is Ink line, the default and the module's look. The other three are skins of the same drawing, kept so a film is staged once for any of them: `"tint"` (soft line), `"soft"` (soft shapes) and `"paper"` (cut paper). `PK.C` holds the colours that mean something in every film of the module: **blue** plans and rules, **green** something done or of value, **amber** a risk or a cost, **orange** data, **violet** only an agent. They are for words and marks; people's clothes are soft, muted colours and never one of the five.

**`src/people.js`**: a person is a row in a table (skin, hair, clothes, what they wear on the face), a pose is a row of angles, and a face is three numbers.

- `PK.person(ctx, who, x, floor, h, pose, o)` draws anyone in any pose, whole, with their feet on the floor, and returns where their joints are (`J.hc` the head's centre, `J.hdN` the near hand). `o.flip` faces them left, or turns them round through the front; `o.expr`, `o.gaze` and `o.nod` are the face; `o.reachN` and `o.reachF` rest a hand on a point; `o.hold` draws what a hand holds; `o.part` draws the legs and the rest apart, for someone behind a table; `o.a` fades them as one picture; `o.t` is the time, for breath, blinks and the small life of someone who stays where they are.
- The cast, `PK.CAST`: `ivy`, `helena`, `graham`, `mei`, `sam`, `jun`, `noor`, `yusuf`, `marta`, `erin` and `tomas`, the university's people as the module's films know them, and `carmen`, a consultant who explains at a board. `PK.extra(i)` is one of many people nobody names, the same every time; `PK.KID` gives a child's proportions. A film's own people are rows like the cast's, in its own source.
- The poses, `PK.POSES`: `stand`, `listen`, `ease`, `clasp`, `armful`, `can`, `bend`, `sit`, `sitBack`, `sitWork`, `kneel`, `crouch`, and `wave` for a greeting. `PK.poseMix(a, b, t)` blends two; `PK.poseSit(k)` sits someone down or stands them up; `PK.poseWalk(step)` is a stride.
- `PK.walk(ctx, who, t, w, o)` walks someone from `w.x0` to `w.x1` between `w.t0` and `w.t1`: the stride grows out of the pose they stood in and dies into the pose they stop in. `PK.walkAt(t, w)` says where they are.
- The faces, `PK.EXPR`: `neutral`, `smile`, `worry`, `talk`, `listen`, `relief`, `think`, `glad`. `PK.face(t, base, events)` is a face through a shot in one row: a nod, a look, a smile, a line spoken, each at its moment. `PK.talk(t, t0, t1)` opens and closes a mouth while someone speaks.
- `PK.hAt(floor, eye)` is a standing adult's height where their eyes are on a place's eye line. `PK.among(t, points, dwell)` moves a hand at work from one thing to the next. `PK.side(pose)` says how far a pose turns the body to the side.

**`src/things.js`**: what people sit at, hold and work with: `PK.chair` (it turns round with whoever sits on it), `PK.table`, `PK.desk`, `PK.laptop`, `PK.monitor` (`o.draw` draws what it shows), `PK.board`, `PK.sheet`, `PK.mug`, `PK.pot`, `PK.plant`, `PK.clock`, `PK.door`, `PK.seedling`, `PK.potted`, `PK.tree`, `PK.cloud`, `PK.tick`. `PK.PAL` holds the colours of places and things.

**`src/words.js`**: words on the frame, each box made from its words as they are drawn, so the words can't leave it (`site-tools/fits.py`): `PK.card` (where and when, or a number), `PK.tag` (a few words in a pill), `PK.nameTag` (a name and a role over a head), `PK.bubble` and `PK.say` (something said, over the head of whoever `PK.person` returned; `o.cam` keeps it inside what the camera sees), `PK.kicker`, `PK.sceneTag` (*The university, 2027 · imagined*), `PK.mark` (the module's mark: five people in a ring), `PK.title` and `PK.end` (the title and end cards, over the picture, with whoever is there still in view; a last line that needs two lines breaks evenly, after a comma where one falls near the middle, never leaving a word or two alone).

**`src/places.js`**: the university's places, each painted once and kept as a picture (the agent films' `AG_PLACES`): `PK.place.team` (the data team's room), `PK.place.corner` (the manager's corner, close enough for faces), `PK.place.campus` and `PK.place.lecture` (a teaching room). A film lists the ones it uses, its opening place first: `AG_PLACES.ooTeam = PK.place.team`. `PK.ROOMS.<place>` holds each place's eye line, its floor lines and where its things are. A place paints only what is behind everyone; what people sit at or stand behind is drawn every frame with them, by the sets: `PK.atDesk` (someone working at a desk), `PK.seated`, `PK.audience` (a teaching room's seats, some taken), `PK.atBoard` (someone writing on a wall board, line by line), `PK.window` and `PK.windowFrame`. A camera closes in to about 1.3 at most on a kept picture; for faces, cut to a place painted closer.

**`src/kalam.js`** and **`fonts/`**: the handwriting font, Kalam, in two weights (400 for a pen, 700 for a heading or a marker), with its licence. A film carries it in its own script, so the video, the site's player and the checks draw the same letters with no network. Never edit `kalam.js`: `tools/font.py` writes it from the two files in `fonts/`.

**`src/hand.js`**: handwriting. `PK.hand` writes words by hand as far as the pen has come, `PK.pen.<mark>` is a pen's mark (a line under, a highlighter's band, a ring, a box, an arrow, a tick, a cross, a star), and `PK.ink(ctx, rows, t, o)` writes a board's or a page's rows, each when its time comes. A row is words or a mark, in the surface's own px, with its colour and the moment the voice says it. The five colours keep their meaning in handwriting.

**`src/concepts.js`**: where the key ideas are written. `PK.place.board` and `PK.teach` are a board with someone who explains at it: they write each row as the voice says it, walk along it, then turn to the room and step clear of what is written. `PK.place.notes` and `PK.notes` are an open notebook seen from above, with the hand that writes in it; `PK.notebook` and `PK.inHand` (a pen, a marker, a notebook) are for the scene that shows who writes. `PK.pace(ctx, who, rows)` gives each row the time whoever writes needs to reach it (a walk at a board, the hand's way across a page), so pace a board's or a page's rows once and hand the result to everything that shows them. `PK.written` gives every stroke's time and place back, for the score.

**`src/talk.js`**: people who talk from where they are. `PK.callout` is a panel that comes out of a screen or a phone someone in the scene is using; `PK.chat` fills it with a chat (each message at its time, mine typed in the field first; `PK.chatSize` gives the panel its words need) and `PK.call` with a video call (a tile for each person, with their face and what they say). `PK.onScreen.chat` and `PK.onScreen.call` are what a small screen in the scene shows meanwhile, `PK.avatar` someone's round picture, and `PK.inHand.phone` a phone in a hand.

**`src/page.html`**: the standalone player page.

**`tools/`**:

- `lang.py`: where everything lives.
- `build.py`: what a film is made of, in order, and its checks: no name declared in two files, no key named twice in one object, every cue word whole in its line, no caption over 140 characters.
- `check.py`: the film before a long render. It draws every moment, 30 a second, and stops on text under 28 px and on words that name a release status (*From words to data*'s `check.py` and `legible.py`); it times each place, painted from nothing; it finds anything shown twice, and anything that jumps, where the film changes shot or chapter (the governance films' `twice.py` and `jump.py`, which follow the kit's people too); then it runs `people.py`, and last `shown.py`.
- `people.py`: the rules above, measured. Its limits are named at its top (`ROW`, `SCALE`, `AIR`, `JUMP`, `OVER_S`, `STILL`, `SHARE`, `WHOLE`, `FACE_S`, `PLACES`). It also follows a board, a notebook, a chat and a call: whoever explains standing in front of their own words (`HIDE_S`), a row they can't reach in time (`LATE`) or that is written long after the voice (`LAG`), writing at the edge of a board or a page (`EDGE`), a hand that jumps over a page (`HOP`), a film whose key ideas are never written by hand, and a film where nobody meets face to face.
- `shown.py`: what a film times but never shows, which no check of the picture can find. It draws each chapter on its own, every half second, and reads each list of shots the chapter hands `ag_shots` and each board's and page's rows as the film gives them, with the times the pen takes them. It stops on a shot on screen for less than a second (`SHOT`), or never, as when a shot listed after it starts no later, and on a row still being written as its chapter ends: words finished less than a second before it (`READ`), a mark less than 0.3 s (`MARK`). A board far off, written as decoration, is left out.
- `pens.py`: what a film's hands write, and when, for its score: `pens.written({...})` in `tools/score.py` gives every stroke of a board or a page with the film's own times, so a marker's or a pen's sound falls where the picture writes.
- `font.py`: writes `src/kalam.js` from the font files in `fonts/`.
- `quiet.py`: the governance films' sound check, run with this kit's `lang.py`.
- `run.py`: runs a tool on a film: the kit's own first, then *From words to data*'s (`tts.py`, `audio.py`, `captions.py`, `legible.py`, `pace.py`, `stills.py`, `render.py`, `publish.py`).
- `sketch.py`: one frame, before a film exists.

The films bundle the agent films' `kit.js` (the camera and its shots, places painted once, words and timing) and `finish.js`, but not their people, rooms or cards: those are that module's look.

## What it costs to draw

Nothing is painted per pixel, blurred or filtered, and a place is painted once and kept. With the processor slowed four times, as on a phone, *Owning the outcome* takes 76 ms a frame at full size, where the same film took 132 ms in the module's first look, and one person takes 6 ms, where one took 70. A board with whoever explains at it takes about 50 ms, and a page of notes about 45: less than a scene with people in it. The handwriting's font travels in each film's own script: about 45 KB of the 179 KB the film's player weighs as it is sent. [docs/styles/index.html](../../../docs/styles/index.html) sets the look beside every look in use, measured the same way (`site-tools/style_stats.py`). In a usual moment the people are about four tenths of the frame's cost. A crowd far off that stays still can be painted once and kept (the agent films' `ag_kept`, under a key that starts `pk:`), so each frame draws only who moves or reacts.
