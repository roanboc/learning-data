/* ===== Governed in dbt: the nine chapters =====
   Each chapter is a few shots in the places of plan.js and data governance's rooms.js, cut together with short dissolves (gv_shots).
   Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the
   voice if it's recorded again. Words on screen are on screens, papers, cards, boards and tags, at least 28 px as seen, and above the
   captions. */

// ---- 1 · The rules arrive first: today, Jun's pull request; the rule that waited four months; census day; the check that answers
// in a minute; and the title ----
scene("rules",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({jun:wAt(sc,"loop","Jun Park"),ten:wAt(sc,"loop","ten steps"),q:wAt(sc,"loop","from a question"),
    ver:wAt(sc,"loop","new version"),pr:c.opens-0.3,table:wAt(sc,"opens","a new table"),awards:wAt(sc,"opens","the awards conferred"),slow:c.slowed-0.4,rules:wAt(sc,"slowed","the rules arrive"),
    rule:c.owner-0.4,has:wAt(sc,"owner","has an owner"),months:wAt(sc,"months","four months"),nobody:wAt(sc,"nobody","nobody answers"),
    census:c.census-0.4,fac:wAt(sc,"census","Faculty of Health"),places:wAt(sc,"census","plan its places"),fromJ:wAt(sc,"census","from Jun"),
    toN:wAt(sc,"census","to Noor"),toP:wAt(sc,"census","to Planning"),back:wAt(sc,"census","back to Jun"),change:c.change,
    live:c.live-0.4,runs:wAt(sc,"live","a check runs"),noOwner:wAt(sc,"answers","no owner"),how:wAt(sc,"answers","how to add one"),
    adds:c.adds,two:wAt(sc,"adds","two lines"),green:wAt(sc,"adds","turns green"),itself:c.itself,plan:wAt(sc,"itself","Planning"),by:wAt(sc,"itself","by itself"),
    min:c.minute-0.4,four:wAt(sc,"minute","four months"),check:wAt(sc,"minute","a check that takes"),first:c.first-0.4,arrive:wAt(sc,"first","arrive first"),
    board:c.breath-0.3,title:c.breath+1.2})),
    // the checks on Jun's pull request: each runs, then passes; governance fails first, and passes once the owner is in
    T7=gd_once(sc,"T7",()=>({build:{run:P.runs,pass:P.noOwner-1.2},governance:{run:P.runs+0.15,fail:P.noOwner-0.2,pass:P.green},
      products:{run:P.runs+0.3,pass:P.runs+1.3},reviewers:{run:P.runs+0.45,pass:P.runs+1.6},impact:{run:P.runs+0.6,pass:P.runs+1.9}}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the data team's room, today: Jun at his desk, the board across the room with the series' six cards
    {at:0,place:"data",keys:[[0,1040,520,1.12],[0.4,1100,540,1.22]],d:4.2,draw:(x,tt)=>gd_room(x,tt,{jun:{flip:true}})},
    // the team's poster, close: the loop going round once, from a question to a new version
    {at:P.ten-0.3,place:"poster",keys:[[P.ten-0.3,960,470,1.04]],push:0.03,draw:(x,tt)=>{const [px,py,pw,ph]=GV_PC;
      gu_loopRun(x,px,py,pw,ph,clamp((tt-P.q)/(P.ver+0.6-P.q),0,1));}},
    // his pull request, opened as a draft: what it adds, no reviewers yet, its checks waiting
    {at:P.pr,place:"big",keys:[[P.pr,960,520,1.02],[P.table,960,500,1.05]],d:2.2,draw:(x,tt)=>gd_pr(x,tt,{state:["Draft",GV.grey],hiF:fin(tt,P.table,0.5),
      hiD:fin(tt,P.awards,0.5)})},
    // the room again, closer: his line from Off the shelf
    {at:P.slow,place:"data",keys:[[P.slow,1180,560,1.45]],push:0.02,draw:(x,tt)=>{gd_room(x,tt,{jun:{flip:true,expr:"concerned"}});
      gd_bubble(x,fin(tt,P.rules-0.2,0.35),0.92+0.08*spring(fin(tt,P.rules-0.2,0.5)),["The rules arrive","after I've built it."],0);}},
    // Yusuf's desk: the rule on a card, "owner" underlined; the council's minutes, four months of the same action; then the question
    {at:P.rule,place:"deskGov",keys:[[P.rule,600,415,1.6],[P.months-0.3,960,540,1]],d:1.8,draw:(x,tt)=>{
      gd_rule(x,{u:clamp((tt-P.has)/0.8,0,1),q:fin(tt,P.nobody,0.5)});gd_minutes(x,{at:[0,1,2,3].map(i=>fin(tt,P.months+0.35*i,0.6))});}},
    // census day, on Yusuf's board: Anil's question, and the path he was sent round; the arrows fade when something has to change
    {at:P.census,place:"boardGov",keys:[[P.census,960,500,1.04]],push:0.02,draw:(x,tt)=>gd_census(x,{card:fin(tt,P.census+0.2,0.6),anil:fin(tt,P.fac-0.1,0.5),
      places:clamp((tt-P.places)/1.0,0,1),path:[P.fromJ,P.toN,P.toP,P.back].map(s=>fin(tt,s-0.1,0.5)),dim:fin(tt,P.change,0.8)})},
    // the pull request: the checks run; governance fails, and says what's missing and how to add it; two lines, and it passes; it's
    // ready, and its owners are asked to review, Planning first, by themselves
    {at:P.live,place:"big",keys:[[P.live,960,540,1],[P.runs-0.2,960,640,1.12],[P.adds-0.4,960,540,1],[P.itself,980,480,1.1]],d:1.6,push:0,draw:(x,tt)=>{
      const items=gd_items(tt,T7),fl=fin(tt,P.noOwner-0.2,0.2),ok=fin(tt,P.green,0.3),
        msg=ok>0?[{s:GD_PR.g1,col:GV.greenInk,p:ok},{s:GD_PR.g2,col:GV.greenInk,p:ok}]:fl>0?[{s:GD_PR.m1,col:GV.redInk,p:clamp((tt-P.noOwner)/0.9,0,1)},
          {s:GD_PR.m2a+GD_PR.m2b,col:GV.redInk,p:clamp((tt-P.noOwner-0.6)/0.9,0,1)}]:null;
      gd_pr(x,tt,{state:tt<P.itself?["Draft",GV.grey]:["Open",GV.green],items,msg,how:clamp((tt-Math.max(P.how,P.noOwner+1.6))/0.6,0,1)*(1-fin(tt,P.adds-0.3,0.3)),
        pop:[0,fin(tt,P.green,0.3)*(1-fin(tt,P.green+1.0,0.6)),0,0,0],rev:clamp((tt-P.plan+0.3)/0.9,0,1),glow:1-fin(tt,P.by+0.6,0.8)*0.6});
      gd_ownSheet(x,clamp((tt-P.adds+0.1)/0.8,0,1)*(1-clamp((tt-P.green-0.9)/0.7,0,1)),clamp((tt-P.two)/1.0,0,1),fin(tt,P.two+1.0,0.4));}},
    // Yusuf's desk: four months of minutes in one small pile, beside the check that does it in a minute
    {at:P.min,place:"deskGov",keys:[[P.min,960,540,1],[P.four,1060,460,1.18]],d:1.6,draw:(x,tt)=>{gd_minutes(x,{pile:clamp((tt-P.four)/1.0,0,1)});
      gd_badge(x,1500,380,fin(tt,P.check,0.6));}},
    // the room: Jun's line again, and its words change
    {at:P.first,place:"data",keys:[[P.first,1180,560,1.45]],push:0.02,draw:(x,tt)=>{gd_room(x,tt,{jun:{flip:true,expr:tt>P.arrive?"smile":"calm"}});
      gd_bubble(x,1,1,["The rules arrive","after I've built it."],fin(tt,P.arrive,0.8),["The rules arrive first."]);}},
    // the board, close: the series' six cards; the first lights and lifts, and becomes the title
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>gu_board(x,{lit:[fin(tt,P.board+0.3,0.8)],lift:[fin(tt,P.board+1.0,1.0)]})}],sc.dur));
  wc_year(ctx,56,72,"Today",gv_io(t,0.3,P.ten-0.3,0.4));
  gu_nameCard(ctx,80,760,"Jun Park","analytics engineer",gv_io(t,c.today+1.0,P.ten-0.5,0.4));
  gv_title(ctx,S,t,P.title,"Governed in dbt","owners, contracts and checks in the project","Film 1 of 6 · data governance");});

// ---- 2 · A pin at each step: Yusuf's pins on the poster, and each as a line beside the model's code ----
// the six pins going into the poster as each is named, each with its ring and Yusuf's words
function gd_pinsAt(ctx,tt,P){const [x,y,w,h]=GV_PC;GU_PINS.forEach(([i,lines],j)=>{const t0=P.p[j];gu_goldPin(ctx,i,x,y,w,h,fin(tt,t0-0.25,0.5),clamp((tt-t0)/0.8,0,1),lines,
  lines.map((_,k)=>clamp((tt-(k?P.contract:t0)-0.1)/0.7,0,1)));});}
scene("pins",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({p:[wAt(sc,"pins1","a term"),wAt(sc,"pins1","a class"),wAt(sc,"pins1","an owner"),
    wAt(sc,"pins2","a rule"),wAt(sc,"pins2","an approval"),wAt(sc,"pins2","a version")],contract:wAt(sc,"pins1","a contract"),
    line:c.line-0.4,beside:wAt(sc,"line","a line"),owner:wAt(sc,"learner","its owner"),term:wAt(sc,"learner","the term it holds"),
    cols:c.columns-0.4,ident:wAt(sc,"columns","identifies a person"),test:wAt(sc,"columns","each test"),tOwner:wAt(sc,"columns","has an owner"),
    rev:c.reviewed-0.4,with:wAt(sc,"reviewed","with the code")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the poster, close: a gold pin at each step where a decision enters the loop
    {at:0,place:"poster",keys:[[0,960,470,1.04]],push:0.03,draw:(x,tt)=>gd_pinsAt(x,tt,P)},
    // the desk: the learner table's YAML comes up; its owner and domain light, with Yusuf's pin and the film that decided it; then its term
    {at:P.line,place:"desk",keys:[[P.line,800,440,1.25]],push:0.02,draw:(x,tt)=>{const R=gd_learner(x,clamp((tt-P.line-0.2)/0.9,0,1),[fin(tt,P.owner,0.5),fin(tt,P.term,0.5),fin(tt,P.beside,0.6)]);
      if(!R)return;const ow=R.rows[5],tm=R.rows[7],oe=R.tx+gu_mw(x,GD_LRN[5].s)+30,te=R.tx+gu_mw(x,GD_LRN[7].s)+30;
      gd_flyPin(x,[960,-60],[oe,ow],clamp((tt-P.owner+0.2)/0.9,0,1),"an owner");gu_filmTag(x,oe+200,ow,"Who decides",fin(tt,P.owner+0.6,0.5));
      gd_flyPin(x,[960,-60],[te,tm],clamp((tt-P.term+0.2)/0.9,0,1),"a term");gu_filmTag(x,te+170,tm,"One word, one home",fin(tt,P.term+0.6,0.5));}},
    // three of its columns, each saying whether it identifies a person, its class beside it, and the film that set the classes
    {at:P.cols,place:"desk",keys:[[P.cols,960,520,1]],push:0.02,draw:(x,tt)=>{const R=gd_columns(x,tt,clamp((tt-P.cols)/0.8,0,1),[0,1,2].map(k=>fin(tt,P.ident-0.2+0.25*k,0.5)),
        [0,1,2].map(k=>P.ident+0.2+0.25*k));if(!R)return;const cx=R.tx+gu_mw(x,GD_COLS[1].s)+30+tw(x,"pseudonymous",28,700)+64;
      gd_flyPin(x,[960,-60],[cx,R.rows[1]],clamp((tt-P.ident+0.1)/0.9,0,1),"a class");gu_filmTag(x,1760,690,"Who may see it",fin(tt,P.ident+0.7,0.5),{align:"right"});}},
    // the tests: who owns each, in dbt_project.yml, and the dimension each kind names where it's defined
    {at:P.test-0.3,place:"desk",keys:[[P.test-0.3,960,520,1]],push:0.02,draw:(x,tt)=>{const R=gd_tests(x,clamp((tt-P.test+0.3)/0.8,0,1),fin(tt,P.tOwner,0.5),
        clamp((tt-P.tOwner)/0.8,0,1),fin(tt,P.tOwner+0.6,0.5));
      if(R)gd_flyPin(x,[960,-60],[R.tx+gu_mw(x,GD_TST[4].s)+26,R.rows[4]],clamp((tt-P.tOwner+0.1)/0.9,0,1),"a rule");
      gu_filmTag(x,1840,470,"Rules that run",fin(tt,P.tOwner+0.9,0.5),{align:"right"});}},
    // the pull request's files: the governance lines in the same change as the code
    {at:P.rev,place:"big",keys:[[P.rev,960,540,1]],push:0.02,draw:(x,tt)=>gd_pr(x,tt,{tab:1,lit:fin(tt,P.with,0.6)})}],sc.dur));});

// ---- 3 · Who may build on what: groups and access, a site plan of the project, a ref stopped at the fence, Jun's table that builds ----
scene("access",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({grp:wAt(sc,"groups","Groups"),acc:wAt(sc,"groups","access"),plan:c.private-0.4,
    privS:c.private,pub:wAt(sc,"public","public"),prot:wAt(sc,"public","protected"),priv2:wAt(sc,"stops","a private one"),dbt:wAt(sc,"stops","dbt stops"),
    jun:wAt(sc,"builds","new table"),only:wAt(sc,"builds","only public"),read:wAt(sc,"read","who may read"),next:wAt(sc,"read","the next film")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the desk: the groups, each with its owner, and each layer's access
    {at:0,place:"desk",keys:[[0,960,520,1]],push:0.02,draw:(x,tt)=>gd_accessFiles(x,{g:fin(tt,P.grp,0.5),priv:fin(tt,P.acc,0.5),pub:fin(tt,P.acc+0.3,0.5),prot:fin(tt,P.acc+0.6,0.5)})},
    // the board: the project as a site plan; a sketch reaching for a private step, stopped; Jun's table, built on the core; a key, stopped
    {at:P.plan,place:"board",keys:[[P.plan,960,490,1.02],[P.read-0.3,1100,500,1.1]],d:1.6,draw:(x,tt)=>gd_site(x,tt,{priv:clamp((tt-P.privS-0.1)/1.4,0,1),
      pub:clamp((tt-P.pub+0.1)/0.9,0,1),prot:clamp((tt-P.prot+0.1)/1.0,0,1),try:clamp((tt-P.priv2+0.2)/1.2,0,1),stop:clamp((tt-P.dbt)/0.5,0,1),
      err:clamp((tt-P.dbt-0.1)/1.6,0,1),jun:fin(tt,P.jun-0.3,0.6),refs:clamp((tt-P.only+0.1)/0.9,0,1),sql:clamp((tt-P.only)/1.0,0,1),
      key:clamp((tt-P.read+0.2)/1.4,0,1.5),nextAt:P.next})}],sc.dur));});

// ---- 4 · A promise the build keeps: a contract, a mismatch that stops a build, two versions side by side, and exposures ----
scene("contract",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({con:wAt(sc,"contract","a contract"),cols:wAt(sc,"contract","these columns"),
    types:wAt(sc,"contract","these types"),mis:c.mismatch-0.4,checks:wAt(sc,"mismatch","checks it"),mism:wAt(sc,"mismatch","a mismatch"),stops:wAt(sc,"mismatch","stops the table"),
    ver:c.version-0.4,verS:c.version,newv:wAt(sc,"version","a new version"),old:wAt(sc,"version","the old one"),dateTo:wAt(sc,"version","a date to go"),
    date:wAt(sc,"date","goes on",0.3),exp:c.exposures-0.4,uses:wAt(sc,"exposures","who uses"),answers:wAt(sc,"exposures","who answers")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the desk: the near-award table's columns and types, and the setting that enforces its contract, with Yusuf's pin
    {at:0,place:"desk",keys:[[0,960,520,1]],push:0.02,draw:(x,tt)=>{gd_contract(x,{mart:clamp((tt-0.3)/0.9,0,1),on:fin(tt,P.con,0.5),cols:fin(tt,P.cols,0.5),types:fin(tt,P.types,0.5)});
      gd_flyPin(x,[960,-60],[1180+GU_F.gut+gu_mw(x,"      +contract:")+26,110+GU_F.top+3*GU_F.lh-10],clamp((tt-P.con+0.1)/0.9,0,1),"a contract");}},
    // one line of its SQL changes, and dbt's answer: the contract failed; the table isn't replaced
    {at:P.mis,place:"desk",keys:[[P.mis,960,520,1]],push:0.02,draw:(x,tt)=>gd_mismatch(x,tt,{ch:clamp((tt-P.checks)/0.8,0,1),err:clamp((tt-P.mism)/1.4,0,1),
      rows:fin(tt,P.mism+1.4,0.5),staysAt:P.stops+0.3})},
    // the board: version 2 and its readers, version 1 beside it with its date to go, and Yusuf's pin
    {at:P.ver,place:"board",keys:[[P.ver,960,500,1.02]],push:0.02,draw:(x,tt)=>{gd_versions(x,tt,{rd:clamp((tt-P.verS-0.1)/1.0,0,1),v2:fin(tt,P.newv-0.1,0.6),
      v1:fin(tt,P.old-0.1,0.6),date:fin(tt,P.dateTo,0.5),ring:clamp((tt-P.date)/0.9,0,1)});
      gd_flyPin(x,[960,-60],[1030+gu_mw(x,"core_credential_v1")+40,258],clamp((tt-P.dateTo)/0.9,0,1),"a version");}},
    // the desk: three exposures, who uses each table and who answers for each use
    {at:P.exp,place:"desk",keys:[[P.exp,960,480,1]],push:0.02,draw:(x,tt)=>gd_exposures(x,{at:[0,1,2].map(i=>clamp((tt-P.exp-0.1-0.35*i)/0.7,0,1)),
      use:fin(tt,P.uses,0.5),own:fin(tt,P.answers,0.5)})}],sc.dur));});

// ---- 5 · What this change touches: the impact report on Jun's pull request; Tuesday's relabel, Mei's "breaks", the column instead,
// and a rename that fails ----
scene("impact",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({tch:c.touches,tue:c.tuesday-0.3,six:wAt(sc,"tuesday","or more as awards"),
    rep:c.report-0.4,wrote:wAt(sc,"report","wrote it"),five:wAt(sc,"report","five reports"),four:wAt(sc,"report","four owners"),mei:wAt(sc,"mei","Mei"),
    breaks:wAt(sc,"mei","breaks"),col:c.column-0.4,counts:wAt(sc,"column","counts as an award"),add:c.additive-0.4,addv:wAt(sc,"additive","additive"),
    three:wAt(sc,"additive","three owners"),ren:c.renamed-0.4,fail:wAt(sc,"renamed","would fail")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // Jun's pull request: its description, written by the impact check
    {at:0,place:"big",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{gd_prHead(x,{});gd_report(x,tt,GD_R0,GD_R0.map((_,i)=>P.tch+0.3+0.15*i),{h:330});}},
    // Tuesday: the first draft's change, in the files
    {at:P.tue,place:"big",keys:[[P.tue,960,548,1.04]],push:0.02,draw:(x,tt)=>{gd_tues(x,1,1);gd_relabel(x,fin(tt,P.six,0.5));}},
    // its description: the report fills in, five who use it and four owners to ask; Mei's stamp beside it
    {at:P.rep,place:"big",keys:[[P.rep,960,540,1]],push:0.02,draw:(x,tt)=>{gd_tues(x,0,1);
      // the check writes its report as it's said; then the five who use it light in turn, and the four owners to ask
      gd_report(x,tt,GD_R1,[P.rep+0.5,P.rep+0.65,P.wrote+0.2,P.wrote+0.45,P.wrote+0.7,P.wrote+0.95,P.wrote+1.2,P.wrote+1.45,P.wrote+1.7,P.wrote+1.9],
        {h:484,lit:[0,0,0,...[0,1,2,3,4].map(k=>0.45*fin(tt,P.five+0.18*k,0.35)),0,fin(tt,P.four,0.4)]});
      gv_stamp(x,1500,520,"breaks",fin(tt,P.breaks-0.1,0.45),{col:GV.goldInk,size:52,rot:-0.08});gu_nameCard(x,1320,640,"Mei Tanaka","registrar's office",fin(tt,P.mei-0.1,0.5));}},
    // the second draft: a column added to version 2, its SQL and its YAML
    {at:P.col,place:"big",keys:[[P.col,960,548,1.04]],push:0.02,draw:(x,tt)=>{gd_tues(x,1,5);gd_column(x,{lit:fin(tt,P.counts,0.5),cls:fin(tt,P.counts+0.6,0.5)});}},
    // the report again: additive, and three owners to tell
    {at:P.add,place:"big",keys:[[P.add,960,540,1]],push:0.02,draw:(x,tt)=>{gd_tues(x,0,5);
      gd_report(x,tt,GD_R2,null,{h:470,lit:[0,0,0,fin(tt,P.addv,0.5),0,0,0,0,0,fin(tt,P.three,0.4)]});}},
    // a sketch: the column renamed; the report calls it breaking, and the impact check fails
    {at:P.ren,place:"big",keys:[[P.ren,960,540,1]],push:0.02,draw:(x,tt)=>{gd_tues(x,0,5);const f=fin(tt,P.fail,0.3);
      gd_report(x,tt,GD_R3,null,{h:290,lit:[0,0,0,f,f]});
      gu_checks(x,150,640,1620,{h:200,items:[{name:"impact",st:f>0.5?"fail":"run"}],t:tt,summary:false,msgGap:70,
        msg:[{s:"breaking change to core_credential v2 with no new version",col:GV.redInk,p:clamp((tt-P.fail)/1.0,0,1)}],pop:[f*(1-fin(tt,P.fail+1.2,0.6))]});}}],sc.dur));});

// ---- 6 · Reviews go to the owners: the reviewers file, made from the owners; GitHub asking them; a decision kept as a file ----
scene("owners",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({same:wAt(sc,"made","the same owners"),co:c.script-0.4,writes:wAt(sc,"script","writes"),
    reg:wAt(sc,"script","the registrar's office"),plan:wAt(sc,"script","Planning"),clara:wAt(sc,"script","Clara"),asks:c.asks-0.4,gh:wAt(sc,"asks","asks them"),
    fails:wAt(sc,"asks","a check fails"),behind:wAt(sc,"asks","falls behind"),dec:c.decisions-0.4,files:wAt(sc,"decisions","files too"),
    who:wAt(sc,"decisions","who decided"),when:wAt(sc,"decisions","when"),why:wAt(sc,"decisions","why")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the poster: Yusuf's pins, and the one at review, where an approval enters
    {at:0,place:"poster",keys:[[0,960,470,1.04],[0.2,860,491,1.1]],d:2.6,push:0.01,draw:(x,tt)=>{const [px,py,pw,ph]=GV_PC,[ax,ay]=gu_pinAt(7,px,py,pw,ph);
      gv_halo(x,ax-150,ay-90,300,200,GV.gold,0.9*fin(tt,P.same-0.3,0.6));gu_pins(x,px,py,pw,ph,{});}},
    // the desk: the reviewers file, generated; each line names who reviews a file, joined to the person
    {at:P.co,place:"desk",keys:[[P.co,960,520,1]],push:0.02,draw:(x,tt)=>gd_codeowners(x,{head:fin(tt,P.writes,0.5)*(1-0.6*fin(tt,P.reg,0.5)),
      lit:[fin(tt,P.reg,0.5),fin(tt,P.plan,0.5),fin(tt,P.clara,0.5)],card:[clamp((tt-P.reg)/1.0,0,1),clamp((tt-P.plan)/1.0,0,1),clamp((tt-P.clara)/1.0,0,1)]})},
    // the pull request: its owners asked; the reviewers check fails while the file is behind, then passes
    {at:P.asks,place:"big",keys:[[P.asks,960,540,1],[P.fails-0.3,960,640,1.12]],d:1.6,push:0,draw:(x,tt)=>{const fl=fin(tt,P.fails,0.2),ok=fin(tt,P.behind+1.0,0.3);
      gd_pr(x,tt,{rev:clamp((tt-P.gh+0.2)/0.9,0,1),items:GD_PR.ck.map(n=>({name:n,st:n==="reviewers"&&fl>0.5&&ok<0.5?"fail":"pass"})),
        msg:fl>0&&ok<0.5?[{s:"CODEOWNERS is out of date: run python scripts/generate/codeowners.py",col:GV.redInk,p:clamp((tt-P.fails)/0.9,0,1)}]:null,
        pop:[0,0,0,fl*(1-fin(tt,P.fails+1.2,0.6))+ok*(1-fin(tt,P.behind+2.0,0.6)),0]});}},
    // the desk: a decision as a file, who decided, when and why
    {at:P.dec,place:"desk",keys:[[P.dec,960,480,1]],push:0.02,draw:(x,tt)=>{gd_decision(x,clamp((tt-P.dec-0.2)/0.9,0,1),[fin(tt,P.who,0.5),fin(tt,P.when,0.5),fin(tt,P.why,0.5)]);
      gu_filmTag(x,1600,660,"Who decides",fin(tt,P.who+0.4,0.5),{align:"right"});}}],sc.dur,1));});

// ---- 7 · A check that teaches: what to add and where, the page on how, a rule that warns first, the warnings falling, Anil's column ----
scene("teach",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({what:wAt(sc,"says","what to add"),where:wAt(sc,"says","where"),page:wAt(sc,"says","links a page"),
    who:wAt(sc,"says","who to ask"),warn:c.warns-0.4,warns:wAt(sc,"warns","warns first"),holds:wAt(sc,"holds","what it holds"),dec:wAt(sc,"holds","the first of December"),
    err:wAt(sc,"holds","then an error"),fell:c.fell-0.4,week:wAt(sc,"fell","Week by week"),none:wAt(sc,"fell","to none"),anil:c.anil-0.4,
    showed:wAt(sc,"anil","the check showed"),classify:wAt(sc,"anil","classify it")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the desk: the check's message to Jun, what to add and where, and the page it links, with who to ask
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>{gd_message(x,{what:fin(tt,P.what,0.4),where:fin(tt,P.where,0.4),link:fin(tt,P.page,0.4)});
      gd_howto(x,clamp((tt-P.page)/0.9,0,1),fin(tt,P.who,0.5));}},
    // a new rule's warning, with the day it becomes an error
    {at:P.warn,place:"desk",keys:[[P.warn,960,500,1]],push:0.02,draw:(x,tt)=>{gd_warning(x,clamp((tt-P.warns+0.4)/0.8,0,1),{holds:fin(tt,P.holds,0.4),date:fin(tt,P.dec,0.4),
      err:clamp((tt-P.err)/0.6,0,1)});gd_timeline(x,{a:clamp((tt-P.dec+0.2)/1.0,0,1),date:fin(tt,P.dec+0.3,0.5),err:clamp((tt-P.err)/0.8,0,1)});
      gu_filmTag(x,1820,560,"Teachers of data",fin(tt,P.warns+0.4,0.5),{align:"right"});}},
    // Yusuf's board: the warnings, week by week, down to none
    {at:P.fell,place:"boardGov",keys:[[P.fell,960,470,1.04]],push:0.02,draw:(x,tt)=>gd_chart(x,tt,{at:[0,1,2,3,4].map(i=>clamp((tt-P.week-0.3*i)/0.7,0,1)),
      tick:clamp((tt-P.none)/0.6,0,1)})},
    // the faculty's office: Anil at his desk
    {at:P.anil,place:"faculty",keys:[[P.anil,1000,520,1.2]],push:0.02,draw:(x,tt)=>{gv_behind(x,"anil",GV_FX.seat[0],GV_FX.top,GV_FX.seat[1],{pose:"listen",flip:true,t:tt});
      gd_facDesk(x);}},
    // his screen: the check's message for his new column, his one line, and the check passing
    {at:P.showed-0.3,place:"bigFac",keys:[[P.showed-0.3,960,540,1]],push:0.02,draw:(x,tt)=>gd_anilPR(x,tt,{fail:tt>P.showed,msg:clamp((tt-P.showed)/1.0,0,1),
      lit:fin(tt,P.showed+0.8,0.4),sheet:clamp((tt-P.classify+0.2)/0.7,0,1),typ:clamp((tt-P.classify-0.3)/0.9,0,1),ok:fin(tt,P.classify+1.4,0.3),
      pop:fin(tt,P.classify+1.4,0.3)*(1-fin(tt,P.classify+2.4,0.6))})}],sc.dur));});

// ---- 8 · An agent on every pull request: the skill it follows, its review of Anil's first pull request, the classes it drafted with
// counts, who decides, and the approvals that are people's ----
scene("agent",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({rev:wAt(sc,"reviews","an agent"),skill:wAt(sc,"skill","a skill"),run:wAt(sc,"skill","run the checks"),
    read:wAt(sc,"skill","read what they"),draft:wAt(sc,"skill","draft what's missing"),pr:c.found-0.4,owner:wAt(sc,"found","no owner"),ten:wAt(sc,"found","ten columns"),
    rule:wAt(sc,"found","a rule with no test"),dr:c.drafted-0.4,drS:c.drafted,who:wAt(sc,"drafted","who decides"),
    nv:c.never-0.4,ppl:wAt(sc,"never","People decide")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the desk: the skill the team wrote, its steps lit as they're named
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>{gd_skill(x,tt,clamp((tt-0.6)/0.9,0,1),[fin(tt,P.run,0.4),fin(tt,P.read,0.4),fin(tt,P.draft,0.4),0.5*fin(tt,P.rev,0.5)+0.5*fin(tt,P.skill,0.5)]);
      gu_filmTag(x,1840,846,"An agent that checks",fin(tt,P.rev,0.5),{align:"right"});}},
    // Anil's first pull request: the agent's comment, its three findings
    {at:P.pr,place:"big",keys:[[P.pr,960,540,1]],push:0.02,draw:(x,tt)=>gd_agentPR(x,tt,{view:0,f:[fin(tt,P.owner,0.4),fin(tt,P.ten,0.4),fin(tt,P.rule,0.4)]})},
    // the classes it drafted, with counts, never values; and who decides each finding
    {at:P.dr,place:"big",keys:[[P.dr,960,540,1]],push:0.02,draw:(x,tt)=>gd_agentPR(x,tt,{view:1,rows:[0,1,2].map(k=>fin(tt,P.drS+0.1+0.35*k,0.4)),
      who:[0,1,2].map(k=>fin(tt,P.who+0.25*k,0.4))})},
    // the approvals: the agent's comment, with no tick; each person's yes
    {at:P.nv,place:"big",keys:[[P.nv,960,540,1]],push:0.02,draw:(x,tt)=>gd_agentPR(x,tt,{view:2,ag:fin(tt,P.nv+0.1,0.5),
      yes:[0,1,2].map(k=>clamp((tt-P.ppl-0.1-0.35*k)/0.8,0,1))})}],sc.dur,1));});

// ---- 9 · Carried with the code: Jun's table goes in; the project as a home on Noor's map; his line, changed; the pins and their lines;
// the next film; the end card ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({yes:wAt(sc,"goes","Planning's yes"),map:c.home-0.4,
    home:wAt(sc,"home","the home"),h:[wAt(sc,"home","owners"),wAt(sc,"home","classes"),wAt(sc,"home","contracts"),wAt(sc,"home","tests"),wAt(sc,"home","decisions")],
    plat:wAt(sc,"flow","the platform"),cat:wAt(sc,"flow","the catalogue"),room:c.after-0.4,built:wAt(sc,"after","after he's built it"),
    every:wAt(sc,"every","every change"),poster:c.last-0.4,carries:wAt(sc,"last","carries governance"),board:c.breath-0.3,end:c.breath+1.6}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // Jun's pull request: every check green, Planning's yes, and then it's merged
    {at:0,place:"big",keys:[[0,960,540,1],[P.yes-0.6,980,480,1.1]],d:1.6,draw:(x,tt)=>gd_pr(x,tt,{state:tt<P.yes+0.7?["Open",GV.green]:["Merged",GV.green],stateA:tt<P.yes+0.7?1:fin(tt,P.yes+0.7,0.35),
      items:GD_PR.ck.map(n=>({name:n,st:"pass"})),rev:1,glow:0.4,appr:fin(tt,P.yes,0.5)})},
    // Noor's map: the project, the home of five things, and their copies flowing one way
    {at:P.map,place:"mapClose",keys:[[P.map,960,470,1],[P.home,1140,560,1.04]],d:1.6,draw:(x,tt)=>gd_homeMap(x,tt,{a:clamp((tt-P.home+0.4)/0.8,0,1),
      home:P.h.map(s=>fin(tt,s-0.1,0.5)),flow:[clamp((tt-P.plat+0.3)/0.9,0,1),clamp((tt-P.cat+0.3)/0.9,0,1)],drift:[fin(tt,P.plat+0.8,0.5),fin(tt,P.cat+0.8,0.5)]})},
    // the room: Jun's line from the start, struck through, and its new words
    {at:P.room,place:"data",keys:[[P.room,1180,560,1.45]],push:0.02,draw:(x,tt)=>{gd_room(x,tt,{jun:{flip:true,expr:"smile"}});const mix=fin(tt,P.every-0.2,0.8);
      gd_bubble(x,1,1,["The rules arrive","after I've built it."],mix,["The rules arrive","with every change."]);gd_bubbleStrike(x,1-mix,1,clamp((tt-P.built)/0.8,0,1));}},
    // the poster: the six pins, and under each, the line that keeps it in the project
    {at:P.poster,place:"poster",keys:[[P.poster,960,470,1.04]],push:0.03,draw:(x,tt)=>{gd_pinCodes(x,clamp((tt-P.carries+0.6)/3.0,0,1));}},
    // the board: the next film's card lifts
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.end+0.8)gu_board(x,{lit:[1],lift:[0,fin(tt,P.board+0.5,1.0)]});}}],sc.dur));
  gv_end(ctx,S,t,P.end,"Governed in dbt","The project carries governance with the code.","Film 1 of 6");});
