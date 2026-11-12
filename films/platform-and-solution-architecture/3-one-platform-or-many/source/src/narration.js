// Platform and solution architecture · One platform, or many. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"tolls":{"name":"A toll at every barrier","lead":1.4,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"Japan, 1462. Boats carry rice, goods and people along the Yodo River, between Kyoto and the sea.","say":"Japan, fourteen sixty-two. Boats carry rice, goods and people along the Yodo River, between Kyoto and the sea."},
 {"id":"owners","gap":0.8,"text":"Every stretch of river and road has owners: the court, the shogunate, temples, shrines and lords."},
 {"id":"barrier","gap":0.8,"text":"Any of them may set a barrier across it, where everyone who passes pays a toll."},
 {"id":"count","gap":0.8,"text":"That year, it's said, the Yodo alone had 380 barriers. On the road to the shrines at Ise, there were once sixty in eighteen kilometres.","say":"That year, it's said, the Yodo alone had three hundred and eighty barriers. On the road to the shrines at Ise, there were once sixty in eighteen kilometres."},
 {"id":"harm","gap":0.8,"text":"A load stopped and paid at every one, so goods arrived late, and dearer for every barrier they passed."},
 {"id":"need","gap":0.8,"text":"Merchants and travellers needed a road they could use without paying every owner on it."},
 {"id":"lords","gap":0.8,"text":"Lords began clearing the barriers from their own lands, Oda Nobunaga among them."},
 {"id":"down","gap":0.8,"text":"From about 1585, Toyotomi Hideyoshi forbade the tolls, and barriers across the country came down.","say":"From about fifteen eighty-five, Toyotomi Hideyoshi forbade the tolls, and barriers across the country came down."},
 {"id":"rules","gap":0.8,"text":"Under the Tokugawa, the five roads ran under one set of rules, whoever's lands they crossed. In 1635, the lords were forbidden barriers of their own.","say":"Under the Tokugawa, the five roads ran under one set of rules, whoever's lands they crossed. In sixteen thirty-five, the lords were forbidden barriers of their own."},
 {"id":"kept","gap":0.8,"text":"Each domain kept its own lord, its own laws and its own taxes. The road was what they shared."},
 {"id":"better","gap":0.8,"text":"Travellers paid for what they used, a horse, a porter, a night at an inn, not every owner they passed. In 1771, more than two million pilgrims went to Ise.","say":"Travellers paid for what they used, a horse, a porter, a night at an inn, not every owner they passed. In seventeen seventy-one, more than two million pilgrims went to Ise."},
 {"id":"ravi","gap":0.8,"text":"At the utility, Ravi finds barriers too: two data platforms, from two parts of the business, and a third product proposed to join them."},
 {"id":"wrong","gap":0.8,"text":"Each brings its own permissions, policies and logs, so every rule would be kept three times."},
 {"id":"one","gap":0.8,"text":"So Ravi proposes one platform: every domain owns its data on it, and every rule is kept once."}]},
"two":{"name":"Two platforms, and a third","lead":1.0,"tail":1.0,"vo":[
 {"id":"bought","gap":0.8,"text":"Years ago, two parts of the utility each bought a data platform, from two vendors."},
 {"id":"which","gap":0.8,"text":"One became the platform every other domain uses. The other is generation's, and holds the readings from its hydro and wind farms."},
 {"id":"need","gap":0.8,"text":"Now the enterprise domain needs both, for one measure: the share of green-tariff customers' use, hour by hour, met by the utility's own farms."},
 {"id":"third","gap":0.8,"text":"Its analysts propose a third product to join the two. It would query both where they are, so nothing would have to move."},
 {"id":"ticket","gap":0.8,"text":"Ama asks for the measure in a ticket, and Ravi is asked how it should be built."}]},
"layers":{"name":"Three sets of rules","lead":1.0,"tail":1.0,"vo":[
 {"id":"side","gap":0.8,"text":"Ravi draws what each one brings with it, side by side."},
 {"id":"each","gap":0.8,"text":"Each platform has its own way to say who's who and who may see what, its own masks on private data, its own lineage, and its own log of who did what."},
 {"id":"third","gap":0.8,"text":"The third product would bring a set of its own."},
 {"id":"mask","gap":0.8,"text":"So customers' meter readings, masked on the data platform, would be masked again in the third product, its own way, and checked in both."},
 {"id":"grant","gap":0.8,"text":"An analyst's rights would be granted in three places, three ways, and the measure's lineage would stop at every border."},
 {"id":"toll","gap":0.8,"text":"Every platform is a barrier with its own toll, and whoever crosses it pays: in rules kept again, and kept in step."}]},
"simple":{"name":"As simple as it can be","lead":1.0,"tail":1.0,"vo":[
 {"id":"rule","gap":0.8,"text":"Ravi keeps to one rule: the simplest architecture that does the job. Complexity nobody manages is what makes services fail."},
 {"id":"most","gap":0.8,"text":"For most organisations, that means few components, on one platform."},
 {"id":"few","gap":0.8,"text":"Many platforms, joined, fit only a few: a group spread over many countries, say, with a platform and a team in each."},
 {"id":"easier","gap":0.8,"text":"And moving to one is easier than it was: with open formats, and tools that convert most of the code, it can take months, not years."}]},
"mesh":{"name":"Many owners, one platform","lead":1.0,"tail":1.0,"vo":[
 {"id":"owners","gap":0.8,"text":"One platform doesn't mean one team owns everything."},
 {"id":"mesh","gap":0.8,"text":"In a data mesh, as Zhamak Dehghani set it out, each domain owns its data, as products, on a self-serve platform, under rules the domains agree together."},
 {"id":"one","gap":0.8,"text":"That self-serve platform is one platform, shared. Ownership is spread out; the platform isn't."},
 {"id":"simplest","gap":0.8,"text":"Done that way, a data mesh is often the simplest architecture: one platform, many owners."},
 {"id":"badly","gap":0.8,"text":"Done badly, it's the old teams with new names, and nobody in the business owning anything."}]},
"unavoid":{"name":"When two can't be helped","lead":1.0,"tail":1.0,"vo":[
 {"id":"sometimes","gap":0.8,"text":"Sometimes a second platform can't be helped, for a while or for good."},
 {"id":"cases","gap":0.8,"text":"A company just bought, until it moves. A separate legal entity that must keep its data apart. Data that must stay in its own country."},
 {"id":"formats","gap":0.8,"text":"Two things lessen the harm. Open table formats, so both platforms read the same files."},
 {"id":"find","gap":0.8,"text":"And a catalogue that federates the other's, so people find all the data in one place."},
 {"id":"stays","gap":0.8,"text":"But each platform keeps its own permissions, policies and logs. The second set of rules stays."},
 {"id":"checks","gap":0.8,"text":"The shogunate kept some barriers too: about fifty checkpoints, there to keep order and check who passed."},
 {"id":"reason","gap":0.8,"text":"Keep a second platform the same way: only for a reason you can name."}]},
"move":{"name":"Generation moves","lead":1.0,"tail":1.0,"vo":[
 {"id":"none","gap":0.8,"text":"Generation's platform has no such reason, so it moves onto the data platform."},
 {"id":"keeps","gap":0.8,"text":"Generation keeps its data products: the same people, the same logic, the same owner."},
 {"id":"files","gap":0.8,"text":"Its tables are already files in an open format, in the utility's own cloud storage, so their data needn't be copied."},
 {"id":"bridge","gap":0.8,"text":"Until the move is done, the data platform's catalogue federates generation's, so Ama's measure can start at once."},
 {"id":"code","gap":0.8,"text":"A tool converts most of the jobs' code. The data team reviews each pull request, and compares every number with the old platform's for a month."},
 {"id":"off","gap":0.8,"text":"Generation checks its own reports in test, and after four months the old platform is switched off."}]},
"once":{"name":"Every rule, once","lead":1.0,"tail":1.0,"vo":[
 {"id":"once","gap":0.8,"text":"Now every rule is kept once. The mask on meter readings holds everywhere, and an analyst's rights are granted in one place."},
 {"id":"measure","gap":0.8,"text":"Ama's measure is built once, on one platform, with its lineage from each farm's readings to the number."},
 {"id":"cost","gap":0.8,"text":"One platform to pay for, not two, and no third. The two people who kept generation's platform running now build its data products."}]},
"practice":{"name":"The data practice on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"intro","gap":0.8,"text":"Here's the data practice, on Tomás's map."},
 {"id":"node","gap":0.8,"text":"In the technology layer, generation's platform was a second node, with its own services to govern and secure: a second set of rules, in plain sight."},
 {"id":"app","gap":0.8,"text":"In the application layer, generation's data products stayed generation's. Only what served them changed."},
 {"id":"principle","gap":0.8,"text":"Ravi's rule is a principle on the map: one platform, and a second only for a reason anyone can name."},
 {"id":"work","gap":0.8,"text":"And the move was a work package, ending the day the old platform was switched off."}]},
"end":{"name":"One road, many domains","lead":1.0,"tail":1.0,"vo":[
 {"id":"road","gap":0.8,"text":"Between Kuwana and Hinaga, where sixty barriers had stood, the Tōkaidō ran under the same rules as the whole road."},
 {"id":"data","gap":0.8,"text":"At the utility, there's one platform now, and every domain still owns what it builds on it."},
 {"id":"next","gap":0.8,"text":"Next: where it meets the applications."}]}
};
