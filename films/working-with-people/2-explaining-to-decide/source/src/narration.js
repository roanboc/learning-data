// Explaining so people can decide, the second film of Working with people, the second series of Leading data people. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years, dates and numbers in words). The few longer stops are in breath.js.
const NARR={
"pilot":{"name":"No average pilot","lead":3.0,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"In 1950, the United States Air Force measured more than four thousand of its flyers: 132 measurements each.","say":"In nineteen fifty, the United States Air Force measured more than four thousand of its flyers: a hundred and thirty-two measurements each."},
 {"id":"why","gap":0.8,"text":"The figures went to the people who designed what flyers wear and where they sit: suits, helmets, cockpits."},
 {"id":"avg","gap":0.8,"text":"Many designers took one figure from them: the average man, about five foot nine."},
 {"id":"easy","gap":0.8,"text":"He seemed the easiest flyer to fit, and the commonest."},
 {"id":"door","gap":0.8,"text":"But a doorway built to his height would make about half the men stoop."},
 {"id":"cockpit","gap":0.8,"text":"In a cockpit it's worse: a control just out of reach, or a pedal too far away, and a pilot can't fly safely."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"daniels","gap":0.8,"text":"In 1952, Lieutenant Gilbert Daniels was a scientist in the Air Force's anthropology section.","say":"In nineteen fifty-two, Lieutenant Gilbert Daniels was a scientist in the Air Force's anthropology section."},
 {"id":"asked","gap":0.8,"text":"He asked a plain question: how many flyers are average?"},
 {"id":"ten","gap":0.8,"text":"He took ten measurements used to size clothing."},
 {"id":"band","gap":0.8,"text":"On each, a man counted as average if he was in the middle thirty percent: a generous band."},
 {"id":"height","gap":0.8,"text":"Of 4,063 men, 1,055 were average in height.","say":"Of four thousand and sixty-three men, one thousand and fifty-five were average in height."},
 {"id":"chest","gap":0.8,"text":"Of those, 302 were average in chest too.","say":"Of those, three hundred and two were average in chest too."},
 {"id":"fewer","gap":0.8,"text":"Each measurement left fewer: 143, 73, 28, 12, 6, 3, 2.","say":"Each measurement left fewer: a hundred and forty-three, seventy-three, twenty-eight, twelve, six, three, two."},
 {"id":"none","gap":0.8,"text":"Average on all ten: not one."},
 {"id":"note","gap":0.8,"text":"His note, seven pages long, said so in its first lines: it is virtually impossible to find an average man in the Air Force."},
 {"id":"range","gap":0.8,"text":"Then it showed what a design turns on: the range. From five foot five to six foot one fits nine flyers in ten."},
 {"id":"fit","gap":0.8,"text":"Designers came to fit the range, not the average."},
 {"id":"seats","gap":0.8,"text":"By the 1970s, the Air Force designed its cockpits for the middle ninety pilots in every hundred.","say":"By the nineteen seventies, the Air Force designed its cockpits for the middle ninety pilots in every hundred."},
 {"id":"adjust","gap":0.8,"text":"The seats rise and fall, and the pedals move."},
 {"id":"car","gap":0.8,"text":"A car's seat slides for the same reason."},
 {"id":"data","gap":0.8,"text":"Data has its average men too: one number that seems to describe everything, and describes almost nothing."},
 {"id":"lead","gap":0.8,"text":"Lead with the decision, show the part of the data it turns on, and the people who decide can see what they're choosing."}
]},
"page":{"name":"One page for the University Council","lead":1.0,"tail":1.0,"vo":[
 {"id":"uni","gap":0.8,"text":"At a university, a year from now, Graham Ellis is the Director of Facilities."},
 {"id":"ask","gap":0.8,"text":"He must decide whether to ask the University Council for a new teaching building: forty rooms, about A$140 million.","say":"He must decide whether to ask the University Council for a new teaching building: forty rooms, about a hundred and forty million dollars."},
 {"id":"full","gap":0.8,"text":"It was proposed because the rooms are always full."},
 {"id":"q","gap":0.8,"text":"In February, the data team agreed his question with him, in writing: do we have too few rooms, or too few at some hours?"},
 {"id":"april","gap":0.8,"text":"By late April, they had the answer: too few, only at some hours."},
 {"id":"june","gap":0.8,"text":"Now he must put it to the University Council on one page, by Tuesday 1 June.","say":"Now he must put it to the University Council on one page, by Tuesday the first of June."},
 {"id":"ivy","gap":0.8,"text":"Ivy Reyes, a data analyst, drafts it with Helena Novak, the data manager."},
 {"id":"draft","gap":0.8,"text":"Her first draft runs to twelve pages, in the order the work was done: the data, the method, the checks, and on page nine, the answer."},
 {"id":"chart","gap":0.8,"text":"Its first chart is the week's average: rooms booked 38% of the time.","say":"Its first chart is the week's average: rooms booked thirty-eight percent of the time."},
 {"id":"thesis","gap":0.8,"text":"It's how a thesis is written, and nothing in it is wrong."},
 {"id":"who","gap":0.8,"text":"Helena asks one question: who will read it, and what will they decide with it?"}
]},
"first":{"name":"The decision first","lead":1.0,"tail":1.0,"vo":[
 {"id":"pile","gap":0.8,"text":"The University Council's members read a pile of papers before each meeting, and decide on each."},
 {"id":"start","gap":0.8,"text":"So the page starts where they start: with the decision."},
 {"id":"minto","gap":0.8,"text":"Barbara Minto called it the pyramid: the answer at the top, then the reasons, then the evidence under each."},
 {"id":"decision","gap":0.8,"text":"Ivy's page opens with the decision: a new building now, or not yet?"},
 {"id":"answer","gap":0.8,"text":"Then the answer to the agreed question, in one sentence: rooms are short only from ten to two, Tuesday to Thursday."},
 {"id":"three","gap":0.8,"text":"Under it, three lines: the peak, the bookings nobody used, and what it would take not to build."},
 {"id":"back","gap":0.8,"text":"The method and the other charts move to the back, for anyone who wants them."},
 {"id":"seats","gap":0.8,"text":"So does one true finding: when people came, rooms were about half full."},
 {"id":"holds","gap":0.8,"text":"The decision doesn't turn on it: a half-full room still holds a class."}
]},
"turns":{"name":"What it turns on","lead":1.0,"tail":1.0,"vo":[
 {"id":"hides","gap":0.8,"text":"Now the chart. The week's average, 38%, hides what the decision turns on.","say":"Now the chart. The week's average, thirty-eight percent, hides what the decision turns on."},
 {"id":"map","gap":0.8,"text":"So Ivy draws the whole week: a heat map, the days down the side, the hours across, each hour as dark as the share of rooms booked."},
 {"id":"peak","gap":0.8,"text":"From ten to two, Tuesday to Thursday, 93% of rooms are booked. Most other hours, about one in five.","say":"From ten to two, Tuesday to Thursday, ninety-three percent of rooms are booked. Most other hours, about one in five."},
 {"id":"right","gap":0.8,"text":"The academics who said the rooms are always full were right, at the peak."},
 {"id":"corridors","gap":0.8,"text":"So were Facilities, who saw empty corridors on Monday mornings and Friday afternoons."},
 {"id":"daniels","gap":0.8,"text":"Like Daniels's count, one picture shows what the average hid.","say":"Like Daniels' count, one picture shows what the average hid."},
 {"id":"used","gap":0.8,"text":"And booked isn't used: in one booked hour in five, the sensors counted nobody."},
 {"id":"tufte","gap":0.8,"text":"Edward Tufte's advice for charts: above all else, show the data."},
 {"id":"knaflic","gap":0.8,"text":"Cole Nussbaumer Knaflic's: know who you're showing, and the one thing they need to see."},
 {"id":"together","gap":0.8,"text":"So Ivy draws the picture as she writes the page, never after: the page says what to decide, and the picture shows what it turns on."},
 {"id":"route","gap":0.8,"text":"Helena, who thinks like an architect, keeps the same rule for anything that crosses teams: its route, in one picture."}
]},
"unknown":{"name":"What isn't known, in their words","lead":1.0,"tail":1.0,"vo":[
 {"id":"take","gap":0.8,"text":"Beside the picture, what it would take not to build: move about one peak class in six to other hours, and release booked rooms nobody uses."},
 {"id":"forecast","gap":0.8,"text":"That meets Planning's forecast to 2030: six percent more students.","say":"That meets Planning's forecast to twenty thirty: six percent more students."},
 {"id":"unknown","gap":0.8,"text":"What isn't known goes on the page too: how many students there will really be by 2030.","say":"What isn't known goes on the page too: how many students there will really be by twenty thirty."},
 {"id":"holds","gap":0.8,"text":"So it says how far the answer holds: even if students grew twice as fast, the peak would be no fuller than it is today."},
 {"id":"mei","gap":0.8,"text":"Before it goes, Ivy tries it on Mei, from the registrar's office, who wasn't in the work."},
 {"id":"says","gap":0.8,"text":"Mei reads it in two minutes, and says it back."},
 {"id":"word","gap":0.8,"text":"She stops at one word: utilisation. To her, it means seats filled. On the page, it meant rooms booked."},
 {"id":"words","gap":0.8,"text":"So the page says booked and used instead, each with what it means, in a line."},
 {"id":"which","gap":0.8,"text":"Then she asks what the University Council will ask: which classes would move?"},
 {"id":"plan","gap":0.8,"text":"The page answers: the registrar's office would plan it with the faculties, from Semester 1 2028.","say":"The page answers: the registrar's office would plan it with the faculties, from Semester one, twenty twenty-eight."},
 {"id":"same","gap":0.8,"text":"Everyone gets the same page, with the same numbers: the University Council, the faculties and the registrar's office."}
]},
"decide":{"name":"They decide","lead":1.0,"tail":1.0,"vo":[
 {"id":"sends","gap":0.8,"text":"On Tuesday 1 June, Graham sends the page under his own name, with the week's picture beside it.","say":"On Tuesday the first of June, Graham sends the page under his own name, with the week's picture beside it."},
 {"id":"meets","gap":0.8,"text":"On Thursday 24 June, the University Council meets.","say":"On Thursday the twenty-fourth of June, the University Council meets."},
 {"id":"asks","gap":0.8,"text":"Its members ask how sure the growth is, and which classes would move: both answered on the page."},
 {"id":"defers","gap":0.8,"text":"They defer the building for two years, and ask for the timetable change from Semester 1 2028, with a review in June 2029.","say":"They defer the building for two years, and ask for the timetable change from Semester one, twenty twenty-eight, with a review in June twenty twenty-nine."},
 {"id":"argued","gap":0.8,"text":"Afterwards, Graham says the meeting argued about the choice, not about the numbers."},
 {"id":"see","gap":0.8,"text":"The page didn't decide for them. It let them see what they were choosing."}
]},
"monday":{"name":"On Monday","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Daniels didn't design a cockpit. He counted, said plainly what the count meant, and left the design to the designers."},
 {"id":"ivy","gap":0.8,"text":"Ivy's page did the same: the decision first, the peak beside the average, and the choice left to the people who make it."},
 {"id":"one","gap":0.8,"text":"On Monday, start with the decision, then the answer, in one sentence."},
 {"id":"two","gap":0.8,"text":"Show what it turns on, the peak and the spread, in a picture you draw as you write."},
 {"id":"three","gap":0.8,"text":"Say what you don't know, in your readers' words, with the same numbers for everyone."},
 {"id":"four","gap":0.8,"text":"Try it on someone who wasn't in the work. Then let the people who decide, decide."},
 {"id":"take","gap":0.8,"text":"Lead with the decision; show what it turns on."}
]}
};
