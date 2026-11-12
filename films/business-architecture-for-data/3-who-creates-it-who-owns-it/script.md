# Business architecture for data · Who creates it, who owns it: script

*The script of *Who creates it, who owns it*, film 3 of 5 of *Business architecture for data*, the second series of the topic *Enterprise architecture*, in nine chapters, in English, drawn in the look of *The map before the data*. Written on 12 November 2026 from the series' proposal, which the author confirmed and merged on 11 November 2026 (PR #318), and this film's row in it: the capability × concept matrix (creates, reads, updates, deletes); owners and stewards; the owner always the business, hard to find where metadata is scarce; and two capabilities that both create the same concept, until the business decides which one does, and who owns it.*

## The promise

Every line passes two tests: someone new to data work can follow it, and a business architect, a data architect or a data governance lead finds nothing wrong in it. Its idea, from the series' fourth insight: a concept's owner is the owner of the capability that creates it. A matrix of what each capability creates, reads, updates and deletes finds both, and the owner names a steward to look after the concept day to day.

**Takeaway:** "Each concept: one capability creates it, an owner decides, a steward looks after it."

## The story in one paragraph

In the 1860s, at Mahan, near Kerman, a new qanat was dug, and its water was owned in six shares of time by three men; one share went to the keeper of the town's shrine. Over the years its shares were sold, left to children and split, and many qanats came to have two or three hundred owners, some ten thousand shares. Each owner's water had to reach the right field at the right time, or a family could lose its crop, and every year the tunnel needed repairs that someone had to decide on and pay for. So the owners met each year and decided the repairs, voting by the size of their shares, and paid a water master, the mirab, to guide the water to each field in its turn, with his helpers keeping the channels clean and opening each field's gate on time. The mirab looked after the water; its owners decided. For that qanat, the Vakilabad, every change of owner is on record, from the first three men on: generations later, the shrine keeper's share had become a third, held by twenty of his descendants, some seventy families held the rest, and every share had a named owner. At the utility, each concept needs the same: an owner who decides, and someone to look after it every day.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against Paul Ward English's account of qanat villages (*Rigour*, below). The series follows one true story across its five films (the author, 11 November 2026); this film tells who owns a qanat's water, and who looks after it.

| Beat | The line that says it |
|---|---|
| Scenario | "In the 1860s, at Mahan, near Kerman, a new qanat was dug: a tunnel bringing water from the mountains." "Its water was owned in six shares of time, each a turn at the water, and three men held them." "One of the six went to the keeper of the town's shrine." |
| Problem | "Over the years, its shares were sold, left to children, and split again and again." "Many qanats came to have two or three hundred owners, and some, ten thousand shares." "Each owner's water had to reach the right field at the right time, or a family could lose its crop." "And every year, the tunnel needed repairs, which someone had to decide on and pay for." "With so many owners, a qanat needed them to decide together, and someone to look after the water." |
| Solution | "So the owners met each year to decide on the repairs, voting by the size of their shares." "They paid a water master, the mirab, to guide the water to each field in its turn." "With his helpers, he kept the channels clean and opened each field's gate on time." "The mirab looked after the water. Its owners decided." |
| Benefits | "For that qanat, the Vakilabad, every change of owner is on record, from the first three men on." "Generations later, the shrine keeper's share had become a third, held by twenty of his descendants." "Some seventy families held the rest, and every share had a named owner." Then the same for data: "At the utility, each concept needs the same: an owner who decides, and someone to look after it every day." |
| Back to the story | In *Owners and stewards*: "Like the mirab, a steward looks after it for its owner, and doesn't own it." "And the data team builds and runs what holds it, as diggers keep a qanat's tunnel, and owns none of it." And at the end, with its benefit for data: "On a qanat, every share has a named owner: the owners decide, and the mirab looks after the water." "At the utility, every concept now has one capability that creates it, an owner who decides, and a steward who looks after it." |

The test: someone who has never heard of a qanat can say, from the narration alone, why it was a problem (a qanat's shares were sold, inherited and split until hundreds of people owned its water, yet each owner's water still had to reach the right field at the right time or a family could lose its crop, and the tunnel needed repairs every year that someone had to decide on and pay for) and what the fix gave people (the owners decided together, each vote by the size of its share, and paid a mirab to look after the water day to day, so the water reached each field in its turn; and every share kept a named owner, from three men to some seventy families, with the record to show it).

## The reference, and practice

The series' reference holds (`../proposal.md`): the BIZBOK Guide for business architecture; DAMA-DMBOK2 for ownership and stewardship; ArchiMate for the map; and, for this film, the matrices of TOGAF and Information Engineering. Named once each, never taught as products.

- **What the film adopts.** The capability × concept matrix: what each capability creates, reads, updates or deletes, which architects call a CRUD matrix. TOGAF draws it as its data entity / business function matrix and uses it to assign data's owners; James Martin's Information Engineering and IBM's Business Systems Planning drew it before, with the rule that each kind of data is created by one process. The film draws BIZBOK's capabilities down one side and the concepts of *What the business needs to know* across the top. DAMA-DMBOK2's data owner and data steward.
- **One creator, and the owner follows it.** Each concept should be created by one capability, and its owner is the owner of that capability (the series' fourth insight). Read down each column: one C.
- **Two that create.** Where a column has two, it isn't the architect's or the data team's to settle: the owners of the two capabilities decide which one creates the concept, and the decision goes on the map with its date, so nobody has to settle it again. The film's case is the account, opened by retail when someone signs up and by connections when a new home is switched on.
- **Owners and stewards.** An owner decides what a concept means, who creates it, the rules on it and how good it must be; the owner is always the business. An owner can't look after a concept day to day, so each owner names a steward, someone who works with it every day, who keeps the definition, answers questions about it and follows up when something's wrong. A steward looks after it for its owner, and doesn't own it. The data team builds and runs what holds it, and owns none of it. Owners and stewards never review pull requests (AGENTS.md), and the film shows none.
- **An owner nobody wrote down.** Where metadata is scarce, the owner is still found by capability: ask which capability creates the concept, not which system a table came from. The system shows where the data sits today, not who in the business decides about it.
- **From practice.** Fill the matrix in with the people who run each capability, not from what the systems say: a system shows where data is written today, workarounds included. Start where it hurts: two accounts for one new home, and families who get two first bills.
- **The data practice on the map.** The film's piece of the author's idea (the proposal, *The data practice on the map*): the data owner and the data steward join the business layer as roles, the owner's held by each domain's owner (Grace for the network, the head of retail for retail), with the stewards each owner names. *Processes, as deep as data needs* adds the processes where each concept is born.

## What each object stands for

- **The dial:** one turn of the Vakilabad's water, as *What the business needs to know* drew Mahan's day of water: six shares of time, each in its owner's colour, the shrine keeper's in sage; split finer and finer as shares are sold, left to children and split; then, generations later, a third in sage for the keeper's twenty descendants and the rest in some seventy families' colours, each share marked with its owner as a hand goes round.
- **The village cut away:** the qanat's water reaching the fields at their gates, with the owners by their fields; a turn missed, a field going dry; the tunnel's roof fallen in; the owners meeting, their votes by shares; the mirab, the water master, at each field's gate in its turn, and his helpers cleaning the channels.
- **The record:** a sheet of the Vakilabad's owners, every change of owner written in its turn, from the first three men on.
- **The matrix:** the eight capabilities of Tomás's map in the strategy layer's glass down the left, with the people who run each one beside them in gold; five concepts across the top, the network's in blue (outage, connection point, meter) and retail's in rose (account, bill); in each square, C, R, U and D; under each column, its owner in gold and, at the end, its steward in sea-green.
- **The new home:** a house switched on at dusk, its meter's light blue; the cards of the accounts opened for it, and the first bills on its step.
- **The decision:** a glass card with its date, "decision · 12 May", pinned to the account's column.
- **The owner's and the steward's cards:** gold for the owner, who decides; sea-green for the steward, who looks after it, day to day; the data team's in blue. In each card's corner, its likeness on the qanat: the owners by their fields, the mirab at a gate, the diggers in the tunnel.
- **The outage table:** a glass card in the data team's blue, "table · outages", "built 2019", with a red dashed chip, "owner: ?", until its owner's tag replaces it.
- **The data practice on the map:** the business layer of *What the business owns*, its data team, tickets and service, the glossary's domains from *What the business needs to know*, and now the two roles.

## The look

*The map before the data*'s look, from `films/enterprise-architecture/shared/`: paper drafts on a wall, the confirmed model in glass, the six layers in their colours, and the same people at the same energy utility. The series' own components are in `../shared/src/ba.js`: the village, the qanat in section, the day of water and the data practice. In the desert, blue is the water, and the people of the story are silhouettes. Gold marks an owner, sea-green a steward, blue the data team.

## Script

### 1 · Owners, and a water master · 0:00–1:54

In the 1860s, at Mahan, near Kerman, a new qanat was dug: a tunnel bringing water from the mountains.
Its water was owned in six shares of time, each a turn at the water, and three men held them.
One of the six went to the keeper of the town's shrine.
Over the years, its shares were sold, left to children, and split again and again.
Many qanats came to have two or three hundred owners, and some, ten thousand shares.
Each owner's water had to reach the right field at the right time, or a family could lose its crop.
And every year, the tunnel needed repairs, which someone had to decide on and pay for.
With so many owners, a qanat needed them to decide together, and someone to look after the water.
So the owners met each year to decide on the repairs, voting by the size of their shares.
They paid a water master, the mirab, to guide the water to each field in its turn.
With his helpers, he kept the channels clean and opened each field's gate on time.
The mirab looked after the water. Its owners decided.
For that qanat, the Vakilabad, every change of owner is on record, from the first three men on.
Generations later, the shrine keeper's share had become a third, held by twenty of his descendants.
Some seventy families held the rest, and every share had a named owner.
At the utility, each concept needs the same: an owner who decides, and someone to look after it every day.

*On screen:* "Mahan, near Kerman · the 1860s": the desert from above, the new qanat's line of shafts lit from the mountains to the village, "a new qanat: a tunnel from the mountains". Then the dial, "its water: six shares of time", each share lit in its turn, "three men" beside it; "one of the six: the keeper of the town's shrine" in sage. The shares split finer as "sold", "left to children" and "split, again and again" land; "many qanats", "200 to 300 owners", "10,000 shares". The village cut away: the water reaching each field at its gate in turn, "the right field, at the right time"; the third field's turn missed, its crop drying, "a turn missed: a crop lost". The tunnel's roof falls in and the water stops, "every year: repairs", "who decides? who pays?"; the camera draws back over the whole qanat, "decide together", "someone to look after the water". "The owners meet, each year: votes by shares", a bar of their shares and four votes; "the repairs: agreed, and paid for", the water back. "The mirab, the water master", "paid by the owners", at each field's gate in its turn; "his helpers: the channels clean"; "the mirab: looks after the water", "the owners: decide". Then "the Vakilabad · its owners": the record, "every change of owner, on record", the first three men written first. "Generations later": "a third: twenty of his descendants", "the rest: some seventy families", "every share: a named owner" as a hand goes round the dial and marks each one. "At the utility, each concept needs": "an owner who decides", "someone to look after it, every day". In the pause, the water, then the title: *Who creates it, who owns it*, "an owner who decides, someone who looks after it".

### 2 · Tomás's next note · 1:54–2:13

Tomás's next note asks who creates each concept, and who owns it.
On his map, each concept already sits beneath the capabilities that use it.
Now he needs to know exactly what each capability does with each one.

*On screen:* Tomás's wall as *What the business needs to know* left it, the capabilities in the strategy layer and the concepts beneath them in their domains; the note from its end, "Who creates it? Who owns it?", is set aside; the lines from the capabilities to their concepts are lit; "what does each capability do with each one?".

### 3 · Creates, reads, updates, deletes · 2:13–2:58

He draws a matrix: the capabilities down one side, the concepts across the top.
In each square goes what the capability does with the concept: creates it, reads it, updates it, or deletes it.
Architects call it a CRUD matrix, after those four letters.
He fills it in with the people who run each capability, not from what the systems say.
Then he reads down each column: each concept should be created by one capability.
And its owner is the owner of that capability.
Connecting customers creates the connection point, so the connection point is Grace's.

*On screen:* the eight capabilities move from the wall down the left side, five concepts across the top: outage, connection point, meter, account, bill. "In each square": "creates it", "reads it", "updates it", "deletes it", and the letters C, R, U and D fill the squares row by row; "CRUD matrix", with its four letters as a legend. Grace comes in at the right; the people who run each capability are written beside them (Grace, the head of retail, Ama); "what the systems say" is struck out. A light reads down each column: "one C in each column". The owners' column glows. The connection point's C is ringed, and Grace's name is carried down to its column's foot, under "owner". The others follow: Grace, Grace, a red "?" under the account, and the head of retail under the bill.

### 4 · Two that create · 2:58–3:42

But the account's column has two.
Serving customers opens an account when someone signs up.
And connecting customers opens one when a new home is switched on, so its first bill can go out.
So a family moving into a new home could end up with two.
Last year, twelve hundred new homes had two accounts, and three hundred and forty families got two first bills.
Farah, who speaks for the utility's customers, had been asking why. The matrix shows it.
Which capability should create the account isn't for Tomás or the data team to decide.

*On screen:* the account's two Cs are ringed in red. "serving customers: when someone signs up"; "connecting customers: when a new home is switched on". A new home at dusk is switched on, its windows lit and its meter's light blue; two cards come to it, "account · opened by retail" and "account · opened at switch-on": "one home, two accounts". "Last year": "1,200 new homes: two accounts", "340 families: two first bills", and two first bills land on the step. Farah comes in, "why two bills?". Then "not Tomás's to decide" and "nor the data team's", each struck out.

### 5 · The business decides · 3:42–4:26

Grace runs connecting customers, and the head of retail runs serving customers. They decide it together.
Serving customers creates the account. Connecting customers creates the connection point, and only reads the account.
When a new home is switched on, it tells retail, and retail opens the account.
So the account's owner is the head of retail, who runs the capability that creates it.
The decision goes on the map with its date, so nobody has to settle it again.
Since then, each new home gets one account, and one first bill.

*On screen:* the matrix again, Grace and the head of retail lit beside the two capabilities they run, "Grace and the head of retail decide it together". Serving customers' C under the account turns green; connecting customers' C under the account turns to R, and an arrow runs down from it to serving customers, "tells retail". The red "?" under the account becomes "head of retail". A card: "decision · 12 May", "Serving customers creates the account.", "Connecting customers reads it, and tells retail.", "decided by Grace and the head of retail"; its words leave and it is pinned to the account's column. In the pause, the new home at night with one card, "account · opened by retail", and one first bill on its step: "one home: one account, one first bill".

### 6 · Owners and stewards · 4:26–5:13

An owner decides what a concept means, who creates it, the rules on it, and how good it must be.
But the head of retail can't look after three hundred and ten thousand accounts, day to day.
So each owner names a steward: someone who works with the concept every day.
For accounts, it's retail's billing lead, who keeps the definition, answers questions about it, and follows up when something's wrong.
Like the mirab, a steward looks after it for its owner, and doesn't own it.
And the data team builds and runs what holds it, as diggers keep a qanat's tunnel, and owns none of it.

*On screen:* the owner's card in gold, "decides": "what it means", "who creates it", "the rules on it", "how good it must be"; "accounts: the head of retail", with the owners by their fields in its corner. "At the utility: 310,000 accounts", "looked after by one person, every day?". An arrow from the owner, "names", to the steward's card in sea-green, "looks after it, day to day": "keeps the definition", "answers questions about it", "follows up when it's wrong"; "accounts: retail's billing lead". In its corner, the mirab at a field's gate, "the mirab", and "doesn't own it". The data team's card in blue, "builds and runs what holds it": "owns none of it", with "the diggers" in the tunnel in its corner.

### 7 · An owner nobody wrote down · 5:13–5:55

Some concepts have no owner written down anywhere.
An outage table, built in 2019, holds every outage, and Ama's yearly report to the regulator counts them from it.
Whoever built it has left, and nobody knows who owns what's in it.
Tomás doesn't ask which system the table came from. He asks which capability creates outages.
Operating the network does, so outages are Grace's, and her outage desk lead becomes their steward.
Owners are found by capability, not by system, even where nothing was written down.

*On screen:* a glass card, "table · outages", "built 2019", its columns (outage, started, homes) and rows, with a red dashed chip, "owner: ?". Ama comes in, and her "yearly report", "to the regulator": "outages: counted", "from the table", a dashed line from the table to it. "built by: someone who has left". Ama leaves and Tomás comes in: "which system did it come from?", struck out; "which capability creates outages?". "operate the network" in glass, with its C under "outage". The chip gives way to "owner: Grace", then "steward: outage desk lead". "owners: found by capability, not by system".

### 8 · The data practice on the map · 5:55–6:18

On the data practice's map, two roles join: the data owner and the data steward.
Each domain's owner holds the owner's role: Grace for the network's concepts, and the head of retail for retail's.
And each owner names the stewards who look after their concepts, day to day.

*On screen:* the outage table leaves first; "the data practice, on the map": the business layer with the data team, tickets and service from *What the business owns* and the glossary's domains from *What the business needs to know*. Two roles join, "the data owner" and "the data steward". Each domain's owner is lit in gold, Grace for the network and the head of retail for retail; then the concepts their stewards look after glow in sea-green.

### 9 · Every share, a name · 6:18–6:50

On a qanat, every share has a named owner: the owners decide, and the mirab looks after the water.
At the utility, every concept now has one capability that creates it, an owner who decides, and a steward who looks after it.
Tomás's next note asks where each one is born: in which process, and at which step.

*On screen:* the village again, "every share, a named owner", the owners by their fields, "the owners: decide"; the mirab lifts a field's gate and lets the water in, "the mirab: looks after the water". Then the utility: the matrix with one C in every column, "one capability that creates it", each concept's owner, "an owner who decides", and its steward, "a steward who looks after it". Tomás's next note: "Where is it born? In which process, at which step?". The end card: "Each concept: one capability creates it, an owner decides, a steward looks after it." Film 3 of 5.

## Sound

Each film of the series takes its own sound under the topic's `palettes.md` rules. Nothing new fitted, so this film, like *What the business needs to know*, pairs two instruments the site has but no film pairs, and no film of this topic plays: an English concertina and a clarinet (`source/tools/score.py`; the film's assumptions file says why).

- **The lead:** an English concertina, Wheatstone's free-reed instrument of 1829, in its baritone size: a button for each note and one steel reed to a note, sounding the same whichever way the bellows move, held level while the button is down and gone a moment after it's let go; one reed to a note, so nothing beats or trembles. Its scale alternates between its two ends, so a line passes from one hand to the other, as a share passes from hand to hand and is always held by someone named. It presses chords from the bass up under the opening story and at a chapter's turn, and gives one note as a thing lands.
- **Its partner:** a clarinet, low and soft, in its chalumeau register (D 3 to A 4), each note tongued softly and held at one level, with no vibrato: the steady line under the concertina, as the mirab keeps the turns for the owners. It comes in with the mirab, and with each steward after him.
- **The film's own figure, played once:** where two capabilities both create the account, both instruments take the same D; when the business decides, the clarinet steps down to B and holds it, reading, while the concertina keeps the D.
- **The mark:** the concertina plays D, then A, and the clarinet holds the F sharp between them: the three layers this series covers, the business layer between the other two. Under the title, and again under the end card.
- **Its sounds:** the desert's wind; the water in the channel, one soft texture; the tunnel's roof falling in, a low fall of earth; the fields' wooden gates and the water let in; the owners' votes; the record's pen; a pick in the tunnel's earth, once, for the diggers; and at the utility, cards, paper, keys, a pen, and knocks and taps as things are set on the wall.
- **Nothing borrowed:** no santur, tar, kamancheh, ney, daf or tombak, and no Persian mode. D major and its neighbours, tuned pure from D; B minor where the story turns to a loss or a lack: a turn missed, the account created twice, the table nobody owns.
- `tools/quiet.py` passes: under the opening story the music sounds 54% of the time; after it, 19% of the time, once every 14.8 s on average and at most four times in any 30 s; its loud moments at -27.9 dB, its loudest notes at -26.2 dB, the effects' loud moments at -47.3 dB, at most four starting in one second; 136 held notes, kept within 0.1 dB in the room. Mixed to -16 LUFS.

## Pause and think

The film stops at the end of three chapters, one question each (`site/assets/who-creates-it-who-owns-it/think.en.js` and `think.es.js`). The right answers sit in the third, first and second places, each question has a near miss, and every option is about as long as the others.

| Chapter | Question | Right | Near miss |
|---|---|---|---|
| *The business decides* | Serving customers and connecting customers both open an account for a new home. Who settles which one creates it? | Grace and the head of retail, who run the two capabilities, decide it together, and the date goes on the map. | The head of retail alone, since the account ends up in retail's domain, with retail's own billing lead. They decide it together: the owners of both capabilities that create it. |
| *Owners and stewards* | Retail's billing lead keeps the account's definition and answers questions about it. What is the billing lead to the account? | Its steward, who looks after it day to day for its owner, the head of retail, and doesn't own it. | Its owner, who works with it every day, so decides what it means and how good it must be. The owner decides; the steward the owner names looks after it. |
| *An owner nobody wrote down* | Nobody knows who owns what's in the outage table, and whoever built it has left. Where does Tomás look for its owner? | The capability that creates outages: operating the network does, so the outages are Grace's. | The system the table was loaded from: whoever runs that system owns the outages it holds. A system shows where data sits today; owners are found by capability. |

## Rigour

Checked on 12 November 2026.

| Claim | Source | Note |
|---|---|---|
| In the 1860s, at Mahan, near Kerman, a new qanat was dug; its water was owned in six shares of time, held by three men, and one of the six went to the keeper of the town's shrine | P. W. English, "Qanats and Lifeworlds in Iranian Plateau Villages", in *Transformations of Middle Eastern Natural Environments*, Yale F&ES Bulletin 103 (1998), pp. 187–205, citing English (1989): "the Vakilabad qanat built in Mahan, a town southeast of Kirman, in the 1860s ... Initially, its water was divided among three men in six shares. One-sixth of the water was allotted to the then custodian of the Shah Ni'matullah Vali Shrine" | The shrine is Shah Ni'matullah Vali's, in Mahan; the film says "the keeper of the town's shrine" |
| Over the years, its shares were sold, left to children and split; many qanats came to have two or three hundred owners, and some ten thousand shares | English (1998): "the constant need for tunnel repairs owing to natural disasters or social dislocations leads to rapid fragmentation in ownership. Many qanats have as many as two to three hundred owners and the water of some qanats is divided into as many as 10,000 time shares"; on shares held, inherited, divided and sold | |
| Each owner's water had to reach the right field at the right time, or a family could lose its crop | English (1998): the mirab is "the person responsible for guiding the water through channels to the right field at the right time"; *What the business owns* (from the same source): each family's crop lives or dies by when the water reaches it | That a missed turn can cost a crop is the film's plain reading of irrigation in a desert, as *What the business owns* says |
| Every year the tunnel needed repairs, which someone had to decide on and pay for; the owners met each year to decide on the repairs, voting by the size of their shares | English (1998): "Annual repairs and cleaning of the qanat are usually required to maintain its flow, and communal meetings of qanat owners are held to decide the annual allocation of funds for this purpose. Although large water owners tend to dominate these meetings, votes are cast by shares" | |
| They paid a water master, the mirab, to guide the water to each field in its turn; with his helpers, he kept the channels clean and opened each field's gate on time | English (1998): "the water master (mirab) or water bailiff (mubashiri ab). This official often directs a bevy of assistants who keep the channels clean, open and close small gates to specific fields, and breach levees when required"; "the payment of the mirab, his assistants, and crop watchers (either in cash or kind) are also decided in this fashion" | Paid by the owners' vote. English adds that in some smaller communities the water users do these tasks themselves; the film follows the mirab |
| For the Vakilabad, every change of owner is on record; generations later the shrine keeper's share had become a third, held by twenty of his descendants, and some seventy families held the rest | English (1998), citing English (1989): "A complete record of changes in ownership exists for the Vakilabad qanat"; "This portion has increased to one-third of the water and is now owned by twenty of his descendants. The remaining water was sold off bit by bit such that some seventy families now own shares in the qanat" | English's "now" has no date, so the film says "generations later", not a number of years. That every share had a named owner is the film's reading of a complete record of owners |
| The diggers keep a qanat's tunnel, and own none of the water | *What the business owns*: the muqannis build and repair the tunnel, are paid for the work, and the water isn't theirs | |
| A matrix of what each capability creates, reads, updates or deletes, called a CRUD matrix; each concept should be created by one capability | The Open Group, *The TOGAF Standard*, 10th edition (2022): the data entity / business function matrix, which can show create, read, update and delete, and helps assign the ownership of data entities; J. Martin, *Information Engineering*, Book II (Prentice Hall, 1990): the entity type / process matrix; IBM, *Business Systems Planning: Information Systems Planning Guide*, GE20-0527, 4th edition (1984): the process / data class matrix, where each data class is created by one process | The film draws BIZBOK's capabilities in place of business functions or processes |
| A concept's owner is the owner of the capability that creates it | The series' proposal, its fourth insight (TOGAF's matrices; Information Engineering), confirmed by the author on 11 November 2026 | |
| An owner decides what a concept means, who creates it, the rules on it and how good it must be; each owner names a steward who works with it every day, keeps its definition, answers questions about it and follows up when something's wrong | DAMA International, *DAMA-DMBOK*, 2nd edition, revised (2024), chapter 3, *Data Governance*: data owners, with authority for decisions about data in their domain, and data stewards, who manage core metadata such as definitions, document rules and standards, and manage data quality issues; R. S. Seiner, *Non-Invasive Data Governance* (Technics, 2014): stewards are people who already define, produce and use the data in their work | The owner is always the business. Owners and stewards never review pull requests (AGENTS.md); the film shows none |
| Owners are found by capability, not by system, even where nothing was written down | The series' proposal: the owner is always the business, hard to find where metadata is scarce; the author's practice (11 November 2026) | |
| The utility's numbers: twelve hundred new homes with two accounts last year, three hundred and forty families with two first bills, 310,000 accounts, the outage table built in 2019, the decision dated 12 May; the stewards' roles | Invented, as the series' world is; the eight capabilities and the people are *The map before the data*'s | |

No feature's release status is said or shown.

## Pacing report

`tools/pace.py`, 12 November 2026: 6:50 in nine chapters, 881 words, 129 words a minute, the voice 70% of the time.

| Chapter | Length | Words a minute | Voice | Longest quiet |
|---|---|---|---|---|
| Owners, and a water master | 1:54 | 138 | 71% | 7.0 s |
| Tomás's next note | 0:19 | 120 | 66% | 2.4 s |
| Creates, reads, updates, deletes | 0:45 | 127 | 71% | 2.4 s |
| Two that create | 0:44 | 132 | 70% | 2.4 s |
| The business decides | 0:45 | 122 | 68% | 4.8 s |
| Owners and stewards | 0:47 | 138 | 71% | 2.8 s |
| An owner nobody wrote down | 0:42 | 121 | 73% | 2.6 s |
| The data practice on the map | 0:23 | 125 | 69% | 2.6 s |
| Every share, a name | 0:32 | 110 | 61% | 7.8 s |

Every sentence has at least 0.5 s after it, and no chapter stops for 2.5 s or more inside it. The longest quiets are the opening's title, the new home in *The business decides*, and the end card, without words.
