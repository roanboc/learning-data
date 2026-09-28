/* ===== Making of · That's not quite right: components =====
   Two lanes: the author (warm) and Claude (cool), with the conversation between them. The artefacts are real: pictures from the making of,
   and frames of The Inner Life of Data drawn live by the film itself (ILD, embedded by tools/build.py). */
const WARM=[255,196,120],COOL=[120,200,255];
const ART={};
async function PREP_EXTRA(){await Promise.all(Object.keys(ART_SRC).map(k=>new Promise(r=>{const im=new Image();im.onload=()=>{ART[k]=im;r();};im.onerror=()=>r();im.src=ART_SRC[k];})));}
// frames of The Inner Life of Data at fixed moments, drawn once each
const THUMB=new Map();
function ildThumb(t,w){const k=t+"|"+w;let c=THUMB.get(k);if(c)return c;c=mkCanvas(w,Math.round(w*9/16));const x=c.getContext("2d");x.save();ILD.renderFrame(x,w/W,t);x.restore();THUMB.set(k,c);return c;}
function pic(ctx,img,x,y,w,h,edge,o){o=o||{};if(!img)return;glass(ctx,x-8,y-8,w+16,h+16,12,edge||[190,210,240],{glow:14,ea:0.5,fill:"rgba(4,7,14,0.96)"});ctx.drawImage(img,o.sx||0,o.sy||0,o.sw||img.width,o.sh||img.height,x,y,w,h);
  if(o.label)T(ctx,o.label,x,y+h+32,{w:600,size:17,color:rgba(SOFT,1)});}
// words wrapped to a width
function wrapT(ctx,s,w,size,wt){const words=s.split(" "),lines=[];let cur="";words.forEach(x=>{const tr=cur?cur+" "+x:x;if(tw(ctx,tr,size,wt||600)>w&&cur){lines.push(cur);cur=x;}else cur=tr;});if(cur)lines.push(cur);return lines;}
// a message in the conversation: from the author (warm, left edge) or from Claude (cool)
function bubble(ctx,x,y,w,text,from,a,o){o=o||{};if(a<=0)return;const c=from==="author"?WARM:COOL,size=o.size||24,lines=wrapT(ctx,text,w-48,size,o.wt||600),lh=size*1.35,h=lines.length*lh+(o.kicker===false?30:62);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,c,{glow:16,ea:0.55,fill:"rgba(8,12,22,0.94)"});ctx.fillStyle=rgba(c,0.95);rr(ctx,x,y+14,4,h-28,2);ctx.fill();
    if(o.kicker!==false)T(ctx,o.kicker||(from==="author"?"the author":"Claude"),x+24,y+34,{w:800,size:16,color:rgba(c,1)});
    const shown=o.type==null?1:clamp(o.type,0,1),n=Math.ceil(text.length*shown);let used=0;
    lines.forEach((l,i)=>{const take=clamp(n-used,0,l.length);used+=l.length+1;if(take>0)T(ctx,l.slice(0,take),x+24,y+(o.kicker===false?20:48)+lh*(i+0.8),{w:o.wt||600,size,color:o.quote?rgba(c,1):rgba(INK,0.96),f:o.f});});});return h;}
// the two lanes, and the conversation between them
const LANE={A:{y:150,h:120},C:{y:630,h:120}};
function lanes(ctx,t,a,o){o=o||{};withA(ctx,a,()=>{
  [["A","the author",WARM,o.authorItems||[]],["C","Claude",COOL,o.claudeItems||[]]].forEach(([k,name,c,items])=>{const L=LANE[k];glass(ctx,60,L.y,1800,L.h,20,c,{glow:18,ea:0.45,fill:"rgba(8,12,22,0.9)"});
    T(ctx,name,96,L.y+L.h/2+10,{w:800,size:30,color:rgba(c,1)});let x=330;items.forEach(([s,ia])=>{if(ia<=0)return;const w=tw(ctx,s,20,700)+36;withA(ctx,ia,()=>{glass(ctx,x,L.y+L.h/2-22,w,44,22,c,{glow:8,ea:0.5,fill:"rgba(12,18,32,0.95)"});T(ctx,s,x+18,L.y+L.h/2+7,{w:700,size:20});});x+=w+14;});});
  const thr=o.thread==null?1:o.thread;if(thr>0){withA(ctx,thr,()=>{for(let i=0;i<5;i++){const x=440+i*260;ctx.save();ctx.strokeStyle="rgba(200,215,240,0.12)";ctx.setLineDash([6,10]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,LANE.A.y+LANE.A.h);ctx.lineTo(x,LANE.C.y);ctx.stroke();ctx.restore();
    const up=i%2===0,v=((t*0.45+i*0.37)%1),y=up?lerp(LANE.C.y,LANE.A.y+LANE.A.h,v):lerp(LANE.A.y+LANE.A.h,LANE.C.y,v),c=up?COOL:WARM;glow(ctx,x,y,26,c,0.7*Math.sin(Math.PI*v));}});}});}
// a message travelling from one lane to the other
function travel(ctx,t,t0,x,from,label){const d=1.6,v=(t-t0)/d;if(v<0||v>1)return;const up=from==="claude",y=up?lerp(LANE.C.y,LANE.A.y+LANE.A.h,ease(v)):lerp(LANE.A.y+LANE.A.h,LANE.C.y,ease(v)),c=up?COOL:WARM;
  glow(ctx,x,y,60,c,0.9*Math.sin(Math.PI*v));if(label)withA(ctx,Math.sin(Math.PI*v),()=>tag(ctx,x+24,y,label,c,{size:17}));}

/* analogies, and the test that breaks them */
const ANA=[["rivers",(ctx,x,y)=>{ctx.strokeStyle=rgba([110,180,255],0.95);ctx.lineWidth=4;for(let k=0;k<3;k++){ctx.beginPath();for(let i=0;i<=40;i++){const xx=x-60+i*3,yy=y-20+k*20+Math.sin(i*0.4+k)*7;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();}}],
 ["libraries",(ctx,x,y)=>{["#e08a5a","#5b8fe0","#e0c05a","#6fc28a","#b07bff"].forEach((c,i)=>{ctx.fillStyle=c;rr(ctx,x-55+i*22,y-36+(i%2)*8,18,72-(i%2)*8,3);ctx.fill();});}],
 ["cyberpunk",(ctx,x,y)=>{ctx.strokeStyle="rgba(255,80,200,0.9)";ctx.lineWidth=3;for(let i=0;i<5;i++){rr(ctx,x-60+i*25,y-10-hash(i,3)*40,18,50+hash(i,3)*40,2);ctx.stroke();}glow(ctx,x,y,60,[255,80,200],0.3);}],
 ["pipes",(ctx,x,y)=>{ctx.strokeStyle="rgba(190,200,215,0.95)";ctx.lineWidth=12;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-60,y-20);ctx.lineTo(x,y-20);ctx.quadraticCurveTo(x+30,y-20,x+30,y+10);ctx.lineTo(x+30,y+34);ctx.stroke();}],
 ["the human body",(ctx,x,y)=>{ctx.fillStyle="rgba(255,110,120,0.9)";ctx.beginPath();ctx.moveTo(x,y+30);ctx.bezierCurveTo(x-60,y-10,x-30,y-50,x,y-20);ctx.bezierCurveTo(x+30,y-50,x+60,y-10,x,y+30);ctx.fill();}]];
function anaCard(ctx,x,y,i,a,broke){const [n,draw]=ANA[i];withA(ctx,a,()=>{glass(ctx,x-150,y-110,300,220,18,COOL,{glow:12,ea:0.45,fill:"rgba(8,12,22,0.94)"});draw(ctx,x,y-20);T(ctx,n,x,y+80,{w:700,size:22,align:"center"});
  if(broke>0)withA(ctx,broke,()=>{ctx.strokeStyle=rgba(BAD,0.95);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x-110,y-80);ctx.lineTo(x+110,y+60);ctx.moveTo(x+110,y-80);ctx.lineTo(x-110,y+60);ctx.stroke();});});}

/* renamed products */
function rename(ctx,x,y,oldN,newN,u,a){withA(ctx,a,()=>{const w=Math.max(tw(ctx,oldN,24,700),tw(ctx,newN,24,700))+60;glass(ctx,x,y,w*2+80,64,16,COOL,{glow:10,ea:0.4,fill:"rgba(8,12,22,0.94)"});
  T(ctx,oldN,x+26,y+42,{w:700,size:24,color:rgba(SOFT,1)});const sw=tw(ctx,oldN,24,700)*ease(clamp(u*2,0,1));ctx.strokeStyle=rgba(BAD,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+26,y+34);ctx.lineTo(x+26+sw,y+34);ctx.stroke();
  withA(ctx,clamp(u*2-1,0,1),()=>{T(ctx,"→",x+w+20,y+42,{w:700,size:24,color:rgba(COOL,1)});T(ctx,newN,x+w+70,y+42,{w:800,size:24});});});}

/* a timeline of chapters that re-times itself when one line grows */
function reTime(ctx,x,y,w,g,a){withA(ctx,a,()=>{const base=[4,6,3,6,5,4,6,3,6,4,2],tot=base.reduce((p,q)=>p+q,0)+g;let xx=x;base.forEach((d,i)=>{const dd=d+(i===0?g:0),ww=w*dd/tot-6;ctx.fillStyle=rgba(i===0?WARM:COOL,i===0?0.55:0.3);rr(ctx,xx,y,ww,40,8);ctx.fill();xx+=ww+6;});
  T(ctx,"the film's chapters, timed to the voice",x,y-14,{w:600,size:17,color:rgba(SOFT,1)});});}

/* ear and eye */
function eye(ctx,x,y,s,c){ctx.save();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-s,y);ctx.quadraticCurveTo(x,y-s*0.9,x+s,y);ctx.quadraticCurveTo(x,y+s*0.9,x-s,y);ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.32,0,TAU);ctx.fillStyle=rgba(c,1);ctx.fill();ctx.restore();}
function ear(ctx,x,y,s,c){ctx.save();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y-s*0.2,s*0.6,Math.PI*1.05,Math.PI*2.25);ctx.quadraticCurveTo(x+s*0.1,y+s*0.6,x-s*0.1,y+s*0.8);ctx.stroke();ctx.beginPath();ctx.arc(x,y-s*0.2,s*0.25,Math.PI,Math.PI*2.1);ctx.stroke();ctx.restore();}

/* a relationship, one to many, with its crow's foot on the right end or the wrong one */
function crow(ctx,x,y,w,flip,c){ctx.save();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3;glass(ctx,x-90,y-30,170,60,10,c,{glow:8,ea:0.4,fill:"rgba(10,16,30,0.95)"});glass(ctx,x+w-80,y-30,170,60,10,c,{glow:8,ea:0.4,fill:"rgba(10,16,30,0.95)"});
  T(ctx,"Student",x-5,y+8,{w:700,size:20,align:"center"});T(ctx,"Enrolment",x+w+5,y+8,{w:700,size:20,align:"center"});ctx.beginPath();ctx.moveTo(x+80,y);ctx.lineTo(x+w-80,y);ctx.stroke();
  const foot=(fx,dir)=>{ctx.beginPath();ctx.moveTo(fx-dir*22,y);ctx.lineTo(fx,y-16);ctx.moveTo(fx-dir*22,y);ctx.lineTo(fx,y);ctx.moveTo(fx-dir*22,y);ctx.lineTo(fx,y+16);ctx.stroke();};
  const bar=bx=>{ctx.beginPath();ctx.moveTo(bx,y-14);ctx.lineTo(bx,y+14);ctx.stroke();};if(flip){foot(x+80,-1);bar(x+w-96);}else{foot(x+w-80,1);bar(x+96);}ctx.restore();}
