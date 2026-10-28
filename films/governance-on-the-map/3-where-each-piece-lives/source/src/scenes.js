/* ===== Where each piece lives: the seven chapters =====
   Each chapter is a few shots in the places of plan.js, uni.js, map.js and the series' rooms.js, cut together with short dissolves
   (gv_shots). Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with
   the voice if it's recorded again. Words on screen are on paper, cards, boards and tags, at least 28 px as seen, and above the captions. */

// ---- 1 · Nobody writes in a copy: Korea under the Joseon kings; the annals made, kept in four archives, three burnt in 1592; Jeonju's
// copy carried into the mountains, printed again, kept in five places, aired and checked, read by anyone today; then the same for data ----
scene("copy",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    write:w("daily","write down"),prints:w("king","and prints"),kept:w("same","kept in"),nobody:w("same","and nobody"),notKing:w("same","not even"),three:w("y1592","and three"),
    years:w("gone","a hundred"),what:w("gone","what was"),whom:w("gone","by whom"),why:w("gone","and why"),guard:w("scholars","and guard"),year:w("scholars","for more"),
    capital:w("five","one in"),mount:w("five","four high"),airs:w("climbs","airs"),writes:w("climbs","and writes"),y472:w("survive","four hundred"),kings:w("survive","twenty-five"),
    b888:w("survive","eight hundred"),free:w("today","free"),one:w("rebuild","one source"),way:w("rebuild","one way"),home:w("trusted","from its home"),oneway:w("trusted","one way"),
    checked:w("trusted","checked")};});
  const s2=c.daily-0.3,s2b=P.write-0.2,s3=c.king-0.3,s3b=P.prints-0.2,s4=c.same-0.3,s4b=P.kept-0.3,s4c=P.nobody-0.3,s5=c.y1592-0.3,s5b=P.three-0.3,
    s6=c.left-0.3,s7=c.gone-0.3,s8=c.change-0.3,s9=c.scholars-0.3,s9b=P.guard-0.3,s9c=P.year-0.2,s10=c.again-0.3,s11=c.five-0.3,s12=c.climbs-0.3,s12b=P.airs-0.3,s12c=P.writes-0.3,
    s13=c.survive-0.3,s14=c.today-0.3,s15=c.rebuild-0.3,s16=c.data-0.3,s17=c.breath,M4=["capital","chungju","seongju","jeonju"],M5=["odae","taebaek","myohyang","mani"],
    // the two shots of the cave share one slow camera, so the dissolve between them never lays the scene over itself a little apart
    CAVE=[[s9b,1000,620,1.15],[s9b+0.01,1000,620,1.18]];
  gv_shots(ctx,S,t,sc.dur,[
    // the court in the morning: down the hall from beside the seat, the officials in their rows, the historians at their desks at the left
    {at:0,keys:[[0,960,520,1.0]],push:0.03,draw:(x,tt)=>oh_court(x,tt,{write:0.3})},
    // the historians, closer, at their brushes; then close, from above, a sheet being written
    {at:s2,keys:[[s2,430,640,1.9]],push:0.03,draw:(x,tt)=>oh_court(x,tt,{write:clamp((tt-s2)/4,0.3,0.8)})},
    {at:s2b,keys:[[s2b,960,480,1.0]],push:0.03,draw:(x,tt)=>oh_writeClose(x,tt,clamp((tt-s2b)/5.5,0.05,1))},
    // the office that makes the annals: its members round the long table, the historians' notes in bundles; one reads, one writes
    {at:s3,keys:[[s3,960,500,1.0]],push:0.03,draw:(x,tt)=>oh_office(x,tt)},
    // the printers: the block inked, a sheet laid on it and rubbed, lifted to the pile, which grows
    {at:s3b,keys:[[s3b,1000,480,1.15]],push:0.02,draw:(x,tt)=>oh_print(x,tt,{pile:4+Math.floor((tt-s3b)*0.42)})},
    // four sets, each the same, laid in four chests
    {at:s4,keys:[[s4,960,560,1.0]],push:0.02,draw:(x,tt)=>oh_chests(x,tt,{fill:i=>clamp((tt-s4-0.3-i*0.45)/0.8,0,1)})},
    // the four archives, pinned on the sheet as small views, each with its name
    {at:s4b,keys:[[s4b,960,520,1.0]],push:0.02,draw:(x,tt)=>oh_board(x,tt,{a:k=>clamp((tt-s4b-0.1-M4.indexOf(k)*0.3)/0.5,0,1)})},
    // nobody may change one: a sealed chest, close; a hand in a red sleeve reaches for it, and stops
    {at:s4c,keys:[[s4c,960,560,1.0]],push:0.03,draw:(x,tt)=>{x.drawImage(gv_place("sealRoom"),0,0,W,H);oh_kingHand(x,clamp((tt-P.notKing+0.4)/1.1,0,1),clamp((tt-P.notKing-1.4)/1.2,0,1));}},
    // 1592: men come up the road over the pass; smoke rises beyond the hills
    {at:s5,keys:[[s5,1020,560,1.1],[s5+0.2,1060,580,1.16]],d:3,push:0,draw:(x,tt)=>{x.drawImage(gv_place("road"),0,0,W,H);oh_smoke(x,1500,560,420,tt,clamp((tt-s5)/1.5,0,1),{seed:11});
      oh_smoke(x,380,600,340,tt,clamp((tt-s5-0.6)/1.5,0,1),{seed:13});oh_march(x,tt,(tt-s5)*0.06,clamp((tt-s5)/0.6,0,1));}},
    // three of the four archives burn: smoke over three of the views; Jeonju's stays as it was
    {at:s5b,keys:[[s5b,960,520,1.0]],push:0.02,draw:(x,tt)=>{const b=k=>k==="jeonju"?0:clamp((tt-s5b-0.2-M4.indexOf(k)*0.35)/1.0,0,1);
      oh_board(x,tt,{smoke:b,dim:b,lit:k=>k==="jeonju"?clamp((tt-c.left+0.8)/1,0,1):0});}},
    // Jeonju's archive: the chests in its open bay
    {at:s6,keys:[[s6,960,560,1.0],[s6+0.1,960,520,1.12]],d:4,push:0,draw:(x,tt)=>oh_jeonju(x,tt)},
    // a page of the annals, close: what would be gone
    {at:s7,keys:[[s7,960,520,1.0]],push:0.04,draw:(x,tt)=>{x.drawImage(gv_place("book"),0,0,W,H);
      oh_tagAt(x,tt,P.years,null,960,210,"175 years",Object.assign({size:36},OH_GOLDTAG));
      [[P.what,"what was decided",560],[P.whom,"by whom",960],[P.why,"and why",1360]].forEach(([t0,s,tx])=>oh_tagAt(x,tt,t0,null,tx,840,s,{size:32}));}},
    // something has to change: two scholars of the town come to the archive's gate
    {at:s8,keys:[[s8,960,700,1.5]],push:0.02,draw:(x,tt)=>oh_jeonju(x,tt,{cast:q=>{const u=clamp((tt-s8)/2.2,0,1),m=u<1?0.7:0;
      person(q,"ohAn",lerp(1500,1080,easeCam(u)),1060,0.62,{pose:u<1?"stand":"listen",pose2:Math.sin(tt*5)>0?"walkA":"walkB",mix:m,t:tt,flip:true});
      person(q,"ohSon",lerp(1640,1250,easeCam(u)),1070,0.62,{pose:u<1?"stand":"listen",pose2:Math.sin(tt*5+1)>0?"walkA":"walkB",mix:m,t:tt+1,flip:true});}})},
    // into the mountains: the two scholars lead, the keepers carry the chests up the path towards us
    {at:s9,keys:[[s9,960,560,1.0]],push:0.03,draw:(x,tt)=>{x.drawImage(gv_place("path"),0,0,W,H);oh_walkers(x,tt-s9,[["ohAn",0.56],["ohSon",0.5],["ohK1",0.38,true],["ohK2",0.3,true]],0.06);
      oh_nameCard(x,1480,250,"An Ui · Son Hong-rok","local scholars",gv_io(tt,s9+0.6,s9b-0.2,0.4));}},
    // the cave by night: one keeps watch, the other sleeps; then the snow, and they change over (only once both shots show the same
    // two, so the dissolve between them never lays one pose over another)
    {at:s9b,keys:CAVE,d:s10-s9b,push:0,draw:(x,tt)=>oh_cave(x,tt,{swap:0})},
    {at:s9c,keys:CAVE,d:s10-s9b,push:0,draw:(x,tt)=>oh_cave(x,tt,{snow:true,swap:clamp((tt-s9c-0.9)/1.2,0,1)})},
    // 1603: the court prints them again, from that one copy, open on its stand
    {at:s10,keys:[[s10,880,500,1.12]],push:0.02,draw:(x,tt)=>oh_print(x,tt,{pile:3+Math.floor((tt-s10)*0.42),source:clamp((tt-s10-0.4)/0.8,0,1)})},
    // five sets, far apart: one in the capital, four high in the mountains, a chest landing on each
    {at:s11,keys:[[s11,960,520,1.0]],push:0.02,draw:(x,tt)=>oh_board(x,tt,{five:true,a:k=>clamp((tt-s11-0.2-(M5.indexOf(k)+1)*0.2)/0.5,0,1),
      chest:k=>k==="capital"?clamp((tt-P.capital-0.2)/0.8,0,1):clamp((tt-P.mount-0.4-M5.indexOf(k)*0.25)/0.8,0,1)})},
    // a historian climbs, years later, among the maples; airs the books in the sun; writes down what he finds
    {at:s12,keys:[[s12,960,560,1.0]],push:0.03,draw:(x,tt)=>{x.drawImage(gv_place("pathAutumn"),0,0,W,H);oh_walkers(x,tt-s12,[["ohAir",0.45]],0.08);}},
    {at:s12b,keys:[[s12b,960,520,1.0]],push:0.03,draw:(x,tt)=>oh_airing(x,tt,{books:clamp((tt-s12b+0.4)/2.0,0.2,1)})},
    {at:s12c,keys:[[s12c,960,480,1.0]],push:0.03,draw:(x,tt)=>oh_writeClose(x,tt,clamp((tt-s12c)/3.5,0.05,1),{seed:421,sleeve:[96,110,136]})},
    // the annals survive, complete
    {at:s13,keys:[[s13,960,520,1.0],[s13+0.1,960,540,1.08]],d:6,push:0,draw:(x,tt)=>{x.drawImage(gv_place("shelf"),0,0,W,H);
      [[P.y472,"472 years",560],[P.kings,"25 kings",960],[P.b888,"888 books",1360]].forEach(([t0,s,tx])=>oh_tagAt(x,tt,t0-0.1,null,tx,130,s,Object.assign({size:40},OH_GOLDTAG)));}},
    // today: a reader at a library's screen, a page of the annals on it
    {at:s14,keys:[[s14,960,540,1.0],[s14+0.1,1100,520,1.2]],d:3,push:0,draw:(x,tt)=>{oh_reading(x,tt,{page:clamp((tt-s14-0.3)/0.6,0,1)});oh_tagAt(x,tt,P.free,null,1220,300,"free",OH_GOLDTAG);}},
    // Jeonju's copy could rebuild the rest: gold lines from it to the five
    {at:s15,keys:[[s15,960,500,1.0]],push:0.02,draw:(x,tt)=>oh_board(x,tt,{ring:true,copy:clamp((tt-s15)/0.6,0,1),gold:clamp((tt-P.one+0.3)/2.2,0,1),lit:k=>clamp((tt-P.way)/1.2,0,1)})},
    // the same with data: a home, and copies made from it one way, and checked
    {at:s16,keys:[[s16,960,520,1.0]],push:0.02,draw:(x,tt)=>oh_dataCopies(x,tt,{home:clamp((tt-P.home+0.3)/0.8,0,1),way:clamp((tt-P.oneway+0.2)/1.4,0,1),check:i=>clamp((tt-P.checked-0.1-i*0.25)/0.5,0,1)})}
  ]);
  setScreen(ctx,S);oh_pill(ctx,t,[[0,"Joseon Korea"],[s5,"1592"],[s10,"1603"],[s14,"Today"],[s16,null]],1-fin(t,s17,0.6));
  gv_title(ctx,S,t,s17,"Where each piece lives","one home, and its copies","Film 3 of 3 · data governance");
  wc_paperOver(ctx,S);});

// ---- 2 · Nine days: February; a planner in the Faculty of Business asks to read Planning's product; the table's page on the data platform
// names its owner as Jun, so her request goes to him, and waits; he only built it, and Clara has owned it since October; nine days later he
// passes it on; had he said yes, the wrong person would have decided; the page was typed by hand, and nobody kept it in step ----
scene("nine",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    askTo:w("asks","asks to read"),plan:w("asks","to plan"),own:w("names","its owner"),goes:w("waits","goes to"),wait:w("waits","and waits"),built:w("built","only built"),
    clara:w("since","is Clara"),sees:w("later","sees"),passes:w("later","passes"),yes:w("had","said yes"),isnt:w("had","isn't"),decided:w("had","would have"),
    byHand:w("typed","typed by hand"),nobody:w("typed","nobody")};});
  const s2=P.askTo-0.35,s3=P.wait-0.4,s4=c.since-0.3,s5=c.later-1.3,s6=P.sees+0.3,s7=c.had-0.3,s8=c.typed-0.3;
  gv_shots(ctx,S,t,sc.dur,[
    // the Faculty of Business: a planner at her desk, the data platform's page for the table on her screen
    {at:0,place:"faculty",keys:[[0,1010,520,1.1],[0.1,1040,516,1.14]],d:4,draw:(x,tt)=>{
      gv_behind(x,"ohPlanner",GV_FX.seat[0],GV_FX.top,GV_FX.seat[1],{pose:"listen",t:tt,flip:true});x.drawImage(gv_place("facDesk"),0,0,W,H);
      oh_onScreen(x,GV_FX.screen,q=>oh_tablePage(q,tt,{}));oh_nameCard(x,1330,330,"Planner","Faculty of Business",gv_io(tt,0.6,s2-0.1,0.4));}},
    // her screen, close: she asks to read it, and writes why, and until when; the owner's line, "owner: Jun Park"; her request goes to him
    {at:s2,place:"screenFac",keys:[[s2,960,430,1.0],[s2+0.1,940,424,1.05],[c.names-0.2,780,450,1.38]],d:2.2,draw:(x,tt)=>oh_tablePage(x,tt,{
      press:gv_io(tt,P.askTo+0.05,P.askTo+0.45,0.15),why:clamp((tt-P.plan+0.15)/1.3,0,1),until:clamp((tt-P.plan-1.35)/0.5,0,1),
      ownerLit:gv_io(tt,P.own-0.1,s3+0.5,0.4),sent:fin(tt,P.goes-0.15,0.5),sentText:"request · to Jun Park"})},
    // the data team's room: Jun, busy, on the phone; at his elbow, a pile of requests, hers near the bottom; he built the table
    {at:s3,place:"data",keys:[[s3,1182,540,1.3],[s3+0.1,1190,536,1.33]],d:3,draw:(x,tt)=>{oh_pile(x,1540,668,{lit:fin(tt,s3+0.4,0.6)});
      person(x,"jun",1330,905,0.8,{pose:"phone",t:tt});oh_nameCard(x,960,640,"Jun Park","data team",gv_io(tt,s3+0.4,P.built-0.2,0.4));
      oh_tagAt(x,tt,P.built,null,1050,560,"built the table",{size:30});}},
    // Planning's room: the product's card on the wall, its owner, Clara Jensen, ringed in gold, since October; Clara beside it
    {at:s4,place:"planning",keys:[[s4,900,450,1.2],[s4+0.1,910,446,1.23]],d:3,draw:(x,tt)=>{oh_productCard(x,600,190,{ring:clamp((tt-P.clara+0.1)/0.7,0,1)});
      person(x,"clara",1400,905,0.8,{pose:"listen",pose2:"point",mix:gv_io(tt,P.clara-0.3,s5,0.5),t:tt,flip:true});
      oh_nameCard(x,1400,330,"Clara Jensen","Planning",gv_io(tt,s4+0.4,s5,0.4));oh_tagAt(x,tt,s4+0.6,null,910,620,"since October",OH_GOLDTAG);}},
    // nine days later: the faculty's wall calendar, nine days crossed off one by one, and the day he sees it ringed
    {at:s5,keys:[[s5,960,470,1.0]],push:0.02,draw:(x,tt)=>oh_calendar(x,tt,{cross:clamp((tt-s5-0.3)/0.17,0,9),ring:clamp((tt-P.sees+0.25)/0.5,0,1)})},
    // Jun finds her request, frowns, and passes it on, to Clara
    {at:s6,place:"data",keys:[[s6,1182,540,1.3]],push:0.02,draw:(x,tt)=>{const go=clamp((tt-P.passes+0.1)/0.9,0,1),has=go<=0;oh_pile(x,1540,668,{out:true});
      person(x,"jun",1330,905,0.8,has?{pose:"hold",t:tt,expr:"concerned",carry:oh_heldReq}:{pose:"listen",pose2:"point",mix:gv_io(tt,P.passes-0.1,P.passes+1.6,0.4),t:tt});
      if(!has){const e=easeCam(go);oh_flyCard(x,lerp(1330,1990,e),lerp(640,330,e)-Math.sin(e*Math.PI)*60,0.9,0.1*e,1-clamp((go-0.85)/0.15,0,1));}
      oh_tagAt(x,tt,P.passes+0.35,null,1640,430,"to Clara Jensen",OH_GOLDTAG);}},
    // had he said yes: a pale picture of what didn't happen, his hand on "approve", a gold "no" across it, "not the owner"
    {at:s7,place:"screenData",keys:[[s7,960,470,1.0],[s7+0.1,950,474,1.05]],d:3,draw:(x,tt)=>oh_approve(x,tt,{hand:clamp((tt-P.yes+0.3)/0.8,0,1),no:clamp((tt-P.isnt+0.1)/0.9,0,1),tagAt:P.decided})},
    // the page, close: typed by hand when the table was built, and nobody kept it in step
    {at:s8,place:"screenFac",keys:[[s8,800,415,1.3],[s8+0.1,790,415,1.34]],d:3,draw:(x,tt)=>oh_tablePage(x,tt,{hand:fin(tt,P.byHand-0.1,0.5),amber:fin(tt,P.nobody-0.1,0.6)})}
  ]);
  setScreen(ctx,S);oh_pill(ctx,t,[[0,null],[c.feb-0.25,"February"]],1-fin(t,c.breath,0.5));wc_paperOver(ctx,S);});

// ---- 3 · Seven places: Sam, who runs the data platform, wants its pages to name the right owner, and asks Yusuf where governance's pieces
// live; Yusuf counts seven, and writes a card for each as it's named; three hold a product's owner, and one of them has drifted ----
scene("seven",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    wants:w("sam","and wants"),right:w("sam","the right"),more:w("more","more than"),no:w("drift","no longer")};});
  const s2=P.wants-0.25,s3=c.asks-0.3,s4=c.counts-0.35,K=["arch","gloss","docs","repo","platform","cat","tracker"],
    wr=(tt,i)=>{const t0=c[K[i]]+0.1,t1=Math.max(t0+1.6,sc.ends[K[i]]+0.4);return clamp((tt-t0)/(t1-t0),0,1);};
  gv_shots(ctx,S,t,sc.dur,[
    // the platform team: Sam at the desk; on one screen the planner's request, passed on after nine days; on the other, the table's page
    {at:0,place:"platClose",keys:[[0,1000,520,1.1],[0.1,1030,516,1.13]],d:4,draw:(x,tt)=>{
      gv_behind(x,"sam",GV_PX.seat[0],GV_PX.top,GV_PX.seat[1],{pose:"listen",t:tt,flip:true});x.drawImage(gv_place("platDesk"),0,0,W,H);
      oh_onScreen(x,GV_PX.screens[0],q=>oh_fwdPage(q));oh_onScreen(x,GV_PX.screens[1],q=>oh_tablePage(q,tt,{}));
      oh_nameCard(x,1570,300,"Sam Okafor","platform team",gv_io(tt,0.5,s2-0.1,0.4));oh_tagAt(x,tt,0.9,null,500,300,"waited 9 days",OH_GOLDTAG);}},
    // the table's page, close: the owner's line, "owner: Jun Park", which Sam taps
    {at:s2,place:"screenPlat",keys:[[s2,960,430,1.0],[s2+0.1,820,415,1.3]],d:2.2,draw:(x,tt)=>{oh_tablePage(x,tt,{amber:fin(tt,P.right,0.5)});
      const h=gv_io(tt,P.right-0.5,c.asks-0.6,0.5);if(h>0.01)oh_pointHand(x,lerp(700,610,h),lerp(1150,300,easeCam(h)),"sam");}},
    // Yusuf's office: Sam comes in, and asks where governance's pieces live
    {at:s3,place:"office",keys:[[s3,800,560,1.2],[s3+0.1,810,556,1.23]],d:3,draw:(x,tt)=>{const wk=gv_walk(tt,s3+0.1,60,520,280);
      gv_behind(x,"yusuf",1000,GV_OFF.desk[1],0.8,{standing:true,pose:"listen",t:tt,flip:true});
      gv_walker(x,"sam",wk,905,0.8,wk.moving?{t:tt}:{t:tt,pose:"listen",pose2:"explain",mix:gv_io(tt,wk.end,c.counts-0.6,0.5)});}},
    // his desk, from above: seven blank cards, one for each place; each written as it's named; a gold "owner" on three; one has drifted
    {at:s4,place:"desk",keys:[[s4,1047,491,1.1]],push:0.02,draw:(x,tt)=>{
      const pen=oh_deskCards(x,tt,{lay:i=>(tt-s4-0.3-i*0.2)/0.45,w:i=>wr(tt,i),owner:fin(tt,P.more-0.1,0.5),drift:fin(tt,P.no,0.7)});if(pen)oh_pen(x,pen[0],pen[1]+2,1,0.62);}}
  ]);
  setScreen(ctx,S);wc_paperOver(ctx,S);});

// ---- 4 · One home each: Noor puts each place on her map, as an application, with what it holds; one rule: every piece has one home, where
// it's changed, and an owner, who decides it; every other place keeps a copy, and says where it came from, and when; a product's owner, for
// one; as with the annals, nobody writes in a copy; a fix goes to its home, and every copy follows ----
scene("home",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    asApp:w("puts","as an application"),oneRule:w("rule","one rule"),oneHome:w("every","one home"),anOwner:w("every","an owner"),keeps:w("other","keeps a copy"),
    came:w("other","came from"),lives:w("owner","lives in"),copyIt:w("copyit","copy it"),pf:w("copyit","the platform"),nobody:w("annals","nobody"),
    itsHome:w("fix","its home"),follows:w("fix","follows")};});
  const s2=P.asApp-0.3,s3=c.rule-0.3,s4=c.other-0.3,s5=c.owner-0.3,s6=c.annals-0.3,s7=c.fix-0.3,FROM=["gloss","plat","cat"],
    // the way a fix runs, from the definitions at home on the map to the glossary's copy
    r1=oh_chipRects(ctx,OH_APP("arch"))[2],r2=oh_chipRects(ctx,OH_APP("gloss"))[0],LIT=[[r1[0]+r1[2]+6,r1[1]+r1[3]/2],[r2[0]-6,r2[1]+r2[3]/2]],
    // the three shots of the map in a row share one slow camera, so a dissolve never lays the map over itself a little apart
    MK=[[s2,960,514,1.05],[s2+0.01,960,514,1.08]];
  gv_shots(ctx,S,t,sc.dur,[
    // Noor's room: she puts each of the seven places on her map, in its application band
    {at:0,place:"noor",keys:[[0,900,520,1.15],[0.1,920,516,1.18]],d:4,draw:(x,tt)=>{oh_roomCards(x,i=>(tt-0.6-i*0.3)/0.4);
      person(x,"noor",1420,905,0.8,{pose:"listen",pose2:"reach",mix:gv_io(tt,0.4,s2-0.2,0.5),t:tt,flip:true});
      oh_nameCard(x,1420,330,"Noor Rahman","data architect",gv_io(tt,0.5,s2-0.1,0.4));}},
    // her map, close: each place a card, with the pieces it holds
    {at:s2,place:"ohMap",keys:MK,d:s5-s2,push:0,draw:(x,tt)=>oh_map(x,{card:k=>(tt-s2-0.1-OH_APPS.findIndex(a=>a.k===k)*0.16)/0.5})},
    // one rule: every piece has one home, where it's changed, and an owner, who decides it
    {at:s3,place:"ohMap",keys:MK,d:s5-s2,push:0,draw:(x,tt)=>{oh_map(x,{home:fin(tt,P.oneHome,0.6),dim:fin(tt,s3+0.1,0.5)});
      oh_ruleTable(x,tt,{a:fin(tt,P.oneRule-0.2,0.5),piece:i=>fin(tt,c.every+0.1+i*0.22,0.4),home:i=>fin(tt,P.oneHome-0.1+i*0.22,0.4),owner:i=>fin(tt,P.anOwner-0.1+i*0.22,0.4)});}},
    // every other place keeps a copy, dashed, and says where it came from, and when
    {at:s4,place:"ohMap",keys:MK,d:s5-s2,push:0,draw:(x,tt)=>oh_map(x,{home:1,copy:fin(tt,P.keeps,0.6),from:k=>fin(tt,P.came-0.1+FROM.indexOf(k)*0.2,0.5),
      cardLit:k=>FROM.includes(k)?gv_io(tt,P.keeps,s5,0.5)*0.7:0})},
    // a product's owner, for one: at home in the data team's repository; the catalogue copies it, from the repository; the platform's page
    // was typed by hand
    {at:s5,keys:[[s5,960,540,1.0]],push:0.03,draw:(x,tt)=>oh_ownerCopies(x,tt,{home:fin(tt,s5+0.2,0.6),homeLit:gv_io(tt,P.lives,c.copyit,0.5),copies:fin(tt,c.copyit-0.1,0.7),
      way:clamp((tt-P.copyIt+0.6)/0.8,0,1),tag:fin(tt,P.copyIt+0.1,0.5),hand:fin(tt,P.pf+0.6,0.5),platLit:fin(tt,P.pf+0.6,0.6)})},
    // as with the annals: the sealed chest, and a hand that reaches for it, and stops
    {at:s6,place:"sealRoom",keys:[[s6,960,560,1.0]],push:0.03,draw:(x,tt)=>oh_kingHand(x,clamp((tt-s6-0.2)/1.1,0,1),clamp((tt-P.nobody-0.3)/1.2,0,1))},
    // a fix goes to its home: a pen at the map's definitions, and a light runs out to the glossary's copy; the camera holds still, so the
    // next chapter, which opens on the map as it's framed here, dissolves in without laying the map over itself a little apart
    {at:s7,place:"ohMap",keys:[[s7,960,514,1.05]],push:0,draw:(x,tt)=>{const pn=gv_io(tt,P.itsHome-0.3,P.follows+0.9,0.4);
      oh_map(x,{home:1,copy:1,from:1,chip:(k,i)=>k==="arch"&&i===2?{lit:pn,pen:pn}:k==="gloss"&&i===0?{green:fin(tt,P.follows-0.1,0.5)}:null});
      oh_flow(x,LIT,1,{dash:[3,9],a:0.4,lw:3,noHead:true});oh_lightAt(x,LIT,clamp((tt-P.itsHome-0.2)/1.1,0,1),gv_io(tt,P.itsHome+0.1,P.follows+0.2,0.3));}}
  ]);
  setScreen(ctx,S);oh_pill(ctx,t,[[0,null],[s6,"Joseon Korea"],[s7,null]],1);wc_paperOver(ctx,S);});

// ---- 5 · One way: the flows between the places, each one way: definitions from the map to the glossary, and on to every tool that reads
// them; the map's concepts to the data team's tables; each column's class to the platform, where it sets who may read it; each product's
// promise to the catalogue; nothing flows back; a copy is never a home ----
scene("way",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    defGo:w("defs","go from"),gloss:w("defs","the glossary"),u0:w("tools","the data team"),u1:w("tools","the dashboards"),u2:w("tools","the assistant"),
    cMap:w("concepts","concepts"),learner:w("concepts","a learner"),award:w("concepts","an award"),tables:w("concepts","tables"),clGo:w("class","goes from"),
    clPlat:w("class","to the platform"),sets:w("class","sets who"),prGo:w("promise","goes from"),cat:w("promise","the catalogue"),back:w("back","back")};});
  const U=[P.u0,P.u1,P.u2],g=(tt,t0,t1)=>gv_io(tt,t0,t1,0.4),
    // when each flow is drawn, how long it takes, and until when it stays lit
    ON={defs:[P.defGo,1.0,c.tools],use0:[P.u0-0.7,0.6,c.concepts-0.5],use1:[P.u1-0.7,0.6,c.concepts-0.5],use2:[P.u2-0.7,0.6,c.concepts-0.5],
      concepts:[P.cMap,0.9,c.class-0.5],classes:[P.clGo,0.8,c.promise-0.5],promises:[P.prGo,1.4,c.back-0.4]},
    // which chip lights, from when to when, as its flow is said: [card, chip, from, to]
    CL=[["arch",2,c.defs,c.tools],["gloss",0,P.gloss,c.concepts-0.5],["arch",1,c.concepts,c.class-0.5],["repo",4,P.tables,c.class-0.5],["repo",2,c.class,c.promise-0.5],
      ["plat",1,P.clPlat+0.3,c.promise-0.5],["plat",2,P.sets,c.promise-0.5],["repo",3,c.promise,c.back-0.4],["cat",1,P.cat,c.back-0.4]];
  gv_shots(ctx,S,t,sc.dur,[
    // Noor's map: each flow drawn as it's named, lit while it's said, the chips at its two ends lit with it
    {at:0,place:"ohMap",keys:[[0,960,514,1.05]],push:0.03,draw:(x,tt)=>{const nw=fin(tt,c.never+0.1,0.6);
      oh_map(x,{home:1,copy:1,from:1,use:i=>fin(tt,U[i]-0.1,0.5),useLit:i=>Math.max(g(tt,U[i]-0.1,c.concepts-0.5)*0.8,nw*0.7),
        flow:k=>ON[k]?clamp((tt-ON[k][0])/ON[k][1],0,1):0,flowLit:k=>ON[k]?g(tt,ON[k][0],ON[k][2]):0,back:clamp((tt-c.back-0.1)/0.9,0,1),cross:clamp((tt-P.back-0.1)/0.5,0,1),
        chip:(k,i)=>{let lit=0;for(const [ck,ci,t0,t1] of CL)if(ck===k&&ci===i)lit=Math.max(lit,g(tt,t0,t1));if(!OH_APP(k).chips[i][1])lit=Math.max(lit,nw*0.75);return{lit};}});
      // a learner and an award, two of the map's concepts, travel down to the data team's tables
      const cp=[oh_chipAt(x,"arch",1),OH_FLOWS.concepts[0],OH_FLOWS.concepts[1],oh_chipAt(x,"repo",4)];
      [[P.learner,"a learner"],[P.award,"an award"]].forEach(([t0,s])=>{const u=clamp((tt-t0)/1.5,0,1);if(u<=0||u>=1)return;const [X,Y]=oh_along(cp,easeCam(u));
        withA(x,Math.min(1,u*5,(1-u)*5),()=>wc_tag(x,X+24,Y-30,s,{align:"left",size:28,wash:GV.gold,washA:0.5,col:GV.goldInk}));});
      // a column's class, as the series draws it, slides along to the platform, where it sets who may read it
      const kp=[oh_chipAt(x,"repo",2),OH_FLOWS.classes[0],OH_FLOWS.classes[1],oh_chipAt(x,"plat",1)],ku=clamp((tt-P.clGo-0.3)/1.4,0,1),ka=Math.min(1,ku*6)*(1-fin(tt,c.promise-0.6,0.4));
      if(ku>0&&ka>0.01){const [X,Y]=oh_along(kp,easeCam(ku));withA(x,ka,()=>{x.save();x.translate(X-64,Y-44);gv_classChip(x,0,0,"direct",{size:28});x.restore();});}}}
  ]);
  setScreen(ctx,S);wc_paperOver(ctx,S);});

// ---- 6 · Found by a check: a copy can still drift, if someone types into it or a sync stops; every night a check compares each copy with
// its home; the first night it finds three names wrong; the sync puts them right by morning, and each owner is told; drift is found, not
// remembered, as the historians climbed to each archive; here a check does it every night ----
scene("check",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    types:w("drift","if someone"),stops:w("drift","a sync stops"),every:w("night","every night"),old:w("first","the old owner"),page:w("first","the table's"),
    two:w("first","two more"),hand:w("first","typed by hand"),right:w("morning","right by"),tells:w("morning","tells each"),wrote:w("climbed","wrote down")};});
  const s2=P.types-0.3,s3=P.stops-0.4,s4=c.night-0.3,sR=P.page-0.4,s5=c.finds-0.3,s6=c.climbed-0.3,s7=P.wrote-0.3,s8=c.here-0.3,
    // the check walks each flow in turn, from its home to the copies it feeds, and looks at each copy there
    WALK=["defs","use0","use1","use2","concepts","classes","promises"],TO={defs:[["gloss",0]],concepts:[["repo",4]],classes:[["plat",0],["plat",1]],promises:[["cat",0],["cat",1]]},
    w0=k=>P.every-0.3+WALK.indexOf(k)*0.62,dawn=tt=>clamp((tt-c.morning+0.3)/2.2,0,1),
    // the two shots of the map at night share one slow camera, so the dissolve between them never lays the map over itself a little apart
    MK=[[s3,960,514,1.05],[s3+0.01,960,514,1.08]],
    // the map at night: the board dark, the cards a little dimmer; dawn lifts it
    night=(x,tt,fn)=>{oh_night(x,1,dawn(tt));fn(x);oh_night(x,0.4,dawn(tt));};
  gv_shots(ctx,S,t,sc.dur,[
    // night on the floor where the work is done: the offices dark, nobody there
    {at:0,place:"floor",keys:[[0,960,540,1.0],[0.1,960,530,1.04]],d:4,draw:(x,tt)=>{oh_floor(x,tt,{out:Object.keys(OH_AT),names:0.6});oh_night(x,1);}},
    // someone types into a copy: the owner's line on the platform's page, in the dark
    {at:s2,place:"screenPlat",keys:[[s2,820,415,1.3]],push:0.02,draw:(x,tt)=>{oh_night(x,0.9);oh_tablePage(x,tt,{typed:clamp((tt-s2-0.3)/1.0,0,1)});}},
    // a sync stops: the light along one of the map's arrows flickers, and goes out
    {at:s3,place:"ohMap",keys:MK,d:sR-s3,push:0,draw:(x,tt)=>{const off=clamp((tt-P.stops-0.4)/0.8,0,1),fl=off<=0?1:off<1?(Math.sin(tt*38)>0?0.9:0.15):0;
      night(x,tt,q=>oh_map(q,{home:1,copy:1,from:1,use:1,flow:k=>k==="promises"?0:1}));
      oh_flow(x,OH_FLOWS.promises,1,off>=1?{col:WC_PENCIL,dash:[8,10],a:0.55}:{lit:fl});if(off<1)oh_lightAt(x,OH_FLOWS.promises,((tt-s3)*0.7)%1,fl);}},
    // every night, a check walks each arrow in turn and compares each copy with its home; the first night it stops at the platform's page
    {at:s4,place:"ohMap",keys:MK,d:sR-s3,push:0,draw:(x,tt)=>{const am=fin(tt,P.old-0.1,0.5);
      night(x,tt,q=>oh_map(q,{home:1,copy:1,from:1,use:1,flow:1,useLit:i=>{const t0=w0("use"+i)+0.5;return gv_io(tt,t0,t0+0.6,0.2)*0.8;},
        chip:(k,i)=>{let lit=0;for(const f of WALK)for(const [ck,ci] of (TO[f]||[]))if(ck===k&&ci===i){const t0=w0(f)+0.5;lit=Math.max(lit,gv_io(tt,t0,t0+0.6,0.2)*0.8);}
          return k==="plat"&&i===0?{lit,amber:am}:{lit};}}));
      WALK.forEach(f=>{const u=(tt-w0(f))/0.55;if(u>0&&u<1)oh_lightAt(x,OH_FLOWS[f],u,Math.min(1,u*6,(1-u)*6)+0.2);});
      // the first night: once more along to the platform's page, where it stops
      const u2=(tt-P.old+0.9)/0.75;if(u2>0&&u2<1.6)oh_lightAt(x,OH_FLOWS.classes,Math.min(u2,1),Math.min(1,u2*6)*(1-fin(tt,P.old+0.4,0.4)));
    }},
    // what it found, on the platform's screen in the dark: the table's page and two more; by morning, as the light comes up, they're put
    // right, and a note goes to each owner
    {at:sR,place:"screenPlat",keys:[[sR,960,420,1.04],[sR+0.1,960,416,1.1]],d:9,draw:(x,tt)=>{oh_night(x,0.9,dawn(tt));
      oh_checkPage(x,tt,{row:i=>fin(tt,i?P.two+0.1+(i-1)*0.35:P.page,0.5),hand:fin(tt,P.hand,0.5),fix:i=>fin(tt,P.right-0.1+i*0.35,0.6),note:i=>fin(tt,P.tells-0.1+i*0.3,0.5)});}},
    // the morning: Yusuf's office; on his board, beside the photograph of Noor's map, the night's sheet: three put right
    {at:s5,place:"office",keys:[[s5,900,380,1.5],[s5+0.1,910,376,1.54]],d:3,draw:(x,tt)=>{oh_officeSheet(x,fin(tt,c.finds+0.4,0.6));
      person(x,"yusuf",1230,905,0.8,{pose:"listen",pose2:"reach",mix:gv_io(tt,s5+0.1,c.finds+1.0,0.5),t:tt,flip:true});}},
    // as the historians climbed to each archive: the books aired on their racks, and what he found, written down
    {at:s6,keys:[[s6,960,520,1.0]],push:0.03,draw:(x,tt)=>oh_airing(x,tt,{books:clamp((tt-s6+0.6)/1.6,0.2,1)})},
    {at:s7,keys:[[s7,960,480,1.0]],push:0.03,draw:(x,tt)=>oh_writeClose(x,tt,clamp((tt-s7)/3.0,0.05,1),{seed:421,sleeve:[96,110,136]})},
    // here, a check does it every night: the floor in the dark, a light going from room to room; the camera draws back to the whole
    // floor, framed as the next chapter opens on it by day, so the two dissolve into each other without doubling
    {at:s8,place:"floor",keys:[[s8,960,530,1.03],[s8+0.1,960,540,1.0]],d:4,push:0,draw:(x,tt)=>{oh_floor(x,tt,{out:Object.keys(OH_AT),names:0.6});oh_night(x,1);
      for(let i=0;i<5;i++){const t0=s8+0.5+i*0.5,a=gv_io(tt,t0,t0+0.7,0.25);if(a>0.01){const [sx,sy]=oh_floorScr(i);x.save();x.globalCompositeOperation="screen";wc_glowAt(x,sx+40,sy+25,90,[255,214,140],0.8*a);x.restore();}}}}
  ]);
  setScreen(ctx,S);oh_pill(ctx,t,[[0,null],[s6,"Joseon Korea"],[s8,null]],1);wc_paperOver(ctx,S);});

// ---- 7 · Theirs to change: each team still works in its own tool, and knows which copy is its own to change, and which only to read; the
// planner's next request goes straight to Clara, who decides it in a day; Noor's map becomes the plan for the next series; the annals
// lasted; one home for every piece, and every copy can be trusted ----
scene("theirs",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    toChange:w("knows","theirs to change"),toRead:w("knows","only to read"),straight:w("next","goes straight"),toClara:w("next","to Clara"),decides:w("next","decides"),
    inADay:w("next","in a day"),series:w("plan","the next series"),eachOf:w("plan","each of its"),every:w("lasted","every copy"),oneHome:w("give","one home"),
    same:w("reads","the same"),request:w("reads","every request")};});
  const s2=c.knows-0.3,s3=c.next-0.3,s4=P.toClara-0.3,s5=c.plan-0.3,s6=c.lasted-0.3,s7=P.every+0.6,s8=c.give-0.3,s9=c.reads-0.3,
    // each team's own tool on its screen: Planning's reports, the registrar's office at the glossary, governance at the map, the data team
    // at its repository, the platform team at the platform
    TOOL=[GV.green,[96,140,200],GV.gold,[150,120,190],[70,160,150]],K=k=>OH_APPS.findIndex(a=>a.k===k);
  gv_shots(ctx,S,t,sc.dur,[
    // the floor by day: each team at its own screens
    {at:0,place:"floor",keys:[[0,960,540,1.0],[0.1,960,530,1.03]],d:4,draw:(x,tt)=>oh_floor(x,tt,{under:q=>oh_floorScreens(q,i=>fin(tt,0.3+i*0.2,0.4),i=>TOOL[i])})},
    // Noor's map: a pen at each piece's home, theirs to change; an eye at each copy, only to read
    {at:s2,place:"ohMap",keys:[[s2,960,514,1.05],[s2+0.1,960,514,1.07]],d:4,draw:(x,tt)=>oh_map(x,{home:1,copy:1,from:1,use:1,flow:1,useEye:fin(tt,P.toRead-0.1,0.5),
      chip:(k,i)=>OH_APP(k).chips[i][1]?{pen:fin(tt,P.toChange-0.2+K(k)*0.08,0.5)}:{eye:fin(tt,P.toRead-0.2+K(k)*0.08,0.5)}})},
    // the planner's next request: the page names Clara now, from the repository, and the request goes straight to her
    {at:s3,place:"screenFac",keys:[[s3,960,430,1.0],[s3+0.1,880,430,1.2]],d:2,draw:(x,tt)=>oh_tablePage(x,tt,{owner:"Clara Jensen",from:1,press:gv_io(tt,c.next+0.2,c.next+0.6,0.15),
      sent:fin(tt,P.straight-0.2,0.5),sentText:"request · to Clara Jensen",sentCol:GV.gold,sentInk:GV.goldInk})},
    // Planning's room: Clara reads it, and approves it, in a day
    {at:s4,place:"planning",keys:[[s4,1100,520,1.25],[s4+0.1,1110,516,1.28]],d:3,draw:(x,tt)=>{oh_productCard(x,600,190,{ring:0});
      person(x,"clara",1400,905,0.8,{pose:"hold",t:tt,carry:oh_heldReq,flip:true});
      oh_tagAt(x,tt,P.decides+0.1,null,1400,400,"approved · until 30 June",{size:30,wash:GV.green,washA:0.45,col:GV.greenInk});}},
    // the plan for the next series: over Noor's map, a card for each part its films build, in the tools
    {at:s5,place:"ohMap",keys:[[s5,960,514,1.05]],push:0.02,draw:(x,tt)=>{oh_map(x,{home:1,copy:1,from:1,use:1,flow:1,flowLit:gv_io(tt,s5+0.2,P.series,0.4),dim:fin(tt,P.series-0.4,0.6)});
      oh_nextCards(x,tt,{head:fin(tt,P.series+0.1,0.5),card:i=>fin(tt,P.eachOf+i*0.28,0.5)});}},
    // the annals lasted: the long shelf of books; and a reader today, at her screen
    {at:s6,place:"shelf",keys:[[s6,960,540,1.0],[s6+0.1,960,530,1.05]],d:4},
    {at:s7,keys:[[s7,960,540,1.0],[s7+0.1,1100,520,1.2]],d:3,push:0,draw:(x,tt)=>oh_reading(x,tt,{page:1})},
    // one home for every piece: the map, each home solid, each copy dashed, each arrow with one head, the platform's page put right
    {at:s8,place:"ohMap",keys:[[s8,960,514,1.05],[s8+0.1,960,514,1.08]],d:4,draw:(x,tt)=>oh_map(x,{home:1,copy:1,from:1,use:1,flow:1,flowLit:fin(tt,P.oneHome-0.2,0.8)*0.8,
      chip:(k,i)=>k==="plat"&&i===0?{green:fin(tt,s8+0.3,0.6)}:null})},
    // everyone reads the same thing: the same page on every screen on the floor; and a request goes to the one who decides it
    {at:s9,place:"floor",keys:[[s9,960,540,1.0],[s9+0.1,960,530,1.03]],d:4,draw:(x,tt)=>{
      oh_floor(x,tt,{under:q=>oh_floorScreens(q,()=>1,i=>mix(TOOL[i],GV.gold,fin(tt,P.same-0.2+i*0.12,0.5)))});
      const u=clamp((tt-P.request)/1.3,0,1);if(u>0&&u<1){const e=easeCam(u);oh_flyCard(x,lerp(1960,GV_FL.spot(0)+40,e),lerp(520,560,e)-Math.sin(e*Math.PI)*90,0.6,0,Math.min(1,u*5,(1-u)*5));}}}
  ]);
  setScreen(ctx,S);oh_pill(ctx,t,[[0,null],[s3,"8 March"],[P.inADay,"9 March"],[s5,null],[s6,"Joseon Korea"],[s7,"Today"],[s8,null]],1-fin(t,c.breath,0.4));
  gv_end(ctx,S,t,c.breath+0.2,"Where each piece lives","One home for every piece. Every copy follows it.","Film 3 of 3");
  if(t>c.breath+1.4)withA(ctx,fin(t,c.breath+1.6,0.8),()=>wc_tag(ctx,960,780,"Next: Governance you can use",{align:"center",size:30,w:600}));
  wc_paperOver(ctx,S);});

const WC_PLACES={court:oh_paintCourt,deskTop:oh_paintDeskTop,annalsOffice:oh_paintOffice,print:oh_paintPrint,chestRoom:oh_paintChests,board:oh_paintBoard,sealRoom:oh_paintSealRoom,
  road:oh_paintRoad,archive:oh_paintArchive,book:oh_paintBook,path:c=>oh_paintPath(c,{}),cave:c=>oh_paintCave(c,{}),caveSnow:c=>oh_paintCave(c,{snow:true}),
  pathAutumn:c=>oh_paintPath(c,{autumn:true}),airing:oh_paintAiring,shelf:oh_paintShelf,library:oh_paintLibrary,
  // the university, as the series paints it
  faculty:gv_paintFaculty,facDesk:gv_paintFacultyDesk,screenFac:c=>gv_paintScreenDesk(c,GV_ROOM.fac),data:c=>gv_paintData(c,{}),screenData:c=>gv_paintScreenDesk(c,GV_ROOM.data),
  planning:gv_paintPlanning,boardPlan:c=>gv_paintBoardClose(c,GV_ROOM.plan),platClose:gv_paintPlatformClose,platDesk:gv_paintPlatformDesk,screenPlat:c=>gv_paintScreenDesk(c,GV_ROOM.plat),
  office:gv_paintOffice,desk:gv_paintDesk,floor:gv_paintFloor,noor:gv_paintNoor,ohMap:oh_paintMap};
