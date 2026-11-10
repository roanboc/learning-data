/* ===== Every change through review: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): the lab, painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice. Every shot is in the
   lab, one room: from shot to shot and chapter to chapter the camera glides on from where it is, what stays stays put, and only what
   changes fades. A later moment, with other people, another agent or another page of cards, is marked later:true, so what was there
   leaves before what comes later comes in, through the bare room; that way the planning agent and the governance review agent, which
   look alike, are never seen in one place at once, and an agent that moves across the room is never seen in two. */

/* ---------------------------------------------------------------- pieces the scenes share */
const EC_TITLE="Plan each unit's classes from its own class size";
// the review agent stands a little left of the usual place, so its long badge clears the cards on the right
const EC_RV={x:1000,y:430,R:150,r:78};
// a number on a card of its own: o.col, o.a, o.k; the number big, its words under it
function ec_big(ctx,x,y,w,num,words,o){o=o||{};const a=o.a==null?1:o.a,h=196;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;ec_springAbout(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,24,{edge:o.col||AG.green,edgeA:0.6});ag_T(ctx,num,x+32,y+108,{w:800,size:76,col:o.col||AG.green});ag_T(ctx,words,x+32,y+158,{w:700,size:30});
  ctx.restore();return{x,y,w,h};}
// the time of day on a pill at the top right of the release's card, its words changing over (the old leave before the new come)
function ec_when(ctx,x,y,old,neu,u,a){if(!(a>0))return;const w=Math.max(ag_tw(ctx,old,{w:700,size:28}),ag_tw(ctx,neu,{w:700,size:28}))+56,h=56;
  ag_box(ctx,x-w,y,w,h,h/2,{a,edge:AG.blue});ec_swap(ctx,old,neu,u,x-w/2,y+38,{w:700,size:28,align:"center",col:AG.blue,a});}

/* ---------------------------------------------------------------- 1 · The agent's first pull request */
scene("first",(ctx,S,t,sc)=>{const c=sc.cues,P=ec_once(sc,"P",()=>({uni:wAt(sc,"place","the university"),tue:wAt(sc,"place","On Tuesday"),agent:wAt(sc,"place","Planning's agent"),
    opened:wAt(sc,"place","opened its first pull request"),forward:wAt(sc,"what","a change put forward"),read:wAt(sc,"what","for people to read"),accept:wAt(sc,"what","to accept or not"),
    plan:wAt(sc,"plan","class plan"),planning:wAt(sc,"plan","Planning's"),next:wAt(sc,"plan","next semester"),many:wAt(sc,"plan","how many classes"),hire:wAt(sc,"tutors","hire their tutors"),
    of25:wAt(sc,"labs","classes of twenty-five"),lab:wAt(sc,"labs","But a laboratory"),holds:wAt(sc,"labs","holds sixteen"),every:wAt(sc,"stakes","every faculty"),
    dropped:wAt(sc,"wrong","dropped a unit"),doubled:wAt(sc,"wrong","doubled its classes"),without:wAt(sc,"wrong","without a class"),pay:wAt(sc,"wrong","pay tutors"),
    approve:wAt(sc,"own","approve its own change"),put:wAt(sc,"own","put it there"),before:wAt(sc,"own","before anyone had looked"),had:wAt(sc,"change","had to change"),
    agents:wAt(sc,"review","an agent's"),persons:wAt(sc,"review","a person's"),through:wAt(sc,"review","goes through review"),rules:wAt(sc,"review","the rules are set"),
    evid:wAt(sc,"path","its evidence"),checks:wAt(sc,"path","Checks build"),diff:wAt(sc,"path","a diff shows"),
    another:wAt(sc,"release","Another agent"),people:wAt(sc,"release","People approve"),second:wAt(sc,"release","a second person"),
    jun:wAt(sc,"saw","Jun"),noor:wAt(sc,"saw","Noor"),more:wAt(sc,"saw","more classes"),nothing:wAt(sc,"saw","nothing else"),
    n263:wAt(sc,"answer","two hundred"),time:wAt(sc,"answer","in time"),place:wAt(sc,"answer","a place for every student"),
    proposes:wAt(sc,"data","an agent proposes"),releases:wAt(sc,"data","a person releases"),seen:wAt(sc,"data","nothing reaches production")}));
  const planAgent=(x,tt,a)=>ec_theAgent(x,tt,Object.assign({},EC_AL,{badge:"planning agent"}),{a,think:0.3});
  // the path, as the opening tells it: each station lit as the line names it, the pull request moving along under them
  const PX=150,PY=250,PW=1620;
  const path=(x,tt,a)=>{const L=[P.evid,P.checks,P.diff,P.another,P.people,P.second];
    return ec_path(x,PX,PY,PW,{a,k:L.map((t0,i)=>ag_spr(tt,c.path+0.1+i*0.08)),lit:L.map(t0=>ag_in(tt,t0,0.5)),chipA:ag_in(tt,P.evid,0.4),
      chip:L.reduce((s,t0,i)=>s+(i?ag_sine(clamp((tt-t0+0.6)/0.8,0,1)):0),0),names:[[4,"Jun",ag_in(tt,P.jun,0.4)],[5,"Noor",ag_in(tt,P.noor,0.4)]]});};
  const tools=(x,tt,a)=>{if(!(a>0))return;const ws=[["github","GitHub"],["databricks","Databricks"],["dbt","dbt"]].map(([k,n])=>[k,n,ec_toolW(x,n)]),tw=ws.reduce((s,w)=>s+w[2],0)+2*24;
    let xx=960-tw/2;withA(x,a,()=>{ag_label(x,960,700,"The rules, set in the tools",{align:"center",col:AG.kick});ws.forEach(([k,n,w],i)=>{ec_tool(x,xx,770,k,n,{edge:AG.blue});xx+=w+24;});});};
  ag_shots(ctx,S,t,sc.dur,[
    // today, at the university: on Tuesday the planning agent opened its first pull request
    {at:0,place:"ecLab",keys:[[0,960,560,1.05],[P.opened,960,540,1]],push:0.015,draw:(x,tt)=>{
      planAgent(x,tt,ag_in(tt,P.agent-0.4,0.6));ag_roomLight(x,1);ec_corners(x,tt,ag_in(tt,0.4,0.6),"Today · the university","Tuesday",P.tue);
      ec_line(x,EC_AL.x+EC_AL.R+10,EC_AL.y-20,592,330,clamp((tt-P.opened+0.2)/0.6,0,1),{col:AG.violet,dash:[10,8],lw:3});
      const pr={title:EC_TITLE,who:"by planning-agent[bot]"};ec_pr(x,600,230,1100,Object.assign({a:ag_in(tt,P.opened,0.5),k:ag_spr(tt,P.opened)},pr));
      // a change put forward, for people to read, and to accept or not
      ec_pillL(x,600,560,"a change put forward",tt,P.forward,null,{col:AG.blue});ec_pillL(x,600,640,"for people to read",tt,P.read,null,{col:AG.ink});
      ec_pillL(x,940,640,"to accept, or not",tt,P.accept,null,{col:AG.green,icon:"tick"});}},
    // Planning's class plan for next semester, which the faculties hire their tutors from; classes of 25, and a laboratory of 16;
    // every faculty plans with it (later:true: the agent and its pull request leave, then the plan comes in)
    {later:true,at:c.plan,place:"ecLab",keys:[[c.plan,960,540,1]],push:0.02,draw:(x,tt)=>{ag_roomLight(x,1);
      const wr=ag_in(tt,c.wrong-0.2,0.4);
      ec_plan(x,120,170,860,{a:ag_in(tt,P.planning-0.3,0.5),k:ag_spr(tt,P.planning-0.3),sub:"2027 Semester 1 · 1,236 units",col25:ag_io(tt,P.of25,c.stakes,0.5),lab:ag_io(tt,P.lab,c.stakes,0.5),
        drop:clamp((tt-P.dropped)/0.7,0,1),dbl:clamp((tt-P.doubled)/0.7,0,1)});
      ec_card(x,1080,200,560,{kick:"The faculties",title:"hire their tutors from it",sub:"in November, for February"},{a:ag_in(tt,P.hire,0.5)*(1-ag_in(tt,P.of25,0.4)),k:ag_spr(tt,P.hire),edge:AG.blue});
      ec_line(x,990,330,1066,330,clamp((tt-P.hire+0.2)/0.5,0,1)*(1-ag_in(tt,P.of25,0.4)),{col:AG.blue,lw:3});
      // a class of 25, and a laboratory: sixteen go to the benches, nine are left
      ec_lab(x,1040,200,{a:ag_in(tt,P.of25+0.2,0.5)*(1-wr),lab:ag_in(tt,P.lab,0.5),fill:clamp((tt-P.holds)/1.6,0,1),left:ag_in(tt,P.holds+1.4,0.5)});
      ec_pillL(x,1460,680,"9 without a bench",tt,P.holds+1.6,c.wrong-0.2,{col:AG.amber,icon:"warn"});
      ec_faculties(x,120,720,{a:ag_in(tt,P.every-0.2,0.4),k:EC_FACULTIES.map((f,i)=>ag_spr(tt,P.every+i*0.18))});
      // a change that dropped a unit, or doubled its classes
      ec_card(x,1080,200,640,{kick:"A unit dropped",title:"students without a class"},{a:ag_in(tt,P.without-0.3,0.5),k:ag_spr(tt,P.without-0.3),edge:AG.amber,kickCol:AG.amber});
      ec_card(x,1080,420,640,{kick:"Its classes doubled",title:"tutors paid for classes that never run"},{a:ag_in(tt,P.pay,0.5),k:ag_spr(tt,P.pay),edge:AG.amber,kickCol:AG.amber});}},
    // an agent that could approve its own change could put it in production before anyone had looked; that had to change
    // (later:true: the plan leaves, then the agent and its pull request come back)
    {later:true,at:c.own,place:"ecLab",keys:[[c.own,960,540,1]],push:0.02,draw:(x,tt)=>{
      planAgent(x,tt,1);ag_roomLight(x,1);
      ec_pr(x,600,190,920,{title:EC_TITLE,who:"by planning-agent[bot]",a:ag_in(tt,c.own+0.2,0.5),k:ag_spr(tt,c.own+0.2)});
      const ap=ec_pillL(x,600,470,"approved by planning-agent[bot]",tt,P.approve,null,{col:AG.amber,icon:"warn"});
      const pa=ag_in(tt,P.put,0.5);ag_glass(x,1590,190,290,300,{a:pa,label:null});withA(x,pa,()=>{ag_label(x,1616,244,"Production",{col:AG.kick});ag_T(x,"the class plan",1616,294,{w:700,size:30});});
      ec_line(x,1530,290,1582,290,clamp((tt-P.put)/0.6,0,1),{col:AG.amber,dash:[10,8],lw:3.4});
      ec_pillL(x,600,560,"before anyone had looked",tt,P.before,null,{col:AG.amber});
      if(ap)ec_cross(x,ap.x+ap.w/2,470,26,ag_in(tt,P.had,0.5),AG.amber);
      ag_veil(x,S,0.5*ag_in(tt,P.had+0.4,0.8));}},
    // now every change, an agent's or a person's, goes through review, and the rules are set in the tools (later:true: the agent
    // leaves; the two changes come in, then the tools)
    {later:true,at:c.review,place:"ecLab",keys:[[c.review,960,540,1]],push:0.015,draw:(x,tt)=>{ag_roomLight(x,1);
      const pa=1-ag_in(tt,c.path-0.4,0.5);
      ec_corner(x,"Now",ag_in(tt,c.review+0.2,0.5));
      withA(x,pa,()=>{ec_pr(x,150,250,560,{title:"An agent's change",who:"by planning-agent[bot]",a:ag_in(tt,P.agents,0.5),k:ag_spr(tt,P.agents)});
        ec_pr(x,150,480,560,{title:"A person's change",who:"by Jun Park",whoCol:AG.ink,a:ag_in(tt,P.persons,0.5),k:ag_spr(tt,P.persons)});
        ec_line(x,720,330,880,410,clamp((tt-P.through)/0.6,0,1),{col:AG.blue,lw:3});ec_line(x,720,560,880,450,clamp((tt-P.through)/0.6,0,1),{col:AG.blue,lw:3});
        ec_pillL(x,900,430,"through review",tt,P.through+0.3,null,{col:AG.blue});});
      tools(x,tt,ag_in(tt,P.rules,0.5)*(1-ag_in(tt,c.saw-0.2,0.5)));
      // the path: evidence, checks on what changed, the diff, an agent's review, the people's approval, a second person's release
      path(x,tt,ag_in(tt,c.path+0.1,0.4));
      // what they saw: more classes in 161 units, and nothing else; the faculties can hire for 263 more, in time
      ec_card(x,150,640,760,{kick:"What would change",title:"more classes in 161 units",sub:"and nothing else"},{a:ag_in(tt,P.more,0.5)*(1-ag_in(tt,c.answer-0.3,0.4)),k:ag_spr(tt,P.more),edge:AG.orange});
      ec_big(x,150,620,640,"263","more classes, hired in time",{a:ag_in(tt,P.n263,0.5),k:ag_spr(tt,P.n263)});
      ec_pillL(x,860,700,"a place for every student",tt,P.place,null,{col:AG.green,icon:"tick"});}},
    // and for data: an agent proposes, a person releases, and nothing reaches production that a person hasn't seen (later:true; it all
    // leaves before the title's words come)
    {later:true,at:c.data,place:"ecLab",keys:[[c.data,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.45),()=>{ag_roomLight(x,1);
      ag_label(x,960,300,"And for data",{align:"center",col:AG.kick,a:ag_in(tt,c.data+0.2,0.5)});
      ec_pillAt(x,560,420,"an agent proposes",tt,P.proposes,null,{col:AG.violet,size:34});ec_line(x,780,420,1080,420,clamp((tt-P.releases+0.3)/0.6,0,1),{col:AG.mut,lw:3});
      ec_pillAt(x,1320,420,"a person releases",tt,P.releases,null,{col:AG.green,size:34,icon:"tick"});
      ec_card(x,560,540,800,{kick:"Production",title:"nothing a person hasn't seen"},{a:ag_in(tt,P.seen,0.5),k:ag_spr(tt,P.seen),edge:AG.green});})}
  ],0.6);
  ag_title(ctx,S,t,c.breath,"Every change through review","an agent proposes, a person releases","FILM 6 OF 7 · FROM HELPER TO COLLEAGUE");});

/* ---------------------------------------------------------------- 2 · What the agent hands in */
scene("hands",(ctx,S,t,sc)=>{const c=sc.cues,P=ec_once(sc,"P",()=>({mon:wAt(sc,"ticket","On Monday"),first:wAt(sc,"ticket","its first day"),asked:wAt(sc,"ticket","Clara asked"),
    each:wAt(sc,"ticket","each unit's classes"),read:wAt(sc,"glossary","read the glossary"),size:wAt(sc,"glossary","A class size"),most:wAt(sc,"glossary","the most students"),
    school:wAt(sc,"glossary","set by the unit's school"),br:wAt(sc,"branch","its own branch"),schema:wAt(sc,"branch","development schema"),prod:wAt(sc,"branch","Production"),
    only:wAt(sc,"branch","only read"),tickets:wAt(sc,"stage","Planning's tickets"),map:wAt(sc,"stage","the map"),four:wAt(sc,"stage","stage four"),contrib:wAt(sc,"stage","a contributor"),
    wrote:wAt(sc,"tests","wrote two tests"),t1:wAt(sc,"tests","every student"),t2:wAt(sc,"tests","no class is planned"),
    what:wAt(sc,"says","what changed"),why:wAt(sc,"says","and why"),copies:wAt(sc,"says","copies the glossary"),ev:wAt(sc,"evidence","shows its evidence"),ba:wAt(sc,"evidence","before and after"),
    sure:wAt(sc,"unsure","wasn't sure"),n31:wAt(sc,"unsure","thirty-one units"),left:wAt(sc,"unsure","left them")}));
  const agentL=(x,tt,a)=>ec_theAgent(x,tt,Object.assign({},EC_AL,{badge:"planning agent"}),{a});
  ag_shots(ctx,S,t,sc.dur,[
    // on Monday, its first day, Clara asked for the change; the agent read the glossary first (later:true: the title leaves first)
    {later:true,at:0,place:"ecLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
      ec_theAgent(x,tt,EC_PLANNING,{think:0.3});ec_person(x,"clara",tt,{});ag_roomLight(x,1);ec_personCard(x,"clara",ag_in(tt,0.4,0.5));
      ec_card(x,1296,170,570,{kick:"Ticket · Monday",title:"Plan each unit's classes from its own class size",sub:"asked by Clara Jensen"},{a:ag_in(tt,P.asked,0.5),k:ag_spr(tt,P.asked),edge:AG.blue});
      ec_card(x,1296,450,570,{kick:"Glossary · read first",title:"Class size",sub:"The most students one class of a unit offering may hold, set by the unit's school."},
        {a:ag_in(tt,P.size,0.5),k:ag_spr(tt,P.size),edge:AG.blue});
      ec_pillL(x,1296,800,"owner · Mei Tanaka",tt,P.school+0.4,null,{col:AG.ink});
      ec_line(x,1236,470,1290,560,clamp((tt-P.read)/0.5,0,1),{col:AG.violet,dash:[10,8],lw:3});}},
    // its own branch and its own development schema; production, it can only read (later:true: Clara leaves; the agent comes back on
    // the left, with the room to itself)
    {later:true,at:c.branch,place:"ecLab",keys:[[c.branch,960,540,1]],push:0.02,draw:(x,tt)=>{agentL(x,tt,1);ag_roomLight(x,1);
      ag_label(x,600,200,"GitHub",{col:AG.kick,a:ag_in(tt,c.branch+0.2,0.5)});
      ec_branches(x,600,290,1220,{a:ag_in(tt,c.branch+0.3,0.5),br:(tt-P.br)/1.1});
      ag_label(x,600,580,"Databricks · development",{col:AG.kick,a:ag_in(tt,P.schema-0.3,0.5)});
      ec_schema(x,600,610,"planning_agent_marts",{a:ag_in(tt,P.schema,0.5),k:ag_spr(tt,P.schema),edge:AG.violet,col:AG.violet});
      const pa=ag_in(tt,P.prod,0.5);ag_label(x,1260,580,"Production",{col:AG.kick,a:pa});ec_schema(x,1280,640,"prod_marts",{a:pa});ag_glass(x,1250,600,560,150,{a:pa,label:null});
      ec_pillL(x,1260,800,"it can only read",tt,P.only,null,{col:AG.blue,icon:"lock"});}},
    // for Planning's tickets, the map puts it at stage four: a contributor that proposes (later:true: the agent leaves; the five
    // stages, the series' picture, come in across the room)
    {later:true,at:c.stage,place:"ecLab",keys:[[c.stage,960,540,1]],push:0.015,draw:(x,tt)=>{ag_roomLight(x,1);
      const lit=ag_in(tt,P.four,0.6);
      ec_stages(x,130,840,1660,{a:ag_in(tt,c.stage+0.2,0.5),k:[0,1,2,3,4].map(i=>ag_spr(tt,c.stage+0.3+i*0.12)),lit:[0,0,0,lit,0],dim:0.6*lit});
      ec_rows(x,130,170,620,{kick:"On the map · planning agent",rows:[{l:"Planning's tickets",r:"stage 4",rcol:AG.blue,rw:700,hl:ag_in(tt,P.four,0.5),a:ag_in(tt,P.tickets,0.4)},
        {l:"what a word means",r:"stage 1",a:ag_in(tt,P.tickets+0.5,0.4)}],a:ag_in(tt,P.map,0.5),k:ag_spr(tt,P.map)});}},
    // before the change, two tests (later:true: the stages leave; the agent comes back on the left)
    {later:true,at:c.tests,place:"ecLab",keys:[[c.tests,960,540,1]],push:0.02,draw:(x,tt)=>{agentL(x,tt,1);ag_roomLight(x,1);
      const out=ag_in(tt,c.says-0.3,0.5);
      withA(x,1-out,()=>{ag_label(x,600,200,"Before the change",{col:AG.kick,a:ag_in(tt,P.wrote-0.2,0.5)});
        ec_test(x,600,240,820,"Every student has a place in a class",{a:ag_in(tt,P.t1,0.5),k:ag_spr(tt,P.t1)});
        ec_test(x,600,440,820,"No class is planned that isn't needed",{a:ag_in(tt,P.t2,0.5),k:ag_spr(tt,P.t2)});});
      // its pull request: what changed and why, the glossary's words with their source, its evidence; and what it wasn't sure of
      const rows=[{text:"What changed: each unit's classes, from its class size",icon:"dot",col:AG.blue,a:ag_in(tt,P.what,0.4)},
        {text:"Why: Clara's ticket, Monday",icon:"dot",col:AG.blue,a:ag_in(tt,P.why,0.4)},
        {text:"Class size: the glossary's words, with their source",icon:"dot",col:AG.blue,a:ag_in(tt,P.copies,0.4)},
        {text:"Tests: two, written before the change",icon:"tick",col:AG.green,a:ag_in(tt,P.copies+0.8,0.4)},
        {text:"Evidence: the classes, 3,214 before and 3,477 after",icon:"clip",col:AG.orange,hl:ag_in(tt,P.ba,0.5),a:ag_in(tt,P.ev,0.4)},
        {text:"Not sure: 31 units have no class size, left at 25",icon:"warn",col:AG.amber,warn:ag_in(tt,P.n31,0.5),a:ag_in(tt,P.sure,0.4)}];
      ec_pr(x,600,170,1240,{title:EC_TITLE,who:"by planning-agent[bot] · from agent/planning/class-size",rows,a:out,k:ag_spr(tt,c.says-0.3)});}}
  ],0.6);
  ec_kick(ctx,S,ag_in(t,0.6,0.6));});   // once the title has gone

/* ---------------------------------------------------------------- 3 · What changed, and what it touches */
scene("checks",(ctx,S,t,sc)=>{const c=sc.cues,P=ec_once(sc,"P",()=>({whole:wAt(sc,"only","the whole project"),dbt:wAt(sc,"only","dbt builds"),changed:wAt(sc,"only","what changed"),
    depends:wAt(sc,"only","everything that depends"),plan:wAt(sc,"here","the class plan"),fac:wAt(sc,"here","the classes by faculty"),hiring:wAt(sc,"here","which hiring reads"),
    pass:wAt(sc,"here","Every test passes"),report:wAt(sc,"impact","The impact report"),added:wAt(sc,"impact","a column is added"),breaks:wAt(sc,"impact","nothing that reads"),tell:wAt(sc,"impact","who to tell"),
    same:wAt(sc,"diff","the same table"),abr:wAt(sc,"diff","the agent's branch"),main:wAt(sc,"diff","from main"),prodb:wAt(sc,"diff","which production"),cmp:wAt(sc,"diff","compared unit by unit"),
    noone:wAt(sc,"none","No unit"),col:wAt(sc,"none","One column is new"),ch:wAt(sc,"none","classes changed"),up:wAt(sc,"none","each one up"),more:wAt(sc,"none","two hundred and sixty-three"),
    data:wAt(sc,"sees","to the data"),code:wAt(sc,"sees","to the code")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the pull request's checks: dbt builds what changed, and everything that depends on it; here, the class plan and the classes by
    // faculty, which hiring reads; every test passes; the impact report: a column added, nothing breaks, and who to tell (later:true: the agent and
    // its pull request leave; the project's lineage comes in)
    {later:true,at:0,place:"ecLab",keys:[[0,960,540,1]],push:0.015,draw:(x,tt)=>{ag_roomLight(x,1);
      ag_label(x,150,200,"The pull request's checks",{col:AG.kick,a:ag_in(tt,0.3,0.5)});
      ec_dag(x,190,250,{a:ag_in(tt,0.4,0.6),grey:ag_in(tt,P.whole,0.6),changed:ag_in(tt,P.changed,0.5),down:ag_in(tt,P.depends,0.6),pass:ag_in(tt,P.pass,0.5)});
      ec_pillL(x,190,640,"the rest · not rebuilt",tt,P.whole+0.3,c.impact-0.3,{col:AG.mut});
      ec_mono(x,700,610,880,{kick:"dbt · on the pull request",logo:"dbt",lines:[{text:"dbt build --select state:modified+"}],a:ag_in(tt,P.dbt,0.5)*(1-ag_in(tt,c.impact-0.3,0.4)),k:ag_spr(tt,P.dbt)});
      ec_pillL(x,1360,520,"every test passes",tt,P.pass,null,{col:AG.green,icon:"tick"});
      ec_mono(x,700,610,1060,{kick:"Impact report",lines:[{text:"mart_planning__class_plan: column added, class_size",a:ag_in(tt,P.added,0.4)},
        {text:"contract: additive · nothing that reads it breaks",col:AG.green,a:ag_in(tt,P.breaks,0.4)},
        {text:"who to tell: Clara Jensen, Planning; The faculties",col:AG.blue,a:ag_in(tt,P.tell,0.4)}],a:ag_in(tt,P.report,0.5),k:ag_spr(tt,P.report)});}},
    // then the diff: the same table from the agent's branch and from main, which production is built from, compared unit by unit
    // (later:true: the lineage leaves; the two tables come in)
    {later:true,at:c.diff,place:"ecLab",keys:[[c.diff,960,540,1]],push:0.015,draw:(x,tt)=>{ag_roomLight(x,1);
      const out=ag_in(tt,c.sees-0.3,0.5),R1=[["DA501",5],["HI205",8],["ED220",5],["BA510",3]],R2=[["DA501",5],["HI205",5],["ED220",4],["BA510",3]];
      withA(x,1-out,()=>{ag_label(x,150,160,"The same table, unit by unit",{col:AG.kick,a:ag_in(tt,P.same,0.5)});
        const L=ec_side(x,150,180,620,"agent/planning/class-size","the agent's branch",R1,{col:AG.violet,hl:[0,1,1,0],cmp:ag_in(tt,P.ch,0.5),a:ag_in(tt,P.same,0.5),k:ag_spr(tt,P.same)});
        const M=ec_side(x,1150,180,620,"main","production is built from it",R2,{a:ag_in(tt,P.main,0.5),k:ag_spr(tt,P.main)});
        // compared unit by unit: a line from each row to its row
        R1.forEach((r,i)=>ec_line(x,782,L.rowY(i),1138,M.rowY(i),clamp((tt-P.cmp-i*0.2)/0.5,0,1),{col:i===1||i===2?AG.green:AG.mut,dash:[8,8],head:false,lw:2.4}));
        ec_pillAt(x,960,230,"classes",tt,P.cmp,null,{col:AG.mut});});
      // what the diff says: no unit in only one of them, one column new, classes changed in 161 units, each one up, 263 more
      ec_mono(x,150,590,1620,{kick:"The diff",lines:[{text:"mart_planning__class_plan, by unit_offering_key",a:ag_in(tt,c.none-0.2,0.4)},
          {text:"keys only in this branch: 0     keys only in main: 0",indent:28,a:ag_in(tt,P.noone,0.4)},{text:"class_size: new in this branch",indent:28,a:ag_in(tt,P.col,0.4)},
          {text:"classes: 161 rows changed",indent:28,col:AG.green,hl:ag_in(tt,P.up,0.5),a:ag_in(tt,P.ch,0.4)}],a:ag_in(tt,c.none-0.3,0.5)*(1-out)+out,k:ag_spr(tt,c.none-0.3)});
      ec_pillL(x,1300,825,"each one up · 263 more",tt,P.up+0.2,c.sees-0.3,{col:AG.green,icon:"tick"});
      // so a reviewer sees what it does to the data, not only to the code
      ec_card(x,150,250,900,{kick:"A reviewer sees",title:"what it does to the data",sub:"not only to the code"},{a:ag_in(tt,P.data-0.3,0.5),k:ag_spr(tt,P.data-0.3),edge:AG.orange});}}
  ],0.6);
  ec_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 4 · An agent's review, for reference */
scene("review",(ctx,S,t,sc)=>{const c=sc.cues,P=ec_once(sc,"P",()=>({sec:wAt(sc,"second","a second agent"),reads:wAt(sc,"second","reads the pull request"),gra:wAt(sc,"second","the governance review agent"),
    yusuf:wAt(sc,"second","Yusuf's"),name:wAt(sc,"second","a name of its own"),rules:wAt(sc,"rules","governance's rules"),owner:wAt(sc,"rules","an owner"),words:wAt(sc,"rules","words from the glossary"),
    test:wAt(sc,"rules","a test for each rule"),impact:wAt(sc,"rules","the impact named"),thing:wAt(sc,"missing","One thing"),n31:wAt(sc,"missing","thirty-one units"),stay:wAt(sc,"missing","stay at"),
    told:wAt(sc,"missing","nobody is told"),school:wAt(sc,"suggests","Each unit's school"),warn:wAt(sc,"suggests","a warning every night"),lists:wAt(sc,"suggests","lists them"),
    notf:wAt(sc,"suggests","not a failing check"),decides:wAt(sc,"who","who decides"),posts:wAt(sc,"who","posts its review"),comment:wAt(sc,"who","as a comment"),
    capp:wAt(sc,"comment","never approves"),cblock:wAt(sc,"comment","never blocks"),ref:wAt(sc,"comment","only for reference"),yes:wAt(sc,"yusuf","yes"),adds:wAt(sc,"yusuf","adds the warning"),
    push:wAt(sc,"yusuf","a second push"),two:wAt(sc,"together","Two agents"),through:wAt(sc,"together","only through the pull request"),person:wAt(sc,"together","a person decided")}));
  const RX=1290,RW=570;
  ag_shots(ctx,S,t,sc.dur,[
    // a second agent reads the pull request: the governance review agent, Yusuf's, with a name of its own; it checks governance's
    // rules, finds what has no check, suggests a warning, says who decides (data governance, where a change and the glossary differ),
    // and posts its review as a comment, only for reference; Yusuf decides: yes, and the planning agent adds the warning, in a second
    // push. Yusuf and the review agent stay put while the cards on the right change, one leaving before the next comes in (later:true: the diff
    // leaves; Yusuf and the review agent come in)
    {later:true,at:0,place:"ecLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
      ec_theAgent(x,tt,Object.assign({},EC_RV,EC_REVIEWER,{bk:(tt-P.gra)/0.9,tk:(tt-P.yusuf)/0.8}),{think:0.4,a:ag_in(tt,P.sec-0.2,0.6)});
      ec_person(x,"yusuf",tt,{});ag_roomLight(x,1);ec_personCard(x,"yusuf",ag_in(tt,0.4,0.5));
      const p1=1-ag_in(tt,c.rules-0.3,0.4);
      ec_pr(x,RX,170,RW,{title:EC_TITLE,who:"by planning-agent[bot]",a:ag_in(tt,P.reads-0.2,0.5)*p1,k:ag_spr(tt,P.reads-0.2)});
      ec_pillL(x,RX,560,"governance-review-agent[bot]",tt,P.name,c.rules-0.3,{col:AG.violet});
      // governance's rules, each ticked; then the one thing with no check
      const r2=1-ag_in(tt,c.suggests-0.3,0.4);
      ec_rows(x,RX,150,RW,{kick:"Governance's rules",rows:[{l:"an owner",tick:ag_in(tt,P.owner,0.3),a:ag_in(tt,P.owner-0.2,0.3)},
          {l:"words from the glossary",tick:ag_in(tt,P.words,0.3),a:ag_in(tt,P.words-0.2,0.3)},{l:"each with its source",tick:ag_in(tt,P.words+0.6,0.3),a:ag_in(tt,P.words+0.4,0.3)},
          {l:"a test for each rule",tick:ag_in(tt,P.test,0.3),a:ag_in(tt,P.test-0.2,0.3)},{l:"the impact, named",tick:ag_in(tt,P.impact,0.3),a:ag_in(tt,P.impact-0.2,0.3)},
          {l:"31 units with no class size",icon:"warn",iconCol:AG.amber,lcol:AG.amber,warn:ag_in(tt,P.n31,0.4),a:ag_in(tt,P.thing,0.4)}],
        a:ag_in(tt,c.rules-0.1,0.5)*r2,k:ag_spr(tt,c.rules-0.1)});
      ec_pillL(x,RX,650,"stay at 25",tt,P.stay,c.suggests-0.3,{col:AG.amber});ec_pillL(x,RX+240,650,"nobody is told",tt,P.told,c.suggests-0.3,{col:AG.amber,icon:"warn"});
      // its suggestion: a warning every night that lists them for the faculties, not a failing check; who decides; posted as a comment
      const r3=ag_in(tt,c.suggests,0.5)*(1-ag_in(tt,c.comment-0.3,0.4));
      ec_card(x,RX,150,RW,{kick:"It suggests",title:"a warning, every night",sub:"that lists the 31 units for the faculties"},{a:r3,k:ag_spr(tt,c.suggests),edge:AG.violet,kickCol:AG.violet});
      ec_pillL(x,RX,440,"each unit's school sets one",tt,Math.max(P.school,c.suggests+0.2),c.comment-0.3,{col:AG.ink});
      ec_pillL(x,RX,520,"not a failing check",tt,P.notf,c.comment-0.3,{col:AG.mut});
      ec_card(x,RX,572,RW,{kick:"Who decides",title:"Data governance",sub:"the change and the glossary differ"},{a:ag_in(tt,P.decides,0.5)*(1-ag_in(tt,c.comment-0.3,0.4)),k:ag_spr(tt,P.decides),edge:AG.green});
      ec_pillL(x,RX,790,"posted as a comment",tt,P.comment,c.comment-0.3,{col:AG.violet});
      // its review on GitHub: a comment; by its rules it never approves and never blocks; for reference only
      const r4=1-ag_in(tt,c.yusuf-0.3,0.4);
      ec_rows(x,RX,150,RW,{kick:"Its review, on GitHub",logo:"github",rows:[{l:"Comment",lw:700,icon:"comment",iconCol:AG.violet,hl:1,col:AG.violet},
          {l:"Approve",cross:ag_in(tt,P.capp,0.4),a:ag_in(tt,P.capp-0.3,0.4)},{l:"Request changes",r:"to block",cross:ag_in(tt,P.cblock,0.4),a:ag_in(tt,P.cblock-0.3,0.4)}],
        a:ag_in(tt,c.comment,0.5)*r4,k:ag_spr(tt,c.comment)});
      ec_pillL(x,RX,500,"only for reference",tt,P.ref,c.yusuf-0.3,{col:AG.violet});
      // Yusuf decides: yes; the planning agent adds the warning, in a second push: its pull request, with its two pushes
      ec_card(x,RX,150,RW,{kick:"Yusuf decides",title:"yes"},{a:ag_in(tt,P.yes,0.5),k:ag_spr(tt,P.yes),edge:AG.green,icon:"tick"});
      ec_pr(x,RX,350,RW,{title:EC_TITLE,who:"by planning-agent[bot]",rows:[{text:"First push: the change",icon:"push",col:AG.violet,a:ag_in(tt,P.adds-0.4,0.4)},
          {text:"Second push: the warning",icon:"push",col:AG.violet,hl:ag_in(tt,P.push,0.5),a:ag_in(tt,P.adds,0.4)}],a:ag_in(tt,P.adds-0.6,0.5),k:ag_spr(tt,P.adds-0.6)});}},
    // two agents worked together only through the pull request, and a person decided between them (later:true: Yusuf and the review agent
    // leave; then the two agents, one at either side, and the pull request between them)
    {later:true,at:c.together,place:"ecLab",keys:[[c.together,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1,()=>{
      ec_theAgent(x,tt,Object.assign({},EC_LA,{badge:"planning agent"}),{think:0.3,key:"L"});
      ec_theAgent(x,tt,Object.assign({},EC_RA,{badge:"governance review agent"}),{think:0.3,key:"R"});ag_roomLight(x,1);
      const pr=ec_pr(x,600,260,720,{title:EC_TITLE,who:"by planning-agent[bot]",a:ag_in(tt,P.through-0.3,0.5),k:ag_spr(tt,P.through-0.3)});
      ec_line(x,EC_LA.x+EC_LA.R+14,EC_LA.y,592,360,clamp((tt-P.through)/0.6,0,1),{col:AG.violet,dash:[10,8],lw:3});
      ec_line(x,EC_RA.x-EC_RA.R-14,EC_RA.y,1328,360,clamp((tt-P.through-0.3)/0.6,0,1),{col:AG.violet,dash:[10,8],lw:3});
      ec_pillAt(x,960,pr.y+pr.h+70,"a person decides · Yusuf Demir",tt,P.person,null,{col:AG.green,icon:"tick"});})}
  ],0.6);
  ec_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 5 · Who approves, from the map */
scene("rules",(ctx,S,t,sc)=>{const c=sc.cues,P=ec_once(sc,"P",()=>({who:wAt(sc,"map","Who approves"),onmap:wAt(sc,"map","on the map"),after:wAt(sc,"map","After a pull request"),
    persons:wAt(sc,"map","a person's"),ae:wAt(sc,"steps","The analytics engineer"),ra:wAt(sc,"steps","The release approver"),rel:wAt(sc,"steps","releases it"),
    owners:wAt(sc,"word","Owners don't review"),word:wAt(sc,"word","What a word means"),gloss:wAt(sc,"word","in the glossary"),pc:wAt(sc,"none","The planning contributor's steps"),
    end:wAt(sc,"none","end at the pull request"),holds:wAt(sc,"none","holds none"),gh:wAt(sc,"written","In GitHub"),teams:wAt(sc,"written","the teams that approve"),
    from:wAt(sc,"written","written from those roles"),takes:wAt(sc,"written","takes over a role"),follow:wAt(sc,"written","the approvals follow"),rmain:wAt(sc,"main","the rules on main"),every:wAt(sc,"main","for everyone"),
    skip:wAt(sc,"main","nobody can skip"),admin:wAt(sc,"main","not even an administrator"),op:wAt(sc,"person","a person"),team:wAt(sc,"person","a team of people"),
    agent:wAt(sc,"person","An agent can't"),never:wAt(sc,"person","never counts"),ownpr:wAt(sc,"own","their own pull request"),latest:wAt(sc,"own","the latest push"),
    didnt:wAt(sc,"own","didn't push it"),second:wAt(sc,"again","the second push"),jun:wAt(sc,"again","Jun approves"),clara:wAt(sc,"again","Clara"),
    fac:wAt(sc,"again","the faculties"),told:wAt(sc,"again","are told")}));
  ag_shots(ctx,S,t,sc.dur,[
    // who approves is on the map: after a pull request every step is a person's, each by its role: the analytics engineer reviews the
    // code, the release approver approves the change and releases it; owners don't review pull requests, and what a word means its owner
    // decides first, in the glossary; the planning contributor's steps end at the pull request, so the agent holds none of the others
    // (later:true: the two agents and their pull request leave; the map's steps come in)
    {later:true,at:0,place:"ecLab",keys:[[0,960,540,1]],push:0.015,draw:(x,tt)=>{ag_roomLight(x,1);
      ec_steps(x,210,150,1500,{a:ag_in(tt,P.onmap-0.3,0.5),k:ag_spr(tt,P.onmap-0.3),lit:[0,ag_io(tt,P.pc,c.written,0.4),ag_io(tt,P.pc+0.2,c.written,0.4),ag_io(tt,P.pc+0.4,c.written,0.4),
          ag_in(tt,P.ae,0.4),ag_in(tt,P.ra,0.4),ag_in(tt,P.rel,0.4)],people:ag_in(tt,P.persons,0.5),agent:ag_in(tt,P.end,0.5),none:ag_in(tt,P.holds,0.5)});
      // owners don't review pull requests; what a word means, its owner decides first, in the glossary: two pills, laid out from their size
      const o1="owners don't review pull requests",o2="what a word means · the glossary, first",w1=ec_pillW(x,o1),w2=ec_pillW(x,o2),ox=960-(w1+40+w2)/2;
      ec_pillAt(x,ox+w1/2,790,o1,tt,P.owners,null,{col:AG.ink});ec_pillAt(x,ox+w1+40+w2/2,790,o2,tt,P.gloss,null,{col:AG.blue});}},
    // in GitHub, the teams that approve are written from those roles; when someone takes over a role, the approvals follow (no team for
    // an owner: owners don't review pull requests) (later:true: the steps leave; the map's roles and GitHub's teams come in)
    {later:true,at:c.written,place:"ecLab",keys:[[c.written,960,540,1]],push:0.015,draw:(x,tt)=>{ag_roomLight(x,1);
      ec_rows(x,130,250,700,{kick:"On the map · roles",rows:[{l:"release approver",r:"Noor Rahman",hl:ag_io(tt,P.takes,P.takes+2.4,0.4)},{l:"data governance lead",r:"Yusuf Demir"},
        {l:"data custodian",r:"the platform team"}],a:ag_in(tt,c.written+0.2,0.5),k:ag_spr(tt,c.written+0.2)});
      ec_line(x,850,400,1010,400,clamp((tt-P.from)/0.6,0,1),{col:AG.blue,lw:3.4});ec_pillAt(x,930,350,"written from",tt,P.from,null,{col:AG.blue});
      ec_rows(x,1030,250,760,{kick:"GitHub · teams",logo:"github",rows:[{l:"release-approvers",mono:true,r:"Noor Rahman",hl:ag_io(tt,P.takes+0.4,P.takes+2.8,0.4)},
        {l:"data-governance-leads",mono:true,r:"Yusuf Demir"},{l:"data-custodians",mono:true,r:"the platform team"}],a:ag_in(tt,P.teams,0.5),k:ag_spr(tt,P.teams)});
      ec_pillL(x,130,620,"someone new in a role",tt,P.takes,null,{col:AG.blue});ec_pillL(x,130,700,"the approvals follow",tt,P.follow,null,{col:AG.green,icon:"tick"});}},
    // the rules on main hold for everyone, not even an administrator skips them; a reviewer is a person or a team of people, so an
    // agent's approval never counts; nobody approves their own pull request, and the latest push is approved by someone who didn't push
    // it (later:true: the roles and teams leave; the rules on main come in)
    {later:true,at:c.main,place:"ecLab",keys:[[c.main,960,540,1]],push:0.015,draw:(x,tt)=>{ag_roomLight(x,1);
      ec_rows(x,130,240,760,{kick:"GitHub · the rules on main",logo:"github",rows:[{l:"every change as a pull request",tick:1},{l:"the data team approves the code",tick:1},
        {l:"the checks pass",tick:1},{l:"who may skip them",r:"nobody",rcol:AG.blue,rw:700,hl:ag_in(tt,P.skip,0.5)}],a:ag_in(tt,P.rmain,0.5),k:ag_spr(tt,P.rmain)});
      ec_pillL(x,130,630,"not even an administrator",tt,P.admin,null,{col:AG.blue,icon:"lock"});
      const r2=1-ag_in(tt,c.own-0.3,0.4);
      ec_rows(x,1000,240,780,{kick:"A reviewer is",rows:[{l:"a person",tick:ag_in(tt,P.op,0.3),a:ag_in(tt,P.op-0.2,0.3)},{l:"or a team of people",tick:ag_in(tt,P.team,0.3),a:ag_in(tt,P.team-0.2,0.3)},
          {l:"an agent",cross:ag_in(tt,P.agent+0.4,0.4),crossCol:AG.amber,a:ag_in(tt,P.agent,0.3)}],a:ag_in(tt,c.person,0.5)*r2,k:ag_spr(tt,c.person)});
      ec_pillL(x,1000,570,"its approval never counts",tt,P.never,c.own-0.3,{col:AG.mut});
      ec_rows(x,1000,240,780,{kick:"Approving",rows:[{l:"your own pull request",r:"nobody may",cross:ag_in(tt,P.ownpr+0.3,0.4),a:ag_in(tt,P.ownpr-0.2,0.3)},
          {l:"the latest push",r:"someone who didn't push it",tick:ag_in(tt,P.didnt,0.4),a:ag_in(tt,P.latest,0.3)}],a:ag_in(tt,c.own-0.1,0.5),k:ag_spr(tt,c.own-0.1)});}},
    // so after the second push, Jun approves the code again, and Clara and the faculties are told what it touches, from the impact
    // report (later:true)
    {later:true,at:c.again,place:"ecLab",keys:[[c.again,960,540,1]],push:0.02,draw:(x,tt)=>{ag_roomLight(x,1);
      ec_pr(x,460,200,1000,{title:EC_TITLE,who:"by planning-agent[bot] · second push",a:ag_in(tt,P.second-0.2,0.5),k:ag_spr(tt,P.second-0.2)});
      ec_rows(x,460,440,1000,{kick:"Approved",rows:[{l:"Jun Park",lw:700,r:"the code",tick:ag_in(tt,P.jun+0.3,0.4),a:ag_in(tt,P.jun,0.4)}],
        edge:AG.green,a:ag_in(tt,P.jun-0.3,0.5),k:ag_spr(tt,P.jun-0.3)});
      ec_rows(x,460,620,1000,{kick:"Told what it touches",rows:[{l:"Clara Jensen",lw:700,r:"the class plan",icon:"comment",iconCol:AG.blue,a:ag_in(tt,P.clara,0.4)},
          {l:"The faculties",lw:700,r:"their tutor hiring",icon:"comment",iconCol:AG.blue,a:ag_in(tt,P.fac,0.4)}],a:ag_in(tt,P.clara-0.3,0.5),k:ag_spr(tt,P.clara-0.3)});}}
  ],0.6);
  ec_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 6 · A person releases */
scene("release",(ctx,S,t,sc)=>{const c=sc.cues,P=ec_once(sc,"P",()=>({appr:wAt(sc,"merge","the code approved"),into:wAt(sc,"merge","goes into main"),jm:wAt(sc,"merge","Jun merges it"),
    dont:wAt(sc,"merge","the agents don't merge"),isnt:wAt(sc,"merge","merging isn't the release"),night:wAt(sc,"night","That night"),builds:wAt(sc,"night","builds main in test"),
    only:wAt(sc,"night","Only if test passes"),goes:wAt(sc,"night","go on to production"),waits:wAt(sc,"waits","it waits"),env:wAt(sc,"waits","an environment called production"),
    until:wAt(sc,"waits","until a release approver"),wed:wAt(sc,"noor","On Wednesday morning"),na:wAt(sc,"noor","Noor approves"),whoever:wAt(sc,"noor","Whoever starts"),
    even:wAt(sc,"noor","even an approver"),then:wAt(sc,"signs","Only then"),dbx:wAt(sc,"signs","sign in to Databricks"),sp:wAt(sc,"signs","its own service principal"),
    nosec:wAt(sc,"signs","no secret to steal"),deploys:wAt(sc,"bundle","deploys the project"),bun:wAt(sc,"bundle","as a bundle"),runs:wAt(sc,"bundle","runs the build"),
    ident:wAt(sc,"reads","own identity"),ronly:wAt(sc,"reads","only reads production"),writing:wAt(sc,"reads","Writing there"),job:wAt(sc,"reads","the release's job"),yes:wAt(sc,"reads","a person's yes")}));
  ag_shots(ctx,S,t,sc.dur,[
    // with the code approved, the change goes into main: Jun merges it, the agents don't; and merging isn't the release (later:true: the approvals
    // leave; Jun and the branches come in)
    {later:true,at:0,place:"ecLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
      ec_person(x,"jun",tt,{});ag_roomLight(x,1);ec_personCard(x,"jun",ag_in(tt,0.4,0.5));
      ec_branches(x,560,300,1260,{a:ag_in(tt,0.5,0.5),br:1,push2:1,pr:1,merge:(tt-P.into)/1.0});
      ec_pillL(x,560,620,"Jun merges it",tt,P.jm,null,{col:AG.green,icon:"tick"});ec_pillL(x,880,620,"the agents don't merge",tt,P.dont,null,{col:AG.ink});
      ec_card(x,560,690,640,{kick:"And",title:"merging isn't the release"},{a:ag_in(tt,P.isnt,0.5),k:ag_spr(tt,P.isnt),edge:AG.blue});}},
    // that night the release builds main in test; only if test passes does it go on to production, where it waits, at the environment
    // production, for a release approver; on Wednesday morning Noor approves the change (whoever starts a release can't approve it); only then
    // can the release sign in to Databricks, as its own service principal, with no secret; it deploys the bundle and runs the build
    // (later:true: Jun and the branches leave; the release's card comes in on the right, and later Noor at the left)
    {later:true,at:c.night,place:"ecLab",keys:[[c.night,960,540,1]],push:0.015,draw:(x,tt)=>{
      const na=ag_in(tt,c.noor-0.1,0.7);ec_person(x,"noor",tt,{a:na});ag_roomLight(x,1);ec_personCard(x,"noor",ag_in(tt,c.noor+0.4,0.5));
      const ja=1-ag_in(tt,c.signs-0.3,0.4);
      const J=ec_job(x,560,250,1280,{a:ag_in(tt,c.night+0.2,0.5)*ja,k:ag_spr(tt,c.night+0.2),test:clamp((tt-P.builds)/(P.only+0.4-P.builds),0,1),go:clamp((tt-P.goes)/0.6,0,1),
        wait:ag_in(tt,P.waits,0.4),ok:ag_in(tt,P.na+0.2,0.5)});
      ec_when(x,1840,170,"Tuesday · 23:00","Wednesday · morning",clamp((tt-P.wed)/0.8,0,1),ag_in(tt,P.night,0.5)*ja);
      ec_pillL(x,J.prod.x,700,"waiting for a release approver",tt,P.until,P.na,{col:AG.amber});
      ec_pillL(x,J.prod.x,700,"approved · Noor Rahman",tt,P.na+0.4,c.signs-0.3,{col:AG.green,icon:"tick"});
      ec_pillL(x,560,780,"whoever starts it can't approve it",tt,P.whoever,c.signs-0.3,{col:AG.blue,icon:"lock"});
      // the release signs in to Databricks, as its own service principal, with no secret; then the bundle
      ec_pass(x,560,250,620,{kick:"The release signs in",logo:"databricks",title:"to Databricks",rows:[["as","release",ag_in(tt,P.sp-0.4,0.4),0,true],
          ["what it is","a service principal",ag_in(tt,P.sp,0.4)],["from","the environment production",ag_in(tt,P.sp+0.6,0.4)],["its secret","none",ag_in(tt,P.nosec,0.4),ag_in(tt,P.nosec,0.4)]],
        a:ag_in(tt,P.dbx-0.2,0.5),k:ag_spr(tt,P.dbx-0.2)});
      ec_rows(x,1240,250,600,{kick:"The bundle",logo:"databricks",rows:[{l:"deploy the project",tick:ag_in(tt,P.bun+0.3,0.4),a:ag_in(tt,P.deploys,0.4)},
          {l:"run the build",r:"production",tick:ag_in(tt,P.runs+0.6,0.4),a:ag_in(tt,P.runs,0.4)}],a:ag_in(tt,P.deploys-0.3,0.5),k:ag_spr(tt,P.deploys-0.3)});}},
    // the planning agent's own identity only reads production; writing there is the release's job, after a person's yes (later:true:
    // Noor and the release leave; the planning agent comes in on the left)
    {later:true,at:c.reads,place:"ecLab",keys:[[c.reads,960,540,1]],push:0.02,draw:(x,tt)=>{
      ec_theAgent(x,tt,Object.assign({},EC_AL,{badge:"planning agent"}),{});ag_roomLight(x,1);
      const pa=ag_in(tt,P.ronly-0.3,0.5);ag_label(x,700,280,"Production",{col:AG.kick,a:pa});ec_schema(x,720,340,"prod_marts",{a:pa});ag_glass(x,680,300,720,150,{a:pa,label:null});
      ec_pillL(x,700,530,"the planning agent · reads only",tt,P.ronly,null,{col:AG.blue,icon:"lock"});
      ec_pillL(x,700,630,"the release · writes",tt,P.job,null,{col:AG.green});ec_pillL(x,1040,630,"after a person's yes",tt,P.yes,null,{col:AG.green,icon:"tick"});}}
  ],0.6);
  ec_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 7 · An agent proposes, a person releases */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=ec_once(sc,"P",()=>({since:wAt(sc,"faculties","Since Wednesday"),fac:wAt(sc,"faculties","the faculties"),plan:wAt(sc,"faculties","their plan"),n263:wAt(sc,"faculties","two hundred"),
    place:wAt(sc,"faculties","a place for every student"),list:wAt(sc,"faculties","a list of the thirty-one"),same:wAt(sc,"path","the same path"),e:wAt(sc,"path","evidence"),
    ch:wAt(sc,"path","checks"),d:wAt(sc,"path","a diff"),r:wAt(sc,"path","a review"),ap:wAt(sc,"roles","approval"),rel:wAt(sc,"roles","a second person's release"),
    ag:wAt(sc,"both","For agents"),pp:wAt(sc,"both","for people"),prop:wAt(sc,"lesson","An agent proposes"),rel2:wAt(sc,"lesson","A person releases")}));
  ag_shots(ctx,S,t,sc.dur,[
    // since Wednesday the faculties have their plan: 263 more classes, a place for every student, and a list of the 31 units still to
    // set (later:true: the agent leaves; the plan comes in)
    {later:true,at:0,place:"ecLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{ag_roomLight(x,1);
      ec_corner(x,"Since Wednesday",ag_in(tt,P.since,0.5));
      ec_plan(x,120,170,860,{a:ag_in(tt,P.fac-0.1,0.5),k:ag_spr(tt,P.fac-0.1),sub:"2027 Semester 1 · 1,236 units",own:1,after:1,more:1});
      ec_faculties(x,120,720,{a:ag_in(tt,P.fac+0.3,0.4),k:EC_FACULTIES.map((f,i)=>ag_spr(tt,P.fac+0.3+i*0.15))});
      ec_big(x,1080,200,640,"263","more classes",{a:ag_in(tt,P.n263,0.5),k:ag_spr(tt,P.n263)});
      ec_pillL(x,1080,450,"a place for every student",tt,P.place,null,{col:AG.green,icon:"tick"});
      ec_card(x,1080,520,640,{kick:"Still to set",title:"31 units",sub:"a list for the faculties, every night"},{a:ag_in(tt,P.list,0.5),k:ag_spr(tt,P.list),edge:AG.amber,kickCol:AG.amber});}},
    // every change takes the same path; for agents, as for people (later:true: the plan leaves; the path comes in)
    {later:true,at:c.path,place:"ecLab",keys:[[c.path,960,540,1]],push:0.015,draw:(x,tt)=>{ag_roomLight(x,1);
      const L=[P.e,P.ch,P.d,P.r,P.ap,P.rel];
      ag_label(x,960,200,"Every change, the same path",{align:"center",col:AG.kick,a:ag_in(tt,c.path+0.1,0.5)});
      ec_path(x,150,250,1620,{a:ag_in(tt,c.path+0.2,0.4),k:L.map(t0=>ag_spr(tt,c.path+0.3)),lit:L.map(t0=>ag_in(tt,t0,0.5)),done:L.map(t0=>ag_in(tt,t0+0.4,0.4)),
        chip:L.reduce((s,t0,i)=>s+(i?ag_sine(clamp((tt-t0+0.6)/0.8,0,1)):0),0),chipA:ag_in(tt,P.e,0.4)});
      ec_pillAt(x,700,660,"for agents",tt,P.ag,null,{col:AG.violet,size:34});ec_pillAt(x,1220,660,"as for people",tt,P.pp,null,{col:AG.green,size:34});}},
    // an agent proposes; a person releases (later:true; it all leaves before the end card's words come)
    {later:true,at:c.lesson,place:"ecLab",keys:[[c.lesson,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.45),()=>{ag_roomLight(x,1);
      ag_T(x,"An agent proposes.",960,420,{w:800,size:64,align:"center",col:AG.violet,a:ag_in(tt,P.prop,0.5)});
      ag_T(x,"A person releases.",960,530,{w:800,size:64,align:"center",col:AG.green,a:ag_in(tt,P.rel2,0.5)});})}
  ],0.6);
  ec_kick(ctx,S,(1-ag_io(t,0.1,c.path-0.3,0.45))*(1-ag_in(t,c.breath,0.9)));
  ag_end(ctx,S,t,c.breath,"Every change through review","An agent proposes. A person releases.","Film 6 of 7","From helper to colleague");});

// every chapter after the opening opens in the room the one before ends in: its camera glides on from there, and the end of the last
// one is drawn through it (a chapter whose first shot is a later moment lets that end leave first)
ag_cutInto(["hands","checks","review","rules","release","close"]);
