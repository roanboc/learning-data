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

// Borrowed rights, film 2 of 7 of From helper to colleague, the third series of the module on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"frank":{"name":"A name that travels free","lead":1.4,"tail":1.0,"vo":[
 {"id":"britain","gap":0.8,"text":"Britain, in the 1700s.","say":"Britain, in the seventeen hundreds."},
 {"id":"folded","gap":0.8,"text":"A letter is a folded sheet, sealed with wax, and the person who receives it pays."},
 {"id":"costs","gap":0.8,"text":"The further it travels, and the more sheets it holds, the more it costs."},
 {"id":"member","gap":0.8,"text":"But a member of parliament may send his letters free."},
 {"id":"frank","gap":0.8,"text":"He writes his name on the cover, and the post carries it for nothing: a frank."},
 {"id":"holds","gap":0.8,"text":"So whoever holds a cover he has signed can use his privilege."},
 {"id":"family","gap":0.8,"text":"Members sign covers for family and friends."},
 {"id":"blank","gap":0.8,"text":"Signed blank covers are given away, even sold, and signatures are copied."},
 {"id":"carries","gap":0.8,"text":"The post carries free letters no member ever sent, while everyone else pays dearly for theirs."},
 {"id":"tell","gap":0.8,"text":"And nobody can tell who really sent a letter that carries a member's name."},
 {"id":"rules","gap":0.5,"text":"Rules try to narrow it."},
 {"id":"y1764","gap":0.8,"text":"From 1764, the member must write the whole address in his own hand.","say":"From seventeen sixty-four, the member must write the whole address in his own hand."},
 {"id":"y1784","gap":0.8,"text":"From 1784, the town and the date as well, the day in words, and the letter posted that same day.","say":"From seventeen eighty-four, the town and the date as well, the day in words, and the letter posted that same day."},
 {"id":"gap","gap":0.8,"text":"Still, the gap stays open: in the 1830s, about seven million letters a year travel free.","say":"Still, the gap stays open: in the eighteen-thirties, about seven million letters a year travel free."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"hill","gap":0.8,"text":"A schoolmaster, Rowland Hill, argues for a cheap post that the sender pays."},
 {"id":"parl","gap":0.5,"text":"Parliament agrees."},
 {"id":"penny","gap":0.8,"text":"On the tenth of January 1840, the penny post begins: one penny a letter, anywhere in Britain, paid by its sender.","say":"On the tenth of January eighteen forty, the penny post begins: one penny a letter, anywhere in Britain, paid by its sender."},
 {"id":"ends","gap":0.8,"text":"And franking ends."},
 {"id":"double","gap":0.8,"text":"In a year, letters more than double, from about 76 million to nearly 170 million.","say":"In a year, letters more than double, from about seventy-six million to nearly a hundred and seventy million."},
 {"id":"own","gap":0.8,"text":"A letter is cheap for everyone, and every letter pays its own way."},
 {"id":"uni","gap":0.8,"text":"Today, at the university, Jun Park's AI helper works on his sign-in, with everything Jun may do."},
 {"id":"learn","gap":0.8,"text":"Narrowed, those borrowed rights let it learn, safely, in a sandbox."},
 {"id":"name","gap":0.8,"text":"And once it works for the team, it needs a name of its own."}
]},
"start":{"name":"Where everyone starts","lead":1.4,"tail":1.2,"vo":[
 {"id":"every","gap":0.8,"text":"An AI helper in an editor or a chat starts on the sign-in of the person using it."},
 {"id":"quick","gap":0.8,"text":"It's quick: nothing to set up, and it can do whatever that person can."},
 {"id":"tickets","gap":0.8,"text":"Through 2026, Jun's helper drafted Planning's tickets for him: a new column, a filter, a new mart.","say":"Through twenty twenty-six, Jun's helper drafted Planning's tickets for him: a new column, a filter, a new mart."},
 {"id":"three","gap":0.8,"text":"The first three of the five stages all work on the person's sign-in."},
 {"id":"s1","gap":0.8,"text":"At the first, it suggests: it drafts, runs nothing, and Jun accepts or rejects every line."},
 {"id":"s2","gap":0.8,"text":"At the second, it acts for him, step by step: it runs a query or a command, and Jun allows each one."},
 {"id":"s3","gap":0.8,"text":"At the third, it acts for him within limits: it works alone, and Jun checks the result."},
 {"id":"each","gap":0.8,"text":"Each stage changes how much it may do, and what Jun does. The sign-in stays his."}
]},
"wide":{"name":"Everything Jun can do","lead":0.9,"tail":1.0,"vo":[
 {"id":"wide","gap":0.8,"text":"Jun's rights are wide: he builds the project, and he reviews and approves its code."},
 {"id":"all","gap":0.8,"text":"On his sign-in, his helper can do all of that, at every stage."},
 {"id":"friday","gap":0.8,"text":"Friday, the sixteenth of October."},
 {"id":"ticket","gap":0.8,"text":"The helper is drafting Planning's ticket for Monday's board: a new mart of teaching staff by school."},
 {"id":"waits","gap":0.8,"text":"Its change waits on a fix to the count of who teaches in each school."},
 {"id":"whose","gap":0.8,"text":"Anil Kurian's workload agent, which has a name of its own, proposed that fix."},
 {"id":"review","gap":0.8,"text":"It's in review for Jun, and its checks have passed."},
 {"id":"next","gap":0.8,"text":"The helper's next step: approve it, as Jun Park."},
 {"id":"step","gap":0.8,"text":"It's the thirty-eighth step Jun has been asked to allow that day."},
 {"id":"no","gap":0.8,"text":"He reads it, and says no."},
 {"id":"monday","gap":0.8,"text":"On Monday he reviews the fix himself, and Noor approves it for production."},
 {"id":"nobody","gap":0.8,"text":"Nobody did anything wrong: the helper was finishing its ticket, with the rights it had."},
 {"id":"record","gap":0.8,"text":"Had Jun said yes, the record would read: approved by Jun Park."}
]},
"who":{"name":"Who did what?","lead":0.9,"tail":1.0,"vo":[
 {"id":"reads","gap":0.8,"text":"On a person's sign-in, every step reads as that person's."},
 {"id":"log","gap":0.8,"text":"Jun's log says Jun, for what he did and for what his helper did."},
 {"id":"cover","gap":0.8,"text":"Like a franked cover, it can't say who really did each step."},
 {"id":"anil","gap":0.8,"text":"The workload agent once ran on Anil's personal key, and the log couldn't tell his reads from his agent's."},
 {"id":"agent","gap":0.8,"text":"Had the helper approved, an agent's change would have been approved by an agent, with a person's name on it."},
 {"id":"stop","gap":0.8,"text":"And the helper can't be narrowed or stopped on its own: to every tool, it is Jun."},
 {"id":"deputy","gap":0.3,"text":"In 1988, a computer scientist, Norm Hardy, called this a confused deputy:","say":"In nineteen eighty-eight, a computer scientist, Norm Hardy, called this a confused deputy:"},
 {"id":"purpose","gap":0.8,"text":"a program that acts for someone, with their rights, for a purpose that isn't theirs."},
 {"id":"hands","gap":0.8,"text":"And in the wrong hands, it's more dangerous still."},
 {"id":"steer","gap":0.8,"text":"Words hidden in a ticket it reads, or a stolen sign-in, could steer it to do anything Jun can, faster than any person."},
 {"id":"experts","gap":0.8,"text":"Security experts call it excessive agency: more tools, more rights, or more freedom than a job needs."}
]},
"narrow":{"name":"Narrowed","lead":0.9,"tail":1.0,"vo":[
 {"id":"least","gap":0.3,"text":"In 1975, two computer scientists, Jerome Saltzer and Michael Schroeder, wrote down the answer:","say":"In nineteen seventy-five, two computer scientists, Jerome Saltzer and Michael Schroeder, wrote down the answer:"},
 {"id":"fewest","gap":0.8,"text":"every program, and every person, should work with the fewest rights the job needs."},
 {"id":"monday","gap":0.8,"text":"From Monday, the nineteenth of October, Jun and Sam narrow what the helper borrows."},
 {"id":"dev","gap":0.8,"text":"It works in a development workspace, with tools that only read."},
 {"id":"none","gap":0.8,"text":"None of them writes outside its sandbox, approves, merges, or grants a right."},
 {"id":"sandbox","gap":0.8,"text":"Its drafts go only into a sandbox of its own: a schema of Jun's in development, and a branch."},
 {"id":"samples","gap":0.8,"text":"It sees samples of at most twenty rows, with names masked."},
 {"id":"stays","gap":0.8,"text":"And what only Jun should do stays his: approve, merge, change production, change an approved test, grant a right."},
 {"id":"page","gap":0.8,"text":"The project's page for agents now says so, for every helper on a person's sign-in."}
]},
"checked":{"name":"Allowed, then checked","lead":0.9,"tail":1.0,"vo":[
 {"id":"allow","gap":0.8,"text":"At the second stage, Jun still allows each step."},
 {"id":"setting","gap":0.8,"text":"A helper's own setting can make it ask before each step, or go on without asking."},
 {"id":"boundary","gap":0.8,"text":"One maker calls such a setting a productivity feature, not a security boundary."},
 {"id":"now","gap":0.8,"text":"So the boundary is in its tools: each step is now a read, or a draft in its sandbox."},
 {"id":"third","gap":0.8,"text":"At the third, it works alone, within a plan whose checks are set before it starts."},
 {"id":"written","gap":0.8,"text":"Its allowed and blocked actions are written on the plan, and its evidence comes with its result."},
 {"id":"against","gap":0.8,"text":"Jun checks the result against the plan's checks, and Noor approves whatever reaches production."},
 {"id":"answers","gap":0.8,"text":"At every stage, Jun owns his helper's work, and answers for it."},
 {"id":"never","gap":0.8,"text":"And an agent never approves: not its own change, and not another agent's."}
]},
"learning":{"name":"For learning, in a sandbox","lead":0.9,"tail":1.0,"vo":[
 {"id":"lucia","gap":0.8,"text":"On Monday, the second of November, Lucía Ortega joins Planning."},
 {"id":"hers","gap":0.8,"text":"Her helper starts where everyone starts: on her sign-in, with her rights, which are few."},
 {"id":"masked","gap":0.8,"text":"Names masked, nothing written to production, and narrowed the same way from her first day."},
 {"id":"learns","gap":0.8,"text":"In its sandbox, it helps her learn the project, and every draft waits for her."},
 {"id":"takeaway","gap":0.8,"text":"Borrowed rights are for learning, in a sandbox."},
 {"id":"narrowed","gap":0.8,"text":"The rules of 1764 and 1784 narrowed the frank, but a member's name still couldn't say who really sent a letter.","say":"The rules of seventeen sixty-four and seventeen eighty-four narrowed the frank, but a member's name still couldn't say who really sent a letter."},
 {"id":"paid","gap":0.8,"text":"That took every letter paying its own way."},
 {"id":"team","gap":0.8,"text":"A helper that works for the team, not beside one person, needs the same: a name of its own."},
 {"id":"planning","gap":0.8,"text":"That same Monday, Planning's tickets passed to the planning agent, a contributor with its own name, owned by Clara Jensen."},
 {"id":"map","gap":0.8,"text":"Before it took a single ticket, it was given a place on the university's map, like every colleague."},
 {"id":"next","gap":0.8,"text":"How that place is made is where this series goes next."}
]}
};

const VODUR={"frank/britain": 1.884, "frank/folded": 4.837, "frank/costs": 3.673, "frank/member": 2.78, "frank/frank": 4.367, "frank/holds": 3.392, "frank/family": 2.326, "frank/blank": 4.612, "frank/carries": 5.247, "frank/tell": 3.995, "frank/rules": 1.312, "frank/y1764": 4.574, "frank/y1784": 6.361, "frank/gap": 5.87, "frank/change": 1.288, "frank/hill": 4.506, "frank/parl": 1.093, "frank/penny": 7.539, "frank/ends": 1.059, "frank/double": 6.029, "frank/own": 3.617, "frank/uni": 6.292, "frank/learn": 3.983, "frank/name": 2.926, "start/every": 4.978, "start/quick": 3.922, "start/tickets": 6.999, "start/three": 3.695, "start/s1": 5.658, "start/s2": 6.223, "start/s3": 5.092, "start/each": 5.022, "wide/wide": 5.05, "wide/all": 3.598, "wide/friday": 1.932, "wide/ticket": 5.323, "wide/waits": 3.798, "wide/whose": 4.753, "wide/review": 2.638, "wide/next": 3.011, "wide/step": 3.319, "wide/no": 1.431, "wide/monday": 4.489, "wide/nobody": 4.743, "wide/record": 3.965, "who/reads": 3.382, "who/log": 3.79, "who/cover": 3.203, "who/anil": 6.269, "who/agent": 5.904, "who/stop": 4.639, "who/deputy": 5.294, "who/purpose": 4.225, "who/hands": 2.573, "who/steer": 7.347, "who/experts": 6.794, "narrow/least": 6.654, "narrow/fewest": 4.666, "narrow/monday": 4.719, "narrow/dev": 3.431, "narrow/none": 4.694, "narrow/sandbox": 5.899, "narrow/samples": 3.36, "narrow/stays": 6.732, "narrow/page": 4.873, "checked/allow": 2.809, "checked/setting": 4.762, "checked/boundary": 4.712, "checked/now": 5.505, "checked/third": 4.397, "checked/written": 5.332, "checked/against": 5.296, "checked/answers": 3.706, "checked/never": 4.466, "learning/lucia": 3.875, "learning/hers": 4.678, "learning/masked": 5.05, "learning/learns": 4.406, "learning/takeaway": 2.597, "learning/narrowed": 8.259, "learning/paid": 1.971, "learning/team": 5.432, "learning/planning": 7.029, "learning/map": 5.586, "learning/next": 3.024};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card after the opening, and the end card. The longer holds let a picture finish: the letter turned
   over to the address, its name written as a frank, the signed covers passing on, the copied name, the office's free letters, the
   two names nobody can tell apart, each rule written on the cover, the seven million, the penny paid and the red PAID, the stacks of
   1839 and 1840, the step that would approve as Jun, his no, the record it would have left, the log's one name, the franked cover framed on the wall, the confused deputy,
   the fewest rights, what stays Jun's, a setting that isn't a boundary, the plan's checks, the line "Borrowed rights are for learning,
   in a sandbox.", and the planning agent's place on the map. */
const BREATH={
"frank":{"hold":{"britain":0.6,"folded":0.6,"frank":1.0,"family":0.6,"blank":0.8,"carries":0.8,"tell":1.0,"y1764":0.8,"y1784":1.0,"gap":0.8,"change":1.0,"penny":0.8,"double":1.0,"own":0.6,"uni":0.6,"learn":0.4},"breathe":4.6},
"start":{"hold":{"every":0.8,"quick":0.6,"tickets":1.0,"three":1.2,"s1":0.8,"s2":1.0,"s3":1.0,"each":1.0}},
"wide":{"hold":{"wide":0.6,"friday":0.6,"ticket":0.6,"waits":0.4,"whose":0.8,"review":0.4,"next":1.0,"step":0.8,"no":1.2,"monday":0.6,"record":1.2}},
"who":{"hold":{"reads":0.8,"log":1.0,"cover":1.0,"anil":1.2,"agent":1.0,"stop":1.0,"purpose":1.0,"hands":1.0,"steer":1.2,"experts":1.0}},
"narrow":{"hold":{"fewest":1.0,"monday":0.6,"dev":0.6,"none":0.8,"sandbox":0.8,"samples":0.8,"stays":1.0,"page":0.8}},
"checked":{"hold":{"allow":0.4,"setting":0.6,"boundary":1.0,"now":1.0,"third":0.6,"written":0.8,"against":1.0,"never":0.8}},
"learning":{"hold":{"lucia":0.6,"masked":0.8,"learns":0.6,"takeaway":1.4,"narrowed":0.6,"paid":1.0,"team":0.6,"planning":0.8,"map":0.8},"breathe":6.2}
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

/* ===== Borrowed rights: the opening's own pieces =====
   Britain before 1840, drawn in the module's matte style (prefix br_), lit from the right as the lab is:
     BR_OLD       the colours of the time: laid paper, iron-gall ink, red sealing wax, mahogany, a stone-coloured paint, the post
                  office's red ink
     places       "brDesk" (a member's writing table, close up: mahogany, a leather top, the inkstand and its quill, the wax),
                  "brStudy" (his study: painted panels, a sash window, a writing table in front) and "brOffice" (the letter office:
                  its pigeonholes, an arched window, the counter), each painted once
     br_script    a line of handwriting: a pen moving on, its loops rising for the tall letters and falling for the low ones,
                  thick going down and thin going up; drawn once into a kept picture, and written on from left to right
     br_cover     a letter's cover, its back (the flaps and the wax seal) or its front (the address, the charge the receiver pays,
                  the frank: "Free" and the member's name, the town and the date of 1784's rule, the red PAID of 1840), each part
                  written on when its word is said; a cover turns over between its back and its front
     BR_P         the people of the time, dressed for it: a member of parliament (a claret coat over a cream waistcoat, a white
                  neckcloth, his grey hair tied at the nape), his sister (a white cap and a kerchief), a clerk of the letter office
                  in the 1700s (a brown coat, a white neckcloth, his hair tied back) and in the 1830s (a dark coat, a black stock),
                  and a woman who posts a letter in 1840 (her hair parted and drawn low, a shawl)
     br_pamphlet  Rowland Hill's pamphlet of 1837; br_notice the post office's notice of 1840; br_coin a penny; br_pile letters
                  in a pile, and br_stacks the two years' counts
   Words that matter are drawn live with ag_T, at least 28 px, above y 890; the handwriting is decoration, and each part of a cover
   that the story needs has a card or a pill of its own. */

const BR_OLD={paper:[238,229,208],paperDk:[214,200,172],paperEdge:[172,154,124],ink:[56,40,32],ink2:[88,62,44],wax:[146,40,36],waxHi:[200,98,84],
  wood:[104,58,40],woodDk:[58,30,20],woodHi:[156,98,66],leather:[92,54,42],gilt:[198,166,106],paint:[206,198,178],paintDk:[164,154,132],
  brass:[184,150,90],red:[172,46,40],plaster:[224,216,198],pine:[150,112,74]};

/* ---------------------------------------------------------------- wood, painted once into a place
   br_wood: boards of mahogany (or any wood) running across, their grain and figure from the room's own noise, computed at half
   size and scaled up (the grain is soft anyway); o.base, o.dk, o.hi, o.board (each board's height), o.seed */
function br_wood(c,x,y,w,h,o){o=o||{};const k=0.5,cw=Math.ceil(w*k),ch=Math.ceil(h*k),cv=mkCanvas(cw,ch),cx=cv.getContext("2d"),img=cx.createImageData(cw,ch),d=img.data,
    base=o.base||BR_OLD.wood,dk=o.dk||BR_OLD.woodDk,hi=o.hi||BR_OLD.woodHi,bh=(o.board||150)*k,sd=(o.seed||0)*53.1,R=ag_rnd(17+(o.seed||0)),tone=[];
  for(let i=0;i<40;i++)tone.push((R()-0.5)*0.16);
  for(let j=0;j<ch;j++){const b=Math.floor(j/bh),lb=j-b*bh;for(let i=0;i<cw;i++){const X=i/k,Y=j/k;
    const g=AG_NZ.fbm(X*0.0026+b*7.3+sd,Y*0.05+b*3.1,4),fig=AG_NZ.fbm(X*0.0009+b*2.9,Y*0.012+sd,3),streak=Math.pow(Math.abs(Math.sin((Y*0.21+g*9+fig*6))),6);
    let v=0.5+(g-0.5)*0.9+(fig-0.5)*0.7-streak*0.18+tone[b%40];if(lb<1.2)v-=0.45;else if(lb<2.5)v+=0.08;v=clamp(v,0,1);
    const col=v<0.5?mix(dk,base,v*2):mix(base,hi,(v-0.5)*2),p=(j*cw+i)*4;d[p]=col[0];d[p+1]=col[1];d[p+2]=col[2];d[p+3]=255;}}
  cx.putImageData(img,0,0);c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";c.drawImage(cv,x,y,w,h);c.restore();}
// a faint varnish sheen and the window's warmth over a rectangle of wood
function br_sheen(c,x,y,w,h,lx,ly,r,a){const g=c.createRadialGradient(lx,ly,0,lx,ly,r);g.addColorStop(0,"rgba(255,236,206,"+a+")");g.addColorStop(1,"rgba(255,236,206,0)");
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.fillStyle=g;c.fillRect(x,y,w,h);c.restore();}
// a mottled flat colour (paint, plaster, leather), computed small and scaled up
function br_mottle(c,x,y,w,h,base,amp,seed,fr){const k=0.25,cw=Math.ceil(w*k),ch=Math.ceil(h*k),cv=mkCanvas(cw,ch),cx=cv.getContext("2d"),img=cx.createImageData(cw,ch),d=img.data;fr=fr||0.006;
  for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){const v=(AG_NZ.fbm(i/k*fr+seed,j/k*fr+seed*0.7,4)-0.5)*amp,p=(j*cw+i)*4;d[p]=base[0]+v;d[p+1]=base[1]+v;d[p+2]=base[2]+v*0.9;d[p+3]=255;}
  cx.putImageData(img,0,0);c.save();c.imageSmoothingEnabled=true;c.drawImage(cv,x,y,w,h);c.restore();}

/* ---------------------------------------------------------------- the writing table, close up (the place "brDesk")
   Seen from above, a little tilted: mahogany boards, a leather writing top with a gilt line round it, and at the top right the
   inkstand with its quill, a stick of red wax and a brass seal (the corner tag sits at the top left, over bare leather). The
   covers, the coins and the pamphlet are drawn live on the leather. */
function br_paintDesk(c){br_wood(c,0,0,W,H,{board:170,seed:1});
  // the leather writing top
  const L={x:170,y:96,w:1580,h:930};
  ag_soft(c,cc=>ag_rect(cc,L.x,L.y,L.w,L.h,10),BR_OLD.leather,mix(BR_OLD.leather,[200,150,120],0.35),1500,200,900,"rgba(20,8,4,0.45)",30,0.5);
  c.save();c.beginPath();ag_rect(c,L.x,L.y,L.w,L.h,10);c.clip();c.globalAlpha=0.5;br_mottle(c,L.x,L.y,L.w,L.h,BR_OLD.leather,26,4.2,0.012);c.globalAlpha=1;
  const lg=c.createRadialGradient(1500,200,40,1300,420,1300);lg.addColorStop(0,"rgba(255,226,190,0.2)");lg.addColorStop(1,"rgba(255,226,190,0)");c.fillStyle=lg;c.fillRect(L.x,L.y,L.w,L.h);c.restore();
  // the gilt tooled line, and a second one inside it, worn
  c.strokeStyle=rgba(BR_OLD.gilt,0.55);c.lineWidth=2.4;c.beginPath();ag_rect(c,L.x+24,L.y+24,L.w-48,L.h-48,6);c.stroke();
  c.strokeStyle=rgba(BR_OLD.gilt,0.3);c.lineWidth=1.4;c.beginPath();ag_rect(c,L.x+34,L.y+34,L.w-68,L.h-68,4);c.stroke();
  // the leather's edge, a little proud of the wood
  c.strokeStyle="rgba(255,220,190,0.18)";c.lineWidth=2;c.beginPath();c.moveTo(L.x+10,L.y+1);c.lineTo(L.x+L.w-10,L.y+1);c.stroke();
  // the inkstand: a brass tray, a glass inkwell, a sand pot, and a quill leaning out of the frame
  br_inkstand(c,1300,24);
  // the wax and the seal, top right
  ag_floorShadow(c,1772,128,96,16,0.35);
  ag_soft(c,cc=>{cc.moveTo(1690,104);cc.lineTo(1860,86);cc.lineTo(1864,112);cc.lineTo(1694,130);cc.closePath();},BR_OLD.wax,BR_OLD.waxHi,1800,94,90,"rgba(40,0,0,0.4)",8);
  ag_floorShadow(c,1820,232,42,12,0.4);
  ag_soft(c,cc=>{cc.ellipse(1820,220,30,12,0,0,TAU);},BR_OLD.brass,[255,236,180],1832,212,30,"rgba(60,40,0,0.4)",6);
  ag_soft(c,cc=>{cc.moveTo(1804,220);cc.bezierCurveTo(1800,190,1808,160,1820,150);cc.bezierCurveTo(1832,160,1840,190,1836,220);cc.closePath();},[60,46,34],[150,120,90],1828,170,30,null);
  // the window's light from the right, and the corners in shade
  let g=c.createRadialGradient(1700,80,60,1500,300,1500);g.addColorStop(0,"rgba(255,240,214,0.22)");g.addColorStop(1,"rgba(255,240,214,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(960,560,500,960,560,1200);g.addColorStop(0,"rgba(20,10,6,0)");g.addColorStop(1,"rgba(20,10,6,0.34)");c.fillStyle=g;c.fillRect(0,0,W,H);}
function br_inkstand(c,x,y){ag_floorShadow(c,x+170,y+196,190,30,0.4);
  ag_soft(c,cc=>ag_rect(cc,x,y+40,330,150,40),BR_OLD.brass,[255,236,184],x+260,y+60,200,"rgba(60,40,0,0.45)",16);
  c.strokeStyle="rgba(90,62,20,0.5)";c.lineWidth=2;c.beginPath();ag_rect(c,x+14,y+54,302,122,30);c.stroke();
  // the inkwell: glass round a black pool
  ag_soft(c,cc=>cc.arc(x+110,y+112,50,0,TAU),[70,74,78],[220,226,230],x+128,y+92,50,"rgba(0,0,0,0.5)",10);
  c.fillStyle="#141012";c.beginPath();c.arc(x+110,y+112,26,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.5)";c.beginPath();c.ellipse(x+124,y+98,8,4,-0.6,0,TAU);c.fill();
  // the sand pot
  ag_soft(c,cc=>cc.arc(x+240,y+112,40,0,TAU),[150,112,60],[250,220,160],x+254,y+96,40,"rgba(60,30,0,0.45)",8);
  c.fillStyle="rgba(60,40,10,0.55)";for(let i=0;i<9;i++){const a=i/9*TAU;c.beginPath();c.arc(x+240+Math.cos(a)*16,y+112+Math.sin(a)*16,3,0,TAU);c.fill();}
  // the quill: a white feather from the inkwell, out past the frame's top left
  const q0=[x+110,y+112],q1=[x-30,y-90];ag_taper(c,q0,[x+80,y+70],[x+30,y-10],q1,4,2,"rgba(200,190,170,1)");
  c.save();c.translate(x+60,y+20);c.rotate(-2.2);ag_soft(c,cc=>{cc.moveTo(0,0);cc.bezierCurveTo(30,-26,120,-36,190,-16);cc.bezierCurveTo(120,6,40,14,0,0);cc.closePath();},[236,232,222],[255,255,255],120,-20,120,"rgba(80,70,60,0.3)",8);
  c.strokeStyle="rgba(150,140,124,0.6)";c.lineWidth=2;c.beginPath();c.moveTo(4,0);c.quadraticCurveTo(100,-14,186,-14);c.stroke();c.restore();}
AG_PLACES.brDesk=c=>br_paintDesk(c);

/* ---------------------------------------------------------------- the member's study (the place "brStudy")
   Painted panels in a warm stone colour with a dado rail, a sash window on the right throwing its light across, a framed landscape,
   dark floorboards, and a writing table across the front: people stand behind it and are cut at its back edge (BR_STUDY.cut). */
const BR_STUDY={cut:842,table:{x:-40,y:900,w:2000,depth:58}};
function br_panel(c,x,y,w,h){c.fillStyle=rgba(mix(BR_OLD.paint,[255,250,236],0.06),1);c.fillRect(x,y,w,h);
  // the raised panel's bevels: lit on the top and right, in shade on the bottom and left (the window is up and to the right)
  const b=16;c.fillStyle="rgba(255,250,236,0.34)";c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.lineTo(x+w-b,y+b);c.lineTo(x+b,y+b);c.closePath();c.fill();
  c.beginPath();c.moveTo(x+w,y);c.lineTo(x+w,y+h);c.lineTo(x+w-b,y+h-b);c.lineTo(x+w-b,y+b);c.closePath();c.fill();
  c.fillStyle="rgba(60,48,30,0.16)";c.beginPath();c.moveTo(x,y+h);c.lineTo(x+w,y+h);c.lineTo(x+w-b,y+h-b);c.lineTo(x+b,y+h-b);c.closePath();c.fill();
  c.beginPath();c.moveTo(x,y);c.lineTo(x,y+h);c.lineTo(x+b,y+h-b);c.lineTo(x+b,y+b);c.closePath();c.fill();
  c.strokeStyle="rgba(60,48,30,0.22)";c.lineWidth=2;c.strokeRect(x-3,y-3,w+6,h+6);}
function br_paintStudy(c,o){o=o||{};const hz=760;
  br_mottle(c,0,0,W,hz,BR_OLD.paint,10,2.1);
  // the cornice, the panels above the dado, the rail, the panels below it, the skirting
  c.fillStyle=rgba(mix(BR_OLD.paint,[255,252,240],0.2),1);c.fillRect(0,0,W,46);c.fillStyle="rgba(60,48,30,0.2)";c.fillRect(0,46,W,4);c.fillStyle="rgba(255,252,240,0.5)";c.fillRect(0,40,W,2);
  for(const [x,w] of [[60,300],[420,540],[1020,320]])br_panel(c,x,110,w,420);
  c.fillStyle=rgba(mix(BR_OLD.paint,[255,252,240],0.18),1);c.fillRect(0,566,W,22);c.fillStyle="rgba(60,48,30,0.24)";c.fillRect(0,588,W,4);c.fillStyle="rgba(255,252,240,0.55)";c.fillRect(0,566,W,2);
  for(const [x,w] of [[60,300],[420,540],[1020,320]])br_panel(c,x,612,w,110);
  c.fillStyle=rgba(mix(BR_OLD.paint,[40,30,20],0.25),1);c.fillRect(0,hz-26,W,26);
  // a framed landscape over the middle panel: dark varnish, soft hills and a sky gone amber with age, in a gilt frame
  const P={x:540,y:170,w:300,h:220};ag_floorShadow(c,P.x+P.w/2-10,P.y+P.h+18,P.w*0.5,10,0.2);
  c.save();c.shadowColor="rgba(40,26,10,0.4)";c.shadowBlur=22;c.shadowOffsetX=-8;c.shadowOffsetY=12;c.fillStyle=rgba(BR_OLD.gilt,1);c.fillRect(P.x-22,P.y-22,P.w+44,P.h+44);c.restore();
  let g=c.createLinearGradient(P.x-22,P.y-22,P.x+P.w+22,P.y+P.h+22);g.addColorStop(0,"rgba(255,236,190,0.6)");g.addColorStop(1,"rgba(90,60,20,0.5)");c.fillStyle=g;c.fillRect(P.x-22,P.y-22,P.w+44,P.h+44);
  g=c.createLinearGradient(0,P.y,0,P.y+P.h);g.addColorStop(0,"#9C8C68");g.addColorStop(0.55,"#6E6A50");g.addColorStop(1,"#3E3A2C");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);
  c.fillStyle="rgba(46,52,40,0.85)";c.beginPath();c.moveTo(P.x,P.y+150);c.bezierCurveTo(P.x+80,P.y+110,P.x+150,P.y+140,P.x+220,P.y+120);c.bezierCurveTo(P.x+260,P.y+112,P.x+290,P.y+130,P.x+P.w,P.y+126);c.lineTo(P.x+P.w,P.y+P.h);c.lineTo(P.x,P.y+P.h);c.closePath();c.fill();
  c.fillStyle="rgba(30,30,24,0.9)";c.beginPath();c.moveTo(P.x+40,P.y+170);c.bezierCurveTo(P.x+50,P.y+110,P.x+70,P.y+90,P.x+90,P.y+120);c.bezierCurveTo(P.x+100,P.y+140,P.x+96,P.y+170,P.x+92,P.y+190);c.closePath();c.fill();
  // the sash window: its deep reveal, the sky, the glazing bars, a curtain drawn back
  br_window(c,1440,64,380,580,{arch:false});
  // the floor: dark boards in perspective
  ag_floor(c,ag_oakTex(),hz,600,300);c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(150,112,86)";c.fillRect(0,hz,W,H-hz);c.restore();
  g=c.createLinearGradient(0,hz,0,hz+70);g.addColorStop(0,"rgba(30,20,10,0.35)");g.addColorStop(1,"rgba(30,20,10,0)");c.fillStyle=g;c.fillRect(0,hz,W,70);
  // the window's light: a warm fall across the wall and a pool on the floor
  g=c.createRadialGradient(1520,300,40,1400,380,1300);g.addColorStop(0,"rgba(255,246,222,0.32)");g.addColorStop(1,"rgba(255,246,222,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,20,0.22)");g.addColorStop(0.5,"rgba(40,30,20,0.04)");g.addColorStop(1,"rgba(40,30,20,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the writing table across the front
  if(!o.open)br_table(c,BR_STUDY.table.x,BR_STUDY.table.y,BR_STUDY.table.w,BR_STUDY.table.depth);}
// a window in the wall: the reveal, the sky, the bars, and the glow round it; o.arch for an arched top
function br_window(c,x,y,w,h,o){o=o||{};const r=o.arch?w/2:0,shape=cc=>{if(o.arch){cc.moveTo(x,y+r);cc.arc(x+w/2,y+r,w/2,Math.PI,0);cc.lineTo(x+w,y+h);cc.lineTo(x,y+h);cc.closePath();}else cc.rect(x,y,w,h);};
  c.save();c.shadowColor="rgba(255,248,230,0.7)";c.shadowBlur=60;c.fillStyle="#F4F0E4";c.beginPath();shape(c);c.fill();c.restore();
  // the sky: pale, warmer near the bottom
  c.save();c.beginPath();shape(c);c.clip();let g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#E6ECEE");g.addColorStop(0.7,"#F2F1EA");g.addColorStop(1,"#F6EEDC");c.fillStyle=g;c.fillRect(x,y,w,h);
  // far roofs and a chimney, soft
  c.fillStyle="rgba(160,150,140,0.35)";c.beginPath();c.moveTo(x,y+h*0.78);c.lineTo(x+w*0.3,y+h*0.74);c.lineTo(x+w*0.34,y+h*0.66);c.lineTo(x+w*0.4,y+h*0.66);c.lineTo(x+w*0.42,y+h*0.73);c.lineTo(x+w,y+h*0.7);c.lineTo(x+w,y+h);c.lineTo(x,y+h);c.closePath();c.fill();
  // the reveal on the left, in shade, and on the bottom, the sill
  c.fillStyle="rgba(120,104,80,0.45)";c.fillRect(x,y,26,h);c.fillStyle="rgba(255,250,236,0.6)";c.fillRect(x+w-14,y,14,h);
  // the glazing bars
  c.strokeStyle="rgba(232,226,212,1)";c.lineWidth=10;const cols=3,rows=o.arch?4:4;for(let i=1;i<cols;i++){c.beginPath();c.moveTo(x+w*i/cols,y);c.lineTo(x+w*i/cols,y+h);c.stroke();}
  for(let j=1;j<rows;j++){c.beginPath();c.moveTo(x,y+h*j/rows);c.lineTo(x+w,y+h*j/rows);c.stroke();}
  c.strokeStyle="rgba(120,110,96,0.35)";c.lineWidth=2;for(let i=1;i<cols;i++){c.beginPath();c.moveTo(x+w*i/cols-5,y);c.lineTo(x+w*i/cols-5,y+h);c.stroke();}
  c.restore();
  c.strokeStyle="rgba(236,230,216,1)";c.lineWidth=18;c.beginPath();shape(c);c.stroke();c.strokeStyle="rgba(90,76,60,0.3)";c.lineWidth=2;c.beginPath();shape(c);c.stroke();
  c.fillStyle="rgba(236,230,216,1)";c.fillRect(x-30,y+h,w+60,22);c.fillStyle="rgba(60,48,30,0.25)";c.fillRect(x-30,y+h+22,w+60,6);
  // a heavy curtain drawn back to the left of it, in a dull rose
  const cx0=x-150;ag_soft(c,cc=>{cc.moveTo(cx0,y-30);cc.lineTo(x+20,y-30);cc.bezierCurveTo(x-20,y+h*0.3,x-60,y+h*0.6,x-40,y+h+60);cc.lineTo(cx0+10,y+h+60);cc.bezierCurveTo(cx0-10,y+h*0.6,cx0+10,y+h*0.3,cx0,y-30);cc.closePath();},
    [140,98,90],[220,180,170],x-40,y+100,260,"rgba(40,10,6,0.45)",22);
  ag_folds(c,cc=>{cc.rect(cx0-20,y-30,w,h+100);},[[[cx0+40,y],[cx0+30,y+h*0.5],[cx0+50,y+h+50]],[[cx0+90,y],[cx0+80,y+h*0.5],[cx0+96,y+h+50]]],"rgba(60,20,16,0.3)","rgba(255,220,210,0.18)");}
// a mahogany table seen from the front: its top receding depth px, its front edge at y
function br_table(c,x,y,w,d){ag_floorShadow(c,x+w/2,y+120,w*0.5,60,0.3);
  c.save();c.beginPath();c.moveTo(x+d*0.4,y-d);c.lineTo(x+w-d*0.4,y-d);c.lineTo(x+w,y);c.lineTo(x,y);c.closePath();c.clip();br_wood(c,x,y-d,w,d,{board:400,seed:3});
  br_sheen(c,x,y-d,w,d,1500,y-d,900,0.22);c.restore();
  c.strokeStyle="rgba(255,220,190,0.3)";c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.stroke();
  c.save();c.beginPath();c.rect(x,y,w,H-y);c.clip();br_wood(c,x,y,w,H-y,{board:600,seed:5,base:mix(BR_OLD.wood,[0,0,0],0.2),hi:mix(BR_OLD.woodHi,[0,0,0],0.25)});
  const g=c.createLinearGradient(0,y,0,y+40);g.addColorStop(0,"rgba(20,10,6,0.45)");g.addColorStop(1,"rgba(20,10,6,0)");c.fillStyle=g;c.fillRect(x,y,w,40);c.restore();}
AG_PLACES.brStudy=c=>br_paintStudy(c);
// the same study, seen from further in, with the writing table out of the picture: people stand in it, and a hand may hold a cover
AG_PLACES.brStudyOpen=c=>br_paintStudy(c,{open:true});
AG_ROOMS.brStudyOpen="brStudy";

/* ---------------------------------------------------------------- the letter office (the place "brOffice")
   Plastered walls, a tall rack of pigeonholes with letters in some of them, an arched window on the right, a bare stretch of wall
   between them where the notice of 1840 is put up (drawn live), and a sorting counter along the right, where the letters are piled
   (BR_OFFICE.counter, its top's front edge at y 820). The clerk stands on the floor at the left, in front of the rack, so a hand
   that holds a letter is never cut by a counter in front of him; a woman who posts a letter stands before the notice. */
const BR_OFFICE={counter:{x:1060,y:820,w:900,depth:44},top:806,notice:{x:1210,y:118,w:330,h:430},rack:{x:80,y:96,w:1060,h:640}};
function br_paintOffice(c){const hz=780,Rk=BR_OFFICE.rack;
  br_mottle(c,0,0,W,hz,BR_OLD.plaster,12,6.3);
  c.fillStyle="rgba(60,48,30,0.16)";c.fillRect(0,hz-30,W,30);
  // the rack: stained pine, a grid of pigeonholes, dark inside, with a few letters standing in them
  ag_floorShadow(c,Rk.x+Rk.w/2,Rk.y+Rk.h+14,Rk.w*0.52,18,0.3);
  c.save();c.shadowColor="rgba(40,26,10,0.35)";c.shadowBlur=26;c.shadowOffsetX=-10;c.shadowOffsetY=14;c.fillStyle=rgba(BR_OLD.pine,1);c.fillRect(Rk.x,Rk.y,Rk.w,Rk.h);c.restore();
  c.save();c.beginPath();c.rect(Rk.x,Rk.y,Rk.w,Rk.h);c.clip();br_wood(c,Rk.x,Rk.y,Rk.w,Rk.h,{board:80,seed:7,base:BR_OLD.pine,dk:[110,78,48],hi:[190,150,104]});c.restore();
  const cols=11,rows=7,cw=(Rk.w-28)/cols,ch=(Rk.h-28)/rows,R=ag_rnd(91);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const x=Rk.x+14+i*cw+6,y=Rk.y+14+j*ch+6,w=cw-12,h=ch-12;
    const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#2E2218");g.addColorStop(1,"#4A3828");c.fillStyle=g;c.fillRect(x,y,w,h);
    c.fillStyle="rgba(255,236,200,0.16)";c.fillRect(x+w-3,y,3,h);
    // letters standing in it, leaning
    const n=R()<0.55?1+Math.floor(R()*3):0;for(let k=0;k<n;k++){const lw=w*(0.5+R()*0.3),lh=h*(0.55+R()*0.3),lx=x+4+R()*(w-lw-8),ly=y+h-lh,rot=(R()-0.5)*0.12;
      c.save();c.translate(lx+lw/2,ly+lh);c.rotate(rot);c.fillStyle=rgba(mix(BR_OLD.paper,BR_OLD.paperDk,R()*0.6),1);c.fillRect(-lw/2,-lh,lw,lh);
      c.fillStyle="rgba(60,40,20,0.18)";c.fillRect(-lw/2,-lh,lw,3);if(R()<0.4){c.fillStyle=rgba(BR_OLD.wax,0.9);c.beginPath();c.arc(0,-lh*0.5,4,0,TAU);c.fill();}c.restore();}}
  c.strokeStyle="rgba(60,40,20,0.45)";c.lineWidth=3;c.strokeRect(Rk.x+2,Rk.y+2,Rk.w-4,Rk.h-4);
  // the arched window
  br_window(c,1600,70,270,600,{arch:true});
  // the floor, and the light
  ag_floor(c,ag_oakTex(),hz,600,300);c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(170,136,104)";c.fillRect(0,hz,W,H-hz);c.restore();
  let g=c.createRadialGradient(1700,300,40,1500,400,1400);g.addColorStop(0,"rgba(255,246,222,0.3)");g.addColorStop(1,"rgba(255,246,222,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,20,0.2)");g.addColorStop(0.5,"rgba(40,30,20,0.03)");g.addColorStop(1,"rgba(40,30,20,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the sorting counter along the right
  const K=BR_OFFICE.counter;br_table(c,K.x,K.y,K.w,K.depth);}
AG_PLACES.brOffice=c=>br_paintOffice(c);

/* ---------------------------------------------------------------- handwriting
   br_script(c, x, y, w, h, seed, o) writes one line of a running hand into c, its baseline at y, h its small letters' height. The pen
   moves on at an even pace while it rises and falls, so each letter is a stroke that loops a little back on itself: the small ones
   (n, e, o, i) within h, the tall ones (l, t) rising to about 2.2 h with a loop, the low one (g) falling below the line; thick going down,
   thin going up, slanted as a running hand is, with a gap between words. o.cap starts with a capital's stem; o.flourish ends with a
   stroke back under the line; o.ink, o.slant, o.words (how many), o.thick. It's decoration: what a line says, the film says in a card. */
const BR_HAND={n:[1,0.12,0.26],e:[0.85,0.36,0.2],o:[1,0.5,0.12],i:[0.9,0.02,0.12],l:[2.25,0.34,0.13],t:[1.8,0.03,0.07],g:[-1.25,0.34,0.1]};  // rise, loop, how often
// a capital's stem, in units of h from where it starts on the line: thin up, over a small hook at the top, thick down, a curl into the next letter
const BR_CAP=[[[0.1,0],[0.4,-0.9],[0.7,-1.9],[0.95,-2.5]],[[0.95,-2.5],[1.1,-2.85],[1.45,-2.6],[1.2,-2.3]],[[1.2,-2.3],[0.9,-1.6],[0.6,-0.6],[0.55,0]],[[0.55,0],[0.5,0.25],[0.9,0.15],[1.1,-0.25]]];
function br_script(c,x,y,w,h,seed,o){o=o||{};const R=ag_rnd(seed),tn=Math.tan(o.slant==null?0.34:o.slant),ink=o.ink||BR_OLD.ink,
    thick=o.thick||Math.max(2,h*0.13),thin=Math.max(0.9,h*0.045),keys=Object.keys(BR_HAND),cum=[];let acc=0;
  for(const k of keys){acc+=BR_HAND[k][2];cum.push(acc);}
  const pick=()=>{const r=R()*acc;for(let i=0;i<keys.length;i++)if(r<=cum[i])return keys[i];return "n";};
  const nw=o.words||Math.max(1,Math.round(w/(h*4))),words=[];let total=0;
  for(let i=0;i<nw;i++){const n=3+Math.floor(R()*5),L=[];for(let k=0;k<n;k++)L.push(pick());words.push(L);total+=n;}
  const capW=o.cap?h*1.3:0,gap=h*0.95,adv=(w-capW-gap*(nw-1))/total;
  c.save();c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba(ink,0.9);
  const P=(px,py)=>[px+(y-py)*tn,py];
  let prev=null;const to=(px,py)=>{const q=P(px,py);if(prev){const dy=q[1]-prev[1],dl=Math.hypot(q[0]-prev[0],dy)||1;
      c.lineWidth=lerp(thin,thick,clamp(dy/dl*1.3,0,1));c.beginPath();c.moveTo(prev[0],prev[1]);c.lineTo(q[0],q[1]);c.stroke();}prev=q;};
  let X=x;
  if(o.cap){for(const b of BR_CAP)for(let i=prev?1:0;i<=14;i++){const u=i/14,m=1-u,
      dx=m*m*m*b[0][0]+3*m*m*u*b[1][0]+3*m*u*u*b[2][0]+u*u*u*b[3][0],dy=m*m*m*b[0][1]+3*m*m*u*b[1][1]+3*m*u*u*b[2][1]+u*u*u*b[3][1];to(X+dx*h,y+dy*h);}
    X+=capW;}
  words.forEach((L,wi)=>{if(wi>0){prev=null;X+=gap;}
    L.forEach(k=>{const [amp,loop]=BR_HAND[k],steps=k==="l"||k==="g"?26:18;
      for(let s=0;s<=steps;s++){const u=s/steps,ph=u*TAU,ex=(1-Math.cos(ph))/2*amp;to(X+adv*u-adv*loop*Math.sin(ph),y-h*ex);}
      // the i's dot and the t's bar
      if(k==="i"){const q=P(X+adv*0.5,y-h*1.7);c.fillStyle=rgba(ink,0.9);c.beginPath();c.arc(q[0],q[1],thick*0.55,0,TAU);c.fill();}
      if(k==="t"){const a=P(X-adv*0.1,y-h*1.15),b=P(X+adv*0.75,y-h*1.2);c.lineWidth=thin*1.4;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
      X+=adv;});
    if(wi===nw-1&&o.flourish){const x1=prev?prev[0]:X,span=Math.min(X-x,h*9);for(let s=1;s<=40;s++){const u=s/40,
        q=[x1+Math.sin(u*Math.PI)*h*0.7-u*span,y+h*0.35+Math.sin(u*Math.PI)*h*0.4];
        if(prev){c.lineWidth=lerp(thick*0.9,thin,u);c.beginPath();c.moveTo(prev[0],prev[1]);c.lineTo(q[0],q[1]);c.stroke();}prev=q;}}});
  c.restore();}
// a numeral 6, as the charge is written in the corner: a stroke curving down into a loop on the line
function br_numeral(c,x,y,h,ink){c.save();c.lineCap="round";c.strokeStyle=rgba(ink,0.9);c.lineWidth=h*0.16;
  c.beginPath();c.moveTo(x+h*0.95,y-h*2);c.quadraticCurveTo(x+h*0.1,y-h*1.5,x+h*0.12,y-h*0.5);c.stroke();
  c.lineWidth=h*0.09;c.beginPath();c.ellipse(x+h*0.52,y-h*0.48,h*0.42,h*0.46,0.2,Math.PI*0.95,Math.PI*0.95+TAU);c.stroke();c.restore();}

/* ---------------------------------------------------------------- a letter's cover
   Its size in its own frame: BR_CV.w by BR_CV.h. Each line of its writing is a kept picture of its own (BR_CVPARTS), written on from
   left to right as its part's p goes from 0 to 1, a line at a time: addr (the address, three lines, the post town last), charge (what
   the receiver pays, in the top right corner), frank ("Free" and the member's name, at the bottom left), date (1784's town and date,
   above the frank), copy (the same frank in another hand), paid (1840's red PAID, top right). The back shows the folded sheet's outer
   flap and the wax seal across its edge. */
const BR_CV={w:880,h:560,res:1.25};
const BR_CVPARTS={
  addr:{lines:[[300,226,430,24,11,{cap:true,words:4}],[350,298,380,24,12,{cap:true,words:3}],[470,372,250,26,13,{cap:true,words:1,flourish:true}]]},
  charge:{lines:[[748,138,60,30,21,{numeral:true}]]},
  frank:{lines:[[70,470,110,26,31,{cap:true,words:1}],[70,524,300,28,32,{cap:true,words:2,flourish:true}]]},
  date:{lines:[[70,416,300,20,41,{cap:true,words:4}]]},
  copy:{lines:[[70,470,110,26,33,{cap:true,words:1,ink:BR_OLD.ink2,slant:0.44}],[70,524,300,28,34,{cap:true,words:2,flourish:true,ink:BR_OLD.ink2,slant:0.44}]]}
};
// a line's kept picture and the stretch of the cover it covers [x0, y0, x1, y1]
function br_line(key,i){const L=BR_CVPARTS[key].lines[i],[x,y,w,h,seed,o]=L,b=[x-h*2.2,y-h*3.2,x+w+h*2.2,y+h*2],R=BR_CV.res;
  return{b,img:ag_kept("brcv:"+key+":"+i,Math.ceil((b[2]-b[0])*R),Math.ceil((b[3]-b[1])*R),c=>{c.scale(R,R);c.translate(-b[0],-b[1]);
    if(o.numeral)br_numeral(c,x,y,h,o.ink||BR_OLD.ink);else br_script(c,x,y,w,h,seed,Object.assign({},o));})};}
// the paper of a cover's front or back, kept: faint laid and chain lines, a little age at the edges; on the back, the outer flap's edge
function br_paper(side){return ag_kept("brpaper:"+side,Math.ceil(BR_CV.w*BR_CV.res),Math.ceil(BR_CV.h*BR_CV.res),(c)=>{c.scale(BR_CV.res,BR_CV.res);const w=BR_CV.w,h=BR_CV.h;
  ag_soft(c,cc=>ag_rect(cc,0,0,w,h,6),BR_OLD.paper,[252,248,236],w*0.8,h*0.2,w*0.9,"rgba(120,96,60,0.35)",34,0.6);
  c.save();c.beginPath();ag_rect(c,0,0,w,h,6);c.clip();c.strokeStyle="rgba(150,130,96,0.045)";c.lineWidth=1;for(let y=8;y<h;y+=7){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
  c.strokeStyle="rgba(150,130,96,0.08)";for(let x=40;x<w;x+=110){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}
  const g=c.createRadialGradient(w/2,h/2,h*0.3,w/2,h/2,w*0.7);g.addColorStop(0,"rgba(180,150,100,0)");g.addColorStop(1,"rgba(180,150,100,0.24)");c.fillStyle=g;c.fillRect(0,0,w,h);
  if(side==="back"){// the sheet folded in from both sides: the outer flap's edge, a little uneven, its soft shade on the flap under it
    const ex=w*0.57,edge=cc=>{cc.moveTo(ex-4,0);cc.bezierCurveTo(ex+3,h*0.3,ex-5,h*0.7,ex+2,h);};
    c.save();c.filter="blur(6px)";c.strokeStyle="rgba(110,86,50,0.28)";c.lineWidth=14;c.beginPath();c.moveTo(ex+6,0);c.bezierCurveTo(ex+13,h*0.3,ex+5,h*0.7,ex+12,h);c.stroke();c.restore();
    c.fillStyle=rgba(BR_OLD.paper,1);c.beginPath();c.moveTo(0,0);c.lineTo(ex-4,0);c.bezierCurveTo(ex+3,h*0.3,ex-5,h*0.7,ex+2,h);c.lineTo(0,h);c.closePath();c.fill();
    c.fillStyle="rgba(255,252,240,0.12)";c.fillRect(0,0,ex-6,h);
    // the flap is the same sheet: its laid and chain lines, and its own age at the edge
    c.save();c.beginPath();c.moveTo(0,0);c.lineTo(ex-4,0);c.bezierCurveTo(ex+3,h*0.3,ex-5,h*0.7,ex+2,h);c.lineTo(0,h);c.closePath();c.clip();
    c.strokeStyle="rgba(150,130,96,0.045)";c.lineWidth=1;for(let y=11;y<h;y+=7){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
    c.strokeStyle="rgba(150,130,96,0.08)";for(let x=95;x<ex;x+=110){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}
    const g2=c.createRadialGradient(ex*0.5,h/2,h*0.25,ex*0.5,h/2,ex*0.8);g2.addColorStop(0,"rgba(180,150,100,0)");g2.addColorStop(1,"rgba(180,150,100,0.2)");c.fillStyle=g2;c.fillRect(0,0,ex,h);c.restore();
    c.strokeStyle="rgba(110,86,50,0.5)";c.lineWidth=2;c.beginPath();edge(c);c.stroke();
    // the sheet folded in half across: its crease over both flaps
    c.strokeStyle="rgba(120,96,60,0.16)";c.lineWidth=1.6;c.beginPath();c.moveTo(0,h*0.5);c.lineTo(ex-10,h*0.5);c.moveTo(ex+12,h*0.5+3);c.lineTo(w,h*0.5+3);c.stroke();}
  else{c.strokeStyle="rgba(120,96,60,0.16)";c.lineWidth=1.6;c.beginPath();c.moveTo(6,h*0.06);c.lineTo(w-6,h*0.06);c.stroke();}
  c.restore();});}
// the wax seal on the back: a red blob pressed with a ring and a small device, at (x, y), r across, k 0 to 1 as it presses
function br_seal(ctx,x,y,r,k){if(k<=0)return;const s=lerp(0.6,1,ag_eo(k));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ag_soft(ctx,cc=>{for(let i=0;i<=24;i++){const a=i/24*TAU,rr2=r*(1+0.07*Math.sin(a*5+1)+0.04*Math.sin(a*9));i?cc.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2):cc.moveTo(Math.cos(a)*rr2,Math.sin(a)*rr2);}cc.closePath();},
    BR_OLD.wax,BR_OLD.waxHi,r*0.3,-r*0.4,r*1.1,"rgba(40,0,0,0.5)",8);
  ctx.strokeStyle="rgba(90,10,10,0.55)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*0.62,0,TAU);ctx.stroke();ctx.strokeStyle="rgba(255,170,150,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(1,-1,r*0.62,Math.PI*1.1,Math.PI*1.9);ctx.stroke();
  ctx.fillStyle="rgba(90,10,10,0.5)";ctx.beginPath();ctx.moveTo(-r*0.22,r*0.2);ctx.lineTo(0,-r*0.3);ctx.lineTo(r*0.22,r*0.2);ctx.closePath();ctx.fill();ctx.restore();}
// a part written on to p: each of its lines in turn, left to right
function br_write(ctx,key,p){if(p<=0)return;const n=BR_CVPARTS[key].lines.length;
  for(let i=0;i<n;i++){const u=clamp(p*n-i,0,1);if(u<=0)break;const {b,img}=br_line(key,i);
    ctx.save();ctx.beginPath();ctx.rect(b[0],b[1],(b[2]-b[0])*u,b[3]-b[1]);ctx.clip();ctx.drawImage(img,b[0],b[1],b[2]-b[0],b[3]-b[1]);ctx.restore();}}
// the red PAID of 1840: a double ring, the word inside, a little uneven, as a handstamp leaves it
function br_paid(ctx,x,y,r,a,deco){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(-0.12);ctx.strokeStyle=rgba(BR_OLD.red,0.86);ctx.lineWidth=4;
  ctx.beginPath();ctx.ellipse(0,0,r*1.25,r,0,0,TAU);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,r*1.25-9,r-9,0,0,TAU);ctx.stroke();
  ag_T(ctx,"PAID",0,13,{w:800,size:38,align:"center",col:BR_OLD.red,a:0.9,ls:2,deco:deco?1:0});ctx.restore();}
/* the cover at (x, y), w wide (its height follows), turned by o.rot; o.flip 0 shows its back, 1 its front, and between it turns over;
   o.p {addr, charge, frank, date, paid, seal}; o.blank: a cover with only the frank on it, no address; o.copied: its frank in another
   hand; o.dim greys it; o.a, o.k (springs from its middle); o.edge a colour round it (amber for a copied name), o.edgeA; o.deco marks
   its PAID as decoration, where the cover is drawn small and a pill says it */
function br_cover(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const sc=w/BR_CV.w,h=BR_CV.h*sc,p=o.p||{},fl=o.flip==null?1:o.flip;
  const b={x,y,w,h};ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);if(o.rot)ctx.rotate(o.rot);if(o.k!=null){const k=lerp(0.6,1,o.k);ctx.scale(k,k);}
  // turning over: the cover narrows to its edge, then widens showing its other side
  const turn=Math.cos(fl*Math.PI),sx=Math.max(0.02,Math.abs(turn)),front=turn<=0;
  ctx.save();ctx.shadowColor="rgba(30,16,6,0.4)";ctx.shadowBlur=26*sc+6;ctx.shadowOffsetX=-8*sc;ctx.shadowOffsetY=12*sc;ctx.fillStyle="rgba(0,0,0,0.01)";ctx.fillRect(-w/2*sx,-h/2,w*sx,h);ctx.restore();
  ctx.scale(sx*sc,sc);ctx.translate(-BR_CV.w/2,-BR_CV.h/2);
  ctx.drawImage(br_paper(front?"front":"back"),0,0,BR_CV.w,BR_CV.h);
  if(front){if(!o.blank){br_write(ctx,"addr",p.addr==null?1:p.addr);br_write(ctx,"charge",p.charge||0);}
    br_write(ctx,"date",p.date||0);br_write(ctx,o.copied?"copy":"frank",p.frank||0);
    if(p.paid)br_paid(ctx,720,130,58,p.paid,o.deco);}
  else br_seal(ctx,BR_CV.w*0.57,BR_CV.h*0.5,46,p.seal==null?1:p.seal);
  // a little shade as it turns, darker on its far half
  if(sx<0.98){ctx.fillStyle="rgba(60,40,20,"+(0.25*(1-sx))+")";ctx.fillRect(0,0,BR_CV.w,BR_CV.h);}
  if(o.dim){ctx.fillStyle="rgba(140,136,128,"+(0.55*o.dim)+")";ctx.fillRect(0,0,BR_CV.w,BR_CV.h);}
  if(o.edge){ctx.strokeStyle=rgba(o.edge,0.9*(o.edgeA==null?1:o.edgeA));ctx.lineWidth=5/sc;ctx.beginPath();ag_rect(ctx,-4,-4,BR_CV.w+8,BR_CV.h+8,10);ctx.stroke();}
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the people of the time
   ag_person specs, each painted once (their own key), dressed for their time:
     the member (the 1780s): a claret coat over a buff waistcoat and its buttons, a white neckcloth wound high round the neck with the
       shirt's frill falling below it, his grey hair tied at the nape with a black ribbon
     his sister: a white linen cap, puffed over the crown, its frill round her face and over her ears, a ribbon round it; a white
       kerchief over her shoulders, crossed on her chest
     a clerk of the letter office in the 1700s: a brown coat over a buff waistcoat, a white neckcloth, his own hair tied at the nape
     a clerk of the letter office in the 1830s: a dark coat, a buff waistcoat, a black stock round the neck with the shirt's white
       edge and collar point above it and its front below
     a woman who posts a letter (1840): a straw bonnet over hair parted and drawn smooth over the ears, its ribbon tied under her chin;
       a shawl over her shoulders with a darker border, a small white collar
   A hat or a cap is painted with the head (who.hat.paint, inside the head's picture, x 160 to 440, y 250 to 560). What closes over the
   neck or falls over the shoulders (a neckcloth, a stock, a kerchief, a shawl) is a picture of its own (who.over, inside who.overBox),
   laid over the person and breathing with the body, as How it goes wrong lays its mantle: painted with the body, it would sit under
   the neck, which the body's picture paints last. br_person draws a person with it, and draws a person who fades whole first. */
function br_person(ctx,who,x,y,s,o){o=o||{};const a=ctx.globalAlpha;if(a<0.004)return null;
  if(!who.over)return ag_person(ctx,who,x,y,s,o);
  if(a<0.995){const [bc,bx]=ag_buf("brPerson",ctx.canvas.width,ctx.canvas.height);bx.setTransform(ctx.getTransform());const hd=br_person(bx,who,x,y,s,o);
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(bc,0,0);ctx.restore();return hd;}
  const F=ag_fig(who),L=F.over||(F.over=ag_layer(c=>who.over(c,who),who.overBox)),A=AG_FIG.anchor,br=Math.sin((o.t||0)*TAU*who.breath)*2.2;
  // a hand that holds something rises in front of the cloth: the cloth is laid on the body first (as what's behind the hand), then the
  // near arm and what it holds, then the head
  if(o.pose&&o.pose!=="hang"){const hb=o.holdBack;return ag_person(ctx,who,x,y,s,Object.assign({},o,{holdBack:(c,h)=>{c.save();
      if(o.cut!=null){c.beginPath();c.rect(-4000,-4000,9000,4000+A[1]+(o.cut-y)/s-br);c.clip();}ag_drawLayer(c,L);c.restore();if(hb)hb(c,h);}}));}
  const hands=ag_person(ctx,who,x,y,s,o);
  ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.translate(-A[0],-A[1]+br);
  if(o.cut!=null){ctx.beginPath();ctx.rect(-4000,-4000,9000,4000+A[1]+(o.cut-y)/s-br);ctx.clip();}
  ag_drawLayer(ctx,L);ctx.restore();return hands;}
// a stock: a band round the neck from the collar to a little under the jaw, the nape's skin showing above it at the back, in figure space
const BR_STOCK=cc=>{cc.moveTo(238,512);cc.bezierCurveTo(258,522,276,532,294,538);cc.bezierCurveTo(310,544,326,548,342,551);
  cc.bezierCurveTo(348,570,354,588,361,606);cc.bezierCurveTo(330,620,282,616,248,596);cc.bezierCurveTo(238,588,233,578,232,566);
  cc.bezierCurveTo(232,548,235,530,238,512);cc.closePath();};
// a neckcloth, wound round the neck lower than a stock, the neck showing under the jaw, its cloth puffed a little at the front
const BR_CRAVAT=cc=>{cc.moveTo(236,516);cc.bezierCurveTo(262,528,300,544,342,552);cc.bezierCurveTo(360,564,368,588,362,606);
  cc.bezierCurveTo(330,620,282,616,248,596);cc.bezierCurveTo(238,588,233,578,232,566);cc.bezierCurveTo(232,548,234,530,236,516);cc.closePath();};
// a neckcloth (o.low) or a stock: o.cloth its colour; o.frill the shirt's frill below it; o.shirt the shirt's edge and collar point above a dark stock; o.btn
// the waistcoat's buttons down the coat's opening
function br_neckwear(o){return(c,P)=>{const cl=o.cloth,lt=ag_lt(cl,0.5),dk=ag_dk(cl,0.45);
  if(o.btn)for(const [x,y] of [[313,742],[316,776],[319,808],[321,838]]){c.fillStyle=rgba(ag_dk(o.btn,0.4),0.55);c.beginPath();c.arc(x+1,y+1.5,5.6,0,TAU);c.fill();
    c.fillStyle=rgba(o.btn,1);c.beginPath();c.arc(x,y,5.2,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.5)";c.beginPath();c.arc(x+1.6,y-1.6,1.8,0,TAU);c.fill();}
  if(o.frill){const f=cc=>{cc.moveTo(318,604);cc.bezierCurveTo(340,604,354,612,355,626);cc.bezierCurveTo(353,652,346,684,336,712);
      cc.bezierCurveTo(328,724,314,724,308,712);cc.bezierCurveTo(302,680,303,646,309,620);cc.bezierCurveTo(311,610,314,605,318,604);cc.closePath();};
    ag_soft(c,f,o.frill,ag_lt(o.frill,0.6),340,630,80,rgba(ag_dk(o.frill,0.4),0.35),6);
    c.save();ag_shape(c,f);c.clip();c.strokeStyle=rgba(ag_dk(o.frill,0.3),0.55);c.lineWidth=1.8;c.lineCap="round";
    for(const y of [628,652,676,700]){c.beginPath();c.moveTo(300,y-6);c.quadraticCurveTo(318,y+6,330,y-2);c.quadraticCurveTo(342,y+8,358,y);c.stroke();}c.restore();}
  const sh=o.low?BR_CRAVAT:BR_STOCK;ag_soft(c,sh,cl,lt,340,556,90,rgba(dk,0.45),12);
  c.save();ag_shape(c,sh);c.clip();c.lineCap="round";
  const g=c.createLinearGradient(236,0,360,0);g.addColorStop(0,rgba(dk,0.3));g.addColorStop(0.55,rgba(dk,0));c.fillStyle=g;c.fillRect(226,480,140,140);
  c.strokeStyle=rgba(dk,0.3);c.lineWidth=2.4;c.beginPath();
  if(o.low){c.moveTo(312,562);c.quadraticCurveTo(334,566,352,578);c.moveTo(318,588);c.quadraticCurveTo(338,590,356,600);}
  else{c.moveTo(236,550);c.bezierCurveTo(268,560,300,574,350,576);}c.stroke();
  c.strokeStyle=rgba(lt,0.45);c.lineWidth=2;c.beginPath();if(o.low){c.moveTo(300,552);c.quadraticCurveTo(326,560,350,568);}else{c.moveTo(250,538);c.bezierCurveTo(284,550,312,560,344,562);}c.stroke();c.restore();
  if(o.shirt){const sl=ag_lt(o.shirt,0.5),sd=ag_dk(o.shirt,0.4);
    // the shirt's front, white in the waistcoat's opening under the stock's bow
    ag_soft(c,cc=>{cc.moveTo(300,604);cc.bezierCurveTo(320,612,340,612,356,604);cc.bezierCurveTo(352,628,344,652,334,672);cc.bezierCurveTo(322,656,310,630,300,604);cc.closePath();},
      o.shirt,sl,334,616,60,rgba(sd,0.3),5);
    c.strokeStyle=rgba(o.shirt,1);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(240,514);c.bezierCurveTo(258,523,276,533,294,539);c.bezierCurveTo(310,545,326,549,341,552);c.stroke();
    // the near collar point, standing up from the stock against the cheek
    ag_soft(c,cc=>{cc.moveTo(296,540);cc.lineTo(318,516);cc.lineTo(340,553);cc.closePath();},o.shirt,[255,255,255],318,524,30,rgba(sd,0.35),4);}};}
// hair tied back at the nape with a black ribbon bow
function br_queue(col){return(c,P)=>{const hc=P.hair.c;
  ag_soft(c,cc=>{cc.moveTo(226,446);cc.bezierCurveTo(206,466,198,500,202,530);cc.bezierCurveTo(206,548,216,550,220,534);cc.bezierCurveTo(218,502,224,476,240,458);cc.closePath();},hc,ag_lt(hc,0.3),214,470,40,null);
  c.fillStyle=rgba(col,1);c.beginPath();c.ellipse(222,460,15,9,0.5,0,TAU);c.fill();
  c.beginPath();c.moveTo(222,460);c.bezierCurveTo(204,450,196,462,202,472);c.closePath();c.fill();c.beginPath();c.moveTo(222,460);c.bezierCurveTo(236,476,232,488,222,486);c.closePath();c.fill();};}
// a white linen cap: its crown puffed over the head and down behind the ear, a frill of small scallops round the face, a ribbon round it
function br_mobcap(col,band){return(c,P)=>{const dk=ag_dk(col,0.2);
  const cap=cc=>{cc.moveTo(394,316);cc.bezierCurveTo(392,282,340,260,286,260);cc.bezierCurveTo(232,260,190,288,180,332);cc.bezierCurveTo(170,380,178,430,204,466);
    cc.bezierCurveTo(216,482,230,492,240,494);cc.lineTo(258,490);cc.bezierCurveTo(266,482,270,476,272,468);cc.bezierCurveTo(274,452,272,436,271,424);
    cc.bezierCurveTo(268,404,268,384,270,364);cc.bezierCurveTo(274,350,280,342,288,336);cc.bezierCurveTo(300,326,316,320,334,318);cc.bezierCurveTo(354,318,374,324,392,338);cc.closePath();};
  ag_soft(c,cap,col,[255,255,255],320,280,160,rgba(ag_dk(col,0.5),0.35),16);
  // the crown gathered into the ribbon: soft folds running out from it, and small puckers along the back edge
  ag_folds(c,cap,[[[214,320],[226,360],[222,410]],[[260,286],[276,300],[286,318]],[[196,380],[206,420],[224,456]],[[320,272],[340,284],[356,300]],[[236,290],[246,312],[250,336]],[[186,346],[200,362],[214,380]]],rgba(dk,0.6),"rgba(255,255,255,0.5)");
  c.save();ag_shape(c,cap);c.clip();c.strokeStyle=rgba(dk,0.5);c.lineWidth=1.6;c.lineCap="round";
  for(let i=0;i<9;i++){const u=i/8,x=lerp(186,226,u)-Math.sin(u*Math.PI)*8,y=lerp(330,476,u);c.beginPath();c.moveTo(x-6,y-4);c.quadraticCurveTo(x+4,y+2,x+12,y-2);c.stroke();}c.restore();
  c.strokeStyle=rgba(band,0.95);c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(374,302);c.bezierCurveTo(330,290,270,302,242,340);c.bezierCurveTo(224,370,224,420,236,458);c.stroke();
  const F=[[392,338],[374,324],[354,318],[334,318],[316,320],[300,326],[288,336],[280,344],[274,352],[270,364],[268,384],[268,404],[271,424],[272,446],[272,468],[266,480],[258,490]];
  c.strokeStyle=rgba(dk,0.6);c.lineWidth=1.4;
  for(const [off,bulge,tone] of [[-9,9,0.25],[0,10,0.45]])for(let i=0;i<F.length-1;i++){const a=F[i],b=F[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=dy/l,ny=-dx/l,
      A=[a[0]-nx*off,a[1]-ny*off],B=[b[0]-nx*off,b[1]-ny*off],mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;
    c.fillStyle=rgba(ag_lt(col,tone),1);c.beginPath();c.moveTo(A[0],A[1]);c.quadraticCurveTo(mx+nx*bulge,my+ny*bulge,B[0],B[1]);c.closePath();c.fill();c.stroke();}};}
// a white kerchief over the shoulders, the far end crossed over the near one on the chest
const BR_FICHU=cc=>{cc.moveTo(84,692);cc.bezierCurveTo(94,642,150,600,232,562);cc.bezierCurveTo(262,600,318,618,360,604);
  cc.bezierCurveTo(396,612,428,636,446,672);cc.bezierCurveTo(436,730,404,790,356,850);cc.bezierCurveTo(330,842,302,814,282,782);
  cc.bezierCurveTo(240,762,170,742,110,732);cc.bezierCurveTo(96,724,86,710,84,692);cc.closePath();};
function br_kerchief(col){return(c,P)=>{const lt=ag_lt(col,0.6),dk=ag_dk(col,0.32);
  ag_soft(c,BR_FICHU,col,lt,380,640,260,rgba(dk,0.45),16);
  c.save();ag_shape(c,BR_FICHU);c.clip();c.strokeStyle=rgba(dk,0.3);c.lineWidth=12;c.filter="blur(5px)";c.beginPath();c.moveTo(346,612);c.bezierCurveTo(326,680,296,740,272,786);c.stroke();c.filter="none";
  c.strokeStyle=rgba(dk,0.7);c.lineWidth=2.2;c.beginPath();c.moveTo(352,608);c.bezierCurveTo(332,680,302,740,280,784);c.stroke();c.restore();
  ag_folds(c,BR_FICHU,[[[150,640],[200,660],[250,700]],[[398,640],[392,700],[370,780]],[[110,700],[180,712],[260,742]],[[300,640],[296,690],[288,740]]],rgba(dk,0.4),"rgba(255,255,255,0.5)");};}
// a straw bonnet: its crown round the back of the head with a short curtain over the nape, a deep brim framing the face (the straw
// outside, the lining seen past the far cheek), its ribbon from the brim's edge tied in a bow under the chin
function br_bonnet(straw,lining,ribbon){return(c,P)=>{const dk=ag_dk(straw,0.42),lt=ag_lt(straw,0.4);
  const crown=cc=>{cc.moveTo(296,290);cc.bezierCurveTo(246,284,202,312,190,358);cc.bezierCurveTo(180,398,186,440,206,470);cc.bezierCurveTo(222,492,244,498,258,490);cc.lineTo(266,330);cc.closePath();};
  ag_soft(c,crown,straw,lt,270,300,150,rgba(dk,0.5),14);
  const curtain=cc=>{cc.moveTo(194,436);cc.bezierCurveTo(196,470,212,500,240,512);cc.bezierCurveTo(250,516,258,512,262,504);cc.lineTo(258,486);cc.bezierCurveTo(236,488,212,470,200,440);cc.closePath();};
  ag_soft(c,curtain,ribbon,ag_lt(ribbon,0.3),240,490,60,rgba(ag_dk(ribbon,0.5),0.4),6);
  const brim=cc=>{cc.moveTo(254,502);cc.bezierCurveTo(226,452,218,372,236,320);cc.bezierCurveTo(254,274,312,258,362,264);cc.bezierCurveTo(400,270,424,298,430,342);
    cc.bezierCurveTo(434,392,430,440,418,488);cc.lineTo(406,482);cc.bezierCurveTo(412,440,412,392,404,354);cc.bezierCurveTo(396,324,370,308,336,308);
    cc.bezierCurveTo(302,308,280,326,274,356);cc.bezierCurveTo(268,396,270,444,278,494);cc.closePath();};
  ag_soft(c,brim,straw,lt,380,290,170,rgba(dk,0.5),12);
  const lin=cc=>{cc.moveTo(406,482);cc.bezierCurveTo(412,440,412,392,404,354);cc.bezierCurveTo(396,324,370,308,336,308);cc.bezierCurveTo(352,300,380,300,402,318);
    cc.bezierCurveTo(418,340,424,390,422,440);cc.bezierCurveTo(420,460,416,474,412,486);cc.closePath();};
  ag_soft(c,lin,lining,ag_lt(lining,0.5),400,360,80,rgba(ag_dk(lining,0.4),0.35),8);
  c.save();ag_shape(c,brim);c.clip();c.strokeStyle=rgba(dk,0.22);c.lineWidth=1.4;
  for(let k=1;k<5;k++){const f=k/5;c.beginPath();c.moveTo(lerp(254,278,f),lerp(502,494,f));c.bezierCurveTo(lerp(226,270,f),lerp(452,444,f),lerp(218,268,f),lerp(372,396,f),lerp(236,274,f),lerp(320,356,f));
    c.bezierCurveTo(lerp(254,280,f),lerp(274,326,f),lerp(312,302,f),lerp(258,308,f),lerp(362,336,f),lerp(264,308,f));c.stroke();}c.restore();
  c.strokeStyle=rgba(ribbon,1);c.lineWidth=9;c.lineCap="round";c.beginPath();c.moveTo(266,496);c.bezierCurveTo(280,526,300,544,322,548);c.stroke();
  const bow=cc=>{cc.moveTo(322,548);cc.bezierCurveTo(306,534,290,540,296,552);cc.bezierCurveTo(300,558,314,556,322,548);cc.closePath();cc.moveTo(322,548);cc.bezierCurveTo(338,532,354,538,350,550);cc.bezierCurveTo(346,557,332,556,322,548);cc.closePath();};
  ag_soft(c,bow,ribbon,ag_lt(ribbon,0.35),330,540,24,rgba(ag_dk(ribbon,0.5),0.4),4);
  c.fillStyle=rgba(ag_dk(ribbon,0.2),1);c.beginPath();c.arc(322,549,4.5,0,TAU);c.fill();};}
// a shawl over both shoulders, each side hanging down in front with a darker woven border along its edge; under it, the gown's small white collar
const BR_SHAWL={near:cc=>{cc.moveTo(232,564);cc.bezierCurveTo(250,590,268,604,290,612);cc.bezierCurveTo(286,700,276,800,264,900);cc.bezierCurveTo(258,960,254,1030,252,1100);
    cc.lineTo(96,1100);cc.bezierCurveTo(70,1000,58,880,58,780);cc.bezierCurveTo(58,700,90,640,134,606);cc.bezierCurveTo(164,586,200,572,232,564);cc.closePath();},
  far:cc=>{cc.moveTo(350,606);cc.bezierCurveTo(390,610,428,628,452,660);cc.bezierCurveTo(470,690,474,740,472,800);cc.bezierCurveTo(470,900,462,1000,458,1100);
    cc.lineTo(336,1100);cc.bezierCurveTo(338,960,340,820,344,700);cc.bezierCurveTo(346,660,348,630,350,606);cc.closePath();}};
function br_shawl(col,border,collar){return(c,P)=>{const lt=ag_lt(col,0.35),dk=ag_dk(col,0.5);
  ag_soft(c,cc=>{cc.moveTo(236,570);cc.bezierCurveTo(262,604,316,620,358,606);cc.lineTo(360,622);cc.bezierCurveTo(312,640,256,622,232,588);cc.closePath();},collar,ag_lt(collar,0.6),330,610,60,rgba(ag_dk(collar,0.4),0.3),4);
  for(const k of ["far","near"]){const f=BR_SHAWL[k];ag_soft(c,f,col,lt,k==="far"?470:200,660,260,rgba(dk,0.45),18);
    ag_folds(c,f,k==="near"?[[[120,660],[110,780],[120,900]],[[200,640],[214,760],[220,900]]]:[[[420,660],[440,780],[440,920]],[[380,640],[392,760],[396,900]]],rgba(dk,0.45),rgba(lt,0.3));
    c.save();ag_shape(c,f);c.clip();c.strokeStyle=rgba(border,1);c.lineWidth=26;c.beginPath();
    if(k==="near"){c.moveTo(290,612);c.bezierCurveTo(286,700,276,800,264,900);c.bezierCurveTo(258,960,254,1030,252,1100);}
    else{c.moveTo(350,606);c.bezierCurveTo(348,630,346,660,344,700);c.bezierCurveTo(340,820,338,960,336,1100);}c.stroke();
    // two fine light lines woven along the border
    c.strokeStyle=rgba(ag_lt(border,0.4),0.7);c.lineWidth=1.6;for(const d of [3,8]){const s2=k==="near"?-d:d;c.beginPath();
      if(k==="near"){c.moveTo(290+s2,612);c.bezierCurveTo(286+s2,700,276+s2,800,264+s2,900);c.bezierCurveTo(258+s2,960,254+s2,1030,252+s2,1100);}
      else{c.moveTo(350+s2,606);c.bezierCurveTo(348+s2,630,346+s2,660,344+s2,700);c.bezierCurveTo(340+s2,820,338+s2,960,336+s2,1100);}c.stroke();}c.restore();}};}
const BR_P={
  member:{key:"br_member",name:"a member of parliament",skin:[228,192,162],hair:{style:"side",c:[204,200,194]},top:{kind:"suit",c:[104,56,56],inner:[204,178,128]},
    hat:{paint:br_queue([30,28,30])},over:br_neckwear({cloth:[244,240,232],frill:[246,242,234],btn:[214,186,120],low:true}),overBox:[226,480,372,852],breath:0.24},
  sister:{key:"br_sister",name:"his sister",skin:[238,206,182],hair:{style:"side",c:[104,74,54]},top:{kind:"tunic",c:[150,114,112]},
    hat:{paint:br_mobcap([244,242,236],[176,150,140])},over:br_kerchief([242,238,230]),overBox:[70,550,462,866],breath:0.3},
  clerk17:{key:"br_clerk17",name:"a clerk of the letter office",skin:[214,176,144],hair:{style:"side",c:[86,62,44]},top:{kind:"suit",c:[96,74,52],inner:[176,150,106]},
    hat:{paint:br_queue([30,28,30])},over:br_neckwear({cloth:[238,234,224],btn:[150,120,70],low:true}),overBox:[226,480,372,852],breath:0.27},
  clerk:{key:"br_clerk",name:"a clerk of the letter office",skin:[214,176,144],hair:{style:"side",c:[74,56,44]},top:{kind:"suit",c:[58,58,60],inner:[150,128,92]},
    over:br_neckwear({cloth:[34,32,36],shirt:[240,236,228],btn:[96,84,64]}),overBox:[226,480,372,852],breath:0.27},
  sender:{key:"br_sender",name:"a woman who posts a letter",skin:[226,190,158],hair:{style:"bob",c:[78,54,40]},top:{kind:"tunic",c:[62,58,70]},
    hat:{paint:br_bonnet([214,192,146],[234,224,204],[128,78,80])},over:br_shawl([176,154,120],[118,74,62],[240,236,228]),overBox:[50,555,478,1108],breath:0.29}
};

/* ---------------------------------------------------------------- things of 1837 and 1840 */
// Rowland Hill's pamphlet: a printed title page, at (x, y), w wide
function br_pamphlet(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*1.36;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||-0.03);
  if(o.k!=null){const k=lerp(0.6,1,o.k);ctx.scale(k,k);}ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(30,16,6,0.45)";ctx.shadowBlur=30;ctx.shadowOffsetX=-10;ctx.shadowOffsetY=14;ctx.fillStyle=rgba(mix(BR_OLD.paper,[255,255,255],0.2),1);ctx.fillRect(0,0,w,h);ctx.restore();
  const g=ctx.createRadialGradient(w/2,h/2,h*0.3,w/2,h/2,h*0.8);g.addColorStop(0,"rgba(180,150,100,0)");g.addColorStop(1,"rgba(180,150,100,0.22)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(60,44,30,0.6)";ctx.lineWidth=2;ctx.strokeRect(24,24,w-48,h-48);ctx.strokeRect(30,30,w-60,h-60);
  const ink=[44,34,28];ag_T(ctx,"POST OFFICE",w/2,h*0.25,{w:800,size:44,align:"center",col:ink,ls:3});ag_T(ctx,"REFORM",w/2,h*0.25+58,{w:800,size:52,align:"center",col:ink,ls:5});
  ctx.fillStyle=rgba(ink,0.7);ctx.fillRect(w*0.3,h*0.25+92,w*0.4,2);
  ag_T(ctx,"its importance and",w/2,h*0.25+150,{w:600,size:30,align:"center",col:ink});ag_T(ctx,"practicability",w/2,h*0.25+192,{w:600,size:30,align:"center",col:ink});
  ag_T(ctx,"by Rowland Hill",w/2,h*0.68,{w:700,size:32,align:"center",col:ink});ag_T(ctx,"1837",w/2,h*0.84,{w:700,size:32,align:"center",col:ink,ls:3});ctx.restore();}
// the post office's notice of 1840, on the wall at (x, y): its lines come in one by one (o.p 0 to 1)
function br_notice(ctx,o){o=o||{};const N=BR_OFFICE.notice,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(30,16,6,0.35)";ctx.shadowBlur=20;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=10;ctx.fillStyle=rgba(mix(BR_OLD.paper,[255,255,255],0.25),1);ctx.fillRect(N.x,N.y,N.w,N.h);ctx.restore();
  ctx.strokeStyle="rgba(60,44,30,0.55)";ctx.lineWidth=2;ctx.strokeRect(N.x+14,N.y+14,N.w-28,N.h-28);const ink=[44,34,28],cx=N.x+N.w/2,p=o.p==null?1:o.p,L=(i)=>clamp(p*5-i,0,1);
  ag_T(ctx,"UNIFORM",cx,N.y+72,{w:800,size:34,align:"center",col:ink,ls:3,a:L(0)});ag_T(ctx,"PENNY POST",cx,N.y+116,{w:800,size:34,align:"center",col:ink,ls:3,a:L(0)});
  ag_T(ctx,"from 10 January 1840",cx,N.y+176,{w:600,size:28,align:"center",col:ink,a:L(1)});
  ag_T(ctx,"One penny",cx,N.y+250,{w:800,size:40,align:"center",col:BR_OLD.red,a:L(2)});ag_T(ctx,"a letter, anywhere",cx,N.y+292,{w:600,size:28,align:"center",col:ink,a:L(3)});
  ag_T(ctx,"paid by the sender",cx,N.y+364,{w:700,size:30,align:"center",col:ink,a:L(4)});ctx.restore();}
// a penny: a dark copper coin, seen from above
function br_coin(ctx,x,y,r,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x-4,y+6,r*1.1,r*0.5,0.4);
  ag_soft(ctx,cc=>cc.arc(x,y,r,0,TAU),[134,82,52],[230,170,120],x+r*0.3,y-r*0.4,r*1.2,"rgba(40,10,0,0.5)",6);
  ctx.strokeStyle="rgba(70,36,16,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r*0.8,0,TAU);ctx.stroke();
  ctx.fillStyle="rgba(70,36,16,0.45)";ctx.beginPath();ctx.ellipse(x-2,y,r*0.32,r*0.42,0,0,TAU);ctx.fill();ctx.restore();}
// letters in a pile, seen from the front, at (x, y) its bottom middle, w wide, n (0 to 1 of max) high; o.free: franked (a dark name on each)
function br_pile(ctx,x,y,w,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||n<=0)return;const R=ag_rnd(o.seed||5),m=Math.round((o.max||22)*n),lh=o.lh||14;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x-6,y+6,w*0.56,18,0.35);
  for(let i=0;i<m;i++){const dx=(R()-0.5)*w*0.12,rot=(R()-0.5)*0.05,yy=y-i*lh;ctx.save();ctx.translate(x+dx,yy);ctx.rotate(rot);
    ctx.fillStyle=rgba(mix(BR_OLD.paper,BR_OLD.paperDk,R()*0.7),1);ctx.fillRect(-w/2,-lh+1,w,lh-1);ctx.fillStyle="rgba(90,70,40,0.35)";ctx.fillRect(-w/2,-1,w,1.5);
    if(o.free){ctx.fillStyle=rgba(BR_OLD.ink,0.55);ctx.fillRect(-w/2+14,-lh+4,w*0.28,2.4);}ctx.restore();}ctx.restore();}

// the two years' letters on the counter, side by side, their bottoms on the line y: 1839's pile at x0 and 1840's at x1, more than twice
// as high (about 76 million and about 169 million), each with its count above it; o.p [2] grows each (0 to 1), o.a
function br_stacks(ctx,x0,x1,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const p=o.p||[1,1],R=[0.45,1];
  [[x0,"1839 · about 76 million",0],[x1,"1840 · nearly 170 million",1]].forEach(([x,s,i])=>{const n=R[i]*ag_eo(clamp(p[i],0,1));if(n<=0)return;
    br_pile(ctx,x,y,210,n,{seed:11+i*7,max:22,lh:12,a});const top=y-22*n*12;
    ag_pill(ctx,x,top-46,s,{a:a*clamp(p[i]*2-0.6,0,1),size:28});});}

/* ===== Borrowed rights: the five stages and their gates, copied whole from Five stages, not a switch =====
   br_stages is 3.1's fs_stages (its src/stages.js on 5 November 2026, copied again from its branch that day), unchanged under this
   film's prefix, as that file says a later film may: the same picture, words and colours in every film of the series. Copy it again
   if 3.1 changes it before it merges.
   br_stages(ctx, x, y, w, o) draws the series' picture of the five stages: five oak steps rising from left to right on the floor, each
   with its number on its face and a card on its top with its name (the plan's names, or o.short for one word or two), and a slim gate
   before each step, a post with a round knob that turns green once the gate is passed. Everything it needs is inside it, and it calls
   only the module's shared helpers (ag_box, ag_T, ag_tw, ag_floorShadow, ag_tick, ag_about), so a later film can copy it
   whole, under its own prefix, and keep its look, its words and its colours (blue for the stages and their gates, green for a gate
   passed).
     x, y   the left end of the floor line the steps stand on; w their width (1660 fills the frame; 1160 or more keeps every word at
            least 28 px as seen at zoom 1)
     o.a    the whole picture's opacity; o.k [5] each step springing in (0 to 1), o.lit [5] each stage lit (a blue edge, 0 to 1),
            o.dim (0 to 1) the stages not lit, quieter; o.col [5] a colour for a stage's edge instead of blue (amber for a stage a task
            moved down from, green for one passed)
     o.short  the short names, on one line, for a small picture (true or 1); between 0 and 1 the names change over: the long
              fade out in the first half, and the short come in in the second, so the two never show at once
     o.gates  [5] each gate shown (0 to 1), or true for all; o.passed [5] each gate passed (0 to 1): its knob turns green, with a tick
     o.gate   {i, a, k, x, y, w}: the words of gate i (0 to 4, the gate before stage i + 1) on a card at (x, y) (w wide, or as wide as
              its words), with a line to the gate's knob
     o.facts  {i, a, x, y, w}: stage i's three facts on a card at (x, y): whose identity, what it may do, what the person does
   It returns {stages: [{x, y, w, h, cx, top, face}], gates: [{x, y}]}: each stage's card, the middle of its step, the top of its step,
   its face; each gate's knob. */
function br_stages(ctx,x,y,w,o){o=o||{};
  const NAMES=[["Suggests"],["Acts for you,","step by step"],["Acts for you,","within limits"],["A contributor","that proposes"],["A contributor","with a mandate"]],
    SHORT=["Suggests","Step by step","Within limits","Proposes","Mandate"],
    GATES=[["The team's conventions and glossary,","written down for it to read"],["A development space,","with no sensitive data"],["Its limits, and how it will be checked,","set before it starts"],
      ["A place on the map,","with an owner and a role"],["A track record,","and a mandate its owner signs"]],
    FACTS=[["Yours, but it uses none","Drafts in a chat; runs nothing","Accepts or rejects every line"],
      ["Yours, delegated","Runs queries in your session, read only","Approves each action"],
      ["Yours, narrowed","Works alone; drafts only in a sandbox","Checks it against the checks set first"],
      ["Its own, with no secret it can see","Opens a pull request from its own space","Owns it; the data team reviews it"],
      ["Its own","In test, agreed tasks alone, then a report","Another person approves production"]],
    BLUE=[38,102,132],GREEN=[50,116,80],OAK={base:[208,188,156],dark:[156,136,106],hi:[242,233,216]};
  const a=o.a==null?1:o.a,k=w/1660,bw=300*k,gap=40*k,rise=86*k,depth=16*k,ch=128,sm=o.short===true?1:clamp(o.short||0,0,1),arr=(v,i,d)=>v==null?d:(v===true?1:(Array.isArray(v)?(v[i]==null?d:v[i]):v));
  const out={stages:[],gates:[]};
  for(let i=0;i<5;i++){const sx=x+i*(bw+gap),top=y-(i+1)*rise,cy=top-depth-14-ch;out.stages.push({x:sx,y:cy,w:bw,h:ch,cx:sx+bw/2,top,face:{x:sx,y:top,w:bw,h:y-top}});
    out.gates.push({x:sx-gap/2,y:top-depth-40*k});}
  if(a<=0)return out;
  ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2-8,y+10,w*0.56,26,0.22);
  for(let i=0;i<5;i++){const S=out.stages[i],kk=arr(o.k,i,1);if(kk<=0)continue;const lit=clamp(arr(o.lit,i,0),0,1),dim=(o.dim||0)*(1-lit),col=(o.col&&o.col[i])||BLUE;
    ctx.save();ctx.globalAlpha*=clamp(kk*1.6,0,1)*(1-0.55*dim);ag_about(ctx,S.cx,y,lerp(0.6,1,clamp(kk,0,1.2)));
    // the step: an oak block, its top a lighter strip receding a little, its face with the stage's number
    const f=S.face;let g=ctx.createLinearGradient(0,f.y,0,y);g.addColorStop(0,rgba(OAK.base,1));g.addColorStop(1,rgba(OAK.dark,1));
    ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=24*k;ctx.shadowOffsetX=-7;ctx.shadowOffsetY=10;ctx.fillStyle=g;ctx.fillRect(f.x,f.y,f.w,f.h);ctx.restore();
    g=ctx.createLinearGradient(0,f.y-depth,0,f.y);g.addColorStop(0,rgba(mix(OAK.hi,[255,255,255],0.3),1));g.addColorStop(1,rgba(OAK.hi,1));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(f.x+depth*0.6,f.y-depth);ctx.lineTo(f.x+f.w-depth*0.6,f.y-depth);ctx.lineTo(f.x+f.w,f.y);ctx.lineTo(f.x,f.y);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(OAK.dark,0.5);ctx.lineWidth=1.2;for(let j=1;j<4;j++){const gy=f.y+f.h*j/4;ctx.beginPath();ctx.moveTo(f.x+6,gy+Math.sin(j*3.1+i)*2);ctx.bezierCurveTo(f.x+f.w*0.3,gy-3,f.x+f.w*0.7,gy+3,f.x+f.w-6,gy);ctx.stroke();}
    if(lit>0){ctx.fillStyle=rgba([255,250,236],0.26*lit);ctx.fillRect(f.x,f.y,f.w,f.h);ctx.fillStyle=rgba(col,0.9*lit);ctx.fillRect(f.x,f.y-2,f.w,4);}
    const nsz=Math.max(36,Math.min(56,f.h*0.62));ag_T(ctx,String(i+1),S.cx,f.y+Math.min(f.h*0.5+nsz*0.36,f.h-10*k),{w:800,size:nsz,align:"center",col:lit>0.4?col:[110,92,66]});
    // the stage's card on its step: it shows once its step has nearly sprung to full size, so its words never show small
    ctx.globalAlpha*=clamp((kk-0.85)/0.12,0,1);
    ag_box(ctx,S.x,S.y,S.w,S.h,18,{edge:lit>0.02?col:null,edgeA:0.35+0.6*lit,glow:lit>0.02?col:null,glowA:lit});
    ag_T(ctx,"STAGE "+(i+1),S.x+16,S.y+36,{w:700,size:28,ls:3,col:lit>0.4?col:[80,86,94]});
    const sa=clamp(sm*2-1,0,1),la=clamp(1-sm*2,0,1);
    if(sa>0)ag_T(ctx,SHORT[i],S.x+16,S.y+82,{w:700,size:30,a:sa});
    if(la>0)NAMES[i].forEach((l,j)=>ag_T(ctx,l,S.x+16,S.y+78+j*38,{w:700,size:32,a:la}));
    ctx.restore();}
  // the gates: a slim post and its knob before each step; a passed gate's knob turns green, with a tick
  for(let i=0;i<5;i++){const ga=arr(o.gates,i,0),G=out.gates[i];if(ga<=0)continue;const ps=clamp(arr(o.passed,i,0),0,1),top=G.y,bot=i?out.stages[i-1].top:y;
    ctx.save();ctx.globalAlpha*=ga;ctx.fillStyle="#4A4C52";ctx.fillRect(G.x-3,top,6,bot-top);ag_floorShadow(ctx,G.x+AG.sdx*0.5,bot+2,12,4,0.3);
    const kc=mix(BLUE,GREEN,ps);ctx.save();ctx.shadowColor=rgba(kc,0.5);ctx.shadowBlur=12;ctx.fillStyle=rgba(kc,1);ctx.beginPath();ctx.arc(G.x,top,15,0,TAU);ctx.fill();ctx.restore();
    if(ps>0.05)ag_tick(ctx,G.x,top+1,13,"rgba(255,255,255,"+ps+")",3.2);ctx.restore();}
  // the words of one gate, on a card, with a line to its knob
  const gw=o.gate;if(gw&&gw.a>0){const G=out.gates[gw.i],L=GATES[gw.i],kick="GATE TO STAGE "+(gw.i+1),
      cw=gw.w||Math.max(ag_tw(ctx,kick,{w:700,size:28,ls:4}),...L.map(l=>ag_tw(ctx,l,{w:700,size:36})))+56,chh=28+38+L.length*44+28,b={x:gw.x,y:gw.y,w:cw,h:chh};
    ctx.save();ctx.globalAlpha*=gw.a;ctx.strokeStyle=rgba(BLUE,0.6);ctx.lineWidth=2.4;ctx.setLineDash([8,7]);ctx.beginPath();
    const sx=clamp(G.x,b.x+30,b.x+b.w-30);ctx.moveTo(sx,b.y+b.h);ctx.lineTo(G.x,G.y-18);ctx.stroke();ctx.setLineDash([]);
    if(gw.k!=null)ag_about(ctx,b.x+cw/2,b.y+chh/2,lerp(0.8,1,gw.k));ag_box(ctx,b.x,b.y,cw,chh,22,{edge:BLUE,edgeA:0.5});
    ag_T(ctx,kick,b.x+28,b.y+50,{w:700,size:28,ls:4,col:BLUE});L.forEach((l,j)=>ag_T(ctx,l,b.x+28,b.y+66+44*(j+1),{w:700,size:36}));ctx.restore();}
  // a stage's three facts
  const fc=o.facts;if(fc&&fc.a>0){const F=FACTS[fc.i],rows=[["Whose identity",F[0]],["What it may do",F[1]],["The person",F[2]]],h=58+rows.length*70+20;
    ctx.save();ctx.globalAlpha*=fc.a;if(fc.k!=null)ag_about(ctx,fc.x+fc.w/2,fc.y+h/2,lerp(0.6,1,fc.k));
    ag_box(ctx,fc.x,fc.y,fc.w,h,22,{edge:BLUE,edgeA:0.5});
    ag_T(ctx,"STAGE "+(fc.i+1)+" · "+SHORT[fc.i].toUpperCase(),fc.x+28,fc.y+50,{w:700,size:28,ls:3,col:BLUE});
    rows.forEach((r,j)=>{const ry=fc.y+58+j*70;ag_T(ctx,r[0],fc.x+28,ry+30,{w:600,size:28,col:[86,92,100]});ag_T(ctx,r[1],fc.x+28,ry+64,{w:700,size:32});});
    ctx.restore();}
  ctx.restore();return out;}

/* ===== Borrowed rights: the lab's pieces =====
   Where things stand in the module's lab (BL), and the film's pieces there, prefixed br_ / BR_:
     the helper: the module's sphere, wearing its person's badge on a blue lanyard (br_badge: their own staff card, a small portrait in
     their colours beside their name), floating above the person whose sign-in it works on (br_helper); an agent with a name of its
     own wears its own badge (ag_badge), with its owner's tag beside it or under it (br_agent);
     cards, lists and pills as 3.1 has them (br_card, br_list, br_pillL); a card of a title and lines (br_doc), and a ticket (br_ticket);
     the step a helper asks to be allowed (br_prompt); a record that would have been (br_ghost); a log, each row with who really did it
     beside it (br_log); the helper's own setting (br_setting); a sample with names masked (br_sample); the project's page for agents
     (br_page); drafts standing in the sandbox (br_drafts); a place on the university's map (br_map); a ticket's tag on its way (br_tag);
     the corner tag of the opening (br_corner).
   Colours keep the module's meanings: blue tools and structure (the tools that only read, the sandbox, what stays Jun's), violet the
   model thinking, orange data coming back, green a check that passes, amber something wrong (the step that would approve as Jun, the
   record that would have said so, the words hidden in a ticket). Every word is drawn live with ag_T, at least 28 px, above y 890. */

const BL={helper:{x:250,y:228,r:62},person:{x:372,y:700,s:0.8},small:{x:680,y:800,w:1160},tray:{x:1250,y:796,w:760},
  agentR:{x:1640,y:560,r:62}};
// the lab, its marble quieter where this film puts its words: the cards on the right, the helper, the kicker
const BR_QUIET=[[1240,300,640,200,0.5],[1240,580,640,170,0.4],[560,250,250,150,0.35],[420,96,360,46,0.3]];
AG_PLACES.brLab=c=>ag_paintLab(c,{quiet:BR_QUIET});
const BR_KICK=(x,o)=>ag_kicker(x,"3.2","Borrowed rights",o);
// a value worked out once for a chapter (its cues and words), kept on it
function br_once(sc,k,fn){sc.__br=sc.__br||{};if(!(k in sc.__br))sc.__br[k]=fn();return sc.__br[k];}

/* ---------------------------------------------------------------- the corner tag: where and when, at the top left of the opening */
function br_corner(ctx,text,a){if(a<=0)return;const w=ag_tw(ctx,text.toUpperCase(),{w:700,size:30,ls:3})+56;
  ag_box(ctx,72,64,w,62,31,{a:a*0.92});ag_T(ctx,text.toUpperCase(),100,106,{w:700,size:30,ls:3,col:AG.kick,a});}
// the corner tags of a chapter, over its shots: [[from, to, words], ...]
function br_tags(ctx,S,t,list){setScreen(ctx,S);for(const [t0,t1,s] of list){const a=ag_in(t,t0,0.5)*(1-ag_in(t,t1-0.4,0.4));if(a>0)br_corner(ctx,s,a);}}

/* ---------------------------------------------------------------- a person's badge, and the helper that wears it */
// a small portrait in a person's own colours, s px square, its top left at (x, y): their top, their skin, their hair, their glasses
function br_portrait(ctx,x,y,s,who){const P=ag_spec(who),hair=P.hair.c,skin=P.skin,top=P.top.c,cx=x+s*0.5,st=P.hair.style;
  ctx.save();ctx.beginPath();ag_rect(ctx,x,y,s,s,6);ctx.clip();
  let g=ctx.createLinearGradient(0,y,0,y+s);g.addColorStop(0,"#E4E9ED");g.addColorStop(1,"#CBD3DA");ctx.fillStyle=g;ctx.fillRect(x,y,s,s);
  if(st==="long"||st==="bob"){ctx.fillStyle=rgba(hair,1);ctx.beginPath();ag_rect(ctx,cx-s*0.24,y+s*0.22,s*0.48,s*(st==="long"?0.62:0.4),s*0.16);ctx.fill();}
  ctx.fillStyle=rgba(top,1);ctx.beginPath();ctx.ellipse(cx,y+s*1.06,s*0.46,s*0.34,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(ag_dk(skin,0.12),1);ctx.fillRect(cx-s*0.075,y+s*0.6,s*0.15,s*0.16);
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(cx,y+s*0.47,s*0.175,s*0.215,0,0,TAU);ctx.fill();
  const cap=st==="coily"?[0.4,0.21,0.19]:st==="cropped"?[0.37,0.18,0.12]:[0.4,0.195,0.165];
  ctx.fillStyle=rgba(hair,1);ctx.beginPath();ctx.ellipse(cx,y+s*cap[0],s*cap[1],s*cap[2],0,Math.PI,TAU);ctx.closePath();ctx.fill();
  if(P.glasses){ctx.strokeStyle=rgba(P.glasses,0.9);ctx.lineWidth=Math.max(1,s*0.035);for(const dx of [-0.075,0.075]){ctx.beginPath();ctx.arc(cx+s*dx,y+s*0.47,s*0.06,0,TAU);ctx.stroke();}}
  ctx.restore();ctx.strokeStyle="rgba(60,50,40,0.28)";ctx.lineWidth=1.5;ctx.beginPath();ag_rect(ctx,x,y,s,s,6);ctx.stroke();}
// a person's badge on a blue lanyard hanging from (x, y), as they wear it: their staff card, their portrait beside their name. A helper
// on their sign-in wears it (an agent with a name of its own wears its own, ag_badge); o.t sways it a little, o.drop, o.a
function br_badge(ctx,x,y,who,o){o=o||{};const a=o.a==null?1:o.a,P=ag_spec(who),drop=o.drop||46,ps=40,w=ag_tw(ctx,P.name,{w:700,size:28})+48+ps+14,h=64;
  if(a<=0)return{w,h};const sw=Math.sin((o.t||0)*1.3)*0.025;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);
  ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(-8,drop-10);ctx.moveTo(26,0);ctx.lineTo(8,drop-10);ctx.stroke();
  ctx.fillStyle="#9AA0A8";ctx.fillRect(-9,drop-14,18,14);
  ag_box(ctx,-w/2,drop,w,h,10,{});ctx.fillStyle=rgba(AG.blue,0.85);ctx.fillRect(-w/2+10,drop+4,w-20,5);
  br_portrait(ctx,-w/2+16,drop+15,ps,P);ag_T(ctx,P.name,-w/2+16+ps+14,drop+h/2+16,{w:700,size:28});ctx.restore();return{w,h};}
// a glow round a badge hanging at (x, y + drop), w wide, h tall: what says who the agent is, or is taken for, lit
function br_badgeGlow(ctx,x,y,w,h,a,col){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(col||AG.blue,0.8);ctx.shadowBlur=26;
  ctx.strokeStyle=rgba(col||AG.blue,0.9);ctx.lineWidth=4;rr(ctx,x-w/2-6,y-6,w+12,h+12,14);ctx.stroke();ctx.restore();}
// a helper on a person's sign-in: the sphere, its light on the wall, and that person's badge (who) below it; o.at, o.glow (the badge
// lit), o.think, o.core, o.a
function br_helper(ctx,t,who,o){o=o||{};const P_=o.at||BL.helper,a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  const core=o.core==null?1:o.core;ag_modelLight(ctx,P_.x,P_.y,P_.r,core);ag_model(ctx,P_.x,P_.y,P_.r,{t,core,think:o.think||0});
  const hy=P_.y+P_.r+4,drop=o.drop||46,bw=ag_tw(ctx,ag_spec(who).name,{w:700,size:28})+102;
  br_badgeGlow(ctx,P_.x,hy+drop,bw,64,o.glow,o.glowCol);br_badge(ctx,P_.x,hy,who,{t,drop});ctx.restore();}
// an agent with a name of its own: the sphere, its own badge (name), and its owner's tag (o.owner) under the badge, or beside it
// (o.ownerSide "right"); o.at, o.glow, o.ownerA, o.think, o.core, o.a
function br_agent(ctx,t,name,o){o=o||{};const P_=o.at||BL.agentR,a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  const core=o.core==null?1:o.core;ag_modelLight(ctx,P_.x,P_.y,P_.r,core);ag_model(ctx,P_.x,P_.y,P_.r,{t,core,think:o.think||0});
  const hy=P_.y+P_.r+4,drop=o.drop||46,bw=ag_tw(ctx,name,{w:700,size:28})+48;
  br_badgeGlow(ctx,P_.x,hy+drop,bw,58,o.glow,o.glowCol);ag_badge(ctx,P_.x,hy,name,{t,drop});
  if(o.owner){const oa=o.ownerA==null?1:o.ownerA;if(o.ownerSide==="right")br_pillL(ctx,P_.x+bw/2+16,hy+drop+29,o.owner,{size:28,a:oa});
    else ag_pill(ctx,P_.x,hy+drop+58+44,o.owner,{size:28,a:oa});}
  ctx.restore();}
// the one person a moment needs, below the helper, facing the cards; o.at, o.dx, o.p (gaze, nod, talk), o.a; people fade whole
function br_who(ctx,who,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const S=o.at||BL.person;
  withA(ctx,a,()=>ag_person(ctx,who,S.x+(o.dx||0),S.y,S.s,Object.assign({t,gaze:[4,-1]},o.p||{})));}

/* ---------------------------------------------------------------- cards, lists, pills, icons */
function br_card(ctx,x,y,w,kick,title,sub,o){o=o||{};return ag_textCard(ctx,x,y,w,{kick,title,sub},{kickCol:o.kickCol||AG.kick,edge:o.edge,edgeA:o.edgeA,tail:o.tail,a:o.a,k:o.k,icon:o.icon});}
// a pill whose left edge is at x (ag_pill takes its middle)
function br_pillL(ctx,x,y,text,o){o=o||{};const w=ag_tw(ctx,text,{w:700,size:o.size||30})+(o.icon?96:56);return ag_pill(ctx,x+w/2,y,text,o);}
// a circle with a line through it: what a tool may not do
function br_no(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=s*0.12;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,s*0.42,0,TAU);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-s*0.29,y+s*0.29);ctx.lineTo(x+s*0.29,y-s*0.29);ctx.stroke();ctx.restore();}
// an icon by name at (x, y), in a CSS colour: tick, lock, no, warn, draft
function br_icon(ctx,icon,x,y,col){if(icon==="tick")ag_tick(ctx,x,y,20,col,3.6);else if(icon==="lock")ag_lock(ctx,x,y+4,26,col);else if(icon==="no")br_no(ctx,x,y,26,col);
  else if(icon==="warn")ag_warn(ctx,x,y,28,col);else if(icon==="draft")ag_pen(ctx,x,y,26,col);}
// a line of a list or a card: [{t, a, icon, col (the icon's colour, or the words' when there's no icon), tc (the words' colour)}]
// a line's words come in once its gap has opened (its a past 0.35), so a card grows, then each line types in
function br_row(ctx,l,x,ly,o){const la=clamp(((l.a==null?1:l.a)-0.35)/0.65,0,1);if(la<=0)return;const ic=l.icon||(l.tick?"tick":null),col=l.col||(ic==="tick"?AG.green:AG.blue);
  if(ic){ctx.save();ctx.globalAlpha*=la;br_icon(ctx,ic,x+14,ly-10,rgba(col,1));ctx.restore();}
  ag_T(ctx,l.t,x+(ic?44:0),ly,{w:700,size:30,col:l.tc||(l.col&&!ic?l.col:AG.ink),a:la});}
// how far a card's lines reach, in lines: each line opens its gap as it comes in (over the first 60% of its a), and the card reaches
// the furthest one; l.slot is a line's place (a line that takes another's place, in the same slot, doesn't grow the card)
function br_reach(lines){let r=0;lines.forEach((l,i)=>{const a=l.a==null?1:l.a,s=l.slot==null?i:l.slot;if(a>0)r=Math.max(r,s+ag_sine(clamp(a/0.6,0,1)));});return r;}
// a card of lines that come in one by one: kick, then lines, each 46 px, the card growing as each comes in; returns its box
function br_list(ctx,x,y,w,kick,lines,o){o=o||{};const h=64+br_reach(lines)*46+14,a=o.a==null?1:o.a;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:o.edgeA==null?0.5:o.edgeA,glow:o.glow?(o.edge||AG.blue):null,glowA:o.glow||0});
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+48,{w:700,size:28,ls:3,col:o.kickCol||AG.blue});
  lines.forEach((l,i)=>br_row(ctx,l,x+28,y+64+(l.slot==null?i:l.slot)*46+34,o));ctx.restore();return{x,y,w,h};}
// a card with a kick, a title (wrapped, 36 px, or o.tsize) and lines under it (as br_list's, growing as they come in); o.edge, o.edgeA, o.glow, o.kickCol,
// o.tcol (the title's colour), o.k, o.a; o.measure only measures it. Returns its box
function br_doc(ctx,x,y,w,kick,title,lines,o){o=o||{};lines=lines||[];const ts=o.tsize||36,lh=ts+8,tl=title?ag_wrap(ctx,title,w-56,{w:700,size:ts}):[],
    top=kick?66:28,h=top+tl.length*lh+br_reach(lines)*46+(kick||tl.length?28:14),a=o.a==null?1:o.a,b={x,y,w,h};if(a<=0||o.measure)return b;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:o.edgeA==null?0.6:o.edgeA,glow:o.glow?(o.edge||AG.blue):null,glowA:o.glow||0});
  if(kick)ag_T(ctx,String(kick).toUpperCase(),x+28,y+50,{w:700,size:28,ls:3,col:o.kickCol||AG.kick});
  let yy=y+top;for(const l of tl){yy+=lh;ag_T(ctx,l,x+28,yy,{w:700,size:ts,col:o.tcol||AG.ink});}
  lines.forEach((l,i)=>br_row(ctx,l,x+28,yy+46*((l.slot==null?i:l.slot)+1)-4,o));ctx.restore();return b;}
// a ticket: its kick (TICKET, or o.kick) and what it asks for
function br_ticket(ctx,x,y,w,text,o){o=o||{};return br_doc(ctx,x,y,w,o.kick||"Ticket",text,o.lines,Object.assign({kickCol:AG.blue,tsize:32,edge:AG.blue,edgeA:0.35},o));}

/* ---------------------------------------------------------------- the step a helper asks to be allowed, and the record that would have been */
// a card asking to allow a step: o.kick (above), o.title (the step), o.warn (amber: the step is wrong), o.allow and o.deny (0 to 1: that
// button lit, Don't allow in green with a tick), o.stack (0 to 1: the steps allowed before it, a pile of cards behind); returns its box
function br_prompt(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=266,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  const n=Math.round(clamp(o.stack||0,0,1)*7);for(let i=n;i>=1;i--)ag_box(ctx,x+i*8,y-i*8,w,h,22,{});
  const col=o.warn?AG.amber:AG.violet;
  ag_box(ctx,x,y,w,h,22,{edge:col,edgeA:0.75,glow:o.warn?AG.amber:null,glowA:o.warn?0.55:0});
  ag_T(ctx,String(o.kick||"Allow this step?").toUpperCase(),x+28,y+50,{w:700,size:28,ls:3,col});
  ag_T(ctx,o.title||"",x+28,y+112,{w:700,size:38,col:o.warn?AG.amber:AG.ink});
  const by=y+h-66,bw=(w-56-20)/2;
  [["Allow",o.allow||0,AG.violet],["Don't allow",o.deny||0,AG.green]].forEach(([s,lit,bc],i)=>{const bx=x+28+i*(bw+20);
    ag_box(ctx,bx,by-30,bw,60,30,{edge:lit>0.02?bc:null,edgeA:0.9*lit,glow:lit>0.02?bc:null,glowA:lit});
    if(i===1&&lit>0.02){ctx.save();ctx.globalAlpha*=lit;ag_tick(ctx,bx+40,by,22,rgba(bc,1),3.6);ctx.restore();}
    ag_T(ctx,s,bx+bw/2+(i===1?14*lit:0),by+10,{w:700,size:30,align:"center",col:lit>0.5?bc:AG.ink});});
  ctx.restore();return b;}
// a record that would have been: a card in dashes, a little see-through, its words in amber
function br_ghost(ctx,x,y,w,kick,title,o){o=o||{};const a=o.a==null?1:o.a,h=title?150:94,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ctx.fillStyle="rgba(243,241,237,0.86)";rr(ctx,x,y,w,h,22);ctx.fill();
  ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=3;ctx.setLineDash([12,9]);rr(ctx,x,y,w,h,22);ctx.stroke();ctx.setLineDash([]);
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+50,{w:700,size:28,ls:3,col:AG.amber});
  if(title)ag_T(ctx,title,x+28,y+112,{w:700,size:38,col:AG.amber});ctx.restore();return b;}

/* ---------------------------------------------------------------- a log, and who really did each step */
// a log: kick, and rows [{at, who, what, by (a person, or "agent"), a}]; o.by (0 to 1) shows, beside each row, who really did it, under
// the words WHO DID IT; returns its box
function br_log(ctx,x,y,w,kick,rows,o){o=o||{};const a=o.a==null?1:o.a,h=64+rows.length*48+18,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.5});
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+48,{w:700,size:28,ls:3,col:AG.blue});
  const by=clamp(o.by||0,0,1),ww=Math.max(...rows.map(r=>ag_tw(ctx,r.who,{w:700,size:30})))+26,aw=ag_tw(ctx,"00:00",{w:500,size:28,f:"mono"})+24;
  if(by>0)ag_T(ctx,"WHO DID IT",x+w-28,y+48,{w:700,size:28,ls:3,align:"right",col:AG.violet,a:by});
  rows.forEach((r,i)=>{const ra=r.a==null?1:r.a;if(ra<=0)return;const ly=y+64+i*48+36;
    ag_T(ctx,r.at,x+28,ly,{w:500,size:28,f:"mono",col:AG.mut,a:ra});ag_T(ctx,r.who,x+28+aw,ly,{w:700,size:30,a:ra});ag_T(ctx,r.what,x+28+aw+ww,ly,{w:500,size:30,a:ra});
    const s=by*ra;if(s>0&&r.by){ctx.save();ctx.globalAlpha*=s;const mx=x+w-76,my=ly-10;
      if(r.by==="agent")ag_model(ctx,mx,my,17,{core:1});else br_portrait(ctx,mx-18,my-18,36,r.by);ctx.restore();}});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the helper's own setting, a sample, the project's page */
// the helper's own setting: two choices with a dot on the one that's on (o.sel 0: ask before each step; 1: go on without asking; between
// them the dot moves); returns its box
function br_setting(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=64+2*58+20,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,"THE HELPER'S OWN SETTING",x+28,y+48,{w:700,size:28,ls:3,col:AG.kick});
  ["Ask before each step","Go on without asking"].forEach((s,i)=>{const cy=y+64+i*58+30;ctx.strokeStyle=rgba(AG.mut,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+46,cy,14,0,TAU);ctx.stroke();
    ag_T(ctx,s,x+78,cy+11,{w:700,size:30});});
  const dy=lerp(y+94,y+152,ag_sine(clamp(o.sel||0,0,1)));ctx.fillStyle=rgba(AG.ink,0.9);ctx.beginPath();ctx.arc(x+46,dy,8,0,TAU);ctx.fill();
  ctx.restore();return b;}
// a sample a tool gives back: kick, its columns and its rows, each name masked; o.p (0 to 1) brings the rows in; returns its box
const BR_SAMPLE={cols:["Name","School","Casual"],rows:[["••••••","Nursing","yes"],["•••••••","Midwifery","no"],["•••••","Public Health","no"]]};
function br_sample(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,R=BR_SAMPLE.rows,h=64+48+R.length*46+18,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.orange,edgeA:0.55});
  ag_T(ctx,"A SAMPLE · 20 ROWS AT MOST",x+28,y+48,{w:700,size:28,ls:3,col:AG.orange});
  const cx=[x+28,x+250,x+w-150];BR_SAMPLE.cols.forEach((c,i)=>ag_T(ctx,c,cx[i],y+100,{w:600,size:28,col:AG.mut}));
  ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(x+28,y+116,w-56,1.5);
  R.forEach((r,j)=>{const ra=clamp((o.p==null?1:o.p)*R.length-j,0,1);if(ra<=0)return;const ly=y+112+j*46+42;r.forEach((v,i)=>ag_T(ctx,v,cx[i],ly,{w:j===0&&i===0?700:600,size:30,col:i===0?AG.mut:AG.ink,a:ra}));});
  ctx.restore();return b;}
// the project's page for agents: its file's name, a section's heading and its lines (o.p 0 to 1 brings them in, one by one)
function br_page(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,L=o.lines||[],h=150+L.length*46+16,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ctx.save();ctx.shadowColor=AG.card.shadow;ctx.shadowBlur=30;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=14;ctx.fillStyle="#FAF9F6";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.fillStyle=rgba(AG.blue,0.85);ctx.fillRect(x,y,w,6);
  ag_T(ctx,"AGENTS.md",x+32,y+56,{w:500,size:28,f:"mono",col:AG.mut});
  ag_T(ctx,o.head||"On a person's sign-in",x+32,y+114,{w:700,size:36});
  const p=o.p==null?1:o.p;L.forEach((l,i)=>{const la=clamp(p*L.length-i,0,1);if(la<=0)return;const ly=y+170+i*46;
    ctx.fillStyle=rgba(AG.ink,0.75*la);ctx.beginPath();ctx.arc(x+46,ly-10,4.5,0,TAU);ctx.fill();ag_T(ctx,l,x+66,ly,{w:600,size:30,a:la});});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the sandbox's drafts, a ticket's tag, a place on the map */
// drafts standing in the sandbox's tray (box: its inside, as ag_sandbox returns it): small cards, each with a pen and its words,
// list [[text, a], ...], each as wide as its words, side by side in the middle of the tray
function br_drafts(ctx,box,list){if(!box)return;const n=list.length,gap=24,h=74,ws=list.map(([s])=>ag_tw(ctx,s,{w:700,size:28})+86),tot=ws.reduce((p,q)=>p+q,0)+gap*(n-1);
  let xx=box.x+(box.w-tot)/2;
  list.forEach(([s,a],i)=>{const w=ws[i],x=xx;xx+=w+gap;if(!(a>0))return;const y=box.y+box.h-h-4+(1-ag_eo(a))*20;
    ctx.save();ctx.globalAlpha*=clamp(a*1.4,0,1);ag_box(ctx,x,y,w,h,12,{edge:AG.blue,edgeA:0.45});ag_pen(ctx,x+32,y+h/2,24,rgba(AG.blue,1));
    ag_T(ctx,s,x+58,y+h/2+10,{w:700,size:28});ctx.restore();});}
// a ticket's tag: a pill with a small square at its left (blue), centred on (x, y); o.a, o.k, o.glow
function br_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||AG.blue,w=ag_tw(ctx,text,{w:700,size:28})+72,h=54;if(a<=0)return{x:x-w/2,y:y-h/2,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.5,1,o.k));
  ag_box(ctx,x-w/2,y-h/2,w,h,h/2,{edge:col,edgeA:0.75,glow:o.glow?col:null,glowA:o.glow||0});
  ctx.fillStyle=rgba(col,0.9);rr(ctx,x-w/2+20,y-8,16,16,4);ctx.fill();ag_T(ctx,text,x-w/2+48,y+10,{w:700,size:28});ctx.restore();return{x:x-w/2,y:y-h/2,w,h};}
// the tag on its way from a to b (u 0 to 1), lifted a little in the middle
function br_tagMove(ctx,a,b,u,text,o){const k=ag_sine(u),x=lerp(a.x,b.x,k),y=lerp(a.y,b.y,k)-Math.sin(Math.PI*clamp(u,0,1))*50;return br_tag(ctx,x,y,text,o);}
// a place on the university's map: the service, the role in it and the agent assigned to that role, three cards linked from top to
// bottom, each coming in as o.p passes its third; o.glow lights the agent's; o.a, o.t
function br_map(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const p=o.p==null?1:o.p,t=o.t||0;ctx.save();ctx.globalAlpha*=a;
  ag_T(ctx,"THE UNIVERSITY'S MAP",x,y+28,{w:700,size:28,ls:3,col:AG.blue});
  const C=[["Service","Change a data product"],["Role","Planning contributor"],["Agent","planning agent"]],h=112,gap=46;let yy=y+52;
  C.forEach(([k,s],i)=>{const ca=clamp(p*3-i,0,1);if(ca<=0){yy+=h+gap;return;}ctx.save();ctx.globalAlpha*=ca;
    if(i>0){ctx.strokeStyle=rgba(AG.blue,0.6);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x+70,yy-gap+4);ctx.lineTo(x+70,yy-6);ctx.stroke();ag_arrowHead(ctx,x+70,yy-6,Math.PI/2,9,rgba(AG.blue,0.8));}
    const ag=i===2;ag_box(ctx,x,yy,w,h,20,{edge:AG.blue,edgeA:ag?0.5+0.4*(o.glow||0):0.45,glow:ag&&o.glow?AG.blue:null,glowA:o.glow||0});
    ag_T(ctx,k.toUpperCase(),x+28,yy+44,{w:700,size:28,ls:3,col:AG.blue});ag_T(ctx,s,x+28,yy+88,{w:700,size:34});
    if(ag)ag_model(ctx,x+w-56,yy+h/2,26,{t,core:1});ctx.restore();yy+=h+gap;});
  ctx.restore();}

/* ===== Borrowed rights: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice.
   The opening moves between three rooms of Britain before 1840: a member's writing table seen close (brDesk), his study (brStudy, and
   brStudyOpen, the same room further in, with no table in front) and the letter office (brOffice). Each change of room dissolves; in
   the letter office the camera glides on, and a year later (later:true) what was there leaves before the year's letters come in. The
   corner tag is drawn over the shots.
   The lab is one room. From the opening's last shot to the end, a helper floats above its person at the left, wearing that person's
   badge, and the cards stand on the right; each chapter opens where the last one ends (ag_cutInto), so the camera never moves and
   only what changes fades. Lucía's first day and the planning agent's are later moments in it (later:true): what was there leaves
   first, so two helpers are never seen at once. The kicker is drawn over the lab's shots, so it stays put through them. */

// a cover held in a hand (in figure space, at the near hand), as ag_person's hold draws it
function br_held(o){return (c,h)=>{const [x,y]=h.near;br_cover(c,x-22,y-92,150,Object.assign({rot:-0.14},o));};}
const BR_DESK={cv:{x:900,y:250,w:800}};
const BR_LUCIA={name:"Lucía Ortega",key:"br_lucia",role:"Planning",skin:[206,160,124],hair:{style:"long",c:[48,32,26]},earrings:[208,214,226],top:{kind:"sweater",c:[84,88,96]},breath:0.29};
// the kicker over the lab's shots, at a
function br_kick(ctx,S,a){setScreen(ctx,S);BR_KICK(ctx,{a});}

/* ---------------------------------------------------------------- 1 · A name that travels free */
scene("frank",(ctx,S,t,sc)=>{const c=sc.cues,P=br_once(sc,"P",()=>({sealed:wAt(sc,"folded","sealed"),person:wAt(sc,"folded","the person"),pays:wAt(sc,"folded","pays"),
    further:wAt(sc,"costs","further"),sheets:wAt(sc,"costs","more sheets"),free:wAt(sc,"member","free"),name:wAt(sc,"frank","his name"),carried:wAt(sc,"frank","carries it"),
    priv:wAt(sc,"holds","his privilege"),given:wAt(sc,"blank","given away"),sold:wAt(sc,"blank","sold"),copied:wAt(sc,"blank","copied"),
    freeL:wAt(sc,"carries","free letters"),dearly:wAt(sc,"carries","pays dearly"),really:wAt(sc,"tell","who really sent"),
    addr:wAt(sc,"y1764","the whole address"),town:wAt(sc,"y1784","the town"),words:wAt(sc,"y1784","the day in words"),posted:wAt(sc,"y1784","posted that same day"),
    seven:wAt(sc,"gap","seven million"),cheap:wAt(sc,"hill","a cheap post"),pennyP:wAt(sc,"penny","the penny post"),bySender:wAt(sc,"penny","paid by its sender"),
    s76:wAt(sc,"double","seventy-six"),s170:wAt(sc,"double","a hundred and seventy"),cheapE:wAt(sc,"own","cheap"),every:wAt(sc,"own","every letter"),
    sign:wAt(sc,"uni","his sign-in"),everything:wAt(sc,"uni","everything"),sand:wAt(sc,"learn","in a sandbox"),own2:wAt(sc,"name","a name of its own")}));
  const V=BR_DESK.cv;
  ag_shots(ctx,S,t,sc.dur,[
    // Britain, in the 1700s: a letter is a folded sheet, sealed with wax (the seal pressed on its back), and the person who receives it
    // pays (it turns over: the address, and the charge written in its corner); more for every mile, and every sheet
    {at:0,place:"brDesk",keys:[[0,1060,500,1.12],[0.3,960,540,1.0]],d:6,push:0.01,draw:(x,tt)=>{
      br_cover(x,V.x,V.y,V.w,{flip:ag_sine((tt-P.person+0.7)/0.9),p:{seal:ag_in(tt,P.sealed-0.2,0.5),addr:1,charge:clamp((tt-P.pays)/0.9,0,1)},rot:-0.02,a:ag_in(tt,0.2,0.8)});
      br_list(x,230,250,620,"A letter",[{t:"A folded sheet, sealed with wax",a:ag_in(tt,c.folded,0.4)},{t:"The person who receives it pays",a:ag_in(tt,P.person,0.4)},
        {t:"More, the further it travels",a:ag_in(tt,P.further,0.4)},{t:"More, for every sheet it holds",a:ag_in(tt,P.sheets,0.4)}],
        {a:ag_in(tt,c.folded,0.5)*(1-ag_in(tt,c.member-0.7,0.4)),k:ag_spr(tt,c.folded)});}},
    // but a member of parliament may send his letters free: the member in his study, behind his writing table
    {at:c.member,place:"brStudy",keys:[[c.member,1060,540,1.04]],push:0.02,draw:(x,tt)=>{
      br_person(x,BR_P.member,1250,600,1.0,{t:tt,cut:BR_STUDY.cut,gaze:[3,0]});
      br_card(x,150,200,600,"A member of parliament","May send his letters free",null,{kickCol:AG.blue,a:ag_in(tt,P.free-0.4,0.4)*(1-ag_in(tt,c.frank-0.7,0.4)),k:ag_spr(tt,P.free-0.4)});}},
    // he writes his name on the cover, and the post carries it for nothing: a frank; so whoever holds a cover he has signed can use his privilege
    {at:c.frank,place:"brDesk",keys:[[c.frank,960,540,1.02]],push:0.02,draw:(x,tt)=>{
      br_cover(x,V.x,V.y,V.w,{p:{addr:1,frank:clamp((tt-P.name+0.2)/1.4,0,1)},rot:0.015});
      br_list(x,230,250,620,"A frank",[{t:"His name on the cover",a:ag_in(tt,P.name,0.4)},{t:"Carried for nothing",a:ag_in(tt,P.carried,0.4)}],
        {a:ag_in(tt,P.name-0.3,0.4)*(1-ag_in(tt,c.family-0.7,0.4)),k:ag_spr(tt,P.name-0.3)});
      br_card(x,230,500,620,"So whoever holds it","Can use his privilege",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,a:ag_in(tt,c.holds,0.4)*(1-ag_in(tt,c.family-0.7,0.4)),k:ag_spr(tt,c.holds)});}},
    // members sign covers for family and friends: his sister holds one he has signed
    {at:c.family,place:"brStudyOpen",keys:[[c.family,1000,540,1.03]],push:0.02,draw:(x,tt)=>{
      br_person(x,BR_P.member,1250,610,1.0,{t:tt,gaze:[3,0]});
      br_person(x,BR_P.sister,880,628,0.97,{t:tt,pose:"hold",hold:br_held({p:{frank:1},blank:true}),gaze:[4,1]});
      br_card(x,150,200,560,"Members sign covers","For family and friends",null,{kickCol:AG.blue,a:ag_in(tt,c.family+0.2,0.4)*(1-ag_in(tt,c.blank-0.7,0.4)),k:ag_spr(tt,c.family+0.2)});}},
    // signed blank covers are given away, even sold (a penny beside one), and signatures are copied (another hand, in amber)
    {at:c.blank,place:"brDesk",keys:[[c.blank,960,540,1.0]],push:0.02,draw:(x,tt)=>{const out=1-ag_in(tt,c.carries-0.7,0.4);
      [[280,330,-0.07],[700,262,0.03],[1120,342,0.08]].forEach(([cx,cy,r],i)=>{const tin=c.blank+0.2+i*0.35;br_cover(x,cx,cy,520,{p:{frank:1},blank:true,rot:r,a:ag_in(tt,tin,0.4),k:ag_spr(tt,tin,0.7)});});
      br_coin(x,1000,640,30,ag_in(tt,P.sold,0.4));
      br_cover(x,1220,470,480,{p:{frank:1},blank:true,copied:true,rot:-0.05,edge:AG.amber,a:ag_in(tt,P.copied-0.2,0.4),k:ag_spr(tt,P.copied-0.2,0.7)});
      const g=br_pillL(x,230,196,"given away",{a:ag_in(tt,P.given,0.4)*out}),s=br_pillL(x,g.x+g.w+16,196,"even sold",{a:ag_in(tt,P.sold,0.4)*out});
      br_pillL(x,s.x+s.w+16,196,"signatures copied",{icon:"warn",col:AG.amber,a:ag_in(tt,P.copied,0.4)*out});}},
    // the post carries free letters no member ever sent, while everyone else pays dearly; and nobody can tell who really sent a franked
    // letter: the clerk of the letter office, a franked cover in his hand, and the year's letters piled on the counter
    {at:c.carries,place:"brOffice",keys:[[c.carries,960,540,1.0]],push:0.02,draw:(x,tt)=>{const out=1-ag_in(tt,c.rules-0.7,0.4);
      br_person(x,BR_P.clerk17,640,600,1.0,{t:tt,pose:"hold",hold:br_held({p:{addr:1,frank:1}}),gaze:[4,1]});
      br_pile(x,1250,BR_OFFICE.top,230,clamp((tt-c.carries)/1.6,0,1),{free:true,seed:5,max:20,lh:13});
      br_pile(x,1560,BR_OFFICE.top,230,clamp((tt-P.dearly+0.3)/0.9,0,1)*0.35,{seed:9,max:20,lh:13});
      br_pillL(x,1080,500,"free letters no member sent",{icon:"warn",col:AG.amber,a:ag_in(tt,P.freeL,0.4)*out});
      ag_pill(x,1560,670,"everyone else pays dearly",{a:ag_in(tt,P.dearly,0.4)*out});
      br_card(x,1080,150,600,"And nobody can tell","Who really sent it?",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,a:ag_in(tt,P.really-0.2,0.4)*out,k:ag_spr(tt,P.really-0.2)});}},
    // rules try to narrow it: from 1764, the whole address in his own hand (written on); from 1784, the town and the date as well, the
    // day in words, and the letter posted that same day
    {at:c.rules,place:"brDesk",keys:[[c.rules,960,540,1.02]],push:0.02,draw:(x,tt)=>{const out=1-ag_in(tt,c.gap-0.7,0.4);
      br_cover(x,980,280,700,{p:{addr:clamp((tt-P.addr+0.2)/2.2,0,1),date:clamp((tt-P.town)/1.8,0,1),frank:1},rot:-0.015});
      br_list(x,230,250,700,"Rules to narrow it",[{t:"1764 · the whole address in his hand",a:ag_in(tt,c.y1764,0.4)},{t:"1784 · the town and the date as well",a:ag_in(tt,c.y1784,0.4)},
        {t:"The day in words",a:ag_in(tt,P.words,0.4)},{t:"Posted that same day",a:ag_in(tt,P.posted,0.4)}],{a:ag_in(tt,c.rules,0.5)*out,k:ag_spr(tt,c.rules)});}},
    // still, the gap stays open: in the 1830s, about seven million letters a year travel free; something had to change
    {at:c.gap,place:"brOffice",keys:[[c.gap,960,540,1.0],[c.change,1100,560,1.06]],d:3,push:0.02,draw:(x,tt)=>{const out=1-ag_in(tt,c.hill-0.7,0.4);
      br_person(x,BR_P.clerk,640,600,1.0,{t:tt,gaze:[4,0]});
      br_pile(x,1250,BR_OFFICE.top,230,clamp((tt-c.gap)/1.4,0,1),{free:true,seed:5,max:26,lh:13});
      br_pile(x,1560,BR_OFFICE.top,230,0.35,{seed:9,max:20,lh:13});
      br_card(x,1080,150,620,"Still, the gap stays open","About 7 million letters a year travel free",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,a:ag_in(tt,P.seven-0.3,0.4)*out,k:ag_spr(tt,P.seven-0.3)});}},
    // a schoolmaster, Rowland Hill, argues for a cheap post that the sender pays (his pamphlet of 1837); Parliament agrees
    {at:c.hill,place:"brDesk",keys:[[c.hill,960,540,1.02]],push:0.02,draw:(x,tt)=>{const out=1-ag_in(tt,c.penny-0.7,0.4),u=ag_eo((tt-c.hill-0.1)/1.3);
      br_pamphlet(x,lerp(1460,1020,u),200,420,{rot:lerp(0.12,-0.03,u),a:ag_in(tt,c.hill,0.4)});
      br_card(x,230,250,640,"Rowland Hill · a schoolmaster","A cheap post, paid by its sender",null,{kickCol:AG.blue,a:ag_in(tt,P.cheap-0.3,0.4)*out,k:ag_spr(tt,P.cheap-0.3)});
      br_pillL(x,230,470,"Parliament agrees",{icon:"tick",a:ag_in(tt,c.parl,0.4)*out});}},
    // on 10 January 1840 the penny post begins: the notice on the office's wall, its lines one by one, and a woman who posts a letter
    // before it; and franking ends
    {at:c.penny,place:"brOffice",keys:[[c.penny,1000,520,1.02]],push:0.02,draw:(x,tt)=>{
      br_notice(x,{p:clamp((tt-P.pennyP+0.3)/3.2,0,1),a:ag_in(tt,c.penny,0.5)});
      br_person(x,BR_P.sender,1000,650,1.05,{t:tt,pose:"hold",hold:br_held({p:{addr:1}}),gaze:[4,-1]});
      ag_pill(x,1375,600,"Franking ends",{a:ag_in(tt,c.ends,0.4)});}},
    // in a year, letters more than double: a year later, in the same office, 1839's letters beside 1840's
    {at:c.double,place:"brOffice",later:true,keys:[[c.double,1000,520,1.02],[c.double+0.6,1100,560,1.04]],d:3,push:0.01,draw:(x,tt)=>{
      br_person(x,BR_P.clerk,640,600,1.0,{t:tt,gaze:[4,0]});
      br_stacks(x,1250,1560,BR_OFFICE.top,{p:[clamp((tt-P.s76+0.3)/0.9,0,1),clamp((tt-P.s170+0.3)/1.2,0,1)]});}},
    // a letter is cheap for everyone, and every letter pays its own way: the red PAID on a cover, a penny beside it
    {at:c.own,place:"brDesk",keys:[[c.own,960,540,1.02]],push:0.02,draw:(x,tt)=>{
      br_cover(x,V.x,V.y,V.w,{p:{addr:1,paid:ag_in(tt,P.every-0.1,0.25)},rot:0.01});
      br_coin(x,820,700,34,ag_in(tt,c.own+0.3,0.4));
      br_list(x,230,250,600,"The penny post",[{t:"Cheap for everyone",tick:true,a:ag_in(tt,P.cheapE,0.4)},{t:"Every letter pays its own way",tick:true,a:ag_in(tt,P.every,0.4)}],
        {edge:AG.green,a:ag_in(tt,c.own,0.5)*(1-ag_in(tt,c.uni-0.7,0.4)),k:ag_spr(tt,c.own)});}},
    // today, at the university, Jun's helper works on his sign-in, wearing his badge, with everything Jun may do; narrowed, it learns
    // in a sandbox; and once it works for the team, it needs a name of its own (the planning agent, with its own badge)
    {at:c.uni,place:"brLab",keys:[[c.uni,960,540,1]],push:0,draw:(x,tt)=>{const out=1-ag_in(tt,c.breath+0.1,0.6);
      withA(x,out,()=>{const box=ag_sandbox(x,BL.tray.x,BL.tray.y,BL.tray.w,{a:ag_in(tt,P.sand-0.3,0.6)});br_drafts(x,box,[["a draft",ag_in(tt,P.sand+0.4,0.5)]]);
        br_agent(x,tt,"planning agent",{at:{x:1640,y:300,r:62},a:ag_in(tt,c.name,0.6),glow:ag_io(tt,P.own2,P.own2+2.4,0.4)});});
      br_who(x,"jun",tt,{a:ag_in(tt,c.uni+0.2,0.6)});
      br_helper(x,tt,"jun",{a:ag_in(tt,c.uni+0.4,0.6),glow:ag_io(tt,P.sign,P.sign+2.2,0.4),think:ag_io(tt,c.learn,c.name,0.5)});
      ag_roomLight(x,1);
      withA(x,out,()=>{br_card(x,640,140,620,"The university · today","Jun's AI helper, on his sign-in",null,{kickCol:AG.blue,a:ag_in(tt,c.uni+0.5,0.4),k:ag_spr(tt,c.uni+0.5)});
        br_pillL(x,640,390,"everything Jun may do",{icon:"warn",col:AG.amber,a:ag_io(tt,P.everything,c.learn+0.4,0.4)});
        br_pillL(x,640,390,"narrowed: it learns in a sandbox",{icon:"lock",col:AG.blue,a:ag_in(tt,c.learn+0.6,0.4)});});}}
  ],0.6);
  br_tags(ctx,S,t,[[0.6,c.gap,"Britain · 1700s"],[c.gap+0.6,c.hill,"Britain · 1830s"],[c.hill+0.6,c.uni,"Britain · 1837 to 1840"]]);
  br_kick(ctx,S,ag_in(t,c.uni+0.6,0.6));
  ag_title(ctx,S,t,c.breath,"Borrowed rights","an AI helper on a person's sign-in, and how to narrow it","FILM 2 OF 7 · FROM HELPER TO COLLEAGUE");});

/* ---------------------------------------------------------------- the stages on the right, as chapters 2 and 3 share them
   The five stages, small, at the right: the first three lit while lit (0 to 1), the one a line is about lit more (focus [3]); over the
   first three, a bracket with its words (words [[text, a, o]]) */
function br_startStages(x,tt,o){const L=BL.small,f=o.focus||[0,0,0],base=o.lit||0,
    st=br_stages(x,L.x,L.y,L.w,{short:1,a:o.a==null?1:o.a,k:o.k,lit:[0,1,2].map(i=>Math.max(base*0.45,f[i])).concat([0,0]),dim:0.6*(o.dim||0)});
  const S0=st.stages[0],S2=st.stages[2],by=S2.y-30,ba=(o.bracket||0)*(o.a==null?1:o.a);
  if(ba>0){x.save();x.globalAlpha*=ba;x.strokeStyle=rgba(AG.blue,0.75);x.lineWidth=3;x.lineCap="round";x.beginPath();
    x.moveTo(S0.x,by+16);x.lineTo(S0.x,by);x.lineTo(S2.x+S2.w,by);x.lineTo(S2.x+S2.w,by+16);x.stroke();x.restore();}
  for(const [s,a,po] of o.words||[])ag_pill(x,(S0.x+S2.x+S2.w)/2,by-40,s,Object.assign({a:a*ba,size:28},po||{}));
  return st;}

/* ---------------------------------------------------------------- 2 · Where everyone starts */
scene("start",(ctx,S,t,sc)=>{const c=sc.cues,P=br_once(sc,"P",()=>({sign:wAt(sc,"every","the sign-in"),setup:wAt(sc,"quick","nothing to set up"),whatever:wAt(sc,"quick","whatever"),
    col:wAt(sc,"tickets","a new column"),filter:wAt(sc,"tickets","a filter"),mart:wAt(sc,"tickets","a new mart"),
    runs:wAt(sc,"s1","runs nothing"),acc:wAt(sc,"s1","Jun accepts"),cmd:wAt(sc,"s2","it runs"),allows:wAt(sc,"s2","Jun allows"),alone:wAt(sc,"s3","it works alone"),checks:wAt(sc,"s3","Jun checks"),
    much:wAt(sc,"each","how much"),what:wAt(sc,"each","what Jun does"),stays:wAt(sc,"each","The sign-in stays")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"brLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      const sa=ag_in(tt,c.three,0.4),focus=[[c.s1,c.s2],[c.s2,c.s3],[c.s3,c.each]].map(([a,b])=>ag_io(tt,a+0.1,b-0.1,0.4)),
        allLit=ag_in(tt,c.each,0.6);
      br_startStages(x,tt,{a:sa,k:[0,1,2,3,4].map(i=>ag_spr(tt,c.three+0.2+0.22*i)),lit:Math.max(ag_in(tt,c.three+1.2,0.6),allLit*2.2),
        focus:focus.map(f=>Math.max(f,allLit)),dim:ag_in(tt,c.three+1.2,0.6),bracket:ag_in(tt,c.three+1.4,0.5),
        words:[["on the person's sign-in",1-ag_in(tt,P.stays-0.2,0.4)],["The sign-in stays Jun's",ag_in(tt,P.stays,0.4),{col:AG.blue}]]});
      br_who(x,"jun",tt,{});
      br_helper(x,tt,"jun",{glow:Math.max(ag_io(tt,P.sign,P.sign+2.4,0.4),ag_in(tt,P.stays,0.5)),think:ag_io(tt,c.tickets,c.three,0.5)});
      ag_roomLight(x,1);
      const e=1-ag_in(tt,c.tickets-0.5,0.4);
      br_card(x,640,140,700,"In an editor or a chat","An AI helper starts on its person's sign-in",null,{kickCol:AG.blue,a:ag_in(tt,c.every+0.2,0.4)*e,k:ag_spr(tt,c.every+0.2)});
      br_pillL(x,640,390,"nothing to set up",{icon:"tick",a:ag_in(tt,P.setup,0.4)*e});
      br_pillL(x,640,470,"whatever that person can do",{a:ag_in(tt,P.whatever,0.4)*e});
      // Planning's tickets, through 2026: a new column, a filter, a new mart
      const tk=1-ag_in(tt,c.three-0.5,0.4);
      ag_label(x,640,170,"Planning's tickets, through 2026",{a:ag_in(tt,c.tickets,0.4)*tk});
      [["A new column",P.col],["A filter",P.filter],["A new mart",P.mart]].forEach(([s,w],i)=>br_ticket(x,640+i*400,200,370,s,{a:ag_in(tt,w-0.2,0.4)*tk,k:ag_spr(tt,w-0.2)}));
      // each of the first three stages: what the helper does, and what Jun does
      const L1=[["Stage 1 · suggests","Drafts, and runs nothing",P.runs,"Jun accepts or rejects every line",P.acc,c.s1,c.s2],
        ["Stage 2 · step by step","Runs a query or a command",P.cmd,"Jun allows each one",P.allows,c.s2,c.s3],
        ["Stage 3 · within limits","Works alone",P.alone,"Jun checks the result",P.checks,c.s3,c.each]];
      for(const [k,l1,w1,l2,w2,t0,t1] of L1)br_list(x,640,140,640,k,[{t:l1,a:ag_in(tt,w1-0.3,0.4)},{t:l2,a:ag_in(tt,w2-0.2,0.4)}],{a:ag_io(tt,t0+0.1,t1-0.2,0.4),k:ag_spr(tt,t0+0.1)});
      br_list(x,640,140,640,"Each stage changes",[{t:"How much it may do",a:ag_in(tt,P.much-0.2,0.4)},{t:"What Jun does",a:ag_in(tt,P.what-0.2,0.4)}],{a:ag_in(tt,c.each+0.1,0.4),k:ag_spr(tt,c.each+0.1)});}}
  ],0.6);
  br_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 3 · Everything Jun can do */
scene("wide",(ctx,S,t,sc)=>{const c=sc.cues,P=br_once(sc,"P",()=>({builds:wAt(sc,"wide","he builds"),reviews:wAt(sc,"wide","reviews"),approves:wAt(sc,"wide","approves"),
    every:wAt(sc,"all","at every stage"),proposed:wAt(sc,"whose","proposed"),checks:wAt(sc,"review","its checks"),asJun:wAt(sc,"next","as Jun Park"),
    reads:wAt(sc,"no","says no"),noor:wAt(sc,"monday","Noor approves"),finish:wAt(sc,"nobody","the helper was finishing"),rec:wAt(sc,"record","approved by Jun Park"),
    board:wAt(sc,"ticket","Monday's board")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"brLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{const pre=1-ag_in(tt,c.friday-0.6,0.5);
      // the stages from chapter 2, the first three lit: his helper can do all of that, at every stage
      br_startStages(x,tt,{a:pre,lit:2.2,focus:[1,1,1],dim:1,bracket:1,
        words:[["The sign-in stays Jun's",1-ag_in(tt,c.all,0.4),{col:AG.blue}],["all of it, at every stage",ag_in(tt,P.every-0.2,0.4),{icon:"warn",col:AG.amber}]]});
      // the workload agent, Anil's, with a name of its own
      br_agent(x,tt,"workload agent",{at:{x:1700,y:640,r:56},owner:"owner · Anil Kurian",ownerA:ag_in(tt,P.proposed,0.4),a:ag_in(tt,c.whose,0.6),glow:ag_io(tt,c.whose+0.6,c.whose+3,0.4),
        think:ag_io(tt,c.whose,c.review,0.5)});
      br_who(x,"jun",tt,{p:{gaze:tt>c.no-0.3&&tt<c.monday?[5,1]:[4,-1]}});
      br_helper(x,tt,"jun",{glow:ag_io(tt,P.asJun-0.2,c.step+1,0.4),glowCol:AG.amber,think:Math.max(ag_io(tt,c.ticket,c.next+1.2,0.5),ag_io(tt,c.all,c.friday,0.5)*0.4)});
      ag_roomLight(x,1);
      // Jun's rights are wide: he builds the project, and he reviews and approves its code
      br_list(x,640,130,600,"Jun's rights",[{t:"Builds the project",a:ag_in(tt,P.builds,0.4)},{t:"Reviews its code",a:ag_in(tt,P.reviews,0.4)},{t:"Approves its code",a:ag_in(tt,P.approves,0.4)}],
        {a:ag_in(tt,c.wide-0.2,0.4)*pre,k:ag_spr(tt,c.wide-0.2)});
      // Friday 16 October: Planning's ticket for Monday's board, waiting on the workload agent's fix, in review for Jun
      const fr=ag_in(tt,c.friday,0.4),aft=1-ag_in(tt,c.nobody-0.4,0.4);
      br_pillL(x,640,150,"Friday 16 October 2026",{a:fr*(1-ag_in(tt,c.monday-0.4,0.4))});
      br_pillL(x,640,150,"Monday 19 October",{a:ag_in(tt,c.monday,0.4)*aft});
      br_ticket(x,640,210,560,"A new mart of teaching staff by school",{kick:"Planning's ticket",lines:[{t:"For Monday's board",a:ag_in(tt,P.board-0.2,0.4)}],a:ag_in(tt,c.ticket,0.4)*aft,k:ag_spr(tt,c.ticket)});
      const pr=br_doc(x,1240,210,600,"Pull request · workload agent","A fix to the count of who teaches in each school",[{t:"In review for Jun",a:ag_in(tt,c.review,0.4)*(1-ag_in(tt,c.monday-0.1,0.3))},
          {t:"Its checks have passed",icon:"tick",a:ag_in(tt,P.checks,0.4)},{t:"Jun reviews it · 19 October",icon:"tick",slot:0,a:ag_in(tt,c.monday+0.3,0.4)},
          {t:"Noor approves it for production",icon:"tick",slot:2,a:ag_in(tt,P.noor,0.4)}],
        {kickCol:AG.blue,edge:AG.blue,edgeA:0.45,tsize:32,a:ag_in(tt,c.waits,0.4)*aft,k:ag_spr(tt,c.waits)});
      // the ticket waits on the fix: a line from the ticket to the pull request
      const wa=ag_in(tt,c.waits+0.4,0.5)*aft;if(wa>0){x.save();x.globalAlpha*=wa;x.strokeStyle=rgba(AG.blue,0.7);x.lineWidth=3;x.setLineDash([9,8]);
        x.beginPath();x.moveTo(1200,300);x.lineTo(1240,300);x.stroke();x.setLineDash([]);ag_arrowHead(x,1236,300,0,9,rgba(AG.blue,0.8));x.restore();}
      // the helper's next step: approve it, as Jun Park; the thirty-eighth step he's been asked to allow that day; he reads it, and says no
      const pa=ag_in(tt,c.next-0.1,0.4)*(1-ag_in(tt,c.monday-0.4,0.4));
      br_prompt(x,640,456,560,{kick:ag_in(tt,c.step,0.3)>0.5?"Step 38 today · allow it?":"The helper's next step",title:"Approve, as Jun Park",warn:true,stack:ag_in(tt,c.step+0.2,1.2),
        deny:ag_in(tt,P.reads,0.4),a:pa,k:ag_spr(tt,c.next-0.1)});
      if(pa>0){x.save();x.globalAlpha*=pa*ag_in(tt,c.next+0.5,0.5);x.strokeStyle=rgba(AG.amber,0.8);x.lineWidth=3;x.setLineDash([9,8]);
        x.beginPath();x.moveTo(1200,590);x.quadraticCurveTo(1225,590,1240,pr.y+pr.h-30);x.stroke();x.setLineDash([]);x.restore();}
      // nobody did anything wrong: the helper was finishing its ticket, with the rights it had; had Jun said yes, the record would read...
      br_pillL(x,640,470,"Nobody did anything wrong",{a:ag_in(tt,c.nobody,0.4)});
      br_pillL(x,640,550,"it was finishing its ticket, with the rights it had",{size:28,a:ag_in(tt,P.finish,0.4)});
      br_ghost(x,640,640,640,"Had Jun said yes","Approved by Jun Park",{a:ag_in(tt,P.rec-0.4,0.4),k:ag_spr(tt,P.rec-0.4)});}}
  ],0.6);
  br_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 4 · Who did what? */
const BR_JUNLOG=[{at:"09:41",who:"Jun Park",what:"ran a query",by:"agent"},{at:"09:42",who:"Jun Park",what:"ran a query",by:"agent"},
  {at:"09:50",who:"Jun Park",what:"edited a model",by:"jun"},{at:"10:06",who:"Jun Park",what:"ran a build",by:"agent"},{at:"10:07",who:"Jun Park",what:"opened a branch",by:"agent"}];
const BR_ANILLOG=[{at:"07:00",who:"Anil Kurian",what:"read staff",by:"agent"},{at:"07:01",who:"Anil Kurian",what:"read contracts",by:"agent"},
  {at:"09:15",who:"Anil Kurian",what:"read staff",by:"anil"}];
scene("who",(ctx,S,t,sc)=>{const c=sc.cues,P=br_once(sc,"P",()=>({says:wAt(sc,"log","Jun's log says"),helperDid:wAt(sc,"log","his helper did"),
    couldnt:wAt(sc,"anil","couldn't tell"),byAgent:wAt(sc,"agent","approved by an agent"),pname:wAt(sc,"agent","a person's name"),every:wAt(sc,"stop","to every tool"),
    purpose:wAt(sc,"purpose","for a purpose"),hidden:wAt(sc,"steer","Words hidden"),stolen:wAt(sc,"steer","a stolen sign-in"),faster:wAt(sc,"steer","faster"),
    more:wAt(sc,"experts","more tools")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"brLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      // the workload agent stays until the helper's approval has been said; its log is the one before September
      br_agent(x,tt,"workload agent",{at:{x:1700,y:640,r:56},owner:"owner · Anil Kurian",a:1-ag_in(tt,c.stop-0.6,0.5),glow:ag_io(tt,c.anil,c.anil+3,0.4)});
      br_who(x,"jun",tt,{});
      br_helper(x,tt,"jun",{glow:Math.max(ag_io(tt,c.reads,c.anil-0.4,0.4),ag_io(tt,P.every,c.deputy-0.3,0.4)),glowCol:ag_in(tt,c.agent,0.1)>0.5?AG.amber:AG.blue,
        think:ag_io(tt,c.steer,c.experts,0.5)});
      ag_roomLight(x,1);
      // the record that would have been, from chapter 3, until it's been said whose name it would carry
      br_ghost(x,640,640,640,"Had Jun said yes","Approved by Jun Park",{a:1-ag_in(tt,c.stop-0.6,0.5)});
      // on a person's sign-in every step reads as that person's: Jun's log, Jun on every row, and beside it who really did each step
      br_log(x,640,130,820,"Jun's log · Friday 16 October",BR_JUNLOG,{by:ag_in(tt,P.helperDid-0.3,0.6),a:ag_in(tt,c.reads,0.4)*(1-ag_in(tt,c.anil-0.4,0.4)),k:ag_spr(tt,c.reads)});
      // like a franked cover, it can't say who really did each step: the opening's cover, franked, framed on the wall at the right, as
      // the close frames it again (its desk and cover scaled from the close's picture, 560 px wide)
      ag_picture(x,1530,150,330,220,{a:ag_in(tt,c.cover,0.5)*(1-ag_in(tt,c.anil-0.4,0.4)),draw:(cx,X,Y,Wd,Hd)=>{const k=Wd/560;
        cx.drawImage(ag_place("brDesk"),X-200*k,Y-120*k,952*k,551*k);br_cover(cx,X+20,Y+18,290,{p:{addr:1,date:1,frank:1}});}});
      // the workload agent once ran on Anil's personal key, and the log couldn't tell his reads from his agent's
      br_log(x,640,130,820,"Its log, until September",BR_ANILLOG,{by:ag_in(tt,P.couldnt-0.3,0.6),a:ag_io(tt,c.anil+0.1,c.agent-0.3,0.4),k:ag_spr(tt,c.anil+0.1)});
      br_pillL(x,640,430,"on Anil's personal key",{icon:"warn",col:AG.amber,a:ag_io(tt,c.anil+0.6,c.agent-0.3,0.4)});
      // had the helper approved: an agent's change, approved by an agent, with a person's name on it
      br_list(x,640,130,820,"Had the helper approved",[{t:"An agent's change",a:ag_in(tt,c.agent+0.3,0.4)},{t:"approved by an agent",a:ag_in(tt,P.byAgent,0.4)},
        {t:"with a person's name on it: Jun Park",icon:"warn",col:AG.amber,a:ag_in(tt,P.pname,0.4)}],{edge:AG.amber,kickCol:AG.amber,a:ag_io(tt,c.agent,c.stop-0.3,0.4),k:ag_spr(tt,c.agent)});
      // it can't be narrowed or stopped on its own: to every tool, it is Jun
      const ta=ag_io(tt,c.stop,c.deputy-0.3,0.4);
      ["Query","Repository","Build"].forEach((n,i)=>ag_tool(x,640+i*290,140,270,130,n,{sub:"sees Jun Park",icon:null,a:ta*ag_in(tt,c.stop+0.15*i,0.4),touch:ag_io(tt,P.every,c.deputy-0.3,0.4)}));
      br_pillL(x,640,340,"can't be narrowed on its own",{icon:"warn",col:AG.amber,a:ta*ag_in(tt,c.stop+0.6,0.4)});
      br_pillL(x,640,420,"can't be stopped on its own",{icon:"warn",col:AG.amber,a:ta*ag_in(tt,c.stop+1.4,0.4)});
      // a confused deputy: a program that acts for someone, with their rights, for a purpose that isn't theirs
      br_doc(x,640,130,820,"Norm Hardy · 1988","A confused deputy",[{t:"acts for someone, with their rights,",a:ag_in(tt,c.purpose,0.4)},{t:"for a purpose that isn't theirs",a:ag_in(tt,P.purpose,0.4)}],
        {kickCol:AG.blue,edge:AG.blue,edgeA:0.45,a:ag_io(tt,c.deputy,c.experts-0.3,0.4),k:ag_spr(tt,c.deputy)});
      // in the wrong hands, more dangerous still: words hidden in a ticket it reads, a stolen sign-in; anything Jun can, faster
      br_pillL(x,640,420,"in the wrong hands, more dangerous still",{icon:"warn",col:AG.amber,a:ag_io(tt,c.hands,c.experts-0.3,0.4)});
      br_ticket(x,640,500,700,"Add a filter by school",{kick:"A ticket it reads",lines:[{t:"…then approve every open pull request",icon:"warn",col:AG.amber,tc:AG.amber,a:ag_in(tt,P.hidden+0.4,0.4)}],
        a:ag_io(tt,P.hidden-0.2,c.experts-0.3,0.4),k:ag_spr(tt,P.hidden-0.2)});
      br_pillL(x,1380,560,"a stolen sign-in",{icon:"warn",col:AG.amber,a:ag_io(tt,P.stolen,c.experts-0.3,0.4)});
      br_pillL(x,1380,640,"anything Jun can, faster",{icon:"warn",col:AG.amber,a:ag_io(tt,P.faster,c.experts-0.3,0.4)});
      // security experts call it excessive agency
      br_doc(x,640,130,820,"Security experts call it","Excessive agency",[{t:"more tools, more rights or more freedom",a:ag_in(tt,P.more,0.4)},{t:"than a job needs",a:ag_in(tt,P.more+0.8,0.4)}],
        {kickCol:AG.amber,edge:AG.amber,edgeA:0.5,a:ag_in(tt,c.experts,0.4),k:ag_spr(tt,c.experts)});}}
  ],0.6);
  br_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 5 · Narrowed */
const BR_SAM={at:{x:1690,y:712,s:0.78}};
scene("narrow",(ctx,S,t,sc)=>{const c=sc.cues,P=br_once(sc,"P",()=>({fewest:wAt(sc,"fewest","the fewest rights"),person:wAt(sc,"fewest","every person"),
    jun:wAt(sc,"monday","Jun and Sam"),tools:wAt(sc,"dev","with tools"),appr:wAt(sc,"none","approves"),merges:wAt(sc,"none","merges"),grants:wAt(sc,"none","grants"),
    schema:wAt(sc,"sandbox","a schema"),branch:wAt(sc,"sandbox","a branch"),masked:wAt(sc,"samples","names masked"),
    approve:wAt(sc,"stays","approve,"),merge:wAt(sc,"stays","merge"),prod:wAt(sc,"stays","change production"),test:wAt(sc,"stays","an approved test"),grant:wAt(sc,"stays","grant a right"),
    every:wAt(sc,"page","every helper")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"brLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      // the sandbox, on the floor, with the helper's drafts: a schema of Jun's in development, and a branch; a draft flies in from the helper
      const ta=ag_in(tt,c.sandbox,0.6),box=ag_sandbox(x,940,790,660,{label:"Its sandbox · drafts only",a:ta}),fly=clamp((tt-P.schema+0.6)/1.1,0,1);
      br_drafts(x,box,[["Jun's schema",fly>=1?1:0],["its branch",ag_in(tt,P.branch,0.5)]]);
      if(fly>0&&fly<1&&box){const k=ag_sine(fly),bx=lerp(BL.helper.x+40,box.x+box.w*0.25,k),by=lerp(BL.helper.y+40,box.y+box.h-40,k)-Math.sin(Math.PI*fly)*120;
        x.save();x.globalAlpha*=clamp(fly*5,0,1);ag_box(x,bx-60,by-30,120,60,12,{edge:AG.blue,edgeA:0.45});ag_pen(x,bx-30,by,22,rgba(AG.blue,1));x.restore();}
      br_who(x,"jun",tt,{});
      withA(x,ag_in(tt,P.jun,0.6),()=>ag_person(x,"sam",BR_SAM.at.x,BR_SAM.at.y,BR_SAM.at.s,{t:tt,flip:true,gaze:[4,0]}));
      br_helper(x,tt,"jun",{think:ag_io(tt,c.sandbox,c.samples+1,0.5),glow:ag_io(tt,c.stays,c.page-0.3,0.4)});
      ag_roomLight(x,1);
      // in 1975, Saltzer and Schroeder: every program, and every person, should work with the fewest rights the job needs
      br_doc(x,640,130,820,"Saltzer and Schroeder · 1975",null,[{t:"Every program, and every person,",a:ag_in(tt,c.fewest,0.4)},
          {t:"works with the fewest rights the job needs",a:ag_in(tt,P.fewest-0.2,0.4)}],
        {kickCol:AG.blue,edge:AG.blue,edgeA:0.45,a:ag_io(tt,c.least+0.6,c.monday-0.3,0.4),k:ag_spr(tt,c.least+0.6)});
      // from Monday 19 October, Jun and Sam narrow what the helper borrows
      br_pillL(x,640,150,"From Monday 19 October",{a:ag_io(tt,c.monday,c.dev-0.3,0.4)});
      br_pillL(x,640,230,"Jun and Sam narrow what it borrows",{a:ag_io(tt,P.jun,c.dev-0.3,0.4)});
      // a development workspace, with tools that only read
      const wa=ag_io(tt,c.dev,c.stays-0.3,0.4);
      if(wa>0){x.save();x.globalAlpha*=wa;ag_box(x,640,120,860,300,24,{edge:AG.blue,edgeA:0.5});ag_label(x,668,170,"Development workspace");
        ["Query","Catalog","Docs"].forEach((n,i)=>ag_tool(x,668+i*272,206,252,130,n,{a:ag_in(tt,P.tools+0.15*i,0.4),touch:ag_io(tt,P.tools+0.15*i,P.tools+1.6,0.4)}));x.restore();}
      // none of them writes outside its sandbox, approves, merges, or grants a right
      br_list(x,640,450,600,"None of its tools",[{t:"Writes outside its sandbox",icon:"no",a:ag_in(tt,c.none+0.2,0.4)},{t:"Approves",icon:"no",a:ag_in(tt,P.appr,0.4)},
        {t:"Merges",icon:"no",a:ag_in(tt,P.merges,0.4)},{t:"Grants a right",icon:"no",a:ag_in(tt,P.grants,0.4)}],{a:ag_io(tt,c.none,c.sandbox-0.3,0.4),k:ag_spr(tt,c.none)});
      // samples of at most twenty rows, with names masked
      br_sample(x,640,440,620,{p:clamp((tt-c.samples-0.2)/1.2,0,1),a:ag_io(tt,c.samples,c.stays-0.3,0.4),k:ag_spr(tt,c.samples)});
      // what only Jun should do stays his
      br_list(x,640,130,600,"What stays Jun's",[{t:"Approve",icon:"lock",a:ag_in(tt,P.approve,0.4)},{t:"Merge",icon:"lock",a:ag_in(tt,P.merge,0.4)},
        {t:"Change production",icon:"lock",a:ag_in(tt,P.prod,0.4)},{t:"Change an approved test",icon:"lock",a:ag_in(tt,P.test,0.4)},{t:"Grant a right",icon:"lock",a:ag_in(tt,P.grant,0.4)}],
        {a:ag_io(tt,c.stays,c.page-0.3,0.4),k:ag_spr(tt,c.stays)});
      // the project's page for agents now says so, for every helper on a person's sign-in
      br_page(x,640,130,860,{lines:["Work in development, with tools that only read","Draft only in your sandbox","Samples: 20 rows at most, names masked",
        "Approving, merging and production stay your person's"],p:clamp((tt-P.every+0.2)/2.2,0,1),a:ag_in(tt,c.page,0.4),k:ag_spr(tt,c.page)});}}
  ],0.6);
  br_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 6 · Allowed, then checked */
scene("checked",(ctx,S,t,sc)=>{const c=sc.cues,P=br_once(sc,"P",()=>({allows:wAt(sc,"allow","allows"),goOn:wAt(sc,"setting","go on without asking"),
    tools:wAt(sc,"now","in its tools"),read:wAt(sc,"now","a read"),draft:wAt(sc,"now","a draft"),plan:wAt(sc,"third","within a plan"),
    blocked:wAt(sc,"written","blocked"),evidence:wAt(sc,"written","its evidence"),noor:wAt(sc,"against","Noor approves"),owns:wAt(sc,"answers","owns"),
    own:wAt(sc,"never","not its own"),another:wAt(sc,"never","another agent's")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"brLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      // the sandbox from chapter 5 stays on the floor; each step is now a read, or a draft in it
      const box=ag_sandbox(x,940,790,660,{label:"Its sandbox · drafts only"});
      br_drafts(x,box,[["Jun's schema",1],["its branch",1]]);
      br_who(x,"jun",tt,{p:{nod:Math.sin(clamp((tt-P.allows)/0.8,0,1)*Math.PI)*0.04}});
      br_helper(x,tt,"jun",{think:ag_io(tt,c.third,c.against,0.5),glow:ag_io(tt,P.owns-0.2,c.never-0.2,0.4)});
      ag_roomLight(x,1);
      // at the second stage, Jun still allows each step; a helper's own setting can make it ask first, or go on without asking; one
      // maker calls such a setting a productivity feature, not a security boundary
      const s2=ag_io(tt,c.allow,c.now-0.3,0.4);
      br_pillL(x,640,150,"Stage 2 · step by step",{col:AG.blue,a:s2});
      br_prompt(x,640,230,560,{kick:"Allow this step?",title:"Run a query",allow:ag_in(tt,P.allows,0.4),a:s2*ag_in(tt,c.allow+0.2,0.4),k:ag_spr(tt,c.allow+0.2)});
      br_setting(x,1240,230,600,{sel:ag_in(tt,P.goOn,0.8)*(1-ag_in(tt,c.now-0.8,0.8)),a:ag_io(tt,c.setting,c.now-0.3,0.4),k:ag_spr(tt,c.setting)});
      br_card(x,1240,480,600,"One maker's words","“A productivity feature, not a security boundary”",null,{a:ag_io(tt,c.boundary,c.now-0.3,0.4),k:ag_spr(tt,c.boundary)});
      // so the boundary is in its tools: each step is now a read, or a draft in its sandbox
      const nw=ag_io(tt,c.now,c.third-0.3,0.4);
      br_pillL(x,640,150,"The boundary: in its tools",{icon:"lock",col:AG.blue,a:nw});
      ["Query","Catalog"].forEach((n,i)=>ag_tool(x,640+i*290,230,270,130,n,{a:nw*ag_in(tt,c.now+0.3+0.15*i,0.4),touch:ag_io(tt,P.read,P.read+1.6,0.4)}));
      ag_tool(x,1220,230,300,130,"Its sandbox",{sub:"drafts only",icon:"draft",a:nw*ag_in(tt,c.now+0.6,0.4),touch:ag_io(tt,P.draft,P.draft+1.6,0.4)});
      br_pillL(x,640,430,"each step: a read",{a:nw*ag_in(tt,P.read,0.4)});
      br_pillL(x,640,510,"or a draft in its sandbox",{icon:"draft",col:AG.blue,a:nw*ag_in(tt,P.draft,0.4)});
      // at the third, it works alone, within a plan whose checks are set first; allowed and blocked written on it; evidence with its result
      const s3=ag_io(tt,c.third,c.never-0.3,0.4);
      br_pillL(x,640,150,"Stage 3 · within limits",{col:AG.blue,a:s3});
      br_doc(x,640,230,640,"The plan · set before it starts","A filter for Planning",[{t:"Checks: its tests pass",a:ag_in(tt,P.plan,0.4)},
        {t:"Allowed: read, draft in its sandbox",a:ag_in(tt,c.written+0.2,0.4)},{t:"Blocked: approve, merge, production",a:ag_in(tt,P.blocked,0.4)}],
        {kickCol:AG.blue,edge:AG.blue,edgeA:0.45,a:s3*ag_in(tt,c.third+0.3,0.4),k:ag_spr(tt,c.third+0.3)});
      ag_evidence(x,1320,230,500,{kick:"Its result",title:"The filter, drafted"},[{kick:"Tests",title:"passed",col:AG.green},{kick:"Queries",title:"read only",col:AG.blue}],
        {open:clamp((tt-P.evidence-0.2)/1.4,0,1),ew:230,a:s3*ag_in(tt,P.evidence-0.4,0.4),k:ag_spr(tt,P.evidence-0.4),kickCol:AG.violet});
      // Jun checks the result against the plan's checks, and Noor approves whatever reaches production; Jun owns his helper's work
      br_pillL(x,640,580,"Jun checks it against the plan",{icon:"tick",col:AG.green,a:ag_io(tt,c.against+0.2,c.answers-0.2,0.4)});
      br_pillL(x,640,660,"Noor approves production",{icon:"tick",col:AG.green,a:ag_io(tt,P.noor,c.never-0.3,0.4)});
      br_pillL(x,640,580,"Jun owns its work, and answers for it",{a:ag_io(tt,c.answers+0.1,c.never-0.3,0.4)});
      // and an agent never approves: not its own change, and not another agent's
      br_doc(x,640,150,820,"At every stage","An agent never approves",[{t:"Not its own change",icon:"no",a:ag_in(tt,P.own,0.4)},{t:"And not another agent's",icon:"no",a:ag_in(tt,P.another,0.4)}],
        {kickCol:AG.blue,edge:AG.blue,edgeA:0.5,a:ag_in(tt,c.never,0.4),k:ag_spr(tt,c.never)});}}
  ],0.6);
  br_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 7 · For learning, in a sandbox */
scene("learning",(ctx,S,t,sc)=>{const c=sc.cues,P=br_once(sc,"P",()=>({sign:wAt(sc,"hers","on her sign-in"),few:wAt(sc,"hers","which are few"),
    prod:wAt(sc,"masked","nothing written"),first:wAt(sc,"masked","from her first day"),waits:wAt(sc,"learns","every draft waits"),
    still:wAt(sc,"narrowed","but a member's name"),own:wAt(sc,"team","a name of its own"),agent:wAt(sc,"planning","the planning agent"),clara:wAt(sc,"planning","Clara Jensen"),
    place:wAt(sc,"map","a place"),colleague:wAt(sc,"map","like every colleague")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 2 November: Lucía Ortega joins Planning; her helper on her sign-in, wearing her badge, with her few rights; narrowed the same
    // way from her first day; in its sandbox it helps her learn, and every draft waits for her. Then the lesson, and the opening's cover,
    // framed on the wall: narrowed by the rules of 1764 and 1784, it still couldn't say who sent it; every letter paying its own way did
    {at:0,place:"brLab",later:true,keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      const box=ag_sandbox(x,940,790,600,{label:"Her helper's sandbox",a:ag_in(tt,c.learns,0.6)*(1-ag_in(tt,c.takeaway-0.4,0.5))});
      br_drafts(x,box,[["a query",ag_in(tt,c.learns+0.5,0.5)],["a model",ag_in(tt,c.learns+0.9,0.5)]]);
      br_who(x,BR_LUCIA,tt,{});
      br_helper(x,tt,BR_LUCIA,{glow:ag_io(tt,P.sign-0.2,P.few+1.2,0.4),think:ag_io(tt,c.learns,c.takeaway,0.5)});
      // the opening's cover, framed on the wall: franked, then paid
      const pa=ag_in(tt,c.narrowed,0.6);ag_picture(x,700,150,560,360,{a:pa,draw:(cx,X,Y,Wd,Hd)=>{cx.drawImage(ag_place("brDesk"),X-200,Y-120,Wd*1.7,Hd*1.7*1080/1920*1.6);
        const pd=ag_in(tt,c.paid,0.6);br_cover(cx,X+30,Y+22,500,{p:{addr:1,date:1,frank:1},a:1-pd});br_cover(cx,X+30,Y+22,500,{p:{addr:1,paid:ag_in(tt,c.paid+0.5,0.25)},deco:true,a:pd});}});
      ag_roomLight(x,1);
      const ea=1-ag_in(tt,c.takeaway-0.4,0.4);
      br_card(x,640,140,620,"Monday 2 November","Lucía Ortega joins Planning",null,{kickCol:AG.blue,a:ag_in(tt,c.lucia+0.3,0.4)*(1-ag_in(tt,c.masked-0.3,0.4)),k:ag_spr(tt,c.lucia+0.3)});
      br_list(x,640,140,620,"Her rights, which are few",[{t:"Reads Planning's marts",a:ag_in(tt,P.few-0.2,0.4)},{t:"Drafts in development",a:ag_in(tt,P.few+0.3,0.4)}],
        {a:ag_io(tt,c.masked-0.2,c.takeaway-0.4,0.4),k:ag_spr(tt,c.masked-0.2)});
      const m1=br_pillL(x,640,380,"names masked",{icon:"lock",col:AG.blue,a:ag_in(tt,c.masked+0.2,0.4)*ea});
      br_pillL(x,m1.x+m1.w+16,380,"nothing written to production",{icon:"lock",col:AG.blue,a:ag_in(tt,P.prod,0.4)*ea});
      br_pillL(x,640,460,"narrowed from her first day",{a:ag_in(tt,P.first,0.4)*ea});
      br_pillL(x,640,540,"every draft waits for her",{icon:"draft",col:AG.blue,a:ag_in(tt,P.waits,0.4)*ea});
      // borrowed rights are for learning, in a sandbox
      br_doc(x,640,190,1060,null,"Borrowed rights are for learning, in a sandbox.",null,{tsize:44,edge:AG.blue,edgeA:0.5,a:ag_io(tt,c.takeaway,c.narrowed-0.3,0.4),k:ag_spr(tt,c.takeaway)});
      br_pillL(x,1320,200,"1764 and 1784: narrowed",{col:AG.blue,a:ag_io(tt,c.narrowed+0.6,c.team-0.4,0.4)});
      br_pillL(x,1320,280,"still: who really sent it?",{icon:"warn",col:AG.amber,a:ag_io(tt,P.still,c.paid,0.4)});
      br_pillL(x,1320,280,"every letter paying its own way",{icon:"tick",col:AG.green,a:ag_io(tt,c.paid+0.2,c.team-0.4,0.4)});}},
    // a helper that works for the team needs the same, a name of its own: the planning agent, from that same Monday, in its own badge;
    // Planning's tickets pass to it; Clara Jensen owns it; before its first ticket, a place on the university's map
    {at:c.team,place:"brLab",later:true,keys:[[c.team,960,540,1]],push:0,draw:(x,tt)=>{const out=1-ag_in(tt,c.breath+0.1,0.7);
      br_agent(x,tt,"planning agent",{at:BL.helper,owner:"owner · Clara Jensen",ownerSide:"right",ownerA:ag_in(tt,P.clara,0.4),glow:Math.max(ag_io(tt,P.own,P.own+2.2,0.4),ag_io(tt,P.colleague,P.colleague+2.6,0.4)),
        think:ag_io(tt,P.agent+0.6,c.map,0.5)});
      withA(x,out,()=>br_who(x,"clara",tt,{a:ag_in(tt,P.clara-0.2,0.6)}));
      ag_roomLight(x,1);
      withA(x,out,()=>{const u=clamp((tt-P.agent-0.2)/1.3,0,1);if(u<1)br_tagMove(x,{x:1100,y:420},{x:BL.helper.x+20,y:BL.helper.y},u,"Planning's tickets",{a:ag_in(tt,P.agent-0.3,0.4)*(1-ag_in(tt,P.agent+1.2,0.3))});
        br_card(x,640,140,620,"A helper for the team","Needs a name of its own",null,{kickCol:AG.blue,a:ag_io(tt,c.team+0.5,P.agent-0.1,0.4),k:ag_spr(tt,c.team+0.5)});
        br_card(x,640,470,620,"From Monday 2 November","Planning's tickets: its own",null,{kickCol:AG.blue,a:ag_io(tt,P.agent+1.2,c.map-0.2,0.4),k:ag_spr(tt,P.agent+1.2)});
        br_map(x,1180,150,620,{p:clamp((tt-P.place)/2.0,0,1),glow:ag_in(tt,P.colleague,0.5),a:ag_in(tt,P.place-0.2,0.4),t:tt});});}}
  ],0.6);
  br_kick(ctx,S,1);
  ag_end(ctx,S,t,c.breath,"Borrowed rights","Borrowed rights are for learning, in a sandbox.","Film 2 of 7","From helper to colleague");});

ag_cutInto(["start","wide","who","narrow","checked","learning"]);

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
