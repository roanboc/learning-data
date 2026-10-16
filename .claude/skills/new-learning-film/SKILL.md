---
name: new-learning-film
description: Process for every new Learning Data film, series or topic change in roanboc/learning-data, conceptual foundation first, then visual craft. Use before proposing, scripting or rendering a film.
---

# New film or topic: the process

Use this every time work starts on a new film or series, or a film's topic changes, in `roanboc/learning-data`. Go through the stages in order: the concept is settled before anything is drawn. `PLAYBOOK.md` holds the detailed lessons; this skill is the order to apply them in and the questions to ask the author (Rodrigo) at each stage.

## Stage 1: conceptual foundation (always first)

1. **Ask for the reference framework.** Before drafting, ask which framework, standard or body of knowledge the author treats as the reference for this topic. Then suggest the others worth considering, with one line each on what they add (for data modelling: Kimball, Inmon, Data Vault, entity-centric; for EA: TOGAF, Zachman, ArchiMate, BIZBOK, DDD, DAMA-DMBOK). Name the reference used and why; record where the films adopt, extend or differ from it (PLAYBOOK §8, "Choose a reference deliberately").
2. **Ground it in practice.** Ask the author for their real experience with the topic: what works in practice, what goes wrong, what they'd tell a newcomer. Check each concept and process is something practitioners actually do, not only what a framework prescribes. Write the practical advice into the proposal's brief.
3. **Keep the essential.** Frameworks are inputs, not the syllabus. As with data modelling techniques (*From words to data*) and EA (*The map before the data*: "no single framework", insight 10 "Just enough"), name the bodies of knowledge once, then teach the insights they share. Cut what a newcomer doesn't need to make the decision the film is about.
4. **Tools showcase, they don't drive.** Databricks and dbt are the main tooling to demonstrate the concepts (dbt writes and tests the recipes; Databricks runs, stores and governs). Pick the concept first, then show it in the tools. A topic never exists because a product feature does. Check product names and maturity (say "preview") on the day of publishing.
5. **Write it down before scripting.** A `proposal.md` (or treatment) with: the brief in the author's words, the reference and alternatives, the insights table with where each comes from, the practical advice, the thread to follow, and a *Decided* table with dates. Get the author's confirmation on this before stage 2.

Ask: would an expert in each framework agree, and would a practitioner recognise it from real work?

## Stage 2: story and world

Follow PLAYBOOK §1, §2, §8 and §9: the two-audience promise, one thing followed from birth to a human outcome, a metaphor tested against the hardest mechanism, openings varied across cultures and eras (checked against that culture's own sources), people on every side, blameless and believable numbers, wrong drafts corrected by the people who know, and a rigour sheet per scene.

## Stage 3: video craft (use maximum effort)

Run film creation and visual style work at **max effort**: draft style frames, compare, review full-size stills, and iterate until the result is the best visual quality you can reach, not the first that passes. Apply everything in PLAYBOOK §4 to §6 and its checklists, in particular:

- **Look:** one design language per series; colour carries meaning; living things drawn with tapering beziers, weight and light; people dressed for their time; components, not one-off drawings.
- **Phone legibility:** text ≥ 28 px after zoom or marked as decoration on purpose; lay out from drawn size (`phSz`); take turns when room runs out; nothing in the caption band (y > ~890).
- **Motion:** spring and settle, slow camera drift (≥ 1.4 s, sine ease), things carried across cuts, motion blur, no film grain.
- **Narration and pace:** one idea per line; 120–135 wpm (≤ 140 per chapter), voice ≤ 82% of any chapter, ~0.8 s after each sentence, few wordless endings.
- **Sound:** a new palette per film (not the same synthesised pads and chimes), sustained chords that follow chapters, every effect tied to something on screen, effects soft and below ~2.5 kHz, `urgent()` pulse only where the story turns to an error or rush, mix to -16 LUFS.
- **Known faults** (EA films 6–7): long `archEl` labels spilling out of boxes, an "explain" pose pointing off-frame near the right edge (mirror the person), labels under the captions. Never edit a series' shared source for one film; put helpers in the film's own `plan.js`.

## Stage 4: check, publish, learn

1. Before starting, check unmerged `claude/*` branches so no film is redone.
2. Per film, from its `source/`: `tools/build.py`, `check.py` (every frame draws), `legible.py --overlaps`, `pace.py`, `stills.py --size 1920 --at ...` for full-size review, then `publish.py`; then `site-tools/build_series.py`, `check_site.py`, `smoke.py --only ...`. Watch for a stale soundtrack in `dist/`.
3. Spanish captions, Pause and think questions, labs and scenarios match the film's names, numbers and colours.
4. Rendering and releasing the films runs only when Rodrigo starts it.
5. Turn every review finding into a check, and write new lessons into `PLAYBOOK.md` so the next film starts from them.
