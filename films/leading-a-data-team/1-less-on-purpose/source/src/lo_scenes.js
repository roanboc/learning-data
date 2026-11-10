/* ===== Less, on purpose: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const LO_LAST="Keep what people use; stop the rest, together.";
// the film's number and title at the top left, from the second chapter on
function lo_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1","Less, on purpose",Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function lo_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const lo_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function lo_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 (and goes at t1)
function lo_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a figure sheet (one number) that springs in at t0 (and goes from o.out)
function lo_fig(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return;lp_figure(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// a heading in capitals on the wall
function lo_head(ctx,t,t0,x,y,text,o){o=o||{};const a=ag_in(t,t0,0.5)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a>0.004)lp_label(ctx,x,y,text,{a,col:o.col||LP.mut,align:o.align});}

/* ---------------------------------------------------------------- 1. Do less: Britain, 2010 to 2013 */
scene("doless",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),pg={light:null,pin:false},home={light:"evening",wall:0.12},grey={light:"grey",wall:0.14};
  const boxT=w("archive","archive",-0.2),sortT=c.keep-0.2,sortD=Math.max(3.6,c.rules-c.keep-0.8);
  ag_shots(ctx,S,t,sc.dur,[
    // Britain, 2010: the wall of the web, its pages coming in from the middle as the camera draws back
    {at:0,place:"loOffice",keys:[[0,760,430,1.5],[1.0,960,520,1.0]],d:Math.max(3,c.pages+0.6),push:0.02,draw:(x,tt)=>{
      lo_pages(x,tt,{n:ag_sine(ag_in(tt,0.4,c.pages+1.6)),dim:0.35*ag_in(tt,w("pages","millions",-0.3),0.6)});
      lo_sheet(x,tt,w("when","Britain",-0.2),130,120,420,{kick:"Britain",title:"2010"},Object.assign({out:c.need-0.6},pg));
      lo_sheet(x,tt,w("pages","millions",-0.3),640,300,700,{kick:"The government online",title:"Millions of pages, on hundreds of websites",lines:["Most run by one department alone"]},
        Object.assign({out:c.need-0.6,u:ag_in(tt,w("pages","department",-0.3),0.5)},pg));}},
    // at home, on an evening: someone who needs a passport renewed, or a tax paid, and which site to trust
    {at:c.need-0.3,place:"loHome",keys:[[c.need-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      lp_person(x,LO_RESIDENT,880,690,0.95,{t:tt,cut:812,light:home});lp_table(x,560,820,800);lp_laptop(x,1110,806,230,{glow:1});
      lo_tag(x,tt,w("need","passport",-0.2),c.same-0.5,500,300,"Renew a passport? Pay a tax?",{align:"center",col:LP.ink});
      lo_tag(x,tt,w("need","part",-0.1),c.same-0.5,1400,330,"Which part of government?",{align:"center",col:LP.ink});
      lo_tag(x,tt,w("need","trust",-0.2),c.same-0.5,1400,410,"Which site to trust?",{align:"center",col:LP.ink});
      // the same advice, on two sites, in different words; time lost
      const s0=w("same","same",-0.2),d0=w("same","different",-0.2);
      lo_twoPages(x,{a:ag_in(tt,s0,0.4),k:tt-s0,k2:tt-s0-0.5,b:ag_in(tt,s0+0.5,0.4),ring:ag_in(tt,d0,0.4)});
      lo_tag(x,tt,d0+0.1,c.cost-0.4,960,120,"The same advice, in different words",{align:"center",col:LP.amber});
      lo_pill(x,tt,w("same","time",-0.2),c.cost-0.4,385,540,"Time lost",{col:LP.amber,icon:"wait"});
      lo_tag(x,tt,w("same","sure",-0.2),c.cost-0.4,1535,540,"Which page is right?",{align:"center",col:LP.amber});}},
    // what all those websites cost; something has to change
    {at:c.cost-0.3,place:"loOffice",keys:[[c.cost-0.3,960,520,1.0]],dis:1.2,draw:(x,tt)=>{
      lo_pages(x,tt,{dim:0.35+0.3*ag_in(tt,c.change,0.8),same:ag_io(tt,c.cost+0.2,c.change,0.5)});
      lo_fig(x,tt,w("cost","560",-0.3),580,250,760,{kick:"What the websites cost",num:"£560 million",label:"A year, paid by taxpayers"},{col:LP.amber,light:null,pin:false,out:c.change+0.2});
      lo_tag(x,tt,c.change+0.3,c.review-0.4,960,470,"Something has to change",{align:"center",col:LP.ink});}},
    // October 2010: the review, and its advice; the old pages archived, not moved
    {at:c.review-0.3,place:"loOffice",keys:[[c.review-0.3,960,520,1.0],[boxT,1000,540,1.0]],draw:(x,tt)=>{
      lo_pages(x,tt,{dim:0.65,box:ag_in(tt,boxT,3.0)});
      lo_box(x,LO_BOX.x,LO_BOX.y,{a:ag_in(tt,boxT-0.6,0.5),fill:ag_in(tt,boxT+0.8,2.4)});
      lo_letter(x,110,130,{a:ag_in(tt,w("review","Martha",-0.2),0.4),k:tt-w("review","Martha",-0.2),
        u:lo_u(tt,[w("advice","website",-0.2),w("advice","team",-0.2),w("archive","move",-0.2),w("archive","Write",-0.2)])});}},
    // the new team, 2011: the two old sites read page by page, and what people searched for; most of it archived, a few needs kept
    {at:c.gds-0.3,place:"loLondon",keys:[[c.gds-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      lo_sheet(x,tt,w("gds","team",-0.2),110,110,780,{kick:"2011 · Government Digital Service",title:"A new team builds it"},Object.assign({},pg,{out:c.rules-0.6}));
      lo_stacks(x,{a:ag_in(tt,w("read","Directgov",-0.3),0.5),left:1-0.7*ag_in(tt,sortT,sortD)});
      lp_person(x,lp_crowd(1),980,790,0.6,{t:tt,light:grey,a:ag_in(tt,w("gds","team",0.2),0.6)});lp_person(x,lp_crowd(4),1240,790,0.6,{t:tt,flip:true,light:grey,a:ag_in(tt,w("gds","team",0.5),0.6)});
      const q0=w("read","searched",-0.2);lo_head(x,tt,q0,780,388,"What people searched for",{col:LP.orange,out:sortT+0.2});
      [["renew passport",780,450],["pay car tax",780,520],["find a job",1070,450]].forEach(([s,tx,ty],i)=>lo_tag(x,tt,q0+0.25*i,sortT+0.2,tx,ty,s,{col:LP.orange}));
      lo_head(x,tt,sortT+0.4,1090,150,"What people need",{col:LP.green});
      lo_box(x,LO_BOX.x,LO_BOX.y,{a:ag_in(tt,sortT,0.5),fill:ag_in(tt,sortT+1.0,sortD)});lo_sort(x,tt,{u:ag_in(tt,sortT+0.3,sortD)});
      lo_stackNames(x,{a:ag_in(tt,w("read","Directgov",-0.3),0.5)});}},
    // 2012: the design principles; the second, do less
    {at:c.rules-0.3,place:"loLondon",later:true,keys:[[c.rules-0.3,960,540,1.0]],draw:(x,tt)=>{
      lo_sheet(x,tt,c.rules+0.2,160,190,760,{kick:"2012 · Design principles",lines:["One: start with user needs","Two: do less"]},
        Object.assign({},pg,{col:LP.blue,u:lo_u(tt,[w("rules","first",-0.2),w("rules","second",-0.2)])}));
      lo_sheet(x,tt,c.only-0.1,1000,190,760,{kick:"Do less",title:"Government should only do what only government can do."},Object.assign({},pg,{col:LP.blue}));}},
    // October 2012 to spring 2013: one site, far fewer pages; what people got
    {at:c.launch-0.3,place:"loOffice",keys:[[c.launch-0.3,960,520,1.0]],dis:1.2,draw:(x,tt)=>{
      lo_plain(x,750,150,420,{a:ag_in(tt,c.launch,0.5),k:tt-c.launch});
      for(let i=0;i<8;i++)lo_page(x,700+i*66,712,58,44,i,{tone:[96,96,100],a:ag_in(tt,w("launch","fewer",-0.2)+i*0.08,0.4)});
      lo_sheet(x,tt,w("launch","replaces",-0.2),100,140,580,{kick:"October 2012 · GOV.UK",title:"Replaces both sites",lines:["Far fewer pages: about 3,800 pieces of content"]},
        Object.assign({},pg,{col:LP.green,u:ag_in(tt,w("launch","fewer",-0.2),0.5)}));
      lo_sheet(x,tt,c.test+0.1,1240,140,580,{kick:"In tests",title:"61 tasks in 100 finished",lines:["Against 46 on Business Link","And a minute faster"]},
        Object.assign({},pg,{col:LP.green,u:lo_u(tt,[w("test","46",-0.2),w("test","minute",-0.2)])}));
      lo_sheet(x,tt,c.save+0.1,100,500,580,{kick:"For taxpayers",title:"Up to £70 million a year less"},Object.assign({},pg,{col:LP.green}));
      lo_sheet(x,tt,c.award+0.1,1240,500,580,{kick:"Spring 2013",title:"Design of the Year",lines:["London's Design Museum"]},Object.assign({},pg,{col:LP.green}));}},
    // a data team's work piles up the same way; stop what nobody uses, and the time goes back to the work that matters
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8);
      lo_pile(x,tt,{u:ag_in(tt,c.data+0.2,Math.max(2.4,w("data","reason",0)-c.data)),thin:ag_in(tt,w("back","Stop",-0.1),1.6),keep:ag_in(tt,w("back","time",-0.2),1.2),a:ga});
      lo_tag(x,tt,w("data","reason",-0.2),c.back-0.3,960,110,"Each added for a good reason, rarely taken away",{align:"center",col:LP.ink});
      lo_tag(x,tt,w("back","time",0.2),c.breath+0.1,960,600,"The time goes back to the work that matters",{align:"center",col:LP.green});
      lo_tag(x,tt,w("choose","simpler",-0.2),c.breath+0.1,960,110,"Simpler doesn't just happen: someone chooses it",{align:"center",col:LP.ink});}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"Less, on purpose","Simpler doesn't just happen","Leading data people · Leading a data team");
});

/* ---------------------------------------------------------------- 2. Everything on one wall */
// the team's wall, Tuesday 4 May: the 38 reports, each person's week of meetings, a week's alerts; o: the three zones' u, and cold (the 17)
// f0, f1, f2: when each zone fills (by default with its header); used: the 21 that people read, outlined in green
function lo_wall(x,tt,o){o=o||{};const f0=o.f0==null?o.r0:o.f0,f1=o.f1==null?o.m0:o.f1,f2=o.f2==null?o.a0:o.f2;
  lo_head(x,tt,o.r0,150,232,"38 old reports",{col:LP.orange});lo_reports(x,tt,150,262,{u:ag_in(tt,f0,2.2),cold:ag_in(tt,o.cold,1.6),used:o.used||0});
  lo_head(x,tt,o.m0,980,232,"Standing meetings",{col:LP.amber});lo_week(x,980,262,400,346,"before",{a:ag_in(tt,f1,0.4),k:tt-f1,u:ag_in(tt,f1+0.2,1.6)});
  lo_head(x,tt,o.a0,1460,232,"A week's alerts",{col:LP.amber});lo_alerts(x,tt,1462,268,{u:ag_in(tt,f2,2.0)});}
scene("wall",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const r0=w("reports","38",-0.2),m0=w("meetings","eight",-0.4),a0=w("alerts","60",-0.3),cold=w("reports","17",-0.2),f0=w("list","everything",-0.3);
  ag_shots(ctx,S,t,sc.dur,[
    // the series' four ideas; this film's is the first
    {at:0,place:"lpRoom",later:true,keys:[[0,960,520,1.0]],push:0.015,draw:(x,tt)=>{
      lo_four(x,{u:lo_u(tt,[w("series","minimalism",-0.2),w("series","kaizen",-0.2),w("series","Ubuntu",-0.2),w("series","decentralisation",-0.2)]),first:ag_in(tt,c.first,0.8)});}},
    // the university, a year from now: Helena and her team of eight
    {at:c.univ-0.3,place:"lpRoom",later:true,keys:[[c.univ-0.3,960,540,1.0]],draw:(x,tt)=>{
      lo_sheet(x,tt,w("univ","Helena",-0.2),1000,200,720,{kick:"The data manager",title:"Helena Novak",lines:["Leads a data team of eight: Noor, Sam, Jun, Yusuf, Ivy and three more"]},
        {light:"day",u:ag_in(tt,w("univ","eight",-0.2),0.5)});
      lp_person(x,"helena",560,650,1.0,{t:tt,light:dy});}},
    // Tuesday 4 May: everything on one wall
    {at:c.list-0.3,place:"lpRoom",later:true,keys:[[c.list-0.3,960,540,1.0]],draw:(x,tt)=>{
      lo_tag(x,tt,w("list","Tuesday",-0.2),null,960,156,"Tuesday 4 May: everything on one wall",{align:"center",col:LP.ink});
      lo_wall(x,tt,{r0,m0,a0,cold,f0,f1:f0+0.7,f2:f0+1.4});
      lo_tag(x,tt,cold+0.2,null,150,668,"17 not opened in a year",{col:LP.amber});
      lo_tag(x,tt,m0+0.6,null,980,668,"About 8 h a week each",{col:LP.amber});
      lo_tag(x,tt,a0+0.3,null,1790,668,"About 60 a week",{align:"right",col:LP.amber});
      lo_tag(x,tt,w("alerts","nothing",-0.2),null,1790,742,"Most need nothing",{align:"right",col:LP.amber});
      // each added for a good reason
      lo_tag(x,tt,w("reason","request",-0.2),null,330,420,"A request",{align:"center",col:LP.ink});
      lo_tag(x,tt,w("reason","project",-0.2),null,1180,480,"A project",{align:"center",col:LP.ink});
      lo_tag(x,tt,w("reason","night",-0.2),null,1790,420,"A night when something broke",{align:"right",col:LP.ink});}},
    // most people improve by adding; one in ten ideas took something away
    {at:c.study-0.3,place:"lpRoom",later:true,keys:[[c.study-0.3,960,540,1.0]],draw:(x,tt)=>{
      lo_sheet(x,tt,w("study","Nature",-0.3),360,170,1200,{kick:"Adams and colleagues · Nature, 2021",title:"People overlook taking things away",
        lines:["Asked to make something better, most add to it","A university asked for ideas: about 1 in 10 took something away"]},{light:"day",u:lo_u(tt,[w("study","add",-0.2),c.uni+0.2])});
      lo_ideas(x,508,600,{u:ag_in(tt,w("uni","ideas",-0.2),1.4),ring:ag_in(tt,w("uni","away",-0.3),0.5)});}},
    // so the team chooses, together
    {at:c.ask-0.3,place:"lpRoom",later:true,keys:[[c.ask-0.3,960,540,1.0]],draw:(x,tt)=>{
      LO_TEAM.forEach(([who,px],i)=>{lp_person(x,who,px,770,0.7,{t:tt,flip:px>960,light:dy});lp_nameTag(x,px,540,who,{align:"center",role:"",a:ag_in(tt,c.ask+0.2+i*0.15,0.4)});});
      lo_pill(x,tt,w("ask","keep",-0.2),null,760,300,"What to keep",{col:LP.green});
      lo_pill(x,tt,w("ask","stop",-0.2),null,1160,300,"What to stop",{col:LP.ink});
      lo_tag(x,tt,w("ask","together",-0.2),null,960,400,"Chosen together, by the team",{align:"center",col:LP.ink});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,c.univ,c.list+2.2,0.5)});
  lo_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. What each thing is for */
scene("use",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // who uses it, and for what? For the reports, the logs answer
    {at:0,place:"lpRoom",later:true,keys:[[0,960,520,1.0]],push:0.015,draw:(x,tt)=>{
      lo_tag(x,tt,w("who","who",-0.2),null,960,156,"Who uses it, and for what?",{align:"center",col:LP.ink});
      lo_wall(x,tt,{r0:-9,m0:-9,a0:-9,cold:-9,used:ag_in(tt,w("logs","21",-0.2),1.0)});
      lo_tag(x,tt,w("logs","260",-0.2),null,150,668,"21 read by about 260 people",{col:LP.green});
      lo_tag(x,tt,w("logs","nobody",-0.2),null,150,742,"17 by nobody, for a year or more",{col:LP.amber});}},
    // what each kind of thing is for
    {at:c.agree-0.3,place:"lpRoom",later:true,keys:[[c.agree-0.3,960,540,1.0]],draw:(x,tt)=>{
      lo_tag(x,tt,c.agree+0.2,null,960,230,"What each thing is for",{align:"center",col:LP.blue});
      lo_sheet(x,tt,c.meeting+0.1,110,310,540,{kick:"A meeting is for",title:"Deciding together, or helping someone",lines:["Not reading out what the board shows"]},{col:LP.blue,u:ag_in(tt,w("meeting","Not",-0.2),0.5)});
      lo_sheet(x,tt,c.alert+0.1,690,310,540,{kick:"An alert is for",title:"Someone who must act now"},{col:LP.blue});
      lo_sheet(x,tt,c.report+0.1,1270,310,540,{kick:"A report is for",title:"A decision someone makes"},{col:LP.blue});}},
    // the week they design: about three hours instead of eight
    {at:c.week-0.3,place:"lpRoom",later:true,keys:[[c.week-0.3,960,540,1.0]],draw:(x,tt)=>{const d0=w("week","design",-0.2);
      lo_week(x,110,190,440,460,"before",{a:ag_in(tt,c.week,0.4),k:tt-c.week,title:"Before: about 8 h"});
      lo_week(x,590,190,440,460,"designed",{a:ag_in(tt,d0,0.4),k:tt-d0,title:"Designed: about 3 h",u:lo_u(tt,[w("week","stand-up",-0.2),w("week","planning",-0.2),w("more","one-to-one",-0.3),w("more","review",-0.2)])});
      lo_sheet(x,tt,w("week","stand-up",-0.3),1080,190,730,{kick:"The designed week",lines:["Stand-up, 15 minutes each morning","Planning on Monday, 45 minutes","A review with the people who asked, every second Thursday, 1 hour","A one-to-one, 30 minutes"]},
        {col:LP.blue,u:lo_u(tt,[w("week","stand-up",-0.2),w("week","planning",-0.2),w("more","review",-0.2),w("more","one-to-one",-0.3)])});
      lo_pill(x,tt,w("hours","three",-0.2),null,570,740,"About 3 h a week each, instead of 8",{col:LP.blue,size:32});}}
  ]);
  lo_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Stopped, openly */
scene("stop",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const offT=w("off","switched",-0.2),sortT=w("alerts","kind",-0.4),sumT=c.nothing+0.2,actT=w("twelve","12",-0.2);
  // the 38 reports and the plan: the same in both of their shots
  const plan=(x,tt)=>{lo_reports(x,tt,150,250,{cold:1,used:1,off:ag_in(tt,offT,2.0)});
    lo_sheet(x,tt,c.case+0.1,1000,200,780,{kick:"Tuesday 25 May · The data council",title:"The plan, approved",lines:["The 21 reports people read move to the platform","The 17 don't"]},
      {col:LP.blue,light:"morning",u:lo_u(tt,[w("case","21",-0.2),w("case","17",-0.2)])});};
  ag_shots(ctx,S,t,sc.dur,[
    // from Monday 10 May, the designed week; the round of updates stops, and the board shows it
    {at:0,place:"loMorning",later:true,keys:[[0,960,520,1.0]],push:0.015,draw:(x,tt)=>{const s0=w("monday","stop",-0.2);
      lo_week(x,110,200,440,440,"before",{a:ag_in(tt,0.4,0.4)*(1-ag_in(tt,s0+1.6,0.6)),title:"Before",strike:ag_in(tt,s0,1.2),light:"morning"});
      lo_week(x,590,200,440,440,"designed",{a:ag_in(tt,w("monday","week",-0.2),0.4),k:tt-w("monday","week",-0.2),title:"From Monday 10 May",light:"morning"});
      lo_board(x,1120,200,{a:ag_in(tt,w("monday","board",-0.3),0.4),k:tt-w("monday","board",-0.3),w:640,h:400,light:"morning"});
      lo_tag(x,tt,w("monday","round",-0.2),null,1440,680,"The weekly round of updates: the board shows it",{align:"center",col:LP.ink});}},
    // for each of the 17, a note to its last readers first; most have moved on, one needs last year's figures
    {at:c.write-0.3,place:"loMorning",later:true,keys:[[c.write-0.3,960,540,1.0]],draw:(x,tt)=>{
      lo_reports(x,tt,150,250,{only:"cold",cols:6,s:1.2,cold:1,u:ag_in(tt,c.write,1.0),mail:ag_in(tt,w("write","writes",-0.1),2.4),mailTo:1440,mailY:330});
      lo_tag(x,tt,w("write","readers",-0.2),null,1440,250,"To its last readers, and whoever asked",{align:"center",col:LP.ink});
      lo_tag(x,tt,w("reply","Most",-0.1),null,1440,420,"Most have moved on",{align:"center",col:LP.ink});
      lo_pill(x,tt,w("reply","figures",-0.2),null,1440,540,"Last year's figures: a copy sent",{col:LP.green,icon:"tick"});}},
    // Tuesday 25 May: the plan; Monday 31 May: the 17 switched off, not deleted, and back on within a day until December
    {at:c.case-0.3,place:"loMorning",later:true,keys:[[c.case-0.3,960,540,1.0]],draw:(x,tt)=>{plan(x,tt);
      lo_pill(x,tt,offT+0.2,null,519,720,"Switched off, not deleted",{col:LP.amber,icon:"wait"});
      lo_tag(x,tt,w("undo","December",-0.3),null,519,810,"Back on within a day, until December",{align:"center",col:LP.ink});}},
    // GOV.UK did the same with its old pages
    {at:c.gov-0.3,place:"loOffice",keys:[[c.gov-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lo_box(x,960,770,{w:460,fill:1,a:ag_in(tt,c.gov,0.4)});
      lo_tag(x,tt,w("gov","pages",-0.2),null,960,250,"GOV.UK's old pages",{align:"center",col:LP.ink});
      lo_tag(x,tt,w("gov","archived",-0.2),null,960,330,"Archived, where they can still be found",{align:"center",col:LP.ink});}},
    // the alerts, one kind at a time: when this fires, what do we do? Nothing: a line in the Monday summary. By 7 June, about 12
    {at:c.alerts-0.3,place:"loMorning",keys:[[c.alerts-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      const nt=[w("alerts","Sam",-0.2),w("alerts","Noor",-0.2),w("alerts","Jun",-0.2)];
      [["sam",260],["noor",520],["jun",780]].forEach(([who,px],i)=>{lp_person(x,who,px,780,0.7,{t:tt,light:mo});lp_nameTag(x,px,545,who,{align:"center",role:"",a:ag_in(tt,nt[i],0.4)});});
      lo_alerts(x,tt,1170,236,{sort:ag_in(tt,sortT,1.4),sum:ag_in(tt,sumT,2.0),act:ag_in(tt,actT,1.4),actX:1170,actY:250,sumX:1200,sumY:680});
      lo_tag(x,tt,w("alerts","fires",-0.3),c.twelve-0.3,1430,150,"When this fires, what do we do?",{align:"center",col:LP.ink});
      lo_sheet(x,tt,sumT-0.2,1170,650,580,{kick:"Each Monday morning",title:"A summary"},{light:"morning",pin:false});lo_sumLines(x,1480,764,ag_in(tt,sumT+0.6,1.8));
      lo_tag(x,tt,w("twelve","act",-0.2),null,1430,150,"About 12 a week, each needing action",{align:"center",col:LP.amber});
      lo_tag(x,tt,w("twelve","note",-0.2),null,1430,598,"Each with a note: what to do",{align:"center",col:LP.blue});}},
    // the team chooses every cut, and any cut can be undone
    {at:c.choose-0.3,place:"loMorning",later:true,keys:[[c.choose-0.3,960,540,1.0]],draw:(x,tt)=>{
      LO_TEAM.forEach(([who,px])=>{lp_person(x,who,px,770,0.7,{t:tt,flip:px>960,light:mo});});
      lo_pill(x,tt,w("choose","chooses",-0.2),null,960,300,"The team chooses every cut",{col:LP.ink});
      lo_tag(x,tt,w("choose","undone",-0.3),null,960,400,"Any cut can be undone",{align:"center",col:LP.ink});}}
  ]);
  lo_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Less, but better */
scene("roots",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // minimalism began as a word for art: the United States, the 1960s
    {at:0,place:"lpRoom",later:true,keys:[[0,960,520,1.0]],push:0.015,draw:(x,tt)=>{
      lo_art(x,{u:ag_in(tt,w("art","art",-0.2),2.0)});
      lo_sheet(x,tt,w("art","States",-0.3),1230,200,560,{kick:"Minimalism",title:"The United States, 1960s",lines:["Work pared down to its simplest forms"]},{light:"day",u:ag_in(tt,w("art","simplest",-0.3),0.5)});}},
    // for a team, two ideas from Japan; and nobody's work is called waste
    {at:c.japan-0.3,place:"lpRoom",later:true,keys:[[c.japan-0.3,960,540,1.0]],draw:(x,tt)=>{
      lo_tag(x,tt,w("japan","ideas",-0.2),null,960,170,"For a team: two ideas from Japan",{align:"center",col:LP.ink});
      lo_sheet(x,tt,c.kanso+0.1,180,250,700,{kick:"Kanso · Japanese aesthetics",title:"Simplicity: plain, with nothing extra"},{light:"day"});
      lo_sheet(x,tt,c.lean+0.1,1040,250,700,{kick:"Lean · Muda",title:"Work that adds no value"},{light:"day"});
      lo_pill(x,tt,w("never","never",-0.2),null,960,540,"Nobody's work is called waste",{col:LP.ink});
      lo_reports(x,tt,960-lo_repW(0.85,17)/2,620,{only:"cold",cols:17,s:0.85,u:ag_in(tt,w("never","Every",-0.2),1.2)});
      lo_tag(x,tt,w("never","answered",-0.2),null,960,750,"Every report once answered a real question",{align:"center",col:LP.ink});}},
    // less, but better
    {at:c.rams-0.3,place:"lpRoom",later:true,keys:[[c.rams-0.3,960,540,1.0]],draw:(x,tt)=>{
      lo_sheet(x,tt,w("rams","Dieter",-0.2),560,150,800,{kick:"Dieter Rams, designer",title:"Less, but better"},{light:"day"});
      lo_pile(x,tt,{u:1,thin:1,keep:1,a:ag_in(tt,w("better","stays",-0.3),0.6)});
      lo_pill(x,tt,w("better","Better",-0.2),null,960,600,"Better is the point",{col:LP.green});
      lo_tag(x,tt,w("better","stays",-0.2),null,960,690,"What stays gets the time",{align:"center",col:LP.green});}}
  ]);
  lo_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. The time back */
scene("time",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    // June: about five hours a week back each; across eight people, one person's whole week
    {at:0,place:"loLate",later:true,keys:[[0,960,520,1.0]],push:0.015,draw:(x,tt)=>{const h0=w("hours","five",-0.2),e0=w("hours","Across",-0.2);
      lo_sheet(x,tt,c.june+0.1,150,170,620,{kick:"June · Measured",title:"About 5 h a week back, each"},{light:"late",col:LP.green});
      lo_back(x,960,430,{u:ag_in(tt,h0,1.4),sum:ag_in(tt,e0,1.6),bw:140});
      lo_pill(x,tt,w("hours","whole",-0.2),null,960,570,"About one person's whole week, every week",{col:LP.green,size:32});}},
    // every alert that reaches Sam now matters
    {at:c.sam-0.3,place:"loLate",later:true,keys:[[c.sam-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"sam",520,660,1.0,{t:tt,light:lt});
      lo_alerts(x,tt,1000,250,{act:1,actX:1000,actY:250,sum:1,sort:1});
      lo_pill(x,tt,w("sam","matters",-0.3),null,1290,620,"Every alert now matters",{col:LP.green,icon:"tick"});}},
    // the time goes to the work people use: the 21, rebuilt on the platform, each with an owner
    {at:c.goes-0.3,place:"loLate",later:true,keys:[[c.goes-0.3,960,540,1.0]],draw:(x,tt)=>{
      lo_sheet(x,tt,c.goes+0.1,120,200,700,{kick:"Where the time goes",title:"The work people use",lines:["The 21 reports they read, rebuilt on the platform","Each with an owner"]},
        {light:"late",col:LP.green,u:lo_u(tt,[w("goes","21",-0.2),w("goes","owner",-0.2)])});
      lo_platform(x,tt,{x:900,y:200,u:ag_in(tt,w("goes","rebuilding",-0.2),2.2),own:ag_in(tt,w("goes","owner",-0.2),1.4),light:"late"});}},
    // to keep it, one rule; and the wall again at each quarterly review
    {at:c.rule-0.3,place:"loLate",later:true,keys:[[c.rule-0.3,960,540,1.0]],draw:(x,tt)=>{
      lo_sheet(x,tt,c.rule+0.1,360,180,1200,{kick:"The team's rule",title:"Anything new needs a reader, a reason and an owner"},{light:"late",col:LP.blue});
      lo_tag(x,tt,w("review","quarterly",-0.2),null,960,440,"Each quarterly review: 27 July, 26 October",{align:"center",col:LP.ink});
      lo_miniWall(x,tt,w("review","wall",-0.4),520);
      lo_tag(x,tt,w("review","wall",-0.2),null,960,800,"Everything back on the wall",{align:"center",col:LP.ink});}}
  ]);
  lo_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // GOV.UK: what people needed, done well
    {at:0,place:"loOffice",keys:[[0,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      lo_plain(x,750,150,420,{a:ag_in(tt,0.7,0.5),k:tt-0.7});
      lo_pill(x,tt,w("back","found",-0.2),null,380,330,"Found what people needed",{col:LP.blue});
      lo_pill(x,tt,w("back","less",-0.2),null,1540,330,"Did less, and did it well",{col:LP.green});}},
    // Helena's team did the same
    {at:c.helena-0.3,place:"loMorning",keys:[[c.helena-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      lp_person(x,"helena",520,650,1.0,{t:tt,light:mo});
      lo_pill(x,tt,w("helena","kept",-0.2),null,1240,330,"Kept what people use",{col:LP.green,icon:"tick"});
      lo_pill(x,tt,w("helena","week",-0.2),null,1240,440,"A person's week back, every week",{col:LP.green,icon:"tick"});}},
    // on Monday: four things to do; the next film; the last line
    {at:c.list-0.3,place:"loMorning",later:true,keys:[[c.list-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        lo_sheet(x,tt,c.list+0.2,120,140,820,{kick:"One",title:"List everything you run and attend"},{light:"morning"});
        lo_sheet(x,tt,c.who+0.1,980,140,820,{kick:"Two",title:"Ask who uses each thing, and for what"},{light:"morning"});
        lo_sheet(x,tt,c.stop+0.1,120,430,820,{kick:"Three",title:"Stop the rest together: switch off, wait, delete"},{col:LP.amber,light:"morning"});
        lo_sheet(x,tt,c.time+0.1,980,430,820,{kick:"Four",title:"Measure the time back, and protect it"},{col:LP.green,light:"morning"});
        x.restore();}
      lo_tag(x,tt,w("next","One",-0.1),c.take-0.4,960,790,"Next: One small change at a time",{align:"center",col:LP.ink});
      const ta=ag_in(tt,c.take,0.4)*(1-ag_in(tt,e0,0.8));
      if(ta>0.004){for(const [s,wd,px,col] of [["Keep what people use","Keep",960-300,LP.green],["Stop the rest, together","stop",960+300,LP.ink]])
        {const t0=w("take",wd,-0.1);lp_pill(x,px,470,s,{col,size:34,a:ta*ag_in(tt,t0,0.4),k:tt-t0});}}}}
  ]);
  lp_end(ctx,S,t,e0,"Less, on purpose",LO_LAST,"Film 1 of 4","Leading a data team");
  lo_kick(ctx,S,1-ag_in(t,e0,0.8),{light:"morning"});
});
ag_cutInto(["wall","use","stop","roots","time"]);
