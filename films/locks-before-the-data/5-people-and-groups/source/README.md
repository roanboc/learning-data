# Rebuilding People and groups

*People and groups*, film 5 of 9 of *Locks before the data*, the first series of the module *Data protection and privacy*, and its first tool film, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' camera and people (`films/what-an-agent-is/shared/`), and the module's look and tools in [`../../shared/`](../../shared/), whose [README](../../shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `pg_` or `PG_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (Sam's admin account switched on, its group amber, "Until 11:42"), the words the voice respells (Jun, AI, HR, Sørnes, Okafor, Mei, CLI), the tools' logos, its opening story (`keys` and `card`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year or a number says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after chapter 2 and the end card after chapter 8. |
| `src/pg_kit.js` | What both halves use: the place tags and chapter kickers, the key on its fob, the punched card, the lock drawn as glass with its pattern card and the guest's card, a person's badge and an admin account's, a group's row with its count, the security key, the phone, the fake page, the terminal, the email, the dotted lines and the stamp. |
| `src/pg_past.js` | The 1970s, painted once in the module's night light: Moss and its factory on the fjord at dusk, the workshop, the hotel's front desk and its pigeonholes, a wet street under a lamp, the hotel's corridor, Atlanta's round glass tower; Tor Sørnes (no likeness) and a desk clerk, each with a hand only on the lock case or the card. |
| `src/pg_uni.js` | The university: the platform's block of glass and the desks, the directory and its groups (a group inside a group too), the people's cards that join, move and leave, the arrow where Azure Databricks reads the directory and the sign-ins that run along it, the rule's card, the passkey on a phone, the sign-in, the agreement, the role cards, the six admin groups, the secure store, and the end card. |
| `src/scenes.js` | The eight chapters, each a few shots of the shared camera (`ag_shots`). Between rooms a shot dissolves in, or cuts where both show the same words (`cut:true`); in one room the camera glides on, and a later moment (`later:true`) lets what was there leave first. Chapters 5, 6 and 7 go on in the hall where the one before ends (`ag_cutInto`). Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: an EMS VCS3, quiet, whose chord is built pin by pin as its pin board joins one row to one column, with one note that joins for a task and leaves when it ends; and a square bass recorder for the people. D-flat major, B-flat minor for the problem, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/locks-before-the-data/5-people-and-groups/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every word reads and stands out, every place and person paints in time, nothing shows twice where shots change, hands stay steady, nothing jumps in a room, and no paint passes a person's edge
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/people-and-groups.mp4
```

`tts.py` re-voices a line only when its words change, from the verified voice cache.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/people-and-groups/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/people-and-groups-poster.jpg`, at the moment `film.json` names. The soundtrack isn't kept in Git: `python site-tools/media.py index --film people-and-groups` writes `../audio.json`, which points at its copy in the film's audio release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/people-and-groups/think.en.js` and `think.es.js`: it stops after `directory`, `power` and `tokens`, with one question each. The release workflow renders the video, `people-and-groups.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
