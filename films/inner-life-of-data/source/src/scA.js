/* ===== v4 scenes, part A ===== */
const SCENES=[];const cue=(sc,id)=>sc.cues[id];
function scene(id,draw){const n=NARR[id];SCENES.push({id,name:n.name,lead:n.lead,tail:n.tail,vo:n.vo,draw});}
function clearTo(ctx,S){setScreen(ctx,S);ctx.fillStyle="#03050b";ctx.fillRect(0,0,W,H);}
function bgW(ctx,S,cam){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#070b17");g.addColorStop(1,"#03050b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  setCam(ctx,S,cam);const x0=cam.x-W/2/cam.z,x1=cam.x+W/2/cam.z,y0=cam.y-H/2/cam.z,y1=cam.y+H/2/cam.z;ctx.strokeStyle="rgba(120,160,230,0.045)";ctx.lineWidth=1/cam.z;
  for(let x=Math.floor(x0/48)*48;x<=x1;x+=48){ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.stroke();}for(let y=Math.floor(y0/48)*48;y<=y1;y+=48){ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();}}
function vign(ctx,S){setScreen(ctx,S);const v=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,W*0.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.55)");ctx.fillStyle=v;ctx.fillRect(0,0,W,H);}
const nextCue=(sc,id)=>{const ks=sc.vo.map(v=>v.id),i=ks.indexOf(id);return i<ks.length-1?sc.cues[ks[i+1]]:sc.voEnd;};

/* ---------- read on a phone: this file's own helpers ----------
   The phone layer (From words to data's phone.js, loaded after the scenes) draws every word at least 28 px high in the frame,
   after the camera's zoom. These place a card's lines by the size they're really drawn at (phSz), so the larger words don't run
   into each other; where the layer isn't loaded (a lab), they draw as the film always did. */
const il_A_sz=(ctx,s)=>typeof phSz==="function"?phSz(ctx,s):s;
// a source system's card (appCard in style2.js), its name and its line under it set apart by the size they're drawn at; the card
// grows downwards to hold them, and returns its height
function il_A_card(ctx,x,y,w,h,a,o){o=o||{};const c=APP[a].c,ts=il_A_sz(ctx,o.ts||24),ss=il_A_sz(ctx,17),tb=y+18+ts,sb=tb+9+ss,dy=Math.max(y+h-30,sb+22),ch=dy-y+30;
  glass(ctx,x,y,w,ch,16,c,{glow:18,ea:0.55});led(ctx,x+12,y+16,5,ch-32,c);
  T(ctx,APP[a].n,x+32,tb,{w:700,size:ts});T(ctx,o.sub||"system of record",x+32,sb,{w:500,size:ss,color:rgba(SOFT,0.95)});dbGlyph(ctx,x+w-44,y+ch/2+2,c,0.9);
  const n=o.n==null?8:o.n;for(let i=0;i<n;i++){ctx.fillStyle=rgba(c,0.25+0.65*hash(i,a.length+2));rr(ctx,x+32+i*18,dy,12,12,3);ctx.fill();}return ch;}

/* ---------- 0. The tap, stored first in the system of record ---------- */
scene("tap",(ctx,S,t,sc)=>{
  const tapT=cue(sc,"tap")-0.3,cS=cue(sc,"stored"),cT=cue(sc,"travel"),cF=cue(sc,"follow");
  // the phone and the student system side by side, close enough that the phone's words read without growing (the card arrives as
  // the camera turns to it); then in on the snapshot, with the card's note kept above the captions
  const cam=camAt([[0,640,560,1.2],[cS-0.8,640,560,1.2],[cS+1.2,1060,560,1.3],[cT-0.3,1080,556,1.34],[cT+2.9,1360,612,3.3],[cF+0.1,1360,612,3.3],[cF+3.0,1800,600,1.2]],t);
  const LX=1400,LY=595;
  clearTo(ctx,S);const bgA=sstep(3.0,3.9,t);
  if(bgA>0){ctx.save();ctx.globalAlpha=bgA;bgW(ctx,S,cam);
    phone3(ctx,640,560,2.1,{screen:"enrol",press:t>tapT&&t<tapT+0.3});
    const pre=fin(t,3.8)*(1-sstep(tapT-0.15,tapT,t));if(pre>0){const k=(Math.sin(t*4)+1)/2;ctx.strokeStyle="rgba(255,255,255,"+(0.45*pre*(1-k*0.5))+")";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(640,560+54*2.1,84+k*14,40+k*8,0,0,TAU);ctx.stroke();}
    if(t>tapT&&t<tapT+0.8){const u=(t-tapT)/0.8;ctx.fillStyle="rgba(255,255,255,"+(0.5*(1-u))+")";ctx.beginPath();ctx.arc(640,560+54*2.1,20+u*130,0,TAU);ctx.fill();}
    withA(ctx,fin(t,cS-0.3),()=>{il_A_card(ctx,1080,470,540,190,"sis",{ts:32,n:10});tag(ctx,1350,712,"written first, in the system of record",APP.sis.c,{align:"center",size:18});});
    ctx.restore();}
  setCam(ctx,S,cam);
  // the snapshot lands in the card clear of its words, right of the line under its name
  if(t>tapT+0.05){const land=cS+1.4,dis=sstep(cF-0.2,cF+0.6,t);let x,y,sz;
    if(t<cS){const u=ease(clamp((t-tapT)/0.8,0,1));x=640;y=lerp(333,300,u);sz=lerp(10,46,u);}
    else if(t<land){const u=ease((t-cS)/1.4);const q=at(mk(bez(P(640,300),P(850,180),P(1150,300),P(LX,LY),20)),u);x=q.x;y=q.y;sz=lerp(46,64,u);}
    else{x=LX;y=LY;sz=64;}
    if(t>land&&t<land+0.8)glow(ctx,LX,LY,120,APP.sis.c,0.7*(1-(t-land)/0.8));
    dtile(ctx,x,y,sz,0,{cell:7,q:0,app:"sis",hi:true},1-dis);
    if(dis>0){const sx=LX+ease(sstep(cF+0.2,cF+2.8,t))*1000;lane(ctx,[P(LX,LY),P(sx,LY)],APP.sis.c,dis);lane(ctx,[P(sx,LY),P(2900,LY)],[255,255,255],0.3*dis);glow(ctx,sx,LY,30+50*dis,C.white,dis);glow(ctx,sx,LY,110*dis,APP.sis.c,0.5*dis);}}
  vign(ctx,S);
  const tA=sstep(0.3,1.1,t)*(1-sstep(2.6,3.3,t));if(tA>0){ctx.save();ctx.globalAlpha=tA;T(ctx,"The Inner Life of Data",W/2,H/2-4,{w:800,size:96,align:"center"});T(ctx,"How a university's data flows, from one tap to one decision",W/2,H/2+60,{size:30,w:500,align:"center",color:rgba(SOFT,0.95)});ctx.restore();}
});

/* ---------- 1. Into the platform ----------
   Laid out for words that read on a phone: the camera stays close (zoom 1.36 to 1.42, where a chip's smaller line grows only a little) and
   moves with the narration from the systems to the events, Zerobus, the nightly files, Auto Loader and bronze. Each framing either
   holds the source cards whole or leaves them out, and keeps the words above the captions. */
const IN2={X:170,CW:360,AY:[190,335,480,625],HUB:P(800,320),
  L1:[P(532,249),P(630,249),P(662,296),P(705,308)],L2:[P(532,394),P(630,394),P(662,344),P(705,332)],ZL:[P(900,320),P(1458,320)],
  F1:[P(532,539),P(610,539),P(650,650),P(690,656)],F2:[P(532,684),P(610,684),P(650,672),P(690,666)],
  AL:[P(880,661),P(1061,661),P(1170,661),P(1225,700),P(1458,700)]};
IN2.ALm=mk(IN2.AL);
scene("in",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cSy=c("systems"),cCo=c("colours"),cEv=c("events"),cIn=c("integ"),cZb=c("zerobus"),cFi=c("files"),cAu=c("auto"),cBr=c("bronze"),cHo=c("hot");
  // the four systems; the events and the integration platform beside them; Zerobus into the lakehouse (the cards left behind, whole);
  // back to the nightly files; Auto Loader; bronze; and hot against the rest, framed from the platform to bronze
  // the systems sit whole between the top of the frame and a two-line caption; the files shot holds all four cards and the landing
  // zone whole, and from Auto Loader on the vault's top and the Auto Loader chip both stay inside, with the cards left out at the left
  const cam=camAt([[0,350,512,1.4],[cCo+0.6,350,512,1.4],[cEv+0.6,560,512,1.4],[cIn+0.6,640,512,1.4],[cZb-0.6,650,512,1.4],[cZb+1.2,1240,420,1.42],[cFi-1.4,1250,420,1.42],
    [cFi+0.2,700,571,1.36],[cAu-0.6,690,571,1.36],[cAu+1.2,1255,578,1.36],[cBr-0.6,1262,578,1.36],[cBr+1.0,1275,577,1.36],[cHo,1270,577,1.36],[cHo+1.4,1258,577,1.36],[sc.dur+2,1250,577,1.355]],t);
  bgW(ctx,S,cam);
  const apps=["sis","lms","hr","fin"],ay=IN2.AY,X=IN2.X,R=X+IN2.CW,hb=IN2.HUB;
  apps.forEach((a,i)=>withA(ctx,fin(t,cSy+0.2+i*0.45),()=>il_A_card(ctx,X,ay[i],IN2.CW,118,a)));
  apps.forEach((a,i)=>{const p=clamp((t-cCo-i*0.3)/1.3,0,1);if(p>0&&p<1){glow(ctx,R,ay[i]+59,60+110*p,APP[a].c,0.8*(1-p));}});
  const eA=fin(t,cEv);withA(ctx,eA,()=>{lane(ctx,IN2.L1,APP.sis.c);lane(ctx,IN2.L2,APP.lms.c);});
  if(t>cEv){flowTiles(ctx,t,IN2.L1,1.1,1.2,cEv,k=>({cell:(k*5+3)%24,q:0,app:"sis"}),28,eA);flowTiles(ctx,t,IN2.L2,1.3,1.2,cEv+0.4,k=>({cell:(k*7+2)%24,q:0,app:"lms"}),28,eA);}
  withA(ctx,fin(t,cIn-0.3),()=>{hub(ctx,hb.x,hb.y,100,t*0.6);chip(ctx,hb.x,482,null,"Integration platform","routes, retries, secures",{align:"center",edge:CYAN});});
  const zA=fin(t,cZb-0.2);withA(ctx,zA,()=>{lane(ctx,IN2.ZL,[255,255,255],0.8);chip(ctx,1110,250,"databricks","Zerobus Ingest","into Delta tables in seconds",{align:"center"});});
  if(t>cZb)flowTiles(ctx,t,IN2.ZL,0.55,1.5,cZb,k=>({cell:(k*11+1)%24,q:0,app:k%2?"lms":"sis"}),32,zA);
  const fA=fin(t,cFi-0.3);withA(ctx,fA,()=>{lane(ctx,IN2.F1,APP.hr.c);lane(ctx,IN2.F2,APP.fin.c);glass(ctx,690,606,190,110,16,[200,215,240],{glow:10,ea:0.5});chip(ctx,785,772,null,"Landing zone","nightly files in cloud storage",{align:"center",ss:16});});
  const aA=fin(t,cAu-0.3),N=8,scan0=cAu+0.3,B=c("breath"),nx=sc.breathe?1:0;let done=0,scanning=false;
  withA(ctx,aA,()=>lane(ctx,IN2.AL,APP.fin.c));
  // the breather: the next night, one new file lands, and Auto Loader reads only that one
  if(nx&&t>B){const a=fin(t,B,0.8)*(1-sstep(sc.dur-0.6,sc.dur,t)),mx=720,my=560;withA(ctx,a,()=>{glow(ctx,mx,my,44,[220,230,255],0.35);ctx.fillStyle="rgba(236,242,255,0.95)";ctx.beginPath();ctx.arc(mx,my,15,0,TAU);ctx.arc(mx+7,my-5,13,0,TAU,true);ctx.fill("evenodd");T(ctx,"02:00",mx+24,my+7,{f:"mono",w:500,size:17,color:rgba(SOFT,0.95)});});}
  for(let i=N-1+nx;i>=0;i--){const late=i>=N,drop=late?B+0.7:cFi+0.4+i*0.09,land=drop+0.6;if(t<drop)continue;const leave=late?B+1.9:scan0+i*0.55,sp={cell:(i*5+1)%24,q:0,app:i%2?"hr":"fin"},ix=738+(i%6)*18,iy=668-(i%6)*4;
    if(t<land){const u=ease((t-drop)/0.6);dtile(ctx,ix,lerp(iy-100,iy,u),40,(hash(i,4)-0.5)*0.3,sp,1);}
    else if(t<leave){dtile(ctx,ix,iy,40,(hash(i,4)-0.5)*0.3,sp,1);}
    else{const u=(t-leave)/1.6;if(u>0.12)done++;if(u>0.05&&u<0.2)scanning=true;if(u<=1){const q=at(IN2.ALm,u);dtile(ctx,q.x,q.y,30,0.1,sp,1-sstep(0.9,1,u));}}}
  withA(ctx,aA,()=>{glass(ctx,1044,598,34,130,17,[255,209,140],{glow:20});ctx.save();ctx.shadowColor="rgba(255,220,150,1)";ctx.shadowBlur=scanning?30:14;ctx.fillStyle=scanning?"rgba(255,246,220,1)":"rgba(255,226,170,0.8)";ctx.fillRect(1048,659,26,5);ctx.restore();
    chip(ctx,1215,780,"databricks","Auto Loader","each new file once · checkpoint "+done+" of "+(nx&&t>B+1.3?N+1:N),{align:"center",ss:16});});
  // bronze's name arrives with its word, as a chip of its own over the vault's top
  const bA=0.55*fin(t,cZb-0.1)+0.45*fin(t,cBr-0.2),lvl=0.25+0.55*sstep(cZb,cHo,t);
  withA(ctx,bA,()=>{vault(ctx,1460,196,380,690,LAYER.bronze,(r,cc)=>hash(r*31+cc,5)>lvl?null:APP[["sis","lms","hr","fin"][(hash(r*7+cc,6)*4)|0]].c,null,null);
    withA(ctx,fin(t,cBr-0.4,0.4),()=>chip(ctx,1650,258,"databricks","Bronze","Delta tables, as they arrived",{align:"center",edge:LAYER.bronze}));});
  // between the two lanes: a raw piece seen up close, then hot against the rest, each on its own lane
  withA(ctx,fin(t,cBr+0.6)*(1-sstep(cHo+2.5,cHo+3.2,t)),()=>magnifier(ctx,1180,462,66,{cell:14,q:0,app:"lms",hi:true},1120,320,"raw: glitches, mixed clocks",APP.lms.c));
  withA(ctx,fin(t,cHo+0.4),()=>{tag(ctx,1340,358,"hot · seconds",C.hot,{align:"center",size:17});tag(ctx,1280,632,"warm or cold · minutes to days",C.warm,{align:"center",size:17});});
  vign(ctx,S);
});

/* ---------- 2. The sketch ---------- */
scene("sketch",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cF=c("first"),cM=c("model"),cC=c("concept"),cW=c("wrong"),cD=c("downstream"),cR=c("right"),dM=cC-cM;
  // the breather: two new enrolments arrive; the right sketch gives each its place, the wrong one lets the error grow
  const B=c("breath"),arr=sc.breathe?[0.6,2.0].map(x=>B+x):[],nIn=arr.filter(a=>t>a+1.0).length;
  const cam=camAt([[0,960,520,1],[sc.dur+2,960,520,1.04]],t);bgW(ctx,S,cam);
  const p1=1-sstep(cW-0.7,cW+0.1,t),p2=sstep(cW-0.4,cW+0.4,t);
  withA(ctx,p1,()=>{glass(ctx,300,250,1320,580,22,[150,225,255],{glow:18,ea:0.4,fill:"rgba(10,18,36,0.5)"});
    const lost=1-sstep(cC,cC+1.4,t);for(let i=0;i<9;i++){const x=400+hash(i,41)*1120,y=320+hash(i,42)*440+Math.sin(t*0.8+i)*10;withA(ctx,lost,()=>dtile(ctx,x,y,56,Math.sin(t*0.5+i)*0.4,{cell:(i*5+2)%24,q:0,app:["sis","lms","hr","fin"][i%4]},1));}
    withA(ctx,fin(t,cF+0.4)*(1-sstep(cM-0.2,cM+0.4,t)),()=>T(ctx,"?",960,640,{w:800,size:220,align:"center",color:rgba(CYAN,0.35)}));
    const ent=clamp((t-cM-0.2)/(dM*0.5)*3,0,3)+2*clamp((t-cC)/0.9,0,1),rel=0.5*clamp((t-cM-dM*0.62)/(dM*0.3),0,1)+0.5*clamp((t-cC-0.5)/1.2,0,1);
    sketchA(ctx,360,300,1200,470,false,1,{ent,rel});
    // the model's name is on screen about half a second before the narration says it, clear of the panel's top edge
    withA(ctx,fin(t,cC-0.5),()=>chip(ctx,960,182,null,"Conceptual model","agreed with the business, written down once",{align:"center",edge:[150,225,255]}));});
  withA(ctx,p2,()=>{ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(960,110);ctx.lineTo(960,850);ctx.stroke();
    const wA=fin(t,cW-0.2),dA=fin(t,cD),rA=fin(t,cR-0.1),snap=ease(clamp((t-cR-0.3)/1.6,0,1));
    withA(ctx,wA,()=>{tag(ctx,480,140,"Wrong sketch",BAD,{align:"center",size:22});sketchA(ctx,80,180,800,280,true,1,{});
      glass(ctx,100,510,480,320,12,BAD,{glow:16,ea:0.6});for(let i=0;i<24;i++){if(hash(i,6)<0.18)continue;const k=(i*7+5)%24,ox=(hash(i,3)-0.5)*38+Math.sin(t*1.6+i)*4,oy=(hash(i,4)-0.5)*30,rot=(hash(i,5)-0.5)*0.5;ctx.save();ctx.translate(100+(i%6)*80+40+ox,510+((i/6)|0)*80+40+oy);ctx.rotate(rot);ctx.drawImage(master2(1),(k%6)*TCELL,((k/6)|0)*TCELL,TCELL,TCELL,-40,-40,80,80);if(hash(i,7)<0.35){ctx.strokeStyle=rgba(BAD,0.95);ctx.lineWidth=3;ctx.strokeRect(-40,-40,80,80);}ctx.restore();}});
    withA(ctx,dA,()=>{ctx.save();ctx.strokeStyle=rgba(BAD,0.7);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(582,670);ctx.lineTo(640,670);ctx.stroke();ctx.restore();ledFrame(ctx,650,590,240,160,BAD,painting2("modern"),{pad:8});ctx.save();ctx.globalCompositeOperation="difference";ctx.fillStyle="rgba(120,0,40,0.5)";ctx.fillRect(650,590,240,160);ctx.restore();
      for(let k=0;k<5;k++){const gy=590+hash(k,Math.floor(t*8))*150;ctx.fillStyle=rgba(BAD,0.5);ctx.fillRect(650,gy,240,3);}tag(ctx,770,790,"Class fill: "+Math.ceil((374+nIn)/1.2)+"%",BAD,{align:"center",size:20});});
    withA(ctx,rA,()=>{tag(ctx,1440,140,"Right sketch",GOOD,{align:"center",size:22});sketchA(ctx,1040,180,800,280,false,1,{});
      glass(ctx,1060,510,480,320,12,GOOD,{glow:16,ea:0.6});for(let i=0;i<24;i++){const k=i,sx=(hash(i,13)-0.5)*300,sy=(hash(i,14)-0.5)*200,rot=(hash(i,15)-0.5)*0.8*(1-snap);const px=1060+(i%6)*80+40+sx*(1-snap),py=510+((i/6)|0)*80+40+sy*(1-snap);ctx.save();ctx.translate(px,py);ctx.rotate(rot);ctx.drawImage(master2(1),(k%6)*TCELL,((k/6)|0)*TCELL,TCELL,TCELL,-40,-40,80.5,80.5);ctx.restore();}
      if(snap>=1){glow(ctx,1300,670,200,GOOD,0.25*(1-sstep(cR+1.9,cR+2.6,t)));}
      withA(ctx,fin(t,cR+1.5),()=>{ctx.save();ctx.strokeStyle=rgba(GOOD,0.7);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(1542,670);ctx.lineTo(1600,670);ctx.stroke();ctx.restore();ledFrame(ctx,1610,590,240,160,DOM.teaching.c,painting2("modern"),{pad:8});tag(ctx,1730,790,"Class fill: "+Math.round((118+nIn)/1.2)+"%",GOOD,{align:"center",size:20});});
    arr.forEach((a,i)=>{if(t<a)return;const u=clamp((t-a)/1.0,0,1),e=ease(u),arc=Math.sin(u*Math.PI)*90,sp={cell:(i*7+4)%24,q:0,app:["sis","lms"][i]};
      const wx=200+i*220+(hash(i,21)-0.5)*40,wy=600+hash(i,22)*160,rc=[9,16][i],rx=1060+(rc%6)*80+40,ry=510+((rc/6)|0)*80+40;
      if(u<0.08)glow(ctx,960,470,60,C.white,1-u/0.08);
      if(u<1){dtile(ctx,lerp(960,wx,e),lerp(470,wy,e)-arc,48,u*2.4,sp,1);dtile(ctx,lerp(960,rx,e),lerp(470,ry,e)-arc,48,0,{cell:rc,q:2},1);}
      else{const k=t-a-1.0;dtile(ctx,wx+Math.sin(t*3+i)*6,wy+Math.cos(t*2.4+i)*5,48,Math.sin(t*1.7+i)*0.4,{...sp,err:true},1);if(k<0.9)glow(ctx,rx,ry,70,GOOD,0.8*(1-k/0.9));}});});});
  vign(ctx,S);
});
