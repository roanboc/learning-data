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

// Working with agents on Databricks, the seventh film of Agents at work on data, the second series on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"three":{"name":"Three answers","lead":1.6,"tail":1.0,"vo":[
 {"id":"monday","gap":0.8,"text":"Monday, at the Faculty of Health."},
 {"id":"anil","gap":0.8,"text":"Anil Kurian plans next year's places in classes, labs and hospitals."},
 {"id":"census","gap":0.8,"text":"He starts from Health's students on census day: the day the university counts who is studying."},
 {"id":"asks","gap":0.8,"text":"He asks his agent, and two colleagues ask theirs. Each set up their own, with their own copy of the data."},
 {"id":"load","gap":0.8,"text":"Anil's reads a spreadsheet of student load, made for the faculty's funding bid."},
 {"id":"fte","gap":0.8,"text":"Load counts two half-time students as one, but the agent takes it for people: 2,160.","say":"Load counts two half-time students as one, but the agent takes it for people: two thousand, one hundred and sixty."},
 {"id":"table","gap":0.8,"text":"The second, with a copy of the student table, counts every degree with Health in its name."},
 {"id":"joint","gap":0.8,"text":"So it counts the 31 students of Health data too, a joint degree in no faculty: 2,911.","say":"So it counts the thirty-one students of Health data too, a joint degree in no faculty: two thousand, nine hundred and eleven."},
 {"id":"folder","gap":0.8,"text":"The third reads a folder of reports, and says 2,880.","say":"The third reads a folder of reports, and says two thousand, eight hundred and eighty."},
 {"id":"which","gap":0.8,"text":"One is right, and nobody can tell which: none of them shows what it read."},
 {"id":"short","gap":0.8,"text":"Plan for the lowest, and 720 students would have no place.","say":"Plan for the lowest, and seven hundred and twenty students would have no place."},
 {"id":"names","gap":0.8,"text":"And a copy of the student table, with every name in it, sits on a laptop."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"bring","gap":0.8,"text":"So Sam, who runs the platform, and Jun, who builds the data project, bring the agents to the data, on Databricks."},
 {"id":"same","gap":0.8,"text":"Every agent now reads the same governed tables, definitions and tools as everyone else, and only what its own person may read."},
 {"id":"week","gap":0.8,"text":"A week later, all three answer 2,880, each with its query, its table and its definition.","say":"A week later, all three answer two thousand, eight hundred and eighty, each with its query, its table and its definition."},
 {"id":"minute","gap":0.8,"text":"Anil checks it in a minute, and plans a place for every student. The copies are deleted."},
 {"id":"data","gap":0.8,"text":"When every agent reads the same data through the same tools, the answers agree, with their evidence."}]},
"place":{"name":"One place","lead":0.8,"tail":1.0,"vo":[
 {"id":"holds","gap":0.8,"text":"Databricks holds the university's data, governed in Unity Catalog: its tables, its definitions, and who may read what."},
 {"id":"people","gap":0.8,"text":"People already work there, in its editors, notebooks and dashboards."},
 {"id":"four","gap":0.8,"text":"Now agents work there too, in four ways."},
 {"id":"answer","gap":0.6,"text":"Agents that answer questions, over governed data."},
 {"id":"servers","gap":0.6,"text":"Tool servers, which any agent can use."},
 {"id":"builds","gap":0.6,"text":"Agents the team builds and tests on the platform."},
 {"id":"writes","gap":0.8,"text":"And agents that write code, for the dbt project and the pipelines."},
 {"id":"each","gap":0.8,"text":"Each reads the same data, and uses the same tools, as the people it works for."}]},
"ask":{"name":"Agents that answer","lead":0.8,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"First, agents that answer."},
 {"id":"genie","gap":0.8,"text":"Genie One is the platform's assistant for business questions, and it says where its words come from."},
 {"id":"care","gap":0.8,"text":"For questions that need care, the data team builds Genie Agents, each for one subject."},
 {"id":"census","gap":0.8,"text":"Their Census day agent reads the governed table of students on census day."},
 {"id":"instr","gap":0.8,"text":"Its instructions are the team's definitions: a student is a person, counted once, as their record stood on census day."},
 {"id":"bench","gap":0.8,"text":"Its tests, which Genie calls benchmarks, are the questions behind Health's three answers, each with its right answer in SQL."},
 {"id":"runs","gap":0.8,"text":"The team runs them after every change, so a wrong answer shows before anyone relies on it."},
 {"id":"sql","gap":0.8,"text":"And each answer shows its SQL, so anyone can check what it read."}]},
"tools":{"name":"Tools any agent can use","lead":0.8,"tail":1.0,"vo":[
 {"id":"second","gap":0.8,"text":"Second, tool servers: the hands any agent can use."},
 {"id":"runs","gap":0.8,"text":"The platform runs them, so nobody has to keep their own."},
 {"id":"query","gap":0.8,"text":"One runs queries. One turns a governed function into a tool. One searches the team's documents."},
 {"id":"genie","gap":0.8,"text":"And Genie One and each Genie Agent have their own, so any agent can ask them."},
 {"id":"anil","gap":0.8,"text":"Anil's agent now connects to them with his own sign-in, and reads only what he may read."},
 {"id":"once","gap":0.8,"text":"The data team wrote the census count once, as a function, for any faculty."},
 {"id":"calls","gap":0.8,"text":"Every agent calls it, and none writes a count of its own."},
 {"id":"mcp","gap":0.8,"text":"They follow the open standard, MCP, so any agent can plug in."}]},
"build":{"name":"Agents the team builds","lead":0.8,"tail":1.0,"vo":[
 {"id":"third","gap":0.8,"text":"Third, agents the team builds."},
 {"id":"fails","gap":0.8,"text":"When the nightly count fails its check against the census report, someone has to find out why, and those steps can't be written in advance."},
 {"id":"bricks","gap":0.8,"text":"So the team builds a census check agent, in code, with Agent Bricks, the platform's way to build agents."},
 {"id":"runtime","gap":0.8,"text":"Agent Runtime runs it, the job calls it, and every step it takes is traced."},
 {"id":"same","gap":0.8,"text":"It uses the same tool servers as everyone else."},
 {"id":"before","gap":0.8,"text":"Before anyone relies on it, the team tests it on cases they have met before."},
 {"id":"cases","gap":0.8,"text":"The 37 who withdrew after census day and still count. Three students counted twice. And Health's three answers.","say":"The thirty-seven who withdrew after census day and still count. Three students counted twice. And Health's three answers."},
 {"id":"judges","gap":0.8,"text":"Judges built into the platform score each answer, a plain test checks the sums, and Mei and Jun mark what's wrong."},
 {"id":"note","gap":0.8,"text":"Its note is evidence, not a decision: Jun reads it, and decides."}]},
"code":{"name":"Agents that write code","lead":0.8,"tail":1.0,"vo":[
 {"id":"fourth","gap":0.8,"text":"Fourth, agents that write code."},
 {"id":"sam","gap":0.8,"text":"Sam builds the pipelines that load the student system each night."},
 {"id":"genie","gap":0.8,"text":"Genie Code, the platform's coding agent, works beside him in the pipeline editor, with his rights."},
 {"id":"skills","gap":0.8,"text":"It reads the team's skills: the same files Jun's agent reads, in the same open format."},
 {"id":"profile","gap":0.8,"text":"Asked to profile a table, it follows the team's skill, with the query and result behind every claim."},
 {"id":"jun","gap":0.8,"text":"Jun's own coding agent works on the dbt project, in his editor."},
 {"id":"reach","gap":0.8,"text":"It reaches the platform through the same tool servers, and Databricks' own skills teach it the platform."},
 {"id":"teach","gap":0.8,"text":"Skills teach an agent how to work; tool servers let it do the work."},
 {"id":"draft","gap":0.8,"text":"What either writes is a draft, on a branch: its person reviews it, and a second person approves what reaches production."}]},
"same":{"name":"The same answer","lead":0.8,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Back at the Faculty of Health, the three agents are still their owners' own."},
 {"id":"read","gap":0.8,"text":"But they read the same governed data, through the same tools, as everyone else."},
 {"id":"asked","gap":0.8,"text":"Asked for Health's students on census day, each answers 2,880, with its query, its table and its definition.","say":"Asked for Health's students on census day, each answers two thousand, eight hundred and eighty, with its query, its table and its definition."},
 {"id":"plans","gap":0.8,"text":"Anil plans a place for every student."},
 {"id":"takeaway","gap":0.8,"text":"The platform gives agents the same data and tools people use, in one place."},
 {"id":"left","gap":0.8,"text":"One question is left: when an agent reads on its own, whose reads are they, and who pays for its model?"},
 {"id":"next","gap":0.8,"text":"That's the next film."}]}
};

const VODUR={"three/monday": 1.812, "three/anil": 4.609, "three/census": 5.265, "three/asks": 6.256, "three/load": 4.473, "three/fte": 7.116, "three/table": 4.714, "three/joint": 7.788, "three/folder": 4.741, "three/which": 3.851, "three/short": 4.097, "three/names": 4.032, "three/change": 1.288, "three/bring": 7.56, "three/same": 8.034, "three/week": 7.178, "three/minute": 5.007, "three/data": 5.877, "place/holds": 7.819, "place/people": 3.834, "place/four": 2.379, "place/answer": 2.824, "place/servers": 2.4, "place/builds": 2.618, "place/writes": 4.323, "place/each": 4.824, "ask/first": 1.653, "ask/genie": 5.666, "ask/care": 5.285, "ask/census": 4.508, "ask/instr": 7.685, "ask/bench": 7.545, "ask/runs": 5.561, "ask/sql": 3.649, "tools/second": 3.172, "tools/runs": 3.089, "tools/query": 6.388, "tools/genie": 4.562, "tools/anil": 4.932, "tools/once": 4.464, "tools/calls": 3.098, "tools/mcp": 4.362, "build/third": 1.784, "build/fails": 7.922, "build/bricks": 6.242, "build/runtime": 4.596, "build/same": 2.786, "build/before": 4.441, "build/cases": 7.327, "build/judges": 7.26, "build/note": 4.019, "code/fourth": 1.816, "code/sam": 3.582, "code/genie": 5.81, "code/skills": 5.795, "code/profile": 6.045, "code/jun": 4.409, "code/reach": 5.564, "code/teach": 3.833, "code/draft": 7.115, "same/back": 3.742, "same/read": 4.455, "same/asked": 8.48, "same/plans": 2.084, "same/takeaway": 4.743, "same/left": 6.119, "same/next": 1.036};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the three agents reading the same data becoming the title card; and the end card. */
const BREATH={
"three":{"hold":{"anil":0.4,"census":0.6,"asks":0.8,"fte":0.6,"joint":0.6,"folder":0.4,"which":1.4,"short":0.8,"names":0.8,"change":1.0,"bring":0.4,"same":0.8,"week":0.8,"minute":0.8,"data":0.4},"breathe":4.6},
"place":{"hold":{"holds":0.6,"people":0.4,"four":0.4,"writes":0.6,"each":1.0}},
"ask":{"hold":{"genie":0.6,"care":0.4,"instr":0.6,"bench":0.8,"runs":0.8,"sql":1.0}},
"tools":{"hold":{"runs":0.4,"query":0.6,"genie":0.4,"anil":0.8,"once":0.6,"calls":0.8,"mcp":1.0}},
"build":{"hold":{"fails":0.6,"bricks":0.4,"runtime":0.6,"before":0.4,"cases":0.8,"judges":0.8,"note":1.0}},
"code":{"hold":{"genie":0.4,"skills":0.6,"profile":0.8,"reach":0.6,"teach":0.8,"draft":1.0}},
"same":{"hold":{"read":0.6,"asked":0.8,"plans":0.6,"takeaway":1.0,"left":0.8},"breathe":4.6}
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
   ag_cam is where the camera is at t, from keys [[t, x, y, zoom], ...]: it glides (sine ease) over d seconds from each key's time, at
   least 1.4 s; push closes in a little more; the view never leaves the frame. ag_focus looks through it. ag_shot draws one shot {at,
   place, keys, draw, push, d}: its place under the camera, then draw(ctx, t, cam) on top in the place's coordinates, closing in slowly
   (push, 2.5% by default) until the next shot. ag_shots cuts a chapter into shots; it returns the shot.
   In one room the camera never jumps. A cut between two framings of one place makes the whole picture jump a little in, out or aside
   (the slow push of the shot before snaps back, or the framing changes by a few percent), and what only the shot before showed
   vanishes in that frame: the author saw it as a jump in the zoom that broke the film's flow (4 November 2026). So a shot in the same
   room as the one before (the same place, or two places AG_ROOMS makes one room, such as the lab by day and by night; a shot that draws
   its own scene, with no place, names it in room, as film 1.2's cockpit does) starts where that
   one's camera is and glides from there to its own framing, over its d; and while it comes in (over dis seconds, or the shot's own
   dis) the shot before is drawn through that same camera, so what both show stays where it is and only what changed fades: so what
   both draw must be drawn the same, and a person who moves goes there over a few frames, not at the change. A later moment in the same
   room, with people elsewhere (December after the summer), is marked later:true: what the shot before shows leaves over its last dis
   seconds, the bare room shows for an instant (its place, and what AG_BARE draws in it, such as the lab's light), and the later moment's
   people and things come in over its first dis, while the camera glides on. A cut there makes all of them vanish in one frame, and
   people who stay a few steps away jump: the author saw that as a jump too. Only a change that moves the picture AG_NEWSHOT px or more at its corners is a new shot, which may cut. Between rooms a shot dissolves
   in, or comes in on a cut (cut:true) when the two show the same people or words: a dissolve between two framings lays them over each
   other, a little apart, and for half a second everything in them shows twice, like a ghost. */
const AG_NEWSHOT=300,AG_ROOMS={},AG_BARE={};let AG_JOIN=null,AG_PROBE=null;
const ag_room=p=>p&&(AG_ROOMS[p]||p),ag_roomOf=sh=>sh&&ag_room(sh.room||sh.place);
function ag_cam(t,keys,d,push){d=Math.max(1.4,d||1.6);let x=keys[0][1],y=keys[0][2],z=keys[0][3];
  for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z*(1+(push||0)));return{x:clamp(x,960/z,W-960/z),y:clamp(y,540/z,H-540/z),z};}
function ag_focus(ctx,t,keys,d,push){const c=ag_cam(t,keys,d,push);ctx.translate(960,540);ctx.scale(c.z,c.z);ctx.translate(-c.x,-c.y);return c;}
// a shot's own camera at t: its keys, closed in by its push until till (when the next shot starts)
function ag_camOf(sh,t,till){const len=Math.max(1.5,till-sh.at),push=(sh.push==null?0.025:sh.push)*easeCam(clamp((t-sh.at)/len,0,1));
  return ag_cam(t,sh.keys||[[0,960,540,1]],sh.d,push);}
// how far the picture moves at its corners (or its middle), in px of the 1920 x 1080 frame, from camera a to camera b
function ag_camMove(a,b){let m=0;for(const [sx,sy] of [[0,0],[W,0],[0,H],[W,H],[960,540]]){const wx=(sx-960)/a.z+a.x,wy=(sy-540)/a.z+a.y;
  m=Math.max(m,Math.hypot((wx-b.x)*b.z+960-sx,(wy-b.y)*b.z+540-sy));}return m;}
// part u of the way from camera a to camera b, the view kept inside the frame
function ag_camMix(a,b,u){const z=lerp(a.z,b.z,u);return{x:clamp(lerp(a.x,b.x,u),960/z,W-960/z),y:clamp(lerp(a.y,b.y,u),540/z,H-540/z),z};}
// one shot, through its own camera, or through cam when it shares one with the shot it dissolves with
function ag_shot(ctx,S,t,sh,till,cam){setScreen(ctx,S);ctx.save();cam=cam||ag_camOf(sh,t,till);cam=ag_focus(ctx,t,[[0,cam.x,cam.y,cam.z]],1.4,0);
  if(sh.place)ctx.drawImage(ag_place(sh.place),0,0,W,H);if(sh.draw)sh.draw(ctx,t,cam);ctx.restore();setScreen(ctx,S);}
// a shot laid over what is drawn, at opacity a
function ag_shotA(ctx,S,t,sh,till,cam,a){if(!(a>0))return;const [bc,bx]=ag_buf("cut",ctx.canvas.width,ctx.canvas.height);ag_shot(bx,S,t,sh,till,cam);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=clamp(a,0,1);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
// the bare room under a camera: the place, and what AG_BARE draws in it (a light that every shot of it draws)
function ag_bare(ctx,S,t,place,cam){ag_shot(ctx,S,t,{place,draw:AG_BARE[place]||null},t+1,cam);}
function ag_shots(ctx,S,t,end,shots,dis){const join=AG_JOIN;AG_JOIN=null;dis=dis==null?0.5:dis;const n=shots.length,till=k=>k+1<n?shots[k+1].at:end,G=[];
  // where shot k's camera is at tt: its own, or, while it glides in, on its way there from where the camera was
  const camAt=(k,tt)=>{const own=ag_camOf(shots[k],tt,till(k)),g=G[k];return g&&tt<shots[k].at+g.d?ag_camMix(g.from,own,easeCam((tt-shots[k].at)/g.d)):own;};
  for(let k=0;k<n;k++){const sh=shots[k],pv=k?{cam:camAt(k-1,sh.at),place:ag_roomOf(shots[k-1])}:join&&join.from;
    G[k]=pv&&ag_roomOf(sh)&&ag_room(pv.place)===ag_roomOf(sh)&&ag_camMove(pv.cam,ag_camOf(sh,sh.at,till(k)))<AG_NEWSHOT?{from:pv.cam,d:Math.max(1.4,sh.d||1.6)}:null;}
  // a later moment in the same room (later:true), both shots on a place: each half of the pass through the bare room lasts dis seconds
  const dipOf=k=>{const sh=shots[k];return sh&&sh.later&&G[k]&&sh.place&&(k===0||shots[k-1].place)?(sh.dis!=null?sh.dis:dis):0;};
  let i=0;for(let k=1;k<n;k++)if(t>=shots[k].at)i=k;const cam=camAt(i,t);
  // a chapter whose first shot glides on from the last one's camera: the last one's end is drawn through it, under the engine's
  // crossfade; when the first shot is a later moment, what the last one shows leaves over dip seconds, and then the new one's comes in
  const glides=i===0&&!!G[0],dip=dipOf(0);
  if(join)join.out={t,cam,place:ag_roomOf(shots[i]),glides,dip};
  if(AG_PROBE){Object.assign(AG_PROBE,{cam,place:ag_roomOf(shots[i]),glides,dip});return i;}
  if(join&&join.cam){const sh=shots[i];                                             // a chapter's end, through the next chapter's camera
    if(join.leave==null||!sh.place)ag_shot(ctx,S,t,sh,till(i),join.cam);else{ag_bare(ctx,S,t,sh.place,join.cam);ag_shotA(ctx,S,t,sh,till(i),join.cam,join.leave);}
    return i;}
  // before a later moment, what this shot shows leaves; in one, what it shows comes in once the shot before has left (a chapter's first
  // shot: once the last chapter's end has left)
  const hn=dipOf(i+1),hi=dipOf(i),s0=i>0?shots[i].at:hi;let a=1;
  if(hn&&t>shots[i+1].at-hn)a=1-ease(clamp((t-shots[i+1].at+hn)/hn,0,1));
  if(hi&&t<s0+hi)a=Math.min(a,ease(clamp((t-s0)/hi,0,1)));
  if(a<1){ag_bare(ctx,S,t,hi&&i>0&&t<s0+hi?shots[i-1].place:shots[i].place,cam);ag_shotA(ctx,S,t,shots[i],till(i),cam,a);return i;}
  const di=i>0&&shots[i].dis!=null?shots[i].dis:dis,u=i>0&&!hi&&(G[i]||!shots[i].cut)?clamp((t-shots[i].at)/di,0,1):1;
  if(u<1){ag_shot(ctx,S,t,shots[i-1],shots[i].at,G[i]?cam:camAt(i-1,t));ag_shotA(ctx,S,t,shots[i],till(i),cam,ease(u));}
  else ag_shot(ctx,S,t,shots[i],till(i),cam);return i;}
// a chapter's draw, run only to find where its camera is at t and in which place, without drawing ({cam, place, glides}, or null)
function ag_probe(sc,t){const c=ag_buf("probe",2,2)[1],was=AG_PROBE,j=AG_JOIN;AG_PROBE={};try{sc.draw(c,0.001,t,sc);return AG_PROBE.cam?AG_PROBE:null;}
  catch(e){return null;}finally{AG_PROBE=was;AG_JOIN=j;}}
// chapters that open on what the one before ends on, by id; a film calls it after its last scene(). The engine lays the end of each
// chapter over the next one's first 0.8 s. When the next one opens in the same room, a little way from where the last one's camera is,
// its camera glides on from there, and the end of the last one is drawn through that same camera, so only what changed fades; else, for
// those 0.8 s, the chapter before draws the next one's opening, and it's a cut
function ag_cutInto(ids){for(const id of ids){const i=SCENES.findIndex(s=>s.id===id);if(i<1)throw new Error("ag_cutInto: "+id+" isn't a chapter after the first");
  const pv=SCENES[i-1],nx=SCENES[i],dp=pv.draw,dn=nx.draw;
  // where the chapter before leaves the camera, and in which place, found once
  const endOf=()=>pv.agEnd!==undefined?pv.agEnd:(pv.agEnd=ag_probe(pv,pv.dur-1e-4));
  nx.draw=function(ctx,S,t,s){const was=AG_JOIN,e=endOf(),J=Object.assign({},was,{from:e&&{cam:e.cam,place:e.place}});AG_JOIN=J;
    try{return dn.apply(this,arguments);}finally{AG_JOIN=was;if(J.out&&!J.cam)nx.agLast=J.out;}};
  pv.draw=function(ctx,S,t,s){if(t<s.dur)return dp.apply(this,arguments);const lt=t-s.dur;
    // the next chapter's camera at lt: as the engine has just drawn it (it draws that chapter first), or found again
    const q=nx.agLast&&Math.abs(nx.agLast.t-lt)<1e-6?nx.agLast:ag_probe(nx,lt);
    if(!q||!q.glides)return nx.draw(ctx,S,lt,nx);
    // before a later moment, what the end shows leaves
    const was=AG_JOIN;AG_JOIN=Object.assign({},was,{cam:q.cam,leave:q.dip?1-ease(clamp(lt/q.dip,0,1)):null});try{return dp.apply(this,arguments);}finally{AG_JOIN=was;}};}}

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
AG_ROOMS.labNight="lab";                                    // the lab by night is the lab: its camera glides on, never jumps
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
  c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.4),0.2);c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(274,490);c.quadraticCurveTo(296,510,322,519);c.stroke();c.restore();
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
  // the nose: its tip on the outline, and inside only one small curve for the near nostril's wing, open towards the tip and fuller as it
  // turns under, with no shade on it (the author chose this of four drafts: a second curve inside the tip, as there was, read as a squiggle)
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

/* ===== Working with agents on Databricks: the Faculty of Health =====
   The opening's and the close's place: the faculty's office, painted once in the module's matte language (the marble wall over the
   oak floor, a tall window on the right, a pinboard of plain cards on the left, three oak desks in a row), and what stands on it,
   drawn live: Anil and his two colleagues at their desks, each person's own agent (the module's sphere) on their desk, each wired
   by a short grey cable to that person's own copy of the data: a spreadsheet on Anil's screen, a laptop with a copy of the student
   table, a folder of reports. Then the cards of the story: the question, the three answers (each with an empty slot where its
   evidence should be, or, a week later, its evidence clipped in), Anil's plan, the spreadsheet of student load, the copy of the
   student table and the folder, close.
   Every name here starts with od_ or OD_. Sizes are in the 1920 x 1080 frame; a close shot (OD_Z1, OD_Z2, OD_Z3) is 1.35 to 1.45
   times the frame, and its cards are drawn in the frame (od_scr in scenes.js), at 28 px or more, so they keep their size whatever
   the camera does. The cables to each person's own copy are grey: nothing of the
   platform's. Clothes keep clear of the colours that mean something. */

/* ---------------------------------------------------------------- where everything stands */
const OD={deskY:800,depth:84,back:716,
  desks:[{x:80,w:560},{x:680,w:560},{x:1280,w:560}],
  // each person: where their neck meets their shoulders, their size; the agent on their desk; their copy
  seat:[{x:240,y:576,s:0.62},{x:840,y:576,s:0.62},{x:1440,y:576,s:0.62}],
  agent:[[400,738],[1000,738],[1600,738]],ar:30,
  answer:[400,1000,1600],ansY:128,                 // the answers over the desks, in the wide shot: their centres, their top
  copy:[[540,724],[1140,758],[1720,770]],          // where each grey cable plugs into its copy
  wall:[[416,650],[1036,650],[1640,650]]           // the platform's socket on the wall behind each desk, where the blue cable goes
};
// the camera: the whole office, and a close shot of each desk, the desk and its agent kept above the captions. In a close shot only
// that desk's person and things are drawn (o.only in od_room): the cards of the story stand where the next desk would be
const OD_WIDE=[0,960,540,1],OD_Z1=[0,712,600,1.35],OD_Z2=[0,1209,600,1.35],OD_Z3=[0,1240,590,1.45];
// a point of the office as a camera sees it, in the frame
const od_see=(cam,p)=>[(p[0]-cam[1])*cam[3]+960,(p[1]-cam[2])*cam[3]+540];
// the two colleagues, drawn for the film in the cast's style, not named; clothes clear of the meaning colours. Each keeps its own
// picture (key): people are kept by key, then by name
const OD_COLA={key:"odColleagueA",name:"A colleague",role:"Faculty of Health",skin:[214,170,138],hair:{style:"bob",c:[58,40,32]},earrings:[208,214,226],top:{kind:"sweater",c:[150,138,146]},breath:0.27};
const OD_COLB={key:"odColleagueB",name:"A colleague",role:"Faculty of Health",skin:[120,84,62],hair:{style:"cropped",c:[22,20,20]},beard:[30,26,24],top:{kind:"overshirt",c:[124,116,104],inner:[230,228,222]},breath:0.25};
const OD_WHO=["anil",OD_COLA,OD_COLB];

/* ---------------------------------------------------------------- the office, painted once */
// a tall window in the wall on the right: a pale sky with the soft shapes of trees far off, white frames, a sill
function od_window(c,x,y,w,h){c.save();
  c.save();c.shadowColor="rgba(46,38,28,0.22)";c.shadowBlur=26;c.shadowOffsetX=AG.sdx;c.shadowOffsetY=10;c.fillStyle="#F1EFEA";c.fillRect(x-16,y-16,w+32,h+32);c.restore();
  let g=c.createLinearGradient(x+w,y,x,y+h);g.addColorStop(0,"#F6F8F7");g.addColorStop(0.55,"#E6EDF0");g.addColorStop(1,"#DCE5E8");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();const R=ag_rnd(41);
  for(let i=0;i<9;i++){const bx=x+R()*w,by=y+h*(0.62+R()*0.2),br=40+R()*60;const tg=c.createRadialGradient(bx,by,0,bx,by,br);
    tg.addColorStop(0,"rgba(150,166,150,0.32)");tg.addColorStop(1,"rgba(150,166,150,0)");c.fillStyle=tg;c.fillRect(bx-br,by-br,2*br,2*br);}
  g=c.createLinearGradient(x,y+h*0.8,x,y+h);g.addColorStop(0,"rgba(200,206,196,0)");g.addColorStop(1,"rgba(196,202,190,0.5)");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.restore();
  // the frames: a mullion and a transom, and the frame's inner shade on its left and top
  c.fillStyle="#EDEBE6";c.fillRect(x+w/2-6,y,12,h);c.fillRect(x,y+h*0.36-6,w,12);
  c.fillStyle="rgba(46,38,28,0.10)";c.fillRect(x,y,w,6);c.fillRect(x,y,6,h);c.fillRect(x+w/2+6,y,3,h);c.fillRect(x,y+h*0.36+6,w,3);
  c.strokeStyle="rgba(60,50,40,0.18)";c.lineWidth=1.5;c.strokeRect(x,y,w,h);
  // the sill
  c.save();c.shadowColor="rgba(46,38,28,0.25)";c.shadowBlur=10;c.shadowOffsetY=6;c.fillStyle="#EFEDE8";c.fillRect(x-30,y+h+14,w+60,16);c.restore();
  c.fillStyle="rgba(255,255,255,0.6)";c.fillRect(x-30,y+h+14,w+60,2);
  c.restore();}
// the window's light, falling in a long soft patch across the wall to its left
function od_windowLight(c,x,y,w,h){c.save();c.globalCompositeOperation="screen";const g=c.createLinearGradient(x,y,x-700,y+520);
  g.addColorStop(0,"rgba(255,248,232,0.18)");g.addColorStop(1,"rgba(255,248,232,0)");c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+h);c.lineTo(x-640,y+h+120);c.lineTo(x-760,y+60);c.closePath();c.fill();c.restore();}
// a pinboard of plain cards: pale oak, a soft grey felt, the cards with faint lines and no words
function od_pinboard(c,x,y,w,h){c.save();
  c.save();c.shadowColor="rgba(46,38,28,0.24)";c.shadowBlur=22;c.shadowOffsetX=AG.sdx;c.shadowOffsetY=10;c.fillStyle=rgba(AG_OAK.base,1);c.fillRect(x-10,y-10,w+20,h+20);c.restore();
  let g=c.createLinearGradient(x-10,y-10,x+w,y+h);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(1,rgba(AG_OAK.dark,1));c.fillStyle=g;c.fillRect(x-10,y-10,w+20,h+20);
  c.fillStyle="#CFCBC3";c.fillRect(x,y,w,h);ag_grain(c,x,y,w,h,3,12);
  const cards=[[18,18,86,62,-0.04],[124,26,98,70,0.03],[30,104,104,76,0.02],[150,116,78,58,-0.05]];
  for(const [cx,cy,cw,ch,r] of cards){c.save();c.translate(x+cx+cw/2,y+cy+ch/2);c.rotate(r);c.shadowColor="rgba(46,38,28,0.22)";c.shadowBlur=6;c.shadowOffsetX=-2;c.shadowOffsetY=3;
    c.fillStyle="#F4F2EE";c.fillRect(-cw/2,-ch/2,cw,ch);c.shadowColor="transparent";c.fillStyle="rgba(86,92,100,0.22)";
    for(let k=0;k<3;k++)c.fillRect(-cw/2+10,-ch/2+16+k*14,cw*(k===2?0.4:0.7),3);c.fillStyle="#8C8780";c.beginPath();c.arc(0,-ch/2+6,3.5,0,TAU);c.fill();c.restore();}
  c.restore();}
AG_PLACES.odOffice=c=>{ag_paintLab(c,{seed:3,quiet:[[960,250,760,170,0.45],[480,90,420,46,0.3]]});
  od_windowLight(c,1660,70,220,470);od_window(c,1660,70,220,470);od_pinboard(c,90,120,250,200);
  for(const d of OD.desks)ag_desk(c,d.x,OD.deskY,d.w,{depth:OD.depth});};

/* ---------------------------------------------------------------- on the desks */
// an agent on a desk: the module's sphere, with its soft shadow on the oak
function od_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx*r/40,y+r*0.96,r*1.05,r*0.2,0.32);ag_model(ctx,x,y,r,{t,core:o.core==null?0.5:o.core,think:o.think||0});
  if(o.lock>0){const lx=x+r*0.85,ly=y-r*0.8,s=Math.max(26,r*0.55);ctx.save();ctx.globalAlpha*=o.lock;ctx.fillStyle="rgba(243,241,237,0.96)";ctx.beginPath();ctx.arc(lx,ly,s*0.62,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(AG.blue,0.5);ctx.lineWidth=1.5;ctx.stroke();ag_lock(ctx,lx,ly+s*0.06,s*0.82,rgba(AG.blue,1));ctx.restore();}
  ctx.restore();}
// a short cable from an agent to what it reads: p0 to p1, sagging onto the desk; u how much has run (0 to 1); col its colour (grey:
// the person's own copy; blue: the platform's tools); a small plug at each end
function od_cable(ctx,p0,p1,u,o){o=o||{};if(u<=0.01)return;const col=o.col||[128,126,122],a=o.a==null?1:o.a,sag=o.sag==null?26:o.sag;
  const p=[p0[0],p0[1],lerp(p0[0],p1[0],0.3),Math.max(p0[1],p1[1])+sag,lerp(p0[0],p1[0],0.7),Math.max(p0[1],p1[1])+sag,p1[0],p1[1]];
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.strokeStyle=rgba(AG.shadow,0.16);ctx.lineWidth=(o.lw||6)+2;ctx.save();ctx.translate(-2,4);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||6;ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=1.6;ctx.save();ctx.translate(0,-1.5);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  const plug=(x,y)=>{ctx.fillStyle=rgba(mix(col,[0,0,0],0.25),1);rr(ctx,x-8,y-7,16,14,4);ctx.fill();};plug(p0[0],p0[1]);const e=ag_bz(p,u);if(u>0.97)plug(e[0],e[1]);
  ctx.restore();return p;}
// a laptop on a desk, its base's front edge's middle at (x, y): o.draw(ctx, gx, gy, gw, gh) draws what its screen shows
function od_laptop(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const sh=w*0.62,bx0=x-w/2,by=y;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx,by+4,w*0.6,10,0.24);
  // the base: a thin slab seen from above
  ctx.fillStyle="#C9C7C2";ctx.beginPath();ctx.moveTo(bx0+w*0.06,by-26);ctx.lineTo(bx0+w*0.94,by-26);ctx.lineTo(bx0+w,by);ctx.lineTo(bx0,by);ctx.closePath();ctx.fill();
  ctx.fillStyle="#B4B2AD";ctx.fillRect(bx0,by,w,5);ctx.fillStyle="rgba(60,60,64,0.18)";for(let k=0;k<3;k++)ctx.fillRect(bx0+w*0.12,by-21+k*6,w*0.76,2.5);
  // the lid, tilted back, its screen
  const gx=bx0+w*0.07,gy=by-26-sh,gw=w*0.86,gh=sh-10;ctx.fillStyle="#3A3B40";rr(ctx,gx-8,gy-8,gw+16,gh+16,8);ctx.fill();
  ctx.save();rr(ctx,gx,gy,gw,gh,3);ctx.clip();ctx.fillStyle="#EEF0EE";ctx.fillRect(gx,gy,gw,gh);if(o.draw)o.draw(ctx,gx,gy,gw,gh);ctx.restore();
  ctx.restore();}
// a folder of reports standing on a desk, its foot's left at (x, y): a box file and a thinner one beside it, pale stone grey;
// o.open 0 to 1 tips the front one forward a little
function od_folder(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+70,y+4,90,10,0.25);
  const box=(bx,bw,bh,col,tilt)=>{ctx.save();ctx.translate(bx,y);ctx.rotate(tilt);
    ag_soft(ctx,c=>ag_rect(c,0,-bh,bw,bh,5),col,mix(col,[255,255,255],0.4),bw*0.7,-bh+12,bh*0.9,"rgba(46,38,28,0.3)",10,0.5);
    ctx.fillStyle="rgba(250,248,244,0.92)";rr(ctx,bw*0.2,-bh*0.82,bw*0.6,bh*0.24,4);ctx.fill();ctx.fillStyle="#57524C";ctx.beginPath();ctx.arc(bw/2,-bh*0.3,bw*0.12,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(250,248,244,0.92)";ctx.beginPath();ctx.arc(bw/2,-bh*0.3,bw*0.06,0,TAU);ctx.fill();ctx.restore();};
  box(x+66,40,140,[176,172,164],0);box(x,62,150,[160,158,152],-0.1*(o.open||0));ctx.restore();}
// what a screen shows: a spreadsheet (a grey grid, one row picked out), a table (rows), or nothing
function od_gridShows(ctx,x,y,w,h,o){o=o||{};ctx.fillStyle="#F7F7F4";ctx.fillRect(x,y,w,h);ctx.strokeStyle="rgba(86,92,100,0.28)";ctx.lineWidth=1;
  const rows=6,rh=h/rows;for(let i=1;i<rows;i++){ctx.beginPath();ctx.moveTo(x,y+i*rh);ctx.lineTo(x+w,y+i*rh);ctx.stroke();}
  for(const f of [0.42,0.72]){ctx.beginPath();ctx.moveTo(x+w*f,y);ctx.lineTo(x+w*f,y+h);ctx.stroke();}
  ctx.fillStyle="rgba(86,92,100,0.16)";ctx.fillRect(x,y,w,rh);if(o.pick>0){ctx.fillStyle=rgba(AG.orange,0.22*o.pick);ctx.fillRect(x,y+4*rh,w,rh);}}
function od_rowsShows(ctx,x,y,w,h,o){o=o||{};ctx.fillStyle="#F7F7F4";ctx.fillRect(x,y,w,h);const n=7,rh=h/n;
  for(let i=0;i<n;i++){ctx.fillStyle=i===0?"rgba(86,92,100,0.26)":"rgba(86,92,100,0.13)";ctx.fillRect(x+6,y+i*rh+rh*0.3,(i===0?0.8:0.4+0.45*((i*37)%10)/10)*(w-12),rh*0.4);}}

/* ---------------------------------------------------------------- the office's live layer
   The three at their desks and what stands on them, in the office's light. o: lit [3] each agent's band (0 to 1), cable [3] how
   far each grey cable has run, blue 0 to 1 each agent's blue cable to the platform's socket on the wall behind its desk, gone 0 to 1
   the copies fade, smile [3], gaze; sheet 0 to 1 Anil's screen picks out Health's row; only: draw that desk alone (a close shot) */
function od_socket(c,x,y,a){if(a<=0)return;c.save();c.globalAlpha*=a;c.save();c.shadowColor="rgba(46,38,28,0.22)";c.shadowBlur=8;c.shadowOffsetX=AG.sdx*0.3;c.shadowOffsetY=3;
  c.fillStyle="#F1EFEA";rr(c,x-22,y-26,44,40,7);c.fill();c.restore();c.strokeStyle=rgba(AG.blue,0.6);c.lineWidth=2;rr(c,x-22,y-26,44,40,7);c.stroke();
  c.fillStyle="#2E2F34";rr(c,x-10,y-14,20,16,4);c.fill();c.restore();}
function od_room(c,tt,o){o=o||{};const lit=o.lit||[0,0,0],cab=o.cable||[0,0,0],gone=o.gone||0,blue=o.blue||0,sm=o.smile||[0,0,0],on=i=>o.only==null||o.only===i;
  const keep=1-gone;
  for(let i=0;i<3;i++)if(blue>0&&on(i))od_socket(c,OD.wall[i][0],OD.wall[i][1],ag_in(blue,0,0.3));
  OD.seat.forEach((p,i)=>{if(on(i))ag_person(c,OD_WHO[i],p.x,p.y,p.s,{t:tt+i*1.3,cut:OD.back,gaze:(o.gaze&&o.gaze[i])||[4,1],smile:sm[i]});});
  // Anil's screen with his spreadsheet; the laptop with its copy; the folder of reports
  if(on(0))ag_screen(c,455,572,170,108,{stand:30,draw:(x,gx,gy,gw,gh)=>{if(keep>0.01){x.save();x.globalAlpha*=keep;od_gridShows(x,gx,gy,gw,gh,{pick:o.sheet||0});x.restore();}}});
  if(on(1))od_laptop(c,1150,782,170,{draw:(x,gx,gy,gw,gh)=>{if(keep>0.01){x.save();x.globalAlpha*=keep;od_rowsShows(x,gx,gy,gw,gh);x.restore();}}});
  if(on(2))od_folder(c,1680,792,{a:keep});
  for(let i=0;i<3;i++){if(!on(i))continue;const [ax,ay]=OD.agent[i],from=[ax+OD.ar*0.55,ay+OD.ar*0.8];
    if(cab[i]>0)od_cable(c,from,OD.copy[i],cab[i],{a:keep,sag:i===2?14:22});
    if(blue>0){const u=clamp(blue*1.25-i*0.12,0,1),w=OD.wall[i];od_cable(c,[ax+OD.ar*0.7,ay+OD.ar*0.45],[w[0],w[1]-6],u,{col:AG.blue,sag:18,lw:5});}
    od_agent(c,ax,ay,OD.ar,tt+i*0.9,{core:lerp(0.35,1,lit[i]),think:0.5*lit[i]});}
  ag_roomLight(c,1);}

/* ---------------------------------------------------------------- the story's cards */
// a place's tag, in a corner, in the films' mono type: where and when
function od_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const w=ag_tw(ctx,s,{w:500,size:28,f:"mono"})+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.2)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(243,241,237,0.95)";ctx.fill();ctx.restore();
  ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,12);ctx.stroke();ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}
// a card that springs in at t0 and fades at t1 (ag_textCard)
function od_cardAt(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;
  return ag_textCard(ctx,x,y,w,words,Object.assign({},o,{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}
// a pill that springs in at t0 and fades at t1
function od_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));ag_pill(ctx,x,y,text,o||{});ctx.restore();}
// a small grey word that settles beside what it names ("deleted")
function od_note(ctx,x,y,text,a,o){o=o||{};if(a<=0)return;ag_T(ctx,text,x,y,{w:700,size:o.size||28,col:o.col||AG.mut,a,align:o.align||"center"});}

// an answer, as an agent gives it: its number in orange, what it counts, and under them a slot for what it read. o.none (0 to 1):
// an empty dashed slot, "evidence: none"; o.ev (0 to 1): its evidence clipped in, three chips one after another ("query", "table",
// "definition"); o.tick (0 to 1) a green tick, checked; o.from [x, y] and o.u (0 to 1): it rises from there (the agent) to its
// place; (cx, y): its top's middle. Drawn at the frame's size. Returns its box
const OD_EV=["query","table","definition"],OD_ANS_H=206;
function od_ansW(ctx){return Math.max(420,OD_EV.reduce((s,e)=>s+ag_tw(ctx,e,{w:600,size:28})+28,0)+20+56+52);}
function od_answer(ctx,cx,y,num,o){o=o||{};const w=o.w||od_ansW(ctx),h=OD_ANS_H,x=cx-w/2,a=(o.a==null?1:o.a),u=o.u==null?1:o.u;if(a<=0||u<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a*clamp(u*3,0,1);
  if(o.from&&u<1){const e=ag_eo(u),k=lerp(0.2,1,Math.min(1,ag_spr(u,0,0.42))),px=lerp(o.from[0],cx,e),py=lerp(o.from[1],y+h/2,e);ctx.translate(px,py);ctx.scale(k,k);ctx.translate(-cx,-(y+h/2));}
  ag_box(ctx,x,y,w,h,22,{edge:o.tick>0.5?AG.green:null});
  ag_T(ctx,num,x+28,y+70,{w:800,size:54,col:AG.orange,a:o.numA==null?1:o.numA});
  ag_T(ctx,o.sub||"Health's students",x+28,y+108,{w:600,size:28,col:AG.mut});
  if(o.tick>0)ag_tick(ctx,x+w-50,y+48,30,rgba(AG.green,o.tick),5);
  const sy=y+128,sh=56;
  if(o.none>0){ctx.save();ctx.globalAlpha*=o.none;ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(AG.mut,0.7);ctx.lineWidth=2.2;rr(ctx,x+24,sy,w-48,sh,12);ctx.stroke();ctx.setLineDash([]);
    ag_T(ctx,"evidence: none",cx,sy+sh/2+10,{w:600,size:28,col:AG.mut,align:"center"});ctx.restore();}
  if(o.ev>0){ag_clip(ctx,x+38,sy+6,44,"#5E5A55");let ex=x+70;OD_EV.forEach((e,i)=>{const k=clamp(o.ev*OD_EV.length-i,0,1);const ew=ag_tw(ctx,e,{w:600,size:28})+28;
      if(k>0){ctx.save();ctx.globalAlpha*=ag_in(k,0,0.5);const yy=sy+(1-Math.min(1,ag_spr(k,0,0.5)))*14;ag_box(ctx,ex,yy,ew,sh,14,{edge:AG.orange,edgeA:0.7,lw:2});
        ag_T(ctx,e,ex+ew/2,yy+sh/2+10,{w:600,size:28,align:"center"});ctx.restore();}ex+=ew+10;});}
  ctx.restore();return{x,y,w,h};}
// a card of the story, springing up from its foot's middle: k (0 to 1)
function od_spring(ctx,x,y,w,h,k){if(k!=null)ag_about(ctx,x+w/2,y+h,lerp(0.6,1,Math.min(1,ag_spr(k,0,0.5))));}

// the spreadsheet on Anil's screen, shown large: student load, made for the funding bid, by faculty, in full-time equivalents.
// rows 0 to 1 the rows come in; pick 0 to 1 Health's row is picked out; half (0 to 1) two half-time students close into one. 760 wide
function od_sheet(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=760,h=o.half!=null?452:372;ctx.save();ctx.globalAlpha*=a;od_spring(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,20,{});ag_T(ctx,"Student load · for the funding bid",x+32,y+54,{w:700,size:32});
  ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(x+26,y+80,w-52,1.5);
  ag_T(ctx,"faculty",x+32,y+124,{w:600,size:28,col:AG.mut});ag_T(ctx,"full-time equivalents",x+w-32,y+124,{w:600,size:28,col:AG.mut,align:"right"});
  const fac=["Arts and Education","Business","Engineering and IT","Health"];
  fac.forEach((f,i)=>{const k=clamp((o.rows==null?1:o.rows)*4-i,0,1);if(k<=0)return;const yy=y+182+i*50;ctx.save();ctx.globalAlpha*=k;
    if(i===3&&o.pick>0){ctx.fillStyle=rgba(AG.orange,0.14*o.pick);rr(ctx,x+18,yy-34,w-36,48,10);ctx.fill();}
    ag_T(ctx,f,x+32,yy,{w:i===3?700:500,size:28,col:i===3?AG.ink:AG.mut});
    if(i<3){ctx.fillStyle="rgba(86,92,100,0.22)";rr(ctx,x+w-32-90,yy-16,90,14,7);ctx.fill();}
    else ag_T(ctx,"2,160",x+w-32,yy,{w:800,size:32,col:AG.orange,align:"right"});ctx.restore();});
  if(o.half!=null&&o.half>-1){const hy=y+h-46,ha=ag_in(o.half,-0.4,0.4),k=ag_sine(clamp(o.half,0,1)),gap=lerp(52,0,k),r=22,hx=x+86;
    ctx.save();ctx.globalAlpha*=ha;ctx.fillStyle="rgba(60,50,40,0.1)";ctx.fillRect(x+26,y+h-96,w-52,1.5);ctx.fillStyle=rgba(AG.mut,0.55);
    for(const sd of [-1,1]){ctx.beginPath();ctx.arc(hx+sd*gap/2,hy,r,sd<0?Math.PI/2:-Math.PI/2,sd<0?Math.PI*1.5:Math.PI/2);ctx.closePath();ctx.fill();}
    if(k>0.98){ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,r,0,TAU);ctx.stroke();}
    ag_T(ctx,"two half-time students = 1 in load",x+152,hy+10,{w:600,size:28,col:AG.ink});ctx.restore();}
  ctx.restore();}

// the copy of the student table on the laptop, shown large: Health's degrees, each with Health in its name, as the student system
// names them (the example project's awards), and the joint degree in no faculty. o.hl (0 to 3): the word Health lit in each row in
// turn; o.joint 0 to 1: the last row widens, amber; o.names 0 to 1: the rows become a list of names, blurred on purpose. 820 wide
const OD_DEG=[["Master of Public ","Health",""],["Graduate Certificate in ","Health"," Informatics"],["","Health"," data"]];
function od_tableCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=820,h=312;ctx.save();ctx.globalAlpha*=a;od_spring(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,20,{});ag_T(ctx,"Copy of the student table",x+32,y+54,{w:700,size:32});ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(x+26,y+80,w-52,1.5);
  const nm=o.names||0;
  if(nm<1){ctx.save();ctx.globalAlpha*=1-nm;OD_DEG.forEach((d,i)=>{const yy=y+142+i*62,k=clamp((o.rows==null?1:o.rows)*3-i,0,1);if(k<=0)return;ctx.save();ctx.globalAlpha*=k;
      const jo=i===2?(o.joint||0):0,f={w:500,size:30},x0=x+32,w0=ag_tw(ctx,d[0],f),w1=ag_tw(ctx,d[1],Object.assign({},f,{w:700}));
      if(jo>0){ctx.fillStyle=rgba(AG.amber,0.12*jo);rr(ctx,x+16,yy-38,w-32,54,10);ctx.fill();ctx.strokeStyle=rgba(AG.amber,0.7*jo);ctx.lineWidth=2;rr(ctx,x+16,yy-38,w-32,54,10);ctx.stroke();}
      const hl=clamp((o.hl||0)-i,0,1);if(hl>0){ctx.fillStyle=rgba(i===2&&jo>0?AG.amber:AG.orange,0.2*hl);rr(ctx,x0+w0-6,yy-28,w1+12,38,8);ctx.fill();}
      ag_T(ctx,d[0],x0,yy,f);ag_T(ctx,d[1],x0+w0,yy,Object.assign({},f,{w:700,col:hl>0.5?(i===2&&jo>0?AG.amber:AG.orange):AG.ink}));ag_T(ctx,d[2],x0+w0+w1,yy,f);
      if(jo>0)ag_T(ctx," · joint degree · no faculty · 31",x0+w0+w1+ag_tw(ctx,d[2],f),yy,{w:500,size:30,col:AG.amber,a:jo});
      ctx.restore();});ctx.restore();}
  if(nm>0){ctx.save();ctx.globalAlpha*=nm;ctx.filter="blur(5px)";const R=ag_rnd(7);for(let i=0;i<5;i++){const yy=y+112+i*38;ctx.fillStyle="rgba(60,64,72,0.42)";
      rr(ctx,x+34,yy,140+R()*110,18,9);ctx.fill();rr(ctx,x+250+R()*40,yy,180+R()*150,18,9);ctx.fill();ctx.fillStyle="rgba(60,64,72,0.24)";rr(ctx,x+w-170,yy,120,18,9);ctx.fill();}
    ctx.filter="none";ctx.restore();}
  ctx.restore();}

// the folder of reports, opened: its tab "Reports", and pages fanning out of it, their grey lines decoration. 760 wide
function od_reports(ctx,x,y,open,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=760,h=300;ctx.save();ctx.globalAlpha*=a;od_spring(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,20,{});ag_T(ctx,"Reports",x+32,y+54,{w:700,size:32});ag_T(ctx,"Health's student numbers, by term",x+w-32,y+54,{w:500,size:28,col:AG.mut,align:"right"});
  for(let i=0;i<6;i++){const k=clamp(open*6-i*0.8,0,1),e=Math.min(1,ag_spr(k,0,0.5));if(k<=0)continue;const px=x+40+i*118,py=y+96+(1-e)*30;ctx.save();ctx.translate(px+50,py+86);ctx.rotate((i-2.5)*0.045*e);
    ctx.shadowColor="rgba(46,38,28,0.2)";ctx.shadowBlur=8;ctx.shadowOffsetX=-2;ctx.shadowOffsetY=4;ctx.fillStyle="#FAF9F6";ctx.fillRect(-50,-82,100,164);ctx.shadowColor="transparent";
    ctx.fillStyle="rgba(86,92,100,0.28)";ctx.fillRect(-36,-64,58,7);for(let l=0;l<7;l++)ctx.fillRect(-36,-42+l*16,(l%2?52:70),4);ctx.restore();}
  ctx.restore();}

// Anil's plan for next year's places: the students, the places, and the gap. lo 0 to 1: planned for the lowest answer, the places
// stop short and a dashed amber gap shows, "720 students with no place"; ok 0 to 1: the places reach every student, green. 760 wide
function od_plan(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=760,h=332,bw=w-64,ok=o.ok||0,lo=o.lo||0;ctx.save();ctx.globalAlpha*=a;od_spring(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,20,{});if(ok>0){ctx.save();ctx.strokeStyle=rgba(AG.green,0.9*ok);ctx.lineWidth=2.4;ctx.beginPath();ag_rect(ctx,x,y,w,h,20);ctx.stroke();ctx.restore();}
  ag_T(ctx,"Next year's places",x+32,y+54,{w:700,size:32});if(ok>0)ag_tick(ctx,x+w-52,y+42,30,rgba(AG.green,ok),5);
  ag_T(ctx,"students on census day",x+32,y+112,{w:500,size:28,col:AG.mut});ctx.fillStyle=rgba(AG.mut,0.18);rr(ctx,x+32,y+128,bw,32,9);ctx.fill();
  ctx.strokeStyle=rgba(AG.mut,0.55);ctx.lineWidth=2;rr(ctx,x+32,y+128,bw,32,9);ctx.stroke();
  const fr=lerp(0.75,1,ok),fw=bw*fr,col=mix([120,124,132],AG.green,ok);  // the places grow to every student and turn green as they grow
  const o1=clamp(1-2*ok,0,1),o2=clamp(2*ok-1,0,1);  // the old words fade out, then the new ones in: nothing swaps in one frame, and the two never overlap
  if(o1>0)ag_T(ctx,"places for 2,160",x+32,y+212,{w:700,size:28,a:o1});if(o2>0)ag_T(ctx,"a place for every student",x+32,y+212,{w:700,size:28,col:AG.green,a:o2});
  ctx.fillStyle=rgba(col,0.85);rr(ctx,x+32,y+228,fw,32,9);ctx.fill();
  if(lo>0&&ok<1){ctx.save();ctx.globalAlpha*=lo*(1-ok);const gx=x+32+bw*0.75+5,gw=bw*0.25-5;ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=2.5;rr(ctx,gx,y+228,gw,32,9);ctx.stroke();ctx.setLineDash([]);
    ag_T(ctx,"720 students with no place",x+w-32,y+300,{w:700,size:28,col:AG.amber,align:"right"});ctx.restore();}
  ctx.restore();}

/* ===== Working with agents on Databricks: the platform =====
   The data team's room is the module's lab ("lab", and at night "labNight"); what the film puts in it is drawn here, live, in the
   module's colours, never a product's own: no logo, no screen captured. The platform's pages are matte off-white cards with a small
   bar naming the product ("Databricks · Genie One"), as Meaning on the platform drew its own.
     od_shelf       the long oak shelf of the opening, "Databricks", with three blue sections and the tools' sockets
     od_strip       the four ways agents work on the platform, four numbered cards along the top, from One place to the end of
                    Agents that write code, each lit in its chapter
     od_dbCard      the platform, and its governed data: "Databricks", with Unity Catalog inside it
     od_page        a page of the platform, with its bar; od_genieOne and od_genieAgent fill two of them
     od_tool        a tool server's card, with its socket and a plug; od_toolPanel the panel the platform runs them in; od_fnCard the census count as a function
     od_job, od_trace, od_eval, od_bricks   the nightly job, the census check agent's trace, its evaluation, and Agent Bricks
     od_pipeline    Sam's pipeline editor with Genie Code beside it; od_skillsScreen, od_editorScreen the two screens of the wide shot
     od_draft       a draft on a branch, with its marks; od_folderCard a folder or a set of files on the wall
   Every name starts with od_ or OD_. Sizes are in the 1920 x 1080 frame, seen at zoom 1. */

/* ---------------------------------------------------------------- the opening's shelf: one place for data and tools */
const OD_SHELF={x:120,y:236,w:1100,secs:["governed tables","definitions","tools"]};
// o.a; o.k (0 to 1) it builds, section by section; o.glow (0 to 1) the tools' section lit. Returns the tools' sockets [[x, y], ...]
function od_shelf(ctx,o){o=o||{};const S_=OD_SHELF,a=o.a==null?1:o.a,py=S_.y+150;if(a<=0)return od_sockets();ctx.save();ctx.globalAlpha*=a;
  ag_label(ctx,S_.x+8,S_.y,"Databricks",{col:AG.blue,size:30});
  // the plank, on two brackets, with its shadow on the marble
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.28)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(AG_OAK.base,1);ctx.fillRect(S_.x,py,S_.w,26);ctx.restore();
  let g=ctx.createLinearGradient(0,py,0,py+26);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(0.3,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;ctx.fillRect(S_.x,py,S_.w,26);
  for(const bx of [S_.x+60,S_.x+S_.w-80]){ctx.fillStyle="#3A3B40";ctx.fillRect(bx,py+26,14,30);}
  const b=od_secBoxes(ctx);b.forEach((r,i)=>{const k=o.k==null?1:clamp(o.k*3-i,0,1);if(k<=0)return;const e=ag_spr(k,0,0.5);ctx.save();ctx.globalAlpha*=ag_in(k,0,0.4);
    ctx.translate(0,(1-e)*-24);const gl=i===2?(o.glow||0):0;ag_box(ctx,r.x,r.y,r.w,r.h,16,{edge:AG.blue,edgeA:0.55+0.4*gl,glow:gl>0.05?AG.blue:null,glowA:gl});
    ag_T(ctx,S_.secs[i],r.x+r.w/2,r.y+r.h/2+10,{w:700,size:30,align:"center",col:AG.blue});ctx.restore();});
  for(const [sx,sy] of od_sockets()){ctx.fillStyle="#2E2F34";rr(ctx,sx-11,sy-8,22,16,5);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(sx-6,sy-3,12,2);}
  ctx.restore();return od_sockets();}
function od_secBoxes(ctx){const S_=OD_SHELF,ws=S_.secs.map(s=>ag_tw(ctx,s,{w:700,size:30})+64),gap=(S_.w-40-ws.reduce((p,q)=>p+q,0))/2;let x=S_.x+20;
  return ws.map(w=>{const r={x,y:S_.y+40,w,h:104};x+=w+gap;return r;});}
// three sockets on the plank's front edge, under the tools' section
function od_sockets(){const S_=OD_SHELF,x1=S_.x+S_.w-20,py=S_.y+150+13;return[[x1-250,py],[x1-160,py],[x1-70,py]];}

/* ---------------------------------------------------------------- the four ways, along the top */
const OD_WAYS=["Agents that answer","Tool servers","Agents the team builds","Agents that write code"];
function od_wayBoxes(ctx){const ws=OD_WAYS.map(s=>ag_tw(ctx,s,{w:700,size:28})+56+28),gap=(1728-ws.reduce((p,q)=>p+q,0))/3;let x=96;return ws.map(w=>{const r={x,y:130,w,h:60};x+=w+gap;return r;});}
// in screen space. o.k [4] each card springs in; o.on [4] how lit each is (its edge blue, its words ink, the others quieter); o.a.
// Returns the cards' boxes
function od_strip(ctx,o){o=o||{};const a=o.a==null?1:o.a,b=od_wayBoxes(ctx);if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  b.forEach((r,i)=>{const k=o.k?o.k[i]:1;if(k<=0)return;const e=Math.min(1,ag_spr(k,0,0.5)),on=o.on?o.on[i]:0,quiet=o.on&&Math.max(...o.on)>0.5&&on<0.5;
    ctx.save();ctx.globalAlpha*=ag_in(k,0,0.3);ag_about(ctx,r.x+r.w/2,r.y+r.h/2,lerp(0.7,1,e));
    ag_box(ctx,r.x,r.y,r.w,r.h,16,{edge:on>0.05?AG.blue:null,edgeA:0.9*on,glow:on>0.05?AG.blue:null,glowA:on});
    ag_T(ctx,String(i+1),r.x+26,r.y+40,{w:500,size:28,f:"mono",col:AG.violet});
    ag_T(ctx,OD_WAYS[i],r.x+56,r.y+40,{w:700,size:28,col:quiet?AG.mut:AG.ink});
    ctx.restore();});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the platform, and its governed data */
const OD_DB={x:330,y:214,w:1260,h:280},OD_UC={x:362,y:290,w:1196,h:176},OD_UCP=["tables","definitions","who may read what"];
// o.parts [3] each part of Unity Catalog lit; o.uc (0 to 1) Unity Catalog's frame drawn; o.from {x, y, w, h}: it grows from there (u)
function od_dbCard(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const D=OD_DB,U=OD_UC;ctx.save();ctx.globalAlpha*=a;
  if(o.from&&o.u<1){const e=ag_sine(o.u),f=o.from;ctx.translate(lerp(f.x+f.w/2,D.x+D.w/2,e),lerp(f.y+f.h/2,D.y+D.h/2,e));ctx.scale(lerp(f.w/D.w,1,e),lerp(f.h/D.h,1,e));ctx.translate(-(D.x+D.w/2),-(D.y+D.h/2));}
  ag_box(ctx,D.x,D.y,D.w,D.h,24,{edge:AG.blue,edgeA:0.5});ag_T(ctx,"Databricks",D.x+32,D.y+54,{w:800,size:40,a:o.title==null?1:o.title});
  const uc=o.uc==null?1:o.uc;if(uc>0){ctx.save();ctx.globalAlpha*=uc;ctx.strokeStyle=rgba(AG.blue,0.75);ctx.lineWidth=2.5;rr(ctx,U.x,U.y,U.w,U.h,18);ctx.stroke();
    ctx.fillStyle=rgba(AG.blue,0.05);rr(ctx,U.x,U.y,U.w,U.h,18);ctx.fill();ag_label(ctx,U.x+28,U.y+46,"Unity Catalog",{col:AG.blue});
    od_ucParts(ctx).forEach((r,i)=>{const on=o.parts?o.parts[i]:1;if(on<=0)return;ctx.save();ctx.globalAlpha*=ag_in(on,0,0.5);
      ag_box(ctx,r.x,r.y,r.w,r.h,r.h/2,{edge:AG.blue,edgeA:0.4+0.5*clamp(on,0,1)});ag_T(ctx,OD_UCP[i],r.x+r.w/2,r.y+r.h/2+10,{w:700,size:30,align:"center",col:AG.blue});ctx.restore();});
    ctx.restore();}
  ctx.restore();}
function od_ucParts(ctx){const U=OD_UC,ws=OD_UCP.map(s=>ag_tw(ctx,s,{w:700,size:30})+72),gap=(U.w-56-ws.reduce((p,q)=>p+q,0))/2;let x=U.x+28;return ws.map(w=>{const r={x,y:U.y+86,w,h:62};x+=w+gap;return r;});}

/* ---------------------------------------------------------------- a page of the platform
   A matte page with a bar along its top, naming the product in the module's blue: "Databricks · Genie One". o.a; o.dx, o.dy slide it;
   o.dim (0 to 1) it sinks back, behind another */
function od_page(ctx,x,y,w,h,bar,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(o.dx||0,o.dy||0);
  ag_box(ctx,x,y,w,h,22,{});ctx.save();rr(ctx,x,y,w,h,22);ctx.clip();ctx.fillStyle=rgba(AG.blue,0.09);ctx.fillRect(x,y,w,64);ctx.fillStyle=rgba(AG.blue,0.25);ctx.fillRect(x,y+64,w,1.5);ctx.restore();
  for(let i=0;i<3;i++){ctx.fillStyle=rgba(AG.mut,0.35);ctx.beginPath();ctx.arc(x+30+i*20,y+32,5,0,TAU);ctx.fill();}
  ag_T(ctx,bar,x+100,y+42,{w:700,size:28,col:AG.blue});
  if(o.dim>0){ctx.fillStyle="rgba(232,230,225,"+(0.55*o.dim)+")";rr(ctx,x,y,w,h,22);ctx.fill();}
  ctx.restore();}
// a speech bubble on a page: the question (right, pale) or the answer (left)
function od_bubble(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=o.ask?"rgba(86,92,100,0.08)":"rgba(255,255,255,0.75)";rr(ctx,x,y,w,h,20);ctx.fill();ctx.strokeStyle=o.ask?"rgba(86,92,100,0.22)":rgba(o.edge||AG.orange,0.5);ctx.lineWidth=1.8;rr(ctx,x,y,w,h,20);ctx.stroke();ctx.restore();}
// a chip: a small pill with a coloured edge, its words at 28 px; returns its width
function od_chip(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,f={w:o.w||600,size:28,f:o.f},w=ag_tw(ctx,text,f)+(o.icon?72:40),h=48;if(a<=0)return w;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,h/2,{edge:o.col||AG.blue,edgeA:0.75,lw:2});if(o.icon==="lock")ag_lock(ctx,x+34,y+h/2+4,26,rgba(o.col||AG.blue,1));else if(o.icon==="tick")ag_tick(ctx,x+34,y+h/2,22,rgba(o.col||AG.green,1),4);
  ag_T(ctx,text,x+(o.icon?60:20),y+h/2+10,Object.assign({},f,{col:o.tcol||AG.ink}));ctx.restore();return w;}

// Genie One: a question typed in, its answer, and where the answer's words come from. T: {q (0 to 1) typed, ans, chip, tag}
const OD_PG={x:240,y:222,w:1440,h:630};
function od_genieOne(ctx,T,o){o=o||{};const P=OD_PG,a=o.a==null?1:o.a;if(a<=0)return;od_page(ctx,P.x,P.y,P.w,P.h,"Databricks · Genie One",{a,dim:o.dim,dx:o.dx});ctx.save();ctx.globalAlpha*=a;ctx.translate(o.dx||0,0);
  if(o.dim>0)ctx.globalAlpha*=1-0.6*o.dim;
  const q="How many students did Health have on census day?",n=Math.round(q.length*clamp(T.q||0,0,1));
  if((T.q||0)>0){const qw=ag_tw(ctx,q,{w:600,size:30})+56;od_bubble(ctx,P.x+P.w-40-qw,P.y+110,qw,72,{ask:true});ag_T(ctx,q.slice(0,n),P.x+P.w-40-qw+28,P.y+156,{w:600,size:30});}
  const an=T.ans||0;if(an>0){ctx.save();ctx.globalAlpha*=ag_in(an,0,0.5);const by=P.y+230+(1-ag_eo(clamp(an,0,1)))*16;od_bubble(ctx,P.x+40,by,700,150,{});
    ag_model(ctx,P.x+88,by+52,24,{t:o.t||0,core:1});ag_T(ctx,"2,880",P.x+130,by+70,{w:800,size:48,col:AG.orange});
    ag_T(ctx,"students on census day",P.x+130+ag_tw(ctx,"2,880 ",{w:800,size:48}),by+70,{w:700,size:36});
    const ch=T.chip||0;if(ch>0)od_chip(ctx,P.x+130,by+90+(1-ag_spr(ch,0,0.5))*10,"census rule · Planning",{col:AG.orange,a:ag_in(ch,0,0.3)});ctx.restore();}
  const tg=T.tag||0;if(tg>0){const s="Meaning on the platform",f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=P.x+P.w-40-w,y=P.y+P.h-90;ctx.save();ctx.globalAlpha*=ag_in(tg,0,0.5);
    ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.2;rr(ctx,x,y,w,56,12);ctx.stroke();ctx.setLineDash([]);ag_T(ctx,s,x+24,y+38,f);ctx.restore();}
  ctx.restore();}

// the Census day Genie Agent: its four parts down the left, each lit in turn, and what each holds. T: {top (title), tab [4] how lit
// each part is, data, instr, bench (0 to 1 the rows come in), sqlA (the chips "SQL answer"), good (0 to 3, each row marked Good),
// code (0 to 1, an answer with its code open)}
const OD_TABS=["Data","Instructions","Example query","Benchmarks"];
const OD_BENCH=[["Health's students on census day","2,880"],["Students in no faculty","31"],["All students on census day","18,412"]];
function od_genieAgent(ctx,T,o){o=o||{};const P=OD_PG,a=o.a==null?1:o.a;if(a<=0)return;od_page(ctx,P.x,P.y,P.w,P.h,"Databricks · Genie Agent",{a,dx:o.dx});ctx.save();ctx.globalAlpha*=a;ctx.translate(o.dx||0,0);
  const tp=T.top==null?1:T.top;if(tp>0){ctx.save();ctx.globalAlpha*=tp;ag_T(ctx,"Census day",P.x+40,P.y+132,{w:800,size:44});ag_T(ctx,"built by the data team",P.x+40,P.y+176,{w:600,size:28,col:AG.mut});ctx.restore();}
  ctx.fillStyle="rgba(60,50,40,0.12)";ctx.fillRect(P.x+330,P.y+214,1.5,P.h-244);
  OD_TABS.forEach((s,i)=>{const on=T.tab?T.tab[i]:0,y=P.y+262+i*70;if(on>0.02){ctx.save();ctx.globalAlpha*=on;ctx.fillStyle=rgba(AG.blue,0.1);rr(ctx,P.x+24,y-38,292,56,14);ctx.fill();ctx.fillStyle=rgba(AG.blue,0.9);rr(ctx,P.x+24,y-38,6,56,3);ctx.fill();ctx.restore();}
    ag_T(ctx,s,P.x+48,y,{w:700,size:30,col:on>0.5?AG.blue:AG.ink});});
  const cx=P.x+370,cw=P.w-410,cy=P.y+226;
  // Data: the governed table it reads, read only
  const d=T.data||0;if(d>0){ctx.save();ctx.globalAlpha*=ag_in(d,0,0.4)*(1-ag_in(d,1.5,0.5));const s="Students on census day · Planning's count",w=ag_tw(ctx,s,{w:700,size:30})+120;
    ag_box(ctx,cx,cy+(1-ag_eo(clamp(d,0,1)))*14,w,92,18,{edge:AG.blue,edgeA:0.6});ag_lock(ctx,cx+44,cy+52,30,rgba(AG.blue,1));ag_T(ctx,s,cx+84,cy+58,{w:700,size:30});ctx.restore();}
  // Instructions: the team's definition, in its own words
  const ins=T.instr||0;if(ins>0){ctx.save();ctx.globalAlpha*=ag_in(ins,0,0.4)*(1-ag_in(ins,1.5,0.5));const L=ag_wrap(ctx,"A student is a person, counted once, as their record stood on census day.",cw-120,{w:600,size:32});
    ag_box(ctx,cx,cy,cw,60+L.length*46,18,{});ctx.fillStyle=rgba(AG.violet,0.6);rr(ctx,cx+24,cy+24,6,L.length*46+12,3);ctx.fill();ag_lines(ctx,L,cx+56,cy+62,46,{w:600,size:32});ctx.restore();}
  // Benchmarks: the questions behind Health's three answers, each with its right answer and its SQL answer, marked Good
  const bn=T.bench||0;if(bn>0){ctx.save();ctx.globalAlpha*=1-ag_in(bn,1.5,0.5);OD_BENCH.forEach((r,i)=>{const k=clamp(Math.min(bn,1)*3-i,0,1);if(k<=0)return;const y=cy+i*112,e=ag_eo(k);
      ctx.save();ctx.globalAlpha*=ag_in(k,0,0.4);ctx.translate((1-e)*30,0);ag_box(ctx,cx,y,cw,92,18,{edge:(T.good||0)-i>0.5?AG.green:null,edgeA:0.7});
      ag_T(ctx,r[0],cx+28,y+58,{w:700,size:30});ag_T(ctx,r[1],cx+cw-420,y+58,{w:800,size:32,col:AG.orange,align:"right"});
      const sq=clamp((T.sqlA||0)*3-i,0,1);if(sq>0)od_chip(ctx,cx+cw-396,y+22,"SQL answer",{col:AG.blue,a:ag_in(sq,0,0.3),f:"mono",w:500});
      const g=clamp((T.good||0)-i,0,1);if(g>0){ctx.save();ctx.globalAlpha*=ag_in(g,0,0.25);const gk=ag_spr(g,0,0.4);ag_about(ctx,cx+cw-90,y+46,lerp(0.6,1,Math.min(1.1,gk)));
        ag_box(ctx,cx+cw-160,y+22,140,48,24,{edge:AG.green});ag_tick(ctx,cx+cw-130,y+46,20,rgba(AG.green,1),4);ag_T(ctx,"Good",cx+cw-106,y+56,{w:700,size:28,col:AG.green});ctx.restore();}
      else{ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(AG.mut,0.5);ctx.lineWidth=2;rr(ctx,cx+cw-160,y+22,140,48,24);ctx.stroke();ctx.setLineDash([]);}
      ctx.restore();});ctx.restore();}
  // an answer, with its code open
  const cd=T.code||0;if(cd>0){ctx.save();ctx.globalAlpha*=ag_in(cd,0,0.4);const y=cy+(1-ag_eo(clamp(cd,0,1)))*16;ag_box(ctx,cx,y,cw,340,18,{edge:AG.orange,edgeA:0.5});
    ag_model(ctx,cx+50,y+56,24,{t:o.t||0,core:1});ag_T(ctx,"2,880",cx+90,y+74,{w:800,size:48,col:AG.orange});ag_T(ctx,"Health's students on census day",cx+90+ag_tw(ctx,"2,880 ",{w:800,size:48}),y+74,{w:700,size:32});
    const op=clamp(cd*2-0.6,0,1);ag_T(ctx,"Show code",cx+40,y+150,{w:700,size:28,col:AG.blue});ag_arrowHead(ctx,cx+40+ag_tw(ctx,"Show code",{w:700,size:28})+20,y+140,lerp(0,Math.PI/2,ag_sine(op)),9,rgba(AG.blue,1));
    if(op>0){ctx.save();ctx.globalAlpha*=op;ctx.fillStyle="rgba(46,47,52,0.06)";rr(ctx,cx+28,y+174,cw-56,76,12);ctx.fill();
      ag_T(ctx,"select census_day_students('Faculty of Health')",cx+52,y+222,{w:500,size:30,f:"mono"});
      ag_T(ctx,"result",cx+52,y+300,{w:600,size:28,col:AG.mut});ag_T(ctx,"2,880",cx+52+ag_tw(ctx,"result ",{w:600,size:28}),y+300,{w:800,size:30,col:AG.orange});ctx.restore();}
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the tool servers
   The platform runs them, in one panel of its own ("Databricks"), a card for each: its name and what it does, a socket on the card's
   left where an agent plugs in. od_tool: o.touch (0 to 1) lit blue; o.plug (0 to 1) a plug in its socket, the open standard's; o.a;
   o.k (0 to 1) it slides in. No card says whether its server is in preview: that changes, and the film would have to change with it */
const OD_TOOLS=[["Databricks SQL","runs queries"],["Unity Catalog functions","a function as a tool"],["AI Search","searches documents"],["Genie One","ask it"],["Genie Agent","Census day"]];
const OD_TP={x:1200,y:206,w:656,h:640};
function od_toolBox(i,o){o=o||{};const h=o.h||94,p=o.pitch||110;return{x:o.x||1232,y:(o.y||286)+i*p,w:o.w||592,h};}
function od_toolPanel(ctx,a,o){o=o||{};od_page(ctx,OD_TP.x,OD_TP.y,OD_TP.w,OD_TP.h,"Databricks",{a});
  if(o.mcp>0)ag_pill(ctx,OD_TP.x+OD_TP.w-24-(ag_tw(ctx,"MCP · an open standard",{w:700,size:28})+56)/2,OD_TP.y+32,"MCP · an open standard",{size:28,col:AG.blue,a:ag_in(o.mcp,0,0.4)*(a==null?1:a)});}
// a plug in a card's socket: its head, two pins in the socket, and a short cable away to the left
function od_plug(ctx,x,y,a,col){if(a<=0)return;col=col||AG.blue;ctx.save();ctx.globalAlpha*=a;const e=ag_eo(clamp(a,0,1)),dx=(1-e)*-30;ctx.translate(dx,0);ctx.lineCap="round";
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x-30,y);ctx.bezierCurveTo(x-60,y,x-62,y+34,x-92,y+40);ctx.stroke();
  ctx.fillStyle=rgba(col,1);rr(ctx,x-34,y-13,26,26,6);ctx.fill();ctx.fillStyle="#B8B2A6";ctx.fillRect(x-8,y-8,10,4);ctx.fillRect(x-8,y+4,10,4);ctx.restore();}
function od_tool(ctx,b,name,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null){ctx.translate((1-ag_eo(clamp(o.k,0,1)))*80,0);ctx.globalAlpha*=ag_in(o.k,0,0.4);}
  const on=o.touch||0,cy=b.y+b.h/2;
  ag_box(ctx,b.x,b.y,b.w,b.h,18,{edge:AG.blue,edgeA:0.35+0.6*on,glow:on>0.05?AG.blue:null,glowA:on});
  ag_T(ctx,name,b.x+44,b.y+(sub?44:b.h/2+11),{w:700,size:30});if(sub)ag_T(ctx,sub,b.x+44,b.y+80,{w:500,size:28,col:AG.mut});
  // the socket, on the left edge, and a plug in it
  ctx.fillStyle="#2E2F34";rr(ctx,b.x-8,cy-12,16,24,5);ctx.fill();if(o.plug>0)od_plug(ctx,b.x-8,cy,o.plug);
  ctx.restore();}

// the census count, written once, as a function: its name, its comment (what an agent reads as the tool's description), and the
// marks of its review and approval. o.k springs it in; o.rev, o.app (0 to 1) the marks; o.glow (0 to 1) it's being called
const OD_FN={x:96,y:236,w:720};
function od_fnCard(ctx,o){o=o||{};const a=o.a==null?1:o.a,F=OD_FN;if(a<=0)return{x:F.x,y:F.y,w:F.w,h:0};
  const L=ag_wrap(ctx,"Students on census day in one faculty, each counted once, as their record stood that day",F.w-64,{w:500,size:28}),h=108+L.length*38+96;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,F.x+F.w/2,F.y+h/2,lerp(0.6,1,Math.min(1,ag_spr(o.k,0,0.5))));const gl=o.glow||0;
  ag_box(ctx,F.x,F.y,F.w,h,20,{edge:AG.blue,edgeA:0.7+0.25*gl,glow:gl>0.05?AG.blue:null,glowA:gl});
  ag_T(ctx,"census_day_students(faculty)",F.x+32,F.y+58,{w:500,size:34,f:"mono",col:AG.blue});ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(F.x+28,F.y+80,F.w-56,1.5);
  ag_lines(ctx,L,F.x+32,F.y+122,38,{w:500,size:28,col:AG.mut});
  const my=F.y+h-62;if(o.rev>0)od_chip(ctx,F.x+32,my,"reviewed · Jun",{col:AG.mut,a:ag_in(o.rev,0,0.35)});
  if(o.app>0)od_chip(ctx,F.x+32+ag_tw(ctx,"reviewed · Jun",{w:600,size:28})+60,my,"approved · Noor",{col:AG.green,icon:"tick",tcol:AG.green,a:ag_in(o.app,0,0.35)});
  ctx.restore();return{x:F.x,y:F.y,w:F.w,h};}

/* ---------------------------------------------------------------- the census check agent */
// the nightly job: a plain step, blue, and its check against the census report. o.fail (0 to 1) the pill turns amber
function od_job(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=540;
  ag_box(ctx,x,y,w,100,20,{edge:AG.blue,edgeA:0.75});ag_T(ctx,"Census-day count · every night",x+30,y+60,{w:700,size:30});
  const f=o.fail||0,px=x+w/2,py=y+156;if(f<1)ag_verdict(ctx,px,py,"Matches the census report","pass",(o.pa==null?1:o.pa)*(1-ag_in(f,0,0.3)));
  if(f>0){ctx.save();const k=ag_spr(f,0,0.45);ag_about(ctx,px,py,lerp(0.8,1,Math.min(1.1,k)));ag_verdict(ctx,px,py,"Check failed · census report","fail",ag_in(f,0,0.3));ctx.restore();}
  ctx.restore();}
// an outlined card, dashed: a question nobody has answered yet ("Why?", "Whose reads?")
function od_ask(ctx,x,y,text,a,o){o=o||{};if(a<=0)return;const size=o.size||32,w=ag_tw(ctx,text,{w:700,size})+56,h=size+40;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,Math.min(1.1,ag_spr(o.k,0,0.45))));ctx.fillStyle="rgba(243,241,237,0.92)";rr(ctx,x,y,w,h,16);ctx.fill();
  ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(o.col||AG.mut,0.85);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,16);ctx.stroke();ctx.setLineDash([]);ag_T(ctx,text,x+28,y+h/2+size*0.36,{w:700,size,col:o.col||AG.ink});ctx.restore();return w;}
// Agent Bricks: a bar over the agent, and the base it runs on, Agent Runtime
function od_bricks(ctx,x,y,w,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,62,16,{edge:AG.blue,edgeA:0.6});ctx.save();rr(ctx,x,y,w,62,16);ctx.clip();ctx.fillStyle=rgba(AG.blue,0.09);ctx.fillRect(x,y,w,62);ctx.restore();
  ag_T(ctx,"Databricks · Agent Bricks",x+w/2,y+41,{w:700,size:28,col:AG.blue,align:"center"});ctx.restore();}
function od_runtime(ctx,cx,y,w,a,o){o=o||{};if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(0,(1-ag_eo(clamp(o.u==null?1:o.u,0,1)))*30);ag_floorShadow(ctx,cx+AG.sdx*2,y+62,w*0.55,14,0.25);
  ag_soft(ctx,c=>ag_rect(c,cx-w/2,y,w,56,14),[214,210,202],[246,244,240],cx+w*0.2,y+8,w*0.6,"rgba(46,38,28,0.3)",12,0.6);
  ag_T(ctx,"Agent Runtime",cx,y+38,{w:700,size:28,align:"center",col:AG.ink});ctx.restore();}
// the trace: every step the agent takes, recorded, filling in as it takes them. o.n (0 to 4)
const OD_STEPS=["1 · SQL · count by faculty","2 · SQL · what changed","3 · AI Search · the census rule","4 · Note for Jun"];
function od_trace(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=600,h=300;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,20,{});
  ag_T(ctx,"Trace",x+30,y+52,{w:800,size:32});ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(x+26,y+72,w-52,1.5);
  OD_STEPS.forEach((s,i)=>{const k=clamp((o.n||0)-i,0,1);const yy=y+118+i*50;if(k<=0){ctx.fillStyle="rgba(86,92,100,0.12)";rr(ctx,x+30,yy-22,w-60,28,8);ctx.fill();return;}
    ctx.save();ctx.globalAlpha*=ag_in(k,0,0.35);ag_T(ctx,s,x+30,yy,{w:600,size:28,col:i===3?AG.violet:AG.ink});ctx.restore();});
  ctx.restore();}
// the evaluation: four past cases, and the three ways each answer is scored. o.rows (0 to 4), o.cols [3] (0 to 4 marks each)
const OD_CASES=[["Left out 37 who withdrew after census day","they still count: 18,412"],["Engineering and IT: 134 against 131","three counted twice"],
  ["Health: 2,160","load read as people"],["Health: 2,911","Health data counted in Health"]],OD_COLS=["judges","sums","Mei · Jun"];
const OD_EVAL={x:120,y:236,w:1680};
function od_eval(ctx,o){o=o||{};const a=o.a==null?1:o.a,E=OD_EVAL;if(a<=0)return;const h=150+4*100;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,E.x,E.y,E.w,h,22,{});
  ag_T(ctx,"Evaluation",E.x+36,E.y+60,{w:800,size:36});const cx=[E.x+E.w-470,E.x+E.w-300,E.x+E.w-110];
  OD_COLS.forEach((s,i)=>ag_T(ctx,s,cx[i],E.y+60,{w:700,size:28,col:AG.mut,align:"center",a:o.colA?o.colA[i]:1}));
  ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(E.x+30,E.y+90,E.w-60,1.5);
  OD_CASES.forEach((r,i)=>{const k=clamp((o.rows||0)-i,0,1),y=E.y+140+i*100;
    // o.ghost: the rows still to come, as faint outlines, so the card isn't empty while the cases are named
    const g=(o.ghost||0)*(1-ag_in(k,0,0.4));if(g>0){ctx.save();ctx.globalAlpha*=g;ctx.fillStyle="rgba(86,92,100,0.13)";rr(ctx,E.x+40,y-24,380,26,13);ctx.fill();rr(ctx,E.x+40,y+20,250,22,11);ctx.fill();
      cx.forEach(x=>{ctx.beginPath();ctx.arc(x,y+6,20,0,TAU);ctx.fill();});ctx.restore();}
    if(k<=0)return;ctx.save();ctx.globalAlpha*=ag_in(k,0,0.4);ctx.translate((1-ag_eo(k))*24,0);
    ag_T(ctx,r[0],E.x+40,y,{w:700,size:30});ag_T(ctx,r[1],E.x+40,y+40,{w:500,size:28,col:AG.mut});
    OD_COLS.forEach((c,j)=>{const m=clamp((o.cols?o.cols[j]:0)-i,0,1);const bad=j===2&&i===(o.amber==null?-1:o.amber);
      if(m<=0){ctx.fillStyle="rgba(86,92,100,0.12)";ctx.beginPath();ctx.arc(cx[j],y+6,20,0,TAU);ctx.fill();return;}
      ctx.save();ctx.globalAlpha*=ag_in(m,0,0.25);const s=lerp(0.6,1,Math.min(1.1,ag_spr(m,0,0.35)));ag_about(ctx,cx[j],y+6,s);
      ctx.fillStyle=bad?rgba(AG.amber,0.12):rgba(AG.green,0.12);ctx.beginPath();ctx.arc(cx[j],y+6,26,0,TAU);ctx.fill();
      if(bad)ag_warn(ctx,cx[j],y+6,30,rgba(AG.amber,1));else ag_tick(ctx,cx[j],y+6,26,rgba(AG.green,1),5);ctx.restore();});
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- agents that write code */
// Sam's pipeline editor, with Genie Code beside it: three lines of the nightly load (the example project's, reflowed), and the
// panel: Genie Code, with Sam's rights, the team's skills, and the evidence behind a claim. T: {code, panel, rights, skills,
// using, claim, chip, res}
const OD_PIPE={x:520,y:236,w:1320,h:610};
const OD_SQL=["create or refresh streaming table","  student_system.learners (","  constraint has_an_id","    expect (student_id is not null)","    on violation drop row",")"];
const OD_SKILLS=["profile-a-source","draft-a-model","reconcile-and-diff"];
function od_pipeline(ctx,T,o){o=o||{};const P=OD_PIPE,a=o.a==null?1:o.a;if(a<=0)return;od_page(ctx,P.x,P.y,P.w,P.h,"Databricks · Lakeflow Pipelines Editor",{a});ctx.save();ctx.globalAlpha*=a;
  const cd=T.code==null?1:T.code;OD_SQL.forEach((l,i)=>{const k=clamp(cd*6-i,0,1);if(k>0)ag_T(ctx,l,P.x+36,P.y+120+i*44,{w:500,size:28,f:"mono",a:k,col:i===2||i===3||i===4?AG.blue:AG.ink});});
  const px=P.x+700,pw=P.w-728,pn=T.panel||0;if(pn>0){ctx.save();ctx.globalAlpha*=ag_in(pn,0,0.4);ctx.translate((1-ag_eo(clamp(pn,0,1)))*60,0);
    ctx.fillStyle="rgba(88,78,196,0.05)";rr(ctx,px,P.y+84,pw,P.h-104,18);ctx.fill();ctx.strokeStyle=rgba(AG.violet,0.35);ctx.lineWidth=1.8;rr(ctx,px,P.y+84,pw,P.h-104,18);ctx.stroke();
    ag_model(ctx,px+46,P.y+130,24,{t:o.t||0,core:1,think:T.think||0});ag_T(ctx,"Genie Code",px+76,P.y+141,{w:800,size:30});
    if(T.rights>0)od_chip(ctx,px+28,P.y+170,"with Sam's rights",{icon:"lock",col:AG.blue,a:ag_in(T.rights,0,0.35)});
    const sk=T.skills||0,us=T.using||0;
    if(sk>0&&us<0.45){ctx.save();ctx.globalAlpha*=ag_in(sk,0,0.4)*(1-clamp(us/0.45,0,1));ag_T(ctx,"Skills · the team's",px+28,P.y+284,{w:700,size:28,col:AG.violet});
      OD_SKILLS.forEach((s,i)=>{const k=clamp(sk*3-i,0,1);if(k>0)ag_T(ctx,s,px+28,P.y+336+i*46,{w:500,size:28,f:"mono",a:k});});ctx.restore();}
    if(us>0.5){ctx.save();ctx.globalAlpha*=ag_in(us,0.5,0.4);ag_T(ctx,"Using profile-a-source",px+28,P.y+284,{w:700,size:28,col:AG.violet});
      const cl=T.claim||0;if(cl>0){const L=ag_wrap(ctx,"4 of 42 current learning platform accounts have no student ID.",pw-80,{w:600,size:28});ctx.save();ctx.globalAlpha*=ag_in(cl,0,0.4);
        ag_box(ctx,px+20,P.y+306,pw-40,40+L.length*38,16,{edge:AG.orange,edgeA:0.6});ag_lines(ctx,L,px+44,P.y+352,38,{w:600,size:28});ctx.restore();}
      const yy=P.y+306+40+2*38+18;if(T.chip>0){ag_clip(ctx,px+40,yy+4,40,"#5E5A55");od_chip(ctx,px+72,yy,"profile_null_keys",{col:AG.orange,f:"mono",w:500,a:ag_in(T.chip,0,0.35)});}
      if(T.res>0){ctx.save();ctx.globalAlpha*=ag_in(T.res,0,0.4);ag_T(ctx,"learning_platform.users",px+40,yy+100,{w:500,size:28,f:"mono"});ag_T(ctx,"student_id · 42 · 4",px+40,yy+140,{w:500,size:28,f:"mono",col:AG.orange});ctx.restore();}
      ctx.restore();}
    ctx.restore();}
  ctx.restore();}
// a screen's own content, as the wide shot of chapter 6 sees it: Genie Code's panel with the team's skills (Sam's), or Jun's editor
// with the project's folders; each a few lines at 28 px
function od_skillsScreen(ctx,x,y,w,h,o){o=o||{};ctx.fillStyle="#F5F4F1";ctx.fillRect(x,y,w,h);ctx.fillStyle="rgba(88,78,196,0.08)";ctx.fillRect(x,y,w,52);
  ag_model(ctx,x+30,y+26,16,{t:o.t||0,core:1});ag_T(ctx,"Genie Code",x+56,y+36,{w:700,size:28});
  ag_T(ctx,"Skills · the team's",x+22,y+94,{w:700,size:28,col:AG.violet});OD_SKILLS.forEach((s,i)=>ag_T(ctx,s,x+22,y+138+i*36,{w:500,size:28,f:"mono"}));}
const OD_TREE=["AGENTS.md","skills/","models/","examples/"];
function od_editorScreen(ctx,x,y,w,h,o){o=o||{};ctx.fillStyle="#F5F4F1";ctx.fillRect(x,y,w,h);ctx.fillStyle="rgba(86,92,100,0.1)";ctx.fillRect(x,y,w,52);
  ag_T(ctx,"dbt project",x+22,y+36,{w:700,size:28});OD_TREE.forEach((s,i)=>{const k=o.tree==null?1:clamp(o.tree*4-i,0,1);if(k>0)ag_T(ctx,s,x+22,y+94+i*40,{w:500,size:28,f:"mono",a:k,col:s==="skills/"?AG.violet:AG.ink});});}
// a folder card on the wall: an icon and its name in mono; o.col its edge
function od_folderCard(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return 0;const f={w:o.mono===false?700:500,size:30,f:o.mono===false?null:"mono"},w=ag_tw(ctx,name,f)+108,h=78;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,Math.min(1.1,ag_spr(o.k,0,0.45))));ag_box(ctx,x,y,w,h,16,{edge:o.col||AG.violet,edgeA:0.6});
  const ix=x+26,iy=y+24;ctx.fillStyle=rgba(o.col||AG.violet,0.75);ctx.beginPath();ctx.moveTo(ix,iy);ctx.lineTo(ix+16,iy);ctx.lineTo(ix+22,iy+6);ctx.lineTo(ix+42,iy+6);ctx.lineTo(ix+42,iy+32);ctx.lineTo(ix,iy+32);ctx.closePath();ctx.fill();
  ag_T(ctx,name,x+84,y+h/2+10,Object.assign({},f,{col:AG.ink}));ctx.restore();return w;}
// a thread, violet (the model reading) or blue (a tool): a soft curve from p0 to p1, drawn on to u
function od_thread(ctx,p0,p1,u,col,o){o=o||{};if(u<=0.01)return;const dx=p1[0]-p0[0],dy=p1[1]-p0[1],p=[p0[0],p0[1],p0[0]+dx*0.15,p0[1]+dy*0.6+(o.bend||0),p1[0]-dx*0.15,p1[1]-dy*0.6+(o.bend||0),p1[0],p1[1]];
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.lineCap="round";ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=o.lw||4;if(o.dash)ctx.setLineDash(o.dash);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.setLineDash([]);
  const e=ag_bz(p,u);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(e[0],e[1],(o.lw||4)*1.4,0,TAU);ctx.fill();ctx.restore();return p;}
// a draft on a branch: who wrote it, and its marks. o.rev [text, a], o.app (0 to 1). 500 x 220
function od_draft(ctx,x,y,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=500,h=220;ctx.save();ctx.globalAlpha*=a;if(o.s!=null)ag_about(ctx,x+w/2,y+h/2,o.s);
  ag_box(ctx,x,y,w,h,20,{edge:o.app>0.5?AG.green:AG.blue,edgeA:o.app>0.5?0.8:0.45});ag_pen(ctx,x+40,y+46,30,rgba(AG.blue,1));ag_T(ctx,"draft",x+70,y+56,{w:800,size:32});
  ag_T(ctx,"by "+who,x+70+ag_tw(ctx,"draft ",{w:800,size:32}),y+56,{w:600,size:30,col:AG.mut});
  ctx.fillStyle="rgba(86,92,100,0.16)";rr(ctx,x+30,y+76,w*0.62,9,4.5);ctx.fill();
  if(o.rev&&o.rev[1]>0)od_chip(ctx,x+30,y+102,o.rev[0],{col:AG.mut,a:ag_in(o.rev[1],0,0.35)});
  if(o.app>0)od_chip(ctx,x+30,y+158,"approved · Noor",{col:AG.green,icon:"tick",tcol:AG.green,a:ag_in(o.app,0,0.35)});
  ctx.restore();}

/* ===== Working with agents on Databricks: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The office is painted once
   (faculty.js) and the lab is the module's; what moves is drawn live in the shots of ag_shots. In one room the camera never jumps:
   ag_shots glides it from one framing to the next and fades only what changes (the lab by night is the lab). A later moment in the
   room, or the same person framed another way (Sam close, then at his desk), is later: true: what was there leaves, the bare room
   shows for an instant, in a pause of the voice, and what comes next comes in. Only framings far apart (a desk's close shot and the
   whole office) change on a cut (cut: true), never a dissolve, so nothing shows twice. A close shot's cards, the kicker and the four
   ways along the top are drawn in the frame (od_scr), so their words keep their size whatever the camera does; in a close shot of
   the office the cards stand where the next desk would be, and only that desk's person and things are drawn. */

// the bare lab, by day and by night, as a later moment passes through it: the light every shot of it draws
AG_BARE.lab=c=>ag_roomLight(c,1);AG_BARE.labNight=c=>ag_roomLight(c,1,{night:true});AG_BARE.odOffice=c=>ag_roomLight(c,1);

// a phase: 0 before tIn, rising to 1 over din; from tOut, from 1 to 2 over dout (for what is shown, then put away)
const od_ph=(t,tIn,tOut,din,dout)=>t<tOut?clamp((t-tIn)/(din||0.6),0,1):1+clamp((t-tOut)/(dout||0.5),0,1);
// lit from t0, put out at t1
const od_lit=(t,t0,t1)=>ag_in(t,t0,0.3)*(1-ag_in(t,t1,0.4));
// draw in the frame, whatever the camera is doing
function od_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// the kicker and the four ways, in the frame; lit: the chapter's card (0 to 3), or o.on for each
function od_chrome(ctx,S,t,lit,o){o=o||{};od_scr(ctx,S,()=>{const dk=o.dark===true?1:clamp(o.dark||0,0,1),a=o.a==null?1:o.a;  // dark 0 to 1: the night's kicker, blended into the day's as the room lights
    if(dk>0)ag_kicker(ctx,"2.7","Working with agents on Databricks",{dark:true,a:a*dk});if(dk<1)ag_kicker(ctx,"2.7","Working with agents on Databricks",{dark:false,a:a*(1-dk)});
  const on=o.on||[0,1,2,3].map(i=>i===lit?ag_in(t,0.3,0.8):0);od_strip(ctx,{on,k:o.k,a});});}
// the card of next year's places: what Anil plans from the census-day count. o.n (0 to 3) its lines come in. 500 wide, in the frame
function od_places(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=500,h=262;ctx.save();ctx.globalAlpha*=a;od_spring(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,20,{});ag_T(ctx,"Next year's places",x+32,y+54,{w:700,size:32});
  ["classes","labs","hospital placements"].forEach((s,i)=>{const k=clamp((o.n||0)-i,0,1);if(k<=0)return;const yy=y+122+i*50;ctx.save();ctx.globalAlpha*=ag_in(k,0,0.4);
    ctx.fillStyle=rgba(AG_OAK.dark,0.9);ctx.beginPath();ctx.arc(x+42,yy-9,6,0,TAU);ctx.fill();ag_T(ctx,s,x+64,yy,{w:600,size:28});ctx.restore();});ctx.restore();}
// a tag that points down at what it names, with a short leader
function od_pointTag(ctx,x,y,text,px,py,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.mut,0.7);ctx.lineWidth=2;ctx.setLineDash([5,6]);ctx.beginPath();ctx.moveTo(x,y+28);ctx.lineTo(px,py);ctx.stroke();ctx.setLineDash([]);
  const w=ag_tw(ctx,text,{w:500,size:28,f:"mono"})+44;ctx.fillStyle="rgba(243,241,237,0.96)";rr(ctx,x-w/2,y-28,w,56,12);ctx.fill();ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x-w/2,y-28,w,56,12);ctx.stroke();
  ag_T(ctx,text,x,y+10,{w:500,size:28,f:"mono",align:"center"});ctx.restore();}
// a statement on its own, in the frame over a veil: two lines, centred, each in its colour
function od_statement(ctx,S,a,l1,l2,o){o=o||{};if(a<=0)return;ag_veil(ctx,S,0.7*a);setScreen(ctx,S);const f={w:700,size:40},w=Math.max(ag_tw(ctx,l1,f),ag_tw(ctx,l2,f))+120,h=196,x=960-w/2,y=o.y||350;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,960,y+h/2,lerp(0.85,1,Math.min(1,ag_spr(o.k,0,0.5))));ag_box(ctx,x,y,w,h,24,{});
  ag_T(ctx,l1,960,y+80,Object.assign({align:"center",col:o.c1||AG.ink},f));ag_T(ctx,l2,960,y+142,Object.assign({align:"center",col:o.c2||AG.ink,a:o.a2==null?1:o.a2},f));ctx.restore();}

/* ---------------------------------------------------------------- the lab of the opening: Sam and Jun, the shelf, the three agents */
const OD_LAB={sph:[[300,700],[640,700],[980,700]],r:44};
// o.in (0 to 1) the agents come in from the left; o.plug (0 to 1) their cables leave their copies for the shelf's tools, turning blue;
// o.lock (0 to 1); o.names [Sam's card, Jun's card]; o.cards false for none
function od_labOpening(c,S,tt,o){o=o||{};const sk=od_shelf(c,{glow:clamp(o.plug||0,0,1)*0.8});
  ag_person(c,"sam",1430,620,0.94,{t:tt,flip:true,gaze:[4,0]});ag_person(c,"jun",1700,620,0.94,{t:tt+0.8,flip:true,gaze:[4,0]});
  const inn=o.in==null?1:o.in,pl=o.plug||0;
  OD_LAB.sph.forEach(([x,y],i)=>{const k=clamp(inn*1.4-i*0.2,0,1),e=ag_spr(k,0,0.55),px=lerp(-140,x,Math.min(1,e)),r=OD_LAB.r;if(k<=0)return;
    const u=clamp(pl*1.3-i*0.15,0,1),eu=ag_sine(u),from=[px+r*0.5,y-r*0.7],off=[px-300-i*40,y+64+i*10],to=sk[i];
    const end=[lerp(off[0],to[0],eu),lerp(off[1],to[1],eu)],col=mix([128,126,122],AG.blue,eu);
    od_cable(c,from,end,1,{col,sag:lerp(30,-40,eu),lw:5});
    ag_floorShadow(c,px+AG.sdx,y+r*0.98,r*1.2,r*0.24,0.3);ag_model(c,px,y,r,{t:tt+i*0.9,core:lerp(0.5,1,eu),think:0.3*eu});
    if(o.lock>0){const lx=px+r*0.85,ly=y-r*0.8,s=30;c.save();c.globalAlpha*=clamp(o.lock*1.4-i*0.2,0,1);c.fillStyle="rgba(243,241,237,0.96)";c.beginPath();c.arc(lx,ly,s*0.62,0,TAU);c.fill();
      c.strokeStyle=rgba(AG.blue,0.5);c.lineWidth=1.5;c.stroke();ag_lock(c,lx,ly+2,s*0.82,rgba(AG.blue,1));c.restore();}});
  ag_roomLight(c,1);
  if(o.cards!==false){const n=o.names||[1,1];if(n[0]>0)ag_textCard(c,1170,120,340,{title:"Sam Okafor",sub:"Data platform"},{a:ag_in(n[0],0,0.4),k:Math.min(1,ag_spr(n[0],0,0.5))});
    if(n[1]>0)ag_textCard(c,1530,120,340,{title:"Jun Park",sub:"Analytics engineer"},{a:ag_in(n[1],0,0.4),k:Math.min(1,ag_spr(n[1],0,0.5))});}
  if(o.lock>0)ag_pill(c,640,800,"each reads only what its person may read",{icon:"lock",col:AG.blue,a:ag_in(o.lock,0.3,0.5)});}

/* ---------------------------------------------------------------- 1 · Three answers */
scene("three",(ctx,S,t,sc)=>{
  const T={tMon:wAt(sc,"monday","Monday"),tAnil:wAt(sc,"anil","Anil"),tPlaces:wAt(sc,"anil","next year's"),tClasses:wAt(sc,"anil","classes"),tLabs:wAt(sc,"anil","labs"),tHosp:wAt(sc,"anil","hospitals"),
    tCensus:wAt(sc,"census","census day"),tCounts:wAt(sc,"census","counts who"),
    tAsks:wAt(sc,"asks","He asks"),tHis:wAt(sc,"asks","his agent"),tTwo:wAt(sc,"asks","two colleagues"),tTheirs:wAt(sc,"asks","theirs"),tOwn:wAt(sc,"asks","Each set up"),tCopy:wAt(sc,"asks","own copy"),
    tLoad:wAt(sc,"load","Anil's reads"),tSheet:wAt(sc,"load","spreadsheet"),tBid:wAt(sc,"load","funding bid"),
    tHalf:wAt(sc,"fte","two half-time"),tOne:wAt(sc,"fte","as one"),tPeople:wAt(sc,"fte","takes it for people"),tN1:wAt(sc,"fte","two thousand"),
    tTable:wAt(sc,"table","The second"),tName:wAt(sc,"table","with Health"),
    tJoint:wAt(sc,"joint","Health data"),tN2:wAt(sc,"joint","two thousand"),
    tFolder:wAt(sc,"folder","The third"),tReports:wAt(sc,"folder","folder of reports"),tN3:wAt(sc,"folder","two thousand"),
    tWhich:wAt(sc,"which","One is right"),tNobody:wAt(sc,"which","nobody can tell"),
    tShort:wAt(sc,"short","Plan for"),tLowest:wAt(sc,"short","lowest"),tGap:wAt(sc,"short","seven hundred"),
    tNames:wAt(sc,"names","And a copy"),tEvery:wAt(sc,"names","every name"),
    tChange:wAt(sc,"change","Something"),
    tBring:wAt(sc,"bring","So Sam"),tJun:wAt(sc,"bring","Jun"),tAgents:wAt(sc,"bring","bring the agents"),
    tSame:wAt(sc,"same","the same governed"),tOnly:wAt(sc,"same","only what"),
    tWeek:wAt(sc,"week","A week later"),tAll:wAt(sc,"week","all three"),tN4:wAt(sc,"week","two thousand"),tQuery:wAt(sc,"week","its query"),tDef:wAt(sc,"week","its definition"),
    tChecks:wAt(sc,"minute","Anil checks"),tPlan:wAt(sc,"minute","plans a place"),tDel:wAt(sc,"minute","The copies"),
    tData:wAt(sc,"data","When every"),tAgree:wAt(sc,"data","the answers agree")};
  const lit3=tt=>[ag_in(tt,T.tHis,0.5),ag_in(tt,T.tTwo+0.3,0.5),ag_in(tt,T.tTheirs,0.5)],cab=tt=>[0,1,2].map(i=>ag_sine((tt-(T.tOwn+0.2+i*0.3))/1.1));
  const A=OD.answer,nums=["2,160","2,911","2,880"],fromW=i=>[OD.answer[i],OD.ansY+OD_ANS_H/2+90];  // in the wide shot, an answer rises from just over its person's head, never across a face
  const wideAns=(c,tt,o)=>A.forEach((x,i)=>od_answer(c,x,OD.ansY,o.num?o.num[i]:nums[i],{none:o.none||0,ev:o.ev?o.ev[i]:0,tick:o.tick?o.tick[i]:0,u:o.u?o.u[i]:1,from:fromW(i)}));
  // in a close shot, an answer rises from where its agent is in the frame
  const fromZ=(cam,i)=>od_see(cam,[OD.agent[i][0],OD.agent[i][1]-20]);
  ag_shots(ctx,S,t,sc.dur,[
    // Monday: Anil at his desk, close; the places he plans; census day. Then the camera draws back to the three desks, and the question
    {at:0,place:"odOffice",keys:[[0,OD_Z1[1],OD_Z1[2],OD_Z1[3]],[T.tAsks-0.1,960,540,1]],d:2.2,draw:(c,tt)=>{
      od_room(c,tt,{lit:lit3(tt),cable:cab(tt),gaze:[[5,-1],[4,1],[4,1]]});
      od_pointTag(c,400,340,"their own agent",400,704,ag_in(tt,T.tOwn+0.8,0.4)*(1-ag_in(tt,T.tLoad-0.6,0.4)));
      od_pointTag(c,1150,340,"their own copy",1150,640,ag_in(tt,T.tCopy,0.4)*(1-ag_in(tt,T.tLoad-0.6,0.4)));
      const back=ag_in(tt,T.tAsks-0.3,0.5);
      od_scr(c,S,()=>{od_tag(c,"Faculty of Health · Monday",ag_in(tt,0.4,0.6));
        if(back<1){c.save();c.globalAlpha*=1-back;od_cardAt(c,470,290,360,{title:"Anil Kurian",sub:"Faculty of Health"},tt,T.tAnil-0.1,null);
          od_places(c,1340,96,{k:(tt-T.tPlaces)/0.5,a:ag_in(tt,T.tPlaces-0.1,0.4),n:clamp((tt-T.tClasses+0.1)/0.45,0,1)+clamp((tt-T.tLabs+0.1)/0.45,0,1)+clamp((tt-T.tHosp+0.1)/0.45,0,1)});
          od_pillAt(c,1590,420,"census day · 31 March 2026",tt,T.tCensus-0.1,null,{size:28});c.restore();}
        const qa=ag_in(tt,T.tAsks-0.2,0.5);if(qa>0)ag_textCard(c,610,36,700,{title:"Health's students on census day?"},{a:qa,k:Math.min(1,ag_spr(tt,T.tAsks-0.2,0.5))});});}},
    // Anil's spreadsheet: student load, for the funding bid; two half-time students as one; 2,160
    {at:T.tLoad-0.15,cut:true,place:"odOffice",keys:[OD_Z1],draw:(c,tt)=>{od_room(c,tt,{only:0,lit:[1,1,1],cable:[1,1,1],sheet:ag_in(tt,T.tBid,0.5),gaze:[[6,-1]]});
      od_scr(c,S,()=>{const k=(tt-T.tSheet+0.3)/0.6;od_sheet(c,1060,72,{k,a:ag_in(k,0,0.3),rows:clamp((tt-T.tSheet)/1.2,0,1),pick:ag_in(tt,T.tBid+0.4,0.5),half:(tt-T.tHalf-0.4)/(T.tOne-T.tHalf+0.2)});
        od_answer(c,1440,566,"2,160",{u:clamp((tt-T.tPeople)/0.7,0,1),from:fromZ(OD_Z1,0),numA:ag_in(tt,T.tN1-0.15,0.3)});});}},
    // the second desk: a copy of the student table, its degrees with Health in their names, and the joint degree in no faculty
    {at:T.tTable-0.15,cut:true,place:"odOffice",keys:[OD_Z2],draw:(c,tt)=>{od_room(c,tt,{only:1,lit:[1,1,1],cable:[1,1,1],gaze:[null,[6,0]]});
      od_scr(c,S,()=>{const k=(tt-T.tTable-0.4)/0.6;od_tableCard(c,1040,72,{k,a:ag_in(k,0,0.3),rows:clamp((tt-T.tTable-0.6)/1.0,0,1),hl:clamp((tt-T.tName)/0.45,0,3),joint:ag_in(tt,T.tJoint,0.6)});
        od_answer(c,1450,432,"2,911",{u:clamp((tt-T.tN2+0.9)/0.7,0,1),from:fromZ(OD_Z2,1),numA:ag_in(tt,T.tN2-0.15,0.3)});});}},
    // the third desk: a folder of reports, and 2,880; the second desk leaves before it comes in, so no agent shows in two places
    {at:T.tFolder-0.15,later:true,dis:0.45,place:"odOffice",keys:[OD_Z3],draw:(c,tt)=>{od_room(c,tt,{only:2,lit:[1,1,1],cable:[1,1,1],gaze:[null,null,[5,0]]});
      od_scr(c,S,()=>{const k=(tt-T.tReports+0.3)/0.6;od_reports(c,64,72,clamp((tt-T.tReports)/1.4,0,1),{k,a:ag_in(k,0,0.3)});
        od_answer(c,1630,80,"2,880",{u:clamp((tt-T.tN3+0.9)/0.7,0,1),from:fromZ(OD_Z3,2),numA:ag_in(tt,T.tN3-0.15,0.3)});});}},
    // three answers, and nothing to tell them apart
    {at:T.tWhich-0.15,cut:true,place:"odOffice",keys:[OD_WIDE],draw:(c,tt)=>{od_room(c,tt,{lit:[1,1,1],cable:[1,1,1],gaze:[[4,-3],[4,-3],[4,-3]]});
      wideAns(c,tt,{none:ag_in(tt,T.tNobody+0.3,0.6)});}},
    // planned for the lowest: 720 students with no place
    {at:T.tShort-0.15,cut:true,place:"odOffice",keys:[OD_Z1],draw:(c,tt)=>{od_room(c,tt,{only:0,lit:[1,1,1],cable:[1,1,1],gaze:[[6,-1]]});
      od_scr(c,S,()=>{const k=(tt-T.tShort)/0.6;od_plan(c,1060,72,{k,a:ag_in(k,0,0.3),lo:ag_in(tt,T.tGap-0.1,0.5)});
        od_answer(c,1440,452,"2,160",{none:1,a:ag_in(tt,T.tLowest-0.2,0.4)});});}},
    // and every student's name, on a laptop; something had to change
    {at:T.tNames-0.15,cut:true,place:"odOffice",keys:[OD_Z2],draw:(c,tt)=>{od_room(c,tt,{only:1,lit:[1,1,1],cable:[1,1,1],gaze:[null,[6,0]]});
      od_scr(c,S,()=>{od_tableCard(c,1040,72,{names:ag_in(tt,T.tNames+0.2,0.6)});od_pillAt(c,1450,452,"every student's name, on a laptop",tt,T.tEvery,null,{col:AG.amber,icon:"warn",size:28});
        ag_veil(c,S,0.62*ag_in(tt,T.tChange-0.1,1.0));});}},
    // Sam and Jun bring the agents to the data: the platform's shelf, and the three agents' cables plugged into its tools
    {at:T.tBring-0.3,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>od_labOpening(c,S,tt,{in:clamp((tt-T.tAgents+0.2)/1.4,0,1),plug:clamp((tt-T.tSame)/1.6,0,1),lock:clamp((tt-T.tOnly)/0.8,0,1),
      names:[(tt-T.tBring-0.3)/0.5,(tt-T.tJun+0.1)/0.5]})},
    // a week later: three answers, the same, each with its evidence; each agent wired to the platform, its copy unplugged (a cut: the lab shows the same agents)
    {at:T.tWeek-0.3,cut:true,place:"odOffice",keys:[OD_WIDE],draw:(c,tt)=>{od_room(c,tt,{lit:[1,1,1],blue:1,gaze:[[4,-3],[4,-3],[4,-3]]});
      wideAns(c,tt,{num:["2,880","2,880","2,880"],u:[0,1,2].map(i=>clamp((tt-T.tAll-i*0.25)/0.7,0,1)),ev:[0,1,2].map(i=>clamp((tt-T.tQuery+0.2-i*0.12)/(T.tDef-T.tQuery+0.6),0,1))});
      od_scr(c,S,()=>od_tag(c,"A week later",ag_in(tt,T.tWeek,0.5)));}},
    // Anil checks it in a minute, and plans a place for every student
    {at:T.tChecks-0.15,cut:true,place:"odOffice",keys:[OD_Z1],draw:(c,tt)=>{od_room(c,tt,{only:0,lit:[1,1,1],blue:1,smile:[ag_in(tt,T.tChecks+0.6,0.8)],gaze:[[6,-2]]});
      od_scr(c,S,()=>{const k=(tt-T.tPlan+0.3)/0.6;od_plan(c,1060,72,{k,a:ag_in(k,0,0.3),ok:ag_in(tt,T.tPlan+0.3,0.6)});
        od_answer(c,1440,452,"2,880",{ev:1,tick:ag_in(tt,T.tChecks+0.8,0.4)});});}},
    // the copies are deleted
    {at:T.tDel-0.15,cut:true,place:"odOffice",keys:[OD_WIDE],draw:(c,tt)=>{const g=ag_in(tt,T.tDel+0.3,1.0);od_room(c,tt,{lit:[1,1,1],blue:1,gone:g,smile:[0.8,0.3,0.3]});
      wideAns(c,tt,{num:["2,880","2,880","2,880"],ev:[1,1,1]});
      [[540,556],[1150,600],[1745,600]].forEach(([x,y],i)=>od_note(c,x,y,"deleted",ag_in(tt,T.tDel+0.5+i*0.2,0.4)));}},
    // every agent reads the same data through the same tools: the shelf, and a blue thread from each agent (a cut: the office shows the same agents)
    {at:T.tData-0.3,cut:true,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{const f=1-ag_in(tt,sc.cues.breath,0.6);if(f<=0)return;c.save();c.globalAlpha*=f;  // gone before the card's words come in (0.5 s after its veil)
      od_labOpening(c,S,tt,{in:1,plug:1,lock:0,cards:false});c.restore();}}
  ],0.6);
  ag_title(ctx,S,t,sc.cues.breath,"Working with agents on Databricks","the same data and tools people use, in one place","FILM 7 OF 9 · AGENTS AT WORK ON DATA");
});

/* ---------------------------------------------------------------- 2 · One place */
scene("place",(ctx,S,t,sc)=>{
  const T={tUC:wAt(sc,"holds","Unity Catalog"),tTables:wAt(sc,"holds","its tables"),tDefs:wAt(sc,"holds","its definitions"),tWho:wAt(sc,"holds","who may read"),
    tPeople:wAt(sc,"people","People"),tEd:wAt(sc,"people","editors"),tNb:wAt(sc,"people","notebooks"),tDash:wAt(sc,"people","dashboards"),
    tFour:wAt(sc,"four","four ways"),tA1:wAt(sc,"answer","Agents that answer"),tA2:wAt(sc,"servers","Tool servers"),tA3:wAt(sc,"builds","Agents the team"),tA4:wAt(sc,"writes","write code"),
    tEach:wAt(sc,"each","Each reads"),tTools:wAt(sc,"each","same tools")};
  const named=[T.tA1,T.tA2,T.tA3,T.tA4,T.tEach];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      // the shelf of the opening grows into the platform
      const u=ag_in(tt,0.2,1.6);if(u<1)od_shelf(c,{a:1-ag_in(tt,0.2,0.6)});  // the shelf's name is gone before the card's comes in: one name at a time
      // the people already at work: three desks, three screens, each with its own kind of work
      const pa=ag_in(tt,T.tPeople-0.2,0.6);if(pa>0){c.save();c.globalAlpha*=pa;ag_desk(c,280,880,1360,{depth:64});
        [["yusuf",400,T.tEd,"editors"],["noor",840,T.tNb,"notebooks"],["clara",1280,T.tDash,"dashboards"]].forEach(([who,x,tl,lab],i)=>{
          ag_person(c,who,x,720,0.5,{t:tt+i,cut:816,gaze:[5,0]});ag_screen(c,x+60,694,220,96,{stand:16,draw:(sx,gx,gy,gw,gh)=>{
            const la=ag_in(tt,tl-0.1,0.4);if(la>0)ag_T(sx,lab,gx+gw/2,gy+gh/2+10,{w:700,size:28,align:"center",a:la});}});});
        c.restore();}
      ag_roomLight(c,1);
      od_dbCard(c,{from:{x:OD_SHELF.x,y:OD_SHELF.y,w:OD_SHELF.w,h:176},u,a:ag_in(tt,0.1,0.6),title:ag_in(tt,0.85,0.4),uc:ag_in(tt,T.tUC-0.2,0.6),parts:[ag_in(tt,T.tTables,0.4),ag_in(tt,T.tDefs,0.4),ag_in(tt,T.tWho,0.4)]});
      // the people's threads into Unity Catalog, and the agents', beside them
      if(pa>0)[400,840,1280].forEach((x,i)=>od_thread(c,[x+170,684],[x+170-(i-1)*60,OD_UC.y+OD_UC.h],ag_in(tt,T.tPeople+0.8+i*0.25,0.8),AG.blue,{lw:3.5,a:0.8}));
      const b=od_wayBoxes(c);b.forEach((r,i)=>od_thread(c,[r.x+r.w-40,r.y+r.h],[OD_UC.x+180+i*280,OD_UC.y],ag_in(tt,T.tTools-0.2+i*0.2,0.9),AG.blue,{lw:3.5,a:0.8}));}}
  ],0.6);
  // the four ways spring in along the top, and light as they're named
  const k=[0,1,2,3].map(i=>(t-(T.tFour+0.1+i*0.18))/0.5),on=[0,1,2,3].map(i=>ag_in(t,named[i]-0.15,0.35)*(1-0.65*ag_in(t,named[i+1]-0.15,0.5)));
  od_chrome(ctx,S,t,-1,{on,k});
});

/* ---------------------------------------------------------------- 3 · Agents that answer */
scene("ask",(ctx,S,t,sc)=>{
  const T={tG1:wAt(sc,"genie","Genie One"),tAsst:wAt(sc,"genie","assistant"),tQ:wAt(sc,"genie","business questions"),tWords:wAt(sc,"genie","where its words"),
    tCare:wAt(sc,"care","For questions"),tTeam:wAt(sc,"care","the data team"),
    tGov:wAt(sc,"census","governed table"),tIns:wAt(sc,"instr","Its instructions"),tStud:wAt(sc,"instr","a student is"),
    tTests:wAt(sc,"bench","Its tests"),tBehind:wAt(sc,"bench","questions behind"),tRight:wAt(sc,"bench","right answer"),
    tRuns:wAt(sc,"runs","runs them"),tSql:wAt(sc,"sql","shows its"),tCheck:wAt(sc,"sql","anyone can check")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{ag_roomLight(c,1);
      const g1=ag_in(tt,0.4,0.6)*(1-ag_in(tt,T.tCare,0.45));
      od_genieOne(c,{q:(tt-T.tG1-0.2)/1.8,ans:(tt-T.tQ-0.2)/0.6,chip:(tt-T.tWords+0.1)/0.5,tag:(tt-T.tWords-0.9)/0.5},{a:g1,t:tt,dx:-60*ag_in(tt,T.tCare,0.45)});
      const ga=ag_in(tt,T.tCare+0.25,0.5);if(ga>0){const tab=[ag_io(tt,T.tGov-0.4,T.tIns-0.2),ag_io(tt,T.tIns-0.2,T.tTests-0.2),0,ag_io(tt,T.tTests-0.2,T.tSql-0.3)];
        od_genieAgent(c,{top:ag_in(tt,T.tTeam-0.2,0.5),tab,data:od_ph(tt,T.tGov-0.3,T.tIns-0.4),instr:od_ph(tt,T.tIns-0.1,T.tTests-0.4),
          bench:od_ph(tt,T.tTests-0.1,T.tSql-0.4,2.2),sqlA:(tt-T.tRight+0.1)/0.9,good:clamp((tt-T.tRuns)/0.5,0,3),code:od_ph(tt,T.tSql-0.1,99,0.7)},
          {a:ga,dx:220*(1-ag_eo(ga)),t:tt});}}}
  ],0.6);
  od_chrome(ctx,S,t,0);
});

/* ---------------------------------------------------------------- 4 · Tools any agent can use */
scene("tools",(ctx,S,t,sc)=>{
  const T={tServers:wAt(sc,"second","tool servers"),tHands:wAt(sc,"second","the hands"),
    tRuns:wAt(sc,"runs","The platform runs"),tQ1:wAt(sc,"query","runs queries"),tQ2:wAt(sc,"query","governed function"),tQ3:wAt(sc,"query","searches"),
    tG:wAt(sc,"genie","Genie One"),tGA:wAt(sc,"genie","each Genie Agent"),tAsk:wAt(sc,"genie","can ask them"),
    tAnil:wAt(sc,"anil","Anil's agent"),tConn:wAt(sc,"anil","connects"),tSign:wAt(sc,"anil","sign-in"),tOnly:wAt(sc,"anil","only what"),
    tOnce:wAt(sc,"once","census count"),tAny:wAt(sc,"once","any faculty"),
    tCalls:wAt(sc,"calls","Every agent"),tNone:wAt(sc,"calls","none writes"),
    tMcp:wAt(sc,"mcp","open standard"),tPlug:wAt(sc,"mcp","plug in")};
  const cue=[T.tQ1,T.tQ2,T.tQ3,T.tG,T.tGA],next=[T.tQ2,T.tQ3,T.tG-0.3,T.tGA,T.tAsk+0.6];
  const row=[[170,740],[390,740],[610,740],[830,740]],who=["Anil's agent","Genie","census check","Jun's agent"],AX=420,AY=470,AR=64;
  const tb=i=>{const b=od_toolBox(i);return[b.x-14,b.y+b.h/2];};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      // an agent, then Anil's, which takes its place among the agents that call the census count; it comes in once the last chapter's end has gone
      const an=ag_in(tt,0.8,0.6),mv=ag_sine((tt-T.tOnce+0.7)/1.0),ax=lerp(AX,row[0][0],mv),ay=lerp(AY,row[0][1],mv),ar=lerp(AR,30,mv);
      const calls=clamp((tt-T.tCalls)/1.6,0,1);
      if(an>0){c.save();c.globalAlpha*=an;ag_floorShadow(c,ax+AG.sdx,ay+ar*0.98+(1-mv)*170,ar*1.2,ar*0.24,0.3);ag_model(c,ax,ay,ar,{t:tt,core:0.9,think:0.3});c.restore();}
      [1,2,3].forEach(i=>{const k=ag_in(tt,T.tCalls+0.2+i*0.2,0.5);if(k>0){c.save();c.globalAlpha*=k;ag_floorShadow(c,row[i][0]+AG.sdx,row[i][1]+29,36,8,0.3);ag_model(c,row[i][0],row[i][1]-(1-ag_eo(k))*30,30,{t:tt+i,core:0.9});c.restore();}});
      ag_roomLight(c,1);
      // the panel the platform runs them in, and a card for each tool server
      od_toolPanel(c,ag_in(tt,T.tRuns-0.2,0.6),{mcp:(tt-T.tMcp+0.1)/0.5});
      // the agent's hand: first toward the tools, the hands any agent can use; then, signed in as Anil, to each in turn
      const r1=ag_in(tt,T.tHands-0.1,0.6)*(1-ag_in(tt,T.tRuns+0.6,0.6)),r2=ag_in(tt,T.tConn-0.2,0.7)*(1-ag_in(tt,T.tOnce-1.0,0.5));
      const seg=clamp((tt-T.tConn-0.5)/0.55,0,4),si=Math.min(3,Math.floor(seg)),sf=ag_sine(seg-si),tp=r2>r1?[lerp(tb(si)[0],tb(si+1)[0],sf),lerp(tb(si)[1],tb(si+1)[1],sf)]:tb(2);
      OD_TOOLS.forEach((d,i)=>{const b=od_toolBox(i),k=(tt-(T.tServers+0.2+i*0.15))/0.6,touch=r2>0.6?clamp(1-Math.abs(seg-i)*1.6,0,1):0;
        const named=od_lit(tt,cue[i]-0.1,next[i]),called=i===1?0.8*clamp(calls*2,0,1)*(1-ag_in(tt,T.tMcp,0.6)):0,held=i===2?r1*0.7:0;
        od_tool(c,b,d[0],d[1],{k:clamp(k,0,1),a:ag_in(k,0,0.3),touch:Math.max(touch,named,called,held),plug:ag_in(tt,T.tMcp+0.2+i*0.12,0.4)});});
      const u=Math.max(r1,r2);if(u>0)ag_reach(c,[ax+ar*0.9,ay,ax+360,ay-50,tp[0]-300,tp[1]+30,tp[0],tp[1]],u,{data:r2>0.95?clamp((tt-T.tConn-0.6)%0.55/0.55,0,1):0});
      if(an>0&&mv<1){c.save();c.globalAlpha*=an*(1-mv);const na=ag_in(tt,T.tAnil-0.2,0.4);if(na>0)ag_T(c,"Anil's agent",ax,ay+ar+48,{w:700,size:28,align:"center",col:AG.label,a:na});
        if(tt>T.tSign-0.2)ag_pill(c,ax,ay+ar+112,"signed in as Anil",{icon:"lock",col:AG.blue,a:ag_in(tt,T.tSign-0.2,0.4)});c.restore();
        const la=ag_in(tt,T.tOnly,0.4);if(la>0){const lx=ax+ar*0.85,ly=ay-ar*0.8;c.save();c.globalAlpha*=la*(1-mv);c.fillStyle="rgba(243,241,237,0.96)";c.beginPath();c.arc(lx,ly,22,0,TAU);c.fill();
          c.strokeStyle=rgba(AG.blue,0.5);c.lineWidth=1.5;c.stroke();ag_lock(c,lx,ly+2,28,rgba(AG.blue,1));c.restore();}}
      // the census count, written once, as a function; every agent calls it, and each gets 2,880
      const fk=(tt-T.tOnce-0.2)/0.6,fn=od_fnCard(c,{k:clamp(fk,0,1),a:ag_in(fk,0,0.3),rev:(tt-T.tAny-0.2)/0.4,app:(tt-T.tAny-0.8)/0.4,glow:calls*(1-ag_in(tt,T.tMcp,0.6))});
      if(fk>0){row.forEach(([x,y],i)=>{const st=T.tCalls+(i?0.45+0.2*i:0),v=clamp((tt-st)/0.8,0,1),top=[OD_FN.x+150+i*140,fn.y+fn.h];if(v<=0)return;  // a thread only from an agent that is there
          od_thread(c,[x,y-32],top,v,AG.blue,{lw:3.5});const back=clamp((tt-st-0.9)/0.7,0,1);
          if(back>0&&back<1){const p=[x,y-32,x,y-32-(y-32-top[1])*0.6,top[0],top[1]+(y-32-top[1])*0.6,top[0],top[1]],q=ag_bz(p,1-back);ag_pellet(c,q[0],q[1]);}
          if(back>=1)ag_T(c,"2,880",(x+top[0])/2+16,(y-32+top[1])/2+10,{w:800,size:30,col:AG.orange,a:ag_in(tt,st+1.6,0.3)});});
        row.forEach(([x,y],i)=>{const k=i===0?ag_in(mv,0.6,0.4):ag_in(tt,T.tCalls+0.2+i*0.2,0.5);if(k>0)ag_T(c,who[i],x,y+70,{w:700,size:28,align:"center",col:AG.label,a:k});});}}}
  ],0.6);
  od_chrome(ctx,S,t,1);
});

/* ---------------------------------------------------------------- 5 · Agents the team builds */
scene("build",(ctx,S,t,sc)=>{
  const T={tFails:wAt(sc,"fails","fails its check"),tWhy:wAt(sc,"fails","find out why"),
    tAgent:wAt(sc,"bricks","census check agent"),tCode:wAt(sc,"bricks","in code"),tBricks:wAt(sc,"bricks","Agent Bricks"),
    tRT:wAt(sc,"runtime","Agent Runtime"),tJob:wAt(sc,"runtime","the job calls"),tTraced:wAt(sc,"runtime","every step"),
    tSame:wAt(sc,"same","same tool servers"),tBefore:wAt(sc,"before","Before anyone"),tCases:wAt(sc,"before","cases"),
    tC1:wAt(sc,"cases","thirty-seven"),tC2:wAt(sc,"cases","Three students"),tC3:wAt(sc,"cases","And Health's"),
    tJudges:wAt(sc,"judges","Judges"),tSums:wAt(sc,"judges","plain test"),tMei:wAt(sc,"judges","Mei and Jun"),
    tNote:wAt(sc,"note","Its note"),tReads:wAt(sc,"note","Jun reads"),tDecides:wAt(sc,"note","decides")};
  const RX=980,RY=560,TB=i=>od_toolBox(i,{x:1330,y:330,w:500,h:76,pitch:92});
  ag_shots(ctx,S,t,sc.dur,[
    // night: the plain job's check fails, and nobody can write down in advance why
    {at:0,place:"labNight",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      const ra=ag_in(tt,T.tAgent-0.2,0.6),steps=clamp((tt-T.tTraced-0.2)/0.6,0,4),sm=ag_in(tt,T.tSame-0.2,0.5);
      ag_loop(c,RX,RY,{R:140,r:64,a:ra,p:ag_in(tt,T.tAgent,1.2),core:0.4+0.6*ag_in(tt,T.tJob,0.5),think:steps>0&&steps<4?0.8:0.2,lit:steps>0&&steps<4?Math.floor(steps)%3:null,label:null,t:tt,floor:RY+190});
      // its hands: to the tool servers, one step after another
      const tgt=[0,0,2,null],si=Math.min(3,Math.floor(steps)),sf=steps-si;
      if(steps>0&&steps<4&&tgt[si]!=null){const b=TB(tgt[si]),p=[b.x-30,b.y+38],u=Math.sin(Math.PI*clamp(sf,0,1));ag_reach(c,[RX+70,RY-10,RX+170,RY-60,p[0]-120,p[1],p[0],p[1]],u,{data:sf>0.5?(sf-0.5)*2:0});}
      ag_roomLight(c,1,{night:true});if(ra>0)ag_model(c,RX,RY,64,{only:"light",t:tt,core:1,a:ra});
      // the job, its check, and why (after the chapter's dissolve, so no words of the last chapter's show under them)
      od_job(c,96,236,{a:ag_in(tt,0.7,0.5),fail:ag_in(tt,T.tFails,0.4)});od_ask(c,96,450,"Why?",ag_in(tt,T.tWhy,0.4),{k:(tt-T.tWhy)/0.5});
      if(ra>0)ag_pill(c,RX,360,"Census check agent",{a:ra,size:28});
      ag_pill(c,1430,267,"built in code",{icon:"draft",col:AG.blue,a:ag_in(tt,T.tCode,0.4),size:28});
      od_bricks(c,700,236,560,ag_in(tt,T.tBricks-0.1,0.5));
      od_runtime(c,RX,724,420,ag_in(tt,T.tRT-0.2,0.5),{u:clamp((tt-T.tRT+0.2)/0.6,0,1)});
      const cl=ag_in(tt,T.tJob-0.1,0.9);if(cl>0)od_thread(c,[636,300],[RX-150,RY],cl,AG.blue,{lw:4,bend:-40});  // the job calls it: a thread from the job to the agent, no word between the pills
      od_trace(c,96,560,{a:ag_in(tt,T.tTraced-0.3,0.5),n:steps});
      // the same tool servers as everyone else
      OD_TOOLS.forEach((d,i)=>{const hit=steps>0&&steps<4&&tgt[si]===i?Math.sin(Math.PI*clamp(sf,0,1)):0;
        od_tool(c,TB(i),d[0],null,{a:ag_in(tt,T.tRT+0.2+i*0.12,0.4)*lerp(0.75,1,sm),touch:Math.max(hit,sm*0.7*(1-ag_in(tt,T.tBefore-1.0,0.6)))});});}},
    // morning: the cases the team has met before, and the three ways each answer is scored
    {at:T.tBefore-0.1,later:true,dis:0.45,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{ag_roomLight(c,1);
      od_eval(c,{a:ag_in(tt,T.tBefore,0.5),ghost:ag_in(tt,T.tCases-0.2,0.6),rows:clamp((tt-T.tC1+0.2)/0.5,0,1)+clamp((tt-T.tC2+0.1)/0.5,0,1)+clamp((tt-T.tC3+0.1)/0.5,0,1)+clamp((tt-T.tC3-0.7)/0.5,0,1),
        colA:[ag_in(tt,T.tJudges-0.1,0.4),ag_in(tt,T.tSums-0.1,0.4),ag_in(tt,T.tMei-0.1,0.4)],cols:[(tt-T.tJudges-0.2)/0.3,(tt-T.tSums-0.1)/0.3,(tt-T.tMei-0.1)/0.3],amber:2});}},
    // its note is evidence, not a decision: Jun reads it, and decides
    {at:T.tNote-0.2,later:true,dis:0.45,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{ag_person(c,"jun",330,640,0.92,{t:tt,gaze:[6,-2],nod:0.03*ag_in(tt,T.tDecides,0.5)});ag_roomLight(c,1);
      ag_evidence(c,640,300,640,{kick:"Note for Jun",title:"Three students counted twice?",sub:"Engineering and IT: 134 against 131"},
        [{kick:"query",title:"count by faculty",col:AG.orange},{kick:"trace",title:"its four steps",col:AG.blue}],{open:clamp((tt-T.tReads+0.2)/1.2,0,1),a:ag_in(tt,T.tNote-0.1,0.4),k:Math.min(1,ag_spr(tt,T.tNote-0.1,0.5)),kickCol:AG.violet});
      ag_pill(c,960,800,"Jun decides",{col:AG.ink,a:ag_in(tt,T.tDecides,0.4),size:30});}}
  ],0.6);
  od_chrome(ctx,S,t,2,{dark:1-ag_in(t,T.tBefore-0.1,0.45)});
});

/* ---------------------------------------------------------------- 6 · Agents that write code */
scene("code",(ctx,S,t,sc)=>{
  const T={tSam:wAt(sc,"sam","Sam builds"),tPipes:wAt(sc,"sam","pipelines"),
    tGC:wAt(sc,"genie","Genie Code"),tRights:wAt(sc,"genie","his rights"),
    tSkills:wAt(sc,"skills","the team's skills"),tFiles:wAt(sc,"skills","the same files"),tFormat:wAt(sc,"skills","open format"),
    tAsked:wAt(sc,"profile","Asked to profile"),tFollows:wAt(sc,"profile","follows"),tQuery:wAt(sc,"profile","the query"),tClaim:wAt(sc,"profile","every claim"),
    tJun:wAt(sc,"jun","Jun's own"),tDbt:wAt(sc,"jun","dbt project"),
    tReach:wAt(sc,"reach","same tool servers"),tDbs:wAt(sc,"reach","Databricks' own"),
    tTeach:wAt(sc,"teach","Skills teach"),tLet:wAt(sc,"teach","tool servers let"),
    tDraft:wAt(sc,"draft","a draft"),tRev:wAt(sc,"draft","reviews it"),tSecond:wAt(sc,"draft","a second person"),tProd:wAt(sc,"draft","production")};
  // Sam, standing beside his pipeline editor, Genie Code in its panel
  const pipe=(c,tt,o)=>{ag_person(c,"sam",250,640,0.92,{t:tt,gaze:[5,-1]});ag_roomLight(c,1);
    ag_textCard(c,64,212,330,{title:"Sam Okafor",sub:"Data platform"},{a:o.name==null?1:o.name});od_pipeline(c,o,{t:tt});};
  // the wide shot: Sam's desk and Jun's; the team's skills, read by both agents; Jun's agent on his screen, with the platform's
  // tool servers and Databricks' own skills
  const JX=1745,JY=398;
  const wide=(c,tt,o)=>{ag_desk(c,80,840,680,{depth:70});ag_desk(c,1160,840,680,{depth:70});
    ag_person(c,"sam",230,600,0.66,{t:tt,cut:770,gaze:[5,-1]});ag_person(c,"jun",1310,600,0.66,{t:tt+0.7,cut:770,gaze:[5,-1]});
    ag_screen(c,330,440,400,260,{stand:60,draw:(x,gx,gy,gw,gh)=>od_skillsScreen(x,gx,gy,gw,gh,{t:tt})});
    ag_screen(c,1410,440,400,260,{stand:60,draw:(x,gx,gy,gw,gh)=>od_editorScreen(x,gx,gy,gw,gh,{tree:o.tree==null?1:o.tree})});
    if(o.jun>0){const k=o.jun;c.save();c.globalAlpha*=ag_in(k,0,0.4);ag_floorShadow(c,JX+AG.sdx*0.6,JY+28,30,6,0.3);ag_model(c,JX,JY-(1-ag_eo(clamp(k,0,1)))*24,30,{t:tt,core:0.6+0.4*k,think:0.4*k});c.restore();}
    ag_roomLight(c,1);
    od_folderCard(c,960-117,214,"skills/",{a:1});
    od_thread(c,[960,292],[530,426],o.th==null?1:o.th,AG.violet,{lw:4});od_thread(c,[960,292],[1610,426],o.th==null?1:o.th,AG.violet,{lw:4});
    if(o.md>0){const s="SKILL.md · name · description",f={w:500,size:28,f:"mono"},w=ag_tw(c,s,f)+48;c.save();c.globalAlpha*=ag_in(o.md,0,0.4);
      ag_box(c,960-w/2,312,w,60,14,{edge:AG.violet,edgeA:0.5});ag_T(c,s,960,352,Object.assign({align:"center"},f));c.restore();}
    // what Jun's agent reaches: the platform's tool servers (blue) and Databricks' own skills (violet), each on a thread to it
    if(o.tools>0){const w=od_folderCard(c,1500,214,"tool servers",{mono:false,col:AG.blue,k:o.tools,a:ag_in(o.tools,0,0.4)});od_thread(c,[JX,JY-32],[1500+w/2,292],ag_in(o.tools,0.2,0.8),AG.blue,{lw:3.5});}
    if(o.dbs>0){const w=od_folderCard(c,1110,214,"Databricks' skills",{mono:false,col:AG.violet,k:o.dbs,a:ag_in(o.dbs,0,0.4)});od_thread(c,[JX-12,JY-30],[1110+w/2,292],ag_in(o.dbs,0.2,0.8),AG.violet,{lw:3.5});}};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>pipe(c,tt,{name:ag_in(tt,T.tSam-0.2,0.5),code:clamp((tt-T.tPipes)/1.4,0,1),panel:(tt-T.tGC+0.1)/0.6,rights:(tt-T.tRights+0.1)/0.4,
      skills:clamp((tt-T.tSkills)/0.6,0,1),think:0.3})},
    {at:T.tFiles+0.4,later:true,dis:0.45,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>wide(c,tt,{th:ag_in(tt,T.tFiles+0.9,1.0),md:(tt-T.tFormat+0.1)/0.5,tree:0})},
    {at:T.tAsked-0.2,later:true,dis:0.45,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>pipe(c,tt,{panel:1,rights:1,skills:1,using:(tt-T.tFollows+0.2)/0.5,claim:(tt-T.tFollows-0.3)/0.5,
      chip:(tt-T.tQuery)/0.4,res:(tt-T.tClaim+0.2)/0.4,think:0.6})},
    {at:T.tJun-0.2,later:true,dis:0.45,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{wide(c,tt,{tree:clamp((tt-T.tDbt+0.2)/1.0,0,1),jun:ag_in(tt,T.tJun,0.5),tools:(tt-T.tReach+0.2)/0.6,dbs:(tt-T.tDbs+0.1)/0.6});
      // skills teach an agent how to work; tool servers let it do the work
      od_statement(c,S,ag_in(tt,T.tTeach-0.2,0.5),"Skills teach an agent how to work;","tool servers let it do the work.",{c1:AG.violet,c2:AG.blue,a2:ag_in(tt,T.tLet-0.2,0.4),k:(tt-T.tTeach+0.2)/0.5});}},
    // a draft on a branch: its person reviews it, and a second person approves what reaches production
    {at:T.tDraft-0.3,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{ag_glass(c,1260,200,580,640,{label:"Production"});ag_sandbox(c,640,790,940,{});ag_roomLight(c,1);
      const mv=ag_sine((tt-T.tProd+0.1)/1.3),app=(tt-T.tSecond-0.3)/0.4;
      [["Genie Code","reviewed · Sam",150,470],["Jun's agent","reviewed · Jun",690,470]].forEach(([who,rev,x,y],i)=>{const m=clamp(mv*1.3-(1-i)*0.3,0,1),e=ag_sine(m);
        od_draft(c,lerp(x,1300,e),lerp(y,300+i*240,e),who,{a:ag_in(tt,T.tDraft-0.2+i*0.2,0.4),rev:[rev,(tt-T.tRev+0.1-i*0.25)/0.4],app});});}}
  ],0.6);
  od_chrome(ctx,S,t,3,{a:1-ag_in(t,sc.dur-1.2,0.8)});
});

/* ---------------------------------------------------------------- 7 · The same answer */
scene("same",(ctx,S,t,sc)=>{
  const T={tBack:wAt(sc,"back","Back at"),tRead:wAt(sc,"read","the same governed"),tAsked:wAt(sc,"asked","Asked for"),tN:wAt(sc,"asked","two thousand"),
    tQ:wAt(sc,"asked","its query"),tDef:wAt(sc,"asked","its definition"),tPlans:wAt(sc,"plans","Anil plans"),
    tTake:wAt(sc,"takeaway","The platform"),tLeft:wAt(sc,"left","One question"),tWhose:wAt(sc,"left","whose reads"),tPays:wAt(sc,"left","who pays"),tNext:wAt(sc,"next","the next film")};
  ag_shots(ctx,S,t,sc.dur,[
    // the faculty again: the agents still their owners' own, reading the same data through the same tools
    {at:0,place:"odOffice",keys:[OD_WIDE],draw:(c,tt)=>{od_room(c,tt,{lit:[1,1,1],gone:1,blue:ag_in(tt,T.tRead-0.2,1.4)+0.0001,gaze:[[4,-3],[4,-3],[4,-3]]});
      ag_textCard(c,610,24,700,{title:"Health's students on census day?"},{a:ag_in(tt,T.tAsked-0.2,0.4),k:Math.min(1,ag_spr(tt,T.tAsked-0.2,0.5))});
      OD.answer.forEach((x,i)=>od_answer(c,x,OD.ansY+22,"2,880",{u:clamp((tt-T.tN+0.8-i*0.25)/0.7,0,1),from:[OD.agent[i][0],OD.agent[i][1]-20],ev:clamp((tt-T.tQ+0.2-i*0.12)/(T.tDef-T.tQ+0.6),0,1)}));
      od_scr(c,S,()=>od_tag(c,"Faculty of Health",ag_in(tt,0.3,0.6)*(1-ag_in(tt,T.tAsked-0.4,0.4))));}},
    // Anil plans a place for every student
    {at:T.tPlans-0.2,cut:true,place:"odOffice",keys:[OD_Z1],draw:(c,tt)=>{od_room(c,tt,{only:0,lit:[1,1,1],gone:1,blue:1,smile:[0.8],gaze:[[6,-2]]});
      od_scr(c,S,()=>{const k=(tt-T.tPlans+0.1)/0.6;od_plan(c,1060,72,{k,a:ag_in(k,0,0.3),ok:1});od_answer(c,1440,452,"2,880",{ev:1,tick:1});});}},  // the plan as it now stands: every student has a place
    // one question is left: the census check agent, alone at night (a cut under the takeaway's veil, so no agent shows in two places)
    {at:T.tLeft-0.6,cut:true,place:"labNight",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{const f=1-ag_in(tt,sc.cues.breath,0.6);if(f<=0)return;c.save();c.globalAlpha*=f;  // gone before the card's words come in (0.5 s after its veil)
      ag_loop(c,960,500,{R:140,r:64,core:0.7,think:0.2,label:null,t:tt,floor:690});
      ag_roomLight(c,1,{night:true});ag_model(c,960,500,64,{only:"light",t:tt,core:0.8});ag_pill(c,960,300,"Census check agent",{size:28});
      od_ask(c,330,410,"Whose reads?",ag_in(tt,T.tWhose-0.1,0.4),{k:(tt-T.tWhose+0.1)/0.5});od_ask(c,1200,410,"Who pays for its model?",ag_in(tt,T.tPays-0.1,0.4),{k:(tt-T.tPays+0.1)/0.5});
      const na=ag_in(tt,T.tNext-0.3,0.5);if(na>0)ag_textCard(c,460,704,1000,{kick:"Next",title:"Why Unity Catalog and Unity Gateway govern them"},{a:na,k:Math.min(1,ag_spr(tt,T.tNext-0.3,0.5)),kickCol:AG.blue});c.restore();}}
  ],0.6);
  // the takeaway, over the faculty
  od_statement(ctx,S,ag_in(t,T.tTake-0.3,0.6)*(1-ag_in(t,T.tLeft-0.6,0.5)),"The platform gives agents the same data","and tools people use, in one place.",{k:(t-T.tTake+0.3)/0.5});
  ag_end(ctx,S,t,sc.cues.breath,"Working with agents on Databricks","The same data and tools people use, in one place.","Film 7 of 9","Agents at work on data");
});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["place","ask","tools","build","code"]);

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
  let t=0,playing=false,last=0,dirty=true,inView=true,keysOn=true,waiting=false,stopAt=null,ready=false,prepP=null,q=1,avg=16,nf=0,good=0;scrub.max=TL.total.toFixed(2);const hasAu=au&&au.getAttribute("src");
  function size(){const r=cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);const w=Math.round(Math.min(1920,r.width*d)*q);if(w>0&&cv.width!==w){cv.width=w;cv.height=Math.round(w*9/16);}}
  SCENES.forEach(s=>{const b=document.createElement("button"),tc=document.createElement("span");tc.className="tc";tc.textContent=fmt(s.start);b.append(tc,document.createTextNode(s.name));b.onclick=()=>{seek(s.start+0.01);};chap.appendChild(b);});
  /* the film's pictures (paper, stone, wood, places) are made only when the visitor is about to watch: the poster covers the film until
     then, and making them as the page opened held the page for up to a second on a fast machine and several on a phone (4 November 2026).
     A pointer or a finger over the player, focus on it, Play, a chapter, the bar or full screen starts it; Play shows "Loading…" meanwhile. */
  function prep(){return prepP||(prepP=(async()=>{await new Promise(r=>requestAnimationFrame(()=>setTimeout(r,0)));await prepAssets();ready=true;readyRes();
    if(playing&&hasAu){au.pause();au.muted=false;try{au.currentTime=t;}catch(e){}au.play().catch(()=>{});}last=performance.now();dirty=true;label();})());}
  function seek(x){prep();stopAt=null;t=clamp(x,0,TL.total);if(hasAu){try{au.currentTime=t;}catch(e){}}dirty=true;box.classList.add("started");}
  function label(){play.textContent=playing?(waiting||!ready?UI.load:UI.pause):UI.play;}
  function draw(){size();renderFrame(ctx,cv.width/W,t);scrub.value=t.toFixed(2);time.textContent=fmt(t)+" / "+fmt(TL.total);const i=sceneIndex(t);[...chap.children].forEach((b,k)=>b.classList.toggle("on",k===i));}
  // draws only while playing or after a change, and only while the player is on screen
  // FILM.onChapterEnd(id) can hold the film on the last frame of a chapter, for "pause and think": return true to pause there
  /* while playing, a film that can't keep up on this device (frames more than 40 ms apart on average) is drawn at a lower resolution,
     down to half; when frames come quickly for a long while, it goes back up */
  function pace(dt){dt=Math.min(dt,250);avg=avg*0.9+dt*0.1;if(++nf<30)return;nf=0;
    if(avg>40&&q>0.5){q=Math.max(0.5,q*0.8);good=0;dirty=true;}else if(avg<20&&q<1&&++good>=10){q=Math.min(1,q/0.8);good=0;dirty=true;}}
  function loop(ts){if(playing&&ready){pace(ts-last);const i0=sceneIndex(t);if(hasAu&&!au.paused)t=au.currentTime;else{const dt=Math.min(0.1,(ts-last)/1000);t+=dt;}
    if(FILM.onChapterEnd&&sceneIndex(t)>i0){const s=SCENES[i0];if(FILM.onChapterEnd(s.id)===true){t=s.start+s.dur-0.03;playing=false;label();if(hasAu){au.pause();try{au.currentTime=t;}catch(e){}}}}
    if(t>=TL.total-0.02){t=TL.total;playing=false;label();if(hasAu)au.pause();}if(stopAt!=null&&t>=stopAt){t=stopAt;stopAt=null;playing=false;label();if(hasAu)au.pause();}dirty=true;}last=ts;if(dirty&&inView&&ready){draw();dirty=false;}requestAnimationFrame(loop);}
  function toggle(){prep();box.classList.add("started");if(t>=TL.total-0.05)seek(0);playing=!playing;label();
    // before the pictures are ready, the soundtrack starts muted inside the click, so a browser that only lets sound start from a click lets it start later
    if(hasAu){if(playing){if(!ready)au.muted=true;au.currentTime=t;au.play().catch(()=>{});}else au.pause();}dirty=true;}
  play.onclick=toggle;box.querySelectorAll("[data-play]").forEach(b=>{b.onclick=()=>{if(!playing)toggle();};});
  if(hasAu){au.addEventListener("waiting",()=>{waiting=true;label();});au.addEventListener("playing",()=>{waiting=false;label();});}
  scrub.oninput=()=>seek(parseFloat(scrub.value));
  // full screen covers the player (film and controls); browsers that only allow it for <video>, such as Safari on iPhone, hide the button
  const fsb=document.getElementById("fs"),fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement,fsReq=box.requestFullscreen||box.webkitRequestFullscreen;
  function fsToggle(){prep();if(fsEl())(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const r=fsReq.call(box);if(r&&r.catch)r.catch(()=>{});}}
  if(fsb){if(!fsReq)fsb.hidden=true;else{fsb.onclick=fsToggle;cv.ondblclick=fsToggle;["fullscreenchange","webkitfullscreenchange"].forEach(ev=>document.addEventListener(ev,()=>{fsb.textContent=fsEl()?UI.fsExit:UI.fs;dirty=true;}));}}
  cc.onclick=()=>{CAPS_ON=!CAPS_ON;cc.classList.toggle("on",CAPS_ON);cc.setAttribute("aria-pressed",CAPS_ON);dirty=true;};
  if("IntersectionObserver" in window)new IntersectionObserver(es=>{const e=es[es.length-1];inView=e.isIntersecting;keysOn=e.intersectionRatio>=0.55;if(inView)dirty=true;},{threshold:[0,0.55]}).observe(box);
  // keys work while most of the player is on screen and no other control has focus
  window.addEventListener("keydown",e=>{if(!keysOn&&!fsEl())return;const tg=e.target,own=box.contains(tg);if(!own&&tg.closest&&tg.closest("a,button,input,select,textarea,[contenteditable],[role=button],[role=radio],[role=option],[tabindex]"))return;
    if(e.code==="Space"&&tg.tagName!=="BUTTON"&&tg.tagName!=="INPUT"){e.preventDefault();toggle();}else if(e.code==="KeyF"&&fsReq&&!e.ctrlKey&&!e.metaKey&&!e.altKey)fsToggle();});
  window.addEventListener("resize",()=>{dirty=true;});
  ["pointerenter","touchstart","focusin"].forEach(ev=>box.addEventListener(ev,prep,{once:true,passive:true}));
  Object.assign(FILM,{prepare:prep,seek,time:()=>t,playing:()=>playing,play:()=>{if(!playing)toggle();},pause:()=>{if(playing)toggle();},playScene:(id,once)=>{const s=SCENES.find(x=>x.id===id);seek(FILM.sceneStart(id)+0.01);if(once&&s)stopAt=s.start+s.dur-0.05;if(!playing)toggle();}});
  const hm=location.hash.match(/t=([0-9:.]+)/);if(hm){const p=hm[1].split(":").map(Number);seek(p.length>1?p[0]*60+p[1]:p[0]);}requestAnimationFrame(loop);});}

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
  if(ks.length&&document.getElementById("film"))ag_place(ks[0]);let i=1;const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:1000}):setTimeout(f,60);
  const next=()=>{if(i>=ks.length)return;ag_place(ks[i++]);idle(next);},go=()=>setTimeout(()=>idle(next),200);
  // a page without a player (labs, scenarios) paints a place only when it first draws it (the kept picture is made then), never all of
  // them ahead: painting every place as a labs page opened held it for seconds (4 November 2026)
  const cv=document.getElementById("film"),box=cv&&cv.closest(".player");if(!box)return;if(box.classList.contains("started")){go();return;}
  const mo=new MutationObserver(()=>{if(box.classList.contains("started")){mo.disconnect();go();}});mo.observe(box,{attributes:true,attributeFilter:["class"]});}
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
