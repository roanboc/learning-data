/* ===== A capability, not a project: the eight chapters =====
   Each chapter is a few shots in the places of plan.js, holland.js, board.js, storm.js, uni.js and the series' rooms.js, cut together with
   short dissolves (gv_shots). Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the
   pictures stay with the voice if it's recorded again. Words on screen are on paper, cards, boards, tags and speech bubbles, at least 28 px
   as seen, and above the captions. */

// ---- 1 · Behind the dike: Holland around 1300, the water boards, and Rijnland's board since 1255; then the university today ----
// the landowners' stretches along the crest, each staked with its owner's colour and house mark
const CP_TS=[{x0:-10.25,x1:0.75,col:CP_OWN[0],mark:0},{x0:0.75,x1:6.75,col:CP_OWN[1],mark:1},{x0:6.75,x1:10.25,col:CP_OWN[2],mark:2}];
// the board and the landowners on the crest in the morning: the board facing us, with their staffs, the landowners from behind
function cp_gathering(x,tt){for(const [id,X,Z,o] of [["cpClerk",1.25,8.9,{pose:"cp_tally",carry:cp_heldTally({n:2})}],["cpBoardA",-0.75,8.4,{pose:"cp_staff",carry:cp_heldStaff()}],
    ["cpBoardB",0.75,8.2,{pose:"cp_staff",carry:cp_heldStaff()}],["cpReeve",0.0,7.7,{pose:"cp_staff",carry:cp_heldStaff()}]])cp_onCrest(x,id,X,Z,Object.assign({t:tt},o));
  for(const [id,X,Z] of [["cpOwnerC",-0.25,5.4],["cpOwner",-1.2,4.2],["cpOwnerB",1.25,3.9]])cp_onCrest(x,id,X,Z,{t:tt,back:true});}
// the landowners by their stakes, each with a spade; o.hand, one of them raising a hand (0 to 1)
function cp_owners(x,tt,o){o=o||{};cp_aboveCrest(x,()=>{for(const [id,X] of [["cpOwner",-4.75],["cpOwnerB",3.75],["cpOwnerC",8.5]])
  cp_onBank(x,id,X,{t:tt,pose:"cp_staff",pose2:id==="cpOwnerB"&&o.hand?"wave":null,mix:id==="cpOwnerB"?o.hand||0:0,carry:cp_heldSpadeUp});});}
// the board walking the slumped stretch: the reeve taps the bare clay with his staff, the clerk cuts a notch in his tally, and the
// landowner whose stretch it is pays a coin. s0: when they set off
function cp_boardWalk(x,tt,s0){cp_withB(CP_BWALK,()=>cp_aboveCrest(x,()=>{cp_bankStake(x,-0.6,1,CP_OWN[2],2);cp_bankStake(x,7.6,1,CP_OWN[2],null);
  const tap=tt>s0+2.2&&tt<s0+3.4,lift=tap?0.5-0.5*Math.cos((tt-s0-2.2)*TAU*1.6):0;
  cp_bankWalker(x,"cpClerk",tt,s0,-7.6,-2.6,tt>s0+2.4?{pose:"cp_tally",carry:cp_heldTally({n:2,cut:clamp((tt-s0-2.8)/0.8,0,1),saw:tt*2})}:{});
  cp_bankWalker(x,"cpBoardA",tt,s0,-6.0,-1.2,{carry:cp_heldStaff()});
  cp_bankWalker(x,"cpReeve",tt,s0,-4.6,0.6,tt>s0+2.2?{pose:"cp_tapDown",pose2:"cp_tapUp",mix:lift,carry:cp_heldStaff({rel:[150,560-100*lift]})}:{carry:cp_heldStaff()});
  cp_bankWalker(x,"cpOwnerC",tt,s0+2.8,5.4,2.6,tt>s0+4.4?{pose:"cp_give",carry:cp_heldCoin,flip:true}:{flip:true});}));}
// the family in the flood: the man in the loft reaching down, a child beside him, his wife lifting a sack up the ladder, their son
// wading to the door with another on his shoulder
function cp_family(x,tt){const F=CP_F,dm=(F.dorm[0]+F.dorm[1])/2,dz=F.z-0.35,m=cp_f(dm+0.2,F.wall-0.1,dz),ms=cp_fK(0,dz+0.6)*1.7/560,m2=cp_f(dm-0.35,F.wall-0.1,dz);
  x.save();x.beginPath();x.rect(0,0,W,m[1]);x.clip();person(x,"cpKid2",m2[0],m2[1]+ms*200,ms,{t:tt});person(x,"cpHus",m[0],m[1]+ms*330,ms,{pose:"cp_reachDown",t:tt});x.restore();
  cp_who(x,F.C,"cpWife",-5.55,1.0,F.z-0.75,{pose:"cp_sackUp",t:tt,carry:cp_heldSackUp});
  cp_farmWade(x,tt,-1.6,8.2,0.9,()=>cp_who(x,F.C,"cpSon",-1.6,0,8.2,{pose:"cp_shoulder",t:tt,carry:cp_heldShoulder}));}
// the aerial view's camera, swapped in while people are drawn on it
function cp_onAerial(fn){const k=CP_A.C;CP_A.C=CP_AERIAL;try{fn();}finally{CP_A.C=k;}}

scene("dike",(ctx,S,t,sc)=>{const c=sc.cues,P=cp_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{drained:w("sinks","drained"),dries:w("sinks","as it dries"),lower:w("sinks","lower than"),weakest:w("weak","weakest"),breaks:w("floods","breaks"),floodsE:w("floods","floods everyone"),
      homes:w("floods","homes"),settles:w("never","settles"),wears:w("never","wears"),storms:w("never","storms"),more:w("stretch","the more land"),relies:w("pays","relies"),paysW:w("pays","pays for"),
      say:w("pays","a say"),since:w("rijnland","since"),country:w("rijnland","in a country"),quarter:w("rijnland","a quarter"),trustW:w("trust","trust")};});
  const sec=P.dries-0.6,wk=c.weak-0.3,br=P.breaks-0.5,fl=P.floodsE-0.3,fm=P.homes-0.3,vg=P.settles-0.9,md=c.need-0.3,gt=c.boards-0.3,st=c.stretch-0.3,ae=P.more-0.4,bw=c.walks-0.3,
    pc=c.pays-0.3,sf=c.safe-0.3,ch=c.rijnland-0.3,td=P.country-0.3,sm=c.same-0.3,pj=c.project-0.3,tr=c.trust-0.3;
  gv_shots(ctx,S,t,sc.dur,[
    // around 1300: the wet land behind the coast; a farmer cuts a ditch's end, and the water runs off the field; a boat on the river
    {at:0,place:"polderWet",keys:[[0,960,540,1.0]],push:0.03,draw:(x,tt)=>{cp_boat(x,-40+tt*1.6,tt);const cut=clamp((tt-P.drained+0.8)/2.4,0,1);
      cp_drain(x,tt,cut,clamp((tt-P.drained-1.6)/2.2,0,1));cp_drainer(x,tt,cut);}},
    // a cut through the land: as it dries, the field sinks, below the river's level; then the dike is built, layer by layer, and grassed
    {at:sec,place:"section",keys:[[sec,960,540,1.0]],push:0.02,draw:(x,tt)=>{cp_secField(x,clamp((tt-P.dries)/2.4,0,1));
      cp_secLevel(x,clamp((tt-P.lower+0.2)/1.2,0,1),1-fin(tt,c.dikes+1.8,0.6));cp_secDike(x,clamp((tt-c.dikes)/1.3,0,1),clamp((tt-c.dikes-1.1)/0.9,0,1));}},
    // along the crest: most of it trim and green, one stretch slumped and bare
    {at:wk,keys:[[wk,960,540,1.0],[P.weakest-0.5,949,450,1.35]],d:2.2,push:0,draw:x=>x.drawImage(cp_placeHi("crest"),0,0,W,H)},
    // the river comes over the low stretch, cuts a gap through it, and pours through
    {at:br,place:"breach",keys:[[br,960,560,1.15],[br+0.2,960,540,1.0]],d:3,push:0,draw:(x,tt)=>cp_breachFlow(x,tt,clamp((tt-br)/1.2,0,1),clamp((tt-br-0.9)/1.5,0,1),clamp((tt-br-1.6)/2.4,0,1))},
    // and floods everyone behind it: the ditches fill and overflow, the fields go under, the cattle wade off
    {at:fl,place:"polderBreach",keys:[[fl,960,540,1.0]],push:0.03,draw:(x,tt)=>{const f=clamp((tt-fl+0.6)/3.2,0,1);cp_flood(x,tt,f,1);
      cp_polderThings(x,{water:(X,Z)=>cp_floodDepth(X,Z,f),cows:cp_floodCows(tt,fl)});}},
    // a farmhouse in water to its door; the family carries the winter's grain up into the loft
    {at:fm,place:"farmFlood",keys:[[fm,960,540,1.0]],push:0.03,draw:(x,tt)=>cp_family(x,tt)},
    // a dike is never finished: three small pictures of the same stretch, settling, worn by cattle, torn by a storm (the first there from the cut)
    {at:vg,keys:[[vg,960,540,1.0]],push:0,draw:(x,tt)=>{x.fillStyle=rgba(WC_PAPER,1);x.fillRect(0,0,W,H);
      [P.settles,P.wears,P.storms].forEach((t0,i)=>cp_vignette(x,i,[355,960,1565][i],470,0.86,tt,clamp((tt-t0+0.1)/1.8,0,1),fin(tt,i?t0-0.4:vg-0.5,0.5)));}},
    // the gap mended with clay and turf, and the camera pulls back along the whole dike
    {at:md,keys:[[md,1242,500,2.2],[md+0.8,960,540,1.0]],d:3.2,push:0,draw:(x,tt)=>{x.drawImage(cp_placeHi("polder"),0,0,W,H);const e=clamp((tt-md)/3.6,0,1);cp_mendPolder(x,tt,lerp(0.55,0.95,e),e);}},
    // the people behind the dike gather on it in the morning: the board, with their staffs, and the landowners
    {at:gt,place:"crestKept",keys:[[gt,960,540,1.0]],push:0.03,draw:(x,tt)=>cp_gathering(x,tt)},
    // each landowner's stretch is staked along the crest, and they stand by theirs with a spade
    {at:st,place:"bank",keys:[[st,960,540,1.0]],push:0.02,draw:(x,tt)=>cp_withB(CP_BANK,()=>{cp_bankStakes(x,CP_TS,(i,e)=>clamp((tt-st-0.5-i*0.5-e*0.5)/0.5,0,1));cp_owners(x,tt);})},
    // from above: the more land, the longer the stretch
    {at:ae,place:"aerial",keys:[[ae,960,540,1.0]],push:0.02,draw:(x,tt)=>{cp_aerialLands(x,CP_LANDS,i=>clamp((tt-ae-0.2-i*0.45)/1.2,0,1));
      cp_onAerial(()=>{for(const [id,X,Z] of [["cpOwner",-30,30],["cpOwnerB",9,31],["cpOwnerC",29,30]])cp_who(x,CP_AERIAL,id,X,0,Z,{t:tt,pose:"cp_staff",carry:cp_heldSpadeUp});});}},
    // every year the board walks the dikes: a staff taps bare clay, the clerk cuts a notch, the landowner pays
    {at:bw,place:"bankWalk",keys:[[bw,960,540,1.0]],push:0.02,draw:(x,tt)=>cp_boardWalk(x,tt,bw+0.2)},
    // whoever relies on the dikes pays for them, and has a say
    {at:pc,place:"bank",keys:[[pc,960,540,1.0]],push:0.02,draw:(x,tt)=>cp_withB(CP_BANK,()=>{cp_bankStakes(x,CP_TS,()=>1);cp_owners(x,tt);
      cp_skyCard(x,tt,P.relies,560,190,"interest",-0.04,GV.gold);cp_skyCard(x,tt,P.paysW,960,150,"payment",0.03,GV.gold);cp_skyCard(x,tt,P.say,1360,200,"say",-0.02,GV.gold);})},
    // behind kept dikes: a field ploughed, children at the farmhouse door, their mother with a basket
    {at:sf,keys:[[sf,1130,600,1.25]],push:0.02,draw:(x,tt)=>{x.drawImage(cp_placeHi("farm"),0,0,W,H);cp_farmLife(x,tt,sf);}},
    // Rijnland's charter, its seal hanging from a cord
    {at:ch,place:"charter",keys:[[ch,960,540,1.0]],push:0.04},
    // today: a road on the dike, two people cycling, a canal held higher than the fields, a pumping station
    {at:td,place:"today",keys:[[td,960,540,1.0]],push:0.03,draw:(x,tt)=>{cp_rider(x,"cpRideB",0.5,lerp(40,17,(tt-td)/6),tt);cp_rider(x,"cpRideA",-0.45,lerp(36,14,(tt-td)/6),tt);}},
    // the same with data: the dike from above, every stretch kept, the fields dry behind it
    {at:sm,place:"aerial",keys:[[sm,960,560,1.08],[sm+0.1,960,540,1.0]],d:2.6,push:0},
    // a project can put governance in place: Yusuf's board, as Governance principles left it
    {at:pj,place:"boardGov",keys:[[pj,960,540,1.0]],push:0.03,draw:(x,tt)=>cp_board(x,{fill:j=>clamp((tt-pj-0.3-j*0.4)/0.8,0,1)})},
    // kept up, everyone can trust the data: the two reports agree, ticked and joined in gold
    {at:tr,place:"floor",keys:[[tr,738,470,1.3],[tr+0.1,760,465,1.32]],d:5,draw:(x,tt)=>{cp_floor(x,tt);
      cp_reports(x,{tick:fin(tt,P.trustW-0.3,0.5),join:clamp((tt-P.trustW)/0.9,0,1),lit:gv_io(tt,P.trustW+0.6,c.breath+0.4,0.6)});}}]);
  setScreen(ctx,S);cp_pill(ctx,t,[[0,"Holland · around 1300"],[td,"Today"],[sm,"Holland · around 1300"],[pj,"Today"]],fin(t,0.4,0.5)*(1-fin(t,c.breath,0.4)));
  cp_tagAt(ctx,t,P.since,td-0.3,1420,240,"Rijnland · 1255",{size:32});cp_tagAt(ctx,t,P.quarter,sm-0.3,960,160,"a quarter of the land below the sea",{size:30});
  gv_title(ctx,S,t,c.breath+0.3,"A capability, not a project","what the university can always do","Film 1 of 3 · data governance");
  wc_paperOver(ctx,S);});

// ---- 2 · When the project ends: December; the deputy vice-chancellor plans next year's budget, and the project ends in June ----
// David at his desk, the desk over him, the planner over the desk; o: his pose, and what the planner shows
function cp_dvc(x,tt,o){o=o||{};cp_snow(x,tt);gv_behind(x,"david",CP_DV.seat,CP_DV.desk[1],CP_DV.s,Object.assign({pose:"listen",t:tt,flip:true},o.david||{}));x.drawImage(cp_dvcDesk(),0,0,W,H);
  cp_planner(x,o.plan||{card:1,flag:1});}
scene("ends",(ctx,S,t,sc)=>{const c=sc.cues,P=cp_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{wentIn:w("went","went in"),same:w("went","the same"),deputy:w("budget","the deputy"),endsJ:w("budget","ends in June"),isnt:w("cant","isn't"),cantSee:w("cant","can't see"),
      lists:w("report","lists"),nothing:w("report","nothing after"),likeD:w("drift","like a dike"),notWhat:w("needs","not what")};});
  const dv=c.budget-0.4,yk=c.cant-0.3,rp=c.report-0.3,dr=c.drift-0.3,lk=P.likeD-0.3,ag=c.again-0.3,nd=c.needs-0.3;
  gv_shots(ctx,S,t,sc.dur,[
    // December: the two reports' cards on Planning's glass and the registrar's, the same number, joined; "sent" on the registrar's. The
    // camera starts where the last chapter left the floor, so the title card lifts off one floor, not two a little apart
    {at:0,place:"floor",keys:[[0,760,465,1.32*1.025]],push:0.015,draw:(x,tt)=>{cp_floor(x,tt);
      cp_reports(x,{tick:fin(tt,P.same,0.5),join:clamp((tt-P.same-0.1)/0.8,0,1),sent:clamp((tt-P.wentIn)/0.5,0,1)});}},
    // the deputy vice-chancellor's office, in winter: David at his desk; on "ends in June", the wall planner, its card and its flag
    {at:dv,place:"dvc",keys:[[dv,960,540,1.0],[P.endsJ-0.8,1160,300,1.55]],d:1.8,push:0,draw:(x,tt)=>{cp_dvc(x,tt,{david:{pose:"write",flip:false},plan:{card:1,flag:fin(tt,P.endsJ,0.5)}});
      cp_nameCard(x,1580,540,"Prof. David Mensah","deputy vice-chancellor",gv_io(tt,P.deputy-0.2,P.endsJ-0.9,0.4));}},
    // Yusuf knocks at the open door; David waves him in, then spreads his hands: what does it do? Yusuf comes to the desk with his report.
    // The shot starts on the planner, as the last one ends, David still writing, and the camera comes back to the room
    {at:yk,place:"dvc",keys:[[yk,1160,300,1.55],[yk+0.5,1150,520,1.25]],d:1.8,push:0.02,draw:(x,tt)=>{const wk=gv_walk(tt,c.lose,1766,1560,260),inn=tt>=c.lose;
      cp_dvc(x,tt,{david:tt<P.isnt+0.2?{pose:"write",flip:false}:tt<P.cantSee-0.2?{pose:"wave",expr:"smile",flip:false}:{pose:"cp_spread",expr:"concerned",flip:false}});
      if(!inn)person(x,"yusuf",1766,CP_DV.fy+6,0.74,{pose:"cp_knock",t:tt,flip:true,carry:cp_heldReportL});
      else gv_walker(x,"yusuf",wk,CP_DV.fy+30,0.8,{t:tt,carry:cp_heldReport,flip:true});
      gv_say(x,560,330,["what does it do?"],1050,520,{a:gv_io(tt,P.cantSee,c.report,0.3),k:0.9+0.1*spring(fin(tt,P.cantSee,0.5))});}},
    // the project's final report, open on the desk: what it did, each line ticked; its last page, After June, and nothing on it
    {at:rp,keys:[[rp,960,500,1.0],[P.nothing-0.5,1400,370,2.0]],d:1.6,push:0,draw:(x,tt)=>{x.drawImage(cp_placeHi("desk"),0,0,W,H);cp_report(x,{open:clamp((tt-rp-0.3)/0.9,0,1),tick:j=>clamp((tt-P.lists-0.1-j*0.3)/0.4,0,1)});}},
    // rules nobody keeps up drift: the glossary's card for award fading, a check's light going amber, then red
    {at:dr,place:"dvc",keys:[[dr,960,540,1.0]],push:0.03,draw:(x,tt)=>{cp_dvc(x,tt,{david:{pose:"listen",expr:"concerned",flip:false}});x.fillStyle=rgba(WC_PAPER,0.66);x.fillRect(0,0,W,H);
      cp_glossCard(x,620,470,fin(tt,dr+0.2,0.5),{fade:clamp((tt-dr-0.9)/2.2,0,1)});cp_checkLamp(x,1560,600,fin(tt,dr+0.5,0.5),clamp((tt-dr-1.0)/1.2,0,2));}},
    // like a dike nobody walks: the slumped stretch, and no one on it
    {at:lk,place:"bankWalk",keys:[[lk,1180,560,1.12]],push:0.03},
    // next year, imagined: the two reports' cards, two numbers, no gold line, a "?"
    {at:ag,place:"floor",keys:[[ag,738,470,1.3]],push:0.02,draw:(x,tt)=>{cp_floor(x,tt);cp_reports(x,{n:["4,931 awards","4,874 awards"],q:fin(tt,ag+1.0,0.5)});}},
    // David closes the report and slides it back across the desk
    {at:nd,place:"desk",keys:[[nd,960,500,1.0]],push:0.02,draw:(x,tt)=>cp_report(x,{open:1-clamp((tt-nd-0.2)/0.9,0,1),slide:clamp((tt-P.notWhat+0.2)/1.4,0,1)})}]);
  setScreen(ctx,S);cp_pill(ctx,t,[[0,"December"],[lk,"Holland · around 1300"],[ag,"November 2027 · imagined"],[nd,"December"]],fin(t,0.3,0.5)*(1-gv_io(t,P.nothing-0.6,dr+0.4,0.4)));
  wc_paperOver(ctx,S);});

// ---- 3 · What, not who: on Noor's map, a team, a tool and a meeting move down; one card stays at the top, govern data ----
scene("what",(ctx,S,t,sc)=>{const c=sc.cues,P=cp_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{noorW:w("noor","Noor"),top:w("three","at the top"),gteam:w("three","the governance"),gloss:w("three","the glossary"),stew:w("three","the stewards"),must:w("whoever","what must"),
      capW:w("whoever","A capability"),restr:w("test","a restructure"),sys:w("test","a new system"),proc:w("test","a new process"),reorg:w("fail","reorganised"),glossR:w("fail","a glossary"),
      meet:w("fail","a meeting"),govD:w("govern","govern data")};});
  const mc=P.top-0.4,ts=c.tests-0.3,m2=c.whoever-0.3,wb=c.board-0.3,wd=c.dry-0.4,wg=c.govern-0.3,fails=[P.reorg,P.glossR,P.meet];
  cp_shots(ctx,S,t,sc.dur,[
    // Noor's room: Noor at her map; Yusuf comes in with three cards. Between the room and the map, close, the shots cut
    {at:0,place:"noor",keys:[[0,1000,520,1.06],[0.1,1040,510,1.1]],d:4,draw:(x,tt)=>{const wk=gv_walk(tt,0.4,2020,1580,300);
      person(x,"noor",1250,905,0.8,{pose:"listen",t:tt,flip:wk.moving});gv_walker(x,"yusuf",wk,905,0.8,{t:tt,carry:cp_heldCards,flip:true});
      cp_nameCard(x,1330,236,"Noor Rahman","data architect",gv_io(tt,P.noorW-0.2,mc-0.2,0.4));}},
    // the map, close: he pins his three cards at the top, in the strategy band, as each is named
    {at:mc,cut:true,keys:[[mc,1152,432,1.25]],push:0.02,draw:(x,tt)=>{x.drawImage(cp_placeHi("mapClose"),0,0,W,H);cp_map3(x,{pin:j=>fin(tt,[P.gteam,P.gloss,P.stew][j]-0.1,0.4)});}},
    // Noor tests each one: she takes up a marker; his three cards are on her map now
    {at:ts,cut:true,place:"noor",keys:[[ts,1260,470,1.3]],push:0.02,draw:(x,tt)=>{cp_roomCards(x,{pin:()=>1});person(x,"yusuf",1580,905,0.8,{pose:"listen",t:tt,flip:true});
      person(x,"noor",1250,905,0.8,{pose:"listen",pose2:"point",mix:fin(tt,ts+0.5,0.6),t:tt,flip:true,carry:cp_heldMarker});}},
    // a team is who; a capability is what: the test, three chips; each card fails it, and moves down the map to its band
    {at:m2,cut:true,keys:[[m2,1152,432,1.25],[c.down-0.3,1031,470,1.08]],d:1.8,push:0,draw:(x,tt)=>{x.drawImage(cp_placeHi("mapClose"),0,0,W,H);
      const out=1-fin(tt,c.down-0.2,0.5);cp_map3(x,{pin:()=>1,lit:j=>j===0?gv_io(tt,c.whoever,P.capW,0.4):0,q:fin(tt,P.must,0.5),
        chip:j=>fin(tt,[P.restr,P.sys,P.proc][j]-0.1,0.4)*out,chipLit:j=>fin(tt,fails[j],0.4),tip:j=>fin(tt,fails[j],0.6),down:j=>clamp((tt-c.down-0.1-0.3*j)/1.1,0,1)});}},
    // a water board isn't its members, or its spades
    {at:wb,place:"crestKept",keys:[[wb,960,560,1.1]],push:0.03,draw:(x,tt)=>{[["cpBoardA",-0.75,8.6,"cp_staff",cp_heldStaff()],["cpBoardB",0.8,8.4,"cp_staff",cp_heldStaff()],["cpReeve",0,7.9,"cp_staff",cp_heldStaff()],
      ["cpOwner",-1.3,6.4,"cp_staff",cp_heldSpadeUp],["cpOwnerB",1.35,6.2,"cp_staff",cp_heldSpadeUp],["cpOwnerC",0.45,5.5,"cp_staff",cp_heldSpadeUp]].forEach(([id,X,Z,pose,carry])=>cp_onCrest(x,id,X,Z,{t:tt,pose,carry}));}},
    // it's keeping the land dry: up over them, the dry fields behind the dike
    {at:wd,place:"aerial",keys:[[wd,960,640,1.25],[wd+0.1,960,540,1.0]],d:2.4,push:0},
    // one card stays at the top: govern data, lit gold; Yusuf underlines it
    {at:wg,keys:[[wg,1031,470,1.08],[P.govD-0.7,1123,528,1.3]],d:1.8,push:0,draw:(x,tt)=>{x.drawImage(cp_placeHi("mapClose"),0,0,W,H);
      cp_map3(x,{pin:()=>1,down:()=>1,q:1,gov:fin(tt,P.govD-0.3,0.6),glow:fin(tt,P.govD,0.6),under:clamp((tt-P.govD-0.5)/0.8,0,1)});}}]);
  setScreen(ctx,S);cp_pillAt(ctx,t,wb,wg,"Holland · around 1300");cp_tagAt(ctx,t,c.dry+0.1,wg-0.3,960,330,"keeping the land dry",{size:32});
  wc_paperOver(ctx,S);});

// ---- 4 · Seven, and one more: govern data's capabilities, in the university's words; two checklists find an eighth ----
scene("seven",(ctx,S,t,sc)=>{const c=sc.cues,P=cp_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{twoF:w("check","two frameworks"),asCk:w("check","as checklists"),oneMore:w("more","one more")};});
  const ck=c.check-0.3,kr=c.more+2.6,cap=(tt,j)=>j<7?fin(tt,c["c"+(j+1)]-0.15,0.45):fin(tt,kr+0.3,0.45);
  gv_shots(ctx,S,t,sc.dur,[
    // the strategy band, drawn large: govern data, and under it the places for what the university must be able to do; a card in each
    // as it's named; on "this term", a token from the film that put it in place
    {at:0,place:"band",keys:[[0,711,467,1.35],[c.c1-1.0,960,540,1.0]],d:2.2,push:0,draw:(x,tt)=>cp_band(x,{cap:j=>j<7?cap(tt,j):0,tok:j=>fin(tt,c.term+0.25+j*0.2,0.4)})},
    // two frameworks, as checklists: the wheel Yusuf drew, each part lit as a card covers it; a printed checklist, each line ticked; the
    // wheel's documents and the list's records find no card
    {at:ck,place:"desk",keys:[[ck,960,500,1.0]],push:0.02,draw:(x,tt)=>{const s1=1-easeCam(fin(tt,ck+0.1,0.9)),s2=1-easeCam(fin(tt,P.twoF,0.9));
      x.save();x.translate(0,900*s1);cp_wheelSheet(x,{lit:k=>fin(tt,P.asCk+0.12*k,0.35),doc:fin(tt,P.oneMore,0.5)});x.restore();
      x.save();x.translate(0,900*s2);cp_listSheet(x,{tick:j=>clamp((tt-P.asCk-0.2-j*0.22)/0.35,0,1),miss:fin(tt,P.oneMore+0.25,0.5)});x.restore();}},
    // the eighth card, keep records only as long as they're needed; nobody does it yet, so it has no token: the camera moves in on it and
    // its neighbour, with its token, as it will again for the red card (the frame's right edge held on the band's, the words it leaves fading)
    {at:kr,place:"band",keys:[[kr,960,540,1.0],[c.yet-0.8,W,586,2.47]],d:2.2,push:0,draw:(x,tt)=>{cp_fadeCut(x,()=>cp_band(x,{cap:j=>j<7?1:cap(tt,7),tok:j=>j<7?1:0}),cp_bandBlocks(x));
      const [cx,cy]=cp_capXY(7),a=fin(tt,c.yet,0.5);if(a>0.01)withA(x,a,()=>{x.save();x.setLineDash([6,6]);x.strokeStyle=rgba(WC_PENCIL,0.7);x.lineWidth=2.4;x.strokeRect(cx+CP_BD.cw-64,cy+-2,60,46);x.restore();});}}]);
  wc_paperOver(ctx,S);});

// ---- 5 · Coloured by evidence: green where it runs, amber where people remember, red where nothing happens yet ----
const CP_GREENS=[1,3,5,6];
scene("colour",(ctx,S,t,sc)=>{const c=sc.cues,P=cp_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{evid:w("colour","with evidence"),uses:w("amber","who uses"),mayRead:w("amber","who may read"),learner:w("red","learner"),hurts:w("money","where it hurts"),moneyW:w("money","the money")};});
  const cw=c.walk-0.3,cn=c.night-0.3,when=j=>j===0?P.evid:j===2?P.mayRead:j===4?P.uses:j===7?P.learner:c.green+0.4+CP_GREENS.indexOf(j)*0.55;
  gv_shots(ctx,S,t,sc.dur,[
    // each card washed in its colour as its note of evidence is pinned under it; the key; then, back to the whole band, gold rings round
    // the red card and the two amber ones: where the money should go. For the red one, the camera moves in on the corner it shares with
    // its neighbour, the frame's right edge held on the band's (a key past it keeps it there), and the words it leaves fade as it goes.
    // It opens on the eighth card, framed as the last chapter left it, and comes back to the whole band once that chapter has faded
    {at:0,place:"band",keys:[[0,W,586,2.47],[0.8,960,540,1.0],[c.red-0.5,W,658,2.47],[P.hurts-0.6,960,540,1.0]],d:2.2,push:0,draw:(x,tt)=>cp_fadeCut(x,()=>cp_band(x,{cap:()=>1,tok:j=>j<7?1:0,
      wash:j=>fin(tt,when(j)+0.2,0.7),note:j=>fin(tt,when(j),0.5),key:fin(tt,c.key-0.1,0.6),ring:j=>j===7||j===2||j===4?clamp((tt-P.moneyW-0.1-(j===7?0:0.4+0.2*(j===4)))/0.8,0,1):0}),cp_bandBlocks(x))},
    // the water boards walk their dikes every year: the staff on the bare clay, the clerk's notch
    {at:cw,place:"bankWalk",keys:[[cw,960,540,1.0]],push:0.02,draw:(x,tt)=>cp_boardWalk(x,tt,cw-2.0)},
    // here, the checks run every night: Yusuf in his office in the morning, with the plain scorecard's page
    {at:cn,place:"office",keys:[[cn,1150,560,1.4]],push:0.02,draw:(x,tt)=>person(x,"yusuf",1180,905,0.8,{pose:"cp_holdLow",carry:cp_scoreBoard,t:tt,expr:"smile"})}]);
  setScreen(ctx,S);cp_pillAt(ctx,t,cw,cn,"Holland · around 1300");cp_pillAt(ctx,t,cn,sc.dur+1,"Today");
  wc_paperOver(ctx,S);});

// ---- 6 · What people can ask for: seven services, named the way people ask, each with a promise; their users review it ----
scene("ask",(ctx,S,t,sc)=>{const c=sc.cues,P=cp_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{named:w("services","named"),tenW:w("ten","ten working"),hasSay:w("say","has a say")};});
  const hp=c.help-0.3,fx=c.help+1.3,sv=c.services+1.0,sy=c.say-0.3,rv=c.review-0.3,s=j=>c["s"+(j+1)];
  gv_shots(ctx,S,t,sc.dur,[
    // nobody asks for a capability: the strategy band on the map, the business band under it empty
    {at:0,place:"services",keys:[[0,960,540,1.0]],push:0.02,draw:x=>cp_services(x,{})},
    // people ask for help: Clara, at Planning, at a number on the screen with nothing to say what it counts
    {at:hp,place:"planning",keys:[[hp,700,520,1.15]],push:0.02,draw:(x,tt)=>{cp_planScreen(x,clamp((tt-hp-0.1)/0.7,0,1));person(x,"clara",470,905,0.8,{pose:"cp_pointUp",expr:"concerned",t:tt});
      gv_say(x,110,300,["what does this mean?"],440,450,{a:fin(tt,c.help,0.3),k:0.9+0.1*spring(fin(tt,c.help,0.5))});}},
    // and Anil, in the old building, at a product's page he can't open
    {at:fx,place:"faculty",keys:[[fx,1100,500,1.15]],push:0.02,draw:(x,tt)=>{gv_behind(x,"anil",GV_FX.seat[0],GV_FX.top,GV_FX.seat[1],{pose:"listen",t:tt,flip:true});x.drawImage(gv_place("facultyDesk"),0,0,W,H);
      cp_lockScreen(x,fin(tt,fx+0.1,0.5));gv_say(x,1160,280,["can I see this?"],1300,418,{a:fin(tt,fx+0.2,0.3),k:0.9+0.1*spring(fin(tt,fx+0.2,0.5))});}},
    // the business band: a service card for each thing people ask, joined by a dotted line to the capability it serves; each turned over
    // to its promise; the promise for a new term lit gold, the camera moving in with the frame's left edge held on the map's (a key left
    // of it keeps it there), and the words it leaves fading as it goes
    {at:sv,keys:[[sv,960,540,1.0],[P.tenW-0.9,0,560,1.765]],d:1.8,push:0,draw:(x,tt)=>{x.drawImage(cp_placeHi("services"),0,0,W,H);cp_fadeCut(x,()=>cp_services(x,{serv:j=>fin(tt,s(j)-0.15,0.5),
      line:j=>clamp((tt-s(j)-0.2)/0.8,0,1),flip:j=>clamp((tt-c.promise-0.15-j*0.22)/0.5,0,1),lit:j=>j===1?fin(tt,P.tenW-0.3,0.6):0}),cp_servBlocks(x));}},
    // like the water boards: whoever relies on it has a say; a landowner raises a hand
    {at:sy,place:"bank",keys:[[sy,960,540,1.0]],push:0.02,draw:(x,tt)=>cp_withB(CP_BANK,()=>{cp_bankStakes(x,CP_TS,()=>1);cp_owners(x,tt,{hand:fin(tt,P.hasSay-0.7,0.6)});})},
    // its users review its promise: the stewards in December, the seven promises on the screen, reviewed; Clara points up at it
    {at:rv,place:"meeting",keys:[[rv,960,540,1.0],[rv+0.1,980,520,1.04]],d:3,draw:(x,tt)=>cp_meeting(x,tt,{yusuf:{pose:"listen"},pose:j=>j===3?{pose:"listen",pose2:"cp_pointHigh",mix:fin(tt,c.review+0.5,0.5)}:{nod:0.05*Math.sin(tt*2.2+j)},
      body:q=>{const [sx,sy2,sw,sh]=GV_MT.screen;wc_T(q,"7 promises",sx+sw/2,sy2+128,{w:800,size:40,align:"center",col:WC_DARK});
        wc_hand(q,"reviewed",sx+sw/2-20,sy2+214,{size:44,w:700,align:"center",col:[30,50,110],p:clamp((tt-c.review-0.4)/0.9,0,1)});wc_tick(q,sx+sw/2+140,sy2+200,44,GV.greenInk,clamp((tt-c.review-1.2)/0.5,0,1),5);}})}]);
  setScreen(ctx,S);cp_pillAt(ctx,t,sy,rv,"Holland · around 1300");
  wc_paperOver(ctx,S);});

// ---- 7 · A line every year: one page for the deputy vice-chancellor, and a line in the budget, the capability's ----
scene("line",(ctx,S,t,sc)=>{const c=sc.cues,P=cp_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{ptime:w("time","people's time"),tools:w("time","the tools"),aLine:w("budget","a line"),capab:w("budget","the capability's"),which:w("money","whichever"),red:w("first","the red card")};});
  const bd=c.budget-0.3,pl=P.capab-0.4,mn=c.money-0.3,fs=c.first-0.3;
  gv_shots(ctx,S,t,sc.dur,[
    // one page on David's desk: seven services, their promises, and what it costs to keep them, its three lines lit
    {at:0,place:"desk",keys:[[0,960,540,1.0],[c.time-0.6,889,580,1.08]],d:1.8,push:0,draw:(x,tt)=>cp_servicePage(x,{keep:j=>fin(tt,j<2?P.ptime+j*0.5:P.tools,0.5)})},
    // a new line in Budget 2027, in pen, on the desk as the page left it
    {at:bd,place:"desk",keys:[[bd,889,580,1.08],[P.aLine-0.4,1250,620,1.35]],d:1.6,push:0,draw:(x,tt)=>cp_budget(x,{write:clamp((tt-P.aLine)/1.6,0,1)})},
    // the planner: the project's card still ends on 30 June; the new line runs on past it, off the planner's edge
    {at:pl,place:"dvc",keys:[[pl,1160,300,1.55]],push:0.02,draw:(x,tt)=>cp_dvc(x,tt,{david:{pose:"listen",flip:false},plan:{card:1,flag:1,line:clamp((tt-pl-0.3)/1.8,0,1)}})},
    // the money goes to one capability: a gold thread from the budget's line to govern data, and on along the dotted lines to the services
    {at:mn,place:"services",keys:[[mn,960,540,1.0]],push:0.02,draw:(x,tt)=>cp_services(x,{serv:()=>1,line:()=>1,budget:fin(tt,mn+0.3,0.5),gold:clamp((tt-mn-0.6)/(P.which+1.0-mn-0.6),0,1)})},
    // next year's new work starts with the red card
    {at:fs,place:"band",keys:[[fs,960,540,1.0],[P.red-0.9,1320,600,1.6]],d:1.8,push:0,draw:(x,tt)=>cp_band(x,{cap:()=>1,tok:j=>j<7?1:0,wash:()=>1,first:fin(tt,P.red-0.2,0.5)})}]);
  wc_paperOver(ctx,S);});

// ---- 8 · What it keeps: floods brought projects, and projects end; keeping the land dry never did; next November, imagined ----
scene("keeps",(ctx,S,t,sc)=>{const c=sc.cues,P=cp_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{big:w("floods","big projects"),projE:w("floods","and projects end"),juneW:w("june","June"),keepsIt:w("stays","something keeps"),agree:w("nov","agree"),
      meanW:w("gives","one meaning"),numW:w("gives","one number"),askW:w("gives","someone to ask")};});
  const bp=P.big-0.5,tr=c.never-0.3,jn=c.june-0.3,sy=c.stays-0.3,nv=c.nov-0.3;
  gv_shots(ctx,S,t,sc.dur,[
    // 1953: a storm at night, the sea over the dike
    {at:0,place:"storm",keys:[[0,960,520,1.06],[0.1,980,500,1.1]],d:3,draw:(x,tt)=>cp_storm(x,tt,0.55+0.45*clamp(tt/2.2,0,1))},
    // a big project: the storm barrier rises across an estuary in stages, its gates close; the last crane leaves
    {at:bp,place:"barrier",keys:[[bp,1150,500,1.15],[bp+0.2,960,540,1.0]],d:4.5,push:0,draw:(x,tt)=>cp_barrier(x,tt,{piers:clamp((tt-bp-0.1)/1.9,0,1),road:clamp((tt-bp-1.0)/1.6,0,1),
      gates:clamp((tt-bp-1.6)/1.2,0,1),close:clamp((tt-bp-2.8)/1.6,0,1),leave:clamp((tt-P.projE-0.2)/2.8,0,1)})},
    // keeping the land dry never ended: today, two of the board's people walk a dike in the rain, and test its side
    {at:tr,keys:[[tr,960,560,1.15],[tr+0.1,980,560,1.2]],d:3,draw:(x,tt)=>{x.drawImage(cp_placeHi("today"),0,0,W,H);cp_rainHaze(x);const stop=tr+2.0,tap=tt>stop+0.2?0.5-0.5*Math.cos((tt-stop-0.2)*TAU*1.5):0;
      cp_crestWalk(x,"cpInspA",tt,tr,-0.5,12.5,8.8,{carry:cp_heldClip});
      cp_crestWalk(x,"cpInspB",tt,tr,0.75,11.0,8.6,tt>stop?{keep:true,pose:"cp_tapDown",pose2:"cp_tapUp",mix:tap,carry:cp_heldStaff({rel:[150,560-100*tap]}),flip:true}:{carry:cp_heldStaff(),flip:true});
      cp_rainDay(x,tt);}},
    // June: the project's card comes off the planner; the line for every year stays
    {at:jn,place:"dvc",keys:[[jn,1160,300,1.55]],push:0.02,draw:(x,tt)=>cp_dvc(x,tt,{david:{pose:"listen",flip:false},plan:{card:1,flag:1,line:1,off:clamp((tt-P.juneW-0.2)/1.0,0,1)}})},
    // what it built stays: each capability with what the project put in place, kept, a gold edge round each
    {at:sy,place:"band",keys:[[sy,960,540,1.0]],push:0.03,draw:(x,tt)=>cp_band(x,{cap:()=>1,tok:j=>j<7?1:0,wash:()=>1,first:1,lit:j=>fin(tt,P.keepsIt+j*0.12,0.4)})},
    // next November, imagined: the two reports agree again; then one meaning, one number, and someone to ask
    {at:nv,place:"floor",keys:[[nv,738,470,1.3],[c.gives-0.2,960,540,1.0]],d:2.2,push:0,draw:(x,tt)=>{cp_floor(x,tt,{x:{yusuf:846},pose:{yusuf:tt>P.askW?{pose:"wave",carry:null,expr:"smile",flip:false}:{}}});
      cp_reports(x,{n:["4,931 awards","4,931 awards"],tick:fin(tt,c.nov+0.8,0.5),join:clamp((tt-P.agree)/0.9,0,1),lit:gv_io(tt,P.numW-0.1,P.numW+1.6,0.3)});
      cp_glassAt(x,2,300,fin(tt,P.meanW-0.2,0.5),["award","a qualification the","university confers"]);
      cp_glassAt(x,2,560,fin(tt,P.askW-0.2,0.5),["Office hours","Thursdays","2 to 3 pm"],{dx:67,w:210,headSize:30,pin:GV.red,wash:GV.gold,washA:0.3});}}]);
  setScreen(ctx,S);cp_pill(ctx,t,[[0,"Holland · 1953"],[bp,"Holland · 1953–1997"],[tr,"Today"],[jn,"June 2027"],[nv,"November 2027 · imagined"]],fin(t,0.3,0.5)*(1-fin(t,c.breath-0.3,0.5))*(1-gv_io(t,sy-0.3,nv,0.3)));
  gv_end(ctx,S,t,c.breath+0.2,"A capability, not a project","A project builds it. A capability keeps it.","Film 1 of 3");
  if(t>c.breath+1.4)withA(ctx,fin(t,c.breath+1.6,0.8),()=>wc_tag(ctx,960,780,"Next: Who does what, end to end",{align:"center",size:30,w:600}));
  wc_paperOver(ctx,S);});
