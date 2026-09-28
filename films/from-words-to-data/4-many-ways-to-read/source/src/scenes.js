/* ===== Many ways to read: scenes =====
   Eight chapters, as in ../script.md. A library files one book on three cards; four engineers argue about four shapes for reading,
   while credentials from a new source, the short-course platform, wait to be added. The film follows the credentials through
   each job: integrate (a normalised core, or a data vault), present (conformed stars) and serve (one wide row per learner),
   places each shape on the platform, and ends on choosing per question, not per fashion. */
const MW_OLD="657 HAL",MW_NEW="657.2 HAL",MW_ONE=[255,214,150];

/* ---------- 1. One book, three cards ---------- */
const MW_CARDY=[170,400,630];
scene("cards",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath"),cC=c("catalogue"),cS=c("same"),cK=c("step"),cT=c("today");
  const now=fin(t,cT-0.1,1.1);setScreen(ctx,S);
  if(now<1){histBg(ctx,S,t);
    yearTag(ctx,120,120,"1900s · the card catalogue",CLAY,fin(t,0.3,0.6));
    mw_libLight(ctx,t,1);const at=mw_cabinet(ctx,110,240,480,560,{a:fin(t,0.4,0.8),open:9,p:fin(t,cC+2.6,0.9),t})||{x:350,dy:500};
    // the bookcase: the book stands on the upper shelf, then moves to the lower one
    const bA=fin(t,cC+3.4,0.8),top=mw_shelf(ctx,1200,440,600,"650–657",{a:bA,gaps:[6],seed:3,t}),bot=mw_shelf(ctx,1200,760,600,"657.1–659",{a:bA,gaps:[9],seed:7,t});
    const oldX=top[6],newX=bot[9],mv=ease(fin(t,cK+0.3,1.3)),bx=lerp(oldX,newX,mv),by=lerp(440,760,mv)-Math.sin(mv*Math.PI)*70;
    const oldLab=[oldX,440-242],newLab=[newX,760-242],relab=t>cK+1.4;
    // the old place, empty and marked, once a reader is sent there
    const wrong=fin(t,cK+2.4,0.5);
    if(wrong>0){glow(ctx,oldX,340,120,BAD,0.35*wrong);withA(ctx,wrong,()=>{ctx.strokeStyle=rgba(BAD,0.95);ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.strokeRect(oldX-30,250,60,188);ctx.setLineDash([]);});
      cross_(ctx,oldX,344,44,BAD,wrong);withA(ctx,fin(t,cK+3.1,0.5),()=>tag(ctx,oldX,212,"wrong shelf",BAD,{align:"center",size:20}));}
    mw_book(ctx,bx,by,{a:bA,mark:relab?MW_NEW:MW_OLD,hi:pulseAt(t,cS+0.1,1.6)+0.6*pulseAt(t,cK+1.4,1.2),flash:relab&&t<cK+2.6,labA:1-0.8*(fin(t,cK+0.3,0.2)-fin(t,cK+1.3,0.3))});
    // three cards, out of the open drawer, one after another
    const kinds=["author","title","subject"],tIn=[cC+5.2,cC+6.0,cC+6.8],reT=[cK+1.6,cK+2.0,1e9];
    kinds.forEach((k,i)=>{const e=ease(fin(t,tIn[i],1.0)),ty=MW_CARDY[i];if(e<=0)return;
      const x=lerp(at.x-40,700,e),y=lerp(at.dy-10,ty,e),w=lerp(80,340,e),fl=clamp((t-reT[i])/0.5,0,1),mark=fl>0.5?MW_NEW:MW_OLD;
      // an arrow from the card's shelf mark to where it sends the reader
      const pa=clamp((t-cS-1.2-i*0.3)/0.6,0,1),to=mark===MW_NEW?newLab:(mv>0.5?[oldX+26,330]:oldLab),bad=k==="subject"?wrong:0,col=bad>0.5?BAD:(fl>=1&&k!=="subject"?GOOD:PARCH);
      if(pa>0&&e>=1)arrowTo(ctx,1050,ty+30,to[0]-60,to[1]+(to===newLab||to===oldLab?(i-1)*8:0),col,0.75+0.25*bad,{p:pa,bend:-0.06+i*0.03,head:12,lw:2.2});
      mw_card(ctx,x,y,w,Object.assign({},MW_CARDS[k],{mark,t,a:Math.min(1,e*2),rot:(1-e)*0.25,flip:fl>0&&fl<1?fl:0,ok:k!=="subject"?fin(t,reT[i]+0.45,0.3):0,bad,glow:pulseAt(t,cS+1.2+i*0.3,1.2)}));});
    withA(ctx,fin(t,cS+1.6,0.5)*(1-fin(t,cK+0.2,0.4)),()=>tag(ctx,1500,110,"one book, three ways in",MW_ONE,{align:"center",size:22}));
    withA(ctx,fin(t,cK+3.4,0.5),()=>tag(ctx,1500,110,"every card, kept in step",PARCH,{align:"center",size:22}));}
  // today: copies of the same facts, each arranged for a question
  if(now>0)withA(ctx,now,()=>{bg2(ctx);
    withA(ctx,fin(t,cT+0.4,0.6),()=>{glass(ctx,130,350,440,270,20,TRUST,{glow:18,ea:0.8,fill:"rgba(7,12,24,0.93)"});T(ctx,"credential awards",162,400,{w:800,size:30,color:rgba(TRUST,1)});T(ctx,"the facts, recorded once",162,434,{w:600,size:21,color:rgba(SOFT,1)});
      for(let r=0;r<5;r++)for(let k=0;k<4;k++){ctx.fillStyle=rgba(TRUST,0.25+0.45*hash(r*7+k,3)*(0.8+0.2*Math.sin(t*1.5+r+k)));rr(ctx,162+k*96,460+r*28,82,15,4);ctx.fill();}});
    const Q=[["by learner",["learner","credential"],[["Aisha K.","BSc, 2022"],["Aisha K.","SQL, 2026"]],"What has Aisha earned?"],
      ["by year",["year","awarded"],[["2025","11,204"],["2026","11,890"]],"How many this year?"],
      ["by course",["course","awards"],[["Data Science","412"],["Nursing","388"]],"Which courses award most?"]];
    Q.forEach(([nm,cols,rows,q],i)=>{const y=[150,386,622][i],a=fin(t,cT+2.0+i*0.3,0.5);if(a<=0)return;
      arrowTo(ctx,580,485,770,y+104,MW_C,0.7*a,{p:clamp((t-cT-1.9-i*0.3)/0.5,0,1),bend:0.02*(i-1),head:12});
      withA(ctx,a,()=>{ctx.save();ctx.translate(780,y);ctx.scale(1.25,1.25);table(ctx,0,0,nm,cols,rows,{col:MW_C,cw:[190,170]});ctx.restore();});
      withA(ctx,fin(t,cT+3.3+i*0.3,0.5),()=>tag(ctx,1284,y+104,q,INK,{size:26}));});
    withA(ctx,fin(t,cT+2.4,0.6),()=>tag(ctx,780,96,"copies, arranged for the questions people ask",MW_C,{size:24}));});
  seriesTitle(ctx,S,t,B,"Many ways to read","a shape for each job",MW_V);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. The argument ---------- */
const MW_ARG=[["ben","core","Inmon","integrate"],["rosa","vault","Linstedt","integrate"],["sam","star","Kimball","present"],["noor","wide","one big table","serve"]];
scene("argue",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),cF=c("four"),cN=c("names"),cW=c("new"),cJ=c("job");setScreen(ctx,S);bg2(ctx);
  withA(ctx,fin(t,cF+0.5,0.6)*(1-fin(t,cW-0.2,0.5)),()=>tag(ctx,960,96,"How should we shape data for reading?",INK,{align:"center",size:28}));
  const gT=[cF+5.1,cF+6.3,cF+7.2,cF+8.0],nT=[cN+1.5,cN+3.9,cN+2.9,cN+5.3],job=fin(t,cJ+1.5,0.5),nameOut=fin(t,cJ+0.9,0.5);
  MW_ARG.forEach(([pid,k,nm,jb],i)=>{const x=300+i*440,sh=MW_SHAPES[k],ga=fin(t,gT[i],0.6),hi=Math.max(pulseAt(t,gT[i],1.4),0.8*pulseAt(t,nT[i],1.3),0.7*pulseAt(t,cJ+1.2+i*0.15,1.4));
    mw_panel(ctx,x-190,160,380,272,sh[1],{a:Math.max(ga,0.35*fin(t,cF+1.0+i*0.2,0.6)),hi});
    withA(ctx,ga,()=>{sh[2](ctx,x,280,1.1,{p:clamp((t-gT[i])/1.2,0,1)});T(ctx,sh[0],x,412,{w:800,size:25,align:"center",color:rgba(sh[1],1)});});
    withA(ctx,fin(t,nT[i],0.5)*(1-nameOut),()=>tag(ctx,x,474,nm,sh[1],{align:"center",size:23}));
    withA(ctx,job,()=>tag(ctx,x,474,"best to "+jb,sh[1],{align:"center",size:23}));
    const talk=(t>gT[i]-0.2&&t<gT[i]+1.4)||(t>nT[i]-0.2&&t<nT[i]+1.3)||(t>cN+6.4&&t<cW+0.6&&Math.floor((t-cN)*0.9+i)%4===0);
    withA(ctx,fin(t,cF+0.3+i*0.25,0.6),()=>person(ctx,pid,x,878,0.6,{t,pose:talk?"explain":"stand",expr:t>cJ+1.3?"relieved":(t>cW+1.5&&t<cJ?"concerned":"calm")}));});
  // the sources: two known, and a new one arriving
  [["sis",280],["lms",790]].forEach(([k,x],i)=>mw_source(ctx,x,52,k,{a:fin(t,cW+0.1+i*0.2,0.5)*0.85,w:340,h:76,sub:"credentials"}));
  const nx=lerp(1960,1300,ease(fin(t,cW+1.0,1.2)));mw_source(ctx,nx,52,"short",{a:fin(t,cW+0.9,0.4),w:340,h:76,sub:"microcredentials",isNew:t>cW+2.2,hi:pulseAt(t,cW+2.6,1.6)});
  MW_ARG.forEach((r,i)=>mw_line(ctx,1470,132,300+i*440,160,MW_SC,0.55*fin(t,cW+3.0,0.5)*(1-0.6*job),{p:clamp((t-cW-3.0-i*0.15)/0.6,0,1),dash:[6,8],lw:1.8,blur:0}));
  vign(ctx,S);});

/* ---------- 3. Integrate first ---------- */
const MW_SRCY={sis:200,lms:300,fin:400,short:520};
const MW_CORE={Learner:[720,280],Enrolment:[1060,280],Course:[1400,280],Faculty:[1730,280],Fee:[720,540],Award:[1060,540],Credential:[1400,540],Unit:[1730,540]};
const MW_CORER=[["Learner","Enrolment","1","*"],["Enrolment","Course","*","1"],["Course","Faculty","*","1"],["Learner","Fee","1","*"],["Learner","Award","1","*"],["Award","Credential","*","1"],["Course","Credential","1","*"],["Course","Unit","1","*"]];
// the vault is drawn in its own units, then scaled up about its centre: mw_V maps a point of the vault to the screen
const MW_VX={lh:[760,280],ln:[1150,280],ch:[1540,280]},MW_SATX={l:610,n:1000,c:1390},MW_SATY=[392,468,544],MW_VK=1.2;
const mw_V=(x,y)=>[(x-1150)*MW_VK+1150,(y-280)*MW_VK+318];
scene("integrate",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),cM=c("many"),cC=c("core"),cV=c("vault"),cS=c("sat"),cN=c("new"),cA=c("audit");setScreen(ctx,S);bg2(ctx);
  const coreA=fin(t,cC+0.4,0.8)*(1-fin(t,cV+0.1,0.8)),vA=fin(t,cV+0.6,0.6),ringA=fin(t,cM+2.1,0.6)*(1-fin(t,cC+0.2,0.7)),srcOut=fin(t,cA+1.7,0.6),ana=fin(t,cA+1.9,0.7);
  // the sources, on the left, each in its colour
  ["sis","lms","fin"].forEach((k,i)=>{const y=MW_SRCY[k],a=fin(t,0.3+i*0.25,0.5)*(1-srcOut);mw_source(ctx,50,y,k,{a,w:350,h:76});
    const tx=ringA>0.5?[890,440]:vA>0.5?mw_V(620,262+i*18):[610,280+i*130],la=a*(0.35+0.4*fin(t,cM+1.2,0.4)-0.25*vA);
    mw_line(ctx,405,y+38,tx[0],tx[1],MW_SRC[k][1],la,{p:clamp((t-cM-1.1-i*0.2)/0.7,0,1),dash:[6,7],lw:1.8,blur:0});
    if(la>0.2)for(let n=0;n<2;n++){const u=((t*0.4+n*0.5+i*0.3)%1);mw_dot(ctx,405,y+38,tx[0],tx[1],u,MW_SRC[k][1],la*Math.sin(u*Math.PI),4);}});
  // many sources, one meaning
  if(ringA>0){withA(ctx,ringA,()=>{fuzzyRing(ctx,1050,440,160,KIND,0.8,44);ring(ctx,1050,440,160,KIND,0.9,2.6);T(ctx,"one meaning",1050,430,{w:800,size:36,align:"center",color:rgba(KIND,1)});T(ctx,"learner · credential · fee",1050,470,{w:600,size:22,align:"center",color:rgba(SOFT,1)});});}
  // a normalised core, for the whole university
  if(coreA>0){const E={};Object.keys(MW_CORE).forEach((k,i)=>{E[k]={x:MW_CORE[k][0],y:MW_CORE[k][1],name:k,s:1,col:MW_C,a:coreA*fin(t,cC+0.6+i*0.2,0.5)};});
    diagram(ctx,E,MW_CORER.map(r=>r.concat([{col:MW_C}])));
    withA(ctx,coreA*fin(t,cC+1.0,0.5),()=>tag(ctx,1225,690,"normalised core",MW_C,{align:"center",size:26}));
    withA(ctx,coreA*fin(t,cC+2.4,0.5),()=>T(ctx,"built to write · for the whole university",1225,752,{w:600,size:24,align:"center",color:rgba(SOFT,1)}));}
  // a data vault: hubs, then a link, then satellites
  const nv=fin(t,cN+2.4,0.5),okA=k=>nv*fin(t,cN+2.4+k*0.12,0.3);
  if(vA>0){withA(ctx,vA,()=>{
    tag(ctx,1150,166,"data vault",MW_V,{align:"center",size:26});
    ctx.save();ctx.translate(1150,318);ctx.scale(MW_VK,MW_VK);ctx.translate(-1150,-280);
    const hA=fin(t,cV+1.8,0.5),cHA=fin(t,cV+2.2,0.5),lA=fin(t,cV+6.6,0.5),keyHi=pulseAt(t,cV+2.5,1.4);
    const L=MW_VX.lh,N=MW_VX.ln,C=MW_VX.ch;
    if(lA>0){mw_line(ctx,L[0]+140,L[1],N[0]-125,N[1],MW_V,lA,{p:clamp((t-cV-6.6)/0.6,0,1),lw:2.6});mw_line(ctx,C[0]-140,C[1],N[0]+125,N[1],MW_V,lA,{p:clamp((t-cV-6.6)/0.6,0,1),lw:2.6});}
    mw_hub(ctx,L[0],L[1],"Learner","learner_id  L-20417",{a:hA,hi:keyHi+pulseAt(t,cV+4.8,1.3),ok:okA(0)});
    mw_hub(ctx,C[0],C[1],"Credential","code  GC-DS",{a:cHA,hi:keyHi+pulseAt(t,cV+5.5,1.3),ok:okA(1)});
    mw_link(ctx,N[0],N[1],"Learner–Credential",{a:lA,hi:pulseAt(t,cV+7.3,1.4),ok:okA(2)});
    // satellites stack up: descriptions, one version per change, each with its source and load time
    const srcHi=fin(t,cS+3.6,0.5)*(1-fin(t,cN,0.5)),sats=[
      [MW_SATX.l,MW_SATY[0],"email: a.khan@uni.edu","sis","2024-02-10 02:14",cS+0.1],
      [MW_SATX.c,MW_SATY[0],"Grad Cert · 60 credits","sis","2023-11-02 02:03",cS+0.5],
      [MW_SATX.n,MW_SATY[0],"status: awarded","sis","2026-06-30 02:05",cS+0.9],
      [MW_SATX.l,MW_SATY[1],"email: aisha@mail.com","sis","2025-07-01 02:11",cS+2.1]];
    sats.forEach(([x,y,at_,src,tm,t0],i)=>{const a=fin(t,t0,0.5);if(a<=0)return;const drop=(1-ease(fin(t,t0,0.6)))*-40;
      if(y===MW_SATY[0])mw_line(ctx,x+150,y-56,x+150,y+drop,MW_V,0.55*a,{lw:1.6,blur:0});
      mw_sat(ctx,x,y+drop,300,at_,src,tm,{a,hi:pulseAt(t,t0,1.2)+(i===3?pulseAt(t,cA+0.3,1.2):0),srcHi:Math.max(srcHi,i===3?fin(t,cA+1.4,0.4)*(1-fin(t,cA+2.6,0.5)):0),ok:okA(3+i)});});
    // the new source: new satellites, and nothing else changes
    mw_sat(ctx,MW_SATX.l,MW_SATY[2],300,"customer no: SC-8841","short","2026-09-21 02:00",{a:fin(t,cN+1.0,0.5),hi:pulseAt(t,cN+1.0,1.4),edge:MW_SC});
    mw_sat(ctx,MW_SATX.c,MW_SATY[1],300,"microcredential: SQL","short","2026-09-21 02:00",{a:fin(t,cN+1.35,0.5),hi:pulseAt(t,cN+1.35,1.4),edge:MW_SC});
    ctx.restore();
    withA(ctx,fin(t,cS+4.2,0.5)*(1-fin(t,cN,0.5)),()=>tag(ctx,1150,790,"each change: its source, and when it arrived",TRUST,{align:"center",size:24}));
    withA(ctx,nv*(1-fin(t,cA+0.2,0.5)),()=>tag(ctx,1150,790,"new satellites · nothing that exists changes",GOOD,{align:"center",size:24}));});}
  // the new source, arriving
  const ns=fin(t,cN+0.1,0.5)*(1-srcOut);if(ns>0){mw_source(ctx,lerp(-360,50,ease(fin(t,cN,0.8))),MW_SRCY.short,"short",{a:ns,w:350,h:76,isNew:true,hi:pulseAt(t,cN+0.6,1.4)});
    const p=clamp((t-cN-0.6)/0.6,0,1),y0=MW_SRCY.short+38,A_=mw_V(MW_SATX.l,MW_SATY[2]+33),C_=mw_V(MW_SATX.c,MW_SATY[1]+40);
    mw_line(ctx,405,y0,A_[0],A_[1],MW_SC,0.8*ns,{p,dash:[6,7],lw:2,blur:0});arrowTo(ctx,405,y0,C_[0],C_[1],MW_SC,0.5*ns,{p,bend:0.34,dash:[6,7],lw:1.8,head:10});}
  // audit: one value, its source and its time
  const au=fin(t,cA+1.4,0.4)*(1-fin(t,cA+2.6,0.5));if(au>0){const q=mw_V(MW_SATX.l+150,MW_SATY[1]+48);ring(ctx,q[0],q[1],94,TRUST,0.9*au,2.5,[6,6]);withA(ctx,au,()=>tag(ctx,q[0]-40,q[1]+146,"audit: which system said so, and when",TRUST,{size:22}));}
  // built for audit, not for people to query: a question wanders through every table
  if(ana>0){person(ctx,"ana",220,862,0.58,{t,expr:"concerned",glow:ana});withA(ctx,ana,()=>bubble(ctx,30,150,430,"Awards by faculty, this year?",EDGE_,{size:28}));
    const V_=[[620,280],[640,425],[640,500],[880,580],[1030,425],[1150,300],[1290,430],[1540,300],[1420,425],[1420,500],[1690,560]].map(q=>mw_V(q[0],q[1])),pts=[[460,200]].concat(V_),p=clamp((t-cA-2.3)/1.4,0,1);
    withA(ctx,ana,()=>{ctx.save();ctx.strokeStyle=rgba(EDGE_,0.9);ctx.lineWidth=3;ctx.setLineDash([9,7]);ctx.shadowColor=rgba(EDGE_,0.7);ctx.shadowBlur=8;ctx.beginPath();const n=Math.floor(p*(pts.length-1));
      for(let i=0;i<=n;i++){const q=pts[i];i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}if(n<pts.length-1){const f=p*(pts.length-1)-n,a0=pts[n],a1=pts[n+1];ctx.lineTo(lerp(a0[0],a1[0],f),lerp(a0[1],a1[1],f));}ctx.stroke();ctx.restore();
      withA(ctx,fin(t,cA+3.4,0.5),()=>tag(ctx,1690,700,"+ 6 more joins",EDGE_,{align:"center",size:22}));});
    withA(ctx,fin(t,cA+3.0,0.6),()=>tag(ctx,1150,790,"built for change and audit · not for people to query",MW_V,{align:"center",size:24}));}
  vign(ctx,S);});

/* ---------- 4. Present for people ---------- */
const MW_FX={Awards:[370,380],Enrolments:[960,380],Fees:[1550,380]},MW_OWN={Awards:"Credential type",Enrolments:"Course",Fees:"Fee type"},MW_SH={Learner:[680,665],Date:[1240,665]};
const MW_GRAIN={Awards:"one row per credential awarded",Enrolments:"one row per unit enrolment",Fees:"one row per fee charged"};
const MW_BUSR=["Awards","Enrolments","Fees","Completions"],MW_BUSC=["Learner","Date","Course","Credential","Faculty","Fee type"];
const MW_BUST=[[1,1,1,1,1,0],[1,1,1,0,1,0],[1,1,1,0,1,1],[1,1,1,0,1,0]];
scene("present",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),cS=c("star"),cH=c("share"),cF=c("conformed"),cB=c("bus");setScreen(ctx,S);bg2(ctx);
  const out=fin(t,cB+0.1,0.8),busA=fin(t,cB+0.5,0.8);
  if(out<1)withA(ctx,1-out,()=>{
    withA(ctx,fin(t,cS+0.2,0.5),()=>tag(ctx,960,62,"stars, for people",MW_S,{align:"center",size:24}));
    const fT={Awards:cS+0.9,Enrolments:cS+2.7,Fees:cS+3.7},crossA=fin(t,cH+4.3,0.5)*(1-fin(t,cF+0.4,0.6)),mL=ease(fin(t,cH+0.4,1.0)),mD=ease(fin(t,cH+1.6,1.0));
    const lit=k=>k==="Enrolments"?0:crossA,dimE=k=>k==="Enrolments"?crossA*0.6:0;
    const shL=mw_dim(ctx,MW_SH.Learner[0],MW_SH.Learner[1],"Learner",{shared:true,a:fin(t,cH+0.9,0.5),sub:"L-20417 · Aisha K.",hi:pulseAt(t,cH+6.0,1.3)+pulseAt(t,cF+1.5,1.4)+0.5*crossA}),
      shD=mw_dim(ctx,MW_SH.Date[0],MW_SH.Date[1],"Date",{shared:true,a:fin(t,cH+2.1,0.5),sub:"the calendar",hi:pulseAt(t,cH+7.0,1.3)+pulseAt(t,cF+1.5,1.4)+0.5*crossA});
    Object.keys(MW_FX).forEach((k,i)=>{const[x,y]=MW_FX[k],a=fin(t,fT[k],0.6);if(a<=0)return;withA(ctx,a*(1-dimE(k)),()=>{
      const F={x,y,w:340,h:124},O=mw_dim(ctx,x,y-210,MW_OWN[k],{a:1});mw_join(ctx,F,O,MW_S,0.6);
      // each star's own learner and date, until they're drawn once, shared
      [["learner",-82,mL,MW_SH.Learner,shL],["date",82,mD,MW_SH.Date,shD]].forEach(([nm,dx,m,to,box],j)=>{const px=lerp(x+dx*1.1,to[0],m),py=lerp(y+160,to[1],m);
        if(m<1){const B_=mw_dim(ctx,px,py,nm,{a:1-m*m,w:160});mw_join(ctx,F,B_,MW_S,0.55*(1-m));}
        if(m>0.9){const q=fin(m,0.9,0.1),L_=mw_join;L_(ctx,F,box,MW_S,(0.55+0.45*lit(k))*q,{lw:2+1.5*lit(k)});}});
      mw_fact(ctx,x,y,k,MW_GRAIN[k],{a:1,w:340,h:124,hi:pulseAt(t,fT[k],1.2)+lit(k)});
      {const ok=fin(t,cF+2.8+i*0.3,0.3);if(ok>0){const e=mw_edge(F,MW_SH.Learner[0],MW_SH.Learner[1]);mw_ok(ctx,lerp(e[0],MW_SH.Learner[0],0.45),lerp(e[1],MW_SH.Learner[1]-38,0.45),15,GOOD,ok);}}});});
    withA(ctx,crossA,()=>tag(ctx,960,800,"awards and fees · the same learners · the same year",TRUST,{align:"center",size:24}));
    const cf=fin(t,cF+1.5,0.5);withA(ctx,cf,()=>{[MW_SH.Learner,MW_SH.Date].forEach(([x,y])=>tag(ctx,x,y+70,"conformed",MW_S,{align:"center",size:20}));});
    withA(ctx,fin(t,cF+3.2,0.5),()=>tag(ctx,960,800,"shared dimensions: the stars agree",GOOD,{align:"center",size:24}));});
  // the bus matrix
  if(busA>0)withA(ctx,busA,()=>{tag(ctx,960,110,"bus matrix",MW_S,{align:"center",size:24});
    mw_bus(ctx,330,200,MW_BUSR,MW_BUSC,MW_BUST,{lw:300,cw:160,hh:110,rh:100,rowA:i=>fin(t,cB+3.0+i*0.35,0.4),colA:j=>fin(t,cB+5.0+j*0.3,0.4),tickA:(i,j)=>fin(t,cB+5.6+i*0.25+j*0.08,0.25),hiCols:[0,1,2,4],hiA:fin(t,cB+6.8,0.6)});
    withA(ctx,fin(t,cB+3.0,0.4)*(1-fin(t,cB+5.2,0.4)),()=>T(ctx,"business processes ↓",330,176,{w:700,size:18,color:rgba(SOFT,1)}));
    withA(ctx,fin(t,cB+7.2,0.5),()=>tag(ctx,960,790,"a column ticked in every row: one conformed dimension",MW_S,{align:"center",size:20}));});
  vign(ctx,S);});

/* ---------- 5. Serve an entity ---------- */
const MW_TX=160,MW_TY=380;
const mw_colX=j=>MW_TX+MW_WCOLS.slice(0,j).reduce((s,c)=>s+c[1],0);
scene("serve",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),cO=c("one"),cR=c("row"),cE=c("easy"),cG=c("genie"),cX=c("cost");setScreen(ctx,S);bg2(ctx);
  const lrn=fin(t,cO+0.2,0.6)*(1-fin(t,cG-0.2,0.6)),tA=fin(t,cR+0.2,0.6),hT=[cR+0.4,cR+2.0,cR+3.2,cR+4.3,cR+5.2,cR+5.8];
  // one learner
  withA(ctx,lrn,()=>{mw_learner(ctx,300,300,1.25,MW_W,1);T(ctx,"Aisha K.",380,250,{w:800,size:34,color:rgba(INK,1)});T(ctx,"one learner",380,290,{w:600,size:24,color:rgba(MW_W,1)});});
  // the wide table: one row per learner
  const flt=fin(t,cG+3.2,0.5)*(1-fin(t,cX+0.2,0.5)),close=i=>i===0||i===2,cost2=fin(t,cX+2.4,0.6);
  if(tA>0){mw_wide(ctx,MW_TX,MW_TY,{a:tA,name:"learners · one row per learner",colA:j=>fin(t,hT[j],0.5),rowA:i=>i===0?fin(t,cR+0.5,0.5):fin(t,cR+5.9+i*0.3,0.5),
      colHi:j=>j===2?Math.max(flt,cost2):Math.max(pulseAt(t,hT[j],1.3),0),hiCol:cost2>0.5?BAD:null,rowHi:i=>(i===0?pulseAt(t,cR+0.5,1.2)+fin(t,cE+4.6,0.4)*(1-fin(t,cG,0.5)):0)+(close(i)?fin(t,cG+4.0,0.5)*(1-fin(t,cX+0.2,0.5)):0),rowHiCol:null,
      dim:i=>close(i)?0:fin(t,cG+4.0,0.5)*(1-fin(t,cX+0.2,0.5)),more:true,
      cell:(i,j)=>j===5?(i===0?"…":null):null});}
  withA(ctx,lrn*fin(t,cR+0.6,0.5),()=>mw_line(ctx,300,330,300,MW_TY+48+27,MW_W,0.6,{dash:[5,6],lw:1.8,blur:0}));
  // easy for people, machine learning and AI assistants: one lookup
  const us=fin(t,cE+0.2,0.5)*(1-fin(t,cG-0.2,0.6));
  if(us>0)withA(ctx,us,()=>{const U=[[760,"people",cE+0.6],[1120,"machine learning",cE+1.4],[1480,"AI assistants",cE+2.6]];
    U.forEach(([x,nm,t0],i)=>withA(ctx,fin(t,t0,0.5),()=>{if(i===0)mw_dashIcon(ctx,x,210,0.9,1,t);if(i===1)mw_mlIcon(ctx,x,210,1.1,1,t);if(i===2)orb(ctx,x,210,24,t);T(ctx,nm,x,298,{w:700,size:22,align:"center",color:rgba(SOFT,1)});
      const p=clamp((t-cE-4.4-i*0.15)/0.5,0,1);arrowTo(ctx,x,316,lerp(x,mw_colX(0)+95,0.12),MW_TY+56,MW_W,0.8,{p,head:12,bend:0.05*(i-1)});}));
    withA(ctx,fin(t,cE+4.9,0.5),()=>tag(ctx,1450,760,"one row: a single lookup",MW_W,{align:"center",size:24}));});
  // Genie: one filter, not five joins
  const gA=fin(t,cG-0.1,0.6)*(1-fin(t,cX+0.1,0.6));
  if(gA>0)withA(ctx,gA,()=>{mw_genie(ctx,170,200,t,1,{r:28,chip:false});T(ctx,"Genie",170,272,{w:800,size:20,align:"center",color:rgba(LAYER.gold,1)});
    bubble(ctx,260,110,700,"Which learners are close to a graduate certificate?",LAYER.gold,{size:27});
    const fx=mw_colX(2)+95;withA(ctx,flt,()=>{ctx.strokeStyle=rgba(GOOD,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(fx-26,MW_TY-72);ctx.lineTo(fx+26,MW_TY-72);ctx.lineTo(fx+6,MW_TY-48);ctx.lineTo(fx+6,MW_TY-34);ctx.lineTo(fx-6,MW_TY-40);ctx.lineTo(fx-6,MW_TY-48);ctx.closePath();ctx.stroke();
      tag(ctx,fx+44,MW_TY-54,"credit so far ≥ 45 of 60",GOOD,{size:19});});
    withA(ctx,fin(t,cG+4.4,0.5),()=>{glass(ctx,1250,110,560,190,18,GOOD,{glow:14,ea:0.8,fill:"rgba(7,16,14,0.93)"});T(ctx,"one filter",1280,168,{w:800,size:34,color:rgba(GOOD,1)});
      withA(ctx,fin(t,cG+5.2,0.4),()=>{T(ctx,"not five joins",1280,212,{w:700,size:22,color:rgba(SOFT,1)});for(let k=0;k<5;k++){const x=1290+k*96;ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=1.6;rr(ctx,x,236,70,40,6);ctx.stroke();if(k<4){ctx.beginPath();ctx.moveTo(x+70,256);ctx.lineTo(x+96,256);ctx.stroke();}}
        ctx.strokeStyle=rgba(BAD,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1280,256);ctx.lineTo(1760,256);ctx.stroke();});});});
  // the cost: many columns, and one measure defined twice
  const cA=fin(t,cX+0.6,0.5);if(cA>0)withA(ctx,cA,()=>{const MC=["current course","credit so far","credentials","next step","email","faculty","fees owing","last active","risk score","advisor","visa","…"];
    glass(ctx,1250,110,560,190,18,MW_W,{glow:14,ea:0.8,fill:"rgba(20,14,6,0.93)"});T(ctx,Math.round(countTo(t,cX+0.8,6,124))+" columns",1280,168,{w:800,size:34,color:rgba(MW_W,1)});T(ctx,"to name, fill, test and keep",1280,208,{w:600,size:20,color:rgba(SOFT,1)});
    MC.forEach((s,i)=>withA(ctx,fin(t,cX+1.0+i*0.08,0.3),()=>T(ctx,s,1280+(i%4)*130,244+Math.floor(i/4)*20,{f:"mono",w:500,size:13,color:rgba(MW_W,0.7)})));});
  if(cost2>0){withA(ctx,cost2,()=>{mw_wide(ctx,MW_TX,720,{cols:[["learner",180],["course",320],["credit so far",190]],rows:[["Aisha K.","Grad Cert Data Science","50 of 60"]],name:"course progress",colHi:j=>j===2?1:0,hiCol:BAD});
    const x=mw_colX(2)+95;T(ctx,"≠",x+150,716,{w:800,size:56,align:"center",color:rgba(BAD,1)});
    withA(ctx,fin(t,cX+3.2,0.5),()=>tag(ctx,1060,780,"“credit so far”, defined twice: 45 or 50?",BAD,{size:24}));});}
  vign(ctx,S);});

/* ---------- 6. Where each lives ---------- */
scene("where",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),cP=c("place"),cS=c("silver"),cG=c("gold"),cM=c("sem"),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const sHi=pulseAt(t,cS+0.1,2.2),gHi=pulseAt(t,cG+0.1,2.6);
  if(sHi>0)glow(ctx,MW_PL.silver[0]+MW_PL.silver[2]/2,MW_PL.silver[1]+MW_PL.silver[3]/2,420,LAYER.silver,0.12*sHi);
  if(gHi>0)glow(ctx,MW_PL.gold[0]+MW_PL.gold[2]/2,MW_PL.gold[1]+MW_PL.gold[3]/2,460,LAYER.gold,0.12*gHi);
  mw_platform(ctx,t,{srcA:fin(t,cP+0.2,0.6),bA:fin(t,cP+0.5,0.6),sA2:fin(t,cP+0.9,0.6),gA:fin(t,cP+1.3,0.6),core:fin(t,cS+1.2,0.6),vault:fin(t,cS+2.2,0.6),
    star:fin(t,cG+0.6,0.6),wide:fin(t,cG+1.9,0.6),sem:fin(t,cM+0.3,0.8),tools:fin(t,cM+2.1,0.6),flow:t>cM+3.4});
  withA(ctx,fin(t,cP+0.4,0.6),()=>tag(ctx,960,96,"the platform from The Inner Life of Data",INK,{align:"center",size:22}));
  vign(ctx,S);});

/* ---------- 7. Choosing ---------- */
const MW_DEC=[["vault","Many sources that keep changing, and auditors who ask where each value came from","a vault",MW_V],
  ["star","Many processes that share the same context","conformed stars",MW_S],
  ["wide","One entity, asked about in many ways, by people and by AI","wide tables",MW_W]];
function mw_magnifier(ctx,x,y,r,col,a){withA(ctx,a,()=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+r*0.72,y+r*0.72);ctx.lineTo(x+r*1.5,y+r*1.5);ctx.stroke();ctx.shadowBlur=0;});}
scene("choose",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),cV=c("vault"),cS=c("star"),cW=c("wide"),cC=c("copies"),cF=c("fashion");setScreen(ctx,S);bg2(ctx);
  const t0=[cV+0.2,cS+0.1,cW+0.1],rT=[cV+4.4,cS+2.5,cW+3.6],cp=fin(t,cC+1.9,0.6)*(1-fin(t,cF+1.0,0.6)),all=fin(t,cF+2.2,0.6);
  MW_DEC.forEach(([k,cond,res,col],i)=>{const x=110+i*580,y=150,a=fin(t,t0[i],0.6);if(a<=0)return;withA(ctx,a*(1-0.3*cp),()=>{
    mw_panel(ctx,x,y,540,460,col,{hi:pulseAt(t,rT[i],1.4)+0.6*all});
    if(k==="vault"){const vx=x+290,vy=y+150;["sis","lms","fin","short"].forEach((s,j)=>{const sx=x+34,sy=y+36+j*54,q=fin(t,t0[i]+0.3+j*0.15,0.4);withA(ctx,q,()=>{mw_line(ctx,sx+74,sy+22,vx-150,vy-40,MW_SRC[s][1],0.4,{lw:1.4,dash:[4,5],blur:0});glass(ctx,sx,sy,72,44,8,MW_SRC[s][1],{glow:6,ea:0.8,fill:"rgba(7,12,24,0.92)"});dbGlyph(ctx,sx+36,sy+24,MW_SRC[s][1],0.55);});});
      mw_vaultGlyph(ctx,vx,vy,1.05,{p:clamp((t-t0[i]-0.4)/1.4,0,1)});mw_magnifier(ctx,x+472,y+64,26,TRUST,fin(t,cV+2.1,0.5));withA(ctx,fin(t,cV+2.3,0.5),()=>T(ctx,"auditor",x+482,y+146,{w:700,size:20,align:"center",color:rgba(TRUST,1)}));}
    if(k==="star"){const F=[["Awards",x+100],["Enrolments",x+270],["Fees",x+440]],D=[["Learner",x+170],["Date",x+370]];
      F.forEach(([n,fx])=>D.forEach(([d,dx])=>mw_line(ctx,fx,y+98,dx,y+200,MW_S,0.55,{lw:1.6,blur:0})));
      F.forEach(([n,fx],j)=>withA(ctx,fin(t,t0[i]+0.2+j*0.2,0.4),()=>{glass(ctx,fx-78,y+44,156,56,10,MW_S,{glow:10,ea:0.9,fill:"rgba(8,30,24,0.95)"});T(ctx,n,fx,y+80,{w:800,size:21,align:"center",color:rgba(mix(MW_S,[255,255,255],0.3),1)});}));
      D.forEach(([d,dx],j)=>withA(ctx,fin(t,t0[i]+0.9+j*0.2,0.4),()=>mw_dim(ctx,dx,y+214,d,{shared:true,w:176})));}
    if(k==="wide"){mw_learner(ctx,x+76,y+250,1.0,MW_W,1);mw_wideGlyph(ctx,x+320,y+170,1.0,{p:clamp((t-t0[i]-0.2)/1.2,0,1)});orb(ctx,x+486,y+62,20,t);
      [["close to a certificate?",x+190,y+56],["what's next?",x+370,y+56]].forEach(([q,qx,qy],j)=>withA(ctx,fin(t,t0[i]+0.8+j*0.4,0.4),()=>tag(ctx,qx,qy,q,INK,{align:"center",size:18})));}
    wrapT(ctx,cond,x+30,y+306,480,{size:24,w:600,color:rgba(INK,0.92)});
    withA(ctx,fin(t,rT[i],0.5),()=>T(ctx,"→ "+res,x+30,y+428,{w:800,size:38,color:rgba(col,1)}));});});
  // every shape is another copy to keep in step, like the library's cards
  withA(ctx,fin(t,cC+0.3,0.5)*(1-fin(t,cF,0.4)),()=>tag(ctx,960,96,"don't copy for its own sake",EDGE_,{align:"center",size:24}));
  if(cp>0){const heads=["DATA VAULT.","STARS.","WIDE TABLES."],flick=pulseAt(t,cC+4.6,1.2);
    withA(ctx,cp,()=>{mw_line(ctx,380,736,1540,736,PARCH,0.6,{dash:[6,8],lw:2.4,blur:0});});
    heads.forEach((h,i)=>{const e=ease(fin(t,cC+1.9+i*0.3,0.7)),x=215+i*580;mw_card(ctx,x,lerp(1100,636,e),330,{a:cp*Math.min(1,e*1.6),t,seed:11+i,mark:"copy "+(i+1),head:h,lines:["a copy of the facts","rebuilt every night"],rot:(i-1)*0.02,bad:i===1?flick:0});});
    withA(ctx,cp*fin(t,cC+2.8,0.5),()=>{tag(ctx,675,736,"keep in step",PARCH,{align:"center",size:20});tag(ctx,1255,736,"keep in step",PARCH,{align:"center",size:20});});}
  withA(ctx,fin(t,cF+0.2,0.5),()=>tag(ctx,960,96,"choose per question, not per fashion",TRUST,{align:"center",size:28}));
  withA(ctx,all,()=>{ctx.strokeStyle=rgba(INK,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(130,636);ctx.lineTo(130,656);ctx.lineTo(1790,656);ctx.lineTo(1790,636);ctx.stroke();tag(ctx,960,704,"most platforms use more than one",INK,{align:"center",size:24});});
  vign(ctx,S);});

/* ---------- 8. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),cA=c("arrived"),cG=c("grew"),cN=c("next"),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const out=fin(t,cN-0.1,0.8);
  if(out<1)withA(ctx,1-out,()=>{
    mw_source(ctx,800,50,"short",{a:fin(t,0.3,0.5),w:320,h:70,sub:"this week's microcredentials",isNew:true});
    const P_=[["vault",110,MW_V,"data vault · silver"],["star",690,MW_S,"award star · gold"],["wide",1270,MW_W,"wide learner table · gold"]];
    P_.forEach(([k,x,col,nm],i)=>{const a=fin(t,0.4+i*0.25,0.6),hi=[pulseAt(t,cA+2.6,1.6),pulseAt(t,cG+0.3,1.6),pulseAt(t,cG+2.6,1.6)][i];mw_panel(ctx,x,170,540,420,col,{a,hi});
      withA(ctx,a,()=>{T(ctx,nm,x+270,226,{w:800,size:24,align:"center",color:rgba(col,1)});mw_line(ctx,960,122,x+270,170,MW_SC,0.5*fin(t,cA+0.4+i*0.2,0.5),{dash:[6,7],lw:1.8,blur:0});
        if(k==="vault")mw_vaultGlyph(ctx,x+270,392,1.6,{extra:fin(t,cA+0.9,0.8)});
        if(k==="star"){mw_starGlyph(ctx,x+270,390,1.5,{});const n=Math.round(countTo(t,cG+0.6,0,748));withA(ctx,fin(t,cG+0.5,0.4),()=>tag(ctx,x+270,552,"+"+fmtNum(n)+" rows",MW_S,{align:"center",size:24}));}
        if(k==="wide"){const nc=fin(t,cG+2.7,0.6);mw_wideGlyph(ctx,x+270,390,1.5,{cols:nc>0.5?12:11,newCol:nc>0.5?11:null});withA(ctx,nc,()=>tag(ctx,x+270,552,"+1 column: short courses",MW_SC,{align:"center",size:24}));}});});
    withA(ctx,fin(t,cA+3.3,0.5),()=>{tag(ctx,380,552,"new satellites · nothing changed",GOOD,{align:"center",size:22});mw_ok(ctx,580,190,18,GOOD,1);});});
  // next: the app and the analysts, at the same database
  const nx=fin(t,cN+0.3,0.8);if(nx>0)withA(ctx,nx,()=>{phone2(ctx,560,450,1.25,{});T(ctx,"the app",560,640,{w:700,size:22,align:"center",color:rgba(SOFT,1)});
    person(ctx,"sam",1380,760,0.52,{t,expr:"calm"});mw_dashIcon(ctx,1560,440,1,1,t);T(ctx,"the analysts",1470,800,{w:700,size:22,align:"center",color:rgba(SOFT,1)});
    const g=0.6+0.4*Math.sin(t*2);glow(ctx,960,430,160,CYAN,0.25*g);dbGlyph(ctx,960,440,CYAN,3.2);arrowTo(ctx,660,450,880,440,CYAN,0.7,{p:clamp((t-cN-0.8)/0.5,0,1),head:12});arrowTo(ctx,1300,450,1040,440,CYAN,0.7,{p:clamp((t-cN-1.0)/0.5,0,1),head:12});
    withA(ctx,fin(t,cN+1.8,0.5),()=>{T(ctx,"?",960,300,{w:800,size:72,align:"center",color:rgba(TRUST,0.6+0.4*g)});T(ctx,"one database?",960,580,{w:700,size:26,align:"center",color:rgba(CYAN,1)});});});
  endCard(ctx,S,t,B+0.3,"Many ways to read",MW_V,"Choose per question, not per fashion.");
  vign(ctx,S);});
