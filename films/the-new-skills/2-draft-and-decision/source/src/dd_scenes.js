/* ===== The draft and the decision: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where the two show the same people.
   Sizes in the 1920 x 1080 frame. */

const DD_LAST="Let the agent draft; you frame, check and decide.";
// the film's number and title at the top left, from the second chapter on
function dd_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"2","The draft and the decision",{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function dd_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const dd_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag, and a pill, that come in at t0 and go at t1 (null: stays)
function dd_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function dd_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}

/* ---------------------------------------------------------------- the people and things that stay put in a room
   Drawn the same in every shot of the room, so the camera glides and only what changes fades. */
// New York, 1997: the champion at the board, the machine's screen across it, its cabinets behind
const DD_NY={tx:660,ty:724,tw:790,champ:[890,566,0.95]};
function dd_nyStage(x,tt){const L={light:"evening",wall:0,warm:0.2},cut=DD_NY.ty-6;
  dd_cabinets(x,1510,744,{t:tt});
  lp_person(x,DD_PEOPLE.champ,DD_NY.champ[0],DD_NY.champ[1],DD_NY.champ[2],{t:tt,cut,light:L});
  lp_table(x,DD_NY.tx,DD_NY.ty,DD_NY.tw,{floor:null});dd_board(x,1100,DD_NY.ty-14,230);dd_crt(x,1322,DD_NY.ty-12,190,{board:1});}
// León, 1998: the two players, the board between them, a computer at each one's hand
function dd_leonStage(x,tt){const L={light:"day",wall:0},cut=718;
  lp_person(x,DD_PEOPLE.champ,770,566,0.95,{t:tt,cut,light:L});lp_person(x,DD_PEOPLE.rival,1370,566,0.95,{t:tt,flip:true,cut,light:L});
  lp_table(x,450,724,1240,{floor:null});dd_board(x,1070,710,250);dd_crt(x,566,712,176,{board:1});dd_crt(x,1580,712,176,{board:1});}
// at home, 2005: the two amateurs, three screens between them; o.moves: each screen's move, o.arrow (0 to 1)
const DD_MOVES={first:[["d4","f5"],["d4","f5"],["d4","b5"]],deep:[["d4","f5"],["d4","f5"],["d4","f5"]]};
function dd_homeDesk(x,tt,o){o=o||{};const L={light:"evening",wall:0.12},cut=734,mv=o.moves||DD_MOVES.first,ar=o.arrow==null?1:o.arrow;
  lp_person(x,DD_PEOPLE.am1,470,592,0.9,{t:tt,cut,light:L});lp_person(x,DD_PEOPLE.am2,1450,592,0.9,{t:tt,flip:true,cut,light:L});
  lp_table(x,260,740,1400,{floor:null});
  [760,960,1160].forEach((sx,i)=>{const m=mv[i],ch=o.change&&i===2?o.change:0;
    dd_lcd(x,sx,726,186,{from:m[0],to:ch>0?(ch<0.5?m[1]:DD_MOVES.deep[2][1]):m[1],arrow:ch>0?Math.abs(1-2*ch)*ar:ar});});}
// the team's room on an April morning: Ivy at her table, her laptop, the team's agent beside her
const DD_IVY=[1560,604,0.92],DD_TBL=[1250,744,620],DD_AG=[1232,500,62];
function dd_ivyDesk(x,tt,o){o=o||{};const lt=o.light||"morning",cut=DD_TBL[1]-6;
  if(o.agent!==false)dd_agent(x,DD_AG[0],DD_AG[1],DD_AG[2],{t:tt,core:o.core,think:o.think,a:o.agentA,floor:DD_TBL[1]-70});
  lp_person(x,"ivy",DD_IVY[0],DD_IVY[1],DD_IVY[2],{t:tt,flip:true,cut,light:{light:lt}});
  lp_table(x,DD_TBL[0],DD_TBL[1],DD_TBL[2]);lp_laptop(x,DD_IVY[0]-10,DD_TBL[1]-22,190,{glow:0.5});}


/* ---------------------------------------------------------------- 1. Two amateurs, three computers: New York 1997, León 1998, online 2005 */
scene("chess",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  // the room's light lowered while the voice says what many feared; a sheet over a dimmed room stays bright
  const veil=(x,a)=>{if(a<=0.004)return;x.save();x.fillStyle="rgba(14,12,16,"+(0.44*a)+")";x.fillRect(0,0,W,H);x.restore();};
  const fr0=w("fear","fear",-0.2),ch0=c.change;
  ag_shots(ctx,S,t,sc.dur,[
    // New York, May 1997: the champion against a computer built for chess; the computer wins; what many feared
    {at:0,place:"ddHall",keys:[[0,960,540,1.06],[c.when+0.6,960,540,1.0]],d:3,draw:(x,tt)=>{
      dd_nyStage(x,tt);veil(x,ag_in(tt,fr0,1.4)*(1-0.5*ag_in(tt,ch0+0.4,1.2)));
      dd_tag(x,tt,w("when","Kasparov",-0.1),fr0,770,470,"Garry Kasparov",{align:"right"});
      dd_tag(x,tt,w("when","computer",-0.1),fr0,1690,232,"A computer built for chess",{align:"center"});
      dd_sheet(x,tt,w("when","May",-0.2),100,120,640,{kick:"New York",title:"May 1997",lines:["Six games: the world champion against a computer"]},{light:null,pin:false,out:c.loses-0.4});
      dd_sheet(x,tt,c.loses+0.1,100,120,660,{kick:"The match",title:"Computer 3½, champion 2½"},{light:null,pin:false,out:fr0});
      dd_sheet(x,tt,fr0+0.1,100,120,660,{kick:"Many fear",title:"What it means for people",lines:["Players spend years learning the game","Many earn their living by it","What is their skill worth now?"]},
        {col:LP.amber,light:null,pin:false,out:ch0+0.1,u:dd_u(tt,[w("players","years",-0.1),w("players","living",-0.1),w("worth","worth",-0.4)])});}},
    // León, 1998: play with the machine, not against it; each player with a computer at hand
    {at:c.leon-0.3,place:"ddLeon",cut:true,keys:[[c.leon-0.3,960,540,1.05],[c.leon+0.4,960,540,1.0]],d:2.4,draw:(x,tt)=>{dd_leonStage(x,tt);
      dd_sheet(x,tt,w("leon","León",-0.1),60,110,580,{kick:"León, Spain · 1998",title:"Advanced chess",sub:"With the machine, not against it"},{light:"day",pin:false});
      dd_tag(x,tt,w("leon","Kasparov",-0.1),null,650,470,"Garry Kasparov",{align:"right"});
      dd_tag(x,tt,w("each","Topalov",-0.1),null,1480,440,"Veselin Topalov");
      dd_tag(x,tt,w("each","choice",-0.3),c.plan-0.2,1070,826,"Each with the chess program of his choice",{align:"center"});
      dd_tag(x,tt,w("plan","tactic",-0.2),null,1070,826,"Every tactic checked by the machine",{align:"center"});
      dd_pill(x,tt,w("plan","plan",-0.1),null,1070,250,"The plan: the player's",{col:LP.blue});}},
    // 2005: an online tournament, open to anyone, in teams, with any computers; three of its entries
    {at:c.free-0.3,place:"ddHome",dis:1.4,keys:[[c.free-0.3,960,540,1.0]],draw:(x,tt)=>{veil(x,1);
      dd_bracket(x,{a:ag_in(tt,c.free+0.2,0.4),k:tt-c.free-0.2,field:ag_in(tt,w("free","anyone",-0.2),1.4),u:dd_u(tt,[w("entrants","Grandmasters",-0.1),w("entrants","supercomputer",-0.1),w("winners","amateur",-0.1)])});
      dd_tag(x,tt,w("free","anyone",-0.1),null,960,790,"Anyone may enter: in teams, with any computers",{align:"center"});}},
    // two amateurs at home: their own experience, three programs compared, deeper where it matters, then their decision
    {at:c.how-0.3,place:"ddHome",later:true,keys:[[c.how-0.3,960,540,1.0]],draw:(x,tt)=>{const cp=w("how","compare",-0.1),dp=w("deeper","deeper",-0.1);
      dd_homeDesk(x,tt,{arrow:ag_in(tt,cp+0.3,0.8),change:clamp((tt-dp-0.3)/1.4,0,1)>=1?0:clamp((tt-dp-0.3)/1.4,0,1),moves:tt>dp+1.7?DD_MOVES.deep:DD_MOVES.first});
      dd_tag(x,tt,w("how","experience",-0.1),null,960,170,"Their own experience: which moves to look at",{align:"center"});
      dd_tag(x,tt,cp,null,960,240,"Compare what each program says",{align:"center"});
      dd_tag(x,tt,dp,null,960,310,"Deeper where it matters",{align:"center"});
      dd_pill(x,tt,w("deeper","decide",-0.1),null,960,400,"Then they decide",{col:LP.blue});}},
    // the final, first prize, and the supercomputer out before the last eight
    {at:c.final-0.3,place:"ddHome",later:true,keys:[[c.final-0.3,960,540,1.0]],draw:(x,tt)=>{veil(x,1);
      dd_bracket(x,{reach:ag_in(tt,c.final+0.1,1.0),final:ag_in(tt,w("final","beat",-0.1),1.0),win:ag_in(tt,w("final","prize",-0.3),1.0),out:ag_in(tt,w("final","supercomputer",-0.1),0.6)});}},
    // Kasparov's lesson
    {at:c.lesson-0.3,place:"ddHome",later:true,keys:[[c.lesson-0.3,960,540,1.0]],draw:(x,tt)=>{veil(x,1);
      dd_sheet(x,tt,c.lesson+0.2,360,170,1200,{kick:"Kasparov's lesson, 2010",title:"Weak players + machine + a better process",lines:["Beat a strong computer alone","Beat strong players + machine + a worse process"]},
        {light:null,pin:false,u:dd_u(tt,[w("lesson","computer",-0.2),w("worse","remarkably",-0.1)])});}},
    // the players' skill still counted; what counted most was how they worked with the machines
    {at:c.counts-0.3,place:"ddHome",later:true,keys:[[c.counts-0.3,960,540,1.0]],draw:(x,tt)=>{dd_homeDesk(x,tt,{moves:DD_MOVES.deep});
      dd_tag(x,tt,w("counts","skill",-0.1),null,960,200,"Their skill still counted",{align:"center"});
      dd_pill(x,tt,w("counts","worked",-0.3),null,960,300,"How they worked with the machines",{col:LP.blue});}},
    // data work's machine: an agent's first draft in a minute; what's left for the people is the part that decides
    {at:c.data-0.3,place:"lpRoom",dis:1.4,keys:[[c.data-0.3,960,540,1.0]],push:0,draw:(x,tt)=>{const d0=w("data","draft",-0.1),l0=w("left","decides",-0.3),g=1-ag_in(tt,c.breath+0.2,0.8);
      if(g<=0.004)return;x.save();x.globalAlpha*=g;
      dd_agent(x,390,470,90,{t:tt,core:0.7,think:ag_io(tt,w("data","write",-0.2),d0+1.6,0.4)});
      dd_sheet(x,tt,d0,560,180,580,{kick:"A first draft",title:"A data model",lines:["Written in a minute"]},{col:LP.violet,light:"day"});
      dd_tag(x,tt,w("ask","leaves",-0.2),l0-0.3,1220,230,"What's left for the people?",{col:LP.amber});
      dd_sheet(x,tt,l0+0.1,1220,180,600,{kick:"The part that decides",lines:["Saying what's wanted","Checking it against what's true","Choosing"]},
        {col:LP.blue,light:"day",u:dd_u(tt,[w("left","saying",-0.1),w("left","checking",-0.1),w("left","choosing",-0.1)])});
      dd_tag(x,tt,w("cheap","cheap",-0.2),null,850,540,"A draft is cheap",{align:"center"});
      dd_pill(x,tt,w("cheap","Judgement",-0.1),null,1520,540,"Judgement isn't",{col:LP.blue});x.restore();}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"The draft and the decision","A draft is cheap; judgement isn't","Leading data people · The new skills");
});

/* ---------------------------------------------------------------- 2. A draft in a minute */
scene("draft",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const rooms=lp_sectionRooms(LP_TEACHING).map(r=>r.id);
  ag_shots(ctx,S,t,sc.dur,[
    // the university: its teaching building, cut open, the rooms in use lit
    {at:0,place:"lpSky",keys:[[0,960,540,1.0]],draw:(x,tt)=>{lp_section(x,LP_TEACHING,{room:(id)=>{const i=rooms.indexOf(id);return{lit:ag_in(tt,0.6+i*0.18,0.6)*((i*7)%5===1?0.25:1)};}});}},
    // Graham's decision, and his question
    {at:w("uni","Graham",-0.5),place:"ddGraham",dis:1.2,keys:[[w("uni","Graham",-0.5),960,540,1.0]],draw:(x,tt)=>{
      dd_sheet(x,tt,w("uni","Graham",-0.1),1000,150,640,{kick:"Director of Facilities",title:"Graham Ellis"},{light:"grey",out:c.q-0.5});
      dd_sheet(x,tt,w("building","Council",-0.2),1000,410,640,{kick:"For the University Council",title:"A new teaching building?"},{light:"grey",out:c.q-0.5});
      dd_sheet(x,tt,w("q","question",-0.1),1000,150,600,{kick:"His question",title:"Too few rooms, or too few at some hours?"},{col:LP.blue,light:"grey"});
      lp_person(x,"graham",560,640,1.0,{t:tt,light:{light:"grey"}});}},
    // Wednesday 7 April 2027: Ivy, and the first model
    {at:c.ivy-0.3,place:"ddMorning",dis:1.2,keys:[[c.ivy-0.3,960,540,1.0]],draw:(x,tt)=>{dd_ivyDesk(x,tt,{agent:false});
      dd_sheet(x,tt,w("ivy","Wednesday",-0.1),140,140,760,{kick:"Wednesday 7 April 2027",title:"Ivy Reyes",sub:"Graduate data analyst",lines:["Her sixth week"]},{light:"morning",out:c.ask-0.8,u:ag_in(tt,w("ivy","sixth",-0.1),0.5)});
      dd_sheet(x,tt,w("ivy","model",-0.1),140,470,760,{kick:"Her task",title:"The first model",lines:["How much each room is used"]},{light:"morning",out:c.ask-0.8,u:ag_in(tt,w("ivy","used",-0.3),0.5)});}},
    // she asks the agent; in a minute the draft is there, tidy, tested, sure of itself
    {at:c.ask-0.3,place:"ddMorning",keys:[[c.ask-0.3,960,540,1.0]],draw:(x,tt)=>{const m0=w("minute","minute",-0.1);
      dd_ivyDesk(x,tt,{agentA:ag_in(tt,w("ask","agent",-0.3),0.6),core:0.6,think:ag_io(tt,w("ask","draft",0),m0+0.6,0.4)});
      dd_sheet(x,tt,w("ask","asks",-0.1),140,140,820,{kick:"Ivy asks the agent",title:"A model of room use, for every room and every teaching hour"},{light:"morning",out:m0-0.4});
      dd_draft(x,140,140,820,{a:ag_in(tt,m0,0.35),k:tt-m0,light:"morning",tick:ag_in(tt,w("tidy","pass",-0.2),0.4)});
      for(const [i,fx,word,words] of [[0,140,"teaching",{kick:"Rooms used",num:"38%",label:"of the teaching week"}],[1,560,"busiest",{kick:"Busiest hours",num:"93%",label:"used"}]]){const f0=w("figure",word,-0.4);
        const a=ag_in(tt,f0,0.35);if(a>0.004)lp_figure(x,fx,470,400,words,{col:LP.violet,light:"morning",a,k:tt-f0});}
      dd_tag(x,tt,w("sure","finished",-0.1),null,990,200,"Looks finished");
      dd_tag(x,tt,w("sure","sure",-0.1),null,990,270,"Sounds sure");
      dd_tag(x,tt,w("almost","open",-0.2),null,1560,284,"About to open a pull request",{align:"center"});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("uni","university",-0.3),c.ivy,0.5)});
  dd_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. What it assumed */
scene("assumed",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // the agent's notes, read to the end: one line stops her
    {at:0,place:"ddMorning",keys:[[0,960,540,1.0]],draw:(x,tt)=>{dd_ivyDesk(x,tt);
      dd_notes(x,140,140,820,{light:"morning",a:ag_in(tt,c.notes+0.3,0.35),k:tt-c.notes-0.3,u:ag_in(tt,c.notes+0.6,1.2),hi:ag_in(tt,w("line","booked",-0.2),0.5)});
      dd_tag(x,tt,w("line","stops",-0.1),null,160,450,"Booked means used?",{col:LP.amber});}},
    // what Graham had said used means
    {at:c.graham-0.3,place:"ddGraham",dis:1.2,keys:[[c.graham-0.3,960,540,1.0]],draw:(x,tt)=>{
      dd_sheet(x,tt,w("graham","Graham",-0.1),1000,150,640,{kick:"Agreed with Graham, February",title:"Used: people in the room",lines:["Not a booking"]},{col:LP.blue,light:"grey",u:ag_in(tt,w("graham","booking",-0.3),0.5)});
      lp_person(x,"graham",560,640,1.0,{t:tt,light:{light:"grey"}});}},
    // the tests pass: they check the data's form, not what Graham means
    {at:c.tests-0.3,place:"ddMorning",dis:1.2,keys:[[c.tests-0.3,960,540,1.0]],draw:(x,tt)=>{dd_ivyDesk(x,tt);
      const go=c.sensors-0.8;
      dd_tests(x,140,140,820,{light:"morning",a:ag_in(tt,c.tests+0.1,0.35)*(1-ag_in(tt,go,0.4)),k:tt-c.tests-0.1,ticks:clamp((tt-w("tests","pass",-0.1))/1.4,0,1)});
      dd_tag(x,tt,w("tests","form",-0.1),go,140,540,"They check the data's form");
      dd_tag(x,tt,w("meaning","know",-0.2),go,140,610,"Not what Graham means",{col:LP.amber});}},
    // checked against the sensors: in one booked hour in five, nobody; the draft calls them all used
    {at:c.sensors-0.3,place:"ddMorning",keys:[[c.sensors-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=w("sensors","sensors",-0.3);dd_ivyDesk(x,tt);
      dd_hours(x,110,140,{light:"morning",a:ag_in(tt,s0,0.35),k:tt-s0,u:ag_in(tt,s0+0.2,1.4),seen:ag_in(tt,w("sensors","count",-0.1),2.6),draft:ag_in(tt,w("fifth","draft",-0.1),0.8)});}},
    // what Graham would have weighed
    {at:c.harm-0.3,place:"ddGraham",dis:1.2,keys:[[c.harm-0.3,960,540,1.0]],draw:(x,tt)=>{
      dd_sheet(x,tt,w("harm","weighed",-0.2),1000,150,640,{kick:"Graham would have weighed",title:"A new teaching building",lines:["On bookings, not on rooms people use"]},{col:LP.amber,light:"grey",u:ag_in(tt,w("harm","bookings",-0.2),0.5)});
      lp_person(x,"graham",560,640,1.0,{t:tt,light:{light:"grey"}});}},
    // nobody careless: the common meaning, said out loud; what it hadn't been given
    {at:c.common-0.3,place:"ddMorning",dis:1.2,keys:[[c.common-0.3,960,540,1.0]],draw:(x,tt)=>{const go=c.task-0.8;dd_ivyDesk(x,tt);
      dd_notes(x,140,140,820,{light:"morning",hi:0.6,a:1-ag_in(tt,go,0.4)});
      dd_tag(x,tt,w("common","timetabling",-0.2),go,140,470,"In timetabling, use often means booked");
      dd_tag(x,tt,w("common","said",-0.1),go,140,540,"It said what it assumed");}},
    {at:c.task-0.3,place:"ddMorning",keys:[[c.task-0.3,960,540,1.0]],draw:(x,tt)=>{dd_ivyDesk(x,tt);
      dd_sheet(x,tt,c.task+0.1,140,140,820,{kick:"What Ivy asked",title:"A model of room use, for every room and every teaching hour"},{light:"morning"});
      dd_pill(x,tt,w("task","task",-0.1),null,290,520,"The task",{col:LP.green,icon:"tick"});
      dd_pill(x,tt,w("task","decision",-0.1),null,560,520,"The decision",{col:LP.amber,icon:"cross"});
      dd_pill(x,tt,w("task","words",-0.1),null,840,520,"The words",{col:LP.amber,icon:"cross"});}}
  ]);
  dd_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Frame it, then ask */
scene("frame",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // first, the word: room use, into the glossary, approved there by its owner
    {at:0,place:"ddMorning",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const g0=w("word","glossary",-0.3);dd_ivyDesk(x,tt);
      dd_pill(x,tt,w("frame","frames",-0.1),g0,1560,284,"First, frame the work",{col:LP.blue});
      dd_glossary(x,140,150,920,560,{a:ag_in(tt,g0,0.4),u:ag_in(tt,w("word","share",-0.2),2.4),owner:ag_in(tt,w("owner","Graham",-0.2),0.4),ok:clamp(tt-w("owner","approves",0.1),0,2)});
      dd_tag(x,tt,w("owner","starts",-0.3),null,600,770,"Every model, and every draft, starts here",{align:"center",col:LP.blue});}},
    // then three things, not one: the decision, the words, what counts
    {at:c.three-0.3,place:"ddMorning",later:true,keys:[[c.three-0.3,960,540,1.0]],draw:(x,tt)=>{const ks=[c.decision,c.words,c.counts].map(t0=>tt-t0-0.1);
      dd_agent(x,960,660,80,{t:tt,core:0.65,think:ag_io(tt,c.counts+1.2,c.draft,0.4),floor:830});
      x.save();x.strokeStyle=rgba(LP.blue,1);x.lineWidth=5;x.lineCap="round";
      ks.forEach((k,i)=>{const u=ag_sine(ag_in(k,0.4,0.8));if(u<=0)return;const sx=120+i*580+270,sy=[370,330,456][i];x.beginPath();x.moveTo(sx,sy);x.lineTo(lerp(sx,960,u),lerp(sy,586,u));x.stroke();});x.restore();
      dd_ask(x,{ks,light:"morning"});}},
    // the new draft, and what it assumed this time
    {at:c.draft-0.3,place:"ddMorning",later:true,keys:[[c.draft-0.3,960,540,1.0]],draw:(x,tt)=>{const go=1-ag_in(tt,c.hand-0.8,0.4);dd_ivyDesk(x,tt);
      dd_draft(x,140,120,820,{v:2,light:"morning",a:ag_in(tt,c.draft+0.3,0.35)*go,k:tt-c.draft-0.3});
      dd_notes(x,140,450,820,{lines:DD_NOTES2,light:"morning",a:ag_in(tt,w("draft","says",-0.1),0.35)*go,k:tt-w("draft","says",-0.1)});}},
    // checked against one room's week, worked out by hand: all fifty hours match
    {at:c.hand-0.3,place:"ddMorning",keys:[[c.hand-0.3,960,540,1.0]],draw:(x,tt)=>{dd_ivyDesk(x,tt);
      dd_week(x,130,140,{light:"morning",a:ag_in(tt,c.hand+0.1,0.35),k:tt-c.hand-0.1,u:ag_in(tt,c.hand+0.3,1.4),marks:clamp((tt-w("hand","hand",-0.2))/2.2,0,1),ticks:clamp((tt-c.match)/1.2,0,1)});
      dd_pill(x,tt,w("match","match",-0.2),null,625,806,"All 50 hours match",{col:LP.green,icon:"tick"});}}
  ]);
  dd_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Someone else approves */
scene("review",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // Ivy's pull request: she's its author, and she answers for it; the reasoning kept with it; Jun's review
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const j0=w("jun","Jun",-0.3);
      lp_person(x,"ivy",1390,650,0.86,{t:tt,flip:true,cut:738,light:dy});lp_person(x,"jun",1730,650,0.86,{t:tt,flip:true,cut:738,light:dy,a:ag_in(tt,j0,0.6)});
      lp_table(x,1170,744,730);lp_laptop(x,1384,722,170,{glow:0.5});lp_laptop(x,1724,722,170,{glow:0.5,a:ag_in(tt,j0,0.6)});
      dd_pr(x,110,150,960,650,{a:ag_in(tt,0.4,0.5),u:dd_u(tt,[w("reason","asked",-0.1),w("reason","assumed",-0.1),w("reason","changed",-0.1),w("reason","checked",-0.1)]),
        rev:ag_in(tt,w("jun","reviews",-0.1),0.5),q:ag_in(tt,w("asks","asks",-0.1),0.5),ans:ag_in(tt,w("asks","answer",-0.2),0.5),
        ok:clamp(tt-w("merge","approves",-0.1),0,2),merged:clamp(tt-w("merge","merged",-0.1),0,2)});
      dd_tag(x,tt,w("pr","author",-0.1),j0,1390,330,"The author answers for it",{align:"center"});
      dd_sheet(x,tt,w("jun","Nobody",-0.1),1140,110,700,{kick:"Nobody approves their own work",lines:["Not Ivy, the author","Never the agent"]},{light:"day",out:w("merge","told",-0.6),u:dd_u(tt,[w("jun","Ivy",-0.1),w("jun","never",-0.1)])});
      dd_sheet(x,tt,w("merge","told",-0.2),1140,110,700,{kick:"Graham is told",lines:["What changed: used means people counted","The first answer to his question"]},{light:"day",u:ag_in(tt,w("merge","answer",-0.3),0.5)});}},
    // the next morning, at stand-up: what she nearly missed, and thanks for saying it
    {at:c.standup-0.3,place:"ddMorning",cut:true,keys:[[c.standup-0.3,960,540,1.0]],draw:(x,tt)=>{
      for(const [who,px,fl] of [["helena",300,false],["jun",660,false],["noor",1020,false],["sam",1380,false],["ivy",1720,true]])lp_person(x,who,px,724,0.74,{t:tt,flip:fl,light:{light:"morning"}});
      dd_sheet(x,tt,c.standup+0.3,140,130,560,{kick:"Thursday 8 April",title:"Stand-up"},{light:"morning",out:w("thanks","asking",-0.8)});
      dd_sheet(x,tt,w("standup","nearly",-0.2),980,130,820,{kick:"What Ivy nearly missed",lines:["I asked for the task, not the decision or the words"]},{light:"morning"});
      dd_tag(x,tt,w("thanks","thanks",-0.1),null,300,462,"Thank you for saying it",{align:"center",col:LP.green});
      dd_sheet(x,tt,w("thanks","asking",-0.3),140,130,560,{kick:"How the team asks an agent",lines:["The decision","The words","What counts"]},{col:LP.blue,light:"morning"});}}
  ]);
  dd_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. The skills that grow */
scene("grows",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // the work moves to either side of the draft
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const e0=w("moves","either",-0.2),u=ag_sine(ag_in(tt,e0,0.8));
      dd_sheet(x,tt,0.8,780,350,340,{kick:"The agent",title:"The draft"},{col:LP.violet,light:"day"});
      if(u>0){x.save();x.strokeStyle=rgba(LP.ink,0.75);x.fillStyle=rgba(LP.ink,0.75);x.lineWidth=7;x.lineCap="round";
        for(const [x0,x1] of [[766,lerp(766,706,u)],[1134,lerp(1134,1194,u)]]){x.beginPath();x.moveTo(x0,448);x.lineTo(x1,448);x.stroke();const dir=Math.sign(x1-x0);
          x.beginPath();x.moveTo(x1+dir*16,448);x.lineTo(x1-dir*8,432);x.lineTo(x1-dir*8,464);x.closePath();x.fill();}x.restore();}
      dd_sheet(x,tt,w("before","Before",-0.1),100,310,580,{kick:"Before the draft",lines:["Frame the question: its decision, its words, what counts","Say exactly what's wanted"]},
        {col:LP.blue,light:"day",u:dd_u(tt,[w("before","framing",-0.1),w("before","saying",-0.1)])});
      dd_sheet(x,tt,w("after","After",-0.1),1220,310,640,{kick:"After the draft",lines:["Check it against what you know is true","Decide","Answer for it"]},
        {light:"day",u:dd_u(tt,[w("after","checking",-0.1),w("after","deciding",-0.1),w("after","answering",-0.1)])});}},
    // employers see it too
    {at:c.wef-0.3,place:"lpRoom",later:true,keys:[[c.wef-0.3,960,540,1.0]],draw:(x,tt)=>{
      dd_sheet(x,tt,c.wef+0.2,360,150,1200,{kick:"World Economic Forum · January 2025",title:"Future of Jobs Report 2025",
        lines:["The core skill employers seek most: analytical thinking","Seven in ten companies call it essential","Rising fastest: AI and big data","Rising too: creative thinking and curiosity"]},
        {light:"day",u:dd_u(tt,[w("wef","analytical",-0.2),w("seven","Seven",-0.1),w("rising","fastest",-0.4),w("rising","creative",-0.1)])});}},
    // what an agent can do, and what it can't take
    {at:c.cant-0.3,place:"lpRoom",later:true,keys:[[c.cant-0.3,960,540,1.0]],draw:(x,tt)=>{
      dd_agent(x,960,470,100,{t:tt,core:0.7,floor:700});
      dd_tag(x,tt,w("cant","draft",-0.1),null,780,390,"It drafts",{align:"right",col:LP.violet});
      dd_tag(x,tt,w("cant","test",-0.1),null,780,460,"It tests its work",{align:"right",col:LP.violet});
      dd_tag(x,tt,w("cant","say",-0.1),null,780,530,"It says what it assumed",{align:"right",col:LP.violet});
      dd_pill(x,tt,w("cant","decision",-0.1),null,1420,420,"The decision stays with a person",{col:LP.blue});
      dd_pill(x,tt,w("cant","responsibility",-0.2),null,1420,500,"And the responsibility",{col:LP.blue});}},
    // films of their own
    {at:c.films-0.3,place:"lpRoom",later:true,keys:[[c.films-0.3,960,540,1.0]],draw:(x,tt)=>{
      dd_sheet(x,tt,c.films+0.1,300,230,620,{kick:"How agents work",title:"What an agent is"},{light:"day"});
      dd_sheet(x,tt,w("films","govern",-0.1),1000,230,620,{kick:"How teams govern them on data",title:"Agents at work on data"},{light:"day"});
      dd_tag(x,tt,w("films","films",-0.1),null,960,560,"Films of their own",{align:"center"});}}
  ]);
  dd_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back to 2005: two amateurs ahead of grandmasters and a supercomputer, by choosing, comparing and deciding
    {at:0,place:"ddHome",keys:[[0,960,540,1.0]],draw:(x,tt)=>{dd_homeDesk(x,tt,{moves:DD_MOVES.deep});
      dd_tag(x,tt,w("back","ahead",-0.1),null,960,170,"Ahead of grandmasters and a supercomputer",{align:"center"});
      dd_tag(x,tt,w("not","choosing",-0.1),null,960,240,"Choosing what to look at",{align:"center"});
      dd_tag(x,tt,w("not","comparing",-0.1),null,960,310,"Comparing",{align:"center"});
      dd_pill(x,tt,w("not","deciding",-0.1),null,960,400,"Deciding",{col:LP.blue});}},
    // Ivy did the same with data
    {at:c.ivy-0.3,place:"ddMorning",dis:1.2,keys:[[c.ivy-0.3,960,540,1.0]],draw:(x,tt)=>{dd_ivyDesk(x,tt);
      dd_tag(x,tt,w("ivy","drafted",-0.1),null,140,200,"The agent drafted in a minute",{col:LP.violet});
      for(const [px,word,s] of [[300,"framed","Framed"],[560,"checked","Checked"],[820,"decided","Decided"]])dd_pill(x,tt,w("ivy",word,-0.1),null,px,300,s,{col:LP.blue});
      dd_sheet(x,tt,w("rooms","counts",-0.2),140,420,820,{kick:"Graham's answer",title:"People in the rooms, not bookings"},{col:LP.green,light:"morning"});}},
    // what to do on Monday; then the agent and Ivy at her table, as the film ends
    {at:c.one-0.3,place:"ddMorning",later:true,keys:[[c.one-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.last-0.2,0.6);dd_ivyDesk(x,tt);
      if(g>0.004){x.save();x.globalAlpha*=g;
        dd_sheet(x,tt,c.one+0.3,100,130,500,{kick:"One",title:"Give the decision, the words, what counts"},{col:LP.blue,light:"morning"});
        dd_sheet(x,tt,c.two+0.1,630,130,500,{kick:"Two",title:"Read what it assumed, to the end"},{light:"morning"});
        dd_sheet(x,tt,c.three+0.1,100,450,500,{kick:"Three",title:"Check it against what you know is true"},{light:"morning"});
        dd_sheet(x,tt,c.four+0.1,630,450,500,{kick:"Four",title:"Never approve your own work",lines:["Keep the reasoning with it"]},{light:"morning"});
        x.restore();}}}
  ]);
  lp_end(ctx,S,t,e0,"The draft and the decision",DD_LAST,"Film 2 of 3","The new skills");
  dd_kick(ctx,S,ag_in(t,c.ivy-0.3,1.2)*(1-ag_in(t,e0,0.8)));
});
ag_cutInto(["assumed","frame","review"]);
