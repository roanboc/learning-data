/* ===== The map, enforced: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): the lab, painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice. Every shot is in the
   lab, one room: from shot to shot and chapter to chapter the camera glides on from where it is, what stays stays put, and only what
   changes fades. A later moment, with other people, another agent or another page of cards, is marked later:true, so what was there
   leaves before what comes later comes in, through the bare room; that way Jun's helper, the planning agent and the workload agent,
   which look alike, are never seen in one place at once. */

/* ---------------------------------------------------------------- pieces the scenes share */
// where the agent stands when it has the room to itself (signing in, what it reads, its place and its logs): the left, where a
// person stands in the room's usual shot
const OB_AL={x:330,y:430,R:130,r:68};
// two agents side by side, on the day of the switch: the planning agent, and Anil's workload agent working on
const OB_PA={x:1010,y:430,R:130,r:68},OB_WA={x:1560,y:430,R:130,r:68};
// a pill whose left edge is at x (pills are drawn about their middle)
function ob_pillL(ctx,x,y,text,t,t0,t1,o){o=o||{};const w=ag_tw(ctx,text,{w:700,size:28})+(o.icon?96:56);return ob_pillAt(ctx,x+w/2,y,text,t,t0,t1,o);}
// the changes of these days, as the logs show them: the planning agent's first pull request (Every change through review's), the
// workload agent's fix of its sixth night in test (A mandate, written and enforced's), and one of Jun's own
const OB_PR="Plan each unit's classes from its own class size";
const OB_ROWS=[{text:OB_PR,who:"planning-agent[bot]",col:AG.violet},{text:"Count each contract once, as it stands today",who:"workload-agent[bot]",col:AG.violet},
  {text:"Tidy the faculty names",who:"Jun Park",col:AG.ink}];
// the same three as commits, each with its own message
const OB_COMMITS=[{text:"Add each unit's class size",who:"planning-agent[bot]",col:AG.violet},{text:"Count each contract once, as it stands today",who:"workload-agent[bot]",col:AG.violet},
  {text:"Tidy the faculty names",who:"Jun Park",col:AG.ink}];
// the planning agent's application ID, as Databricks' tables name its service principal (shortened, as the films show an ID)
const OB_ID="4f1c9a2e-…";

// Jun, his helper on his sign-in, and the switch that would stop it: Jun's own sign-in (off: o.off 0 to 1, and its words; the
// switch at o.swY)
function ob_onJun(x,tt,o){o=o||{};const off=o.off||0;
  ob_asOne(x,o.agentA==null?1:o.agentA,bx=>ob_agentWith(bx,tt,{think:0.3*(1-off),badge:"Jun Park",grey:off,off:"stopped",tag:"Jun's helper",tk:o.tk,bk:o.bk}));
  ob_person(x,"jun",tt,{});ag_roomLight(x,1);ob_personCard(x,"jun",o.card==null?1:o.card);
  ob_switch(x,1296,o.swY==null?200:o.swY,570,"Jun Park's sign-in","and his helper's",1-off,{a:o.swA==null?1:o.swA,k:o.swK});}
// the day of the switch: the planning agent stopped (off 0 to 1), Anil's workload agent working on (its pill from t0)
function ob_twoAgents(x,tt,off,t0){
  ob_agentWith(x,tt,Object.assign({},OB_PA,{badge:"planning agent",grey:off,off:"stopped"}));
  ob_agentWith(x,tt,Object.assign({},OB_WA,{badge:"workload agent",think:0.8}));
  ob_pillAt(x,OB_WA.x,760,"workload agent · at work",tt,t0,null,{col:AG.green,icon:"tick"});}

/* ---------------------------------------------------------------- 1 · Whose change was that? */
scene("whose",(ctx,S,t,sc)=>{const c=sc.cues,P=ob_once(sc,"P",()=>({col:wAt(sc,"place","a new column"),fil:wAt(sc,"place","a filter"),
    helper:wAt(sc,"helper","Jun Park's helper"),editor:wAt(sc,"helper","in his editor"),sign:wAt(sc,"helper","his own sign-in"),hname:wAt(sc,"helper","his name"),rights:wAt(sc,"helper","his rights"),
    agent:wAt(sc,"monday","a new agent"),pa:wAt(sc,"monday","the planning agent"),owned:wAt(sc,"monday","owned by Clara"),answers:wAt(sc,"monday","answers for"),
    trusted:wAt(sc,"auditors","can be trusted"),n214:wAt(sc,"which","two hundred"),q:wAt(sc,"which","which had an agent"),
    said:wAt(sc,"jun","said Jun Park"),hist:wAt(sc,"jun","the code's history"),qlog:wAt(sc,"jun","log of queries"),
    days:wAt(sc,"days","two days"),nine:wAt(sc,"days","for nine"),fully:wAt(sc,"wrong","couldn't fully answer"),wrong:wAt(sc,"wrong","was wrong"),
    ask:wAt(sc,"wrong","who to ask"),check:wAt(sc,"wrong","what else to check"),
    whatever:wAt(sc,"all","whatever Jun could"),more:wAt(sc,"all","far more than a ticket needs"),tostop:wAt(sc,"all","to stop it"),sj:wAt(sc,"all","stop Jun"),
    place:wAt(sc,"badge","a place on the university's map"),role:wAt(sc,"badge","a role"),owner:wAt(sc,"badge","an owner"),only:wAt(sc,"badge","only the rights"),
    own:wAt(sc,"three","own name"),dbx:wAt(sc,"three","Databricks"),gh:wAt(sc,"three","GitHub"),dbt:wAt(sc,"three","dbt"),
    bot:wAt(sc,"since","says planning agent bot"),query:wAt(sc,"since","every query"),
    ten:wAt(sc,"tried","for ten minutes"),stopped:wAt(sc,"tried","the planning agent stopped"),jun2:wAt(sc,"tried","and Jun"),lucia:wAt(sc,"tried","Lucía"),wl:wAt(sc,"tried","Anil's workload agent"),
    one:wAt(sc,"ask","one search"),nottwo:wAt(sc,"ask","not two days"),who:wAt(sc,"data","who made it"),more2:wAt(sc,"data","no tool lets")}));
  // the year's 214 changes, on the wall's right: every one says Jun, then Jun goes through them from memory, and nine stay amber;
  // drawn the same in every shot that shows them, so they stay put as the cards round them change
  const TX=1260,TY=250;
  const tiles=(x,tt)=>{ag_label(x,TX,TY-30,"This year · 214 changes",{col:AG.kick});
    ob_tiles(x,TX,TY,{t:tt,who:ag_in(tt,P.said,0.8),sort:clamp((tt-P.days-0.2)/(P.nine-P.days+0.6),0,1),pulse:ag_in(tt,P.nine,0.5)});
    ob_pillL(x,TX,TY+376,"his helper's",tt,P.nine-0.4,null,{col:AG.violet});ob_pillL(x,TX+262,TY+376,"his own",tt,P.nine-0.2,null,{col:AG.ink});
    ob_pillL(x,TX,TY+456,"9 · not sure",tt,P.nine+0.1,null,{col:AG.amber,icon:"warn"});};
  ag_shots(ctx,S,t,sc.dur,[
    // today, at the university: Lucía, in Planning, and Planning's tickets, a new column and a filter
    {at:0,place:"obLab",keys:[[0,960,540,1.04],[P.col-0.4,960,540,1]],push:0.015,draw:(x,tt)=>{
      ob_person(x,"lucia",tt,{});ag_roomLight(x,1);ob_corner(x,"Today · the university",ag_in(tt,0.4,0.6));ob_personCard(x,"lucia",ag_in(tt,0.9,0.6));
      ob_ticket(x,1180,190,620,{kick:"Planning · ticket",title:"Add each unit's school",lines:["a new column"],a:ag_in(tt,P.col,0.4),k:ag_spr(tt,P.col)});
      ob_ticket(x,1180,420,620,{kick:"Planning · ticket",title:"Leave out cancelled units",lines:["a filter"],a:ag_in(tt,P.fil,0.4),k:ag_spr(tt,P.fil)});}},
    // all year they went to Jun's helper, a coding agent in his editor, on his sign-in: it wears his badge (later:true: Lucía and the
    // tickets leave, then Jun and his helper come in)
    {later:true,at:c.helper,place:"obLab",keys:[[c.helper,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_onJun(x,tt,{agentA:ag_in(tt,P.helper-0.3,0.5),card:ag_in(tt,c.helper+0.3,0.5),tk:(tt-P.helper)/0.8,bk:(tt-P.sign)/0.9,swA:0});
      ob_card(x,1296,200,540,{kick:"Where it works",title:"in Jun's editor"},{a:ag_in(tt,P.editor,0.5),k:ag_spr(tt,P.editor)});
      ob_pillL(x,1296,520,"name · Jun Park",tt,P.hname,null,{col:AG.ink});ob_pillL(x,1296,600,"rights · all of Jun's",tt,P.rights,null,{col:AG.ink});}},
    // since Monday they go to the planning agent, owned by Clara, who answers for it; its name on a paper tag for now (later:true: Jun
    // and his helper leave, then Clara and the planning agent come in)
    {later:true,at:c.monday,place:"obLab",keys:[[c.monday,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_asOne(x,ag_in(tt,P.agent,0.5),bx=>ob_agentWith(bx,tt,{think:0.3,name:"planning agent",nameA:ag_in(tt,P.pa,0.4),tag:"owner · Clara Jensen",tk:(tt-P.owned)/0.8,dx:-260}));
      ob_person(x,"clara",tt,{});ag_roomLight(x,1);ob_personCard(x,"clara",ag_in(tt,c.monday+0.3,0.5));ob_corner(x,"Since Monday",ag_in(tt,c.monday+0.2,0.5));
      ob_pillL(x,1296,300,"answers for what it does",tt,P.answers,null,{col:AG.blue});}},
    // October: the auditors, and their question about the year's 214 changes (later:true: Clara and the agent leave, then Jun comes in)
    {later:true,at:c.auditors,place:"obLab",keys:[[c.auditors,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_person(x,"jun",tt,{});ag_roomLight(x,1);ob_personCard(x,"jun",ag_in(tt,c.auditors+0.3,0.5));ob_corner(x,"October",ag_in(tt,c.auditors+0.2,0.5));
      ob_card(x,476,250,660,{kick:"The university's auditors",title:"Can its records be trusted?"},{a:ag_in(tt,P.trusted-0.8,0.5),k:ag_spr(tt,P.trusted-0.8)});
      ob_card(x,476,430,660,{kick:"Their question",title:"Which of the 214 changes had an agent drafted?"},{a:ag_in(tt,P.q,0.5),k:ag_spr(tt,P.q),edge:AG.violet});
      withA(x,ag_in(tt,P.n214,0.6),()=>tiles(x,tt));}},
    // every one said Jun Park: in the code's history and in the platform's log of queries (Jun, the corner and the tiles stay)
    {at:c.jun,place:"obLab",keys:[[c.jun,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_person(x,"jun",tt,{});ag_roomLight(x,1);ob_personCard(x,"jun",1);ob_corner(x,"October",1);tiles(x,tt);
      ob_log(x,476,240,700,"The code's history",null,[{when:"12 Mar",who:"Jun Park"},{when:"3 Jun",who:"Jun Park"},{when:"21 Sep",who:"Jun Park"}],{a:ag_in(tt,P.hist,0.5),k:ag_spr(tt,P.hist)});
      ob_log(x,476,520,700,"The platform's query log",null,[{when:"12 Mar",who:"jun.park@uni.example"},{when:"3 Jun",who:"jun.park@uni.example"},{when:"21 Sep",who:"jun.park@uni.example"}],
        {a:ag_in(tt,P.qlog,0.5),k:ag_spr(tt,P.qlog)});}},
    // two days, from memory: he sorts them, his helper's and his own, and nine he can't place
    {at:c.days,place:"obLab",keys:[[c.days,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_person(x,"jun",tt,{});ag_roomLight(x,1);ob_personCard(x,"jun",1);ob_corner(x,"October",1);tiles(x,tt);
      ob_card(x,476,250,520,{kick:"Jun, from memory",title:"two days"},{a:ag_in(tt,P.days,0.5),k:ag_spr(tt,P.days)});}},
    // so the university couldn't fully answer; and if one of the nine was wrong: who to ask, what else to check?
    {at:c.wrong,place:"obLab",keys:[[c.wrong,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_person(x,"jun",tt,{});ag_roomLight(x,1);ob_personCard(x,"jun",1);ob_corner(x,"October",1);tiles(x,tt);
      ob_card(x,476,250,520,{kick:"The university's answer",title:"not complete"},{a:ag_in(tt,P.fully,0.5),k:ag_spr(tt,P.fully),edge:AG.amber});
      ob_pillL(x,476,470,"who to ask?",tt,P.ask,null,{col:AG.amber});ob_pillL(x,476,550,"what else to check?",tt,P.check,null,{col:AG.amber});}},
    // the helper could do whatever Jun could, far more than a ticket needs, and to stop it they'd have had to stop Jun: his sign-in is
    // its only one; then a veil (Jun stays; the tiles go, his helper and the switch come in)
    {at:c.all,place:"obLab",keys:[[c.all,960,540,1]],push:0.02,draw:(x,tt)=>{const off=ag_in(tt,P.sj,0.6);
      ob_onJun(x,tt,{off,agentA:ag_in(tt,c.all+0.3,0.5),swY:440,swA:ag_in(tt,P.tostop,0.5),swK:ag_spr(tt,P.tostop)});
      ob_pillL(x,1296,240,"rights · all of Jun's",tt,P.whatever,null,{col:AG.ink});
      ob_pillL(x,1296,320,"far more than a ticket needs",tt,P.more,null,{col:AG.amber,icon:"warn"});
      ob_pillL(x,1296,680,"Jun stops too",tt,P.sj+0.3,null,{col:AG.amber,icon:"warn"});
      ag_veil(x,S,0.55*ag_in(tt,c.change+0.1,0.8));}},
    // so before its first ticket, the planning agent got a place on the university's map: a role, an owner, only the rights its work
    // needs (later:true: Jun, his helper and the veil leave, then Noor and the planning agent come in, its name still on a paper tag)
    {later:true,at:c.badge,place:"obLab",keys:[[c.badge,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_agentWith(x,tt,{think:0.2,name:"planning agent",tag:"owner · Clara Jensen",tk:(tt-P.owner)/0.8,dx:-260});
      ob_person(x,"noor",tt,{});ag_roomLight(x,1);ob_personCard(x,"noor",ag_in(tt,c.badge+0.3,0.5));
      ag_label(x,1296,180,"The university's map",{col:AG.kick,a:ag_in(tt,P.place,0.5)});
      ob_el(x,1296,210,560,"agent","planning agent",{col:AG.violet,sub:"owner · Clara Jensen",subA:ag_in(tt,P.owner,0.5),a:ag_in(tt,P.place+0.2,0.5),k:ag_spr(tt,P.place+0.2)});
      ob_pillL(x,1296,440,"role · planning contributor",tt,P.role,null,{col:AG.blue});
      ob_pillL(x,1296,520,"rights · only what its work needs",tt,P.only,null,{col:AG.blue,icon:"lock"});}},
    // and Sam wrote that place into every tool, under the agent's own name: Databricks, GitHub and dbt; the paper tag goes and its badge
    // drops in, and "written from the map" comes in under the card once the tag has gone, so the two never cross (later:true: Noor
    // and the map's card leave, then Sam and the agent come in)
    {later:true,at:c.three,place:"obLab",keys:[[c.three,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_agentWith(x,tt,{think:0.2,name:"planning agent",nameA:1-ag_in(tt,P.own,0.4),badge:"planning agent",bk:(tt-P.own-0.2)/0.9,tag:"owner · Clara Jensen",dx:-260});
      ob_person(x,"sam",tt,{});ag_roomLight(x,1);ob_personCard(x,"sam",ag_in(tt,c.three+0.3,0.5));
      ob_idCard(x,1296,170,570,[["Databricks","service principal",ag_in(tt,P.dbx,0.4),0,false,null,"databricks"],["GitHub","planning-agent[bot]",ag_in(tt,P.gh,0.4),0,true,null,"githubLockup"],
        ["dbt","signs in as it",ag_in(tt,P.dbt,0.4),0,false,null,"dbt"]],{name:"planning agent",owner:"Clara Jensen",a:ag_in(tt,P.own,0.5),k:ag_spr(tt,P.own)});
      ob_pillL(x,1296,640,"written from the map",tt,P.own+0.45,null,{col:AG.blue});}},
    // since Monday, every change it makes says planning-agent[bot], every query names it (the card goes, two logs come in)
    {at:c.since,place:"obLab",keys:[[c.since,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_agentWith(x,tt,{think:0.2,badge:"planning agent",tag:"owner · Clara Jensen",dx:-260});
      ob_person(x,"sam",tt,{});ag_roomLight(x,1);ob_personCard(x,"sam",1);ob_corner(x,"Since Monday",ag_in(tt,c.since+0.2,0.5));
      ob_log(x,1296,170,570,"Commits",null,[Object.assign({},OB_COMMITS[0],{hl:ag_in(tt,P.bot,0.5)})],{mark:"githubLockup",a:ag_in(tt,P.bot-0.6,0.5),k:ag_spr(tt,P.bot-0.6)});
      ob_log(x,1296,400,570,"Query history",null,[{who:OB_ID,tag:"planning agent",col:AG.violet,hl:ag_in(tt,P.query+0.6,0.5)}],{logo:"databricks",a:ag_in(tt,P.query,0.5),k:ag_spr(tt,P.query)});}},
    // Wednesday: Sam tries the switch; for ten minutes the planning agent stops, and Jun, Lucía and Anil's workload agent work on
    // (later:true: Sam's moment with one agent leaves, then the two agents come in)
    {later:true,at:c.tried,place:"obLab",keys:[[c.tried,960,540,1]],push:0.02,draw:(x,tt)=>{const off=ag_in(tt,P.stopped-0.2,0.6);
      ob_twoAgents(x,tt,off,P.wl);
      ob_person(x,"sam",tt,{});ag_roomLight(x,1);ob_personCard(x,"sam",ag_in(tt,c.tried+0.3,0.5));ob_corner(x,"Wednesday",ag_in(tt,c.tried+0.2,0.5));
      ob_switch(x,476,330,380,"planning agent","in every tool",1-off,{a:ag_in(tt,c.tried+0.5,0.5),k:ag_spr(tt,c.tried+0.5)});
      ob_pillL(x,476,540,"10 minutes",tt,P.ten,null,{col:AG.blue,icon:"loop"});
      ob_pillL(x,476,700,"Jun Park · at work",tt,P.jun2,null,{col:AG.green,icon:"tick"});
      ob_pillL(x,476,780,"Lucía Ortega · at work",tt,P.lucia,null,{col:AG.green,icon:"tick"});}},
    // if the auditors ask again: one search, not two days (later:true: the switch's moment leaves, then the search comes in)
    {later:true,at:c.ask,place:"obLab",keys:[[c.ask,960,540,1]],push:0.02,draw:(x,tt)=>{ag_roomLight(x,1);
      ag_label(x,360,262,"If the auditors ask again",{col:AG.kick,a:ag_in(tt,c.ask+0.1,0.5)});
      ob_search(x,360,300,1200,"is:pr author:app/planning-agent",{a:ag_in(tt,c.ask+0.2,0.5),p:(tt-c.ask-0.5)/1.4});
      ob_pillL(x,360,470,"one search",tt,P.one,null,{col:AG.green,icon:"tick"});ob_pillL(x,640,470,"not two days",tt,P.nottwo,null,{col:AG.mut});}},
    // and for data: every change says who made it, person or agent, and no tool lets an agent do more than the map says (later:true:
    // the search leaves, then the log comes in; it all goes as the title comes)
    {later:true,at:c.data,place:"obLab",keys:[[c.data,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.8),()=>{ag_roomLight(x,1);
      ob_log(x,360,190,1200,"Every change · who made it",null,OB_ROWS.map((r,i)=>Object.assign({},r,{tag:i===2?"person":"agent",a:ag_in(tt,P.who+i*0.3,0.4)})),
        {a:ag_in(tt,c.data+0.2,0.5),k:ag_spr(tt,c.data+0.2)});
      ob_pillL(x,360,660,"no more than the map says",tt,P.more2,null,{col:AG.blue,icon:"lock"});})}
  ],0.6);
  ag_title(ctx,S,t,c.breath,"The map, enforced","the map says what it may do","FILM 5 OF 7 · FROM HELPER TO COLLEAGUE");});

/* ---------------------------------------------------------------- 2 · One name in every tool */
scene("name",(ctx,S,t,sc)=>{const c=sc.cues,P=ob_once(sc,"P",()=>({every:wAt(sc,"one","one name in every tool"),
    sp:wAt(sc,"dbx","a service principal"),soft:wAt(sc,"dbx","made for software"),wl:wAt(sc,"dbx","Anil's workload agent"),
    app:wAt(sc,"gh","an App"),bot:wAt(sc,"gh","reads planning agent bot"),same:wAt(sc,"dbt","that same service principal"),
    secret:wAt(sc,"keys","needs a secret"),read:wAt(sc,"keys","an agent can read"),leak:wAt(sc,"keys","it can leak"),
    runs:wAt(sc,"pass","its runs sign in"),passes:wAt(sc,"pass","short-lived passes"),vouch:wAt(sc,"pass","GitHub vouches"),tokens:wAt(sc,"pass","gets back tokens"),
    end:wAt(sc,"pass","end on their own"),none:wAt(sc,"so","no secret")}));
  // the agent's badge card, its rows as each tool is named (drawn the same in every shot that shows it)
  const card=(x,tt,a)=>ob_idCard(x,1296,170,570,[["Databricks","service principal",ag_in(tt,P.sp,0.4),ag_io(tt,P.sp,c.gh,0.4),false,null,"databricks"],
    ["GitHub","planning-agent[bot]",ag_in(tt,P.bot,0.4),ag_io(tt,P.bot,c.dbt,0.4),true,null,"githubLockup"],["dbt","the same service principal",ag_in(tt,P.same,0.4),ag_io(tt,P.same,c.keys,0.4),false,null,"dbt"]],
    {name:"planning agent",owner:"Clara Jensen",a});
  const agent=(x,tt)=>ob_agentWith(x,tt,Object.assign({},OB_AL,{think:0.2,badge:"planning agent"}));
  const arrow=(x,x0,y0,x1,y1,t0,tt)=>ob_line(x,x0,y0,x1,y1,clamp((tt-t0)/0.6,0,1),{col:AG.blue,lw:3});
  ag_shots(ctx,S,t,sc.dur,[
    // a person has one name in every tool: Lucía's, in Databricks, GitHub and dbt (later:true: the title leaves first)
    {later:true,at:0,place:"obLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_person(x,"lucia",tt,{});ag_roomLight(x,1);ob_personCard(x,"lucia",ag_in(tt,0.3,0.5));
      ob_idCard(x,476,200,740,[["Databricks","lucia.ortega@uni.example",ag_in(tt,P.every+0.2,0.4),0,true,null,"databricks"],["GitHub","lucia-ortega",ag_in(tt,P.every+0.5,0.4),0,true,null,"githubLockup"],
        ["dbt","her Databricks sign-in",ag_in(tt,P.every+0.8,0.4),0,false,null,"dbt"]],{name:"Lucía Ortega",owner:"Planning",a:ag_in(tt,P.every-0.4,0.5),k:ag_spr(tt,P.every-0.4)});}},
    // now the planning agent does too: Sam, who set it up, and the agent's own card; a service principal, as Anil's workload agent
    // has (later:true: Lucía leaves, then Sam comes in)
    {later:true,at:c.too,place:"obLab",keys:[[c.too,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_agentWith(x,tt,{think:0.2,badge:"planning agent",tag:"owner · Clara Jensen",dx:-260});
      ob_person(x,"sam",tt,{});ag_roomLight(x,1);ob_personCard(x,"sam",ag_in(tt,c.too+0.2,0.5));
      card(x,tt,ag_in(tt,c.too+0.4,0.5));
      ob_pillL(x,1296,650,"an identity for software",tt,P.soft,null,{col:AG.blue});
      ob_pillL(x,1296,730,"as Anil's workload agent has",tt,P.wl,null,{col:AG.violet});}},
    // to sign in, software usually needs a secret, and one an agent can read, it can leak (later:true: Sam, the agent and the card
    // leave; then the agent comes in on the left, with the room to itself)
    {later:true,at:c.keys,place:"obLab",keys:[[c.keys,960,540,1]],push:0.02,draw:(x,tt)=>{agent(x,tt);ag_roomLight(x,1);
      ob_card(x,560,230,460,{kick:"To sign in",title:"a secret",sub:"a password or a key"},{a:ag_in(tt,P.secret,0.5),k:ag_spr(tt,P.secret),edge:AG.amber});
      ob_key(x,1066,300,0.9,{a:ag_in(tt,P.secret+0.4,0.4)});
      ob_line(x,1140,300,1232,276,clamp((tt-P.leak+0.3)/0.6,0,1),{col:AG.amber,dash:[10,8],lw:3});
      const la=ag_in(tt,P.leak,0.4);if(la>0){x.save();x.globalAlpha*=la;ag_about(x,1520,265,lerp(0.6,1,ag_spr(tt,P.leak)));
        ag_box(x,1240,200,560,130,22,{edge:AG.amber,edgeA:0.75});ag_T(x,"A LOG",1268,250,{w:700,size:28,ls:4,col:AG.amber});
        ag_T(x,"secret: ••••••••",1268,300,{w:500,size:28,f:"mono",col:AG.amber});x.restore();}
      ob_pillL(x,560,520,"what it can read, it can leak",tt,P.read,null,{col:AG.amber,icon:"warn"});}},
    // so its runs sign in with short-lived passes: GitHub vouches for each run, and back come tokens that end on their own; it holds
    // no secret it can see or leak (the agent stays; the secret and its leak go)
    {at:c.pass,place:"obLab",keys:[[c.pass,960,540,1]],push:0.02,draw:(x,tt)=>{agent(x,tt);ag_roomLight(x,1);
      ob_job(x,560,170,560,{a:ag_in(tt,P.runs,0.5),k:ag_spr(tt,P.runs)});
      arrow(x,1124,286,1234,286,P.passes,tt);
      ob_pass(x,1240,170,600,{rows:[["from","this repository",1,ag_io(tt,P.vouch,P.vouch+1.8,0.4)],["environment","planning-agent",1,ag_io(tt,P.vouch+0.3,P.vouch+2.1,0.4),true],
        ["lasts","minutes"]],run:clamp((tt-P.passes)/40,0,0.8),a:ag_in(tt,P.passes+0.3,0.5),k:ag_spr(tt,P.passes+0.3)});
      arrow(x,1300,404,1126,522,P.tokens-0.2,tt);arrow(x,1540,404,1540,494,P.tokens,tt);
      [["Databricks token",560,560,0],["GitHub token",1240,600,0.3]].forEach(([k,x0,w,d])=>{const run=clamp((tt-P.end-d)/2.4,0,1);
        ob_pass(x,x0,500,w,{kick:k,rows:[["for","the planning agent"],["ends","on its own"]],run:0.35+0.6*run,a:ag_in(tt,P.tokens+d,0.5),k:ag_spr(tt,P.tokens+d)});});
      ob_pillL(x,560,800,"no secret it can see or leak",tt,P.none,null,{col:AG.blue,icon:"lock"});}}
  ],0.6);
  ob_kick(ctx,S,ag_in(t,0.6,0.6));});   // once the title has gone

/* ---------------------------------------------------------------- 3 · Written from the map */
scene("map",(ctx,S,t,sc)=>{const c=sc.cues,P=ob_once(sc,"P",()=>({name:wAt(sc,"who","Its name"),map:wAt(sc,"who","Noor's map"),
    role:wAt(sc,"steps","planning contributor"),draft:wAt(sc,"steps","the drafting steps"),reads:wAt(sc,"steps","reads"),writes:wAt(sc,"steps","writes"),calls:wAt(sc,"steps","calls"),
    type:wAt(sc,"script","doesn't type"),script:wAt(sc,"script","A script"),rmap:wAt(sc,"script","reads the map"),wr:wAt(sc,"script","writes every tool's settings"),oneway:wAt(sc,"script","one way"),
    grp:wAt(sc,"uc","a group named for the role"),rprod:wAt(sc,"uc","read production"),masked:wAt(sc,"uc","names masked"),build:wAt(sc,"uc","build only"),
    only:wAt(sc,"member","its only member"),second:wAt(sc,"member","a second agent"),same:wAt(sc,"member","the same rights"),
    ug:wAt(sc,"ug","In Unity Gateway"),model:wAt(sc,"ug","the one model"),servers:wAt(sc,"ug","the tool servers"),
    repo:wAt(sc,"gh","one repository"),perm:wAt(sc,"gh","two permissions"),dbt:wAt(sc,"gh","In dbt"),target:wAt(sc,"gh","a target of its own"),
    gov:wAt(sc,"context","governed"),defs:wAt(sc,"context","the glossary's definitions"),rules:wAt(sc,"context","the data rules"),ro:wAt(sc,"context","read only"),
    mem:wAt(sc,"memory","Its memory"),lake:wAt(sc,"memory","in Lakebase"),second2:wAt(sc,"memory","comes second"),wins:wAt(sc,"memory","the definition wins"),
    compares:wAt(sc,"night","compares them"),given:wAt(sc,"tuesday","was given the right"),hand:wAt(sc,"tuesday","by hand"),
    failed:wAt(sc,"failed","the check failed"),right:wAt(sc,"failed","a right the map doesn't hold"),back:wAt(sc,"failed","took it back"),
    first:wAt(sc,"oneway","the map changes first"),review:wAt(sc,"oneway","through review"),follow:wAt(sc,"oneway","the tools follow"),never:wAt(sc,"oneway","never the other way")}));
  const arrow=(x,x0,y0,x1,y1,t0,tt,o)=>ob_line(x,x0,y0,x1,y1,clamp((tt-t0)/0.6,0,1),Object.assign({col:AG.blue,lw:3},o||{}));
  // the role's three drafting steps, as Rights follow the role writes them on the map: what each reads, writes and calls (the first
  // of each list, and more where the map has more)
  const STEPS=[["draft the change",[["reads","ticket, …"],["writes","change draft"],["calls","language model, …"]]],
    ["build it in development",[["reads","change draft, …"],["writes","test and its result"],["calls","build, query, …"]]],
    ["open a pull request",[["reads","change draft, …"],["writes","pull request"],["calls","repository, …"]]]];
  ag_shots(ctx,S,t,sc.dur,[
    // its name says who it is; what it may do is on Noor's map: the agent, assigned to its role, planning contributor, which does the
    // drafting steps of Planning's changes, each saying what it reads, writes and calls; people do the rest (later:true: the last
    // chapter's passes and the agent leave, then Noor and her map come in)
    {later:true,at:0,place:"obLab",keys:[[0,960,540,1]],push:0.015,draw:(x,tt)=>{
      ob_person(x,"noor",tt,{});ag_roomLight(x,1);ob_personCard(x,"noor",ag_in(tt,0.4,0.5));
      ag_label(x,540,170,"Noor's map",{col:AG.kick,a:ag_in(tt,P.map,0.5)});
      ob_el(x,540,200,380,"agent","planning agent",{col:AG.violet,sub:"owner · Clara Jensen",a:ag_in(tt,P.name+0.2,0.5),k:ag_spr(tt,P.name+0.2)});
      arrow(x,928,275,1092,275,P.role+0.3,tt,{col:AG.mut,lw:2.6});
      ag_T(x,"assigned to",1010,258,{w:600,size:28,align:"center",col:AG.mut,a:ag_in(tt,P.role+0.6,0.4)});
      ob_el(x,1100,200,440,"role","planning contributor",{col:AG.blue,sub:"drafts Planning's changes",a:ag_in(tt,P.role,0.5),k:ag_spr(tt,P.role)});
      STEPS.forEach(([n,rows],i)=>ob_step(x,540+i*440,410,420,n,rows.map((r,j)=>[r[0],r[1],ag_in(tt,[P.reads,P.writes,P.calls][j]+i*0.15,0.4)]),
        {a:ag_in(tt,P.draft+i*0.25,0.5),k:ag_spr(tt,P.draft+i*0.25)}));
      let gx=540;["review the code","approve the change","release to production"].forEach((n,i)=>{gx+=ob_ghost(x,gx,770,n,ag_in(tt,P.draft+1.2+i*0.2,0.5)).w+20;});}},
    // Sam doesn't type those rights into each tool: a script reads the map and writes every tool's settings from it, one way; in
    // Unity Catalog, a group named for the role holds the grants; the planning agent is its only member, and a second agent in the
    // role would get the same rights; in Unity Gateway the group may call one model and the tool servers its steps name; in GitHub its
    // App gets one repository and two permissions; in dbt, a target of its own (later:true: Noor and her map leave, then Sam comes in)
    {later:true,at:c.script,place:"obLab",keys:[[c.script,960,540,1]],push:0.015,draw:(x,tt)=>{
      ob_person(x,"sam",tt,{});ag_roomLight(x,1);ob_personCard(x,"sam",ag_in(tt,c.script+0.3,0.5));
      // the way the rights go: Noor's map, the script, every tool; by hand, tool by tool, is crossed out before the script comes
      ob_tile(x,520,150,280,90,"Noor's map",{col:AG.kick,a:ag_in(tt,c.script+0.4,0.5)});
      const ha=ag_io(tt,P.type,P.script-0.2,0.4);ob_tile(x,880,150,420,90,"by hand, tool by tool",{dash:true,a:ha});ob_cross(x,1090,195,26,ha*ag_in(tt,P.type+0.7,0.5),AG.amber);
      ob_tile(x,880,150,420,90,"a script",{col:AG.blue,a:ag_in(tt,P.script,0.5),k:ag_spr(tt,P.script)});
      arrow(x,808,195,872,195,P.rmap,tt);arrow(x,1308,195,1372,195,P.wr,tt);
      ob_tile(x,1380,150,480,90,"every tool",{col:AG.blue,logos:["databricks","github","dbt"],a:ag_in(tt,P.wr+0.2,0.5),k:ag_spr(tt,P.wr+0.2)});
      ob_pillL(x,1300,290,"one way",tt,P.oneway,c.uc-0.3,{col:AG.blue});
      // Unity Catalog: the group and its grants, then its members
      ob_list(x,520,300,640,{kick:"Unity Catalog",logo:"databricks",label:"group",title:"planning_contributors",titleF:"mono",a:ag_in(tt,P.grp,0.5),k:ag_spr(tt,P.grp),
        rows:[{text:"read · production, names masked",marks:[["lock",ag_in(tt,P.masked,0.4)]],a:ag_in(tt,P.rprod,0.4)},
          {text:"build · only in its own schemas",a:ag_in(tt,P.build,0.4)},
          {text:"member · planning agent",col:AG.violet,a:ag_in(tt,P.only,0.4),hl:ag_io(tt,P.only,P.second,0.4),hlCol:AG.violet},
          {text:"a second agent in the role",dash:true,a:ag_in(tt,P.second,0.4)}]});
      ob_pillL(x,520,710,"the same rights, and no more",tt,P.same,c.gh,{col:AG.violet});
      // Unity Gateway, part of the catalog: the one model, and the tool servers the steps name
      ob_list(x,1220,320,640,{kick:"Unity Gateway",logo:"databricks",title:"part of the catalog",a:ag_in(tt,P.ug,0.5),k:ag_spr(tt,P.ug),
        rows:[{text:"call · the one model its steps use",a:ag_in(tt,P.model,0.4)},{text:"call · the tool servers they name",a:ag_in(tt,P.servers,0.4)}]});
      // GitHub, its App; and dbt, a target of its own
      ob_list(x,1220,590,640,{kick:"",logo:"githubLockup",label:"App",title:"planning-agent",titleF:"mono",a:ag_in(tt,c.gh,0.5),k:ag_spr(tt,c.gh),
        rows:[{text:"repositories · one",a:ag_in(tt,P.repo,0.4)},{text:"permissions · two",a:ag_in(tt,P.perm,0.4)}]});
      ob_list(x,520,670,640,{kick:"dbt",logo:"dbt",label:"target",title:"agent",titleF:"mono",a:ag_in(tt,P.dbt,0.5),k:ag_spr(tt,P.dbt),
        rows:[{text:"schemas · planning_agent_…",a:ag_in(tt,P.target,0.4)}]});}},
    // what it reads first is governed: the glossary's definitions and the data rules, read only, through Unity Catalog; its memory,
    // kept by the platform in Lakebase, comes second, and where the two disagree the definition wins (later:true: Sam and the tools
    // leave, then the agent comes in on the left)
    {later:true,at:c.context,place:"obLab",keys:[[c.context,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_agentWith(x,tt,Object.assign({},OB_AL,{think:0.3,badge:"planning agent"}));ag_roomLight(x,1);
      ob_list(x,560,190,620,{kick:"First · governed",kickCol:AG.green,edge:AG.green,a:ag_in(tt,P.gov,0.5),k:ag_spr(tt,P.gov),
        rows:[{text:"the glossary's definitions",a:ag_in(tt,P.defs,0.4)},{text:"the data rules",a:ag_in(tt,P.rules,0.4)},
          {text:"read only · through Unity Catalog",marks:[["lock",1]],a:ag_in(tt,P.ro,0.4)}]});
      ob_list(x,1240,190,600,{kick:"Second · its memory",kickCol:AG.violet,edge:AG.violet,logo:"databricks",a:ag_in(tt,P.mem,0.5),k:ag_spr(tt,P.mem),
        rows:[{text:"kept by the platform",a:ag_in(tt,P.mem+0.6,0.4)},{text:"in Lakebase",a:ag_in(tt,P.lake,0.4)}]});
      ob_pillL(x,560,560,"where they disagree, the definition wins",tt,P.wins,null,{col:AG.green,icon:"tick"});}},
    // every night a check reads the rights each tool holds and compares them with the map; on Tuesday, to save a day, the group was
    // given the right to change Planning's production tables, by hand; that night the check failed, and in the morning Sam took it
    // back; a new right goes through the map first, then review, then the tools, never the other way (later:true: the agent and what
    // it reads leave, then Sam and the check come in)
    {later:true,at:c.night,place:"obLab",keys:[[c.night,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_person(x,"sam",tt,{});ag_roomLight(x,1);ob_personCard(x,"sam",ag_in(tt,c.night+0.3,0.5));
      const bad=ag_io(tt,P.failed,P.back+0.6,0.5),gone=ag_in(tt,P.back,0.6);
      ob_list(x,520,190,640,{kick:"Each night",title:"each tool's rights against the map",a:ag_in(tt,c.night+0.4,0.5),k:ag_spr(tt,c.night+0.4),
        rows:["Unity Catalog","Unity Gateway","the team's memory","GitHub"].map((n,i)=>{const ok=ag_in(tt,P.compares+i*0.3,0.4);
          return{text:n,marks:i===0?[["tick",ok*(1-bad)],["cross",bad]]:[["tick",ok]],col:i===0&&bad>0.5?AG.amber:null,hl:i===0?bad:0,hlCol:AG.amber};})});
      // Tuesday, by hand: the right to change Planning's production tables, which the map doesn't hold; caught, then taken back
      const ta=ag_in(tt,P.given,0.5)*(1-ag_in(tt,c.oneway-0.6,0.5));
      ob_card(x,1240,190,600,{kick:"Tuesday · by hand",title:"change Planning's production tables",sub:"MODIFY on prod_marts, to planning_contributors"},
        {a:ta*(1-0.5*gone),k:ag_spr(tt,P.given),edge:AG.amber});
      ob_pillL(x,1240,500,"taken back",tt,P.back+0.3,c.oneway-0.6,{col:AG.green,icon:"tick"});
      ob_pillL(x,520,600,"a right the map doesn't hold",tt,P.right,c.oneway-0.6,{col:AG.amber,icon:"warn"});
      // one way: the map changes first, through review, and the tools follow; never the other way
      const s_=[["the map changes",P.first,AG.kick],["review",P.review,AG.blue],["the tools follow",P.follow,AG.blue]];
      s_.forEach(([n,t0,col],i)=>{ob_tile(x,520+i*440,620,360,90,n,{col,a:ag_in(tt,t0,0.5),k:ag_spr(tt,t0)});if(i)arrow(x,520+i*440-72,665,520+i*440-8,665,t0-0.2,tt);});
      const nv=ag_in(tt,P.never,0.5);if(nv>0){ob_line(x,1580,722,700,722,clamp((tt-P.never)/0.8,0,1),{col:AG.amber,dash:[10,8],lw:3});
        ob_cross(x,1140,722,18,ag_in(tt,P.never+0.6,0.4),AG.amber);}
      ob_pillL(x,940,800,"never the other way",tt,P.never+0.3,null,{col:AG.amber,icon:"warn"});}}
  ],0.6);
  ob_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 4 · A place of its own */
scene("own",(ctx,S,t,sc)=>{const c=sc.cues,P=ob_once(sc,"P",()=>({where:wAt(sc,"where","where it may work"),place:wAt(sc,"where","a place of its own"),
    touch:wAt(sc,"where","can't touch"),br:wAt(sc,"branches","writes only to branches"),pr:wAt(sc,"branches","opens a pull request"),push:wAt(sc,"branches","can't push to main"),
    merge:wAt(sc,"merge","doesn't merge"),appr:wAt(sc,"merge","its approval never counts"),next:wAt(sc,"merge","The next film"),
    dev:wAt(sc,"dbx","the development workspace"),ro:wAt(sc,"dbx","can only be read"),wrong:wAt(sc,"dbx","even a wrong grant"),
    mk:wAt(sc,"schemas","make schemas of its own"),layer:wAt(sc,"schemas","one for each layer"),
    marts:wAt(sc,"schemas","planning agent marts"),owns:wAt(sc,"owns","owns what it makes"),over:wAt(sc,"owns","written over"),passes:wAt(sc,"owns","no draft of its passes")}));
  const agent=(x,tt)=>ob_agentWith(x,tt,Object.assign({},OB_AL,{think:0.2,badge:"planning agent"}));
  ag_shots(ctx,S,t,sc.dur,[
    // the map also says where it may work: a place of its own, where its drafts touch no one else's (later:true: Sam and the check
    // leave, then the agent comes in on the left)
    {later:true,at:0,place:"obLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{agent(x,tt);ag_roomLight(x,1);
      ag_label(x,560,200,"Where it may work",{col:AG.kick,a:ag_in(tt,P.where,0.5)});
      const ia=ag_in(tt,P.place,0.5);const inner=ag_sandbox(x,1180,700,980,{depth:220,a:ia,label:"its own place · drafts only"});
      if(inner)[0,1].forEach(i=>ob_pillAt(x,inner.x+170+i*330,inner.y+110,"draft",tt,P.place+0.5+i*0.3,null,{col:AG.violet,icon:"draft"}));
      ob_pillL(x,560,300,"Jun's work · untouched",tt,P.touch,null,{col:AG.ink,icon:"lock"});ob_pillL(x,1040,300,"Lucía's work · untouched",tt,P.touch+0.3,null,{col:AG.ink,icon:"lock"});}},
    // in GitHub, its tool writes only to branches named agent/planning and opens a pull request; it can't push to main; it doesn't
    // merge, and its approval never counts where the rules ask for a person (later:true: the place leaves, then GitHub's branches)
    {later:true,at:c.branches,place:"obLab",keys:[[c.branches,960,540,1]],push:0.02,draw:(x,tt)=>{agent(x,tt);ag_roomLight(x,1);
      ag_label(x,560,200,"GitHub",{col:AG.kick,a:ag_in(tt,c.branches+0.2,0.5)});
      ob_branches(x,560,320,1260,{a:ag_in(tt,c.branches+0.3,0.5),br:(tt-P.br)/1.2,pr:(tt-P.pr)/1.0,push:(tt-P.push)/1.0});
      ob_pillL(x,560,650,"doesn't merge",tt,P.merge,null,{col:AG.ink});
      ob_pillL(x,560,730,"its approval never counts for a person",tt,P.appr,null,{col:AG.ink});
      ob_card(x,1340,610,500,{kick:"The next film",title:"Every change through review"},{a:ag_in(tt,P.next,0.5),k:ag_spr(tt,P.next)});}},
    // in Databricks it works in the development workspace, where production can only be read, so even a wrong grant can't write there;
    // in development it makes schemas of its own, one for each layer, and owns them; nobody else's are touched (later:true: GitHub
    // leaves, then Databricks comes in)
    {later:true,at:c.dbx,place:"obLab",keys:[[c.dbx,960,540,1]],push:0.02,draw:(x,tt)=>{agent(x,tt);ag_roomLight(x,1);
      ag_label(x,560,190,"Databricks · from development",{col:AG.kick,a:ag_in(tt,P.dev,0.5)});
      const pa=ag_in(tt,P.dev+0.3,0.5);ob_schema(x,620,262,"prod_core",{a:pa});ob_schema(x,860,262,"prod_marts",{a:pa});
      ag_glass(x,580,236,900,116,{a:ag_in(tt,P.ro,0.5)});
      ob_pillL(x,580,410,"even a wrong grant can't write",tt,P.wrong,null,{col:AG.green,icon:"tick"});
      ag_label(x,560,490,"Development",{col:AG.kick,a:ag_in(tt,P.mk-0.4,0.5)});
      const da=ag_in(tt,P.mk,0.5),inner=ag_sandbox(x,1000,800,880,{depth:260,a:da,label:null});
      if(inner){const S_=[["planning_agent_staging",P.layer],["planning_agent_core",P.layer+0.3],["planning_agent_marts",P.marts]];
        S_.forEach(([n,t0],i)=>ob_schema(x,inner.x+24,inner.y+12+i*76,n,{a:ag_in(tt,t0,0.4)*da,k:ag_spr(tt,t0),edge:i===2?AG.violet:null,col:i===2?AG.violet:null}));}
      [["jun_park_marts",600],["lucia_ortega_marts",690]].forEach(([n,y])=>ob_schema(x,1480,y,n,{grey:true,lock:true,a:ag_in(tt,P.mk+0.6,0.5)}));
      ob_pillL(x,820,490,"owner · planning agent",tt,P.owns,null,{col:AG.violet});
      ob_pillL(x,1440,520,"others' work untouched",tt,P.over,null,{col:AG.green,icon:"tick"});}}
  ],0.6);
  ob_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 5 · Under its own name */
scene("logs",(ctx,S,t,sc)=>{const c=sc.cues,P=ob_once(sc,"P",()=>({every:wAt(sc,"now","every log"),pa:wAt(sc,"gh","read planning agent bot"),wa:wAt(sc,"gh","every other agent's work"),
    type:wAt(sc,"verified","type that name"),app:wAt(sc,"verified","through its App"),ver:wAt(sc,"verified","marks them verified"),
    qh:wAt(sc,"qh","the query history"),sp:wAt(sc,"qh","its service principal"),table:wAt(sc,"audit","each table it reads"),schema:wAt(sc,"audit","each schema it makes"),
    one:wAt(sc,"search","one search"),every2:wAt(sc,"search","every pull request"),changed:wAt(sc,"search","what each one changed"),only:wAt(sc,"jun","only on what Jun did")}));
  const agent=(x,tt)=>ob_agentWith(x,tt,Object.assign({},OB_AL,{think:0.2,badge:"planning agent"}));
  ag_shots(ctx,S,t,sc.dur,[
    // every log says whose work it is; in GitHub its commits read planning-agent[bot], the workload agent's its own name; anyone could
    // type that name, but its own are made through its App, so GitHub marks them verified (later:true: Databricks' schemas leave,
    // then GitHub's log comes in)
    {later:true,at:0,place:"obLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{agent(x,tt);ag_roomLight(x,1);
      const fake=ag_in(tt,P.type,0.5),ok=ag_in(tt,P.ver,0.4);
      ob_log(x,560,170,1280,"Commits",null,[Object.assign({},OB_COMMITS[0],{hl:ag_io(tt,P.pa,P.pa+2.2,0.4),ok,a:ag_in(tt,P.every+0.4,0.4)}),
        Object.assign({},OB_COMMITS[1],{hl:ag_io(tt,P.wa,P.wa+2.2,0.4),ok,a:ag_in(tt,P.every+0.7,0.4)}),Object.assign({},OB_COMMITS[2],{a:ag_in(tt,P.every+1.0,0.4)}),
        {text:"Change the class plan",who:"planning-agent[bot]",col:AG.amber,tag:"typed by anyone",warn:fake,a:fake}],{mark:"githubLockup",a:ag_in(tt,P.every,0.5),k:ag_spr(tt,P.every)});
      ob_pillL(x,560,700,"made through its App",tt,P.app,null,{col:AG.violet});}},
    // in Databricks every query it runs is in the query history, under its service principal, and the audit log's table lists what
    // else it does (later:true: GitHub's log leaves, then Databricks' two come in, each with Databricks' mark)
    {later:true,at:c.qh,place:"obLab",keys:[[c.qh,960,540,1]],push:0.02,draw:(x,tt)=>{agent(x,tt);ag_roomLight(x,1);
      ob_log(x,560,170,1280,"Query history","system.query.history",[{when:"Wed 10:02",who:OB_ID,tag:"planning agent",hl:ag_io(tt,P.sp,P.sp+2,0.4)},
        {when:"Wed 10:04",who:OB_ID,tag:"planning agent",hl:ag_io(tt,P.sp+0.2,P.sp+2.2,0.4)},{when:"Wed 10:05",who:"jun.park@uni.example"}],{logo:"databricks",a:ag_in(tt,P.qh-0.3,0.5),k:ag_spr(tt,P.qh-0.3)});
      ob_log(x,560,490,1280,"Audit log","system.access.audit",[{text:"getTable · prod_marts.mart_planning__class_plan",who:OB_ID,tag:"planning agent",a:ag_in(tt,P.table,0.4)},
        {text:"createSchema · planning_agent_marts",who:OB_ID,tag:"planning agent",a:ag_in(tt,P.schema,0.4)}],{logo:"databricks",a:ag_in(tt,c.audit,0.5),k:ag_spr(tt,c.audit)});}},
    // so the auditors' question is one search: every pull request by planning-agent[bot], and what each one changed (later:true:
    // Databricks' logs leave, then the search comes in)
    {later:true,at:c.search,place:"obLab",keys:[[c.search,960,540,1]],push:0.02,draw:(x,tt)=>{agent(x,tt);ag_roomLight(x,1);
      ob_search(x,560,180,1280,"is:pr author:app/planning-agent",{a:ag_in(tt,c.search+0.1,0.5),p:(tt-c.search-0.3)/1.3});
      ob_log(x,560,300,1280,"1 pull request",null,[Object.assign({},OB_ROWS[0],{hl:ag_io(tt,P.every2,P.every2+2,0.4)})],{a:ag_in(tt,P.every2-0.2,0.5),k:ag_spr(tt,P.every2-0.2)});
      const ca=ag_in(tt,P.changed,0.5);if(ca>0){ag_box(x,560,520,640,200,20,{a:ca,edge:AG.green});
        ag_T(x,"WHAT IT CHANGED",588,570,{w:700,size:28,ls:4,col:AG.kick,a:ca});ag_T(x,"+ class_size",588,628,{w:500,size:30,f:"mono",col:AG.green,a:ca});
        ag_T(x,"~ classes · 161 rows",588,680,{w:500,size:30,f:"mono",col:AG.blue,a:ca});}
      ob_pillL(x,1260,620,"one search",tt,P.one,null,{col:AG.green,icon:"tick"});}},
    // and Jun's name is only on what Jun did (later:true: the agent and the search leave, then Jun comes in, with his own)
    {later:true,at:c.jun,place:"obLab",keys:[[c.jun,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_person(x,"jun",tt,{});ag_roomLight(x,1);ob_personCard(x,"jun",ag_in(tt,c.jun+0.2,0.5));
      ob_log(x,476,300,900,"By Jun Park",null,[Object.assign({},OB_COMMITS[2],{hl:ag_in(tt,P.only,0.5)})],{a:ag_in(tt,c.jun+0.3,0.5),k:ag_spr(tt,c.jun+0.3)});
      ob_pillL(x,476,520,"only what Jun did",tt,P.only,null,{col:AG.green,icon:"tick"});}}
  ],0.6);
  ob_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 6 · Stopped, and only it */
scene("stop",(ctx,S,t,sc)=>{const c=sc.cues,P=ob_once(sc,"P",()=>({sj:wAt(sc,"before","stopping Jun"),own:wAt(sc,"each","on its own"),noone:wAt(sc,"each","no one stops"),
    deact:wAt(sc,"dbx","deactivates"),cant:wAt(sc,"dbx","can't sign in"),keeps:wAt(sc,"dbx","keeps its rights"),
    susp:wAt(sc,"gh","suspends"),reach:wAt(sc,"gh","can no longer reach"),both:wAt(sc,"wed","tried both"),ten:wAt(sc,"wed","for ten minutes"),fail:wAt(sc,"wed","next call failed"),
    jun:wAt(sc,"on","Jun"),lucia:wAt(sc,"on","Lucía"),wl:wAt(sc,"on","Anil's workload agent"),back:wAt(sc,"on","Turned back on"),every:wAt(sc,"on","every right"),
    owns:wAt(sc,"never","Clara owns it"),answers:wAt(sc,"never","answers for its work"),approves:wAt(sc,"never","never approves"),grants:wAt(sc,"never","grants itself a right"),
    whose:wAt(sc,"back","Whose change"),says:wAt(sc,"back","every log says"),one:wAt(sc,"back","one search")}));
  ag_shots(ctx,S,t,sc.dur,[
    // last, the switch: a helper on Jun's sign-in could only be stopped by stopping Jun (later:true: the last chapter's search and
    // Jun's own log leave, then Jun and his helper come in)
    {later:true,at:0,place:"obLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const off=ag_in(tt,P.sj,0.6);
      ob_onJun(x,tt,{off});ob_pillL(x,1296,520,"Jun stops too",tt,P.sj+0.3,null,{col:AG.amber,icon:"warn"});}},
    // the planning agent can be stopped in each tool on its own: Sam deactivates its service principal (it can't sign in, it keeps
    // its rights) and suspends its App's installation (it reaches no repository) (later:true: Jun and his helper leave, then Sam and
    // the planning agent come in)
    {later:true,at:c.each,place:"obLab",keys:[[c.each,960,540,1]],push:0.02,draw:(x,tt)=>{const d=ag_in(tt,P.deact,0.6),g=ag_in(tt,P.susp,0.6);
      ob_agentWith(x,tt,{think:0.2,badge:"planning agent",grey:Math.min(d,g),off:"stopped",tag:"owner · Clara Jensen",dx:-260});
      ob_person(x,"sam",tt,{});ag_roomLight(x,1);ob_personCard(x,"sam",ag_in(tt,c.each+0.3,0.5));
      ob_switch(x,1296,140,570,"Databricks","its service principal",1-d,{states:["Active","Deactivated"],a:ag_in(tt,P.own,0.5),k:ag_spr(tt,P.own)});
      ob_pillL(x,1296,350,"can't sign in",tt,P.cant,null,{col:AG.ink});ob_pillL(x,1296,420,"keeps its rights",tt,P.keeps,null,{col:AG.blue,icon:"lock"});
      ob_switch(x,1296,480,570,"GitHub","its App's installation",1-g,{states:["Active","Suspended"],a:ag_in(tt,P.own+0.3,0.5),k:ag_spr(tt,P.own+0.3)});
      ob_pillL(x,1296,690,"reaches no repository",tt,P.reach,null,{col:AG.ink});
      ob_pillL(x,1296,770,"no one stops with it",tt,P.noone,null,{col:AG.green,icon:"tick"});}},
    // Wednesday, ten minutes: its next call fails; Jun, Lucía and Anil's workload agent work on; turned back on, it has every right
    // it had (later:true: Sam's switches leave, then the two agents come in)
    {later:true,at:c.wed,place:"obLab",keys:[[c.wed,960,540,1]],push:0.02,draw:(x,tt)=>{const off=1-ag_in(tt,P.back,0.6);
      ob_twoAgents(x,tt,off,P.wl);ag_roomLight(x,1);ob_corner(x,"Wednesday · ten minutes",ag_io(tt,c.wed+0.2,c.never-0.6,0.5));
      const ca=ag_io(tt,P.fail,P.back,0.4);if(ca>0){const u=ag_sine((tt-P.fail)/0.7)*(1-ag_sine((tt-P.fail-1.6)/0.6));
        ob_line(x,OB_PA.x+80,OB_PA.y-60,1290,240,u,{col:AG.amber,dash:[10,8],head:false});ob_pillAt(x,1290,240,"its next call · refused",tt,P.fail+0.4,P.back,{col:AG.amber,icon:"warn"});}
      ob_pillL(x,250,700,"Jun Park · at work",tt,P.jun,null,{col:AG.green,icon:"tick"});ob_pillL(x,250,780,"Lucía Ortega · at work",tt,P.lucia,null,{col:AG.green,icon:"tick"});
      ob_pillAt(x,OB_PA.x,800,"every right, as before",tt,P.every,null,{col:AG.blue,icon:"lock"});}},
    // what never changes: Clara owns it and answers for it; it never approves a change, or grants itself a right (later:true: the two
    // agents leave, then Clara and the planning agent come in)
    {later:true,at:c.never,place:"obLab",keys:[[c.never,960,540,1]],push:0.02,draw:(x,tt)=>{
      ob_agentWith(x,tt,{think:0.2,badge:"planning agent",tag:"owner · Clara Jensen",tk:(tt-P.owns)/0.8,dx:-260});
      ob_person(x,"clara",tt,{});ag_roomLight(x,1);ob_personCard(x,"clara",ag_in(tt,c.never+0.3,0.5));
      ob_pillL(x,1296,240,"answers for its work",tt,P.answers,null,{col:AG.blue});
      ob_pillL(x,1296,320,"never approves a change",tt,P.approves,null,{col:AG.ink});
      ob_pillL(x,1296,400,"never grants itself a right",tt,P.grants,null,{col:AG.ink});}},
    // whose change was that? Now every log says, and the auditors' question takes one search (later:true: Clara and the agent leave,
    // then the log comes in)
    {later:true,at:c.back,place:"obLab",keys:[[c.back,960,540,1]],push:0.02,draw:(x,tt)=>{ag_roomLight(x,1);
      ag_T(x,"Whose change was that?",360,250,{w:700,size:48,a:ag_in(tt,P.whose,0.5)});
      ob_log(x,360,300,1200,"Every log",null,OB_ROWS.map((r,i)=>Object.assign({},r,{a:ag_in(tt,P.says+i*0.25,0.4)})),{a:ag_in(tt,P.says-0.2,0.5),k:ag_spr(tt,P.says-0.2)});
      ob_pillL(x,360,720,"one search",tt,P.one,null,{col:AG.green,icon:"tick"});}},
    // the map says what it may do; every tool holds it to that; next, every change through review (later:true)
    {later:true,at:c.take,place:"obLab",keys:[[c.take,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.9),()=>{ag_roomLight(x,1);
      const la=ag_in(tt,c.take+0.2,0.6);ag_T(x,"The map says what it may do;",960,380,{w:700,size:48,align:"center",a:la});
      ag_T(x,"every tool holds it to that.",960,450,{w:700,size:48,align:"center",a:la});
      ob_card(x,650,560,620,{kick:"Next",title:"Every change through review"},{a:ag_in(tt,c.next,0.4),k:ag_spr(tt,c.next)});})}
  ],0.6);
  // the kicker, but for the corner that says "Wednesday" over it: it goes before the corner comes, and comes back once it has gone
  ob_kick(ctx,S,(1-ag_io(t,c.wed-0.5,c.never-0.2,0.45))*(1-ag_in(t,c.breath,0.9)));
  ag_end(ctx,S,t,c.breath,"The map, enforced","The map says what it may do; every tool holds it to that.","Film 5 of 7","From helper to colleague");});

// every chapter after the opening opens in the room the one before ends in: its camera glides on from there, and the end of the last
// one is drawn through it (a chapter whose first shot is a later moment lets that end leave first)
ag_cutInto(["name","map","own","logs","stop"]);
