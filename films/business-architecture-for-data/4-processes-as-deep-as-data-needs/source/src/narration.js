// Business architecture for data · Processes, as deep as data needs. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. The words the voice respells (Tomás, qanat, SIPOC, APQC, BPMN) are in film.json's "say".
// The few longer stops are in breath.js.
const NARR={
"turns":{"name":"A cycle of turns","lead":1.4,"tail":1.0,"vo":[
 {"id":"edge","gap":0.8,"text":"In the twentieth century, at Mahan, near Kerman, the water of a qanat, a tunnel from the mountains, came round to each owner in turn."},
 {"id":"cycle","gap":0.8,"text":"On one of its four qanats, the turns made a cycle of twelve days, and each day was fifteen shares of time."},
 {"id":"complex","gap":0.8,"text":"Most were more complex: on another, the water passed twelve dividers, each sending it to certain fields at certain times."},
 {"id":"missed","gap":0.8,"text":"A turn missed, or cut short, could leave a field dry until the cycle came round again."},
 {"id":"lots","gap":0.8,"text":"Where water was short and turns were disputed, some small villages drew lots each autumn for their place in the cycle."},
 {"id":"last","gap":0.8,"text":"Those near the end of it usually got none."},
 {"id":"needed","gap":0.8,"text":"Every owner needed to know when their water would come, and when it would stop."},
 {"id":"levels","gap":0.8,"text":"So the cycle was kept in levels: its days, each day's shares, and each share in six parts of sixteen minutes."},
 {"id":"minutes","gap":0.8,"text":"Where a share had been split among heirs and buyers, it went down to single minutes."},
 {"id":"clock","gap":0.8,"text":"The mirab, the water master, timed each turn with a water clock: a metal cup with a hole in its base, floating in water."},
 {"id":"sank","gap":0.8,"text":"Each time it filled and sank, one measure of time had passed."},
 {"id":"knew","gap":0.8,"text":"So each owner knew when their water would come and when it would stop, down to a single minute in twelve days."},
 {"id":"deep","gap":0.8,"text":"And the cycle went only as deep as each owner's share needed."},
 {"id":"link","gap":0.8,"text":"At the utility, the business's work needs the same: its processes drawn in levels, and only as deep as each one needs."}]},
"note":{"name":"Where it's born","lead":1.0,"tail":0.8,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's next note asks where each concept is born: in which process, and at which step."},
 {"id":"matrix","gap":0.8,"text":"His matrix says which capability creates each one, but a capability is what the utility can do, not how the work runs."},
 {"id":"process","gap":0.8,"text":"For that, he needs the processes."}]},
"bands":{"name":"Four bands","lead":0.8,"tail":0.8,"vo":[
 {"id":"map","gap":0.8,"text":"Grace's process map sorts the utility's processes into four bands: strategic, operational, support and evaluation."},
 {"id":"sort","gap":0.8,"text":"The bands only sort them. They aren't elements of the model."},
 {"id":"ops","gap":0.8,"text":"The operational band holds the work customers feel: connecting a home, restoring supply, and meter to cash."},
 {"id":"empty","gap":0.8,"text":"If a band were empty, that would be a finding in itself: nobody setting direction, or nobody measuring."},
 {"id":"one","gap":0.8,"text":"These thirteen are level one, the macro processes: eight to fifteen, for a whole organisation."}]},
"levels":{"name":"Levels, and how deep","lead":0.8,"tail":0.8,"vo":[
 {"id":"two","gap":0.8,"text":"Level two is a process with a trigger, an output and one person accountable, three to eight under each macro process."},
 {"id":"three","gap":0.8,"text":"Level three is its activities, drawn as a flow. Level four, each task, stays out of the model."},
 {"id":"apqc","gap":0.8,"text":"These levels are drawn from APQC's process framework, which has a version for utilities."},
 {"id":"breadth","gap":0.8,"text":"Breadth first: levels one and two, everywhere."},
 {"id":"pain","gap":0.8,"text":"Depth only on pain: level three only where someone can name what hurts."},
 {"id":"says","gap":0.8,"text":"And the map says which branches weren't drawn deeper, so nobody thinks they were."},
 {"id":"mahan","gap":0.8,"text":"As in Mahan: days and shares everywhere, and minutes only where a share is split."}]},
"cash":{"name":"Meter to cash","lead":0.8,"tail":0.8,"vo":[
 {"id":"m2c","gap":0.8,"text":"Meter to cash is one macro process: from a meter's reading to a paid bill."},
 {"id":"five","gap":0.8,"text":"At level two, it has five processes: read meters, check readings, make bills, collect payments, and answer billing questions."},
 {"id":"sipoc","gap":0.8,"text":"Each gets a SIPOC: who supplies it, what comes in, what goes out and to whom, with its trigger and its owner."},
 {"id":"objects","gap":0.8,"text":"What comes in and goes out are concepts from the map: readings, accounts and bills."},
 {"id":"born","gap":0.8,"text":"A concept is born in the process that first writes it: readings in reading meters, bills in making bills."},
 {"id":"missing","gap":0.8,"text":"And one wasn't on the map yet: the payment, born in collecting payments."}]},
"pain":{"name":"Where it hurts","lead":0.8,"tail":0.8,"vo":[
 {"id":"one","gap":0.8,"text":"Only one branch needs more."},
 {"id":"farah","gap":0.8,"text":"Last winter, complaints about bills doubled. Reading them, Farah found two in three were about estimated bills."},
 {"id":"nightly","gap":0.8,"text":"Most meters send a reading every night. When one doesn't, or its reading fails a check, the bill uses an estimate."},
 {"id":"weeks","gap":0.8,"text":"Some meters had stopped sending for weeks, so their households got estimate after estimate, then a bill that caught up all at once."},
 {"id":"deeper","gap":0.8,"text":"So check readings goes to level three, drawn in BPMN, the notation for steps, their order and the choices between them."}]},
"flow":{"name":"Level three","lead":0.8,"tail":0.8,"vo":[
 {"id":"gather","gap":0.8,"text":"On each billing day, every reading is checked: is it in range, and no lower than the last?"},
 {"id":"pass","gap":0.8,"text":"If it passes, it goes to billing."},
 {"id":"fail","gap":0.8,"text":"If it fails, or never came, an estimate is made from the same month last year, and goes to billing in its place."},
 {"id":"sees","gap":0.8,"text":"Level three shows what level two couldn't: a second kind of reading is born here, in this step, not at the meter."},
 {"id":"same","gap":0.8,"text":"But the data team's tables took readings from the meters, so Farah couldn't see a single estimate in them."},
 {"id":"grace","gap":0.8,"text":"Grace, who owns readings, decides a reading is what the check sends on, read from the meter or estimated."},
 {"id":"retail","gap":0.8,"text":"The head of retail decides each bill says if it used an estimate, and a ticket asks the data team to take readings from the check."},
 {"id":"farah","gap":0.8,"text":"Now Farah can see which households have had estimates, and for how long."}]},
"practice":{"name":"The data practice","lead":0.8,"tail":0.8,"vo":[
 {"id":"joins","gap":0.8,"text":"On the data practice's map, the data team's own processes join: answering a data request, building a data product, taking on a source."},
 {"id":"same","gap":0.8,"text":"Each is drawn like the utility's, at level two, with its trigger, its output, its owner, and what it reads and writes."},
 {"id":"none","gap":0.8,"text":"None goes deeper until something hurts."}]},
"end":{"name":"As deep as it needs","lead":1.0,"tail":1.0,"vo":[
 {"id":"village","gap":0.8,"text":"On a qanat, the cycle went down to the minute only where a share was split, and every owner knew when their water would come."},
 {"id":"utility","gap":0.8,"text":"At the utility, every process is drawn to level two, and only the branch that hurt goes deeper, to where an estimate is born."},
 {"id":"next","gap":0.8,"text":"Tomás's next note asks what the business expects of each concept: the rules on it, and how good it must be."}]}
};
