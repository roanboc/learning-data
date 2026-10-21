/* ===== An agent that checks: the eight chapters =====
   Each chapter is a few shots in the places of plan.js and the series' rooms.js, cut together with short dissolves (gv_shots). Times
   inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if
   it's recorded again. Words on screen are on screens, papers, cards, boards and tags, at least 28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const ac_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// someone behind a desk getting up (u, 0 sitting to 1 standing), the desk's top cutting them off; then, if w (gv_walk) is given, walking
function ac_rise(ctx,id,x,cutY,s,u,w,o){ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cutY+H);ctx.clip();const y=cutY+lerp(GV_SIT,GV_STAND,easeCam(clamp(u,0,1)))*s;
  if(w)gv_walker(ctx,id,w,y,s,o);else person(ctx,id,x,y,s,o);ctx.restore();}
// a nod: the head dips twice, from t0
const ac_nod=(t,t0)=>0.07*Math.sin((t-t0)*9)*gv_io(t,t0,t0+0.75,0.15);

// ---- 1 · A night, imagined: a change at dusk, the agent's comment at three, a person's decision at eight ----
scene("night",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{fac:c.adds-0.6,anil:w("adds","Anil"),col:w("adds","adds a column"),dob:w("adds","date of birth"),night:c.three-0.5,
      scr:w("three","reads")-0.4,reads:w("three","reads"),rules:w("three","written rules",0.6),q:w("nothing","Nothing")-0.1,appr:w("comment","approve it"),
      leaves:w("comment","It leaves"),line:w("comment","the line"),rule:w("comment","the rule"),fix:w("comment","a fix"),
      morn:c.eight-0.5,agrees:w("eight","agrees"),marks:w("eight","marks"),pd:w("eight","personal data"),
      shows:c.shows-0.5,tg:[w("shows","rules written"),w("shows","applied by"),w("shows","a person")],br:c.breath-0.2,title:c.breath+1.4};});
  const [fx,fy,fw,fh]=GV_FX.screen,seat=GV_FX.seat,
    // reading the change, row by row: a pause on each, then on to the next
    row=tt=>{const u=clamp((tt-P.reads)/(P.rules-P.reads),0,1),k=Math.floor(u*4.999),f=u*4.999-k;return Math.min(4,k+easeCam(clamp((f-0.4)*1.8,0,1)));};
  gv_shots(ctx,S,t,sc.dur,[
    // the campus at dusk: the lamps come on; the old building's windows are warm
    {at:0,place:"dusk",keys:[[0,960,540,1],[0.3,620,560,1.22]],d:5.2,draw:(x,tt)=>ac_lamps(x,fin(tt,1.0,1.4))},
    // the faculty's office, at the desk: Anil adds the column, opens the change, and goes home; the screen sleeps
    {at:P.fac,place:"facDusk",keys:[[P.fac,900,540,1.16],[P.fac+0.1,930,530,1.22]],d:6,draw:(x,tt)=>{const go=P.dob+1.25,wk=gv_walk(tt,go,seat[0],2300,700);
      ac_rise(x,"anil",seat[0],GV_FX.top,seat[1],fin(tt,P.dob+0.7,0.6),tt>=go?wk:null,
        tt>=go?{t:tt}:{pose:"listen",pose2:"write",mix:gv_io(tt,P.col-0.3,P.dob+0.5,0.3),flip:true,t:tt});
      ac_facDesk(x,"dusk");ac_smallChange(x,tt,{typed:clamp((tt-P.col)/1.6,0,1),sent:clamp((tt-P.dob-0.15)/0.5,0,1),dim:fin(tt,P.dob+1.5,0.6)});}},
    // the campus at three in the morning: the lamps, the clock, and one window lit by a screen
    {at:P.night,place:"night",keys:[[P.night,760,560,1.12],[P.night+0.1,330,590,2.1]],d:2.1},
    // the screen, close, in the dark office: the agent reads the change against the rules, row by row; nothing says what the new
    // column is; it changes nothing, approves nothing, and leaves a comment
    {at:P.scr,place:"screenNight",keys:[[P.scr,960,540,1]],push:0.02,draw:(x,tt)=>{
      ac_change(x,tt,{read:row(tt),readA:fin(tt,P.scr+0.3,0.4)*(1-fin(tt,P.leaves-0.3,0.4)),q:fin(tt,P.q,0.6),btn:0.9*gv_io(tt,P.appr-0.5,P.leaves,0.4)});
      const a=fin(tt,P.leaves-0.1,0.4);ac_comment(x,tt,a,0.9+0.1*spring(fin(tt,P.leaves-0.1,0.5)),[fin(tt,P.line-0.1,0.4),fin(tt,P.rule-0.1,0.4),fin(tt,P.fix-0.1,0.4)],0);}},
    // eight in the morning: Anil reads the comment, and nods
    {at:P.morn,place:"facMorning",keys:[[P.morn,900,540,1.16],[P.morn+0.1,920,530,1.2]],d:4,draw:(x,tt)=>{
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",flip:true,t:tt,nod:ac_nod(tt,P.agrees)});
      ac_facDesk(x,"morning");ac_farScreen(x,fx,fy,fw,fh,tt,{cm:1,ok:0});}},
    // the screen: he marks the column, in gold, and the check passes
    {at:P.marks-0.4,place:"screenMorning",keys:[[P.marks-0.4,960,540,1]],push:0.02,draw:(x,tt)=>{
      ac_change(x,tt,{q:1,cls:fin(tt,P.marks+0.1,0.5),ok:fin(tt,P.pd+0.4,0.5)});ac_comment(x,tt,1,1,null,0);}},
    // the office: what this shows, each part beside what it stands for
    {at:P.shows,place:"facMorning",keys:[[P.shows,960,540,1]],push:0.02,draw:(x,tt)=>{const g=fin(tt,P.tg[2]-0.1,0.6);
      gv_halo(x,seat[0]-260,GV_FX.top-440,520,440,GV.gold,0.9*g);
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",flip:true,t:tt,expr:"smile"});ac_facDesk(x,"morning");
      gv_halo(x,fx+fw-200,fy+20,100,70,GV.green,0.9*fin(tt,P.tg[0]-0.1,0.6));ac_farScreen(x,fx,fy,fw,fh,tt,{cm:1,ok:1,gold:1});
      gv_halo(x,fx+40,fy+200,fw-80,fh-210,WC_SIDE.tech,0.8*fin(tt,P.tg[1]-0.1,0.6));
      ac_tagAt(x,tt,P.tg[0]-0.1,null,fx+fw/2,fy-70,"rules written as checks",{size:34,wash:GV.green,washA:0.3});
      ac_tagAt(x,tt,P.tg[1]-0.1,null,fx+fw/2,fy+fh+150,"an agent, on every change, at any hour",{size:34,wash:WC_SIDE.tech,washA:0.3});
      ac_tagAt(x,tt,P.tg[2]-0.1,null,seat[0]+40,GV_FX.top-470,"a person who decides",{size:34,wash:GV.gold,washA:0.3});}},
    // wordless: Anil ticks the comment resolved
    {at:P.br,place:"screenMorning",keys:[[P.br,960,540,1.02],[P.br+0.1,960,560,1.06]],d:2.4,push:0,draw:(x,tt)=>{
      ac_change(x,tt,{q:1,cls:1,ok:1});ac_comment(x,tt,1,1,null,clamp((tt-P.br-0.4)/0.6,0,1));}}]);
  // imagined, and said so; and who Anil is
  wc_year(ctx,56,72,"Imagined · a few years from now",fin(t,0.5,0.5)*(1-fin(t,P.title,0.4)));
  ac_nameCard(ctx,1250,170,"Anil Kurian","analyst, Faculty of Health",gv_io(t,P.anil-0.1,P.col+0.3,0.4));
  gv_title(ctx,S,t,P.title,"An agent that checks","governance's rules, on every change","Film 9 of 19 · data governance");
  wc_paperOver(ctx,S);});

// ---- 2 · Thirteen problems: today, Anil's first change, the list itself; three checks fail; he asks Jun, and waits ----
scene("today",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{ls:c.list-0.6,every:w("list","Every learner"),awards:w("list","awards"),far:w("list","how far"),who:w("list","a name"),ck:c.fail-0.6,
      three:w("fail","Three checks"),thirteen:w("fail","thirteen"),each:w("says","Each says"),right:w("says","right for"),dec:w("says","who decides"),
      dr:c.waits-0.6,every2:w("waits","Every change"),owns:w("waits","nobody else owns"),wait2:w("waits","waits for Jun")};});
  const seat=GV_FX.seat,list=AC_TODAY;
  gv_shots(ctx,S,t,sc.dur,[
    // the faculty's office by day, at the same desk: Anil's first change, a new list
    {at:0,place:"faculty",keys:[[0,900,540,1.16],[0.1,930,530,1.22]],d:5,draw:(x,tt)=>{
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",flip:true,t:tt});ac_facDesk(x);ac_smallChange(x,tt,list);}},
    // the list itself: seven learners, the award each studies for, how far each is from finishing, someone to call
    {at:P.ls,place:"screenFac",keys:[[P.ls,960,540,1]],push:0.02,draw:(x,tt)=>
      ac_list(x,tt,{rows:fin(tt,P.every-0.2,1.2),award:fin(tt,P.awards-0.2,0.5),cp:fin(tt,P.far-0.1,0.5),who:fin(tt,P.who-0.1,0.6)})},
    // the change's checks: three fail; what each says is missing; and what none of them says
    {at:P.ck,place:"screenFac",keys:[[P.ck,960,540,1]],push:0.02,draw:(x,tt)=>ac_checks(x,tt,{lit:[0,1,2].map(i=>fin(tt,P.three+0.25*i,0.35)),
      sum:gv_io(tt,P.thirteen-0.1,P.each-0.3,0.3),msg:clamp((tt-P.each+0.1)/1.6,0,1),gq:[fin(tt,P.right-0.2,0.5),fin(tt,P.dec-0.2,0.5)]})},
    // the data team's room: Jun at his desk, his board full of changes waiting for him
    {at:P.dr,place:"data",keys:[[P.dr,1180,520,1.12],[P.dr+0.1,1200,515,1.16]],d:4,draw:(x,tt)=>{ac_queueSmall(x);person(x,"jun",1580,905,0.8,{pose:"reach",t:tt});}},
    // his board, close: every change that nobody else owns, and the Faculty of Health's goes up
    {at:P.every2-0.4,place:"boardData",keys:[[P.every2-0.4,960,500,1.04],[P.every2-0.3,960,490,1]],d:2.4,push:0.02,draw:(x,tt)=>ac_queue(x,tt,clamp((tt-P.owns+0.2)/0.6,0,1))},
    // back at the faculty: Anil waits, three red lights on his change, and the light moves across the desk
    {at:P.wait2+0.5,place:"faculty",keys:[[P.wait2+0.5,900,540,1.16],[P.wait2+0.6,880,545,1.2]],d:3,draw:(x,tt)=>{
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",expr:"concerned",flip:true,t:tt});ac_facDesk(x);
      ac_smallChange(x,tt,Object.assign({lights:[0,0,0]},list));ac_dayLight(x,clamp((tt-P.wait2-0.5)/3.2,0,1),0.7);}}]);
  wc_year(ctx,56,72,"Today",fin(t,0.3,0.5)*(1-fin(t,P.ls,0.4)));
  ac_nameCard(ctx,1180,190,"Jun Park","analytics engineer",gv_io(t,P.dr+0.3,P.every2-0.5,0.4));
  wc_paperOver(ctx,S);});

// ---- 3 · Rules an agent can follow: Yusuf and Noor write governance's rules as a skill; its page, step by step ----
scene("skill",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{bc:w("skill","as a skill")-0.35,as:w("skill","a skill"),steps:w("skill","the steps"),chg:w("skill","change"),pg:c.file-0.4,file:w("file","a file"),
      st:[c.steps1,w("steps1","Find"),w("steps1","Take"),c.steps2,w("steps2","Test"),c.steps3,w("steps3","Then report")],
      dn:[w("never","approves"),w("never","edits"),w("never","weakens"),w("never","shows")]};});
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's office: Noor and Yusuf at his board, the checks' thirteen messages pinned up and a fresh page beside them; binder 26 is out,
    // on his desk, and its place on the shelf is a gap
    {at:0,place:"office",keys:[[0,960,520,1.08],[0.1,980,510,1.12]],d:3,draw:(x,tt)=>{ac_score(x);ac_binders(x,true);ac_deskBinder(x);
      ac_msgStrips(x,false,1);ac_draftPage(x,false,0,0);
      person(x,"noor",640,905,0.8,{pose:"listen",pose2:"reach",mix:fin(tt,1.0,0.6),t:tt});
      person(x,"yusuf",1250,905,0.8,{pose:"listen",flip:true,t:tt,nod:ac_nod(tt,2.3)});}},
    // the board, close: the messages say what's missing; the page's title goes in by hand, then its steps, as pencil lines
    {at:P.bc,place:"boardGov",keys:[[P.bc,960,500,1],[P.bc+0.1,1000,490,1.06]],d:4,push:0.02,draw:(x,tt)=>{ac_msgStrips(x,true,1);
      ac_draftPage(x,true,clamp((tt-P.as-0.05)/1.0,0,1),clamp((tt-P.steps)/(P.chg+0.4-P.steps),0,1));}},
    // the skill's page, printed from the project: where it lives; each step lights as it's named; each thing it never does is marked
    {at:P.pg,place:"sheet",keys:[[P.pg,960,540,1],[P.dn[0]-1.7,1060,560,1.1]],d:1.6,push:0.04,draw:(x,tt)=>ac_skillPage(x,tt,{path:fin(tt,P.file-0.1,0.5),
      steps:P.st.map(s=>fin(tt,s-0.1,0.5)),donts:P.dn.map(s=>clamp((tt-s+0.05)/0.5,0,1))})}]);
  ac_nameCard(ctx,120,600,"Noor Rahman","data architect",gv_io(t,0.5,P.bc-0.2,0.4));
  wc_paperOver(ctx,S);});

// ---- 4 · Three findings: the agent's review of Anil's change: what passed, then three findings, each with its line, rule, draft and who decides ----
scene("review",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{big:w("reviews","Two things")-0.3,touch:w("reviews","touches"),needs:w("reviews","needs"),scroll:c.findings-0.2,three:w("findings","three findings"),
      lab:[w("findings","its line"),w("findings","the rule"),w("findings","a draft"),w("findings","who decides")],
      at:[[c.one,w("one","nobody"),w("one","owner")-0.2,w("one","would"),w("one","asked")],[c.two,w("two","say whether")-0.2,w("two","identify")-0.3,w("two","person")-0.1],
        [c.rule,w("rule","only"),[w("rule","The draft"),w("rule","row's")],sc.ends.rule-0.2]],
      ty:c.tally-0.4,counts:w("tally","counts"),look:w("tally","look like"),t3:c.rule-0.4};});
  const seat=GV_FX.seat,lab=tt=>P.lab.map(s=>fin(tt,s-0.1,0.4)),find=tt=>[0,1,2].map(i=>fin(tt,P.three+0.2*i,0.4)),
    // the finding being read out stays bright; the others fade back
    dim=tt=>{const f1=fin(tt,c.one-0.3,0.4),f2=fin(tt,c.two-0.3,0.4);return[1-0.55*f2,1-0.55*f1+0.55*f2,1-0.55*f1];};
  gv_shots(ctx,S,t,sc.dur,[
    // the faculty's office: the agent reads Anil's change, row by row, and its review comes in over it
    {at:0,place:"faculty",keys:[[0,900,540,1.16],[0.1,930,530,1.22]],d:3,draw:(x,tt)=>{
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",flip:true,t:tt,nod:ac_nod(tt,2.1)});ac_facDesk(x);ac_smallChange(x,tt,Object.assign({lights:[0,0,0]},AC_TODAY));
      ac_smallReview(x,tt,{read:clamp((tt-0.6)/1.0,0,1)*3.99,readA:gv_io(tt,0.5,1.7,0.25),a:fin(tt,1.6,0.5)});}},
    // the screen, closer: two things pass; then, scrolled down, three findings, each filled in as it's read out
    {at:P.big,place:"screenBig",keys:[[P.big,960,500,1]],push:0.03,draw:(x,tt)=>ac_review(x,tt,{pass:[clamp((tt-P.touch+0.1)/0.5,0,1),clamp((tt-P.needs+0.1)/0.5,0,1)],
      scroll:clamp((tt-P.scroll)/1.2,0,1),find:find(tt),lab:lab(tt),at:P.at.slice(0,2),dim:dim(tt)})},
    // finding 2, close: it counts, and shows no values
    {at:P.ty,place:"screenBig",keys:[[P.ty,960,500,1],[P.ty+0.1,930,500,1.04]],d:3,push:0,draw:(x,tt)=>ac_tally(x,tt,{read:clamp((tt-P.counts)/1.5,0,1)*7,
      readA:gv_io(tt,P.counts-0.2,P.counts+1.6,0.25),says:fin(tt,P.counts+1.5,0.4)+fin(tt,P.counts+2.0,0.4)+fin(tt,P.look-0.1,0.4)+fin(tt,P.look+0.8,0.4)})},
    // finding 3: a stated rule with no test; the drafted test, and what it finds today
    {at:P.t3,place:"screenBig",keys:[[P.t3,960,500,1],[P.t3+0.1,1000,510,1.05]],d:4,push:0,draw:(x,tt)=>ac_review(x,tt,{pass:[1,1],scroll:1,find:[1,1,1],lab:[1,1,1,1],
      at:[[-9,-9,-9,-9,-9],[-9,-9,-9,-9],P.at[2]],dim:[0.45,0.45,1]})}]);
  wc_paperOver(ctx,S);});

// ---- 5 · People decide: where the agent wasn't sure it said so; Anil answers; the owners approve; the agent decided nothing ----
scene("decides",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{unsure:w("unsure","wasn't sure"),tb:c.keys-0.4,long:w("keys","long coded"),one:w("keys","One stands"),two:w("other","two values"),desc:w("other","description"),
      maybe:c.doubt,but:w("doubt","But when"),skill:w("doubt","the skill"),draft:w("doubt","draft the"),ask:w("doubt","and ask"),an:c.confirms-0.4,conf:w("confirms","confirms"),
      cl:c.classed-0.4,classed:w("classed","classed"),reason:w("classed","Anil's reason"),ow:c.owners-0.4,fac:w("owners","the faculty"),yusuf:w("owners","Yusuf"),
      jun:w("owners","Jun"),nothing:c.decided,brought:w("decided","brought")};});
  const seat=GV_FX.seat;
  gv_shots(ctx,S,t,sc.dur,[
    // the review's table of classes: two are marked "not sure"
    {at:0,place:"screenBig",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>ac_classes(x,tt,{unsure:fin(tt,P.unsure-0.1,0.5)})},
    // the two keys: alike to look at; their counts tell them apart; the award key's description; when in doubt, the stricter class, and ask
    {at:P.tb,place:"screenBig",keys:[[P.tb,960,500,1]],push:0.02,draw:(x,tt)=>ac_keys(x,tt,{tag:fin(tt,P.long-0.1,0.5),lp:fin(tt,P.one-0.1,0.6),
      lc:clamp((tt-P.one-0.2)/1.0,0,1),ap:fin(tt,P.two-0.2,0.6),ac:clamp((tt-P.two)/1.0,0,1),desc:fin(tt,P.desc-0.1,0.5),q:clamp((tt-P.maybe)/0.6,0,1),
      s:clamp((tt-P.but+0.2)/0.9,0,1),step:clamp((tt-P.skill+0.2)/0.8,0,1),draft:fin(tt,P.draft-0.1,0.5),ask:fin(tt,P.ask-0.1,0.5)})},
    // the faculty's office: Anil answers, in gold
    {at:P.an,place:"faculty",keys:[[P.an,900,540,1.16],[P.an+0.1,930,530,1.22]],d:3,draw:(x,tt)=>{const typing=tt>P.conf-0.4&&tt<P.conf+1.8;
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",pose2:"write",mix:gv_io(tt,P.conf-0.4,P.conf+1.8,0.3),flip:true,t:tt,expr:typing?null:"smile"});
      ac_facDesk(x);ac_smallReply(x,tt,{a:fin(tt,P.conf-0.3,0.4),typed:clamp((tt-P.conf)/1.6,0,1)});}},
    // the table again: award_key is none, with Anil's reason; full_name is direct
    {at:P.cl,place:"screenBig",keys:[[P.cl,960,500,1]],push:0.02,draw:(x,tt)=>ac_classes(x,tt,{unsure:1,ok:clamp((tt-P.classed+0.2)/0.8,0,1),why:clamp((tt-P.reason+0.2)/0.8,0,1)})},
    // the change's page: the owners approve, each in gold; the agent's findings fade back, and a gold thread runs from each to who decided it
    {at:P.ow,place:"screenBig",keys:[[P.ow,960,500,1]],push:0.02,draw:(x,tt)=>ac_approvals(x,tt,{ap:[fin(tt,P.yusuf-0.2,0.9),fin(tt,P.fac-0.2,0.9),fin(tt,P.jun-0.2,0.9)],
      dim:fin(tt,P.nothing,0.8),th:clamp((tt-P.brought+0.2)/2.0,0,1)})}]);
  wc_paperOver(ctx,S);});

["agent","written","close"].forEach(id=>scene(id,(ctx,S,t,sc)=>{gv_shots(ctx,S,t,sc.dur,[{at:0,place:"office",keys:[[0,960,540,1]],d:1.4}]);wc_paperOver(ctx,S);}));
