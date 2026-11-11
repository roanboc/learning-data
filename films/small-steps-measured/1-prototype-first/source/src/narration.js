// Prototype first, the opening film of Small steps, measured, the last series of Data management. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years, dates and sums in words). The few longer stops are in breath.js.
const NARR={
"street":{"name":"A street in a weekend","lead":3.0,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"Curitiba, in the south of Brazil. Friday the 19th of May, 1972, six in the evening.","say":"Curitiba, in the south of Brazil. Friday the nineteenth of May, nineteen seventy-two, six in the evening."},
 {"id":"crews","gap":0.8,"text":"City crews arrive by truck in the old centre's main street, Rua XV de Novembro, and close it to cars.","say":"City crews arrive by truck in the old centre's main street, Rua Quinze de Novembro, and close it to cars."},
 {"id":"cars","gap":0.8,"text":"For years, cars and buses had filled it, and people on foot were squeezed to its edges."},
 {"id":"plan","gap":0.8,"text":"One plan was to widen the streets, knocking down buildings from the turn of the century."},
 {"id":"mayor","gap":0.8,"text":"The young mayor, Jaime Lerner, an architect, wanted the street given back to people on foot."},
 {"id":"fear","gap":0.8,"text":"The shopkeepers feared the opposite: without cars, their customers would stay away, and their sales would fall."},
 {"id":"change","gap":0.8,"text":"Arguing over plans on paper couldn't show anyone what the street would be like."},
 {"id":"real","gap":0.8,"text":"So the mayor's team built the real thing, fast."},
 {"id":"saturday","gap":0.8,"text":"On Saturday morning, grey and damp, the street was handed to the people, without ceremony."},
 {"id":"weekend","gap":0.8,"text":"Over the weekend, crews took up the road, laid stones, and put in streetlights and kiosks."},
 {"id":"flowers","gap":0.8,"text":"They planted tens of thousands of flowers."},
 {"id":"drivers","gap":0.8,"text":"The next weekend, drivers came to take the street back."},
 {"id":"painting","gap":0.8,"text":"They found long strips of paper on it, and dozens of children painting."},
 {"id":"sales","gap":0.8,"text":"Within days, the shopkeepers told the newspapers their sales were up a little."},
 {"id":"more","gap":0.8,"text":"Soon they were asking for more of the street."},
 {"id":"today","gap":0.8,"text":"Other streets followed, and fifty years on, it is still a street for people on foot."},
 {"id":"paper","gap":0.8,"text":"The city didn't win the argument on paper. It put the real thing in front of the people who had to decide."},
 {"id":"data","gap":0.8,"text":"A data team can work the same way."},
 {"id":"way","gap":0.8,"text":"Put something real in front of the person who decides, learn from what they do with it, and do it again."}
]},
"question":{"name":"The question behind the dashboard","lead":1.0,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"February 2027. Graham Ellis, the university's new director of Facilities, has a request.","say":"February twenty twenty-seven. Graham Ellis, the university's new director of Facilities, has a request."},
 {"id":"email","gap":0.8,"text":"Could Helena Novak's team make him a dashboard of room use, by Easter?"},
 {"id":"behind","gap":0.8,"text":"The question behind it is bigger: whether to ask the University Council for a new teaching building."},
 {"id":"cost","gap":0.8,"text":"It would cost about A$140 million.","say":"It would cost about a hundred and forty million dollars."},
 {"id":"waited","gap":0.8,"text":"Then the request waits, as every request did: on average, 41 working days from asking to first use.","say":"Then the request waits, as every request did: on average, forty-one working days from asking to first use."},
 {"id":"newway","gap":0.8,"text":"On Tuesday the 30th of March, the team takes it up the new way, as Helena's ninety-day plan set out.","say":"On Tuesday the thirtieth of March, the team takes it up the new way, as Helena's ninety-day plan set out."},
 {"id":"page","gap":0.8,"text":"Ivy Reyes, the team's new analyst, has already drawn its whole route on one page."},
 {"id":"rooms","gap":0.8,"text":"All 186 rooms are on it, the 14 named two ways included.","say":"All one hundred and eighty-six rooms are on it, the fourteen named two ways included."},
 {"id":"data","gap":0.8,"text":"So the prototype starts from real data: thirteen weeks of bookings, and head counts from the rooms' sensors."},
 {"id":"governed","gap":0.8,"text":"Governed from the first day: counts per room, per hour, never a person."}
]},
"real":{"name":"Something real in two weeks","lead":1.0,"tail":1.0,"vo":[
 {"id":"manifesto","gap":0.8,"text":"In 2001, the Agile Manifesto put it plainly: working software over comprehensive documentation.","say":"In two thousand and one, the Agile Manifesto put it plainly: working software over comprehensive documentation."},
 {"id":"first","gap":0.8,"text":"The first round asks one thing: when are the rooms booked, and when are they used, hour by hour?"},
 {"id":"draft","gap":0.8,"text":"On Wednesday the 7th of April, the team's agent drafts a first model, in a minute.","say":"On Wednesday the seventh of April, the team's agent drafts a first model, in a minute."},
 {"id":"wrong","gap":0.8,"text":"It counts booked hours as used ones."},
 {"id":"caught","gap":0.8,"text":"Ivy catches it herself: she reads the agent's notes to the end, and checks the draft against the sensors."},
 {"id":"glossary","gap":0.8,"text":"Room use, as Graham means it, goes into the glossary: people in the room. The model is built from it."},
 {"id":"review","gap":0.8,"text":"Then Jun reviews Ivy's change, the same day."},
 {"id":"fast","gap":0.8,"text":"Fast isn't careless. The agent proposes, people check, and no one approves their own work."},
 {"id":"friday","gap":0.8,"text":"On Friday the 9th of April, ten days after the start, Graham sees the prototype.","say":"On Friday the ninth of April, ten days after the start, Graham sees the prototype."},
 {"id":"heat","gap":0.8,"text":"A heat map of the week, on a dashboard in Databricks."},
 {"id":"mind","gap":0.8,"text":"Helena asks him one question, and will ask it every round: what would change your mind?"},
 {"id":"answer","gap":0.8,"text":"His answer: if the rooms are full all week, he'll ask for the building. If they aren't, he won't."}
]},
"rounds":{"name":"Three rounds, a week each","lead":1.0,"tail":1.0,"vo":[
 {"id":"rounds","gap":0.8,"text":"The work runs in rounds of a week, each ending on a Friday, with the person who decides and the real thing."},
 {"id":"scrum","gap":0.8,"text":"Scrum calls it a sprint review. Here, it's half an hour with Graham, at one screen."},
 {"id":"used","gap":0.8,"text":"On Wednesday the 14th of April, Graham uses it himself, with his team: eleven working days from the start.","say":"On Wednesday the fourteenth of April, Graham uses it himself, with his team: eleven working days from the start."},
 {"id":"waited","gap":0.8,"text":"It had waited about seven weeks before anyone began, like every request."},
 {"id":"took","gap":0.8,"text":"Then the new way took eleven working days, against forty-one."},
 {"id":"back","gap":0.8,"text":"As in Curitiba, the talk changes once people can use the real thing."},
 {"id":"showed","gap":0.8,"text":"And the real thing surprises everyone."},
 {"id":"booked","gap":0.8,"text":"Rooms are booked 38% of the week, but 93% from ten to two, Tuesday to Thursday.","say":"Rooms are booked thirty-eight per cent of the week, but ninety-three per cent from ten to two, Tuesday to Thursday."},
 {"id":"empty","gap":0.8,"text":"In one booked hour in five, nobody comes. When people do come, about half the seats are filled."},
 {"id":"right","gap":0.8,"text":"Everyone was right about what they saw. The average hid both the crowded peak and the empty rooms."},
 {"id":"next","gap":0.8,"text":"At the second review, his answer moves: show me it works in 2030, when Planning expects 6% more students.","say":"At the second review, his answer moves: show me it works in twenty thirty, when Planning expects six per cent more students."}
]},
"enough":{"name":"Stop when it's enough","lead":1.0,"tail":1.0,"vo":[
 {"id":"third","gap":0.8,"text":"Friday the 23rd of April, the third round. The answer is plain: the rooms are short only at the peak.","say":"Friday the twenty-third of April, the third round. The answer is plain: the rooms are short only at the peak."},
 {"id":"move","gap":0.8,"text":"Move about one peak class in six to other hours, and release the bookings nobody uses."},
 {"id":"met","gap":0.8,"text":"That meets the forecast to 2030 without a new building.","say":"That meets the forecast to twenty thirty without a new building."},
 {"id":"stop","gap":0.8,"text":"The decision is served, so the rounds stop. A fourth would only polish it."},
 {"id":"keep","gap":0.8,"text":"What the prototype taught stays in the product: the definition, and the reviewed model."},
 {"id":"owns","gap":0.8,"text":"And the dashboard becomes a product of its own, which Ivy owns from July."},
 {"id":"council","gap":0.8,"text":"In June, Graham takes one page to the University Council."},
 {"id":"decided","gap":0.8,"text":"It puts the building off for two years, and asks for the timetable to change."}
]},
"monday":{"name":"On Monday","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"In Curitiba, a street built in a weekend settled what plans on paper couldn't."},
 {"id":"helena","gap":0.8,"text":"Helena's team did it in three weeks: real data in front of the person who decides, a round at a time."},
 {"id":"define","gap":0.8,"text":"On Monday, put something real in front of the person who decides, within two weeks."},
 {"id":"data","gap":0.8,"text":"Use real data from the start, and govern it."},
 {"id":"ask","gap":0.8,"text":"Ask, every round: what would change your mind?"},
 {"id":"stop","gap":0.8,"text":"Keep the rounds short and fixed, stop when the decision is served, and keep what you learned in the product."},
 {"id":"take","gap":0.8,"text":"Something real in front of them in two weeks; learn; repeat."}
]}
};
