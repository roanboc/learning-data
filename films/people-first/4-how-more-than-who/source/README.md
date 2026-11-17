# Rebuilding How, more than who

*How, more than who*, film 4 of 4 of *People first*, the series that opens the module *Leading data people*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/), whose [README](../../../the-new-skills/shared/README.md) says how a film uses them. The film never changes the kit for itself: only what is new in this film lives here, and every name it declares starts with `hm_` or `HM_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the two builders weaving from the two banks), the words the voice respells (Quehue, Apurímac, Quechua, Tomás, Jun, Novak, Ortega and Reyes), its opening story (`days`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the finished bridge, with the two cards of how its people work, as they become the title card; and the team's page on the wall as the door opens, as it becomes the end card. |
| `src/hm_place.js` | The gorge, drawn once for the three films of the series that follow the bridge and copied into each film's own source: both banks with a stone base on each, the river and the foot of both walls, by a dry June sun or under a grey sky (one room), and the left bank at people's height. A drawing, not a likeness: the gorge is narrower and shallower than the real one. |
| `src/hm_bridge.js` | The rope bridge, drawn live over the gorge, so it can be built, wear, sag and fall: four cables for the floor, each a braid of three ropes, two handrails, the sides, the rods and the mat; last year's bridge cut loose; and the steel bridge. |
| `src/hm_people.js` | The people of the four communities: small whole figures for the wide view (standing, walking, hauling, sitting at work, carrying, tying) and half-figures of two bridge builders, two more men and three women. Dressed from the sources' photographs and words, in plain colours; no pattern is invented or copied, nothing sacred is drawn, and nobody is a likeness. |
| `src/hm_uni.js` | The university in February 2027: the team's room in three lights (Wednesday by day, a morning, Friday late); Marta Silva, Erin Walsh and Tomás Ortega, copied from the module's numbers as they are; the eight at one table, Tomás and Jun at its two ends; words said aloud as slips; a ring for each person's turn; the two numbers, and the bar that shows what each counts; the study's sentence and its list of five; the three things; the glossary's two words; how much each member of a group spoke; the team's page, *How we work together*; the door; and, at the gorge, the families and the men on the two banks, the tags and the measures. |
| `src/hm_scenes.js` | The eight chapters, shot by shot. In one room the camera glides from one framing to the next and only what changes fades; a later moment in a room (`later:true`) lets what was there leave first; between rooms a shot dissolves. In the gorge the camera closes in to twice the size and more, so words there are drawn at the screen's own size. The title card ends chapter 1 and the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a viola and a cello as a pair, a player to each, the cello low from the left and the viola high from the right, each note one short pull of the bow. The mark, the weave: a note each in turn, the cello climbing and the viola coming down, until both meet on the same note. Never a chord: two notes sound together only at the meeting note and in the disagreement, where both bow at once, a step apart. D flat major, B flat minor for the problem, tuned pure from D flat. Nothing Andean: no pipe, flute, harp, guitar or drum, and no five-note tune. Each sound uses the same word and offset as the picture in `src/hm_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/people-first/4-how-more-than-who/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python ../../../../site-tools/fits.py   # every piece of text stays inside its box, the captions too
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/how-more-than-who.mp4
```

The voice cache knows each line's words: after changing a line, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only what changed. The music is at the limit of how often it may come in from 6:41, where a pair of notes answers each line of the team's page as it is written: after voicing a line again, run `tools/quiet.py` before anything else.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/how-more-than-who/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/how-more-than-who-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film how-more-than-who-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links what a newcomer can read next. "Pause and think" is `site/assets/how-more-than-who/think.en.js` and `think.es.js`: it stops after `three`, `turn`, `page` and `limits`, with one question each. The release workflow renders the video, `how-more-than-who.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The film shows no code from the example project: the glossary's two words are a card. The example project already keeps a learner wider than a student, and its own definition of a learner is longer than the card's.
