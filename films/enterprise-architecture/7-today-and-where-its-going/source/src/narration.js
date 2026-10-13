// The map before the data · Today, and where it's going. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"morning":{"name":"An imagined morning","lead":1.4,"tail":1.0,"vo":[
 {"id":"imagine","gap":0.8,"text":"An imagined morning, in 2045, in the utility's own region."},
 {"id":"street","gap":0.8,"text":"As the sun comes up, the homes on one street trade power from their batteries, house to house."},
 {"id":"crew","gap":0.8,"text":"A transformer's readings start to drift, and a crew is sent before it fails. Nobody on the street notices."},
 {"id":"drawing","gap":0.8,"text":"This isn't a forecast. It's a drawing of where the utility wants to go, made as carefully as a drawing of today."},
 {"id":"today","gap":0.8,"text":"And today, it runs on a hundred and forty systems."}]},
"list":{"name":"A hundred and forty systems","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's next note asks what runs the utility today, and where it's going."},
 {"id":"bought","gap":0.8,"text":"On day one, the systems were a list: what had been bought, over forty years."},
 {"id":"place","gap":0.8,"text":"Now there's a map to place them on. Each system goes under the capability it serves, from evidence: who uses it, and for what."},
 {"id":"most","gap":0.8,"text":"Most of them land where you'd expect."}]},
"find":{"name":"Three, none, and one too many","lead":1.0,"tail":1.0,"vo":[
 {"id":"three","gap":0.8,"text":"Under managing outages, there are three: an outage system, a network control system that also handles outages, and a storm tool someone built in 2015."},
 {"id":"none","gap":0.8,"text":"Under assessing network capacity, the capability that hurts, there's no system at all: a spreadsheet, kept by one engineer."},
 {"id":"orphan","gap":0.8,"text":"And one system serves no capability anyone can name. It still costs a licence every year."},
 {"id":"names","gap":0.8,"text":"Overlaps, gaps and shadow systems: a list could never show them. A map does."}]},
"layers":{"name":"What runs it","lead":1.0,"tail":1.0,"vo":[
 {"id":"below","gap":0.8,"text":"Below the applications is the technology they run on: two data centres, a cloud, and the radio network the field devices talk over."},
 {"id":"derive","gap":0.8,"text":"Each layer serves the one above. The business needs a capability; applications serve it; technology runs them."},
 {"id":"follow","gap":0.8,"text":"Change a capability, and you can follow it down. Switch off a server, and you can follow it up."}]},
"views":{"name":"One map, one notation","lead":1.0,"tail":1.0,"vo":[
 {"id":"drafts","gap":0.8,"text":"For the first time, the drafts become one model, in ArchiMate's notation.","say":"For the first time, the drafts become one model, in Arky-mate's notation."},
 {"id":"blocks","gap":0.8,"text":"Each block of the early canvases finds its element. A customer segment becomes a stakeholder. A pain reliever, a capability. A key activity, a business process. A key resource, a resource."},
 {"id":"whole","gap":0.8,"text":"The whole map, layer by layer: why the utility exists, what it must be able to do, how the work flows, who does it, and what runs it."},
 {"id":"tools","gap":0.8,"text":"Modelling tools can keep it. The ideas don't depend on them."}]},
"target":{"name":"Where it's going","lead":1.0,"tail":1.0,"vo":[
 {"id":"second","gap":0.8,"text":"Where it's going is a second drawing: the target, on the same map, so the two can be compared."},
 {"id":"new","gap":0.8,"text":"Two capabilities are new: predicting faults, and trading power locally."},
 {"id":"change","gap":0.8,"text":"One outage system instead of three. A model of the network's capacity instead of a spreadsheet. And the licence nobody uses, gone."}]},
"gaps":{"name":"The gaps","lead":1.0,"tail":1.0,"vo":[
 {"id":"diff","gap":0.8,"text":"Laid side by side, the differences between the two are the gaps. Each gap is a piece of work."},
 {"id":"five","gap":0.8,"text":"Merge three outage systems into one. Build the capacity model. Switch off the system nobody uses. Add sensors, and predict faults. Open local trading."}]},
"path":{"name":"The path, in order","lead":1.0,"tail":1.0,"vo":[
 {"id":"third","gap":0.8,"text":"The path is a third drawing: plateaus, the steady states in between, and the order in which the gaps are closed."},
 {"id":"order","gap":0.8,"text":"The order matters. Trading power on a street needs to know how much that street can take, so the capacity model comes first. Predicting faults needs sensors, so the sensors come before it."},
 {"id":"dates","gap":0.8,"text":"By 2028, one outage system and a capacity model. By 2033, fault prediction. Local trading, after that."}]},
"why":{"name":"Why, written down","lead":1.2,"tail":1.3,"vo":[
 {"id":"each","gap":0.8,"text":"Each choice on the path is written down with why: what was decided, what else was considered, and who decided."},
 {"id":"outage","gap":0.8,"text":"Keep the newest outage system, and fold the storm tool into it. Considered: keeping all three, or buying a new one. Decided by Grace."},
 {"id":"later","gap":0.8,"text":"Three years on, someone will ask why the storm tool was switched off. The answer will be there."}]},
"end":{"name":"Three drawings","lead":1.0,"tail":1.0,"vo":[
 {"id":"confirm","gap":0.8,"text":"Grace confirms the network's systems as they stand today. The target and the path go to the board, as drafts."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer: today, placed on the map; a target, drawn as carefully; and a path between them, with reasons."},
 {"id":"done","gap":0.8,"text":"The map of how the utility works is drawn, for now."},
 {"id":"next","gap":0.8,"text":"Now, at last, he can open the backlog from day one, and ask which questions matter."}]}
};
