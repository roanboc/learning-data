# Playbook: making learning films and material

What made the Learning Data films work, starting with *The Inner Life of Data*, written so the next film, lab or course can start from it. [The making-of story](site/journey/index.md) tells how the films came to be; this page keeps what to reuse. Each section ends with the question to ask of your own work.

## 0. Foundation first

Before story or pictures, the concept is settled. [`AGENTS.md`](AGENTS.md) gives the order to work in, for any agent.

- **Ask for the reference, and suggest others.** Name the framework the films treat as the reference, list the others worth knowing, and say where the films differ.
- **Check it against practice.** Concepts and processes come from what practitioners really do; the author's own experience goes into the brief.
- **Show the usual move before the exception.** Practice has an order, and a film follows it. The first cut of *When strategy moves* changed what a column of a data product meant, so its contract got a second version. The author's practice is to add first: a new column breaks nothing that reads the data, and a new version is the last resort, for a change that isn't additive. The film now adds the discount as a new column, keeps the contract at version 1, and names a second version as the exception.
- **Keep the essential.** Name the bodies of knowledge once, then teach the insights they share, as *From words to data* did with modelling techniques and *The map before the data* with EA frameworks.
- **Tools show, they don't lead.** Databricks and dbt demonstrate the ideas; a topic never exists because a product feature does.

*Ask: would an expert in each framework agree, and would a practitioner recognise it?*

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
- **Show things failing.** The wrong sketch (312% full, every test passing), the copy that goes stale, the record a test stops. A failure teaches the mechanism better than a success does. A success has edges too, so show who a route that works still misses: in *When strategy moves*, the automatic match finds most eligible households but misses tenants whose account is in a landlord's name, as real automatic schemes do, and the film shows them and their second route.
- **Vary the stories, not only the ideas.** A series whose openings all come from the same place and century starts to feel like one film. Plan the openings across a series together: different cultures and regions, the past, the present and imagined futures, and different kinds of story (an invention, a failure, an everyday system). Label an imagined future as imagined, and check a story from another culture against that culture's own sources.
- **Say how the opening story carries the idea, and close it.** An opening from another place or time is there to carry the film's idea, and a viewer won't always see the link alone. Say it in one line at the end of the opening (*Now the questions appear*: the skipper's question mattered because he would act on its answer, and the phones brought it in time), let the main story borrow from it by name ("the skipper's test"), and come back to it before the end, traced with the film's own idea. Its first cut left the link unsaid and the story open, and the author read it as just a decision made from numbers.
- **Make the example show the point, and nothing that reads against it.** The author watched the Kenya opening of *When strategy moves* three times and couldn't see what it showed, and says it has happened with other films' examples too. Its first cut told how M-Pesa began, as a pilot for repaying loans that people used to send money home: true, but it read as if no one had set a strategy, in a film about a change in strategy. Lead with the decision the film is about (a mobile network sets a new strategy, to carry money as well as calls), put it on screen in one sentence, and have the narration say what it shows ("That strategy fits in a sentence. Making it real takes much more."). A true detail that makes the example read as something else goes to the rigour sheet, not the film.
- **Set guardrails early.** At most three zoom levels, only original art, and no styles that belong to other cultures, such as dot painting, which Australian cultural protocols protect.

*Ask: what would an expert say is wrong with this picture?*

## 3. Rigour

- **Keep a rigour sheet.** For each scene, write down the real technology and what the picture simplifies. It answers experts before they ask, and it's the checklist for the next update.
- **Check names and maturity when you publish,** not when you start. Products get renamed, and previews aren't generally available: say "preview" when something is.
- **Keep roles clear.** dbt writes and tests the recipes; Databricks runs, stores and governs. One sentence per role, repeated in picture and word.
- **Show whose component is whose.** Use official logos, unaltered, and credit the trademarks. License code and content separately (here MIT and CC BY 4.0), and exclude the logos.
- **List your sources with the date you checked them.**
- **Take a list about people from its standard.** Gender or title choices written from memory leave people out: the first draft of *Lists everyone uses* had no non-binary. Copy the choices from the statistics standard the story's place follows (in Australia, the ABS standard of 2020), and name it in the rigour sheet.
- **Copy code on screen from the project.** A test or a model shown in a film is the project's own file, with the same keys (a test's `arguments:`, as the project writes them); the rigour sheet says what the picture leaves out.
- **Say who owns what at one level, and keep it.** *Lists everyone uses* gave each role type its own owner, then called HR "the list's owner" two chapters later. Choose the level (the list, or each value) and keep it in every line, label and question.
- **Don't say a tool can't do what it can.** The first cut of *Meaning machines can read* said Genie couldn't read the stacking policy, a PDF; assistants read documents and web pages. The real problem is a policy and an old page that disagree, with no owner and no version, outside a managed glossary. Show that, and check what today's tools can do on the day.
- **Show the source of truth, and the platform it feeds.** Platforms now carry a glossary's definitions next to the data (in Databricks, on each table's page, where Genie reads them). Show the managed source first, then where it reaches, and say which parts are in preview.

*Ask: which line would I be unable to defend in front of the product team?*

## 4. Visual language

- **Use one design language.** Dark glass, luminous edges, thin line icons and one typeface. Mixing styles reads as mixing ideas.
- **Let colour carry meaning, and never break it.** Each source system has its colour; each business domain has its own; bronze, silver and gold are materials; red means stopped; green means passed.
- **Give a colour one job.** In *One person, many roles* each role has its colour, so the series' four parts, first painted in role colours, read as one role's films each. They now sit on plain paper, and a cross is drawn in red ink rather than in a role's colour.
- **Check what each shape reads as, and who it shows acting.** Viewers name what they see before the voice explains it. A strip of churchyard wall, drawn level to give the church flat ground, read as an oddly placed bridge over the lake; a second person holding a phone in the last scene read as the one typing Linh's address. Shape the ground to carry what stands on it, and give an action to one person.
- **Show each line once.** The closing line faded out while the end card faded the same words in, so for a moment it showed twice. Carry it onto the card instead, to where the card's own copy takes over. Set a tag down before writing its words, too, so a line drawn behind it never strikes through them.
- **Vary the content, not the style.** Six different, named data products per domain look like a real organisation. Six crops of one picture look like a template.
- **Make things look as they behave.** Live data should visibly change. Raw data should look rough: glitched, duplicated and mistimed. Clean data should look crisp.
- **Draw living things like living things.** Animals, plants, hands and the materials of the past (clay, paper, wood) made of circles, straight strokes and rectangles look rigid next to people drawn with care: viewers of *What's in a word* noticed at once. Give them tapering bezier outlines, overlapping forms, weight, a light side and a shadow side, and a little life from time: breath, wind, a gait. Keep data, systems and diagrams crisp; the contrast says which is which.
- **Hold things the way hands do.** At the agent's counter in *When strategy moves*, banknotes lay across the hands, slid under an open palm and stuck out on both sides of it, and the author saw papers overlapping the hands. Laid along the hands, the notes still looked wrong when the agent let them go over an open palm: the giver's hand came down over the taker's. Lay what a hand holds along it, no wider than the hand: on top of an open palm, or under the fingertips of a hand seen from its back, reaching out beyond them. To pass it, each hand holds one end, with the note between them and a gap between the hands, never one hand over the other. Hand it over while both hands are still, so it never jumps.
- **Dress people for their time.** In scenes about nature, prehistory and the ancient world, people could be the first humans developing language: draw them as early humans, in hide or woven clothing, bare-armed, with dignity and without caveman clichés. A suit sleeve pointing across a grassland breaks the spell. Modern clothes belong to present-day scenes.
- **Keep text clear of captions,** and check every scene against the caption area.
- **Make it read on a phone.** A phone held sideways shows the 1920-pixel frame about 850 pixels wide, so text smaller than about 28 px in the frame is too small to read there. Use fewer, larger words; when a picture is dense (a canvas full of notes, a table), move the camera in on the part the narration is about, and treat the whole picture, seen from afar, as context. Text that is texture rather than something to read (a scrolling list of systems, a canvas's printed headings) is marked as decoration. *The map before the data* was drawn to the rule from the start. The films made before it now meet it through a shared layer, `films/from-words-to-data/shared/src/phone.js`, which raises every piece of text that isn't decoration to 28 px after the camera's zoom; each film's scenes then make room for the larger words. Every player also draws its captions larger as it shrinks (`films/inner-life-of-data/source/src/engine3.js`, `drawCaption`). *The Inner Life of Data* came last, in English and Spanish: Spanish words run longer, so check both languages.
- **Place things by the size they're drawn at, not the size asked for.** Once text grows to 28 px, a card, a row or a label below it measured from the old size runs into it. Measure what's drawn (`phSz` in `phone.js`) and lay out from that; a card's height comes from drawing it once, unseen, and stacks below it start from there.
- **When the room runs out, take turns.** Larger words don't always fit side by side. Show cards one after another (each fades as the next arrives), keep only the line of code the narration is reading and the lines around it, shorten long names on the phone, and let tags wrap into rows by their width. Code is the hardest: show fewer lines, larger, rather than the whole file small.
- **Keep a name whole with a no-break space.** `wrapT` breaks lines at spaces, so a name that must stay on one line (*accounts and bills*) is written with `\u00a0` between its words. Write the escape, not the character: the two look the same, and *When strategy moves*' first helper for it replaced each space with a plain one, so nothing changed.
- **Decide what is texture, on purpose.** A period page behind the story, a picture seen from afar, a card half-hidden behind another and a background list are decoration: they set the scene and aren't read. Everything the narration names must read. Marking too much as decoration is the easy way out, and the report will still pass, so review the stills. A component drawn both up close and small (a bill, a rule's card) takes a `deco` option that reaches all of its text, so its small copies are texture on purpose and its close-up is still checked.
- **Labs and scenarios keep their sizes.** They're read up close and size their text for their real width, so the phone layer loads only in the films. *The Inner Life of Data*'s player also serves the labs, so there `src/phonefit.js` keeps the layer to the canvas the film draws its frame on; a lab canvas as wide as the frame stays as it was.
- **Check for overlaps at every moment, not only at the cues.** Stills at each narration cue missed labels hidden under a frame, a card crossing a head and film cards flying over each other in between. A still every 2 seconds, tiled nine to a sheet, catches them. `tools/legible.py --overlaps` measures the text each frame really draws, after the camera's zoom, every half second, and reports text under 28 px, text running off the frame and words drawn over other words; what's left is usually a moment in passing (a fade, a card flying in) that a still confirms.
- **Fade what the camera leaves behind.** As the camera moves in on part of a map, the names it leaves slide off the frame before they fade: in *Now the questions appear*, India's ran off the edge as the camera moved in on Kerala's coast. Start their fade as the move starts; `legible.py --overlaps` lists them as text off the frame.
- **Keep people wholly in or out of the frame.** When the camera moves in, a person at the edge either stays whole or leaves the shot: half a face reads as a mistake.
- **Order labels as their lines land.** When several labels join one figure, stack them in the order their lines meet it, so no two lines cross. A value about the person, such as a country of birth, meets the person below the role bands, not on one.
- **Underline when rings would cross.** Rings round two lines that sit close together overlap; underline each, one after the other, instead.
- **Merge things in turn.** Three chips that become one row slide in one by one, each fading only as it arrives, so none is drawn over another on the way.
- **Give motion weight, and carry things across cuts.** Things that arrive with a small spring and settle, a camera that drifts slowly in every shot, and a thing shared by two chapters that travels across the cut instead of fading (a model, a file, a graph) read as animation, not slides. In the video, motion blur (several moments averaged into each frame) makes movement read as filmed; with too few moments, a fast label shows doubled copies instead of a smear. Skip film grain: noise doesn't compress, and a fine grain made one video more than twice as large (123 MB against 53 MB). Motion itself costs space too: drift and blur doubled that video against its still-framed cut (53 MB against 27 MB), which is still small. *In the weeds of data crafting* keeps these helpers in `films/analytics-engineering/shared/src/weeds.js` and `post.js`.
- **Build components, not drawings.** The same vault, data tile, sketch and plaque drawn by one function appear in the film, the labs and the scenarios. Viewers recognise them, and a fix lands everywhere.

*Ask: if I removed every label, could someone still tell what is what?*

## 5. Narration, sound and pace

- **One idea per line, in short sentences.** Voice each line separately, and time the pictures to the voice, not the voice to the pictures.
- **Measure density, don't guess it.** `films/inner-life-of-data/source/tools/pace.py` reports words per minute, how much of the time the voice speaks and the longest quiet moment in each chapter. It also counts sentences that run into the next without a breath, and long stops inside a chapter. The v4 cut ran at 147 words a minute with the voice speaking 86% of the time: accurate, and relentless. The first breathing cut fixed the averages with 32 long stops, and felt stop-start. Averages hide rhythm.
- **Leave room to think, and spread it out.** Aim for about 120 to 135 words a minute, and at most 140 in any chapter, with the voice speaking about 75% of the time and at most 82% in any chapter. Leave about 0.8 s after every sentence, and 0.5 to 1 s more after each new named idea; a language that takes longer to say the same thing may need a longer beat in its densest chapters. Keep stops inside a chapter under about 2 s. The picture keeps moving during every pause. *The Inner Life of Data*'s [breathing cut](films/inner-life-of-data/breathing-cut.md) and [its review](films/inner-life-of-data/pacing-review.md) tell how these numbers were found; its fourth cut uses them.
- **Keep the camera calm.** Camera moves glide (a sine ease) and take at least about 1.4 s. Whip pans under a talking voice feel rushed; a frame that freezes in a pause feels stopped.
- **Let the film flow; pause only where it matters.** *A Sharper Sketch* gives every sentence a beat of about 0.8 s, holds longer only after the ideas that need to land, and keeps three short wordless endings in the whole film: viewers found a breather in every chapter too many stops.
- **Give each film its own music.** Match the mood to the subject: the warm pads of *The Inner Life of Data* suit a journey through a platform; a film about modelling and design gets a slower, warmer ambience.
- **Vary the sound itself, not only the mood.** Viewers who watched more than one film found the sound repetitive after the first. Every film so far builds its music and effects from the same few synthesised sounds (pads, drones, and the same chimes, whooshes, ticks and bells in each `tools/audio.py`), so a new key or tempo still sounds like the last film. For the next film, change the palette: other instruments and timbres, another rhythm, a new set of effects, or a recorded or licensed score. Check by listening to two films back to back.
- **Nothing loops without a reason, and every sound is something on screen.** A viewer noticed sounds that kept repeating in the background and didn't match what appeared: clocks, pulses, repeated figures and random notes drift apart from the pictures and wear on the ear. Keep the music to sustained chords that change with the chapters, and fire each effect at the same moment, with the same word and offset, as the thing it belongs to in the scene. *Declare it, then build it* works this way. A repeated figure can carry meaning when each note belongs to something: in *When strategy moves*, a soft felt-piano note falls for each layer the change reaches, so the ear follows it down the map.
- **Let rhythm follow the feeling.** Chords alone made every scene feel the same: an error landed as calmly as a success. Where the story turns to an error or a rush, a low, muted pulse rises under it and fades out when the problem is caught (`urgent()` in `films/from-words-to-data/shared/tools/music.py`): a short bass note on every beat, leaning on the semitone for an error or driving on the fifth for a rush, a soft drum on one and three and a muffled key between, all below about 1 kHz. Match the tempo to the scene: about 92 to 100 beats a minute for something going wrong, slower and uneasy for a slow drift, quicker for a deadline or a busy kitchen. Set it about 7 to 10 dB under the rest of the music, measured on its own, so its hits come through without taking over (a slow drift can sit lower): the first pulses sat 11 to 18 dB under, too faint to notice. Give the bass note a few harmonics, because a phone's speaker can't play a 55 Hz root; on a phone, the muffled off-beat key carries most of the rhythm. Keep it to those scenes; the calm chapters have none, so the contrast tells the viewer something has changed.
- **Keep effects low and soft.** The same viewer found high tones disruptive: chimes, pings, shimmers and hi-hats carry energy far above the voice. Knocks, muffled keys, soft paper and low felt notes, filtered below about 2.5 kHz, mark a moment without cutting through the narration. To soften a film already made, replace its bright effects by name with soft stand-ins that take the same arguments (`soft_palette()` in `music.py`: a chime or a ping becomes a low felt note, a tick a muffled key, a pop a wooden knock, a sweep a breath of air), so every cue keeps its time. If the instruments themselves still ring above the voice (a kalimba, glass pads, FM bells), low-pass the whole score last, music and effects but not the voice (`soften()`, at 2.6 kHz). When only one instrument rings high, take the top off that one alone: *Now the questions appear* plays its celesta low-passed at 2.6 kHz, like the nylon string, and needs no `soften()`. Compare the energy above 4 kHz, where the voice is silent, before and after, against a film that already sounds right: in a mix normalised to -16 LUFS, *The map before the data* measures about 0.0001 to 0.0003 of full scale (RMS), and the reworked films 0.0002 to 0.0005. Measured over the whole mix, the voice's own sibilants swamp it (*When strategy moves*: 0.022 with the voice, 0.00014 in its 81 s of silence), so find the silences from the timeline first.
- **Say it and show it at the same time.** Narration and picture together beat narration plus a wall of on-screen text. Keep on-screen words to labels.
- **Name things before explaining them.** A new term lands better if the picture shows it a moment before the narration explains what it does.
- **Say which one.** "It will take longer than the code" left the author asking: what code? A newcomer can't point at "the code", "the system" or "the data" unless the line or the picture has named it. Say which: "agreeing it will take longer than changing the systems".
- **Make intentional pauses look intentional.** A silence needs light and motion, or it reads as a glitch.
- **Let sound support meaning.** Music sits under the voice and lifts about 4 dB in pauses, slowly, so it doesn't pump; never cut the sound to silence, which reads as a fault. About sixty effects land on story cues. Mix to about -16 LUFS for the web.
- **Check a new palette's levels against a film that sounds right.** New instruments come out at their own loudness, and the final loudness pass can't fix the balance between them. With the voice as the yardstick, the music of *The map before the data* sits about 21 dB under the voice while it speaks, and about 18.5 dB under in the pauses. The first mix of *One person, many roles*, with its new watercolour palette, sat 26 dB under, too faint, while its one pulse sat only 3 dB under the music, too loud. Measure the music and the effects on their own, scaled as `tools/audio.py` mixes them, before rendering. The effects need it too: those of *Lists everyone uses* first sat 18 dB under its music, against about 12 dB in *One person, many roles*, and went unheard.
- **Check a synthetic voice by ear and by numbers.** A naturalness model (such as UTMOS) and a speech recognizer catch what a pitch reading misses. Pitch-shifting a synthetic voice made it robotic; blending two voice styles made the Spanish voice more natural and closer to the English one.
- **Be open about the voice.** A synthetic voice is fine; say so. Captions come from the same script as the narration, so they always match.

*Ask: where does the viewer get a moment to catch up?*

## 6. Media as code

- **Make every frame a function of time.** Then any moment can be rendered, reviewed and compared, like software.
- **Time the film to the narration.** Change a line and the whole film re-times itself: a new voice, a human narrator or another language needs no manual editing.
- **Review by looking and measuring.** Render stills at the moments the narration names something, check them, fix, and repeat. Say plainly what you can't check yourself, such as how the audio sounds.
- **Use cheap checkpoints before expensive rebuilds:** style frames, a five-second voice test, a forty-second sound sketch.
- **Render in resumable chunks,** and run one heavy job at a time.
- **Time a frame from every chapter before the full render.** A canvas filter set on the context (`ctx.filter`) applies to every stroke drawn after it: *When strategy moves* greyed its map that way, and its last 8 seconds took 41 s a frame against about 1 s elsewhere, which held the render's last chunk for hours. Draw such a part once into a copy, and filter the copy.
- **Sum a long note's phase in double precision.** From words to data's `flute()` sums its pitch over `music.tt()`'s times, which are single precision, and on a long note the pitch slips by about a hertz at a time, so it beats against the same note on the nylon string. *When strategy moves* plays its own copy, summed as float64, and gives its felt piano partials in whole-number ratios on one string, so one note's octave doesn't beat with the next. Its `tools/quiet.py`, the master data films' check, finds what an ear on headphones misses.
- **Use one source for every output.** The same code makes the MP4, the web player, the labs, the scenario pictures and the posters.
- **Draw it live for learning, and render a file for sharing.** The live player is small, sharp at any size and interactive (chapters, questions, labs). The video file is what platforms accept, plays offline and looks the same everywhere. Keep captions off its picture and ship them as `.srt` files beside it: one video then serves every language, and a caption fix needs no new render. A full render is also the strictest test: it draws every frame, not just the ones someone watched.
- **Release from a clean machine.** A workflow renders every language from the committed source, and refuses if the site's player or the voice timings don't match it. What people download is then what the site plays, and anyone can make it again.
- **Design for other languages from day one.** Keep words in language packs, let boxes size to the translated text, and check the longest language.
- **Start a language with captions.** A full version needs a new voice, new on-screen text and a new video. Captions alone keep the same film and the same video, and take one file: every film after *The Inner Life of Data* has Spanish captions this way. Keep each caption about as long as the English line, so it reads in the time the voice takes. Since 16 October 2026, captions and the site's pages are the only Spanish: no film's visuals or voice are translated, because that doubled the work for every change.
- **Keep an offset's remainder positive.** JavaScript's `%` keeps the sign, so an offset worked out from a seed or a position that can go below zero, such as a wash that starts left of the frame, moves a texture into the frame instead of past its edge, and leaves a strip without it. Use `((v % n) + n) % n`. The landscapes of *One person, many roles* had a pale strip down their left edge until work on *Which value wins* showed it.

*Ask: if a product is renamed tomorrow, how long does the fix take?*

## 7. From film to learning

A film makes people feel they understand; learning comes from using the ideas. The site follows three steps, one page each:

1. **Watch:** the film, with chapters.
2. **Take it apart:** one hands-on lab per chapter.
3. **Make the call:** scenarios that ask people to decide.

- **Give each page one job.** Keeping practice apart from the labs makes people recall rather than look up, and the change of page is a natural pause.
- **Give each lab one mechanism, and let people break it.** Take Zerobus offline, plant a missing ID, rename a mart column, change the original record. The consequence teaches; the explanation confirms it.
- **Keep the page to what people use.** Notes on how to read a film's colours and conventions went unread next to the film itself: the film has to explain itself.
- **Say what just happened, in words.** Every lab has a line under the picture that describes the result, which also serves people using screen readers.
- **Say the end once.** When a lab ends, its end box says what it showed, and the line under the picture stays for screen readers only. Shown twice, the same sentence reads as a mistake.
- **Reuse the film's pictures in the labs,** so recognition carries over from watching to doing.
- **Write scenarios as situations, not definitions.** "Every test passed, yet the class is 312% full. Why?" teaches more than "What is a conceptual model?"
- **Make every wrong option plausible, and explain it.** A wrong answer is the best moment to teach, so each option says why it's wrong.
- **Make a pass mean something.** A fix that turns a check green must be one its owner would accept. In *The navigator's test*, "owner: to find" passed the map's checks and taught the opposite of the film; a named owner, with the meeting that confirmed it, doesn't.
- **Vary the format:** choose, sort, order and spot the problem. Each asks for a different kind of thinking.
- **Link everything back.** Each lab plays its chapter of the film, and each scenario points to its lab. Trying the scenarios before the labs is fine: guessing first makes the answer stick.
- **Remember progress for the person, not about them.** Progress stays in the browser; nothing is sent anywhere.
- **Make every picture operable without a mouse.** Every canvas interaction also has a button.

*Ask: what will someone be able to decide after this that they couldn't before?*

## 8. From one film to a series

What *A Sharper Sketch* and *When things go wrong* added once there was more than one film.

- **Turn feedback into the next film.** *A Sharper Sketch* says openly that the earlier sketch was an oversimplification, and sharpens it. Correcting in the open teaches the very habit the film is about.
- **One film, one mechanism.** Park what doesn't fit (the physical build went to a later film for engineers), and keep a list of candidates for the series.
- **Choose a reference deliberately.** When there is more than one standard, name the one you use and why, then adopt, extend and record the differences.
- **Put people on every side of the problem.** Technical and business, producing and using the data: one person in each corner, the same guide in every film, and outline colours that say the side.
- **Test characters in code before the script,** with a character sheet of poses and expressions, and write the script within what it shows works.
- **Blameless and believable.** No villains, and small, plausible numbers: the dangerous wrong number is the one nobody questions.
- **Show the alternatives side by side,** so the one thing that differs between them is the lesson.
- **Draw what the audience already knows.** A dashboard in a familiar style beats an abstract picture that needs explaining.
- **Use the domain's own words, and cases people have lived.** A university has applicants, students, staff, researchers and alumni; it doesn't call them customers. A student sharing one family email with her brother was real in the example data but hard to picture, and a contract posted to an old flat read as out of date: offices don't post contracts any more. A graduate who applies again online and gets a second student number is something universities publish notices about, so check a case against what institutions actually publish, and never blame what is normal (separate staff and student logins). When a story needs an unusual case, say in one line how it comes about.
- **Preview a series in a few parts.** Eight films named one by one took too long. Group them into a few plain parts (*One person, many roles* uses four: who someone is, roles and lists, sharing it safely, keeping it right) and show every film inside its part.
- **Write each decision down with its date,** in the treatment or the story outline, so the next session starts from it.
- **Films stand alone.** No numbers on screen, and none for the site's standalone films; open with a one-line recap, and place each film under the part of the overview it goes deeper on. A series is the exception: its films are numbered, always as "Film 2 of 7", and each film's page ends with *In the series*: the previous and the next film, and the whole series in order. Seven films without numbers were hard to keep track of.
- **Turn every review finding into a check** (`site-tools/check_site.py`, `site-tools/smoke.py`, `tools/check.py`), so it can't come back.

*Ask: what did the last film teach us, and where is it written down?*

## 9. From a series to a course

What *From words to data*, seven films made together, added.

- **Follow one idea through every film.** The credential runs through all seven, from four offices' four numbers to an AI agent's draft, so each film picks up where the last one left it. A thread keeps a course from becoming a row of lectures.
- **Start each film in the past, with something still true.** A monkey's alarm call, a merchant's ledger, a library's card catalogue, a cash register: each opens a film with an idea that outlived its materials. History carries the concept; the present tests it.
- **Give every film its own sound.** One shared motif (four notes, in each film's key and on its own instrument) ties them together; everything else differs: a kalimba and a choir, an organ and a lute, a marimba against strings, library jazz, synth arpeggios, glass bells, strings and a clock. Seven films with one palette would sound like one long film.
- **Share tools, not copies.** One set of tools and one instrument library serve every film; each film keeps only its own words, pictures and score. A fix lands everywhere at once.
- **Write the narration first, for all the films.** Voicing every script before drawing any picture fixes the timeline, shows which films are too thin, and lets the pictures be made in parallel.
- **Generate what repeats, and check it's current.** With forty pages in two languages, the pages come from each film's data (`site-tools/build_series.py`), and the site check fails if a page isn't what the generator makes.
- **Check every frame, not every tenth of a second.** A ring whose radius dipped below zero for one frame stopped a full render; the checker now draws every frame the video will.
- **Bridge every detour back to the thread.** A philosopher's rabbit made "the grain" land out of nowhere until the next line brought it home: Mei's degree and two microcredentials are one graduate, or three credentials. Every excursion into the past ends on the credential.
- **Let the resolution follow the model.** Once the offices agree a definition, say which numbers counted things it leaves out; "none was wrong" contradicts the diagram on screen. And don't make agreement sound cheap: it takes people, trade-offs and time.
- **Connect look-alikes, rather than rank them.** A glossary, an ontology and a data model can all draw the credential, and viewers confuse them. The first cut of *Meaning machines can read* set the ontology beside the glossary and the semantic layer, but never beside the data model, the comparison most often got wrong; the next set the two side by side as rivals with different jobs, which made a practitioner ask which one to keep. The chapter that stayed, *One map, many views*, shows where they all come from: one architecture map, where each concept is written once, and the views drawn from it, each with its job. Show the source and the flow, and the differences explain themselves. Name each part where it first appears, too: *What's in a word* now labels its glossary and its conceptual model on the sheet.
- **Build labs from a few kinds.** Sort, count, pick, compose and step through cover most ideas; each lab is words plus one picture drawn with the film's own components. Every word a picture draws comes from the language pack, and text is sized for the lab's real width.
- **When every film builds one thing, give the series one set of labs.** *The map before the data* adds to one map in every film, so it has one labs page and one scenarios page for all eleven: a lab for each film's one mechanism, and scenarios that say which film they come from. What the films leave unsaid can be taught there: the series' standard changed to ArchiMate 4 mid-series, and a lab and five scenarios show and test what changed, while the films simply use it. Check every answer against the films as built, not only against the plan, and settle any difference with the film's own thread: a first draft gave generating power an owner the films never found, and the lab and film 11 first drew the map's agent two ways, until both drew it as version 4 does, as software in a role. A lab never fills a gap the films leave open.
- **Lay each language out at its own length.** Spanish runs longer than English, and some of its words are long (*electrodependiente*, *comercialización*). Lay every picture out from the measured words: boxes that grow to three lines on a phone, a long word broken between syllables, a two-line heading balanced so no word is left alone, and a label that takes its own row when it can't sit beside a title. Review every lab at 320 and 390 px in both languages, played through to its end.

*Ask: if someone watched only one film, would they still want the next?*

## Checklists

**Before the script**
- [ ] The two-audience promise is written down.
- [ ] One thing to follow, from where it's born to a human outcome.
- [ ] The metaphor is tested against the hardest mechanism, and each layer has one job.
- [ ] A table maps every object to a mechanism.
- [ ] The opening story's link to the idea is said in one line, the main story uses it, and the film comes back to it at the end.
- [ ] The opening's example shows the film's point plainly: the narration says what it shows, and no detail in it reads as the opposite.
- [ ] What practitioners do first comes first, and an exception is named as one.
- [ ] The roles, words and cases are ones the domain uses and viewers have lived; an unusual case says how it happens.

**Before rendering**
- [ ] The rigour sheet covers every scene.
- [ ] Style frames and a short voice test are approved.
- [ ] `tools/pace.py`: about 120 to 135 words a minute (at most 140 in a chapter), the voice speaking at most 82% of any chapter, about three wordless endings in the whole film, no sentence followed by less than 0.5 s, and no stop of 2.5 s or more inside a chapter.
- [ ] Stills are checked at every named moment, with nothing under the captions, every shape reading as what it is, and one person doing each action.
- [ ] Hands hold what they hold as hands do: along the hand, on top of an open palm or under pinching fingertips. Two hands passing something hold one end each, never one hand over the other, and it never jumps from one to the other. Stills a few frames apart show it.
- [ ] Text reads on a phone: about 28 px or more in the frame, or marked as decoration, with no words drawn over other words (`tools/legible.py --overlaps`).
- [ ] One language on screen. A film made in English shows no words in another language: they read as forced. Show the glossary's synonyms, or nothing, and leave other languages to the captions.
- [ ] Every "the code", "the system" or "the data" in the narration says which one.
- [ ] Every claim that a tool can't do something is checked against what today's tools do.
- [ ] The sound: effects below about 2.5 kHz, and a rhythm only where the story turns to an error or a rush.
- [ ] `tools/check.py`: every moment of the film draws without an error. Stills only sample a few moments.

**Before publishing**
- [ ] Product names, maturity and sources are checked on the day.
- [ ] Captions are generated in every language.
- [ ] Logos are unaltered and credited, and the licences are stated.
- [ ] The labs and scenarios still match the film: same names, numbers and colours.
- [ ] Tested on a phone, in dark mode and with the keyboard only.
- [ ] The videos are released by the release workflow, and watched once from the release.
