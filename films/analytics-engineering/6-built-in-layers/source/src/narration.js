// In the weeds of data crafting · Built in layers. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"brigade":{"name":"One station, one job","lead":1.4,"tail":1.0,"vo":[
 {"id":"savoy","gap":0.8,"text":"At the Savoy hotel in London, in the 1890s, the chef Auguste Escoffier ran his kitchen as a brigade.","say":"At the Savoy hotel in London, in the eighteen-nineties, the chef Auguste Escoffier ran his kitchen as a brigade."},
 {"id":"stations","gap":0.8,"text":"Each station had one job: sauces, roasts, fish, vegetables."},
 {"id":"ahead","gap":0.8,"text":"Each prepared its part ahead, and every plate was checked at the pass."},
 {"id":"bridge","gap":0.8,"text":"Jun's credential project is a kitchen too: four stations, one job each, and a pass."}]},
"staging":{"name":"Staging","lead":1.0,"tail":1.0,"vo":[
 {"id":"red","gap":0.8,"text":"The tests are written. Now the code has to pass them, layer by layer."},
 {"id":"draft","gap":0.8,"text":"The agent writes a first draft of each model, runs its tests, and watches them fail. Then it writes the least code that turns them green. Jun reviews every line."},
 {"id":"first","gap":0.8,"text":"The first station is staging. One model per source table: seven of them."},
 {"id":"job","gap":0.8,"text":"Staging renames and casts. It trims, and writes each key in one case. It adds the readable key, with its key set, and its hash."},
 {"id":"nojoin","gap":0.8,"text":"No joins, and no rules. A short-course customer is still called a customer here."}]},
"intermediate":{"name":"Intermediate","lead":1.0,"tail":1.0,"vo":[
 {"id":"steps","gap":0.8,"text":"Next, intermediate. Eight models, and each one is a step, not a product."},
 {"id":"list","gap":0.8,"text":"Match a learner's keys. Stitch three timelines into one. Gather the credentials from three systems. Apply the credit rule."},
 {"id":"words","gap":0.8,"text":"Here the sources' words become the model's: a customer becomes a learner."},
 {"id":"recipe","gap":0.8,"text":"Read the names of one model's steps, top to bottom, and you have its recipe."}]},
"core":{"name":"Core","lead":1.0,"tail":1.0,"vo":[
 {"id":"names","gap":0.8,"text":"Then the core: what the blueprint names. A learner, an award, a credential, and credit towards an award."},
 {"id":"contract","gap":0.8,"text":"Each at its declared grain, public, under an enforced contract."},
 {"id":"green","gap":0.8,"text":"Jun builds it, and the tests turn green."},
 {"id":"award","gap":0.8,"text":"The award skips intermediate. It has one source, and nothing to resolve, so staging feeds the core directly."},
 {"id":"noor","gap":0.8,"text":"Noor reviews the core. It's her model, built."}]},
"marts":{"name":"Marts","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"Last, the marts: each built for one consumer, and shaped for how it's read."},
 {"id":"fact","gap":0.8,"text":"Planning's is long and narrow: seventy-three rows, one per learner per award, ready to count by faculty."},
 {"id":"wide","gap":0.8,"text":"The wallet's is wide: everything about a learner in one row, so the app reads it in one lookup."},
 {"id":"core","gap":0.8,"text":"Each mart builds on the core, never on another mart."}]},
"ctes":{"name":"One CTE, one step","lead":1.0,"tail":1.0,"vo":[
 {"id":"open","gap":0.8,"text":"Open Planning's mart. It's written as named steps, each called a CTE, and it reads like a recipe too."},
 {"id":"import","gap":0.8,"text":"First, import CTEs: one for each model it reads, and nothing else."},
 {"id":"logical","gap":0.8,"text":"Then logical CTEs, one step each, named for what they hold: learners at census, not CTE two."},
 {"id":"final","gap":0.8,"text":"Last, a final select that lists every column, in the contract's order."},
 {"id":"review","gap":0.8,"text":"A reviewer reads it top to bottom, and can see where every column comes from."}]},
"physical":{"name":"Physical choices","lead":1.0,"tail":1.0,"vo":[
 {"id":"how","gap":0.8,"text":"How each model is stored follows how it's used."},
 {"id":"views","gap":0.8,"text":"Staging and the steps are views: nothing stored twice, and the agent can query any one of them."},
 {"id":"tables","gap":0.8,"text":"The core and the marts are tables, because people read them all day."},
 {"id":"incr","gap":0.8,"text":"The credential table is incremental. Each run merges only what changed, matched on the credential's key. Run it twice, and the second run merges nothing."},
 {"id":"cluster","gap":0.8,"text":"On Databricks, the same file clusters it by learner. And when the logic changes, rebuild it in full."}]},
"once":{"name":"Metrics once","lead":1.0,"tail":1.0,"vo":[
 {"id":"rule","gap":0.8,"text":"Planning's rule is written once: near an award means more than nothing left, and no more than fifteen points."},
 {"id":"count","gap":0.8,"text":"The count by faculty is one macro. And the metric the dashboards ask for, defined in dbt's semantic layer, counts the same column."},
 {"id":"pass","gap":0.8,"text":"Then the pass. Planning's mart against the census report, faculty by faculty: twelve, and twelve. Green."},
 {"id":"each","gap":0.8,"text":"Each layer has one job. Each CTE, one step."},
 {"id":"next","gap":0.8,"text":"It's built by one team, in one project. But the registrar owns learners, the learning team owns microcredentials, and Planning wants a project of its own."}]}
};
