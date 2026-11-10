// The question behind the request, the opening film of Working with people, the second series of Leading data people. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years, dates, sums and shares in words). The few longer stops are in breath.js.
const NARR={
"tower":{"name":"Saving a leaning tower","lead":3.0,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"Pisa, Italy. Its marble bell tower, begun in 1173, has leaned since it was being built, because the ground beneath it is soft.","say":"Pisa, Italy. Its marble bell tower, begun in eleven seventy-three, has leaned since it was being built, because the ground beneath it is soft."},
 {"id":"lean","gap":0.8,"text":"By 1990, its top hangs about four and a half metres out past its base, and each year it leans a little further.","say":"By nineteen ninety, its top hangs about four and a half metres out past its base, and each year it leans a little further."},
 {"id":"pavia","gap":0.8,"text":"In March 1989, a medieval tower in another Italian city, Pavia, had suddenly collapsed, killing four people.","say":"In March nineteen eighty-nine, a medieval tower in another Italian city, Pavia, had suddenly collapsed, killing four people."},
 {"id":"closed","gap":0.8,"text":"In January 1990, Pisa's tower was closed to visitors, for fear it could fall too.","say":"In January nineteen ninety, Pisa's tower was closed to visitors, for fear it could fall too."},
 {"id":"harm","gap":0.8,"text":"Its stone was fragile: a fall could kill anyone near it, and take from the city the tower people cross the world to see."},
 {"id":"risk","gap":0.8,"text":"And any work was a risk: the slightest disturbance to the ground on its leaning side could bring it down."},
 {"id":"change","gap":0.8,"text":"Something had to change, without the work itself toppling it."},
 {"id":"committee","gap":0.8,"text":"That spring, Italy's government appointed an international committee: engineers, architects and experts in old monuments."},
 {"id":"meant","gap":0.8,"text":"Before choosing how, they agreed what saving it would mean: a small change, about half a degree, too little for anyone to see."},
 {"id":"enough","gap":0.8,"text":"But enough to ease the strain on its stone, and steady the ground beneath it."},
 {"id":"method","gap":0.8,"text":"Their method: draw a little soil from under the high, north side, so the tower would settle back towards it."},
 {"id":"trial","gap":0.8,"text":"They tried it first on a test footing, while lead weights on the north side held the tower still."},
 {"id":"soil","gap":0.8,"text":"From February 1999, they did it under the tower itself, a little at a time, and it began to lean back.","say":"From February nineteen ninety-nine, they did it under the tower itself, a little at a time, and it began to lean back."},
 {"id":"note","gap":0.8,"text":"Every day, the engineer in charge signed a note: how the tower had moved, and exactly what to take out next."},
 {"id":"less","gap":0.8,"text":"By the summer of 2001, its top had come back about 45 centimetres, to the lean it had in the early 1800s.","say":"By the summer of two thousand and one, its top had come back about forty-five centimetres, to the lean it had in the early eighteen hundreds."},
 {"id":"reopen","gap":0.8,"text":"In December 2001, it reopened to visitors, still leaning, as it always has.","say":"In December two thousand and one, it reopened to visitors, still leaning, as it always has."},
 {"id":"years","gap":0.8,"text":"Its engineers expect at least two hundred years before it leans as far again."},
 {"id":"data","gap":0.8,"text":"At a university, a request for a dashboard hid a decision worth about A$140 million.","say":"At a university, a request for a dashboard hid a decision worth about a hundred and forty million Australian dollars."},
 {"id":"found","gap":0.8,"text":"Half an hour of listening found it, and one page, agreed in writing, turned it into a question the team could answer."}
]},
"ask":{"name":"A dashboard by Easter","lead":1.0,"tail":1.0,"vo":[
 {"id":"series","gap":0.8,"text":"These three films are about working with the people who ask for data."},
 {"id":"email","gap":0.8,"text":"Thursday 11 February 2027: Graham Ellis, new this year as Director of Facilities, emails the data team.","say":"Thursday the eleventh of February, twenty twenty-seven: Graham Ellis, new this year as Director of Facilities, emails the data team."},
 {"id":"asks","gap":0.8,"text":"“Could I have a dashboard of room use, by Easter?”"},
 {"id":"clear","gap":0.8,"text":"It sounds clear: a thing, and a date."},
 {"id":"guess","gap":0.8,"text":"But a request usually names someone's guess at a solution. What it's for, it doesn't say."},
 {"id":"nobody","gap":0.8,"text":"Build exactly what was asked, and a team can deliver on time and still help nobody."},
 {"id":"helena","gap":0.8,"text":"So Helena Novak, the data manager, asks Graham for half an hour, with Noor, the team's data architect."}
]},
"listen":{"name":"Half an hour, mostly listening","lead":1.0,"tail":1.0,"vo":[
 {"id":"meet","gap":0.8,"text":"Tuesday 16 February, in Graham's office. They ask a few open questions, then mostly listen.","say":"Tuesday the sixteenth of February, in Graham's office. They ask a few open questions, then mostly listen."},
 {"id":"decide","gap":0.8,"text":"What will you decide with it? Whether to ask the University Council for a new teaching building: forty rooms, about A$140 million.","say":"What will you decide with it? Whether to ask the University Council for a new teaching building: forty rooms, about a hundred and forty million dollars."},
 {"id":"when","gap":0.8,"text":"By when? His paper is due on 1 June, and the University Council decides on 24 June. Easter was a guess at a safe date.","say":"By when? His paper is due on the first of June, and the University Council decides on the twenty-fourth of June. Easter was a guess at a safe date."},
 {"id":"who","gap":0.8,"text":"Who else decides? The University Council, on his advice. And the academics will read it closely: they say the rooms are always full."},
 {"id":"trust","gap":0.8,"text":"What do you already trust? What he has seen on his walks: empty corridors on Monday mornings and Friday afternoons."},
 {"id":"mind","gap":0.8,"text":"What would change your mind? If rooms are short at every hour, he'll ask to build. If only at some hours, perhaps not."},
 {"id":"schein","gap":0.8,"text":"Edgar Schein called this humble inquiry: asking what you don't already know, out of real interest in the other person."},
 {"id":"rogers","gap":0.8,"text":"Carl Rogers and Richard Farson called the other half active listening: hearing the whole meaning, then saying it back."},
 {"id":"whys","gap":0.8,"text":"Some teams ask “why?” five times over. Asked bluntly, it can sound like doubt; “what will you decide with it?” gets there kindly."}
]},
"agree":{"name":"Say it back, write it down","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Near the end, Helena says back what she heard: a decision about a building, and a question about how the rooms are used."},
 {"id":"used","gap":0.8,"text":"Graham stops her at one word: by “used”, he means people in the room. A booking isn't use."},
 {"id":"data","gap":0.8,"text":"That one word decides the data: the timetable's bookings, beside the head counts from each room's sensor."},
 {"id":"pisa","gap":0.8,"text":"In Pisa, saving meant half a degree, not a straight tower. Here, use means people in the room, not bookings."},
 {"id":"write","gap":0.8,"text":"Then Noor writes the question down with him, on one page."},
 {"id":"question","gap":0.8,"text":"“Do we have too few rooms, or too few at some hours?”"},
 {"id":"under","gap":0.8,"text":"Under it go the decision, the dates, who decides, what would change his mind, and what “used” means."},
 {"id":"words","gap":0.8,"text":"His own words stay at the top, beside the question, so anyone can see how one became the other."},
 {"id":"reply","gap":0.8,"text":"That afternoon, Graham replies to the page: “Yes, that's it.”"}
]},
"answer":{"name":"What the question gave","lead":1.0,"tail":1.0,"vo":[
 {"id":"wait","gap":0.8,"text":"Then the request waits its turn, like every other, until the team takes it up on Tuesday 30 March.","say":"Then the request waits its turn, like every other, until the team takes it up on Tuesday the thirtieth of March."},
 {"id":"ivy","gap":0.8,"text":"In March, Ivy Reyes, a new graduate analyst, follows that question through the team's work, starting from the page."},
 {"id":"start","gap":0.8,"text":"On 30 March, the team starts from the same page, and by 23 April it has an answer.","say":"On the thirtieth of March, the team starts from the same page, and by the twenty-third of April it has an answer."},
 {"id":"week","gap":0.8,"text":"Across the whole week, the rooms are booked only 38% of the time.","say":"Across the whole week, the rooms are booked only thirty-eight percent of the time."},
 {"id":"peak","gap":0.8,"text":"But between 10:00 and 14:00, Tuesday to Thursday, 93% of them are booked.","say":"But between ten and two, Tuesday to Thursday, ninety-three percent of them are booked."},
 {"id":"empty","gap":0.8,"text":"And one booked hour in five, the sensors counted nobody there."},
 {"id":"so","gap":0.8,"text":"So the answer to his question: not too few rooms, but too few at some hours."},
 {"id":"both","gap":0.8,"text":"The academics were right about the peak, and Graham about Monday mornings: the week's average had hidden both."},
 {"id":"dash","gap":0.8,"text":"A dashboard by Easter might have shown that average, and settled nothing."},
 {"id":"instead","gap":0.8,"text":"Instead, he had an answer to the question his decision turned on, weeks before his paper was due."}
]},
"monday":{"name":"On Monday","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"In Pisa, the committee didn't start by digging. It first agreed what saving the tower would mean."},
 {"id":"daily","gap":0.8,"text":"Then every day, a signed note said how it had moved, and what to do next."},
 {"id":"same","gap":0.8,"text":"Graham's request got the same care: the decision found, the question agreed in writing, and an answer in time."},
 {"id":"form","gap":0.8,"text":"From June, the team's front door, a form, asks five questions like these. A form can ask; listening hears what the answers mean."},
 {"id":"monday","gap":0.8,"text":"On Monday, when someone asks you for a report or a dashboard, ask what they'll decide with it, and by when."},
 {"id":"who","gap":0.8,"text":"Ask who else decides, what they already trust, and what would change their mind."},
 {"id":"listen","gap":0.8,"text":"Listen more than you talk, and say back what you heard."},
 {"id":"write","gap":0.8,"text":"Then write the question down beside their words, and agree it with them."},
 {"id":"take","gap":0.8,"text":"Ask what it's for, and agree it in writing."}
]}
};
