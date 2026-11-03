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

// Decades in the making, the opening film of What an agent is. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"story":{"name":"An idea that waited","lead":1.6,"tail":1.0,"vo":[
 {"id":"europe","gap":0.8,"text":"Europe, in the 1440s. Every book is copied by hand, letter by letter.","say":"Europe, in the fourteen-forties. Every book is copied by hand, letter by letter."},
 {"id":"rare","gap":0.8,"text":"So books are slow to make, and rare."},
 {"id":"cambridge","gap":0.8,"text":"In 1424, the University of Cambridge's library held 122 books.","say":"In fourteen twenty-four, the University of Cambridge's library held a hundred and twenty-two books."},
 {"id":"mistakes","gap":0.8,"text":"And every new copy can add new mistakes."},
 {"id":"change","gap":0.8,"text":"Something has to change."},
 {"id":"old","gap":0.8,"text":"The idea that will change it is already four hundred years old."},
 {"id":"clay","gap":0.8,"text":"In China, in the 1040s, Bi Sheng made a piece of baked clay for each character.","say":"In China, in the ten-forties, Bee Shung made a piece of baked clay for each character."},
 {"id":"frame","gap":0.8,"text":"He set them in an iron frame, printed a page, and used them again."},
 {"id":"korea","gap":0.8,"text":"In Korea, in 1377, monks printed a book with characters cast in metal: the oldest that survives.","say":"In Korea, in thirteen seventy-seven, monks printed a book with characters cast in metal: the oldest that survives."},
 {"id":"mainz","gap":0.8,"text":"In Mainz, around 1450, a metalworker, Johannes Gutenberg, brought the other pieces together.","say":"In Mainz, around fourteen fifty, a metalworker, Yohannes Gootenberg, brought the other pieces together."},
 {"id":"pieces","gap":0.8,"text":"Letters cast in metal, all alike; an ink that clings to them; a press, like a wine press; and paper, now made in Germany."},
 {"id":"fust","gap":0.8,"text":"And a lender, Johann Fust, put up the money for years of trying.","say":"And a lender, Yohann Foost, put up the money for years of trying."},
 {"id":"towns","gap":0.8,"text":"By 1500, presses in more than two hundred towns had printed some thirty thousand different books.","say":"By fifteen hundred, presses in more than two hundred towns had printed some thirty thousand different books."},
 {"id":"cheaper","gap":0.8,"text":"And books grew cheaper, reaching far more readers."},
 {"id":"seemed","gap":0.8,"text":"Printing seemed to arrive all at once. It had taken four hundred years."},
 {"id":"agent","gap":0.8,"text":"This term, an AI agent joins Jun Park's data team: software that works through tasks, step by step."},
 {"id":"nowhere","gap":0.8,"text":"To some, it's come from nowhere. Some fear it; some expect magic."},
 {"id":"ideas","gap":0.8,"text":"But its ideas are decades old, and seen as long work, it's something they can understand."}]},
"learns":{"name":"A machine that learns","lead":1.2,"tail":1.0,"vo":[
 {"id":"road","gap":0.8,"text":"Our road starts in July 1958.","say":"Our road starts in July, nineteen fifty-eight."},
 {"id":"navy","gap":0.8,"text":"The US Navy showed reporters a perceptron, a program by the psychologist Frank Rosenblatt that learns from examples."},
 {"id":"cards","gap":0.8,"text":"Shown cards marked on the left or the right, it guessed, and each wrong guess nudged its numbers."},
 {"id":"fifty","gap":0.8,"text":"After fifty tries, it could tell them apart by itself."},
 {"id":"paper","gap":0.8,"text":"A newspaper said the Navy expected it to walk, talk, and be conscious of its existence."},
 {"id":"layer","gap":0.8,"text":"But a single layer can't learn some patterns at all, as a book showed in 1969, and money moved elsewhere.","say":"But a single layer can't learn some patterns at all, as a book showed in nineteen sixty-nine, and money moved elsewhere."}]},
"mistakes":{"name":"Learning from mistakes","lead":1.2,"tail":1.0,"vo":[
 {"id":"layers","gap":0.8,"text":"In 1986, three researchers showed how a network with several layers can learn.","say":"In nineteen eighty-six, three researchers showed how a network with several layers can learn."},
 {"id":"guess","gap":0.8,"text":"It makes a guess, and measures how wrong it is."},
 {"id":"back","gap":0.8,"text":"The error is passed back, layer by layer, and every connection is nudged to make it smaller."},
 {"id":"patterns","gap":0.8,"text":"Over many examples, the layers in between find patterns no one told them to look for."},
 {"id":"small","gap":0.8,"text":"But computers were slow and examples few, and for twenty years these networks stayed small."}]},
"power":{"name":"The power to run","lead":1.2,"tail":1.0,"vo":[
 {"id":"together","gap":0.8,"text":"In 2012, the pieces came together.","say":"In twenty twelve, the pieces came together."},
 {"id":"photos","gap":0.8,"text":"A team in Toronto trained a much bigger network on more than a million labelled photos."},
 {"id":"chips","gap":0.8,"text":"It ran on two graphics chips, made for video games, which do hundreds of small sums at once."},
 {"id":"contest","gap":0.8,"text":"In an image contest, its five best guesses missed the answer 15 times in a hundred.","say":"In an image contest, its five best guesses missed the answer fifteen times in a hundred."},
 {"id":"next","gap":0.8,"text":"The next best entry missed 26.","say":"The next best entry missed twenty-six."},
 {"id":"new","gap":0.8,"text":"The ideas were old. What was new was the power to run them."}]},
"attention":{"name":"Attention","lead":1.2,"tail":1.0,"vo":[
 {"id":"paper","gap":0.8,"text":"In 2017, a paper called Attention Is All You Need changed how these networks read.","say":"In twenty seventeen, a paper called Attention Is All You Need changed how these networks read."},
 {"id":"before","gap":0.8,"text":"Before, they read a sentence one word at a time."},
 {"id":"once","gap":0.8,"text":"Its design, the transformer, takes in all the words at once, and learns which matter to each other."},
 {"id":"report","gap":0.8,"text":"In \"The team fixed the report because it was wrong\", it learns that \"it\" is the report."},
 {"id":"bigger","gap":0.8,"text":"Reading all at once splits the work across many chips, so models could grow far bigger."}]},
"web":{"name":"The written web","lead":1.2,"tail":1.0,"vo":[
 {"id":"text","gap":0.8,"text":"From 2018 to 2020, researchers trained transformers on huge collections of text from the web and books.","say":"From twenty eighteen to twenty twenty, researchers trained transformers on huge collections of text from the web and books."},
 {"id":"task","gap":0.8,"text":"The task was simple: guess the next word, check it, and adjust."},
 {"id":"billions","gap":0.8,"text":"Billions of times over, a model picked up grammar, facts and ways of writing."},
 {"id":"largest","gap":0.8,"text":"The largest, in 2020, had 175 billion numbers to tune.","say":"The largest, in twenty twenty, had a hundred and seventy-five billion numbers to tune."},
 {"id":"help","gap":0.8,"text":"It wrote fluently, but it wasn't trying to help: it only carried on the text."}]},
"helpful":{"name":"Helpful, with hands","lead":1.2,"tail":1.0,"vo":[
 {"id":"rank","gap":0.8,"text":"In 2022, researchers asked people to rank a model's answers, from best to worst.","say":"In twenty twenty-two, researchers asked people to rank a model's answers, from best to worst."},
 {"id":"trained","gap":0.8,"text":"Then they trained it to give the kind of answers people preferred."},
 {"id":"smaller","gap":0.8,"text":"People preferred its answers to those of a model a hundred times bigger."},
 {"id":"steps","gap":0.8,"text":"Since 2024, models have also been trained to work through a problem step by step before they answer.","say":"Since twenty twenty-four, models have also been trained to work through a problem step by step before they answer."},
 {"id":"tools","gap":0.8,"text":"And they can use tools: search, run a query, read a file, and work with what comes back."},
 {"id":"agent","gap":0.8,"text":"A model that reasons, with hands for tools, in a loop: that's an agent."}]},
"sudden":{"name":"Why it seemed sudden","lead":1.2,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"So why did it seem so sudden?"},
 {"id":"three","gap":0.8,"text":"Because three things arrived together."},
 {"id":"compute","gap":0.8,"text":"Computing power: since 2010, the computing used to train the largest models has doubled about every six months.","say":"Computing power: since twenty ten, the computing used to train the largest models has doubled about every six months."},
 {"id":"data","gap":0.8,"text":"Data: the web, and millions of labelled examples."},
 {"id":"money","gap":0.8,"text":"And money: the first transformer cost about nine hundred dollars to train; by 2023, the biggest cost tens of millions or more.","say":"And money: the first transformer cost about nine hundred dollars to train; by twenty twenty-three, the biggest cost tens of millions or more."},
 {"id":"long","gap":0.8,"text":"It wasn't a sudden discovery. It was long work that finally had the power to run."},
 {"id":"printing","gap":0.8,"text":"Printing waited four hundred years for metal letters, paper, a press and a lender."},
 {"id":"decades","gap":0.8,"text":"These ideas waited decades for chips, data and money."},
 {"id":"team","gap":0.8,"text":"So nobody on Jun's team expects magic from the agent, or needs to fear it: they know where it came from."}]}
};

const VODUR={"story/europe": 4.734, "story/rare": 1.877, "story/cambridge": 6.235, "story/mistakes": 2.277, "story/change": 1.34, "story/old": 3.283, "story/clay": 4.938, "story/frame": 3.808, "story/korea": 7.099, "story/mainz": 6.185, "story/pieces": 7.701, "story/fust": 3.751, "story/towns": 6.226, "story/cheaper": 2.64, "story/seemed": 4.055, "story/agent": 6.723, "story/nowhere": 3.919, "story/ideas": 5.116, "learns/road": 2.704, "learns/navy": 7.694, "learns/cards": 5.282, "learns/fifty": 3.181, "learns/paper": 5.456, "learns/layer": 6.721, "mistakes/layers": 4.984, "mistakes/guess": 2.344, "mistakes/back": 5.169, "mistakes/patterns": 5.146, "mistakes/small": 5.262, "power/together": 2.342, "power/photos": 5.251, "power/chips": 5.78, "power/contest": 5.221, "power/next": 1.923, "power/new": 3.31, "attention/paper": 5.665, "attention/before": 2.597, "attention/once": 5.497, "attention/report": 4.97, "attention/bigger": 4.946, "web/text": 6.982, "web/task": 3.389, "web/billions": 4.539, "web/largest": 5.143, "web/help": 4.09, "helpful/rank": 5.591, "helpful/trained": 3.397, "helpful/smaller": 4.021, "helpful/steps": 6.333, "helpful/tools": 4.85, "helpful/agent": 4.107, "sudden/why": 1.589, "sudden/three": 1.777, "sudden/compute": 7.247, "sudden/data": 3.107, "sudden/money": 8.611, "sudden/long": 4.661, "sudden/printing": 4.87, "sudden/decades": 3.253, "sudden/team": 6.473};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the timeline drawing itself on the lab's wall, then the title; and Jun's desk with the agent beside it, then the end card. */
const BREATH={
"story":{"hold":{"europe":0.4,"cambridge":0.6,"mistakes":0.6,"change":1.0,"old":0.6,"frame":0.5,"korea":0.6,"pieces":0.6,"fust":0.8,"towns":1.0,"cheaper":0.6,"seemed":1.0,"nowhere":0.6},"breathe":4.4},
"learns":{"hold":{"navy":0.4,"cards":1.6,"fifty":0.8,"paper":0.6}},
"mistakes":{"hold":{"guess":0.4,"back":1.2,"patterns":0.8}},
"power":{"hold":{"photos":0.6,"chips":0.8,"contest":0.6,"next":0.8}},
"attention":{"hold":{"paper":0.8,"before":0.6,"once":1.3,"report":1.0}},
"web":{"hold":{"task":1.0,"billions":0.4,"help":0.8}},
"helpful":{"hold":{"rank":0.6,"smaller":0.8,"steps":0.8,"tools":0.8,"agent":1.0}},
"sudden":{"hold":{"three":0.4,"compute":0.6,"money":0.8,"long":1.4,"printing":0.4,"decades":0.8},"breathe":5.0}
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
   the next shot. ag_shots cuts a chapter into shots, each dissolving in from the one before over dis seconds; it returns the shot. */
function ag_focus(ctx,t,keys,d,push){d=Math.max(1.4,d||1.6);let x=keys[0][1],y=keys[0][2],z=keys[0][3];
  for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z*(1+(push||0)));x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
function ag_shot(ctx,S,t,sh,till){setScreen(ctx,S);ctx.save();const len=Math.max(1.5,till-sh.at),push=(sh.push==null?0.025:sh.push)*easeCam(clamp((t-sh.at)/len,0,1));
  const cam=ag_focus(ctx,t,sh.keys||[[0,960,540,1]],sh.d,push);if(sh.place)ctx.drawImage(ag_place(sh.place),0,0,W,H);if(sh.draw)sh.draw(ctx,t,cam);ctx.restore();setScreen(ctx,S);}
function ag_shots(ctx,S,t,end,shots,dis){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;dis=dis==null?0.5:dis;
  const u=i>0?clamp((t-shots[i].at)/dis,0,1):1,till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){ag_shot(ctx,S,t,shots[i-1],shots[i].at);const [bc,bx]=ag_buf("cut",ctx.canvas.width,ctx.canvas.height);ag_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else ag_shot(ctx,S,t,shots[i],till(i));return i;}

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
     pose    "hang" (arms down, the default), "point", "explain" (an open hand), "hold" (the near hand in front of the chest, holding o.hold),
             "desk" (forearms on a desk), "chin" (a hand under the chin, thinking), or {near: [upper arm, forearm, hand], far: ...},
             angles in degrees from straight down, positive towards the way the person faces; pose2 and mix blend into a second pose
     hold    (ctx, hands) => draws what the near hand holds, in figure space, over the near hand (holdBack: under it); hands.near and
             hands.far are the wrists (far is null while the far arm hangs), hands.nearElbow the near elbow
     nod     a nod, in radians (the head turns about the top of the neck); gaze [dx, dy] moves the eyes a little; blink 0 to 1
     talk    0 to 1, the mouth opens; smile 0 to 1
     cut     a height in the frame: the body is hidden below it (draw a desk first, cut at its back edge, and pose "desk" lays the
             forearms on it)
     covered true when something drawn over the person hides their waist. People end flat under the waist (figure y 1100, 504 s
             below the neck), so keep y + 504 s at least 1080 or cover it: a render or a check stops with an error where it shows
   People of other times: who.top.kind can be "robe" (a crossed collar), "tunic" or "apron" (over a shirt), and who.hat.paint(c, P)
   or who.top.paint(c, P) paints anything else in figure space, over the body or the head. who.hair.style: "side", "cropped",
   "coily", "bob", "bun", "long", "shaved". */

/* ---------------------------------------------------------------- figure space: the prototype's Jun, an adult's proportions */
const AG_F={
  head(c){c.moveTo(292,300);c.bezierCurveTo(340,298,374,320,384,356);c.bezierCurveTo(388,372,389,386,389,396);
    c.bezierCurveTo(389,402,385,408,383,414);c.bezierCurveTo(388,428,396,442,400,452);c.bezierCurveTo(401,457,396,460,389,461);
    c.bezierCurveTo(387,465,388,469,388,472);c.bezierCurveTo(390,476,388,480,385,481);c.bezierCurveTo(387,485,386,490,382,493);
    c.bezierCurveTo(379,497,381,503,382,509);c.bezierCurveTo(381,519,372,526,358,526);c.bezierCurveTo(328,525,300,510,282,490);
    c.bezierCurveTo(268,474,250,462,236,452);c.bezierCurveTo(214,430,206,390,212,360);c.bezierCurveTo(220,322,252,301,292,300);c.closePath();},
  ear(c){c.moveTo(287,404);c.bezierCurveTo(273,394,256,396,252,412);c.bezierCurveTo(248,428,252,446,262,456);c.bezierCurveTo(270,463,281,462,285,452);c.bezierCurveTo(289,438,290,420,287,404);c.closePath();},
  earIn(c){c.moveTo(277,414);c.bezierCurveTo(265,410,260,422,262,434);c.bezierCurveTo(264,444,270,448,277,444);},
  neck(c){c.moveTo(232,446);c.bezierCurveTo(236,480,236,528,234,566);c.bezierCurveTo(254,602,308,620,358,607);c.bezierCurveTo(350,580,347,552,344,524);c.lineTo(300,470);c.closePath();},
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
// hair, the shapes; each adds its path, the caller fills
const AG_HAIR={
  side(c){c.moveTo(391,352);c.bezierCurveTo(395,326,382,300,352,290);c.bezierCurveTo(320,280,270,282,244,298);
    c.bezierCurveTo(216,314,203,346,204,382);c.bezierCurveTo(205,414,212,440,224,456);c.bezierCurveTo(232,466,246,466,256,458);
    c.bezierCurveTo(263,446,263,430,267,414);c.bezierCurveTo(273,402,285,398,293,406);c.lineTo(297,429);c.lineTo(303,429);
    c.bezierCurveTo(303,404,305,384,313,368);c.bezierCurveTo(327,350,352,342,372,342);c.bezierCurveTo(381,342,387,346,391,352);c.closePath();},
  cropped(c){c.moveTo(386,350);c.bezierCurveTo(386,326,372,304,346,296);c.bezierCurveTo(316,288,272,290,248,304);
    c.bezierCurveTo(222,320,210,350,211,384);c.bezierCurveTo(212,414,218,438,228,452);c.bezierCurveTo(236,460,246,460,254,452);
    c.bezierCurveTo(260,440,262,426,266,414);c.bezierCurveTo(272,404,284,400,292,406);c.lineTo(296,426);c.lineTo(301,426);
    c.bezierCurveTo(301,404,304,386,312,372);c.bezierCurveTo(326,356,352,350,372,350);c.bezierCurveTo(379,350,383,350,386,350);c.closePath();},
  coily(c){const pts=[[388,352],[392,326],[378,302],[356,290],[328,282],[296,280],[266,284],[240,296],[220,316],[208,342],[203,372],[206,402],[214,430],[226,452]];
    c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,nx=-(b[1]-a[1]),ny=b[0]-a[0],l=Math.hypot(nx,ny)||1;
      c.quadraticCurveTo(mx-nx/l*7,my-ny/l*7,b[0],b[1]);}
    c.bezierCurveTo(236,462,248,462,256,452);c.bezierCurveTo(262,440,262,426,266,414);c.bezierCurveTo(272,402,284,398,292,404);c.lineTo(297,428);c.lineTo(303,428);
    c.bezierCurveTo(302,404,305,384,314,370);c.bezierCurveTo(328,354,354,348,374,349);c.closePath();},
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
// the head: skin, hair, the ear, then the face's fixed lines; eyes and mouth come live
function ag_paintHead(c,P,C){const st=P.hair.style;
  ag_soft(c,AG_F.head,C.skinBase,C.skinHi,362,400,170,C.skinShade,26);
  c.save();ag_shape(c,AG_F.head);c.clip();let g=c.createRadialGradient(346,458,0,346,458,32);g.addColorStop(0,rgba(mix(P.skin,[230,110,100],0.5),0.24));g.addColorStop(1,rgba([230,120,110],0));
  c.fillStyle=g;c.fillRect(300,416,100,90);c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.4),0.26);c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(290,494);c.quadraticCurveTo(318,514,350,520);c.stroke();c.restore();
  if(P.beard){const bd=P.beard;c.save();ag_shape(c,AG_F.head);c.clip();
    const beard=cc=>{cc.moveTo(298,426);cc.bezierCurveTo(300,452,302,478,312,500);cc.bezierCurveTo(324,520,346,532,368,530);cc.bezierCurveTo(382,526,388,514,386,500);
      cc.bezierCurveTo(380,494,372,490,362,492);cc.bezierCurveTo(352,494,346,488,350,478);cc.bezierCurveTo(360,470,376,466,390,468);cc.lineTo(396,462);
      cc.bezierCurveTo(380,458,360,462,344,470);cc.bezierCurveTo(330,476,320,466,316,450);cc.bezierCurveTo(312,440,308,430,304,424);cc.closePath();};
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
  if(st!=="bob"&&st!=="long"){ag_soft(c,AG_F.ear,mix(P.skin,ag_dk(P.skin,0.4),0.2),P.skin,264,424,32,C.skinShade,10);c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.5),0.6);c.lineWidth=2;ag_shape(c,AG_F.earIn);c.stroke();
    if(P.earrings){ag_soft(c,cc=>cc.arc(270,466,6,0,TAU),P.earrings,[255,255,255],268,463,6,null);}}
  // brows, lids, the nose, the glasses
  c.lineCap="round";c.strokeStyle=C.brow;c.lineWidth=5;c.beginPath();c.moveTo(313,401);c.quadraticCurveTo(332,390,353,395);c.stroke();
  c.lineWidth=4;c.beginPath();c.moveTo(366,396);c.quadraticCurveTo(376,392,386,397);c.stroke();
  c.strokeStyle=C.lid;c.lineWidth=2.4;c.beginPath();c.moveTo(322,414);c.quadraticCurveTo(333,407,345,412);c.stroke();
  c.beginPath();c.moveTo(369,412);c.quadraticCurveTo(375,408,382,411);c.stroke();
  c.strokeStyle=C.line;c.lineWidth=2.6;c.beginPath();c.moveTo(381,445);c.quadraticCurveTo(391,456,383,461);c.stroke();
  if(P.glasses){c.strokeStyle=rgba(P.glasses,0.95);c.lineWidth=3.4;rr(c,311,401,45,32,10);c.stroke();rr(c,364,400,25,31,8);c.stroke();
    c.beginPath();c.moveTo(356,415);c.quadraticCurveTo(360,411,364,414);c.stroke();c.beginPath();c.moveTo(311,413);c.lineTo(289,411);c.stroke();
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
  c.fillStyle=ng;c.fillRect(230,460,140,120);c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.5),0.16);c.lineWidth=2.2;c.lineCap="round";c.beginPath();c.moveTo(286,512);c.quadraticCurveTo(302,548,318,582);c.stroke();c.restore();
  // the collar closes over the neck: the neckline again, only its band
  if(P.top.kind==="sweater")ag_soft(c,AG_F.collar,ag_lt(sw,0.14),ag_lt(sw,0.3),330,600,80,rgba(ag_dk(sw,0.7),0.35),8);
  else if(P.top.kind==="tunic"||P.top.kind==="apron")ag_soft(c,AG_F.collar,ag_dk(sw,P.top.kind==="tunic"?0.1:0.06),ag_lt(sw,0.25),330,600,80,rgba(ag_dk(sw,0.7),0.35),8);
  else ag_neckline(c,P,C);}
// a person's kept pictures: the head; the body with both arms down, with only the far arm down, and with neither
function ag_fig(who){const P=ag_spec(who),k=P.key||P.name;let F=AG_PEOPLE[k];if(F)return F;const C=ag_colours(P);
  F=AG_PEOPLE[k]={P,C,head:ag_layer(c=>ag_paintHead(c,P,C),[180,262,420,560]),bodies:{}};return F;}
function ag_figBody(F,near,far){const k=(near?1:0)+(far?2:0);return F.bodies[k]||(F.bodies[k]=ag_layer(c=>ag_paintBody(c,F.P,F.C,near,far)));}

/* ---------------------------------------------------------------- arms that move
   An arm is [upper arm, forearm, hand]: the upper arm's and the forearm's angles in degrees from straight down, positive towards the
   way the person faces, and the hand: "rest", "hold", "point" or "open". Seen in three-quarter view, an arm reaching the way the
   person faces also reaches towards us, so its reach across the frame is drawn shorter (AG_FIG.fore). */
const AG_POSES={
  point:  {near:[62,98,"point"]},
  explain:{near:[24,100,"open"]},
  hold:   {near:[10,128,"hold"]},
  desk:   {near:[12,80,"rest"],far:[-6,84,"rest"]},
  chin:   {near:[40,160,"rest"]}
};
AG_FIG.fore=0.72;
const ag_rad=d=>d*Math.PI/180;
function ag_poseOf(o){const get=p=>p==="hang"?{near:[2,14,"rest"]}:typeof p==="string"?AG_POSES[p]:p;const a=get(o.pose);if(!a)return null;const b=o.pose2?get(o.pose2):null,m=clamp(o.mix||0,0,1);
  if(!b||m<=0)return a;if(m>=1)return b;const HANG={near:[2,14,"rest"],far:[0,6,"rest"]};
  const bl=(k)=>{const x=a[k]||HANG[k],y=b[k]||HANG[k];return[lerp(x[0],y[0],m),lerp(x[1],y[1],m),m<0.5?x[2]:y[2]];};
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
    const nj=ag_joints(J.near,pose.near||[2,14,"rest"]);hands={near:nj.Wr,far:fr?fr.Wr:null,nearElbow:nj.E};
    if(o.holdBack)o.holdBack(ctx,hands);ag_arm(ctx,P,C,J.near,pose.near||[2,14,"rest"],false);if(o.hold)o.hold(ctx,hands);}
  ctx.restore();
  // the head: breathing a little less than the body, nodding about the top of the neck
  ctx.save();ctx.translate(AG_FIG.piv[0],AG_FIG.piv[1]+br*0.7);ctx.rotate(o.nod||0);ctx.translate(-AG_FIG.piv[0],-AG_FIG.piv[1]);
  ag_drawLayer(ctx,F.head);
  // the eyes, the mouth
  const by=Math.max(0.12,1-blink);ctx.fillStyle="#1a1416";
  ctx.save();ctx.translate(334+g[0],418+g[1]);ctx.scale(1,by);ctx.beginPath();ctx.ellipse(0,0,4.8,5.6,0,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(376+g[0]*0.8,417+g[1]);ctx.scale(1,by);ctx.beginPath();ctx.ellipse(0,0,3.4,5,0,0,TAU);ctx.fill();ctx.restore();
  const tk=clamp(o.talk||0,0,1),sm=clamp(o.smile==null?0.3:o.smile,0,1);
  if(tk>0.04){ctx.fillStyle=rgba(mix(P.skin,[60,20,24],0.7),0.9);ctx.beginPath();ctx.moveTo(354,482);ctx.quadraticCurveTo(366,486-sm*3,379,480);ctx.quadraticCurveTo(368,488+tk*10,354,482);ctx.fill();}
  else{ctx.strokeStyle=C.line;ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(353,482-sm*1.5);ctx.quadraticCurveTo(365,486+sm*3,378,481-sm*1.5);ctx.stroke();}
  ctx.restore();ctx.restore();return hands;}
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

/* ===== Decades in the making: the film's own kit =====
   What this film adds to the module's shared look (films/what-an-agent-is/shared/src), with the prefix dm_:
     DM          the past's colours: plaster, stone, dark wood, parchment, iron, clay, bronze, paper and a lamp's warm light
     dm_where    the place and year in the corner of a scene from the past ("EUROPE · THE 1440S"), in the kicker's style
     dm_rail     the oak timeline along the lab's marble wall: a rail with a groove of decades, and a tab for each year the film
                 visits; the camera seems to travel along it as the year in focus changes
     dm_tab      one year's tab, hanging from the rail
     dm_people   the people of other times, as specs for ag_person
     dm_ease     helpers: a value between two cue times, and a spring that can start late
   Sizes are in the 1920 x 1080 frame; words are at least 28 px as seen, and nothing but the captions goes below y 890. */

const DM={plaster:[228,220,206],plasterDk:[196,184,166],stone:[188,178,162],wood:[124,92,64],woodDk:[86,62,44],woodLt:[168,132,96],
  parch:[240,229,204],parchDk:[214,198,166],ink:[44,40,48],iron:[74,76,82],ironLt:[132,134,140],clay:[190,132,96],clayLt:[222,170,130],
  bronze:[148,116,74],bronzeLt:[204,170,116],paper:[246,241,230],lamp:[255,214,150],sea:[198,210,214],land:[236,229,214],landEdge:[176,164,144]};

// the place and year of a scene from the past, in the corner, as the kicker sits in the lab's scenes
function dm_where(ctx,text,a,o){o=o||{};if(a<=0)return;const s=String(text).toUpperCase(),x=o.x||96,y=o.y||100,w=ag_tw(ctx,s,{w:700,size:28,ls:4});
  // on a small pale label, so it reads over anything the camera brings into the corner
  ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgba(246,243,236,0.82)";rr(ctx,x-18,y-36,w+36,50,10);ctx.fill();ctx.restore();
  ag_T(ctx,s,x,y,{w:700,size:28,ls:4,col:AG.kick,a});}

/* ---------------------------------------------------------------- the timeline along the wall
   dm_rail(ctx, o): the oak rail across the frame at o.y (196), with the year o.focus (a number, eased by the caller) at x = 960 and
   o.ppy pixels to a year; a groove under it with a short mark for each decade; tabs for o.years [{y: 1958, label, lit: 0..1, a}],
   each hanging from the rail where its year falls; o.a fades the whole rail; o.draw (0..1) draws the rail itself from the left.
   Returns x(year), so a scene can put its exhibits under its year. */
function dm_rail(ctx,o){const y=o.y||196,ppy=o.ppy||40,f=o.focus||1990,a=o.a==null?1:o.a,X=yr=>960+(yr-f)*ppy;if(a<=0)return X;
  const dr=o.draw==null?1:o.draw,x0=-40,x1=lerp(x0,W+40,ag_sine(dr));
  ctx.save();ctx.globalAlpha*=a;
  // the rail's shadow on the marble, falling down and a little left
  ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(46,38,28,0.18)";ctx.fillRect(x0-6,y+10,x1-x0,16);ctx.restore();
  // the groove: a thin line with a mark for each decade, under the rail
  ctx.strokeStyle="rgba(60,52,44,0.28)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y+40);ctx.lineTo(x1,y+40);ctx.stroke();
  const d0=Math.floor((f-960/ppy)/10)*10,d1=Math.ceil((f+960/ppy)/10)*10;
  for(let d=d0;d<=d1;d+=10){const x=X(d);if(x>x1)break;ctx.lineWidth=d%50===0?3:2;ctx.beginPath();ctx.moveTo(x,y+32);ctx.lineTo(x,y+48);ctx.stroke();}
  // the rail: oiled oak, lit from the right, its ends rounded
  const rh=22,g=ctx.createLinearGradient(0,y-rh/2,0,y+rh/2);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(0.45,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(AG_OAK.dark,1));
  ctx.fillStyle=g;rr(ctx,x0,y-rh/2,x1-x0,rh,rh/2);ctx.fill();
  ctx.strokeStyle="rgba(255,250,240,0.6)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0+12,y-rh/2+3);ctx.lineTo(x1-12,y-rh/2+3);ctx.stroke();
  // the grain: a few long, soft lines
  ctx.strokeStyle="rgba(120,96,66,0.22)";ctx.lineWidth=1.2;for(const k of [-4,2,6]){ctx.beginPath();ctx.moveTo(x0+20,y+k);ctx.lineTo(x1-20,y+k+0.5);ctx.stroke();}
  // a tab fades as it nears the frame's edge, so a year sliding past is never cut in half
  const m=ctx.getTransform(),s0=ctx.canvas.width/W;
  for(const tb of (o.years||[])){const x=X(tb.y);if(x<-200||x>W+200||x>x1+20)continue;const fx=(m.a*x+m.c*y+m.e)/s0,ea=clamp((Math.min(fx,W-fx)-24)/56,0,1);if(ea<=0)continue;
    dm_tab(ctx,x,y,tb.label||String(tb.y),{lit:tb.lit||0,a:(tb.a==null?1:tb.a)*ea,w:tb.w,drop:tb.drop,pin:tb.pin,grow:tb.grow});}
  ctx.restore();return X;}
// a year's tab: a small oak plate hanging from the rail on a brass pin; lit (0..1) brings it forward, larger, with a soft light
function dm_tab(ctx,x,y,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const lit=o.lit||0,pin=clamp(o.pin||0,0,1),ps=ag_sine(pin),grow=o.grow==null?0.16:o.grow,
    k=(1+grow*ag_sine(lit))*(1-ps),tw=ag_tw(ctx,label,{w:700,size:34}),w=o.w||Math.max(132,tw+44),h=58,dr=(o.drop||0)*(1-ps);
  ctx.save();ctx.globalAlpha*=a;
  // a year too close to its neighbours to hang a tab: a brass stud on the rail, which glows when lit
  if(pin>0){const r=4+5*ps;if(lit>0){ctx.save();ctx.globalAlpha*=lit*ps;const gl=ctx.createRadialGradient(x,y,0,x,y,48);gl.addColorStop(0,"rgba(255,244,220,0.95)");gl.addColorStop(1,"rgba(255,244,220,0)");
      ctx.fillStyle=gl;ctx.fillRect(x-48,y-48,96,96);ctx.restore();}
    ctx.save();ctx.globalAlpha*=ps;const g=ctx.createRadialGradient(x-r*0.35,y-r*0.4,0,x,y,r);g.addColorStop(0,"#EEDAB0");g.addColorStop(0.55,"#BD9E6A");g.addColorStop(1,"#7E6440");
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
  if(k>0.02){ctx.strokeStyle="rgba(80,66,50,0.6)";ctx.lineWidth=2;if(dr>0.5){ctx.beginPath();ctx.moveTo(x,y+14);ctx.lineTo(x,y+22+dr);ctx.stroke();}
    ctx.translate(x,y+22+dr);ctx.scale(k,k);
    // the pin, or where its string meets the tab
    ctx.fillStyle="#9C8669";ctx.beginPath();ctx.arc(0,dr>0.5?0:-8,5,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(0,8);ctx.stroke();
    if(lit>0){ctx.save();ctx.globalAlpha*=lit;const gl=ctx.createRadialGradient(0,40,0,0,40,w*0.9);gl.addColorStop(0,"rgba(255,248,232,0.85)");gl.addColorStop(1,"rgba(255,248,232,0)");
      ctx.fillStyle=gl;ctx.fillRect(-w,-40,w*2,170);ctx.restore();}
    // the label goes before the tab gets small, so no year is ever drawn too small to read
    ctx.globalAlpha*=clamp(1-pin*2.5,0,1);ag_box(ctx,-w/2,8,w,h,12,{});
    ctx.fillStyle=rgba(AG_OAK.base,0.55+0.45*lit);rr(ctx,-w/2,8+h-6,w,6,3);ctx.fill();
    ag_T(ctx,label,0,8+h/2+12,{w:700,size:34,align:"center",col:mix(AG.mut,AG.ink,lit)});}
  ctx.restore();}

/* ---------------------------------------------------------------- the people of other times (specs for ag_person)
   Dressed for their time, in the module's matte style; nobody of the past is drawn as a likeness, since no portrait of the
   1440s or 1450s survives that was drawn from life. */
const DM_PEOPLE={
  // a scribe in the 1440s: a plain wool gown and a close cap
  scribe:{key:"dm_scribe",name:"A scribe",skin:[224,186,152],hair:{style:"cropped",c:[92,70,50]},top:{kind:"tunic",c:[96,88,104]},breath:0.24,
    hat:{paint:(c,P)=>dm_cap(c,[70,62,76])}},
  // Johannes Gutenberg, a metalworker, around 1450: a leather apron over a linen shirt, a felt cap; his face is ours, not a portrait
  gutenberg:{key:"dm_gutenberg",name:"Johannes Gutenberg",skin:[222,182,148],hair:{style:"side",c:[82,62,46]},beard:[88,66,50],top:{kind:"apron",c:[132,96,66],inner:[226,218,200]},breath:0.25,
    hat:{paint:(c,P)=>dm_bonnet(c,[78,70,62])}},
  // Johann Fust, a merchant of Mainz: a gown with a fur collar
  fust:{key:"dm_fust",name:"Johann Fust",skin:[230,196,166],hair:{style:"side",c:[120,110,100]},top:{kind:"tunic",c:[98,54,52],paint:(c,P)=>dm_furCollar(c)},breath:0.22,
    hat:{paint:(c,P)=>dm_chaperon(c,[60,30,34])}},
  // a psychologist in 1958: a suit and tie
  y1958:{key:"dm_1958",name:"Frank Rosenblatt",skin:[232,198,170],hair:{style:"side",c:[42,34,30]},top:{kind:"suit",c:[78,82,92],inner:[240,240,234],tie:[58,62,86]},breath:0.27},
  // two reporters at the demonstration in July 1958: a press photographer in a fedora, and a reporter with her notebook
  press:{key:"dm_press",name:"A press photographer",skin:[214,170,136],hair:{style:"cropped",c:[60,46,36]},top:{kind:"suit",c:[104,96,84],inner:[236,232,222],tie:[96,52,46]},breath:0.28,
    hat:{paint:(c,P)=>dm_fedora(c,[74,66,58])}},
  reporter:{key:"dm_reporter",name:"A reporter",skin:[176,124,94],hair:{style:"bob",c:[36,28,26]},earrings:[226,222,210],top:{kind:"blazer",c:[70,82,98],inner:[238,234,226]},breath:0.3},
  // someone in 2022 who ranks a model's answers
  rater:{key:"dm_rater",name:"A rater",skin:[182,132,102],hair:{style:"bob",c:[34,28,30]},earrings:[208,214,226],top:{kind:"sweater",c:[112,130,150]},breath:0.29}
};
// a close cloth cap over the crown (figure space: the head runs from y 300 to 526, the crown about x 212 to 389)
function dm_cap(c,col,brim){const f=cc=>{cc.moveTo(206,384);cc.bezierCurveTo(198,320,250,284,300,282);cc.bezierCurveTo(352,282,392,312,396,370);
    cc.bezierCurveTo(380,358,344,352,300,354);cc.bezierCurveTo(258,356,226,366,206,384);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.35),330,300,120,rgba(ag_dk(col,0.7),0.45),14);
  if(brim){const b=cc=>{cc.moveTo(200,388);cc.bezierCurveTo(240,360,350,350,402,372);cc.bezierCurveTo(404,382,398,388,390,386);cc.bezierCurveTo(340,370,250,376,206,398);cc.closePath();};
    ag_soft(c,b,ag_dk(col,0.1),ag_lt(col,0.3),340,366,80,rgba(ag_dk(col,0.7),0.4),6);}}
// a soft cloth bonnet, a craftsman's: a full crown leaning back, its band at the brow (figure space; a person's picture ends at y 262)
function dm_bonnet(c,col){const f=cc=>{cc.moveTo(204,404);cc.bezierCurveTo(180,336,212,276,284,268);cc.bezierCurveTo(350,262,396,290,398,352);
    cc.bezierCurveTo(398,362,394,368,388,370);cc.bezierCurveTo(340,352,262,362,214,412);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.32),320,284,130,rgba(ag_dk(col,0.7),0.45),16);
  ag_folds(c,f,[[[236,306],[290,316],[340,298]],[[222,352],[262,334],[300,334]]],rgba(ag_dk(col,0.6),0.4),rgba(ag_lt(col,0.3),0.4));
  const b=cc=>{cc.moveTo(206,412);cc.bezierCurveTo(260,360,338,350,392,368);cc.lineTo(394,384);cc.bezierCurveTo(340,368,262,378,212,426);cc.closePath();};
  ag_soft(c,b,ag_dk(col,0.12),ag_lt(col,0.25),350,370,80,rgba(ag_dk(col,0.7),0.4),5);}
// a chaperon, a merchant's hat of the 1450s: a padded roll round the head and cloth folded over its top (figure space)
function dm_chaperon(c,col){const top=cc=>{cc.moveTo(212,366);cc.bezierCurveTo(196,300,246,266,310,266);cc.bezierCurveTo(372,266,408,300,402,356);cc.closePath();};
  ag_soft(c,top,col,ag_lt(col,0.3),330,276,130,rgba(ag_dk(col,0.7),0.45),16);
  ag_folds(c,top,[[[236,318],[286,290],[330,284]],[[250,342],[310,314],[372,316]],[[300,276],[350,284],[384,318]]],rgba(ag_dk(col,0.6),0.45),rgba(ag_lt(col,0.3),0.4));
  const roll=cc=>{cc.moveTo(194,380);cc.bezierCurveTo(206,334,300,322,406,344);cc.bezierCurveTo(420,356,420,382,406,394);cc.bezierCurveTo(320,376,240,390,206,424);cc.bezierCurveTo(190,416,188,394,194,380);cc.closePath();};
  ag_soft(c,roll,ag_dk(col,0.05),ag_lt(col,0.35),360,344,120,rgba(ag_dk(col,0.7),0.5),12);
  ag_folds(c,roll,[[[230,376],[300,350],[380,354]]],rgba(ag_dk(col,0.6),0.4),rgba(ag_lt(col,0.35),0.4));}
// a fedora of the 1950s, worn low: a pinched crown, a dark band and a brim turned down at the front (figure space; a picture ends at y 262)
function dm_fedora(c,col){const brim=cc=>{cc.moveTo(180,374);cc.bezierCurveTo(198,350,300,340,410,350);cc.bezierCurveTo(428,353,432,366,418,372);
    cc.bezierCurveTo(330,370,240,380,192,394);cc.bezierCurveTo(176,394,172,382,180,374);cc.closePath();};
  const crown=cc=>{cc.moveTo(214,362);cc.bezierCurveTo(206,322,214,288,244,276);cc.bezierCurveTo(270,268,298,276,316,272);cc.bezierCurveTo(344,266,372,274,380,300);
    cc.bezierCurveTo(386,320,386,340,384,356);cc.bezierCurveTo(330,348,260,352,214,362);cc.closePath();};
  ag_soft(c,brim,ag_dk(col,0.08),ag_lt(col,0.3),360,350,120,rgba(ag_dk(col,0.7),0.45),8);
  ag_soft(c,crown,col,ag_lt(col,0.32),340,282,120,rgba(ag_dk(col,0.7),0.45),14);
  ag_folds(c,crown,[[[246,292],[298,288],[352,290]]],rgba(ag_dk(col,0.6),0.5),rgba(ag_lt(col,0.3),0.4));
  const band=cc=>{cc.moveTo(212,344);cc.bezierCurveTo(270,332,340,330,386,338);cc.lineTo(386,356);cc.bezierCurveTo(340,348,270,350,214,362);cc.closePath();};
  ag_soft(c,band,[40,34,32],[84,74,68],350,338,80,null,0);}
// a press camera of the 1950s held at the chest: a leather-covered box with its lens to the front, and a flash gun on top whose round
// reflector faces the same way (figure space, at the near hand); flash: 0..1, the bulb going off
function dm_pressCamera(c,h,flash){const [x,y]=h.near;c.save();c.translate(x+14,y-26);
  // the box, its leather and its lens
  ag_soft(c,cc=>ag_rect(cc,-70,-72,150,140,12),[40,40,44],[104,104,110],66,-62,150,"rgba(0,0,0,0.45)",8);
  c.strokeStyle="rgba(255,255,255,0.08)";c.lineWidth=2;for(let k=0;k<6;k++){c.beginPath();c.moveTo(-62,-58+k*22);c.lineTo(72,-58+k*22);c.stroke();}
  ag_soft(c,cc=>ag_rect(cc,80,-46,44,92,6),[54,54,58],[120,120,126],116,-38,70,null,0);
  ag_soft(c,cc=>cc.ellipse(126,0,15,38,0,0,TAU),[26,28,36],[110,130,160],130,-14,40,"rgba(0,0,0,0.4)",3);
  // the flash gun: a short stem, the reflector seen from the side, its bulb
  c.strokeStyle="rgba(150,152,158,1)";c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(10,-72);c.lineTo(18,-104);c.stroke();
  const dish=cc=>cc.ellipse(24,-160,28,60,0.06,0,TAU);
  ag_soft(c,dish,[176,180,188],[246,247,250],34,-190,80,"rgba(30,30,40,0.4)",6);
  c.save();ag_shape(c,dish);c.clip();const g=c.createRadialGradient(34,-158,4,30,-160,64);g.addColorStop(0,"rgba(255,255,255,0.95)");g.addColorStop(0.5,"rgba(214,218,226,0.6)");
  g.addColorStop(1,"rgba(150,156,168,0.5)");c.fillStyle=g;c.beginPath();c.ellipse(32,-160,20,52,0.06,0,TAU);c.fill();c.restore();
  c.strokeStyle="rgba(120,124,134,0.9)";c.lineWidth=4;c.beginPath();c.ellipse(24,-160,28,60,0.06,0,TAU);c.stroke();
  ag_soft(c,cc=>cc.ellipse(38,-160,9,13,0,0,TAU),[236,234,224],[255,255,250],40,-166,14,null,0);
  if(flash>0){c.save();c.globalCompositeOperation="lighter";const f=c.createRadialGradient(40,-160,4,40,-160,240);f.addColorStop(0,"rgba(255,252,236,"+(0.95*flash)+")");
    f.addColorStop(0.25,"rgba(255,246,220,"+(0.55*flash)+")");f.addColorStop(1,"rgba(255,246,220,0)");c.fillStyle=f;c.beginPath();c.arc(40,-160,240,0,TAU);c.fill();c.restore();}
  c.restore();}
// a reporter's notebook held at the chest (figure space, at the near hand)
function dm_notebook(c,h){const [x,y]=h.near;c.save();c.translate(x+6,y-46);c.rotate(-0.18);
  c.save();c.shadowColor="rgba(40,30,20,0.3)";c.shadowBlur=10;c.shadowOffsetX=-4;c.shadowOffsetY=6;c.fillStyle="#F4F0E4";c.fillRect(-46,-70,92,124);c.restore();
  c.strokeStyle="rgba(120,120,130,0.9)";c.lineWidth=3;for(let i=0;i<7;i++){c.beginPath();c.arc(-34+i*11.5,-70,4,Math.PI,TAU);c.stroke();}
  c.fillStyle="rgba(60,60,80,0.45)";for(let i=0;i<6;i++)c.fillRect(-36,-48+i*16,i%3===2?44:68,3);c.restore();}
// a fur collar over a gown's shoulders (figure space)
function dm_furCollar(c){const f=cc=>{cc.moveTo(170,600);cc.bezierCurveTo(220,560,300,560,330,600);cc.bezierCurveTo(372,566,440,570,470,610);
    cc.bezierCurveTo(470,650,440,670,400,660);cc.bezierCurveTo(372,700,330,706,320,700);cc.bezierCurveTo(300,720,250,700,230,680);cc.bezierCurveTo(196,670,170,640,170,600);cc.closePath();};
  ag_soft(c,f,[118,92,70],[176,150,120],380,600,140,"rgba(40,26,16,0.45)",14);
  c.save();ag_shape(c,f);c.clip();c.strokeStyle="rgba(70,50,34,0.35)";c.lineWidth=2;const r=ag_rnd(41);for(let i=0;i<70;i++){const x=170+r()*300,y=570+r()*130;c.beginPath();c.moveTo(x,y);c.lineTo(x+4,y+10);c.stroke();}c.restore();}

/* ---------------------------------------------------------------- helpers */
// 0 before a, 1 after b, eased (sine) between
const dm_btw=(t,a,b)=>ag_sine(clamp((t-a)/Math.max(0.001,b-a),0,1));
// a count that runs from 0 to n between a and b, easing out, as whole numbers
const dm_count=(t,a,b,n)=>Math.round(n*ag_eo(clamp((t-a)/Math.max(0.001,b-a),0,1)));
// a number with thousands separators
const dm_num=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,",");

/* ===== Decades in the making: the past =====
   The opening's places and things, in the module's matte style (no watercolour, no grain), lit from a window on the right as the lab
   is. Each place is painted once (AG_PLACES); what moves is drawn live over it.
     dmScribe   a writing room in the 1440s: plaster, a tall window on the right, a slanted desk
     dmShelf    a library's wall in 1424: stone, an oak press with two shelves
     dmDesk     a table from above, for pages and copies
     dmIron     a plain wooden bench from above, for an iron frame of clay pieces and a small fire under it
     dmCloth    a table with a cloth, for a book and pieces of metal
     dmMainz    a workshop in Mainz around 1450: timber and plaster, a wooden press, a case of letters, a bench
     dmMap      Europe, as a pale relief: the land, the sea, no borders
     dmPlaster  a plain plaster wall, for the printing timeline
   No script but our own Latin letters is drawn: the clay and metal pieces show their backs, and pages printed in China and Korea
   show soft grey rows, never characters. */

/* ---------------------------------------------------------------- shared painting helpers */
// a warm plaster wall, lighter towards the window on the right, with a soft mottle
function dm_plaster(c,x,y,w,h,col,seed){col=col||DM.plaster;const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(ag_dk(col,0.1),1));g.addColorStop(0.75,rgba(col,1));g.addColorStop(1,rgba(ag_lt(col,0.12),1));
  c.fillStyle=g;c.fillRect(x,y,w,h);const r=ag_rnd(seed||7);c.save();c.globalAlpha=0.05;for(let i=0;i<90;i++){const px=x+r()*w,py=y+r()*h,rad=40+r()*160;const rg=c.createRadialGradient(px,py,0,px,py,rad);
    const d=r()<0.5;rg.addColorStop(0,d?"rgba(120,100,80,1)":"rgba(255,250,240,1)");rg.addColorStop(1,d?"rgba(120,100,80,0)":"rgba(255,250,240,0)");c.fillStyle=rg;c.fillRect(px-rad,py-rad,rad*2,rad*2);}c.restore();
  // a soft darkening at the top and the corners
  const v=c.createLinearGradient(0,y,0,y+h);v.addColorStop(0,"rgba(60,46,32,0.16)");v.addColorStop(0.35,"rgba(60,46,32,0)");v.addColorStop(1,"rgba(60,46,32,0.06)");c.fillStyle=v;c.fillRect(x,y,w,h);}
// wooden boards: a floor or a table top, its boards running across (dir "x") or away from us (dir "y")
function dm_boards(c,x,y,w,h,col,o){o=o||{};const n=o.n||7,r=ag_rnd(o.seed||3);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  for(let i=0;i<n;i++){const by=y+i*h/n,bh=h/n,tone=0.94+r()*0.12,cc=[col[0]*tone,col[1]*tone,col[2]*tone].map(v=>Math.min(255,v));
    const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(ag_dk(cc,0.12),1));g.addColorStop(0.7,rgba(cc,1));g.addColorStop(1,rgba(ag_lt(cc,0.1),1));c.fillStyle=g;c.fillRect(x,by,w,bh+1);
    c.strokeStyle="rgba(50,32,18,0.28)";c.lineWidth=2;c.beginPath();c.moveTo(x,by);c.lineTo(x+w,by);c.stroke();
    c.strokeStyle="rgba(60,40,22,0.1)";c.lineWidth=1.2;for(let k=0;k<5;k++){const yy=by+bh*(0.15+r()*0.7);c.beginPath();c.moveTo(x,yy);c.bezierCurveTo(x+w*0.3,yy+(r()-0.5)*8,x+w*0.6,yy+(r()-0.5)*8,x+w,yy+(r()-0.5)*6);c.stroke();}}
  c.restore();}
// light from the window: a warm, soft shaft across a rectangle, brightest at (lx, ly)
function dm_glow(c,lx,ly,rad,a,col){const g=c.createRadialGradient(lx,ly,0,lx,ly,rad);g.addColorStop(0,rgba(col||[255,246,226],a));g.addColorStop(1,rgba(col||[255,246,226],0));c.fillStyle=g;c.fillRect(lx-rad,ly-rad,rad*2,rad*2);}
// a tall window with a round head, deep in a stone reveal, and small leaded panes; its light falls on the floor
function dm_window(c,x,y,w,h,o){o=o||{};const r=w/2;const arch=cc=>{cc.moveTo(x,y+h);cc.lineTo(x,y+r);cc.arc(x+r,y+r,r,Math.PI,0);cc.lineTo(x+w,y+h);cc.closePath();};
  // the reveal: stone, lit on its left side (the light comes in from the right, through it)
  c.save();const rv=cc=>{cc.moveTo(x-34,y+h+30);cc.lineTo(x-34,y+r);cc.arc(x+r,y+r,r+34,Math.PI,0);cc.lineTo(x+w+34,y+h+30);cc.closePath();};
  ag_soft(c,rv,DM.stone,[250,244,232],x,y+h*0.4,w,rgba([60,46,30],0.35),26);c.restore();
  // the glass: a pale sky, brightest low
  ag_shape(c,arch);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#F3F1EA");g.addColorStop(1,"#FFFDF6");c.fillStyle=g;c.fill();
  // the leading: a diamond lattice of thin graphite lines
  c.save();ag_shape(c,arch);c.clip();c.strokeStyle="rgba(70,66,64,0.42)";c.lineWidth=2;const s=o.pane||46;
  for(let k=-h;k<w+h;k+=s){c.beginPath();c.moveTo(x+k,y);c.lineTo(x+k+h,y+h);c.stroke();c.beginPath();c.moveTo(x+k,y+h);c.lineTo(x+k+h,y);c.stroke();}
  // the mullion and a transom of iron
  c.strokeStyle="rgba(58,56,58,0.75)";c.lineWidth=6;c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h*0.55);c.lineTo(x+w,y+h*0.55);c.stroke();c.restore();
  // the sill
  ag_soft(c,cc=>ag_rect(cc,x-50,y+h,w+100,26,4),DM.stone,[255,250,240],x+w,y+h,w,rgba([60,46,30],0.4),10);}

/* ---------------------------------------------------------------- a point on a four-sided surface
   dm_L(Q, u, v): Q is [near left, near right, far right, far left]; u runs left to right, v from the near edge to the far one. */
function dm_L(Q,u,v){return[lerp(lerp(Q[0][0],Q[1][0],u),lerp(Q[3][0],Q[2][0],u),v),lerp(lerp(Q[0][1],Q[1][1],u),lerp(Q[3][1],Q[2][1],u),v)];}
const dm_quad=(Q)=>c=>{c.moveTo(Q[0][0],Q[0][1]);for(const q of Q.slice(1))c.lineTo(q[0],q[1]);c.closePath();};
// the part of Q between u0..u1 and v0..v1, as a quad
const dm_sub=(Q,u0,u1,v0,v1)=>[dm_L(Q,u0,v0),dm_L(Q,u1,v0),dm_L(Q,u1,v1),dm_L(Q,u0,v1)];

/* ---------------------------------------------------------------- handwriting, seen from a little way off
   A row of a book hand: words of short upright strokes (minims), some with a stroke above the line or below it, drawn on a page Q
   along v from u0 to u1. dm_hand(c, Q, rows, p, o): rows are written from the top (far) down; p (0..rows) says how far, in rows,
   the writing has got; returns where the pen is. o.seed gives each page its own words; o.h the strokes' height in v. */
function dm_hand(c,Q,rows,p,o){o=o||{};const u0=o.u0||0.1,u1=o.u1||0.9,top=o.top||0.86,pitch=o.pitch||0.074,h=o.h||0.024,r=ag_rnd(o.seed||5);
  let tip=null;c.save();c.strokeStyle=rgba(o.col||DM.ink,o.a==null?0.7:o.a);c.lineWidth=o.lw||1.8;c.lineCap="round";c.beginPath();
  for(let i=0;i<rows;i++){const v=top-i*pitch,f=clamp(p-i,0,1),uEnd=u0+(u1-u0)*f;let u=u0+(i===0&&o.indent?0.08:0);
    while(u<u1-0.01){const n=1+Math.floor(r()*6),wl=n*0.02;if(u+wl>u1)break;
      for(let k=0;k<n;k++){const m=1+(r()<0.45?1:0),asc=r()<0.14,desc=!asc&&r()<0.07;
        for(let j=0;j<m;j++){const uu=u+k*0.02+j*0.008;if(uu>uEnd)break;const a=dm_L(Q,uu,v+(asc?h*1.7:h)),b=dm_L(Q,uu-0.002,v-(desc?h*0.9:0));
          c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);const ft=dm_L(Q,uu+0.006,v-(desc?h*0.9:0)-0.004);c.lineTo(ft[0],ft[1]);}}
      u+=wl+0.022;}
    if(f>0&&f<1)tip=dm_L(Q,uEnd,v);if(f<1&&tip)break;}
  c.stroke();c.restore();if(!tip){const i=clamp(Math.floor(p),0,rows-1);tip=dm_L(Q,u0+(u1-u0)*clamp(p-i,0,1),top-i*pitch);}return tip;}

/* ---------------------------------------------------------------- the writing room, in the 1440s
   A scribe at a sloped writing desk by a window: the desk is part of the place, with the book open on it, its left page written;
   the right page is written live (dm_writing), and the scribe's near hand follows the pen (dm_scribe). */
const DM_SCRIBE={win:[1500,130,280,540],floor:760,
  // the desk's sloping board, [near left, near right, far right, far left]: a wide desk the scribe sits behind
  board:[[300,904],[1400,904],[1350,676],[340,676]],
  // the new book, open on the board (u0, u1, v0, v1 of the board), its pages; the book being copied stands on a rest at the right
  book:[0.17,0.55,0.12,0.9],rest:[1010,520,300,190],rows:11};
const dm_book=()=>{const b=DM_SCRIBE.book;return dm_sub(DM_SCRIBE.board,b[0],b[1],b[2],b[3]);};
const dm_page=side=>{const Q=dm_book();return side==="left"?dm_sub(Q,0.03,0.49,0.03,0.97):dm_sub(Q,0.51,0.97,0.03,0.97);};
// an open book on a quad Q: the cover's edge, two pages and the shadow of the spine; written: which pages are full
function dm_openBook(c,Q,o){o=o||{};ag_soft(c,dm_quad(Q),o.cover||[96,54,44],[150,96,70],Q[2][0],Q[2][1],400,"rgba(30,12,6,0.4)",8);
  const L=dm_sub(Q,0.03,0.49,0.03,0.97),R=dm_sub(Q,0.51,0.97,0.03,0.97);
  for(const P of [L,R])ag_soft(c,dm_quad(P),DM.parch,[255,252,240],P[2][0],P[2][1]+40,320,"rgba(90,66,30,0.26)",12);
  const s0=dm_L(Q,0.5,0.03),s1=dm_L(Q,0.5,0.97),w=Math.abs(Q[1][0]-Q[0][0])*0.05,g=c.createLinearGradient(s0[0]-w,0,s0[0]+w,0);
  g.addColorStop(0,"rgba(90,66,30,0)");g.addColorStop(0.5,"rgba(90,66,30,0.32)");g.addColorStop(1,"rgba(90,66,30,0)");
  c.fillStyle=g;c.beginPath();c.moveTo(s0[0]-w,s0[1]);c.lineTo(s0[0]+w,s0[1]);c.lineTo(s1[0]+w,s1[1]);c.lineTo(s1[0]-w,s1[1]);c.closePath();c.fill();
  return{L,R};}
AG_PLACES.dmScribe=c=>{const F=DM_SCRIBE.floor,[wx,wy,ww,wh]=DM_SCRIBE.win,B=DM_SCRIBE.board;dm_plaster(c,0,0,W,F,DM.plaster,11);
  // a timber beam along the top
  ag_soft(c,cc=>cc.rect(0,0,W,46),DM.woodDk,DM.woodLt,1500,20,700,"rgba(30,20,10,0.4)",12);
  dm_window(c,wx,wy,ww,wh,{});
  // a shelf on the left wall with three closed books and a jar
  ag_soft(c,cc=>ag_rect(cc,40,330,300,22,3),DM.wood,DM.woodLt,330,330,300,"rgba(30,20,10,0.35)",8);
  for(const [bx,bw,bh,col] of [[64,46,120,[110,60,48]],[114,38,104,[84,70,96]],[158,52,128,[120,98,62]]])ag_soft(c,cc=>ag_rect(cc,bx,330-bh,bw,bh,4),col,ag_lt(col,0.3),bx+bw,330-bh,120,"rgba(30,20,10,0.35)",8);
  ag_soft(c,cc=>{cc.moveTo(250,330);cc.bezierCurveTo(240,290,250,262,272,256);cc.lineTo(300,256);cc.bezierCurveTo(322,262,332,290,322,330);cc.closePath();},[176,150,120],[236,220,196],320,280,80,"rgba(40,26,14,0.35)",8);
  // the floor: boards, darker under the wall, lit where the window's light falls
  dm_boards(c,0,F,W,H-F,DM.woodLt,{n:6,seed:5});
  const sh=c.createLinearGradient(0,F,0,H);sh.addColorStop(0,"rgba(40,26,14,0.3)");sh.addColorStop(0.2,"rgba(40,26,14,0)");c.fillStyle=sh;c.fillRect(0,F,W,H-F);
  c.save();c.globalCompositeOperation="screen";dm_glow(c,1560,F+150,560,0.32);dm_glow(c,1640,420,640,0.22);c.restore();
  c.fillStyle="rgba(40,26,14,0.22)";c.fillRect(0,F-6,W,8);
  // the desk: a box of dark oak under the board, its panels, its shadow on the floor
  ag_floorShadow(c,860,1076,640,40,0.3);
  ag_soft(c,cc=>{cc.moveTo(320,904);cc.lineTo(1388,904);cc.lineTo(1380,1090);cc.lineTo(328,1090);cc.closePath();},DM.woodDk,DM.wood,1300,940,520,"rgba(20,12,6,0.45)",16);
  for(const px of [380,740,1080])ag_inner(c,cc=>ag_rect(cc,px,940,250,150,6),"rgba(20,12,6,0.5)",10,-3,3);
  // the board, and its thick near edge
  ag_soft(c,dm_quad(B),DM.wood,DM.woodLt,1300,700,700,"rgba(30,18,8,0.42)",14);
  ag_soft(c,cc=>ag_rect(cc,288,896,1124,26,5),DM.woodDk,DM.woodLt,1360,900,500,"rgba(20,12,6,0.4)",6);
  // the new book: the left page written, with a red initial at its head; the right page is written live
  const nb=dm_openBook(c,dm_book());c.fillStyle="rgba(168,52,40,0.85)";const i0=dm_L(nb.L,0.1,0.93),i1=dm_L(nb.L,0.2,0.8);c.fillRect(i0[0],i0[1],i1[0]-i0[0],i1[1]-i0[1]);
  dm_hand(c,nb.L,DM_SCRIBE.rows,DM_SCRIBE.rows,{seed:21,u0:0.1,u1:0.9,indent:true});
  // the book being copied, open on a rest at the right of the desk: a slanted board on two struts
  const [rx,ry,rw,rh]=DM_SCRIBE.rest,R=[[rx,ry+rh],[rx+rw,ry+rh],[rx+rw-26,ry],[rx+26,ry]];
  ag_soft(c,cc=>{cc.moveTo(rx+40,ry+rh);cc.lineTo(rx+60,ry+rh+70);cc.lineTo(rx+80,ry+rh+70);cc.lineTo(rx+66,ry+rh);cc.closePath();cc.moveTo(rx+rw-66,ry+rh);cc.lineTo(rx+rw-80,ry+rh+70);cc.lineTo(rx+rw-60,ry+rh+70);cc.lineTo(rx+rw-40,ry+rh);cc.closePath();},DM.woodDk,DM.wood,rx+rw,ry+rh+40,120,"rgba(20,12,6,0.4)",6);
  ag_floorShadow(c,rx+rw/2,ry+rh+74,rw*0.6,14,0.3);
  ag_soft(c,dm_quad(R),DM.wood,DM.woodLt,rx+rw,ry+20,300,"rgba(30,18,8,0.4)",10);
  const ex=dm_openBook(c,dm_sub(R,0.05,0.95,0.08,0.98),{cover:[70,58,84]});
  for(const [P,sd] of [[ex.L,41],[ex.R,42]])dm_hand(c,P,9,9,{seed:sd,u0:0.1,u1:0.9,pitch:0.09,top:0.84,h:0.03,lw:1.6,a:0.7});
  c.fillStyle="rgba(46,70,140,0.8)";const e0=dm_L(ex.L,0.1,0.92),e1=dm_L(ex.L,0.22,0.76);c.fillRect(e0[0],e0[1],e1[0]-e0[0],e1[1]-e0[1]);
  // an inkhorn in a hole at the board's far left
  ag_soft(c,cc=>{cc.moveTo(900,686);cc.lineTo(912,640);cc.lineTo(936,644);cc.lineTo(928,690);cc.closePath();},[60,46,40],[150,130,110],930,644,40,"rgba(0,0,0,0.4)",6);};

// the right page, written up to p (0..1 of its rows); returns where the pen is
function dm_writing(ctx,p){return dm_hand(ctx,dm_page("right"),DM_SCRIBE.rows,p*DM_SCRIBE.rows,{seed:34,u0:0.1,u1:0.9});}

// an arm that reaches a point: the angles (degrees from straight down, forward positive) of the upper arm and the forearm that put
// the wrist at T, from the shoulder J, in figure space, the elbow bending down and back
function dm_reach(J,T,hand){const f=AG_FIG.fore,L1=AG_FIG.L1,L2=AG_FIG.L2,dx=(T[0]-J[0])/f,dy=T[1]-J[1],d=clamp(Math.hypot(dx,dy),Math.abs(L1-L2)+1,L1+L2-1);
  const base=Math.atan2(dx,dy),k=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),a1=base-k,E=[Math.sin(a1)*L1,Math.cos(a1)*L1],a2=Math.atan2(dx-E[0],dy-E[1]);
  return[a1*180/Math.PI,a2*180/Math.PI,hand||"hold"];}
// the scribe at the desk: the near hand on the pen at tip (in the frame), the far hand resting on the new book's left page
function dm_scribe(ctx,t,tip,o){o=o||{};const x=o.x||640,y=o.y||470,s=o.s||1.0,A=AG_FIG.anchor,toFig=q=>[A[0]+(q[0]-x)/s,A[1]+(q[1]-y)/s];
  const T=toFig(tip),near=dm_reach(AG_FIG.shoulder.near,[T[0]-104,T[1]-30]),far=dm_reach(AG_FIG.shoulder.far,toFig(o.rest||dm_L(dm_page("left"),0.62,0.55)),"rest");
  // he looks from the book he copies (o.look) to his page and back
  const lk=o.look?1:0;return ag_person(ctx,DM_PEOPLE.scribe,x,y,s,{t,pose:{near,far},cut:DM_SCRIBE.board[3][1],nod:lk?0.03:0.18,gaze:lk?[6,1]:[4,6],smile:0.1,
    hold:(c,h)=>dm_quill(c,T[0],T[1],0.95,1/s*1.1)});}
// a quill: a feather from (x, y) the nib, leaning back up and left
function dm_quill(ctx,x,y,ang,s){s=s||1;ctx.save();ctx.translate(x,y);ctx.rotate(ang==null?0.95:ang);ctx.scale(s,s);
  ctx.strokeStyle="rgba(40,36,40,0.9)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-12,-1);ctx.stroke();
  const f=cc=>{cc.moveTo(-10,-1);cc.bezierCurveTo(-60,-24,-150,-30,-220,-16);cc.bezierCurveTo(-166,4,-74,10,-10,2);cc.closePath();};
  ag_soft(ctx,f,[236,230,218],[255,255,255],-60,-14,120,"rgba(80,70,60,0.35)",6);
  ctx.strokeStyle="rgba(120,110,96,0.7)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-10,0);ctx.quadraticCurveTo(-100,-12,-222,-16);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- kept sprites: small things drawn many times */
const dm_sprite=(key,w,h,paint)=>ag_kept("dm:"+key,w,h,paint);
// a book lying on a sloping lectern, seen from the front: its cover, its pages' edge, a chain at its foot (col: the leather)
const DM_LEATHER=[[112,58,46],[92,70,52],[70,78,64],[120,92,60],[84,60,74],[134,84,56],[98,52,50]];
function dm_bookSprite(i){const col=DM_LEATHER[i%DM_LEATHER.length];return dm_sprite("book"+i,44,64,c=>{
  ag_soft(c,cc=>ag_rect(cc,4,4,34,50,4),col,ag_lt(col,0.35),34,10,40,rgba(ag_dk(col,0.7),0.5),8);
  c.fillStyle=rgba(DM.parch,1);c.fillRect(8,52,28,5);c.fillStyle="rgba(120,96,60,0.4)";c.fillRect(8,55,28,2);
  c.strokeStyle=rgba(ag_lt(col,0.3),0.6);c.lineWidth=1.4;for(const y of [16,40])c.strokeRect(9,y,24,1);
  c.fillStyle="rgba(200,180,140,0.9)";c.beginPath();c.arc(21,58,2.6,0,TAU);c.fill();});}

/* ---------------------------------------------------------------- Cambridge's library, in 1424
   Four oak lecterns against a stone wall, the books lying on their slopes and on a shelf below, each chained to a rod: as libraries
   kept their books then. dm_library(ctx, n) shows the first n of the 122. */
const DM_LIB={lect:[[150,0],[570,0],[990,0],[1410,0]],w:380,top:520,shelf:740,per:[[16,15],[16,15],[15,15],[15,15]]};
function dm_ashlar(c,x,y,w,h,seed){const r=ag_rnd(seed||3),bh=86;c.fillStyle=rgba(DM.stone,1);c.fillRect(x,y,w,h);
  for(let row=0;row*bh<h;row++){const yy=y+row*bh;let xx=x-(row%2?70:0);while(xx<x+w){const bw=150+r()*110,tone=0.94+r()*0.1;
      c.fillStyle=rgba(DM.stone.map(v=>Math.min(255,v*tone)),1);c.fillRect(xx+3,yy+3,bw-6,bh-6);xx+=bw;}}
  c.strokeStyle="rgba(120,108,92,0.35)";c.lineWidth=3;for(let row=0;row*bh<h;row++){c.beginPath();c.moveTo(x,y+row*bh);c.lineTo(x+w,y+row*bh);c.stroke();}
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(60,48,34,0.18)");g.addColorStop(0.7,"rgba(60,48,34,0)");g.addColorStop(1,"rgba(255,248,230,0.12)");c.fillStyle=g;c.fillRect(x,y,w,h);}
// a tall pointed window in a stone wall, its leaded panes, its light falling down and left
function dm_lancet(c,x,y,w,h){const r=w*0.62,cx=x+w/2,p=cc=>{cc.moveTo(x,y+h);cc.lineTo(x,y+r);cc.quadraticCurveTo(x,y+r*0.2,cx,y);cc.quadraticCurveTo(x+w,y+r*0.2,x+w,y+r);cc.lineTo(x+w,y+h);cc.closePath();};
  ag_inner(c,cc=>{cc.moveTo(x-26,y+h+20);cc.lineTo(x-26,y+r);cc.quadraticCurveTo(x-26,y+r*0.1,cx,y-30);cc.quadraticCurveTo(x+w+26,y+r*0.1,x+w+26,y+r);cc.lineTo(x+w+26,y+h+20);cc.closePath();},"rgba(40,30,20,0.5)",18,-6,4);
  ag_shape(c,p);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#F2F0EA");g.addColorStop(1,"#FFFDF6");c.fillStyle=g;c.fill();
  c.save();ag_shape(c,p);c.clip();c.strokeStyle="rgba(70,66,64,0.42)";c.lineWidth=2;for(let k=-h;k<w+h;k+=40){c.beginPath();c.moveTo(x+k,y);c.lineTo(x+k+h,y+h);c.stroke();c.beginPath();c.moveTo(x+k,y+h);c.lineTo(x+k+h,y);c.stroke();}
  c.strokeStyle="rgba(58,56,58,0.7)";c.lineWidth=5;c.beginPath();c.moveTo(cx,y);c.lineTo(cx,y+h);c.stroke();c.restore();}
AG_PLACES.dmLibrary=c=>{const F=870;dm_ashlar(c,0,0,W,F,9);
  // two pointed windows high in the wall, their light on the floor
  dm_lancet(c,560,70,150,330);dm_lancet(c,1240,70,150,330);
  c.save();c.globalCompositeOperation="screen";dm_glow(c,1300,330,520,0.28);dm_glow(c,640,330,420,0.18);c.restore();
  // the floor: stone flags
  c.fillStyle=rgba(ag_dk(DM.stone,0.12),1);c.fillRect(0,F,W,H-F);c.strokeStyle="rgba(90,78,62,0.35)";c.lineWidth=2;
  for(let x=-200;x<W+200;x+=220){c.beginPath();c.moveTo(x,F);c.lineTo(x-(x-960)*0.5,H);c.stroke();}for(const y of [920,1000]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  const sh=c.createLinearGradient(0,F,0,H);sh.addColorStop(0,"rgba(40,30,20,0.35)");sh.addColorStop(0.3,"rgba(40,30,20,0)");c.fillStyle=sh;c.fillRect(0,F,W,H-F);
  // the lecterns: a sloping top, a rod under its lower edge, a shelf, two posts and a foot
  for(const [lx] of DM_LIB.lect){const w=DM_LIB.w,T=DM_LIB.top,S=DM_LIB.shelf;
    ag_floorShadow(c,lx+w/2-10,F+30,w*0.6,30,0.35);
    for(const px of [lx+40,lx+w-64])ag_soft(c,cc=>ag_rect(cc,px,T+40,24,F+24-T-40,4),DM.woodDk,DM.wood,px+20,T+200,160,"rgba(20,12,6,0.45)",8);
    ag_soft(c,cc=>ag_rect(cc,lx+10,F+8,w-20,22,6),DM.woodDk,DM.wood,lx+w,F+10,200,"rgba(20,12,6,0.45)",6);
    ag_soft(c,cc=>{cc.moveTo(lx-10,T+78);cc.lineTo(lx+w+10,T+78);cc.lineTo(lx+w-6,T-6);cc.lineTo(lx+6,T-6);cc.closePath();},DM.wood,DM.woodLt,lx+w,T,300,"rgba(30,18,8,0.45)",10);
    ag_soft(c,cc=>ag_rect(cc,lx-14,T+74,w+28,16,4),DM.woodDk,DM.woodLt,lx+w,T+76,240,"rgba(20,12,6,0.4)",4);
    ag_soft(c,cc=>ag_rect(cc,lx,S+60,w,18,4),DM.woodDk,DM.woodLt,lx+w,S+62,240,"rgba(20,12,6,0.4)",4);
    // the iron rods the chains run on
    c.strokeStyle=rgba(DM.iron,0.9);c.lineWidth=5;c.beginPath();c.moveTo(lx-4,T+100);c.lineTo(lx+w+4,T+100);c.moveTo(lx-4,S+88);c.lineTo(lx+w+4,S+88);c.stroke();}};
// where the k-th book sits: [x, y, which row], filling each lectern's slope and then its shelf
function dm_libSlots(){if(dm_libSlots.S)return dm_libSlots.S;const S=[];DM_LIB.lect.forEach(([lx],i)=>{const [a,b]=DM_LIB.per[i];
    for(let k=0;k<a;k++)S.push([lx+4+k*(DM_LIB.w-8)/a,DM_LIB.top-2,0]);for(let k=0;k<b;k++)S.push([lx+6+k*(DM_LIB.w-12)/b,DM_LIB.shelf,1]);});return dm_libSlots.S=S;}
// the books, the first n of them, each landing with a small settle; t and the time each one came (t0 + k * dt)
function dm_library(ctx,n,t,t0,dt){const S=dm_libSlots();for(let k=0;k<Math.min(n,S.length);k++){const [x,y,row]=S[k],u=t==null?1:clamp((t-(t0+k*dt))/0.35,0,1),dy=(1-ag_eo(u))*-18;
    const img=dm_bookSprite(k*5+row);ctx.save();ctx.globalAlpha*=ag_eo(u);ctx.drawImage(img,x,y+dy,22,32+(row?6:0));
    // the chain, from the book's foot to the rod
    ctx.strokeStyle=rgba(DM.iron,0.7);ctx.lineWidth=1.4;ctx.setLineDash([3,2]);ctx.beginPath();ctx.moveTo(x+11,y+dy+30);ctx.quadraticCurveTo(x+14,y+(row?DM_LIB.shelf+80-y:100)*0.7,x+12,row?DM_LIB.shelf+88:DM_LIB.top+100);ctx.stroke();ctx.setLineDash([]);ctx.restore();}}

/* ---------------------------------------------------------------- three copies of one line
   A table from above; three sheets, each copied from the one before: "Two drops each morning" becomes "Ten drops each morning",
   then "Ten drops each evening". The changed word is marked in amber when o.mark is on. */
AG_PLACES.dmTable=c=>{dm_boards(c,0,0,W,H,[150,112,78],{n:9,seed:12});
  const v=c.createRadialGradient(1200,420,100,1100,540,1300);v.addColorStop(0,"rgba(255,244,220,0.18)");v.addColorStop(1,"rgba(30,18,8,0.32)");c.fillStyle=v;c.fillRect(0,0,W,H);};
const DM_COPIES=[{kick:"The book",words:["Two","drops","each","morning"],bad:[]},{kick:"A copy",words:["Ten","drops","each","morning"],bad:[0]},
  {kick:"A copy of the copy",words:["Ten","drops","each","evening"],bad:[0,3]}];
// one sheet: its middle at x, y, turned rot; a: how far it has appeared; mark: the amber marks on its changed words (0..1)
function dm_sheet(ctx,i,x,y,rot,a,mark){if(a<=0)return;const C=DM_COPIES[i],w=560,h=250;ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.translate(x,y+(1-ag_eo(a))*30);ctx.rotate(rot);
  ctx.save();ctx.shadowColor="rgba(30,18,8,0.35)";ctx.shadowBlur=26;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(DM.parch,1);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  ag_soft(ctx,cc=>cc.rect(-w/2,-h/2,w,h),DM.parch,[255,252,240],w*0.3,-h*0.3,w*0.7,"rgba(120,90,40,0.22)",16);
  ag_T(ctx,C.kick.toUpperCase(),-w/2+40,-h/2+62,{w:700,size:28,ls:4,col:AG.kick});
  // the line, word by word, so a changed word can be marked
  let xx=-w/2+40;const yy=34;for(let k=0;k<C.words.length;k++){const wd=C.words[k],ww=ag_tw(ctx,wd,{w:700,size:44}),bad=C.bad.includes(k);
    if(bad&&mark>0){ctx.save();ctx.strokeStyle=rgba(AG.amber,0.9*mark);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(xx-4,yy+16);ctx.lineTo(xx-4+(ww+8)*ag_sine(mark),yy+16);ctx.stroke();ctx.restore();}
    ag_T(ctx,wd,xx,yy,{w:700,size:44,col:bad&&mark>0?mix(DM.ink,AG.amber,mark):DM.ink});xx+=ww+ag_tw(ctx," ",{w:700,size:44});}
  ctx.restore();}

/* ---------------------------------------------------------------- the printing timeline, on a plaster wall */
AG_PLACES.dmWall=c=>{dm_plaster(c,0,0,W,H,DM.plaster,23);c.save();c.globalCompositeOperation="screen";dm_glow(c,1700,300,900,0.2);c.restore();
  const sk=c.createLinearGradient(0,880,0,H);sk.addColorStop(0,"rgba(60,46,32,0)");sk.addColorStop(1,"rgba(60,46,32,0.14)");c.fillStyle=sk;c.fillRect(0,880,W,200);};

/* ---------------------------------------------------------------- Bi Sheng's bench, in the 1040s, from above
   A tray of clay pieces at the left, an iron plate with an iron frame in the middle, warm from a fire under it, paper at the right.
   No character is drawn: the pieces show their tops, plain when clean and dark when inked; the printed page shows soft grey marks in
   columns, read from the right. */
const DM_IRON={tray:[150,250,430,540],plate:[720,230,560,600],frame:[780,290,440,480],paper:[1400,250,400,560],cols:10,rows:10,cell:44};
function dm_pieceSprite(kind){return dm_sprite("piece-"+kind,48,48,c=>{const col=kind==="bronze"?DM.bronze:DM.clay,hi=kind==="bronze"?DM.bronzeLt:DM.clayLt;
  ag_soft(c,cc=>ag_rect(cc,4,4,38,38,6),col,hi,34,10,40,rgba(ag_dk(col,0.6),0.55),8);
  if(kind==="inked")ag_soft(c,cc=>ag_rect(cc,9,9,28,28,4),[52,46,46],[110,104,104],30,14,24,"rgba(0,0,0,0.4)",4);
  else{c.strokeStyle=rgba(ag_dk(col,0.35),0.5);c.lineWidth=1.5;c.strokeRect(10,10,26,26);}});}
AG_PLACES.dmBench=c=>{dm_boards(c,0,0,W,H,[132,98,66],{n:8,seed:31});
  const v=c.createRadialGradient(1100,420,100,960,540,1300);v.addColorStop(0,"rgba(255,240,214,0.16)");v.addColorStop(1,"rgba(30,18,8,0.34)");c.fillStyle=v;c.fillRect(0,0,W,H);
  const [tx,ty,tw,th]=DM_IRON.tray,[px,py,pw,ph]=DM_IRON.plate,[fx,fy,fw,fh]=DM_IRON.frame,[qx,qy,qw,qh]=DM_IRON.paper,n=DM_IRON.cell;
  // the tray: a shallow wooden box with compartments
  ag_floorShadow(c,tx+tw/2-12,ty+th+10,tw*0.6,30,0.35);
  ag_soft(c,cc=>ag_rect(cc,tx,ty,tw,th,10),[110,78,50],[170,130,90],tx+tw,ty,300,"rgba(20,12,6,0.5)",10);
  ag_inner(c,cc=>ag_rect(cc,tx+16,ty+16,tw-32,th-32,6),"rgba(20,12,6,0.6)",14,-4,4);
  c.strokeStyle="rgba(70,48,28,0.8)";c.lineWidth=3;for(let i=1;i<9;i++){c.beginPath();c.moveTo(tx+16+i*(tw-32)/9,ty+16);c.lineTo(tx+16+i*(tw-32)/9,ty+th-16);c.stroke();}
  for(let j=1;j<11;j++){c.beginPath();c.moveTo(tx+16,ty+16+j*(th-32)/11);c.lineTo(tx+tw-16,ty+16+j*(th-32)/11);c.stroke();}
  // the iron plate, warm at its edges from the fire under it, and the iron frame on it
  ag_floorShadow(c,px+pw/2-14,py+ph+14,pw*0.62,36,0.4);
  c.save();c.globalCompositeOperation="screen";dm_glow(c,px+pw/2,py+ph/2,pw*0.75,0.22,[255,150,70]);c.restore();
  ag_soft(c,cc=>ag_rect(cc,px,py,pw,ph,12),DM.iron,DM.ironLt,px+pw,py,520,"rgba(0,0,0,0.5)",16);
  ag_soft(c,cc=>{ag_rect(cc,fx-16,fy-16,fw+32,fh+32,6);ag_rect(cc,fx,fy,fw,fh,2);},[88,90,96],[160,162,168],fx+fw,fy,400,"rgba(0,0,0,0.5)",8);
  c.save();ag_shape(c,cc=>{ag_rect(cc,fx-16,fy-16,fw+32,fh+32,6);});c.clip();c.fillStyle="rgba(0,0,0,0)";c.restore();
  // a dark paste on the plate inside the frame: resin, wax and paper ash, to hold the pieces
  c.fillStyle="rgba(46,40,36,0.85)";c.fillRect(fx,fy,fw,fh);
  // paper at the right, a few sheets
  for(let k=2;k>=0;k--)ag_soft(c,cc=>ag_rect(cc,qx+k*8,qy+k*8,qw,qh,3),DM.paper,[255,255,250],qx+qw,qy,420,"rgba(80,66,40,0.22)",12);};
// where piece k sits: in the tray (its compartment) and in the frame (column by column from the right, top to bottom)
function dm_ironSlot(k){const [tx,ty,tw,th]=DM_IRON.tray,[fx,fy]=DM_IRON.frame,n=DM_IRON.cell,c=Math.floor(k/DM_IRON.rows),r=k%DM_IRON.rows;
  const ti=k%9,tj=Math.floor(k/9)%11,tray=[tx+16+(ti+0.5)*(tw-32)/9,ty+16+(tj+0.5)*(th-32)/11];
  return{tray,frame:[fx+(DM_IRON.cols-1-c+0.5)*n,fy+(r+0.5)*(48)]};}
// the pieces: made (0..1, appearing in the tray), set (0..1, flying into the frame), inked (0..1), back (0..1, flying home)
function dm_ironPieces(ctx,made,set,inked,back){const N=DM_IRON.cols*DM_IRON.rows;for(let k=0;k<N;k++){const s=dm_ironSlot(k),f=k/N;
    const m=clamp((made-f*0.92)/0.08,0,1);if(m<=0)continue;const u=ag_sine(clamp(set*1.6-f*0.6,0,1)),b=ag_sine(clamp(back*1.6-(1-f)*0.6,0,1)),g=u*(1-b);
    let x=lerp(s.tray[0],s.frame[0],g),y=lerp(s.tray[1],s.frame[1],g);const lift=Math.sin(Math.PI*(u<1?u:b))*30*(u>0&&u<1||b>0&&b<1?1:0);
    const img=dm_pieceSprite(inked>0&&g>0.98?"inked":"clay"),z=1+lift/120;ctx.save();ctx.globalAlpha*=ag_eo(m);
    if(lift>0){ctx.fillStyle="rgba(20,12,6,0.18)";ctx.fillRect(x-17+lift*0.2,y-15+lift*0.4,34,34);}
    ctx.drawImage(img,x-22*z,y-22*z-lift*0.3,44*z,44*z);if(inked>0&&inked<1&&g>0.98){ctx.globalAlpha*=inked;ctx.drawImage(dm_pieceSprite("inked"),x-22,y-22,44,44);}ctx.restore();}}
// a printed sheet: soft grey marks in columns, from the right, inside a ruled border; p (0..1) how much has come through
function dm_printed(ctx,x,y,w,h,p,o){o=o||{};if(p<=0)return;const cols=o.cols||10,rows=o.rows||10,seed=o.seed||8,key="printed:"+[Math.round(w),Math.round(h),cols,rows,seed].join(":");
  // the page's marks are painted once, softly, and kept: grey shapes in columns read from the right, never characters
  const img=ag_kept(key,Math.ceil(w)+8,Math.ceil(h)+8,c=>{const r=ag_rnd(seed),cw=w/cols,ch=h/rows;c.translate(4,4);
    c.strokeStyle="rgba(60,56,56,0.45)";c.lineWidth=2;c.strokeRect(0,0,w,h);
    for(let k=0;k<cols;k++){const cx=w-(k+0.5)*cw;if(k>0){c.strokeStyle="rgba(60,56,56,0.2)";c.lineWidth=1;c.beginPath();c.moveTo(w-k*cw,0);c.lineTo(w-k*cw,h);c.stroke();}
      c.save();c.filter="blur("+Math.max(0.8,cw*0.06)+"px)";for(let j=0;j<rows;j++){if(r()<0.07)continue;const v=r(),sz=cw*(0.44+r()*0.08);c.fillStyle=rgba([48,44,46],0.42+v*0.3);
        rr(c,cx-sz/2,(j+0.5)*ch-sz/2,sz,sz*(0.86+r()*0.16),sz*0.22);c.fill();}c.restore();}});
  ctx.save();ctx.globalAlpha*=clamp(p,0,1);ctx.drawImage(img,x-4,y-4);ctx.restore();}

/* ---------------------------------------------------------------- Korea, 1377: a book printed with metal pieces, on a cloth */
AG_PLACES.dmCloth=c=>{c.fillStyle="#D9CFBD";c.fillRect(0,0,W,H);const r=ag_rnd(51);
  // the weave: fine crossing threads, lighter where the light falls
  c.strokeStyle="rgba(120,104,80,0.08)";c.lineWidth=1;for(let x=0;x<W;x+=5){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=0;y<H;y+=5){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  for(let i=0;i<14;i++){const y=r()*H;c.strokeStyle="rgba(120,104,80,0.1)";c.lineWidth=2+r()*3;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(600,y+(r()-0.5)*60,1300,y+(r()-0.5)*60,W,y+(r()-0.5)*40);c.stroke();}
  const v=c.createRadialGradient(1150,420,100,960,540,1250);v.addColorStop(0,"rgba(255,248,232,0.26)");v.addColorStop(1,"rgba(40,30,18,0.34)");c.fillStyle=v;c.fillRect(0,0,W,H);};
// a book bound with thread through five holes on its right edge, closed (open 0) or open on two pages (open 1); its middle at x, y
function dm_threadBook(ctx,x,y,open,o){o=o||{};const w=420,h=600,cov=[176,148,104];ctx.save();
  ag_floorShadow(ctx,x-20,y+h/2+6,w*(0.7+0.6*open),30,0.35);
  if(open<1){const k=1-ag_sine(open);ctx.save();ctx.globalAlpha*=k;ag_soft(ctx,cc=>ag_rect(cc,x-w/2,y-h/2,w,h,6),cov,ag_lt(cov,0.3),x+w/2,y-h/2,500,"rgba(60,40,20,0.4)",14);
    // the title slip, plain, and the five stitches on the right
    ag_soft(ctx,cc=>ag_rect(cc,x-w/2+40,y-h/2+40,70,300,3),[236,228,210],[255,252,244],x,y-h/2,200,"rgba(80,60,30,0.2)",6);
    ctx.strokeStyle="rgba(250,246,236,0.9)";ctx.lineWidth=4;for(let i=0;i<5;i++){const sy=y-h/2+60+i*(h-120)/4;ctx.beginPath();ctx.moveTo(x+w/2-34,sy);ctx.lineTo(x+w/2,sy);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(x+w/2-34,y-h/2+60);ctx.lineTo(x+w/2-34,y+h/2-60);ctx.stroke();ctx.restore();}
  if(open>0){const k=ag_sine(open);ctx.save();ctx.globalAlpha*=k;for(const sd of [-1,1]){const px=sd<0?x-w:x;
      ag_soft(ctx,cc=>ag_rect(cc,px,y-h/2,w,h,4),[244,236,216],[255,252,244],px+w,y-h/2,500,"rgba(90,70,40,0.25)",14);
      dm_printed(ctx,px+46,y-h/2+60,w-92,h-120,1,{cols:8,rows:12,seed:sd<0?61:62});}
    const g=ctx.createLinearGradient(x-30,0,x+30,0);g.addColorStop(0,"rgba(90,70,40,0)");g.addColorStop(0.5,"rgba(90,70,40,0.28)");g.addColorStop(1,"rgba(90,70,40,0)");ctx.fillStyle=g;ctx.fillRect(x-30,y-h/2,60,h);ctx.restore();}
  ctx.restore();}
// metal pieces in a small tray, seen from above, bronze, catching the light
function dm_bronzeTray(ctx,x,y,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+150,y+250,190,24,0.35);
  ag_soft(ctx,cc=>ag_rect(cc,x,y,300,240,10),[96,70,44],[150,112,72],x+300,y,260,"rgba(20,12,6,0.5)",10);ag_inner(ctx,cc=>ag_rect(cc,x+14,y+14,272,212,6),"rgba(20,12,6,0.6)",12,-3,3);
  for(let i=0;i<6;i++)for(let j=0;j<5;j++){if((i*7+j*3)%11===4)continue;ctx.drawImage(dm_pieceSprite("bronze"),x+22+i*44,y+22+j*40,40,40);}ctx.restore();}

/* ---------------------------------------------------------------- Mainz, around 1450: the workshop
   A timber-framed room: a wooden screw press in the middle, sheets drying on a line under the beams, a case of letters at the left,
   paper on a bench. Gutenberg stands at the press; Johann Fust comes in from the right. */
const DM_PRESS={x:760,w:420,head:150,bed:600};
function dm_timber(c,x,y,w,h,col){ag_soft(c,cc=>cc.rect(x,y,w,h),col||DM.woodDk,DM.wood,x+w,y,Math.max(w,h),"rgba(20,12,6,0.45)",8);}
AG_PLACES.dmMainz=c=>{const F=800;dm_plaster(c,0,0,W,F,[226,214,192],37);
  // the timber frame: posts, a rail, braces
  dm_timber(c,0,0,W,40);dm_timber(c,0,330,W,30);for(const x of [0,420,860,1500,1880])dm_timber(c,x,0,40,F);
  for(const [x0,y0,x1,y1] of [[460,360,860,780],[1540,360,1880,760]]){ag_soft(c,cc=>{cc.moveTo(x0,y0);cc.lineTo(x0+44,y0);cc.lineTo(x1,y1);cc.lineTo(x1-44,y1);cc.closePath();},DM.woodDk,DM.wood,x1,y0,400,"rgba(20,12,6,0.45)",8);}
  // a small leaded window high on the right, its light
  c.save();dm_window(c,1610,120,190,180,{pane:30});c.restore();c.save();c.globalCompositeOperation="screen";dm_glow(c,1600,520,700,0.26);c.restore();
  // the floor
  dm_boards(c,0,F,W,H-F,[150,116,82],{n:6,seed:8});const sh=c.createLinearGradient(0,F,0,H);sh.addColorStop(0,"rgba(40,26,14,0.35)");sh.addColorStop(0.25,"rgba(40,26,14,0)");c.fillStyle=sh;c.fillRect(0,F,W,H-F);
  // printed sheets drying on a line under the beams
  c.strokeStyle="rgba(70,60,50,0.6)";c.lineWidth=2;c.beginPath();c.moveTo(40,92);c.quadraticCurveTo(960,128,1880,92);c.stroke();
  for(let i=0;i<9;i++){const x=120+i*190,y=96+Math.sin((x/1920)*Math.PI)*28;ag_soft(c,cc=>{cc.moveTo(x,y);cc.lineTo(x+120,y);cc.lineTo(x+118,y+150);cc.lineTo(x+2,y+150);cc.closePath();},DM.paper,[255,255,250],x+120,y,200,"rgba(90,70,40,0.25)",10);
    c.fillStyle="rgba(60,56,56,0.35)";for(const cx of [x+14,x+64])for(let r=0;r<14;r++)c.fillRect(cx,y+16+r*9,44,3);
    c.fillStyle="rgba(150,54,40,0.7)";c.fillRect(x+14,y+16,10,10);}
  // the case of letters at the left: a slanted tray of small boxes on a stand
  ag_soft(c,cc=>ag_rect(cc,110,560,24,F+20-560,4),DM.woodDk,DM.wood,130,620,100,"rgba(20,12,6,0.45)",6);ag_soft(c,cc=>ag_rect(cc,370,560,24,F+20-560,4),DM.woodDk,DM.wood,390,620,100,"rgba(20,12,6,0.45)",6);
  ag_soft(c,cc=>{cc.moveTo(80,580);cc.lineTo(420,580);cc.lineTo(400,430);cc.lineTo(100,430);cc.closePath();},DM.wood,DM.woodLt,400,440,300,"rgba(20,12,6,0.45)",10);
  c.strokeStyle="rgba(50,34,20,0.7)";c.lineWidth=2;for(let i=0;i<=8;i++){const u=i/8;c.beginPath();c.moveTo(lerp(100,400,u),436);c.lineTo(lerp(84,416,u),576);c.stroke();}
  for(let j=1;j<5;j++){const v=j/5,y=lerp(436,576,v);c.beginPath();c.moveTo(lerp(100,84,v),y);c.lineTo(lerp(400,416,v),y);c.stroke();}
  // a bench with paper at the right
  ag_soft(c,cc=>ag_rect(cc,1560,640,300,26,4),DM.woodDk,DM.woodLt,1860,640,300,"rgba(20,12,6,0.45)",6);for(const x of [1580,1820])ag_soft(c,cc=>ag_rect(cc,x,666,20,F+20-666,3),DM.woodDk,DM.wood,x+20,700,80,"rgba(20,12,6,0.4)",4);
  for(let k=0;k<6;k++)ag_soft(c,cc=>ag_rect(cc,1590+k*2,626-k*5,240,8,1),DM.paper,[255,255,250],1830,600,200,"rgba(90,70,40,0.2)",3);
  // the press: two cheeks, a head, the screw, the platen, the bed on its rails
  const {x,w,head,bed}=DM_PRESS;ag_floorShadow(c,x+w/2-20,F+50,w*0.9,40,0.4);
  for(const px of [x,x+w-70])ag_soft(c,cc=>ag_rect(cc,px,head-40,70,F+40-head+40,6),DM.woodDk,DM.wood,px+70,head+120,300,"rgba(20,12,6,0.5)",12);
  ag_soft(c,cc=>ag_rect(cc,x-30,head-10,w+60,80,8),DM.woodDk,DM.woodLt,x+w,head,400,"rgba(20,12,6,0.5)",12);
  ag_soft(c,cc=>ag_rect(cc,x+50,head+250,w-100,40,6),DM.woodDk,DM.woodLt,x+w,head+250,300,"rgba(20,12,6,0.5)",8);
  // the screw: a thick wooden spindle with its thread
  const sx=x+w/2;ag_soft(c,cc=>ag_rect(cc,sx-30,head+70,60,180,8),DM.wood,DM.woodLt,sx+30,head+80,120,"rgba(20,12,6,0.5)",8);
  c.strokeStyle="rgba(40,26,14,0.55)";c.lineWidth=4;for(let k=0;k<7;k++){const y=head+84+k*24;c.beginPath();c.moveTo(sx-30,y+10);c.quadraticCurveTo(sx,y-4,sx+30,y-10);c.stroke();}
  // the platen, and the bed under it, running out to the front on its rails
  ag_soft(c,cc=>ag_rect(cc,sx-120,head+300,240,40,4),DM.woodDk,DM.woodLt,sx+120,head+300,200,"rgba(20,12,6,0.5)",6);
  ag_soft(c,cc=>ag_rect(cc,x-120,bed,w+240,34,6),DM.woodDk,DM.woodLt,x+w+120,bed,400,"rgba(20,12,6,0.5)",8);
  ag_soft(c,cc=>ag_rect(cc,x-110,bed-14,w+60,16,3),[80,82,88],[150,150,156],x+w,bed-14,300,"rgba(0,0,0,0.4)",4);
  for(const px of [x-100,x+w+80])ag_soft(c,cc=>ag_rect(cc,px,bed+34,24,F+30-bed-34,4),DM.woodDk,DM.wood,px+24,bed+60,80,"rgba(20,12,6,0.45)",4);};
// the bar Gutenberg pulls: from the screw out to the left, swinging a little as it turns (pull 0..1)
function dm_pressBar(ctx,pull){const {x,w,head}=DM_PRESS,sx=x+w/2,y=head+170,len=lerp(250,190,ag_sine(pull));
  ag_soft(ctx,cc=>{cc.moveTo(sx,y-10);cc.lineTo(sx-len,y-14+pull*6);cc.lineTo(sx-len,y+2+pull*6);cc.lineTo(sx,y+12);cc.closePath();},[60,62,66],[150,150,156],sx-len,y-14,200,"rgba(0,0,0,0.4)",4);
  ag_soft(ctx,cc=>ag_rect(cc,sx-len-46,y-18+pull*6,56,26,12),DM.wood,DM.woodLt,sx-len,y-18,60,"rgba(20,12,6,0.4)",4);return[sx-len-24,y-4+pull*6];}
// a printed page of the 1450s: two columns of even lines, a red mark at the head; at x, y, w wide; a: how far it has come
function dm_page42(ctx,x,y,w,a,o){o=o||{};if(a<=0)return;const h=w*1.42;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(30,18,8,0.3)";ctx.shadowBlur=18;ctx.shadowOffsetX=-6;ctx.shadowOffsetY=8;ctx.fillStyle=rgba(DM.paper,1);ctx.fillRect(x,y,w,h);ctx.restore();
  const cw=w*0.36,g=w*0.06,lx=x+w*0.1,n=o.lines||28,lh=h*0.78/n;ctx.fillStyle="rgba(40,36,38,0.7)";
  for(const cx of [lx,lx+cw+g])for(let i=0;i<n;i++){const ww=i===n-1?cw*0.6:cw;ctx.fillRect(cx,y+h*0.1+i*lh,ww,Math.max(1.4,lh*0.42));}
  ctx.fillStyle="rgba(168,52,40,0.85)";ctx.fillRect(lx,y+h*0.1,cw*0.16,lh*3.2);ctx.restore();}
// the pieces Gutenberg brought together, as cards: icon, title, sub; k springs it in
function dm_piece(ctx,x,y,w,icon,title,sub,a,k){if(a<=0)return;const h=232;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,k==null?1:k));
  ag_box(ctx,x,y,w,h,20,{});ctx.save();ctx.translate(x+w/2,y+70);dm_icon(ctx,icon);ctx.restore();
  ag_T(ctx,title,x+w/2,y+156,{w:700,size:32,align:"center"});if(sub)ag_T(ctx,sub,x+w/2,y+196,{w:500,size:28,align:"center",col:AG.mut});ctx.restore();}
// the pieces' small pictures, about 120 x 90, centred on the origin
function dm_icon(ctx,kind){if(typeof DM_ICONS!=="undefined"&&DM_ICONS[kind])return DM_ICONS[kind](ctx);
  if(kind==="sorts"){for(const dx of [-44,0,44]){ag_soft(ctx,cc=>ag_rect(cc,dx-16,-40,32,76,3),[120,118,112],[200,198,190],dx+16,-40,60,"rgba(0,0,0,0.4)",4);
      ag_soft(ctx,cc=>ag_rect(cc,dx-14,-44,28,12,2),[96,94,90],[170,168,160],dx+14,-44,30,null);ctx.save();ctx.translate(dx,-26);ctx.scale(-1,1);ag_T(ctx,"a",0,8,{w:800,size:28,align:"center",col:[40,38,40],deco:1});ctx.restore();}}
  else if(kind==="ink"){ag_soft(ctx,cc=>ag_rect(cc,-8,-46,16,46,4),DM.wood,DM.woodLt,8,-46,40,"rgba(20,12,6,0.4)",3);
    ag_soft(ctx,cc=>{cc.ellipse(0,10,52,30,0,0,TAU);},[120,84,56],[190,150,110],20,0,60,"rgba(20,12,6,0.45)",8);
    ag_soft(ctx,cc=>{cc.ellipse(0,30,46,12,0,0,TAU);},[34,30,32],[110,104,110],14,26,40,null);}
  else if(kind==="press"){for(const px of [-50,34])ag_soft(ctx,cc=>ag_rect(cc,px,-46,16,92,3),DM.woodDk,DM.wood,px+16,-40,40,"rgba(20,12,6,0.4)",3);
    ag_soft(ctx,cc=>ag_rect(cc,-60,-50,120,16,3),DM.woodDk,DM.woodLt,60,-50,80,"rgba(20,12,6,0.4)",3);ag_soft(ctx,cc=>ag_rect(cc,-8,-34,16,34,3),DM.wood,DM.woodLt,8,-34,30,null);
    ag_soft(ctx,cc=>ag_rect(cc,-30,0,60,10,2),DM.woodDk,DM.woodLt,30,0,40,null);ag_soft(ctx,cc=>ag_rect(cc,-62,22,124,10,2),DM.woodDk,DM.woodLt,62,22,60,null);
    ctx.strokeStyle="rgba(60,62,66,0.9)";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,-20);ctx.lineTo(-64,-14);ctx.stroke();}
  else if(kind==="paper"){for(let k=3;k>=0;k--)ag_soft(ctx,cc=>ag_rect(cc,-46+k*6,-44+k*5,80,96,2),DM.paper,[255,255,250],40,-44,120,"rgba(90,70,40,0.25)",6);}
  else if(kind==="purse"){ag_soft(ctx,cc=>{cc.moveTo(-30,-30);cc.bezierCurveTo(-60,-6,-56,40,0,44);cc.bezierCurveTo(56,40,60,-6,30,-30);cc.closePath();},[118,74,48],[190,140,100],30,-20,70,"rgba(30,16,8,0.5)",8);
    ctx.strokeStyle="rgba(70,40,24,0.9)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-32,-28);ctx.quadraticCurveTo(0,-20,32,-28);ctx.stroke();
    for(const [cx,cy] of [[46,30],[62,20],[54,40]]){ag_soft(ctx,cc=>{cc.ellipse(cx,cy,14,9,0,0,TAU);},[196,160,70],[250,226,150],cx+6,cy-4,16,"rgba(80,60,10,0.4)",3);}}}

/* ---------------------------------------------------------------- the printing timeline on the plaster wall
   The film's oak rail, here for printing: China in the 1040s, Korea in 1377, Mainz around 1450, four hundred years apart. Under each
   tab, what it brought; a bracket under them all says how long it took. */
const DM_PRINT={y:360,ppy:2.6,focus:1245,years:[[1040,"1040s","China","clay pieces"],[1377,"1377","Korea","metal pieces"],[1450,"1450","Mainz","the press"]]};
// lit: per tab (0..1); a: how far each tab's words have come; span: the bracket (0..1)
function dm_printRail(ctx,o){o=o||{};const R=DM_PRINT,lit=o.lit||[1,1,1],a=o.a||[1,1,1];
  const X=dm_rail(ctx,{y:R.y,ppy:R.ppy,focus:o.focus||R.focus,draw:o.draw,a:o.railA,years:R.years.map((v,i)=>({y:v[0],label:v[1],lit:lit[i],a:a[i]}))});
  R.years.forEach((v,i)=>{if(a[i]<=0)return;const x=X(v[0]);ag_T(ctx,v[2],x,R.y+150,{w:700,size:34,align:"center",a:a[i]});ag_T(ctx,v[3],x,R.y+192,{w:500,size:28,align:"center",col:AG.mut,a:a[i]});});
  if(o.span>0){const x0=X(1040),x1=X(1450),y=R.y+260,u=ag_sine(o.span),xm=(x0+x1)/2;ctx.save();ctx.strokeStyle=rgba(AG.ink,0.55);ctx.lineWidth=3;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(xm-(xm-x0)*u,y-14);ctx.lineTo(xm-(xm-x0)*u,y);ctx.lineTo(xm+(x1-xm)*u,y);ctx.lineTo(xm+(x1-xm)*u,y-14);ctx.stroke();ctx.restore();
    ag_pill(ctx,xm,y+4,o.spanText||"About 400 years",{a:clamp(o.span*2-1,0,1)});}
  return X;}

/* ===== Decades in the making: Europe by 1500 =====
   The land of Europe as a pale relief, no borders, and the towns where presses had printed books by 1500, each lighting in its year.
   The outline is Natural Earth's 1:50m land (public domain), from the world-atlas package, projected for this frame (longitudes
   -16 to 44, latitudes 34.5 to 61.5, x scaled by cos 48°) and simplified to within 1.6 px; NOTICE.md credits it.
   The towns are a sample of the more than two hundred, with the year of each one's first dated book in the Incunabula Short Title
   Catalogue (rounded where the sources differ by a year); the counts on screen are the sources' totals, not the dots. */
const DM_LAND=[[1191,115,1200,116,1210,122,1204,123,1194,131,1184,131,1178,141,1174,143,1179,134,1171,129,1174,125,1170,120,1181,120,1183,117],[1224,1039,1232,1036,1233,1039,1231,1040,1234,1041,1236,1045,1247,1043,1267,1048,1274,1046,1276,1055,1290,1047,1288,1058,1249,1063,1247,1056,1240,1054,1217,1050,1216,1039,1219,1039,1221,1034],[1212,902,1215,907,1231,914,1235,931,1243,935,1242,941,1233,935,1229,924,1218,922,1217,918,1205,906,1198,906,1208,899],[1508,1036,1494,1048,1493,1052,1497,1060,1487,1061,1480,1070,1470,1073,1469,1077,1465,1074,1454,1071,1450,1057,1452,1058,1459,1053,1465,1053,1467,1044,1485,1046,1506,1035,1510,1034],[1096,147,1089,152,1088,161,1091,164,1080,173,1076,181,1071,183,1075,177,1070,169,1071,158,1081,147,1089,147,1091,143],[922,229,921,234,915,237,912,241,917,245,918,249,909,252,908,267,903,269,897,253,887,252,884,247,883,236,879,231,888,230,892,222,896,222,898,231,902,232,905,224,903,221,912,215,922,217],[870,236,875,247,874,255,865,258,853,253,849,239,861,236,867,238],[669,868,678,870,678,872,672,885,668,888,660,885,658,878,652,881,649,877,663,864,671,862],[843,825,848,840,843,849,845,859,841,893,828,890,825,901,823,903,817,903,811,892,810,881,814,866,810,863,812,848,804,834,805,825,805,823,812,827,818,824,832,810,843,819,841,823],[839,748,841,774,831,805,821,796,823,792,819,790,819,783,816,783,818,776,815,774,817,769,815,766,821,756,830,751,835,751,836,739,839,741],[1002,931,993,949,989,962,995,978,990,986,990,992,973,988,964,976,957,976,938,961,924,956,918,947,921,938,926,933,931,939,938,932,943,933,954,941,974,938,981,933,990,934,1000,928,1004,929],[502,119,499,127,478,142,477,146,482,147,475,157,494,152,530,152,535,156,538,161,516,198,497,205,508,204,514,207,514,210,495,219,484,216,489,219,504,222,516,219,528,224,541,237,552,272,567,280,583,295,580,299,588,316,578,311,568,311,577,312,593,327,595,334,586,344,593,348,600,341,614,342,630,350,632,361,628,375,623,380,618,381,619,386,617,388,611,388,605,391,609,392,609,397,597,401,599,401,609,406,623,405,623,413,613,418,611,423,606,423,591,429,580,427,564,429,547,424,550,427,545,430,531,431,533,435,531,436,520,436,505,431,494,435,487,450,484,451,473,444,459,448,448,458,440,456,435,458,434,455,442,450,454,439,463,429,464,421,470,419,473,412,501,412,520,390,497,404,490,403,481,396,472,397,476,394,468,390,462,391,454,395,447,390,444,385,447,382,472,369,479,358,476,356,475,343,460,348,471,334,483,328,494,326,502,330,501,324,503,323,507,328,512,328,507,326,503,319,507,311,504,309,504,304,508,302,509,295,509,293,501,295,490,281,493,269,498,264,504,262,490,262,479,269,471,266,464,270,456,266,454,272,451,270,447,261,450,260,460,240,454,232,455,225,457,222,463,222,456,218,457,214,445,225,446,217,449,212,441,220,441,227,437,244,432,247,433,235,438,228,435,227,435,218,446,190,434,199,428,198,425,192,421,192,432,186,428,184,436,176,436,171,430,163,436,158,432,153,435,145,447,145,440,137,442,130,451,129,449,125,451,117,457,117,459,120,465,117,467,119,498,114,504,115],[393,258,397,257,399,253,421,251,432,267,428,274,436,273,439,280,438,282,433,278,434,285,437,285,435,289,429,291,424,298,419,296,420,299,415,301,421,317,424,343,419,358,412,366,416,370,401,374,399,370,398,373,384,376,381,380,370,387,360,384,362,390,349,397,322,401,330,393,314,396,328,385,315,389,309,388,308,385,320,375,307,375,308,372,314,369,324,370,320,364,327,358,350,353,345,350,340,355,329,354,320,357,331,349,336,336,346,332,331,330,328,327,321,326,323,324,315,324,314,318,325,316,320,314,320,311,329,308,329,305,320,305,322,296,319,297,318,293,315,294,315,291,318,289,329,288,336,288,340,292,344,289,357,290,354,286,365,280,368,274,359,276,351,273,361,264,361,259,364,254,378,253,377,250,380,250,383,255,380,261,385,258,384,250,390,248,390,245,399,250,393,254],[1950,-30,1950,1110,389,1110,401,1101,404,1095,415,1069,427,1029,441,1023,444,1024,442,1030,449,1041,461,1052,469,1054,486,1049,494,1052,499,1050,506,1044,509,1055,534,1056,549,1045,561,1033,574,1026,584,1027,594,1014,619,999,655,996,665,989,679,988,686,984,713,984,727,994,748,985,759,977,761,980,771,983,779,981,778,976,784,978,797,986,821,980,830,972,845,966,849,968,848,975,850,970,858,972,861,989,864,991,878,978,881,977,883,985,866,1010,869,1025,880,1035,883,1050,871,1073,855,1092,854,1098,860,1110,1534,1110,1539,1090,1548,1078,1546,1062,1547,1051,1543,1037,1548,1020,1544,1008,1554,994,1554,988,1550,984,1536,996,1533,997,1514,987,1487,1013,1463,1019,1452,1013,1442,999,1421,987,1406,985,1400,1009,1394,1008,1380,1014,1367,1007,1361,991,1357,993,1343,987,1338,994,1335,995,1337,990,1322,993,1320,990,1335,987,1341,979,1315,981,1316,975,1322,973,1322,970,1314,964,1310,954,1314,951,1314,941,1305,938,1299,932,1297,934,1289,929,1292,925,1291,918,1293,914,1297,918,1299,927,1301,923,1304,925,1312,922,1305,921,1302,912,1308,905,1303,902,1304,895,1299,888,1305,878,1284,881,1286,860,1290,859,1301,844,1316,842,1321,847,1327,847,1331,845,1328,841,1331,839,1334,840,1334,845,1362,844,1363,843,1356,839,1360,835,1384,830,1371,828,1365,823,1363,820,1365,811,1386,814,1398,812,1410,817,1422,816,1427,807,1450,791,1479,779,1515,782,1522,777,1526,779,1525,784,1530,791,1537,795,1547,791,1550,793,1554,803,1560,809,1570,805,1577,813,1613,823,1641,816,1651,821,1663,822,1694,803,1703,787,1694,750,1652,721,1622,688,1607,683,1598,672,1589,672,1581,661,1566,654,1574,648,1568,645,1572,643,1581,649,1593,645,1592,637,1601,620,1603,618,1604,623,1607,616,1616,616,1604,604,1600,604,1596,595,1602,595,1609,592,1616,593,1614,587,1636,578,1634,569,1630,569,1627,573,1620,574,1617,574,1623,570,1618,570,1607,577,1590,577,1585,583,1577,585,1570,591,1564,589,1556,594,1544,595,1524,616,1530,609,1528,602,1524,609,1518,612,1518,621,1523,632,1534,647,1544,644,1549,645,1553,642,1564,644,1559,657,1545,660,1540,656,1535,656,1524,668,1514,668,1508,671,1503,678,1493,685,1486,683,1481,678,1485,664,1483,656,1479,653,1474,652,1466,646,1458,647,1455,644,1486,622,1484,616,1480,618,1474,613,1455,617,1437,609,1436,607,1442,605,1442,603,1430,598,1451,601,1457,595,1451,597,1443,594,1440,581,1435,571,1439,583,1438,594,1429,593,1430,589,1426,595,1410,598,1406,609,1394,625,1378,631,1381,646,1376,666,1363,670,1364,661,1360,661,1356,677,1358,677,1352,688,1350,720,1347,724,1338,724,1333,733,1332,750,1321,761,1327,766,1334,778,1334,786,1340,798,1363,811,1360,820,1356,821,1339,817,1333,820,1321,821,1315,833,1302,840,1287,857,1288,847,1302,835,1284,836,1282,829,1277,826,1257,820,1249,826,1240,822,1230,831,1221,830,1224,843,1233,847,1237,854,1225,846,1220,847,1227,855,1226,861,1219,851,1212,849,1213,857,1219,862,1211,860,1209,851,1198,844,1199,836,1191,840,1190,859,1210,893,1205,896,1205,890,1199,888,1197,890,1198,893,1200,899,1203,898,1196,904,1189,905,1208,914,1219,926,1227,929,1229,949,1227,953,1215,939,1202,944,1206,955,1211,957,1214,961,1205,967,1199,959,1195,957,1194,958,1205,1002,1193,988,1190,989,1187,1002,1184,999,1184,992,1176,979,1173,980,1171,990,1167,985,1163,977,1165,965,1151,944,1158,932,1165,933,1169,927,1197,941,1199,942,1198,938,1206,935,1185,922,1183,926,1173,923,1160,927,1156,920,1155,925,1150,925,1147,914,1141,905,1144,902,1150,904,1151,899,1142,900,1129,887,1117,858,1107,852,1102,844,1106,844,1103,833,1106,823,1106,803,1109,788,1099,782,1091,770,1084,765,1084,762,1081,763,1062,748,1041,739,1046,739,1060,746,1038,724,1024,718,1013,719,1012,714,992,693,990,690,999,689,986,676,983,657,975,648,968,646,959,667,956,666,950,656,947,641,954,635,950,629,946,632,939,629,934,635,920,642,918,641,920,638,914,642,912,650,920,661,917,668,914,667,913,671,917,691,925,700,948,717,960,752,975,770,991,783,1018,784,1018,790,1011,795,1011,800,1043,818,1066,834,1079,851,1076,867,1069,863,1063,849,1053,847,1047,844,1045,840,1038,842,1031,855,1028,870,1030,874,1036,877,1043,885,1045,900,1043,903,1039,902,1030,908,1028,924,1021,930,1015,942,1006,942,1004,939,1004,933,1009,928,1011,921,1010,915,1013,912,1019,910,1019,902,1005,860,1002,858,995,857,985,850,985,841,980,833,969,836,972,831,968,828,961,828,953,811,934,809,923,801,901,777,897,768,888,763,883,764,884,759,872,743,867,741,867,732,858,702,834,687,820,683,814,686,800,705,780,712,765,725,761,732,749,737,730,731,728,726,721,725,721,722,711,725,698,721,694,716,673,732,667,746,668,756,674,768,670,770,672,782,641,808,613,818,604,827,609,831,601,835,577,879,580,898,591,910,571,927,563,949,566,955,550,958,541,965,529,989,527,990,520,987,511,991,501,990,493,992,483,990,468,991,460,1000,447,1003,442,1015,440,1014,439,1017,435,1019,424,1012,417,996,414,995,414,991,419,983,414,987,401,972,402,969,399,972,385,973,376,980,355,975,344,979,349,963,348,922,353,923,350,919,339,922,338,914,344,910,346,900,350,897,346,899,341,910,335,912,332,908,334,886,340,878,349,855,348,850,353,830,351,792,347,789,350,782,348,782,347,776,353,769,349,769,352,764,349,754,343,756,346,748,338,741,340,733,348,727,357,727,364,722,364,717,379,709,396,718,429,714,464,723,489,719,504,725,508,722,523,727,532,726,542,723,546,717,552,678,556,672,554,669,552,673,556,639,563,645,567,656,571,660,564,641,553,631,553,629,558,630,555,608,537,599,529,585,531,578,526,573,529,569,539,571,532,568,518,568,520,561,511,559,511,555,503,555,501,552,481,546,470,547,467,541,460,538,469,533,463,528,472,528,468,525,459,525,459,518,499,506,505,508,513,518,520,514,530,514,532,517,534,512,536,515,548,514,543,508,543,492,537,480,536,473,552,473,555,484,581,488,596,482,589,480,590,472,623,456,628,450,628,430,633,423,651,417,677,404,698,405,681,402,678,398,685,396,696,402,700,401,692,396,697,396,691,388,693,383,705,368,713,342,716,344,721,342,729,336,733,329,748,324,768,322,772,327,778,329,774,325,778,314,790,312,800,312,805,323,808,316,813,319,813,324,814,309,816,305,832,306,842,316,847,318,835,306,826,303,824,290,817,288,817,284,825,281,825,278,818,268,815,255,817,254,817,247,816,243,803,236,804,196,817,200,823,191,828,188,831,192,833,180,829,178,826,179,820,191,812,193,807,190,807,186,816,176,838,173,852,157,869,151,865,155,867,170,861,180,861,195,866,199,876,199,878,202,873,210,867,212,863,210,858,225,850,226,854,230,842,240,844,249,838,258,845,260,846,268,853,273,854,277,849,281,857,280,859,284,863,282,872,287,880,285,881,289,875,297,876,300,890,302,901,294,909,293,922,281,934,284,945,294,953,294,959,308,976,314,975,307,958,305,955,295,970,303,1019,288,1028,278,1047,271,1069,267,1076,266,1087,273,1089,275,1079,270,1085,283,1089,285,1105,285,1117,275,1120,263,1131,262,1139,256,1148,244,1150,235,1148,246,1136,261,1144,264,1152,263,1154,242,1149,227,1148,195,1149,187,1157,179,1160,167,1167,157,1189,151,1192,156,1205,167,1209,176,1218,181,1226,180,1238,170,1236,149,1242,126,1237,125,1231,129,1221,126,1215,114,1219,109,1214,108,1212,103,1215,100,1214,92,1230,88,1229,85,1238,81,1266,79,1268,74,1298,78,1307,82,1332,83,1336,78,1336,69,1344,72,1349,66,1360,67,1365,60,1392,64,1393,62,1381,52,1363,52,1352,45,1348,38,1351,40,1352,36,1348,33,1320,41,1313,38,1295,43,1296,35,1291,43,1280,41,1282,46,1275,49,1272,47,1244,55,1240,59,1213,61,1206,66,1200,67,1206,59,1197,51,1195,57,1186,59,1186,54,1190,51,1188,49,1190,45,1170,40,1169,36,1164,39,1159,36,1157,21,1163,1,1161,-2,1164,-4,1154,-20,1157,-30,1056,-30,1057,-29,1054,-27,1050,-15,1053,-7,1046,-9,1044,-3,1047,32,1055,34,1058,39,1066,36,1071,44,1082,50,1081,54,1088,57,1092,62,1093,70,1066,86,1071,87,1082,84,1084,87,1078,88,1075,96,1040,114,1019,115,1035,117,1038,120,1031,123,1034,131,1032,143,1030,143,1028,147,1031,160,1026,169,1028,177,1013,211,1009,215,1004,213,981,214,979,215,980,219,975,218,966,227,969,239,965,244,955,243,942,246,930,244,933,230,919,208,928,209,924,202,929,202,930,195,926,194,918,184,908,162,905,163,903,153,899,151,898,141,894,140,892,135,891,126,886,125,884,100,885,97,890,97,875,93,870,84,869,69,868,77,864,79,864,89,858,100,849,102,841,95,845,100,844,101,835,106,837,108,835,110,804,134,785,139,773,139,769,134,765,137,761,135,763,129,756,129,747,125,735,115,733,111,735,99,749,105,756,100,749,102,743,96,745,88,757,78,734,88,729,93,724,94,726,77,732,71,740,74,752,67,741,68,739,65,748,57,750,51,760,44,760,54,765,43,773,40,750,46,743,57,723,74,725,57,738,55,727,52,723,42,736,32,726,37,722,35,719,18,767,14,774,22,774,16,789,12,783,11,782,8,785,3,782,5,780,13,777,13,763,12,762,8,756,15,748,13,728,16,722,12,719,3,728,1,717,-8,717,-15,732,-16,746,-11,765,-15,749,-14,726,-17,722,-21,723,-26,729,-26,732,-30],[1199,107,1197,109,1195,107,1189,112,1185,105,1176,102,1186,101,1192,97,1198,100,1201,107],[1331,1023,1327,1022,1327,1013,1332,1006,1341,1003,1337,1017],[1292,887,1297,898,1294,897,1296,900,1294,901,1284,897,1289,892,1283,896,1277,892,1279,888,1286,885,1290,885],[550,39,554,43,557,42,551,65,551,54,546,53,541,49,549,47,547,41,543,40,549,36],[419,125,416,132,410,136,414,137,413,139,398,150,396,147,402,143,396,140,398,138,396,136,396,133,398,131,405,132,404,128,418,120],[421,160,421,167,433,170,426,178,424,172,416,172,413,167,407,165,404,162,409,160,408,157,415,156,415,153,418,154],[1028,208,1025,210,1024,208,1025,197,1040,167,1043,167],[952,285,952,289,946,286,944,290,938,287,940,274,945,272,951,278,949,281],[889,264,899,268,900,273,892,275,881,269,881,262,887,262]];
// a place on the map: [x, y] in the frame for a longitude and a latitude
const dm_geo=(lon,lat)=>[157.04+(lon+16)*0.66913*40,(61.5-lat)*40];
// [name, longitude, latitude, year of the first press]
const DM_TOWNS=[["Mainz",8.27,50.0,1454],["Bamberg",10.89,49.89,1459],["Strasbourg",7.75,48.58,1460],["Cologne",6.96,50.94,1465],["Subiaco",13.1,41.92,1465],
  ["Rome",12.5,41.9,1467],["Basel",7.59,47.56,1468],["Augsburg",10.9,48.37,1468],["Venice",12.33,45.44,1469],["Nuremberg",11.08,49.45,1470],["Paris",2.35,48.86,1470],
  ["Milan",9.19,45.46,1470],["Naples",14.27,40.85,1470],["Foligno",12.7,42.95,1470],["Florence",11.25,43.77,1471],["Bologna",11.34,44.49,1471],["Ferrara",11.62,44.84,1471],
  ["Speyer",8.43,49.32,1471],["Treviso",12.24,45.67,1471],["Perugia",12.39,43.11,1471],["Verona",10.99,45.44,1472],["Padua",11.88,45.41,1472],["Parma",10.33,44.8,1472],
  ["Mantua",10.79,45.16,1472],["Ulm",9.99,48.4,1473],["Lyon",4.84,45.76,1473],["Utrecht",5.12,52.09,1473],["Aalst",4.04,50.94,1473],["Buda",19.04,47.5,1473],
  ["Merseburg",11.99,51.36,1473],["Brescia",10.22,45.54,1473],["Messina",15.55,38.19,1473],["Esslingen",9.31,48.74,1473],["Erfurt",11.03,50.98,1473],["Pavia",9.16,45.19,1473],
  ["Kraków",19.94,50.06,1474],["Valencia",-0.38,39.47,1474],["Leuven",4.7,50.88,1474],["Genoa",8.93,44.41,1474],["Bruges",3.22,51.21,1474],["Turin",7.69,45.07,1474],
  ["Barcelona",2.17,41.39,1475],["Lübeck",10.69,53.87,1475],["Zaragoza",-0.89,41.65,1475],["Wrocław",17.03,51.11,1475],["Modena",10.93,44.65,1475],
  ["Westminster",-0.13,51.5,1476],["Rostock",12.1,54.09,1476],["Plzeň",13.37,49.74,1476],["Toulouse",1.44,43.6,1476],["Reutlingen",9.21,48.49,1476],
  ["Delft",4.36,52.01,1477],["Gouda",4.71,52.01,1477],["Seville",-5.98,37.39,1477],["Palermo",13.36,38.12,1477],["Deventer",6.16,52.25,1477],["Angers",-0.55,47.47,1477],
  ["Geneva",6.14,46.2,1478],["Oxford",-1.26,51.75,1478],["Prague",14.42,50.08,1478],["Würzburg",9.95,49.79,1479],["Poitiers",0.34,46.58,1479],["Zwolle",6.09,52.51,1479],
  ["Salamanca",-5.66,40.97,1480],["Magdeburg",11.62,52.13,1480],["Passau",13.43,48.57,1480],["Memmingen",10.18,47.99,1480],["Caen",-0.37,49.18,1480],
  ["Antwerp",4.4,51.22,1481],["Leipzig",12.37,51.34,1481],["Valladolid",-4.72,41.65,1481],["Vienna",16.37,48.21,1482],["Odense",10.39,55.4,1482],
  ["Stockholm",18.07,59.33,1483],["Toledo",-4.02,39.86,1483],["Haarlem",4.64,52.38,1483],["Troyes",4.07,48.3,1483],["Siena",11.33,43.32,1484],
  ["Rouen",1.1,49.44,1485],["Burgos",-3.7,42.34,1485],["Heidelberg",8.67,49.4,1485],["Münster",7.63,51.96,1485],["Brno",16.61,49.2,1486],["Schleswig",9.56,54.52,1486],
  ["Abbeville",1.83,50.1,1486],["Murcia",-1.13,37.99,1487],["Lisbon",-9.14,38.72,1489],["Pamplona",-1.64,42.81,1490],["Grenoble",5.72,45.19,1490],["Copenhagen",12.57,55.68,1490],
  ["Hamburg",9.99,53.55,1491],["Dijon",5.04,47.32,1491],["Freiburg",7.85,47.99,1491],["Nantes",-1.55,47.22,1493],["Constantinople",28.98,41.01,1493],["Cetinje",18.92,42.39,1494],
  ["Senj",14.9,44.99,1494],["Limoges",1.26,45.83,1495],["Granada",-3.6,37.18,1496],["Tours",0.69,47.39,1496],["Tübingen",9.06,48.52,1498],["Gdańsk",18.65,54.35,1499],
  ["Montserrat",1.84,41.59,1499],["Olomouc",17.25,49.59,1499]];
AG_PLACES.dmMap=c=>{const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#C9D3D4");g.addColorStop(1,"#BCC8CA");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the land: a pale relief, a soft shore, a shadow falling down and left as everywhere else
  const land=cc=>{for(const P of DM_LAND){cc.moveTo(P[0],P[1]);for(let i=2;i<P.length;i+=2)cc.lineTo(P[i],P[i+1]);cc.closePath();}};
  c.save();c.shadowColor="rgba(60,70,72,0.35)";c.shadowBlur=18;c.shadowOffsetX=-6;c.shadowOffsetY=6;ag_shape(c,land);c.fillStyle=rgba(DM.land,1);c.fill();c.restore();
  c.save();ag_shape(c,land);c.clip();const lg=c.createRadialGradient(1300,300,100,1000,540,1300);lg.addColorStop(0,"rgba(255,252,244,0.5)");lg.addColorStop(1,"rgba(150,130,100,0.18)");
  c.fillStyle=lg;c.fillRect(0,0,W,H);c.restore();
  ag_shape(c,land);c.strokeStyle=rgba(DM.landEdge,0.8);c.lineWidth=1.6;c.lineJoin="round";c.stroke();
  // a fine graticule, every five degrees, under everything, very faint
  c.save();c.globalCompositeOperation="multiply";c.strokeStyle="rgba(120,130,130,0.12)";c.lineWidth=1;
  for(let lon=-15;lon<=45;lon+=5){const a=dm_geo(lon,61.5),b=dm_geo(lon,34.5);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  for(let lat=35;lat<=60;lat+=5){const a=dm_geo(-16,lat),b=dm_geo(44,lat);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}c.restore();};
// the towns lit by the year yr (fractional): each comes in with a small glow; Mainz with a ring and its name
function dm_towns(ctx,yr,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return 0;let n=0;ctx.save();ctx.globalAlpha*=a;
  for(const [name,lon,lat,y] of DM_TOWNS){const u=clamp((yr-y)/1.2,0,1);if(u<=0)continue;n++;const [x,yy]=dm_geo(lon,lat),k=ag_spr(u,0,0.5);
    if(o.glow){const gr=ctx.createRadialGradient(x,yy,0,x,yy,26+o.glow*90);gr.addColorStop(0,rgba(DM.lamp,0.5*o.glow));gr.addColorStop(1,rgba(DM.lamp,0));ctx.fillStyle=gr;ctx.fillRect(x-130,yy-130,260,260);}
    const gr=ctx.createRadialGradient(x,yy,0,x,yy,22);gr.addColorStop(0,rgba(DM.lamp,0.75*(1-u*0.4)));gr.addColorStop(1,rgba(DM.lamp,0));ctx.fillStyle=gr;ctx.fillRect(x-24,yy-24,48,48);
    ctx.fillStyle=rgba([150,82,40],1);ctx.beginPath();ctx.arc(x,yy,5.5*k,0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,250,240,0.9)";ctx.lineWidth=1.6;ctx.stroke();}
  const [mx,my]=dm_geo(8.27,50.0);ctx.strokeStyle=rgba([150,82,40],0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(mx,my,14,0,TAU);ctx.stroke();
  ag_T(ctx,"Mainz",mx+24,my-14,{w:700,size:30,col:[90,56,30]});
  ctx.restore();return n;}

/* ===== Decades in the making: the lab =====
   Jun Park's team in the white lab, the agent, and the oak timeline along the marble wall, with what stands under each year.
     dmLab       the lab, its marble quieter along the top where the rail runs and where the exhibits' words go
     DM_YEARS    the years on the rail, and which hang lower so their tabs don't touch
     dm_team     Jun at the desk, the agent beside it, and two of the team: the opening's last shot and the film's last
     dm_tasks    a short list of tasks the agent works through, each ticked in turn */
AG_PLACES.dmLab=c=>ag_paintLab(c,{quiet:[[960,240,1200,130,0.75],[1500,420,520,260,0.5],[420,420,460,220,0.4]]});
const DM_YEARS=[{y:1958},{y:1969},{y:1986},{y:2012},{y:2017},{y:2020,drop:72},{y:2022},{y:2024,drop:72}];
// the rail in the lab: focus (a year at x 960), ppy, which years show (a list of years, or all), each tab's light (lit(y) -> 0..1), draw;
// pin(y) -> 0..1 turns a tab into a stud on the rail, drop(y) moves it, grow is how much a lit tab swells (0.16)
function dm_labRail(ctx,o){const show=o.show||DM_YEARS.map(v=>v.y);return dm_rail(ctx,{y:196,ppy:o.ppy||40,focus:o.focus,draw:o.draw,a:o.a,
    years:DM_YEARS.filter(v=>show.includes(v.y)).map(v=>({y:v.y,drop:o.flat?0:o.drop&&o.drop(v.y)!=null?o.drop(v.y):v.drop,lit:o.lit?o.lit(v.y):0,a:o.tabA?o.tabA(v.y):1,
      pin:o.pin?o.pin(v.y):0,grow:o.grow}))});}

// the team's places in the lab
const DM_TEAM={desk:[540,900,700],jun:[760,560,0.8],screen:[980,640,220,140],agent:[1420,500,100],yusuf:[250,600,0.96],mei:[1720,600,0.96]};
// Jun at the desk, the screen, the agent beside them; o: t, agent (0..1 how far it has come), think, screenDraw
function dm_team(ctx,o){const T=DM_TEAM,[dx,dy,dw]=T.desk,[jx,jy,js]=T.jun,[sx,sy,sw,sh]=T.screen,[ax,ay,ar]=T.agent;
  ag_desk(ctx,dx,dy,dw,{});ag_screen(ctx,sx,sy,sw,sh,{stand:dy-70-sy-sh+6,draw:(cx,x0,y0,w0,h0)=>{dm_sheetOnScreen(cx,x0,y0,w0,h0);if(o.screen)o.screen(cx,x0,y0,w0,h0);}});
  ag_person(ctx,"jun",jx,jy,js,{t:o.t,pose:"desk",cut:dy-70,gaze:o.junGaze||[4,1],nod:o.junNod||0,smile:o.junSmile==null?0.35:o.junSmile});
  if(o.yusuf>0){ctx.save();ctx.globalAlpha*=o.yusuf;const [x,y,s]=T.yusuf;ag_person(ctx,"yusuf",x-(1-ag_eo(o.yusuf))*60,y,s,{t:o.t+3,pose:o.yPose,smile:o.ySmile==null?0.1:o.ySmile,gaze:[4,0]});ctx.restore();}
  if(o.mei>0){ctx.save();ctx.globalAlpha*=o.mei;const [x,y,s]=T.mei;ag_person(ctx,"mei",x+(1-ag_eo(o.mei))*60,y,s,{t:o.t+5,flip:true,pose:o.mPose,smile:o.mSmile==null?0.45:o.mSmile,gaze:[4,0]});ctx.restore();}
  ag_roomLight(ctx,1);
  if(o.agent>0){const k=ag_spr(o.agent,0,0.6),a=clamp(o.agent*2,0,1);ag_modelLight(ctx,ax,ay,ar*k,a*0.8);ag_model(ctx,ax,ay-(1-k)*30,ar*Math.max(0.01,k),{t:o.t,core:0.6+0.4*(o.think||0),think:o.think||0,label:"AI agent",a});}}
// the tasks the agent works through: a card of three, each ticked when done (done: 0..3, fractional while it works)
const DM_TASKS=["Find this term's file","Count the students","Check the totals"];
function dm_tasks(ctx,x,y,done,a){if(a<=0)return;const w=470,h=60+DM_TASKS.length*58;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,20,{});
  ag_T(ctx,"TASKS",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  DM_TASKS.forEach((s,i)=>{const yy=y+104+i*58,u=clamp(done-i,0,1),on=u>=1;
    ctx.strokeStyle=rgba(on?AG.green:AG.mut,on?0.9:0.5);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+44,yy-10,15,0,TAU);ctx.stroke();
    if(on)ag_tick(ctx,x+44,yy-10,18,rgba(AG.green,1),3.5);else if(u>0){ctx.strokeStyle=rgba(AG.violet,0.9);ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(x+44,yy-10,15,-Math.PI/2,-Math.PI/2+TAU*u);ctx.stroke();}
    ag_T(ctx,s,x+76,yy,{w:600,size:30,col:on?AG.ink:AG.mut});});ctx.restore();}
// what Jun's screen shows: a table of rows, quiet blue lines
function dm_sheetOnScreen(c,x,y,w,h){c.fillStyle="#F4F5F3";c.fillRect(x,y,w,h);c.fillStyle=rgba(AG.blue,0.16);c.fillRect(x,y,w,18);
  c.strokeStyle=rgba(AG.blue,0.22);c.lineWidth=1;for(let k=1;k<7;k++){c.beginPath();c.moveTo(x,y+18+k*17);c.lineTo(x+w,y+18+k*17);c.stroke();}
  for(const f of [0.32,0.62]){c.beginPath();c.moveTo(x+w*f,y);c.lineTo(x+w*f,y+h);c.stroke();}}

/* ---------------------------------------------------------------- 1958: the perceptron
   The 1958 demonstration ran as a program on a computer; the film draws it as one cabinet so its parts can be seen: an eye of 20 x 20
   cells (as on the machine built in 1960), the card shown to it, marked on the left or the right, two lamps for its guess, and six
   dials: the numbers each wrong guess nudges. dm_perceptron(ctx, x, y, o): o.on (0..1 switched on), o.card (0 left, 1 right),
   o.show (0..1 the card in place), o.guess (0, 1 or null), o.right (true, false or null), o.dial(i) -> angle, o.nudge (0..1, the
   dials' amber rims while a wrong guess moves them), o.tries, o.a. The cabinet is 760 by 520, on legs 120 tall. */
const DM_EYE=20;
function dm_perceptron(ctx,x,y,o){const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=760,h=520,on=o.on==null?1:o.on;
  ag_floorShadow(ctx,x+w/2-20,y+h+122,w*0.55,34,0.22);
  for(const lx of [x+50,x+w-80])ag_soft(ctx,cc=>ag_rect(cc,lx,y+h-6,30,128,4),[90,98,106],[150,160,168],lx+30,y+h,80,"rgba(0,0,0,0.3)",4);
  ag_soft(ctx,cc=>ag_rect(cc,x,y,w,h,18),[150,162,170],[214,222,226],x+w,y,700,"rgba(30,40,50,0.4)",18);
  // its name, on a brass plate
  const pw=ag_tw(ctx,"PERCEPTRON",{w:800,size:30,ls:5})+60;
  ag_soft(ctx,cc=>ag_rect(cc,x+w/2-pw/2,y+22,pw,52,8),[170,134,66],[236,212,146],x+w/2+pw/2,y+22,pw,"rgba(80,60,20,0.4)",4);
  ag_T(ctx,"PERCEPTRON",x+w/2,y+60,{w:800,size:30,ls:5,align:"center",col:[72,54,26]});
  // the card on its holder, at the left: a white card with a dark mark on its left or its right half
  const cx=x+44,cy=y+122,cw=200,ch=150,sh=o.show||0;
  ag_inner(ctx,cc=>ag_rect(cc,cx-10,cy-10,cw+20,ch+20,10),"rgba(20,30,40,0.5)",12,-3,3);
  if(sh>0){ctx.save();ctx.globalAlpha*=clamp(sh*1.6,0,1);ctx.translate(0,(1-ag_eo(sh))*-30);ctx.fillStyle="#FBFAF6";ctx.fillRect(cx,cy,cw,ch);
    ctx.fillStyle=rgba(DM.ink,0.85);ctx.beginPath();ctx.arc(cx+(o.card?cw*0.74:cw*0.26),cy+ch/2,34,0,TAU);ctx.fill();ctx.restore();}
  ag_T(ctx,"Shown",cx+cw/2,y+352,{w:600,size:28,align:"center",col:AG.mut});
  // the eye: 20 x 20 cells, lit where the card's mark falls
  const ex=x+290,ey=y+100,es=196,cs=es/DM_EYE;ctx.fillStyle="#2B2E33";rr(ctx,ex-8,ey-8,es+16,es+16,8);ctx.fill();
  const mx=(o.card?0.74:0.26)*DM_EYE;
  for(let i=0;i<DM_EYE;i++)for(let j=0;j<DM_EYE;j++){const lit=sh>0.6&&Math.hypot(i+0.5-mx,j+0.5-DM_EYE/2)<3.7?clamp((sh-0.6)/0.3,0,1):0;
    ctx.fillStyle=rgba(mix(mix([58,62,70],[78,86,96],on),[255,236,190],lit),1);ctx.fillRect(ex+i*cs+1,ey+j*cs+1,cs-2,cs-2);}
  ag_T(ctx,"Its eye",ex+es/2,y+352,{w:600,size:28,align:"center",col:AG.mut});
  // its guess: two lamps
  for(const [k,lab] of [[0,"Left"],[1,"Right"]]){const lx=x+576,ly=y+162+k*92,lit=o.guess===k?1:0;
    ctx.fillStyle=rgba(mix(mix([80,86,94],[104,112,120],on),AG.violet,lit),1);ctx.beginPath();ctx.arc(lx,ly,22,0,TAU);ctx.fill();
    if(lit){ctx.save();ctx.shadowColor=rgba(AG.violet,0.8);ctx.shadowBlur=24;ctx.fill();ctx.restore();}
    ag_T(ctx,lab,lx+38,ly+11,{w:700,size:30,col:lit?AG.ink:AG.mut});}
  if(o.right!=null&&o.guess!=null){const vx=x+w-46,vy=y+162+o.guess*92;if(o.right)ag_tick(ctx,vx,vy,30,rgba(AG.green,1),5);else{ctx.save();ctx.strokeStyle=rgba(AG.amber,1);ctx.lineWidth=5;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(vx-13,vy-13);ctx.lineTo(vx+13,vy+13);ctx.moveTo(vx+13,vy-13);ctx.lineTo(vx-13,vy+13);ctx.stroke();ctx.restore();}}
  // the dials: its numbers, with an amber rim while a wrong guess nudges them
  const nu=o.nudge||0;
  for(let i=0;i<6;i++){const dx=x+90+i*116,dy=y+428,ang=o.dial?o.dial(i):0;
    if(nu>0){ctx.save();ctx.strokeStyle=rgba(AG.amber,0.85*nu);ctx.lineWidth=5;ctx.beginPath();ctx.arc(dx,dy,42,0,TAU);ctx.stroke();ctx.restore();}
    ag_soft(ctx,cc=>cc.arc(dx,dy,36,0,TAU),[226,230,232],[255,255,255],dx+14,dy-14,40,"rgba(30,40,50,0.35)",6);
    ctx.strokeStyle=rgba(AG.blue,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+Math.sin(ang)*26,dy-Math.cos(ang)*26);ctx.stroke();}
  ag_T(ctx,"Its numbers",x+w/2,y+500,{w:600,size:28,align:"center",col:AG.mut});
  if(o.tries!=null)ag_pill(ctx,x+w-96,y-44,"Try "+o.tries,{size:30});
  ctx.restore();}
// a newspaper clipping of 8 July 1958, without its paper's name: its headline, and the line about what the Navy expected (hi: 0..1 marks it)
function dm_clipping(ctx,x,y,a,hi){if(a<=0)return;const w=680,h=360;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(-0.022);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.3)";ctx.shadowBlur=28;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=14;ctx.fillStyle="#F3EEE2";ctx.fillRect(0,0,w,h);ctx.restore();
  ag_T(ctx,"JULY 8, 1958",34,54,{w:700,size:28,ls:3,col:AG.mut});ctx.fillStyle=rgba(AG.ink,0.6);ctx.fillRect(34,72,w-68,2);
  ag_T(ctx,"New Navy device",34,128,{w:800,size:42});ag_T(ctx,"learns by doing",34,176,{w:800,size:42});
  const lines=["“…expects will be able to walk, talk,","see, write, reproduce itself and be","conscious of its existence.”"];
  lines.forEach((l,i)=>ag_T(ctx,l,34,238+i*40,{w:500,size:30,col:mix(AG.ink,AG.amber,i===0||i===2?hi:0)}));ctx.restore();}
// a pattern one straight line can't split: two dark dots on one diagonal, two rings on the other, on a card s wide (x, y its middle);
// a line tries (ang, off), the side it cuts off tinted; fail: 0..1 turns the line amber
function dm_xor(ctx,x,y,s,ang,off,a,fail){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x-s/2,y-s/2,s,s,22,{});
  const nx=-Math.sin(ang),ny=Math.cos(ang),px=x+nx*off,py=y+ny*off,dx=Math.cos(ang),dy=Math.sin(ang),L=s*2;
  ctx.save();ctx.beginPath();ag_rect(ctx,x-s/2,y-s/2,s,s,22);ctx.clip();ctx.fillStyle=rgba(AG.blue,0.1);ctx.beginPath();ctx.moveTo(px-dx*L,py-dy*L);ctx.lineTo(px+dx*L,py+dy*L);
  ctx.lineTo(px+dx*L+nx*L,py+dy*L+ny*L);ctx.lineTo(px-dx*L+nx*L,py-dy*L+ny*L);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(mix(AG.blue,AG.amber,fail),0.95);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(px-dx*L,py-dy*L);ctx.lineTo(px+dx*L,py+dy*L);ctx.stroke();ctx.restore();
  for(const [i,j,dark] of [[0,0,1],[1,1,1],[0,1,0],[1,0,0]]){const qx=x+(i-0.5)*s*0.5,qy=y+(j-0.5)*s*0.5;ctx.beginPath();ctx.arc(qx,qy,s*0.075,0,TAU);
    if(dark){ctx.fillStyle=rgba(DM.ink,0.85);ctx.fill();}else{ctx.fillStyle="#FBFAF6";ctx.fill();ctx.strokeStyle=rgba(DM.ink,0.85);ctx.lineWidth=6;ctx.stroke();}}
  ctx.restore();}
// a closed book on the wall's ledge, its title on the cover
function dm_bookCover(ctx,x,y,title,yr,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_soft(ctx,cc=>ag_rect(cc,x,y,240,330,8),[52,74,96],[110,136,160],x+240,y,300,"rgba(10,20,30,0.45)",14);
  ctx.fillStyle="rgba(255,255,255,0.12)";ctx.fillRect(x+16,y,8,330);ag_T(ctx,title,x+130,y+120,{w:800,size:32,align:"center",col:[244,244,240]});ag_T(ctx,yr,x+130,y+290,{w:600,size:28,align:"center",col:[214,222,230]});ctx.restore();}
// coins sliding away to the right (money moving elsewhere): u 0..1
function dm_coinsAway(ctx,x,y,u){if(u<=0||u>=1)return;for(let i=0;i<5;i++){const k=clamp(u*1.4-i*0.1,0,1),cx=x+ag_sine(k)*900+i*30,cy=y-Math.sin(Math.PI*k)*60+i*6;
    ctx.save();ctx.globalAlpha*=1-k;ag_soft(ctx,cc=>cc.ellipse(cx,cy,22,14,0,0,TAU),[196,160,70],[250,226,150],cx+6,cy-4,20,"rgba(80,60,10,0.4)",3);ctx.restore();}}

/* ---------------------------------------------------------------- 1986: a network of layers that learns from its mistakes
   dm_net(ctx, x, y, w, h, sizes, o): layers of nodes from left to right; o.fwd (0..1) a pulse running forward, o.back (0..1) the error
   running back, o.wt(i, j, k) a connection's weight (0..1), o.lit(layer, node) a node's light, o.col the nodes' colour, o.a */
function dm_netPos(x,y,w,h,sizes){return sizes.map((n,l)=>Array.from({length:n},(_,i)=>[x+w*l/(sizes.length-1),y+h/2+(i-(n-1)/2)*Math.min(h/(n-1||1),110)]));}
function dm_net(ctx,x,y,w,h,sizes,o){o=o||{};const a=o.a==null?1:o.a,P=dm_netPos(x,y,w,h,sizes);if(a<=0)return P;const L=sizes.length,r=o.r||22;ctx.save();ctx.globalAlpha*=a;
  for(let l=0;l<L-1;l++)for(let i=0;i<P[l].length;i++)for(let j=0;j<P[l+1].length;j++){const wt=o.wt?o.wt(l,i,j):0.5,A=P[l][i],B=P[l+1][j];
    ctx.strokeStyle=rgba(AG.label,0.16+0.3*wt);ctx.lineWidth=1+3.5*wt;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();}
  // the pulses: forward in violet, back in amber, a layer at a time
  for(const [p,col,dir] of [[o.fwd,AG.violet,1],[o.back,AG.amber,-1]]){if(!(p>0&&p<1))continue;const s=p*(L-1),l=Math.floor(s),u=s-l,l0=dir>0?l:L-1-l,l1=dir>0?l0+1:l0-1;if(l1<0||l1>=L)continue;
    ctx.save();ctx.lineCap="round";for(let i=0;i<P[l0].length;i++)for(let j=0;j<P[l1].length;j++){const A=P[l0][i],B=P[l1][j],q=[lerp(A[0],B[0],u),lerp(A[1],B[1],u)],u0=Math.max(0,u-0.4),q0=[lerp(A[0],B[0],u0),lerp(A[1],B[1],u0)];
      const g=ctx.createLinearGradient(q0[0],q0[1],q[0],q[1]);g.addColorStop(0,rgba(col,0));g.addColorStop(1,rgba(col,0.75));ctx.strokeStyle=g;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();
      ctx.fillStyle=rgba(col,0.95);ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(q[0],q[1],5.5,0,TAU);ctx.fill();ctx.shadowBlur=0;}ctx.restore();}
  for(let l=0;l<L;l++)for(let i=0;i<P[l].length;i++){const [nx,ny]=P[l][i],lt=o.lit?o.lit(l,i):0.3;
    ag_soft(ctx,cc=>cc.arc(nx,ny,r,0,TAU),mix([226,224,236],o.col||AG.violet,0.25+0.55*lt),[255,255,255],nx+r*0.4,ny-r*0.5,r*1.4,"rgba(40,30,80,0.3)",6,0.6);
    if(lt>0.5){ctx.save();ctx.globalAlpha*=(lt-0.5)*2;ctx.shadowColor=rgba(o.col||AG.violet,0.8);ctx.shadowBlur=20;ctx.strokeStyle=rgba(o.col||AG.violet,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(nx,ny,r+3,0,TAU);ctx.stroke();ctx.restore();}}
  ctx.restore();return P;}
// a small badge of a pattern a hidden node found: 3 x 3 cells (bits, a number whose bits say which are dark)
function dm_patternBadge(ctx,x,y,bits,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x-34,y-34,68,68,12,{});for(let k=0;k<9;k++){const on=(bits>>k)&1;ctx.fillStyle=on?rgba(DM.ink,0.8):rgba([210,206,200],1);ctx.fillRect(x-24+(k%3)*17,y-24+Math.floor(k/3)*17,15,15);}ctx.restore();}
// a pattern a node in between found by itself: 4 x 4 cells, rows of "1" and "0"
function dm_pattern(ctx,x,y,rows,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const k=ag_eo(clamp(a*1.4,0,1));ctx.translate(x,y);ctx.scale(0.7+0.3*k,0.7+0.3*k);
  ag_box(ctx,-46,-46,92,92,14,{});rows.forEach((r,j)=>[...r].forEach((v,i)=>{ctx.fillStyle=v==="1"?rgba(DM.ink,0.82):rgba([214,210,204],1);rr(ctx,-36+i*18.5,-36+j*18.5,16,16,3);ctx.fill();}));ctx.restore();}
const DM_PATTERNS=[["1000","1000","1000","1000"],["0000","1111","0000","0000"],["1000","0100","0010","0001"],["1111","1000","1000","1000"]];
// a large soft panel that holds a diagram on the wall
function dm_panel(ctx,x,y,w,h,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,28,{});ctx.restore();}
// a computer of the 1980s: a beige box and screen, a slow bar of work done (p)
function dm_oldComputer(ctx,x,y,p,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+150,y+290,200,24,0.25);
  ag_soft(ctx,cc=>ag_rect(cc,x,y+200,300,80,8),[214,204,180],[240,234,218],x+300,y+200,300,"rgba(60,50,30,0.35)",10);
  ag_soft(ctx,cc=>ag_rect(cc,x+30,y,240,200,14),[214,204,180],[240,234,218],x+270,y,300,"rgba(60,50,30,0.35)",10);
  ctx.fillStyle="#2C3A30";rr(ctx,x+52,y+22,196,150,8);ctx.fill();ctx.fillStyle="rgba(140,230,150,0.85)";ctx.fillRect(x+70,y+130,160*p,16);ctx.strokeStyle="rgba(140,230,150,0.6)";ctx.lineWidth=2;ctx.strokeRect(x+70,y+130,160,16);
  ctx.fillStyle="rgba(140,230,150,0.7)";for(let i=0;i<3;i++)ctx.fillRect(x+70,y+44+i*22,90+((i*53)%60),8);ctx.restore();}

/* ---------------------------------------------------------------- 2012: photos, chips, and a contest
   dm_chip(ctx, x, y, s, wave, a): a graphics chip, its 512 small cores (16 x 32) lighting in waves; dm_hundred(ctx, x, y, miss, a, u): a
   hundred squares, the misses amber; dm_photos(ctx, x, y, n, a): labelled photos, in a stack that fans out */
function dm_chip(ctx,x,y,s,wave,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=300*s,h=170*s;ag_soft(ctx,cc=>ag_rect(cc,x,y,w,h,14*s),[44,70,86],[90,130,150],x+w,y,w,"rgba(0,0,0,0.4)",10);
  ctx.strokeStyle="rgba(200,190,150,0.8)";ctx.lineWidth=3*s;for(let k=0;k<10;k++){const px=x+22*s+k*(w-44*s)/9;ctx.beginPath();ctx.moveTo(px,y+h);ctx.lineTo(px,y+h+14*s);ctx.stroke();ctx.beginPath();ctx.moveTo(px,y);ctx.lineTo(px,y-14*s);ctx.stroke();}
  const cw=(w-40*s)/32,chh=(h-40*s)/16;for(let i=0;i<32;i++)for(let j=0;j<16;j++){const lit=wave==null?0:clamp(1-Math.abs(((i+j*0.6)/40-wave*1.4+0.2))*4,0,1);
    ctx.fillStyle=lit>0?rgba(mix([60,96,116],[170,220,240],lit),1):"rgba(60,96,116,1)";ctx.fillRect(x+20*s+i*cw,y+20*s+j*chh,cw-1.5*s,chh-1.5*s);}ctx.restore();}
function dm_hundred(ctx,x,y,miss,a,u){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const s=34,r=ag_rnd(miss*7+3),bad=new Set();while(bad.size<miss)bad.add(Math.floor(r()*100));
  let k=0;for(let j=0;j<10;j++)for(let i=0;i<10;i++,k++){const on=bad.has(k)&&(u==null||k/100<=u);ctx.fillStyle=on?rgba(AG.amber,0.9):rgba([216,214,208],1);rr(ctx,x+i*s,y+j*s,s-5,s-5,5);ctx.fill();}ctx.restore();}
function dm_photos(ctx,x,y,n,a,o){if(a<=0)return;o=o||{};ctx.save();ctx.globalAlpha*=a;const r=ag_rnd(77);
  for(let k=0;k<n;k++){const px=x+(k%6)*86+(Math.floor(k/6)%2)*14,py=y+Math.floor(k/6)*74,c1=[[96,140,170],[150,170,110],[190,140,90],[170,120,150],[110,150,140]][k%5];
    ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;ctx.fillStyle="#FFFFFF";ctx.fillRect(px,py,76,62);ctx.restore();
    ctx.fillStyle=rgba(c1,1);ctx.fillRect(px+5,py+5,66,40);ctx.fillStyle=rgba(ag_dk(c1,0.3),1);ctx.beginPath();ctx.arc(px+24+r()*28,py+30,8+r()*6,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(AG.orange,0.85);ctx.fillRect(px+5,py+50,30+r()*30,6);}ctx.restore();}

/* ---------------------------------------------------------------- 2017: words read one at a time, then all at once
   dm_sentence(ctx, x, y, words, o): word cards in a row from (x, y); o.on(i) each card's light; o.arcs [[i, j, weight]] drawn above them;
   returns each card's middle */
function dm_sentence(ctx,x,y,words,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const gap=14,size=o.size||32,ws=words.map(wd=>ag_tw(ctx,wd,{w:700,size})+36),hk=o.arcH||0.32;
  if(o.center){const tot=ws.reduce((p,v)=>p+v,0)+gap*(words.length-1);x-=tot/2;}
  let xx=x;const mids=[];ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<words.length;i++){mids.push([xx+ws[i]/2,y]);xx+=ws[i]+gap;}
  for(const [i,j,wt,col] of (o.arcs||[])){if(wt<=0)continue;const A=mids[i],B=mids[j],h=36+Math.abs(B[0]-A[0])*hk;ctx.strokeStyle=rgba(col||AG.violet,0.25+0.7*wt);ctx.lineWidth=1.5+7*wt;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(A[0],y-34);ctx.bezierCurveTo(A[0],y-34-h,B[0],y-34-h,B[0],y-34);ctx.stroke();}
  for(let i=0;i<words.length;i++){const on=o.on?o.on(i):1,[mx]=mids[i],w=ws[i];ag_box(ctx,mx-w/2,y-30,w,60,14,{edge:on>0.5?AG.violet:null,edgeA:on});
    ag_T(ctx,words[i],mx,y+11,{w:700,size,align:"center",col:mix(AG.mut,AG.ink,on)});}
  ctx.restore();return mids;}
// a paper's first page: its title, the year, lines of text
function dm_paperSheet(ctx,x,y,title,yr,a,o){if(a<=0)return;o=o||{};const w=o.w||380,h=o.h||500,ts=o.size||32;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(46,38,28,0.28)";ctx.shadowBlur=26;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;ctx.fillStyle="#FBFAF7";ctx.fillRect(x,y,w,h);ctx.restore();
  const lh=ts*1.25,tl=ag_wrap(ctx,title,w-60,{w:800,size:ts});tl.forEach((l,i)=>ag_T(ctx,l,x+w/2,y+70+i*lh,{w:800,size:ts,align:"center"}));ag_T(ctx,yr,x+w/2,y+86+tl.length*lh,{w:600,size:32,align:"center",col:AG.mut});
  ctx.fillStyle="rgba(60,60,64,0.25)";const n=Math.floor((h-150-tl.length*lh)/24);for(let i=0;i<n;i++)ctx.fillRect(x+40,y+150+tl.length*lh+i*24,(i%4===3?0.6:1)*(w-80),8);ctx.restore();}

/* ---------------------------------------------------------------- 2018 to 2024: text in, answers ranked, steps, tools */
// pages and books flying into the model from the left, along gentle curves, smaller as they arrive (u: time in seconds; a)
function dm_textIn(ctx,tx,ty,u,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;for(let i=0;i<18;i++){const r=ag_rnd(i*29+7),sp=0.16+r()*0.06,ph=(u*sp+r())%1,sx=-90+r()*240,sy=330+r()*500;
    const e=ag_sine(ph),x=lerp(sx,tx,e),y=lerp(sy,ty,e)-Math.sin(Math.PI*ph)*(r()-0.3)*160,k=1.1-ph*0.85;
    ctx.save();ctx.globalAlpha*=Math.min(1,Math.sin(Math.PI*ph)*1.6);ctx.translate(x,y);ctx.scale(k,k);ctx.rotate((r()-0.5)*0.6+ph*0.4);
    if(i%4===0){const col=[[150,96,70],[70,96,130],[96,120,84]][i%3];ag_soft(ctx,cc=>ag_rect(cc,-44,-60,88,120,6),col,ag_lt(col,0.3),44,-60,110,"rgba(30,20,10,0.35)",6);
      ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(-36,-60,7,120);}
    else{ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=5;ctx.fillStyle="#FFFFFF";ctx.fillRect(-42,-56,84,112);ctx.restore();
      ctx.fillStyle=rgba(AG.orange,0.55);for(let k2=0;k2<7;k2++)ctx.fillRect(-32,-42+k2*13,k2%3===2?38:62,5);}
    ctx.restore();}ctx.restore();}
// an answer card with a rank badge
function dm_answer(ctx,x,y,w,lines,rank,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=40+lines.length*38;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,16,{edge:o.edge,edgeA:o.edgeA});
  lines.forEach((l,i)=>ag_T(ctx,l,x+(rank?86:26),y+46+i*38,{w:o.bold?700:500,size:28,col:o.col||AG.ink}));
  if(rank){ctx.fillStyle=rgba(rank===1?AG.green:AG.mut,0.95);ctx.beginPath();ctx.arc(x+44,y+h/2,24,0,TAU);ctx.fill();ag_T(ctx,String(rank),x+44,y+h/2+11,{w:800,size:30,align:"center",col:[255,255,255]});}
  ctx.restore();return h;}
// the small pictures on the cards of the pieces that came together in 2012, and again at the end
const DM_ICONS={
  net:c=>{const P=dm_netPos(-54,-40,108,80,[3,4,2]);c.strokeStyle=rgba(AG.label,0.4);c.lineWidth=2;for(let l=0;l<2;l++)for(const A of P[l])for(const B of P[l+1]){c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(B[0],B[1]);c.stroke();}
    for(const L of P)for(const [x,y] of L){c.fillStyle=rgba(mix([226,224,236],AG.violet,0.6),1);c.beginPath();c.arc(x,y,9,0,TAU);c.fill();}},
  photos:c=>{for(const [dx,dy,col] of [[-30,-20,[96,140,170]],[0,-6,[150,170,110]],[30,8,[190,140,90]]]){c.save();c.shadowColor="rgba(46,38,28,0.25)";c.shadowBlur=6;c.fillStyle="#fff";c.fillRect(dx-34,dy-26,68,56);c.restore();
    c.fillStyle=rgba(col,1);c.fillRect(dx-29,dy-21,58,34);c.fillStyle=rgba(AG.orange,0.85);c.fillRect(dx-29,dy+18,28,5);}},
  chip:c=>dm_chip(c,-60,-34,0.4,0.5,1),
  pages:c=>{for(let k=2;k>=0;k--){c.fillStyle="#fff";c.save();c.shadowColor="rgba(46,38,28,0.25)";c.shadowBlur=6;c.fillRect(-40+k*12,-44+k*8,64,84);c.restore();c.fillStyle=rgba(AG.orange,0.55);for(let i=0;i<5;i++)c.fillRect(-32+k*12,-34+k*8+i*13,i%2?30:46,5);}},
  coins:c=>{for(const [x,y] of [[-30,20],[0,24],[30,20],[-16,4],[16,6],[0,-12]])ag_soft(c,cc=>cc.ellipse(x,y,22,13,0,0,TAU),[196,160,70],[250,226,150],x+6,y-4,20,"rgba(80,60,10,0.4)",3);}};
// the rail's focus over a chapter: keys [[t, year, ppy]]
function dm_railAt(ctx,t,keys,o){const yr=ag_keys(t,keys.map(k=>[k[0],k[1]])),ppy=ag_keys(t,keys.map(k=>[k[0],k[2]||40]));o=o||{};
  return dm_labRail(ctx,Object.assign({focus:yr,ppy,lit:y=>clamp(1-Math.abs(y-yr)/1.5,0,1)},o));}

/* ===== Decades in the making: the chapters =====
   Each chapter is a few shots (ag_shots), cut together with short dissolves. Times inside a chapter come from its cues (when each
   line starts) and the words of its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on
   cards, tabs and pages, at least 28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const dm_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a place's label in the corner, in for a shot: from t0, out at t1
const dm_whereAt=(ctx,t,text,t0,t1,o)=>dm_where(ctx,text,ag_io(t,t0,t1,0.5),o);

// ---- 1 · An idea that waited: books copied by hand, few and full of mistakes; printing's pieces, four hundred years apart; an
//          agent joins Jun's team, and seems to have come from nowhere ----
scene("story",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({
    letter:wAt(sc,"europe","letter by"),slow:wAt(sc,"rare","slow"),rare:wAt(sc,"rare","rare"),held:wAt(sc,"cambridge","held"),books:wAt(sc,"cambridge","a hundred"),
    copy:wAt(sc,"mistakes","copy"),mist:wAt(sc,"mistakes","mistakes"),will:wAt(sc,"old","will change"),four:wAt(sc,"old","four hundred"),
    piece:wAt(sc,"clay","piece"),each:wAt(sc,"clay","each character"),set:wAt(sc,"frame","set them"),printed:wAt(sc,"frame","printed"),again:wAt(sc,"frame","used them"),
    metal:wAt(sc,"korea","cast in metal"),oldest:wAt(sc,"korea","the oldest"),gut:wAt(sc,"mainz","Gootenberg"),together:wAt(sc,"mainz","brought"),
    letters:wAt(sc,"pieces","Letters"),ink:wAt(sc,"pieces","an ink"),press:wAt(sc,"pieces","a press"),paper:wAt(sc,"pieces","and paper"),
    lender:wAt(sc,"fust","a lender"),money:wAt(sc,"fust","the money"),
    two:wAt(sc,"towns","two hundred"),thirty:wAt(sc,"towns","thirty thousand"),cheaper:wAt(sc,"cheaper","cheaper"),readers:wAt(sc,"cheaper","far more"),
    once:wAt(sc,"seemed","all at once"),taken:wAt(sc,"seemed","It had taken"),
    joins:wAt(sc,"agent","joins"),step:wAt(sc,"agent","step by"),fear:wAt(sc,"nowhere","fear"),magic:wAt(sc,"nowhere","magic"),decades:wAt(sc,"ideas","decades"),understand:wAt(sc,"ideas","understand")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the scribe copies a book, letter by letter; the light comes and goes over days of it
    {at:0,place:"dmScribe",keys:[[0,960,540,1],[P.letter-0.6,860,720,1.45],[P.slow,940,600,1.12]],d:1.8,draw:(x,t)=>{
      const p=0.18+0.5*clamp((t-0.5)/(P.rare+1.5),0,1)+0.25*ag_sine(clamp((t-P.slow)/1.6,0,1));const tip=dm_writing(x,(p*3)%1);
      const look=Math.sin(t*1.3)>0.55;dm_scribe(x,t,tip,{look});
      const night=Math.sin(Math.PI*clamp((t-P.slow)/1.8,0,1));if(night>0){x.fillStyle=rgba([40,44,70],0.32*night);x.fillRect(0,0,W,H);}
}},
    // Cambridge's whole library, 122 books on four lecterns
    {at:c.cambridge-0.3,place:"dmLibrary",keys:[[c.cambridge-0.3,330,560,1.9],[P.books-0.4,960,540,1]],d:2.2,draw:(x,t)=>{
      const t0=P.held,dt=(P.books+1.2-t0)/122,n=Math.floor(clamp((t-t0)/dt,0,122));dm_library(x,122,t,t0,dt);
      const a=ag_in(t,P.books-0.6,0.5);if(a>0)ag_textCard(x,760,120,400,{kick:"The whole library",title:dm_num(dm_count(t,t0,P.books+1.2,122))+" books"},{a,k:ag_spr(t,P.books-0.6,0.6)});
}},
    // a line copied, and copied again: the dose and the hour drift
    {at:c.mistakes-0.3,place:"dmTable",keys:[[c.mistakes-0.3,960,540,1],[c.change-0.2,1430,360,1.5]],d:1.8,draw:(x,t)=>{
      dm_sheet(x,0,430,340,-0.04,ag_in(t,c.mistakes-0.2,0.6),0);
      dm_sheet(x,1,960,600,0.03,ag_in(t,P.copy-0.3,0.6),ag_in(t,P.mist,0.6));
      dm_sheet(x,2,1460,340,-0.02,ag_in(t,P.copy+0.5,0.6),ag_in(t,P.mist+0.3,0.6));
      for(const [a,b,t0] of [[[560,470],[690,530],P.copy-0.4],[[1240,540],[1300,470],P.copy+0.4]]){const u=ag_in(t,t0,0.6);if(u<=0)continue;x.save();x.strokeStyle=rgba(AG.ink,0.4*u);x.lineWidth=3;x.setLineDash([8,8]);
        x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(lerp(a[0],b[0],u),lerp(a[1],b[1],u));x.stroke();x.setLineDash([]);ag_arrowHead(x,lerp(a[0],b[0],u),lerp(a[1],b[1],u),Math.atan2(b[1]-a[1],b[0]-a[0]),12,rgba(AG.ink,0.5*u));x.restore();}}},
    // the idea that will change it: Mainz, 1450, and four hundred years before it, China
    {at:c.old-0.3,place:"dmWall",keys:[[c.old-0.3,1300,540,1.45],[P.four-0.3,960,540,1]],d:1.8,draw:(x,t)=>{
      dm_printRail(x,{draw:ag_in(t,c.old-0.4,1.2),lit:[ag_in(t,P.four+0.4,0.6),0,ag_in(t,P.will,0.6)],a:[ag_in(t,P.four+0.2,0.5),ag_in(t,P.four+0.6,0.5),ag_in(t,P.will-0.2,0.5)],span:clamp((t-P.four)/1.0,0,1)});}},
    // Bi Sheng's clay pieces: made, set in the iron frame, inked, printed, lifted out to be used again
    {at:c.clay-0.3,place:"dmBench",keys:[[c.clay-0.3,420,520,1.5],[P.set-0.6,960,540,1]],d:2.0,draw:(x,t)=>{
      const made=0.06+0.94*clamp((t-c.clay)/(P.each-c.clay+1.2),0,1),set=clamp((t-P.set+0.1)/1.6,0,1),inked=ag_in(t,P.printed-0.5,0.5),
        sheet=ag_keys(t,[[P.printed-0.2,0],[P.printed+0.5,1],[P.again-0.3,1],[P.again+0.4,0]]),back=clamp((t-P.again)/1.6,0,1);
      dm_ironPieces(x,made,set,inked*(1-back),back);
      // the sheet slides over the frame, is pressed, and comes back printed
      const [qx,qy,qw,qh]=DM_IRON.paper,[fx,fy,fw,fh]=DM_IRON.frame,sx=lerp(qx,fx-20,ag_sine(sheet)),sy=lerp(qy,fy-30,ag_sine(sheet));
      if(t>P.printed-0.3){x.save();x.shadowColor="rgba(30,18,8,0.3)";x.shadowBlur=20;x.shadowOffsetX=-6;x.shadowOffsetY=8;x.fillStyle=rgba(DM.paper,1);x.fillRect(sx,sy,qw,qh);x.restore();
        dm_printed(x,sx+40,sy+40,qw-80,qh-80,ag_in(t,P.printed+0.6,0.6)*(sheet<0.6||t>P.again?1:0.4),{});}
}},
    // Korea, 1377: metal pieces, and the oldest book printed with them that survives
    {at:c.korea-0.3,place:"dmCloth",keys:[[c.korea-0.3,700,520,1.25],[P.oldest-0.5,1060,520,1.12]],d:2.0,draw:(x,t)=>{
      dm_bronzeTray(x,170,400,ag_in(t,P.metal-0.4,0.6));
      const op=ag_in(t,c.korea+1.4,1.2);dm_threadBook(x,1080,520,op);
      const sp=ag_in(t,P.oldest,1.0);if(sp>0){x.save();x.globalCompositeOperation="soft-light";const g=x.createRadialGradient(1080,520,100,1080,520,900);g.addColorStop(0,rgba([255,250,236],0.5*sp));g.addColorStop(1,rgba([30,24,16],0.6*sp));x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();}
}},
    // Mainz: Gutenberg brings the pieces together, and Fust lends the money
    {at:c.mainz-0.3,place:"dmMainz",keys:[[c.mainz-0.3,900,560,1.3],[P.letters-0.3,960,540,1]],d:2.0,draw:(x,t)=>{
      const lift=ag_in(t,P.together,0.9);dm_pressBar(x,0.5+0.5*Math.sin(t*0.8));
      ag_person(x,DM_PEOPLE.gutenberg,420,640,1.0,{t,pose:"hang",pose2:"hold",mix:lift,nod:0.06*lift,gaze:[3,2+lift],hold:(cc,h)=>{if(lift<0.5)return;cc.save();cc.translate(h.near[0]+40,h.near[1]-150);cc.rotate(-0.08);dm_page42(cc,0,0,170,ag_in(t,P.together+0.4,0.4));cc.restore();}});
      const fu=ag_in(t,P.lender-0.5,1.0);if(fu>0)ag_person(x,DM_PEOPLE.fust,1580+(1-ag_eo(fu))*380,640,1.0,{t,flip:true,pose:"hang",pose2:"hold",mix:ag_in(t,P.money-0.4,0.6),hold:(cc,h)=>{cc.save();cc.translate(h.near[0]+70,h.near[1]+10);dm_icon(cc,"purse");cc.restore();}});
      const PC=[["sorts","Metal letters","all alike",P.letters],["ink","Ink that clings","",P.ink],["press","A press","like a wine press",P.press],["paper","Paper","made in Germany",P.paper],["purse","A lender","Johann Fust",P.lender]];
      PC.forEach((p,i)=>dm_piece(x,90+i*352,70,320,p[0],p[1],p[2],ag_in(t,p[3]-0.2,0.4),ag_spr(t,p[3]-0.2,0.6)));
}},
    // by 1500: presses in more than two hundred towns, thirty thousand books, cheaper, for far more readers
    {at:c.towns-0.3,place:"dmMap",keys:[[c.towns-0.3,820,460,1.6],[c.towns+0.4,960,540,1]],d:2.4,draw:(x,t)=>{
      const yr=ag_keys(t,[[c.towns+0.2,1450],[P.thirty+0.6,1500]],u=>u);dm_towns(x,yr,{glow:ag_in(t,P.readers-0.3,1.6)});
      ag_pill(x,1560,300,String(Math.floor(yr)),{size:36,a:ag_in(t,c.towns+1.8,0.5)});
      const t2=Math.max(P.two-0.2,c.towns+2.7),a=ag_in(t,t2,0.5);if(a>0)ag_textCard(x,1220,380,650,{kick:"By 1500",title:"Presses in more than 200 towns",sub:ag_in(t,P.thirty-0.2,0.4)>0?"Some 30,000 different books":""},{a,k:ag_spr(t,t2,0.6)});
      const b=ag_in(t,P.cheaper-0.2,0.5);if(b>0)ag_textCard(x,1220,620,650,{title:"Cheaper books, far more readers"},{a:b,k:ag_spr(t,P.cheaper-0.2,0.6)});}},
    // it seemed to arrive all at once: close on 1450, then back out over four hundred years
    {at:c.seemed-0.3,place:"dmWall",keys:[[c.seemed-0.3,1493,430,2.4],[P.taken-0.2,960,540,1]],d:2.2,draw:(x,t)=>{
      dm_printRail(x,{lit:[ag_in(t,P.taken+0.6,0.5),ag_in(t,P.taken+0.4,0.5),1],span:clamp((t-P.taken-0.6)/1.0,0,1),spanText:"About 400 years"});}},
    // this term an agent joins Jun's team; some fear it, some expect magic; its ideas are decades old
    {at:c.agent-0.3,place:"dmLab",keys:[[c.agent-0.3,1100,560,1.25],[c.nowhere-0.2,960,540,1],[P.decades-0.4,960,470,1.08]],d:2.0,draw:(x,t)=>{
      const doing=clamp((t-P.step+0.2)/2.2,0,3)*1.0;
      dm_team(x,{t,agent:clamp((t-P.joins+0.3)/0.9,0,1),think:ag_io(t,P.step-0.4,c.nowhere,0.5),yusuf:ag_in(t,c.nowhere-0.2,0.8),mei:ag_in(t,c.nowhere,0.8),
        ySmile:0.05,mSmile:0.55,junSmile:0.35,screen:(cx,sx,sy,sw,sh)=>{cx.fillStyle=rgba(AG.violet,0.12*ag_io(t,P.step-0.4,c.nowhere,0.5));cx.fillRect(sx,sy,sw,sh);}});
      dm_tasks(x,1490,250,doing*3/3,ag_io(t,P.step-0.5,c.nowhere-0.1,0.5));
      const cardsA=1-ag_in(t,P.decades-0.4,0.6);
      const f=ag_in(t,P.fear-0.2,0.5)*cardsA;if(f>0)ag_textCard(x,120,180,300,{title:"Danger?"},{a:f,k:ag_spr(t,P.fear-0.2,0.6),tail:{side:"bottom",at:0.35,px:250,py:300}});
      const m=ag_in(t,P.magic-0.2,0.5)*cardsA;if(m>0)ag_textCard(x,1540,180,300,{title:"Magic?"},{a:m,k:ag_spr(t,P.magic-0.2,0.6),tail:{side:"bottom",at:0.6,px:1700,py:300}});
      dm_labRail(x,{focus:1991,ppy:24,draw:ag_in(t,P.decades-0.6,2.0),a:ag_in(t,P.decades-0.6,0.4),show:[1958,1986,2012,2022],flat:true,
        tabA:y=>ag_in(t,P.decades-0.4+(y-1958)/66*1.8,0.4),lit:y=>y===1958?ag_io(t,P.decades,P.understand+0.4,0.5):0});}}
  ],0.6);
  // each past scene's place and year, in the corner of the screen (not of the place, so the camera doesn't move it)
  for(const [s_,t0,t1,col] of [["Europe · the 1440s",0.8,P.rare+0.8],["Cambridge · 1424",c.cambridge+0.2,c.mistakes-0.2],["China · the 1040s",c.clay,c.korea-0.4],
    ["Korea · 1377",c.korea,c.mainz-0.4],["Mainz · around 1450",c.mainz,P.letters-0.3]])dm_whereAt(ctx,t,s_,t0,t1,col?{col}:null);
  ag_title(ctx,S,t,c.breath+0.4,"Decades in the making","Where AI agents came from","FILM 1 OF 9 · WHAT AN AGENT IS");
});

// ---- 2 · A machine that learns: 1958, the perceptron; the newspaper's hopes; 1969, what one layer can't learn ----
// a trial of the perceptron: which card, its guess, right or wrong (the first few wrong more often, then right)
// the trials, in three parts: six shown one by one, then forty-three in a rush (the card hidden, the dials turning), then the fiftieth, right
const DM_TRY=[1.7,1.4,1.05,1.05,1.05,1.05],DM_WRONG=[1,1,0,1,0,1];
const dm_dial0=i=>[-0.9,0.5,1.4,-0.2,2.2,-1.5][i],dm_nudge=(k,i)=>{const r=ag_rnd(k*17+i*5+3);return (r()-0.5)*0.9;},dm_dialEnd=i=>[0.3,-0.8,0.6,1.7,-0.4,0.9][i];
function dm_trials(t,tA,tB,tC){const ends=[];let e=tA;for(const d of DM_TRY){e+=d;ends.push(e);}
  // the dials after k of the first trials
  const after=(k,i)=>{let v=dm_dial0(i);for(let q=0;q<k;q++)if(DM_WRONG[q])v+=dm_nudge(q,i);return v;};
  if(t<tA)return{k:-1,show:0,dial:i=>dm_dial0(i),nudge:0};
  if(t<ends[5]){let k=0;while(t>=ends[k])k++;const t0=k?ends[k-1]:tA,d=DM_TRY[k],f=(t-t0)/d,card=[0,1,1,0,1,0][k],wrong=DM_WRONG[k];
    const show=ag_in(f,0.02,0.2)*(1-ag_in(f,0.9,0.1)),guess=f>0.42?(wrong?1-card:card):null,right=f>0.58?!wrong:null,nf=wrong?ag_sine(clamp((f-0.62)/0.3,0,1)):0;
    return{k,card,show,guess,right,tries:k+1,nudge:wrong?Math.sin(Math.PI*clamp((f-0.6)/0.36,0,1)):0,dial:i=>after(k,i)+(wrong?dm_nudge(k,i)*nf:0)};}
  if(t<tC){const u=clamp((t-ends[5])/(tC-ends[5]),0,1),n=Math.round(lerp(7,49,ag_sine(u)));return{k:n-1,show:0,tries:n,nudge:0,dial:i=>lerp(after(6,i),dm_dialEnd(i),ag_sine(u))+Math.sin(t*9+i)*0.06*Math.sin(Math.PI*u)};}
  const f=(t-tC)/1.1;return{k:49,card:0,show:ag_in(f,0,0.2),guess:f>0.42?0:null,right:f>0.58?true:null,tries:50,nudge:0,dial:i=>dm_dialEnd(i)};}

// ---- 2 · A machine that learns: July 1958, the perceptron shown to reporters; fifty tries; the newspaper's hopes; one layer's limit ----
scene("learns",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({rep:wAt(sc,"navy","reporters"),perc:wAt(sc,"navy","perceptron"),frank:wAt(sc,"navy","Frank"),shown:wAt(sc,"cards","Shown"),
    nudged:wAt(sc,"cards","nudged"),fifty:wAt(sc,"fifty","fifty"),apart:wAt(sc,"fifty","tell them apart"),paper:wAt(sc,"paper","newspaper"),walk:wAt(sc,"paper","walk"),
    conscious:wAt(sc,"paper","conscious"),single:wAt(sc,"layer","single layer"),some:wAt(sc,"layer","some patterns"),book:wAt(sc,"layer","a book"),money:wAt(sc,"layer","money")}));
  const MX=470,MY=330;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,488,1.107],[c.road+0.4,960,540,1],[c.cards-1.4,780,610,1.32],[P.paper-2.2,960,540,1]],d:2.0,draw:(x,t)=>{
    dm_railAt(x,t,[[0,1991,24],[0.7,1991,24],[2.5,1958,40],[P.book-0.8,1958,40],[P.book+0.8,1969,40]],{draw:1,tabA:y=>[1958,1986,2012,2022].includes(y)?1:ag_in(t,0.9,0.6),flat:t<0.9});
    const T=dm_trials(t,P.shown+0.1,P.fifty-0.4,P.apart-0.9),off=ag_in(t,P.money,1.2),on=ag_in(t,P.perc-0.1,0.6)*(1-off);
    // Frank Rosenblatt shows it; two reporters watch, a camera flashes
    const sad=ag_in(t,P.single,1.0);
    ag_person(x,DM_PEOPLE.y1958,250,620,0.92,{t,pose:"hang",pose2:"explain",mix:ag_io(t,P.frank-0.3,P.paper-0.4,0.8),smile:0.45*(1-sad)+0.05,gaze:[4,1+2*sad],nod:0.06*sad});
    const fl=[P.rep+0.15,P.rep+0.85,P.perc+0.7].reduce((m,f)=>Math.max(m,t>=f&&t<f+0.5?1-(t-f)/0.5:0),0),ra=1-ag_in(t,P.fifty,0.8);
    if(ra>0){x.save();x.globalAlpha*=ra;ag_person(x,DM_PEOPLE.reporter,1800,668,0.84,{t,flip:true,pose:"hold",hold:(c2,h)=>dm_notebook(c2,h),gaze:[3,2],smile:0.15});
      ag_person(x,DM_PEOPLE.press,1570,668,0.84,{t,flip:true,pose:"hold",hold:(c2,h)=>dm_pressCamera(c2,h,fl),gaze:[3,1]});x.restore();}
    const lit=off<0.4;dm_perceptron(x,MX,MY,{on,card:T.card||0,show:T.show*(1-off),guess:lit?T.guess:null,right:lit?T.right:null,dial:T.dial,nudge:T.nudge,tries:T.k>=0?T.tries:null});
    if(fl>0){x.save();x.setTransform(1,0,0,1,0,0);x.fillStyle="rgba(255,252,240,"+(0.22*fl)+")";x.fillRect(0,0,x.canvas.width,x.canvas.height);x.restore();}
    if(t>P.apart-0.2)ag_verdict(x,MX+160,MY-44,"Tells left from right","pass",ag_io(t,P.apart-0.2,P.single,0.4));
    // the newspaper the next day
    dm_clipping(x,1210+(1-ag_eo(ag_in(t,P.paper-0.2,0.7)))*60,300,ag_io(t,P.paper-0.2,P.single-0.2,0.6),ag_in(t,P.walk,0.5));
    // 1969: one straight line can't split this pattern; a book shows it; the money goes elsewhere
    const xa=ag_in(t,P.single,0.7),tr=t-P.single;
    dm_xor(x,1420,452,300,-0.6+Math.sin(tr*1.3)*0.75,Math.sin(tr*0.9)*46,xa,ag_in(t,P.some+0.6,0.4));
    ag_verdict(x,1474,684,"No straight line splits them","fail",xa*ag_in(t,P.some+0.6,0.5));
    dm_bookCover(x,1640,280+(1-ag_eo(ag_in(t,P.book-0.2,0.7)))*30,"Perceptrons","1969",ag_in(t,P.book-0.2,0.6));
    dm_coinsAway(x,860,840,clamp((t-P.money)/1.8,0,1));}}],0.6);});

// ---- 3 · Learning from mistakes: 1986, a network of layers guesses, measures its error, passes it back; twenty years small ----
const DM_NET1=[3,5,5,2];
scene("mistakes",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({three:wAt(sc,"layers","three researchers"),several:wAt(sc,"layers","several layers"),guessW:wAt(sc,"guess","guess"),wrong:wAt(sc,"guess","how wrong"),
    passed:wAt(sc,"back","passed back"),nudged:wAt(sc,"back","nudged"),smaller:wAt(sc,"back","smaller"),many:wAt(sc,"patterns","many examples"),between:wAt(sc,"patterns","in between"),
    noone:wAt(sc,"patterns","no one"),slow:wAt(sc,"small","slow"),few:wAt(sc,"small","few"),twenty:wAt(sc,"small","twenty years")}));
  const PX=560,PY=340,PW=1280,PH=510,NX=900,NY=430,NW=540,NH=340;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,540,1.025],[0.3,960,540,1]],d:2.0,draw:(x,t)=>{
    const RX=dm_railAt(x,t,[[0,1969,40],[0.7,1969,40],[2.3,1986,40],[P.twenty+0.2,1986,40],[P.twenty+2.2,2006,40]]);
    // twenty years: a bracket under the rail from 1986, drawn as the rail moves on
    if(t>P.twenty){const x0=RX(1986),x1=RX(2006),u=ag_in(t,P.twenty+0.2,2.0);
      x.save();x.strokeStyle=rgba(AG.ink,0.5);x.lineWidth=3;x.lineCap="round";x.beginPath();x.moveTo(x0,282);x.lineTo(lerp(x0,x1,u),282);x.stroke();x.restore();ag_pill(x,(x0+x1)/2,282,"Twenty years",{a:ag_in(t,P.twenty+0.8,0.6)});}
    // the paper, pinned to the wall; later, a computer of the time, slow
    const pa=ag_in(t,P.three-0.4,0.6)*(1-ag_in(t,P.slow-0.6,0.6));
    dm_paperSheet(x,110,330+(1-ag_eo(ag_in(t,P.three-0.4,0.7)))*24,"Learning representations by back-propagating errors","1986",pa,{w:360,h:470,size:30});
    const ca=ag_in(t,P.slow-0.3,0.8);if(ca>0){ag_desk(x,60,760,440,{depth:70});dm_oldComputer(x,130,470+(1-ag_eo(ca))*20,clamp((t-P.slow)/30,0,1)*0.42+0.05,ca);}
    // the network on its panel
    const na=ag_in(t,c.layers+0.4,0.8),dim=1-0.3*ag_in(t,P.twenty,1.0);dm_panel(x,PX,PY,PW,PH,na);if(na<=0)return;
    const fwd=clamp((t-P.guessW+0.1)/1.3,0,1),back=clamp((t-P.passed)/2.2,0,1),many=clamp((t-P.many)/(P.slow-P.many),0,1),nud=ag_sine(back);
    const wt=(l,i,j)=>{const r=ag_rnd(l*31+i*7+j*3+1);const w0=r(),w1=r(),w2=r();return lerp(lerp(w0,w1,nud),w2,ag_sine(many));};
    const ex=many>0&&many<1?Math.floor(many*14):-1,exCard=ex>=0?(ex*7+3)%2:0;
    const lit=(l,i)=>l===0?(fwd>0?0.85:0.3):(l===1||l===2)?0.3+0.55*ag_in(t,P.between,0.6)*((i*3+l)%4!==0?1:0.25):(l===3?(fwd>=1&&many<=0?(i===1?0.95:0.3):(ex>=0?(i===exCard?0.9:0.3):0.3)):0.3);
    x.save();x.globalAlpha*=na*dim;const Pn=dm_net(x,NX,NY,NW,NH,DM_NET1,{fwd,back,wt,lit,r:26});
    // the input: a card marked on the left (then many examples, each marked left or right); the outputs: Left and Right
    const ia=ag_in(t,P.guessW-0.6,0.5);if(ia>0){const card=ex>=0?exCard:0,sl=ex>=0?ag_eo(clamp((many*14-ex)/0.35,0,1)):1;x.save();x.globalAlpha*=ia;
      x.translate((1-sl)*-60,0);x.globalAlpha*=sl;x.fillStyle="#FBFAF6";x.shadowColor="rgba(46,38,28,0.25)";x.shadowBlur=12;x.fillRect(PX+50,NY+NH/2-75,190,150);x.shadowColor="transparent";
      x.fillStyle=rgba(DM.ink,0.85);x.beginPath();x.arc(PX+50+(card?140:50),NY+NH/2,32,0,TAU);x.fill();x.restore();
      ag_T(x,ex>=0?"Examples":"Shown",PX+145,NY+NH/2+120,{w:600,size:28,align:"center",col:AG.mut,a:ia});}
    for(const [i,lab] of [[0,"Left"],[1,"Right"]]){const [ox,oy]=Pn[3][i];ag_T(x,lab,ox+44,oy+11,{w:700,size:30,col:lit(3,i)>0.6?AG.violet:AG.ink});}
    // how wrong: an amber bar the error, passed back, makes smaller
    const ea=ag_io(t,P.wrong-0.3,P.many+0.4,0.4);if(ea>0){const ew=lerp(250,50,ag_in(t,P.smaller-0.3,1.4));x.save();x.globalAlpha*=ea;
      ag_T(x,"How wrong",1590,NY+40,{w:700,size:30});x.fillStyle=rgba([226,222,214],1);rr(x,1590,NY+64,250,28,14);x.fill();x.fillStyle=rgba(AG.amber,0.9);rr(x,1590,NY+64,ew,28,14);x.fill();x.restore();}
    // the layers in between, and the patterns they found
    const ba=ag_io(t,P.between-0.3,P.slow,0.5);if(ba>0){const xa=Pn[1][0][0],xb=Pn[2][0][0],yb=NY-44;x.save();x.globalAlpha*=ba;x.strokeStyle=rgba(AG.violet,0.6);x.lineWidth=3;
      x.beginPath();x.moveTo(xa-30,yb+12);x.lineTo(xa-30,yb);x.lineTo(xb+30,yb);x.lineTo(xb+30,yb+12);x.stroke();x.restore();ag_T(x,"Layers in between",(xa+xb)/2,yb-14,{w:700,size:30,align:"center",col:AG.violet,a:ba});}
    [[1,1],[2,1],[1,3],[2,3]].forEach(([l,i],k)=>{const [nx,ny]=Pn[l][i];dm_pattern(x,nx+(l===1?-90:90),ny,DM_PATTERNS[k],ag_io(t,P.noone-0.3+k*0.3,P.slow+0.4,0.4));});
    x.restore();}}],0.6);});

// ---- 4 · The power to run: 2012, a far bigger network, a million labelled photos, two graphics chips, and a contest ----
const DM_NET2=[5,9,9,9,9,6,3];
scene("power",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({pieces:wAt(sc,"together","the pieces"),team:wAt(sc,"photos","A team"),bigger:wAt(sc,"photos","much bigger"),million:wAt(sc,"photos","a million"),
    two:wAt(sc,"chips","two graphics"),games:wAt(sc,"chips","video games"),hundreds:wAt(sc,"chips","hundreds"),contest:wAt(sc,"contest","image contest"),fifteen:wAt(sc,"contest","fifteen"),
    nextW:wAt(sc,"next","next best"),twenty:wAt(sc,"next","twenty-six"),old:wAt(sc,"new","were old"),newW:wAt(sc,"new","What was new")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,540,1.025],[0.3,960,540,1]],d:2.0,draw:(x,t)=>{
    dm_railAt(x,t,[[0,2006,40],[0.7,2006,40],[2.3,2012,40]]);
    // the three pieces come together; they come back at the end, the ideas old, the data and the power new
    const PC=[["net","The ideas","1958 · 1986"],["photos","Data","labelled photos"],["chip","Power","graphics chips"]],back=ag_in(t,c.new-0.2,0.6),away=1-ag_in(t,P.team-0.4,0.5);
    PC.forEach((p,i)=>{const t0=back>0?c.new-0.2+i*0.12:P.pieces-0.1+i*0.15,u=ag_spr(t,t0,0.7),gx=back>0?280+i*480:lerp([-300,700,1800][i],280+i*480,clamp(u,0,1.1));
      const a=back>0?ag_in(t,t0,0.4):ag_in(t,t0,0.4)*away,cold=i===0?ag_in(t,P.old,0.5)*back:0,hot=i>0?ag_in(t,P.newW+0.2,0.5)*back:0;
      dm_piece(x,gx,400,400,p[0],p[1],p[2],a*(1-0.4*cold),u);if(cold>0)ag_pill(x,gx+200,690,"Old",{size:32,a:cold});if(hot>0)ag_pill(x,gx+200,690,"New",{size:32,a:hot,col:AG.green});});
    // the panel: labelled photos flow into a far bigger network, run on two graphics chips
    const pa=ag_io(t,P.team-0.3,c.new-0.4,0.6);dm_panel(x,120,350,1680,500,pa);if(pa<=0)return;
    const na=ag_io(t,P.team-0.2,c.contest-0.3,0.6);if(na>0){x.save();x.globalAlpha*=na;const g=ag_in(t,P.bigger-0.3,1.2);
      if(g<1){x.save();x.globalAlpha*=1-g;dm_net(x,860,460,360,300,DM_NET1,{r:22});x.restore();}
      if(g>0){x.save();x.globalAlpha*=g;ag_about(x,1040,590,lerp(0.7,1,ag_eo(g)));dm_net(x,820,420,440,370,DM_NET2,{r:14,fwd:t>P.million?((t-P.million)*0.45)%1:0,lit:(l,i)=>0.35+0.3*Math.sin(t*2+l+i*0.7)});x.restore();}
      // photos, a million and more, a few of them flying in
      const n=Math.min(24,Math.floor(clamp((t-P.million+0.6)/1.4,0,1)*24));dm_photos(x,170,446,n,1);ag_pill(x,430,400,"More than a million labelled photos",{a:ag_in(t,P.million,0.5)});
      if(t>P.million+0.8){for(let k=0;k<4;k++){const u=((t-P.million-0.8)*0.5+k/4)%1,px=lerp(700,800,ag_sine(u)),py=lerp(470+k*80,590,ag_sine(u));x.save();x.globalAlpha*=Math.sin(Math.PI*u)*0.9;
        x.fillStyle="#fff";x.fillRect(px-24,py-18,48,36);x.fillStyle=rgba([[96,140,170],[150,170,110],[190,140,90],[170,120,150]][k],1);x.fillRect(px-20,py-14,40,22);x.restore();}}
      // two graphics chips, made for games, doing hundreds of small sums at once
      const ch=ag_in(t,P.two-0.2,0.6),wave=t>P.hundreds?((t-P.hundreds)*0.7)%1:null;
      dm_chip(x,1400,452,0.92,wave,ch);dm_chip(x,1400,640,0.92,wave==null?null:(wave+0.3)%1,ch);ag_pill(x,1540,400,"Graphics chips, made for games",{a:ch*ag_in(t,P.games-0.2,0.5)});
      if(wave!=null){x.save();x.globalAlpha*=ch*0.8;x.strokeStyle=rgba(AG.blue,0.5);x.lineWidth=4;x.setLineDash([10,10]);x.lineDashOffset=-t*40;
        for(const cy of [530,720]){x.beginPath();x.moveTo(1390,cy);x.quadraticCurveTo(1320,cy,1290,590);x.stroke();}x.setLineDash([]);x.restore();}
      x.restore();}
    // the contest: its five best guesses missed 15 in a hundred; the next best entry, 26
    const ga=ag_io(t,P.contest-0.2,c.new-0.4,0.6);if(ga>0){ag_T(x,"Its five best guesses missed the answer",960,420,{w:700,size:34,align:"center",a:ga});
      dm_hundred(x,380,452,15,ga,clamp((t-P.fifteen+0.6)/1.0,0,1));dm_hundred(x,1200,452,26,ga*ag_in(t,P.nextW-0.3,0.5),clamp((t-P.twenty+0.6)/1.0,0,1));
      ag_T(x,"This network: 15 in 100",548,836,{w:700,size:32,align:"center",a:ga*ag_in(t,P.fifteen,0.4)});ag_T(x,"Next best: 26 in 100",1368,836,{w:700,size:32,align:"center",a:ga*ag_in(t,P.twenty,0.4)});}}}],0.6);});

// ---- 5 · Attention: 2017, read all the words at once and learn which matter to each other ----
const DM_SENT=["The","team","fixed","the","report","because","it","was","wrong"];
scene("attention",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({called:wAt(sc,"paper","Attention Is"),read:wAt(sc,"paper","read"),one:wAt(sc,"before","one word"),
    design:wAt(sc,"once","transformer"),all:wAt(sc,"once","all the words"),which:wAt(sc,"once","which matter"),itW:wAt(sc,"report","it learns"),isW:wAt(sc,"report","is the report"),
    splits:wAt(sc,"bigger","splits"),many:wAt(sc,"bigger","many chips"),grow:wAt(sc,"bigger","grow")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,540,1.025],[0.3,960,540,1]],d:2.0,draw:(x,t)=>{
    dm_railAt(x,t,[[0,2012,40],[0.7,2012,40],[2.3,2017,40]]);
    // the paper, then set aside on the left
    const side=ag_in(t,c.before-0.6,1.2),sa=ag_in(t,P.called-0.6,0.6);if(sa>0){x.save();x.translate(lerp(770,90,ag_sine(side)),lerp(350+(1-ag_eo(sa))*24,370,ag_sine(side)));x.scale(lerp(1,0.88,ag_sine(side)),lerp(1,0.88,ag_sine(side)));
      dm_paperSheet(x,0,0,"Attention Is All You Need","2017",sa);x.restore();}
    // one word at a time, then all at once, then which matter to each other
    const pa=ag_io(t,c.before-0.3,P.splits+0.2,0.6);dm_panel(x,520,350,1320,500,pa);
    if(pa>0){const seq=t<P.all-0.2,cur=Math.floor((t-P.one+0.2)/0.42);
      const on=i=>seq?(i===cur?1:(i<cur?0.35:0.12)):(t<P.itW-0.2?ag_in(t,P.all-0.2,0.4):(i===4||i===6?1:0.3+0.7*(1-ag_in(t,P.itW-0.2,0.6))));
      const arcs=[];if(!seq){const base=ag_io(t,P.all,P.itW+0.4,0.5),r=ag_rnd(9);for(let i=0;i<9;i++)for(let j=i+1;j<9;j++)if(r()<0.32)arcs.push([i,j,base*(0.15+r()*0.5)]);
        const it=ag_in(t,P.itW-0.2,0.6);if(it>0){arcs.push([4,6,it]);arcs.push([1,6,it*0.22]);arcs.push([6,8,it*0.16]);}}
      const M=dm_sentence(x,1180,750,DM_SENT,{on,arcs,arcH:0.3,size:36,center:true,a:pa});
      // the reader: a mark under the word being read, one at a time
      if(seq&&cur>=0&&cur<9&&t>P.one-0.4){const [mx]=M[cur];x.save();x.globalAlpha*=pa;x.fillStyle=rgba(AG.violet,0.9);rr(x,mx-24,792,48,6,3);x.fill();x.restore();}}
    // the work split across many chips, and a model that grows far bigger
    const ba=ag_in(t,P.splits-0.2,0.6);if(ba>0){for(let k=0;k<8;k++){const u=ag_in(t,P.many-0.5+k*0.08,0.5);dm_chip(x,520+k*160,720,0.42,(t*0.8+k*0.1)%1,ba*u);}
      const g=ag_in(t,P.grow-0.3,1.6),R=lerp(60,160,ag_eo(g));ag_modelLight(x,1190,525,R,0.5*ba);ag_model(x,1190,525,R,{t,core:0.7,think:0.4,a:ba,label:g>0.6?"Model":null});
      x.save();x.globalAlpha*=ba*0.6;x.strokeStyle=rgba(AG.blue,0.5);x.lineWidth=3;x.setLineDash([8,10]);x.lineDashOffset=-t*30;for(let k=0;k<8;k++){const cx=520+k*160+63;x.beginPath();x.moveTo(cx,716);x.quadraticCurveTo(cx,650,1190,525+R*0.7);x.stroke();}x.setLineDash([]);x.restore();}}}],0.6);});

// ---- 6 · The written web: 2018 to 2020, guess the next word, billions of times; 175 billion numbers; but it only carried on ----
const DM_MORE=["How do I change my email?","How do I delete my account?","How do I contact support?"];
scene("web",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({huge:wAt(sc,"text","huge"),guessW:wAt(sc,"task","guess the next"),check:wAt(sc,"task","check it"),adjust:wAt(sc,"task","adjust"),
    billions:wAt(sc,"billions","Billions"),grammar:wAt(sc,"billions","grammar"),facts:wAt(sc,"billions","facts"),ways:wAt(sc,"billions","ways of writing"),
    hundred:wAt(sc,"largest","a hundred and seventy-five"),fluently:wAt(sc,"help","fluently"),help:wAt(sc,"help","trying to help"),carried:wAt(sc,"help","carried on")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,540,1.025],[0.3,960,540,1]],d:2.0,draw:(x,t)=>{
    dm_railAt(x,t,[[0,2017,40],[0.7,2017,40],[2.3,2020,40]]);
    const big=ag_in(t,P.hundred-0.4,1.8),R=lerp(118,178,ag_eo(big)),mx=1450,my=560;
    // text from the web and books, flowing in
    const fa=ag_io(t,c.text,c.task+0.6,0.8)+0.6*ag_io(t,P.billions,c.largest,0.6);dm_textIn(x,mx,my,t,fa);
    ag_pill(x,470,380,"Text from the web and books",{a:ag_io(t,P.huge-0.2,c.task,0.5)});
    ag_modelLight(x,mx,my,R,0.6);ag_model(x,mx,my,R,{t,core:0.7,think:ag_io(t,P.guessW,P.adjust+1.2,0.4)});
    // guess the next word, check it, adjust
    const ta=ag_io(t,c.task-0.3,c.largest-0.3,0.5);if(ta>0){const filled=ag_in(t,P.guessW+0.4,0.4);x.save();x.globalAlpha*=ta;ag_box(x,140,430,760,130,22,{});
      ag_T(x,"The data team fixed the",184,512,{w:700,size:38});const bx=184+ag_tw(x,"The data team fixed the ",{w:700,size:38});
      x.strokeStyle=rgba(AG.violet,0.8);x.lineWidth=3;x.beginPath();x.moveTo(bx,524);x.lineTo(bx+140,524);x.stroke();if(filled>0)ag_T(x,"report",bx,512,{w:700,size:38,col:AG.violet,a:filled});
      if(t>P.check)ag_tick(x,bx+176,496,30,rgba(AG.green,ag_in(t,P.check,0.3)),5);
      const steps=[["Guess",P.guessW,AG.violet],["Check",P.check,AG.green],["Adjust",P.adjust,AG.blue]],cyc=t>P.billions?Math.floor((t-P.billions)*3)%3:-1;
      steps.forEach(([s2,t0,col],i)=>{const on=cyc>=0?cyc===i:t>t0-0.2&&t<(steps[i+1]?steps[i+1][1]-0.2:t0+1.4);ag_pill(x,260+i*250,650,s2,{size:32,a:ag_in(t,t0-0.2,0.4),col:on?col:null});
        if(i<2){x.save();x.globalAlpha*=ag_in(t,steps[i+1][1]-0.3,0.4);ag_arrowHead(x,260+i*250+170,650,0,12,rgba(AG.label,0.7));x.restore();}});x.restore();}
    // billions of times: grammar, facts, ways of writing, taken in
    const ba=ag_io(t,P.billions-0.2,c.help-0.3,0.5);if(ba>0){ag_pill(x,520,372,dm_num(Math.round(Math.pow(10,lerp(0,9,ag_eo(clamp((t-P.billions)/1.8,0,1))))))+" times",{size:34,a:ba*(1-ag_in(t,P.hundred+0.6,0.6))});
      [["Grammar",P.grammar],["Facts",P.facts],["Ways of writing",P.ways]].forEach(([s2,t0],i)=>{const inA=ag_in(t,c.largest-0.2+i*0.15,0.9),px=lerp(1080,mx,ag_sine(inA)),py=lerp(440+i*100,my,ag_sine(inA));
        x.save();ag_about(x,px,py,1-1.2*Math.max(0,inA-0.5));ag_pill(x,px,py,s2,{size:32,a:ba*ag_in(t,t0-0.1,0.4)*(1-sstep(0.5,0.7,inA)),col:AG.violet});x.restore();});}
    // a hundred and seventy-five billion numbers to tune
    const na=ag_io(t,P.hundred-0.2,c.help-0.2,0.6);if(na>0){x.save();x.globalAlpha*=na;ag_box(x,mx-350,768,700,92,20,{});
      for(let k=0;k<4;k++){const dx=mx-308+k*44,dy=814;x.fillStyle="#fff";x.beginPath();x.arc(dx,dy,17,0,TAU);x.fill();x.strokeStyle=rgba(AG.label,0.4);x.lineWidth=2;x.stroke();
        const an=Math.sin(t*1.7+k*1.3)*1.4;x.strokeStyle=rgba(AG.blue,0.95);x.lineWidth=4;x.beginPath();x.moveTo(dx,dy);x.lineTo(dx+Math.sin(an)*12,dy-Math.cos(an)*12);x.stroke();}
      ag_T(x,"175,000,000,000 numbers to tune",mx+96,826,{w:700,size:32,align:"center"});x.restore();}
    // it wrote fluently, but only carried on the text
    const ha=ag_in(t,c.help-0.3,0.6);if(ha>0){x.save();x.globalAlpha*=ha;ag_box(x,140,400,780,300,22,{});ag_T(x,"How do I reset my password?",184,470,{w:800,size:34});
      const ty=clamp((t-P.fluently)/(P.carried-P.fluently+0.4),0,1),all=DM_MORE.join("\n"),n=Math.floor(all.length*ty);let shown=all.slice(0,n).split("\n");
      shown.forEach((l,i)=>ag_T(x,l,184,540+i*50,{w:500,size:32,col:AG.violet}));
      if(ty<1&&Math.floor(t*2.5)%2===0){const lx=184+ag_tw(x,shown[shown.length-1]||"",{w:500,size:32});x.fillStyle=rgba(AG.violet,0.9);x.fillRect(lx+4,510+(shown.length-1)*50,3,38);}
      x.restore();ag_verdict(x,530,780,"It only carried on the text","loop",ag_in(t,P.carried-0.2,0.5));}}}],0.6);});

// ---- 7 · Helpful, with hands: 2022, people rank answers; 2024, steps before an answer; tools; a loop: an agent ----
const DM_ANS=[["Here is how to reset it: go to","Settings, then Password."],["Passwords can be reset","in several ways."],["How do I change my email?"]];
scene("helpful",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({rank:wAt(sc,"rank","rank"),best:wAt(sc,"rank","best"),trained:wAt(sc,"trained","trained"),preferred:wAt(sc,"trained","preferred"),
    smallerW:wAt(sc,"smaller","preferred"),hundred:wAt(sc,"smaller","a hundred times"),step:wAt(sc,"steps","step by step"),before:wAt(sc,"steps","before they answer"),
    tools:wAt(sc,"tools","tools"),search:wAt(sc,"tools","search"),query:wAt(sc,"tools","run a query"),file:wAt(sc,"tools","read a file"),back:wAt(sc,"tools","what comes back"),
    reasons:wAt(sc,"agent","reasons"),hands:wAt(sc,"agent","hands"),loop:wAt(sc,"agent","in a loop"),agentW:wAt(sc,"agent","an agent")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,540,1.025],[0.3,960,540,1]],d:2.0,draw:(x,t)=>{
    dm_railAt(x,t,[[0,2020,40],[0.7,2020,40],[2.3,2022,40],[c.steps-0.6,2022,40],[c.steps+1.0,2024,40]]);
    // people rank a model's answers, from best to worst
    const ra=ag_io(t,c.rank-0.3,c.smaller-0.9,0.6);if(ra>0){x.save();x.globalAlpha*=ra;ag_person(x,DM_PEOPLE.rater,300,620,0.92,{t,pose:"hang",pose2:"point",mix:ag_in(t,P.rank-0.2,0.8),gaze:[4,1],smile:0.3});
      DM_ANS.forEach((a2,i)=>{const rk=ag_in(t,P.best-0.6+i*0.55,0.3)>0.5?i+1:0;dm_answer(x,640,370+i*150,580,a2,rk,{edge:rk===1?AG.green:null,a:ag_in(t,c.rank+0.2+i*0.2,0.4)});});x.restore();}
    // trained on the answers people preferred
    const ma=ag_io(t,c.rank+0.4,c.smaller-0.9,0.6),glow=ag_in(t,P.preferred-0.2,0.8);if(ma>0){ag_modelLight(x,1560,560,100,ma*(0.4+0.5*glow));ag_model(x,1560,560,100,{t,core:0.5+0.5*glow,a:ma});}
    const fb=ag_io(t,P.trained-0.3,c.smaller-0.9,0.4);if(fb>0){x.save();x.globalAlpha*=fb;x.strokeStyle=rgba(AG.green,0.8);x.lineWidth=4;x.setLineDash([12,10]);x.lineDashOffset=-t*30;
      x.beginPath();x.moveTo(1240,440);x.quadraticCurveTo(1380,400,1450,500);x.stroke();x.setLineDash([]);ag_arrowHead(x,1452,504,1.0,14,rgba(AG.green,0.9));x.restore();}
    // preferred to a model a hundred times bigger
    const ca=ag_io(t,c.smaller-0.25,c.steps-0.3,0.6);if(ca>0){ag_modelLight(x,640,560,96,ca*0.7);ag_model(x,640,560,96,{t,core:1,a:ca});
      ag_T(x,"Trained on people’s choices",640,720,{w:700,size:30,align:"center",a:ca});ag_verdict(x,640,400,"Preferred","pass",ca*ag_in(t,P.smallerW-0.2,0.5));
      ag_model(x,1300,540,230,{t,core:0.45,a:ca*ag_in(t,P.hundred-0.5,0.7)});ag_T(x,"100 times bigger",1300,830,{w:700,size:30,align:"center",col:AG.mut,a:ca*ag_in(t,P.hundred-0.3,0.5)});}
    // since 2024: work through it step by step before answering
    const MX=560,MY=560,ma2=ag_in(t,c.steps-0.4,0.6)*(1-ag_in(t,P.loop-0.6,0.6));if(ma2>0){ag_modelLight(x,MX,MY,120,ma2*0.8);ag_model(x,MX,MY,120,{t,core:0.9,think:ag_io(t,c.steps,c.tools+1,0.5),a:ma2});}
    const st=ag_io(t,P.step-0.4,c.tools-0.2,0.5);if(st>0){const ST=["1  Read the question","2  Work it out","3  Check the work"];x.save();x.globalAlpha*=st;x.strokeStyle=rgba(AG.violet,0.35);x.lineWidth=3;
      x.beginPath();x.moveTo(1040,410);x.lineTo(1040,730);x.stroke();x.restore();
      ST.forEach((s2,i)=>ag_pill(x,1040,410+i*104,s2,{size:32,a:st*ag_in(t,P.step-0.2+i*0.5,0.4),col:AG.violet}));ag_pill(x,1040,730,"Answer",{size:32,a:st*ag_in(t,P.before,0.4),col:AG.green});}
    // hands for tools: search, run a query, read a file; what comes back is data
    const ha=ag_io(t,c.tools-0.3,P.loop-0.4,0.5);if(ha>0){[["Search",P.search,390],["Query",P.query,560],["Files",P.file,730]].forEach(([n,t0,ty])=>{const u=ag_in(t,t0-0.5,0.8);
      ag_tool(x,1400,ty-56,320,112,n,{a:ha,touch:u});ag_reach(x,[MX+124,MY,MX+400,MY,1100,ty,1390,ty],u*ha,{data:ag_in(t,P.back-0.2,1.2)});});}
    // a model that reasons, with hands for tools, in a loop: an agent
    const la=ag_in(t,P.loop-0.5,0.9);if(la>0){ag_loop(x,960,580,{R:200,r:100,p:la,core:0.9,think:0.4,t,lit:Math.floor(t*1.1)%3,a:la});
      ag_pill(x,960,842,"An agent",{size:36,a:ag_in(t,P.agentW-0.2,0.5),col:AG.violet});}}}],0.6);});

// ---- 8 · Why it seemed sudden: computing power, data and money arrived together; printing waited for its pieces too ----
// today's picture, beside Mainz's: the model on its chips
function dm_today(c,x,y,w,h){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#EDEBE6");g.addColorStop(1,"#D9D4CB");c.fillStyle=g;c.fillRect(x,y,w,h);
  for(let k=0;k<5;k++)dm_chip(c,x+40+k*(w-80)/5,y+h-86,0.3,0.5,1);ag_modelLight(c,x+w/2,y+h*0.4,70,0.6);ag_model(c,x+w/2,y+h*0.4,70,{t:2,core:0.8});}
// pills in a row, centred at cx and measured so they never touch; items: [[text, alpha], ...]
function dm_pillRow(ctx,cx,y,items,o){o=o||{};const size=o.size||28,gap=o.gap||14,ws=items.map(it=>ag_tw(ctx,it[0],{w:700,size})+56),tot=ws.reduce((s,v)=>s+v,0)+gap*(items.length-1);
  let px=cx-tot/2;items.forEach((it,i)=>{ag_pill(ctx,px+ws[i]/2,y,it[0],{size,a:it[1]});px+=ws[i]+gap;});}
// one of the three things that arrived together: a card whose lower part grows to show what it brought; draw(ctx,x,y,w,h) fills that part
function dm_thing(ctx,x,y,w,icon,title,o){const a=o.a==null?1:o.a;if(a<=0)return;const g=clamp(o.grow||0,0,1),h=lerp(232,520,ag_sine(g));
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+116,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ctx.save();ctx.translate(x+w/2,y+84);dm_icon(ctx,icon);ctx.restore();
  const ta=o.ta==null?1:o.ta;ag_T(ctx,title,x+w/2,y+184,{w:700,size:34,align:"center",a:ta});
  const u=clamp(g*1.6-0.6,0,1)*ta;if(u>0&&o.draw){ctx.save();ctx.globalAlpha*=u;ctx.strokeStyle=rgba(AG.label,0.2);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+40,y+226);ctx.lineTo(x+w-40,y+226);ctx.stroke();
    o.draw(ctx,x,y+232,w,288);ctx.restore();}
  ctx.restore();}
// a stack of n gold coins standing on (x, y)
function dm_coins(c,x,y,n){for(let i=0;i<n;i++){const yy=y-i*8;c.fillStyle="#9A7630";c.beginPath();c.moveTo(x-26,yy);c.lineTo(x-26,yy+6);c.ellipse(x,yy+6,26,10,0,Math.PI,0,true);c.lineTo(x+26,yy);c.closePath();c.fill();
    const g=c.createLinearGradient(x-26,0,x+26,0);g.addColorStop(0,"#F0D88E");g.addColorStop(1,"#C69A42");c.fillStyle=g;c.beginPath();c.ellipse(x,yy,26,10,0,0,TAU);c.fill();
    c.strokeStyle="rgba(122,92,34,0.55)";c.lineWidth=1.2;c.stroke();}}
// the film's last word, large: a kicker and one line
function dm_bigCard(ctx,cx,y,kick,title,o){const a=o.a==null?1:o.a;if(a<=0)return;const tw=ag_tw(ctx,title,{w:700,size:48}),w=Math.max(760,tw+120),h=196,x=cx-w/2;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,cx,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,26,{});
  ag_T(ctx,kick.toUpperCase(),cx,y+72,{w:700,size:30,ls:4,align:"center",col:AG.violet});
  ag_T(ctx,title,cx,y+146,{w:700,size:48,align:"center",a:o.ta==null?1:o.ta});ctx.restore();}
scene("sudden",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({suddenW:wAt(sc,"why","sudden"),three:wAt(sc,"three","three things"),
    ten:wAt(sc,"compute","twenty ten"),doubled:wAt(sc,"compute","doubled"),six:wAt(sc,"compute","six months"),
    web:wAt(sc,"data","the web"),millions:wAt(sc,"data","millions"),nine:wAt(sc,"money","nine hundred"),tens:wAt(sc,"money","tens of millions"),
    longW:wAt(sc,"long","long work"),metal:wAt(sc,"printing","metal letters"),paperW:wAt(sc,"printing","paper"),
    press:wAt(sc,"printing","a press"),lender:wAt(sc,"printing","a lender"),chips:wAt(sc,"decades","chips"),data2:wAt(sc,"decades","data"),money2:wAt(sc,"decades","money"),
    magic:wAt(sc,"team","magic"),where:wAt(sc,"team","where it came from"),tH:(SCENES.find(s=>s.id==="helpful")||{dur:0}).dur}));
  // the rail, the same in both shots so it carries across the cut. It pulls back from 2024 to the whole road, where the years after 2012 crowd so
  // close that 2017, 2020 and 2022 become studs between the 2012 and 2024 tabs; they flash one after another at "sudden". A light runs the length
  // of the rail at "long work", lighting every year, and again, quickly, at "where it came from".
  const LATE=[2012,2017,2020,2022,2024],f=ag_keys(t,[[0.6,2024],[3.4,1991]]),pp=ag_keys(t,[[0.6,40],[3.4,25.5]]),X=yr=>960+(yr-f)*pp;
  const flash=(t0,d)=>ag_in(t,t0,0.12)*(1-ag_in(t,t0+0.2,d||0.9)),run=(t0,d,yr,back)=>ag_in(t,t0+(back?2024-yr:yr-1958)/66*d,0.3),T_IN=c.long-0.35,T_RUN=c.long+0.9;
  const lit=yr=>{const i=LATE.indexOf(yr),first=yr===2024?1-ag_in(t,0.6,1.0):0,land=yr===2024?flash(1.85,0.8):0,burst=i>=0?Math.max(flash(P.suddenW-0.1+i*0.13,0.8),flash(T_RUN-0.25+(4-i)*0.05,0.6)):0,
      long=run(T_RUN,1.8,yr,true)*(0.75-0.4*ag_in(t,c.printing-0.4,1.4)),again=run(P.where-0.3,0.9,yr)*(1-ag_in(t,P.where+1.2,1.0))*0.5;
    return clamp(Math.max(first,land,burst,0.18+long+again),0,1);};
  const glow=(x,t0,d,amt,back)=>{const u=(t-t0)/d;if(u<0||u>1.6)return;const gx=back?lerp(X(2024)+60,X(1958)-60,clamp(u,0,1)):lerp(X(1958)-60,X(2024)+60,clamp(u,0,1)),fa=amt*(u<1?ag_in(t,t0,0.3):1-clamp((u-1)/0.6,0,1));if(fa<=0)return;
    x.save();x.globalCompositeOperation="screen";const g=x.createRadialGradient(gx,196,0,gx,196,120);g.addColorStop(0,"rgba(255,226,170,"+(0.75*fa).toFixed(3)+")");g.addColorStop(1,"rgba(255,226,170,0)");
    x.fillStyle=g;x.fillRect(gx-120,76,240,240);x.restore();};
  const rail=x=>{dm_labRail(x,{focus:f,ppy:pp,grow:0.16*(1-ag_in(t,0.6,1.0)),lit,pin:yr=>yr>2012&&yr<2024?ag_in(t,1.5,1.0):0,drop:yr=>yr===2024?lerp(72,0,ag_in(t,2.2,0.9)):null});
    glow(x,T_RUN,1.8,1,true);glow(x,P.where-0.3,0.9,0.6);};
  // what each thing brought: computing that doubles about every six months since 2010; the web and labelled examples; $900, then tens of millions or more
  const DRAW=[
    (q,x0,y0,w,h)=>{const A=x0+56,B=x0+w-44,base=y0+196,top=y0+58,Xy=yr=>A+(yr-1960)/64*(B-A),Ly=yr=>yr<2010?0.03+(yr-1960)/50*0.09:0.12+Math.pow((yr-2010)/14,2.6)*0.88,
        v=ag_keys(t,[[c.compute+0.2,0],[P.ten+0.5,50/64],[P.doubled,50/64],[P.six+0.4,1]]),m=ag_in(t,P.ten,0.5);
      q.strokeStyle=rgba(AG.label,0.35);q.lineWidth=2;q.beginPath();q.moveTo(A,base);q.lineTo(B,base);q.stroke();
      if(m>0){const yT=base-Ly(2010)*(base-top);q.save();q.globalAlpha*=m;q.setLineDash([6,8]);q.beginPath();q.moveTo(Xy(2010),base);q.lineTo(Xy(2010),yT);q.stroke();q.restore();}
      q.save();q.strokeStyle=rgba(AG.blue,0.95);q.lineWidth=6;q.lineCap="round";q.lineJoin="round";q.beginPath();
      for(let k=0;k<=128;k++){const u=k/128;if(u>v)break;const yr=1960+u*64,px=A+u*(B-A),py=base-Ly(yr)*(base-top);if(k===0)q.moveTo(px,py);else q.lineTo(px,py);}q.stroke();q.restore();
      if(m>0){q.save();q.globalAlpha*=m;q.fillStyle=rgba(AG.blue,1);q.beginPath();q.arc(Xy(2010),base-Ly(2010)*(base-top),7,0,TAU);q.fill();q.restore();}
      ag_T(q,"1960",A+30,base+46,{w:600,size:28,align:"center",col:AG.mut});ag_T(q,"2010",Xy(2010),base+46,{w:600,size:28,align:"center",col:AG.mut,a:m});
      ag_T(q,"Doubling every 6 months",A-6,top+8,{w:700,size:28,col:AG.blue,a:ag_in(t,P.doubled-0.2,0.5)});},
    (q,x0,y0,w,h)=>{const r1=ag_in(t,P.web-0.3,0.5),r2=ag_in(t,P.millions-0.3,0.5);
      if(r1>0){q.save();q.globalAlpha*=r1;q.translate(x0+104,y0+82);q.scale(0.85,0.85);DM_ICONS.pages(q);q.restore();ag_T(q,"The web",x0+184,y0+92,{w:700,size:30,a:r1});}
      if(r2>0){q.save();q.globalAlpha*=r2;q.translate(x0+104,y0+204);q.scale(0.85,0.85);DM_ICONS.photos(q);q.restore();ag_T(q,"Labelled examples",x0+184,y0+214,{w:700,size:30,a:r2});}},
    (q,x0,y0,w,h)=>{const m1=ag_in(t,P.nine-0.3,0.5),base=y0+196,m2=ag_in(t,P.tens+0.1,0.5);
      if(m1>0){q.save();q.globalAlpha*=m1;dm_coins(q,x0+92,base,2);q.restore();ag_T(q,"$900",x0+92,base-54,{w:700,size:32,align:"center",a:m1});ag_T(q,"2017",x0+92,base+50,{w:600,size:28,align:"center",col:AG.mut,a:m1});}
      [9,12,10,13,11,8].forEach((n,i)=>{const g=ag_in(t,P.tens-0.4+i*0.08,0.7);if(g>0)dm_coins(q,x0+200+i*50,base,Math.max(1,Math.round(n*g)));});
      ag_T(q,"Tens of millions+",x0+325,y0+52,{w:700,size:30,align:"center",a:m2});ag_T(q,"2023",x0+325,base+50,{w:600,size:28,align:"center",col:AG.mut,a:m2});}];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"dmLab",push:0,keys:[[0,960,540,1.025],[0.6,960,540,1]],d:2.8,draw:(x,t)=>{rail(x);
      // the agent from the last chapter goes to its place on the rail: 2024
      const fl=ag_in(t,0.5,1.4);if(fl<1){const Y24=196+22+lerp(72,0,ag_in(t,2.2,0.9)),px=lerp(960,X(2024),fl),py=lerp(580,Y24,fl)-Math.sin(Math.PI*fl)*40,k=lerp(1,0.06,ag_eo(fl)),
          la=1-ag_in(t,0.15,0.4),tH=P.tH+t;
        x.save();x.translate(px,py);x.scale(k,k);ag_loop(x,0,0,{R:200,r:100,p:1,core:0.9,think:0.4,t:tH,lit:Math.floor(tH*1.1)%3,stepA:[la,la,la],label:"",a:1-ag_in(t,1.55,0.35)});x.restore();
        if(la>0)ag_T(x,"Model",960,640,{w:700,size:28,align:"center",col:AG.label,a:la});
        ag_pill(x,960,842,"An agent",{size:36,a:1-ag_in(t,0.05,0.4),col:AG.violet});}
      // three things arrived together, and each card grows, in turn, to show what it brought
      const on=ag_in(t,c.compute-0.3,0.4),focus=[ag_io(t,c.compute-0.3,c.data-0.3,0.4),ag_io(t,c.data-0.3,c.money-0.3,0.4),ag_in(t,c.money-0.3,0.4)];
      [["chip","Computing power",c.compute],["pages","Data",c.data],["coins","Money",c.money]].forEach(([icon,title,tg],i)=>{const t0=P.three-0.15+i*0.07,ar=ag_in(t,t0,0.5),tf=T_IN+i*0.12,fly=ag_in(t,tf,1.0);
        if(ar<=0||fly>=1)return;const cx0=370+i*590,cy0=590,fs=lerp(1,0.07,ag_eo(fly));x.save();x.translate((X(2017)+(i-1)*44-cx0)*fly,(196-cy0)*fly);ag_about(x,cx0,cy0,fs);
        dm_thing(x,120+i*590,330+(1-ag_spr(t,t0,0.8))*70,500,icon,title,{a:ar*(1-0.42*(1-focus[i])*on*(1-ag_in(t,tf-0.3,0.3)))*(1-ag_in(t,tf+0.75,0.25)),ta:1-ag_in(t,tf-0.35,0.25),grow:ag_in(t,tg-0.2,1.0),draw:DRAW[i]});x.restore();});
      // the takeaway
      const ka=ag_io(t,c.long+0.95,c.printing-0.4,0.5);if(ka>0)dm_bigCard(x,960,430,"Not a sudden discovery","Long work that finally had the power to run",{a:ka,k:ag_spr(t,c.long+0.95,0.7)});
      // printing waited four hundred years for its pieces; these ideas waited decades for theirs
      const pa=ag_in(t,c.printing-0.3,0.8);if(pa>0){ag_picture(x,100,340,700,340,{img:ag_place("dmMainz"),a:pa});
        dm_pillRow(x,450,752,[["Metal letters",pa*ag_in(t,P.metal-0.2,0.4)],["Paper",pa*ag_in(t,P.paperW-0.2,0.4)],["A press",pa*ag_in(t,P.press-0.2,0.4)],["A lender",pa*ag_in(t,P.lender-0.2,0.4)]]);
        ag_T(x,"About 400 years",450,836,{w:700,size:32,align:"center",a:pa*ag_in(t,P.lender+0.3,0.5)});}
      const qa=ag_in(t,c.decades-0.3,0.8);if(qa>0){ag_picture(x,1120,340,700,340,{draw:(c2,px,py,pw,ph)=>dm_today(c2,px,py,pw,ph),a:qa});
        dm_pillRow(x,1470,752,[["Chips",qa*ag_in(t,P.chips-0.2,0.4)],["Data",qa*ag_in(t,P.data2-0.2,0.4)],["Money",qa*ag_in(t,P.money2-0.2,0.4)]]);
        ag_T(x,"About 60 years",1470,836,{w:700,size:32,align:"center",a:qa*ag_in(t,P.money2+0.3,0.5)});}}},
    // Jun's team, under the same rail: nobody expects magic or needs to fear it, because they know where it came from
    {at:c.team-0.4,place:"dmLab",push:0.012,keys:[[c.team-0.4,960,540,1]],d:2.0,draw:(x,t)=>{rail(x);
      dm_team(x,{t,agent:1,think:0.2,yusuf:1,mei:1,ySmile:0.2+0.3*ag_in(t,P.where-0.4,0.8),mSmile:0.2+0.3*ag_in(t,P.where-0.2,0.8),junSmile:0.3+0.25*ag_in(t,P.magic,0.8)});}}],0.6);
  ag_end(ctx,S,t,c.breath+0.6,"Decades in the making","Long work that finally had the power to run","Film 1 of 9","What an agent is");});

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
