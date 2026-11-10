/* Learning Data: In the weeds of data crafting, in English: the series' one pack of labs (training) and scenarios
   (evaluation), for all its films: one lab for each film's main idea, and one situation for each lab. Keep the keys in step with
   learn.es.js. Each lab and each situation is its film's own: assets/from-words-to-data/learn.js loads that film's
   words (assets/<film>/learn.en.js: the lab by its id, the situation by its place "q" in the film's qs) and its bundle, for the
   film's own pictures, only when a visitor opens it. Each lab starts with id, kind, film, chapter, c, name, and each situation with
   type, n, lab, film, as site-tools/build_series.py's series_learn() reads them. */
window.FW={lang:"en",store:"ld-in-the-weeds",
ui:{lab:"Lab",of:"of",inPractice:"In practice",watch:"Watch this part",next:"Next:",makeCall:"Make the call →",
  scenario:"Scenario",score:"Score",answered:"answered",toGo:"to go",good:"Good call",notQuite:"Not quite",
  explore:"Explore this in the lab:",nextQ:"Next scenario",results:"See your results",again:"Start again",check:"Check",
  up:"Move up",down:"Move down",labsLabel:"Labs",qsLabel:"Scenarios",right:"Right.",wrong:"Not quite:",belongs:"it belongs in “{b}”.",
  placed:"{n} of {of} placed.",ready:"All placed: check your answers.",back:"Back",nextStep:"Next step",stepOf:"Step {n} of {of}.",repo:"See it in the project:"},
loading:"Loading the lab…",failed:"This part didn't load. Reload the page to try again.",
labs:[
 {id:"blueprint",kind:"sort",film:1,chapter:"name",c:"#9fc4ff",name:"Blueprint or building work?"},
 {id:"scope",kind:"pick",film:2,chapter:"ask",c:"#78d79b",name:"Scope it"},
 {id:"same",kind:"pick",film:3,chapter:"apart",c:"#ffd166",name:"Same learner?"},
 {id:"grain",kind:"compose",film:4,chapter:"grain",c:"#e6b8ff",name:"Declare the grain"},
 {id:"catch",kind:"pick",film:5,chapter:"tests",c:"#9cd678",name:"Which test catches it?"},
 {id:"once",kind:"count",film:6,chapter:"once",c:"#78d79b",name:"One rule, twice"},
 {id:"access",kind:"pick",film:7,chapter:"access",c:"#b29cff",name:"Public or protected?"},
 {id:"review",kind:"pick",film:8,chapter:"shortcut",c:"#6fd6c8",name:"Review the agent's pull request"},
 {id:"affected",kind:"count",film:9,chapter:"version",c:"#78d79b",name:"Who's affected?"}
],
qs:[
 {type:"choice",n:11,lab:"blueprint",film:1,q:0,title:"Where is the model?"},
 {type:"choice",n:21,lab:"scope",film:2,q:0,title:"Model everything first?"},
 {type:"choice",n:31,lab:"same",film:3,q:0,title:"Two accounts, one student ID"},
 {type:"choice",n:41,lab:"grain",film:4,q:1,title:"The census number in the app"},
 {type:"choice",n:51,lab:"catch",film:5,q:3,title:"True or false: the primary key"},
 {type:"choice",n:61,lab:"once",film:6,q:4,title:"A second sum"},
 {type:"choice",n:71,lab:"access",film:7,q:0,title:"Already there"},
 {type:"choice",n:81,lab:"review",film:8,q:2,title:"Green, and 40 rows different"},
 {type:"choice",n:91,lab:"affected",film:9,q:2,title:"Only one mart"}
],
done:[["Every call made well.", "You can declare a model before you build it, keep each rule in one place, prove it with tests, and review a change before it lands."], ["Nearly all.", "Look again at the situations you missed, and the labs they point to."], ["A good start.", "Try the labs again: the grain, the tests and the reviews are where most changes go wrong."], ["Worth another look.", "Watch the films again, then come back: each situation points to the lab that covers it."]]};
