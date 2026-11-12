// Platform and solution architecture · Inside the platform. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"road":{"name":"The hardest stage","lead":1.4,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"Japan, the early 1600s. The Tōkaidō runs from Edo to Kyoto, with a station about every ten kilometres.","say":"Japan, the early sixteen hundreds. The Tōkaidō runs from Edo to Kyoto, with a station about every ten kilometres."},
 {"id":"parts","gap":0.8,"text":"Each station has the same parts: an office that finds horses and porters, and a clerk who writes each one down."},
 {"id":"inns","gap":0.8,"text":"Inns, for every traveller, from lords to pilgrims."},
 {"id":"stage","gap":0.8,"text":"And each load goes one stage, to the next station, where it's moved onto fresh horses."},
 {"id":"hakone","gap":0.8,"text":"But one stage was different: from Odawara to Mishima, about thirty kilometres over the Hakone mountains, the hardest stretch of the road."},
 {"id":"climb","gap":0.8,"text":"From the sea, the road climbs more than seven hundred metres and down again, with no station on the way."},
 {"id":"same","gap":0.8,"text":"Everywhere else, fresh horses took over every ten kilometres or so. Here, the same horses and porters carried every load up and over the mountains."},
 {"id":"need","gap":0.8,"text":"The road needed a station where it was hardest."},
 {"id":"founded","gap":0.8,"text":"In 1618, the shogunate founded one, at Hakone, by a lake on the mountain, and moved fifty households from Odawara and fifty from Mishima to run it.","say":"In sixteen eighteen, the shogunate founded one, at Hakone, by a lake on the mountain, and moved fifty households from Odawara and fifty from Mishima to run it."},
 {"id":"two","gap":0.8,"text":"The hardest stage became two, of about fifteen kilometres each, and every load changed to fresh horses and porters halfway."},
 {"id":"ravi","gap":0.8,"text":"At the utility, Ravi draws his data platform by its parts too, before he names a single product."},
 {"id":"wrong","gap":0.8,"text":"Every part has something under it but one: nothing watches the platform itself, and its bill has gone up by half, with nobody able to say why."},
 {"id":"better","gap":0.8,"text":"Drawn whole, the gap shows, and the platform gets the part it was missing."}]},
"draw":{"name":"Parts before products","lead":1.0,"tail":1.0,"vo":[
 {"id":"map","gap":0.8,"text":"On Tomás's map, the data platform now sits in the technology layer, shared by every domain."},
 {"id":"open","gap":0.8,"text":"Ravi opens it up and draws what it has to do, before what it's made of: a reference architecture."},
 {"id":"why","gap":0.8,"text":"Products change. What a data platform has to do stays much the same, and drawn first, it shows what's missing."}]},
"along":{"name":"Four along the way","lead":1.0,"tail":1.0,"vo":[
 {"id":"bring","gap":0.8,"text":"Four parts follow the data. Bring it in: from billing, the meters and the network map, as files, tables or streams."},
 {"id":"store","gap":0.8,"text":"Store it, once, in an open format, where anyone allowed can read it."},
 {"id":"process","gap":0.8,"text":"Process it: clean it, join it, and build each domain's data products."},
 {"id":"serve","gap":0.8,"text":"And serve it: to reports and dashboards, to apps, and to other systems."},
 {"id":"inner","gap":0.8,"text":"The Inner Life of Data follows one record through all four."}]},
"across":{"name":"Four across it all","lead":1.0,"tail":1.0,"vo":[
 {"id":"more","gap":0.8,"text":"Four more run across all of them."},
 {"id":"govern","gap":0.8,"text":"Catalogue and govern: what each table means, who owns it, and who may use it."},
 {"id":"secure","gap":0.8,"text":"Secure: who's asking, what they may reach, and every request checked."},
 {"id":"orch","gap":0.8,"text":"Orchestrate: what runs, in what order, and when."},
 {"id":"observe","gap":0.8,"text":"And observe: whether it all runs well, and what it costs."}]},
"products":{"name":"A product under each","lead":1.0,"tail":1.0,"vo":[
 {"id":"under","gap":0.8,"text":"Then, under each part, the product that does it. Most are Databricks."},
 {"id":"in","gap":0.8,"text":"Lakeflow Connect brings data in. The tables are kept in the cloud's storage, in Delta Lake, an open format."},
 {"id":"proc","gap":0.8,"text":"Lakeflow pipelines and dbt process it. Databricks SQL and the reporting tool serve it."},
 {"id":"gov","gap":0.8,"text":"Unity Catalog catalogues and governs. Lakeflow Jobs orchestrates."},
 {"id":"sec","gap":0.8,"text":"Secure takes three: the utility's identity provider, its network, and the catalogue's permissions."},
 {"id":"obs","gap":0.8,"text":"Under observe: nothing."}]},
"nothing":{"name":"Nobody watching","lead":1.0,"tail":1.0,"vo":[
 {"id":"records","gap":0.8,"text":"The platform keeps its own records: every job's runs, every query, and what each one costs, in its system tables."},
 {"id":"nobody","gap":0.8,"text":"Nobody reads them. Each domain watches its own data products, and nobody watches the whole."},
 {"id":"bill","gap":0.8,"text":"In September, finance asks, in a ticket, why the platform's bill is up by half since June."},
 {"id":"cant","gap":0.8,"text":"Nobody can say which jobs made it grow, or whose they are."},
 {"id":"choice","gap":0.8,"text":"So the only choices are poor ones: pay it, or cut every domain back, whether it grew or not."}]},
"whose":{"name":"Whose part it is","lead":1.0,"tail":1.0,"vo":[
 {"id":"high","gap":0.8,"text":"Hakone's station was the highest on the road, more than seven hundred metres up, on empty ground by the lake."},
 {"id":"kept","gap":0.8,"text":"It was hard to keep going, and the shogunate took pains to keep it: the road's owner, for the whole road."},
 {"id":"like","gap":0.8,"text":"Watching the platform is like that station: it serves every domain, so no one domain should have to build it."},
 {"id":"team","gap":0.8,"text":"Each domain's logic belongs to the business. The platform's health and cost belong to the platform team."}]},
"watch":{"name":"The part that watches","lead":1.0,"tail":1.0,"vo":[
 {"id":"build","gap":0.8,"text":"So Ravi's team builds the missing part, from the platform's own records."},
 {"id":"tags","gap":0.8,"text":"Every job and warehouse gets a tag with its domain, so the bill splits by domain."},
 {"id":"dash","gap":0.8,"text":"One dashboard shows every run, how long it took and what it cost, and a budget for each domain sends an alert when it's passed."},
 {"id":"found","gap":0.8,"text":"In a week, it shows where the money went. One job had rebuilt three years of meter readings every night, not just the day's new ones."},
 {"id":"idle","gap":0.8,"text":"And a warehouse ran all night, for a dashboard nobody opened after six."},
 {"id":"fix","gap":0.8,"text":"The data team changes both, and reviews the pull requests."},
 {"id":"back","gap":0.8,"text":"By November, the bill is back to June's, and finance closes its ticket."},
 {"id":"share","gap":0.8,"text":"And each domain now sees its own share, every month."}]},
"practice":{"name":"The data practice on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"intro","gap":0.8,"text":"Here's the data practice, on Tomás's map."},
 {"id":"services","gap":0.8,"text":"In the technology layer, the eight parts are the platform's services: what it does for every domain."},
 {"id":"software","gap":0.8,"text":"Under them, the system software that realises each one: Databricks for most, the identity provider and the network for security."},
 {"id":"ref","gap":0.8,"text":"Drawn without the software, that's the reference architecture: any product can change under it."},
 {"id":"gap","gap":0.8,"text":"And what was missing is a gap between the platform today and the one it should be, drawn on the map with the work that closes it."}]},
"end":{"name":"A station on the mountain","lead":1.0,"tail":1.0,"vo":[
 {"id":"station","gap":0.8,"text":"Hakone's station served the Tōkaidō for two and a half centuries, until the post-station system ended, in 1872.","say":"Hakone's station served the Tōkaidō for two and a half centuries, until the post-station system ended, in eighteen seventy-two."},
 {"id":"data","gap":0.8,"text":"Ravi's platform has all eight parts now, each with something under it, and one of them watches the rest."},
 {"id":"next","gap":0.8,"text":"Next: one platform, or many."}]}
};
