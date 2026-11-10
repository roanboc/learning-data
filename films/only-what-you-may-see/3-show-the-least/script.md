# Only what you may see · Show the least: script

*The script of* Show the least*, film 12 of 22 of* Data protection and privacy *and film 3 of 8 of* Only what you may see*, in English, in the module's Night glass look (variant GA, "Frosted glass, solid colour"). Written on 5 November 2026 from the module's briefs (`/mnt/project-files/data-protection/briefs.md`, film 12), overnight, on the assumptions in this folder's `assumptions.md`, as Rodrigo asked at 11:53 UTC. An ideas film: it names no product, no cloud and no tool. It follows the four-beat rule for every opening (AGENTS.md, *Story and world*). Every claim is checked against its source (`research.md` here; *Rigour*, *Sources*). The university, its people and its numbers are the module's invented ones (`numbers.md`). Built on 5 and 10 November 2026: the narration lives in `source/src/narration.js`, the pauses in `source/src/breath.js`, the pictures in `source/src/sl_past.js`, `sl_cards.js` and `scenes.js`, and the sound in `source/tools/score.py`; the times below are the built ones, and where this page and those files differ, the source wins.*

## The promise

Every line passes two tests: someone who has never thought about hiding data can follow it, and a privacy officer and a data engineer each find nothing wrong in it. The series has an agreement that says, in plain words, what Anil Kurian's study may have (*An agreement first*), and a class on every column (*Know what you hold*). This film answers the question the last one left: which way to hide each class. There are nine ways, and three questions tell them apart: what does the reader see, can it be undone and by whom, and what can they still work out. Some ways can't be undone (leave a column out, mask it whole or in part, generalise it, publish only totals with small counts hidden); some can, but only by whoever holds a key or a vault (a keyed hash, a token, encryption), and those keep the data personal; and filtering rows hides no value at all, only other people's rows. Hidden isn't anonymous: a year of birth can still single out one learner in a small course, and a hidden small count can come back from the totals beside it. So the owner of the data picks, column by column, the way that keeps what the question needs and hides the rest. **Show the least that still answers the question.**

## The story in one paragraph

Victoria, 1856: until then a man said his vote out loud, so his employer, his landlord or a candidate could learn it, and a vote against them could cost a worker his job or a tenant his home. That March the colony passed a secret ballot, worked out by Henry Chapman: an official marks the voter off the roll and hands him a printed paper with every candidate's name; alone, he crosses out the names he doesn't want, folds it and puts it in the box; at the end, only the totals are announced. The roll says who voted and nothing about how; the box says how and nothing about who. Today, at the university, Anil Kurian studies how learners in the Faculty of Health progress. The learners' records, as kept, would show him names, birthdays, and which of his own faculty's learners have a disability; hide it all, and the study can't follow anyone from one year to the next. So Mei Tanaka, who owns the records, picks a way to hide each column: the student number becomes a keyed code that only the registrar's office can trace back, names and emails read as stars, the date of birth becomes a year, exam support is left out, the study gets only the faculty's rows, and only totals leave, with small counts hidden and one more beside them. The study follows 2,614 learners, year by year, and never sees who they are.

## Opening story

Each beat of the opening, said outright in the narration (AGENTS.md, *Story and world*), and where the film comes back to it.

| Beat | The line that says it |
|---|---|
| Scenario | "Victoria, 1856: the colony is about to elect its first parliament." |
| Problem | "Until then, a man said his vote out loud, so anyone could learn it: his employer, his landlord, a candidate." "A vote against them could cost a worker his job, or a tenant his home." "So a man might not dare vote as he wished. Something had to change." |
| Solution | "That March, the colony passed a secret ballot, worked out by Henry Chapman, one of its lawmakers." "An official marked the voter off the roll, and handed him a printed paper with every candidate's name." "Alone, he crossed out the names he didn't want, folded it, and put it in the box." "At the end, the papers were counted, and the totals announced." |
| Benefits | "Now a worker or a tenant could vote as he wished: nobody could see his vote, so nobody could punish him for it." "Britain took it up in 1872; by 1892, so had 38 American states." "The roll says who voted, and nothing about how. The box says how, and nothing about who." Then the same problem and benefit for data: "Their records, as kept, would show him far more: names, birthdays, and which of his own faculty's learners have a disability." "Hide it all, and the study can't follow anyone from one year to the next." "The study follows 2,614 learners, year by year, and never sees who they are." "And for data: show the least that still answers the question." |
| Back to the story | In *Ways that can be undone*: "In Britain's ballot of 1872, each paper had a number, matched to its voter only in a sealed packet, opened only to trace a fraud." In *Totals, small counts hidden*: "As in 1856: everyone sees the totals, and nobody sees a vote." In *Show the least*: "The roll, the box and the totals: each shows the least that still answers its question." And its benefit for data: "Samuel's row now answers the study's question, and says nothing about who he is." "Show the least that still answers the question." |

The test before recording: someone who has never heard of Victoria can answer, from the narration alone, "why was that a problem?" (a man's vote was heard by his employer, his landlord and the candidates, and a vote against them could cost a worker his job or a tenant his home, so men didn't dare vote as they wished; and for data, the records as kept would show a researcher which of his own faculty's learners have a disability) and "what did the fix give people?" (a vote nobody could see, so nobody could punish it, with every total still public; and for data, a study that follows 2,614 learners year by year and never sees who they are).

## Reference

The films' reference for hiding a value is the series' own table (`films/only-what-you-may-see/proposal.md`, *The ways to hide a value*). The film names no framework; it teaches the three questions they share. Where they come from, and where the film adopts, extends or differs:

| Body of knowledge | What it adds | The film |
|---|---|---|
| ISO/IEC 20889:2018, de-identification techniques | Sorts the techniques: suppression, generalisation, pseudonymisation, cryptographic tools, aggregation | Adopts the sorting, in plain names (`numbers.md`, *The ways to hide a value*) |
| Article 29 Working Party, Opinion 05/2014 on anonymisation | Judges each technique by three risks: singling out, linking, inferring; pseudonymisation isn't anonymisation | Adopts "hidden isn't anonymous": a year of birth that fits one learner is singling out. Doesn't teach linking and inferring by name |
| GDPR Article 4(5) and Recital 26; EDPB Guidelines 01/2025 on pseudonymisation | Data that can be attributed with information kept separately stays personal data | Adopts it as "a way that can be undone keeps the data personal" |
| ENISA, *Pseudonymisation techniques and best practices* (2019) | Counters, random numbers, hashes, keyed hashes, encryption; a plain hash of a known list falls to a dictionary attack | Adopts the plain scramble against the keyed hash; leaves out counters and random numbers (the token stands for them) |
| NIST SP 800-188 (2023) | De-identifying government data: suppression, generalisation, pseudonymisation, aggregation with small cells hidden | Adopts; one small-count rule (under 10), the module's |
| Statistical disclosure control (Cox 1980; US Census Bureau; Statistics Canada) | A hidden cell can be recovered from the totals beside it, so a second, complementary cell is hidden | Adopts, with the next smallest count |
| ISO/IEC 27002:2022, 8.11 *Data masking* | Masking as a control, by role and purpose | Adopts; the purpose comes from the agreement |
| The Five Safes | Safe projects, people, settings, data, outputs | *An agreement first* sets the project, people and setting; this film is safe data and safe outputs. Not named |

The practice behind it: a practitioner starts from the question and the agreement, not from the tool; hides at the column, the same way every time a class appears; keeps keys and vaults with the data's owner, apart from those who read the codes; and checks every published table for counts that can be worked out.

## What each object stands for

| Object | Stands for |
|---|---|
| The roll, 1856 (a ledger on the official's desk, a tick by a name) | Who: kept by the official, apart from the votes |
| The printed paper, names crossed out, folded | A value hidden from everyone but its owner |
| The box | Values with no names: how, nothing about who |
| The count board, chalk tallies under "Totals" | Published totals |
| The paper's number and its stub in a sealed packet, 1872 | A way back to the person that only the holder of the seal can open: the key |
| Samuel's row | One learner's record, column by column, as each reader sees it |
| Violet chips (`direct`, `special` and `pseudonymous` solid, `indirect` lighter, `none` an outline) | Each column's class, set by its owner (*Know what you hold*): the stricter, the stronger |
| Level pills of glass (`confidential`, `restricted` rimmed in violet, `public`) | Each table's level |
| The nine way tiles | The ways to hide a value, named exactly as `numbers.md` writes them |
| The three questions, numbered on a card | What the reader sees; can it be undone, and by whom; what the reader can still work out |
| Violet stars and codes | Hidden personal data |
| A coral, closed card | What a reader isn't given (the support table), or a match that leaks |
| The sealed key card | The keyed hash's key, never drawn, kept by the registrar's office |
| The vault, a sealed card | The token's vault, kept by the registrar's office; its pairs never drawn |
| Frost over a value | Encryption: all there, unreadable without the key |
| The agreement card, 2026-14 | What the study may have, in plain words (*An agreement first*) |
| The totals card, "fewer than 10", "hidden" | Published totals, small counts hidden, and one more beside them |
| The agent's sphere, its band in cyan | An agent helping the study, with the study's view (*AI agents in data work*) |

## The look

Night glass, variant GA (`films/locks-before-the-data/shared/`, the module's kit): a dark petrol hall of frosted glass panes, light along their edges, ice words, every word at least 28 px as seen and at least 4.5 to 1; nothing below y 890. Cyan is an identity (a person's or an agent's label, the roll's "who"); green allowed; coral denied or closed (the support table not given, a match that leaks, the sum that gives a count back); violet hidden personal data (stars, codes, "fewer than 10", "hidden") and the class chips, stronger for stricter; grey what needs no protection ("Everyone sees the totals"). Gold, the kit's chip on a genuine card, and amber (power switched on) aren't used. The way tiles are clear ice glass; the one in use is lit brighter, never coloured, so a tile never reads as allowed or denied. Frost has one meaning here, encryption; masked values are stars, as the example project's mask writes them (the style prototype's still f2 drew a masked name under frost; this film keeps frost for one meaning).

Three places, each painted once when the player asks for it, under 2 s:

1. **The polling room, 1856.** A timber room by lamplight at dusk, deep blue at the windows: the official's tall desk, its top of dark green cloth, with the roll, an inkstand and an oil lamp; the official standing behind it, the voter facing him, their eyes on one eye line; at the back, a rail where the public stands. Before the Act, three onlookers stand behind the rail. After it, a booth on the right, its curtain drawn across while the voter is in it, with a writing slope, ink and pen; and the box, dark wood with a slot, on a stand by the desk. Its later moment (`later:true`): the count, papers in piles, the box open, a board of chalk tallies. In the style of the prototype's town gate (`stills/GA_f4.jpg`): night, warm lamplight, with only a faint cool edge from the windows (`SL_LAMP`), since a rim of the hall's light read as an outline in a room with no glass.
2. **A table, 1872.** Close: a ballot paper turned over, its number on the back; the counterfoil left in the official's book; a packet tied and sealed. One shot, cut in and out.
3. **The university's glass hall.** Cards from the left (x 80 to 1880), people on the right (x 1390 to 1800). Mei and Anil from the kit's cast (`mei`, `anil`); the agent's sphere from the kit.

People: one three-quarter head, the kit's geometry and face table; arms down; a hand only on the story's object (`hold`): the printed paper, from the official's hand to the voter's, and into the box. 1850s men, no hats indoors, in the kit's shapes coloured for their time (`SL_CAST` in `source/src/sl_past.js`, the `sl_` prefix, never a change to the kit): the official clean-shaven, in a dark suit, white shirt and black tie; the voter, a worker, bearded, in a blue serge overshirt over a plain shirt; behind the rail, his employer, grey-bearded, in a brown suit, his landlord, with a moustache, in a grey coat, and a candidate in a dark suit. Side whiskers were drawn first and read as a grey patch, so the official is clean-shaven and the employer has the grey beard. Clothes clear of the meaning colours. No real person is drawn: Henry Chapman is a name on the Act's card. Each person reaches the frame's bottom edge or stands behind the desk or the rail. Every head was looked at full size, facing both ways, before the film used it.

Motion: in one room the camera glides (at least 1.4 s, sine ease) and only what changes fades; the onlookers leave as whole pictures before the booth and the box come in; the paper stays in one hand at a time, from the official's to the voter's, and slides from his fingers into the box; cuts only between rooms (1856 to the hall in chapter 1; the hall to 1872 and back in chapter 4; the hall to 1856 in chapter 5), and one dissolve, from 1856 to the hall into chapter 6, where the whole picture changes. Values change in their cells: the old fades as the new comes in, in the same place, never two at once readable. The place labels (a kicker and a title, top left) stay still on the screen while the camera glides under them, and the cards leave before the title and end cards come in, so no words sit under their veil.

## Script

Times are the built ones (`build/timeline.json`): 7:24.8 in all, 967 words, 130 words a minute, the voice 71% of the time (`tools/pace.py`).

### 1 · The roll and the box · 0:00–2:05

Key `ballot`. Music under the 1856 part (*Sound*).

| Line | Narration | Picture |
|---|---|---|
| `v1856` | Victoria, 1856: the colony is about to elect its first parliament. | The polling room at dusk. Kicker "OPENING STORY", title "Victoria, 1856", top left. The official standing behind his desk, the roll and a lamp on it; the voter facing him |
| `aloud` | Until then, a man said his vote out loud, so anyone could learn it: his employer, his landlord, a candidate. | Behind the rail, three onlookers come in, each with a cyan label: "his employer", "his landlord", "a candidate"; a coral slip, "His vote, out loud" |
| `cost` | A vote against them could cost a worker his job, or a tenant his home. | Two coral pills over the voter: "his job", "his home" |
| `dare` | So a man might not dare vote as he wished. Something had to change. | The voter's head lowers a little (a nod, 0.4 s). Hold |
| `passed` | That March, the colony passed a secret ballot, worked out by Henry Chapman, one of its lawmakers. | The onlookers leave, each faded whole; the pills go. A card: "March 1856 · A secret ballot · Worked out by Henry Chapman, one of the colony's lawmakers" |
| `roll` | An official marked the voter off the roll, and handed him a printed paper with every candidate's name. | The card leaves; the booth and the box come in. The official ticks the roll and hands the voter the printed paper: it stays in his hand until the voter's takes it (`hold`) |
| `alone` | Alone, he crossed out the names he didn't want, folded it, and put it in the box. | The voter steps into the booth and its curtain closes: three names struck through, one at a time, and the paper folded, heard, not seen; the curtain opens, and the folded paper slides from his fingers into the box |
| `count` | At the end, the papers were counted, and the totals announced. | Later moment (`later:true`): the men leave; papers in piles, the box open; a board, "Totals", four rows of chalk tallies (decoration) |
| `free` | Now a worker or a tenant could vote as he wished: nobody could see his vote, so nobody could punish him for it. | A green card: "Now · Free to vote as he wished · Nobody could see his vote, so nobody could punish him for it" |
| `spread` | Britain took it up in 1872; by 1892, so had 38 American states. | A card: "The Australian ballot · Britain, 1872 · 38 American states, by 1892" |
| `who` | The roll says who voted, and nothing about how. The box says how, and nothing about who. | Two cards, each with a line of light to what it names: "The roll · Who voted, nothing about how" (cyan) and "The box · How, nothing about who" (violet) |
| `today` | Today, at the university, Anil Kurian studies how learners in the Faculty of Health progress. | Cut to the glass hall. Anil on the right, facing left; kicker "TODAY", title "At the university"; his label "Anil Kurian"; a card, "A study · How learners in the Faculty of Health progress" |
| `kept` | Their records, as kept, would show him far more: names, birthdays, and which of his own faculty's learners have a disability. | A card, "Learner records, as kept": Student number, Name, Email, Date of birth, Course, Results; Samuel's row: S-20412 · Samuel Osei · samuel.osei@mail.example · 14 May 1987 · Public health · 90 of 120, the names and birthdays lit as they're said. Below, a second card, "Support table", `restricted`, one column, "Exam support", its values never drawn, lit at "disability" |
| `all` | Hide it all, and the study can't follow anyone from one year to the next. | Every value in Samuel's row turns to stars; a coral slip: "The study can't follow anyone" |
| `mei` | So Mei Tanaka, who owns the records, picks a way to hide each column that keeps what the study needs. | The stars clear back. Mei comes in beside Anil, facing left, her label "Mei Tanaka · owns the records" |
| `follows` | The study follows 2,614 learners, year by year, and never sees who they are. | A green slip, "2,614 learners, year by year"; on "never", the card becomes "What the study sees": a7772705… · *** · *** · 1987 · Public health · 90 of 120 (code and stars violet), and the support table closes, coral: "Not given to the study" |
| `data` | And for data: show the least that still answers the question. | The cards leave. Title card: "Show the least", "The ways to hide a value", "FILM 3 OF 8 · ONLY WHAT YOU MAY SEE" |

### 2 · Three questions · 2:05–2:45

Key `questions`. In the hall; the camera glides on.

| Line | Narration | Picture |
|---|---|---|
| `may` | The study's agreement says what it may have: each learner's course and results, their year of birth, and a code in place of who they are. | The agreement card, top left: "Data sharing agreement 2026-14", "For a study in the Faculty of Health"; one line lit: "May have · Each learner's course and results; their year of birth; a code in place of who they are". A line under it: "From the film An agreement first" |
| `never` | And never anything that names a learner, or anything about their health. | The line "Never · Anything that names a learner; anything about their health" lit |
| `class` | Each column already has the class its owner set: direct, indirect, special, or none. | The learner records card, a violet chip on each column: Student number, Name and Email `direct`; Date of birth `indirect`; Course and Results `none`; the card's level `confidential`. The support table: Exam support `special`, level `restricted`. A line: "Classes from the film Know what you hold" |
| `nine` | So which way should hide each one? There are nine, and three questions tell them apart. | The cards leave; nine tiles come in, in three rows across the top: Leave it out · Mask it whole · Mask it in part / Generalise · Keyed hash · Token / Encryption · Totals, small counts hidden · Filter rows |
| `see` | What does the reader see? | A card under the tiles, "Three questions": 1, "What does the reader see?" |
| `undo` | Can it be undone, and by whom? | 2, "Can it be undone, and by whom?" |
| `works` | And what can the reader still work out? | 3, "What can the reader still work out?" |

### 3 · Ways that can't be undone · 2:45–4:07

Key `oneway`. In the hall. Each way comes forward as its tile, its three answers under it, while its column changes in Samuel's row.

| Line | Narration | Picture |
|---|---|---|
| `health` | Exam support is about health, and the agreement says never. | Samuel's record and the support table, its `special` chip lit; the agreement's "Never" line beside them |
| `out` | So leave it out: the study isn't given the support table. | The support table closes, coral: "Not given to the study". A card, "A way to hide a value · Leave it out": Sees nothing · Undone no · Still works nothing on it |
| `names` | Names and emails name a learner: the registrar's office needs them, the study never does, so mask them whole. | Samuel's row; Name and Email lit |
| `stars` | The columns stay, but for the study every value reads as stars, and stars can't be turned back. | Name and Email turn to violet `***`. The card: "Mask it whole": Sees stars · Undone no · Still works counting rows |
| `desk` | The help desk needs a little more: to check it has the right learner on the phone. | A second card under the way's: "As the help desk sees it", Student number and Email |
| `part` | So mask them in part: the last two digits, and the first letter. | In it: S-***12 · s***@mail.example. The card: "Mask it in part": Sees a part · Undone no · Still works recognising a record |
| `enough` | Enough to recognise a record, too little to look anyone up. | Hold |
| `born` | The date of birth helps the study see how age shapes progress, so generalise it: 14 May 1987 becomes 1987. | Date of birth lit; "14 May 1987" becomes "1987". The card: "Generalise": Sees a year · Undone no · Still works trends by group |
| `gone` | The day and month are gone, and can't come back. | Hold |
| `anon` | But hidden isn't anonymous: in a small course, one year of birth may fit only one learner. | A small card: "A small course · year of birth": 1991 · 1987 · 1995 · 2001 · 1993; 1987 ringed in coral |
| `stays` | So it stays indirect, and stays behind the agreement. | The small card goes; the year's `indirect` chip lit |
| `rows` | Last, filter rows: the study gets only the Faculty of Health's 2,614 learners. | A card, "Learners · every faculty": six courses and their faculties; the three from other faculties leave, and it reads "Faculty of Health · 2,614 learners". The card: "Filter rows": Sees only your rows · Undone not needed · Still works everything, on your rows |
| `others` | That hides no value; it leaves out other people's rows. | Hold |

Pause and think: `oneway`.

### 4 · Ways that can be undone · 4:07–5:25

Key `undo`. In the hall; a cut to 1872 and back.

| Line | Narration | Picture |
|---|---|---|
| `follow` | The study must follow each learner from year to year, so the student number becomes a code. | Samuel's record; Student number lit |
| `plain` | The learner code you've seen before scrambles the number, and scrambled isn't anonymous: with the registrar's list, anyone can match it. | Beside the record, "The registrar's list, scrambled": S-20410 5440b46d… · S-20411 459c5ea5… · S-20412 e69dec44… · S-20413 dfed4e0e… · S-20414 4a088fa6…; the student number becomes e69dec44…, and a coral line joins it to S-20412's row |
| `keyed` | So the study's code mixes in a secret key: a keyed hash. | A sealed card comes in, "The study's key · Kept sealed by the registrar's office"; e69dec44… becomes a7772705… |
| `nothing` | Without the key, the list matches nothing. | A slip: "The list matches nothing" |
| `with` | With it, the registrar's office can find whose code it is: undone, but only with the key, kept sealed, apart from the study. | A dashed violet line from the sealed key to the code. The card: "Keyed hash": Sees a stable code · Undone only with the key · Still works joins and counts per person |
| `still` | So the code stays pseudonymous, behind the agreement. | The column's chip turns from `direct` to `pseudonymous`; its name becomes "Learner code" |
| `n1872` | In Britain's ballot of 1872, each paper had a number, matched to its voter only in a sealed packet, opened only to trace a fraud. | Cut to the 1872 table: kicker "Britain, 1872", title "A number on each paper"; a paper turned over, "No. 1209" on its back; the counterfoil in the book with the same number; the counterfoils tied in a packet and sealed; a violet slip, "Opened only to trace a fraud". Cut back to the hall |
| `token` | A token is a stand-in, paired with the real value in a vault: only the vault's owner can turn it back, to reach the person again. | The Email column: *** becomes TKN-0381 (violet); a sealed card, "The vault · Kept by the registrar's office". The card: "Token": Sees a token · Undone yes, by the vault's owner · Still works joins; the real value on request |
| `noone` | This study reaches no one, so it takes the keyed hash. | TKN-0381 turns back to ***; the vault goes; the card turns back to "Keyed hash" |
| `lock` | And encryption keeps the whole value where it's stored or moved: unreadable without the key, all there for anyone allowed to read it. | A card, "Stored, encrypted": Samuel Osei under violet frost, clearing for "An allowed reader" (green), then frosted again. The card: "Encryption": Sees unreadable text · Undone yes, with the key · Still works nothing, until it's opened |

Pause and think: `undo`.

### 5 · Totals, small counts hidden · 5:25–6:17

Key `totals`. In the hall; a cut to 1856 at the end.

| Line | Narration | Picture |
|---|---|---|
| `publish` | When the study is done, it may publish totals, with any count under 10 hidden. | The agreement's line "May leave · Totals, with any count under 10 hidden" lit |
| `left` | Here, learners who left after their first year, by course. | A card, level chip `public`: "Left after first year · by course": Nursing 38 · Midwifery 4 · Public health 21 · Health sciences 17 · Faculty of Health 80 |
| `small` | Midwifery's 4 is a small count: in a class that size, people would know who left. | Midwifery's row lit |
| `fewer` | So it reads: fewer than 10. | 4 becomes "fewer than 10" (violet). The card: "Totals, small counts hidden": Sees totals · Undone no · Still works totals |
| `back` | But the faculty's total is there too: 80, less 38, 21 and 17, gives the 4 back. | The rows lit, and a coral slip under the card: "80 − 38 − 21 − 17 = 4" |
| `more` | So one more count is hidden, and the 4 can't be worked out. | 17 becomes "hidden" (violet); the coral line fades |
| `answer` | Totals can't be undone, and they still answer the question: about 9 in 10 first-year learners went on to second year. | A card: "The answer · About 9 in 10 first-year learners went on to second year" |
| `vote` | As in 1856: everyone sees the totals, and nobody sees a vote. | Cut to the polling room's later moment: kicker "Victoria, 1856", title "The count"; the board of tallies and the box; two labels: "Everyone sees the totals" (grey, to the board) and "Nobody sees a vote" (violet, to the box) |

Pause and think: `totals`.

### 6 · Show the least · 6:17–7:25

Key `least`. A cut back to the hall.

| Line | Narration | Picture |
|---|---|---|
| `each` | So for each line of the agreement, Mei picks the way that keeps what the study needs. | The agreement card, all four lines: May have, Never, From, May leave; Mei on the right, facing left |
| `code` | A code in place of who they are: a keyed hash. | A tile, "Keyed hash", joined by a line of light to "May have" |
| `year` | Their year of birth: generalise. | "Generalise", joined to "May have" |
| `nonames` | Nothing that names a learner: mask it whole. | "Mask it whole", joined to "Never" |
| `nohealth` | Nothing about their health: leave it out. | "Leave it out", joined to "Never" |
| `faculty` | Only its 2,614 learners: filter rows. And only totals leave, with small counts hidden. | "Filter rows", joined to "From"; then "Totals, small counts hidden", joined to "May leave" |
| `newclass` | Each new column gets its class from her: the code pseudonymous, the year still indirect. | The study's row, "What the study sees": Learner code `pseudonymous` and Year of birth `indirect` lit |
| `build` | Later films build these ways on the platform, so each class is hidden the same way, every time. | A card: "Later in this series · One policy for many tables · Each class hidden the same way, every time" |
| `agent` | And an agent helping the study sees what the study sees, never more. | Anil, and the agent's sphere beside him, its label "Sees what the study sees"; a line: "More in AI agents in data work" |
| `least` | The roll, the box and the totals: each shows the least that still answers its question. | The agent leaves. Three panes, each a picture of 1856: "The roll: who", "The box: how", "The totals" |
| `samuel` | Samuel's row now answers the study's question, and says nothing about who he is. | The panes go. Two slips beside the study's row: "Answers the study's question" (green), "Says nothing about who he is" (violet) |
| `end` | Show the least that still answers the question. | The row and its slips leave. End card: "Show the least that still answers the question.", the module's mark, "Show the least", "Film 3 of 8 · Only what you may see · Learning Data" |

## Sound

A new palette (`/mnt/project-files/data-protection/palettes.md`, reserved 5 November 2026: no score on main or any branch, and no palettes list, has either instrument).

- **Lead: a keyed bugle**, the brass bugle with keys over its tone holes that bands played in the first half of the 1800s: soft, one voice, no vibrato, mellow (a conical bore, few high partials, under 2.5 kHz). The public count: each total a short plain phrase.
- **Partner: a baryton**, the bowed bass of the 1700s with wire strings hidden in its neck that ring unbowed behind the played ones: low, soft, its hidden strings a faint shimmer after each note. Only where a hidden value can be brought back: the sealed key, the 1872 packet, the vault.

Music under the opening story (the 1856 part): the bugle alone, a few short phrases, each one different, in B flat major, tuned pure so no chord beats: rising to F on election eve; one low D as the last onlooker is named; E flat falling to D under what a vote could cost; C rising to F, left open, at "Something had to change"; F, B flat, D as the Act passes; A rising to B flat as the paper goes into the box, the tune home; a plain phrase at the count; D, F, B flat under "free to vote"; G falling to F for Britain and America; F then D, the roll then the box. At the cut to the hall, one held B flat, then silence under the voice; D falling to B flat under the title. After that, only now and then: a short bugle phrase at each chapter's turn, each one different (C, D, F; E flat, D, B flat; D, E flat, D; B flat, D; G, F, D); the baryton under the study's sealed key (B flat), the 1872 packet (low F, as the seal is pressed) and the vault (D), never under the voice for more than a held note; F, A, B flat under the answer, about 9 in 10; the opening's rising tune, on to the octave, at the cut back to the count (`vote`); and on the end card, the bugle's B flat, F, B flat over the baryton's low B flat, its hidden strings ringing on. No pulse: nothing in the film is urgent. `tools/quiet.py` passes: after the opening, music sounds 8% of the time and comes in 10 times; its loud moments sit at -29.4 dB, its loudest notes at -27.3 dB; the room moves a held note by at most 0.1 dB.

Effects, each tied to something on screen, one at a time, soft, under 2.5 kHz: the official's pen ticking the roll; the paper handed over; behind the curtain, three pen strokes, spaced, and the fold; the curtain drawn and drawn back (a breath of air); the paper dropping into the box (a soft wooden knock); chalk on the board (one soft texture, not a burst); a soft tap as each way's card comes forward and where a column changes (never one per character); the nine tiles as one soft breath; the support table closing (a dull glass knock); the seal pressed (a soft thump); the frost forming and clearing. 85 effects, at most 3 in any second, the loudest at -46.1 dB. Held notes at even levels, the room's echo set by what it rings where the notes are (`_band`, `_held`); mixed to -16 LUFS (the soundtrack measures -16.4); no louder than the governance films.

## Pause and think

Three questions, one at the end of chapters 3, 4 and 5, as written in `site/assets/show-the-least/think.en.js` and `think.es.js` (where this page and those files differ, the files win). One right answer (`ok:true`) and one near miss (`near:true`) each, options of like length, the right answers in three different places.

**`oneway`** · "A year of birth can't be turned back into a date. Why does it still count as indirect?"
1. "Because whoever keeps the key can turn 1987 back into 14 May 1987." (`near:true`: generalising has no key; the day and month are gone)
2. "Because in a small course, one year of birth may fit only one learner." (`ok:true`)
3. "Because the agreement names it, and every column it names is indirect."

Why: "Generalising can't be undone: the day and month are gone. But hidden isn't anonymous. Beside the course, a year of birth can still single out one learner in a small class, and anyone who knows them knows the row. So it keeps its class, indirect, and stays behind the agreement. Which columns in your data say nothing alone, but point to one person together?"

**`undo`** · "The study's learner code is a keyed hash. Why is its data still personal?"
1. "Because the registrar's office, which keeps the key, can still find whose code it is." (`ok:true`)
2. "Because anyone with the registrar's list can scramble the numbers and match the codes." (`near:true`: that's the plain scramble; without the key, the list matches nothing)
3. "Because the code changes every year, so a learner's codes can be lined up year by year."

Why: "A keyed hash can be undone, but only with the key: the registrar's office can make the code again from any student number and see whose it is. Without the key, the registrar's list matches nothing, which is why the study gets the keyed code and not the plain scramble. A way that can be undone keeps the data personal, so the study stays behind its agreement. Where in your data is a code one key away from a name?"

**`totals`** · "Midwifery's 4 reads "fewer than 10". Why is Health sciences' 17 hidden too?"
1. "Because hiding it protects the 17 learners in Health sciences who left." (`near:true`: 17 isn't a small count; it's hidden for Midwifery's sake)
2. "Because Health sciences is the largest course, so its count goes first."
3. "Because the faculty's 80, less the other counts, would give the 4 back." (`ok:true`)

Why: "A count under 10 is hidden so that no one can tell who left a small class. But the faculty's total is published too: 80, less 38, 21 and 17, gives the 4 back. Hiding one more count, the next smallest, leaves two unknowns that add up to 21, so the 4 can't be worked out. Where your data publishes totals, could a hidden count come back from the rest?"

In Spanish (the same places):

**`oneway`** · "Un año de nacimiento no puede volver a ser una fecha. ¿Por qué sigue siendo indirecta?"
1. "Porque quien guarda la clave puede volver a convertir 1987 en 14 de mayo de 1987." (`near:true`)
2. "Porque en un curso pequeño, un año de nacimiento puede ser de un solo estudiante." (`ok:true`)
3. "Porque el acuerdo la nombra, y cada columna que nombra es indirecta."

Por qué: "Generalizar no se puede deshacer: el día y el mes desaparecen. Pero oculto no es anónimo. Junto al curso, un año de nacimiento todavía puede señalar a un solo estudiante en una clase pequeña, y quien lo conoce reconoce la fila. Por eso conserva su clase, indirecta, y sigue detrás del acuerdo. ¿Qué columnas de tus datos no dicen nada solas, pero juntas señalan a una persona?"

**`undo`** · "El código del estudio es un hash con clave. ¿Por qué sus datos siguen siendo personales?"
1. "Porque la oficina de registro, que guarda la clave, todavía puede saber de quién es cada código." (`ok:true`)
2. "Porque cualquiera con la lista de registro puede codificar los números y emparejar los códigos." (`near:true`)
3. "Porque el código cambia cada año, así que los códigos de un estudiante se alinean año por año."

Por qué: "Un hash con clave se puede deshacer, pero solo con la clave: la oficina de registro puede volver a calcular el código desde cualquier número de estudiante y ver de quién es. Sin la clave, la lista de registro no empareja nada; por eso el estudio recibe el código con clave y no el codificado sin clave. Una forma que se puede deshacer mantiene los datos como personales, así que el estudio sigue detrás de su acuerdo. ¿Dónde está, en tus datos, un código a una clave de distancia de un nombre?"

**`totals`** · "El 4 de Partería dice "menos de 10". ¿Por qué también se oculta el 17 de Ciencias de la salud?"
1. "Porque ocultarlo protege a los 17 estudiantes de Ciencias de la salud que se fueron." (`near:true`)
2. "Porque Ciencias de la salud es el curso más grande, así que su cifra va primero."
3. "Porque el 80 de la facultad, menos las otras cifras, devolvería el 4." (`ok:true`)

Por qué: "Una cifra menor que 10 se oculta para que nadie sepa quién dejó una clase pequeña. Pero el total de la facultad también se publica: 80, menos 38, 21 y 17, devuelve el 4. Ocultar una cifra más, la siguiente más pequeña, deja dos incógnitas que suman 21, así que el 4 no se puede calcular. Donde tus datos publican totales, ¿podría volver una cifra oculta a partir del resto?"

(The Spanish captions and page keep the video's English on-screen words, such as the course names and the class values; the Spanish captions say "Partería" and "Ciencias de la salud" where the narration names them. Checked against the film's names, numbers and colours when built.)

## What the example project has

The example dbt project (`films/analytics-engineering/project/`) is where the tools films build these ways; this film only uses its data and its words.

- Samuel Osei: `data/student_system/learners.csv`, line 19 (`S-20412`, `samuel.osei@mail.example`, award `MPH`); his six results of 15 credit points, `results.csv`, lines 38 to 43; the Master of Public Health, 120 points, Faculty of Health, `awards.csv`, line 9.
- The mask the project already sets writes `***` (`macros/governance/personal_data.sql`, line 24), for every column classed `direct`, by policy (lines 69 to 81): *Mask it whole*.
- The learner code is a plain scramble, the sha-256 of `SIS|S-20412` (`macros/shared/keys.sql`): `e69dec44…`; *Governed in Unity Catalog* shows why scrambled isn't anonymous.
- Not in the project yet: a keyed hash, the date of birth and year of birth, the support table, a token's vault, and a small-count rule. *Tags that travel* and *One policy for many tables* build them; *Copies that keep the rules* uses the small-count rule in a clean room's notebook.

## Labs (candidates, for the module's set)

1. **A way for each column.** The learner records, three readers (the registrar's office, the help desk, a study with an agreement): pick a way for each column and reader, say whether it can be undone and by whom, and check each pick against the agreement's lines.
2. **Scrambled or keyed.** A list of five student numbers and five plain codes: match them. Then five keyed codes: show why the list matches nothing, and who could still match them.
3. **The count that comes back.** A published table with one count under 10 and a total: work out the hidden count, then choose the one more count to hide.

## Rigour to check before recording

- **Open voting before 1856.** "Said his vote out loud": MoAD, on the 1843 elections of New South Wales, which then took in the Port Phillip District, later Victoria ("had them say who they voted for out loud"). "His employer, his landlord, a candidate": MoAD on landowners and candidates; the Australian Constitution Centre's lesson on employers, landlords and customers (summary only); the State Library Victoria blog on "coercion and corruption". "Cost a worker his job, or a tenant his home": MoAD ("evict people from their land if they didn't vote for them"); Sawer on employers intimidating workers (summary only). The film gives no Victorian case or number.
- **The Act.** Passed by the Legislative Council on 13 March 1856 by one vote, assent 19 March: "That March, the colony passed a secret ballot." Chapman "devised a system for how the secret ballot would work" (MoAD); Nicholson moved the principle (Wikipedia), and isn't named. No "first" is claimed (Tasmania's law of 7 February 1856; France 1795).
- **The procedure.** Roll, printed paper with every candidate's name, another room, crossing out, folding, the box, totals at the end: MoAD and Wikipedia, as quoted in `research.md`. The film doesn't say the box was locked, the papers numbered, or who watched the count.
- **"The colony is about to elect its first parliament."** The election of 23 September to 24 October 1856 elected the first Parliament of Victoria (Wikipedia); the Act passed in March. Voting needed property then; manhood suffrage came in 1857; only men voted (women won the vote for Victoria's parliament in 1908), so the narration says "a man".
- **The spread.** Britain's Ballot Act, 1872 (MoAD); "By the 1892 elections, citizens in 38 states voted by secret ballot" (Smithsonian, 1998); "the Australian ballot" (Wikipedia; Centre of Democracy).
- **1872's numbered papers.** Paper and counterfoil numbered, the voter's register number on the counterfoil, sealed, opened only by order to trace a fraud: Encyclopaedia Britannica 1911 and Hansard (1889, 1951), seen through search summaries; read the 1872 Act's schedule before recording.
- **The agreement.** Every line on its card is `numbers.md`'s, word for word (*An agreement first*).
- **Classes and levels.** `numbers.md` (*Know what you hold*): name, email and student number `direct`; date of birth `indirect`; exam support `special` in the support table, `restricted`; course and results `none`; the learner table `confidential`; published totals `public`; the learner code `pseudonymous`, the year of birth still `indirect`, each class given by the owner.
- **The ways.** Names, as written in `numbers.md`; answers from the series' table, with the help desk's "the last two digits" (a student number has five).
- **Hidden isn't anonymous.** Singling out (Article 29 Working Party, Opinion 05/2014).
- **Pseudonymised data stays personal.** GDPR Article 4(5) and Recital 26; EDPB Guidelines 01/2025.
- **Plain scramble against keyed hash.** The plain code is the project's (sha-256 of `SIS|S-20412`, `e69dec44…`), matched by hashing the list (a dictionary attack, ENISA 2019). The keyed code (HMAC-SHA-256 of `S-20412`, key drawn for the film and thrown away, `a7772705…`) can't be matched without the key; with it, the owner recomputes the code from any number, which is what "undone, only with the key" means: a keyed hash isn't decrypted, it's made again and matched.
- **Encryption.** *Walls, doors and keys* (`numbers.md`): data encrypted in storage and on the move, with the university's own key. Whoever is allowed to read reads every value: encryption protects where data is kept or moved, and never shows a reader less.
- **Totals.** Courses and counts invented (`numbers.md`); 80 − 38 − 21 − 17 = 4; with 17 hidden, Midwifery and Health sciences add up to 21, in many ways. "About 9 in 10" went on (the films' figure).
- **Nothing on screen is a real key or token.** The key is a sealed card; `TKN-0381` is a made-up stand-in in the films' style.
- **No release status** is shown or said; no product is named.

## Sources, checked 5 November 2026

In `research.md`, with quotes: MoAD, *What is the secret ballot?*; Wikipedia, *Electoral Act 1856* (28 March 2026) and *1856 Victorian colonial election* (19 July 2026); Founding Documents, item 20; State Library Victoria, *There's more to the roll, part 1* (2021); Smithsonian Magazine, *The Vote That Failed* (1998); Centre of Democracy (South Australia); Hansard, 1889 and 1951; Encyclopaedia Britannica 1911, *Ballot*; ISO/IEC 20889:2018; Article 29 Working Party, Opinion 05/2014; GDPR; EDPB Guidelines 01/2025; ENISA (2019); NIST SP 800-188 (2023); ISO/IEC 27002:2022; Cox (1980), Massell (2002), Dandekar (2005); the Five Safes.
