/* ===== Why it moves: scenes =====
   Ten chapters, as in ../script.md. The 1965 blackout: one fault, no one seeing the whole, and rules for all; three letters pulling
   the utility three ways; who cares (stakeholders); what pushes (drivers); what it means here (assessments, each with a source);
   what must become true (goals) and how anyone will know (outcomes); goals pulling apart over a new line; principles that can be
   tested, and two options checked against them; the chain, and the questions an outcome leaves for data; and an answer, for now.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The motivation layer's cards are drawn large
   enough to read without the camera; the camera moves in on the relay at Niagara, then pulls back, and on one outcome in chapter 9.
   Motion (In the weeds of data crafting's helpers): every shot drifts slowly and things arrive with a spring. Sound: every effect
   in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. The night the lights went out ---------- */
scene("blackout",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t,{light:0.05});
  const tF=w("relay","switched off"),tS=w("spread","spread"),cW=c("watched"),cC=c("council"),cH=c("chain"),relit=fin(t,B,2.0);
  eaYear(ctx,90,90,"9 November 1965 · Niagara Falls",CLAY,fin(t,0.3,0.6));
  ctx.save();drift(ctx,t,sc,{z:0.02,y:500});const K=[[0,700,500,1.6],[tS-0.6,1080,500,1]];focus(ctx,t,K);
  const off=i=>clamp((t-(tS+D3_HOP[i]*0.55))/0.5,0,1)*(1-relit),dim=1-0.7*fin(t,cC-0.2,0.8)*(1-relit);
  withA(ctx,dim,()=>{d3_grid(ctx,t,off,{a:fin(t,0.1,1.0),areas:fin(t,w("watched","its own"),0.6)*(1-fin(t,cC,0.6))});
    arrive(ctx,560,560,t,0.6,()=>{ctx.strokeStyle="rgba(222,170,112,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(624,516);ctx.lineTo(708,476);ctx.stroke();d3_relay(ctx,560,560,74,clamp((t-tF)/0.6,0,1),1);
      T(ctx,"a relay",560,672,{w:700,size:30,align:"center",color:rgba(PARCH,1)});},{dy:12});
    withA(ctx,fin(t,0.8,0.6),()=>T(ctx,"Niagara Falls",748,446,{w:700,size:30,color:rgba(PARCH,1)}));});
  ctx.restore();
  // what the night showed, said over the map
  arrive(ctx,1500,190,t,w("spread","Thirty million"),()=>withA(ctx,1-fin(t,cC-0.3,0.5),()=>tag(ctx,1500,190,"30 million people",[255,190,120],{align:"center",size:34})),{dy:12});
  arrive(ctx,960,880,t,w("watched","its own")+0.2,()=>withA(ctx,1-fin(t,cC-0.3,0.5),()=>tag(ctx,960,860,"each saw only its own wires",PARCH,{align:"center",size:32})),{dy:12});
  const bk=fin(t,w("council","wrote"),0.6)*(1-relit);
  arrive(ctx,960,520,t,w("council","wrote")-0.1,()=>withA(ctx,1-relit,()=>{d3_book(ctx,800,330,320,400,1);tag(ctx,960,790,"rules for all of them to keep",TRUST,{align:"center",size:32});}),{dy:24,from:0.94});
  [["a shock","A shock",300],["what it revealed","what it revealed",720],["what had to become true","what had to become",1180],["a rule to hold to","a rule to hold",1630]].forEach(([s_,k,x])=>arrive(ctx,x,200,t,w("chain",k),()=>withA(ctx,1-relit,()=>tag(ctx,x,200,s_,TRUST,{align:"center",size:30})),{dy:12}));
  fadeIn(ctx,S,t);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"Why it moves","what pushes, and what holds",EAC,"Film 3 of 11 · enterprise architecture, for data");});

/* ---------- 2. Three letters ---------- */
// each letter: x, heading, lines, the words that bring each line up, the line that brings it
const D3_LET=[[330,"Statement of expectations",["lower bills","a dividend","net zero by 2045"],["lower bills","a dividend","net zero"],"minister"],
  [810,"Regulator's decision",["network revenue cut","2026–2031"],["cut","next five"],"regulator"],
  [1290,"Community objection",["no new line","through our valley"],["objects","new line"],"valley"]];
scene("letters",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const cR=c("right"),pull=ease(fin(t,w("right","pull"),1.2));
  person(ctx,"tomas",160,1030,0.8,{t,pose:t<c("note")+2.2?"explain":"stand"});
  arrive(ctx,1060,160,t,0.3,()=>sticky(ctx,1060,160,420,120,"Why must it change?",{col:NOTEC[0],size:34,st:0,rot:-0.02}),{dy:-30});
  // the utility, pulled three ways once every letter has had its say
  const bx=1050+Math.sin(t*5.3)*6*pull,by=790+Math.sin(t*4.1)*5*pull;
  D3_LET.forEach(([x,head,lines,keys,lid],i)=>{const t0=c(lid)-0.3,dx=(i-1)*70*pull;if(t<t0)return;const th=fin(t,c(lid)+0.4,0.8);
    withA(ctx,th,()=>{ctx.save();ctx.strokeStyle=rgba(MOT,0.8);ctx.lineWidth=3+2*pull;ctx.beginPath();ctx.moveTo(x+dx+220,620);ctx.quadraticCurveTo(lerp(x+dx+220,bx,0.5),720-40*pull,bx+(i-1)*40,by-60);ctx.stroke();ctx.restore();});
    arrive(ctx,x+220+dx,450,t,t0,()=>d3_letter(ctx,x+dx,300,440,320,head,lines,{rot:(i-1)*0.012,lit:keys.map(k=>fin(t,w(lid,k)-0.1,0.4))}),{dy:30,from:0.95});});
  arrive(ctx,1050,790,t,c("minister")+0.6,()=>d3_badge(ctx,bx,by,64,{}),{dy:16});
  ctx.restore();
  arrive(ctx,1430,800,t,w("right","right"),()=>tag(ctx,1180,800,pull>0.3?"each one right · pulling apart":"each one right",MOT,{size:32}),{dy:10});
  vign(ctx,S);});

/* ---------- 3. Who cares ---------- */
const D3_STK=[["customers","Farah's canvases",410,300,"customers"],["the minister","owns it",880,300,"minister"],["the regulator","sets its prices",1350,300,"regulator"],
  ["the community","lives beside its lines",640,560,"community"],["the staff","keep it running",1110,560,"staff"]];
scene("cares",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const cA=c("ama"),cS=c("stakeholder");
  arrive(ctx,1760,800,t,w("ama","Ama")-0.3,()=>{person(ctx,"ama",1760,1030,0.8,{t,pose:t>w("ama","starts")&&t<w("ama","starts")+2.2||t>cS&&t<cS+2?"explain":"stand"});tag(ctx,1660,540,"Ama · regulatory lead",TRUST,{align:"center",size:28});},{dy:20,from:0.96});
  arrive(ctx,880,120,t,w("ama","who cares"),()=>T(ctx,"who cares",880,132,{w:800,size:40,align:"center",color:rgba(PARCH,1)}),{dy:12});
  D3_STK.forEach(([n,l,x,y,k],i)=>{const t0=i===0?c("customers"):w(i<3?"others":"others",i===1?"minister":i===2?"regulator":i===3?"community":"staff")-0.2;
    arrive(ctx,x,y,t,t0,()=>{if(i===0)[[-120,-92],[-40,-100],[40,-96],[120,-90]].forEach(([dx,dy],j)=>sticky(ctx,x+dx,y+dy,90,70,"",{col:NOTEC[2],rot:(j-1.5)*0.08}));
      d3_card(ctx,x,y,420,150,"stakeholder",n,l,{hi:pulseAt(t,t0+0.2,1.6)});},{dy:-24,from:1.06});});
  arrive(ctx,880,770,t,w("stakeholder","stakeholder"),()=>tag(ctx,880,770,"stakeholder: anyone with an interest in what it does",MOT,{align:"center",size:30}),{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. What pushes ---------- */
// each driver: name, line, where it sits, the line and word that bring it
const D3_DRV=[["decarbonisation","net zero by 2045",380,290,"list","Decarbonisation"],["affordability","bills up, incomes not",1540,290,"list","Affordability"],
  ["ageing assets","poles and wires, built long ago",380,760,"list","Ageing"],["rooftop solar","customers become generators",1540,760,"solar","rooftop solar"]];
scene("pushes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:500});
  const cP=c("pressure");let push=0;
  D3_DRV.forEach(([n,l,x,y,lid,k])=>{const t0=w(lid,k)-0.1,q=fin(t,t0+0.3,0.8);if(q<=0)return;const s=0.5+0.5*Math.sin((t-t0)*2.4);push+=q*s;
    const dx=960-x,dy=520-y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,x0=x+ux*250,y0=y+uy*110,x1=960-ux*(110+10*s),y1=520-uy*(110+10*s);
    arrowTo(ctx,x0,y0,x1,y1,MOT,0.9,{p:q,lw:6,head:18});});
  const wob=Math.min(1,push*0.35);
  arrive(ctx,960,520,t,0.3,()=>d3_badge(ctx,960+Math.sin(t*6)*4*wob,520+Math.cos(t*5)*4*wob,90,{label:"the utility"}),{dy:16});
  D3_DRV.forEach(([n,l,x,y,lid,k])=>{const t0=w(lid,k)-0.1;arrive(ctx,x,y,t,t0,()=>d3_card(ctx,x,y,480,140,"driver",n,l,{hi:pulseAt(t,t0+0.2,1.6)}),{dy:-24,from:1.06});});
  ctx.restore();
  arrive(ctx,960,90,t,w("then","drivers"),()=>tag(ctx,960,90,t>w("pressure","pressure")?"driver: a pressure, not a wish":"drivers",MOT,{align:"center",size:32}),{dy:10});
  vign(ctx,S);});

/* ---------- 5. What it means here ---------- */
const D3_ASM=[["bills up 18% in two years","annual report",720,"bills","rose"],["a third of poles over 50 years old","asset register, 2025",1180,"poles","third"],["built for one-way flow","network planning review",1640,"flow","built"]];
scene("means",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const cO=c("opinion"),gone=fin(t,cO+1.4,0.8);
  D3_DRV.forEach(([n],i)=>arrive(ctx,260+i*460,200,t,0.2+i*0.12,()=>d3_card(ctx,260+i*460,200,420,110,"driver",n,null,{size:30}),{dy:-16}));
  D3_ASM.forEach(([s_,src,x,lid,k])=>{const t0=w(lid,k)-0.3,q=fin(t,t0,0.6);if(q<=0)return;
    withA(ctx,q,()=>{ctx.strokeStyle=rgba(MOT,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,255);ctx.lineTo(x,375);ctx.stroke();});
    arrive(ctx,x,470,t,t0,()=>d3_card(ctx,x,470,420,190,"assessment",s_,null,{size:30,src,srcA:fin(t,t0+0.5,0.4)}),{dy:-24,from:1.06});});
  // an opinion, with no source
  arrive(ctx,260,470,t,w("opinion","Without")-0.2,()=>withA(ctx,1-gone,()=>{d3_card(ctx,260,470,420,190,"assessment","customers don't care about climate",null,{size:30});
    kt_rstamp(ctx,260,480,"no source",[200,60,60],fin(t,w("opinion","opinion")-0.2,0.3),fin(t,w("opinion","opinion"),0.35),{size:40,rot:-0.12});}),{dy:-24,from:1.06});
  ctx.restore();
  arrive(ctx,960,70,t,w("source","assessment"),()=>tag(ctx,960,70,"assessment: what it means here",MOT,{align:"center",size:32}),{dy:10});
  arrive(ctx,960,760,t,w("opinion","opinion")+0.3,()=>tag(ctx,960,760,"no source, no assessment",[255,140,120],{align:"center",size:32}),{dy:12});
  vign(ctx,S);});

/* ---------- 6. What must become true ---------- */
const D3_GOAL=[["keep bills affordable",380,"Keep bills"],["replace assets before they fail",960,"Replace"],["connect renewable power",1540,"Connect"]];
scene("goals",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const cD=c("direction"),cK=c("check");
  D3_GOAL.forEach(([s_,x,k])=>{const t0=w("list",k)-0.1;arrive(ctx,x,230,t,t0,()=>d3_card(ctx,x,230,480,140,"goal",s_,null,{hi:pulseAt(t,t0+0.2,1.6)}),{dy:-24,from:1.06});});
  const OUT=[[380,"network charge no higher in real terms","by 2030",c("charge")],[1540,"new solar connected within 10 working days",null,c("days")],[960,"a better network",null,w("check","If no one")]];
  OUT.forEach(([x,s_,l,t0],i)=>{const q=fin(t,t0+0.2,0.7);if(q<=0)return;arrowTo(ctx,x,305,x,410,MOT,0.85,{p:q,lw:3,head:12});
    arrive(ctx,x,510,t,t0,()=>{d3_card(ctx,x,510,480,190,"outcome",s_,l,{size:30});if(i===2)kt_rstamp(ctx,x,612,"how would anyone check?",[200,60,60],fin(t,w("check","checked")-0.2,0.3),fin(t,w("check","checked"),0.35),{size:34,rot:-0.1});},{dy:-24,from:1.06});});
  ctx.restore();
  arrive(ctx,960,70,t,w("now","Goals"),()=>tag(ctx,960,70,"goals",MOT,{align:"center",size:32}),{dy:10});
  arrive(ctx,560,740,t,w("direction","direction"),()=>tag(ctx,560,740,"goal: a direction",MOT,{align:"center",size:30}),{dy:12});
  arrive(ctx,1300,740,t,w("direction","An outcome"),()=>tag(ctx,1300,740,"outcome: how anyone will know",MOT,{align:"center",size:30}),{dy:12});
  vign(ctx,S);});

/* ---------- 7. When goals pull apart ---------- */
scene("collide",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const still=fin(t,B,1.2),tug=fin(t,w("collide","collide"),0.8)*(1-still);
  let knot=[960,540];arrive(ctx,960,400,t,0.2,()=>{knot=d3_valley(ctx,160,170,1600,500,t,clamp((t-w("collide","new line"))/1.4,0,1));},{d:1.0,from:0.97});
  const pulls=[[420,770,"goal","keep bills affordable",null,w("cost","costs money")],[960,820,"stakeholder","the community","no new line through our valley",w("cost","through the valley")],[1500,770,"goal","connect renewable power",null,w("collide","Connecting")]];
  let kx=knot[0],ky=knot[1];pulls.forEach(([x,y,,,,t0],i)=>{const q=fin(t,t0,0.6)*tug,s=Math.sin(t*3.1+i*2.1);kx+=(x-knot[0])*0.07*q*(0.5+0.5*s);ky+=(y-knot[1])*0.07*q*(0.5+0.5*s);});
  pulls.forEach(([x,y,k,n,l,t0],i)=>{const q=fin(t,t0,0.6);if(q<=0)return;withA(ctx,q,()=>{ctx.save();ctx.strokeStyle="rgba(150,120,80,0.95)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(kx,ky);ctx.quadraticCurveTo((kx+x)/2,(ky+y)/2+30*(1-tug),x,y-70);ctx.stroke();ctx.restore();});
    arrive(ctx,x,y,t,t0,()=>d3_card(ctx,x,y,i===1?520:440,i===1?150:120,k,n,l,{size:30}),{dy:24,from:1.06});});
  ctx.fillStyle="rgba(150,120,80,1)";ctx.beginPath();ctx.arc(kx,ky,10,0,TAU);ctx.fill();
  ctx.restore();
  arrive(ctx,960,70,t,w("loudest","loudest"),()=>withA(ctx,1-fin(t,w("loudest","principles")-0.3,0.4),()=>tag(ctx,960,70,t>w("loudest","another way")?"decided by the loudest? the next one goes another way":"decided by the loudest?",[255,140,120],{align:"center",size:30})),{dy:10});
  arrive(ctx,960,90,t,w("loudest","principles"),()=>{glow(ctx,960,80,180,MOT,0.18);T(ctx,"principles",960,100,{w:800,size:56,align:"center",color:rgba(MOT,1)});},{dy:10,from:0.9});
  vign(ctx,S);});

/* ---------- 8. Principles that can be tested ---------- */
const D3_PR=[["use what we have before we build",340,"have","Use what"],["cost every option for the customers who pay",960,"costed","Every option"],["customer information stays with the business that collected it",1580,"info","customer information"]];
// how each option fares against each principle: 1 a tick, -1 a cross, 0 it doesn't apply
const D3_OPT=[["a new line through the valley",600,[-1,1,0]],["upgrade the old line, add batteries",1320,[1,1,0]]];
scene("principles",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const cC=c("checked"),sus=fin(t,cC-0.4,0.6);
  D3_PR.forEach(([s_,x,lid,k],i)=>{const t0=w(lid,k)-0.1;arrive(ctx,x,240,t,t0,()=>{d3_card(ctx,x,240,560,180,"principle",s_,null,{size:30,hi:pulseAt(t,t0+0.2,1.6)});T(ctx,String(i+1),x-268,132,{w:800,size:32,color:rgba(MOT,1)});},{dy:-24,from:1.06});});
  arrive(ctx,960,460,t,w("sustain","Be sustainable")-0.1,()=>withA(ctx,1-sus,()=>{d3_card(ctx,960,460,480,110,"principle","be sustainable",null,{size:30});
    kt_rstamp(ctx,960,530,"nothing could fail it",[200,60,60],fin(t,w("sustain","nothing")-0.2,0.3),fin(t,w("sustain","nothing"),0.35),{size:34,rot:-0.08});}),{dy:-20,from:1.06});
  D3_OPT.forEach(([s_,x,res],j)=>{const t0=cC+0.2+j*0.3;arrive(ctx,x,660,t,t0,()=>{glass(ctx,x-320,560,640,200,18,[200,210,230],{glow:10,ea:0.6,fill:"rgba(7,12,24,0.94)"});
      T(ctx,s_,x,620,{w:800,size:32,align:"center"});
      res.forEach((r,i)=>{const tx=x-170+i*170,q=fin(t,w("checked","new line")+i*0.5+j*0.25,0.3);T(ctx,String(i+1),tx-28,712,{w:800,size:30,color:rgba(MOT,1)});if(q<=0)return;
        if(r>0)tick_(ctx,tx+20,702,22,[90,190,110],q);else if(r<0)cross_(ctx,tx+20,702,20,[220,80,70],q);else withA(ctx,q,()=>T(ctx,"–",tx+20,714,{w:800,size:32,align:"center",color:rgba(SOFT,1)}));});
      if(j===1){const win=fin(t,w("checked","Upgrading"),0.5);if(win>0)withA(ctx,win,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.9);ctx.lineWidth=4;rr(ctx,x-328,552,656,216,22);ctx.stroke();ctx.restore();});}},{dy:20});});
  ctx.restore();
  arrive(ctx,960,70,t,w("rule","principle"),()=>tag(ctx,960,70,"principle: a rule every choice is checked against",MOT,{align:"center",size:30}),{dy:10});
  arrive(ctx,960,830,t,w("checked","Upgrading")+1.2,()=>tag(ctx,960,830,"not the loudest: the same rule, every time",TRUST,{align:"center",size:30}),{dy:12});
  vign(ctx,S);});

/* ---------- 9. The chain ---------- */
const D3_CH=[["stakeholder","stakeholder","Stakeholders"],["driver","driver","drivers"],["assessment","assessment","Assessments"],["goal","goal","Goals"],["outcome","outcome","outcomes"]];
scene("chain",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const cN=c("number"),cW=c("what");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});const K=[[0,960,540,1],[cN-0.4,960,620,1.05]];focus(ctx,t,K);
  D3_CH.forEach(([n,k,word],i)=>{const x=70+i*278,t0=i===0?w("drawn","chain"):w("links",word)-0.1;
    if(i>0){const q=fin(t,t0-0.1,0.5);if(q>0)arrowTo(ctx,x-30,345,x-4,345,MOT,0.9,{p:q,lw:3,head:10});}
    arrive(ctx,x+120,345,t,t0,()=>archEl(ctx,x,290,240,110,n,MOT,k,{hi:pulseAt(t,t0+0.2,1.4)}),{dy:16});});
  arrive(ctx,725,190,t,w("beside","Principles"),()=>archEl(ctx,70,140,1350,96,"principles",MOT,"principle",{size:32}),{dy:-16});
  const R=layerStack(ctx,1500,150,340,{sh:58,gap:14,p:clamp((t-w("drawn","chain")+0.2)/1.6,0,1),fill:[fin(t,c("beside"),1.2)],hi:[0,0,0,0.7*fin(t,cW,0.8),0,0]});
  // one outcome, and the questions it leaves for whoever measures it
  arrive(ctx,700,560,t,cN-0.2,()=>{archEl(ctx,180,510,1040,110,"new solar connected within 10 working days",MOT,"outcome",{size:34,hi:0.6});
    ctx.strokeStyle=rgba(MOT,0.5);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(1188,400);ctx.lineTo(1100,510);ctx.stroke();ctx.setLineDash([]);},{dy:20});
  arrive(ctx,330,760,t,w("number","measure"),()=>d3_gauge(ctx,330,780,90,t,1),{dy:16});
  [["what counts as a working day?","working day",700],["connected, from when?","Connected",790]].forEach(([s_,k,y])=>arrive(ctx,780,y,t,w("what",k),()=>tag(ctx,500,y,s_,[255,186,150],{size:32}),{dy:12}));
  ctx.restore();vign(ctx,S);});

/* ---------- 10. Checked, for now ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const cC=c("confirms"),cA=c("answer"),ok=fin(t,w("confirms","confirms")+0.2,0.8),gb=fin(t,w("confirms","board"),0.5);
  [["decarbonisation",170],["affordability",470],["ageing assets",770],["rooftop solar",1070]].forEach(([s_,x],i)=>arrive(ctx,x,150,t,0.2+i*0.1,()=>d3_card(ctx,x,150,290,96,"driver",s_,null,{size:28,glass:ok,st:0.5+0.5*ok}),{dy:-16}));
  [["bills up 18%",470],["old poles",770],["one-way flow",1070]].forEach(([s_,x],i)=>arrive(ctx,x,290,t,0.5+i*0.1,()=>d3_card(ctx,x,290,290,96,"assessment",s_,null,{size:28,glass:ok,st:0.5+0.5*ok}),{dy:-16}));
  if(ok>0)withA(ctx,ok,()=>{kt_gtick(ctx,170,290,26,1);T(ctx,"confirmed",170,350,{w:700,size:28,align:"center",color:rgba(TRUST,1)});});
  [["affordable bills",320],["assets renewed",620],["renewables connected",920]].forEach(([s_,x],i)=>arrive(ctx,x,470,t,0.8+i*0.1,()=>d3_card(ctx,x,470,290,96,"goal",s_,null,{size:28,st:0.5}),{dy:-16}));
  [["charge flat, 2030",320],["solar in 10 days",920]].forEach(([s_,x],i)=>arrive(ctx,x,610,t,1.0+i*0.1,()=>d3_card(ctx,x,610,290,96,"outcome",s_,null,{size:28,st:0.5}),{dy:-16}));
  withA(ctx,gb,()=>T(ctx,"to the board, as drafts",620,720,{w:700,size:30,align:"center",color:"rgba(238,224,196,0.9)"}));
  person(ctx,"ama",1060,1030,0.76,{t,pose:t>cC&&t<cC+2.0?"explain":"stand"});
  person(ctx,"tomas",1800,1030,0.78,{t,pose:t>cA&&t<cA+2.2?"explain":"stand"});
  arrive(ctx,1500,170,t,0.4,()=>sticky(ctx,1500,170,380,130,"Why must it change?",{col:NOTEC[0],size:32,st:fin(t,cA+1.4,0.5)*0.5,rot:-0.03}),{dy:-20});
  arrive(ctx,1500,410,t,cA,()=>sticky(ctx,1500,410,500,250,"Four drivers, three goals, three principles to check every choice against.",{col:NOTEC[0],size:32,p:clamp((t-cA-0.2)/2.2,0,1),rot:0.015}),{dy:-30,from:1.06});
  arrive(ctx,1460,690,t,w("next","what"),()=>sticky(ctx,1460,690,380,140,"What must it be able to do?",{col:NOTEC[0],size:32,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"Why it moves",EAC,"Know why it must change, and what it will be checked against.","Film 3 of 11");});
