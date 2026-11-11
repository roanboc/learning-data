# Ownership and performance · When someone falls behind: script

*The script of *When someone falls behind*, film 3 of 4 of *Ownership and performance*, the last series of the module *Leading data people*, in six chapters, in English, drawn in the module's sunlit plaster. Written on 10 November 2026 from the module's brief for it (`leading-data-people/briefs.md`, section 14), which carries the author's advice for technical managers of the same day (points 8 to 10: people who fall behind, their causes, removing blockers, patience, and gains that take months or years, come unevenly and are measured against a team that also improved). It was made on assumptions while the author was away, as he asked; this film's questions and assumptions are in the module's working folder (`leading-data-people/14-when-someone-falls-behind/assumptions.md`). It merges as a draft. The narration is in `source/src/narration.js`; this file gives its reasons.*

## The promise

Every line passes two tests: someone new to leading people can follow it, and an experienced data manager finds nothing wrong in it. The film's idea is the harder case of growing people: when one person's work falls behind the team's, look first at what surrounds them (what they were taught, what's in their way, what they're asked to do), ask before judging, clear the blockers, read the gap against the team's own change rather than your expectations, and give it time, said honestly. It never ranks anyone, never shows a person against a named colleague, and keeps the person's reasons private.

**Takeaway:** "Find the cause, clear the way, and give it time."

## The story in one paragraph

Fremont, California, in 1982: General Motors closes its car plant, and thousands of workers lose their jobs. The plant had a name as one of the worst in the country: on a normal day one worker in five didn't come in, complaints ran into the thousands, and cars left the line with parts missing or fitted wrong. Many said the problem was the workers. In 1984 General Motors and Toyota reopen it together as NUMMI, and more than eight in ten of its new workers are the same people, hired back. Groups of thirty go to a Toyota plant in Japan for two weeks; back home they work in small teams, a team leader steps in when something goes wrong, and anyone can pull a cord to call for help. Within two years its cars have about as few faults as Toyota's in Japan, and absence and complaints fall steeply. The same people, in a different system, did some of the best work in the country. At the university, a year from now, the data team moves its reports off the old warehouse onto the platform, written as code and reviewed. The team's days from a request to first use fall from 41 in February to 24 by June. Tomás Ortega, the report developer, who built most of the old reports, speeds up too, but less and unevenly. Helena Novak, having read the team as a whole first, asks before she judges. In his one-to-one on Wednesday 26 May they find two causes, and in June a third: nobody taught him the new tools (he pairs with Jun twice a week, and his Thursday learning time is kept); his strength is the reports' readers more than the code (their release notes and training become his); and a hard time at home (two months of a lighter load, and nobody asks for more). His gap is read against the team's own change: 40 days to 35, while the team went from 41 to 24. He writes his own plan, read with Helena on the first Wednesday of each month. By December the team is at 14 days and Tomás at 20, the gap closed by about half; on Wednesday 15 December Helena tells him plainly that the plan goes on into 2028, and that if building reports stops being where he's strongest, they'll talk about a role that fits him better.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against the sources under *Rigour*, below.

| Beat | The line that says it |
|---|---|
| Scenario | "Fremont, California, in 1982." "General Motors closes its car plant there, and thousands of workers lose their jobs." |
| Problem | "The plant had a name as one of the worst in the country." "On a normal day, one worker in five didn't come in, and complaints ran into the thousands." "Cars left the line with parts missing, or fitted wrong." "Many said the problem was the workers." "For the people who bought those cars, it meant faults to fix. For the workers, it meant no job, and a name that followed them." "Blaming the workers hadn't fixed a single car." |
| Solution | "In 1984, General Motors and Toyota reopen the plant together, as NUMMI." "More than eight in ten of its new workers are the same people, hired back." "Groups of thirty fly to a Toyota plant in Japan, and work beside the people there for two weeks." "Back in Fremont, they work in small teams, and a team leader steps in whenever something goes wrong." "Anyone can pull a cord above the line to call for help. If the problem isn't fixed, the line stops." |
| Benefits | "Within two years, its cars have about as few faults as those Toyota builds in Japan." "Absence and complaints fall steeply. One study found the old way would need half as many workers again to build the same car." "The same people, in a different system, did some of the best work in the country." Then the same for data: "When someone's work falls behind, look first at what surrounds them." "What they were taught, what's in their way, and what they're asked to do." |
| Back to the story | In *Find the cause*: "At NUMMI, pulling the cord brought help, not blame. Helena's part is the same: clear what's in the way." And at the end, with its benefit for data: "At NUMMI, the people didn't change first. What surrounded them did, and then their work did." "Helena did the same: she found the causes, cleared what she could, and gave it time." |

The test: someone who has never heard of NUMMI can say, from the narration alone, why it was a problem (a fifth of the workers absent, thousands of complaints, cars with faults for the people who bought them, and for the workers no job and a name that followed them) and what the fix gave people (cars about as good as Toyota's in Japan, absence and complaints falling steeply, and the same people doing some of the best work in the country). The story is blameless: "Managers had seen the absences. Workers had seen a line that never stopped, and nobody to help. Both were right about what they saw."

## The reference, and practice

The brief names three references, each named once; the film teaches what they share: look at what surrounds the work before you look at the person, ask before you judge, and make it safe to say what's wrong.

| Body of knowledge | What it adds | Where the film uses it |
|---|---|---|
| Robert F. Mager and Peter Pipe, *Analyzing Performance Problems, or You Really Oughta Wanna* (1970) | The first question when someone's work falls short: could they do it if they had to (if their life depended on it)? If not, it's a gap in skill, and training helps; if they could, something else is in the way: the work, its obstacles, what it rewards | "Robert Mager and Peter Pipe asked: could they do it if they had to? If not, it's a skill. If they could, something is in the way." |
| Thomas F. Gilbert, *Human Competence: Engineering Worthy Performance* (1978), the behaviour engineering model | Look first at the environment (information, tools and resources, incentives), then at the person (knowledge, capacity, motives): most of what holds work back lies in what surrounds it | "Thomas Gilbert said: look at what surrounds the work, its information, its tools and its rewards, before you look at the person." |
| Amy C. Edmondson, "Psychological safety and learning behavior in work teams" (*Administrative Science Quarterly*, 1999), and *The Fearless Organization* (2018) | People speak up about problems and mistakes when they believe it's safe to; that belief is shared in a team, and a leader shapes it | "Amy Edmondson calls it psychological safety: people say what's wrong when it's safe to." |
| Practice (the author's advice of 10 November 2026, points 8 to 10) | Find the root cause (training, fit for the role, personal circumstances); remove blockers first; be patient; gains take months or years and come unevenly; compare against a team that also improved with new tools and processes | The whole data story, and the four steps of *On Monday* |

**Where the film adopts, extends or differs.** It adopts Mager and Pipe's first question and Gilbert's order (the work's surroundings before the person), without their flowcharts or six cells. It extends them from the author's practice: a cause can be a hard time outside work, which needs patience rather than a fix, and nobody needs to know more than that; and a gap is read against the team's own change, since new tools lift everyone. It differs from the common reading of "performance management" as rating people against each other: there is no ranking, no comparison with a named colleague, and the person writes his own plan. The film says honestly where it may end (a role that fits him better), which the author's advice asks for and none of the three books is about.

**Practice.** A practitioner will recognise the person who kept the old system running while the others learned the new one; the learning time given up to clear a list; the expert whose strength is the people who use the work more than the code behind it; a hard time at home, said once and kept private; the month that goes well and the one that goes back twice; and a gap that narrows by half in six months, not all the way.

## What each object stands for

| Object | Stands for |
|---|---|
| The plant from outside, a saw-tooth roof, a car park and a fence; "Fremont, California · 1982 · A General Motors car plant"; the gate rolled shut, "Thousands of jobs lost" | The plant, and its closing |
| The hall: trusses, lamps, cars moving on the line, five workers in aprons; an empty place outlined in amber, "One worker in five, not in"; cars with a door missing or wrongly painted | What was wrong at the plant |
| "Many said · The problem is the workers"; amber cards for the buyers ("Faults to fix") and the workers ("No job · And a name that followed them") | Blame, and the harm to people |
| The same hall, its roof lights clean; "1984 · NUMMI · General Motors and Toyota, together"; the same five people back at the line, "More than 8 in 10: the same people" | The same people hired back |
| A plain map with an arc from Fremont to "A Toyota plant, Japan"; "Spring 1984 · Groups of 30 · Two weeks, working beside the people there" | Learning beside people who already did it |
| The cord above the line pulled, a lamp lit, the team leader walking over, the line stopping; "Anyone can pull the cord", "Not fixed? The line stops" | Help on call, not blame |
| Green cards: "Within two years · About as few faults as Toyota's in Japan", "Absence and complaints · Fell steeply", "One study · The old way: half as many workers again" | The benefit, with the sources' numbers |
| A manager and a worker, "Managers saw · The absences", "Workers saw · A line that never stopped, and nobody to help"; "Both right about what they saw" | Nobody to blame |
| An empty desk in the team room, with three tags: "What they were taught", "What's in their way", "What they're asked to do" | What surrounds someone's work: the turn from NUMMI to data |
| "The old warehouse" and "The platform", reports moving across, "Written as code, reviewed" | The team's move |
| The chart, "Days from a request to first use", Feb to Dec: the team's line (orange) and Tomás's (dashed ink) | The team's change, and his within it |
| Tomás's sheet, "Report developer · Tomás Ortega"; "Tomás's weeks, April to June · Faster too, but less, and unevenly", ten weeks, some "Kept pace with the team", some "Went back for changes" | Uneven gains |
| Helena's sheet; green "The team's shared work: going well", amber "One person's: falling behind it"; "Before she judges, she asks" | Reading the team first, then the person |
| Two cards: Mager and Pipe's question, and Gilbert's "First, what surrounds the work" | The two old books |
| Tomás and Helena at a table, "Wednesday 26 May · Tomás's one-to-one", "What's getting in your way?" | Asking |
| Three cards, "One · Training", "Two · Fit for the role", "Three · A hard time", each with green pills as a blocker is cleared ("Pairing with Jun, twice a week", "Thursday learning time, kept", "Their notes and training: his", "Two months, a lighter load") | The causes, and what was done about each |
| The NUMMI hall again, the cord pulled; "Help, not blame", "Helena's part: clear what's in the way" | Back to the story |
| "Amy Edmondson · Psychological safety" | Why he could say it |
| The chart with "Against the team's own change", the gap at June in amber, "A gap of 11 days", "He improved: 40 to 35", "The team: 41 to 24"; "Between him and Helena" | Read against the team, never a colleague, and private |
| Tomás's plan in blue, "Written by him", "Agreed with Helena"; the first Wednesdays, Jul 7 to Dec 1, "Read together" | His own plan, read each month |
| The chart through December, September green, October amber, "The gap: 11 days to 6" | Gains that come unevenly, and the gap halved |
| A December evening at the table; "Wednesday 15 December · The plan goes on into 2028 · If a role fits him better, they'll talk about it"; "Said now, not later" | Honest about where it's going |
| A line from 2027 into 2028, dashed on; "Months, or years"; "His measures: his own", "His reasons: private" | Patience, and privacy |
| The NUMMI hall, "The same people", "What surrounded them changed"; Helena with three pills, "Found the causes", "Cleared what she could", "Gave it time" | Back to NUMMI, and the same in data |
| Four sheets for Monday; "Next: Growing people"; three pills, "Find the cause", "Clear the way", "Give it time", as they become the end card | What to do on Monday |

## The look

*Sunlit plaster*, the module's look, with the module's kit from `films/the-new-skills/shared/src`. Nothing is watercolour, and nothing has film grain.

- **The data story** is in the team's rooms: morning for the move, day for the causes, late afternoon for the gap and the plan, and a December evening, lamp lit, for the honest talk. People are drawn to the agent films' rules: adult proportions, one turn for the whole head (`AG_FACE`), arms down. The first university scene is tagged "The university, 2027 · imagined". Tomás is new to the module: dark side-parted hair with a grey streak, a beard and a brown-grey cardigan (`FB_TOMAS` in `src/fb_uni.js`), looked at full size facing both ways.
- **The opening is Fremont,** drawn in the same matte language: a plant with a saw-tooth roof seen from its car park, then the hall inside, a moving line of early-1980s cars in plain colours, workers in aprons over shirts, a team leader, and a manager in a suit. Nothing is a likeness of the real plant, its people or its cars, and no maker's logo is drawn. Nothing Japanese is drawn for Toyota but a plain map's label.
- **Colours carry meaning,** as in every film of the module: blue for plans (Tomás's plan, the 2028 card), orange for data (the team's line), green for something done or cleared (each blocker's pill, the results), amber for a cost or a gap (the absences, the gap). Tomás's line is dashed ink, never a colour that ranks him.
- **Its own pieces,** drawn once in the film's own source: in `src/fb_plant.js`, the plant, the hall by day and lit for 1984, the line, the cars, the cord and its lamp, and the people of Fremont; in `src/fb_uni.js`, the team room's morning, the one-to-one room by late light and by a December lamp, the map, Tomás, the warehouse and platform, his weeks, the first Wednesdays and the chart; in `src/fb_scenes.js`, the six chapters. The film never changes the module's kit for itself.
- **Carried across cuts:** the empty place on the line becomes the empty desk, and its three tags become the title card; the chart glides on through *Behind the team*, *Against the team's own change* and *Give it time*; the hall returns twice. Chapters after the first glide on from the room the one before left (`ag_cutInto`).
- **Phone legibility:** every word at least 28 px in the 1920 px frame after zoom (211 pieces of text, none smaller), nothing below y ≈ 890, and no text over other text (`tools/legible.py --overlaps`).
- **Poster:** the chart at June, the gap of 11 days, 2.6 seconds into "By June, the new tools had brought the team to 24" (`film.json`, *poster*).

## Script

The times are the film's, from its recorded voice. "3 · When someone falls behind" sits at the top left from the second chapter on.

### 1 · Same people, another way · 0:00–2:11

**Narration.** Fremont, California, in 1982. General Motors closes its car plant there, and thousands of workers lose their jobs. The plant had a name as one of the worst in the country. On a normal day, one worker in five didn't come in, and complaints ran into the thousands. Cars left the line with parts missing, or fitted wrong. Many said the problem was the workers. For the people who bought those cars, it meant faults to fix. For the workers, it meant no job, and a name that followed them. Blaming the workers hadn't fixed a single car. In 1984, General Motors and Toyota reopen the plant together, as NUMMI. More than eight in ten of its new workers are the same people, hired back. Groups of thirty fly to a Toyota plant in Japan, and work beside the people there for two weeks. Back in Fremont, they work in small teams, and a team leader steps in whenever something goes wrong. Anyone can pull a cord above the line to call for help. If the problem isn't fixed, the line stops. Within two years, its cars have about as few faults as those Toyota builds in Japan. Absence and complaints fall steeply. One study found the old way would need half as many workers again to build the same car. Managers had seen the absences. Workers had seen a line that never stopped, and nobody to help. Both were right about what they saw. The same people, in a different system, did some of the best work in the country. When someone's work falls behind, look first at what surrounds them. What they were taught, what's in their way, and what they're asked to do.

**Picture.** The plant from its car park, grey morning; the gate rolls shut on "closes". Inside, the hall, the line moving; four workers at their places and one place empty, outlined in amber on "five"; cars with parts missing; the cards come in as the voice names them, and leave before "change", said over the hall alone. The roof lights clean for 1984; the same people come back one by one. The map, an arc drawn from Fremont to Japan. The teams: a worker pulls the cord, the lamp lights, the team leader walks over, and the line stops. The results' cards. A manager and a worker, each with what they saw. Then the team room's empty desk, the three tags, which draw together into the title card in the wordless pause.

**On screen.** Fremont, California · 1982 · A General Motors car plant · Thousands of jobs lost · Its name · One of the worst plants in the country · One worker in five, not in · Complaints · In the thousands · Parts missing, or fitted wrong · Many said · The problem is the workers · For the buyers · Faults to fix · For the workers · No job · And a name that followed them · 1984 · NUMMI · General Motors and Toyota, together · More than 8 in 10: the same people · Fremont · A Toyota plant, Japan · Spring 1984 · Groups of 30 · Two weeks, working beside the people there · Small teams · A team leader steps in · Anyone can pull the cord · Not fixed? The line stops · Within two years · About as few faults as Toyota's in Japan · Absence and complaints · Fell steeply · One study · The old way: half as many workers again · Managers saw · The absences · Workers saw · A line that never stopped, and nobody to help · Both right about what they saw · The same people, a different system · What they were taught · What's in their way · What they're asked to do · When someone falls behind · Find the cause before you judge · Leading data people · Ownership and performance

### 2 · Behind the team · 2:11–3:08

**Narration.** At the university, a year from now, the data team moves its reports off the old warehouse. Each report is now written as code on the platform, and reviewed before anyone reads it. The team's days from a request to first use fall from 41 in February to 24 by June. Tomás Ortega, the report developer, built most of the old reports. He knows every one, and who reads it. His work speeds up too, but less, and unevenly: some weeks keep pace with the team, others go back for changes. Helena Novak, the data manager, first read the team as a whole, as The team comes first showed. Its shared work is going well. One person's is falling behind it. Before she judges, she asks.

**Picture.** Morning. The warehouse's drawers and the platform's sheet; reports move across, "Written as code, reviewed". The chart, the team's line falling from 41 to 24. Tomás and his sheet; his ten weeks, each marked as keeping pace or going back. Helena and her sheet; the green and amber pills; "Before she judges, she asks".

**On screen.** The university, 2027 · imagined · The old warehouse · The platform · Written as code, reviewed · Days from a request to first use · Report developer · Tomás Ortega · Built most of the old reports · Knows every one, and who reads it · Tomás's weeks, April to June · Faster too, but less, and unevenly · Kept pace with the team · Went back for changes · The data manager · Helena Novak · Read the team as a whole first, in The team comes first · The team's shared work: going well · One person's: falling behind it · Before she judges, she asks

### 3 · Find the cause · 3:08–4:46

**Narration.** Two old books give her the questions. Robert Mager and Peter Pipe asked: could they do it if they had to? If not, it's a skill. If they could, something is in the way. Thomas Gilbert said: look at what surrounds the work, its information, its tools and its rewards, before you look at the person. In his one-to-one on Wednesday 26 May, Helena asks Tomás what's getting in his way. The first cause is training. The tools changed, and nobody taught them. The others learned by doing, while Tomás kept the old reports running. So he pairs with Jun twice a week, and his Thursday learning time is protected. He'd been giving it up to clear his list. The second is fit for the role. His strength is the people who read the reports, more than the code behind them. So the readers' release notes and their training become his, while he keeps building. In June, he tells Helena he's having a hard time at home. Nobody needs to know more. That's a good reason too, and it asks for patience. For two months his load is lighter, and nobody asks for more. At NUMMI, pulling the cord brought help, not blame. Helena's part is the same: clear what's in the way. Amy Edmondson calls it psychological safety: people say what's wrong when it's safe to.

**Picture.** The bare room, then the two books' cards, each line as the voice says it. The one-to-one room in late light: Tomás and Helena at a table, "What's getting in your way?". The three causes' cards, one by one, each with its green pills as a blocker is cleared; the third card says only "At home, from June · Nobody needs to know more". The NUMMI hall, the cord pulled, "Help, not blame". Edmondson's card.

**On screen.** Robert Mager and Peter Pipe, 1970 · Could they do it if they had to? · No: it's a skill to learn · Yes: something is in the way · Thomas Gilbert, 1978 · First, what surrounds the work · Its information · Its tools · Its rewards · Then the person · Wednesday 26 May · Tomás's one-to-one · What's getting in your way? · One · Training · The tools changed; nobody taught them · Pairing with Jun, twice a week · Thursday learning time, kept · Two · Fit for the role · His strength: the reports' readers · Their notes and training: his · Three · A hard time · At home, from June · Nobody needs to know more · Two months, a lighter load · Help, not blame · Helena's part: clear what's in the way · Amy Edmondson · Psychological safety · People say what's wrong when it's safe to

### 4 · Against the team's own change · 4:46–5:36

**Narration.** How far behind is he? Not behind Helena's expectations: behind the team. In February, before the move, Tomás took 40 days from a request to first use. The team took 41. By June, the new tools had brought the team to 24. Tomás was at 35. He had improved. The team had improved faster, because the tools lifted everyone. So his gap is read against the team's own change, never against a colleague, and it stays between him and Helena. Tomás writes his own plan: what he'll learn, by when, and what he needs. Helena agrees it. They read it together on the first Wednesday of each month.

**Picture.** Late afternoon. The chart: "Not against her expectations" gives way to "Against the team's own change"; February's two points, then both lines drawn to June, the gap between them lit in amber; "He improved: 40 to 35", "The team: 41 to 24"; "Between him and Helena". The bare room, then Tomás's plan in blue, line by line as the voice names each part, "Agreed with Helena", and the first Wednesdays coming in one by one.

**On screen.** Days from a request to first use · Not against her expectations · Against the team's own change · A gap of 11 days · He improved: 40 to 35 · The team: 41 to 24 · Between him and Helena · Tomás's plan · Written by him · Write and review reports as code, by September · Release notes and training for the readers, from July · Pair with Jun, Tuesdays and Fridays · What he needs: his Thursdays kept clear · Agreed with Helena · Read together · Jul 7 · Aug 4 · Sep 1 · Oct 6 · Nov 3 · Dec 1

### 5 · Give it time · 5:36–6:23

**Narration.** The gains come unevenly. September goes well. In October, a report goes back twice. By December, the team is at 14 days, and Tomás at 20. The gap has closed by about half. On Wednesday 15 December, Helena says it plainly: the plan goes on into 2028. And if building reports stops being where he's strongest, they'll talk about a role that fits him better. He hears it now, not later. Lifting someone's work can take months, or even years. Patience is part of the plan. Through all of it, his measures are his own, and his reasons stay private.

**Picture.** The chart drawn on through the autumn: September ringed in green, October in amber as his line goes back up; December's gap lit, "The gap: 11 days to 6". A December evening, the lamp lit: Tomás and Helena at the table, the blue card. The bare room, then a line drawn from 2027 into 2028, dashed on; "Months, or years"; the two tags of privacy.

**On screen.** September: went well · October: a report back twice · The gap: 11 days to 6 · Wednesday 15 December · The plan goes on into 2028 · If a role fits him better, they'll talk about it · Said now, not later · 2027 · 2028 · Months, or years · His measures: his own · His reasons: private

### 6 · On Monday · 6:23–7:18

**Narration.** At NUMMI, the people didn't change first. What surrounded them did, and then their work did. Helena did the same: she found the causes, cleared what she could, and gave it time. On Monday, read the team's shared work before anyone's own. Ask before you judge, and look for the cause: training, fit, or a hard time. Clear the blockers first, and measure against the team's change, not your expectations. Let them write the plan, read it each month, and say honestly where it's going. Growing people, the next film, follows the everyday case: goals, feedback, and a next step. Find the cause, clear the way, and give it time.

**Picture.** The NUMMI hall, the line moving, the five workers; "The same people", "What surrounded them changed". Helena in the team room, three pills. The four steps, one sheet each. "Next: Growing people". The three pills of the last line; they leave, and the end card.

**On screen.** The same people · What surrounded them changed · Found the causes · Cleared what she could · Gave it time · One · Read the team's shared work first · Two · Ask, and look for the cause · Three · Clear blockers; measure against the team · Four · Their plan, read monthly, said honestly · Next: Growing people · Find the cause · Clear the way · Give it time · When someone falls behind · Film 3 of 4 · Ownership and performance

## Sound

**The palette, its own** (chosen by this film's thread on 10 November 2026, since the film was added to the module that day and no lead was reserved for it; the module's `palettes.md`): **a lute-harpsichord** (Lautenwerck), a harpsichord strung with gut instead of wire, so its quills pluck a soft, round, lute-like tone from a keyboard: one instrument, set up for what it does best, the film's "fit for the role". Its partner is the same instrument's **buff stop**, a felt strip pressed against the strings, so each note is short and muted. Made in `source/tools/score.py`: each note a quill plucking a gut string near its end, warm in the low and middle partials, little above 2 kHz. It sits between two colours the site has (the lute and the harpsichord), so it is kept round and low (gut, never wire; nothing above 2.3 kHz), and flagged for the author in the assumptions.

- **The mark: a phrase that stumbles, then steadies.** E G♯ B C♯ B G♯ A B E. In the opening, when the cars leave the line with parts missing, one note comes late and one is played twice; within two years it's steadier; by December steadier still; at the close it runs smooth an octave higher, with its last note held as E major into the end card. Lifting someone's work comes unevenly.
- **Keys, all tuned pure** (just intonation from E): E major; C♯ minor for the plant closing and the problem; G♯ minor for the blame and the one-to-one's start; A major for the plant reopening, each blocker cleared and "months, or years"; B major for the arc to Japan and the first Wednesdays. F♯ minor is never played. Nothing Japanese for Toyota; no car horn, engine or factory hooter.
- **After the opening,** music only at a chapter's turn, under a moment on screen, or in a pause without words: A major as the team's line falls; a short figure that keeps pace, then catches on one note, for Tomás's weeks; a note of E major's chord as each blocker is cleared; the buff stop's low C♯ alone for the hard time, and a rest; A major for the cord; the mark steadier at December; a single B for "now, not later". No chapter is urgent.
- **Effects, each tied to something on screen, one at a time, soft and below about 2.4 kHz:** the gate rolled shut; the line far off as one soft texture; the cord, the lamp's click, the team leader's steps and the line halting; a card laid down; a tap for a pill; a slide for the reports moving; a pen for the plan; a tick. Each uses the same word and offset as its picture in `src/fb_scenes.js`, and pans to where it's drawn.
- **Levels, measured by `tools/quiet.py` on 10 November 2026:** after the opening, the music sounds 16% of the time, comes in 24 times, once every 12.8 seconds, at most 4 times in any 30 seconds; its loud moments at -30.8 dB, its loudest notes at -28.0 dB, the effects' loud moments at -47.0 dB; 80 effects, at most 4 beginning in one second; the room rings within 3 dB of level from 100 Hz to 1.5 kHz; 33 held notes, which the room moves by -0.4 to +0.2 dB; mixed to -16 LUFS.

## Pause and think

The film can stop at the end of three chapters, with one question each (`site/assets/when-someone-falls-behind/think.en.js` and `think.es.js`). The right answers are in three different places.

| After | Question | Answer |
|---|---|---|
| Find the cause | Tomás's work falls behind the team's. Before judging, what does Helena look for first? | What surrounded Tomás's work: what he'd been taught, what was in his way, and what he was asked to do. The near miss asks him to work harder on his own; the film's causes were things he couldn't fix alone. |
| Against the team's own change | From February to June, Tomás went from 40 days to 35, and the team from 41 to 24. How is his gap read? | Against the team's own change, since the tools lifted everyone, and kept between him and Helena. The near miss compares him with the fastest colleague; the film says never against a colleague. |
| Give it time | By December the gap has closed by about half, and the gains still come unevenly. What does Helena tell Tomás? | That the plan goes on into 2028, and that if building reports stops being his strength they'll talk about a role that fits him better. The near miss says the plan can stop now; the film says it goes on. |

## Labs (candidates)

The module's labs come later, as one set. Two candidates from this film:

1. **Find the cause.** Three short cases of work falling behind: for each, ask Mager and Pipe's question and Gilbert's, and choose what to clear first.
2. **Read the gap.** A team's monthly delivery and one person's: draw both, and read the person's gap against the team's change, not a fixed target.

## Rigour to check before recording

Checked on 10 November 2026; the sources are listed below.

- **Fremont, 1982.** General Motors' Fremont Assembly ran from 1962 and closed in 1982, with thousands laid off (Wikipedia, *NUMMI*; *This American Life*, 403). "One of the worst in the country", "one worker in five didn't come in" and grievances "by the thousands": *This American Life*, 403, and John Shook (2010). "Parts missing, or fitted wrong": the same sources' accounts of the cars that left the line.
- **NUMMI.** New United Motor Manufacturing, Inc., the joint venture of General Motors and Toyota, founded in 1984, first car built in December 1984; more than 85% of its first workers had been laid off from the Fremont plant ("more than eight in ten"). The film doesn't say whether the old managers came back, which the sources don't settle.
- **Japan.** Groups of about thirty went from spring 1984 to a Toyota plant in Japan for about two weeks, working beside Toyota's workers (*This American Life*, 403; Shook, 2010). The film says "a Toyota plant in Japan", and the screen "Spring 1984 · Groups of 30".
- **Teams and the cord.** Teams of four or five with a team leader; the andon cord: a pull calls the team leader, and if the problem isn't fixed in time, the line stops (Shook, 2010; *This American Life*, 403). The film doesn't name the andon or the Toyota Production System, to keep to the idea.
- **Results.** Quality equal to Toyota's Japanese plants by defects per hundred cars, within its first years (*This American Life* says within three months; the film says "within two years", which every source covers). Absence and grievances "plummeted", with no number given, so the film gives none. "Half as many workers again": the MIT International Motor Vehicle Program's comparison (John Krafcik, 1988) found NUMMI built a car with far fewer hours than GM's plants; the film says "one study" and the figure as reported (*This American Life*, 403), not the hours.
- **Blameless.** Managers saw the absences; workers saw a line that never stopped and nobody to help: both are the sources' own accounts, and the film says both were right about what they saw.
- **The university's numbers.** The module's `numbers.md`: the team's days from ask to first use, 41 in February 2027, 24 in June, 14 in December (the measures page, *Measure the work, not the people*). Tomás's own (40, 35, 20, with September better and October back) are this film's, added to `numbers.md`; his line never appears beside a named colleague. Wednesday 26 May 2027 and Wednesday 15 December 2027 are Wednesdays; the first Wednesdays from July to December 2027 are the 7th, 4th, 1st, 6th, 3rd and 1st. The gap: 11 days in June, 6 in December, about half.
- **The references.** Mager and Pipe, 1970, their first question; Gilbert, 1978, the behaviour engineering model, environment before the person; Edmondson, 1999, psychological safety. Each named once, with its year on screen.
- **Words for the voice and the screen.** `film.json` *say*: NUMMI as "New-me", Tomás as "Toh-mahss", Jun as "Joon", Mager as "Mayger". Years and dates said in words through each line's `say`. No product is named and no release status is shown or said (the author's rule of 5 November 2026).
- **Titles, as the module names them.** *The team comes first* (film 9) and *Growing people* (film 13), as the module's briefs name them; "Film 3 of 4" as the renumbering of 10 November 2026 places this film.

**Sources (read 10 November 2026).** *This American Life*, show 403, "NUMMI" (26 March 2010): https://www.thisamericanlife.org/403/nummi · Wikipedia, *NUMMI*: https://en.wikipedia.org/wiki/NUMMI · John Shook, "How to change a culture: lessons from NUMMI", *MIT Sloan Management Review*, Winter 2010: https://sloanreview.mit.edu/article/how-to-change-a-culture-lessons-from-nummi/ · John F. Krafcik, "Triumph of the lean production system", *Sloan Management Review*, Fall 1988 · Robert F. Mager and Peter Pipe, *Analyzing Performance Problems, or You Really Oughta Wanna* (1970) · Thomas F. Gilbert, *Human Competence: Engineering Worthy Performance* (1978) · Amy C. Edmondson, "Psychological safety and learning behavior in work teams", *Administrative Science Quarterly* 44(2), 1999.

## Pacing report

`python tools/pace.py`, 10 November 2026:

| Chapter | Duration | Words a minute | Voice | Longest quiet |
|---|---|---|---|---|
| Same people, another way | 130.6 s | 130 | 68% | 7.2 s (the title card) |
| Behind the team | 57.1 s | 132 | 73% | 2.0 s |
| Find the cause | 98.0 s | 139 | 73% | 2.2 s |
| Against the team's own change | 50.6 s | 128 | 72% | 2.2 s |
| Give it time | 47.1 s | 127 | 74% | 2.2 s |
| On Monday | 54.2 s | 122 | 63% | 6.8 s (the end card) |

Total 7:17.6, 953 words, 131 words a minute, the voice 70% of the time. Every sentence has at least 0.5 s after it, and no stop inside a chapter is 2.5 s or more.
