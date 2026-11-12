# Business architecture for data · What the business owns: script

*The script of *What the business owns*, film 1 of 5 of *Business architecture for data*, the second series of the topic *Enterprise architecture*, in nine chapters, in English, drawn in the look of *The map before the data*. Written on 11 and 12 November 2026 from the series' proposal, which the author confirmed and merged on 11 November 2026 (PR #318), and this film's row in it: BIZBOK's parts, who owns what, the qanats' shareholders and diggers, and a request for "all customers" that gets three answers.*

## The promise

Every line passes two tests: someone new to data work can follow it, and a business architect, a data architect or a data governance lead finds nothing wrong in it. Its idea, from the series' first insight: the business owns what its data means, who creates it, the rules on it and the quality it needs; the data team owns how it's stored, moved and checked.

**Takeaway:** "The business owns what its data means. The data team keeps the channel."

## The story in one paragraph

In the deserts of Iran, villages have lived for more than two thousand years on water brought from the foot of the mountains through qanats: tunnels dug by hand, which bring groundwater to the surface by gravity alone, marked by a line of shafts that let the diggers in and the earth out. There is never enough water for every field at once, and a single cave-in can cut off a whole village, so people needed to know whose water it was and who would keep it flowing. Each part has its own people: the water belongs to its shareholders, in shares of time (in one town, Mahan, a share was ninety-six minutes of the flow every twelve days); a water master, the mirab, keeps the turns; and the diggers, the muqannis, build and repair the tunnel, paid for their work, owning none of the water. With each part in its own hands, the water has been shared this way for centuries. The Qasabeh qanat at Gonabad still flows, about thirty-three kilometres long, and in 2016 UNESCO listed eleven qanats as *The Persian Qanat*. At the utility, the data team is the digger: it keeps the channel, and the water, and what it means, belongs to the business.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against UNESCO's listing and Paul Ward English's account of qanat villages (*Rigour*, below). The series follows one true story across its five films (the author, 11 November 2026); this film sets its scenario.

| Beat | The line that says it |
|---|---|
| Scenario | "Iran, at the edge of the desert. For more than two thousand years, villages here have lived on water that nobody sees." "It comes through a qanat: a tunnel dug from the foot of the mountains, which brings groundwater to the surface by gravity alone." "A line of shafts marks its path. They let the diggers in, and the earth out." |
| Problem | "There's never enough water for every field at once. Each family's crop lives or dies by when the water reaches it." "And the tunnel is fragile. One cave-in can cut off a whole village." "People needed to know whose water it was, and who would keep it flowing." |
| Solution | "So each part has its own people. The water belongs to its shareholders, in shares of time." "In one town, a share was ninety-six minutes of the flow, every twelve days." "A water master, the mirab, keeps the turns." "And the diggers, the muqannis, build and repair the tunnel. They're paid for the work. The water isn't theirs." |
| Benefits | "With each part in its own hands, the water has been shared this way for centuries, and the fields stay green." "In Gonabad, the Qasabeh qanat still flows, thirty-three kilometres long. In 2016, UNESCO listed eleven qanats as the Persian Qanat." Then the same for data: "At the utility, the data team is the digger. It keeps the channel. The water, and what it means, belongs to the business." |
| Back to the story | In *Whose meaning?*: "In the village, the diggers don't decide whose turn it is." In *Who owns what*: "Like the shareholders and the diggers: one owns the water and its rules, the other keeps the channel." "Both matter. A channel nobody keeps silts up, and water nobody owns is fought over." And at the end, with its benefit for data: "In the village, the diggers keep the channel, and the shareholders decide whose water it is." "At the utility, the data team keeps the channel. What flows in it, and what it means, is the business's." |

The test: someone who has never heard of a qanat can say, from the narration alone, why it was a problem (there was never enough water for every field at once, each family's crop depended on when the water reached it, and one cave-in could cut off a whole village, so people had to know whose water it was and who would keep it flowing) and what the fix gave people (each part in its own hands: the shareholders own the water and its turns, the mirab keeps the turns, the diggers keep the tunnel, and the water has been shared that way for centuries, with the fields green and Qasabeh still flowing).

## The reference, and practice

The series' reference holds (`../proposal.md`): the BIZBOK Guide for business architecture; DAMA-DMBOK2 for ownership and stewardship; ArchiMate for the map. Named once each, never taught as products.

- **What the film adopts.** BIZBOK's core: capabilities, value streams, information and the organisation, with stakeholders, products, policies and initiatives around them. Its information map, the business's concepts, sits in the map's information layer, as *The map before the data* draws it. DAMA-DMBOK2's split between business accountability for data (meaning, rules, quality expectations) and the data team's custody of it (storage, movement, checks).
- **Where it narrows them.** Business architecture covers much more than data: products, partners, finance, organisation design. The film says so outright and takes only what matters for data, as the series' plan does: what the business needs to know, who creates and owns it, the processes it's born in, and the rules and expectations on it. One film each, in that order.
- **From practice.** A count that "doesn't match" is usually two right answers to two meanings. The fix isn't the data team picking one: the person who asked decides, with each meaning's owner, and the data team builds and tests what they decided. A table whose rule nobody in the business confirmed is retired, not patched. The person who asked checks the result before the ticket closes (AGENTS.md, *Business users ask in tickets*). The author's own advice for the series: ask of each capability who its experts are, what its key data elements are and who could own them (the proposal, *From the author's past engagements*); this film says the principle, and *Who creates it, who owns it* draws it.
- **The data practice on the map.** The series' first piece of the author's idea (the proposal, *The data practice on the map*): the data team as a business actor, its business services (answering data requests), tickets as the service's interface, and account and connection point as business objects whose meaning stays with their owners. Each later film adds to it.
- **Overlap.** *Day one* first asked the utility how many customers it has and got two answers, retail's 310,000 accounts and the network's 540,000 connection points. This film picks those counts up when the data team's own table gives a third, and asks who decides what the report means.

## What each object stands for

- **The qanat in section:** the tunnel, its shafts and the water, cut away from the side; the diggers at work in it are the data team's job. A cave-in is what a channel nobody keeps comes to.
- **The village and its fields:** the shareholders by their fields, the mirab at a gate whose turn it is; the bar of twelve days, the first opened into fifteen shares, one lit, is one share of time. Drawn plainly, in the series' own style, with nothing borrowed from Persian art.
- **The village from above:** the line of shafts leading to the village and its fields, with the data team keeping the channel and the business owning the water and what it means.
- **The ticket** (DATA-2041, from Ama Owusu): a request from the business. Every ask arrives as a ticket, and the answer goes back on it.
- **The three counts:** each a glass card in its owner's colour: billing's accounts and the network's connection points in the business layer's yellow, with their owner marked in gold; the data team's own table in cyan, the technical side, with no owner.
- **The two 2025 reports and the minister's question:** what a meaning nobody owns costs: two numbers, and no answer in parliament.
- **Business objects:** a glass card with the name, what it is and its owner, as its owner defines it. The merged table's card says "owner: none" and "never confirmed by the business".
- **The wall:** paper notes are Tomás's drafts; glass in the layers' colours is the confirmed model.
- **BIZBOK's core and what's around it:** its four parts in the layers' colours, the parts around them, and what business architecture covers beyond data, faded; numbered badges mark which of the films to come draws on each part.
- **The data practice on the map:** the data team as a business actor, its services, tickets as their interface and the business objects, drawn on the business layer like any other part of the utility; the elements later films add show as dashed outlines until each one arrives.

## The look

*The map before the data*'s look, from `films/enterprise-architecture/shared/`: paper drafts on a wall, the confirmed model in glass, the six layers in their colours, and the same people at the same energy utility. The series' own components are in `../shared/src/ba.js`: the qanat in section, the village, the aerial view, the ticket, the counts and the data practice. In the desert, blue is the water, and the people of the story are silhouettes.

## Script

### 1 · Water under the desert · 0:00–1:43

Iran, at the edge of the desert. For more than two thousand years, villages here have lived on water that nobody sees.
It comes through a qanat: a tunnel dug from the foot of the mountains, which brings groundwater to the surface by gravity alone.
A line of shafts marks its path. They let the diggers in, and the earth out.
There's never enough water for every field at once. Each family's crop lives or dies by when the water reaches it.
And the tunnel is fragile. One cave-in can cut off a whole village.
People needed to know whose water it was, and who would keep it flowing.
So each part has its own people. The water belongs to its shareholders, in shares of time.
In one town, a share was ninety-six minutes of the flow, every twelve days.
A water master, the mirab, keeps the turns.
And the diggers, the muqannis, build and repair the tunnel. They're paid for the work. The water isn't theirs.
With each part in its own hands, the water has been shared this way for centuries, and the fields stay green.
In Gonabad, the Qasabeh qanat still flows, thirty-three kilometres long. In 2016, UNESCO listed eleven qanats as the Persian Qanat.
At the utility, the data team is the digger. It keeps the channel. The water, and what it means, belongs to the business.

*On screen:* the desert at dusk; the qanat cut away from the foot of the mountains to the village, its water running by gravity; the shafts lit, a windlass and a digger bringing earth up. The fields take turns at their gates. A cave-in stops the water and the village's channel runs dry; "whose water?" and "who keeps it flowing?" over the village. The shareholders by their fields ("the shareholders: own the water"), the bar of twelve days opening into fifteen shares, one of 96 minutes lit; the mirab at a gate; the diggers repairing the tunnel ("the muqannis: build and repair it") until the water runs again. Then the village from above, the line of shafts leading to it: "the data team: keeps the channel", "the business: the water, and what it means". The title: *What the business owns*, "and what the data team keeps for it".

### 2 · Tomás's map · 1:43–2:17

Tomás, the utility's enterprise architect, has drawn its map, layer by layer: why it exists, how it works, and what runs it.
This series looks at one part of it: what the business owns about its data.
It sits in three layers: the capabilities, in strategy; the work, in business; and the concepts the business uses, in the information layer.
The series after it take the map down to the data and the platform, and they start from here.

*On screen:* Tomás's map on the wall, its six layers as *The map before the data* left them; three of them lit, each with what it holds: capabilities, processes and roles, business objects. A bracket, "business architecture for data", then the series after it, *Data architecture* and *Platform and solution architecture*, down the layers below: "start from here".

### 3 · Three answers · 2:17–2:59

A ticket reaches the data team: all customers, by district, for the annual report.
There are three answers.
Billing has three hundred and ten thousand accounts.
The network has five hundred and forty thousand connection points.
And the data team's own customer table has three hundred and fifty-two thousand.
Last year, the annual report gave one number, and the regulator's return another.
In parliament, the minister was asked which was true, and couldn't say.
Each count is right about something. But which one is a customer?

*On screen:* the ticket, DATA-2041, "from Ama Owusu, regulatory lead". The three counts arrive one at a time: 310,000 accounts (billing), 540,000 connection points (network), 352,000 customers (the data team's table). The two 2025 reports with different numbers; in parliament, "Which number is true?", "no answer". Then "which one is a customer?".

### 4 · Whose meaning? · 2:59–3:53

The data team's first idea is to pick one, or to fix its own table until it's right.
Tomás asks who decided what that table counts.
An analyst built it three years ago, for a report due that week: one customer per address, with accounts and connection points merged.
Nobody in the business had said which customer the report meant, so someone had to choose.
But an account belongs to the head of retail: someone who pays a bill.
A connection point belongs to Grace, who runs the network: a place where power is delivered.
The merged table's meaning had no owner. Nobody in the business had ever confirmed it.
In the village, the diggers don't decide whose turn it is.

*On screen:* the camera glides on from the three counts. "pick one?", "fix our own table?", then Tomás's note: "who decided what it counts?". The table's card: "customers · built in 2023", "one customer per address", "accounts and connection points, merged", "the business's definition: none given", "someone had to choose". The two business objects, each as its owner defines it: account ("someone who pays a bill", head of retail) and connection point ("a place power is delivered", Grace, network), both confirmed; the merged table "never confirmed by the business", "owner: none". A small window onto the village: a digger keeps the channel; "whose turn: not the diggers' call".

### 5 · Who owns what · 3:53–4:28

So Tomás writes down who owns what.
The business owns what its data means, who creates it, the rules on it, the quality it needs, and the decisions it serves.
The data team owns how it's stored, moved and checked.
Like the shareholders and the diggers: one owns the water and its rules, the other keeps the channel.
Both matter. A channel nobody keeps silts up, and water nobody owns is fought over.

*On screen:* the wall: two columns of notes, "the business owns" (what its data means, who creates it, the rules on it, the quality it needs, the decisions it serves) in pink paper, and "the data team owns" (how it's stored, how it's moved, how it's checked); beside them, "the shareholders: the water and its rules" and "the diggers: the channel"; then "a channel nobody keeps silts up", "water nobody owns is fought over".

### 6 · Only what data needs · 4:28–5:11

Business architecture has many parts. The BIZBOK Guide puts four at its core: capabilities, value streams, information and the organisation.
Around them sit stakeholders, products, policies, initiatives and more.
It covers much more than data: products, partners, finance, how the organisation is designed.
These films take only what matters for data, and say so.
What the business needs to know. Who creates it, and who owns it. The processes it's born in. The rules and expectations on it.
One film each, in that order.

*On screen:* "the BIZBOK Guide · its core": capabilities, value streams, information and the organisation; around them stakeholders, products, policies, initiatives "and more"; further out, faded, partners, finance and organisation design. "What matters for data": the four films to come, *What the business needs to know*, *Who creates it, who owns it*, *Processes, as deep as data needs* and *Rules and expectations the business owns*, each with a numbered badge on the parts it draws on.

### 7 · The owners answer · 5:11–5:57

The ticket goes back with one question: which customers does the report mean?
Ama, who owns the utility's obligations, asked for it. She decides, with the two owners.
The report counts both, each by its own name: accounts, as retail defines them, and connection points, as the network does.
The data team builds both counts from those definitions, and tests them.
The merged table is retired. Its rule was never the business's.
Ama checks the counts before the ticket closes.
This year, the annual report and the regulator's return agree, and each number says what it counts.

*On screen:* the ticket's reply from the data team: "Which customers does the report mean?". Ama ("owns the utility's obligations", "asked for it") decides with Grace and the head of retail: "accounts, as retail defines them", "connection points, as the network does". The two counts "built from the owners' definitions, and tested"; the merged table stamped "retired", "never the business's". "checked by Ama" as the ticket closes. The two 2026 reports side by side, equal: "each number says what it counts".

### 8 · The data practice on the map · 5:57–6:32

One more thing goes on the map: the data practice itself, drawn like any part of the business.
The data team is a business actor. What it offers are business services, like answering data requests.
People reach that service through tickets: its interface.
Account and connection point are business objects. What they mean stays with their owners.
Film by film, the practice fills in: its glossary, its owners, its processes and its products.

*On screen:* "the data practice, on the map", on the business layer: the data team as a business actor, its business services, tickets as their interface, and the business objects Account and Connection point, joined to their owners by dashed lines of access; "what they mean stays with their owners". The parts later films add (its glossary, its owners, its processes, its products) wait as dashed outlines.

### 9 · The water and the channel · 6:32–6:59

In the village, the diggers keep the channel, and the shareholders decide whose water it is.
At the utility, the data team keeps the channel. What flows in it, and what it means, is the business's.
Tomás's next note asks what the business needs to know.

*On screen:* the village from above again: "the diggers: keep the channel", "the shareholders: whose water it is"; then the utility: "the data team: keeps the channel", "the business: what flows in it, and what it means". Tomás's next note on the wall: "What does the business need to know?". The end card: "The business owns what its data means. The data team keeps the channel." Film 1 of 5.

## Sound

The series' palette, which no film on the site plays: a consort of viols (every `score.py` on main and on every branch, read on 11 November 2026: no viol, no gamba). Each film takes its own members of the consort and its own partner sounds. This film's (`source/tools/score.py`):

- **The lead:** the bass viol and its consort, bowed gently, held steady, with no vibrato; chords tuned pure from D, so no two notes beat. It plays under the opening story, D major turning to B minor and F sharp minor where the water runs short and the tunnel caves in, and back to D as the water returns.
- **Its partner:** the same viol, plucked: the present at the utility, a chapter's chord as it turns and a note as something lands.
- **The mark:** D, then A, then the F sharp between them, held: the three layers this series covers, the business layer between the other two. Under the title, and again under the end card.
- **Its sounds:** the desert's wind; water in the tunnel and in the channel; earth as the diggers bring it up and as the tunnel caves in; a windlass's creak and a wooden gate; at the utility, paper, cards, keys and a pen.
- **Nothing borrowed:** no santur, tar, kamancheh, ney, daf or tombak, and no Persian mode.
- `tools/quiet.py` passes: after the opening, music 17% of the time, once every 11.3 s on average; its loud moments at -27.2 dB, its loudest notes at -25.2 dB, the effects' loud moments at -45.7 dB; 50 held notes, kept within 0.1 dB in the room.

## Pause and think

The film stops at the end of three chapters, one question each (`site/assets/what-the-business-owns/think.en.js` and `think.es.js`). The right answers sit in the third, first and second places, each question has a near miss, and every option is about as long as the others.

| Chapter | Question | Right | Near miss |
|---|---|---|---|
| *Whose meaning?* | The data team's own table counts 352,000 customers, one per address. Why doesn't the team just fix it until it's right? | Which customer the report means was never the team's to decide: the business owns each meaning, and must say. | Its rule is wrong: count billing's accounts instead. Still the team choosing a meaning. |
| *Who owns what* | Grace's network wants meter readings checked for gaps every night. Who decides how many gaps are too many, and who builds the check? | Grace's network sets the threshold; the data team builds the check and runs it. | The data team sets the threshold, since it runs the checks. Checks are the team's; the threshold isn't. |
| *The owners answer* | This year, the annual report and the regulator's return agree. What made them agree? | Each number now comes from a definition its owner gave, so both count the same things, and say which. | The data team picked the best of its three counts and used it in both. They'd agree, but on a meaning nobody owns. |

## Rigour

Checked on 11 and 12 November 2026.

| Claim | Source | Note |
|---|---|---|
| Villages in Iran have lived on qanat water for more than two thousand years | UNESCO, [*The Persian Qanat*](https://whc.unesco.org/en/list/1506) (2016); Wikipedia, [*Qanats of Ghasabeh*](https://en.wikipedia.org/wiki/Qanats_of_Ghasabeh) ("built between 700 and 500 BCE") | The oldest listed qanats are put at 2,500 to 2,700 years; "more than two thousand" stays inside both counts |
| A qanat is a tunnel from the foot of the mountains that brings groundwater to the surface by gravity; its shafts let the diggers in and the earth out | P. W. English, "Qanats and Lifeworlds in Iranian Plateau Villages", in *Transformations of Middle Eastern Natural Environments*, Yale F&ES Bulletin 103 (1998), pp. 187–205; Wikipedia, [*Qanat*](https://en.wikipedia.org/wiki/Qanat) | The shafts also bring air to the diggers; the film says only what it shows |
| There's never enough water for every field at once; a cave-in can cut off a village | English (1998): flash floods and cave-ins are frequent, and a damaged qanat is repaired by travelling diggers | Said in general, as English describes it; no named village |
| The water belongs to its shareholders, in shares of time | UNESCO: water distributed "according to specific cycles by the qanat council manager (mirab)", "traditionally using a water clock"; English (1998): shares (*sahms*) held, inherited and sold by named owners, as in the Vakilabad qanat's record | Share units vary by region: the film tells one town, as an example |
| In one town, a share was ninety-six minutes of the flow, every twelve days | English (1998), on Mahan, near Kerman: water from one of the town's four qanats "is divided into fifteen sahms ... on a twelve day rotation", "each sahm is equal to ninety-six minutes of water once every twelve days" | Fifteen shares of 96 minutes make one day of the twelve, as the film's bar draws it |
| A water master, the mirab, keeps the turns | UNESCO (above) | |
| The muqannis build and repair the tunnel; they're paid; the water isn't theirs | English (1998): "a hereditary class of professional qanat diggers called muqannis build and repair these systems"; "they are paid high wages"; they travel from settlement to settlement | That they own none of the water follows from their being paid specialists who move on, and from the shareholders' records; the series' plan states it, and no source says otherwise |
| The Qasabeh qanat at Gonabad still flows, thirty-three kilometres long | Wikipedia, *Qanats of Ghasabeh*: "427 water wells with a total length of 33,113 metres"; Tehran Times (August 2025): it still flows, at about 151 litres a second after dredging | Wikipedia's *Qanat* gives 45 km for the Gonabad system as a whole; the film gives the listed complex's length |
| In 2016, UNESCO listed eleven qanats as *The Persian Qanat* | UNESCO, *The Persian Qanat*, inscribed 2016 | Chosen from over 37,000 still in use |
| BIZBOK's core: capabilities, value streams, information and the organisation, with stakeholders, products, policies and initiatives around them | Business Architecture Guild, *A Guide to the Business Architecture Body of Knowledge* (BIZBOK Guide): the core and extended business architecture domains | "Information" is its information map, the business's concepts |
| The business owns meaning, rules and quality expectations; the data team owns storage, movement and checks | DAMA International, *DAMA-DMBOK*, 2nd edition, revised (2024): data ownership and stewardship, business accountability for data | The series' first insight (`../proposal.md`) |
| The data team as a business actor, its services as business services, tickets as their interface, account and connection point as business objects | The Open Group, ArchiMate 4 (April 2026): business actor, business service, business interface, business object | The series' plan for the data practice on the map |
| The utility's numbers: 310,000 accounts, 540,000 connection points, 352,000 in the merged table; the minister's question | Invented, as the series' world is; 310,000 and 540,000 are *Day one*'s | A connection point with no account (an empty home, street lighting) and an account with many connection points (a business with several sites) keep the two counts apart; a table merged by address lands between them |

No feature's release status is said or shown.

## Pacing report

`tools/pace.py`, 12 November 2026: 6:59 in nine chapters, 890 words, 127 words a minute, the voice 71% of the time.

| Chapter | Length | Words a minute | Voice | Longest quiet |
|---|---|---|---|---|
| Water under the desert | 1:43 | 134 | 73% | 7.0 s |
| Tomás's map | 0:34 | 137 | 74% | 2.3 s |
| Three answers | 0:42 | 123 | 68% | 1.8 s |
| Whose meaning? | 0:54 | 135 | 72% | 2.0 s |
| Who owns what | 0:35 | 125 | 65% | 4.2 s |
| Only what data needs | 0:43 | 117 | 74% | 1.8 s |
| The owners answer | 0:46 | 127 | 73% | 1.8 s |
| The data practice on the map | 0:35 | 124 | 73% | 1.8 s |
| The water and the channel | 0:27 | 103 | 54% | 7.8 s |

Every sentence has at least 0.5 s after it, and no chapter stops for 2.5 s or more inside it. The longest quiets are the opening's title and the end card, without words.
