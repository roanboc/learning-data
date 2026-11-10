# One map, in the repo: questions and assumptions

*Data management* · *Architecture that keeps up*, film 2 · open, PR #222 · [pull request](https://github.com/roanboc/learning-data/pull/222)

On the site once PR #222 merges: https://data.learn-all.org/architecture-that-keeps-up/one-map/

> Copied from the film thread's notes on 10 November 2026. Paths such as `../briefs.md` point to the thread's working folder, not to this repository.

Data management film 14, film 2 of *Architecture that keeps up*. Made on 10 November 2026 while you were away. Each line is a choice I made without you; say if any should change.

## The opening (Ordnance Survey)
- **Framing of the problem.** Before 2001, councils, water companies and emergency services each matched their records to the lines on OS tiles "in their own way". This is a general reading of the situation, not a quote from one source.
- **Figures.** OS MasterMap launched in 2001; about 440 million features at first; over 500 million by 2016; each feature has a TOID with a version and a date; surveyors update it on the ground and from the air; users get change-only updates. Checked on OS pages on 10 November 2026.
- **The town on screen** is invented, not a copy of an OS map.

## The data story
- **Dates:** target picture in three copies in spring 2027; council meeting Tuesday 25 May; the map moves into the repo in June; sensor feed pull request in July; the agent's draft in August; old warehouse retired by Friday 17 December.
- **Numbers:** 63 changes in the year's history; decision record 7 retires the old warehouse (21 used reports moved, 17 retired; licence ends 31 December).
- **People:** Sam and Jun are the "principal engineers" who review with Noor and Helena; data partners in the faculties propose changes.
- **Formats:** ArchiMate's exchange format for the model, Mermaid or draw.io for diagrams. No architecture product is named or shown (ArChreator is not on screen).

## Look and sound
- **Sound:** a singing aluminium rod as the lead, a twanged ruler as partner (one per merged change), reserved in `palettes.md`.

## Release
- The MP3 is in Git beside `audio.json` (release tag `audio-one-map-30d938f9b456061a8dbb`). Copying it to that release is left for you, as for the other films.
- No render or review page was made in the session.
- It merges after film 1 of the series (*Services with customers*) and the module kit (PR #148).
