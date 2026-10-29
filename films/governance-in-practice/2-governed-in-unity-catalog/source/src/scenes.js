/* ===== Governed in Unity Catalog: the nine chapters =====
   Each chapter is a few shots in the places of plan.js and data governance's rooms.js, cut together with short dissolves (gv_shots).
   Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the
   voice if it's recorded again. Words on screen are on screens, papers, cards, boards and tags, at least 28 px as seen, and above the
   captions. */

// Mei at her desk in the registrar's office, as Who may see it seats her; then the desk in front, and the learner table on her screen
function gc_regRoom(x,tt,o){gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],Object.assign({pose:"listen",t:tt},o||{}));x.drawImage(gv_place("registrarDesk"),0,0,W,H);
  const [sx,sy,sw,sh]=GV_RX.screen;gv_screen(x,sx,sy,sw,sh,"core_learner_v1",null,{barH:44,titleSize:28});gv_lines(x,sx+30,sy+90,sw-80,6,36,0.8);}
// Planning's wall screen, as Clara reads the learner table there: too small to read, on purpose
function gc_planScreen(x){const [sx,sy,sw,sh]=GV_PL.screen;gv_screen(x,sx,sy,sw,sh,"core_learner_v1",null,{barH:46,titleSize:28});gc_gridRows(x,sx+30,sy+90,sw-60,7);}
// the column Sam protects at the end, on his right-hand screen: mobile, tagged direct, and masked
function gc_mobile(u){return(q,rx,ry,rw)=>{wc_T(q,"mobile",rx+30,ry+120,{w:500,size:28,f:"mono",col:WC_DARK});gv_classChip(q,rx+60+gu_mw(q,"mobile"),ry+110,"direct");
  if(u<1)wc_T(q,"+44 7700 900417",rx+30,ry+214,{w:500,size:28,f:"mono",col:WC_INK,deco:u>0?1:0});gv_mask(q,rx+16,ry+176,rw-60,52,u,{size:28});};}

// ---- 1 · Which column: today, in the platform team's room; who can read the learner table; Sam's line; the old path, given by hand;
// forty-one people; then each build's tags, one policy, groups until a date; and the title ----
scene("which",(ctx,S,t,sc)=>{const c=sc.cues,P=gc_once(sc,"P",()=>({sam:wAt(sc,"runs","Sam Okafor"),yus:c.asks,tab:wAt(sc,"asks","with every")-0.3,
    nm:wAt(sc,"asks","name"),em:wAt(sc,"asks","email"),sn:wAt(sc,"asks","student number"),
    slow:c.slowed-0.4,first:wAt(sc,"slowed","first asked"),said:wAt(sc,"slowed","Sam said"),tell:wAt(sc,"slowed","tell me"),
    nob:c.nobody-0.3,all:wAt(sc,"nobody","all or nothing"),hand:wAt(sc,"nobody","given by hand")-0.2,
    form:wAt(sc,"path","a form"),mail:wAt(sc,"path","an emailed"),weeks:wAt(sc,"path","three weeks"),whole:wAt(sc,"path","the whole table"),
    one:wAt(sc,"path","to one person"),noend:wAt(sc,"path","no end date"),
    forty:c.forty-0.4,fortyW:wAt(sc,"forty","forty-one"),nine:c.nine,change:c.change,
    now:c.now-0.3,id:wAt(sc,"now","identify"),cls:wAt(sc,"now","the classes"),
    pol:c.policy-0.3,stars:wAt(sc,"policy","stars"),every:wAt(sc,"policy","on every table")-0.3,yet:wAt(sc,"policy","not built yet"),
    grp:c.groups-0.3,dec:c.december,two:wAt(sc,"december","two groups"),
    built:c.built-0.3,prot:wAt(sc,"built","protected"),min:c.minutes-0.3,which:wAt(sc,"minutes","tells him which"),
    board:c.breath-0.3,title:c.breath+1.2})),
    // the order the tags land in: the three direct columns as "identify a person" is said, then the code, then the status
    LAND=[0.8,0.4,0.2,0,1.2];
  gv_shots(ctx,S,t,sc.dur,gc_run([
    // the platform team's room, today: Sam at his desk, Yusuf standing behind him; Yusuf asks who can read the learner table
    {at:0,place:"platform",keys:[[0,960,540,1],[0.1,1000,530,1.05]],d:4,draw:(x,tt)=>{gc_room(x,tt);
      gu_nameCard(x,1000,676,"Sam Okafor","data platform",gv_io(tt,P.sam,P.yus-0.2,0.4));gu_nameCard(x,980,110,"Yusuf Demir","data governance lead",gv_io(tt,P.yus+0.1,P.tab+0.4,0.4));
      gc_say(x,tt,P.yus+0.6,P.tab+0.4,1380,60,["Who can read","the learner table?"],1760,290);}},
    // the learner table's page: its sample data, every learner's name, email and student number lit as they're named
    {at:P.tab,place:"big",keys:[[P.tab,960,540,1]],push:0.02,draw:(x,tt)=>{gc_tablePage(x);gc_grid(x,tt,{vlit:[0,fin(tt,P.sn,0.4),fin(tt,P.nm,0.4),fin(tt,P.em,0.4),0]});}},
    // the room again: what Yusuf first asked, and Sam's line from Off the shelf
    {at:P.slow,place:"platform",keys:[[P.slow,1000,500,1.06]],push:0.02,draw:(x,tt)=>{gc_room(x,tt,{sam:{pose2:"explain",mix:gv_io(tt,P.tell-0.2,P.nob,0.4),expr:"concerned"}});
      gc_say(x,tt,P.first,P.said,1380,60,["What slows you down?"],1760,290);gc_bubble(x,gv_io(tt,P.tell-0.1,P.nob+0.6,0.35),0.92+0.08*spring(fin(tt,P.tell-0.1,0.5)),0);}},
    // the page: nobody had said which columns identify a person; all or nothing
    {at:P.nob,place:"big",keys:[[P.nob,960,540,1]],push:0.02,draw:(x,tt)=>{gc_tablePage(x);const al=fin(tt,P.all,0.5)*0.7;
      gc_grid(x,tt,{q:clamp((tt-P.nob-0.3)/1.2,0,1),vlit:[al,al,al,al,al]});}},
    // Yusuf's desk, as it was: the form, the emailed approval, three weeks, the whole table on a key, to one person, no end date
    {at:P.hand,place:"deskGov",keys:[[P.hand,960,540,1],[P.form,900,520,1.04]],d:2,push:0.02,draw:(x,tt)=>{gc_memory(x,fin(tt,P.hand,0.8));
      gc_oldPath(x,{form:fin(tt,P.form-0.1,0.5),mail:fin(tt,P.mail,0.5),wait:fin(tt,P.weeks-0.1,0.5),weeks:clamp((tt-P.weeks)/1.4,0,1),key:fin(tt,P.whole,0.5),
        one:fin(tt,P.one,0.5),noend:clamp((tt-P.noend)/0.8,0,1)});}},
    // today again, on the Permissions tab: forty-one people; nine have moved on; all of it dims, because something had to change
    {at:P.forty,place:"big",keys:[[P.forty,960,540,1]],push:0.02,draw:(x,tt)=>gc_grants(x,tt,{fill:clamp((tt-P.fortyW+0.2)/1.6,0,1),grey:fin(tt,P.nine+0.3,0.8),dim:fin(tt,P.change,0.8)})},
    // now: each build tags the columns, from the classes in the project (the opening film's)
    {at:P.now,place:"big",keys:[[P.now,960,540,1]],push:0.02,draw:(x,tt)=>{gc_tablePage(x);gc_grid(x,tt,{chip:LAND.map(d=>clamp((tt-P.id-d)/0.9,0,1)),from:GC_COLS.map(([c,cls,cx])=>[cx,428]),bend:0});
      gu_filmTag(x,1750,172,"Governed in dbt",fin(tt,P.cls,0.5),{align:"right"});}},
    // one policy: stars in those columns
    {at:P.pol,place:"big",keys:[[P.pol,960,540,1]],push:0.02,draw:(x,tt)=>{gc_tablePage(x);gc_grid(x,tt,{chip:[1,1,1,1,1],mask:clamp((tt-P.stars)/1.4,0,1)});
      gc_policyCard(x,1150,100,fin(tt,P.pol+0.4,0.6));}},
    // on every table in the catalog, even tables not built yet
    {at:P.every,place:"big",keys:[[P.every,960,540,1]],push:0.02,draw:(x,tt)=>{gc_cabinet(x,tt,{band:clamp((tt-P.every-0.2)/1.2,0,1)});gc_policyCard(x,1150,100,1);
      gc_newTable(x,tt,{a:fin(tt,P.yet-0.3,0.8)});}},
    // access goes to groups, until a date; by the end of December, two groups
    {at:P.grp,place:"big",keys:[[P.grp,960,540,1]],push:0.02,draw:(x,tt)=>{gc_grants(x,tt,{grey:1,gather:clamp((tt-P.grp-0.1)/2.2,0,1),dec:clamp((tt-P.dec)/1.6,0,1)});
      wc_hand(x,"end of December",1762,228,{size:30,w:700,align:"right",col:GV.goldInk,p:clamp((tt-P.dec)/0.8,0,1)});}},
    // each new table, protected as it's built
    {at:P.built,place:"big",keys:[[P.built,960,540,1]],push:0.02,draw:(x,tt)=>{gc_cabinet(x,tt,{band:1});gc_policyCard(x,1150,100,1);
      gc_newTable(x,tt,{a:1,tag:clamp((tt-P.built-0.3)/0.9,0,1),mask:clamp((tt-P.prot)/1.0,0,1)});}},
    // the room: Sam's line, with a tick, because the project tells him which column
    {at:P.min,place:"platform",keys:[[P.min,1000,500,1.06]],push:0.02,draw:(x,tt)=>{gc_room(x,tt,{sam:{expr:"smile"},yusuf:{expr:tt>P.which?"smile":"calm"}});
      gc_bubble(x,fin(tt,P.min+0.2,0.35),0.92+0.08*spring(fin(tt,P.min+0.2,0.5)),fin(tt,P.which,0.8));}},
    // the board, close: the series' six cards; the second lights and lifts, and becomes the title
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.title+0.8)gu_board(x,{lit:[0,fin(tt,P.board+0.3,0.8)],lift:[0,fin(tt,P.board+1.0,1.0)]});}}],sc.dur));
  wc_year(ctx,56,72,"Today",gv_io(t,0.3,P.tab-0.3,0.4));wc_year(ctx,56,72,"Until now",gv_io(t,P.hand+0.4,P.forty-0.2,0.4));
  gv_title(ctx,S,t,P.title,"Governed in Unity Catalog","access, masks and audit on the platform","Film 2 of 6 · data governance");});

// ---- 2 · Laid out by area: the catalog's drawers, a schema for each layer; each table's area as a tag, from its model's domain; the
// Discover page, by area; and a grant, to a group, never to a person ----
scene("area",(ctx,S,t,sc)=>{const c=sc.cues,P=gc_once(sc,"P",()=>({tabs:wAt(sc,"catalog","the project's tables"),sch:wAt(sc,"catalog","a schema"),layer:wAt(sc,"people","not by layer"),
    tag:c.tag,as:wAt(sc,"tag","as a tag"),dom:wAt(sc,"tag","from the domain"),names:wAt(sc,"tag","names"),
    disc:c.discover-0.3,lays:wAt(sc,"discover","lays the tables"),ar:["student","course","planning","finance"].map(s=>wAt(sc,"discover",s)),more:wAt(sc,"discover","and more"),
    gr:c.grant-0.3,grp:wAt(sc,"grant","goes to a group"),nv:wAt(sc,"grant","never to a person")}));
  gv_shots(ctx,S,t,sc.dur,gc_run([
    // the university's catalog, as a cabinet: a drawer for each layer the project builds; but people don't look by layer; the learner
    // table lifts, its area on a tag beside it, from the domain its model names
    {at:0,place:"big",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const lift=fin(tt,P.tag,0.8);gc_cabinet(x,tt,{dr:[0,1,2,3,4].map(i=>fin(tt,P.tabs+0.25*i,0.6)),lab:gv_io(tt,P.sch,c.people,0.5),learner:lift});
      const q=gv_io(tt,P.layer,P.tag+0.4,0.4);[0,1,3].forEach((i,k)=>gc_redQ(x,GC_DX(i)+GC_DW/2,470,52,clamp((tt-P.layer-0.15*k)/0.5,0,1)*q));
      const [cx,cy]=gc_cardAt(0,4),st=fin(tt,P.as,0.6);if(st>0.01)gc_arrow(x,[cx+36,cy-70],[cx+80,cy-46],10,st,{head:false,lw:2.4,a:0.8});gc_keyOnly(x,cx+80,cy-46,"student",st);
      gc_domainSheet(x,clamp((tt-P.dom+0.2)/0.9,0,1),fin(tt,P.names,0.5));}},
    // the Discover page: the tables laid out by area
    {at:P.disc,place:"big",keys:[[P.disc,960,540,1]],push:0.02,draw:(x,tt)=>{const on=k=>k<4?P.ar[k]:P.more+0.2*(k-4);
      gc_discover(x,tt,{tile:[0,1,2,3,4,5].map(k=>fin(tt,P.lays+0.12*k,0.5)),fill:[0,1,2,3,4,5].map(k=>clamp((tt-on(k)+0.1)/0.7,0,1)),
        lit:[0,1,2,3,4,5].map(k=>gv_io(tt,on(k)-0.1,on(k)+1.0,0.3))});}},
    // the learner table's grants: each to a group; never to a person
    {at:P.gr,place:"big",keys:[[P.gr,960,540,1]],push:0.02,draw:(x,tt)=>gc_perms(x,tt,{rows:[fin(tt,P.grp,0.5),fin(tt,P.grp+0.3,0.5),0],clara:fin(tt,P.nv-0.2,0.6),off:clamp((tt-P.nv-1.4)/1.0,0,1),claraAt:2})}],sc.dur));});

// ---- 3 · A tag from the class: the classes in the project; dbt writing each as a tag; the governed tag, with its three values; a class
// changed, and the next build; and, for tables the project doesn't build, the classifier ----
scene("tag",(ctx,S,t,sc)=>{const c=sc.cues,P=gc_once(sc,"P",()=>({cs:wAt(sc,"classes","class says"),d:wAt(sc,"classes","direct"),p:wAt(sc,"classes","pseudonymous"),n:wAt(sc,"classes","none"),
    wr:c.writes-0.3,after:wAt(sc,"writes","After each table builds"),dbt:wAt(sc,"writes","dbt writes"),wc:wAt(sc,"writes","writes the class"),plat:wAt(sc,"writes","to the platform"),asTag:wAt(sc,"writes","as a tag"),col:wAt(sc,"writes","on the column")-0.3,
    gov:c.governed-0.3,admin:wAt(sc,"governed","an admin"),three:wAt(sc,"governed","only those three values"),nob:wAt(sc,"governed","nobody can"),maybe:wAt(sc,"governed","maybe"),
    nx:c.next-0.3,chg:wAt(sc,"next","Change a class"),nb:wAt(sc,"next","the next build"),ct:wAt(sc,"next","changes the tag"),
    cl:c.classifier-0.3,finds:wAt(sc,"classifier","finds columns"),owner:wAt(sc,"classifier","their owner"),toClass:wAt(sc,"classifier","to class")})),
    LAND=[0.6,0.3,0.15,0,0.9];
  gv_shots(ctx,S,t,sc.dur,gc_run([
    // the learner table's columns in the project, each with its class (Who may see it's)
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>{gc_classSheet(x,tt,clamp((tt-0.2)/0.9,0,1),[fin(tt,P.d,0.5),fin(tt,P.p,0.5),fin(tt,P.n,0.5)],[P.d,P.p,P.n]);
      gu_filmTag(x,1840,846,"Who may see it",fin(tt,P.cs,0.5),{align:"right"});}},
    // what writes it: the hook after each table builds, and the macro's line that tags each column
    {at:P.wr,place:"desk",keys:[[P.wr,960,500,1]],push:0.02,draw:(x,tt)=>gc_macroSheets(x,{u1:clamp((tt-P.wr)/0.8,0,1),u2:clamp((tt-P.dbt+0.2)/0.8,0,1),hook:fin(tt,P.after+0.3,0.5),
      tag:fin(tt,P.wc+0.2,0.5),runs:clamp((tt-P.plat+0.1)/1.0,0,1)})},
    // the platform: each column's tag lands on it
    {at:P.col,place:"big",keys:[[P.col,960,540,1]],push:0.02,draw:(x,tt)=>gc_columns(x,tt,{chip:LAND.map(d=>clamp((tt-P.col-0.4-d)/0.9,0,1))})},
    // the governed tag: three values, set once by an admin; "maybe" is refused
    {at:P.gov,place:"big",keys:[[P.gov,960,540,1]],push:0.02,draw:(x,tt)=>gc_govTag(x,tt,{lock:fin(tt,P.admin,0.6),vals:fin(tt,P.three,0.5),try:clamp((tt-P.nob)/0.9,0,1),
      no:clamp((tt-P.maybe-0.3)/1.0,0,1)})},
    // a class changed in the project, and the next build changes the tag
    {at:P.nx,place:"desk",keys:[[P.nx,960,500,1]],push:0.02,draw:(x,tt)=>{x.save();x.translate(0,110);gc_change(x,tt,{ch:clamp((tt-P.chg)/1.0,0,1),arrow:clamp((tt-P.nb)/0.8,0,1),next:clamp((tt-P.ct)/1.0,0,1)});x.restore();}},
    // a table the project doesn't build: the classifier's suggestion, for its owner to class
    {at:P.cl,place:"big",keys:[[P.cl,960,540,1]],push:0.02,draw:(x,tt)=>gc_survey(x,tt,{sug:fin(tt,P.finds,0.6),own:fin(tt,P.owner,0.6),cls:clamp((tt-P.toClass-0.2)/0.8,0,1)})}],sc.dur,1));});

// ---- 4 · One policy, by tag: the policy's page; every table, even tomorrow's; a row filter, the other kind; Clara's stars; and who sees
// the values ----
scene("policy",(ctx,S,t,sc)=>{const c=sc.cues,P=gc_once(sc,"P",()=>({masks:wAt(sc,"masks","masks"),tagged:wAt(sc,"masks","tagged direct"),whole:wAt(sc,"masks","the whole catalog"),
    every:wAt(sc,"masks","for everyone"),but:wAt(sc,"masks","but the registrar's office"),
    tm:c.tomorrow-0.3,tbt:wAt(sc,"tomorrow","table by table"),built:wAt(sc,"tomorrow","a table built"),soon:wAt(sc,"tomorrow","as soon as"),tagd:wAt(sc,"tomorrow","tagged"),
    rw:c.rows-0.3,filter:wAt(sc,"rows","filter rows"),one:wAt(sc,"rows","this one masks"),
    cl:c.clara-0.3,sees:wAt(sc,"clara","and sees")-0.3,status:wAt(sc,"clara","status"),stars:wAt(sc,"clara","stars"),
    val:c.values-0.3,sv:wAt(sc,"values","sees the values"),ident:wAt(sc,"values","the identity")}));
  gv_shots(ctx,S,t,sc.dur,gc_run([
    // the policy's page: what it masks, when, in the whole catalog, for everyone but the registrar's office
    {at:0,place:"big",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gc_policy(x,tt,{lit:[fin(tt,P.every,0.5),fin(tt,P.but,0.5),fin(tt,P.tagged,0.5),fin(tt,P.masks,0.5)],sub:fin(tt,P.whole,0.5)})},
    // not table by table: a lock on each table gives way to the one policy; a table built tomorrow is masked as soon as it's tagged
    {at:P.tm,place:"big",keys:[[P.tm,960,540,1]],push:0.02,draw:(x,tt)=>{gc_cabinet(x,tt,{band:1,locks:clamp((tt-P.tm-0.2)/1.0,0,1),sweep:clamp((tt-P.tbt-0.1)/1.0,0,1)});
      gc_policyCard(x,1150,100,1,{lock:fin(tt,P.tbt+0.7,0.5)});gc_newTable(x,tt,{a:fin(tt,P.built-0.2,0.8),tag:clamp((tt-P.soon)/0.9,0,1),mask:clamp((tt-P.tagd)/1.0,0,1)});}},
    // the policy again: a row filter, the other kind; this one masks
    {at:P.rw,place:"big",keys:[[P.rw,960,540,1]],push:0.02,draw:(x,tt)=>gc_policy(x,tt,{kind:gv_io(tt,P.filter,P.one+0.3,0.4)})},
    // Planning: Clara reads the learner table on her wall screen
    {at:P.cl,place:"planning",keys:[[P.cl,900,480,1.08]],push:0.02,draw:(x,tt)=>{gc_planScreen(x);person(x,"clara",440,905,0.8,{pose:"point",pose2:"listen",mix:fin(tt,P.cl+1.2,0.6),t:tt});
      gu_nameCard(x,120,560,"Clara Jensen","Planning",gv_io(tt,P.cl+0.3,P.sees+0.4,0.4));}},
    // her query, close: each learner's status, and stars where the names and emails are
    {at:P.sees,place:"bigPlan",keys:[[P.sees,960,540,1]],push:0.02,draw:(x,tt)=>gc_query(x,tt,{title:"Clara's query",sub:"Clara Jensen · Planning",rows:clamp((tt-P.sees-0.1)/0.8,0,1),
      masked:true,mask:1,lit:[0,fin(tt,P.status,0.5),fin(tt,P.stars,0.5),fin(tt,P.stars+0.2,0.5)]})},
    // the registrar's office sees the values, and so does the build's identity
    {at:P.val,place:"bigReg",keys:[[P.val,960,540,1]],push:0.02,draw:(x,tt)=>{gc_query(x,tt,{title:"Mei's query",sub:"Mei Tanaka · registrar's office",lit:[0,0,fin(tt,P.sv,0.5),fin(tt,P.sv+0.2,0.5)]});
      gc_buildCard(x,1200,112,fin(tt,P.ident,0.6));}}],sc.dur));});

// ---- 5 · The scrambled key: the student number through sha-256; the same code in every table; scrambled isn't anonymous; the registrar's
// list matched; still personal, readable for counting, with a purpose and an end date ----
scene("key",(ctx,S,t,sc)=>{const c=sc.cues,P=gc_once(sc,"P",()=>({sn:wAt(sc,"code","the student number"),scr:wAt(sc,"code","scrambled"),every:wAt(sc,"code","in every table"),
    join:wAt(sc,"code","joined"),anon:wAt(sc,"anon","anonymous"),ls:c.list-0.3,run:wAt(sc,"list","scramble every number"),match:wAt(sc,"list","match them"),
    st:c.still-0.3,still:wAt(sc,"still","still personal"),count:wAt(sc,"still","for counting"),purpose:wAt(sc,"still","a purpose")}));
  gv_shots(ctx,S,t,sc.dur,gc_run([
    // the machine: the student number in, the code out, the same in three tables, joined without names; "anonymous" struck through
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>gc_scramble(x,tt,{in:clamp((tt-P.sn+0.2)/1.2,0,1),out:clamp((tt-P.scr)/1.0,0,1),tables:clamp((tt-P.every)/1.2,0,1),
      same:fin(tt,P.join-0.4,0.6),join:clamp((tt-P.join)/1.2,0,1),anon:clamp((tt-P.anon)/1.2,0,1)})},
    // the registrar's list through the same machine: one code matches a row Clara sees, and says who that is
    {at:P.ls,place:"desk",keys:[[P.ls,960,500,1]],push:0.02,draw:(x,tt)=>gc_regList(x,tt,{run:clamp((tt-P.run)/2.0,0,1),match:clamp((tt-P.match+0.3)/0.6,0,1),who:clamp((tt-P.match-0.2)/0.8,0,1)})},
    // Planning's list: still personal; counted; and what reading it takes
    {at:P.st,place:"bigPlan",keys:[[P.st,960,540,1]],push:0.02,draw:(x,tt)=>gc_nearList(x,tt,{still:fin(tt,P.still,0.6),count:clamp((tt-P.count)/1.2,0,1),card:fin(tt,P.purpose,0.6)})}],sc.dur));});

// ---- 6 · Groups, with an end date: Mei's yes, on the form; a grant to the Planning group, not to Clara; the directory, its drawers,
// and its sync; someone changing jobs; and Clara's card leaving on 15 December ----
scene("groups",(ctx,S,t,sc)=>{const c=sc.cues,P=gc_once(sc,"P",()=>({top:c.yes-0.3,yes:wAt(sc,"yes","said yes"),toC:wAt(sc,"yes","to Clara"),plan:wAt(sc,"yes","to plan"),
    until:wAt(sc,"yes","until the fifteenth"),gr:c.grants-0.3,toC2:wAt(sc,"grants","to Clara"),grp:wAt(sc,"joins","a Planning group"),
    join:wAt(sc,"joins","and Clara joins")-0.3,dir:wAt(sc,"joins","the university's directory"),date:wAt(sc,"joins","until that date"),
    reads:wAt(sc,"reads","reads its groups"),jobs:wAt(sc,"jobs","changes jobs"),moves:wAt(sc,"jobs","moves them"),follows:wAt(sc,"jobs","access follows"),
    ends:wAt(sc,"ends","ends by itself")}));
  gv_shots(ctx,S,t,sc.dur,gc_run([
    // the registrar's office: Mei, with Clara's request
    {at:0,place:"registrar",keys:[[0,900,540,1],[0.1,940,520,1.06]],d:3,draw:(x,tt)=>{gc_regRoom(x,tt);gu_nameCard(x,830,560,"Mei Tanaka","registrar's office",gv_io(tt,0.4,P.top-0.3,0.4));}},
    // the request, on the university's form: Mei's yes, for a purpose, until a date (Who may see it's form)
    {at:P.top,place:"regTop",keys:[[P.top,960,540,1]],push:0.02,draw:(x,tt)=>{gc_reqPaper(x,460,100,{hi:i=>[fin(tt,P.toC,0.4),fin(tt,P.plan,0.4),fin(tt,P.until,0.4),fin(tt,P.gr-0.6,0.4)][i],
        ok:clamp((tt-P.yes)/1.2,0,1)});gu_filmTag(x,1690,300,"Who may see it",fin(tt,P.top+0.6,0.5),{align:"center"});}},
    // the learner table's grants: not to Clara; to a Planning group
    {at:P.gr,place:"big",keys:[[P.gr,960,540,1]],push:0.02,draw:(x,tt)=>gc_perms(x,tt,{rows:[1,1,fin(tt,P.grp,0.6)],lit:[0,0,gv_io(tt,P.grp+0.2,P.join+0.6,0.5)],
      clara:fin(tt,P.gr+0.4,0.6),off:clamp((tt-P.toC2-0.2)/1.0,0,1),claraAt:2})},
    // the university's directory, a drawer for each group: Clara's card into Planning's, with its date; the platform reads it; someone
    // moves from the registrar's office to Finance, and their access follows; on 15 December, her card leaves by itself
    {at:P.join,place:"index",keys:[[P.join,960,540,1]],push:0.02,draw:(x,tt)=>{const sy=clamp((tt-P.reads)/0.9,0,1),pu=clamp((tt-P.follows)/1.2,0,1);
      gc_index(x,tt,{lit:[gv_io(tt,P.moves,P.follows+0.8,0.4),0,gv_io(tt,P.join+0.4,P.reads,0.5)+gv_io(tt,P.ends-0.2,P.ends+2.2,0.4),gv_io(tt,P.moves+0.6,P.follows+0.8,0.4)],sync:sy,pulse:pu});
      gc_card(x,2,"Clara Jensen",clamp((tt-P.join-0.4)/1.0,0,1)*(1-clamp((tt-P.ends)/1.2,0,1)),{date:"until 15 Dec",wash:GV.gold});
      gc_card(x,0,"A. Moreau",gv_io(tt,P.jobs-0.4,P.moves,0.6));gc_card(x,3,"A. Moreau",fin(tt,P.moves+0.6,0.9),{dx:80});}}],sc.dur));
  wc_year(ctx,56,72,"15 December 2026",gv_io(t,P.ends-0.6,sc.dur,0.4));});

// ---- 7 · Down to the column: the learner's email, picked, and every table it flows into; tags following lineage, in beta; each table
// classed in the project; and the check that stops one that isn't ----
scene("lineage",(ctx,S,t,sc)=>{const c=sc.cues,P=gc_once(sc,"P",()=>({email:wAt(sc,"pick","email"),every:wAt(sc,"pick","every table"),beta:wAt(sc,"beta","follow lineage"),
    nd:wAt(sc,"need","every table")-0.3,built:wAt(sc,"need","built by the project"),classes:wAt(sc,"need","classes it there"),
    stp:c.stops-0.3,check:wAt(sc,"stops","the check"),stops:wAt(sc,"stops","stops")}));
  gv_shots(ctx,S,t,sc.dur,gc_run([
    // the lineage view: the email, and the column it flows into; Planning's and Finance's lists get no names or emails
    {at:0,place:"big",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gc_lineage(x,tt,{pick:clamp((tt-P.email)/1.4,0,1),none:fin(tt,P.every+0.6,0.6),beta:clamp((tt-P.beta)/2.4,0,1)})},
    // the wallet's learners in the project: the email, classed there too (the opening film's check)
    {at:P.nd,place:"desk",keys:[[P.nd,960,500,1]],push:0.02,draw:(x,tt)=>{gc_walletSheet(x,clamp((tt-P.nd)/0.8,0,1),fin(tt,P.classes,0.5));
      gu_filmTag(x,1840,846,"Governed in dbt",fin(tt,P.built,0.5),{align:"right"});}},
    // a table with an email nobody classed, stopped by the check
    {at:P.stp,place:"desk",keys:[[P.stp,960,500,1]],push:0.02,draw:(x,tt)=>gc_unclassed(x,tt,{u:clamp((tt-P.stp)/0.6,0,1),q:fin(tt,P.check,0.5),err:clamp((tt-P.stops)/1.6,0,1)})}],sc.dur));});

// ---- 8 · Who read this, and when: the audit log, in preview; who read the learner table this month; December's access review; forty-one
// names folded away; two groups ----
scene("audit",(ctx,S,t,sc)=>{const c=sc.cues,P=gc_once(sc,"P",()=>({who:wAt(sc,"log","who read"),who2:wAt(sc,"answer","who read"),rv:c.review-0.3,dec:wAt(sc,"review","Each December"),
    reads:wAt(sc,"review","reads the grants"),whos:wAt(sc,"review","who's in it"),gave:c.gave,gw:wAt(sc,"gave","gave way"),two:wAt(sc,"gave","two groups"),
    reg:wAt(sc,"two","the registrar's office"),data:wAt(sc,"two","the data team")}));
  gv_shots(ctx,S,t,sc.dur,gc_run([
    // the audit log: who read the learner table this month, and when
    {at:0,place:"big",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gc_sql(x,tt,GC_AUD,{rows:clamp((tt-P.who)/1.2,0,1),lit:[0,1,2].map(i=>gv_io(tt,P.who2+0.3*i,c.review-0.4,0.5))})},
    // the access review: which groups can read it, and who's in each; the forty-one names folded away; two groups stay
    // the printed sheet covers the right of the page while it's up: the notes and the date step back, and return as it folds away
    {at:P.rv,place:"big",keys:[[P.rv,960,540,1]],push:0.02,draw:(x,tt)=>{const cn=1-gv_io(tt,P.gave-0.8,P.gw+0.6,0.4),cd=1-gv_io(tt,P.gave-0.8,P.gw+1.5,0.4);
      gc_sql(x,tt,GC_REV,{rows:clamp((tt-P.reads)/1.2,0,1),notes:[fin(tt,P.whos,0.5)*cn,fin(tt,P.whos+0.3,0.5)*cn,fin(tt,P.whos+0.15,0.5)*cn],
        strike:[0,clamp((tt-P.two)/1.0,0,1),0],lit:[fin(tt,P.data,0.5),0,fin(tt,P.reg,0.5)]});
      withA(x,cd,()=>wc_hand(x,"December 2026",1762,180,{size:32,w:700,align:"right",col:GV.goldInk,p:clamp((tt-P.dec)/0.8,0,1)}));
      gc_print41(x,{a:fin(tt,P.gave-0.6,0.5),fold:clamp((tt-P.gw)/1.6,0,1)});}}],sc.dur));});

// ---- 9 · What the metadata says: Clara's plan, with stars; where each piece lives, on Noor's map; Sam's line, ticked; the next film; the
// end card ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=gc_once(sc,"P",()=>({mp:c.map-0.3,says:wAt(sc,"map","the project says"),tags:wAt(sc,"flow","become tags"),pol:wAt(sc,"flow","one policy"),
    grp:wAt(sc,"flow","groups carry"),dates:wAt(sc,"flow","the dates"),sm:c.sam-0.3,which:wAt(sc,"sam","tells him which"),board:c.breath-0.3,end:c.breath+1.6}));
  gv_shots(ctx,S,t,sc.dur,gc_run([
    // Planning: Clara at her wall screen, next term's places by faculty, with stars where the names are
    {at:0,place:"planning",keys:[[0,900,470,1.08],[0.1,880,430,1.2]],d:4,draw:(x,tt)=>{gc_planWall(x,tt);person(x,"clara",440,905,0.8,{pose:"point",pose2:"ease",mix:fin(tt,2.4,0.8),expr:"smile",t:tt});}},
    // Noor's map: where each piece lives; classes become tags, tags meet one policy, and groups carry the dates
    {at:P.mp,place:"mapClose",keys:[[P.mp,960,540,1]],push:0.02,draw:(x,tt)=>gc_metaMap(x,tt,{a:clamp((tt-P.mp)/0.8,0,1),flow:clamp((tt-P.says)/1.0,0,1),tag:fin(tt,P.tags,0.6),
      pol:fin(tt,P.pol,0.6),grp:fin(tt,P.grp,0.6),dir:clamp((tt-P.dates)/1.0,0,1)})},
    // the platform team's room: Sam's line, ticked; a new column protected in minutes
    {at:P.sm,place:"platform",keys:[[P.sm,1000,500,1.06]],push:0.03,draw:(x,tt)=>{gc_room(x,tt,{sam:{expr:"smile"},yusuf:{expr:"smile",pose2:"ease",mix:fin(tt,P.which,0.8)},s1:"columns",
        draw1:gc_mobile(clamp((tt-P.sm-0.6)/1.0,0,1))});gc_bubble(x,fin(tt,P.sm+0.2,0.35),0.92+0.08*spring(fin(tt,P.sm+0.2,0.5)),fin(tt,P.which,0.8));}},
    // the board: the next film's card lifts
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.end+0.8)gu_board(x,{lit:[0,1],lift:[0,0,fin(tt,P.board+0.5,1.0)]});}}],sc.dur));
  gv_end(ctx,S,t,P.end,"Governed in Unity Catalog","The platform enforces what the metadata says.","Film 2 of 6");});
