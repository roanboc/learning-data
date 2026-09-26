# Playbook: making learning films and material

What made *The Inner Life of Data* work, written so the next film, lab or course can start from it. [The making-of story](site/journey/index.md) tells how the film came to be; this page keeps what to reuse. Each section ends with the question to ask of your own work.

## 1. Promise and audience

- **Promise two audiences at once.** "A teenager understands it, and a data engineer agrees with it." Write the promise down and test every scene against both halves. The first keeps it clear; the second keeps it honest.
- **Follow one thing from start to finish.** One enrolment, from a tap on a phone to a decision. Every concept is something that happens to it, so the viewer always has a thread to hold.
- **Start where the thing is born.** The enrolment is written to the system of record before the platform sees it. Starting in the right place prevents a wrong mental model that later scenes would have to undo.
- **End on a human outcome and a human decision.** A new class opens and 140 more students get a seat. The agent recommends; people approve.
- **Use a fictional world based on real practice.** The university, people and numbers are invented, so the material can be shared anywhere, and any institution can see itself in it.

*Ask: whose story is this, and what changes for a person at the end?*

## 2. A world, not a slideshow

- **Test analogies against the hardest mechanism.** Rivers, libraries and pipes all failed at zero-copy sharing, because water and books can't be in two places at once.
- **Give each layer of the metaphor one job.** Light explains movement; the pictures it carries explain meaning.
- **Map every object to a mechanism,** in a table that lives next to the script. If an object has no mechanism, it's decoration: cut it.
- **Turn the place where the metaphor breaks into the twist.** The projector, which shows the original without a copy, became the film's dramatic moment.
- **Show things failing.** The wrong sketch (312% full, every test passing), the copy that goes stale, the record a test stops. A failure teaches the mechanism better than a success does.
- **Set guardrails early.** At most three zoom levels, only original art, and no styles that belong to other cultures, such as dot painting, which Australian cultural protocols protect.

*Ask: what would an expert say is wrong with this picture?*

## 3. Rigour

- **Keep a rigour sheet.** For each scene, write down the real technology and what the picture simplifies. It answers experts before they ask, and it's the checklist for the next update.
- **Check names and maturity when you publish,** not when you start. Products get renamed, and previews aren't generally available: say "preview" when something is.
- **Keep roles clear.** dbt writes and tests the recipes; Databricks runs, stores and governs. One sentence per role, repeated in picture and word.
- **Show whose component is whose.** Use official logos, unaltered, and credit the trademarks. License code and content separately (here MIT and CC BY 4.0), and exclude the logos.
- **List your sources with the date you checked them.**

*Ask: which line would I be unable to defend in front of the product team?*

## 4. Visual language

- **Use one design language.** Dark glass, luminous edges, thin line icons and one typeface. Mixing styles reads as mixing ideas.
- **Let colour carry meaning, and never break it.** Each source system has its colour; each business domain has its own; bronze, silver and gold are materials; red means stopped; green means passed.
- **Vary the content, not the style.** Six different, named data products per domain look like a real organisation. Six crops of one picture look like a template.
- **Make things look as they behave.** Live data should visibly change. Raw data should look rough: glitched, duplicated and mistimed. Clean data should look crisp.
- **Keep text clear of captions,** and check every scene against the caption area.
- **Build components, not drawings.** The same vault, data tile, sketch and plaque drawn by one function appear in the film, the labs and the scenarios. Viewers recognise them, and a fix lands everywhere.

*Ask: if I removed every label, could someone still tell what is what?*

## 5. Narration, sound and pace

- **One idea per line, in short sentences.** Voice each line separately, and time the pictures to the voice, not the voice to the pictures.
- **Measure density, don't guess it.** `films/inner-life-of-data/source/tools/pace.py` reports words per minute, how much of the time the voice speaks and the longest quiet moment in each chapter. It also counts sentences that run into the next without a breath, and long stops inside a chapter. The v4 cut ran at 147 words a minute with the voice speaking 86% of the time: accurate, and relentless. The first breathing cut fixed the averages with 32 long stops, and felt stop-start. Averages hide rhythm.
- **Leave room to think, and spread it out.** Aim for about 115 to 130 words a minute, with the voice speaking about 70 to 75% of the time. Leave about 0.7 s after every sentence, and 0.5 to 1 s more after each new named idea. Keep stops inside a chapter under about 2 s, and end each chapter with a wordless breather of 3.5 to 4.5 s that applies the idea to a new case. The picture keeps moving during every pause. See [the breathing cut](films/inner-life-of-data/breathing-cut.md) and [its review](films/inner-life-of-data/pacing-review.md).
- **Keep the camera calm.** Camera moves glide (a sine ease) and take at least about 1.4 s. Whip pans under a talking voice feel rushed; a frame that freezes in a pause feels stopped.
- **Let the film flow; pause only where it matters.** *A Sharper Sketch* gives every sentence a beat of about 0.8 s, holds longer only after the ideas that need to land, and keeps three short wordless endings in the whole film: viewers found a breather in every chapter too many stops.
- **Give each film its own music.** Match the mood to the subject: the first film's pads and pulses suit a journey through a platform; a film about modelling and design gets a slower, warmer ambience.
- **Say it and show it at the same time.** Narration and picture together beat narration plus a wall of on-screen text. Keep on-screen words to labels.
- **Name things before explaining them.** A new term lands better if the picture shows it a moment before the narration explains what it does.
- **Make intentional pauses look intentional.** A silence needs light and motion, or it reads as a glitch.
- **Let sound support meaning.** Music sits under the voice and lifts about 4 dB in pauses, slowly, so it doesn't pump; never cut the sound to silence, which reads as a fault. About sixty effects land on story cues. Mix to about -16 LUFS for the web.
- **Check a synthetic voice by ear and by numbers.** A naturalness model (such as UTMOS) and a speech recognizer catch what a pitch reading misses. Pitch-shifting a synthetic voice made it robotic; blending two voice styles made the Spanish voice more natural and closer to the English one.
- **Be open about the voice.** A synthetic voice is fine; say so. Captions come from the same script as the narration, so they always match.

*Ask: where does the viewer get a moment to catch up?*

## 6. Media as code

- **Make every frame a function of time.** Then any moment can be rendered, reviewed and compared, like software.
- **Time the film to the narration.** Change a line and the whole film re-times itself: a new voice, a human narrator or another language needs no manual editing.
- **Review by looking and measuring.** Render stills at the moments the narration names something, check them, fix, and repeat. Say plainly what you can't check yourself, such as how the audio sounds.
- **Use cheap checkpoints before expensive rebuilds:** style frames, a five-second voice test, a forty-second sound sketch.
- **Render in resumable chunks,** and run one heavy job at a time.
- **Use one source for every output.** The same code makes the MP4, the web player, the labs, the scenario pictures and the posters.
- **Draw it live for learning, and render a file for sharing.** The live player is small, sharp at any size and interactive (chapters, questions, labs). The video file is what platforms accept, plays offline and looks the same everywhere. A full render is also the strictest test: it draws every frame, not just the ones someone watched.
- **Release from a clean machine.** A workflow renders every language from the committed source, and refuses if the site's player or the voice timings don't match it. What people download is then what the site plays, and anyone can make it again.
- **Design for other languages from day one.** Keep words in language packs, let boxes size to the translated text, and check the longest language.

*Ask: if a product is renamed tomorrow, how long does the fix take?*

## 7. From film to learning

A film makes people feel they understand; learning comes from using the ideas. The site follows three steps, one page each:

1. **Watch:** the film, with chapters.
2. **Take it apart:** one hands-on lab per chapter.
3. **Make the call:** scenarios that ask people to decide.

- **Give each page one job.** Keeping practice apart from the labs makes people recall rather than look up, and the change of page is a natural pause.
- **Give each lab one mechanism, and let people break it.** Take Zerobus offline, plant a missing ID, rename a mart column, change the original record. The consequence teaches; the explanation confirms it.
- **Say what just happened, in words.** Every lab has a line under the picture that describes the result, which also serves people using screen readers.
- **Reuse the film's pictures in the labs,** so recognition carries over from watching to doing.
- **Write scenarios as situations, not definitions.** "Every test passed, yet the class is 312% full. Why?" teaches more than "What is a conceptual model?"
- **Make every wrong option plausible, and explain it.** A wrong answer is the best moment to teach, so each option says why it's wrong.
- **Vary the format:** choose, sort, order and spot the problem. Each asks for a different kind of thinking.
- **Link everything back.** Each lab plays its chapter of the film, and each scenario points to its lab. Trying the scenarios before the labs is fine: guessing first makes the answer stick.
- **Remember progress for the person, not about them.** Progress stays in the browser; nothing is sent anywhere.
- **Make every picture operable without a mouse.** Every canvas interaction also has a button.

*Ask: what will someone be able to decide after this that they couldn't before?*

## Checklists

**Before the script**
- [ ] The two-audience promise is written down.
- [ ] One thing to follow, from where it's born to a human outcome.
- [ ] The metaphor is tested against the hardest mechanism, and each layer has one job.
- [ ] A table maps every object to a mechanism.

**Before rendering**
- [ ] The rigour sheet covers every scene.
- [ ] Style frames and a short voice test are approved.
- [ ] `tools/pace.py`: about 115 to 130 words a minute, a quiet moment of at least 4 seconds in each chapter, no sentence followed by less than 0.5 s, and no stop of 2.5 s or more inside a chapter.
- [ ] Stills are checked at every named moment, with nothing under the captions.
- [ ] `tools/check.py`: every moment of the film draws without an error. Stills only sample a few moments.

**Before publishing**
- [ ] Product names, maturity and sources are checked on the day.
- [ ] Captions are generated in every language.
- [ ] Logos are unaltered and credited, and the licences are stated.
- [ ] The labs and scenarios still match the film: same names, numbers and colours.
- [ ] Tested on a phone, in dark mode and with the keyboard only.
- [ ] The videos are released by the release workflow, and watched once from the release.
