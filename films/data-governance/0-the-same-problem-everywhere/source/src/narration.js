// The same problem, everywhere, the prologue to the data governance series. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"question":{"name":"One question","lead":1.6,"tail":1.0,"vo":[
 {"id":"autumn","gap":0.8,"text":"Autumn 2008.","say":"Autumn, two thousand and eight."},
 {"id":"ask","gap":0.8,"text":"As the financial crisis spreads, a bank's board asks its risk team one question: if another bank fails, how much do we stand to lose?"},
 {"id":"answer","gap":0.8,"text":"The answer is somewhere in the bank, in every business line, each with its own systems and its own names for the same customers."},
 {"id":"monday","gap":0.8,"text":"By Monday, nobody can add it up."},
 {"id":"one","gap":0.8,"text":"It wasn't just one bank."},
 {"id":"found","gap":0.8,"text":"The regulators later found that many banks couldn't add up their risks quickly or accurately."},
 {"id":"there","gap":0.8,"text":"The numbers were all there."},
 {"id":"trust","gap":0.8,"text":"Nobody could put them together, or say which to trust."}]},
"notnew":{"name":"Not a new problem","lead":1.2,"tail":1.0,"vo":[
 {"id":"either","gap":0.8,"text":"It wasn't a new problem, either."},
 {"id":"sharing","gap":0.8,"text":"In the 1970s, companies began sharing data between departments.","say":"In the nineteen seventies, companies began sharing data between departments."},
 {"id":"questions","gap":0.8,"text":"That raised new questions: who owns this data, and who may see it?"},
 {"id":"job","gap":0.8,"text":"A new job grew up to look after it: data administration, with a dictionary of what each piece of data meant."},
 {"id":"la","gap":0.8,"text":"In 1980, in Los Angeles, the people doing that job started meeting, to share what they'd learned.","say":"In nineteen eighty, in Los Angeles, the people doing that job started meeting, to share what they'd learned."},
 {"id":"chapters","gap":0.8,"text":"Their association, DAMA, soon had chapters in city after city."},
 {"id":"alone","gap":0.8,"text":"Every organisation had been learning the same lessons alone."},
 {"id":"together","gap":0.8,"text":"Now they could learn them together."}]},
"signs":{"name":"Someone signs","lead":1.2,"tail":1.0,"vo":[
 {"id":"law","gap":0.3,"text":"In 2002, after accounting scandals, a law in the United States made chief executives sign for their company's figures,","say":"In two thousand and two, after accounting scandals, a law in the United States made chief executives sign for their company's figures,"},
 {"id":"controls","gap":0.8,"text":"and answer for the controls behind them."},
 {"id":"top","gap":0.8,"text":"Someone at the top now answered for the numbers, and for how they were made."}]},
"written":{"name":"Written down","lead":1.2,"tail":1.0,"vo":[
 {"id":"dmbok","gap":0.8,"text":"In 2009, DAMA published what its members had learned, as a body of knowledge for data management: the DMBOK.","say":"In two thousand and nine, DAMA published what its members had learned, as a body of knowledge for data management: the DMBOK."},
 {"id":"wheel","gap":0.8,"text":"It draws the work as a wheel: architecture, modelling, security, quality, metadata, and more."},
 {"id":"hub","gap":0.8,"text":"At the centre, like a hub, is governance."},
 {"id":"decide","gap":0.8,"text":"The other areas only fit together, and stay in balance, when someone has the authority to decide."},
 {"id":"guides","gap":0.8,"text":"Other guides cover the same ground, or part of it."},
 {"id":"takes","gap":0.8,"text":"This series takes what they agree on, and shows it at work."}]},
"first":{"name":"Governance first","lead":1.2,"tail":1.0,"vo":[
 {"id":"principles","gap":0.8,"text":"After the crisis, the banks' regulators wrote principles for their data, and the first was governance: a condition for all the rest."},
 {"id":"own","gap":0.8,"text":"Someone had to own the bank's risk data, and answer for its quality."},
 {"id":"ten","gap":0.8,"text":"Ten years later, only two of thirty-one of the world's biggest banks met them all."},
 {"id":"programmes","gap":0.8,"text":"Their programmes were often underfunded, narrow, and short of attention from their boards."},
 {"id":"systems","gap":0.8,"text":"Making data add up takes more than systems."},
 {"id":"takes","gap":0.8,"text":"It takes decisions, money, and attention from the top."}]},
"should":{"name":"Should we?","lead":1.2,"tail":1.0,"vo":[
 {"id":"grew","gap":0.8,"text":"As data grew, so did the questions about how it's used."},
 {"id":"ethics","gap":0.8,"text":"In 2017, the DMBOK's second edition gave more room to ethics: not only whether we can use data, but whether we should.","say":"In twenty seventeen, the DMBOK's second edition gave more room to ethics: not only whether we can use data, but whether we should."},
 {"id":"law","gap":0.8,"text":"In 2018, a European law made organisations answer for the personal data they hold, and be able to prove it.","say":"In twenty eighteen, a European law made organisations answer for the personal data they hold, and be able to prove it."},
 {"id":"people","gap":0.8,"text":"Governing data now meant answering to the people it's about, too."}]},
"machines":{"name":"Machines that learn","lead":1.2,"tail":1.0,"vo":[
 {"id":"learn","gap":0.8,"text":"Now machines learn from data, whatever it teaches them."},
 {"id":"ask","gap":0.8,"text":"So the people training them have to ask: where did this data come from, and who decided we could use it?"},
 {"id":"revision","gap":0.8,"text":"In 2024, a revision of the DMBOK added governance and ethics for AI.","say":"In twenty twenty-four, a revision of the DMBOK added governance and ethics for AI."},
 {"id":"act","gap":0.8,"text":"The same year, Europe's law on AI asked for governance of the data that high-risk systems learn from."},
 {"id":"third","gap":0.8,"text":"And a third edition is being written, with new sections on AI governance, data ethics and sustainability."},
 {"id":"living","gap":0.8,"text":"Its makers call it a living body of knowledge."},
 {"id":"planned","gap":0.8,"text":"It's planned for 2027.","say":"It's planned for twenty twenty-seven."}]},
"centre":{"name":"Still at the centre","lead":1.2,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"So why does the DMBOK still matter today?"},
 {"id":"because","gap":0.8,"text":"Because the question it answers never changed."},
 {"id":"every","gap":0.8,"text":"In 1980, in 2008, and in every system that learns: who decides about this data, and who answers for it?","say":"In nineteen eighty, in two thousand and eight, and in every system that learns: who decides about this data, and who answers for it?"},
 {"id":"grows","gap":0.8,"text":"The book keeps growing, but governance stays at the centre."},
 {"id":"today","gap":0.8,"text":"Today, at a university, a new data governance lead is about to meet the same question."}]}
};
