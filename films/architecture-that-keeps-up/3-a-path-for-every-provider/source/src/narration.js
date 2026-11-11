// A path for every provider, the third film of Architecture that keeps up, in the module Data management. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years, dates and money in words). The few longer stops are in breath.js.
const NARR={
"box":{"name":"The ship that brought its own cranes","lead":3.0,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"Port Newark, New Jersey, in April 1956.","say":"Port Newark, New Jersey, in April nineteen fifty-six."},
 {"id":"ideal","gap":0.8,"text":"A trucking man, Malcom McLean, sends an old tanker, the Ideal X, to Houston with 58 metal boxes on its deck."},
 {"id":"lift","gap":0.8,"text":"Each box is lifted on and off whole, by crane, instead of sack by sack and crate by crate."},
 {"id":"cost","gap":0.8,"text":"By McLean's own figures, loading costs under 16 cents a ton, against $5.83 by hand.","say":"By McLean's own figures, loading costs under sixteen cents a ton, against five dollars eighty-three by hand."},
 {"id":"needs","gap":0.8,"text":"But a box needs a crane strong enough to lift it, at both ends of the trip."},
 {"id":"few","gap":0.8,"text":"Few ports have one, and building one takes years, and money most of them don't have."},
 {"id":"harm","gap":0.8,"text":"For those ports, the box changes nothing: ships still sit at the quay for days, unloaded by hand, and their goods cost more."},
 {"id":"change","gap":0.8,"text":"Unless it can reach ports without cranes, the box will stop wherever the cranes do."},
 {"id":"gateway","gap":0.8,"text":"In October 1957, McLean's company sends out a rebuilt ship, the Gateway City, with two cranes of its own.","say":"In October nineteen fifty-seven, McLean's company sends out a rebuilt ship, the Gateway City, with two cranes of its own."},
 {"id":"rails","gap":0.8,"text":"They run on rails along its deck, and reach out over the quay."},
 {"id":"any","gap":0.8,"text":"Now a port with a quay can take boxes, crane or not."},
 {"id":"years","gap":0.8,"text":"Over the years, ports build cranes of their own, and the ships' cranes are no longer needed there."},
 {"id":"still","gap":0.8,"text":"Ships with their own cranes still call at ports that have none."},
 {"id":"reach","gap":0.8,"text":"The box's savings reached each port before it could meet the standard, and each port joined the standard when it could."},
 {"id":"data","gap":0.8,"text":"Data has its standard ways too, and providers who can't meet them yet."},
 {"id":"path","gap":0.8,"text":"A path for each of them lets their data arrive now, not after every one of them catches up."}
]},
"way":{"name":"One preferred way","lead":1.0,"tail":1.0,"vo":[
 {"id":"series","gap":0.8,"text":"These films borrow from architecture to run a data team's services. This one is about the data coming in."},
 {"id":"when","gap":0.8,"text":"June 2027, at a university, a year from now.","say":"June twenty twenty-seven, at a university, a year from now."},
 {"id":"helena","gap":0.8,"text":"Helena Novak, the data manager, and Noor Rahman, the data architect, write the team's preferred way to receive data, on one page."},
 {"id":"product","gap":0.8,"text":"The source publishes its data as a governed product, with an owner and a contract."},
 {"id":"event","gap":0.8,"text":"It sends each change as an event, the moment it happens."},
 {"id":"deleted","gap":0.8,"text":"And it says what was deleted, so a deletion reaches every copy."},
 {"id":"films","gap":0.8,"text":"Contracts and deletions have films of their own: Moving is easy, agreeing is the work, and Deleted means deleted."},
 {"id":"sam","gap":0.8,"text":"Sam Okafor, who runs the data platform, lists the systems the team takes data from."},
 {"id":"sensors","gap":0.8,"text":"The rooms' sensors can do all of it."},
 {"id":"payroll","gap":0.8,"text":"Payroll, on a system from 2004, sends one file a night.","say":"Payroll, on a system from two thousand and four, sends one file a night."},
 {"id":"timetable","gap":0.8,"text":"The new timetable, bought as a service in 2026, can give its changes, but can't say what was deleted.","say":"The new timetable, bought as a service in twenty twenty-six, can give its changes, but can't say what was deleted."},
 {"id":"labs","gap":0.8,"text":"And the Faculty of Health books its nine clinical labs in a spreadsheet."},
 {"id":"short","gap":0.8,"text":"Old systems fall short of the preferred way, and so do new ones."}
]},
"tree":{"name":"A tree for the rest","lead":1.0,"tail":1.0,"vo":[
 {"id":"half","gap":0.8,"text":"So the page gets a second half: a decision tree, for the providers who can't meet it."},
 {"id":"q1","gap":0.8,"text":"First: can it send each change as an event? Then use the events."},
 {"id":"q2","gap":0.8,"text":"If not, can it give its changes since a given time? Then fetch them every hour."},
 {"id":"q3","gap":0.8,"text":"Can it say what was deleted? If not, compare its full list with ours every night. What's gone from its list was deleted."},
 {"id":"q4","gap":0.8,"text":"Only a file? Take the whole file each night, and compare it the same way."},
 {"id":"q5","gap":0.8,"text":"A spreadsheet? A data partner moves it into a governed table, with an owner."},
 {"id":"names","gap":0.8,"text":"The first paths have names: event-driven integration, and change data capture."},
 {"id":"each","gap":0.8,"text":"Every branch ends in a recommendation, and every path still keeps a contract with an owner."},
 {"id":"repo","gap":0.8,"text":"The tree is kept as text in the team's repository, and its picture is drawn from it."}
]},
"gone":{"name":"What the timetable never says","lead":1.0,"tail":1.0,"vo":[
 {"id":"test","gap":0.8,"text":"Monday 14 June: Sam tests the new timetable.","say":"Monday the fourteenth of June: Sam tests the new timetable."},
 {"id":"cancel","gap":0.8,"text":"Mei Tanaka, in the registrar's office, cancels a class. The hourly changes never mention it."},
 {"id":"stays","gap":0.8,"text":"So on the platform, the class stays booked."},
 {"id":"graham","gap":0.8,"text":"Graham Ellis, the Director of Facilities, would see a booked room with nobody in it: a room that looks wasted, when it was free all along."},
 {"id":"vendor","gap":0.8,"text":"The vendor can add deletions to its changes, but not before its renewal, in 2028.","say":"The vendor can add deletions to its changes, but not before its renewal, in twenty twenty-eight."},
 {"id":"tree","gap":0.8,"text":"The tree has the answer: the changes every hour, and the full list of bookings every night."},
 {"id":"compare","gap":0.8,"text":"Each night, a booking on the platform that's missing from the full list is marked deleted."},
 {"id":"live","gap":0.8,"text":"The new timetable goes live on Monday 19 July.","say":"The new timetable goes live on Monday the nineteenth of July."},
 {"id":"found","gap":0.8,"text":"By Friday 30 July, the first week of teaching, the nightly comparison has found 212 deleted bookings the changes never mentioned.","say":"By Friday the thirtieth of July, the first week of teaching, the nightly comparison has found two hundred and twelve deleted bookings the changes never mentioned."},
 {"id":"off","gap":0.8,"text":"212 hours that would have looked booked and empty on Graham's page stay off it.","say":"Two hundred and twelve hours that would have looked booked and empty on Graham's page stay off it."}
]},
"paths":{"name":"Four providers, four paths","lead":1.0,"tail":1.0,"vo":[
 {"id":"sensors","gap":0.8,"text":"The rooms' sensors take the preferred way: each hour's count arrives as an event."},
 {"id":"payroll","gap":0.8,"text":"Payroll's file is taken whole each night and compared, for Finance's casual staff costs."},
 {"id":"weaker","gap":0.8,"text":"A weaker path is checked more often."},
 {"id":"small","gap":0.8,"text":"If a night's file is much smaller than the night before, the comparison stops, and asks a person."},
 {"id":"cut","gap":0.8,"text":"On Tuesday 24 August, payroll's file arrives cut short, and the check stops it before 2,400 staff are marked as gone.","say":"On Tuesday the twenty-fourth of August, payroll's file arrives cut short, and the check stops it before two thousand four hundred staff are marked as gone."},
 {"id":"anil","gap":0.8,"text":"Anil Kurian, the Faculty of Health's data partner, moves the labs' spreadsheet into a governed table, and owns it."},
 {"id":"step","gap":0.8,"text":"And each provider is asked for its next step up, in writing."},
 {"id":"asks","gap":0.8,"text":"The timetable: its deletions, in the 2028 renewal. Payroll: a file of its changes, at its next upgrade. The labs: into the timetable.","say":"The timetable: its deletions, in the twenty twenty-eight renewal. Payroll: a file of its changes, at its next upgrade. The labs: into the timetable."}
]},
"value":{"name":"Value first","lead":1.0,"tail":1.0,"vo":[
 {"id":"lift","gap":0.8,"text":"The team lifts its providers towards the preferred way, a step at a time."},
 {"id":"wait","gap":0.8,"text":"But it never holds the data back, waiting for the ideal."},
 {"id":"page","gap":0.8,"text":"On Thursday 30 September, Graham's page shows every teaching room and every lab, from four sources, by four paths.","say":"On Thursday the thirtieth of September, Graham's page shows every teaching room and every lab, from four sources, by four paths."},
 {"id":"sees","gap":0.8,"text":"Graham doesn't see the paths. He sees counts he can trust."},
 {"id":"one","gap":0.8,"text":"And Helena's page is still one page: the preferred way, the tree, and each provider's next step."}
]},
"monday":{"name":"On Monday","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"The Gateway City took its own cranes to ports that had none, and the box reached them years before their cranes did."},
 {"id":"team","gap":0.8,"text":"Helena's team did the same: a path for every provider, and Graham's counts true from the first week."},
 {"id":"page","gap":0.8,"text":"On Monday, write your preferred way on one page."},
 {"id":"tree","gap":0.8,"text":"Draw the tree for the providers who can't meet it, each branch with its recommendation."},
 {"id":"ask","gap":0.8,"text":"Ask each provider for its next step up, in its contract or its renewal."},
 {"id":"check","gap":0.8,"text":"Check the weaker paths more often, and don't hold value back."},
 {"id":"take","gap":0.8,"text":"One preferred way, a path for every provider, and value first."}
]}
};
