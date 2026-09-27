# Review: pauses, sound and motion in the breathing cut

*Status: fixed on 27 September 2026, in both languages; see [What changed](#what-changed) at the end.*

*A review of* The Inner Life of Data *(English, 8:01), made on 26 September 2026 from the committed source. The source matches the site's player and soundtrack exactly, so this is the film people watch. The Spanish film shares the same pauses and sound code, and has the same problems.*

## Verdict

The length is right, but the rhythm is wrong.

- **The voice still rushes.** While it speaks, it runs at 171 words a minute, the same as the v4 cut. Between most sentences there is only 0.3 s.
- **All the extra time sits in 32 stops.** The breathing cut added 1:44 of silence, all of it in holds of 2.3 to 5.3 s and chapter endings of 7 to 10 s. So the film plays as "rush, stop, rush, stop".
- **The music makes every stop louder.** It jumps up 7.5 dB in a quarter of a second each time the voice rests, and drops back when the voice returns.
- **There are two holes in the sound.** The first chapter has no music at all (a bug), and there are 2 s of dead air at 6:31.
- **The picture adds to the stop-start.** The camera whips around while the voice talks, and 7 of the pauses show a frozen or nearly frozen frame.

## The numbers

| | Now | Calm narration usually has |
|---|---|---|
| Speed while the voice speaks | 171 words a minute; 13 lines above 200 | about 140 to 160 |
| Silence after a full sentence | 0.3 s for 45 of 65 sentences | 0.6 to 1 s |
| Silences of 0.5 to 1.5 s | none | most of them |
| Talking stretches | 31, typically 9.6 s long, each followed by a stop | |
| Stops inside chapters | 20, of 2.3 to 5.3 s | a few beats of 1.5 to 2 s |
| Chapter endings | 7.3 to 10.3 s (only the first one is 2.7 s) | 4 to 6 s |
| Total silence | 158 s; 143 s of it is in the 32 stops | spread through the film |

`tools/pace.py` reports averages (115 words a minute, voice 67% of the time). Both meet the playbook's targets, so the report looks healthy. It can't see that the silence comes in blocks.

## 1. Sound

1. **No music in the first chapter (0:00 to 0:24).** In `tools/audio.py`, `put()` skips any sound that starts before 0:00, and the first chapter's music starts at −0.8 s. So the title card plays in 3.6 s of total silence. The hold after "…a snapshot of that moment" (0:15) is 2.3 s of dead air on a frozen frame. This bug has been there since the first version.
2. **2 s of dead air before "And the fourth way changes everything" (6:31).** `audio.py` mutes the music and effects for the whole pause before this line, and the breathing cut doubled that pause from 1 s to 2 s. It follows a 3.3 s hold, so the voice is gone for 5.3 s. The camera zooms out fast just as the sound drops out.
3. **The music pumps.** Under the voice the music is lowered by 7.5 dB. Whenever the voice stops for more than 0.4 s, it comes back up in 0.25 s. In v4 this happened 13 times; the holds raised it to 32. In 17 of them the music goes straight back down within 2.5 s. This is the "abrupt change when talking and pausing". `breathing-cut.md` asked for the music to lift "a little"; 7.5 dB in a quarter of a second is not a little.
4. **The beats stop dead.** The seven heartbeat pulses and arpeggios end with no fade. The one in *Ways out* is cut off by the mute in point 2.

**Not the cause:** the voice itself (every line is within about 3 dB of the others, with no clicks), and the loudness normaliser (its gain moves less than 0.2 dB across a pause).

## 2. Pauses: which ones fit

A pause fits when it follows a new idea and the picture has something to show for the whole pause. It doesn't fit when the frame is frozen, when it splits one thought in two, or when the sound drops out. "Normal motion" below is the typical motion while the voice speaks.

### The 20 stops inside chapters: 8 fit, 4 are too long, 8 don't fit

| Time | After | Length | Picture | Verdict |
|---|---|---|---|---|
| 0:15 | "…a snapshot of that moment." | 2.3 s | frozen, and no music | ✗ dead stop |
| 0:34 | "Think of each one as its own colour of light." | 2.8 s | slow drift | too long: about 1.2 s |
| 0:48 | "…lands them in the lakehouse within seconds." | 2.3 s | a second event races in | ✓ |
| 1:00 | "Auto Loader reads each new file exactly once…" | 2.3 s | the counter ticks | ✓ |
| 1:27 | "What is a student? A class? An enrolment?…" | 2.8 s | the entities draw in | ✓ |
| 1:37 | "Get the sketch wrong, and the pieces never fit." | 2.8 s | little motion | ✗ splits one argument |
| 2:13 | "glitches, duplicates, errors…" | 2.3 s | rough pieces glitch | ✓ |
| 2:28 | "…A missing value stops here." | 2.3 s | the red tile waits | ✓ |
| 2:37 | "An enrolment with no matching class stops here." | 2.3 s | the orphan waits | ✓ |
| 3:09 | "…Think of them as paintings." | 3.3 s | little motion | ✗ splits the metaphor |
| 3:16 | "…The style is what the audience needs." | 2.3 s | zoom and pan across a dense gallery, 33 times normal motion | ✗ splits the metaphor, too busy |
| 4:46 | "Words are defined once…" | 3.3 s | nearly still: 0.6% of the frame changes | too long: about 1.5 s |
| 4:56 | "Unity Catalog marks trusted data…" | 2.3 s | nearly still | too long: about 1 s |
| 5:33 | "Some questions need one answer, right now…" | 2.3 s | nearly still | ✗ splits "Some… Others…" |
| 5:39 | "Others need every record, over years…" | 2.3 s | the heat map scans | ✓ a beat before "Different jobs" |
| 6:10 | "Events: when something changes…" | 2.3 s | nearly still | ✗ breaks the list of four ways |
| 6:28 | "Useful, but every copy has to be kept up to date." | 5.3 s | fast zoom-out, then 2 s of dead air | ✗ keep a beat of about 2 s, with sound |
| 7:15 | "…the correction flows straight back into the platform." | 2.3 s | frozen | ✗ |
| 7:23 | "Ask: which first-year classes need more seats…?" | 2.3 s | Genie thinks | ✓ |
| 7:50 | "…140 more students get a seat." | 3.3 s | frozen | too long: about 2 s before the tagline |

### The 10 chapter endings: 2 fit, 6 are too long, 2 don't fit

| Time | Chapters | Length | Picture | Verdict |
|---|---|---|---|---|
| 0:23 | The tap → Into the platform | 2.7 s | flight into the platform | ✓ |
| 1:11 | Into the platform → The sketch | 8.1 s | the next night's file lands | too long |
| 1:47 | The sketch → Refining | 8.3 s | tiles snap in, 98% | too long |
| 2:49 | Refining → Gold | 9.3 s | a clean run through every layer | too long |
| 3:43 | Gold → The layers together | 8.3 s | camera glide, then a plaque with four new labels to read in silence | ✗ too busy |
| 4:18 | The layers together → Meaning | 10.3 s | one pulse of light across the whole diagram | ✗ the longest silence in the film |
| 5:19 | Meaning → Two speeds | 8.5 s | snippets arrive, the brain lights up | too long |
| 5:53 | Two speeds → Ways out | 7.3 s | seat checks and one long scan | ✓ |
| 6:56 | Ways out → Apps and Genie | 8.5 s | every screen updates at once | too long |
| 7:34 | Apps and Genie → Pull back | 7.6 s | a different person gets a masked answer | ✓ |

The film also opens on a 3.6 s title card with no sound (it fits once the music is back) and ends on 6.6 s of the tagline (fine; 5 s would do).

## 3. Motion: where there's too much

- **Fast camera moves: 27.** These cross half the screen in about a second, or zoom by more than 60% a second. 24 of them happen while the voice talks. Most are in *Refining* (8 in 40 s) and *Gold* (7). *Gold* includes three whip pans at over 3,000 pixels a second (a full screen width in about half a second) between Analysts, Executives, Reports and Live. So the voice rushes and the camera darts, then everything stops.
- **Busy pauses: 3.** The zoom across the gallery at 3:16, the plaque at 3:43 (the breathing cut's own rule says nothing new is written on screen in a breather), and the fast zoom-out into dead air at 6:31.
- **Frozen pauses: 7.** Three holds don't move at all after their first moment (0:15, 7:15, 7:50). Four change less than 1% of the frame (4:46, 4:56, 5:33, 6:10). The breathing cut's own rule 3 says nothing should freeze during a pause.
- **Crowded sound effects.** There are 216 effect sounds in all. *Into the platform* has 55 a minute and *The sketch* 61, with 20 ticks under the events line and 24 as the tiles snap in. *Refining*, *Gold*, *The layers together*, *Meaning* and *Two speeds* have 7 to 19 a minute.

## Why it happened

1. The breathing cut added time only as blocks of silence. It kept the 0.3 s gap between sentences, so the talking stayed as fast as v4.
2. The averages hid it. `pace.py` checks words a minute, voice share and the longest quiet moment, and all three pass.
3. The music's lowering under the voice was tuned for v4, where the voice almost never paused. Each new hold now triggers a fast swell.
4. The missing opening music is a bug from the first version, which the new hold at 0:15 made easier to hear.

## Fix plan, in order

1. **Sound (no change to the timing or the voice)**
   - In `put()`, trim a sound that starts before 0:00 instead of skipping it. This brings back the music in the first chapter.
   - Before the twist, lower the music by about 12 dB instead of muting it, and bring the pause back to about 1 s.
   - Lower the music under the voice by about 4 dB instead of 7.5. Bring it back up over about 1 s instead of 0.25 s. Keep it down through any pause shorter than about 1.2 s.
   - Fade the pulses and arpeggios out over about 1 s.
2. **Timing** (`src/breath.js`, plus one rule in `src/engine3.js` and `tools/pace.py`)
   - Leave 0.7 s after every full sentence. Keep 0.3 s where a line ends with a comma or a colon, because the sentence goes on.
   - Remove the 8 stops marked ✗. At 6:28, keep a beat of about 2 s, with sound.
   - Shorten the other holds to 1 to 1.5 s. With the 0.7 s gap, each beat becomes 1.7 to 2.2 s.
   - Shorten the chapter endings (`breathe`) to 3.5 to 4.5 s.
   - Modelled result: 7:44, 119 words a minute, voice 70% of the time. No sentence runs into the next, only 2 stops are over 2.5 s (the twist and the tagline), and chapter endings are 6.2 to 7.2 s.
   - Do the sound fix first. With 0.7 s between sentences, the current music settings would swell 50 more times.
   - The pictures and sounds of each chapter ending (in `src/scA.js` to `src/scD.js`, and the `B()` cues in `audio.py`) are timed for 5 to 8 s. Check they fit the shorter endings; *Refining*'s needs about 6.6 s.
3. **Picture**
   - Give the 7 frozen or nearly frozen holds a slow push-in, or keep them to 1 s.
   - Slow the 27 fast camera moves to at least 1.2 s each, starting with the three whip pans in *Gold*.
   - In the *Gold* ending, drop the plaque's text, or show it while the voice speaks.
   - Halve the ticks in *Into the platform* and *The sketch*.
4. **Optional: a slower voice.** Change the voice speed from 0.95 to 0.90. Talking drops from 171 to about 162 words a minute, and with step 2 the film is about 8:02. This means re-voicing both languages with `tools/tts.py`; the pictures re-time themselves. Listen to the 13 lines above 200 words a minute first. *The sketch* has five of them.
5. **Guard.** Add two checks to `pace.py`: how many sentences are followed by less than 0.5 s, and how many stops inside a chapter are longer than 2.5 s. Then an average can't hide this again.

## How this was measured

- **Timeline:** from the engine's own `filmInfo()`, the same call `audio.py` makes.
- **Sound:** `build/mix.wav` was rebuilt from the committed source, and it matches the published `soundtrack.mp3` exactly. Voice, music and effects were measured separately, and the published English and Spanish soundtracks were checked for silence.
- **Picture:** the film was drawn every 0.1 s, measuring how much of the image changes. The camera path was recorded from each scene's camera keys, and stills were checked across every hold.

## What changed

The fixes are built, in both languages, with even fewer stops than the plan. Measured the same way as above:

| | Before | Now |
|---|---|---|
| Length | 8:01 (Spanish 8:38) | 7:32 (Spanish 8:38, with a calmer voice) |
| Words a minute | 115 | 122 (Spanish 118) |
| Silence after a full sentence | 0.3 s for 45 of 65 sentences | 0.7 s or more for all of them |
| Stops inside chapters | 20, of 2.3 to 5.3 s | none longer than 2 s; 11 beats of 1.5 to 2 s |
| Chapter endings | 7.3 to 10.3 s | 5.8 to 6.8 s (the first stays 2.7 s) |
| Dead air | 3.6 s at the start, 2.3 s at 0:15, 2 s at 6:31 | none |
| Music in the first chapter | missing | playing |
| Music lift when the voice rests | 7.5 dB in 0.25 s, 32 times | 4 dB over 1.2 s, and only in pauses longer than about 1.3 s |
| Frozen pauses | 3, and 4 more nearly still | none: every pause moves |
| Fast camera moves | 27 | none |
| Sound effects | 216 | 191 |

- **Sound** (`tools/audio.py`): sounds that start before 0:00 now play, so the first chapter has its music. Before the twist the music dips instead of cutting to silence, and the pause is back to 1 s. The music lifts 4 dB when the voice rests, slowly, and stays down through short pauses. The beats fade out. *Into the platform* and *The sketch* have half the ticks.
- **Timing** (`src/engine3.js`, `src/breath.js`): 0.7 s after every sentence, and 0.3 s where a sentence runs on into the next line. Five of the 8 stops marked ✗ are gone; the other three (0:15, 6:28 and 7:15) are now beats of 1.2 to 2 s, with sound and motion. The remaining holds add 0.3 to 1.3 s to the sentence gap, including a new short beat after "That's the conceptual model…". Chapter endings last 3.5 to 4.5 s.
- **Picture** (`src/core.js`, `src/scA.js` to `src/scD.js`): camera moves glide (a sine ease), and the ones that darted now take 1.4 to 3.2 s. Holds that froze now drift slowly. Each chapter ending's variation is re-timed to fit, and the plaque in the *Gold* ending shows two lines instead of four.
- **Spanish voice** (`src/i18n/es/voice.json`, `tools/tts.py`): a blend of 40% of the Spanish voice (`ef_dora`) and 60% of the English narrator's (`af_heart`). A naturalness model (UTMOS, 1 to 5) rates it 4.33, against 3.69 for the Spanish voice alone and 4.51 for the English film. Its median pitch rises from 174 Hz to 187 Hz, and it speaks a little more slowly (157 words a minute while speaking, from 169), so the Spanish film is 8:38. Speech recognition misses the same words as before, all of them product names. A first attempt raised the Spanish voice's pitch with Praat instead; it sounded robotic and scored 3.24, so it was dropped.
- **Guard** (`tools/pace.py`): it now counts sentences followed by less than 0.5 s and stops of 2.5 s or more inside a chapter. Both are 0.

*The sketch* is now the densest chapter, at 143 words a minute, because its lines are voiced fast. Slowing it means re-voicing those lines.
