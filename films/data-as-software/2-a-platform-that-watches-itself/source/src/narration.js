// A platform that watches itself, film 2 of 2 of Data as software, in the module Modern data basics. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers and times in words). The few longer stops are in breath.js.
const NARR={
"alarm":{"name":"The 1202 alarm","lead":1.4,"tail":1.0,"vo":[
 {"id":"date","gap":0.8,"text":"The twentieth of July, 1969.","say":"The twentieth of July, nineteen sixty-nine."},
 {"id":"descent","gap":0.8,"text":"Neil Armstrong and Buzz Aldrin are flying their lunar module down to the Moon, its computer steering."},
 {"id":"light","gap":0.8,"text":"Five minutes in, a light comes on, with a code: 1202.","say":"Five minutes in, a light comes on, with a code: twelve oh two."},
 {"id":"more","gap":0.8,"text":"The computer has more work than time."},
 {"id":"ask","gap":0.8,"text":"The crew don't know the code, and ask Houston."},
 {"id":"stakes","gap":0.8,"text":"If the computer stopped, nothing would steer them; if Houston called an abort, they'd turn back without landing."},
 {"id":"seconds","gap":0.8,"text":"Someone had to decide, in seconds."},
 {"id":"built","gap":0.3,"text":"The computer's makers, at MIT, had built it to watch itself:"},
 {"id":"restart","gap":0.8,"text":"with too much to do, it starts again, keeps the steering and its most important work, and drops the rest."},
 {"id":"raised","gap":0.8,"text":"And it raises the alarm, so people can decide."},
 {"id":"bales","gap":0.3,"text":"In Houston, the guidance officer, Steve Bales, twenty-six, had just helped review its alarms:"},
 {"id":"meant","gap":0.8,"text":"1202 meant go on, unless it came too often or the descent went off course.","say":"Twelve oh two meant go on, unless it came too often or the descent went off course."},
 {"id":"go","gap":0.8,"text":"Half a minute after the alarm, the word goes up: go."},
 {"id":"four","gap":0.8,"text":"Four more alarms come; each time, go."},
 {"id":"landed","gap":0.8,"text":"And Eagle lands."},
 {"id":"kept","gap":0.8,"text":"The computer watched itself and said what was wrong, and people who knew decided."},
 {"id":"uni","gap":0.8,"text":"This November, a job that pays the university's casual staff fails one night."},
 {"id":"decide","gap":0.8,"text":"By morning, the platform has found why and proposed a fix, and a person decides."}
]},
"night":{"name":"The night the job failed","lead":0.9,"tail":1.0,"vo":[
 {"id":"casual","gap":0.8,"text":"At the university, casual staff, paid by the hour, claim the hours they teach in an app."},
 {"id":"job","gap":0.8,"text":"On the Monday before each pay day, at ten at night, the claims job builds the hours to pay, and sends them to the payroll system."},
 {"id":"version","gap":0.8,"text":"On Monday the second of November, at 3:02 in the afternoon, a new version of the app goes live.","say":"On Monday the second of November, at two minutes past three in the afternoon, a new version of the app goes live."},
 {"id":"type","gap":0.8,"text":"Tutors can now type their hours as they say them: 1:30 for an hour and a half, where it sent 1.50.","say":"Tutors can now type their hours as they say them: one thirty for an hour and a half, where it sent one point five oh."},
 {"id":"contract","gap":0.8,"text":"Its contract still says decimal hours."},
 {"id":"fails","gap":0.8,"text":"At 22:03, the job fails: it can't read 1:30 as a number.","say":"At three minutes past ten, the job fails: it can't read one thirty as a number."},
 {"id":"waits","gap":0.8,"text":"Nothing wrong reaches payroll: the job stops, and the hours wait."},
 {"id":"noon","gap":0.8,"text":"Payroll needs them by noon on Tuesday, to pay 856 casual staff on Thursday.","say":"Payroll needs them by noon on Tuesday, to pay eight hundred and fifty-six casual staff on Thursday."}
]},
"watch":{"name":"Watching overnight","lead":0.9,"tail":1.0,"vo":[
 {"id":"watching","gap":0.8,"text":"But the platform is watching."},
 {"id":"sam","gap":0.3,"text":"Sam, who runs the platform, has Genie ZeroOps watching the pay run's jobs and tables:"},
 {"id":"agent","gap":0.8,"text":"an agent that works in the background, with nobody asking."},
 {"id":"detect","gap":0.8,"text":"It finds the failure, at 22:03.","say":"It finds the failure, at three minutes past ten."},
 {"id":"cause","gap":0.8,"text":"It traces the cause through lineage, to the claims app's table, where the hours changed form at 3:02.","say":"It traces the cause through lineage, to the claims app's table, where the hours changed form at two minutes past three."},
 {"id":"touches","gap":0.8,"text":"It says what the failure touches: the hours for the payroll system, payroll's export, and casual teaching cost."},
 {"id":"fix","gap":0.8,"text":"And it proposes a fix: read 1:30 as one and a half.","say":"And it proposes a fix: read one thirty as one and a half."},
 {"id":"inbox","gap":0.8,"text":"By morning, it's one insight in Sam's inbox, and nothing in production has changed."},
 {"id":"knows","gap":0.8,"text":"It can trace only what the platform knows, so keep the lineage, and who owns what."}
]},
"approve":{"name":"A person approves","lead":0.9,"tail":1.0,"vo":[
 {"id":"tuesday","gap":0.8,"text":"Tuesday, half past eight."},
 {"id":"checks","gap":0.8,"text":"Sam checks the cause against the claims, and asks the agent to push its fix to a new branch."},
 {"id":"asks","gap":0.8,"text":"It pushes only when a person asks, and confirms."},
 {"id":"pr","gap":0.8,"text":"Sam opens a pull request, and its tests run, as they do for every change."},
 {"id":"noor","gap":0.8,"text":"Then someone who didn't write it approves: Noor, at 9:05.","say":"Then someone who didn't write it approves: Noor, at five past nine."},
 {"id":"never","gap":0.8,"text":"An agent never approves."},
 {"id":"runs","gap":0.8,"text":"At 9:20, the job runs again, and payroll has the hours by ten.","say":"At twenty past nine, the job runs again, and payroll has the hours by ten."},
 {"id":"paid","gap":0.8,"text":"On Thursday, 856 casual staff are paid, Linh Nguyen among them.","say":"On Thursday, eight hundred and fifty-six casual staff are paid, Linh Nguyen among them."},
 {"id":"proposes","gap":0.8,"text":"The platform proposes; a person approves."}
]},
"contract":{"name":"The contract first","lead":0.9,"tail":1.0,"vo":[
 {"id":"mended","gap":0.8,"text":"The fix mended the night, not its cause."},
 {"id":"good","gap":0.8,"text":"The app's change was a good one, for tutors; what was missing was a step."},
 {"id":"first","gap":0.8,"text":"So Sam's pull request also asks Ingrid Holm, in HR, who owns the claims' data, to change the contract first, next time."},
 {"id":"knows","gap":0.8,"text":"Then everyone who reads the hours knows, before the app changes."},
 {"id":"apollo","gap":0.3,"text":"On Apollo 11, the cause took a night to find:","say":"On Apollo eleven, the cause took a night to find:"},
 {"id":"document","gap":0.8,"text":"a document between two systems had said too little, so a radar's electronics took about 13% of the computer's time.","say":"a document between two systems had said too little, so a radar's electronics took about thirteen percent of the computer's time."},
 {"id":"checklist","gap":0.8,"text":"For the next missions, the checklist changed, and the software learned to check."}
]},
"close":{"name":"Don't reinvent the wheel","lead":0.9,"tail":1.0,"vo":[
 {"id":"old","gap":0.8,"text":"Watching systems isn't new: site reliability engineers have done it for years, with alerts, people on call and blameless reviews."},
 {"id":"now","gap":0.8,"text":"What's new is that the platform does the first hours of the work, overnight."},
 {"id":"choose","gap":0.8,"text":"Choose what it watches, keep the lineage and the owners it reads, and decide who reviews and who approves."},
 {"id":"wheel","gap":0.3,"text":"There are already standards, so don't reinvent the wheel:"},
 {"id":"iterate","gap":0.8,"text":"investigate, adapt, implement, iterate, starting from the official docs."}
]}
};
