# Data that moves · Hot, warm, cold: script

*The script of *Hot, warm, cold*, film 2 of 4 of *Data that moves*, the first series of the module *Modern data basics*, in six chapters, in English, drawn in the module's look. First made on 5 November 2026 around the seed vault, as one film about data temperature for both freshness and storage. On 11 November 2026 the author reviewed it ("the seed vault story shows the temperature of storage, not of ingestion"; temperature depends on when people act, not on what the platform can do; hot costs more and needs the cold path anyway; most analytics are fine cold; validate on real use, not on a question; real time is for when no human analyses and the action must be immediate; explain why minutes are needed and why other options aren't possible), and the film was split in two: this one is freshness, set by when someone acts on the data, with a new opening; storage, how often data is read and how long it's kept, became film 4, *Read often, kept close*, which keeps the seed vault. The narration lives in `source/src/narration.js` and the pauses in `source/src/breath.js`; this page and those files say the same thing, and where they differ, the source wins. Made to read on a phone: on-screen words at least 28 px in the frame, nothing under the captions, and no caption over two lines.*

## The promise

Every line passes two tests: someone who has never run a data platform can follow it, and a data architect or a data engineer finds nothing wrong in it. *Moving is easy, agreeing is the work* showed the ways data moves between applications. This film asks how fresh each kind of data must be, and answers it with one question: when does someone act on it? Not whether people would like it fresher (asked, they always say yes), but what they do next, seen in real use. Cold is acted on days or weeks later, and moves as a batch, once a night or once a week; warm is acted on within minutes or hours, and moves in small batches; hot is acted on within a second or less, usually by a machine, and moves event by event. The platform should offer all three; which one each kind of data gets is the business's call. Hot costs the most, because it never stops, and never comes alone: an event carries only what changed, so the full record still comes on the cold path. Most analysis should stay cold. The film defines the three words for the module; where data is kept, and for how long, is film 4's question.

**Takeaway:** "How fresh data must be is set by when someone acts on it, not by what the platform can do."

## The story in one paragraph

In April 1850, in Aachen, on Prussia's western border, Paul Julius Reuter sells the news of Europe's stock exchanges. A telegraph line runs from Berlin to Aachen, another from Paris to Brussels, and between Aachen and Brussels lie 122 kilometres with no wire. Bankers and merchants buy and sell on the prices from other cities' exchanges, and act the same day; across the gap the prices go by train, and arrive hours after the day's trading has begun, when someone with fresher news has already made the deal. Reuter's clients don't need the prices at once; they need them before they act. So Reuter and Heinrich Geller, an innkeeper in Aachen who bred pigeons, fly the prices across the gap on thin slips of paper, and the telegraph sends them on to Berlin. The birds cross in about two hours, six hours ahead of the train, so the prices arrive while there's still time to use them; and only for a while, until the wire is joined. Fresh enough means there in time for whoever acts on it. At the university, until September 2026, almost all data moved once a night, and asked, everyone wanted theirs live. Some came too late: 23 tutors were paid two weeks late, and two people's pay went to a thief. In September, Noor, the data architect, asks one question of each kind of data, when does someone act on it, and looks at real use for the answer. What each faculty has spent is cold: Finance asked for it live, but spending is talked over once a month, so a view works it out each night at two, a dbt model Jun wrote. Contracts are warm: coordinators approve claims until noon on Monday, so changes HR makes that morning must reach the claims app in time; ideally contracts and claims would live in one system, and the new ERP will bring them together in 2028, so until then the platform fills the gap, as the pigeons did: the HR system pushes each change through Zerobus Ingest, and a pipeline brings them in every five minutes. A bank account change is hot: in August someone stole two passwords and changed two people's bank accounts the night before pay day, and no report read the next morning could have stopped it; now a rule checks each change against the sign-in behind it and holds that one pay within a second; four were held since September, one rightly. But an event carries only what changed, so the nightly file still brings the full record: hot never comes alone, and it costs the most. In 1851 the wire closed the gap, and Reuter took his news service to London. Today 2,960 people are paid, 856 of them casual staff, Linh among them.

## Opening story

Each beat of the opening, said outright in the narration (AGENTS.md, *Story and world*), and where the film comes back to it.

| Beat | The line that says it |
|---|---|
| Scenario | "April 1850. In Aachen, on Prussia's western border, Paul Julius Reuter sells the news of Europe's stock exchanges." "A telegraph line runs from Berlin to Aachen. Another runs from Paris to Brussels." "Between Aachen and Brussels, 122 kilometres with no wire." "Bankers and merchants buy and sell on the prices from other cities' exchanges, and they act the same day." |
| Problem | "Across the gap, the prices went by train, and arrived hours after the day's trading had begun." "A price that comes after you've had to decide is no use to you: someone else, with fresher news, has made the deal." "Reuter's clients didn't need the prices at once. They needed them before they acted, so the news had to cross the gap faster." |
| Solution | "So Reuter and Heinrich Geller, an innkeeper in Aachen who bred pigeons, flew the prices across the gap." "Each bird carried a thin slip of paper, from Brussels to Aachen, and the telegraph sent it on to Berlin." |
| Benefits | "The birds crossed in about two hours, six hours ahead of the train, so the prices arrived while there was still time to use them." "Fresh enough means there in time for whoever acts on it." Then the same for data: "Some came too late: 23 tutors were paid two weeks late, and two people's pay went to a thief." "Now each kind of data arrives in time for the action it serves, and no sooner than it's needed." |
| Back to the story | In *Warm*: "Until then, the platform fills the gap, as the pigeons did." And at the end, with its benefit for data: "In 1851, the wire closed the gap, and the pigeons were no longer needed." "At the university, each kind of data now arrives in time for the people, or the machine, that act on it." |

Someone who has never heard of Reuter can answer, from the narration alone, "why was that a problem?" (the prices came by train, after traders had to decide, so they were no use: someone with fresher news had made the deal) and "what did the fix give people?" (the prices arrived about two hours after they left, six hours ahead of the train, while there was still time to act on them).

## The reference, and practice

The module's reference is DAMA-DMBOK as the map and the data engineering lifecycle of *Fundamentals of Data Engineering* as the spine (`films/data-that-moves/proposal.md`). This film sits in the lifecycle's *ingestion* stage, and in DAMA-DMBOK's *data integration and interoperability*. No single standard names data temperature; the film names none of the bodies of knowledge, and teaches what they share.

| Body of knowledge | What it adds | Where the film uses it |
|---|---|---|
| Reis and Housley, *Fundamentals of Data Engineering* (2022), *Ingestion* | Batch and streaming as a choice made from what the use needs, not from what's possible; streaming's cost and complexity, and the advice to ask what the business gains from data fresher than a batch | *When someone acts*: the question, and the three speeds (not named) |
| Kleppmann, *Designing Data-Intensive Applications* (2017), *Stream processing* | Events as the change only; a stream beside a batch that brings the full record and corrects it | *Hot*: "an event carries only what changed"; the cold path beside it |
| DAMA-DMBOK2 (2017), *Data integration and interoperability* | Latency as a requirement each interface agrees: batch, near real time, real time | *When someone acts*: written into the data's contract |
| The Open Data Contract Standard (Bitol), *Service-Level Agreement* | `latency` and `frequency`, each with a driver | The example's `service_levels.yaml` |
| Databricks' docs (read 11 November 2026): Zerobus Ingest, materialized views, triggered and continuous pipelines, real-time mode in Structured Streaming | A view on a schedule; a pipeline run every few minutes or always; real-time mode for operational work such as fraud detection, which needs dedicated compute, while analytical work suits micro-batches | *Cold*, *Warm*, *Hot* |

**Where the film adopts, extends or differs.** It adopts what the references share: choose batch or stream from the use, and keep streaming for what needs it. It differs in where it starts: from one question, when does someone act on the data, answered from real use rather than from asking, because the business always says it would like data fresher. It defines warm as minutes to hours (small batches), not as a stream, so hot means a second or less, for a machine.

**Practice, from the author (review of 11 November 2026, in his words as relayed):** temperature depends on the business need, on when people actually act on the data, not on what the platform can do, and the platform should enable every temperature. A hot path is generally more expensive, because a cold path is always needed anyway to get the full data, and very few use cases can rely on hot paths alone. Most analytics are fine with cold paths, daily or even weekly. The business always says it wants fresher data if asked, so validate on real use, not on a question. Real time is legitimate when no human does the analysis and the action must be immediate. Explain why data is needed within minutes, and why the other options aren't possible: ideally contracts and claims would sit in one system, such as an ERP, and the platform fills the gaps until it arrives; organisations always run a mix of legacy and modern systems, and that's part of the job.

## What the example project has

`examples/hot-warm-cold/` in the example project (`films/analytics-engineering/project/`), for Databricks only and not run by CI:

- **Cold,** `spending_by_faculty.sql` and `.yml`: Jun's dbt model, a materialized view of what each faculty has spent against its budget, from the finance system's ledger read in place, each night at 02:00, Sydney time.
- **Warm,** `contracts_as_they_stand.sql`: the pipeline that applies the changes the HR system pushes (Zerobus Ingest) to a streaming table of every contract as it stands, triggered every five minutes, with why it runs through the platform until the ERP of 2028.
- **Hot,** `bank_change_hold.py`: the rule, in Structured Streaming's real-time mode, that joins each bank account change to the sign-in behind it and holds one pay through payroll's interface; the nightly file stays the record.
- **The answers,** `service_levels.yaml`: each kind of data's latency and frequency, and its temperature (hot: milliseconds to a few seconds; warm: minutes to hours; cold: days and longer).

## The look

The module's look, *the platform map drawn up close*, from the module's kit in `films/data-that-moves/shared/`, used as it is. The opening is drawn in the same night: a map of 1850 as dots of light (its land from the GLOBE project's elevation data, credited in `NOTICE.md`), telegraph lines on their poles, a train, and pigeons seen from above, drawn with tapering wings. No flags, no logos, no faces from photographs. The three speeds take none of the module's colours: cold, warm and hot are said in words and shown by how often data arrives (a clock once a night, a few beats an hour, a light for each event).

## Script

### 1 · The pigeon post

**Picture.** A map of 1850 in the night, its land as dots of light: Berlin, Aachen, Brussels and Paris. Two telegraph lines draw themselves, Berlin to Aachen and Paris to Brussels, poles about every 70 px, and the gap between Aachen and Brussels stays dark, "122 km · no wire". The camera glides in on the gap. Traders' cards: "act the same day". A train crawls across the gap, "hours after trading began". Cards for Geller's pigeons and the thin slip of paper; a flock, seen from above, arcs across the gap, and the slip goes on down the wire to Berlin. A card, "ACROSS THE GAP": pigeons about 2 hours, train about 8. "until the wire was joined". Then the university's map: three rows, each a kind of data from where it's born to who acts on it, all once a night, "Until September"; two pills, "23 tutors paid two weeks late" and "two people's pay to a thief"; then each row in time for its action. The title: "Hot, warm, cold", "in time for whoever acts on it", FILM 2 OF 4.

**Narration.**

- April 1850. In Aachen, on Prussia's western border, Paul Julius Reuter sells the news of Europe's stock exchanges.
- A telegraph line runs from Berlin to Aachen. Another runs from Paris to Brussels.
- Between Aachen and Brussels, 122 kilometres with no wire.
- Bankers and merchants buy and sell on the prices from other cities' exchanges, and they act the same day.
- Across the gap, the prices went by train, and arrived hours after the day's trading had begun.
- A price that comes after you've had to decide is no use to you: someone else, with fresher news, has made the deal.
- Reuter's clients didn't need the prices at once. They needed them before they acted, so the news had to cross the gap faster.
- So Reuter and Heinrich Geller, an innkeeper in Aachen who bred pigeons, flew the prices across the gap.
- Each bird carried a thin slip of paper, from Brussels to Aachen, and the telegraph sent it on to Berlin.
- The birds crossed in about two hours, six hours ahead of the train, so the prices arrived while there was still time to use them.
- And it was only for a while: the pigeons filled the gap until the wire was joined.
- Fresh enough means there in time for whoever acts on it.
- Until September, the university moved almost all its data once a night. And asked, everyone wanted theirs live.
- Some came too late: 23 tutors were paid two weeks late, and two people's pay went to a thief.
- Now each kind of data arrives in time for the action it serves, and no sooner than it's needed.

### 2 · When someone acts

**Picture.** Noor, the data architect, at the left, her name tag beside her. Her one question on a card, "When does someone act on it?"; a faint "Would you like it fresher?" answered "always yes", set aside for real use: when people open the data, and what they do next. Three bands come in, cold, warm and hot, each with how soon someone acts and how it moves. "The business's call, not the platform's", and the data's contract, how fresh and the action it's fresh for.

**Narration.**

- In September, Noor, the data architect, asked one question of each kind of data: when does someone act on it?
- Ask people if they'd like their data fresher, and they'll always say yes.
- So Noor didn't take the answer from a question. She looked at real use: when people open the data, and what they do next.
- Acted on days or weeks later: cold. A batch, once a night or once a week.
- Acted on within minutes or hours: warm. Small batches, every few minutes or every hour.
- Acted on within a second or less, usually by a machine: hot. Each event, the moment it happens.
- The platform should offer all three. Which one each kind of data gets is the business's call, not the platform's.
- Each answer goes into the data's contract: how fresh, and the action it's fresh for.

### 3 · Cold

**Picture.** Rohan, in Finance, and four bars, Arts, Business, Engineering and Health, each against a dashed budget mark, with no figures. "Asked in August: live, to the minute"; then what happens next, "talked over once a month". The view "spending_by_faculty", each night at 02:00, ready by 07:00; dbt's window, Jun's model, tested. "Most analysis: cold".

**Narration.**

- Each morning, Rohan, in Finance, and the faculties' managers look at what each faculty has spent this year against its budget.
- Asked in August, Finance wanted it live, to the minute.
- Noor looked at what happens next: spending is talked over once a month, and only then does money move between budgets.
- Yesterday's figures are fresh enough. A view works them out each night at two, ready to read by seven.
- It's a dbt model Jun wrote, with its schedule, tested like any other.
- Most analysis is like this, and should stay cold: people decide over days and weeks, and a nightly run costs a small part of a stream.

### 4 · Warm

**Picture.** The claims app's Monday morning, claims approved by noon, paid Thursday. The HR system, its own system, and the week as a timeline: a change in HR on Monday morning, claims close at noon, the night's load, Tuesday. "23 tutors · two weeks late". Why through the platform: one system for contracts and claims, the new ERP in 2028; until then, the platform fills the gap, "as the pigeons did"; old systems beside new ones. Zerobus Ingest pushes each change; a pipeline every five minutes into "contracts". This Monday: eleven changes, every claim approved by noon. "Five minutes: in time, and far cheaper than a pipeline that never stops".

**Narration.**

- Casual staff claim their hours in the claims app, and claims approved by noon on Monday are paid on Thursday.
- The app checks each claim against the tutor's contract, which lives in another system: HR's.
- Ingrid's team in HR often changes a contract on a Monday morning, while coordinators approve claims until noon.
- Until September, the platform brought those changes across once a night, so the app saw them on Tuesday.
- Too late for noon: that's how 23 tutors came to wait two more weeks for their pay.
- Why through the platform at all? Ideally, contracts and claims would live in one system, and the new ERP will bring them together, in 2028.
- Until then, the platform fills the gap, as the pigeons did.
- Every organisation runs old systems beside new ones, so the ideal path is rare. Working around the gaps is part of the job.
- Now the HR system pushes each change as it's made, through Zerobus Ingest.
- Every five minutes, a pipeline brings the changes into a table of every contract as it stands.
- This Monday, eleven contracts changed in the morning, and every claim against them was approved by noon.
- Five minutes is fresh enough for a person who approves claims all morning, and it costs far less than a pipeline that never stops.

### 5 · Hot

**Picture.** "No person waiting to decide · the action comes at once, or it's useless". August: two passwords stolen, bank accounts changed the night before pay day, pay to a stranger's account, three weeks to be paid again; the next morning's report, too late. Now the payroll system's bank account changes and the sign-in service's sign-ins meet in a rule, on each event; "new device · close to pay day" holds that one pay and asks the person, "within a second". "4 held · three were the people · one was not". An event carries only what changed; the nightly file brings the full record and every correction: "never alone: the cold path beside it", "the costliest, because it never stops". "Very few needs: keep hot for a machine that must act now".

**Narration.**

- Hot is for when no person is waiting to decide, and the action must come at once, or it's useless.
- In August, someone stole two staff members' passwords, and changed their bank accounts the night before pay day.
- Their pay went to a stranger's account, and they waited three weeks to be paid again.
- No report read the next morning could have stopped it: by then, the money had gone.
- Now each bank account change is checked the moment it's made, against the sign-in behind it.
- If it comes from a new device close to pay day, a rule holds that one pay within a second, and asks the person to confirm.
- Since September, four changes were held. Three were the people themselves, confirmed within the hour; one was not.
- But an event carries only what changed. The full record, and every correction, still comes in the nightly file.
- So hot never comes alone: it needs the cold path beside it, and it costs the most, because it never stops.
- Very few needs are like this. Keep hot for a machine that must act now.

### 6 · In time to act

**Picture.** The map of 1851: the wire joins Aachen and Brussels, and the flock is gone; London. The university's three rows again, each in time: spending each night, contracts every five minutes until the ERP, a bank account change within a second. A card, "Paid today · 2,960 people · 856 of them casual staff, Linh among them". The takeaway card; "Where data is kept, and for how long: a later film"; the docs card, with four verbs; Next; the end card.

**Narration.**

- In 1851, the wire closed the gap, and the pigeons were no longer needed.
- Reuter took his news service to London, and from there to the world.
- At the university, each kind of data now arrives in time for the people, or the machine, that act on it.
- Spending, each night; contracts, every five minutes, until the ERP comes; a bank account change, within a second.
- Today, 2,960 people are paid, 856 of them casual staff, Linh among them.
- How fresh data must be is set by when someone acts on it, not by what the platform can do.
- Where data is kept, and for how long, is another question, for a later film.
- Start from the official docs, then investigate, adapt, implement, iterate.
- Next: one copy of the claims, for the app and for Finance.


## Sound

A new palette, recorded in the module's `palettes.md` (11 November 2026): a serinette, the small bird organ of the 18th century, whose pinned barrel opens tiny pipes one after another, so a tune arrives note by note, each on its moment; and the merline, the larger bird organ, an octave lower, with a few stopped pipes for the ground. D major for data in time, B minor for the problem; the mark, D, F sharp, A, lands as something arrives in time (the birds, the title, each speed's data, the end card). Music under the opening, then only at a turn or a moment on screen; effects soft, one at a time, below about 2.5 kHz; no birdsong, post horn or train whistle. `source/tools/score.py`; `tools/quiet.py` passes.

## Pacing report

`tools/pace.py`: 7:59, 1,060 words, 133 words a minute (pigeons 134, act 136, cold 135, warm 133, hot 137, close 121), the voice 74% of the time, no sentence with under 0.5 s after it.

## Pause and think

| After | Question | Answer |
|---|---|---|
| Cold | Asked in August, Finance wanted spending live, to the minute. Why does a view worked out each night serve them better? | Money moves between budgets once a month, so yesterday's figures arrive in time, for far less. |
| Warm | Contract changes now come in every five minutes. Why not bring each one in within a second? | Coordinators approve claims all morning, so five minutes is in time, and costs far less. |
| Hot | A rule now holds a pay within a second of a suspicious bank account change. Why does the nightly file still come in? | An event carries only what changed; the full record and every correction come in the file. |

## Rigour

| Claim | Source | Checked |
|---|---|---|
| Reuter in Aachen in 1850, selling stock exchange news; the telegraph from Berlin reached Aachen, and Paris's reached Brussels, leaving a gap | *How they brought the good news* and *Enter Heinrich Geller, stage right*, The Baron (Reuters' alumni history, thebaron.info); History of Information, *Reuter uses carrier pigeons* (historyofinformation.com) | 11 Nov 2026 |
| 122 kilometres between Aachen and Brussels | The distance between the two cities, as the crow flies, rounded | 11 Nov 2026 |
| Reuter's agreement with Heinrich Geller, pigeon breeder and innkeeper in Aachen, on 24 April 1850, for trained birds between Brussels and Aachen | *Enter Heinrich Geller, stage right*, The Baron (accounts give 40 or 45 birds; the film gives no number) | 11 Nov 2026 |
| The birds crossed in about two hours, six hours ahead of the train | History of Information (pigeons "within two hours, beating the railroad by six hours"); one other account gives a longer rail route; the film follows the first and shows the train at about 8 hours | 11 Nov 2026 |
| The service lasted about a year, until the gap in the telegraph was closed (1851); Reuter went to London in 1851 | The Baron; *Paul Julius Reuter born in Germany*, History Today | 11 Nov 2026 |
| The university's numbers: 23 tutors paid two weeks late, two people's pay to a thief, eleven contracts changed this Monday, four changes held, 2,960 paid, 856 casual | The module's shared numbers (`/mnt/project-files/modern-data-basics/numbers.md`), invented composites | 11 Nov 2026 |
| Real-time mode: a Structured Streaming trigger for operational work that needs sub-second response, such as fraud detection; dedicated compute; micro-batch for analytical work; Kafka-compatible sources such as Event Hubs, not Delta; stream-to-stream inner joins on Databricks Runtime 18 LTS and above | Azure Databricks docs, *Real-time mode concepts*, *Set up real-time mode*, *Real-time mode reference* (learn.microsoft.com). The pages showed no release label on 11 Nov 2026; never said in the film | 11 Nov 2026 |
| A pipeline can run triggered, on a schedule, or continuously | Azure Databricks docs, *Triggered vs. continuous pipeline mode* | 11 Nov 2026 |
| Zerobus Ingest writes each change a system pushes straight into a Delta table | Azure Databricks docs, *Zerobus Ingest* (some of its SDKs carry a release label on 11 Nov 2026; never said in the film) | 11 Nov 2026 |
| Materialized views on a schedule, as a dbt model | Azure Databricks docs, *Materialized views*; dbt docs, *Databricks configurations* | 11 Nov 2026 |
