// One copy, one platform, the third film of Data that moves, the first series of Modern data basics. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"ledger":{"name":"One ledger","lead":1.6,"tail":1.0,"vo":[
 {"id":"amst","gap":0.8,"text":"Amsterdam, around 1600.","say":"Amsterdam, around sixteen hundred."},
 {"id":"quays","gap":0.8,"text":"Ships from all over Europe trade there, and merchants pay each other in coin."},
 {"id":"kinds","gap":0.8,"text":"Between 800 and 1,000 kinds of coin change hands, many clipped, shaved at the edge for their silver, or worn thin.","say":"Between eight hundred and a thousand kinds of coin change hands, many clipped, shaved at the edge for their silver, or worn thin."},
 {"id":"weigh","gap":0.8,"text":"Every payment means weighing coins, and nobody knows what a bag of them is really worth."},
 {"id":"owed","gap":0.8,"text":"On average, coin there is worth about 9% less than good coin: a merchant owed a thousand guilders may get coin worth about nine hundred.","say":"On average, coin there is worth about nine per cent less than good coin: a merchant owed a thousand guilders may get coin worth about nine hundred."},
 {"id":"change","gap":0.8,"text":"Payments are slow, disputed and risky. Something had to change."},
 {"id":"bank","gap":0.8,"text":"On the 31st of January 1609, the city opens an exchange bank, the Wisselbank, in its town hall.","say":"On the thirty-first of January, sixteen oh nine, the city opens an exchange bank, the Wisselbank, in its town hall."},
 {"id":"deposit","gap":0.8,"text":"Merchants bring their coin once. The bank weighs it, and writes its value in its ledger, on the merchant's own page."},
 {"id":"line","gap":0.8,"text":"From then on, a payment is a line moved from page to page, with no coin carried, and the ledger shows what each merchant holds."},
 {"id":"trust","gap":0.8,"text":"Merchants pay about 5% more for a guilder in the ledger than for one in coin.","say":"Merchants pay about five per cent more for a guilder in the ledger than for one in coin."},
 {"id":"century","gap":0.8,"text":"For over a century, bills from all over Europe are paid there."},
 {"id":"data","gap":0.8,"text":"Data has its bags of coin too: the same data copied into every system that needs it, each copy a little different."},
 {"id":"claims","gap":0.8,"text":"At the university, tutors' claims went round by email, and payroll and Finance each kept a copy that never quite agreed."},
 {"id":"now","gap":0.8,"text":"Now each claim is written once, and payroll and Finance read that one copy."}]},
"usual":{"name":"The usual design","lead":1.2,"tail":1.0,"vo":[
 {"id":"payday","gap":0.8,"text":"Thursday, the 5th of November 2026: pay day at the university.","say":"Thursday, the fifth of November, twenty twenty-six: pay day at the university."},
 {"id":"linh","gap":0.8,"text":"Linh Nguyen tutors HI101 on a casual contract, paid for the hours she claims.","say":"Linh Nguyen tutors H I one oh one on a casual contract, paid for the hours she claims."},
 {"id":"sheets","gap":0.8,"text":"Claims used to be spreadsheets sent by email and typed again by payroll."},
 {"id":"tally","gap":0.8,"text":"The faculty kept its own tally, and Finance saw the hours only after pay day."},
 {"id":"ready","gap":0.8,"text":"So when the university built an app for claims, the usual design was ready:"},
 {"id":"design","gap":0.8,"text":"the app on its own database, a pipeline copying each change to an analytics platform, and reports on the copy."},
 {"id":"cost","gap":0.8,"text":"Two platforms, a pipeline between them, two sets of permissions, and a copy always a little behind."}]},
"copy":{"name":"One copy","lead":1.2,"tail":1.0,"vo":[
 {"id":"noor","gap":0.8,"text":"Noor, the data architect, chose one copy on one platform instead."},
 {"id":"lakebase","gap":0.8,"text":"The claims app is built on Lakebase, the Postgres database in Databricks."},
 {"id":"once","gap":0.8,"text":"Linh writes each claim once, as a row, and her coordinator approves it in that same row."},
 {"id":"engines","gap":0.8,"text":"Postgres serves the app, and the lakehouse reads the same rows for analysis, in place, without slowing it."},
 {"id":"readers","gap":0.8,"text":"Payroll's list of claims still waiting and the job that builds the hours to pay both read that copy."},
 {"id":"finance","gap":0.8,"text":"So does Finance's casual teaching cost, and all three read through Unity Catalog."},
 {"id":"writer","gap":0.8,"text":"Each table has one writer. The app writes the claims."},
 {"id":"contracts","gap":0.8,"text":"The lakehouse writes the contracts from the HR system, and serves them to the app, which checks each claim against its contract."},
 {"id":"written","gap":0.8,"text":"As in Amsterdam's ledger, a claim is written once, and read where it's written."}]},
"fewer":{"name":"Fewer platforms","lead":1.2,"tail":1.0,"vo":[
 {"id":"gone","gap":0.8,"text":"What's gone: the pipeline, the second database, and the work of keeping two copies in step."},
 {"id":"together","gap":0.8,"text":"The integration services that ran between separate platforms come together on one."},
 {"id":"catalog","gap":0.8,"text":"One catalog governs who may read the claims for analysis, with the same permissions, lineage and audit as every other table."},
 {"id":"moves","gap":0.8,"text":"What still moves? Payroll pays from a payroll system the university buys, which isn't on the platform."},
 {"id":"tuesday","gap":0.8,"text":"So each pay run, the hours to pay leave the platform by noon on Tuesday, under a contract with payroll."},
 {"id":"purpose","gap":0.8,"text":"One thing moves, on purpose, instead of a copy of everything."},
 {"id":"night","gap":0.8,"text":"The night it fails comes later, in A platform that watches itself."}]},
"choose":{"name":"What to choose","lead":1.2,"tail":1.0,"vo":[
 {"id":"so","gap":0.8,"text":"So, what should you choose?"},
 {"id":"keep","gap":0.8,"text":"Keep one copy where you can, and move data only when a reader truly needs it somewhere else."},
 {"id":"decide","gap":0.8,"text":"Decide which system writes each table, and let the others read it."},
 {"id":"bought","gap":0.8,"text":"Where a system you buy keeps its own copy, agree the contract at that interface, as Moving is easy, agreeing is the work showed."},
 {"id":"both","gap":0.8,"text":"Both at once showed one database that writes and reads. Here, one copy serves a whole platform."},
 {"id":"wheel","gap":0.8,"text":"There are already standards for this, so don't reinvent the wheel."},
 {"id":"docs","gap":0.8,"text":"Investigate, adapt, implement and iterate, starting from the official docs."}]},
"row":{"name":"The same row","lead":1.2,"tail":1.0,"vo":[
 {"id":"amsterdam","gap":0.8,"text":"In Amsterdam, a payment became a line moved in one ledger, and the same ledger showed what everyone held."},
 {"id":"onerow","gap":0.8,"text":"At the university, Linh's claim is one row: she writes it, her coordinator approves it, payroll pays it and Finance counts it."},
 {"id":"paid","gap":0.8,"text":"Today, 856 casual staff are paid from rows like hers, and not one claim was copied to get there.","say":"Today, eight hundred and fifty-six casual staff are paid from rows like hers, and not one claim was copied to get there."},
 {"id":"takeaway","gap":0.8,"text":"Keep one copy, governed once."}]}
};
