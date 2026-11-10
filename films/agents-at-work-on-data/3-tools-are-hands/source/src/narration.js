// Tools are hands, and every hand is a permission: film 3 of 9 of Agents at work on data, the second series on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"rule":{"name":"The Bodleian's rule","lead":1.6,"tail":1.0,"vo":[
 {"id":"ox","gap":0.8,"text":"Oxford, in the 1400s.","say":"Oxford, in the fourteen hundreds."},
 {"id":"duke","gap":0.8,"text":"A duke gives the university his books, and scholars read them in a long room built to hold them."},
 {"id":"taken","gap":0.8,"text":"Then, in 1550, in years of religious upheaval, the books are taken away, sold or lost.","say":"Then, in fifteen fifty, in years of religious upheaval, the books are taken away, sold or lost."},
 {"id":"desks","gap":0.8,"text":"By 1556, even the desks are sold.","say":"By fifteen fifty-six, even the desks are sold."},
 {"id":"byhand","gap":0.8,"text":"Each had been copied by hand, and some had no other copy: once gone, gone for good."},
 {"id":"nolib","gap":0.8,"text":"For half a century, the university has no library."},
 {"id":"reach","gap":0.8,"text":"A library is only as safe as the hands that can reach it. Something has to change."},
 {"id":"bodley","gap":0.8,"text":"In 1598, Thomas Bodley, a retired diplomat, offers to restore it at his own cost, with seats, and shelves, and desks.","say":"In fifteen ninety-eight, Thomas Bodley, a retired diplomat, offers to restore it at his own cost, with seats, and shelves, and desks."},
 {"id":"opens","gap":0.8,"text":"It opens on the 8th of November, 1602, on one rule.","say":"It opens on the eighth of November, sixteen oh two, on one rule."},
 {"id":"rule1","gap":0.8,"text":"Read here. Take no book away."},
 {"id":"rule2","gap":0.8,"text":"Mark none: your notes go in your own book. And bring no flame."},
 {"id":"promise","gap":0.8,"text":"Every reader promises to keep it, and the books are chained to their shelves: read at the desk, and nowhere else."},
 {"id":"holds","gap":0.8,"text":"The rule holds, whoever asks."},
 {"id":"king","gap":0.8,"text":"In 1645, King Charles the First, at war and living in Oxford, asks to borrow a book.","say":"In sixteen forty-five, King Charles the First, at war and living in Oxford, asks to borrow a book."},
 {"id":"shows","gap":0.8,"text":"The librarian shows him the rule. The king agrees, and the book stays."},
 {"id":"still","gap":0.8,"text":"Four hundred years on, the books are still there for every reader, with more than 13 million printed items today.","say":"Four hundred years on, the books are still there for every reader, with more than thirteen million printed items today."},
 {"id":"sworn","gap":0.8,"text":"And every new reader still makes the promise."},
 {"id":"lib","gap":0.8,"text":"Jun's agent reads in a library too: the university's data. Every tool it's given is a hand."},
 {"id":"safe","gap":0.8,"text":"Give each hand only what its work needs, and the data stays safe, whoever asks."}
]},
"hands":{"name":"Every hand is a permission","lead":1.2,"tail":1.0,"vo":[
 {"id":"count","gap":0.8,"text":"Jun's agent works on the census-day count, the number the university reports to the government: 18,412 students.","say":"Jun's agent works on the census-day count, the number the university reports to the government: eighteen thousand, four hundred and twelve students."},
 {"id":"needs","gap":0.8,"text":"It reads tickets, the catalog and the team's docs, queries the data, and writes and builds code."},
 {"id":"server","gap":0.8,"text":"Each hand is a tool server: a small program that gives an agent its tools through an open standard, the Model Context Protocol."},
 {"id":"cando","gap":0.8,"text":"Whatever a tool can do, the agent can do."},
 {"id":"whoever","gap":0.8,"text":"And an agent works for whoever gives it words: a line hidden in what it reads, or a thief with its key."},
 {"id":"least","gap":0.8,"text":"So for each hand, ask for the least this job needs."},
 {"id":"since","gap":0.8,"text":"Security engineers have said it since 1975: the fewest rights the work needs.","say":"Security engineers have said it since nineteen seventy-five: the fewest rights the work needs."}
]},
"rights":{"name":"Rules ask, rights hold","lead":1.2,"tail":1.0,"vo":[
 {"id":"two","gap":0.8,"text":"Bodley's library kept its books two ways."},
 {"id":"chain","gap":0.8,"text":"The promise asked each reader. The chain held the book, whatever the reader meant."},
 {"id":"both","gap":0.8,"text":"An agent has both."},
 {"id":"file","gap":0.8,"text":"Its rules, in a file for agents, say: read, draft, never write to production."},
 {"id":"argue","gap":0.8,"text":"But rules are words, and words can be argued with, or hidden in a ticket."},
 {"id":"where","gap":0.8,"text":"So its rights are set where the data lives, on its own account: what a tool can't do, no instruction can make it."},
 {"id":"sam","gap":0.8,"text":"Sam, who runs the platform, sets up each hand with the team's rules for AI helpers."},
 {"id":"q1","gap":0.8,"text":"Its own identity, never a person's."},
 {"id":"q2","gap":0.8,"text":"Read only, unless the job needs to write."},
 {"id":"q3","gap":0.8,"text":"Writes only drafts, in a sandbox of its own."},
 {"id":"q4","gap":0.8,"text":"Counts and small samples, with names masked."},
 {"id":"q5","gap":0.8,"text":"And no way out: nothing it can send outside, and no way into production."}
]},
"six":{"name":"Six hands","lead":1.2,"tail":1.0,"vo":[
 {"id":"six","gap":0.8,"text":"So the census agent gets six hands."},
 {"id":"tickets","gap":0.8,"text":"Tickets: it reads the ticket it's given, and can't close or pass one on."},
 {"id":"catalog","gap":0.8,"text":"Catalog and Docs: it reads tables, owners, lineage, the glossary and the skills, and changes none of them."},
 {"id":"query","gap":0.8,"text":"Query: counts, and samples of at most 20 rows, with names masked. It reads the data where it lives.","say":"Query: counts, and samples of at most twenty rows, with names masked. It reads the data where it lives."},
 {"id":"repo","gap":0.8,"text":"Repository: it writes only to branches of its own, so every change arrives as a pull request."},
 {"id":"build","gap":0.8,"text":"And Build: it runs its drafts in its own sandbox, where nobody else reads."},
 {"id":"here","gap":0.8,"text":"Read here. Take nothing away. Mark nothing: write in your own book."},
 {"id":"flame","gap":0.8,"text":"And bring no flame: no hand can delete a table, send anything out, or touch production."}
]},
"prod":{"name":"Two people to production","lead":1.2,"tail":1.0,"vo":[
 {"id":"how","gap":0.8,"text":"So how does the agent's work ever reach the real count?"},
 {"id":"people","gap":0.8,"text":"Through people, always two."},
 {"id":"pr","gap":0.8,"text":"The agent opens a pull request, with the query behind every claim and the result it gave."},
 {"id":"review","gap":0.8,"text":"Jun reviews it. Noor approves it for production."},
 {"id":"live","gap":0.8,"text":"Then the team's release puts it live. The agent's hands never touch it."},
 {"id":"anyone","gap":0.8,"text":"Two people, for an agent's change as for anyone's."}
]},
"line":{"name":"A line nobody could see","lead":1.2,"tail":1.0,"vo":[
 {"id":"monday","gap":0.8,"text":"One Monday, Clara, in Planning, asks for the census-day count by faculty, for the board."},
 {"id":"pastes","gap":0.8,"text":"She pastes in the email from outside the university that asked her for it."},
 {"id":"white","gap":0.8,"text":"At its foot, in white letters on white, is a line no person would see."},
 {"id":"says","gap":0.8,"text":"It tells any AI assistant to send the full student list, with names, to an outside address, and not to mention it."},
 {"id":"every","gap":0.8,"text":"The agent reads every word, the white ones too."},
 {"id":"data","gap":0.8,"text":"But its rules say that what it reads is data, never orders."},
 {"id":"tells","gap":0.8,"text":"So it does the count, and tells Jun about the line, quoting it."},
 {"id":"couldnt","gap":0.8,"text":"And had it obeyed, its hands couldn't: names come masked, and no hand sends anything out."},
 {"id":"three","gap":0.8,"text":"Three things together make a leak, a security writer says: private data, words from strangers, and a way out."},
 {"id":"two","gap":0.8,"text":"Tickets always bring strangers' words, so the team took away the other two."},
 {"id":"sam","gap":0.8,"text":"Jun passes it to Sam, who checks: nothing left the university."}
]},
"shelves":{"name":"Still on the shelves","lead":1.2,"tail":1.0,"vo":[
 {"id":"board","gap":0.8,"text":"Clara's count goes to the board: 18,412 students, by faculty, each number with its evidence.","say":"Clara's count goes to the board: eighteen thousand, four hundred and twelve students, by faculty, each number with its evidence."},
 {"id":"nothing","gap":0.8,"text":"Nothing left the university, and nothing changed without two people."},
 {"id":"held","gap":0.8,"text":"In 1645, the rule held, even for a king. The agent's rights hold the same way, whoever writes the words.","say":"In sixteen forty-five, the rule held, even for a king. The agent's rights hold the same way, whoever writes the words."},
 {"id":"books","gap":0.8,"text":"Bodley's books are still on their shelves."},
 {"id":"default","gap":0.8,"text":"Read-only by default. Write only drafts, somewhere safe."},
 {"id":"belongs","gap":0.8,"text":"Then a team can give its agent the whole library to read, and the data stays where it belongs."}
]}
};
