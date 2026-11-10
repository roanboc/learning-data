// The map before the data · Why it moves. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"blackout":{"name":"The night the lights went out","lead":1.4,"tail":1.0,"vo":[
 {"id":"relay","gap":0.8,"text":"On the ninth of November, 1965, a single relay near Niagara Falls switched off a line it should have kept on.","say":"On the ninth of November, nineteen sixty-five, a single relay near Niagara Falls switched off a line it should have kept on."},
 {"id":"spread","gap":0.8,"text":"Within minutes, the fault spread across the north-east of America and into Canada. Thirty million people lost power."},
 {"id":"watched","gap":0.8,"text":"Every utility had watched its own wires, and none could see the whole."},
 {"id":"council","gap":0.8,"text":"So the utilities set up a council and wrote rules for all of them to keep."},
 {"id":"chain","gap":0.8,"text":"A shock, what it revealed, what had to become true, and a rule to hold to."}]},
"letters":{"name":"Three letters","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's new note asks why the utility must change. Three letters answer at once."},
 {"id":"minister","gap":0.8,"text":"The minister expects lower bills, a dividend, and net zero by 2045.","say":"The minister expects lower bills, a dividend, and net zero by twenty forty-five."},
 {"id":"regulator","gap":0.8,"text":"The regulator has cut what the network may earn for the next five years."},
 {"id":"valley","gap":0.8,"text":"And a valley community objects to a new line that would carry power from a wind farm."},
 {"id":"right","gap":0.8,"text":"Each letter is right. They pull in different directions."}]},
"cares":{"name":"Who cares","lead":1.0,"tail":1.0,"vo":[
 {"id":"ama","gap":0.8,"text":"He takes them to Ama, the regulatory lead. Ama starts with who cares."},
 {"id":"customers","gap":0.8,"text":"The customers from Farah's canvases are only some of them."},
 {"id":"others","gap":0.8,"text":"The minister owns the utility. The regulator sets its prices. The community lives beside its lines. And the staff keep it running."},
 {"id":"stakeholder","gap":0.8,"text":"Each is a stakeholder: someone with an interest in what the utility does."}]},
"pushes":{"name":"What pushes","lead":1.0,"tail":1.0,"vo":[
 {"id":"then","gap":0.8,"text":"Then, what pushes on them. Ama calls these drivers."},
 {"id":"list","gap":0.8,"text":"Decarbonisation. Affordability. Ageing poles and wires."},
 {"id":"solar","gap":0.8,"text":"And rooftop solar, which turns customers into generators."},
 {"id":"pressure","gap":0.8,"text":"A driver is a pressure, not a wish. It's there whether or not anyone plans for it."}]},
"means":{"name":"What it means here","lead":1.0,"tail":1.0,"vo":[
 {"id":"nothing","gap":0.8,"text":"A driver says nothing until someone works out what it means here."},
 {"id":"source","gap":0.8,"text":"Ama calls that an assessment, and every one has a source."},
 {"id":"poles","gap":0.8,"text":"A third of the poles are over fifty years old."},
 {"id":"flow","gap":0.8,"text":"The network was built for power that flows one way."},
 {"id":"bills","gap":0.8,"text":"Household bills rose eighteen per cent in two years."},
 {"id":"opinion","gap":0.8,"text":"Without the evidence, it's just an opinion."}]},
"goals":{"name":"What must become true","lead":1.0,"tail":1.0,"vo":[
 {"id":"now","gap":0.8,"text":"Now, what must become true. Goals."},
 {"id":"list","gap":0.8,"text":"Keep bills affordable. Replace ageing assets before they fail. Connect renewable power."},
 {"id":"direction","gap":0.8,"text":"A goal is a direction. An outcome says how anyone will know it's been reached."},
 {"id":"charge","gap":0.8,"text":"The network charge on a household bill no higher in real terms in 2030.","say":"The network charge on a household bill no higher in real terms in twenty thirty."},
 {"id":"days","gap":0.8,"text":"New solar connected within ten working days."},
 {"id":"check","gap":0.8,"text":"If no one can say how an outcome will be checked, it isn't one yet."}]},
"collide":{"name":"When goals pull apart","lead":1.0,"tail":1.0,"vo":[
 {"id":"collide","gap":0.8,"text":"Then the goals collide. Connecting the wind farm needs a new line."},
 {"id":"cost","gap":0.8,"text":"A new line costs money that bills must repay. And it runs through the valley."},
 {"id":"win","gap":0.8,"text":"Every goal is right, and they can't all win."},
 {"id":"loudest","gap":0.8,"text":"If the loudest letter decides, the next decision will go another way. That's what principles are for."}]},
"principles":{"name":"Principles that can be tested","lead":1.0,"tail":1.0,"vo":[
 {"id":"rule","gap":0.8,"text":"A principle is a rule every choice is checked against."},
 {"id":"have","gap":0.8,"text":"Ama has three. Use what we have before we build."},
 {"id":"costed","gap":0.8,"text":"Every option is costed for the customers who pay for it."},
 {"id":"info","gap":0.8,"text":"And customer information stays with the business that collected it."},
 {"id":"sustain","gap":0.8,"text":"\"Be sustainable\" is not a principle, because nothing could ever fail it."},
 {"id":"checked","gap":0.8,"text":"Checked against these three, the new line isn't the first option. Upgrading the old line, with batteries in the valley, is."}]},
"chain":{"name":"The chain","lead":1.0,"tail":1.0,"vo":[
 {"id":"drawn","gap":0.8,"text":"Drawn together, it's a chain."},
 {"id":"links","gap":0.8,"text":"Stakeholders feel drivers. Assessments say what they mean here. Goals answer them, and outcomes say how anyone will know."},
 {"id":"beside","gap":0.8,"text":"Principles stand beside it all."},
 {"id":"number","gap":0.8,"text":"Every outcome is a number someone will one day have to measure."},
 {"id":"what","gap":0.8,"text":"What counts as a working day? Connected, from when?"}]},
"end":{"name":"Checked, for now","lead":1.0,"tail":1.0,"vo":[
 {"id":"confirms","gap":0.8,"text":"Ama confirms the drivers and the assessments. The goals go to the board, as drafts."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer, and something to check every answer against."},
 {"id":"next","gap":0.8,"text":"Next, he asks what the utility must be able to do."}]}
};
