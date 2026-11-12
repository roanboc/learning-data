// Business architecture for data · What the business needs to know. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"shares":{"name":"A share of water","lead":1.4,"tail":1.0,"vo":[
 {"id":"edge","gap":0.8,"text":"In the desert villages of Iran, the water of a qanat, a tunnel from the mountains, is owned in shares of time."},
 {"id":"sold","gap":0.8,"text":"A share can be sold, split, or left to your children."},
 {"id":"same","gap":0.8,"text":"But a share didn't mean the same everywhere."},
 {"id":"turns","gap":0.8,"text":"On one qanat, the water came round every six days. On another, every twenty-two."},
 {"id":"deeds","gap":0.8,"text":"In the 1960s, as land passed to the farmers who worked it, the government asked for written deeds to the water.","say":"In the nineteen sixties, as land passed to the farmers who worked it, the government asked for written deeds to the water."},
 {"id":"added","gap":0.8,"text":"In some villages, the deeds added up to more than twenty-four hours of water a day."},
 {"id":"fought","gap":0.8,"text":"Owners fought, sometimes violently, and some villages broke apart."},
 {"id":"needed","gap":0.8,"text":"Before anyone could count the water, a share had to mean the same to everyone who held one."},
 {"id":"mahan","gap":0.8,"text":"In Mahan, near Kerman, one qanat's owners measured every share against the day itself."},
 {"id":"fifteen","gap":0.8,"text":"A day of its water was fifteen shares, and each share came round every twelve days."},
 {"id":"adds","gap":0.8,"text":"Each share was ninety-six minutes, so fifteen make exactly one day: the shares add up to the water."},
 {"id":"seventy","gap":0.8,"text":"Another qanat there, shared by three men in the 1860s, passed bit by bit to some seventy families.","say":"Another qanat there, shared by three men in the eighteen sixties, passed bit by bit to some seventy families."},
 {"id":"meant","gap":0.8,"text":"Because a share meant one thing, it could be sold, inherited, split as fine as thirty seconds, and still add up."},
 {"id":"link","gap":0.8,"text":"At the utility, the business needs the same: each thing it counts, defined once, in its own words, before anyone builds it."}]},
"note":{"name":"Tomás's next note","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's next note asks what the business needs to know."},
 {"id":"caps","gap":0.8,"text":"He starts from the capabilities on his map: the eight things the utility must be able to do."},
 {"id":"each","gap":0.8,"text":"Each one needs some information, creates some, or changes it."},
 {"id":"concepts","gap":0.8,"text":"Those are the business's concepts. They go in the information layer, beneath the capabilities that use them."}]},
"blank":{"name":"Never a blank page","lead":1.0,"tail":1.0,"vo":[
 {"id":"blank","gap":0.8,"text":"He doesn't start from a blank page."},
 {"id":"models","gap":0.8,"text":"Utilities share reference models, written by their industry's standards bodies."},
 {"id":"iec","gap":0.8,"text":"The IEC, which sets the world's electrical standards, keeps the Common Information Model, CIM."},
 {"id":"cim","gap":0.8,"text":"It names what a utility works with, from its cables and meters to its customers, and how they relate."},
 {"id":"irm","gap":0.8,"text":"One of its standards lists what a distribution utility does, and the business objects each part uses."},
 {"id":"arch","gap":0.8,"text":"Its 2020 edition draws them in ArchiMate, the language of Tomás's map.","say":"Its twenty twenty edition draws them in ArchiMate, the language of Tomás's map."},
 {"id":"sgam","gap":0.8,"text":"The Smart Grid Architecture Model shows where each part sits, from the power station to the home."},
 {"id":"roles","gap":0.8,"text":"And Europe's market role model names who does what in the electricity market."},
 {"id":"others","gap":0.8,"text":"Other industries have their own, from BIAN for banks to HERM for universities."},
 {"id":"first","gap":0.8,"text":"Tomás takes CIM and the IEC's list as his first draft, and the map says where each element came from."},
 {"id":"draft","gap":0.8,"text":"A reference model isn't the utility's own until its people confirm it, so every element starts as a draft."}]},
"needs":{"name":"What each capability needs","lead":1.0,"tail":1.0,"vo":[
 {"id":"through","gap":0.8,"text":"He goes through the capabilities one at a time, with the people who run each one."},
 {"id":"connect","gap":0.8,"text":"Connecting customers needs a connection request, the network's capacity, a connection point and a meter."},
 {"id":"serve","gap":0.8,"text":"Serving customers needs accounts, bills and complaints."},
 {"id":"operate","gap":0.8,"text":"Operating the network needs meter readings and outages."},
 {"id":"creates","gap":0.8,"text":"Some of these a capability creates; others it only reads."},
 {"id":"most","gap":0.8,"text":"Most of them, CIM already names, so the first draft comes quickly."}]},
"words":{"name":"In the business's words","lead":1.0,"tail":1.0,"vo":[
 {"id":"but","gap":0.8,"text":"But CIM's words aren't always the utility's."},
 {"id":"usage","gap":0.8,"text":"CIM calls a connection point a usage point. Europe's market role model calls it a metering point."},
 {"id":"grace","gap":0.8,"text":"Grace's people call it a connection point, and so do their forms, their reports and their customers."},
 {"id":"map","gap":0.8,"text":"So the map uses the business's word, and keeps the reference model's beside it, for when data is exchanged."},
 {"id":"mahan","gap":0.8,"text":"As in Mahan, the measure is shared, and the words are the people's own."},
 {"id":"one","gap":0.8,"text":"Each word gets one definition in its domain, written with the people who use it."},
 {"id":"domains","gap":0.8,"text":"The network's words sit with the network, and retail's with retail."},
 {"id":"shared","gap":0.8,"text":"A word both use, like location, sits in a shared domain, so each word's owner is easy to find."}]},
"missing":{"name":"A concept nobody holds","lead":1.0,"tail":1.0,"vo":[
 {"id":"hurts","gap":0.8,"text":"Then the capability that hurts: connecting customers. New solar takes thirty-four working days to connect."},
 {"id":"wait","gap":0.8,"text":"The wait is in assessing the network's capacity, and that needs one number: how much solar each street can take."},
 {"id":"nobody","gap":0.8,"text":"No system holds it, no report shows it, and nobody owns it."},
 {"id":"name","gap":0.8,"text":"Grace's engineers name it hosting capacity: the solar a street can take before its voltage or its cables pass their limits."},
 {"id":"owner","gap":0.8,"text":"It goes on the map in their words, with Grace as its owner, and no data yet."},
 {"id":"first","gap":0.8,"text":"The data team will build it later. First, the business says what it means."}]},
"glossary":{"name":"A glossary from the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"object","gap":0.8,"text":"Each concept on the map is a business object, with a name, a definition, a domain and an owner."},
 {"id":"drawn","gap":0.8,"text":"The glossary is drawn from them: one term for each, grouped by domain."},
 {"id":"tool","gap":0.8,"text":"It doesn't need a tool to start. A table is enough, as long as every term has an owner."},
 {"id":"point","gap":0.8,"text":"Later, each table and report the data team builds will point to the terms it holds."}]},
"practice":{"name":"The data practice on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"domains","gap":0.8,"text":"On the data practice's map, the glossary's domains appear: the network, retail, and what they share."},
 {"id":"join","gap":0.8,"text":"Meter readings and hosting capacity join the network, and bills join retail. Location sits in the shared domain."},
 {"id":"already","gap":0.8,"text":"The connection point and the account were already there. Now each sits in its domain, with its owner."}]},
"end":{"name":"One meaning, everywhere","lead":1.0,"tail":1.0,"vo":[
 {"id":"village","gap":0.8,"text":"In Mahan, a share means the same to everyone who holds one, so the water can be counted, and shared."},
 {"id":"utility","gap":0.8,"text":"At the utility, each concept now means one thing in its domain, in the words of the people who use it."},
 {"id":"next","gap":0.8,"text":"Tomás's next note asks who creates each one, and who owns it."}]}
};
