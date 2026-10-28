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

// ---- 1 · A night, imagined: a change at dusk that nothing marks; at three, the agent's note; at eight, a person's decision ----
scene("night",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{fac:c.adds-0.6,anil:w("adds","Anil"),col:w("adds","adds a column"),dob:w("adds","date of birth"),q:w("nothing","Nothing")-0.1,
      anyone:w("nothing","anyone"),wrong:w("wrong","In the wrong"),pretend:w("wrong","pretend"),catch:c.now-0.3,waiting:w("now","waiting"),knows:w("now","knows the rules"),
      night:c.three-0.5,scr:w("three","reads")-0.4,reads:w("three","reads"),rules:w("three","written rules",0.6),edit:w("comment","doesn't edit"),appr:w("comment","approve it"),
      where:w("comment","where"),rule:w("comment","the rule"),who:w("comment","who decides"),fix:w("comment","a fix"),
      morn:c.eight-0.5,agrees:w("eight","agrees"),marks:w("eight","marks"),pd:w("eight","personal data"),saw:w("relief","no one saw"),
      shows:c.shows-0.5,tg:[w("shows","rules written"),w("shows","applied by"),w("shows","a person")],br:c.breath-0.2,title:c.breath+1.4};});
  const seat=GV_FX.seat,C=AC_RD[1],R=AC_RDS,ry=C[2]+R.r0+R.dy,from=[0,1,2].map(j=>[C[1]+R.cx[j],ry,R.bw[j]]),
    // reading the change, row by row: a pause on each, then on to the next; and once more, quickly, as it changes nothing
    row=tt=>{if(tt>P.edit-0.3)return 4*clamp((tt-P.edit+0.3)/1.2,0,1);const u=clamp((tt-P.reads)/(P.rules-P.reads),0,1),k=Math.floor(u*4.999),f=u*4.999-k;return Math.min(4,k+easeCam(clamp((f-0.4)*1.8,0,1)));},
    // who'd see it: the three cards round the screen, the date of birth in red, and the row that leaves one of them
    readers=(x,a,red,mask,dim)=>{for(let i=0;i<3;i++)ac_reader(x,i,{a:a[i],red,mask,dim});};
  gv_shots(ctx,S,t,sc.dur,[
    // the campus at dusk: the lamps come on; the old building's windows are warm
    {at:0,place:"dusk",keys:[[0,960,540,1],[0.3,620,560,1.22]],d:5.2,draw:(x,tt)=>ac_lamps(x,fin(tt,1.0,1.4))},
    // the faculty's office at dusk: Anil adds the column and sends his change, and goes home. The camera stays on the screen: nothing
    // says what the new column is; then everyone who can open the list, and what they'd see; the row that could pass for the learner;
    // and today's way, waiting for Jun. The screen sleeps
    {at:P.fac,place:"facDusk",keys:[[P.fac,930,520,1.3],[P.dob+1.0,830,466,1.6],[P.anyone-0.3,960,540,1]],d:1.7,draw:(x,tt)=>{const go=P.dob+1.25,wk=gv_walk(tt,go,seat[0],2300,700);
      ac_rise(x,"anil",seat[0],GV_FX.top,seat[1],fin(tt,P.dob+0.7,0.6),tt>=go?wk:null,
        tt>=go?{t:tt}:{pose:"listen",pose2:"write",mix:gv_io(tt,P.col-0.3,P.dob+0.5,0.3),flip:true,t:tt});
      ac_facDesk(x,"dusk");const out=fin(tt,P.catch,0.6),bu=clamp((tt-P.wrong-0.1)/1.8,0,1)*(1-out);
      ac_formSmall(x,tt,{typed:clamp((tt-P.col)/1.6,0,1),sent:clamp((tt-P.dob-0.15)/0.5,0,1),q:fin(tt,P.q,0.5),deco:tt>P.anyone-0.4,
        veil:fin(tt,P.wrong-0.2,0.5)*(1-out),dim:fin(tt,P.knows+0.5,0.8)});
      readers(x,[0,1,2].map(i=>fin(tt,P.anyone+0.15+0.3*i,0.5)*(1-out)),1,0,1-0.5*fin(tt,P.wrong+0.9,0.8));
      if(bu>0){ac_learner(x,735,614,0.95,bu,from);ac_pretender(x,950,614,0.95,clamp((tt-P.pretend+0.1)/1.2,0,1)*(1-out));}
      ac_todayCard(x,tt,fin(tt,P.catch+0.1,0.9),clamp((tt-P.waiting+0.1)/0.6,0,1),null,fin(tt,P.knows+0.2,0.8));}},
    // the campus at three in the morning: the lamps, the clock, and one window lit by a screen
    {at:P.night,place:"night",keys:[[P.night,760,560,1.12],[P.night+0.1,330,590,2.1]],d:2.1},
    // the screen, close, in the dark office: the agent reads the change against the rules, row by row; nothing says what the new
    // column is; it changes nothing, approves nothing (the signature line stays empty), and leaves its note, with a fix to consider
    {at:P.scr,place:"screenNight",keys:[[P.scr,960,540,1]],push:0.02,draw:(x,tt)=>{
      ac_form(x,tt,{read:row(tt),readA:fin(tt,P.scr+0.3,0.4)*(1-fin(tt,P.appr-0.2,0.4)),q:1,ring:clamp((tt-P.appr+0.1)/1.0,0,1),draft:fin(tt,P.fix-0.1,0.6)});
      ac_note(x,tt,{p:[P.where,P.rule,P.who].map(s=>fin(tt,s-0.15,0.5))});}},
    // eight in the morning: Anil reads the note, and nods
    {at:P.morn,place:"facMorning",keys:[[P.morn,930,520,1.3],[P.morn+0.1,940,515,1.34]],d:4,draw:(x,tt)=>{
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",flip:true,t:tt,nod:ac_nod(tt,P.agrees)});
      ac_facDesk(x,"morning");ac_formSmall(x,tt,{sent:1,q:1,note:1,ok:0});}},
    // the screen: he marks the column, in gold; the draft goes, and the checks pass; no one had to wait
    {at:P.marks-0.4,place:"screenMorning",keys:[[P.marks-0.4,960,540,1]],push:0.02,draw:(x,tt)=>{
      ac_form(x,tt,{q:1,draft:1,clsAt:P.marks+0.1,ok:fin(tt,P.pd+0.4,0.5)});ac_note(x,tt,{});}},
    // the office: everyone who can open the list sees stars where the date of birth was; then what this shows, each part beside what it
    // stands for
    {at:P.saw-0.6,place:"facMorning",keys:[[P.saw-0.6,960,540,1]],push:0.02,draw:(x,tt)=>{const g=fin(tt,P.tg[2]-0.1,0.6),ex=expr=>tt>P.saw+1.0?"smile":null;
      gv_halo(x,seat[0]-260,GV_FX.top-440,520,440,GV.gold,0.9*g);
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",flip:true,t:tt,expr:ex()});ac_facDesk(x,"morning");
      ac_formSmall(x,tt,{sent:1,cls:1,note:1,ok:1,deco:1,ruleLit:fin(tt,P.tg[0]-0.1,0.6),halo:fin(tt,P.tg[1]-0.1,0.6)});
      const rd=fin(tt,P.shows-0.4,0.5);readers(x,[0,1,2].map(i=>fin(tt,P.saw-0.5+0.15*i,0.4)*(1-rd)),1,clamp((tt-P.saw-0.3)/0.9,0,1));
      const [fx,fy,fw,fh]=GV_FX.screen;
      ac_tagAt(x,tt,P.tg[0]-0.1,null,fx+fw/2,fy-60,"rules written plainly enough to check",{size:34,wash:GV.green,washA:0.3});
      ac_tagAt(x,tt,P.tg[1]-0.1,null,fx+fw/2,fy+fh+64,"an agent, on every change, at any hour",{size:34,wash:WC_SIDE.tech,washA:0.3});
      ac_tagAt(x,tt,P.tg[2]-0.1,null,seat[0]+20,GV_FX.top-470,"a person who decides",{size:34,wash:GV.gold,washA:0.3});}},
    // wordless: Anil ticks the note resolved; the screen clears for the title
    {at:P.br,place:"screenMorning",keys:[[P.br,960,540,1.02],[P.br+0.1,960,560,1.06]],d:2.4,push:0,draw:(x,tt)=>{
      const cl=fin(tt,P.title-0.6,0.6);ac_form(x,tt,{clsAt:-99,ok:1,fade:1.25*cl});ac_note(x,tt,{res:clamp((tt-P.br-0.4)/0.6,0,1),a:1-cl});}}]);
  // imagined, and said so; and who Anil is
  wc_year(ctx,56,72,"Imagined · a few years from now",fin(t,0.5,0.5)*(1-fin(t,P.title,0.4)));
  ac_nameCard(ctx,1250,170,"Anil Kurian","analyst, Faculty of Health",gv_io(t,P.anil-0.1,P.col+0.3,0.4));
  gv_title(ctx,S,t,P.title,"An agent that checks","governance's rules, on every change","Film 9 of 19 · data governance");
  wc_paperOver(ctx,S);});

// ---- 2 · Sent back: today, Anil's first change, the list itself; the checks send it back with four gaps; he asks Jun, and waits ----
scene("today",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{ls:c.list-0.6,every:w("list","Every learner"),awards:w("list","awards"),far:w("list","how far"),who:w("list","a name"),
      ck:c.fail-0.2,four:w("fail","four gaps"),each:w("says","Each says"),right:w("says","right for"),dec:w("says","who decides"),
      dr:c.waits-0.5,knows:w("waits","who knows"),bd:c.queue-0.4,owns:w("queue","nobody else owns"),adv:w("queue","the advisers")-0.3,back:sc.ends.queue+0.5};});
  const seat=GV_FX.seat,A=AC_AD;
  gv_shots(ctx,S,t,sc.dur,[
    // the faculty's office by day, at the same desk: Anil's first change, a new list, every column new, and sent
    {at:0,place:"faculty",keys:[[0,930,520,1.3],[0.1,940,515,1.34]],d:5,draw:(x,tt)=>{
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",flip:true,t:tt});ac_facDesk(x);ac_formSmall(x,tt,AC_LFORM);}},
    // the list itself, close: seven learners, the award each studies for, how far each is from finishing, someone to call; then the
    // series' sign-off sheet comes in over it, sent back with four gaps: what each says is missing, and what none of them says
    {at:P.ls,place:"screenFac",keys:[[P.ls,960,540,1]],push:0.015,draw:(x,tt)=>{const so=clamp((tt-P.ck)/0.9,0,1);
      ac_list(x,tt,{rows:fin(tt,P.every-0.2,1.2),award:fin(tt,P.awards-0.2,0.5),cp:fin(tt,P.far-0.1,0.5),who:fin(tt,P.who-0.1,0.6),fade:so});
      if(so>0){const e=easeCam(so);ac_sheet(x,150,70+440*(1-e),1000,{rot:-0.012*e,p:clamp(so*1.4,0,1),missA:fin(tt,P.four-0.1,0.5),sent:fin(tt,P.four-0.05,0.6),askP:clamp((tt-P.each+0.1)/2.0,0,1)});}
      ac_goldQ(x,1270,330,"right for this list?",fin(tt,P.right-0.2,0.6));ac_goldQ(x,1270,470,"who decides?",fin(tt,P.dec-0.2,0.6));}},
    // the data team's room: Jun points up at his board, full of the changes that wait for him; at its edge, his page of what he checks
    {at:P.dr,place:"data",keys:[[P.dr,860,470,1.22],[P.knows-0.2,820,440,1.3]],d:2.2,draw:(x,tt)=>{ac_queueSmall(x,{});
      person(x,"jun",1000,905,0.8,{pose:"listen",pose2:"ac_pointUp",mix:gv_io(tt,P.dr+0.3,P.bd+1,0.5),flip:true,t:tt});}},
    // his board, close: every change that nobody else owns, and the Faculty of Health's goes up
    {at:P.bd,place:"boardData",keys:[[P.bd,960,480,1.04],[P.bd+0.1,960,470,1]],d:2.4,push:0.02,draw:(x,tt)=>ac_queue(x,tt,clamp((tt-P.owns+0.2)/0.6,0,1))},
    // across the faculty's office, the advisers' desk: the tray for the call list, empty, and an adviser waiting
    {at:P.adv,place:"advisers",keys:[[P.adv,960,556,1.1],[P.adv+0.1,970,552,1.14]],d:3,draw:(x,tt)=>{
      gv_behind(x,"ac_adviser",A.seat[0],A.top,A.seat[1],{pose:"ac_wait",expr:"concerned",t:tt});ac_advisersDesk(x);ac_cradle(x);ac_tray(x,0);}},
    // back at the faculty: Anil waits, the sheet sent back beside his keyboard, and the window's light moves across the desk
    {at:P.back,place:"faculty",keys:[[P.back,930,520,1.3],[P.back+0.1,920,525,1.32]],d:3,draw:(x,tt)=>{
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",expr:"concerned",flip:true,t:tt});ac_facDesk(x);ac_flatSheet(x,1160,GV_FX.top+8,220,true);
      ac_formSmall(x,tt,AC_LFORM);ac_dayLight(x,clamp((tt-P.back)/2.6,0,1),0.7);}}]);
  wc_year(ctx,56,72,"Today",fin(t,0.3,0.5)*(1-fin(t,P.ls,0.4)));
  ac_nameCard(ctx,1330,640,"Jun Park","analytics engineer",gv_io(t,P.dr+0.3,P.bd-0.2,0.4));
  wc_paperOver(ctx,S);});

// ---- 3 · Rules an agent can follow: Yusuf and Noor write governance's rules as a checklist; its page, step by step ----
scene("skill",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{bc:w("skill","as a checklist")-0.35,as:w("skill","a checklist"),steps:w("skill","the steps"),chg:sc.ends.skill,pg:c.file-0.4,
      op:c.oneplace-0.4,one:w("oneplace","one person"),st0:c.steps1-0.4,
      st:[c.steps1,w("steps1","Find"),w("steps1","Take"),c.steps2,w("steps2","Check each"),c.steps3,w("steps3","Then report")],
      dn:[w("never","approves"),w("never","edits"),w("never","weakens"),w("never","shows")],nt:w("night","the night")-0.5};});
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's office: Noor and Yusuf at his board, Anil's sheet and Jun's page pinned up and a fresh page beside them; binder 26 is
    // out, on his desk, and its place on the shelf is a gap
    {at:0,place:"office",keys:[[0,960,520,1.08],[0.1,980,510,1.12]],d:3,draw:(x,tt)=>{ac_score(x);ac_binders(x,true);ac_deskBinder(x);ac_officeBoard(x);
      person(x,"noor",620,905,0.8,{pose:"listen",pose2:"reach",mix:fin(tt,1.0,0.6),t:tt});
      person(x,"yusuf",1250,905,0.8,{pose:"listen",flip:true,t:tt,nod:ac_nod(tt,2.3)});}},
    // the board, close: the sheet's four questions and Jun's page; the fresh page's title goes in by hand, then its steps, as pencil lines
    {at:P.bc,place:"boardGov",keys:[[P.bc,960,480,1],[P.bc+0.1,1040,480,1.05]],d:4,push:0.02,draw:(x,tt)=>
      ac_boardGov(x,tt,{fresh:clamp((tt-P.as-0.05)/1.2,0,1),lines:clamp((tt-P.steps)/(P.chg+0.4-P.steps),0,1)})},
    // the checklist, printed, on Yusuf's desk: one page, in plain words
    {at:P.pg,place:"sheet",keys:[[P.pg,960,540,1]],push:0.03,draw:(x,tt)=>ac_checklist(x,tt,{ink:1})},
    // the board again: Jun's page comes off, and copies of the checklist go up in its place, for the data team, for the faculty and
    // for the agent
    {at:P.op,place:"boardGov",keys:[[P.op,1060,480,1.04],[P.op+0.1,1080,480,1.08]],d:3,push:0.02,draw:(x,tt)=>
      ac_boardGov(x,tt,{lift:clamp((tt-P.one+0.6)/0.9,0,1),copies:[0,1,2].map(i=>fin(tt,P.one+0.1+0.35*i,0.5))})},
    // the checklist again: each step lights as it's named; each thing it never does is crossed
    {at:P.st0,place:"sheet",keys:[[P.st0,960,540,1],[P.dn[0]-1.4,1150,560,1.12]],d:1.4,push:0,draw:(x,tt)=>ac_checklist(x,tt,{ink:0.4,
      steps:P.st.map(s=>fin(tt,s-0.1,0.5)),donts:P.dn.map(s=>clamp((tt-s+0.05)/0.5,0,1))})},
    // the night we imagined: the agent's note, its rule lit, and above it the checklist's step 4, lit with it
    {at:P.nt,place:"screenNight",keys:[[P.nt,960,540,1]],push:0.02,draw:(x,tt)=>{ac_form(x,tt,{q:1,draft:1});const g=fin(tt,P.nt+0.6,0.8);
      ac_note(x,tt,{lit:[0,g,0]});ac_step4(x,g);}}]);
  ac_nameCard(ctx,120,600,"Noor Rahman","data architect",gv_io(t,0.5,P.bc-0.2,0.4));
  wc_paperOver(ctx,S);});

// ---- 4 · Three findings: the agent's review of Anil's change: what passed, then three findings, each with where, our rule, a draft and who decides ----
scene("review",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{big:w("reviews","Two things")-0.3,two:w("reviews","Two things"),thr:c.findings,
      part:[w("findings","where"),w("findings","the rule"),w("findings","a draft"),w("findings","who decides")],what:w("findings","what the checks"),
      one:c.one,nob:w("one","nobody"),own:w("one","so no owner"),ask:w("one","asked"),t2:c.two,col:w("two","ten columns"),iden:w("two","identify"),
      ty:c.tally-0.4,counts:w("tally","counts"),look:w("tally","look like"),t3:c.rule-0.4,only:w("rule","only its own"),noth:w("rule","nothing checks"),
      dr:c.draft,rows:w("draft","row's"),hl:sc.ends.draft};});
  const seat=GV_FX.seat,dim=tt=>{const f1=fin(tt,P.one-0.3,0.4),f2=fin(tt,P.t2-0.3,0.4);return[1-0.55*f2,1-0.55*f1+0.55*f2,1-0.55*f1];};
  gv_shots(ctx,S,t,sc.dur,[
    // the faculty's office: the sheet, sent back, beside the keyboard; the agent reads Anil's change, row by row, and its review comes in
    {at:0,place:"faculty",keys:[[0,930,520,1.3],[0.1,940,515,1.34]],d:3,draw:(x,tt)=>{
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",flip:true,t:tt,nod:ac_nod(tt,P.big-0.7)});ac_facDesk(x);ac_flatSheet(x,1160,GV_FX.top+8,220,true);
      ac_formSmall(x,tt,AC_LFORM);ac_smallReview(x,tt,{read:clamp((tt-0.5)/1.4,0,1)*4,readA:gv_io(tt,0.4,2.0,0.25),a:fin(tt,1.9,0.5)});}},
    // the screen, closer: two things pass; three findings, each with where, our rule, a draft and who decides; the sheet comes in with
    // what the checks couldn't say; then the first two are read out
    {at:P.big,place:"screenBig",keys:[[P.big,960,500,1]],push:0.025,draw:(x,tt)=>ac_review(x,tt,{pass:[fin(tt,P.two+0.5,0.5),fin(tt,P.two+0.9,0.5)],
      find:[0,1,2].map(i=>fin(tt,P.thr+0.15*i,0.4)),part:P.part.map(s=>fin(tt,s-0.1,0.4)),
      v:[[fin(tt,P.nob,0.6),fin(tt,P.nob+0.5,0.8),fin(tt,P.own,0.5),fin(tt,P.own+0.4,0.5)],[fin(tt,P.col,0.6),fin(tt,P.iden-0.4,0.8),fin(tt,P.iden,0.5),fin(tt,P.iden+0.3,0.5)],[0,0,0,0]],
      red:fin(tt,P.ask-0.2,0.5),lit:gv_io(tt,P.part[2]-0.1,P.one-0.4,0.4),dim:dim(tt),so:gv_io(tt,P.what-0.1,P.one-0.5,0.5),tick:fin(tt,P.part[2],0.5),tick2:fin(tt,P.part[3],0.5)})},
    // finding 2, close: it counts, and shows no values
    {at:P.ty,place:"screenBig",keys:[[P.ty,960,500,1],[P.ty+0.1,930,500,1.04]],d:3,push:0,draw:(x,tt)=>ac_tally(x,tt,{read:clamp((tt-P.counts)/1.5,0,1)*7,
      readA:gv_io(tt,P.counts-0.2,P.counts+1.6,0.25),says:fin(tt,P.counts+1.5,0.4)+fin(tt,P.counts+2.0,0.4)+fin(tt,P.look-0.1,0.4)+fin(tt,P.look+0.8,0.4)})},
    // finding 3, close: a rule the faculty wrote, which no check could find; the drafted check, what it finds today, and who decides
    {at:P.t3,place:"screenBig",keys:[[P.t3,960,500,1],[P.t3+0.1,975,505,1.03]],d:4,push:0,draw:(x,tt)=>ac_f3(x,tt,{tag:fin(tt,P.t3+0.6,0.5),
      read:clamp((tt-P.only+0.2)/1.2,0,1),readA:gv_io(tt,P.only-0.3,P.noth+0.6,0.3),draft:fin(tt,P.dr-0.1,0.6),pass:fin(tt,P.rows,0.5),who:clamp((tt-P.hl-0.1)/1.0,0,1)})}]);
  wc_paperOver(ctx,S);});

// ---- 5 · People decide: where the agent wasn't sure it said so; Anil answers; the owners approve; the agent decided nothing ----
scene("decides",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{unsure:w("unsure","wasn't sure"),tb:c.keys-0.4,long:w("keys","long codes"),one:w("keys","One stands"),two:w("other","two values"),desc:w("other","description"),
      maybe:c.doubt,but:w("doubt","But when"),ck:w("doubt","the checklist"),draft:w("doubt","draft the"),ask:w("doubt","and ask"),an:c.confirms-0.4,conf:w("confirms","confirms"),
      cl:c.classed-0.4,classed:w("classed","classed"),reason:w("classed","Anil's reason"),ow:c.owners-0.4,fac:w("owners","the faculty"),yusuf:w("owners","Yusuf"),
      jun:w("owners","Jun"),sig:sc.ends.owners-0.3,calls:c.calls-0.4,nothing:c.decided-0.4,brought:w("decided","brought")};});
  const seat=GV_FX.seat,A=AC_AD;
  gv_shots(ctx,S,t,sc.dur,[
    // the review's table of classes: two are marked "not sure"
    {at:0,place:"screenBig",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>ac_classes(x,tt,{unsure:fin(tt,P.unsure-0.1,0.5)})},
    // the two long codes: alike to look at; their counts tell them apart; the award code's description; when in doubt, the stricter
    // class, and ask
    {at:P.tb,place:"screenBig",keys:[[P.tb,960,500,1]],push:0.02,draw:(x,tt)=>ac_keys(x,tt,{tag:fin(tt,P.long-0.1,0.5),lp:fin(tt,P.one-0.1,0.6),
      lc:clamp((tt-P.one-0.2)/1.0,0,1),ap:fin(tt,P.two-0.2,0.6),ac:clamp((tt-P.two)/1.0,0,1),desc:fin(tt,P.desc-0.1,0.5),q:clamp((tt-P.maybe)/0.6,0,1),
      s:clamp((tt-P.but+0.2)/0.9,0,1),step:clamp((tt-P.ck+0.2)/0.8,0,1),draft:fin(tt,P.draft-0.1,0.5),ask:fin(tt,P.ask-0.1,0.5)})},
    // the faculty's office: Anil answers, in gold
    {at:P.an,place:"faculty",keys:[[P.an,930,520,1.3],[P.an+0.1,940,515,1.34]],d:3,draw:(x,tt)=>{const typing=tt>P.conf-0.4&&tt<P.conf+1.8;
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"listen",pose2:"write",mix:gv_io(tt,P.conf-0.4,P.conf+1.8,0.3),flip:true,t:tt,expr:typing?null:"smile"});
      ac_facDesk(x);ac_smallReply(x,tt,{a:fin(tt,P.conf-0.3,0.4),typed:clamp((tt-P.conf)/1.6,0,1)});}},
    // the table again: award code identifies no one, with Anil's reason; name stays direct
    {at:P.cl,place:"screenBig",keys:[[P.cl,960,500,1]],push:0.02,draw:(x,tt)=>ac_classes(x,tt,{unsure:1,okAt:P.classed-0.2,why:clamp((tt-P.reason+0.2)/0.8,0,1)})},
    // Yusuf's desk: the sign-off sheet, filled from the drafts; the owners approve, each for their part, in gold; then it's signed
    {at:P.ow,place:"paperDesk",keys:[[P.ow,960,540,1]],push:0.02,draw:(x,tt)=>ac_signed(x,tt,{p:clamp((tt-P.ow-0.1)/0.9,0,1),
      ap:[fin(tt,P.fac-0.2,0.9),fin(tt,P.yusuf-0.2,0.9),fin(tt,P.jun-0.2,0.9)],signed:fin(tt,P.sig,0.6)})},
    // the advisers' desk: the list is in the tray, and an adviser lifts the phone
    {at:P.calls,place:"advisers",keys:[[P.calls,960,556,1.1],[P.calls+0.1,970,552,1.14]],d:3,draw:(x,tt)=>{const lift=fin(tt,P.calls+1.0,0.7);
      gv_behind(x,"ac_adviser",A.seat[0],A.top,A.seat[1],{pose:"listen",pose2:"ac_call",mix:lift,expr:"smile",t:tt,carry:lift>0.5?ac_handset:null});
      ac_advisersDesk(x);if(lift<=0.5)ac_cradle(x);ac_tray(x,fin(tt,P.calls+0.1,0.8));}},
    // who decided what: the findings fade back; a gold thread runs from each to the person who decided it
    {at:P.nothing,place:"paperDesk",keys:[[P.nothing,960,540,1]],push:0.02,draw:(x,tt)=>ac_decided(x,tt,{dim:fin(tt,P.nothing+0.6,0.8),th:clamp((tt-P.brought+0.2)/2.0,0,1)})}]);
  wc_paperOver(ctx,S);});

// ---- 6 · Governed, too: binder 26's line; the rules for AI helpers; the agent's own identity and least access; it can't approve; the line goes green ----
scene("agent",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{ag:w("governed","The agent"),gov:w("governed","governed"),pl:sc.ends.governed+0.3,fm:w("own","reads")-0.3,id:w("own","identity"),
      rows:[w("own","reads"),w("own","writes"),w("own","workspace")+0.4,w("samples","counts"),w("samples","never bulk"),w("samples","only reads")],
      rev:w("samples","glossary")-0.1,ans:w("samples","glossary")+0.2,who:c.approve-0.4,cant:w("approve","can't"),owners:w("approve","owners sign"),owns:w("approve","owns nothing"),
      nt:c.note-0.4,gr:c.green-0.5,green:w("green","green"),hw:[w("green","agent's access"),w("green","its checklist"),w("green","owners' approvals")]};});
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's desk, from above: binder 26 open at its line; the rules for AI helpers are laid beside it, and the agent's star comes onto them
    {at:0,place:"desk26",keys:[[0,1050,420,1.45],[P.ag-0.5,960,540,1]],d:1.6,draw:(x,tt)=>{ac_open26(x,tt);
      ac_rulesPage(x,tt,{land:clamp((tt-P.ag+0.4)/0.9,0,1),star:fin(tt,P.gov-0.1,0.6)});}},
    // the platform team's desk, close: Sam, and the agent's access request, on paper, in front of him
    {at:P.pl,place:"platClose",keys:[[P.pl,960,540,1.04],[P.pl+0.1,1010,540,1.1]],d:2.4,draw:(x,tt)=>{
      gv_behind(x,"sam",GV_PX.seat[0],GV_PX.top,GV_PX.seat[1],{pose:"ac_readDesk",flip:true,t:tt});ac_platDesk(x);ac_platScreens(x);ac_formOnDesk(x,1);}},
    // the access request, close: its own identity; what it may read and write, and how it works with the data, each ticked or crossed
    // as it's said; reviewed with everyone's; and Sam's answer, in gold
    {at:P.fm,place:"form",keys:[[P.fm,960,520,1.04],[P.rows[3]-0.6,960,560,1.08]],d:1.8,draw:(x,tt)=>ac_accessForm(x,tt,{id:fin(tt,P.id-0.4,0.5),
      rows:P.rows.map(s=>clamp((tt-s+0.1)/0.6,0,1)),rev:fin(tt,P.rev,0.5),ans:clamp((tt-P.ans)/1.2,0,1)})},
    // who signs off what: the owners; the agent owns nothing, and its approve is crossed
    {at:P.who,place:"paperDesk",keys:[[P.who,960,540,1]],push:0.02,draw:(x,tt)=>{ac_whoPage(x,tt,{own:fin(tt,P.owners-0.2,0.6)});
      ac_agentCard(x,tt,1260,380,fin(tt,P.cant-0.3,0.5),clamp((tt-P.cant)/0.6,0,1));ac_tagAt(x,tt,P.owns-0.1,null,1540,650,"owners only",{size:34,wash:GV.gold,washA:0.35});}},
    // the night we imagined: the agent's note, and the empty signature line, ringed in pencil
    {at:P.nt,place:"screenNight",keys:[[P.nt,960,540,1]],push:0.02,draw:(x,tt)=>{ac_form(x,tt,{q:1,draft:1,ring:clamp((tt-P.nt-0.6)/1.0,0,1)});ac_note(x,tt,{});}},
    // the desk again: the binder's line goes green, and Yusuf writes where it runs
    {at:P.gr,place:"desk26",keys:[[P.gr,960,540,1],[P.gr+0.1,1060,480,1.22]],d:1.8,push:0,draw:(x,tt)=>{
      ac_open26(x,tt,{hi:clamp((tt-P.green+0.2)/0.9,0,1),hw:P.hw.map(s=>clamp((tt-s+0.1)/0.8,0,1))});ac_rulesPage(x,tt,{star:1});}}]);
  ac_nameCard(ctx,250,150,"Sam Okafor","platform team",gv_io(t,P.pl+0.3,P.fm-0.1,0.4));
  wc_paperOver(ctx,S);});

// ---- 7 · Only what's written: an agent follows only what's written plainly; policy 12.7 can't be checked; the checklist is open, and changes by review ----
scene("written",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{follow:w("plain","follow"),pb:w("plain","plainly")-0.4,pg:c.care-0.5,staff:w("care","Staff"),no:w("care","No agent"),care2:sc.ends.care-0.3,
      rm:c.open-0.5,open:w("open","open:"),bc:w("open","anyone")-0.3,argue:w("open","argue"),who:c.change-0.5,dg:w("change","data governance"),
      nx:w("change","the next")-0.4,next:w("change","the next"),fa:c.trust-0.4,rd:w("trust","read,"),qu:w("trust","question"),over:w("trust","overrule")};});
  const seat=GV_FX.seat,rowAt=(tt,t0,t1)=>clamp((tt-t0)/(t1-t0),0,1)*6.99;
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's desk: the checklist, and the agent's star reads down its steps; then, beside it, binder 12, closed, his notes sticking out
    {at:0,place:"desk12",keys:[[0,1300,500,1.3],[P.pb,960,540,1]],d:1.8,draw:(x,tt)=>{ac_closed12(x);
      ac_checkSheet(x,tt,{read:rowAt(tt,P.follow-0.2,P.pb+0.2),readA:gv_io(tt,P.follow-0.4,P.pb+0.6,0.3)});}},
    // policy 12's page, as Off the shelf left it: its last line struck through, can go; the star reads along it, and finds nothing to check
    {at:P.pg,place:"page",keys:[[P.pg,960,540,1],[P.staff-0.9,740,777,1.78]],d:1.6,push:0,draw:(x,tt)=>ac_policy12(x,tt,{star:clamp((tt-P.no)/1.0,0,1),
      starA:gv_io(tt,P.no-0.2,P.care2+1.0,0.3),q:fin(tt,P.care2,0.5),notesOut:fin(tt,P.staff-1.0,0.5)})},
    // the data team's room: the checklist pinned on their board; Anil and Jun read it
    {at:P.rm,place:"data",keys:[[P.rm,760,520,1.2],[P.rm+0.1,780,515,1.24]],d:3,draw:(x,tt)=>{ac_queueSmall(x,{chk:1});
      person(x,"anil",380,905,0.8,{pose:"ac_pointUp",t:tt});person(x,"jun",965,905,0.8,{pose:"ac_readUp",flip:true,t:tt,nod:ac_nod(tt,P.rm+0.9)});}},
    // the board, close: anyone can read the steps, and argue with them: Anil's question, in pencil, beside step 4
    {at:P.bc,place:"boardData",keys:[[P.bc,960,500,1.04],[P.bc+0.1,980,500,1.08]],d:3,push:0.02,draw:(x,tt)=>ac_boardCheck(x,tt,{note:clamp((tt-P.argue+0.3)/1.4,0,1)})},
    // who signs off what: the checklist's line, data governance with Noor; data governance approves a change to it
    {at:P.who,place:"paperDesk",keys:[[P.who,960,540,1]],push:0.02,draw:(x,tt)=>{const r=ac_whoPage(x,tt,{focus:4,dim:fin(tt,P.who+0.4,0.6),hiA:fin(tt,P.dg-0.2,0.6)});
      ac_tagAt(x,tt,P.dg,null,AC_WX.x+700,r.rows[4]+96,"data governance approves",{size:34,wash:GV.gold,washA:0.35});}},
    // the checklist again: the next review follows it, step by step
    {at:P.nx,place:"sheet",keys:[[P.nx,960,540,1]],push:0.03,draw:(x,tt)=>{const r=rowAt(tt,P.next,P.fa-0.2);
      ac_checklist(x,tt,{ink:0.4,steps:AC_STEPS.map((_,i)=>clamp(r-i+0.6,0,1)),donts:[1,1,1,1],read:r,readA:gv_io(tt,P.next-0.2,P.fa+0.5,0.3)});
      ac_tagAt(x,tt,P.next-0.1,null,1560,236,"the next review",{size:34,wash:WC_SIDE.tech,washA:0.3});}},
    // the faculty's office: Anil reads the agent's review; he can read it, question it, and overrule it
    {at:P.fa,place:"faculty",keys:[[P.fa,930,520,1.3],[P.fa+0.1,940,515,1.34]],d:3,draw:(x,tt)=>{
      gv_behind(x,"anil",seat[0],GV_FX.top,seat[1],{pose:"ac_readScreen",flip:true,t:tt,expr:tt>P.over+0.4?"smile":null});ac_facDesk(x);
      ac_formSmall(x,tt,AC_LFORM);ac_smallReview(x,tt,{a:1});
      [["read it",P.rd],["question it",P.qu],["overrule it",P.over]].forEach(([s,t0],i)=>ac_tagAt(x,tt,t0-0.1,null,400,340+i*100,s,i===2?{size:36,wash:GV.gold,washA:0.35}:{size:36}));}}]);
  wc_paperOver(ctx,S);});

// ---- 8 · That night: the imagined night again, made of what the film has shown; what data governance gains; then morning, and a person's decision ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=ac_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{scr:w("made","is made")-0.3,tg:[w("parts","a checklist"),w("parts","rules for"),w("parts","a register"),w("parts","people")],
      dawn:c.gains-0.3,every:w("gains","every change")-0.3,nowait:w("gains","no one waiting")-0.3,pd:c.marked-0.3,each:w("marked","each decision")-0.3,
      last:c.last-0.3,dec:w("last","People decide"),end:c.breath-0.2};});
  gv_shots(ctx,S,t,sc.dur,[
    // the campus at night again, the clock at three; close in on the old building's lit window
    {at:0,place:"night",keys:[[0,760,560,1.12],[0.2,330,590,2.1]],d:1.5},
    // the screen: the agent's note on the date of birth; then what the night is made of, each on the paper that stands for it
    {at:P.scr,place:"screenNight",keys:[[P.scr,960,540,1]],push:0.02,draw:(x,tt)=>{const f=fin(tt,P.tg[0]-0.5,0.6);ac_form(x,tt,{q:1,draft:1,fade:1.2*f});ac_note(x,tt,{a:1-f});
      ac_parts(x,tt,P.tg.map(s=>fin(tt,s-0.15,0.45)));}},
    // morning comes over the campus
    {at:P.dawn,place:"dawn",keys:[[P.dawn,760,560,1.12],[P.dawn+0.1,700,560,1.18]],d:2.2},
    // what each gives: every change checked by the same rules, at any hour: the checklist, under the agent's star
    {at:P.every,place:"boardGov",keys:[[P.every,1000,480,1.04],[P.every+0.1,1010,480,1.06]],d:3,push:0.02,draw:(x,tt)=>{ac_boardGov(x,tt,{lift:1,copies:[1,1,1],noSheet:1});
      ac_tagAt(x,tt,P.every+0.3,null,560,480,"every change, the same rules, any hour",{size:34,wash:GV.green,washA:0.3});}},
    // no one waiting for one person: Jun's board, its waiting cards gone, and Jun at his own work, the way the team builds
    {at:P.nowait,place:"data",keys:[[P.nowait,960,520,1.05]],push:0.02,draw:(x,tt)=>{ac_queueSmall(x,{empty:1,chk:1});
      person(x,"jun",1360,905,0.8,{pose:"ac_pointUp",flip:true,t:tt});ac_tagAt(x,tt,P.nowait+0.3,null,665,610,"no one waiting for one person",{size:34,wash:GV.gold,washA:0.35});}},
    // personal data marked before anyone sees it: the date of birth's class, direct, ringed in gold
    {at:P.pd,place:"screenMorning",keys:[[P.pd,960,540,1]],push:0.02,draw:(x,tt)=>{ac_form(x,tt,{clsAt:-99,ok:1});
      ac_tagAt(x,tt,P.pd+0.3,null,1390,AC_F.y0+4*AC_F.dy-11,"personal data marked before anyone sees it",{size:34,wash:GV_CLASS.direct,washA:0.3});}},
    // each decision by its owner, with the evidence, written down: the sheet, signed, and the register's page
    {at:P.each,place:"paperDesk",keys:[[P.each,960,540,1]],push:0.02,draw:(x,tt)=>{ac_sheetPic(x,150,262,760,-0.02,true);ac_whoPic(x,990,300,820,0.02);
      ac_tagAt(x,tt,P.each+0.3,null,960,176,"each decision by its owner, with the evidence, written down",{size:34,wash:GV.gold,washA:0.35});}},
    // the same screen in the morning light: the checks passed, the note ticked; people decide; it clears for the end card
    {at:P.last,place:"screenMorning",keys:[[P.last,960,540,1]],push:0.02,draw:(x,tt)=>{
      const cl=fin(tt,P.end-0.6,0.6);gv_halo(x,AC_F.cls-40,AC_F.y0+4*AC_F.dy-58,300,90,GV.gold,0.9*fin(tt,P.dec-0.1,0.6)*(1-cl));
      ac_form(x,tt,{clsAt:-99,ok:1,fade:1.25*cl});ac_note(x,tt,{res:1,a:1-cl});}}]);
  wc_year(ctx,56,72,"Imagined · a few years from now",fin(t,0.4,0.5)*(1-fin(t,P.dawn,0.4))+fin(t,P.last,0.5)*(1-fin(t,P.end,0.4)));
  gv_end(ctx,S,t,P.end,"An agent that checks","An agent checks what's written. People decide.","Film 9 of 19");
  wc_paperOver(ctx,S);});
