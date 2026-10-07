// The map before the data · Who it serves, and how it pays. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"edison":{"name":"Light, not electricity","lead":1.4,"tail":1.0,"vo":[
 {"id":"opened","gap":0.8,"text":"In 1882, Thomas Edison opened a power station on Pearl Street, in New York.","say":"In eighteen eighty-two, Thomas Edison opened a power station on Pearl Street, in New York."},
 {"id":"light","gap":0.8,"text":"His customers didn't want electricity. They wanted light."},
 {"id":"gas","gap":0.8,"text":"Gas lamps were hot, smoky, and could start fires."},
 {"id":"sold","gap":0.8,"text":"So Edison sold steady, clean light, priced to compete with gas, and measured it with a meter whose zinc plates were weighed."},
 {"id":"knew","gap":0.8,"text":"He knew who he served, what they were trying to do, and how it would pay."}]},
"recap":{"name":"Who is it for?","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's first note asks why the utility exists."},
 {"id":"report","gap":0.8,"text":"The annual report answers in five words: safe, affordable, reliable, clean, ours."},
 {"id":"whom","gap":0.8,"text":"But for whom? He goes to see Farah, the utility's customer advocate."},
 {"id":"sheets","gap":0.8,"text":"They start with two kinds of canvas: one for each kind of customer, and one for each thing the utility offers."}]},
"segments":{"name":"Who pays, who uses, who decides","lead":1.0,"tail":1.0,"vo":[
 {"id":"differ","gap":0.8,"text":"Who pays, who uses and who decides are often different people."},
 {"id":"tenant","gap":0.8,"text":"A tenant uses the power and pays the bill. The landlord decides whether there are solar panels. And the regulator decides the price."},
 {"id":"names","gap":0.8,"text":"Farah names the segments: households, households in hardship, businesses, and homes with solar, which buy power and sell it back."},
 {"id":"others","gap":0.8,"text":"The minister and the regulator matter just as much, but they aren't customers. They'll have their own place on the map."}]},
"jobs":{"name":"What they're trying to get done","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"Tom\u00e1s starts with households, one canvas at a time."},
 {"id":"done","gap":0.8,"text":"What are they trying to get done?"},
 {"id":"lights","gap":0.8,"text":"Keep the lights and the heating on."},
 {"id":"worry","gap":0.8,"text":"Not worry about the bill."},
 {"id":"climate","gap":0.8,"text":"And, for many, do their bit for the climate."},
 {"id":"words","gap":0.8,"text":"A job is what the customer wants, in their words, not what the utility sells."}]},
"pains":{"name":"What hurts, and what would help","lead":1.0,"tail":1.0,"vo":[
 {"id":"wrong","gap":0.8,"text":"What goes wrong today? Bills that are too high."},
 {"id":"guess","gap":0.8,"text":"Bills based on a guess."},
 {"id":"cut","gap":0.8,"text":"A power cut with no warning, and no idea when it ends."},
 {"id":"win","gap":0.8,"text":"And what would be a win? Knowing when the power will be back."},
 {"id":"understand","gap":0.8,"text":"A bill they understand."},
 {"id":"less","gap":0.8,"text":"Paying less, because of their solar panels."}]},
"offers":{"name":"What the utility offers","lead":1.0,"tail":1.0,"vo":[
 {"id":"side","gap":0.8,"text":"Now the other side: what the utility offers, named the way a customer would name it."},
 {"id":"list","gap":0.8,"text":"Electricity supply. A connection to the network. Outage updates by text. A hardship plan."},
 {"id":"relieve","gap":0.8,"text":"Then, for each pain, what takes it away."},
 {"id":"meters","gap":0.8,"text":"Smart meters replace guesses with real readings."},
 {"id":"text","gap":0.8,"text":"A text gives the time the power will be back."},
 {"id":"plan","gap":0.8,"text":"A payment plan spreads a large bill."}]},
"fit":{"name":"Fit is a rule","lead":1.0,"tail":1.0,"vo":[
 {"id":"means","gap":0.8,"text":"A canvas only means something if it fits."},
 {"id":"every","gap":0.8,"text":"Every pain needs something that relieves it. Every gain needs something that creates it."},
 {"id":"solar","gap":0.8,"text":"On the canvas for homes with solar, one pain has nothing: waiting months to connect new panels."},
 {"id":"either","gap":0.8,"text":"An unmatched pain is either a missing capability or a customer the utility has decided not to serve. The canvas has to say which."},
 {"id":"clear","gap":0.8,"text":"Farah is clear: they serve them. It's a missing capability, and it goes on the list."}]},
"pays":{"name":"How each offering pays","lead":1.0,"tail":1.0,"vo":[
 {"id":"each","gap":0.8,"text":"Then, how each offering pays. Not one canvas for the whole utility, but one for each offering, because each has its own economics."},
 {"id":"network","gap":0.8,"text":"The network earns what the regulator allows, through a charge on every bill. Its biggest cost is poles, wires and crews."},
 {"id":"retail","gap":0.8,"text":"Retail supply earns from tariffs, and its biggest cost is buying energy on the wholesale market."},
 {"id":"hardship","gap":0.8,"text":"The hardship plan is paid for by the government, because a public utility is measured by public value, not only by profit."}]},
"map":{"name":"From canvas to map","lead":1.0,"tail":1.0,"vo":[
 {"id":"derived","gap":0.8,"text":"These canvases aren't the architecture. The architecture is derived from them."},
 {"id":"become","gap":0.8,"text":"Segments become stakeholders. Pains and gains become reasons to change. What relieves a pain becomes a capability. Key activities become processes."},
 {"id":"tables","gap":0.8,"text":"Revenue and costs have no box of their own in the model. They stay as tables, tied to what they pay for."},
 {"id":"later","gap":0.8,"text":"And later, the same blocks will tell a data team what each number is for."}]},
"end":{"name":"An answer, for now","lead":1.0,"tail":1.0,"vo":[
 {"id":"confirms","gap":0.8,"text":"Farah confirms the households' canvas. The rest stay drafts, for now."},
 {"id":"answer","gap":0.8,"text":"Tomás's first note has an answer: to keep the region's homes and businesses powered, affordably and fairly."},
 {"id":"next","gap":0.8,"text":"Next, he asks why it has to change."}]}
};
