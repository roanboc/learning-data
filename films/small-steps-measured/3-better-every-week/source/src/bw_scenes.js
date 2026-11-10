/* ===== Better every week: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera stays and only what changes fades; a later moment in a
   room (later:true) lets what was there leave first; between rooms a shot dissolves. Chapters two to five open in the team's room where
   the one before ends, so each glides on (ag_cutInto) and lets the last one's end leave first. Sizes in the 1920 x 1080 frame. */

const BW_TITLE="Better every week",BW_LAST="One measure, one small change, every week.";
function bw_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"3",BW_TITLE,{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function bw_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const bw_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
function bw_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function bw_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// what fn draws, drawn whole first and laid on the picture at opacity a, so a person behind a bench never shows through either
function bw_whole(ctx,a,fn){if(a<=0.004)return;if(a>=0.996){fn(ctx);return;}const cv=ctx.canvas,[bc,bx]=ag_buf("bwWhole",cv.width,cv.height);bx.setTransform(ctx.getTransform());fn(bx);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// the tracker's requests: August's, each waiting days for its first question; and the week to Friday 10 September's, each within a day
const BW_AUG=[["Energy use by building",5,LP.amber],["Grant spending by faculty",7,LP.amber],["Leave balances by team",6,LP.amber]];
const BW_SEP=[["Library loans by month",1,LP.green,"Within a day"],["Room bookings by week",1,LP.green,"Within a day"],["Parking permits by site",1,LP.green,"Within a day"]];
const bw_screen=(x,a,o)=>lp_screen(x,130,170,1180,620,{a,draw:(cx,X,Y,Wd,Hd)=>bw_tracker(cx,X,Y,Wd,Hd,o)});

/* ---------------------------------------------------------------- 1. A better way, on a card: the United States, from 1940 */
scene("card",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),day={light:"day"},mo={light:"morning"},late={light:"late"};
  const W0=w("walk","walks",-0.2),C0=w("walk","carries",-0.1),cs=BW_CARRY_OUT/Math.max(0.5,w("walk","scale",0.0)-C0);
  ag_shots(ctx,S,t,sc.dur,[
    // the United States, 1940: a factory under its saw-tooth roof, far more to make, and millions of new workers
    {at:0,place:"bwHall",keys:[[0,960,560,1.06],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{bw_hall(x,{});
      bw_sheet(x,tt,w("when","United",-0.2),120,110,620,{kick:"The United States",title:"1940"},{light:null,pin:false,out:c.few-0.7});
      bw_tag(x,tt,w("when","more",-0.1),c.few-0.7,1800,200,"Far more to make, and fast",{align:"right",col:LP.amber});
      bw_tag(x,tt,w("when","millions",-0.1),c.few-0.7,1800,280,"Millions of new workers",{align:"right",col:LP.ink});
      bw_tag(x,tt,w("when","first",-0.2),c.few-0.7,1800,360,"Many in a factory for the first time",{align:"right",col:LP.ink});}},
    // on the floor: too few supervisors, who lead the workers and show them how; then one job, at the bench, done the long way
    {at:c.few-0.3,place:"bwFloor",keys:[[c.few-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const j0=c.job-0.3;
      lp_person(x,BW_PEOPLE.boss,420,640,1.0,{t:tt,a:ag_in(tt,c.few+0.1,0.6)*(1-ag_in(tt,j0,0.5)),light:day});
      bw_pill(x,tt,w("few","few",-0.1),j0-0.2,1300,200,"Too few, with experience",{col:LP.amber});
      bw_sheet(x,tt,w("few","lead",-0.3),900,300,800,{kick:"Supervisors",title:"Lead a group of workers on the floor",lines:["And show them how"]},
        {light:"day",out:j0-0.2,u:ag_in(tt,w("few","show",-0.1),0.5)});
      bw_whole(x,ag_in(tt,j0+0.6,0.6),b=>{lp_person(b,BW_PEOPLE.worker,560,640,1.0,{t:tt,light:day,cut:854});bw_bench(b,140,860,900,{});});
      bw_tag(x,tt,w("job","long",-0.1),null,1180,170,"Done the long way",{col:LP.amber});
      bw_sheet(x,tt,w("job","Picture",-0.2),1180,250,600,{kick:"One job",title:"A part for a radio",lines:["Two metal sheets, riveted"]},{light:"day",u:ag_in(tt,w("job","riveting",-0.1),0.5)});}},
    // the job from above: every trip to the boxes, the stamp, the full box carried to the scale; what it costs, and no time to rethink it
    {at:c.walk-0.3,place:"bwFloor",later:true,keys:[[c.walk-0.3,960,540,1.0]],draw:(x,tt)=>{
      bw_plan(x,{kick:"The job, from above",title:"The radio shield: the long way",light:"day",walk:ag_in(tt,W0,2.6),stamp:ag_in(tt,w("walk","stamps",0.0),0.4),carry:clamp((tt-C0)*cs,0,1)});
      bw_tag(x,tt,w("harm","time",-0.1),null,1690,250,"Time the factory doesn't have",{align:"right",col:LP.amber});
      bw_tag(x,tt,w("harm","heavy",-0.1),null,1690,330,"Heavy work that wears people out",{align:"right",col:LP.amber});
      bw_tag(x,tt,w("stop","nobody",-0.1),null,1690,410,"No time to rethink the job",{align:"right",col:LP.amber});}},
    // Training Within Industry trains the supervisors themselves, ten at a table; Job Methods, from 1942; its four steps, on a pocket card
    {at:c.twi-0.3,place:"bwClass",keys:[[c.twi-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      lp_person(x,BW_PEOPLE.boss,330,640,1.0,{t:tt,a:ag_in(tt,c.twi,0.6),light:mo});
      bw_sheet(x,tt,w("twi","Training",-0.2),760,170,700,{kick:"A government service",title:"Training Within Industry",lines:["Trains the supervisors themselves"]},
        {col:LP.blue,light:"morning",out:c.jm-0.9,u:ag_in(tt,w("twi","supervisors",-0.1),0.5)});
      const t10=w("twi","ten",-0.1);if(tt>=t10)bw_ten(x,1240,500,{a:ag_in(tt,t10,0.35)*(1-ag_in(tt,c.jm-0.9,0.4)),k:tt-t10,u:ag_in(tt,t10,1.0),light:"morning"});
      bw_sheet(x,tt,w("jm","Job",-0.2),760,170,800,{kick:"From 1942",title:"Job Methods",lines:["Small improvements","In the jobs they know best"]},
        {col:LP.blue,light:"morning",out:c.steps-0.9,u:bw_u(tt,[w("jm","small",-0.1),w("jm","best",-0.2)])});
      const k0=c.steps-0.3;if(tt>=k0)bw_card(x,760,150,{a:ag_in(tt,k0,0.4),k:tt-k0,light:"morning",
        u:[ag_in(tt,w("steps","Break",-0.1),0.5),ag_in(tt,w("steps","question",-0.1),0.5),ag_in(tt,w("better","drop",-0.1),0.5),ag_in(tt,w("pocket","pocket",-0.2),0.5)],
        pen:ag_in(tt,w("better","write",-0.05),0.6),hl:ag_in(tt,w("pocket","until",-0.1),0.6)});}},
    // the course's own example: the sheets to the bench, both hands at work; the stamp and the scale go, neither needed
    {at:c.shield-0.3,place:"bwClass",later:true,keys:[[c.shield-0.3,960,540,1.0]],draw:(x,tt)=>{
      bw_plan(x,{kick:"The course's own example",title:"The radio shield: a better way",col:LP.green,light:"morning",walk:1,stamp:1,carry:1,
        better:ag_in(tt,w("shield","bench",-0.3),1.3),hands:ag_in(tt,w("shield","hands",-0.2),0.8),gone:ag_in(tt,w("shield","stamp",-0.1),0.8)});
      bw_tag(x,tt,w("shield","hands",0.0),null,810,640,"Both hands work",{align:"center",col:LP.green});
      bw_tag(x,tt,w("shield","neither",-0.1),null,1086,350,"Not needed",{align:"center",col:LP.ink});
      bw_tag(x,tt,w("shield","neither",0.1),null,1565,640,"Not needed",{align:"center",col:LP.ink});}},
    // not a speed-up: thirty details become fourteen, and much of the heavy work is gone
    {at:c.lighter-0.3,place:"bwClass",later:true,keys:[[c.lighter-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=w("lighter","thirty",-0.2),q0=w("lighter","fourteen",-0.2);
      bw_tag(x,tt,c.lighter,null,960,118,"Not a speed-up",{align:"center",col:LP.ink});
      if(tt>=p0)bw_breakdown(x,240,170,640,{kick:"Present method",num:"30",label:"details"},30,{col:LP.amber,light:"morning",a:ag_in(tt,p0,0.35),k:tt-p0,u:ag_in(tt,p0,0.9)});
      if(tt>=q0)bw_breakdown(x,1040,170,640,{kick:"Proposed method",num:"14",label:"details"},14,{col:LP.green,light:"morning",a:ag_in(tt,q0,0.35),k:tt-q0,u:ag_in(tt,q0,0.9)});
      bw_tag(x,tt,w("lighter","tiring",-0.1),null,1360,800,"Much of the heavy work, gone",{align:"center",col:LP.green});}},
    // by 1945: 86 in every 100 plants with more output said it was a quarter or more; after the war, Japan, and kaizen
    {at:c.plants-0.3,place:"bwClass",later:true,keys:[[c.plants-0.3,960,540,1.0]],draw:(x,tt)=>{const f0=w("plants","eighty-six",-0.3);
      if(tt>=f0)lp_figure(x,240,190,680,{kick:"By 1945",num:"86 in 100",label:"Of the plants reporting more output: up by a quarter or more"},{col:LP.green,light:"morning",a:ag_in(tt,f0,0.35),k:tt-f0});
      bw_sheet(x,tt,w("japan","Japan",-0.2),1000,190,680,{kick:"After the war",title:"Taught in Japan",lines:["One root of kaizen","Improving a little at a time"]},
        {col:LP.blue,light:"morning",u:bw_u(tt,[w("japan","kaizen",-0.1),w("japan","improving",-0.1)])});}},
    // a data team works the long way too; Helena's team's Fridays: fourteen small changes kept, and an answer within a day, not six
    {at:c.data-0.3,place:"bwFriday",keys:[[c.data-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const g=1-ag_in(tt,c.breath-0.4,0.6),f0=w("friday","Friday",-0.2);
      lp_person(x,"helena",330,640,1.0,{t:tt,a:ag_in(tt,c.data+0.2,0.6)*g,light:late});
      lp_person(x,"ivy",1600,640,1.0,{t:tt,flip:true,a:ag_in(tt,c.data+0.6,0.6)*g,light:late});
      bw_sheet(x,tt,w("data","team",-0.2),560,180,800,{kick:"A data team",title:"The long way too",lines:["When nobody stops to look"]},{col:LP.amber,light:"late",out:f0-0.6,u:ag_in(tt,w("data","nobody",-0.1),0.5)});
      if(tt>=f0)lp_figure(x,560,180,800,{kick:"Half an hour every Friday",num:"14",label:"Small changes kept, by December"},{col:LP.green,light:"late",a:ag_in(tt,f0,0.35)*g,k:tt-f0});
      bw_pill(x,tt,w("one","day",-0.2),c.breath-0.4,960,600,"Heard back within a day, not six",{col:LP.green,icon:"tick"});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("friday","Helena",-0.3),c.breath-0.4,0.5)});
  lp_title(ctx,S,t,c.breath+0.2,BW_TITLE,"Half an hour every Friday, for how the team works","Data management · Small steps, measured",{module:"Data management",mark:dm_mark});
});

/* ---------------------------------------------------------------- 2. Half an hour on Fridays */
scene("friday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),late={light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    // September 2027: the measures, read every second Thursday since July, two waits fixed already; then Helena's half-hour on Fridays
    {at:0,place:"bwFriday",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const o0=c.half-0.9,k0=w("half","Friday",-0.2);
      lp_person(x,"helena",1640,640,1.0,{t:tt,flip:true,a:ag_in(tt,0.4,0.6),light:late});
      bw_sheet(x,tt,w("sept","September",-0.2),140,170,640,{kick:"Since July",title:"The measures, read together",lines:["Every second Thursday"]},
        {col:LP.orange,light:"late",out:o0,u:ag_in(tt,w("sept","Thursday",-0.2),0.5)});
      bw_pill(x,tt,w("fixes","two",-0.1),o0,1110,330,"Two waits fixed already",{col:LP.green,icon:"tick"});
      bw_tag(x,tt,w("fixes","module",-0.3),o0,1110,430,"How: in Leading data people",{align:"center",col:LP.ink});
      if(tt>=k0)bw_week(x,250,150,1180,{kick:"From Friday 3 September",title:"Half an hour, every week"},
        {a:ag_in(tt,k0,0.35),k:tt-k0,u:ag_in(tt,w("half","protects",-0.1),0.6),lit:ag_in(tt,w("half","Fridays",0.0),0.6),light:"late"});
      lp_nameTag(x,1470,220,"helena",{role:"Data manager",a:ag_in(tt,w("half","Helena",-0.2),0.5)});}},
    // the rules: one measure; one small change, tried for a week, then kept or dropped, out loud; plan, do, check, act; data quality's
    // Thursdays keep the same rhythm for one list
    {at:c.rules-0.3,place:"bwFriday",later:true,keys:[[c.rules-0.3,960,540,1.0]],draw:(x,tt)=>{
      bw_sheet(x,tt,w("rules","One",-0.2),140,250,760,{kick:"Every Friday, half an hour",lines:["One measure","One small change, tried for a week","Then kept or dropped, out loud"]},
        {col:LP.blue,light:"late",u:bw_u(tt,[w("rules","One",-0.1),w("rules","small",-0.2),w("rules","kept",-0.2)])});
      bw_pdca(x,1400,450,190,{u:ag_in(tt,w("rules","plan",-0.1),1.4),mid:ag_in(tt,w("dq","here",-0.1),0.6),midText:["How the","team works"]});
      bw_tag(x,tt,w("dq","quality",-0.1),null,960,830,"The same rhythm in Data quality, for one list",{align:"center",col:LP.ink});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("sept","university",-0.3),c.half-0.4,0.5)});
  bw_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Six days to one */
scene("six",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),late={light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    // the first Friday: Noor looks in the tracker for where the work waits longest: six working days to the first question back
    {at:0,place:"bwFriday",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const s0=w("first","tracker",-0.2);
      bw_screen(x,ag_in(tt,s0,0.5),{title:"The tracker · August 2027",rows:BW_AUG,u:ag_in(tt,s0+0.3,1.2),bar:ag_in(tt,c.start,1.6),sum:ag_in(tt,w("start","six",-0.1),0.6),sumText:"First question back: 6 working days"});
      lp_person(x,"noor",1640,660,0.95,{t:tt,flip:true,a:ag_in(tt,0.6,0.6),light:late});
      lp_nameTag(x,1430,230,"noor",{role:"The data architect",a:ag_in(tt,w("first","Noor",-0.1),0.5)});}},
    // they start where the pocket card does: break the job down; a request's four steps; then question each: why wait for Monday?
    {at:c.card-0.3,place:"bwFriday",later:true,keys:[[c.card-0.3,960,540,1.0]],draw:(x,tt)=>{const p2=c.why-0.1;
      bw_pill(x,tt,w("card","break",-0.1),p2-0.5,960,230,"The card's first step: break the job down",{col:LP.blue});
      bw_pill(x,tt,p2,null,960,230,"The card's second step: question every detail",{col:LP.blue});
      const m=bw_steps(x,150,420,1620,{u:["lands","waits","goes","reads"].map(k=>ag_in(tt,w("steps",k,-0.2),0.5)),amb:ag_in(tt,w("why","Monday",-0.1),0.5)});
      bw_pill(x,tt,w("why","Monday",-0.1),null,m[1][0],350,"Why wait for Monday?",{col:LP.amber});
      bw_tag(x,tt,w("why","five",-0.2),null,960,720,"The form's five answers are enough to ask that day",{align:"center",col:LP.blue});}},
    // Ivy's change: the next free person reads each new request the day it lands; Monday's planning still sets the order; a week to try
    {at:c.ivy-0.3,place:"bwFriday",later:true,keys:[[c.ivy-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"ivy",330,640,1.0,{t:tt,a:ag_in(tt,c.ivy,0.6),light:late});
      lp_nameTag(x,520,250,"ivy",{role:"Graduate data analyst",a:ag_in(tt,w("ivy","Ivy",-0.1),0.5)});
      bw_sheet(x,tt,w("ivy","change",-0.2),900,200,840,{kick:"Ivy's change",title:"Read it the day it lands",lines:["The next free person reads each new request","And asks within a working day"]},
        {col:LP.blue,light:"late",u:bw_u(tt,[w("ivy","next",-0.1),w("ivy","asks",-0.1)])});
      bw_tag(x,tt,w("order","Monday's",-0.1),null,1320,620,"Monday's planning still sets the order",{align:"center",col:LP.ink});
      bw_pill(x,tt,w("order","Only",-0.1),null,1320,710,"Only the first question moves",{col:LP.blue});
      bw_pill(x,tt,w("week","week",-0.2),null,1320,810,"Tried for a week",{col:LP.amber,icon:"wait"});}}
  ]);
  bw_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Kept or dropped, out loud */
scene("kept",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),late={light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    // Friday 10 September: every request that week had its first question back within a working day: one day, not six; kept, and said so
    {at:0,place:"bwFriday",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      bw_screen(x,ag_in(tt,0.6,0.5),{title:"The tracker · the week to Friday 10 September",rows:BW_SEP,u:ag_in(tt,w("tenth","every",-0.2),1.0),bar:ag_in(tt,w("tenth","first",-0.1),1.0),
        sum:ag_in(tt,w("kept","One",-0.1),0.6),sumText:"One day, not six",sumCol:LP.green});
      lp_person(x,"ivy",1640,640,1.0,{t:tt,flip:true,a:ag_in(tt,0.8,0.6),light:late});
      bw_pill(x,tt,w("kept","keeps",-0.1),null,1600,190,"Kept, and said so",{col:LP.green,icon:"tick"});}},
    // a second change: ten minutes every morning, the whole team on the whole list; a week later, dropped, out loud, and why
    {at:c.second-0.3,place:"bwFriday",later:true,keys:[[c.second-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=c.result;
      lp_person(x,"helena",330,640,1.0,{t:tt,a:ag_in(tt,c.second,0.6),light:late});
      bw_sheet(x,tt,w("second","ten",-0.2),900,200,840,{kick:"Change 2",title:"Ten minutes every morning",lines:["The whole team, looking at the whole list"]},{col:LP.blue,light:"late",u:ag_in(tt,w("second","whole",-0.1),0.5)});
      bw_pill(x,tt,w("dropped","drop",-0.1),null,1320,560,"Dropped, out loud",{col:BW_GREY,icon:"cross"});
      bw_tag(x,tt,w("dropped","took",-0.1),r0-0.5,1320,660,"Ten minutes a day, from the whole team",{align:"center",col:LP.amber});
      bw_tag(x,tt,w("dropped","nothing",-0.1),r0-0.5,1320,750,"It found nothing new",{align:"center",col:LP.amber});
      bw_tag(x,tt,r0+0.1,null,1320,660,"Dropped is a result too",{align:"center",col:LP.ink});
      bw_tag(x,tt,w("result","nobody",-0.1),null,1320,750,"Nobody keeps doing it out of habit",{align:"center",col:LP.ink});}},
    // every Friday, the same half-hour: by 17 December, fifteen tried, fourteen kept, one dropped
    {at:c.count-0.3,place:"bwFriday",later:true,keys:[[c.count-0.3,960,540,1.0]],draw:(x,tt)=>{const f0=w("count","Every",0.0);
      lp_label(x,960,300,"Every Friday, the same half-hour",{align:"center",a:ag_in(tt,f0,0.5)});
      bw_fridays(x,150,380,1620,{u:ag_in(tt,f0,2.6)});
      bw_pill(x,tt,w("count","fifteen",-0.1),null,560,700,"15 tried",{col:LP.ink});
      bw_pill(x,tt,w("count","fourteen",-0.1),null,960,700,"14 kept",{col:LP.green,icon:"tick"});
      bw_pill(x,tt,w("count","dropped",-0.3),null,1360,700,"1 dropped",{col:BW_GREY,icon:"cross"});}}
  ]);
  bw_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Written into the procedure */
scene("written",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // each kept change, written that same day into the procedure it changed; the ask procedure's second step, its date and why; so it lasts
    {at:0,place:"bwFriday",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const a0=c.ask-0.3;
      bw_pages(x,150,240,1620,{u:ag_in(tt,w("same","procedure",-0.2),1.4),n:ag_in(tt,w("same","six",-0.1),1.0),a:1-ag_in(tt,a0-0.6,0.4),light:"late"});
      if(tt>=a0)bw_askPage(x,120,150,840,{a:ag_in(tt,a0,0.4),k:tt-a0,fix:ag_in(tt,w("ask","second",-0.1),1.8),hl:ag_in(tt,w("ask","second",1.5),0.5),date:ag_in(tt,w("ask","date",-0.1),0.6),light:"late"});
      bw_tag(x,tt,w("lasts","someone",-0.2),null,1440,400,"Someone new learns it from the page",{align:"center",col:LP.blue});
      bw_tag(x,tt,w("lasts","holds",-0.2),null,1440,490,"It holds while Ivy is away",{align:"center",col:LP.green});}},
    // days from ask to first use: 14, from 24 in June; work sent back: 6 in 100; the small wins, shown at each fortnightly review
    {at:c.days-0.3,place:"bwFriday",later:true,keys:[[c.days-0.3,960,540,1.0]],draw:(x,tt)=>{const d0=w("days","fourteen",-0.3),q0=w("quality","six",-0.3);
      if(tt>=d0)lp_figure(x,240,170,680,{kick:"Days from ask to first use",num:"14",label:"Down from 24 in June"},{col:LP.green,light:"late",a:ag_in(tt,d0,0.35),k:tt-d0});
      bw_tag(x,tt,w("days","Friday",-0.2),null,580,560,"Part of it: the Friday changes, with July's fixes",{align:"center",col:LP.ink});
      if(tt>=q0)lp_figure(x,1000,170,680,{kick:"Work sent back for changes",num:"6 in 100",label:"Faster hasn't meant worse"},{col:LP.green,light:"late",a:ag_in(tt,q0,0.35),k:tt-q0});
      bw_pill(x,tt,w("wins","review",-0.2),null,960,740,"The small wins, shown at each fortnightly review",{col:LP.green});}}
  ]);
  bw_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // the pocket card's last step, then; each procedure's page now: the best way so far, until a Friday finds a better one
    {at:0,place:"bwMon",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const k0=0.8,p0=w("pages","page",-0.2);
      if(tt>=k0)bw_card(x,100,130,{a:ag_in(tt,k0,0.4),k:tt-k0,hl:ag_in(tt,w("back","until",-0.1),0.6),light:"morning"});
      if(tt>=p0)bw_askPage(x,1010,130,820,{a:ag_in(tt,p0,0.4),k:tt-p0,fix:1,date:1,light:"morning"});
      bw_tag(x,tt,w("pages","best",-0.1),null,960,830,"The best way so far, until a Friday finds a better one",{align:"center",col:LP.blue});}},
    // on Monday: four things to do; then the film in one line
    {at:c.protect-0.3,place:"bwMon",later:true,keys:[[c.protect-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.6,0.5);
      if(g>0.004){x.save();x.globalAlpha*=g;
        bw_sheet(x,tt,w("protect","protect",-0.2),140,170,800,{kick:"One",title:"Protect half an hour, the same time every week"},{col:LP.blue,light:"morning"});
        bw_sheet(x,tt,w("measure","Pick",-0.2),980,170,800,{kick:"Two",title:"Pick one measure; find where the work waits"},{col:LP.orange,light:"morning"});
        bw_sheet(x,tt,w("change","Change",-0.2),140,450,800,{kick:"Three",title:"Change one thing for a week; keep or drop it, out loud"},{col:LP.blue,light:"morning"});
        bw_sheet(x,tt,w("write","Write",-0.2),980,450,800,{kick:"Four",title:"Write what you keep into the procedure; show the small wins"},{col:LP.green,light:"morning"});
        bw_tag(x,tt,w("ldp","leader",-0.3),null,960,836,"How a leader makes it everyone's habit: Leading data people",{align:"center",col:LP.ink});
        x.restore();}
      bw_pill(x,tt,w("take","One",-0.1),e0,560,480,"One measure",{col:LP.orange});
      bw_pill(x,tt,w("take","small",-0.2),e0,960,480,"One small change",{col:LP.blue});
      bw_pill(x,tt,w("take","every",-0.1),e0,1360,480,"Every week",{col:LP.green});}}
  ]);
  lp_end(ctx,S,t,e0,BW_TITLE,BW_LAST,"Film 3 of 4","Small steps, measured",{module:"Data management",mark:dm_mark});
  bw_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["friday","six","kept","written"]);
