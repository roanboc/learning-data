# Proposal: the breathing cut

*The third cut of* The Inner Life of Data*: the same narration, with room to think. Status: built, then revised after [a review](pacing-review.md): the first build put all the extra time into long stops, so the film felt stop-start. The revised cut is 7:32 in English and 8:09 in Spanish, at about 122 words a minute, with the voice speaking 71% of the time. The timing lives in `source/src/breath.js`, shared by both languages; each chapter's wordless ending starts at the scene's `breath` cue.*

## Why

The film is accurate, but it doesn't stop talking. `tools/pace.py` measures it:

| | The v4 cut | Target |
|---|---|---|
| Length | 6:17 (Spanish 6:55) | about 8:00 (Spanish about 8:40) |
| Narration speed | 147 words a minute | about 115 |
| Time the voice is speaking | 86% | under 70% |
| Silence between lines | 0.3 s, almost everywhere | 1.5 to 3 s after each new idea |
| Wordless moments of 4 s or more | 1, at the very end | one per chapter |
| Densest chapter | The sketch, 185 words a minute | under 130 |

Good documentaries let the picture keep talking after the narrator stops. The viewer gets a moment to find the thing that was just named, connect it to what came before, and wonder what comes next. Those pauses are where the ideas land. They matter even more here: every chapter introduces new, named concepts (Zerobus Ingest, Auto Loader, staging, contracts, exposures, Unity Catalog, Lakebase, OpenSharing).

## Principles

1. **Breathe after every sentence, and pause a little longer after the idea.** The engine leaves 0.7 s after each sentence, and 0.3 s where a sentence runs on into the next line. A line that names something new gets 0.5 to 1 s more, so the eye can find it on screen. Don't pause after connecting lines like "Let's follow it." Keep stops inside a chapter under about 2 s: the first build held 2 to 3 s after 20 lines, and the film felt stop-start.
2. **End each chapter with a breather of 3.5 to 4.5 seconds, with no words.** The scene keeps moving and applies the chapter's idea to a new case: a variation, not a repeat. Nothing new is written on screen.
3. **Keep the picture alive.** Nothing freezes during a pause: the camera drifts, loops continue, light keeps flowing. The film already taught this: a pause that faded to near-black read as a glitch.
4. **Let the sound carry the pause.** The music bed lifts a little (about 4 dB) when the voice rests, slowly, and never cuts to silence. One sound effect marks the variation.
5. **Keep the narration.** The words stay the same, so nothing needs re-voicing or re-translating. Only the timing and the pictures change.

## Chapter by chapter

This table is the plan as first built. The revision kept every picture but removed 8 holds, shortened the others to 0.3 to 1.3 s, and shortened the breathers to 3.5 to 4.5 s; `source/src/breath.js` has the current values.

"Hold" is extra silence after a line, and "breather" is the wordless end of a chapter. Both live in `source/src/breath.js`, shared by every language, and the engine adds them on top of the narration's own timing. A breather's picture starts at the scene's `breath` cue.

| Chapter | Holds (line: seconds, what the picture does) | Breather (seconds: the wordless variation) | Added |
|---|---|---|---|
| The tap | `stored`: 2, the camera rests on the tile and its 9:02 am stamp | None: keep the momentum into the platform | 2 s |
| Into the platform | `colours`: 2.5, the four lanes pulse in their colours · `zerobus`: 2, a second event, from the learning platform, races in · `auto`: 2, the checkpoint counter ticks | 6: night passes, a second file lands, and Auto Loader reads only the new one (checkpoint 1 → 2) while the hot lane keeps flickering | 12.5 s |
| The sketch | `model`: 2.5, the entities draw themselves one by one · `wrong`: 2.5, tiles bounce off the wrong sketch while 312% climbs | 6: on the right sketch, tiles snap into place one by one and the number settles at 98% | 11 s |
| Refining with dbt | `rough`: 2, the freeze-frame labels linger · `tests`: 2, the red tile waits at the staging gate · `orphan`: 2, the orphan waits at the intermediate gate | 7: a fresh batch runs the whole line cleanly, check marks ripple layer by layer, one more piece lands in the silver picture, and the lineage thread glows back to bronze | 13 s |
| Gold | `products`: 3, a slow pan along the gallery · `subject`: 2 | 6: the camera glides along one domain wing, a live painting updates, and a plaque turns to show its exposure | 11 s |
| The layers together | None: it is already an overview | 8: one pulse of light travels through the whole platform, end to end (it foreshadows the ending) | 8 s |
| Meaning | `define`: 3, the definition stays while the count changes to the census-date number · `uc`: 2, a name blurs into a mask | 6: MCP snippets keep arriving, and new connections light up in the brain | 11 s |
| Two speeds | `now`: 2, "1 seat left · 8 ms" pulses · `years`: 2, the heat map finishes its scan | 5: three more seat checks answer instantly while one long scan completes | 9 s |
| Ways out | `events`: 2, a second system comes back for its data · `stale`: 3, the original changes again and every copy goes out of date at once · `twist`: the pause grows from 1 to 2 s | 6: the original changes, and every projected screen updates in the same instant | 12 s |
| Apps and Genie | `fix`: 2, the correction travels back to bronze · `ask`: 2, Genie thinks and the brain lights up | 5: a different person asks the same question and gets a different, masked answer | 9 s |
| Pull back | `seats`: 3, the "140 more seats" card stays | The tagline stays 2 s longer | 5 s |

That adds about 1 minute 44 seconds: 6:17 becomes about 8:00, at about 115 words a minute, with the voice speaking about two-thirds of the time.

## How it was built

1. **Timing.** Set the holds and breathers in `src/breath.js`, once for every language. The engine re-times every scene on its own. Check with `python tools/pace.py`: no chapter far above 130 words a minute, each with a quiet moment of at least 4 seconds, no sentence followed by less than 0.5 s, and no stop of 2.5 s or more inside a chapter.
2. **Pictures.** Write the ten variations in `src/scA.js` to `src/scD.js`, each starting at the scene's `voEnd`, using the existing components. Check that every camera key still ends at `sc.dur`.
3. **Sound.** In `tools/audio.py`, lift the music bed by a few dB when the voice rests, and add one effect cue per variation.
4. **Rebuild.** Run `tools/tts.py` once to restore the voice files (the words don't change, so the timings in `vodur.js` stay the same), then `build.py`, `audio.py`, `build.py`, `captions.py` and `render.py`, in both languages. Publish the player and soundtrack to the site, and the MP4s to a release.
5. **Review.** Render stills in the middle of every hold and breather, and watch it once at full speed. A pause should feel like a moment to look, not like waiting.

## Decisions made

- **One cut.** The breathing cut replaces the 6:17 cut on the site and in the downloads. The LinkedIn ranges in `script.md` now point into it.
- **No chapter bumpers.** The player's chapter buttons already show where you are, so no extra text on screen.
- **Pause and think, on the site.** An optional player mode stops at the end of each chapter (except the opening, the overview and the ending) and asks one question, matching the lab for that part. Its questions live in `site/assets/learn/learn.en.js` and `learn.es.js` under `think`, and `site/assets/learn/think.js` shows them.
