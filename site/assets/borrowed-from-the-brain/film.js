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

// Borrowed from the brain, the second film of What an agent is, the first series on agentic data engineering. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years and numbers in words). The few longer stops are in breath.js.
const NARR={
"nature":{"name":"Why look to nature","lead":1.6,"tail":0.6,"vo":[
 {"id":"start","gap":0.8,"text":"In 1958, the psychologist Frank Rosenblatt showed a program that learned from examples: the perceptron.","say":"In nineteen fifty-eight, the psychologist Frank Rosenblatt showed a program that learned from examples: the perceptron."},
 {"id":"cell","gap":0.8,"text":"He modelled it on a nerve cell."},
 {"id":"why","gap":0.8,"text":"Why look to nature to build a machine?"},
 {"id":"trying","gap":0.8,"text":"Because nature has been trying out designs for billions of years, and keeping the ones that work."},
 {"id":"birds","gap":0.8,"text":"People watched birds for centuries before they could fly."},
 {"id":"wright","gap":0.8,"text":"Wilbur Wright noticed buzzards twisting their wingtips to keep their balance."},
 {"id":"twist","gap":0.8,"text":"So the brothers built that twist into their wings."},
 {"id":"seed","gap":0.8,"text":"Engineers still study the maple seed, which spins down like a tiny helicopter."},
 {"id":"example","gap":0.8,"text":"And for a machine that learns, nature had the only working example: a brain."},
 {"id":"wired","gap":0.8,"text":"But in 1888, nobody could see how a brain was wired.","say":"But in eighteen eighty-eight, nobody could see how a brain was wired."}]},
"cajal":{"name":"A thicket","lead":0.8,"tail":1.0,"vo":[
 {"id":"barcelona","gap":0.8,"text":"Barcelona, 1888. Santiago Ramón y Cajal, a doctor, teaches anatomy.","say":"Barcelona, eighteen eighty-eight. Santiago Ramón y Cajal, a doctor, teaches anatomy."},
 {"id":"slices","gap":0.8,"text":"He looks at thin slices of brain under a microscope."},
 {"id":"thicket","gap":0.8,"text":"Under the lens, the brain is a thicket of fibres, too dense to follow."},
 {"id":"net","gap":0.8,"text":"Many scientists, among them the Italian Camillo Golgi, think the fibres are fused into one continuous net."},
 {"id":"nobody","gap":0.8,"text":"If they are, nobody can say where a message starts, or how a brain learns."},
 {"id":"stroke","gap":0.8,"text":"When a stroke cuts off the blood to part of someone's brain, it can take away their speech."},
 {"id":"doctors","gap":0.8,"text":"Doctors can't tell what it has broken, or whether it will heal."},
 {"id":"change","gap":0.8,"text":"Something has to change."},
 {"id":"stain","gap":0.8,"text":"Golgi himself had found a stain that turns a few cells black, and leaves the rest clear."},
 {"id":"random","gap":0.8,"text":"Which few, it seems to pick at random. Nobody knows why, even today."},
 {"id":"young","gap":0.8,"text":"Cajal makes it work reliably, and uses the brains of young birds, where the thicket is thinner."},
 {"id":"whole","gap":0.8,"text":"Each black cell stands out whole, like a tree in winter."},
 {"id":"drew","gap":0.8,"text":"He draws what he sees: separate cells, their branches reaching close to other cells, but never joined."},
 {"id":"oneway","gap":0.8,"text":"And he argues that a message travels one way: in through the branches, and out along one long fibre."},
 {"id":"berlin","gap":0.8,"text":"In Berlin, in 1889, the leading anatomists look down his microscopes, and agree.","say":"In Berlin, in eighteen eighty-nine, the leading anatomists look down his microscopes, and agree."},
 {"id":"nobel","gap":0.8,"text":"In 1906, he and Golgi share the Nobel Prize, though Golgi still defends his net.","say":"In nineteen oh six, he and Golgi share the Nobel Prize, though Golgi still defends his net."},
 {"id":"neuron","gap":0.8,"text":"The separate nerve cell, the neuron, became the starting point of brain science."},
 {"id":"medicine","gap":0.8,"text":"Today, many medicines for the brain work at the gaps he drew."},
 {"id":"machines","gap":0.8,"text":"Machines had the same problem: without a picture of how a brain is wired, there was nothing to copy."},
 {"id":"design","gap":0.8,"text":"His picture gave them a design: many simple cells, each listening to many others, passing one message on."},
 {"id":"today","gap":0.8,"text":"Today's models are still built from it."}]},
"cell":{"name":"Inside a nerve cell","lead":0.8,"tail":1.0,"vo":[
 {"id":"neuron","gap":0.8,"text":"A neuron is a cell that carries messages."},
 {"id":"branches","gap":0.8,"text":"Its branches take in signals from thousands of other cells."},
 {"id":"fires","gap":0.8,"text":"When enough arrive together, it fires: a pulse of electricity runs down its long fibre."},
 {"id":"same","gap":0.8,"text":"The pulse is always the same size: all or nothing."},
 {"id":"gap","gap":0.8,"text":"At the end, it almost touches the next cell, and chemical messengers carry the signal across the gap."},
 {"id":"some","gap":0.8,"text":"Some connections excite the next cell; others hold it back."},
 {"id":"change","gap":0.8,"text":"And connections change."},
 {"id":"hebb","gap":0.8,"text":"In 1949, the psychologist Donald Hebb proposed that when two cells fire together, the link between them grows stronger.","say":"In nineteen forty-nine, the psychologist Donald Hebb proposed that when two cells fire together, the link between them grows stronger."},
 {"id":"rabbit","gap":0.8,"text":"In 1973, experiments on rabbits showed links growing stronger with use.","say":"In nineteen seventy-three, experiments on rabbits showed links growing stronger with use."},
 {"id":"learning","gap":0.8,"text":"That's learning, inside a brain: connections that change."}]},
"animals":{"name":"Nature's trials","lead":0.8,"tail":1.0,"vo":[
 {"id":"long","gap":0.8,"text":"Nature has tried out nerve cells for more than six hundred million years."},
 {"id":"jelly","gap":0.8,"text":"A jellyfish has no brain: just a net of nerve cells, enough to swim and catch food."},
 {"id":"slug","gap":0.8,"text":"A sea slug has about twenty thousand nerve cells, some big enough to see."},
 {"id":"kandel","gap":0.8,"text":"Eric Kandel showed that when it learns, its connections change."},
 {"id":"bee","gap":0.8,"text":"A honeybee has about a million, in a brain smaller than a sesame seed."},
 {"id":"dance","gap":0.8,"text":"Bees learn colours, scents and the way home, and dance to tell each other where food is."},
 {"id":"octopus","gap":0.8,"text":"An octopus has about half a billion, two thirds of them in its arms: each arm can taste on its own."},
 {"id":"finch","gap":0.8,"text":"A young zebra finch learns its song from its father, practising for weeks."},
 {"id":"human","gap":0.8,"text":"And a human brain has about 86 billion, joined by more than a hundred trillion connections.","say":"And a human brain has about eighty-six billion, joined by more than a hundred trillion connections."},
 {"id":"watts","gap":0.8,"text":"It runs on about 20 watts, the power of a dim light bulb.","say":"It runs on about twenty watts, the power of a dim light bulb."}]},
"gaps":{"name":"Filling the gaps","lead":0.8,"tail":1.0,"vo":[
 {"id":"guess","gap":0.8,"text":"A brain doesn't take in everything: it fills gaps with what's likely."},
 {"id":"blind","gap":0.8,"text":"Where the nerve leaves each eye, there are no cells to catch light: a blind spot."},
 {"id":"never","gap":0.8,"text":"You never see a hole there. Your brain fills it in, from what's around it."}]},
"borrowed":{"name":"Borrowed, not copied","lead":0.8,"tail":1.0,"vo":[
 {"id":"unit","gap":0.8,"text":"In 1943, Warren McCulloch and Walter Pitts drew Cajal's nerve cell as a simple unit.","say":"In nineteen forty-three, Warren McCulloch and Walter Pitts drew Cajal's nerve cell as a simple unit."},
 {"id":"adds","gap":0.8,"text":"It adds up its inputs, and fires if the total passes a set level."},
 {"id":"weights","gap":0.8,"text":"Rosenblatt's perceptron gave each connection a weight, a number nudged up or down as it learns, like Hebb's links."},
 {"id":"edges","gap":0.8,"text":"In 1959, David Hubel and Torsten Wiesel found cells in a cat's brain that fire for edges at one angle.","say":"In nineteen fifty-nine, David Hubel and Torsten Wiesel found cells in a cat's brain that fire for edges at one angle."},
 {"id":"feed","gap":0.8,"text":"They feed cells that respond to shapes."},
 {"id":"layers","gap":0.8,"text":"Networks that read pictures borrowed those layers."},
 {"id":"today","gap":0.8,"text":"Today's models still add up weighted inputs, with billions of weights set by training."},
 {"id":"copy","gap":0.8,"text":"But they borrowed an idea, not a brain."},
 {"id":"complex","gap":0.8,"text":"A real nerve cell is far more complex: in 2021, it took a network of five to eight layers to mimic just one.","say":"A real nerve cell is far more complex: in twenty twenty-one, it took a network of five to eight layers to mimic just one."},
 {"id":"child","gap":0.8,"text":"A child can learn a new word from a few examples; a model needs a great many."},
 {"id":"wing","gap":0.8,"text":"Like a plane, which borrowed the wing, but not the flapping."}]},
"likely":{"name":"Likely words","lead":0.8,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"A model writes one word at a time."},
 {"id":"chance","gap":0.8,"text":"For the next word, it gives every word it knows a chance."},
 {"id":"bee","gap":0.8,"text":"After \"A bee tells the hive where food is by\", \"dancing\" might get 70 chances in a hundred, and \"buzzing\" 12.","say":"After \"A bee tells the hive where food is by\", \"dancing\" might get seventy chances in a hundred, and \"buzzing\" twelve."},
 {"id":"wheel","gap":0.8,"text":"Then it draws one, like spinning a wheel: big slices win most often, but not always."},
 {"id":"again","gap":0.8,"text":"So the same question can bring a different answer: one word changes early on, and the rest follows."},
 {"id":"dial","gap":0.8,"text":"A setting called temperature changes the slices."},
 {"id":"low","gap":0.8,"text":"Turned down, the biggest slice almost always wins, and answers stick to the patterns the model saw most."},
 {"id":"high","gap":0.8,"text":"Turned up, small slices grow: answers vary more, sometimes in new ways, and more often go wrong."},
 {"id":"zero","gap":0.8,"text":"Even turned right down, a little chance stays."},
 {"id":"busy","gap":0.8,"text":"When a model answers many people at once, its sums can come out a hair different, and tip a close choice."}]},
"sure":{"name":"Sure, and wrong","lead":0.8,"tail":1.4,"vo":[
 {"id":"missing","gap":0.8,"text":"And when the fact isn't there, the model still writes likely words."},
 {"id":"birthday","gap":0.8,"text":"In a 2025 study, a model asked three times for a researcher's birthday gave three different dates, all wrong.","say":"In a twenty twenty-five study, a model asked three times for a researcher's birthday gave three different dates, all wrong."},
 {"id":"once","gap":0.8,"text":"A birthday is a fact a model may have seen once, or never: there's no pattern to learn."},
 {"id":"tests","gap":0.8,"text":"And the tests models are trained to pass reward a guess over \"I don't know\": a guess might score; a blank never will."},
 {"id":"brains","gap":0.8,"text":"Brains fill gaps too, with what's likely, and just as surely."},
 {"id":"fluent","gap":0.8,"text":"So a fluent answer isn't a checked one."}]},
"held":{"name":"A picture that held","lead":0.8,"tail":1.0,"vo":[
 {"id":"held","gap":0.8,"text":"Cajal's picture held because others could check it."},
 {"id":"gap","gap":0.8,"text":"In the 1950s, electron microscopes showed the gap he had drawn, about twenty millionths of a millimetre wide.","say":"In the nineteen fifties, electron microscopes showed the gap he had drawn, about twenty millionths of a millimetre wide."},
 {"id":"built","gap":0.8,"text":"Models are built on that picture: simple units, and connections that change."},
 {"id":"fill","gap":0.8,"text":"Like brains, they fill gaps with what's likely, a little differently each time."},
 {"id":"check","gap":0.8,"text":"Knowing that, you know when to check them: against the evidence, as Cajal's drawings were checked."},
 {"id":"next","gap":0.8,"text":"Next, what an agent is: a model that reasons, with hands, in a loop."}]}
};

const VODUR={"nature/start": 6.941, "nature/cell": 1.497, "nature/why": 2.087, "nature/trying": 5.41, "nature/birds": 3.086, "nature/wright": 3.861, "nature/twist": 2.365, "nature/seed": 4.909, "nature/example": 4.557, "nature/wired": 3.551, "cajal/barcelona": 6.095, "cajal/slices": 2.942, "cajal/thicket": 4.091, "cajal/net": 7.334, "cajal/nobody": 4.288, "cajal/stroke": 4.723, "cajal/doctors": 3.246, "cajal/change": 1.34, "cajal/stain": 4.963, "cajal/random": 4.391, "cajal/young": 5.509, "cajal/whole": 3.013, "cajal/drew": 5.92, "cajal/oneway": 6.029, "cajal/berlin": 5.629, "cajal/nobel": 5.688, "cajal/neuron": 4.482, "cajal/medicine": 3.187, "cajal/machines": 5.767, "cajal/design": 6.443, "cajal/today": 1.905, "cell/neuron": 2.553, "cell/branches": 3.315, "cell/fires": 5.304, "cell/same": 2.95, "cell/gap": 5.863, "cell/some": 3.286, "cell/change": 1.219, "cell/hebb": 8.021, "cell/rabbit": 5.001, "cell/learning": 3.26, "animals/long": 4.045, "animals/jelly": 5.224, "animals/slug": 4.131, "animals/kandel": 3.456, "animals/bee": 4.067, "animals/dance": 4.953, "animals/octopus": 6.008, "animals/finch": 4.107, "animals/human": 5.849, "animals/watts": 3.46, "gaps/guess": 3.805, "gaps/blind": 4.372, "gaps/never": 3.696, "borrowed/unit": 6.184, "borrowed/adds": 4.036, "borrowed/weights": 6.941, "borrowed/edges": 7.565, "borrowed/feed": 2.153, "borrowed/layers": 2.817, "borrowed/today": 5.056, "borrowed/copy": 2.149, "borrowed/complex": 7.631, "borrowed/child": 4.617, "borrowed/wing": 3.024, "likely/one": 1.923, "likely/chance": 2.963, "likely/bee": 7.161, "likely/wheel": 5.156, "likely/again": 5.926, "likely/dial": 2.532, "likely/low": 5.953, "likely/high": 5.759, "likely/zero": 2.518, "likely/busy": 5.931, "sure/missing": 3.401, "sure/birthday": 7.298, "sure/once": 4.816, "sure/tests": 6.518, "sure/brains": 3.203, "sure/fluent": 2.073, "held/held": 2.532, "held/gap": 6.819, "held/built": 4.312, "held/fill": 4.085, "held/check": 5.386, "held/next": 4.126};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card after the opening story; and the end card. */
const BREATH={
"nature":{"hold":{"start":0.6,"cell":0.8,"why":0.6,"trying":0.4,"wright":0.2,"twist":0.6,"seed":0.8,"example":0.6}},
"cajal":{"hold":{"barcelona":0.2,"slices":0.6,"thicket":0.6,"net":0.4,"nobody":0.4,"doctors":0.6,"change":0.8,"random":0.6,"young":0.4,"whole":1.2,"drew":0.6,"oneway":0.8,"berlin":0.4,"nobel":0.6,"neuron":0.2,"medicine":0.8,"design":0.6},"breathe":4.4},
"cell":{"hold":{"branches":0.4,"fires":0.6,"same":0.8,"gap":0.6,"some":0.6,"hebb":0.4,"rabbit":0.4}},
"animals":{"hold":{"long":1.0,"jelly":1.2,"slug":1.0,"kandel":1.2,"bee":1.2,"dance":1.2,"octopus":1.4,"finch":1.2,"human":1.0,"watts":0.4}},
"gaps":{"hold":{"guess":0.8,"blind":1.4,"never":1.0}},
"borrowed":{"hold":{"unit":0.4,"adds":0.8,"weights":0.8,"edges":0.4,"feed":0.6,"layers":0.8,"today":0.4,"copy":0.6,"complex":0.8,"child":0.6}},
"likely":{"hold":{"one":0.8,"chance":1.0,"bee":1.2,"wheel":1.4,"again":1.0,"dial":1.0,"low":1.2,"high":1.2,"zero":0.6}},
"sure":{"hold":{"missing":1.0,"birthday":1.4,"once":1.2,"tests":1.5,"brains":1.4}},
"held":{"hold":{"held":0.4,"gap":0.8,"built":0.6,"fill":0.6,"check":1.0},"breathe":4.6}
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

/* ===== Borrowed from the brain: the film's kit =====
   Helpers every chapter uses, in the module's look (films/what-an-agent-is/shared/src). Every name here starts with bb_ or BB_.
     BB                              the film's own colours: Cajal's ink and paper, brass and walnut, the stained slide's gold, the
                                     living cell's warm tones, and the signal's warm white; never one of the module's meaning colours
     bb_scr(ctx, S, fn)              draw in screen space, whatever the camera is doing (a tag, a card that stays put)
     bb_tag(ctx, s, a, o)            a place-and-year tag, top left
     bb_pillAt, bb_cardAt            a pill or a card that springs in at t0 and fades at t1
     bb_cell(seed, o) -> cell        a nerve cell, grown once from a seed: its body, branches (dendrites) and one long fibre (the axon),
                                     each a tapering curve; bb_drawCell(ctx, cell, o) draws it (o.u grows it in, o.ink as Cajal drew
                                     it, o.col, o.glow); bb_axonAt(cell, u) is a point along its fibre
     bb_spark(ctx, x, y, r, a)       the signal: a small warm-white glow
     bb_lens(ctx, x, y, r, fn, o)    a microscope's round field: fn draws inside it, then the rim
     bb_paper(ctx, x, y, w, h, o)    a sheet of drawing paper, lying flat, with a soft shadow
     bb_ink(ctx, pts, u, w, a)       an ink line drawn on along points, tapering at both ends
     bb_unit(ctx, x, y, r, o)        a unit, people's simple copy of a nerve cell: a violet disc that adds up its inputs
     bb_wire(ctx, a, b, o)           a connection between units, its weight shown by its width
     bb_perceptron(ctx, x, y, o)     the perceptron, as the opening film drew it */

const BB={ink:[30,27,26],inkSoft:[78,70,64],paper:[244,236,219],paperDk:[224,212,188],paperEdge:[198,184,158],
  brass:[184,146,78],brassDk:[118,88,42],brassHi:[244,220,160],walnut:[118,84,58],walnutDk:[76,54,38],walnutHi:[166,124,88],
  plaster:[226,214,194],plasterDk:[190,174,150],gold:[226,186,108],goldDk:[176,128,58],
  flesh:[226,176,150],fleshDk:[170,112,92],fleshHi:[250,222,204],spark:[255,240,206],
  sea:[64,118,132],seaDk:[26,58,74],sand:[214,196,160],
  mut:[96,100,106]};

/* ---------------------------------------------------------------- small things */
function bb_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// the place and year, on a tag at the top left (the module's tags are mono, on a card)
function bb_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,12,{});ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:o.col||AG.mut});ctx.restore();}
function bb_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));ag_pill(ctx,x,y,text,o||{});ctx.restore();}
function bb_cardAt(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;
  return ag_textCard(ctx,x,y,w,words,Object.assign({},o,{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}
// words on the picture, with a soft halo of paper behind them so they read on anything
function bb_word(ctx,s,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.shadowColor=o.halo||"rgba(250,246,238,0.95)";ctx.shadowBlur=o.blur||14;ag_T(ctx,s,x,y,Object.assign({w:700,size:o.size||32},o,{a:1}));ctx.restore();}
// a smooth closed blob round (cx, cy), seeded
function bb_blob(cx,cy,rx,ry,seed,amp,n){n=n||48;const pts=[];for(let i=0;i<n;i++){const a=i/n*TAU,k=1+amp*(AG_NZ.fbm(Math.cos(a)*1.4+seed*3.1,Math.sin(a)*1.4+seed*1.7,3)-0.5)*2;
  pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}return pts;}
function bb_path(c,P,close){c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)c.lineTo(P[i][0],P[i][1]);if(close!==false)c.closePath();}
// a Catmull-Rom curve through points, as n points per span
function bb_smooth(pts,n){const out=[],Q=[pts[0]].concat(pts,[pts[pts.length-1]]);for(let i=1;i<Q.length-2;i++){const p0=Q[i-1],p1=Q[i],p2=Q[i+1],p3=Q[i+2];
  for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;out.push([0.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
    0.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]);}}out.push(pts[pts.length-1]);return out;}
// a point along points P at u (0..1): [x, y, angle]
function bb_along(P,u){let tot=0;const L=[0];for(let i=1;i<P.length;i++){tot+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);L.push(tot);}
  const d=clamp(u,0,1)*tot;for(let i=1;i<P.length;i++)if(d<=L[i]){const k=(d-L[i-1])/((L[i]-L[i-1])||1),a=P[i-1],b=P[i];return[lerp(a[0],b[0],k),lerp(a[1],b[1],k),Math.atan2(b[1]-a[1],b[0]-a[0])];}
  const a=P[P.length-2],b=P[P.length-1];return[b[0],b[1],Math.atan2(b[1]-a[1],b[0]-a[0])];}
// a tapering line along points: one filled shape from w0 to w1 wide, drawn on to u (0..1), with round ends
function bb_strand(ctx,P,w0,w1,col,u){u=u==null?1:u;if(u<=0||P.length<2)return;const n=P.length,m=Math.max(2,Math.ceil((n-1)*clamp(u,0,1))+1),L=[],R=[];
  for(let i=0;i<m;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,h=lerp(w0,w1,i/(n-1))/2;
    L.push([P[i][0]-dy/d*h,P[i][1]+dx/d*h]);R.push([P[i][0]+dy/d*h,P[i][1]-dx/d*h]);}
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(const q of L)ctx.lineTo(q[0],q[1]);const e=P[m-1],we=lerp(w0,w1,(m-1)/(n-1))/2;
  ctx.arc(e[0],e[1],we,Math.atan2(L[m-1][1]-e[1],L[m-1][0]-e[0]),Math.atan2(R[m-1][1]-e[1],R[m-1][0]-e[0]),true);
  for(let i=m-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);ctx.arc(P[0][0],P[0][1],w0/2,Math.atan2(R[0][1]-P[0][1],R[0][0]-P[0][0]),Math.atan2(L[0][1]-P[0][1],L[0][0]-P[0][0]),true);ctx.closePath();ctx.fill();}
// the signal: a small warm-white glow, brightest in the middle
function bb_spark(ctx,x,y,r,a,col){if(a<=0)return;const c=col||BB.spark,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba([255,255,250],0.95*a));g.addColorStop(0.35,rgba(c,0.7*a));g.addColorStop(1,rgba(c,0));
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}

/* ---------------------------------------------------------------- a nerve cell, grown once from a seed
   o: x, y (the body), r (its radius), dirs (how many branches), axon {ang, len, bend} (the long fibre and its end branches), reach
   (how far the branches go), wig (how much they wander), spines (small buds on the branches, as Cajal saw them). Each branch is a
   list of points with a start and end width, and its children start part of the way along it; the axon ends in a few short end
   branches, each with a small knob, where it nearly touches the next cell. */
function bb_cell(seed,o){o=o||{};const R=ag_rnd(seed),x=o.x||0,y=o.y||0,r=o.r||26,reach=o.reach||220,wig=o.wig==null?0.35:o.wig,B=[];
  const grow=(px,py,ang,len,w,depth,from,at)=>{const n=8,P=[[px,py]];let a=ang,cx=px,cy=py;for(let i=1;i<=n;i++){a+=(R()-0.5)*wig;cx+=Math.cos(a)*len/n;cy+=Math.sin(a)*len/n;P.push([cx,cy]);}
    const S=bb_smooth(P,3),b={P:S,w0:w,w1:Math.max(1.4,w*0.28),from,at,depth,kids:[]};B.push(b);const me=B.length-1;
    if(depth<(o.depth||3)){const k=depth<1?2:(R()<0.7?2:1);for(let j=0;j<k;j++){const u=0.35+R()*0.5,q=bb_along(S,u),da=(j%2?1:-1)*(0.35+R()*0.45);
      const kid=grow(q[0],q[1],q[2]+da,len*(0.5+R()*0.25),lerp(w,b.w1,u)*0.82,depth+1,me,u);b.kids.push(kid);}}
    return me;};
  const dirs=o.dirs||6,ax=o.axon||{ang:Math.PI*0.5,len:520,bend:0.25},roots=[];
  for(let k=0;k<dirs;k++){let a=ax.ang+Math.PI+(k-(dirs-1)/2)*(TAU*0.78/dirs)+(R()-0.5)*0.4;roots.push(grow(x+Math.cos(a)*r*0.8,y+Math.sin(a)*r*0.8,a,reach*(0.6+R()*0.5),r*0.55,0,-1,0));}
  // the axon: one long, smooth fibre, then its end branches with their knobs
  const n=12,AP=[[x+Math.cos(ax.ang)*r*0.9,y+Math.sin(ax.ang)*r*0.9]];let a=ax.ang,cx=AP[0][0],cy=AP[0][1];
  for(let i=1;i<=n;i++){a+=Math.sin(i*0.9+seed)*(ax.bend||0.2)*0.35;cx+=Math.cos(a)*ax.len/n;cy+=Math.sin(a)*ax.len/n;AP.push([cx,cy]);}
  const A=bb_smooth(AP,3),ends=[],en=ax.ends==null?4:ax.ends;
  for(let k=0;k<en;k++){const b0=bb_along(A,1),da=(k-(en-1)/2)*0.42+(R()-0.5)*0.2,L=(ax.endLen||70)*(0.7+R()*0.5),P=[[b0[0],b0[1]]];let aa=b0[2]+da,qx=b0[0],qy=b0[1];
    for(let i=1;i<=5;i++){aa+=(R()-0.5)*0.4;qx+=Math.cos(aa)*L/5;qy+=Math.sin(aa)*L/5;P.push([qx,qy]);}ends.push(bb_smooth(P,3));}
  const blob=bb_blob(x,y,r,r*0.88,seed*0.37,0.18,40);
  // spines: small buds along the outer branches
  const spines=[];if(o.spines)B.forEach((b,i)=>{if(b.depth<1)return;for(let k=0;k<6;k++){const u=0.2+R()*0.75,q=bb_along(b.P,u),s=(R()<0.5?1:-1);spines.push([i,u,q[2]+s*(1.2+R()*0.5),3+R()*4]);}});
  return{x,y,r,B,roots,A,ends,blob,spines,w0:o.axW||r*0.36};}
// how far along a branch, for growing in: a root grows first, its children once it has passed their place
function bb_branchU(cell,i,u){const b=cell.B[i];if(b.from<0)return clamp(u/0.6,0,1);const pu=bb_branchU(cell,b.from,u);if(pu<b.at)return 0;return clamp((u-0.6*b.at-0.15*b.depth)/0.55,0,1);}
function bb_axonAt(cell,u){if(u<=0.82)return bb_along(cell.A,u/0.82);const e=cell.ends[0];return bb_along(e,(u-0.82)/0.18);}
// draws a cell: o.u (0..1) grows it in (the body first, the branches out from it, then the fibre); o.ink draws it as Cajal's black
// cells, solid; otherwise a living cell, matte and lit from the right (o.col its colour); o.a; o.knobs the end branches' knobs
function bb_drawCell(ctx,cell,o){o=o||{};const u=o.u==null?1:o.u,a=o.a==null?1:o.a;if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;
  const ink=!!o.ink,col=o.col||(ink?BB.ink:BB.flesh),dk=ink?col:mix(col,[60,30,30],0.35),hi=ink?col:mix(col,[255,250,244],0.45);
  const fill=c=>rgba(c,1);
  // the branches: dark under-edge first (a little left and down, the window is on the right), then the body colour
  const pass=(c,dx,dy,wk)=>{ctx.save();ctx.translate(dx,dy);cell.B.forEach((b,i)=>{const v=bb_branchU(cell,i,u);if(v>0)bb_strand(ctx,b.P,b.w0*wk,b.w1*wk,c,v);});
    const av=clamp((u-0.35)/0.65,0,1);if(av>0){bb_strand(ctx,cell.A,cell.w0*wk,cell.w0*0.55*wk,c,Math.min(1,av/0.82));if(av>0.82)cell.ends.forEach(e=>bb_strand(ctx,e,cell.w0*0.55*wk,1.6*wk,c,(av-0.82)/0.18));}
    ctx.restore();};
  if(!ink)pass(fill(dk),-2,2,1.08);
  pass(fill(col),0,0,1);
  if(!ink){ctx.save();ctx.globalAlpha*=0.55;pass(fill(hi),1.2,-1.2,0.45);ctx.restore();}
  // spines and knobs
  const sp=clamp((u-0.5)/0.5,0,1);if(sp>0&&cell.spines.length){ctx.fillStyle=fill(col);for(const [i,v,ang,l] of cell.spines){if(bb_branchU(cell,i,u)<v)continue;const q=bb_along(cell.B[i].P,v);
    ctx.save();ctx.globalAlpha*=sp;ctx.beginPath();ctx.ellipse(q[0]+Math.cos(ang)*l,q[1]+Math.sin(ang)*l,2.4,2.4,0,0,TAU);ctx.fill();ctx.lineWidth=1.6;ctx.strokeStyle=fill(col);ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0]+Math.cos(ang)*l,q[1]+Math.sin(ang)*l);ctx.stroke();ctx.restore();}}
  const kn=clamp((u-0.92)/0.08,0,1);if(kn>0&&o.knobs!==false)for(const e of cell.ends){const q=e[e.length-1];ctx.fillStyle=fill(col);ctx.globalAlpha*=1;ctx.beginPath();ctx.arc(q[0],q[1],(o.knob||5)*kn,0,TAU);ctx.fill();}
  // the body: a soft blob, with its nucleus when it's alive
  const bu=clamp(u/0.25,0,1);if(bu>0){ctx.save();ag_about(ctx,cell.x,cell.y,lerp(0.4,1,ag_eo(bu)));
    if(ink){ctx.fillStyle=fill(col);ctx.beginPath();bb_path(ctx,cell.blob);ctx.fill();}
    else{ag_soft(ctx,c=>bb_path(c,cell.blob),col,hi,cell.x+cell.r*0.45,cell.y-cell.r*0.45,cell.r*1.3,rgba(dk,0.55),10,0.8);
      ctx.fillStyle=rgba(mix(dk,col,0.35),0.7);ctx.beginPath();ctx.ellipse(cell.x-cell.r*0.12,cell.y+cell.r*0.06,cell.r*0.36,cell.r*0.32,0.3,0,TAU);ctx.fill();
      ctx.fillStyle=rgba(hi,0.6);ctx.beginPath();ctx.arc(cell.x-cell.r*0.02,cell.y-cell.r*0.04,cell.r*0.09,0,TAU);ctx.fill();}
    ctx.restore();}
  ctx.restore();}
// a cell's glow while it fires: its body lights from within
function bb_cellGlow(ctx,cell,k){if(k<=0)return;const g=ctx.createRadialGradient(cell.x,cell.y,0,cell.x,cell.y,cell.r*3.2);g.addColorStop(0,rgba(BB.spark,0.75*k));g.addColorStop(1,rgba(BB.spark,0));
  ctx.fillStyle=g;ctx.fillRect(cell.x-cell.r*3.2,cell.y-cell.r*3.2,cell.r*6.4,cell.r*6.4);}

/* ---------------------------------------------------------------- the microscope's field, paper, ink */
// fn draws inside a round field of radius r at (x, y); a soft dark rim and a little vignette round it, like looking down the tube
function bb_lens(ctx,x,y,r,fn,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();fn(ctx);
  const g=ctx.createRadialGradient(x,y,r*0.62,x,y,r);g.addColorStop(0,"rgba(30,20,10,0)");g.addColorStop(1,"rgba(30,20,10,0.55)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();
  ctx.strokeStyle="rgba(24,20,18,0.9)";ctx.lineWidth=o.rim||18;ctx.beginPath();ctx.arc(x,y,r+(o.rim||18)/2,0,TAU);ctx.stroke();
  ctx.strokeStyle="rgba(255,240,210,0.18)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r+(o.rim||18)-2,-1.2,0.2);ctx.stroke();ctx.restore();}
// a sheet of paper lying flat: cream, a deckled shadow, and a little tooth
function bb_paper(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(46,34,20,0.32)";ctx.shadowBlur=26;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=10;ctx.fillStyle=rgba(o.col||BB.paper,1);ctx.fillRect(x,y,w,h);ctx.restore();
  const g=ctx.createLinearGradient(x+w,y,x,y+h);g.addColorStop(0,"rgba(255,252,244,0.5)");g.addColorStop(1,"rgba(170,150,120,0.16)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ag_grain(ctx,x,y,w,h,1.2,23);ctx.strokeStyle=rgba(BB.paperEdge,0.6);ctx.lineWidth=1.5;ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);ctx.restore();}
// an ink line drawn on along points P to u, w wide, tapering at its ends
function bb_ink(ctx,P,u,w,a,col){if(u<=0||a<=0)return;ctx.save();ctx.globalAlpha*=a;bb_strand(ctx,P,w*0.6,w*0.4,rgba(col||BB.ink,0.92),u);ctx.restore();}
// a curved arrow in ink, drawn on to u: along points, with its head at the end
function bb_inkArrow(ctx,P,u,w,a,col){if(u<=0||a<=0)return;bb_ink(ctx,P,u,w,a,col);if(u<0.98)return;const e=bb_along(P,1);ctx.save();ctx.globalAlpha*=a;ag_arrowHead(ctx,e[0],e[1],e[2],w*3.2,rgba(col||BB.ink,0.92));ctx.restore();}

/* ---------------------------------------------------------------- the units people built on the nerve cell */
// a unit: a violet disc, lit from the right, with a sum sign; o.on (0..1, it fires: a ring of light), o.a, o.sigma
function bb_unit(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const on=o.on||0,col=AG.violet;
  ag_floorShadow(ctx,x-r*0.15,y+r*0.9,r*0.9,r*0.28,0.18);
  ag_soft(ctx,c=>c.arc(x,y,r,0,TAU),mix(col,[255,255,255],0.72),[255,255,255],x+r*0.4,y-r*0.45,r*1.4,"rgba(40,30,90,0.35)",Math.max(6,r*0.3),0.85);
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=Math.max(2.5,r*0.09);ctx.beginPath();ctx.arc(x,y,r-ctx.lineWidth/2,0,TAU);ctx.stroke();
  if(on>0){ctx.save();ctx.shadowColor=rgba(col,0.9*on);ctx.shadowBlur=r*0.9;ctx.strokeStyle=rgba(col,0.9*on);ctx.lineWidth=Math.max(3,r*0.12);ctx.beginPath();ctx.arc(x,y,r*1.12,0,TAU);ctx.stroke();ctx.restore();
    ctx.fillStyle=rgba(col,0.35*on);ctx.beginPath();ctx.arc(x,y,r*0.86,0,TAU);ctx.fill();}
  if(o.sigma!==false&&r>=24){ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(2.5,r*0.1);ctx.lineCap="round";ctx.lineJoin="round";const s=r*0.38;ctx.beginPath();
    ctx.moveTo(x+s*0.75,y-s);ctx.lineTo(x-s*0.75,y-s);ctx.lineTo(x+s*0.2,y);ctx.lineTo(x-s*0.75,y+s);ctx.lineTo(x+s*0.75,y+s);ctx.stroke();}
  ctx.restore();}
// a connection between two points; o.w its width (its weight), o.col, o.a, o.u draws it on, o.sig (0..1) a signal along it
function bb_wire(ctx,a,b,o){o=o||{};const al=o.a==null?1:o.a,u=o.u==null?1:o.u;if(al<=0||u<=0)return;ctx.save();ctx.globalAlpha*=al;
  const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2+(o.bow||0),P=[];for(let i=0;i<=16;i++){const t=i/16,m=1-t;P.push([m*m*a[0]+2*m*t*mx+t*t*b[0],m*m*a[1]+2*m*t*my+t*t*b[1]]);}
  bb_strand(ctx,P,o.w||4,o.w||4,rgba(o.col||mix(AG.violet,[120,116,140],0.35),o.alpha||0.7),u);
  if(o.sig!=null&&o.sig>0&&o.sig<1){const q=bb_along(P,o.sig);bb_spark(ctx,q[0],q[1],o.sr||16,1,o.sigCol);}ctx.restore();return P;}

/* ---------------------------------------------------------------- the perceptron, as the opening film drew it
   (Decades in the making, dm_perceptron): one cabinet so its parts can be seen, an eye of 20 x 20 cells, the card shown to it,
   two lamps for its guess, and six dials, the numbers each wrong guess nudges. o.on, o.card (0 left, 1 right), o.show, o.guess,
   o.right, o.dial(i) -> angle, o.nudge, o.a. The cabinet is 760 by 520, on legs 120 tall. */
const BB_EYE=20;
function bb_perceptron(ctx,x,y,o){const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=760,h=520,on=o.on==null?1:o.on;
  ag_floorShadow(ctx,x+w/2-20,y+h+122,w*0.55,34,0.22);
  for(const lx of [x+50,x+w-80])ag_soft(ctx,cc=>ag_rect(cc,lx,y+h-6,30,128,4),[90,98,106],[150,160,168],lx+30,y+h,80,"rgba(0,0,0,0.3)",4);
  ag_soft(ctx,cc=>ag_rect(cc,x,y,w,h,18),[150,162,170],[214,222,226],x+w,y,700,"rgba(30,40,50,0.4)",18);
  const pw=ag_tw(ctx,"PERCEPTRON",{w:800,size:30,ls:5})+60;
  ag_soft(ctx,cc=>ag_rect(cc,x+w/2-pw/2,y+22,pw,52,8),[170,134,66],[236,212,146],x+w/2+pw/2,y+22,pw,"rgba(80,60,20,0.4)",4);
  ag_T(ctx,"PERCEPTRON",x+w/2,y+60,{w:800,size:30,ls:5,align:"center",col:[72,54,26]});
  const cx=x+44,cy=y+122,cw=200,ch=150,sh=o.show||0;
  ag_inner(ctx,cc=>ag_rect(cc,cx-10,cy-10,cw+20,ch+20,10),"rgba(20,30,40,0.5)",12,-3,3);
  if(sh>0){ctx.save();ctx.globalAlpha*=clamp(sh*1.6,0,1);ctx.translate(0,(1-ag_eo(sh))*-30);ctx.fillStyle="#FBFAF6";ctx.fillRect(cx,cy,cw,ch);
    ctx.fillStyle=rgba(BB.ink,0.85);ctx.beginPath();ctx.arc(cx+(o.card?cw*0.74:cw*0.26),cy+ch/2,34,0,TAU);ctx.fill();ctx.restore();}
  ag_T(ctx,"Shown",cx+cw/2,y+352,{w:600,size:28,align:"center",col:AG.mut});
  const ex=x+290,ey=y+100,es=196,cs=es/BB_EYE;ctx.fillStyle="#2B2E33";rr(ctx,ex-8,ey-8,es+16,es+16,8);ctx.fill();
  const mx=(o.card?0.74:0.26)*BB_EYE;
  for(let i=0;i<BB_EYE;i++)for(let j=0;j<BB_EYE;j++){const lit=sh>0.6&&Math.hypot(i+0.5-mx,j+0.5-BB_EYE/2)<3.7?clamp((sh-0.6)/0.3,0,1):0;
    ctx.fillStyle=rgba(mix(mix([58,62,70],[78,86,96],on),[255,236,190],lit),1);ctx.fillRect(ex+i*cs+1,ey+j*cs+1,cs-2,cs-2);}
  ag_T(ctx,"Its eye",ex+es/2,y+352,{w:600,size:28,align:"center",col:AG.mut});
  for(const [k,lab] of [[0,"Left"],[1,"Right"]]){const lx=x+576,ly=y+162+k*92,lit=o.guess===k?1:0;
    ctx.fillStyle=rgba(mix(mix([80,86,94],[104,112,120],on),AG.violet,lit),1);ctx.beginPath();ctx.arc(lx,ly,22,0,TAU);ctx.fill();
    if(lit){ctx.save();ctx.shadowColor=rgba(AG.violet,0.8);ctx.shadowBlur=24;ctx.fill();ctx.restore();}
    ag_T(ctx,lab,lx+38,ly+11,{w:700,size:30,col:lit?AG.ink:AG.mut});}
  if(o.right!=null&&o.guess!=null){const vx=x+w-46,vy=y+162+o.guess*92;if(o.right)ag_tick(ctx,vx,vy,30,rgba(AG.green,1),5);else{ctx.save();ctx.strokeStyle=rgba(AG.amber,1);ctx.lineWidth=5;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(vx-13,vy-13);ctx.lineTo(vx+13,vy+13);ctx.moveTo(vx+13,vy-13);ctx.lineTo(vx-13,vy+13);ctx.stroke();ctx.restore();}}
  const nu=o.nudge||0;
  for(let i=0;i<6;i++){const dx=x+90+i*116,dy=y+428,ang=o.dial?o.dial(i):0;
    if(nu>0){ctx.save();ctx.strokeStyle=rgba(AG.amber,0.85*nu);ctx.lineWidth=5;ctx.beginPath();ctx.arc(dx,dy,42,0,TAU);ctx.stroke();ctx.restore();}
    ag_soft(ctx,cc=>cc.arc(dx,dy,36,0,TAU),[226,230,232],[255,255,255],dx+14,dy-14,40,"rgba(30,40,50,0.35)",6);
    ctx.strokeStyle=rgba(AG.blue,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+Math.sin(ang)*26,dy-Math.cos(ang)*26);ctx.stroke();}
  ag_T(ctx,"Its numbers",x+w/2,y+500,{w:600,size:28,align:"center",col:AG.mut});
  ctx.restore();}

/* ===== Borrowed from the brain: the past =====
   The places of the opening and of the story, painted once, full-frame, matte and soft-lit from the right (AG_PLACES):
     bbNavy      1958: a laboratory's plain room, where the perceptron stands
     bbSheet     a sheet of drawing paper on a walnut table, seen from above, with an ink pot and a pen
     bbSky       an open sky over low hills, where buzzards soar
     bbDunes     the dunes at Kitty Hawk, 1902, under a wide sky
     bbMaple     a maple's branch in autumn, against a soft park
     bbBrain     a brain, drawn as an anatomy book would, on a warm dark ground
     bbLens      looking down a microscope: a round field on the dark
     bbRoom      Barcelona, 1888: Cajal's room, his table, microscope, slides, ink and paper, light from the window on the right
     bbWard      1888: a ward's corner, a chair by the window
     bbBerlin    Berlin, 1889: a long table of microscopes
     bbHall      Stockholm, 1906: a hall with a stage
   What moves is drawn live: the people, the birds and the glider, the seeds, the stained cells, the ink. */

/* ---------------------------------------------------------------- the people of the story (ag_person specs) */
// a moustache over the upper lip, in figure space (painted with the head, over it, so it turns and nods with the face): under the
// nose's tip, its near side wider, as the face turns three-quarters, its ends drooping a little past the corners of the mouth
const bb_stache=(col)=>(c,P)=>{c.save();c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(333,491);c.bezierCurveTo(334,478,344,469,358,467);c.bezierCurveTo(368,465,378,466,385,469);
  c.bezierCurveTo(391,472,393,480,390,487);c.bezierCurveTo(386,482,380,479,372,479);c.bezierCurveTo(362,479,352,481,344,485);c.bezierCurveTo(340,487,336,489,333,491);c.closePath();c.fill();
  c.strokeStyle=rgba(mix(col,[0,0,0],0.3),0.4);c.lineWidth=1.4;c.lineCap="round";for(let k=0;k<6;k++){const x=346+k*7;c.beginPath();c.moveTo(x,470+Math.abs(k-2.5)*0.6);c.lineTo(x-3,479);c.stroke();}
  c.fillStyle="rgba(255,255,255,0.16)";c.beginPath();c.ellipse(366,470,12,2.6,-0.05,0,TAU);c.fill();c.restore();};
const BB_CAST={
  rosenblatt:{key:"bb_rosenblatt",name:"Frank Rosenblatt",skin:[232,198,170],hair:{style:"side",c:[42,34,30]},top:{kind:"suit",c:[78,82,92],inner:[240,240,234],tie:[58,62,86]},breath:0.27},
  cajal:{key:"bb_cajal",name:"Santiago Ramón y Cajal",skin:[222,184,150],hair:{style:"side",c:[34,28,26]},beard:[40,32,28],top:{kind:"suit",c:[48,44,46],inner:[238,232,218],tie:[30,28,32]},breath:0.26},
  cajal06:{key:"bb_cajal06",name:"Santiago Ramón y Cajal",skin:[220,182,150],hair:{style:"side",c:[110,104,100]},beard:[132,126,120],top:{kind:"suit",c:[40,40,46],inner:[240,238,232],tie:[28,28,34]},breath:0.25},
  golgi:{key:"bb_golgi",name:"Camillo Golgi",skin:[230,196,170],hair:{style:"cropped",c:[214,210,204]},top:{kind:"suit",c:[44,44,52],inner:[242,240,236],tie:[34,34,40]},hat:{paint:bb_stache([226,222,214])},breath:0.24},
  golgi88:{key:"bb_golgi88",name:"Camillo Golgi",skin:[230,196,170],hair:{style:"cropped",c:[58,46,40]},top:{kind:"suit",c:[52,50,56],inner:[240,236,228],tie:[38,36,42]},hat:{paint:bb_stache([62,48,40])},breath:0.24},
  kolliker:{key:"bb_kolliker",name:"Albert von Kölliker",skin:[232,200,178],hair:{style:"cropped",c:[222,220,216]},beard:[226,224,220],top:{kind:"suit",c:[38,40,48],inner:[240,240,236],tie:[30,30,36]},breath:0.22},
  anat:{key:"bb_anat",name:"An anatomist",skin:[226,190,160],hair:{style:"side",c:[96,74,56]},top:{kind:"suit",c:[70,66,62],inner:[238,234,226],tie:[52,46,44]},hat:{paint:bb_stache([92,70,54])},breath:0.27},
  patient:{key:"bb_patient",name:"A patient",skin:[218,180,150],hair:{style:"cropped",c:[150,146,140]},top:{kind:"overshirt",c:[132,120,104],inner:[230,224,210]},breath:0.3},
  hebb:{key:"bb_hebb",name:"Donald Hebb",skin:[232,198,172],hair:{style:"side",c:[92,80,70]},glasses:[50,46,44],top:{kind:"suit",c:[96,90,84],inner:[238,236,230],tie:[86,62,58]},breath:0.26},
  doctor:{key:"bb_doctor",name:"A doctor",skin:[230,196,168],hair:{style:"side",c:[122,72,44]},top:{kind:"suit",c:[60,66,80],inner:[238,234,226],tie:[46,52,70]},breath:0.27}
};

/* ---------------------------------------------------------------- shared painting: plaster, a window, floorboards */
function bb_wall(c,col,y0,y1,seed){const g=c.createLinearGradient(0,y0,W,y1);g.addColorStop(0,rgba(mix(col,[60,50,40],0.12),1));g.addColorStop(0.7,rgba(col,1));g.addColorStop(1,rgba(mix(col,[255,250,240],0.25),1));
  c.fillStyle=g;c.fillRect(0,y0,W,y1-y0);ag_grain(c,0,y0,W,y1-y0,1.6,seed||3);
  // soft patches in the plaster
  const R=ag_rnd(seed||3);for(let i=0;i<14;i++){const x=R()*W,y=y0+R()*(y1-y0),r=60+R()*160;const h=c.createRadialGradient(x,y,0,x,y,r);h.addColorStop(0,rgba(mix(col,[120,100,80],0.25),0.12));h.addColorStop(1,rgba(col,0));c.fillStyle=h;c.fillRect(x-r,y-r,r*2,r*2);}}
// a tall window on the right: its light falls across the room from it
function bb_window(c,x,y,w,h,o){o=o||{};c.save();const fr=o.frame||[226,220,206];
  const sky=c.createLinearGradient(0,y,0,y+h);sky.addColorStop(0,rgba(o.sky0||[214,228,236],1));sky.addColorStop(1,rgba(o.sky1||[244,240,226],1));c.fillStyle=sky;c.fillRect(x,y,w,h);
  if(o.view)o.view(c,x,y,w,h);
  c.strokeStyle=rgba(fr,1);c.lineWidth=18;c.strokeRect(x,y,w,h);c.lineWidth=9;c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h*0.38);c.lineTo(x+w,y+h*0.38);c.stroke();
  ag_inner(c,cc=>cc.rect(x-9,y-9,w+18,h+18),"rgba(60,40,20,0.35)",14,-6,4);
  // the light it throws: a soft pale fall to the left
  const g=c.createRadialGradient(x,y+h*0.6,40,x-200,y+h*0.6,900);g.addColorStop(0,"rgba(255,246,222,0.34)");g.addColorStop(1,"rgba(255,246,222,0)");c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();}
function bb_boards(c,y0,col,seed){const g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,rgba(mix(col,[30,20,10],0.15),1));g.addColorStop(1,rgba(mix(col,[30,20,10],0.4),1));c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
  c.strokeStyle="rgba(40,26,16,0.18)";c.lineWidth=2;for(let i=0;i<14;i++){const y=y0+Math.pow(i/14,1.6)*(H-y0);c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}ag_grain(c,0,y0,W,H-y0,2,seed||9);}
// a walnut table top seen from in front: its top surface from y0 to y1, then its front edge
function bb_table(c,y0,y1,o){o=o||{};const col=o.col||BB.walnut;const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(mix(col,[255,240,220],0.12),1));g.addColorStop(1,rgba(mix(col,[30,20,10],0.1),1));
  c.fillStyle=g;c.fillRect(o.x0||0,y0,(o.x1||W)-(o.x0||0),y1-y0);
  c.save();c.globalAlpha=0.16;c.strokeStyle=rgba(BB.walnutDk,1);c.lineWidth=2;const R=ag_rnd(41);for(let i=0;i<26;i++){const y=y0+R()*(y1-y0);c.beginPath();c.moveTo(o.x0||0,y);for(let x=(o.x0||0);x<=(o.x1||W);x+=60)c.lineTo(x,y+Math.sin(x*0.004+i)*4);c.stroke();}c.restore();
  const s=c.createLinearGradient(0,y1,0,y1+40);s.addColorStop(0,rgba(BB.walnutDk,1));s.addColorStop(1,rgba(mix(BB.walnutDk,[0,0,0],0.3),1));c.fillStyle=s;c.fillRect(o.x0||0,y1,(o.x1||W)-(o.x0||0),40);
  const lg=c.createRadialGradient(1700,y0,40,1500,y0,1100);lg.addColorStop(0,"rgba(255,240,214,0.26)");lg.addColorStop(1,"rgba(255,240,214,0)");c.fillStyle=lg;c.fillRect(0,y0,W,y1-y0);}

/* ---------------------------------------------------------------- a brass microscope of the 1880s
   base centre (x, y), s its size (1: about 330 px tall): a horseshoe foot, the pillar, the stage with its mirror below, the arm and the
   tube with its eyepiece at the top, all brass and black lacquer, lit from the right */
function bb_scope(c,x,y,s,o){o=o||{};c.save();c.translate(x,y);c.scale(s,s);const B=BB.brass,Bd=BB.brassDk,Bh=BB.brassHi,K=[36,34,36];
  ag_floorShadow(c,-14,2,120,16,0.3);
  // the horseshoe foot, black
  ag_soft(c,cc=>{cc.moveTo(-104,0);cc.bezierCurveTo(-110,-26,-60,-34,-30,-30);cc.lineTo(30,-30);cc.bezierCurveTo(60,-34,110,-26,104,0);cc.closePath();},K,[110,110,118],40,-30,110,"rgba(0,0,0,0.4)",8);
  // the pillar and the stage
  ag_soft(c,cc=>ag_rect(cc,-14,-150,28,124,6),B,Bh,10,-140,60,"rgba(60,40,10,0.45)",6);
  ag_soft(c,cc=>ag_rect(cc,-74,-168,148,22,5),K,[120,118,124],50,-168,90,"rgba(0,0,0,0.4)",5);
  // the mirror below the stage
  ag_soft(c,cc=>cc.ellipse(0,-92,26,12,0,0,TAU),[200,206,212],[255,255,255],10,-96,30,"rgba(40,40,50,0.4)",5);
  c.strokeStyle=rgba(Bd,1);c.lineWidth=4;c.beginPath();c.moveTo(-26,-92);c.lineTo(-14,-110);c.moveTo(26,-92);c.lineTo(14,-110);c.stroke();
  // the arm, curving up and over to hold the tube
  ag_soft(c,cc=>{cc.moveTo(-6,-168);cc.bezierCurveTo(-30,-210,-36,-250,-20,-282);cc.lineTo(-2,-276);cc.bezierCurveTo(-16,-246,-12,-212,12,-168);cc.closePath();},B,Bh,0,-240,70,"rgba(60,40,10,0.45)",5);
  // the tube, slightly tilted, with its knurled focus wheel and the eyepiece
  c.save();c.rotate(o.tilt==null?-0.12:o.tilt);
  ag_soft(c,cc=>ag_rect(cc,8,-330,34,160,8),B,Bh,36,-320,90,"rgba(60,40,10,0.5)",6);
  ag_soft(c,cc=>ag_rect(cc,4,-350,42,26,6),K,[130,128,132],40,-350,40,"rgba(0,0,0,0.45)",4);
  ag_soft(c,cc=>ag_rect(cc,14,-186,22,22,4),Bd,B,30,-186,24,"rgba(30,20,0,0.4)",3);
  c.fillStyle=rgba(Bh,0.9);c.fillRect(34,-318,4,130);c.restore();
  ag_soft(c,cc=>cc.arc(-24,-246,16,0,TAU),K,[150,146,150],-18,-252,22,"rgba(0,0,0,0.45)",4);
  c.restore();}

/* ---------------------------------------------------------------- 1958 */
AG_PLACES.bbNavy=c=>{bb_wall(c,[196,204,192],0,700,11);c.fillStyle=rgba([150,162,150],1);c.fillRect(0,560,W,140);c.fillStyle=rgba([126,138,126],1);c.fillRect(0,556,W,8);
  bb_window(c,1430,110,360,400,{frame:[214,218,210],sky0:[196,214,230],sky1:[232,236,236]});
  const g=c.createLinearGradient(0,700,0,H);g.addColorStop(0,rgba([176,170,150],1));g.addColorStop(1,rgba([132,126,108],1));c.fillStyle=g;c.fillRect(0,700,W,H-700);
  c.strokeStyle="rgba(60,56,44,0.14)";c.lineWidth=2;for(let i=0;i<9;i++){const y=700+Math.pow(i/9,1.5)*380;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  for(let k=-8;k<=8;k++){c.beginPath();c.moveTo(960+k*90,700);c.lineTo(960+k*260,H);c.stroke();}ag_grain(c,0,0,W,H,1.4,13);};

/* ---------------------------------------------------------------- paper on the table, seen from above */
// its top edge sits below the film's title, which reads on the wood above it
const BB_SHEET={x:330,y:136,w:1260,h:750};
AG_PLACES.bbSheet=c=>{const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba(mix(BB.walnut,[20,12,6],0.15),1));g.addColorStop(1,rgba(mix(BB.walnut,[255,230,200],0.08),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.globalAlpha=0.2;c.strokeStyle=rgba(BB.walnutDk,1);c.lineWidth=2.5;const R=ag_rnd(5);for(let i=0;i<40;i++){const y=R()*H;c.beginPath();c.moveTo(0,y);for(let x=0;x<=W;x+=80)c.lineTo(x,y+Math.sin(x*0.003+i*1.7)*10);c.stroke();}c.restore();
  ag_grain(c,0,0,W,H,2,7);const S=BB_SHEET;bb_paper(c,S.x,S.y,S.w,S.h);
  // the ink pot and the pen, top right on the wood
  ag_floorShadow(c,1712,236,74,20,0.35);ag_soft(c,cc=>cc.arc(1720,200,56,0,TAU),[40,44,52],[130,140,160],1744,176,60,"rgba(0,0,0,0.5)",8,0.6);
  c.fillStyle="rgba(14,14,18,0.95)";c.beginPath();c.arc(1720,200,26,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.3)";c.beginPath();c.ellipse(1740,184,12,6,-0.6,0,TAU);c.fill();
  c.save();c.translate(1690,520);c.rotate(-1.15);ag_floorShadow(c,-8,10,150,10,0.3);ag_soft(c,cc=>ag_rect(cc,-150,-8,250,16,8),[64,48,36],[150,120,90],60,-8,140,"rgba(0,0,0,0.4)",4);
  ag_soft(c,cc=>{cc.moveTo(100,-7);cc.lineTo(150,0);cc.lineTo(100,7);cc.closePath();},BB.brass,BB.brassHi,120,-4,40,"rgba(40,30,0,0.4)",3);c.restore();
  const lg=c.createRadialGradient(1800,60,40,1500,200,1500);lg.addColorStop(0,"rgba(255,244,220,0.3)");lg.addColorStop(1,"rgba(255,244,220,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- the sky, the birds, the dunes and the glider */
function bb_skyGrad(c,top,low,hz){const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(top,1));g.addColorStop(1,rgba(low,1));c.fillStyle=g;c.fillRect(0,0,W,hz);}
function bb_clouds(c,seed,y0,y1,n,col){const R=ag_rnd(seed);for(let i=0;i<n;i++){const x=R()*W,y=y0+R()*(y1-y0),w=180+R()*360,h=w*0.18;for(let k=0;k<5;k++){const r=h*(0.6+R()*0.7);
  const g=c.createRadialGradient(x+(k-2)*w*0.16,y,0,x+(k-2)*w*0.16,y,r*1.6);g.addColorStop(0,rgba(col||[255,252,246],0.5));g.addColorStop(1,rgba(col||[255,252,246],0));c.fillStyle=g;c.fillRect(x+(k-2)*w*0.16-r*1.6,y-r*1.6,r*3.2,r*3.2);}}}
function bb_hills(c,y,amp,col,seed){c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,y-amp*(AG_NZ.fbm(x*0.0016+seed,seed*0.3,3)-0.3));c.lineTo(W,H);c.closePath();c.fill();}
AG_PLACES.bbSky=c=>{bb_skyGrad(c,[150,180,206],[236,232,220],820);bb_clouds(c,4,120,520,9);
  const sun=c.createRadialGradient(1640,240,10,1640,240,640);sun.addColorStop(0,"rgba(255,246,220,0.7)");sun.addColorStop(1,"rgba(255,246,220,0)");c.fillStyle=sun;c.fillRect(0,0,W,H);
  bb_hills(c,820,160,[160,170,160],2.1);bb_hills(c,900,120,[128,140,120],5.3);bb_hills(c,980,80,[104,118,96],8.7);ag_grain(c,0,0,W,H,1.2,17);};
// a buzzard soaring, seen from below and a little to the side: broad wings held in a shallow V, a pale underwing with a dark patch at
// the wrist and a dark trailing edge, the tips spread like fingers, a short barred tail fanned. roll tips the bird; twist (-1..1)
// turns one wingtip up and the other down, as Wilbur Wright saw; flap (0..1) lifts both wings
function bb_buzzard(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(o.roll||0);ctx.scale(s,s);const col=o.col||[70,56,46],tw=o.twist||0,a=o.a==null?1:o.a;ctx.globalAlpha*=a;
  const fl=(o.flap||0)*44,dk=mix(col,[24,18,14],0.35),pale=mix(col,[232,222,204],0.62),mid=mix(col,pale,0.4);
  const wing=k=>{const lift=-tw*k*14-fl-8,ch=1+tw*k*0.22;ctx.save();ctx.scale(k,1);
    // the wing's outline: the leading edge bowing forward to the wrist, the hand narrowing to the fingers, the trailing edge curving back in
    const out=c=>{c.moveTo(8,-12);c.bezierCurveTo(50,-30,104,-34+lift*0.3,132,-30+lift*0.55);c.bezierCurveTo(156,-27+lift*0.75,176,-24+lift*0.9,190,-22*ch+lift);
      c.lineTo(194,10*ch+lift*0.9);c.bezierCurveTo(160,22*ch+lift*0.6,110,26+lift*0.35,64,24);c.bezierCurveTo(40,23,20,20,8,16);c.closePath();};
    // the fingers: five primaries, each a feather tapering to its tip, spread with gaps between
    ctx.fillStyle=rgba(dk,1);for(let f=0;f<5;f++){const by=(-20+f*7.4)*ch+lift,bx=188+f*1.6,len=(34-f*3)*(1+0.1*(2-Math.abs(f-2))),ang=-0.42+f*0.21,ex=bx+Math.cos(ang)*len,ey=by+Math.sin(ang)*len,w2=3.4;
      ctx.beginPath();ctx.moveTo(bx,by-w2);ctx.quadraticCurveTo(bx+len*0.55,by-w2+Math.sin(ang)*len*0.5,ex,ey);ctx.quadraticCurveTo(bx+len*0.5,by+w2+Math.sin(ang)*len*0.5,bx,by+w2);ctx.closePath();ctx.fill();}
    ctx.save();ag_shape(ctx,out);ctx.fillStyle=rgba(mid,1);ctx.fill();ctx.clip();
    // the pale coverts under the arm, the dark wrist patch, the dark trailing band, and a soft shadow towards the body
    ctx.fillStyle=rgba(pale,0.9);ctx.beginPath();ctx.moveTo(14,-8);ctx.bezierCurveTo(60,-22,110,-24+lift*0.3,150,-18+lift*0.7);ctx.bezierCurveTo(140,0+lift*0.6,90,6+lift*0.2,18,6);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(dk,0.85);ctx.beginPath();ctx.ellipse(134,-14+lift*0.6,13,8,0.2,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(dk,0.8);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(30,20);ctx.bezierCurveTo(90,25+lift*0.3,150,20*ch+lift*0.6,194,8*ch+lift*0.9);ctx.stroke();
    const sh=ctx.createLinearGradient(0,0,60,0);sh.addColorStop(0,rgba(dk,0.45));sh.addColorStop(1,rgba(dk,0));ctx.fillStyle=sh;ctx.fillRect(0,-40,60,80);ctx.restore();ctx.restore();};
  wing(1);wing(-1);
  // the tail, a short fan with fine bars and a darker band at its end
  const tail=c=>{c.moveTo(-12,24);c.bezierCurveTo(-24,44,-30,62,-26,74);c.quadraticCurveTo(0,84,26,74);c.bezierCurveTo(30,62,24,44,12,24);c.closePath();};
  ctx.save();ag_shape(ctx,tail);ctx.fillStyle=rgba(pale,1);ctx.fill();ctx.clip();ctx.strokeStyle=rgba(dk,0.35);ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-30,40+i*7);ctx.quadraticCurveTo(0,46+i*7,30,40+i*7);ctx.stroke();}
  ctx.fillStyle=rgba(dk,0.7);ctx.fillRect(-32,68,64,14);ctx.restore();
  // the body: a dark head and neck, a pale breast band, a dark belly
  ag_soft(ctx,c=>c.ellipse(0,2,17,32,0,0,TAU),dk,mid,-4,-10,30,null,0,0.5);
  ctx.fillStyle=rgba(pale,0.85);ctx.beginPath();ctx.ellipse(0,-2,13,6,0,0,TAU);ctx.fill();
  ag_soft(ctx,c=>c.arc(0,-28,11,0,TAU),dk,mid,-2,-32,12,null,0,0.5);
  ctx.fillStyle=rgba([210,170,60],0.9);ctx.beginPath();ctx.moveTo(-3,-38);ctx.lineTo(0,-44);ctx.lineTo(3,-38);ctx.closePath();ctx.fill();ctx.restore();}
AG_PLACES.bbDunes=c=>{bb_skyGrad(c,[164,190,210],[240,236,224],700);bb_clouds(c,9,90,420,7);
  const sea=c.createLinearGradient(0,640,0,700);sea.addColorStop(0,rgba([132,160,170],1));sea.addColorStop(1,rgba([170,186,182],1));c.fillStyle=sea;c.fillRect(0,640,W,60);
  const dune=(y,amp,col,seed)=>{c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=16)c.lineTo(x,y-amp*Math.pow(Math.max(0,AG_NZ.fbm(x*0.0011+seed,1.3,3)),1.4));c.lineTo(W,H);c.closePath();c.fill();};
  dune(720,140,[222,206,170],1.7);dune(800,230,[232,216,180],4.2);dune(930,200,[240,226,192],7.9);
  const sh=c.createLinearGradient(0,700,W,H);sh.addColorStop(0,"rgba(120,96,60,0.18)");sh.addColorStop(1,"rgba(255,250,236,0.12)");c.fillStyle=sh;c.fillRect(0,700,W,H-700);
  // tufts of beach grass
  const R=ag_rnd(3);c.strokeStyle="rgba(120,120,80,0.6)";c.lineWidth=2.5;c.lineCap="round";for(let i=0;i<40;i++){const x=R()*W,y=860+R()*200;for(let k=0;k<6;k++){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(k-3)*5,y-20,x+(k-3)*12,y-30-R()*20);c.stroke();}}
  ag_grain(c,0,0,W,H,1.4,19);};
// the Wrights' 1902 glider, seen from in front and a little below: two long wings, the struts between them, the elevator in front,
// the tail behind; twist (-1..1) warps both wings' tips, one up and one down, and the glider rolls with it
function bb_glider(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(o.roll||0);ctx.scale(s,s);const tw=o.twist||0,cl=[236,228,208],fr=[120,98,72];
  const wing=(yy,th)=>{ctx.fillStyle=rgba(cl,1);ctx.strokeStyle=rgba(fr,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-480,yy+tw*26);ctx.quadraticCurveTo(0,yy-8,480,yy-tw*26);
    ctx.lineTo(480,yy-tw*26+th+tw*8);ctx.quadraticCurveTo(0,yy+th-4,-480,yy+tw*26+th-tw*8);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle=rgba(fr,0.35);ctx.lineWidth=1.5;for(let k=-11;k<=11;k++){const xx=k*42;ctx.beginPath();ctx.moveTo(xx,yy+tw*26*(-xx/480)-1);ctx.lineTo(xx,yy+th+tw*20*(-xx/480)-2);ctx.stroke();}};
  wing(-60,22);wing(40,22);ctx.strokeStyle=rgba(fr,1);ctx.lineWidth=3;for(let k=-4;k<=4;k++){const xx=k*110;ctx.beginPath();ctx.moveTo(xx,-40+tw*26*(-xx/480));ctx.lineTo(xx,42+tw*26*(-xx/480));ctx.stroke();}
  // a pilot lying on the lower wing, seen from the front: a small dark shape
  ctx.fillStyle="rgba(50,44,40,0.9)";ctx.beginPath();ctx.ellipse(0,48,26,12,0,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(0,34,10,0,TAU);ctx.fill();
  // the elevator, out in front of the wings on its outriggers: a shorter surface, nearer to us, so a little lower and larger in the view
  ctx.strokeStyle=rgba(fr,0.8);ctx.lineWidth=2.4;for(const xx of [-70,70]){ctx.beginPath();ctx.moveTo(xx,-40);ctx.lineTo(xx*1.2,6);ctx.moveTo(xx,42);ctx.lineTo(xx*1.2,18);ctx.stroke();}
  ctx.fillStyle=rgba(cl,1);ctx.strokeStyle=rgba(fr,0.9);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-230,8);ctx.quadraticCurveTo(0,0,230,8);ctx.lineTo(230,20);ctx.quadraticCurveTo(0,14,-230,20);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle=rgba(fr,0.35);ctx.lineWidth=1.4;for(let k=-5;k<=5;k++){ctx.beginPath();ctx.moveTo(k*40,4+Math.abs(k)*0.3);ctx.lineTo(k*40,17+Math.abs(k)*0.3);ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- the maple and its seeds */
AG_PLACES.bbMaple=c=>{bb_skyGrad(c,[178,196,206],[236,226,206],H);
  // a soft park far behind: blurred trees and a lawn
  for(const [x,y,r,col] of [[200,700,260,[150,140,96]],[620,760,220,[176,150,96]],[1500,720,300,[160,120,80]],[1850,760,240,[140,132,96]]]){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,0.6));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
  const lawn=c.createLinearGradient(0,800,0,H);lawn.addColorStop(0,"rgba(150,160,110,0.6)");lawn.addColorStop(1,"rgba(120,130,90,0.8)");c.fillStyle=lawn;c.fillRect(0,800,W,H-800);
  // the branch, from the top left, with its leaves
  c.lineCap="round";const br=[[-40,120],[200,150],[420,130],[640,190],[820,170]];const S=bb_smooth(br,6);bb_strand(c,S,30,10,rgba([86,64,50],1),1);
  bb_strand(c,bb_smooth([[420,132],[470,80],[540,50]],6),12,5,rgba([86,64,50],1),1);bb_strand(c,bb_smooth([[640,188],[700,250],[760,300]],6),10,4,rgba([86,64,50],1),1);
  const leaf=(x,y,s,ang,col)=>{c.save();c.translate(x,y);c.rotate(ang);c.scale(s,s);c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,0);
    const pts=[[0,-8],[-30,-20],[-26,-46],[-52,-56],[-34,-74],[-14,-70],[0,-100],[14,-70],[34,-74],[52,-56],[26,-46],[30,-20],[0,-8]];for(const p of pts)c.lineTo(p[0],p[1]);c.closePath();c.fill();
    c.strokeStyle=rgba(mix(col,[90,40,20],0.4),0.6);c.lineWidth=1.5;c.beginPath();c.moveTo(0,0);c.lineTo(0,-90);c.moveTo(0,-30);c.lineTo(-36,-60);c.moveTo(0,-30);c.lineTo(36,-60);c.stroke();c.restore();};
  const R=ag_rnd(12);for(let i=0;i<22;i++){const q=bb_along(S,0.1+R()*0.85),col=[[206,120,60],[220,160,70],[190,90,50],[226,184,96]][i%4];leaf(q[0]+(R()-0.5)*40,q[1]+20+R()*40,1+R()*0.6,Math.PI+(R()-0.5)*1.4,col);}
  // two pairs of seeds still hanging
  for(const [x,y] of [[540,190],[700,240]]){c.save();c.translate(x,y);bb_seedShape(c,0.9,0.4);c.restore();}ag_grain(c,0,0,W,H,1.2,21);};
// a maple seed: the seed itself, and its wing, a thin veined blade; drawn at the origin, s its size, ang its turn
function bb_seedShape(c,s,ang){c.save();c.rotate(ang);c.scale(s,s);c.fillStyle="rgba(196,150,96,0.88)";c.beginPath();c.moveTo(0,0);c.bezierCurveTo(30,-14,90,-30,128,-18);c.bezierCurveTo(110,4,50,14,0,8);c.closePath();c.fill();
  c.strokeStyle="rgba(140,96,56,0.5)";c.lineWidth=1.4;for(let k=0;k<5;k++){c.beginPath();c.moveTo(8,4);c.quadraticCurveTo(50,-6-k*3,100+k*6,-16+k*3);c.stroke();}
  c.fillStyle="rgba(150,104,62,1)";c.beginPath();c.ellipse(4,4,14,10,0.3,0,TAU);c.fill();c.restore();}
// a seed spinning down: seen from the side, its wing turns round the seed; the blur of its turning is drawn as a soft disc
function bb_seedSpin(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);
  const sp=t*(o.rate||7.5);ctx.fillStyle="rgba(200,160,110,0.16)";ctx.beginPath();ctx.ellipse(0,-10*s,130*s,26*s,0,0,TAU);ctx.fill();
  ctx.save();ctx.scale(1,0.32);ctx.rotate(sp);bb_seedShape(ctx,s,0);ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- a brain, as an anatomy book draws it */
const BB_BRAIN={cx:960,cy:500,s:1.0};
// the outline of the brain from the side, facing left (the front at the left), at (cx, cy), size s
function bb_brainPath(c,cx,cy,s){c.moveTo(cx-330*s,cy+40*s);c.bezierCurveTo(cx-360*s,cy-120*s,cx-240*s,cy-260*s,cx-60*s,cy-270*s);c.bezierCurveTo(cx+120*s,cy-290*s,cx+300*s,cy-200*s,cx+330*s,cy-40*s);
  c.bezierCurveTo(cx+350*s,cy+60*s,cx+300*s,cy+120*s,cx+230*s,cy+120*s);c.bezierCurveTo(cx+150*s,cy+130*s,cx+60*s,cy+120*s,cx-20*s,cy+150*s);c.bezierCurveTo(cx-120*s,cy+180*s,cx-300*s,cy+170*s,cx-330*s,cy+40*s);c.closePath();}
function bb_brain(c,cx,cy,s,o){o=o||{};const pink=o.col||[226,180,170],hi=mix(pink,[255,246,240],0.5),dk=mix(pink,[90,40,50],0.4);
  // the cerebellum, at the back underneath, and the brainstem
  ag_soft(c,cc=>cc.ellipse(cx+200*s,cy+150*s,120*s,70*s,0.15,0,TAU),mix(pink,[120,60,70],0.15),hi,cx+260*s,cy+120*s,140*s,rgba(dk,0.5),14);
  c.save();c.strokeStyle=rgba(dk,0.35);c.lineWidth=3*s;for(let k=0;k<6;k++){c.beginPath();c.ellipse(cx+200*s,cy+150*s,(110-k*14)*s,(62-k*8)*s,0.15,Math.PI*1.05,Math.PI*1.95);c.stroke();}c.restore();
  ag_soft(c,cc=>{cc.moveTo(cx+90*s,cy+150*s);cc.bezierCurveTo(cx+100*s,cy+220*s,cx+120*s,cy+280*s,cx+110*s,cy+330*s);cc.lineTo(cx+170*s,cy+330*s);cc.bezierCurveTo(cx+170*s,cy+270*s,cx+160*s,cy+200*s,cx+150*s,cy+150*s);cc.closePath();},mix(pink,[150,90,90],0.2),hi,cx+160*s,cy+200*s,80*s,rgba(dk,0.45),10);
  ag_soft(c,cc=>bb_brainPath(cc,cx,cy,s),pink,hi,cx+180*s,cy-200*s,520*s,rgba(dk,0.55),26*s,0.75);
  // the folds: soft winding grooves, each a dark line with a lit edge
  c.save();ag_shape(c,cc=>bb_brainPath(cc,cx,cy,s));c.clip();const R=ag_rnd(o.seed||31);c.lineCap="round";
  for(let i=0;i<34;i++){let x=cx+(R()-0.5)*620*s,y=cy+(R()-0.6)*380*s;const P=[[x,y]];let a=R()*TAU;for(let k=0;k<7;k++){a+=(R()-0.5)*1.6;x+=Math.cos(a)*34*s;y+=Math.sin(a)*34*s;P.push([x,y]);}
    const Q=bb_smooth(P,4);bb_strand(c,Q,5*s,2*s,rgba(dk,0.42),1);c.save();c.translate(1.5*s,-1.5*s);bb_strand(c,Q,2.4*s,1*s,rgba(hi,0.5),1);c.restore();}
  // the deep groove along the side
  bb_strand(c,bb_smooth([[cx-210*s,cy+40*s],[cx-60*s,cy-10*s],[cx+80*s,cy-40*s],[cx+200*s,cy-90*s]],8),8*s,3*s,rgba(dk,0.55),1);c.restore();}
AG_PLACES.bbBrain=c=>{const g=c.createRadialGradient(1100,420,80,960,540,1200);g.addColorStop(0,rgba([108,82,70],1));g.addColorStop(1,rgba([46,34,32],1));c.fillStyle=g;c.fillRect(0,0,W,H);ag_grain(c,0,0,W,H,1.6,27);
  ag_floorShadow(c,960,820,420,40,0.4);bb_brain(c,BB_BRAIN.cx,BB_BRAIN.cy,BB_BRAIN.s);
  const v=c.createRadialGradient(960,540,500,960,540,1150);v.addColorStop(0,"rgba(20,12,10,0)");v.addColorStop(1,"rgba(20,12,10,0.45)");c.fillStyle=v;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- under the microscope: a stained slide's thicket of fibres
   The field is centred at BB_LENS (x, y, r). A Golgi slide is gold where nothing is stained, the few stained cells black. The
   thicket is painted once (bb_thicketTex), the cells drawn live over it, so it can fade as the stain picks a few. */
const BB_LENS={x:960,y:470,r:400};
function bb_thicketTex(){return ag_kept("bb:thicket",900,900,(c,w,h)=>{const g=c.createRadialGradient(w*0.6,h*0.4,40,w/2,h/2,w*0.7);g.addColorStop(0,rgba([236,206,140],1));g.addColorStop(1,rgba([206,168,98],1));
  c.fillStyle=g;c.fillRect(0,0,w,h);const R=ag_rnd(88);c.lineCap="round";
  for(let i=0;i<520;i++){let x=R()*w,y=R()*h,a=R()*TAU;const P=[[x,y]],n=6+((R()*8)|0),l=14+R()*30;for(let k=0;k<n;k++){a+=(R()-0.5)*0.9;x+=Math.cos(a)*l;y+=Math.sin(a)*l;P.push([x,y]);}
    const Q=bb_smooth(P,3);bb_strand(c,Q,1.2+R()*2.4,0.8,rgba(mix([120,80,40],[70,46,30],R()),0.25+R()*0.35),1);}
  for(let i=0;i<70;i++){const x=R()*w,y=R()*h,r=6+R()*9;c.fillStyle=rgba([140,96,52],0.2+R()*0.2);c.beginPath();c.ellipse(x,y,r,r*0.8,R()*3,0,TAU);c.fill();}
  ag_grain(c,0,0,w,h,2,31);});}
function bb_slideGold(){return ag_kept("bb:gold",900,900,(c,w,h)=>{const g=c.createRadialGradient(w*0.6,h*0.4,40,w/2,h/2,w*0.7);g.addColorStop(0,rgba([240,214,150],1));g.addColorStop(1,rgba([214,176,104],1));c.fillStyle=g;c.fillRect(0,0,w,h);
  const R=ag_rnd(91);c.lineCap="round";for(let i=0;i<140;i++){let x=R()*w,y=R()*h,a=R()*TAU;const P=[[x,y]];for(let k=0;k<6;k++){a+=(R()-0.5)*0.9;x+=Math.cos(a)*24;y+=Math.sin(a)*24;P.push([x,y]);}
    bb_strand(c,bb_smooth(P,3),1.4,0.6,rgba([150,110,60],0.12),1);}ag_grain(c,0,0,w,h,2,33);});}
AG_PLACES.bbLens=c=>{const g=c.createRadialGradient(960,470,300,960,540,1200);g.addColorStop(0,rgba([40,34,30],1));g.addColorStop(1,rgba([14,12,12],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  const L=BB_LENS;bb_lens(c,L.x,L.y,L.r,cc=>cc.drawImage(bb_slideGold(),L.x-L.r,L.y-L.r,L.r*2,L.r*2),{rim:22});};
// the thicket inside the lens, a: how much of it shows (it fades as the stain picks its few)
function bb_thicket(ctx,a){if(a<=0)return;const L=BB_LENS;ctx.save();ctx.beginPath();ctx.arc(L.x,L.y,L.r,0,TAU);ctx.clip();ctx.globalAlpha*=a;ctx.drawImage(bb_thicketTex(),L.x-L.r,L.y-L.r,L.r*2,L.r*2);
  const g=ctx.createRadialGradient(L.x,L.y,L.r*0.62,L.x,L.y,L.r);g.addColorStop(0,"rgba(30,20,10,0)");g.addColorStop(1,"rgba(30,20,10,0.55)");ctx.fillStyle=g;ctx.fillRect(L.x-L.r,L.y-L.r,L.r*2,L.r*2);ctx.restore();}
// the few cells the stain turns black, each grown once; they appear one by one, as if picked at random
const BB_STAINED=(()=>{const L=BB_LENS,R=ag_rnd(1888),out=[];const spots=[[-170,-120],[150,-170],[60,120],[-150,190],[230,90],[-40,-10]];
  spots.forEach((p,i)=>out.push(bb_cell(400+i*13,{x:L.x+p[0],y:L.y+p[1],r:13+R()*6,reach:90+R()*60,dirs:5+(i%3),depth:3,wig:0.45,spines:true,axon:{ang:R()*TAU,len:180+R()*140,bend:0.3,ends:3,endLen:40}})));
  return out;})();
// the one big cell, whole, like a tree in winter (the poster's cell): its body low, its branches rising, its fibre going down
// it fits in the lens's field, every branch and its fibre's ends, about 370 px from the field's middle at most: seen whole
const BB_TREE=bb_cell(1906,{x:960,y:470,r:21,reach:204,dirs:6,depth:4,wig:0.32,spines:true,axon:{ang:Math.PI*0.5,len:240,bend:0.15,ends:3,endLen:41}});
// what is seen through the lens stays inside its field: a cell that runs past the field's edge is cut off there, as in a microscope
function bb_inLens(ctx,fn){const L=BB_LENS;ctx.save();ctx.beginPath();ctx.arc(L.x,L.y,L.r,0,TAU);ctx.clip();fn(ctx);ctx.restore();}
// Golgi's idea: the fibres fused into one net, every crossing joined
const BB_NET=(()=>{const L=BB_LENS,R=ag_rnd(1873),N=[];for(let i=0;i<26;i++){const a=R()*TAU,d=Math.sqrt(R())*L.r*0.85;N.push([L.x+Math.cos(a)*d,L.y+Math.sin(a)*d]);}
  const E=[];N.forEach((p,i)=>{const d=N.map((q,j)=>[Math.hypot(q[0]-p[0],q[1]-p[1]),j]).filter(x=>x[1]!==i).sort((a,b)=>a[0]-b[0]);for(let k=0;k<3;k++){const j=d[k][1];if(!E.some(e=>e[0]===j&&e[1]===i))E.push([i,j,(R()-0.5)*60]);}});
  return{N,E};})();
function bb_golgiNet(ctx,u,a,col){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const c=col||[40,30,26];BB_NET.E.forEach(([i,j,b],k)=>{const p=BB_NET.N[i],q=BB_NET.N[j],m=[(p[0]+q[0])/2+b*0.4,(p[1]+q[1])/2-b*0.4];
    const P=bb_smooth([p,m,q],6);bb_strand(ctx,P,4,4,rgba(c,0.85),clamp(u*1.6-k/BB_NET.E.length*0.6,0,1));});
  ctx.fillStyle=rgba(c,0.9);BB_NET.N.forEach((p,i)=>{const k=clamp(u*1.6-0.6,0,1);if(k>0){ctx.beginPath();ctx.arc(p[0],p[1],8*k,0,TAU);ctx.fill();}});ctx.restore();}

/* ---------------------------------------------------------------- Barcelona, 1888: Cajal's room */
const BB_ROOM={table:[650,820],scope:[1080,700,0.98],cajal:[760,480,1.06]};
AG_PLACES.bbRoom=c=>{bb_wall(c,BB.plaster,0,660,5);
  // a bookcase on the left, its books in muted cloth
  c.fillStyle=rgba(BB.walnutDk,1);c.fillRect(60,90,380,570);const R=ag_rnd(64);for(let r=0;r<4;r++){const y=120+r*132;c.fillStyle=rgba(mix(BB.walnutDk,[0,0,0],0.3),1);c.fillRect(80,y,340,110);
    let x=86;while(x<410){const bw=14+R()*18,bh=70+R()*36,col=[[120,52,44],[66,78,96],[110,98,70],[78,90,72],[140,110,80],[96,60,70]][(R()*6)|0];c.fillStyle=rgba(col,1);c.fillRect(x,y+110-bh,bw,bh);
      c.fillStyle="rgba(255,230,180,0.35)";c.fillRect(x+3,y+110-bh+10,bw-6,3);x+=bw+2;}}
  ag_inner(c,cc=>cc.rect(60,90,380,570),"rgba(0,0,0,0.4)",14,-6,4);
  // a framed print on the wall
  ag_picture(c,560,170,240,170,{draw:(cc,px,py,pw,ph)=>{const g=cc.createLinearGradient(0,py,0,py+ph);g.addColorStop(0,"rgb(240,230,208)");g.addColorStop(1,"rgb(226,212,184)");cc.fillStyle=g;cc.fillRect(px,py,pw,ph);
    // the serrated peaks of Montserrat, above Barcelona, in sepia washes
    for(const [base,amp,col,seed] of [[0.78,0.5,[170,140,104],2],[0.92,0.36,[132,104,76],5]]){cc.fillStyle=rgba(col,0.85);cc.beginPath();cc.moveTo(px,py+ph);
      for(let i=0;i<=24;i++){const u=i/24,bump=Math.pow(Math.abs(Math.sin(u*Math.PI*7+seed)),0.6),env=Math.sin(u*Math.PI);cc.lineTo(px+u*pw,py+ph*base-ph*amp*env*(0.55+0.45*bump));}
      cc.lineTo(px+pw,py+ph);cc.closePath();cc.fill();}}});
  bb_window(c,1440,70,380,560,{frame:[214,204,184],sky0:[196,212,226],sky1:[244,236,218],view:(cc,x,y,w,h)=>{
    // the houses across the street: one row of fronts touching, each with its cornice, its windows and shutters, one pitched roof
    const fronts=[[0,0.44,[214,196,168]],[0.27,0.36,[200,176,146]],[0.52,0.48,[222,206,178]],[0.78,0.4,[206,184,152]]];
    fronts.forEach(([u0,top,col],k)=>{const x0=x+u0*w,x1=x+(fronts[k+1]?fronts[k+1][0]:1)*w,y0=y+h*top;cc.fillStyle=rgba(col,0.92);cc.fillRect(x0,y0,x1-x0,y+h-y0);
      cc.fillStyle=rgba(mix(col,[90,70,50],0.35),0.8);cc.fillRect(x0,y0-6,x1-x0,8);
      if(k===2){cc.fillStyle=rgba([176,104,72],0.85);cc.beginPath();cc.moveTo(x0-4,y0-4);cc.lineTo((x0+x1)/2,y0-40);cc.lineTo(x1+4,y0-4);cc.closePath();cc.fill();}
      for(let r=0;r<4;r++)for(let i=0;i<2;i++){const wx=x0+(x1-x0)*(0.22+i*0.4),wy=y0+26+r*62;if(wy>y+h-20)continue;cc.fillStyle=rgba(mix(col,[60,56,60],0.55),0.85);cc.fillRect(wx,wy,(x1-x0)*0.16,34);
        cc.fillStyle=rgba([96,120,104],0.6);cc.fillRect(wx-6,wy,5,34);cc.fillRect(wx+(x1-x0)*0.16+1,wy,5,34);}});}});
  bb_table(c,BB_ROOM.table[0],BB_ROOM.table[1]);c.fillStyle=rgba(mix(BB.walnutDk,[0,0,0],0.4),1);c.fillRect(0,BB_ROOM.table[1]+40,W,H);
  // on the table: slides in a row, a jar, the ink pot and paper
  for(let k=0;k<5;k++){const x=1300+k*58,y=760;ag_floorShadow(c,x+20,y+12,34,6,0.3);c.fillStyle="rgba(230,236,240,0.85)";c.fillRect(x,y,46,16);c.fillStyle="rgba(176,128,58,0.8)";c.fillRect(x+16,y+3,14,10);}
  ag_floorShadow(c,560,800,90,10,0.3);c.save();c.translate(470,700);c.rotate(-0.03);bb_paper(c,0,0,200,100);c.restore();
  ag_floorShadow(c,1640,752,40,9,0.35);ag_soft(c,cc=>cc.arc(1640,726,30,0,TAU),[40,44,52],[130,140,160],1654,712,34,"rgba(0,0,0,0.5)",6,0.6);
  ag_soft(c,cc=>ag_rect(cc,1720,640,70,112,10),[200,214,210],[255,255,255],1780,650,80,"rgba(40,60,60,0.3)",8,0.5);c.fillStyle="rgba(206,170,110,0.5)";c.fillRect(1726,690,58,58);
  ag_grain(c,0,0,W,H,1.2,6);};
function bb_room(ctx,t,o){o=o||{};const R=BB_ROOM;ag_person(ctx,BB_CAST.cajal,R.cajal[0],R.cajal[1],R.cajal[2],{t,cut:R.table[0]+14,nod:o.nod==null?0.12:o.nod,gaze:[3,2]});
  bb_scope(ctx,R.scope[0],R.scope[1],R.scope[2]);}

/* ---------------------------------------------------------------- 1888: a ward's corner, a chair by the window */
AG_PLACES.bbWard=c=>{bb_wall(c,[214,210,196],0,700,8);c.fillStyle=rgba([186,178,160],1);c.fillRect(0,520,W,180);c.fillStyle=rgba([160,150,132],1);c.fillRect(0,516,W,8);
  bb_window(c,1440,80,380,500,{frame:[220,214,200],sky0:[206,220,232],sky1:[246,240,226]});bb_boards(c,700,[150,120,90],12);ag_grain(c,0,0,W,H,1.2,8);};
// the patient's bed, drawn in front of them: an iron head rail at the left, the mattress and a pillow, and the blanket over their legs
function bb_bed(ctx,o){o=o||{};ctx.save();ctx.strokeStyle="rgba(64,66,72,0.95)";ctx.lineWidth=12;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(70,1090);ctx.lineTo(70,560);ctx.moveTo(70,600);ctx.lineTo(150,600);ctx.stroke();
  ag_soft(ctx,c=>{c.moveTo(60,800);c.lineTo(860,800);c.bezierCurveTo(900,800,910,830,900,860);c.lineTo(900,1090);c.lineTo(60,1090);c.closePath();},[236,234,226],[255,255,255],600,820,500,"rgba(60,60,70,0.25)",14,0.6);
  ag_soft(ctx,c=>{c.moveTo(150,820);c.bezierCurveTo(260,760,520,770,860,790);c.bezierCurveTo(900,792,920,830,900,870);c.lineTo(900,1090);c.lineTo(150,1090);c.closePath();},[176,182,192],[226,230,236],620,800,420,"rgba(40,44,60,0.3)",16,0.6);
  ctx.strokeStyle="rgba(120,126,140,0.5)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(200,880);ctx.quadraticCurveTo(480,850,860,870);ctx.stroke();ctx.restore();}
function bb_pillow(ctx){ag_soft(ctx,c=>{c.moveTo(90,560);c.bezierCurveTo(140,520,300,520,340,560);c.bezierCurveTo(360,640,350,740,330,800);c.lineTo(100,800);c.bezierCurveTo(80,720,80,620,90,560);c.closePath();},[242,240,234],[255,255,255],260,580,200,"rgba(60,60,70,0.22)",12,0.6);}

/* ---------------------------------------------------------------- Berlin, 1889: a long table of microscopes */
AG_PLACES.bbBerlin=c=>{bb_wall(c,[204,196,178],0,640,15);
  for(let k=0;k<3;k++)bb_window(c,280+k*560,70,300,470,{frame:[220,212,196],sky0:[200,212,222],sky1:[238,234,222]});
  bb_table(c,640,800,{col:[110,82,58]});c.fillStyle=rgba(mix(BB.walnutDk,[0,0,0],0.4),1);c.fillRect(0,840,W,H);ag_grain(c,0,0,W,H,1.2,16);};

/* ---------------------------------------------------------------- Stockholm, 1906: a hall with a stage */
AG_PLACES.bbHall=c=>{const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([92,74,70],1));g.addColorStop(1,rgba([140,110,92],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // tall curtains at the sides, folds lit from the right
  for(const [x0,x1] of [[0,360],[1560,1920]])for(let k=0;k<6;k++){const x=x0+k*(x1-x0)/6,w=(x1-x0)/6;const f=c.createLinearGradient(x,0,x+w,0);f.addColorStop(0,"rgba(110,36,40,1)");f.addColorStop(0.6,"rgba(150,56,56,1)");f.addColorStop(1,"rgba(96,30,34,1)");c.fillStyle=f;c.fillRect(x,0,w+1,900);}
  // the back wall with gilded panels, and a lamp's warm light
  for(let k=0;k<3;k++){const x=520+k*300;c.strokeStyle="rgba(214,182,110,0.5)";c.lineWidth=5;c.strokeRect(x,120,220,360);}
  const lg=c.createRadialGradient(960,260,40,960,400,900);lg.addColorStop(0,"rgba(255,226,170,0.45)");lg.addColorStop(1,"rgba(255,226,170,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);
  // the stage's front edge
  c.fillStyle=rgba([84,60,46],1);c.fillRect(0,860,W,220);c.fillStyle=rgba([150,116,84],1);c.fillRect(0,850,W,14);ag_grain(c,0,0,W,H,1.4,26);};

/* ===== Borrowed from the brain: living things =====
   The nerve cell's chapter and the animals', matte and soft-lit from the right like everything in the module, painted full-frame:
     bbTissue    living tissue under a lamp: warm and dark, other cells soft behind (closer, the gap between two cells)
     bbSea       open water, light from the surface at the top right, and the sea floor under it: sand, stones and weed
     bbMeadow    a meadow in summer, a flower in front (and a honeycomb, seen from above, in a round view over it)
     bbReef      a rocky reef
     bbBranch    a branch in a soft green garden
     bbEye       an eye cut in half, drawn on paper as an anatomy book would (and the blind spot's test, a patterned cloth)
   A film keeps every place it paints, a full frame each, so these are few: what is soft or small is drawn live or kept small.
   What lives is drawn live: the cells and their signals, the jellyfish, the sea slug, the bee, the octopus, the finches, the eye's
   light. Every name starts with bb_ or BB_. */

const BB_LIVE=[228,178,140];   // a living nerve cell: warm, lit like a lamp
const BB_INK2=[52,40,34];      // the drawn lines of the living world: a warm ink

/* ---------------------------------------------------------------- along a cell */
// the part of points P between fractions u0 and u1 of its length
function bb_sub(P,u0,u1){let tot=0;const L=[0];for(let i=1;i<P.length;i++){tot+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);L.push(tot);}
  const a=clamp(u0,0,1)*tot,b=clamp(u1,0,1)*tot,out=[];if(b<=a)return out;
  const at=d=>{for(let i=1;i<P.length;i++)if(d<=L[i]){const k=(d-L[i-1])/((L[i]-L[i-1])||1);return[lerp(P[i-1][0],P[i][0],k),lerp(P[i-1][1],P[i][1],k)];}return P[P.length-1].slice();};
  out.push(at(a));for(let i=0;i<P.length;i++)if(L[i]>a&&L[i]<b)out.push(P[i].slice());out.push(at(b));return out;}
// the way from the tip of branch i in to the cell's body, through the branches it grows from
function bb_toBody(cell,i){const out=[];let b=cell.B[i],from=1;while(b){for(const q of bb_sub(b.P,0,from).reverse())out.push(q);if(b.from<0)break;from=b.at;b=cell.B[b.from];}out.push([cell.x,cell.y]);return out;}
// the tips a cell takes its signals in at: its outer branches, spread round it
function bb_tips(cell,n){const outer=cell.B.map((b,i)=>[b,i]).filter(([b])=>!b.kids.length);const step=Math.max(1,Math.floor(outer.length/n));const out=[];for(let k=0;k<outer.length&&out.length<n;k+=step)out.push(outer[k][1]);return out;}
// a signal running along points P at u (0..1): a spark, with a short lit stretch behind it
function bb_run(ctx,P,u,w,o){o=o||{};if(u<=0||u>=1)return;const a=o.a==null?1:o.a;const S=bb_sub(P,Math.max(0,u-(o.tail||0.1)),u);if(S.length>1){ctx.save();ctx.globalAlpha*=a;bb_strand(ctx,S,w*0.3,w,rgba(BB.spark,0.55),1);ctx.restore();}
  const q=bb_along(P,u);bb_spark(ctx,q[0],q[1],o.r||22,a);}
// a cell's pulse: the body flashes, then the pulse runs down its long fibre and out along its end branches; k (0..1) how far it has gone
function bb_pulse(ctx,cell,k,o){o=o||{};if(k<=0||k>=1)return;bb_cellGlow(ctx,cell,(1-ag_in(k,0.05,0.25))*0.9);const u=clamp((k-0.06)/0.94,0,1);if(u<=0)return;
  if(u<0.82)bb_run(ctx,cell.A,u/0.82,o.w||cell.w0*1.6,{r:o.r||24});else cell.ends.forEach(e=>bb_run(ctx,e,(u-0.82)/0.18,o.w||cell.w0,{r:(o.r||24)*0.75,tail:0.35}));}

/* ---------------------------------------------------------------- living tissue under a lamp */
// soft cells far behind, out of focus; painted at half size, as it's soft anyway
function bb_softBack(c,seed,base,n,blur,spots){const w=960,h=540,cv=mkCanvas(w,h),x=cv.getContext("2d");
  const g=x.createRadialGradient(w*0.78,h*0.22,20,w*0.55,h*0.5,w*0.85);g.addColorStop(0,rgba(base[0],1));g.addColorStop(0.55,rgba(base[1],1));g.addColorStop(1,rgba(base[2],1));x.fillStyle=g;x.fillRect(0,0,w,h);
  // the spots drawn sharp on their own canvas, then blurred once onto the ground (a blur on each shape took seconds)
  const sp=mkCanvas(w,h),y=sp.getContext("2d"),R=ag_rnd(seed);
  for(let i=0;i<n;i++){const px=R()*w,py=R()*h,r=8+R()*22,col=mix(spots[0],spots[1],R());y.fillStyle=rgba(col,0.18+R()*0.22);y.beginPath();y.ellipse(px,py,r,r*0.85,R()*3,0,TAU);y.fill();
    for(let k=0;k<3;k++){let a=R()*TAU,qx=px,qy=py;const P=[[qx,qy]];for(let j=0;j<6;j++){a+=(R()-0.5)*0.7;qx+=Math.cos(a)*26;qy+=Math.sin(a)*26;P.push([qx,qy]);}bb_strand(y,bb_smooth(P,3),3.5,1,rgba(col,0.16),1);}}
  x.filter="blur("+blur+"px)";x.drawImage(sp,0,0);x.filter="none";c.drawImage(cv,0,0,W,H);}
AG_PLACES.bbTissue=c=>{bb_softBack(c,77,[[124,86,68],[74,50,44],[36,26,26]],30,7,[[150,100,84],[214,156,120]]);ag_grain(c,0,0,W,H,1.2,29);};

// the nerve cells of the cell's chapter: one big one, its fibre running to the right, and the next cell, where it ends
const BB_N1=bb_cell(2049,{x:560,y:480,r:38,reach:250,dirs:7,depth:3,wig:0.36,spines:true,axon:{ang:0.04,len:700,bend:0.2,ends:3,endLen:66},axW:13});
const BB_N1E=BB_N1.A[BB_N1.A.length-1];
const BB_N2=bb_cell(1891,{x:BB_N1E[0]+250,y:BB_N1E[1]+30,r:32,reach:190,dirs:6,depth:3,wig:0.4,spines:true,axon:{ang:0.3,len:400,bend:0.2,ends:3,endLen:50},axW:11});
const BB_N1TIPS=bb_tips(BB_N1,12).map(i=>bb_toBody(BB_N1,i));
// the cells round it, faint, whose fibres end on its branches
const BB_AROUND=[[200,310,0.6],[300,880,-0.9],[1150,140,2.4],[880,900,-2.2],[120,600,0.1]].map(([x,y,a],i)=>bb_cell(3100+i*7,{x,y,r:20,reach:120,dirs:5,depth:2,wig:0.45,axon:{ang:a,len:260,bend:0.3,ends:3,endLen:40},axW:7}));

/* ---------------------------------------------------------------- the pulse, as a trace: all or nothing */
// a card: the pulse over time; small bumps that stay under the dashed line (not enough arrived: nothing), then pulses, each the same height
function bb_trace(ctx,x,y,w,h,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,o.title||"All or nothing",x+30,y+54,{w:700,size:34});
  const gx=x+30,gw=w-60,base=y+h-36,top=y+96,thr=lerp(base,top,0.42);
  ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle=rgba(AG.mut,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx,thr);ctx.lineTo(gx+gw,thr);ctx.stroke();ctx.restore();
  const ev=o.ev||[[0.12,0.22],[0.24,0.3],[0.44,1],[0.64,1],[0.84,1]],v=s=>{let m=0;for(const [c,hh] of ev){const d=(s-c)/(hh>=1?0.011:0.028);m+=hh*Math.exp(-d*d);}return m;};
  ctx.strokeStyle=rgba(BB.ink,0.86);ctx.lineWidth=3.4;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();const n=260,m=Math.ceil(n*clamp(u,0,1));
  for(let i=0;i<=m;i++){const s=i/n,yy=base-(base-top)*v(s);i?ctx.lineTo(gx+gw*s,yy):ctx.moveTo(gx+gw*s,yy);}ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the gap: one cell's fibre ending by the next, close up
   The fibre comes in from the top left and swells to an end (its knob, full of small sacs of messengers); the next cell's branch comes
   from the bottom right, its surface set with the places the messengers fit. The gap runs between them. All drawn live: when the pulse
   arrives (o.t0), a few sacs open at the gap, their messengers cross it, and where they land the next cell lights (o.glow) or, held back,
   dims (o.dim). o.grow (0..1) makes the connection stronger: a bigger end, more places for the messengers. */
const BB_SYN=(()=>{const kc=[740,396],kr=250,hc=[1190,736],hr=232,d=[hc[0]-kc[0],hc[1]-kc[1]],L=Math.hypot(d[0],d[1]),u=[d[0]/L,d[1]/L],
    kb=[kc[0]+u[0]*kr,kc[1]+u[1]*kr],hb=[hc[0]-u[0]*hr,hc[1]-u[1]*hr],R=ag_rnd(1953),ves=[];
  for(let i=0;i<18;i++){const a=Math.atan2(u[1],u[0])+(R()-0.5)*2.4,rr0=kr*(0.25+R()*0.55);ves.push([kc[0]+Math.cos(a)*rr0,kc[1]+Math.sin(a)*rr0,16+R()*8]);}
  ves.sort((p,q)=>Math.hypot(p[0]-kb[0],p[1]-kb[1])-Math.hypot(q[0]-kb[0],q[1]-kb[1]));
  const rec=[];const a0=Math.atan2(-u[1],-u[0]);for(let i=0;i<11;i++){const a=a0+(i-5)*0.085;rec.push([hc[0]+Math.cos(a)*hr,hc[1]+Math.sin(a)*hr,a,i%2===1]);}
  return{kc,kr,hc,hr,u,kb,hb,ves,rec,gap:[(kb[0]+hb[0])/2,(kb[1]+hb[1])/2],
    knob:bb_blob(kc[0],kc[1],kr,kr*0.94,0.7,0.05,72),head:bb_blob(hc[0],hc[1],hr,hr*0.95,1.9,0.05,72)};})();
function bb_synapse(ctx,t,o){o=o||{};const S=BB_SYN,grow=o.grow||0,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const col=BB_LIVE,dk=mix(col,[60,30,30],0.4),hi=mix(col,[255,250,244],0.5);
  // the next cell's branch, from the bottom right, and its head by the gap
  ag_soft(ctx,c=>{c.moveTo(2000,1040);c.bezierCurveTo(1700,980,1480,900,S.hc[0]+120,S.hc[1]+150);c.lineTo(S.hc[0]+60,S.hc[1]+220);c.bezierCurveTo(1480,1060,1700,1120,2000,1180);c.closePath();},mix(col,dk,0.25),hi,1500,900,400,rgba(dk,0.5),20,0.5);
  const lit=o.glow||0,dim=o.dim||0;
  ag_soft(ctx,c=>bb_path(c,S.head),mix(mix(col,[255,236,200],0.35*lit),[70,60,70],0.45*dim),hi,S.hc[0]+90,S.hc[1]-80,S.hr*1.5,rgba(dk,0.55),24,0.7);
  ctx.strokeStyle=rgba(mix(dk,[30,16,14],0.3),0.55);ctx.lineWidth=7;ctx.beginPath();bb_path(ctx,S.head);ctx.stroke();
  if(lit>0){ctx.save();ctx.beginPath();bb_path(ctx,S.head);ctx.clip();const g=ctx.createRadialGradient(S.hb[0],S.hb[1],10,S.hb[0],S.hb[1],S.hr*1.6);g.addColorStop(0,rgba(BB.spark,0.75*lit));g.addColorStop(1,rgba(BB.spark,0));ctx.fillStyle=g;ctx.fillRect(S.hc[0]-S.hr*2,S.hc[1]-S.hr*2,S.hr*4,S.hr*4);ctx.restore();}
  // the places the messengers fit, along the head's edge by the gap (more of them as the connection grows)
  const bound=o.bound||0;S.rec.forEach(([x,y,an,extra],i)=>{const k=extra?ag_in(grow,0.2+i*0.04,0.3):1;if(k<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(an+Math.PI/2);ctx.scale(k,k);
    ctx.fillStyle=rgba(mix(dk,[255,236,200],0.6*bound),1);rr(ctx,-11,-8,22,22,6);ctx.fill();ctx.restore();});
  // the fibre from the top left, and its end
  const kg=1+0.1*grow;ctx.save();ag_about(ctx,S.kb[0],S.kb[1],kg);
  ag_soft(ctx,c=>{c.moveTo(-80,250);c.bezierCurveTo(120,236,300,240,S.kc[0]-200,S.kc[1]-110);c.lineTo(S.kc[0]-190,S.kc[1]+110);c.bezierCurveTo(300,450,120,430,-80,430);c.closePath();},mix(col,dk,0.2),hi,260,300,400,rgba(dk,0.5),20,0.5);
  ag_soft(ctx,c=>bb_path(c,S.knob),col,hi,S.kc[0]+110,S.kc[1]-120,S.kr*1.5,rgba(dk,0.55),26,0.75);
  ctx.strokeStyle=rgba(mix(dk,[30,16,14],0.3),0.55);ctx.lineWidth=7;ctx.beginPath();bb_path(ctx,S.knob);ctx.stroke();
  // the small sacs, each holding messengers; the nearest few open at the gap when the pulse arrives
  const t0=o.t0,since=t0==null?-1:t-t0;
  S.ves.forEach(([x,y,r],i)=>{let px=x,py=y,rad=r,open=0;if(i<4&&since>0){const m=ag_sine(clamp(since/0.5,0,1)),to=[S.kb[0]-S.u[0]*20+(i-1.5)*S.u[1]*44,S.kb[1]-S.u[1]*20-(i-1.5)*S.u[0]*44];
      px=lerp(x,to[0],m);py=lerp(y,to[1],m);open=clamp((since-0.45)/0.35,0,1);rad=r*(1-0.6*open);}
    if(rad<=1)return;ctx.fillStyle=rgba(mix(col,[255,246,232],0.55),1-0.7*open);ctx.beginPath();ctx.arc(px,py,rad,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(dk,0.5*(1-open));ctx.lineWidth=2.4;ctx.stroke();ctx.fillStyle=rgba(BB.spark,0.9*(1-open));for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(px+Math.cos(k*1.7+i)*rad*0.45,py+Math.sin(k*1.7+i)*rad*0.45,2.6,0,TAU);ctx.fill();}});
  ctx.restore();
  // the messengers, crossing the gap to the places they fit
  if(since>0.7){const R=ag_rnd(7);for(let i=0;i<28;i++){const d0=R()*0.5,s=clamp((since-0.7-d0)/1.1,0,1),sx=(R()-0.5)*170,ex=(R()-0.5)*190;if(s<=0)continue;
    const A=[S.kb[0]+S.u[1]*sx*0.5-S.u[0]*6,S.kb[1]-S.u[0]*sx*0.5-S.u[1]*6],B=[S.hb[0]+S.u[1]*ex*0.5+S.u[0]*4,S.hb[1]-S.u[0]*ex*0.5+S.u[1]*4],
      e=ag_sine(s),wob=Math.sin(s*9+i)*7*(1-s);const x=lerp(A[0],B[0],e)+S.u[1]*wob,y=lerp(A[1],B[1],e)-S.u[0]*wob;
    const fade=1-ag_in(since,2.6+d0,0.6);if(fade<=0)continue;bb_spark(ctx,x,y,11,fade);}}
  ctx.restore();}
// a small diagram of a connection for a card: the end of one cell above, the next below; kind "excite" lights it, "hold" dims it (k 0..1)
function bb_miniSyn(ctx,x,y,s,kind,k,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const col=BB_LIVE,dk=mix(col,[60,30,30],0.4),hi=mix(col,[255,250,244],0.5);
  ag_soft(ctx,c=>{c.moveTo(-26,-150);c.lineTo(26,-150);c.lineTo(30,-70);c.bezierCurveTo(80,-60,86,-12,50,-4);c.lineTo(-50,-4);c.bezierCurveTo(-86,-12,-80,-60,-30,-70);c.closePath();},col,hi,30,-60,90,rgba(dk,0.5),10,0.7);
  const lit=kind==="excite"?k:0,dim=kind==="hold"?k:0;
  ag_soft(ctx,c=>{c.moveTo(-90,24);c.bezierCurveTo(-60,10,60,10,90,24);c.bezierCurveTo(110,70,80,140,0,150);c.bezierCurveTo(-80,140,-110,70,-90,24);c.closePath();},mix(mix(col,[255,236,200],0.4*lit),[70,62,74],0.55*dim),hi,40,40,120,rgba(dk,0.5),12,0.7);
  if(lit>0)bb_spark(ctx,0,70,90*lit,0.7*lit);
  // messengers in the gap
  for(let i=0;i<6;i++){const ph=((t||0)*0.9+i/6)%1;bb_spark(ctx,-40+i*16,-2+ph*24,6,0.8*Math.sin(Math.PI*ph));}
  ctx.restore();}

/* ---------------------------------------------------------------- portraits, a rabbit, a graph */
// a person in an oval mount, from the chest up, with their name under it (who as ag_person's)
function bb_portrait(ctx,x,y,w,h,who,name,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h+(name?64:0),22,{});const cx=x+w/2,cy=y+h/2,rx=w/2-26,ry=h/2-26;
  ctx.save();ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.clip();const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(o.bg0||[196,190,176],1));g.addColorStop(1,rgba(o.bg1||[228,222,206],1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  const s=o.s||(ry*2/430);ag_person(ctx,who,cx-12*s,cy+ry*0.42,s,{t,covered:true,flip:o.flip,gaze:o.gaze||[2,0],smile:o.smile==null?0.25:o.smile,nod:o.nod||0});ctx.restore();
  ctx.strokeStyle=rgba(BB.brass,0.9);ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.stroke();
  if(name)ag_T(ctx,name,cx,y+h+40,{w:700,size:30,align:"center"});ctx.restore();}
// a rabbit sitting, seen from the side, facing left: its body round, long ears laid back, a white tail; s its size (1: about 300 px long)
function bb_rabbit(ctx,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const fur=[150,128,108],dk=mix(fur,[40,30,24],0.45),hi=mix(fur,[250,240,226],0.5);
  ag_floorShadow(ctx,10,6,150,16,0.3);
  ag_soft(ctx,c=>{c.moveTo(-60,-150);c.bezierCurveTo(-20,-180,80,-176,130,-120);c.bezierCurveTo(170,-76,170,-10,130,0);c.lineTo(-40,0);c.bezierCurveTo(-90,-20,-100,-110,-60,-150);c.closePath();},fur,hi,60,-150,200,rgba(dk,0.5),18,0.6);
  ag_soft(ctx,c=>c.ellipse(-24,-6,46,12,0,0,TAU),mix(fur,dk,0.3),hi,-10,-12,40,null);
  ag_soft(ctx,c=>c.arc(150,-74,26,0,TAU),[244,240,232],[255,255,255],156,-84,30,"rgba(0,0,0,0.2)",6);
  // the head, the ears laid back over the shoulders
  ag_soft(ctx,c=>{c.moveTo(-150,-120);c.bezierCurveTo(-150,-176,-60,-196,-30,-150);c.bezierCurveTo(-14,-120,-36,-84,-80,-80);c.bezierCurveTo(-118,-80,-150,-90,-150,-120);c.closePath();},fur,hi,-70,-170,110,rgba(dk,0.5),12,0.6);
  for(const [dx,dy,r] of [[0,0,0.18],[16,-6,0.08]])ag_soft(ctx,c=>{c.moveTo(-58+dx,-166+dy);c.bezierCurveTo(-20+dx,-222+dy,60+dx,-226+dy,92+dx,-200+dy);c.bezierCurveTo(70+dx,-184+dy,10+dx,-170+dy,-36+dx,-150+dy);c.closePath();},mix(fur,dk,r),hi,40,-210,80,rgba(dk,0.4),8,0.5);
  ctx.fillStyle="#1d1614";ctx.beginPath();ctx.arc(-96,-136,6.5,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.7)";ctx.beginPath();ctx.arc(-94,-138,2,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(mix(fur,[120,70,70],0.5),1);ctx.beginPath();ctx.arc(-148,-116,4.5,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(250,246,240,0.55)";ctx.lineWidth=1.4;for(const k of [-1,0,1]){ctx.beginPath();ctx.moveTo(-146,-110);ctx.quadraticCurveTo(-176,-110+k*8,-200,-104+k*16);ctx.stroke();}
  ctx.restore();}
// a small graph on a card: a link's strength over time, steady, then, after use (at x share u0), higher and staying high; u draws it on
function bb_graph(ctx,x,y,w,h,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,o.title||"Link strength",x+30,y+52,{w:700,size:32});
  const gx=x+40,gw=w-80,base=y+h-56,top=y+92;ctx.strokeStyle=rgba(AG.mut,0.6);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(gx,top);ctx.lineTo(gx,base);ctx.lineTo(gx+gw,base);ctx.stroke();
  const u0=o.u0||0.36,v=s=>s<u0?0.3:0.3+0.45*ag_eo(clamp((s-u0)/0.08,0,1));ctx.strokeStyle=rgba(BB.ink,0.86);ctx.lineWidth=4;ctx.lineJoin="round";ctx.beginPath();
  const n=120,m=Math.ceil(n*clamp(u,0,1));for(let i=0;i<=m;i++){const s=i/n,yy=base-(base-top)*v(s);i?ctx.lineTo(gx+gw*s,yy):ctx.moveTo(gx+gw*s,yy);}ctx.stroke();
  if(u>u0){ctx.fillStyle=rgba(BB.ink,0.85);ag_T(ctx,o.mark||"use",gx+gw*u0,base+38,{w:700,size:28,align:"center",col:AG.mut});ctx.strokeStyle=rgba(AG.mut,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx+gw*u0,base);ctx.lineTo(gx+gw*u0,base+8);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- under the sea */
function bb_water(c,top,mid,low,seed){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(top,1));g.addColorStop(0.5,rgba(mid,1));g.addColorStop(1,rgba(low,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.globalCompositeOperation="lighter";for(let k=0;k<7;k++){const x0=1060+k*150,sl=0.5+k*0.04,gr=c.createLinearGradient(x0,0,x0-sl*H,H);gr.addColorStop(0,"rgba(255,250,230,0.09)");gr.addColorStop(1,"rgba(255,250,230,0)");
    c.fillStyle=gr;c.beginPath();c.moveTo(x0-30,0);c.lineTo(x0+50,0);c.lineTo(x0+50-sl*H,H);c.lineTo(x0-150-sl*H,H);c.closePath();c.fill();}c.restore();
  const R=ag_rnd(seed);for(let i=0;i<110;i++){c.fillStyle="rgba(232,242,238,"+(0.08+R()*0.18)+")";c.beginPath();c.arc(R()*W,R()*H,1+R()*2.2,0,TAU);c.fill();}}
// open water over the sea floor: the jellyfish swims in the water, the sea slug lies on the floor (the camera closes on each in turn)
AG_PLACES.bbSea=c=>{bb_water(c,[146,190,192],[72,130,144],[44,88,100],33);
  const g=c.createLinearGradient(0,760,0,H);g.addColorStop(0,rgba([170,162,132],1));g.addColorStop(1,rgba([126,116,92],1));c.fillStyle=g;c.beginPath();c.moveTo(0,H);c.lineTo(0,800);
  for(let x=0;x<=W;x+=24)c.lineTo(x,790-34*AG_NZ.fbm(x*0.002,0.7,3));c.lineTo(W,H);c.closePath();c.fill();
  const hz=c.createLinearGradient(0,700,0,840);hz.addColorStop(0,"rgba(72,130,144,0.5)");hz.addColorStop(1,"rgba(72,130,144,0)");c.fillStyle=hz;c.fillRect(0,700,W,140);
  const R=ag_rnd(17);for(let i=0;i<8;i++){const x=R()*W,y=880+R()*170,r=50+R()*80,B=bb_blob(x,y,r,r*0.55,i*1.3,0.2,24);ag_soft(c,cc=>bb_path(cc,B),[104,106,98],[176,178,166],x+r*0.4,y-r*0.5,r*1.4,"rgba(20,30,30,0.4)",10,0.5);}
  for(let i=0;i<12;i++){const x=R()*W,y=820+R()*120,h=110+R()*200;for(let k=0;k<3;k++){const P=[];for(let j=0;j<=8;j++){const q=j/8;P.push([x+k*14+Math.sin(q*3+i+k)*26*q,y-h*q]);}bb_strand(c,bb_smooth(P,3),16,4,rgba(mix([86,112,70],[140,132,76],R()),0.72),1);}}
  ag_grain(c,0,0,W,H,1.2,35);};
// a jellyfish: its bell pulsing, a net of nerve cells in it (o.net lights it), tentacles and four frilled arms trailing; s its size
// (1: the bell 440 px across); o.food (0..1) brings a small shrimp into its tentacles and up an arm
function bb_jelly(ctx,x,y,s,t,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);const ph=t*1.9,p=Math.pow(Math.max(0,Math.sin(ph)),2),Rw=220*(1-0.09*p),Rh=150*(1+0.08*p),bob=-p*14;
  ctx.translate(0,bob);
  // tentacles from the margin, and the four frilled arms from the middle
  ctx.lineCap="round";for(let i=0;i<34;i++){const f=i/33,mx=lerp(-Rw*0.96,Rw*0.96,f),my=8+Math.sin(f*Math.PI)*6;ctx.strokeStyle="rgba(236,226,232,"+(0.32+0.2*Math.sin(i))+")";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx,my);
    for(let j=1;j<=12;j++){const k=j/12;ctx.lineTo(mx*(1-0.2*k)+Math.sin(t*1.3+i*0.7+j*0.45)*16*k,my+k*(300+40*Math.sin(i*1.3))-p*20*k);}ctx.stroke();}
  for(let i=0;i<4;i++){const P=[];const sx=(i-1.5)*30;for(let j=0;j<=10;j++){const k=j/10;P.push([sx*(1+k*1.5)+Math.sin(t*1.1+i*1.6+j*0.5)*20*k,30+k*360-p*24*k]);}
    bb_strand(ctx,bb_smooth(P,3),26,6,"rgba(232,214,226,0.55)",1);const Q=P.map(q=>[q[0]+5,q[1]]);ctx.strokeStyle="rgba(250,240,246,0.5)";ctx.lineWidth=1.6;ctx.beginPath();bb_path(ctx,bb_smooth(Q,3),false);ctx.stroke();}
  // the shrimp, caught
  const fd=o.food||0;if(fd>0){const k=ag_sine(clamp(fd*1.4,0,1)),up=ag_sine(clamp(fd*1.4-0.5,0,1)),fx=lerp(320,40,k),fy=lerp(260,300,k)-up*200;ctx.save();ctx.translate(fx,fy);ctx.rotate(-0.4+k*0.6);
    ctx.fillStyle="rgba(196,132,100,0.95)";ctx.beginPath();ctx.ellipse(0,0,16,7,0,0,TAU);ctx.fill();ctx.strokeStyle="rgba(196,132,100,0.9)";ctx.lineWidth=1.5;for(let k2=0;k2<4;k2++){ctx.beginPath();ctx.moveTo(-6+k2*4,4);ctx.lineTo(-10+k2*5,14);ctx.stroke();}ctx.beginPath();ctx.moveTo(14,-2);ctx.quadraticCurveTo(30,-16,42,-12);ctx.stroke();ctx.restore();}
  // the bell: clear, lit from the top right, its margin scalloped
  const bell=c=>{c.moveTo(-Rw,4);c.bezierCurveTo(-Rw,-Rh*1.15,Rw,-Rh*1.15,Rw,4);for(let k=16;k>=0;k--){const xx=lerp(-Rw,Rw,k/16);c.quadraticCurveTo(xx+Rw/16,18,xx,4);}c.closePath();};
  ctx.save();ctx.globalAlpha*=0.62;ag_soft(ctx,bell,[214,224,232],[255,255,255],Rw*0.4,-Rh*0.8,Rw*1.1,"rgba(40,70,90,0.35)",18,0.8);ctx.restore();
  // the four rings inside, and the net of nerve cells
  for(let k=0;k<4;k++){const a=k/4*TAU+0.4;ctx.strokeStyle="rgba(214,170,190,0.6)";ctx.lineWidth=9;ctx.beginPath();ctx.ellipse(Math.cos(a)*Rw*0.26,-Rh*0.34+Math.sin(a)*Rh*0.12,Rw*0.11,Rh*0.09,a,0.4,TAU-0.4);ctx.stroke();}
  const net=o.net||0;if(net>0){ctx.save();ctx.globalAlpha*=net;const R=ag_rnd(600);ctx.strokeStyle=rgba(BB.spark,0.85);ctx.lineWidth=2.2;ctx.shadowColor=rgba(BB.spark,0.9);ctx.shadowBlur=10;
    ctx.beginPath();ctx.ellipse(0,-2,Rw*0.92,10,0,Math.PI,TAU);ctx.stroke();
    const pts=[];for(let i=0;i<30;i++){const a=Math.PI+R()*Math.PI,d=0.25+R()*0.68;pts.push([Math.cos(a)*Rw*d,-2+Math.sin(a)*Rh*d*0.92]);}
    pts.forEach((q,i)=>{const n=pts.map((r,j)=>[Math.hypot(r[0]-q[0],r[1]-q[1]),j]).filter(z=>z[1]!==i).sort((a2,b2)=>a2[0]-b2[0]);for(let k=0;k<2;k++){const r=pts[n[k][1]];ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(r[0],r[1]);ctx.stroke();}});
    ctx.fillStyle=rgba(BB.spark,1);pts.forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],3.6,0,TAU);ctx.fill();});
    // a signal running round the net with each pulse
    const run=(ph/TAU)%1;bb_spark(ctx,Math.cos(Math.PI+run*Math.PI)*Rw*0.92,-2+Math.sin(Math.PI+run*Math.PI)*10,18,0.9);ctx.restore();}
  ctx.restore();}

// a sea slug (Aplysia), from the side, facing left: a soft body, two wing-like flaps along its back, two rolled tentacles on its head;
// s its size (1: about 540 px long); its flaps ripple with t
function bb_slug(ctx,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const col=[124,100,74],dk=mix(col,[30,20,14],0.45),hi=mix(col,[240,226,200],0.45),w=Math.sin(t*1.6)*6;
  ag_floorShadow(ctx,10,4,260,20,0.35);
  const body=c=>{c.moveTo(270,0);c.bezierCurveTo(250,-60,170,-120,60,-130);c.bezierCurveTo(-40,-136,-120,-110,-170,-80);c.bezierCurveTo(-210,-60,-250,-56,-266,-30);c.bezierCurveTo(-276,-10,-262,0,-240,0);c.closePath();};
  ag_soft(ctx,body,col,hi,40,-140,280,rgba(dk,0.5),20,0.55);
  // the flaps, rippling
  ag_soft(ctx,c=>{c.moveTo(-60,-120);c.bezierCurveTo(-40,-200+w,40,-226-w,110,-206+w);c.bezierCurveTo(170,-190,210,-160,220,-90);c.bezierCurveTo(160,-120,60,-130,-60,-120);c.closePath();},mix(col,dk,0.2),hi,80,-210,160,rgba(dk,0.5),14,0.5);
  ag_soft(ctx,c=>{c.moveTo(-30,-122);c.bezierCurveTo(0,-176-w,70,-196+w,130,-182-w);c.bezierCurveTo(176,-170,200,-140,204,-100);c.bezierCurveTo(150,-124,60,-130,-30,-122);c.closePath();},mix(col,hi,0.15),hi,100,-190,140,rgba(dk,0.4),10,0.5);
  // the head's rolled tentacles and the flat ones at the front
  for(const [bx,tx,ty] of [[-196,-170,-170],[-176,-136,-176]])bb_strand(ctx,bb_smooth([[bx,-76],[bx+4,-120],[tx,ty]],6),20,8,rgba(mix(col,dk,0.15),1),1);
  ag_soft(ctx,c=>{c.moveTo(-250,-40);c.bezierCurveTo(-300,-60,-330,-40,-320,-14);c.bezierCurveTo(-300,-6,-270,-14,-250,-20);c.closePath();},mix(col,dk,0.1),hi,-300,-50,50,rgba(dk,0.4),8,0.5);
  // pale spots
  const R=ag_rnd(9);ctx.save();ctx.beginPath();body(ctx);ctx.clip();for(let i=0;i<30;i++){ctx.fillStyle="rgba(236,226,206,"+(0.2+R()*0.25)+")";ctx.beginPath();ctx.ellipse(-240+R()*500,-120+R()*110,3+R()*7,2+R()*4,R()*3,0,TAU);ctx.fill();}ctx.restore();
  ctx.fillStyle="#1d1614";ctx.beginPath();ctx.arc(-190,-70,4,0,TAU);ctx.fill();ctx.restore();}
// big nerve cells, as a magnifier shows them: a few large round bodies and their fibres, on a pale ground
function bb_bigCells(ctx,cx,cy,r,u){bb_lens(ctx,cx,cy,r,c=>{const g=c.createRadialGradient(cx+r*0.3,cy-r*0.3,10,cx,cy,r);g.addColorStop(0,"rgb(240,230,206)");g.addColorStop(1,"rgb(206,190,160)");c.fillStyle=g;c.fillRect(cx-r,cy-r,r*2,r*2);
    for(const [dx,dy,rr0,sd] of [[-50,-30,64,1],[70,40,48,2],[-10,90,36,3],[90,-80,30,4]]){const k=ag_in(u,0.1*sd,0.4);if(k<=0)continue;const cl=bb_cell(500+sd,{x:cx+dx,y:cy+dy,r:rr0,reach:rr0*2.4,dirs:5,depth:2,wig:0.4,axon:{ang:sd,len:rr0*4,ends:2,endLen:30},axW:rr0*0.3});
      bb_drawCell(c,cl,{u:k,col:[214,170,110]});}},{rim:16});}

AG_PLACES.bbMeadow=c=>{const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([196,212,214],1));g.addColorStop(0.42,rgba([214,214,180],1));g.addColorStop(1,rgba([120,138,80],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // a soft meadow far behind: blurred grasses and flowers
  // drawn sharp on a small canvas, then blurred once (a blur on each stroke took seconds)
  const cv=mkCanvas(960,540),x=cv.getContext("2d");const R=ag_rnd(23);
  for(let i=0;i<220;i++){const px=R()*960,py=200+R()*340,h=30+R()*80;x.strokeStyle=rgba(mix([110,140,70],[190,190,110],R()),0.5);x.lineWidth=2;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+(R()-0.5)*20,py-h/2,px+(R()-0.5)*30,py-h);x.stroke();}
  for(let i=0;i<90;i++){const px=R()*960,py=230+R()*300,r=3+R()*7,col=[[226,170,200],[240,236,226],[200,150,210],[240,200,110]][(R()*4)|0];x.fillStyle=rgba(col,0.75);x.beginPath();x.arc(px,py,r,0,TAU);x.fill();}
  const cb=mkCanvas(960,540),xb=cb.getContext("2d");xb.filter="blur(6px)";xb.drawImage(cv,0,0);xb.filter="none";c.drawImage(cb,0,0,W,H);
  // the flower in front, where the bee lands: a stem from the bottom, leaves, a wide head of petals
  bb_strand(c,bb_smooth([[860,1090],[870,900],[880,760],[884,640]],6),22,14,rgba([92,122,64],1),1);
  ag_soft(c,cc=>{cc.moveTo(874,860);cc.bezierCurveTo(780,800,700,820,660,860);cc.bezierCurveTo(740,880,820,880,874,880);cc.closePath();},[104,136,70],[170,196,120],760,820,120,"rgba(20,40,10,0.4)",8,0.5);
  bb_flower(c,890,620,1.25);ag_grain(c,0,0,W,H,1.2,47);};
// a flower head, seen a little from the side: rings of pink petals round a domed golden centre
function bb_flower(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);for(let ring=0;ring<2;ring++)for(let i=0;i<14;i++){const a=i/14*TAU+ring*0.22,len=ring?120:140;c.save();c.scale(1,0.42);c.rotate(a);
    ag_soft(c,cc=>{cc.moveTo(10,-14);cc.bezierCurveTo(60,-30,len,-22,len+6,0);cc.bezierCurveTo(len,22,60,30,10,14);cc.closePath();},ring?[226,150,186]:[214,132,172],[250,214,232],len*0.6,-20,90,"rgba(90,30,60,0.3)",6,0.6);c.restore();}
  ag_soft(c,cc=>cc.ellipse(0,-10,62,40,0,0,TAU),[176,112,48],[240,196,110],18,-34,70,"rgba(60,30,10,0.45)",10,0.7);
  const R=ag_rnd(4);c.fillStyle="rgba(250,220,140,0.6)";for(let i=0;i<60;i++){const a=R()*TAU,d=Math.sqrt(R());c.beginPath();c.arc(Math.cos(a)*56*d,-10+Math.sin(a)*34*d,2.2,0,TAU);c.fill();}c.restore();}
// a honeybee from the side, facing left: head, furry thorax, banded abdomen, wings (fluttering when o.fly), six legs; s its size (1: 300 px)
function bb_bee(ctx,x,y,s,t,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);if(o.flip)ctx.scale(-1,1);const gold=[204,150,66],brown=[70,48,32],fuzz=[188,140,82];
  // legs, under everything
  ctx.strokeStyle=rgba(brown,1);ctx.lineCap="round";ctx.lineJoin="round";for(const [sx,ex,ey,w] of [[-30,-60,60,5],[0,-6,66,5],[26,70,64,6]]){ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(sx,30);ctx.lineTo((sx+ex)/2+(ex>sx?8:-8),48);ctx.lineTo(ex,ey);ctx.stroke();}
  ag_soft(ctx,c=>c.ellipse(62,56,12,9,0.3,0,TAU),[226,160,60],[250,210,120],66,50,14,null);
  // the abdomen, banded
  const ab=c=>c.ellipse(96,8,96,62,0.22,0,TAU);ag_soft(ctx,ab,gold,[250,214,140],110,-30,120,"rgba(60,30,10,0.45)",14,0.6);
  ctx.save();ag_shape(ctx,ab);ctx.clip();ctx.fillStyle=rgba(brown,0.92);for(let k=0;k<4;k++){ctx.save();ctx.translate(72+k*34,8);ctx.rotate(0.22);ctx.beginPath();ctx.ellipse(0,0,13,70,0,0,TAU);ctx.fill();ctx.restore();}
  const sh=ctx.createLinearGradient(0,-60,0,70);sh.addColorStop(0,"rgba(255,240,210,0.25)");sh.addColorStop(1,"rgba(40,20,10,0.3)");ctx.fillStyle=sh;ctx.fillRect(0,-70,200,140);ctx.restore();
  // the thorax, furry
  ag_soft(ctx,c=>c.arc(-6,-6,58,0,TAU),fuzz,[236,200,150],10,-40,70,"rgba(60,30,10,0.45)",12,0.6);
  const R=ag_rnd(5);ctx.strokeStyle="rgba(240,214,170,0.55)";ctx.lineWidth=1.6;for(let i=0;i<70;i++){const a=R()*TAU,r=50+R()*10;ctx.beginPath();ctx.moveTo(-6+Math.cos(a)*r*0.86,-6+Math.sin(a)*r*0.86);ctx.lineTo(-6+Math.cos(a)*(r+6),-6+Math.sin(a)*(r+6));ctx.stroke();}
  // the head: a big dark eye, the antenna, the mouth
  ag_soft(ctx,c=>c.ellipse(-94,0,40,46,0,0,TAU),[110,76,46],[190,150,100],-80,-20,40,"rgba(30,16,8,0.45)",8,0.6);
  ag_soft(ctx,c=>c.ellipse(-90,-10,22,32,0.1,0,TAU),[40,34,32],[120,110,110],-84,-24,18,null,0,0.7);
  ctx.strokeStyle=rgba(brown,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-112,-36);ctx.lineTo(-138,-92);ctx.lineTo(-176,-74);ctx.stroke();
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-118,34);ctx.lineTo(-128,54);ctx.stroke();
  // wings: at rest along the back, or a blur of beating
  const fly=o.fly||0,beat=Math.sin(t*90)*fly;ctx.save();ctx.globalAlpha*=lerp(0.6,0.35,fly);
  for(const [len,wd,ang] of [[150,44,-0.32],[110,32,-0.18]]){ctx.save();ctx.translate(-10,-56);ctx.rotate(ang-0.9*fly+beat*0.5);ctx.fillStyle="rgba(236,240,244,0.9)";ctx.beginPath();ctx.ellipse(len/2,0,len/2,wd/2,0,0,TAU);ctx.fill();
    ctx.strokeStyle="rgba(90,80,70,0.5)";ctx.lineWidth=1.4;ctx.stroke();ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(len*0.9,-2);ctx.moveTo(len*0.3,-wd*0.3);ctx.lineTo(len*0.7,wd*0.2);ctx.stroke();ctx.restore();}
  ctx.restore();ctx.restore();}
// a sesame seed and a bee's brain, side by side on a card, at the same scale
function bb_seedBrain(ctx,x,y,a,k){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+260,y+150,lerp(0.6,1,clamp(k==null?1:k,0,1.2)));ag_box(ctx,x,y,520,300,22,{});
  ctx.save();ctx.translate(x+150,y+130);ctx.rotate(-0.5);ag_soft(ctx,c=>{c.moveTo(0,-70);c.bezierCurveTo(46,-60,52,30,0,74);c.bezierCurveTo(-52,30,-46,-60,0,-70);c.closePath();},[232,214,176],[255,248,230],14,-30,70,"rgba(80,60,30,0.35)",8,0.6);ctx.restore();
  ctx.save();ctx.translate(x+386,y+132);ctx.scale(0.62,0.62);ctx.translate(-385,-128);
  ag_soft(ctx,c=>{c.moveTo(390,130);c.bezierCurveTo(360,80,300,90,300,128);c.bezierCurveTo(300,160,350,170,384,150);c.bezierCurveTo(420,170,470,160,470,128);c.bezierCurveTo(470,90,410,80,390,130);c.closePath();},[222,170,160],[250,222,214],420,96,90,"rgba(90,40,40,0.35)",8,0.6);ctx.restore();
  ag_T(ctx,"A sesame seed",x+150,y+262,{w:700,size:28,align:"center"});ag_T(ctx,"A bee's brain",x+386,y+262,{w:700,size:28,align:"center"});ctx.restore();}

// a honeycomb seen from above, kept small: its wax cells, some capped; the dance is drawn in a round view of it
function bb_combTex(){return ag_kept("bb:comb",760,760,(c,w,h)=>{c.fillStyle=rgba([150,104,40],1);c.fillRect(0,0,w,h);const r=40,hw=r*Math.sqrt(3);
  for(let row=-1;row<h/(r*1.5)+1;row++)for(let col=-1;col<w/hw+1;col++){const cx=col*hw+(row%2?hw/2:0),cy=row*r*1.5,capped=AG_NZ.fbm(cx*0.004,cy*0.004,2)>0.56;
    c.beginPath();for(let k=0;k<6;k++){const a=Math.PI/6+k*Math.PI/3;c.lineTo(cx+Math.cos(a)*r*0.92,cy+Math.sin(a)*r*0.92);}c.closePath();
    const g=c.createRadialGradient(cx+8,cy-10,2,cx,cy,r);if(capped){g.addColorStop(0,"rgb(240,214,150)");g.addColorStop(1,"rgb(206,168,96)");}else{g.addColorStop(0,"rgb(120,74,26)");g.addColorStop(0.7,"rgb(176,120,48)");g.addColorStop(1,"rgb(216,168,92)");}
    c.fillStyle=g;c.fill();c.strokeStyle="rgba(250,226,170,0.5)";c.lineWidth=3;c.stroke();}
  const v=c.createRadialGradient(w*0.62,h*0.3,60,w/2,h/2,w*0.7);v.addColorStop(0,"rgba(255,240,200,0.12)");v.addColorStop(1,"rgba(40,20,0,0.35)");c.fillStyle=v;c.fillRect(0,0,w,h);ag_grain(c,0,0,w,h,1.4,49);});}
// the dance in a round view over the meadow: the comb, the dancer and three bees following it; p the dance's phase (4 a figure of eight)
function bb_combView(ctx,cx,cy,r,p,t,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;bb_lens(ctx,cx,cy,r,c=>{c.drawImage(bb_combTex(),cx-r,cy-r,r*2,r*2);
    const th=-1.05,len=r*0.62;c.save();c.setLineDash([3,12]);c.lineCap="round";c.strokeStyle="rgba(255,244,214,0.65)";c.lineWidth=4;c.beginPath();for(let k=0;k<=120;k++){const q=bb_dance(k/30,cx,cy,len,th);k?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y);}c.stroke();c.restore();
    const d=bb_dance(p,cx,cy,len,th);[[-1.2,0.5],[1.9,0.62],[3.6,0.55]].forEach(([off,dd],i)=>{const q=bb_dance(p-0.35-i*0.12,cx,cy,len,th),bx=q.x+Math.cos(off+t*0.2)*r*0.2*dd,by=q.y+Math.sin(off+t*0.2)*r*0.2*dd;
      bb_beeTop(c,bx,by,0.62,Math.atan2(d.y-by,d.x-bx),{});});
    bb_beeTop(c,d.x,d.y,0.68,d.ang,{wag:d.wag});},{rim:18});ctx.restore();}
// a honeybee from above, heading ang (radians, 0 to the right); o.wag shakes its abdomen side to side, as in the dance
function bb_beeTop(ctx,x,y,s,ang,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);const gold=[204,150,66],brown=[70,48,32];
  ag_floorShadow(ctx,-8,6,70,26,0.3);ctx.save();ctx.rotate(o.wag||0);
  ag_soft(ctx,c=>c.ellipse(-52,0,52,30,0,0,TAU),gold,[250,214,140],-40,-16,50,"rgba(60,30,10,0.4)",8,0.6);ctx.save();ctx.beginPath();ctx.ellipse(-52,0,52,30,0,0,TAU);ctx.clip();ctx.fillStyle=rgba(brown,0.9);for(let k=0;k<4;k++)ctx.fillRect(-92+k*20,-40,9,80);ctx.restore();ctx.restore();
  ag_soft(ctx,c=>c.arc(4,0,26,0,TAU),[188,140,82],[236,200,150],12,-12,30,"rgba(60,30,10,0.4)",6,0.6);
  ag_soft(ctx,c=>c.ellipse(38,0,16,20,0,0,TAU),[90,62,40],[170,130,90],44,-8,16,null);
  ctx.strokeStyle=rgba(brown,1);ctx.lineWidth=2.6;ctx.lineCap="round";for(const k of [-1,1]){ctx.beginPath();ctx.moveTo(50,k*8);ctx.lineTo(70,k*18);ctx.lineTo(84,k*12);ctx.stroke();for(const lx of [-4,8,18]){ctx.beginPath();ctx.moveTo(lx,k*18);ctx.lineTo(lx-6,k*36);ctx.stroke();}}
  ctx.save();ctx.globalAlpha*=0.55;for(const k of [-1,1]){ctx.fillStyle="rgba(236,240,244,0.9)";ctx.beginPath();ctx.ellipse(-30,k*16,44,14,k*0.14,0,TAU);ctx.fill();}ctx.restore();ctx.restore();}
// the waggle dance: where the dancer is at phase p (one full figure of eight every 4), heading, and how much it waggles
function bb_dance(p,cx,cy,len,th){const q=((p%4)+4)%4,ux=Math.cos(th),uy=Math.sin(th),nx=-uy,ny=ux,A=[cx-ux*len/2,cy-uy*len/2],B=[cx+ux*len/2,cy+uy*len/2];
  if(q<1||(q>=2&&q<3)){const k=q%1;return{x:lerp(A[0],B[0],k),y:lerp(A[1],B[1],k),ang:th,wag:Math.sin(k*TAU*6)*0.35};}
  const side=q<2?1:-1,k=q%1,a=Math.PI*k,r=len/2;// a half loop back from B to A, on one side
  const mx=cx+nx*side*r*0.55,my=cy+ny*side*r*0.55,px=mx+ux*Math.cos(a)*r+nx*side*Math.sin(a)*r*0.6,py=my+uy*Math.cos(a)*r+ny*side*Math.sin(a)*r*0.6;
  const h=Math.atan2(uy*-Math.sin(a)+ny*side*Math.cos(a)*0.6,ux*-Math.sin(a)+nx*side*Math.cos(a)*0.6);return{x:px-nx*side*r*0.55,y:py-ny*side*r*0.55,ang:h,wag:0};}

AG_PLACES.bbReef=c=>{bb_water(c,[136,186,196],[70,128,146],[40,84,100],53);
  const R=ag_rnd(29);for(let i=0;i<12;i++){const x=-100+i*190+R()*80,y=700+R()*160,r=140+R()*130;ag_soft(c,cc=>bb_path(cc,bb_blob(x,y,r,r*0.62,i*0.9,0.22,28)),mix([86,90,92],[120,110,96],R()),[170,176,170],x+r*0.4,y-r*0.6,r*1.4,"rgba(10,20,30,0.45)",14,0.5);}
  for(let i=0;i<26;i++){const x=R()*W,y=640+R()*300;c.fillStyle=rgba(mix([190,120,110],[210,180,120],R()),0.7);for(let k=0;k<6;k++){c.beginPath();c.arc(x+(R()-0.5)*40,y+(R()-0.5)*20,4+R()*8,0,TAU);c.fill();}}
  ag_grain(c,0,0,W,H,1.4,55);};
const BB_OCTO=(()=>{const R=ag_rnd(808),arms=[];for(let i=0;i<8;i++){const a0=Math.PI*(0.08+i*0.12)+(R()-0.5)*0.1,len=360+R()*160,curl=(i%2?1:-1)*(0.8+R()*0.8);arms.push({a0,len,curl,ph:R()*TAU});}return arms;})();
// an octopus on a rock: its mantle, the eyes, eight arms with suckers; o.glow lights the nerve cells (two thirds of them in the arms);
// o.reach (0..1) sends its first arm out to the shell, o.taste (0..1) lights that arm's suckers; s its size
function bb_octoArm(A,x,y,s,t,reach){const P=[[0,0]];let a=A.a0,px=0,py=0;const n=14;for(let j=1;j<=n;j++){const k=j/n;a+=A.curl*0.06*Math.pow(k,1.6)*3+Math.sin(t*0.9+A.ph+j*0.5)*0.04;px+=Math.cos(a)*A.len/n;py+=Math.sin(a)*A.len/n*0.62;P.push([px,py]);}
  if(reach){const tip=[520,-40];P.forEach((q,j)=>{const k=Math.pow(j/n,1.5)*reach;q[0]=lerp(q[0],tip[0]*j/n,k);q[1]=lerp(q[1],tip[1]*j/n,k);});}
  return bb_smooth(P,3).map(q=>[x+q[0]*s,y+q[1]*s]);}
function bb_octopus(ctx,x,y,s,t,o){o=o||{};const col=[160,100,88],dk=mix(col,[40,16,14],0.45),hi=mix(col,[250,226,214],0.45),glow=o.glow||0,taste=o.taste||0;
  const arms=BB_OCTO.map((A,i)=>bb_octoArm(A,x,y,s,t,i===0?o.reach||0:0));
  ag_floorShadow(ctx,x,y+30*s,360*s,40*s,0.35);
  arms.forEach((P,i)=>{bb_strand(ctx,P,62*s,6*s,rgba(mix(col,dk,0.25),1),1);ctx.save();ctx.translate(1.5*s,-2*s);ctx.globalAlpha*=0.5;bb_strand(ctx,P,30*s,3*s,rgba(hi,0.7),1);ctx.restore();
    // suckers along its underside
    for(let k=2;k<16;k++){const u=k/17,q=bb_along(P,u),r=(1-u)*11*s+2*s,nx=-Math.sin(q[2]),ny=Math.cos(q[2]);const lit=i===0?taste*ag_in(u,0.5,0.4):0;
      ctx.fillStyle=rgba(mix([236,206,190],BB.spark,lit),0.9);ctx.beginPath();ctx.arc(q[0]+nx*r*1.4,q[1]+ny*r*1.4,r,0,TAU);ctx.fill();if(lit>0)bb_spark(ctx,q[0]+nx*r*1.4,q[1]+ny*r*1.4,r*3,lit*0.8);}});
  // the mantle, rising up behind the head, and the eyes
  ag_soft(ctx,c=>c.ellipse(x+40*s,y-200*s,130*s,160*s,-0.35,0,TAU),col,hi,x+90*s,y-300*s,220*s,rgba(dk,0.5),20,0.6);
  ag_soft(ctx,c=>c.ellipse(x,y-50*s,130*s,80*s,0,0,TAU),col,hi,x+50*s,y-90*s,140*s,rgba(dk,0.5),16,0.6);
  const R=ag_rnd(31);ctx.fillStyle=rgba(hi,0.35);for(let i=0;i<40;i++){const a=R()*TAU,d=Math.sqrt(R());ctx.beginPath();ctx.arc(x+40*s+Math.cos(a)*110*s*d,y-200*s+Math.sin(a)*140*s*d,(2+R()*4)*s,0,TAU);ctx.fill();}
  for(const ex of [-70,70]){ag_soft(ctx,c=>c.ellipse(x+ex*s,y-96*s,30*s,26*s,0,0,TAU),mix(col,hi,0.3),hi,x+ex*s+8*s,y-108*s,30*s,rgba(dk,0.4),6);
    ctx.fillStyle="#201818";ctx.beginPath();ctx.ellipse(x+ex*s,y-94*s,16*s,6*s,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.7)";ctx.beginPath();ctx.arc(x+ex*s+5*s,y-98*s,3*s,0,TAU);ctx.fill();}
  // its nerve cells: a third in the head, two thirds along the arms
  if(glow>0){ctx.save();ctx.globalAlpha*=glow;const G=ag_rnd(99);for(let i=0;i<26;i++)bb_spark(ctx,x+(G()-0.5)*160*s,y-60*s-G()*100*s,10*s,0.5+0.5*Math.sin(t*3+i));
    arms.forEach((P,i)=>{for(let k=0;k<7;k++){const u=0.1+k*0.12;const q=bb_along(P,u);bb_spark(ctx,q[0],q[1],10*s,0.5+0.5*Math.sin(t*3.4+i+k));}});ctx.restore();}}
// a scallop shell on the reef
function bb_shell(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ag_soft(ctx,c=>{c.moveTo(0,40);c.lineTo(-70,-20);c.bezierCurveTo(-60,-70,60,-70,70,-20);c.closePath();},[226,196,170],[255,240,226],20,-40,70,"rgba(80,50,30,0.35)",8,0.6);
  ctx.strokeStyle="rgba(150,110,80,0.5)";ctx.lineWidth=2;for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(0,36);ctx.lineTo(k*20,-52+Math.abs(k)*6);ctx.stroke();}ctx.restore();}

AG_PLACES.bbBranch=c=>{const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba([184,200,170],1));g.addColorStop(1,rgba([120,140,100],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  const cv=mkCanvas(960,540),x=cv.getContext("2d");const R=ag_rnd(61);for(let i=0;i<70;i++){const px=R()*960,py=R()*540,r=20+R()*50;x.fillStyle=rgba(mix([96,128,80],[214,220,180],R()),0.45);x.beginPath();x.arc(px,py,r,0,TAU);x.fill();}
  const cb=mkCanvas(960,540),xb=cb.getContext("2d");xb.filter="blur(10px)";xb.drawImage(cv,0,0);xb.filter="none";c.drawImage(cb,0,0,W,H);const lg=c.createRadialGradient(1600,200,40,1400,300,1200);lg.addColorStop(0,"rgba(255,248,224,0.35)");lg.addColorStop(1,"rgba(255,248,224,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);
  const P=bb_smooth([[-40,700],[400,640],[860,620],[1300,600],[1980,560]],8);bb_strand(c,P,44,26,rgba([96,74,56],1),1);c.save();c.translate(2,-6);bb_strand(c,P,14,8,"rgba(200,170,130,0.45)",1);c.restore();
  bb_strand(c,bb_smooth([[640,628],[700,560],[790,520]],6),14,6,rgba([96,74,56],1),1);bb_strand(c,bb_smooth([[1500,592],[1560,660],[1640,690]],6),12,5,rgba([96,74,56],1),1);
  for(const [lx,ly,a] of [[790,520,-0.6],[1640,690,0.4],[300,650,2.6]]){c.save();c.translate(lx,ly);c.rotate(a);ag_soft(c,cc=>{cc.moveTo(0,0);cc.bezierCurveTo(30,-30,90,-30,120,0);cc.bezierCurveTo(90,30,30,30,0,0);cc.closePath();},[110,140,80],[180,200,130],70,-14,60,"rgba(20,40,10,0.3)",6,0.5);c.restore();}
  ag_grain(c,0,0,W,H,1.2,63);};
// a zebra finch perched, from the side, facing right: o.young draws the young bird (plain grey-brown, a dark beak); o.open (0..1)
// opens the beak to sing; s its size (1: about 230 px from beak to tail)
function bb_finch(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);const yg=!!o.young,grey=yg?[150,140,130]:[146,146,152],hi=mix(grey,[255,255,255],0.45),dk=mix(grey,[20,20,24],0.45);
  // the tail, then the body
  ag_soft(ctx,c=>{c.moveTo(-60,10);c.lineTo(-160,52);c.lineTo(-150,70);c.lineTo(-50,34);c.closePath();},yg?mix(grey,dk,0.3):[60,58,60],hi,-110,40,60,null);
  if(!yg){ctx.fillStyle="rgba(240,240,236,0.95)";for(let k=0;k<3;k++){ctx.save();ctx.translate(-80-k*26,30+k*10);ctx.rotate(0.38);ctx.fillRect(-4,-9,8,18);ctx.restore();}}
  const body=c=>{c.moveTo(80,-60);c.bezierCurveTo(60,-90,0,-80,-40,-40);c.bezierCurveTo(-70,-10,-60,40,-20,50);c.bezierCurveTo(30,60,80,30,92,-10);c.bezierCurveTo(98,-30,94,-50,80,-60);c.closePath();};
  ag_soft(ctx,body,grey,hi,30,-60,120,rgba(dk,0.45),14,0.6);
  ctx.save();ctx.beginPath();body(ctx);ctx.clip();ctx.fillStyle=rgba(yg?mix(grey,[236,226,210],0.4):[238,232,220],1);ctx.beginPath();ctx.ellipse(30,40,70,40,-0.2,0,TAU);ctx.fill();
  if(!yg){ctx.fillStyle="rgba(168,94,60,1)";ctx.beginPath();ctx.ellipse(-10,10,44,30,-0.3,0,TAU);ctx.fill();ctx.fillStyle="rgba(250,248,240,0.95)";for(let k=0;k<7;k++){ctx.beginPath();ctx.arc(-34+k*10,2+(k%2)*12,3.2,0,TAU);ctx.fill();}
    ctx.strokeStyle="rgba(30,30,34,0.85)";ctx.lineWidth=3;for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(70-k*4,-30+k*9);ctx.quadraticCurveTo(84-k*3,-26+k*9,94-k*2,-30+k*9);ctx.stroke();}ctx.fillStyle="rgba(26,26,30,0.95)";ctx.beginPath();ctx.ellipse(76,14,16,8,-0.5,0,TAU);ctx.fill();}
  ctx.restore();
  // the wing, folded
  ag_soft(ctx,c=>{c.moveTo(40,-50);c.bezierCurveTo(0,-56,-50,-30,-70,10);c.bezierCurveTo(-30,10,20,0,46,-20);c.closePath();},mix(grey,dk,yg?0.25:0.15),hi,10,-46,60,rgba(dk,0.4),8,0.5);
  // the head
  ag_soft(ctx,c=>c.arc(86,-74,36,0,TAU),grey,hi,96,-92,44,rgba(dk,0.45),10,0.6);
  if(!yg){ctx.fillStyle="rgba(222,132,78,1)";ctx.beginPath();ctx.ellipse(92,-62,18,13,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(26,26,30,0.95)";ctx.fillRect(98,-80,4,22);ctx.fillStyle="rgba(250,250,246,0.95)";ctx.fillRect(94,-80,4,22);}
  ctx.fillStyle="#141012";ctx.beginPath();ctx.arc(100,-82,5.5,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.8)";ctx.beginPath();ctx.arc(102,-84,1.8,0,TAU);ctx.fill();
  const op=(o.open||0)*0.32,bc=yg?[40,36,36]:[214,84,52];
  ctx.fillStyle=rgba(bc,1);ctx.save();ctx.translate(116,-76);ctx.rotate(-op);ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(34,0);ctx.lineTo(0,2);ctx.closePath();ctx.fill();ctx.restore();
  ctx.save();ctx.translate(116,-72);ctx.rotate(op);ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(30,0);ctx.lineTo(0,9);ctx.closePath();ctx.fill();ctx.restore();
  // the feet, gripping the branch
  ctx.strokeStyle=rgba(yg?[150,120,110]:[214,150,120],1);ctx.lineWidth=4;ctx.lineCap="round";for(const fx of [10,34]){ctx.beginPath();ctx.moveTo(fx,46);ctx.lineTo(fx-4,64);ctx.lineTo(fx+14,70);ctx.stroke();}
  ctx.restore();}
// a song leaving a beak: small arcs going out, one a beat; o.wob makes it uneven (a young bird practising), o.a
function bb_song(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();const dir=o.dir||1,w=o.wob||0,a0=dir>0?0:Math.PI;ctx.strokeStyle=rgba(o.col||BB_INK2,0.85);ctx.lineCap="round";
  for(let i=0;i<5;i++){const ph=((t*1.2+i/5)%1),d=20+ph*170,f=1-ph,jit=w*Math.sin(t*7+i*2.3)*0.5;ctx.lineWidth=3.4*f+1;ctx.globalAlpha=a*f*0.9*(o.alpha==null?1:o.alpha);
    ctx.beginPath();ctx.arc(x,y,d*(1+w*0.25*Math.sin(t*5+i)),a0-0.5+jit,a0+0.5+jit*0.6);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- a dim light bulb, and the brain's own light */
function bb_bulb(ctx,x,y,s,k,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  if(k>0){const g=ctx.createRadialGradient(0,0,10,0,0,260);g.addColorStop(0,rgba([255,214,150],0.55*k));g.addColorStop(1,rgba([255,214,150],0));ctx.fillStyle=g;ctx.fillRect(-260,-260,520,520);}
  ag_soft(ctx,c=>ag_rect(c,-34,96,68,74,10),BB.brass,BB.brassHi,20,110,50,"rgba(60,40,10,0.45)",5);ctx.strokeStyle="rgba(90,66,30,0.6)";ctx.lineWidth=3;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-34,110+i*14);ctx.lineTo(34,104+i*14);ctx.stroke();}
  ctx.fillStyle="rgba(40,36,34,1)";rr(ctx,-14,168,28,16,6);ctx.fill();
  const glass=c=>{c.moveTo(-30,98);c.bezierCurveTo(-40,70,-110,30,-110,-40);c.bezierCurveTo(-110,-110,-60,-150,0,-150);c.bezierCurveTo(60,-150,110,-110,110,-40);c.bezierCurveTo(110,30,40,70,30,98);c.closePath();};
  ctx.save();ctx.globalAlpha*=0.5;ag_soft(ctx,glass,mix([226,230,232],[255,226,170],k*0.6),[255,255,255],40,-100,120,"rgba(60,60,70,0.25)",10,0.8);ctx.restore();
  ctx.strokeStyle="rgba(120,110,100,0.8)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-14,96);ctx.lineTo(-20,-10);ctx.moveTo(14,96);ctx.lineTo(20,-10);ctx.stroke();
  ctx.strokeStyle=rgba(mix([120,90,60],[255,220,150],k),1);ctx.lineWidth=3;ctx.shadowColor=rgba([255,200,120],0.9*k);ctx.shadowBlur=18*k;ctx.beginPath();ctx.moveTo(-20,-10);for(let i=1;i<=8;i++)ctx.lineTo(-20+i*5,-10+(i%2?-14:0));ctx.stroke();
  ctx.restore();}
// the brain at work: points of light that come and go over it, and a few links lit between them
function bb_brainLights(ctx,t,a){if(a<=0)return;const B=BB_BRAIN;ctx.save();ctx.globalAlpha*=a;ctx.beginPath();bb_brainPath(ctx,B.cx,B.cy,B.s);ctx.clip();const R=ag_rnd(86),P=[];
  for(let i=0;i<70;i++)P.push([B.cx+(R()-0.5)*640*B.s,B.cy+(R()-0.62)*420*B.s,R()*TAU,0.6+R()*1.4]);
  ctx.strokeStyle=rgba(BB.spark,0.35);ctx.lineWidth=1.6;P.forEach((p,i)=>{const q=P[(i*7+3)%P.length],k=0.5+0.5*Math.sin(t*p[3]+p[2]);if(k<0.6)return;ctx.globalAlpha=a*(k-0.6)*2;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();});
  ctx.globalAlpha=a;P.forEach(p=>{const k=0.5+0.5*Math.sin(t*p[3]+p[2]);bb_spark(ctx,p[0],p[1],10+8*k,0.3+0.6*k);});ctx.restore();}

/* ---------------------------------------------------------------- the eye, cut in half, and its blind spot
   On paper, as an anatomy book draws it: light comes in from the left through the clear front and the lens, and lands on the lining at
   the back, the layer of cells that catch it; at the back, a little below the middle, the nerve leaves for the brain, and there the
   lining has a hole: the blind spot. */
const BB_EYEA={cx:860,cy:470,r:300,lens:[600,470],nerve:0.28};   // the nerve leaves at this angle below the back's middle
AG_PLACES.bbEye=c=>{bb_bareSheet(c);const E=BB_EYEA,cx=E.cx,cy=E.cy,r=E.r,na=E.nerve;
  // the nerve, leaving at the back for the brain, off the right edge
  const nx=cx+Math.cos(na)*r,ny=cy+Math.sin(na)*r;ag_soft(c,cc=>{cc.moveTo(nx-10,ny-46);cc.bezierCurveTo(nx+160,ny-60,nx+300,ny-20,1620,ny+40);cc.lineTo(1620,ny+130);cc.bezierCurveTo(nx+300,ny+80,nx+160,ny+56,nx-10,ny+46);cc.closePath();},[226,208,168],[250,240,214],nx+200,ny-40,260,"rgba(90,70,40,0.35)",10,0.6);
  c.strokeStyle="rgba(150,126,90,0.45)";c.lineWidth=2;for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(nx,ny+k*12);c.bezierCurveTo(nx+160,ny-4+k*14,nx+300,ny+30+k*14,1620,ny+86+k*14);c.stroke();}
  // the white wall of the eye, and the clear bulge at the front
  ag_soft(c,cc=>cc.arc(cx,cy,r,0,TAU),[244,240,232],[255,255,255],cx+120,cy-160,r*1.3,"rgba(80,70,60,0.3)",16,0.6);
  ag_soft(c,cc=>{cc.moveTo(cx-r*0.86,cy-r*0.5);cc.bezierCurveTo(cx-r*1.22,cy-r*0.3,cx-r*1.22,cy+r*0.3,cx-r*0.86,cy+r*0.5);cc.closePath();},[226,236,240],[255,255,255],cx-r*1.05,cy-r*0.2,120,"rgba(60,80,90,0.2)",8,0.7);
  // inside: the dark layer, then the lining of cells that catch light, except where the nerve leaves
  const ring=(rad,col,w,a0,a1)=>{c.strokeStyle=rgba(col,1);c.lineWidth=w;c.beginPath();c.arc(cx,cy,rad,a0,a1);c.stroke();};
  ring(r-14,[150,84,70],12,-2.36,2.36);
  ring(r-30,[226,150,124],18,-2.3,na-0.07);ring(r-30,[226,150,124],18,na+0.07,2.3);
  c.fillStyle="rgba(250,246,240,0.92)";c.beginPath();c.arc(cx,cy,r-40,0,TAU);c.fill();
  // the iris and the lens
  for(const k of [-1,1])ag_soft(c,cc=>ag_rect(cc,E.lens[0]-28,cy+k*80-(k<0?60:0),18,60,6),[120,86,60],[180,140,100],E.lens[0]-20,cy+k*90,40,null);
  ag_soft(c,cc=>cc.ellipse(E.lens[0],E.lens[1],40,96,0,0,TAU),[214,226,232],[255,255,255],E.lens[0]+10,E.lens[1]-40,70,"rgba(60,80,100,0.3)",8,0.7);
  ag_grain(c,0,0,W,H,1,71);};
function bb_bareSheet(c){const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba(mix(BB.walnut,[20,12,6],0.15),1));g.addColorStop(1,rgba(mix(BB.walnut,[255,230,200],0.08),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  ag_grain(c,0,0,W,H,2,7);bb_paper(c,40,40,1840,1000);
  const lg=c.createRadialGradient(1800,60,40,1500,200,1500);lg.addColorStop(0,"rgba(255,244,220,0.3)");lg.addColorStop(1,"rgba(255,244,220,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);}
// light from a thing on the left, through the lens, onto the lining at the back; o.u draws it on; o.blind lights the ray that lands
// where the nerve leaves, which nothing catches
function bb_eyeLight(ctx,t,o){o=o||{};const E=BB_EYEA,u=o.u||0;if(u<=0)return;const L=E.lens,back=a=>[E.cx+Math.cos(a)*(E.r-30),E.cy+Math.sin(a)*(E.r-30)];
  const src=[[180,380],[180,560]],to=[back(-0.06),back(0.06)];ctx.save();ctx.lineCap="round";
  src.forEach((s0,i)=>{for(const dy of [-60,0,60]){const mid=[L[0],L[1]+dy],P=[s0,mid,to[1-i]];const len=bb_smooth(P,1);ctx.strokeStyle=rgba([226,170,60],0.7);ctx.lineWidth=3;ctx.beginPath();const S=bb_sub(len,0,u);if(S.length>1){bb_path(ctx,S,false);ctx.stroke();}}});
  if(u>=1)to.forEach(q=>bb_spark(ctx,q[0],q[1],20,0.8));
  const bl=o.blind||0;if(bl>0){const q=back(E.nerve),P=[[180,700],[L[0],L[1]+30],q],S=bb_sub(P,0,bl);ctx.strokeStyle=rgba([226,170,60],0.7);ctx.lineWidth=3;if(S.length>1){ctx.beginPath();bb_path(ctx,S,false);ctx.stroke();}
    if(bl>=1){ctx.strokeStyle=rgba(BB.ink,0.75);ctx.lineWidth=4;ctx.setLineDash([8,8]);ctx.beginPath();ctx.arc(q[0],q[1],30,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
  ctx.restore();}
// a small candle flame on the left, the thing the eye looks at
function bb_flame(ctx,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ag_soft(ctx,c=>ag_rect(c,-18,0,36,120,6),[240,232,214],[255,255,255],10,10,40,"rgba(80,70,50,0.3)",6);
  const f=1+0.06*Math.sin(t*9)+0.04*Math.sin(t*13.7);ctx.save();ctx.scale(1,f);const g=ctx.createRadialGradient(0,-30,2,0,-24,40);g.addColorStop(0,"rgba(255,250,220,1)");g.addColorStop(0.5,"rgba(250,200,100,0.9)");g.addColorStop(1,"rgba(230,140,60,0)");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,-74);ctx.bezierCurveTo(22,-40,20,-8,0,-2);ctx.bezierCurveTo(-20,-8,-22,-40,0,-74);ctx.fill();ctx.restore();ctx.restore();}

// a patterned cloth: stripes and a band across, and a hole where the blind spot falls; o.fill (0..1) fills the hole from round it
function bb_cloth(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(46,34,20,0.3)";ctx.shadowBlur=22;ctx.shadowOffsetX=-6;ctx.shadowOffsetY=10;ctx.fillStyle="rgb(238,228,206)";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const sw=46;for(let i=0;i*sw<w+sw;i++)if(i%2){ctx.fillStyle="rgba(120,74,58,0.86)";ctx.fillRect(x+i*sw,y,sw,h);}
  ctx.fillStyle="rgba(46,60,72,0.9)";ctx.fillRect(x,y+h/2-30,w,60);ag_grain(ctx,x,y,w,h,1.5,73);
  const f=o.fill||0,hx=x+w/2+sw/2,hy=y+h/2,hr=o.r||90;if(f<1){ctx.fillStyle="rgba(30,28,28,0.95)";ctx.beginPath();ctx.arc(hx,hy,hr*(1-ag_sine(f)),0,TAU);ctx.fill();}
  ctx.restore();ctx.restore();}

/* ===== Borrowed from the brain: what people built on the nerve cell =====
   In the module's colours: units and their connections are violet (the model), a choice that's right is plain, one that's wrong
   amber, a check that passes green. What is drawn here:
     bb_mcp(ctx, x, y, o)            1943's unit: inputs, their connections, the unit that adds them, its set level, and its output
     bb_net(ctx, layers, o)          units in layers, each joined to every unit of the next; a signal can pass through them
     bb_lab1959(ctx, t, o)           1959: a dark room, a screen with a bar of light, a cat watching it, and what one cell does
     bb_layers(ctx, x, y, o)         a picture read in layers: edges, then shapes, then what it is
     bb_weights(ctx, x, y, w, h, t, a) a field of weights, too many to count
     bb_oneCell(ctx, x, y, o)        2021: one nerve cell, and the network of layers it took to mimic it
     bb_examples(ctx, x, y, o)       a few examples, or a great many
     bb_plane(ctx, x, y, s, o)       an airliner, seen from below
     bb_chances, bb_wheel, bb_dial   the next word's chances: as bars, as a wheel's slices, and the temperature dial that changes them
     bb_answer(ctx, x, y, w, text, o) an answer, on a card
     bb_dates, bb_pages, bb_test     the 2025 study: three dates, a fact seen once, a test that rewards a guess
     bb_em(ctx, x, y, w, h, o)       an electron microscope's picture of the gap */

const BB_VI=AG.violet,BB_VIL=mix(AG.violet,[255,255,255],0.72);

/* ---------------------------------------------------------------- 1943: the unit */
// o: vals (the inputs, 0 or 1), on [per input, 0..1: its signal on its way in], wts (each connection's weight, a number shown on it),
// fill (0..1: how far the total has risen), level (the set level, as a share of the gauge), fire (0..1: the output's signal), u (draw on),
// a, r (the unit's radius), gauge (true or 0..1: show the total and the set level under the unit), wa (0..1: the weights come in)
function bb_mcp(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u;if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;const r=o.r||84,n=(o.vals||[1,1,1]).length;
  const ins=[];for(let i=0;i<n;i++)ins.push([x-380,y+(i-(n-1)/2)*150]);
  ins.forEach((p,i)=>{const k=ag_in(u,i*0.12,0.3);if(k<=0)return;const end=[x-r*Math.cos(0.5*(i-(n-1)/2)),y+r*Math.sin(0.5*(i-(n-1)/2))],wt=o.wts?o.wts[i]:null,wa=o.wa==null?1:o.wa,w=wt==null?5:lerp(5,3+9*Math.abs(wt),wa);
    const P=bb_wire(ctx,[p[0]+38,p[1]],end,{w,u:k,col:mix(BB_VI,[120,116,140],0.3),alpha:0.75,sig:o.on?o.on[i]:null,sr:20});
    if(wt!=null&&k>=1&&wa>0){const q=bb_along(P,0.48);ag_pill(ctx,q[0],q[1]-36,(wt<0?"−":"")+Math.abs(wt).toFixed(1),{size:28,a:wa});}
    ctx.save();ctx.globalAlpha*=k;ag_soft(ctx,c=>c.arc(p[0],p[1],38,0,TAU),[238,236,232],[255,255,255],p[0]+14,p[1]-16,44,"rgba(40,30,60,0.25)",6);
    ctx.strokeStyle=rgba(BB_VI,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.arc(p[0],p[1],38,0,TAU);ctx.stroke();
    if(o.vals)ag_T(ctx,String(o.vals[i]),p[0],p[1]+11,{w:800,size:32,align:"center",col:AG.ink});ctx.restore();});
  const ku=ag_in(u,0.3,0.3);if(ku>0){ctx.save();ctx.globalAlpha*=ku;
    const ox=x+r,P=bb_wire(ctx,[ox,y],[x+330,y],{w:6,col:mix(BB_VI,[120,116,140],0.3),alpha:0.8,sig:o.fire,sr:24});ag_arrowHead(ctx,x+336,y,0,18,rgba(mix(BB_VI,[120,116,140],0.3),0.85));
    bb_unit(ctx,x,y,r,{on:o.fire>0?ag_in(o.fire,0,0.15)*(1-ag_in(o.fire,0.85,0.15)):(o.glow||0)});
    if(o.gauge){ctx.save();ctx.globalAlpha*=(o.gauge===true?1:o.gauge);const gx=x-150,gy=y+r+74,gw=300,f=clamp(o.fill||0,0,1),lv=o.level||0.6;ag_box(ctx,gx-24,gy-40,gw+48,124,18,{});
      ctx.fillStyle="rgba(60,56,70,0.12)";rr(ctx,gx,gy,gw,20,10);ctx.fill();ctx.fillStyle=rgba(BB_VI,0.85);if(f>0){rr(ctx,gx,gy,gw*f,20,10);ctx.fill();}
      ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx+gw*lv,gy-12);ctx.lineTo(gx+gw*lv,gy+32);ctx.stroke();
      ag_T(ctx,"Total",gx,gy-8,{w:700,size:28,col:AG.mut});ag_T(ctx,"set level",gx+gw*lv,gy+68,{w:700,size:28,align:"center"});ctx.restore();}
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- units in layers */
// layers: [{x, n, y (the middle), dy (the spacing)}]; o.r, o.u (draws on, layer by layer), o.sig (where a signal is: 0 the first layer,
// 1 the second, ...), o.w(i, j, k) a connection's width (layer i's unit j to the next layer's unit k), o.a, o.alpha (the wires')
function bb_netPos(L){return L.map(l=>{const out=[];for(let j=0;j<l.n;j++)out.push([l.x,l.y+(j-(l.n-1)/2)*l.dy]);return out;});}
function bb_net(ctx,L,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const P=bb_netPos(L),r=o.r||26,u=o.u==null?L.length:o.u*L.length,sig=o.sig;
  for(let i=0;i<P.length-1;i++){const k=clamp(u-i-0.6,0,1);if(k<=0)continue;for(let j=0;j<P[i].length;j++)for(let q=0;q<P[i+1].length;q++){const A=P[i][j],B=P[i+1][q],w=o.w?o.w(i,j,q):2.4;
    ctx.strokeStyle=rgba(mix(BB_VI,[150,146,168],0.45),(o.alpha||0.42)*k);ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(lerp(A[0],B[0],k),lerp(A[1],B[1],k));ctx.stroke();
    if(sig!=null&&sig>i&&sig<i+1&&(j+q)%2===0){const s=sig-i;bb_spark(ctx,lerp(A[0],B[0],s),lerp(A[1],B[1],s),12,0.8*Math.sin(Math.PI*s));}}}
  P.forEach((col,i)=>{const k=clamp(u-i,0,1);if(k<=0)return;col.forEach(p=>{ctx.save();ctx.globalAlpha*=k;const on=sig!=null?Math.max(0,1-Math.abs(sig-i)*2.2):0;bb_unit(ctx,p[0],p[1],r,{on,sigma:r>=24&&o.sigma!==false});ctx.restore();});});
  ctx.restore();return P;}

/* ---------------------------------------------------------------- 1959: a cell that fires for an edge */
// a cat sitting, from the side, facing right, calm: o.look (radians) turns its head a little; s its size (1: about 300 px tall)
function bb_cat(ctx,x,y,s,t,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);const fur=[150,136,120],dk=mix(fur,[30,24,20],0.5),hi=mix(fur,[250,240,226],0.5);
  ag_floorShadow(ctx,0,4,140,14,0.35);
  // the tail, wrapped round the front
  bb_strand(ctx,bb_smooth([[-70,-10],[-40,8],[40,6],[90,-6]],6),26,14,rgba(mix(fur,dk,0.2),1),1);
  ag_soft(ctx,c=>{c.moveTo(-90,0);c.bezierCurveTo(-110,-80,-80,-190,-10,-210);c.bezierCurveTo(50,-224,80,-170,76,-100);c.bezierCurveTo(74,-50,70,-14,60,0);c.closePath();},fur,hi,40,-200,200,rgba(dk,0.5),18,0.6);
  for(const fx of [30,56])ag_soft(ctx,c=>ag_rect(c,fx-14,-80,26,82,12),mix(fur,hi,0.2),hi,fx,-70,30,rgba(dk,0.3),6);
  ctx.save();ctx.translate(30,-212);ctx.rotate(o.look||0);
  ag_soft(ctx,c=>{c.moveTo(-50,0);c.bezierCurveTo(-56,-46,-20,-70,20,-68);c.bezierCurveTo(60,-66,84,-40,80,-6);c.bezierCurveTo(78,24,40,40,6,36);c.bezierCurveTo(-30,32,-48,20,-50,0);c.closePath();},fur,hi,40,-50,90,rgba(dk,0.45),12,0.6);
  for(const [ex,lean] of [[-26,-0.2],[30,0.25]])ag_soft(ctx,c=>{c.moveTo(ex-20,-56);c.lineTo(ex+lean*40,-104);c.lineTo(ex+22,-60);c.closePath();},mix(fur,dk,0.15),hi,ex,-80,30,rgba(dk,0.4),6);
  ctx.fillStyle="rgba(214,190,90,1)";ctx.beginPath();ctx.ellipse(48,-18,10,8,0,0,TAU);ctx.fill();ctx.fillStyle="#141012";ctx.beginPath();ctx.ellipse(50,-18,3,7,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([200,140,130],1);ctx.beginPath();ctx.moveTo(78,6);ctx.lineTo(70,0);ctx.lineTo(70,12);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(250,246,240,0.6)";ctx.lineWidth=1.4;for(const k of [-1,0,1]){ctx.beginPath();ctx.moveTo(70,14);ctx.quadraticCurveTo(100,12+k*6,124,10+k*14);ctx.stroke();}ctx.restore();
  // tabby stripes on the back
  ctx.strokeStyle=rgba(dk,0.35);ctx.lineWidth=7;ctx.lineCap="round";for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(-84+k*12,-150+k*26);ctx.quadraticCurveTo(-60+k*10,-140+k*26,-50+k*8,-120+k*26);ctx.stroke();}
  ctx.restore();}
// the room: dark, a screen on the right with a bar of light at angle ang (radians from upright), a table, the cat watching the screen
function bb_lab1959(ctx,t,o){o=o||{};const g=ctx.createRadialGradient(1400,380,60,1000,540,1300);g.addColorStop(0,"rgb(70,72,80)");g.addColorStop(1,"rgb(26,26,32)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle="rgb(46,40,36)";ctx.fillRect(0,720,W,H-720);ctx.fillStyle="rgba(255,255,255,0.05)";ctx.fillRect(0,716,W,6);
  // the screen, and its light on the room
  const sx=1080,sy=150,sw=640,sh=470;ctx.fillStyle="rgb(214,214,206)";ctx.fillRect(sx,sy,sw,sh);const sg=ctx.createRadialGradient(sx+sw/2,sy+sh/2,40,sx+sw/2,sy+sh/2,sw);sg.addColorStop(0,"rgba(255,255,250,0.25)");sg.addColorStop(1,"rgba(0,0,0,0.12)");ctx.fillStyle=sg;ctx.fillRect(sx,sy,sw,sh);
  ctx.strokeStyle="rgb(40,40,44)";ctx.lineWidth=14;ctx.strokeRect(sx-7,sy-7,sw+14,sh+14);
  const ang=o.ang||0,bx=sx+sw/2,by=sy+sh/2;ctx.save();ctx.beginPath();ctx.rect(sx,sy,sw,sh);ctx.clip();ctx.translate(bx,by);ctx.rotate(ang);ctx.fillStyle="rgba(250,248,232,1)";ctx.shadowColor="rgba(255,250,220,0.9)";ctx.shadowBlur=24;ctx.fillRect(-16,-170,32,340);ctx.restore();
  const lg=ctx.createRadialGradient(bx,by,40,bx-400,by+200,1100);lg.addColorStop(0,"rgba(255,250,230,0.16)");lg.addColorStop(1,"rgba(255,250,230,0)");ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);
  // the table and the cat on it
  ctx.fillStyle="rgb(96,74,56)";ctx.fillRect(140,640,640,40);ctx.fillStyle="rgb(70,52,40)";ctx.fillRect(140,680,640,20);ctx.fillRect(180,700,24,200);ctx.fillRect(716,700,24,200);
  bb_cat(ctx,480,640,1.25,t,{look:0.06});ag_grain(ctx,0,0,W,H,1.2,81);}
// what one cell does, as clicks along a line: a click whenever it fires; it fires when the bar is near its own angle (pref)
function bb_spikes(ctx,x,y,w,h,t,angAt,pref,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,o.title||"One cell",x+30,y+52,{w:700,size:32});const base=y+h-40,top=y+86;ctx.strokeStyle=rgba(AG.mut,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,base);ctx.lineTo(x+w-30,base);ctx.stroke();
  const span=4,dt=0.05;ctx.strokeStyle=rgba(BB.ink,0.9);ctx.lineWidth=3;ctx.lineCap="round";
  for(let k=Math.floor((t-span)/dt);k*dt<=t;k++){const tau=k*dt;if(tau<0)continue;const d=(angAt(tau)-pref),rate=Math.exp(-d*d/0.03);if(hash(k,17)>rate*0.85)continue;
    const px=x+30+(w-60)*(1-(t-tau)/span);ctx.beginPath();ctx.moveTo(px,base);ctx.lineTo(px,top+(base-top)*0.12*hash(k,3));ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- a picture read in layers */
// a small tile with a short bar of light at angle a, as the first layer's cells see edges
function bb_edgeTile(ctx,x,y,s,a,lit){ctx.save();ag_box(ctx,x-s/2,y-s/2,s,s,10,{edge:lit>0?BB_VI:null,edgeA:0.8*lit});ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=rgba(BB.ink,0.85);rr(ctx,-4,-s*0.32,8,s*0.64,4);ctx.fill();ctx.restore();}
// o.show: the parts in view, in order (0: the edges and shapes; 1: the picture coming in and the answer); o.sig (0..3): a signal through them
function bb_layers(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const sig=o.sig==null?-1:o.sig,more=o.more||0;
  const cols=[x-560,x-200,x+170,x+540],E=[0,0.5,1.05,1.57,2.1,2.6],shapes=["corner","curve","ring","stripes"];
  const pos1=E.map((e,i)=>[cols[1],y-250+i*100]),pos2=shapes.map((sh,i)=>[cols[2],y-180+i*120]);
  // links: picture to edges, edges to shapes, shapes to the answer
  const link=(A,B,k,s)=>{if(k<=0)return;ctx.strokeStyle=rgba(mix(BB_VI,[150,146,168],0.4),0.45*k);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(lerp(A[0],B[0],k),lerp(A[1],B[1],k));ctx.stroke();
    if(s>0&&s<1)bb_spark(ctx,lerp(A[0],B[0],s),lerp(A[1],B[1],s),12,0.85*Math.sin(Math.PI*s));};
  const k1=o.u==null?1:o.u;pos1.forEach((p,i)=>pos2.forEach((q,j)=>{if((i+j)%2===0||i===j)link([p[0]+46,p[1]],[q[0]-60,q[1]],k1,sig-1);}));
  if(more>0){pos1.forEach(p=>link([cols[0]+110,y],[p[0]-46,p[1]],more,sig));pos2.forEach(q=>link([q[0]+60,q[1]],[cols[3]-120,y],more,sig-2));}
  ag_T(ctx,"Edges",cols[1],y-320,{w:700,size:30,align:"center",col:AG.mut});ag_T(ctx,"Shapes",cols[2],y-260,{w:700,size:30,align:"center",col:AG.mut});
  pos1.forEach((p,i)=>bb_edgeTile(ctx,p[0],p[1],84,E[i],sig>=0.9&&sig<1.6?1:0));
  pos2.forEach((q,i)=>{const lit=sig>=1.9&&sig<2.6?1:0;ag_box(ctx,q[0]-56,q[1]-48,112,96,14,{edge:lit?BB_VI:null,edgeA:0.8});ctx.save();ctx.translate(q[0],q[1]);ctx.strokeStyle=rgba(BB.ink,0.85);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();
    if(shapes[i]==="corner"){ctx.moveTo(-26,24);ctx.lineTo(-26,-24);ctx.lineTo(26,-24);}else if(shapes[i]==="curve"){ctx.moveTo(-28,22);ctx.quadraticCurveTo(0,-40,28,22);}else if(shapes[i]==="ring"){ctx.arc(0,0,24,0,TAU);}else{for(let k=-1;k<=1;k++){ctx.moveTo(-28,k*16);ctx.lineTo(28,k*16);}}
    ctx.stroke();ctx.restore();});
  if(more>0){ctx.save();ctx.globalAlpha*=more;
    // the picture coming in: a bee, framed; and what the network says it is
    ag_picture(ctx,cols[0]-110,y-110,220,220,{draw:(c,px,py,pw,ph)=>{c.fillStyle="rgb(214,222,196)";c.fillRect(px,py,pw,ph);bb_flower(c,px+pw*0.55,py+ph*0.78,0.45);bb_bee(c,px+pw*0.5,py+ph*0.46,0.5,0,{});}});
    ag_T(ctx,"A picture",cols[0],y+170,{w:700,size:30,align:"center",col:AG.mut});
    const lit=sig>=2.8?1:0;ag_pill(ctx,cols[3],y,"A bee",{size:34,col:lit?BB_VI:null,a:1});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- weights, too many to count */
function bb_weights(ctx,x,y,w,h,t,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const nx=44,ny=20;ctx.lineCap="round";
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const px=x+(i+0.5)*w/nx,py=y+(j+0.5)*h/ny,v=Math.sin(i*1.7+j*2.3+t*0.6)*0.5+0.5,an=(hash(i,j)-0.5)*2.4+Math.sin(t*0.4+i*0.3)*0.2,L=6+10*v;
    ctx.strokeStyle=rgba(BB_VI,0.18+0.35*v);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(px-Math.cos(an)*L/2,py-Math.sin(an)*L/2);ctx.lineTo(px+Math.cos(an)*L/2,py+Math.sin(an)*L/2);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- 2021: one cell, and the layers it took to mimic it */
const BB_ONE=bb_cell(2021,{x:0,y:20,r:26,reach:160,dirs:6,depth:3,wig:0.38,spines:true,axon:{ang:Math.PI*0.5,len:150,ends:3,endLen:40},axW:10});
function bb_oneCell(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const t=o.t||0;
  // the living cell, framed on the left
  ag_picture(ctx,x-720,y-230,400,400,{draw:(c,px,py,pw,ph)=>{const g=c.createRadialGradient(px+pw*0.7,py+ph*0.3,20,px+pw/2,py+ph/2,pw);g.addColorStop(0,"rgb(108,76,62)");g.addColorStop(1,"rgb(42,30,28)");c.fillStyle=g;c.fillRect(px,py,pw,ph);
    c.save();c.translate(px+pw/2,py+ph/2-10);bb_drawCell(c,BB_ONE,{u:o.cell==null?1:o.cell,col:BB_LIVE});c.restore();}});
  ag_T(ctx,"One nerve cell",x-520,y+230,{w:700,size:30,align:"center"});
  ag_T(ctx,"=",x-200,y+16,{w:800,size:72,align:"center",col:AG.mut,a:o.eq==null?1:o.eq});
  // the network it took: seven layers
  const L=[];for(let i=0;i<7;i++)L.push({x:x-60+i*110,n:i===0||i===6?3:6,y:y-30,dy:64});
  bb_net(ctx,L,{r:18,u:o.net==null?1:o.net,sig:o.sig,a:1,alpha:0.32,sigma:false});
  ag_T(ctx,"A network of 5 to 8 layers",x+270,y+230,{w:700,size:30,align:"center"});
  ctx.restore();}

/* ---------------------------------------------------------------- a few examples, or a great many */
// a small picture of a bee, as an example: the film's honeybee, drawn once in three poses and kept, on a tile
function bb_beePic(i){const k=i%3;return ag_kept("bb:beeTile"+k,160,160,c=>{c.translate(86,88);c.rotate([-0.28,0.12,0.36][k]);if(k===1)c.scale(-1,1);bb_bee(c,-8,0,0.34,0,{});});}
function bb_beeTile(ctx,x,y,s,i){ag_box(ctx,x-s/2,y-s/2,s,s,s*0.14,{});ctx.drawImage(bb_beePic(i),x-s/2,y-s/2,s,s);}
// a child's card comes in with o.a (springing to size with o.k); its few examples with o.kA; the model's card, and its great many, with o.kB
function bb_examples(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const kA=o.kA==null?1:o.kA,kB=o.kB==null?1:o.kB;
  {ctx.save();if(o.k!=null)ag_about(ctx,x-540,y,lerp(0.6,1,clamp(o.k,0,1.2)));ag_box(ctx,x-860,y-240,640,480,24,{});ag_T(ctx,"A child",x-830,y-182,{w:700,size:36});
    ag_T(ctx,"a few examples",x-830,y-140,{w:500,size:28,col:AG.mut,a:ag_in(kA,0,0.3)});
    for(let i=0;i<3;i++){const k=ag_in(kA,0.2+i*0.2,0.2);if(k>0){ctx.save();ctx.globalAlpha*=k;ag_about(ctx,x-720+i*180,y+10,lerp(0.7,1,ag_eo(k)));bb_beeTile(ctx,x-720+i*180,y+10,140,i);ctx.restore();}}
    ag_pill(ctx,x-540,y+168,"“bee”",{size:34,a:ag_in(kA,0.85,0.15)});ctx.restore();}
  if(kB>0){ctx.save();ctx.globalAlpha*=clamp(kB*2,0,1);ag_box(ctx,x-120,y-240,980,480,24,{edge:BB_VI,edgeA:0.5});ag_T(ctx,"A model",x-90,y-182,{w:700,size:36});ag_T(ctx,"a great many",x-90,y-140,{w:500,size:28,col:AG.mut});
    const n=Math.floor(clamp(kB,0,1)*112);for(let i=0;i<n;i++){const cx=x-60+(i%16)*58,cy=y-90+Math.floor(i/16)*46;bb_beeTile(ctx,cx,cy,40,i);}ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- an airliner, from below */
function bb_plane(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(o.roll||0);ctx.scale(s,s);const col=[214,218,222],dk=[150,156,164],hi=[250,252,252];
  ag_soft(ctx,c=>{c.moveTo(-30,-10);c.lineTo(-250,90);c.lineTo(-250,110);c.lineTo(-20,40);c.lineTo(20,40);c.lineTo(250,110);c.lineTo(250,90);c.lineTo(30,-10);c.closePath();},col,hi,60,0,260,"rgba(40,50,60,0.35)",10,0.6);
  ag_soft(ctx,c=>{c.moveTo(-16,150);c.lineTo(-90,196);c.lineTo(-90,208);c.lineTo(-10,190);c.lineTo(10,190);c.lineTo(90,208);c.lineTo(90,196);c.lineTo(16,150);c.closePath();},col,hi,20,170,80,"rgba(40,50,60,0.3)",6,0.6);
  ag_soft(ctx,c=>c.ellipse(0,40,26,200,0,0,TAU),col,hi,10,-60,160,"rgba(40,50,60,0.35)",10,0.6);
  for(const ex of [-120,120])ag_soft(ctx,c=>c.ellipse(ex,62,14,40,0,0,TAU),dk,hi,ex+4,50,30,null);
  if(o.wing){ctx.save();ctx.globalAlpha*=o.wing;ctx.strokeStyle=rgba(BB_VI,0.9);ctx.lineWidth=6;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-30,-10);ctx.lineTo(-250,90);ctx.lineTo(-250,110);ctx.lineTo(-20,40);ctx.moveTo(30,-10);ctx.lineTo(250,90);ctx.lineTo(250,110);ctx.lineTo(20,40);ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the next word's chances */
const BB_NEXT=[["dancing",70],["buzzing",12],["waggling",8],["flying",5],["singing",3]];
// the chances at a temperature T (1 as the model gave them): each raised to the power 1/T, then shared out again
function bb_temper(rows,T){const q=rows.map(r=>Math.pow(r[1]/100,1/Math.max(0.05,T))),s=q.reduce((a,b)=>a+b,0)+Math.pow(0.02,1/Math.max(0.05,T));return rows.map((r,i)=>[r[0],100*q[i]/s]);}
// as bars: each word, its bar, its chances in a hundred; o.tail draws a faint run of many more, every other word it knows; o.pick lights one
// o.na: how much the numbers show (they dim while the chances change, so each settles before it's read)
function bb_chances(ctx,x,y,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const bw=o.bw||420,u=o.u==null?1:o.u;
  rows.forEach(([w,p],i)=>{const k=ag_in(u,i*0.12,0.3);if(k<=0)return;const yy=y+i*66,pick=o.pick===i,wrong=o.wrong===i;ctx.save();ctx.globalAlpha*=k;
    ag_T(ctx,w,x,yy+11,{w:700,size:32,col:wrong?AG.amber:AG.ink});ctx.fillStyle="rgba(60,56,70,0.1)";rr(ctx,x+190,yy-14,bw,28,14);ctx.fill();
    ctx.fillStyle=rgba(wrong?AG.amber:BB_VI,pick?1:0.55);rr(ctx,x+190,yy-14,Math.max(28,bw*p/100*k),28,14);ctx.fill();
    if(o.na!==0)withA(ctx,o.na==null?1:o.na,()=>ag_T(ctx,Math.round(p)+" in 100",x+190+bw+24,yy+11,{w:700,size:30,col:AG.mut}));ctx.restore();});
  if(o.tail){ctx.save();ctx.globalAlpha*=o.tail;for(let i=0;i<12;i++){ctx.fillStyle=rgba(BB_VI,0.35);rr(ctx,x+190,y+rows.length*66-20+i*7,4+hash(i,9)*18,4,2);ctx.fill();}
    ag_T(ctx,"and every other word it knows",x+250,y+rows.length*66+28,{w:500,size:28,col:AG.mut});ctx.restore();}
  ctx.restore();}
// as a wheel: a slice for each word, as big as its chances, and a pointer at the top; rot turns it (radians, clockwise); o.pick lights
// the slice under the pointer, o.wrong colours one amber, o.label (the words) on the big slices and beside the small ones
function bb_wheelAt(rows,rot){let acc=0;const tot=rows.reduce((s,r)=>s+r[1],0)+(rows.extra||0),pt=((-rot)%TAU+TAU)%TAU;for(let i=0;i<rows.length;i++){const sp=rows[i][1]/tot*TAU;if(pt>=acc&&pt<acc+sp)return i;acc+=sp;}return -1;}
function bb_wheelTo(rows,i,turns){let acc=0;const tot=rows.reduce((s,r)=>s+r[1],0)+(rows.extra||0);for(let k=0;k<i;k++)acc+=rows[k][1]/tot*TAU;return TAU*turns-(acc+rows[i][1]/tot*TAU*0.5);}
function bb_wheel(ctx,x,y,r,rows,rot,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,clamp(o.k,0,1.2)));
  const tot=rows.reduce((s,r)=>s+r[1],0)+(rows.extra||0);ag_floorShadow(ctx,x-10,y+r+30,r*0.9,22,0.18);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=30;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=14;ctx.fillStyle="#EEECE7";ctx.beginPath();ctx.arc(x,y,r+14,0,TAU);ctx.fill();ctx.restore();
  let acc=-Math.PI/2+rot;const pick=o.pick;rows.forEach(([w,p],i)=>{const sp=p/tot*TAU,lit=pick===i,wrong=o.wrong===i;
    ctx.fillStyle=wrong?rgba(mix(AG.amber,[255,255,255],lit?0.2:0.55),1):rgba(mix(BB_VI,[255,255,255],lit?0.12:0.5+0.08*(i%2)),1);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,acc,acc+sp);ctx.closePath();ctx.fill();
    ctx.strokeStyle="#F4F2EE";ctx.lineWidth=3;ctx.stroke();acc+=sp;});
  if(rows.extra){ctx.fillStyle="rgba(200,198,206,1)";ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,acc,acc+rows.extra/tot*TAU);ctx.closePath();ctx.fill();}
  // the hub
  ag_soft(ctx,c=>c.arc(x,y,r*0.12,0,TAU),[230,226,220],[255,255,255],x+6,y-6,r*0.14,"rgba(40,30,20,0.3)",4);
  // words: inside the slices big enough, and the rest beside the wheel
  if(o.labels!==false){acc=-Math.PI/2+rot;rows.forEach(([w,p],i)=>{const sp=p/tot*TAU,mid=acc+sp/2;acc+=sp;if(sp<0.55)return;const lx=x+Math.cos(mid)*r*0.62,ly=y+Math.sin(mid)*r*0.62;
    ag_T(ctx,w,lx,ly+11,{w:800,size:30,align:"center",col:pick===i?AG.white:AG.ink});});}
  // the pointer, at the top
  ctx.fillStyle=AG.arrow;ctx.beginPath();ctx.moveTo(x,y-r+30);ctx.lineTo(x-20,y-r-22);ctx.lineTo(x+20,y-r-22);ctx.closePath();ctx.fill();
  ctx.restore();}
// the temperature dial: a ceramic knob turning from Low (v 0) to High (v 1), with its name under it
function bb_dial(ctx,x,y,r,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,clamp(o.k,0,1.2)));
  const a0=Math.PI*0.75,span=Math.PI*1.5,an=a0+span*clamp(v,0,1);ctx.strokeStyle="rgba(60,56,50,0.25)";ctx.lineWidth=10;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r+30,a0,a0+span);ctx.stroke();
  ctx.strokeStyle=rgba(BB_VI,0.8);ctx.beginPath();ctx.arc(x,y,r+30,a0,an);ctx.stroke();
  const sp=AG.sphere,g=ctx.createRadialGradient(x+r*0.34,y-r*0.43,r*0.07,x,y,r*1.05);g.addColorStop(0,sp[0]);g.addColorStop(0.6,sp[1]);g.addColorStop(1,sp[2]);
  ctx.save();ctx.shadowColor=AG.sphereShadow;ctx.shadowBlur=r*0.4;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=r*0.2;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle=AG.arrow;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.25,y+Math.sin(an)*r*0.25);ctx.lineTo(x+Math.cos(an)*r*0.82,y+Math.sin(an)*r*0.82);ctx.stroke();
  ag_T(ctx,"Low",x+Math.cos(a0)*(r+30)-10,y+Math.sin(a0)*(r+30)+50,{w:700,size:28,align:"center",col:AG.mut});
  ag_T(ctx,"High",x+Math.cos(a0+span)*(r+30)+10,y+Math.sin(a0+span)*(r+30)+50,{w:700,size:28,align:"center",col:AG.mut});
  ag_T(ctx,"Temperature",x,y+r+96,{w:700,size:30,align:"center"});ctx.restore();}
// an answer on a card: the model's words; o.word marks where the chosen word starts (it's drawn in violet), o.wrong (amber edge)
function bb_answer(ctx,x,y,w,text,o){o=o||{};return ag_textCard(ctx,x,y,w,{kick:o.kick===undefined?"The model":o.kick,title:text},{a:o.a,k:o.k,edge:o.wrong?AG.amber:o.edge,kickCol:o.wrong?AG.amber:BB_VI});}

/* ---------------------------------------------------------------- 2025: a fact seen once */
// a page of text with grey lines; o.mark (0..1) highlights one line on it, the one place the fact appears
function bb_page(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);ag_box(ctx,0,0,w,h,10,{});const R=ag_rnd(o.seed||1);
  for(let i=0;i<Math.floor((h-60)/30);i++){const lw=(w-70)*(0.6+0.4*R()),ly=40+i*30;if(o.mark&&i===o.line){ctx.fillStyle=rgba([250,222,120],0.8*o.mark);rr(ctx,26,ly-12,lw+18,26,6);ctx.fill();}
    ctx.fillStyle="rgba(90,86,80,0.35)";rr(ctx,35,ly-4,lw,9,4);ctx.fill();}ctx.restore();}
function bb_pages(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;for(let i=5;i>=0;i--){const k=ag_in(o.u==null?1:o.u,(5-i)*0.1,0.3);if(k<=0)continue;ctx.save();ctx.globalAlpha*=k;
    bb_page(ctx,x+i*34,y-i*26,360,460,{rot:(i-2.5)*0.025,seed:i+3,mark:i===0?o.mark:0,line:6});ctx.restore();}ctx.restore();}
// the test: a question, and how a guess and a blank score
function bb_test(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+430,y+200,lerp(0.6,1,clamp(o.k,0,1.2)));const w=860,h=400;
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,"TEST",x+34,y+56,{w:700,size:28,ls:4,col:AG.mut});ag_T(ctx,"The researcher's birthday?",x+34,y+110,{w:700,size:36});
  const row=(yy,ans,score,k,col)=>{if(k<=0)return;ctx.save();ctx.globalAlpha*=k;ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+34,yy-50);ctx.lineTo(x+w-34,yy-50);ctx.stroke();
    ag_T(ctx,ans,x+34,yy,{w:700,size:34,col:AG.ink});ag_T(ctx,score,x+w-34,yy,{w:700,size:30,align:"right",col:col||AG.mut});ctx.restore();};
  row(y+230,"A guess: 15 June",o.guessScore||"might score",o.g==null?1:o.g,AG.ink);row(y+330,"“I don’t know”","never scores",o.b==null?1:o.b);ctx.restore();}

/* ---------------------------------------------------------------- the 1950s: the gap, seen at last */
// an electron microscope's picture, in greys: one cell's end with its small sacs, the gap, the next cell's edge; kept small
function bb_emTex(){return ag_kept("bb:em",900,520,(c,w,h)=>{c.fillStyle="rgb(150,150,146)";c.fillRect(0,0,w,h);const R=ag_rnd(1955);
  for(let i=0;i<2600;i++){c.fillStyle="rgba("+(R()<0.5?"40,40,40":"230,230,226")+","+(0.04+R()*0.08)+")";c.beginPath();c.arc(R()*w,R()*h,1+R()*5,0,TAU);c.fill();}
  // the end above the gap, its sacs, and the two edges of the gap
  const top=c=>{c.moveTo(0,0);c.lineTo(w,0);c.lineTo(w,190);c.bezierCurveTo(w*0.7,250,w*0.3,250,0,200);c.closePath();};c.save();c.beginPath();top(c);c.fillStyle="rgba(176,176,172,0.8)";c.fill();c.clip();
  for(let i=0;i<46;i++){const x=R()*w,y=40+R()*170,r=10+R()*6;c.strokeStyle="rgba(50,50,50,0.7)";c.lineWidth=3;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.fillStyle="rgba(206,206,202,0.6)";c.fill();}c.restore();
  c.strokeStyle="rgba(36,36,36,0.85)";c.lineWidth=8;c.beginPath();c.moveTo(0,204);c.bezierCurveTo(w*0.3,254,w*0.7,254,w,194);c.stroke();
  c.beginPath();c.moveTo(0,238);c.bezierCurveTo(w*0.3,288,w*0.7,288,w,228);c.stroke();
  c.fillStyle="rgba(60,60,60,0.25)";c.beginPath();c.moveTo(0,244);c.bezierCurveTo(w*0.3,294,w*0.7,294,w,234);c.lineTo(w,h);c.lineTo(0,h);c.closePath();c.fill();
  ag_grain(c,0,0,w,h,3,57);});}
function bb_em(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_picture(ctx,x,y,w,h,{frame:"graphite",img:bb_emTex()});
  // the gap's width, marked
  const gx=x+w*0.5,gy=y+h*(252/520),k=o.mark||0;if(k>0){ctx.save();ctx.globalAlpha*=k;ctx.strokeStyle="rgba(255,248,214,0.95)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(gx-60,gy-6);ctx.lineTo(gx+60,gy-6);ctx.moveTo(gx-60,gy+30);ctx.lineTo(gx+60,gy+30);ctx.stroke();
    ag_arrowHead(ctx,gx,gy-6,Math.PI/2,14,"rgba(255,248,214,0.95)");ag_arrowHead(ctx,gx,gy+30,-Math.PI/2,14,"rgba(255,248,214,0.95)");ctx.restore();}
  ctx.restore();}

/* ===== Borrowed from the brain: the nine chapters =====
   Each chapter is cut into shots (ag_shots), each a place under a slow camera; every moment waits for a word of the narration
   (wAt(sc, line, word)), so the pictures stay with the voice if it's recorded again. tools/score.py times its sounds to the same words.
   The opening asks why the perceptron was modelled on a nerve cell (Why look to nature); its story is Cajal's, Barcelona 1888, to the
   title (A thicket). Then inside a nerve cell, nature's trials, the gaps a brain fills, what models borrowed and what they didn't,
   likely words, sure and wrong, and the picture that held. The film's places are in bb_past.js and bb_life.js; what people built on
   the nerve cell in bb_model.js. */

const BB_NUM="1.2",BB_TITLE="Borrowed from the brain";
function bb_kick(ctx,a,o){o=o||{};a=a==null?1:a;if(a<=0)return;
  // the place behind the title is busy or mid-toned in the film's nature scenes: a soft patch of shade (under the light title) or of
  // haze (under the dark one) keeps it readable, about 3:1 or better, like the marble behind the title in the lab
  if(o.scrim){ctx.save();ctx.translate(390,92);ctx.scale(1,0.15);const g=ctx.createRadialGradient(0,0,0,0,0,560),c=o.dark?[14,16,22]:[252,250,246];
    g.addColorStop(0,rgba(c,o.scrim*a));g.addColorStop(0.62,rgba(c,o.scrim*a*0.7));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(-560,-560,1120,1120);ctx.restore();}
  ag_kicker(ctx,BB_NUM,BB_TITLE,{a,dark:o.dark,x:o.x,y:o.y});}
// the title through a chapter's shots: look[i] is [dark, scrim] for shot i (or a function of t giving it); at a dissolve the two looks
// cross with the pictures, at a cut they change with them
function bb_kickShots(ctx,t,shots,i,look,a,dis){a=a==null?1:a;if(a<=0)return;const L=k=>{const v=look[Math.min(k,look.length-1)];return typeof v==="function"?v(t):v;};
  const cur=L(i),u=i>0&&!shots[i].cut?ease(clamp((t-shots[i].at)/(dis||0.6),0,1)):1,prev=i>0?L(i-1):cur;
  const d=lerp(prev[0],cur[0],u),sl=lerp(prev[0]?0:prev[1],cur[0]?0:cur[1],u),sd=lerp(prev[0]?prev[1]:0,cur[0]?cur[1]:0,u);
  if(d<1)bb_kick(ctx,a*(1-d),{scrim:sl/(1-d||1)});if(d>0)bb_kick(ctx,a*d,{dark:true,scrim:sd/(d||1)});}
// a place-and-year tag, drawn in screen space from inside a shot (so it stays put while the camera moves, and dissolves with its shot);
// under the kicker (BB_UNDER) in the chapters that have one
function bb_tagS(ctx,S,s,a,o){if(a>0)bb_scr(ctx,S,()=>bb_tag(ctx,s,a,o));}
const BB_UNDER={x:96,y:130};
// a card's kicker in the room's grey, for people and things that aren't the model
const BB_K={kickCol:AG.kick};

/* ---------------------------------------------------------------- pictures kept once, for cards */
// a brain as the anatomy book draws it
function bb_brainPic(){return ag_kept("bb:brainpic",700,520,c=>{bb_brain(c,350,236,0.78);});}
// Cajal's drawing: three cells in ink, separate, their branches reaching close to the next cell, never joined
const BB_DA=bb_cell(5101,{x:560,y:330,r:20,reach:150,dirs:6,depth:3,wig:0.42,spines:true,axon:{ang:0.36,len:330,bend:0.18,ends:3,endLen:44},axW:7});
const BB_DB=bb_cell(5102,{x:990,y:520,r:22,reach:160,dirs:6,depth:3,wig:0.42,spines:true,axon:{ang:0.3,len:330,bend:0.18,ends:3,endLen:44},axW:7});
const BB_DC=bb_cell(5103,{x:1400,y:690,r:20,reach:130,dirs:6,depth:2,wig:0.42,spines:true,axon:{ang:0.45,len:160,bend:0.2,ends:3,endLen:36},axW:7});
const BB_DJ=BB_DA.A[BB_DA.A.length-1];   // where A's long fibre ends, by B's branches: the gap he drew
// the branch of B nearest A's fibre's end: the way a message comes in, from its tip to B's body
const BB_DBIN=(()=>{let best=0,d=1e9;BB_DB.B.forEach((b,i)=>{if(b.kids.length)return;const q=b.P[b.P.length-1],e=Math.hypot(q[0]-BB_DJ[0],q[1]-BB_DJ[1]);if(e<d){d=e;best=i;}});return bb_toBody(BB_DB,best);})();
function bb_drawing(ctx,ua,ub,uc,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;for(const [cl,u] of [[BB_DA,ua],[BB_DB,ub],[BB_DC,uc]])bb_drawCell(ctx,cl,{u,ink:true,knob:5});ctx.restore();}
function bb_drawingPic(){const B=BB_SHEET;return ag_kept("bb:drawing",B.w,B.h,c=>{bb_paper(c,0,0,B.w,B.h);c.translate(-B.x,-B.y);bb_drawing(c,1,1,1,1);});}
// points P moved d to the side (for an arrow drawn alongside a fibre)
function bb_beside(P,d){return P.map((p,i)=>{const a=P[Math.max(0,i-1)],b=P[Math.min(P.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;return[p[0]-dy/l*d,p[1]+dx/l*d];});}
// a thin leader from a label to what it names
function bb_leader(ctx,a,b,al,col){if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=rgba(col||BB.inkSoft,0.7);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.restore();}
// an amber cross: a guess that's wrong
function bb_cross(ctx,x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.amber,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x+s,y+s);ctx.moveTo(x+s,y-s);ctx.lineTo(x-s,y+s);ctx.stroke();ctx.restore();}
// a card with a kicker and one line of words in parts [[text, colour, alpha], ...]; o.w a fixed width; returns its box
function bb_line(ctx,x,y,parts,o){o=o||{};const a=o.a==null?1:o.a,f={w:700,size:36};let w=0;for(const p of parts)w+=ag_tw(ctx,p[0],f);const bw=o.w||w+56,h=o.kick?138:100;
  if(a<=0)return{x,y,w:bw,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+bw/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));ag_box(ctx,x,y,bw,h,22,{edge:o.edge,edgeA:0.75});
  let yy=y+50;if(o.kick){ag_T(ctx,String(o.kick).toUpperCase(),x+28,yy,{w:700,size:28,ls:4,col:o.kickCol||AG.kick});yy+=54;}else yy+=12;
  let xx=x+28;for(const p of parts){const pa=p[2]==null?1:p[2];if(pa>0)ag_T(ctx,p[0],xx,yy,{w:700,size:36,col:p[1]||AG.ink,a:pa});xx+=ag_tw(ctx,p[0],f);}ctx.restore();return{x,y,w:bw,h};}
// a framed picture that springs in: o.draw(c, x, y, w, h) paints inside it, or o.img
function bb_framed(ctx,x,y,w,h,a,k,o){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,clamp(k==null?1:k,0,1.2)));ag_picture(ctx,x,y,w,h,o||{});ctx.restore();}
// the model, as the module draws it: the sphere, its light on the wall and its shadow on the floor
function bb_model(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_modelLight(ctx,x,y,r,1,o.floor||y+r+120);ag_model(ctx,x,y,r,{t,core:o.core==null?0.6:o.core,think:o.think||0});ctx.restore();}

/* ================================================================ 1 · Why look to nature */
// 1958: three trials. Each time the perceptron is shown a card (the spot on the left or the right), guesses, and is told if it was right;
// after the wrong guess, its numbers move
const BB_D0=[0.4,-0.6,0.9,-0.2,0.7,-1.0],BB_DN=[0.25,-0.3,-0.35,0.3,-0.25,0.35];
function bb_trial(t,t0){const D=1.75,T=[[0,0,true],[1,0,false],[1,1,true]],i=Math.floor((t-t0)/D),u=(t-t0)/D-i;
  const nud=ag_sine(clamp((t-(t0+D*1.62))/0.5,0,1)),dial=j=>BB_D0[j]+BB_DN[j]*nud;
  if(t<t0||i>=T.length)return{show:0,card:1,guess:null,right:null,nudge:0,dial};
  const [card,guess,right]=T[i];return{show:ag_in(u,0.02,0.16)*(1-ag_in(u,0.9,0.09)),card,guess:u>0.36&&u<0.93?guess:null,right:u>0.5&&u<0.93?right:null,nudge:i===1?ag_io(u,0.6,0.88,0.06):0,dial};}
// the cell he modelled it on, in ink, and the unit it became, in violet
const BB_C58=bb_cell(1958,{x:560,y:420,r:22,reach:170,dirs:6,depth:3,wig:0.4,spines:true,axon:{ang:Math.PI*0.5,len:280,bend:0.2,ends:3,endLen:40},axW:7});
const BB_ARC58=bb_smooth([[690,306],[860,232],[1060,240],[1170,336]],8);
function bb_sketchUnit(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u;if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;const wc=mix(BB_VI,[120,116,140],0.3);
  for(let i=0;i<3;i++){const k=ag_in(u,i*0.1,0.35),yy=y+(i-1)*120;if(k<=0)continue;bb_wire(ctx,[x-230,yy],[x-r*0.92,y+(i-1)*r*0.42],{w:5,u:k,col:wc,alpha:0.8});
    ctx.fillStyle=rgba(wc,0.8*k);ctx.beginPath();ctx.arc(x-230,yy,7,0,TAU);ctx.fill();}
  const ku=ag_in(u,0.35,0.35);if(ku>0){ctx.save();ctx.globalAlpha*=ku;bb_wire(ctx,[x+r,y],[x+220,y],{w:6,col:wc,alpha:0.85});ag_arrowHead(ctx,x+226,y,0,16,rgba(wc,0.9));bb_unit(ctx,x,y,r,{on:o.on||0});ctx.restore();}
  ctx.restore();}
// nature's trials: three lines that last, to a bird, a seed and a brain, and many that end early, growing left to right
const BB_TRY=(()=>{const R=ag_rnd(1859);
  const keep=[[[470,520],[650,470],[860,380],[1090,320],[1300,300],[1460,300]],[[470,520],[650,470],[860,540],[1090,515],[1300,530],[1460,520]],[[470,520],[640,580],[860,650],[1090,700],[1300,730],[1460,740]]].map(p=>bb_smooth(p,8));
  const dead=[];for(let i=0;i<16;i++){const L=keep[i%3],u=0.1+R()*0.72,q=bb_along(L,u),s=R()<0.5?-1:1,len=70+R()*110,P=[[q[0],q[1]]];let a=q[2]+s*(0.5+R()*0.5),x=q[0],y=q[1];
    for(let k=1;k<=4;k++){a+=(R()-0.5)*0.4;x+=Math.cos(a)*len/4;y+=Math.sin(a)*len/4;P.push([x,y]);}dead.push({P:bb_smooth(P,4),u});}
  return{keep,dead};})();
function bb_trials(ctx,t,t0,tKeep){const g=ag_in(t,t0,3.6),fade=ag_in(t,tKeep,1.0);
  bb_inkArrow(ctx,[[470,232],[1470,232]],ag_in(t,t0,1.2),4,0.85,BB.inkSoft);
  withA(ctx,ag_in(t,t0+0.4,0.6),()=>ag_T(ctx,"Billions of years",970,206,{w:600,size:32,align:"center",col:BB.inkSoft}));
  BB_TRY.dead.forEach(d=>{const k=clamp((g-d.u)/0.14,0,1);if(k<=0)return;bb_ink(ctx,d.P,k,3.2,lerp(1,0.26,fade));
    if(k>=1){const e=d.P[d.P.length-1];ctx.save();ctx.globalAlpha*=lerp(0.9,0.26,fade);ctx.strokeStyle=rgba(BB.ink,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(e[0],e[1],6,0,TAU);ctx.stroke();ctx.restore();}});
  BB_TRY.keep.forEach(L=>bb_ink(ctx,L,g,5,1));
  // the designs that work, at the ends of the lines that last
  const ic=i=>ag_in(t,tKeep+0.2+i*0.25,0.4),kk=i=>lerp(0.6,1,clamp(ag_spr(t,tKeep+0.2+i*0.25,0.5),0,1.2));
  if(ic(0)>0){ctx.save();ctx.globalAlpha*=ic(0);ag_about(ctx,1530,300,kk(0));bb_buzzard(ctx,1530,300,0.26,{col:BB.ink});ctx.restore();}
  if(ic(1)>0){ctx.save();ctx.globalAlpha*=ic(1);ag_about(ctx,1530,520,kk(1));ctx.translate(1494,532);bb_seedShape(ctx,0.56,-0.35);ctx.restore();}
  if(ic(2)>0){ctx.save();ctx.globalAlpha*=ic(2);ag_about(ctx,1530,745,kk(2));ctx.strokeStyle=rgba(BB.ink,0.9);ctx.lineWidth=3.2;ctx.lineJoin="round";ctx.beginPath();bb_brainPath(ctx,1530,750,0.16);ctx.stroke();
    ctx.lineWidth=2.2;for(const [p0,p1,p2] of [[[1502,744],[1518,730],[1532,744]],[[1526,756],[1544,742],[1556,754]],[[1508,722],[1526,712],[1546,722]]]){ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.quadraticCurveTo(p1[0],p1[1],p2[0],p2[1]);ctx.stroke();}ctx.restore();}}
// seeds falling from the maple: [x, y, start (s after "seed"), speed down, drift]
const BB_FALL=[[430,170,-0.4,118,24],[1230,-60,0.3,134,18],[830,190,1.4,112,30]];
// a magnifying glass over the brain: the tangle a lens shows, too dense to follow
function bb_magnifier(ctx,x,y,r,a,k){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));
  ctx.save();ctx.translate(x,y);ctx.rotate(0.75);ag_soft(ctx,c=>ag_rect(c,r+10,-17,210,34,15),[96,70,50],[176,136,100],r+130,-17,130,"rgba(0,0,0,0.4)",6,0.6);ctx.restore();
  bb_lens(ctx,x,y,r,c=>c.drawImage(bb_thicketTex(),x-r*1.1,y-r*1.1,r*2.2,r*2.2),{rim:12});
  ctx.strokeStyle=rgba(BB.brass,0.95);ctx.lineWidth=7;ctx.beginPath();ctx.arc(x,y,r+15,0,TAU);ctx.stroke();ctx.restore();}

scene("nature",(ctx,S,t,sc)=>{const C=sc.cues;
  const t58=wAt(sc,"start","nineteen fifty-eight"),tShowed=wAt(sc,"start","showed a program"),tPer=wAt(sc,"start","the perceptron");
  const tCell=C.cell,tModel=wAt(sc,"cell","modelled it"),tWhy=C.why,tTry=C.trying,tKeep=wAt(sc,"trying","keeping the ones");
  const tBirds=C.birds,tWright=C.wright,tTw=wAt(sc,"wright","twisting their wingtips"),tTwist=C.twist,tSeed=C.seed,tSpins=wAt(sc,"seed","spins down");
  const tEx=C.example,tBrain=wAt(sc,"example","a brain"),tWired=C.wired,tSee=wAt(sc,"wired","nobody could see");
  const shots=[
    // Washington, 1958: Frank Rosenblatt and the perceptron, as the first film drew it; it learns from three cards
    {at:0,place:"bbNavy",keys:[[0,960,540,1.0],[1.6,900,530,1.07]],d:3.2,push:0.02,draw(ctx,t){const tr=bb_trial(t,tShowed+0.2);
      bb_perceptron(ctx,560,250,{on:1,card:tr.card,show:tr.show,guess:tr.guess,right:tr.right,dial:tr.dial,nudge:tr.nudge});
      ag_person(ctx,BB_CAST.rosenblatt,250,640,0.92,{t,gaze:[3,1],nod:0.04+0.03*ag_io(t,tPer-0.4,tPer+1.0,0.4)});
      bb_tagS(ctx,S,"Washington, D.C. · 1958",ag_in(t,t58,0.6));}},
    // on paper: the nerve cell he modelled it on, and the unit it became; why look to nature? The page turns: nature's trials
    {at:tCell-0.4,place:"bbSheet",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){
      // the first page, until the next one has slid over it
      const turn=ag_eo(ag_in(t,tTry-0.5,0.9));if(turn<1){
      bb_drawCell(ctx,BB_C58,{u:ag_in(t,tCell-0.2,1.6),ink:true});
      bb_inkArrow(ctx,BB_ARC58,ag_in(t,tModel-0.1,0.9),4,1);
      withA(ctx,ag_in(t,tModel+0.4,0.5),()=>ag_T(ctx,"modelled on",930,212,{w:600,size:32,align:"center",col:BB.inkSoft}));
      bb_sketchUnit(ctx,1290,450,64,{u:ag_in(t,tModel+0.1,1.0)});
      bb_cardAt(ctx,760,690,400,{title:"Why look to nature?"},t,tWhy-0.1,null);}if(turn>0){const B=BB_SHEET;bb_paper(ctx,B.x+(1-turn)*1520,B.y,B.w,B.h);}
      if(turn>=1)bb_trials(ctx,t,tTry+0.1,tKeep);}},
    // birds: watched for centuries; Wilbur Wright saw buzzards twist their wingtips to keep their balance
    {at:tBirds-0.4,place:"bbSky",keys:[[0,960,520,1.0],[tWright-0.3,1180,430,1.7]],d:2.4,push:0.02,draw(ctx,t){
      const tw=Math.sin((t-tTw)*2.4)*0.9*ag_io(t,tTw-0.2,tTwist-0.3,0.5);
      bb_buzzard(ctx,520+120*Math.cos(t*0.3),300+40*Math.sin(t*0.3),0.42,{roll:-0.2+0.1*Math.sin(t*0.3)});
      bb_buzzard(ctx,1620+80*Math.cos(t*0.35+2),230+30*Math.sin(t*0.35+2),0.34,{roll:0.15});
      const bx=1180+24*Math.sin(t*0.25),by=430+12*Math.sin(t*0.4);bb_buzzard(ctx,bx,by,0.9,{twist:tw,roll:-0.12*tw});
      // which way each wingtip turns: one up, the other down
      const aa=ag_io(t,tTw,tTwist-0.4,0.4);if(aa>0){const up=clamp(tw*3,-1,1),dn=-up;
        for(const [side,v] of [[1,up],[-1,dn]]){const x=bx+side*206,k=Math.abs(v);if(k<0.05)continue;const s=v>0?-1:1,P=bb_smooth([[x,by-8+s*-6],[x+side*10,by-8+s*28],[x+side*4,by-8+s*58]],6);
          ctx.save();ctx.shadowColor="rgba(250,248,240,0.9)";ctx.shadowBlur=10;bb_inkArrow(ctx,P,1,4,aa*k);ctx.restore();}}}},
    // Kitty Hawk, 1902: the brothers' glider, its wings warping
    {at:tTwist-0.4,place:"bbDunes",keys:[[0,960,500,1.0],[tSeed-1.4,1000,480,1.06]],d:2.6,push:0.02,draw(ctx,t){const u=t-tTwist,tw=Math.sin(u*1.7)*0.75,x=880+u*22,y=420+Math.sin(u*0.9)*10;
      ag_floorShadow(ctx,x+40,930,380,26,0.18);bb_glider(ctx,x,y,0.82,{twist:tw,roll:-0.07*tw});
      bb_tagS(ctx,S,"Kitty Hawk, North Carolina · 1902",ag_in(t,tTwist+0.3,0.6));}},
    // the maple's seeds, spinning down like tiny helicopters
    {at:tSeed-0.4,place:"bbMaple",keys:[[0,960,520,1.04],[tSpins,920,580,1.1]],d:2.6,push:0.02,draw(ctx,t){
      for(const [x0,y0,ts,vy,dr] of BB_FALL){const u=t-(tSeed+ts);if(u<0)continue;const y=y0+u*vy,x=x0+u*dr+Math.sin(u*2.2)*26;if(y>1180)continue;bb_seedSpin(ctx,x,y,1.05,t+ts,{rate:7.5});}}},
    // the only working example of a machine that learns: a brain; but in 1888 nobody could see how it was wired
    {at:tEx-0.4,place:"bbBrain",keys:[[0,960,520,1.0],[tWired,1010,470,1.08]],d:2.6,push:0.015,draw(ctx,t){
      bb_brainLights(ctx,t,0.45*ag_in(t,tBrain-0.3,1.2)*(1-ag_in(t,tSee-0.4,0.8)));
      bb_magnifier(ctx,1050,430,170,ag_in(t,tSee-0.5,0.5),ag_spr(t,tSee-0.5,0.6));}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);});

/* ================================================================ 2 · A thicket (the opening story: Barcelona, 1888, to the title) */
// the ward: the brain, and the part the blood no longer reaches
function bb_strokeCard(ctx,x,y,t,t0){const a=ag_in(t,t0-0.3,0.4);if(a<=0)return;const w=380,h=282;bb_framed(ctx,x,y,w,h,a,ag_spr(t,t0-0.3,0.5),{img:bb_brainPic()});
  const k=ag_in(t,t0+0.2,1.2);if(k<=0)return;const px=x+190*w/700,py=y+262*h/520,r=44*ag_sine(k),g=ctx.createRadialGradient(px,py,0,px,py,r+1);
  g.addColorStop(0,"rgba(58,30,38,0.78)");g.addColorStop(0.7,"rgba(70,36,44,0.5)");g.addColorStop(1,"rgba(70,36,44,0)");ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,r+1,0,TAU);ctx.fill();ctx.restore();}
// words that don't come: a speech bubble by the patient, its dots trying, then still
function bb_speech(ctx,t,t0,t1,mx,my){const a=ag_in(t,t0-0.5,0.4)*(1-ag_in(t,t1,0.5));if(a<=0)return;const x=mx+70,y=my-170,w=170,h=96;
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,mx,my,lerp(0.6,1,clamp(ag_spr(t,t0-0.5,0.5),0,1.2)));
  ag_card(ctx,c=>ag_cardPath(c,x,y,w,h,24,{side:"bottom",a:x+26,b:x+66,px:mx+10,py:my-12}),{x,y,w,h},{});
  const still=ag_in(t,t0+0.7,0.8);for(let i=0;i<3;i++){const p=0.5+0.5*Math.sin(t*5-i*0.9),k=lerp(0.35+0.55*p,0.12,still);ctx.fillStyle=rgba(AG.mut,k);ctx.beginPath();ctx.arc(x+52+i*33,y+h/2,8,0,TAU);ctx.fill();}
  ctx.restore();}
// the stain picks a few cells, it seems at random: when each one shows (s after "black")
const BB_PICK=[0.15,0.95,0.4,1.4,0.65,1.15];
// young birds' brains: a thinner thicket
function bb_youngCard(ctx,x,y,t,t0){const a=ag_in(t,t0-0.2,0.4);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+240,y+195,lerp(0.6,1,clamp(ag_spr(t,t0-0.2,0.5),0,1.2)));
  ag_box(ctx,x,y,480,390,22,{});ag_T(ctx,"YOUNG BIRDS",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  bb_finch(ctx,x+250,y+250,0.9,{young:true});ag_T(ctx,"A thinner thicket",x+28,y+356,{w:700,size:34});ctx.restore();}
// a round inset magnifying the gap: A's fibre's end, and B's branch, close but never joined
function bb_gapInset(ctx,cx,cy,r,k,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,cx,cy,lerp(0.6,1,clamp(k,0,1.2)));
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fillStyle=rgba(BB.paper,1);ctx.fill();ctx.clip();
  const ka=[cx-r*0.2,cy-r*0.11],kb=[cx+r*0.2,cy+r*0.13];
  bb_ink(ctx,bb_smooth([[cx-r-20,cy-r*0.62],[cx-r*0.62,cy-r*0.34],[ka[0]-12,ka[1]-6]],6),1,10,1);
  ctx.fillStyle=rgba(BB.ink,0.95);ctx.beginPath();ctx.arc(ka[0],ka[1],16,0,TAU);ctx.fill();
  bb_ink(ctx,bb_smooth([[cx+r+20,cy+r*0.7],[cx+r*0.66,cy+r*0.42],[kb[0]+12,kb[1]+8]],6),1,13,1);
  ctx.beginPath();ctx.ellipse(kb[0],kb[1],17,13,0.6,0,TAU);ctx.fill();
  // a second branch of B's, behind, for the look of the drawing
  bb_ink(ctx,bb_smooth([[cx+r*0.66,cy+r*0.42],[cx+r*0.5,cy+r*0.8],[cx+r*0.36,cy+r*1.1]],5),1,6,0.8);ctx.restore();
  ctx.strokeStyle=rgba(BB.ink,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();ctx.restore();}
// a message, one way: along A's fibre, across, in through B's branch to its body, out along B's fibre (u 0..3)
function bb_message(ctx,u){if(u<=0||u>=3)return;if(u<1)bb_run(ctx,BB_DA.A,u,8,{r:18});else if(u<1.15){const q=BB_DJ;bb_spark(ctx,q[0],q[1],18,1);}
  else if(u<2)bb_run(ctx,BB_DBIN,(u-1.15)/0.85,8,{r:18});else bb_run(ctx,BB_DB.A,u-2,8,{r:18});}
// the messengers at the gap he drew: sparks crossing from A's ends to B
function bb_messengers(ctx,t,a){if(a<=0)return;const J=BB_DJ,R=ag_rnd(11);ctx.save();ctx.globalAlpha*=a;for(let i=0;i<14;i++){const ph=((t*0.55+i/14)%1),dx=(R()-0.5)*18,dy=(R()-0.5)*12;
  bb_spark(ctx,J[0]+4+dx+ph*22,J[1]+dy+ph*10,5,Math.sin(Math.PI*ph));}ctx.restore();}
// the design his picture gave machines: simple units, each listening to many others, passing one message on
const BB_DESIGN=[{x:560,n:3,y:520,dy:190},{x:990,n:3,y:520,dy:190},{x:1400,n:1,y:520,dy:0}];
const BB_NETT=[{x:470,n:4,y:500,dy:120},{x:700,n:5,y:500,dy:110},{x:1220,n:5,y:500,dy:110},{x:1450,n:4,y:500,dy:120}];

scene("cajal",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath;
  const tSlices=C.slices,tThicket=C.thicket,tGolgi=wAt(sc,"net","Camillo Golgi"),tFused=wAt(sc,"net","fused"),tStarts=wAt(sc,"nobody","where a message starts"),tLearns=wAt(sc,"nobody","how a brain learns");
  const tStroke=C.stroke,tCuts=wAt(sc,"stroke","cuts off the blood"),tSpeech=wAt(sc,"stroke","take away their speech"),tDoctors=C.doctors,tBroken=wAt(sc,"doctors","what it has broken"),tHeal=wAt(sc,"doctors","whether it will heal");
  const tStain=C.stain,tBlack=wAt(sc,"stain","turns a few cells black"),tNobodyK=wAt(sc,"random","Nobody knows why"),tYoung=C.young,tBirds=wAt(sc,"young","young birds"),tWhole=C.whole;
  const tDrew=C.drew,tSep=wAt(sc,"drew","separate cells"),tNever=wAt(sc,"drew","never joined"),tOneway=C.oneway,tIn=wAt(sc,"oneway","in through the branches"),tOut=wAt(sc,"oneway","out along one long fibre");
  const tBerlin=C.berlin,tLook=wAt(sc,"berlin","look down his microscopes"),tAgree=wAt(sc,"berlin","and agree"),tNobel=C.nobel,tShare=wAt(sc,"nobel","share the Nobel Prize"),tDefends=wAt(sc,"nobel","still defends his net");
  const tNeuron=C.neuron,tTheN=wAt(sc,"neuron","the neuron"),tMed=C.medicine,tGaps=wAt(sc,"medicine","at the gaps he drew"),tMach=C.machines,tNothing=wAt(sc,"machines","nothing to copy");
  const tDesign=C.design,tMany=wAt(sc,"design","many simple cells"),tPass=wAt(sc,"design","passing one message on"),tToday=C.today;
  const J=BB_DJ;
  const shots=[
    // Barcelona, 1888: Cajal at his table, a doctor who teaches anatomy; the camera moves in to his microscope
    {at:0,place:"bbRoom",keys:[[0,960,540,1.0],[tSlices-0.3,1000,520,1.14]],d:2.6,push:0.02,draw(ctx,t){bb_room(ctx,t,{nod:0.1+0.06*ag_in(t,tSlices,1.0)});
      bb_tagS(ctx,S,"Barcelona · 1888",ag_in(t,0.9,0.6));}},
    // under the lens: a thicket of fibres; Golgi's idea, one continuous net; the questions it leaves
    {at:tThicket-0.4,place:"bbLens",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){bb_thicket(ctx,1);
      bb_inLens(ctx,c=>bb_golgiNet(c,ag_in(t,tFused-0.2,2.2),0.9*ag_in(t,tFused-0.3,0.5),[44,30,22]));
      bb_portrait(ctx,90,230,380,440,BB_CAST.golgi88,"Camillo Golgi",t,{a:ag_in(t,tGolgi-0.3,0.4),k:ag_spr(t,tGolgi-0.3,0.5),gaze:[3,1]});
      bb_cardAt(ctx,1420,300,440,{title:"Where does a message start?"},t,tStarts-0.2,null);
      bb_cardAt(ctx,1420,480,440,{title:"How does a brain learn?"},t,tLearns-0.2,null);}},
    // a ward: a stroke has taken someone's speech; the doctor can't tell what it has broken, or whether it will heal
    {at:tStroke-0.4,place:"bbWard",keys:[[0,960,540,1.0]],push:0.025,draw(ctx,t){
      bb_pillow(ctx);ag_person(ctx,BB_CAST.patient,240,650,0.9,{t,covered:true,gaze:[2,1],nod:0.04});bb_bed(ctx);
      ag_person(ctx,BB_CAST.doctor,1290,640,0.95,{t:t+0.6,flip:true,gaze:[-3,1],nod:0.05+0.04*ag_in(t,tDoctors,1.0)});
      bb_strokeCard(ctx,620,120,t,tCuts);bb_speech(ctx,t,tSpeech,tDoctors+1.2,304,552);
      bb_pillAt(ctx,1250,200,"What has it broken?",t,tBroken-0.15,null);bb_pillAt(ctx,1250,290,"Will it heal?",t,tHeal-0.15,null);}},
    // Golgi's stain: a few cells turn black, the rest clear; which few, nobody knows
    {at:tStain-0.4,place:"bbLens",keys:[[0,960,480,1.0]],push:0.02,draw(ctx,t){bb_thicket(ctx,1-ag_in(t,tBlack-0.2,1.8));
      bb_inLens(ctx,c=>BB_STAINED.forEach((cl,i)=>bb_drawCell(c,cl,{ink:true,u:ag_in(t,tBlack+BB_PICK[i],1.0)})));
      bb_cardAt(ctx,1430,380,420,{title:"Nobody knows why, even today"},t,tNobodyK-0.2,null);}},
    // Cajal makes it work reliably, on young birds' brains, where the thicket is thinner
    {at:tYoung-0.4,place:"bbRoom",keys:[[0,980,520,1.08]],push:0.02,draw(ctx,t){bb_room(ctx,t,{nod:0.14});bb_youngCard(ctx,1360,150,t,tBirds);}},
    // each black cell whole, like a tree in winter (the poster)
    {at:tWhole-0.4,place:"bbLens",keys:[[0,960,480,1.0],[tWhole+0.6,960,500,1.06]],d:2.6,push:0.015,draw(ctx,t){bb_thicket(ctx,0.16);
      bb_inLens(ctx,c=>bb_drawCell(c,BB_TREE,{ink:true,u:ag_in(t,tWhole-0.3,1.5)}));}},
    // he draws what he sees: separate cells, never joined; a message goes one way, in through the branches, out along the fibre
    {at:tDrew-0.4,place:"bbSheet",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){
      bb_drawing(ctx,ag_in(t,tDrew+0.2,1.6),ag_in(t,tSep,1.6),ag_in(t,tSep+0.8,1.4),1);
      const ga=ag_in(t,tNever-0.3,0.4)*(1-ag_in(t,tOneway+0.4,0.5));if(ga>0){ctx.save();ctx.globalAlpha*=ga;ctx.strokeStyle=rgba(BB.ink,0.7);ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(J[0]+10,J[1]+6,26,0,TAU);ctx.stroke();ctx.restore();
        bb_leader(ctx,[J[0]-6,J[1]+30],[742,548],ga);bb_gapInset(ctx,700,650,110,ag_spr(t,tNever-0.3,0.5),ga);
        bb_word(ctx,"never joined",700,812,{a:ga,w:700,size:32,align:"center",col:BB.ink});}
      const wa=ag_in(t,tIn-0.4,0.5);if(wa>0){bb_inkArrow(ctx,bb_beside(BB_DBIN,-22),ag_in(t,tIn-0.4,0.8),3.5,wa,BB.inkSoft);
        const s=BB_DBIN[0];bb_word(ctx,"in",s[0]-30,s[1]-26,{a:wa,w:700,size:34,align:"center",col:BB.ink});}
      const wb=ag_in(t,tOut-0.3,0.5);if(wb>0){const P=bb_beside(BB_DB.A,-26);bb_inkArrow(ctx,P,ag_in(t,tOut-0.3,1.0),3.5,wb,BB.inkSoft);
        const e=bb_along(P,0.55);bb_word(ctx,"out",e[0]+10,e[1]-30,{a:wb,w:700,size:34,align:"center",col:BB.ink});}
      bb_message(ctx,clamp((t-(tIn-1.2))/1.1,0,3));}},
    // Berlin, 1889: the leading anatomists look down his microscopes, and agree
    {at:tBerlin-0.4,place:"bbBerlin",keys:[[0,960,520,1.0]],push:0.025,draw(ctx,t){const cut=654,look=0.06+0.24*ag_io(t,tLook-0.3,tAgree-0.2,0.6),sm=0.5*ag_in(t,tAgree,0.6);
      ag_person(ctx,BB_CAST.cajal,330,450,0.98,{t,cut,gaze:[3,1],nod:0.06});
      ag_person(ctx,BB_CAST.kolliker,1010,440,1.0,{t:t+0.7,cut,flip:true,gaze:[-2,3],nod:look,smile:sm});
      ag_person(ctx,BB_CAST.anat,1590,450,0.96,{t:t+1.3,cut,flip:true,gaze:[-2,3],nod:look,smile:sm});
      for(const [x,s] of [[560,0.72],[880,0.8],[1460,0.78]])bb_scope(ctx,x,770,s);
      bb_pillAt(ctx,1010,96,"Agrees",t,tAgree-0.1,null,{icon:"tick",col:AG.green});bb_pillAt(ctx,1590,106,"Agrees",t,tAgree+0.2,null,{icon:"tick",col:AG.green});
      bb_tagS(ctx,S,"Berlin · 1889",ag_in(t,tBerlin+0.3,0.6));}},
    // Stockholm, 1906: they share the Nobel Prize; Golgi still defends his net
    {cut:true,at:tNobel-0.4,place:"bbHall",keys:[[0,960,540,1.0]],push:0.025,draw(ctx,t){
      ag_person(ctx,BB_CAST.cajal06,600,610,0.95,{t,gaze:[3,0],smile:0.2});
      ag_person(ctx,BB_CAST.golgi,1320,610,0.95,{t:t+0.9,flip:true,gaze:[-3,0]});
      bb_cardAt(ctx,420,130,360,{kick:"Cajal",title:"Separate cells"},t,tShare+0.3,null,BB_K);
      bb_cardAt(ctx,1140,130,360,{kick:"Golgi",title:"One net"},t,tDefends-0.2,null,BB_K);
      bb_tagS(ctx,S,"Stockholm · 1906",ag_in(t,tNobel+0.3,0.6));}},
    // the neuron; today's medicines work at the gaps he drew; machines had nothing to copy, until his picture gave them a design
    {at:tNeuron-0.4,place:"bbSheet",keys:[[0,960,500,1.0],[tMed-0.3,J[0]+12,J[1]+6,2.3],[tMach+0.2,960,500,1.0]],d:1.8,push:0,draw(ctx,t){
      bb_drawing(ctx,1,1,1,1-0.75*ag_in(t,tMany-0.3,1.2));
      const na=ag_io(t,tTheN-0.2,tMed-0.5,0.5);if(na>0){bb_leader(ctx,[1086,340],[1004,492],na,BB.ink);bb_word(ctx,"The neuron",1080,322,{a:na,w:700,size:34,col:BB.ink});}
      bb_messengers(ctx,t,ag_io(t,tGaps-0.6,tMach+0.4,0.4));
      const ra=ag_io(t,tGaps-0.3,tMach-0.2,0.5);if(ra>0){ctx.save();ctx.globalAlpha*=ra;ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(BB.ink,0.75);ctx.lineWidth=2;ctx.beginPath();ctx.arc(J[0]+12,J[1]+6,26,0,TAU);ctx.stroke();ctx.restore();}
      bb_scr(ctx,S,()=>{bb_pillAt(ctx,960,670,"Many medicines work here",t,tGaps-0.1,tMach-0.2);bb_tag(ctx,"Today",ag_io(t,tMed+0.1,tMach-0.2,0.5));});
      // machines: a unit with nothing to copy
      const qa=ag_in(t,tNothing-0.4,0.5)*(1-ag_in(t,tMany-0.4,0.5));if(qa>0){ctx.save();ctx.globalAlpha*=qa;ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(BB_VI,0.8);ctx.lineWidth=4;ctx.beginPath();ctx.arc(1380,250,62,0,TAU);ctx.stroke();ctx.setLineDash([]);
        ag_T(ctx,"?",1380,276,{w:800,size:72,align:"center",col:BB_VI});ctx.restore();}
      // the design: simple units, each listening to many others, passing one message on
      const da=ag_in(t,tMany-0.3,0.6);if(da>0){const sig=t>tPass-0.3?((t-tPass+0.3)*0.95)%2.6:-1;bb_net(ctx,BB_DESIGN,{r:30,u:ag_in(t,tMany-0.3,1.6),sig,a:da,alpha:0.5,sigma:true});
        const ua=ag_in(t,tMany+1.2,0.5)*da;if(ua>0){ctx.save();ctx.globalAlpha*=ua;bb_wire(ctx,[1432,520],[1540,520],{w:5,col:mix(BB_VI,[120,116,140],0.3),alpha:0.8,sig:sig>2?(sig-2)/0.6:null});ag_arrowHead(ctx,1548,520,0,15,rgba(mix(BB_VI,[120,116,140],0.3),0.9));ctx.restore();}}}},
    // today's models are still built from it
    {at:tToday-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){withA(ctx,0.32,()=>bb_net(ctx,BB_NETT,{r:22,sig:((t-tToday)*0.8)%3.4,alpha:0.4,sigma:false}));
      bb_model(ctx,960,500,120,t,{core:0.7,think:0.3,floor:760});}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  ag_title(ctx,S,t,br,BB_TITLE,"What models took from nerve cells","FILM 2 OF 10 · WHAT AN AGENT IS");});

/* ================================================================ 3 · Inside a nerve cell */
// the cells of Hebb's idea: two that fire together, and the link between them that grows
const BB_HA=bb_cell(1949,{x:430,y:520,r:30,reach:180,dirs:6,depth:3,wig:0.36,spines:true,axon:{ang:0.05,len:440,bend:0.2,ends:3,endLen:50},axW:10});
const BB_HJ=BB_HA.A[BB_HA.A.length-1];
const BB_HB=bb_cell(1950,{x:BB_HJ[0]+180,y:BB_HJ[1]+24,r:28,reach:170,dirs:6,depth:3,wig:0.38,spines:true,axon:{ang:0.25,len:240,bend:0.2,ends:3,endLen:40},axW:9});
// a signal coming in along points P, from t0, taking d seconds
function bb_inAt(ctx,P,t,t0,d){const u=(t-t0)/d;if(u>0&&u<1)bb_run(ctx,P,u,7,{r:15});}
// excite or hold back: two small connections on a card
function bb_exciteCard(ctx,x,y,t,tEx,tHold){const a=ag_in(t,tEx-0.3,0.4);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+220,y+165,lerp(0.6,1,clamp(ag_spr(t,tEx-0.3,0.5),0,1.2)));
  ag_box(ctx,x,y,440,330,22,{});const ke=ag_in(t,tEx,0.6),kh=ag_in(t,tHold,0.6);
  bb_miniSyn(ctx,x+110,y+150,0.6,"excite",ke,t);bb_miniSyn(ctx,x+330,y+150,0.6,"hold",kh,t);
  ag_T(ctx,"Excite",x+110,y+296,{w:700,size:30,align:"center"});withA(ctx,ag_in(t,tHold-0.2,0.4),()=>ag_T(ctx,"Hold back",x+330,y+296,{w:700,size:30,align:"center"}));ctx.restore();}

scene("cell",(ctx,S,t,sc)=>{const C=sc.cues;
  const tBr=C.branches,tFires=C.fires,tIt=wAt(sc,"fires","it fires"),tSame=C.same,tGap=C.gap,tTouch=wAt(sc,"gap","almost touches"),tChem=wAt(sc,"gap","chemical messengers");
  const tEx=wAt(sc,"some","excite"),tHold=wAt(sc,"some","hold it back"),tChange=C.change,tHebb=C.hebb,tTog=wAt(sc,"hebb","fire together"),tStr=wAt(sc,"hebb","grows stronger");
  const tRab=C.rabbit,tUse=wAt(sc,"rabbit","with use"),tLearn=C.learning;
  // the pulses, and the trace that draws them: small bumps first (too few arrived), then pulses, each the same size
  const P1=tIt-0.15,P2=tSame+0.5,P3=tSame+1.9,tr0=tBr+0.2,tr1=tSame+3.2,fr=x=>(x-tr0)/(tr1-tr0);
  const EV=[[fr(tBr+1.3),0.22],[fr(tBr+2.4),0.3],[fr(P1+0.08),1],[fr(P2+0.08),1],[fr(P3+0.08),1]];
  const TIPS=BB_N1TIPS;
  const shots=[
    // a neuron: its branches take signals in; when enough arrive together, it fires, a pulse down its long fibre, all or nothing
    {at:0,place:"bbTissue",keys:[[0,900,520,1.0],[tSame+2.4,1180,520,1.45]],d:1.8,push:0.015,draw(ctx,t){
      BB_AROUND.forEach(cl=>bb_drawCell(ctx,cl,{col:[150,104,84],a:0.55}));
      bb_drawCell(ctx,BB_N2,{col:BB_LIVE,a:0.92,u:ag_in(t,0.4,2.0)});bb_drawCell(ctx,BB_N1,{col:BB_LIVE,u:ag_in(t,0.2,2.6)});
      // a few signals come in, and nothing happens; then enough, together
      [0,5,9].forEach((i,k)=>bb_inAt(ctx,TIPS[i],t,tBr+0.3+k*0.08,1.0));[2,7].forEach((i,k)=>bb_inAt(ctx,TIPS[i],t,tBr+1.4+k*0.1,1.0));
      for(const p of [P1,P2,P3])TIPS.forEach((P,i)=>{if(p!==P1&&i%5===4)return;bb_inAt(ctx,P,t,p-1.0+(i%3)*0.03,1.0);});
      bb_cellGlow(ctx,BB_N1,0.25*ag_io(t,tBr+1.25,tBr+1.6,0.15)+0.3*ag_io(t,tBr+2.35,tBr+2.7,0.15));
      bb_pulse(ctx,BB_N1,clamp((t-P1)/1.7,0,1));bb_pulse(ctx,BB_N1,clamp((t-P2)/1.4,0,1));bb_pulse(ctx,BB_N1,clamp((t-P3)/1.4,0,1));
      bb_cellGlow(ctx,BB_N2,0.6*(ag_io(t,P1+1.6,P1+2.1,0.2)+ag_io(t,P2+1.3,P2+1.8,0.2)+ag_io(t,P3+1.3,P3+1.8,0.2)));}},
    // close up, at its end: the gap, and the chemical messengers that carry the signal across; some excite, some hold back; connections change
    {cut:true,at:tGap-0.3,place:"bbTissue",keys:[[0,1300,560,1.9]],push:0.02,draw(ctx,t){
      bb_scr(ctx,S,()=>{const t0=tChem-0.7;
        bb_synapse(ctx,t,{t0,glow:0.8*ag_io(t,t0+1.7,tEx-0.2,0.5)+0.6*ag_io(t,tChange+0.3,tHebb,0.5),grow:ag_in(t,tChange+0.1,1.8),bound:ag_io(t,t0+1.5,t0+3.2,0.4)});
        const la=ag_in(t,tTouch+0.2,0.4),G=BB_SYN.gap;bb_leader(ctx,[1150,438],[G[0]+14,G[1]-10],la,[250,240,226]);bb_pillAt(ctx,1250,420,"The gap",t,tTouch+0.2,null);
        bb_leader(ctx,[640,662],[882,576],ag_in(t,tChem+0.1,0.4),[250,240,226]);bb_pillAt(ctx,600,690,"Chemical messengers",t,tChem+0.1,null);
        bb_exciteCard(ctx,1430,92,t,tEx,tHold);});}},
    // Hebb, 1949: when two cells fire together, the link between them grows stronger; rabbits, 1973: links grow stronger with use
    {cut:true,at:tHebb-0.3,place:"bbTissue",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){
      const fires=[tTog-0.6,tTog+1.2,tStr+0.1,tUse-0.6,tUse+0.9],link=clamp(fires.reduce((s,p)=>s+0.22*ag_in(t,p+1.0,0.6),0),0,1);
      BB_AROUND.slice(0,3).forEach(cl=>bb_drawCell(ctx,cl,{col:[150,104,84],a:0.45}));
      bb_drawCell(ctx,BB_HB,{col:BB_LIVE});bb_drawCell(ctx,BB_HA,{col:BB_LIVE,knob:lerp(5,10,link)});
      if(link>0){const g=ctx.createRadialGradient(BB_HJ[0]+30,BB_HJ[1],4,BB_HJ[0]+30,BB_HJ[1],90);g.addColorStop(0,rgba(BB.spark,0.5*link));g.addColorStop(1,rgba(BB.spark,0));ctx.fillStyle=g;ctx.fillRect(BB_HJ[0]-60,BB_HJ[1]-90,180,180);}
      for(const p of fires){bb_pulse(ctx,BB_HA,clamp((t-p)/1.2,0,1));bb_cellGlow(ctx,BB_HB,0.7*ag_io(t,p+1.0,p+1.6,0.25));}
      bb_scr(ctx,S,()=>{bb_portrait(ctx,1440,150,360,410,BB_CAST.hebb,"Donald Hebb",t,{a:ag_in(t,tHebb+0.2,0.4)*(1-ag_in(t,tRab-0.6,0.5)),k:ag_spr(t,tHebb+0.2,0.5),gaze:[-2,1],flip:true});
        const ra=ag_in(t,tRab,0.4);if(ra>0){ctx.save();ctx.globalAlpha*=ra;ag_about(ctx,1630,270,lerp(0.6,1,clamp(ag_spr(t,tRab,0.5),0,1.2)));ag_box(ctx,1420,140,420,260,22,{});bb_rabbit(ctx,1640,352,0.74,t);ctx.restore();}
        bb_graph(ctx,1420,420,420,290,ag_in(t,tRab+0.8,2.6),{title:"Link strength",u0:0.36,mark:"use",a:ag_in(t,tRab+0.5,0.4),k:ag_spr(t,tRab+0.5,0.5)});
        bb_pillAt(ctx,760,800,"Learning: connections that change",t,tLearn+0.2,null);});
      bb_tagS(ctx,S,"Montreal · 1949",ag_in(t,tHebb+0.4,0.5)*(1-ag_in(t,tRab-0.5,0.4)),BB_UNDER);
      bb_tagS(ctx,S,"Oslo · 1973",ag_in(t,tRab+0.1,0.5),BB_UNDER);}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);
  bb_kickShots(ctx,t,shots,si,[[1,0.35]],ag_in(t,0.2,0.8));
  const ta=ag_in(t,tFires-0.2,0.5)*(1-ag_in(t,tSame+2.6,0.5));if(ta>0)bb_trace(ctx,1320,96,520,250,clamp((t-tr0)/(tr1-tr0),0,1),{title:"All or nothing",ev:EV,k:ag_spr(t,tFires-0.2,0.5),a:ta});});

/* ================================================================ 4 · Nature's trials */
// how many nerve cells each animal has, on a card at the top right, one after another
function bb_counter(ctx,t,list){for(const [a0,a1,title] of list){const a=ag_in(t,a0,0.4)*(1-ag_in(t,a1,0.4));if(a>0)ag_textCard(ctx,1450,60,420,{kick:"Nerve cells",title},{a,kickCol:AG.kick,k:Math.min(1,ag_spr(t,a0,0.5))});}}
// the inset over the sea slug: its big nerve cells; then, as it learns, a connection that grows stronger
function bb_slugInset(ctx,t,tBig,tConn,a){if(a<=0)return;const cx=1580,cy=470,r=180;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,cx,cy,lerp(0.6,1,clamp(ag_spr(t,tBig-0.2,0.5),0,1.2)));
  const sw=ag_in(t,tConn-0.4,0.6);if(sw<1)withA(ctx,1-sw,()=>bb_bigCells(ctx,cx,cy,r,ag_in(t,tBig-0.2,1.6)));
  if(sw>0)withA(ctx,sw,()=>bb_lens(ctx,cx,cy,r,c=>{const g=c.createRadialGradient(cx+r*0.3,cy-r*0.3,10,cx,cy,r);g.addColorStop(0,"rgb(240,230,206)");g.addColorStop(1,"rgb(206,190,160)");c.fillStyle=g;c.fillRect(cx-r,cy-r,r*2,r*2);
    const k=ag_in(t,tConn+0.3,1.4);c.save();ag_about(c,cx,cy+10,lerp(0.95,1.2,k));bb_miniSyn(c,cx,cy+10,0.95,"excite",lerp(0.25,1,k),t);c.restore();},{rim:16}));ctx.restore();}

scene("animals",(ctx,S,t,sc)=>{const C=sc.cues;
  const t600=wAt(sc,"long","six hundred million"),tJelly=C.jelly,tNet=wAt(sc,"jelly","a net of nerve cells"),tFood=wAt(sc,"jelly","catch food");
  const tSlug=C.slug,t20=wAt(sc,"slug","about twenty thousand"),tBig=wAt(sc,"slug","big enough to see"),tKandel=C.kandel,tConn=wAt(sc,"kandel","its connections change");
  const tBee=C.bee,tMil=wAt(sc,"bee","about a million"),tSes=wAt(sc,"bee","smaller than a sesame seed"),tDance=C.dance,tCol=wAt(sc,"dance","colours"),tSc=wAt(sc,"dance","scents"),tHome=wAt(sc,"dance","the way home"),tDn=wAt(sc,"dance","and dance");
  const tOct=C.octopus,tHalf=wAt(sc,"octopus","about half a billion"),tTwo=wAt(sc,"octopus","two thirds"),tArm=wAt(sc,"octopus","each arm"),tTaste=wAt(sc,"octopus","taste on its own");
  const tFinch=C.finch,tFather=wAt(sc,"finch","from its father"),tPract=wAt(sc,"finch","practising"),tHuman=C.human,t86=wAt(sc,"human","eighty-six billion"),tTril=wAt(sc,"human","a hundred trillion"),tWatts=C.watts,t20w=wAt(sc,"watts","twenty watts");
  const shots=[
    // the sea: a jellyfish, no brain, just a net of nerve cells; it swims and catches food. Down to the sea floor: a sea slug
    {at:0,place:"bbSea",keys:[[0,960,470,1.05],[tSlug-0.8,900,780,1.6]],d:1.9,push:0.01,draw(ctx,t){
      bb_jelly(ctx,980-40*Math.sin(t*0.2),400-t*5,0.72,t,{net:ag_in(t,tNet-0.2,1.0),food:clamp((t-tFood+0.3)/2.4,0,1)});
      bb_slug(ctx,860,884,0.62,t);
      bb_scr(ctx,S,()=>{bb_pillAt(ctx,960,190,"More than 600 million years",t,t600-0.2,tJelly+0.4);
        bb_slugInset(ctx,t,tBig,tConn,ag_in(t,tBig-0.2,0.4)*(1-ag_in(t,tBee-0.8,0.4)));});
      bb_tagS(ctx,S,"New York · the 1970s",ag_in(t,tKandel+0.2,0.5)*(1-ag_in(t,tBee-0.8,0.4)),BB_UNDER);}},
    // a meadow: a honeybee, a million nerve cells in a brain smaller than a sesame seed; it learns colours, scents, the way home, and dances
    {at:tBee-0.4,place:"bbMeadow",keys:[[0,960,540,1.0],[tDance,1000,520,1.06]],d:2.4,push:0.02,draw(ctx,t){
      const u=ag_sine(ag_in(t,tBee-0.4,2.4)),bx=lerp(1560,906,u)+Math.sin(t*3)*10*(1-u),by=lerp(260,524,u)+Math.sin(t*4.3)*8*(1-u),fly=1-ag_in(t,tBee+2.0,0.5);
      bb_bee(ctx,bx,by,0.55,t,{fly});
      bb_seedBrain(ctx,110,190,ag_in(t,tSes-0.3,0.4)*(1-ag_in(t,tDance-0.4,0.5)),Math.min(1,ag_spr(t,tSes-0.3,0.5)));
      bb_pillAt(ctx,330,800,"Colours",t,tCol-0.1,tOct-0.9);bb_pillAt(ctx,600,800,"Scents",t,tSc-0.1,tOct-0.9);bb_pillAt(ctx,900,800,"The way home",t,tHome-0.1,tOct-0.9);
      bb_scr(ctx,S,()=>bb_combView(ctx,1440,520,250,(t-tDn)*1.1,t,ag_in(t,tDn-0.3,0.5)*(1-ag_in(t,tOct-0.9,0.4))));}},
    // a reef: an octopus, half a billion, two thirds of them in its arms; each arm tastes on its own
    {at:tOct-0.4,place:"bbReef",keys:[[0,960,560,1.02],[tArm,1060,600,1.12]],d:2.0,push:0.02,draw(ctx,t){bb_shell(ctx,1330,652,0.9);
      bb_octopus(ctx,820,700,0.85,t,{glow:ag_in(t,tTwo-0.2,1.0),reach:ag_sine(ag_in(t,tArm-0.3,1.6)),taste:ag_in(t,tTaste,0.8)});
      bb_scr(ctx,S,()=>bb_pillAt(ctx,900,190,"Two thirds in its arms",t,tTwo,tFinch-0.6));}},
    // a branch: a young zebra finch learns its song from its father, practising for weeks
    {at:tFinch-0.4,place:"bbBranch",keys:[[0,960,520,1.0],[tPract,1000,500,1.06]],d:2.4,push:0.02,draw(ctx,t){
      const fs=ag_io(t,tFather-0.4,tFather+2.2,0.3),ys=ag_io(t,tPract-0.2,tHuman-0.6,0.3),wob=lerp(1,0.25,ag_in(t,tPract+0.4,2.6));
      bb_finch(ctx,700,550,1.1,{open:fs*(0.5+0.5*Math.sin(t*11))});bb_finch(ctx,1300,530,1.0,{young:true,flip:true,open:ys*(0.5+0.5*Math.sin(t*9.3))});
      bb_song(ctx,836,460,t,{dir:1,a:fs});bb_song(ctx,1176,450,t,{dir:-1,wob,a:ys,alpha:0.85});}},
    // and a human brain: about 86 billion, more than a hundred trillion connections, on about 20 watts
    {at:tHuman-0.4,place:"bbBrain",keys:[[0,960,520,1.0],[tWatts,1080,480,1.04]],d:2.4,push:0,draw(ctx,t){bb_brainLights(ctx,t,ag_in(t,tHuman+0.3,1.2));
      bb_pillAt(ctx,700,820,"More than 100 trillion connections",t,tTril-0.2,null);
      const ba=ag_in(t,tWatts-0.3,0.5);bb_bulb(ctx,1600,430,0.9,ag_in(t,t20w,0.8),ba);bb_pillAt(ctx,1600,690,"About 20 watts",t,t20w,null);}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kickShots(ctx,t,shots,si,[[0,0.5],[0,0.45],[0,0.5],[0,0.35],[1,0.45]]);
  bb_counter(ctx,t,[[tJelly+0.4,tSlug-0.5,"A net, no brain"],[t20-0.2,tBee-0.5,"About 20,000"],[tMil-0.2,tOct-0.5,"About 1 million"],[tHalf-0.2,tFinch-0.5,"About half a billion"],[t86-0.2,1e9,"About 86 billion"]]);});

/* ================================================================ 5 · Filling the gaps */
scene("gaps",(ctx,S,t,sc)=>{const C=sc.cues;
  const tGuess=C.guess,tNerve=wAt(sc,"blind","the nerve leaves"),tNo=wAt(sc,"blind","no cells to catch light"),tSpot=wAt(sc,"blind","a blind spot"),tNever=C.never,tHole=wAt(sc,"never","a hole there"),tIn=wAt(sc,"never","fills it in");
  const shots=[
    // an eye cut in half: light from a candle through the lens onto the lining at the back; where the nerve leaves, nothing catches it
    {at:0,place:"bbEye",keys:[[0,960,500,1.0],[tNerve-0.3,1180,520,1.32],[tNever-0.4,1000,500,1.0]],d:1.8,push:0,draw(ctx,t){bb_flame(ctx,200,480,1.2,t);
      bb_eyeLight(ctx,t,{u:ag_in(t,tGuess+0.4,1.6),blind:ag_in(t,tNo-0.2,1.2)});
      bb_pillAt(ctx,1440,440,"The nerve to the brain",t,tNerve,tNever-0.6);bb_pillAt(ctx,1119,640,"Blind spot",t,tSpot-0.1,tNever-0.6);}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kick(ctx);
  // what you'd see if nothing filled it: a hole in the pattern; and what you see: the pattern, filled in from round it
  const ca=ag_in(t,tHole-0.6,0.5);if(ca>0){ctx.save();ctx.globalAlpha*=ca;ag_about(ctx,1480,370,lerp(0.6,1,clamp(ag_spr(t,tHole-0.6,0.5),0,1.2)));
    ag_box(ctx,1180,170,600,400,22,{});bb_cloth(ctx,1206,196,548,348,{fill:ag_in(t,tIn-0.1,1.4),r:66});ctx.restore();}});

/* ================================================================ 6 · Borrowed, not copied */
const BB_C43=bb_cell(1943,{x:520,y:470,r:22,reach:170,dirs:6,depth:3,wig:0.4,spines:true,axon:{ang:0.05,len:190,bend:0.2,ends:3,endLen:40},axW:7});
const BB_ARC43=bb_smooth([[560,330],[720,240],[930,236],[1110,320]],8);
// a sheet's heading in ink, that changes: the old one fades before the new one comes
function bb_heading(ctx,t,list){for(const [a0,a1,s] of list){const a=ag_in(t,a0,0.5)*(1-ag_in(t,a1,0.4));if(a>0)ag_T(ctx,s,960,206,{w:700,size:34,align:"center",col:BB.inkSoft,a});}}

scene("borrowed",(ctx,S,t,sc)=>{const C=sc.cues;
  const tUnit=wAt(sc,"unit","a simple unit"),tDrew43=wAt(sc,"unit","drew"),tAdds=C.adds,tFire=wAt(sc,"adds","fires if the total"),tW=C.weights,tNud=wAt(sc,"weights","nudged"),tHebbs=wAt(sc,"weights","like Hebb's links");
  const tEdges=C.edges,tAngle=wAt(sc,"edges","fire for edges"),tFeed=C.feed,tLayers=C.layers,tToday=C.today,tBill=wAt(sc,"today","billions of weights"),tCopy=C.copy,tIdea=wAt(sc,"copy","an idea");
  const tComplex=C.complex,t2021=wAt(sc,"complex","twenty twenty-one"),tMimic=wAt(sc,"complex","five to eight layers"),tChild=C.child,tFew=wAt(sc,"child","a few examples"),tMany=wAt(sc,"child","a great many");
  const tWing=C.wing,tBorrW=wAt(sc,"wing","borrowed the wing"),tFlap=wAt(sc,"wing","not the flapping");
  const ang=tt=>0.35+0.95*Math.sin((tt-tEdges)*0.85);
  const shots=[
    // 1943: Cajal's cell, drawn as a unit that adds up its inputs and fires past a set level; 1958: weights, nudged as it learns
    {at:0,place:"bbSheet",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){
      bb_heading(ctx,t,[[0.6,tW-0.2,"McCulloch and Pitts · 1943"],[tW+0.3,1e9,"Rosenblatt · 1958"]]);
      bb_drawCell(ctx,BB_C43,{ink:true,u:ag_in(t,0.3,1.4)});bb_inkArrow(ctx,BB_ARC43,ag_in(t,tDrew43-0.1,0.9),4,1);
      const ins=[0,1,2].map(i=>{const v=(t-tAdds-0.1-i*0.22)/0.8;return v>0&&v<1?v:null;}),arrived=[0,1,2].reduce((s,i)=>s+0.3*ag_in(t,tAdds+0.7+i*0.22,0.3),0);
      const fire=clamp((t-tFire-0.2)/0.9,0,1),wa=ag_in(t,tW+0.1,0.6),nud=ag_sine(ag_in(t,tNud,1.2));
      bb_mcp(ctx,1230,470,{r:76,vals:[1,1,1],on:ins,fill:arrived,level:0.62,fire:fire>0&&fire<1?fire:0,gauge:1-ag_in(t,tW-0.4,0.5),
        wts:[lerp(0.8,0.9,nud),lerp(0.3,0.5,nud),lerp(-0.5,-0.3,nud)],wa,u:ag_in(t,tUnit-0.3,1.4),glow:0.3*ag_in(t,tFire+1.0,0.5)*(1-ag_in(t,tW,0.5))});}},
    // Baltimore, 1959: a cell in a cat's brain that fires for an edge at one angle
    {at:tEdges-0.4,keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){bb_lab1959(ctx,t,{ang:ang(t)});
      bb_spikes(ctx,1080,660,640,200,t,ang,0.35,{title:"One cell",a:ag_in(t,tAngle-0.5,0.5)});
      bb_tagS(ctx,S,"Baltimore · 1959",ag_in(t,tEdges+0.3,0.6),BB_UNDER);}},
    // edges feed shapes; networks that read pictures borrowed the layers; today's models: weighted inputs, billions of weights;
    // an idea, not a brain; one real cell takes a network of five to eight layers; a child, a few examples; a model, a great many
    {at:tFeed-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){
      const la=1-ag_in(t,tToday-0.5,0.6),sig=t<tLayers?0.9+((t-tFeed)*1.0)%1.8:((t-tLayers)*1.1)%3.6;
      bb_layers(ctx,960,480,{u:ag_in(t,tFeed-0.2,1.2),more:ag_in(t,tLayers-0.2,1.0),sig,a:la});
      const ma=ag_in(t,tToday-0.2,0.6)*(1-ag_in(t,tComplex-0.5,0.6));bb_model(ctx,360,500,110,t,{a:ma,core:0.6,think:0.3,floor:720});
      bb_weights(ctx,680,300,1020,360,t,ag_in(t,tBill-0.6,0.8)*(1-ag_in(t,tCopy-0.4,0.5)));
      bb_pillAt(ctx,1190,740,"Billions of weights, set by training",t,tBill,tCopy-0.4);
      const ca=ag_in(t,tCopy,0.5)*(1-ag_in(t,tComplex-0.5,0.6));bb_framed(ctx,1180,300,440,327,ca,ag_spr(t,tCopy,0.5),{img:bb_brainPic()});
      if(ca>0)ag_T(ctx,"≠",800,540,{w:700,size:96,align:"center",col:AG.mut,a:ag_in(t,tIdea-0.3,0.5)*(1-ag_in(t,tComplex-0.5,0.6))});
      bb_oneCell(ctx,960,470,{t,cell:ag_in(t,tComplex,1.4),eq:ag_in(t,tMimic-0.6,0.5),net:ag_in(t,tMimic-0.4,1.4),sig:t>tMimic+1?((t-tMimic-1)*1.6)%7:null,a:ag_in(t,tComplex-0.2,0.5)*(1-ag_in(t,tChild-0.5,0.5))});
      bb_tagS(ctx,S,"Jerusalem · 2021",ag_in(t,t2021-0.2,0.5)*(1-ag_in(t,tChild-0.5,0.5)),BB_UNDER);
      bb_examples(ctx,960,470,{kA:ag_in(t,tFew-0.6,1.6),kB:ag_in(t,tMany-0.4,1.6),a:ag_in(t,tChild-0.2,0.5),k:Math.min(1,ag_spr(t,tChild-0.2,0.5))});}},
    // like a plane: it borrowed the wing, but not the flapping
    {at:tWing-0.4,place:"bbSky",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){
      bb_buzzard(ctx,560,400+10*Math.sin(t*2),1.0,{flap:Math.sin(t*5.5)*(0.6+0.4*ag_in(t,tFlap-0.4,0.6)),roll:-0.04});
      bb_plane(ctx,1360,400,0.95,{wing:ag_in(t,tBorrW-0.2,0.6)});
      bb_pillAt(ctx,560,640,"A bird",t,tWing+0.1,null);bb_pillAt(ctx,1360,680,"A plane",t,tWing+0.4,null);}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kickShots(ctx,t,shots,si,[[1,0.3],[1,0.2],[0,0],[0,0.35]]);});

/* ================================================================ 7 · Likely words */
const BB_PROMPT="A bee tells the hive where food is by".split(" ");
// the sentence the model is writing: its words so far (n of them, the last fading in), and a slot for the next, with a word in it
function bb_prompt(ctx,x,y,n,wd,wa,a){if(a<=0)return;const f={w:700,size:36},sp=ag_tw(ctx," ",f);ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,1040,138,22,{});ag_T(ctx,"THE MODEL WRITES",x+28,y+50,{w:700,size:28,ls:4,col:BB_VI});
  let xx=x+28;const yy=y+104;BB_PROMPT.forEach((s,i)=>{const k=clamp(n-i,0,1);if(k>0)ag_T(ctx,s,xx,yy,{w:700,size:36,a:k});xx+=ag_tw(ctx,s,f)+sp;});
  const sa=clamp(n-BB_PROMPT.length,0,1);if(sa>0){ctx.fillStyle=rgba(BB_VI,0.6*sa);rr(ctx,xx,yy+12,200,5,2.5);ctx.fill();if(wd&&wa>0)ag_T(ctx,wd,xx,yy,{w:700,size:36,col:BB_VI,a:wa*sa});}
  ctx.restore();}
// spins of the wheel, in order: {t0, d, i (the slice it lands on), rows (the chances then)}; returns the wheel's turn and the slice landed on
function bb_spin(t,list){let rot=0,pick=null;for(const s of list){if(t<s.t0)break;const base=bb_wheelTo(s.rows,s.i,0);let to=base;while(to<rot+TAU*2.5)to+=TAU;
  const u=clamp((t-s.t0)/s.d,0,1),from=rot;rot=from+(to-from)*(1-Math.pow(1-u,3));pick=u>=1?s.i:null;if(u<1)break;}return{rot,pick};}
// many people asking at once: small cards with a question mark, coming in to the model from the left
function bb_asks(ctx,t,t0,mx,my,a){if(a<=0)return;for(let i=0;i<9;i++){const u=clamp((t-t0-i*0.32)/1.3,0,1);if(u<=0||u>=1)continue;const e=ag_sine(u),sy=500+((i*137)%5)*70,x=lerp(90,mx-70,e),y=lerp(sy,my,e)-Math.sin(Math.PI*e)*50,k=lerp(1,0.7,e);
  // each comes in from the left edge of the frame, faded in, and goes into the model
  ctx.save();ctx.globalAlpha*=a*ag_in(u,0,0.25)*(1-ag_in(u,0.8,0.2));ag_about(ctx,x,y,k);ag_box(ctx,x-60,y-36,120,72,18,{});ag_T(ctx,"?",x,y+14,{w:800,size:40,align:"center",col:AG.mut});ctx.restore();}}

scene("likely",(ctx,S,t,sc)=>{const C=sc.cues;
  const tOne=C.one,tWords=wAt(sc,"one","one word at a time"),tChance=C.chance,tEvery=wAt(sc,"chance","every word it knows"),tBee=C.bee,tDanc=wAt(sc,"bee","dancing"),tBuzz=wAt(sc,"bee","buzzing");
  const tWheel=C.wheel,tSpin=wAt(sc,"wheel","spinning a wheel"),tNot=wAt(sc,"wheel","but not always"),tAgain=C.again,tDiff=wAt(sc,"again","a different answer"),tEarly=wAt(sc,"again","one word changes");
  const tDial=C.dial,tLow=wAt(sc,"low","Turned down"),tWins=wAt(sc,"low","almost always wins"),tHigh=wAt(sc,"high","Turned up"),tVary=wAt(sc,"high","answers vary more"),tWrong=wAt(sc,"high","more often go wrong");
  const tZero=wAt(sc,"zero","right down"),tStays=wAt(sc,"zero","a little chance stays"),tBusy=C.busy,tSums=wAt(sc,"busy","its sums"),tHair=wAt(sc,"busy","a hair different"),tTip=wAt(sc,"busy","tip a close choice"),br=C.breath;
  // the temperature, and the chances it gives; when many ask at once, a close choice between two words
  const T=ag_keys(t,[[0,1],[tLow-0.2,1],[tLow+1.0,0.35],[tHigh-0.2,0.35],[tHigh+1.2,2.2],[tZero-0.3,2.2],[tZero+0.9,0.08],[tBusy-0.2,0.08],[tBusy+0.8,1]]);
  const hair=ag_in(t,tHair,0.4),tie=ag_in(t,tBusy+0.2,1.0),TIE=[["dancing",46-0.9*hair],["buzzing",5],["waggling",45+0.9*hair],["flying",2],["singing",1]];
  const rowsAt=(TT,tb)=>{const r=bb_temper(BB_NEXT,TT);if(tb>0)r.forEach((q,i)=>{q[1]=lerp(q[1],TIE[i][1],tb);});const s=r.reduce((a,q)=>a+q[1],0);r.extra=Math.max(100-s,0.7);return r;};
  const rows=rowsAt(T,tie),R1=rowsAt(1,0),RL=rowsAt(0.35,0),RH=rowsAt(2.2,0),RT=rowsAt(1,1);
  const sp=bb_spin(t,[{t0:tSpin-0.2,d:2.2,i:0,rows:R1},{t0:tNot-0.3,d:2.0,i:1,rows:R1},{t0:tWins-0.6,d:2.0,i:0,rows:RL},{t0:tVary-0.5,d:1.8,i:2,rows:RH},{t0:tWrong-0.7,d:1.6,i:4,rows:RH},{t0:tTip-1.3,d:1.8,i:2,rows:RT}]);
  const shots=[{at:0,place:"lab",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
    const think=ag_io(t,tOne,tEvery+0.6,0.4)*0.6+0.4*ag_io(t,tSpin-0.4,tAgain,0.5)+0.5*ag_io(t,tBusy,tTip+0.6,0.4);bb_model(ctx,300,640,100,t,{core:0.6+0.3*think,think,floor:770});
    // the dial: temperature
    const da=ag_in(t,tDial-0.2,0.5)*(1-ag_in(t,br-0.9,0.5));if(da>0)bb_dial(ctx,300,330,60,clamp(Math.log(T/0.08)/Math.log(2.2/0.08),0,1),{a:da,k:ag_spr(t,tDial-0.2,0.5)});
    // the sentence, word by word; the word the wheel lands on goes in its slot
    const n=clamp((t-tOne-0.3)/((tWords-tOne+0.6)/BB_PROMPT.length),0,BB_PROMPT.length+1),pa=ag_in(t,tOne+0.1,0.4)*(1-ag_in(t,tDial-0.6,0.5));
    const land=(t>tSpin+2.0&&t<tNot-0.2)?"dancing":(t>tNot+1.7&&t<tAgain-0.2)?"buzzing":null,wa=land==="dancing"?ag_io(t,tSpin+2.0,tNot-0.2,0.25):land==="buzzing"?ag_io(t,tNot+1.7,tAgain-0.2,0.25):0;
    bb_prompt(ctx,480,150,n,land,wa,pa);
    // the chances: as bars (with every other word it knows), and as a wheel
    const ba=ag_in(t,tEvery-0.4,0.6)*(1-ag_in(t,tAgain-0.6,0.5))+ag_in(t,tDial+0.6,0.6)*(1-ag_in(t,br-0.9,0.5));
    const bpick=t>tDanc-0.1&&t<tBuzz-0.1?0:t>tBuzz-0.1&&t<tWheel?1:sp.pick;
    // the numbers dim while the dial turns or a close choice tips, and the new ones come up once the bars have moved
    const chg=(t0,t1)=>ag_io(t,t0-0.15,t1,0.15),na=1-0.75*Math.max(chg(tLow-0.2,tLow+1.0),chg(tHigh-0.2,tHigh+1.2),chg(tZero-0.3,tZero+0.9),chg(tBusy-0.2,tBusy+1.2),chg(tHair,tHair+0.4));
    bb_chances(ctx,560,360,rows,{u:ag_in(t,tEvery-0.4,1.0),tail:ag_in(t,tEvery,0.6)*(1-ag_in(t,tDial,0.5)),pick:bpick,wrong:sp.pick===4?4:null,a:ba,na});
    const wh=ag_in(t,tWheel-0.2,0.5)*(1-ag_in(t,br-0.9,0.5));bb_wheel(ctx,1600,560,210,rows,sp.rot,{pick:sp.pick,wrong:sp.pick===4?4:null,a:wh,k:Math.min(1,ag_spr(t,tWheel-0.2,0.5))});
    // the same question, two answers: one word changes early on, and the rest follows
    const aa=ag_in(t,tDiff-0.4,0.4)*(1-ag_in(t,tDial-0.6,0.5)),ab=ag_in(t,tEarly-0.3,0.4)*(1-ag_in(t,tDial-0.6,0.5));
    bb_line(ctx,480,330,[["…by ",null],["dancing",BB_VI],[": its waggle points the way.",null]],{kick:"Asked once",a:aa,k:Math.min(1,ag_spr(t,tDiff-0.4,0.5))});
    bb_line(ctx,480,500,[["…by ",null],["buzzing",BB_VI],[" near the flowers.",null]],{kick:"Asked again",a:ab,k:Math.min(1,ag_spr(t,tEarly-0.3,0.5))});
    // many people at once
    bb_asks(ctx,t,tBusy-0.1,300,640,1-ag_in(t,br-0.9,0.5));}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kick(ctx);});

/* ================================================================ 8 · Sure, and wrong */
scene("sure",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath;
  const tMiss=C.missing,tLikely=wAt(sc,"missing","still writes likely words"),tBirth=C.birthday,tThree=wAt(sc,"birthday","asked three times"),tDates=wAt(sc,"birthday","three different dates"),tWrong=wAt(sc,"birthday","all wrong");
  const tOnce=C.once,tSeen=wAt(sc,"once","seen once"),tNever=wAt(sc,"once","or never"),tNoPat=wAt(sc,"once","no pattern to learn"),tTests=C.tests,tGuess=wAt(sc,"tests","reward a guess"),tIdk=wAt(sc,"tests","I don't know"),tBlank=wAt(sc,"tests","a blank never will");
  const tBrains=C.brains,tFillG=wAt(sc,"brains","fill gaps too"),tFluent=C.fluent,tChecked=wAt(sc,"fluent","a checked one");
  const ANS=[["Asked once","3 July",tLikely-0.2],["Asked again","15 June",tDates-0.5],["A third time","1 January",tDates+0.3]];
  // the camera picks up where "likely" left it (its push ends at 1.015), so the crossfade shows the lab once
  const shots=[{at:0,place:"lab",keys:[[0,960,540,1.015]],push:0.015,draw(ctx,t){
    bb_model(ctx,300,640,100,t,{core:0.6,think:0.5*ag_io(t,tMiss,tWrong,0.5),floor:770});
    // the question, and three different dates, all wrong
    const qa=ag_in(t,tMiss+0.3,0.4)*(1-ag_in(t,tOnce-0.4,0.5));bb_cardAt(ctx,480,150,720,{kick:"A question",title:"The researcher's birthday?"},t,tMiss+0.3,tOnce-0.4,BB_K);
    const wr=ag_in(t,tWrong-0.1,0.5);ANS.forEach(([kick,date,t0],i)=>{const x=480+i*330,a=ag_in(t,t0,0.4)*(1-ag_in(t,tOnce-0.4,0.5));if(a<=0)return;
      const b=ag_textCard(ctx,x,330,300,{kick,title:date},{a,k:Math.min(1,ag_spr(t,t0,0.5)),kickCol:wr>0.5?AG.amber:BB_VI,edge:wr>0?AG.amber:null,edgeA:0.75*wr});bb_cross(ctx,x+258,372,12,a*wr);});
    // a fact seen once, or never: no pattern to learn
    const pa=ag_in(t,tOnce-0.2,0.5)*(1-ag_in(t,tTests-0.4,0.5));bb_pages(ctx,600,330,{u:ag_in(t,tOnce-0.2,1.0),mark:ag_in(t,tSeen-0.2,0.4)*(1-ag_in(t,tNever,0.6)),a:pa});
    bb_pillAt(ctx,1360,480,"No pattern to learn",t,tNoPat-0.1,tTests-0.4);
    // tests that reward a guess over "I don't know"
    bb_test(ctx,560,240,{g:ag_in(t,tGuess-0.2,0.4),b:ag_in(t,tIdk-0.2,0.4),a:ag_in(t,tTests-0.2,0.4)*(1-ag_in(t,tBrains-0.4,0.5)),k:Math.min(1,ag_spr(t,tTests-0.2,0.5))});
    // brains fill gaps too, as surely
    const fa=ag_in(t,tBrains-0.2,0.5)*(1-ag_in(t,tFluent-0.4,0.5));bb_framed(ctx,660,230,560,340,fa,ag_spr(t,tBrains-0.2,0.5),{draw:(c,x,y,w,h)=>bb_cloth(c,x,y,w,h,{fill:ag_in(t,tFillG-0.2,1.4),r:60})});
    if(fa>0)ag_T(ctx,"Filled in, from round it",940,672,{w:600,size:30,align:"center",col:AG.mut,a:fa});
    // a fluent answer isn't a checked one
    const ea=ag_in(t,tFluent-0.2,0.5)*(1-ag_in(t,br-0.6,0.5));
    bb_answer(ctx,480,260,520,"Born on 15 June.",{kick:"Fluent",wrong:true,a:ea,k:Math.min(1,ag_spr(t,tFluent-0.2,0.5))});
    ag_evidence(ctx,1110,260,600,{kick:"Checked",title:"Looked up, not guessed"},[{kick:"Source",title:"Staff records",col:AG.orange},{kick:"Check",title:"Date matches",col:AG.green}],
      {open:ag_in(t,tChecked-0.4,1.2),a:ag_in(t,tChecked-0.8,0.5)*(1-ag_in(t,br-0.6,0.5)),k:Math.min(1,ag_spr(t,tChecked-0.8,0.5)),kickCol:AG.green,edge:AG.green});
    bb_tagS(ctx,S,"A study · 2025",ag_in(t,tBirth+0.3,0.5)*(1-ag_in(t,tOnce-0.4,0.5)),BB_UNDER);}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kick(ctx);});

/* ================================================================ 9 · A picture that held */
const BB_HELD=[{x:620,n:3,y:470,dy:140},{x:960,n:4,y:470,dy:115},{x:1300,n:2,y:470,dy:140}];
scene("held",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath;
  const tCheck=wAt(sc,"held","others could check it"),tGap=C.gap,tEM=wAt(sc,"gap","electron microscopes"),tShowed=wAt(sc,"gap","showed the gap"),tWide=wAt(sc,"gap","twenty millionths");
  const tBuilt=C.built,tUnits=wAt(sc,"built","simple units"),tConn=wAt(sc,"built","connections that change"),tFill=C.fill,tDiff=wAt(sc,"fill","a little differently"),tChk=C.check,tEv=wAt(sc,"check","against the evidence"),tCajal=wAt(sc,"check","as Cajal's drawings"),tNext=C.next,tLoop=wAt(sc,"next","in a loop");
  const R1=bb_temper(BB_NEXT,1);R1.extra=2;
  const sp=bb_spin(t,[{t0:tFill+0.2,d:1.6,i:0,rows:R1},{t0:tDiff-0.6,d:1.5,i:1,rows:R1},{t0:tDiff+1.1,d:1.4,i:2,rows:R1}]);
  const WORDS=["dancing","buzzing","waggling"];
  const shots=[
    // the drawing, checked: in Berlin, 1889, and in the 1950s by electron microscopes, which showed the gap
    {at:0,place:"bbSheet",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){bb_drawing(ctx,1,1,1,1);
      bb_pillAt(ctx,640,190,"Berlin · 1889",t,tCheck-0.2,null,{icon:"tick",col:AG.green});
      const em=ag_eo(ag_in(t,tEM-0.3,1.0)),ea=ag_in(t,tEM-0.3,0.3);bb_em(ctx,1060+(1-em)*900,300,500,289,{a:ea,mark:ag_in(t,tWide-0.4,0.6)});
      const la=ag_in(t,tShowed,0.6);if(la>0){ctx.save();ctx.globalAlpha*=la;ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(BB.inkSoft,0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(BB_DJ[0]+18,BB_DJ[1]);ctx.lineTo(1024,440);ctx.stroke();ctx.restore();}
      bb_pillAt(ctx,1130,190,"Electron microscope · 1950s",t,tShowed-0.2,null,{icon:"tick",col:AG.green});
      bb_pillAt(ctx,1310,680,"About 20 millionths of a millimetre",t,tWide-0.1,null);}},
    // models are built on that picture; they fill gaps with what's likely, a little differently each time; check them against the
    // evidence, as his drawings were checked; next: a model that reasons, with hands, in a loop
    {at:tBuilt-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      const na=ag_in(t,tBuilt-0.2,0.6)*(1-ag_in(t,tFill-0.4,0.5));
      bb_net(ctx,BB_HELD,{r:30,u:ag_in(t,tBuilt-0.2,1.9),sig:t<tUnits?null:((t-tUnits)*0.9)%2.8,a:na,alpha:0.5,w:(i,j,k)=>1.6+3.4*(0.5+0.5*Math.sin(t*0.9*ag_in(t,tConn-0.3,1)+i*1.7+j*1.3+k*0.7))});
      // the model moves to the middle for its loop
      const mv=ag_sine(ag_in(t,tNext-0.6,1.6)),mx=lerp(300,960,mv),my=lerp(640,470,mv),la=ag_in(t,tNext+0.9,0.2);
      const ma=ag_in(t,tFill-0.4,0.6);if(la<1)bb_model(ctx,mx,my,lerp(100,88,mv),t,{a:ma*(1-la),core:0.6,think:0.4*ag_io(t,tFill,tChk,0.5),floor:lerp(770,700,mv)});
      // the loop goes before the end card comes up over it
      if(la>0)ag_loop(ctx,960,470,{t,R:180,r:88,p:ag_in(t,tNext+0.9,1.8),core:0.7,think:0.3,a:la*(1-ag_in(t,br-0.4,0.9)),label:null});
      // a little differently each time
      const wa=ag_in(t,tFill-0.2,0.5)*(1-ag_in(t,tChk-0.5,0.5));bb_wheel(ctx,1000,500,170,R1,sp.rot,{pick:sp.pick,a:wa,k:Math.min(1,ag_spr(t,tFill-0.2,0.5))});
      const w=sp.pick==null?null:WORDS[sp.pick];bb_line(ctx,1240,440,[["…by ",null],[w||"______",w?BB_VI:AG.mut,w?1:0.7],[".",null]],{kick:"The model",w:420,a:wa});
      // checked against the evidence, as his drawings were
      const ca=ag_in(t,tEv-0.6,0.5)*(1-ag_in(t,tNext-0.6,0.5));
      ag_evidence(ctx,500,220,560,{kick:"The model",title:"A likely answer"},[{kick:"Source",title:"The records",col:AG.orange},{kick:"Check",title:"It matches",col:AG.green}],{open:ag_in(t,tEv-0.2,1.2),a:ca,k:Math.min(1,ag_spr(t,tEv-0.6,0.5))});
      const pa=ag_in(t,tCajal-0.4,0.5)*(1-ag_in(t,tNext-0.6,0.5));bb_framed(ctx,1220,240,500,298,pa,ag_spr(t,tCajal-0.4,0.5),{img:bb_drawingPic()});
      bb_pillAt(ctx,1470,640,"Checked",t,tCajal+0.4,tNext-0.6,{icon:"tick",col:AG.green});}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kickShots(ctx,t,shots,si,[[1,0.3],[0,0]],1-ag_in(t,br-0.4,0.5));
  ag_end(ctx,S,t,br,BB_TITLE,"A likely answer isn't a checked one.","Film 2 of 10");});

// chapters that open on a cut: Borrowed, not copied opens on paper, as Filling the gaps ends on it
ag_cutInto(["borrowed"]);

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
