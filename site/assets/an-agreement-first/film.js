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

// An agreement first, the opening film of Only what you may see, the second series of Data protection and privacy. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers and dates in words). The few longer stops are in breath.js.
const NARR={
"first":{"name":"Signed first","lead":1.6,"tail":1.0,"vo":[
 {"id":"place","gap":0.8,"text":"England, 1939.","say":"England, nineteen thirty-nine."},
 {"id":"park","gap":0.8,"text":"At Bletchley Park, Britain's codebreakers set to work on the enemy's coded radio messages."},
 {"id":"people","gap":0.8,"text":"By 1945, almost nine thousand people work there, three in four of them women.","say":"By nineteen forty-five, almost nine thousand people work there, three in four of them women."},
 {"id":"secret","gap":0.8,"text":"Each of them learns the war's best-kept secret: the enemy's messages can be read."},
 {"id":"ships","gap":0.8,"text":"Ships crossing the Atlantic are steered away from submarines, because the submarines' orders have been read."},
 {"id":"codes","gap":0.8,"text":"If the enemy found out, it would change its codes, and the ships would sail into them."},
 {"id":"word","gap":0.8,"text":"One careless word, from any one of thousands, could give it away."},
 {"id":"before","gap":0.8,"text":"Something has to come before the secret."},
 {"id":"run","gap":0.8,"text":"So the people who run Bletchley put a promise first."},
 {"id":"signed","gap":0.8,"text":"Before anyone is told what the work is, they sign the Official Secrets Act: a promise to keep what they learn to themselves."},
 {"id":"part","gap":0.8,"text":"Then each is told only what their own part needs."},
 {"id":"named","gap":0.8,"text":"What they read goes only to a few named commanders, by an officer who waits while it's read, then takes it back and destroys it."},
 {"id":"away","gap":0.8,"text":"And nothing done with it may give the secret away."},
 {"id":"holds","gap":0.8,"text":"It holds."},
 {"id":"never","gap":0.8,"text":"The enemy never learns its messages are read, and the ships keep their warning."},
 {"id":"thirty","gap":0.8,"text":"And all those thousands keep it for almost thirty years, until 1974.","say":"And all those thousands keep it for almost thirty years, until nineteen seventy-four."},
 {"id":"too","gap":0.8,"text":"A university holds secrets too, and a study may ask for them."},
 {"id":"no","gap":0.8,"text":"A no fails the learners it could help; a yes with nothing written could expose them."},
 {"id":"papers","gap":0.8,"text":"So, as at Bletchley, two papers come first, and access comes last."},
 {"id":"nobody","gap":0.8,"text":"The study gets what it needs, and not one learner is named."}
]},
"asks":{"name":"A study asks","lead":0.8,"tail":1.0,"vo":[
 {"id":"day","gap":0.8,"text":"Monday, 5 October 2026.","say":"Monday, the fifth of October, twenty twenty-six."},
 {"id":"anil","gap":0.8,"text":"Anil Kurian, in the Faculty of Health, wants to study how its learners progress, and where they need support."},
 {"id":"asks","gap":0.8,"text":"So he asks the registrar's office for the records of the faculty's 2,614 learners.","say":"So he asks the registrar's office for the records of the faculty's two thousand, six hundred and fourteen learners."},
 {"id":"owns","gap":0.8,"text":"Mei Tanaka owns them, for the office."},
 {"id":"gave","gap":0.8,"text":"Who may see it gave every access a purpose and an end date, and The marketplace put the asking in one place."},
 {"id":"unsaid","gap":0.8,"text":"But a purpose and a date don't say what the study must never have, where it may work, or what may leave it."},
 {"id":"harm","gap":0.8,"text":"Left unsaid, names could sit beside results, and who gets extra time, and why, could travel wherever the work goes."},
 {"id":"two","gap":0.8,"text":"So two papers come first: one each person signs, and one for each use."}
]},
"promise":{"name":"A promise from each person","lead":0.8,"tail":1.0,"vo":[
 {"id":"own","gap":0.8,"text":"The first is each person's own: a confidentiality agreement."},
 {"id":"l1","gap":0.6,"text":"I keep what I see to myself."},
 {"id":"l2","gap":0.6,"text":"I use it only for the work it's given for."},
 {"id":"l3","gap":0.6,"text":"I keep no copy where it isn't allowed."},
 {"id":"l4","gap":0.6,"text":"I answer for the data I'm given."},
 {"id":"l5","gap":0.6,"text":"I report anything that goes wrong, at once."},
 {"id":"l6","gap":0.8,"text":"And it holds after I leave."},
 {"id":"everyone","gap":0.8,"text":"Everyone who works with the university's data signs it before any access: staff, contractors, researchers, the data team."},
 {"id":"yearly","gap":0.8,"text":"It's renewed every year, and Yusuf Demir, in data governance, keeps them."},
 {"id":"groups","gap":0.8,"text":"Access comes through groups, never to a person by name, and a person stays in a group only while their promise is signed and current."},
 {"id":"agent","gap":0.8,"text":"An agent signs nothing: its owner signs, and answers for it, as AI agents in data work shows."},
 {"id":"renewed","gap":0.8,"text":"Anil renewed his in February."},
 {"id":"bletchley","gap":0.8,"text":"As at Bletchley, the promise comes before the secret, and outlasts the work."}
]},
"agreement":{"name":"An agreement for each use","lead":0.8,"tail":1.0,"vo":[
 {"id":"second","gap":0.8,"text":"The second is for this use: a data sharing agreement, written line by line."},
 {"id":"purpose","gap":0.8,"text":"Its purpose: how learners in the Faculty of Health progress, and where they need support."},
 {"id":"from","gap":0.8,"text":"From the registrar's learner records: 2,614 learners.","say":"From the registrar's learner records: two thousand, six hundred and fourteen learners."},
 {"id":"may","gap":0.8,"text":"It may have each learner's course and results, their year of birth, and a code in place of who they are."},
 {"id":"never","gap":0.8,"text":"Never anything that names a learner, and nothing about their health."},
 {"id":"who","gap":0.8,"text":"Only the study's group, each member with a signed promise."},
 {"id":"where","gap":0.8,"text":"Only on the platform, in the study's own space, with nothing downloaded."},
 {"id":"leave","gap":0.8,"text":"What may leave: totals, with any count under ten hidden."},
 {"id":"ends","gap":0.8,"text":"It ends on 30 June 2027; then the study's copy is deleted, and the totals stay.","say":"It ends on the thirtieth of June, twenty twenty-seven; then the study's copy is deleted, and the totals stay."},
 {"id":"safes","gap":0.8,"text":"Statistics offices call these questions the Five Safes: people, project, setting, data and outputs."},
 {"id":"sign","gap":0.8,"text":"Mei signs as the owner, who answers for the data, as Who decides set out; Anil signs for the study."},
 {"id":"register","gap":0.8,"text":"Yusuf keeps it in the register of agreements: what was agreed, by whom, and until when."},
 {"id":"bletchley","gap":0.8,"text":"As at Bletchley, the data reaches only the people named, stays where it's kept, and leaves only in a form that names no one."}
]},
"grant":{"name":"Access, made from the agreement","lead":0.8,"tail":1.0,"vo":[
 {"id":"now","gap":0.8,"text":"Only now comes access, and it's made from the agreement."},
 {"id":"contract","gap":0.8,"text":"Its terms are written again where the platform reads them: the agreement's contract."},
 {"id":"terms","gap":0.8,"text":"The columns: course, results, year of birth, learner code. The group: the study's. The end: 30 June 2027.","say":"The columns: course, results, year of birth, learner code. The group: the study's. The end: the thirtieth of June, twenty twenty-seven."},
 {"id":"hand","gap":0.8,"text":"The platform team makes the grant from the contract, never by hand, so it can't give more than the agreement says."},
 {"id":"names","gap":0.8,"text":"Every grant names its agreement. No agreement, no grant."},
 {"id":"november","gap":0.8,"text":"In November, the faculty asks the study for the names of learners who need support, to call them."},
 {"id":"stretch","gap":0.8,"text":"That's a new purpose, and the study's agreement doesn't stretch to it."},
 {"id":"support","gap":0.8,"text":"The support team asks Mei for an agreement of its own."}
]},
"ends":{"name":"When it ends","lead":0.8,"tail":1.0,"vo":[
 {"id":"day","gap":0.8,"text":"Wednesday, 30 June 2027.","say":"Wednesday, the thirtieth of June, twenty twenty-seven."},
 {"id":"itself","gap":0.8,"text":"The grant ends by itself, on the date the agreement set."},
 {"id":"deleted","gap":0.8,"text":"The study's copy is deleted, and Yusuf closes the agreement in the register."},
 {"id":"totals","gap":0.8,"text":"The totals stay, with every count under ten hidden."},
 {"id":"holds","gap":0.8,"text":"Anil's promise doesn't end: it holds after the work, and after he leaves."},
 {"id":"bletchley","gap":0.8,"text":"At Bletchley, the promise came first, and the secret held for almost thirty years."},
 {"id":"learned","gap":0.8,"text":"At the university, the study learned what it needed from 2,614 learners' records, and not one learner was named.","say":"At the university, the study learned what it needed from two thousand, six hundred and fourteen learners' records, and not one learner was named."},
 {"id":"end","gap":0.8,"text":"Access is the end of an agreement, not the start."}
]}
};

const VODUR={"first/place": 1.727, "first/park": 5.497, "first/people": 5.48, "first/secret": 4.688, "first/ships": 5.588, "first/codes": 4.64, "first/word": 3.333, "first/before": 2.046, "first/run": 2.832, "first/signed": 7.274, "first/part": 2.848, "first/named": 7.359, "first/away": 2.601, "first/holds": 0.704, "first/never": 4.355, "first/thirty": 4.769, "first/too": 3.661, "first/no": 4.689, "first/papers": 4.115, "first/nobody": 3.193, "asks/day": 2.851, "asks/anil": 6.393, "asks/asks": 6.798, "asks/owns": 2.113, "asks/gave": 6.032, "asks/unsaid": 5.691, "asks/harm": 7.04, "asks/two": 4.662, "promise/own": 3.802, "promise/l1": 1.551, "promise/l2": 2.248, "promise/l3": 2.106, "promise/l4": 1.84, "promise/l5": 2.281, "promise/l6": 1.506, "promise/everyone": 8.002, "promise/yearly": 4.189, "promise/groups": 7.929, "promise/agent": 6.585, "promise/renewed": 1.769, "promise/bletchley": 4.246, "agreement/second": 4.564, "agreement/purpose": 5.028, "agreement/from": 4.921, "agreement/may": 5.578, "agreement/never": 3.455, "agreement/who": 3.227, "agreement/where": 4.13, "agreement/leave": 2.955, "agreement/ends": 6.769, "agreement/safes": 6.597, "agreement/sign": 6.367, "agreement/register": 5.35, "agreement/bletchley": 7.439, "grant/now": 3.076, "grant/contract": 4.362, "grant/terms": 8.297, "grant/hand": 6.39, "grant/names": 3.515, "grant/november": 5.495, "grant/stretch": 3.328, "grant/support": 2.767, "ends/day": 2.954, "ends/itself": 3.327, "ends/deleted": 4.536, "ends/totals": 2.751, "ends/holds": 4.409, "ends/bletchley": 4.536, "ends/learned": 8.392, "ends/end": 2.792};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card after the opening, and the end card. */
const BREATH={
"first":{"hold":{"place":0.6,"park":0.6,"people":0.8,"secret":0.8,"ships":0.6,"codes":1.0,"word":0.6,"before":1.4,"run":0.4,"signed":1.0,"part":0.8,"named":0.8,"away":1.0,"holds":0.4,"never":0.6,"thirty":1.2,"too":0.4,"no":0.8,"papers":0.6,"nobody":0.4},"breathe":4.4},
"asks":{"hold":{"day":0.6,"anil":0.6,"asks":0.6,"owns":0.6,"gave":0.8,"unsaid":1.0,"harm":1.2,"two":0.8}},
"promise":{"hold":{"own":0.6,"l1":0.2,"l2":0.2,"l3":0.2,"l4":0.2,"l5":0.2,"l6":1.0,"everyone":0.8,"yearly":0.6,"groups":1.0,"agent":0.8,"renewed":0.6,"bletchley":1.2}},
"agreement":{"hold":{"second":0.6,"purpose":0.6,"from":0.4,"may":0.8,"never":0.8,"who":0.6,"where":0.6,"leave":0.6,"ends":1.0,"safes":1.2,"sign":0.8,"register":0.8,"bletchley":1.2}},
"grant":{"hold":{"now":0.8,"contract":0.8,"terms":1.0,"hand":1.0,"names":1.0,"november":0.8,"stretch":0.8,"support":1.0}},
"ends":{"hold":{"day":0.6,"itself":0.8,"deleted":0.8,"totals":0.8,"holds":1.0,"bletchley":1.0,"learned":1.0,"end":0.8},"breathe":4.6}
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

/* ===== Data protection and privacy: the module's look, Night glass =====
   The films of the module Data protection and privacy (Locks before the data, Only what you may see, Kept for a reason) share one
   look, chosen by the author on 5 November 2026: Night glass, frosted glass with solid colour (the style prototype's variant GA). A dark
   petrol hall where every boundary is a pane of glass, frosted where what is behind it may not be read, clear where it may; light runs
   along the panes' edges; what is shown (badges, cards, chips, pills, ticks, tags) is frosted glass with words in ice white, and solid,
   bright colour where the colour means something; people stand in the light of what they look at, with a cool rim from the glass
   behind them. The author asked for the colours of what is shown to be "less faded" than the first draft's (the chip clearly gold):
   so bands, pills, ticks and the chip are solid, with dark words on them, and every word is at least 4.5 to 1 against what is behind it.
   The module's files, bundled in this order after The Inner Life of Data's engine and helpers (core.js, style2.js, ui3.js; logos.js and
   this kit's logos.js for a film that shows the tools), A Sharper Sketch's scene() (sketch3.js), and two files of the agent films' kit,
   unchanged: kit.js (text, timing, the camera, places painted once, scratch canvases, matte shapes) and people.js (the people's
   shapes, faces and cast):
     glass.js   the colours and what each means, words, frosted glass, and what is shown on it: panels, bands, pills, ticks and
                crosses, the chip, the seal, badges, cards, tags, slips, hidden values, sealed secrets, locks, the kicker, the title
                and end cards
     hall.js    the hall, painted once as a place, with its panes of glass; panes that stand in a scene
     night.js   the people, lit at night: each painted once in the light of what they look at, with a cool rim
     sphere.js  the agent: the agent films' sphere and band, in glass, the band in the colour of an identity
     pages.js   the tools' pages: a frosted window with the tool's logo and name, rows, fields and switches
     finish.js  what a film needs before it starts, and the video's motion blur
   Every top-level name starts with dp_ or DP_, except ag_model (the agent, named as the agent films name it, so the checks follow
   it). A film's own helpers go in its own source with a prefix of its own; never change these files for one film.
   Sizes are in the 1920 x 1080 frame. Every word is at least 28 px as seen and at least 4.5 to 1 against what is behind it
   (tools/contrast.py checks both ends of what is behind each word); nothing but the captions goes below y 890. */

/* ---------------------------------------------------------------- colours, and what each means in every film of the module
   T: words (ice white, a quieter ice, and the meaning colours made bright enough to read on the hall and on frosted glass);
   F: solid colour (bands, pills, ticks, lines of light, glows); on: the dark words on solid colour. */
const DP={
  T:{ink:[246,251,251],mut:[192,212,213],cyan:[92,226,245],green:[84,230,152],coral:[255,150,136],amber:[255,198,74],violet:[188,168,255],violet2:[198,192,234],grey:[176,194,196]},
  F:{cyan:[72,222,244],green:[70,228,146],coral:[255,106,90],amber:[255,192,56],violet:[176,150,255],violet2:[184,176,226],grey:[150,170,174]},
  on:[4,22,28],          // dark words on solid colour
  rim:[104,216,230],     // the cool light the glass behind throws on people
  ice:[190,245,245],     // light along the panes' edges
  veil:[5,16,20],        // the dark under a title or an end card
  hall:{bg0:[7,20,24],bg1:[13,36,41],floorTop:[15,40,44],floor:[8,24,28]}
};
// a colour by its meaning: cyan an identity (who or what it is), green allowed, coral denied or closed, amber power switched on
// (an admin account raised for a task), violet hidden (personal data, secrets: what only some may see), violet2 an indirect
// identifier, grey what needs no protection. Gold is the chip, which says a card is genuine.
const DP_MEANS={identity:"cyan",allowed:"green",denied:"coral",closed:"coral",power:"amber",hidden:"violet",indirect:"violet2",none:"grey"};
function dp_t(k){return Array.isArray(k)?k:DP.T[DP_MEANS[k]||k]||DP.T.ink;}
function dp_f(k){return Array.isArray(k)?k:DP.F[DP_MEANS[k]||k]||DP.F.cyan;}

/* ---------------------------------------------------------------- words
   dp_T draws with the agent films' ag_T (so the legibility check sees it, and {deco:1} marks decoration), in ice white unless o.col
   names a meaning ("cyan", "mut", "identity", ...) or gives a colour; o.w the weight (600), o.size (28), o.ls letter spacing in px,
   o.align, o.f ("mono"), o.a opacity, o.glow a colour (a key or [r, g, b]) to glow in, o.blur its size. */
function dp_T(ctx,s,x,y,o){o=o||{};const q=Object.assign({},o,{col:dp_t(o.col||"ink"),w:o.w||600,size:o.size||28});delete q.glow;
  if(!o.glow){ag_T(ctx,s,x,y,q);return;}
  ctx.save();ctx.shadowColor=rgba(dp_f(o.glow),0.6);ctx.shadowBlur=o.blur||10;ag_T(ctx,s,x,y,q);ctx.restore();}
function dp_tw(ctx,s,o){o=o||{};return ag_tw(ctx,s,{w:o.w||600,size:o.size||28,f:o.f,ls:o.ls});}
// several lines, lh apart, the first's baseline at y; returns the last baseline
function dp_lines(ctx,lines,x,y,lh,o){lines.forEach((l,i)=>dp_T(ctx,l,x,y+i*lh,o));return y+(lines.length-1)*lh;}

/* ---------------------------------------------------------------- blur and frosted glass
   The glass shows the place behind it, blurred: each place is blurred once, kept small, and drawn back under a pane, card or badge,
   so frosting costs a frame nothing. The place behind is the one the shot drew (ag_shots' shots, or ag_place); a card over a scene
   drawn live, not a place, names what is behind it in o.behind (a place's key, or a canvas the size of the frame), or false for none,
   and then shows the hall's dark. The glass shows the place, not what is drawn over it: keep cards off people. */
let DP_FILTER=null,DP_BEHIND=null;
// whether this browser blurs a canvas with ctx.filter (some don't: then a picture is shrunk and drawn back up, which is soft too)
function dp_hasFilter(){if(DP_FILTER!==null)return DP_FILTER;
  try{const c=mkCanvas(12,12),x=c.getContext("2d");x.filter="blur(2px)";x.fillStyle="#fff";x.fillRect(5,5,2,2);x.filter="none";DP_FILTER=x.getImageData(2,5,1,1).data[3]>0;}
  catch(e){DP_FILTER=false;}return DP_FILTER;}
// draws src (sx, sy, sw, sh of it) into ctx at dx, dy, dw, dh, blurred by about r px of ctx
function dp_blurDraw(ctx,src,sx,sy,sw,sh,dx,dy,dw,dh,r){
  if(!(r>0.4)){ctx.drawImage(src,sx,sy,sw,sh,dx,dy,dw,dh);return;}
  if(dp_hasFilter()){const f=ctx.filter;ctx.filter="blur("+r.toFixed(2)+"px)";ctx.drawImage(src,sx,sy,sw,sh,dx,dy,dw,dh);ctx.filter=f;return;}
  // shrunk in two steps to about a third of r per pixel, then drawn back up, smoothly
  const m=ctx.getTransform(),k=Math.max(1,Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))),f=Math.max(1.5,r*k/2.2),
        w1=Math.max(2,Math.ceil(dw*k/Math.sqrt(f))),h1=Math.max(2,Math.ceil(dh*k/Math.sqrt(f))),w2=Math.max(2,Math.ceil(dw*k/f)),h2=Math.max(2,Math.ceil(dh*k/f));
  const [c1,x1]=ag_buf("dpblur1",w1,h1),[c2,x2]=ag_buf("dpblur2",w2,h2);x1.imageSmoothingQuality="high";x2.imageSmoothingQuality="high";
  x1.drawImage(src,sx,sy,sw,sh,0,0,w1,h1);x2.drawImage(c1,0,0,w1,h1,0,0,w2,h2);
  const sm=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=true;ctx.drawImage(c2,0,0,w2,h2,dx,dy,dw,dh);ctx.imageSmoothingEnabled=sm;}
// a picture the size of the frame, blurred once and kept small (480 x 270): the frost of a place, or of a canvas
const DP_FROSTED=new Map();
function dp_frostOf(src){let c=DP_FROSTED.get(src);if(c)return c;c=mkCanvas(480,270);const x=c.getContext("2d");x.imageSmoothingQuality="high";
  x.drawImage(src,0,0,src.width,src.height,0,0,480,270);dp_blurDraw(x,c,0,0,480,270,0,0,480,270,4.5);DP_FROSTED.set(src,c);return c;}
function dp_frostPlace(key){return dp_frostOf(ag_place(key));}
// the place a shot draws is the one behind its glass
const dp_shot0=ag_shot,dp_place0=ag_place;
ag_shot=function(ctx,S,t,sh){DP_BEHIND=sh&&(sh.behind!==undefined?sh.behind:sh.place)||null;return dp_shot0.apply(this,arguments);};
ag_place=function(key){DP_BEHIND=key;return dp_place0(key);};
// what is behind a piece of glass, frosted, drawn in the place's coordinates (under the shot's camera)
function dp_behind(ctx,b){if(b===false)return;const k=b===undefined||b===null?DP_BEHIND:b;let src=null;
  if(typeof k==="string"&&AG_PLACES[k])src=dp_frostOf(dp_place0(k));else if(k&&k.width)src=dp_frostOf(k);
  if(src)ctx.drawImage(src,0,0,480,270,0,0,W,H);}
// light thrown on what is behind a lit thing
function dp_halo(ctx,x,y,r,col,a){if(!(a>0))return;ctx.save();ctx.globalCompositeOperation="lighter";const c=dp_f(col),g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(c,a));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

/* ---------------------------------------------------------------- what is shown: a panel of frosted glass
   dp_panel(ctx, x, y, w, h, {col, r, a, glowA, glowR, behind}): its glow on the hall in its colour, the place behind it frosted, a
   dark film and a faint tint, light along its top edge, and a rim of its colour, brightest at the top left. */
function dp_panel(ctx,x,y,w,h,o){o=o||{};const col=dp_f(o.col||"cyan"),r=o.r==null?22:o.r,a=o.a==null?1:o.a;if(a<=0)return;
  ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(col,0.34*(o.glowA==null?1:o.glowA));ctx.shadowBlur=o.glowR||46;rr(ctx,x,y,w,h,r);ctx.fillStyle="rgba(6,20,26,0.7)";ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,r);ctx.clip();dp_behind(ctx,o.behind);
  ctx.fillStyle="rgba(6,20,26,0.24)";ctx.fillRect(x,y,w,h);
  const tc=mix(col,[150,215,220],0.85),g=ctx.createLinearGradient(x,y,x+w*0.4,y+h);g.addColorStop(0,rgba(tc,0.17));g.addColorStop(1,rgba(tc,0.06));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  const hg=ctx.createLinearGradient(0,y,0,y+60);hg.addColorStop(0,"rgba(225,250,250,0.15)");hg.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,60);ctx.restore();
  const eg=ctx.createLinearGradient(x,y,x+w,y+h);eg.addColorStop(0,rgba(mix(col,[255,255,255],0.45),1));eg.addColorStop(0.5,rgba(col,0.8));eg.addColorStop(1,rgba(col,1));
  rr(ctx,x+1,y+1,w-2,h-2,r);ctx.strokeStyle=eg;ctx.lineWidth=2.2;ctx.stroke();ctx.restore();}
// a band of solid colour across the top of a card, hb tall (the card's corners r): its kind, in dark capitals
function dp_band(ctx,x,y,w,hb,r,col,text){const c=dp_f(col);ctx.save();rr(ctx,x,y,w,hb+r+2,r);ctx.clip();ctx.beginPath();ctx.rect(x,y,w,hb);ctx.clip();
  const g=ctx.createLinearGradient(x,y,x+w,y);g.addColorStop(0,rgba(mix(c,[255,255,255],0.10),1));g.addColorStop(1,rgba(mix(c,[0,40,56],0.18),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,hb);
  const hg=ctx.createLinearGradient(0,y,0,y+hb);hg.addColorStop(0,"rgba(255,255,255,0.30)");hg.addColorStop(0.5,"rgba(255,255,255,0)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,hb);
  ctx.fillStyle="rgba(0,0,0,0.18)";ctx.fillRect(x,y+hb-1.5,w,1.5);ctx.restore();
  if(text)dp_T(ctx,String(text).toUpperCase(),x+28,y+hb/2+10,{w:800,size:28,ls:4,col:DP.on});}
// a pill of solid colour with dark words; y is the words' baseline; returns its width
function dp_pill(ctx,x,y,text,col,o){o=o||{};const c=dp_f(col),size=o.size||28,w=dp_tw(ctx,text,{w:700,size})+36,h=size+20,a=o.a==null?1:o.a;if(a<=0)return w;
  const x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=o.glow==null?18:o.glow;rr(ctx,x0,y-h+12,w,h,h/2);
  const g=ctx.createLinearGradient(0,y-h+12,0,y+12);g.addColorStop(0,rgba(mix(c,[255,255,255],0.16),1));g.addColorStop(1,rgba(c,1));ctx.fillStyle=g;ctx.fill();ctx.restore();
  rr(ctx,x0+0.6,y-h+12.6,w-1.2,h-1.2,h/2-0.6);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.5),0.9);ctx.lineWidth=1.2;ctx.stroke();
  dp_T(ctx,text,x0+18,y-1,{w:700,size,col:DP.on});ctx.restore();return w;}
// a tick (allowed, a check passes) or a cross (denied) in a disc of solid colour; p draws it on (0 to 1)
function dp_tick(ctx,x,y,col,p){const c=dp_f(col||"green");p=p==null?1:p;if(p<=0)return;ctx.save();ctx.shadowColor=rgba(c,0.75);ctx.shadowBlur=14;ctx.fillStyle=rgba(c,1);
  ctx.beginPath();ctx.arc(x,y,20*ag_eo(Math.min(1,p*1.6)),0,TAU);ctx.fill();ctx.restore();const q=clamp((p-0.35)/0.65,0,1);if(q<=0)return;
  ctx.save();ctx.strokeStyle=rgba(DP.on,1);ctx.lineWidth=4.4;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();const P=[[x-9,y+1],[x-2.5,y+7.5],[x+10,y-7]];
  const L1=Math.hypot(6.5,6.5),L2=Math.hypot(12.5,14.5),u=q*(L1+L2);ctx.moveTo(...P[0]);if(u<=L1)ctx.lineTo(P[0][0]+6.5*u/L1,P[0][1]+6.5*u/L1);else{ctx.lineTo(...P[1]);const v=(u-L1)/L2;ctx.lineTo(P[1][0]+12.5*v,P[1][1]-14.5*v);}
  ctx.stroke();ctx.restore();}
function dp_cross(ctx,x,y,col,p){const c=dp_f(col||"coral");p=p==null?1:p;if(p<=0)return;ctx.save();ctx.shadowColor=rgba(c,0.75);ctx.shadowBlur=14;ctx.fillStyle=rgba(c,1);
  ctx.beginPath();ctx.arc(x,y,20*ag_eo(Math.min(1,p*1.6)),0,TAU);ctx.fill();ctx.restore();const q=clamp((p-0.35)/0.65,0,1);if(q<=0)return;
  ctx.save();ctx.strokeStyle=rgba(DP.on,1);ctx.lineWidth=4.4;ctx.lineCap="round";const a=Math.min(1,q*2),b=clamp(q*2-1,0,1);ctx.beginPath();
  ctx.moveTo(x-8,y-8);ctx.lineTo(x-8+16*a,y-8+16*a);if(b>0){ctx.moveTo(x+8,y-8);ctx.lineTo(x+8-16*b,y-8+16*b);}ctx.stroke();ctx.restore();}
// the chip: gold, as a card's chip is (72 x 56, its top left at cx, cy)
function dp_chip(ctx,cx,cy){ctx.save();ctx.shadowColor="rgba(255,204,92,0.5)";ctx.shadowBlur=14;rr(ctx,cx,cy,72,56,10);
  const g=ctx.createLinearGradient(cx,cy,cx+72,cy+56);g.addColorStop(0,"rgb(255,230,146)");g.addColorStop(0.42,"rgb(236,182,62)");g.addColorStop(0.68,"rgb(250,210,110)");g.addColorStop(1,"rgb(226,168,50)");
  ctx.fillStyle=g;ctx.fill();ctx.restore();rr(ctx,cx+0.7,cy+0.7,70.6,54.6,9.4);ctx.strokeStyle="rgb(160,110,28)";ctx.lineWidth=1.4;ctx.stroke();
  ctx.save();ctx.strokeStyle="rgba(140,94,18,0.95)";ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(cx+24,cy+2);ctx.lineTo(cx+24,cy+54);ctx.moveTo(cx+48,cy+2);ctx.lineTo(cx+48,cy+54);
  ctx.moveTo(cx+2,cy+28);ctx.lineTo(cx+24,cy+28);ctx.moveTo(cx+48,cy+28);ctx.lineTo(cx+70,cy+28);ctx.moveTo(cx+24,cy+18);ctx.lineTo(cx+48,cy+18);ctx.moveTo(cx+24,cy+38);ctx.lineTo(cx+48,cy+38);ctx.stroke();ctx.restore();}
// the seal, a ring of light that says a card is genuine: fine rings turning from the identity's cyan through ice to green; p draws it on
function dp_seal(ctx,x,y,r,t,p){p=p==null?1:p;if(p<=0)return;const c1=DP.F.cyan,c2=mix(c1,[255,255,255],0.6),c3=DP.F.green;ctx.save();ctx.globalCompositeOperation="lighter";
  for(let i=0;i<9;i++){const q=clamp(p*1.5-i*0.06,0,1);if(q<=0)continue;ctx.beginPath();ctx.arc(x,y,r*(0.4+i*0.07),-Math.PI/2,-Math.PI/2+TAU*ag_sine(q));
    if(ctx.createConicGradient){const g=ctx.createConicGradient((t||0)*0.8+i*0.3,x,y);g.addColorStop(0,rgba(c1,0.85));g.addColorStop(0.33,rgba(c2,0.85));g.addColorStop(0.66,rgba(c3,0.85));g.addColorStop(1,rgba(c1,0.85));ctx.strokeStyle=g;}
    else ctx.strokeStyle=rgba(c2,0.6);ctx.lineWidth=1.5;ctx.stroke();}ctx.restore();}
// the line of light that reads a badge: u from 0 (its top) to 1 (its foot), over the card x, y, w, h (corners r)
function dp_scan(ctx,x,y,w,h,u,col,r){const c=dp_f(col||"cyan"),sy=y+u*h;ctx.save();rr(ctx,x,y,w,h,r==null?24:r);ctx.clip();ctx.globalCompositeOperation="lighter";
  const g=ctx.createLinearGradient(0,sy-34,0,sy);g.addColorStop(0,rgba(c,0));g.addColorStop(1,rgba(c,0.26));ctx.fillStyle=g;ctx.fillRect(x,sy-34,w,34);
  ctx.shadowColor=rgba(c,1);ctx.shadowBlur=16;ctx.fillStyle=rgba(mix(c,[255,255,255],0.5),1);ctx.fillRect(x,sy-1.3,w,2.6);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="lighter";for(const ex of [x,x+w]){const eg=ctx.createRadialGradient(ex,sy,0,ex,sy,28);eg.addColorStop(0,rgba(mix(c,[255,255,255],0.6),0.95));eg.addColorStop(1,rgba(c,0));ctx.fillStyle=eg;ctx.fillRect(ex-28,sy-28,56,56);}ctx.restore();}

/* ---------------------------------------------------------------- pictures for a badge: a workload's gear, a person, a lock */
// a gear, as a path (a workload: a job, a pipeline, a service)
function dp_gear(c,x,y,r){c.beginPath();const n=10;for(let i=0;i<=n*4;i++){const a=i/(n*4)*TAU,k=i%4,r2=(k===0||k===1)?r:r*0.8;const X=x+Math.cos(a)*r2,Y=y+Math.sin(a)*r2;i?c.lineTo(X,Y):c.moveTo(X,Y);}c.closePath();
  c.moveTo(x+r*0.36,y);c.arc(x,y,r*0.36,0,TAU,true);}
function dp_gearPic(c,x,y,col){const cc=dp_f(col||"cyan");c.save();dp_gear(c,x,y-6,52);c.fillStyle=rgba(cc,0.30);c.fill("evenodd");c.shadowColor=rgba(cc,0.9);c.shadowBlur=12;
  c.lineWidth=2.4;c.strokeStyle=rgba(mix(cc,[255,255,255],0.4),1);c.stroke();c.shadowBlur=0;c.lineWidth=1.3;c.strokeStyle=rgba(cc,0.6);for(const r of [64,72]){c.beginPath();c.arc(x,y-6,r,0,TAU);c.stroke();}c.restore();}
// a person, head and shoulders, drawn in light (on a badge or a card, not the film's people)
function dp_personPic(c,x,y,col){const cc=dp_f(col||"cyan");c.save();c.fillStyle=rgba(cc,0.30);c.strokeStyle=rgba(mix(cc,[255,255,255],0.4),1);c.lineWidth=2.4;c.shadowColor=rgba(cc,0.9);c.shadowBlur=12;
  c.beginPath();c.arc(x,y-30,24,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-50,y+46);c.bezierCurveTo(x-48,y+8,x-26,y-2,x,y-2);c.bezierCurveTo(x+26,y-2,x+48,y+8,x+50,y+46);c.closePath();c.fill();c.stroke();c.restore();}
// a padlock, s its height; open from 0 (shut) to 1 (open); in its colour, drawn in light
function dp_lock(ctx,x,y,s,col,open){const c=dp_f(col||"violet"),k=s/60,u=clamp(open||0,0,1);ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.lineCap="round";
  ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.lineWidth=6;
  ctx.beginPath();ctx.moveTo(-14,-2);ctx.lineTo(-14,-16-8*u);ctx.arc(0,-16-8*u,14,Math.PI,0);ctx.lineTo(14,-16-8*u+(u>0.5?0:14*(1-2*u)));ctx.stroke();
  rr(ctx,-22,-4,44,34,7);ctx.fillStyle=rgba(mix(c,[6,20,26],0.35),1);ctx.fill();ctx.lineWidth=2.4;ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle=rgba(DP.on,0.9);ctx.beginPath();ctx.arc(0,9,4.6,0,TAU);ctx.fill();ctx.fillRect(-2,10,4,10);ctx.restore();}

/* ---------------------------------------------------------------- badges, cards, tags and slips
   dp_badge(ctx, x, y, w, h, {kind, col, title, lines: [[text, colour], ...], mrz, t, scan, pic, behind}): a badge of glass, as an
   identity card is: its kind on a band of solid colour, a picture (pic(ctx, cx, cy): dp_gearPic, dp_personPic, dp_sphereIcon), the
   seal that says it's genuine, the gold chip, its name and what it says, and a machine-readable line along its foot (decoration);
   scan (0 to 1) runs the light that reads it. 600 x 372 is the usual size. */
function dp_badge(ctx,x,y,w,h,o){o=o||{};const col=o.col||"cyan",c=dp_f(col),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_halo(ctx,x+w/2,y+h/2,Math.max(w,h)*0.9,col,0.10);
  dp_panel(ctx,x,y,w,h,{col,r:24,behind:o.behind});
  dp_band(ctx,x,y,w,62,24,col,o.kind);
  const px=x+28,py=y+88,pw=150,ph=176;ctx.save();rr(ctx,px,py,pw,ph,12);ctx.fillStyle="rgba(6,26,32,0.9)";ctx.fill();ctx.clip();
  const ig=ctx.createRadialGradient(px+pw/2,py+ph*0.45,10,px+pw/2,py+ph/2,ph*0.7);ig.addColorStop(0,rgba(c,0.30));ig.addColorStop(1,rgba(c,0));ctx.fillStyle=ig;ctx.fillRect(px,py,pw,ph);
  if(o.pic)o.pic(ctx,px+pw/2,py+ph/2);ctx.restore();
  rr(ctx,px+0.6,py+0.6,pw-1.2,ph-1.2,12);ctx.strokeStyle=rgba(c,0.85);ctx.lineWidth=1.8;ctx.stroke();
  if(o.seal!==false)dp_seal(ctx,px+pw-16,py+ph-16,34,o.t==null?1.1:o.t,o.seal);
  if(o.chip!==false)dp_chip(ctx,x+w-108,y+92);
  const tx=x+206;if(o.title)dp_T(ctx,o.title,tx,y+180,{w:700,size:42});
  (o.lines||[]).forEach((l,i)=>dp_T(ctx,l[0],tx,y+228+i*44,{w:l[1]?700:600,size:28,col:l[1]||"mut"}));
  if(o.scan!=null&&o.scan>0&&o.scan<1)dp_scan(ctx,x,y,w,h,o.scan,col);
  if(o.mrz)dp_T(ctx,o.mrz,x+28,y+h-24,{w:500,size:22,f:"mono",ls:1,col:"mut",a:0.85,deco:1});
  ctx.restore();}
/* dp_card(ctx, x, y, w, {kick, title, sub}, {col, a, k, measure}): a card of glass that fits its words: a kicker in capitals in its
   colour, a title (36 px) and a line or two under it (28 px, quieter); k springs it in from half its size (ag_spr); returns its box */
const DP_PAD=30;
function dp_card(ctx,x,y,w,words,o){o=o||{};const inner=w-DP_PAD*2,tl=words.title?ag_wrap(ctx,words.title,inner,{w:700,size:36}):[],sl=words.sub?ag_wrap(ctx,words.sub,inner,{w:500,size:28}):[];
  // each line's baseline, from the top: capitals' tops a padding in, then a line every 46 (titles) or 38 px (the lines under them)
  const L=[];let yy=y+DP_PAD;
  if(words.kick){yy+=20;L.push([String(words.kick).toUpperCase(),yy,{w:800,size:28,ls:4,col:o.col||"cyan"}]);}
  tl.forEach((l,i)=>{yy+=i?46:(words.kick?50:27);L.push([l,yy,{w:700,size:36}]);});
  sl.forEach((l,i)=>{yy+=i?38:(tl.length?42:words.kick?44:21);L.push([l,yy,{w:500,size:28,col:"mut"}]);});
  const h=Math.round(yy-y+8+DP_PAD),bb={x,y,w,h};if(o.measure)return bb;
  const a=o.a==null?1:o.a;if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:20,behind:o.behind,glowR:36});
  for(const [s,by,q] of L)dp_T(ctx,s,x+DP_PAD,by,q);
  ctx.restore();return bb;}
// a label on a small panel, in its colour, with a fine line of light to what it names (o.to [x, y]); returns its width
function dp_tag(ctx,x,y,text,col,o){o=o||{};const size=o.size||30,w=dp_tw(ctx,text,{w:700,size})+44,h=size+32,a=o.a==null?1:o.a,hc=dp_f(col);if(a<=0)return w;
  ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col,r:14,glowR:26,behind:o.behind});dp_T(ctx,text,x+22,y+h/2+size*0.36,{w:700,size,col});
  if(o.to){const [lx,ly]=o.to,inY=ly>=y&&ly<=y+h,sy=inY?y+h/2:(ly<y?y:y+h),sx=inY?(lx<x?x:x+w):Math.max(x+24,Math.min(x+w-24,lx)),p=o.p==null?1:o.p;
    const ex=lerp(sx,lx,p),ey=lerp(sy,ly,p);ctx.save();ctx.strokeStyle=rgba(hc,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.shadowColor=rgba(hc,0.8);ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.stroke();if(p>=1){ctx.fillStyle=rgba(mix(hc,[255,255,255],0.35),1);ctx.beginPath();ctx.arc(lx,ly,6,0,TAU);ctx.fill();}ctx.restore();}
  ctx.restore();return w;}
// a slip: one line on a small panel, in its colour; o.align "center" puts its middle at x; returns its box
function dp_slip(ctx,x,y,text,col,o){o=o||{};const size=o.size||30,w=dp_tw(ctx,text,{w:700,size})+48,h=size+40,x0=o.align==="center"?x-w/2:x,a=o.a==null?1:o.a,bb={x:x0,y,w,h};
  if(a<=0||o.measure)return bb;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x0,y,w,h,{col,r:16,glowR:30,behind:o.behind});
  dp_T(ctx,text,x0+24,y+h/2+size*0.36,{w:700,size,col:o.ink?"ink":col});ctx.restore();return bb;}
/* dp_frost(ctx, x, y, w, h, paint, {col, r, behind}): a value that may not be read, under frost in the violet of hidden data: paint(c)
   draws it in the same coordinates (it is drawn small and blurred, so no word of it can be read; the checks don't count it) */
function dp_frost(ctx,x,y,w,h,paint,o){o=o||{};const col=dp_f(o.col||"violet"),r=o.r==null?14:o.r,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(col,0.5);ctx.shadowBlur=20;rr(ctx,x,y,w,h,r);ctx.fillStyle="rgb(14,16,40)";ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,r);ctx.clip();dp_behind(ctx,o.behind);
  if(paint){const m=ctx.getTransform(),ks=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))||1,k=7/ks,bw=Math.ceil(w/k)+6,bh=Math.ceil(h/k)+6,[bc,bx]=ag_buf("dpfrost",bw,bh);
    bx.setTransform(1/k,0,0,1/k,-(x-3*k)/k,-(y-3*k)/k);paint(bx);const sm=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=true;ctx.drawImage(bc,0,0,bw,bh,x-3*k,y-3*k,bw*k,bh*k);ctx.imageSmoothingEnabled=sm;}
  ctx.fillStyle=rgba(col,0.32);ctx.fillRect(x,y,w,h);
  const hg=ctx.createLinearGradient(0,y,0,y+50);hg.addColorStop(0,"rgba(255,255,255,0.16)");hg.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,50);ctx.restore();
  rr(ctx,x+1,y+1,w-2,h-2,r);ctx.strokeStyle=rgba(mix(col,[255,255,255],0.3),1);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
/* dp_sealed(ctx, x, y, w, label, {sub, col, a, revoked}): a secret (a token, a password, a key) as a sealed card: frosted violet glass,
   a lock, what it is and whose (the label), a line under it (sub); never a character of the secret itself. revoked (0 to 1) strikes
   it through in coral: the secret no longer opens anything. 120 tall; returns its box */
function dp_sealed(ctx,x,y,w,label,o){o=o||{};const h=o.sub?120:96,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0||o.measure)return bb;const rv=clamp(o.revoked||0,0,1);
  ctx.save();ctx.globalAlpha*=a;dp_frost(ctx,x,y,w,h,null,{col:o.col||"violet",r:18,behind:o.behind});
  dp_lock(ctx,x+52,y+h/2-4,52,o.col||"violet",0);
  dp_T(ctx,label,x+100,y+(o.sub?52:58),{w:700,size:30});if(o.sub)dp_T(ctx,o.sub,x+100,y+92,{w:600,size:28,col:"mut"});
  if(rv>0){const c=dp_f("coral");ctx.save();ctx.strokeStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.lineWidth=4;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x+18,y+h-18);ctx.lineTo(x+18+(w-36)*ag_sine(rv),y+h-18-(h-36)*ag_sine(rv));ctx.stroke();ctx.restore();}
  ctx.restore();return bb;}
// a line of light from a to b, drawn on (p 0 to 1), with a dot at its end
function dp_link(ctx,a,b,col,p,o){o=o||{};p=p==null?1:p;if(p<=0)return;const c=dp_f(col||"cyan"),ex=lerp(a[0],b[0],p),ey=lerp(a[1],b[1],p);ctx.save();
  ctx.strokeStyle=rgba(c,o.alpha==null?1:o.alpha);ctx.lineWidth=o.lw||2.4;ctx.lineCap="round";ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(ex,ey);ctx.stroke();if(p>=1&&o.dot!==false){ctx.setLineDash([]);ctx.fillStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.beginPath();ctx.arc(b[0],b[1],6,0,TAU);ctx.fill();}ctx.restore();}

/* ---------------------------------------------------------------- the kicker, the mark, the title and end cards */
// a chapter's kicker, top left: its name in capitals, in the identity's cyan, a line of light under it, and a title under that
function dp_kicker(ctx,top,title,o){o=o||{};const x=o.x||72,y=o.y||98,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_T(ctx,String(top).toUpperCase(),x,y,{w:700,size:28,ls:4,col:"cyan"});
  const w=Math.max(dp_tw(ctx,String(top).toUpperCase(),{w:700,size:28,ls:4}),title?dp_tw(ctx,title,{w:700,size:46}):0),c=DP.F.cyan;
  const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(c,1));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(x,y+16,w,2.4);
  if(title)dp_T(ctx,title,x+0,y+74,{w:700,size:46});ctx.restore();}
// the module's mark: the seal's ring of light drawing itself round a small lock; p from 0 to 1
function dp_mark(ctx,cx,cy,r,p,a){if(!(a>0.01))return;ctx.save();ctx.globalAlpha*=a;dp_halo(ctx,cx,cy,r*2.6,"cyan",0.12*ag_in(p,0,0.5));
  dp_seal(ctx,cx,cy,r,p*2,clamp(p,0,1));dp_lock(ctx,cx,cy+4,r*0.62,"cyan",0);ctx.restore();}
function dp_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle=rgba(DP.veil,clamp(a,0,1));ctx.fillRect(0,0,W,H);}
// the title card: the mark, the film's title, a line under it, and "FILM 1 OF 9 · LOCKS BEFORE THE DATA" (line)
function dp_title(ctx,S,t,t0,title,sub,line){const oA=ag_in(t,t0,0.8),tA=ag_in(t,t0+0.5,0.8);if(oA<=0)return;dp_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{dp_mark(ctx,960,330,62,(t-t0-0.4)/1.6,1);dp_T(ctx,title,960,520,{w:800,size:88,align:"center"});
    if(sub)dp_T(ctx,sub,960,600,{w:600,size:36,align:"center",col:"mut"});withA(ctx,ag_in(t,t0+1.2,0.8),()=>dp_T(ctx,line,960,700,{w:700,size:28,ls:3,align:"center",col:"cyan"}));});}
// the end card: the film's last line, the mark, the title, and "Film 1 of 9 · Locks before the data · Learning Data"
function dp_end(ctx,S,t,t0,title,line,n,series){const oA=ag_in(t,t0,1.0),tA=ag_in(t,t0+0.6,0.9);if(oA<=0)return;dp_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)dp_T(ctx,line,960,360,{w:700,size:48,align:"center"});dp_mark(ctx,960,500,56,(t-t0-0.7)/1.4,1);dp_T(ctx,title,960,650,{w:800,size:44,align:"center"});
    dp_T(ctx,(n?n+" · ":"")+(series||"Locks before the data")+" · Learning Data",960,708,{w:600,size:28,align:"center",col:"mut"});});}

/* ===== Data protection and privacy: the hall =====
   The films' world: a dark petrol hall, its floor glossy, lights far off behind panes of frosted glass, haze where the floor meets the
   dark, and pools of light where people stand. Painted once as a place (kit.js: AG_PLACES, ag_place), then the camera looks at it.
   dp_paintHall(c, o) paints it; a film makes its own with the hall's own options and names it in its source:
     AG_PLACES.hallBadge = c => dp_paintHall(c, {seed: 7, horizon: 700, vx: 1100, pools: [[430, 990, 540, 0.12], [1060, 780, 640, 0.07]]});
   o: horizon (the floor's far edge, y 700), vx (where the floor's lines meet, x 1180), seed (where the lights and panes fall), lights
   (how many, 18), panes (how many standing panes, 9), pools ([x, y, r, a] each: light on the floor where people stand), haze (0.09).
   "hall" is the plain hall, for a film that needs no other.
   dp_wall(ctx, x, y, w, h, {frosted, col, a, label}) stands a pane in a scene: frosted, what is behind it may not be read; clear, it may. */
function dp_paintHall(c,o){o=o||{};const w=W,h=H,hz=o.horizon||700,vx=o.vx||1180,R=ag_rnd(o.seed||7),P=DP.hall,ice=DP.ice,cy=DP.F.cyan,vi=DP.F.violet,haze=o.haze==null?0.09:o.haze;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(P.bg0,1));g.addColorStop(1,rgba(P.bg1,1));c.fillStyle=g;c.fillRect(0,0,w,hz);
  g=c.createLinearGradient(0,hz,0,h);g.addColorStop(0,rgba(P.floorTop,1));g.addColorStop(1,rgba(P.floor,1));c.fillStyle=g;c.fillRect(0,hz,w,h-hz);
  // lights far off, behind the glass: soft, mostly the hall's own cool light, now and then violet or a warm lamp; and their gloss in the floor
  for(let i=0;i<(o.lights==null?18:o.lights);i++){const x=R()*w,y=hz*(0.22+R()*0.72),r=24+R()*110,u=R(),col=u<0.14?vi:u<0.22?[255,214,160]:[104,216,230],a=0.05+R()*0.11;
    const lg=c.createRadialGradient(x,y,0,x,y,r);lg.addColorStop(0,rgba(col,a));lg.addColorStop(1,rgba(col,0));c.fillStyle=lg;c.fillRect(x-r,y-r,2*r,2*r);
    const ry=hz+(hz-y)*0.22,rg=c.createRadialGradient(x,ry,0,x,ry,r);rg.addColorStop(0,rgba(col,a*0.45));rg.addColorStop(1,rgba(col,0));c.save();c.translate(x,ry);c.scale(0.45,1.6);c.translate(-x,-ry);c.fillStyle=rg;c.fillRect(x-r,ry-r,2*r,2*r);c.restore();}
  for(let i=0;i<46;i++){const x=R()*w,y=R()*hz*0.92,r=0.8+R()*2.2;c.fillStyle="rgba(170,235,235,"+(0.05+R()*0.14).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  // the floor's lines, running back to the middle of the hall
  c.save();c.strokeStyle="rgba(120,200,205,0.045)";c.lineWidth=1;for(let i=-14;i<=14;i++){c.beginPath();c.moveTo(vx,hz);c.lineTo(vx+i*260,h);c.stroke();}
  for(let j=1;j<9;j++){const y=hz+Math.pow(j/9,1.8)*(h-hz);c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}c.restore();
  // panes of frosted glass standing in the hall, far ones first: each blurs what is behind it, its top edge catching the light
  const n=o.panes==null?9:o.panes;for(let k=0;k<n;k++){const d=0.34+k*(0.56/Math.max(1,n-1)),pw=(150+R()*260)*d,ph=(620+R()*260)*d,x=(R()*1.3-0.15)*w,yb=hz+18+d*150,y=yb-ph,pad=16;
    c.save();c.beginPath();c.rect(x,y,pw,ph);c.clip();dp_blurDraw(c,c.canvas,x-pad,y-pad,pw+2*pad,ph+2*pad,x-pad,y-pad,pw+2*pad,ph+2*pad,8+10*d);
    const pg=c.createLinearGradient(0,y,0,yb);pg.addColorStop(0,"rgba(150,220,225,"+(0.05+0.05*d).toFixed(3)+")");pg.addColorStop(1,"rgba(150,220,225,"+(0.02+0.03*d).toFixed(3)+")");c.fillStyle=pg;c.fillRect(x,y,pw,ph);c.restore();
    c.fillStyle=rgba(ice,0.14+0.24*d);c.fillRect(x,y,pw,1.4);c.fillStyle=rgba(ice,0.05+0.13*d);c.fillRect(x,y,1.4,ph);c.fillStyle=rgba(ice,0.03+0.06*d);c.fillRect(x+pw-1.4,y,1.4,ph);
    const rg=c.createLinearGradient(0,yb,0,yb+ph*0.4);rg.addColorStop(0,"rgba(150,220,225,"+(0.05*d+0.02).toFixed(3)+")");rg.addColorStop(1,"rgba(150,220,225,0)");c.fillStyle=rg;c.fillRect(x,yb,pw,ph*0.4);}
  // haze where the floor meets the dark, and pools of light where people stand
  g=c.createLinearGradient(0,hz-150,0,hz+70);g.addColorStop(0,"rgba(80,160,170,0)");g.addColorStop(0.7,"rgba(80,160,170,"+haze+")");g.addColorStop(1,"rgba(80,160,170,0)");c.fillStyle=g;c.fillRect(0,hz-150,w,220);
  for(const [x,y,r,a] of (o.pools||[[520,900,520,0.10],[1250,760,700,0.08]])){const pg=c.createRadialGradient(x,y,0,x,y,r);pg.addColorStop(0,"rgba(120,220,225,"+a+")");pg.addColorStop(1,"rgba(120,220,225,0)");
    c.fillStyle=pg;c.save();c.translate(x,y);c.scale(1,0.42);c.translate(-x,-y);c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
  if(o.after)o.after(c);}
AG_PLACES.hall=c=>dp_paintHall(c,{});
// a pane of glass standing in a scene, from its foot (x, y + h) up: frosted (the place behind it blurred, its colour faint) or clear
// (only its edges and a sheen), in the colour of what it does (cyan, by default: who may pass), with its gloss in the floor
function dp_wall(ctx,x,y,w,h,o){o=o||{};const col=dp_f(o.col||"cyan"),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  if(o.frosted){dp_behind(ctx,o.behind);ctx.fillStyle="rgba(6,20,26,0.30)";ctx.fillRect(x,y,w,h);const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(mix(col,[150,215,220],0.7),0.16));g.addColorStop(1,rgba(mix(col,[150,215,220],0.7),0.05));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);}
  else{const sg=ctx.createLinearGradient(x,y,x+w,y+h);sg.addColorStop(0,"rgba(200,245,245,0.10)");sg.addColorStop(0.35,"rgba(200,245,245,0.02)");sg.addColorStop(0.5,"rgba(200,245,245,0.08)");sg.addColorStop(1,"rgba(200,245,245,0)");ctx.fillStyle=sg;ctx.fillRect(x,y,w,h);}
  ctx.restore();
  ctx.save();ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=o.frosted?10:16;ctx.fillStyle=rgba(mix(col,[255,255,255],0.4),o.frosted?0.7:0.95);ctx.fillRect(x,y,w,2);ctx.fillRect(x,y,2,h);ctx.fillRect(x+w-2,y,2,h);ctx.restore();
  const rg=ctx.createLinearGradient(0,y+h,0,y+h+h*0.3);rg.addColorStop(0,rgba(col,0.10));rg.addColorStop(1,rgba(col,0));ctx.fillStyle=rg;ctx.fillRect(x,y+h,w,h*0.3);
  if(o.label)dp_T(ctx,o.label,x+w/2,y-20,{w:700,size:28,align:"center",col:o.col||"cyan"});
  ctx.restore();}

/* ===== Data protection and privacy: the people, lit at night =====
   The agent films' people (people.js: their shapes, the face's table AG_FACE, the cast AG_CAST; an adult's proportions, one
   three-quarter head, arms down, a hand only on what the story is about), lit as Night glass lights them: softly, from what they look at
   in front of them, the skin keeping its own colour, with a cool rim of light along their back and the top of their head from the glass
   behind. The light is set in figure space, so it stays in front of a person either way round (flip).
   dp_person(ctx, who, x, y, s, o) draws a person exactly as ag_person does (the same x, y, s and o: t, flip, pose "hold" with hold or
   holdBack, gaze, nod, smile, talk, cut, covered; people.js's head says what each does), lit by o.light: a name in DP_LIGHTS ("glass",
   the default, the hall's cool light from the cards in front of them; "lamp", warm, for a lantern or a fire in an opening at night) or a
   light of the film's own ({key: [x, y] in figure space, kr, kk, amb, kc, shade, rim, rimA, rimW}, from "glass"'s values).
   Each person in each light is painted once: their head and their body (arms down, or the near arm free to hold), lit pixel by pixel,
   the rim added, and kept; then drawn every frame like any person of the agent films, and faded whole. Their eyes and mouth, and an
   arm that holds, are drawn live in the light where the near hand holds. A lanyard is drawn in light: a strap and a glass badge with a
   cyan band, the colour of an identity.
   A film lists who it shows in DP_PEOPLE (DP_PEOPLE.push("sam", ["mei", "lamp"])), so the player paints them while the page is idle
   once Play is near (finish.js), one picture at a time; someone not listed is painted the first time they're drawn.
   The pictures are wider than the agent films' (DP_HEADBOX, DP_BODYBOX), so the rim's glow isn't cut off; a hat still sits inside
   the head's picture (figure x 160 to 440, y 250 to 560), and edges.py checks every picture. */
/* The people this module adds to the agent films' cast, so every film draws them the same: Ingrid Holm, who owns HR's data, and Linh
   Nguyen, the casual tutor whose contract ends on 20 November 2026 (*Kept for a reason*). Both as *Modern data basics* draws them
   (films/data-that-moves/shared/src/people.js, MD_CAST), so they're the same people in both modules. */
Object.assign(AG_CAST,{
  ingrid:{name:"Ingrid Holm",role:"HR",skin:[236,204,182],hair:{style:"bun",c:[196,176,140]},glasses:[70,62,58],top:{kind:"blazer",c:[98,74,104],inner:[238,234,228]},breath:0.28},
  linh:{name:"Linh Nguyen",role:"Casual tutor",skin:[232,196,166],hair:{style:"bob",c:[24,22,26]},earrings:[214,218,226],top:{kind:"cardigan",c:[132,136,142],inner:[236,234,230]},breath:0.3}
});
const DP_LIGHTS={
  glass:{key:[700,450],kr:790,kk:0.97,amb:0.33,kc:[0.97,1.02,1.07],shade:[0.70,0.86,0.98],rim:[104,216,230],rimA:0.75,rimW:5},
  lamp:{key:[800,510],kr:900,kk:1.05,amb:0.29,kc:[1.12,0.97,0.80],shade:[0.62,0.78,1.0],rim:[150,205,230],rimA:0.7,rimW:5}
};
const DP_HEADBOX=[136,226,464,584],DP_BODYBOX=[6,238,524,1108];
const DP_PEOPLE=[],DP_NIGHT={};
function dp_light(L){return typeof L==="string"?(DP_LIGHTS[L]||DP_LIGHTS.glass):Object.assign({},DP_LIGHTS.glass,L||{});}
// the light at a point of figure space, as [r, g, b] factors: what is in front lights near points more, with its own colour
function dp_lightAt(L,X,Y){const d=Math.hypot(X-L.key[0],(Y-L.key[1])*0.9)/L.kr,kf=L.kk*Math.pow(Math.max(0,1-d),1.6),f=L.amb+kf,tw=kf/(f+1e-6);
  return [0,1,2].map(c=>f*(L.shade[c]*(1-tw)+L.kc[c]*tw));}
// a person in a light: a spec of their own (key "<who>@<light>"), whose pictures night.js paints; its colours are the live parts'
function dp_night(who,light){const D=ag_spec(who);if(D&&D.night)return D;const ln=typeof light==="string"?light:light?"own"+JSON.stringify(light):"glass",k=(D.key||D.name)+"@"+ln;
  let N=DP_NIGHT[k];if(N)return N;const L=dp_light(light),f=dp_lightAt(L,330,760),lit=c=>c&&c.map((v,i)=>clamp(Math.round(v*f[i]),0,255));
  N=DP_NIGHT[k]=Object.assign({},D,{key:k,night:{day:D,light:L},skin:lit(D.skin),hair:Object.assign({},D.hair,{c:lit(D.hair.c)}),
    top:Object.assign({},D.top,{c:lit(D.top.c)},D.top.inner?{inner:lit(D.top.inner)}:{}),beard:D.beard&&lit(D.beard)});return N;}
function dp_person(ctx,who,x,y,s,o){o=o||{};return ag_person(ctx,dp_night(who,o.light),x,y,s,o);}
// the steps that paint a person's pictures in a light, for the player to run one at a time (finish.js)
function dp_prepSteps(who,light){const N=dp_night(who,light);return[()=>ag_fig(N),()=>ag_figBody(ag_fig(N),true,true),()=>ag_figBody(ag_fig(N),false,true)];}

/* ---------------------------------------------------------------- painting a person at night, once
   dp_lit(c, paint, L, after): paint(c) as the agent films paint a person, then lit: each pixel by the light where it is (figure space,
   from c's transform), then the rim, the silhouette's back and top edges in L.rim, fading down the body, laid on in light ("lighter"),
   sharp and soft; then after(c), drawn in light and not lit (a lanyard). sil(c), in figure space, adds shapes to the silhouette the rim
   follows without painting them: a head's picture adds the neck and the torso it sits on, so the jaw's edge over the neck isn't lit. Works on any canvas and transform, so edges.py can paint it
   again on a wider one. The light at a point is the ambient in the shade's colour and the key in its own, amb * shade + kf * kc
   (dp_lightAt, worked out); kf is looked up by the square of the distance, so no pixel needs a root or a division. The rim is made at
   half size and drawn back up smoothly, which softens its edge, and again blurred, for its glow. */
function dp_lit(c,paint,L,after,sil){const m=c.getTransform(),cw=c.canvas.width,ch=c.canvas.height,sx=m.a,sy=m.d,ox=m.e,oy=m.f;
  const [bc,bx]=ag_buf("dplit",cw,ch);bx.setTransform(m);paint(bx);bx.setTransform(1,0,0,1,0,0);
  const img=bx.getImageData(0,0,cw,ch),d=img.data,N=4096,tab=new Float32Array(N+1);for(let i=0;i<=N;i++)tab[i]=L.kk*Math.pow(1-Math.sqrt(i/N),1.6);
  const kx=L.key[0],ky=L.key[1],ir2=1/(L.kr*L.kr),a0=L.amb*L.shade[0],a1=L.amb*L.shade[1],a2=L.amb*L.shade[2],k0=L.kc[0],k1=L.kc[1],k2=L.kc[2],stx=1/sx;
  for(let j=0;j<ch;j++){const dy=((j+0.5-oy)/sy-ky)*0.9,dy2=dy*dy*ir2;let p=j*cw*4,dx=(0.5-ox)/sx-kx;
    for(let i=0;i<cw;i++,p+=4,dx+=stx){if(d[p+3]<2)continue;const q=dx*dx*ir2+dy2,kf=q>=1?0:tab[(q*N)|0];
      d[p]=d[p]*(a0+k0*kf);d[p+1]=d[p+1]*(a1+k1*kf);d[p+2]=d[p+2]*(a2+k2*kf);}}
  bx.putImageData(img,0,0);
  // the rim, at half size: what of the silhouette a copy moved forward and down doesn't cover (its back and its top), in the rim's colour
  // (with sil, the silhouette is the picture's and what sil paints, such as the neck under a head, and the rim only on the picture)
  const hw=Math.ceil(cw/2),hh=Math.ceil(ch/2),rw=L.rimW*sx/2,dy=rw*0.35*sy/sx,[sc,sk]=ag_buf("dpsil",hw,hh);sk.imageSmoothingEnabled=true;sk.drawImage(bc,0,0,cw,ch,0,0,cw/2,ch/2);
  if(sil){sk.setTransform(m.a/2,0,0,m.d/2,m.e/2,m.f/2);sk.fillStyle="#000";sk.beginPath();sil(sk);sk.fill();sk.setTransform(1,0,0,1,0,0);}
  const [rc,rx]=ag_buf("dprim",hw,hh);rx.drawImage(sc,0,0);rx.globalCompositeOperation="destination-out";rx.drawImage(sc,rw,dy);
  rx.globalCompositeOperation="source-in";rx.fillStyle=rgba(L.rim,1);rx.fillRect(0,0,hw,hh);
  if(sil){rx.globalCompositeOperation="destination-in";rx.imageSmoothingEnabled=true;rx.drawImage(bc,0,0,cw,ch,0,0,cw/2,ch/2);}
  rx.globalCompositeOperation="destination-in";rx.setTransform(m.a/2,0,0,m.d/2,m.e/2,m.f/2);const fg=rx.createLinearGradient(0,250,0,1110);fg.addColorStop(0,"rgba(0,0,0,1)");fg.addColorStop(0.45,"rgba(0,0,0,0.75)");fg.addColorStop(1,"rgba(0,0,0,0.08)");
  rx.fillStyle=fg;rx.fillRect(-4000,-4000,9000,9000);rx.setTransform(1,0,0,1,0,0);rx.globalCompositeOperation="source-over";
  c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation="source-over";c.drawImage(bc,0,0);
  c.globalCompositeOperation="lighter";c.globalAlpha=L.rimA;c.imageSmoothingEnabled=true;c.drawImage(rc,0,0,hw,hh,0,0,hw*2,hh*2);c.globalAlpha=L.rimA*0.5;dp_softOnto(c,rc,3.5*sx,cw,ch);c.restore();
  if(after){c.save();after(c);c.restore();}}
// draws src onto c's whole canvas (cw by ch), blurred by about r of src's pixels: blurred on a copy as much smaller as the blur allows,
// then drawn back up smoothly, which is as soft and far quicker than a blur at full size
function dp_softOnto(c,src,r,cw,ch){const k=Math.max(1,r/1.2),w=Math.max(2,Math.ceil(src.width/k)),h=Math.max(2,Math.ceil(src.height/k)),[bc,bx]=ag_buf("dpsoft",w,h);
  bx.imageSmoothingEnabled=true;bx.imageSmoothingQuality="high";dp_blurDraw(bx,src,0,0,src.width,src.height,0,0,w,h,r/k);
  const sm=c.imageSmoothingEnabled;c.imageSmoothingEnabled=true;c.drawImage(bc,0,0,w,h,0,0,cw||src.width,ch||src.height);c.imageSmoothingEnabled=sm;}
// a lanyard drawn in light, in figure space: the strap, and a badge of glass with a cyan band (an identity), inside the torso
function dp_lanyard(c){const col=DP.F.cyan;c.save();c.beginPath();AG_F.torso(c);c.clip();
  c.strokeStyle=rgba(mix(col,[10,30,34],0.2),1);c.lineWidth=6;c.lineCap="round";c.beginPath();c.moveTo(246,586);c.bezierCurveTo(262,680,290,760,304,806);c.moveTo(352,612);c.bezierCurveTo(342,690,326,760,314,806);c.stroke();
  c.shadowColor=rgba(col,0.8);c.shadowBlur=14;rr(c,276,800,62,80,8);c.fillStyle="rgb(16,40,46)";c.fill();c.shadowBlur=0;c.strokeStyle=rgba(mix(col,[255,255,255],0.3),1);c.lineWidth=2;c.stroke();
  c.save();rr(c,276,800,62,80,8);c.clip();c.fillStyle=rgba(col,1);c.fillRect(276,800,62,18);c.restore();
  c.fillStyle="rgba(225,242,242,0.75)";c.fillRect(286,834,42,4);c.fillRect(286,846,30,4);c.restore();}
// a night spec's pictures: the agent films' painters, lit (ag_fig and ag_figBody are the agent films', taken over only for night specs)
const dp_fig0=ag_fig,dp_figBody0=ag_figBody;
ag_fig=function(who){const P=ag_spec(who);if(!P||!P.night)return dp_fig0(who);let F=AG_PEOPLE[P.key];if(F)return F;
  const D=Object.assign({},P.night.day,{lanyard:false}),DC=ag_colours(D),L=P.night.light;
  F=AG_PEOPLE[P.key]={P,C:ag_colours(P),night:true,head:null,bodies:{}};F.head=ag_layer(c=>dp_lit(c,cc=>ag_paintHead(cc,D,DC),L,null,cc=>{AG_F.neck(cc);AG_F.torso(cc);if(D.hair.style==="long")AG_HAIR.longBack(cc);}),DP_HEADBOX);return F;};
ag_figBody=function(F,near,far){if(!F.night)return dp_figBody0(F,near,far);const k=(near?1:0)+(far?2:0);if(F.bodies[k])return F.bodies[k];
  const P=F.P,D=Object.assign({},P.night.day,{lanyard:false}),DC=ag_colours(D),L=P.night.light,lan=!!P.night.day.lanyard;
  return F.bodies[k]=ag_layer(c=>dp_lit(c,cc=>ag_paintBody(cc,D,DC,near,far),L,lan?dp_lanyard:null),DP_BODYBOX);};

/* ===== Data protection and privacy: the agent =====
   The agent films' agent, a sphere with a band of light, drawn in glass: dark, glossy, its band lit in the colour of an identity
   (cyan: an agent is an identity, with its own badge and its owner; in the agent films the band is violet, which here means hidden
   data). The module links to AI agents in data work for what agents are and do, and never teaches its films again.
   ag_model(ctx, x, y, r, {t, a, col, halo}) draws the agent itself (the checks follow it: it is in one place at a time, and never
   two); dp_sphereIcon(ctx, x, y, r, t) draws its picture, small, on a badge or a card, which the checks don't take for the agent. */
function dp_sphere(ctx,x,y,r,o){o=o||{};const t=o.t||0,col=dp_f(o.col||"cyan"),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  if(o.halo!==false)dp_halo(ctx,x,y,r*3.2,col,0.10);
  ctx.save();let g=ctx.createRadialGradient(x-r*0.35,y-r*0.45,r*0.05,x,y,r*1.02);g.addColorStop(0,"rgb(100,146,150)");g.addColorStop(0.35,"rgb(32,64,70)");g.addColorStop(0.8,"rgb(10,26,30)");g.addColorStop(1,"rgb(6,16,20)");
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=r*0.4;ctx.shadowOffsetY=r*0.2;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();
  const rg=ctx.createRadialGradient(x+r*0.1,y+r*0.1,r*0.72,x,y,r);rg.addColorStop(0,"rgba(120,220,225,0)");rg.addColorStop(1,"rgba(150,235,240,0.5)");ctx.fillStyle=rg;ctx.fillRect(x-r,y-r,2*r,2*r);
  ctx.strokeStyle="rgba(150,220,225,0.35)";ctx.lineWidth=Math.max(1,r/58);ctx.beginPath();ctx.ellipse(x,y+r*0.09,r,r*0.28,0,0,Math.PI);ctx.stroke();
  // the band: dark glass, and in it a light that moves slowly along it
  const bw=r*1.3,bh=r*0.32,by=y-r*0.11;rr(ctx,x-bw/2,by-bh/2,bw,bh,bh/2);ctx.fillStyle="rgba(2,8,10,0.94)";ctx.fill();
  const ih=bh-r*0.11,sc=0.5+0.5*Math.sin(t*1.8*TAU/4);g=ctx.createLinearGradient(x-bw/2,0,x+bw/2,0);g.addColorStop(0,rgba(col,0.3));g.addColorStop(clamp(sc,0.01,0.99),rgba(mix(col,[255,255,255],0.55),1));g.addColorStop(1,rgba(col,0.3));
  ctx.shadowColor=rgba(col,1);ctx.shadowBlur=r*0.3;rr(ctx,x-bw/2+r*0.045,by-ih/2,bw-r*0.09,ih,ih/2);ctx.fillStyle=g;ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle="rgba(230,250,250,0.32)";ctx.beginPath();ctx.ellipse(x-r*0.42,y-r*0.56,r*0.22,r*0.09,-0.6,0,TAU);ctx.fill();ctx.restore();
  ctx.beginPath();ctx.arc(x,y,r-0.5,0,TAU);ctx.strokeStyle="rgba(170,240,240,0.5)";ctx.lineWidth=1.4;ctx.stroke();ctx.restore();}
function ag_model(ctx,x,y,r,o){dp_sphere(ctx,x,y,r,o);}
function dp_sphereIcon(ctx,x,y,r,t){dp_sphere(ctx,x,y,r,{t,halo:false});}

/* ===== Data protection and privacy: the tools' pages =====
   The tool films show Databricks, GitHub, dbt and Azure as their docs name them on the day, drawn, not filmed (the author, 5 November
   2026): a tool's page is a window of frosted glass, its header the tool's logo, unaltered, and the tool's or service's full name
   beside it, with where in the tool the page is on the right; then the page's title, and what it holds, drawn with the calls below.
   The logos come from The Inner Life of Data's logos.js (databricks, dbt) and this kit's logos.js (github, azure, entra, pim,
   managedIdentity, keyVault, storage, privateEndpoint, groups, users): a film that shows them says "logos": true in its film.json.
   The ideas films name no tool and draw none of this.
   dp_page(ctx, x, y, w, h, {tool, name, where, title, col, a, behind}) draws the window and returns the box its content goes in.
   dp_rows(ctx, x, y, cols, rows, {lh, a, line}) a table: cols [{t: "Group", w: 360}, ...], rows of cells, each a string, or {t, col}
   (words in a meaning's colour), {pill, col} (a pill), {mono: true, t} (a name as the tool writes it), {tick: "green"}, {cross: "coral"};
   returns the y under it. dp_field(ctx, x, y, label, value, {col, mono}) a label over its value. dp_switch(ctx, x, y, u, {col, label})
   a switch, from off (u 0) to on (u 1), in the colour of what it switches on. */
function dp_page(ctx,x,y,w,h,o){o=o||{};const col=o.col||"cyan",a=o.a==null?1:o.a,box={x:x+32,y:y+76+(o.title?90:28),w:w-64,h:0};box.h=y+h-box.y-24;if(a<=0)return box;
  ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col,r:18,behind:o.behind,glowA:0.8});
  const hb=76;ctx.save();rr(ctx,x,y,w,h,18);ctx.clip();ctx.fillStyle="rgba(4,16,20,0.55)";ctx.fillRect(x,y,w,hb);ctx.fillStyle=rgba(dp_f(col),0.55);ctx.fillRect(x,y+hb-1.5,w,1.5);ctx.restore();
  let lx=x+28;const im=o.tool&&typeof LOGO!=="undefined"&&LOGO[o.tool];
  if(im&&im.width){const lh=o.logoH||38,lw=lh*im.width/im.height;ctx.drawImage(im,lx,y+(hb-lh)/2,lw,lh);lx+=lw+20;}
  if(o.name)dp_T(ctx,o.name,lx,y+49,{w:700,size:30});
  if(o.where)dp_T(ctx,o.where,x+w-28,y+49,{w:600,size:28,col:"mut",align:"right"});
  if(o.title)dp_T(ctx,o.title,x+32,y+hb+58,{w:700,size:36});
  ctx.restore();return box;}
function dp_rows(ctx,x,y,cols,rows,o){o=o||{};const lh=o.lh||58,a=o.a==null?1:o.a,W_=cols.reduce((s,c)=>s+c.w,0);if(a<=0)return y+lh*(rows.length+1);
  ctx.save();ctx.globalAlpha*=a;let cx=x;for(const c of cols){if(c.t)dp_T(ctx,c.t,cx,y+30,{w:700,size:28,col:"mut"});cx+=c.w;}
  ctx.fillStyle=rgba(DP.T.mut,0.4);ctx.fillRect(x,y+lh-14,W_,1.4);
  rows.forEach((r,j)=>{const ry=y+lh*(j+1)+30;let cx2=x;r.forEach((cell,i)=>{const cw=cols[i]?cols[i].w:200,ra=cell&&cell.a!=null?cell.a:1;if(cell==null||ra<=0){cx2+=cw;return;}
      ctx.save();ctx.globalAlpha*=ra;
      if(typeof cell==="string")dp_T(ctx,cell,cx2,ry,{w:600,size:28});
      else if(cell.pill)dp_pill(ctx,cx2,ry,cell.pill,cell.col||"grey",{size:28,glow:8});
      else if(cell.tick)dp_tick(ctx,cx2+20,ry-10,cell.tick,cell.p);
      else if(cell.cross)dp_cross(ctx,cx2+20,ry-10,cell.cross,cell.p);
      else dp_T(ctx,cell.t,cx2,ry,{w:cell.w||(cell.mono?500:600),size:cell.size||28,f:cell.mono?"mono":undefined,col:cell.col||"ink"});
      ctx.restore();cx2+=cw;});
    if(o.line!==false&&j<rows.length-1){ctx.fillStyle=rgba(DP.T.mut,0.22);ctx.fillRect(x,y+lh*(j+2)-14,W_,1.2);}});
  ctx.restore();return y+lh*(rows.length+1);}
function dp_field(ctx,x,y,label,value,o){o=o||{};dp_T(ctx,label,x,y,{w:600,size:28,col:"mut",a:o.a});dp_T(ctx,value,x,y+44,{w:o.mono?500:700,size:30,f:o.mono?"mono":undefined,col:o.col||"ink",a:o.a});}
function dp_switch(ctx,x,y,u,o){o=o||{};u=clamp(u||0,0,1);const c=dp_f(o.col||"amber"),off=[40,62,68],tc=mix(off,c,u),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();if(u>0.02){ctx.shadowColor=rgba(c,0.6*u);ctx.shadowBlur=14;}rr(ctx,x,y,72,40,20);ctx.fillStyle=rgba(tc,1);ctx.fill();ctx.restore();
  rr(ctx,x+0.6,y+0.6,70.8,38.8,19.4);ctx.strokeStyle=rgba(mix(tc,[255,255,255],0.4),0.9);ctx.lineWidth=1.2;ctx.stroke();
  const kx=x+20+32*ag_sine(u);ctx.fillStyle=u>0.5?rgba(DP.on,1):"rgb(196,214,215)";ctx.beginPath();ctx.arc(kx,y+20,14,0,TAU);ctx.fill();
  if(o.label)dp_T(ctx,o.label,x+92,y+30,{w:600,size:28,col:o.labelCol||"ink"});ctx.restore();}

/* ===== An agreement first: the papers =====
   The film's own pieces, on the kit's glass (films/locks-before-the-data/shared/src/glass.js): papers of frosted glass with a folded
   corner, set down line by line, each line a label and its words, with lines to sign on and the gold chip that says a signed paper is
   genuine; the agreement's contract; the registers Yusuf keeps; a group's badge; the study's own space on the platform; the totals that
   may leave. Every word at least 28 px and in ice white or a meaning's colour on frosted glass; the papers' rims are ice (a paper is
   neither allowed nor denied), and only their lines take a meaning's colour: green what the study may have, violet what it never gets,
   coral what's closed. Prefixed af_. */

const AF_ICE=[190,245,245];
/* ---------------------------------------------------------------- a pane of frosted glass with a folded corner
   As the kit's dp_panel, but its top right corner folded down: the place behind it frosted, a dark film and a faint tint, light along
   its top edge, a rim; the fold a small triangle of lighter glass. */
function af_foldPath(c,x,y,w,h,r,f){c.moveTo(x+r,y);c.lineTo(x+w-f,y);c.lineTo(x+w,y+f);c.lineTo(x+w,y+h-r);c.arcTo(x+w,y+h,x+w-r,y+h,r);c.lineTo(x+r,y+h);c.arcTo(x,y+h,x,y+h-r,r);
  c.lineTo(x,y+r);c.arcTo(x,y,x+r,y,r);c.closePath();}
function af_panelFold(ctx,x,y,w,h,o){o=o||{};const col=o.col?dp_f(o.col):AF_ICE,r=18,f=o.fold==null?48:o.fold,a=o.a==null?1:o.a;if(!(a>0.003))return;
  ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(col,0.26);ctx.shadowBlur=44;ctx.beginPath();af_foldPath(ctx,x,y,w,h,r,f);ctx.fillStyle="rgba(6,20,26,0.74)";ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();af_foldPath(ctx,x,y,w,h,r,f);ctx.clip();dp_behind(ctx,o.behind);ctx.fillStyle="rgba(6,20,26,0.3)";ctx.fillRect(x,y,w,h);
  let g=ctx.createLinearGradient(x,y,x+w*0.4,y+h);g.addColorStop(0,"rgba(160,220,225,0.15)");g.addColorStop(1,"rgba(160,220,225,0.05)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  g=ctx.createLinearGradient(0,y,0,y+70);g.addColorStop(0,"rgba(225,250,250,0.14)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(x,y,w,70);ctx.restore();
  g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(mix(col,[255,255,255],0.45),1));g.addColorStop(0.5,rgba(col,0.75));g.addColorStop(1,rgba(col,0.95));
  ctx.beginPath();af_foldPath(ctx,x+1,y+1,w-2,h-2,r,f);ctx.strokeStyle=g;ctx.lineWidth=2.2;ctx.stroke();
  // the fold: the corner turned down, lighter glass, its crease catching the light
  ctx.beginPath();ctx.moveTo(x+w-f,y);ctx.lineTo(x+w-f+4,y+f-4);ctx.lineTo(x+w,y+f);ctx.closePath();ctx.fillStyle="rgba(200,240,240,0.30)";ctx.fill();
  ctx.strokeStyle=rgba(mix(col,[255,255,255],0.5),0.9);ctx.lineWidth=1.6;ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- a paper: a title, lines of a label and its words, places to sign
   af_paper(ctx, x, y, w, {kick, title, sub, rows: [{label, text, col, a, strike, glow, lines}], foot}, {a, k, behind, measure,
   labelW}): the rows' words wrap within the paper; each row comes in by its own a (0 to 1), rising a little; col colours its words
   (a meaning: "allowed", "hidden"); strike (0 to 1) draws a violet line through them; glow (0 to 1) lights the row. foot(ctx, x, y, w)
   draws what goes under the rows (signatures) and returns its height. Returns the paper's box, and each row's box (rows). */
const AF_PAD=36,AF_LH=40,AF_ROWGAP=16;
function af_paper(ctx,x,y,w,P,o){o=o||{};const lw=o.labelW||210,tw=w-2*AF_PAD-lw,F={w:600,size:28},rows=(P.rows||[]).map(r=>({r,lines:r.lines||ag_wrap(ctx,r.text,tw,F)}));
  // where everything goes, from the top
  let yy=y+AF_PAD;const L=[];
  if(P.kick){yy+=22;L.push(["kick",yy]);}
  if(P.title){yy+=P.kick?52:30;L.push(["title",yy]);}
  if(P.sub){yy+=40;L.push(["sub",yy]);}
  yy+=30;const top=yy;const RB=[];
  rows.forEach((q,i)=>{const h=q.lines.length*AF_LH;RB.push({x,y:yy,w,h:h+AF_ROWGAP,base:yy+30,lines:q.lines,r:q.r});yy+=h+AF_ROWGAP;});
  const footH=P.footH||0;const h=Math.round(yy-y+footH+AF_PAD-6),bb={x,y,w,h,rows:RB,footY:yy};if(o.measure)return bb;
  const a=o.a==null?1:o.a;if(!(a>0.003))return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  af_panelFold(ctx,x,y,w,h,{behind:o.behind,col:o.col});
  for(const [k,by] of L){if(k==="kick"){dp_T(ctx,String(P.kick).toUpperCase(),x+AF_PAD,by,{w:800,size:28,ls:4,col:P.kickCol||"cyan"});
      if(o.date&&o.dateA>0)dp_T(ctx,o.date,x+w-AF_PAD-56,by,{w:600,size:28,align:"right",col:"mut",a:o.dateA});}
    else if(k==="title")dp_T(ctx,P.title,x+AF_PAD,by,{w:800,size:40});else dp_T(ctx,P.sub,x+AF_PAD,by,{w:600,size:28,col:"mut"});}
  if(rows.length){ctx.save();ctx.fillStyle="rgba(190,245,245,0.16)";ctx.fillRect(x+AF_PAD,top-14,w-2*AF_PAD,1.6);ctx.restore();}
  RB.forEach(b=>{const r=b.r,ra=r.a==null?1:r.a;if(!(ra>0.003))return;ctx.save();ctx.globalAlpha*=ra;const dy=(1-ag_eo(ra))*10;
    if(r.glow>0){ctx.save();ctx.globalAlpha*=r.glow;ctx.fillStyle=rgba(dp_f(r.glowCol||"cyan"),0.16);rr(ctx,x+12,b.y-6,w-24,b.h-4,12);ctx.fill();ctx.fillStyle=rgba(dp_f(r.glowCol||"cyan"),1);rr(ctx,x+12,b.y-6,5,b.h-4,2.5);ctx.fill();ctx.restore();}
    dp_T(ctx,r.label,x+AF_PAD,b.base+dy,{w:700,size:28,col:r.labelCol||"mut"});
    b.lines.forEach((l,i)=>dp_T(ctx,l,x+AF_PAD+lw,b.base+dy+i*AF_LH,{w:600,size:28,col:r.col||"ink"}));
    if(r.strike>0){const c=dp_f(r.strikeCol||"violet");ctx.save();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=6;
      b.lines.forEach((l,i)=>{const lwid=dp_tw(ctx,l,F),yy2=b.base+dy+i*AF_LH-9,u=clamp(r.strike*b.lines.length-i,0,1);if(u<=0)return;ctx.beginPath();ctx.moveTo(x+AF_PAD+lw-4,yy2);ctx.lineTo(x+AF_PAD+lw-4+(lwid+8)*ag_sine(u),yy2);ctx.stroke();});ctx.restore();}
    ctx.restore();});
  if(P.foot)P.foot(ctx,x,yy,w);
  ctx.restore();return bb;}
// a signature: a line to sign on, and a hand's loops written along it (u 0 to 1), in ice: a run of loops (a trochoid, its loops
// growing and shrinking), rising a little, and a stroke back under it at the end; seed makes each person's hand their own
function af_signature(ctx,x,y,w,u,seed){seed=seed||0;ctx.save();ctx.fillStyle="rgba(190,245,245,0.4)";ctx.fillRect(x,y+6,w,1.6);
  if(u>0){ctx.beginPath();ctx.rect(x-4,y-56,w*clamp(u,0,1)+8,76);ctx.clip();ctx.strokeStyle=rgba(DP.T.ink,1);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.shadowColor="rgba(190,245,245,0.6)";ctx.shadowBlur=6;const L=w*0.78,T=TAU*(4.6+(seed*1.7)%2),a=L/T,n=220;ctx.beginPath();
    for(let i=0;i<=n;i++){const v=i/n,th=v*T,b=a*(1.5+0.7*Math.sin(v*TAU*1.3+seed*2.1))*(v<0.08?v/0.08:1),xx=x+10+a*th-b*Math.sin(th),yy=y-16-v*8-b*Math.cos(th)*0.9;
      i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}
    ctx.moveTo(x+10+L+8,y-14);ctx.quadraticCurveTo(x+w*0.55,y+2,x+16,y-6);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the confidentiality agreement, each person's own
   Six lines in the signer's voice, as numbers.md has them, and a line to sign; show(i) brings in line i (0 to 5); sign (0 to 1) writes
   the signature; who names the signer under it; chip (0 to 1) the gold chip */
const AF_PROMISE=["I keep what I see to myself","I use it only for the work it's given for","I keep no copy where it isn't allowed","I answer for the data I'm given",
  "I report anything that goes wrong, at once","It holds after I leave"];
function af_promise(ctx,x,y,w,o){o=o||{};const show=o.show||(()=>1),glow=o.glow||(()=>0),sg=o.sign||0;
  return af_paper(ctx,x,y,w,{kick:o.kick===undefined?"Each person's own":o.kick,title:"Confidentiality agreement",
    rows:AF_PROMISE.map((t,i)=>({label:String(i+1),text:t,a:show(i),glow:glow(i),labelCol:"cyan"})),footH:o.who?112:0,
    foot:o.who?(c,x0,y0,ww)=>{const fa=o.footA==null?1:o.footA;if(!(fa>0.003))return;c.save();c.globalAlpha*=fa;af_signature(c,x0+AF_PAD,y0+38,420,sg,o.seed||0);
      dp_T(c,o.who,x0+AF_PAD,y0+86,{w:600,size:28,col:"mut"});const ch=o.chip||0;if(ch>0){c.save();c.globalAlpha*=ch;dp_chip(c,x0+ww-AF_PAD-72,y0+18);c.restore();}c.restore();}:null},
    {a:o.a,k:o.k,behind:o.behind,measure:o.measure,labelW:58});}

/* ---------------------------------------------------------------- the data sharing agreement, 2026-14, word for word (numbers.md)
   show(k) brings in each line by its key; hi(k) lights it; may (0 to 1) turns what it may have green; never (0 to 1) turns what it
   never gets violet (hidden); signs {mei, anil, chip, a} write the signatures (0 to 1) and set the gold chip; date (dateA 0 to 1) the
   day it was signed, on the kick's row */
const AF_AGREE=[["purpose","Purpose","How learners in the Faculty of Health progress, and where they need support"],
  ["from","From","The registrar's learner records: 2,614 learners"],
  ["may","May have","Each learner's course and results; their year of birth; a code in place of who they are"],
  ["never","Never","Anything that names a learner; anything about their health"],
  ["who","Who","The study's group, “Health progress study”, each member with a signed confidentiality agreement"],
  ["where","Where","On the platform, in the study's own space; nothing downloaded"],
  ["leave","May leave","Totals, with any count under 10 hidden"],
  ["ends","Ends","30 June 2027; then the study's copy is deleted, and the totals stay"]];
function af_agreement(ctx,x,y,w,o){o=o||{};const show=o.show||(()=>1),hi=o.hi||(()=>0),S=o.signs||null;
  return af_paper(ctx,x,y,w,{kick:"Data sharing agreement",title:"2026-14 · For a study in the Faculty of Health",
    rows:AF_AGREE.map(([k,l,t])=>({label:l,text:t,a:show(k),glow:hi(k),col:k==="may"&&o.may>0?mix(DP.T.ink,DP.T.green,o.may):k==="never"&&o.never>0?mix(DP.T.ink,DP.T.violet,o.never):null,
      labelCol:k==="may"&&o.may>0?"green":k==="never"&&o.never>0?"violet":"mut"})),footH:S?120:0,
    foot:S?(c,x0,y0,ww)=>{const fa=S.a==null?1:S.a;if(!(fa>0.003))return;c.save();c.globalAlpha*=fa;const cx=x0+AF_PAD,half=(ww-2*AF_PAD-120)/2;
      af_signature(c,cx,y0+40,half-40,S.mei||0,1.3);af_signature(c,cx+half,y0+40,half-40,S.anil||0,2.1);
      withA(c,ag_in(S.mei||0,0.3,0.5),()=>{dp_T(c,"Mei Tanaka · for the registrar's office",cx,y0+88,{w:600,size:28,col:"mut"});});
      withA(c,ag_in(S.anil||0,0.3,0.5),()=>{dp_T(c,"Anil Kurian · for the study",cx+half,y0+88,{w:600,size:28,col:"mut"});});
      if(S.chip>0){c.save();c.globalAlpha*=S.chip;dp_chip(c,x0+ww-AF_PAD-72,y0+26);c.restore();}c.restore();}:null},
    {a:o.a,k:o.k,behind:o.behind,measure:o.measure,labelW:200,date:o.date,dateA:o.dateA});}

/* ---------------------------------------------------------------- the agreement's contract: its terms where the platform reads them */
function af_contract(ctx,x,y,w,o){o=o||{};const show=o.show||(()=>1),hi=o.hi||(()=>0);
  return af_paper(ctx,x,y,w,{kick:"Contract · 2026-14",kickCol:"cyan",rows:[{label:"Columns",text:"course · results · year of birth · learner code",lines:["course · results ·","year of birth · learner code"],a:show(0),glow:hi(0)},
    {label:"Group",text:"Health progress study",a:show(1),glow:hi(1)},{label:"Until",text:"30 June 2027",a:show(2),glow:hi(2),col:o.ended?"coral":null}]},
    {a:o.a,k:o.k,behind:o.behind,measure:o.measure,labelW:160,col:"cyan"});}

/* ---------------------------------------------------------------- a register: a book of frosted glass, open, its rows
   af_register(ctx, x, y, w, {title, rows: [[text, {col, a, frost, tick, tickCol, note}]], a, open}): the book's two pages, its title on
   the left page; each row a line of its own on the right page; frost hides a row's words under violet (another person's), tick (0 to 1)
   draws a tick in tickCol, note a pill beside it */
function af_register(ctx,x,y,w,o){o=o||{};const h=o.h||420,a=o.a==null?1:o.a;if(!(a>0.003))return;const op=o.open==null?1:o.open;ctx.save();ctx.globalAlpha*=a;
  const mid=x+w*0.36;
  // the covers' edge and the pages: the left one narrower, the right one wider, both frosted
  dp_panel(ctx,x,y,w,h,{col:AF_ICE,r:18,behind:o.behind,glowR:40});
  ctx.save();ctx.strokeStyle="rgba(190,245,245,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mid,y+14);ctx.lineTo(mid,y+h-14);ctx.stroke();
  const sg=ctx.createLinearGradient(mid-30,0,mid+30,0);sg.addColorStop(0,"rgba(0,0,0,0)");sg.addColorStop(0.5,"rgba(0,0,0,0.25)");sg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sg;ctx.fillRect(mid-30,y+4,60,h-8);ctx.restore();
  dp_T(ctx,String(o.kick||"Register").toUpperCase(),x+34,y+70,{w:800,size:28,ls:4,col:"cyan"});
  ag_wrap(ctx,o.title||"",mid-x-60,{w:800,size:36}).forEach((l,i)=>dp_T(ctx,l,x+34,y+124+i*46,{w:800,size:36}));
  if(o.keeper){const kl=ag_wrap(ctx,o.keeper,mid-x-60,{w:600,size:28});kl.forEach((l,i)=>dp_T(ctx,l,x+34,y+h-40-(kl.length-1-i)*38,{w:600,size:28,col:"mut"}));}
  const rx=mid+34,rw=x+w-34-rx;let ry=y+64;
  (o.rows||[]).forEach(([text,q])=>{q=q||{};const ra=(q.a==null?1:q.a)*op;if(q.ghost){ctx.save();ctx.globalAlpha*=ra;ctx.fillStyle="rgba(190,245,245,0.16)";rr(ctx,rx,ry-20,rw*0.8,10,5);ctx.fill();rr(ctx,rx,ry,rw*0.55,10,5);ctx.fill();ctx.restore();ry+=46;return;}
    if(ra<=0.003){ry+=q.h||58;return;}ctx.save();ctx.globalAlpha*=ra;
    const lines=ag_wrap(ctx,text,rw-(q.tick!=null?60:0),{w:600,size:28}),rh=lines.length*38+20;
    if(q.frost){dp_frost(ctx,rx-10,ry-30,rw+10,rh-6,c=>{lines.forEach((l,i)=>ag_T(c,l,rx,ry+i*38,{w:600,size:28,col:[240,240,250],deco:1}));},{behind:o.behind});}
    else lines.forEach((l,i)=>dp_T(ctx,l,rx,ry+i*38,{w:600,size:28,col:q.col||"ink"}));
    if(q.tick!=null&&q.tick>0)dp_tick(ctx,x+w-56,ry-10+(lines.length-1)*19,q.tickCol||"green",q.tick);
    if(q.note)dp_T(ctx,q.note,rx,ry+lines.length*38+4,{w:700,size:28,col:q.noteCol||"grey",a:q.noteA==null?1:q.noteA});
    if(q.glow>0){ctx.save();ctx.globalAlpha*=q.glow;ctx.fillStyle=rgba(dp_f(q.glowCol||"cyan"),0.14);rr(ctx,rx-16,ry-36,rw+22,rh,10);ctx.fill();ctx.restore();}
    ctx.restore();ry+=rh+10+(q.note?42:0);});
  ctx.restore();}

/* ---------------------------------------------------------------- a register as a table: what was agreed, by whom, until when
   af_ledger(ctx, x, y, w, {h, kick, title, head: [[label, dx]], ghosts, rows: [{cells, col, a, glow, pill, pillCol, pillA}], a, behind}):
   its title, a row of headings, older entries as frosted bars that can't be read (ghosts), then the rows, each cell under its heading;
   pill (a closed entry's coral pill) sits at the row's right end, under it */
function af_ledger(ctx,x,y,w,o){o=o||{};const h=o.h||480,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:AF_ICE,r:18,behind:o.behind,glowR:40});
  dp_T(ctx,String(o.kick||"Register").toUpperCase(),x+34,y+66,{w:800,size:28,ls:4,col:"cyan"});
  dp_T(ctx,o.title||"",x+34,y+118,{w:900,size:36});
  const H=o.head||[],hy=y+190;H.forEach(([s,dx])=>dp_T(ctx,s,x+34+dx,hy,{w:500,size:28,col:"mut"}));
  ctx.save();ctx.fillStyle="rgba(190,245,245,0.22)";ctx.fillRect(x+34,hy+22,w-68,1.6);ctx.restore();
  let ry=hy+80;
  for(let g=0;g<(o.ghosts||0);g++){ctx.save();ctx.fillStyle="rgba(190,245,245,0.13)";H.forEach(([s,dx],k)=>{rr(ctx,x+34+dx,ry-18,[300,250,150][k%3]-g*30,12,6);ctx.fill();});ctx.restore();ry+=54;}
  (o.rows||[]).forEach(r=>{const ra=r.a==null?1:r.a;if(ra>0.003){ctx.save();ctx.globalAlpha*=ra;
    if(r.glow>0){ctx.save();ctx.globalAlpha*=r.glow;ctx.fillStyle=rgba(dp_f(r.glowCol||"cyan"),0.16);rr(ctx,x+16,ry-42,w-32,62,12);ctx.fill();ctx.fillStyle=rgba(dp_f(r.glowCol||"cyan"),1);rr(ctx,x+16,ry-42,5,62,2.5);ctx.fill();ctx.restore();}
    r.cells.forEach((s,k)=>dp_T(ctx,s,x+34+H[k][1],ry,{w:600,size:28,col:r.col||"ink"}));
    if(r.pill)dp_pill(ctx,x+w-34,ry+62,r.pill,r.pillCol||"coral",{align:"right",a:r.pillA==null?1:r.pillA});
    ctx.restore();}ry+=64;});
  ctx.restore();}

/* ---------------------------------------------------------------- a group's badge, and the people in it
   af_group(ctx, x, y, w, {title, members: [{name, state, a}], a, behind}): a cyan band "Group" (who it lets in is an identity), its
   name, and a row for each member: a person's picture, the name, and a pill for the state of their confidentiality agreement: "signed"
   (green, "Signed · current"), "renew" (frosted, "Renew by February"), "lapsed" (coral, "Lapsed"), with paused (0 to 1) greying the
   member, "Paused" */
function af_group(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return null;const M=o.members||[],h=128+M.length*104;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,behind:o.behind});dp_band(ctx,x,y,w,58,22,"cyan","Group");
  dp_T(ctx,o.title||"",x+30,y+108,{w:800,size:36});
  M.forEach((m,i)=>{const my=y+150+i*104,ma=m.a==null?1:m.a;if(!(ma>0.003))return;ctx.save();ctx.globalAlpha*=ma;const p=clamp(m.paused||0,0,1);
    ctx.save();ctx.globalAlpha*=1-0.55*p;ctx.save();ctx.beginPath();ctx.arc(x+62,my+38,34,0,TAU);ctx.fillStyle="rgba(6,26,32,0.9)";ctx.fill();ctx.clip();
    ctx.translate(x+62,my+38);ctx.scale(0.55,0.55);dp_personPic(ctx,0,0,p>0.5?"grey":"cyan");ctx.restore();
    ctx.beginPath();ctx.arc(x+62,my+38,34,0,TAU);ctx.strokeStyle=rgba(dp_f(p>0.5?"grey":"cyan"),0.9);ctx.lineWidth=2;ctx.stroke();
    dp_T(ctx,m.name,x+116,my+48,{w:700,size:30,col:p>0.5?"grey":"ink"});ctx.restore();
    if(p>0.003)dp_T(ctx,"Paused",x+116+dp_tw(ctx,m.name,{w:700,size:30})+18,my+48,{w:700,size:28,col:"grey",a:ag_in(p,0.3,0.7)});
    const st=m.state||"signed",txt=st==="renew"?"Renew by February":st==="lapsed"?"Lapsed":st==="paused"?"Paused":"Signed · current",pa=m.pillA==null?1:m.pillA;
    // a date coming up means nothing yet: frosted glass and ice words; lapsed is closed (coral), signed and current allowed (green)
    if(st==="renew"){const pw=dp_tw(ctx,txt,{w:700,size:28})+36;if(pa>0.003){ctx.save();ctx.globalAlpha*=pa;dp_panel(ctx,x+w-30-pw,my+50-36,pw,48,{col:AF_ICE,r:24,glowR:16,behind:o.behind});dp_T(ctx,txt,x+w-30-pw+18,my+50,{w:700,size:28});ctx.restore();}}
    else dp_pill(ctx,x+w-30,my+50,txt,st==="lapsed"||st==="paused"?"coral":"green",{align:"right",a:pa});
    ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the totals that may leave, published */
const AF_TOTALS=[["Nursing","38"],["Midwifery","fewer than 10","hidden"],["Public health","21"],["Health sciences","hidden","hidden"],["Faculty of Health","80"]];
function af_totals(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return null;const h=118+AF_TOTALS.length*46+20;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"grey",r:22,behind:o.behind});
  dp_T(ctx,"TOTALS · PUBLIC",x+30,y+52,{w:800,size:28,ls:4,col:"grey"});dp_T(ctx,"Left after first year · by course",x+30,y+98,{w:700,size:32});
  AF_TOTALS.forEach(([c,n,k],i)=>{const yy=y+152+i*46;dp_T(ctx,c,x+30,yy,{w:600,size:28,col:i===AF_TOTALS.length-1?"ink":"mut"});
    dp_T(ctx,n,x+w-30,yy,{w:700,size:28,align:"right",col:k||"ink"});});
  ctx.restore();return{x,y,w,h};}

/* ===== An agreement first: the past, Bletchley Park, 1939 to 1945 =====
   The opening story, painted in the module's light (Night glass): Bletchley Park at night in wartime, its house a dark outline and its
   huts blacked out but for a line of warm light; a hut's desk under a lamp, where a recruit signs the Official Secrets Act before she is
   told anything; a sea chart on frosted glass, where a convoy is steered round the submarines; a commander's desk, where an officer
   waits while a message is read, then takes it back. Nothing violent is shown: ships and submarines are shapes on a chart, and nothing
   sinks. The film's own pictures, prefixed af_; the kit (films/locks-before-the-data/shared/) is used as it is.
   Places, each painted once: afPark (the park at night), afHut (inside a hut), afSea (the chart), afDesk (the commander's room). */

/* ---------------------------------------------------------------- the people of the story, lit by a lamp at night
   A recruit of 1940 in a wool coat, her hair rolled; an officer of 1943 in the air force's blue-grey, bare-headed indoors; a commander
   of 1943 in khaki. Each is drawn as the agent films draw people, one three-quarter head, arms down, a hand only on what the story is
   about: the recruit's on the pen, the officer's and the commander's on the sheet. */
// a coat's two rows of buttons, below the opening (figure space, over the body)
function af_coat(btn){return c=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  for(const [x0,k] of [[300,0],[352,1]])for(let i=0;i<3;i++){const y=902+i*62,x=x0+(y-880)*0.03;c.fillStyle=rgba(btn,1);c.beginPath();c.arc(x,y,6.5,0,TAU);c.fill();
    c.fillStyle="rgba(255,255,255,0.28)";c.beginPath();c.arc(x+1.6,y-1.8,2.2,0,TAU);c.fill();}
  c.restore();};}
// a jacket's buttons, one row down the middle, and two breast pockets' flaps
function af_tunic(btn){return c=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  for(let i=0;i<3;i++){const y=918+i*64,x=330+(y-880)*0.02;c.fillStyle=rgba(btn,1);c.beginPath();c.arc(x,y,6,0,TAU);c.fill();
    c.fillStyle="rgba(255,255,255,0.3)";c.beginPath();c.arc(x+1.5,y-1.6,2,0,TAU);c.fill();}
  c.strokeStyle="rgba(0,0,0,0.22)";c.lineWidth=3;for(const [x,w] of [[176,92],[372,40]]){c.beginPath();c.moveTo(x,742);c.lineTo(x+w,736);c.stroke();}
  c.restore();};}
const AF_P={
  recruit:{key:"af_recruit",name:"a recruit of 1940",skin:[236,204,178],hair:{style:"bob",c:[98,66,44]},
    top:{kind:"blazer",c:[110,84,70],inner:[226,216,200],paint:af_coat([158,128,96])},breath:0.31},
  officer:{key:"af_officer",name:"an officer of 1943",skin:[226,188,158],hair:{style:"side",c:[72,54,40]},
    top:{kind:"suit",c:[84,98,124],inner:[192,206,224],tie:[30,32,40],paint:af_tunic([200,172,104])},breath:0.27},
  commander:{key:"af_commander",name:"a commander of 1943",skin:[220,180,150],hair:{style:"cropped",c:[176,174,168]},
    top:{kind:"suit",c:[116,102,70],inner:[172,158,118],tie:[90,76,50],paint:af_tunic([190,162,96])},breath:0.23}
};

/* ---------------------------------------------------------------- shared bits of light */
// a warm glow, kept once and drawn where a lamp or a window's edge shines
function af_glowSprite(){return ag_kept("af_glow",128,128,(c,w,h)=>{const g=c.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,"rgba(255,214,150,0.9)");g.addColorStop(0.25,"rgba(255,190,110,0.42)");g.addColorStop(1,"rgba(255,170,90,0)");c.fillStyle=g;c.fillRect(0,0,w,h);});}
function af_glow(ctx,x,y,rx,ry,a){if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;ctx.globalCompositeOperation="lighter";ctx.drawImage(af_glowSprite(),x-rx,y-ry,2*rx,2*ry);ctx.restore();}
const AF_WARM=[255,206,138];

/* ---------------------------------------------------------------- the park at night
   The house (a dark outline with a dome, gables and tall chimneys), trees, the lawn and its paths under a petrol sky with a low moon. The
   huts are drawn live (af_huts), row by row, so they can come up as the years pass; their windows' lines of light are drawn live too. */
const AF_HOUSE={y:652};
function af_houseShape(c){const b=AF_HOUSE.y;
  c.moveTo(540,b);c.lineTo(540,528);c.lineTo(566,528);c.lineTo(612,470);c.lineTo(658,528);c.lineTo(700,528);
  c.lineTo(700,466);c.lineTo(712,452);c.lineTo(712,440);c.bezierCurveTo(712,398,736,376,746,370);c.lineTo(746,350);c.lineTo(750,350);c.lineTo(750,370);
  c.bezierCurveTo(760,376,786,398,786,440);c.lineTo(786,452);c.lineTo(798,466);c.lineTo(798,500);
  c.lineTo(818,500);c.lineTo(818,446);c.lineTo(842,446);c.lineTo(842,500);c.lineTo(944,500);c.lineTo(944,436);c.lineTo(968,436);c.lineTo(968,500);c.lineTo(1006,500);
  c.lineTo(1006,522);c.lineTo(1044,456);c.lineTo(1082,522);c.lineTo(1100,522);c.lineTo(1138,468);c.lineTo(1176,522);
  c.lineTo(1176,430);c.lineTo(1198,430);c.lineTo(1198,560);c.lineTo(1320,560);c.lineTo(1320,b);c.closePath();}
// the porch, a little nearer than the house
function af_porchShape(c){const b=AF_HOUSE.y;c.moveTo(856,b);c.lineTo(856,580);c.bezierCurveTo(870,556,918,556,932,580);c.lineTo(932,b);c.closePath();}
// tree crowns along the horizon, behind the house: soft round tops [x, y, rx, ry]; their outline is the highest crown at each x
const AF_TREES=[[60,640,120,92],[190,628,110,96],[330,632,120,84],[460,640,96,70],[1300,640,90,66],[1430,624,120,96],[1580,636,110,82],[1720,626,120,96],[1860,640,110,84]];
function af_treeTop(x){let y=AF_HOUSE.y+4;for(const [cx,cy,rx,ry] of AF_TREES){const u=(x-cx)/rx;if(u>-1&&u<1)y=Math.min(y,cy-ry*Math.sqrt(1-u*u));}return y;}
function af_treeRow(c,top){const b=AF_HOUSE.y+4;c.moveTo(-10,b);for(let x=-10;x<=1930;x+=6)c.lineTo(x,af_treeTop(x));if(!top){c.lineTo(1930,b);c.closePath();}}
// a tall conifer, nearer us: tiers that droop, narrowing to the top, its right edges catching the moon (x, y its foot, h its height)
function af_conifer(c,x,y,h,col){const n=9,ice=DP.ice;for(let i=0;i<n;i++){const u=i/(n-1),ty=y-h+u*h*0.92,w=h*(0.05+0.2*u),d=h*0.11;
    c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(x,ty-d*0.6);c.bezierCurveTo(x+w*0.35,ty,x+w*0.8,ty+d*0.55,x+w,ty+d);c.bezierCurveTo(x+w*0.5,ty+d*0.82,x-w*0.5,ty+d*0.82,x-w,ty+d);
    c.bezierCurveTo(x-w*0.8,ty+d*0.55,x-w*0.35,ty,x,ty-d*0.6);c.closePath();c.fill();
    c.strokeStyle=rgba(ice,0.07+0.03*u);c.lineWidth=1.4;c.beginPath();c.moveTo(x+w*0.1,ty-d*0.3);c.bezierCurveTo(x+w*0.4,ty+d*0.05,x+w*0.8,ty+d*0.55,x+w,ty+d);c.stroke();}
  c.fillStyle=rgba(col,1);c.fillRect(x-h*0.012,y-h*0.1,h*0.024,h*0.1);}
AG_PLACES.afPark=c=>{const R=ag_rnd(1939),hz=AF_HOUSE.y,ice=DP.ice;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(4,13,18)");g.addColorStop(0.62,"rgb(9,28,34)");g.addColorStop(1,"rgb(18,48,54)");c.fillStyle=g;c.fillRect(0,0,W,hz+20);
  // the stars of a blacked-out night, and a low moon on the right, haloed
  for(let i=0;i<120;i++){const x=R()*W,y=R()*hz*0.8,r=0.5+R()*1.4;c.fillStyle="rgba(210,240,240,"+(0.08+R()*0.32).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  const mx=1580,my=176;g=c.createRadialGradient(mx,my,0,mx,my,320);g.addColorStop(0,"rgba(170,226,230,0.20)");g.addColorStop(1,"rgba(170,226,230,0)");c.fillStyle=g;c.fillRect(mx-320,my-320,640,640);
  const mc=mkCanvas(80,80),mk2=mc.getContext("2d");mk2.fillStyle="rgb(214,236,232)";mk2.beginPath();mk2.arc(40,40,30,0,TAU);mk2.fill();
  mk2.globalCompositeOperation="destination-out";mk2.beginPath();mk2.arc(28,35,28,0,TAU);mk2.fill();c.drawImage(mc,mx-40,my-40);
  // haze along the horizon
  g=c.createLinearGradient(0,hz-160,0,hz+20);g.addColorStop(0,"rgba(90,170,178,0)");g.addColorStop(1,"rgba(90,170,178,0.10)");c.fillStyle=g;c.fillRect(0,hz-160,W,180);
  // the lawn, its paths running up to the house, and its gloss under the moon
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgb(14,38,38)");g.addColorStop(1,"rgb(5,17,19)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  c.save();c.fillStyle="rgba(120,190,190,0.06)";c.beginPath();c.moveTo(860,hz+6);c.bezierCurveTo(880,760,780,880,640,H);c.lineTo(980,H);c.bezierCurveTo(1000,880,940,760,930,hz+6);c.closePath();c.fill();
  c.beginPath();c.moveTo(0,800);c.bezierCurveTo(500,770,700,742,880,724);c.lineTo(900,736);c.bezierCurveTo(700,760,480,800,0,846);c.closePath();c.fill();
  c.beginPath();c.moveTo(W,780);c.bezierCurveTo(1500,752,1200,736,930,722);c.lineTo(920,734);c.bezierCurveTo(1200,752,1480,790,W,830);c.closePath();c.fill();c.restore();
  g=c.createRadialGradient(1500,760,0,1500,760,700);g.addColorStop(0,"rgba(150,215,215,0.07)");g.addColorStop(1,"rgba(150,215,215,0)");c.save();c.translate(1500,760);c.scale(1,0.3);c.translate(-1500,-760);c.fillStyle=g;c.fillRect(800,60,1400,1400);c.restore();
  // trees behind the house, then the house: a dark outline, its edges catching the moon
  c.fillStyle="rgb(7,22,25)";c.beginPath();af_treeRow(c);c.fill();c.strokeStyle=rgba(ice,0.09);c.lineWidth=1.6;c.beginPath();af_treeRow(c,true);c.stroke();
  c.fillStyle="rgb(6,17,20)";c.beginPath();af_houseShape(c);c.fill();
  c.save();c.beginPath();af_houseShape(c);c.clip();
  // windows, blacked out: a little darker than the wall, their frames faint in the moonlight
  for(const [x0,x1,y0,n,rows] of [[556,690,560,3,2],[808,1000,530,4,3],[1012,1170,550,3,2],[1210,1310,586,2,1]])
    for(let r=0;r<rows;r++)for(let i=0;i<n;i++){const ww=(x1-x0)/n*0.42,x=x0+(i+0.5)*(x1-x0)/n-ww/2,y=y0+r*44;c.fillStyle="rgb(3,10,12)";c.fillRect(x,y,ww,28);c.strokeStyle=rgba(ice,0.06);c.lineWidth=1.2;c.strokeRect(x,y,ww,28);}
  const hg=c.createLinearGradient(1320,0,540,0);hg.addColorStop(0,"rgba(150,220,225,0.07)");hg.addColorStop(1,"rgba(150,220,225,0)");c.fillStyle=hg;c.fillRect(540,340,780,320);c.restore();
  c.strokeStyle=rgba(ice,0.26);c.lineWidth=1.6;c.beginPath();af_houseShape(c);c.stroke();
  // the dome's copper, a faint sheen on the side the moon lights
  c.save();c.beginPath();c.moveTo(712,440);c.bezierCurveTo(712,398,736,376,748,370);c.bezierCurveTo(760,376,786,398,786,440);c.closePath();c.clip();
  g=c.createRadialGradient(772,396,2,760,420,52);g.addColorStop(0,"rgba(120,190,170,0.34)");g.addColorStop(1,"rgba(120,190,170,0)");c.fillStyle=g;c.fillRect(700,360,100,90);c.restore();
  c.fillStyle="rgb(6,17,20)";c.beginPath();af_porchShape(c);c.fill();c.strokeStyle=rgba(ice,0.2);c.lineWidth=1.4;c.beginPath();af_porchShape(c);c.stroke();
  // two tall conifers at the edges, nearer us
  af_conifer(c,64,930,470,[5,15,17]);af_conifer(c,1864,920,440,[5,15,17]);
  // the dark of the near lawn
  g=c.createLinearGradient(0,880,0,H);g.addColorStop(0,"rgba(2,8,10,0)");g.addColorStop(1,"rgba(2,8,10,0.55)");c.fillStyle=g;c.fillRect(0,880,W,H-880);};

/* ---------------------------------------------------------------- the huts
   Low wooden huts with felt roofs, in rows that come up as the war goes on: AF_HUTS[row] = [[left x, foot y, size], ...]. Each row is
   painted once (af_hutRow) and drawn with its opacity and a little rise; the windows' lines of light are drawn live, each lit by
   lit(row, hut, window) (0 to 1). */
const AF_HUTS=[
  [[150,702,0.46],[330,700,0.48],[1340,700,0.48],[1520,702,0.46],[1696,700,0.46]],
  [[40,792,0.72],[300,786,0.7],[1250,786,0.72],[1520,792,0.7]],
  [[-60,930,1.02],[1290,920,1.0],[1640,932,1.02]]];
const AF_HUT={w:300,h:66,roof:24,win:6};
function af_hut(c,x,y,s){const w=AF_HUT.w*s,h=AF_HUT.h*s,rf=AF_HUT.roof*s,ov=9*s,ice=DP.ice;
  // the wall's boards, lit a little by the moon from the right
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgb(16,30,31)");g.addColorStop(1,"rgb(28,46,46)");c.fillStyle=g;c.fillRect(x,y-h,w,h);
  c.fillStyle="rgba(0,0,0,0.25)";for(let yy=y-h+7*s;yy<y;yy+=8*s)c.fillRect(x,yy,w,Math.max(1,0.9*s));
  // the windows, blacked out
  for(let i=0;i<AF_HUT.win;i++){const wx=x+(28+i*40)*s,wy=y-h+16*s;c.fillStyle="rgb(4,10,12)";c.fillRect(wx,wy,22*s,28*s);c.strokeStyle="rgba(150,210,210,0.10)";c.lineWidth=Math.max(1,1.2*s);c.strokeRect(wx,wy,22*s,28*s);}
  // the door at the right end
  c.fillStyle="rgb(10,20,22)";c.fillRect(x+w-36*s,y-h+10*s,22*s,h-10*s);
  // the roof: felt, its ridge catching the moon
  c.fillStyle="rgb(9,17,20)";c.beginPath();c.moveTo(x-ov,y-h);c.lineTo(x+w+ov,y-h);c.lineTo(x+w+ov-10*s,y-h-rf);c.lineTo(x-ov+10*s,y-h-rf);c.closePath();c.fill();
  c.fillStyle=rgba(ice,0.22);c.fillRect(x-ov+10*s,y-h-rf,w+2*ov-20*s,Math.max(1,1.6*s));
  c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(x,y-h,w,3*s);
  // its shadow on the lawn
  g=c.createLinearGradient(0,y,0,y+12*s);g.addColorStop(0,"rgba(0,0,0,0.4)");g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(x-ov,y,w+2*ov,12*s);}
function af_hutRow(r){return ag_kept("af_huts"+r,W,H,c=>{for(const [x,y,s] of AF_HUTS[r])af_hut(c,x,y,s);});}
// where each window's line of light is: [x, y, w, size] for each hut of a row
function af_hutWins(r,k){const [x,y,s]=AF_HUTS[r][k],h=AF_HUT.h*s,out=[];for(let i=0;i<AF_HUT.win;i++)out.push([x+(28+i*40)*s,y-h+16*s+28*s,22*s,s]);return out;}
// the huts: o.rows (opacity of each row), o.rise (px each row has still to rise), o.lit(r, k, i) the windows' light, o.a
function af_huts(ctx,o){o=o||{};const A=o.rows||[1,1,1];
  for(let r=0;r<AF_HUTS.length;r++){const a=A[r];if(!(a>0.003))continue;const dy=(o.rise?o.rise[r]:0);
    ctx.save();ctx.globalAlpha*=a;if(dy){ctx.beginPath();ctx.rect(0,0,W,AF_HUTS[r][0][1]+14);ctx.clip();}ctx.drawImage(af_hutRow(r),0,dy);ctx.restore();
    for(let k=0;k<AF_HUTS[r].length;k++){af_hutWins(r,k).forEach(([x,y,w,s],i)=>{const L=a*(o.lit?o.lit(r,k,i):1);if(!(L>0.01))return;
      ctx.save();ctx.globalAlpha*=L;ctx.fillStyle=rgba(AF_WARM,1);ctx.fillRect(x+1*s,y+dy-2.6*s,w-2*s,2.2*s);ctx.restore();af_glow(ctx,x+w/2,y+dy-1.5*s,w*1.2,9*s,0.55*L);});}}}

/* ---------------------------------------------------------------- the people crossing the park, small and far off
   A few dark figures walking between the huts, on the paths: [x0, y0, x1, y1, size, phase]; one can be lit for a moment (lit, a
   colour) */
const AF_WALK=[[420,750,640,738,0.62,0],[1250,742,1080,734,0.6,0.4],[300,860,560,820,0.9,0.7],[1500,846,1230,800,0.86,0.2],[760,800,880,760,0.76,0.55],[1080,880,980,800,0.92,0.85]];
function af_walker(ctx,x,y,s,step,col,a,face){if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(face<0?-1:1),s);
  const sw=Math.sin(step)*7;ctx.fillStyle=rgba(col,1);
  // legs, a coat to the knee, shoulders, a head
  ctx.beginPath();ctx.moveTo(-3,-22);ctx.lineTo(-4+sw,0);ctx.lineTo(-1+sw,0);ctx.lineTo(1,-20);ctx.lineTo(3-sw,0);ctx.lineTo(6-sw,0);ctx.lineTo(5,-22);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-8,-18);ctx.bezierCurveTo(-9,-34,-8,-48,-5,-52);ctx.bezierCurveTo(-2,-55,4,-55,7,-52);ctx.bezierCurveTo(10,-48,10,-34,9,-18);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.arc(1,-60,6,0,TAU);ctx.fill();ctx.restore();}
function af_walkers(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;
  AF_WALK.forEach(([x0,y0,x1,y1,s,ph],i)=>{const u=((t*0.035+ph)%1),x=lerp(x0,x1,u),y=lerp(y0,y1,u),fa=Math.min(1,u*8,(1-u)*8),lit=o.lit&&o.lit(i)||0;
    af_walker(ctx,x,y,s*1.15,t*5.2+i,mix([4,12,14],DP.F.coral,lit),a*fa,x1<x0?-1:1);if(lit>0.01)dp_halo(ctx,x,y-36*s,60*s,"coral",0.35*lit*a*fa);});}

/* ---------------------------------------------------------------- inside a hut, at night
   A hut's room: boarded walls, a blacked-out window, a door behind the desk, and a desk under a shaded lamp. The recruit sits at the
   desk (AF_DESK.recruit), the desk hiding her below its back edge (cut); the form lies in front of her hand. */
const AF_DESK={back:770,front:868,x0:250,x1:1700,recruit:[560,480,1],form:[600,776,206,60],lamp:[1470,800],door:[120,170,250,600]};
// where the near wrist is, in the place, for a person at x, y, s (flip to face left) in a pose [upper arm, forearm, hand]: the same
// sums as people.js's ag_joints, so a thing put down where the hand will be is where the hand arrives
function af_wrist(x,y,s,flip,spec){const f=AG_FIG.fore,J=AG_FIG.shoulder.near,a1=spec[0]*Math.PI/180,a2=spec[1]*Math.PI/180,
  E=[J[0]+Math.sin(a1)*AG_FIG.L1*f,J[1]+Math.cos(a1)*AG_FIG.L1],Wr=[E[0]+Math.sin(a2)*AG_FIG.L2*f,E[1]+Math.cos(a2)*AG_FIG.L2],A=AG_FIG.anchor;
  return[x+(flip?-1:1)*(Wr[0]-A[0])*s,y+(Wr[1]-A[1])*s];}
const AF_WRITE=[5,95,"hold"];
AG_PLACES.afHut=c=>{const D=AF_DESK,[lx,ly]=D.lamp,R=ag_rnd(1940);
  // the boarded wall, dark green-grey, warmed where the lamp reaches
  let g=c.createLinearGradient(0,0,0,D.back);g.addColorStop(0,"rgb(10,22,24)");g.addColorStop(1,"rgb(18,34,34)");c.fillStyle=g;c.fillRect(0,0,W,D.back);
  for(let x=0;x<W;x+=44){c.fillStyle="rgba(0,0,0,0.22)";c.fillRect(x,0,2,D.back);c.fillStyle="rgba(170,220,215,0.035)";c.fillRect(x+2,0,1.5,D.back);}
  c.fillStyle="rgba(0,0,0,0.3)";c.fillRect(0,D.back-40,W,40);c.fillStyle="rgba(170,220,215,0.05)";c.fillRect(0,D.back-41,W,2);
  // the window, its blackout blind drawn down
  const wx=1180,wy=150,ww=330,wh=330;c.fillStyle="rgb(26,34,34)";c.fillRect(wx-16,wy-16,ww+32,wh+32);c.fillStyle="rgb(6,10,14)";c.fillRect(wx,wy,ww,wh);
  c.fillStyle="rgba(255,255,255,0.03)";for(let y=wy+30;y<wy+wh;y+=34)c.fillRect(wx,y,ww,2);c.fillStyle="rgb(30,40,40)";c.fillRect(wx-24,wy+wh+12,ww+48,12);
  // the door behind the desk, shut; its frame
  const [dx,dy,dw,dh]=D.door;c.fillStyle="rgb(12,20,22)";c.fillRect(dx-14,dy-14,dw+28,dh+14);c.fillStyle="rgb(24,36,36)";c.fillRect(dx,dy,dw,dh);
  c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=3;c.strokeRect(dx+28,dy+30,dw-56,dh*0.36);c.strokeRect(dx+28,dy+dh*0.46,dw-56,dh*0.44);
  c.fillStyle="rgb(150,128,84)";c.beginPath();c.arc(dx+dw-26,dy+dh*0.48,6,0,TAU);c.fill();
  // the lamp's warm light on the wall, and the room's dark at its edges
  g=c.createRadialGradient(lx,ly-260,0,lx,ly-260,820);g.addColorStop(0,"rgba(255,196,120,0.26)");g.addColorStop(0.5,"rgba(255,170,96,0.07)");g.addColorStop(1,"rgba(255,170,96,0)");
  c.fillStyle=g;c.fillRect(0,0,W,D.back);
  // the floor beyond the desk, at its ends
  c.fillStyle="rgb(9,15,16)";c.fillRect(0,D.back,W,H-D.back);
  // the desk: its top, lit by the lamp, and its front, in the dark
  g=c.createLinearGradient(0,D.back,0,D.front);g.addColorStop(0,"rgb(58,42,30)");g.addColorStop(1,"rgb(78,56,38)");c.fillStyle=g;
  c.beginPath();c.moveTo(D.x0+20,D.back);c.lineTo(D.x1-20,D.back);c.lineTo(D.x1+20,D.front);c.lineTo(D.x0-20,D.front);c.closePath();c.fill();
  c.save();c.clip();g=c.createRadialGradient(lx,D.back+40,0,lx,D.back+40,760);g.addColorStop(0,"rgba(255,200,130,0.45)");g.addColorStop(1,"rgba(255,200,130,0)");c.save();c.translate(lx,D.back+40);c.scale(1,0.22);c.translate(-lx,-D.back-40);
  c.fillStyle=g;c.fillRect(lx-800,D.back+40-800,1600,1600);c.restore();
  c.strokeStyle="rgba(0,0,0,0.16)";c.lineWidth=1.5;for(let i=0;i<14;i++){const y=D.back+6+i*7+R()*3;c.beginPath();c.moveTo(D.x0,y);c.bezierCurveTo(700,y+R()*4-2,1200,y+R()*4-2,D.x1,y);c.stroke();}c.restore();
  c.fillStyle="rgba(255,226,180,0.18)";c.fillRect(D.x0+20,D.back,D.x1-D.x0-40,2);
  g=c.createLinearGradient(0,D.front,0,H);g.addColorStop(0,"rgb(40,28,20)");g.addColorStop(1,"rgb(14,10,8)");c.fillStyle=g;c.fillRect(D.x0-20,D.front,D.x1-D.x0+40,H-D.front);
  c.fillStyle="rgba(255,226,180,0.12)";c.fillRect(D.x0-20,D.front,D.x1-D.x0+40,2);
  // on the desk: a stack of forms, an inkwell, and the lamp, its shade dark, its light falling on the desk
  c.fillStyle="rgb(196,184,160)";for(let i=0;i<5;i++){c.fillStyle=i%2?"rgb(188,176,152)":"rgb(206,194,170)";c.beginPath();c.moveTo(300,806-i*3);c.lineTo(450,806-i*3);c.lineTo(462,838-i*3);c.lineTo(290,838-i*3);c.closePath();c.fill();}
  c.fillStyle="rgb(16,20,24)";c.beginPath();c.ellipse(1010,812,22,8,0,0,TAU);c.fill();c.fillRect(988,790,44,22);c.fillStyle="rgb(36,44,52)";c.beginPath();c.ellipse(1010,790,22,7,0,0,TAU);c.fill();
  c.fillStyle="rgb(30,26,22)";c.beginPath();c.ellipse(lx,ly+6,70,14,0,0,TAU);c.fill();c.fillRect(lx-6,ly-250,12,250);
  c.save();c.translate(lx,ly-250);c.fillStyle="rgb(24,30,28)";c.beginPath();c.moveTo(-30,0);c.lineTo(30,0);c.lineTo(96,96);c.lineTo(-96,96);c.closePath();c.fill();
  c.fillStyle="rgba(255,230,190,0.95)";c.beginPath();c.ellipse(0,96,96,12,0,0,TAU);c.fill();c.restore();
  g=c.createRadialGradient(lx,ly-150,0,lx,ly-150,240);g.addColorStop(0,"rgba(255,214,150,0.36)");g.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=g;c.fillRect(lx-240,ly-390,480,480);};
// the door behind her opening, open 0 to 1: a warm room beyond, the door's leaf swinging in, light on the floor
function af_hutDoor(ctx,open){if(!(open>0.002))return;const [dx,dy,dw,dh]=AF_DESK.door,u=ag_sine(open);
  ctx.save();ctx.beginPath();ctx.rect(dx,dy,dw,dh);ctx.clip();const g=ctx.createLinearGradient(dx,dy,dx+dw,dy+dh);g.addColorStop(0,"rgb(255,214,156)");g.addColorStop(1,"rgb(224,160,96)");
  ctx.globalAlpha*=Math.min(1,u*3);ctx.fillStyle=g;ctx.fillRect(dx,dy,dw,dh);ctx.restore();
  const lw=dw*(1-0.82*u);ctx.fillStyle="rgb(20,30,30)";ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+lw,dy+u*18);ctx.lineTo(dx+lw,dy+dh-u*10);ctx.lineTo(dx,dy+dh);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(AF_WARM,0.35*u);ctx.fillRect(dx+lw-2,dy+u*18,2,dh-u*28);
  af_glow(ctx,dx+dw/2,dy+dh*0.6,dw*1.6,dh*0.9,0.5*u);}
// the declaration on the desk, in perspective: a printed heading, lines of small print (no word of it can be read), a line to sign
// on; sign (0 to 1) writes her name along it, in a loose hand
function af_form(ctx,sign,o){o=o||{};const [x,y,w,h]=AF_DESK.form,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  const sk=14;ctx.fillStyle="rgb(224,214,192)";ctx.beginPath();ctx.moveTo(x+sk,y);ctx.lineTo(x+w-sk,y);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(x,y+h,w,3);
  ctx.fillStyle="rgb(60,52,44)";ctx.fillRect(x+w*0.22,y+7,w*0.56,5);
  ctx.fillStyle="rgba(80,70,60,0.5)";for(let i=0;i<5;i++){const yy=y+20+i*7,inset=sk*(1-(yy-y)/h);ctx.fillRect(x+inset+16,yy,w-2*inset-32-(i===4?60:0),2);}
  ctx.fillStyle="rgba(60,52,44,0.8)";ctx.fillRect(x+w*0.5,y+h-12,w*0.42,1.6);
  const u=clamp(sign,0,1);if(u>0){ctx.save();ctx.beginPath();ctx.rect(x+w*0.5,y+h-34,w*0.42*u,30);ctx.clip();ctx.strokeStyle="rgb(24,34,72)";ctx.lineWidth=2.2;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();const x0=x+w*0.5+4,y0=y+h-16;ctx.moveTo(x0,y0);for(let i=0;i<=40;i++){const v=i/40,xx=x0+v*w*0.4,yy=y0-6*Math.sin(v*TAU*3.4)-4*Math.sin(v*TAU*1.3)+(v>0.6?2:0);ctx.lineTo(xx,yy);}ctx.stroke();ctx.restore();}
  ctx.restore();}
// a fountain pen, in the place (lying on the desk) or in her hand (in figure space: along the hand, its nib at the fingertips)
function af_pen(ctx,x,y,ang,k){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(k||1,k||1);ctx.fillStyle="rgb(18,20,26)";rr(ctx,-6,-5,104,10,5);ctx.fill();
  ctx.fillStyle="rgb(196,168,96)";ctx.fillRect(56,-5.5,5,11);ctx.fillStyle="rgb(210,190,140)";ctx.beginPath();ctx.moveTo(98,-4);ctx.lineTo(116,0);ctx.lineTo(98,4);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(0,-3.5,90,1.6);ctx.restore();}
// the arm that reaches a wrist (figure space) with the elbow down: [upper arm, forearm] in degrees, as people.js measures them (from
// straight down, towards the way the person faces). Its reach across the frame is drawn shorter (AG_FIG.fore), so the sum is done
// with x divided by it, where the arm's two lengths are true
function af_reach(wx,wy){const f=AG_FIG.fore,J=AG_FIG.shoulder.near,L1=AG_FIG.L1,L2=AG_FIG.L2,tx=(wx-J[0])/f,ty=wy-J[1],d=Math.min(L1+L2-1,Math.hypot(tx,ty)),
  th=Math.atan2(tx,ty),b=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),a1=th-b,ex=Math.sin(a1)*L1,ey=Math.cos(a1)*L1;
  return[a1*180/Math.PI,Math.atan2(tx-ex,ty-ey)*180/Math.PI];}
// her hand as she signs: the pen's nib where the signature has reached (sign 0 to 1), the arm found from it; the nib is about 102 px
// past the wrist, along her fingers
const AF_NIB=[102,7];
function af_nibAt(sign){const [fx,fy,fw,fh]=AF_DESK.form,u=clamp(sign,0,1);return[fx+fw*0.5+4+u*fw*0.4,fy+fh-14-2.5*Math.sin(u*TAU*3.4)];}
function af_signPose(sign){const [x,y,s]=AF_DESK.recruit,[nx,ny]=af_nibAt(sign),A=AG_FIG.anchor,[a1,a2]=af_reach((nx-x)/s+A[0]-AF_NIB[0],(ny-y)/s+A[1]-AF_NIB[1]);
  return{near:[a1,a2,"hold"]};}
// the pen in her hand, in figure space: across her fingertips, its nib on the paper
function af_penHeld(c,h){const E=h.nearElbow,Wr=h.near,dx=Wr[0]-E[0],dy=Wr[1]-E[1],L=Math.hypot(dx,dy)||1,fx=Wr[0]+dx/L*94,fy=Wr[1]+dy/L*94;
  af_penAt(c,[fx-34,fy-60],[fx+8,fy+16]);}
function af_penAt(c,top,nib){const a=Math.atan2(nib[1]-top[1],nib[0]-top[0]),L=Math.hypot(nib[0]-top[0],nib[1]-top[1]);af_pen(c,top[0],top[1],a,L/116);}

/* ---------------------------------------------------------------- the sea chart
   The North Atlantic on a pane of frosted glass in a dark room, drawn in light: its coasts, a grid, nothing written. A convoy (small pale
   hulls) crosses from Newfoundland towards the North Channel; the submarines are dark shapes in its way. Steered by what was read,
   its route (a dotted green line) bends round them; if the codes changed, the route would go dark, and the convoy would hold its course
   towards them. Nothing more is shown: nothing sinks. */
const AF_SEA={x0:150,y0:96,x1:1770,y1:860};
// the land: Natural Earth's coasts (public domain, 1:50m, via the world-atlas package), drawn once on a Mercator chart from 66 W to 4 E
// and from about 48 N to 65.5 N, simplified to a pixel and a half; each ring "x,y x,y ...", the rings split by ";"
const AF_LAND="247,813 237,814 218,809 206,803 201,795 186,787 185,785 193,783 223,792 247,807 250,812;263,921 269,920 265,923 266,925 264,928 264,929 272,928 278,921 272,921 276,917 277,913 282,909 284,913 292,914 290,919 293,921 280,931 273,933 259,934 255,929 254,921 256,914 269,893 276,886 279,886 281,895 277,910 276,914;201,904 204,901 216,905 239,903 242,905 230,913 230,919 232,919 230,920 224,920 222,917 219,917 222,915 218,912 220,909 213,913 216,913 214,914 205,912 201,907 202,906 194,905 193,899 187,898 188,894 196,884 197,889 194,893 199,898 198,902;1605,442 1605,447 1603,451 1585,467 1584,471 1588,473 1582,483 1599,477 1607,479 1629,478 1634,482 1636,488 1631,497 1625,514 1617,526 1601,535 1611,533 1616,537 1616,539 1613,541 1608,542 1600,549 1590,546 1594,549 1607,552 1612,549 1617,549 1628,554 1639,568 1649,603 1662,611 1675,626 1673,630 1680,646 1671,641 1662,641 1671,643 1684,656 1686,663 1678,673 1684,677 1690,671 1702,671 1709,674 1716,679 1718,690 1714,703 1710,708 1706,709 1707,713 1705,715 1700,715 1695,718 1698,719 1698,723 1687,727 1690,727 1693,730 1698,731 1710,731 1710,738 1702,743 1700,747 1695,747 1682,753 1673,751 1659,753 1645,748 1647,751 1642,754 1630,755 1632,758 1630,759 1623,758 1621,759 1613,755 1608,755 1599,758 1592,772 1590,773 1580,767 1568,771 1561,775 1559,780 1556,780 1552,777 1547,779 1546,776 1554,772 1564,762 1571,753 1573,746 1578,744 1580,738 1588,736 1605,737 1621,717 1601,730 1595,729 1587,723 1579,724 1583,720 1576,717 1571,717 1564,721 1558,717 1556,712 1557,709 1580,697 1585,687 1583,684 1582,673 1569,677 1579,664 1589,658 1598,656 1606,659 1604,654 1606,653 1610,658 1614,657 1610,656 1606,650 1610,641 1607,639 1607,634 1610,632 1612,625 1611,624 1604,626 1595,612 1594,608 1597,600 1602,594 1607,593 1595,593 1586,600 1582,600 1579,597 1573,600 1566,597 1564,603 1561,600 1558,591 1560,591 1569,570 1564,562 1565,555 1566,552 1571,552 1565,548 1566,543 1563,549 1556,555 1557,547 1560,542 1552,550 1553,557 1549,575 1547,577 1545,577 1546,565 1550,558 1547,558 1548,548 1553,528 1557,518 1547,528 1542,526 1539,521 1536,520 1545,514 1542,512 1548,504 1549,498 1543,489 1548,484 1546,483 1544,479 1548,470 1558,470 1552,462 1554,454 1561,453 1560,448 1561,440 1566,440 1568,442 1573,440 1575,442 1602,436 1607,437;1511,588 1515,587 1517,583 1528,581 1536,582 1545,598 1541,605 1548,604 1551,611 1550,613 1546,609 1546,615 1549,616 1548,620 1543,621 1538,629 1534,627 1535,630 1531,631 1535,647 1538,672 1534,687 1528,694 1531,698 1526,700 1521,700 1518,701 1516,698 1515,701 1503,704 1501,708 1491,714 1483,712 1484,717 1473,723 1462,726 1458,725 1450,727 1457,719 1443,722 1455,712 1444,716 1438,715 1437,712 1448,703 1437,702 1438,700 1443,697 1451,698 1448,692 1455,687 1474,682 1469,679 1465,683 1456,683 1448,686 1457,678 1460,673 1458,671 1462,666 1471,661 1466,660 1457,660 1455,657 1449,656 1451,654 1444,654 1443,648 1452,646 1448,644 1448,641 1456,638 1456,635 1448,636 1449,627 1448,628 1447,623 1444,624 1444,622 1446,620 1456,618 1462,619 1466,622 1469,619 1480,621 1478,617 1487,610 1489,605 1482,606 1475,603 1484,595 1483,590 1486,585 1498,583 1498,581 1500,580 1503,586 1500,592 1504,589 1503,581 1508,579 1507,576 1508,576 1516,581 1511,585;57,-51 57,120 1863,121 1863,985 1646,985 1649,967 1652,963 1651,960 1649,963 1652,935 1658,940 1661,949 1665,952 1659,937 1650,929 1649,927 1654,928 1651,909 1645,908 1636,902 1629,890 1631,885 1627,880 1629,877 1637,878 1632,875 1619,875 1619,873 1621,870 1618,868 1613,868 1613,864 1606,865 1604,862 1598,862 1587,857 1578,858 1575,853 1569,850 1577,846 1571,842 1579,841 1576,839 1568,839 1567,836 1568,833 1573,830 1583,827 1591,827 1597,823 1603,822 1608,824 1615,833 1621,829 1629,829 1631,831 1633,827 1635,830 1646,829 1641,824 1641,810 1635,799 1634,792 1648,793 1651,803 1674,806 1687,801 1680,799 1682,792 1692,786 1706,781 1710,778 1714,772 1714,754 1718,747 1734,742 1757,730 1767,732 1775,730 1770,728 1766,730 1760,728 1757,725 1764,723 1773,728 1776,727 1770,723 1774,722 1769,715 1781,696 1788,672 1791,673 1795,671 1801,666 1805,659 1818,654 1835,652 1839,657 1844,659 1841,655 1844,644 1863,643 1863,459 1850,464 1840,464 1837,458 1835,458 1833,462 1829,459 1832,455 1832,453 1825,453 1818,448 1807,437 1805,433 1807,420 1819,426 1825,420 1819,423 1814,416 1815,407 1826,395 1806,407 1802,413 1797,413 1796,410 1800,391 1804,388 1811,391 1813,387 1821,383 1812,384 1810,381 1818,371 1820,364 1828,356 1830,358 1828,368 1833,355 1839,351 1824,355 1820,359 1813,372 1809,374 1805,383 1797,392 1796,383 1798,371 1805,372 1809,369 1800,365 1796,354 1808,343 1799,348 1794,342 1793,335 1793,326 1795,324 1805,325 1816,322 1826,324 1834,321 1839,325 1840,330 1840,324 1853,318 1849,317 1847,313 1850,307 1847,310 1846,319 1838,320 1832,318 1830,314 1828,320 1825,321 1818,320 1801,323 1794,316 1793,310 1793,307 1801,305 1793,297 1791,289 1793,284 1804,285 1817,290 1827,289 1833,286 1819,287 1804,282 1799,283 1795,278 1796,271 1799,270 1801,272 1806,264 1814,259 1818,262 1830,259 1832,256 1819,259 1819,257 1824,249 1839,248 1853,252 1855,250 1852,249 1852,246 1863,243 1863,241 1849,244 1845,242 1833,243 1840,231 1848,228 1853,224 1863,224 1863,-51;1318,55 1325,53 1334,46 1340,46 1332,52 1328,61 1330,64 1333,66 1335,64 1337,67 1337,74 1334,81 1344,80 1346,86 1342,92 1350,88 1355,89 1358,94 1361,93 1362,95 1361,102 1358,104 1361,108 1362,111 1359,113 1363,116 1363,120 1361,123 1357,124 1357,131 1352,138 1350,139 1345,138 1345,141 1343,143 1343,149 1339,155 1330,162 1324,162 1311,168 1292,185 1265,192 1262,202 1259,204 1255,202 1256,205 1246,208 1210,201 1203,194 1204,191 1206,190 1205,188 1199,191 1198,188 1188,183 1189,181 1188,180 1181,185 1153,186 1151,176 1152,173 1157,178 1167,174 1176,159 1181,157 1176,156 1167,161 1171,157 1168,155 1169,150 1178,144 1176,143 1170,147 1165,149 1161,144 1163,138 1158,135 1137,133 1126,138 1121,131 1124,128 1137,126 1141,124 1143,126 1150,121 1171,121 1173,113 1167,117 1157,113 1172,99 1168,96 1161,97 1159,94 1153,92 1150,93 1147,92 1124,101 1111,95 1116,90 1125,94 1122,89 1120,81 1124,81 1131,86 1139,82 1129,80 1126,76 1128,74 1133,75 1127,67 1128,64 1135,66 1131,62 1135,58 1144,63 1145,69 1149,69 1152,66 1153,66 1154,75 1158,73 1158,64 1146,56 1148,53 1157,53 1152,48 1142,48 1146,43 1158,43 1182,66 1179,70 1184,74 1183,82 1181,85 1176,83 1181,88 1181,91 1183,92 1181,97 1186,100 1188,109 1193,92 1196,88 1199,87 1204,92 1206,84 1206,66 1210,62 1214,65 1223,79 1226,81 1229,63 1241,57 1254,74 1258,83 1259,77 1254,62 1254,59 1263,60 1271,70 1280,56 1288,61 1296,57 1297,52 1295,42 1301,38 1307,38 1314,47 1314,51;1575,623 1571,628 1567,628 1569,622 1575,614 1577,620;1544,536 1531,538 1534,535 1535,529 1531,527 1532,524 1536,523 1540,528 1544,529;1536,553 1537,562 1532,566 1532,559 1527,562 1528,558;1647,350 1648,353 1649,352 1651,355 1653,354 1647,381 1646,379 1648,368 1647,366 1643,367 1639,362 1646,359 1644,353 1641,352 1646,346 1647,347;1580,657 1584,658 1583,659 1576,664 1572,659 1572,655 1578,653;1607,419 1612,421 1613,425 1603,424 1602,420 1600,422 1600,418 1602,414 1607,416;1524,268 1523,275 1519,273 1522,282 1515,275 1511,265 1516,264;1534,449 1531,457 1526,461 1529,462 1529,464 1515,475 1514,473 1519,468 1514,465 1516,463 1513,461 1513,457 1515,455 1518,457 1522,457 1521,452 1533,443;1535,486 1535,494 1546,497 1540,506 1538,506 1538,499 1531,499 1528,494 1523,492 1521,489 1525,486 1524,484 1530,482 1530,479 1533,480;607,338 604,344 595,338 608,331;57,-51 143,-51 138,-42 141,-40 147,-51 151,-51 151,-48 153,-46 157,-50 160,-50 162,-47 161,-36 164,-31 164,-43 170,-51 176,-51 173,-44 173,-38 177,-37 182,-41 193,-28 196,-30 200,-24 194,-20 196,-11 180,-11 188,-8 188,-6 200,-6 200,-9 206,-13 212,-10 219,-4 216,-1 213,8 203,20 220,13 225,14 226,12 234,15 240,7 243,9 259,30 259,33 254,36 245,29 240,31 251,39 252,44 253,46 246,50 239,48 234,44 230,45 233,50 230,55 243,66 237,68 229,66 234,77 228,83 227,88 220,89 216,87 209,76 210,84 204,87 212,89 211,111 205,128 199,118 195,117 193,120 188,114 190,102 183,117 181,114 171,98 164,81 169,71 177,67 186,50 181,51 173,63 164,68 154,68 153,67 153,63 158,56 151,61 149,60 139,52 132,36 127,32 128,36 125,38 120,35 122,43 122,50 120,50 110,42 107,40 106,41 111,52 123,66 119,72 114,72 108,70 93,54 86,56 93,58 99,63 98,71 99,75 107,81 105,92 114,88 118,91 120,97 124,99 119,104 125,110 128,119 131,120 134,134 135,124 145,132 143,136 145,139 151,130 155,132 161,140 163,139 167,144 161,150 169,150 171,154 168,161 160,162 165,165 170,173 169,176 181,176 180,180 178,182 183,183 187,193 183,194 184,216 181,217 175,198 169,190 173,212 172,217 181,233 176,235 169,233 172,244 171,248 160,236 156,233 154,234 145,224 145,230 140,228 135,216 135,225 133,225 126,213 123,214 121,212 106,191 109,208 92,192 84,190 83,193 85,199 100,220 111,224 110,229 118,234 127,244 135,249 143,264 150,269 147,274 149,284 144,286 117,272 91,267 78,258 67,241 57,241;57,985 57,335 64,332 68,325 71,334 66,343 63,352 66,369 62,374 57,374 57,377 62,377 66,383 67,390 65,398 65,405 71,405 72,408 70,412 71,417 68,426 66,429 62,423 60,427 57,429 57,432 62,434 74,426 88,425 94,430 98,443 96,455 93,461 82,466 80,469 94,463 100,447 103,443 106,452 102,459 109,447 111,465 114,455 126,446 133,443 142,430 144,431 148,436 150,446 152,440 149,429 153,427 152,424 154,422 157,422 156,419 161,420 164,418 158,415 157,411 159,411 161,405 164,406 162,399 165,399 172,403 164,396 162,391 163,385 166,383 172,385 169,383 169,379 177,360 185,362 187,367 178,374 190,372 192,376 191,387 195,383 202,397 197,402 198,403 201,405 201,408 205,405 207,406 210,412 204,417 197,418 201,419 214,417 212,419 214,424 213,426 218,426 222,435 210,445 207,450 215,444 216,447 229,443 224,456 213,464 224,459 231,458 236,466 244,469 245,471 243,475 243,482 235,487 231,487 244,490 246,492 243,497 246,500 251,500 258,507 257,521 253,522 241,521 234,518 236,515 231,516 249,528 242,531 244,532 256,535 249,538 249,540 257,541 259,548 255,550 261,552 264,555 266,556 270,552 272,552 276,561 278,558 281,559 279,564 284,571 275,588 284,581 294,578 296,583 302,584 293,598 306,583 312,585 317,597 326,600 330,598 331,596 336,596 339,602 349,607 342,615 332,617 325,622 321,629 314,629 301,637 293,637 288,641 286,646 280,644 287,651 282,654 283,656 281,659 285,658 293,650 305,645 320,631 337,627 328,626 328,623 331,622 349,624 355,639 346,646 349,647 351,651 362,641 369,640 373,645 379,647 382,651 386,661 384,669 386,683 374,687 387,690 388,691 387,694 381,693 389,700 381,710 359,728 348,727 341,729 335,733 323,734 308,753 293,766 292,770 287,772 270,772 249,777 244,773 226,770 216,770 214,772 200,770 192,771 167,769 155,772 151,770 147,774 139,773 128,781 118,804 97,810 99,811 91,815 82,823 68,843 63,845 57,842 57,844 63,848 57,861 57,869 70,853 81,842 98,830 114,822 146,809 161,807 177,810 183,813 191,821 191,823 184,822 191,828 188,837 182,839 177,845 167,851 162,851 152,845 148,848 140,847 134,851 142,850 153,855 159,863 173,857 172,859 176,859 180,861 177,866 175,873 166,882 169,884 177,884 175,890 177,896 179,897 181,908 184,911 198,914 200,916 195,919 203,924 208,924 213,928 226,928 225,931 231,932 244,924 248,931 254,930 258,934 259,938 255,940 263,941 265,943 212,964 205,963 207,967 205,969 200,968 196,964 194,969 192,966 190,967 188,971 190,974 180,985 146,985 148,973 153,967 147,970 152,965 161,961 156,962 158,960 175,949 186,944 186,941 189,942 188,948 193,952 192,948 194,945 211,941 182,939 179,942 176,941 177,937 189,925 185,926 182,921 183,926 178,931 153,945 147,942 149,939 146,942 148,944 140,949 138,948 130,950 129,948 124,947 124,956 127,958 122,963 118,962 114,964 113,966 107,966 106,970 102,973 100,969 95,971 93,969 91,977 85,974 87,971 85,970 86,966 81,971 79,982 76,985;177,252 186,253 187,255 185,259 181,260 175,259 174,257 177,255;98,364 95,363 95,360 102,347 106,350 108,354 105,359;177,310 164,301 163,297 170,295 178,296 181,299 180,305;394,725 391,730 381,732 381,737 386,739 386,743 365,779 362,789 362,795 377,777 379,779 378,783 383,780 387,782 393,782 391,785 378,795 384,793 384,796 379,801 386,798 389,801 396,799 397,803 399,799 400,802 396,814 400,808 404,806 405,807 416,798 417,805 420,802 429,801 436,805 438,812 431,819 424,824 431,823 428,827 434,829 432,833 425,838 436,834 438,835 441,832 450,829 448,838 437,844 438,849 431,851 436,851 431,859 432,863 435,864 444,852 453,847 454,848 447,861 447,868 448,870 452,867 456,860 458,860 459,867 453,882 452,892 448,897 443,895 437,898 437,881 427,891 425,892 424,890 431,871 428,860 423,856 416,872 415,873 417,867 413,872 408,873 397,889 386,890 383,888 383,885 393,880 400,871 408,866 410,863 406,865 396,863 395,869 391,870 385,868 379,869 385,866 385,858 381,860 379,859 375,863 364,867 327,863 327,861 321,864 309,866 305,861 304,855 306,852 328,833 308,833 308,832 316,826 314,829 319,831 326,814 335,817 333,814 336,809 331,808 330,803 335,797 340,799 337,792 348,763 351,759 354,759 351,756 357,750 357,744 362,740 366,732 381,724 389,727 389,723 393,723;933,-51 928,-44 910,-28 906,-17 902,-13 901,-6 888,26 884,32 881,32 876,43 863,54 858,53 847,43 853,60 835,77 835,70 832,67 829,80 823,80 820,75 816,80 814,80 812,87 804,91 799,89 798,84 803,76 803,69 815,50 802,46 794,46 804,53 799,60 795,73 786,67 788,72 793,77 793,84 783,89 748,93 747,95 762,105 753,116 746,121 736,118 731,119 727,118 729,131 737,128 748,152 741,159 736,160 736,163 734,166 715,162 728,171 733,169 737,170 737,181 739,192 734,197 734,202 727,203 727,208 725,211 726,215 720,226 709,226 701,219 703,223 714,231 714,234 708,243 704,245 684,243 695,250 702,251 698,272 702,279 703,286 700,291 693,291 692,293 698,295 697,298 691,325 689,339 681,351 674,351 664,347 661,348 675,354 679,359 679,372 675,378 668,378 660,374 667,381 661,383 656,383 658,378 650,380 649,374 654,367 654,362 645,374 627,365 627,358 637,354 642,344 634,351 627,354 612,346 610,339 616,323 616,317 613,323 599,330 593,337 585,338 579,335 571,336 573,341 571,341 562,339 562,335 572,328 558,328 557,319 553,316 545,315 542,303 537,299 539,295 536,292 535,285 543,277 547,275 541,274 535,279 529,279 528,272 531,268 522,263 513,256 514,251 513,243 525,227 518,230 511,238 509,232 503,227 497,216 485,190 487,182 484,177 504,169 512,168 514,166 509,166 510,161 495,169 484,172 481,167 488,153 492,147 501,148 501,143 509,140 512,141 517,151 520,154 517,140 513,136 508,136 498,113 504,135 502,137 492,144 494,135 491,137 478,165 476,166 473,159 472,141 468,115 464,112 462,106 470,99 483,84 495,82 495,81 488,80 480,83 466,98 461,98 456,91 451,92 446,91 445,81 448,69 445,69 442,65 443,64 473,39 476,32 485,26 492,17 488,18 478,28 450,56 438,60 437,59 436,44 441,30 448,24 450,20 463,19 465,17 461,15 441,14 435,11 430,2 432,-15 452,-32 462,-36 476,-30 482,-29 487,-30 493,-28 504,-21 506,-22 493,-32 493,-34 500,-37 498,-39 479,-35 466,-41 451,-36 441,-25 437,-22 434,-23 437,-41 443,-51";
let AF_RINGS=null;function af_rings(){return AF_RINGS||(AF_RINGS=AF_LAND.split(";").map(r=>r.split(" ").map(q=>q.split(",").map(Number))));}
AG_PLACES.afSea=c=>{const S=AF_SEA,ice=DP.ice;
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(6,17,21)");g.addColorStop(1,"rgb(10,28,32)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the pane: frosted glass, its sea a little lighter, its edges catching the light
  c.save();c.shadowColor="rgba(92,226,245,0.18)";c.shadowBlur=60;c.fillStyle="rgb(12,34,40)";c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);c.restore();
  c.save();c.beginPath();c.rect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);c.clip();
  g=c.createRadialGradient(960,420,40,960,480,1000);g.addColorStop(0,"rgba(110,190,200,0.16)");g.addColorStop(1,"rgba(110,190,200,0.03)");c.fillStyle=g;c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);
  // the grid, every 10 degrees of longitude and every 5 of latitude
  c.strokeStyle="rgba(170,230,235,0.08)";c.lineWidth=1.2;const k=(S.x1-S.x0)/(70*Math.PI/180),merc=la=>Math.log(Math.tan(Math.PI/4+la*Math.PI/360)),yt=merc(65.5);
  for(let lo=-60;lo<=0;lo+=10){const x=S.x0+(lo+66)*Math.PI/180*k;c.beginPath();c.moveTo(x,S.y0);c.lineTo(x,S.y1);c.stroke();}
  for(let la=50;la<=60;la+=5){const y=S.y0+(yt-merc(la))*k;c.beginPath();c.moveTo(S.x0,y);c.lineTo(S.x1,y);c.stroke();}
  // the land, a little paler than the sea, its coast in a fine line of light
  c.beginPath();for(const r of af_rings()){c.moveTo(r[0][0],r[0][1]);for(let i=1;i<r.length;i++)c.lineTo(r[i][0],r[i][1]);c.closePath();}
  c.fillStyle="rgba(150,210,214,0.13)";c.fill("evenodd");c.strokeStyle=rgba(ice,0.55);c.lineWidth=1.6;c.lineJoin="round";c.stroke();
  // the glass's sheen
  g=c.createLinearGradient(S.x0,S.y0,S.x1,S.y1);g.addColorStop(0,"rgba(230,250,250,0.07)");g.addColorStop(0.4,"rgba(230,250,250,0)");g.addColorStop(0.55,"rgba(230,250,250,0.03)");g.addColorStop(1,"rgba(230,250,250,0)");
  c.fillStyle=g;c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);c.restore();
  c.strokeStyle=rgba(ice,0.55);c.lineWidth=2;c.strokeRect(S.x0+1,S.y0+1,S.x1-S.x0-2,S.y1-S.y0-2);
  c.fillStyle=rgba(ice,0.5);c.fillRect(S.x0,S.y0,S.x1-S.x0,2);};
// the routes, from off Newfoundland to the North Channel, on the chart: the steered one bends north of the submarines; the straight
// one runs through them. The submarines, where they wait
const AF_SUBS=[[867,574],[923,638],[983,583],[891,685],[1029,646]];
const AF_ROUTE={steer:[[520,831],[659,685],[821,482],[1029,402],[1261,438],[1423,516],[1525,566]],straight:[[520,831],[729,722],[937,631],[1168,566],[1377,554],[1525,566]]};
function af_routePath(k){const R=AF_ROUTE[k],pts=[P(R[0][0],R[0][1])];for(let i=1;i<R.length;i++)for(let j=1;j<=12;j++)pts.push(P(lerp(R[i-1][0],R[i][0],j/12),lerp(R[i-1][1],R[i][1],j/12)));return mk(pts);}
let AF_RT=null;function af_routes(){return AF_RT||(AF_RT={straight:af_smooth(af_routePath("straight")),steer:af_smooth(af_routePath("steer"))});}
// a path's corners rounded: each point averaged with its neighbours, a few times
function af_smooth(p){let pts=p.pts;for(let k=0;k<8;k++)pts=pts.map((q,i)=>i===0||i===pts.length-1?q:P((pts[i-1].x+q.x*2+pts[i+1].x)/4,(pts[i-1].y+q.y*2+pts[i+1].y)/4));return mk(pts);}
// a dotted route, drawn on to u (0 to 1), in its colour, at opacity a
function af_route(ctx,path,u,col,a){if(!(a>0.003)||u<=0)return;const c=dp_f(col);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;
  for(let d=0;d<=path.total*u;d+=22){const q=at(path,d/path.total);ctx.beginPath();ctx.arc(q.x,q.y,4.2,0,TAU);ctx.fill();}ctx.restore();}
// the convoy: a cluster of small pale hulls, around a point on a route, heading along it
const AF_SHIPS=[[0,0],[-34,-16],[-34,16],[-68,0],[-68,-32],[-68,32],[-102,-16],[-102,16],[-136,0],[30,-24],[30,24]];
function af_hull(ctx,x,y,a,len,col){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(len/2,0);ctx.quadraticCurveTo(len*0.28,-len*0.16,-len/2,-len*0.13);
  ctx.lineTo(-len/2,len*0.13);ctx.quadraticCurveTo(len*0.28,len*0.16,len/2,0);ctx.closePath();ctx.fill();ctx.restore();}
function af_convoy(ctx,path,u,a,t){af_convoyAt(ctx,at(path,u),a);}
// the convoy at a point q {x, y, a}: between two routes, a blend of where each would have it (af_between)
function af_convoyAt(ctx,q,a){if(!(a>0.003))return;const ca=Math.cos(q.a),sa=Math.sin(q.a);ctx.save();ctx.globalAlpha*=a;
  for(const [dx,dy] of AF_SHIPS){const x=q.x+dx*ca-dy*sa,y=q.y+dx*sa+dy*ca;ctx.save();ctx.globalAlpha*=0.5;af_hull(ctx,x-3*ca,y-3*sa,q.a,30,"rgba(170,230,235,0.25)");ctx.restore();
    af_hull(ctx,x,y,q.a,22,"rgb(226,242,240)");}
  ctx.restore();}
function af_between(p1,p2,u,m){const a=at(p1,u),b=at(p2,u);let d=b.a-a.a;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return{x:lerp(a.x,b.x,m),y:lerp(a.y,b.y,m),a:a.a+d*m};}
// the submarines: dark low shapes with a small tower, waiting; their wake a faint line
function af_subs(ctx,a,t){if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;AF_SUBS.forEach(([x,y],i)=>{const dx=Math.sin(t*0.3+i)*4,ang=0.3+i*0.5;
  ctx.save();ctx.translate(x+dx,y);ctx.rotate(ang);ctx.fillStyle="rgb(4,10,12)";ctx.strokeStyle="rgba(170,230,235,0.35)";ctx.lineWidth=1.4;
  ctx.beginPath();ctx.ellipse(0,0,26,6,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillRect(-4,-9,9,6);ctx.restore();});ctx.restore();}

/* ---------------------------------------------------------------- a commander's desk, 1943
   A panelled room at night, a chart on the wall under glass, a desk with a lamp. The officer stands at the desk's near end; the
   commander sits behind it (cut at its back edge). The sheet, "Most secret", is in one place at a time: in the officer's hand, on the
   desk under the commander's hand, back in the officer's hand, then gone. */
const AF_OFFICE={back:792,front:880,x0:930,x1:1830,officer:[820,590,1],commander:[1340,520,0.96],sheet:[1092,836],lamp:[1730,808]};
AG_PLACES.afDesk=c=>{const D=AF_OFFICE,[lx,ly]=D.lamp;
  // the panelled wall, dark wood, warmed near the lamp
  let g=c.createLinearGradient(0,0,0,D.back);g.addColorStop(0,"rgb(14,20,22)");g.addColorStop(1,"rgb(26,28,28)");c.fillStyle=g;c.fillRect(0,0,W,D.back);
  for(let x=-40;x<W;x+=240){c.fillStyle="rgba(0,0,0,0.25)";c.fillRect(x,0,6,D.back);c.strokeStyle="rgba(255,220,170,0.05)";c.lineWidth=2;c.strokeRect(x+34,120,172,300);c.strokeRect(x+34,470,172,250);}
  // a chart on the wall, under glass, too far to read
  c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=20;c.fillStyle="rgb(20,40,44)";c.fillRect(980,120,560,330);c.restore();
  c.save();c.beginPath();c.rect(980,120,560,330);c.clip();c.strokeStyle="rgba(170,230,235,0.10)";c.lineWidth=1;for(let x=1000;x<1540;x+=60){c.beginPath();c.moveTo(x,120);c.lineTo(x,450);c.stroke();}
  for(let y=140;y<450;y+=55){c.beginPath();c.moveTo(980,y);c.lineTo(1540,y);c.stroke();}
  c.save();c.translate(980,120);c.scale(560/1620,330/764);c.translate(-150,-96);c.beginPath();for(const r of af_rings()){c.moveTo(r[0][0],r[0][1]);for(let i=1;i<r.length;i++)c.lineTo(r[i][0],r[i][1]);c.closePath();}
  c.restore();c.fillStyle="rgba(150,210,214,0.14)";c.fill("evenodd");c.strokeStyle="rgba(190,245,245,0.32)";c.lineWidth=1.2;c.stroke();
  g=c.createLinearGradient(980,120,1540,450);g.addColorStop(0,"rgba(230,250,250,0.08)");g.addColorStop(0.5,"rgba(230,250,250,0)");c.fillStyle=g;c.fillRect(980,120,560,330);c.restore();
  c.strokeStyle="rgba(150,120,80,0.6)";c.lineWidth=6;c.strokeRect(977,117,566,336);
  // the lamp's warmth on the wall and the room's dark edges
  g=c.createRadialGradient(lx,ly-300,0,lx,ly-300,900);g.addColorStop(0,"rgba(255,196,120,0.22)");g.addColorStop(0.55,"rgba(255,170,96,0.05)");g.addColorStop(1,"rgba(255,170,96,0)");c.fillStyle=g;c.fillRect(0,0,W,D.back);
  g=c.createRadialGradient(700,300,0,700,300,700);g.addColorStop(0,"rgba(255,206,150,0.07)");g.addColorStop(1,"rgba(255,206,150,0)");c.fillStyle=g;c.fillRect(0,0,W,D.back);
  c.fillStyle="rgb(10,13,14)";c.fillRect(0,D.back,W,H-D.back);
  // the desk: its top, lit by the lamp, and its front
  g=c.createLinearGradient(0,D.back,0,D.front);g.addColorStop(0,"rgb(52,36,26)");g.addColorStop(1,"rgb(70,48,32)");c.fillStyle=g;
  c.beginPath();c.moveTo(D.x0+20,D.back);c.lineTo(D.x1-10,D.back);c.lineTo(D.x1+20,D.front);c.lineTo(D.x0-20,D.front);c.closePath();c.fill();
  c.save();c.clip();g=c.createRadialGradient(lx,D.back+40,0,lx,D.back+40,760);g.addColorStop(0,"rgba(255,200,130,0.42)");g.addColorStop(1,"rgba(255,200,130,0)");c.save();c.translate(lx,D.back+40);c.scale(1,0.22);c.translate(-lx,-D.back-40);
  c.fillStyle=g;c.fillRect(lx-800,D.back+40-800,1600,1600);c.restore();c.restore();
  c.fillStyle="rgba(255,226,180,0.16)";c.fillRect(D.x0+20,D.back,D.x1-D.x0-30,2);
  g=c.createLinearGradient(0,D.front,0,H);g.addColorStop(0,"rgb(36,25,18)");g.addColorStop(1,"rgb(12,9,7)");c.fillStyle=g;c.fillRect(D.x0-20,D.front,D.x1-D.x0+40,H-D.front);
  c.fillStyle="rgba(255,226,180,0.10)";c.fillRect(D.x0-20,D.front,D.x1-D.x0+40,2);
  // the lamp: its dark shade, its light on the desk
  c.fillStyle="rgb(28,24,20)";c.beginPath();c.ellipse(lx,ly+6,62,12,0,0,TAU);c.fill();c.fillRect(lx-6,ly-230,12,230);
  c.save();c.translate(lx,ly-230);c.fillStyle="rgb(24,30,28)";c.beginPath();c.moveTo(-28,0);c.lineTo(28,0);c.lineTo(88,88);c.lineTo(-88,88);c.closePath();c.fill();
  c.fillStyle="rgba(255,230,190,0.95)";c.beginPath();c.ellipse(0,88,88,11,0,0,TAU);c.fill();c.restore();
  g=c.createRadialGradient(lx,ly-140,0,lx,ly-140,230);g.addColorStop(0,"rgba(255,214,150,0.34)");g.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=g;c.fillRect(lx-230,ly-370,460,460);};
// the sheet, "Most secret", held up facing us (figure space: its middle at cx, cy), or lying on the desk in the place (af_sheetDown)
function af_sheet(ctx,cx,cy,o){o=o||{};const w=228,h=300,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;ctx.translate(cx,cy);ctx.rotate(o.rot||-0.06);
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=14;ctx.shadowOffsetY=6;ctx.fillStyle="rgb(232,224,204)";ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  ctx.fillStyle="rgba(120,90,60,0.12)";ctx.fillRect(-w/2,-h/2,w,h);
  dp_T(ctx,"MOST SECRET",0,-h/2+46,{w:800,size:30,align:"center",col:[150,34,30],ls:1,deco:o.deco?1:0});
  ctx.fillStyle="rgba(60,52,44,0.42)";for(let i=0;i<8;i++)ctx.fillRect(-w/2+26,-h/2+82+i*22,w-52-(i===7?70:i%3*18),3);
  if(o.burn>0)af_burn(ctx,0,h/2-20,w,o.burn);
  ctx.restore();}
// a small coral glow where the sheet is destroyed (u 0 to 1), at its foot
function af_burn(ctx,x,y,w,u){const c=DP.F.coral;ctx.save();ctx.globalCompositeOperation="lighter";const r=w*0.7*ag_eo(u),g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(c,0.7*(1-u*0.5)));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}
function af_sheetDown(ctx,a){if(!(a>0.003))return;const [x,y]=AF_OFFICE.sheet;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgb(222,214,194)";
  ctx.beginPath();ctx.moveTo(x-58,y-22);ctx.lineTo(x+58,y-22);ctx.lineTo(x+72,y+24);ctx.lineTo(x-72,y+24);ctx.closePath();ctx.fill();ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(x-72,y+24,144,3);
  ctx.fillStyle="rgba(150,34,30,0.8)";ctx.fillRect(x-30,y-16,60,4);ctx.fillStyle="rgba(60,52,44,0.4)";for(let i=0;i<4;i++)ctx.fillRect(x-50+i*2,y-6+i*7,100-i*4,1.6);ctx.restore();}
// the pose that reaches a point of the place with the near hand (its middle about 90 px past the wrist), for a person at x, y, s
function af_reachTo(P,px,py,hand){const [x,y,s,flip]=P,A=AG_FIG.anchor,fx=A[0]+(flip?-1:1)*(px-x)/s-90,fy=A[1]+(py-y)/s-8,[a1,a2]=af_reach(fx,fy);return{near:[a1,a2,hand||"rest"]};}
// the sheet as the officer holds it (holdBack: under his hand, in figure space), from held up before him (u 0) to lying flat on the
// desk where AF_OFFICE.sheet is (u 1): the same picture, at the same place, as af_sheetFlat draws on the desk, so when he lets go of
// it the sheet doesn't move. Laid flat, its words are too small to read and are drawn as decoration
function af_heldSheet(c,h,u){const e=ag_sine(clamp(u,0,1)),O=AF_OFFICE,[ox,oy,os]=O.officer,A=AG_FIG.anchor,dx=A[0]+(O.sheet[0]-ox)/os,dy=A[1]+(O.sheet[1]-oy)/os;
  const x=lerp(h.near[0]+50,dx,e),y=lerp(h.near[1]-60,dy,e);c.save();c.translate(x,y);c.scale(lerp(1,0.62,e),lerp(1,0.17,e));af_sheet(c,0,0,{rot:lerp(-0.06,0,e),deco:e>0.01});c.restore();}
function af_sheetFlat(ctx,o){o=o||{};const [x,y]=AF_OFFICE.sheet;ctx.save();ctx.translate(x,y);ctx.scale(0.62,0.17);af_sheet(ctx,0,0,{rot:0,deco:true,a:o.a});ctx.restore();}
// the sheet held up before the officer, destroyed (burn 0 to 1): a small coral glow at its foot, and it's gone
function af_burnSheet(c,h,burn){const x=h.near[0]+50,y=h.near[1]-60;c.save();c.translate(x,y);af_sheet(c,0,0,{rot:-0.06,a:1-ag_in(burn,0.35,0.55)});af_burn(c,0,130,228,burn);c.restore();}
// the gaps between neighbouring huts in a row (not across the path down the middle): [x, top, bottom] for a thin line in each
function af_hutGaps(){const out=[];AF_HUTS.forEach(row=>{for(let k=0;k+1<row.length;k++){const [x0,y0,s0]=row[k],[x1,y1,s1]=row[k+1],e=x0+AF_HUT.w*s0;
  if(x1-e>260)continue;out.push([(e+x1)/2,Math.min(y0,y1)-(AF_HUT.h+AF_HUT.roof+16)*Math.max(s0,s1),Math.max(y0,y1)+6]);}});return out;}

/* ===== An agreement first: the university =====
   The university's places, in the module's hall (films/locks-before-the-data/shared/src/hall.js): the hall with the platform, a tall
   block of clear glass (afHall); and three rooms of the same glass, each with a glass desk: Anil's in the Faculty of Health (afAnil),
   the registrar's office with Mei's long table (afMei), Sam's on the platform team (afSam) and Yusuf's in data governance (afYusuf). People stand behind a desk, cut at
   its back edge, arms down; their cards are on the other side of the frame, never over them. And the pieces the university's scenes
   share: a person's name card, the request, the two papers side by side, the door to the data, the study's own space, a year's ring,
   the chart on Anil's screen, what could happen with nothing written, the agent's card. Prefixed af_. */

/* ---------------------------------------------------------------- a glass desk, painted into a place
   A slab seen from a little above: its back edge at back, its front edge AF_SLAB lower and lit along its length, its front frosted
   down to the frame's foot. A person behind it is drawn with cut: back. */
const AF_SLAB=26;
function af_deskPaint(c,x0,x1,back){const y=back+AF_SLAB,h=H-y,ice=DP.ice;
  c.save();c.beginPath();c.rect(x0,y,x1-x0,h);c.clip();dp_blurDraw(c,c.canvas,x0-20,y-20,x1-x0+40,h+40,x0-20,y-20,x1-x0+40,h+40,14);
  const g=c.createLinearGradient(0,y,0,H);g.addColorStop(0,"rgba(150,220,225,0.10)");g.addColorStop(1,"rgba(150,220,225,0.02)");c.fillStyle=g;c.fillRect(x0,y,x1-x0,h);c.fillStyle="rgba(4,14,18,0.35)";c.fillRect(x0,y,x1-x0,h);c.restore();
  c.save();c.beginPath();c.moveTo(x0+22,back);c.lineTo(x1-22,back);c.lineTo(x1,y);c.lineTo(x0,y);c.closePath();c.fillStyle="rgba(170,235,240,0.12)";c.fill();c.restore();
  c.fillStyle=rgba(ice,0.35);c.fillRect(x0+22,back,x1-x0-44,1.4);
  c.save();c.shadowColor=rgba(DP.F.cyan,0.8);c.shadowBlur=10;c.fillStyle=rgba(mix(ice,[255,255,255],0.3),0.9);c.fillRect(x0,y,x1-x0,2.2);c.restore();
  c.fillStyle=rgba(ice,0.22);c.fillRect(x0,y,1.6,h);c.fillRect(x1-1.6,y,1.6,h);}
const AF_BACK=774;     // every desk's back edge: people behind a desk are cut here

/* ---------------------------------------------------------------- the places: the hall with the platform, and three rooms
   Each a hall of its own (its lights and panes fall where its seed puts them, its floor's lines meet at vx), with pools of light where
   its people stand and its desk */
AG_PLACES.afHall=c=>dp_paintHall(c,{seed:26,horizon:700,vx:820,pools:[[420,900,460,0.10],[1400,880,560,0.08]],after:af_platformPaint});
AG_PLACES.afAnil=c=>dp_paintHall(c,{seed:41,horizon:690,vx:1260,panes:7,pools:[[400,900,420,0.13]],after:c=>af_deskPaint(c,-20,1940,AF_BACK)});
AG_PLACES.afMei=c=>dp_paintHall(c,{seed:52,horizon:700,vx:760,panes:8,pools:[[1480,900,420,0.13],[480,900,420,0.10]],after:c=>af_deskPaint(c,150,1860,AF_BACK)});
AG_PLACES.afSam=c=>dp_paintHall(c,{seed:74,horizon:700,vx:1500,panes:8,pools:[[420,900,420,0.13]],after:c=>af_deskPaint(c,-20,980,AF_BACK)});
AG_PLACES.afYusuf=c=>dp_paintHall(c,{seed:63,horizon:690,vx:1400,panes:7,pools:[[420,900,420,0.13]],after:c=>af_deskPaint(c,-20,1080,AF_BACK)});

/* ---------------------------------------------------------------- the platform, and the study's own space in it
   The platform: a tall block of clear glass in the hall, painted into afHall (its name, "The platform", is drawn live, af_platform).
   The study's own space: a small room of clear glass inside it, named, holding only the four columns it may have (cols(i) 0 to 1 each;
   frost 0 to 1 frosts them over and takes them away, as the study's copy is deleted) */
const AF_PLAT={x:1060,y:150,w:700,h:690,room:[1160,420,500,330]};
function af_platformPaint(c){const P=AF_PLAT;dp_wall(c,P.x,P.y,P.w,P.h,{col:"cyan"});
  c.save();c.strokeStyle="rgba(190,245,245,0.28)";c.lineWidth=1.6;c.beginPath();c.moveTo(P.x+40,P.y-30);c.lineTo(P.x+P.w+40,P.y-30);c.lineTo(P.x+P.w+40,P.y+P.h-40);c.stroke();
  c.beginPath();c.moveTo(P.x,P.y);c.lineTo(P.x+40,P.y-30);c.moveTo(P.x+P.w,P.y);c.lineTo(P.x+P.w+40,P.y-30);c.moveTo(P.x+P.w,P.y+P.h);c.lineTo(P.x+P.w+40,P.y+P.h-40);c.stroke();c.restore();}
function af_platform(ctx,o){o=o||{};const P=AF_PLAT;dp_T(ctx,"The platform",P.x+30,P.y+62,{w:700,size:30,col:"cyan",a:o.a==null?1:o.a});}
const AF_COLS=["course","results","year of birth","learner code"];
function af_room(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const [x,y,w,h]=AF_PLAT.room,col=o.col||"cyan";ctx.save();ctx.globalAlpha*=a;
  dp_wall(ctx,x,y,w,h,{col,a:o.wallA==null?1:o.wallA});
  dp_T(ctx,"Health progress study",x+24,y+52,{w:700,size:30,col});dp_T(ctx,"its own space",x+24,y+92,{w:600,size:28,col:"mut"});
  const cols=o.cols||(()=>1),fr=clamp(o.frost||0,0,1);
  AF_COLS.forEach((c,i)=>{const ca=cols(i)*(1-ag_in(fr,0.55,0.45));if(!(ca>0.003))return;const cw=(w-60)/2,cx=x+24+(i%2)*(cw+12),cy=y+132+Math.floor(i/2)*84;ctx.save();ctx.globalAlpha*=ca;
    dp_panel(ctx,cx,cy,cw,64,{col:"cyan",r:12,glowR:18,behind:o.behind||"afHall"});dp_T(ctx,c,cx+18,cy+42,{w:600,size:28});
    if(fr>0)dp_frost(ctx,cx,cy,cw,64,null,{a:ag_in(fr,0,0.5),col:"grey",behind:o.behind||"afHall"});
    ctx.restore();});
  ctx.restore();}
// where a line from outside reaches the room: its left wall, at its middle
const AF_ROOMIN=[AF_PLAT.room[0],AF_PLAT.room[1]+AF_PLAT.room[3]*0.5];

/* ---------------------------------------------------------------- the door to the data
   A pane of frosted glass in a frame, a pill on it, "Access", a lock on it; open (0 to 1) slides the pane aside, the lock opening, and
   the platform's cyan light shows behind it. Closed, it says access comes last. In afHall it stands in the platform's face. */
const AF_DOOR=[1290,480,240,360];
function af_door(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const [x,y,w,h]=o.rect||AF_DOOR,u=ag_sine(clamp(o.open||0,0,1)),bh=o.behind||"afHall";ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle="rgba(4,14,18,0.82)";ctx.fillRect(x,y,w,h);
  if(u>0){const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(DP.F.cyan,0.5*u));g.addColorStop(1,rgba(DP.F.cyan,0.18*u));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);}
  dp_wall(ctx,x+u*w*0.46,y,w,h,{frosted:true,col:"cyan",behind:bh});dp_lock(ctx,x+u*w*0.46+w-Math.min(46,w*0.22),y+h*0.52,Math.min(46,w*0.24),u>0.5?"green":"cyan",u);ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(DP.ice,0.75);ctx.lineWidth=2.2;ctx.shadowColor=rgba(DP.F.cyan,0.7);ctx.shadowBlur=10;ctx.strokeRect(x-5,y-5,w+10,h+5);ctx.restore();
  dp_pill(ctx,x+w/2,y-28,"Access","cyan",{align:"center",a:o.pillA==null?1:o.pillA});
  ctx.restore();}

/* ---------------------------------------------------------------- people's name cards, the request, the two papers
   af_name: a person's card, their role over their name. af_request: Anil's request (full: who it's from and what for).
   af_twoPapers: the two papers side by side, each coming in by its own k (0 to 1): each person's confidentiality agreement (a person's
   outline) and the data sharing agreement for a use (a folded corner) */
function af_name(ctx,x,y,w,kick,title,o){o=o||{};return dp_card(ctx,x,y,w,{kick,title},{col:o.col||"cyan",a:o.a,k:o.k,behind:o.behind,measure:o.measure});}
function af_request(ctx,x,y,w,o){o=o||{};const col=o.col||AF_ICE;
  return dp_card(ctx,x,y,w,{kick:"Request",title:"Records of the faculty's learners · 2,614",sub:o.full?"From: Anil Kurian · For: a study of how learners progress":null},
    {col,a:o.a,k:o.k,behind:o.behind,measure:o.measure});}
const AF_TWO={w:420,h:212,gap:36};
function af_twoPapers(ctx,x,y,o){o=o||{};const {w,h,gap}=AF_TWO,xb=x+w+gap,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  const one=(k,x0,draw)=>{if(!(k>0.003))return;ctx.save();ctx.globalAlpha*=ag_in(k,0,0.45);ag_about(ctx,x0+w/2,y+h/2,lerp(0.7,1,Math.min(1,ag_spr(k,0,0.9))));draw(x0);ctx.restore();};
  one(o.ka==null?1:o.ka,x,x0=>{dp_panel(ctx,x0,y,w,h,{col:AF_ICE,r:18,behind:o.behind});ctx.save();ctx.translate(x0+70,y+h/2+4);ctx.scale(0.72,0.72);dp_personPic(ctx,0,0,"cyan");ctx.restore();
    dp_T(ctx,"Confidentiality",x0+128,y+h/2-8,{w:800,size:34});dp_T(ctx,"agreement",x0+128,y+h/2+38,{w:800,size:34});});
  one(o.kb==null?1:o.kb,xb,x0=>{af_panelFold(ctx,x0,y,w,h,{behind:o.behind});dp_T(ctx,"Data sharing",x0+40,y+h/2-8,{w:800,size:34});dp_T(ctx,"agreement",x0+40,y+h/2+38,{w:800,size:34});});
  ctx.restore();return{a:[x,y,w,h],b:[xb,y,w,h]};}

/* ---------------------------------------------------------------- a year going round
   A ring of twelve marks, a light running once round it (u 0 to 1), its words beside it */
function af_year(ctx,x,y,r,u,text,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;const c=DP.F.cyan;
  for(let i=0;i<12;i++){const an=-Math.PI/2+i*TAU/12,lit=u*12>i;ctx.fillStyle=lit?rgba(mix(c,[255,255,255],0.3),1):"rgba(190,245,245,0.3)";ctx.beginPath();ctx.arc(x+Math.cos(an)*r,y+Math.sin(an)*r,lit?6:4,0,TAU);ctx.fill();}
  if(u>0){ctx.save();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+TAU*clamp(u,0,1));ctx.stroke();ctx.restore();}
  if(text)dp_T(ctx,text,x+r+26,y+10,{w:700,size:30,col:"cyan"});ctx.restore();}

/* ---------------------------------------------------------------- Anil's screen
   A pane of clear glass standing on his desk, and on it a chart with no labels: bars rising, one missing, a question mark in its
   place. u (0 to 1) brings the bars up one by one */
const AF_SCREEN=[1070,320,600,400];
function af_screen(ctx,u,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const [x,y,w,h]=AF_SCREEN;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgba(190,245,245,0.35)";ctx.fillRect(x+w/2-4,y+h,8,AF_BACK-y-h);ctx.fillRect(x+w/2-70,AF_BACK-6,140,6);
  dp_panel(ctx,x,y,w,h,{col:AF_ICE,r:16,behind:o.behind||"afAnil"});
  ctx.fillStyle="rgba(190,245,245,0.35)";ctx.fillRect(x+60,y+h-60,w-120,2);
  const H0=[0.34,0.42,0.5,null,0.68,0.78],bw=56;H0.forEach((v,i)=>{const bx=x+84+i*80,k=clamp(u*7-i,0,1);if(!(k>0))return;
    if(v==null){dp_T(ctx,"?",bx+bw/2,y+h-90,{w:800,size:64,align:"center",col:"ink",a:ag_in(k,0,0.6)});return;}
    const bh=(h-140)*v*ag_eo(k);ctx.fillStyle=rgba(DP.ice,0.75);rr(ctx,bx,y+h-62-bh,bw,bh,6);ctx.fill();});
  ctx.restore();}

/* ---------------------------------------------------------------- what could happen with nothing written
   A table where names sit beside results, and then who gets extra time: the names and the support hidden under violet frost (personal
   data; no word of it can be read), the results plain. cols (0 to 1) brings in the third column; copies (0 to 1) sends small copies of it
   to a laptop and a shared folder, at the frame's edges */
function af_harm(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const w=760,rh=62,c3=o.third==null?1:o.third,bh=o.behind;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,74+rh*3+16,{col:AF_ICE,r:18,behind:bh});
  const cx=[x+30,x+290,x+520];dp_T(ctx,"Name",cx[0],y+50,{w:700,size:28});dp_T(ctx,"Results",cx[1],y+50,{w:700,size:28,col:"mut"});
  if(c3>0.003)dp_T(ctx,"Exam support",cx[2],y+50,{w:700,size:28,a:ag_in(c3,0,0.5)});
  const names=["Samira Haddad","Tom Ellery","Priya Nair"],sup=["extra time","none","extra time"],res=["90 of 120","75 of 120","105 of 120"];
  for(let i=0;i<3;i++){const ry=y+74+i*rh;
    dp_frost(ctx,cx[0]-10,ry+8,230,rh-16,c=>ag_T(c,names[i],cx[0],ry+rh/2+10,{w:600,size:28,col:[240,240,250],deco:1}),{behind:bh});
    dp_T(ctx,res[i],cx[1],ry+rh/2+10,{w:600,size:28});
    if(c3>0.003){ctx.save();ctx.globalAlpha*=ag_in(c3,0.2,0.6);dp_frost(ctx,cx[2]-10,ry+8,200,rh-16,c=>ag_T(c,sup[i],cx[2],ry+rh/2+10,{w:600,size:28,col:[240,240,250],deco:1}),{behind:bh});ctx.restore();}}
  ctx.restore();}
// a small copy of the table on its way somewhere (u 0 to 1 along from a to b), and where copies end up: a laptop, a shared folder
function af_copy(ctx,a,b,u,al){if(!(al>0.003)||u<=0)return;const e=ag_sine(clamp(u,0,1)),x=lerp(a[0],b[0],e),y=lerp(a[1],b[1],e)-Math.sin(e*Math.PI)*60,w=120,h=76;
  ctx.save();ctx.globalAlpha*=al;ctx.translate(x,y);ctx.rotate((1-e)*-0.1+e*0.06);rr(ctx,-w/2,-h/2,w,h,8);ctx.fillStyle="rgba(10,30,36,0.9)";ctx.fill();ctx.strokeStyle=rgba(DP.ice,0.7);ctx.lineWidth=1.6;ctx.stroke();
  for(let i=0;i<3;i++){ctx.fillStyle=rgba(DP.F.violet,0.85);rr(ctx,-w/2+12,-h/2+14+i*20,34,9,4);ctx.fill();ctx.fillStyle=rgba(DP.ice,0.6);rr(ctx,-w/2+56,-h/2+14+i*20,24,9,4);ctx.fill();
    ctx.fillStyle=rgba(DP.F.violet,0.85);rr(ctx,-w/2+88,-h/2+14+i*20,20,9,4);ctx.fill();}
  ctx.restore();}
function af_laptop(ctx,x,y,a){if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(DP.ice,0.85);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.shadowColor=rgba(DP.ice,0.5);ctx.shadowBlur=8;
  rr(ctx,x-90,y-110,180,116,10);ctx.stroke();ctx.beginPath();ctx.moveTo(x-112,y+6);ctx.lineTo(x+112,y+6);ctx.lineTo(x+128,y+26);ctx.lineTo(x-128,y+26);ctx.closePath();ctx.stroke();ctx.restore();
  dp_T(ctx,"Laptop",x,y+72,{w:700,size:28,align:"center",col:"mut",a});}
function af_folder(ctx,x,y,a){if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(DP.ice,0.85);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.shadowColor=rgba(DP.ice,0.5);ctx.shadowBlur=8;
  ctx.beginPath();ctx.moveTo(x-110,y+26);ctx.lineTo(x-110,y-96);ctx.lineTo(x-40,y-96);ctx.lineTo(x-24,y-78);ctx.lineTo(x+110,y-78);ctx.lineTo(x+110,y+26);ctx.closePath();ctx.stroke();ctx.restore();
  dp_T(ctx,"Shared folder",x,y+72,{w:700,size:28,align:"center",col:"mut",a});}

/* ---------------------------------------------------------------- the agent's card
   An agent signs nothing: its card shows its owner's signature, and says so */
function af_agentCard(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const h=218;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind});dp_T(ctx,"AGENT",x+30,y+54,{w:800,size:28,ls:4,col:"cyan"});
  af_signature(ctx,x+30,y+120,w-60,o.sign==null?1:o.sign,3.4);dp_T(ctx,"Signed for by its owner",x+30,y+178,{w:600,size:28,col:"mut"});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a small label, right-aligned to x, its middle at y
   The Five Safes beside the agreement's lines: ice words on a small pane of frost, a short line of light to the line it names */
function af_label(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const w=dp_tw(ctx,text,{w:700,size:28})+36,h=48;ctx.save();ctx.globalAlpha*=a;
  if(o.to)dp_link(ctx,[x,y],o.to,AF_ICE,1,{lw:1.6,dot:false,alpha:0.7});
  dp_panel(ctx,x-w,y-h/2,w,h,{col:AF_ICE,r:12,glowR:20,behind:o.behind});dp_T(ctx,text,x-w+18,y+10,{w:700,size:28});ctx.restore();}

/* ===== An agreement first: the scenes =====
   Six chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (af_wartime.js, af_hall.js, and the kit's hall); what moves is drawn live in the shots of ag_shots. In one room the camera glides
   and only what changes fades; between rooms the film cuts (cut: true), and dissolves only where the whole picture changes (to the
   past and back). Every chapter opens on a cut (ag_cutInto, at the end). People stand behind their desks with their arms down; the
   recruit's hand is only on the pen, the officer's and the commander's only on the sheet. Cards are never over a person. */

DP_PEOPLE.push([AF_P.recruit,"lamp"],[AF_P.officer,"lamp"],[AF_P.commander,"lamp"],"anil","mei","yusuf","sam");

const af_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a card that springs in at t0 and goes at t1 (or stays): its k (scale) and a (opacity)
const af_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// a phase from 0 to 1 over d seconds from t0, eased
const af_ph=(t,t0,d)=>ag_sine(clamp((t-t0)/(d||1),0,1));
const AF_TITLE="An agreement first",AF_SUB="Two papers before any data";

/* ---------------------------------------------------------------- 1 · Signed first: Bletchley Park, then the university */
// the officer at the commander's desk: his pose and what his hand holds at tt, from the moments of the line (P)
function af_officerAt(tt,P){const O=AF_OFFICE,[ox,oy,os]=O.officer,reach=af_reachTo([ox,oy,os,false],O.sheet[0]-50,O.sheet[1]-2,"hold");
  const d0=P.commanders-0.3,d1=d0+1.0,w1=d1+0.5,b0=P.takes-0.4,b1=b0+0.5,l1=b1+0.9,x0=Math.max(l1,P.destroys+0.1),x1=x0+1.0,h1=x1+0.5;
  if(tt<d0)return{pose:"hold",holdBack:(c,h)=>af_heldSheet(c,h,0),flat:0};
  if(tt<d1){const e=af_ph(tt,d0,1.0);return{pose:"hold",pose2:reach,mix:e,holdBack:(c,h)=>af_heldSheet(c,h,(tt-d0)/1.0),flat:0};}
  if(tt<w1)return{pose:reach,pose2:"hang",mix:af_ph(tt,d1,0.5),flat:1};
  if(tt<b0)return{flat:1};
  if(tt<b1)return{pose:"hang",pose2:reach,mix:af_ph(tt,b0,0.5),flat:1};
  if(tt<l1)return{pose:reach,pose2:"hold",mix:af_ph(tt,b1,0.9),holdBack:(c,h)=>af_heldSheet(c,h,1-(tt-b1)/0.9),flat:0};
  if(tt<x1)return{pose:"hold",holdBack:(c,h)=>af_burnSheet(c,h,(tt-x0)/1.0),flat:0};
  if(tt<h1)return{pose:"hold",pose2:"hang",mix:af_ph(tt,x1,0.5),flat:0};
  return{flat:0};}
// the commander reads, his hand on the sheet while the officer waits
function af_commanderAt(tt,P){const O=AF_OFFICE,[cx,cy,cs]=O.commander,reach=af_reachTo([cx,cy,cs,true],O.sheet[0]+44,O.sheet[1]+2,"rest"),r0=P.commanders+1.2,r1=P.then-0.6;
  if(tt<r0||tt>r1+0.5)return{};return tt<r1?{pose:"hang",pose2:reach,mix:af_ph(tt,r0,0.5)}:{pose:reach,pose2:"hang",mix:af_ph(tt,r1,0.5)};}
function af_desk(x,tt,P,o){o=o||{};const O=AF_OFFICE,[ox,oy,os]=O.officer,[cx,cy,cs]=O.commander,of=o.officer||af_officerAt(tt,P),cm=o.commander||af_commanderAt(tt,P);
  if(of.flat)af_sheetFlat(x);
  dp_person(x,AF_P.commander,cx,cy,cs,Object.assign({t:tt,light:"lamp",flip:true,cut:O.back,gaze:[3,6],nod:0.05},cm));
  dp_person(x,AF_P.officer,ox,oy,os,Object.assign({t:tt+1.3,light:"lamp",gaze:[3,3]},of));}
// the park, its huts up (rows a), their windows lit by lit(r, k, i), and the people crossing it
function af_park(x,tt,o){o=o||{};af_huts(x,{rows:o.rows||[1,1,1],rise:o.rise,lit:o.lit});af_walkers(x,tt,{a:o.walk==null?1:o.walk,lit:o.walkLit});}
// a sheet of a coded message under frost: rows of letters in groups of five, drawn as marks, so that only their rhythm shows
function af_groups(c){c.fillStyle="rgba(240,240,250,0.95)";for(let r=0;r<3;r++)for(let g=0;g<4;g++)for(let k=0;k<5;k++){const h=10+((r*31+g*7+k*13)%5)*1.6;
  c.fillRect(1166+g*78+k*13,560+r*34-h,9,h);}}
// a few windows dark, as on any night: a fixed pattern
const af_someLit=(r,k,i)=>((r*7+k*3+i)%5===0?0.15:1);

scene("first",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({
    work:wAt(sc,"park","work"),by:wAt(sc,"people","By"),nine:wAt(sc,"people","almost"),secret:wAt(sc,"secret","best-kept"),
    ships:c.ships-0.4,codes:c.codes,change:wAt(sc,"codes","change"),word:c.word-0.4,careless:wAt(sc,"word","careless"),
    run:c.run-0.4,sign:wAt(sc,"signed","sign"),open:sc.ends.signed-0.3,part:c.part-0.4,own:wAt(sc,"part","own"),
    named:c.named-0.4,commanders:wAt(sc,"named","commanders"),waits:wAt(sc,"named","waits"),then:wAt(sc,"named","then"),takes:wAt(sc,"named","takes"),
    destroys:wAt(sc,"named","destroys"),read3:sc.ends.named+0.1,away:wAt(sc,"away","nothing"),
    holds:c.holds-0.4,warning:wAt(sc,"never","warning"),thirty:c.thirty-0.4,thousands:wAt(sc,"thirty","thousands"),years:wAt(sc,"thirty","thirty"),
    too:c.too-0.4,ask:wAt(sc,"too","ask"),no:wAt(sc,"no","no"),yes:wAt(sc,"no","yes"),expose:wAt(sc,"no","expose"),
    papers:wAt(sc,"papers","two"),access:wAt(sc,"papers","access"),title:c.breath}));
  const R=af_routes();
  const i=ag_shots(ctx,S,t,sc.dur,[
    // Bletchley Park at night: the house, then the lawn; the huts come up row after row, and people cross between them; then the camera
    // goes to one hut, where the secret is: a sheet of letters under frost, in groups of five, that no one outside may read
    {at:0,place:"afPark",keys:[[0,960,420,1.16],[P.work,960,560,1.0],[P.secret-0.2,1330,690,1.9]],d:3.2,push:0,draw:(x,tt)=>{
      af_park(x,tt,{rows:[0,1,2].map(r=>ag_in(tt,P.by+r*0.5,0.5)),rise:[0,1,2].map(r=>(1-ag_eo(clamp((tt-P.by-r*0.5)/1.2,0,1)))*60),lit:af_someLit,walk:ag_in(tt,P.by+1.6,1.4)});
      const n=af_pop(tt,P.nine-0.2,P.secret-0.6);dp_card(x,540,120,840,{kick:"By 1945",title:"Almost 9,000 people · 3 in 4 women"},{col:AF_ICE,k:n.k,a:n.a,behind:"afPark"});
      const s=ag_in(tt,P.secret+0.9,0.6);if(s>0){x.save();x.globalAlpha*=s;dp_frost(x,1150,520,330,120,af_groups,{behind:"afPark"});dp_lock(x,1478,536,40,"violet",0);x.restore();}}},
    // the sea: a convoy steered round the submarines by what was read; then, with new codes, the route goes dark and the convoy holds its
    // course towards them. Nothing sinks
    {cut:true,at:P.ships,place:"afSea",keys:[[P.ships,960,520,1.0],[P.ships+0.1,980,540,1.06]],d:12,push:0.01,draw:(x,tt)=>{
      const dark=af_ph(tt,P.change,1.8),v=0.03+0.018*(tt-P.ships);
      af_route(x,R.steer,af_ph(tt,P.ships+0.4,2.6),"green",1-ag_in(tt,P.codes+0.3,1.2));af_subs(x,1,tt);af_convoyAt(x,af_between(R.steer,R.straight,v,dark),1);
      dp_pill(x,960,170,"New codes · the messages go dark","coral",{align:"center",a:ag_in(tt,P.codes+0.2,0.5)});}},
    // one careless word: one small figure among many lit coral for a moment, then not
    {cut:true,at:P.word,place:"afPark",keys:[[P.word,960,600,1.05],[P.word+0.1,960,610,1.1]],d:9,push:0.01,draw:(x,tt)=>{
      af_park(x,tt+40,{lit:af_someLit,walkLit:k=>k===4?ag_io(tt,P.careless,P.careless+1.8,0.4):0});}},
    // a promise first: in a hut, the recruit signs the Official Secrets Act before she's told anything; only then does the door open
    {cut:true,at:P.run,place:"afHut",keys:[[P.run,960,540,1.0],[P.run+0.1,990,560,1.07]],d:12,push:0.01,draw:(x,tt)=>{const [rx,ry,rs]=AF_DESK.recruit,u=clamp((tt-P.sign-0.2)/2.4,0,1);
      af_hutDoor(x,af_ph(tt,P.open,1.6));af_form(x,u);
      dp_person(x,AF_P.recruit,rx,ry,rs,{t:tt,light:"lamp",pose:af_signPose(u),cut:AF_DESK.back,gaze:[3,5],hold:af_penHeld});
      const g=af_pop(tt,P.run+0.9,null);dp_tag(x,840,600,"Official Secrets Act · Declaration",AF_ICE,{to:[720,790],p:ag_in(tt,P.run+1.2,0.6),a:g.a,behind:"afHut"});}},
    // each told only their own part: the huts as separate panes, each with its own lamp, a thin coral line between them
    {cut:true,at:P.part,place:"afPark",keys:[[P.part,960,760,1.45],[P.part+0.2,960,560,1.0]],d:2.6,push:0,draw:(x,tt)=>{
      af_park(x,tt+80,{lit:()=>1,walk:0.6});const p=af_ph(tt,P.own-0.2,1.2);af_hutGaps().forEach(([gx,y0,y1],k)=>dp_link(x,[gx,y1],[gx,y0],"coral",clamp(p*1.4-k*0.04,0,1),{lw:2,dot:false,alpha:0.9}));}},
    // a few named commanders: the officer sets the sheet down, waits while it's read, takes it back and destroys it
    {cut:true,at:P.named,place:"afDesk",keys:[[P.named,960,540,1.0],[P.named+0.1,940,560,1.04]],d:12,push:0.01,draw:(x,tt)=>{af_desk(x,tt,P);
      const r=af_pop(tt,P.read3,null);dp_card(x,60,110,580,{title:"Read · taken back · destroyed"},{col:AF_ICE,k:r.k,a:r.a,behind:"afDesk"});
      const w=af_pop(tt,P.away+0.1,null);dp_card(x,60,300,580,{title:"Nothing done with it may give the secret away"},{col:AF_ICE,k:w.k,a:w.a,behind:"afDesk"});}},
    // it holds: the route comes back, and the convoy follows it round
    {cut:true,at:P.holds,place:"afSea",keys:[[P.holds,960,520,1.0],[P.holds+0.1,950,530,1.05]],d:8,push:0.01,draw:(x,tt)=>{
      af_route(x,R.steer,af_ph(tt,P.holds+0.3,1.6),"green",1);af_subs(x,1,tt);af_convoy(x,R.steer,0.2+0.03*(tt-P.holds),1,tt);}},
    // almost thirty years: the park again, and as all those thousands keep it, every window lit
    {cut:true,at:P.thirty,place:"afPark",keys:[[P.thirty,960,560,1.0],[P.thirty+0.1,960,580,1.05]],d:7,push:0.01,draw:(x,tt)=>{
      af_park(x,tt+120,{lit:(r,k,i)=>Math.max(af_someLit(r,k,i),ag_in(tt,P.thousands+((r*5+k*3+i)%7)*0.12,0.4))});
      const y=af_pop(tt,P.years-0.2,null);dp_card(x,540,120,840,{kick:"Until 1974",title:"Kept secret for almost 30 years"},{col:AF_ICE,k:y.k,a:y.a,behind:"afPark"});}},
    // a university holds secrets too: the hall and the platform; the study's request; a no dims it, a yes with nothing written lets
    // a violet haze spread from it; two papers come first, and the door to the data stays closed
    {cut:true,at:P.too,place:"afHall",keys:[[P.too,960,540,1.0],[P.too+0.1,960,540,1.03]],d:16,push:0.01,draw:(x,tt)=>{
      // all of it leaves as the title card comes in, so nothing shows through it
      const out=1-ag_in(tt,P.title-0.3,0.7);if(!(out>0.003))return;x.save();x.globalAlpha*=out;
      af_platform(x,{a:ag_in(tt,P.too+0.4,0.6)});
      const q=af_pop(tt,P.ask-0.1,null),dim=ag_io(tt,P.no,P.yes-0.2,0.4),lit=ag_io(tt,P.yes,P.expose+1.4,0.5);
      if(lit>0)dp_halo(x,510,250,620,"violet",0.32*lit*ag_in(tt,P.expose-0.4,0.8)+0.1*lit);
      af_request(x,110,170,800,{col:dim>0.01?mix(AF_ICE,DP.F.grey,dim):AF_ICE,a:q.a*(1-0.45*dim),k:q.k,behind:"afHall"});
      af_twoPapers(x,110,520,{ka:Math.max(0,tt-P.papers+0.1),kb:Math.max(0,tt-P.papers-0.3),behind:"afHall"});
      af_door(x,{a:ag_in(tt,P.access-0.2,0.7)});x.restore();}}]);
  // the place and the year, top left, in the park and the hut
  const kA=[0,2,3,4,7].includes(i)?(i===0?ag_in(t,c.place-0.2,0.8):1):0;if(kA>0)dp_kicker(ctx,"Bletchley Park · 1939",null,{a:kA});
  dp_title(ctx,S,t,P.title,AF_TITLE,AF_SUB,"FILM 1 OF 8 · ONLY WHAT YOU MAY SEE");});

/* ---------------------------------------------------------------- 2 · A study asks */
const AF_MEI=[1500,600,1],AF_ANIL=[400,600,1],AF_YUSUF=[420,600,1],AF_SAM=[420,600,1];
function af_mei(x,tt,o){const [mx,my,ms]=AF_MEI;dp_person(x,"mei",mx,my,ms,Object.assign({t:tt,cut:AF_BACK,flip:true,gaze:[3,1]},o||{}));}
// three things a purpose and a date leave unsaid: a coral question and an empty line for each
function af_unsaid(x,tt,P){[["Never?",P.never],["Where?",P.where],["What may leave?",P.leave]].forEach(([s,t0],k)=>{const a=ag_in(tt,t0-0.1,0.4)*(1-ag_in(tt,P.harm-0.6,0.5));if(!(a>0.003))return;
  const y=430+k*76,w=dp_pill(x,140,y,s,"coral",{a});x.save();x.globalAlpha*=a;x.fillStyle="rgba(190,245,245,0.35)";x.fillRect(140+w+20,y+6,840-w-60,2);x.restore();});}

scene("asks",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({anil:wAt(sc,"anil","Anil"),progress:wAt(sc,"anil","progress"),support:wAt(sc,"anil","support"),
    asks:wAt(sc,"asks","asks"),office:wAt(sc,"asks","office"),owns:wAt(sc,"owns","Mei"),gave:c.gave,market:wAt(sc,"gave","marketplace"),
    unsaid:wAt(sc,"unsaid","say"),never:wAt(sc,"unsaid","never"),where:wAt(sc,"unsaid","where"),leave:wAt(sc,"unsaid","leave"),
    harm:c.harm,names:wAt(sc,"harm","names"),extra:wAt(sc,"harm","extra"),travel:wAt(sc,"harm","travel"),two:c.two-0.2,each:wAt(sc,"two","each"),use:wAt(sc,"two","use")}));
  const fly=P.office+0.25,land=fly+0.55;
  ag_shots(ctx,S,t,sc.dur,[
    // Anil at his desk in the Faculty of Health: how do its learners progress? A chart with a gap; then his request goes to the registrar
    {at:0,place:"afAnil",keys:[[0,960,540,1.0],[0.1,950,540,1.03]],d:14,push:0.01,draw:(x,tt)=>{const [ax,ay,as]=AF_ANIL;
      dp_person(x,"anil",ax,ay,as,{t:tt,cut:AF_BACK,gaze:[3,1]});
      af_screen(x,clamp((tt-P.progress+0.2)/1.8,0,1),{a:ag_in(tt,P.progress-0.5,0.5)});
      const n=af_pop(tt,P.anil-0.1,P.asks-0.3);af_name(x,1070,110,520,"Faculty of Health","Anil Kurian",{k:n.k,a:n.a,behind:"afAnil"});
      const q=af_pop(tt,P.asks,null),go=clamp((tt-fly)/0.45,0,1),dx=100*ag_sine(go);af_request(x,1000+dx,110,800,{k:q.k,a:q.a*(1-go),behind:"afAnil"});}},
    // the registrar's office: the request lands by Mei, who owns the records. What two films gave it, and what neither says
    {cut:true,at:land-0.25,place:"afMei",keys:[[land-0.25,960,540,1.0],[land,970,540,1.03]],d:30,push:0.01,draw:(x,tt)=>{af_mei(x,tt);
      const m=af_pop(tt,P.owns-0.1,null);af_name(x,1290,110,560,"Owner · registrar's office","Mei Tanaka",{k:m.k,a:m.a,behind:"afMei"});
      const ar=clamp((tt-land+0.25)/0.5,0,1),lx=lerp(10,110,ag_eo(ar));af_request(x,lx,150,800,{full:true,a:ag_sine(ar),behind:"afMei"});
      const g=af_pop(tt,P.gave,P.unsaid-0.4),mk=af_pop(tt,P.market-0.1,P.unsaid-0.4);
      const b1=dp_card(x,110,380,400,{kick:"Access",title:"A purpose and an end date"},{col:AF_ICE,k:g.k,a:g.a,behind:"afMei"});dp_tag(x,110,b1.y+b1.h+24,"Who may see it",AF_ICE,{a:g.a,behind:"afMei"});
      const b2=dp_card(x,540,380,400,{kick:"Requests",title:"Asked in one place"},{col:AF_ICE,k:mk.k,a:mk.a,behind:"afMei"});dp_tag(x,540,b2.y+b2.h+24,"The marketplace",AF_ICE,{a:mk.a,behind:"afMei"});
      af_unsaid(x,tt,P);
      // left unsaid: names beside results, then who gets extra time; copies travel to a laptop and a shared folder
      const h=ag_in(tt,P.names-0.3,0.5)*(1-ag_in(tt,P.two,0.5));af_harm(x,110,380,{a:h,third:ag_in(tt,P.extra-0.1,0.6),behind:"afMei"});
      const cp=ag_in(tt,P.travel-0.2,0.5)*(1-ag_in(tt,P.two,0.5));af_laptop(x,240,770,cp);af_folder(x,720,770,cp);
      af_copy(x,[490,520],[240,700],(tt-P.travel)/1.4,cp);af_copy(x,[560,520],[720,712],(tt-P.travel-0.4)/1.4,cp);
      af_twoPapers(x,110,420,{ka:Math.max(0,tt-P.each),kb:Math.max(0,tt-P.use+0.2),behind:"afMei"});}}]);
  dp_kicker(ctx,"Monday 5 October 2026",null,{a:ag_in(t,0.3,0.8)});});

/* ---------------------------------------------------------------- 3 · A promise from each person */
const AF_BADGES=["Staff","Contractors","Researchers","The data team"];
// those who sign it: a badge each, and a green tick, "Signed", as each is named
function af_signers(x,tt,ks){AF_BADGES.forEach((s,k)=>{const u=ks[k];if(!(u>0.003))return;const bx=240+k*306,by=640,w=290;x.save();x.globalAlpha*=ag_in(u,0,0.4);
  dp_panel(x,bx,by,w,92,{col:AF_ICE,r:16,glowR:24,behind:"hall"});x.save();x.translate(bx+44,by+50);x.scale(0.46,0.46);dp_personPic(x,0,0,"cyan");x.restore();
  dp_T(x,s,bx+86,by+56,{w:700,size:28});const tk=clamp((u-0.35)/0.5,0,1);if(tk>0){dp_tick(x,bx+22,by+128,"green",tk);dp_T(x,"Signed",bx+56,by+138,{w:700,size:28,col:"green",a:tk});}
  x.restore();});}

scene("promise",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({own:wAt(sc,"own","confidentiality"),l:[c.l1,c.l2,c.l3,c.l4,c.l5,c.l6],
    who:[wAt(sc,"everyone","staff"),wAt(sc,"everyone","contractors"),wAt(sc,"everyone","researchers"),wAt(sc,"everyone","team")],
    every:wAt(sc,"yearly","every"),yusuf:wAt(sc,"yearly","Yusuf"),groups:c.groups-0.3,only:wAt(sc,"groups","only"),signed:wAt(sc,"groups","signed"),
    agent:c.agent-0.2,owner:wAt(sc,"agent","owner"),ai:wAt(sc,"agent","AI"),renewed:wAt(sc,"renewed","renewed"),bl:c.bletchley-0.2,outlasts:wAt(sc,"bletchley","outlasts")}));
  const sigs=k=>clamp((t-P.who[k])/0.9,0,1);
  ag_shots(ctx,S,t,sc.dur,[
    // the first paper, each person's own: its six lines, set down as they're said; those who sign it; a year going round
    {at:0,place:"hall",keys:[[0,960,540,1.0],[0.1,960,540,1.02]],d:30,push:0.01,draw:(x,tt)=>{
      const p=af_pop(tt,0.05,null);af_promise(x,530,80,860,{kick:"Each person's own",show:i=>ag_in(tt,P.l[i]-0.15,0.4),glow:i=>ag_io(tt,P.l[i]-0.15,i<5?P.l[i+1]-0.15:P.l[5]+2.2,0.3),k:p.k,a:p.a,behind:"hall"});
      af_signers(x,tt,[0,1,2,3].map(k=>clamp((tt-P.who[k]+0.2)/0.9,0,1)));
      af_door(x,{rect:[1500,560,150,220],open:af_ph(tt,P.who[3]+1.2,1.2),a:ag_in(tt,P.who[0]-0.3,0.6),pillA:0,behind:"hall"});
      af_year(x,1490,190,44,clamp((tt-P.every)/2.2,0,1),"Every year",{a:ag_in(tt,P.every-0.3,0.4)});}},
    // Yusuf, in data governance, keeps them
    {cut:true,at:P.yusuf-0.15,place:"afYusuf",keys:[[P.yusuf-0.15,960,540,1.0],[P.yusuf,960,540,1.03]],d:6,push:0.01,draw:(x,tt)=>{const [yx,yy,ys]=AF_YUSUF;
      dp_person(x,"yusuf",yx,yy,ys,{t:tt,cut:AF_BACK,gaze:[3,1]});af_name(x,60,110,560,"Data governance","Yusuf Demir",{behind:"afYusuf"});
      af_register(x,880,170,960,{h:520,kick:"Confidentiality",title:"Signed agreements",keeper:"Renewed every year",open:ag_in(tt,P.yusuf+0.3,0.8),behind:"afYusuf",
        rows:["Anil Kurian","Mei Tanaka","Sam Okafor","Yusuf Demir"].map((n,k)=>[n,{tick:clamp((tt-P.yusuf-0.6-k*0.25)/0.5,0,1)}])});}},
    // access comes through groups: the study's group, and Anil in it only while his promise is signed and current; an agent signs nothing
    {cut:true,at:P.groups,place:"hall",keys:[[P.groups,960,540,1.0],[P.groups+0.1,960,540,1.02]],d:20,push:0.01,draw:(x,tt)=>{
      const st=tt<P.only-0.1?"signed":tt<P.only+1.3?"renew":tt<P.signed-0.1?"lapsed":"signed",ch=[P.only-0.1,P.only+1.3,P.signed-0.1].filter(v=>v<=tt).pop(),
        paused=st==="lapsed"?ag_in(tt,P.only+1.4,0.5):0,g=af_pop(tt,P.groups+0.2,null);
      af_group(x,300,150,760,{title:"Health progress study",members:[{name:"Anil Kurian",state:st,paused,pillA:ch==null?1:ag_in(tt,ch,0.25)}],k:g.k,a:g.a,behind:"hall"});
      dp_tag(x,300,420,"Who is it, really?",AF_ICE,{a:ag_in(tt,P.groups+0.8,0.5),behind:"hall"});
      const ra=af_pop(tt,P.renewed,null);if(ra.a>0)dp_slip(x,300,520,"Renewed · Monday 2 February 2026","green",{a:ra.a,behind:"hall"});
      const ag=ag_in(tt,P.agent,0.6);if(ag>0){ag_model(x,1360,300,74,{t:tt,a:ag,col:"cyan"});
        af_agentCard(x,1150,430,500,{a:ag_in(tt,P.agent+0.3,0.5),sign:clamp((tt-P.owner)/1.4,0,1),behind:"hall"});
        dp_tag(x,1150,690,"AI agents in data work",AF_ICE,{a:ag_in(tt,P.ai-0.1,0.5),behind:"hall"});}}},
    // as at Bletchley: the recruit's signed form under the lamp; then the six lines again
    {at:P.bl,dis:0.9,place:"afHut",keys:[[P.bl,860,540,1.2],[P.bl+0.1,850,550,1.24]],d:3,push:0.01,draw:(x,tt)=>{const [rx,ry,rs]=AF_DESK.recruit;
      af_hutDoor(x,1);af_form(x,1);dp_person(x,AF_P.recruit,rx,ry,rs,{t:tt,light:"lamp",pose:af_signPose(1),cut:AF_DESK.back,gaze:[3,5],hold:af_penHeld});}},
    {at:P.outlasts-0.5,dis:0.9,place:"hall",keys:[[P.outlasts-0.5,960,540,1.0],[P.outlasts,960,540,1.02]],d:4,push:0.01,draw:(x,tt)=>{
      af_promise(x,530,80,860,{kick:"Each person's own",glow:i=>i===5?ag_in(tt,P.outlasts,0.6):0,behind:"hall"});}}]);});

/* ---------------------------------------------------------------- 4 · An agreement for each use */
const AF_AG={x:300,y:84,w:1440};
// the register of agreements, as a table: what was agreed, by whom, until when
const AF_LEDGER={x:720,y:170,w:1160,head:[["What was agreed",0],["By whom",470],["Until",850]],row:["2026-14 · learner records","Mei Tanaka, Anil Kurian","30 June 2027"]};
const AF_SAFES=[["project","purpose"],["data",["may","never"]],["people","who"],["setting","where"],["outputs","leave"]];
scene("agreement",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({purpose:c.purpose,from:c.from,may:c.may,course:wAt(sc,"may","course"),never:wAt(sc,"never","Never"),
    who:c.who,where:c.where,leave:c.leave,ends:c.ends,safe:{people:wAt(sc,"safes","people"),project:wAt(sc,"safes","project"),setting:wAt(sc,"safes","setting"),data:wAt(sc,"safes","data"),outputs:wAt(sc,"safes","outputs")},
    mei:wAt(sc,"sign","Mei"),decides:wAt(sc,"sign","decides"),anil:wAt(sc,"sign","Anil"),register:c.register-0.3,agreed:wAt(sc,"register","agreed"),
    bl:c.bletchley-0.2,named:wAt(sc,"bletchley","named"),stays:wAt(sc,"bletchley","stays"),leaves:wAt(sc,"bletchley","leaves")}));
  const signs=tt=>({mei:clamp((tt-P.mei)/1.6,0,1),anil:clamp((tt-P.anil)/1.6,0,1),chip:ag_in(tt,P.anil+1.5,0.4)}),full={purpose:1,from:1,may:1,never:1,who:1,where:1,leave:1,ends:1};
  const agree=(x,tt,o)=>af_agreement(x,AF_AG.x,AF_AG.y,AF_AG.w,Object.assign({behind:"hall"},o));
  ag_shots(ctx,S,t,sc.dur,[
    // Mei and Anil at her table, the second paper between them
    {at:0,place:"afMei",keys:[[0,960,540,1.0],[0.1,960,540,1.03]],d:6,push:0.01,draw:(x,tt)=>{
      dp_person(x,"anil",AF_ANIL[0],600,1,{t:tt,cut:AF_BACK,gaze:[3,1]});af_mei(x,tt);
      const p=af_pop(tt,0.6,null);dp_card(x,660,360,600,{kick:"Data sharing agreement",title:"2026-14"},{col:AF_ICE,k:p.k,a:p.a,behind:"afMei"});}},
    // the agreement, line by line; the Five Safes beside its lines; Mei signs as the owner, Anil for the study
    {cut:true,at:P.purpose-0.3,place:"hall",keys:[[P.purpose-0.3,960,540,1.0],[P.purpose,960,540,1.015]],d:60,push:0.006,draw:(x,tt)=>{
      const b=agree(x,tt,{show:k=>ag_in(tt,P[k]-0.15,0.4),may:ag_in(tt,P.course,0.7),never:ag_in(tt,P.never+0.2,0.7),signs:signs(tt),date:"Monday 12 October 2026",dateA:ag_in(tt,P.anil+1.6,0.5)});
      const rowY=k=>{const i=AF_AGREE.findIndex(r=>r[0]===k),r=b.rows[i];return r.y+r.h/2-14;};
      AF_SAFES.forEach(([s,k])=>{const y=Array.isArray(k)?(rowY(k[0])+rowY(k[1]))/2:rowY(k);af_label(x,AF_AG.x-24,y,s,{a:ag_in(tt,P.safe[s]-0.1,0.4),to:[AF_AG.x,y],behind:"hall"});});
      dp_tag(x,24,b.footY+6,"Who decides",AF_ICE,{a:ag_in(tt,P.decides-0.1,0.5)*(1-ag_in(tt,P.register-0.6,0.4)),to:[AF_AG.x+36,b.footY+50],behind:"hall"});}},
    // Yusuf keeps it in the register of agreements
    {cut:true,at:P.register,place:"afYusuf",keys:[[P.register,960,540,1.0],[P.register+0.1,960,540,1.03]],d:7,push:0.01,draw:(x,tt)=>{const [yx,yy,ys]=AF_YUSUF;
      dp_person(x,"yusuf",yx,yy,ys,{t:tt,cut:AF_BACK,gaze:[3,1]});af_name(x,60,110,560,"Data governance","Yusuf Demir",{behind:"afYusuf"});
      af_ledger(x,AF_LEDGER.x,AF_LEDGER.y,AF_LEDGER.w,{kick:"Data sharing",title:"Register of agreements",head:AF_LEDGER.head,ghosts:2,a:ag_in(tt,P.register+0.2,0.5),behind:"afYusuf",
        rows:[{cells:AF_LEDGER.row,glow:ag_io(tt,P.agreed,P.agreed+3,0.5),a:ag_in(tt,P.register+0.8,0.6)}]});}},
    // as at Bletchley: the officer's hand on the sheet
    {at:P.bl,dis:0.9,place:"afDesk",keys:[[P.bl,980,660,1.45],[P.bl+0.1,990,670,1.5]],d:3,push:0.01,draw:(x,tt)=>{
      af_desk(x,tt,null,{officer:{pose:af_reachTo([AF_OFFICE.officer[0],AF_OFFICE.officer[1],1,false],AF_OFFICE.sheet[0]-50,AF_OFFICE.sheet[1]-2,"hold"),flat:1},commander:{}});}},
    // and back to the agreement: who, where, and what may leave, each lit in turn
    {at:P.named-0.6,dis:0.9,place:"hall",keys:[[P.named-0.6,960,540,1.0],[P.named,960,540,1.015]],d:6,push:0.006,draw:(x,tt)=>{
      agree(x,tt,{may:1,never:1,signs:{mei:1,anil:1,chip:1},date:"Monday 12 October 2026",dateA:1,hi:k=>k==="who"?ag_io(tt,P.named,P.stays-0.2,0.3):k==="where"?ag_io(tt,P.stays,P.leaves-0.2,0.3):k==="leave"?ag_in(tt,P.leaves,0.3):0});}}]);});

/* ---------------------------------------------------------------- 5 · Access, made from the agreement */
const AF_CON={x:80,y:345,w:780},AF_AGY=140;
// the agreement and its contract, at the hall's left: the contract is set down under the agreement (con: its k and a, as af_pop gives them)
function af_papersLeft(x,tt,o){const con=o.con||{k:1,a:1};
  if(con.a>0.003)af_contract(x,AF_CON.x,AF_CON.y,AF_CON.w,{hi:o.hi,ended:o.ended,a:con.a,k:con.k,behind:"afHall"});
  if(o.glow>0)dp_halo(x,AF_CON.x+AF_CON.w/2,AF_AGY+90,460,"cyan",0.22*o.glow);
  dp_card(x,AF_CON.x,AF_AGY,AF_CON.w,{kick:"Data sharing agreement",title:"2026-14",sub:"For a study in the Faculty of Health"},{col:AF_ICE,k:o.k,a:o.a,behind:"afHall"});}
const AF_LINE0=[AF_CON.x+AF_CON.w,AF_CON.y+130];
scene("grant",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({made:wAt(sc,"now","made"),written:wAt(sc,"contract","written"),
    columns:wAt(sc,"terms","columns"),group:wAt(sc,"terms","group"),endT:wAt(sc,"terms","end"),team:wAt(sc,"hand","team"),grant:wAt(sc,"hand","grant"),hand:wAt(sc,"hand","hand"),give:wAt(sc,"hand","give"),
    every:wAt(sc,"names","Every"),no:wAt(sc,"names","No"),nov:c.november,faculty:wAt(sc,"november","faculty"),newP:wAt(sc,"stretch","new"),stretch:wAt(sc,"stretch","stretch"),
    support:c.support-0.3,own:wAt(sc,"support","own")}));
  const hi=tt=>i=>[P.columns,P.group,P.endT].map((v,k,a)=>ag_io(tt,v-0.1,k<2?a[k+1]-0.2:P.endT+2.2,0.3))[i];
  const i=ag_shots(ctx,S,t,sc.dur,[
    // the hall and the platform: only now comes access; the agreement, and its contract, which the platform reads
    {at:0,place:"afHall",keys:[[0,960,540,1.0],[0.1,960,540,1.02]],d:20,push:0.01,draw:(x,tt)=>{af_platform(x);
      af_papersLeft(x,tt,{glow:ag_io(tt,P.made-0.1,P.made+1.6,0.4),con:af_pop(tt,P.written,null),hi:hi(tt)});}},
    // Sam, on the platform team, makes the grant from the contract, never by hand
    {cut:true,at:P.team-0.4,place:"afSam",keys:[[P.team-0.4,960,540,1.0],[P.team,960,540,1.03]],d:6,push:0.01,draw:(x,tt)=>{const [sx,sy,ss]=AF_SAM;
      dp_person(x,"sam",sx,sy,ss,{t:tt,cut:AF_BACK,gaze:[3,1]});af_name(x,60,110,560,"Platform team","Sam Okafor",{behind:"afSam"});
      af_contract(x,1000,250,800,{behind:"afSam"});dp_link(x,[1800,420],[1940,420],"cyan",af_ph(tt,P.grant,0.6),{lw:4,dot:false});
      const hd=ag_in(tt,P.hand-0.1,0.3)*(1-ag_in(tt,P.hand+1.1,0.5)),u=clamp((tt-P.hand)/1.2,0,1);if(hd>0){x.save();x.globalAlpha*=hd;x.strokeStyle=rgba(DP.ice,0.8);x.lineWidth=2.4;x.setLineDash([10,9]);x.lineCap="round";
        x.beginPath();for(let k=0;k<=40*u;k++){const v=k/40,xx=lerp(640,1400,v),yy=lerp(724,690,v)+Math.sin(v*23)*10+Math.sin(v*61)*4;k?x.lineTo(xx,yy):x.moveTo(xx,yy);}x.stroke();x.restore();}}},
    // back in the hall: the grant has reached the study's own space, its four columns and nothing else, the line named by its agreement;
    // in November a new purpose stops at the agreement's edge
    {cut:true,at:P.give-0.2,place:"afHall",keys:[[P.give-0.2,960,540,1.0],[P.give,960,540,1.02]],d:24,push:0.01,draw:(x,tt)=>{af_platform(x);
      af_papersLeft(x,tt,{});const lp=0.55+0.45*af_ph(tt,P.give-0.2,0.5);dp_link(x,AF_LINE0,AF_ROOMIN,"cyan",lp,{lw:4});
      af_room(x,{a:ag_in(tt,P.give,0.4),cols:k=>ag_in(tt,P.give+0.4+k*0.18,0.35)});
      if(tt>P.every-0.2&&tt<P.every+1.6)dp_halo(x,1000,400,220,"cyan",0.25*ag_io(tt,P.every-0.2,P.every+1.4,0.4));
      const tg=ag_in(tt,P.give+0.6,0.5);dp_tag(x,860,370,"Agreement 2026-14","cyan",{a:tg,to:[1010,AF_LINE0[1]+(AF_ROOMIN[1]-AF_LINE0[1])*0.5],behind:"afHall"});
      dp_pill(x,AF_CON.x,780,"No agreement, no grant","coral",{a:ag_in(tt,P.no,0.4)*(1-ag_in(tt,P.nov,0.5))});
      // November: the faculty asks the study for names; the request travels to the study's space and stops at its wall
      const rq=af_pop(tt,P.faculty,null),RW=700,rx=lerp(40,AF_PLAT.x-RW-6,ag_eo(clamp((tt-P.faculty)/1.6,0,1)));
      if(rq.a>0){dp_card(x,rx,740,RW,{kick:"Request · to call them",title:"Names of learners who need support"},{col:AF_ICE,a:rq.a,behind:"afHall"});
        const st=ag_in(tt,P.faculty+1.4,0.4);if(st>0)dp_link(x,[AF_PLAT.x,744],[AF_PLAT.x,858],"coral",1,{lw:4,dot:false,alpha:st});
        dp_pill(x,AF_PLAT.x+24,818,"Not in 2026-14","coral",{a:ag_in(tt,P.stretch-0.1,0.4)});}}},
    // the support team asks Mei for an agreement of its own: a new paper, empty but for its purpose to come
    {cut:true,at:P.support,place:"afMei",keys:[[P.support,960,540,1.0],[P.support+0.1,970,540,1.03]],d:5,push:0.01,draw:(x,tt)=>{af_mei(x,tt);
      af_name(x,1290,110,560,"Owner · registrar's office","Mei Tanaka",{behind:"afMei"});
      const sp=clamp((tt-P.support-0.4)/0.6,0,1),lx=lerp(10,110,ag_eo(sp));x.save();x.globalAlpha*=ag_sine(sp);
      const b=af_paper(x,lx,200,820,{kick:"Data sharing agreement",title:"Student support team",rows:[{label:"Purpose",text:"To call learners who need support"},{label:"May have",lines:[""]},{label:"Ends",lines:[""]},{label:"Signed",lines:[""]}]},{behind:"afMei",labelW:180});
      x.save();x.fillStyle="rgba(190,245,245,0.3)";b.rows.slice(1).forEach(r=>x.fillRect(lx+AF_PAD+180,r.base+6,420,1.6));x.restore();x.restore();}}]);
  dp_kicker(ctx,"November 2026",null,{a:i>=2?ag_in(t,P.nov,0.6):0});});

/* ---------------------------------------------------------------- 6 · When it ends */
scene("ends",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({ends:wAt(sc,"itself","ends"),deleted:wAt(sc,"deleted","deleted"),yusuf:wAt(sc,"deleted","Yusuf"),closes:wAt(sc,"deleted","closes"),
    totals:c.totals-0.3,holds:wAt(sc,"holds","promise"),leaves:wAt(sc,"holds","leaves"),bl:c.bletchley-0.2,learned:c.learned-0.3,end:c.end-0.3,start:wAt(sc,"end","start"),fin:c.breath}));
  const twoUp=(x,tt,o)=>{af_totals(x,140,190,700,{behind:"hall",a:o.ta,k:o.tk});af_promise(x,930,110,860,{kick:"Anil Kurian's",who:"Anil Kurian",sign:1,chip:1,seed:2.2,glow:i=>i===5?(o.glow||0):0,a:o.pa,k:o.pk,behind:"hall"});};
  const i=ag_shots(ctx,S,t,sc.dur,[
    // the grant ends by itself on its date: the line from the contract thins to nothing; the study's copy frosts over and is gone
    {at:0,place:"afHall",keys:[[0,960,540,1.0],[0.1,960,540,1.02]],d:12,push:0.01,draw:(x,tt)=>{af_platform(x);af_papersLeft(x,tt,{ended:tt>P.ends});
      const th=1-af_ph(tt,P.ends,1.8);if(th>0.01)dp_link(x,AF_LINE0,AF_ROOMIN,"cyan",1,{lw:4*th,alpha:th});
      af_room(x,{cols:()=>1,frost:clamp((tt-P.deleted)/1.4,0,1)});
      const gy=af_ph(tt,P.ends,1.2);dp_tag(x,860,370,"Agreement 2026-14",mix(DP.T.cyan,DP.T.grey,gy),{behind:"afHall"});}},
    // Yusuf closes the agreement in the register
    {cut:true,at:P.yusuf-0.2,place:"afYusuf",keys:[[P.yusuf-0.2,960,540,1.0],[P.yusuf,960,540,1.03]],d:6,push:0.01,draw:(x,tt)=>{const [yx,yy,ys]=AF_YUSUF;
      dp_person(x,"yusuf",yx,yy,ys,{t:tt,cut:AF_BACK,gaze:[3,1]});af_name(x,60,110,560,"Data governance","Yusuf Demir",{behind:"afYusuf"});
      const cl=ag_in(tt,P.closes,0.5);af_ledger(x,AF_LEDGER.x,AF_LEDGER.y,AF_LEDGER.w,{kick:"Data sharing",title:"Register of agreements",head:AF_LEDGER.head,ghosts:2,behind:"afYusuf",
        rows:[{cells:AF_LEDGER.row,col:cl>0.5?"mut":"ink",pill:"Closed",pillA:cl}]});}},
    // the totals stay; Anil's promise holds
    {cut:true,at:P.totals,place:"hall",keys:[[P.totals,960,540,1.0],[P.totals+0.1,960,540,1.02]],d:10,push:0.01,draw:(x,tt)=>{const a=af_pop(tt,P.totals+0.2,null),b=af_pop(tt,P.holds-0.2,null);
      twoUp(x,tt,{ta:a.a,tk:a.k,pa:b.a,pk:b.k,glow:ag_in(tt,P.leaves-0.3,0.6)});}},
    // at Bletchley: the huts at night, every window dark but one
    {at:P.bl,dis:1.0,place:"afPark",keys:[[P.bl,960,560,1.0],[P.bl+0.1,960,570,1.04]],d:6,push:0.01,draw:(x,tt)=>{af_park(x,tt+200,{lit:(r,k,i)=>r===1&&k===3&&i===2?1:0,walk:0});}},
    // the study learned what it needed, and named no one: the totals and Anil's promise, side by side
    {at:P.learned,dis:1.0,place:"hall",keys:[[P.learned,960,540,1.0],[P.learned+0.1,960,540,1.02]],d:10,push:0.01,draw:(x,tt)=>twoUp(x,tt,{glow:0})},
    // access is the end of an agreement: the two papers, and the door to the data at their end, opening a little, then closing
    {at:P.end,later:true,dis:0.5,place:"hall",keys:[[P.end,960,540,1.0],[P.end+0.1,960,540,1.02]],d:6,push:0.01,draw:(x,tt)=>{const out=1-ag_in(tt,P.fin-0.4,0.8);if(!(out>0.003))return;
      x.save();x.globalAlpha*=out;af_twoPapers(x,240,430,{ka:Math.max(0,tt-P.end-0.5),kb:Math.max(0,tt-P.end-0.8),behind:"hall"});
      af_door(x,{rect:[1400,410,240,360],open:0.4*Math.sin(Math.PI*clamp((tt-P.start-0.4)/3.2,0,1)),a:ag_in(tt,P.end+1.2,0.6),behind:"hall"});x.restore();}}]);
  dp_kicker(ctx,"Wednesday 30 June 2027",null,{a:i===0?ag_in(t,0.3,0.8):0});
  dp_end(ctx,S,t,P.fin,AF_TITLE,"Access is the end of an agreement, not the start.","Film 1 of 8","Only what you may see");
  if(t>P.fin)dp_T(ctx,"Next: Know what you hold",960,790,{w:600,size:28,align:"center",col:"mut",a:ag_in(t,P.fin+1.4,0.8)});});

ag_cutInto(["asks","promise","agreement","grant","ends"]);

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

/* ===== Data protection and privacy: what a film needs before it starts, and the video's motion blur =====
   prepAssets takes the place of the engine's: the fonts, and the tools' logos for a film that shows them; then the film's pictures,
   each made once and kept: each place (AG_PLACES) and its frost (glass.js), and each person the film lists in DP_PEOPLE, in their light
   (night.js). The video and the checks make them all before they start. The site's player makes the first place and its frost at once
   (the poster covers the film until then), and the rest one picture at a time while the page is idle, once the film has started, so
   nothing holds the page or the soundtrack for long; whatever is drawn before its turn comes is made the first time it's drawn. */
function dp_prepList(){const L=[];Object.keys(AG_PLACES).forEach(k=>{L.push(()=>ag_place(k),()=>dp_frostPlace(k));});
  DP_PEOPLE.forEach(p=>{const [who,light]=Array.isArray(p)?p:[p];L.push(...dp_prepSteps(who,light));});return L;}
async function prepAssets(){await fontsReady3();if(typeof LOGO_SRC!=="undefined")await loadLogos();const steps=dp_prepList();
  if(window.__RENDER__){steps.forEach(f=>f());return;}
  const cv=document.getElementById("film");if(cv&&Object.keys(AG_PLACES).length){steps.shift()();steps.shift()();}
  let i=0;const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:1000}):setTimeout(f,60);
  const next=()=>{if(i>=steps.length)return;steps[i++]();idle(next);},go=()=>setTimeout(()=>idle(next),200);
  const box=cv&&cv.closest(".player");if(!box)return;if(box.classList.contains("started")){go();return;}
  const mo=new MutationObserver(()=>{if(box.classList.contains("started")){mo.disconnect();go();}});mo.observe(box,{attributes:true,attributeFilter:["class"]});}
// the video's motion blur, as the agent films': each frame is the average of eight moments while a shutter is open a third of a frame
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
