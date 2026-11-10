// Network, storage and keys, film 7 of 9 of Locks before the data, the first series of the module Data protection and privacy. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"holes":{"name":"Holes in the channels","lead":1.6,"tail":1.0,"vo":[
 {"id":"rome","gap":0.8,"text":"Rome, in the year 97.","say":"Rome, in the year ninety-seven."},
 {"id":"aqueducts","gap":0.8,"text":"Nine aqueducts bring the city its water from the hills, most of the way in channels under the ground."},
 {"id":"tanks","gap":0.3,"text":"In the city, it fills distribution tanks, and pipes carry it on:"},
 {"id":"uses","gap":0.8,"text":"to public basins and fountains, to baths, and to houses that hold a grant from the emperor, for so much water."},
 {"id":"frontinus","gap":0.3,"text":"That year, the emperor Nerva makes Sextus Julius Frontinus the water commissioner,"},
 {"id":"office","gap":0.8,"text":"an office, he writes, that concerns the city's health, and even its safety."},
 {"id":"measures","gap":0.8,"text":"Frontinus measures the water where it enters the channels, and finds about ten thousand measures more than the records give out."},
 {"id":"drawn","gap":0.8,"text":"On the way, it's being drawn off."},
 {"id":"watermen","gap":0.8,"text":"Water-men, who tend the pipes, divert it for private use, and sell it."},
 {"id":"gardens","gap":0.8,"text":"Landowners along the way tap the channels to water their gardens."},
 {"id":"pavements","gap":0.8,"text":"Under the pavements, secret pipes are bored here and there, with branches to the shops along them."},
 {"id":"little","gap":0.3,"text":"So only a little reaches the public basins and fountains, which should run day and night for the people,"},
 {"id":"stop","gap":0.8,"text":"and some stop altogether."},
 {"id":"nobody","gap":0.8,"text":"Nobody can say who draws what."},
 {"id":"change","gap":0.8,"text":"Something has to change."}
]},
"tank":{"name":"Only at the tank","lead":1.0,"tail":1.0,"vo":[
 {"id":"rules","gap":0.8,"text":"Frontinus holds the city to its rules."},
 {"id":"none","gap":0.8,"text":"No one may draw water from the channels."},
 {"id":"grant","gap":0.3,"text":"Whoever holds a grant draws it only at a distribution tank, through a bronze nozzle stamped with the size granted,"},
 {"id":"records","gap":0.8,"text":"and every grant is in the records."},
 {"id":"lead","gap":0.8,"text":"The secret branch pipes come out, and so much lead comes back that he estimates the theft by it."},
 {"id":"gangs","gap":0.3,"text":"And the gangs who keep the channels, often sent off to private work,"},
 {"id":"written","gap":0.8,"text":"now write down the day before what each will do, and the records keep what each did."},
 {"id":"doubled","gap":0.8,"text":"Frontinus wrote that the supply almost doubled, as though new springs had been found."},
 {"id":"people","gap":0.3,"text":"More basins and fountains ran for the people, the city was cleaner,"},
 {"id":"care","gap":0.8,"text":"and those who had drawn water in fear now drew it by grant, free from care."},
 {"id":"files","gap":0.3,"text":"A data platform's files are its water, and its catalog is the tank:"},
 {"id":"draw","gap":0.8,"text":"the one place to draw, where each grant is checked and every rule applied."},
 {"id":"hole","gap":0.8,"text":"Every way to the files around it is a hole in the channel."}
]},
"around":{"name":"Nine ways around","lead":1.0,"tail":1.0,"vo":[
 {"id":"platform","gap":0.8,"text":"At the university, the data platform runs on Azure Databricks, in three workspaces now: development, test and production."},
 {"id":"storage","gap":0.8,"text":"Production's files, every table's data, sit in an Azure storage account, a container for each area."},
 {"id":"only","gap":0.8,"text":"Unity Catalog is meant to be the only way to them."},
 {"id":"counts","gap":0.8,"text":"Sam Okafor, who runs the platform, counts the ways to the files that skip it."},
 {"id":"keys","gap":0.8,"text":"Two account keys, each of which opens every file."},
 {"id":"link","gap":0.8,"text":"A link signed with one of them, made in 2024 for a supplier's one-off file, and good until the end of 2027.","say":"A link signed with one of them, made in twenty twenty-four for a supplier's one-off file, and good until the end of twenty twenty-seven."},
 {"id":"six","gap":0.8,"text":"Six people with a role on the storage, each given for one task, and never taken back."},
 {"id":"nine","gap":0.8,"text":"Nine ways in, and not one asks the catalog."},
 {"id":"rows","gap":0.8,"text":"In the files, no grant, mask or filter applies: whoever reads them sees every row."},
 {"id":"internet","gap":0.8,"text":"And the workspaces and the storage all have a door on the internet, open to any address."},
 {"id":"wrong","gap":0.8,"text":"Nobody did anything wrong: each was the quickest way to finish a task."}
]},
"paths":{"name":"Doors in, a short list out","lead":1.0,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"First, the doors in."},
 {"id":"endpoint","gap":0.3,"text":"Sam gives each workspace a private endpoint: a door inside the university's own network,"},
 {"id":"path","gap":0.8,"text":"so people and jobs come in by a private path."},
 {"id":"machines","gap":0.8,"text":"The machines that run the jobs reach Databricks by a private path too, and so does the build service."},
 {"id":"list","gap":0.8,"text":"While every team moves to it, for two weeks, an IP access list lets in only the university's own addresses."},
 {"id":"off","gap":0.3,"text":"Then Sam switches public access off in all three workspaces:"},
 {"id":"nodoor","gap":0.8,"text":"the platform has no door on the open internet."},
 {"id":"out","gap":0.8,"text":"Then the ways out."},
 {"id":"serverless","gap":0.3,"text":"Serverless compute, which Databricks runs for the university, could reach anywhere on the internet:"},
 {"id":"send","gap":0.8,"text":"a notebook could send a table anywhere."},
 {"id":"policy","gap":0.8,"text":"Production gets a network policy with restricted access: only the catalog's own storage, and a short list."},
 {"id":"dry","gap":0.8,"text":"For a week it runs in dry run: it blocks nothing yet, and Sam sees what it would have blocked."},
 {"id":"on","gap":0.8,"text":"Then it's on: data may leave only for places on the list."}
]},
"files":{"name":"One identity at the files","lead":1.0,"tail":1.0,"vo":[
 {"id":"now","gap":0.8,"text":"Now the files themselves."},
 {"id":"public","gap":0.8,"text":"Sam switches the storage's public access off: it's reached only by its own private endpoints."},
 {"id":"keysoff","gap":0.3,"text":"He switches off its account keys, and the storage refuses anything signed with them:"},
 {"id":"nothing","gap":0.8,"text":"the two keys and the supplier's link open nothing now."},
 {"id":"roles","gap":0.8,"text":"The six people's roles go; each now gets what they need through the catalog, under their group's grants."},
 {"id":"one","gap":0.3,"text":"One identity keeps a role on the files: the catalog's own, its access connector,"},
 {"id":"azure","gap":0.8,"text":"an identity Azure gives it, with no secret anyone holds."},
 {"id":"credential","gap":0.8,"text":"In Unity Catalog, a storage credential holds it, and an external location for each area points to its container."},
 {"id":"every","gap":0.8,"text":"So every read of the files goes through the catalog, which checks the grant, and applies the masks and filters."},
 {"id":"rome","gap":0.8,"text":"Like Rome's tanks, the catalog is the one place to draw."}
]},
"walls":{"name":"Each catalog in its own workspace","lead":1.0,"tail":1.0,"vo":[
 {"id":"wall","gap":0.8,"text":"One more wall."},
 {"id":"default","gap":0.3,"text":"By default, every workspace reaches every catalog:"},
 {"id":"dev","gap":0.8,"text":"a notebook in development, with a grant, could read production's real records."},
 {"id":"binds","gap":0.3,"text":"Sam binds each catalog to its own workspace:"},
 {"id":"five","gap":0.3,"text":"production's five, registrar, learning, planning, HR and finance, to production alone;"},
 {"id":"others","gap":0.8,"text":"test's to test; development's to development."},
 {"id":"same","gap":0.8,"text":"The storage credential and the external locations are bound the same way."},
 {"id":"grant","gap":0.8,"text":"Now a grant isn't enough: from a workspace it isn't bound to, a catalog isn't there."}
]},
"switch":{"name":"The door you switch on","lead":1.0,"tail":1.0,"vo":[
 {"id":"shut","gap":0.8,"text":"The files keep one more door, and it stays shut."},
 {"id":"needs","gap":0.8,"text":"Some work needs the files themselves."},
 {"id":"morning","gap":0.8,"text":"One morning, the nightly load stops on a row it can't read, and Jun Park must open last night's file."},
 {"id":"group","gap":0.8,"text":"On the storage, one group holds one role: read and list, nothing more."},
 {"id":"empty","gap":0.8,"text":"It's for admin accounts only, and no one is in it."},
 {"id":"on","gap":0.8,"text":"Jun switches on his admin account's power to read the storage, for one hour, with a reason, and Sam approves."},
 {"id":"reads","gap":0.8,"text":"Jun comes in by the private path, reads that one file, and switches off."},
 {"id":"log","gap":0.8,"text":"The storage's own log keeps every read, under the account that made it, and the platform team gets an alert."},
 {"id":"forgot","gap":0.8,"text":"Had he forgotten, it would have shut by itself when the hour was up."},
 {"id":"gangs","gap":0.8,"text":"Like the gangs in Rome, the work is written down before, and recorded as it's done."}
]},
"key":{"name":"The university's own key","lead":1.0,"tail":1.0,"vo":[
 {"id":"last","gap":0.8,"text":"Last, the keys."},
 {"id":"always","gap":0.8,"text":"The files were always encrypted, with a key the cloud provider kept for the university."},
 {"id":"own","gap":0.8,"text":"Now the key is the university's own, kept by its security team in a vault of its own."},
 {"id":"use","gap":0.8,"text":"The storage may use the key, never take it out."},
 {"id":"cant","gap":0.8,"text":"The people who run the platform can't delete it or turn it off, and every use is recorded."},
 {"id":"version","gap":0.8,"text":"The vault makes a new version every year, and the storage picks it up within a day."},
 {"id":"deleted","gap":0.8,"text":"A deleted key is kept ninety days, and nobody can cut that short."},
 {"id":"workspace","gap":0.8,"text":"The workspace's notebooks, queries and disks use a key from the same vault."},
 {"id":"back","gap":0.3,"text":"And the security team can take the key back:"},
 {"id":"nobody","gap":0.8,"text":"then nobody can read the files, the cloud provider included."}
]},
"end":{"name":"Only through the catalog","lead":1.2,"tail":1.0,"vo":[
 {"id":"rome","gap":0.8,"text":"In Rome, water was drawn only at the tank, through a stamped nozzle, and the gangs' work was written down."},
 {"id":"uni","gap":0.3,"text":"At the university, the files are reached only through the catalog,"},
 {"id":"doors","gap":0.8,"text":"behind private doors, with a short list out and a key of the university's own."},
 {"id":"one","gap":0.8,"text":"And the one way around it is switched on for a task, and watched."},
 {"id":"takeaway","gap":0.8,"text":"No path to the data skips the catalog, except the one you switch on and watch."}
]}
};
