// Business architecture for data · Rules with a home. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"book":{"name":"The book on qanats","lead":1.4,"tail":1.0,"vo":[
 {"id":"edge","gap":0.8,"text":"Khorasan, in the ninth century. Its towns and fields drank from qanats, tunnels that brought water from under the mountains."},
 {"id":"close","gap":0.8,"text":"A new tunnel dug too close to an old one could take its water, and leave a village's fields dry."},
 {"id":"court","gap":0.8,"text":"In Nishapur, people kept coming to the governor, Abdallah ibn Tahir, with disputes over qanats."},
 {"id":"books","gap":0.8,"text":"But the law books said nothing about qanats, so each dispute was argued with no rule to settle it."},
 {"id":"needed","gap":0.8,"text":"People needed to know the rules before they dug, not after a field went dry."},
 {"id":"gather","gap":0.8,"text":"So Abdallah gathered the legal scholars of Khorasan, and some from Iraq, to write the rules for qanats in one book."},
 {"id":"called","gap":0.8,"text":"It was called the Kitab-i Qani, the book on qanats."},
 {"id":"judged","gap":0.8,"text":"From then on, disputes were judged by what it said."},
 {"id":"later","gap":0.8,"text":"Two hundred years later, a historian wrote that qanats were still judged by that book."},
 {"id":"home","gap":0.8,"text":"The rules had one home, written once, and everyone who needed them knew where to look."}]},
"bill":{"name":"The bill from day one","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's note asks where each rule belongs. On day one, he was shown one: an estimated reading stands only until the next actual reading."},
 {"id":"flag","gap":0.8,"text":"Beside it was a bill, flagged wrong."},
 {"id":"away","gap":0.8,"text":"Farah brings the household behind that bill. In June, they were away for three weeks, and their smart meter stopped sending readings."},
 {"id":"est","gap":0.8,"text":"The bill estimated those weeks from last year: four hundred and twelve dollars eighty."},
 {"id":"stored","gap":0.8,"text":"When the meter came back, it sent the readings it had stored. They had used almost nothing."},
 {"id":"never","gap":0.8,"text":"The actual readings arrived. The bill was never corrected."}]},
"script":{"name":"A rule on the wall","lead":1.0,"tail":1.0,"vo":[
 {"id":"existed","gap":0.8,"text":"The rule existed. Years ago, an analyst in metering wrote a nightly script, as a stopgap."},
 {"id":"found","gap":0.8,"text":"It found estimates with an actual reading behind them, and queued their bills to be corrected."},
 {"id":"march","gap":0.8,"text":"In March, billing moved to a new system. The script kept writing to the old queue, which nothing reads now."},
 {"id":"clean","gap":0.8,"text":"It ran every night, reported no error, and corrected nothing: about nineteen hundred bills since March."},
 {"id":"wall","gap":0.8,"text":"It lived on the wall between the network and retail, and belonged to neither side."}]},
"five":{"name":"Five places, no home","lead":1.0,"tail":1.0,"vo":[
 {"id":"four","gap":0.8,"text":"Tomás finds the rule written four more ways."},
 {"id":"where","gap":0.8,"text":"In the regulator's retail code, the meter system's settings, the billing team's notes and the complaints team's spreadsheet."},
 {"id":"how","gap":0.8,"text":"The regulator's code says why. The others each say how, a little differently. None of them is its home."},
 {"id":"once","gap":0.8,"text":"He wants for rules what Khorasan had for qanats: one home, written once."}]},
"split":{"name":"Two rules, not one","lead":1.0,"tail":1.0,"vo":[
 {"id":"two","gap":0.8,"text":"Day one's rule is really two rules, one on each side of the wall."},
 {"id":"net","gap":0.8,"text":"The network's: an estimate is replaced when the actual reading arrives, and the replacement is sent to the retailer. Grace owns it."},
 {"id":"ret","gap":0.8,"text":"Retail's: a bill based on a replaced estimate is corrected on the next bill. The head of retail owns it."},
 {"id":"cross","gap":0.8,"text":"Between them, the replaced reading crosses the wall on the agreed list, where the script once reached across unseen."}]},
"why":{"name":"Where a rule comes from","lead":1.0,"tail":1.0,"vo":[
 {"id":"reason","gap":0.8,"text":"Each rule has a reason: a regulation, a principle, or the service level of the step it serves."},
 {"id":"these","gap":0.8,"text":"Grace's comes from the metering rules; retail's, from the regulator's retail code."},
 {"id":"safe","gap":0.8,"text":"A rule with no reason can't be changed safely. One with no owner can't be fixed."},
 {"id":"ama","gap":0.8,"text":"Ama corrects day one's draft too. Fair, accurate bills was never one of the utility's goals. It's an obligation, in the regulator's code."}]},
"about":{"name":"What a rule is about","lead":1.0,"tail":1.0,"vo":[
 {"id":"words","gap":0.8,"text":"A rule builds on facts, and facts on concepts."},
 {"id":"terms","gap":0.8,"text":"So it's written in the business's words, about what it governs: a reading, an estimate, a bill, a connection point."},
 {"id":"objects","gap":0.8,"text":"Each becomes a data object, in the domain that owns it: readings and connection points on the network's side, bills on retail's."},
 {"id":"cim","gap":0.8,"text":"The industry's model gives the starting words, such as usage point for a connection point."},
 {"id":"own","gap":0.8,"text":"The map keeps the utility's own words beside them."}]},
"expect":{"name":"What the process expects","lead":1.0,"tail":1.0,"vo":[
 {"id":"step","gap":0.8,"text":"Each rule is attached to its step in meter to cash: the network's to reading, retail's to billing."},
 {"id":"inside","gap":0.8,"text":"Attached, not inside: a rule isn't the process."},
 {"id":"time","gap":0.8,"text":"The step also says what to expect of the data. Timeliness, from its service level: an estimate replaced within two working days."},
 {"id":"comp","gap":0.8,"text":"Completeness, from its steps: every estimate replaced, or explained. Validity, from another rule: every reading marked actual or estimated."}]},
"std":{"name":"A rule in ArchiMate 4","lead":1.0,"tail":1.0,"vo":[
 {"id":"req","gap":0.8,"text":"In ArchiMate 4, the standard the map follows, a rule is a requirement, one of the motivation elements."},
 {"id":"sym","gap":0.8,"text":"The parallelogram on every rule card is the requirement's symbol."},
 {"id":"kinds","gap":0.8,"text":"ArchiMate has no element called a rule. The map makes data rules and business rules two kinds of requirement."},
 {"id":"drv","gap":0.8,"text":"Its reason is a driver, linked by an influence: for retail's rule, the regulator's retail code."},
 {"id":"real","gap":0.8,"text":"Its home is the step that applies it, linked by a realisation: billing, in meter to cash."},
 {"id":"assoc","gap":0.8,"text":"Its owner, and the data objects it applies to, are linked by an association."},
 {"id":"where","gap":0.8,"text":"ArchiMate says where a rule sits, not how it's checked. The checks come from the rule."}]},
"checks":{"name":"Test the data, track the business","lead":1.2,"tail":1.0,"vo":[
 {"id":"form","gap":0.8,"text":"Written in a set form, a rule says what it applies to, what must be true, its owner, its reason, its home, and what happens when it fails."},
 {"id":"data","gap":0.8,"text":"A rule about the data, such as every reading marked actual or estimated, gets tests: they check the data is right."},
 {"id":"gen","gap":0.8,"text":"They're generated from it, one way: a dbt test, a data contract's quality rule, a shape for linked data."},
 {"id":"hand","gap":0.8,"text":"Nobody edits a check by hand."},
 {"id":"biz","gap":0.8,"text":"Retail's rule is about what the business does: the data can all be right while a bill goes uncorrected."},
 {"id":"track","gap":0.8,"text":"So a tracking table is generated from it instead, listing every bill not corrected on the next bill."},
 {"id":"promise","gap":0.8,"text":"It tracks what the rule promises, not whether a job ran."},
 {"id":"first","gap":0.8,"text":"The first uncorrected bill would have been listed the morning after the move."},
 {"id":"team","gap":0.8,"text":"Each morning, the list goes to the owner's team, not a shared mailbox."}]},
"onto":{"name":"Generally, an ontology","lead":1.0,"tail":1.0,"vo":[
 {"id":"onto","gap":0.8,"text":"Written like this, the concepts, how they relate, and the rules about them are, generally, an ontology."},
 {"id":"owl","gap":0.8,"text":"It's ready for OWL, a language machines reason with."},
 {"id":"views","gap":0.8,"text":"As the film Meaning machines can read shows, the glossary, the models, the ontology and the checks are all views of that one map."},
 {"id":"open","gap":0.8,"text":"But OWL reasons only from what is said. To it, a correction that never happened is simply unknown."},
 {"id":"job","gap":0.8,"text":"Finding the uncorrected bill stays the tracking table's job."}]},
"end":{"name":"Back in Khorasan","lead":1.0,"tail":1.0,"vo":[
 {"id":"refund","gap":0.8,"text":"The household gets a hundred and forty-four dollars forty back, and the nineteen hundred bills are found and corrected."},
 {"id":"confirm","gap":0.8,"text":"Grace and the head of retail confirm their rules."},
 {"id":"book","gap":0.8,"text":"In Khorasan, whoever needed the rules on qanats looked in one book."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer: each rule belongs in the map, written once, at the step where it applies."},
 {"id":"owner","gap":0.8,"text":"Each has an owner and a reason, and its checks are generated from it."},
 {"id":"next","gap":0.8,"text":"Next: what the business expects of its data, written down by the people who own it."}]}
};
