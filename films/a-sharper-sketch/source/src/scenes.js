/* ===== A Sharper Sketch: scenes =====
   The camera stays on the sketch and zooms in. Each chapter asks one question, checks the reference model (TCSI) on tracing paper,
   and changes the sketch: the gap between Genie's number and the census report closes, 131 → 125 → 121 → 119 → 118. */

// builds the boxes of the sketch from a layout: E3(["Student",...], L3, {Student:{sub:"..."}})
function E3(keys,pos,extra,s){const E={};keys.forEach(k=>{if(!pos[k])return;E[k]=Object.assign({x:pos[k][0],y:pos[k][1],name:NAME[k]||k,s:s||1},extra&&extra[k]||{});});return E;}
// moves a layout: shrinks it by k around (960,510) and centres it on (cx,cy)
function lay(pos,k,cx,cy){const o={};Object.keys(pos).forEach(n=>{o[n]=[cx+(pos[n][0]-960)*k,cy+(pos[n][1]-510)*k];});return o;}
const pulse=(t,t0,d)=>t>t0&&t<t0+(d||2.2)?Math.sin(Math.PI*(t-t0)/(d||2.2)):0;
// a short-lived tag: visible from t0 for d seconds
const brief=(t,t0,d)=>fin(t,t0,0.4)*(1-sstep(t0+(d||3),t0+(d||3)+0.5,t));
function slideIn(t,t0,t1){return (1-ease(clamp((t-t0)/1.2,0,1)))*1900+(t1!=null?ease(clamp((t-t1)/1.1,0,1))*-1900:0);}

// the finished sketch, v2: every box, its line and its pin
const SUB2={Offering:{sub:"census date",subCol:REF},Unit:{sub:"Data Science 101"},Class:{sub:"Tue 9 am tutorial"},Status:{sub:"status · date"},Enrolment:{}};
function sketchV2(ctx,o){o=o||{};const pos=o.pos||L3,s=o.s||1,E=E3(Object.keys(L3),pos,SUB2,s);
  Object.keys(E).forEach(k=>{if(o.pins)Object.assign(E[k],{pin:PINS[k],pinA:o.pinA?o.pinA(k):1,pinP:o.pinP?o.pinP(k):0});if(o.hi)E[k].hi=o.hi(k);if(o.a)E[k].a=o.a(k);if(o.extra&&o.extra[k])Object.assign(E[k],o.extra[k]);});
  return diagram(ctx,E,L3R.map(r=>r.concat([{}])));}

/* ---------- 0. The sketch we drew ---------- */
scene("drawn",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cR=c("recap"),cO=c("over"),cN=c("normal"),B=c("breath");
  const cam=camAt([[0,960,540,1.08],[cR,960,540,1.08],[cO,960,530,1.0],[sc.dur+2,960,530,0.98]],t);
  clearTo(ctx,S);const bgA=sstep(3.1,3.9,t);
  if(bgA>0){ctx.save();ctx.globalAlpha=bgA;bgW(ctx,S,cam);board(ctx,1,"Conceptual model · from the first film");
    // the recap names each box as it appears: student, class, enrolment, term, course
    const d=c("over")-cR,order=["Student","Class","Enrolment","Term","Course"],ap=k=>fin(t,cR+0.4+order.indexOf(k)*d*0.16,0.5);
    const E={};Object.keys(V1).forEach(k=>{E[k]={x:V1[k][0],y:V1[k][1],name:k,s:1.25,a:ap(k)};});E.Term.sub="census date";
    const rf=clamp((t-cR-d*0.8)/1.2,0,1),q=fin(t,cO+0.8);
    diagram(ctx,E,V1R.map((r,i)=>r.concat([{f:clamp(rf*4-i,0,1),bad:q*(i===3?0.6+0.4*Math.sin(t*3):0)}])));
    // what the sketch hides: the class, the one census date, the one course
    withA(ctx,q,()=>{[[1368,413,"what is a class?"],[1368,757,"one date for all?"],[576,535,"only one course?"]].forEach(([x,y,s],i)=>withA(ctx,fin(t,cO+0.8+i*0.5),()=>{glow(ctx,x,y,70,EXT,0.25+0.1*Math.sin(t*3+i));tag(ctx,x+(i===2?0:0),y+(i===0?-70:i===1?0:0),s,EXT,{align:"center",size:18});}));});
    withA(ctx,fin(t,cO+0.3),()=>{tag(ctx,700,845,"good enough to start",GOOD,{align:"center",size:18});tag(ctx,1220,845,"not good enough to count",BAD,{align:"center",size:18});});
    stamp(ctx,1790,845,"sketch v1",SK,fin(t,cR+1));
    // a sweep of light: every model gets sharper when a question needs it
    if(t>cN+0.5&&t<cN+3.5){const u=(t-cN-0.5)/3;glow(ctx,lerp(150,1800,ease(u)),530,260,SK,0.25*Math.sin(Math.PI*u));}
    // the breather: new records arrive and find their place in the simple sketch
    if(sc.breathe&&t>B){for(let k=0;k<5;k++){const t0=B+0.6+k*0.8,u=clamp((t-t0)/1.3,0,1);if(u<=0||u>=1)continue;const q2=at(mk(bez(P(40,250+k*110),P(400,250+k*80),P(800,413),P(972,413),16)),ease(u));dtile(ctx,q2.x,q2.y,lerp(40,26,u),0,{cell:(k*7+3)%24,q:2,app:["sis","lms","sis","hr","sis"][k]},1-sstep(0.85,1,u));}
      [0,1,2,3,4].forEach(k=>{const t0=B+1.9+k*0.8;if(t>t0&&t<t0+0.8)glow(ctx,972,413,120,SK,0.4*(1-(t-t0)/0.8));});}
    ctx.restore();}
  vign(ctx,S);
  const tA=sstep(0.3,1.1,t)*(1-sstep(2.7,3.4,t));if(tA>0){setScreen(ctx,S);withA(ctx,tA,()=>{T(ctx,"A Sharper Sketch",W/2,H/2-4,{w:800,size:96,align:"center"});T(ctx,"When a data model needs more precision",W/2,H/2+60,{size:30,w:500,align:"center",color:rgba(SOFT,0.95)});});}
});

/* ---------- 1. Two numbers ---------- */
function asker(ctx,t,a,q,qA){withA(ctx,a,()=>{orb(ctx,330,600,34,t);chip(ctx,330,720,"databricks","Genie","answers in plain words",{align:"center",edge:LAYER.gold});
  withA(ctx,qA,()=>{tag(ctx,500,210,"Head of School",DOM.students.c,{size:18});bubble(ctx,480,245,660,q,DOM.students.c,{size:30});});});}
scene("two",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cA=c("ask"),cQ=c("q"),cN=c("nums"),cC=c("clean"),cM=c("meaning"),cK=c("check"),cT=c("tcsi"),B=c("breath");
  bgW(ctx,S,CAM0);const out=1-sstep(cK-0.2,cK+0.8,t);
  withA(ctx,out,()=>{asker(ctx,t,fin(t,0.2),"How many students were enrolled in Data Science 101 on census date?",fin(t,cQ-0.2));
    withA(ctx,fin(t,cN-0.1),()=>numCard(ctx,1220,250,560,"Genie","131","counted from the lakehouse",CYAN));
    withA(ctx,fin(t,cN+1.6),()=>numCard(ctx,1220,500,560,"Census report","118","sent to government",LAYER.gold,{badge:"certified",badgeCol:LAYER.gold}));
    withA(ctx,fin(t,cC+0.2),()=>{tag(ctx,1590,430,"every test passed",GOOD,{size:16});tag(ctx,1590,680,"every test passed",GOOD,{size:16});});
    withA(ctx,fin(t,cM),()=>{glow(ctx,1500,470,160,BAD,0.18+0.06*Math.sin(t*3));tag(ctx,1500,775,"same data, different meaning",BAD,{align:"center",size:20});});});
  // before changing anything, a wider question: how does this kind of business generally work? Many industries have published models, a first template
  const cI=c("industry"),cF=c("fit"),cMc=c("mcds");
  const bA=fin(t,cK+0.2,0.8);withA(ctx,bA,()=>{board(ctx,1,"Conceptual model");const E={};Object.keys(V1).forEach(k=>{E[k]={x:V1[k][0],y:V1[k][1],name:k};});E.Term.sub="census date";diagram(ctx,E,V1R.map(r=>r.concat([{}])));stamp(ctx,1790,845,"sketch v1",SK,1);
    withA(ctx,fin(t,cK+0.9),()=>tag(ctx,960,280,"how does this kind of business generally work?",C.white,{align:"center",size:24}));
    // first the industries, then, for higher education, several candidate models: which one, and why, is a choice
    const cCh=c("choose"),ind=fin(t,cI+0.2)*(1-sstep(cCh-0.2,cCh+0.4,t)),cand=fin(t,cCh+0.3);
    withA(ctx,ind,()=>{T(ctx,"published industry models: a first template",960,772,{w:600,size:18,align:"center",color:rgba(SOFT,1)});
      ["Banking","Insurance","Retail","Health","Higher education"].forEach((n,i)=>withA(ctx,fin(t,cI+0.6+i*0.35),()=>{const x=440+i*260;tag(ctx,x,820,n,i===4?REF:SOFT,{align:"center",size:18});}));});
    withA(ctx,cand,()=>{T(ctx,t>cMc+0.4?"widely used by universities: MCDS · here we check against TCSI":t>cT+0.4?"one of the choices: TCSI, public, and what universities report":"reference models for higher education: which one, and why?",960,772,{w:600,size:18,align:"center",color:rgba(t>cT+0.4?REF:SOFT,1)});
      [["TCSI","Australia"],["HESA Data Futures","United Kingdom"],["CEDS","United States"],["MCDS","MortarCAPS"]].forEach(([n,r],i)=>withA(ctx,fin(t,cCh+0.5+i*0.35),()=>{const x=480+i*320,on=i===0?fin(t,cT+0.3):i===3?fin(t,cMc+0.3):0,dim=t>cT+0.3&&on<=0?0.45:1;
        if(on>0)glow(ctx,x,820,130,REF,0.5*on);withA(ctx,dim,()=>tag(ctx,x,820,n+" · "+r,on>0?REF:SOFT,{align:"center",size:17}));}));});});
  const pA=fin(t,cMc+4.2,0.5);if(pA>0){const hi={};if(sc.breathe&&t>B)["Student","Admission","Course","Enrolment","Unit"].forEach((k,i)=>{hi[k]=pulse(t,B+0.3+i*0.5,1.2);});// each box lights on its own chime (tools/audio.py)
    paper(ctx,pA,slideIn(t,cMc+4.2),t,hi);withA(ctx,fin(t,cF+0.2),()=>tag(ctx,1400,835,"a reference to check against, not a model to copy",REF,{align:"center",size:18}));}
  hud(ctx,S,fin(t,cK+0.4),131);
  setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 2. What is a class? ---------- */
scene("cls",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cQ=c("q"),cR=c("ref"),cH=c("hiding"),cU=c("unit"),cO=c("offering"),cC=c("classes"),cG=c("genie"),cGr=c("grain"),B=c("breath");
  bgW(ctx,S,CAM0);board(ctx,1,"Conceptual model");
  const u=ease(clamp((t-cH-0.2)/1.6,0,1)),uu=clamp((t-cH-0.2)/1.6,0,1),P1=k=>k==='Student'?[lerp(V1[k][0],L2[k][0],ease(clamp(uu*2-1,0,1))),lerp(V1[k][1],L2[k][1],u)]:k==='Course'?[lerp(V1[k][0],L2[k][0],ease(clamp(uu*2,0,1))),lerp(V1[k][1],L2[k][1],u)]:lerpP(V1[k],L2[k],u),PC=k=>lerpP(V1.Class,L2[k],u),split=sstep(0,0.3,u);
  const E={Student:{x:P1("Student")[0],y:P1("Student")[1],name:"Student"},Enrolment:{x:P1("Enrolment")[0],y:P1("Enrolment")[1],name:t>cO+1.2?"Unit enrolment":"Enrolment",hi:pulse(t,cO+0.8,2.4)},
    Course:{x:P1("Course")[0],y:P1("Course")[1],name:"Course"},Term:{x:P1("Term")[0],y:P1("Term")[1],name:"Term",sub:"census date"},
    Class:{x:PC("Class")[0],y:PC("Class")[1],name:"Class",hi:pulse(t,cQ,2.4)+pulse(t,cC,2.4),sub:t>cC?"Tue 9 am tutorial":null,subA:fin(t,cC),pin:t>cC+0.8?"extend":null,pinA:fin(t,cC+0.8)}};
  if(split>0){E.Offering={x:PC("Offering")[0],y:PC("Offering")[1],name:"Unit offering",a:split,hi:pulse(t,cO,2.4),sub:t>cO?"Semester 1 · city campus":null,subA:fin(t,cO),pin:t>cO+0.8?"extend":null,pinA:fin(t,cO+0.8)};
    E.Unit={x:PC("Unit")[0],y:PC("Unit")[1],name:"Unit",a:split,hi:pulse(t,cU,2.4),sub:t>cU?"Data Science 101":null,subA:fin(t,cU),pin:t>cU+0.8?"adopt":null,pinA:fin(t,cU+0.8)};}
  const R=V1R.map(r=>r.concat([{a:1-split}])).concat([["Student","Enrolment","1","*",{a:split}],["Enrolment","Offering","*","1",{a:split}],["Offering","Unit","*","1",{a:split}],["Offering","Class","1","*",{a:split}],["Offering","Term","*","1",{a:split}],["Student","Course","*","1",{a:split}]]);
  R[0][4].a=1;R[3][4].a=1;R[4][4].a=0;R[9][4].a=0;// student–enrolment and student–course stay, drawn once
  diagram(ctx,E,R);
  // what the pins mean, said once
  withA(ctx,brief(t,cU+0.9,3),()=>tag(ctx,1720,440,"from the reference",ADOPT,{align:"center",size:16}));
  withA(ctx,brief(t,cO+0.9,3),()=>tag(ctx,1200,440,"ours",EXT,{align:"center",size:16}));
  withA(ctx,brief(t,cC+0.9,3),()=>tag(ctx,1200,830,"ours",EXT,{align:"center",size:16}));
  // Genie counted places in tutorials: one student in two tutorials is counted twice
  withA(ctx,fin(t,cG)*(1-sstep(B+0.2,B+1,t)),()=>{[[1330,"Tue 9 am tutorial"],[1600,"Thu 2 pm tutorial"]].forEach(([x,s],i)=>{glass(ctx,x-125,220,250,130,14,SK,{glow:10,ea:0.6,fill:"rgba(7,12,24,0.9)"});T(ctx,s,x,252,{w:700,size:18,align:"center",color:rgba(SK,1)});
      dtile(ctx,x-40,300,48,0,{cell:7,q:2,app:"sis",hi:true},1);dtile(ctx,x+30,300,48,0,{cell:(i*9+4)%24,q:2,app:"sis"},1);});
    tag(ctx,1465,390,"one student, counted twice",BAD,{align:"center",size:18});glow(ctx,1290,300,60,BAD,0.35);glow(ctx,1560,300,60,BAD,0.35);});
  withA(ctx,fin(t,cGr),()=>{tag(ctx,760,610,"grain: one row = one student in one unit offering",REF,{align:"center",size:18});});
  stamp(ctx,1790,845,t>cH?"sketch v2 · draft":"sketch v1",t>cH?EXT:SK,1);
  // the reference has units of study and unit enrolments, and no class
  const pA=fin(t,cR-0.1,0.4)*(1-sstep(cH-0.3,cH+0.3,t));if(pA>0)paper(ctx,pA,slideIn(t,cR-0.1),t,{Unit:pulse(t,cR+1.5,3),Enrolment:pulse(t,cR+2.2,3)},{extra:c2=>withA(c2,fin(t,cR+2.6),()=>tag(c2,1560,440,"no class in the reference",REF,{align:"center",size:18}))});
  // the breather: each student lands once in the offering, however many tutorials they attend
  if(sc.breathe&&t>B){for(let k=0;k<6;k++){const t0=B+0.4+k*0.8,v=clamp((t-t0)/1.4,0,1);if(v<=0||v>=1)continue;const q=at(mk([P(90,510),P(760,510),P(1200,510)]),ease(v));dtile(ctx,q.x,q.y,30,0,{cell:(k*5+2)%24,q:2,app:"sis"},1-sstep(0.85,1,v));}
    for(let k=0;k<6;k++){const t0=B+1.8+k*0.8;if(t>t0&&t<t0+0.7)glow(ctx,1200,510,110,SK,0.45*(1-(t-t0)/0.7));}}
  hud(ctx,S,1,countTo(t,cG+2.2,131,125),cG+2.2,t);setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 3. Whose census date? ---------- */
const SUBC={Unit:{sub:"Data Science 101",pin:"adopt"},Offering:{sub:"Semester 1 · city campus",pin:"extend"},Class:{sub:"Tue 9 am tutorial",pin:"extend"},Enrolment:{name:"Unit enrolment"}};
const L2R=[["Student","Enrolment","1","*"],["Enrolment","Offering","*","1"],["Offering","Unit","*","1"],["Offering","Class","1","*"],["Offering","Term","*","1"],["Student","Course","*","1"]];
scene("census",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cQ=c("q"),cT=c("term"),cR=c("ref"),cS=c("summer"),cA=c("adopt"),B=c("breath");
  bgW(ctx,S,CAM0);board(ctx,1,"Conceptual model");
  const mv=ease(clamp((t-cA-0.3)/1.4,0,1)),E=E3(Object.keys(L2),L2,JSON.parse(JSON.stringify(SUBC)));
  E.Term.name=mv>0.5?"Teaching period":"Term";E.Term.sub=mv>0?null:"census date";E.Term.hi=pulse(t,cQ,2.6);E.Term.subCol=t>cQ?REF:null;if(mv>0.5)E.Term.pin="extend";
  if(mv>=1){E.Offering.sub="census date";E.Offering.subCol=REF;}else if(mv>0)E.Offering.subA=1-sstep(0,0.3,mv);
  E.Offering.hi=pulse(t,cA+1.4,2.4);diagram(ctx,E,L2R.map(r=>r.concat([{}])));
  // the census date moves from the term to the unit offering
  if(mv>0&&mv<1){const p=lerpP([1620,752],[1200,532],mv);T(ctx,"census date",p[0],p[1],{w:600,size:16,align:"center",color:rgba(REF,1)});glow(ctx,p[0],p[1]-6,60,REF,0.4);}
  withA(ctx,fin(t,cT+0.2)*(1-sstep(cA,cA+0.5,t)),()=>tag(ctx,1620,830,"one date for everyone",EXT,{align:"center",size:18}));
  // the same unit, two offerings, two census dates
  withA(ctx,fin(t,cS),()=>{calCard(ctx,1120,200,"DS101 · Semester 1","31 Mar",SK,1,pulse(t,cS+0.3,2)+(sc.breathe&&t>B?pulse(t,B+0.5,2)+pulse(t,B+2.9,2):0));calCard(ctx,1450,200,"DS101 · Summer","20 Jan",EXT,fin(t,cS+0.8),pulse(t,cS+1.1,2)+(sc.breathe&&t>B?pulse(t,B+1.7,2)+pulse(t,B+4.1,2):0));});
  withA(ctx,fin(t,cA+2.0),()=>tag(ctx,1200,610,"adopted from the reference",ADOPT,{align:"center",size:16}));
  stamp(ctx,1790,845,"sketch v2 · draft",EXT,1);
  const pA=fin(t,cR-0.1,0.4)*(1-sstep(cS-0.4,cS+0.2,t));if(pA>0)paper(ctx,pA,slideIn(t,cR-0.1),t,{Enrolment:pulse(t,cR+1.4,3.5)},{extra:c2=>withA(c2,fin(t,cR+1.8),()=>tag(c2,760,660,"census date, with each unit enrolment",REF,{align:"center",size:18}))});
  hud(ctx,S,1,countTo(t,cA+1.6,125,121),cA+1.6,t);setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 4. One student, two courses ---------- */
scene("courses",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cTw=c("twice"),cD=c("double"),cO=c("one"),cA=c("admission"),cOn=c("once"),cL=c("link"),B=c("breath");
  bgW(ctx,S,CAM0);board(ctx,1,"Conceptual model");
  const t0=cA+3.0,uC=ease(clamp((t-t0)/1.4,0,1)),uS=ease(clamp((t-t0-0.9)/1.2,0,1)),aA=fin(t,t0+0.7,0.8);
  const pos=Object.assign({},L2,{Course:lerpP(L2.Course,L3.Course,uC),Student:lerpP(L2.Student,L3.Student,uS),Admission:L3.Admission});
  const E=E3(Object.keys(pos),pos,{Unit:{sub:"Data Science 101",pin:"adopt"},Offering:{sub:"census date",subCol:REF,pin:"extend"},Class:{sub:"Tue 9 am tutorial",pin:"extend"},Term:{pin:"extend"},
    Student:{sub:t>cD&&t<cA+2?"double degree":null,subA:fin(t,cD)},Admission:{a:aA,pin:"adopt",pinA:fin(t,t0+1.4),hi:pulse(t,cL,2.6)}});
  const old=1-aA;diagram(ctx,E,[["Student","Enrolment","1","*",{a:old}],["Student","Course","*","1",{a:old,bad:fin(t,cO)*(0.6+0.4*Math.sin(t*3))*(1-sstep(cA,cA+1,t))}],
    ["Student","Admission","1","*",{a:aA}],["Admission","Course","*","1",{a:aA}],["Admission","Enrolment","1","*",{a:aA}],["Enrolment","Offering","*","1"],["Offering","Unit","*","1"],["Offering","Class","1","*"],["Offering","Term","*","1"]]);
  // two students, each counted twice: once per course
  const merge=ease(clamp((t-cOn-0.4)/1.2,0,1));withA(ctx,fin(t,cTw)*(1-sstep(B+0.5,B+1.3,t)),()=>{[0,1].forEach(i=>{const x=1480+i*230;glass(ctx,x-100,215,200,120,14,merge>0.5?GOOD:BAD,{glow:10,ea:0.6,fill:"rgba(7,12,24,0.9)"});
      dtile(ctx,x-lerp(34,0,merge),270,50,0,{cell:3+i*8,q:2,app:"sis",hi:true},1);dtile(ctx,x+lerp(34,0,merge),270,50,0,{cell:3+i*8,q:2,app:"sis",hi:true},1-merge);
      T(ctx,merge>0.5?"× 1":"× 2",x,322,{w:800,size:20,align:"center",color:rgba(merge>0.5?GOOD:BAD,1)});});
    tag(ctx,1595,380,merge>0.5?"each student counted once":"counted twice",merge>0.5?GOOD:BAD,{align:"center",size:18});});
  withA(ctx,fin(t,cD+0.6)*(1-sstep(cA+1.5,cA+2.2,t)),()=>{tag(ctx,470,250,"Bachelor of Data Science",SK,{size:16});tag(ctx,470,330,"Bachelor of Business",SK,{size:16});});
  withA(ctx,fin(t,cO+0.3)*(1-sstep(cA,cA+0.6,t)),()=>tag(ctx,360,400,"one course only?",BAD,{size:18}));
  withA(ctx,fin(t,cL+0.3),()=>tag(ctx,760,212,"the link gets its own box",ADOPT,{align:"center",size:17}));
  // the breather: each course admission carries its own unit enrolments
  if(sc.breathe&&t>B){[[L3.Student,L3.Admission,L3.Course],[L3.Student,L3.Admission,L3.Enrolment]].forEach((pts,i)=>{for(let k=0;k<2;k++){const v=clamp((t-B-0.5-i*1.2-k*2.4)/1.6,0,1);if(v<=0||v>=1)continue;const q=at(mk(pts.map(p=>P(p[0],p[1]))),ease(v));glow(ctx,q.x,q.y,26,C.white,0.9);glow(ctx,q.x,q.y,80,ADOPT,0.5);}});}
  stamp(ctx,1790,845,"sketch v2 · draft",EXT,1);
  const pA=fin(t,cA-0.1,0.4)*(1-sstep(cA+2.4,cA+3.0,t));if(pA>0)paper(ctx,pA,slideIn(t,cA-0.1),t,{Admission:pulse(t,cA+0.8,2.6)},{extra:c2=>withA(c2,fin(t,cA+1.0),()=>tag(c2,760,215,"one student, one course, one start date",REF,{align:"center",size:18}))});
  hud(ctx,S,1,countTo(t,cOn+0.6,121,119),cOn+0.6,t);setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 5. Enrolled when? ---------- */
scene("time",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cQ=c("q"),cT=c("today"),cC=c("change"),cX=c("extend"),cS=c("snap"),B=c("breath");
  bgW(ctx,S,CAM0);board(ctx,1,"Conceptual model");
  const strip=fin(t,cC-0.2)*(1-sstep(cX+0.6,cX+1.2,t)),sA=fin(t,cX+1.0,0.8),dim=1-0.7*strip;
  withA(ctx,dim,()=>sketchV2(ctx,{extra:{Enrolment:{sub:t>cX?"current status":null,subCol:REF,subA:fin(t,cX+0.2)}},pins:true,a:k=>k==="Status"?sA:1,pinA:k=>k==="Status"?fin(t,cX+1.8):1,hi:k=>k==="Enrolment"?pulse(t,cQ,2.4):k==="Status"?pulse(t,cS+0.4,2.6):0}));
  withA(ctx,fin(t,cT)*(1-sstep(cC-0.4,cC,t)),()=>{calCard(ctx,1470,180,"Genie counted","26 Apr",CYAN,1,0);calCard(ctx,1470,320,"Census report","31 Mar",LAYER.gold,fin(t,cT+1.2),0);});
  // one enrolment's story, frame by frame; the census count is a snapshot of one day
  const fr=[{s:"waitlisted",d:"3 Mar",col:EXT},{s:"enrolled",d:"10 Mar",col:GOOD},{s:"census date",d:"31 Mar",col:REF},{s:"withdrew",d:"14 Apr",col:BAD}];
  fr.forEach((f,i)=>{f.a=fin(t,cC+0.4+i*0.9);f.hi=i===2?pulse(t,cC+3.2,2):0;});
  filmStrip(ctx,590,330,fr,strip,0,t);
  withA(ctx,fin(t,cX+1.8),()=>tag(ctx,760,830,"ours: the history of each enrolment",EXT,{align:"center",size:17}));
  if(t>cS+0.3&&t<cS+1.3){const v=(t-cS-0.3);glow(ctx,760,730,320,C.white,0.6*(1-v));}
  withA(ctx,fin(t,cS+0.8),()=>tag(ctx,1200,620,"census count: a snapshot on 31 Mar",REF,{align:"center",size:17}));
  // the breather: changes keep arriving, and each one is kept with its date
  if(sc.breathe&&t>B){for(let k=0;k<4;k++){const v=clamp((t-B-0.4-k*1.3)/1.1,0,1);if(v<=0||v>=1)continue;glow(ctx,760,lerp(560,700,ease(v)),22,C.white,0.9);glow(ctx,760,lerp(560,700,ease(v)),70,EXT,0.5);}}
  stamp(ctx,1790,845,"sketch v2 · draft",EXT,1);
  hud(ctx,S,1,countTo(t,cS+1.6,119,118),cS+1.6,t);setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 6. Three levels of precision ---------- */
scene("levels",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cSt=c("still"),cC=c("concept"),cL=c("logical"),cP=c("physical"),cA=c("agree"),cN=c("another"),B=c("breath");
  const cam=camAt([[0,960,540,1],[cL,960,540,1],[cL+1.6,980,520,1.45],[cP,980,520,1.45],[cP+1.4,960,540,1.12],[cA-0.2,960,540,1.12],[cA+0.6,960,540,1]],t);
  bgW(ctx,S,cam);const scA=1-sstep(cA-0.4,cA+0.4,t),lg=fin(t,cL+0.6,1.0),ph=fin(t,cP+0.2,0.8);
  withA(ctx,scA,()=>{board(ctx,1-ph*0.6,null);
    withA(ctx,1-ph*0.95,()=>{const E=E3(Object.keys(L3),L3,{Offering:{sub:lg>0?null:"census date",subCol:REF,attrs:lg>0?[["unit code","id"],["census date","id"],["teaching period",""],["campus",""],["mode",""]]:null,attrA:lg},
        Enrolment:{attrs:lg>0?[["course admission","id"],["unit offering","id"],["current status",""]]:null,attrA:lg},Unit:{sub:"Data Science 101"},Class:{sub:"Tue 9 am tutorial"},Status:{sub:"status · date"}});
      Object.keys(E).forEach(k=>{if(k!=="Enrolment"&&k!=="Offering")E[k].a=1-0.6*lg;});
      diagram(ctx,E,L3R.map(r=>r.concat([{words:r[0]==="Enrolment"&&r[1]==="Offering"?lg:0}])));});
    // the physical model: tables in the platform
    withA(ctx,ph,()=>{const rw=j=>fin(t,cP+0.8+j*0.3);table(ctx,620,300,"unit_enrolment",["course_admission_id","unit_code","census_date","status"],[["CA-20417","DS101","2026-03-31","enrolled"],["CA-20417","BUS110","2026-03-31","enrolled"],["CA-31802","DS101","2026-01-20","withdrew"]],{rowA:rw});
      table(ctx,590,560,"unit_offering",["unit_code","census_date","teaching_period","campus","mode"],[["DS101","2026-03-31","2026-S1","city","on site"],["DS101","2026-01-20","2026-SUM","city","intensive"]],{rowA:rw});});});
  setScreen(ctx,S);
  withA(ctx,scA,()=>{const lab=t<cL+0.6?"Conceptual model · for the business":t<cP+0.2?"Logical model · identifiers, details, how many":"Physical model · tables in the platform";const col=t<cL+0.6?SK:t<cP+0.2?REF:GOOD;
    withA(ctx,fin(t,cC),()=>tag(ctx,960,120,lab,col,{align:"center",size:22}));});
  // three levels, side by side: the same meaning, owned by different people
  const pa=fin(t,cA-0.2,0.8),dimN=1-0.92*fin(t,cN+0.1,0.8);
  withA(ctx,pa*dimN,()=>{[["Conceptual","owned by the business",SK],["Logical","shared",REF],["Physical","owned by engineers",GOOD]].forEach(([n,o,col],i)=>withA(ctx,fin(t,cA+i*0.6),()=>{const x=150+i*560;glass(ctx,x,230,500,470,20,col,{glow:16,ea:0.6,fill:"rgba(7,12,24,0.9)"});T(ctx,n,x+250,285,{w:800,size:30,align:"center",color:rgba(col,1)});
      if(i===0){const E={A:{x:x+140,y:420,name:"Unit enrolment",s:0.7},B:{x:x+360,y:420,name:"Unit offering",s:0.7},C:{x:x+360,y:560,name:"Unit",s:0.7}};diagram(ctx,E,[["A","B","*","1",{s:0.7}],["B","C","*","1",{s:0.7}]]);}
      if(i===1)ent(ctx,{x:x+250,y:470,name:"Unit offering",s:0.72,attrs:[["unit code","id"],["census date","id"],["teaching period",""],["campus",""]]});
      if(i===2)table(ctx,x+40,360,"unit_offering",["unit_code","census_date"],[["DS101","2026-03-31"],["DS101","2026-01-20"],["BUS110","2026-03-31"]],{col:GOOD,cw:[190,230]});
      tag(ctx,x+250,650,o,col,{align:"center",size:18});}));
    withA(ctx,fin(t,cA+2.4),()=>{lane(ctx,[P(400,205),P(1520,205)],[255,255,255],0.5);tag(ctx,960,205,"same meaning, three levels of detail",C.white,{align:"center",size:18});});});
  // a glimpse of the engineers' film: the same tables can take different shapes
  withA(ctx,fin(t,cN+0.5,0.8),()=>{const cx=700,cy=470;[[0,-70],[110,0],[0,70],[-110,0]].forEach(([dx,dy])=>{ctx.strokeStyle=rgba(LAYER.gold,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+dx,cy+dy);ctx.stroke();glass(ctx,cx+dx-34,cy+dy-16,68,32,8,LAYER.gold,{glow:8,ea:0.7});});glass(ctx,cx-44,cy-22,88,44,10,LAYER.gold,{glow:14,ea:0.9});
    for(let k=0;k<9;k++){glass(ctx,1000+k*58,cy-20,54,40,6,LAYER.gold,{glow:6,ea:0.6+0.3*Math.sin(t*2+k)});}T(ctx,"a star",cx,cy+124,{w:600,size:18,align:"center",color:rgba(SOFT,1)});T(ctx,"one wide row per student",1261,cy+56,{w:600,size:18,align:"center",color:rgba(SOFT,1)});
    tag(ctx,960,cy+220,"how to build them: another film",LAYER.gold,{align:"center",size:22});});
  setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 7. Check, adopt, extend, record ---------- */
scene("fit",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cLi=c("lift"),cCh=c("check"),cAd=c("adopt"),cEx=c("extend"),cRe=c("record"),cCa=c("cage"),B=c("breath");
  const cam=camAt([[0,960,540,1],[cRe,960,540,1],[cRe+1.2,1225,530,0.86],[cCa-0.2,1225,530,0.86],[cCa+1.0,960,540,1]],t);bgW(ctx,S,cam);board(ctx,1,"Conceptual model");
  const pins=Object.keys(L3),pinT=k=>cLi+2.2+pins.indexOf(k)*0.25,br=sc.breathe&&t>B;
  sketchV2(ctx,{pins:true,pinA:k=>fin(t,pinT(k),0.3),pinP:k=>(PINS[k]==="adopt"?pulse(t,cAd+0.4,2.4):pulse(t,cEx+0.4,2.4))+(br?pulse(t,B+0.5+pins.indexOf(k)*0.5,1.4):0),
    hi:k=>PINS[k]==="adopt"?pulse(t,cAd+0.4,2.4):pulse(t,cEx+0.4,2.4)});
  // the reference lifts away, then the four steps
  const up=ease(clamp((t-cLi-0.3)/1.8,0,1)),cg=pulse(t,cCh+0.3,2.6);if(up<1||cg>0)paper(ctx,up<1?1-up:0.35*cg,0,t,{},{dy:up<1?-760*up:0,rot:-0.006-0.02*up});
  const steps=[["Check",cCh,REF],["Adopt",cAd,ADOPT],["Extend",cEx,EXT],["Record",cRe,C.white]];
  steps.forEach(([s,t0,col],i)=>withA(ctx,fin(t,t0-0.1),()=>{const on=t<(steps[i+1]?steps[i+1][1]:cCa)||t>cCa?1:0.45;withA(ctx,on,()=>tag(ctx,470+i*250,212,(i+1)+"  "+s,col,{align:"center",size:20}));}));
  // the fit register: every difference, and why
  withA(ctx,fin(t,cRe+0.8,0.8)*(1-sstep(cCa+0.2,cCa+0.9,t)),()=>{const x=1850,y=200,w=460;glass(ctx,x,y,w,620,18,C.white,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.94)"});T(ctx,"Fit register",x+26,y+48,{w:800,size:26});T(ctx,"sketch v2 · checked against TCSI",x+26,y+78,{w:500,size:16,color:rgba(SOFT,1)});
    [["Unit offering","TCSI identifies it by unit","and census date"],["Class","a timetabled activity,","not in TCSI"],["Status change","TCSI keeps the current","status only"],["Teaching period","groups offerings in time"]].forEach((r,i)=>withA(ctx,fin(t,cRe+1.4+i*0.5),()=>{const yy=y+140+i*118;led(ctx,x+26,yy-18,6,76,EXT);T(ctx,r[0]+"  ·  extended",x+46,yy,{w:700,size:20,color:rgba(EXT,1)});T(ctx,r[1],x+46,yy+28,{w:500,size:17,color:rgba(SOFT,1)});if(r[2])T(ctx,r[2],x+46,yy+52,{w:500,size:17,color:rgba(SOFT,1)});}));});
  withA(ctx,fin(t,cCa+0.9),()=>tag(ctx,960,845,"a starting point, not a cage",C.white,{align:"center",size:18}));
  stamp(ctx,1790,845,"sketch v2 · draft",EXT,1);setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 8. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cAg=c("again"),cAs=c("asks"),cAn=c("answer"),cV=c("version"),cE=c("evolve"),cTg=c("tag");
  if(t<cTg-0.25){bgW(ctx,S,CAM0);const q1=1-sstep(cV-0.3,cV+0.5,t);
    withA(ctx,q1,()=>{asker(ctx,t,fin(t,0.1),"How many students were enrolled in Data Science 101 on census date?",fin(t,cAg));
      withA(ctx,fin(t,cAs-0.1),()=>{tag(ctx,500,470,"Genie",LAYER.gold,{size:18});bubble(ctx,480,505,660,"Enrolled on census date, in the Semester 1 offering?",LAYER.gold,{size:28});});
      withA(ctx,fin(t,cAn),()=>{numCard(ctx,1220,230,560,"Genie","118","matches the census report",GOOD);
        glass(ctx,1220,470,560,230,18,SK,{glow:12,ea:0.6,fill:"rgba(7,12,24,0.92)"});T(ctx,"How it counted",1248,512,{w:800,size:22});
        ["one row = one student in one unit offering","enrolled on census date, 31 Mar","each student counted once"].forEach((s,i)=>withA(ctx,fin(t,cAn+0.8+i*0.5),()=>{led(ctx,1250,538+i*50,6,30,SK);T(ctx,s,1270,560+i*50,{w:600,size:19,color:rgba(INK,0.95)});}));});});
    // the sketch, version 2, with a note that says why it changed; then a new question arrives
    const vA=fin(t,cV-0.1,0.8);withA(ctx,vA,()=>{const pos=lay(L3,0.72,760,520);glass(ctx,110,170,1300,720,22,SK,{glow:18,ea:0.35,fill:"rgba(10,18,36,0.5)"});sketchV2(ctx,{pos,s:0.72,pins:true});
      const fl=t>cE+2.2?t:0;stamp(ctx,1390,845,t>cE+2.2?"sketch v3?":"sketch v2",t>cE+2.2?EXT:GOOD,1,fl?t-cE:0);
      glass(ctx,1460,210,400,250,18,GOOD,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.94)"});T(ctx,"sketch v2",1486,254,{f:"mono",w:500,size:22,color:rgba(GOOD,1)});
      ["added: unit offering,","course admission, status history","why: two numbers disagreed","checked against TCSI"].forEach((s,i)=>T(ctx,s,1486,296+i*38,{w:600,size:18,color:rgba(i<2?INK:SOFT,0.95)}));
      withA(ctx,fin(t,cE+0.4),()=>{glass(ctx,1460,520,400,150,18,EXT,{glow:18+8*Math.sin(t*4),ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,"A new question",1486,562,{w:800,size:20,color:rgba(EXT,1)});T(ctx,"How do we count short courses",1486,600,{w:600,size:18});T(ctx,"and microcredentials?",1486,630,{w:600,size:18});});});
    vign(ctx,S);}
  else{clearTo(ctx,S);withA(ctx,fin(t,cTg-0.25,0.8),()=>T(ctx,"Check the reference. Fit it to the business.",W/2,H/2-6,{w:800,size:72,align:"center"}));
    withA(ctx,fin(t,cTg+1.2,0.8),()=>{T(ctx,"A Sharper Sketch",W/2,H/2+76,{w:700,size:32,align:"center",color:rgba(SOFT,1)});T(ctx,"Learning Data · film three",W/2,H/2+118,{w:500,size:22,align:"center",color:rgba(SOFT,0.7)});});}
});
