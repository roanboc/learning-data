/* ===== Meaning machines can read: scenes =====
   Nine chapters, as in ../script.md. People tried to write meaning down before (Linnaeus, Wilkins, Nightingale and the ICD).
   Today, Ana asks Genie who is one microcredential away from a graduate certificate, and Genie guesses: the stacking rules are in a
   document no tool can read. Four ways to write meaning down stack like floors: glossary, taxonomy, ontology, semantic layer.
   The ontology holds the rule; the data model, which names the same things, has another job: it plans the records. The semantic
   layer holds the calculation, standards save starting from blank, and Genie, grounded, asks back and answers right.
   The triangle from What's in a word returns. */

/* ---------- 1. They tried before ---------- */
const MM_HIER=[["KINGDOM","Animalia"],["CLASS","Aves"],["ORDER","Passeriformes"],["GENUS","Erithacus"],["SPECIES","Erithacus rubecula"]];
const MM_GENERA=["general","mixed relation","relation of action","discourse","God","world","element","stone","metal","herb · leaf","herb · flower","herb · seed","shrub","tree",
  "exanguious","fish","bird","beast","peculiar parts","general parts","magnitude","space","measure","natural power","habit","manners","sensible quality","sickness",
  "spiritual action","corporeal action","motion","operation","household relation","possessions","provisions","civil relation","judicial relation","military relation","naval relation","church relation"];
const MM_DEATH=["typhoid fever","smallpox","measles","scarlet fever","whooping cough","diphtheria","influenza","cholera"];
const MM_ICD=[["1A00","Cholera"],["BA41","Acute myocardial infarction"],["CA40","Pneumonia"],["2C25","Malignant neoplasms of bronchus or lung"]];
const MM_REV=[1893,1900,1909,1920,1929,1938,1948,1955,1965,1975,1990,2022];
function mm_wilkins(ctx,t,g,g2,g3,dim){const rx=390,ry=535,ink=[214,190,150],low=i=>clamp((860-(ry+(i-19.5)*32))/60,0,1);
  withA(ctx,1-0.7*dim,()=>{
    // species: fine strokes that run on past the right edge, swaying
    for(let i=0;i<40;i++){const gy=ry+(i-19.5)*32+13,vis=clamp(g*20-Math.abs(i-19.5),0,1)*low(i);if(vis<=0)continue;withA(ctx,low(i),()=>{
      for(let j=0;j<3;j++){const sw=Math.sin(t*0.8+i*0.7+j)*2.2,dy=gy+(j-1)*10+sw,q=clamp(g2*22-Math.abs(i-19.5)-j*0.3,0,1);if(q<=0)continue;
        mm_limb(ctx,[690,gy],[735,gy],[760,dy],[806,dy],3.2,1,q,ink,{flat:true,a:0.42});if(q>=1){ctx.fillStyle=rgba(ink,0.55);ctx.beginPath();ctx.ellipse(812,dy,5,3,0,0,TAU);ctx.fill();}
        let px=816,py=dy;for(let k=0;k<6;k++){const qq=clamp(g3*24-Math.abs(i-19.5)-j*0.3-k*0.4,0,1);if(qq<=0||hash(i*17+j*5+k,8)<0.3)break;const nx=px+150+hash(i*31+j*7+k,5)*70,ny=dy+(hash(i+j*3+k,6)-0.5)*14+Math.sin(t*0.9+i+k)*2.5;
          ctx.strokeStyle=rgba(ink,0.26*qq);ctx.lineWidth=Math.max(0.6,1.8-k*0.25);ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo((px+nx)/2,py+(ny-py)*0.2+Math.sin(t+k)*3,lerp(px,nx,qq),lerp(py,ny,qq));ctx.stroke();
          if(qq>=1){ctx.fillStyle=rgba(ink,0.35);ctx.beginPath();ctx.arc(nx,ny,2.2,0,TAU);ctx.fill();}px=nx;py=ny;}}});}
    // forty kinds, fanned out from everything, on slips of paper
    MM_GENERA.forEach((s,i)=>{const gy=ry+(i-19.5)*32,vis=clamp(g*20-Math.abs(i-19.5),0,1),lo=low(i);if(vis<=0||lo<=0)return;const sw=Math.sin(t*0.7+i*0.5)*1.2;
      mm_limb(ctx,[rx,ry],[455,ry+sw],[440,gy+13],[500,gy+13],3.6,1.4,vis,ink,{flat:true,a:0.62*lo});
      mm_parch(ctx,500,gy+sw,190,26,{a:vis*lo,flat:true,t,seed:i,draw:(c)=>T(c,s,10,19,{w:700,size:15,color:MM_SEP})});});
    mm_parch(ctx,150,480,240,110,{a:fin(g,0,0.15),t,seed:77,draw:(c)=>{T(c,"everything",20,50,{w:800,size:30,color:MM_SEP});T(c,"in the universe",20,82,{w:600,size:18,color:MM_SEP2});}});});}
function mm_miniRobinCard(ctx,x,y,w,h,title,year,line,ok,mark,a,draw,t,sd){mm_parch(ctx,x,y,w,h,{a,t,seed:sd,draw:(c)=>{T(c,title,24,44,{w:800,size:26,color:MM_SEP});T(c,year,24,70,{f:"mono",w:500,size:15,color:MM_SEP2});draw(c);T(c,line,24,h-30,{w:700,size:20,color:MM_SEP});
  if(mark>0){if(ok)tick_(c,w-40,44,34,[40,140,70],mark);else cross_(c,w-40,44,34,[170,50,40],mark);}}});}
scene("before",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");histBg(ctx,S,t);
  const cL=c("linn"),cW=c("wilkins"),cN=c("night"),cI=c("icd"),cS=c("lesson");
  const aL=1-fin(t,cW-0.3,0.8),aW=fin(t,cW-0.3,0.8)*(1-fin(t,cN-0.3,0.8)),aN=fin(t,cN-0.3,0.8)*(1-fin(t,cI-0.2,0.8)),aI=fin(t,cI-0.2,0.8)*(1-fin(t,cS-0.3,0.8)),aS=fin(t,cS-0.3,0.8)*(1-fin(t,B,0.6));
  // Linnaeus: a place in a hierarchy, and a two-part name. The hierarchy is a living tree; the robin sits at the tip of its own branch
  if(aL>0)withA(ctx,aL,()=>{yearTag(ctx,120,120,"1750s · Linnaeus",CLAY,fin(t,0.5,0.6));
    const path=[0,1,2,3,4].map(d=>fin(t,cL+4.1+d*0.45,0.5)),grow=clamp((t-0.2)/2.2,0,1),P=mm_tree(ctx,t,grow,path);
    const lab={1:path[0],2:path[1],3:path[2],4:path[3],6:fin(t,cL+3.6,0.6),7:fin(t,cL+3.8,0.6),8:fin(t,cL+4.0,0.6)};mm_treeTags(ctx,t,P,lab,{4:pulseAt(t,cL+6.3,1.6)});
    const s_=2.3;mm_robin(ctx,P[5][0]+8,P[5][1]-44*s_,s_,fin(t,1.7,0.7),t);
    const nA=fin(t,cL+2.8,0.7);withA(ctx,nA,()=>{const s1="Erithacus ",s2="rubecula",w1=tw(ctx,s1,58,700),w2=tw(ctx,s2,58,700),x0=1420-(w1+w2)/2;T(ctx,s1+s2,x0,650,{w:700,size:58,color:rgba(PARCH,1)});
      withA(ctx,fin(t,cL+3.4,0.6),()=>{[[x0,x0+w1-18,"genus"],[x0+w1,x0+w1+w2,"species"]].forEach(([a,b,l])=>{ctx.strokeStyle=rgba(CLAY,0.9);ctx.lineWidth=2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a,670);ctx.quadraticCurveTo(a,682,a+10,682);ctx.lineTo(b-10,682);ctx.quadraticCurveTo(b,682,b,670);ctx.stroke();T(ctx,l,(a+b)/2,712,{f:"mono",w:500,size:18,align:"center",color:rgba(CLAY,1)});});});
      T(ctx,"named by Linnaeus in 1758 as Motacilla rubecula",1420,764,{f:"mono",w:500,size:19,align:"center",color:rgba(PARCH,0.7)});});
    withA(ctx,fin(t,cL+6.6,0.6),()=>tag(ctx,1420,180,"his system: still used today",[150,220,140],{align:"center",size:20}));});
  // Wilkins: a language to classify everything, sprawling off the edges, then fading
  if(aW>0)withA(ctx,aW,()=>{const g=clamp((t-cW-0.4)/3.0,0,1),g2=clamp((t-cW-1.2)/3.2,0,1),g3=clamp((t-cW-2.0)/3.4,0,1),dim=fin(t,cW+5.3,1.2),z=lerp(1.04,0.93,clamp((t-cW)/7,0,1));
    ctx.save();ctx.translate(700,540);ctx.scale(z,z);ctx.translate(-700,-540);phAsDeco(true,()=>mm_wilkins(ctx,t,g,g2,g3,dim));ctx.restore();
    yearTag(ctx,120,120,"1668 · Wilkins",CLAY,fin(t,cW,0.6));withA(ctx,fin(t,cW+0.8,0.6),()=>{const ls=["An Essay towards","a Real Character, and","a Philosophical Language"],fs=Math.max(18,phMin(ctx)),lh=fs*1.3,w=Math.max(...ls.map(l=>tw(ctx,l,fs,500,"mono")))+30;ctx.fillStyle="rgba(26,16,10,0.85)";rr(ctx,110,152,w,lh*3+16,10);ctx.fill();ls.forEach((l,i)=>T(ctx,l,125,152+lh*(i+0.85),{f:"mono",w:500,size:18,color:rgba(PARCH,0.9)}));});
    withA(ctx,fin(t,cW+2.2,0.6)*(1-dim*0.6),()=>{const ps=Math.max(16,phMin(ctx)),pw=tw(ctx,"40 kinds, divided again and again",ps,600)+40;ctx.fillStyle="rgba(26,16,10,0.85)";rr(ctx,270-pw/2,630,pw,ps+24,(ps+24)/2);ctx.fill();T(ctx,"40 kinds, divided again and again",270,642+ps*0.7,{w:600,size:16,align:"center",color:rgba(PARCH,0.95)});});
    withA(ctx,dim,()=>tag(ctx,270,720,"never took hold",EDGE_,{align:"center",size:22}));});
  // Nightingale: the same columns on every hospital's form
  if(aN>0)withA(ctx,aN,()=>{yearTag(ctx,120,120,"1860 · Nightingale",CLAY,1);withA(ctx,fin(t,cN+0.6,0.6),()=>T(ctx,"model hospital statistics",120,178,{f:"mono",w:500,size:16,color:rgba(PARCH,0.8)}));
    const band=fin(t,cN+5.3,0.6);[["Hospital A",150,-0.012],["Hospital B",710,0.006],["Hospital C",1270,-0.004]].forEach(([n,x,r],i)=>{const a=fin(t,cN+0.9+i*0.6,0.5);mm_form(ctx,x,210,500,440,n,i*2,{a,rot:r,t,band:band*(0.75+0.25*Math.sin(t*3+i)),fill:clamp((t-cN-1.2-i*0.6)/2.2,0,1)});});
    if(band>0)withA(ctx,band,()=>{ctx.save();ctx.globalCompositeOperation="lighter";ctx.strokeStyle="rgba(255,190,90,0.7)";ctx.lineWidth=3;ctx.shadowColor="rgba(255,190,90,0.9)";ctx.shadowBlur=12;[[650,710],[1210,1270]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(a,316);ctx.lineTo(b,316);ctx.stroke();});ctx.restore();
      tag(ctx,960,730,"same columns, same way: now they compare",[255,196,110],{align:"center",size:22});});});
  // the list of causes of death, 1893, and the classification it became
  if(aI>0)withA(ctx,aI,()=>{yearTag(ctx,120,120,"1893 → today",CLAY,1);
    mm_parch(ctx,180,180,560,520,{a:fin(t,cI+0.3,0.6),rot:-0.008,t,seed:21,draw:(c)=>{wrapT(c,"International List of Causes of Death",28,50,500,{w:800,size:24,lh:30,color:MM_SEP});T(c,"Bertillon · 1893",28,120,{f:"mono",w:500,size:15,color:MM_SEP2});
      MM_DEATH.forEach((s,i)=>{const q=clamp((t-cI-0.8)/2.6*MM_DEATH.length-i,0,1);if(q<=0)return;const yy=172+i*42;c.strokeStyle="rgba(90,66,40,0.25)";c.lineWidth=1;c.beginPath();c.moveTo(28,yy+10);c.lineTo(530,yy+10);c.stroke();T(c,typeOn(s,q),40,yy,{w:600,size:21,color:"rgba(52,40,30,0.9)"});});}});
    const ar=fin(t,cI+4.5,0.6);arrowTo(ctx,770,440,1050,440,CLAY,ar,{p:ar,bend:-0.12,head:14});
    withA(ctx,fin(t,cI+4.8,0.6),()=>{const x=1060,y=190,w=740,h=390;glass(ctx,x,y,w,h,18,[214,226,245],{glow:16,ea:0.8,fill:"rgba(8,12,22,0.95)"});T(ctx,"International Classification of Diseases",x+28,y+52,{w:800,size:28});T(ctx,"ICD-11 · World Health Organization",x+28,y+84,{w:600,size:17,color:rgba(SOFT,1)});
      MM_ICD.forEach(([k,n],i)=>withA(ctx,fin(t,cI+5.2+i*0.3,0.4),()=>{const yy=y+146+i*56;ctx.fillStyle="rgba(214,226,245,0.06)";rr(ctx,x+20,yy-32,w-40,46,8);ctx.fill();T(ctx,k,x+36,yy,{f:"mono",w:500,size:21,color:rgba(MM_INK,1)});T(ctx,n,x+130,yy,{w:600,size:20});}));});
    const tr=clamp((t-cI-5.4)/2.0,0,1.15),tl=Math.min(tr,1),x0=180,x1=1740,ty=790,X=yr=>lerp(x0,x1,(yr-1893)/(2022-1893));withA(ctx,fin(t,cI+5.3,0.4),()=>{ctx.strokeStyle=rgba(CLAY,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,ty);ctx.lineTo(lerp(x0,x1,tl),ty);ctx.stroke();
      MM_REV.forEach(yr=>{const q=clamp((tr-(yr-1893)/129)*12,0,1);if(q<=0)return;ctx.fillStyle=rgba(CLAY,q);ctx.beginPath();ctx.arc(X(yr),ty,6,0,TAU);ctx.fill();});
      [[1893,"list"],[1948,"WHO"],[1990,"ICD-10"],[2022,"ICD-11"]].forEach(([yr,l])=>{const q=clamp((tr-(yr-1893)/129)*10,0,1);if(q>0)withA(ctx,q,()=>{T(ctx,""+yr,X(yr),ty+36,{f:"mono",w:500,size:17,align:"center",color:rgba(CLAY,1)});T(ctx,l,X(yr),ty-18,{w:700,size:17,align:"center",color:rgba(PARCH,0.95)});});});});});
  // the lesson: the ones that last are made for a purpose
  if(aS>0)withA(ctx,aS,()=>{const mk=k=>fin(t,cS+2.3+k*0.35,0.4);
    mm_miniRobinCard(ctx,150,170,480,330,"Linnaeus","1750s","names for every species",true,mk(0),fin(t,cS,0.5),(c)=>mm_robin(c,240,160,1.3,1,t),t,31);
    mm_miniRobinCard(ctx,720,170,480,330,"Wilkins","1668","a place for everything",false,mk(1),fin(t,cS+0.25,0.5),(c)=>{for(let i=0;i<14;i++){const y1=100+i*10,y2=90+i*11+hash(i,2)*8+Math.sin(t+i)*2;mm_limb(c,[60,170],[120,170],[150,y1],[210,y1],2.4,1,1,[110,82,54],{flat:true,a:0.6});mm_limb(c,[210,y1],[300,y1],[340,y2],[440,y2],1.4,0.6,1,[110,82,54],{flat:true,a:0.4});}},t,32);
    mm_miniRobinCard(ctx,1290,170,480,330,"Nightingale → ICD","1860 · 1893","causes of death, compared",true,mk(2),fin(t,cS+0.5,0.5),(c)=>{c.strokeStyle="rgba(96,70,44,0.45)";c.lineWidth=1.2;for(let i=0;i<6;i++){c.beginPath();c.moveTo(40,100+i*24);c.quadraticCurveTo(240,102+i*24+hash(i,3)*3,440,100+i*24);c.stroke();}for(let j=1;j<5;j++){c.beginPath();c.moveTo(40+j*80,100);c.quadraticCurveTo(42+j*80,160,40+j*80,220);c.stroke();}},t,33);
    withA(ctx,fin(t,cS+0.6,0.6),()=>T(ctx,"Shared definitions let strangers compare.",960,590,{w:700,size:36,align:"center",color:rgba(PARCH,1)}));
    withA(ctx,fin(t,cS+3.2,0.7),()=>{const s="made for a purpose, not for everything",w=tw(ctx,s,42,800)+80;glow(ctx,960,690,420,[255,196,110],0.12);glass(ctx,960-w/2,640,w,100,22,[255,196,110],{glow:20,ea:0.9,fill:"rgba(26,16,10,0.94)"});T(ctx,s,960,705,{w:800,size:42,align:"center",color:rgba([255,214,160],1)});});});
  seriesTitle(ctx,S,t,B,"Meaning machines can read","what an AI assistant needs to answer right",MM_INK);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Genie guesses ---------- */
const MM_TL={cols:["learner_id","name"],rows:[["L-1042","Aisha K."],["L-2210","Ben O."],["L-3307","Chen W."]]};
const MM_TC={cols:["learner_id","credential","is_micro","stack_ok"],rows:[["L-1042","DataVis","true","true"],["L-1042","SQL-A","true","true"],["L-3307","PyBasics","true","false"]]};
const MM_TG={cols:["cert_id","name","credit"],rows:[["GC-DA","Grad Cert DA","40"],["GC-AI","Grad Cert AI","40"]]};
function mm_asker(ctx,t,a,qA,o){o=o||{};withA(ctx,a,()=>{person(ctx,"ana",250,900,0.64,{t,pose:o.pose||"stand",expr:o.expr||"calm"});
  withA(ctx,qA,()=>{tag(ctx,90,(o.qy||226)-30,"Ana Ruiz · Head of School",MM_ASK,{size:18});bubble(ctx,90,o.qy||226,640,MM_Q,MM_ASK,{size:28});});});}
scene("guesses",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cA=c("ask"),cF=c("finds"),cW=c("wrong"),cR=c("read");
  tag(ctx,120,110,"The university · today",[236,243,255],{size:20});
  mm_asker(ctx,t,fin(t,0.3,0.6),fin(t,cA+2.6,0.6),{pose:t>cA+2.4&&t<cF+0.5?"explain":"stand",expr:t>cW+5.6?"concerned":"calm"});
  const gx=760,gy=470;mm_genie(ctx,gx,gy,t,{a:fin(t,cA+2.0,0.6)});
  // what Genie can read: tables
  const tA=fin(t,cF-0.2,0.6),L=mm_cols(ctx,MM_TL.cols,MM_TL.rows),Cc=mm_cols(ctx,MM_TC.cols,MM_TC.rows),wL=L[L.length-1].x+L[L.length-1].w,wC=Cc[Cc.length-1].x+Cc[Cc.length-1].w;
  const X1=800,X2=X1+wL+18,Y1=100,Y2=340,DY=400;
  withA(ctx,tA,()=>{table(ctx,X1,Y1,"learners",MM_TL.cols,MM_TL.rows,{col:[150,225,255]});table(ctx,X2,Y1,"credentials",MM_TC.cols,MM_TC.rows,{col:[150,225,255]});table(ctx,X1,Y2,"certificates",MM_TG.cols,MM_TG.rows,{col:[150,225,255]});});
  // Genie looks through them: a beam to each table, and a scan across the columns
  [[X1+wL/2,Y1+100],[X2+wC/2,Y1+100],[X1+160,Y2+80]].forEach(([x,y],i)=>{const a=fin(t,cF+0.3+i*0.35,0.4)*(1-fin(t,cW+0.5,0.8));if(a<=0)return;withA(ctx,a*0.8,()=>{ctx.save();ctx.setLineDash([5,9]);ctx.strokeStyle=rgba(MM_GEN,0.55);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(gx+30,gy);ctx.lineTo(x,y);ctx.stroke();ctx.restore();
    const u=((t-cF)*0.7+i*0.33)%1;glow(ctx,lerp(gx+30,x,u),lerp(gy,y,u),16,MM_GEN,0.7);});});
  const sc_=clamp((t-cF-1.2)/3.8,0,1);if(sc_>0&&sc_<1){const sx=X2+wC*sc_;withA(ctx,0.8,()=>{ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createLinearGradient(sx-40,0,sx,0);g.addColorStop(0,"rgba(120,200,255,0)");g.addColorStop(1,"rgba(120,200,255,0.35)");ctx.fillStyle=g;ctx.fillRect(sx-40,Y1+50,40,166);ctx.restore();});}
  [[2,cF+3.0],[3,cF+4.7]].forEach(([k,t0])=>{const a=fin(t,t0,0.4);if(a<=0)return;const col=Cc[k],x=X2+col.x+2,hi=pulseAt(t,t0,1.4);withA(ctx,a,()=>{glow(ctx,x+col.w/2,Y1+140,90,CYAN,0.25+0.3*hi);const tb=Math.max(46,Math.max(18,phMin(ctx))*1.65);ctx.save();ctx.strokeStyle=rgba(CYAN,1);ctx.lineWidth=2.4+2*hi;ctx.shadowColor=rgba(CYAN,0.9);ctx.shadowBlur=14;rr(ctx,x,Y1+tb+4,col.w-4,Math.max(40,Math.max(16,phMin(ctx))*1.45)*4-8,8);ctx.stroke();ctx.restore();});});
  // the rules live in a document no tool can read
  const dA=fin(t,cW+2.0,0.6),grey=fin(t,cW+3.3,0.8),inv=fin(t,cR+2.9,0.6);
  mm_doc(ctx,1330,DY,440,420,{a:dA,grey});
  if(grey>0)withA(ctx,grey,()=>{ctx.fillStyle="rgba(7,12,24,0.9)";ctx.beginPath();ctx.arc(1550,DY+310,40,0,TAU);ctx.fill();mm_eyeOff(ctx,1550,DY+310,26,[255,140,120],0.6+0.4*Math.abs(Math.sin(t*2))*inv+0.4*(1-inv));tag(ctx,1550,DY-30,"no tool can read this",[200,205,215],{align:"center",size:18});});
  if(inv>0)withA(ctx,inv,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(EDGE_,0.9);ctx.lineWidth=2.4;rr(ctx,1318,DY-12,464,444,12);ctx.stroke();ctx.restore();});
  // Genie guesses: a confident number, and the registrar's list
  const gA=fin(t,cW+4.8,0.4),jit=t>cW+4.8&&t<cW+5.5?(hash(Math.floor(t*30),3)-0.5)*10:0;
  withA(ctx,gA,()=>{glow(ctx,690,740,220,BAD,0.18+0.08*Math.sin(t*3));numCard(ctx,500+jit,640,380,"Genie","214","guessed from is_micro and stack_ok",BAD);cross_(ctx,846,672,30,BAD,fin(t,cW+5.9,0.4));});
  withA(ctx,fin(t,cW+5.6,0.5),()=>numCard(ctx,910,640,380,"Registrar's list","132","by the stacking policy",GOOD));
  // what it can read, and what it can't
  const bA=fin(t,cR+0.2,0.7);if(bA>0)withA(ctx,bA,()=>{const xr=X2+wC+18;ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(MM_GEN,0.85);ctx.lineWidth=2.2;ctx.shadowColor=rgba(MM_GEN,0.6);ctx.shadowBlur=10;
    ctx.beginPath();ctx.moveTo(782,84);ctx.lineTo(xr,84);ctx.lineTo(xr,326);ctx.lineTo(1318,326);ctx.lineTo(1318,528);ctx.lineTo(782,528);ctx.closePath();ctx.stroke();ctx.restore();tag(ctx,782,60,"what Genie can read",MM_GEN,{size:18});});
  vign(ctx,S);});

/* ---------- 3. Four ways to write meaning down ---------- */
scene("four",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cG=c("gloss"),cT=c("tax"),cO=c("onto"),cSm=c("sem"),cK=c("stack"),litT=[cG+4.1,cT+0.1,cO+0.1,cSm+0.2],dur=[1.6,1.8,3.9,1.6];
  const br=k=>t>B?pulseAt(t,B+0.2+k*0.65,1.3):0;
  ctx.save();const z=focus(ctx,t,[[0,960,540,1],[litT[0]-0.6,790,mm_fy(0)+70,1.57],[cT-0.3,790,mm_fy(1)+70,1.57],[cO-0.3,790,mm_fy(2)+70,1.57],[cSm-0.3,790,mm_fy(3)+70,1.57],[cK-0.2,960,540,1]],1.3);
  const an=mm_stack(ctx,t,{decoContent:z<1.5,a:[0,1,2,3].map(k=>fin(t,cG+0.3+k*0.3,0.6)),lit:litT.map(x=>fin(t,x,0.6)),ca:litT.map((x,k)=>clamp((t-x-0.2)/dur[k],0,1)),qa:litT.map(x=>fin(t,Math.max(x+1.3,cK+0.6),0.6)),
    hi:litT.map((x,k)=>Math.max(pulseAt(t,x,2.6),pulseAt(t,cK+1.4,1.6),br(k))),mh:[0,1,2,3].map(k=>fin(t,cK+0.3,0.6))});
  withA(ctx,fin(t,cT+2.4,0.5)*(1-fin(t,cO-0.4,0.5)),()=>T(ctx,"like Linnaeus's",202,mm_fy(1)+130,{w:600,size:18,color:rgba(PARCH,0.9)}));
  mm_thread(ctx,an,clamp((t-cK-0.3)/1.4,0,1),t,[236,243,255]);ctx.restore();
  withA(ctx,fin(t,cK+0.1,0.6),()=>tag(ctx,960,64,"a stack, not rivals",[236,243,255],{align:"center",size:22}));
  vign(ctx,S);});

/* ---------- 4. The ontology ---------- */
scene("ontology",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cR=c("rules"),cG=c("graph"),cA=c("aristotle"),out1=fin(t,cG-0.4,0.8),dimG=fin(t,cA-0.2,0.8);
  // statements
  if(out1<1)withA(ctx,1-out1,()=>{tag(ctx,960,96,"Ontology: rules, written as statements",MM_ONT,{align:"center",size:24});
    const a1=fin(t,cR+3.5,0.5),a2=fin(t,cR+6.5,0.5),f1=fin(t,cR+1.4,0.6),f2=fin(t,cR+2.0,0.6);
    withA(ctx,f1*(1-a1),()=>glass(ctx,260,150,1400,210,20,MM_ONT,{glow:8,ea:0.35,fill:"rgba(12,8,26,0.6)"}));withA(ctx,f2*(1-a2),()=>glass(ctx,260,392,1400,290,20,MM_ONT,{glow:8,ea:0.35,fill:"rgba(12,8,26,0.6)"}));
    withA(ctx,f1*(1-a1),()=>{[0,1].forEach(k=>{const y=k?470:222;ctx.fillStyle=rgba(MM_ONT,0.12);for(let i=0;i<3;i++){rr(ctx,300+i*300,y,250-i*40,22,11);ctx.fill();}});});
    withA(ctx,a1,()=>{glass(ctx,260,150,1400,210,20,MM_ONT,{glow:14,ea:0.6,fill:"rgba(12,8,26,0.93)"});T(ctx,"A microcredential is a kind of credential.",300,204,{w:700,size:28});
      const A=mm_pill(ctx,760,296,"Microcredential",MM_ONT,{size:22,r:12,a:fin(t,cR+4.1,0.5),fill:"rgba(34,22,60,0.96)"}),Bb=mm_pill(ctx,1300,296,"Credential",MM_ONT,{size:22,r:12,a:fin(t,cR+4.4,0.5),fill:"rgba(34,22,60,0.96)"});
      mm_link(ctx,A,Bb,"is a kind of",MM_ONT,{p:clamp((t-cR-4.5)/0.7,0,1),size:18,off:22});});
    withA(ctx,a2,()=>{glass(ctx,260,392,1400,290,20,MM_ONT,{glow:14,ea:0.6,fill:"rgba(12,8,26,0.93)"});T(ctx,"A graduate certificate accepts up to four approved microcredentials towards its credit.",300,446,{w:700,size:26});
      const A=mm_pill(ctx,560,540,"Graduate certificate",MM_ONT,{size:22,r:12,a:fin(t,cR+7.1,0.5),fill:"rgba(34,22,60,0.96)"}),Bb=mm_pill(ctx,1300,540,"Microcredential",MM_ONT,{size:22,r:12,a:fin(t,cR+7.4,0.5),fill:"rgba(34,22,60,0.96)"});
      mm_link(ctx,A,Bb,"accepts",MM_ONT,{p:clamp((t-cR-7.5)/0.7,0,1),size:18,off:22});
      [["max 4",8.4],["approved only",9.1],["towards its credit",10.2]].forEach(([s,d],i)=>{const q=fin(t,cR+d,0.4);mm_pill(ctx,760+i*190+(i===2?30:0),628,s,[236,226,255],{size:17,a:q,hi:pulseAt(t,cR+d,1.2),hiCol:MM_ONT,fill:"rgba(34,22,60,0.96)"});});
      withA(ctx,fin(t,cR+10.8,0.5),()=>T(ctx,"a machine can check this",1640,666,{w:600,size:17,align:"right",color:rgba(MM_ONT,1)}));});});
  // the knowledge graph: the university's data, connected to the statements
  if(out1>0)withA(ctx,out1*(1-dimG),()=>{mm_kg(ctx,t,{p:{schema:clamp((t-cG+0.2)/1.2,0,1),data:clamp((t-cG-3.7)/2.2,0,1),links:clamp((t-cG-5.0)/2.4,0,1)},aisha:fin(t,cG+7.6,0.6)*(1-dimG)});
    withA(ctx,fin(t,cG+3.9,0.6),()=>tag(ctx,1560,430,"a knowledge graph",MM_ONT,{align:"center",size:20}));});
  // Aristotle's recipe, made formal
  if(dimG>0)withA(ctx,dimG,()=>{const br=Math.sin(t*0.9);ctx.save();ctx.translate(520,430);ctx.rotate(0.003*br);ctx.translate(-520,-430+1.6*br);sheet(ctx,160,160,720,540,{rot:-0.01});const pl=[["Aristotle: the kind, then what sets it apart",22,226],["A microcredential is",30,318],["a credential,",30,372],["small, with its learning assessed,",30,448],["that can count towards an award.",30,502]];
    pl.forEach(([s,sz,y],i)=>pencilText(ctx,s,214,y,{size:sz,w:i?600:700,p:clamp((t-cA-0.2-i*0.35)/0.8,0,1)}));
    const u1=fin(t,cA+1.8,0.6),u2=fin(t,cA+3.1,0.6);ctx.save();ctx.lineWidth=4;ctx.strokeStyle="rgba(40,90,200,0.85)";ctx.beginPath();ctx.moveTo(214,382);ctx.lineTo(214+tw(ctx,"a credential",30,600)*u1,382);ctx.stroke();
    ctx.strokeStyle="rgba(200,110,20,0.85)";ctx.beginPath();ctx.moveTo(214,458);ctx.lineTo(214+tw(ctx,"small, with its learning assessed,",30,600)*u2,458);ctx.moveTo(214,512);ctx.lineTo(214+tw(ctx,"that can count towards an award.",30,600)*u2,512);ctx.stroke();ctx.restore();
    withA(ctx,u1,()=>T(ctx,"the kind of thing",620,372,{w:700,size:19,color:"rgba(40,90,200,0.95)"}));withA(ctx,u2,()=>T(ctx,"what sets it apart",214,570,{w:700,size:19,color:"rgba(200,110,20,0.95)"}));ctx.restore();
    const fA=fin(t,cA+2.2,0.6);withA(ctx,fA,()=>{glass(ctx,980,160,900,540,20,MM_ONT,{glow:18,ea:0.85,fill:"rgba(12,8,26,0.95)"});T(ctx,"in the ontology",1016,214,{w:700,size:22,color:rgba(MM_ONT,1)});
      // the kind in blue, what sets it apart in amber, as on the sheet; the limit belongs to the certificate, which accepts the microcredentials
      const AP=[255,190,120],fl=[["Microcredential","",0],["  subClassOf    ","Credential",[120,170,255]],["  assessed      ","true",AP],["  volume        ","less than an award",AP],["  countsTowards ","Graduate certificate",AP],["Graduate certificate","",0],["  accepts       ","max 4 approved Microcredential",[236,226,255]]];
      fl.forEach(([a,b,col],i)=>{const q=clamp((t-cA-2.4-i*0.3)/0.5,0,1);if(q<=0)return;withA(ctx,q,()=>{T(ctx,a,1016,288+i*56,{f:"mono",w:500,size:23,color:rgba(b?SOFT:MM_ONT,1)});if(b)T(ctx,b,1016+tw(ctx,a,Math.max(23,phMin(ctx)),500,"mono"),288+i*56,{f:"mono",w:500,size:23,color:rgba(col,1)});});});});
    const ar=fin(t,cA+3.6,0.6);arrowTo(ctx,890,430,972,430,MM_ONT,ar,{p:ar,head:14});withA(ctx,ar,()=>T(ctx,"made formal",932,384,{w:700,size:17,align:"center",color:rgba(MM_ONT,1)}));
    withA(ctx,fin(t,cA+4.3,0.6),()=>tag(ctx,1430,752,"a form a machine can use",MM_ONT,{align:"center",size:20}));});
  vign(ctx,S);});

/* ---------- 5. Ontology or model? ---------- */
// The ontology's concepts (left) and Noor's data model (right) name the same things. The model's boxes become tables and its lines
// keys; the ontology lets a machine conclude what nobody wrote down. One question, asked of both, gets two answers, each right for
// its job. Then the two panels move over for the glossary, and become three cards on one thread: the word, the idea, the records.
const MM_OP={x:80,y:140,w:860,h:650},MM_MP={x:980,y:140,w:860,h:650},MM_C3=[{x:80,y:240,w:560,h:480},{x:680,y:240,w:560,h:480},{x:1280,y:240,w:560,h:480}];
const MM_TL2={cols:["learner_id","name"],rows:[["L-1042","Aisha K."]]},MM_TG2={cols:["cert_id","name"],rows:[["GC-DA","Grad Cert DA"]]},
  MM_TC2={cols:["credential_id","learner_id","kind"],rows:[["C-88","L-1042","micro"],["C-91","L-1042","micro"],["C-95","L-1042","micro"]]},MM_TM2={cols:["credential_id","kind"],rows:[["C-88","micro"]]};
const MM_HELD=[["Data Visualisation",290],["SQL for Analysis",385],["Data Ethics",480]];
scene("model",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),cS=c("same"),cJ=c("jobs"),cM=c("means"),cA=c("aisha"),cT=c("three");setScreen(ctx,S);bg2(ctx);
  const F="rgba(34,22,60,0.96)",WH=[236,243,255];
  // the panels' words leave first; then the panels move over, and the glossary comes in from the left
  const out=1-fin(t,cT-0.9,0.6),u=ease(clamp((t-cT+0.4)/1.3,0,1)),OR=mm_lerpR(MM_OP,MM_C3[1],u),MR=mm_lerpR(MM_MP,MM_C3[2],u),
    gu=ease(clamp((t-cT+0.4)/1.2,0,1)),GR={x:lerp(-620,MM_C3[0].x,gu),y:MM_C3[0].y,w:MM_C3[0].w,h:MM_C3[0].h};
  // each thing lights on both sides as it's named: learners, credentials (and microcredentials), certificates
  const nm=[2.7,3.5,3.5,4.2].map(d=>pulseAt(t,cS+d,1.5));
  const litO=lerp(1-0.4*fin(t,cJ+1.5,0.6)*(1-fin(t,cM-0.4,0.6)),0.35+0.65*fin(t,cT+2.0,0.5),u),litM=lerp(1-0.4*fin(t,cM-0.4,0.6)*(1-fin(t,cA-0.2,0.6)),0.35+0.65*fin(t,cT+4.3,0.5),u);
  // while one panel speaks, the other steps back
  const dO=1-0.45*fin(t,cJ+1.5,0.6)*(1-fin(t,cM-0.4,0.6)),dM=1-0.45*fin(t,cM-0.4,0.6)*(1-fin(t,cA-0.2,0.6));
  ctx.save();
  mm_panel(ctx,OR,"Ontology",MM_ONT,{a:fin(t,0.2,0.6),lit:litO,hi:pulseAt(t,cS+1.0,1.6),sub:"says what things mean",subA:fin(t,cM+0.7,0.5)*out});
  mm_panel(ctx,MR,"Data model",MM_DM,{a:fin(t,cS+0.2,0.6),lit:litM,hi:pulseAt(t,cS+1.0,1.6),right:"owner: Noor, data architect",rightA:fin(t,cS+0.9,0.5)*out,sub:"plans the records the university keeps",subA:fin(t,cJ+2.0,0.5)*out});
  withA(ctx,fin(t,cM+2.1,0.5)*out,()=>{const s="for every system",w=tw(ctx,s,28,700)+26;tag(ctx,OR.x+OR.w-30-w,OR.y+50,s,MM_ONT,{size:28});});
  // the ontology's concepts, carried over from the knowledge graph
  const sA=fin(t,0.3,0.6)*(1-fin(t,cA+0.1,0.6))*out*dO,dimG=1-0.6*fin(t,cM+3.0,0.5)*(1-fin(t,cA-0.6,0.5));
  if(sA>0)withA(ctx,sA,()=>{const CR=mm_pill(ctx,560,300,"Credential",MM_ONT,{size:28,r:12,fill:F,a:fin(t,0.4,0.5),hi:Math.max(nm[1],pulseAt(t,cM+3.9,1.4)),hiCol:nm[1]>0?WH:MM_ONT}),
      MI=mm_pill(ctx,560,460,"Microcredential",MM_ONT,{size:28,r:12,fill:F,a:fin(t,0.5,0.5),hi:Math.max(nm[2],pulseAt(t,cM+3.6,1.4)),hiCol:nm[2]>0?WH:MM_ONT}),
      LR=mm_pill(ctx,190,460,"Learner",MM_ONT,{size:28,r:12,fill:F,a:fin(t,0.6,0.5),hi:Math.max(nm[0],pulseAt(t,cM+4.2,1.4)),hiCol:nm[0]>0?WH:MM_ONT}),
      GC=mm_pill(ctx,560,620,"Graduate certificate",MM_ONT,{size:28,r:12,fill:F,a:fin(t,0.7,0.5)*dimG,hi:nm[3],hiCol:WH});
    mm_link(ctx,MI,CR,"is a kind of",MM_ONT,{p:clamp((t-0.9)/0.6,0,1),size:28,off:118});
    mm_link(ctx,LR,MI,"holds",MM_ONT,{p:clamp((t-1.1)/0.6,0,1),size:28,off:-28});
    withA(ctx,dimG,()=>mm_link(ctx,MI,GC,"counts towards",MM_ONT,{p:clamp((t-1.3)/0.6,0,1),size:28,off:-132}));
    // a conclusion: a microcredential is a kind of credential, so whoever holds one holds a credential. Nobody wrote it down
    const cq=clamp((t-cM-4.4)/0.7,0,1);if(cq>0){glow(ctx,375,380,150,MM_ONT,0.18*pulseAt(t,cM+4.4,2.0));mm_link(ctx,LR,CR,"holds · concluded",MM_ONT,{p:cq,size:28,off:30,dash:[9,8],lw:2.6});}});
  // Aisha, in the knowledge graph: three microcredentials she holds, and a fourth no one has stated, either way
  const aA=fin(t,cA+0.6,0.7)*out;
  if(aA>0)withA(ctx,aA,()=>{const AI=mm_pill(ctx,200,460,"Aisha K.",MM_WARM,{size:28,a:fin(t,cA+0.6,0.5),hi:pulseAt(t,cA+0.9,1.6)});
    MM_HELD.forEach(([s,y],i)=>{const P=mm_pill(ctx,620,y,s,MM_ONT,{size:28,r:12,fill:F,a:fin(t,cA+0.9+i*0.25,0.5)});mm_link(ctx,AI,P,i?null:"holds",MM_WARM,{p:clamp((t-cA-1.0-i*0.25)/0.5,0,1),size:28,off:26,lw:2,head:10});});
    const q4=fin(t,cA+1.9,0.5),h4=pulseAt(t,cA+8.6,1.8),P4=mm_pill(ctx,620,590,"from elsewhere?",[200,205,225],{size:28,r:12,dash:true,a:q4*(0.75+0.25*h4),hi:h4,hiCol:MM_ONT,tc:rgba(SOFT,1)});
    mm_link(ctx,AI,P4,null,[200,205,225],{p:clamp((t-cA-2.0)/0.5,0,1),dash:[7,8],lw:2,head:10,a:0.8});
    withA(ctx,fin(t,cA+6.3,0.5),()=>tag(ctx,510,740,"can't tell: not stated",MM_ONT,{align:"center",size:28}));});
  // the data model: Noor's boxes and lines, which become tables and keys
  const L=mm_tsize(ctx,MM_TL2.cols,MM_TL2.rows),G=mm_tsize(ctx,MM_TG2.cols,MM_TG2.rows),C=mm_tsize(ctx,MM_TC2.cols,MM_TC2.rows);
  const PL=[1010,290],PG=[1430,290],PC=[1250,470],mo=k=>fin(t,cJ+5.3+k*0.3,0.6),dimT=1-0.55*fin(t,cA+0.4,0.6);
  const E={L:{x:PL[0]+L.w/2,y:PL[1]+L.h/2,name:"Learner",s:1.17,col:MM_DM,a:fin(t,cS+2.6,0.5)*(1-mo(0)),hi:nm[0],hiCol:WH},
    C:{x:PC[0]+C.w/2,y:PC[1]+C.h/2,name:"Credential",s:1.17,col:MM_DM,a:fin(t,cS+3.4,0.5)*(1-mo(1)),hi:nm[1],hiCol:WH},
    G:{x:PG[0]+G.w/2,y:PG[1]+G.h/2,name:"Certificate",s:1.17,col:MM_DM,a:fin(t,cS+4.1,0.5)*(1-mo(2)),hi:nm[3],hiCol:WH}};
  const bL=entBox(ctx,E.L),bC=entBox(ctx,E.C),bG=entBox(ctx,E.G);
  withA(ctx,out*dM,()=>{relLine(ctx,bL,bC,"1","*",{f:clamp((t-cS-3.7)/0.6,0,1),a:Math.min(E.L.a,E.C.a),s:1.17,col:MM_DM});
    relLine(ctx,bC,bG,"*","*",{f:clamp((t-cS-4.4)/0.6,0,1),a:Math.min(E.C.a,E.G.a),s:1.17,col:MM_DM});
    ["L","C","G"].forEach(k=>ent(ctx,E[k]));
    withA(ctx,mo(0)*dimT,()=>table(ctx,PL[0],PL[1],"learners",MM_TL2.cols,MM_TL2.rows,{col:MM_DM}));
    withA(ctx,mo(2)*dimT,()=>table(ctx,PG[0],PG[1],"certificates",MM_TG2.cols,MM_TG2.rows,{col:MM_DM}));
    withA(ctx,mo(1),()=>table(ctx,PC[0],PC[1],"credentials",MM_TC2.cols,MM_TC2.rows,{col:MM_DM}));
    // each line, a key: the learner_id in every credential points to one learner
    const kA=fin(t,cJ+6.9,0.5),kx0=PC[0]+C.C[1].x+C.C[1].w/2,kx1=PL[0]+L.C[0].x+L.C[0].w/2,kh=pulseAt(t,cJ+7.0,1.6);
    if(kA>0)withA(ctx,kA*dimT,()=>{ctx.save();ctx.strokeStyle=rgba(REF,0.55+0.45*kh);ctx.lineWidth=2+kh;ctx.shadowColor=rgba(REF,0.8);ctx.shadowBlur=10*kh;
      rr(ctx,PC[0]+C.C[1].x+3,PC[1]+C.hh+3,C.C[1].w-6,C.h-C.hh-6,8);ctx.stroke();rr(ctx,PL[0]+L.C[0].x+3,PL[1]+L.hh+3,L.C[0].w-6,L.h-L.hh-6,8);ctx.stroke();ctx.restore();
      arrowTo(ctx,kx0,PC[1]-6,kx1+20,PL[1]+L.h+8,REF,1,{p:clamp((t-cJ-6.9)/0.6,0,1),head:14,bend:0.08});
      withA(ctx,fin(t,cJ+7.3,0.4),()=>tag(ctx,kx0+48,(PC[1]+PL[1]+L.h)/2,"key",REF,{size:28}));});
    // asked of the tables: no fourth row, so no fourth microcredential
    const nA=fin(t,cA+3.5,0.5),nh=pulseAt(t,cA+5.0,1.6);
    if(nA>0)withA(ctx,nA,()=>{ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(MM_DM,0.5+0.5*nh);ctx.lineWidth=2+nh;rr(ctx,PC[0]+4,PC[1]+C.h+8,C.w-8,C.rh-6,8);ctx.stroke();ctx.restore();
      tag(ctx,1410,740,"no: none is recorded",MM_DM,{align:"center",size:28});});});
  // the same things?
  const eqA=fin(t,cS+5.5,0.5)*(1-fin(t,cA+0.1,0.6)),neq=fin(t,cJ+0.1,0.4);
  if(eqA>0)withA(ctx,eqA,()=>{glow(ctx,960,465,70,WH,0.25+0.25*pulseAt(t,cS+5.6,1.4));ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(960,465,36,0,TAU);ctx.fill();ctx.strokeStyle=rgba(WH,0.8);ctx.lineWidth=2;ctx.stroke();
    T(ctx,"=",960,481,{w:800,size:44,align:"center",color:rgba(WH,1)});if(neq>0){ctx.strokeStyle=rgba(WH,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(974,445);ctx.lineTo(lerp(974,946,neq),lerp(445,485,neq));ctx.stroke();}});
  withA(ctx,fin(t,cA+9.0,0.5)*out,()=>tag(ctx,960,740,"each right, for its job",WH,{align:"center",size:28}));
  // the three cards: the glossary explains the word, the ontology defines the idea, the model plans the records
  const gA=fin(t,cT-0.5,0.6);let tw0=null,tw1=null,tw2=null;
  if(gA>0){mm_panel(ctx,GR,"Glossary",MM_GLO,{a:gA,lit:0.35+0.65*fin(t,cT,0.5),hi:pulseAt(t,cT,1.6),sub:"explains the word",subA:fin(t,cT+0.5,0.5)});
    withA(ctx,fin(t,cT+0.6,0.5),()=>{const x=GR.x+38,y=GR.y;T(ctx,"microcredential",x,y+250,{w:800,size:30,color:rgba(MM_GLO,1)});
      wrapT(ctx,"a small credential, whose learning has been assessed",x,y+300,GR.w-76,{w:600,size:28,lh:38,color:rgba(PARCH,0.95)});
      T(ctx,"owner: Short courses",x,y+440,{w:600,size:28,color:rgba(SOFT,1)});tw0=[x+tw(ctx,"microcredential",30,800)+14,y+240];});}
  if(u>0)withA(ctx,u,()=>{withA(ctx,fin(t,cT+2.6,0.5),()=>T(ctx,"defines the idea",OR.x+38,OR.y+104,{w:600,size:28,color:rgba(SOFT,1)}));
    withA(ctx,fin(t,cT+4.8,0.5),()=>T(ctx,"plans the records",MR.x+38,MR.y+104,{w:600,size:28,color:rgba(SOFT,1)}));
    const oq=fin(t,cT+2.7,0.5);if(oq>0)withA(ctx,oq,()=>{const cx=OR.x+OR.w/2,MI=mm_pill(ctx,cx,OR.y+240,"Microcredential",MM_ONT,{size:28,r:12,fill:F,hi:pulseAt(t,cT+2.2,1.6)}),CR=mm_pill(ctx,cx,OR.y+380,"Credential",MM_ONT,{size:28,r:12,fill:F});
      mm_link(ctx,MI,CR,"is a kind of",MM_ONT,{p:clamp((t-cT-3.0)/0.5,0,1),size:28,off:-118});tw1=[MI.x-MI.w/2-8,MI.y];tw2=[MI.x+MI.w/2+8,MI.y];
      // the meaning has the word's owner, in the glossary and in the ontology alike; the model is Noor's (Keeping it true: who approves what)
      T(ctx,"owner: Short courses",OR.x+38,OR.y+440,{w:600,size:28,color:rgba(SOFT,1)});});
    // the model's record of the same idea: a credential of kind micro, its row level with the word and the concept
    const mq=fin(t,cT+4.9,0.5);if(mq>0)withA(ctx,mq,()=>{const M=mm_tsize(ctx,MM_TM2.cols,MM_TM2.rows),x=MR.x+38,y=MR.y+240-M.hh-M.rh*1.5;table(ctx,x,y,"credentials",MM_TM2.cols,MM_TM2.rows,{col:MM_DM});
      const rx=x+M.C[1].x,ry=y+M.hh+M.rh*1.5,hk=Math.max(pulseAt(t,cT+4.7,1.6),0.6*fin(t,cT+6.5,0.4));if(hk>0){ctx.save();ctx.strokeStyle=rgba(WH,0.85*hk);ctx.lineWidth=2.4;rr(ctx,rx+3,ry-M.rh/2+3,M.C[1].w-6,M.rh-6,8);ctx.stroke();ctx.restore();}
      T(ctx,"owner: Noor, data architect",MR.x+38,MR.y+440,{w:600,size:28,color:rgba(SOFT,1)});
      if(tw1)mm_hthread(ctx,tw0?[[tw0,tw1],[tw2,[x-8,ry]]]:[[tw2,[x-8,ry]]],clamp((t-cT-5.6)/1.0,0,1),t,WH);});});
  ctx.restore();
  // what the picture asks, then the question both are asked, then what it all comes to
  withA(ctx,fin(t,cS+5.4,0.5)*(1-fin(t,cJ+0.4,0.4)),()=>tag(ctx,960,82,"the same things?",WH,{align:"center",size:28}));
  withA(ctx,fin(t,cJ+0.7,0.5)*(1-fin(t,cA+0.1,0.4)),()=>tag(ctx,960,82,"different jobs",WH,{align:"center",size:28}));
  withA(ctx,fin(t,cA+0.5,0.5)*(1-fin(t,cT-0.8,0.5)),()=>{const s="Does Aisha hold a fourth microcredential?",w=tw(ctx,s,30,700)+64;glow(ctx,960,88,w*0.45,MM_WARM,0.1);
    glass(ctx,960-w/2,52,w,72,20,MM_WARM,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,s,960,99,{w:700,size:30,align:"center",color:rgba(INK,1)});});
  withA(ctx,fin(t,cT+6.2,0.6),()=>tag(ctx,960,150,"one idea, three jobs",WH,{align:"center",size:28}));
  vign(ctx,S);});

/* ---------- 6. The semantic layer ---------- */
scene("semantic",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cO=c("once"),cT=c("tools"),cP=c("open");
  const rows=[4.1,4.8,5.9,6.9].map(d=>fin(t,cO+d,0.5)),rh=[4.1,4.8,5.9,6.9].map(d=>pulseAt(t,cO+d,1.4));
  const mx=620,my=150,mw=680,mh=470;mm_metric(ctx,mx,my,mw,mh,{a:fin(t,cO+0.6,0.7),rows,rowHi:rh,hi:pulseAt(t,cO+3.3,1.8)+pulseAt(t,cT+2.0,1.6)*0.6,num:"11,890",numA:fin(t,cT+2.2,0.5)});
  // the tools: each once wrote its own version; now each asks the one definition
  const ask=k=>fin(t,cT+1.7+k*0.35,0.6),old=k=>fin(t,cT+2.2+k*0.35,0.5);
  mm_dash(ctx,110,170,400,250,ask(0)>0.5?"11,890":"12,140",ask(0)>0.5?[39,124,67]:[200,45,76],{a:fin(t,cT-0.2,0.5),old:"own SQL: 12,140",oldA:old(0)});
  mm_xls(ctx,110,480,400,220,ask(1)>0.5?"11,890":"11,702",ask(1)>0.5?[39,124,67]:[200,45,76],{a:fin(t,cT+0.4,0.5),old:"own formula: 11,702",oldA:old(1)});
  const gA=fin(t,cT+1.1,0.5);mm_genie(ctx,1590,290,t,{a:gA});withA(ctx,gA,()=>{bubble(ctx,1420,470,380,(ask(2)>0.5?"11,890":"12,960")+" credentials",ask(2)>0.5?GOOD:BAD,{size:26});
    withA(ctx,old(2),()=>{const s="own guess: 12,960",gs=Math.max(15,phMin(ctx));T(ctx,s,1446,606,{f:"mono",w:500,size:15,color:rgba(BAD,1)});ctx.strokeStyle=rgba(BAD,1);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1442,606-gs*0.3);ctx.lineTo(1450+tw(ctx,s,gs,500,"mono"),606-gs*0.3);ctx.stroke();});});
  [[510,295,mx,300],[510,590,mx,470],[1440,330,mx+mw,300]].forEach(([x0,y0,x1,y1],k)=>{const p=ask(k);if(p>0)arrowTo(ctx,x0+(k===2?0:10),y0,x1+(k===2?10:-10),y1,MM_SEM,0.9,{p,head:14,bend:k===1?0.1:-0.05});});
  withA(ctx,fin(t,cT+2.6,0.6),()=>T(ctx,"one definition, every tool",960,122,{w:700,size:22,align:"center",color:rgba(MM_SEM,1)}));
  // open formats: the definition itself, shared between tools
  const oA=fin(t,cP+0.2,0.7),dy=lerp(-120,0,ease(oA));withA(ctx,oA,()=>{const x=600,y=640+dy,lh=Math.max(28,phMin(ctx)*1.3);glass(ctx,x,y,640,58+lh*4,14,MM_SEM,{glow:14,ea:0.8,fill:"rgba(6,14,30,0.96)"});T(ctx,"credentials_awarded · definition",x+22,y+36,{f:"mono",w:500,size:16,color:rgba(MM_SEM,1)});
    ["measure  count(credential)","exclude  revoked","time     awarded_on · academic year","grain    one credential awarded"].forEach((s,i)=>T(ctx,s,x+22,y+40+lh*(i+1),{f:"mono",w:500,size:16,color:rgba(INK,0.9)}));});
  withA(ctx,fin(t,cP+1.6,0.6),()=>tag(ctx,1270,748,"open formats are appearing",MM_SEM,{size:20}));
  vign(ctx,S);});

/* ---------- 7. Standards ---------- */
scene("standards",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cB=c("blank"),cC=c("creds"),cT=c("three"),cH=c("choose"),o3=fin(t,cT-0.3,0.7),oH=fin(t,cH-0.3,0.7);
  // a blank page, then the shelf of published models
  const bp=fin(t,cB+2.6,0.8);if(bp<1)withA(ctx,fin(t,0.2,0.6)*(1-bp),()=>{sheet(ctx,760-bp*300,190,400,520,{plain:true});if(Math.floor(t*2)%2===0){ctx.fillStyle="rgba(40,40,40,0.8)";ctx.fillRect(820-bp*300,250,3,34);}});
  if(o3<1)withA(ctx,1-o3,()=>{mm_shelf(ctx,t,108,190,{ga:[3.2,3.7,4.1,4.5,6.8].map(d=>fin(t,cB+d,0.5)),hi:[0,0,0,0,pulseAt(t,cB+6.9,2.2)+pulseAt(t,cC+0.2,1.8)]});
    // digital credentials: their own open standards
    const dA=fin(t,cC-0.2,0.6);withA(ctx,dA,()=>{T(ctx,"DIGITAL CREDENTIALS",180,520,{f:"mono",w:500,size:16,color:rgba(MM_REFC,1)});
      ["W3C Verifiable Credentials","Open Badges","European Learning Model"].forEach((s,i)=>withA(ctx,fin(t,cC+0.3+i*0.35,0.4),()=>tag(ctx,180,570+i*64,s,MM_REFC,{size:22})));
      const hl={issuer:fin(t,cC+2.7,0.4),holder:fin(t,cC+3.2,0.4),evidence:fin(t,cC+3.8,0.4)};mm_vc(ctx,860,470,760,{a:fin(t,cC+0.6,0.5),hl,rh:50,sub:"what the standards name",vals:{issuer:"the university",holder:"Aisha K.",claim:"Data Visualisation",evidence:"assessed project",status:"valid"}});});});
  // three official definitions of one word
  if(o3>0)withA(ctx,o3*(1-oH),()=>{withA(ctx,fin(t,cT+0.2,0.6),()=>{T(ctx,"“microcredential”: three official definitions",960,112,{w:700,size:26,align:"center",color:rgba(INK,0.95)});});
    MM_DEFS.forEach((d,i)=>mm_def(ctx,50+i*614,150,590,500,d,{rh:96,a:fin(t,cT+0.5+i*0.25,0.6),hA:fin(t,cT+[2.4,3.6,4.7][i],0.5),p:clamp((t-cT-[2.6,3.8,4.9][i])/1.0,0,1),diff:fin(t,cT+5.8,0.6),same:fin(t,cT+6.6,0.6)}));
    withA(ctx,fin(t,cT+6.2,0.6),()=>tag(ctx,960,700,"same word, different edges",EXT,{align:"center",size:22}));});
  // choose deliberately: check, adopt, extend, record, at every layer
  if(oH>0)withA(ctx,oH,()=>{const steps=[["1  Check",REF,1.1],["2  Adopt",ADOPT,1.7],["3  Extend",EXT,2.2],["4  Record",[236,243,255],2.7]];
    steps.forEach(([s,col,d],i)=>withA(ctx,fin(t,cH+d,0.4),()=>{const x=510+i*300,hi=pulseAt(t,cH+d,1.4);glow(ctx,x,170,80,col,0.25+0.4*hi);tag(ctx,x,170,s,col,{align:"center",size:24});}));
    withA(ctx,fin(t,cH+3.2,0.6),()=>T(ctx,"from A Sharper Sketch",960,232,{w:600,size:18,align:"center",color:rgba(SOFT,1)}));
    ctx.save();ctx.translate(480,300);ctx.scale(0.5,0.5);mm_stack(ctx,t,{a:[0,1,2,3].map(k=>fin(t,cH+0.3+k*0.15,0.5)),bare:true,inner:(cx,k,x,y,w,h)=>{T(cx,MM_L[k].n,x+60,y+88,{w:800,size:50,color:rgba(MM_L[k].c,1)});
      [REF,ADOPT,EXT,[236,243,255]].forEach((col,j)=>{const q=fin(t,cH+5.0+k*0.22+j*0.08,0.35);if(q<=0)return;const px=x+w-420+j*110,py=y+h/2;glow(cx,px,py,60,col,0.5*q);cx.fillStyle=rgba(col,q);cx.beginPath();cx.arc(px,py,20,0,TAU);cx.fill();cx.fillStyle="rgba(255,255,255,"+(0.8*q)+")";cx.beginPath();cx.arc(px-6,py-6,6,0,TAU);cx.fill();});}});ctx.restore();
    withA(ctx,fin(t,cH+5.0,0.6),()=>tag(ctx,960,770,"at every layer",[236,243,255],{align:"center",size:22}));});
  vign(ctx,S);});

/* ---------- 8. Genie, again ---------- */
scene("again",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cA=c("asks"),cN=c("answer"),cE=c("evid");
  mm_asker(ctx,t,fin(t,0.2,0.6),fin(t,0.5,0.6),{qy:150,pose:t<cA+2.0||(t>cA+4.8&&t<cA+6.4)?"explain":"stand",expr:t>cN+0.6?"relieved":"calm"});
  const gx=760,gy=470;mm_genie(ctx,gx,gy,t,{a:fin(t,0.4,0.6),sub:"reads the meaning"});
  withA(ctx,fin(t,cA+2.3,0.5),()=>{tag(ctx,880,112,"Genie asks back",MM_GEN,{size:18});bubble(ctx,860,140,640,"Approved for stacking, or all microcredentials?",MM_GEN,{size:28});});
  withA(ctx,fin(t,cA+4.9,0.5),()=>bubble(ctx,300,352,380,"Approved for stacking.",MM_ASK,{size:26}));
  // the answer, and the definition it used
  const nA=fin(t,cN+0.2,0.5);withA(ctx,nA,()=>{glow(ctx,1060,400,240,GOOD,0.14+0.06*Math.sin(t*2));numCard(ctx,860,300,400,"Genie",fmtNum(countTo(t,cN+0.3,0,132)),"matches the registrar's list",GOOD);});
  withA(ctx,fin(t,cN+1.1,0.6),()=>{glass(ctx,1290,300,560,250,18,MM_GEN,{glow:14,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(ctx,"the definition it used",1316,340,{w:700,size:19,color:rgba(SOFT,1)});
    wrapT(ctx,"one away: holds 3 approved microcredentials; four complete a graduate certificate",1316,380,510,{w:700,size:22,lh:29});
    tag(ctx,1316,482,"ontology · stacking rule",MM_ONT,{size:16});tag(ctx,1316,524,"semantic layer · near a certificate",MM_SEM,{size:16});});
  // grounded or not: qualitative, not to scale
  const eA=fin(t,cE+0.3,0.6);withA(ctx,eA,()=>{const x=900,y=590,w=950;glass(ctx,x,y,w,210,18,[236,243,255],{glow:10,ea:0.5,fill:"rgba(7,12,24,0.94)"});T(ctx,"how often the answer is right",x+26,y+38,{w:700,size:19,color:rgba(SOFT,1)});
    const b1=ease(clamp((t-cE-1.0)/1.2,0,1)),b2=ease(clamp((t-cE-1.6)/1.8,0,1));
    [["tables only",BAD,0.28,b1,"guesses"],["tables + meaning",GOOD,0.78,b2,"grounded"]].forEach(([l,col,f,p,e],i)=>{const yy=y+84+i*58;T(ctx,l,x+26,yy+8,{w:700,size:22});ctx.fillStyle="rgba(255,255,255,0.05)";rr(ctx,x+260,yy-16,600,32,8);ctx.fill();
      ctx.fillStyle=rgba(col,0.85);rr(ctx,x+260,yy-16,Math.max(8,600*f*p),32,8);ctx.fill();withA(ctx,fin(p,0.8,0.2),()=>T(ctx,e,x+274+600*f*p,yy+8,{w:700,size:19,color:rgba(col,1)}));});
    T(ctx,"illustrative · not to scale",x+w-24,y+195,{f:"mono",w:500,size:18,align:"right",color:rgba(SOFT,1)});});
  withA(ctx,fin(t,cE+6.0,0.6),()=>tag(ctx,1375,836,"the difference is the meaning it can read",[236,243,255],{align:"center",size:20}));
  vign(ctx,S);});

/* ---------- 9. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cT=c("tri"),cN=c("next"),cx=960,cy=430,wx=660,wy=600,ix=960,iy=240,hx=1260,hy=600;
  // the triangle from What's in a word, remembered, then filled in
  withA(ctx,fin(t,cT+0.2,0.8)*(1-fin(t,cT+8.4,0.8)),()=>{ctx.save();ctx.setLineDash([8,10]);ctx.strokeStyle=rgba(KIND,0.7);ctx.lineWidth=2.4;ctx.shadowColor=rgba(KIND,0.6);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(ix,iy);ctx.lineTo(hx,hy);ctx.stroke();ctx.restore();
    [[wx,wy,"word",cT+2.9],[ix,iy,"idea",cT+5.0],[hx,hy,"thing",cT+7.9]].forEach(([x,y,l,t1],i)=>withA(ctx,fin(t,cT+0.5+i*0.4,0.5)*(1-fin(t,t1-0.2,0.4)),()=>{glow(ctx,x,y,60,KIND,0.4+0.15*Math.sin(t*2+i));ctx.fillStyle=rgba(KIND,0.9);ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill();T(ctx,l,x,y+(i===1?-26:44),{w:700,size:24,align:"center",color:rgba(KIND,1)});}));
    withA(ctx,fin(t,cT+0.6,0.6)*(1-fin(t,cT+2.7,0.5)),()=>T(ctx,"from What's in a word",960,560,{w:600,size:22,align:"center",color:rgba(SOFT,1)}));});
  const wa=fin(t,cT+2.9,0.5),ia=fin(t,cT+5.0,0.6),ha=fin(t,cT+7.9,0.6);
  trio(ctx,cx,cy,1,{t,col:MM_ONT,word:"credential",wordLab:" ",idea:"Credential",thing:(c2,x,y,s)=>{const L=mm_cols(c2,["id","holder","kind"],[["C-88","Aisha K.","micro"],["C-91","Aisha K.","micro"],["A-12","Ben O.","award"]]),w=L[2].x+L[2].w;table(c2,x-w/2,y-104,"credentials",["id","holder","kind"],[["C-88","Aisha K.","micro"],["C-91","Aisha K.","micro"],["A-12","Ben O.","award"]],{col:[150,225,255]});},
    thingLab:"the data it points to",thingDy:146,e1:clamp((t-cT-5.2)/1.0,0,1),e2:clamp((t-cT-7.5)/1.0,0,1),e3:0,wa,ia,ha});
  withA(ctx,fin(t,cT+4.6,0.5),()=>{const w=tw(ctx,"credencial",26,800)+40;glass(ctx,wx-w/2,wy+44,w,50,12,MM_ONT,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.93)"});T(ctx,"credencial",wx,wy+78,{w:800,size:26,align:"center"});
    T(ctx,"en",wx-tw(ctx,"credential",30,800)/2-50,wy+10,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});T(ctx,"es",wx-w/2-26,wy+76,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});T(ctx,"the word",wx,wy+132,{w:700,size:20,align:"center",color:rgba(SOFT,1)});});
  // the idea, now a node in the ontology
  withA(ctx,ia,()=>{const A=mm_pill(ctx,700,128,"Award",MM_ONT,{size:16,r:10,a:fin(t,cT+5.6,0.5)}),M=mm_pill(ctx,1220,128,"Microcredential",MM_ONT,{size:16,r:10,a:fin(t,cT+5.9,0.5)});
    [A,M].forEach((b,i)=>{const q=fin(t,cT+5.8+i*0.3,0.5);if(q>0)isa(ctx,b.x+(i?-b.w/2-4:b.w/2+4),b.y+6,ix+(i?34:-34),iy-8,q,MM_ONT,{fill:"#0a0a18",s:12,lw:1.8});});
    T(ctx,"now written in the ontology",ix+44,iy+10,{w:600,size:18,color:rgba(SOFT,1)});});
  withA(ctx,fin(t,cN+0.3,0.6)*(1-fin(t,B,0.5)),()=>T(ctx,"Next: keeping it true",960,810,{w:700,size:26,align:"center",color:rgba(SOFT,1)}));
  endCard(ctx,S,t,B+0.3,"Meaning machines can read",MM_INK,"An assistant answers from the meaning it can read.");
  vign(ctx,S);});
