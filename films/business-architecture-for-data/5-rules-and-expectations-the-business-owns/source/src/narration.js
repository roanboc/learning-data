// Business architecture for data · Rules and expectations the business owns. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. The words the voice respells (Tomás, qanat, Sehdeh, the hamlets, muqannis, mirab, BPMN, DMN) are
// in film.json's "say". The few longer stops are in breath.js.
const NARR={
"outlets":{"name":"Eight, eight and nine","lead":1.4,"tail":1.0,"vo":[
 {"id":"edge","gap":0.8,"text":"In the 1960s, at Sehdeh, in Iran, three hamlets took their water from one qanat: Dastgerd, Parvar and Karton."},
 {"id":"basin","gap":0.8,"text":"Its water ran into a basin, and out through three outlets, one to each hamlet."},
 {"id":"flow","gap":0.8,"text":"But a qanat's flow rises and falls with the water underground, and drought came about one year in four."},
 {"id":"more","gap":0.8,"text":"In a dry year, a hamlet that took more than its share would leave the others' fields dry."},
 {"id":"silt","gap":0.8,"text":"And every year, silt washed into the tunnel: a qanat nobody cleaned would choke, and dry up."},
 {"id":"needed","gap":0.8,"text":"Each hamlet needed its fair share, in a dry year as in a wet one, and the tunnel kept open."},
 {"id":"set","gap":0.8,"text":"In the 1600s, under Shah Abbas the Great, an engineer set their shares: eight, eight and nine."},
 {"id":"built","gap":0.8,"text":"And the shares were built into the outlets: eight spans wide, eight, and nine."},
 {"id":"same","gap":0.8,"text":"So whatever came into the basin, in a wet year or a dry one, left it in the same shares."},
 {"id":"clean","gap":0.8,"text":"Every year, the diggers, the muqannis, cleared the silt from the tunnel."},
 {"id":"mirab","gap":0.8,"text":"And the mirab, the water master, paid with a free share, saw that each farmer got their water at the proper time."},
 {"id":"held","gap":0.8,"text":"More than three hundred years on, the three hamlets still took the shares set for them."},
 {"id":"less","gap":0.8,"text":"In a dry year, each got less, but each still got its share."},
 {"id":"link","gap":0.8,"text":"At the utility, the data needs the same: what each step expects of it, written down by its owners, and checked."}]},
"note":{"name":"What the business expects","lead":1.4,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's next note asks what the business expects of each concept: the rules on it, and how good it must be."},
 {"id":"home","gap":0.8,"text":"Rules with a home gave every rule a home, an owner and a reason."},
 {"id":"now","gap":0.8,"text":"Now he asks where rules come from, and who says how good is good enough."}]},
"policy":{"name":"Policy, process, procedure","lead":0.8,"tail":0.8,"vo":[
 {"id":"policy","gap":0.8,"text":"A rule usually starts in a policy: what the business means to do."},
 {"id":"retail","gap":0.8,"text":"The head of retail's policy: bills use actual readings wherever they can."},
 {"id":"rules","gap":0.8,"text":"Rules make it checkable. A data rule: every reading is marked actual or estimated."},
 {"id":"brule","gap":0.8,"text":"A business rule: an estimate is replaced when the actual reading arrives."},
 {"id":"process","gap":0.8,"text":"Processes carry the policy out: check readings, and make bills."},
 {"id":"procedure","gap":0.8,"text":"A procedure says how a step is done, such as how to make an estimate."},
 {"id":"record","gap":0.8,"text":"And records show it was done: each reading's mark, and each bill's note of an estimate."},
 {"id":"iso","gap":0.8,"text":"Policy, process, procedure, record: it's the chain the ISO 9000 standards draw."}]},
"decide":{"name":"A decision, in a table","lead":0.8,"tail":0.8,"vo":[
 {"id":"decide","gap":0.8,"text":"Some steps decide. Check readings decides whether billing can use each reading."},
 {"id":"bpmn","gap":0.8,"text":"BPMN draws that as a step and its choice."},
 {"id":"dmn","gap":0.8,"text":"The rules it applies go beside it, in a decision table: DMN, a notation made for decisions."},
 {"id":"rows","gap":0.8,"text":"Each row is one rule: in range and no lower than the last, it's used; failed or missing, it's estimated."},
 {"id":"owns","gap":0.8,"text":"Grace's team owns the table, so a rule changes in the table, and the flow stays as it is."}]},
"late":{"name":"Late, for whom?","lead":0.8,"tail":0.8,"vo":[
 {"id":"fault","gap":0.8,"text":"In January, a fault held back the night's readings from two thousand six hundred meters."},
 {"id":"nine","gap":0.8,"text":"They arrived by nine. Billing had run at six, so those households got estimated bills."},
 {"id":"check","gap":0.8,"text":"The data team's check said all was well: it asked only that each reading arrive within a day."},
 {"id":"planning","gap":0.8,"text":"Network planning, which reads readings a week later, saw nothing wrong either."},
 {"id":"late","gap":0.8,"text":"So was the reading late? For billing, by three hours. For planning, not at all."},
 {"id":"rule","gap":0.8,"text":"A reading is late only against the step that needs it, and that step's service level."},
 {"id":"guess","gap":0.8,"text":"Billing's had never been written down, so the data team had guessed its own."}]},
"set":{"name":"Written down by its owners","lead":0.8,"tail":0.8,"vo":[
 {"id":"whose","gap":0.8,"text":"How good is good enough is the business's to say: the owner of the step that uses the data."},
 {"id":"ten","gap":0.8,"text":"The head of retail moves billing to ten, and writes down what billing needs."},
 {"id":"needs","gap":0.8,"text":"By ten on billing day, a reading or an estimate for every active meter, and no more than one in a hundred estimated."},
 {"id":"grace","gap":0.8,"text":"Grace, who owns readings, agrees to meet it."},
 {"id":"map","gap":0.8,"text":"It goes on the map beside check readings, with its owner and reason: billing's service level."},
 {"id":"sehdeh","gap":0.8,"text":"At Sehdeh, the shares were set first, and the outlets built to them."},
 {"id":"first","gap":0.8,"text":"Here too, the expectation comes first, and the check is built from it."}]},
"source":{"name":"Fixed at the source","lead":0.8,"tail":0.8,"vo":[
 {"id":"source","gap":0.8,"text":"The first check is the source's own: the meter system is accountable for its readings."},
 {"id":"checks","gap":0.8,"text":"It checks each one as it comes, makes the estimates, and reports what's missing by ten."},
 {"id":"reads","gap":0.8,"text":"The data platform only reads it and never writes back, so problems are fixed at the source, by its own team."},
 {"id":"only","gap":0.8,"text":"The data team builds a check only where the source can't."},
 {"id":"both","gap":0.8,"text":"A reading for every active account needs billing's accounts too, so that check runs on the platform, which reads both."},
 {"id":"lead","gap":0.8,"text":"Each billing morning, its result goes to the metering lead."}]},
"practice":{"name":"The data practice","lead":0.8,"tail":0.8,"vo":[
 {"id":"product","gap":0.8,"text":"On the data practice's map, the readings the data team publishes become a data product: Meter readings."},
 {"id":"bundle","gap":0.8,"text":"Drawn as an ArchiMate product, it bundles the service that provides it and its contract."},
 {"id":"contract","gap":0.8,"text":"Its contract holds what each of its readers expects, set by that reader's owner, and its checks are built from it."}]},
"end":{"name":"Kept, and changed","lead":0.8,"tail":0.8,"vo":[
 {"id":"held","gap":0.8,"text":"At Sehdeh, the shares held for more than three hundred years, while the outlets were kept and the tunnel cleaned."},
 {"id":"pumps","gap":0.8,"text":"But after the Second World War came deep wells with motor pumps, drawing water faster than rain put it back."},
 {"id":"half","gap":0.8,"text":"In the last fifty years, about half of Iran's qanats have run dry, from poor upkeep, or as wells lowered the water underground."},
 {"id":"keep","gap":0.8,"text":"Rules last only while people keep them, and change them when the world changes."},
 {"id":"utility","gap":0.8,"text":"At the utility, each expectation has an owner, who changes it when the business does."},
 {"id":"prices","gap":0.8,"text":"When prices change by the hour, billing will need a reading for every hour, and its check will follow."},
 {"id":"matures","gap":0.8,"text":"That's why the practice is never built once: it keeps maturing."},
 {"id":"next","gap":0.8,"text":"What the business owns about its data is drawn. Data architecture, the next series, starts from it."}]}
};
