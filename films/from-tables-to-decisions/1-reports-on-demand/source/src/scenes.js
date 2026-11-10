/* ===== Reports on demand: the scenes =====
   Five chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (rd_places.js, rd_tools.js and the module's map and night); what moves is drawn live in the shots of ag_shots. 1936's rooms share
   the night (the watch, the machine, Jane Cain's studio, the dial), each named a room of its own, so a shot of one dissolves into the
   next only where the whole picture changes; in one room the camera glides and only what changes fades, and a later moment there
   (later: true) lets what was there leave first. Cards, tags and the tools' pages are drawn in the frame (rd_scr), so their words keep
   their size whatever the camera does. */

/* ---------------------------------------------------------------- 1936: what every shot of it draws */
// the time on the exchange's clock and the machine's dial: 10:47 in the morning, and on, second by second
const rd_hms=tt=>{const s=10*3600+47*60+22+tt;return[Math.floor(s/3600),Math.floor(s/60)%60,s%60];};
// the calls: lamps lit amber across the board, each for a while (n of them, from t0 over span, each lit about dur seconds)
function rd_calls(seed,n,t0,span,dur){const out=[];for(let k=0;k<n;k++){const on=t0+hash(seed+k,1)*span;out.push([Math.floor(hash(seed+k,2)*14),Math.floor(hash(seed+k,3)*6),on,on+dur*(0.7+0.6*hash(seed+k,4))]);}return out;}
const rd_lit=(calls,tt)=>calls.map(([i,j,on,off])=>[i,j,ag_in(tt,on,0.25)*(1-ag_in(tt,off,0.35))]);
// the exchange: its lamps (lit), its clock, and the operator at the board, looking at gz (blended in, never switched)
function rd_exch(c,tt,lit,gz){rd_lamps(c,lit,MD.wait);const [h,m,s]=rd_hms(tt);rd_clockFace(c,RD_BOARD.clock[0],RD_BOARD.clock[1],RD_BOARD.clock[2],h,m,s);
  md_person(c,RD_OP,500,640,0.95,{t:tt,gaze:gz||[6,-2],light:RD_PAST});}
// the warm light of the past, laid live over the night where a 1936 room stands
function rd_pool(c,x,y,r,a){const q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(RD.lamp,a));q.addColorStop(1,rgba(RD.lamp,0));c.fillStyle=q;c.fillRect(0,0,W,H);}
const rd_mix2=(a,b,u)=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];

/* ---------------------------------------------------------------- 1 · The speaking clock */
scene("clock",(ctx,S,t,sc)=>{
  const T={tLondon:wAt(sc,"london","London"),tRang:wAt(sc,"rang","To know"),tAsked:wAt(sc,"rang","asked the operator"),tWall:wAt(sc,"wall","She read"),tClock:wAt(sc,"wall","clock"),
    tExact:wAt(sc,"exact","never quite"),tLate:wAt(sc,"late","And the exchange"),tCaller:wAt(sc,"late","just when"),tOut:wAt(sc,"out","So a clock"),tBeOut:wAt(sc,"out","could be out"),
    tAgain:wAt(sc,"again","And the time"),tAg2:wAt(sc,"again","again and again"),tChange:wAt(sc,"change","Something"),
    tBuilt:wAt(sc,"built","So the Post Office's"),tMachine:wAt(sc,"built","a machine"),tSpeak:wAt(sc,"built","the speaking clock"),
    tCain:wAt(sc,"cain","Jane Cain"),tRec:wAt(sc,"cain","recorded"),tGlass:wAt(sc,"cain","glass discs"),tPlayed:wAt(sc,"played","A clock"),tMoment:wAt(sc,"played","right moment"),
    tGreen:wAt(sc,"greenwich","every hour"),tGw:wAt(sc,"greenwich","Greenwich"),
    tDial:wAt(sc,"dial","From the"),tT:wAt(sc,"dial","T"),tI:wAt(sc,"dial","I"),tM:wAt(sc,"dial","M"),tFor:wAt(sc,"dial","for time"),
    tHeard:wAt(sc,"heard","They heard"),tTenth:wAt(sc,"heard","a tenth"),tHour:wAt(sc,"heard","at any hour"),tCalls:wAt(sc,"calls","In less"),tTwelve:wAt(sc,"calls","twelve million"),
    tDemand:wAt(sc,"demand","The exact"),tOnD:wAt(sc,"demand","on demand"),tOp:wAt(sc,"operator","And that"),tNoOp:wAt(sc,"operator","no longer"),
    tReport:wAt(sc,"report","At the university"),tForty:wAt(sc,"report","forty-page"),tWeek:wAt(sc,"week","Any other"),tWk:wAt(sc,"week","a week"),
    tNow:wAt(sc,"now","Now"),tOwn:wAt(sc,"own","And the questions"),tDash:wAt(sc,"own","a dashboard")};
  const calls1=rd_calls(11,9,T.tRang+0.8,7,4.5).concat(rd_calls(31,14,T.tLate+0.3,4.5,4.5)),calls2=rd_calls(51,30,T.tAgain+0.4,4.2,3.4).concat(rd_calls(71,18,T.tAg2,1.6,3.0));
  ag_shots(ctx,S,t,sc.dur,[
    // London, 1936: the exchange at night, its board, its clock; callers ring and ask the operator, who reads the time from the wall
    {at:0,place:"rdExchange",keys:[[0,960,540,1],[T.tWall-0.3,900,380,1.45],[T.tLate-0.3,960,540,1]],d:1.8,draw:(c,tt)=>{
      const up=ag_in(tt,T.tWall-0.2,0.45)*(1-ag_in(tt,T.tLate-0.2,0.45));rd_exch(c,tt,rd_lit(calls1,tt),rd_mix2([6,-1],[3,-9],up));
      rd_scr(c,S,()=>{md_tag(c,96,96,"London · 1936",{col:RD.lamp,a:rd_io(tt,T.tLondon,T.tWall-0.4)});
        md_tag(c,1290,470,"not exact to the second",{col:MD.fail,icon:"warn",align:"center",a:rd_io(tt,T.tExact+0.3,T.tLate-0.5)});
        const bz=rd_io(tt,T.tCaller,T.tOut-0.4);if(bz>0){const w=md_tw(c,"busy: callers wait",{w:700,size:28})+88;md_tag(c,1824-w,96,"busy: callers wait",{col:MD.wait,icon:"clock",a:bz});}});}},
    // a watch set by that answer, out by a few seconds
    {at:T.tOut-0.25,place:"night",room:"rdWatch",keys:[[0,960,520,1]],draw:(c,tt)=>{rd_pool(c,960,470,700,0.08);const [h,m,s]=rd_hms(tt-4);
      rd_watch(c,960,470,210,h,m,s,{out:ag_in(tt,T.tBeOut,0.6)});
      rd_scr(c,S,()=>md_tag(c,960,810,"set by that answer · out",{col:MD.fail,icon:"warn",align:"center",a:ag_in(tt,T.tBeOut+0.2,0.5)}));}},
    // the time, asked again and again; something had to change
    {at:T.tAgain-0.25,place:"rdExchange",keys:[[0,960,540,1]],push:0.03,draw:(c,tt)=>{rd_exch(c,tt,rd_lit(calls2,tt),[6,-2]);
      rd_scr(c,S,()=>md_veil(c,S,0.55*ag_in(tt,T.tChange-0.1,1.0)));}},
    // the Post Office's engineers built a machine to answer it: the speaking clock
    {at:T.tBuilt-0.3,place:"night",room:"rdMachine",keys:[[0,960,520,1]],push:0.02,draw:(c,tt)=>{rd_pool(c,960,420,900,0.09);
      rd_machine(c,tt,{a:ag_in(tt,T.tBuilt,0.6),time:rd_hms(tt),turn:0.4*tt,read:0,lit:ag_in(tt,T.tMachine,0.8)});
      rd_scr(c,S,()=>md_textCard(c,1380,200,480,{kick:"The Post Office",title:"The speaking clock",sub:"built by its own engineers"},{edge:RD.lamp,a:ag_in(tt,T.tSpeak-0.1,0.4),k:tt-T.tSpeak+0.1}));}},
    // Jane Cain, one of the operators, recorded its words on glass discs
    {at:T.tCain-0.25,place:"night",room:"rdStudio",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{rd_pool(c,600,420,800,0.09);
      md_person(c,RD_CAIN,330,640,0.92,{t:tt,gaze:[8,0],light:RD_PAST});rd_mic(c,700,520,0.92,{});
      const rec=clamp((tt-T.tRec)/1.4,0,1),dl=ag_in(tt,T.tGlass-0.3,0.6);md_lane(c,md_curve([760,520],[1196,470],{bend:0.4}),MD.flow,0.85,{u:ag_sine(rec)});
      rd_disc(c,1420,470,224,0.35*tt,dl,{a:ag_in(tt,T.tRec+0.4,0.6)});
      rd_scr(c,S,()=>{md_nameTag(c,120,190,RD_CAIN,{role:"Operator, the voice of the speaking clock",col:RD.lamp,a:ag_in(tt,T.tCain+0.1,0.5)});
        md_tag(c,1420,790,"glass disc · her recorded words",{col:RD.lamp,align:"center",a:ag_in(tt,T.tGlass,0.5)});});}},
    // a clock played them at the right moment, checked every hour against Greenwich
    {at:T.tPlayed-0.25,place:"night",room:"rdMachine",keys:[[0,960,520,1]],push:0.02,draw:(c,tt)=>{rd_pool(c,960,420,900,0.09);
      rd_machine(c,tt,{time:rd_hms(tt),turn:0.4*tt,read:ag_in(tt,T.tMoment-0.3,0.6),lit:1});
      const g=ag_in(tt,T.tGw-0.6,0.5);if(g>0){md_lane(c,md_curve([1384,620],[1048,240],{bend:0.5}),MD.pass,0.8*g,{dash:true});}
      rd_scr(c,S,()=>{md_textCard(c,1380,200,480,{kick:"The Post Office",title:"The speaking clock",sub:"built by its own engineers"},{edge:RD.lamp});
        md_tag(c,1384,620,"Greenwich · checked every hour",{col:MD.pass,icon:"tick",a:ag_in(tt,T.tGw-0.2,0.5)});});}},
    // anyone in London could dial TIM, for time; to a tenth of a second, at any hour; 12 million calls; on demand, for anyone
    {at:T.tDial-0.25,place:"night",room:"rdDial",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{rd_pool(c,700,480,760,0.06);
      const out=ag_in(tt,T.tDemand-0.3,0.4);rd_dial(c,700,480,300,{lit:{"8":ag_in(tt,T.tT-0.05,0.25),"4":ag_in(tt,T.tI-0.05,0.25),"6":ag_in(tt,T.tM-0.05,0.25)}});
      rd_scr(c,S,()=>{const k=1-out;md_tag(c,1280,150,"From 24 July 1936 · London",{col:RD.lamp,a:ag_in(tt,T.tDial+0.2,0.5)*k});
        const tl=ag_in(tt,T.tT-0.05,0.3);if(tl>0){c.save();c.globalAlpha*=k;md_card(c,1280,220,560,170,{edge:RD.lamp,glow:0.5});
          ["T","I","M"].forEach((s,i)=>md_T(c,s,1320+i*70,330,{w:800,size:72,col:RD.lamp,a:ag_in(tt,[T.tT,T.tI,T.tM][i]-0.05,0.25)}));
          md_T(c,"for time",1560,316,{w:700,size:36,a:ag_in(tt,T.tFor-0.1,0.4)});md_T(c,"8 4 6",1560,360,{w:500,size:28,f:"mono",col:MD.soft,a:ag_in(tt,T.tFor-0.1,0.4)});c.restore();}
        md_textCard(c,1280,420,560,{kick:"Day or night",title:"To a tenth of a second"},{edge:MD.pass,a:ag_in(tt,T.tTenth-0.2,0.4)*k,k:tt-T.tTenth+0.2});
        md_textCard(c,1280,600,560,{kick:"In less than a year",title:"More than 12 million calls",sub:"24 July 1936 to 30 June 1937"},{a:ag_in(tt,T.tTwelve-0.3,0.4)*k,k:tt-T.tTwelve+0.3});
        md_pill(c,1560,470,"The exact time, on demand",{col:MD.pass,icon:"clock",size:34,a:ag_in(tt,T.tOnD-0.2,0.5),k:tt-T.tOnD+0.2});});}},
    // and that question no longer needed an operator: the board, quiet
    {at:T.tOp-0.25,place:"rdExchange",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{rd_exch(c,tt,rd_lit(rd_calls(91,3,T.tOp+0.5,4,2.5),tt),[6,-2]);
      rd_scr(c,S,()=>{const w=md_tw(c,"the time: no operator needed",{w:700,size:28})+88;md_tag(c,1824-w,96,"the time: no operator needed",{col:MD.pass,icon:"tick",a:ag_in(tt,T.tNoOp,0.5)});});}},
    // at the university, the questions asked every pay day came in a 40-page report; any other question waited a week
    {at:T.tReport-0.3,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>rd_scr(c,S,()=>{
      rd_report(c,180,150,0.86,{a:ag_in(tt,T.tReport,0.6),k:Math.min(1,ag_spr(tt,T.tReport,0.6))});
      md_tag(c,180,838,"40 pages · emailed every pay day",{a:ag_in(tt,T.tForty,0.5)});
      rd_need(c,880,250,{kick:"Any other question",q:"Casual hours in Health's second-year units?",w:860,edge:null,before:"A report of its own",a:ag_in(tt,T.tWeek,0.5),k:tt-T.tWeek,wk:clamp((tt-T.tWk+0.6)/1.6,0,1)});})},
    // now any question is answered when it's asked; the questions that come back have a dashboard of their own
    // the map leaves before the title card comes in, so no word of it shows under the title's
    {at:T.tNow-0.3,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{const fo=1-ag_in(tt,sc.cues.breath-0.5,0.6);
      md_map(c,tt,{a:fo,lit:[].concat(tt>T.tNow+0.4?["genie","gold"]:[],tt>T.tDash?["dash"]:[]),dim:["hr","fin","sis","lms","fabric","apps"]});
      rd_scr(c,S,()=>{md_tag(c,1440,860,"any question, when it's asked",{col:MD.flow,a:ag_in(tt,T.tNow+0.4,0.5)*(1-ag_in(tt,T.tDash-0.3,0.4))});
        md_tag(c,1440,860,"the questions that come back",{col:MD.layer.gold,a:ag_in(tt,T.tDash,0.5)*fo});});}}
  ],0.5);
  md_title(ctx,S,t,sc.cues.breath,"Reports on demand","answers when they're asked, dashboards for what comes back","FILM 1 OF 3 · FROM TABLES TO DECISIONS");
});

/* ---------------------------------------------------------------- 2 · Ask for the answer */
// Rohan at his desk, cut at its back edge; he looks at gz, smiles by sm
function rd_rohan(c,tt,gz,sm){md_person(c,"rohan",400,652,0.98,{t:tt,gaze:gz||[8,0],cut:RD_OFF.desk,smile:sm||0});}
const RD_BUDGET={kick:"Budget · 2027",title:"Casual teaching, Faculty of Health",sub:"to set from this year's numbers"};
scene("ask",(ctx,S,t,sc)=>{
  const T={tPay:wAt(sc,"payday","Thursday"),tRohan:wAt(sc,"rohan","Rohan"),tBudget:wAt(sc,"rohan","budget"),tCasual:wAt(sc,"casual","Casual teaching"),tHours:wAt(sc,"casual","paid for the hours"),tLinh:wAt(sc,"casual","like"),
    tNeeds:wAt(sc,"needs","First"),tOne:wAt(sc,"needs","one number"),tUsed:wAt(sc,"used","That used"),tWeek:wAt(sc,"used","and a week"),tAsks:wAt(sc,"asks","Today"),tOwn:wAt(sc,"asks","in his own words"),
    tAnswer:wAt(sc,"answer","Like the time"),tNum:wAt(sc,"answer","one point"),tCounted:wAt(sc,"counted","With it"),tWhat:wAt(sc,"counted","what it counted"),tOn:wAt(sc,"oncosts","On-costs"),
    tQuery:wAt(sc,"query","And it shows"),tRan:wAt(sc,"query","it ran"),tNext:wAt(sc,"next","His next"),tS1q:wAt(sc,"next","and Semester"),tS1:wAt(sc,"s1","Two point"),tLunch:wAt(sc,"lunch","By lunch"),tSet:wAt(sc,"lunch","is set")};
  const win=tt=>ag_in(tt,T.tAsks,0.5)*(1-ag_in(tt,T.tLunch-0.2,0.45));
  ag_shots(ctx,S,t,sc.dur,[
    // pay day in Finance: Rohan, and next year's budget for casual teaching in Health
    {at:0,place:"rdOffice",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{rd_rohan(c,tt,[8,0]);
      rd_scr(c,S,()=>{md_tag(c,96,96,"Finance · Thursday 5 November 2026 · pay day",{col:MD.soft,a:ag_in(tt,T.tPay,0.5)});
        md_nameTag(c,760,186,"rohan",{role:"Management accountant, Finance",col:MD.dom.finance,a:ag_in(tt,T.tRohan+0.2,0.5)});
        md_textCard(c,760,268,760,RD_BUDGET,{edge:MD.dom.finance,a:ag_in(tt,T.tBudget-0.1,0.4),k:tt-T.tBudget+0.1});});}},
    // casual teaching: staff paid for the hours they work, like Linh Nguyen, who tutors health informatics
    {at:T.tCasual-0.2,place:"rdTute",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{md_person(c,"linh",560,660,0.98,{t:tt,gaze:[8,-2],smile:0.3});
      rd_scr(c,S,()=>{md_textCard(c,1000,250,620,{kick:"Casual teaching",title:"Paid for the hours worked",sub:"each claim approved, then paid"},{a:ag_in(tt,T.tHours-0.2,0.4),k:tt-T.tHours+0.2});
        md_nameTag(c,880,770,"linh",{role:"Casual tutor, health informatics",col:MD.dom.teaching,a:ag_in(tt,T.tLinh,0.5)});});}},
    // one number first; it used to take a report and a week. Today he asks Genie One, and the answer comes when he asks
    {at:T.tNeeds-0.2,place:"rdOffice",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{const lk=ag_in(tt,T.tAsks,0.5)*(1-ag_in(tt,T.tLunch-0.2,0.5));
      rd_rohan(c,tt,rd_mix2([8,0],[9,1],lk),ag_in(tt,T.tS1+0.4,0.8)*0.5+ag_in(tt,T.tSet,0.8)*0.3);
      rd_scr(c,S,()=>{const cards=1-ag_in(tt,T.tAsks-0.45,0.4),back=ag_in(tt,T.tLunch+0.3,0.5);
        md_textCard(c,760,268,760,RD_BUDGET,{edge:MD.dom.finance,a:Math.max(cards,back)});
        rd_need(c,760,470,{a:ag_in(tt,T.tOne-0.2,0.4)*cards,k:tt-T.tOne+0.2,wk:clamp((tt-T.tUsed-0.6)/(T.tWeek-T.tUsed+0.6),0,1)});
        rd_genie(c,760,64,1080,800,{a:win(tt),k:tt-T.tAsks,q:clamp((tt-T.tAsks-0.7)/1.5,0,1),ans:clamp((tt-T.tNum+0.15)/0.5,0,1),cnt:clamp((tt-T.tWhat-0.6)/0.5,0,1),on:clamp((tt-T.tOn)/0.5,0,1),
          code:clamp((tt-T.tRan+0.4)/1.0,0,1)*(1-ag_in(tt,T.tNext-0.4,0.4)),q2:clamp((tt-T.tS1q)/0.7,0,1),ans2:clamp((tt-T.tS1+0.1)/0.5,0,1)});
        if(back>0)md_pill(c,1140,520,"set by lunch, from this year's numbers",{col:MD.pass,icon:"tick",a:ag_in(tt,T.tSet-0.2,0.5),k:tt-T.tSet+0.2});});}}
  ],0.5);
});

/* ---------------------------------------------------------------- 3 · What it answers from */
const RD_CW={x:800,y:80,w:1040,h:780};
// Sam and Jun, the data team, at the left of the platform's night
function rd_team(c,tt,a){if(a<=0.004)return;c.save();c.globalAlpha*=a;md_person(c,"sam",300,660,0.94,{t:tt,gaze:[8,0]});md_person(c,"jun",560,690,0.9,{t:tt+0.8,gaze:[8,0]});c.restore();}
scene("context",(ctx,S,t,sc)=>{
  const T={tAgent:wAt(sc,"agent","Genie One"),tGA:wAt(sc,"agent","a Genie Agent"),tSam:wAt(sc,"agent","Sam"),tJun:wAt(sc,"agent","Jun"),tOne:wAt(sc,"agent","this one subject"),
    tFilms:wAt(sc,"films","Two earlier"),tPut:wAt(sc,"put","Here is"),tData:wAt(sc,"data","Its data"),tMeasure:wAt(sc,"data","one measure"),tBy:wAt(sc,"data","by faculty"),
    tDef:wAt(sc,"defined","Rohan defined"),tNextF:wAt(sc,"defined","the next film"),tRules:wAt(sc,"rules","Its rules"),tRohans:wAt(sc,"rohans","Rohan's"),tIngrid:wAt(sc,"ingrid","Ingrid's"),
    tReads:wAt(sc,"reads","So it reads"),tNever:wAt(sc,"reads","never anyone's"),tEx:wAt(sc,"examples","Its examples"),tFin:wAt(sc,"examples","questions Finance"),tQry:wAt(sc,"examples","the query"),
    tTests:wAt(sc,"tests","And its tests"),tKnown:wAt(sc,"tests","known answers"),tRun:wAt(sc,"tests","run after"),tAsker:wAt(sc,"asker","Each answer"),tMay:wAt(sc,"asker","only what"),
    tMoved:wAt(sc,"moved","So the data team's"),tModels:wAt(sc,"models","Not a report"),tGood:wAt(sc,"models","good models"),tPeople:wAt(sc,"models","for people and agents"),
    tSmall:wAt(sc,"small","They started small"),tFirst:wAt(sc,"small","its first user")};
  // the tab open and how its page comes and goes: each page leaves before the next comes in
  const tabs=[T.tPut+0.4,T.tRules-0.1,T.tEx-0.1,T.tTests-0.1];
  const tabAt=tt=>{let k=0;for(let i=1;i<4;i++)if(tt>=tabs[i])k=i;return k;};
  ag_shots(ctx,S,t,sc.dur,[
    // Genie One answered from a Genie Agent, which Sam and Jun set up for this one subject; two earlier films show how; what they put in it
    {at:0,place:"map",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{rd_team(c,tt,1);
      rd_scr(c,S,()=>{const ch=1-ag_in(tt,T.tPut-0.4,0.4);
        md_nameTag(c,120,262,"sam",{role:"Data platform",col:MD.flow,a:ag_in(tt,T.tSam,0.5)});md_nameTag(c,470,330,"jun",{role:"Analytics engineer",col:MD.flow,a:ag_in(tt,T.tJun,0.5)});
        if(ch>0){c.save();c.globalAlpha*=ch;const g1=md_textCard(c,840,160,420,{kick:"Rohan asked",title:"Genie One"},{icon:"query",a:ag_in(tt,T.tAgent,0.5)});
          const ga=ag_in(tt,T.tGA,0.5);md_lane(c,md_curve([1260,g1.y+g1.h/2],[1380,g1.y+g1.h/2],{bend:0.5}),MD.flow,0.85*ga,{u:ga});
          md_textCard(c,1380,160,460,{kick:"It answered from",title:"a Genie Agent",sub:"one subject: casual teaching cost"},{edge:MD.flow,a:ga,k:tt-T.tGA});
          md_textCard(c,840,470,480,{kick:"An earlier film",title:"Meaning on the platform"},{a:ag_in(tt,T.tFilms+0.3,0.5),k:tt-T.tFilms-0.3});
          md_textCard(c,1360,470,480,{kick:"An earlier film",title:"Working with agents on Databricks"},{a:ag_in(tt,T.tFilms+0.7,0.5),k:tt-T.tFilms-0.7});c.restore();}
        const k=tabAt(tt),pg=k===0?clamp((tt-T.tData-0.1)/0.5,0,1):clamp((tt-tabs[k]-0.35)/0.45,0,1),nx=k<3?tabs[k+1]:1e9,out=clamp((tt-(nx-0.4))/0.35,0,1),P={};
        P.data={m:clamp((tt-T.tMeasure+0.2)/0.6,0,1),f:clamp((tt-T.tBy)/1.6,0,1),def:clamp((tt-T.tDef)/0.6,0,1)};P.rules={r:clamp((tt-T.tRohans)/0.6,0,1),i:clamp((tt-T.tIngrid)/0.6,0,1),reads:clamp((tt-T.tNever+0.4)/0.6,0,1)};
        P.examples={n:clamp((tt-T.tFin)/0.6,0,1)+clamp((tt-T.tQry)/0.6,0,1)};P.tests={n:clamp((tt-T.tKnown+0.2)/0.6,0,1)+clamp((tt-T.tKnown-0.4)/0.6,0,1),run:clamp((tt-T.tRun)/0.8,0,1)};
        const wa=ag_in(tt,T.tPut,0.5)*(1-ag_in(tt,T.tMoved-0.5,0.45));
        rd_agent(c,RD_CW.x,RD_CW.y,RD_CW.w,RD_CW.h,{a:wa,k:tt-T.tPut,tab:k,prev:k-1,tabA:k?ag_in(tt,tabs[k],0.3):1,pg,out,p:P});
        md_pill(c,RD_CW.x+RD_CW.w/2,RD_CW.y+RD_CW.h-130,"it runs as the person asking",{col:MD.flow,icon:"person",size:30,a:ag_in(tt,T.tAsker+0.3,0.5)*wa,k:tt-T.tAsker-0.3});
        md_T(c,"they see only what they may read",RD_CW.x+RD_CW.w/2,RD_CW.y+RD_CW.h-60,{w:600,size:28,align:"center",col:MD.soft,a:ag_in(tt,T.tMay,0.5)*wa});});}},
    // so the data team's work has moved: good models and their context, built once, for people and agents to explore; started small
    {at:T.tMoved-0.2,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
      md_map(c,tt,{lit:[].concat(tt>T.tGood?["gold","platform"]:[],tt>T.tPeople?["genie","dash","apps"]:[]),dim:tt<T.tGood?[]:["hr","fin","sis","lms"]});
      rd_scr(c,S,()=>{md_tag(c,960,862,"not a report for each question",{col:MD.soft,align:"center",a:rd_io(tt,T.tModels,T.tGood-0.2,0.4,0.35)});
        md_tag(c,960,862,"good models and their context, built once",{col:MD.layer.gold,icon:"contract",align:"center",a:rd_io(tt,T.tGood+0.1,T.tSmall-0.4,0.4,0.35)});
        md_tag(c,960,862,"started small · its first user: Rohan Desai",{col:MD.dom.finance,icon:"person",align:"center",a:ag_in(tt,T.tFirst-0.4,0.5)});});}}
  ],0.5);
});

/* ---------------------------------------------------------------- 4 · The questions that come back */
const RD_DW={x:80,y:120,w:1760,h:660};
scene("back",(ctx,S,t,sc)=>{
  const T={tSome:wAt(sc,"some","Some questions"),tPay:wAt(sc,"some","every pay day"),tCost:wAt(sc,"cost","What did"),tHours:wAt(sc,"hours","How many"),tWait:wAt(sc,"waiting","How many"),
    tMach:wAt(sc,"machine","Like the time"),tOne:wAt(sc,"machine","one dashboard"),tRef:wAt(sc,"refresh","It refreshes"),tGoes:wAt(sc,"refresh","goes to"),
    tToday:wAt(sc,"today","Today"),tNine:wAt(sc,"today","nine point"),tClaims:wAt(sc,"claims","forty-three"),tGenie:wAt(sc,"genie","For a question"),tAsk:wAt(sc,"genie","Ask Genie"),tSame:wAt(sc,"genie","the same"),
    tRep:wAt(sc,"replaced","It replaced"),tPage:wAt(sc,"pageone","The three"),tFirst:wAt(sc,"pageone","first page"),tRet:wAt(sc,"retired","retired"),
    tRule:wAt(sc,"rule","A rule"),tDes:wAt(sc,"rule","a question deserves"),tSched:wAt(sc,"rule","comes back"),tActs:wAt(sc,"rule","someone acts"),tOther:wAt(sc,"other","Every other")};
  ag_shots(ctx,S,t,sc.dur,[
    // three questions that come back every pay day, from the same people; one dashboard, refreshed after each pay run, sent to them
    {at:0,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>rd_scr(c,S,()=>{
      md_tag(c,96,68,"Every pay day, from the same people",{col:MD.soft,icon:"refresh",a:ag_in(tt,T.tPay-0.2,0.5)*(1-ag_in(tt,T.tMach-0.3,0.4))});
      // the pay days, one after another, before the questions they bring come in
      const pd=1-ag_in(tt,T.tCost-0.5,0.4);if(pd>0)["22 October","5 November","19 November"].forEach((d,i)=>md_tag(c,960+(i-1)*360,470,"pay day · "+d,{col:MD.soft,icon:"clock",align:"center",a:pd*ag_in(tt,T.tSome+0.4+i*0.5,0.4)}));
      const b=rd_dash(c,RD_DW.x,RD_DW.y,RD_DW.w,RD_DW.h,{tiles:clamp((tt-T.tCost)/0.5,0,1)+clamp((tt-T.tHours)/0.5,0,1)+clamp((tt-T.tWait)/0.5,0,1),frame:ag_in(tt,T.tOne-0.1,0.6),
        fig:clamp((tt-T.tNine+0.2)/0.6,0,1)+clamp((tt-T.tNine-1.6)/0.8,0,1)+clamp((tt-T.tClaims+0.3)/0.6,0,1),ref:clamp((tt-T.tRef)/0.5,0,1),ask:clamp((tt-T.tAsk+0.3)/0.5,0,1),askLit:ag_in(tt,T.tAsk+0.4,0.5)});
      rd_subs(c,96,846,ag_in(tt,T.tGoes,0.6));
      const ga=ag_in(tt,T.tSame-0.2,0.5);if(ga>0){const w=md_tw(c,"the same Genie Agent: casual teaching cost",{w:700,size:28})+88;md_tag(c,RD_DW.x+RD_DW.w-w,68,"the same Genie Agent: casual teaching cost",{col:MD.flow,icon:"query",a:ga});}})},
    // it replaced a 40-page report, emailed every pay day: its three figures on page one; now it's retired
    {at:T.tRep-0.25,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>rd_scr(c,S,()=>{
      rd_report(c,240,150,1,{hl:clamp((tt-T.tFirst+0.4)/1.0,0,1),ret:clamp((tt-T.tRet+0.2)/0.8,0,1),fan:1});
      md_textCard(c,1000,200,700,{kick:"Every pay day, by email",title:"The fortnightly pay report",sub:"40 pages · its three figures on page 1"},{a:ag_in(tt,T.tRep+0.2,0.5),k:tt-T.tRep-0.2});
      md_pill(c,1350,520,"replaced by one dashboard",{col:MD.pass,icon:"tick",size:30,a:ag_in(tt,T.tRet,0.5),k:tt-T.tRet});
      rd_statement(c,S,ag_in(tt,T.tRule-0.2,0.6),["A question deserves a dashboard","when it comes back on a schedule,","and someone acts on what it shows.","Every other question: ask it when it's needed."],
        {cols:[MD.ink,MD.ink,MD.ink,MD.flow],n:ag_in(tt,T.tRule,0.5)+ag_in(tt,T.tSched-0.2,0.5)+ag_in(tt,T.tActs-0.2,0.5)+ag_in(tt,T.tOther,0.5),k:tt-T.tRule});})}
  ],0.5);
});

/* ---------------------------------------------------------------- 5 · Asked when it's needed */
scene("close",(ctx,S,t,sc)=>{
  const T={tThen:wAt(sc,"then","In nineteen"),tAny:wAt(sc,"then","anyone could"),tUni:wAt(sc,"uni","At the university"),tOne:wAt(sc,"uni","one dashboard"),tEvery:wAt(sc,"every","Every other"),tGood:wAt(sc,"every","good models"),
    tBudget:wAt(sc,"budget","And Health's"),tMorning:wAt(sc,"budget","in a morning"),tOld:wAt(sc,"old","None"),tEasier:wAt(sc,"old","easier"),tDocs:wAt(sc,"docs","So don't"),tInv:wAt(sc,"docs","investigate"),
    tAdapt:wAt(sc,"docs","adapt"),tImpl:wAt(sc,"docs","implement"),tIter:wAt(sc,"docs","iterate"),tOff:wAt(sc,"docs","the official docs"),tTake:wAt(sc,"takeaway","Ask for"),tKeep:wAt(sc,"takeaway","keep dashboards"),
    tNext:wAt(sc,"nextfilm","Next"),tDefined:wAt(sc,"nextfilm","defined in the open")};
  ag_shots(ctx,S,t,sc.dur,[
    // 1936: the question everyone asked got a machine of its own, and anyone could ask it, at any hour
    {at:0,place:"night",room:"rdMachine",keys:[[0,960,520,1]],push:0.02,draw:(c,tt)=>{rd_pool(c,960,420,900,0.09);rd_machine(c,tt,{time:rd_hms(tt+60),turn:0.4*tt,read:1,lit:1});
      rd_scr(c,S,()=>{md_tag(c,96,96,"London · 1936",{col:RD.lamp,a:ag_in(tt,T.tThen,0.5)});md_pill(c,1600,470,"anyone, at any hour",{col:MD.pass,icon:"clock",size:30,a:ag_in(tt,T.tAny,0.5),k:tt-T.tAny});});}},
    // at the university: one dashboard for the questions that come back; every other question asked when it's needed
    {at:T.tUni-0.25,place:"map",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
      md_map(c,tt,{lit:[].concat(["dash"],tt>T.tGood?["gold","genie"]:[]),dim:["hr","fin","sis","lms","fabric","apps"]});
      rd_scr(c,S,()=>{md_tag(c,960,862,"one dashboard: the questions that come back",{col:MD.layer.gold,align:"center",a:rd_io(tt,T.tOne,T.tEvery-0.2,0.4,0.35)});
        md_tag(c,960,862,"every other question: Genie, from good models and their context",{col:MD.flow,align:"center",a:ag_in(tt,T.tGood,0.5)});});}},
    // and Health's casual teaching budget, set from this year's numbers, in a morning, not a week
    {at:T.tBudget-0.25,place:"rdOffice",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{rd_rohan(c,tt,[8,0],0.5);
      rd_scr(c,S,()=>{md_textCard(c,760,268,760,RD_BUDGET,{edge:MD.dom.finance,a:ag_in(tt,T.tBudget,0.5),k:tt-T.tBudget});
        md_pill(c,1140,520,"set in a morning, not a week",{col:MD.pass,icon:"tick",a:ag_in(tt,T.tMorning-0.2,0.5),k:tt-T.tMorning+0.2});});}},
    // none of these ideas is new: investigate, adapt, implement and iterate, from the official docs, linked on this page
    {at:T.tOld-0.25,place:"night",room:"rdDocs",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>rd_scr(c,S,()=>{
      md_textCard(c,560,150,800,{kick:"None of these ideas is new",title:"The tools now make them easier"},{a:ag_in(tt,T.tOld+0.3,0.5),k:tt-T.tOld-0.3});
      const steps=[["investigate",T.tInv],["adapt",T.tAdapt],["implement",T.tImpl],["iterate",T.tIter]],ws=steps.map(([s])=>md_tw(c,s,{w:700,size:28})+44);let x=960-(ws.reduce((a,b)=>a+b,0)+60*3)/2;
      steps.forEach(([s,ts],i)=>{const a=ag_in(tt,ts-0.1,0.4);md_tag(c,x,420,s,{col:MD.flow,a});if(i<3)md_lane(c,[[x+ws[i]+8,420],[x+ws[i]+52,420]],MD.flow,0.7*ag_in(tt,steps[i+1][1]-0.2,0.3));x+=ws[i]+60;});
      md_textCard(c,500,520,920,{kick:"Start here",title:"The official docs, linked on this page",sub:"Genie One · Genie Agents · AI/BI dashboards · metric views"},{edge:MD.flow,a:ag_in(tt,T.tOff,0.5),k:tt-T.tOff});})},
    // ask for the answer; keep dashboards for the questions that come back. Next: casual teaching cost, defined in the open
    {at:T.tTake-0.4,later:true,dis:0.4,place:"night",room:"rdDocs",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>rd_scr(c,S,()=>{
      const st=1-ag_in(tt,T.tNext-0.4,0.4);
      if(st>0){c.save();c.globalAlpha*=st;md_T(c,"Ask for the answer;",960,450,{w:700,size:52,align:"center",a:ag_in(tt,T.tTake,0.5)});
        md_T(c,"keep dashboards for the questions that come back.",960,530,{w:700,size:44,align:"center",col:MD.layer.gold,a:ag_in(tt,T.tKeep,0.5)});c.restore();}
      md_textCard(c,560,360,800,{kick:"Next · Film 2 of 3",title:"Defined in the open",sub:"casual teaching cost, defined so every reader counts it the same way"},{edge:MD.agreed,a:ag_in(tt,T.tNext,0.5)*(1-ag_in(tt,sc.cues.breath-0.2,0.5)),k:tt-T.tNext});})}
  ],0.5);
  md_end(ctx,S,t,sc.cues.breath,"Reports on demand","Ask for the answer; keep dashboards for the questions that come back.","Film 1 of 3","From tables to decisions");
});

// the questions that come back open on the map the chapter before ends on: the camera glides on from where it was, and what the map
// showed leaves before the dashboard comes in (a later moment)
ag_cutInto(["back"]);
