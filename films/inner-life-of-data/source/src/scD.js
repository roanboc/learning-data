/* ===== v4 scenes, part D ===== */
/* Read on a phone (PLAYBOOK.md, "Make it read on a phone"): these helpers lay the scenes out by the size their words are drawn at.
   They do nothing where the phone layer isn't loaded (the site's labs), so there the scenes keep their sizes. */
// the smallest size that reads, in the current drawing's units (0 without the phone layer)
function il_D_m(ctx){return typeof phMin==="function"?phMin(ctx):0;}
// the same, for a shot whose camera is never wider than zoom z while these words are on screen: steady as the camera drifts in
function il_D_dm(ctx,z){const m=il_D_m(ctx);return m?Math.max(m,(typeof PH_MIN!=="undefined"?PH_MIN:28)/z):0;}
// how much larger a chip is drawn so that its smaller line (base px) reads at dm
function il_D_k(dm,base){return dm?clamp(dm/base,1,1.7):1;}
// a chip's width as chip() measures it, before it's drawn larger
function il_D_chipW(ctx,title,sub,o){o=o||{};return 14+(o.lh||(sub?34:28))+12+Math.max(tw(ctx,title,o.ts||22,700),sub?tw(ctx,sub,o.ss||17,500):0)+16;}
// a chip drawn k times larger from its anchor (x,y), the way the phone layer grows one, but by a steady k
function il_D_chip(ctx,x,y,k,logoKey,title,sub,o){ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);chip(ctx,x,y,logoKey,title,sub,o);ctx.restore();}
// draw as decoration: a picture seen from afar, whose words are texture
function il_D_deco(on,fn){return on&&typeof phAsDeco==="function"?phAsDeco(true,fn):fn();}
// the permissions lock: a grey pill with a padlock and the word it hides, as wide as the word; xr is its right edge, yc its middle
function il_D_lockW(ctx,ls){return 16+ls*0.8+10+tw(ctx,"names",ls,700)+18;}
function il_D_lock(ctx,xr,yc,ls){const w=il_D_lockW(ctx,ls),h=ls+18,x=xr-w,ib=ls*0.8,ih=ls*0.62,r=ib*0.3,bx=x+16,by=yc-ls*0.135,cx=bx+ib/2;
  ctx.fillStyle="rgba(120,130,150,0.94)";rr(ctx,x,yc-h/2,w,h,10);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=Math.max(2.5,ls*0.1);rr(ctx,bx,by,ib,ih,4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-r,by);ctx.lineTo(cx-r,by-r*0.5);ctx.arc(cx,by-r*0.5,r,Math.PI,0);ctx.lineTo(cx+r,by);ctx.stroke();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(cx,by+ih*0.45,Math.max(1.5,ls*0.07),0,TAU);ctx.fill();
  T(ctx,"names",bx+ib+10,yc+ls*0.36,{size:ls,w:700,color:"#fff"});}

scene("people",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cAp=c("app"),cFx=c("fix"),cGe=c("genie"),cAs=c("ask"),cAn=c("answer"),cPe=c("perms");
  // close on the app; a glide to Genie as the app fades; then in a little on the answer (1.5 s)
  const cam=camAt([[0,540,500,1.15],[cGe-0.7,552,502,1.18],[cGe+1.3,1465,480,1.1],[cAn-0.5,1465,480,1.1],[cAn+1.0,1480,490,1.13],[sc.dur+2,1480,490,1.15]],t);bgW(ctx,S,cam);
  // the app: its words at the size that reads at the shot's widest (zoom 1.15); it fades as the camera leaves it, so nothing is left cut at the frame's edge
  const dA=il_D_dm(ctx,1.15),sA=v=>Math.max(v,dA),pT=cFx+2.6;
  withA(ctx,1-sstep(cGe-0.2,cGe+0.6,t),()=>{
    screen2(ctx,220,250,560,330,[150,200,255]);il_D_chip(ctx,500,196,il_D_k(dA,17),"databricks","Databricks App","for student services",{align:"center"});
    const sl=fin(t,cAp+0.2,1.0);if(sl>0){ctx.save();ctx.beginPath();ctx.rect(220,250,560,330);ctx.clip();ctx.translate(lerp(-600,0,ease(sl)),0);ctx.fillStyle="#eef1f7";rr(ctx,260,290,480,250,12);ctx.fill();ctx.fillStyle="#c9d3e3";ctx.beginPath();ctx.arc(340,380,46,0,TAU);ctx.fill();
      T(ctx,"Alex Rivera",410,372,{w:800,size:32,color:"#141821"});T(ctx,"Student ID 10482213",410,406,{w:600,size:sA(20),color:"#4b5563"});const ty=clamp((t-cFx-0.8)/1.6,0,1),cur=ty<=0?"BSc Dta Sci":"BSc Data Science".slice(0,Math.max(4,Math.round(16*ty)));
      // the degree's field runs to the card's edge, so the longer Spanish name fits in it
      T(ctx,"Degree",292,492,{w:700,size:sA(22),color:"#4b5563"});ctx.fillStyle=ty>0?"rgba(60,190,110,0.28)":"rgba(255,90,90,0.25)";rr(ctx,392,462,332,40,8);ctx.fill();T(ctx,cur,404,491,{f:"mono",w:500,size:sA(24),color:"#141821"});ctx.restore();
      if(sl<1){ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=rgba(C.hot,0.8);ctx.fillRect(220+sl*560-3,250,6,330);ctx.restore();}}
    // the correction flows down into Bronze; Lakebase's chip sits under the lane, clear of the vault, and the lane's tag beside it
    withA(ctx,fin(t,pT-0.6),()=>{const L=[P(500,584),P(500,662),P(232,662)];lane(ctx,L,GOOD,0.9);vault(ctx,70,590,160,144,LAYER.bronze,(r,k)=>hash(r*5+k,3)>0.6?null:APP.sis.c,null);
      T(ctx,"Bronze",150,662+sA(18)*0.36,{w:800,size:sA(18),align:"center",color:rgba(LAYER.bronze,1)});il_D_chip(ctx,252,734,il_D_k(dA,15),"databricks","Lakebase","the correction lands here first",{ts:18,ss:15});
      if(t>pT){const u=clamp((t-pT)/2.4,0,1),q=at(mk(L),ease(u));dtile(ctx,q.x,q.y,44,0,{cell:7,q:2},1-sstep(0.9,1,u));}});
    withA(ctx,fin(t,pT+1.2),()=>tag(ctx,528,622,"back into the platform",GOOD,{size:sA(17)}));});
  // Genie, a little left of where it was, so its chip, drawn at the size that reads, stays clear of the answer
  const OX=1190,dG=il_D_dm(ctx,1.1),sG=v=>Math.max(v,dG),kG=il_D_k(dG,17),gW=il_D_chipW(ctx,"Genie","guided by Genie Ontology")*kG;
  const gA=fin(t,cGe-0.2);withA(ctx,gA,()=>{brainNet(ctx,OX-60,235,0.36,t,0.7,{labels:false});ctx.save();ctx.setLineDash([4,8]);ctx.strokeStyle=rgba(LAYER.gold,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(OX,480);ctx.lineTo(OX-30,330);ctx.stroke();ctx.restore();orb(ctx,OX,520,30,t);
    il_D_chip(ctx,OX,640,kG,"databricks","Genie","guided by Genie Ontology",{align:"center",edge:LAYER.gold});});
  // the question and the answer share one column, as wide as its longest line at the size it's drawn (steady from zoom 1.1 in)
  const SRC=["Enrolments (certified)","Census-date policy","New-class approval process"],qs=sG(26),bs=sG(22),ss=sG(18),ts=sG(15),ls=sG(16),
    CX=Math.max(1440,OX+gW/2+36),Wc=Math.max(470,tw(ctx,"Which first-year classes need",qs,700)+52,tw(ctx,"more seats next semester?",qs,700)+52,tw(ctx,"Data Science 101",32,800)+52,
      tw(ctx,"98% full two weeks before census",bs,600)+52,tw(ctx,"140 students on the waitlist",bs,600)+52,tw(ctx,"Suggestion: open a second class",bs,700)+80,
      ...SRC.map(s=>tw(ctx,s,ts,700)+78),26+tw(ctx,"Sources",ss,700)+30+il_D_lockW(ctx,ls)+26),
    qy2=250+qs*1.38,qh=Math.round(qy2+34-200);
  withA(ctx,fin(t,cAs,0.5),()=>{glass(ctx,CX,200,Wc,qh,16,[230,236,248],{glow:10,ea:0.6,fill:"rgba(244,241,234,0.97)"});ctx.fillStyle="rgba(244,241,234,0.97)";ctx.beginPath();ctx.moveTo(CX+12,200+qh-20);ctx.lineTo(OX+70,440);ctx.lineTo(CX+60,200+qh-2);ctx.fill();
    T(ctx,"Which first-year classes need",CX+26,250,{w:700,size:qs,color:"#141821"});T(ctx,"more seats next semester?",CX+26,qy2,{w:700,size:qs,color:"#141821"});});
  // the answer's rows, each placed below the one before by the size it's drawn at; the lock sits in the sources' heading row
  const y0=200+qh+40,yT=y0+50,y1=yT+bs*1.55,y2=y1+bs*1.35,bTop=y2+bs*0.6,bH=bs+22,ph=ls+18,yS=bTop+bH+14+ph/2,tH=ts+16,tagY=i=>yS+ph/2+8+tH/2+i*(tH+8),cH=tagY(2)+tH/2+20-y0;
  const na=fin(t,cAn,0.6);withA(ctx,na,()=>{glass(ctx,CX,y0,Wc,cH,16,LAYER.gold,{glow:16,ea:0.7,fill:"rgba(8,14,26,0.96)"});T(ctx,"Data Science 101",CX+26,yT,{size:32,w:800});T(ctx,"98% full two weeks before census",CX+26,y1,{size:bs,w:600,color:rgba(SOFT,1)});T(ctx,"140 students on the waitlist",CX+26,y2,{size:bs,w:600,color:rgba(SOFT,1)});
    ctx.fillStyle="rgba(120,240,170,0.16)";rr(ctx,CX+22,bTop,Wc-44,bH,8);ctx.fill();T(ctx,"Suggestion: open a second class",CX+40,bTop+bH/2+bs*0.36,{size:bs,w:700,color:rgba(GOOD,1)});T(ctx,"Sources",CX+26,yS+ss*0.36,{size:ss,w:700,color:rgba(SOFT,0.8)});
    SRC.forEach((s,i)=>withA(ctx,fin(t,cAn+0.8+i*0.4,0.3),()=>tag(ctx,CX+26,tagY(i),s,LAYER.gold,{size:ts})));
    const pm=fin(t,cPe,0.5);if(pm>0)withA(ctx,pm,()=>il_D_lock(ctx,CX+Wc-26,yS,ls));});
  // the breather: Genie keeps consulting Genie Ontology, and the answer's sources light up one by one
  const B=c("breath");if(sc.breathe&&t>B){spawn(t,0.9,1.0,B,u=>glow(ctx,lerp(OX-30,OX-2,u),lerp(330,486,u),16,LAYER.gold,1));glow(ctx,OX,520,100,[255,226,160],0.2*(0.5+0.5*Math.sin((t-B)*3)));
    SRC.forEach((s2,i)=>{const v=(t-B-0.5-i*0.9)/1.0;if(v>0&&v<1){const w=tw(ctx,s2,ts,700)+26;glow(ctx,CX+26+w/2,tagY(i),w*0.6,LAYER.gold,0.55*Math.sin(v*Math.PI));}});}
  vign(ctx,S);
});
scene("end",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cRe=c("recap"),cSe=c("seats"),cTg=c("tag");
  // the recap: the whole platform from afar, one light travelling through it. The diagram's words were read up close in The layers
  // together; here they're texture, and the narration names none of them. It opens on the application side to the business side,
  // whole and uncut, so the light ("one tap") is seen leaving its source; then it pulls back (2.8 s) and what consumes it is in the
  // frame before the light gets there. The frame's left edge stays left of the sources all the way
  if(t<cSe-0.2){const L=SCENES.find(s=>s.id==="layers"),cam=camAt([[0,960,540,1.02],[cRe+0.3,960,540,1.02],[Math.min(cRe+3.1,cSe-0.2),1135,540,0.86]],t),fake=Object.assign({},L,{cues:{back:-100,appdom:-100,bsg:-100,busdom:-100,dbtgov:-100,dbx:-100},_cam:cam});il_D_deco(true,()=>L.draw(ctx,S,t+50,fake));setCam(ctx,S,cam);
    const path=mk([P(190,513),P(400,617),P(540,617),P(900,617),P(1260,617),P(1440,560),P(1675,513),P(1908,513),P(1908,650),P(2090,650)]),u=ease(clamp((t-cRe-0.2)/(cSe-cRe-0.6),0,1)),q=at(path,u);glow(ctx,q.x,q.y,50,C.white,0.95);glow(ctx,q.x,q.y,160,LAYER.gold,0.45);
    const sub=[];for(let i=0;i<=40;i++)sub.push(at(path,u*i/40));beam(ctx,sub,LAYER.gold,[[14,0.06],[5,0.22],[2,0.9]]);}
  else if(t<cTg-0.25){const a=fin(t,cSe-0.2,0.5),cam={x:960,y:540,z:1+0.03*clamp((t-cSe)/(cTg-cSe),0,1)};bgW(ctx,S,cam);withA(ctx,a,()=>{phone3(ctx,600,540,1.8,{screen:"confirm"});glass(ctx,960,330,660,420,20,GOOD,{glow:22,ea:0.7});T(ctx,"Data Science 101",1000,400,{w:800,size:44});T(ctx,"New class added",1000,450,{w:800,size:26,color:rgba(GOOD,1)});T(ctx,"Tuesday 11:00 · room C310",1000,510,{w:600,size:26,color:rgba(SOFT,1)});
    glass(ctx,1000,550,580,150,14,DOM.students.c,{glow:10,ea:0.7});T(ctx,"140",1030,654,{w:800,size:84,color:rgba(DOM.students.c,1)});T(ctx,"more seats",1230,640,{w:700,size:34});});vign(ctx,S);}
  // the closing line keeps a margin at the frame's sides in every language (the Spanish one is longer)
  else{clearTo(ctx,S);const a=fin(t,cTg-0.25,0.8),tz=Math.min(104,104*(W-240)/Math.max(1,tw(ctx,"Move less. Mean more.",104,800)));withA(ctx,a,()=>T(ctx,"Move less. Mean more.",W/2,H/2-6,{w:800,size:tz,align:"center"}));withA(ctx,fin(t,cTg+1.2,0.8),()=>{T(ctx,"The Inner Life of Data",W/2,H/2+76,{w:700,size:32,align:"center",color:rgba(SOFT,1)});T(ctx,"University edition",W/2,H/2+118,{w:500,size:22,align:"center",color:rgba(SOFT,0.7)});});}
});
