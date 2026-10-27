/* ===== One word, one home: the eight chapters =====
   Each chapter is a few shots in the places of past.js, plan.js and the series' rooms.js, cut together with short dissolves
   (gv_shots). Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures
   stay with the voice if it's recorded again. Words on screen are on paper, screens, boards, tags and speech bubbles, at least 28 px
   as seen when they're read, and above the captions. */

// the people of the floor, each in their office (Planning, the registrar's office, data governance, the data team, the platform
// team), then the glass over them and the names on it
const OW_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4},OW_WORK={clara:{pose:"reach"},mei:{pose:"hold",carry:heldNotebook},jun:{pose:"reach"},sam:{pose:"phone"}};
function ow_floor(x,tt,o){o=o||{};const F=GV_FL;Object.keys(OW_AT).forEach(id=>{const i=OW_AT[id];if((o.out||[]).includes(id))return;
    person(x,id,F.spot(i),806,0.5,Object.assign({pose:"stand",t:tt,flip:i%2===1},OW_WORK[id]||{},(o.pose||{})[id]||{}));});
  gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a,a=o.names==null?1:o.names;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,a*clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}
// someone walking behind a desk, cut off at its top like gv_behind
function ow_behindWalk(ctx,id,w,cutY,s,o){ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cutY+H);ctx.clip();gv_walker(ctx,id,w,cutY+GV_STAND*s,s,o);ctx.restore();}

// ---- 1 · One script: Qin, 221 BC, to the board found at Liye ----
// a person of Qin standing in depth at the gate, from their place on the ground (X, Z in metres)
function ow_at(C,X,Z,h){const [x,y]=ow_pj(C,X,0,Z);return{x,y,s:(h||1.66)*ow_ppm(C,Z)/560};}
scene("script",(ctx,S,t,sc)=>{const c=sc.cues,P=ow_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{gate:c.one-0.2,made:w("one","made them"),slips:c.words-0.3,king:w("words","what had"),emp:w("words","was now"),county:c.board-0.4,check:w("board","kept those"),
      then:w("board","on a wooden")-0.25,found:w("board","found"),well:w("board","in a well"),rec:c.used,glossary:w("used","The board was"),bridge:c.bridge-0.45,
      every:w("bridge","every tool"),title:c.breath-0.6};});
  const mk=[[0,"221 BC · Qin"],[P.county,"Qianling county · about 220 BC"],[P.found,"Liye · 2002"]];
  gv_shots(ctx,S,t,sc.dur,[
    // the road through the loess hills: two ox carts in the same pair of ruts, going to the town, a carter walking by the nearer
    {at:0,place:"road",keys:[[0,960,540,1.0],[0.2,1010,530,1.1]],d:8,draw:(x,tt)=>{const C=OW_RD,za=16.9+0.6*tt,zb=28+0.6*tt;
      ow_cart(x,C,zb,0.6*tt,{ph:1.3,seed:3,ox:[140,104,80]});const zc=za+0.9,cp=ow_pj(C,C.road(zc)-1.3,0,zc);ow_back(x,"ow_carter",cp[0],cp[1],1.62*ow_ppm(C,zc)/560,{ph:tt*Math.PI*1.25});
      ow_cart(x,C,za,0.6*tt,{seed:1});}},
    // the town's gate: a cart going in, a courier with the court's orders on his back, the official at the gate, the seller at his
    // stall with the standard measure and weight; on "made them one", a tag for the notice board's script, the measures, and the ruts
    {at:P.gate,place:"gate",keys:[[P.gate,960,540,1.0],[P.gate+0.1,990,540,1.05]],d:6,draw:(x,tt)=>{const C=OW_GT,S=C.stall,u=tt-P.gate,zc=7.2+0.8*u,zr=11+1.15*u;
      const of=ow_at(C,2.4,25,1.72);person(x,"ow_official",of.x,of.y,of.s,{pose:"stand",t:tt,flip:true,shadow:false});
      [[zr,()=>{const p=ow_pj(C,C.road(zr)+1.25,0,zr);ow_back(x,"ow_courier",p[0],p[1],1.66*ow_ppm(C,zr)/560,{ph:tt*Math.PI*2.0,carry:ow_bundleBack});}],
        [zc,()=>ow_cart(x,C,zc,0.9*u+3,{seed:5})]].sort((a,b)=>b[0]-a[0]).forEach(q=>q[1]());
      const [sx]=ow_pj(C,S.seller[0],0,S.seller[1]),ss=1.66*ow_ppm(C,S.seller[1])/560,top=ow_pj(C,0,S.top,S.z1)[1];
      ow_kneel(x,"ow_merchant",sx,top,ss,{pose:"explain",t:tt,flip:true,fy:ow_pj(C,0,0,S.seller[1]-0.2)[1]});
      ow_stallFront(x,fin(tt,P.made+0.35,0.5)*(1-fin(tt,P.slips-0.4,0.4)));
      const by=ow_at(C,1.4,5.6,1.58);person(x,"ow_buyer",by.x,by.y,by.s,{pose:"listen",t:tt,flip:true});
      // the ruts, measured where the cart has just been
      const zm=7.2+0.8*(P.made+0.1-P.gate),[ra,rb]=ow_axle(C,zm),dp=clamp((tt-P.made-0.55)/0.6,0,1);
      if(dp>0){const lo=24;wc_pencil(x,[[ra[0],ra[1]+6],[ra[0],ra[1]+lo+10]],dp,{col:WC_DARK,lw:2.4,seed:61});wc_pencil(x,[[rb[0],rb[1]+6],[rb[0],rb[1]+lo+10]],dp,{col:WC_DARK,lw:2.4,seed:62});
        wc_pencil(x,[[ra[0],ra[1]+lo],[rb[0],rb[1]+lo]],dp,{col:WC_DARK,lw:2.6,seed:63});}
      const [bx,by_]=ow_pj(C,C.board[0],2.32,C.board[1]),[mx,my]=ow_stallAt();
      ow_tagAt(x,tt,P.made,null,bx,by_-44,"one script");ow_tagAt(x,tt,P.made+0.35,null,mx,my-38,"one set of measures");
      ow_tagAt(x,tt,P.made+0.7,null,(ra[0]+rb[0])/2,Math.max(ra[1],rb[1])+76,"one axle width");}},
    // the court's orders, unbundled on a mat: the old word struck out, the new one written in
    {at:P.slips,place:"slips",keys:[[P.slips,960,540,1.0],[P.slips+0.1,990,530,1.05]],d:6,draw:(x,tt)=>{
      ow_tagAt(x,tt,P.slips+0.35,null,OW_SL.x+OW_SL.n*OW_SL.w/2,96,"the court's orders");
      const a=fin(tt,P.king-0.2,0.5);if(a>0.01){const cx=1160,cy=300;withA(x,a,()=>{x.save();x.translate(0,14*(1-a));wc_panel(x,cx,cy,600,300,{kind:"card",seed:221});
        wc_T(x,"what had been",cx+40,cy+70,{w:600,size:30,col:WC_MUTED});wc_T(x,"the king's",cx+40,cy+140,{w:800,size:52,col:WC_DARK});
        const s=clamp((tt-P.emp+0.1)/0.5,0,1);if(s>0){x.save();x.strokeStyle=rgba(GV.redInk,0.85);x.lineWidth=5;x.lineCap="round";x.beginPath();x.moveTo(cx+34,cy+122);x.lineTo(cx+34+tw(x,"the king's",52,800)*s+8,cy+118);x.stroke();x.restore();}
        if(tt>P.emp+0.3){wc_T(x,"is now",cx+40,cy+200,{w:600,size:30,col:WC_MUTED});wc_hand(x,"the emperor's",cx+40,cy+262,{size:52,col:GV.goldInk,p:clamp((tt-P.emp-0.4)/0.9,0,1)});}x.restore();});}}},
    // the county office at Qianling: three scribes at their low tables; the middle one checks the board at his elbow, and writes on
    {at:P.county,place:"county",keys:[[P.county,960,560,1.0],[P.county+0.1,1030,610,1.42]],d:2.6,draw:(x,tt)=>{const O=OW_OF,ck=gv_io(tt,P.check+0.2,P.check+1.7,0.45);
      ["ow_scribeA","ow_scribeB","ow_scribeC"].forEach((id,i)=>ow_kneel(x,id,O.seats[i],O.top,O.s,{pose:"write",pose2:i===1?"ow_check":null,mix:i===1?ck:0,t:tt+i*0.7,carry:ow_heldSlip,flip:i===2}));
      x.drawImage(gv_place("countyTables"),0,0,W,H);const bw=O.board[1]*330*O.s,bh=bw*12.5/27.4;gv_halo(x,O.board[0]-16,O.top-bh-16,bw+38,bh+30,GV.gold,0.75*ck);}},
    // the board, on the scribe's table; then as it was found, in 2002, with its rules in English under it, and the county's records counted
    {at:P.then,place:"boardThen",keys:[[P.then,960,540,1.0]],d:2,draw:(x,tt)=>ow_ruleCard(x,fin(tt,P.then+0.3,0.5))},
    {at:P.found-0.1,place:"boardFound",keys:[[P.found-0.1,960,540,1.0],[P.found,990,530,1.04],[P.glossary,960,540,1.0]],d:2.2,draw:(x,tt)=>{ow_ruleCard(x,1);
      ow_tagAt(x,tt,P.well,P.bridge-0.2,1090,160,"found in a well");ow_tally(x,tt,P.rec,P.rec+0.5,P.rec+2.3);
      gv_halo(x,OW_BD.x-40,OW_BD.y-40,OW_BD.w+80,OW_BD.h+80,GV.gold,0.55*gv_io(tt,P.glossary,P.bridge+0.4,0.6));}},
    // the floor of offices: the board's outline lifts and becomes a card, "award", and every office's screen reads from it
    {at:P.bridge,place:"floor",keys:[[P.bridge,960,540,1.0]],d:2,push:0.02,draw:(x,tt)=>{ow_floor(x,tt,{names:fin(tt,P.bridge+0.8,0.6)});
      ow_oneWay(x,960,300,clamp((tt-P.every+0.2)/1.4,0,1)*1.32,1);ow_floorCard(x,960,300,fin(tt,P.bridge+1.0,0.5));}}]);
  // the board's outline, from where it lies to the card's place
  const m=clamp((t-P.bridge+0.2)/1.4,0,1);if(m>0&&m<1){setScreen(ctx,S);const e=easeCam(m),B=OW_BD,x0=lerp(B.x,790,e),y0=lerp(B.y,242,e),w=lerp(B.w,340,e),h=lerp(B.h,116,e);
    ctx.save();ctx.globalAlpha=Math.sin(Math.PI*m);ctx.strokeStyle=rgba(GV.goldInk,0.9);ctx.lineWidth=4;ctx.setLineDash([12,8]);ctx.strokeRect(x0,y0,w,h);ctx.restore();}
  ow_pill(ctx,t,mk,fin(t,0.6,0.5)*(1-fin(t,P.bridge,0.4)));
  gv_title(ctx,S,t,P.title,"One word, one home","one glossary everyone trusts, and every tool synced from it","Film 3 of 19 · data governance");
  wc_paperOver(ctx,S);});

// ---- 2 · Five glossaries: Mei's desk, where Who decides left her ----
scene("five",(ctx,S,t,sc)=>{const c=sc.cues,P=ow_once(sc,"P",()=>({copy:wAt(sc,"platform","The data"),three:c.three}));
  // the five as Who decides leaves them, read right to left as each is named: the screen, the spreadsheet, the policy, the tablet, the
  // printout. Each settles back to lines when the camera leaves it (the screen, the spreadsheet and the policy as it goes to the tablet),
  // and all of them for the three meanings
  const back=1-fin(t,c.three-0.5,0.8),left=1-fin(t,c.dash-0.5,0.8),R=[fin(t,c.platform-0.15,0.6)*left,fin(t,c.sheet-0.15,0.6)*left,fin(t,c.appendix-0.15,0.6)*left,
    fin(t,c.dash-0.15,0.6)*back,fin(t,c.tool-0.15,0.6)*back],all=fin(t,P.three,0.6);
  const draw=(x,tt)=>{
      const yu=gv_walk(tt,c.look-0.2,2080,1830,240);
      gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],{pose:"stand",pose2:"explain",mix:gv_io(tt,c.look+0.6,c.platform+0.8,0.6),expr:tt<c.look?"concerned":"calm",t:tt});
      if(tt>c.look-0.2)ow_behindWalk(x,"yusuf",yu,GV_RX.top,1.7,{t:tt,flip:true,pose:yu.moving?null:"listen"});x.drawImage(gv_place("regDesk"),0,0,W,H);
      for(let k=0;k<5;k++)ow_five(x,k,R[k],{copy:fin(tt,P.copy-0.2,0.5)});
      gv_qmark(x,560,400,150,fin(tt,0,0.01)*(1-fin(tt,c.look+0.4,0.5)));
      // three meanings: the five heads lit together, and the three colours
      if(all>0.01){OW_FIVE.forEach((f,k)=>{const [hx,hy,hw,hh]=ow_fiveHeadBox(k);gv_halo(x,hx,hy,hw,hh,OW_MEAN[f[2]],0.6*all);});
        ow_tagAt(x,tt,P.three+0.3,null,1420,236,"3 meanings",{size:32});[0,1,2].forEach(m=>{const a=fin(tt,P.three+0.6+m*0.2,0.4);if(a>0){x.save();x.fillStyle=rgba(OW_MEAN[m],a);x.beginPath();x.arc(1330+m*90,296,16,0,TAU);x.fill();x.restore();}});}};
  // her screen, then the spreadsheet and the policy above it; a cut to the tablet and the printout at her left, and one to all five
  gv_shots(ctx,S,t,sc.dur,[
    {at:0,place:"regClose",keys:[[0,960,540,1.0],[c.platform-0.45,1371,505,1.75],[c.sheet-0.55,1080,350,1.54]],d:1.6,push:0,draw},
    {at:c.dash-0.45,place:"regClose",keys:[[c.dash-0.45,565,400,1.7]],d:1.6,push:0,draw},
    {at:c.three-0.6,place:"regClose",keys:[[c.three-0.6,960,540,1.0]],d:1.6,push:0,draw}]);
  setScreen(ctx,S);ow_nameCard(ctx,720,470,"Mei Tanaka","Registrar's office",gv_io(t,0.6,c.look-0.3,0.4));ow_nameCard(ctx,1480,96,"Yusuf Demir","Data governance",gv_io(t,c.look+0.6,c.platform-0.6,0.4));
  wc_paperOver(ctx,S);});

// ---- 3 · Many is none: five glossaries on Yusuf's board ----
// the board as it stands: the five cards, the tags under them, and what each beat has added
function ow_board(x,tt,o){o=o||{};for(let i=0;i<5;i++){const a=o.pin?fin(tt,o.pin+i*0.3,0.35):1;ow_boardCard(x,i,{a,lit:o.lit,under:i===0?o.u0:i===3?o.u3:0});
    ow_boardTag(x,i,o.tags?fin(tt,o.tags+i*0.75,0.45):1);}
  if(o.frost){ow_frost(x,1,o.frost,["only Planning","can open it"]);ow_frost(x,2,o.frost,["page 41","of a PDF"]);}}
scene("none",(ctx,S,t,sc)=>{const c=sc.cues,P=ow_once(sc,"P",()=>({micro:wAt(sc,"differ","counts"),degree:wAt(sc,"differ","a degree"),found:wAt(sc,"hidden","found"),
    login:c.unused-0.35,months:wAt(sc,"unused","last opened"),back:c.monday-0.4,mon:wAt(sc,"monday","only one"),four:wAt(sc,"monday","The other four"),floor:c.none-0.4,which:wAt(sc,"none","Nobody knows")}));
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf pins up the five, and who made each and why
    {at:0,place:"boardGov",keys:[[0,960,500,1.0],[0.2,960,488,1.04]],d:5,draw:(x,tt)=>ow_board(x,tt,{pin:0.1,tags:c.reason+0.5,lit:fin(tt,c.differ,0.6),u0:clamp((tt-P.micro)/0.6,0,1),u3:clamp((tt-P.degree)/0.6,0,1),frost:fin(tt,P.found-0.3,0.6)})},
    // the biggest: the 2019 tool, that nobody opens
    {at:P.login,place:"screenGov",keys:[[P.login,960,450,1.0],[P.login+0.1,1000,430,1.07]],d:5,draw:(x,tt)=>{const [sx,sy,sw,sh]=GV_SC;ow_login(x,sx,sy,sw,sh,{web:clamp((tt-P.login-0.3)/1.4,0,1)});
      ow_tagAt(x,tt,P.months,null,1240,690,"last opened 14 months ago",{size:32});}},
    // Monday: one changed, four never heard
    {at:P.back,place:"boardGov",keys:[[P.back,960,488,1.04]],d:2,draw:(x,tt)=>{ow_board(x,tt,{lit:1,frost:1});
      ow_tagAt(x,tt,P.mon,null,OW_BX.cx(0),OW_BX.top-26,"changed Monday",{wash:GV.gold,washA:0.55});for(let i=1;i<5;i++)ow_tagAt(x,tt,P.four+0.2*i,null,OW_BX.cx(i),OW_BX.top-26,"no change",{wash:GV.grey,washA:0.45});}},
    // the floor: which one?
    {at:P.floor,place:"floor",keys:[[P.floor,960,540,1.0]],d:2,draw:(x,tt)=>{ow_floor(x,tt,{pose:{mei:{pose:"shrug"},jun:{pose:"shrug"}}});
      for(let i=0;i<5;i++){const t0=P.which-0.4+0.28*i,a=gv_io(tt,t0,sc.dur-1.4,0.4),sx=GV_FL.spot(i);if(a>0.01)gv_say(x,clamp(sx-115+(i%2?24:-24),20,1660),262+(i%2)*26,["which one?"],sx,530,{a,k:0.9+0.1*spring(fin(tt,t0,0.5)),seed:230+i});}}}]);
  wc_paperOver(ctx,S);});

// ---- 4 · One to trust: the owners choose the glossary on the platform ----
// the stewards round the meeting room's table, and Sam standing at its end
function ow_meet(x,tt,o){o=o||{};const M=GV_MT,s=M.s;[["anil",0],["clara",1],["mei",2],["yusuf",3],["jun",4]].forEach(([id,i])=>gv_behind(x,id,M.seats[i],M.top,s,Object.assign({pose:"listen",t:tt+i*0.6,flip:M.seats[i]>1204},(o.pose||{})[id]||{})));
  x.drawImage(gv_place("meetingTable"),0,0,W,H);person(x,"sam",1730,905,s,{pose:"listen",t:tt,flip:true});}
scene("trust",(ctx,S,t,sc)=>{const c=sc.cues,P=ow_once(sc,"P",()=>({big:wAt(sc,"not","Not the"),pick:wAt(sc,"not","the glossary"),term:c.term-0.4,u:[wAt(sc,"term","a definition"),wAt(sc,"term","an owner"),wAt(sc,"term","a status"),wAt(sc,"term","the date")],
    words:c.words-0.3,dict:wAt(sc,"dict","A data"),cat:wAt(sc,"dict","A catalog")}));
  gv_shots(ctx,S,t,sc.dur,[
    {at:0,place:"meeting",keys:[[0,960,560,1.0],[c.not-0.5,1204,360,1.75]],d:1.8,draw:(x,tt)=>{ow_meetFive(x,fin(tt,P.big,0.8),fin(tt,P.pick-0.2,1.0));ow_meet(x,tt,{pose:{yusuf:{pose:"explain"}}});}},
    // what a term holds, line by line
    {at:P.term,place:"meetScreen",keys:[[P.term,960,450,1.0]],d:2,draw:(x,tt)=>ow_termCard(x,280,170,1360,P.u.map(v=>tt-v+0.15),{h:570})},
    // the business's words; each table and column; finding the data
    {at:P.words,place:"meetScreen",keys:[[P.words,960,450,1.0]],d:2,draw:(x,tt)=>ow_three(x,[tt-P.words-0.1,tt-P.dict,tt-P.cat])}]);
  wc_paperOver(ctx,S);});

// ---- 5 · Every tool reads it: four glossaries retired or made to read from it ----
scene("read",(ctx,S,t,sc)=>{const c=sc.cues,P=ow_once(sc,"P",()=>({stamp:wAt(sc,"tool","is retired"),move:wAt(sc,"tool","Its terms"),arch:wAt(sc,"tool","the rest"),plan:c.sheet-0.35,link:wAt(sc,"sheet","links"),
    click:wAt(sc,"sheet","instead"),pol:c.policy-0.35,says:wAt(sc,"policy","now says"),as:wAt(sc,"policy","award, as"),dash:c.dash-0.35,read:wAt(sc,"dash","read from"),night:c.copy-0.4,
    names:wAt(sc,"copy","it says"),sync:wAt(sc,"copy","checked against"),way:c.way-0.4,one:wAt(sc,"way","one way")}));
  gv_shots(ctx,S,t,sc.dur,[
    // the board: the glossary on the platform stays; the 2019 tool is stamped retired, its owned terms move across, the rest archived
    {at:0,place:"boardGov",keys:[[0,960,488,1.04],[P.stamp-0.3,1040,480,1.06]],d:2.2,draw:(x,tt)=>{gv_halo(x,OW_BX.cx(0)-150,OW_BX.top,300,OW_BX.h,OW_MEAN[0],0.6*fin(tt,c.others,0.8));
      ow_board(x,tt,{lit:0.6});gv_stamp(x,OW_BX.cx(4),OW_BX.top+190,"retired",fin(tt,P.stamp,0.3),{col:GV.greyInk,size:44});
      ow_archive(x,fin(tt,P.arch-0.7,0.4),(tt-P.arch)/1.2);for(let j=0;j<3;j++)ow_flyCard(x,j,(tt-P.move-0.3*j)/1.2);}},
    // Planning's spreadsheet: award's cell becomes a link, and opens the term
    {at:P.plan,place:"screenPlan",keys:[[P.plan,960,450,1.0],[P.link,1000,420,1.06]],d:2,draw:(x,tt)=>{const [sx,sy,sw,sh]=GV_SC,u=fin(tt,P.link,0.5),cl=P.click+0.1;
      ow_planSheet(x,sx,sy,sw,sh,u,fin(tt,cl+0.2,0.45));const e=easeCam(clamp((tt-P.link-0.2)/(cl-P.link-0.2),0,1));ow_cursor(x,lerp(1420,sx+500,e),lerp(640,sy+184,e),1.2,clamp((tt-cl)/0.5,0,1));}},
    // the registrar's policy: its own words struck, and the glossary named instead
    {at:P.pol,place:"screenReg",keys:[[P.pol,960,450,1.0],[P.says,940,430,1.05]],d:2,draw:(x,tt)=>{const [sx,sy,sw,sh]=GV_SC;ow_policyScreen(x,sx,sy,sw,sh,clamp((tt-P.says)/0.8,0,1),clamp((tt-P.as)/1.6,0,1));}},
    // Anil's dashboard: the glossary's words, read from the platform
    {at:P.dash,place:"faculty",keys:[[P.dash,960,540,1.0],[P.dash+0.7,830,465,1.7]],d:1.8,draw:(x,tt)=>{gv_behind(x,"anil",GV_FX.seat[0],GV_FX.top,GV_FX.seat[1],{pose:"stand",t:tt,flip:true});
      x.drawImage(gv_place("facultyDesk"),0,0,W,H);const [sx,sy,sw,sh]=GV_FX.screen;ow_dash(x,sx,sy,sw,sh,"glossary",fin(tt,P.read,0.5));}},
    // the data team's room at night, and its copy of award, which says where its words came from, checked against the glossary every night
    {at:P.night,place:"dataNight",keys:[[P.night,960,540,1.0],[P.night+0.1,900,520,1.06]],d:3,draw:(x,tt)=>{GV_DT.mon.forEach(([mx,my,mw,mh])=>{x.save();x.fillStyle=rgba([226,232,244],0.92);x.fillRect(mx,my,mw,mh);x.restore();gv_lines(x,mx+14,my+22,mw-30,4,22,1);});}},
    {at:P.names-0.3,place:"screenNight",keys:[[P.names-0.3,960,420,1.0],[P.names,920,400,1.08]],d:2.4,draw:(x,tt)=>{const [sx,sy,sw,sh]=GV_SC;ow_copy(x,sx,sy,sw,sh,{lit:fin(tt,P.names+0.3,0.6)});
      ow_tagAt(x,tt,P.sync,null,1290,690,"checked every night",{size:32});}},
    // one way: from the glossary to every office's screen, never back
    {at:P.way,place:"floor",keys:[[P.way,960,540,1.0]],d:2,draw:(x,tt)=>{ow_floor(x,tt);const p=clamp((tt-P.way-0.4)/1.6,0,1)*1.32;ow_oneWay(x,960,300,p,1);
      for(let i=0;i<5;i++)ow_screenWord(x,i,fin(tt,P.way+0.4+1.6*(1+i*0.08)/1.32,0.4));ow_floorCard(x,960,300,1);ow_tagAt(x,tt,P.one,null,960,120,"one way",{size:32});}}]);
  setScreen(ctx,S);ow_nameCard(ctx,24,740,"Clara Jensen","Planning",gv_io(t,P.plan+0.3,P.pol-0.3,0.4));ow_nameCard(ctx,24,740,"Anil Kurian","Faculty of Health",gv_io(t,P.dash+0.3,P.dash+2.4,0.4));
  wc_paperOver(ctx,S);});

// ---- 6 · When a word changes: Monday's change, as a change notice Mei signs ----
scene("change",(ctx,S,t,sc)=>{const c=sc.cues,P=ow_once(sc,"P",()=>({months:wAt(sc,"before","found months"),moves:wAt(sc,"before","when a number"),night:c.night-0.4,chk:wAt(sc,"night","the check"),found:wAt(sc,"night","found it"),nt:wAt(sc,"night","sent a"),
    touch:wAt(sc,"night","what the new"),rows:[c.list,wAt(sc,"list","its dashboard"),wAt(sc,"list","The wallet")],mei:c.mei-0.4,appr:wAt(sc,"mei","approved"),used:wAt(sc,"mei","where her"),
    num:c.number-0.4,six:wAt(sc,"number","six credit"),kept:wAt(sc,"rule","So it's"),sets:wAt(sc,"rule","as a business"),every:wAt(sc,"rule","every report")}));
  gv_shots(ctx,S,t,sc.dur,[
    // without a nightly check: a dashboard's number moves, months later, and nobody knows why
    {at:0,place:"screenFac",keys:[[0,960,450,1.0],[0.2,980,440,1.06]],d:4,draw:(x,tt)=>{const [sx,sy,sw,sh]=GV_SC;ow_stepChart(x,sx,sy,sw,sh,clamp((tt-1.0)/((P.moves-1.0)/0.75),0,1),fin(tt,P.moves,0.5));
      ow_tagAt(x,tt,1.0,null,560,186,"without a nightly check",{size:32,wash:GV.grey,washA:0.35});ow_tagAt(x,tt,P.months,null,1290,250,"found months later",{size:32});}},
    // Monday night: the nightly check finds the data team's copy still in the old words, and sends a change notice, listing what the new
    // words touch and who owns each part
    {at:P.night,place:"screenNight",keys:[[P.night,960,450,1.0],[P.touch-0.3,960,500,1.1]],d:2,draw:(x,tt)=>{const a=fin(tt,P.nt+0.5,0.35),[sx,sy,sw,sh]=GV_SC;
      ow_tagAt(x,tt,P.night+0.3,null,960,52,"Monday night",{size:30});
      if(a<0.99){ow_copy(x,sx,sy,sw,sh,{m:1,ring:clamp((tt-P.chk)/0.8,0,1)});ow_tagAt(x,tt,P.found,null,1300,322,"out of date",{size:32});}
      if(a>0.01){x.save();x.translate(60*(1-a),0);withA(x,a,()=>ow_notice(x,OW_NT.x,OW_NT.y,OW_NT.w,{changed:fin(tt,P.nt+0.65,0.5),
        touch:fin(tt,P.touch,0.4),rows:P.rows.map(r=>fin(tt,r-0.1,0.45)),owners:fin(tt,P.rows[2]+1.3,0.5)}));x.restore();}}},
    // Tuesday morning: Mei signs the notice, and sees where her words go; then the camera comes back to her, smiling
    {at:P.mei,place:"regClose",keys:[[P.mei,1160,500,1.4],[P.appr-0.3,1371,505,1.75],[P.used+0.2,1150,520,1.32]],d:1.6,draw:(x,tt)=>{const smile=fin(tt,P.used+0.8,0.6);
      gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],{pose:"stand",expr:smile>0.5?"smile":"calm",t:tt});x.drawImage(gv_place("regDesk"),0,0,W,H);
      const [sx,sy,sw,sh]=GV_RX.screen;ow_signNotice(x,sx,sy,sw,sh,{sign:clamp((tt-P.appr-0.1)/0.8,0,1),ok:fin(tt,P.appr+0.95,0.4),glow:[0,1,2].map(i=>fin(tt,P.used+0.3*i,0.4))});
      ow_tagAt(x,tt,P.mei+0.3,null,1420,262,"Tuesday morning",{size:30});}},
    // Jun: a number in the words, kept in one place, as a business rule every report reads
    {at:P.num,place:"screenData",keys:[[P.num,960,450,1.0],[P.kept-0.4,960,520,1.08]],d:2,draw:(x,tt)=>{const [sx,sy,sw,sh]=GV_SC;
      ow_ruleScreen(x,sx,sy,sw,sh,{under:clamp((tt-P.six)/0.6,0,1),note:fin(tt,P.six+0.7,0.5),card:clamp((tt-P.kept-0.1)/0.7,0,1),green:fin(tt,P.sets,0.5),read:fin(tt,P.every,0.45)});}}]);
  setScreen(ctx,S);ow_nameCard(ctx,24,740,"Jun Park","Analytics engineer",gv_io(t,P.num+0.3,P.kept-0.4,0.4));
  wc_paperOver(ctx,S);});

// ---- 7 · Agreed by people: the workshop, and the keepers thanked ----
PEOPLE.ow_fac={name:"",role:"Faculty of Business",side:"Business",does:"uses",edge:BIZ,seed:49,skin:[188,138,104],hair:{style:"curly",c:[40,30,26]},
  top:{kind:"sweater",c:[86,110,150]},bottom:{c:[60,60,70]},shoe:[48,40,36],build:{sh:70,hip:60,h:0.97}};
scene("agree",(ctx,S,t,sc)=>{const c=sc.cues,P=ow_once(sc,"P",()=>({n:[wAt(sc,"workshop","should a"),wAt(sc,"workshop","from how"),wAt(sc,"workshop","credit points")],ring:sc.ends.workshop-0.2,
    keeps:c.keeps-0.4,fly:wAt(sc,"keeps","keeps what"),lose:c.lose-0.4,anil:wAt(sc,"lose","lose something")-0.1,thanks:c.thanks-0.7,best:wAt(sc,"thanks","move into")-0.3}));
  const warm=1-fin(t,P.lose,0.5);
  gv_shots(ctx,S,t,sc.dur,[
    // a week before: Mei at the board, the faculties at the table, the notes going up as they argue; one agreed
    {at:0,place:"meeting",keys:[[0,960,560,1.0],[c.workshop,560,432,1.25],[P.keeps,830,432,1.3]],d:1.8,draw:(x,tt)=>{const M=GV_MT;
      ow_meetTerm(x,fin(tt,P.fly+1.3,0.6),fin(tt,P.fly+1.0,0.4));
      // the agreed note flies to the screen and becomes its words
      for(let j=0;j<3;j++){const fly=j===2?easeCam(clamp((tt-P.fly)/1.3,0,1)):0;if(fly>0&&fly<1){const [x0,y0]=OW_WN[2][3],x1=GV_MT.screen[0]+170,y1=GV_MT.screen[1]+200;
          withA(x,1-fin(fly,0.8,0.2),()=>ow_wsNote(x,2,1,0,[lerp(x0,x1,fly),lerp(y0,y1,fly)-120*Math.sin(Math.PI*fly)],1-0.4*fly));}
        else if(fly<=0)ow_wsNote(x,j,fin(tt,P.n[j]+(j===2?0.5:0),0.4),j===2?clamp((tt-P.ring)/0.7,0,1):0);}
      if(tt<P.fly)ow_wsAgreed(x,fin(tt,P.ring+0.6,0.5));
      // they argue it out: Mei puts the question, Anil answers, the Faculty of Business answers him
      person(x,"mei",M.stand[0]+20,M.stand[1],M.s,{pose:"stand",pose2:"explain",mix:gv_io(tt,c.workshop-0.2,P.n[1]-0.2,0.5),t:tt,flip:false});
      [["anil",0,[P.n[1]-0.3,P.n[2]-0.3]],["ana",1,null],["ow_fac",2,[P.n[2]-0.3,P.ring+0.3]]].forEach(([id,i,sp])=>gv_behind(x,id,M.seats[i],M.top,M.s,{pose:"listen",pose2:"explain",mix:sp?gv_io(tt,sp[0],sp[1],0.5):0,t:tt+i*0.5,flip:false}));
      x.drawImage(gv_place("meetingTable"),0,0,W,H);}},
    // the keepers of the other glossaries: Clara and her definitions, Anil and his descriptions
    {at:P.lose,place:"planning",keys:[[P.lose,900,430,1.15],[P.lose+0.1,850,450,1.22]],d:2.6,draw:(x,tt)=>{ow_planDefs(x);person(x,"clara",380,905,0.8,{pose:"listen",expr:"concerned",t:tt,flip:true});}},
    {at:P.anil,place:"faculty",keys:[[P.anil,880,465,1.6]],d:2,draw:(x,tt)=>{gv_behind(x,"anil",GV_FX.seat[0],GV_FX.top,GV_FX.seat[1],{pose:"stand",expr:"concerned",t:tt,flip:true});x.drawImage(gv_place("facultyDesk"),0,0,W,H);ow_anilDefs(x);}},
    // thanked: Yusuf at Planning's door with a card
    {at:P.thanks,place:"floor",keys:[[P.thanks,711,560,1.35]],d:2,draw:(x,tt)=>{ow_floor(x,tt,{out:["yusuf"],pose:{clara:{pose:"stand",expr:fin(tt,P.thanks+0.8,0.5)>0.5?"smile":"calm",flip:true}}});
      person(x,"yusuf",170,GV_FL.walk,0.62,{pose:"hold",carry:ow_heldThanks,t:tt});}},
    // and their best definitions move into the one that stays, with their names
    {at:P.best,place:"meetScreen",keys:[[P.best,960,450,1.0]],d:2,draw:(x,tt)=>ow_glossList(x,[tt-P.best-0.3,tt-P.best-1.3])}]);
  setScreen(ctx,S);gv_tint(ctx,0,0,W,H,GV.gold,0.12*warm);ow_pill(ctx,t,[[0,"a week before"]],fin(t,0.4,0.5)*warm);
  wc_paperOver(ctx,S);});

// ---- 8 · One word, one home: policy 12's line runs in the work ----
scene("home",(ctx,S,t,sc)=>{const c=sc.cues,P=ow_once(sc,"P",()=>({tick:wAt(sc,"policy","glossary's"),floor:c.home-0.1,every:wAt(sc,"home","every tool"),end:sc.ends.idea+0.35}));
  gv_shots(ctx,S,t,sc.dur,[
    {at:0,place:"desk",keys:[[0,960,540,1.0],[0.3,1152,560,1.25]],d:2.4,draw:(x,tt)=>ow_binder12(x,370,160,fin(tt,P.tick,0.6),clamp((tt-P.tick-0.5)/1.2,0,1))},
    // the floor: every office's screen reads the same award, from one glossary
    {at:P.floor,place:"floor",keys:[[P.floor,960,540,1.0],[P.floor+1.5,960,520,1.08]],d:5,draw:(x,tt)=>{const go=1-fin(tt,P.end,0.6);ow_floor(x,tt,{names:go,pose:{yusuf:{pose:"stand",expr:"smile"}}});ow_oneWay(x,960,300,1.32,1-fin(tt,c.idea,1.0),(tt-P.every)/0.9);
      for(let i=0;i<5;i++)ow_screenWord(x,i,1);ow_floorCard(x,960,300,go);}}]);
  const a=fin(t,P.end+0.6,0.9);if(a>0){gv_end(ctx,S,t,P.end,"One word, one home","Keep one, and sync every tool from it.","Film 3 of 19");setScreen(ctx,S);
    withA(ctx,a,()=>wc_T(ctx,"Many glossaries are no glossary.",960,352,{w:700,size:48,align:"center",col:WC_DARK}));}
  wc_paperOver(ctx,S);});
