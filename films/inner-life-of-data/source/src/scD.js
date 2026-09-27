/* ===== v4 scenes, part D ===== */
scene("people",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cAp=c("app"),cFx=c("fix"),cGe=c("genie"),cAs=c("ask"),cAn=c("answer"),cPe=c("perms");
  const cam=camAt([[0,600,480,1.15],[cGe-0.7,615,484,1.19],[cGe+1.3,1420,470,1.05],[cAn-0.2,1420,470,1.05],[cAn+0.8,1520,470,1.1],[sc.dur+2,1520,470,1.12]],t);bgW(ctx,S,cam);
  screen2(ctx,220,250,560,330,[150,200,255]);chip(ctx,500,196,"databricks","Databricks App","for student services",{align:"center"});
  const sl=fin(t,cAp+0.2,1.0);if(sl>0){ctx.save();ctx.beginPath();ctx.rect(220,250,560,330);ctx.clip();ctx.translate(lerp(-600,0,ease(sl)),0);ctx.fillStyle="#eef1f7";rr(ctx,260,290,480,250,12);ctx.fill();ctx.fillStyle="#c9d3e3";ctx.beginPath();ctx.arc(340,380,46,0,TAU);ctx.fill();
    T(ctx,"Alex Rivera",410,372,{w:800,size:32,color:"#141821"});T(ctx,"Student ID 10482213",410,406,{w:600,size:20,color:"#4b5563"});const ty=clamp((t-cFx-0.8)/1.6,0,1),cur=ty<=0?"BSc Dta Sci":"BSc Data Science".slice(0,Math.max(4,Math.round(16*ty)));
    T(ctx,"Degree",300,492,{w:700,size:22,color:"#4b5563"});ctx.fillStyle=ty>0?"rgba(60,190,110,0.28)":"rgba(255,90,90,0.25)";rr(ctx,396,462,310,40,8);ctx.fill();T(ctx,cur,410,491,{f:"mono",w:500,size:24,color:"#141821"});ctx.restore();
    if(sl<1){ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=rgba(C.hot,0.8);ctx.fillRect(220+sl*560-3,250,6,330);ctx.restore();}}
  const pT=cFx+2.6;withA(ctx,fin(t,pT-0.6),()=>{const L=[P(500,584),P(500,690),P(230,690)];lane(ctx,L,GOOD,0.9);vault(ctx,70,610,160,170,LAYER.bronze,(r,k)=>hash(r*5+k,3)>0.6?null:APP.sis.c,null);T(ctx,"Bronze",150,648,{w:800,size:18,align:"center",color:rgba(LAYER.bronze,1)});chip(ctx,380,760,"databricks","Lakebase","the correction lands here first",{align:"center",ts:18,ss:15});
    if(t>pT){const u=clamp((t-pT)/2.4,0,1),q=at(mk(L),ease(u));dtile(ctx,q.x,q.y,44,0,{cell:7,q:2},1-sstep(0.9,1,u));}});
  withA(ctx,fin(t,pT+1.2)*(1-sstep(cGe,cGe+0.6,t)),()=>tag(ctx,620,640,"back into the platform",GOOD,{align:"center",size:17}));
  const gA=fin(t,cGe-0.2);withA(ctx,gA,()=>{brainNet(ctx,1200,235,0.36,t,0.7,{labels:false});ctx.save();ctx.setLineDash([4,8]);ctx.strokeStyle=rgba(LAYER.gold,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1260,480);ctx.lineTo(1230,330);ctx.stroke();ctx.restore();orb(ctx,1260,520,30,t);chip(ctx,1260,640,"databricks","Genie","guided by Genie Ontology",{align:"center",edge:LAYER.gold});});
  withA(ctx,fin(t,cAs,0.5),()=>{glass(ctx,1440,200,470,120,16,[230,236,248],{glow:10,ea:0.6,fill:"rgba(244,241,234,0.97)"});ctx.fillStyle="rgba(244,241,234,0.97)";ctx.beginPath();ctx.moveTo(1452,300);ctx.lineTo(1330,440);ctx.lineTo(1500,318);ctx.fill();T(ctx,"Which first-year classes need",1466,250,{w:700,size:26,color:"#141821"});T(ctx,"more seats next semester?",1466,286,{w:700,size:26,color:"#141821"});});
  const na=fin(t,cAn,0.6),y0=360;withA(ctx,na,()=>{glass(ctx,1440,y0,470,400,16,LAYER.gold,{glow:16,ea:0.7,fill:"rgba(8,14,26,0.96)"});T(ctx,"Data Science 101",1466,y0+50,{size:32,w:800});T(ctx,"98% full two weeks before census",1466,y0+92,{size:22,w:600,color:rgba(SOFT,1)});T(ctx,"140 students on the waitlist",1466,y0+126,{size:22,w:600,color:rgba(SOFT,1)});
    ctx.fillStyle="rgba(120,240,170,0.16)";rr(ctx,1462,y0+146,426,46,8);ctx.fill();T(ctx,"Suggestion: open a second class",1480,y0+177,{size:22,w:700,color:rgba(GOOD,1)});T(ctx,"Sources",1466,y0+232,{size:18,w:700,color:rgba(SOFT,0.8)});
    ["Enrolments (certified)","Census-date policy","New-class approval process"].forEach((s,i)=>withA(ctx,fin(t,cAn+0.8+i*0.4,0.3),()=>tag(ctx,1466,y0+264+i*40,s,LAYER.gold,{size:15})));
    const pm=fin(t,cPe,0.5);if(pm>0)withA(ctx,pm,()=>{ctx.fillStyle="rgba(120,130,150,0.94)";rr(ctx,1790,y0+248,100,112,10);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=3;rr(ctx,1826,y0+292,28,22,4);ctx.stroke();ctx.beginPath();ctx.arc(1840,y0+292,9,Math.PI,0);ctx.stroke();T(ctx,"names",1840,y0+344,{size:16,w:700,align:"center",color:"#fff"});});});
  // the breather: Genie keeps consulting Genie Ontology, and the answer's sources light up one by one
  const B=c("breath");if(sc.breathe&&t>B){spawn(t,0.9,1.0,B,u=>glow(ctx,lerp(1230,1258,u),lerp(330,486,u),16,LAYER.gold,1));glow(ctx,1260,520,100,[255,226,160],0.2*(0.5+0.5*Math.sin((t-B)*3)));
    ["Enrolments (certified)","Census-date policy","New-class approval process"].forEach((s2,i)=>{const v=(t-B-0.5-i*0.9)/1.0;if(v>0&&v<1){const w=tw(ctx,s2,15,700)+26;glow(ctx,1466+w/2,y0+264+i*40,w*0.6,LAYER.gold,0.55*Math.sin(v*Math.PI));}});}
  vign(ctx,S);
});
scene("end",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cRe=c("recap"),cSe=c("seats"),cTg=c("tag");
  if(t<cSe-0.2){const L=SCENES.find(s=>s.id==="layers"),cam=camAt([[0,1135,540,1.1],[cSe,1135,540,0.86]],t),fake=Object.assign({},L,{cues:{back:-100,appdom:-100,bsg:-100,busdom:-100,dbtgov:-100,dbx:-100},_cam:cam});L.draw(ctx,S,t+50,fake);setCam(ctx,S,cam);
    const path=mk([P(190,513),P(400,617),P(540,617),P(900,617),P(1260,617),P(1440,560),P(1675,513),P(1908,513),P(1908,650),P(2090,650)]),u=ease(clamp((t-cRe-0.2)/(cSe-cRe-0.6),0,1)),q=at(path,u);glow(ctx,q.x,q.y,50,C.white,0.95);glow(ctx,q.x,q.y,160,LAYER.gold,0.45);
    const sub=[];for(let i=0;i<=40;i++)sub.push(at(path,u*i/40));beam(ctx,sub,LAYER.gold,[[14,0.06],[5,0.22],[2,0.9]]);}
  else if(t<cTg-0.25){const a=fin(t,cSe-0.2,0.5),cam={x:960,y:540,z:1+0.03*clamp((t-cSe)/(cTg-cSe),0,1)};bgW(ctx,S,cam);withA(ctx,a,()=>{phone3(ctx,600,540,1.8,{screen:"confirm"});glass(ctx,960,330,660,420,20,GOOD,{glow:22,ea:0.7});T(ctx,"Data Science 101",1000,400,{w:800,size:44});T(ctx,"New class added",1000,450,{w:800,size:26,color:rgba(GOOD,1)});T(ctx,"Tuesday 11:00 · room C310",1000,510,{w:600,size:26,color:rgba(SOFT,1)});
    glass(ctx,1000,550,580,150,14,DOM.students.c,{glow:10,ea:0.7});T(ctx,"140",1030,654,{w:800,size:84,color:rgba(DOM.students.c,1)});T(ctx,"more seats",1230,640,{w:700,size:34});});vign(ctx,S);}
  else{clearTo(ctx,S);const a=fin(t,cTg-0.25,0.8);withA(ctx,a,()=>T(ctx,"Move less. Mean more.",W/2,H/2-6,{w:800,size:104,align:"center"}));withA(ctx,fin(t,cTg+1.2,0.8),()=>{T(ctx,"The Inner Life of Data",W/2,H/2+76,{w:700,size:32,align:"center",color:rgba(SOFT,1)});T(ctx,"University edition",W/2,H/2+118,{w:500,size:22,align:"center",color:rgba(SOFT,0.7)});});}
});
