// Data architecture · One language, kept. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"same":{"name":"The same words","lead":1.4,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"By 1972, factories across Chile sent their numbers to Cybersyn's team in Santiago by telex, once a day.","say":"By nineteen seventy-two, factories across Chile sent their numbers to Cybersyn's team in Santiago by telex, once a day."},
 {"id":"same","gap":0.8,"text":"But one factory's number means nothing beside another's, unless both are measured the same way."},
 {"id":"absent","gap":0.8,"text":"Count workers absent one way in one factory and another way in the next, and a factory in trouble could look like the rest."},
 {"id":"needed","gap":0.8,"text":"Santiago needed every factory's words to mean the same, or it couldn't compare them, or add them up."},
 {"id":"unease","gap":0.8,"text":"So in every factory's model, social unease would be measured one way: the share of the workers on its payroll absent that day."},
 {"id":"icons","gap":0.8,"text":"And the operations room would show every factory with the same icons, so anyone could read them without training in science."},
 {"id":"report","gap":0.8,"text":"After the strike of October 1972, numbers from across the country went into one report, written every day at CORFO.","say":"After the strike of October nineteen seventy-two, numbers from across the country went into one report, written every day at CORFO."},
 {"id":"days","gap":0.8,"text":"Taken by hand to the presidential palace, it showed national production and the points of crisis, from numbers a few days old, not six months."},
 {"id":"utility","gap":0.8,"text":"At the utility, a new team building the home energy app opens a change: its first table, called customer."},
 {"id":"fourth","gap":0.8,"text":"Customer already means three things here. This would be a fourth: whoever signs in to the app."},
 {"id":"caught","gap":0.8,"text":"The review catches it before it reaches a table, from what the data architecture keeps."}]},
"fourth":{"name":"A fourth meaning","lead":1.0,"tail":1.0,"vo":[
 {"id":"signs","gap":0.8,"text":"The app's table holds everyone who signs in: an account holder, but also a partner, a tenant, a grown-up child."},
 {"id":"read","gap":0.8,"text":"Called just customer, anyone reading it would take it for one of the other three."},
 {"id":"storm","gap":0.8,"text":"The last time one thing had six names, the January storm's texts missed 180 households.","say":"The last time one thing had six names, the January storm's texts missed one hundred and eighty households."},
 {"id":"flag","gap":0.8,"text":"So the review flags it: customer has three meanings here, and a table can't be called just that."},
 {"id":"keeps","gap":0.8,"text":"It reads what the data architecture keeps in the repository, with the map: names, a reference model, principles and decisions."}]},
"names":{"name":"Names with parts","lead":1.0,"tail":1.0,"vo":[
 {"id":"parts","gap":0.8,"text":"Each name is built from parts, as an international standard for naming data suggests."},
 {"id":"thing","gap":0.8,"text":"First, the thing it's about, in the glossary's words: account holder."},
 {"id":"about","gap":0.8,"text":"Then, what about it: start."},
 {"id":"kind","gap":0.8,"text":"Last, the kind of value, from a short list: a date. Account holder start date."},
 {"id":"once","gap":0.8,"text":"As with social unease, each term is defined once, and every system uses it the same way."},
 {"id":"never","gap":0.8,"text":"A word with more than one meaning here, like customer, is never a name on its own."},
 {"id":"old","gap":0.8,"text":"Older systems keep their own names, each mapped once to the glossary's: billing's premise is a connection point."}]},
"model":{"name":"The industry's words","lead":1.0,"tail":1.0,"vo":[
 {"id":"industry","gap":0.8,"text":"For much of this, the industry already has words: the Common Information Model, a reference model for electricity, from the IEC.","say":"For much of this, the industry already has words: the Common Information Model, a reference model for electricity, from the I E C."},
 {"id":"usage","gap":0.8,"text":"It calls the point where power is delivered a usage point, and the premises a service location."},
 {"id":"party","gap":0.8,"text":"Whoever receives the service is a customer, with a customer account for billing."},
 {"id":"map","gap":0.8,"text":"The utility keeps its own words, and maps each to the model: a connection point to a usage point, an account holder to a customer."},
 {"id":"why","gap":0.8,"text":"So a new system or a partner can be matched to the utility's words through words they already know."},
 {"id":"none","gap":0.8,"text":"Whoever signs in to the app is none of the three: a new concept, which needs its own name and an owner."}]},
"principles":{"name":"A few principles","lead":1.0,"tail":1.0,"vo":[
 {"id":"few","gap":0.8,"text":"Then, a few principles: each a short rule, with why it holds and what follows from it."},
 {"id":"name","gap":0.8,"text":"One concept, one name, from the glossary: six names for one thing left 180 households without a text.","say":"One concept, one name, from the glossary: six names for one thing left one hundred and eighty households without a text."},
 {"id":"home","gap":0.8,"text":"Each fact has one home, and every copy traces back to it."},
 {"id":"flow","gap":0.8,"text":"Data crosses a domain's edge only by a published flow, with its contract."},
 {"id":"product","gap":0.8,"text":"And every table belongs to a data product, owned by the business that creates its data."}]},
"decisions":{"name":"Decisions, written down","lead":1.0,"tail":1.0,"vo":[
 {"id":"record","gap":0.8,"text":"Each decision is written down beside the map: what was decided and why, what else was considered, who decided, and when."},
 {"id":"seven","gap":0.8,"text":"Decision seven: customer is never a name on its own. Grace, the head of retail and Ama decided it on 14 October.","say":"Decision seven: customer is never a name on its own. Grace, the head of retail and Ama decided it on the fourteenth of October."},
 {"id":"why","gap":0.8,"text":"Why: here customer means three things, and a table called just that would be read as any of them."},
 {"id":"else","gap":0.8,"text":"Considered, and turned down: one definition of customer for everyone. It would fit neither side."},
 {"id":"follows","gap":0.8,"text":"What follows: every name says which: account holder, connection point or contact."},
 {"id":"outlives","gap":0.8,"text":"A record outlives the meeting and the people in it: the next team can read why, not only what."}]},
"kept":{"name":"Kept with every change","lead":1.0,"tail":1.0,"vo":[
 {"id":"every","gap":0.8,"text":"All of it is kept with the map, and every change is checked against it before it's made."},
 {"id":"team","gap":0.8,"text":"The data team reviews the app team's change. What a new term means isn't theirs to decide."},
 {"id":"ticket","gap":0.8,"text":"So the app team asks retail, in a ticket, and the head of retail defines the term in the glossary first."},
 {"id":"term","gap":0.8,"text":"App user: a person who signs in to the app for an account."},
 {"id":"built","gap":0.8,"text":"Then the table is built from it: app user, with the account each one acts for. The check passes, and so does the review."},
 {"id":"map","gap":0.8,"text":"On the map, app user joins retail's concepts, with its owner and a link to decision seven."}]},
"back":{"name":"Never finished","lead":1.0,"tail":1.0,"vo":[
 {"id":"chile","gap":0.8,"text":"By May 1973, Cybersyn reached a quarter of the nationalised industries, more than a hundred, with half their revenue.","say":"By May nineteen seventy-three, Cybersyn reached a quarter of the nationalised industries, more than a hundred, with half their revenue."},
 {"id":"never","gap":0.8,"text":"It never ran as designed. The operations room could do very little, and the simulator never left the experimental stage."},
 {"id":"telex","gap":0.8,"text":"Only the telex network was used regularly."},
 {"id":"model","gap":0.8,"text":"Beer later wrote that the model couldn't adequately represent the changes of those years."},
 {"id":"coup","gap":0.8,"text":"On 11 September 1973, a military coup ended Allende's government. Later, the operations room was dismantled.","say":"On the eleventh of September, nineteen seventy-three, a military coup ended Allende's government. Later, the operations room was dismantled."},
 {"id":"papers","gap":0.8,"text":"On the day of the coup, members of the team carried copies of its documents out of CORFO, to keep them for the future."},
 {"id":"held","gap":0.8,"text":"The ideas held. The practice never had time to mature."},
 {"id":"utility","gap":0.8,"text":"At the utility, the data architecture is never finished either: it matures one change at a time."},
 {"id":"year","gap":0.8,"text":"In its first year, the review stopped nine names before they reached a table, and fourteen decisions were written down."}]}
};
