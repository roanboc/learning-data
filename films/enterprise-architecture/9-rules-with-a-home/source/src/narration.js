// The map before the data · Rules with a home. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"tartu":{"name":"Once only","lead":1.4,"tail":1.0,"vo":[
 {"id":"born","gap":0.8,"text":"Tartu, Estonia, today. A baby is born, and the birth is entered once, in the population register."},
 {"id":"email","gap":0.8,"text":"Days later, the parents get an email from the Social Insurance Board. A family benefit is theirs, if they accept it."},
 {"id":"never","gap":0.8,"text":"They never applied."},
 {"id":"asks","gap":0.8,"text":"No office asks the parents again. Each one asks the population register, over X-Road, the exchange Estonia's public offices share."},
 {"id":"law","gap":0.8,"text":"By law, no office may build a second database of the same data, and every database is listed, with the office that owns it."},
 {"id":"link","gap":0.8,"text":"Each fact has one home and one owner. It's asked for once, and everyone who needs it asks there: once only."}]},
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
 {"id":"once","gap":0.8,"text":"He wants for rules what Tartu has for a birth: once only."}]},
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
"checks":{"name":"Written once, checked everywhere","lead":1.2,"tail":1.0,"vo":[
 {"id":"form","gap":0.8,"text":"Written in a set form, a rule says what it applies to, what must be true, its owner, its reason, its home, and what happens when it fails."},
 {"id":"gen","gap":0.8,"text":"Its checks are generated from it, one way: a dbt test, a data contract's quality rule, a shape for linked data."},
 {"id":"hand","gap":0.8,"text":"Nobody edits a check by hand."},
 {"id":"promise","gap":0.8,"text":"They check what the rule promises, not whether a job ran."},
 {"id":"first","gap":0.8,"text":"The first uncorrected bill would have shown up the morning after the move."},
 {"id":"team","gap":0.8,"text":"When a check fails, it tells the owner's team, not a mailbox."}]},
"onto":{"name":"Generally, an ontology","lead":1.0,"tail":1.0,"vo":[
 {"id":"onto","gap":0.8,"text":"Written like this, the concepts, how they relate, and the rules about them are, generally, an ontology."},
 {"id":"owl","gap":0.8,"text":"It's ready for OWL, a language machines reason with."},
 {"id":"views","gap":0.8,"text":"As the film Meaning machines can read shows, the glossary, the models, the ontology and the checks are all views of that one map."},
 {"id":"open","gap":0.8,"text":"But OWL reasons only from what is said. To it, a correction that never happened is simply unknown."},
 {"id":"job","gap":0.8,"text":"Finding the uncorrected bill stays the checks' job."}]},
"end":{"name":"Back in Tartu","lead":1.0,"tail":1.0,"vo":[
 {"id":"refund","gap":0.8,"text":"The household gets a hundred and forty-four dollars forty back, and the nineteen hundred bills are found and corrected."},
 {"id":"confirm","gap":0.8,"text":"Grace and the head of retail confirm their rules."},
 {"id":"tartu","gap":0.8,"text":"In Tartu, the benefit is paid, and nobody was asked twice."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer: each rule belongs in the map, written once, at the step where it applies."},
 {"id":"owner","gap":0.8,"text":"Each has an owner and a reason, and its checks are generated from it."},
 {"id":"next","gap":0.8,"text":"Rules hold while the organisation holds still. Next: when strategy moves."}]}
};
