/* Learning Data: From words to data, in English: the series' one pack of labs (training) and scenarios
   (evaluation), for all its films: one lab for each film's main idea, and one situation for each lab. Keep the keys in step with
   learn.es.js. Each lab and each situation is its film's own: assets/from-words-to-data/learn.js loads that film's
   words (assets/<film>/learn.en.js: the lab by its id, the situation by its place "q" in the film's qs) and its bundle, for the
   film's own pictures, only when a visitor opens it. Each lab starts with id, kind, film, chapter, c, name, and each situation with
   type, n, lab, film, as site-tools/build_series.py's series_learn() reads them. */
window.FW={lang:"en",store:"ld-from-words-to-data",
ui:{lab:"Lab",of:"of",inPractice:"In practice",watch:"Watch this part",next:"Next:",makeCall:"Make the call →",
  scenario:"Scenario",score:"Score",answered:"answered",toGo:"to go",good:"Good call",notQuite:"Not quite",
  explore:"Explore this in the lab:",nextQ:"Next scenario",results:"See your results",again:"Start again",check:"Check",
  up:"Move up",down:"Move down",labsLabel:"Labs",qsLabel:"Scenarios",right:"Right.",wrong:"Not quite:",belongs:"it belongs in “{b}”.",
  placed:"{n} of {of} placed.",ready:"All placed: check your answers.",back:"Back",nextStep:"Next step",stepOf:"Step {n} of {of}."},
loading:"Loading the lab…",failed:"This part didn't load. Reload the page to try again.",
labs:[
 {id:"count",kind:"count",film:1,chapter:"paper",c:"#ffd166",name:"Count the credentials"},
 {id:"fit",kind:"pick",film:2,chapter:"logical",c:"#ffd166",name:"Fit and gap"},
 {id:"update",kind:"pick",film:3,chapter:"wrong",c:"#6ebeff",name:"Break the update"},
 {id:"shapes",kind:"pick",film:4,chapter:"argue",c:"#ba96ff",name:"Same question, four shapes"},
 {id:"order",kind:"steps",film:5,chapter:"sync",c:"#78d4dc",name:"Apply the changes in order"},
 {id:"ground",kind:"pick",film:6,chapter:"again",c:"#6eb4ff",name:"Ground the answer"},
 {id:"review",kind:"sort",film:7,chapter:"decide",c:"#ffd166",name:"Approve or reject"}
],
qs:[
 {type:"choice",n:11,lab:"count",film:1,q:0,title:"Two numbers, one question"},
 {type:"choice",n:21,lab:"fit",film:2,q:0,title:"“Our model is standard”"},
 {type:"choice",n:31,lab:"update",film:3,q:0,title:"Three copies of an email"},
 {type:"choice",n:41,lab:"shapes",film:4,q:0,title:"Who said so, and when?"},
 {type:"choice",n:51,lab:"order",film:5,q:1,title:"A revoked award, valid again"},
 {type:"choice",n:61,lab:"ground",film:6,q:0,title:"Confident, and wrong"},
 {type:"choice",n:71,lab:"review",film:7,q:1,title:"A plausible definition"}
],
done:[["Every call made well.", "You can tell a word from the idea it points to, choose the shape a question needs, and keep a meaning true as it changes."], ["Nearly all.", "Look again at the situations you missed, and the labs they point to."], ["A good start.", "Try the labs again: what counts, and where each shape lives, are where most numbers go wrong."], ["Worth another look.", "Watch the films again, then come back: each situation points to the lab that covers it."]]};
