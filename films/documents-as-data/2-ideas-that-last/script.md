# Documents and closing remarks · Ideas that last, features you test: script

*The script of *Ideas that last, features you test*, the second and last film of *Documents and closing remarks*, the last series of the module *Modern data basics*, in five chapters, in English, drawn in the module's look. Written on 11 November 2026, on the author's request of that day: split *Files as data and as context*, and make another film with the module's recap, why the films don't go deep on each tool, the official resources, a word for those not on Databricks, and the loop to test new features in more detail, so the other films can stay with what changes slowly; and call the series something like "documents and remarks". Written on stated assumptions, listed in [docs/assumptions](../../../docs/assumptions/02-modern-data-basics/4-documents-as-data/2-ideas-that-last.md). It follows the rule of 28 October 2026 for every opening (scenario, problem, solution and benefits, each said outright, and the film comes back to the story).*

## The promise

Every line passes two tests: someone who has only watched the module's films can follow it, and a data engineer who keeps a platform running finds nothing wrong in it. The module showed ideas with Databricks and dbt; this film says what those ideas were, why the films don't teach each button (the tools change every month, and their makers keep the how up to date), that the ideas hold on any platform, and how a team keeps up without chasing every release: a short loop, investigate, adapt, implement, iterate, started from a real need and tried small, on its own data, for a set time.

## The story in one paragraph

Mexico, 1944. In the Yaqui Valley of Sonora, farmers hardly grow wheat any more: stem rust, a fungus that chokes the plant, can ruin a whole field at once, and one field that year is expected to give only ten bushels an acre. A ruined field means a year's work and seed lost, and Mexico buys wheat from abroad; breeding a wheat that resists the rust is slow, one generation a year, many years before it reaches a farm. From 1945 a wheat program of Mexico's Ministry of Agriculture, with the plant breeder Norman Borlaug, grows two generations a year, one in summer in the highlands near Mexico City and one in winter in Sonora, crossing, testing in the field, keeping the few that do best and sowing those in the other place. Many breeders say a wheat should be bred only where it will grow; the team tries it anyway, and measures. It cuts the time to breed a new wheat in half, the new wheats grow well in both places and far beyond, and by 1956 Mexico grows all the wheat it needs; in the program's first twenty years its harvest triples. And the testing never stops, because the rust keeps changing. Data platforms change too, every month: what lasts is the ideas, and a quick, honest way to test what's new. The film recaps the module's four series, each idea older than the tools that showed it; says why the films stay light and where the how lives; and follows a loop at the university: Rohan Desai's team in Finance asks in a ticket for a better way than typing invoices by hand; Jun Park reads the official docs; tries the functions in a sandbox for two days on 200 of September's invoices (188 match, and most of the 12 that don't are poor scans); builds one use case in the data project with its tests and a way back, reviewed by the data team, checked by Finance, and only then is the ticket closed; and each month the team looks at what went to a person, and why. One trial, letting the model pick each invoice's cost centre, ends in no after two days: Finance's supplier list already gives it. The close comes back to the field: the wheats of the 1950s are long gone, the method is still used today. Keep the ideas, and test the features.

## Opening story

| Beat | The line that says it |
|---|---|
| Scenario | "Mexico, 1944. In the Yaqui Valley of Sonora, in the north, farmers hardly grew wheat any more." "Stem rust, a fungus that chokes the plant, could ruin a whole field of wheat at once." |
| Problem | "One field there that year was expected to give only ten bushels an acre: a poor harvest for a season's work." "For a farmer, a ruined field meant a year's work and seed lost, and Mexico bought wheat from abroad for its bread." "And breeding a wheat that resisted the rust was slow: one generation a year, and many years before it reached a farm." "Farmers couldn't wait a decade for every new wheat." |
| Solution | "From 1945, a wheat program of Mexico's Ministry of Agriculture, with the plant breeder Norman Borlaug, tried another way." "They grew two generations a year: one in summer, in the highlands near Mexico City, and one in winter, in Sonora, far to the north." "Each season, they crossed plants, tested them in the field, kept the few that did best, and sowed those in the other place." |
| Benefits | "It cut the time to breed a new wheat in half, and the new wheats grew well in both places, and far beyond." "By 1956, Mexico grew all the wheat it needed. In the program's first twenty years, its harvest tripled." Then the same for data: "Data platforms change too, every month. What lasts is the ideas, and a quick, honest way to test what's new." |
| Back to the story | In *Test what's new*: "It's the breeders' two seasons again: the shorter the loop, the more you learn in the same time." And at the end, with its benefit for data: "The wheats of the 1950s are long gone from the fields. The method, two places and two seasons, is still used by wheat breeders today." "So keep the ideas, and test the features: small, soon, and on a real need." |

## The reference, and practice

| Body of knowledge | What it adds | Where the film uses it |
|---|---|---|
| The author's practice (his request, 11 November 2026, and the module's brief) | The films stay light on purpose; the official docs and training for the how; check your own platform's capabilities if it isn't Databricks; a loop to test new features and iterate quickly | *Why the films stay light*; *Test what's new* |
| The module's rules (its plan and *Decided* rows, 5 November 2026) | At the level of architecture; tools show, they don't lead; every film ends on the official docs: investigate, adapt, implement, iterate | Every chapter |
| Build, measure, learn (Eric Ries, *The Lean Startup*, 2011) and plan, do, check, act (Deming) | Small experiments with a stated question and a set time, whose result decides the next step, including "no" | *Test what's new*: the sandbox, two days, the dropped trial |
| Timeboxed spikes (agile practice) | A fixed, short time to answer one question before committing to build | *Adapt*: two days, 200 invoices |
| The data project's own path (*Data as software*) | A change goes in through the data project, with its tests, reviewed by the data team, with a way back | *Implement* |

**Where the film adopts, extends or differs.** It keeps the module's four words for the loop (investigate, adapt, implement, iterate), already said at the end of every film, and explains each with one case. It differs from build-measure-learn in starting from a need someone has written down (a ticket), never from the feature, and in making "no" an ordinary result. A trial runs on the team's own data in a sandbox; what goes to production goes through the data project, reviewed by the data team, as every film in *Data as software* shows; owners are told what it touches and check its results (Finance checks October's), and never review the code.

**Practice, from the author.** "where we state why we don't go in deep on these matters, recommend the official resources, indicate that even if you're not using Databricks just check your platform capabilities, and explain in more detail the loop to test new technology features and iterate quickly. The rest of the videos focus on the things that change less frequently." A practitioner will recognise the trial: a feature read about in the release notes, a ticket from the business that it might answer, two days on a sample checked against what people typed, and a trial dropped because a table the business already keeps gives the answer.

## What each object stands for

| Object | Stands for |
|---|---|
| A wheat field at dusk in Sonora, "Sonora, Mexico, 1944", "The Yaqui Valley", "Hardly any wheat grown" | The place, and the problem's start |
| Rust spreading through the stalks from the right, the stalks bowing; "Stem rust · a fungus", "It chokes the plant" | The harm to the plant |
| "One field, 1944 · Expected: 10 bushels an acre · A poor harvest for a season's work" | The harm in a number |
| "A year's work, lost", "The seed, lost", "Wheat bought from abroad" | The harm for the farmer and the country |
| "One generation a year", ten stalks counted, "Years, one harvest each", "Many years to reach a farm" | Why a cure was slow |
| A plant breeder and a young agronomist among the stalks, arms down; "From 1945 · Mexico's wheat program · Its Ministry of Agriculture" | Who tried another way |
| The map of Mexico, the highlands near Mexico City in summer and Sonora in winter, the seed carried between them | Two places, two generations a year |
| "Each season": fourteen plots, crossed, tested, the best two ringed in green; "Sown in the other place" | The loop of the breeders' work |
| "Many breeders said · Breed a wheat only where it will grow", "Tried anyway, and measured" | A belief tested, not argued |
| "Years to breed a new wheat": the bar halves | The benefit: half the time |
| "By 1956 · All the wheat Mexico needed", "The harvest, first twenty years", "× 3" | The benefit for the country |
| "The rust kept changing", "So the testing never stopped" | Why the loop kept going |
| The university's night map, tags "New feature", "New name", "New limit" coming and going, then "The ideas" and "A quick, honest test" | The same for data |
| Four series cards, each with its ideas; "Each idea is older than the tools that showed it" | The module's recap |
| "What changes fast", tags falling past; "Every button, filmed · Out of date within months"; "What changes slowly", four ideas | Why the films stay light |
| Databricks and dbt, "Documentation · training", "Kept up to date by the people who build it" | Where the how lives |
| The four ideas linked to "Microsoft Fabric" and "Your own platform · What does it offer?", "Most have an answer, under another name" | For those not on Databricks |
| "Because it's new" and "Because a film showed it", struck out; "Because it answers a real need" | How to choose |
| The loop's ring, its four steps lit in turn, and Jun at the right | The loop, run by the data team |
| "In the same time": one long loop, three short ones, "More learned" | The breeders' two seasons, again |
| "A ticket · Finance · Invoices typed by hand", "A real need, not a feature"; "Read first · The official docs", what they do, cost, and where they stop | Investigate |
| "A sandbox · two days", 200 squares, 188 turning green and 12 amber, "12 didn't: most were poor scans" | Adapt |
| "One use case · In the data project", "Its tests", "A way back"; "Reviewed by the data team", "Finance checked October's results", "The ticket closed" | Implement |
| "Each month · What went to a person, and why", four reasons as bars | Iterate |
| "Tried · The model picks each invoice's cost centre", "The supplier list already gives it", "Dropped"; "Two days, not a year" | A trial that ends in no |
| The field again, at harvest; "The wheats of the 1950s · Long gone from the fields", "The method · Two places, two seasons" | The close: the method lasts |
| "Keep the ideas", "Test the features", "Small · soon · on a real need" | The film's rule |
| The module's four series, each once a team of people, now one, with Databricks and dbt; "Agreeing what the data means" | What the tools took on, and what's left for people |
| "Start from · The official docs", and the loop, "Keep going" | Where to go next |

## The look

The module's look: the intro's platform map, up close, at night, for the recap, the loop and the close. The opening is painted in the film's own source (`src/il_world.js`): a wheat field in the Yaqui Valley at dusk (sky, a line of mountains, soil and rows, stalks with slim ears and awns, drawn in three depths and swaying), with stem rust spreading as red-brown flecks and the stalks it reaches bowing; and the map of Mexico from Natural Earth's 1:110m land (public domain, credited in NOTICE.md), with the US border dashed, the two places of the program and the seed carried between them. The plant breeder and the agronomist are drawn in the agent films' people, in the khaki work shirts and trousers of the 1940s, arms down; the breeder is named once, as the program's plant breeder. Words over the field and the map are drawn in the frame itself, so they stay put while the camera moves. After the opening the film stays in one room, the map, and each chapter glides on from the one before. The Databricks, dbt and Microsoft Fabric logos stand unaltered on their readers. The poster is the loop, lit at *Adapt*, with the sandbox (`["loop", "adapt", 3.0]`).

## Script

Each line is said as written; the voice reads the numbers in words. *On screen* lists the words the picture shows.

### 1 · Two harvests a year · 0:00–2:03

> Mexico, 1944. In the Yaqui Valley of Sonora, in the north, farmers hardly grew wheat any more.
>
> Stem rust, a fungus that chokes the plant, could ruin a whole field of wheat at once.
>
> One field there that year was expected to give only ten bushels an acre: a poor harvest for a season's work.
>
> For a farmer, a ruined field meant a year's work and seed lost, and Mexico bought wheat from abroad for its bread.
>
> And breeding a wheat that resisted the rust was slow: one generation a year, and many years before it reached a farm.
>
> Farmers couldn't wait a decade for every new wheat.
>
> From 1945, a wheat program of Mexico's Ministry of Agriculture, with the plant breeder Norman Borlaug, tried another way.
>
> They grew two generations a year: one in summer, in the highlands near Mexico City, and one in winter, in Sonora, far to the north.
>
> Each season, they crossed plants, tested them in the field, kept the few that did best, and sowed those in the other place.
>
> Many breeders said a wheat should be bred only where it would grow. The team tried it anyway, and measured.
>
> It cut the time to breed a new wheat in half, and the new wheats grew well in both places, and far beyond.
>
> By 1956, Mexico grew all the wheat it needed. In the program's first twenty years, its harvest tripled.
>
> And the testing never stopped: the rust kept changing, so the wheat had to change too.
>
> Data platforms change too, every month. What lasts is the ideas, and a quick, honest way to test what's new.

### 2 · What the module showed · 2:03–3:16

> This module walked the university's platform, from where data is born to who reads it.
>
> In Data that moves, moving data was easy, and agreeing what each field means was the work.
>
> How fresh data must be came from when someone acts on it, and most analysis was fine a day old.
>
> And each claim was written once, on one platform, for everyone to read.
>
> In Data as software, scripts became software: tested, reviewed by the data team, and released the same way every time.
>
> And the platform watched itself, while a person decided what to change.
>
> In From tables to decisions, answers came on demand, and each measure was defined in the open, as each part of the business means it.
>
> And every reader, a person or an agent, read those definitions as itself.
>
> And here, in Documents and closing remarks, each document was read, kept, or written as data.
>
> Each idea is older than the tools that showed it.

### 3 · Why the films stay light · 3:16–4:08

> The tools change fast: new features every month, new names, new limits.
>
> A film that taught every button would be out of date within months.
>
> So these films stay with what changes slowly: agree what data means, test it, govern it, and serve it when the business acts.
>
> For the how, go to the source: each tool's official documentation and training, kept up to date by the people who build it.
>
> Not on Databricks? The ideas still hold. Check what your own platform offers for each one: most have an answer, under another name.
>
> Don't choose a feature because it's new, or a platform because a film showed it. Choose what answers a real need.

### 4 · Test what's new · 4:08–5:59

> So how do you keep up? With a loop, small and quick: investigate, adapt, implement, iterate.
>
> It's the breeders' two seasons again: the shorter the loop, the more you learn in the same time.
>
> Investigate starts from a real need, not from the feature. Rohan's team typed every invoice by hand, and asked for a better way in a ticket.
>
> Jun read the official docs on the functions that read documents: what they do, what they cost, and where they stop.
>
> Adapt means trying it small, on your own data, in a sandbox, for a set time: two days, on 200 of September's invoices.
>
> Jun compared what the functions read with what Finance had typed: 188 of the 200 matched, and most of the 12 that didn't were poor scans.
>
> Two days told the team what months of guessing couldn't: where it works, and where it doesn't.
>
> Implement means one use case, done properly: in the data project, with its tests, and a way back.
>
> The data team reviewed the change. Then Rohan's team checked October's results, and only then was the ticket closed.
>
> Iterate means watching what happens, and trying again: each month, the team looks at what went to a person, and why.
>
> Not every trial ends in yes. They tried letting the model pick each invoice's cost centre.
>
> But Finance's supplier list already gave it, so they dropped it.
>
> A trial that ends in no costs two days, not a year.

### 5 · Keep the method · 5:59–6:47

> The wheats of the 1950s are long gone from the fields. The method, two places and two seasons, is still used by wheat breeders today.
>
> So keep the ideas, and test the features: small, soon, and on a real need.
>
> That closes this module: moving data, running the platform, serving it to people and agents, and reading documents.
>
> Each once took a whole team. Databricks and dbt now do much of it; what's left for people is agreeing what the data means.
>
> Start from the official docs. Investigate, adapt, implement, iterate, and keep going.
## Sound

A new palette, checked on 11 November 2026 against every score on main and on this branch: two theremins and scythe blades, both made in `tools/score.py`. The theremin, Leon Theremin's instrument of 1920, played without touching it, glides from one note to the next; here it's played still, with no vibrato, each note placed and moved to the next: a measuring instrument made into music, a phrase tried, adjusted and tried again. Scythe blades, hung by the heel and struck softly with felt, as a farmer tests one for a crack by its ring: a clear note that dies within a second, for the field and its seasons. B minor for the problem and D major for the answer, every note a whole-number ratio of D, so nothing beats. The mark: a short line that rises, glides back a step and settles, with a blade under its last note, over the title and end cards. Music under the opening story; after it, only at a turn or under a moment on screen: the module's series as each is named, the ideas older than their tools, the official docs, the loop's ring, the 188 that match, the ticket closed, two days not a year, the harvest and the method. Wind in the wheat is one soft texture, never a crackle of stalks. Nothing of Mexico's own music for the 1940s story. `quiet.py` passes: after the opening, music 20% of the time, coming in once every 13.6 seconds, its loud moments at -28.6 dB and the effects' at -46.2 dB; the mix is at -16 LUFS.

## Pacing report

`tools/pace.py`, 11 November 2026: 6:47 in all, 886 words, 131 words a minute, the voice 72% of the time.

| Chapter | Length | Words a minute | Voice |
|---|---|---|---|
| Two harvests a year | 122.6 s | 133 | 73% |
| What the module showed | 73.5 s | 131 | 73% |
| Why the films stay light | 52.3 s | 132 | 69% |
| Test what's new | 111.0 s | 132 | 72% |
| Keep the method | 47.9 s | 118 | 70% |

## Pause and think

Three stops, at the end of *What the module showed*, *Why the films stay light* and *Test what's new* (`site/assets/ideas-that-last/think.en.js` and `think.es.js`): why each idea is older than its tools (the right answer third; the near miss, "no tool is needed", misses that the tools still help); what to take from the films on another platform (first; the near miss moves to Databricks because a film showed it); and the first trial of a new feature (second; the near miss builds it for every invoice at once, skipping the small trial).

## Rigour to check before recording

- **Wheat in Sonora, 1944.** The University of Minnesota's Borlaug pages: wheat was seldom grown in the Yaqui Valley in 1944, and one field was projected to yield ten bushels an acre. The film says "hardly grew wheat any more" and "expected to give only ten bushels an acre".
- **Stem rust.** A fungus (*Puccinia graminis*) that attacks the stem and can destroy a field's harvest; the film says "chokes the plant", plainly.
- **Imports.** Mexico imported much of its wheat before the program (the Rockefeller Archive Center; FAO). No share is given, so the film gives none.
- **The program.** The Office of Special Studies, inside Mexico's Ministry of Agriculture, with the Rockefeller Foundation, from 1943; Borlaug joined in 1944, and shuttle breeding began in 1945. The film says "From 1945, a wheat program of Mexico's Ministry of Agriculture, with the plant breeder Norman Borlaug": the program is Mexico's, and Borlaug one of its people, as the sources put it. It doesn't name the foundation, to keep the story on the work.
- **Two generations a year.** Summer near Toluca, in the highlands near Mexico City, and winter in the Yaqui Valley, Sonora (Minnesota; Rockefeller Archive Center). Shown on the map at Toluca and Ciudad Obregón, approximately.
- **The dogma.** That a wheat should be bred where it will be grown was the common view; the team defied it (Minnesota). The film: "Many breeders said … The team tried it anyway, and measured."
- **Half the time.** Shuttle breeding cut the time to develop a new variety in half (Rockefeller Archive Center). The new wheats were insensitive to day length, so they grew well in both places and far beyond (Minnesota; Nobel Prize pages).
- **1956 and tripled.** By 1956 Mexico was self-sufficient in wheat (Nobel Prize pages; Minnesota). The program tripled Mexico's wheat production in its first twenty years (Rockefeller Archive Center).
- **Testing never stopped.** Stem rust keeps changing, so breeding for resistance goes on; shuttle breeding is still the centrepiece of CIMMYT's wheat programme (FAO; CIMMYT). The film: "still used by wheat breeders today".
- **What the film leaves out.** The Green Revolution's later debates (fertiliser, water, who gained) are beyond a film on testing quickly; the opening says only what the sources count.
- **The data story.** Invented, in the module's world: Rohan Desai's team, Jun Park, the 200 invoices, 188 matched, the 12 mostly poor scans, the dropped cost-centre trial. The monthly reasons (72, 31, 14, 9) are *Files as data and as context*'s October counts, shown as bars. The recap's lines each match what a film of the module says.
- **Release status.** Not said or shown, by the rule of 5 November 2026. The functions that read documents (`ai_parse_document`, `ai_extract`) are not named in this film; their maturity is in *Files as data and as context*'s sources.

### Sources

All checked on 11 November 2026.

- University of Minnesota, *Norman Borlaug: the man and his work* (borlaug.cfans.umn.edu): the Yaqui Valley in 1944, the ten-bushel field, two generations a year, the dogma, day-length insensitivity, 1956.
- Rockefeller Archive Center, *The Mexican Agricultural Program* (rockarch.org): the Office of Special Studies in the Ministry of Agriculture, shuttle breeding halving the time to a new variety, production tripled in twenty years, over 550 Mexican graduates trained.
- The Nobel Prize, *Norman Borlaug, facts* and the 1970 award speech (nobelprize.org): self-sufficiency in wheat by 1956.
- FAO, on shuttle breeding and wheat rusts (fao.org): shuttle breeding still central; rust pathogens keep evolving.
- CIMMYT, on its wheat programme (cimmyt.org): shuttle breeding between Ciudad Obregón and Toluca today.
- Eric Ries, *The Lean Startup* (2011): build, measure, learn.
- Databricks documentation, release notes and training; dbt documentation and dbt Learn; Microsoft Fabric documentation (the page's links, each opened on 11 November 2026).
- Natural Earth, 1:110m land (public domain): the map of Mexico; the border drawn from its main points.

## What the example project has

Nothing new: the trial reads invoices as `examples/files-as-data/read_invoices.sql` does, and checks them as `check_invoices.sql` does, both from *Files as data and as context*. The film links to them from its *Test what's new* chapter.
