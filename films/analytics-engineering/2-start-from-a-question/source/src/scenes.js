/* ===== Start from a question: scenes =====
   Eight chapters, as in ../script.md. Snow's map of Soho, 1854, shows only what one question needed; Planning's question and
   the decision behind it; the slice of the glossary the question touches; the slice written once in YAML and drawn by hand;
   business keys and owners of meaning; combine or split; the agent's draft and the owner's clause; and the sources, ahead.
   Motion (the series' helpers in shared/src/weeds.js): every shot drifts (drift), things arrive with a spring (arrive), dust
   gives depth (motes), and what two chapters share travels across the cut: the question card turns into its YAML (2) and back
   into a card above the glossary (3); the four things become the blueprint (3 → 4 → 5), whose credential box becomes the card
   that is compared (5 → 6).
   Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. One question, one map ---------- */
const SQ_QMAP="Where did the dead get their water?";
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t);
  const cA=c("asked"),cM=c("marks"),cBr=c("bridge");
  // the pen's work, in order: the streets, the question, the two buildings and the pump, then one bar per death
  const s0=1.0,s1=cA+0.4,q0=w("asked","where"),q1=q0+2.0,b0=q1+0.15,b1=b0+1.3,m0=cM+0.3,dt=(sc.ends.marks-cM+0.3)/SQ_ADDR.length,m1=m0+SQ_ADDR.length*dt;
  const pb=ease(fin(t,w("left","His map"),2.8)),z=lerp(1.3,0.97,pb);
  ctx.save();drift(ctx,t,sc,{z:0.03,x:840,y:480});ctx.translate(840,480);ctx.scale(z,z);ctx.translate(-840,-480);
  const bars=k=>clamp((t-(m0+k*dt))/(dt*0.85),0,1)*SQ_MAP.addr[k].n;
  let nib=sq_map(ctx,t,{streets:clamp((t-s0)/(s1-s0),0,1),names:fin(t,s1-0.6,0.8),q:clamp((t-q0)/(q1-q0),0,1),bld:clamp((t-b0)/(b1-b0),0,1),pump:fin(t,b1-0.2,0.4),bars});
  // where the pen is between strokes: it glides to the next thing it draws, a little above the paper
  const qEnd=[230+tw(ctx,SQ_QMAP,30,600),250],stEnd=(s=>s.pts[s.pts.length-1])(SQ_MAP.strokes[SQ_MAP.strokes.length-1]),A=SQ_MAP.addr,ap=k=>[A[k].x,A[k].y];
  const glide=(p0,p1,u)=>[lerp(p0[0],p1[0],ease(u)),lerp(p0[1],p1[1],ease(u))];let pen=nib,lift=0;
  if(t<s0){pen=SQ_MAP.strokes[0].pts[0];lift=1-fin(t,0.2,0.8);}
  else if(t>=s1&&t<q0){const u=(t-s1)/(q0-s1);pen=glide(stEnd,[230,250],u);lift=Math.sin(Math.PI*u);}
  else if(t>=q1&&t<b0+0.01){pen=qEnd;}
  else if(t>=b0&&t<b1){const u=(t-b0)/(b1-b0),per=(x,y,w_,h_,v)=>{const L=2*(w_+h_),d=v*L;return d<w_?[x+d,y]:d<w_+h_?[x+w_,y+d-w_]:d<2*w_+h_?[x+w_-(d-w_-h_),y+h_]:[x,y+h_-(d-2*w_-h_)];};
    pen=u<0.5?per(668,384,100,82,u*2):per(1000,424,90,64,u*2-1);}
  else if(t>=b1&&t<m0){const u=(t-b1)/(m0-b1);pen=glide([1000,424],ap(0),u);lift=Math.sin(Math.PI*u);}
  else if(t>=m0&&t<m1){const k=Math.floor((t-m0)/dt),f=(t-m0)/dt-k;if(!pen){pen=k+1<A.length?glide(ap(k),ap(k+1),(f-0.85)/0.15):ap(k);lift=0.5;}}
  else if(t>=m1){const u=fin(t,m1,1.4);pen=glide(ap(A.length-1),[1500,120],u);lift=u;}
  if(!pen)pen=t<s1?stEnd:qEnd;
  withA(ctx,1-fin(t,m1+0.6,0.8),()=>sq_pen(ctx,pen[0],pen[1],lift,t));
  // what the question needed, and what it left out
  arrive(ctx,880,236,t,w("asked","one question"),()=>tag(ctx,800,236,"one question",CLAY,{size:20}),{from:0.7});
  const pumpA=fin(t,w("marks","one pump")-0.1,0.5);if(pumpA>0){glow(ctx,SQ_PUMP[0],SQ_PUMP[1],150,[255,190,120],0.22*pumpA);ring(ctx,SQ_PUMP[0],SQ_PUMP[1],34+8*pumpA,[150,60,30],0.5*pumpA,2,[5,6]);}
  arrive(ctx,905,622,t,w("marks","Broad Street"),()=>tag(ctx,905,622,"Broad Street pump",CLAY,{align:"center",size:20}),{dy:14});
  const lA=w("left","only");arrive(ctx,520,425,t,lA,()=>{ctx.strokeStyle=rgba(CLAY,0.7);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(624,425);ctx.lineTo(668,425);ctx.stroke();tag(ctx,624-tw(ctx,"workhouse · its own well",20,700)-26,425,"workhouse · its own well",CLAY,{size:20});},{from:0.8});
  arrive(ctx,1045,392,t,lA+0.3,()=>tag(ctx,1045,392,"brewery",CLAY,{align:"center",size:20}),{from:0.8});
  [[1560,560],[330,740]].forEach(([x,y],i)=>arrive(ctx,x,y,t,w("left","needed")+i*0.25,()=>tag(ctx,x,y,"left out",[200,170,130],{align:"center",size:20}),{from:0.8}));
  // the bridge: the question mark lifts off the map and drifts right, towards the present
  const br=fin(t,cBr+0.2,3.2);if(br>0){const p0=[qEnd[0]-8,240],k=ease(br),x=lerp(p0[0],1700,k),y=lerp(p0[1],320,k)-Math.sin(Math.PI*k)*120,sz=lerp(30,120,k),col=mix(SQ_INK,WEED,fin(br,0,0.4));
    glow(ctx,x,y-sz*0.35,sz*1.4,WEED,0.35*fin(br,0.1,0.4));T(ctx,"?",x,y,{w:800,size:sz,align:"center",color:rgba(col,1)});}
  ctx.restore();
  yearTag(ctx,120,110,"1854 · Soho, London",CLAY,fin(t,0.3,0.6));
  weedsTitle(ctx,S,t,B,"Start from a question","scope is a question, not the whole university",WEED);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. The question ---------- */
const SQ_YQ=["question:","  asked_by: Planning","  text: >","    How many learners are within 15 credit points of a graduate certificate, by faculty,","    as at census date?","  decision: >",
  "    How many places to offer in each faculty's final graduate certificate units next semester.","  also_served: The learner's wallet app, which needs the same facts as they are now."];
const SQ_PROF=["credentials:","  target: duckdb","  outputs:","    duckdb:","      type: duckdb","      …","    databricks:","      type: databricks","      …"];
const SQ_KEYS=[["{% macro duckdb__hash_key(columns) -%}","    sha256({{ credentials.key_string(columns) }})","{%- endmacro %}"],
  ["{% macro databricks__hash_key(columns) -%}","    sha2({{ credentials.key_string(columns) }}, 256)","{%- endmacro %}"]];
const SQ_DEC="How many places to offer in each faculty's final graduate certificate units next semester.";
// the YAML card of the question, where chapter 2 leaves it and chapter 3 picks it up
const SQ_YR=[60,300,1120];
scene("ask",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cT=c("text"),cR=c("real"),cC=c("cloud"),cH=c("hash"),m=ease(fin(t,cR-0.3,1.3)),pA=w("hash","connection")-0.3,yx=lerp(400,SQ_YR[0],ease(fin(t,pA-0.5,1.1)));
  // the loop of ten steps, small, its first station lit
  arrive(ctx,170,125,t,c("step")-0.2,()=>{sq_loop(ctx,170,125,0.21,t,STEPS10.map((_,i)=>i===0?fin(t,w("step","Step one"),0.5):0),1);tag(ctx,330,125,"step 1 · a question",WEED,{size:20});},{from:0.85});
  // who asks, and who else reads the same facts
  arrive(ctx,1440,130,t,cT-0.5,()=>sq_badge(ctx,1440,130,46,"planning","Planning",{hi:pulseAt(t,cT-0.3,1.2)}),{dy:20});
  arrive(ctx,1700,130,t,w("wallet","wallet app")-0.2,()=>{sq_badge(ctx,1700,130,36,"wallet","wallet app",{size:20});withA(ctx,fin(t,w("wallet","as they are today"),0.5),()=>T(ctx,"as they are today",1700,250,{w:600,size:18,align:"center",color:rgba(SQ_CON,1)}));},{dy:20});
  // the question types itself, and its words underline as they're read; then the decision behind it
  const ul=[["learners","learners"],["within 15 credit points","within fifteen"],["graduate certificate","graduate"],["by faculty","by faculty"],["as at census date","as at census"]].map(([s,k])=>[s,fin(t,w("text",k)-0.05,0.5)]);
  const qx=lerp(260,yx,m),qy=lerp(330,SQ_YR[1],m),qs=lerp(1,SQ_YR[2]/1400,m);
  arrive(ctx,960,410,t,cT-0.3,()=>{ctx.save();ctx.translate(qx,qy);ctx.scale(qs,qs);sq_qcard(ctx,0,0,1400,{p:clamp((t-cT+0.1)/(sc.ends.text-cT-0.6),0,1),ul,a:1-m});ctx.restore();},{dy:24});
  const dA=1-m;arrive(ctx,960,613,t,c("decision")-0.2,()=>withA(ctx,dA,()=>{const y=lerp(540,490,m);glass(ctx,360,y,1200,146,18,TRUST,{glow:12,ea:0.75,fill:"rgba(7,12,24,0.95)"});T(ctx,"the decision",390,y+36,{w:700,size:18,color:rgba(TRUST,1)});
    const n=Math.round(SQ_DEC.length*clamp((t-w("decision","how many"))/(sc.ends.decision-w("decision","how many")-0.4),0,1)),ls=wrapT(ctx,SQ_DEC,0,0,1140,{w:700,size:28,measure:true});let pos=0;
    ls.forEach((l,i)=>{const yy=y+80+i*38;T(ctx,l.slice(0,clamp(n-pos,0,l.length)),390,yy,{w:700,size:28});const k=l.indexOf("places to offer"),ua=fin(t,w("decision","places")-0.05,0.5);
      if(k>=0&&ua>0){const x0=390+tw(ctx,l.slice(0,k),28,700),sw=tw(ctx,"places to offer",28,700);ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,yy+8);ctx.lineTo(x0+sw*ease(ua),yy+8);ctx.stroke();}pos+=l.length+1;});}),{dy:24});
  // the number to reach, pinned to the card's corner
  arrive(ctx,1610,340,t,w("done","census report"),()=>withA(ctx,1-m,()=>{ctx.save();ctx.translate(1600,336);ctx.rotate(-0.06);tag(ctx,0,0,"census report · 12",EDGE_,{align:"center",size:22});ctx.fillStyle=rgba([200,70,60],1);ctx.beginPath();ctx.arc(-84,-12,6,0,TAU);ctx.fill();ctx.restore();}),{from:0.6});
  // the card turns into the project's YAML; the label says where it runs, and where else it runs
  const lg=fin(t,w("real","real"),0.5)*(1-0.5*fin(t,cC+1,1.2));
  sq_code(ctx,yx,SQ_YR[1],SQ_YR[2],"model/conceptual.yml",SQ_YQ,{a:m,size:18,lh:30,label:SQ_RUN,labelGlow:lg,edge:BPL,lit:{7:fin(t,cR+0.6,0.6)},litCol:SQ_CON});
  const sl=fin(t,w("cloud","Databricks")-0.1,0.8);withA(ctx,sl*0.75,()=>tag(ctx,yx+lerp(1060,850,ease(sl)),660,"Databricks · dbt Cloud",[150,170,200],{size:20}));
  // only the connection changes: two targets; and one function, the hash
  const dl=fin(t,w("hash","connection")+0.2,0.5);
  arrive(ctx,1530,470,t,pA,()=>{const x=1200,y=300;sq_code(ctx,x,y,660,"profiles.yml",SQ_PROF,{size:18,lh:30,edge:[150,190,255],lit:{3:dl,6:dl*0.6},litCol:WEED});
    withA(ctx,dl,()=>tag(ctx,x+22+tw(ctx,"    duckdb: ",18,500,"mono")+16,y+80+3*30-6,SQ_RUN,WEED,{size:18}));},{dy:26});
  const kh=w("hash","turns a key")-0.2;withA(ctx,fin(t,kh,0.3),()=>{const s="key → hash",n=typeOn(s,clamp((t-kh)/0.6,0,1));T(ctx,n,960,712,{w:800,size:28,align:"center",color:rgba(WEED,1)});});
  const kA=w("hash","into a hash")-0.1,ka=fin(t,w("hash","hash")+0.3,0.5);
  arrive(ctx,960,813,t,kA,()=>sq_code(ctx,260,730,1400,"macros/keys.sql",null,{cols:SQ_KEYS,size:18,lh:30,label:SQ_RUN+" (and Databricks)",edge:[150,190,255],seg:[[1,"sha256",ka,WEED],[101,"sha2",ka,WEED],[101,", 256",ka,WEED]]}),{dy:26});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. The slice ---------- */
// the glossary: everything the university does; the four the question touches are learner, credential, award (and credit, between them)
const SQ_GL=[["fee"],["learner","learner"],["timetable"],["room"],["award","award"],["staff"],["enrolment"],["unit"],["credential","cred"],["course review"],["library loan"],["parking permit"]];
const SQ_QTOP=[360,40,1200,28];
scene("slice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cG=c("glossary"),cF=c("four"),cO=c("out"),cN=c("never"),m=ease(fin(t,0,1.4)),go=ease(fin(t,cO+0.1,1.4));
  // the question's YAML, carried from the last chapter, folds back into a card above the glossary
  sq_code(ctx,SQ_YR[0],SQ_YR[1],SQ_YR[2],"model/conceptual.yml",SQ_YQ,{a:1-m,size:18,lh:30,label:SQ_RUN,edge:BPL});
  const[qx,qy,qw,qs]=SQ_QTOP;sq_qcard(ctx,lerp(SQ_YR[0],qx,m),lerp(SQ_YR[1],qy,m),qw,{a:m,size:qs});
  // the cards spread from a deck; the four the question touches light; the rest dim and drift off the edge
  const bp=sq_bpBoxes(960,270,1),grid=i=>[105+(i%6)*290,300+Math.floor(i/6)*150];
  const thr=[["learners",fin(t,w("four","a learner")-0.2,0.6),"learner"],["graduate certificate",fin(t,w("four","a credential")-0.2,0.6),"cred"],["graduate certificate",fin(t,w("four","an award")-0.2,0.6),"award"],["credit points",fin(t,w("four","the credit")-0.2,0.6),"credit"]];
  const named={fee:"fees",timetable:"timetables",room:"rooms",staff:"staff"};
  SQ_GL.forEach(([term,k],i)=>{const[gx,gy]=grid(i),t0=cG+0.2+i*0.1,sp=ease(fin(t,t0,0.9)),x=lerp(960-130,gx,sp),y=lerp(560,gy,sp)+Math.sin(t*0.7+i)*3,rot=(hash(i,9)-0.5)*0.06*sp+(1-sp)*(i-5.5)*0.04;
    if(k){const on=thr.find(q=>q[2]===k)[1];if(go>0)return;ctx.save();ctx.translate(x+130,y+55);ctx.rotate(rot);sq_term(ctx,-130,-55,260,110,term,{a:fin(t,t0,0.3),on,col:SQ_ENT[k][1]});ctx.restore();return;}
    const out=ease(fin(t,cO+0.05*i,1.3)),dx=(gx<960?-1:1)*out*900;ctx.save();ctx.translate(x+130+dx,y+55);ctx.rotate(rot);sq_term(ctx,-130,-55,260,110,term,{a:fin(t,t0,0.3)*(1-out),dim:fin(t,cF,0.8),on:pulseAt(t,w("glossary",named[term]||"~")-0.1,1.2)*0.6});ctx.restore();});
  // threads from the question's words to the four
  thr.forEach(([s,a,k])=>{if(a<=0)return;const[px,py]=sq_qpos(ctx,qx,qy,qw,s,qs),tgt=k==="credit"?[960,lerp(640,472,go)]:(()=>{const i=SQ_GL.findIndex(g=>g[1]===k),[gx,gy]=grid(i),b=bp[k];return[lerp(gx+130,b[0]+b[2]/2,go),lerp(gy,b[1],go)];})();
    arrowTo(ctx,px,py,tgt[0],tgt[1],TRUST,0.7*a*(1-fin(t,cN-0.5,0.8)),{p:a,head:10,lw:1.6,dash:[4,6]});});
  // the four, regrouped: three entities and the credit a learner holds towards an award, between them
  const from={};["learner","cred","award"].forEach(k=>{const i=SQ_GL.findIndex(g=>g[1]===k),[gx,gy]=grid(i);from[k]=[gx,gy,260,110];});
  if(go>0)sq_bp(ctx,960,270,1,{b:0,ph:250,from,m:go,hi:{learner:1-go,cred:1-go,award:1-go},credit:fin(go,0.75,0.25),noLines:go<0.9,paper:0});
  {const cy=lerp(640,472,go);arrive(ctx,960,cy,t,w("four","the credit")-0.1,()=>withA(ctx,1-fin(go,0.8,0.2),()=>{glass(ctx,795,cy-26,330,52,26,TRUST,{glow:14,ea:0.9,fill:"rgba(7,12,24,0.94)"});T(ctx,"credit towards an award",960,cy+8,{w:700,size:21,align:"center"});}),{from:0.8});}
  withA(ctx,fin(t,w("out","stays out"),0.5)*(1-fin(t,cN,0.6)),()=>T(ctx,"everything else stays out",960,620,{w:700,size:26,align:"center",color:rgba(SOFT,1)}));
  withA(ctx,fin(t,w("four","touches four")-0.1,0.5)*(1-fin(t,cO,0.5)),()=>tag(ctx,960,250,"the question touches four",TRUST,{align:"center",size:20}));
  // Noor agreed the scope with Planning, and wrote down why
  arrive(ctx,1450,700,t,cN-0.2,()=>{person(ctx,"noor",1450,830,0.48,{pose:"explain",t});roleTag(ctx,1450,862,"noor");},{dy:20,from:0.94});
  arrive(ctx,1720,680,t,cN+0.2,()=>sq_badge(ctx,1720,660,40,"planning","Planning",{}),{dy:20});
  const dP=clamp((t-w("never","wrote down"))/2.6,0,1);
  arrive(ctx,690,730,t,w("never","wrote down")-0.3,()=>sq_code(ctx,100,650,1180,"docs/decisions.md",["| 1 Oct 2026 | Scope: the entities Planning's question touches, and no more: learner, credential,","award, and credit towards an award. | \"Model the university\" never ends. A question does. |","Noor, data architect, with Planning |"],{size:18,lh:30,p:dP,edge:KIND}),{dy:24});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Written as YAML, drawn for people ---------- */
const SQ_YL=["  - name: learner","    definition: >","      A person the university has recorded learning with it, in any of its systems: a student","      of an award, a learning platform user, or a short-course customer.",
  "    owner: Mei Tanaka, registrar's office","    business_key:","      issued_by: Registrar's office","      rule: >","        The student ID, qualified by its key set: SIS|S-20417. A learner the student system","        doesn't know keeps the key of the first system that recorded them, …"];
const SQ_MM=["erDiagram","    LEARNER ||--o{ CREDENTIAL : holds","    LEARNER ||--o{ CREDIT_TOWARDS_AWARD : \"holds credit\"","    AWARD ||--o{ CREDIT_TOWARDS_AWARD : \"is earned by\"","    CREDENTIAL }o--o{ AWARD : \"counts towards\"","    LEARNER }o--o| AWARD : \"is enrolled in\""];
// the blueprint as a strip along the top (chapters 4 and 6), and larger in the middle (chapter 5)
const SQ_STRIP=[960,40,0.75,240],SQ_MID=[960,110,1,330];
// the hand-drawn diagram, rendered from the Mermaid source: boxes, then each line as its source line is typed (q[1..5])
function sq_erd(ctx,q,t){const ink=[215,232,255],box=(x,y,s,a)=>{if(a<=0)return;withA(ctx,a,()=>{const w=tw(ctx,s,18,500,"mono")+30,h=46;ctx.save();ctx.strokeStyle=rgba(ink,0.9);ctx.lineWidth=1.8;
    for(let k=0;k<2;k++){ctx.beginPath();ctx.moveTo(x-w/2+hash(k,1)*3,y-h/2+hash(k,2)*2);ctx.lineTo(x+w/2-hash(k,3)*2,y-h/2+hash(k,4)*3);ctx.lineTo(x+w/2+hash(k,5)*2,y+h/2-hash(k,6)*2);ctx.lineTo(x-w/2-hash(k,7)*2,y+h/2+hash(k,8)*2);ctx.closePath();ctx.stroke();}
    ctx.restore();T(ctx,s,x,y+6,{f:"mono",w:500,size:18,align:"center",color:rgba(ink,1)});});};
  const ln=(x0,y0,x1,y1,lab,lx,ly,al,a)=>{if(a<=0)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(ink,0.8);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2+(hash(x0,y1)-0.5)*10,(y0+y1)/2+(hash(y0,x1)-0.5)*10,lerp(x0,x1,ease(a)),lerp(y0,y1,ease(a)));ctx.stroke();
    if(a>=1){const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();[-0.5,0,0.5].forEach(d=>{ctx.moveTo(x1-Math.cos(an+d)*14,y1-Math.sin(an+d)*14);ctx.lineTo(x1-Math.cos(an)*1,y1-Math.sin(an)*1);});ctx.stroke();}ctx.restore();
    T(ctx,lab,lx,ly,{w:600,size:18,align:al,color:rgba(SK,1)});});};
  box(1290,590,"LEARNER",q[0]);box(1740,590,"CREDENTIAL",q[0]);box(1740,830,"AWARD",q[0]);box(1320,830,"CREDIT_TOWARDS_AWARD",q[0]);
  ln(1360,590,1660,590,"holds",1510,576,"center",q[1]);ln(1290,614,1290,806,"holds credit",1302,712,"left",q[2]);ln(1700,830,1445,830,"is earned by",1572,816,"center",q[3]);
  ln(1740,614,1740,806,"counts towards",1728,712,"right",q[4]);ln(1340,614,1690,806,"is enrolled in",1532,672,"center",q[5]);}
scene("yaml",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cO=c("once"),cD=c("diagram"),cR=c("read"),m=ease(fin(t,0,1.6));
  // the four, carried from the last chapter, rise and settle as a blueprint along the top
  const[sx,st,ss,sp]=SQ_STRIP;sq_bp(ctx,lerp(960,sx,m),lerp(270,st,m),lerp(1,ss,m),{b:m,ph:lerp(250,sp,m),paper:m});
  // the learner, written once: each part lights as it's named
  const yp=clamp((t-cO-0.2)/1.8,0,1),L1=fin(t,w("learner","a definition")-0.1,0.4),L2=fin(t,w("learner","an owner")-0.1,0.4),L3=fin(t,w("learner","the rule")-0.1,0.4),Lw=fin(t,w("words","a person")-0.1,0.5);
  const on=(a,b)=>a*(1-0.7*b);
  arrive(ctx,600,458,t,cO,()=>sq_code(ctx,60,270,1080,"model/conceptual.yml",SQ_YL,{size:18,lh:30,p:yp,label:SQ_RUN,edge:BPL,lit:{1:on(L1,L2),2:Math.max(on(L1,L2),Lw),3:Math.max(on(L1,L2),Lw),4:on(L2,L3),5:L3,6:L3,7:L3,8:L3,9:L3}}),{dy:26});
  arrive(ctx,600,244,t,cO+0.3,()=>withA(ctx,1-fin(t,cR-0.2,0.5),()=>tag(ctx,600,244,"written once · YAML",BPL,{align:"center",size:20})),{from:0.8});
  arrive(ctx,600,244,t,cR,()=>tag(ctx,600,244,"the meaning",TRUST,{align:"center",size:20}),{from:0.8});
  arrive(ctx,100,688,t,w("words","business's words"),()=>tag(ctx,100,688,"the business's words, not a system's",TRUST,{size:20}),{dy:14});
  // beside it, the diagram: its Mermaid source types, and the diagram renders from it line by line
  const mp=clamp((t-cD+0.1)/3.4,0,1),mq=SQ_MM.map((_,i)=>clamp(mp*SQ_MM.length-i-0.3,0,1));
  arrive(ctx,1520,575,t,cD-0.3,()=>{sq_code(ctx,1180,270,680,"docs/conceptual-model.md",SQ_MM,{size:18,lh:28,p:mp,edge:KIND,h:620,lit:{1:fin(t,w("diagram","holds credentials"),0.4)*(1-fin(t,cR,0.5)),2:fin(t,w("diagram","holds credit"),0.4)*(1-fin(t,cR,0.5))},litCol:KIND});
    ctx.fillStyle="rgba(170,200,245,0.12)";ctx.fillRect(1196,516,648,1.2);sq_erd(ctx,mq,t);},{dy:26});
  arrive(ctx,1520,244,t,w("diagram","drawn by hand"),()=>withA(ctx,1-fin(t,cR+0.2,0.5),()=>tag(ctx,1520,244,"drawn by hand",KIND,{align:"center",size:20})),{from:0.8});
  arrive(ctx,1520,244,t,w("read","anyone"),()=>tag(ctx,1520,244,"anyone can read it",KIND,{align:"center",size:20}),{from:0.8});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Keys and owners ---------- */
const SQ_YKS=["key_sets:","  - code: SIS","    system: student system","    owner: Registrar's office","  - code: LMS","    system: learning platform","    owner: Learning team","  - code: SC","    system: short-course platform","    owner: Learning team"];
scene("owners",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cK=c("keys"),cS=c("sets"),cM=c("mei"),cW=c("why"),m=ease(fin(t,0,1.6)),[ax,at,as_,ap]=SQ_STRIP,[bx,bt,bs,bph]=SQ_MID;
  const dis=fin(t,w("why","disagree")-0.2,0.6),fl=0.55+0.45*Math.sin(t*9)*Math.sin(t*3.3);
  // behind the blueprint, the sources flicker, each with its own word for a learner
  if(dis>0)[["student",-50,-30,0,[205,300]],["user",30,-48,1,[1500,90]],["customer",54,24,2,[1730,300]]].forEach(([wd,dx,dy,k,[lx,ly]])=>withA(ctx,dis*(0.5+0.5*fl)*0.8,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(SRC3[k][1],0.7);ctx.lineWidth=2;ctx.strokeRect(260+dx,110+dy,1400,330);ctx.restore();
    T(ctx,wd,lx,ly,{w:700,size:22,align:"center",color:rgba(SRC3[k][1],1)});}));
  const B=sq_bp(ctx,lerp(ax,bx,m),lerp(at,bt,m),lerp(as_,bs,m),{b:1,ph:lerp(ap,bph,m)});
  arrive(ctx,960,62,t,c("before"),()=>tag(ctx,960,62,"business keys · before any source",BPL,{align:"center",size:20}),{from:0.8});
  // each entity's key, in business terms, its key set's prefix in the source's colour
  const lift=fin(t,cS+0.3,0.6),K=[["learner","SIS|S-20417",0,"student ID",w("keys","student ID")],["award","SIS|GCDA",0,"award code",w("keys","its code")],["cred","LMS|B-5010",-90,"the ID its issuer gave it",w("keys","the ID its issuer")],["cred","SC|C-88",90,null,w("keys","the ID its issuer")+0.3]];
  K.forEach(([k,key,dx,desc,t0])=>{const[x,y,bw,bh]=B[k],cx=x+bw/2+dx,ky=y+bh+42;arrive(ctx,cx,ky,t,t0-0.2,()=>{sq_key(ctx,cx,ky,key,{align:"center",lift});if(desc)T(ctx,desc,x+bw/2,ky+46,{w:600,size:18,align:"center",color:rgba(BPL,0.9)});},{from:0.7});});
  // the prefixes lift and line up as three key sets, beside the YAML that declares them
  ["SIS","LMS","SC"].forEach((ks,i)=>{const k=K.findIndex(q=>q[1].startsWith(ks+"|")),[x,y,bw,bh]=B[K[k][0]],x0=x+bw/2+K[k][2]-tw(ctx,K[k][1],20,500,"mono")/2,y0=y+bh+42,u=ease(fin(t,cS+0.3+i*0.2,1.2));if(u<=0)return;
    const x1=150,y1=560+i*90,xx=lerp(x0,x1,u),yy=lerp(y0,y1,u)-Math.sin(Math.PI*u)*40;
    T(ctx,ks,xx,yy+(lerp(20,30,u))*0.36,{f:"mono",w:500,size:lerp(20,30,u),color:rgba(SRC3[i][1],1)});withA(ctx,fin(u,0.8,0.2),()=>{T(ctx,SRC3[i][0],222,y1+8,{w:700,size:20});});});
  arrive(ctx,150,500,t,w("sets","system it comes from"),()=>tag(ctx,150,500,"key sets",BPL,{size:20}),{from:0.8});
  arrive(ctx,780,670,t,cS+1.0,()=>sq_code(ctx,520,480,580,"model/conceptual.yml",SQ_YKS,{size:18,lh:30,p:clamp((t-cS-1.0)/1.6,0,1),label:SQ_RUN,edge:BPL,lit:{1:fin(t,w("sets","student system"),0.4),4:fin(t,w("sets","learning platform"),0.4),7:fin(t,w("sets","short-course"),0.4)}}),{dy:24});
  // each meaning has an owner: Mei on the learner, the credential and the award; the learning team on two kinds of credential
  const mA=fin(t,w("mei","Mei")-0.2,0.5),tA=fin(t,w("mei","learning team")-0.2,0.5),mHi=fin(t,cW,0.6);
  ["learner","cred","award"].forEach((k,i)=>{const[x0,y,bw]=B[k],x=k==="award"?x0+bw:x0;arrive(ctx,x,y,t,w("mei","owns learner")+i*0.25-0.2,()=>sq_face(ctx,"mei",x,y,30,1,{t,hi:mHi}),{from:0.5});});
  const[cx_,cy_,cw_]=B.cred;arrive(ctx,cx_+cw_-60,cy_-18,t,w("mei","microcredentials")-0.2,()=>{[["microcredential",cx_+60],["badge",cx_+232]].forEach(([s,x])=>{const tw_=tw(ctx,s,18,700)+22;
    glass(ctx,x,cy_-32,tw_,28,8,TRUST,{glow:6,ea:0.8,fill:"rgba(20,50,110,0.95)"});T(ctx,s,x+11,cy_-12,{w:700,size:18,color:rgba(BPL,1)});});sq_face(ctx,"tom",cx_+326,cy_-18,17,1,{t});},{from:0.6});
  // the owners, named
  arrive(ctx,1240,560,t,w("mei","Mei")-0.1,()=>{sq_face(ctx,"mei",1240,560,48,1,{t,hi:mHi});T(ctx,"Mei, registrar's office",1310,552,{w:800,size:24});T(ctx,"owns learner · credential · award",1310,582,{w:600,size:18,color:rgba(SOFT,1)});},{dy:20});
  arrive(ctx,1240,690,t,w("mei","learning team")-0.1,()=>{sq_face(ctx,"tom",1240,690,48,1,{t});T(ctx,"the learning team",1310,682,{w:800,size:24});T(ctx,"owns microcredentials · badges",1310,712,{w:600,size:18,color:rgba(SOFT,1)});},{dy:20});
  arrive(ctx,1190,800,t,w("why","disagree"),()=>tag(ctx,1190,800,"the sources will disagree",EDGE_,{size:20}),{dy:14});
  arrive(ctx,1190,856,t,w("why","decides"),()=>tag(ctx,1190,856,"the owner decides",TRUST,{size:20}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Combine or split ---------- */
const SQ_YK=["    kinds:","      - name: award","        owner: Mei Tanaka, registrar's office","      - name: microcredential","        definition: A credential for a small, assessed piece of learning, which can carry credit points towards an award.","        owner: Learning team","      - name: badge","        definition: A credential with no credit points.","        owner: Learning team"];
const SQ_SQL=["-- a certificate of attendance isn't a credential","completed_courses as (","","    select * from enrolments","    where enrolment_status = 'completed'","      and certificate_type = 'completion'","      and certificate_bk is not null","","),"];
// one card of the comparison: a name, and its rows (label, value, how far it has appeared)
function sq_cmp(ctx,x,y,w,h,name,col,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:14+10*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.95)"});
  T(ctx,name,x+28,y+50,{w:800,size:30,color:rgba(col,1)});if(o.key)sq_key(ctx,x+w-28-tw(ctx,o.key,20,500,"mono")-28,y+40,o.key,{});
  rows.forEach(([lab,val,ra,vc],i)=>{if(ra<=0)return;const yy=y+110+i*62;withA(ctx,ra,()=>{ctx.fillStyle="rgba(170,200,245,0.1)";ctx.fillRect(x+20,yy-36,w-40,1);T(ctx,lab,x+28,yy,{w:600,size:18,color:rgba(SOFT,1)});T(ctx,val,x+200,yy,{w:700,size:22,color:rgba(vc||INK,1)});});});});}
scene("split",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cC=c("compare"),cR=c("rule"),cA=c("attend"),m=ease(fin(t,0,1.4)),mg=ease(fin(t,w("rule","one entity")-0.3,1.3)),yk=fin(t,w("rule","with kinds")-0.1,0.6)*(1-fin(t,cA-0.2,0.6));
  // the blueprint from the last chapter recedes; its credential box comes forward to be compared
  const[bx,bt,bs,bph]=SQ_MID,B0=sq_bpBoxes(bx,bt,bs);sq_bp(ctx,bx,bt,bs,{b:1,ph:bph,a:1-fin(t,0,0.9),ea:{cred:0}});
  arrive(ctx,960,100,t,c("harder")+0.2,()=>withA(ctx,1-fin(t,w("rule","A different")-0.4,0.5),()=>T(ctx,"combine or split?",960,110,{w:800,size:40,align:"center"})),{from:0.9});
  const id1=fin(t,w("compare","what identifies")-0.1,0.5),lc=fin(t,w("compare","its life")-0.1,0.5),cp=fin(t,w("same","credit points")-0.2,0.5);
  const rowsM=[["identity","LMS|B-5010 · issuer's ID",id1],["lifecycle","issued · revoked?",lc],["credit points","5",cp,SQ_AMB]],rowsC=[["identity","the issuer's identifier",id1],["lifecycle","issued · revoked?",lc],["credit points","varies",cp,SQ_AMB]];
  const cxL=lerp(200,610,mg),cxR=lerp(1060,610,mg),[fx,fy,fw,fh]=B0.cred,cy=lerp(280,170,mg);
  arrive(ctx,530,420,t,c("harder")+0.5,()=>sq_cmp(ctx,cxL,cy,660,280,"microcredential",SRC3[1][1],rowsM,{a:1-mg}),{dy:30});
  const crX=lerp(fx,cxR,m),crY=lerp(fy,cy,m),crW=lerp(fw,660,m),crH=lerp(fh,280,m);
  sq_cmp(ctx,crX,crY,crW,crH,"credential",TRUST,m<1?[]:rowsC.map(r=>[r[0],r[1],r[2]*(1-mg),r[3]]),{a:1});
  if(m<1)withA(ctx,1-m,()=>bpBox(ctx,crX,crY,crW,crH,"Credential",TRUST,1,{size:26}));
  // the first two rows match; the third stays apart
  [[id1,w("compare","Compare its life")-0.3],[lc,w("same","Both match")]].forEach(([ra,tt],i)=>{const k=fin(t,tt,0.4)*(1-mg);if(k>0)tick_(ctx,960,cy+102+i*62,44,GOOD,k);});
  withA(ctx,cp*(1-mg),()=>T(ctx,"≠",960,cy+248,{w:800,size:44,align:"center",color:rgba(SQ_AMB,1)}));
  // one entity, with kinds, each with its owner
  withA(ctx,mg,()=>{const x=610,y=170;glass(ctx,x,y,700,280,18,TRUST,{glow:16+12*pulseAt(t,w("attend","can do"),1.4),ea:0.9,fill:"rgba(7,12,24,0.96)"});T(ctx,"credential",x+28,y+50,{w:800,size:30,color:rgba(TRUST,1)});
    T(ctx,"says",x+28,y+110,{w:600,size:18,color:rgba(SOFT,1)});T(ctx,"what someone can do",x+200,y+110,{w:700,size:22,color:rgba(mix(INK,GOOD,pulseAt(t,w("attend","can do"),1.4)),1)});
    [["award","mei"],["microcredential","tom"],["badge","tom"]].forEach(([s,who],i)=>{const kx=x+28+[0,180,440][i],ka=fin(t,w("rule","with kinds")+0.2+i*0.2,0.4);withA(ctx,ka,()=>{const tw_=tw(ctx,s,20,700)+60;glass(ctx,kx,y+170,tw_,52,12,TRUST,{glow:8,ea:0.7,fill:"rgba(30,26,12,0.95)"});
      sq_face(ctx,who,kx+24,y+196,17,1,{t});T(ctx,s,kx+48,y+203,{w:700,size:20});});});});
  arrive(ctx,960,653,t,w("rule","with kinds")-0.1,()=>sq_code(ctx,290,480,1340,"model/conceptual.yml",SQ_YK,{a:yk>0?1:0,size:18,lh:30,wrap:104,label:SQ_RUN,edge:BPL,lit:{1:yk,3:yk,6:yk}}),{dy:24,a:yk});
  // the rule, and its other half
  arrive(ctx,960,104,t,w("rule","A different")-0.2,()=>{glass(ctx,250,64,1420,80,18,TRUST,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.96)"});
    const a1="same identity + same lifecycle → one entity, with kinds",sep="  ·  ",a2="different identity, grain or lifecycle → split",W1=tw(ctx,a1,24,700),W2=tw(ctx,sep,24,700),W3=tw(ctx,a2,24,700),x0=960-(W1+W2+W3)/2;
    T(ctx,a1,x0,113,{w:700,size:24,color:rgba(TRUST,1)});T(ctx,sep,x0+W1,113,{w:700,size:24,color:rgba(SOFT,1)});T(ctx,a2,x0+W1+W2,113,{w:700,size:24,color:rgba(SQ_AMB,1)});},{from:0.9});
  // a certificate of attendance asks to join; it says someone was there, not what they can do; it's turned away at the edge
  const d0=c("attend")-0.2,app=ease(fin(t,d0,2.2)),bounce=spring(fin(t,w("attend","stays out")-0.5,1.2)*1.2),cxC=lerp(1960,1340,app)+bounce*130;
  if(t>d0){sq_cmp(ctx,cxC,190,500,250,"certificate of attendance",SRC3[2][1],[["key","SC|C-81",1],["says","someone was there",fin(t,w("attend","was there")-0.2,0.5),EDGE_]],{a:1-0.45*fin(t,w("attend","stays out"),0.8)});
    kt_rcross(ctx,cxC+470,190,22,fin(t,w("attend","stays out")-0.2,0.4));}
  arrive(ctx,1590,486,t,w("attend","stays out"),()=>tag(ctx,1590,486,"stays out",EDGE_,{align:"center",size:20}),{dy:12});
  arrive(ctx,560,640,t,w("attend","was there")-0.4,()=>sq_code(ctx,120,480,880,"models/intermediate/int_credentials_unioned.sql",SQ_SQL,{size:18,lh:30,label:SQ_RUN,edge:LAYER4[1][1],lit:{0:fin(t,w("attend","stays out"),0.5),5:fin(t,w("attend","stays out")+0.3,0.5)},litCol:EDGE_}),{dy:24});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. The agent's draft ---------- */
const SQ_SK=["1. **Write the question** under `question:`: who asks it, the words they use, and the decision it supports. …","2. **List only the entities the question touches.** … An entity the question doesn't need stays out, however central it seems.","…","4. **Combine or split.** Two candidates with the same identity and the same lifecycle are one entity, with kinds …"];
const SQ_YC=["  - name: credential","    definition: >","      A trusted, checkable statement that someone has shown what they know or can do.","      Awards, microcredentials and badges are kinds of credential; a certificate of attendance","      isn't one.","    owner: Mei Tanaka, registrar's office"];
const SQ_DD=["| 2 Oct 2026 | A microcredential is a kind of credential, not an entity of its own. So is a badge. | … | Mei Tanaka, registrar's office |","| 2 Oct 2026 | A certificate of attendance isn't a credential. | It says someone was there, not what they can do. | Mei Tanaka, registrar's office |"];
scene("draft",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cG=c("agent"),cK=c("skill"),cM=c("miss"),cL=c("clause"),cP=c("approve");
  // the agent reads the question and the glossary
  const rd=fin(t,w("agent","An AI agent")+0.3,0.6)*(1-fin(t,cM+2.5,0.8)),busy=fin(t,cM-0.8,0.4)*(1-fin(t,cM+2.2,0.5));
  arrive(ctx,280,550,t,cG,()=>{sq_qcard(ctx,40,430,480,{size:20,label:"Planning's question"});["learner","credential","award"].forEach((s,i)=>sq_term(ctx,40+i*164,640,156,96,s,{size:22,on:0.4,col:SQ_ENT[["learner","cred","award"][i]][1]}));},{dy:24});
  kt_scan(ctx,280,300,280,520,rd,t,{w:200});kt_scan(ctx,280,300,280,690,rd*0.7,t,{w:220,ph:1.3});
  arrive(ctx,280,230,t,w("agent","An AI agent")-0.2,()=>{kt_agent(ctx,280,230,58,t,{busy});tag(ctx,280,350,"the agent drafts",KT_AI,{align:"center",size:20});},{from:0.7});
  // the skill it follows, kept in the project; three steps light as they're read
  arrive(ctx,1220,180,t,w("agent","a skill")-0.2,()=>{sq_code(ctx,580,50,1280,"skills/draft-the-conceptual-model/SKILL.md",SQ_SK,{size:18,lh:30,wrap:112,edge:KT_AI,label:"a skill",lit:{0:fin(t,w("skill","Write the question")-0.1,0.4),1:fin(t,w("skill","List only")-0.1,0.4),3:fin(t,w("skill","Propose")-0.1,0.4)},litCol:KT_AI});},{dy:24});
  // the draft, in teal, without its last clause; Mei writes it, in gold
  const dp=clamp((t-cM+0.6)/2.4,0,1),cl=clamp((t-w("clause","a certificate"))/1.6,0,1),k3=SQ_YC[3].indexOf(" a certificate");
  arrive(ctx,1220,468,t,cM-0.8,()=>{sq_code(ctx,580,340,1280,"model/conceptual.yml",SQ_YC,{size:18,lh:30,p:dp,label:SQ_RUN,edge:mix(KT_AI,TRUST,fin(t,cL,0.8)),lineCol:{2:KT_AI,3:KT_AI},
    clip:{3:[k3,cl,TRUST],4:[0,cl>0?clamp(cl*2-1,0,1):0,TRUST]},hi:fin(t,cL,0.6)});
    const cw=tw(ctx,"M",18,500,"mono"),miss=fin(t,w("miss","let certificates")-0.2,0.5)*(1-fin(t,w("clause","a certificate"),0.4));
    withA(ctx,miss,()=>{const x0=602+cw*(k3+1);ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(EDGE_,0.9);ctx.lineWidth=2;rr(ctx,x0-6,486,cw*28+12,60,8);ctx.stroke();ctx.restore();});},{dy:24});
  arrive(ctx,1720,780,t,cL-0.5,()=>{person(ctx,"mei",1720,900,0.42,{pose:t>w("clause","one clause")?"explain":"stand",t});},{dy:20,from:0.94});
  arrive(ctx,1720,624,t,w("clause","one clause"),()=>tag(ctx,1720,624,"Mei adds one clause",TRUST,{align:"center",size:20}),{dy:12});
  // her approval, and the decision in the log, with her name and the date
  const ap=w("approve","approves");kt_gtick(ctx,1590,552,20,fin(t,ap-0.1,0.4));kt_rstamp(ctx,1720,558,"approved",TRUST,fin(t,ap,0.3),fin(t,ap+0.1,0.35),{size:24,rot:-0.08});
  arrive(ctx,1040,728,t,w("approve","in the log")-0.3,()=>sq_code(ctx,580,630,920,"docs/decisions.md",SQ_DD,{size:18,lh:30,wrap:78,edge:KIND,p:clamp((t-w("approve","in the log")+0.1)/1.6,0,1),lit:{0:fin(t,w("approve","the date"),0.5),1:fin(t,w("approve","the date")+0.2,0.5)},litCol:TRUST}),{dy:24});
  arrive(ctx,280,790,t,w("approve","owner approves"),()=>tag(ctx,280,790,"the owner approves the meaning",TRUST,{align:"center",size:20}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Now, the sources ---------- */
scene("next",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});
  ctx.save();drift(ctx,t,sc,{z:0.03,y:380});
  const cS=c("sources"),cT=c("three");
  // the slice, with its question above it and its two owners beside it; around it, blank space
  arrive(ctx,960,108,t,0.2,()=>sq_qcard(ctx,460,40,1000,{size:24}),{dy:20});
  arrive(ctx,960,347,t,0.5,()=>sq_bp(ctx,960,230,0.9,{b:1,ph:260}),{d:1.0,from:0.92});
  arrive(ctx,200,330,t,0.9,()=>{sq_face(ctx,"mei",200,330,52,1,{t});T(ctx,"Mei",200,412,{w:800,size:22,align:"center"});},{from:0.7});
  arrive(ctx,1720,330,t,1.1,()=>{sq_face(ctx,"tom",1720,330,52,1,{t});T(ctx,"learning team",1720,412,{w:800,size:22,align:"center"});},{from:0.7});
  [["one question",300,108,"One question"],["four things",960,492,"Four things"],["two owners",200,462,"Two owners"],["nothing else",1720,462,"Nothing else"]].forEach(([s,x,y,k])=>arrive(ctx,x,y,t,w("count",k)-0.1,()=>tag(ctx,x,y,s,WEED,{align:"center",size:20}),{from:0.7}));
  // the next step: the loop's second station
  arrive(ctx,1720,112,t,cS-0.2,()=>{sq_loop(ctx,1720,112,0.2,t,STEPS10.map((_,i)=>i===0?0.5:i===1?fin(t,cT+2.4,0.6):0),1);withA(ctx,fin(t,cT+2.4,0.6),()=>tag(ctx,1720,212,"step 2 · the sources",WEED,{align:"center",size:20}));},{from:0.85});
  // beneath the blueprint, the sources arrive in their colours, and Aisha surfaces in each, under three keys
  [[480,"S-20417"],[960,"u-88213"],[1440," Aisha.K@Mail.example "]].forEach(([x,key],k)=>{const t0=cS+0.1+k*0.3;arrive(ctx,x,700,t,t0,()=>sq_stream(ctx,x,540,930,k,t,1),{dy:60,from:0.95});
    arrive(ctx,x,740,t,w("three","Aisha")+k*0.3,()=>sq_aisha(ctx,x,740,k,key,1),{from:0.7});});
  ctx.restore();weedsEnd(ctx,S,t,B,"Start from a question",WEED,"Model only what the question touches; name who owns each meaning first.");
  vign(ctx,S);});
