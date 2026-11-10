/* ===== Every area, one job: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const EA_TITLE="Every area, one job";
const EA_LAST="See every area as one job; plan ninety days in three lanes.";
const EA_MOD={module:"Data management",mark:dm_mark};
function ea_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1",EA_TITLE,{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function ea_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const ea_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
function ea_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function ea_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
const EA_OUT={light:"day",wall:0},EA_LAMP={light:"evening",warm:0.24,shade:0.3,wall:0.1},EA_MO={light:"morning"},EA_LATE={light:"late"};
// the three drills' progress at t: Plan B breaks through at tb; A and C still on their way
function ea_dr(t,t0,tb){const u=clamp((t-t0)/(tb-t0),0,1);return[0.62*ag_sine(u)+0.0,0.78*ag_sine(u),ag_sine(u)];}

/* ---------------------------------------------------------------- 1. Every part, at once: the San José mine, 2010 */
scene("rescue",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const fall0=w("fall","gives",-0.1),tb=w("through","breaks",-0.2),d0=c.drills+0.4;
  // the mine as it is from the fall on: its ramp, the block, the lit shelter and its 33 lamps
  const mine=(x,o)=>ea_mine(x,Object.assign({ramp:1,fall:1,lamps:1,shelter:1},o));
  ag_shots(ctx,S,t,sc.dur,[
    // the Atacama by day; where and when
    {at:0,place:"eaDesert",keys:[[0,880,560,1.12],[0.1,1060,540,1.04]],d:9,draw:(x,tt)=>{
      ea_sheet(x,tt,w("when","Chile",-0.2),120,130,640,{kick:"Chile, the Atacama desert",title:"5 August 2010"},{light:null,pin:false});}},
    // the mountain cut open: the ramp down, the miners at work, deep in it
    {at:c.mine-0.3,place:"eaSection",keys:[[c.mine-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      ea_mine(x,{ramp:ag_in(tt,c.mine+0.3,3.2),lamps:ag_in(tt,w("mine","deep",-0.2),1.6),shelter:ag_in(tt,w("mine","deep",-0.4),0.8)});
      ea_tag(x,tt,w("mine","San",-0.2),null,1500,130,"The San José mine: copper and gold",{align:"center",col:LP.ink});
      ea_tag(x,tt,w("mine","Thirty",-0.1),null,1455,700,"33 miners",{align:"center",col:LP.ink});}},
    // the rock gives way: a block closes the ramp
    {at:c.fall-0.3,place:"eaSection",keys:[[c.fall-0.3,960,540,1.0],[c.fall-0.2,1080,480,1.3]],d:1.8,draw:(x,tt)=>{
      mine(x,{fall:ag_in(tt,fall0,0.9),block:ag_in(tt,w("fall","closes",-0.1),0.4)});
      ea_tag(x,tt,w("fall","seven",-0.1),null,1110,300,"About 700,000 tonnes",{align:"center",col:LP.amber});
      ea_tag(x,tt,w("fall","road",-0.2),null,1110,600,"Their road out, closed",{align:"center",col:LP.amber});
      ea_tag(x,tt,w("mine","San",-0.2),c.fall+0.4,1500,130,"The San José mine: copper and gold",{align:"center",col:LP.ink});
      ea_tag(x,tt,w("mine","Thirty",-0.1),c.fall+0.4,1455,700,"33 miners",{align:"center",col:LP.ink});}},
    // trapped about 700 m down, with a shelter and food for two or three days
    {at:c.trapped-0.3,place:"eaSection",keys:[[c.trapped-0.3,1080,480,1.3],[c.trapped-0.2,1300,660,1.6]],d:1.8,draw:(x,tt)=>{
      mine(x,{block:1-ag_in(tt,c.trapped,0.6)});
      ea_tag(x,tt,w("fall","seven",-0.1),c.trapped+0.2,1110,300,"About 700,000 tonnes",{align:"center",col:LP.amber});
      ea_tag(x,tt,w("fall","road",-0.2),c.trapped+0.2,1110,600,"Their road out, closed",{align:"center",col:LP.amber});
      ea_tag(x,tt,w("trapped","seven",-0.1),null,1455,700,"About 700 metres down",{align:"center",col:LP.ink});
      ea_tag(x,tt,w("trapped","shelter",-0.1),null,1300,845,"A small shelter, food for two or three days",{align:"center",col:LP.amber});}},
    // above, nobody knows; their families come to the gate
    {at:c.unknown-0.3,place:"eaGate",keys:[[c.unknown-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      [["f1",250,0],["f2",560,0.5],["f3",1360,1.0],["f4",1670,1.4]].forEach(([k,px,dl],n)=>lp_person(x,EA_PEOPLE[k],px,680,0.8,{t:tt+n,flip:px>960,a:ag_in(tt,w("unknown","families",-0.6)+dl*0.5,0.7),light:EA_OUT}));
      ea_sheet(x,tt,w("unknown","nobody",-0.1),700,130,520,{title:"Are they alive?",lines:["Nobody knows"]},{col:LP.amber,light:null,pin:false,out:c.starve-0.6,u:ag_in(tt,w("unknown","alive",-0.1),0.5)});
      ea_sheet(x,tt,c.starve+0.1,700,130,520,{kick:"Without help",lines:["The men will starve","Their families may never know"]},
        {col:LP.amber,light:null,pin:false,out:c.must-0.6,u:ea_u(tt,[w("starve","starve",-0.2),w("starve","families",-0.2)])});
      ea_sheet(x,tt,c.must+0.1,700,130,520,{title:"They have to be found, and brought up"},{light:null,pin:false,out:c.hard-0.6});}},
    // what a rescue takes, all at once; and any one plan could fail
    {at:c.hard-0.3,place:"eaSection",keys:[[c.hard-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{mine(x,{});
      [["Drilling","drilling",250],["Medicine","medicine",560],["Food","food",820],["Engineering","engineering",1080],["The families' trust","trust",1420]].forEach(([s,wd,px])=>
        ea_tag(x,tt,w("hard",wd,-0.15),null,px,130,s,{align:"center",col:LP.ink}));
      ea_pill(x,tt,w("hard","fail",-0.4),null,700,846,"Any one plan could fail",{col:LP.amber,icon:"wait"});}},
    // the engineer in charge
    {at:c.lead-0.3,place:"eaCamp",keys:[[c.lead-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      lp_person(x,EA_PEOPLE.engineer,480,650,1.0,{t:tt,light:EA_OUT});
      ea_sheet(x,tt,w("lead","engineer",-0.3),880,150,700,{kick:"In charge of the rescue",title:"André Sougarret",lines:["A mining engineer"]},{light:null,pin:false,out:c.parts-0.6,u:ag_in(tt,w("lead","Sougarret",0),0.5)});
      // each part, and who leads it
      [["Drills","Engineers","engineers",790],["Health","Doctors","doctors",1145],["Families","Ministers","ministers",1500]].forEach(([k2,ti,wd,px])=>
        ea_sheet(x,tt,w("parts",wd,-0.2),px,150,340,{kick:k2,title:ti},{col:LP.blue,light:null,pin:false}));
      ea_tag(x,tt,w("camp","Esperanza",-0.1),null,1500,800,"The camp: Esperanza, hope",{align:"center",col:LP.ink});}},
    // underground: the shift foreman holds the 33 together
    {at:c.urzua-0.3,place:"eaShelter",keys:[[c.urzua-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      lp_person(x,EA_PEOPLE.m1,380,700,0.84,{t:tt,light:EA_LAMP});lp_person(x,EA_PEOPLE.m2,720,710,0.84,{t:tt+1.3,light:EA_LAMP});
      lp_person(x,EA_PEOPLE.m3,1060,700,0.84,{t:tt+2.1,light:EA_LAMP});lp_person(x,EA_PEOPLE.urzua,1460,650,0.94,{t:tt,flip:true,light:EA_LAMP});
      ea_sheet(x,tt,w("urzua","Luis",-0.3),1250,110,560,{kick:"The shift foreman",title:"Luis Urzúa"},{light:null,pin:false,out:c.note-0.6});
      ea_sheet(x,tt,w("ration","Food",-0.1),110,110,620,{kick:"Food for two or three days",title:"Made to last two weeks"},{col:LP.amber,light:null,pin:false,out:c.jobs-0.6});
      ea_pill(x,tt,w("jobs","vote",-0.3),null,960,206,"Decisions put to a vote",{col:LP.ink});
      ea_tag(x,tt,w("jobs","sick",-0.3),null,380,350,"Cares for the sick",{align:"center",col:LP.ink});
      ea_tag(x,tt,w("jobs","prayers",-0.3),null,720,350,"Leads prayers",{align:"center",col:LP.ink});
      ea_tag(x,tt,w("jobs","diary",-0.3),null,1060,350,"Keeps a diary",{align:"center",col:LP.ink});}},
    // day 17: a narrow drill finds them, and comes back up with a note
    {at:c.note-0.3,place:"eaSection",keys:[[c.note-0.3,1150,520,1.25]],dis:1.4,draw:(x,tt)=>{
      mine(x,{probe:ag_in(tt,c.note+0.1,2.0),back:ag_in(tt,w("note","note",-0.4),1.3)});
      ea_sheet(x,tt,w("note","We",-0.3),430,120,760,{kick:"Day 17: a note on the drill",title:"“We are well in the shelter, the 33.”"},{col:LP.green,light:null,pin:false});}},
    // food, water, medicine and letters go down the narrow hole
    {at:c.doves-0.3,place:"eaSection",keys:[[c.doves-0.3,1150,520,1.25],[c.doves-0.2,1320,560,1.6]],d:1.8,draw:(x,tt)=>{
      mine(x,{probe:1,doves:(tt-c.doves-0.4)*1.5,lit:{doves:1}});
      ea_sheet(x,tt,w("note","We",-0.3),430,120,760,{kick:"Day 17: a note on the drill",title:"“We are well in the shelter, the 33.”"},{col:LP.green,light:null,pin:false,out:c.doves+0.2});
      [["Food","food",380],["Water","water",460],["Medicine","medicine",540],["Letters","letters",620]].forEach(([s,wd,py])=>ea_tag(x,tt,Math.max(w("doves",wd,-0.2),c.doves+1.9),null,1500,py,s,{col:LP.ink}));
      ea_tag(x,tt,Math.max(w("doves","palomas",-0.2),c.doves+1.9),null,1030,300,"Palomas: doves",{align:"center",col:LP.ink});}},
    // three big drills at once, each a different way; Plan B breaks through
    {at:c.drills-0.3,place:"eaSection",keys:[[c.drills-0.3,1320,560,1.6],[c.drills-0.2,960,540,1.0]],d:1.8,draw:(x,tt)=>{
      const dr=ea_dr(tt,d0,tb),thr=ag_in(tt,tb,0.6),up=w("up","come",-0.2);
      mine(x,{probe:1,drills:dr,through:thr,doves:(tt-c.drills+2)%8.6,lit:{doves:1},capsule:tt>up?((tt-up)/1.6)%1:null});
      [["Plan C",760],["Plan A",1000],["Plan B",1240]].forEach(([s,px],i)=>ea_tag(x,tt,c.drills+1.6+i*0.25,null,EA_M.drills[i].x,120,s,{align:"center",col:i===2&&thr>0.5?LP.green:LP.blue}));
      ea_pill(x,tt,w("drills","never",-0.3),tb-0.3,700,846,"The rescue never hangs on one",{col:LP.blue});
      ea_pill(x,tt,tb+0.2,c.up-0.2,700,846,"9 October: Plan B breaks through",{col:LP.green,icon:"tick"});
      if(tt>=w("up","after",-0.3)){const f0=w("up","after",-0.3),n=Math.round(lerp(1,33,ag_in(tt,w("up","all",-0.2),3.2)));
        lp_figure(x,160,150,480,{kick:"13 October",num:String(n),label:"Of 33, up one by one, after 69 days"},{col:LP.green,light:null,pin:false,a:ag_in(tt,f0,0.35),k:tt-f0});}}},
    // their families have them back
    {at:c.home-0.3,place:"eaCamp",keys:[[c.home-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      lp_person(x,EA_PEOPLE.f1,330,680,0.8,{t:tt,light:EA_OUT});lp_person(x,EA_PEOPLE.m2up,640,680,0.8,{t:tt+1,light:EA_OUT});
      lp_person(x,EA_PEOPLE.m3up,1290,680,0.8,{t:tt+2,flip:true,light:EA_OUT});lp_person(x,EA_PEOPLE.f3,1600,680,0.8,{t:tt+3,flip:true,light:EA_OUT});
      ea_pill(x,tt,w("home","back",-0.4),null,960,200,"All 33, back with their families",{col:LP.green,icon:"tick"});}},
    // the lesson: every part had someone who knew it, and every part ran at once
    {at:c.lesson-0.3,place:"eaSection",keys:[[c.lesson-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      mine(x,{probe:1,drills:[0.62,0.78,1],through:1,doves:(tt-c.lesson)%8.6,lit:{doves:1}});
      [["The drills",880,120],["Food and letters",1560,450],["The men's health",1640,560],["The families",1480,120]].forEach(([s,px,py],i)=>ea_tag(x,tt,w("lesson","Each",-0.2)+i*0.3,null,px,py,s,{align:"center",col:LP.blue}));
      ea_sheet(x,tt,w("lesson","No",-0.2),130,140,520,{lines:["No one person did it all","Each part had someone who knew it","Every part ran at once"]},
        {col:LP.blue,light:null,pin:false,u:ea_u(tt,[w("lesson","No",0),w("lesson","Each",-0.1),w("lesson","every",-0.1)])});}},
    // a data manager's work, shaped the same way; Helena's first week
    {at:c.data-0.3,place:"eaMonday",keys:[[c.data-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      ea_sheet(x,tt,w("data","data",-0.2),560,240,800,{kick:"A data manager's work",title:"Calmer, but shaped the same way"},{light:"morning",out:c.helena-0.6});
      lp_person(x,"helena",360,640,1.0,{t:tt,a:ag_in(tt,c.helena-0.2,0.6),light:EA_MO});
      const f0=w("helena","forty",-0.3);if(tt>=f0)lp_figure(x,760,170,620,{kick:"Her first day",num:"46",label:"Requests from every area of data, someone waiting on each"},
        {col:LP.orange,light:"morning",a:ag_in(tt,f0,0.35)*(1-ag_in(tt,c.plan-0.6,0.4)),k:tt-f0});}},
    // by Friday, one plan in three lanes; everyone waiting hears where they stand
    {at:c.plan-0.3,place:"eaMonday",later:true,keys:[[c.plan-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=c.plan+0.1;
      ea_plan(x,{a:ag_in(tt,p0,0.35),k:tt-p0,light:"morning",grid:ag_in(tt,p0+0.3,0.6),people:ag_in(tt,w("plan","three",-0.1),0.5),
        strategy:[ag_in(tt,w("plan","lanes",-0.1),0.5),ag_in(tt,w("plan","lanes",0.1),0.5),ag_in(tt,w("plan","lanes",0.3),0.5)],dates:[0,0,0],
        ops:[ag_in(tt,w("plan","side",-0.2),0.5),ag_in(tt,w("plan","side",0),0.5),0,0]});
      ea_pill(x,tt,w("hear","hears",-0.3),null,960,840,"Everyone waiting hears where their request stands",{col:LP.green,icon:"tick"});}},
    // the camp at dusk, as the title comes
    {at:c.breath-0.2,place:"eaDusk",keys:[[c.breath-0.2,960,540,1.0]],dis:1.0}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,c.helena-0.2,c.plan-0.4,0.5)});
  lp_title(ctx,S,t,c.breath+0.2,EA_TITLE,"A data manager's first ninety days","Data management · A plan in ninety days",EA_MOD);
});

/* ---------------------------------------------------------------- 2. Her first day */
scene("first",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const hel=(x,tt,a)=>lp_person(x,"helena",360,640,1.0,{t:tt,a,light:EA_MO});
  ag_shots(ctx,S,t,sc.dur,[
    // the module's promise, said once
    {at:0,place:"eaMonday",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ea_sheet(x,tt,0.8,560,220,800,{kick:"Data management",title:"One data manager's first year",lines:["Every area of data, at once","And the management work around it"]},
        {light:"morning",u:ea_u(tt,[w("promise","every",-0.1),w("promise","management",-0.1)])});}},
    // Monday 1 February 2027: Helena starts
    {at:c.day-0.3,place:"eaMonday",later:true,keys:[[c.day-0.3,960,540,1.0]],draw:(x,tt)=>{
      ea_sheet(x,tt,c.day+0.1,880,160,760,{kick:"Her first day",title:"Monday 1 February 2027"},{light:"morning",out:c.starts+0.4});
      hel(x,tt,ag_in(tt,c.starts-0.3,0.6));
      ea_sheet(x,tt,c.starts+0.9,880,160,760,{kick:"The data manager",title:"Helena Novak",lines:["An architect","A data lead","A product owner"]},
        {light:"morning",out:c.open-0.6,u:ea_u(tt,[w("starts","architect",-0.1),w("starts","lead",-0.1),w("starts","product",-0.1)])});
      // the tracker: how many are open; the oldest; three of them, each with someone waiting
      const s0=w("open","tracker",-0.3);if(tt>=s0)ea_tracker(x,860,170,920,540,{a:ag_in(tt,s0,0.5),old:ag_in(tt,w("oldest","waited",-0.2),0.5),
        rows:[ag_in(tt,w("each","report",-0.2),0.5),ag_in(tt,w("each","staff",-0.2),0.5),ag_in(tt,w("each","researcher",-0.2),0.5)]});
      ea_tag(x,tt,w("open","inboxes",-0.2),c.tempt-0.6,1320,770,"And in the team's inboxes",{align:"center",col:LP.ink});
      [["The oldest first?","oldest",1000],["The loudest?","loudest",1330],["Everything at once?","everything",1640]].forEach(([s,wd,px])=>ea_tag(x,tt,w("tempt",wd,-0.2),c.sort-0.4,px,770,s,{align:"center",col:LP.amber}));
      ea_pill(x,tt,w("sort","sorts",-0.3),null,1320,780,"First, she sorts them",{col:LP.ink});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,c.day,c.open,0.5)});
  ea_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. One wheel */
scene("wheel",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const n0=w("centre","ten",-0.1),fl=w("titles","From",-0.6);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"eaMonday",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ea_wheel(x,{a:ag_in(tt,0.4,0.5),light:"morning",u:ag_in(tt,0.9,2.4),gov:ag_in(tt,w("centre","governance",-0.1),0.5),
        names:EA_AREAS.map((_,i)=>ag_in(tt,n0+i*0.28,0.4)),
        dots:EA_AREAS.map((ar,i)=>i===7?ag_in(tt,w("place","puts",-0.1),2.2):i===9?ag_in(tt,w("counts","quality",-0.5),1.0):i===3?ag_in(tt,w("counts","security",-0.5),0.8):
          i===4?ag_in(tt,w("rest","integration",-0.4),0.6):ag_in(tt,w("rest","three",-0.2)+i*0.12,0.5)),
        govDots:ag_in(tt,w("rest","governance",-0.3),0.6),
        hl:EA_AREAS.map((_,i)=>i===7?ag_io(tt,w("counts","warehousing",-0.2),w("counts","quality",-0.2),0.4):i===9?ag_io(tt,w("counts","quality",-0.2),w("counts","security",-0.2),0.4):
          i===3?ag_io(tt,w("counts","security",-0.2),c.rest,0.4):0).map((h,i)=>Math.max(h,i===1?ag_io(tt,w("touch","modelled",-0.2),c.one,0.4):i===9?ag_io(tt,w("touch","quality",-0.2),c.one,0.4):i===3?ag_io(tt,w("touch","safe",-0.2),c.one,0.4):0)),
        count:EA_AREAS.map((_,i)=>i===7?ag_in(tt,w("counts","ten",-0.1),0.4):i===9?ag_in(tt,w("counts","seven",-0.1),0.4):i===3?ag_in(tt,w("counts","five",-0.1),0.4):ag_in(tt,w("rest","fewer",-0.1)+i*0.08,0.4)),
        beside:ag_io(tt,w("beside","Two",-0.2),c.touch-0.2,0.5),touch:ag_in(tt,w("touch","report",-0.3),0.5)*(1-ag_in(tt,c.one+0.2,0.5)),one:ag_in(tt,w("one","system",-0.4),1.6),
        films:ag_in(tt,fl,1.2)});
      ea_tag(x,tt,w("rest","forty",-0.2),c.beside-0.4,1470,770,"44 on the wheel",{align:"center",col:LP.orange});
      ea_tag(x,tt,w("touch","report",-0.2),c.one+0.2,1470,770,"A new report",{align:"center",col:LP.orange});
      ea_tag(x,tt,w("one","system",-0.2),fl-0.2,1470,770,"One system, one job",{align:"center",col:LP.ink});}}
  ]);
  ea_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Who is deep in each */
const EA_TEAM=[{k:"noor",x:300,w:"noor",kick:"Noor",lines:["Architecture","Modelling and design"]},{k:"sam",x:700,w:"noor",kick:"Sam",lines:["The platform","Storage","Integration"]},
  {k:"jun",x:1110,w:"jun",kick:"Jun",lines:["The warehouse","Its reports"]},{k:"yusuf",x:1520,w:"jun",kick:"Yusuf",lines:["Governance","Metadata","Quality"]}];
scene("deep",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // nobody is expert in all eleven; and the work every manager does
    {at:0,place:"eaMonday",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",360,640,1.0,{t:tt,a:ag_in(tt,0.4,0.6),light:EA_MO});
      const f0=w("nobody","eleven",-0.4);if(tt>=f0)lp_figure(x,840,180,620,{kick:"Expert in all of them",num:"11 areas",label:"Nobody is, Helena included"},{col:LP.amber,light:"morning",a:ag_in(tt,f0,0.35)*(1-ag_in(tt,c.manager-0.6,0.4)),k:tt-f0});
      ea_sheet(x,tt,c.manager+0.1,840,140,700,{kick:"And every manager's work",lines:["Strategy","Money","Risk","People","Stakeholders","Delivery"]},
        {light:"morning",out:c.find-0.5,u:ea_u(tt,["strategy","money","risk","people","stakeholders","delivery"].map(s=>w("manager",s,-0.1)))});}},
    // who on the team is deep in each
    {at:c.find-0.2,place:"eaMonday",later:true,keys:[[c.find-0.2,960,540,1.0]],draw:(x,tt)=>{
      EA_TEAM.forEach((p,i)=>{lp_person(x,p.k,p.x,700,0.8,{t:tt+i,flip:i>1,a:ag_in(tt,c.find+0.2+i*0.25,0.6),light:EA_MO});
        ea_sheet(x,tt,w(p.w,p.kick,-0.2),p.x-180,140,360,{kick:p.kick,lines:p.lines},{light:"morning",out:c.gap-0.6});});
      ea_sheet(x,tt,c.gap+0.1,640,110,640,{kick:"No one here is deep in",lines:["Security","Reference and master data","Documents and content"]},{col:LP.amber,light:"morning",u:ag_in(tt,w("gap","writes",-0.2),1.4)});}},
    // her part
    {at:c.part-0.3,place:"eaMonday",later:true,keys:[[c.part-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",360,640,1.0,{t:tt,light:EA_MO});
      ea_sheet(x,tt,c.part+0.2,840,150,760,{kick:"Her part",lines:["See the areas as one system","Know who is deep in each","Decide where to start"]},
        {col:LP.blue,light:"morning",u:ea_u(tt,[w("part","see",-0.1),w("part","know",-0.1),w("part","decide",-0.1)])});
      ea_tag(x,tt,w("skill","Many",-0.2),null,1220,560,"Many hats, one picture: the generalist's skill",{align:"center",col:LP.ink});}}
  ]);
  ea_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Ninety days, three lanes */
scene("lanes",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // a shape to borrow
    {at:0,place:"eaMonday",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ea_sheet(x,tt,w("watkins","borrows",-0.3),560,200,800,{kick:"A shape to borrow",title:"The First 90 Days",sub:"Michael Watkins, 2003",lines:["Learn fast","Secure early wins"]},
        {light:"morning",u:ea_u(tt,[w("watkins","learn",-0.1),w("watkins","secure",-0.1)])});}},
    // the plan: three lanes, run side by side
    {at:c.lanes-0.3,place:"eaMonday",later:true,keys:[[c.lanes-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=c.lanes+0.1;
      const hl=tt>=c.ops-0.2?"ops":tt>=c.strategy-0.2?"strategy":tt>=c.people-0.2?"people":null,hlA=1-ag_in(tt,c.rule-0.3,0.5);
      ea_plan(x,{a:ag_in(tt,p0,0.35),k:tt-p0,light:"morning",grid:ag_in(tt,p0+0.3,0.6),hl:hlA>0.5?hl:null,today:ag_in(tt,w("weeks","first",-0.2),0.6),
        people:ag_in(tt,w("people","twelve",-0.2),0.6),
        strategy:[ag_in(tt,w("strategy","discover",-0.2),0.5),ag_in(tt,w("strategy","define",-0.2),0.5),ag_in(tt,w("strategy","plan",-0.2),0.5)],
        dates:[ag_in(tt,w("dates","fifteenth",-0.2),0.4),ag_in(tt,w("dates","fifth",-0.2),0.4),ag_in(tt,w("dates","twenty",-0.2),0.4)],
        ops:[ag_in(tt,w("weeks","urgent",-0.3),0.5),ag_in(tt,w("weeks","delivery",-0.3),0.6),ag_in(tt,w("improve","propose",-0.3),0.5),ag_in(tt,w("improve","tests",-0.3),0.5)]});
      ea_pill(x,tt,w("rule","change",-0.3),c.desert-0.6,620,842,"Not everything on day one",{col:LP.ink});
      ea_pill(x,tt,w("rule","wait",-0.3),c.desert-0.6,1300,842,"Help from the first week",{col:LP.ink});}},
    // at the mine: the big drills took weeks, and food went down the narrow hole the whole time
    {at:c.desert-0.3,place:"eaSection",keys:[[c.desert-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      ea_mine(x,{ramp:1,fall:1,lamps:1,shelter:1,probe:1,doves:(tt-c.desert)%8.6,lit:{doves:1},drills:[0.3+0.02*(tt-c.desert),0.4+0.02*(tt-c.desert),0.5+0.02*(tt-c.desert)]});
      ea_tag(x,tt,w("desert","drills",-0.2),null,1000,120,"Strategy: the big drills, for weeks",{align:"center",col:LP.blue});
      ea_tag(x,tt,w("desert","food",-0.2),null,1620,500,"Operations: food, every day",{align:"center",col:LP.blue});}}
  ]);
  ea_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. One page, shown */
const EA_ANSWERS=["In a sprint from 15 February","This week","After 15 March"];
scene("friday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),e0=c.breath+0.6;
  const full={people:1,strategy:[1,1,1],dates:[1,1,1],ops:[1,1,1,1],grid:1,light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    // Friday: the plan on one page
    {at:0,place:"eaFriday",keys:[[0,960,540,1.0]],draw:(x,tt)=>{ea_plan(x,Object.assign({},full,{a:ag_in(tt,0.3,0.5),k:tt-0.3}));}},
    // shown to the deputy vice-chancellor, then to the team
    {at:c.david-0.3,place:"eaFriday",later:true,keys:[[c.david-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",420,640,1.0,{t:tt,light:EA_LATE});lp_person(x,"david",1500,640,1.0,{t:tt,flip:true,a:1-ag_in(tt,w("david","team",-0.9),0.5),light:EA_LATE});
      lp_nameTag(x,1500,236,"david",{role:"Deputy vice-chancellor",align:"center",a:ag_io(tt,w("david","David",-0.2),w("david","team",-1.0),0.4)});
      [["noor",1240],["sam",1560]].forEach(([k,px],i)=>lp_person(x,k,px,690,0.82,{t:tt+i,flip:true,a:ag_in(tt,w("david","team",-0.2)+i*0.25,0.6),light:EA_LATE}));
      ea_sheet(x,tt,c.david+0.2,690,130,520,{kick:"One page",lines:["People","Strategy","Operations"]},{col:LP.blue,light:"late",out:c.promise-0.6});
      ea_sheet(x,tt,c.promise+0.1,690,130,520,{kick:"It promises",lines:["No fix before she has listened","Dates she can be held to"]},
        {col:LP.blue,light:"late",u:ea_u(tt,[w("promise","fix",-0.1),w("promise","dates",-0.1)])});}},
    // everyone waiting hears where their request stands
    {at:c.heard-0.3,place:"eaFriday",later:true,keys:[[c.heard-0.3,960,540,1.0]],draw:(x,tt)=>{
      ea_tracker(x,300,150,1320,520,{rows:[1,1,1],old:0,answers:EA_ANSWERS,lane:[ag_in(tt,c.heard+0.4,0.5),ag_in(tt,c.heard+0.8,0.5),ag_in(tt,c.heard+1.2,0.5)]});
      ea_pill(x,tt,w("heard","answer",-0.4),null,960,780,"By 26 April, each of the 46 has an answer",{col:LP.green,icon:"tick"});}},
    // back to the mine: every part had someone who knew it, and all 33 came up
    {at:c.back-0.3,place:"eaSection",keys:[[c.back-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      ea_mine(x,{ramp:1,fall:1,lamps:1,shelter:1,probe:1,drills:[0.62,0.78,1],through:1,lit:{doves:1}});
      [["The drills",880,120],["Food and letters",1560,450],["The men's health",1640,560],["The families",1480,120]].forEach(([s,px,py],i)=>ea_tag(x,tt,c.back+0.4+i*0.25,null,px,py,s,{align:"center",col:LP.blue}));
      ea_pill(x,tt,w("back","came",-0.4),null,700,846,"All 33 came up",{col:LP.green,icon:"tick"});}},
    // Helena's ninety days, the same way
    {at:c.same-0.3,place:"eaFriday",keys:[[c.same-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{ea_plan(x,full);
      ea_pill(x,tt,w("same","every",-0.3),c.running-0.6,620,842,"Every area: one job",{col:LP.ink});
      ea_pill(x,tt,w("same","waits",-0.4),c.running-0.6,1320,842,"No one waits without an answer",{col:LP.green,icon:"tick"});}},
    // on Monday
    {at:c.running-0.3,place:"eaFriday",later:true,keys:[[c.running-0.3,960,540,1.0]],draw:(x,tt)=>{
      ea_sheet(x,tt,c.running+0.1,130,170,520,{kick:"One",title:"Keep today's work running",lines:["While you learn"]},{light:"late",out:c.take-0.6});
      ea_sheet(x,tt,c.onepage+0.1,700,170,520,{kick:"Two",title:"One page, three lanes",lines:["Dates you can be held to"]},{col:LP.blue,light:"late",out:c.take-0.6});
      ea_sheet(x,tt,c.words+0.1,1270,170,520,{kick:"Three",title:"Learn each area's words",lines:["And who is deep in each"]},{light:"late",out:c.take-0.6});
      ea_sheet(x,tt,w("next","listen",-0.2),660,560,600,{kick:"Next",title:"Listen first"},{light:"late",out:c.take-0.6});}},
    // the one page again, as the end comes: it goes under the end card's veil as the card comes in, so no words show through
    {at:c.take-0.3,place:"eaFriday",later:true,keys:[[c.take-0.3,960,540,1.0]],draw:(x,tt)=>{ea_plan(x,Object.assign({},full,{a:ag_in(tt,c.take+0.1,0.5)*(1-ag_in(tt,e0,0.9))}));}}
  ]);
  lp_end(ctx,S,t,e0,EA_TITLE,EA_LAST,"Film 1 of 4","A plan in ninety days",EA_MOD);
  ea_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["wheel","deep","lanes"]);
