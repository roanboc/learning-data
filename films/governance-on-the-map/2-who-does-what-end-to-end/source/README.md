# Rebuilding Who does what, end to end

*Who does what, end to end*, film 2 of 3 of *Governance on the map*, the second series on data governance, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, the master and reference data series' watercolour and its people in pencil and wash, and *Governance principles*' university: its rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`), in [`../../../data-governance/shared/src/`](../../../data-governance/shared/src/), bundled as they are. Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the opening story (`story`, for `tools/quiet.py`), the words the voice respells (Palma, Yusuf, Mei, Noor), and the moment its poster shows (Palma holding up the word for "to budget", turned down). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title card after the dictionary, and the end card). |
| `src/plan.js` | This film's places for the opening (prefixed `ee_` and `EE`), in watercolour, painted once and kept: the academy's meeting room in Madrid at night, a long table under oil lamps and bookcases to the ceiling, and the same room by day; a schoolroom in Lima; the academy's tall door far down a corridor; Palma's desk in the National Library in 1909; the congress's table in Mexico City in 1951; two members' desks today, and a bus stop. Nothing on screen is in Spanish: writing on slips, in the notebook and in the dictionary is lines too small to read, and the corner names the place. |
| `src/past.js` | The people of the opening: the academy's members in dark frock coats with high collars, Ricardo Palma in his fifties and at seventy-six, a teacher and his pupil, a shopkeeper, a clerk, a market seller and her customer, the delegates of 1951, today's members and the person at the bus stop; their poses, and what they hold. |
| `src/dict.js` | What moves in the opening: the slips passed up the table and back to a pile at Palma's elbow; the ring of twenty-three academies, the change sent out and coming back ticked; the entry on a phone; the yearly list of what's new, with its line for "to budget". |
| `src/uni.js` | The university: the floor where the work is done; Clara's report and one learner's year; the emails that went round; the page of what people can ask data governance for; Clara's request card; Mei's draft, the agent's check and its note; the registrar's decision; the chart of who's responsible for what, the old one and the one drawn from the map, and the wall calendar; Mei's calendar; the box marked retired; the glossary's product card, the week's list, who reads each term and the nine retired; Clara's page of her requests, with its six steps and their dates; and the corner pill and tags. Text drawn small on purpose is drawn under `PH_OFF`, which the legibility check leaves out; words near the frame's edge fade as a card's block (`ee_fadeCut`), so the frame never cuts one. |
| `src/map.js` | Noor's map, close, its business, information and application bands: the service *Define or change a term* and its six steps, a role over each of the first four and who fills it today (the agent's chip dashed and cyan), the agent's rights, what each step reads and writes in the information band, each with a home marked at its corner, and in the application band the map, the glossary and the copies that follow it. |
| `src/scenes.js` | The eight chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 8, with the next film's name under it. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. The line the film quotes from *Who does it, and where meaning changes* keeps that film's caption, and Palma's word is *presupuestar*. |
| `tools/score.py` | The film's music and sounds: four voices humming, alto, tenor, baritone and bass, made here, under the opening story (A minor in Madrid and Lima, A major as the academies join) and after that only now and then (E-flat major at the university). Each role has a short phrase that stays whoever sings it: Palma's request on the alto, unanswered until "to budget" is found; Clara's, the same phrase in E-flat; the steward's on the tenor (on the baritone while Mei is away), the owner's cadence on the baritone, the glossary's one low note on the bass. The agent's step is the only sound that isn't a voice, a soft pure tone. Only the two lowest voices hum under the narration; the alto and the tenor sing in the pauses. Every chord is tuned pure, and no note pulses or trembles; the whole score is low-passed last, below about 2.5 kHz. Each effect (slips, a ribbon, a pen, red ink, a door, a letter sealed, chairs, cards, hands raised, a phone, footsteps, keys, ticks, pins, a signature, a box) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs the series' tool (`../../../data-governance/shared/tools/run.py`) on this film: *Governance principles*' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/governance-on-the-map/2-who-does-what-end-to-end/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/who-does-what-end-to-end.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start (the score stops instead). `python ../../../data-governance/shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

`legible.py --overlaps` lists one moment that is right as it is: in *What each step needs*, the copies' card opens over Noor's map, and the map's words under it (the draft's and the agent's note's) are hidden by the card, which the check can't see.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/who-does-what-end-to-end/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/who-does-what-end-to-end-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/who-does-what-end-to-end/think.en.js` and `think.es.js`: it stops after `request`, `roles` and `product`, with one question each. Progress is stored in the browser under `ld-who-does-what-end-to-end`. The release workflow renders the video, `who-does-what-end-to-end.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
