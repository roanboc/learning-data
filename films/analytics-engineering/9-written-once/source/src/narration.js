// In the weeds of data crafting · Written once. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"fork":{"name":"One note","lead":1.4,"tail":1.0,"vo":[
 {"id":"drift","gap":0.8,"text":"By the 1850s, the note A sounded different from one city to the next, and it kept creeping higher.","say":"By the eighteen-fifties, the note A sounded different from one city to the next, and it kept creeping higher."},
 {"id":"law","gap":0.8,"text":"In 1859, France fixed it by decree, and kept one tuning fork in Paris as its home.","say":"In eighteen fifty-nine, France fixed it by decree, and kept one tuning fork in Paris as its home."},
 {"id":"copies","gap":0.8,"text":"Other forks were checked against it, and instruments were tuned from those, never the other way round."},
 {"id":"today","gap":0.8,"text":"Today, before it plays, a whole orchestra still tunes to one note."},
 {"id":"bridge","gap":0.8,"text":"A definition can work like that: kept in one place, and everything else tuned from it."}]},
"four":{"name":"Four copies","lead":1.0,"tail":1.0,"vo":[
 {"id":"review","gap":0.8,"text":"The agent's review of the metadata found it: the definition of an award, in four places."},
 {"id":"found","gap":0.8,"text":"The wiki, a YAML description, the catalog, and the tooltip on Planning's dashboard."},
 {"id":"drift","gap":0.8,"text":"One says an award is given on paper. One has lost its credit points. One calls every award a degree."},
 {"id":"one","gap":0.8,"text":"Only the tooltip still says what Mei approved, the words in the conceptual model."},
 {"id":"step","gap":0.8,"text":"Nothing kept the others in step. They drifted, one small edit at a time."}]},
"where":{"name":"What goes where","lead":1.0,"tail":1.0,"vo":[
 {"id":"fifth","gap":0.8,"text":"The fix isn't a fifth copy, or a better one. The definition already has a home. Everything else has to be driven from it."},
 {"id":"meaning","gap":0.8,"text":"Meaning lives in the conceptual model: what each thing is, its key, and who owns it."},
 {"id":"glossary","gap":1.4,"text":"And where the business glossary already defines a term, that's its home. Data governance says which term applies, and the conceptual model takes its words."},
 {"id":"why","gap":0.8,"text":"Decisions live in a log beside what they're about, with why and who. The gaps the team accepted live on the model, as known limitations."},
 {"id":"build","gap":0.8,"text":"Everything the build uses lives in YAML: grain, keys, contracts, tests and owners."},
 {"id":"log","gap":0.8,"text":"A decision log isn't a copy. It holds why, which a model's YAML has no place for."}]},
"blocks":{"name":"Written once, shown everywhere","lead":1.0,"tail":1.0,"vo":[
 {"id":"once","gap":0.8,"text":"So the award is defined once, in the conceptual model."},
 {"id":"script","gap":0.8,"text":"A script turns each definition into a doc block, on a Markdown page it writes itself. Nobody edits that page."},
 {"id":"points","gap":0.8,"text":"The YAML doesn't copy the definition. It names it, and dbt shows the definition there."},
 {"id":"change","gap":0.8,"text":"To change the meaning, change one line, with Mei's approval. Edit the generated page instead, and the check in CI fails."},
 {"id":"zero","gap":0.8,"text":"The agent's review runs again: in the project, no description written twice. The wiki now links to the docs site."}]},
"diagrams":{"name":"Diagrams that can't drift","lead":1.0,"tail":1.0,"vo":[
 {"id":"too","gap":0.8,"text":"Diagrams drift too."},
 {"id":"hand","gap":0.8,"text":"The conceptual diagram is drawn by hand, for people. It changes only when the meaning does."},
 {"id":"generated","gap":0.8,"text":"The physical diagram is generated: every core and mart table, its columns, types and keys, read from what dbt parsed."},
 {"id":"fails","gap":0.8,"text":"If the YAML changes and the diagram doesn't, CI fails."},
 {"id":"rule","gap":0.8,"text":"Draw the meaning. Generate the structure."}]},
"catalog":{"name":"One direction","lead":1.0,"tail":1.0,"vo":[
 {"id":"find","gap":0.8,"text":"On Databricks, people find tables in the catalog, and read their descriptions there."},
 {"id":"push","gap":0.8,"text":"So each build pushes the descriptions out to it, for each table and its columns."},
 {"id":"there","gap":1.3,"text":"Nobody edits them there: a rebuild writes over the edit. Fix it at home, and it flows out."},
 {"id":"upstream","gap":2.0,"text":"Upstream, the same rule. A sync checks the glossary on a schedule. When a term changes, it opens a pull request, so the owner sees what the new meaning touches before it reaches the build."},
 {"id":"gate","gap":0.8,"text":"One direction: from the glossary, through the files, out to the catalog and whatever reads it. Tuned from one source, never the other way round."}]},
"version":{"name":"The next version","lead":1.0,"tail":1.0,"vo":[
 {"id":"change","gap":0.8,"text":"Written once doesn't mean never changed."},
 {"id":"expire","gap":0.8,"text":"A credential can expire, and a true or false can't say so. So is_revoked becomes status: valid, expired or revoked.","say":"A credential can expire, and a true or false can't say so. So is revoked becomes status: valid, expired or revoked."},
 {"id":"breaks","gap":0.8,"text":"That breaks anyone who reads the old column. So it's a new version of the credential, beside the old one."},
 {"id":"date","gap":0.8,"text":"Version one is built from version two, so the logic lives once. And it has a date to go: the 31st of March, 2027.","say":"Version one is built from version two, so the logic lives once. And it has a date to go: the thirty-first of March, twenty twenty-seven."},
 {"id":"tell","gap":0.8,"text":"The exposures declared with the contracts say who to tell: only the wallet app. It pins version two."},
 {"id":"warn","gap":0.8,"text":"Anyone still reading version one gets dbt's warning, with the date, every time they build."},
 {"id":"choice","gap":0.8,"text":"A breaking change arrives as a choice with a deadline, not as a surprise."}]},
"loop":{"name":"The loop closes","lead":1.0,"tail":1.0,"vo":[
 {"id":"steps","gap":0.6,"text":"That's the loop. A question, the sources, the consumers, gaps and contracts, tests, layers, the trusted number, review, written once, and change."},
 {"id":"approved","gap":0.8,"text":"At every step, the agent drafted and checked. At every step, a person approved."},
 {"id":"new","gap":0.8,"text":"And a new question arrives, from the wallet team. The loop starts again, at the question."},
 {"id":"declare","gap":0.8,"text":"Declare it. Then build it."}]}
};
