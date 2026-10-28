/* ===== A product with an owner: the nine chapters =====
   Each chapter is a few shots in the places of past.js, plan.js and the series' rooms.js, cut together with short dissolves (gv_shots).
   Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice
   if it's recorded again. Words on screen are on paper, cards, registers, boards, tags and speech bubbles, at least 28 px as seen, and
   above the captions. */

// ---- 1 · Who stands behind it: Istanbul's market, from the bedesten of 1461 to its guilds and its inspector in the 1600s ----
// 1461, the yard: two masons carry the last scaffold pole away on their shoulders, and two merchants walk in to the gate from behind us,
// one with bolts of silk in his arms, one with a locked chest on his shoulder. Drawn far to near
function po_gateFolk(x,tt,t0){const C=PO_GT,d=[0.928,-0.371],m1=po_stroll(C,tt,t0,1.0,12.0,8.5,9.0,1.05),m2=po_stroll(C,tt,t0,1.0-2.4*d[0],12.0-2.4*d[1],8.5-2.4*d[0],9.0-2.4*d[1],1.05);
  const s1=po_stroll(C,tt,t0+0.3,-7.4,8.2,-2.6,25.4,0.95),s2=po_stroll(C,tt,t0+1.5,-8.9,8.6,-3.4,25.0,0.95);
  const pole=()=>{const a=po_pj(C,m2.X-1.0*d[0],1.4,m2.Z-1.0*d[1]),b=po_pj(C,m1.X+1.3*d[0],1.4,m1.Z+1.3*d[1]),pw=Math.max(3,po_ppm(C,(m1.Z+m2.Z)/2)*0.1);
    x.save();x.lineCap="round";x.strokeStyle=rgba(wc_dim(PO.woodLt,0.2),1);x.lineWidth=pw+2;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();
    x.strokeStyle=rgba(PO.woodLt,1);x.lineWidth=pw;x.stroke();x.strokeStyle=rgba(wc_lit(PO.woodLt,0.3),0.7);x.lineWidth=pw*0.3;x.beginPath();x.moveTo(a[0],a[1]-pw*0.25);x.lineTo(b[0],b[1]-pw*0.25);x.stroke();x.restore();};
  [{Z:s1.Z,f:()=>po_back(x,"po_silk",s1.x,s1.y-s1.bob,s1.s,{ph:s1.ph,under:po_boltsBehind,noArms:true})},
   {Z:s2.Z,f:()=>po_back(x,"po_chest",s2.x,s2.y-s2.bob,s2.s,{ph:s2.ph,carry:(cx,P_)=>po_chestShoulder(cx,P_),armUp:-1})},
   {Z:m2.Z,f:()=>{pole();po_walker(x,"po_mason2",m2,{base:"po_pole",walk:"po_pole",t:tt+1});}},
   {Z:m1.Z,f:()=>po_walker(x,"po_mason",m1,{base:"po_pole",walk:"po_pole",t:tt})}].sort((a,b)=>b.Z-a.Z).forEach(o=>o.f());}
// inside: the silk merchant comes in with his bolts, the other stands at the cupboards with his chest
function po_hallFolk(x,tt,t0){const C=PO_IN,w=po_stroll(C,tt,t0-0.4,-3.0,8.9,-1.5,8.7,0.7),c2=po_at(C,0.8,9.2);
  person(x,"po_chest",c2.x,c2.y,c2.s,{pose:"po_hold",carry:po_heldChest,t:tt,flip:true});
  po_walker(x,"po_silk",w,{base:"po_hold",walk:"po_hold",carry:po_heldBolts,t:tt});}
// the 1520s, a street at a buyer's height. A buyer walks in, looking for what he came for; he turns a cap with a seam coming apart; he
// holds up the cloth he bought, a hand short, and looks back for its seller, lost in the crowd; then he goes, down the street and out of
// the market. The cap seller in his stall at the left; a cloth seller at the right, by his empty stall, watches him go
function po_scene1520(x,tt,P){const C=PO_STR,cp=po_pj(C,-3.85,0.7,6.1),cs=1.68*po_ppm(C,6.1)/560,cl=po_at(C,2.5,7.4),lost=fin(tt,P.traders,0.6);
  person(x,"po_capman",cp[0],cp[1],cs,{pose:tt>P.poor-0.2&&tt<P.stop?"po_offer":"listen",t:tt});
  const away=po_stroll(C,tt,P.stop,-1.9,5.5,0.5,16.5,1.15),walkIn=po_stroll(C,tt,P.st+0.2,0.7,5.0,-1.9,5.5,1.0);
  // the cloth seller is farther than the buyer until the buyer has walked past him into the street
  const seller=()=>person(x,"po_cloth1",cl.x,cl.y,cl.s,{pose:"listen",t:tt+2,flip:true,expr:lost>0.5?"concerned":"calm",nod:-0.06*lost});
  if(tt>=P.stop&&away.Z>7.4){po_back(x,"po_buyer",away.x,away.y-away.bob,away.s,{ph:away.ph});seller();}
  else{seller();
    if(tt>=P.stop)po_back(x,"po_buyer",away.x,away.y-away.bob,away.s,{ph:away.ph});
    else if(walkIn.moving||tt<P.st+0.2)po_walker(x,"po_buyer",walkIn,{t:tt});
    else if(tt<P.poor-0.2)po_walker(x,"po_buyer",walkIn,{pose:"listen",t:tt,flip:true,nod:0.04*Math.sin(tt*1.3)});
    else if(tt<P.short-0.2)po_walker(x,"po_buyer",walkIn,{pose:"po_hold",t:tt,flip:true,expr:"concerned",carry:po_heldCap(PO.felt[4],{seam:fin(tt,P.poor,0.6),turn:Math.sin(tt*1.4)*0.6})});
    else po_walker(x,"po_buyer",walkIn,{pose:"po_measure",t:tt,flip:false,wide:true,expr:"worried",carry:po_heldClothArm});}
  // where to find it, what it will be, who answers for it: over him as each is named, gone as he goes
  [["where to find it?",P.search],["what will it be?",P.poor],["who answers for it?",P.short]].forEach(([q,t0],i)=>po_tagAt(x,tt,t0,P.stop+0.5,790,300+i*72,q,{size:30}));}
// the 1600s, the cap makers' street: the master in his stall, his apprentice stitching felt beside him; the guild's officer in front of
// the counter, turning a cap in his hands, and nodding over it
const PO_G16={master:[-3.8,6.0],appr:[-3.9,7.0],officer:[-2.0,5.8]};
function po_master(x,tt,o){const C=PO_STR,[X,Z]=PO_G16.master,p=po_pj(C,X,0.7,Z);person(x,"po_master",p[0],p[1],1.68*po_ppm(C,Z)/560,Object.assign({pose:"listen",t:tt},o||{}));}
function po_appr(x,tt){const C=PO_STR,[X,Z]=PO_G16.appr,ys=po_pj(C,X,0.95,Z),yh=po_pj(C,X,1.48,Z),sh=(ys[1]-yh[1])/172,s=sh/PEOPLE.po_appr.build.h,cut=po_pj(C,-3.2,0.68,Z)[1];
  x.save();x.beginPath();x.rect(-W,-H,3*W,cut+H);x.clip();
  person(x,"po_appr",ys[0],ys[1]+330*sh,s,{pose:"po_stitch",pose2:"po_stitchUp",mix:0.5+0.5*Math.sin(tt*2.4),carry:po_heldFelt,t:tt});x.restore();}
function po_officer(x,tt,nodAt){const C=PO_STR,[X,Z]=PO_G16.officer,p=po_at(C,X,Z),n=nodAt==null?0:Math.max(0,Math.sin(Math.PI*clamp((tt-nodAt)/0.9,0,1)));
  person(x,"po_officer",p.x,p.y,p.s,{pose:"po_hold",pose2:"po_holdNod",mix:n,t:tt,flip:true,expr:tt>nodAt+0.4?"smile":"calm",carry:po_heldCap(PO.felt[2],{turn:Math.sin(tt*1.5)*0.8})});}
// at the cloth seller's stall: the market inspector, his man with a balance and his man with the rod; the seller in his stall
function po_inspectors(x,tt,t0){const C=PO_STR,sp=po_pj(C,-3.85,0.7,9.6),ss=1.68*po_ppm(C,9.6)/560,
    I=po_stroll(C,tt,t0-1.2,-0.4,11.6,-1.6,9.6,1.1),B=po_stroll(C,tt,t0-1.0,0.4,12.4,-0.9,10.3,1.1),R=po_stroll(C,tt,t0-1.4,-1.0,11.0,-2.3,9.2,1.1);
  person(x,"po_cloth2",sp[0],sp[1],ss,{pose:"listen",t:tt,expr:tt>t0+0.6?"concerned":"calm"});
  [[B,"po_scales",{pose:"po_balance",carry:po_heldBalance}],[I,"po_inspector",{pose:"listen"}],[R,"po_rodman",{pose:"po_staff",carry:po_heldRod}]].sort((a,b)=>b[0].Z-a[0].Z)
    .forEach(([w,id,o])=>po_walker(x,id,w,Object.assign({t:tt,flip:true},o)));}
// the close-up at the counter: the seller behind it, the bolt and its length on it, the rod stepping along it; the cloth ends a hand short
// of the rod's last mark, bracketed in red; the seller lowers his head
function po_counter(x,tt,P,o){const C=PO_CC,bow=fin(tt,o.bow==null?1e9:o.bow,0.7);
  gv_behind(x,"po_cloth2",C.seller[0],C.top,C.seller[1],{standing:true,pose:"listen",pose2:"po_bow",mix:bow,expr:bow>0.3?"worried":"concerned",t:tt});
  x.drawImage(gv_place("clothFront"),0,0,W,H);const end=po_rodAt(x,tt,0,o.steps);
  if(o.mark!=null){po_shortMark(x,C.cloth[1],end,C.y-34,(tt-o.mark)/0.6);po_tagAt(x,tt,o.mark+0.2,null,(C.cloth[1]+end)/2-60,C.y-110,"sold short",{size:34});}
  po_back(x,"po_inspector",1806,1066,1.42,{shadow:false});}
// the master's stall, as a buyer sees it, and the three things a buyer knows there, each as it's named
function po_knows(x,tt,t0s,t1){["where to find it","what it will be","who stands behind it"].forEach((s,i)=>po_tagAt(x,tt,t0s[i],t1,470,226+i*72,s,{size:30}));}
// data has the same problem: the three questions over a plain card, "data"; and the same answer, each question turning into its answer,
// in gold, and a gold frame round the card
function po_dataCard(x,tt,P){const cx=600,cy=540,a=fin(tt,P.data+0.1,0.5),gold=fin(tt,P.prod,0.6);if(a<=0.01)return;
  withA(x,a,()=>{x.save();x.translate(cx,cy+16*(1-a));gv_card(x,-250,-160,500,320,[],{pin:false,seed:811});
    // a table's grid, faint, under its word
    x.strokeStyle=rgba(WC_MUTED,0.28);x.lineWidth=2;for(let i=0;i<4;i++){x.beginPath();x.moveTo(-170,-40+i*40);x.lineTo(170,-40+i*40);x.stroke();}
    for(let k=0;k<4;k++){x.beginPath();x.moveTo(-170+k*113,-40);x.lineTo(-170+k*113,80);x.stroke();}
    wc_T(x,"data",0,-70,{w:800,size:64,align:"center",col:WC_DARK});
    if(gold>0.01){x.strokeStyle=rgba(GV.gold,0.95*gold);x.lineWidth=7;x.strokeRect(-262,-172,524,344);}x.restore();});
  [["where to find it?","a product",P.prod],["what will it be?","a promise",P.prom],["who answers for it?","someone who answers for it",P.some]].forEach(([q,ans,t1],i)=>{const y=372+i*126;
    po_tagAt(x,tt,P.same+0.15+i*0.3,t1,1310,y,q,{size:34});po_tagAt(x,tt,t1,null,1310,y,ans,{size:34,wash:GV.gold,washA:0.4});});}
// the street in the evening: the woman and her friend walk home, a man walks up the street, the master at his stall
function po_evening(x,tt,t0){const C=PO_STR,a=po_stroll(C,tt,t0,-1.1,7.0,-0.3,15.5,0.8),b=po_stroll(C,tt,t0+0.3,-0.5,7.4,0.3,15.8,0.8),m=po_stroll(C,tt,t0,1.0,15.0,1.7,8.0,0.9);
  po_master(x,tt,{expr:"smile"});
  [{Z:a.Z,f:()=>po_back(x,"po_woman",a.x,a.y-a.bob,a.s,{ph:a.ph})},{Z:b.Z,f:()=>po_back(x,"po_friend",b.x,b.y-b.bob,b.s,{ph:b.ph+1})},{Z:m.Z,f:()=>po_walker(x,"po_silk",m,{t:tt})}]
    .sort((p,q)=>q.Z-p.Z).forEach(o=>o.f());}

scene("bazaar",(ctx,S,t,sc)=>{const c=sc.cues,P=po_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{stone:w("hall","stone"),most:w("hall","most")-0.25,precious:w("hall","precious"),air:c.streets-0.3,y20:c.y1520,eight:w("y1520","eight"),
      st:c.harm-0.3,search:w("harm","searching"),poor:w("harm","poor"),short:w("harm","sold short"),stop:w("lose","stop"),traders:w("lose","traders"),
      order:c.order-0.3,named:c.named,g16:c.guild-0.3,guild:w("guild","guild"),rules:w("guild","rules"),off:w("check","officers"),mkt:w("check","market")-0.2,insp:w("check","inspector"),
      cc:Math.max(w("check","inspector")+0.9,c.short-1.4),sold:w("short","short"),answers:w("short","answers"),
      buyer:c.buyer-0.4,find:w("buyer","find"),what:w("buyer","what"),who:w("buyer","who"),back:c.back-0.2,
      data:c.data-0.3,same:w("data","same problem"),prod:w("data","a product"),prom:w("data","a promise"),some:w("data","someone"),eve:c.breath-0.2,title:c.breath+1.2};});
  gv_shots(ctx,S,t,sc.dur,[
    // 1461, the yard: the hall's long face, its gate, the domes over its parapet; the masons carry the last pole away, the merchants walk in
    {at:0,place:"gate",keys:[[0,960,540,1.0],[0.3,880,560,1.12]],d:7.5,draw:(x,tt)=>{po_gateFolk(x,tt,0);po_tagAt(x,tt,P.stone+0.1,null,600,230,"the bedesten",{size:32});}},
    // inside: silk and velvet on a rack, a goldsmith's tray, rows of locked cupboards
    {at:P.most,place:"hallIn",keys:[[P.most,920,640,1.2],[P.most+0.1,920,660,1.26]],d:3,draw:(x,tt)=>{po_hallFolk(x,tt,P.most);x.drawImage(gv_place("hallInFront"),0,0,W,H);
      po_tagAt(x,tt,P.precious,null,960,480,"the city's most precious goods",{size:32});}},
    // from above: shops spring up along the streets from its four gates; by the 1520s, the streets are full of shops and people
    {at:P.air,keys:[[P.air,960,560,1.35],[P.air+0.3,960,540,1.0]],d:3.6,draw:(x,tt)=>{const g=tt<P.y20?lerp(PO_K1461,0.45,easeCam(clamp((tt-P.air)/(P.y20-P.air),0,1))):lerp(0.45,1,easeCam(clamp((tt-P.y20)/3,0,1)));
      po_airAt(x,{g,crowd:fin(tt,P.y20+0.6,1.5)});po_tagAt(x,tt,P.eight,null,960,140,"about 782 shops outside the hall",{size:32});}},
    // down in a street of the 1520s: the buyer, his three questions, and the trader who loses him
    {at:P.st,place:"st1520",keys:[[P.st,900,560,1.1],[P.poor-0.9,787,590,1.24],[P.stop+0.1,900,560,1.06]],d:2,draw:(x,tt)=>po_scene1520(x,tt,P)},
    // order: from above again; in time each trade gathers in a street of its own
    {at:P.order,keys:[[P.order,960,540,1.0],[P.order+0.1,960,520,1.05]],d:4,draw:(x,tt)=>{po_airAt(x,{g:1,crowd:1,trades:[0,1,2].map(i=>fin(tt,P.named+0.5+i*0.8,0.8))});
      ["goldsmiths","cap makers","quilt makers"].forEach((s,i)=>{const [tx,ty]=po_tradeTagAt(i);po_tagAt(x,tt,P.named+0.6+i*0.8,null,tx,ty,s,{size:32});});}},
    // the cap makers' street in the 1600s: the guild, its rules, its officer checking a cap
    {at:P.g16,place:"st1600",keys:[[P.g16,760,560,1.18],[P.g16+0.1,711,560,1.35]],d:2.6,draw:(x,tt)=>{po_appr(x,tt);po_master(x,tt,{expr:tt>P.off+0.6?"smile":"calm"});po_officer(x,tt,P.off+0.3);
      po_tagAt(x,tt,P.guild,null,330,300,"the cap makers' guild",{size:30});po_tagAt(x,tt,P.rules,null,330,372,"rules for what a cap must be",{size:30});
      po_tagAt(x,tt,P.off,null,730,520,"the guild's officer",{size:30});}},
    // the next stall, a cloth seller's: the market inspector stops with his two men
    {at:P.mkt,place:"st1600",keys:[[P.mkt,640,560,1.62],[P.mkt+0.1,660,550,1.7]],d:2.4,draw:(x,tt)=>{po_master(x,tt,{expr:"calm"});po_inspectors(x,tt,P.mkt);
      po_tagAt(x,tt,P.insp,null,768,452,"the market inspector",{size:28});}},
    // at the counter: the rod goes along the cloth; it ends a hand short; the seller answers for it
    {at:P.cc,place:"clothClose",keys:[[P.cc,960,540,1.0],[P.cc+0.1,1000,560,1.06]],d:3,draw:(x,tt)=>po_counter(x,tt,P,{steps:[P.cc+0.2,P.cc+1.2],mark:P.sold,bow:P.answers})},
    // a woman comes up the cap makers' street to the master's stall: where to find it, what it will be, who stands behind it
    {at:P.buyer,place:"st1600",keys:[[P.buyer,780,560,1.12],[P.buyer+0.1,740,560,1.2]],d:3,draw:(x,tt)=>{const w=po_stroll(PO_STR,tt,P.buyer+0.1,0.3,11.5,-2.0,6.3,1.3);
      po_master(x,tt,{pose:w.moving?"listen":"po_offer",expr:w.moving?"calm":"smile"});po_walker(x,"po_woman",w,{t:tt,flip:w.moving?w.flip:true});po_knows(x,tt,[P.find,P.what,P.who],null);}},
    // the next day: she comes back with a friend
    {at:P.back,place:"st1600",keys:[[P.back,740,560,1.2],[P.back+0.1,730,560,1.22]],d:2.4,draw:(x,tt)=>{const a=po_stroll(PO_STR,tt,P.back-0.3,0.4,8.6,-1.8,6.4,1.15),b=po_stroll(PO_STR,tt,P.back,1.1,9.2,-1.0,7.0,1.15);
      po_master(x,tt,{pose:"po_offer",expr:"smile"});[[b,"po_friend"],[a,"po_woman"]].forEach(([w,id])=>po_walker(x,id,w,{t:tt,flip:w.moving?w.flip:true,expr:"smile"}));
      po_knows(x,tt,[P.back-1,P.back-1,P.back-1],null);po_light(x,"next",fin(tt,P.back,0.6));}},
    // data has the same problem, and the same answer
    {at:P.data,place:"plain",keys:[[P.data,960,540,1.0],[P.data+0.1,960,530,1.03]],d:4,draw:(x,tt)=>po_dataCard(x,tt,P)},
    // the street in the evening light, people coming and going
    {at:P.eve,place:"st1600",keys:[[P.eve,820,560,1.1],[P.eve+0.1,860,550,1.06]],d:4,draw:(x,tt)=>{po_evening(x,tt,P.eve-1);po_light(x,"eve",0.85);}}]);
  setScreen(ctx,S);po_pill(ctx,t,[[0,"Istanbul · 1461"],[P.y20,"Istanbul · 1520s"],[P.named,"Istanbul · 1600s"]],fin(t,0.4,0.5)*(1-gv_io(t,P.data,P.eve,0.35)));
  gv_title(ctx,S,t,P.title,"A product with an owner","data with a promise, and someone who keeps it","Film 8 of 19 · data governance");
  wc_paperOver(ctx,S);});

/* scaffold */
["late","promise","answers","job","steps","readers","life","found"].forEach(id=>scene(id,(ctx,S,t,sc)=>{gv_shots(ctx,S,t,sc.dur,[{at:0,place:"office",keys:[[0,960,540,1]]}]);wc_paperOver(ctx,S);}));
