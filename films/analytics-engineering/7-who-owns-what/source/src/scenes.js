/* ===== Who owns what: scenes =====
   Eight chapters, as in ../script.md. Adelaide, 1858: the register is the title; domains own meaning; a core model is what a
   domain publishes; dbt's three rings of access; grants, a second door; a project of Planning's own, a sketch; what stays
   shared; and groups first, with a hand-off to the agent.
   Motion (the series' helpers in shared/src/weeds.js): every shot drifts slowly (drift), things arrive with a spring (arrive),
   dust gives depth (motes), and what two chapters share carries across the cut: the register becomes the core card (1),
   the map shrinks beside its groups (2 → 3), the product card flies into the core of the rings (3 → 4), the rings fade into
   the arrows and doors (4 → 5), the one project box slides left (5 → 6), the two project boxes rise over their shared
   ground (6 → 7) and fold back into one (7 → 8).
   Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. The register is the title ---------- */
scene("register",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t);
  const cC=c("chain"),cT=c("title"),cR=c("transfer"),cB=c("bridge"),eR=sc.ends.transfer;
  // the present gathers on the right as the register becomes a core model
  const m=ease(fin(t,cB-0.3,1.8));if(m>0){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(5,8,15,"+(0.55*m)+")");g.addColorStop(0.5,"rgba(5,8,15,"+(0.9*m)+")");g.addColorStop(1,"rgba(5,8,15,"+(0.97*m)+")");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);motes(ctx,t,{a:m});}
  ctx.save();ctx.globalAlpha*=1-0.9*fin(t,B,0.8);drift(ctx,t,sc,{z:0.04,y:440});
  yearTag(ctx,110,96,"1858 · Adelaide",CLAY,fin(t,0.3,0.6)*(1-m));
  // the chain of old deeds unrolls; then it shrinks to a strip under the register
  const k=ease(fin(t,cC-0.2,1.4)),sk=lerp(1,0.42,k),cp=clamp((t-0.9)/(w("act","tracing")+1.2),0,1);
  ctx.save();ctx.translate(lerp(0,573,k),lerp(0,581,k));ctx.scale(sk,sk);
  const D=wo_chain(ctx,150,330,t,{p:cp,a:(1-0.45*k)*(1-m),txt:1-k});ctx.restore();
  arrive(ctx,920,262,t,w("act","chain"),()=>withA(ctx,1-k,()=>tag(ctx,920,262,"a chain of deeds",CLAY,{align:"center",size:22})),{dy:14});
  arrive(ctx,786,640,t,w("act","missing"),()=>withA(ctx,1-k,()=>tag(ctx,786,640,"one missing",EDGE_,{align:"center",size:22})),{dy:14});
  arrive(ctx,960,862,t,w("title","history")-0.2,()=>withA(ctx,1-m,()=>tag(ctx,960,862,"no need to check its history",CLAY,{align:"center",size:20})),{dy:14});
  // the buyer's hand: back along the chain, deed by deed, to the gap; later it rests on the register's page
  const h0=w("act","old deeds")-0.4,h1=w("act","hoping")+0.2,u=clamp((t-h0)/(h1-h0),0,1),st=Math.floor(u*3),fu=u*3-st,hx=u>=1?786:lerp(1590-st*268,1590-(st+1)*268,ease(clamp(fu*1.6,0,1)));
  const inA=fin(t,h0-0.5,0.6)*(1-fin(t,cC-0.4,0.6)),hxIn=lerp(2100,hx,ease(fin(t,h0-0.5,0.8)));
  wo_hand(ctx,hxIn,486+Math.sin(u*Math.PI*3)*6,1,t,{a:inA,press:u>=1?0.6:0});
  const rA=fin(t,cT-0.4,0.6)*(1-fin(t,cR-0.6,0.6));wo_hand(ctx,lerp(2000,1232,ease(fin(t,cT-0.4,1.0))),262,1,t,{a:rA,rot:-0.02});
  // the register, open on one certificate of title; a transfer changes one line; it closes
  const bA=fin(t,cC+0.1,0.9)*(1-m),ch=fin(t,w("transfer","change")-0.1,1.2),cl=fin(t,eR+0.25,1.0);
  const bx=lerp(560,940,m),by=150;
  arrive(ctx,960,400,t,cC+0.1,()=>wo_register(ctx,bx,by,800,500,t,{a:bA,change:ch,close:cl,parcel:clamp((t-cC-0.6)/1.4,0,1)}),{d:1.1,from:0.9});
  // the memorandum of transfer, signed with a quill and stamped
  const fA=fin(t,cR-0.3,0.7)*(1-fin(t,eR+0.1,0.6)),fx=lerp(1900,1440,ease(fin(t,cR-0.3,1.0))),sg=clamp((t-w("transfer","signed")+0.1)/1.1,0,1),pr=fin(t,w("transfer","owner")+0.25,0.35);
  wo_transfer(ctx,fx,190,360,460,t,{a:fA,sig:sg,press:pr});
  wo_quill(ctx,fx+34+sg*180*0.9,190+460-112-Math.sin(sg*TAU*3.2)*12,0.62,t,{a:fA*fin(t,w("transfer","signed")-0.5,0.4)*(1-fin(t,w("transfer","signed")+1.2,0.4))});
  // the words on the top line: the law, then what it made true
  const tt=[["the Real Property Act · Robert Torrens",w("chain","law")-0.2,w("chain","register the title")-0.3],["the register is the title",w("chain","register the title")-0.2,cT-0.2],["rely on it",w("title","rely")-0.2,cR-0.3],["only a registered transfer",w("transfer","registered")-0.2,w("transfer","signed")-0.1],["signed by the owner",w("transfer","signed"),cB-0.4]];
  tt.forEach(([s,t0,t1])=>{const q=fin(t,t0,0.4)*(1-fin(t,t1,0.4));if(q>0)arrive(ctx,960,104,t,t0,()=>withA(ctx,q,()=>tag(ctx,960,104,s,PARCH,{align:"center",size:24})),{dy:12});});
  // the bridge: the closed register drifts right, towards the present, and becomes a core model
  const cx=lerp(1040,1220,m);wo_coreCard(ctx,cx,300,480,170,{a:fin(t,cB+0.4,1.0),stack:fin(t,w("bridge","core models"),0.8),sub:"a core model · published by its owner"});
  [["their owner publishes them","publishes"],["everyone relies on them","relies"],["only their owner changes them","only their owner"]].forEach(([s,k_],i)=>arrive(ctx,170,420+i*72,t,w("bridge",k_)-0.1,()=>tag(ctx,170,420+i*72,s,TRUST,{size:24}),{dy:16}));
  arrive(ctx,1460,560,t,w("bridge","core models")+0.2,()=>T(ctx,"the credential's core models",1460,560,{w:700,size:22,align:"center",color:rgba(SOFT,1)}),{dy:12});
  ctx.restore();weedsTitle(ctx,S,t,B,"Who owns what","owners publish; consumers build on what's published",WEED);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Domains ---------- */
// each territory: where it sits on the full map (F) and on the small map beside the groups card (C), its owner, and what it owns
const WO_TER=[["registrar","registrar's office","Mei Tanaka",[100,140,840,340],[60,120,450,300],[["learners"],["awards"],["credentials"],["SIS · student IDs",1,WO_REG]],"mei",7],
  ["learning","learning team","Tom Whitfield, for the team",[980,140,840,340],[530,120,450,300],[["microcredentials"],["badges"],["LMS",1,WO_LRN],["SC",1,WO_SC]],"tom",4],
  ["planning","Planning","owns its mart",[100,520,840,330],[60,440,450,300],[["mart_planning__near_award",2]],"team",1],
  ["wallet","wallet app","owns its marts",[980,520,840,330],[530,440,450,300],[["mart_wallet__learners",2],["mart_wallet__credentials",2]],"team",2]];
function wo_map(ctx,t,o){const m=o.m||0,on=o.on||[1,1,1,1],ch=o.chips||[],fl=o.flags||0;
  WO_TER.forEach(([dk,nm,who,F,C,items,pid,nDots],i)=>{const a=on[i];if(a<=0.01)return;const[x,y,w,h]=F.map((v,j)=>lerp(v,C[j],m)),col=WO_DOM[dk][1];
    arrive(ctx,x+w/2,y+h/2,t,o.t0[i],()=>{wo_terr(ctx,x,y,w,h,col,nm,t,{seed:i+1});T(ctx,who,x+44,y+80,{w:600,size:18,color:rgba(SOFT,1)});
      // the owner, on the right, while the map is full size
      withA(ctx,1-m,()=>{if(pid==="team")wo_team(ctx,x+w-120,y+h-150,0.95,col,t);else person(ctx,pid,x+w-110,y+h-14,0.4,{t});});
      // what it owns: one column on the full map, two on the small one
      let cx=x+26,cy=y+116,col2=x+26+Math.max(...items.filter((_,j)=>j%2===0).map(([s,k])=>tw(ctx,s,k===2?18:20,k?500:700,k?"mono":undefined)+28))+16;
      items.forEach(([s,k,kc],j)=>{const q=(ch[i]||[])[j]||0;if(q<=0)return;const two=items.length>2,xx=lerp(x+26,two&&j%2?col2:x+26,m),yy=lerp(y+116+j*48,y+116+(two?Math.floor(j/2):j)*48,m);
        arrive(ctx,xx+60,yy,t,q,()=>wo_chip(ctx,xx,yy,s,col,{mono:!!k,size:k===2?18:20,text:kc||INK}),{dy:10,from:0.8});});
      // its models, each with a small flag that reads its meta.domain
      if(m>0.5)withA(ctx,fin(m,0.5,0.5),()=>{for(let d=0;d<nDots;d++){const px=x+40+d*30,py=y+h-70;wo_dot(ctx,px,py,dk==="registrar"&&d>=3?TRUST:dk==="planning"||dk==="wallet"?LAYER4[3][1]:LAYER4[0][1],1,7);wo_pennant(ctx,px+2,py-8,col,fin(fl,d*0.06,0.4));}
        withA(ctx,fin(fl,0.4,0.5),()=>T(ctx,"meta.domain: "+dk,x+34,y+h-28,{f:"mono",w:500,size:18,color:rgba(col,1)}));});},{d:0.9,from:0.92});});}
scene("domains",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cR=c("registrar"),cF=c("follows"),lift=ease(fin(t,w("registrar","registrar's")-0.5,0.8)),m=ease(fin(t,cF-0.2,1.4));
  // one project, everything green, with Jun beside it; then the graph lifts away into a map
  withA(ctx,1-lift,()=>{ctx.save();ctx.translate(790,465);ctx.scale(1+0.15*lift,1+0.15*lift);ctx.translate(-790,-465);
    arrive(ctx,790,465,t,0.2,()=>{wo_proj(ctx,240,170,1100,590,"credentials · one project",[150,190,255]);wo_mini(ctx,300,260,980,440,t,{p:clamp((t-0.3)/1.2,0,1),green:fin(t,w("green","green")-0.2,0.8)});},{d:1.0,from:0.94});ctx.restore();
    arrive(ctx,1620,500,t,0.6,()=>{person(ctx,"jun",1620,780,0.48,{t,pose:"explain"});wo_role(ctx,1620,816,"jun");},{dy:20,from:0.95});
    arrive(ctx,790,104,t,w("green","green")-0.1,()=>tag(ctx,790,104,"everything green · one project",GOOD,{align:"center",size:24}),{dy:12});});
  const ch=[[w("registrar","learners"),w("registrar","awards"),w("registrar","credentials"),w("registrar","student IDs")],[w("learning","microcredentials"),w("learning","badges"),w("learning","keys"),w("learning","two platforms")],[w("consumers","their marts")],[w("consumers","their marts")+0.15,w("consumers","their marts")+0.3]];
  const t0=[w("registrar","registrar's")+0.25,w("learning","learning team")-0.1,w("consumers","Planning")-0.1,w("consumers","wallet")-0.1];
  wo_map(ctx,t,{m,t0,on:t0.map(x=>fin(t,x,0.3)),chips:ch,flags:fin(t,w("follows","name their domain")-0.2,1.0)});
  // a domain owns the meaning of the facts it records
  arrive(ctx,960,500,t,w("domain","domain")-0.1,()=>withA(ctx,1-fin(t,c("consumers")-0.2,0.5),()=>tag(ctx,960,500,"a domain owns the meaning of the facts it records",INK,{align:"center",size:24})),{dy:12});
  // the groups, each naming its owner; one line of the conventions; intermediate models carry no domain
  const gT=w("follows","groups")-0.1,gl=fin(t,w("follows","names an owner")-0.2,0.6),cT=w("follows","name their domain")-0.4;
  arrive(ctx,1450,330,t,gT,()=>wo_code(ctx,1030,110,830,"models/_groups.yml",["groups:","  - name: credential_model","    …","    owner:","      name: Noor, data architect","  - name: planning","    …","    owner:","      name: Planning","  - name: wallet","    …","    owner:","      name: Wallet app team"],{p:clamp((t-gT)/1.6,0,1),size:19,lh:28,edge:[150,190,255],lit:{3:gl,4:gl,7:gl,8:gl,11:gl,12:gl}}),{dy:24});
  arrive(ctx,1450,630,t,cT,()=>wo_code(ctx,1030,582,830,"docs/conventions.md",["- `meta.domain`: registrar, learning, planning or wallet."],{p:clamp((t-cT)/0.8,0,1),size:19,lh:28,edge:KIND,lit:{0:fin(t,cT+0.6,0.5)}}),{dy:24});
  arrive(ctx,310,800,t,w("follows","name their domain")+0.6,()=>{for(let d=0;d<8;d++)wo_dot(ctx,82+d*24,794,LAYER4[1][1],1,6);T(ctx,"intermediate: no domain, they belong to the group that builds them",290,801,{w:600,size:18,color:rgba(SOFT,1)});},{dy:12});
  arrive(ctx,1445,752,t,w("follows","Ownership follows")-0.1,()=>tag(ctx,1445,752,"ownership follows meaning, not the code",TRUST,{align:"center",size:24}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. What a domain publishes ---------- */
const WO_YML=["  - name: core_learner","    description: >","      What the model knows about a learner from valid_from until valid_to.","      {{ doc(\"learner\") }}","    latest_version: 1","    config:","      meta:","        grain: One row per learner per version","        owner: Mei Tanaka, registrar's office","        domain: registrar","        glossary_term: learner"];
scene("products",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cL=c("learner"),cB=c("build"),out=ease(fin(t,0,1.2));
  // the small map from the last chapter: the registrar's territory grows towards us and fades; the rest fade
  withA(ctx,1-out,()=>{ctx.save();const[x,y,w_,h]=WO_TER[0][4];ctx.translate(x+w_/2,y+h/2);ctx.scale(1+0.6*out,1+0.6*out);ctx.translate(-(x+w_/2),-(y+h/2));wo_terr(ctx,x,y,w_,h,WO_REG,"registrar's office",t,{});ctx.restore();
    WO_TER.slice(1).forEach(([dk,nm,,,C],i)=>wo_terr(ctx,C[0],C[1],C[2],C[3],WO_DOM[dk][1],nm,t,{seed:i+2,a:1-out}));
    wo_code(ctx,1030,110,830,"models/_groups.yml",["groups:"],{a:1-out,size:19,lh:28,edge:[150,190,255]});});
  arrive(ctx,960,96,t,Math.min(1.0,w("publish","A core model")-0.2),()=>tag(ctx,960,96,"a core model, as a product",TRUST,{align:"center",size:24}),{dy:12});
  // the YAML, lit line by line as each part is named
  const L=(s,k)=>fin(t,w(s,k)-0.15,0.4),lit={0:L("learner","Take the learner"),7:L("learner","grain"),8:L("owner","owner"),9:L("owner","domain"),10:L("owner","glossary"),4:L("promise","version"),1:L("promise","documentation"),3:L("promise","documentation")};
  const yo=1-fin(t,cB-0.3,0.7);
  arrive(ctx,510,340,t,cL-0.3,()=>wo_code(ctx,60,150,900,"models/core/_core__models.yml",WO_YML,{a:yo,p:clamp((t-cL+0.2)/1.4,0,1),size:18,lh:28,edge:TRUST,lit}),{dy:24});
  // the product card fills in
  const on=[L("learner","grain"),L("owner","owner"),L("owner","domain"),L("owner","glossary"),L("promise","contract"),L("promise","version"),L("promise","documentation")];
  if(t<=sc.dur)arrive(ctx,1435,405,t,Math.min(0.9,w("publish","product")-0.2),()=>wo_product(ctx,1010,150,850,t,{on,rh:58,latch:fin(t,w("promise","contract")+0.2,0.4),hi:pulseAt(t,w("build","Everyone"),1.6)}),{d:0.9,from:0.9});
  // who builds it, who owns what it means, and who builds on it
  const gA=w("build","Noor's group")-0.2;
  arrive(ctx,310,320,t,gA,()=>{wo_group(ctx,70,170,480,300,"credential_model","Noor, data architect",[178,156,255]);for(let i=0;i<7;i++)wo_dot(ctx,120+i*28,300,LAYER4[0][1],1,6);for(let i=0;i<8;i++)wo_dot(ctx,120+i*28,360,LAYER4[1][1],1,6);
    T(ctx,"staging",340,306,{w:600,size:18,color:rgba(SOFT,1)});T(ctx,"intermediate",360,366,{w:600,size:18,color:rgba(SOFT,1)});},{dy:20});
  arrowTo(ctx,560,320,1000,320,[178,156,255],fin(t,gA+0.3,0.5),{p:fin(t,gA+0.3,0.8),head:16});
  withA(ctx,fin(t,gA+0.8,0.5),()=>T(ctx,"builds it",780,300,{w:700,size:20,align:"center",color:rgba([178,156,255],1)}));
  arrive(ctx,310,640,t,gA,()=>{person(ctx,"noor",310,790,0.38,{t,pose:"explain"});wo_role(ctx,310,826,"noor");},{dy:20,from:0.95});
  const mA=w("build","Mei owns")-0.2;
  arrive(ctx,780,640,t,mA,()=>{person(ctx,"mei",780,790,0.38,{t});wo_role(ctx,780,826,"mei");},{dy:20,from:0.95});
  withA(ctx,fin(t,mA+0.3,0.6),()=>{ctx.save();ctx.setLineDash([6,8]);ctx.strokeStyle=rgba(BIZ,0.85);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(840,560);ctx.quadraticCurveTo(930,420,1000,336);ctx.stroke();ctx.restore();tag(ctx,610,520,"owns what it means",BIZ,{size:20});});
  const eA=w("build","Everyone")-0.1;
  [["Planning",WO_PLN,1230],["wallet app",WO_WAL,1640]].forEach(([n,col,x],i)=>{arrive(ctx,x,760,t,eA+i*0.2,()=>wo_team(ctx,x,736,0.72,col,t,{label:n,ly:136,size:22}),{dy:20});arrowTo(ctx,x,708,x,680,col,fin(t,eA+0.3+i*0.2,0.4),{p:fin(t,eA+0.3+i*0.2,0.5),head:14});});
  withA(ctx,fin(t,w("build","not on how")-0.1,0.5),()=>tag(ctx,960,96,"build on the product, not on how it's made",GOOD,{align:"center",size:24}));
  ctx.restore();if(t>sc.dur)wo_flyCard(ctx,t,t-sc.dur);vign(ctx,S);});

/* ---------- 4. Private, protected, public ---------- */
const WO_C=[620,510];   // the centre of the rings
function wo_flyCard(ctx,t,lt,a){const f=ease(fin(lt,0,1.3)),z0=1.03,x0=960+(1435-960)*z0,y0=540+(405-540)*z0,s=z0*Math.pow(0.22/z0,f);
  withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(lerp(x0,WO_C[0],f),lerp(y0,WO_C[1]-282,f));ctx.scale(s,s);ctx.translate(-1435,-405);wo_product(ctx,1010,150,850,t,{on:[1,1,1,1,1,1,1],rh:58,latch:1});ctx.restore();});}
const WO_PRJ=["    staging:","      +group: credential_model","      +access: private","    intermediate:","      +group: credential_model","      +access: private","    core:","      +group: credential_model","      +access: public","      …","    marts:","      +access: protected"];
const WO_ACC=["| Access | Who can `ref()` it |","|---|---|","| `private` | Models in the same group only. … |","| `protected` | Any model in the same project. … |","| `public` | Any model in any project, … The core is public. |"];
const WO_ERR=["Parsing Error","  Node model.credentials.mart_wallet__try_private","  attempted to reference node","  model.credentials.int_learners, which is not","  allowed because the referenced node is private","  to the 'credential_model' group."];
// where a line from (x0,y0) to (x1,y1) first crosses the private ring
function wo_hitPrivate(x0,y0,x1,y1){const[cx,cy]=WO_C,rx=WO_RING[2][3],ry=WO_RING[2][4];let lo=0,hi=1;for(let i=0;i<30;i++){const m=(lo+hi)/2,x=lerp(x0,x1,m),y=lerp(y0,y1,m);if(((x-cx)/rx)**2+((y-cy)/ry)**2<1)hi=m;else lo=m;}return lo;}
function wo_ringScene(ctx,t,o){const[cx,cy]=WO_C;wo_rings(ctx,cx,cy,t,{ring:o.ring,lit:o.lit,a:o.a});withA(ctx,o.a==null?1:o.a,()=>wo_ringNodes(ctx,cx,cy,t,{core:o.core,marts:o.marts,priv:o.priv}));}
scene("access",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,x:620});
  const[cx,cy]=WO_C,cPu=c("public"),cPr=c("protected"),cPv=c("private"),cRf=c("refused"),cAl=c("allowed"),cW=c("wrong");
  const ring=[fin(t,Math.min(0.7,w("rings","three rings")-0.2),1.6),fin(t,Math.min(1.0,w("rings","three rings")+0.1),1.6),fin(t,w("private","private")-0.2,1.2)];
  const lit=[fin(t,w("public","Public")-0.1,0.5)*(1-0.6*fin(t,cPr,0.5)),fin(t,w("protected","Protected")-0.1,0.5)*(1-0.6*fin(t,cPv,0.5)),fin(t,w("private","private")-0.1,0.5)*(1-0.6*fin(t,cRf,0.5))];
  wo_ringScene(ctx,t,{ring:[ring[0]*fin(t,w("public","Public")-0.3,0.4)+ring[0]*0.35*(1-fin(t,w("public","Public")-0.3,0.4)),ring[1]*fin(t,w("protected","Protected")-0.3,0.4)+ring[1]*0.35*(1-fin(t,w("protected","Protected")-0.3,0.4)),ring[2]],
    lit,core:fin(t,w("public","the core")-0.2,0.8),marts:fin(t,w("protected","the marts")-0.2,0.8),priv:fin(t,w("private","staging")-0.4,1.0)});
  withA(ctx,fin(t,w("public","the core"),0.5),()=>T(ctx,"core · 4 models, 5 versions",cx,cy-250,{w:700,size:18,align:"center",color:rgba(TRUST,1)}));
  withA(ctx,fin(t,w("protected","the marts"),0.5),()=>{withA(ctx,1-fin(t,w("wrong","changes")-0.3,0.4),()=>T(ctx,"Planning's mart",cx-150,cy-152,{w:700,size:18,align:"center",color:rgba(WO_PLN,1)}));T(ctx,"wallet's marts",cx+242,cy+102,{w:700,size:18,align:"center",color:rgba(WO_WAL,1)});});
  withA(ctx,fin(t,w("private","staging"),0.5),()=>{T(ctx,"staging",cx-90,cy-82,{w:600,size:18,align:"center",color:rgba(LAYER4[0][1],1)});T(ctx,"intermediate",cx+70,cy-82,{w:600,size:18,align:"center",color:rgba(LAYER4[1][1],1)});});
  arrive(ctx,1000,196,t,w("public","contracts")-0.1,()=>withA(ctx,1-fin(t,cPv,0.5),()=>tag(ctx,1000,196,"from the contracts",TRUST,{align:"center",size:20})),{dy:12});
  arrive(ctx,cx+106,cy+70,t,w("private","private")+0.2,()=>withA(ctx,1-fin(t,cRf,0.5),()=>tag(ctx,cx+76,cy+70,"new",[178,156,255],{size:18})),{dy:10});
  // the cards: access per folder, and the conventions' table; then dbt's own message
  const cardOut=1-fin(t,w("refused","refuses")-0.4,0.6),pl=(s,k)=>fin(t,w(s,k)-0.2,0.4);
  arrive(ctx,1520,300,t,w("rings","access")-0.2,()=>wo_code(ctx,1170,110,710,"dbt_project.yml",WO_PRJ,{a:cardOut,p:clamp((t-w("rings","access")+0.1)/1.6,0,1),size:19,lh:28,edge:[150,190,255],
    lit:{8:pl("public","Public"),11:pl("protected","Protected"),2:pl("private","private"),5:pl("private","private")}}),{dy:24});
  arrive(ctx,1520,640,t,cPu-0.2,()=>wo_code(ctx,1160,540,724,"docs/conventions.md",WO_ACC,{a:cardOut,p:clamp((t-cPu)/1.2,0,1),size:18,lh:27,edge:KIND,lit:{4:pl("public","Public"),3:pl("protected","Protected"),2:pl("private","private")}}),{dy:24});
  const eT=w("refused","refuses")-0.2;
  arrive(ctx,1525,230,t,eT,()=>wo_code(ctx,1170,110,710,"dbt parse",WO_ERR,{p:clamp((t-eT)/1.6,0,1),size:18,lh:27,edge:BAD,lineCol:{0:BAD}}),{dy:24});
  // the wallet's new model: refused at the private ring; let through to Planning's mart; redrawn to the core
  const P=(p)=>[cx+p[0],cy+p[1]],[tx,ty]=P(WO_RN.trial),[ix,iy]=P(WO_RN.int[3]),[px,py]=P(WO_RN.plan),[kx,ky]=P(WO_RN.core[4]);
  const tA=fin(t,w("refused","wallet team")-0.2,0.5);wo_dot(ctx,tx,ty,WO_WAL,tA,8);withA(ctx,tA*(1-fin(t,cW+0.5,0.5)),()=>T(ctx,"new model",tx-24,ty+20,{w:700,size:18,align:"right",color:rgba(WO_WAL,1)}));
  const hit=wo_hitPrivate(tx,ty,ix,iy),r1=fin(t,w("refused","tries")-0.1,0.8),bar=fin(t,w("refused","tries")+0.7,0.25);
  arrowTo(ctx,tx+2,ty+8,lerp(tx,ix,hit),lerp(ty,iy,hit),bar>0?BAD:WO_WAL,r1*(1-0.5*fin(t,cAl,0.6)),{p:r1,nohead:true,lw:3});
  wo_bar(ctx,lerp(tx,ix,hit),lerp(ty,iy,hit),Math.atan2(iy-ty,ix-tx),bar*(1-0.5*fin(t,cAl,0.6)),1.1);
  const r2=fin(t,w("allowed","Planning's mart")-0.2,0.9),snap=fin(t,w("wrong","changes")-0.2,0.5);
  if(snap<1)arrowTo(ctx,tx-4,ty-8,px+12,py-4,WO_AMB,r2*(1-snap),{p:r2,bend:0.15,head:14,lw:3});
  if(snap>0&&snap<1){const a=1-snap;withA(ctx,a,()=>{ctx.strokeStyle=rgba(WO_AMB,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px+60,py-30-20*snap);ctx.lineTo(px+90,py-40-30*snap);ctx.stroke();});}
  // Planning's mart changes when Planning needs it to
  withA(ctx,fin(t,w("wrong","changes")-0.3,0.5)*(1-fin(t,sc.dur-1.6,0.6)),()=>tag(ctx,px-10,py+32,"grain: as at census",WO_PLN,{align:"center",size:18}));
  const r3=fin(t,w("wrong","Consumers build")-0.3,1.0);arrowTo(ctx,tx+2,ty-10,kx+2,ky+12,GOOD,r3,{p:r3,bend:0.12,head:14,lw:3});
  // the tags on the right, and Noor, who reviews
  arrive(ctx,1525,440,t,w("allowed","allows")-0.1,()=>tag(ctx,1525,440,"allowed: same project, protected",WO_AMB,{align:"center",size:22}),{dy:12});
  arrive(ctx,1525,500,t,w("wrong","still wrong")-0.1,()=>tag(ctx,1525,500,"still wrong: shaped for Planning",EDGE_,{align:"center",size:22}),{dy:12});
  arrive(ctx,1640,620,t,w("wrong","Consumers build")-0.2,()=>{glass(ctx,1420,560,440,120,16,GOOD,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});wrapT(ctx,"Consumers build on the core, not on each other's marts.",1640,606,400,{w:700,size:24,align:"center",lh:34});},{dy:16});
  arrive(ctx,1270,780,t,w("wrong","shaped")-0.2,()=>{person(ctx,"noor",1270,790,0.36,{t,pose:"explain"});wo_role(ctx,1270,826,"noor",1,{role:"reviews the change"});},{dy:20,from:0.95});
  kt_gtick(ctx,1340,580,18,fin(t,w("wrong","Consumers build")+0.6,0.4));
  ctx.restore();
  // the product card from the last chapter, one card: it flies to the core and waits there while the rings draw, until the core's dots take its place
  wo_flyCard(ctx,t,t,1-fin(t,w("public","the core")-0.6,0.5));vign(ctx,S);});

/* ---------- 5. Who can read ---------- */
const WO_GR=["      planning:","        +group: planning","        …","        +grants: \"{{ {'select': var('planning_readers')}","          if target.type == 'databricks'","          and var('planning_readers', none)","          else {} }}\""];
const WO_M5=[["stg_student_system__learners",270,LAYER4[0][1],"private"],["core_learner",640,TRUST,"public"],["mart_planning__near_award",1000,WO_PLN,"protected"]];
function wo_pill(ctx,x,y,s,col,o){o=o||{};const w=tw(ctx,s,18,500,"mono")+36,h=50;glass(ctx,x-w/2,y-h/2,w,h,14,col,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,s,x,y+6,{f:"mono",w:500,size:18,align:"center",color:rgba(col,1)});return w;}
scene("grants",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cG=c("grants"),cD=c("dashboard"),cO=c("doors");
  // the rings fade into arrows between models
  const rf=1-fin(t,0,1.2);if(rf>0)withA(ctx,rf,()=>{ctx.save();ctx.translate(620,540);ctx.scale(1.025,1.025);ctx.translate(-620,-540);wo_ringScene(ctx,t,{ring:[1,1,1],lit:[0,0,0],core:1,marts:1,priv:1});ctx.restore();});   // drawn as the last chapter's camera left them
  arrive(ctx,100,150,t,0.4,()=>T(ctx,"access: who can refer",100,150,{w:800,size:26,color:rgba(INK,1)}),{dy:12});
  WO_M5.forEach(([n,x,col,acc],i)=>arrive(ctx,x,230,t,0.6+i*0.2,()=>{wo_pill(ctx,x,230,n,col);T(ctx,acc,x,286,{w:600,size:18,align:"center",color:rgba(mix(col,INK,0.3),1)});},{dy:16}));
  arrowTo(ctx,445,222,570,222,GOOD,fin(t,1.4,0.5),{p:fin(t,1.4,0.7),head:12});arrowTo(ctx,712,222,840,222,GOOD,fin(t,1.7,0.5),{p:fin(t,1.7,0.7),head:12});
  withA(ctx,fin(t,w("refer","refer to"),0.5),()=>T(ctx,"ref()",640,180,{f:"mono",w:500,size:18,align:"center",color:rgba(GOOD,1)}));
  // below: the tables, each with a door
  arrive(ctx,100,400,t,w("refer","who can read")-0.2,()=>T(ctx,"grants: who can read",100,400,{w:800,size:26,color:rgba(INK,1)}),{dy:12});
  const dOpen=fin(t,w("dashboard","if a grant")-0.1,0.7),mOpen=fin(t,w("grants","grant reading")-0.1,0.7)*(1-0.6*fin(t,cD,0.5));
  WO_M5.forEach(([n,x,col],i)=>arrive(ctx,x,520,t,w("refer","its table")-0.2+i*0.15,()=>wo_table(ctx,x-165,440,330,170,n,col,{open:i===0?dOpen:i===2?mOpen:0}),{dy:16}));
  arrive(ctx,1000,650,t,w("grants","the groups")-0.1,()=>withA(ctx,1-fin(t,cO,0.5),()=>tag(ctx,1000,650,"readers: the groups Planning names",WO_PLN,{align:"center",size:20})),{dy:12});
  // the grant in the project: Databricks only
  arrive(ctx,1530,260,t,cG-0.2,()=>wo_code(ctx,1180,120,700,"dbt_project.yml",WO_GR,{p:clamp((t-cG)/1.4,0,1),size:18,lh:28,edge:WO_PLN,lit:{3:fin(t,w("grants","grant reading")-0.2,0.4)}}),{dy:24});
  arrive(ctx,1530,452,t,w("grants","Databricks")-0.1,()=>withA(ctx,1-fin(t,cO-0.3,0.5),()=>tag(ctx,1530,452,"on Databricks; on DuckDB it's empty",[150,190,255],{align:"center",size:20})),{dy:12});
  // a dashboard reads a private staging table: the reference stays refused, the door opens
  arrive(ctx,240,760,t,cD-0.1,()=>wo_dash(ctx,120,690,240,150,WO_PLN,t,{title:"Planning's dashboard"}),{dy:20});
  const rr_=fin(t,w("dashboard","private staging")-0.2,0.8);arrowTo(ctx,1000,198,300,198,BAD,rr_*0.9,{p:rr_,bend:0.12,nohead:true,lw:2.6});
  {const u=0.86,mx=650,my=114,bx=(1-u)*(1-u)*1000+2*u*(1-u)*mx+u*u*300,by=(1-u)*(1-u)*198+2*u*(1-u)*my+u*u*198;wo_bar(ctx,bx,by,Math.atan2(198-my,300-mx),fin(t,w("dashboard","private staging")+0.5,0.3),0.9);}
  arrowTo(ctx,330,690,364,616,GOOD,dOpen,{p:dOpen,head:12,lw:3});
  arrive(ctx,560,720,t,w("dashboard","a grant")+0.2,()=>tag(ctx,560,720,"read with a grant",GOOD,{size:20}),{dy:12});
  arrive(ctx,560,780,t,w("dashboard","Access doesn't")-0.1,()=>tag(ctx,560,780,"access doesn't stop it",SOFT,{size:20}),{dy:12});
  // two doors, two rules
  arrive(ctx,1530,620,t,cO-0.1,()=>{glass(ctx,1180,500,700,250,18,[150,190,255],{glow:12,ea:0.7,fill:"rgba(7,12,24,0.95)"});
    arrowTo(ctx,1220,570,1310,570,BAD,1,{nohead:true,lw:3});wo_bar(ctx,1300,570,0,1,0.8);T(ctx,"refer: access, checked when dbt parses",1340,578,{w:700,size:22});
    ctx.strokeStyle=rgba(TRUST,0.9);ctx.lineWidth=2.4;ctx.strokeRect(1236,640,48,64);ctx.fillStyle="rgba(255,236,190,0.5)";ctx.fillRect(1236,640,48,64);ctx.fillStyle=rgba([60,70,90],1);ctx.fillRect(1236,640,16,64);
    T(ctx,"read: grants, on the platform",1340,680,{w:700,size:22});},{dy:20});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Across projects ---------- */
const WO_DEP=["…","projects:","  - name: credentials"];
const WO_SQL=["…","with","","learners as (","","    select * from {{ ref('credentials', 'core_learner', v=1) }}","","),","…"];
const WO_RDM=["- Only `public` models can be refed from another project.","  The credential project's marts are `protected`: this","  project can't ref them, so Planning builds on the core,","  never on the wallet's marts."];
// the credential project, small, with its rings
function wo_credProj(ctx,x,y,w,h,t,o){o=o||{};if(!o.noBox)wo_proj(ctx,x,y,w,h,"credentials",[150,190,255],{a:o.a});const s=o.s||0.62,cx=x+w/2,cy=y+h/2+30;
  withA(ctx,o.a==null?1:o.a,()=>{wo_rings(ctx,cx,cy,t,{s,ring:[1,1,1],lit:o.lit||[0.3,0,0],noLabels:true});wo_ringNodes(ctx,cx,cy,t,{s,core:1,marts:1,priv:1});
    // the rings' names, as a key below them, since at this size they don't fit between the rings
    if(!o.noLabels)wo_ringKey(ctx,x,y+h-68,w,1);});return[cx,cy,s];}
scene("across",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cDp=c("depends"),cP=c("pinned"),cO=c("only"),cS=c("sketch"),sl=ease(fin(t,0.2,1.6));
  // today: one project; it slides left to make room
  const bx=lerp(590,60,sl),[rcx,rcy,rs]=wo_credProj(ctx,bx,120,740,720,t,{a:fin(t,0,0.8),lit:[0.3+0.7*fin(t,w("only","Only public")-0.2,0.5),0,0]});
  withA(ctx,fin(t,0.3,0.5)*(1-fin(t,w("today","One day"),0.5)),()=>tag(ctx,960,72,"one project today",[150,190,255],{align:"center",size:22}));
  // one day: Planning's own project, a sketch
  const pd=fin(t,w("today","One day")-0.1,1.4);wo_proj(ctx,1080,120,790,720,"planning",WO_PLN,{a:fin(t,w("today","One day")-0.1,0.3),dash:true,p:pd});
  withA(ctx,fin(t,w("today","project of its own"),0.5),()=>{const lw=tw(ctx,WO_CLOUD,18,700)+28,lx=1846-lw;ctx.fillStyle="rgba(8,12,24,0.98)";rr(ctx,lx,103,lw,32,16);ctx.fill();ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=rgba(WO_AMB,0.9);ctx.lineWidth=1.6;rr(ctx,lx,103,lw,32,16);ctx.stroke();ctx.restore();
    glow(ctx,lx+lw/2,119,lw*0.6,WO_AMB,0.4*pulseAt(t,w("sketch","sketch"),1.6));T(ctx,WO_CLOUD,lx+14,126,{w:700,size:18,color:rgba(WO_AMB,1)});});
  const labHi=pulseAt(t,w("sketch","dbt Cloud"),1.8);
  arrive(ctx,1476,250,t,cDp-0.2,()=>wo_code(ctx,1102,170,746,"examples/planning/dependencies.yml",WO_DEP,{p:clamp((t-cDp)/0.9,0,1),size:18,lh:28,edge:WO_PLN,label:WO_CLOUD,labHi,lit:{2:fin(t,w("depends","credentials")-0.2,0.4)}}),{dy:20});
  const sqlOut=1-fin(t,w("only","Only public")-0.3,0.6);
  arrive(ctx,1476,530,t,cP-0.3,()=>wo_code(ctx,1102,350,746,"examples/planning/models/planning_enrolments_at_census.sql",WO_SQL,{a:sqlOut,p:clamp((t-cP+0.1)/1.4,0,1),size:18,lh:28,edge:WO_PLN,label:WO_CLOUD,labHi,lit:{5:fin(t,w("pinned","by project")-0.2,0.4)},glow:{5:pulseAt(t,w("pinned","version one"),1.4)}}),{dy:20});
  arrive(ctx,1476,450,t,w("only","Only public")-0.1,()=>wo_code(ctx,1102,350,746,"examples/planning/README.md",WO_RDM,{p:clamp((t-w("only","Only public"))/1.4,0,1),size:18,lh:28,edge:WO_PLN,label:WO_CLOUD,labHi}),{dy:20});
  // the bridge to the public core, pinned to version 1
  const[kx,ky]=[rcx+WO_RN.core[3][0]*rs,rcy+WO_RN.core[3][1]*rs],bp=fin(t,w("pinned","pinned")-0.3,1.2);
  wo_dot(ctx,1080,560,WO_PLN,fin(t,cP-0.2,0.5),9);
  if(bp>0){arrowTo(ctx,1072,556,kx+10,ky+4,TRUST,1,{p:bp,bend:0.16,head:14,lw:3});}
  arrive(ctx,940,380,t,w("pinned","version one")-0.2,()=>tag(ctx,940,380,"v1",TRUST,{align:"center",size:22}),{from:0.6});
  withA(ctx,fin(t,w("pinned","version one")+0.2,0.5),()=>T(ctx,"pinned",940,430,{w:700,size:20,align:"center",color:rgba(TRUST,1)}));
  // only public models cross: the other two references stop at the project's edge
  const[wx,wy]=[rcx+150*rs,rcy-178*rs],[ix,iy]=[rcx+WO_RN.int[2][0]*rs,rcy+WO_RN.int[2][1]*rs];
  [[wx,wy,"wallet's marts",0],[ix,iy,"any step inside",1]].forEach(([qx,qy,lab,i])=>{const t0=w("only",i?"any step":"wallet's marts")-0.3,q=fin(t,t0,0.8),stop=(1072-812)/(1072-qx),sx=lerp(1072,qx,stop),sy=lerp(570+i*30,qy,stop);
    arrowTo(ctx,1072,570+i*30,sx,sy,BAD,q*(1-0.4*fin(t,cS,0.6)),{p:q,nohead:true,lw:3});wo_bar(ctx,sx,sy,Math.atan2(qy-570,qx-1072),fin(t,t0+0.7,0.25)*(1-0.4*fin(t,cS,0.6)),0.9);});
  withA(ctx,fin(t,w("only","Only public")+0.2,0.5),()=>{T(ctx,"only public",940,720,{w:800,size:22,align:"center",color:rgba(TRUST,1)});T(ctx,"models cross",940,748,{w:800,size:22,align:"center",color:rgba(TRUST,1)});});
  withA(ctx,fin(t,w("only","meet on the core")-0.1,0.5),()=>{T(ctx,"the domains",940,250,{w:700,size:22,align:"center",color:rgba(INK,1)});T(ctx,"meet on the core",940,278,{w:700,size:22,align:"center",color:rgba(INK,1)});});
  arrive(ctx,1496,790,t,w("sketch","doesn't run")-0.1,()=>tag(ctx,1496,790,"needs dbt Cloud · doesn't run on DuckDB",WO_AMB,{align:"center",size:22}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. What stays shared ---------- */
const WO_KS=["key_sets:","  - code: SIS","    system: student system","    owner: Registrar's office","  - code: LMS","    system: learning platform","    owner: Learning team","  - code: SC","    system: short-course platform","    owner: Learning team"];
const WO_HK=["{#- The hash of one or more parts. … -#}","{% macro hash_key(columns) -%}","    {{ return(adapter.dispatch('hash_key', 'credentials')(columns)) }}","{%- endmacro %}","","{% macro duckdb__hash_key(columns) -%}","    sha256({{ credentials.key_string(columns) }})","{%- endmacro %}","","{% macro databricks__hash_key(columns) -%}","    sha2({{ credentials.key_string(columns) }}, 256)","{%- endmacro %}"];
const WO_RD2=["The point-in-time filter is written out here because macros","don't cross projects. Shared macros, such as the key and time","macros, would move to a package both projects install."];
const WO_SLABS=[["key sets","one per system, an owner each",WO_REG],["the hash macro","one for every hash",TRUST],["conventions","docs/conventions.md",KIND],["glossary","model/conceptual.yml",WEED]];
scene("shared",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cK=c("keysets"),cH=c("hash"),cA=c("another"),cP=c("package"),cS=c("silos"),up=ease(fin(t,0.1,1.5));
  // the two projects rise; their contents give way
  const crack=pulseAt(t,w("silos","silos")-0.2,1.6),cr=crack*14;
  const ly=lerp(120,110,up),lh=lerp(720,200,up);
  ctx.save();ctx.translate(-cr,0);wo_proj(ctx,60,ly,lerp(740,800,up),lh,"credentials",[150,190,255]);withA(ctx,1-up,()=>{ctx.save();ctx.beginPath();ctx.rect(60,ly,740,lh);ctx.clip();wo_credProj(ctx,60,120,740,720,t,{a:1,noBox:true});ctx.restore();});ctx.restore();
  ctx.save();ctx.translate(cr,0);wo_proj(ctx,lerp(1080,1060,up),ly,lerp(790,800,up),lh,"planning",WO_PLN,{dash:true});ctx.restore();
  withA(ctx,fin(t,0.2,0.4)*(1-fin(t,cS+1.4,0.6)),()=>tag(ctx,960,72,"split into domains",INK,{align:"center",size:22}));
  // Aisha's key, hashed in each project
  const hA=fin(t,w("hash","Aisha")-0.2,0.5),lower=fin(t,w("another","lower case")-0.2,0.6),run=clamp((t-w("hash","Aisha"))/1.2,0,1);
  [[90,0],[1090,1]].forEach(([x,i])=>withA(ctx,hA,()=>{ctx.save();ctx.translate(i?cr:-cr,0);const lo=i&&lower>0,key=lo?"sis|s-20417":"SIS|S-20417",hsh=lo?"8c73518c…447e":"0905e6e2…f76a2";
    T(ctx,key,x,192,{f:"mono",w:500,size:22,color:rgba(lo?EDGE_:WO_REG,1)});T(ctx,"→",x+180,192,{w:700,size:22,color:rgba(SOFT,1)});T(ctx,typeOn(hsh,run),x+220,192,{f:"mono",w:500,size:22,color:rgba(lo?EDGE_:TRUST,1)});
    withA(ctx,fin(t,w("hash","sixty-four")-0.1,0.5)*(1-lower),()=>T(ctx,"64 characters",x+560,192,{w:600,size:18,color:rgba(SOFT,1)}));
    if(i)withA(ctx,fin(t,w("another","second key")-0.1,0.5),()=>T(ctx,"a second key",x+560,192,{w:700,size:20,color:rgba(EDGE_,1)}));
    withA(ctx,fin(t,w("another","no test")-0.3,0.4),()=>{["unique","not_null","relationships"].forEach((s,j)=>{const tx=x+j*190;T(ctx,s,tx,262,{f:"mono",w:500,size:18,color:rgba(GOOD,1)});tick_(ctx,tx+tw(ctx,s,18,500,"mono")+20,256,18,GOOD,1);});});
    ctx.restore();}));
  withA(ctx,fin(t,w("hash","same sixty")-0.2,0.5)*(1-lower),()=>{T(ctx,"the same",960,232,{w:700,size:20,align:"center",color:rgba(GOOD,1)});T(ctx,"in every project",960,258,{w:700,size:20,align:"center",color:rgba(GOOD,1)});});
  // the join line between her two rows, and where it breaks
  const jl=fin(t,w("hash","every project")-0.3,0.6);if(jl>0){const br=fin(t,w("another","Joins")-0.2,0.3);withA(ctx,jl,()=>{ctx.strokeStyle=rgba(br>0?BAD:GOOD,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(lerp(820,940,br)-cr,186);ctx.lineTo(820-cr,186);ctx.moveTo(1040+cr,186);ctx.lineTo(lerp(1040,1080,1)+cr,186);ctx.stroke();
    if(br<1){ctx.beginPath();ctx.moveTo(820,186);ctx.lineTo(lerp(1040,960,br),186);ctx.stroke();}});
    withA(ctx,br,()=>{T(ctx,"joins find",960,232,{w:700,size:20,align:"center",color:rgba(BAD,1)});T(ctx,"nothing",960,258,{w:700,size:20,align:"center",color:rgba(BAD,1)});});}
  withA(ctx,fin(t,w("another","no test")+0.1,0.5),()=>tag(ctx,300,336,"no test fails",GOOD,{align:"center",size:20}));
  // the middle: the key sets, then the one hash macro, then the README's word on packages
  const ksA=1-fin(t,cH-0.3,0.5),hkA=1-fin(t,cP-0.3,0.5);
  arrive(ctx,960,500,t,cK-0.2,()=>wo_code(ctx,600,330,720,"model/conceptual.yml",WO_KS,{a:ksA,p:clamp((t-cK)/1.4,0,1),size:18,lh:27,edge:WO_REG,lineCol:{1:WO_REG,4:WO_LRN,7:WO_SC}}),{dy:20});
  arrive(ctx,960,510,t,cH-0.2,()=>wo_code(ctx,540,322,840,"macros/keys.sql",WO_HK,{a:hkA,p:clamp((t-cH)/1.6,0,1),size:18,lh:26,edge:TRUST,lit:{6:fin(t,w("hash","Aisha")-0.2,0.4),10:fin(t,w("hash","Aisha")-0.2,0.4)}}),{dy:20});
  const rT=w("package","Macros don't")-0.2;
  arrive(ctx,960,400,t,rT,()=>wo_code(ctx,570,320,780,"examples/planning/README.md",WO_RD2,{p:clamp((t-rT)/1.4,0,1),size:18,lh:28,edge:WO_PLN,label:WO_CLOUD}),{dy:20});
  // the package both projects install
  const pk=ease(fin(t,w("package","a package")-0.2,1.0));if(pk>0){const px=lerp(-900,360,pk);withA(ctx,fin(pk,0,0.3),()=>{glass(ctx,px,540,1200,96,18,TRUST,{glow:16,ea:0.85,fill:"rgba(12,12,18,0.96)"});
    T(ctx,"package",px+30,596,{w:800,size:24,color:rgba(TRUST,1)});T(ctx,"the key and time macros, installed by both projects",px+170,596,{w:600,size:22,color:rgba(INK,1)});});
    withA(ctx,fin(pk,0.8,0.2),()=>{arrowTo(ctx,560,540,460,322,TRUST,0.7,{head:12,dash:[6,6]});arrowTo(ctx,1360,540,1460,322,TRUST,0.7,{head:12,dash:[6,6]});});}
  // the ground both projects stand on: a faint outline first, then a slab as each is named
  withA(ctx,fin(t,w("still","shared")-0.2,0.8),()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(SOFT,0.35);ctx.lineWidth=2;rr(ctx,52,716,1816,124,14);ctx.stroke();ctx.restore();});
  WO_SLABS.forEach(([n,sub,col],i)=>{const t0=[w("keysets","key sets"),w("hash","One macro"),w("package","conventions"),w("package","glossary")][i],gl=i===3?w("package","glossary"):t0,x=60+i*450,sx=(i<2?-1:1)*cr;
    arrive(ctx,x+216+sx,770,t,i===3?gl-0.1:t0-0.1,()=>wo_slab(ctx,x+sx,724,432,108,n,sub,col,{hi:pulseAt(t,t0,1.4)+(i===3?pulseAt(t,gl,1.4):0)}),{dy:24,from:0.95});});
  if(crack>0)withA(ctx,crack,()=>{ctx.strokeStyle=rgba(BAD,0.9);ctx.lineWidth=2.4;ctx.beginPath();[[960,700],[952,730],[968,760],[950,790],[966,820],[958,840]].forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();});
  arrive(ctx,960,684,t,w("silos","silos")-0.3,()=>tag(ctx,960,684,"without shared keys, domains become silos",BAD,{align:"center",size:22}),{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Groups first ---------- */
const WO_DEC=["| 12 Oct 2026 | One group owns staging, intermediate and core while","one team builds them; Planning and the wallet each own their marts.","Split into projects when teams own their domains. | Groups control","who can `ref()` what within a project. Separate projects add cost","that pays off only with separate teams. | Noor, data architect |"];
scene("split",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();ctx.globalAlpha*=1-0.9*fin(t,B,0.8);drift(ctx,t,sc,{z:0.03,y:500});
  const cD=c("decided"),cH=c("hands"),j=ease(fin(t,0.2,1.6));
  // the sketch folds back into the one project, which grows to hold three groups
  wo_proj(ctx,60,lerp(110,110,j),lerp(800,840,j),lerp(200,450,j),"credentials · one project",[150,190,255]);
  withA(ctx,1-j,()=>wo_proj(ctx,lerp(1060,500,j),110,lerp(800,360,j),200,"planning",WO_PLN,{dash:true}));
  const gq=fin(t,w("decided","groups first")-0.4,0.6);
  withA(ctx,fin(t,0.6,0.8)*(1-gq),()=>wo_mini(ctx,140,210,680,lerp(60,280,j),t,{green:1}));
  arrive(ctx,280,350,t,w("decided","groups first")-0.2,()=>{wo_group(ctx,90,170,380,360,"credential_model","Noor, data architect",[178,156,255]);for(let i=0;i<7;i++)wo_dot(ctx,120+i*24,300,LAYER4[0][1],1,6);for(let i=0;i<8;i++)wo_dot(ctx,120+i*24,360,LAYER4[1][1],1,6);for(let i=0;i<5;i++)wo_dot(ctx,120+i*30,420,TRUST,1,7);},{dy:16});
  arrive(ctx,685,255,t,w("decided","groups first"),()=>{wo_group(ctx,500,170,370,170,"planning","Planning",WO_PLN);wo_dot(ctx,530,300,LAYER4[3][1],1,7);},{dy:16});
  arrive(ctx,685,445,t,w("decided","groups first")+0.2,()=>{wo_group(ctx,500,360,370,170,"wallet","Wallet app team",WO_WAL);wo_dot(ctx,530,490,LAYER4[3][1],1,7);wo_dot(ctx,560,490,LAYER4[3][1],1,7);},{dy:16});
  // why not split now: two costs
  const why=1-fin(t,cD-0.3,0.5);
  arrive(ctx,1400,190,t,0.4,()=>withA(ctx,why,()=>T(ctx,"why not split now?",1400,190,{w:800,size:34,align:"center"})),{dy:12});
  arrive(ctx,1400,270,t,w("why","more to deploy")-0.1,()=>withA(ctx,why,()=>tag(ctx,1400,270,"every project: more to deploy",EDGE_,{align:"center",size:22})),{dy:12});
  arrive(ctx,1400,330,t,w("why","keep in step")-0.1,()=>withA(ctx,why,()=>tag(ctx,1400,330,"and more to keep in step",EDGE_,{align:"center",size:22})),{dy:12});
  // the decision, and Noor's gold tick
  arrive(ctx,1410,215,t,cD-0.2,()=>wo_code(ctx,960,110,900,"docs/decisions.md",WO_DEC,{p:clamp((t-cD)/2.0,0,1),size:18,lh:28,edge:TRUST}),{dy:20});
  kt_gtick(ctx,1826,292,20,fin(t,w("decided","Noor decided")+0.1,0.35));
  arrive(ctx,1410,380,t,w("decided","groups first")-0.1,()=>tag(ctx,1410,380,"groups first, in one project",GOOD,{align:"center",size:22}),{dy:12});
  arrive(ctx,1410,436,t,w("decided","Projects later")-0.1,()=>tag(ctx,1410,436,"projects later, when teams own their domains",[150,190,255],{align:"center",size:22}),{dy:12});
  // the ten steps, small: this film's are 4 and 10
  arrive(ctx,1440,650,t,w("decided","Projects later")+0.6,()=>wo_loop(ctx,1440,650,190,110,{3:1,9:1},t,{label:"steps 4 and 10"}),{d:1.0,from:0.9});
  // many owners, many hands
  const own=[["mei",130],["tom",290],["Planning",450,WO_PLN],["wallet app",610,WO_WAL],["noor",770],["jun",930]];
  own.forEach(([id,x,col],i)=>arrive(ctx,x,740,t,w("hands","Many owners")-0.2+i*0.15,()=>{if(col){wo_team(ctx,x,724,0.62,col,t,{label:id,ly:200,size:22});}
    else{person(ctx,id,x,820,0.29,{t});T(ctx,PEOPLE[id].name.split(" ")[0],x,850,{w:800,size:22,align:"center"});}},{dy:20,from:0.95}));
  withA(ctx,fin(t,w("hands","Many owners"),0.5),()=>{ctx.strokeStyle=rgba(TRUST,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(60,828);ctx.lineTo(1010,828);ctx.stroke();});
  // and one of them isn't a person
  const orb=ease(fin(t,w("hands","isn't a person")-0.4,1.6));kt_agent(ctx,lerp(2010,1790,orb),740+Math.sin(t*0.9)*8,30,t,{a:fin(t,w("hands","isn't a person")-0.4,0.6)});
  ctx.restore();weedsEnd(ctx,S,t,B,"Who owns what",WEED,"Owners publish. Consumers build on what's published.");
  vign(ctx,S);});
