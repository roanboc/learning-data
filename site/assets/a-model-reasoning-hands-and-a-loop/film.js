"use strict";
const W=1920,H=1080,TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const sstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const ease=t=>{t=clamp(t,0,1);return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
const hash=(n,s)=>{const x=Math.sin(n*127.1+(s||0)*311.7)*43758.5453123;return x-Math.floor(x);};
const rgba=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")";
const mix=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const P=(x,y)=>({x,y});
function bez(p0,p1,p2,p3,n){const o=[];for(let i=0;i<=n;i++){const t=i/n,m=1-t;o.push(P(m*m*m*p0.x+3*m*m*t*p1.x+3*m*t*t*p2.x+t*t*t*p3.x,m*m*m*p0.y+3*m*m*t*p1.y+3*m*t*t*p2.y+t*t*t*p3.y));}return o;}
function seg(a,b,n){const o=[];for(let i=0;i<=n;i++){const t=i/n;o.push(P(lerp(a.x,b.x,t),lerp(a.y,b.y,t)));}return o;}
function join(){const o=[];for(let i=0;i<arguments.length;i++){const s=arguments[i];for(let j=(i?1:0);j<s.length;j++)o.push(s[j]);}return o;}
function mk(pts){const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y));return{pts,L,total:L[L.length-1]};}
function at(p,u){const d=clamp(u,0,1)*p.total,L=p.L;let lo=0,hi=L.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(L[m]<d)lo=m;else hi=m;}const a=p.pts[lo],b=p.pts[hi],f=clamp((d-L[lo])/((L[hi]-L[lo])||1),0,1);return{x:lerp(a.x,b.x,f),y:lerp(a.y,b.y,f),a:Math.atan2(b.y-a.y,b.x-a.x)};}
function poly(ctx,pts){ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);}
function rr(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function spawn(t,every,dur,off,fn){const tt=t-off,a=Math.floor((tt-dur)/every)+1,b=Math.floor(tt/every);for(let i=a;i<=b;i++){const u=(tt-i*every)/dur;if(u>=0&&u<=1)fn(u,i);}}
function mkCanvas(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return c;}

/* ---------- palette ---------- */
const C={ink:[238,245,255],soft:[200,215,235],err:[255,62,62],white:[255,255,255],
  raw:[[255,176,64],[120,232,140],[86,178,255],[186,128,255],[255,150,200],[90,220,255],[255,226,120]],
  dom:{students:[77,163,255],teaching:[176,123,255],research:[47,211,192],finance:[255,138,92]},
  star:[255,228,170],mcp:[120,235,170],hot:[90,220,255],warm:[255,176,64]};
const MET={bronze:[[232,170,114],[122,74,40]],silver:[[226,233,242],[96,105,118]],gold:[[252,218,124],[156,110,28]],steel:[[178,188,202],[50,56,66]],dark:[[74,84,98],[18,22,28]],wood:[[140,92,56],[58,34,18]]};
const FT={sans:"Manrope,'Segoe UI',system-ui,sans-serif",serif:"'Source Serif 4',Georgia,serif",mono:"'IBM Plex Mono',Menlo,Consolas,monospace"};
const font=(w,s,f)=>w+" "+s+"px "+FT[f||"sans"];

/* ---------- glow sprites ---------- */
const SPR=new Map();
function sprite(c){const k=(c[0]|0)+","+(c[1]|0)+","+(c[2]|0);let s=SPR.get(k);if(s)return s;s=mkCanvas(64,64);const x=s.getContext("2d");const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(0.2,rgba(c,0.9));g.addColorStop(0.5,rgba(c,0.28));g.addColorStop(1,rgba(c,0));x.fillStyle=g;x.fillRect(0,0,64,64);SPR.set(k,s);return s;}
function glow(ctx,x,y,r,c,a){if(a<=0.004||r<=0)return;const op=ctx.globalCompositeOperation,ga=ctx.globalAlpha;ctx.globalCompositeOperation="lighter";ctx.globalAlpha=Math.min(1,a)*ga;ctx.drawImage(sprite(c),x-r,y-r,2*r,2*r);ctx.globalAlpha=ga;ctx.globalCompositeOperation=op;}
function metal(ctx,x0,y0,x1,y1,m){const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,rgba(m[0],1));g.addColorStop(0.5,rgba(mix(m[0],m[1],0.55),1));g.addColorStop(1,rgba(m[1],1));return g;}
function beam(ctx,pts,c,widths){ctx.save();ctx.globalCompositeOperation="lighter";ctx.lineCap="round";ctx.lineJoin="round";(widths||[[26,0.05],[11,0.14],[4,0.45],[1.6,0.95]]).forEach(([w,a])=>{poly(ctx,pts);ctx.strokeStyle=rgba(c,a);ctx.lineWidth=w;ctx.stroke();});ctx.restore();}

/* ---------- camera ---------- */
// camera moves use a sine ease: their fastest moment is about half as fast as with ease(), so the camera glides instead of darting
const easeCam=t=>0.5-0.5*Math.cos(Math.PI*clamp(t,0,1));
function camAt(keys,t){if(t<=keys[0][0])return{x:keys[0][1],y:keys[0][2],z:keys[0][3]};for(let i=1;i<keys.length;i++){if(t<=keys[i][0]){const a=keys[i-1],b=keys[i];const f=easeCam((t-a[0])/(b[0]-a[0]));return{x:lerp(a[1],b[1],f),y:lerp(a[2],b[2],f),z:Math.exp(lerp(Math.log(a[3]),Math.log(b[3]),f))};}}const k=keys[keys.length-1];return{x:k[1],y:k[2],z:k[3]};}
function setCam(ctx,S,cam){ctx.setTransform(S*cam.z,0,0,S*cam.z,S*(W/2-cam.x*cam.z),S*(H/2-cam.y*cam.z));}
function setScreen(ctx,S){ctx.setTransform(S,0,0,S,0,0);}
function toScreen(cam,x,y){return P(W/2+(x-cam.x)*cam.z,H/2+(y-cam.y)*cam.z);}

/* ---------- text & labels ---------- */
function txt(ctx,s,x,y,o){o=o||{};ctx.font=font(o.w||600,o.size||28,o.f);ctx.textAlign=o.align||"left";ctx.textBaseline=o.base||"alphabetic";ctx.fillStyle=o.color||rgba(C.ink,o.a==null?0.96:o.a);ctx.fillText(s,x,y);}
function label(ctx,S,cam,wx,wy,title,sub,o){ // screen-space label anchored to a world point
  o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=toScreen(cam,wx,wy);setScreen(ctx,S);
  ctx.save();ctx.globalAlpha=a;const al=o.align||"left",ts=o.size||34,ss=o.ssize||23;
  ctx.font=font(700,ts);const tw=ctx.measureText(title).width;ctx.font=font(500,ss);const sw=sub?ctx.measureText(sub).width:0;
  const w=Math.max(tw,sw)+36,h=sub?ts+ss+30:ts+22;let x=al==="center"?p.x-w/2:(al==="right"?p.x-w:p.x);const y=p.y-h/2;
  rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(4,9,18,0.72)";ctx.fill();ctx.strokeStyle=rgba(o.col||C.soft,0.35);ctx.lineWidth=1.5;ctx.stroke();
  if(o.col){ctx.fillStyle=rgba(o.col,1);ctx.fillRect(x+10,y+12,5,h-24);}
  const tx=x+(o.col?26:18);txt(ctx,title,tx,y+ts+8,{w:700,size:ts});if(sub)txt(ctx,sub,tx,y+ts+ss+16,{w:500,size:ss,color:rgba(C.soft,0.85)});
  ctx.restore();
}

/* ---------- master picture and packets ---------- */
const PICW=1200,PICH=800,TCELL=200,TPAD=14,TCAN=TCELL+TPAD*2;
function paintCampus(x,w,h){
  let g=x.createLinearGradient(0,0,0,h*0.72);g.addColorStop(0,"#2c4a7c");g.addColorStop(0.45,"#7282b2");g.addColorStop(0.78,"#e8a07a");g.addColorStop(1,"#f7d2a0");x.fillStyle=g;x.fillRect(0,0,w,h);
  g=x.createRadialGradient(w*0.8,h*0.3,0,w*0.8,h*0.3,h*0.3);g.addColorStop(0,"rgba(255,240,200,0.95)");g.addColorStop(0.3,"rgba(255,215,160,0.45)");g.addColorStop(1,"rgba(255,200,150,0)");x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle="#fff3d6";x.beginPath();x.arc(w*0.8,h*0.3,h*0.055,0,TAU);x.fill();
  x.fillStyle="#7b6f93";x.beginPath();x.moveTo(0,h*0.64);for(let i=0;i<=24;i++)x.lineTo(w*i/24,h*(0.6-0.04*Math.sin(i*0.8)-0.02*Math.sin(i*2.1)));x.lineTo(w,h);x.lineTo(0,h);x.fill();
  g=x.createLinearGradient(0,h*0.7,0,h);g.addColorStop(0,"#6c9a5e");g.addColorStop(1,"#3a653b");x.fillStyle=g;x.fillRect(0,h*0.7,w,h*0.3);
  x.fillStyle="#e6d2b0";x.beginPath();x.moveTo(w*0.3,h);x.bezierCurveTo(w*0.42,h*0.87,w*0.5,h*0.8,w*0.54,h*0.72);x.lineTo(w*0.59,h*0.72);x.bezierCurveTo(w*0.6,h*0.82,w*0.63,h*0.9,w*0.74,h);x.closePath();x.fill();
  const hx=w*0.06,hy=h*0.34,hw=w*0.34,hh=h*0.38;
  x.fillStyle="#d9b98f";x.fillRect(hx,hy,hw,hh);x.fillStyle="rgba(0,0,0,0.12)";x.fillRect(hx+hw*0.7,hy,hw*0.3,hh);
  x.fillStyle="#a97f55";x.beginPath();x.moveTo(hx-w*0.016,hy);x.lineTo(hx+hw/2,hy-h*0.15);x.lineTo(hx+hw+w*0.016,hy);x.closePath();x.fill();
  x.fillStyle="#f4ead8";x.beginPath();x.arc(hx+hw/2,hy-h*0.065,h*0.036,0,TAU);x.fill();x.strokeStyle="#4a3828";x.lineWidth=4;x.stroke();
  x.beginPath();x.moveTo(hx+hw/2,hy-h*0.065);x.lineTo(hx+hw/2,hy-h*0.09);x.moveTo(hx+hw/2,hy-h*0.065);x.lineTo(hx+hw/2+h*0.02,hy-h*0.058);x.stroke();
  for(let r=0;r<2;r++)for(let c=0;c<4;c++){const wx=hx+hw*0.08+c*hw*0.235,wy=hy+hh*0.12+r*hh*0.32;x.fillStyle=(r*4+c)%3===0?"#ffd98a":"#4d5b7a";x.fillRect(wx,wy,hw*0.13,hh*0.19);x.strokeStyle="#4a3828";x.lineWidth=3;x.strokeRect(wx,wy,hw*0.13,hh*0.19);}
  x.fillStyle="#6b4a2f";x.fillRect(hx+hw*0.43,hy+hh*0.68,hw*0.14,hh*0.32);
  const lx=w*0.57,ly=h*0.45,lw=w*0.37,lh=h*0.27;
  x.fillStyle="#b9c3d6";x.fillRect(lx,ly,lw,lh);x.fillStyle="#98a4bc";x.beginPath();x.moveTo(lx-w*0.012,ly);x.lineTo(lx+lw/2,ly-h*0.085);x.lineTo(lx+lw+w*0.012,ly);x.closePath();x.fill();
  x.fillStyle="#eef2f8";for(let i=0;i<6;i++)x.fillRect(lx+lw*0.06+i*lw*0.16,ly+lh*0.12,lw*0.05,lh*0.84);
  x.fillStyle="#6d7a95";x.fillRect(lx,ly+lh*0.94,lw,lh*0.06);
  x.fillStyle="#5b3f2a";x.fillRect(w*0.465,h*0.52,w*0.014,h*0.2);
  x.fillStyle="#3f7a45";x.beginPath();x.arc(w*0.472,h*0.5,h*0.095,0,TAU);x.fill();x.fillStyle="#58975a";x.beginPath();x.arc(w*0.455,h*0.465,h*0.058,0,TAU);x.fill();
  [[0.43,0.87,1],[0.5,0.83,0.9],[0.63,0.9,1.05],[0.67,0.81,0.8],[0.2,0.86,0.95]].forEach(([px,py,s])=>{x.fillStyle="#2b2a3a";x.beginPath();x.arc(w*px,h*(py-0.075*s),h*0.018*s,0,TAU);x.fill();rr(x,w*px-h*0.017*s,h*(py-0.053*s),h*0.034*s,h*0.062*s,h*0.012*s);x.fill();});
  x.strokeStyle="#2b2f45";x.lineWidth=4;x.lineCap="round";[[0.3,0.14],[0.36,0.1],[0.41,0.16]].forEach(([bx,by])=>{x.beginPath();x.moveTo(w*bx-14,h*by);x.quadraticCurveTo(w*bx-7,h*by-8,w*bx,h*by);x.quadraticCurveTo(w*bx+7,h*by-8,w*bx+14,h*by);x.stroke();});
}
const MASTERS={};
function master(k){k=k||1;if(!MASTERS[k]){const c=mkCanvas(PICW*k,PICH*k);paintCampus(c.getContext("2d"),PICW*k,PICH*k);MASTERS[k]=c;}return MASTERS[k];}
const STAMPS=["9:02 am","23:02Z","10/02 09:02","2026-02-10T23:02","Tue 9.02","09:02 AEST","1739228520"];
const TB=new Map();
function tornPath(x,cell,amp){const n=9,pts=[];const e=[[TPAD,TPAD],[TPAD+TCELL,TPAD],[TPAD+TCELL,TPAD+TCELL],[TPAD,TPAD+TCELL]];for(let s=0;s<4;s++){const a=e[s],b=e[(s+1)%4];for(let i=0;i<n;i++){const f=i/n;const j=(hash(cell*17+s*11+i,3)-0.5)*amp;const nx=b[1]-a[1],ny=a[0]-b[0],l=Math.hypot(nx,ny)||1;pts.push([lerp(a[0],b[0],f)+nx/l*j,lerp(a[1],b[1],f)+ny/l*j]);}}x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();}
function tileBmp(cell,qi,ci,err,k){
  k=k||1;const key=cell+"|"+qi+"|"+ci+"|"+(err?1:0)+"|"+k;let b=TB.get(key);if(b)return b;
  b=mkCanvas(TCAN*k,TCAN*k);const x=b.getContext("2d");x.scale(k,k);const m=master(k);const cx=(cell%6)*TCELL,cy=((cell/6)|0)*TCELL;
  const raw=qi===0,mid=qi===1,cast=ci>=0?C.raw[ci%C.raw.length]:C.white;
  x.save();
  if(raw)tornPath(x,cell,16);else{x.beginPath();x.rect(TPAD,TPAD,TCELL,TCELL);}
  x.fillStyle="#0c1422";x.fill();x.clip();
  x.filter=raw?"blur("+(3.2*k)+"px) saturate(0.5) contrast(0.85) brightness(0.95)":(mid?"blur("+k+"px) saturate(0.85)":"none");
  x.drawImage(m,cx*k,cy*k,TCELL*k,TCELL*k,TPAD,TPAD,TCELL,TCELL);x.filter="none";
  if(raw||mid){x.globalCompositeOperation="color";x.fillStyle=rgba(cast,raw?0.55:0.18);x.fillRect(0,0,TCAN,TCAN);x.globalCompositeOperation="source-over";
    const n=raw?1400:300;for(let i=0;i<n;i++){const px=TPAD+hash(i,cell*7+qi)*TCELL,py=TPAD+hash(i+911,cell*5+qi)*TCELL;x.fillStyle=hash(i,cell+33)>0.5?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.35)";x.fillRect(px,py,2,2);}}
  if(raw&&hash(cell,ci+4)>0.35){x.globalCompositeOperation="destination-out";x.beginPath();const k=(hash(cell,ci+9)*4)|0,co=[[TPAD,TPAD],[TPAD+TCELL,TPAD],[TPAD+TCELL,TPAD+TCELL],[TPAD,TPAD+TCELL]][k];x.moveTo(co[0],co[1]);x.lineTo(co[0]+(k===1||k===2?-1:1)*TCELL*0.42,co[1]);x.lineTo(co[0],co[1]+(k>=2?-1:1)*TCELL*0.34);x.closePath();x.fill();x.globalCompositeOperation="source-over";}
  x.restore();
  const st=raw?STAMPS[(cell+ci+7)%STAMPS.length]:"23:02 UTC";
  x.font=font(500,17,"mono");const sw=x.measureText(st).width;rr(x,TPAD+8,TPAD+TCELL-34,sw+16,26,5);x.fillStyle="rgba(6,10,18,0.82)";x.fill();x.fillStyle=raw?rgba(cast,1):"rgba(235,244,255,0.95)";x.textBaseline="middle";x.fillText(st,TPAD+16,TPAD+TCELL-21);
  if(err){x.strokeStyle="rgba(255,64,64,0.95)";x.lineWidth=7;x.lineCap="round";x.beginPath();x.moveTo(TPAD+34,TPAD+30);x.lineTo(TPAD+TCELL-34,TPAD+TCELL-50);x.moveTo(TPAD+TCELL-34,TPAD+30);x.lineTo(TPAD+34,TPAD+TCELL-50);x.stroke();}
  x.lineWidth=raw?3:2.5;x.strokeStyle=err?"rgba(255,70,70,0.95)":(raw?rgba(cast,0.9):"rgba(240,246,255,0.9)");
  if(raw)tornPath(x,cell,16);else{x.beginPath();x.rect(TPAD,TPAD,TCELL,TCELL);}x.stroke();
  TB.set(key,b);return b;
}
/* packet: a print of light. sp={cell,q,ci,err}; size in world units; z = camera zoom for level of detail */
function packet(ctx,z,x,y,size,rot,sp,al){
  al=al==null?1:al;if(al<=0.01)return;const scr=size*z;
  const col=sp.err?C.err:(sp.q<0.55&&sp.ci>=0?C.raw[sp.ci%C.raw.length]:(sp.col||C.white));
  const dot=1-sstep(15,26,scr),card=sstep(12,24,scr);
  if(dot>0.01)glow(ctx,x,y,size*1.15,col,0.95*al*dot);
  if(card>0.01){glow(ctx,x,y,size*1.3,col,0.26*al*card);
    const qf=clamp(sp.q,0,1)*2,i0=Math.min(1,Math.floor(qf)),f=qf-i0,s=size*TCAN/TCELL;
    ctx.save();ctx.translate(x,y);ctx.rotate(rot);const ga=ctx.globalAlpha;
    const k=sp.hi?2:1;
    ctx.globalAlpha=ga*al*card*(1-f);ctx.drawImage(tileBmp(sp.cell,i0,sp.ci,sp.err,k),-s/2,-s/2,s,s);
    if(f>0.01){ctx.globalAlpha=ga*al*card*f;ctx.drawImage(tileBmp(sp.cell,i0+1,sp.ci,sp.err,k),-s/2,-s/2,s,s);}
    ctx.globalAlpha=ga;ctx.restore();}
}
function spec(k,salt){return{cell:(hash(k,salt+1)*24)|0,ci:(hash(k,salt+2)*7)|0,err:false,q:0};}

/* ---------- paintings (gold) ---------- */
const PW=960,PH=640;const PAINT={};
function painting(kind){if(PAINT[kind])return PAINT[kind];const c=mkCanvas(PW,PH),x=c.getContext("2d");({realism:paintRealism,modern:paintModern,renaissance:paintRenaissance,impression:paintImpression})[kind](x,PW,PH);PAINT[kind]=c;return c;}
function paintRealism(x,w,h){
  let g=x.createRadialGradient(w*0.3,h*0.18,20,w*0.4,h*0.4,w*0.95);g.addColorStop(0,"#6a5640");g.addColorStop(0.6,"#2d2218");g.addColorStop(1,"#120d09");x.fillStyle=g;x.fillRect(0,0,w,h);
  g=x.createLinearGradient(0,h*0.56,0,h);g.addColorStop(0,"#7a4c2a");g.addColorStop(1,"#341d0e");x.fillStyle=g;x.fillRect(0,h*0.56,w,h*0.44);
  x.strokeStyle="rgba(28,14,5,0.28)";x.lineWidth=2;for(let i=0;i<16;i++){const y=h*0.58+i*h*0.027;x.beginPath();x.moveTo(0,y);for(let k=0;k<=16;k++)x.lineTo(w*k/16,y+Math.sin(k*0.8+i*1.3)*4);x.stroke();}
  x.fillStyle="rgba(0,0,0,0.35)";x.beginPath();x.ellipse(w*0.36,h*0.9,w*0.3,h*0.05,0,0,TAU);x.fill();
  const L=[[w*0.12,h*0.9],[w*0.19,h*0.62],[w*0.48,h*0.6],[w*0.5,h*0.88]],R=[[w*0.5,h*0.88],[w*0.48,h*0.6],[w*0.77,h*0.63],[w*0.85,h*0.9]];
  [L,R].forEach((q,i)=>{x.beginPath();q.forEach((p,j)=>j?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();g=x.createLinearGradient(q[0][0],0,q[2][0],0);g.addColorStop(0,i?"#efe3c8":"#d9c9a8");g.addColorStop(1,i?"#d8c7a3":"#f3e9d2");x.fillStyle=g;x.fill();x.strokeStyle="rgba(80,60,30,0.5)";x.lineWidth=1.5;x.stroke();
    x.save();x.clip();x.strokeStyle="rgba(90,110,150,0.35)";x.lineWidth=1.2;for(let r=1;r<13;r++){const f=r/13;x.beginPath();x.moveTo(lerp(q[1][0],q[0][0],f),lerp(q[1][1],q[0][1],f));x.lineTo(lerp(q[2][0],q[3][0],f),lerp(q[2][1],q[3][1],f));x.stroke();}
    x.fillStyle="rgba(40,40,60,0.7)";x.font="15px "+FT.mono;for(let r=1;r<12;r++){const f=r/13+0.035,a=lerp(q[1][0],q[0][0],f),b=lerp(q[1][1],q[0][1],f);x.fillText((1200+((hash(r,i+5)*8800)|0))+"",a+22+(i?10:0),b-3);x.fillText(((hash(r,i+7)*90)|0)+"."+((hash(r,i+8)*9)|0),a+122,b-3);}x.restore();});
  g=x.createLinearGradient(w*0.48,0,w*0.5,0);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.3)");x.fillStyle=g;x.fillRect(w*0.46,h*0.6,w*0.04,h*0.29);
  [[w*0.82,h*0.74,9],[w*0.9,h*0.8,6],[w*0.74,h*0.84,4]].forEach(([cx,cy,n])=>{for(let i=0;i<n;i++){const y=cy-i*9;g=x.createLinearGradient(cx-34,0,cx+34,0);g.addColorStop(0,"#8a6417");g.addColorStop(0.45,"#f7d36b");g.addColorStop(1,"#9c7420");x.fillStyle=g;x.beginPath();x.ellipse(cx,y,34,11,0,0,TAU);x.fill();x.strokeStyle="rgba(90,60,10,0.8)";x.lineWidth=1;x.stroke();}x.fillStyle="#f9e39a";x.beginPath();x.ellipse(cx,cy-(n-1)*9-2,26,7,0,0,TAU);x.fill();});
  x.save();x.translate(w*0.58,h*0.7);x.rotate(-0.5);g=x.createLinearGradient(0,-6,0,6);g.addColorStop(0,"#222");g.addColorStop(0.5,"#555");g.addColorStop(1,"#111");x.fillStyle=g;rr(x,-150,-6,280,12,6);x.fill();x.fillStyle="#d9b35a";x.beginPath();x.moveTo(130,-6);x.lineTo(160,0);x.lineTo(130,6);x.fill();x.restore();
  g=x.createRadialGradient(w*0.28,h*0.12,10,w*0.3,h*0.2,w*0.55);g.addColorStop(0,"rgba(255,230,170,0.35)");g.addColorStop(1,"rgba(255,230,170,0)");x.fillStyle=g;x.fillRect(0,0,w,h);
  g=x.createRadialGradient(w/2,h/2,h*0.3,w/2,h/2,w*0.7);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.55)");x.fillStyle=g;x.fillRect(0,0,w,h);
}
function paintModern(x,w,h){
  x.fillStyle="#f0ebe0";x.fillRect(0,0,w,h);
  x.fillStyle="#1f9e8e";x.beginPath();x.arc(w*0.33,h*0.46,h*0.3,0,TAU);x.fill();
  x.fillStyle="#e8b43a";x.fillRect(w*0.58,h*0.12,w*0.2,h*0.3);
  x.fillStyle="#d4462e";x.fillRect(w*0.66,h*0.56,w*0.24,h*0.22);
  x.fillStyle="#1d3f8f";x.beginPath();x.arc(w*0.78,h*0.36,h*0.07,0,TAU);x.fill();
  x.strokeStyle="#161616";x.lineWidth=9;x.beginPath();x.moveTo(w*0.06,h*0.8);x.lineTo(w*0.94,h*0.22);x.stroke();
  x.lineWidth=5;x.beginPath();x.moveTo(w*0.5,h*0.05);x.lineTo(w*0.5,h*0.95);x.stroke();
  x.lineWidth=4;x.beginPath();x.arc(w*0.33,h*0.46,h*0.4,Math.PI*1.1,Math.PI*1.9);x.stroke();
  const N=[[0.14,0.2],[0.22,0.78],[0.44,0.22],[0.58,0.66],[0.86,0.9],[0.92,0.5]];x.lineWidth=3;
  [[0,2],[2,3],[1,3],[3,4],[3,5]].forEach(([a,b])=>{x.beginPath();x.moveTo(w*N[a][0],h*N[a][1]);x.lineTo(w*N[b][0],h*N[b][1]);x.stroke();});
  N.forEach((n,i)=>{x.fillStyle=i%2?"#161616":"#f0ebe0";x.beginPath();x.arc(w*n[0],h*n[1],h*0.035,0,TAU);x.fill();x.lineWidth=5;x.stroke();});
  x.fillStyle="rgba(22,22,22,0.9)";x.fillRect(w*0.08,h*0.08,w*0.1,h*0.04);
}
function paintRenaissance(x,w,h){
  const vx=w*0.5,vy=h*0.42;
  let g=x.createLinearGradient(0,0,0,h*0.5);g.addColorStop(0,"#6d8fb0");g.addColorStop(1,"#e9d6ac");x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle="rgba(255,250,235,0.55)";[[0.3,0.12,0.12],[0.7,0.09,0.1],[0.52,0.18,0.08]].forEach(([cx,cy,r])=>{x.beginPath();x.ellipse(w*cx,h*cy,w*r,h*r*0.35,0,0,TAU);x.fill();});
  g=x.createLinearGradient(0,vy,0,h);g.addColorStop(0,"#b99467");g.addColorStop(1,"#7a5634");x.fillStyle=g;x.fillRect(0,vy,w,h-vy);
  x.strokeStyle="rgba(60,38,20,0.45)";x.lineWidth=2;for(let i=-10;i<=10;i++){x.beginPath();x.moveTo(vx,vy);x.lineTo(vx+i*w*0.12,h);x.stroke();}
  for(let k=1;k<9;k++){const f=Math.pow(k/9,1.8),y=vy+(h-vy)*f;x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();}
  for(let s=-1;s<=1;s+=2){for(let k=0;k<5;k++){const f=1-k*0.2,cx=vx+s*w*0.46*f,top=lerp(vy,h*0.1,f),bot=lerp(vy,h*0.92,f),cw=w*0.035*f;
    g=x.createLinearGradient(cx-cw,0,cx+cw,0);g.addColorStop(0,"#d9c29a");g.addColorStop(1,"#9c7f59");x.fillStyle=g;x.fillRect(cx-cw,top,cw*2,bot-top);
    if(k<4){const nx=vx+s*w*0.46*(f-0.2),ntop=lerp(vy,h*0.1,f-0.2);x.strokeStyle="#8c6d48";x.lineWidth=5*f;x.beginPath();x.moveTo(cx,top);x.quadraticCurveTo((cx+nx)/2,top-h*0.1*f,nx,ntop);x.stroke();}}}
  g=x.createLinearGradient(vx-w*0.08,0,vx+w*0.08,0);g.addColorStop(0,"#c7ab80");g.addColorStop(1,"#a48660");x.fillStyle=g;x.fillRect(vx-w*0.08,vy-h*0.2,w*0.16,h*0.2);x.fillStyle="#5c4028";x.beginPath();x.moveTo(vx-w*0.03,vy);x.lineTo(vx-w*0.03,vy-h*0.1);x.arc(vx,vy-h*0.1,w*0.03,Math.PI,0);x.lineTo(vx+w*0.03,vy);x.fill();
  const robes=["#8c2f2a","#2f4d7c","#b5872e","#4c6b3a","#6a3f6e"];
  for(let r=0;r<3;r++)for(let i=0;i<7;i++){const f=0.45+r*0.2,y=lerp(vy,h*0.95,f),x0=lerp(vx,w*(0.1+i*0.133),f),s=f*1.1;if(Math.abs(i-3)<1&&r===2)continue;
    x.fillStyle=robes[(i+r*2)%5];x.beginPath();x.moveTo(x0-18*s,y);x.quadraticCurveTo(x0-14*s,y-55*s,x0,y-62*s);x.quadraticCurveTo(x0+14*s,y-55*s,x0+18*s,y);x.fill();x.fillStyle="#e2b98f";x.beginPath();x.arc(x0,y-70*s,9*s,0,TAU);x.fill();}
  const fx=vx,fy=h*0.96;x.fillStyle="#9c2f24";x.beginPath();x.moveTo(fx-30,fy);x.quadraticCurveTo(fx-24,fy-110,fx,fy-122);x.quadraticCurveTo(fx+24,fy-110,fx+30,fy);x.fill();x.fillStyle="#e2b98f";x.beginPath();x.arc(fx,fy-136,15,0,TAU);x.fill();
  x.fillStyle="#f3e6c4";rr(x,fx+14,fy-104,64,40,6);x.fill();x.strokeStyle="#7a5a30";x.lineWidth=2;x.stroke();x.strokeStyle="rgba(90,60,30,0.7)";for(let k=0;k<4;k++){x.beginPath();x.moveTo(fx+22,fy-94+k*8);x.lineTo(fx+70,fy-94+k*8);x.stroke();}
  x.globalCompositeOperation="multiply";x.fillStyle="rgba(214,170,110,0.35)";x.fillRect(0,0,w,h);x.globalCompositeOperation="source-over";
  x.strokeStyle="rgba(50,30,15,0.18)";x.lineWidth=1;for(let i=0;i<260;i++){let px=hash(i,51)*w,py=hash(i,52)*h;x.beginPath();x.moveTo(px,py);for(let k=0;k<4;k++){px+=(hash(i*5+k,53)-0.5)*40;py+=(hash(i*5+k,54)-0.5)*40;x.lineTo(px,py);}x.stroke();}
  g=x.createRadialGradient(w/2,h/2,h*0.35,w/2,h/2,w*0.72);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(40,20,5,0.55)");x.fillStyle=g;x.fillRect(0,0,w,h);
}
function dabs(x,n,seed,area,cols,len,wid,al){for(let i=0;i<n;i++){const px=area[0]+hash(i,seed)*area[2],py=area[1]+hash(i,seed+1)*area[3];x.save();x.translate(px,py);x.rotate((hash(i,seed+2)-0.5)*0.9);x.fillStyle=cols[(hash(i,seed+3)*cols.length)|0];x.globalAlpha=al;rr(x,-len/2,-wid/2,len*(0.6+hash(i,seed+4)*0.8),wid,wid/2);x.fill();x.restore();}x.globalAlpha=1;}
function paintImpression(x,w,h){
  let g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,"#3b3f78");g.addColorStop(0.45,"#c67a8a");g.addColorStop(0.62,"#f2a868");g.addColorStop(1,"#3e4d5e");x.fillStyle=g;x.fillRect(0,0,w,h);
  dabs(x,900,11,[0,0,w,h*0.62],["#5a5a9c","#8b6fb0","#d98c9a","#f0a870","#f6c98a","#4e5f9e"],34,10,0.55);
  dabs(x,500,21,[0,h*0.4,w,h*0.3],["#2c2f52","#3d3a66","#4a3f6e","#2a2a45"],30,12,0.75);
  for(let b=0;b<4;b++){const bx=w*(0.06+b*0.24),bw=w*0.19,top=h*(0.36+hash(b,3)*0.1);x.fillStyle="rgba(40,36,70,0.85)";x.fillRect(bx,top,bw,h*0.72-top);}
  dabs(x,650,31,[0,h*0.62,w,h*0.38],["#2f4b3a","#3e6b4a","#5d8b5a","#6a5a8a","#c9855f"],30,10,0.6);
  x.fillStyle="rgba(250,200,120,0.25)";for(let i=0;i<220;i++){const px=hash(i,61)*w,py=h*0.74+hash(i,62)*h*0.26;rr(x,px,py,20,5,2.5);x.fill();}
}
function impressionLive(ctx,x,y,w,h,t){for(let b=0;b<4;b++)for(let r=0;r<4;r++)for(let c=0;c<4;c++){const k=b*16+r*4+c;const on=Math.sin(t*(0.7+hash(k,5))+hash(k,6)*9)>-0.2;if(!on)continue;const bx=x+w*(0.06+b*0.24)+w*0.19*(0.12+c*0.21),top=h*(0.36+hash(b,3)*0.1),by=y+top+(h*0.72-top)*(0.12+r*0.2);ctx.fillStyle=hash(k,7)>0.5?"rgba(255,214,120,0.95)":"rgba(255,190,110,0.85)";rr(ctx,bx,by,w*0.024,h*0.034,3);ctx.fill();}}
const FRAME={realism:{c:MET.wood,b:30},modern:{c:[[30,30,30],[10,10,10]],b:10},renaissance:{c:MET.gold,b:40},impression:{c:[[236,230,214],[176,166,146]],b:24}};
function framed(ctx,kind,x,y,w,h,dom,t){
  const f=FRAME[kind],b=f.b*(w/560);
  ctx.save();ctx.fillStyle="rgba(0,0,0,0.45)";rr(ctx,x-b+10,y-b+14,w+2*b,h+2*b,6);ctx.fill();
  ctx.fillStyle=metal(ctx,x-b,y-b,x+w+b,y+h+b,f.c);rr(ctx,x-b,y-b,w+2*b,h+2*b,4);ctx.fill();
  if(kind==="renaissance"){ctx.strokeStyle="rgba(120,80,20,0.6)";ctx.lineWidth=Math.max(1,b*0.12);for(let i=1;i<4;i++){rr(ctx,x-b+b*i/4,y-b+b*i/4,w+2*b-b*i/2,h+2*b-b*i/2,3);ctx.stroke();}}
  if(kind==="modern"){ctx.fillStyle="#f7f4ee";ctx.fillRect(x-b*0.4,y-b*0.4,w+b*0.8,h+b*0.8);}
  ctx.drawImage(painting(kind),x,y,w,h);
  if(kind==="impression")impressionLive(ctx,x,y,w,h,t);
  ctx.strokeStyle=rgba(dom,0.95);ctx.lineWidth=Math.max(2,b*0.16);ctx.strokeRect(x-ctx.lineWidth/2,y-ctx.lineWidth/2,w+ctx.lineWidth,h+ctx.lineWidth);
  ctx.restore();
}
function museumCard(ctx,x,y,w,title,style,aud,dom,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha=a;const h=w*0.48;ctx.fillStyle="rgba(0,0,0,0.35)";ctx.fillRect(x+4,y+5,w,h);ctx.fillStyle="#f4f1ea";ctx.fillRect(x,y,w,h);ctx.fillStyle=rgba(dom,1);ctx.fillRect(x,y,w*0.03,h);
  ctx.textAlign="left";ctx.textBaseline="alphabetic";ctx.fillStyle="#1d1d22";ctx.font=font(600,w*0.1,"serif");ctx.fillText(title,x+w*0.08,y+h*0.32);ctx.font="italic 400 "+(w*0.075)+"px "+FT.serif;ctx.fillStyle="#44444c";ctx.fillText(style,x+w*0.08,y+h*0.6);ctx.font=font(600,w*0.072);ctx.fillStyle="#5b5b66";ctx.fillText(aud,x+w*0.08,y+h*0.86);ctx.restore();}

/* ---------- backgrounds ---------- */
function labBg(ctx,t,warm){
  const g=ctx.createRadialGradient(W*0.45,H*0.4,40,W*0.5,H*0.5,W*0.75);g.addColorStop(0,warm?"#1f1a2c":"#0e1d38");g.addColorStop(0.6,warm?"#0f0c16":"#07101f");g.addColorStop(1,"#02050b");ctx.fillStyle=g;ctx.fillRect(-4000,-4000,12000,12000);
}
function dust(ctx,t,x0,y0,w,h,n,seed){ctx.save();ctx.globalCompositeOperation="lighter";for(let i=0;i<n;i++){const sp=4+hash(i,seed+2)*10,x=x0+((hash(i,seed+1)*w+t*sp)%w+w)%w,y=y0+hash(i,seed+3)*h+Math.sin(t*0.5+i)*8;ctx.fillStyle="rgba(205,222,255,"+(0.05+0.18*hash(i,seed+5))+")";ctx.beginPath();ctx.arc(x,y,0.9+hash(i,seed+4)*1.8,0,TAU);ctx.fill();}ctx.restore();}

/* ---------- devices ---------- */
function phone(ctx,x,y,s,o){o=o||{};
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  rr(ctx,-62,-120,124,240,22);ctx.fillStyle="#0c131f";ctx.fill();ctx.strokeStyle="rgba(205,225,255,0.6)";ctx.lineWidth=2.5;ctx.stroke();
  rr(ctx,-54,-104,108,210,12);ctx.fillStyle="#132640";ctx.fill();
  ctx.beginPath();ctx.arc(0,-112,3.5,0,TAU);ctx.fillStyle="#6c7a90";ctx.fill();
  ctx.textAlign="center";ctx.textBaseline="middle";
  const scr=o.screen||"enrol";
  if(scr==="enrol"){ctx.fillStyle="rgba(230,240,255,0.95)";ctx.font=font(700,13);ctx.fillText("Data Science 101",0,-70);ctx.font=font(500,10.5);ctx.fillStyle="rgba(200,215,235,0.8)";ctx.fillText("Tue 9:00, room B204",0,-52);
    ctx.fillStyle="rgba(200,215,235,0.25)";for(let i=0;i<3;i++){rr(ctx,-38,-30+i*14,76-i*14,6,3);ctx.fill();}
    rr(ctx,-36,40,72,30,15);ctx.fillStyle=o.press?"rgba(120,200,255,0.95)":"rgba(80,160,255,0.85)";ctx.fill();ctx.fillStyle="#fff";ctx.font=font(700,13);ctx.fillText("Enrol",0,55);}
  else if(scr==="confirm"){ctx.fillStyle="rgba(120,230,160,0.95)";ctx.beginPath();ctx.arc(0,-30,22,0,TAU);ctx.fill();ctx.strokeStyle="#0c131f";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-10,-30);ctx.lineTo(-3,-22);ctx.lineTo(11,-38);ctx.stroke();ctx.fillStyle="rgba(230,240,255,0.95)";ctx.font=font(700,13);ctx.fillText("Enrolment",0,12);ctx.fillText("confirmed",0,30);}
  else if(scr==="seat"){ctx.fillStyle="rgba(230,240,255,0.95)";ctx.font=font(700,12.5);ctx.fillText("Seat free?",0,-62);ctx.font=font(500,10.5);ctx.fillStyle="rgba(200,215,235,0.85)";ctx.fillText("Tue 9 am, DS101",0,-44);if(o.ans>0){ctx.globalAlpha=o.ans;rr(ctx,-40,-10,80,56,10);ctx.fillStyle="rgba(120,230,160,0.2)";ctx.fill();ctx.fillStyle="rgba(150,240,180,1)";ctx.font=font(800,26);ctx.fillText("1",0,12);ctx.font=font(600,10.5);ctx.fillText("seat left",0,34);ctx.globalAlpha=1;}}
  ctx.restore();
  if(o.flash>0)glow(ctx,x,y-112*s,90*s*o.flash+10,C.white,o.flash);
}
function laptop(ctx,x,y,s,flash){ctx.save();ctx.translate(x,y);ctx.scale(s,s);rr(ctx,-92,-72,184,116,8);ctx.fillStyle="#0c131f";ctx.fill();ctx.strokeStyle="rgba(205,225,255,0.55)";ctx.lineWidth=2.5;ctx.stroke();rr(ctx,-84,-64,168,100,4);ctx.fillStyle=flash>0?rgba(mix([19,38,64],[120,170,230],flash),1):"#132640";ctx.fill();
  ctx.fillStyle="rgba(200,215,235,0.35)";for(let i=0;i<4;i++){rr(ctx,-70,-50+i*18,120-i*18,7,3.5);ctx.fill();}
  ctx.beginPath();ctx.moveTo(-110,44);ctx.lineTo(110,44);ctx.lineTo(124,58);ctx.lineTo(-124,58);ctx.closePath();ctx.fillStyle=metal(ctx,0,44,0,58,MET.steel);ctx.fill();ctx.restore();if(flash>0)glow(ctx,x,y-10*s,120*s*flash,C.white,0.5*flash);}
function archive(ctx,x,y,w,h,m,fillAmt,seed){ /* a plan chest: wide flat drawers of prints */
  ctx.save();ctx.fillStyle="rgba(0,0,0,0.4)";rr(ctx,x+10,y+14,w,h,12);ctx.fill();
  rr(ctx,x,y,w,h,12);ctx.fillStyle="#0c121e";ctx.fill();ctx.lineWidth=6;ctx.strokeStyle=metal(ctx,x,y,x+w,y+h,m);ctx.stroke();
  const n=Math.max(3,Math.round(h/92)),pad=14,dh=(h-pad*2)/n;
  for(let r=0;r<n;r++){const dy=y+pad+r*dh,open=r===0?Math.min(22,dh*0.3):(r===2?Math.min(12,dh*0.16):0);
    if(open>0){const layers=Math.floor(open/3.2);for(let k=0;k<layers;k++){const c=mix(C.raw[(k+r+(seed||0))%7],[235,235,235],0.35);ctx.fillStyle=rgba(c,0.95);ctx.fillRect(x+pad+14+(hash(k,(seed||1)+r)*10),dy+k*3.2,w-2*pad-34,2.2);}}
    rr(ctx,x+pad,dy+open,w-2*pad,dh-9,6);ctx.fillStyle="#141d2e";ctx.fill();ctx.strokeStyle=rgba(m[0],0.6);ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle=metal(ctx,x+w/2-50,0,x+w/2+50,0,m);rr(ctx,x+w/2-48,dy+open+dh*0.5-8,96,10,5);ctx.fill();
    ctx.fillStyle="rgba(232,238,246,0.85)";ctx.fillRect(x+pad+18,dy+open+dh*0.5-14,58,24);ctx.fillStyle="rgba(60,70,90,0.8)";ctx.fillRect(x+pad+24,dy+open+dh*0.5-8,40,3);ctx.fillRect(x+pad+24,dy+open+dh*0.5-1,28,3);}
  ctx.restore();
}
function printer(ctx,x,y,s,feed,sp,z){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle=metal(ctx,-70,-40,70,40,MET.steel);rr(ctx,-70,-36,140,72,12);ctx.fill();
  ctx.fillStyle="#0b0f16";rr(ctx,-50,-44,100,12,4);ctx.fill();ctx.fillRect(-52,28,104,6);
  ctx.beginPath();ctx.arc(52,-16,5,0,TAU);ctx.fillStyle=feed>=0&&feed<=1?"rgba(120,240,160,1)":"rgba(80,110,90,1)";ctx.fill();
  ctx.restore();
  if(feed>=0&&feed<=1&&sp){packet(ctx,z||1,x,y+34*s+feed*56*s,52*s,0,sp,1-sstep(0.85,1,feed));}
}
function scanner(ctx,x,y,w,t,active,c){
  ctx.save();ctx.fillStyle=metal(ctx,x-w/2,y-14,x+w/2,y+14,MET.steel);rr(ctx,x-w/2,y-16,w,32,8);ctx.fill();
  ctx.fillStyle="rgba(150,210,255,0.25)";rr(ctx,x-w/2+8,y-9,w-16,18,4);ctx.fill();
  if(active){const bx=x-w/2+12+((Math.sin(t*5)+1)/2)*(w-24);ctx.globalCompositeOperation="lighter";ctx.fillStyle=rgba(c||C.hot,0.95);ctx.fillRect(bx-3,y-10,6,20);ctx.restore();glow(ctx,bx,y,40,c||C.hot,0.6);return;}
  ctx.restore();
}
function lensShape(ctx,x,y0,y1,th,m){const cy=(y0+y1)/2;ctx.beginPath();ctx.moveTo(x,y0);ctx.quadraticCurveTo(x+th,cy,x,y1);ctx.quadraticCurveTo(x-th,cy,x,y0);ctx.closePath();ctx.fillStyle="rgba(200,225,255,0.14)";ctx.fill();ctx.strokeStyle="rgba(222,236,255,0.75)";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=metal(ctx,x-14,0,x+14,0,m);rr(ctx,x-14,y0-14,28,14,3);ctx.fill();rr(ctx,x-14,y1,28,14,3);ctx.fill();}
function post(ctx,x,y0,y1,m){ctx.fillStyle=metal(ctx,x-8,0,x+8,0,MET.steel);ctx.fillRect(x-7,y0,14,y1-y0-26);ctx.fillStyle=metal(ctx,x-24,0,x+24,0,m);rr(ctx,x-24,y1-26,48,26,5);ctx.fill();}
function rail(ctx,x0,x1,y){ctx.fillStyle=metal(ctx,0,y,0,y+28,MET.dark);ctx.fillRect(x0,y,x1-x0,28);ctx.fillStyle="rgba(255,255,255,0.2)";ctx.fillRect(x0,y,x1-x0,1.5);ctx.fillStyle="#04060a";for(let x=x0+20;x<x1;x+=44){ctx.beginPath();ctx.arc(x,y+14,3.4,0,TAU);ctx.fill();}}
function plate(ctx,x,y,s){ctx.font=font(500,17,"mono");const w=ctx.measureText(s).width+18;rr(ctx,x-w/2,y,w,24,4);ctx.fillStyle="#0a0d12";ctx.fill();ctx.strokeStyle="rgba(200,215,235,0.35)";ctx.lineWidth=1;ctx.stroke();ctx.fillStyle="rgba(216,228,244,0.9)";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(s,x,y+12.5);}
function bell(ctx,x,y,s,ring){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(ring*30)*0.25*ring);ctx.scale(s,s);ctx.fillStyle=metal(ctx,-40,-50,40,40,MET.gold);ctx.beginPath();ctx.moveTo(-8,-52);ctx.quadraticCurveTo(-34,-44,-34,0);ctx.lineTo(-44,22);ctx.lineTo(44,22);ctx.lineTo(34,0);ctx.quadraticCurveTo(34,-44,8,-52);ctx.closePath();ctx.fill();ctx.beginPath();ctx.arc(0,28,8,0,TAU);ctx.fill();ctx.fillRect(-4,-62,8,12);ctx.restore();
  if(ring>0){ctx.save();ctx.globalCompositeOperation="lighter";for(let k=0;k<3;k++){const r=(ring*1.6+k*0.33)%1;ctx.beginPath();ctx.arc(x,y,s*(60+r*120),-Math.PI*0.35,Math.PI*0.35);ctx.strokeStyle=rgba(C.star,0.6*(1-r));ctx.lineWidth=4;ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*(60+r*120),Math.PI*0.65,Math.PI*1.35);ctx.stroke();}ctx.restore();}}
function projector(ctx,x,y,s,flip){ctx.save();ctx.translate(x,y);ctx.scale(flip?-s:s,s);ctx.fillStyle=metal(ctx,-60,-30,60,30,MET.steel);rr(ctx,-60,-30,110,60,12);ctx.fill();ctx.fillStyle="#0b0f16";ctx.beginPath();ctx.arc(52,0,20,0,TAU);ctx.fill();ctx.strokeStyle="rgba(220,235,255,0.8)";ctx.lineWidth=3;ctx.stroke();ctx.fillStyle="rgba(10,14,22,1)";ctx.beginPath();ctx.arc(-30,-30,14,Math.PI,0);ctx.arc(10,-30,14,Math.PI,0);ctx.fill();ctx.restore();}
function copier(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=metal(ctx,-80,-60,80,60,MET.steel);rr(ctx,-80,-50,160,100,12);ctx.fill();ctx.fillStyle="#0b0f16";rr(ctx,-70,-62,140,14,4);ctx.fill();ctx.fillStyle="rgba(120,200,255,0.5)";rr(ctx,-60,-40,50,24,4);ctx.fill();ctx.fillStyle="#0b0f16";ctx.fillRect(80,0,30,6);ctx.restore();}
function lantern(ctx,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=metal(ctx,-16,0,16,0,MET.steel);ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-62,13,Math.PI,0);ctx.stroke();ctx.fillStyle=metal(ctx,-24,0,24,0,MET.steel);ctx.beginPath();ctx.moveTo(-24,-42);ctx.lineTo(24,-42);ctx.lineTo(16,-56);ctx.lineTo(-16,-56);ctx.closePath();ctx.fill();rr(ctx,-30,-42,60,82,14);ctx.fillStyle="rgba(255,236,190,0.14)";ctx.fill();ctx.strokeStyle="rgba(255,240,210,0.8)";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=metal(ctx,-32,0,32,0,MET.steel);rr(ctx,-32,40,64,12,4);ctx.fill();ctx.restore();glow(ctx,x,y,(64+Math.sin(t*2.2)*6)*s,[255,226,160],0.6);glow(ctx,x,y,18*s,C.white,0.95);}
function screenBox(ctx,x,y,w,h,m){ctx.fillStyle="rgba(0,0,0,0.35)";rr(ctx,x+8,y+10,w,h,10);ctx.fill();ctx.fillStyle=metal(ctx,x,y,x+w,y+h,m||MET.steel);rr(ctx,x-8,y-8,w+16,h+16,12);ctx.fill();ctx.fillStyle="#070b12";ctx.fillRect(x,y,w,h);}
function starMap(ctx,pts,links,t,grow,a){ctx.save();ctx.globalAlpha=a;ctx.globalCompositeOperation="lighter";links.forEach(([i,j],k)=>{const g=clamp(grow*links.length-k,0,1);if(g<=0)return;const A=pts[i],B=pts[j];ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(lerp(A.x,B.x,g),lerp(A.y,B.y,g));ctx.strokeStyle=rgba(C.star,0.45);ctx.lineWidth=2.2;ctx.stroke();});ctx.restore();
  pts.forEach((p,i)=>{const g=clamp(grow*pts.length-i,0,1);if(g<=0)return;glow(ctx,p.x,p.y,(20+5*Math.sin(t*2.5+i*1.7))*g,C.star,0.9*a);glow(ctx,p.x,p.y,5*g,C.white,a);});}

/* ===== Style v2: one modern, futuristic design language ===== */
const APP={sis:{n:"Student system",s:"SIS",c:[255,176,64]},lms:{n:"Learning platform",s:"LMS",c:[126,224,140]},hr:{n:"HR and payroll",s:"HR",c:[255,150,200]},fin:{n:"Finance system",s:"FIN",c:[255,226,122]}};
const DOM={students:{n:"Students",c:[77,163,255]},teaching:{n:"Teaching",c:[176,123,255]},research:{n:"Research",c:[47,211,192]},finance:{n:"Finance",c:[255,138,92]}};
const LAYER={bronze:[232,162,107],silver:[214,228,255],gold:[255,209,102]};
const INK=[236,243,255],SOFT=[160,178,205],CYAN=[120,200,255],DBT=[255,105,75],DBX=[255,54,33],BAD=[255,90,80],GOOD=[120,240,170];
function bg2(ctx){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#070b17");g.addColorStop(1,"#03050b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle="rgba(120,160,230,0.045)";ctx.lineWidth=1;for(let x=0;x<=W;x+=48){ctx.beginPath();ctx.moveTo(x+0.5,0);ctx.lineTo(x+0.5,H);ctx.stroke();}for(let y=0;y<=H;y+=48){ctx.beginPath();ctx.moveTo(0,y+0.5);ctx.lineTo(W,y+0.5);ctx.stroke();}
  const v=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,W*0.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.62)");ctx.fillStyle=v;ctx.fillRect(0,0,W,H);}
function glass(ctx,x,y,w,h,r,edge,o){o=o||{};ctx.save();
  if(edge&&o.glow!==0){ctx.shadowColor=rgba(edge,o.ga||0.5);ctx.shadowBlur=o.glow||22;}
  rr(ctx,x,y,w,h,r);ctx.fillStyle=o.fill||"rgba(16,26,50,0.66)";ctx.fill();ctx.shadowBlur=0;
  const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,"rgba(255,255,255,0.075)");g.addColorStop(0.45,"rgba(255,255,255,0.015)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;rr(ctx,x,y,w,h,r);ctx.fill();
  ctx.lineWidth=o.lw||1.6;ctx.strokeStyle=edge?rgba(edge,o.ea==null?0.9:o.ea):"rgba(170,200,245,0.32)";rr(ctx,x,y,w,h,r);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.16)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+r,y+1.5);ctx.lineTo(x+w-r,y+1.5);ctx.stroke();ctx.restore();}
function led(ctx,x,y,w,h,c,a){ctx.save();ctx.shadowColor=rgba(c,0.95);ctx.shadowBlur=16;ctx.fillStyle=rgba(c,a==null?1:a);rr(ctx,x,y,w,h,Math.min(w,h)/2);ctx.fill();ctx.restore();}
function T(ctx,s,x,y,o){o=o||{};ctx.save();ctx.font=font(o.w||600,o.size||24,o.f);ctx.textAlign=o.align||"left";ctx.textBaseline=o.base||"alphabetic";ctx.fillStyle=o.color||rgba(INK,o.a==null?0.95:o.a);ctx.fillText(s,x,y);ctx.restore();}
function tw(ctx,s,size,w,f){ctx.save();ctx.font=font(w||600,size,f);const m=ctx.measureText(s).width;ctx.restore();return m;}
function lane(ctx,pts,c,a){beam(ctx,pts,c,[[18,0.05*(a||1)],[7,0.14*(a||1)],[2.4,0.55*(a||1)],[1.2,0.9*(a||1)]]);}
/* logos: the official files, drawn unaltered */
const LOGO={};
function loadLogos(){return Promise.all(Object.keys(LOGO_SRC).map(k=>new Promise(res=>{const im=new Image();im.onload=()=>{LOGO[k]=im;res();};im.onerror=()=>res();im.src=LOGO_SRC[k];})));}
function logo(ctx,k,x,y,h){const im=LOGO[k];if(!im)return 0;const w=h*im.width/im.height;ctx.drawImage(im,x,y,w,h);return w;}
function chip(ctx,x,y,k,title,sub,o){o=o||{};const ts=o.ts||22,ss=o.ss||17,lh=o.lh||(sub?34:28),pad=14;
  const w=pad+(k?lh+12:0)+Math.max(tw(ctx,title,ts,700),sub?tw(ctx,sub,ss,500):0)+pad+2,h=sub?64:46;
  const X=o.align==="center"?x-w/2:(o.align==="right"?x-w:x),Y=y-h/2;
  glass(ctx,X,Y,w,h,12,o.edge||null,{fill:"rgba(7,12,24,0.9)",glow:o.edge?14:0,ea:0.6});
  let tx=X+pad;if(k){const lw=logo(ctx,k,X+pad,Y+(h-lh)/2,lh);tx+=Math.max(lw,lh*0.9)+12;}
  if(sub){T(ctx,title,tx,Y+28,{w:700,size:ts});T(ctx,sub,tx,Y+51,{w:500,size:ss,color:rgba(SOFT,0.95)});}else T(ctx,title,tx,Y+h/2+8,{w:700,size:ts});
  return{x:X,y:Y,w,h};}
function tag(ctx,x,y,s,c,o){o=o||{};const ts=o.size||20,w=tw(ctx,s,ts,700)+26,h=ts+16;const X=o.align==="center"?x-w/2:x;glass(ctx,X,y-h/2,w,h,h/2,c,{fill:"rgba(7,12,24,0.88)",glow:10,ea:0.8});T(ctx,s,X+13,y+ts*0.36,{w:700,size:ts,color:rgba(c,1)});}
function header(ctx,n,title,sub){T(ctx,"STYLE FRAME "+n,64,76,{w:800,size:18,color:rgba(CYAN,0.9)});T(ctx,title,64,118,{w:800,size:40});if(sub)T(ctx,sub,64,154,{w:500,size:22,color:rgba(SOFT,0.95)});}
function caption(ctx,s){ctx.save();ctx.font=font(600,40);const w=ctx.measureText(s).width+60,h=80,x=W/2-w/2,y=H-54-h;ctx.fillStyle="rgba(0,0,0,0.66)";rr(ctx,x,y,w,h,14);ctx.fill();ctx.restore();T(ctx,s,W/2,y+54,{size:40,w:600,align:"center",color:"#fff"});}
/* the picture of the world: a modern campus at first light */
function paintCampus2(x,w,h){
  let g=x.createLinearGradient(0,0,0,h*0.75);g.addColorStop(0,"#0c1433");g.addColorStop(0.42,"#33296b");g.addColorStop(0.62,"#b04a7d");g.addColorStop(0.78,"#ff8f5e");g.addColorStop(0.9,"#ffc98f");x.fillStyle=g;x.fillRect(0,0,w,h);
  for(let i=0;i<70;i++){x.fillStyle="rgba(255,255,255,"+(0.2+0.5*hash(i,2))+")";x.fillRect(hash(i,3)*w,hash(i,4)*h*0.35,w/600,w/600);}
  g=x.createRadialGradient(w*0.7,h*0.63,0,w*0.7,h*0.63,h*0.38);g.addColorStop(0,"rgba(255,236,200,0.95)");g.addColorStop(0.2,"rgba(255,190,140,0.5)");g.addColorStop(1,"rgba(255,150,120,0)");x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle="#fff0d8";x.beginPath();x.arc(w*0.7,h*0.63,h*0.07,0,TAU);x.fill();
  x.fillStyle="rgba(58,40,96,0.9)";for(let i=0;i<22;i++){const bw=w*(0.03+hash(i,5)*0.04),bx=i*w/21-bw/2,bh=h*(0.06+hash(i,6)*0.14);x.fillRect(bx,h*0.7-bh,bw,bh+2);}
  g=x.createLinearGradient(0,h*0.7,0,h);g.addColorStop(0,"#241c45");g.addColorStop(1,"#0d0c1f");x.fillStyle=g;x.fillRect(0,h*0.7,w,h*0.3);
  x.strokeStyle="rgba(255,205,150,0.6)";x.lineWidth=h*0.006;x.beginPath();x.moveTo(w*0.25,h);x.bezierCurveTo(w*0.4,h*0.86,w*0.55,h*0.82,w*0.62,h*0.74);x.stroke();x.beginPath();x.moveTo(w*0.8,h);x.bezierCurveTo(w*0.7,h*0.88,w*0.66,h*0.8,w*0.63,h*0.74);x.stroke();
  const tx=w*0.07,tw2=w*0.18,ty=h*0.16,tb=h*0.8;g=x.createLinearGradient(tx,0,tx+tw2,0);g.addColorStop(0,"#1b2d5c");g.addColorStop(1,"#0f1838");x.fillStyle=g;x.fillRect(tx,ty,tw2,tb-ty);
  x.fillStyle="#22386f";x.beginPath();x.moveTo(tx,ty);x.lineTo(tx+tw2,ty-h*0.05);x.lineTo(tx+tw2,ty);x.closePath();x.fill();
  for(let r=0;r<16;r++)for(let c=0;c<5;c++){const on=hash(r*5+c,7)>0.55;x.fillStyle=on?(hash(r*5+c,8)>0.5?"#ffd98a":"#8fd3ff"):"rgba(120,150,210,0.18)";x.fillRect(tx+tw2*(0.08+c*0.18),ty+h*0.02+r*h*0.037,tw2*0.12,h*0.022);}
  g=x.createLinearGradient(tx,ty,tx+tw2,tb);g.addColorStop(0,"rgba(255,255,255,0.12)");g.addColorStop(0.5,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(tx,ty,tw2,tb-ty);
  const hx=w*0.3,hw=w*0.32,hy=h*0.48,hb=h*0.8;x.fillStyle="#1e2b57";x.fillRect(hx,hy,hw,hb-hy);
  x.fillStyle="#3653a0";x.beginPath();x.moveTo(hx-w*0.01,hy);x.quadraticCurveTo(hx+hw/2,hy-h*0.14,hx+hw+w*0.01,hy);x.closePath();x.fill();
  g=x.createLinearGradient(0,hy,0,hb);g.addColorStop(0,"rgba(120,190,255,0.45)");g.addColorStop(1,"rgba(120,190,255,0.12)");x.fillStyle=g;x.fillRect(hx+hw*0.06,hy+h*0.03,hw*0.88,hb-hy-h*0.05);
  x.strokeStyle="rgba(200,230,255,0.35)";x.lineWidth=w/600;for(let i=1;i<10;i++){x.beginPath();x.moveTo(hx+hw*0.06+i*hw*0.088,hy+h*0.03);x.lineTo(hx+hw*0.06+i*hw*0.088,hb-h*0.02);x.stroke();}
  for(let i=0;i<3;i++){x.fillStyle="rgba(255,214,140,0.5)";x.fillRect(hx+hw*0.06,hy+h*(0.07+i*0.07),hw*0.88,h*0.012);}
  g=x.createRadialGradient(hx+hw/2,hb,0,hx+hw/2,hb,h*0.12);g.addColorStop(0,"rgba(255,220,160,0.8)");g.addColorStop(1,"rgba(255,220,160,0)");x.fillStyle=g;x.fillRect(hx,hb-h*0.12,hw,h*0.14);
  x.strokeStyle="#6f86c8";x.lineWidth=h*0.012;x.beginPath();x.moveTo(tx+tw2,h*0.56);x.quadraticCurveTo((tx+tw2+hx)/2,h*0.52,hx,h*0.56);x.stroke();
  const gx=w*0.66,gw=w*0.3,gy=h*0.6,gb=h*0.8;x.fillStyle="#1a2448";x.fillRect(gx,gy,gw,gb-gy);x.fillStyle="#46b183";x.fillRect(gx-w*0.005,gy-h*0.018,gw+w*0.01,h*0.022);
  for(let i=0;i<12;i++){x.fillStyle="#5fd49b";x.beginPath();x.arc(gx+gw*(0.04+i*0.083),gy-h*0.018,h*0.012,Math.PI,0);x.fill();}
  for(let r=0;r<2;r++){x.fillStyle="rgba(255,207,122,0.75)";x.fillRect(gx+gw*0.04,gy+h*(0.045+r*0.065),gw*0.92,h*0.025);}
  [[0.27,0.8,1],[0.64,0.8,0.9],[0.97,0.8,1.1],[0.03,0.82,0.8]].forEach(([px,py,s2])=>{x.fillStyle="#3b2a3a";x.fillRect(w*px-w/600,h*(py-0.05*s2),w/300,h*0.05*s2);g=x.createLinearGradient(0,h*(py-0.14*s2),0,h*(py-0.04*s2));g.addColorStop(0,"#3fbf8c");g.addColorStop(1,"#1d6b52");x.fillStyle=g;x.beginPath();x.ellipse(w*px,h*(py-0.09*s2),h*0.04*s2,h*0.055*s2,0,0,TAU);x.fill();});
  [[0.44,0.9],[0.47,0.88],[0.58,0.93],[0.73,0.9],[0.35,0.95]].forEach(([px,py],i)=>{x.fillStyle="#0a0a18";x.beginPath();x.arc(w*px,h*(py-0.055),h*0.012,0,TAU);x.fill();rr(x,w*px-h*0.011,h*(py-0.04),h*0.022,h*0.045,h*0.008);x.fill();x.fillStyle=["#ffb040","#4da3ff","#ff8ac8","#2fd3c0","#b07bff"][i];x.fillRect(w*px+h*0.006,h*(py-0.036),h*0.008,h*0.02);});
}
const M2={};function master2(k){k=k||1;if(!M2[k]){const c=mkCanvas(PICW*k,PICH*k);paintCampus2(c.getContext("2d"),PICW*k,PICH*k);M2[k]=c;}return M2[k];}
/* digital data tiles: raw = glitched, tinted by its source system; clean = crisp, one clock */
const STAMPS2=["9:02 am","23:02Z","10/02 09:02","2026-02-10T23:02","09:02 AEST","1739228520"];
const TB2=new Map();
function tile2(cell,q,app,err,k){k=k||1;const key=[cell,q,app,err?1:0,k].join("|");let b=TB2.get(key);if(b)return b;
  const S2=TCELL*k,P2=TPAD*k,N=S2+2*P2;b=mkCanvas(N,N);const x=b.getContext("2d");const M=master2(k);const sx=(cell%6)*TCELL*k,sy=((cell/6)|0)*TCELL*k;const col=(APP[app]||{c:[255,255,255]}).c;
  const tmp=mkCanvas(S2,S2),tx=tmp.getContext("2d");tx.drawImage(M,sx,sy,S2,S2,0,0,S2,S2);
  if(q<2){const id=tx.getImageData(0,0,S2,S2),d=id.data,o=new Uint8ClampedArray(d);const sh=(q===0?5:2)*k,tint=q===0?0.42:0.14;
    for(let yy=0;yy<S2;yy++){const bi=Math.floor(yy/(9*k)),band=q===0&&hash(bi,cell+3)>0.8?Math.floor((hash(bi,cell+5)-0.5)*26*k):0;
      for(let xx=0;xx<S2;xx++){const i=(yy*S2+xx)*4;const xr=clamp(xx-sh+band,0,S2-1),xg=clamp(xx+band,0,S2-1),xb=clamp(xx+sh+band,0,S2-1);let r=o[(yy*S2+xr)*4],g=o[(yy*S2+xg)*4+1],bl=o[(yy*S2+xb)*4+2];const l=0.3*r+0.59*g+0.11*bl;
        r=lerp(r,l*col[0]/200,tint);g=lerp(g,l*col[1]/200,tint);bl=lerp(bl,l*col[2]/200,tint);if(q===0&&yy%(3*k)===0){r*=0.78;g*=0.78;bl*=0.78;}d[i]=r;d[i+1]=g;d[i+2]=bl;d[i+3]=255;}}
    if(q===0){for(let n=0;n<7;n++){const bw=((12+hash(n,cell+7)*34)*k)|0,bh=((5+hash(n,cell+8)*14)*k)|0,bx=(hash(n,cell+9)*(S2-bw))|0,by=(hash(n,cell+10)*(S2-bh))|0,dx=((hash(n,cell+11)-0.5)*44*k)|0;
        for(let yy=by;yy<by+bh;yy++)for(let xx=bx;xx<bx+bw;xx++){const si=(yy*S2+clamp(xx-dx,0,S2-1))*4,di=(yy*S2+xx)*4;d[di]=o[si]*0.85+col[0]*0.15;d[di+1]=o[si+1]*0.85+col[1]*0.15;d[di+2]=o[si+2]*0.85+col[2]*0.15;}}
      if(hash(cell,(app||"x").length)>0.25){const mw=((40+hash(cell,21)*50)*k)|0,mh=((26+hash(cell,22)*40)*k)|0,mx=(hash(cell,23)*(S2-mw))|0,my=(hash(cell,24)*(S2-mh))|0;for(let yy=my;yy<my+mh;yy++)for(let xx=mx;xx<mx+mw;xx++)d[(yy*S2+xx)*4+3]=((xx+yy)>>2)%2?40:0;}}
    tx.putImageData(id,0,0);}
  x.save();rr(x,P2,P2,S2,S2,8*k);x.clip();x.fillStyle="rgba(8,14,28,0.92)";x.fillRect(P2,P2,S2,S2);x.drawImage(tmp,P2,P2);x.fillStyle="rgba(255,255,255,0.035)";for(let yy=0;yy<S2;yy+=4*k)x.fillRect(P2,P2+yy,S2,k);
  if(err){x.fillStyle="rgba(255,50,60,0.26)";x.fillRect(P2,P2,S2,S2);for(let n=0;n<6;n++){x.fillStyle="rgba(255,60,70,0.75)";x.fillRect(P2,P2+hash(n,cell+31)*S2,S2,(2+hash(n,cell+32)*5)*k);}}
  x.restore();const bc=err?BAD:(q===2?[235,245,255]:col);x.strokeStyle=rgba(bc,q===2?0.95:0.85);x.lineWidth=2*k;if(q===0)x.setLineDash([12*k,6*k]);rr(x,P2,P2,S2,S2,8*k);x.stroke();x.setLineDash([]);
  x.lineWidth=3*k;x.strokeStyle=rgba(bc,1);const cl=16*k,o4=5*k;[[P2,P2,1,1],[P2+S2,P2,-1,1],[P2,P2+S2,1,-1],[P2+S2,P2+S2,-1,-1]].forEach(([cx,cy,dx,dy])=>{x.beginPath();x.moveTo(cx-dx*o4,cy+dy*cl);x.lineTo(cx-dx*o4,cy-dy*o4);x.lineTo(cx+dx*cl,cy-dy*o4);x.stroke();});
  const st=q===2?"23:02 UTC":STAMPS2[(cell+(app||"").length)%STAMPS2.length];x.font=font(500,15*k,"mono");const sw=x.measureText(st).width;rr(x,P2+8*k,P2+S2-32*k,sw+16*k,24*k,6*k);x.fillStyle="rgba(4,8,16,0.85)";x.fill();x.fillStyle=q===2?"rgba(235,244,255,0.95)":rgba(col,1);x.textBaseline="middle";x.fillText(st,P2+16*k,P2+S2-20*k);
  if(app&&q<2){x.font=font(800,14*k);const aw=x.measureText(APP[app].s).width;rr(x,P2+8*k,P2+8*k,aw+14*k,22*k,6*k);x.fillStyle=rgba(col,0.92);x.fill();x.fillStyle="#0a0f1c";x.fillText(APP[app].s,P2+15*k,P2+19*k);}
  if(err){x.font=font(800,14*k);rr(x,P2+S2-52*k,P2+8*k,44*k,22*k,6*k);x.fillStyle=rgba(BAD,0.95);x.fill();x.fillStyle="#fff";x.fillText("ERR",P2+S2-45*k,P2+19*k);}
  TB2.set(key,b);return b;}
function dtile(ctx,x,y,size,rot,sp,al){al=al==null?1:al;if(al<=0.01)return;const col=sp.err?BAD:(sp.q<1.5&&sp.app?APP[sp.app].c:[225,238,255]);glow(ctx,x,y,size*1.25,col,0.22*al);
  const b=tile2(sp.cell,Math.round(sp.q),sp.app,sp.err,sp.hi?2:1),s=size*TCAN/TCELL;ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.globalAlpha*=al;ctx.drawImage(b,-s/2,-s/2,s,s);ctx.restore();}
/* devices and places */
function phone2(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);glass(ctx,-60,-118,120,236,22,[170,205,255],{fill:"rgba(10,18,36,0.9)",glow:18,ea:0.7});
  rr(ctx,-50,-100,100,196,12);ctx.fillStyle="rgba(40,70,130,0.35)";ctx.fill();ctx.beginPath();ctx.arc(0,-108,3.5,0,TAU);ctx.fillStyle="rgba(200,220,255,0.8)";ctx.fill();
  T(ctx,"Data Science 101",0,-62,{w:800,size:12.5,align:"center"});T(ctx,"Tue 9:00 · B204",0,-44,{w:500,size:10.5,align:"center",color:rgba(SOFT,0.95)});
  ctx.fillStyle="rgba(160,190,240,0.22)";for(let i=0;i<3;i++){rr(ctx,-36,-24+i*14,72-i*14,6,3);ctx.fill();}
  rr(ctx,-34,40,68,28,14);ctx.fillStyle=o.press?"rgba(120,200,255,1)":"rgba(77,163,255,0.9)";ctx.fill();T(ctx,"Enrol",0,59,{w:800,size:12.5,align:"center",color:"#fff"});ctx.restore();
  if(o.ripple){ctx.save();ctx.strokeStyle="rgba(255,255,255,0.55)";ctx.lineWidth=2;for(let i=0;i<2;i++){ctx.beginPath();ctx.arc(x,y+54*s,(22+i*20)*s,0,TAU);ctx.stroke();}ctx.restore();}}
function dbGlyph(ctx,cx,cy,c,s){s=s||1;ctx.save();ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=2.2;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(cx,cy-16*s+i*14*s,20*s,6*s,0,0,TAU);ctx.stroke();}ctx.beginPath();ctx.moveTo(cx-20*s,cy-16*s);ctx.lineTo(cx-20*s,cy+12*s);ctx.moveTo(cx+20*s,cy-16*s);ctx.lineTo(cx+20*s,cy+12*s);ctx.stroke();ctx.restore();}
function appCard(ctx,x,y,w,h,a,o){o=o||{};const c=APP[a].c;glass(ctx,x,y,w,h,16,c,{glow:18,ea:0.55});led(ctx,x+12,y+16,5,h-32,c);
  T(ctx,APP[a].n,x+32,y+42,{w:700,size:o.ts||24});T(ctx,o.sub||"system of record",x+32,y+68,{w:500,size:17,color:rgba(SOFT,0.95)});dbGlyph(ctx,x+w-44,y+h/2+2,c,0.9);
  const n=o.n==null?8:o.n;for(let i=0;i<n;i++){ctx.fillStyle=rgba(c,0.25+0.65*hash(i,a.length+2));rr(ctx,x+32+i*18,y+h-30,12,12,3);ctx.fill();}}
function vault(ctx,x,y,w,h,edge,cellCol,title,sub){glass(ctx,x,y,w,h,20,edge,{glow:34,ga:0.45});led(ctx,x+24,y+14,w-48,3,edge);
  const cs=16,gap=7,cols=Math.floor((w-44)/(cs+gap)),rows=Math.floor((h-150)/(cs+gap)),ox=x+(w-(cols*(cs+gap)-gap))/2,oy=y+118;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const col=cellCol(r,c);const X=ox+c*(cs+gap),Y=oy+r*(cs+gap);if(!col){ctx.strokeStyle="rgba(150,180,230,0.12)";ctx.lineWidth=1;rr(ctx,X,Y,cs,cs,4);ctx.stroke();continue;}ctx.fillStyle=rgba(col,0.35+0.6*hash(r*37+c,9));rr(ctx,X,Y,cs,cs,4);ctx.fill();}
  if(title)chip(ctx,x+w/2,y+62,"databricks",title,sub,{align:"center",edge:edge});}
function hub(ctx,cx,cy,r,t){ctx.save();ctx.shadowColor=rgba(CYAN,0.6);ctx.shadowBlur=26;ctx.beginPath();for(let i=0;i<6;i++){const a=i*TAU/6+Math.PI/6;const px=cx+r*Math.cos(a),py=cy+r*Math.sin(a);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fillStyle="rgba(14,26,52,0.78)";ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=rgba(CYAN,0.9);ctx.lineWidth=2;ctx.stroke();ctx.restore();
  for(let i=0;i<14;i++){const a=i*TAU/14+t*0.3,px=cx+r*0.66*Math.cos(a),py=cy+r*0.66*Math.sin(a);ctx.save();ctx.translate(px,py);ctx.rotate(a);const on=hash(i,3)>0.35;ctx.fillStyle=on?rgba(i%3?APP.sis.c:APP.lms.c,0.85):"rgba(150,180,230,0.15)";rr(ctx,-7,-5,14,10,3);ctx.fill();ctx.restore();}
  ctx.save();ctx.strokeStyle=rgba(INK,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-24,cy-10);ctx.lineTo(cx+20,cy-10);ctx.moveTo(cx+10,cy-20);ctx.lineTo(cx+22,cy-10);ctx.lineTo(cx+10,cy);ctx.moveTo(cx+24,cy+12);ctx.lineTo(cx-20,cy+12);ctx.moveTo(cx-10,cy+2);ctx.lineTo(cx-22,cy+12);ctx.lineTo(cx-10,cy+22);ctx.stroke();ctx.restore();}
function gate(ctx,cx,cy,h,edge,kind){ctx.save();ctx.fillStyle=rgba(edge,0.06);ctx.beginPath();ctx.ellipse(cx,cy,28,h/2,0,0,TAU);ctx.fill();ctx.shadowColor=rgba(edge,0.9);ctx.shadowBlur=22;ctx.strokeStyle=rgba(edge,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(cx,cy,28,h/2,0,0,TAU);ctx.stroke();ctx.shadowBlur=0;
  ctx.strokeStyle=rgba(edge,0.55);ctx.lineWidth=1.5;if(kind==="tests"){for(let i=-4;i<=4;i++){const yy=cy+i*h*0.09,xx=28*Math.sqrt(Math.max(0,1-Math.pow((yy-cy)/(h/2),2)));ctx.beginPath();ctx.moveTo(cx-xx,yy);ctx.lineTo(cx+xx,yy);ctx.stroke();}}
  else if(kind==="lens"){ctx.beginPath();ctx.moveTo(cx,cy-h/2);ctx.quadraticCurveTo(cx+22,cy,cx,cy+h/2);ctx.quadraticCurveTo(cx-22,cy,cx,cy-h/2);ctx.stroke();}
  else if(kind==="join"){ctx.beginPath();ctx.moveTo(cx-20,cy-h*0.3);ctx.lineTo(cx,cy);ctx.lineTo(cx-20,cy+h*0.3);ctx.moveTo(cx,cy);ctx.lineTo(cx+22,cy);ctx.stroke();}
  else{ctx.beginPath();ctx.arc(cx-6,cy,12,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(cx+6,cy,12,0,TAU);ctx.stroke();}ctx.restore();}
/* the sketch: the conceptual model */
function sketch(ctx,ox,oy,w,h,wrong,a){a=a==null?1:a;const col=wrong?[255,140,90]:[150,225,255];ctx.save();ctx.globalAlpha*=a;
  const E=wrong?{Student:[0.2,0.25],Course:[0.62,0.22],Enrolment:[0.62,0.72],Class:[0.2,0.76]}:{Student:[0.18,0.24],Enrolment:[0.52,0.24],Class:[0.84,0.24],Term:[0.84,0.74],Course:[0.18,0.74]};
  const R=wrong?[["Student","Course","1","1"],["Course","Enrolment","1","*"]]:[["Student","Enrolment","1","*"],["Enrolment","Class","*","1"],["Class","Term","*","1"],["Student","Course","*","1"]];
  const sc=Math.min(1,w/800),bw=210*sc,bh=58*sc,P0=n=>[ox+E[n][0]*w,oy+E[n][1]*h];
  ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=12;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4;
  R.forEach(([A,B,ca,cb])=>{const[a1,a2]=P0(A),[b1,b2]=P0(B);const dx=b1-a1,dy=b2-a2,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;const ex=Math.abs(ux)>Math.abs(uy)?bw/2:bh/2/Math.max(0.3,Math.abs(uy))*Math.abs(uy);
    const sA=[a1+ux*(Math.abs(ux)>0.5?bw/2:bh/2),a2+uy*(Math.abs(ux)>0.5?bw/2:bh/2)],sB=[b1-ux*(Math.abs(ux)>0.5?bw/2:bh/2),b2-uy*(Math.abs(ux)>0.5?bw/2:bh/2)];
    ctx.beginPath();ctx.moveTo(sA[0],sA[1]);ctx.lineTo(sB[0],sB[1]);ctx.stroke();
    const foot=(p,sx,sy)=>{const nx=-sy,ny=sx,q=[p[0]-sx*20*sc,p[1]-sy*20*sc];ctx.beginPath();ctx.moveTo(p[0]+nx*13*sc,p[1]+ny*13*sc);ctx.lineTo(q[0],q[1]);ctx.lineTo(p[0]-nx*13*sc,p[1]-ny*13*sc);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();};
    const bar=(p,sx,sy)=>{const nx=-sy,ny=sx;ctx.beginPath();ctx.moveTo(p[0]-sx*14*sc+nx*11*sc,p[1]-sy*14*sc+ny*11*sc);ctx.lineTo(p[0]-sx*14*sc-nx*11*sc,p[1]-sy*14*sc-ny*11*sc);ctx.stroke();};
    (cb==="*"?foot:bar)(sB,ux,uy);(ca==="*"?foot:bar)(sA,-ux,-uy);});
  ctx.shadowBlur=0;Object.keys(E).forEach(n=>{const[x,y]=P0(n);ctx.fillStyle="rgba(8,14,30,0.9)";rr(ctx,x-bw/2,y-bh/2,bw,bh,10);ctx.fill();ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=14;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4;rr(ctx,x-bw/2,y-bh/2,bw,bh,10);ctx.stroke();ctx.shadowBlur=0;T(ctx,n,x,y+8*sc,{w:700,size:Math.max(14,24*sc),align:"center",color:rgba(col,1)});});
  if(!wrong){T(ctx,"census date",P0("Term")[0],P0("Term")[1]+bh/2+24*sc,{w:600,size:Math.max(12,18*sc),align:"center",color:rgba(col,0.85)});}ctx.restore();}
/* gold: modern renderings of each style, in floating glass frames with domain LEDs */
function paintRealism2(x,w,h){x.drawImage(master2(1),0,0,w,h);const pts=[[0.16,0.36,"Tower L9 · 118 of 120 seats",1],[0.46,0.6,"Learning hub · 1,240 people",1],[0.8,0.68,"Labs · 3 booked",-1]];
  pts.forEach(([px,py,s,d])=>{const X=px*w,Y=py*h,LX=X+d*70,LY=Y-70;x.strokeStyle="rgba(255,255,255,0.9)";x.lineWidth=2;x.beginPath();x.arc(X,Y,7,0,TAU);x.stroke();x.beginPath();x.moveTo(X+d*5,Y-5);x.lineTo(LX,LY);x.stroke();x.font=font(700,20);const tw3=x.measureText(s).width;const bx=d>0?LX:LX-tw3-20;rr(x,bx,LY-18,tw3+20,32,6);x.fillStyle="rgba(6,10,22,0.8)";x.fill();x.fillStyle="#fff";x.fillText(s,bx+10,LY+5);});}
function paintModern2(x,w,h){x.fillStyle="#0b1126";x.fillRect(0,0,w,h);let g=x.createRadialGradient(w*0.34,h*0.5,0,w*0.34,h*0.5,h*0.36);g.addColorStop(0,"#6ae6d4");g.addColorStop(1,"#178a80");x.fillStyle=g;x.beginPath();x.arc(w*0.34,h*0.5,h*0.34,0,TAU);x.fill();
  x.fillStyle="#f2f5fb";x.fillRect(w*0.62,h*0.16,w*0.09,h*0.66);x.fillStyle="#ff8a5c";x.fillRect(w*0.76,h*0.54,w*0.15,h*0.28);
  x.fillStyle="#08202a";x.font=font(800,h*0.17);x.textAlign="center";x.fillText("94%",w*0.34,h*0.56);x.textAlign="left";}
function paintRules2(x,w,h){x.fillStyle="#08122a";x.fillRect(0,0,w,h);const vx=w/2,vy=h*0.42;x.strokeStyle="rgba(120,190,255,0.25)";x.lineWidth=1.2;for(let i=0;i<=16;i++){x.beginPath();x.moveTo(vx,vy);x.lineTo(i*w/16,h);x.stroke();}for(let k=1;k<10;k++){const f=Math.pow(k/10,1.7),y=vy+(h-vy)*f;x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();}
  x.strokeStyle="rgba(255,209,102,0.95)";x.lineWidth=2.5;for(let s=-1;s<=1;s+=2)for(let k=0;k<5;k++){const f=1-k*0.18,cx=vx+s*w*0.44*f,top=lerp(vy,h*0.14,f),bot=lerp(vy,h*0.95,f);x.beginPath();x.moveTo(cx,bot);x.lineTo(cx,top);x.stroke();if(k<4){const nf=f-0.18,nx=vx+s*w*0.44*nf,nt=lerp(vy,h*0.14,nf);x.beginPath();x.moveTo(cx,top);x.quadraticCurveTo((cx+nx)/2,top-h*0.1*f,nx,nt);x.stroke();}}
  x.strokeStyle="rgba(255,209,102,0.4)";x.setLineDash([6,8]);x.beginPath();x.moveTo(vx,0);x.lineTo(vx,h);x.stroke();x.beginPath();x.arc(vx,vy,h*0.3,0,TAU);x.stroke();x.setLineDash([]);
  for(let r=0;r<3;r++)for(let i=0;i<7;i++){const f=0.45+r*0.22,y=lerp(vy,h*0.96,f),xx=lerp(vx,w*(0.1+i*0.133),f),s=f;x.strokeStyle="rgba(150,220,255,0.95)";x.lineWidth=2;rr(x,xx-9*s,y-46*s,18*s,40*s,9*s);x.stroke();x.beginPath();x.arc(xx,y-56*s,8*s,0,TAU);x.stroke();}
  x.fillStyle="rgba(255,209,102,0.95)";x.font=font(500,h*0.045,"mono");x.textAlign="center";x.fillText("CENSUS DATE COUNT  1,204",vx,h*0.08);x.textAlign="left";}
function paintLive2(x,w,h){x.fillStyle="#0a0f22";x.fillRect(0,0,w,h);const M=master2(1),md=M.getContext("2d").getImageData(0,0,PICW,PICH).data;
  for(let i=0;i<6000;i++){const px=hash(i,71)*w,py=hash(i,72)*h,sx=Math.floor(px/w*PICW),sy=Math.floor(py/h*PICH),j=(sy*PICW+sx)*4;x.save();x.translate(px,py);x.rotate((hash(i,73)-0.5)*0.9);x.fillStyle="rgba("+md[j]+","+md[j+1]+","+md[j+2]+",0.8)";rr(x,-8,-2.2,16,4.4,2.2);x.fill();x.restore();}
  x.fillStyle="rgba(255,70,80,0.95)";rr(x,24,24,92,36,18);x.fill();x.fillStyle="#fff";x.font=font(800,19);x.fillText("LIVE",48,49);}
const PT2={};function painting2(k){if(!PT2[k]){const c=mkCanvas(PW,PH);({realism:paintRealism2,modern:paintModern2,rules:paintRules2,live:paintLive2})[k](c.getContext("2d"),PW,PH);PT2[k]=c;}return PT2[k];}
function ledFrame(ctx,x,y,w,h,c,img,o){o=o||{};const p=o.pad==null?Math.max(4,w*0.03):o.pad;ctx.save();ctx.shadowColor=rgba(c,0.85);ctx.shadowBlur=o.glow||26;ctx.strokeStyle=rgba(c,1);ctx.lineWidth=o.lw||3;rr(ctx,x-p,y-p,w+2*p,h+2*p,Math.max(3,p*0.8));ctx.stroke();ctx.restore();
  ctx.fillStyle="rgba(10,16,30,0.6)";rr(ctx,x-p,y-p,w+2*p,h+2*p,Math.max(3,p*0.8));ctx.fill();ctx.drawImage(img,o.sx||0,o.sy||0,o.sw||img.width,o.sh||img.height,x,y,w,h);
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.11)");g.addColorStop(0.35,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);}
function plaque(ctx,x,y,w,rows,c){const h=20+rows.length*52;glass(ctx,x,y,w,h,14,c,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.9)"});
  rows.forEach((r,i)=>{const yy=y+16+i*52;let tx=x+18;if(r[2]){const lw=logo(ctx,r[2],tx,yy+8,28);tx+=Math.max(lw,26)+10;}T(ctx,r[0],tx,yy+16,{size:15,w:700,color:rgba(SOFT,0.95)});T(ctx,r[1],tx,yy+40,{size:21,w:700});});return h;}

// A model, reasoning, hands and a loop, the second film of What an agent is, the first series on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (dates in words). The few longer stops are in breath.js.
const NARR={
"off":{"name":"Hands off","lead":1.6,"tail":1.0,"vo":[
 {"id":"date","gap":0.8,"text":"On the 18th of June, 1914, crowds line the River Seine, just outside Paris, for a contest to make aeroplanes safer.","say":"On the eighteenth of June, nineteen fourteen, crowds line the River Seine, just outside Paris, for a contest to make aeroplanes safer."},
 {"id":"last","gap":0.8,"text":"Last to fly is Lawrence Sperry, a young American, with his French mechanic, Emil Cachin."},
 {"id":"hard","gap":0.8,"text":"Flying is hard, tiring work."},
 {"id":"gust","gap":0.8,"text":"When a gust tips a wing, the pilot has to level it again, at once, all through the flight."},
 {"id":"ache","gap":0.8,"text":"On a long flight, his arms and back ache."},
 {"id":"fall","gap":0.8,"text":"And if he's tired, or slow, a tipped aeroplane can slip sideways, and fall."},
 {"id":"change","gap":0.8,"text":"Something has to change."},
 {"id":"box","gap":0.8,"text":"Sperry's answer is a box of four gyroscopes: wheels that spin so fast they keep pointing the same way, however the aeroplane moves."},
 {"id":"feels","gap":0.8,"text":"Each time the aeroplane tips, the box feels it, and pistons driven by air level it again."},
 {"id":"hands","gap":0.8,"text":"Over the river, Sperry lets go, and raises his hands."},
 {"id":"wing","gap":0.8,"text":"Cachin climbs out along the wing."},
 {"id":"dips","gap":0.8,"text":"The aeroplane dips under his weight, and the box brings it back."},
 {"id":"prize","gap":0.8,"text":"The judges give Sperry first prize, and now a pilot can let go, and rest."},
 {"id":"auto","gap":0.8,"text":"His box grew into the autopilot: today, airline pilots fly by hand for only a few minutes of a typical flight."},
 {"id":"seats","gap":0.8,"text":"And they stay in their seats, to watch, and decide."},
 {"id":"nomodel","gap":0.8,"text":"Sperry's box has hands, a check and a loop, but no model: it does one known job, the same way every time."},
 {"id":"agent","gap":0.8,"text":"Put a model that reasons inside that loop, and you have an agent."}
]},
"question":{"name":"Jun's question","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university, Planning asks Jun how the census-day count has changed since last year."},
 {"id":"census","gap":0.8,"text":"Census day, the 31st of March, is when the university counts who is studying.","say":"Census day, the thirty-first of March, is when the university counts who is studying."},
 {"id":"byhand","gap":0.8,"text":"By hand, that's an afternoon of small corrections: find the tables, read the rules, query, check, fix."},
 {"id":"gives","gap":0.8,"text":"So Jun gives it to an agent, which takes the steps and checks its own work, while he reviews and decides."}
]},
"writes":{"name":"A model writes","lead":1.0,"tail":1.0,"vo":[
 {"id":"four","gap":0.8,"text":"An agent has four parts, and the first is a model."},
 {"id":"learned","gap":0.8,"text":"It has learned from a vast amount of writing, and it writes what's likely to come next."},
 {"id":"guess","gap":0.8,"text":"Ask it for the census-day count, and the best it can write is a guess: it has never seen the university's records."},
 {"id":"alone","gap":0.8,"text":"On its own, a model can't look anything up, or check what it wrote."}
]},
"reasons":{"name":"Reasoning","lead":1.0,"tail":1.0,"vo":[
 {"id":"second","gap":0.8,"text":"The second part is reasoning."},
 {"id":"plan","gap":0.3,"text":"Before it acts, the model writes out a plan: find the tables, count the students,"},
 {"id":"report","gap":0.8,"text":"and check the total against the census report, the university's official count."},
 {"id":"rules","gap":0.8,"text":"It checks the plan against the rules Jun's team gave it: only the university's tools, only reading, and evidence for every answer."},
 {"id":"result","gap":0.8,"text":"It reads each result as feedback, and changes the plan if it must."},
 {"id":"is","gap":0.8,"text":"Reasoning is feedback, and checks against rules."}
]},
"hands":{"name":"Hands","lead":1.0,"tail":1.0,"vo":[
 {"id":"third","gap":0.8,"text":"The third part is hands: a model can't open a table, but tools can."},
 {"id":"three","gap":0.8,"text":"Jun's agent has three: Catalog, which lists the tables; Query, which reads the data; and Docs, with the university's definitions."},
 {"id":"server","gap":0.8,"text":"Each comes from a tool server: a small program that offers it to agents."},
 {"id":"mcp","gap":0.8,"text":"They plug in through an open standard, the Model Context Protocol, so any agent that follows it can use them."},
 {"id":"read","gap":0.8,"text":"Reading is all this job needs, so these three can only read: their account can't change a single row."}
]},
"loop":{"name":"A loop","lead":1.0,"tail":1.0,"vo":[
 {"id":"fourth","gap":0.8,"text":"The fourth part is a loop: plan, act, check, and round again, until the goal is met."},
 {"id":"counts","gap":0.8,"text":"The agent finds the students' table in Catalog, and counts with Query."},
 {"id":"short","gap":0.8,"text":"Then the check: its total is 476 short of the census report."},
 {"id":"today","gap":0.8,"text":"The model reads that feedback: did it count the students as they are today?"},
 {"id":"rule","gap":0.8,"text":"It reads the census rule in Docs: count each student as their record stood on census day."},
 {"id":"again","gap":0.8,"text":"A new query, with that date, gives 18,412."},
 {"id":"passes","gap":0.8,"text":"Its total matches the census report, and the check passes."},
 {"id":"unlike","gap":0.8,"text":"Unlike Sperry's box, which can only push back, the model decides what to try next."},
 {"id":"stops","gap":0.8,"text":"The loop stops when the checks pass, at its limit of tries, or when it needs a person."}
]},
"answer":{"name":"The answer, with its evidence","lead":1.0,"tail":1.0,"vo":[
 {"id":"brings","gap":0.8,"text":"The agent brings Jun its answer: 18,412 students on census day, 454 more than last year."},
 {"id":"evid","gap":0.8,"text":"And its evidence: the tables it read, the rule, both queries, and the check that failed, then passed."},
 {"id":"decides","gap":0.8,"text":"Its check is evidence, not approval: Jun reads it, and decides what goes to Planning."}
]},
"script":{"name":"A plain script","lead":1.0,"tail":1.0,"vo":[
 {"id":"march","gap":0.8,"text":"Next March, Planning will want the same count, and now the steps are known."},
 {"id":"recipe","gap":0.8,"text":"So Jun saves the query as a recipe in the project, with a test against the census report, and Noor approves it."},
 {"id":"runs","gap":0.8,"text":"Every census day, it runs in seconds, for almost nothing, the same way every time, like Sperry's box."},
 {"id":"took","gap":0.8,"text":"The agent took four minutes and twelve steps. A plain rerun needs no agent."},
 {"id":"web","gap":0.3,"text":"An agent can also take the long way: one of the team's agents once searched the web for the census rules,"},
 {"id":"docs","gap":0.8,"text":"though Docs had them, because its plan didn't name its tools."},
 {"id":"names","gap":0.8,"text":"Now each plan names its tools, and gives the agent only those the job needs."},
 {"id":"known","gap":0.8,"text":"Where the steps can be written down, let a plain script run them."},
 {"id":"keep","gap":0.8,"text":"Keep agents for the work whose steps nobody can write in advance."}
]},
"seat":{"name":"Back in the seat","lead":1.0,"tail":1.0,"vo":[
 {"id":"held","gap":0.8,"text":"Sperry's box held the aeroplane level, the one job it knew, while the pilot stayed in his seat."},
 {"id":"took","gap":0.8,"text":"Jun's agent took the steps of a new question, and brought him the evidence to decide."},
 {"id":"is","gap":0.8,"text":"An agent is a model that reasons, with hands, in a loop."},
 {"id":"only","gap":0.8,"text":"Use one only where a plain script can't do the job."}
]}
};

const VODUR={"off/date": 8.409, "off/last": 5.583, "off/hard": 1.979, "off/gust": 5.125, "off/ache": 2.363, "off/fall": 4.413, "off/change": 1.34, "off/box": 8.456, "off/feels": 5.41, "off/hands": 3.174, "off/wing": 1.684, "off/dips": 3.239, "off/prize": 4.459, "off/auto": 7.317, "off/seats": 2.505, "off/nomodel": 6.878, "off/agent": 3.625, "question/today": 6.051, "question/census": 4.926, "question/byhand": 6.375, "question/gives": 6.102, "writes/four": 2.942, "writes/learned": 4.564, "writes/guess": 6.517, "writes/alone": 3.646, "reasons/second": 1.618, "reasons/plan": 4.38, "reasons/report": 4.284, "reasons/rules": 8.088, "reasons/result": 4.035, "reasons/is": 2.76, "hands/third": 4.202, "hands/three": 8.32, "hands/server": 4.133, "hands/mcp": 6.658, "hands/read": 6.189, "loop/fourth": 4.892, "loop/counts": 4.101, "loop/short": 4.649, "loop/today": 3.958, "loop/rule": 5.32, "loop/again": 3.865, "loop/passes": 3.374, "loop/unlike": 5.09, "loop/stops": 4.67, "answer/brings": 8.132, "answer/evid": 5.815, "answer/decides": 5.07, "script/march": 3.896, "script/recipe": 7.01, "script/runs": 6.502, "script/took": 4.683, "script/web": 6.046, "script/docs": 3.213, "script/names": 4.85, "script/known": 3.145, "script/keep": 3.671, "seat/held": 5.321, "seat/took": 4.745, "seat/is": 3.354, "seat/only": 2.682};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the agent dropping into Sperry's loop becoming the title card; and the end card. */
const BREATH={
"off":{"hold":{"date":0.6,"last":0.6,"hard":0.4,"gust":0.8,"ache":0.6,"fall":1.0,"change":1.0,"box":0.8,"feels":1.0,"hands":1.0,"wing":0.4,"dips":1.0,"prize":0.6,"auto":0.8,"seats":0.8,"nomodel":0.8},"breathe":4.6},
"question":{"hold":{"today":0.6,"census":0.8,"byhand":1.0,"gives":0.6}},
"writes":{"hold":{"four":1.2,"learned":1.6,"guess":1.6,"alone":1.2}},
"reasons":{"hold":{"second":0.4,"report":0.8,"rules":0.8,"result":0.4,"is":0.6}},
"hands":{"hold":{"third":0.8,"three":1.0,"server":0.8,"mcp":1.0,"read":1.0}},
"loop":{"hold":{"fourth":1.0,"counts":0.8,"short":1.2,"today":0.8,"rule":0.8,"again":0.8,"passes":1.2,"unlike":0.8,"stops":0.8}},
"answer":{"hold":{"brings":0.4,"evid":1.0,"decides":0.6}},
"script":{"hold":{"march":0.8,"recipe":1.2,"runs":1.4,"took":1.2,"docs":1.4,"names":1.0,"known":1.0,"keep":1.4}},
"seat":{"hold":{"held":0.8,"took":0.8,"is":1.0},"breathe":5.0}
};

/* ===== Shared components for the v4 film ===== */
function withA(ctx,a,fn){if(a<=0.002)return;ctx.save();ctx.globalAlpha*=Math.min(1,a);fn();ctx.restore();}
const fin=(t,a,d)=>sstep(a,a+(d||0.6),t);
function flowTiles(ctx,t,pts,every,dur,off,spFn,size,al){const L=mk(pts);spawn(t,every,dur,off,(u,k)=>{const q=at(L,u);dtile(ctx,q.x,q.y,size,(hash(k,3)-0.5)*0.4,spFn(k),(al==null?1:al)*sstep(0,0.08,u)*(1-sstep(0.9,1,u)));});}
function phone3(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);glass(ctx,-60,-118,120,236,22,[170,205,255],{fill:"rgba(10,18,36,0.94)",glow:18,ea:0.7});
  rr(ctx,-50,-100,100,196,12);ctx.fillStyle="rgba(40,70,130,0.35)";ctx.fill();ctx.beginPath();ctx.arc(0,-108,3.5,0,TAU);ctx.fillStyle="rgba(200,220,255,0.8)";ctx.fill();
  const scr=o.screen||"enrol";
  if(scr==="enrol"){T(ctx,"Data Science 101",0,-62,{w:800,size:12.5,align:"center"});T(ctx,"Tue 9:00 · B204",0,-44,{w:500,size:10.5,align:"center",color:rgba(SOFT,0.95)});ctx.fillStyle="rgba(160,190,240,0.22)";for(let i=0;i<3;i++){rr(ctx,-36,-24+i*14,72-i*14,6,3);ctx.fill();}
    rr(ctx,-34,40,68,28,14);ctx.fillStyle=o.press?"rgba(140,210,255,1)":"rgba(77,163,255,0.92)";ctx.fill();T(ctx,"Enrol",0,59,{w:800,size:12.5,align:"center",color:"#fff"});}
  else if(scr==="seat"){T(ctx,"Seat free?",0,-62,{w:800,size:13,align:"center"});T(ctx,"Tue 9 am · DS101",0,-44,{w:500,size:10.5,align:"center",color:rgba(SOFT,0.95)});if(o.ans>0){ctx.globalAlpha*=o.ans;rr(ctx,-38,-18,76,64,10);ctx.fillStyle="rgba(120,240,170,0.16)";ctx.fill();T(ctx,"1",0,16,{w:800,size:28,align:"center",color:rgba(GOOD,1)});T(ctx,"seat left",0,36,{w:600,size:10.5,align:"center",color:rgba(GOOD,1)});}}
  else if(scr==="confirm"){ctx.fillStyle=rgba(GOOD,0.95);ctx.beginPath();ctx.arc(0,-26,22,0,TAU);ctx.fill();ctx.strokeStyle="#0a1020";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-10,-26);ctx.lineTo(-3,-18);ctx.lineTo(11,-34);ctx.stroke();T(ctx,"Enrolment",0,16,{w:800,size:13,align:"center"});T(ctx,"confirmed",0,33,{w:800,size:13,align:"center"});}
  ctx.restore();}
function screen2(ctx,x,y,w,h,edge){glass(ctx,x,y,w,h,14,edge||[170,205,255],{glow:16,ea:0.6,fill:"rgba(8,14,28,0.92)"});}
function bars(ctx,x,y,w,h,t,c,n){n=n||6;for(let i=0;i<n;i++){const v=0.3+0.7*Math.abs(Math.sin(i*1.9+t*0.6));const bw=w/n*0.62;ctx.fillStyle=rgba(mix(c,[255,255,255],i/n*0.3),0.9);rr(ctx,x+i*w/n+(w/n-bw)/2,y+h*(1-v),bw,h*v,4);ctx.fill();}}
function bellGlyph(ctx,x,y,s,ring){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(ring*28)*0.22*ring);ctx.scale(s,s);ctx.strokeStyle=rgba(LAYER.gold,1);ctx.lineWidth=3;ctx.shadowColor=rgba(LAYER.gold,0.9);ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(-6,-30);ctx.quadraticCurveTo(-22,-26,-22,0);ctx.lineTo(-28,14);ctx.lineTo(28,14);ctx.lineTo(22,0);ctx.quadraticCurveTo(22,-26,6,-30);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,20,5,0,TAU);ctx.stroke();ctx.restore();
  if(ring>0){ctx.save();for(let k=0;k<3;k++){const r=(ring*1.5+k*0.33)%1;ctx.strokeStyle=rgba(LAYER.gold,0.55*(1-r));ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,s*(40+r*90),-0.6,0.6);ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*(40+r*90),Math.PI-0.6,Math.PI+0.6);ctx.stroke();}ctx.restore();}}
function projector2(ctx,x,y,s,flip){ctx.save();ctx.translate(x,y);ctx.scale(flip?-s:s,s);glass(ctx,-56,-32,100,64,16,[255,228,170],{glow:18,ea:0.8});ctx.beginPath();ctx.arc(46,0,18,0,TAU);ctx.fillStyle="rgba(10,14,24,1)";ctx.fill();ctx.strokeStyle=rgba(LAYER.gold,1);ctx.lineWidth=3;ctx.stroke();ctx.restore();glow(ctx,x+(flip?-46:46)*s,y,40*s,[255,236,190],0.7);}
function cone(ctx,x0,y0,x1,y1,x2,y2,c,a){ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createLinearGradient(x0,y0,(x1+x2)/2,(y1+y2)/2);g.addColorStop(0,rgba(c,0.28*a));g.addColorStop(1,rgba(c,0.08*a));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.lineTo(x2,y2);ctx.closePath();ctx.fill();ctx.restore();}
function orb(ctx,x,y,r,t){glow(ctx,x,y,r*3.2+Math.sin(t*2)*6,[255,226,160],0.55);ctx.save();const g=ctx.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r);g.addColorStop(0,"rgba(255,250,235,1)");g.addColorStop(0.5,"rgba(255,214,140,0.9)");g.addColorStop(1,"rgba(255,170,90,0.3)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,236,190,0.6)";ctx.lineWidth=2;for(let k=0;k<2;k++){ctx.beginPath();ctx.ellipse(x,y,r*1.6,r*0.45,t*0.4+k*1.2,0,TAU);ctx.stroke();}ctx.restore();}
function sysCard(ctx,x,y,w,h,title,sub,c,icon){glass(ctx,x,y,w,h,16,c,{glow:16,ea:0.6});led(ctx,x+12,y+16,5,h-32,c);T(ctx,title,x+32,y+(sub?h/2-4:h/2+8),{w:700,size:22});if(sub)T(ctx,sub,x+32,y+h/2+22,{w:500,size:16,color:rgba(SOFT,0.95)});if(icon)icon(ctx,x+w-44,y+h/2);}
const ICON={
 lms:(ctx,x,y)=>{ctx.save();ctx.strokeStyle=rgba(INK,0.9);ctx.lineWidth=2.5;rr(ctx,x-20,y-14,40,26,4);ctx.stroke();ctx.beginPath();ctx.moveTo(x-10,y+18);ctx.lineTo(x+10,y+18);ctx.stroke();ctx.restore();},
 lib:(ctx,x,y)=>{ctx.save();ctx.strokeStyle=rgba(INK,0.9);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y-12);ctx.quadraticCurveTo(x-12,y-18,x-22,y-12);ctx.lineTo(x-22,y+14);ctx.quadraticCurveTo(x-12,y+8,x,y+14);ctx.quadraticCurveTo(x+12,y+8,x+22,y+14);ctx.lineTo(x+22,y-12);ctx.quadraticCurveTo(x+12,y-18,x,y-12);ctx.lineTo(x,y+14);ctx.stroke();ctx.restore();},
 old:(ctx,x,y)=>{ctx.save();ctx.strokeStyle=rgba(INK,0.9);ctx.lineWidth=2.5;rr(ctx,x-22,y-18,44,30,4);ctx.stroke();ctx.fillStyle=rgba(GOOD,0.9);ctx.font=font(500,11,"mono");ctx.fillText("C:\\>_",x-17,y+1);ctx.restore();},
 doc:(ctx,x,y)=>{ctx.save();ctx.strokeStyle=rgba(INK,0.9);ctx.lineWidth=2.5;rr(ctx,x-16,y-20,32,40,4);ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-9,y-8+i*9);ctx.lineTo(x+9,y-8+i*9);ctx.stroke();}ctx.restore();},
 uni:(ctx,x,y)=>{ctx.save();ctx.strokeStyle=rgba(INK,0.9);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x-22,y-6);ctx.lineTo(x,y-20);ctx.lineTo(x+22,y-6);ctx.closePath();ctx.stroke();for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x-15+i*10,y-4);ctx.lineTo(x-15+i*10,y+14);ctx.stroke();}ctx.beginPath();ctx.moveTo(x-24,y+16);ctx.lineTo(x+24,y+16);ctx.stroke();ctx.restore();},
 flow:(ctx,x,y)=>{ctx.save();ctx.strokeStyle=rgba(INK,0.9);ctx.lineWidth=2.5;[-18,0,18].forEach(dx=>ctx.strokeRect(x+dx-7,y-7,14,14));ctx.beginPath();ctx.moveTo(x-11,y);ctx.lineTo(x-7,y);ctx.moveTo(x+7,y);ctx.lineTo(x+11,y);ctx.stroke();ctx.restore();},
 books:(ctx,x,y)=>{ctx.save();["#e08a5a","#5b8fe0","#e0c05a","#6fc28a"].forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(x-20+i*10,y-16+(i%2)*4,8,32-(i%2)*4);});ctx.restore();},
 hand:(ctx,x,y)=>{ctx.save();ctx.fillStyle="#6a8ee8";rr(ctx,x-18,y-16,36,32,4);ctx.fill();ctx.fillStyle="#f4f1ea";ctx.fillRect(x-14,y+6,28,5);ctx.restore();}};
/* animated sketch: o.ent = entities shown (count, fractional), o.rel = relationships drawn (0..1) */
function sketchA(ctx,ox,oy,w,h,wrong,a,o){o=o||{};const ent=o.ent==null?99:o.ent,rel=o.rel==null?1:o.rel;const col=wrong?[255,140,90]:[150,225,255];ctx.save();ctx.globalAlpha*=a;
  const E=wrong?{Student:[0.2,0.25],Course:[0.62,0.22],Enrolment:[0.62,0.72],Class:[0.2,0.76]}:{Student:[0.18,0.24],Class:[0.84,0.24],Enrolment:[0.51,0.24],Term:[0.84,0.76],Course:[0.18,0.76]};
  const R=wrong?[["Student","Course","1","1"],["Course","Enrolment","1","*"]]:[["Student","Enrolment","1","*"],["Enrolment","Class","*","1"],["Class","Term","*","1"],["Student","Course","*","1"]];
  const sc=Math.min(1.4,w/800),bw=210*sc,bh=58*sc,P0=n=>[ox+E[n][0]*w,oy+E[n][1]*h];
  ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=12;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4*Math.max(1,sc*0.8);
  R.forEach(([A,B,ca,cb],ri)=>{const f=clamp(rel*R.length-ri,0,1);if(f<=0)return;const[a1,a2]=P0(A),[b1,b2]=P0(B);const dx=b1-a1,dy=b2-a2,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,off=v=>Math.abs(ux)>0.5?bw/2:bh/2;
    const sA=[a1+ux*off(),a2+uy*off()],sB=[b1-ux*off(),b2-uy*off()];ctx.beginPath();ctx.moveTo(sA[0],sA[1]);ctx.lineTo(lerp(sA[0],sB[0],f),lerp(sA[1],sB[1],f));ctx.stroke();if(f<1)return;
    const foot=(p,sx,sy)=>{const nx=-sy,ny=sx,q=[p[0]-sx*20*sc,p[1]-sy*20*sc];ctx.beginPath();ctx.moveTo(p[0]+nx*13*sc,p[1]+ny*13*sc);ctx.lineTo(q[0],q[1]);ctx.lineTo(p[0]-nx*13*sc,p[1]-ny*13*sc);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();};
    const bar=(p,sx,sy)=>{const nx=-sy,ny=sx;ctx.beginPath();ctx.moveTo(p[0]-sx*14*sc+nx*11*sc,p[1]-sy*14*sc+ny*11*sc);ctx.lineTo(p[0]-sx*14*sc-nx*11*sc,p[1]-sy*14*sc-ny*11*sc);ctx.stroke();};
    (cb==="*"?foot:bar)(sB,ux,uy);(ca==="*"?foot:bar)(sA,-ux,-uy);});
  ctx.shadowBlur=0;Object.keys(E).forEach((n,i)=>{const f=clamp(ent-i,0,1);if(f<=0)return;const[x,y]=P0(n);ctx.save();ctx.globalAlpha*=f;ctx.fillStyle="rgba(8,14,30,0.92)";rr(ctx,x-bw/2,y-bh/2,bw,bh,10*sc);ctx.fill();ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=14;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4;rr(ctx,x-bw/2,y-bh/2,bw,bh,10*sc);ctx.stroke();ctx.shadowBlur=0;T(ctx,n,x,y+9*sc,{w:700,size:Math.max(14,24*sc),align:"center",color:rgba(col,1)});ctx.restore();});
  if(!wrong&&ent>4.5)T(ctx,"census date",P0("Term")[0],P0("Term")[1]+bh/2+26*sc,{w:600,size:Math.max(12,18*sc),align:"center",color:rgba(col,0.85)});ctx.restore();}
function pictureCells(ctx,x,y,w,h,fillFn,k){const cw=w/6,ch=h/4,M=master2(k||1),s=TCELL*(k||1);for(let c=0;c<24;c++){const f=fillFn(c);if(f<=0)continue;ctx.save();ctx.globalAlpha*=f;ctx.drawImage(M,(c%6)*s,((c/6)|0)*s,s,s,x+(c%6)*cw,y+((c/6)|0)*ch,cw+0.5,ch+0.5);ctx.restore();}}

function magnifier(ctx,cx,cy,r,sp,tx,ty,label,col){ctx.save();ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=1.5;ctx.setLineDash([5,6]);ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(cx+(tx-cx)*r/Math.hypot(tx-cx,ty-cy),cy+(ty-cy)*r/Math.hypot(tx-cx,ty-cy));ctx.stroke();ctx.setLineDash([]);
  ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fillStyle="rgba(6,10,20,0.92)";ctx.fill();ctx.save();ctx.clip();dtile(ctx,cx,cy,r*1.25,-0.06,sp,1);ctx.restore();ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=20;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();ctx.restore();
  if(label)tag(ctx,cx,cy+r+28,label,col,{align:"center",size:18});}
/* ===== Data product variety: different, named products per domain ===== */
const PVW=480,PVH=320,PVC={};
function pvBg(x,w,h){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,"#0f1733");g.addColorStop(1,"#070b18");x.fillStyle=g;x.fillRect(0,0,w,h);}
const PVF={
 donut(x,w,h,c){pvBg(x,w,h);const cx=w*0.34,cy=h*0.52,r=h*0.3;x.lineWidth=h*0.1;x.strokeStyle="rgba(255,255,255,0.1)";x.beginPath();x.arc(cx,cy,r,0,TAU);x.stroke();x.strokeStyle=rgba(c,1);x.beginPath();x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*0.72);x.stroke();x.fillStyle="#fff";x.font=font(800,h*0.15);x.textAlign="center";x.fillText("72%",cx,cy+h*0.05);x.textAlign="left";for(let i=0;i<3;i++){x.fillStyle=rgba(mix(c,[255,255,255],i*0.3),0.9);rr(x,w*0.64,h*(0.3+i*0.16),w*0.28*(1-i*0.25),h*0.07,4);x.fill();}},
 bars(x,w,h,c){pvBg(x,w,h);for(let i=0;i<8;i++){const v=0.3+0.65*Math.abs(Math.sin(i*1.3+c[0]*0.01)),g=x.createLinearGradient(0,h*0.86-h*0.7*v,0,h*0.86);g.addColorStop(0,rgba(mix(c,[255,255,255],0.35),1));g.addColorStop(1,rgba(c,0.45));x.fillStyle=g;rr(x,w*0.08+i*w*0.108,h*0.86-h*0.7*v,w*0.07,h*0.7*v,4);x.fill();}x.fillStyle="rgba(255,255,255,0.3)";x.fillRect(w*0.06,h*0.87,w*0.88,2);},
 line(x,w,h,c){pvBg(x,w,h);x.strokeStyle="rgba(255,255,255,0.07)";x.lineWidth=1;for(let i=1;i<5;i++){x.beginPath();x.moveTo(0,h*i/5);x.lineTo(w,h*i/5);x.stroke();}const pts=[];for(let i=0;i<=24;i++)pts.push([w*0.05+i*w*0.9/24,h*(0.72-0.36*(i/24)-0.1*Math.sin(i*0.8+c[1]*0.02))]);x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.lineTo(w*0.95,h*0.95);x.lineTo(w*0.05,h*0.95);x.closePath();const g=x.createLinearGradient(0,h*0.2,0,h);g.addColorStop(0,rgba(c,0.45));g.addColorStop(1,rgba(c,0));x.fillStyle=g;x.fill();x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);x.lineWidth=4;x.stroke();},
 kpi(x,w,h,c,n){pvBg(x,w,h);x.fillStyle="#fff";x.font=font(800,h*0.28);x.fillText(n||"1,204",w*0.08,h*0.5);x.fillStyle=rgba(c,1);x.font=font(700,h*0.085);x.fillText("▲ 4.2% on last year",w*0.08,h*0.66);x.strokeStyle=rgba(c,1);x.lineWidth=3;x.beginPath();for(let i=0;i<=18;i++){const px=w*0.08+i*w*0.047,py=h*(0.88-0.08*Math.sin(i*0.9)-i*0.006);i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();},
 seats(x,w,h,c){x.fillStyle="#08122a";x.fillRect(0,0,w,h);x.strokeStyle="rgba(120,190,255,0.18)";x.lineWidth=1;for(let i=0;i<=12;i++){x.beginPath();x.moveTo(i*w/12,0);x.lineTo(i*w/12,h);x.stroke();}for(let r=0;r<6;r++)for(let k=0;k<12;k++){const on=hash(r*12+k,7)>0.28;x.strokeStyle=on?rgba(c,1):"rgba(255,209,102,0.55)";x.lineWidth=2;rr(x,w*0.06+k*w*0.074,h*0.2+r*h*0.12,w*0.05,h*0.08,4);x.stroke();if(on){x.fillStyle=rgba(c,0.35);x.fill();}}x.fillStyle="rgba(255,209,102,0.95)";x.font=font(500,h*0.06,"mono");x.fillText("COUNT ON CENSUS DATE",w*0.06,h*0.12);},
 timeline(x,w,h,c){x.fillStyle="#08122a";x.fillRect(0,0,w,h);x.strokeStyle="rgba(150,200,255,0.5)";x.lineWidth=2;x.beginPath();x.moveTo(w*0.06,h*0.55);x.lineTo(w*0.94,h*0.55);x.stroke();for(let i=0;i<=13;i++){const px=w*0.06+i*w*0.88/13;x.beginPath();x.moveTo(px,h*0.5);x.lineTo(px,h*0.6);x.stroke();x.fillStyle=rgba(c,0.25+0.6*hash(i,5));rr(x,px-w*0.02,h*0.64,w*0.04,h*0.2*(0.3+hash(i,6)),3);x.fill();}const cx=w*0.06+4*w*0.88/13;x.strokeStyle="rgba(255,209,102,1)";x.lineWidth=3;x.beginPath();x.moveTo(cx,h*0.18);x.lineTo(cx,h*0.9);x.stroke();x.fillStyle="rgba(255,209,102,1)";x.font=font(700,h*0.07);x.fillText("census date",cx+8,h*0.24);},
 floor(x,w,h,c){pvBg(x,w,h);x.strokeStyle="rgba(170,200,245,0.5)";x.lineWidth=2;x.strokeRect(w*0.06,h*0.1,w*0.88,h*0.8);for(let r=0;r<3;r++)for(let k=0;k<5;k++){const on=hash(r*5+k,11)>0.4,X=w*0.08+k*w*0.172,Y=h*0.13+r*h*0.25;x.strokeStyle="rgba(170,200,245,0.4)";x.strokeRect(X,Y,w*0.16,h*0.22);if(on){x.fillStyle=rgba(c,0.55);x.fillRect(X+3,Y+3,w*0.16-6,h*0.22-6);}}},
 table(x,w,h,c){pvBg(x,w,h);x.fillStyle=rgba(c,0.85);x.fillRect(w*0.04,h*0.08,w*0.92,h*0.09);x.font=font(500,h*0.045,"mono");for(let r=0;r<9;r++){x.fillStyle=r%2?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.08)";x.fillRect(w*0.04,h*(0.19+r*0.085),w*0.92,h*0.085);for(let k=0;k<5;k++){x.fillStyle="rgba(230,238,250,0.85)";x.fillText(String((hash(r*5+k,9)*98000)|0),w*(0.06+k*0.18),h*(0.25+r*0.085));}}},
 network(x,w,h,c){pvBg(x,w,h);const N=[];for(let i=0;i<14;i++)N.push([w*(0.1+0.8*hash(i,21)),h*(0.12+0.76*hash(i,22))]);x.lineWidth=1.5;for(let i=0;i<14;i++)for(let j=i+1;j<14;j++){if(hash(i*14+j,23)>0.8){x.strokeStyle=rgba(c,0.45);x.beginPath();x.moveTo(N[i][0],N[i][1]);x.lineTo(N[j][0],N[j][1]);x.stroke();}}N.forEach((p,i)=>{x.fillStyle=i%4?rgba(c,1):"#fff";x.beginPath();x.arc(p[0],p[1],h*(0.02+0.03*hash(i,24)),0,TAU);x.fill();});},
 heat(x,w,h,c){pvBg(x,w,h);for(let r=0;r<5;r++)for(let k=0;k<13;k++){const v=0.15+0.85*Math.abs(Math.sin(r*1.3+k*0.7));x.fillStyle=rgba(mix([30,40,70],c,v),1);rr(x,w*0.05+k*w*0.07,h*0.14+r*h*0.15,w*0.062,h*0.13,3);x.fill();}},
 funnel(x,w,h,c){pvBg(x,w,h);const lb=["Applications","Offers","Enrolled","On census date"];for(let i=0;i<4;i++){const a=w*(0.86-i*0.17),b=w*(0.86-(i+1)*0.17),y=h*(0.08+i*0.22);x.fillStyle=rgba(mix(c,[255,255,255],i*0.15),0.9-i*0.1);x.beginPath();x.moveTo(w/2-a/2,y);x.lineTo(w/2+a/2,y);x.lineTo(w/2+b/2,y+h*0.19);x.lineTo(w/2-b/2,y+h*0.19);x.closePath();x.fill();x.fillStyle="#0a0f1c";x.font=font(700,h*0.06);x.textAlign="center";x.fillText(lb[i],w/2,y+h*0.12);x.textAlign="left";}},
 scatter(x,w,h,c){pvBg(x,w,h);x.strokeStyle="rgba(255,255,255,0.3)";x.lineWidth=2;x.beginPath();x.moveTo(w*0.08,h*0.08);x.lineTo(w*0.08,h*0.9);x.lineTo(w*0.94,h*0.9);x.stroke();for(let i=0;i<24;i++){const px=w*(0.12+0.8*hash(i,31)),py=h*(0.85-0.7*((px/w-0.12)/0.8)*(0.6+0.4*hash(i,32)));x.fillStyle=rgba(c,0.8);x.beginPath();x.arc(px,py,h*(0.015+0.025*hash(i,33)),0,TAU);x.fill();}x.strokeStyle="rgba(255,209,102,0.9)";x.setLineDash([8,6]);x.beginPath();x.moveTo(w*0.1,h*0.85);x.lineTo(w*0.92,h*0.25);x.stroke();x.setLineDash([]);},
 area(x,w,h,c){pvBg(x,w,h);for(let L=2;L>=0;L--){x.beginPath();x.moveTo(w*0.05,h*0.92);for(let i=0;i<=20;i++){x.lineTo(w*0.05+i*w*0.9/20,h*(0.92-(0.2+L*0.18)-0.08*Math.sin(i*0.6+L)));}x.lineTo(w*0.95,h*0.92);x.closePath();x.fillStyle=rgba(mix(c,[255,255,255],L*0.22),0.75);x.fill();}},
 gauge(x,w,h,c){pvBg(x,w,h);const cx=w/2,cy=h*0.8,r=h*0.55;x.lineWidth=h*0.09;x.strokeStyle="rgba(255,255,255,0.1)";x.beginPath();x.arc(cx,cy,r,Math.PI,TAU);x.stroke();x.strokeStyle=rgba(c,1);x.beginPath();x.arc(cx,cy,r,Math.PI,Math.PI*1.81);x.stroke();const a=Math.PI*1.81;x.strokeStyle="#fff";x.lineWidth=4;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*r*0.8,cy+Math.sin(a)*r*0.8);x.stroke();x.fillStyle="#fff";x.font=font(800,h*0.14);x.textAlign="center";x.fillText("81%",cx,cy-h*0.08);x.textAlign="left";},
 live(x,w,h,c){x.drawImage(painting2("live"),0,0,w,h);}};
const DVAR={teaching:[["floor","Rooms in use now"],["heat","Weekly teaching load"],["bars","Class sizes"],["timeline","Term calendar"],["gauge","Room utilisation"],["line","Attendance trend"]],
 students:[["funnel","Admissions funnel"],["seats","Census count"],["donut","Retention"],["table","Enrolment detail"],["line","Applications trend"],["kpi","Headcount","32,410"]],
 research:[["network","Collaborations"],["scatter","Grants and outputs"],["kpi","Research income","$48M"],["area","Income by source"],["live","Lab activity now"],["bars","Publications"]],
 finance:[["table","Ledger detail"],["area","Spend by area"],["line","Cash trend"],["kpi","Budget","$3.2M"],["donut","Cost recovery"],["gauge","Forecast accuracy"]]};
function pv(d,i){const key=d+"|"+i;if(PVC[key])return PVC[key];const cv=mkCanvas(PVW,PVH),v=DVAR[d][i];PVF[v[0]](cv.getContext("2d"),PVW,PVH,DOM[d].c,v[2]);PVC[key]=cv;return cv;}
const pvTitle=(d,i)=>DVAR[d][i][1];
/* ===== The organisational brain (Genie Ontology) and live updates ===== */
const BRAIN=(()=>{const inside=(x,y)=>((x/380)**2+((y+10)/215)**2<=1&&y<140)||(((x-215)/115)**2+((y-150)/72)**2<=1);const N=[];let k=0;while(N.length<150&&k<6000){const x=(hash(k,101)-0.5)*780,y=(hash(k,102)-0.5)*470;if(inside(x,y)&&N.every(p=>Math.hypot(p[0]-x,p[1]-y)>33))N.push([x,y]);k++;}
  const E=[];N.forEach((p,i)=>{const d=N.map((q,j)=>[Math.hypot(q[0]-p[0],q[1]-p[1]),j]).filter(a=>a[1]!==i).sort((a,b)=>a[0]-b[0]);for(let m=0;m<3;m++){const j=d[m][1];if(!E.some(e=>e[0]===j&&e[1]===i))E.push([i,j]);}});
  return{N,E,HUBS:[["Student",-230,-70],["Enrolment",-20,-120],["Class",190,-60],["Term",200,70],["Course",-210,80]]};})();
function brainNet(ctx,cx,cy,s,t,act,o){o=o||{};const B=BRAIN,col=[160,215,255],H=B.HUBS;ctx.save();ctx.translate(cx,cy);ctx.scale(s,s);
  ctx.save();ctx.beginPath();ctx.ellipse(0,-10,388,222,0,0,TAU);ctx.moveTo(333,150);ctx.ellipse(215,150,118,74,0,0,TAU);const g=ctx.createRadialGradient(-60,-60,40,0,0,430);g.addColorStop(0,"rgba(90,140,255,0.17)");g.addColorStop(1,"rgba(40,60,140,0.03)");ctx.fillStyle=g;ctx.fill();ctx.shadowColor=rgba(col,0.55);ctx.shadowBlur=28;ctx.strokeStyle=rgba(col,0.45);ctx.lineWidth=3;ctx.stroke();ctx.restore();
  ctx.save();ctx.beginPath();ctx.ellipse(0,-10,380,214,0,0,TAU);ctx.clip();ctx.strokeStyle=rgba(col,0.1);ctx.lineWidth=3;for(let i=0;i<8;i++){ctx.beginPath();for(let x=-400;x<=400;x+=16){const y=-190+i*50+Math.sin(x*0.022+i*1.7)*15;x===-400?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}ctx.restore();
  ctx.lineWidth=1.3;B.E.forEach(([i,j],k)=>{const p=B.N[i],q=B.N[j];ctx.strokeStyle=rgba(col,0.1+0.25*act*hash(k,5));ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();});
  [[0,1],[1,2],[2,3],[0,4]].forEach(([a,b])=>{ctx.strokeStyle=rgba(LAYER.gold,0.35+0.5*act);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(H[a][1],H[a][2]);ctx.lineTo(H[b][1],H[b][2]);ctx.stroke();});
  const rate=0.5+1.8*act,per=2.6-1.4*act;B.E.forEach(([i,j],k)=>{const ph=(t*rate*0.45+hash(k,7)*7)%per;if(ph>1)return;const p=B.N[i],q=B.N[j],u=hash(k,8)>0.5?ph:1-ph;glow(ctx,lerp(p[0],q[0],u),lerp(p[1],q[1],u),9,hash(k,9)>0.72?LAYER.gold:(hash(k,10)>0.5?C.mcp:[150,210,255]),0.9);});
  B.N.forEach((p,i)=>{const f=0.5+0.5*Math.sin(t*(1.2+hash(i,11))+i);ctx.fillStyle=rgba(col,0.35+0.5*f*(0.4+0.6*act));ctx.beginPath();ctx.arc(p[0],p[1],3.2,0,TAU);ctx.fill();});
  H.forEach(h=>{glow(ctx,h[1],h[2],34+8*Math.sin(t*2+h[1]),LAYER.gold,0.55+0.4*act);ctx.fillStyle=rgba(LAYER.gold,1);ctx.beginPath();ctx.arc(h[1],h[2],7,0,TAU);ctx.fill();});ctx.restore();
  if(o.labels!==false)H.forEach(h=>tag(ctx,cx+h[1]*s,cy+h[2]*s-24,h[0],LAYER.gold,{align:"center",size:15}));}
const brainHub=(cx,cy,s,i)=>P(cx+BRAIN.HUBS[i][1]*s,cy+BRAIN.HUBS[i][2]*s);
function liveOverlay(ctx,x,y,w,h,t){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const R=[[0.08,0.24,0.18,0.78],[0.32,0.6,0.52,0.76],[0.68,0.94,0.63,0.78]];
  for(let i=0;i<48;i++){const b=R[i%3],px=x+w*lerp(b[0],b[1],hash(i,61)),py=y+h*lerp(b[2],b[3],hash(i,62)),on=Math.sin(t*(0.8+hash(i,63)*1.8)+hash(i,64)*9)>0.15;ctx.fillStyle=hash(i,65)>0.5?"rgba(255,220,140,"+(on?0.95:0.12)+")":"rgba(140,210,255,"+(on?0.95:0.12)+")";rr(ctx,px,py,Math.max(2,w*0.02),Math.max(1.5,h*0.013),1.5);ctx.fill();if(on)glow(ctx,px,py,w*0.028,[255,220,160],0.3);}
  const sx=x+((t*0.22)%1)*w,g=ctx.createLinearGradient(sx-w*0.08,0,sx+w*0.08,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(255,255,255,0.1)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(sx-w*0.08,y,w*0.16,h);
  const pr=(t*1.2)%1;ctx.strokeStyle="rgba(255,80,90,"+(0.9*(1-pr))+")";ctx.lineWidth=Math.max(1.2,w*0.004);ctx.beginPath();ctx.arc(x+w*0.073,y+h*0.066,w*0.012+pr*w*0.035,0,TAU);ctx.stroke();ctx.restore();}
function pvLive(ctx,d,i,x,y,w,h,t){const v=DVAR[d][i][0];if(v==="live"){liveOverlay(ctx,x,y,w,h,t);return;}if(v!=="floor")return;ctx.save();
  for(let r=0;r<3;r++)for(let k=0;k<5;k++){const n=r*5+k,X=x+w*(0.08+k*0.172)+1,Y=y+h*(0.13+r*0.25)+1,on=Math.sin(t*(0.5+hash(n,71))+hash(n,72)*9)>0;ctx.fillStyle="#0d1430";ctx.fillRect(X,Y,w*0.16-2,h*0.22-2);if(on){ctx.fillStyle=rgba(DOM[d].c,0.6);ctx.fillRect(X+1,Y+1,w*0.16-4,h*0.22-4);}}
  const pr=(t*1.2)%1;ctx.fillStyle="rgba(255,70,80,0.95)";ctx.beginPath();ctx.arc(x+w*0.05,y+h*0.06,Math.max(2,w*0.012),0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,80,90,"+(0.9*(1-pr))+")";ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x+w*0.05,y+h*0.06,Math.max(2,w*0.012)+pr*w*0.03,0,TAU);ctx.stroke();ctx.restore();}

/* ===== A Sharper Sketch: components =====
   Everything here draws with the first film's primitives (glass, T, tag, chip, glow, dtile, orb) so the two films look like one world. */
const SCENES=[];const cue=(sc,id)=>sc.cues[id];
function scene(id,draw){const n=NARR[id];SCENES.push({id,name:n.name,lead:n.lead,tail:n.tail,vo:n.vo,draw});}
function clearTo(ctx,S){setScreen(ctx,S);ctx.fillStyle="#03050b";ctx.fillRect(0,0,W,H);}
function bgW(ctx,S,cam){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#070b17");g.addColorStop(1,"#03050b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  setCam(ctx,S,cam);const x0=cam.x-W/2/cam.z,x1=cam.x+W/2/cam.z,y0=cam.y-H/2/cam.z,y1=cam.y+H/2/cam.z;ctx.strokeStyle="rgba(120,160,230,0.045)";ctx.lineWidth=1/cam.z;
  for(let x=Math.floor(x0/48)*48;x<=x1;x+=48){ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.stroke();}for(let y=Math.floor(y0/48)*48;y<=y1;y+=48){ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();}}
function vign(ctx,S){setScreen(ctx,S);const v=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,W*0.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.55)");ctx.fillStyle=v;ctx.fillRect(0,0,W,H);}
const CAM0={x:960,y:540,z:1};

// the sketch's ink is the first film's; the reference model is drawn in a warm ink on tracing paper
const SK=[150,225,255],REF=[255,214,160],ADOPT=[90,170,255],EXT=[255,176,64];
const lerpP=(a,b,u)=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];

/* the sketch at each version: positions of the box centres (the board is 1920 × 1080) */
const V1={Student:[576,413],Enrolment:[972,413],Class:[1368,413],Term:[1368,657],Course:[576,657]};
const V1R=[["Student","Enrolment","1","*"],["Enrolment","Class","*","1"],["Class","Term","*","1"],["Student","Course","*","1"]];
const L2={Student:[330,510],Enrolment:[760,510],Offering:[1200,510],Unit:[1620,510],Class:[1200,730],Term:[1620,730],Course:[330,290]};
const L3={Student:[330,290],Admission:[760,290],Course:[1200,290],Enrolment:[760,510],Offering:[1200,510],Unit:[1620,510],Status:[760,730],Class:[1200,730],Term:[1620,730]};
const L3R=[["Student","Admission","1","*"],["Admission","Course","*","1"],["Admission","Enrolment","1","*"],["Enrolment","Offering","*","1"],["Offering","Unit","*","1"],["Offering","Class","1","*"],["Offering","Term","*","1"],["Enrolment","Status","1","*"]];
const NAME={Student:"Student",Admission:"Course admission",Course:"Course",Enrolment:"Unit enrolment",Offering:"Unit offering",Unit:"Unit",Status:"Status change",Class:"Class",Term:"Teaching period"};
// blue pins: adopted from the reference; amber pins: our extensions
const PINS={Student:"adopt",Admission:"adopt",Course:"adopt",Enrolment:"adopt",Unit:"adopt",Offering:"extend",Class:"extend",Status:"extend",Term:"extend"};

/* one entity: a glass box with its name, an optional line under it, an optional list of attributes, and an optional pin */
function entBox(ctx,e){const s=e.s||1,ts=24*s,sub=e.sub,at=e.attrs||[];
  let w=Math.max(200*s,tw(ctx,e.name,ts,700)+52*s);if(sub)w=Math.max(w,tw(ctx,sub,16*s,600)+44*s);at.forEach(r=>{w=Math.max(w,tw(ctx,r[0],17*s,500,"mono")+84*s);});
  const h=(sub?80:58)*s+(at.length?at.length*30*s+14*s:0);return{x:e.x,y:e.y,w,h};}
function ent(ctx,e){const a=e.a==null?1:e.a;if(a<=0.01)return;const s=e.s||1,col=e.col||SK,b=entBox(ctx,e),x=b.x-b.w/2,y=b.y-b.h/2,hi=e.hi||0;
  ctx.save();ctx.globalAlpha*=a;
  if(hi>0)glow(ctx,b.x,b.y,Math.max(b.w,b.h)*0.9,e.hiCol||col,0.35*hi);
  ctx.fillStyle=e.fill||"rgba(8,14,30,0.94)";rr(ctx,x,y,b.w,b.h,10*s);ctx.fill();
  ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=12+10*hi;ctx.strokeStyle=rgba(e.edge||col,0.95);ctx.lineWidth=(2.2+1.2*hi)*s;if(e.dash)ctx.setLineDash([9*s,7*s]);rr(ctx,x,y,b.w,b.h,10*s);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
  const ny=e.sub?y+34*s:y+37*s;T(ctx,e.name,b.x,ny,{w:700,size:24*s,align:"center",color:rgba(col,1)});
  if(e.sub)withA(ctx,e.subA==null?1:e.subA,()=>T(ctx,e.sub,b.x,y+62*s,{w:600,size:16*s,align:"center",color:rgba(e.subCol||SOFT,1)}));
  if(e.attrs&&e.attrs.length){const y0=y+(e.sub?80:58)*s;ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.2*s;ctx.beginPath();ctx.moveTo(x+12*s,y0);ctx.lineTo(x+b.w-12*s,y0);ctx.stroke();
    e.attrs.forEach((r,i)=>withA(ctx,e.attrA==null?1:clamp(e.attrA*e.attrs.length-i,0,1),()=>{const yy=y0+28*s+i*30*s;
      if(r[1]==="id"){ctx.fillStyle=rgba(REF,1);ctx.beginPath();ctx.arc(x+24*s,yy-6*s,5*s,0,TAU);ctx.fill();}
      T(ctx,r[0],x+40*s,yy,{f:"mono",w:500,size:17*s,color:r[1]==="id"?rgba(REF,1):rgba(INK,0.9)});}));}
  if(e.pin&&(e.pinA==null||e.pinA>0))withA(ctx,e.pinA==null?1:e.pinA,()=>{const pc=e.pin==="adopt"?ADOPT:EXT,px=x+b.w-4*s,py=y+4*s,pr=(9+4*(e.pinP||0))*s;glow(ctx,px,py,34*s,pc,0.5+0.5*(e.pinP||0));
    ctx.fillStyle=rgba(pc,1);ctx.beginPath();ctx.arc(px,py,pr,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.85)";ctx.beginPath();ctx.arc(px-pr*0.3,py-pr*0.3,pr*0.32,0,TAU);ctx.fill();});
  ctx.restore();return b;}

/* one relationship: a line between two boxes, with a bar (one) or a crow's foot (many) at each end */
function relLine(ctx,A,B,ca,cb,o){o=o||{};const f=o.f==null?1:o.f,a=o.a==null?1:o.a,s=o.s||1,col=o.col||SK;if(f<=0||a<=0.01)return;
  const dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy);if(L<1)return;const ux=dx/L,uy=dy/L;
  const cut=(b)=>Math.min(Math.abs(ux)>1e-6?b.w/2/Math.abs(ux):1e9,Math.abs(uy)>1e-6?b.h/2/Math.abs(uy):1e9);
  const sA=[A.x+ux*cut(A),A.y+uy*cut(A)],sB=[B.x-ux*cut(B),B.y-uy*cut(B)];
  ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=10;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=(o.lw||2.4)*s;if(o.dash)ctx.setLineDash([9*s,7*s]);
  ctx.beginPath();ctx.moveTo(sA[0],sA[1]);ctx.lineTo(lerp(sA[0],sB[0],f),lerp(sA[1],sB[1],f));ctx.stroke();ctx.setLineDash([]);
  if(f>=1){const foot=(p,sx,sy)=>{const nx=-sy,ny=sx,q=[p[0]-sx*20*s,p[1]-sy*20*s];ctx.beginPath();ctx.moveTo(p[0]+nx*13*s,p[1]+ny*13*s);ctx.lineTo(q[0],q[1]);ctx.lineTo(p[0]-nx*13*s,p[1]-ny*13*s);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();};
    const bar=(p,sx,sy)=>{const nx=-sy,ny=sx;ctx.beginPath();ctx.moveTo(p[0]-sx*14*s+nx*11*s,p[1]-sy*14*s+ny*11*s);ctx.lineTo(p[0]-sx*14*s-nx*11*s,p[1]-sy*14*s-ny*11*s);ctx.stroke();};
    (cb==="*"?foot:bar)(sB,ux,uy);(ca==="*"?foot:bar)(sA,-ux,-uy);
    if(o.words){ctx.shadowBlur=0;const wd=c=>c==="*"?"many":"one",off=(p,sx,sy)=>[p[0]-sx*44*s-sy*22*s,p[1]-sy*44*s+sx*22*s+6*s];
      const pa=off(sA,-ux,-uy),pb=off(sB,ux,uy);withA(ctx,o.words,()=>{T(ctx,wd(ca),pa[0],pa[1],{f:"mono",w:500,size:15*s,align:"center",color:rgba(REF,1)});T(ctx,wd(cb),pb[0],pb[1],{f:"mono",w:500,size:15*s,align:"center",color:rgba(REF,1)});});}}
  if(o.bad)glow(ctx,(sA[0]+sB[0])/2,(sA[1]+sB[1])/2,90,BAD,0.5*o.bad);
  ctx.restore();}

/* a whole diagram: E maps a key to {x,y,name,...}, R lists [from,to,one-or-many,one-or-many,{options}] */
function diagram(ctx,E,R){const B={};Object.keys(E).forEach(k=>{if(E[k])B[k]=entBox(ctx,E[k]);});
  R.forEach(r=>{const o=r[4]||{};if(B[r[0]]&&B[r[1]])relLine(ctx,B[r[0]],B[r[1]],r[2],r[3],Object.assign({},o,{a:(o.a==null?1:o.a)*Math.min(E[r[0]].a==null?1:E[r[0]].a,E[r[1]].a==null?1:E[r[1]].a),s:o.s||E[r[0]].s}));});
  Object.keys(E).forEach(k=>{if(E[k])ent(ctx,E[k]);});return B;}
function board(ctx,a,label){withA(ctx,a,()=>{glass(ctx,110,170,1700,720,22,SK,{glow:18,ea:0.35,fill:"rgba(10,18,36,0.5)"});if(label)tag(ctx,150,170,label,SK,{size:18});});}

/* the reference model, TCSI, on a sheet of tracing paper that slides over the sketch */
const REFE={Student:[330,300,"Student"],Admission:[760,300,"Course admission"],Course:[1200,300,"Course"],Enrolment:[760,560,"Unit enrolment","census date · status"],Unit:[1200,560,"Unit of study"]};
const REFR=[["Student","Admission","1","*"],["Admission","Course","*","1"],["Admission","Enrolment","1","*"],["Enrolment","Unit","*","1"]];
function paper(ctx,a,dx,t,hi,o){if(a<=0.01)return;o=o||{};hi=hi||{};const x=110+dx,y=160+(o.dy||0);
  ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgba(3,5,11,0.55)";ctx.fillRect(-400,-400,W+800,H+800);ctx.restore();
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate((o.rot||-0.006));
  const pw=1700,ph=730;ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=30;ctx.fillStyle="rgba(58,48,36,0.72)";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(pw,0);ctx.lineTo(pw,ph-60);ctx.lineTo(pw-60,ph);ctx.lineTo(0,ph);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle="rgba(255,236,200,0.16)";ctx.beginPath();ctx.moveTo(pw,ph-60);ctx.lineTo(pw-60,ph-60);ctx.lineTo(pw-60,ph);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,226,180,0.07)";ctx.lineWidth=1;for(let yy=36;yy<ph;yy+=36){ctx.beginPath();ctx.moveTo(20,yy);ctx.lineTo(pw-20,yy);ctx.stroke();}
  ctx.strokeStyle=rgba(REF,0.5);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(pw,0);ctx.lineTo(pw,ph-60);ctx.lineTo(pw-60,ph);ctx.lineTo(0,ph);ctx.closePath();ctx.stroke();
  T(ctx,"REFERENCE MODEL",36,50,{w:800,size:18,color:rgba(REF,0.9)});T(ctx,"TCSI · Tertiary Collection of Student Information",36,80,{w:600,size:18,color:rgba(REF,0.7)});
  ctx.translate(-110,-160);const E={};Object.keys(REFE).forEach(k=>{const r=REFE[k];E[k]={x:r[0],y:r[1],name:r[2],sub:r[3],col:REF,dash:true,fill:"rgba(40,32,24,0.9)",hi:hi[k]||0,subCol:REF};});
  diagram(ctx,E,REFR.map(r=>r.concat([{col:REF,dash:true}])));if(o.extra)o.extra(ctx);ctx.restore();}

/* the comparison in the corner: Genie's number against the certified census report */
function hud(ctx,S,a,v,t0,t){if(a<=0.01)return;setScreen(ctx,S);const ok=Math.round(v)===118;withA(ctx,a,()=>{const x=1470,y=34,w=410,h=112;glass(ctx,x,y,w,h,16,ok?GOOD:CYAN,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.92)"});
  T(ctx,"Genie",x+24,y+44,{w:700,size:20,color:rgba(SOFT,1)});T(ctx,""+Math.round(v),x+24,y+92,{w:800,size:42,color:rgba(ok?GOOD:CYAN,1)});
  T(ctx,"Census report",x+200,y+44,{w:700,size:20,color:rgba(SOFT,1)});T(ctx,"118",x+200,y+92,{w:800,size:42,color:rgba(LAYER.gold,1)});
  const gap=Math.round(v)-118;T(ctx,ok?"match":"gap "+gap,x+w-20,y+92,{w:700,size:18,align:"right",color:rgba(ok?GOOD:BAD,1)});
  if(t0!=null&&t>t0&&t<t0+1.4)glow(ctx,x+60,y+80,90,ok?GOOD:CYAN,0.5*(1-(t-t0)/1.4));});}
// the number counts down from a to b between t0 and t0+1
const countTo=(t,t0,a,b)=>lerp(a,b,ease(clamp((t-t0)/1.0,0,1)));

/* a speech bubble, with its text wrapped */
function bubble(ctx,x,y,w,s,col,o){o=o||{};const sz=o.size||28;ctx.save();ctx.font=font(700,sz);const words=s.split(" "),lines=[];let cur="";words.forEach(wd=>{const tr=cur?cur+" "+wd:wd;if(ctx.measureText(tr).width>w-56&&cur){lines.push(cur);cur=wd;}else cur=tr;});if(cur)lines.push(cur);ctx.restore();
  const h=lines.length*sz*1.35+40;glass(ctx,x,y,w,h,18,col,{glow:16,ea:0.7,fill:"rgba(7,12,24,0.92)"});
  ctx.fillStyle="rgba(7,12,24,0.92)";ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=1.6;ctx.beginPath();const tx=o.tail==="right"?x+w-60:x+50;ctx.moveTo(tx,y+h-1);ctx.lineTo(tx+(o.tail==="right"?22:-8),y+h+26);ctx.lineTo(tx+30,y+h-1);ctx.fill();ctx.stroke();
  lines.forEach((l,i)=>T(ctx,l,x+28,y+20+sz*1.05+i*sz*1.35,{w:700,size:sz,color:o.color||rgba(INK,1)}));return h;}

/* a number card: a title, a big number and a line under it */
function numCard(ctx,x,y,w,title,num,sub,col,o){o=o||{};glass(ctx,x,y,w,200,18,col,{glow:18,ea:0.7,fill:"rgba(7,12,24,0.92)"});T(ctx,title,x+28,y+46,{w:700,size:24,color:rgba(SOFT,1)});T(ctx,num,x+28,y+140,{w:800,size:88,color:rgba(col,1)});if(sub)T(ctx,sub,x+28,y+180,{w:600,size:18,color:rgba(SOFT,0.95)});
  if(o.badge)tag(ctx,x+w-28-(tw(ctx,o.badge,16,700)+26),y+40,o.badge,o.badgeCol||GOOD,{size:16});}

/* the version stamp in the sketch's corner */
function stamp(ctx,x,y,s,col,a,flick){withA(ctx,a*(flick?0.55+0.45*Math.abs(Math.sin(flick*9)):1),()=>{const w=tw(ctx,s,20,500,"mono")+34;glass(ctx,x-w,y-20,w,40,10,col,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.92)"});T(ctx,s,x-w/2,y+7,{f:"mono",w:500,size:20,align:"center",color:rgba(col,1)});});}

/* a small table of rows, for the physical model */
function table(ctx,x,y,name,cols,rows,o){o=o||{};const cw=o.cw||cols.map(c=>Math.max(tw(ctx,c,16,500,"mono"),...rows.map(r=>tw(ctx,r[cols.indexOf(c)],16,500,"mono")))+30),w=cw.reduce((a,b)=>a+b,0),rh=40,h=46+rh*(rows.length+1);
  glass(ctx,x,y,w,h,12,o.col||SK,{glow:14,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(ctx,name,x+16,y+31,{f:"mono",w:500,size:18,color:rgba(o.col||SK,1)});
  let cx=x;cols.forEach((c,i)=>{T(ctx,c,cx+15,y+46+27,{f:"mono",w:500,size:16,color:rgba(REF,1)});rows.forEach((r,j)=>withA(ctx,o.rowA?o.rowA(j):1,()=>T(ctx,r[i],cx+15,y+46+rh*(j+1)+27,{f:"mono",w:500,size:16,color:rgba(INK,0.9)})));cx+=cw[i];});
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1;for(let j=0;j<=rows.length+1;j++){ctx.beginPath();ctx.moveTo(x,y+46+rh*j);ctx.lineTo(x+w,y+46+rh*j);ctx.stroke();}
  return{w,h};}

/* a strip of film: one frame per change of status, each with its date */
function filmStrip(ctx,x,y,frames,a,snap,t){withA(ctx,a,()=>{const fw=176,fh=92,w=frames.length*fw+24;ctx.fillStyle="rgba(14,18,28,0.95)";rr(ctx,x,y,w,fh+40,8);ctx.fill();ctx.strokeStyle="rgba(170,200,245,0.3)";ctx.lineWidth=1.4;rr(ctx,x,y,w,fh+40,8);ctx.stroke();
  for(let k=0;k<w/22-1;k++){ctx.fillStyle="rgba(200,215,240,0.18)";rr(ctx,x+12+k*22,y+6,11,8,2);ctx.fill();rr(ctx,x+12+k*22,y+fh+26,11,8,2);ctx.fill();}
  frames.forEach((f,i)=>withA(ctx,f.a==null?1:f.a,()=>{const fx=x+12+i*fw,fy=y+20,c=f.col||SK;ctx.fillStyle="rgba(8,14,30,0.95)";rr(ctx,fx+4,fy,fw-8,fh,6);ctx.fill();ctx.strokeStyle=rgba(c,f.hi?1:0.6);ctx.lineWidth=f.hi?2.6:1.4;rr(ctx,fx+4,fy,fw-8,fh,6);ctx.stroke();
    if(f.hi)glow(ctx,fx+fw/2,fy+fh/2,90,c,0.35*f.hi);T(ctx,f.s,fx+fw/2,fy+40,{w:700,size:20,align:"center",color:rgba(c,1)});T(ctx,f.d,fx+fw/2,fy+70,{f:"mono",w:500,size:16,align:"center",color:rgba(SOFT,1)});}));});}

/* a small calendar card with one marked date */
function calCard(ctx,x,y,title,date,col,a,hi){withA(ctx,a,()=>{glass(ctx,x,y,300,112,14,col,{glow:12+14*(hi||0),ea:0.7,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.9);rr(ctx,x,y,300,30,14);ctx.fill();ctx.fillStyle="rgba(7,12,24,0.94)";ctx.fillRect(x,y+22,300,10);
  T(ctx,title,x+150,y+22,{w:800,size:16,align:"center",color:"#0a1020"});T(ctx,date,x+150,y+80,{w:800,size:28,align:"center",color:rgba(col,1)});T(ctx,"census date",x+150,y+104,{w:600,size:14,align:"center",color:rgba(SOFT,1)});});}

/* ===== What an agent is: the module's kit =====
   The films of the agentic data engineering module (What an agent is, and the series after it) share one look, chosen by the
   author on 3 November 2026: the white lab made Nordic. A pale grey marble wall over a pale oak floor, daylight from a window on the
   right, matte off-white cards with soft shadows; the agent a matte ceramic sphere with a violet band of light, its loop a bent oak
   ring with small graphite arrows, its hands pale robot arms with oak joints. Not watercolour, and no film grain. Ported from the
   style prototype's style X.
   The module's files, bundled in this order after The Inner Life of Data's engine and helpers (core.js, style2.js, ui3.js) and
   A Sharper Sketch's scene() (sketch3.js):
     kit.js    the palette and what each colour means, text, timing, the camera, pictures painted once, and matte shapes
     room.js   the room: marble, oak, skirting and window light, painted once as the places "lab" and "labNight"; a desk, a screen,
               a floor lamp and a framed picture
     people.js the people, with an adult's proportions, three-quarter view, either way round
     agent.js  the agent: the sphere, the oak ring and its steps, the hands, the tools, data coming back, the verdicts
     cards.js  cards, pills, tags, icons, the kicker, and the title and end cards
     finish.js what a film needs before it starts, and the video's motion blur
   Every top-level name starts with ag_ or AG_, except wAt, which keeps the name the cue check (cues.py) reads. A film's own
   helpers go in its own source with a prefix of its own; never change these files for one film.
   Sizes are in the 1920 x 1080 frame. Every word is at least 28 px as seen, and nothing but the captions goes below y 890. */

/* ---------------------------------------------------------------- colours, and what each means in every film of the module */
const AG={
  ink:[35,39,45],      // words
  mut:[86,92,100],     // quieter words
  blue:[38,102,132],   // tools and structure
  violet:[88,78,196],  // the model thinking
  orange:[186,94,54],  // data coming back
  green:[50,116,80],   // a check passes
  amber:[156,100,18],  // a check fails, or a loop
  shadow:[46,40,32],   // the warm shadow everything casts in this room
  white:[255,255,255],
  card:{shadow:"rgba(46,38,28,0.2)",base:"#EEECE7",top:"#F3F1ED",bot:"#E6E3DD",edge:"rgba(60,50,40,0.12)",hi:"rgba(255,255,255,0.75)"},
  sphere:["#F7F5F1","#E5E1DA","#C3BDB2","#A49E93"],sphereShadow:"rgba(46,38,28,0.26)",seam:"rgba(96,86,74,0.28)",
  visor:"#2B2B32",visorLight:[178,170,255],label:[88,82,74],arrow:"#57524C",
  tube:{shadow:"rgba(46,38,28,0.13)",edge:"#BAB3A7",fill:"#ECE9E3",hi:"rgba(255,253,248,0.95)"},
  joint:"#CDB896",jointRim:"#9C8669",grip:"#36373C",hub:"#E4E0D9",hubEdge:"#B5AEA2",
  wallGlow:[120,108,214],kick:[80,86,94],
  sdx:-7               // shadows fall a little to the left: the window is on the right
};
const AG_OAK={base:[208,188,156],dark:[156,136,106],hi:[242,233,216]};   // the ring, the joints, the floor's wood: oiled oak
const AG_MEANS={tools:AG.blue,model:AG.violet,data:AG.orange,pass:AG.green,warn:AG.amber};

/* ---------------------------------------------------------------- text
   ag_T draws with The Inner Life of Data's T (so the legibility check sees it, and {deco:1} marks decoration), in this room's ink
   unless o.col (a colour) or o.color (a CSS colour) says otherwise; o.ls spaces the letters, in px. Size defaults to 28. */
function ag_T(ctx,s,x,y,o){o=o||{};const a=o.a==null?1:o.a,col=o.color||rgba(o.col||AG.ink,a),ls=o.ls||0,q=Object.assign({},o,{color:col,size:o.size||28});
  if(!ls){T(ctx,s,x,y,q);return;}
  // canvas spaces the letters after each one, the last too: move centred and right-aligned words back by that last space
  const dx=o.align==="center"?ls/2:(o.align==="right"||o.align==="end")?ls:0;ctx.save();ctx.letterSpacing=ls+"px";T(ctx,s,x+dx,y,q);ctx.restore();}
function ag_tw(ctx,s,o){o=o||{};ctx.save();ctx.font=font(o.w||600,o.size||28,o.f);const ls=o.ls||0;if(ls)ctx.letterSpacing=ls+"px";const w=ctx.measureText(s).width-(ls&&s.length?ls:0);ctx.restore();return w;}
// words into lines no wider than maxW
function ag_wrap(ctx,s,maxW,o){const ws=String(s).split(" "),out=[];let cur="";for(const w of ws){const tr=cur?cur+" "+w:w;if(ag_tw(ctx,tr,o)>maxW&&cur){out.push(cur);cur=w;}else cur=tr;}if(cur)out.push(cur);return out;}
// several lines, lh apart, the first's baseline at y; returns the last baseline
function ag_lines(ctx,lines,x,y,lh,o){lines.forEach((l,i)=>ag_T(ctx,l,x,y+i*lh,o));return y+(lines.length-1)*lh;}

/* ---------------------------------------------------------------- timing
   Times inside a chapter come from its cues (when each line starts) and from the words of its lines, so the pictures stay with the
   voice if it's recorded again. wAt(sc,"line","word",off): when that word is said (cues.py checks every one is there, whole). */
function wAt(sc,id,word,off){const ln=sc.vo.find(v=>v.id===id);if(!ln)return 0;const s=ln.say||ln.text,i=s.indexOf(word),d=sc.ends[id]-sc.cues[id];
  return sc.cues[id]+(i<0?0:d*i/s.length)+(off||0);}
const ag_in=(t,a,d)=>sstep(a,a+(d||0.6),t);                         // 0 before a, 1 from a+d, smoothly
const ag_io=(t,t0,t1,d)=>ag_in(t,t0,d||0.4)*(1-ag_in(t,t1,d||0.4));  // in at t0, out at t1
const ag_sine=u=>0.5-0.5*Math.cos(Math.PI*clamp(u,0,1));            // draw-ons and camera moves: sine ease
const ag_eo=u=>{u=clamp(u,0,1);return 1-Math.pow(1-u,3);};          // ease out
// spring and settle: 0 before a, overshoots a little, settles at 1 after about 1.8 d
function ag_spr(t,a,d){d=d||0.9;const u=(t-a)/d;if(u<=0)return 0;if(u>=1.8)return 1;return 1-Math.exp(-5*u)*Math.cos(7.2*u);}
// a value that follows keys [[t, v], ...], eased between them (sine), held before the first and after the last
function ag_keys(t,keys,e){e=e||ag_sine;if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++)if(t<=keys[i][0]){const a=keys[i-1],b=keys[i];return lerp(a[1],b[1],e((t-a[0])/((b[0]-a[0])||1)));}return keys[keys.length-1][1];}
// a seeded random number generator: the same seed, the same numbers, in every render
function ag_rnd(seed){let s=(seed>>>0)||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}

/* ---------------------------------------------------------------- the camera
   ag_focus moves the camera through keys [[t, x, y, zoom], ...], gliding (sine ease) over d seconds from each key's time, at least
   1.4 s; push closes in a little more; the view never leaves the frame. ag_shot draws one shot {at, place, keys, draw, push, d}: its
   place under the camera, then draw(ctx, t, cam) on top in the place's coordinates, closing in slowly (push, 2.5% by default) until
   the next shot. ag_shots cuts a chapter into shots, each dissolving in from the one before over dis seconds; it returns the shot.
   A shot marked cut (cut:true) comes in on a cut: when two shots show the same people, the same place or the same words, a dissolve
   lays them over each other, a little apart, and for half a second everything in them shows twice, like a ghost. */
function ag_focus(ctx,t,keys,d,push){d=Math.max(1.4,d||1.6);let x=keys[0][1],y=keys[0][2],z=keys[0][3];
  for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z*(1+(push||0)));x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
function ag_shot(ctx,S,t,sh,till){setScreen(ctx,S);ctx.save();const len=Math.max(1.5,till-sh.at),push=(sh.push==null?0.025:sh.push)*easeCam(clamp((t-sh.at)/len,0,1));
  const cam=ag_focus(ctx,t,sh.keys||[[0,960,540,1]],sh.d,push);if(sh.place)ctx.drawImage(ag_place(sh.place),0,0,W,H);if(sh.draw)sh.draw(ctx,t,cam);ctx.restore();setScreen(ctx,S);}
function ag_shots(ctx,S,t,end,shots,dis){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;dis=dis==null?0.5:dis;
  const u=i>0&&!shots[i].cut?clamp((t-shots[i].at)/dis,0,1):1,till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){ag_shot(ctx,S,t,shots[i-1],shots[i].at);const [bc,bx]=ag_buf("cut",ctx.canvas.width,ctx.canvas.height);ag_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else ag_shot(ctx,S,t,shots[i],till(i));return i;}
// chapters that open on a cut, by id. The engine lays the end of each chapter over the next one's first 0.8 s, so when both show the
// same people, place or words, those show twice; for that time the chapter before draws the next one's opening, and it's a cut. A
// film calls it after its last scene()
function ag_cutInto(ids){for(const id of ids){const i=SCENES.findIndex(s=>s.id===id);if(i<1)throw new Error("ag_cutInto: "+id+" isn't a chapter after the first");
  const pv=SCENES[i-1],nx=SCENES[i],d=pv.draw;pv.draw=function(ctx,S,t,s){return t>=s.dur?nx.draw(ctx,S,t-s.dur,nx):d.apply(this,arguments);};}}

/* ---------------------------------------------------------------- pictures painted once
   AG_PLACES lists the places a film paints: key -> painter(ctx), which paints the whole 1920 x 1080 frame. room.js adds "lab"; a
   film adds its own in its own source. Each is painted once, the first time it's drawn, and kept: the video and the checks paint
   them all before they start, the site's player the first at once and the others after Play (finish.js). Paint a place in well
   under two seconds (check.py times it): work at a lower resolution and scale up what is soft anyway, such as the marble. */
const AG_PLACES={},AG_KEPT={},AG_BUFS={};
function ag_kept(key,w,h,paint){let c=AG_KEPT[key];if(c)return c;c=AG_KEPT[key]=mkCanvas(w,h);paint(c.getContext("2d"),w,h);return c;}
function ag_place(key){const p=AG_PLACES[key];if(!p)throw new Error("no place "+key+" in AG_PLACES");return ag_kept("place:"+key,W,H,p);}
// a scratch canvas, cleared, for a dissolve or a layer
function ag_buf(k,w,h){let c=AG_BUFS[k];if(!c)c=AG_BUFS[k]=mkCanvas(w,h);if(c.width!==w||c.height!==h){c.width=w;c.height=h;}const x=c.getContext("2d");
  x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation="source-over";x.filter="none";x.clearRect(0,0,w,h);return[c,x];}

/* ---------------------------------------------------------------- matte shapes
   Everything solid in these films is matte: a fill, a soft highlight where the window's light falls, and a soft inner shadow on the
   side away from it. A shape is a function that adds its path to the context: (c) => { c.moveTo(...); ... }. */
function ag_shape(c,fn){c.beginPath();fn(c);}
// an inner shadow that works in every browser: fill the area round the shape, outside it, and let its blurred shadow fall inside.
// Only the area near the shape casts it (its bounds, found by tracing the shape, and a margin wider than the blur): the same picture
// as filling the whole canvas, but a blurred fill costs its area, and a place of forty shapes painted in 18 s that way, 0.05 s this.
function ag_inner(c,fn,color,blur,dx,dy){const b=ag_bounds(fn),m=blur*2+Math.abs(dx)+Math.abs(dy)+8;c.save();ag_shape(c,fn);c.clip();
  c.shadowColor=color;c.shadowBlur=blur;c.shadowOffsetX=dx;c.shadowOffsetY=dy;c.beginPath();
  if(b)c.rect(b[0]-m,b[1]-m,b[2]-b[0]+2*m,b[3]-b[1]+2*m);else c.rect(-4000,-4000,12000,12000);fn(c);c.fillStyle="#000";c.fill("evenodd");c.restore();}
// a shape's bounds [x0, y0, x1, y1], from its points and control points (so never too small); null if it calls anything else
function ag_bounds(fn){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,bad=false;const P=(x,y)=>{if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;},
    K={moveTo:P,lineTo:P,closePath:()=>{},bezierCurveTo:(a,b,c,d,e,f)=>{P(a,b);P(c,d);P(e,f);},quadraticCurveTo:(a,b,c,d)=>{P(a,b);P(c,d);},
      arc:(x,y,r)=>{P(x-r,y-r);P(x+r,y+r);},arcTo:(a,b,c,d)=>{P(a,b);P(c,d);},ellipse:(x,y,rx,ry)=>{const r=Math.max(rx,ry);P(x-r,y-r);P(x+r,y+r);},
      rect:(x,y,w,h)=>{P(x,y);P(x+w,y+h);},roundRect:(x,y,w,h)=>{P(x,y);P(x+w,y+h);}};
  try{fn(new Proxy({},{get:(o,k)=>K[k]||(()=>{bad=true;})}));}catch(e){bad=true;}return bad||x1<x0?null:[x0,y0,x1,y1];}
// a matte fill: base colour, a soft highlight of radius rad at (lx, ly), and an inner shadow (blur, falling down and left)
function ag_soft(c,fn,base,hi,lx,ly,rad,shade,blur,a){ag_shape(c,fn);c.fillStyle=rgba(base,1);c.fill();
  c.save();ag_shape(c,fn);c.clip();const g=c.createRadialGradient(lx,ly,0,lx,ly,rad);g.addColorStop(0,rgba(hi,a==null?0.7:a));g.addColorStop(1,rgba(hi,0));
  c.fillStyle=g;c.fillRect(lx-rad,ly-rad,rad*2,rad*2);c.restore();if(shade)ag_inner(c,fn,shade,blur||22,-6,4);}
// soft folds or creases inside a shape: [[from], [control], [to]] curves, a dark line with a light one just above it
function ag_folds(c,fn,list,dark,light){c.save();ag_shape(c,fn);c.clip();c.lineCap="round";for(const f of list){
  c.strokeStyle=dark;c.lineWidth=3;c.beginPath();c.moveTo(f[0][0],f[0][1]);c.quadraticCurveTo(f[1][0],f[1][1],f[2][0],f[2][1]);c.stroke();
  if(light){c.strokeStyle=light;c.lineWidth=2;c.beginPath();c.moveTo(f[0][0]+2,f[0][1]-3);c.quadraticCurveTo(f[1][0]+2,f[1][1]-3,f[2][0]+2,f[2][1]-3);c.stroke();}}c.restore();}
// a soft shadow on the floor or a table: an ellipse of the room's warm shadow, darkest in the middle
function ag_floorShadow(ctx,x,y,rx,ry,a){if(a<=0)return;const g=ctx.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,rgba(AG.shadow,a));g.addColorStop(1,rgba(AG.shadow,0));
  ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,TAU);ctx.fill();ctx.restore();}
// a rounded rectangle as part of a shape (rr() begins a new path, so it can't be one of several in a shape)
function ag_rect(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
// a line along a cubic (p0, p1, p2, p3) that tapers from w0 wide to w1, with round ends: one shape, filled once, so it is never darker
// where its ends overlap it, as a stroke drawn in parts would be
function ag_taper(c,p0,p1,p2,p3,w0,w1,col){const n=24,L=[],R=[],at=t=>{const u=1-t;return[u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1],
    3*u*u*(p1[0]-p0[0])+6*u*t*(p2[0]-p1[0])+3*t*t*(p3[0]-p2[0]),3*u*u*(p1[1]-p0[1])+6*u*t*(p2[1]-p1[1])+3*t*t*(p3[1]-p2[1])];};
  for(let i=0;i<=n;i++){const [x,y,dx,dy]=at(i/n),d=Math.hypot(dx,dy)||1,h=lerp(w0,w1,i/n)/2;L.push([x-dy/d*h,y+dx/d*h]);R.push([x+dy/d*h,y-dx/d*h]);}
  const s=at(0),e=at(1),as=Math.atan2(s[3],s[2]),ae=Math.atan2(e[3],e[2]);c.fillStyle=col;c.beginPath();c.moveTo(L[0][0],L[0][1]);for(const q of L)c.lineTo(q[0],q[1]);
  c.arc(p3[0],p3[1],w1/2,ae+Math.PI/2,ae-Math.PI/2,true);for(let i=n;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.arc(p0[0],p0[1],w0/2,as-Math.PI/2,as+Math.PI/2,true);c.closePath();c.fill();}
// scale about a point
function ag_about(ctx,x,y,k){ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);}
// a cubic curve as eight numbers [x0,y0, x1,y1, x2,y2, x3,y3]: its point at u, and its path from u0 to u1
function ag_bz(p,u){const m=1-u;return[m*m*m*p[0]+3*m*m*u*p[2]+3*m*u*u*p[4]+u*u*u*p[6],m*m*m*p[1]+3*m*m*u*p[3]+3*m*u*u*p[5]+u*u*u*p[7]];}
function ag_bzPath(ctx,p,u0,u1,n){n=n||40;ctx.beginPath();for(let k=0;k<=n;k++){const q=ag_bz(p,lerp(u0,u1,k/n));k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}}

/* ===== What an agent is: the room =====
   The white lab made Nordic (the author's choice, 3 November 2026, version 3 of the style prototype, style X): a pale grey marble
   wall with long diagonal veins that wander, thin out and fade, quieter where the film puts its model and its words; a slim white
   skirting; wide planks of white-oiled oak in perspective; daylight from a window up and to the right, the left side and the corners
   in soft shade. Average lightness about 73 of 100, among the site's other films.
   ag_paintLab(ctx, o) paints it on a 1920 x 1080 canvas. It's the place "lab" (AG_PLACES.lab). A film that puts words where the lab's
   veins are strong adds its own variant with quiet zones there, in its own source:
     AG_PLACES.labLeft = c => ag_paintLab(c, {quiet: [[x, y, rx, ry, k], ...]});
   each zone softens the veins by k (0 to 1) in an ellipse of radii rx, ry around (x, y). o.hz moves the line where the wall meets the
   floor (653 by default, a little below the middle); o.seed shifts the marble's pattern, for a second wall that isn't the first.
   The same lab at night (the place "labNight"): o.night darkens the room to a cool blue-grey, the window gives only a faint cold light,
   and a floor lamp at o.lamp ([x, y] where its foot stands; [300, 760] by default, away from the window) throws a warm pool on the wall
   and the floor. Draw what stands in the room, then ag_roomLight(ctx, a, {night: true}) over it so it sits in the same light, then the
   words and cards, which stay at full contrast. */

// value noise and fractal noise, for the marble and the wood; seeded, so every render paints the same room
const AG_NZ=(()=>{const R=ag_rnd(1234),q=[];for(let i=0;i<256;i++)q.push(i);for(let i=255;i>0;i--){const j=(R()*(i+1))|0;const t=q[i];q[i]=q[j];q[j]=t;}
  const pm=new Uint8Array(512);for(let i=0;i<512;i++)pm[i]=q[i&255];const val=new Float32Array(256);for(let i=0;i<256;i++)val[i]=R();
  function n2(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,X=xi&255,Y=yi&255;
    const a=val[pm[X+pm[Y]]],b=val[pm[X+1+pm[Y]]],c=val[pm[X+pm[Y+1]]],d=val[pm[X+1+pm[Y+1]]];
    const u=xf*xf*xf*(xf*(xf*6-15)+10),v=yf*yf*yf*(yf*(yf*6-15)+10);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
  function fbm(x,y,o){let s=0,a=0.5,fr=1,n=0;for(let i=0;i<o;i++){s+=a*n2(x*fr+i*17.3,y*fr+i*9.1);n+=a;a*=0.5;fr*=2.03;}return s/n;}
  return{n2,fbm};})();
const ag_ss=(a,b,x)=>{const u=clamp((x-a)/(b-a),0,1);return u*u*(3-2*u);};
// a separable box blur on a float buffer, in place
function ag_boxBlur(a,w,h,r){const t=new Float32Array(Math.max(w,h)),n=2*r+1;
  for(let y=0;y<h;y++){const o=y*w;let s=0;for(let x=-r;x<=r;x++)s+=a[o+clamp(x,0,w-1)];
    for(let x=0;x<w;x++){t[x]=s/n;s+=a[o+Math.min(w-1,x+r+1)]-a[o+Math.max(0,x-r)];}for(let x=0;x<w;x++)a[o+x]=t[x];}
  for(let x=0;x<w;x++){let s=0;for(let y=-r;y<=r;y++)s+=a[clamp(y,0,h-1)*w+x];
    for(let y=0;y<h;y++){t[y]=s/n;s+=a[Math.min(h-1,y+r+1)*w+x]-a[Math.max(0,y-r)*w+x];}for(let y=0;y<h;y++)a[y*w+x]=t[y];}}

/* the marble: long veins on a diagonal like stripes in the stone, that wander, thin out and fade along their length, with feathered
   side veins and soft clouds; a touch out of focus, as a wall behind the subject is. quiet: the default zones where the lab keeps
   the veins soft, behind the middle of the frame and the kicker at the top left */
const AG_MARBLE={base:[207,205,201],angle:-0.5,seams:[880,1520],
  main:{fu:0.00045,fv:0.0028,core:36,coreA:60,halo:6,haloA:10,drift:2.2,driftA:7,fade:[0.32,0.68]},
  feather:{fu:0.0011,fv:0.0062,p:56,a:30,fade:[0.42,0.78]},cloud:14,warm:0.18,
  quiet:[[1124,476,250,210,0.4],[480,90,420,46,0.3]]};
const AG_ROOM={hz:653,eye:440,vpx:1000,foc:1400,res:0.5};   // where the wall meets the floor, the eye line, the vanishing point, the floor's depth; the marble's resolution
/* paints the marble into ctx from y 0 to hz, computed at res of full size and scaled up: the veins are soft anyway, and a full-size
   marble takes several times as long */
function ag_marble(ctx,hz,o){o=o||{};const M=AG_MARBLE,A=M.main,Fe=M.feather,k=o.res||AG_ROOM.res,w=Math.ceil(W*k),h=Math.ceil((hz+1)*k),N=w*h,
    sx=(o.seed||0)*731,sy=(o.seed||0)*377,quiet=o.quiet||M.quiet;
  const cv=mkCanvas(w,h),c=cv.getContext("2d"),img=c.createImageData(w,h),d=img.data,dk=new Float32Array(N),wm=new Float32Array(N),tn=new Float32Array(N),ca=Math.cos(M.angle),sa=Math.sin(M.angle);
  for(let j0=0;j0<h;j0++)for(let i0=0;i0<w;i0++){const x=i0/k+sx,y=j0/k+sy,X=i0/k,Y=j0/k,j=j0*w+i0,u=x*ca+y*sa,v=-x*sa+y*ca;   // u along the veins, v across
    const mv=AG_NZ.fbm(u*0.0012+3.1,v*0.0018+7.7,3)-0.5,mu=AG_NZ.fbm(u*0.0012+11.4,v*0.0018+2.3,3)-0.5,uu=u+mu*300,vv=v+mv*340;
    const r1=1-Math.abs(2*AG_NZ.fbm(uu*A.fu+5.5,vv*A.fv+1.9,3)-1),s1=ag_ss(A.fade[0],A.fade[1],AG_NZ.fbm(uu*0.0017+40,vv*0.0013+9,3));
    const r2=1-Math.abs(2*AG_NZ.fbm(uu*Fe.fu+21,vv*Fe.fv+4,4)-1),s2=ag_ss(Fe.fade[0],Fe.fade[1],AG_NZ.fbm(uu*0.0024+70,vv*0.0024+30,3));
    let qz=1;for(const z of quiet){const ex=(X-z[0])/z[2],ey=(Y-z[1])/z[3];qz-=z[4]*Math.exp(-(ex*ex+ey*ey));}
    dk[j]=((Math.pow(r1,A.core)*A.coreA+Math.pow(r1,A.halo)*A.haloA+Math.pow(r1,A.drift)*A.driftA*(0.4+0.6*s1))*s1+Math.pow(r2,Fe.p)*Fe.a*s2*(0.5+0.5*s1))*Math.max(0,qz);
    wm[j]=ag_ss(0.55,0.75,AG_NZ.fbm(uu*0.001+90,vv*0.001+50,2));
    tn[j]=(AG_NZ.fbm(X*0.0016+3,Y*0.0022+9,4)-0.5)*M.cloud;}
  if(k>=0.99)for(let b=0;b<2;b++)ag_boxBlur(dk,w,h,1);
  for(let j=0;j<N;j++){const i=j*4,kk=dk[j],q=wm[j]*M.warm,L=tn[j];d[i]=M.base[0]+L-kk*(1-q);d[i+1]=M.base[1]+L-kk*(1-0.22*q);d[i+2]=M.base[2]+L-kk*(1+0.55*q);d[i+3]=255;}
  c.putImageData(img,0,0);ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";ctx.drawImage(cv,0,0,w,h,0,0,w/k,h/k);ctx.restore();
  // the stone's fine grain, at full size, very faint
  ag_grain(ctx,0,0,W,hz+1,1.6,77);
  for(const x of M.seams){ctx.fillStyle="rgba(70,62,54,0.16)";ctx.fillRect(x-1,0,1,hz);ctx.fillStyle="rgba(255,255,255,0.22)";ctx.fillRect(x,0,1,hz);}}
// a faint fine grain over a rectangle, from a small tile of noise (cheap at any size)
function ag_grain(ctx,x,y,w,h,amp,seed){const tile=ag_kept("grain:"+seed+"|"+amp,256,256,(c)=>{const img=c.createImageData(256,256),d=img.data,R=ag_rnd(seed);
    for(let i=0;i<d.length;i+=4){const v=(R()-0.5)*2*amp*3;d[i]=d[i+1]=d[i+2]=v>0?255:0;d[i+3]=Math.min(255,Math.abs(v)*1.1);}c.putImageData(img,0,0);});
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle=ctx.createPattern(tile,"repeat");ctx.globalAlpha=0.5;ctx.fillRect(x,y,w,h);ctx.restore();}

/* wide white-oiled oak planks (about 30 cm), long lengths, hairline joints, the grain running along each board; once per film */
function ag_oakTex(){return ag_kept("oak",990,1500,(c,tw,th)=>{const pw=110,n=9,img=c.createImageData(tw,th),d=img.data,R=ag_rnd(77),O=[192,179,158];
  const tone=[],warm=[],joints=[];for(let k=0;k<n;k++){tone.push((R()-0.5)*9);warm.push((R()-0.5)*5);const js=[];let v=R()*700;while(v<th){js.push(v);v+=560+R()*420;}joints.push(js);}
  for(let y=0;y<th;y++)for(let x=0;x<tw;x++){const k=(x/pw)|0,lx=x-k*pw;let pc=0;for(const jv of joints[k])if(y>jv)pc++;
    const g=AG_NZ.fbm(x*0.05+k*7+pc*3.1,y*0.0026+pc*5.3,4),fig=AG_NZ.fbm(x*0.012+k*3+pc*1.7,y*0.0011+pc*2.9,3),pore=AG_NZ.n2(x*0.7,y*0.02+k*13)-0.5;
    let L=tone[k]+(g-0.5)*13+(fig-0.5)*9+pore*3;
    if(lx<1)L-=15;else if(lx<2.5)L-=4;else if(lx>pw-1.5)L+=3;
    for(const jv of joints[k]){const dj=Math.abs(y-jv);if(dj<1.2)L-=13;else if(dj<2.6)L-=4;}
    const i=(y*tw+x)*4;d[i]=O[0]+L+warm[k];d[i+1]=O[1]+L;d[i+2]=O[2]+L*0.9-warm[k];d[i+3]=255;}
  c.putImageData(img,0,0);});}
/* a floor in perspective from a flat texture: each screen row samples the texture at its depth, averaged over several depths inside
   the row so far boards don't shimmer into moire */
function ag_floor(c,tex,hz,ppu,ppv,n){const R=AG_ROOM,pat=c.createPattern(tex,"repeat");n=n||8;
  for(let y=hz+1;y<H;y++)for(let k=0;k<n;k++){const yy=y+(k+0.5)/n,d=yy-R.eye,z=R.foc/d;
    pat.setTransform(new DOMMatrix([d/ppu,0,0,1,R.vpx,y+0.5-z*ppv]));c.globalAlpha=1/(k+1);c.fillStyle=pat;c.fillRect(0,y,W,1);}
  c.globalAlpha=1;}

/* the lab: marble over oak, the skirting, the window's light and the room's soft shade */
function ag_paintLab(c,o){o=o||{};const hz=o.hz||AG_ROOM.hz;
  ag_marble(c,hz,o);ag_floor(c,ag_oakTex(),hz,600,300);
  // daylight from a window up and to the right; the left side and the corners fall into soft shade
  let g=c.createRadialGradient(1620,-60,40,1560,40,1500);g.addColorStop(0,"rgba(255,252,244,0.34)");g.addColorStop(0.5,"rgba(255,252,244,0.1)");g.addColorStop(1,"rgba(255,252,244,0)");
  c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.16)");g.addColorStop(0.35,"rgba(40,34,28,0.03)");g.addColorStop(1,"rgba(40,34,28,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // where the wall meets the floor: a slim white skirting and a contact shadow
  g=c.createLinearGradient(0,hz-40,0,hz);g.addColorStop(0,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(40,34,28,0.12)");c.fillStyle=g;c.fillRect(0,hz-40,W,40);
  c.fillStyle="rgb(214,211,204)";c.fillRect(0,hz-16,W,16);c.fillStyle="rgba(255,255,255,0.5)";c.fillRect(0,hz-16,W,1.2);
  c.fillStyle="rgba(40,34,28,0.32)";c.fillRect(0,hz,W,1.4);
  g=c.createLinearGradient(0,hz,0,hz+90);g.addColorStop(0,"rgba(40,34,28,0.16)");g.addColorStop(1,"rgba(40,34,28,0)");c.fillStyle=g;c.fillRect(0,hz,W,90);
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgba(255,250,240,0)");g.addColorStop(1,"rgba(40,34,28,0.12)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  // the window's soft sheen on the floor, off to the right
  c.save();c.beginPath();c.rect(0,hz+2,W,H-hz);c.clip();c.translate(1640,800+(hz-653)*0.5);c.scale(1,0.24);g=c.createRadialGradient(0,0,0,0,0,620);
  g.addColorStop(0,"rgba(255,251,242,0.16)");g.addColorStop(1,"rgba(255,251,242,0)");c.fillStyle=g;c.fillRect(-700,-700,1400,1400);c.restore();
  if(o.night){const L=o.lamp||AG_ROOM.lamp;ag_night(c,1,L,hz);ag_lamp(c,L[0],L[1]);}}
AG_ROOM.lamp=[300,760];
AG_PLACES.lab=c=>ag_paintLab(c);
AG_PLACES.labNight=c=>ag_paintLab(c,{night:true});
// the same room's light on anything drawn in it: the window's warmth on the right, the soft shade on the left (over a whole frame);
// o.night: the night's light instead (o.lamp where the lamp stands, as the place has it)
function ag_roomLight(ctx,a,o){a=a==null?1:a;if(a<=0)return;o=o||{};if(o.night)return ag_night(ctx,a,o.lamp||AG_ROOM.lamp,null,true);
  ctx.save();let g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,"+(0.1*a)+")");g.addColorStop(0.4,"rgba(40,34,28,0)");
  g.addColorStop(1,"rgba(255,250,240,"+(0.06*a)+")");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();}
/* night over a frame: everything darker and cooler, then the lamp's warm light where it reaches (on the wall above its shade, on the
   floor around its foot); things (people, the agent) get a lighter touch of it than the room, so they stand out a little */
function ag_night(c,a,lamp,hz,things){const lx=lamp[0],ly=lamp[1],top=ly-430,k=things?0.55:1;c.save();
  c.globalCompositeOperation="multiply";c.fillStyle=rgba(mix([255,255,255],[84,88,106],a*k),1);c.fillRect(0,0,W,H);
  c.globalCompositeOperation="source-over";
  let g=c.createLinearGradient(W,0,W*0.55,0);g.addColorStop(0,"rgba(150,170,220,"+(0.07*a)+")");g.addColorStop(1,"rgba(150,170,220,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.globalCompositeOperation="screen";
  g=c.createRadialGradient(lx,top+20,10,lx,top+60,820);g.addColorStop(0,"rgba(255,200,140,"+(0.5*a*k)+")");g.addColorStop(0.3,"rgba(255,186,124,"+(0.2*a*k)+")");g.addColorStop(1,"rgba(255,186,124,0)");
  c.fillStyle=g;c.fillRect(0,0,W,H);
  if(hz!=null){c.save();c.beginPath();c.rect(0,hz,W,H-hz);c.clip();c.translate(lx+40,ly+10);c.scale(1,0.3);g=c.createRadialGradient(0,0,0,0,0,640);
    g.addColorStop(0,"rgba(255,200,140,"+(0.3*a)+")");g.addColorStop(1,"rgba(255,200,140,0)");c.fillStyle=g;c.fillRect(-700,-700,1400,1400);c.restore();}
  c.restore();}
/* a slim floor lamp: a graphite stem on a round foot at (x, y), a linen shade lit from within, glowing a little into the dark */
function ag_lamp(c,x,y){const top=y-430;c.save();
  c.fillStyle="#1F2024";c.beginPath();c.ellipse(x,y,44,10,0,0,TAU);c.fill();c.fillRect(x-4,top+60,8,y-top-60);
  c.save();c.shadowColor="rgba(255,196,120,0.75)";c.shadowBlur=40;const g=c.createLinearGradient(0,top-30,0,top+70);g.addColorStop(0,"#FFF1D8");g.addColorStop(1,"#F2CF96");c.fillStyle=g;
  c.beginPath();c.moveTo(x-46,top-30);c.lineTo(x+46,top-30);c.lineTo(x+70,top+70);c.lineTo(x-70,top+70);c.closePath();c.fill();c.restore();
  c.fillStyle="rgba(255,236,200,0.9)";c.beginPath();c.ellipse(x,top+70,70,7,0,0,TAU);c.fill();c.restore();}

/* ---------------------------------------------------------------- things in the room
   ag_desk(ctx, x, y, w, o): a pale oak desk, its front edge's top at (x, y), w wide, its top receding o.depth (70) up the frame; o.a.
   ag_screen(ctx, x, y, w, h, o): a matte graphite screen, its glass from (x, y), w by h; o.draw(ctx, x, y, w, h) draws what it shows,
   clipped to the glass (pale by default); o.stand puts it on a stand whose foot rests o.stand px below the glass.
   ag_picture(ctx, x, y, w, h, o): a framed picture hung on the wall, its picture from (x, y), w by h, in a white mat and a thin oak
   frame (o.frame "graphite" for a dark one), with a soft shadow on the marble; o.draw(ctx, x, y, w, h) draws the picture, clipped,
   or o.img (a canvas or a place, such as ag_place("printshop")) fills it, cropped to its middle; o.a. A scene from the opening can
   come back to the lab this way.
   ag_sandbox(ctx, x, y, w, o): a shallow oak tray on the floor, where an agent's drafts go, its front edge's middle at (x, y), w wide,
   o.depth (70) up the frame; o.label (default "Sandbox · drafts only", on a tag 60 px under the front edge, so keep y at most 800 or
   pass null for none); o.a. Returns the tray's inside {x, y, w, h}, to put drafts in.
   ag_glass(ctx, x, y, w, h, o): a pane of glass standing on the floor, its top left at (x, y): what's behind it (production) is drawn
   first; o.label (default "Read only", on a tag with a lock at its top; null for none); o.a. */
function ag_desk(ctx,x,y,w,o){o=o||{};const d=o.depth||70,th=o.th||22,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2+AG.sdx*3,y+th+90,w*0.55,40,0.18);
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,rgba(mix(AG_OAK.base,[255,255,255],0.25),1));g.addColorStop(1,rgba(AG_OAK.base,1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+d*0.35,y-d);ctx.lineTo(x+w-d*0.35,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(AG_OAK.hi,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();
  g=ctx.createLinearGradient(0,y,0,y+th);g.addColorStop(0,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;ctx.fillRect(x,y,w,th);
  ctx.fillStyle=rgba(AG.shadow,0.12);ctx.fillRect(x,y+th,w,6);ctx.restore();}
function ag_screen(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,b=Math.max(10,w*0.03);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  if(o.stand){const sx=x+w/2,sy=y+h+b;ctx.fillStyle="#3A3B40";ctx.fillRect(sx-14,sy-4,28,o.stand-8);ag_floorShadow(ctx,sx+AG.sdx,sy+o.stand,w*0.22,10,0.25);
    ctx.fillStyle="#2F3035";ctx.beginPath();ctx.ellipse(sx,sy+o.stand-4,w*0.16,9,0,0,TAU);ctx.fill();}
  ctx.save();ctx.shadowColor=AG.card.shadow;ctx.shadowBlur=30;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=14;ctx.fillStyle="#2E2F34";rr(ctx,x-b,y-b,w+2*b,h+2*b,b*0.9);ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,4);ctx.clip();ctx.fillStyle=o.bg||"#EEF0EE";ctx.fillRect(x,y,w,h);if(o.draw)o.draw(ctx,x,y,w,h);
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.12)");g.addColorStop(0.5,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.restore();}
function ag_picture(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const m=Math.max(18,Math.min(w,h)*0.08),f=Math.max(8,Math.min(w,h)*0.028),
    X=x-m-f,Y=y-m-f,Wd=w+2*(m+f),Hd=h+2*(m+f),dark=o.frame==="graphite";ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.28)";ctx.shadowBlur=28;ctx.shadowOffsetX=AG.sdx*1.4;ctx.shadowOffsetY=16;ctx.fillStyle=dark?"#2E2F34":rgba(AG_OAK.base,1);ctx.fillRect(X,Y,Wd,Hd);ctx.restore();
  let g=ctx.createLinearGradient(X,Y,X+Wd,Y+Hd);g.addColorStop(0,dark?"#4A4B52":rgba(AG_OAK.hi,1));g.addColorStop(1,dark?"#26272B":rgba(AG_OAK.dark,1));ctx.fillStyle=g;ctx.fillRect(X,Y,Wd,Hd);
  ctx.fillStyle="#F4F2EE";ctx.fillRect(X+f,Y+f,Wd-2*f,Hd-2*f);
  ctx.strokeStyle="rgba(46,38,28,0.18)";ctx.lineWidth=2;ctx.strokeRect(x-1,y-1,w+2,h+2);
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle="#E9E6E0";ctx.fillRect(x,y,w,h);
  if(o.img){const iw=o.img.width,ih=o.img.height,k=Math.max(w/iw,h/ih);ctx.drawImage(o.img,x+(w-iw*k)/2,y+(h-ih*k)/2,iw*k,ih*k);}
  if(o.draw)o.draw(ctx,x,y,w,h);
  g=ctx.createLinearGradient(x,y,x,y+h*0.25);g.addColorStop(0,"rgba(46,38,28,0.16)");g.addColorStop(1,"rgba(46,38,28,0)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.fillStyle="rgba(255,255,255,0.35)";ctx.fillRect(X,Y,Wd,1.5);ctx.restore();}
function ag_sandbox(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,d=o.depth||70,th=16,x0=x-w/2,x1=x+w/2,ins=d*0.35;if(a<=0)return null;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx*2,y+th+8,w*0.56,22,0.22);
  // the rim, seen from above: the outer edge, then the tray's floor a little lower and darker
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,rgba(mix(AG_OAK.base,[255,255,255],0.22),1));g.addColorStop(1,rgba(AG_OAK.base,1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x0+ins,y-d);ctx.lineTo(x1-ins,y-d);ctx.lineTo(x1,y);ctx.lineTo(x0,y);ctx.closePath();ctx.fill();
  const r=12,ix0=x0+ins*0.86+r,ix1=x1-ins*0.86-r,iy0=y-d+r*0.6,iy1=y-r*0.9,k=ins/d;
  g=ctx.createLinearGradient(0,iy0,0,iy1);g.addColorStop(0,rgba(AG_OAK.dark,0.55));g.addColorStop(0.3,rgba(mix(AG_OAK.base,AG_OAK.dark,0.35),1));g.addColorStop(1,rgba(AG_OAK.base,1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(ix0+(iy1-iy0)*k*0.1,iy0);ctx.lineTo(ix1-(iy1-iy0)*k*0.1,iy0);ctx.lineTo(ix1+r*0.4,iy1);ctx.lineTo(ix0-r*0.4,iy1);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(AG_OAK.hi,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
  // the front face
  g=ctx.createLinearGradient(0,y,0,y+th);g.addColorStop(0,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;ctx.fillRect(x0,y,w,th);
  ctx.restore();
  const lab=o.label===undefined?"Sandbox · drafts only":o.label;if(lab)ag_pill(ctx,x,y+th+44,lab,{icon:"draft",col:AG.blue,a});
  return{x:ix0,y:iy0,w:ix1-ix0,h:iy1-iy0};}
function ag_glass(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2+AG.sdx*2,y+h+6,w*0.52,14,0.16);
  let g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(232,242,248,0.34)");g.addColorStop(0.5,"rgba(214,228,238,0.22)");g.addColorStop(1,"rgba(232,242,248,0.3)");
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  // two soft streaks of the window's light across the pane, and its thin edges
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle="rgba(255,255,255,0.22)";
  for(const [u,s] of [[0.22,0.09],[0.4,0.035]]){ctx.beginPath();ctx.moveTo(x+w*u,y);ctx.lineTo(x+w*(u+s),y);ctx.lineTo(x+w*(u+s)-h*0.45,y+h);ctx.lineTo(x+w*u-h*0.45,y+h);ctx.closePath();ctx.fill();}
  ctx.restore();ctx.strokeStyle="rgba(120,140,156,0.55)";ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(x+2,y+h-2);ctx.lineTo(x+2,y+2);ctx.lineTo(x+w-2,y+2);ctx.stroke();
  // its foot: a slim graphite rail on the floor
  ctx.fillStyle="#3A3B40";ctx.fillRect(x-6,y+h-4,w+12,10);ctx.restore();
  const lab=o.label===undefined?"Read only":o.label;if(lab){const pw=ag_tw(ctx,lab,{w:700,size:30})+96;ag_pill(ctx,x+w-pw/2-18,y+44,lab,{icon:"lock",col:AG.blue,a});}}

/* ===== What an agent is: the people =====
   Half-figures, seen from the waist or the chest up, in three-quarter view, matte and softly lit from the window on the right, with
   an adult's proportions (the author, 3 November 2026: "Keep the bodies with good proportions"):
     - the head 225 px from crown to chin at s = 1; the eyes halfway down it; hairline, brows, the tip of the nose and the chin split
       the face into thirds; the ear runs from the brow to the nose;
     - short hair that follows the skull, never a tall quiff or an oversized head;
     - a real jaw over a neck about half as wide as the head is tall, ending inside the collar;
     - the shoulders a third of a head below the chin, and with the arms about two heads across;
     - a chest that narrows to the waist, arms that hang from the shoulders, soft folds, and a soft shadow where the arm meets the body.
   The shapes are drawn once in figure space (the style prototype's Jun, x 40 to 500, y 270 to 1100, the head from y 300 to 526,
   facing right, his right shoulder nearer us) and painted once per person into kept pictures; the eyes, the mouth and any arm that
   moves are drawn live.

   ag_person(ctx, who, x, y, s, o) draws a person: who is a name in AG_CAST or a spec like those below; (x, y) is where the neck
   meets the shoulders, s the size (1: a head 225 px tall); o:
     t       the chapter's time, for breathing and blinking (each person breathes at their own pace)
     flip    true to face left (people face right by default)
     pose    "hang" (arms down, the default), "hold" (the near hand in front of the chest, holding o.hold), or {near: [upper arm,
             forearm, hand], far: ...} for a hand on a wheel, a switch or a dial, angles in degrees from straight down, positive towards
             the way the person faces; pose2 and mix blend into a second pose. No gestures: any other name stops a render or a check
     hold    (ctx, hands) => draws what the near hand holds, in figure space, over the near hand (holdBack: under it); hands.near and
             hands.far are the wrists (far is null while the far arm hangs), hands.nearElbow the near elbow
     front   the same as hold, but drawn over the head as well: a thing held up before the face, such as a card hiding the mouth
     nod     a nod, in radians (the head turns about the top of the neck); gaze [dx, dy] moves the eyes a little; blink 0 to 1
     talk    0 to 1, the mouth opens; smile 0 to 1
     cut     a height in the frame: the body is hidden below it (draw a desk first and cut at its back edge: the desk hides the
             hanging arms)
     covered true when something drawn over the person hides their waist. People end flat under the waist (figure y 1100, 504 s
             below the neck), so keep y + 504 s at least 1080 or cover it: a render or a check stops with an error where it shows
   People of other times: who.top.kind can be "robe" (a crossed collar), "tunic" or "apron" (over a shirt), and who.hat.paint(c, P)
   or who.top.paint(c, P) paints anything else in figure space, over the body or the head. who.hair.style: "side", "cropped",
   "coily", "bob", "bun", "long", "shaved". */

/* ---------------------------------------------------------------- figure space: the prototype's Jun, an adult's proportions */
const AG_F={
  // the head turned three-quarters to the right: the far side's outline runs from the forehead past the far brow and cheekbone, round the
  // tip of the nose (the only feature that passes the cheek) and down the cheek to the chin; the jaw runs back from the chin to below the
  // ear, which sits well behind the near eye. The eyes, the nose, the mouth and the ear inside it are drawn at the same turn (AG_FACE)
  head(c){c.moveTo(300,300);c.bezierCurveTo(340,298,372,318,382,350);c.bezierCurveTo(387,366,390,382,390,396);
    c.bezierCurveTo(390,404,387,410,386,415);c.bezierCurveTo(386,424,390,432,391,440);c.bezierCurveTo(394,446,397,451,397,455);
    c.bezierCurveTo(397,460,393,463,388,464);c.bezierCurveTo(386,470,386,478,385,486);c.bezierCurveTo(384,498,381,508,377,516);
    c.bezierCurveTo(373,526,364,531,352,531);c.bezierCurveTo(330,531,302,520,284,506);c.bezierCurveTo(274,498,268,492,264,484);
    c.bezierCurveTo(258,474,248,464,236,458);c.bezierCurveTo(220,448,208,420,208,388);c.bezierCurveTo(208,352,226,320,256,306);
    c.bezierCurveTo(270,301,284,300,300,300);c.closePath();},
  ear(c){c.moveTo(266,404);c.bezierCurveTo(254,393,241,396,238,412);c.bezierCurveTo(235,428,239,446,247,456);c.bezierCurveTo(254,463,263,462,266,452);c.bezierCurveTo(269,438,269,420,266,404);c.closePath();},
  earIn(c){c.moveTo(259,414);c.bezierCurveTo(249,410,245,422,247,434);c.bezierCurveTo(249,444,254,448,260,444);},
  // the neck: its top tucked up under the skull with a rounded nape, so a head that nods never shows the neck's top edge
  neck(c){c.moveTo(286,430);c.bezierCurveTo(258,432,236,446,233,468);c.bezierCurveTo(235,500,236,530,234,566);c.bezierCurveTo(254,602,308,620,358,607);c.bezierCurveTo(350,580,343,552,336,524);c.lineTo(300,470);c.closePath();},
  torso(c){c.moveTo(232,562);c.bezierCurveTo(200,572,166,584,140,598);c.bezierCurveTo(104,616,88,650,92,700);c.lineTo(120,1100);c.lineTo(414,1100);
    c.bezierCurveTo(412,1010,414,940,418,870);c.bezierCurveTo(422,800,430,740,430,700);c.bezierCurveTo(430,668,420,642,404,628);
    c.bezierCurveTo(392,618,378,608,362,603);c.closePath();},
  farArm(c){c.moveTo(372,606);c.bezierCurveTo(404,612,434,626,450,652);c.bezierCurveTo(466,678,472,724,472,780);c.bezierCurveTo(472,850,468,920,464,960);
    c.bezierCurveTo(460,1000,456,1050,452,1100);c.lineTo(404,1100);c.lineTo(404,640);c.closePath();},
  arm(c){c.moveTo(152,600);c.bezierCurveTo(116,604,84,626,72,664);c.bezierCurveTo(64,700,64,770,70,830);c.bezierCurveTo(74,876,80,910,90,936);
    c.bezierCurveTo(108,980,138,1036,170,1100);c.lineTo(274,1100);c.bezierCurveTo(250,1046,224,1004,208,966);c.bezierCurveTo(196,936,190,890,188,830);
    c.bezierCurveTo(186,780,190,730,196,700);c.bezierCurveTo(198,664,186,624,168,606);c.closePath();},
  collar(c){c.moveTo(232,560);c.bezierCurveTo(252,596,308,614,360,601);c.lineTo(364,615);c.bezierCurveTo(306,630,244,614,222,576);c.closePath();},
  // the torso without its near shoulder: where a raised near arm leaves the side of the body
  side(c){c.moveTo(150,640);c.bezierCurveTo(120,660,104,690,104,730);c.lineTo(124,1100);c.lineTo(200,1100);c.lineTo(200,640);c.closePath();}
};
const AG_FIG={anchor:[296,596],box:[30,262,500,1108],piv:[282,480],res:1.5,
  shoulder:{near:[134,660],far:[428,660]},L1:282,L2:262,w:[122,96,74]};   // arm joints, the upper arm's and forearm's lengths, widths at shoulder, elbow, wrist
// the face, turned three-quarters like the head (AG_F.head), in figure space: the near eye, wide, and the far eye, narrower and close to
// the far cheek (x, y, half-width, half-height); the mouth's near corner, middle and far corner, the middle off to the far side as the
// face turns; the ear's middle and the lobe. Films that draw near the face (a sound leaving the mouth, a coil behind the ear) take
// their places from here
const AG_FACE={eyeN:[334,418,4.8,5.6],eyeF:[377,417,3.1,5],mouth:[[350,483],[367,487],[380,481]],mid:[367,484],ear:[252,430],lobe:[253,470]};
// hair, the shapes; each adds its path, the caller fills
const AG_HAIR={
  side(c){c.moveTo(391,352);c.bezierCurveTo(395,326,382,300,352,290);c.bezierCurveTo(320,280,270,282,244,298);
    c.bezierCurveTo(216,314,203,346,204,382);c.bezierCurveTo(205,414,210,440,218,456);c.bezierCurveTo(224,464,234,464,240,456);
    c.bezierCurveTo(244,444,244,428,247,412);c.bezierCurveTo(252,398,266,394,274,404);c.lineTo(276,429);c.lineTo(283,429);
    c.bezierCurveTo(283,404,290,384,302,368);c.bezierCurveTo(327,350,352,342,372,342);c.bezierCurveTo(381,342,387,346,391,352);c.closePath();},
  cropped(c){c.moveTo(386,350);c.bezierCurveTo(386,326,372,304,346,296);c.bezierCurveTo(316,288,272,290,248,304);
    c.bezierCurveTo(222,320,210,350,211,384);c.bezierCurveTo(212,414,216,438,222,452);c.bezierCurveTo(228,460,236,460,240,452);
    c.bezierCurveTo(244,440,244,426,247,414);c.bezierCurveTo(252,402,264,398,272,406);c.lineTo(275,426);c.lineTo(281,426);
    c.bezierCurveTo(281,404,290,386,302,372);c.bezierCurveTo(326,356,352,350,372,350);c.bezierCurveTo(379,350,383,350,386,350);c.closePath();},
  coily(c){const pts=[[388,352],[392,326],[378,302],[356,290],[328,282],[296,280],[266,284],[240,296],[220,316],[208,342],[203,372],[206,402],[214,430],[226,452]];
    c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,nx=-(b[1]-a[1]),ny=b[0]-a[0],l=Math.hypot(nx,ny)||1;
      c.quadraticCurveTo(mx-nx/l*7,my-ny/l*7,b[0],b[1]);}
    c.bezierCurveTo(230,462,238,462,242,452);c.bezierCurveTo(246,440,244,426,247,414);c.bezierCurveTo(252,400,264,396,272,404);c.lineTo(276,428);c.lineTo(283,428);
    c.bezierCurveTo(283,404,292,384,304,370);c.bezierCurveTo(328,354,354,348,374,349);c.closePath();},
  bob(c){c.moveTo(392,354);c.bezierCurveTo(396,326,382,298,350,288);c.bezierCurveTo(316,278,266,282,240,298);
    c.bezierCurveTo(210,318,198,352,200,392);c.bezierCurveTo(202,438,214,478,232,506);c.bezierCurveTo(250,528,286,532,310,518);
    c.bezierCurveTo(300,500,294,470,296,440);c.bezierCurveTo(298,404,306,378,320,362);c.bezierCurveTo(336,348,358,346,378,348);c.bezierCurveTo(385,349,389,351,392,354);c.closePath();},
  bun(c){AG_HAIR.cropped(c);},
  knot(c){c.arc(222,318,38,0,TAU);},
  long(c){AG_HAIR.bob(c);},
  longBack(c){c.moveTo(212,350);c.bezierCurveTo(192,420,190,500,196,560);c.bezierCurveTo(200,600,190,640,172,676);c.bezierCurveTo(220,700,286,690,330,652);
    c.bezierCurveTo(320,600,300,540,290,500);c.lineTo(250,420);c.closePath();},
  shaved(c){}
};
const AG_STRANDS={side:[[[262,301],[312,286],[374,306]],[[250,318],[306,302],[386,332]],[[300,296],[352,300],[390,340]],[[226,352],[214,396],[232,448]],[[296,372],[278,352],[244,344]]],
  cropped:[[[260,306],[310,294],[370,310]],[[230,350],[220,396],[236,442]]],
  coily:[],bob:[[[262,300],[312,286],[376,310]],[[236,330],[214,400],[236,490]],[[300,300],[350,302],[388,344]],[[300,380],[296,440],[300,506]]],
  bun:[[[260,306],[310,294],[370,310]],[[236,340],[226,390],[236,440]]],long:null,shaved:[]};
AG_STRANDS.long=AG_STRANDS.bob;
// folds in the clothes: the chest by the near arm, across the front, the far side; and the near elbow
const AG_FOLDS=[[[200,708],[222,722],[238,752]],[[250,884],[290,872],[332,886]],[[316,980],[350,970],[386,982]]],AG_ARMFOLDS=[[[164,950],[186,960],[206,972]]];

/* ---------------------------------------------------------------- the cast: the university's data team and the people it works with
   As in the governance films (same names, skin, hair, glasses), redrawn in this module's look; clothes keep clear of the colours
   that mean something here (a strong blue, violet, orange, green or amber), so a sweater never reads as a check that passed. */
const AG_CAST={
  jun:  {name:"Jun Park",role:"Analytics engineer",skin:[226,186,150],hair:{style:"side",c:[24,22,26]},glasses:[40,44,54],top:{kind:"sweater",c:[62,120,112]},breath:0.29},
  yusuf:{name:"Yusuf Demir",role:"Data governance lead",skin:[204,160,124],hair:{style:"side",c:[38,30,28]},beard:[44,34,30],top:{kind:"blazer",c:[150,92,72],inner:[236,232,222]},breath:0.25},
  mei:  {name:"Mei Tanaka",role:"Registrar's office",skin:[232,194,164],hair:{style:"bun",c:[26,24,30]},earrings:[226,196,140],top:{kind:"cardigan",c:[116,134,118],inner:[236,236,230]},breath:0.31},
  noor: {name:"Noor Rahman",role:"Data architect",skin:[176,124,92],hair:{style:"long",c:[24,20,22]},earrings:[208,214,226],top:{kind:"blazer",c:[66,86,100],inner:[226,232,240]},breath:0.27},
  sam:  {name:"Sam Okafor",role:"Data platform",skin:[112,72,50],hair:{style:"coily",c:[30,24,22]},glasses:[28,30,38],top:{kind:"overshirt",c:[78,98,110],inner:[212,220,232]},lanyard:true,breath:0.24},
  anil: {name:"Anil Kurian",role:"Faculty of Health",skin:[156,106,78],hair:{style:"cropped",c:[30,26,26]},top:{kind:"cardigan",c:[124,84,98],inner:[232,234,238]},breath:0.28},
  clara:{name:"Clara Jensen",role:"Planning",skin:[238,204,180],hair:{style:"bob",c:[150,108,66],streak:[200,164,116]},earrings:[226,196,140],top:{kind:"sweater",c:[196,168,128]},breath:0.3},
  david:{name:"Prof. David Mensah",role:"Deputy Vice-Chancellor",skin:[78,50,36],hair:{style:"cropped",c:[190,190,192]},beard:[196,196,198],top:{kind:"suit",c:[46,54,74],inner:[234,238,244],tie:[96,62,70]},breath:0.23}
};

/* ---------------------------------------------------------------- painting a person once */
const AG_PEOPLE={};   // kept pictures, by person
const ag_dk=(c,k)=>mix(c,[0,0,0],k),ag_lt=(c,k)=>mix(c,[255,255,255],k);
function ag_spec(who){return typeof who==="string"?AG_CAST[who]:who;}
function ag_colours(P){const sk=P.skin,sw=P.top.c;return{
  skinBase:mix(sk,ag_dk(sk,0.35),0.3),skinHi:mix(sk,[255,240,228],0.42),skinShade:rgba(mix(sk,[40,14,6],0.62),0.42),skin:sk,
  topBase:ag_dk(sw,0.08),topHi:ag_lt(sw,0.4),topShade:rgba(ag_dk(sw,0.75),0.4),top:sw,
  hair:P.hair.c,hairHi:mix(P.hair.c,[150,156,180],0.45),
  brow:rgba(ag_dk(P.hair.c.map((v,i)=>Math.min(v,P.skin[i])),0.3),0.95),lid:rgba(mix(sk,[30,14,10],0.65),0.6),line:rgba(mix(sk,[70,24,14],0.55),0.85),
  lip:rgba(mix(sk,[150,60,60],0.5),0.9)};}
// one picture of figure space at the person's resolution: paint(c) draws in figure space
function ag_layer(paint,box){const R=AG_FIG.res,b=box||AG_FIG.box,cv=mkCanvas(Math.ceil((b[2]-b[0])*R),Math.ceil((b[3]-b[1])*R)),c=cv.getContext("2d");
  c.scale(R,R);c.translate(-b[0],-b[1]);paint(c);return{cv,box:b};}
function ag_drawLayer(ctx,L){const b=L.box;ctx.drawImage(L.cv,b[0],b[1],b[2]-b[0],b[3]-b[1]);}
// the clothes' details: openings, collars, lapels, buttons, a lanyard, and the clothes of other times
function ag_neckline(c,P,C){const k=P.top.kind,inner=P.top.inner||[236,234,228];
  const V=(bot,wide)=>{c.moveTo(236,566);c.bezierCurveTo(262,640,292,740,bot[0],bot[1]);c.bezierCurveTo(336,740,350,660,358+wide,606);c.bezierCurveTo(320,622,268,612,236,566);c.closePath();};
  if(k==="sweater"){ag_soft(c,AG_F.collar,ag_lt(P.top.c,0.14),ag_lt(P.top.c,0.3),330,600,80,rgba(ag_dk(P.top.c,0.7),0.35),8);return;}
  if(k==="cardigan"||k==="blazer"||k==="suit"||k==="overshirt"){const bot=k==="cardigan"?[318,846]:k==="overshirt"?[312,1100]:[326,880];
    // the shirt or tee inside the opening, its own neckline, then the opening's edges
    c.save();ag_shape(c,AG_F.torso);c.clip();ag_soft(c,cc=>V(bot,0),inner,ag_lt(inner,0.5),330,690,160,rgba(ag_dk(inner,0.6),0.3),14);
    if(k==="blazer"||k==="suit"){ag_soft(c,cc=>{cc.moveTo(238,566);cc.lineTo(270,650);cc.lineTo(298,612);cc.closePath();cc.moveTo(356,604);cc.lineTo(344,654);cc.lineTo(320,614);cc.closePath();},
        ag_lt(inner,0.2),[255,255,255],300,600,80,rgba(ag_dk(inner,0.6),0.35),6);
      if(P.top.tie){ag_soft(c,cc=>{cc.moveTo(302,616);cc.lineTo(322,614);cc.lineTo(330,640);cc.lineTo(338,800);cc.lineTo(318,834);cc.lineTo(302,800);cc.lineTo(306,642);cc.closePath();},P.top.tie,ag_lt(P.top.tie,0.3),326,680,90,rgba(ag_dk(P.top.tie,0.7),0.4),8);}
      // the lapels: a soft fold back on each side of the opening, the near one wider
      const lap=(cc)=>{cc.moveTo(236,566);cc.bezierCurveTo(250,610,262,650,266,690);cc.lineTo(236,700);cc.bezierCurveTo(258,760,286,820,326,880);cc.bezierCurveTo(288,760,262,660,236,566);cc.closePath();
        cc.moveTo(358,606);cc.bezierCurveTo(356,640,352,664,350,690);cc.lineTo(372,700);cc.bezierCurveTo(362,780,346,840,326,880);cc.bezierCurveTo(342,780,352,690,358,606);cc.closePath();};
      ag_soft(c,lap,ag_lt(P.top.c,0.06),ag_lt(P.top.c,0.3),340,700,140,rgba(ag_dk(P.top.c,0.7),0.4),8);}
    else{ag_soft(c,cc=>{cc.moveTo(250,580);cc.bezierCurveTo(280,604,326,612,352,604);cc.lineTo(354,614);cc.bezierCurveTo(320,626,272,620,246,592);cc.closePath();},ag_dk(inner,0.06),ag_lt(inner,0.4),320,600,60,null);
      c.strokeStyle=rgba(ag_dk(P.top.c,0.35),0.6);c.lineWidth=3;c.beginPath();V(bot,0);c.stroke();
      if(k==="cardigan"){for(const u of [0.42,0.62,0.82]){const y=lerp(640,846,u),x=lerp(270,318,u)+4;c.fillStyle=rgba(ag_lt(P.top.c,0.3),1);c.beginPath();c.arc(x+20,y,5.5,0,TAU);c.fill();c.strokeStyle=rgba(ag_dk(P.top.c,0.5),0.6);c.lineWidth=1.4;c.stroke();}}}
    c.restore();return;}
  if(k==="shirt"){c.save();ag_shape(c,AG_F.torso);c.clip();c.strokeStyle=rgba(ag_dk(P.top.c,0.3),0.5);c.lineWidth=2.4;c.beginPath();c.moveTo(316,616);c.bezierCurveTo(318,760,322,900,326,1100);c.stroke();
    for(const y of [700,800,900,1000]){c.fillStyle=rgba(ag_lt(P.top.c,0.5),1);c.beginPath();c.arc(320+(y-616)/484*8,y,4.5,0,TAU);c.fill();}c.restore();
    ag_soft(c,cc=>{cc.moveTo(236,562);cc.lineTo(276,644);cc.lineTo(304,612);cc.bezierCurveTo(280,606,252,590,236,562);cc.closePath();cc.moveTo(358,602);cc.lineTo(344,656);cc.lineTo(318,614);cc.bezierCurveTo(334,612,348,608,358,602);cc.closePath();},
      ag_lt(P.top.c,0.1),ag_lt(P.top.c,0.45),300,600,80,rgba(ag_dk(P.top.c,0.6),0.35),6);return;}
  if(k==="robe"){const band=P.top.band||ag_dk(P.top.c,0.35),inner2=P.top.inner||[232,226,212];
    c.save();ag_shape(c,AG_F.torso);c.clip();
    // the crossed collar: the inner robe's edge at the neck, then the outer's wide band from the far side of the neck down under the near arm
    ag_soft(c,cc=>{cc.moveTo(236,566);cc.bezierCurveTo(270,600,320,616,358,604);cc.lineTo(350,640);cc.bezierCurveTo(300,650,262,628,236,598);cc.closePath();},inner2,ag_lt(inner2,0.5),320,610,70,null);
    ag_soft(c,cc=>{cc.moveTo(362,600);cc.bezierCurveTo(330,690,240,800,120,880);cc.lineTo(120,940);cc.bezierCurveTo(250,850,350,740,396,624);cc.closePath();},band,ag_lt(band,0.3),330,700,160,rgba(ag_dk(band,0.7),0.4),8);
    c.restore();return;}
  if(k==="tunic"){ag_soft(c,AG_F.collar,ag_dk(P.top.c,0.1),ag_lt(P.top.c,0.25),330,600,80,rgba(ag_dk(P.top.c,0.7),0.35),8);
    c.strokeStyle=rgba(ag_dk(P.top.c,0.45),0.7);c.lineWidth=2.6;c.beginPath();c.moveTo(304,620);c.lineTo(308,690);c.stroke();
    if(P.top.belt){c.save();ag_shape(c,AG_F.torso);c.clip();ag_soft(c,cc=>{cc.rect(80,986,360,34);},P.top.belt,ag_lt(P.top.belt,0.3),330,996,120,null);c.restore();}return;}
  if(k==="apron"){const ap=P.top.apron||[150,120,90];ag_soft(c,AG_F.collar,ag_dk(P.top.c,0.06),ag_lt(P.top.c,0.3),330,600,80,rgba(ag_dk(P.top.c,0.6),0.3),8);
    c.save();ag_shape(c,AG_F.torso);c.clip();
    c.strokeStyle=rgba(ag_dk(ap,0.15),1);c.lineWidth=12;c.lineCap="round";c.beginPath();c.moveTo(246,590);c.bezierCurveTo(254,640,262,690,270,724);c.moveTo(356,612);c.bezierCurveTo(360,650,364,690,366,724);c.stroke();
    ag_soft(c,cc=>{cc.moveTo(256,720);cc.lineTo(380,716);cc.bezierCurveTo(386,820,392,940,404,1100);cc.lineTo(196,1100);cc.bezierCurveTo(216,960,240,840,256,720);cc.closePath();},ap,ag_lt(ap,0.3),350,800,240,rgba(ag_dk(ap,0.7),0.4),16);
    c.restore();return;}}
function ag_lanyard(c){c.save();ag_shape(c,AG_F.torso);c.clip();c.strokeStyle=rgba(AG.blue,0.85);c.lineWidth=7;c.lineCap="round";
  c.beginPath();c.moveTo(246,586);c.bezierCurveTo(262,680,290,760,304,806);c.moveTo(352,612);c.bezierCurveTo(342,690,326,760,314,806);c.stroke();
  ag_soft(c,cc=>ag_rect(cc,280,800,56,74,7),[244,243,240],[255,255,255],300,810,60,"rgba(46,38,28,0.3)",6);c.fillStyle=rgba(AG.blue,0.85);c.fillRect(286,808,44,10);c.restore();}
// the ear, in three-quarter view: its outer rim and the fold inside
function ag_ear(c,P,C){ag_soft(c,AG_F.ear,mix(P.skin,ag_dk(P.skin,0.4),0.2),P.skin,246,424,30,C.skinShade,10);c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.5),0.6);c.lineWidth=2;ag_shape(c,AG_F.earIn);c.stroke();}
// the head: skin, hair, the ear, then the face's fixed lines; eyes and mouth come live
function ag_paintHead(c,P,C){const st=P.hair.style;
  ag_soft(c,AG_F.head,C.skinBase,C.skinHi,362,400,170,C.skinShade,26);
  c.save();ag_shape(c,AG_F.head);c.clip();let g=c.createRadialGradient(340,458,0,340,458,30);g.addColorStop(0,rgba(mix(P.skin,[230,110,100],0.5),0.24));g.addColorStop(1,rgba([230,120,110],0));
  c.fillStyle=g;c.fillRect(296,416,100,90);
  // the near side of the nose, turned a little from the light: a soft shade, none between the eyes and deepest at the nostril, and a
  // fainter one under the tip, on the lip. It gives the nose its depth without a line on it
  const ns=mix(P.skin,[90,40,30],0.55),ng=c.createLinearGradient(368,428,380,462);ng.addColorStop(0,rgba(ns,0));ng.addColorStop(0.55,rgba(ns,0.12));ng.addColorStop(1,rgba(ns,0.2));
  c.filter="blur(4px)";c.fillStyle=ng;c.beginPath();c.moveTo(368,426);c.bezierCurveTo(374,438,383,447,391,453);c.lineTo(384,462);
  c.bezierCurveTo(377,464,369,462,366,456);c.bezierCurveTo(364,447,364,436,368,426);c.closePath();c.fill();
  c.filter="blur(2.5px)";c.fillStyle=rgba(ns,0.12);c.beginPath();c.ellipse(385,467,6.5,2.2,0,0,TAU);c.fill();c.filter="none";
  c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.4),0.2);c.lineWidth=2.4;c.beginPath();c.moveTo(274,490);c.quadraticCurveTo(296,510,322,519);c.stroke();c.restore();
  if(P.beard){const bd=P.beard;c.save();ag_shape(c,AG_F.head);c.clip();
    const beard=cc=>{cc.moveTo(274,426);cc.bezierCurveTo(270,454,258,480,262,496);cc.bezierCurveTo(272,522,330,540,360,538);cc.bezierCurveTo(378,536,392,520,392,500);
      cc.bezierCurveTo(386,494,376,491,366,493);cc.bezierCurveTo(356,495,346,490,347,483);cc.bezierCurveTo(354,475,372,471,392,471);cc.lineTo(398,463);
      cc.bezierCurveTo(382,460,364,462,350,468);cc.bezierCurveTo(338,474,326,466,320,452);cc.bezierCurveTo(314,440,300,430,288,424);cc.closePath();};
    ag_soft(c,beard,bd,mix(bd,[150,150,160],0.4),360,500,60,"rgba(0,0,0,0.35)",8);c.restore();}
  if(st==="bun")ag_soft(c,AG_HAIR.knot,P.hair.c,C.hairHi,214,300,50,"rgba(0,0,0,0.5)",12);
  if(st!=="shaved"){const hf=AG_HAIR[st]||AG_HAIR.side;ag_soft(c,hf,P.hair.c,C.hairHi,336,300,110,"rgba(0,0,0,0.5)",18);
    c.save();ag_shape(c,hf);c.clip();c.strokeStyle=rgba(ag_lt(P.hair.c,0.55),0.16);c.lineWidth=1.8;c.lineCap="round";
    for(const s of (AG_STRANDS[st]||[])){c.beginPath();c.moveTo(s[0][0],s[0][1]);c.quadraticCurveTo(s[1][0],s[1][1],s[2][0],s[2][1]);c.stroke();}
    if(st==="coily"){const R=ag_rnd(41);c.fillStyle=rgba(ag_lt(P.hair.c,0.35),0.22);for(let i=0;i<260;i++){const x=200+R()*200,y=276+R()*190;c.beginPath();c.arc(x,y,1.6+R()*2.2,0,TAU);c.fill();}}
    // close-cropped hair: short strokes, and the skin showing faintly through at the edges
    if(st==="cropped"){const R=ag_rnd(43);c.lineWidth=1.6;for(let i=0;i<520;i++){const x=200+R()*196,y=280+R()*180,a=-0.9+R()*0.5;c.strokeStyle=rgba(i%3?ag_dk(P.hair.c,0.3):ag_lt(P.hair.c,0.4),0.28);
        c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*5,y+Math.sin(a)*5);c.stroke();}
      ag_inner(c,hf,rgba(P.skin,0.55),14,0,0);}
    if(st==="bob"){c.strokeStyle=rgba(ag_dk(P.hair.c,0.4),0.3);c.lineWidth=2.4;c.beginPath();c.moveTo(318,300);c.quadraticCurveTo(306,330,300,362);c.moveTo(250,330);c.quadraticCurveTo(222,420,250,512);c.stroke();}
    if(P.hair.streak){c.strokeStyle=rgba(P.hair.streak,0.5);c.lineWidth=5;c.beginPath();c.moveTo(270,296);c.quadraticCurveTo(320,288,378,316);c.stroke();}
    c.strokeStyle=rgba(mix(P.skin,[210,170,150],0.5),0.45);c.lineWidth=2.2;if(st==="side"){c.beginPath();c.moveTo(262,301);c.quadraticCurveTo(300,289,344,295);c.stroke();}c.restore();}
  else{c.save();ag_shape(c,AG_F.head);c.clip();const g2=c.createLinearGradient(0,296,0,380);g2.addColorStop(0,rgba(ag_dk(P.skin,0.25),0.25));g2.addColorStop(1,rgba(ag_dk(P.skin,0.25),0));c.fillStyle=g2;c.fillRect(200,290,200,100);c.restore();}
  // the ear, over the hair, except where the hair falls over it
  if(st!=="bob"&&st!=="long"){ag_ear(c,P,C);if(P.earrings){const L=AG_FACE.lobe;ag_soft(c,cc=>cc.arc(L[0],L[1],6,0,TAU),P.earrings,[255,255,255],L[0]-2,L[1]-3,6,null);}}
  // brows, lids, the nose, the glasses
  // the brows: the near one long, the far one short, foreshortened as it turns away
  c.lineCap="round";c.strokeStyle=C.brow;c.lineWidth=5;c.beginPath();c.moveTo(311,402);c.quadraticCurveTo(331,390,355,395);c.stroke();
  c.lineWidth=4;c.beginPath();c.moveTo(367,397);c.quadraticCurveTo(377,392,387,398);c.stroke();
  c.strokeStyle=C.lid;c.lineWidth=2.4;c.beginPath();c.moveTo(322,414);c.quadraticCurveTo(333,407,345,412);c.stroke();
  c.beginPath();c.moveTo(372,412);c.quadraticCurveTo(377,408,383,411);c.stroke();
  // the nose: its tip on the outline; inside, one small curve for the near nostril's wing, open towards the tip and fuller as it turns
  // under. A second curve inside the tip, as there was, read as a squiggle
  ag_taper(c,[377,455],[370,455],[368,464],[376,465],1,2.3,C.line);
  // glasses: the near lens over the near eye, the far lens narrower, its outer rim just past the cheek, the arm back to the ear
  if(P.glasses){c.strokeStyle=rgba(P.glasses,0.95);c.lineWidth=3.4;rr(c,311,401,45,32,10);c.stroke();rr(c,366,401,22,30,8);c.stroke();
    c.beginPath();c.moveTo(356,415);c.quadraticCurveTo(361,411,366,414);c.stroke();c.beginPath();c.moveTo(311,413);c.lineTo(268,409);c.stroke();
    c.strokeStyle="rgba(255,255,255,0.85)";c.lineWidth=2;c.beginPath();c.moveTo(345,406);c.lineTo(352,411);c.stroke();}
  if(P.hat&&P.hat.paint)P.hat.paint(c,P);}
// the body: the far arm if it hangs, the torso and its clothes, the near arm if it hangs, the neck; arms that move are drawn live.
// near, far: true when that arm hangs (and is painted here)
function ag_paintBody(c,P,C,near,far){const sw=P.top.c;
  if(P.hair.style==="long")ag_soft(c,AG_HAIR.longBack,ag_dk(P.hair.c,0.1),C.hairHi,250,500,160,"rgba(0,0,0,0.45)",16);
  if(far)ag_soft(c,AG_F.farArm,ag_dk(sw,0.18),ag_lt(sw,0.28),474,700,140,rgba(ag_dk(sw,0.8),0.42),24);
  ag_soft(c,AG_F.torso,C.topBase,C.topHi,400,690,300,C.topShade,30);
  if(near){c.save();ag_shape(c,AG_F.torso);c.clip();c.shadowColor=rgba(ag_dk(sw,0.85),0.35);c.shadowBlur=18;c.shadowOffsetX=10000+10;c.translate(-10000,0);ag_shape(c,AG_F.arm);c.fill();c.restore();}
  ag_folds(c,AG_F.torso,AG_FOLDS,rgba(ag_dk(sw,0.7),0.2),"rgba(255,255,255,0.16)");
  ag_neckline(c,P,C);if(P.top.paint)P.top.paint(c,P);
  if(near){ag_soft(c,AG_F.arm,ag_dk(sw,0.2),ag_lt(sw,0.25),150,660,170,rgba(ag_dk(sw,0.8),0.4),26);
    ag_folds(c,AG_F.arm,AG_ARMFOLDS,rgba(ag_dk(sw,0.75),0.2),"rgba(255,255,255,0.1)");
    c.save();ag_shape(c,AG_F.arm);c.clip();const eg=c.createRadialGradient(196,966,0,196,966,46);eg.addColorStop(0,rgba(ag_dk(sw,0.8),0.22));eg.addColorStop(1,rgba(ag_dk(sw,0.8),0));c.fillStyle=eg;c.fillRect(140,910,120,120);c.restore();}
  if(P.lanyard)ag_lanyard(c);
  ag_soft(c,AG_F.neck,mix(P.skin,ag_dk(P.skin,0.4),0.22),P.skin,330,548,110,C.skinShade,18);
  c.save();ag_shape(c,AG_F.neck);c.clip();const ng=c.createLinearGradient(0,512,0,572);ng.addColorStop(0,rgba(mix(P.skin,[60,20,10],0.6),0.5));ng.addColorStop(1,rgba(mix(P.skin,[60,20,10],0.6),0));
  c.fillStyle=ng;c.fillRect(226,420,150,160);c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.5),0.16);c.lineWidth=2.2;c.lineCap="round";c.beginPath();c.moveTo(286,512);c.quadraticCurveTo(302,548,318,582);c.stroke();c.restore();
  // the collar closes over the neck: the neckline again, only its band
  if(P.top.kind==="sweater")ag_soft(c,AG_F.collar,ag_lt(sw,0.14),ag_lt(sw,0.3),330,600,80,rgba(ag_dk(sw,0.7),0.35),8);
  else if(P.top.kind==="tunic"||P.top.kind==="apron")ag_soft(c,AG_F.collar,ag_dk(sw,P.top.kind==="tunic"?0.1:0.06),ag_lt(sw,0.25),330,600,80,rgba(ag_dk(sw,0.7),0.35),8);
  else ag_neckline(c,P,C);}
// a person's kept pictures: the head; the body with both arms down, with only the far arm down, and with neither
function ag_fig(who){const P=ag_spec(who),k=P.key||P.name;let F=AG_PEOPLE[k];if(F)return F;const C=ag_colours(P);
  F=AG_PEOPLE[k]={P,C,head:ag_layer(c=>ag_paintHead(c,P,C),[160,250,440,560]),bodies:{}};return F;}
function ag_figBody(F,near,far){const k=(near?1:0)+(far?2:0);return F.bodies[k]||(F.bodies[k]=ag_layer(c=>ag_paintBody(c,F.P,F.C,near,far)));}

/* ---------------------------------------------------------------- arms that move
   An arm is [upper arm, forearm, hand]: the upper arm's and the forearm's angles in degrees from straight down, positive towards the
   way the person faces, and the hand: "rest", "hold", "point" or "open". Seen in three-quarter view, an arm reaching the way the
   person faces also reaches towards us, so its reach across the frame is drawn shorter (AG_FIG.fore).
   People keep their arms down, painted with the body. A live arm is only for a hand on something the story needs: a thing held
   ("hold", with o.hold drawing it), a wheel, a switch, a dial. Pointing, an open hand while talking, a hand at the chin and forearms on
   a desk read as wrong, so the films don't use them: at a desk, the desk hides the hanging arms (o.cut). AG_HANG is the painted arm's
   own angles, so a hand that rises from it starts where the arm was. */
const AG_POSES={
  hold:   {near:[10,128,"hold"]}
};
const AG_HANG={near:[4,34,"rest"],far:[0,6,"rest"]};
AG_FIG.fore=0.72;
const ag_rad=d=>d*Math.PI/180;
// a pose by its name: in a render or a check, a name that isn't in AG_POSES (a gesture the films no longer draw) stops the film with an
// error that says so; the player on the site draws the arms down instead
function ag_namedPose(p){const q=AG_POSES[p];if(!q&&window.__RENDER__)throw new Error('pose "'+p+'" is a gesture these films no longer draw: keep the arms down, or give a hand something to hold (people.js, AG_POSES)');return q;}
function ag_poseOf(o){const get=p=>p==="hang"?{near:AG_HANG.near}:typeof p==="string"?ag_namedPose(p):p;const a=get(o.pose);if(!a)return null;const b=o.pose2?get(o.pose2):null,m=clamp(o.mix||0,0,1);
  if(!b||m<=0)return a;if(m>=1)return b;
  const bl=(k)=>{const x=a[k]||AG_HANG[k],y=b[k]||AG_HANG[k];return[lerp(x[0],y[0],m),lerp(x[1],y[1],m),m<0.5?x[2]:y[2]];};
  return{near:bl("near"),far:(a.far||b.far)?bl("far"):null};}
// where an arm's joints are: the shoulder J, the elbow, the wrist
function ag_joints(J,spec){const f=AG_FIG.fore,a1=ag_rad(spec[0]),a2=ag_rad(spec[1]),E=[J[0]+Math.sin(a1)*AG_FIG.L1*f,J[1]+Math.cos(a1)*AG_FIG.L1],
  Wr=[E[0]+Math.sin(a2)*AG_FIG.L2*f,E[1]+Math.cos(a2)*AG_FIG.L2];return{J,E,Wr};}
// a tapered capsule from A (width wa) to B (width wb), as part of a shape
function ag_capsule(c,A,B,wa,wb){const dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,nx=-uy,ny=ux,ra=wa/2,rb=wb/2,an=Math.atan2(uy,ux);
  c.moveTo(A[0]+nx*ra,A[1]+ny*ra);c.lineTo(B[0]+nx*rb,B[1]+ny*rb);c.arc(B[0],B[1],rb,an+Math.PI/2,an-Math.PI/2,true);c.lineTo(A[0]-nx*ra,A[1]-ny*ra);c.arc(A[0],A[1],ra,an-Math.PI/2,an-3*Math.PI/2,true);c.closePath();}
// an arm's outline: the upper arm and the forearm, tapering from the shoulder to the wrist, with a rounded elbow
function ag_armPath(J,E,Wr,w){const d1=[E[0]-J[0],E[1]-J[1]],d2=[Wr[0]-E[0],Wr[1]-E[1]],l1=Math.hypot(d1[0],d1[1])||1,l2=Math.hypot(d2[0],d2[1])||1;
  const u1=[d1[0]/l1,d1[1]/l1],u2=[d2[0]/l2,d2[1]/l2],turn=Math.atan2(u1[0]*u2[1]-u1[1]*u2[0],u1[0]*u2[0]+u1[1]*u2[1]),
    r=w[1]*0.56,k=Math.min(Math.abs(Math.tan(turn/2))*r,l1*0.45,l2*0.45);
  // the centre line: along the upper arm, round the elbow, along the forearm, with each point's width
  const pts=[],add=(x,y,wd)=>pts.push([x,y,wd]),n1=10,n2=10,na=8;
  for(let i=0;i<=n1;i++){const u=i/n1,d=u*(l1-k);add(J[0]+u1[0]*d,J[1]+u1[1]*d,lerp(w[0],w[1],u*0.94));}
  const A=[E[0]-u1[0]*k,E[1]-u1[1]*k],B=[E[0]+u2[0]*k,E[1]+u2[1]*k];
  for(let i=1;i<na;i++){const u=i/na,m=1-u,q=[m*m*A[0]+2*m*u*E[0]+u*u*B[0],m*m*A[1]+2*m*u*E[1]+u*u*B[1]];add(q[0],q[1],w[1]);}
  for(let i=0;i<=n2;i++){const u=i/n2,d=k+u*(l2-k);const bulge=Math.sin(Math.min(1,u*2.2)*Math.PI)*0.05;add(E[0]+u2[0]*d,E[1]+u2[1]*d,lerp(w[1],w[2],u)*(1+bulge));}
  // each side, offset from the centre line; on the inside of the bend a point that would fold back over the last is left out
  const L=[],R=[],keep=(S,x,y,tx,ty)=>{const l=S[S.length-1];if(!l||(x-l[0])*tx+(y-l[1])*ty>0.5)S.push([x,y]);};
  for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[Math.min(pts.length-1,i+1)],o=pts[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],dl=Math.hypot(dx,dy)||1,tx=dx/dl,ty=dy/dl,nx=-ty,ny=tx;
    keep(L,p[0]+nx*p[2]/2,p[1]+ny*p[2]/2,tx,ty);keep(R,p[0]-nx*p[2]/2,p[1]-ny*p[2]/2,tx,ty);}
  return c=>{const e=pts[pts.length-1],an=Math.atan2(u2[1],u2[0]),s0=pts[0],a0=Math.atan2(u1[1],u1[0]);c.moveTo(L[0][0],L[0][1]);
    for(let i=1;i<L.length;i++){const m=[(L[i-1][0]+L[i][0])/2,(L[i-1][1]+L[i][1])/2];c.quadraticCurveTo(L[i-1][0],L[i-1][1],m[0],m[1]);}c.lineTo(L[L.length-1][0],L[L.length-1][1]);
    c.arc(e[0],e[1],e[2]/2,an+Math.PI/2,an-Math.PI/2,true);
    for(let i=R.length-2;i>=0;i--){const m=[(R[i+1][0]+R[i][0])/2,(R[i+1][1]+R[i][1])/2];c.quadraticCurveTo(R[i+1][0],R[i+1][1],m[0],m[1]);}c.lineTo(R[0][0],R[0][1]);
    c.arc(s0[0],s0[1],s0[2]/2,a0-Math.PI/2,a0-3*Math.PI/2,true);c.closePath();};}
// a hand at the wrist, pointing along a (radians), in figure space: "rest", "hold", "point" or "open"; up: the thumb's side
function ag_hand(c,Wr,a,kind,P,C,up){c.save();c.translate(Wr[0],Wr[1]);c.rotate(a);if(up<0)c.scale(1,-1);
  const sk=P.skin,path=cc=>{if(kind==="open"){cc.moveTo(-4,-28);cc.bezierCurveTo(40,-36,108,-32,150,-16);cc.bezierCurveTo(162,-10,162,4,150,8);cc.bezierCurveTo(108,20,50,30,-4,28);cc.closePath();}
      else if(kind==="point"){cc.moveTo(-4,-28);cc.bezierCurveTo(30,-34,68,-32,92,-22);cc.lineTo(150,-18);cc.bezierCurveTo(162,-17,162,-4,150,-3);cc.lineTo(100,-1);cc.bezierCurveTo(108,10,104,24,90,28);cc.bezierCurveTo(58,34,24,32,-4,28);cc.closePath();}
      else{cc.moveTo(-4,-28);cc.bezierCurveTo(34,-36,76,-34,98,-20);cc.bezierCurveTo(116,-8,116,16,98,26);cc.bezierCurveTo(66,36,24,34,-4,28);cc.closePath();}};
  const thumb=cc=>{if(kind==="open"){cc.moveTo(18,-26);cc.bezierCurveTo(38,-56,66,-66,82,-60);cc.bezierCurveTo(90,-54,80,-44,62,-36);cc.bezierCurveTo(48,-30,38,-28,28,-24);cc.closePath();}
      else{cc.moveTo(20,-26);cc.bezierCurveTo(44,-44,72,-46,90,-36);cc.bezierCurveTo(98,-30,92,-20,78,-19);cc.bezierCurveTo(60,-18,42,-20,28,-20);cc.closePath();}};
  ag_soft(c,path,mix(sk,ag_dk(sk,0.4),0.12),mix(sk,[255,240,228],0.4),70,-22,90,C.skinShade,10);ag_soft(c,thumb,mix(sk,ag_dk(sk,0.4),0.08),mix(sk,[255,240,228],0.45),66,-44,46,C.skinShade,6);
  if(kind==="rest"||kind==="hold"){c.strokeStyle=rgba(mix(sk,[70,24,14],0.5),0.32);c.lineWidth=2;c.lineCap="round";for(const y of [-6,6,17]){c.beginPath();c.moveTo(84,y);c.quadraticCurveTo(98,y+2,106,y+6);c.stroke();}}
  c.restore();}
// one arm, matte like the clothes: the sleeve, a crease inside the elbow, the cuff, the hand; returns its joints
function ag_arm(c,P,C,J,spec,back){const j=ag_joints(J,spec),w=AG_FIG.w,col=back?ag_dk(P.top.c,0.14):P.top.c,
    hx=lerp(j.J[0],j.E[0],0.3)+30,hy=lerp(j.J[1],j.E[1],0.3)-20,ah=Math.atan2(j.Wr[1]-j.E[1],j.Wr[0]-j.E[0]),u=[Math.cos(ah),Math.sin(ah)],
    a1=Math.atan2(j.E[1]-j.J[1],j.E[0]-j.J[0]),turn=Math.abs(Math.atan2(Math.sin(ah-a1),Math.cos(ah-a1)));
  // a gentle bend is one outline; a sharp one (the forearm folding back) is the upper arm, then the forearm over it
  let fn;if(turn<1.25){fn=ag_armPath(j.J,j.E,j.Wr,w);ag_soft(c,fn,ag_dk(col,0.16),ag_lt(col,0.28),hx,hy,240,rgba(ag_dk(col,0.8),0.42),20);}
  else{ag_soft(c,cc=>ag_capsule(cc,j.J,j.E,w[0],w[1]),ag_dk(col,0.16),ag_lt(col,0.28),hx,hy,240,rgba(ag_dk(col,0.8),0.42),20);
    fn=cc=>ag_capsule(cc,j.E,j.Wr,w[1]*0.96,w[2]);ag_soft(c,fn,ag_dk(col,0.1),ag_lt(col,0.3),j.E[0]+u[0]*80+20,j.E[1]+u[1]*80-20,200,rgba(ag_dk(col,0.8),0.42),18);}
  c.save();ag_shape(c,fn);c.clip();c.strokeStyle=rgba(ag_dk(col,0.75),0.22);c.lineWidth=3;c.lineCap="round";const m=[j.E[0]+u[0]*60,j.E[1]+u[1]*60];
  c.beginPath();c.moveTo(j.E[0]-u[1]*18,j.E[1]+u[0]*18);c.quadraticCurveTo(j.E[0]+u[0]*20,j.E[1]+u[1]*20,m[0]+u[1]*10,m[1]-u[0]*10);c.stroke();c.restore();
  // the hand: the thumb on the side away from the body (up when the forearm points forward, towards us when it rises)
  ag_hand(c,[j.Wr[0]+u[0]*6,j.Wr[1]+u[1]*6],ah+(spec[2]==="open"?-0.3:0),spec[2]||"rest",P,C,u[0]>=0?1:-1);
  c.save();c.translate(j.Wr[0],j.Wr[1]);c.rotate(ah);c.fillStyle=rgba(ag_dk(col,0.12),1);rr(c,-16,-w[2]/2-3,20,w[2]+6,8);c.fill();c.restore();
  return j;}

/* ---------------------------------------------------------------- drawing a person */
function ag_person(ctx,who,x,y,s,o){o=o||{};const F=ag_fig(who),P=F.P,C=F.C,t=o.t||0,pose=o.pose&&(o.pose!=="hang"||(o.pose2&&o.mix>0))?ag_poseOf(o):null,A=AG_FIG.anchor,ph=TAU/(P.breath?1/P.breath:3.6);
  const br=Math.sin(t*ph)*2.2,blink=o.blink!=null?o.blink:ag_blinkAt(t,P),g=o.gaze||[2,0];
  if(window.__RENDER__&&o.cut==null&&!o.covered)ag_bottomShows(ctx,ctx.getTransform().translate(x,y).scale(o.flip?-s:s,s).translate(-A[0],-A[1]),who);
  ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.translate(-A[0],-A[1]);
  ctx.save();ctx.translate(0,br);
  let hands=null;
  // o.cut: a height in the frame below which the body and hanging arms are hidden (behind a desk drawn first); moving arms still show
  const body=(L)=>{if(o.cut==null)return ag_drawLayer(ctx,L);ctx.save();ctx.beginPath();ctx.rect(-4000,-4000,9000,4000+A[1]+(o.cut-y)/s-br);ctx.clip();ag_drawLayer(ctx,L);ctx.restore();};
  if(!pose)body(ag_figBody(F,true,true));
  else{const J=AG_FIG.shoulder,farMoves=!!pose.far;const fr=farMoves?ag_arm(ctx,P,C,J.far,pose.far,true):null;
    body(ag_figBody(F,false,!farMoves));
    const nj=ag_joints(J.near,pose.near||AG_HANG.near);hands={near:nj.Wr,far:fr?fr.Wr:null,nearElbow:nj.E};
    if(o.holdBack)o.holdBack(ctx,hands);ag_arm(ctx,P,C,J.near,pose.near||AG_HANG.near,false);if(o.hold)o.hold(ctx,hands);}
  ctx.restore();
  // the head: breathing a little less than the body, nodding about the top of the neck
  ctx.save();ctx.translate(AG_FIG.piv[0],AG_FIG.piv[1]+br*0.7);ctx.rotate(o.nod||0);ctx.translate(-AG_FIG.piv[0],-AG_FIG.piv[1]);
  ag_drawLayer(ctx,F.head);
  ag_face(ctx,P,C,blink,g,o.talk,o.smile==null?0.3:o.smile);
  ctx.restore();
  // o.front: a thing the near hand holds up before the face, over the head (drawn with hold, it would sit behind the face)
  if(o.front&&hands){ctx.save();ctx.translate(0,br);o.front(ctx,hands);ctx.restore();}
  ctx.restore();return hands;}
// the face's live parts, in figure space: the eyes (blink 0 to 1, gaze [dx, dy]) and the mouth (talk 0 to 1, smile 0 to 1)
function ag_face(ctx,P,C,blink,g,talk,smile){const F=AG_FACE,by=Math.max(0.12,1-(blink||0));g=g||[2,0];ctx.fillStyle="#1a1416";
  ctx.save();ctx.translate(F.eyeN[0]+g[0],F.eyeN[1]+g[1]);ctx.scale(1,by);ctx.beginPath();ctx.ellipse(0,0,F.eyeN[2],F.eyeN[3],0,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(F.eyeF[0]+g[0]*0.7,F.eyeF[1]+g[1]);ctx.scale(1,by);ctx.beginPath();ctx.ellipse(0,0,F.eyeF[2],F.eyeF[3],0,0,TAU);ctx.fill();ctx.restore();
  const tk=clamp(talk||0,0,1),sm=clamp(smile||0,0,1),[a,m,b]=F.mouth;
  if(tk>0.04){ctx.fillStyle=rgba(mix(P.skin,[60,20,24],0.7),0.9);ctx.beginPath();ctx.moveTo(a[0]+1,a[1]-1);ctx.quadraticCurveTo(m[0],m[1]-1-sm*3,b[0],b[1]-1);ctx.quadraticCurveTo(m[0]+2,m[1]+1+tk*10,a[0]+1,a[1]-1);ctx.fill();}
  else{ctx.strokeStyle=C.line;ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a[0],a[1]-sm*1.5);ctx.quadraticCurveTo(m[0],m[1]+sm*3,b[0],b[1]-sm*1.5);ctx.stroke();}}
// a person fading in or out is drawn whole first, then laid on the picture at that opacity. Drawn straight at a part opacity, the
// parts that make them (the far arm, the body, the near arm, the head) each fade on their own, so the body shows through the arm in
// front of it and the arm behind shows through the body, like a ghost. Only the part of the frame they're drawn in is used (AG_FADE,
// the size of the canvas, kept); what they hold is drawn with them
let AG_FADE=null;
const ag_personWhole=ag_person;
ag_person=function(ctx,who,x,y,s,o){const a=ctx.globalAlpha;if(a>=0.995||a<0.004||ctx.globalCompositeOperation!=="source-over")return ag_personWhole.apply(this,arguments);
  const A=AG_FIG.anchor,m=ctx.getTransform(),M=m.translate(x,y).scale(o&&o.flip?-s:s,s).translate(-A[0],-A[1]),cw=ctx.canvas.width,ch=ctx.canvas.height;
  let L=1e9,R=-1e9,T0=1e9,B=-1e9;for(const [fx,fy] of [[-900,-500],[1500,-500],[-900,1300],[1500,1300]]){const X=M.a*fx+M.c*fy+M.e,Y=M.b*fx+M.d*fy+M.f;
    L=Math.min(L,X);R=Math.max(R,X);T0=Math.min(T0,Y);B=Math.max(B,Y);}
  L=Math.max(0,Math.floor(L));T0=Math.max(0,Math.floor(T0));R=Math.min(cw,Math.ceil(R));B=Math.min(ch,Math.ceil(B));if(R<=L||B<=T0)return ag_personWhole.apply(this,arguments);
  if(!AG_FADE||AG_FADE.width!==cw||AG_FADE.height!==ch)AG_FADE=mkCanvas(cw,ch);const bx=AG_FADE.getContext("2d");
  bx.setTransform(1,0,0,1,0,0);bx.globalAlpha=1;bx.globalCompositeOperation="source-over";bx.clearRect(L,T0,R-L,B-T0);
  bx.save();bx.beginPath();bx.rect(L,T0,R-L,B-T0);bx.clip();bx.setTransform(m);let hands;try{hands=ag_personWhole.call(this,bx,who,x,y,s,o);}finally{bx.restore();}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(AG_FADE,L,T0,R-L,B-T0,L,T0,R-L,B-T0);ctx.restore();return hands;};
// people end flat at figure y 1100, under the waist: in a render or a check, a person whose flat bottom shows inside the picture
// stops the film with an error that says so (move them down or make them bigger, draw a desk or a card over them and say o.cut or
// o.covered); the player on the site never stops for it
function ag_bottomShows(ctx,m,who){const c=ctx.canvas,ys=[30,500].map(fx=>m.b*fx+m.d*1103+m.f),xs=[30,500].map(fx=>m.a*fx+m.c*1103+m.e);
  if(Math.max(...ys)<c.height-0.5&&Math.max(...xs)>0&&Math.min(...xs)<c.width)
    throw new Error("a person ("+(typeof who==="string"?who:who.name||"?")+") ends at y "+Math.round(Math.max(...ys)/c.height*1080)+" of 1080, inside the picture: put them lower or bigger (y + 504 s at least 1080), or cover their waist and say o.cut or o.covered");}
// blinks at the person's own moments, every three to six seconds, each about a seventh of a second
function ag_blinkAt(t,P){const seed=(P.name||"x").length*7.3;const k=Math.floor(t/4.3+seed),ph=t-((k-seed)*4.3+1.6+2.2*hash(k,seed));return ph>0&&ph<0.14?Math.sin(ph/0.14*Math.PI):0;}
// a talking mouth for a line: open and close with the voice, from the line's cue to its end (sc.cues, sc.ends)
function ag_talk(sc,id,t){const a=sc.cues[id],b=sc.ends[id];if(t<a||t>b)return 0;return (0.35+0.35*Math.sin(t*17.1)+0.3*Math.sin(t*9.7+1))*sstep(a,a+0.1,t)*(1-sstep(b-0.1,b,t));}

/* ===== What an agent is: the agent =====
   The model is a matte ceramic sphere with a band of violet light that glows while it thinks; the loop is a bent oak ring with small
   graphite arrows, its steps (Plan, Act, Check) matte pills on the ring; the hands are pale robot arms with oak joints and graphite
   grippers, reaching into tools: matte cards that take a blue edge when touched, with a lock when they only read. Data coming back is
   small orange pellets along an arm; a check that passes is a green pill, one that fails or sends the agent round again an amber one.
     ag_model(ctx, x, y, r, o)      the sphere: o.core 0 to 1 (how lit the band is), o.think 0 to 1 (the light runs faster), o.t,
                                    o.label (words under the band, at least 28 px, or below the sphere when it's small), o.a;
                                    o.only "light" draws the band's light alone, glowing, to draw again over a night pass
     ag_modelLight(ctx, x, y, r, a) the violet light the sphere throws on the wall behind it, and its soft shadow on the floor (o.floor)
     ag_ring(ctx, x, y, R, o)       o.p 0 to 1 drawn, from o.from degrees (-120: top left); o.arrows, degrees; o.pulse {deg, a}
     ag_step(ctx, x, y, label, o)   a step on the ring: o.on (its colour while lit), o.a, o.k (scale); returns its box
     ag_loop(ctx, x, y, o)          the model in its ring with its steps: o.R (180), o.r (88), o.steps [[label, degrees], ...] (Plan,
                                    Act, Check), o.p, o.core, o.think, o.lit (the lit step's index), o.col (its colour), o.pulse, o.a, o.t
     ag_reach(ctx, p, u, o)         a hand along the curve p ([x0,y0, x1,y1, x2,y2, x3,y3]) out to u (0 to 1): o.data 0 to 1 sends
                                    pellets back along it, o.grip 0 to 1 closes the gripper (it closes by itself near the end)
     ag_tool(ctx, x, y, w, h, name, o) a tool: o.sub ("read only"), o.icon ("lock", "draft" or null), o.touch 0 to 1, o.a, o.col
     ag_pellet(ctx, x, y, a)        one pellet of data
     ag_verdict(ctx, x, y, text, kind, a) centred on (x, y): kind "pass" (green, a tick), "loop" (amber, round again), "fail" (amber, a warning)
     ag_badge(ctx, x, y, text, o)   a badge on a blue lanyard hanging from (x, y), as a person's would (who the agent is, or is
                                    taken for): o.t sways it a little, o.drop (90) how far below the hook it hangs, o.a */

function ag_model(ctx,x,y,r,o){o=o||{};const t=o.t||0,core=o.core==null?1:o.core,think=o.think||0,sp=AG.sphere,a=o.a==null?1:o.a;if(a<=0)return;
  if(o.only==="light")return ag_bandLight(ctx,x,y,r,t,core,think,a);
  ctx.save();ctx.globalAlpha*=a;
  let g=ctx.createRadialGradient(x+r*0.34,y-r*0.43,r*0.07,x,y,r*1.05);g.addColorStop(0,sp[0]);g.addColorStop(0.55,sp[1]);g.addColorStop(0.85,sp[2]);g.addColorStop(1,sp[3]);
  ctx.save();ctx.shadowColor=AG.sphereShadow;ctx.shadowBlur=r*0.45;ctx.shadowOffsetX=AG.sdx*r/88;ctx.shadowOffsetY=r*0.27;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();
  ctx.strokeStyle=AG.seam;ctx.lineWidth=Math.max(1,r/58);ctx.beginPath();ctx.ellipse(x,y+r*0.09,r,r*0.28,0,0,Math.PI);ctx.stroke();
  const bw=r*1.3,bh=r*0.32,by=y-r*0.11;rr(ctx,x-bw/2,by-bh/2,bw,bh,bh/2);ctx.fillStyle=AG.visor;ctx.fill();
  // the band's light: a soft bright patch that sweeps along it, faster while the model thinks
  const gl=Math.min(1,0.4+0.6*core+0.3*think),sc=0.5+0.5*Math.sin(t*(1.8+5*think)*TAU/4);
  g=ctx.createLinearGradient(x-bw/2,0,x+bw/2,0);g.addColorStop(0,rgba(AG.violet,0));g.addColorStop(clamp(sc-0.25,0.001,0.997),rgba(AG.violet,0));
  g.addColorStop(clamp(sc,0.002,0.998),rgba(AG.visorLight,gl));g.addColorStop(clamp(sc+0.25,0.003,0.999),rgba(AG.violet,0));g.addColorStop(1,rgba(AG.violet,0));
  const ih=bh-r*0.11;rr(ctx,x-bw/2+r*0.045,by-ih/2,bw-r*0.09,ih,ih/2);ctx.fillStyle=g;ctx.fill();
  ctx.restore();
  if(o.label){const big=r>=80;ag_T(ctx,o.label,x,big?y+r*0.6:y+r+44,{w:700,size:28,align:"center",col:AG.label});}
  ctx.restore();}
// the band's light alone, glowing: over a night pass (ag_roomLight(ctx, a, {night: true})), so the model's light shines in the dark
function ag_bandLight(ctx,x,y,r,t,core,think,a){const bw=r*1.3,bh=r*0.32,by=y-r*0.11,ih=bh-r*0.11,sc=0.5+0.5*Math.sin(t*(1.8+5*think)*TAU/4),gl=Math.min(1,0.4+0.6*core+0.3*think);
  ctx.save();ctx.globalAlpha*=a;ctx.globalCompositeOperation="lighter";ctx.shadowColor=rgba(AG.violet,0.9);ctx.shadowBlur=r*0.5;
  const g=ctx.createLinearGradient(x-bw/2,0,x+bw/2,0);g.addColorStop(0,rgba(AG.violet,0.25*gl));g.addColorStop(clamp(sc,0.002,0.998),rgba(AG.visorLight,0.9*gl));g.addColorStop(1,rgba(AG.violet,0.25*gl));
  rr(ctx,x-bw/2+r*0.045,by-ih/2,bw-r*0.09,ih,ih/2);ctx.fillStyle=g;ctx.fill();ctx.restore();}
function ag_modelLight(ctx,x,y,r,a,floorY){a=a==null?1:a;if(a<=0)return;const g=ctx.createRadialGradient(x,y,r*0.45,x,y,r*6.4);g.addColorStop(0,rgba(AG.wallGlow,0.1*a));g.addColorStop(1,rgba(AG.wallGlow,0));
  ctx.fillStyle=g;ctx.fillRect(x-r*6.4,y-r*6.4,r*12.8,r*12.8);if(floorY)ag_floorShadow(ctx,x,floorY,r*1.9,r*0.3,0.24*a+0.08);}

function ag_ring(ctx,x,y,R,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;const a0=(o.from==null?-120:o.from)*Math.PI/180,a1=a0+p*TAU,k=R/180;
  ctx.save();if(o.a!=null)ctx.globalAlpha*=o.a;ctx.lineCap="round";
  // a bent-oak ring: a soft shadow on the wall, the wood, its lit top edge
  ctx.strokeStyle=rgba(AG.shadow,0.14);ctx.lineWidth=14*k;ctx.save();ctx.translate(AG.sdx*k,10*k);ctx.beginPath();ctx.arc(x,y,R,a0,a1);ctx.stroke();ctx.restore();
  ctx.strokeStyle=rgba(AG_OAK.dark,1);ctx.lineWidth=13*k;ctx.beginPath();ctx.arc(x,y,R,a0,a1);ctx.stroke();
  ctx.strokeStyle=rgba(AG_OAK.base,1);ctx.lineWidth=10*k;ctx.beginPath();ctx.arc(x,y,R,a0,a1);ctx.stroke();
  ctx.strokeStyle=rgba(AG_OAK.hi,0.9);ctx.lineWidth=2.2*k;ctx.beginPath();ctx.arc(x,y,R-3*k,a0,a1);ctx.stroke();
  ctx.strokeStyle=rgba(AG_OAK.dark,0.35);ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,R+1.5*k,a0,a1);ctx.stroke();
  for(const d of (o.arrows||[-60,60,180])){const da=(d*Math.PI/180-a0+TAU*4)%TAU;if(da/TAU>p)continue;const a=d*Math.PI/180,px=x+Math.cos(a)*R,py=y+Math.sin(a)*R,tx=-Math.sin(a),ty=Math.cos(a);
    const q=[16*k,9*k,12*k];ctx.save();ctx.shadowColor=rgba(AG.shadow,0.32);ctx.shadowBlur=6*k;ctx.shadowOffsetX=AG.sdx*0.4*k;ctx.shadowOffsetY=3*k;ctx.fillStyle=AG.arrow;
    ctx.beginPath();ctx.moveTo(px+tx*q[0],py+ty*q[0]);ctx.lineTo(px-tx*q[1]+Math.cos(a)*q[2],py-ty*q[1]+Math.sin(a)*q[2]);ctx.lineTo(px-tx*q[1]-Math.cos(a)*q[2],py-ty*q[1]-Math.sin(a)*q[2]);ctx.closePath();ctx.fill();ctx.restore();}
  // where the agent is in its loop: a violet light travelling along the ring
  if(o.pulse&&o.pulse.a>0){const a=o.pulse.deg*Math.PI/180,px=x+Math.cos(a)*R,py=y+Math.sin(a)*R;
    ctx.strokeStyle=rgba(AG.violet,0.45*o.pulse.a);ctx.lineWidth=8*k;ctx.beginPath();ctx.arc(x,y,R,a-0.55,a);ctx.stroke();
    ctx.shadowColor=rgba(AG.violet,0.7);ctx.shadowBlur=18*k;ctx.fillStyle=rgba(AG.violet,o.pulse.a);ctx.beginPath();ctx.arc(px,py,11*k,0,TAU);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle="rgba(255,255,255,"+o.pulse.a+")";ctx.beginPath();ctx.arc(px-3*k,py-3*k,3.5*k,0,TAU);ctx.fill();}
  ctx.restore();}

function ag_step(ctx,x,y,label,o){o=o||{};const w=ag_tw(ctx,label,{w:700,size:30})+54,h=52,b={x:x-w/2,y:y-h/2,w,h,cx:x,cy:y};const a=o.a==null?1:o.a;if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.4,1,o.k));
  ag_box(ctx,b.x,b.y,w,h,h/2,{edge:o.on||null,glow:o.on||null});ag_T(ctx,label,x,y+10,{w:700,size:30,align:"center",col:o.on||AG.ink});ctx.restore();return b;}

const AG_LOOP={R:180,r:88,steps:[["Plan",-120],["Act",0],["Check",120]]};
function ag_loop(ctx,x,y,o){o=o||{};const R=o.R||AG_LOOP.R,r=o.r||AG_LOOP.r,steps=o.steps||AG_LOOP.steps,a=o.a==null?1:o.a,t=o.t||0;if(a<=0)return[];
  ctx.save();ctx.globalAlpha*=a;
  ag_modelLight(ctx,x,y,r,o.core==null?1:o.core,o.floor);
  ag_ring(ctx,x,y,R,{p:o.p==null?1:o.p,from:steps[0][1],pulse:o.pulse});
  ag_model(ctx,x,y,r,{t,core:o.core,think:o.think,label:o.label===undefined?"Model":o.label});
  const boxes=steps.map((s,i)=>{const d=s[1]*Math.PI/180,sa=o.stepA?o.stepA[i]:1;return ag_step(ctx,x+Math.cos(d)*R,y+Math.sin(d)*R,s[0],{on:o.lit===i?(o.col||AG.violet):null,a:sa,k:o.stepK?o.stepK[i]:null});});
  ctx.restore();return boxes;}

function ag_pellet(ctx,x,y,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(AG.orange,0.6);ctx.shadowBlur=10;ctx.fillStyle=rgba(AG.orange,1);rr(ctx,x-8,y-5,16,10,5);ctx.fill();ctx.restore();}
function ag_reach(ctx,p,u,o){o=o||{};if(u<=0.002)return;const k=o.k||1;
  ctx.save();if(o.a!=null)ctx.globalAlpha*=o.a;ctx.lineCap="round";ctx.lineJoin="round";
  // a matte tube with a soft shadow on the wall, a highlight along its top, two oak joints and a graphite gripper
  ctx.strokeStyle=AG.tube.shadow;ctx.lineWidth=20*k;ctx.save();ctx.translate(AG.sdx*k,14*k);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  ctx.strokeStyle=AG.tube.edge;ctx.lineWidth=18*k;ag_bzPath(ctx,p,0,u);ctx.stroke();
  ctx.strokeStyle=AG.tube.fill;ctx.lineWidth=13*k;ag_bzPath(ctx,p,0,u);ctx.stroke();
  ctx.strokeStyle=AG.tube.hi;ctx.lineWidth=4*k;ctx.save();ctx.translate(0,-3.5*k);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  for(const j of [0.36,0.7]){if(u<j)continue;const q=ag_bz(p,j);ctx.fillStyle=AG.jointRim;ctx.beginPath();ctx.arc(q[0],q[1],11.5*k,0,TAU);ctx.fill();
    const jg=ctx.createRadialGradient(q[0]-3*k,q[1]-4*k,1,q[0],q[1],11*k);jg.addColorStop(0,rgba(AG_OAK.hi,1));jg.addColorStop(1,AG.joint);ctx.fillStyle=jg;ctx.beginPath();ctx.arc(q[0],q[1],10*k,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(AG.violet,0.9);ctx.beginPath();ctx.arc(q[0],q[1],4*k,0,TAU);ctx.fill();}
  const q=ag_bz(p,u),q0=ag_bz(p,Math.max(0,u-0.02)),ang=Math.atan2(q[1]-q0[1],q[0]-q0[0]),open=lerp(0.62,0.1,Math.max(ag_ss(0.86,1,u),o.grip||0));
  ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(ang);ctx.scale(k,k);ctx.fillStyle=AG.grip;for(const s of [-1,1]){ctx.save();ctx.rotate(s*open);rr(ctx,-2,-4.5,26,9,4.5);ctx.fill();ctx.restore();}
  ctx.fillStyle=AG.hub;ctx.beginPath();ctx.arc(0,0,9.5,0,TAU);ctx.fill();ctx.strokeStyle=AG.hubEdge;ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  const d=o.data||0;if(d>0&&d<1){for(let i=0;i<3;i++){const v=1-clamp(d*1.4-i*0.2,0,1);if(v>=1||v<=0)continue;const r=ag_bz(p,v*u);ag_pellet(ctx,r[0],r[1]);}}
  ctx.restore();}

function ag_tool(ctx,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const on=o.touch||0,col=o.col||AG.blue,sub=o.sub===undefined?"read only":o.sub,icon=o.icon===undefined?"lock":o.icon;
  ag_box(ctx,x,y,w,h,20,{a,edge:on>0.1?col:null,edgeA:0.9*on,glow:on>0.1?col:null,glowA:on});
  ctx.save();ctx.globalAlpha*=a;ag_T(ctx,name,x+30,y+(sub?50:h/2+11),{w:700,size:32});
  if(sub){const ix=x+42,iy=y+88;if(icon==="lock")ag_lock(ctx,ix,iy,28,rgba(col,1));else if(icon==="draft")ag_pen(ctx,ix,iy,28,rgba(col,1));
    ag_T(ctx,sub,icon?x+66:x+30,y+96,{w:500,size:28,col:AG.mut});}
  ctx.restore();}

function ag_verdict(ctx,x,y,text,kind,a){if(a<=0)return;const col=kind==="pass"?AG.green:AG.amber,w=ag_tw(ctx,text,{w:700,size:30})+96,h=58,bx=x-w/2,by=y-h/2;
  ag_box(ctx,bx,by,w,h,29,{a,edge:col});ctx.save();ctx.globalAlpha*=a;
  if(kind==="pass")ag_tick(ctx,bx+40,y,24,rgba(col,1),4);else if(kind==="loop")ag_loopIcon(ctx,bx+40,y,28,rgba(col,1),3.5);else ag_warn(ctx,bx+40,y,30,rgba(col,1));
  ag_T(ctx,text,bx+68,y+11,{w:700,size:30,col});ctx.restore();}
function ag_badge(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const drop=o.drop||90,sw=Math.sin((o.t||0)*1.3)*0.025,w=ag_tw(ctx,text,{w:700,size:28})+48,h=58;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);
  ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(-8,drop-10);ctx.moveTo(26,0);ctx.lineTo(8,drop-10);ctx.stroke();
  ctx.fillStyle="#9AA0A8";ctx.fillRect(-9,drop-14,18,14);
  ag_box(ctx,-w/2,drop,w,h,10,{});ctx.fillStyle=rgba(AG.blue,0.85);ctx.fillRect(-w/2+10,drop+4,w-20,5);
  ag_T(ctx,text,0,drop+h/2+15,{w:700,size:28,align:"center"});ctx.restore();}

/* ===== What an agent is: cards, pills, tags, icons, the kicker, and the title and end cards =====
   Cards are matte off-white, with a soft shadow falling down and a little left (the window is on the right), a lit top edge, and a
   coloured edge only when the colour means something (AG_MEANS: blue tools, violet the model, orange data, green a pass, amber a fail or
   a loop). Words on cards: a kicker in capitals, 28 px, letter-spaced; a title, 36 px; a line under it, 28 px.
     ag_card(ctx, path, bb, o)       any shape as a card: path(c) adds the shape; bb {x, y, w, h}; o.edge (a colour), o.edgeA, o.lw,
                                     o.glow (a colour), o.glowA, o.a
     ag_box(ctx, x, y, w, h, r, o)   a rounded card
     ag_cardPath(c, x, y, w, h, r, tail) a card's shape with a speech tail: {side: "bottom"|"right"|"left"|"top", a, b, px, py}
     ag_textCard(ctx, x, y, w, words, o) words {kick (in capitals), title, sub}: a card that fits them; o.kickCol, o.tail, o.edge, o.a, o.k
                                     (springs from the tail's point, or the card's centre), o.measure (only measure); returns {x, y, w, h}
     ag_pill(ctx, x, y, text, o)     a pill centred on (x, y): o.col (its words and edge), o.icon ("tick", "loop", "warn", "lock", "draft"), o.a
     ag_label(ctx, x, y, text, o)    a kicker-style label on the wall: capitals, letter-spaced, o.col, o.align
     ag_evidence(ctx, x, y, w, words, items, o) an answer with its evidence clipped to it: words {kick, title, sub} as ag_textCard's,
                                     and under them a paperclip and "Evidence attached"; items [{kick, title, col}] (col the colour
                                     that says what it is: orange data, green a check that passed, blue a tool), shown clipped behind
                                     the card until o.open (0 to 1) fans them out, one after another, o.side "below" (the default) or
                                     "right", o.ew each card's width (300), o.gap (24); o.a, o.k (springs from the card's centre),
                                     o.clip (the line by the clip); returns {card, items}, where each is drawn now. A no-break space
                                     (\u00a0, as in "15\u00a0October") keeps two words on one line
     ag_tick, ag_loopIcon, ag_lock, ag_warn, ag_pen, ag_arrowHead, ag_clip   icons
     ag_kicker(ctx, num, title, o)   the film's number and title at the top left, as the prototype has it; o.dark on a dark frame
     ag_mark(ctx, cx, cy, r, p, a)   the series' mark: an oak ring drawing itself round a small ceramic sphere
     ag_veil(ctx, S, a)              a pale veil over the frame, for the title and end cards
     ag_title(ctx, S, t, t0, title, sub, line)   the title card from t0: the mark, the title, a line under it, and line ("Film 1 of 9 · ...")
     ag_end(ctx, S, t, t0, title, line, n, series) the end card from t0: the film's line, the mark, the title, "Film 1 of 9 · What an agent is" */

function ag_card(ctx,path,bb,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const K=AG.card,P=()=>{ctx.beginPath();path(ctx);};ctx.save();ctx.globalAlpha*=a;
  P();ctx.shadowColor=K.shadow;ctx.shadowBlur=36;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=16;ctx.fillStyle=K.base;ctx.fill();
  ctx.shadowColor="transparent";ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;const g=ctx.createLinearGradient(0,bb.y,0,bb.y+bb.h);g.addColorStop(0,K.top);g.addColorStop(1,K.bot);ctx.fillStyle=g;P();ctx.fill();
  ctx.save();P();ctx.clip();ctx.strokeStyle=K.hi;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bb.x,bb.y+1);ctx.lineTo(bb.x+bb.w,bb.y+1);ctx.stroke();ctx.restore();
  if(o.glow){ctx.shadowColor=rgba(o.glow,0.45*(o.glowA==null?1:o.glowA));ctx.shadowBlur=24;}
  ctx.strokeStyle=o.edge?rgba(o.edge,o.edgeA==null?0.9:o.edgeA):K.edge;ctx.lineWidth=o.edge?(o.lw||2.4):1.2;P();ctx.stroke();
  ctx.restore();}
function ag_box(ctx,x,y,w,h,r,o){ag_card(ctx,c=>ag_rect(c,x,y,w,h,r),{x,y,w,h},o);}
function ag_cardPath(c,x,y,w,h,r,tail){const T_=tail||{};c.moveTo(x+r,y);
  if(T_.side==="top"){c.lineTo(T_.a,y);c.lineTo(T_.px,T_.py);c.lineTo(T_.b,y);}
  c.arcTo(x+w,y,x+w,y+h,r);
  if(T_.side==="right"){c.lineTo(x+w,T_.a);c.lineTo(T_.px,T_.py);c.lineTo(x+w,T_.b);}
  c.arcTo(x+w,y+h,x,y+h,r);
  if(T_.side==="bottom"){c.lineTo(T_.b,y+h);c.lineTo(T_.px,T_.py);c.lineTo(T_.a,y+h);}
  c.arcTo(x,y+h,x,y,r);
  if(T_.side==="left"){c.lineTo(x,T_.b);c.lineTo(T_.px,T_.py);c.lineTo(x,T_.a);}
  c.arcTo(x,y,x+w,y,r);c.closePath();}
const AG_PAD=28;
// words {kick, title, sub}; a tail given as {side, at: 0..1 along that side, px, py} is placed for you
function ag_textCard(ctx,x,y,w,words,o){o=o||{};const inner=w-AG_PAD*2,tl=words.title?ag_wrap(ctx,words.title,inner,{w:700,size:36}):[],sl=words.sub?ag_wrap(ctx,words.sub,inner,{w:500,size:28}):[];
  const h=AG_PAD+(words.kick?38:0)+tl.length*44+sl.length*38+AG_PAD-(words.kick?0:6)+(tl.length||sl.length?0:-10);const bb={x,y,w,h};if(o.measure)return bb;
  const a=o.a==null?1:o.a;if(a<=0)return bb;let tail=null;
  if(o.tail){const T_=o.tail,s=T_.side,at=T_.at==null?0.2:T_.at,half=24;
    if(s==="bottom"||s==="top"){const m=x+28+(w-56)*at;tail={side:s,a:m-half,b:m+half,px:T_.px,py:T_.py};}
    else{const m=y+20+(h-40)*at;tail={side:s,a:m-half,b:m+half,px:T_.px,py:T_.py};}}
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null){const px=tail?tail.px:x+w/2,py=tail?tail.py:y+h/2;ag_about(ctx,px,py,lerp(0.5,1,o.k));}
  ag_card(ctx,c=>ag_cardPath(c,x,y,w,h,22,tail),bb,{edge:o.edge,edgeA:o.edgeA==null?0.75:o.edgeA});
  let yy=y+AG_PAD+22;if(words.kick){ag_T(ctx,String(words.kick).toUpperCase(),x+AG_PAD,yy,{w:700,size:28,ls:4,col:o.kickCol||AG.violet});yy+=16;}else yy-=22;
  for(const l of tl){yy+=44;ag_T(ctx,l,x+AG_PAD,yy,{w:700,size:36});}
  for(const l of sl){yy+=38;ag_T(ctx,l,x+AG_PAD,yy,{w:500,size:28,col:AG.mut});}
  if(o.icon==="tick")ag_tick(ctx,x+w-46,y+46,26,rgba(o.edge||AG.green,1),4);
  ctx.restore();return bb;}
function ag_pill(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||30,icon=o.icon,col=o.col||null;const w=ag_tw(ctx,text,{w:700,size})+(icon?96:56),h=size+28,bx=x-w/2,by=y-h/2;
  if(a<=0)return{x:bx,y:by,w,h};ag_box(ctx,bx,by,w,h,h/2,{a,edge:col});ctx.save();ctx.globalAlpha*=a;const ic=col?rgba(col,1):rgba(AG.ink,1);
  if(icon==="tick")ag_tick(ctx,bx+40,y,24,ic,4);else if(icon==="loop")ag_loopIcon(ctx,bx+40,y,28,ic,3.5);else if(icon==="warn")ag_warn(ctx,bx+40,y,30,ic);
  else if(icon==="lock")ag_lock(ctx,bx+40,y+4,28,ic);else if(icon==="draft")ag_pen(ctx,bx+40,y,28,ic);
  ag_T(ctx,text,icon?bx+68:x,y+size*0.36,{w:700,size,align:icon?"left":"center",col:col||AG.ink});ctx.restore();return{x:bx,y:by,w,h};}
function ag_label(ctx,x,y,text,o){o=o||{};ag_T(ctx,String(text).toUpperCase(),x,y,{w:700,size:o.size||28,ls:4,align:o.align||"left",col:o.col||AG.blue,a:o.a});}
// an answer with its evidence attached (see the head of this file)
function ag_evidence(ctx,x,y,w,words,items,o){o=o||{};items=items||[];const a=o.a==null?1:o.a,n=items.length,ew=o.ew||300,gap=o.gap==null?24:o.gap,side=o.side||"below";
  const inner=w-AG_PAD*2,tl=words.title?ag_wrap(ctx,words.title,inner,{w:700,size:36}):[],sl=words.sub?ag_wrap(ctx,words.sub,inner,{w:500,size:28}):[];
  const base=AG_PAD+22+(words.kick?16:-22)+tl.length*44+sl.length*38,h=base+72+AG_PAD-2,card={x,y,w,h};   // base: the last line of words
  // each evidence card: its words, its size, where it rests clipped behind the answer, and where the fan puts it
  const ev=items.map(it=>{const lines=ag_wrap(ctx,it.title||"",ew-48,{w:600,size:28}).slice(0,3);return{it,lines,w:ew,h:24+(it.kick?36:0)+lines.length*36+20};});
  const total=side==="below"?n*ew+(n-1)*gap:ev.reduce((s,e)=>s+e.h,0)+(n-1)*gap;let run=0;
  const open=clamp(o.open||0,0,1),st=0.45,span=1+st*Math.max(0,n-1);
  const out=ev.map((e,i)=>{const mid=(n-1)/2,rest={x:x+w-ew-26+i*10,y:y-14-i*12,r:(i%2?1:-1)*0.035};
    let to;if(side==="below"){to={x:x+w/2-total/2+i*(ew+gap),y:y+h+34+Math.abs(i-mid)*10,r:(i-mid)*0.04};}
    else{to={x:x+w+40,y:y+run,r:(i%2?1:-1)*0.02};run+=e.h+gap;}
    const p=clamp(open*span-st*i,0,1),k=p<=0?0:ag_spr(p,0,1/1.8),q=ag_sine(p);
    return Object.assign(e,{x:lerp(rest.x,to.x,k),y:lerp(rest.y,to.y,k),r:lerp(rest.r,to.r,q),to:{x:to.x,y:to.y,w:e.w,h:e.h},p});});
  const res={card,items:out.map(e=>({x:e.x,y:e.y,w:e.w,h:e.h,to:e.to}))};if(a<=0)return res;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  const drawEv=(e,i)=>{const c=e.it.col||AG.mut;ctx.save();ctx.translate(e.x+e.w/2,e.y+e.h/2);ctx.rotate(e.r);ctx.translate(-e.w/2,-e.h/2);
    ag_box(ctx,0,0,e.w,e.h,16,{edge:c,edgeA:0.55,lw:2});let yy=24;const wa=clamp((e.p-0.03)/0.15,0,1);   // words only once it's out
    if(wa>0){if(e.it.kick){ag_T(ctx,String(e.it.kick).toUpperCase(),24,yy+22,{w:700,size:28,ls:3,col:c,a:wa});yy+=36;}
      for(const l of e.lines){ag_T(ctx,l,24,yy+26,{w:600,size:28,a:wa});yy+=36;}}ctx.restore();};
  // still clipped: behind the answer; on their way out or out: in front of the table, behind the answer only while they leave it
  for(let i=n-1;i>=0;i--)if(out[i].p<0.5)drawEv(out[i],i);
  ag_box(ctx,x,y,w,h,22,{edge:o.edge,edgeA:o.edgeA==null?0.75:o.edgeA});
  let yy=y+AG_PAD+22;if(words.kick){ag_T(ctx,String(words.kick).toUpperCase(),x+AG_PAD,yy,{w:700,size:28,ls:4,col:o.kickCol||AG.violet});yy+=16;}else yy-=22;
  for(const l of tl){yy+=44;ag_T(ctx,l,x+AG_PAD,yy,{w:700,size:36});}
  for(const l of sl){yy+=38;ag_T(ctx,l,x+AG_PAD,yy,{w:500,size:28,col:AG.mut});}
  // a hairline, then the clip's line
  const fy=y+base+72;ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+AG_PAD,fy-46);ctx.lineTo(x+w-AG_PAD,fy-46);ctx.stroke();
  ag_clip(ctx,x+AG_PAD+14,fy-30,40,"#5E5A55");ag_T(ctx,o.clip||"Evidence attached",x+AG_PAD+44,fy,{w:700,size:28,col:AG.mut});
  for(let i=0;i<n;i++)if(out[i].p>=0.5)drawEv(out[i],i);
  // the clip itself, on the top edge, holding what is still behind
  ag_clip(ctx,x+w-70,y-24,64,"#5E5A55",4.2);
  ctx.restore();return res;}

/* ---------------------------------------------------------------- icons, in a colour (a CSS colour) */
function ag_tick(ctx,x,y,s,col,lw){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-s*0.5,y);ctx.lineTo(x-s*0.12,y+s*0.38);ctx.lineTo(x+s*0.55,y-s*0.42);ctx.stroke();ctx.restore();}
function ag_loopIcon(ctx,x,y,s,col,lw){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=lw||3.5;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,s*0.42,-0.2,Math.PI*1.5);ctx.stroke();
  const a=Math.PI*1.5,px=x+Math.cos(a)*s*0.42,py=y+Math.sin(a)*s*0.42;ctx.beginPath();ctx.moveTo(px+s*0.26,py);ctx.lineTo(px-s*0.02,py-s*0.2);ctx.lineTo(px-s*0.02,py+s*0.2);ctx.closePath();ctx.fill();ctx.restore();}
function ag_lock(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=s*0.1;ctx.beginPath();ctx.arc(x,y-s*0.26,s*0.22,Math.PI,0);ctx.stroke();rr(ctx,x-s*0.34,y-s*0.28,s*0.68,s*0.54,s*0.1);ctx.fill();ctx.restore();}
function ag_warn(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=s*0.1;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x,y-s*0.44);ctx.lineTo(x+s*0.48,y+s*0.38);ctx.lineTo(x-s*0.48,y+s*0.38);ctx.closePath();ctx.stroke();
  ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y-s*0.14);ctx.lineTo(x,y+s*0.1);ctx.stroke();ctx.beginPath();ctx.arc(x,y+s*0.24,s*0.05,0,TAU);ctx.fill();ctx.restore();}
function ag_pen(ctx,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.rotate(-Math.PI/4);ctx.fillStyle=col;rr(ctx,-s*0.1,-s*0.42,s*0.2,s*0.62,s*0.05);ctx.fill();ctx.beginPath();ctx.moveTo(-s*0.1,s*0.24);ctx.lineTo(s*0.1,s*0.24);ctx.lineTo(0,s*0.44);ctx.closePath();ctx.fill();ctx.restore();}
// a paperclip, upright, its top at (x, y) and s tall, in a CSS colour: one wire, with a soft light along it
function ag_clip(ctx,x,y,s,col,lw){const wd=s*0.36,L=x-wd*0.5,R=x+wd*0.5,iL=x-wd*0.2,iR=x+wd*0.2,rt=(iR-L)/2,ct=(iR+L)/2;
  const P=()=>{ctx.beginPath();ctx.moveTo(iL,y+s*0.32);ctx.lineTo(iL,y+s*0.78);ctx.arc(x,y+s*0.78,wd*0.2,Math.PI,0,true);ctx.lineTo(iR,y+rt);
    ctx.arc(ct,y+rt,rt,0,Math.PI,true);ctx.lineTo(L,y+s-wd*0.5);ctx.arc(x,y+s-wd*0.5,wd*0.5,Math.PI,0,true);ctx.lineTo(R,y+s*0.22);};
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=col;ctx.lineWidth=lw||Math.max(2.5,s*0.07);P();ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.45)";ctx.lineWidth=(lw||Math.max(2.5,s*0.07))*0.35;ctx.translate(-0.8,-0.8);P();ctx.stroke();ctx.restore();}
function ag_arrowHead(ctx,x,y,ang,s,col){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(s,0);ctx.lineTo(-s*0.6,-s*0.62);ctx.lineTo(-s*0.6,s*0.62);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the kicker, the mark, the title and end cards */
function ag_kicker(ctx,num,title,o){o=o||{};const x=o.x||96,y=o.y||100,a=o.a==null?1:o.a;if(a<=0)return;
  ag_T(ctx,num,x,y,{w:500,size:28,f:"mono",col:o.dark?AG.visorLight:AG.violet,a});
  ag_T(ctx,String(title).toUpperCase(),x+ag_tw(ctx,num,{w:500,size:28,f:"mono"})+24,y,{w:700,size:28,ls:3.5,col:o.dark?[214,216,222]:AG.kick,a});}
// the series' mark: the loop at the heart of every film, an oak ring drawing itself round a small ceramic sphere
function ag_mark(ctx,cx,cy,r,p,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;const k=r/60;
  ag_ring(ctx,cx,cy,r,{p:ag_sine(p),from:-90,arrows:[30,150,270].filter(d=>(d+90)/360<ag_sine(p))});
  ag_model(ctx,cx,cy,r*0.46,{core:ag_in(p,0.5,0.5),t:p*3});ctx.restore();}
function ag_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle="rgba(240,238,233,"+clamp(a,0,1)+")";ctx.fillRect(0,0,W,H);}
function ag_title(ctx,S,t,t0,title,sub,line){const oA=ag_in(t,t0,0.8),tA=ag_in(t,t0+0.5,0.8);if(oA<=0)return;ag_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{ag_mark(ctx,960,330,62,(t-t0-0.4)/1.6,1);ag_T(ctx,title,960,520,{w:800,size:88,align:"center"});
    if(sub)ag_T(ctx,sub,960,600,{w:600,size:36,align:"center",col:AG.mut});withA(ctx,ag_in(t,t0+1.2,0.8),()=>ag_T(ctx,line,960,700,{w:700,size:28,ls:3,align:"center",col:AG.kick}));});}
// n: "Film 1 of 9"; series: the series' name (What an agent is, unless a later series of the module says its own)
function ag_end(ctx,S,t,t0,title,line,n,series){const oA=ag_in(t,t0,1.0),tA=ag_in(t,t0+0.6,0.9);if(oA<=0)return;ag_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)ag_T(ctx,line,960,360,{w:700,size:48,align:"center"});ag_mark(ctx,960,500,56,(t-t0-0.7)/1.4,1);ag_T(ctx,title,960,650,{w:800,size:44,align:"center"});
    ag_T(ctx,(n?n+" · ":"")+(series||"What an agent is")+" · Learning Data",960,708,{w:600,size:28,align:"center",col:AG.mut});});}

/* ===== A model, reasoning, hands and a loop: 1914, and the flight deck today =====
   The film's own places and pictures outside the lab, in the module's matte language, lit from the right as the room is (prefix ml_):
     mlSeine     the Seine at Bezons, just outside Paris, on 18 June 1914: a wide, slow river between low stone bridges, poplars on the far
                 bank, a grandstand under a striped awning across the water, and a judges' tent on the near bank (a place, painted once)
     mlSky       the same June sky over the water, closer, for the flying boat in flight (a place)
     mlDeck      today: an airliner's flight deck, seen from the side, daylight in its windows (a place)
     ml_boat     the flying boat side on (a biplane on a boat's hull, its engine between the wings driving a propeller behind it), from
                 photographs of the Curtiss flying boats of 1914; ml_boatBack the same from behind, for a wing that tips and comes back
     ml_crowd    spectators of 1914 seen from behind, along the near bank: boaters, dark suits, pale blouses, wide hats, two parasols
     ml_box      Sperry's stabiliser cut open: four gyroscopes, a valve, a piston, a lever to the wing's hinged edge; ml_level a spirit level
     ML_PEOPLE   the people of 1914 and today, for ag_person: Sperry, Cachin, a judge, two airline pilots
   Nobody's face is a likeness: the people of 1914 are dressed from photographs of the day, with the module's proportions. */

const ML_P={sky0:[192,208,220],sky1:[236,233,224],haze:[222,226,222],tree:[118,136,120],poplar:[104,124,108],stone:[204,196,180],stoneDk:[150,142,128],
  water0:[188,200,193],water1:[150,169,162],rip:[240,242,236],ripDk:[118,138,130],grass0:[164,170,128],grass1:[132,142,100],path:[214,204,182],
  timber:[216,198,168],timberDk:[150,128,100],cream:[242,234,216],rose:[186,134,130],linen:[236,228,206],linenDk:[196,186,160],hull:[126,88,58],hullHi:[176,132,92],
  strut:[150,118,86],engine:[62,62,66],brass:[192,158,94],brassDk:[132,104,56],suit:[52,52,58],skirt:[226,220,206]};

/* ---------------------------------------------------------------- the Seine at Bezons, 18 June 1914 (painted once) */
const ML_SEINE={hz:455,bank:782};
function ml_skyPaint(c,hz,o){o=o||{};let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(ML_P.sky0,1));g.addColorStop(0.7,rgba(mix(ML_P.sky0,ML_P.sky1,0.7),1));g.addColorStop(1,rgba(ML_P.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+2);
  // soft summer clouds: wide, low, out of focus, lit from the right; drawn small and blurred, then scaled up
  const k=0.25,cw=Math.ceil(W*k),ch=Math.ceil(hz*k)+2,b=mkCanvas(cw,ch),x=b.getContext("2d"),R=ag_rnd(o.seed||5);x.filter="blur(4px)";
  for(let i=0;i<(o.clouds||9);i++){const cx=R()*cw,cy=(60+R()*(hz*0.5))*k,w=(180+R()*360)*k,h=(26+R()*40)*k;
    const cg=x.createRadialGradient(cx+w*0.15,cy-h*0.2,1,cx,cy,w*0.6);cg.addColorStop(0,"rgba(255,255,252,0.75)");cg.addColorStop(1,"rgba(255,255,252,0)");
    x.fillStyle=cg;x.beginPath();x.ellipse(cx,cy,w*0.6,h,0,0,TAU);x.fill();}
  c.save();c.imageSmoothingQuality="high";c.drawImage(b,0,0,cw,ch,0,0,cw/k,ch/k);c.restore();
  // the sun is up and to the right: a warm glow there
  g=c.createRadialGradient(1700,-80,20,1700,-80,900);g.addColorStop(0,"rgba(255,250,236,0.55)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.fillRect(0,0,W,hz);}
// a tree line along the far bank: round crowns and tall poplars, hazy, lit from the right
function ml_treeLine(c,y0,hz,seed,o){o=o||{};const R=ag_rnd(seed),haze=o.haze==null?0.42:o.haze;
  const col=k=>rgba(mix(mix(ML_P.tree,ML_P.poplar,k),ML_P.haze,haze),1),hi=rgba(mix(mix(ML_P.tree,[200,214,180],0.4),ML_P.haze,haze),1);
  c.save();
  // a low band of round crowns
  for(let x=-40;x<W+40;){const w=50+R()*90,h=36+R()*46,cx=x+w/2,cy=hz-h*0.55;c.fillStyle=col(0.3);c.beginPath();c.ellipse(cx,cy,w*0.6,h*0.62,0,0,TAU);c.fill();
    c.fillStyle=hi;c.globalAlpha=0.45;c.beginPath();c.ellipse(cx+w*0.16,cy-h*0.16,w*0.32,h*0.34,0,0,TAU);c.fill();c.globalAlpha=1;x+=w*0.7;}
  // poplars: tall and narrow, in loose groups
  for(let x=20;x<W;){if(R()<0.62){const n=1+(R()*3|0);for(let k=0;k<n;k++){const px=x+k*(16+R()*10),h=(o.tall||110)+R()*70,w=14+R()*9,top=hz-h-(y0||0);
        c.fillStyle=col(1);c.beginPath();c.moveTo(px,top);c.bezierCurveTo(px+w*0.9,top+h*0.25,px+w*0.8,top+h*0.85,px+w*0.25,hz-4);c.lineTo(px-w*0.25,hz-4);
        c.bezierCurveTo(px-w*0.8,top+h*0.85,px-w*0.9,top+h*0.25,px,top);c.fill();
        c.fillStyle=hi;c.globalAlpha=0.4;c.beginPath();c.ellipse(px+w*0.22,top+h*0.45,w*0.25,h*0.35,0,0,TAU);c.fill();c.globalAlpha=1;}}
    x+=60+R()*130;}
  c.restore();}
// a low stone bridge far off: a level deck on arches, the arches' dark undersides reflected in the water
function ml_bridge(c,x0,x1,y,h,n){const span=(x1-x0)/n;c.save();
  c.fillStyle=rgba(mix(ML_P.stone,ML_P.haze,0.35),1);c.fillRect(x0,y-h*0.36,x1-x0,h*1.36);
  for(let i=0;i<n;i++){const ax=x0+span*(i+0.5),aw=span*0.38,ah=h*0.78;c.fillStyle=rgba(mix(ML_P.stoneDk,ML_P.haze,0.25),1);
    c.beginPath();c.moveTo(ax-aw,y+h);c.lineTo(ax-aw,y+h*0.62);c.quadraticCurveTo(ax-aw,y+h-ah,ax,y+h-ah);c.quadraticCurveTo(ax+aw,y+h-ah,ax+aw,y+h*0.62);c.lineTo(ax+aw,y+h);c.closePath();c.fill();}
  c.fillStyle=rgba(mix(ML_P.stone,[255,255,255],0.3),1);c.fillRect(x0,y-h*0.36,x1-x0,3);   // the parapet's lit edge
  c.fillStyle=rgba(mix(ML_P.stoneDk,ML_P.haze,0.3),0.5);c.fillRect(x0,y-h*0.36+3,x1-x0,2);
  c.restore();}
// the grandstand across the water: pale timber tiers under a striped awning, the crowd a soft speckle of hats and faces
function ml_grandstand(c,x0,x1,top,base,seed){const R=ag_rnd(seed),w=x1-x0,h=base-top;c.save();
  const aw=h*0.24;
  // the shade under the awning, the stand's back wall
  c.fillStyle=rgba(mix(ML_P.timberDk,ML_P.haze,0.42),1);c.fillRect(x0+4,top+aw,w-8,h-aw);
  // four rows of spectators, each row lower and nearer: hats and faces as soft dots, coats as a darker band
  for(let k=0;k<4;k++){const ry=top+aw+(h-aw)*(0.26+k*0.2);c.fillStyle=rgba(mix(ML_P.timber,ML_P.haze,0.3),1);c.fillRect(x0+4,ry+2,w-8,2.5);
    for(let x=x0+8;x<x1-6;x+=5.5+R()*3.5){const sk=R(),dy=(R()-0.5)*1.6;c.fillStyle=rgba(mix(sk<0.55?ML_P.suit:ML_P.skirt,ML_P.haze,0.35),1);c.fillRect(x-2,ry-5+dy,4.6,7);
      c.fillStyle=rgba(mix([216,184,156],ML_P.haze,0.3),1);c.beginPath();c.arc(x+0.3,ry-7.5+dy,1.9,0,TAU);c.fill();
      const ht=R();if(ht<0.75){c.fillStyle=rgba(mix(ht<0.4?[232,214,170]:ht<0.6?[60,60,66]:[238,234,226],ML_P.haze,0.3),1);c.fillRect(x-2.2,ry-10.5+dy,5,2.2);}}}
  // posts and the white rail at the front
  for(let i=0;i<=6;i++){const px=x0+4+(w-8)*i/6;c.fillStyle=rgba(mix(ML_P.timber,ML_P.haze,0.2),1);c.fillRect(px-2,top+aw,4,h-aw);}
  c.fillStyle=rgba(mix([244,242,236],ML_P.haze,0.2),1);c.fillRect(x0,base-9,w,3);c.fillRect(x0,base-3,w,3);
  // the awning's stripes, a little scalloped at the front, its shadow under it
  for(let i=0,n=Math.round(w/22);i<n;i++){const sx=x0+i*w/n;c.fillStyle=rgba(i%2?mix(ML_P.rose,ML_P.haze,0.25):mix(ML_P.cream,ML_P.haze,0.15),1);
    c.beginPath();c.moveTo(sx,top);c.lineTo(sx+w/n,top);c.lineTo(sx+w/n,top+aw);c.quadraticCurveTo(sx+w/n/2,top+aw+6,sx,top+aw);c.closePath();c.fill();}
  c.fillStyle="rgba(40,34,28,0.18)";c.fillRect(x0+4,top+aw+3,w-8,5);
  c.restore();}
// the river: pale and slow, the far bank's reflection, ripples that widen towards us, glints where the sun catches them
function ml_river(c,hz,bank,seed){const R=ag_rnd(seed);let g=c.createLinearGradient(0,hz,0,bank);g.addColorStop(0,rgba(ML_P.water0,1));g.addColorStop(1,rgba(ML_P.water1,1));
  c.fillStyle=g;c.fillRect(0,hz,W,bank-hz);
  // the far bank and its trees, mirrored and softened
  g=c.createLinearGradient(0,hz,0,hz+120);g.addColorStop(0,rgba(mix(ML_P.tree,ML_P.water0,0.45),0.7));g.addColorStop(1,rgba(ML_P.tree,0));
  c.fillStyle=g;c.fillRect(0,hz,W,120);
  // the sky's light on the water, brightest towards the sun on the right
  g=c.createRadialGradient(1500,hz+60,20,1500,hz+60,900);g.addColorStop(0,"rgba(255,252,242,0.32)");g.addColorStop(1,"rgba(255,252,242,0)");c.fillStyle=g;c.fillRect(0,hz,W,bank-hz);
  // ripples: thin lines, longer and further apart towards us
  c.save();c.lineCap="round";for(let i=0;i<520;i++){const u=Math.pow(R(),1.6),y=hz+6+u*(bank-hz-10),len=(10+R()*40)*(0.4+u*2.2),x=R()*W,lw=0.8+u*1.8;
    c.strokeStyle=R()<0.55?rgba(ML_P.rip,0.18+0.3*u):rgba(ML_P.ripDk,0.1+0.18*u);c.lineWidth=lw;c.beginPath();c.moveTo(x,y);c.lineTo(x+len,y);c.stroke();}
  for(let i=0;i<90;i++){const x=1000+R()*900,y=hz+20+R()*(bank-hz-60);c.fillStyle="rgba(255,253,244,"+(0.25+R()*0.4)+")";c.fillRect(x,y,2+R()*8,1.4);}
  c.restore();}
// the near bank: grass and a gravel path, the water's edge in soft shadow
function ml_nearBank(c,bank,seed){const R=ag_rnd(seed);let g=c.createLinearGradient(0,bank,0,H);g.addColorStop(0,rgba(ML_P.grass0,1));g.addColorStop(1,rgba(ML_P.grass1,1));
  c.fillStyle=g;c.beginPath();c.moveTo(0,bank+10);c.bezierCurveTo(500,bank-6,1200,bank+12,W,bank-4);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  c.strokeStyle="rgba(70,80,60,0.25)";c.lineWidth=3;c.beginPath();c.moveTo(0,bank+10);c.bezierCurveTo(500,bank-6,1200,bank+12,W,bank-4);c.stroke();
  // the path along the bank
  c.fillStyle=rgba(ML_P.path,0.85);c.beginPath();c.moveTo(0,bank+70);c.bezierCurveTo(600,bank+40,1300,bank+64,W,bank+44);c.lineTo(W,bank+96);c.bezierCurveTo(1300,bank+120,600,bank+100,0,bank+136);c.closePath();c.fill();
  // tufts of grass
  c.save();c.lineCap="round";for(let i=0;i<700;i++){const x=R()*W,y=bank+10+Math.pow(R(),0.8)*(H-bank-10),l=4+R()*10;c.strokeStyle=rgba(R()<0.5?mix(ML_P.grass1,[60,70,40],0.3):mix(ML_P.grass0,[230,226,180],0.3),0.35);
    c.lineWidth=1.2+R();c.beginPath();c.moveTo(x,y);c.lineTo(x+(R()-0.5)*4,y-l);c.stroke();}c.restore();}
// the judges' tent on the near bank: a white canopy on poles, a table with a cloth, three judges in dark coats seen from behind
function ml_tent(c,x,y,w,seed){const h=w*0.42,top=y-h;c.save();
  ag_floorShadow(c,x+w/2-10,y+6,w*0.62,16,0.3);
  // poles, the table and its cloth
  c.fillStyle=rgba(ML_P.timberDk,1);for(const px of [x+8,x+w-12])c.fillRect(px,top+20,5,h-20);
  c.fillStyle=rgba([238,236,228],1);c.fillRect(x+w*0.12,y-h*0.32,w*0.76,h*0.32);c.fillStyle="rgba(0,0,0,0.08)";c.fillRect(x+w*0.12,y-h*0.32,w*0.76,5);
  // three judges, from behind, a little in shade under the canopy
  for(let i=0;i<3;i++){const jx=x+w*(0.28+i*0.22),jy=y-h*0.3;ml_backFig(c,jx,jy,w*0.15,{coat:mix(ML_P.suit,[90,90,96],i*0.25),hat:i===1?"top":"bowler",len:0.75});}
  // the canopy: white canvas, scalloped, lit from the right
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"#E3E1DA");g.addColorStop(1,"#F8F6F0");c.fillStyle=g;
  c.beginPath();c.moveTo(x-10,top+30);c.lineTo(x+w*0.5,top-8);c.lineTo(x+w+10,top+30);c.lineTo(x+w+10,top+44);
  for(let k=0;k<8;k++){const sx=x+w+10-(w+20)*(k+1)/8;c.quadraticCurveTo(sx+(w+20)/16,top+58,sx,top+44);}c.closePath();c.fill();
  c.strokeStyle="rgba(120,110,96,0.35)";c.lineWidth=2;c.stroke();c.restore();}
/* a person seen from behind (u: the shoulders' width; (x, y) where the neck meets the shoulders), down to the frame's edge or o.len:
   a hat, the back of the head, the shoulders and arms in a coat or a blouse. o: coat (a colour), hat "boater", "bowler", "top", "wide"
   (a lady's wide hat, with o.ribbon), "cap" or "none"; lady (narrower shoulders, a high collar, hair up); turn (-1 to 1, the head turns
   a little to the right or left); up (0 to 1, rising, as someone who stands); parasol (a colour); len (how far the body goes down,
   in u; 3 by default). No raised arms: a hat waved in a hand showed two hats on one man, and an arm that jumps */
function ml_backFig(c,x,y,u,o){o=o||{};const coat=o.coat||ML_P.suit,turn=o.turn||0,lady=!!o.lady,len=(o.len||3)*u;y-=(o.up||0)*u*0.45;c.save();
  const sw=lady?0.43:0.5,dk=rgba(ag_dk(coat,0.3),1),lt=rgba(ag_lt(coat,0.2),1);
  const body=cc=>{cc.moveTo(x-u*0.11,y-u*0.04);cc.bezierCurveTo(x-u*0.3,y-u*0.01,x-u*sw,y+u*0.02,x-u*(sw+0.02),y+u*0.2);
    cc.bezierCurveTo(x-u*(sw+0.05),y+u*0.6,x-u*(sw+0.04),y+len*0.5,x-u*(sw-0.02),y+len);cc.lineTo(x+u*(sw-0.02),y+len);
    cc.bezierCurveTo(x+u*(sw+0.04),y+len*0.5,x+u*(sw+0.05),y+u*0.6,x+u*(sw+0.02),y+u*0.2);cc.bezierCurveTo(x+u*sw,y+u*0.02,x+u*0.3,y-u*0.01,x+u*0.11,y-u*0.04);cc.closePath();};
  let g=c.createLinearGradient(x-u*0.55,0,x+u*0.55,0);g.addColorStop(0,dk);g.addColorStop(0.62,rgba(coat,1));g.addColorStop(1,lt);
  c.fillStyle=g;c.beginPath();body(c);c.fill();
  // the arms against the body: a soft fold on each side, and the jacket's centre seam
  c.save();c.beginPath();body(c);c.clip();c.strokeStyle=rgba(ag_dk(coat,0.45),0.45);c.lineWidth=Math.max(1.2,u*0.02);c.lineCap="round";
  for(const s of [-1,1]){c.beginPath();c.moveTo(x+s*u*0.33,y+u*0.3);c.quadraticCurveTo(x+s*u*0.37,y+u*0.9,x+s*u*0.35,y+len);c.stroke();}
  if(!lady){c.strokeStyle=rgba(ag_dk(coat,0.4),0.3);c.beginPath();c.moveTo(x,y+u*0.08);c.lineTo(x,y+len);c.stroke();}
  c.fillStyle="rgba(255,250,236,0.1)";c.beginPath();c.ellipse(x+u*0.36,y+u*0.3,u*0.16,u*0.5,0,0,TAU);c.fill();c.restore();
  // the collar: a white shirt collar under a jacket's, or a lady's high collar
  c.fillStyle=lady?rgba(ag_lt(coat,0.35),1):"rgba(244,242,236,1)";c.beginPath();c.ellipse(x,y-u*0.02,u*0.13,u*0.05,0,0,TAU);c.fill();
  // the neck and the back of the head
  const hx=x+turn*u*0.05,hy=y-u*0.27,hr=u*0.17,sk=o.skin||[214,176,146],hair=o.hair||[70,52,40];
  c.fillStyle=rgba(ag_dk(sk,0.2),1);c.fillRect(x-u*0.065,y-u*0.15,u*0.13,u*0.14);
  c.fillStyle=rgba(sk,1);c.beginPath();c.ellipse(hx,hy,hr,hr*1.18,0,0,TAU);c.fill();
  for(const s of [-1,1]){const ex=hx+s*hr*0.98,show=s===Math.sign(turn)?1:0.6;c.fillStyle=rgba(ag_dk(sk,0.1),show);c.beginPath();c.ellipse(ex,hy+hr*0.08,hr*0.16,hr*0.3,0,0,TAU);c.fill();}
  if(turn){c.fillStyle=rgba(ag_lt(sk,0.08),1);c.beginPath();c.ellipse(hx+Math.sign(turn)*hr*0.62,hy+hr*0.3,hr*0.36*Math.abs(turn),hr*0.6,0,0,TAU);c.fill();}
  // hair: the whole back of the head, cut short and level at the nape, or up in a bun under a lady's hat
  c.fillStyle=rgba(hair,1);c.beginPath();c.moveTo(hx-hr*1.01,hy+hr*0.1);c.bezierCurveTo(hx-hr*1.08,hy-hr*1.1,hx+hr*1.08,hy-hr*1.1,hx+hr*1.01,hy+hr*0.1);
  c.bezierCurveTo(hx+hr*0.98,hy+hr*0.55,hx+hr*0.7,hy+(lady?0.98:0.86)*hr,hx+hr*0.36,hy+(lady?1.02:0.9)*hr);c.lineTo(hx-hr*0.36,hy+(lady?1.02:0.9)*hr);
  c.bezierCurveTo(hx-hr*0.7,hy+(lady?0.98:0.86)*hr,hx-hr*0.98,hy+hr*0.55,hx-hr*1.01,hy+hr*0.1);c.closePath();c.fill();
  c.strokeStyle=rgba(ag_lt(hair,0.25),0.25);c.lineWidth=Math.max(1,hr*0.05);c.beginPath();c.moveTo(hx-hr*0.4,hy-hr*0.6);c.quadraticCurveTo(hx-hr*0.2,hy+hr*0.2,hx-hr*0.3,hy+hr*0.8);c.stroke();
  if(lady){c.fillStyle=rgba(ag_dk(hair,0.15),1);c.beginPath();c.ellipse(hx,hy+hr*0.42,hr*0.5,hr*0.38,0,0,TAU);c.fill();}
  c.fillStyle="rgba(255,252,240,0.14)";c.beginPath();c.ellipse(hx+hr*0.45,hy-hr*0.3,hr*0.35,hr*0.5,0,0,TAU);c.fill();
  // the hat, a soft light on its right side
  const hat=o.hat||"boater",hc=o.hatC||(hat==="boater"?[224,204,158]:hat==="wide"?[234,228,214]:[40,40,46]);
  if(hat!=="none")ml_hat(c,hat,hx,hy-hr*0.58,hr,hc,o.ribbon);
  if(o.parasol){const pc=o.parasol,px=hx+u*0.34,py=hy-u*0.78,pr=u*0.56;c.strokeStyle=rgba([90,80,70],1);c.lineWidth=Math.max(1.5,u*0.025);c.beginPath();c.moveTo(px,py);c.lineTo(px-u*0.1,y+u*0.4);c.stroke();
    g=c.createLinearGradient(px-pr,0,px+pr,0);g.addColorStop(0,rgba(ag_dk(pc,0.14),1));g.addColorStop(1,rgba(ag_lt(pc,0.3),1));c.fillStyle=g;
    c.beginPath();c.moveTo(px-pr,py+pr*0.3);c.quadraticCurveTo(px-pr*0.82,py-pr*0.5,px,py-pr*0.56);c.quadraticCurveTo(px+pr*0.82,py-pr*0.5,px+pr,py+pr*0.3);
    for(let k=0;k<6;k++){const sx2=px+pr-(2*pr)*(k+1)/6;c.quadraticCurveTo(sx2+pr/6,py+pr*0.14,sx2,py+pr*0.3);}c.closePath();c.fill();
    c.strokeStyle="rgba(120,110,96,0.3)";c.lineWidth=1.2;for(let k=1;k<6;k++){const sx2=px+pr-(2*pr)*k/6;c.beginPath();c.moveTo(px,py-pr*0.54);c.lineTo(sx2,py+pr*0.3);c.stroke();}}
  c.restore();}
function ml_hat(c,hat,x,y,r,hc,ribbon){c.save();c.fillStyle=rgba(hc,1);
  if(hat==="boater"){c.beginPath();c.ellipse(x,y+r*0.12,r*1.55,r*0.26,0,0,TAU);c.fill();c.fillStyle=rgba(ag_dk(hc,0.06),1);c.fillRect(x-r*0.88,y-r*0.6,r*1.76,r*0.72);
    c.fillStyle=rgba(ag_lt(hc,0.2),1);c.beginPath();c.ellipse(x,y-r*0.6,r*0.88,r*0.14,0,0,TAU);c.fill();c.fillStyle=rgba(ribbon||[46,46,58],1);c.fillRect(x-r*0.88,y-r*0.12,r*1.76,r*0.22);}
  else if(hat==="bowler"){c.beginPath();c.ellipse(x,y+r*0.12,r*1.3,r*0.2,0,0,TAU);c.fill();c.beginPath();c.ellipse(x,y-r*0.05,r*0.92,r*0.95,0,Math.PI,TAU);c.fill();}
  else if(hat==="top"){c.beginPath();c.ellipse(x,y+r*0.12,r*1.3,r*0.2,0,0,TAU);c.fill();c.fillRect(x-r*0.8,y-r*1.35,r*1.6,r*1.45);}
  else if(hat==="wide"){c.beginPath();c.ellipse(x,y+r*0.2,r*2.3,r*0.5,0,0,TAU);c.fill();c.beginPath();c.ellipse(x,y-r*0.2,r*1.05,r*0.62,0,0,TAU);c.fill();
    c.fillStyle=rgba(ribbon||[150,110,120],1);c.fillRect(x-r*1.05,y-r*0.08,r*2.1,r*0.22);c.beginPath();c.ellipse(x+r*0.7,y-r*0.3,r*0.5,r*0.2,-0.5,0,TAU);c.fill();}
  else if(hat==="cap"){c.beginPath();c.ellipse(x,y+r*0.1,r*1.08,r*0.7,0,Math.PI,TAU);c.fill();}
  c.fillStyle="rgba(255,252,240,0.16)";c.beginPath();c.ellipse(x+r*0.5,y-r*0.2,r*0.5,r*0.25,0,0,TAU);c.fill();c.restore();}
AG_PLACES.mlSeine=c=>{const hz=ML_SEINE.hz,bank=ML_SEINE.bank;ml_skyPaint(c,hz,{seed:5,clouds:10});
  ml_treeLine(c,0,hz,11,{haze:0.5,tall:96});
  ml_bridge(c,-20,470,hz-34,30,5);ml_bridge(c,1580,1960,hz-30,26,4);
  ml_grandstand(c,1020,1420,hz-84,hz-2,23);
  ml_river(c,hz,bank,31);ml_nearBank(c,bank,41);
  ml_tent(c,150,bank+8,420,7);
  // the far bank's edge, a thin line of shade where the water meets it
  c.fillStyle="rgba(80,96,84,0.28)";c.fillRect(0,hz-1,W,3);};
AG_PLACES.mlSky=c=>{const hz=700;ml_skyPaint(c,hz,{seed:9,clouds:12});ml_treeLine(c,0,hz,13,{haze:0.62,tall:70});ml_river(c,hz,H,37);};

/* ---------------------------------------------------------------- the crowd along the near bank, from behind (drawn live: heads turn, people stand) */
const ML_CROWD=(()=>{const R=ag_rnd(19),out=[];const spec=[["boater",0],["wide",1],["bowler",0],["boater",0],["wide",1],["boater",0],["bowler",0],["wide",1],["boater",0],["cap",0]],
    coats=[ML_P.suit,[72,68,62],[86,82,94],[64,66,72]],blouses=[[234,230,220],[224,218,204],[236,232,236]];
  spec.forEach((sp,i)=>{const lady=!!sp[1],x=640+i*142+(R()-0.5)*40,u=(lady?190:220)+R()*30;
    out.push({x,y:910+R()*40-(lady?0:12),u,hat:sp[0],lady,coat:lady?blouses[(R()*3)|0]:coats[(R()*4)|0],ribbon:lady?(R()<0.5?[150,112,122]:[118,128,150]):[44,44,56],
      hair:R()<0.5?[58,42,32]:[104,76,50],skin:mix([228,190,160],[180,132,100],R()*0.8),parasol:i===1?[242,236,222]:i===7?[228,222,234]:null,ph:R()*TAU});});
  return out.sort((a,b)=>a.u-b.u);})();
function ml_crowd(ctx,t,o){o=o||{};for(const p of ML_CROWD){const turn=(o.turn||0)*Math.sin(p.ph+1)*0.9,up=(o.up||0)*(0.6+0.4*Math.sin(p.ph*3));
  ml_backFig(ctx,p.x+Math.sin(t*0.7+p.ph)*1.5,p.y,p.u,{coat:p.coat,hat:p.hat,lady:p.lady,ribbon:p.ribbon,hair:p.hair,skin:p.skin,parasol:p.parasol,turn,up});}}

/* ---------------------------------------------------------------- the flying boat, side on
   ml_boat(ctx, x, y, s, o): the hull's top at the wings is (x, y), s = 1 a hull 380 px long, flying to the right (o.flip: to the left).
   o.t (the propeller turns), o.pitch (radians, nose up), o.who: who sits in the cockpit, [{who, hands}] near first (hands 0 to 1 raises
   both arms, open), o.shadow (the water's y, for its shadow and reflection), o.a. Drawn from photographs of the Curtiss flying boats of
   1914: a varnished wooden hull with a step under it, linen wings on wooden struts, the engine between them driving a propeller behind,
   a fin and a tailplane at the end of the hull, a float under each wing's tip. */
function ml_boat(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const P=ML_P,t=o.t||0;ctx.save();ctx.globalAlpha*=a;
  if(o.shadow!=null){const sy=o.shadow;ag_floorShadow(ctx,x-10*s,sy,150*s,7*s,0.1*a);
    // its reflection: a soft, darker smear on the water under it
    ctx.save();ctx.globalAlpha*=0.18;ctx.fillStyle=rgba(ag_dk(P.hull,0.3),1);ctx.beginPath();ctx.ellipse(x,sy+8*s,170*s,6*s,0,0,TAU);ctx.fill();ctx.restore();}
  ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.rotate(-(o.pitch||0));
  const lw=1.4/s;ctx.lineJoin="round";ctx.lineCap="round";
  // the far float and the far struts, behind everything
  const wood=rgba(P.strut,1),linen=rgba(P.linen,1),linenDk=rgba(P.linenDk,1);
  // the tailplane's far half and the fin's shadow side come first
  // the upper and lower wings, edge on: a thin cambered slab each
  const wing=(y0,x0,x1,th)=>{ctx.beginPath();ctx.moveTo(x1,y0);ctx.quadraticCurveTo((x0+x1)/2,y0-th*1.4,x0,y0+th*0.2);ctx.lineTo(x0,y0+th*0.8);ctx.quadraticCurveTo((x0+x1)/2,y0+th*0.2,x1,y0+th*0.7);ctx.closePath();
    const g=ctx.createLinearGradient(0,y0-th,0,y0+th);g.addColorStop(0,rgba(ag_lt(P.linen,0.3),1));g.addColorStop(1,linenDk);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=rgba(ag_dk(P.linenDk,0.2),0.6);ctx.lineWidth=lw;ctx.stroke();};
  // struts between the wings (two pairs seen side on), with bracing wires
  ctx.strokeStyle=wood;ctx.lineWidth=2.6;for(const sx of [-38,46]){ctx.beginPath();ctx.moveTo(sx,-6);ctx.lineTo(sx-2,-76);ctx.stroke();}
  ctx.strokeStyle="rgba(70,64,58,0.5)";ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(-38,-8);ctx.lineTo(44,-74);ctx.moveTo(46,-8);ctx.lineTo(-40,-74);ctx.stroke();
  // the engine, high between the wings on its bearers: a long block of cylinders, its radiator at the front; the propeller turns behind it
  ctx.strokeStyle="rgba(58,56,56,0.9)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,-46);ctx.lineTo(-20,-6);ctx.moveTo(10,-46);ctx.lineTo(18,-6);ctx.moveTo(-12,-46);ctx.lineTo(18,-6);ctx.stroke();
  ag_soft(ctx,c=>ag_rect(c,-22,-66,40,20,4),P.engine,[150,150,156],8,-64,30,"rgba(0,0,0,0.4)",5);
  ctx.fillStyle="rgba(150,150,156,0.55)";for(let k=0;k<4;k++)ctx.fillRect(-18+k*9,-70,6,4);
  ag_soft(ctx,c=>ag_rect(c,18,-72,9,30,2),[170,170,164],[226,226,220],24,-68,18,null);
  ctx.strokeStyle="rgba(110,110,104,0.5)";ctx.lineWidth=0.8;for(let k=0;k<6;k++){ctx.beginPath();ctx.moveTo(19,-70+k*5);ctx.lineTo(26,-70+k*5);ctx.stroke();}
  const pr=36,ph=t*28;ctx.save();ctx.translate(-30,-56);ctx.fillStyle="rgba(140,104,66,0.16)";ctx.beginPath();ctx.ellipse(0,0,4,pr,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(120,88,56,0.45)";const bl=Math.sin(ph)*pr;ctx.beginPath();ctx.ellipse(0,bl*0.5,2.4,Math.abs(bl)*0.5+2,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([70,70,74],1);ctx.beginPath();ctx.arc(0,0,3,0,TAU);ctx.fill();ctx.restore();
  wing(-80,-58,66,6);
  // the hull: a deep curved bow, a flat keel to the step, then tapering up to the tail; varnished wood, lit from above and the right
  const hull=c=>{c.moveTo(186,8);c.bezierCurveTo(194,2,196,-3,190,-6);c.lineTo(110,-7);c.lineTo(-40,-5);c.bezierCurveTo(-100,-6,-150,-10,-196,-14);c.lineTo(-200,-6);
    c.bezierCurveTo(-160,-1,-80,10,6,20);c.lineTo(8,28);c.lineTo(128,32);c.bezierCurveTo(160,31,182,22,186,8);c.closePath();};
  ag_soft(ctx,hull,P.hull,P.hullHi,120,-6,120,"rgba(30,16,6,0.45)",10,0.6);
  ctx.strokeStyle=rgba(ag_lt(P.hullHi,0.3),0.8);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(188,-5);ctx.lineTo(110,-6);ctx.lineTo(-40,-4);ctx.bezierCurveTo(-100,-5,-150,-9,-194,-13);ctx.stroke();
  ctx.strokeStyle="rgba(40,24,12,0.35)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(178,14);ctx.lineTo(8,12);ctx.bezierCurveTo(-60,6,-130,-2,-196,-8);ctx.stroke();   // the chine
  // the fin and rudder, the tailplane edge on, and its struts
  ag_soft(ctx,c=>{c.moveTo(-162,-11);c.bezierCurveTo(-168,-32,-176,-48,-188,-54);c.lineTo(-204,-52);c.lineTo(-202,-12);c.closePath();},P.linen,[255,255,250],-186,-40,34,"rgba(80,70,50,0.35)",5);
  ctx.strokeStyle=rgba(P.linenDk,0.9);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-193,-52);ctx.lineTo(-192,-12);ctx.stroke();
  wing(-32,-222,-150,4.5);
  ctx.strokeStyle=wood;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-158,-30);ctx.lineTo(-150,-10);ctx.moveTo(-214,-30);ctx.lineTo(-200,-11);ctx.stroke();
  // the lower wing, resting on the hull, and the near float under its tip
  wing(-6,-50,60,5);
  ctx.strokeStyle=wood;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(8,-2);ctx.lineTo(14,12);ctx.moveTo(30,-2);ctx.lineTo(28,12);ctx.stroke();
  ag_soft(ctx,c=>{c.moveTo(-2,12);c.lineTo(40,12);c.bezierCurveTo(48,12,50,18,44,22);c.lineTo(4,22);c.bezierCurveTo(-2,20,-4,14,-2,12);c.closePath();},P.linen,[255,255,250],30,12,30,"rgba(80,70,50,0.35)",5);
  // the cockpit, ahead of the wings: who sits in it, the near one in front
  const who=o.who||[];for(let i=who.length-1;i>=0;i--){const w=who[i],hx=128-i*14,hy=-14-i*2;ml_seated(ctx,hx,hy,w,t,i);}
  // the cockpit's coaming over their waists
  ag_soft(ctx,c=>{c.moveTo(96,-7);c.bezierCurveTo(110,-12,146,-12,156,-6);c.lineTo(156,-3);c.lineTo(96,-3);c.closePath();},ag_dk(P.hull,0.25),P.hullHi,140,-8,30,null);
  ctx.restore();}
// a person in the cockpit, side on and small: head and shoulders, a cap, and arms that rise (hands 0 to 1)
function ml_seated(ctx,x,y,w,t,i){const sp=w.who||{},k=w.hands||0,sk=sp.skin||[218,180,148],top=sp.top&&sp.top.c||ML_P.suit,cap=sp.cap||[70,50,36];ctx.save();
  // the arms raised, open hands, elbows soft
  if(k>0){ctx.lineCap="round";ctx.lineJoin="round";for(const sd of [-1,1]){const sx=x+sd*4,sy=y+5,ex=x+sd*lerp(6,9,k)+3,ey=y+lerp(4,-12,k),hx=x+sd*lerp(5,5,k)+5,hy=y+lerp(2,-27,k);
      ctx.strokeStyle=rgba(ag_dk(top,sd<0?0.25:0),1);ctx.lineWidth=3.6;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.lineTo(hx,hy+3);ctx.stroke();
      ctx.fillStyle=rgba(sk,1);ctx.beginPath();ctx.ellipse(hx+0.5,hy,2.1,3.2,0.15*sd,0,TAU);ctx.fill();}}
  // shoulders and the head
  ctx.fillStyle=rgba(top,1);ctx.beginPath();ctx.ellipse(x,y+8,9,7,0,Math.PI,TAU);ctx.fill();ctx.fillRect(x-9,y+8,18,6);
  ctx.fillStyle=rgba(sk,1);ctx.beginPath();ctx.ellipse(x+1,y-4,6,7,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(cap,1);ctx.beginPath();ctx.ellipse(x,y-7,6.6,5.2,0,Math.PI,TAU);ctx.fill();
  if(sp.goggles){ctx.fillStyle="rgba(200,210,214,0.9)";ctx.beginPath();ctx.ellipse(x+3,y-10,2.4,1.6,0,0,TAU);ctx.fill();}
  else{ctx.fillRect(x-1,y-8,9,2);}
  ctx.restore();}

/* ---------------------------------------------------------------- the flying boat from behind
   ml_boatBack(ctx, x, y, s, o): the middle of the lower wing at (x, y), s = 1 a lower wing 800 px across; o.roll (radians, the right
   wing down), o.t (the propeller turns), o.out: a person standing out on the right lower wing (o.out.u, the way out from 0 to 1 along
   the wing, o.out.spec), o.heads (two heads in the cockpit, seen over the hull), o.a */
function ml_boatBack(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const P=ML_P,t=o.t||0;ctx.save();ctx.globalAlpha*=a;
  ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(o.roll||0);ctx.lineCap="round";ctx.lineJoin="round";
  const slab=(x0,x1,y0,th,col)=>{const g=ctx.createLinearGradient(0,y0,0,y0+th);g.addColorStop(0,rgba(ag_lt(col,0.3),1));g.addColorStop(1,rgba(ag_dk(col,0.12),1));
    ctx.fillStyle=g;ctx.beginPath();ag_rect(ctx,x0,y0,x1-x0,th,th/2);ctx.fill();ctx.strokeStyle=rgba(ag_dk(col,0.3),0.5);ctx.lineWidth=1.2;ctx.stroke();};
  // the wings' struts and bracing wires, then the wings
  const wood=rgba(P.strut,1);ctx.strokeStyle="rgba(70,64,58,0.45)";ctx.lineWidth=1;
  for(const sd of [-1,1]){for(const [x0,x1] of [[36,130],[130,280],[280,400]]){ctx.beginPath();ctx.moveTo(sd*x0,0);ctx.lineTo(sd*x1,-112);ctx.moveTo(sd*x1,0);ctx.lineTo(sd*x0,-112);ctx.stroke();}}
  ctx.strokeStyle=wood;ctx.lineWidth=5;for(const sd of [-1,1])for(const sx of [130,280,400]){ctx.beginPath();ctx.moveTo(sd*sx,2);ctx.lineTo(sd*sx,-110);ctx.stroke();}
  ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*400,-4);ctx.lineTo(sd*470,-108);ctx.stroke();}
  slab(-480,480,-120,11,P.linen);
  // the engine high between the wings, and the propeller's disc in front of it (it pushes, so it's at the back, towards us)
  ag_soft(ctx,c=>ag_rect(c,-30,-104,60,40,6),P.engine,[150,150,156],14,-100,40,"rgba(0,0,0,0.45)",6);
  ctx.strokeStyle="rgba(58,56,56,0.9)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-22,-66);ctx.lineTo(-34,0);ctx.moveTo(22,-66);ctx.lineTo(34,0);ctx.stroke();
  // two heads in the cockpit, far off beyond the engine, over the hull's deck
  const side=o.out&&o.out.side||1;if(o.heads){for(const hx of [-16,16]){if(o.out&&hx*side>0)continue;ctx.fillStyle=rgba([84,60,42],1);ctx.beginPath();ctx.ellipse(hx,-14,8,9,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(ML_P.suit,1);ctx.beginPath();ctx.ellipse(hx,-2,12,7,0,Math.PI,TAU);ctx.fill();}}
  slab(-400,400,-4,10,P.linen);
  // the floats under the wings' tips
  for(const sd of [-1,1]){ctx.strokeStyle=wood;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sd*372,6);ctx.lineTo(sd*380,22);ctx.moveTo(sd*392,6);ctx.lineTo(sd*384,22);ctx.stroke();
    ag_soft(ctx,c=>ag_rect(c,sd*382-16,20,32,18,8),P.linen,[255,255,250],sd*382+6,22,20,"rgba(80,70,50,0.35)",5);}
  // the hull under the wing, seen from behind: a rounded V, varnished wood
  ag_soft(ctx,c=>{c.moveTo(-44,6);c.lineTo(44,6);c.bezierCurveTo(46,30,30,58,0,70);c.bezierCurveTo(-30,58,-46,30,-44,6);c.closePath();},P.hull,P.hullHi,24,14,60,"rgba(30,16,6,0.45)",10,0.5);
  // the propeller's disc, a soft blur with one blade caught, then the tail: the fin and the tailplane, nearest to us
  ctx.save();ctx.translate(0,-84);ctx.fillStyle="rgba(150,116,76,0.13)";ctx.beginPath();ctx.arc(0,0,86,0,TAU);ctx.fill();
  const ang=t*26;ctx.rotate(ang);ctx.fillStyle="rgba(120,88,56,0.35)";ctx.beginPath();ctx.ellipse(0,0,84,6,0,0,TAU);ctx.fill();ctx.restore();
  ctx.fillStyle=rgba([70,70,74],1);ctx.beginPath();ctx.arc(0,-84,6,0,TAU);ctx.fill();
  ag_soft(ctx,c=>{c.moveTo(-6,40);c.lineTo(-4,-54);c.quadraticCurveTo(0,-60,4,-54);c.lineTo(6,40);c.closePath();},P.linen,[255,255,250],4,-30,40,"rgba(80,70,50,0.35)",4);
  slab(-118,118,-22,8,P.linen);
  ctx.strokeStyle=wood;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-70,-14);ctx.lineTo(-10,34);ctx.moveTo(70,-14);ctx.lineTo(10,34);ctx.stroke();
  // someone out on a lower wing (the right; o.out.side -1 the left), from behind, a hand on the strut
  if(o.out){ctx.save();ctx.scale(side,1);const u=34,px=lerp(54,168,o.out.u||0),py=-104,sp=o.out.spec||{},tr=rgba(ag_dk(sp.coat||P.suit,0.2),1),step=Math.sin((o.out.u||0)*TAU*3)*4;
    ctx.strokeStyle=tr;ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(px-7,py+u*1.5);ctx.lineTo(px-9-step,-4);ctx.moveTo(px+7,py+u*1.5);ctx.lineTo(px+9+step,-4);ctx.stroke();
    ctx.fillStyle=rgba([40,34,30],1);for(const fx of [px-10-step,px+10+step]){ctx.beginPath();ctx.ellipse(fx,-4,8,4,0,0,TAU);ctx.fill();}
    ml_backFig(ctx,px,py,u,Object.assign({len:1.62},sp));
    ctx.strokeStyle=rgba(ag_dk((o.out.spec&&o.out.spec.coat)||P.suit,0.1),1);ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(px-u*0.42,py+u*0.25);ctx.lineTo(130+2,py+u*0.1);ctx.stroke();
    ctx.fillStyle=rgba((o.out.spec&&o.out.spec.skin)||[214,176,146],1);ctx.beginPath();ctx.arc(132,py+u*0.1,5,0,TAU);ctx.fill();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the people, for ag_person (dressed from photographs of the day, never likenesses) */
// a leather flying cap over the skull and ears, with a chin strap; goggles pushed up on the forehead
function ml_flyingCap(col,gog){return (c,P)=>{const g=c.createLinearGradient(220,300,390,420);g.addColorStop(0,rgba(ag_dk(col,0.25),1));g.addColorStop(1,rgba(ag_lt(col,0.2),1));
  const cap=cc=>{cc.moveTo(386,392);cc.bezierCurveTo(392,330,350,292,292,290);cc.bezierCurveTo(240,290,206,330,204,384);cc.bezierCurveTo(204,420,214,446,232,462);
    cc.bezierCurveTo(246,476,268,480,290,478);cc.bezierCurveTo(300,462,302,440,300,420);cc.bezierCurveTo(318,404,350,394,386,392);cc.closePath();};
  ag_soft(c,cap,col,ag_lt(col,0.35),340,320,120,"rgba(0,0,0,0.45)",14);c.save();ag_shape(c,cap);c.clip();
  c.strokeStyle=rgba(ag_dk(col,0.4),0.55);c.lineWidth=2.4;c.beginPath();c.moveTo(300,292);c.quadraticCurveTo(270,370,262,470);c.stroke();
  c.beginPath();c.moveTo(384,394);c.quadraticCurveTo(330,398,300,422);c.stroke();c.restore();
  c.strokeStyle=rgba(ag_dk(col,0.35),1);c.lineWidth=5;c.beginPath();c.moveTo(286,478);c.quadraticCurveTo(320,520,352,524);c.stroke();   // the chin strap
  if(gog){c.strokeStyle="rgba(40,36,34,0.9)";c.lineWidth=9;c.beginPath();c.moveTo(206,356);c.quadraticCurveTo(300,334,388,352);c.stroke();
    for(const [gx,gy,rx] of [[336,346,20],[376,350,12]]){c.fillStyle="rgba(60,56,52,1)";c.beginPath();c.ellipse(gx,gy,rx+4,17,0,0,TAU);c.fill();
      const lg=c.createLinearGradient(gx-rx,gy-14,gx+rx,gy+14);lg.addColorStop(0,"rgba(214,226,230,1)");lg.addColorStop(1,"rgba(150,170,178,1)");c.fillStyle=lg;c.beginPath();c.ellipse(gx,gy,rx,13,0,0,TAU);c.fill();
      c.fillStyle="rgba(255,255,255,0.7)";c.beginPath();c.ellipse(gx+rx*0.3,gy-5,rx*0.3,3,0,0,TAU);c.fill();}}};}
// a flat cloth cap, its peak over the brow
function ml_flatCap(col){return (c,P)=>{const cap=cc=>{cc.moveTo(392,384);cc.bezierCurveTo(400,368,390,350,370,338);cc.bezierCurveTo(340,300,250,292,214,330);cc.bezierCurveTo(200,346,200,368,208,386);
    cc.bezierCurveTo(260,378,320,376,392,384);cc.closePath();};ag_soft(c,cap,col,ag_lt(col,0.3),340,320,120,"rgba(0,0,0,0.4)",12);
  ag_soft(c,cc=>{cc.moveTo(330,380);cc.bezierCurveTo(360,372,400,372,420,386);cc.bezierCurveTo(400,394,360,394,330,390);cc.closePath();},ag_dk(col,0.15),ag_lt(col,0.2),380,380,40,null);};}
// a bowler hat, worn on the head: its brim just above the brow and the ear
function ml_bowler(col){return (c,P)=>{c.save();c.translate(0,24);ag_soft(c,cc=>{cc.ellipse(296,330,124,20,-0.06,0,TAU);},col,ag_lt(col,0.3),340,324,90,null);
  ag_soft(c,cc=>{cc.moveTo(212,330);cc.bezierCurveTo(212,236,380,236,382,326);cc.closePath();},col,ag_lt(col,0.35),330,270,90,"rgba(0,0,0,0.4)",10);c.restore();};}
// a pilot's epaulettes today: dark, with gold bars
function ml_epaulettes(c,P){for(const [x,y,w,r] of [[150,604,74,-0.42],[396,622,56,0.36]]){c.save();c.translate(x,y);c.rotate(r);ag_soft(c,cc=>ag_rect(cc,-w/2,-11,w,22,5),[38,42,54],[90,96,110],0,-8,30,null);
  c.fillStyle="rgba(214,182,110,0.95)";for(let k=0;k<3;k++)c.fillRect(-w/2+10+k*(w-20)/3,-7,5,14);c.restore();}}
const ML_PEOPLE={
  sperry:{name:"Lawrence Sperry",key:"ml-sperry",skin:[232,198,170],hair:{style:"side",c:[74,52,36]},top:{kind:"suit",c:[70,62,56],inner:[236,232,222],tie:[60,54,62]},hat:{paint:ml_flyingCap([104,72,48],true)},breath:0.3},
  cachin:{name:"Emil Cachin",key:"ml-cachin",skin:[220,182,150],hair:{style:"cropped",c:[60,46,38]},top:{kind:"overshirt",c:[104,100,96],inner:[220,214,200]},hat:{paint:ml_flatCap([84,82,80])},breath:0.27},
  judge:{name:"A judge",key:"ml-judge",skin:[230,196,170],hair:{style:"cropped",c:[150,146,140]},beard:[156,150,146],top:{kind:"suit",c:[46,46,52],inner:[240,240,236],tie:[40,40,46]},hat:{paint:ml_bowler([36,36,40])},breath:0.24},
  captain:{name:"Captain",key:"ml-captain",skin:[176,124,92],hair:{style:"bun",c:[30,24,24]},top:{kind:"shirt",c:[240,242,244],paint:ml_epaulettes},breath:0.28},
  officer:{name:"First officer",key:"ml-officer",skin:[232,198,170],hair:{style:"cropped",c:[120,112,108]},top:{kind:"shirt",c:[238,240,242],paint:ml_epaulettes},breath:0.3}
};

/* ---------------------------------------------------------------- Sperry's box, cut open
   ml_box(ctx, x, y, s, o): the case's middle at (x, y); s = 1 a case 560 px wide. In it, two pairs of gyroscopes, brass wheels spinning
   in their rings, their axes (graphite, with an arrow) always upright, however the case tips (o.tilt, radians, clockwise); between the
   pairs, room for something more (o.empty 0 to 1: a dashed violet circle, empty, where a model would go). On the lid, a spirit level
   (o.level 0 to 1), its bubble running to the high end as the case tips. A lever from the gyroscopes opens a valve on the case's side
   (o.air 0 to 1: a puff, and air running down the hose) and drives a piston (o.push 0 to 1), whose rod turns a wing's hinged edge; the
   wing is drawn side on, right of the box, and doesn't tip (o.chain 0 to 1 shows the hose, the piston and the wing). o.t spins the
   wheels; o.hands (0 to 1) lights the piston and its rod blue; o.check (0 to 1) lights the gyroscopes' rings in o.checkCol; o.plane
   (0 to 1) a small aeroplane from behind above the lid, tipping with the case. Returns where its parts are in the frame, for labels. */
function ml_box(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a,P=ML_P,t=o.t||0,tilt=o.tilt||0,c0=Math.cos(tilt),s0=Math.sin(tilt);
  const Wp=(lx,ly)=>[x+s*(lx*c0-ly*s0),y+s*(lx*s0+ly*c0)],Fp=(lx,ly)=>[x+s*lx,y+s*ly],GY=[[-176,-66],[-176,66],[176,-66],[176,66]];
  const push=clamp(o.push||0,0,1),flap=o.flap==null?-0.34*push:o.flap,chain=o.chain==null?1:o.chain,hk=o.hands||0;
  const out={gyros:GY.map(p=>Wp(p[0],p[1])),mid:Wp(0,0),r:s*92,level:Wp(0,-190),top:Wp(0,-160),plane:Wp(0,-268),valve:Wp(308,96),
    piston:Fp(630,172),edge:Fp(868,96),wing:Fp(720,86),left:Wp(-280,0),right:Wp(280,0),bottom:Wp(0,160)};
  if(a<=0)return out;
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";
  const ink="#4A4744",metal=[118,118,122],blueM=mix(metal,AG.blue,hk);
  // the wing, side on, its hinged edge, the piston and the hose (they don't tip: they're drawn as a diagram beside the box)
  if(chain>0){ctx.save();ctx.globalAlpha*=chain;ctx.translate(x,y);ctx.scale(s,s);
    // the hose, from the valve on the case's side, sagging, to the piston
    const v=[(308+22)*c0-(104)*s0,(308+22)*s0+(104)*c0],hose=[v[0],v[1],v[0]+70,v[1]+120,470,196,560,172];
    ctx.strokeStyle="rgba(70,68,66,1)";ctx.lineWidth=9;ag_bzPath(ctx,hose,0,1);ctx.stroke();
    ctx.strokeStyle="rgba(150,148,146,0.6)";ctx.lineWidth=3;ag_bzPath(ctx,hose,0.02,0.98);ctx.stroke();
    if((o.air||0)>0){for(let k=0;k<5;k++){const u=clamp(o.air*1.3-k*0.12,0,1);if(u<=0||u>=1)continue;const q=ag_bz(hose,u);
      ctx.fillStyle="rgba(248,250,252,"+(0.95*Math.sin(u*Math.PI))+")";ctx.beginPath();ctx.arc(q[0],q[1],5,0,TAU);ctx.fill();}}
    // the wing's section: rounded at the front, thin at the back, its last part on a hinge
    const wing=c=>{c.moveTo(600,98);c.bezierCurveTo(600,74,626,68,664,68);c.bezierCurveTo(730,68,790,82,824,90);c.lineTo(824,104);
      c.bezierCurveTo(780,106,700,112,650,112);c.bezierCurveTo(618,112,600,108,600,98);c.closePath();};
    ag_soft(ctx,wing,P.linenDk,[255,252,240],700,72,140,"rgba(80,70,50,0.35)",8,0.8);ctx.strokeStyle="rgba(110,98,76,0.6)";ctx.lineWidth=2;ag_shape(ctx,wing);ctx.stroke();
    ctx.save();ctx.translate(826,97);ctx.rotate(flap);
    const edge=c=>{c.moveTo(0,-7);c.lineTo(92,-1.5);c.quadraticCurveTo(95,0,92,1.5);c.lineTo(0,7);c.closePath();};
    ag_soft(ctx,edge,mix(P.linenDk,blueM,hk*0.35),[255,252,240],40,-4,60,"rgba(80,70,50,0.35)",4,0.8);ctx.strokeStyle="rgba(110,98,76,0.6)";ctx.lineWidth=2;ag_shape(ctx,edge);ctx.stroke();
    ctx.strokeStyle=rgba(blueM,1);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,75);ctx.stroke();   // the horn under the hinge
    ctx.restore();ctx.fillStyle=ink;ctx.beginPath();ctx.arc(826,97,6,0,TAU);ctx.fill();
    const hx=826-75*Math.sin(flap),hy=97+75*Math.cos(flap);
    // the piston: a cylinder on its bracket, its rod out to the horn
    ctx.fillStyle="rgba(90,88,86,1)";ctx.beginPath();ag_rect(ctx,590,194,80,14,4);ctx.fill();
    ag_soft(ctx,c=>ag_rect(c,560,150,140,44,12),blueM,[236,242,246],660,154,90,"rgba(0,0,0,0.3)",8,0.55);
    ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=2;for(const dx of [586,674]){ctx.beginPath();ctx.moveTo(dx,154);ctx.lineTo(dx,190);ctx.stroke();}
    ctx.strokeStyle=rgba(mix([150,150,154],AG.blue,hk),1);ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(700,172);ctx.lineTo(hx,hy);ctx.stroke();
    ctx.fillStyle=ink;ctx.beginPath();ctx.arc(hx,hy,6,0,TAU);ctx.fill();
    if(hk>0){ctx.save();ctx.shadowColor=rgba(AG.blue,0.6*hk);ctx.shadowBlur=18;ctx.strokeStyle=rgba(AG.blue,0.9*hk);ctx.lineWidth=3;ctx.beginPath();ag_rect(ctx,560,150,140,44,12);ctx.stroke();ctx.restore();}
    ctx.restore();}
  // the case, tipping: the small aeroplane above it, the level on its lid, the box with its front cut away, its brass corners, the valve
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(tilt);
  if((o.plane||0)>0){ctx.save();ctx.globalAlpha*=o.plane;ml_boatBack(ctx,0,-268,0.3,{t});ctx.restore();}
  if((o.level||0)>0){ctx.save();ctx.globalAlpha*=o.level;ctx.fillStyle="rgba(120,90,50,1)";for(const lx of [-84,84]){ctx.beginPath();ag_rect(ctx,lx-10,-170,20,14,3);ctx.fill();}
    ml_level(ctx,0,-192,236,clamp(-tilt*7,-1,1),1);ctx.restore();}
  const caseP=c=>ag_rect(c,-280,-160,560,320,20),inner=c=>ag_rect(c,-254,-134,508,268,10);
  ag_soft(ctx,caseP,[136,92,60],[206,160,116],170,-150,330,"rgba(30,14,4,0.5)",18,0.5);
  ctx.strokeStyle="rgba(255,230,200,0.16)";ctx.lineWidth=2;for(const yy of [-148,-142,146,150]){ctx.beginPath();ctx.moveTo(-262,yy);ctx.quadraticCurveTo(0,yy+(yy<0?3:-3),262,yy);ctx.stroke();}
  ag_soft(ctx,inner,[234,226,210],[252,249,242],150,-100,330,null);ag_inner(ctx,inner,"rgba(60,40,20,0.42)",26,-8,10);
  for(const [cx,cy] of [[-280,-160],[280,-160],[-280,160],[280,160]]){ag_soft(ctx,c=>c.arc(cx,cy,15,0,TAU),P.brass,[255,240,200],cx+5,cy-6,14,"rgba(60,40,10,0.4)",4,0.8);}
  // the gyroscopes' rings, fixed in the case
  for(const [gx,gy] of GY){ctx.strokeStyle=rgba(P.brassDk,1);ctx.lineWidth=7;ctx.beginPath();ctx.arc(gx,gy,54,0,TAU);ctx.stroke();
    ctx.strokeStyle="rgba(255,236,190,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(gx,gy,54,-1.4,0.2);ctx.stroke();
    ctx.fillStyle=rgba(P.brassDk,1);for(const sd of [-1,1]){ctx.beginPath();ag_rect(ctx,gx+sd*54-(sd>0?0:16),gy-6,16,12,3);ctx.fill();}}
  if((o.check||0)>0){const cc=o.checkCol||AG.green;ctx.save();ctx.shadowColor=rgba(cc,0.6*o.check);ctx.shadowBlur=16;ctx.strokeStyle=rgba(cc,0.95*o.check);ctx.lineWidth=5;
    for(const [gx,gy] of GY){ctx.beginPath();ctx.arc(gx,gy,62,0,TAU);ctx.stroke();}ctx.restore();}
  // where a model would go: room between the pairs, a dashed violet circle, empty
  if((o.empty||0)>0){ctx.save();ctx.globalAlpha*=o.empty;ctx.fillStyle="rgba(250,248,252,0.75)";ctx.beginPath();ctx.arc(0,0,92,0,TAU);ctx.fill();
    ctx.setLineDash([14,12]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(AG.violet,0.95);ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,92,0,TAU);ctx.stroke();ctx.restore();}
  // the valve on the case's right side, its stem moved by the lever
  ag_soft(ctx,c=>ag_rect(c,284,78,48,44,8),P.brass,[255,240,200],320,84,40,"rgba(60,40,10,0.4)",6,0.8);
  ctx.fillStyle=rgba(P.brassDk,1);ctx.beginPath();ag_rect(ctx,322,94,18,16,4);ctx.fill();
  if((o.air||0)>0){const k=Math.sin(clamp(o.air,0,1)*Math.PI);ctx.fillStyle="rgba(250,252,254,"+(0.8*k)+")";for(let j=0;j<4;j++){ctx.beginPath();ctx.arc(318+j*10+o.air*30,70-j*14-o.air*16,6+j*3,0,TAU);ctx.fill();}}
  ctx.restore();
  // the wheels and their axes, which stay upright: spinning brass, a little from above, with their blur
  for(const [gx,gy] of out.gyros){ctx.save();ctx.translate(gx,gy);ctx.scale(s,s);
    const g=ctx.createLinearGradient(-44,0,44,0);g.addColorStop(0,rgba(P.brassDk,1));g.addColorStop(0.62,rgba(P.brass,1));g.addColorStop(1,rgba(ag_lt(P.brass,0.45),1));
    ctx.fillStyle=rgba(ag_dk(P.brassDk,0.25),1);ctx.beginPath();ctx.ellipse(0,5,44,12,0,0,TAU);ctx.fill();
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,44,12,0,0,TAU);ctx.fill();
    for(let k=0;k<4;k++){const ph=t*17+k*1.57;ctx.strokeStyle="rgba(255,246,222,0.5)";ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(0,0,34,8.5,0,ph,ph+0.9);ctx.stroke();}
    ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(0,60);ctx.stroke();ag_arrowHead(ctx,0,-62,-Math.PI/2,10,ink);
    ctx.fillStyle=ink;ctx.beginPath();ctx.arc(0,0,5,0,TAU);ctx.fill();ctx.restore();}
  // the lever: from the lowest right axis's foot, which stays put, to the valve's stem on the case, which tips: it moves as the case tips
  {const g=out.gyros[3],foot=[g[0],g[1]+60*s],stem=Wp(286,100),piv=Wp(240,128);ctx.strokeStyle=ink;ctx.lineWidth=5*s;ctx.beginPath();ctx.moveTo(foot[0],foot[1]);ctx.lineTo(piv[0],piv[1]);ctx.lineTo(stem[0],stem[1]);ctx.stroke();
    ctx.fillStyle=ink;ctx.beginPath();ctx.arc(piv[0],piv[1],6*s,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(foot[0],foot[1],5*s,0,TAU);ctx.fill();}
  ctx.restore();return out;}
// a spirit level: a glass tube in a brass case, its bubble sliding (b, -1 to 1; 0 is level), centred at (x, y), w wide
function ml_level(ctx,x,y,w,b,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,c=>ag_rect(c,x-w/2,y-26,w,52,14),ML_P.brass,[255,236,190],x+w*0.2,y-20,w*0.6,"rgba(60,40,10,0.35)",8);
  const g=ctx.createLinearGradient(0,y-14,0,y+14);g.addColorStop(0,"rgba(214,234,214,1)");g.addColorStop(1,"rgba(168,198,170,1)");ctx.fillStyle=g;ctx.beginPath();ag_rect(ctx,x-w/2+16,y-14,w-32,28,14);ctx.fill();
  ctx.strokeStyle="rgba(50,60,50,0.7)";ctx.lineWidth=2;for(const d of [-22,22]){ctx.beginPath();ctx.moveTo(x+d,y-14);ctx.lineTo(x+d,y+14);ctx.stroke();}
  const bx=x+clamp(b,-1,1)*(w/2-50);ctx.fillStyle="rgba(250,255,250,0.95)";ctx.beginPath();ctx.ellipse(bx,y-1,18,9,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.9)";ctx.beginPath();ctx.ellipse(bx+5,y-4,6,3,0,0,TAU);ctx.fill();
  ctx.restore();}

/* ---------------------------------------------------------------- today: an airliner's flight deck, seen from the side and a little behind
   The captain's seat near us, the first officer's beyond it, both facing the windscreen on the right; daylight in the windscreen, a
   plain panel of screens under its shade, no airline's name or colours. ml_deckFront draws the side console over the pilots' waists. */
const ML_DECK={cut:842,cap:[640,630,0.88],fo:[1010,590,0.74]};   // where the captain and the first officer sit: (x, y, s) for ag_person
AG_PLACES.mlDeck=c=>{
  // the cabin's wall and ceiling: pale warm greys, lighter towards the windscreen
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgb(150,150,152)");g.addColorStop(0.55,"rgb(196,196,196)");g.addColorStop(1,"rgb(220,220,218)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(60,60,66,0.35)");g.addColorStop(0.3,"rgba(60,60,66,0)");g.addColorStop(1,"rgba(40,40,46,0.25)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // a side window behind the captain's seat, the same sky in it
  const side=cc=>{cc.moveTo(60,352);cc.bezierCurveTo(150,330,300,318,400,322);cc.lineTo(404,560);cc.bezierCurveTo(300,566,170,580,74,600);cc.closePath();};
  c.save();ag_shape(c,side);c.clip();g=c.createLinearGradient(0,320,0,600);g.addColorStop(0,"rgb(160,190,216)");g.addColorStop(0.8,"rgb(214,226,234)");g.addColorStop(1,"rgb(240,242,242)");
  c.fillStyle=g;c.fillRect(40,300,380,320);c.fillStyle="rgba(255,255,255,0.7)";for(const [x,y,r] of [[110,560,40],[180,552,52],[260,560,44],[330,548,56],[400,556,40]]){c.beginPath();c.ellipse(x,y,r*1.6,r*0.7,0,0,TAU);c.fill();}
  c.restore();c.strokeStyle="rgb(70,72,78)";c.lineWidth=16;c.lineJoin="round";ag_shape(c,side);c.stroke();
  // the windscreen: two panes leaning back, the sky in them, soft cloud tops below
  const pane=cc=>{cc.moveTo(1150,250);cc.lineTo(1960,96);cc.lineTo(1960,560);cc.lineTo(1200,560);cc.closePath();};
  c.save();ag_shape(c,pane);c.clip();g=c.createLinearGradient(0,96,0,560);g.addColorStop(0,"rgb(150,184,214)");g.addColorStop(0.75,"rgb(204,220,232)");g.addColorStop(1,"rgb(236,240,242)");
  c.fillStyle=g;c.fillRect(1100,60,900,520);
  const [b,bx]=ag_buf("mlDeckCloud",240,130);const R=ag_rnd(41);bx.fillStyle="rgba(255,255,255,0.9)";
  for(let k=0;k<26;k++){const x=R()*260-10,y=96+R()*30,r=8+R()*16;bx.beginPath();bx.ellipse(x,y,r*1.8,r,0,0,TAU);bx.fill();}
  for(let k=0;k<8;k++){const x=R()*240,y=30+R()*40,r=6+R()*8;bx.fillStyle="rgba(255,255,255,0.45)";bx.beginPath();bx.ellipse(x,y,r*3,r*0.8,0,0,TAU);bx.fill();}
  c.filter="blur(3px)";c.drawImage(b,1100,40,960,520);c.filter="none";
  c.restore();
  c.strokeStyle="rgb(58,60,66)";c.lineWidth=20;c.lineJoin="round";ag_shape(c,pane);c.stroke();
  c.lineWidth=16;c.beginPath();c.moveTo(1560,172);c.lineTo(1590,560);c.stroke();   // the post between the panes
  // the ceiling's panel, sloping down to the windscreen, rows of small switches
  const roof=cc=>{cc.moveTo(560,0);cc.lineTo(1960,0);cc.lineTo(1960,92);cc.lineTo(1150,246);cc.bezierCurveTo(980,230,760,120,560,0);cc.closePath();};
  ag_soft(c,roof,[92,94,100],[150,152,160],1500,40,500,"rgba(0,0,0,0.4)",20,0.5);
  c.fillStyle="rgba(210,214,220,0.55)";for(let r=0;r<3;r++)for(let k=0;k<26;k++){const x=1000+k*34+r*12,y=40+r*30-(k*34)*0.08;if(x>1900)continue;c.beginPath();c.arc(x,y+((x-1000)*-0.02),3,0,TAU);c.fill();}
  // the shade over the panel, and the panel of plain screens under it, seen at a slant
  const shade=cc=>{cc.moveTo(1130,560);cc.bezierCurveTo(1300,540,1700,536,1960,540);cc.lineTo(1960,604);cc.bezierCurveTo(1700,600,1320,606,1150,618);cc.closePath();};
  const panel=cc=>{cc.moveTo(1150,612);cc.lineTo(1960,598);cc.lineTo(1960,860);cc.lineTo(1190,860);cc.closePath();};
  ag_soft(c,panel,[78,80,86],[130,132,140],1700,640,400,"rgba(0,0,0,0.45)",18,0.5);
  for(const [x0,w] of [[1240,190],[1470,190],[1700,190]]){const sx=x0,sy=640+(x0-1240)*-0.012;
    const scr=cc=>{cc.moveTo(sx,sy);cc.lineTo(sx+w,sy-3);cc.lineTo(sx+w+8,sy+150);cc.lineTo(sx+6,sy+154);cc.closePath();};
    ag_soft(c,scr,[30,34,42],[70,84,104],sx+w*0.7,sy+20,160,null);c.save();ag_shape(c,scr);c.clip();
    if(x0===1240){c.fillStyle="rgba(92,140,190,0.55)";c.fillRect(sx,sy,w+10,74);c.fillStyle="rgba(150,110,80,0.5)";c.fillRect(sx,sy+74,w+10,90);
      c.strokeStyle="rgba(255,255,255,0.7)";c.lineWidth=3;c.beginPath();c.moveTo(sx+50,sy+76);c.lineTo(sx+w-44,sy+74);c.stroke();}
    else{c.strokeStyle="rgba(150,190,220,0.45)";c.lineWidth=2;for(let k=0;k<4;k++){c.beginPath();c.moveTo(sx+20,sy+30+k*30);c.lineTo(sx+w-30,sy+28+k*30);c.stroke();}}
    c.restore();c.strokeStyle="rgba(20,20,24,0.8)";c.lineWidth=4;ag_shape(c,scr);c.stroke();}
  ag_soft(c,shade,[46,48,54],[96,98,106],1600,556,400,null);
  // the seats' backs: the captain's near us, the first officer's beyond (the pilots are drawn over them)
  for(const [x,y,s] of [ML_DECK.fo,ML_DECK.cap]){const seat=cc=>{cc.moveTo(x-190*s,y-330*s);cc.bezierCurveTo(x-70*s,y-350*s,x-40*s,y-260*s,x-40*s,y-120*s);
      cc.lineTo(x-30*s,y+400*s);cc.lineTo(x-250*s,y+400*s);cc.bezierCurveTo(x-270*s,y+60*s,x-260*s,y-300*s,x-190*s,y-330*s);cc.closePath();};
    ag_soft(c,seat,[64,64,70],[120,120,128],x-80*s,y-260*s,260*s,"rgba(0,0,0,0.45)",16,0.5);
    c.strokeStyle="rgba(150,150,160,0.25)";c.lineWidth=3;c.beginPath();c.moveTo(x-210*s,y-150*s);c.quadraticCurveTo(x-130*s,y-166*s,x-52*s,y-150*s);c.stroke();}
};
function ml_deckFront(ctx){const cy=ML_DECK.cut;const con=cc=>{cc.moveTo(0,cy);cc.bezierCurveTo(500,cy-14,1300,cy-10,1960,cy-4);cc.lineTo(1960,H);cc.lineTo(0,H);cc.closePath();};
  ag_soft(ctx,con,[70,72,78],[134,136,144],1300,cy+10,700,"rgba(0,0,0,0.4)",18,0.5);
  ctx.strokeStyle="rgba(200,204,212,0.35)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,cy+6);ctx.bezierCurveTo(500,cy-8,1300,cy-4,1960,cy+2);ctx.stroke();
}

/* ---------------------------------------------------------------- a typical flight, on a card: by hand at take-off and landing, the autopilot between
   ml_timeline(ctx, x, y, w, k, o): the bar's left end at (x, y), w long; k (0 to 1) draws it on from the left; o.labels (0 to 1). */
function ml_timeline(ctx,x,y,w,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||k<=0)return;ctx.save();ctx.globalAlpha*=a;
  const sl=Math.max(30,w*0.026),h=30,dk=AG.ink,blue=AG.blue,lab=o.labels==null?1:o.labels;
  ctx.save();ctx.beginPath();ctx.rect(x-20,y-200,(w+40)*clamp(k,0,1),400);ctx.clip();
  ctx.fillStyle=rgba(blue,0.88);ctx.beginPath();ag_rect(ctx,x+sl+4,y-h/2,w-2*sl-8,h,h/2);ctx.fill();
  ctx.fillStyle=rgba(dk,0.9);for(const sx of [x,x+w-sl]){ctx.beginPath();ag_rect(ctx,sx,y-h/2,sl,h,6);ctx.fill();}
  ctx.restore();
  if(lab>0){const la=clamp(lab,0,1);
    ag_T(ctx,"take-off",x,y+58,{w:600,size:30,col:AG.mut,a:la});ag_T(ctx,"landing",x+w,y+58,{w:600,size:30,col:AG.mut,a:la,align:"right"});
    ag_T(ctx,"autopilot",x+w/2,y+58,{w:700,size:32,col:blue,a:la,align:"center"});
    for(const [sx,al] of [[x+sl/2,"left"],[x+w-sl/2,"right"]]){ctx.strokeStyle=rgba(dk,0.8*la);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(sx,y-h/2-8);ctx.lineTo(sx,y-h/2-34);ctx.stroke();
      ag_T(ctx,"by hand",sx+(al==="left"?-10:10),y-h/2-50,{w:700,size:30,col:dk,a:la,align:al});}}
  ctx.restore();}

/* ---------------------------------------------------------------- Sperry at the controls, close up
   ml_cockpit(ctx, t, o): the sky and the river beyond, tipping by o.roll (radians: when the aeroplane tips, the world does), the
   upper wing's edge and two struts, the pilot with both hands on the wheel (o.turn, radians, turns it, and his hands go with it; o.lift
   straightens his back, 0 to 1; o.nod), the hull's edge in front; o.gust (0 to 1) blows wind lines in from the left. o.who (a spec
   from ML_PEOPLE, Sperry by default), o.rest (0 to 1: the hands leave the wheel and rest on the hull's edge), o.raise (0 to 1: they
   let go and rise, open), o.mate (his mechanic beside him, o.mateGaze). */
const ML_PIT={x:840,y:612,s:1.15,wheel:[566,730,118],edge:900,mate:[1460,596,0.92]};
// the two-jointed arm's angles (degrees, from straight down, forwards positive) that put a wrist at T, the elbow below (up: the elbow
// on the other side, out behind a raised hand): figure space;
// ml_grip puts the fist there instead (the wrist a little short of it, along the forearm)
function ml_grip(J,T){const a=ml_ik(J,T),r=a[1]*Math.PI/180,f=AG_FIG.fore;return ml_ik(J,[T[0]-Math.sin(r)*58*f,T[1]-Math.cos(r)*58]);}
function ml_ik(J,T,up){const f=AG_FIG.fore,L1=AG_FIG.L1,L2=AG_FIG.L2,jx=J[0]/f,tx=T[0]/f,dx=tx-jx,dy=T[1]-J[1],d=clamp(Math.hypot(dx,dy),Math.abs(L1-L2)+1,L1+L2-1);
  const ph=Math.atan2(dx,dy),al=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),a1=up?ph+al:ph-al,ex=jx+Math.sin(a1)*L1,ey=J[1]+Math.cos(a1)*L1;
  return[a1*180/Math.PI,Math.atan2(tx-ex,T[1]-ey)*180/Math.PI];}
function ml_cockpit(ctx,t,o){o=o||{};const P=ML_P,roll=o.roll||0,turn=o.turn||0,[wx,wy,wr]=ML_PIT.wheel;
  // the world beyond, tipping about the frame's middle
  ctx.save();ctx.translate(960,560);ctx.rotate(-roll);ctx.scale(1.16,1.16);ctx.translate(-960,-560);ctx.drawImage(ag_place("mlSky"),0,0);ctx.restore();
  // the wind: soft lines streaming in from the left
  if((o.gust||0)>0){const g=o.gust;ctx.save();ctx.lineCap="round";for(let k=0;k<7;k++){const y=230+k*86+Math.sin(k*2.3)*30,u=(t*0.9+k*0.37)%1,x0=-300+u*2400;
      ctx.strokeStyle="rgba(255,255,255,"+(0.55*g*Math.sin(u*Math.PI))+")";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,y);ctx.bezierCurveTo(x0+120,y-14,x0+240,y+10,x0+380,y-6);ctx.stroke();}ctx.restore();}
  // the upper wing overhead, its linen underside and ribs, and a strut on each side
  const wing=c=>{c.moveTo(-20,0);c.lineTo(1940,0);c.lineTo(1940,56);c.bezierCurveTo(1300,72,620,72,-20,62);c.closePath();};
  ag_soft(ctx,wing,P.linenDk,[255,250,236],1500,40,700,"rgba(80,70,50,0.35)",14,0.6);
  ctx.strokeStyle="rgba(140,128,100,0.4)";ctx.lineWidth=2;for(let k=0;k<12;k++){const x=40+k*170;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+(x-960)*0.04,64);ctx.stroke();}
  for(const [x0,x1] of [[64,30],[1760,1810]]){const st=c=>{c.moveTo(x0-12,60);c.lineTo(x0+12,60);c.lineTo(x1+16,1080);c.lineTo(x1-16,1080);c.closePath();};
    ag_soft(ctx,st,P.strut,ag_lt(P.strut,0.4),x0+20,300,400,"rgba(40,24,10,0.4)",8,0.5);}
  ctx.strokeStyle="rgba(70,64,58,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(64,110);ctx.lineTo(-60,640);ctx.moveTo(1760,110);ctx.lineTo(1960,640);ctx.stroke();
  // the pilot, his hands on the wheel's rim, wherever it has turned
  const J=AG_FIG.shoulder,rim=a=>[wx+Math.cos(a)*wr*0.7,wy+Math.sin(a)*wr],lift=o.lift||0,rest=ag_sine(clamp(o.rest||0,0,1)),edgeF=596+(ML_PIT.edge-6-ML_PIT.y)/ML_PIT.s;
  const nT=rim(Math.PI-0.12+turn),fT=rim(0.22+turn),nG=ml_grip(J.near,nT),fG=ml_grip(J.far,fT),nR=ml_ik(J.near,[372,edgeF]),fR=ml_ik(J.far,[640,edgeF+4]);
  // beside him and a little further off, his mechanic, his hands on the cockpit's edge (drawn first: he's further away)
  if(o.mate){const [mx,my,ms]=ML_PIT.mate,eM=596+(ML_PIT.edge-6-my)/ms,mn=ml_ik(J.near,[372,eM]),mf=ml_ik(J.far,[640,eM+4]);
    ag_person(ctx,o.mate,mx,my,ms,{t,pose:{near:[mn[0],mn[1],"rest"],far:[mf[0],mf[1],"rest"]},covered:true,gaze:o.mateGaze||[2,-0.6],smile:0.12});}
  // his hands: on the wheel, resting on the edge, or (o.raise 0 to 1) let go, open in front of his chest (to 0.3), then raised beside
  // his head, the near elbow out behind him (the near hand stays below his chin: a hand held up at the chin reads as thinking)
  const rr=clamp(o.raise||0,0,1),r1=ag_sine(clamp(rr/0.3,0,1)),r2=ag_sine(clamp((rr-0.3)/0.7,0,1)),wrap=(a,b)=>b-a>180?b-360:b-a<-180?b+360:b;
  const go=(S,F,U)=>{const m=[lerp(S[0],wrap(S[0],F[0]),r1),lerp(S[1],wrap(S[1],F[1]),r1)];return[lerp(m[0],wrap(m[0],U[0]),r2),lerp(m[1],wrap(m[1],U[1]),r2)];};
  const nH=go([lerp(nG[0],nR[0],rest),lerp(nG[1],nR[1],rest)],[15,125],ml_ik(J.near,[80,360],true)),fH=go([lerp(fG[0],fR[0],rest),lerp(fG[1],fR[1],rest)],[40,150],ml_ik(J.far,[520,330]));
  const kind=r1>0.5?"open":rest>0.5?"rest":"hold",pose={near:[nH[0],nH[1],kind],far:[fH[0],fH[1],kind]};
  ag_person(ctx,o.who||ML_PEOPLE.sperry,ML_PIT.x,ML_PIT.y-lift*10,ML_PIT.s,{t,pose,covered:true,nod:(o.nod||0)-lift*0.04,gaze:[2,-1],smile:0.05,
    holdBack:(c,h)=>{c.save();c.translate(0,lift*10/ML_PIT.s);
      // the wheel's column, then the wheel seen at a slant: a wooden rim, three spokes, a brass hub
      c.strokeStyle="rgba(60,52,46,1)";c.lineWidth=22;c.lineCap="round";c.beginPath();c.moveTo(wx+10,wy+20);c.lineTo(wx+40,wy+420);c.stroke();
      c.lineWidth=20;c.strokeStyle=rgba(P.hull,1);c.beginPath();c.ellipse(wx,wy,wr*0.7,wr,0,0,TAU);c.stroke();
      c.lineWidth=5;c.strokeStyle=rgba(P.hullHi,0.8);c.beginPath();c.ellipse(wx,wy,wr*0.7,wr,0,-1.2,0.4);c.stroke();
      c.strokeStyle="rgba(70,62,56,1)";c.lineWidth=9;for(let k=0;k<3;k++){const a=turn+k*TAU/3-Math.PI/2;c.beginPath();c.moveTo(wx,wy);c.lineTo(wx+Math.cos(a)*wr*0.66,wy+Math.sin(a)*wr*0.94);c.stroke();}
      c.fillStyle=rgba(P.brass,1);c.beginPath();c.ellipse(wx,wy,16,20,0,0,TAU);c.fill();c.restore();}});
  // the hull's edge in front of him: varnished wood under a padded leather rim
  const e=ML_PIT.edge,hull=c=>{c.moveTo(-20,e+14);c.bezierCurveTo(600,e-6,1300,e-8,1940,e+20);c.lineTo(1940,H);c.lineTo(-20,H);c.closePath();};
  ag_soft(ctx,hull,P.hull,P.hullHi,1400,e+40,700,"rgba(30,16,6,0.45)",18,0.5);
  ctx.strokeStyle="rgba(255,226,190,0.16)";ctx.lineWidth=2;for(let k=1;k<5;k++){const y=e+30+k*44;ctx.beginPath();ctx.moveTo(-20,y+10);ctx.bezierCurveTo(600,y-6,1300,y-6,1940,y+20);ctx.stroke();}
  ctx.strokeStyle="rgba(58,40,30,1)";ctx.lineWidth=26;ctx.beginPath();ctx.moveTo(-20,e+12);ctx.bezierCurveTo(600,e-8,1300,e-10,1940,e+18);ctx.stroke();
  ctx.strokeStyle="rgba(140,100,76,0.5)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-20,e+4);ctx.bezierCurveTo(600,e-16,1300,e-18,1940,e+10);ctx.stroke();}

/* ---------------------------------------------------------------- the judges' table, close up, under the tent
   mlTable: the tent's canvas behind, its scalloped edge above, the river through the open side on the right (a place); the judges sit
   at ML_TABLE.judges (x, y, s for ag_person) and ml_tableFront draws the table's white cloth over their waists. */
const ML_TABLE={top:838,judges:[[600,650,0.86],[1010,638,0.82]]};
AG_PLACES.mlTable=c=>{const P=ML_P;
  // through the open side: the river's light and the far bank, soft
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(224,228,226)");g.addColorStop(0.55,"rgb(206,214,210)");g.addColorStop(1,"rgb(176,188,182)");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle="rgba(150,166,152,0.6)";c.beginPath();c.moveTo(1380,520);for(let x=1380;x<=1940;x+=40)c.lineTo(x,500-14*Math.sin(x*0.03)-10*Math.sin(x*0.071));c.lineTo(1940,560);c.lineTo(1380,560);c.closePath();c.fill();
  c.fillStyle="rgba(170,190,182,0.9)";c.fillRect(1380,560,560,520);
  // the tent's back wall: cream canvas, its seams, soft folds, darker away from the open side
  const wall=cc=>{cc.moveTo(0,0);cc.lineTo(1420,0);cc.bezierCurveTo(1400,300,1440,700,1400,H);cc.lineTo(0,H);cc.closePath();};
  ag_soft(c,wall,[226,220,204],[250,246,236],1200,300,900,null);
  c.save();ag_shape(c,wall);c.clip();g=c.createLinearGradient(0,0,1420,0);g.addColorStop(0,"rgba(90,80,60,0.28)");g.addColorStop(1,"rgba(90,80,60,0)");c.fillStyle=g;c.fillRect(0,0,1420,H);
  for(let k=0;k<7;k++){const x=120+k*200;c.strokeStyle="rgba(150,136,110,0.35)";c.lineWidth=3;c.beginPath();c.moveTo(x,90);c.bezierCurveTo(x+10,400,x-8,700,x+6,H);c.stroke();
    c.strokeStyle="rgba(255,252,244,0.4)";c.lineWidth=2;c.beginPath();c.moveTo(x+5,90);c.bezierCurveTo(x+15,400,x-3,700,x+11,H);c.stroke();}
  c.restore();
  // the scalloped edge of the roof, and a pole on each side of the opening
  const val=cc=>{cc.moveTo(-20,0);cc.lineTo(1940,0);cc.lineTo(1940,70);for(let x=1940;x>-20;x-=120){cc.quadraticCurveTo(x-60,120,x-120,70);}cc.closePath();};
  ag_soft(c,val,[240,236,226],[255,255,250],1500,30,800,"rgba(80,70,50,0.3)",14,0.6);
  for(const x of [60,1420]){ag_soft(c,cc=>ag_rect(cc,x-11,70,22,H,8),P.timberDk,P.timber,x+6,300,300,"rgba(40,24,10,0.4)",6,0.6);}
};
function ml_tableFront(ctx){const y=ML_TABLE.top,cloth=c=>{c.moveTo(-20,y);c.lineTo(1940,y-6);c.lineTo(1940,H);c.lineTo(-20,H);c.closePath();};
  ag_soft(ctx,cloth,[222,218,206],[246,244,236],1300,y+20,900,"rgba(80,70,50,0.3)",16,0.6);
  ctx.strokeStyle="rgba(170,160,140,0.35)";ctx.lineWidth=3;for(const x of [240,700,1180,1640]){ctx.beginPath();ctx.moveTo(x,y+40);ctx.bezierCurveTo(x+8,y+120,x-6,y+200,x+4,H);ctx.stroke();}
  ctx.fillStyle="rgba(255,255,255,0.6)";ctx.fillRect(-20,y-4,1960,8);}

/* ---------------------------------------------------------------- the danger, without a crash: an aeroplane from behind, tipped, slipping away
   ml_slip(ctx, x, y, w, h, k, o): a diagram inside the box (x, y, w, h): the water along its foot, and the aeroplane from behind (o.s,
   0.6 by default), tipped by o.roll, sliding sideways and down as k goes 0 to 1, tipping further, a dotted path behind it; it fades out
   well before the water, and so does the path. */
function ml_slip(ctx,x,y,w,h,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const wy=y+h-56;let g=ctx.createLinearGradient(0,wy,0,y+h);g.addColorStop(0,rgba(ML_P.water0,1));g.addColorStop(1,rgba(ML_P.water1,1));
  ctx.fillStyle=g;ctx.beginPath();ag_rect(ctx,x+30,wy,w-60,40,20);ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.6)";ctx.lineWidth=2;for(let i=0;i<5;i++){const xx=x+80+i*(w-160)/4;ctx.beginPath();ctx.moveTo(xx,wy+14);ctx.lineTo(xx+40,wy+14);ctx.stroke();}
  const px=x+w*0.3,py=y+h*0.3,path=[px,py,px+w*0.16,py+30,px+w*0.34,py+h*0.2,px+w*0.44,wy-40],e=0.8*clamp(k,0,1);
  const n=30;for(let i=0;i<n;i++){const u=i/(n-1)*0.8;if(u>e-0.04)break;const q=ag_bz(path,u),fade=1-sstep(0.45,0.78,u);if(fade<=0.02)continue;
    ctx.fillStyle=rgba(AG.ink,0.7*fade);ctx.beginPath();ctx.arc(q[0],q[1]+40,6,0,TAU);ctx.fill();}
  const q=ag_bz(path,e);ml_boatBack(ctx,q[0],q[1],o.s||0.6,{roll:(o.roll==null?0.36:o.roll)+0.5*e,t:o.t||0,heads:true,a:1-sstep(0.52,0.76,e)});
  ctx.restore();}

/* ===== A model, reasoning, hands and a loop: the room's own pieces =====
   Everything this film puts in the series' room (the lab, the agent, the cards) that the shared code doesn't have (prefix ml_):
     ML_ROOM      where things stand: Jun, his goal card, the agent's ring, its three tools (the style prototype's layout, the tools
                  a little to the left so their servers fit behind them)
     ml_jun       Jun at his desk on the left
     ml_tool      a tool's card: its name, what it does, read only by a lock, and its tool server behind it
     ml_parts     the four parts in a row under the kicker, model, reasoning, hands, loop, each lighting in its colour
     ml_cal       a calendar card: a day, or a year; o.from rolls its big words up from the ones before
     ml_byHand    the five small cards of the afternoon by hand, find the tables to fix, with an amber arrow from fix back to query
     ml_clock     a clock on a card, its hands moving through the afternoon
     ml_pages     pale pages without words, streaming into the model
     ml_written   a card the model writes on, letter by letter, with the words that could come next
     ml_cabinet   a cabinet of drawers, "Student records", behind glass
     ml_plan      the model's plan, written line by line, a tick by each line that meets the team's rules
     ml_rules     the team's rules, on a card from Jun's side
     ml_query     a query on its card, and the number it brings back
     ml_recipe    the recipe the steps become, with its test; o.fold folds its steps away
     ML_ANS       the agent's answer by Jun, with its five pieces of evidence (ML_EV) and where each rests once fanned out (ml_evPlaces)
     ml_evItem    one piece of evidence, drawn as the shared answer card draws it, for when it stays behind without the answer
     ml_approve   the line at an answer's foot, "Approved by:", and the name a person signs after it
     ml_small     the agent at any place and size, its steps only at full size
     ml_server    a tool server: a small matte box behind a tool, its cable, and the same plug as every arm (the open standard)
     ml_thought   a violet thought from the model
     ml_globe     a pale globe, "the web"
     ml_columns   two columns on the wall: steps known (a plain script) and steps nobody can write in advance (an agent)
   Words are drawn live with ag_T, at least 28 px, above y 890. */

const ML_ROOM={jun:[300,600,1],ring:[1124,476],tools:[["Catalog",236],["Query",404],["Docs",572]],tx:1520,tw:280,th:[148,148,184],
  goal:[452,212,384],parts:[96,148]};
const ML_COL={model:AG.violet,reasoning:AG.violet,hands:AG.blue,loop:AG.amber};
// the arm from Act to a tool's card (the prototype's three curves)
const ml_arm=i=>{const y=ML_ROOM.tools[i][1]+ML_ROOM.th[i]/2;return[1360,476,1430,476,1470,y,ML_ROOM.tx-4,y];};

/* ---------------------------------------------------------------- Jun at his desk
   ml_jun(ctx, t, o): the oak desk across the bottom left, Jun behind it, cut at its back edge, his arms down out of sight; o.gaze, nod,
   talk, smile; o.a. */
const ML_DESK={x:-80,y:1000,w:800,depth:150};
function ml_jun(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [jx,jy,js]=ML_ROOM.jun,D=ML_DESK;ctx.save();ctx.globalAlpha*=a;
  ag_desk(ctx,D.x,D.y,D.w,{depth:D.depth});
  ag_person(ctx,"jun",jx,jy,js,{t,gaze:o.gaze,nod:o.nod||0,talk:o.talk||0,smile:o.smile||0,cut:D.y-D.depth});
  ctx.restore();}

/* ---------------------------------------------------------------- a tool's card, and its server behind it
   ml_tool(ctx, i, o): tool i of ML_ROOM.tools: its name, what it does (ML_TOOLDO), and at its foot a lock and "read only"; o.touch
   (0 to 1) its blue edge while an arm holds it, o.lock (0 to 1) the lock glows, o.server (0 to 1) its tool server, a small matte box
   behind its top right corner with a cable out of the frame, o.plug (0 to 1) the server's top socket shows the open standard's plug,
   o.dx (slides it in from the right), o.a. Returns the card. */
const ML_TOOLDO=["lists the tables","reads the data","the university's definitions"];
function ml_tool(ctx,i,o){o=o||{};const a=o.a==null?1:o.a,x=ML_ROOM.tx+(o.dx||0),y=ML_ROOM.tools[i][1],w=ML_ROOM.tw,h=ML_ROOM.th[i],b={x,y,w,h};if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;const sv=o.server||0;
  if(sv>0.01){ctx.save();ctx.globalAlpha*=sv;ml_server(ctx,x+w-60,y-40,{});if((o.plug||0)>0.01)ml_plug(ctx,x+w-5,y-52,Math.PI/2,1,"#3E3F45",o.plug);ctx.restore();}
  const on=o.touch||0;ag_box(ctx,x,y,w,h,20,{edge:on>0.1?AG.blue:null,edgeA:0.9*on,glow:on>0.1?AG.blue:null,glowA:on});
  ag_T(ctx,ML_ROOM.tools[i][0],x+28,y+48,{w:700,size:32});
  const ls=ag_wrap(ctx,ML_TOOLDO[i],w-56,{w:500,size:28});ls.forEach((l,j)=>ag_T(ctx,l,x+28,y+86+j*36,{w:500,size:28,col:AG.mut}));
  const lk=o.lock||0,ly=y+h-34;if(lk>0.01){ctx.save();ctx.shadowColor=rgba(AG.blue,0.8);ctx.shadowBlur=18*lk;ag_lock(ctx,x+42,ly,28,rgba(AG.blue,1));ctx.restore();}else ag_lock(ctx,x+42,ly,28,rgba(AG.blue,1));
  ag_T(ctx,"read only",x+66,ly+8,{w:600,size:28,col:AG.blue});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the four parts, under the kicker
   ml_parts(ctx, on, o): on[i] (0 to 1) lights part i in its colour; o.a; o.gather (0 to 1) carries them into the ring at o.to
   ([x, y]), each to its place: the model to the middle, reasoning to the band, hands to Act, the loop to the ring; their words go as
   they leave, already read, so nothing small is left to read. Returns the chips. */
const ML_PARTS=[["model",AG.violet],["reasoning",AG.violet],["hands",AG.blue],["loop",AG.amber]];
function ml_parts(ctx,on,o){o=o||{};const a=o.a==null?1:o.a,[x0,y0]=ML_ROOM.parts,h=48,out=[];let x=x0;
  const to=o.to||ML_ROOM.ring,dest=[[to[0],to[1]+40],[to[0],to[1]-12],[to[0]+180,to[1]],[to[0]-180,to[1]]],g=ag_sine(o.gather||0);
  ML_PARTS.forEach(([s,col],i)=>{const w=ag_tw(ctx,s,{w:700,size:28})+44,b={x,y:y0,w,h};out.push(b);x+=w+14;if(a<=0)return;
    const cx=lerp(b.x+w/2,dest[i][0],g),cy=lerp(b.y+h/2,dest[i][1],g),k=lerp(1,0.6,g),l=clamp(on[i]||0,0,1),fa=a*(1-sstep(0.75,1,g));if(fa<=0.01)return;
    ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);
    ag_box(ctx,-w/2,-h/2,w,h,h/2,{a:fa,edge:l>0.05?col:null,edgeA:0.9*l,glow:l>0.05?col:null,glowA:l});
    ctx.save();ctx.globalAlpha*=fa;if(l>0.01){ctx.fillStyle=rgba(col,0.12*l);ctx.beginPath();ag_rect(ctx,-w/2,-h/2,w,h,h/2);ctx.fill();}
    ag_T(ctx,s,0,10,{w:700,size:28,align:"center",col:mix(AG.mut,col,l),a:1-sstep(0.02,0.11,g)});ctx.restore();ctx.restore();});
  return out;}

/* ---------------------------------------------------------------- a calendar card
   ml_cal(ctx, x, y, w, head, big, o): two rings on top, a strip with head (the month, or the day), big words under it; o.sub a
   quieter line, o.col the strip's colour (oak), o.tick a green tick, o.a, o.k (springs in); o.from (the big words before) rolls up
   and out as o.roll goes 0 to 1, and big rolls in under it. Returns its box. */
function ml_cal(ctx,x,y,w,head,big,o){o=o||{};const a=o.a==null?1:o.a,h=o.sub?196:156,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,18,{});const col=o.col||AG_OAK.dark;
  ctx.save();ctx.beginPath();ag_rect(ctx,x,y,w,h,18);ctx.clip();ctx.fillStyle=rgba(col,0.9);ctx.fillRect(x,y,w,54);ctx.restore();
  for(const rx of [x+w*0.28,x+w*0.72]){ctx.fillStyle="#5A564F";ctx.beginPath();ag_rect(ctx,rx-5,y-14,10,30,5);ctx.fill();}
  ag_T(ctx,head,x+w/2,y+38,{w:700,size:28,align:"center",col:[255,255,255]});
  const ru=o.from==null?1:ag_sine(clamp(o.roll||0,0,1));
  if(ru<1){ctx.save();ctx.beginPath();ctx.rect(x,y+56,w,h-56);ctx.clip();ag_T(ctx,o.from,x+w/2,y+112-72*ru,{w:800,size:44,align:"center",a:1-ru});
    ag_T(ctx,big,x+w/2,y+112+72*(1-ru),{w:800,size:44,align:"center",a:ru});ctx.restore();}
  else ag_T(ctx,big,x+w/2,y+112,{w:800,size:44,align:"center"});
  if(o.sub)ag_T(ctx,o.sub,x+w/2,y+160,{w:600,size:28,align:"center",col:AG.mut});
  if(o.tick)ag_tick(ctx,x+w-34,y+h-34,26,rgba(AG.green,clamp(o.tick,0,1)),4);
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the afternoon by hand
   ml_byHand(ctx, t, k, o): five small cards along the wall from (o.x, o.y), each in as k[i] (0 to 1) says; o.loop (0 to 1) draws
   the amber arrow under them from "fix" back to "query" and sends a light round it; o.into (0 to 1) carries them into the ring at o.to. */
const ML_HAND=["find the tables","read the rules","query","check","fix"];
function ml_byHand(ctx,t,k,o){o=o||{};const a=o.a==null?1:o.a,x0=o.x||560,y0=o.y||600,h=56,gap=26,out=[];let x=x0;
  for(const s of ML_HAND){const w=ag_tw(ctx,s,{w:700,size:28})+44;out.push({x,y:y0,w,h,s});x+=w+gap;}
  if(a<=0)return out;const into=ag_sine(o.into||0),to=o.to||ML_ROOM.ring;ctx.save();ctx.globalAlpha*=a;
  // the arrow: from fix's foot, under check, back up to query
  const L=clamp(o.loop||0,0,1);if(L>0&&into<0.3){const f=out[4],q=out[2],p=[f.x+f.w/2,f.y+h+6,f.x+f.w/2,f.y+h+110,q.x+q.w/2,q.y+h+110,q.x+q.w/2,q.y+h+10];
    ctx.save();ctx.globalAlpha*=1-into/0.3;ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=5;ctx.lineCap="round";ag_bzPath(ctx,p,0,ag_sine(L));ctx.stroke();
    if(L>0.98){const e=ag_bz(p,1),e0=ag_bz(p,0.96);ag_arrowHead(ctx,e[0],e[1],Math.atan2(e[1]-e0[1],e[0]-e0[0]),14,rgba(AG.amber,0.95));
      const u=(t*0.6)%1,q2=ag_bz(p,u);ctx.shadowColor=rgba(AG.amber,0.7);ctx.shadowBlur=14;ctx.fillStyle=rgba(AG.amber,1);ctx.beginPath();ctx.arc(q2[0],q2[1],8,0,TAU);ctx.fill();}
    ctx.restore();}
  out.forEach((b,i)=>{const ki=clamp(k[i]||0,0,1);if(ki<=0)return;const sp=ag_spr(ki,0,1),cx=lerp(b.x+b.w/2,to[0]+(i-2)*14,into),cy=lerp(b.y+h/2,to[1],into),
      s=lerp(1,0.3,into)*lerp(0.6,1,clamp(sp,0,1.2)),fa=ki*(1-sstep(0.7,1,into));if(fa<=0.01)return;
    ctx.save();ctx.translate(cx,cy);ctx.scale(s,s);ag_box(ctx,-b.w/2,-h/2,b.w,h,16,{a:fa,edge:i===4&&L>0?AG.amber:null,edgeA:0.6});
    ag_T(ctx,b.s,0,10,{w:700,size:28,align:"center",a:fa});ctx.restore();});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- a clock on a card: hour (1 to 5 through the afternoon), a label under the face */
function ml_clock(ctx,x,y,hour,label,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||260,h=270;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));ag_box(ctx,x,y,w,h,22,{});const cx=x+w/2,cy=y+104,r=74;
  ctx.fillStyle="#F8F6F2";ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();ctx.strokeStyle="rgba(60,56,50,0.5)";ctx.lineWidth=3;ctx.stroke();
  for(let i=0;i<12;i++){const an=i/12*TAU;ctx.strokeStyle="rgba(60,56,50,0.55)";ctx.lineWidth=i%3?2:4;ctx.beginPath();ctx.moveTo(cx+Math.sin(an)*(r-12),cy-Math.cos(an)*(r-12));ctx.lineTo(cx+Math.sin(an)*(r-4),cy-Math.cos(an)*(r-4));ctx.stroke();}
  const hA=hour/12*TAU,mA=(hour%1)*TAU;ctx.lineCap="round";
  ctx.strokeStyle="#3A3733";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(hA)*r*0.5,cy-Math.cos(hA)*r*0.5);ctx.stroke();
  ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(mA)*r*0.78,cy-Math.cos(mA)*r*0.78);ctx.stroke();
  ctx.fillStyle=rgba(AG.amber,1);ctx.beginPath();ctx.arc(cx,cy,6,0,TAU);ctx.fill();
  ag_T(ctx,label,cx,y+h-34,{w:700,size:30,align:"center"});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- pages without words, streaming into the model at (x, y), r its size; a (0 to 1) */
function ml_pages(ctx,t,x,y,r,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<14;i++){const u=((t*0.32+i/14)%1),sy=170+((i*137)%560),p=[-80,sy,420,sy,x-420,y+(sy-y)*0.25,x-r*0.4,y],q=ag_bz(p,ag_sine(u)),q0=ag_bz(p,ag_sine(Math.max(0,u-0.01)));
    const s=lerp(1,0.25,sstep(0.6,1,u)),fa=sstep(0,0.12,u)*(1-sstep(0.88,1,u));if(fa<=0.01)continue;
    ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(Math.atan2(q[1]-q0[1],q[0]-q0[0])*0.3+Math.sin(i*1.7)*0.12);ctx.scale(s,s);
    ag_box(ctx,-34,-44,68,88,6,{a:fa*0.92});ctx.strokeStyle="rgba(140,132,120,"+(0.25*fa)+")";ctx.lineWidth=3;
    for(let l=0;l<5;l++){ctx.beginPath();ctx.moveTo(-22,-28+l*13);ctx.lineTo(l===4?4:22,-28+l*13);ctx.stroke();}ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- a card the model writes on
   ml_written(ctx, x, y, w, text, k, o): the text in violet, letter by letter as k goes 0 to 1, a caret while it writes; o.cands,
   the words that could come next, wait one under another after the text, faint (o.candA[i], 0 to 1, as each comes), and as o.pick
   goes 0 to 1 the first darkens in its place and the others go; o.kick; o.h; o.ka springs it in; o.a. */
function ml_written(ctx,x,y,w,text,k,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||((o.kick?150:112)+(o.cands?(o.cands.length-1)*48:0));if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.ka!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.ka));ag_box(ctx,x,y,w,h,20,{edge:AG.violet,edgeA:0.45});let yy=y+68;
  if(o.kick){ag_T(ctx,String(o.kick).toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});yy=y+108;}
  const n=Math.round(clamp(k,0,1)*text.length),s=text.slice(0,n),sz=o.size||34;ag_T(ctx,s,x+28,yy,{w:700,size:sz,col:AG.violet});
  const ex=x+28+ag_tw(ctx,s,{w:700,size:sz});if(k>0&&k<1){ctx.fillStyle=rgba(AG.violet,0.8);ctx.fillRect(ex+4,yy-sz*0.78,3,sz*0.9);}
  // the words that could come next, faint, one under another; the picked one moves up into its place and darkens, the others go
  if(o.cands){const pk=clamp(o.pick||0,0,1),sp=ag_tw(ctx," ",{w:700,size:sz});o.cands.forEach((wd,i)=>{const ca=clamp((o.candA||[])[i]==null?1:o.candA[i],0,1)*(i===0?1:1-pk);if(ca<=0.01)return;
    const ty=i===0?lerp(yy,yy,pk):yy+i*48;ag_T(ctx,wd,ex+sp,ty,{w:700,size:sz,col:AG.violet,a:ca*(i===0?lerp(0.32,1,pk):0.32)});});}
  ctx.restore();return{x,y,w,h,ex};}

/* ---------------------------------------------------------------- a cabinet of drawers, behind glass: "Student records"; o.lit (0 to 1) */
function ml_cabinet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2+AG.sdx*2,y+h+10,w*0.6,18,0.22);
  ag_soft(ctx,c=>ag_rect(c,x,y,w,h,10),[176,172,164],[226,224,218],x+w*0.75,y+40,w*1.1,"rgba(46,38,28,0.35)",18,0.6);
  const n=4,dh=(h-40)/n;for(let i=0;i<n;i++){const dy=y+20+i*dh;ag_soft(ctx,c=>ag_rect(c,x+16,dy+6,w-32,dh-12,6),[196,192,184],[236,234,230],x+w*0.7,dy+10,w,"rgba(46,38,28,0.3)",8,0.6);
    ctx.fillStyle="#6A665F";ctx.beginPath();ag_rect(ctx,x+w/2-30,dy+dh/2-6,60,12,6);ctx.fill();}
  ag_glass(ctx,x-40,y-40,w+80,h+40,{label:""});
  ag_T(ctx,o.label||"Student records",x+w/2,y+h+56,{w:700,size:30,align:"center",col:AG.ink});
  ctx.restore();}

/* ---------------------------------------------------------------- the model's plan
   ml_plan(ctx, x, y, w, lines, o): a card with a violet edge, "Plan", and lines, each written in as o.k[i] (0 to 1) says, in ink,
   or in violet when o.fresh[i]; o.tick[i] (0 to 1) a green tick by line i; o.amber[i] marks a line amber (with a warning). Returns
   the card and each line's y. */
function ml_plan(ctx,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=44,gap=10,inner=w-56-50;
  // each line wrapped to the card, its second part indented under the words after its number
  const L=lines.map(l=>{const m=l.match(/^(\d+) /),pre=m?m[0]:"",ind=m?ag_tw(ctx,pre,{w:600,size:30}):0,ws=ag_wrap(ctx,l.slice(pre.length),inner-ind,{w:600,size:30});return{pre,ind,ws};});
  let yy=y+96;const ys=L.map(e=>{const r=yy;yy+=e.ws.length*lh+gap;return r;}),h=yy-y+12,out={x,y,w,h,ys};if(a<=0)return out;ctx.save();ctx.globalAlpha*=a;
  if(o.ka!=null)ag_about(ctx,x+w/2,y,lerp(0.4,1,o.ka));
  ag_box(ctx,x,y,w,h,22,{edge:AG.violet,edgeA:0.8});ag_T(ctx,o.title||"Plan",x+28,y+52,{w:800,size:34,col:AG.violet});
  L.forEach((e,i)=>{const k=clamp((o.k||[])[i]==null?1:o.k[i],0,1);if(k<=0)return;const fresh=o.fresh&&o.fresh[i],am=o.amber&&o.amber[i],col=am?AG.amber:fresh?AG.violet:AG.ink;
    const full=e.pre+e.ws.join(" "),n=Math.round(k*full.length);let used=0;
    const parts=[e.pre+e.ws[0]].concat(e.ws.slice(1));parts.forEach((pt,j)=>{const take=clamp(n-used,0,pt.length);used+=pt.length+(j?1:0);if(take<=0)return;
      ag_T(ctx,pt.slice(0,take),x+28+(j?e.ind:0),ys[i]+10+j*lh,{w:600,size:30,col});});
    const tk=(o.tick||[])[i]||0;if(tk>0)ag_tick(ctx,x+w-40,ys[i],26,rgba(AG.green,tk),4);if(am)ag_warn(ctx,x+w-40,ys[i],28,rgba(AG.amber,1));});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- the team's rules, and a query with its number
   ml_rules(ctx, x, y, w, o): "Team rules" and its three lines, each in as o.k[i] (0 to 1) says; o.tail (as ag_textCard's), o.ka, o.a.
   ml_query(ctx, x, y, w, kick, text, num, o): a card with a kick (o.kickCol), the words, and a number under them in o.col (orange:
   data come back), o.numA; o.note (amber, at the right of the number), o.noteA; o.edge; o.ka; o.a. Both return their box. */
const ML_RULES=["only the university's tools","only reading","evidence for every answer"];
function ml_rules(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=88+ML_RULES.length*44,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  let tail=null;if(o.tail){const T_=o.tail,m=x+28+(w-56)*(T_.at==null?0.2:T_.at);tail={side:T_.side||"bottom",a:m-24,b:m+24,px:T_.px,py:T_.py};}
  if(o.ka!=null)ag_about(ctx,tail?tail.px:x+w/2,tail?tail.py:y+h/2,lerp(0.5,1,o.ka));
  ag_card(ctx,c=>ag_cardPath(c,x,y,w,h,22,tail),b,{});ag_T(ctx,"TEAM RULES",x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});
  ML_RULES.forEach((r,i)=>{const k=clamp((o.k||[])[i]==null?1:o.k[i],0,1);if(k>0)ag_T(ctx,"· "+r,x+28,y+96+i*44,{w:600,size:30,a:k});});
  ctx.restore();return b;}
function ml_query(ctx,x,y,w,kick,text,num,o){o=o||{};const a=o.a==null?1:o.a,ls=ag_wrap(ctx,text,w-56,{w:600,size:30}),h=92+ls.length*40+(num?64:0),b={x,y,w,h};if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;if(o.ka!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.ka));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.8});ag_T(ctx,String(kick).toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:o.kickCol||AG.blue});
  ls.forEach((l,i)=>ag_T(ctx,l,x+28,y+92+i*40,{w:600,size:30}));
  if(num){ag_T(ctx,num,x+28,y+h-30,{w:800,size:44,col:o.col||AG.orange,a:o.numA==null?1:o.numA});
    if(o.note)ag_T(ctx,o.note,x+w-28,y+h-36,{w:700,size:30,col:AG.amber,align:"right",a:o.noteA==null?1:o.noteA});}
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the recipe: the steps, once they're known
   ml_recipe(ctx, x, y, w, o): a card with a blue edge, "Recipe" and "Census-day count", then its steps, each in as o.k[i] (0 to 1)
   says, the test in green with a tick by it as o.tick (0 to 1) says; o.fold (0 to 1) folds the steps away and the card closes up to
   its title; o.foot a line at its foot (o.footA); o.ka springs it in; o.a. Returns its box, and ly(i), the baseline of step i. */
const ML_RECIPE=["1 Students' table","2 Rule: as on census day","3 Count","Test: total = census report"];
function ml_recipe(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,fold=ag_sine(clamp(o.fold||0,0,1)),n=ML_RECIPE.length,fh=o.foot?44:0,
    h=136+(n*42+10)*(1-fold)+fh,b={x,y,w,h,ly:i=>y+150+i*42};if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;if(o.ka!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.ka));
  ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.85});ag_T(ctx,"RECIPE",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"Census-day count",x+28,y+100,{w:700,size:36});
  const la=1-clamp(fold*2.5,0,1);if(la>0.01){ctx.save();ctx.beginPath();ctx.rect(x,y+110,w,h-110-fh);ctx.clip();
    for(let i=0;i<n;i++){const k=clamp((o.k||[])[i]==null?1:o.k[i],0,1)*la;if(k>0.01)ag_T(ctx,ML_RECIPE[i],x+28,y+150+i*42,{w:600,size:30,a:k,col:i===3?AG.green:AG.ink});}
    const tk=(o.tick||0)*la;if(tk>0.01)ag_tick(ctx,x+w-46,y+150+3*42-10,26,rgba(AG.green,tk),4);ctx.restore();}
  if(o.foot)ag_T(ctx,o.foot,x+28,y+h-28,{w:600,size:28,col:AG.mut,a:o.footA==null?1:o.footA});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the answer by Jun, and its evidence
   The agent's answer rests by Jun (ML_ANS), its five pieces of evidence (ML_EV) clipped behind it until they fan out to its right,
   one under another: the tables it read and the rule (blue, its tools), both queries (the first amber: its round fell short), and the
   check (green). ml_evPlaces(ctx) gives where each rests once out, {x, y, w, h, r}; ml_evItem(ctx, e, o) draws one there as the shared
   card draws it (o.dx, o.dy move it; o.a), for once the answer has gone and its evidence stays. */
const ML_ANS={x:452,y:232,w:560,ew:460,gap:12};
const ML_ANSW={kick:"Answer",title:"18,412 students",sub:"454 more than last year's 17,958"};
const ML_EV=[{kick:"Tables read",title:"Students",col:AG.blue},{kick:"Rule",title:"Docs · census day",col:AG.blue},
  {kick:"Query 1",title:"as they are today · 17,936",col:AG.amber},{kick:"Query 2",title:"on 31 March · 18,412",col:AG.green},
  {kick:"Check",title:"failed, then passed",col:AG.green}];
function ml_evPlaces(ctx){const A=ML_ANS,r=ag_evidence(ctx,A.x,A.y,A.w,ML_ANSW,ML_EV,{side:"right",ew:A.ew,gap:A.gap,open:1,a:0});
  return{card:r.card,items:r.items.map((e,i)=>({x:e.to.x,y:e.to.y,w:e.to.w,h:e.to.h,r:(i%2?1:-1)*0.02}))};}
function ml_evItem(ctx,e,it,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const c=it.col||AG.mut,lines=ag_wrap(ctx,it.title||"",e.w-48,{w:600,size:28}).slice(0,3);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(e.x+(o.dx||0)+e.w/2,e.y+(o.dy||0)+e.h/2);ctx.rotate(e.r);ctx.translate(-e.w/2,-e.h/2);
  ag_box(ctx,0,0,e.w,e.h,16,{edge:c,edgeA:0.55,lw:2});let yy=24;
  if(it.kick){ag_T(ctx,String(it.kick).toUpperCase(),24,yy+22,{w:700,size:28,ls:3,col:c});yy+=36;}
  for(const l of lines){ag_T(ctx,l,24,yy+26,{w:600,size:28});yy+=36;}ctx.restore();}
// piecewise straight: the value at t of [[t0, v0], [t1, v1], ...]
function ml_pw(t,pts){if(t<=pts[0][0])return pts[0][1];for(let i=1;i<pts.length;i++)if(t<pts[i][0]){const [a0,v0]=pts[i-1],[a1,v1]=pts[i];return lerp(v0,v1,(t-a0)/(a1-a0));}return pts[pts.length-1][1];}

/* ---------------------------------------------------------------- "Approved by:", and a name signed after it
   ml_approve(ctx, x, y, w, name, k, o): a slim card, "Approved by:" and a dotted line; as k goes 0 to 1 the name is signed on the
   line, letter by letter, a pen at its end while it writes; o.k springs it in, o.a. */
function ml_approve(ctx,x,y,w,name,k,o){o=o||{};const a=o.a==null?1:o.a,h=78,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));ag_box(ctx,x,y,w,h,20,{});
  const lx=x+28+ag_tw(ctx,"Approved by:",{w:700,size:30})+18;ag_T(ctx,"Approved by:",x+28,y+50,{w:700,size:30,col:AG.mut});
  ctx.strokeStyle="rgba(60,50,40,0.28)";ctx.lineWidth=2;ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(lx,y+58);ctx.lineTo(x+w-28,y+58);ctx.stroke();ctx.setLineDash([]);
  const n=Math.round(clamp(k,0,1)*name.length),s=name.slice(0,n);if(n>0)ag_T(ctx,s,lx+8,y+50,{w:800,size:34});
  if(k>0&&k<1)ag_pen(ctx,lx+8+ag_tw(ctx,s,{w:800,size:34})+14,y+34,30,rgba(AG.ink,0.85));
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the agent at any place and size
   ml_small(ctx, t, cx, cy, R, r, o): its ring (R) round the sphere (r), as ag_loop draws them; its steps (o.stepA) and "Model" on the
   band (o.label, 0 to 1) only at full size; o.core, o.think, o.lit, o.col, o.pulse, o.a. ML_REST: where it rests, small, at the top
   right, once it has brought its answer. */
const ML_REST=[1720,300,100,48];
function ml_small(ctx,t,cx,cy,R,r,o){o=o||{};const a=o.a==null?1:o.a,sa=o.stepA==null?1:o.stepA;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_loop(ctx,cx,cy,{t,R,r,core:o.core,think:o.think,label:null,stepA:[sa,sa,sa],lit:o.lit,col:o.col,pulse:o.pulse});
  const la=o.label||0;if(la>0.01)ag_T(ctx,"Model",cx,cy+r*0.6,{w:700,size:28,align:"center",col:AG.label,a:la});
  ctx.restore();}

/* ---------------------------------------------------------------- a tool server and the open standard's plug
   ml_server(ctx, x, y, o): a small matte box whose left side meets a tool's card at (x, y): a cable running right out of the frame;
   o.label ("tool server"), o.a. ml_plug(ctx, x, y, ang, s, col, a): the plug every arm ends in and every server takes. */
function ml_server(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=110,h=86;
  ctx.strokeStyle="#4C4C52";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+w-8,y+h*0.6);ctx.bezierCurveTo(x+w+40,y+h*0.6,x+w+20,y+h+40,x+w+80,y+h+60);ctx.stroke();
  ag_soft(ctx,c=>ag_rect(c,x,y,w,h,12),[200,200,204],[240,240,244],x+w*0.7,y+16,120,"rgba(46,38,28,0.35)",12,0.7);
  ctx.fillStyle=rgba(AG.blue,0.85);for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(x+w-22,y+20+i*16,4,0,TAU);ctx.fill();}
  ctx.restore();}
function ml_plug(ctx,x,y,ang,s,col,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);
  ctx.fillStyle=col||"#3E3F45";ctx.beginPath();ag_rect(ctx,-14,-13,22,26,6);ctx.fill();ctx.fillStyle="#B8B2A6";ctx.fillRect(8,-8,10,4);ctx.fillRect(8,4,10,4);ctx.restore();}

/* ---------------------------------------------------------------- a violet thought from the model: a cloud of a card with small dots down to (px, py) */
function ml_thought(ctx,x,y,text,a,o){o=o||{};if(a<=0.01)return null;const w=ag_tw(ctx,text,{w:700,size:32})+64,h=80;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h,lerp(0.5,1,o.k));
  if(o.px!=null){for(let i=0;i<3;i++){const u=(i+1)/4,cx=lerp(x+w*0.25,o.px,u),cy=lerp(y+h,o.py,u),r=lerp(12,6,u);ag_box(ctx,cx-r,cy-r,2*r,2*r,r,{edge:AG.violet,edgeA:0.5});}}
  ag_box(ctx,x,y,w,h,40,{edge:AG.violet,edgeA:0.8});ag_T(ctx,text,x+w/2,y+h/2+11,{w:700,size:32,align:"center",col:AG.violet});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a pale globe, "the web" (meridians and parallels on a matte sphere): its
   words under it, or at its left (o.side "left") */
function ml_globe(ctx,x,y,r,a,o){o=o||{};if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,c=>c.arc(x,y,r,0,TAU),[214,222,228],[250,252,254],x+r*0.35,y-r*0.4,r*1.2,"rgba(46,38,28,0.25)",14,0.9);
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.strokeStyle="rgba(90,110,128,0.45)";ctx.lineWidth=2;
  for(const k of [-0.6,-0.2,0.2,0.6]){ctx.beginPath();ctx.ellipse(x,y+k*r,r*Math.sqrt(1-k*k),r*0.12*Math.sqrt(1-k*k),0,0,TAU);ctx.stroke();}
  for(const k of [0.25,0.6,0.92]){ctx.beginPath();ctx.ellipse(x,y,r*k,r,0,0,TAU);ctx.stroke();}ctx.restore();
  if(o.side==="left")ag_T(ctx,"the web",x-r-22,y+11,{w:700,size:30,align:"right",col:AG.mut});else ag_T(ctx,"the web",x,y+r+46,{w:700,size:30,align:"center",col:AG.mut});ctx.restore();}

/* ---------------------------------------------------------------- two columns on the wall
   ml_columns(ctx, a, o): "Steps known" (blue) on the left, "Steps nobody can write in advance" (violet) on the right; o.x0, o.x1 their
   middles, o.y their heads' top, o.h their height, o.aL and o.aR each one's own fade. Returns where each column's contents go. */
function ml_columns(ctx,a,o){o=o||{};const x0=o.x0||620,x1=o.x1||1300,y=o.y||170,w0=440,w1=560,h=o.h||640,out={left:[x0,y+260],right:[x1,y+260]};if(a<=0.01)return out;
  ctx.save();ctx.globalAlpha*=a;const aL=o.aL==null?1:o.aL,aR=o.aR==null?1:o.aR;
  for(const [cx,w,col,s,ca] of [[x0,w0,AG.blue,"Steps known",aL],[x1,w1,AG.violet,"Steps nobody can write in advance",aR]]){if(ca<=0.01)continue;ctx.save();ctx.globalAlpha*=ca;
    ctx.fillStyle=rgba(col,0.06);ctx.beginPath();ag_rect(ctx,cx-w/2,y,w,h,26);ctx.fill();ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=2;ctx.setLineDash([10,10]);ctx.stroke();ctx.setLineDash([]);
    const lines=ag_wrap(ctx,s,w-60,{w:800,size:34});lines.forEach((l,i)=>ag_T(ctx,l,cx,y+62+i*44,{w:800,size:34,align:"center",col}));ctx.restore();}
  ctx.restore();return out;}

/* ===== A model, reasoning, hands and a loop: the nine chapters =====
   Each chapter is a few shots, in the places of past.js and the series' room, cut together with short dissolves (ml_shots). Times
   inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if
   it's recorded again. Words on screen are on cards, labels and pills, at least 28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const ml_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the shared ag_shots, with a dissolve of each shot's own (sh.dis, seconds; 0.5 by default): the river into today takes longer; a shot
// marked cut comes in on a cut
function ml_shots(ctx,S,t,end,shots){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;
  const dis=i>0?(shots[i].dis||0.5):0.5,u=i>0&&!shots[i].cut?clamp((t-shots[i].at)/dis,0,1):1,till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){ag_shot(ctx,S,t,shots[i-1],shots[i].at);const [bc,bx]=ag_buf("cut",ctx.canvas.width,ctx.canvas.height);ag_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else ag_shot(ctx,S,t,shots[i],till(i));return i;}
// the corner's kicker: the latest of [[t, num, title], ...] passed, dissolving from the one before; a null num hides it
function ml_kick(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?ag_in(t,mk[i][0],0.5):1;
  if(u<1&&mk[i-1][1])ag_kicker(ctx,mk[i-1][1],mk[i-1][2]||"",{a:a*(1-u)});if(mk[i][1])ag_kicker(ctx,mk[i][1],mk[i][2]||"",{a:a*u});}
// a card that springs in at t0 and goes at t1 (or stays): its k and a, for ag_textCard
const ml_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// a gust's dip: 0 before t0, up to 1 and back over d seconds
const ml_dip=(t,t0,d)=>{const u=(t-t0)/(d||1.6);return u<=0||u>=1?0:Math.sin(Math.PI*u)*(u<0.4?1:1-0.15*(u-0.4));};
const ML_TITLE="A model, reasoning, hands and a loop";
// the room's paper-pale veil, inside a shot (ag_veil resets the camera)
function ml_veil(x,a){if(a<=0.01)return;x.fillStyle="rgba(240,238,233,"+clamp(a,0,1)+")";x.fillRect(-200,-200,W+400,H+400);}

// ---- 1 · Hands off: the Seine in June 1914, flying by hand, Sperry's box, the prize; the autopilot today; a box with no model ----
scene("off",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({contest:wAt(sc,"date","contest"),prog:c.last-0.2,young:wAt(sc,"last","young"),cachin:wAt(sc,"last","Emil"),
    close:wAt(sc,"last","young")-0.4,pit:c.hard-0.5,g1:wAt(sc,"gust","gust"),ache:wAt(sc,"ache","arms"),slip:c.fall-0.5,slide:wAt(sc,"fall","slip"),fall:wAt(sc,"fall","fall"),
    box:c.box-0.6,four:wAt(sc,"box","four"),point:wAt(sc,"box","pointing"),moves:wAt(sc,"box","moves"),tips:wAt(sc,"feels","tips"),feels:wAt(sc,"feels","feels"),
    pist:wAt(sc,"feels","pistons"),lev:wAt(sc,"feels","level"),pass:c.hands-0.5,raise:wAt(sc,"hands","raises"),lets:wAt(sc,"hands","lets"),
    out:c.wing-0.4,climbs:wAt(sc,"wing","climbs"),dip:wAt(sc,"dips","dips"),back:wAt(sc,"dips","brings"),cheer:wAt(sc,"dips","back")+0.3,
    prize:c.prize-0.45,first:wAt(sc,"prize","first"),rest:wAt(sc,"prize","now")-0.2,letgo:wAt(sc,"prize","let"),
    deck:c.auto-0.4,only:wAt(sc,"auto","only"),watch:wAt(sc,"seats","watch"),decide:wAt(sc,"seats","decide"),
    room:c.nomodel-0.6,hands:wAt(sc,"nomodel","hands"),check:wAt(sc,"nomodel","check"),loop:wAt(sc,"nomodel","loop"),nom:wAt(sc,"nomodel","model"),
    job:wAt(sc,"nomodel","known"),put:c.agent,inside:wAt(sc,"agent","inside"),agent:wAt(sc,"agent","agent"),title:c.breath+0.2}));
  // the gusts: three, each answered by the pilot's arms a moment later; then on "ache" he straightens his back
  const gusts=[P.g1,P.g1+1.7,P.g1+3.4],roll=tt=>gusts.reduce((s,g)=>s+0.085*ml_dip(tt,g,1.5),0),turn=tt=>-gusts.reduce((s,g)=>s+0.5*ml_dip(tt,g+0.25,1.4),0);
  const gustA=tt=>gusts.reduce((s,g)=>Math.max(s,ag_io(tt,g-0.4,g+0.9,0.3)),0);
  // the box: it tips as the aeroplane does, and the piston brings it back
  const tilt=tt=>0.13*Math.sin((tt-P.point)*1.6)*ag_io(tt,P.point,P.tips-0.3,0.5)+0.12*ag_in(tt,P.tips-0.2,0.6)*(1-ag_in(tt,P.lev-0.2,1.2));
  const push=tt=>ag_in(tt,P.pist-0.2,0.6)*(1-ag_in(tt,P.lev+0.6,0.8));
  ml_shots(ctx,S,t,sc.dur,[
    // the Seine at Bezons, just outside Paris: the crowd along the bank, the grandstand across the water; the contest's card
    {at:0,place:"mlSeine",keys:[[0,960,540,1],[0.1,960,520,1.04]],d:9,push:0.01,draw:(x,tt)=>{ml_crowd(x,tt,{});
      const p=ml_pop(tt,P.contest-0.2,null);ag_textCard(x,1150,150,560,{kick:"Paris, 1914",title:"A contest for safer aeroplanes"},{k:p.k,a:p.a});}},
    // last to fly: the programme, and the flying boat coming in from the left, far off and low over the water, beyond the judges' awning
    {at:P.prog,place:"mlSeine",keys:[[P.prog,960,520,1.04],[P.prog+0.1,860,560,1.12]],d:2.6,push:0.01,draw:(x,tt)=>{
      const bx=lerp(-60,700,clamp((tt-P.prog)/5,0,1));ml_boat(x,bx,540,0.5,{t:tt,shadow:588,who:[{who:{skin:[232,198,170],top:{c:[70,62,56]},cap:[104,72,48],goggles:true}},{who:{skin:[220,182,150],top:{c:[104,100,96]},cap:[84,82,80]}}]});
      ml_crowd(x,tt,{turn:ag_in(tt,P.prog+1,1.2)*0.6});
      const p=ml_pop(tt,P.prog+0.1,null);ag_textCard(x,140,170,520,{kick:"Programme · last to fly",title:"Lawrence Sperry",sub:"with Emil Cachin"},{k:p.k,a:p.a});}},
    // closer: the two of them side by side in the cockpit, Sperry at the wheel and Cachin beside him on the right, their names
    {cut:true,at:P.close,place:null,keys:[[P.close,960,540,1],[P.close+0.1,950,540,1.03]],d:4,push:0.01,draw:(x,tt)=>{
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,roll:0.012*Math.sin(tt*0.9),turn:0.04*Math.sin(tt*1.1)});
      const p1=ml_pop(tt,P.young,null),p2=ml_pop(tt,P.cachin,null);
      ag_textCard(x,200,236,380,{title:"Lawrence Sperry",sub:"pilot, 21"},{tail:{side:"right",at:0.6,px:700,py:372},k:p1.k,a:p1.a});
      ag_textCard(x,1380,110,340,{title:"Emil Cachin",sub:"mechanic"},{tail:{side:"bottom",at:0.3,px:1466,py:280},k:p2.k,a:p2.a});}},
    // flying by hand, closer on Sperry: each gust tips a wing, and his arms bring it back; his back aches
    {cut:true,at:P.pit,place:null,keys:[[P.pit,920,540,1.06],[P.pit+0.1,890,560,1.13]],d:8,push:0.01,draw:(x,tt)=>{const ach=ag_io(tt,P.ache,P.ache+1.8,0.6);
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,roll:roll(tt),turn:turn(tt)+0.06*Math.sin(tt*1.3),gust:gustA(tt),lift:ach,nod:-0.03*ach});}},
    // the danger, drawn as a diagram: the aeroplane tipped, sliding sideways and down; the path fades before the water
    {cut:true,at:P.slip,place:null,keys:[[P.slip,960,540,1.06],[P.slip+0.1,960,520,1.0]],d:2,push:0.01,draw:(x,tt)=>{ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,roll:0.02});ml_veil(x,0.55*ag_in(tt,P.slip,0.6));
      const a=ag_in(tt,P.slip+0.1,0.5);ag_box(x,360,170,1200,620,26,{a});ml_slip(x,360,170,1200,620,ag_in(tt,P.slide-0.2,P.fall-P.slide+0.8),{t:tt,a,roll:0.36*ag_in(tt,P.slip+0.3,1.2)});}},
    // Sperry's answer: his box, cut open, on a card; four gyroscopes spinning, their axes upright as it tips; a valve, a piston, the wing's edge
    {at:P.box,place:"mlSeine",keys:[[P.box,960,540,1.02],[P.box+0.1,960,500,1.06]],d:10,push:0.01,draw:(x,tt)=>{ml_veil(x,0.6);ag_box(x,190,150,1540,640,26,{a:ag_in(tt,P.box,0.4)});
      const b=ml_box(x,666,506,0.92,{t:tt,tilt:tilt(tt),push:push(tt),air:clamp((tt-P.feels+0.2)/1.4,0,1),plane:1,level:1,chain:1,a:ag_in(tt,P.box+0.1,0.5)});
      ag_T(x,"4 gyroscopes",666,734,{w:700,size:30,align:"center",a:ag_in(tt,P.four,0.4)});
      ag_T(x,"level",b.level[0]+150,b.level[1]+10,{w:700,size:30,col:AG.green,a:ag_in(tt,P.lev+0.4,0.4)});}},
    // over the river: the flying boat passes the grandstand, and heads in the crowd turn to follow it
    {cut:true,at:P.pass,place:"mlSeine",keys:[[P.pass,860,560,1.12],[P.pass+0.1,900,560,1.16]],d:3,push:0.01,draw:(x,tt)=>{const bx=lerp(700,1060,clamp((tt-P.pass)/3,0,1));
      ml_boat(x,bx,540,0.95,{t:tt,shadow:600,who:[{who:{skin:[232,198,170],top:{c:[70,62,56]},cap:[104,72,48],goggles:true}},{who:{skin:[220,182,150],top:{c:[104,100,96]},cap:[84,82,80]}}]});
      ml_crowd(x,tt,{turn:-0.6+1.3*ag_in(tt,P.pass+0.2,2.4)});}},
    // in the cockpit, Sperry lets go of the wheel and raises his hands, open; the wheel holds still; Cachin looks up at them
    {at:P.lets-0.3,place:null,keys:[[P.lets-0.3,960,540,1],[P.lets-0.2,960,525,1.04]],d:4,push:0.01,draw:(x,tt)=>{const r=0.3*ag_in(tt,P.lets,0.5)+0.7*ag_in(tt,P.raise-0.15,0.9);
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,raise:r,mateGaze:[2-3*r,-0.6-0.8*r],roll:0.008*Math.sin(tt*0.8)});}},
    // from behind: Cachin climbs out along the lower wing; it dips under his weight, and the box brings it back
    {at:P.out,place:"mlSky",keys:[[P.out,960,560,1],[P.out+0.1,960,540,1.04]],d:5,push:0.01,draw:(x,tt)=>{const u=ag_sine(clamp((tt-P.climbs+0.2)/2.2,0,1)),
        r=0.15*ag_in(tt,P.dip-0.3,0.9)*(1-ag_in(tt,P.back+0.2,1.6));
      ml_boatBack(x,960,600,1.5,{roll:r,t:tt,heads:true,out:{u,spec:{coat:[104,100,96],hat:"cap",hatC:[84,82,80]}}});}},
    // the crowd cheers
    {at:P.cheer,place:"mlSeine",keys:[[P.cheer,960,560,1.1],[P.cheer+0.1,980,560,1.13]],d:3,push:0.01,draw:(x,tt)=>{ml_boat(x,1240,600,0.6,{t:tt,shadow:690,
        who:[{who:{skin:[232,198,170],top:{c:[70,62,56]},cap:[104,72,48],goggles:true}},{who:{skin:[220,182,150],top:{c:[104,100,96]},cap:[84,82,80]}}]});
      ml_crowd(x,tt,{turn:0.6,up:ag_in(tt,P.cheer,0.6)});}},
    // the judges' table: first prize
    {at:P.prize,place:"mlTable",keys:[[P.prize,960,560,1.08],[P.prize+0.1,1000,600,1.14]],d:4,push:0.01,draw:(x,tt)=>{const J=ML_TABLE.judges;
      ag_person(x,ML_J2,J[1][0],J[1][1],J[1][2],{t:tt,cut:ML_TABLE.top,gaze:[2,1],smile:0.5});
      ag_person(x,ML_PEOPLE.judge,J[0][0],J[0][1],J[0][2],{t:tt,cut:ML_TABLE.top,gaze:[2,1],smile:0.5});ml_tableFront(x);
      const p=ml_pop(tt,P.first-0.15,null);ag_textCard(x,1220,690,420,{kick:"First prize",title:"50,000 francs"},{k:p.k,a:p.a});}},
    // and now a pilot can let go, and rest: Sperry's hands leave the wheel and rest on the hull's edge
    {at:P.rest,place:null,keys:[[P.rest,960,540,1.04],[P.rest+0.1,960,520,1.08]],d:4,push:0.01,draw:(x,tt)=>{
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,rest:clamp((tt-P.letgo+0.2)/1.4,0,1),roll:0.01*Math.sin(tt)});}},
    // today: an airliner's flight deck, two pilots; a typical flight's timeline; one turns to look at a screen, the other nods
    {at:P.deck,dis:1.4,place:"mlDeck",keys:[[P.deck,960,560,1.02],[P.deck+0.1,960,540,1.05]],d:10,push:0.01,draw:(x,tt)=>{const D=ML_DECK,pt=ag_in(tt,P.watch-0.2,0.7);
      ag_person(x,ML_PEOPLE.officer,D.fo[0],D.fo[1],D.fo[2],{t:tt,cut:D.cut,gaze:[1+pt,0.3]});
      ag_person(x,ML_PEOPLE.captain,D.cap[0],D.cap[1],D.cap[2],{t:tt,cut:D.cut,nod:0.1*ag_io(tt,P.decide-0.1,P.decide+0.8,0.3),gaze:[1,0.2]});
      ml_deckFront(x);const a=ag_in(tt,P.only-0.3,0.5);ag_box(x,240,124,1440,192,24,{a});ml_timeline(x,320,232,1280,ag_in(tt,P.only,1.6),{a,labels:ag_in(tt,P.only+1.2,0.6)});}},
    // the box again, on the marble wall: hands, a check, a loop, but no model; then a model drops in, and it's an agent
    {at:P.room,dis:0.9,place:"lab",keys:[[P.room,1124,500,1.12],[P.put-0.4,1060,520,1.0]],d:2.4,push:0.01,draw:(x,tt)=>ml_boxRoom(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"1914"],[P.deck+0.6,"Today"],[P.room+0.2,null]],ag_in(t,0.6,0.6));
  ag_title(ctx,S,t,P.title,ML_TITLE,null,"WHAT AN AGENT IS · FILM 2 OF 9");});

// a second judge, younger, for the table
const ML_J2={name:"A judge",key:"ml-judge2",skin:[214,178,148],hair:{style:"side",c:[96,76,60]},beard:[110,90,72],top:{kind:"suit",c:[58,56,62],inner:[238,236,230],tie:[90,60,60]},breath:0.29};
// the box in the room, its labels one by one, the empty circle where a model would be, then the model dropping in and the agent's ring
function ml_boxRoom(x,tt,P){const [rx,ry]=ML_ROOM.ring;ag_roomLight(x,1);
  const drop=ag_in(tt,P.inside-0.3,0.9),grow=ag_in(tt,P.agent-0.6,1.4),boxA=1-ag_in(tt,P.agent-0.4,1.0),tipping=Math.sin((tt-P.check)*2.2)*ag_io(tt,P.check,P.loop-0.1,0.4);
  const s=0.55,bt=0.08*tipping,b=ml_box(x,rx,ry,s,{t:tt,tilt:bt,push:0.4*Math.max(0,tipping),hands:ag_in(tt,P.hands,0.5),check:ag_in(tt,P.check,0.4),
    checkCol:Math.abs(tipping)>0.25?AG.amber:AG.green,level:1,chain:1,empty:ag_in(tt,P.nom-0.1,0.5)*(1-drop),a:boxA});
  // the labels: hands on the piston, the check on the gyroscopes, the loop round the box
  const la=boxA;ag_label(x,b.piston[0]-40,b.piston[1]+74,"hands",{col:AG.blue,a:la*ag_in(tt,P.hands,0.4)});
  const ck=Math.abs(tipping)>0.25?AG.amber:AG.green,ca=la*ag_in(tt,P.check,0.4);ag_T(x,"a check: is it level?",rx,ry-284,{w:700,size:30,col:ck,a:ca,align:"center"});
  if(ca>0.01){x.save();x.globalAlpha*=ca;x.strokeStyle=rgba(ck,0.6);x.lineWidth=2;x.setLineDash([6,8]);x.beginPath();x.moveTo(rx,ry-266);x.lineTo(rx,b.level[1]-26);x.stroke();x.restore();}
  const R=lerp(250,180,grow),ringP=ag_sine(clamp((tt-P.loop+0.2)/1.4,0,1));
  ag_label(x,rx-266,ry+128,"a loop",{col:AG_OAK.dark,a:la*ag_in(tt,P.loop+0.4,0.4),align:"right"});
  ag_label(x,rx,ry+158,"no model",{col:AG.violet,align:"center",a:la*ag_in(tt,P.nom+0.1,0.4)*(1-drop)});
  const jb=ml_pop(tt,P.job-0.1,P.put-0.2);ag_pill(x,rx,ry+R+70,"one job: hold it level",{a:jb.a});
  // the model drops into the empty circle; then the ring closes in to the agent's, its sphere grows, and it takes Plan, Act and Check
  if(grow<=0){ag_ring(x,rx,ry,R,{p:ringP,from:-120,arrows:[-30]});
    if(drop>0){const y0=ry-560,fall=ag_eo(clamp(drop*1.25,0,1)),settle=drop>=0.8?Math.sin((drop-0.8)/0.2*Math.PI)*-10:0;
      ag_model(x,rx,lerp(y0,ry,fall)+settle,b.r,{t:tt,core:0.5});}}
  else{const ti=1-ag_in(tt,P.title,0.5);ag_loop(x,rx,ry,{t:tt,R,r:lerp(b.r,88,grow),label:grow>0.6&&ti>0.5?"Model":null,core:lerp(0.5,1,grow),
    stepA:[ag_in(tt,P.agent-0.2,0.4)*ti,ag_in(tt,P.agent+0.3,0.4)*ti,ag_in(tt,P.agent+0.8,0.4)*ti]});}}

/* ---------------------------------------------------------------- the room, today
   Chapters 2 to 8 share one room (the style prototype's layout, ML_ROOM): Jun at his desk on the left, the agent's ring right of
   centre, its tools down the right; the cards each chapter needs come and go between them. Things first, then the room's light,
   then cards and words. */
const ml_steps=(tt,t0,d)=>t0==null||tt<t0?-1:Math.floor((tt-t0)/d)%3;   // the lit step while the agent works round its ring

// ---- 2 · Jun's question: Planning asks; census day; the afternoon by hand; Jun gives it to an agent, and reviews and decides ----
scene("question",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({asks:wAt(sc,"today","asks"),cen:c.census,counts:wAt(sc,"census","counts"),hand:c.byhand,
    find:wAt(sc,"byhand","find"),read:wAt(sc,"byhand","read"),query:wAt(sc,"byhand","query"),check:wAt(sc,"byhand","check"),fix:wAt(sc,"byhand","fix"),
    gives:wAt(sc,"gives","gives"),agent:wAt(sc,"gives","agent"),takes:wAt(sc,"gives","takes"),checks:wAt(sc,"gives","checks"),reviews:wAt(sc,"gives","reviews"),
    decides:wAt(sc,"gives","decides")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,540,1],[0.1,950,530,1.03]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_question(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],ag_in(t,0.2,0.6));});
function ml_question(x,tt,P){const [rx,ry]=ML_ROOM.ring,into=ag_in(tt,P.gives+0.1,1.3),ring=ag_in(tt,P.agent-0.3,1.2);
  // the agent, once Jun gives it the job: its ring draws itself, the five cards slide in, and it works round its steps
  if(ring>0){const lit=ml_steps(tt,P.takes,0.55);ag_loop(x,rx,ry,{t:tt,p:ring,core:ring,a:ring,lit:tt>=P.checks?2:lit,col:tt>=P.checks?AG.green:AG.violet,stepA:[ring,ring,ring]});}
  ml_jun(x,tt,{gaze:tt<P.gives?[2,-1.2]:[3,-0.2],nod:0.06*ag_io(tt,P.decides-0.1,P.decides+0.7,0.3)});
  ag_roomLight(x,1);
  // Planning's question, beside him; it becomes the agent's goal
  const m=ml_pop(tt,P.asks-0.1,P.gives+0.1);ag_textCard(x,452,196,600,{kick:"From Planning",title:"How has the census-day count changed since last year?",sub:"for next year's classes"},
    {tail:{side:"left",at:0.8,px:418,py:468},k:m.k,a:m.a});
  const g=ml_pop(tt,P.gives+0.3,null),[gx,gy,gw]=ML_ROOM.goal;ag_textCard(x,gx,gy,gw,{kick:"Goal",title:"Census-day count",sub:"Compare it with last year"},{tail:{side:"bottom",at:0.1,px:430,py:436},k:g.k,a:g.a});
  // census day, on its calendar card, and what it is
  const off=1-ag_in(tt,P.gives,0.6),cl=ml_pop(tt,P.cen,null);ml_cal(x,1150,184,300,"31 March","census day",{k:cl.k,a:cl.a*off});
  const la=ag_in(tt,P.counts,0.5)*off;ag_T(x,"the day the university counts",1300,394,{w:600,size:28,align:"center",col:AG.mut,a:la});ag_T(x,"who is studying",1300,430,{w:600,size:28,align:"center",col:AG.mut,a:la});
  // by hand: an afternoon, and the five small steps, round and round from fix back to query
  const ck=ml_pop(tt,P.hand,null);ml_clock(x,1580,500,lerp(1,5,clamp((tt-P.hand)/7,0,1)),"an afternoon",{w:260,k:ck.k,a:ck.a*off});
  ml_byHand(x,tt,[ag_in(tt,P.find-0.1,0.4),ag_in(tt,P.read-0.1,0.4),ag_in(tt,P.query-0.1,0.4),ag_in(tt,P.check-0.1,0.4),ag_in(tt,P.fix-0.1,0.4)],
    {x:540,y:494,loop:ag_in(tt,P.fix+0.3,0.9),into,to:[rx,ry]});
  // while he reviews and decides
  const rv=ml_pop(tt,P.reviews,null);ag_pill(x,700,760,"review · decide",{a:rv.a});}

// ---- 3 · A model writes: four parts, the first a model; it writes what's likely to come next; a guess; it can't look up or check ----
scene("writes",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({four:c.four,model:wAt(sc,"four","model"),learned:c.learned,likely:wAt(sc,"learned","likely"),
    next:wAt(sc,"learned","next"),ask:c.guess,best:wAt(sc,"guess","best"),never:wAt(sc,"guess","never"),alone:c.alone,look:wAt(sc,"alone","look"),check:wAt(sc,"alone","check")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,950,530,1.03],[0.1,980,520,1.04]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_writes(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],1);
  ml_parts(ctx,[ag_in(t,P.model-0.1,0.5)],{a:ag_in(t,P.four,0.6)});});
function ml_writes(x,tt,P){const [rx,ry]=ML_ROOM.ring,pale=ag_in(tt,0.2,1.2);
  // the ring fades to a pale outline; the sphere alone, its label
  ml_pages(x,tt,rx,ry,88,ag_io(tt,P.learned,P.likely+0.6,0.6));
  ag_modelLight(x,rx,ry,88,1);ag_ring(x,rx,ry,180,{p:1,from:-120,a:lerp(1,0.22,pale)});
  for(const [s,d] of AG_LOOP.steps){const r=d*Math.PI/180;ag_step(x,rx+Math.cos(r)*180,ry+Math.sin(r)*180,s,{a:1-pale});}
  ag_model(x,rx,ry,88,{t:tt,core:1,think:ag_io(tt,P.likely,P.best+1.5,0.5),label:"Model"});
  ml_jun(x,tt,{gaze:[3,-0.4]});
  // the student records, shut behind glass, out of the sphere's reach
  const cb=ml_pop(tt,P.never-0.1,null);ml_cabinet(x,1520,560,260,230,{a:cb.a});
  ag_roomLight(x,1);
  const g=1-ag_in(tt,0.1,0.6),[gx,gy,gw]=ML_ROOM.goal;ag_textCard(x,gx,gy,gw,{kick:"Goal",title:"Census-day count",sub:"Compare it with last year"},{tail:{side:"bottom",at:0.1,px:430,py:436},a:g});
  // it writes what's likely to come next: "The university has about", three words waiting, and the first is picked
  const w1=ag_io(tt,P.likely-0.4,P.ask+0.2,0.4),k1=clamp((tt-P.likely+0.3)/1.3,0,1);
  ml_written(x,1240,196,620,"The university has about",k1,{a:w1,ka:ag_spr(tt,P.likely-0.4,0.8),cands:["18,000","20,000","15,000"],
    candA:[ag_in(tt,P.likely+1.0,0.3),ag_in(tt,P.likely+1.15,0.3),ag_in(tt,P.likely+1.3,0.3)],pick:ag_in(tt,P.likely+2.2,0.6)});
  // asked for the census-day count, the best it can write is a guess
  const q=ml_pop(tt,P.ask,null);ag_textCard(x,gx,gy,520,{title:"How many students on census day?"},{tail:{side:"bottom",at:0.1,px:430,py:436},k:q.k,a:q.a});
  const w2=ag_in(tt,P.best-0.3,0.4),ans=ml_written(x,1240,196,620,"About 18,000, probably.",clamp((tt-P.best)/1.2,0,1),{a:w2});
  // on its own it can't look anything up, or check what it wrote
  const p1=ml_pop(tt,P.look,null),p2=ml_pop(tt,P.check,null);
  ag_pill(x,1400,ans.y+ans.h+50,"looked up: nothing",{a:p1.a*w2});ag_pill(x,1712,ans.y+ans.h+50,"checked: no",{a:p2.a*w2});}

// the agent in its ring, drawn piece by piece so each can fade: o.ringA, o.stepA, o.core, o.think, o.lit (the lit step) and o.col, o.pulse
function ml_agent(x,tt,o){o=o||{};const [rx,ry]=ML_ROOM.ring,R=180,r=88,ra=o.ringA==null?1:o.ringA,sa=o.stepA==null?1:o.stepA;
  ag_modelLight(x,rx,ry,r,o.core==null?1:o.core);if(ra>0.01)ag_ring(x,rx,ry,R,{p:1,from:-120,pulse:o.pulse,a:ra});
  ag_model(x,rx,ry,r,{t:tt,core:o.core,think:o.think,label:"Model"});
  return AG_LOOP.steps.map(([s,d],i)=>{const q=d*Math.PI/180;return ag_step(x,rx+Math.cos(q)*R,ry+Math.sin(q)*R,s,{on:o.lit===i?(o.col||AG.violet):null,a:sa});});}
// a pellet riding along the ring from degrees d0 to d1, then into the sphere (u 0 to 1)
function ml_ride(x,u,d0,d1){if(u<=0||u>=1)return;const [rx,ry]=ML_ROOM.ring;let px,py;
  if(u<0.7){const d=lerp(d0,d1,u/0.7)*Math.PI/180;px=rx+Math.cos(d)*180;py=ry+Math.sin(d)*180;}
  else{const d=d1*Math.PI/180,v=(u-0.7)/0.3;px=lerp(rx+Math.cos(d)*180,rx,v);py=lerp(ry+Math.sin(d)*180,ry,v);}
  ag_pellet(x,px,py,1-sstep(0.9,1,u));}
// a card's flight out of the sphere (u 0 to 1) along a curve from (x0, y0) by (x1, y1) to (x2, y2): where its middle is, and its size,
// full by halfway, so its words can come while it's still on its way
function ml_fly(u,x0,y0,x1,y1,x2,y2){const e=ag_eo(u),q=(a0,a1,a2)=>(1-e)*(1-e)*a0+2*(1-e)*e*a1+e*e*a2;return{x:q(x0,x1,x2),y:q(y0,y1,y2),s:lerp(0.3,1,ag_eo(clamp(u/0.55,0,1)))};}
// the parts row: those already met stay lit, softer
const ml_partsOn=(t,i,ti)=>[0,1,2,3].map(k=>k<i?0.45:k===i?ag_in(t,ti-0.1,0.5):0);

// ---- 4 · Reasoning: a plan, checked against the team's rules; each result read as feedback ----
scene("reasons",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({reason:wAt(sc,"second","reasoning"),plan:c.plan,writes:wAt(sc,"plan","writes"),
    find:wAt(sc,"plan","find"),count:wAt(sc,"plan","count"),report:c.report,check3:wAt(sc,"report","check"),census:wAt(sc,"report","census"),
    rules:c.rules,tools:wAt(sc,"rules","tools"),reading:wAt(sc,"rules","reading"),evidence:wAt(sc,"rules","evidence"),
    result:c.result,feedback:wAt(sc,"result","feedback"),changes:wAt(sc,"result","changes"),is:c.is,fb2:wAt(sc,"is","feedback"),cks:wAt(sc,"is","checks")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,980,520,1.04],[0.1,990,520,1.05]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_reasons(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],1);ml_parts(ctx,ml_partsOn(t,1,P.reason));});
function ml_reasons(x,tt,P){const back=ag_in(tt,0.2,1.2),fb=[P.feedback,P.feedback+1.6],ride=fb.reduce((m,f)=>Math.max(m,ag_io(tt,f-0.2,f+1.5,0.3)),0);
  ml_agent(x,tt,{ringA:lerp(0.22,1,back),stepA:back,core:1+0.4*ride,think:ag_io(tt,P.writes,P.check3+2,0.5)+ag_io(tt,P.evidence+0.6,P.evidence+2.4,0.4)});
  for(const f of fb)ml_ride(x,clamp((tt-f)/1.3,0,1),0,120);
  ml_jun(x,tt,{gaze:[3,-0.6]});
  ag_roomLight(x,1);
  // the plan, written out line by line; the sphere's light runs down it, and each line meets the rules
  const ka=ag_spr(tt,P.writes-0.2,0.8),tk=i=>ag_in(tt,P.evidence+0.8+i*0.35,0.3);
  const pl=ml_plan(x,1350,150,500,["1 Find the tables","2 Count the students","3 Check the total against the census report"],{a:ag_in(tt,P.writes-0.2,0.4),ka,
    k:[clamp((tt-P.find)/0.8,0,1),clamp((tt-P.count)/0.8,0,1),clamp((tt-P.check3)/1.4,0,1)],tick:[tk(0),tk(1),tk(2)]});
  const sw=ag_io(tt,P.evidence+0.6,P.evidence+2.0,0.2),sy=lerp(pl.y+70,pl.y+pl.h-20,clamp((tt-P.evidence-0.6)/1.3,0,1));
  if(sw>0.01){x.save();x.globalAlpha*=sw;const g=x.createLinearGradient(pl.x,sy,pl.x+pl.w,sy);g.addColorStop(0,rgba(AG.violet,0));g.addColorStop(0.5,rgba(AG.violet,0.5));g.addColorStop(1,rgba(AG.violet,0));
    x.fillStyle=g;x.fillRect(pl.x+10,sy-3,pl.w-20,6);x.restore();}
  // the census report, the university's official count
  const cr=ml_pop(tt,P.census-0.1,null);ag_textCard(x,500,560,410,{kick:"Census report",title:"31 March 2026",sub:"the university's official count"},{k:cr.k,a:cr.a});
  // the rules Jun's team gave it, from his side
  const rl=ag_spr(tt,P.rules-0.1,0.8);ml_rules(x,452,214,470,{a:ag_in(tt,P.rules-0.1,0.4),ka:rl,tail:{side:"bottom",at:0.08,px:430,py:430},
    k:[ag_in(tt,P.tools-0.4,0.4),ag_in(tt,P.reading-0.2,0.4),ag_in(tt,P.evidence-0.2,0.4)]});
  // reasoning is feedback, and checks against rules
  ag_label(x,1290,650,"feedback",{col:AG.orange,a:ag_in(tt,P.fb2,0.4)});
  ag_label(x,pl.x+pl.w/2,pl.y+pl.h+50,"checks against rules",{col:AG.green,align:"center",a:ag_in(tt,P.cks,0.4)});}

// ---- 5 · Hands: tools, each from a tool server, plugged in through an open standard; these three can only read ----
scene("hands",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({hands:wAt(sc,"third","hands"),open:wAt(sc,"third","open"),tools:wAt(sc,"third","tools"),three:c.three,
    catalog:wAt(sc,"three","Catalog"),query:wAt(sc,"three","Query"),docs:wAt(sc,"three","Docs"),server:c.server,tsrv:wAt(sc,"server","server"),
    std:wAt(sc,"mcp","standard"),proto:wAt(sc,"mcp","Protocol"),any:wAt(sc,"mcp","any"),use:wAt(sc,"mcp","use"),read:c.read,only:wAt(sc,"read","only"),
    account:wAt(sc,"read","account"),row:wAt(sc,"read","row")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,990,520,1.05],[0.1,1000,520,1.04]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_hands(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],1);ml_parts(ctx,ml_partsOn(t,2,P.hands));});
function ml_hands(x,tt,P){const [rx,ry]=ML_ROOM.ring,arr=[P.catalog,P.query,P.docs],plug=ag_in(tt,P.std-0.2,0.5),lock=ag_io(tt,P.only-0.1,P.account+1.2,0.4);
  ml_agent(x,tt,{core:1,lit:tt>P.tools-0.3&&tt<P.docs+1.5?1:null,col:AG.blue});ml_jun(x,tt,{gaze:[3,-0.5]});
  // a model can't open a table: the sphere's light touches a closed card, and nothing opens
  const tb=ag_io(tt,P.open-0.6,P.tools+0.3,0.3),sh=Math.sin((tt-P.open)*30)*6*ag_io(tt,P.open,P.open+0.5,0.1);
  if(tb>0.01){const bx=1440+sh;x.save();x.globalAlpha*=tb;x.strokeStyle=rgba(AG.violet,0.5*ag_in(tt,P.open-0.3,0.3));x.lineWidth=4;x.setLineDash([8,10]);
      x.beginPath();x.moveTo(rx+96,ry);x.lineTo(bx-6,ry);x.stroke();x.setLineDash([]);
    ag_box(x,bx,ry-56,220,112,20,{});ag_T(x,"Students",bx+28,ry-6,{w:700,size:32});ag_lock(x,bx+40,ry+26,28,rgba(AG.blue,1));ag_T(x,"a table",bx+64,ry+34,{w:600,size:28,col:AG.mut});x.restore();}
  // but tools can: three arms unfold from Act, and the three tools come in from the right, each from its server
  ML_ROOM.tools.forEach((tl,i)=>{const t0=arr[i],dx=lerp(420,0,ag_eo(ag_in(tt,t0-0.5,0.8))),ta=ag_in(tt,t0-0.5,0.5);
    const u=0.6*ag_sine(ag_in(tt,P.tools-0.1,1.0))+0.4*ag_sine(ag_in(tt,t0+0.1,0.6));
    ml_tool(x,i,{dx,a:ta,touch:u>0.95?1:0,lock,server:ag_in(tt,P.tsrv-0.2+i*0.25,0.5),plug});
    ag_reach(x,ml_arm(i),u,{grip:u>0.95?1:0});if(plug>0.01&&u>0.95){const e=ml_arm(i);ml_plug(x,e[6]-6,e[7],0,1,"#3E3F45",plug);}});
  ag_T(x,"tool server",ML_ROOM.tx+ML_ROOM.tw-76,ML_ROOM.tools[0][1]-50,{w:600,size:28,col:AG.mut,align:"right",a:ag_io(tt,P.tsrv,P.std+0.6,0.4)});
  // any agent that follows the standard can use them: a second sphere, grey, plugs into Catalog's server from above, and leaves
  const g2=ag_io(tt,P.any-0.4,P.use+1.4,0.7),gy=lerp(-120,96,ag_eo(ag_in(tt,P.any-0.4,0.9)))-lerp(0,260,ag_in(tt,P.use+0.9,0.8)),gx=ML_ROOM.tx+ML_ROOM.tw-5;
  if(g2>0.01){x.save();x.globalAlpha*=g2;x.strokeStyle="#8C8A86";x.lineWidth=9;x.lineCap="round";x.beginPath();x.moveTo(gx,gy+40);x.lineTo(gx,gy+70);x.stroke();
    ml_plug(x,gx,gy+82,Math.PI/2,1,"#3E3F45",1);ag_soft(x,c=>c.arc(gx,gy,42,0,TAU),[176,176,178],[236,236,238],gx+14,gy-16,56,"rgba(46,38,28,0.3)",10,0.8);
    x.fillStyle=rgba([120,120,124],0.9);x.beginPath();ag_rect(x,gx-26,gy-8,52,14,7);x.fill();x.restore();}
  ag_roomLight(x,1);
  // the open standard, under the ring; then what their account can do
  const mp=ag_io(tt,P.proto-0.3,P.read,0.4);ag_T(x,"Model Context Protocol",rx,742,{w:700,size:30,align:"center",a:mp});ag_T(x,"an open standard",rx,780,{w:500,size:28,align:"center",col:AG.mut,a:mp});
  ag_pill(x,rx,766,"Account: read only · can't change a row",{a:ag_in(tt,P.account-0.1,0.4),col:AG.blue,icon:"lock"});}

// ---- 6 · A loop: plan, act, check, round again; round one falls short of the census report; the model reads the rule; round two matches ----
scene("loop",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({loopW:wAt(sc,"fourth","loop"),planW:wAt(sc,"fourth","plan"),act:wAt(sc,"fourth","act"),
    checkW:wAt(sc,"fourth","check"),round:wAt(sc,"fourth","round"),goal:wAt(sc,"fourth","goal"),counts:c.counts,catalog:wAt(sc,"counts","Catalog"),query:wAt(sc,"counts","Query"),
    short:c.short,chk:wAt(sc,"short","check"),n476:wAt(sc,"short","476"),today:c.today,asare:wAt(sc,"today","count"),rule:c.rule,docs:wAt(sc,"rule","Docs"),
    stood:wAt(sc,"rule","stood"),again:c.again,date:wAt(sc,"again","date"),gives:wAt(sc,"again","gives"),passes:c.passes,matches:wAt(sc,"passes","matches"),
    pass:wAt(sc,"passes","passes"),unlike:c.unlike,push:wAt(sc,"unlike","push"),decides:wAt(sc,"unlike","decides"),stops:c.stops,cks:wAt(sc,"stops","checks"),
    limit:wAt(sc,"stops","limit"),person:wAt(sc,"stops","person")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,1000,520,1.04],[0.1,990,530,1.03]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_loopRoom(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],1);ml_parts(ctx,ml_partsOn(t,3,P.loopW));});
function ml_loopRoom(x,tt,P){const [rx,ry]=ML_ROOM.ring;
  // where the agent is in its loop: once round, Plan, Act, Check and back, then each round's steps
  const keys=[[P.planW,-120],[P.act,0],[P.checkW,120],[P.round+0.4,240],[P.catalog-0.3,360],[P.chk,480],[P.rule-0.3,600],[P.again-0.2,720],[P.matches-0.3,840]];
  // the light arrives at each key's step at the key's time, moving there over the 1.2 s before (less when the keys are closer)
  let deg=-120,pa=0;for(let i=0;i<keys.length;i++){if(tt<keys[i][0])break;const nx=keys[i+1],d=nx?Math.min(1.2,nx[0]-keys[i][0]):1,u=nx?ag_sine(clamp((tt-nx[0]+d)/d,0,1)):1;
    deg=nx?lerp(keys[i][1],nx[1],u):keys[i][1];pa=1;}
  pa*=1-ag_in(tt,P.unlike-0.4,0.6)+ag_in(tt,P.stops,0.6)*0;
  const step=((Math.round((deg+120)/120)%3)+3)%3,lit=tt<P.planW||tt>P.unlike-0.4?(tt>P.pass?2:null):step,okC=tt>P.pass;
  ml_agent(x,tt,{core:1,think:ag_io(tt,P.today,P.rule+1,0.5)+ag_io(tt,P.unlike,P.decides+1.2,0.5),lit,col:okC&&lit===2?AG.green:lit===2&&tt>P.chk-0.3?AG.amber:AG.amber,pulse:{deg,a:pa}});
  // the arms rest on the tools; one takes hold as the agent uses its tool, and orange pellets ride back
  const use=[[P.catalog-0.3],[P.query-0.3,P.again+0.2],[P.docs-0.3]];
  ML_ROOM.tools.forEach((tl,i)=>{let on=0,d=0;for(const u0 of use[i]){on=Math.max(on,ag_io(tt,u0,u0+2.2,0.3));const v=clamp((tt-u0-0.4)/1.4,0,1);if(v>0&&v<1)d=v;}
    ml_tool(x,i,{touch:on,server:1,plug:1});ag_reach(x,ml_arm(i),1,{grip:1,data:d});const e=ml_arm(i);ml_plug(x,e[6]-6,e[7],0,1,"#3E3F45",1);});
  ml_jun(x,tt,{gaze:tt>P.person-0.3?[3,-1.4]:[3,-0.5],nod:0.06*ag_io(tt,P.person,P.person+0.8,0.3)});
  ag_roomLight(x,1);
  // the goal, above Jun: it glows on "until the goal is met"
  const [gx,gy,gw]=ML_ROOM.goal,gg=ag_io(tt,P.goal-0.1,P.goal+1.6,0.4);
  ag_textCard(x,gx,gy,gw,{kick:"Goal",title:"Census-day count",sub:"Compare it with last year"},{tail:{side:"bottom",at:0.1,px:430,py:436},edge:gg>0.05?AG.amber:null,a:ag_in(tt,0,0.6)});
  if(gg>0.01){x.save();x.globalAlpha*=gg*0.5;x.shadowColor=rgba(AG.amber,0.9);x.shadowBlur=30;x.strokeStyle=rgba(AG.amber,0.8);x.lineWidth=3;x.beginPath();ag_rect(x,gx,gy,gw,136,22);x.stroke();x.restore();}
  // slot A, what the agent is looking at: the students' table, the census report, the census rule, the census report again
  const off=1-ag_in(tt,P.unlike-0.4,0.6),A=(t0,t1)=>ml_pop(tt,t0,t1);
  let a=A(P.catalog+0.7,P.short-0.2);ag_textCard(x,480,388,450,{kick:"Catalog · a table",title:"Students",sub:"one row for each version of a record, with the dates it was true"},{k:a.k,a:a.a*off,kickCol:AG.blue});
  a=A(P.short,P.rule-0.2);ml_query(x,480,388,450,"Census report","31 March 2026 · students studying","18,412",{col:AG.ink,kickCol:AG.mut,ka:a.k,a:a.a*off});
  a=A(P.stood-0.8,P.passes-0.2);ag_textCard(x,480,388,450,{kick:"Docs · census day",title:"Count each student as their record stood that day"},{k:a.k,a:a.a*off,kickCol:AG.blue});
  a=A(P.passes,null);ml_query(x,480,388,450,"Census report","31 March 2026 · students studying","18,412",{col:AG.ink,kickCol:AG.mut,ka:a.k,a:a.a*off});
  // slot B, the query and what comes back
  a=A(P.query+0.3,P.again-0.2);ml_query(x,480,630,450,"Query 1","Count students who are studying","17,936",{numA:ag_in(tt,P.query+1.6,0.4),note:"476 short",noteA:ag_in(tt,P.n476,0.4),ka:a.k,a:a.a*off});
  a=A(P.again+0.1,null);ml_query(x,480,630,450,"Query 2","Count students who were studying on 31 March 2026","18,412",{numA:ag_in(tt,P.gives+0.4,0.4),col:tt>P.matches?AG.green:AG.orange,
    note:"= census report",noteA:0,ka:a.k,a:a.a*off});
  if(tt>P.matches-0.2){const eq=ag_in(tt,P.matches-0.2,0.4)*off;ag_T(x,"= 18,412",900,836,{w:700,size:30,col:AG.green,align:"right",a:eq});}
  // slot C, its thinking: did it count them as they are today? then a fourth line in its plan
  const th=ag_io(tt,P.asare-0.6,P.rule-0.1,0.4);ml_thought(x,900,150,"Counted as they are today?",th,{k:ag_spr(tt,P.asare-0.6,0.8),px:rx-60,py:ry-80});
  const pl=ag_io(tt,P.rule-0.2,P.again+0.4,0.4);ml_plan(x,900,112,560,["4 Read the census rule (Docs)"],{a:pl,ka:ag_spr(tt,P.rule-0.2,0.8),fresh:[1],k:[clamp((tt-P.rule)/1.0,0,1)]});
  // the check: amber while it doesn't match, green when it does
  const vA=ag_in(tt,P.chk+0.2,0.4);if(tt<P.matches)ag_verdict(x,rx,724,"Doesn't match yet","loop",vA);else ag_verdict(x,rx,724,"Matches the source","pass",1);
  // unlike Sperry's box, which can only push back: the model decides what to try next
  const un=ag_io(tt,P.unlike-0.2,P.stops-0.2,0.5);if(un>0.01){x.save();x.globalAlpha*=un;ag_box(x,480,380,440,330,24,{});
    ml_box(x,700,520,0.36,{t:tt,tilt:0.1*Math.sin(tt*2),push:0.5+0.5*Math.sin(tt*2),level:1,chain:1});
    ag_T(x,"Sperry's box",700,428,{w:700,size:30,align:"center"});ag_T(x,"push back",700,668,{w:700,size:30,align:"center",col:AG.amber});x.restore();}
  const nx=[["read Docs",rx-150,206],["ask Jun",rx+60,206],["query again",rx+270,206]],pick=ag_in(tt,P.decides,0.4);
  nx.forEach(([s,px,py],i)=>{const a2=ag_io(tt,P.unlike+0.6+i*0.15,P.stops-0.2,0.4);if(a2<=0.01)return;ag_pill(x,px,py,s,{a:a2*(i===0?lerp(0.55,1,pick):lerp(0.55,0.35,pick)),col:i===0&&pick>0.5?AG.violet:null});});
  // the loop stops: when the checks pass, at its limit of tries, or when it needs a person
  const st=[["checks pass",rx-300,P.cks],["limit: 10 rounds",rx,P.limit],["a person: ask Jun",rx+330,P.person]];
  st.forEach(([s,px,t0],i)=>{const a2=ag_in(tt,t0-0.1,0.4);if(a2>0.01)ag_pill(x,px,806,s,{a:a2,col:i===0?AG.green:null});});}

// ---- 7 · The answer, with its evidence: the agent brings it to Jun and draws back; the evidence fans out; Jun reads it, signs, and it goes to Planning ----
scene("answer",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({brings:wAt(sc,"brings","brings"),evid:wAt(sc,"evid","evidence"),tables:wAt(sc,"evid","tables"),
    rule:wAt(sc,"evid","rule"),both:wAt(sc,"evid","both"),check:wAt(sc,"evid","check"),cev:wAt(sc,"decides","evidence"),appr:wAt(sc,"decides","approval"),
    reads:wAt(sc,"decides","reads"),decides:wAt(sc,"decides","decides"),planning:wAt(sc,"decides","Planning")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,990,530,1.03],[0.1,980,530,1.02]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_answerRoom(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],1);ml_parts(ctx,[0.45,0.45,0.45,1],{a:1-ag_in(t,0.3,0.8)});});
function ml_answerRoom(x,tt,P){const [rx,ry]=ML_ROOM.ring,A=ML_ANS,R=ML_REST,W=A.w,EP=ml_evPlaces(x),h=EP.card.h;
  // the agent lets go of its tools, which slide away to the right; its steps go quiet, and it draws back, smaller, to the top right
  const hold=1-ag_sine(ag_in(tt,P.brings-0.2,0.8)),away=ag_eo(ag_in(tt,P.brings+0.4,1.0)),sa=1-ag_in(tt,P.brings+0.9,0.4),mv=ag_sine(ag_in(tt,P.brings+1.3,1.6));
  ml_small(x,tt,lerp(rx,R[0],mv),lerp(ry,R[1],mv),lerp(180,R[2],mv),lerp(88,R[3],mv),{stepA:sa,label:sa,core:1,lit:tt<P.brings-0.2?2:null,col:AG.green});
  if(away<1)ML_ROOM.tools.forEach((tl,i)=>{ml_tool(x,i,{dx:560*away,a:1-away,server:1,plug:1});ag_reach(x,ml_arm(i),hold,{grip:hold>0.95?1:0});
    const e=ml_arm(i);ml_plug(x,e[6]-6,e[7],0,1,"#3E3F45",clamp((hold-0.85)/0.15,0,1)*(1-away));});
  // Jun watches it come, reads the evidence as it fans out, then again from the top; nods, signs, and watches it go
  const gy=ml_pw(tt,[[0,-0.5],[P.brings+0.6,-0.5],[P.brings+1.4,-0.35],[P.tables-0.2,-0.35],[P.tables+0.3,-0.75],[P.rule+0.3,-0.4],[P.both+0.5,0.1],[P.check+0.4,0.55],
    [P.cev,0.55],[P.cev+0.4,-0.35],[P.appr+0.3,0.3],[P.reads-0.2,-0.75],[P.decides-0.1,0.5],[P.decides+0.2,0.3],[P.planning+0.2,0.3],[P.planning+0.8,-1.2]]);
  ml_jun(x,tt,{gaze:[3,gy],nod:0.07*ag_io(tt,P.decides-0.3,P.decides+0.5,0.3),smile:0.25*ag_in(tt,P.decides+0.4,0.8)});
  ag_roomLight(x,1);
  // the goal, met: it goes as the answer comes to rest where it was
  const [gx,gy0,gw]=ML_ROOM.goal,ga=1-ag_in(tt,P.brings+0.7,0.5);
  if(ga>0.01)ag_textCard(x,gx,gy0,gw,{kick:"Goal",title:"Census-day count",sub:"Compare it with last year"},{tail:{side:"bottom",at:0.1,px:430,py:436},a:ga});
  // the answer leaves the sphere as a small blank card and flies to Jun, full size halfway; its words come while it's still on its way
  const fl=clamp((tt-P.brings)/1.3,0,1),F=ml_fly(fl,rx,ry,880,250,A.x+W/2,A.y+h/2),wa=ag_in(tt,P.brings+0.7,0.3),ox=F.x-(A.x+W/2),oy=F.y-(A.y+h/2);
  if(fl>0&&wa<1){x.save();x.translate(F.x,F.y);x.scale(F.s,F.s);ag_box(x,-W/2,-h/2,W,h,22,{a:(1-wa)*ag_in(tt,P.brings,0.2)});x.restore();}
  // it goes up to Planning once Jun has signed: the answer, its check and his name; the evidence stays with him
  const lu=clamp((tt-P.planning-0.2)/1.1,0,1),dy=-820*lu*lu,la=1-sstep(0.6,1,lu);
  // the evidence fans out, each piece as it's named: the tables, the rule, both queries, the check
  const op=ml_pw(tt,[[P.tables-0.25,0],[P.rule-0.25,0.161],[P.both-0.25,0.321],[P.both+0.1,0.482],[P.check-0.25,0.643],[P.check+0.75,1]]);
  if(op<1){x.save();x.translate(ox,oy);ag_evidence(x,A.x,A.y,W,ML_ANSW,ML_EV,{side:"right",ew:A.ew,gap:A.gap,open:op,a:wa});x.restore();}
  else{if(la>0.01)ag_evidence(x,A.x,A.y+dy,W,ML_ANSW,[],{side:"right",ew:A.ew,gap:A.gap,a:wa*la});EP.items.forEach((e,i)=>ml_evItem(x,e,ML_EV[i]));}
  // the check comes with it, under the answer: evidence, not approval
  const vm=ag_sine(ag_in(tt,P.brings+1.0,1.0)),gl=ag_io(tt,P.cev-0.2,P.cev+0.9,0.3);if(la>0.01){x.save();if(gl>0.01){x.shadowColor=rgba(AG.green,0.8*gl);x.shadowBlur=26*gl;}
    ag_verdict(x,lerp(rx,A.x+W/2,vm),lerp(724,A.y+h+46,vm)+dy,"Matches the source","pass",la);x.restore();}
  // "Approved by:", with nothing after it, until Jun signs
  const ap=ml_pop(tt,P.appr-0.1,null);ml_approve(x,A.x,A.y+h+92+dy,W,"Jun",clamp((tt-P.decides-0.05)/0.7,0,1),{k:ap.k,a:ap.a*la});
  const tp=ag_in(tt,P.planning-0.15,0.35);ag_pill(x,A.x+W/2,A.y-44+dy,"To Planning",{a:tp*la});}

// ---- 8 · A plain script: next March the steps are known; the evidence becomes a recipe with a test, and Noor approves it; it runs in seconds
//      every census day, like Sperry's box; the agent took four minutes; once, the long way; plain scripts for known steps, agents for the rest ----
scene("script",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({March:wAt(sc,"march","March"),steps:wAt(sc,"march","steps"),
    project:wAt(sc,"recipe","project"),test:wAt(sc,"recipe","test"),noor:wAt(sc,"recipe","Noor"),approves:wAt(sc,"recipe","approves"),
    runs:c.runs,rIn:wAt(sc,"runs","runs"),like:wAt(sc,"runs","like"),
    took:c.took,four:wAt(sc,"took","four"),plain:wAt(sc,"took","plain"),needs:wAt(sc,"took","needs"),
    web:c.web,searched:wAt(sc,"web","searched"),webW:wAt(sc,"web","web"),docs:wAt(sc,"docs","Docs"),plan:wAt(sc,"docs","plan"),
    names:c.names,namesW:wAt(sc,"names","names"),gives:wAt(sc,"names","gives"),only:wAt(sc,"names","only"),
    known:c.known,plainS:wAt(sc,"known","plain"),keep:c.keep,agents:wAt(sc,"keep","agents")}));
  ml_shots(ctx,S,t,sc.dur,[
    // Jun's room: next March's calendar; the evidence lines up into a recipe, with its test; Noor approves it; it runs each census day; the agent rests
    {at:0,place:"lab",keys:[[0,980,530,1.02],[0.1,990,530,1.03]],d:P.web,push:0.01,draw:(x,tt)=>ml_recipeRoom(x,tt,P)},
    // once: an agent whose plan named no tools took the long way, out to the web, though Docs had the rules; now each plan names them
    {cut:true,at:P.web-0.4,dis:0.7,place:"lab",keys:[[P.web-0.4,1000,520,1.04],[P.web-0.3,990,520,1.02]],d:8,push:0.01,draw:(x,tt)=>ml_longWay(x,tt,P)},
    // two columns on the wall: a plain script for the steps that are known, an agent for the steps nobody can write in advance
    {cut:true,at:P.known-0.4,dis:0.7,place:"lab",keys:[[P.known-0.4,960,520,1.02],[P.known-0.3,960,530,1.0]],d:6,push:0.01,draw:(x,tt)=>ml_twoCols(x,tt,{
      aL:ag_in(tt,P.known-0.3,0.6),rm:ag_sine(ag_in(tt,P.plainS-0.7,0.9)),rl:ag_in(tt,P.plainS,0.4),aR:ag_in(tt,P.keep-0.4,0.6),am:ag_sine(ag_in(tt,P.agents-0.3,1.1)),
      al:ag_in(tt,P.agents+0.6,0.4)})}]);
  ml_kick(ctx,t,[[0,"Today"],[P.web-0.2,"Once"],[P.names-0.1,"Today"]],1);});
function ml_recipeRoom(x,tt,P){const R=ML_REST,EP=ml_evPlaces(x),RC={x:860,y:232,w:560},RB=ml_recipe(x,RC.x,RC.y,RC.w,{a:0,foot:"x"}),
    YR=[["2027",680],["2028",1000],["2029",1320]],runAt=[P.rIn,P.rIn+1.6,P.rIn+3.2];
  // the agent, resting small at the top right; "four minutes and twelve steps"; and as a plain rerun needs no agent, its band dims
  const dim=ag_in(tt,P.needs-0.1,0.9);ml_small(x,tt,R[0],R[1],R[2],R[3],{stepA:0,core:lerp(1,0.12,dim)});
  ml_jun(x,tt,{gaze:[3,ml_pw(tt,[[0,0.2],[P.March-0.4,0.2],[P.March,-0.45],[P.steps,-0.45],[P.steps+0.6,-0.3],[P.noor,-0.3],[P.noor+0.4,0.3],
    [P.runs,0.3],[P.runs+0.5,0.35],[P.four-0.2,0.35],[P.four+0.3,-0.9]])],nod:0.05*ag_io(tt,P.approves,P.approves+0.7,0.3)});
  ag_roomLight(x,1);
  // each census day the recipe runs: a light from it down to that year's card
  const fold=ag_in(tt,P.runs-0.3,0.9),yA=1-ag_in(tt,P.plain-0.3,0.6),rb=RC.y+136+44;
  for(let i=0;i<3;i++){const a=ag_in(tt,runAt[i]-0.3,0.4)*yA;if(a<=0.01)continue;const cx=YR[i][1]+140,p=[RC.x+RC.w/2,rb+4,RC.x+RC.w/2,rb+40,cx,440,cx,474];
    x.save();x.globalAlpha*=a;x.strokeStyle=rgba(AG.blue,0.5);x.lineWidth=3;x.setLineDash([6,8]);ag_bzPath(x,p,0,1);x.stroke();x.setLineDash([]);
    const u=clamp((tt-runAt[i]+0.2)/0.6,0,1);if(u>0&&u<1){const q=ag_bz(p,ag_sine(u));x.shadowColor=rgba(AG.blue,0.7);x.shadowBlur=14;x.fillStyle=rgba(AG.blue,1);x.beginPath();x.arc(q[0],q[1],8,0,TAU);x.fill();}
    x.restore();}
  // the recipe: it comes as the steps are known; the steps that worked fly into it and become its lines, the test in green; saved in the project
  const rc=ml_pop(tt,P.steps-0.35,null),dest=[0,1,null,2,3],arr=i=>P.steps+0.2+i*0.15;
  ml_recipe(x,RC.x,RC.y,RC.w,{ka:rc.k,a:rc.a,k:[0,1,3,4].map(i=>ag_in(tt,arr(i)+0.6,0.4)),tick:ag_in(tt,P.test,0.4),fold,foot:"Saved in the project",footA:ag_in(tt,P.project-0.1,0.4)});
  // the evidence from the answer: the first query, which fell short, is left out
  EP.items.forEach((e,i)=>{const d=dest[i];if(d==null){const u=ag_in(tt,P.steps,0.7);ml_evItem(x,e,ML_EV[i],{a:1-u,dy:30*u});return;}
    const u=clamp((tt-arr(i))/0.9,0,1),v=ag_sine(u);ml_evItem(x,e,ML_EV[i],{dx:(RC.x+12-e.x)*v,dy:(RB.ly(d)-56-e.y)*v,a:1-sstep(0.55,1,u)});});
  // Noor's review: she approves it
  const rv=ml_pop(tt,P.noor-0.25,P.runs-0.3),ry=RC.y+RB.h+36;ag_textCard(x,RC.x,ry,RC.w,{kick:"Review",title:"Noor",sub:"data architect"},{k:rv.k,a:rv.a,kickCol:AG.mut});
  const ok=ag_in(tt,P.approves,0.4)*rv.a;if(ok>0.01)ag_pill(x,RC.x+RC.w-150,ry+88,"approved",{a:ok,col:AG.green,icon:"tick"});
  // next March: a calendar where the answer was, rolling from 2026 to 2027; it becomes the first census day the recipe runs on, then 2028, 2029
  const cm=ag_sine(ag_in(tt,P.runs-0.3,0.9)),cl=ml_pop(tt,P.March-0.3,null);
  ml_cal(x,lerp(452,YR[0][1],cm),lerp(232,480,cm),280,"31 March","2027",{from:"2026",roll:clamp((tt-P.March-0.2)/0.7,0,1),k:cl.k,a:cl.a*yA,tick:ag_in(tt,runAt[0]+0.4,0.4)});
  for(let i=1;i<3;i++){const p=ml_pop(tt,runAt[i]-0.3,null);ml_cal(x,YR[i][1],480,280,"31 March",YR[i][0],{k:p.k,a:p.a*yA,tick:ag_in(tt,runAt[i]+0.4,0.4)});}
  for(let i=0;i<3;i++)ag_T(x,"3 s",YR[i][1]+140,684,{w:700,size:30,align:"center",col:AG.blue,a:ag_in(tt,runAt[i]+0.2,0.4)*yA});
  // the same way every time, like Sperry's box: small, its wheels turning
  const bx=ag_io(tt,P.like-0.2,P.took-0.2,0.5);if(bx>0.01){ml_box(x,1744,600,0.38,{t:tt,tilt:0.06*Math.sin(tt*1.7),push:0.5+0.5*Math.sin(tt*1.7),level:1,chain:0,a:bx});
    ag_T(x,"Sperry's box",1744,722,{w:700,size:28,align:"center",a:bx});}
  // the agent took four minutes and twelve steps
  const ac=ml_pop(tt,P.four-0.1,P.needs+0.6);ag_textCard(x,1620,440,260,{kick:"Agent",title:"4 min",sub:"12 steps"},{k:ac.k,a:ac.a});}
// once: the long way out to the web, a plan that named no tools; now the plan names them, and the agent has only those
function ml_longWay(x,tt,P){const [rx,ry]=ML_ROOM.ring,fold=ag_in(tt,P.namesW-0.1,1.0),reach=ag_sine(ag_in(tt,P.searched-0.3,1.4))*(1-ag_sine(fold)),
    give=[0,1,2].map(i=>ag_sine(ag_in(tt,P.gives+0.1+i*0.18,0.8))),lit=tt<P.searched-0.3?0:tt<P.namesW-0.1?1:tt<P.gives?0:1;
  ml_agent(x,tt,{core:1,lit,col:lit===0?AG.violet:AG.blue,think:ag_io(tt,P.namesW-0.2,P.namesW+1.2,0.4)});
  // its three tools, and the arms that reach them once the plan names them; Docs had the census rules all along
  const dg=ag_io(tt,P.docs-0.2,P.docs+1.4,0.3);
  ML_ROOM.tools.forEach((tl,i)=>{const u=give[i],dt=i===2?Math.max(dg*(0.6+0.4*Math.sin((tt-P.docs)*7)),ag_io(tt,P.only,P.only+1.8,0.3)):0;
    ml_tool(x,i,{touch:Math.max(u>0.95?0.4:0,dt),server:1,plug:1});
    if(u>0.002){ag_reach(x,ml_arm(i),u,{grip:u>0.95?1:0,data:i===2?clamp((tt-P.only-0.2)/1.4,0,1):0});if(u>0.95){const e=ml_arm(i);ml_plug(x,e[6]-6,e[7],0,1,"#3E3F45",1);}}});
  // the long way: one long arm up to the web, and data coming back along it, slowly
  const GL=[1420,160,56],ga=ag_io(tt,P.searched-0.5,P.namesW+0.9,0.5);ml_globe(x,GL[0],GL[1],GL[2],ga,{side:"left"});
  ag_reach(x,[1360,476,1460,470,1470,300,GL[0]+8,GL[1]+GL[2]+14],reach,{grip:reach>0.95?1:0,data:reach>0.95?((tt-P.webW)*0.4)%1:0});
  ag_roomLight(x,1);
  // its plan: find the census rules; "Tools:" with nothing after it, marked amber once we see why; then filled in, and ticked
  const pk=ml_pop(tt,P.web-0.25,null),fill=clamp((tt-P.namesW)/1.0,0,1),k0=6/27;
  const pl=ml_plan(x,160,250,640,["1 Find the census rules","Tools: Catalog, Query, Docs"],{a:pk.a,ka:pk.k,amber:[false,tt>P.plan-0.1&&fill<=0],
    k:[1,lerp(k0,1,fill)],tick:[0,ag_in(tt,P.namesW+1.0,0.4)]});
  if(pk.a>0.01){x.save();x.globalAlpha*=pk.a;x.strokeStyle=rgba(AG.violet,0.45);x.lineWidth=3;x.setLineDash([6,8]);x.beginPath();x.moveTo(pl.x+pl.w+6,pl.y+52);
    x.lineTo(rx-150,ry-176);x.stroke();x.setLineDash([]);x.restore();}}
// two columns on the wall, a plain script under the first and the agent under the second: o.aL, o.aR (each column), o.rm and o.rl (the
// recipe coming in, its label), o.am and o.al (the agent coming in, its label), o.a (all of it)
function ml_twoCols(x,tt,o){const X0=640,X1=1220,Y=200,a=o.a==null?1:o.a;ag_roomLight(x,1);if(a<=0.01)return;x.save();x.globalAlpha*=a;
  const out=ml_columns(x,1,{x0:X0,x1:X1,y:Y,h:560,aL:o.aL,aR:o.aR}),rm=o.rm||0,am=o.am||0;
  ml_recipe(x,lerp(X0-200-420,X0-200,rm),out.left[1]-40,400,{fold:1,a:rm});
  ag_label(x,X0,out.left[1]+170,"plain script",{col:AG.blue,align:"center",a:o.rl||0});
  ml_small(x,tt,lerp(X1+420,X1,am),out.right[1]+60,100,48,{stepA:0,a:am});
  ag_label(x,X1,out.right[1]+230,"agent",{col:AG.violet,align:"center",a:o.al||0});x.restore();}

// ---- 9 · Back in the seat: Sperry's box held the aeroplane level while he stayed in his seat; Jun's agent brought him the evidence to decide;
//      an agent is its four parts; use one only where a plain script can't do the job ----
const ML_BOATWHO=[{who:{skin:[232,198,170],top:{c:[70,62,56]},cap:[104,72,48],goggles:true}},{who:{skin:[220,182,150],top:{c:[104,100,96]},cap:[84,82,80]}}];
scene("seat",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({job:wAt(sc,"held","one"),while_:wAt(sc,"held","while"),seat:wAt(sc,"held","seat"),
    took:c.took,steps:wAt(sc,"took","steps"),brought:wAt(sc,"took","brought"),evid:wAt(sc,"took","evidence"),decide:wAt(sc,"took","decide"),
    is:c.is,model:wAt(sc,"is","model"),reasons:wAt(sc,"is","reasons"),hands:wAt(sc,"is","hands"),loop:wAt(sc,"is","loop"),only:c.only,end:c.breath}));
  ml_shots(ctx,S,t,sc.dur,[
    // 1914: the flying boat over the Seine, level, and Sperry's box at work, its one job
    {at:0,place:"mlSeine",keys:[[0,900,560,1.12],[0.1,940,560,1.14]],d:P.while_,push:0.01,draw:(x,tt)=>{const bx=lerp(560,1160,clamp(tt/(P.while_+0.4),0,1));
      ml_boat(x,bx,540,0.95,{t:tt,shadow:600,who:ML_BOATWHO});ml_crowd(x,tt,{turn:0.2+0.3*clamp(tt/P.while_,0,1)});
      const ia=ag_in(tt,P.job-0.3,0.5);if(ia>0.01){x.save();x.globalAlpha*=ia;ag_box(x,1240,124,440,300,24,{});
        ml_box(x,1460,250,0.3,{t:tt,tilt:0.05*Math.sin(tt*1.6),push:0.5+0.5*Math.sin(tt*1.6),level:1,chain:0});
        ag_T(x,"one job: hold it level",1460,396,{w:700,size:28,align:"center"});x.restore();}}},
    // Sperry back in his seat, his hands resting by the controls; the camera settles on his face
    {at:P.while_-0.3,place:null,keys:[[P.while_-0.3,960,540,1],[P.while_-0.2,ML_FACE[0],ML_FACE[1],1.5]],d:2.4,push:0.01,draw:(x,tt)=>
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,rest:1,mateGaze:[-1,-0.4],roll:0.006*Math.sin(tt*0.8)})},
    // today: the agent takes the steps of the new question, and brings Jun its answer with the evidence; he decides; its four parts gather in its ring
    {at:P.took-0.4,dis:1.0,place:"lab",keys:[[P.took-0.4,960,540,1],[P.took-0.3,960,540,1]],d:6,push:0.01,draw:(x,tt)=>ml_recap(x,tt,P)},
    // the two columns again: the agent settles under the steps nobody can write in advance
    {at:P.only-0.3,dis:0.7,place:"lab",keys:[[P.only-0.3,960,530,1.0],[P.only-0.2,960,520,1.02]],d:6,push:0.01,draw:(x,tt)=>ml_twoCols(x,tt,{aL:1,aR:1,rm:1,rl:1,
      am:ag_sine(ag_in(tt,P.only,1.1)),al:ag_in(tt,P.only+0.9,0.4),a:1-ag_in(tt,P.end,0.6)})}]);
  ml_kick(ctx,t,[[0,"1914"],[P.took-0.2,"Today"],[P.end,null]],1);
  // the four parts, lighting in turn as they're named, then into the ring, each to its place
  const pa=ag_io(t,P.is-0.4,P.only-0.3,0.5);if(pa>0.01)ml_parts(ctx,[ag_in(t,P.model-0.1,0.4),ag_in(t,P.reasons-0.1,0.4),ag_in(t,P.hands-0.1,0.4),ag_in(t,P.loop-0.1,0.4)],
    {a:pa,gather:ag_in(t,P.loop+0.25,1.0)});
  ag_end(ctx,S,t,P.end,ML_TITLE,null,"Film 2 of 9");});
const ML_FACE=[880,440];   // Sperry's face in the cockpit, for the camera
function ml_recap(x,tt,P){const [rx,ry]=ML_ROOM.ring,A=ML_ANS,W=500;
  // it takes the steps: its light goes once round the ring, data back along the arms
  const pu=clamp((tt-P.steps+0.4)/2.4,0,1),deg=-120+360*ag_sine(pu),pa=ag_io(tt,P.steps-0.4,P.brought+0.2,0.3),
    glow=ag_io(tt,P.loop+0.95,P.only-0.1,0.35),lit=pa>0.5?(((Math.round((deg+120)/120)%3)+3)%3):null;
  ml_agent(x,tt,{core:1+0.4*glow,think:glow,pulse:{deg:pa>0.01?deg:-120+360*ag_sine(clamp((tt-P.loop-0.95)/1.3,0,1)),a:Math.max(pa,glow)},lit,col:AG.violet});
  ML_ROOM.tools.forEach((tl,i)=>{const d=clamp((tt-P.steps-0.2-i*0.5)/1.4,0,1);ml_tool(x,i,{touch:d>0&&d<1?1:0,server:1,plug:1});
    ag_reach(x,ml_arm(i),1,{grip:1,data:d});const e=ml_arm(i);ml_plug(x,e[6]-6,e[7],0,1,"#3E3F45",1);});
  ml_jun(x,tt,{gaze:[3,ml_pw(tt,[[0,-0.5],[P.brought+0.4,-0.5],[P.brought+1.0,-0.35],[P.is,-0.35],[P.is+0.4,-0.9]])],
    nod:0.07*ag_io(tt,P.decide-0.2,P.decide+0.6,0.3),smile:0.2*ag_in(tt,P.decide,0.8)});
  ag_roomLight(x,1);
  // its answer, brought to Jun with the evidence clipped to it; he signs it; it goes as the four parts come
  const out=1-ag_in(tt,P.is-0.4,0.5);if(out<=0.01)return;const h=ag_evidence(x,A.x,A.y,W,ML_ANSW,ML_EV,{a:0}).card.h,fl=clamp((tt-P.brought)/1.1,0,1),
    F=ml_fly(fl,rx,ry,860,260,A.x+W/2,A.y+h/2),wa=ag_in(tt,P.brought+0.6,0.3);
  if(fl>0&&wa<1){x.save();x.globalAlpha*=out;x.translate(F.x,F.y);x.scale(F.s,F.s);ag_box(x,-W/2,-h/2,W,h,22,{a:(1-wa)*ag_in(tt,P.brought,0.2)});x.restore();}
  x.save();x.translate(F.x-(A.x+W/2),F.y-(A.y+h/2));ag_evidence(x,A.x,A.y,W,ML_ANSW,ML_EV,{a:wa*out});x.restore();
  const ap=ml_pop(tt,P.evid,null);ml_approve(x,A.x,A.y+h+22,W,"Jun",clamp((tt-P.decide+0.1)/0.6,0,1),{k:ap.k,a:ap.a*out});}

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["question", "hands", "loop", "answer"]);

/* ===== v4 engine: narration-timed timeline, crossfades, captions, player with sound ===== */
const GAP=0.3,SGAP=0.7,XF=0.8,UI=Object.assign({play:"Play",pause:"Pause",load:"Loading…",fs:"Full screen",fsExit:"Exit full screen"},typeof L10N!=="undefined"&&L10N.ui||{});
// the voice breathes between sentences: SGAP after a line that ends a sentence, GAP where the sentence runs on into the next line, and GAP after a chapter's last line (its tail follows)
const gapAfter=(ch,last)=>ch.gap!=null?ch.gap:(!last&&/[.?!…]["'”’»)]*$/.test(ch.text.trim())?SGAP:GAP);
// a page can caption the film in another language over the same picture and voice: CAPTIONS maps each English line to its caption (src/i18n/<lang>/captions.js), loaded before the film
const capText=s=>typeof CAPTIONS!=="undefined"&&CAPTIONS[s]||s;
// BREATH (breath.js) adds room to think: a hold after a line, a pause before one, and a wordless end to each chapter from the "breath" cue
function buildTimeline(){let g=0;const caps=[],BR=typeof BREATH!=="undefined"?BREATH:{};
  SCENES.forEach(sc=>{const b=BR[sc.id]||{},hold=b.hold||{},pz=b.pause||{};sc.start=g;sc.cues={};sc.ends={};sc.pauses={};let t=sc.lead||0.6;
    sc.vo.forEach((ch,i)=>{const p=(ch.pause||0)+(pz[ch.id]||0);if(p){t+=p;sc.pauses[ch.id]=p;}const d=(typeof VODUR!=="undefined"&&VODUR[sc.id+"/"+ch.id])||Math.max(1.3,ch.text.split(/\s+/).length/2.7);sc.cues[ch.id]=t;sc.ends[ch.id]=t+d;caps.push({s:g+t,e:g+t+d,text:capText(ch.text),sid:sc.id,id:ch.id});t+=d+gapAfter(ch,i===sc.vo.length-1)+(hold[ch.id]||0);});
    sc.voEnd=t;sc.breathe=b.breathe||0;sc.cues.breath=t+(sc.tail||1.2);sc.dur=sc.cues.breath+sc.breathe;g+=sc.dur;});return{total:g,caps};}
const TL=buildTimeline();let CAPS_ON=true,OFF=null;
function sceneIndex(t){for(let i=SCENES.length-1;i>=0;i--)if(t>=SCENES[i].start)return i;return 0;}
function wrapLines(ctx,s,maxW){const words=s.split(" "),lines=[];let cur="";words.forEach(w=>{const tr=cur?cur+" "+w:w;if(ctx.measureText(tr).width>maxW&&cur){lines.push(cur);cur=w;}else cur=tr;});if(cur)lines.push(cur);
  if(lines.length===2){const all=s.split(" ");let best=null;for(let k=1;k<all.length;k++){const a=all.slice(0,k).join(" "),b=all.slice(k).join(" ");const wa=ctx.measureText(a).width,wb=ctx.measureText(b).width;if(wa<=maxW&&wb<=maxW){const d=Math.abs(wa-wb);if(!best||d<best[0])best=[d,a,b];}}if(best)return[best[1],best[2]];}return lines;}
// captions grow as the player shrinks: 40 px in the 1920-pixel frame is 8 px on a phone held upright, so on a small screen they're
// scaled up to stay about 15 px on screen, and wrap to fit. The video carries no captions on its picture, so it's unchanged.
function drawCaption(ctx,S,t){if(!CAPS_ON)return;let c=null;for(const k of TL.caps){if(t>=k.s-0.06&&t<k.e+0.15){c=k;break;}}if(!c)return;const a=sstep(c.s-0.06,c.s+0.1,t)*(1-sstep(c.e,c.e+0.15,t));if(a<=0)return;
  let css=W;try{const r=ctx.canvas.getBoundingClientRect&&ctx.canvas.getBoundingClientRect();if(r&&r.width>0)css=r.width;}catch(e){}
  const k=clamp(15*W/css/40,1,2.4),sz=Math.round(40*k),lh=Math.round(54*k),maxW=k>1.2?1760:1480;
  setScreen(ctx,S);ctx.font=font(600,sz);const lines=wrapLines(ctx,c.text,maxW),h=lines.length*lh+26;let w=0;lines.forEach(l=>{w=Math.max(w,ctx.measureText(l).width);});w+=60;const x=W/2-w/2,y=H-(k>1.2?24:54)-h;
  ctx.save();ctx.globalAlpha=a;ctx.fillStyle=k>1.2?"rgba(0,0,0,0.7)":"rgba(0,0,0,0.66)";rr(ctx,x,y,w,h,14);ctx.fill();lines.forEach((l,i)=>T(ctx,l,W/2,y+13+lh*(i+0.77),{size:sz,w:600,align:"center",color:"#ffffff"}));ctx.restore();}
function renderFrame(ctx,S,t){t=clamp(t,0,TL.total-0.001);const i=sceneIndex(t),sc=SCENES[i],lt=t-sc.start;ctx.save();sc.draw(ctx,S,lt,sc);ctx.restore();
  if(i>0&&lt<XF){const pv=SCENES[i-1],cv=ctx.canvas;if(!OFF||OFF.width!==cv.width||OFF.height!==cv.height)OFF=mkCanvas(cv.width,cv.height);const o=OFF.getContext("2d");o.save();pv.draw(o,S,pv.dur+lt,pv);o.restore();ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1-ease(lt/XF);ctx.drawImage(OFF,0,0);ctx.restore();}
  ctx.save();drawCaption(ctx,S,t);ctx.restore();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";}
function fmt(s){s=Math.max(0,s);const m=Math.floor(s/60),x=Math.floor(s%60);return m+":"+(x<10?"0":"")+x;}
async function fontsReady3(){try{await Promise.all(["600 40px Manrope","700 22px Manrope","800 34px Manrope","500 18px Manrope","500 15px 'IBM Plex Mono'"].map(f=>document.fonts.load(f)));await document.fonts.ready;}catch(e){}}
async function prepAssets(){await fontsReady3();await loadLogos();master2(1);master2(2);["realism","modern","rules","live"].forEach(painting2);}
// the video carries no captions on the picture: they ship beside it as .srt files, one per language, so one video serves every language
if(window.__RENDER__){CAPS_ON=false;const cv=mkCanvas(W,H),ctx=cv.getContext("2d");document.body.appendChild(cv);
  window.renderAt=function(t,q){renderFrame(ctx,1,t);return cv.toDataURL("image/jpeg",q||0.9);};
  window.filmInfo=function(){return{total:TL.total,scenes:SCENES.map(s=>({id:s.id,name:s.name,start:s.start,dur:s.dur,cues:s.cues,pauses:s.pauses,breathe:s.breathe})),caps:TL.caps};};
  prepAssets().then(()=>{window.__READY__=true;});}
else{
/* the player; window.FILM lets the rest of a page wait for the film's assets, and seek or play it */
let readyRes;const FILM=window.FILM={ready:new Promise(r=>{readyRes=r;}),sceneStart:id=>{const s=SCENES.find(s=>s.id===id);return s?s.start:0;}};
window.addEventListener("DOMContentLoaded",async()=>{
  const cv=document.getElementById("film");if(!cv){await prepAssets();readyRes();return;}
  const ctx=cv.getContext("2d"),play=document.getElementById("play"),scrub=document.getElementById("scrub"),time=document.getElementById("time"),cc=document.getElementById("cc"),chap=document.getElementById("chapters"),au=document.getElementById("snd"),box=cv.closest(".player");
  let t=0,playing=false,last=0,dirty=true,inView=true,keysOn=true,waiting=false,stopAt=null;scrub.max=TL.total.toFixed(2);const hasAu=au&&au.getAttribute("src");
  function size(){const r=cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);const w=Math.round(Math.min(1920,r.width*d));if(w>0&&cv.width!==w){cv.width=w;cv.height=Math.round(w*9/16);}}
  SCENES.forEach(s=>{const b=document.createElement("button"),tc=document.createElement("span");tc.className="tc";tc.textContent=fmt(s.start);b.append(tc,document.createTextNode(s.name));b.onclick=()=>{seek(s.start+0.01);};chap.appendChild(b);});
  function seek(x){stopAt=null;t=clamp(x,0,TL.total);if(hasAu){try{au.currentTime=t;}catch(e){}}dirty=true;box.classList.add("started");}
  function label(){play.textContent=playing?(waiting?UI.load:UI.pause):UI.play;}
  function draw(){size();renderFrame(ctx,cv.width/W,t);scrub.value=t.toFixed(2);time.textContent=fmt(t)+" / "+fmt(TL.total);const i=sceneIndex(t);[...chap.children].forEach((b,k)=>b.classList.toggle("on",k===i));}
  // draws only while playing or after a change, and only while the player is on screen
  // FILM.onChapterEnd(id) can hold the film on the last frame of a chapter, for "pause and think": return true to pause there
  function loop(ts){if(playing){const i0=sceneIndex(t);if(hasAu&&!au.paused)t=au.currentTime;else{const dt=Math.min(0.1,(ts-last)/1000);t+=dt;}
    if(FILM.onChapterEnd&&sceneIndex(t)>i0){const s=SCENES[i0];if(FILM.onChapterEnd(s.id)===true){t=s.start+s.dur-0.03;playing=false;label();if(hasAu){au.pause();try{au.currentTime=t;}catch(e){}}}}
    if(t>=TL.total-0.02){t=TL.total;playing=false;label();if(hasAu)au.pause();}if(stopAt!=null&&t>=stopAt){t=stopAt;stopAt=null;playing=false;label();if(hasAu)au.pause();}dirty=true;}last=ts;if(dirty&&inView){draw();dirty=false;}requestAnimationFrame(loop);}
  function toggle(){box.classList.add("started");if(t>=TL.total-0.05)seek(0);playing=!playing;label();if(hasAu){if(playing){au.currentTime=t;au.play().catch(()=>{});}else au.pause();}dirty=true;}
  play.onclick=toggle;box.querySelectorAll("[data-play]").forEach(b=>{b.onclick=()=>{if(!playing)toggle();};});
  if(hasAu){au.addEventListener("waiting",()=>{waiting=true;label();});au.addEventListener("playing",()=>{waiting=false;label();});}
  scrub.oninput=()=>seek(parseFloat(scrub.value));
  // full screen covers the player (film and controls); browsers that only allow it for <video>, such as Safari on iPhone, hide the button
  const fsb=document.getElementById("fs"),fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement,fsReq=box.requestFullscreen||box.webkitRequestFullscreen;
  function fsToggle(){if(fsEl())(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const r=fsReq.call(box);if(r&&r.catch)r.catch(()=>{});}}
  if(fsb){if(!fsReq)fsb.hidden=true;else{fsb.onclick=fsToggle;cv.ondblclick=fsToggle;["fullscreenchange","webkitfullscreenchange"].forEach(ev=>document.addEventListener(ev,()=>{fsb.textContent=fsEl()?UI.fsExit:UI.fs;dirty=true;}));}}
  cc.onclick=()=>{CAPS_ON=!CAPS_ON;cc.classList.toggle("on",CAPS_ON);cc.setAttribute("aria-pressed",CAPS_ON);dirty=true;};
  if("IntersectionObserver" in window)new IntersectionObserver(es=>{const e=es[es.length-1];inView=e.isIntersecting;keysOn=e.intersectionRatio>=0.55;if(inView)dirty=true;},{threshold:[0,0.55]}).observe(box);
  // keys work while most of the player is on screen and no other control has focus
  window.addEventListener("keydown",e=>{if(!keysOn&&!fsEl())return;const tg=e.target,own=box.contains(tg);if(!own&&tg.closest&&tg.closest("a,button,input,select,textarea,[contenteditable],[role=button],[role=radio],[role=option],[tabindex]"))return;
    if(e.code==="Space"&&tg.tagName!=="BUTTON"&&tg.tagName!=="INPUT"){e.preventDefault();toggle();}else if(e.code==="KeyF"&&fsReq&&!e.ctrlKey&&!e.metaKey&&!e.altKey)fsToggle();});
  window.addEventListener("resize",()=>{dirty=true;});
  Object.assign(FILM,{seek,time:()=>t,playing:()=>playing,play:()=>{if(!playing)toggle();},pause:()=>{if(playing)toggle();},playScene:(id,once)=>{const s=SCENES.find(x=>x.id===id);seek(FILM.sceneStart(id)+0.01);if(once&&s)stopAt=s.start+s.dur-0.05;if(!playing)toggle();}});
  await prepAssets();readyRes();const hm=location.hash.match(/t=([0-9:.]+)/);if(hm){const q=hm[1].split(":").map(Number);seek(q.length>1?q[0]*60+q[1]:q[0]);}dirty=true;requestAnimationFrame(loop);});}

/* ===== What an agent is: what a film needs before it starts, and the video's finishing pass =====
   Loaded after the engine, so its prepAssets is the one the engine calls: the fonts, the tools' logos if a film carries them (later
   series of the module may), then each place the film paints (AG_PLACES: the room, room.js's "lab", and the film's own). The rendered
   video and the checks paint every place before they start. The site's player paints the first place at once and the others only
   once the visitor starts the film (Play, a chapter or the bar), one by one while the page is idle: a place takes a few tenths of a
   second on a fast machine and several times that on a phone, and keeps a full-size picture in memory, so painting them all as the
   page opens would hold it up while the visitor is only reading it (the governance films' lesson, 2 November 2026).
   Then, for the video only (tools/render.py calls renderAt), motion blur: each video frame is the average of MB moments across a third
   of a frame (a 126-degree shutter), so movement reads as filmed. No glow and no film grain. */
async function prepAssets(){await fontsReady3();if(typeof LOGO_SRC!=="undefined")await loadLogos();const ks=Object.keys(AG_PLACES);
  if(window.__RENDER__){ks.forEach(ag_place);return;}
  if(ks.length)ag_place(ks[0]);let i=1;const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:1000}):setTimeout(f,60);
  const next=()=>{if(i>=ks.length)return;ag_place(ks[i++]);idle(next);},go=()=>setTimeout(()=>idle(next),200);
  const cv=document.getElementById("film"),box=cv&&cv.closest(".player");if(!box||box.classList.contains("started")){go();return;}
  const mo=new MutationObserver(()=>{if(box.classList.contains("started")){mo.disconnect();go();}});mo.observe(box,{attributes:true,attributeFilter:["class"]});}
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
