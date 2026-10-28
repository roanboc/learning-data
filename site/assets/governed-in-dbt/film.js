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

/* The Databricks and dbt logos embedded below are trademarks of their respective owners.
   They are NOT covered by this repository's licences (MIT or CC BY 4.0) and are used only to identify those products. */
const LOGO_SRC={databricks:"data:image/png;base64,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",dbt:"data:image/png;base64,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"};

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

// Governed in dbt, the first film of Governance you can use, the third series on data governance. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"rules":{"name":"The rules arrive first","lead":1.2,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, in the data team's room."},
 {"id":"loop","gap":0.8,"text":"Jun Park builds in ten steps round a loop, from a question to a new version, as the team's poster shows."},
 {"id":"opens","gap":0.8,"text":"Now he opens a pull request, a change put up for review: a new table for Planning, the awards conferred this year, by faculty."},
 {"id":"slowed","gap":0.8,"text":"When Yusuf asked what slowed him down, Jun said: the rules arrive after I've built it."},
 {"id":"owner","gap":0.8,"text":"One rule is that every table other teams use has an owner, someone who answers for what it means."},
 {"id":"months","gap":0.8,"text":"For four months, the council's minutes carried the same action: name the data owners."},
 {"id":"nobody","gap":0.8,"text":"Without an owner, nobody answers for a number."},
 {"id":"census","gap":0.8,"text":"On census day, the Faculty of Health couldn't plan its places: Anil was sent from Jun, to Noor, to Planning, and back to Jun."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"live","gap":0.8,"text":"Now the rules live in the project, beside the code, and a check runs them on every pull request."},
 {"id":"answers","gap":0.8,"text":"In a minute, it answers Jun: no owner, and how to add one."},
 {"id":"adds","gap":0.8,"text":"He adds two lines, and the check turns green."},
 {"id":"itself","gap":0.8,"text":"The change goes to Planning for review, by itself."},
 {"id":"minute","gap":0.8,"text":"An action the council carried for four months is now a check that takes a minute."},
 {"id":"first","gap":0.8,"text":"And for Jun, the rules arrive first, while he can still fix them."}]},
"pins":{"name":"A pin at each step","lead":1.0,"tail":1.0,"vo":[
 {"id":"pins","gap":0.3,"text":"Governance puts a pin where each decision enters the loop:"},
 {"id":"pins1","gap":0.3,"text":"a term at the question, a class of personal data at the sources, an owner and a contract at the gaps,"},
 {"id":"pins2","gap":0.8,"text":"a rule at the tests, an approval at review, a version when it changes."},
 {"id":"line","gap":0.8,"text":"In dbt, each pin is a line beside the model's code."},
 {"id":"learner","gap":0.8,"text":"The learner table names its owner, Mei, and the term it holds."},
 {"id":"columns","gap":0.8,"text":"Each column says whether it identifies a person, and each test has an owner."},
 {"id":"reviewed","gap":0.8,"text":"All of it is reviewed with the code."}]},
"access":{"name":"Who may build on what","lead":1.0,"tail":1.0,"vo":[
 {"id":"groups","gap":0.8,"text":"Groups and access decide who may build on what."},
 {"id":"private","gap":0.8,"text":"The data team's first layers are private to its group."},
 {"id":"public","gap":0.8,"text":"Its core tables are public, for any team, and the marts protected, for this project only."},
 {"id":"stops","gap":0.8,"text":"Build on a private one, and dbt stops before anything runs."},
 {"id":"builds","gap":0.8,"text":"Jun's new table reads only public tables, so it builds."},
 {"id":"read","gap":0.8,"text":"But who may read it is the platform's to decide, in the next film."}]},
"contract":{"name":"A promise the build keeps","lead":1.0,"tail":1.0,"vo":[
 {"id":"contract","gap":0.8,"text":"Every table other teams use has a contract: these columns, these types."},
 {"id":"mismatch","gap":0.8,"text":"Each build checks it, and a mismatch stops the table being replaced."},
 {"id":"version","gap":0.3,"text":"A change that would break a reader becomes a new version, beside the old one, with a date to go:"},
 {"id":"date","gap":0.8,"text":"credentials' first version goes on 31 March 2027.","say":"credentials' first version goes on the thirty-first of March, twenty twenty-seven."},
 {"id":"exposures","gap":0.8,"text":"And exposures name who uses each table, and who answers for each use."}]},
"impact":{"name":"What this change touches","lead":1.0,"tail":1.0,"vo":[
 {"id":"touches","gap":0.8,"text":"Each pull request also says what it touches."},
 {"id":"tuesday","gap":0.8,"text":"On Tuesday, Jun's first draft relabelled microcredentials of 6 credit points or more as awards.","say":"On Tuesday, Jun's first draft relabelled microcredentials of six credit points or more as awards."},
 {"id":"report","gap":0.8,"text":"The impact check wrote it into the pull request: five reports and apps depend on it, four owners to ask."},
 {"id":"mei","gap":0.8,"text":"Mei said a change of meaning breaks, even when the columns don't."},
 {"id":"column","gap":0.8,"text":"So Jun added a column instead: counts as an award."},
 {"id":"additive","gap":0.8,"text":"The check called it additive, with three owners to tell."},
 {"id":"renamed","gap":0.8,"text":"A renamed column would fail: a breaking change needs a new version."}]},
"owners":{"name":"Reviews go to the owners","lead":1.0,"tail":1.0,"vo":[
 {"id":"made","gap":0.8,"text":"Who reviews what is made from the same owners."},
 {"id":"script","gap":0.8,"text":"A script writes the reviewers file: the registrar's office for credentials, Planning for its tables, Clara for her product."},
 {"id":"asks","gap":0.8,"text":"GitHub asks them on every pull request, and a check fails if the file falls behind."},
 {"id":"decisions","gap":0.8,"text":"Decisions are files too, with who decided, when and why."}]},
"teach":{"name":"A check that teaches","lead":1.0,"tail":1.0,"vo":[
 {"id":"says","gap":0.8,"text":"Every message says what to add, and where, and links a page on how, with who to ask."},
 {"id":"warns","gap":0.8,"text":"A new rule warns first."},
 {"id":"holds","gap":0.8,"text":"Every column other teams read must say what it holds: until the first of December, that's a warning with its date, then an error."},
 {"id":"fell","gap":0.8,"text":"Week by week, the warnings fell from forty-one to none."},
 {"id":"anil","gap":0.8,"text":"When Anil added a column, the check showed him how to classify it."}]},
"agent":{"name":"An agent on every pull request","lead":1.0,"tail":1.0,"vo":[
 {"id":"reviews","gap":0.8,"text":"And an agent reviews every pull request, against the same rules."},
 {"id":"skill","gap":0.8,"text":"It follows a skill the team wrote: run the checks, read what they can't, and draft what's missing."},
 {"id":"found","gap":0.8,"text":"On Anil's first pull request, his faculty's call list, it found no owner, ten columns with no class, and a rule with no test."},
 {"id":"drafted","gap":0.8,"text":"It drafted each, with counts as evidence, never values, and said who decides."},
 {"id":"never","gap":0.8,"text":"The agent never approves. People decide."}]},
"close":{"name":"Carried with the code","lead":1.0,"tail":1.0,"vo":[
 {"id":"goes","gap":0.8,"text":"Jun's table goes in, with its owner, its classes, its contract and Planning's yes."},
 {"id":"home","gap":0.3,"text":"On Noor's map, the project is the home of owners, classes, contracts, tests and decisions,"},
 {"id":"flow","gap":0.8,"text":"and their copies flow one way, to the platform and the catalogue."},
 {"id":"after","gap":0.8,"text":"The rules don't arrive after he's built it any more."},
 {"id":"every","gap":0.8,"text":"They arrive with every change."},
 {"id":"last","gap":0.8,"text":"The project carries governance with the code."}]}
};

const VODUR={"rules/today": 1.821, "rules/loop": 6.451, "rules/opens": 8.236, "rules/slowed": 5.136, "rules/owner": 5.524, "rules/months": 4.77, "rules/nobody": 2.561, "rules/census": 7.873, "rules/change": 1.288, "rules/live": 5.672, "rules/answers": 3.538, "rules/adds": 2.546, "rules/itself": 2.763, "rules/minute": 4.335, "rules/first": 3.587, "pins/pins": 3.164, "pins/pins1": 5.998, "pins/pins2": 4.098, "pins/line": 3.638, "pins/learner": 3.323, "pins/columns": 4.491, "pins/reviewed": 1.794, "access/groups": 2.738, "access/private": 2.864, "access/public": 5.34, "access/stops": 3.936, "access/builds": 3.4, "access/read": 3.611, "contract/contract": 4.363, "contract/mismatch": 3.752, "contract/version": 5.465, "contract/date": 4.554, "contract/exposures": 4.251, "impact/touches": 2.687, "impact/tuesday": 6.495, "impact/report": 6.423, "impact/mei": 3.449, "impact/column": 3.319, "impact/additive": 2.782, "impact/renamed": 3.908, "owners/made": 2.426, "owners/script": 7.368, "owners/asks": 5.2, "owners/decisions": 3.274, "teach/says": 4.727, "teach/warns": 1.407, "teach/holds": 7.34, "teach/fell": 2.966, "teach/anil": 3.672, "agent/reviews": 3.759, "agent/skill": 5.285, "agent/found": 8.324, "agent/drafted": 4.581, "agent/never": 2.678, "close/goes": 5.207, "close/home": 5.631, "close/flow": 3.427, "close/after": 2.748, "close/every": 1.598, "close/last": 2.122};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the first card on the data team's board becoming the title; and the end card. */
const BREATH={
"rules":{"hold":{"today":0.6,"loop":1.2,"opens":1.2,"slowed":1.0,"owner":1.0,"months":1.2,"nobody":0.6,"census":1.2,"change":0.8,"live":0.8,"answers":1.2,"adds":1.0,"itself":0.8,"minute":0.8,"first":0.6},"breathe":4.4},
"pins":{"hold":{"pins":0.4,"pins1":1.0,"pins2":1.4,"line":1.0,"learner":1.2,"columns":1.4,"reviewed":1.0}},
"access":{"hold":{"groups":0.6,"private":0.4,"public":0.8,"stops":1.0,"builds":0.6,"read":0.4}},
"contract":{"hold":{"contract":0.6,"mismatch":1.2,"date":0.6,"exposures":0.6}},
"impact":{"hold":{"touches":0.2,"tuesday":0.6,"report":1.0,"mei":0.6,"column":0.4,"additive":0.6,"renamed":0.6}},
"owners":{"hold":{"made":0.2,"script":0.8,"asks":0.6,"decisions":0.4}},
"teach":{"hold":{"says":0.8,"warns":0.6,"holds":1.2,"fell":1.4,"anil":1.2}},
"agent":{"hold":{"reviews":0.2,"skill":0.8,"found":0.8,"drafted":0.8,"never":0.4}},
"close":{"hold":{"goes":0.6,"flow":0.8,"after":0.4,"every":0.4,"last":0.2},"breathe":4.6}
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

/* When things go wrong: the people. Characters drawn in code, in the first film's design language:
   rounded forms, soft light from the upper left, a luminous outline, and a few expressive lines for faces.
   The outline's colour carries meaning, like every colour in the films: cyan for the technical side, gold for the business side.
   Needs the film's helpers (rgba, mix, clamp, lerp, TAU), from site/assets/film/film.js.

   person(ctx,id,x,y,s,o)      draws a character facing us, feet at (x,y); s=1 is 560 px tall.
                               o.pose: "stand" | "phone" | "explain" (o.pose2 and o.mix blend towards a second pose); o.expr: "calm" | "concerned" | "relieved"; o.t: seconds, for breathing and blinking.
   personBack(ctx,id,x,y,s,o)  draws a character from behind, from the waist up, for over-the-shoulder shots. */

const TECH=[120,200,255],BIZ=[255,209,102];
const PEOPLE={
  mei:{name:"Mei Tanaka",role:"Registrar's office",side:"Business",does:"produces",edge:BIZ,seed:1,
    skin:[232,194,164],hair:{style:"bun",c:[26,24,30]},earrings:[255,214,140],
    top:{kind:"cardigan",c:[98,134,114],inner:[236,236,230]},bottom:{kind:"skirt",c:[44,56,92]},legs:[52,48,60],shoe:[34,32,40],build:{sh:66,hip:58,h:0.95}},
  ben:{name:"Ben Carter",role:"Student system team",side:"Technical",does:"produces",edge:TECH,seed:2,
    skin:[238,196,166],hair:{style:"side",c:[128,78,44]},beard:[118,70,40],
    top:{kind:"shirt",c:[140,172,208],rolled:true},bottom:{c:[98,92,76]},shoe:[70,50,38],build:{sh:80,hip:60,h:1.03}},
  ana:{name:"Ana Ruiz",role:"Head of School",side:"Business",does:"uses",edge:BIZ,seed:3,
    skin:[212,158,124],hair:{style:"bob",c:[62,44,36],streak:[178,176,182]},
    top:{kind:"blazer",c:[164,84,64],inner:[238,230,216]},bottom:{c:[50,52,62]},shoe:[46,32,30],build:{sh:70,hip:60,h:0.97}},
  sam:{name:"Sam Okafor",role:"Data engineer",side:"Technical",does:"uses",edge:TECH,seed:4,
    skin:[112,72,50],hair:{style:"coily",c:[30,24,22]},glasses:[28,30,38],lanyard:TECH,
    top:{kind:"overshirt",c:[60,92,110],inner:[212,220,232]},bottom:{c:[42,50,66]},shoe:[28,30,36],build:{sh:74,hip:58,h:1}},
  leila:{name:"Leila Haddad",role:"Admissions office",side:"Business",does:"produces",edge:BIZ,seed:5,
    skin:[198,150,112],hair:{style:"long",c:[46,32,28]},earrings:[255,214,140],
    top:{kind:"blazer",c:[178,134,52],inner:[236,228,214]},bottom:{c:[36,38,46]},shoe:[32,28,30],build:{sh:68,hip:60,h:0.96}},
  rosa:{name:"Rosa Díaz",role:"Admissions system team",side:"Technical",does:"produces",edge:TECH,seed:6,
    skin:[182,130,92],hair:{style:"curly",c:[46,30,24]},
    top:{kind:"sweater",c:[204,110,92]},bottom:{c:[54,72,98]},shoe:[226,228,232],build:{sh:66,hip:60,h:0.95}},
  david:{name:"Prof. David Mensah",role:"Deputy Vice-Chancellor",side:"Business",does:"uses",edge:BIZ,seed:7,
    skin:[78,50,36],hair:{style:"cropped",c:[190,190,192]},beard:[196,196,198],
    top:{kind:"suit",c:[40,52,78],inner:[234,238,244]},bottom:{c:[38,46,66]},shoe:[26,22,22],build:{sh:80,hip:64,h:1.02}}
};
// arm angles are [upper arm, forearm], in radians from pointing straight down; positive points away from the body
const POSE={
  stand:  {L:[0.13,-0.1],R:[0.09,0.06],feet:25,shift:3,tilt:0.025,turn:0.05,gaze:[0,0],look:0},
  phone:  {L:[0.11,-0.02],R:[0.07,Math.PI+0.64],hold:"phone",feet:25,shift:-3,tilt:0.05,turn:0.08,gaze:[0.15,1],look:1},
  explain:{L:[0.1,-0.06],R:[0.98,2.3],hand:"open",feet:36,shift:6,tilt:-0.06,turn:0.28,gaze:[0.25,0],look:0}
};
// brows: inner and outer height (negative is up), arch; eyes: how open; mouth: smile (-1 to 1), open, width
const EXPR={
  calm:     {bi:0,bo:0,arch:-2.5,eye:1,smile:0.3,open:0,mw:17},
  concerned:{bi:-4.5,bo:2,arch:-1,knit:2,eye:0.92,smile:-0.4,open:0,mw:14},
  relieved: {bi:-2,bo:-3.5,arch:-4,eye:0.62,happy:1,smile:1,open:0.8,mw:24}
};

const lighten=(c,k)=>mix(c,[255,255,255],k),darken=(c,k)=>mix(c,[0,0,0],k);
function litFill(ctx,c,x0,y0,x1,y1,k){k=k||1;const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,rgba(lighten(c,0.16*k),1));g.addColorStop(0.55,rgba(c,1));g.addColorStop(1,rgba(darken(c,0.3*k),1));ctx.fillStyle=g;ctx.fill();}
function seam(ctx,c,a,w){ctx.strokeStyle=rgba(darken(c,0.55),a==null?0.45:a);ctx.lineWidth=w||1.6;ctx.stroke();}
function ell(ctx,x,y,rx,ry,r){ctx.beginPath();ctx.ellipse(x,y,rx,ry,r||0,0,TAU);}
function limb(ctx,pts,w0,w1,c,box){ // a tapered, rounded limb through points, lit from the upper left
  const g=ctx.createLinearGradient(box[0],box[1],box[2],box[3]);g.addColorStop(0,rgba(lighten(c,0.14),1));g.addColorStop(1,rgba(darken(c,0.28),1));
  ctx.lineCap="round";ctx.lineJoin="round";
  for(let i=0;i<pts.length-1;i++){const w=lerp(w0,w1,i/Math.max(1,pts.length-2));
    ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);
    ctx.strokeStyle=rgba(darken(c,0.55),0.5);ctx.lineWidth=w+2.4;ctx.stroke();}
  for(let i=0;i<pts.length-1;i++){const w=lerp(w0,w1,i/Math.max(1,pts.length-2));
    ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);ctx.strokeStyle=g;ctx.lineWidth=w;ctx.stroke();}}

/* ---- body ---- */
function legs(ctx,P,po){const f=po.feet,sh=po.shift,b=P.bottom,skirt=b.kind==="skirt";
  for(const s of [-1,1]){const hip=[s*22+sh*0.6,-282],knee=[s*f*0.8+sh*0.3,-146],ank=[s*f,-26];
    ell(ctx,s*(f+7),-11,21,11,s*0.12);litFill(ctx,P.shoe,-40,-24,40,0);seam(ctx,P.shoe,0.5);
    if(skirt)limb(ctx,[[knee[0]*0.9,-170],knee,ank],23,19,P.legs,[-60,-200,60,0]);
    else limb(ctx,[hip,knee,ank],47,37,b.c,[-80,-300,80,0]);}
  const hw=P.build.hip;
  if(skirt){ctx.beginPath();ctx.moveTo(-hw+4,-312);ctx.lineTo(hw-4+sh,-312);ctx.quadraticCurveTo(hw+10+sh,-240,hw+16+sh*0.5,-150);ctx.quadraticCurveTo(0,-140,-hw-16+sh*0.5,-150);ctx.quadraticCurveTo(-hw-10,-240,-hw+4,-312);ctx.closePath();
    litFill(ctx,b.c,-hw,-312,hw,-150);seam(ctx,b.c,0.5);}
  else{ctx.beginPath();ctx.moveTo(-hw+2,-312);ctx.lineTo(hw-2+sh,-312);ctx.quadraticCurveTo(hw+2+sh,-272,hw-8+sh*0.6,-252);ctx.lineTo(sh*0.4,-228);ctx.lineTo(-hw+8+sh*0.6,-252);ctx.quadraticCurveTo(-hw-2,-272,-hw+2,-312);ctx.closePath();
    litFill(ctx,b.c,-hw,-312,hw,-228);}}
function torsoPath(ctx,P,br,sh){const sw=P.build.sh,hw=P.build.hip,y0=-448+br;ctx.beginPath();ctx.moveTo(-15,y0);
  ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-2,y0+28,-sw-2,y0+50);
  ctx.bezierCurveTo(-sw-2,y0+84,-hw-2,-352,-hw+2,-322);ctx.quadraticCurveTo(-hw-4+sh*0.4,-290,-hw-1+sh*0.6,-256);
  ctx.quadraticCurveTo(sh*0.6,-248,hw+1+sh*0.6,-256);ctx.quadraticCurveTo(hw+4+sh*0.4,-290,hw-2,-322);
  ctx.bezierCurveTo(hw+2,-352,sw+2,y0+84,sw+2,y0+50);ctx.quadraticCurveTo(sw+2,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,15,y0);ctx.closePath();}
function torso(ctx,P,br,sh){const T=P.top,c=T.c,sw=P.build.sh,y0=-448+br;
  torsoPath(ctx,P,br,sh);litFill(ctx,c,-sw,y0,sw,-250);seam(ctx,c,0.5);
  ctx.save();torsoPath(ctx,P,br,sh);ctx.clip();
  const inner=(pts)=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))ctx.lineTo(p[0],p[1]);ctx.closePath();litFill(ctx,T.inner,-20,y0,20,-260,0.6);};
  if(T.kind==="blazer"||T.kind==="suit"){inner([[-17,y0-2],[17,y0-2],[1+sh*0.3,-352]]);
    ctx.strokeStyle=rgba(darken(c,0.5),0.7);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-17,y0);ctx.lineTo(-30,y0+34);ctx.lineTo(-12,y0+42);ctx.lineTo(sh*0.3,-352);ctx.lineTo(sh*0.4,-256);ctx.stroke();
    ctx.beginPath();ctx.moveTo(17,y0);ctx.lineTo(30,y0+34);ctx.lineTo(12,y0+42);ctx.lineTo(1+sh*0.3,-352);ctx.stroke();
    ell(ctx,4+sh*0.35,-318,3.2,3.2);ctx.fillStyle=rgba(darken(c,0.45),0.9);ctx.fill();
    if(T.kind==="suit"){ctx.beginPath();ctx.moveTo(-sw+18,-338);ctx.lineTo(-sw+44,-338);ctx.strokeStyle=rgba(darken(c,0.5),0.6);ctx.stroke();}}
  else if(T.kind==="cardigan"){inner([[-16,y0-2],[16,y0-2],[9+sh*0.4,-250],[-9+sh*0.4,-250]]);
    ctx.fillStyle=rgba(lighten(c,0.35),0.9);for(let i=0;i<4;i++){ell(ctx,-12+sh*0.4,-392+i*34,2.6,2.6);ctx.fill();}
    ctx.strokeStyle=rgba(darken(c,0.4),0.6);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-sw+10,-262);ctx.lineTo(sw+sh,-262);ctx.stroke();}
  else if(T.kind==="overshirt"){inner([[-19,y0-2],[19,y0-2],[13+sh*0.4,-250],[-13+sh*0.4,-250]]);
    ctx.fillStyle=rgba(darken(c,0.25),1);ctx.beginPath();ctx.moveTo(-19,y0);ctx.lineTo(-34,y0+26);ctx.lineTo(-15,y0+22);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(19,y0);ctx.lineTo(34,y0+26);ctx.lineTo(15,y0+22);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(darken(c,0.3),0.8);for(const s of [-1,1]){ctx.beginPath();rr(ctx,s*40-12,-392,24,20,3);ctx.fill();}}
  else if(T.kind==="shirt"){ctx.strokeStyle=rgba(darken(c,0.35),0.7);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(sh*0.2,y0+8);ctx.lineTo(sh*0.4,-256);ctx.stroke();
    ctx.fillStyle=rgba(darken(c,0.4),0.85);for(let i=0;i<5;i++){ell(ctx,3+sh*0.3,-420+i*34,2,2);ctx.fill();}
    ctx.fillStyle=rgba(lighten(c,0.12),1);for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*4,y0+2);ctx.lineTo(s*22,y0-4);ctx.lineTo(s*20,y0+18);ctx.closePath();ctx.fill();seam(ctx,c,0.4,1.2);}}
  else if(T.kind==="sweater"){ctx.strokeStyle=rgba(darken(c,0.3),0.8);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-18,y0);ctx.quadraticCurveTo(0,y0+18,18,y0);ctx.stroke();
    ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-sw,-260);ctx.lineTo(sw+sh,-260);ctx.stroke();
    ctx.strokeStyle=rgba(darken(c,0.2),0.18);ctx.lineWidth=1;for(let x=-54;x<=54;x+=12){ctx.beginPath();ctx.moveTo(x,-400);ctx.lineTo(x+sh*0.3,-266);ctx.stroke();}}
  if(P.lanyard){ctx.strokeStyle=rgba(P.lanyard,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-12,y0+2);ctx.lineTo(-4+sh*0.3,-346);ctx.lineTo(4+sh*0.3,-346);ctx.lineTo(12,y0+2);ctx.stroke();
    ctx.fillStyle="rgba(236,243,255,0.92)";ctx.beginPath();rr(ctx,-13+sh*0.3,-346,26,34,4);ctx.fill();ctx.fillStyle=rgba(P.lanyard,0.9);ctx.fillRect(-9+sh*0.3,-340,18,6);}
  ctx.restore();}
function arm(ctx,P,s,a,br,po){const sw=P.build.sh,T=P.top,sx=s*(sw-12),sy=-416+br,L1=108,L2=100;
  const e=[sx+s*Math.sin(a[0])*L1,sy+Math.cos(a[0])*L1],w=[e[0]+s*Math.sin(a[1])*L2,e[1]+Math.cos(a[1])*L2];
  const d=[s*Math.sin(a[1]),Math.cos(a[1])],box=[-sw-60,-450,sw+60,-200];
  if(T.rolled){limb(ctx,[[sx,sy],e,[e[0]+d[0]*28,e[1]+d[1]*28]],31,28,T.c,box);limb(ctx,[[e[0]+d[0]*26,e[1]+d[1]*26],w],23,21,P.skin,box);
    ctx.lineCap="butt";ctx.strokeStyle=rgba(darken(T.c,0.5),0.5);ctx.lineWidth=33;ctx.beginPath();ctx.moveTo(e[0]+d[0]*19,e[1]+d[1]*19);ctx.lineTo(e[0]+d[0]*35,e[1]+d[1]*35);ctx.stroke();
    ctx.strokeStyle=rgba(lighten(T.c,0.12),1);ctx.lineWidth=31;ctx.beginPath();ctx.moveTo(e[0]+d[0]*20,e[1]+d[1]*20);ctx.lineTo(e[0]+d[0]*34,e[1]+d[1]*34);ctx.stroke();}
  else{limb(ctx,[[sx,sy],e,w],31,26,T.c,box);
    ctx.lineCap="butt";ctx.strokeStyle=rgba(darken(T.c,0.3),0.9);ctx.lineWidth=27;ctx.beginPath();ctx.moveTo(w[0]-d[0]*10,w[1]-d[1]*10);ctx.lineTo(w[0]-d[0]*4,w[1]-d[1]*4);ctx.stroke();}
  const h=[w[0]+d[0]*13,w[1]+d[1]*13],ang=Math.atan2(d[1],d[0])-Math.PI/2;
  if(po.hold==="phone"&&s===1){phoneInHand(ctx,P,h,ang);return;}
  ctx.save();ctx.translate(h[0],h[1]);ctx.rotate(ang);
  if(po.hand==="open"&&s===1){ // an open palm, facing us
    for(let i=0;i<4;i++){ctx.save();ctx.rotate((i-1.5)*0.16);ell(ctx,0,15,4.6,11);litFill(ctx,P.skin,-8,0,8,26);ctx.restore();}
    ell(ctx,0,2,13,14);litFill(ctx,P.skin,-14,-14,14,14);ell(ctx,-s*13,-2,5,10,s*0.7);litFill(ctx,P.skin,-18,-12,-6,8);}
  else{ell(ctx,0,2,12,15);litFill(ctx,P.skin,-12,-13,12,17);seam(ctx,P.skin,0.3,1.2);ell(ctx,-s*9,-4,4.5,8,s*0.35);litFill(ctx,P.skin,-14,-12,-4,4);}
  ctx.restore();}
function phoneInHand(ctx,P,h,ang){ctx.save();ctx.translate(h[0]-4,h[1]-8);ctx.rotate(-0.22);
  ell(ctx,0,16,13,15);litFill(ctx,P.skin,-13,0,13,32);
  ctx.save();ctx.shadowColor=rgba(TECH,0.9);ctx.shadowBlur=16;ctx.beginPath();rr(ctx,-19,-40,38,66,6);ctx.fillStyle="#0c1426";ctx.fill();ctx.restore();
  ctx.beginPath();rr(ctx,-16,-36,32,58,4);const g=ctx.createLinearGradient(0,-36,0,22);g.addColorStop(0,"rgba(150,210,255,0.95)");g.addColorStop(1,"rgba(60,110,190,0.95)");ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle="rgba(255,120,100,0.95)";ctx.beginPath();rr(ctx,-12,-30,24,8,2);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.7)";for(let i=0;i<3;i++){ctx.fillRect(-12,-16+i*8,24-i*6,3);}
  ell(ctx,-15,6,5,9,0.5);litFill(ctx,P.skin,-20,-4,-10,14);ell(ctx,15,2,5,12,-0.2);litFill(ctx,P.skin,10,-10,20,14);
  ctx.restore();}

/* ---- head ---- */
function headPath(ctx){ctx.beginPath();ctx.moveTo(0,-56);ctx.bezierCurveTo(27,-56,42,-40,42,-12);ctx.bezierCurveTo(42,12,37,28,25,40);ctx.bezierCurveTo(16,48,8,51,0,51);
  ctx.bezierCurveTo(-8,51,-16,48,-25,40);ctx.bezierCurveTo(-37,28,-42,12,-42,-12);ctx.bezierCurveTo(-42,-40,-27,-56,0,-56);ctx.closePath();}
function bumpy(ctx,cx,cy,rx,ry,a0,a1,n,amp,phase){ // an outline with soft bumps, for coily and curly hair
  for(let i=0;i<=n;i++){const a=lerp(a0,a1,i/n),r=1+amp*Math.sin(i*2.1+phase)*0.5+amp*0.5*Math.abs(Math.sin(i*1.3+phase*2));
    const x=cx+Math.cos(a)*rx*r,y=cy+Math.sin(a)*ry*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}}
function hairBack(ctx,P){const H=P.hair;if(!H)return;const c=H.c;
  if(H.style==="bob"){ctx.beginPath();ctx.moveTo(-47,-20);ctx.bezierCurveTo(-54,-72,54,-72,47,-20);ctx.bezierCurveTo(52,10,52,34,44,44);ctx.quadraticCurveTo(30,50,22,40);ctx.lineTo(-22,40);ctx.quadraticCurveTo(-30,50,-44,44);ctx.bezierCurveTo(-52,34,-52,10,-47,-20);ctx.closePath();litFill(ctx,c,-50,-70,50,50);}
  if(H.style==="bun"){ell(ctx,0,-66,19,16);litFill(ctx,c,-19,-82,19,-50);seam(ctx,c,0.4);}
  if(H.style==="long"){ctx.beginPath();ctx.moveTo(-46,-20);ctx.bezierCurveTo(-52,-78,52,-78,46,-20);ctx.lineTo(46,40);ctx.lineTo(-46,40);ctx.closePath();litFill(ctx,c,-50,-70,50,40);
    for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*47,-24);ctx.bezierCurveTo(s*52,20,s*60,70,s*62,124);ctx.quadraticCurveTo(s*48,134,s*30,126);ctx.bezierCurveTo(s*33,90,s*36,54,s*34,24);ctx.closePath();
      litFill(ctx,c,s*30,-24,s*62,130);ctx.strokeStyle=rgba(lighten(c,0.22),0.35);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(s*44,10);ctx.bezierCurveTo(s*48,50,s*52,90,s*50,120);ctx.stroke();}}
  if(H.style==="curly"){ctx.beginPath();bumpy(ctx,0,-8,62,70,Math.PI*0.72,Math.PI*2.28,34,0.13,P.seed);ctx.quadraticCurveTo(0,86,-44,54);ctx.closePath();litFill(ctx,c,-60,-80,60,70);
    ctx.fillStyle=rgba(lighten(c,0.18),0.5);for(let i=0;i<40;i++){const a=hash(i,P.seed)*TAU,r=30+hash(i,9)*30;ell(ctx,Math.cos(a)*r,-8+Math.sin(a)*r*1.1,3,2,a);ctx.fill();}}}
function hairFront(ctx,P){const H=P.hair;if(!H)return;const c=H.c;
  if(H.style==="coily"){ctx.beginPath();bumpy(ctx,0,-22,46,38,Math.PI*1.02,Math.PI*1.98,26,0.07,P.seed);ctx.bezierCurveTo(42,-14,36,-30,24,-32);ctx.quadraticCurveTo(0,-38,-24,-32);ctx.bezierCurveTo(-36,-30,-42,-14,-45,-24);ctx.closePath();litFill(ctx,c,-46,-64,46,-20);
    ctx.save();ctx.clip();ctx.fillStyle=rgba(lighten(c,0.22),0.55);for(let i=0;i<60;i++){ell(ctx,(hash(i,3)-0.5)*90,-62+hash(i,5)*34,1.8,1.5);ctx.fill();}ctx.restore();}
  if(H.style==="bob"){ctx.beginPath();ctx.moveTo(-44,-14);ctx.bezierCurveTo(-48,-58,-10,-66,8,-58);ctx.bezierCurveTo(34,-54,48,-34,44,-6);ctx.quadraticCurveTo(30,-36,4,-34);ctx.quadraticCurveTo(-22,-30,-32,-20);ctx.quadraticCurveTo(-38,4,-40,24);ctx.closePath();litFill(ctx,c,-46,-64,46,20);
    ctx.save();ctx.clip();ctx.strokeStyle=rgba(H.streak,0.45);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-4,-60);ctx.quadraticCurveTo(12,-44,30,-34);ctx.stroke();ctx.restore();}
  if(H.style==="long"){ctx.beginPath();ctx.moveTo(-1,-40);ctx.quadraticCurveTo(-26,-36,-36,-12);ctx.quadraticCurveTo(-40,10,-39,34);ctx.lineTo(-47,34);ctx.lineTo(-47,-18);ctx.bezierCurveTo(-50,-82,50,-82,47,-18);ctx.lineTo(47,34);ctx.lineTo(39,34);ctx.quadraticCurveTo(40,10,36,-12);ctx.quadraticCurveTo(26,-36,1,-40);ctx.closePath();
    litFill(ctx,c,-47,-66,47,34);ctx.save();ctx.clip();ctx.strokeStyle=rgba(lighten(c,0.25),0.4);ctx.lineWidth=1.4;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*4,-56);ctx.quadraticCurveTo(s*30,-50,s*42,-10);ctx.stroke();}ctx.restore();}
  if(H.style==="bun"){ctx.beginPath();ctx.moveTo(-44,-8);ctx.bezierCurveTo(-48,-80,48,-80,44,-8);ctx.quadraticCurveTo(34,-30,2,-38);ctx.lineTo(-2,-38);ctx.quadraticCurveTo(-34,-30,-43,-8);ctx.closePath();litFill(ctx,c,-46,-62,46,-8);
    ctx.strokeStyle=rgba(lighten(c,0.25),0.5);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(0,-38);ctx.stroke();}
  if(H.style==="side"){ctx.beginPath();ctx.moveTo(-44,-6);ctx.bezierCurveTo(-50,-84,34,-90,47,-30);ctx.lineTo(44,-8);ctx.quadraticCurveTo(38,-30,26,-38);ctx.quadraticCurveTo(-10,-30,-30,-38);ctx.quadraticCurveTo(-40,-26,-43,-6);ctx.closePath();litFill(ctx,c,-46,-66,46,-6);
    ctx.save();ctx.clip();ctx.strokeStyle=rgba(lighten(c,0.3),0.5);ctx.lineWidth=1.4;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-26+i*10,-56+i);ctx.quadraticCurveTo(-6+i*10,-60,16+i*8,-44);ctx.stroke();}ctx.restore();}
  if(H.style==="curly"){ctx.beginPath();bumpy(ctx,0,-24,48,36,Math.PI*1.0,Math.PI*2.0,24,0.16,P.seed+1);ctx.quadraticCurveTo(30,-26,6,-34);ctx.quadraticCurveTo(-24,-30,-48,-24);ctx.closePath();litFill(ctx,c,-50,-66,50,-20);}
  if(H.style==="cropped"){ctx.beginPath();ctx.moveTo(-43,-16);ctx.bezierCurveTo(-46,-79,46,-79,43,-16);ctx.quadraticCurveTo(38,-36,24,-40);ctx.quadraticCurveTo(0,-46,-24,-40);ctx.quadraticCurveTo(-38,-36,-42,-16);ctx.closePath();
    ctx.fillStyle=rgba(c,0.9);ctx.fill();ctx.save();ctx.clip();ctx.fillStyle=rgba(darken(c,0.3),0.45);for(let i=0;i<70;i++){const x=(hash(i,4)-0.5)*84,y=-58+hash(i,6)*24;ell(ctx,x,y,1.2,1.2);ctx.fill();}ctx.restore();}}
function beard(ctx,P){const c=P.beard;ctx.beginPath();ctx.moveTo(-42,0);ctx.bezierCurveTo(-42,22,-34,40,-24,46);ctx.bezierCurveTo(-14,55,14,55,24,46);ctx.bezierCurveTo(34,40,42,22,42,0);
  ctx.lineTo(36,4);ctx.quadraticCurveTo(28,14,14,16);ctx.quadraticCurveTo(0,13,-14,16);ctx.quadraticCurveTo(-28,14,-36,4);ctx.closePath();ctx.fillStyle=rgba(c,0.94);ctx.fill();
  ctx.fillStyle=rgba(lighten(c,0.2),0.35);for(let i=0;i<50;i++){const a=hash(i,2)*Math.PI,r=30+hash(i,8)*14;ell(ctx,Math.cos(a)*r*0.9,14+Math.sin(a)*r*0.8,1.2,1.2);ctx.fill();}}
function face(ctx,P,E,po,t){const fx=po.turn*7,ly=po.look*3,dark=[30,26,34];
  // blinking: a quick close every few seconds, at a different moment for each person
  const bt=(t+P.seed*1.37)%4.3,blink=bt<0.14?Math.abs(bt-0.07)/0.07:1,open=E.eye*blink*(po.look?0.78:1);
  const skinDark=P.skin[0]+P.skin[1]<250;
  if(!skinDark){ctx.fillStyle="rgba(230,120,110,0.14)";for(const s of [-1,1]){ell(ctx,s*23+fx,12,10,7);ctx.fill();}}
  for(const s of [-1,1]){const ex=s*15+fx,ey=-5+ly;
    if(open<0.22||E.happy&&open<0.7){ctx.strokeStyle=rgba(dark,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();
      if(E.happy){ctx.moveTo(ex-6,ey+1);ctx.quadraticCurveTo(ex,ey-6,ex+6,ey+1);}else{ctx.moveTo(ex-6,ey);ctx.quadraticCurveTo(ex,ey+2,ex+6,ey);}ctx.stroke();}
    else{ell(ctx,ex+po.gaze[0]*1.5,ey+po.gaze[1]*1.5,4.9,6.4*open);ctx.fillStyle=rgba(dark,1);ctx.fill();
      ell(ctx,ex+po.gaze[0]*1.5-1.6,ey+po.gaze[1]*1.5-2.2*open,1.5,1.5);ctx.fillStyle="rgba(255,255,255,0.9)";ctx.fill();
      ctx.strokeStyle=rgba(darken(P.skin,0.45),0.5);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(ex-7,ey-6.5*open-0.5);ctx.quadraticCurveTo(ex,ey-8.8*open-1,ex+7,ey-6.5*open-0.5);ctx.stroke();}
    // brows
    const ix=s*(8-(E.knit||0))+fx,ox=s*25+fx,by=-19+ly*0.6;ctx.strokeStyle=rgba(darken(P.hair.c,0.1),0.92);ctx.lineWidth=3.6;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(ix,by+E.bi);ctx.quadraticCurveTo((ix+ox)/2,by+E.arch+Math.min(E.bi,E.bo)*0.5,ox,by+E.bo+1);ctx.stroke();}
  // nose
  ctx.strokeStyle=rgba(darken(P.skin,0.4),0.55);ctx.lineWidth=2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(fx*1.3+1,3+ly);ctx.quadraticCurveTo(fx*1.3+5,12+ly,fx*1.3-2,15+ly);ctx.stroke();
  if(P.beard)beard(ctx,P);
  // mouth
  const mw=E.mw/2,my=27+ly*0.5,mx=fx*1.1;
  if(E.open>0){ctx.beginPath();ctx.moveTo(mx-mw,my);ctx.quadraticCurveTo(mx,my+E.smile*3,mx+mw,my);ctx.quadraticCurveTo(mx,my+E.smile*6+E.open*14,mx-mw,my);ctx.closePath();ctx.fillStyle="rgba(92,34,40,0.95)";ctx.fill();
    ctx.save();ctx.clip();ctx.fillStyle="rgba(250,248,244,0.95)";ctx.fillRect(mx-mw,my-2,mw*2,4.5);ctx.restore();}
  else{ctx.strokeStyle=rgba(darken(P.skin,0.55),0.85);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(mx-mw,my-E.smile*1.5);ctx.quadraticCurveTo(mx,my+E.smile*6,mx+mw,my-E.smile*1.5);ctx.stroke();}
  if(P.glasses){ctx.strokeStyle=rgba(P.glasses,0.95);ctx.lineWidth=2.4;for(const s of [-1,1]){ell(ctx,s*15+fx,-4+ly,11.5,10.5);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(-4+fx,-6+ly);ctx.quadraticCurveTo(fx,-9+ly,4+fx,-6+ly);ctx.stroke();ctx.beginPath();ctx.moveTo(-26+fx,-7+ly);ctx.lineTo(-40,-9);ctx.moveTo(26+fx,-7+ly);ctx.lineTo(40,-9);ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,0.3)";ctx.lineWidth=1.6;for(const s of [-1,1]){ctx.beginPath();ctx.arc(s*15+fx,-4+ly,8,-2.6,-1.8);ctx.stroke();}}}
function head(ctx,P,E,po,t){
  hairBack(ctx,P);
  if(!["bob","curly","long"].includes(P.hair.style))for(const s of [-1,1]){ell(ctx,s*42,0,7,11);litFill(ctx,P.skin,-50,-12,50,12);seam(ctx,P.skin,0.25,1.2);}
  headPath(ctx);litFill(ctx,P.skin,-42,-56,42,51);seam(ctx,P.skin,0.3,1.4);
  face(ctx,P,E,po,t);
  if(P.earrings){ctx.fillStyle=rgba(P.earrings,1);for(const s of [-1,1]){ell(ctx,s*43,13,2.8,2.8);ctx.fill();}}
  hairFront(ctx,P);
  if(po.hold==="phone"){const g=ctx.createRadialGradient(0,50,4,0,40,90);g.addColorStop(0,"rgba(120,200,255,0.22)");g.addColorStop(1,"rgba(120,200,255,0)");ctx.fillStyle=g;headPath(ctx);ctx.fill();}}

/* ---- a whole person, with a luminous outline ---- */
const PCV={};
function pcanvas(k,w,h){const c=PCV[k]||(PCV[k]=document.createElement("canvas"));if(c.width!==w||c.height!==h){c.width=w;c.height=h;}const x=c.getContext("2d");x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,w,h);return[c,x];}
function outlined(ctx,draw,x,y,s,edge,box,glowA){ // draws into a spare canvas, then adds a thin glowing outline around the silhouette
  const [x0,y0,x1,y1]=box,pad=24,w=Math.ceil((x1-x0)*s+pad*2),h=Math.ceil((y1-y0)*s+pad*2);
  const [c,cx]=pcanvas("p",w,h);cx.translate(pad-x0*s,pad-y0*s);cx.scale(s,s);draw(cx);
  const [tc,tx]=pcanvas("t",w,h);tx.drawImage(c,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(edge,1);tx.fillRect(0,0,w,h);tx.globalCompositeOperation="source-over";
  const ox=x+x0*s-pad,oy=y+y0*s-pad,r=Math.max(1,1.25*s),[oc,o]=pcanvas("o",w,h);
  o.save();o.shadowColor=rgba(edge,glowA==null?0.4:glowA);o.shadowBlur=12*Math.max(0.7,s);o.globalAlpha=0.65;o.drawImage(tc,0,0);o.restore();
  o.save();o.globalAlpha=0.85;for(let i=0;i<8;i++){const a=i/8*TAU;o.drawImage(tc,Math.cos(a)*r,Math.sin(a)*r);}o.restore();
  o.drawImage(c,0,0);ctx.drawImage(oc,ox,oy);}
// a pose between two poses: o.pose2 and o.mix (0 to 1) move the limbs smoothly; what the hand holds switches halfway
function blendPose(a,b,m){if(!b||!(m>0))return a;if(m>=1)return b;const L=(u,v)=>u+(v-u)*m,out={};
  Object.keys(Object.assign({},a,b)).forEach(k=>{const u=a[k],v=b[k];out[k]=Array.isArray(u)&&Array.isArray(v)?u.map((q,i)=>L(q,v[i])):typeof u==="number"&&typeof v==="number"?L(u,v):(m<0.5?u:v);});return out;}
function person(ctx,id,x,y,s,o){o=o||{};const P=PEOPLE[id],po=blendPose(POSE[o.pose||"stand"],POSE[o.pose2],o.mix),E=EXPR[o.expr||"calm"],t=o.t||0,k=s*P.build.h;
  const br=Math.sin(t*1.7+P.seed)*1.4;
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,100);g.addColorStop(0,"rgba(0,0,0,0.45)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ell(ctx,0,-4,100,16);ctx.fill();ctx.restore();
  const front=a=>a[1]>Math.PI*0.8;
  outlined(ctx,cx=>{
    if(!front(po.L))arm(cx,P,-1,po.L,br,po);if(!front(po.R))arm(cx,P,1,po.R,br,po);
    legs(cx,P,po);
    limb(cx,[[0,-470+br],[0,-440+br]],30,30,darken(P.skin,0.12),[-20,-470,20,-440]);
    torso(cx,P,br,po.shift);
    cx.save();cx.translate(po.shift*0.2,-452+br);cx.rotate(po.tilt);cx.translate(0,-50+po.look*2);head(cx,P,E,po,t);cx.restore();
    if(front(po.L))arm(cx,P,-1,po.L,br,po);if(front(po.R))arm(cx,P,1,po.R,br,po);
  },x,y,k,P.edge,[-250,-650,250,10],o.glow);}
function personBack(ctx,id,x,y,s,o){o=o||{};const P=PEOPLE[id],k=s*P.build.h,sw=P.build.sh,t=o.t||0,br=Math.sin(t*1.7+P.seed)*1.4;
  outlined(ctx,cx=>{
    limb(cx,[[-sw+6,-410],[-sw-6,-300]],32,30,darken(P.top.c,0.2),[-sw,-420,0,-300]);limb(cx,[[sw-6,-410],[sw+4,-300]],32,30,darken(P.top.c,0.2),[0,-420,sw,-300]);
    torsoPath(cx,P,br,0);litFill(cx,darken(P.top.c,0.15),-sw,-450,sw,-250);seam(cx,P.top.c,0.5);
    cx.strokeStyle=rgba(darken(P.top.c,0.45),0.6);cx.lineWidth=2;cx.beginPath();cx.moveTo(-24,-446+br);cx.quadraticCurveTo(0,-432+br,24,-446+br);cx.stroke();
    limb(cx,[[0,-472+br],[0,-446+br]],28,28,darken(P.skin,0.2),[-20,-470,20,-440]);
    cx.save();cx.translate(0,-502+br);
    for(const s of [-1,1]){ell(cx,s*41,2,7,11);litFill(cx,darken(P.skin,0.1),-50,-12,50,12);}
    headPath(cx);litFill(cx,darken(P.skin,0.1),-42,-56,42,51);
    cx.beginPath();bumpy(cx,0,-8,46,54,Math.PI*0.86,Math.PI*2.14,40,0.06,P.seed);cx.quadraticCurveTo(20,42,0,44);cx.quadraticCurveTo(-20,42,-40,30);cx.closePath();litFill(cx,P.hair.c,-46,-64,46,44);
    cx.fillStyle=rgba(lighten(P.hair.c,0.22),0.5);for(let i=0;i<70;i++){const a=hash(i,3)*TAU,r=hash(i,5)*40;cx.beginPath();cx.ellipse(Math.cos(a)*r,-10+Math.sin(a)*r,1.8,1.5,0,0,TAU);cx.fill();}
    if(P.glasses){cx.strokeStyle=rgba(P.glasses,0.9);cx.lineWidth=2.4;cx.beginPath();cx.moveTo(-40,-8);cx.lineTo(-46,-2);cx.moveTo(40,-8);cx.lineTo(46,-2);cx.stroke();}
    cx.restore();
  },x,y,k,o.edge||P.edge,[-140,-580,140,-240],o.glow);}

/* ===== From words to data: the series' components =====
   Seven films, one world: the university and the platform of The Inner Life of Data, drawn with its primitives (glass, T, tag, chip,
   glow, withA, fin) and A Sharper Sketch's diagrams (ent, relLine, diagram, bubble, numCard, stamp, table). Everything here is shared
   by the seven films, their labs and their scenarios; each film keeps its own pictures in its own file.
   The past is drawn warm, like clay and parchment; the present is the films' dark glass. */

/* ---------- colours ---------- */
// the credential's colour, and the colours of the offices that count credentials
const TRUST=[255,209,102],CLAY=[222,170,112],PARCH=[238,224,196],WAX=[200,64,54],GRAPH=[64,60,58],KIND=[140,200,255],EDGE_=[255,140,120];
const OFFICE={reg:{n:"Registrar",c:[255,196,92]},short:{n:"Short courses",c:[255,128,168]},careers:{n:"Careers",c:[186,150,255]},lms:{n:"Learning platform",c:[126,224,140]}};

/* ---------- the series' people: two more, drawn like the others (When things go wrong's character sheet) ---------- */
// Noor Rahman, the data architect, is the series' guide (technical); Tom Whitfield runs short courses and microcredentials (business)
PEOPLE.noor={name:"Noor Rahman",role:"Data architect",side:"Technical",does:"produces",edge:TECH,seed:8,
  skin:[176,124,92],hair:{style:"long",c:[24,20,22]},earrings:[200,220,255],
  top:{kind:"blazer",c:[52,84,104],inner:[226,232,240]},bottom:{c:[40,44,56]},shoe:[30,30,36],build:{sh:66,hip:58,h:0.96}};
PEOPLE.tom={name:"Tom Whitfield",role:"Short courses",side:"Business",does:"produces",edge:BIZ,seed:9,
  skin:[236,200,174],hair:{style:"side",c:[196,160,96]},
  top:{kind:"sweater",c:[88,112,150]},bottom:{c:[70,64,58]},shoe:[60,44,34],build:{sh:76,hip:60,h:1.02}};

/* ---------- small helpers ---------- */
const fmtNum=n=>Math.round(n).toLocaleString("en-US");
const typeOn=(s,p)=>s.slice(0,Math.max(0,Math.min(s.length,Math.round(s.length*clamp(p,0,1)))));
const pulseAt=(t,t0,d)=>t>t0&&t<t0+(d||1.4)?Math.sin(Math.PI*(t-t0)/(d||1.4)):0;
function dark(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle="rgba(3,5,11,"+clamp(a,0,1)+")";ctx.fillRect(0,0,W,H);}
function fadeIn(ctx,S,t,d){if(t<(d||1.2)){setScreen(ctx,S);ctx.fillStyle="rgba(0,0,0,"+(1-ease(t/(d||1.2)))+")";ctx.fillRect(0,0,W,H);}}
function ring(ctx,x,y,r,col,a,lw,dash){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=lw||2;if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.restore();}
// a soft boundary: a band of light, for the fuzzy edge of a category
function fuzzyRing(ctx,x,y,r,col,a,wd){if(a<=0.01)return;wd=wd||60;ctx.save();ctx.globalAlpha*=a;const g=ctx.createRadialGradient(x,y,Math.max(1,r-wd),x,y,r+wd);g.addColorStop(0,rgba(col,0));g.addColorStop(0.5,rgba(col,0.22));g.addColorStop(1,rgba(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r+wd,0,TAU);ctx.fill();ctx.restore();}
function tick_(ctx,x,y,s,col,a){withA(ctx,a,()=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=s*0.16;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-s*0.4,y);ctx.lineTo(x-s*0.1,y+s*0.3);ctx.lineTo(x+s*0.45,y-s*0.35);ctx.stroke();});}
function cross_(ctx,x,y,s,col,a){withA(ctx,a,()=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=s*0.16;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-s*0.35,y-s*0.35);ctx.lineTo(x+s*0.35,y+s*0.35);ctx.moveTo(x+s*0.35,y-s*0.35);ctx.lineTo(x-s*0.35,y+s*0.35);ctx.stroke();});}
// an arrow along a gentle curve, drawn up to p (0..1), with a head at its end
function arrowTo(ctx,x0,y0,x1,y1,col,a,o){o=o||{};const p=o.p==null?1:o.p;if(a<=0.01||p<=0)return;const bend=o.bend||0,mx=(x0+x1)/2-(y1-y0)*bend,my=(y0+y1)/2+(x1-x0)*bend;
  const pts=[];for(let i=0;i<=24;i++){const u=i/24*p,v=1-u;pts.push([v*v*x0+2*v*u*mx+u*u*x1,v*v*y0+2*v*u*my+u*u*y1]);}
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||2.4;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=8;
  ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.setLineDash([]);
  if(p>=0.98&&!o.nohead){const q=pts[pts.length-1],r=pts[pts.length-3],an=Math.atan2(q[1]-r[1],q[0]-r[0]),hs=o.head||14;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0]-hs*Math.cos(an-0.42),q[1]-hs*Math.sin(an-0.42));ctx.lineTo(q[0]-hs*Math.cos(an+0.42),q[1]-hs*Math.sin(an+0.42));ctx.closePath();ctx.fill();}
  ctx.restore();}
// wrapped text: returns the lines it drew, so callers can size a box
function wrapT(ctx,s,x,y,maxW,o){o=o||{};const sz=o.size||24,lh=o.lh||sz*1.32;ctx.save();ctx.font=font(o.w||600,sz,o.f);const words=s.split(" "),lines=[];let cur="";
  words.forEach(wd=>{const tr=cur?cur+" "+wd:wd;if(ctx.measureText(tr).width>maxW&&cur){lines.push(cur);cur=wd;}else cur=tr;});if(cur)lines.push(cur);ctx.restore();
  if(!o.measure)lines.forEach((l,i)=>T(ctx,l,x,y+i*lh,o));return lines;}

/* ---------- the past and the present ---------- */
// the past: a warm, dark ground, like the inside of a museum case, with dust in the light
function histBg(ctx,S,t,o){o=o||{};setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,o.top||"#1a110a");g.addColorStop(1,o.bottom||"#07050a");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const r=ctx.createRadialGradient(W*0.5,H*0.35,40,W*0.5,H*0.45,W*0.7);r.addColorStop(0,"rgba(255,200,140,"+(o.light==null?0.10:o.light)+")");r.addColorStop(1,"rgba(255,200,140,0)");ctx.fillStyle=r;ctx.fillRect(0,0,W,H);
  for(let i=0;i<46;i++){const x=(hash(i,3)*W+t*(6+hash(i,4)*10))%W,y=(hash(i,5)*H+Math.sin(t*0.3+i)*20+H)%H,s=1+hash(i,6)*2.2;ctx.fillStyle="rgba(255,220,170,"+(0.05+0.12*hash(i,7))+")";ctx.beginPath();ctx.arc(x,y,s,0,TAU);ctx.fill();}}
// a label for a moment in the past: a date and a place, in the corner of a history scene
function yearTag(ctx,x,y,s,col,a){if(a==null)a=1;if(a<=0.01)return;withA(ctx,a,()=>{const c=col||CLAY,w=tw(ctx,s,20,500,"mono")+40;glass(ctx,x,y-22,w,44,22,c,{glow:14,ea:0.8,fill:"rgba(26,16,10,0.9)"});ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x+18,y,5,0,TAU);ctx.fill();T(ctx,s,x+30,y+7,{f:"mono",w:500,size:20,color:rgba(c,1)});});}
// the series' mark: four dots at the heights of its four notes (1, 5, 6, 3)
function motifDots(ctx,x,y,s,col,a,p){if(a<=0.01)return;const hs=[0,7,9,4];withA(ctx,a,()=>{hs.forEach((h,i)=>{const q=clamp((p==null?1:p)*4-i,0,1);if(q<=0)return;const cx=x+(i-1.5)*s*1.4,cy=y-h*s*0.16;glow(ctx,cx,cy,s*1.6,col,0.35*q);ctx.fillStyle=rgba(col,q);ctx.beginPath();ctx.arc(cx,cy,s*0.36*q,0,TAU);ctx.fill();});});}
// the title card, over whatever the chapter is drawing: fades the picture down, then the title up
function seriesTitle(ctx,S,t,t0,title,sub,col){const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;dark(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{glow(ctx,960,470,480,col,0.08);motifDots(ctx,960,392,22,col,1,(t-t0-0.5)/1.6);T(ctx,"FROM WORDS TO DATA",960,452,{w:800,size:24,align:"center",color:rgba(col,0.95)});
    T(ctx,title,960,550,{w:800,size:96,align:"center"});if(sub)T(ctx,sub,960,614,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)});});}
function endCard(ctx,S,t,t0,title,col,line){const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;dark(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)T(ctx,line,960,430,{w:700,size:40,align:"center"});motifDots(ctx,960,540,16,col,0.9,1);T(ctx,title,960,612,{w:800,size:44,align:"center",color:rgba(col,1)});
    T(ctx,"From words to data · Learning Data",960,660,{w:600,size:22,align:"center",color:rgba(SOFT,0.9)});});}

/* ---------- counting: the offices and their numbers ---------- */
// one office's answer: its name, its number, and (when known) what it counted
function officeCard(ctx,x,y,w,k,num,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const of=OFFICE[k],c=of.c,h=o.h||200;
  withA(ctx,a,()=>{if(o.hi)glow(ctx,x+w/2,y+h/2,w*0.7,c,0.28*o.hi);glass(ctx,x,y,w,h,18,c,{glow:14+10*(o.hi||0),ea:0.75,fill:"rgba(7,12,24,0.93)"});
    ctx.fillStyle=rgba(c,1);rr(ctx,x+18,y+22,6,30,3);ctx.fill();T(ctx,o.name||of.n,x+36,y+46,{w:700,size:24,color:rgba(SOFT,1)});
    T(ctx,num,x+24,y+128,{w:800,size:o.big||72,color:rgba(c,1)});
    if(o.meaning)withA(ctx,o.mA==null?1:o.mA,()=>wrapT(ctx,o.meaning,x+24,y+166,w-44,{w:600,size:18,color:rgba(INK,0.9)}));
    if(o.ok)withA(ctx,o.ok,()=>{ctx.fillStyle="rgba(7,12,24,0.95)";ctx.beginPath();ctx.arc(x+w-30,y+34,20,0,TAU);ctx.fill();ring(ctx,x+w-30,y+34,20,GOOD,1,2);tick_(ctx,x+w-30,y+35,26,GOOD,1);});});}

/* ---------- the credential: the series' thread ---------- */
// a wax seal: a disc of wax with a pressed ring and a mark; press (0..1) squashes it into place
function waxSeal(ctx,x,y,r,col,a,press,mark){if(a<=0.01)return;const c=col||WAX,pr=press==null?1:press;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);const sc=0.6+0.4*ease(pr);ctx.scale(sc,sc);
  ctx.fillStyle=rgba(mix(c,[0,0,0],0.35),1);ctx.beginPath();for(let i=0;i<=40;i++){const an=i/40*TAU,rr_=r*(1.08+0.06*Math.sin(an*7+1.3)+0.04*Math.sin(an*13));ctx.lineTo(Math.cos(an)*rr_,Math.sin(an)*rr_);}ctx.fill();
  const g=ctx.createRadialGradient(-r*0.3,-r*0.3,r*0.1,0,0,r);g.addColorStop(0,rgba(mix(c,[255,255,255],0.3),1));g.addColorStop(1,rgba(c,1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*0.86,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(mix(c,[0,0,0],0.45),0.9);ctx.lineWidth=r*0.06;ctx.beginPath();ctx.arc(0,0,r*0.66,0,TAU);ctx.stroke();
  T(ctx,mark||"✦",0,r*0.18,{w:800,size:r*0.62,align:"center",color:rgba(mix(c,[0,0,0],0.5),0.95)});ctx.restore();});}
/* a credential, as each age made it: o.era is "tablet" (clay), "wax" (a sealed letter), "paper" (a diploma), "transcript", "badge" or "digital".
   Its parts are the series' model: who issued it, who holds it, what it claims, the evidence, the date.
   A digital card says "signed" under its seal: o.signed gives that word in another language, or false leaves it out. */
function credCard(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const era=o.era||"digital",h=o.h||Math.round(w*0.68),hl=o.hl||{};
  const rowsF=[["issuer",o.issuer],["holder",o.holder],["claim",o.claim],["evidence",o.evidence],["date",o.date]].filter(r=>r[1]);
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
    if(era==="digital"||era==="badge"){glass(ctx,0,0,w,h,18,o.col||TRUST,{glow:16,ea:0.8,fill:"rgba(7,12,24,0.94)"});}
    else{const base=era==="tablet"?[150,112,78]:era==="wax"?[222,204,168]:[240,232,214];ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=24;ctx.fillStyle=rgba(base,1);rr(ctx,0,0,w,h,era==="tablet"?22:6);ctx.fill();ctx.shadowBlur=0;
      const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,255,255,0.10)");g.addColorStop(1,"rgba(0,0,0,0.16)");ctx.fillStyle=g;rr(ctx,0,0,w,h,era==="tablet"?22:6);ctx.fill();
      if(era==="paper"){ctx.strokeStyle="rgba(150,120,60,0.5)";ctx.lineWidth=2;rr(ctx,10,10,w-20,h-20,4);ctx.stroke();}}
    const dk=era==="digital"||era==="badge",ink=dk?rgba(INK,0.95):(era==="tablet"?"rgba(60,36,20,0.9)":"rgba(52,40,30,0.92)"),lab=dk?rgba(SOFT,1):(era==="tablet"?"rgba(70,44,26,0.7)":"rgba(110,86,54,0.9)");
    let yy=o.title?70:42;if(o.title)T(ctx,o.title,w/2,40,{w:800,size:o.ts||22,align:"center",color:dk?rgba(o.col||TRUST,1):ink});
    rowsF.forEach(([k,v],i)=>{const on=hl[k]||0,ry=yy+i*(o.rh||34);if(on>0){const top=o.title?Math.max(ry-24,50):ry-24;ctx.fillStyle=dk?rgba(o.col||TRUST,0.16*on):"rgba(200,140,40,"+(0.22*on)+")";rr(ctx,12,top,w-24,ry+8-top,8);ctx.fill();}
      T(ctx,k,24,ry,{f:"mono",w:500,size:17,color:lab});T(ctx,v,120,ry,{w:700,size:18,color:ink});});
    if(era==="wax"||era==="paper")waxSeal(ctx,w-50,h-46,28,WAX,1,o.press==null?1:o.press);
    if(era==="digital"){const sx=w-46,sy=h-40;ctx.strokeStyle=rgba(o.col||TRUST,0.9);ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU+Math.PI/6;ctx.lineTo(sx+Math.cos(an)*20,sy+Math.sin(an)*20);}ctx.closePath();ctx.stroke();T(ctx,"✓",sx,sy+7,{w:800,size:20,align:"center",color:rgba(o.col||TRUST,1)});if(o.signed!==false)T(ctx,o.signed||"signed",sx,sy+36,{f:"mono",w:500,size:12,align:"center",color:rgba(SOFT,1)});}
    if(era==="badge"){const bx=w-60,by=46;ctx.fillStyle=rgba(o.col||TRUST,0.9);ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU;ctx.lineTo(bx+Math.cos(an)*26,by+Math.sin(an)*26);}ctx.closePath();ctx.fill();T(ctx,"★",bx,by+8,{w:800,size:22,align:"center",color:"#0a1020"});}
    if(era==="tablet"){ctx.fillStyle="rgba(60,36,20,0.35)";for(let i=0;i<18;i++){const px=20+hash(i,2)*(w-40),py=h-30-hash(i,3)*20;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+10,py+4);ctx.lineTo(px,py+8);ctx.fill();}}
    ctx.restore();});return h;}

/* ---------- paper and pencil: agreeing, before any system ---------- */
function sheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||-0.012);ctx.translate(-w/2,-h/2);
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=34;ctx.shadowOffsetY=10;ctx.fillStyle=o.fill||"#efe8da";ctx.fillRect(0,0,w,h);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,250,235,0.35)");g.addColorStop(1,"rgba(120,100,70,0.12)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  if(!o.plain){ctx.strokeStyle="rgba(90,130,190,0.16)";ctx.lineWidth=1;for(let yy=70;yy<h-20;yy+=38){ctx.beginPath();ctx.moveTo(24,yy);ctx.lineTo(w-24,yy);ctx.stroke();}ctx.strokeStyle="rgba(200,80,80,0.22)";ctx.beginPath();ctx.moveTo(64,0);ctx.lineTo(64,h);ctx.stroke();}
  ctx.restore();});}
// graphite text, written out as p goes from 0 to 1
function pencilText(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;T(ctx,typeOn(s,p),x,y,{w:o.w||600,size:o.size||26,align:o.align,color:o.color||"rgba(52,48,46,0.92)"});}
// a box drawn in pencil: two slightly different strokes, drawn round as p goes from 0 to 1
function pencilBox(ctx,x,y,w,h,name,p,o){o=o||{};if(p<=0)return;const per=2*(w+h),pts=[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]];
  const strokeTo=(jit,al)=>{let left=per*clamp(p,0,1);ctx.beginPath();ctx.moveTo(x+jit,y-jit);for(let i=1;i<5&&left>0;i++){const a0=pts[i-1],a1=pts[i],L=Math.hypot(a1[0]-a0[0],a1[1]-a0[1]),f=Math.min(1,left/L);ctx.lineTo(lerp(a0[0],a1[0],f)+jit*(i%2?1:-1),lerp(a0[1],a1[1],f)+jit*(i%2?-1:1));left-=L;}ctx.strokeStyle="rgba(58,54,52,"+al+")";ctx.stroke();};
  ctx.save();ctx.lineWidth=2.2;ctx.lineCap="round";strokeTo(0,0.85);ctx.lineWidth=1.2;strokeTo(1.6,0.45);ctx.restore();
  withA(ctx,fin(p,0.7,0.3),()=>T(ctx,name,x+w/2,y+h/2+(o.sub?-2:9),{w:700,size:o.size||26,align:"center",color:o.color||"rgba(46,42,40,0.95)"}));
  if(o.sub)withA(ctx,fin(p,0.8,0.2),()=>T(ctx,o.sub,x+w/2,y+h/2+26,{w:600,size:16,align:"center",color:"rgba(90,84,78,0.95)"}));}
// "is a kind of": a line from the kind to the broader kind, with a hollow triangle at the broader end
function isa(ctx,x0,y0,x1,y1,p,col,o){o=o||{};if(p<=0)return;const c=col||[58,54,52],a=o.a==null?1:o.a,x=lerp(x0,x1,clamp(p,0,1)),y=lerp(y0,y1,clamp(p,0,1));
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(c,0.9);ctx.lineWidth=o.lw||2.2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();
  if(p>=0.98){const an=Math.atan2(y1-y0,x1-x0),s=o.s||16;ctx.fillStyle=o.fill||"#efe8da";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-s*Math.cos(an-0.5),y1-s*Math.sin(an-0.5));ctx.lineTo(x1-s*Math.cos(an+0.5),y1-s*Math.sin(an+0.5));ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();}

/* ---------- the triangle: a word points to an idea, and the idea to things ---------- */
// o: word, idea (a label under the idea), thing (a function drawing the thing at its corner), and how far each part is drawn
function trio(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||KIND,wx=cx-300*s,wy=cy+170*s,ix=cx,iy=cy-190*s,hx=cx+300*s,hy=cy+170*s;
  withA(ctx,a,()=>{const e1=o.e1==null?1:o.e1,e2=o.e2==null?1:o.e2,e3=o.e3==null?1:o.e3;
    ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=3*s;ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;
    if(e1>0){ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(lerp(wx,ix,e1),lerp(wy,iy,e1));ctx.stroke();}
    if(e2>0){ctx.beginPath();ctx.moveTo(ix,iy);ctx.lineTo(lerp(ix,hx,e2),lerp(iy,hy,e2));ctx.stroke();}
    if(e3>0){ctx.setLineDash([10*s,12*s]);ctx.strokeStyle=rgba(o.gapCol||EDGE_,0.85*(o.gapA==null?1:o.gapA));ctx.shadowColor=rgba(o.gapCol||EDGE_,0.6);ctx.beginPath();ctx.moveTo(wx+60*s,wy);ctx.lineTo(lerp(wx+60*s,hx-60*s,e3),hy);ctx.stroke();ctx.setLineDash([]);}
    ctx.restore();
    withA(ctx,o.ia==null?1:o.ia,()=>{glow(ctx,ix,iy,120*s,col,0.45+0.15*Math.sin((o.t||0)*2));ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),0.95);ctx.beginPath();ctx.arc(ix,iy,30*s,0,TAU);ctx.fill();
      T(ctx,o.idea||"idea",ix,iy-56*s,{w:800,size:24*s,align:"center",color:rgba(col,1)});});
    withA(ctx,o.wa==null?1:o.wa,()=>{const ws=o.word||"word",ww=tw(ctx,ws,30*s,800)+40*s;glass(ctx,wx-ww/2,wy-30*s,ww,60*s,14*s,col,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.93)"});T(ctx,ws,wx,wy+10*s,{w:800,size:30*s,align:"center"});T(ctx,o.wordLab||"word",wx,wy+64*s,{w:700,size:20*s,align:"center",color:rgba(SOFT,1)});});
    withA(ctx,o.ha==null?1:o.ha,()=>{if(o.thing)o.thing(ctx,hx,hy,s);T(ctx,o.thingLab||"thing",hx,hy+(o.thingDy||64)*s,{w:700,size:20*s,align:"center",color:rgba(SOFT,1)});});
    if(o.gapNote)withA(ctx,o.gapNote,()=>T(ctx,o.gapText||"the word never touches the thing",cx,wy+46*s,{w:700,size:22*s,align:"center",color:rgba(EDGE_,1)}));});}

/* ---------- words through time ---------- */
// a word, where it came from, and what it meant: shown as a ribbon from the old form to the word we use now
function etym(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,col=o.col||CLAY;
  withA(ctx,a,()=>{const ow=tw(ctx,o.old,26,700)+40,nw=tw(ctx,o.word,34,800)+44,gap=o.gap||260;
    glass(ctx,x,y-30,ow,60,30,col,{glow:10,ea:0.6,fill:"rgba(26,16,10,0.9)"});T(ctx,o.old,x+20,y+9,{w:700,size:26,color:rgba(col,1)});if(o.lang)T(ctx,o.lang,x+20,y-42,{f:"mono",w:500,size:16,color:rgba(col,0.85)});
    arrowTo(ctx,x+ow+14,y,x+ow+gap-14,y,col,0.9,{p:clamp(p*2,0,1),bend:0.12});
    withA(ctx,fin(p,0.45,0.3),()=>{glass(ctx,x+ow+gap,y-34,nw,68,34,KIND,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,o.word,x+ow+gap+22,y+12,{w:800,size:34});});
    if(o.gloss)withA(ctx,fin(p,0.25,0.35),()=>T(ctx,o.gloss,x+ow+gap/2,y+50,{w:600,size:20,align:"center",color:rgba(PARCH,0.95)}));});}

/* ---------- a sketch the series keeps: version 3 adds the credential ---------- */
// the credential and its kinds, as agreed on paper, drawn in pencil (paper=true) or as the films' glass boxes
const CRED3={cred:[960,330,"Credential"],award:[640,560,"Award"],micro:[960,560,"Microcredential"],badge:[1280,560,"Badge","when assessed"]};
function credKinds(ctx,o){o=o||{};const p=o.p||{},ox=o.ox||0,oy=o.oy||0,s=o.s||1,P=k=>[ox+CRED3[k][0]*s,oy+CRED3[k][1]*s];
  if(o.paper){const bw=250*s,bh=76*s,box=(k,q)=>{const[x,y]=P(k);pencilBox(ctx,x-bw/2,y-bh/2,bw,bh,CRED3[k][2],q,{sub:CRED3[k][3],size:26*s});};
    ["award","micro","badge"].forEach(k=>{const q=p[k]||0;if(q>0){const[x0,y0]=P(k),[x1,y1]=P("cred");isa(ctx,x0,y0-bh/2,x1+(x0-x1)*0.25,y1+bh/2,fin(q,0.6,0.4));}});
    ["cred","award","micro","badge"].forEach(k=>box(k,p[k]||0));return;}
  const E={};["cred","award","micro","badge"].forEach(k=>{const[x,y]=P(k);E[k]={x,y,name:CRED3[k][2],sub:CRED3[k][3],col:k==="cred"?TRUST:KIND,a:p[k]==null?1:p[k],s,hi:(o.hi||{})[k]||0};});
  ["award","micro","badge"].forEach(k=>{if(E[k].a>0.01){const b=entBox(ctx,E[k]),c=entBox(ctx,E.cred);isa(ctx,b.x,b.y-b.h/2,c.x+(b.x-c.x)*0.25,c.y+c.h/2,1,KIND,{a:E[k].a,fill:"#0a1020"});}});
  Object.values(E).forEach(e=>ent(ctx,e));}

/* ===== In the weeds of data crafting: the series' components =====
   A technical series for analytics engineers, in the same world as The Inner Life of Data and From words to data: the university,
   its platform, its people and the credential model. Drawn with the films' primitives (glass, T, tag, glow, withA, fin) and
   From words to data's (credCard, officeCard, kt_agent, kt_four, kt_glyph). Everything here is shared by the series' films;
   each film keeps its own pictures in its own file.
   Two looks carry the series' idea: the model is a blueprint (white lines on blue paper), and the building work is code,
   in files, on the films' dark glass. Teal is an AI agent's work; gold is a person's approval. */

/* ---------- colours ---------- */
// the series' colour (a new leaf), the blueprint's paper and lines, and the four layers of a dbt project
const WEED=[156,214,120],BPP=[28,74,150],BPL=[228,240,255];
const LAYER4=[["staging",[150,176,214]],["intermediate",[178,156,255]],["core",TRUST],["marts",[120,215,155]]];
const SRC3=[["student system",[110,170,255]],["learning platform",[126,224,140]],["short-course platform",[255,128,168]]];

/* ---------- titles ---------- */
// the series' mark: three blades of grass, drawn up as p goes from 0 to 1
function weedMark(ctx,x,y,s,col,a,p){if(a<=0.01)return;p=p==null?1:p;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineCap="round";ctx.lineWidth=s*0.16;ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  [[-0.7,0.9,-0.5],[0,1.25,0.15],[0.7,0.8,0.55]].forEach(([dx,h,bend],i)=>{const q=clamp(p*3-i*0.6,0,1);if(q<=0)return;const x0=x+dx*s,y0=y,x1=x0+bend*s*0.9*q,y1=y-h*s*q;
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(x0+bend*s*0.1,y0-h*s*0.6*q,x1,y1);ctx.stroke();});ctx.restore();});}
// the title card, over whatever the chapter is drawing: the series, who it's for, the film's title and its question
function weedsTitle(ctx,S,t,t0,title,sub,col){col=col||WEED;const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{glow(ctx,960,470,480,col,0.08);weedMark(ctx,960,400,30,col,1,(t-t0-0.5)/1.4);T(ctx,"IN THE WEEDS OF DATA CRAFTING",960,452,{w:800,size:24,align:"center",color:rgba(col,0.95)});
    T(ctx,title,960,550,{w:800,size:92,align:"center"});if(sub)T(ctx,sub,960,614,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)});
    withA(ctx,fin(t,t0+1.2,0.8),()=>tag(ctx,960,690,"a technical series for analytics engineers",col,{align:"center",size:20}));});}
function weedsEnd(ctx,S,t,t0,title,col,line){col=col||WEED;const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)T(ctx,line,960,430,{w:700,size:44,align:"center"});weedMark(ctx,960,556,22,col,0.95,1);T(ctx,title,960,622,{w:800,size:44,align:"center",color:rgba(col,1)});
    T(ctx,"In the weeds of data crafting · Learning Data",960,670,{w:600,size:22,align:"center",color:rgba(SOFT,0.9)});});}

/* ---------- the blueprint ---------- */
// blue paper with a faint grid, a white border and a title block; b (0..1) fades it in over whatever is under it
function bpPaper(ctx,x,y,w,h,b,o){o=o||{};if(b<=0.01)return;withA(ctx,b,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=30;ctx.shadowOffsetY=8;
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(mix(BPP,[255,255,255],0.06),1));g.addColorStop(1,rgba(mix(BPP,[0,0,0],0.22),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.strokeStyle=rgba(BPL,0.08);ctx.lineWidth=1;for(let gx=x+24;gx<x+w;gx+=32){ctx.beginPath();ctx.moveTo(gx,y);ctx.lineTo(gx,y+h);ctx.stroke();}for(let gy=y+24;gy<y+h;gy+=32){ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x+w,gy);ctx.stroke();}
  // paper grain: a few soft blotches where the print was uneven
  for(let i=0;i<14;i++){const bx=x+hash(i,21)*w,by=y+hash(i,22)*h,r=40+hash(i,23)*120,gg=ctx.createRadialGradient(bx,by,0,bx,by,r);gg.addColorStop(0,"rgba(10,30,70,0.12)");gg.addColorStop(1,"rgba(10,30,70,0)");ctx.fillStyle=gg;ctx.fillRect(bx-r,by-r,2*r,2*r);}ctx.restore();
  ctx.strokeStyle=rgba(BPL,0.85);ctx.lineWidth=2.2;ctx.strokeRect(x+14,y+14,w-28,h-28);
  if(o.title){const tw_=Math.min(360,w*0.42),th=64;ctx.strokeRect(x+w-14-tw_,y+h-14-th,tw_,th);ctx.beginPath();ctx.moveTo(x+w-14-tw_,y+h-14-th/2);ctx.lineTo(x+w-14,y+h-14-th/2);ctx.stroke();
    T(ctx,o.title,x+w-tw_,y+h-th+6,{f:"mono",w:500,size:16,color:rgba(BPL,0.95)});T(ctx,o.sub||"",x+w-tw_,y+h-th+38,{f:"mono",w:500,size:14,color:rgba(BPL,0.7)});}});}
// one entity of the model: glass (b=0) or drawn white on blue (b=1)
const BPE={learner:["Learner",KIND],cred:["Credential",TRUST],award:["Award",KIND]};
function bpBox(ctx,x,y,w,h,name,col,b,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const edge=mix(col,BPL,b);
  if(o.hi)glow(ctx,x+w/2,y+h/2,w*0.7,o.hiCol||col,0.3*o.hi);
  if(b<1){withA(ctx,1-b,()=>glass(ctx,x,y,w,h,14,col,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"}));}
  if(b>0){withA(ctx,b,()=>{ctx.fillStyle="rgba(20,60,130,0.35)";ctx.fillRect(x,y,w,h);ctx.strokeStyle=rgba(BPL,0.95);ctx.lineWidth=2.4;ctx.strokeRect(x,y,w,h);ctx.lineWidth=1;ctx.strokeRect(x+5,y+5,w-10,h-10);});}
  T(ctx,name,x+w/2,y+h/2+(o.sub?-2:9),{w:800,size:o.size||26,align:"center",color:rgba(mix(INK,BPL,b),1)});
  if(o.sub)T(ctx,o.sub,x+w/2,y+h/2+26,{f:"mono",w:500,size:15,align:"center",color:rgba(mix(SOFT,BPL,b),0.85)});});}
// the credential model: Learner holds Credential, which counts towards an Award. Positions around (cx,cy) at scale s.
// o.b: glass to blueprint; o.p: how much is drawn (boxes, then lines); o.hi: {learner, cred, award} highlights
function bpModel(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const b=o.b||0,p=o.p==null?1:o.p,hi=o.hi||{},w=230*s,h=84*s;
  const P={learner:[cx-390*s,cy-60*s],cred:[cx,cy-60*s],award:[cx+390*s,cy-60*s]};
  withA(ctx,a,()=>{const line=(k0,k1,lab,q)=>{if(q<=0)return;const[x0,y0]=P[k0],[x1,y1]=P[k1],xa=x0+w/2,xb=x1-w/2,col=mix(SK,BPL,b);ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4*s;ctx.beginPath();ctx.moveTo(xa,y0);ctx.lineTo(lerp(xa,xb,q),y1);ctx.stroke();
      if(q>=0.98){ctx.beginPath();ctx.moveTo(xb-16*s,y1-11*s);ctx.lineTo(xb,y1);ctx.lineTo(xb-16*s,y1+11*s);ctx.moveTo(xb-16*s,y1-13*s);ctx.lineTo(xb-16*s,y1+13*s);ctx.stroke();}ctx.restore();
      withA(ctx,fin(q,0.6,0.4),()=>T(ctx,lab,(xa+xb)/2,y0-14*s,{w:600,size:17*s,align:"center",color:rgba(mix(SOFT,BPL,b),0.95)}));};
    line("learner","cred","holds",clamp(p*3-1.6,0,1));line("cred","award","counts towards",clamp(p*3-2,0,1));
    ["learner","cred","award"].forEach((k,i)=>{const q=clamp(p*3-i*0.5,0,1);bpBox(ctx,P[k][0]-w/2,P[k][1]-h/2,w,h,BPE[k][0],BPE[k][1],b,{a:q,hi:hi[k]||0,size:26*s,sub:o.keys?o.keys[k]:null});});});
  return P;}

/* ---------- code, as files ---------- */
// a file card: a name, then lines of code typed out as p goes from 0 to 1; lines starting with "--" or "#" are comments
function codeFile(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const lh=o.lh||32,sz=o.size||19,h=o.h||(70+lines.length*lh),col=o.edge||[170,205,255];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.65,fill:"rgba(6,10,20,0.95)"});
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+16,y+16,10,10,3);ctx.fill();T(ctx,name,x+36,y+27,{f:"mono",w:500,size:16,color:rgba(col,1)});if(o.label)T(ctx,o.label,x+w-18,y+27,{w:700,size:15,align:"right",color:rgba(o.labelCol||SOFT,1)});
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+42,w-28,1.2);
    const n=o.p==null?lines.length:lines.length*o.p;lines.forEach((l,i)=>{if(i>=n)return;const yy=y+74+i*lh,q=clamp(n-i,0,1),cm=/^\s*(--|#)/.test(l),on=o.lit?o.lit[i]||0:0;
      if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.16);rr(ctx,x+12,yy-lh*0.7,w-24,lh*0.95,6);ctx.fill();});
      T(ctx,typeOn(l,q),x+22,yy,{f:"mono",w:500,size:sz,color:cm?rgba(SOFT,0.8):rgba(mix([200,225,255],o.litCol||TRUST,on*0.6),0.95)});});});return h;}

/* ---------- a dbt project: the lineage graph ---------- */
// about three hundred models in four columns (staging, intermediate, core, marts), laid out the same way every time.
// Each node is [column, x, y]; each edge joins a node to one or two in the column before it.
const LG=(()=>{const N=[118,112,18,52],nodes=[],edges=[],col=[];N.forEach((n,c)=>{col.push([]);for(let i=0;i<n;i++){const rows=Math.ceil(n/(c===2?1:c===3?2:4)),per=c===2?1:c===3?2:4,
    x=c*1+((i%per)-(per-1)/2)*0.16+(hash(i,c+40)-0.5)*0.05,y=(Math.floor(i/per)+0.5)/rows+(hash(i,c+50)-0.5)*0.4/rows;col[c].push(nodes.length);nodes.push([c,x,y]);}});
  nodes.forEach((nd,k)=>{if(nd[0]===0)return;const prev=col[nd[0]-1],m=nd[0]===2?3:2;for(let j=0;j<m;j++){const pick=prev[Math.floor(clamp(nd[2]+(hash(k,j+60)-0.5)*0.35,0,0.999)*prev.length)];edges.push([pick,k]);}});
  return{nodes,edges,col};})();
// o.p: how much has grown (left to right); o.core: the core nodes' glow; o.dim: dims everything; o.pick: {nodeIndex: 0..1} highlights
function lineageGraph(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,dim=o.dim||0,cw=w/4,pos=k=>{const n=LG.nodes[k];return[x+cw*(n[1]+0.5),y+h*n[2]];};
  withA(ctx,a,()=>{
    if(o.heads!==0)LAYER4.forEach(([nm,c],i)=>withA(ctx,clamp(p*4-i,0,1)*(o.heads==null?1:o.heads),()=>{T(ctx,nm,x+cw*(i+0.5),y-26,{w:800,size:22,align:"center",color:rgba(c,1)});ctx.fillStyle=rgba(c,0.05);rr(ctx,x+cw*i+12,y-6,cw-24,h+12,16);ctx.fill();}));
    ctx.lineWidth=1;LG.edges.forEach(([i,j])=>{const c=LG.nodes[j][0],q=clamp(p*4-c+0.2,0,1);if(q<=0)return;const[x0,y0]=pos(i),[x1,y1]=pos(j);ctx.strokeStyle=rgba(LAYER4[c][1],0.12*(1-0.7*dim));ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo(x0+cw*0.4,y0,x1-cw*0.4,y1,lerp(x0,x1,q),lerp(y0,y1,q));ctx.stroke();});
    LG.nodes.forEach((nd,k)=>{const c=nd[0],q=clamp(p*4-c-hash(k,70)*0.6,0,1);if(q<=0)return;const[px,py]=pos(k),pk=o.pick?o.pick[k]||0:0,core=c===2?(o.core||0):0,col=LAYER4[c][1],r=(c===2?7:4.2)*(0.4+0.6*q)*(1+0.5*pk);
      if(core>0||pk>0)glow(ctx,px,py,26+16*pk,c===2?TRUST:col,0.5*Math.max(core,pk));ctx.fillStyle=rgba(col,(0.55+0.45*Math.max(core,pk))*(1-0.75*dim*(1-Math.max(core,pk))));ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();});});
  return pos;}

/* ---------- the process: ten steps on a loop, in four phases ---------- */
const STEPS10=[["a question","?"],["the sources","src"],["the consumers","use"],["gaps · contracts","≠"],["tests first","✓"],["build in layers","≡"],["validate","="],["review · ship","PR"],["written once","1×"],["evolve","v2"]];
function stepPos(i,cx,cy,rx,ry){const an=-Math.PI/2+i/10*TAU;return[cx+Math.cos(an)*rx,cy+Math.sin(an)*ry];}
// the four phases the ten steps fall into, with their first and last step: ask, promise, build, keep ("declare it" is the first two, "then build it" the last two)
const PHASES4=[["Ask",0,2],["Promise",3,4],["Build",5,7],["Keep",8,9]];
const phaseOf=i=>PHASES4.findIndex(([,a,b])=>i>=a&&i<=b);
// each phase as an arc just inside the loop, under its steps, with its name inside: o.on[k] lights phase k, o.a fades them all,
// o.inset is how far inside the stations the arcs run, o.size the names' size, o.nameA fades the names alone, o.noNames draws the arcs alone
function phaseRing(ctx,cx,cy,rx,ry,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ins=o.inset==null?64:o.inset,ax=rx-ins,ay=ry-ins,an=k=>-Math.PI/2+k/10*TAU;
  withA(ctx,a,()=>PHASES4.forEach(([nm,f,l],k)=>{const on=o.on?o.on[k]||0:1,a0=an(f-0.36),a1=an(l+0.36),am=an((f+l)/2);
    ctx.save();ctx.strokeStyle=rgba(WEED,0.28+0.6*on);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.beginPath();ctx.ellipse(cx,cy,ax,ay,0,a0,a1);ctx.stroke();ctx.restore();
    const na=o.nameA==null?1:o.nameA;if(!o.noNames&&na>0.01){const sz=o.size||24,lx=cx+Math.cos(am)*(ax-sz*2.4),ly=cy+Math.sin(am)*(ay-sz*1.5)+sz*0.36;
      withA(ctx,na,()=>T(ctx,nm,lx,ly,{w:800,size:sz,align:"center",color:rgba(mix(SOFT,WEED,on),0.5+0.5*on)}));}}));}
// o.on[i]: each station lit; o.agent: where the agent is (0..10, along the loop); o.ticks[i]: gold ticks; o.teal[i]: teal dots;
// o.phases fades the four phases (default 1), o.phaseOn[k] lights each, o.phaseSize sizes their names
function stepLoop(ctx,cx,cy,rx,ry,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  ctx.save();ctx.strokeStyle=rgba(WEED,0.25);ctx.lineWidth=2;ctx.setLineDash([4,10]);ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.stroke();ctx.restore();
  phaseRing(ctx,cx,cy,rx,ry,{a:o.phases==null?1:o.phases,on:o.phaseOn,size:o.phaseSize});
  STEPS10.forEach(([nm,gl],i)=>{const on=o.on?o.on[i]||0:1,[px,py]=stepPos(i,cx,cy,rx,ry),r=40;withA(ctx,0.25+0.75*on,()=>{if(on>0)glow(ctx,px,py,r*2,WEED,0.2*on);
      ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();ring(ctx,px,py,r,mix(SOFT,WEED,on),1,2.4);
      T(ctx,gl,px,py+8,{w:800,size:gl.length>2?19:24,align:"center",color:rgba(mix(SOFT,WEED,on),1)});T(ctx,(i+1)+"",px-r+4,py-r+10,{f:"mono",w:500,size:15,color:rgba(SOFT,0.9)});
      const below=py>cy+ry*0.3,side=Math.abs(px-cx)>rx*0.5,lx=side?(px>cx?px+r+14:px-r-14):px,ly=side?py+7:(below?py+r+30:py-r-16);
      if(!o.noLabels)withA(ctx,o.labA==null?1:o.labA,()=>T(ctx,nm,lx,ly,{w:700,size:20,align:side?(px>cx?"left":"right"):"center",color:rgba(INK,0.95)}));});
    if(o.teal&&o.teal[i]>0)withA(ctx,o.teal[i],()=>{ctx.fillStyle=rgba(KT_AI,1);ctx.beginPath();ctx.arc(px+r*0.72,py-r*0.72,8,0,TAU);ctx.fill();});
    if(o.ticks&&o.ticks[i]>0)kt_gtick(ctx,px+r*0.78,py+r*0.7,13,o.ticks[i]);});
  if(o.agent!=null&&o.agentA>0){const k=o.agent,an=-Math.PI/2+k/10*TAU,ix=cx+Math.cos(an)*(rx-92),iy=cy+Math.sin(an)*(ry-82);
    kt_agent(ctx,ix,iy,18,t,{a:o.agentA});}});}

/* ---------- small things ---------- */
// a source system card, in its colour
function srcCard(ctx,x,y,w,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[nm,c]=SRC3[k];withA(ctx,a,()=>{glass(ctx,x,y,w,64,16,c,{glow:12,ea:0.75,fill:"rgba(7,12,24,0.93)"});
  ctx.fillStyle=rgba(c,1);rr(ctx,x+16,y+18,6,28,3);ctx.fill();T(ctx,nm,x+34,y+40,{w:700,size:21});});}
// a person's role, as a small label under them
function roleTag(ctx,x,y,id,a){withA(ctx,a==null?1:a,()=>{const P=PEOPLE[id];T(ctx,P.name.split(" ")[0],x,y,{w:800,size:24,align:"center"});T(ctx,P.role,x,y+28,{w:600,size:17,align:"center",color:rgba(SOFT,1)});});}

/* ---------- motion: springs, entrances, a camera that drifts, depth ---------- */
// a damped spring from 0 to 1: it overshoots a little (about 15%) and settles, instead of easing flat into place
function spring(p){if(p<=0)return 0;if(p>=1.6)return 1;return 1-Math.exp(-5.5*p)*Math.cos(9*p);}
// draws fn so that it arrives at t0 over d seconds: it fades in, grows from a little smaller and settles with a spring,
// around (cx,cy). With o.dy it also rises from below. Returns the arrival (0..1), for anything drawn with it.
function arrive(ctx,cx,cy,t,t0,fn,o){o=o||{};const d=o.d||0.75,p=(t-t0)/d;if(p<=0)return 0;const k=spring(p),a=clamp(p*2.5,0,1)*(o.a==null?1:o.a);if(a<=0.01)return 0;
  const sc=(o.from==null?0.86:o.from)+(1-(o.from==null?0.86:o.from))*k,dy=(o.dy||0)*(1-k);
  ctx.save();ctx.translate(cx,cy+dy);ctx.scale(sc,sc);ctx.translate(-cx,-cy);withA(ctx,a,fn);ctx.restore();return clamp(p,0,1);}
// the scene's camera: a slow push in towards a point, so no shot is ever quite still. Call after the background;
// overlays that reset the screen (captions, title and end cards, vignette) stay still.
function drift(ctx,t,sc,o){o=o||{};const u=ease(clamp(t/Math.max(1,sc.dur),0,1)),z=1+(o.z==null?0.035:o.z)*u,fx=o.x==null?960:o.x,fy=o.y==null?540:o.y;
  ctx.translate(fx+(o.px||0)*u,fy+(o.py||0)*u);ctx.scale(z,z);ctx.translate(-fx,-fy);}
// dust in the light, in three depths: nearer motes are larger and move further as the camera drifts, which gives depth
function motes(ctx,t,o){o=o||{};const col=o.col||[150,190,255],n=o.n||54;for(let i=0;i<n;i++){const d=0.4+0.6*hash(i,91),x=(hash(i,92)*W+t*(4+10*d)*(hash(i,93)>0.5?1:-1)+W*4)%W,y=(hash(i,94)*H+Math.sin(t*0.25+i)*14*d+H)%H;
  ctx.fillStyle=rgba(col,(0.035+0.08*d)*(o.a==null?1:o.a));ctx.beginPath();ctx.arc(x,y,0.8+2.4*d,0,TAU);ctx.fill();}}
/* In the weeds of data crafting: the series' people. The cast of When things go wrong and From words to data, plus one:
   Jun Park, the university's analytics engineer, who builds what Noor, the architect, owns. Drawn like the others
   (When things go wrong's character sheet); cyan, like everyone on the technical side. */
PEOPLE.jun={name:"Jun Park",role:"Analytics engineer",side:"Technical",does:"produces",edge:TECH,seed:10,
  skin:[226,186,150],hair:{style:"side",c:[24,22,26]},glasses:[40,44,54],
  top:{kind:"sweater",c:[62,120,112]},bottom:{c:[48,52,62]},shoe:[232,232,236],build:{sh:72,hip:58,h:0.99}};

/* ===== The same one, everywhere: the watercolour look =====
   Washes of pigment on warm paper, a pencil line, and colours that mean something: each role has its own, the same in every film,
   and the person, as the master record, is left as white paper and banded in her roles' colours. Backgrounds are daylight
   landscapes, soft, so the role colours are the strongest washes on screen. Text is dark ink on paper-light cards.
   Everything costly is painted once and kept: the paper, the pigment's grain, each place's background and each card's paper. Only
   the text and what moves are drawn every frame, so the site's player can draw the film live. Every name here starts with wc_ or WC,
   because every file of the film shares one script. */

/* ---------- colours ---------- */
const WC_PAPER=[251,247,238],WC_PENCIL=[58,54,66],WC_INK=[46,42,56],WC_MUTED=[100,96,112],WC_DARK=[30,26,40],WC_CARD=[253,251,245];
// the roles, the same in every film: student teal, applicant amber, researcher coral, tutor violet, alumna green, donor magenta
const WC_ROLE={student:[14,150,146],applicant:[226,150,10],researcher:[238,96,78],tutor:[126,86,220],alumna:[38,160,96],donor:[200,70,150]};
// text in a role's colour on paper, darkened to keep 4.5:1
const WC_ROLEINK={student:[0,112,108],applicant:[150,92,0],researcher:[184,56,40],tutor:[100,62,190],alumna:[22,120,68]};
// the industries: the university teal (the student's), health red, banking blue, energy yellow, retail orange, the public sector green-blue
const WC_IND={uni:[14,150,146],health:[214,66,74],bank:[52,112,204],energy:[232,184,24],retail:[240,130,40],public:[36,148,168]};
// the soft wash a person is edged in: cyan for the technical side, gold for the business side, a neutral grey-blue for the person herself
const WC_SIDE={tech:[100,176,240],biz:[244,188,70],none:[150,170,200]};
const WC_BADGE=[255,214,90];
// a cross, in red ink
const WC_NO=[184,56,40];
// the landscape, in daylight
const WCP={skyTop:[116,174,226],sun:[255,224,150],farForest:[124,162,154],far:[176,204,176],mid:[156,198,124],mid2:[146,192,118],near:[134,182,104],field:[222,216,142],
  water:[132,182,222],pine:[78,128,104],birchLeaf:[176,210,112],leaf:[114,172,104],leaf2:[146,190,114],trunk:[156,120,92],bark:WC_PAPER,barkMark:[72,68,74],
  wall:[248,242,230],roofDark:[104,108,126],spire:[90,94,114],pane:[112,134,176],door:[176,124,92],falu:[202,86,68],trim:WC_PAPER,roof:[120,108,116],
  farmDoor:[104,144,166],stoneGrey:[184,180,174],brick:[208,126,98],copper:[114,174,154],road:[238,218,176],coat:[112,126,174],skinTiny:[242,206,172],
  hat:[94,86,94],parchment:[250,240,216],parchInk:[64,52,46],leather:[176,112,82],flowerA:[255,255,255],flowerB:[255,214,80],flowerC:[156,146,232],
  city:[194,210,228],stone:[238,210,162],slate:[134,144,164],clock:[255,255,255],glass:[164,208,234],concrete:[228,226,222],plaster:[244,228,198],
  brickHouse:[214,126,102],blueHouse:[164,190,220],chimney:[194,118,98],tile:[134,118,124],blueDoor:[84,134,174],paving:[236,230,218],iron:[92,96,112],
  lampGlow:[255,232,172],mailbox:[218,92,78],lawn:[152,198,122],hedge:[98,152,102],wood:[172,138,102],wallIn:[242,232,214],floor:[214,196,170]};

/* ---------- randomness and textures ---------- */
function wc_rng(seed){let s=(seed>>>0)||1;return()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function wc_noise(seed){const R=wc_rng(seed),N=new Float32Array(1024);for(let i=0;i<1024;i++)N[i]=R();const g=(ix,iy)=>N[((ix*73856093)^(iy*19349663))&1023];
  return(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),tx=x-ix,ty=y-iy,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);return lerp(lerp(g(ix,iy),g(ix+1,iy),sx),lerp(g(ix,iy+1),g(ix+1,iy+1),sx),sy);};}
// the paper's tooth and fibres, near white, to multiply over a whole frame; k is how strongly it shows, and the corners darken a touch
function wc_paperTex(w,h,seed,k){const c=mkCanvas(w,h),x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data,n=wc_noise(seed),R=wc_rng(seed+5);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const q=(j*w+i)*4,v=n(i/2.3,j/2.3)*0.45+n(i/9,j/9)*0.35+n(i/60,j/60)*0.2,t=255-(Math.pow(v,2.4)*46+R()*6)*k,
    e=Math.pow(Math.hypot((i-w/2)/(w*0.62),(j-h*0.48)/(h*0.62)),2.2),vg=1-0.05*clamp(e-0.35,0,1);d[q]=t*vg;d[q+1]=(t-1*k)*(vg-0.003);d[q+2]=(t-3*k)*(vg-0.006);d[q+3]=255;}
  x.putImageData(im,0,0);x.lineCap="round";
  for(let i=0;i<w*h/2400;i++){const x0=R()*w,y0=R()*h,a=R()*TAU,l=5+R()*24;x.strokeStyle="rgba(130,118,100,"+((0.04+R()*0.07)*k)+")";x.lineWidth=0.5+R()*0.7;x.beginPath();x.moveTo(x0,y0);
    x.quadraticCurveTo(x0+Math.cos(a+0.5)*l*0.5,y0+Math.sin(a+0.5)*l*0.5,x0+Math.cos(a)*l,y0+Math.sin(a)*l);x.stroke();}
  return c;}
// pigment that settles in the paper's tooth: white with clustered specks, to multiply into washes
function wc_granTex(w,h,seed){const c=mkCanvas(w,h),x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data,n=wc_noise(seed),R=wc_rng(seed+3);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const q=(j*w+i)*4,v=n(i/4,j/4)*0.55+n(i/19,j/19)*0.45,sp=R()<0.05*v?R()*60:0,t=255-v*36-sp;d[q]=t;d[q+1]=t;d[q+2]=t;d[q+3]=255;}
  x.putImageData(im,0,0);return c;}
// soft blotches, as an alpha mask, for washes that dry unevenly
function wc_blotchTex(w,h,seed,scale,bias){const c=mkCanvas(w,h),x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data,n=wc_noise(seed);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const q=(j*w+i)*4,v=n(i/scale,j/scale)*0.6+n(i/(scale/2.7),j/(scale/2.7))*0.3+n(i/(scale/8),j/(scale/8))*0.1;
    d[q]=255;d[q+1]=255;d[q+2]=255;d[q+3]=clamp((v-0.22+bias)*1.7,0,1)*255;}
  x.putImageData(im,0,0);return c;}
// what is kept: the textures, each place's background, each card's paper, each white figure, and spare canvases
const WC={ready:false,bg:{},paint:{},card:{},tint:{},fig:{},buf:{}};
function wc_prep(){if(WC.ready)return;WC.gran=wc_granTex(W,H,17);WC.paper=wc_paperTex(W,H,23,0.42);WC.blotch=wc_blotchTex(480,270,31,60,0.05);WC.ready=true;}
function wc_buf(k,w,h){let c=WC.buf[k];if(!c)c=WC.buf[k]=mkCanvas(w,h);if(c.width!==w||c.height!==h){c.width=w;c.height=h;}const x=c.getContext("2d");x.setTransform(1,0,0,1,0,0);
  x.globalAlpha=1;x.globalCompositeOperation="source-over";x.filter="none";x.clearRect(0,0,w,h);return[c,x];}
// a texture's alpha, filled with one colour
function wc_tint(tex,col){const k=col.map(v=>v|0).join(",")+"|"+tex.width;if(WC.tint[k])return WC.tint[k];const c=mkCanvas(tex.width,tex.height),x=c.getContext("2d");
  x.fillStyle=rgba(col,1);x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation="destination-in";x.drawImage(tex,0,0);return WC.tint[k]=c;}

/* ---------- shapes: lists of points, so each can be painted as a wash ---------- */
const wc_multi=p=>Array.isArray(p[0][0]);
function wc_tr(ctx,pts){ctx.beginPath();for(const p of wc_multi(pts)?pts:[pts]){ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();}}
function wc_trOpen(ctx,p){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);}
function wc_bbox(pts){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of wc_multi(pts)?pts:[pts])for(const q of p){x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}
  return{x0,y0,x1,y1,w:x1-x0,h:y1-y0};}
function wc_rect(x,y,w,h){return[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];}
function wc_ell(cx,cy,rx,ry,n){n=n||32;const o=[];for(let i=0;i<n;i++){const a=i/n*TAU;o.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]);}return o;}
function wc_arched(x,y,w,h){const r=w/2,o=[[x,y+h],[x,y+r]];for(let i=1;i<14;i++){const a=Math.PI+i/14*Math.PI;o.push([x+r+Math.cos(a)*r,y+r+Math.sin(a)*r]);}o.push([x+w,y+r],[x+w,y+h]);return o;}
function wc_rrPts(x,y,w,h,r){const o=[],n=6;r=Math.min(r,w/2,h/2);[[x+w-r,y+r,-Math.PI/2],[x+w-r,y+h-r,0],[x+r,y+h-r,Math.PI/2],[x+r,y+r,Math.PI]].forEach(([cx,cy,a0])=>{
  for(let i=0;i<=n;i++){const a=a0+i/n*Math.PI/2;o.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}});return o;}
function wc_resample(pts,step){if(wc_multi(pts))return pts.map(p=>wc_resample(p,step));const o=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],
  L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L/step));for(let j=0;j<n;j++)o.push([lerp(a[0],b[0],j/n),lerp(a[1],b[1],j/n)]);}return o;}
function wc_jitter(pts,amp,seed,freq){if(wc_multi(pts))return pts.map((p,i)=>wc_jitter(p,amp,seed+i*7,freq));const n=wc_noise(seed);freq=freq||0.04;
  return pts.map(p=>[p[0]+(n(p[0]*freq,p[1]*freq)-0.5)*2*amp,p[1]+(n(p[1]*freq+31.7,p[0]*freq+11.3)-0.5)*2*amp]);}
// a tapered band along a centre line, for roads and paths
function wc_band(line,w0,w1){const L=[],R=[];for(let i=0;i<line.length;i++){const a=line[Math.max(0,i-1)],b=line[Math.min(line.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,
  w=lerp(w0,w1,i/(line.length-1))/2;L.push([line[i][0]-dy/l*w,line[i][1]+dx/l*w]);R.push([line[i][0]+dy/l*w,line[i][1]-dx/l*w]);}return L.concat(R.reverse());}
function wc_smooth(pts,n){const o=[];for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];for(let j=0;j<n;j++){const t=j/n,t2=t*t,t3=t2*t;
  o.push([0,1].map(k=>0.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3)));}}o.push(pts[pts.length-1]);return o;}
// a point along a polyline, at u (0..1) of its length
function wc_along(pts,u){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}let left=clamp(u,0,1)*L;
  for(let i=0;i<seg.length;i++){if(left<=seg[i]||i===seg.length-1){const k=seg[i]?clamp(left/seg[i],0,1):0;return[lerp(pts[i][0],pts[i+1][0],k),lerp(pts[i][1],pts[i+1][1],k)];}left-=seg[i];}return pts[0];}

/* ---------- painting ---------- */
const wc_lit=(c,k)=>mix(c,[255,255,255],k),wc_dim=(c,k)=>mix(c,[0,0,0],k);
// distance pales a colour towards the paper
const wc_haze=(c,depth)=>mix(c,WC_PAPER,(1-clamp(depth==null?1:depth,0,1))*0.55);
const WC_BARE={field:1,chipwash:1,swatch:1,mark:1,ribbon:1,dab:1};
const WC_LINED={build:1,door:1,trim:1,tree:1,trunk:1,cover:1,page:1,wall:1,coat:1,head:1,hat:1,limb:1,arm:1,iron:1,kerb:1,clock:1,paper:1,thing:1};
// a wash: the shape cleared to paper, then three layers of pigment that don't quite agree on the edge, a darker rim where the pigment
// dried, grain in the paper's tooth, and on larger shapes, blotches where it dried unevenly (offset by a remainder kept positive, so a
// wash that starts left of the frame is blotched to its edge); buildings, trees and people get a pencil line
function wc_wash(ctx,pts,col,o){o=o||{};col=wc_haze(col,o.depth);const d=o.depth==null?1:o.depth,a=(o.a==null?1:o.a)*0.95,rp=wc_resample(pts,8),b=wc_bbox(pts),seed=(o.seed||7)+Math.round(b.x0);
  if(!WC_BARE[o.kind]&&!o.bare){wc_tr(ctx,wc_jitter(rp,2,seed,0.022));ctx.fillStyle=rgba(WC_PAPER,1);ctx.fill();}
  ctx.save();ctx.globalCompositeOperation="multiply";
  if(o.flat||b.w<26){wc_tr(ctx,wc_jitter(rp,0.8,seed,0.08));ctx.fillStyle=rgba(col,a*0.85);ctx.fill();}
  else{for(let i=0;i<3;i++){wc_tr(ctx,wc_jitter(rp,2.5+i*2.2,seed+i*13,0.022+i*0.012));ctx.fillStyle=rgba(col,a*0.36);ctx.fill();}
    wc_tr(ctx,wc_jitter(rp,2,seed+99,0.03));ctx.lineWidth=2.4;ctx.strokeStyle=rgba(wc_dim(col,0.18),a*0.4);ctx.stroke();
    ctx.save();wc_tr(ctx,rp);ctx.clip();ctx.globalAlpha=0.55;ctx.drawImage(WC.gran,0,0,W,H);
    if(b.w>220&&o.kind!=="page"){ctx.globalAlpha=0.5*a;ctx.drawImage(wc_tint(WC.blotch,col),-(((seed%420)+420)%420),-((((seed*7)%300)+300)%300),W+420,H+300);
      ctx.globalAlpha=1;ctx.filter="blur(5px)";ctx.lineWidth=16;ctx.strokeStyle=rgba(col,a*0.2);wc_tr(ctx,rp);ctx.stroke();ctx.filter="none";}
    ctx.restore();}
  ctx.restore();
  if((o.kind==="land"||o.kind==="ground")&&!o.flat){const y0=Math.max(b.y0,0),y1=Math.min(b.y1,H);if(y1-y0>120){ctx.save();wc_tr(ctx,rp);ctx.clip();
    const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(WC_PAPER,0));g.addColorStop(0.35,rgba(WC_PAPER,0));g.addColorStop(1,rgba(WC_PAPER,0.3));ctx.fillStyle=g;ctx.fillRect(b.x0,y0,b.w,y1-y0);ctx.restore();}}
  if(o.line!==false&&d>=0.45&&WC_LINED[o.kind])wc_ink(ctx,wc_multi(pts)?pts[0]:pts,true,o.lw||(o.kind==="tree"?1.4:1.7),o.ink||WC_INK,0.75*d,seed,o.kind==="tree"?2:1.1);}
// a pencil line: two passes that don't quite agree
function wc_ink(ctx,pts,closed,lw,col,a,seed,amp){const p=wc_resample(pts,6);ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  for(const [k,aa,ww] of [[0,1,1],[1,0.45,0.55]]){const j=wc_jitter(p,amp==null?1.1:amp,(seed||3)+k*17,0.05);if(closed)wc_tr(ctx,j);else wc_trOpen(ctx,j);ctx.lineWidth=lw*ww;ctx.strokeStyle=rgba(col,a*aa);ctx.stroke();}
  ctx.restore();}
// a pencil line along an open path (o.closed: a loop), drawn on from its start as p goes from 0 to 1; its jitter is worked out once and kept
function wc_resampleOpen(pts,step){const o=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/step));
  for(let j=0;j<n;j++)o.push([lerp(a[0],b[0],j/n),lerp(a[1],b[1],j/n)]);}o.push(pts[pts.length-1]);return o;}
function wc_pencil(ctx,pts,p,o){o=o||{};if(p<=0)return;const q=o.closed?pts.concat([pts[0]]):pts,key=q.map(v=>v[0].toFixed(1)+","+v[1].toFixed(1)).join(";")+"|"+(o.seed||5)+"|"+(o.amp==null?1:o.amp);
  let J=WC.paint[key];if(!J){const r=wc_resampleOpen(q,5),amp=o.amp==null?1.0:o.amp;J=WC.paint[key]=[wc_jitter(r,amp,o.seed||5,0.05),wc_jitter(r,amp,(o.seed||5)+17,0.05)];}
  const n=Math.max(2,Math.round(J[0].length*clamp(p,0,1)));ctx.save();ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);
  J.forEach((pp,i)=>{ctx.beginPath();ctx.moveTo(pp[0][0],pp[0][1]);for(let k=1;k<n;k++)ctx.lineTo(pp[k][0],pp[k][1]);ctx.lineWidth=(o.lw||2.6)*(i?0.55:1);
    ctx.strokeStyle=rgba(o.col||WC_PENCIL,(o.a==null?0.9:o.a)*(i?0.45:1));ctx.stroke();});ctx.restore();}
function wc_glowAt(ctx,x,y,r,col,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}

/* ---------- land and sky ---------- */
// the sky: a wet wash of blue, drying unevenly, with clouds lifted out with a tissue, over the paper; hz is the horizon
function wc_sky(ctx,hz,seed,o){o=o||{};ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  const [t,tx]=wc_buf("sky",W,H);const g=tx.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(WCP.skyTop,0.85));g.addColorStop(0.7,rgba(WCP.skyTop,0.35));g.addColorStop(1,rgba(WCP.skyTop,0));
  tx.fillStyle=g;tx.fillRect(0,0,W,hz);tx.globalCompositeOperation="destination-in";tx.drawImage(WC.blotch,0,0,W,H);tx.globalCompositeOperation="destination-out";
  const R=wc_rng(seed*3+1);for(let i=0;i<(o.clouds==null?5:o.clouds);i++){const x=(o.cx||200)+R()*(o.cw||1500),y=(o.cy||90)+R()*(o.ch||220),s=0.6+R()*0.7;
    for(const [dx,dy,r] of [[-80,10,60],[-20,-20,80],[60,0,64],[0,20,90]]){const q=tx.createRadialGradient(x+dx*s,y+dy*s,r*s*0.3,x+dx*s,y+dy*s,r*s);q.addColorStop(0,"rgba(0,0,0,0.95)");q.addColorStop(1,"rgba(0,0,0,0)");
      tx.fillStyle=q;tx.fillRect(x+dx*s-r*s,y+dy*s-r*s,r*s*2,r*s*2);}}
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.drawImage(t,0,0);if(o.sun){wc_glowAt(ctx,o.sun[0],o.sun[1],120,[255,226,150],0.7);}ctx.restore();}
function wc_land(ctx,f,col,depth,o){const pts=[];for(let x=-60;x<=W+60;x+=10)pts.push([x,f(x)]);pts.push([W+60,H+60],[-60,H+60]);wc_wash(ctx,pts,col,Object.assign({depth,kind:"land"},o||{}));return pts;}
function wc_forest(ctx,base,col,depth,seed,o){o=o||{};const R=wc_rng(seed),pts=[];let x=-60;const hmax=o.h||24,wmax=o.w||16;
  while(x<=W+60){const by=base(x),h=hmax*(0.45+R()*0.55),w=wmax*(0.6+R()*0.5);pts.push([x,by]);pts.push([x+w*0.5,by-h]);pts.push([x+w,by]);x+=w*(0.55+R()*0.4);}
  pts.push([W+60,H+60],[-60,H+60]);wc_wash(ctx,pts,col,{depth,kind:"forest",line:false});}
function wc_lake(ctx,y0,x1,depth){const pts=[];for(let x=-60;x<=x1;x+=10)pts.push([x,y0+3*Math.sin(x/90)]);pts.push([x1+40,y0+6],[x1+40,y0+80],[-60,y0+80]);wc_wash(ctx,pts,WCP.water,{depth,kind:"water",line:false});}
function wc_fieldStrips(ctx,f,y0,y1,n,cols,depth,seed){const R=wc_rng(seed||3);let prev=x=>f(x)+y0;for(let i=1;i<=n;i++){const t=i/n,off=lerp(y0,y1,t*t),skew=(R()-0.5)*0.05,cur=x=>f(x)+off+(x-960)*skew;
  const pts=[];for(let x=-60;x<=W+60;x+=16)pts.push([x,prev(x)]);for(let x=W+60;x>=-60;x-=16)pts.push([x,cur(x)]);wc_wash(ctx,pts,cols[i%cols.length],{depth,kind:"field",line:false});prev=cur;}}
// tufts of grass in the near meadow
function wc_tufts(ctx,f,x0,x1,n,depth,seed){const R=wc_rng(seed||8);for(let i=0;i<n;i++){const x=lerp(x0,x1,R()),y=f(x)+20+R()*(H-f(x)-20),s=0.7+R()*0.8*((y-700)/380);
  ctx.save();ctx.strokeStyle=rgba(wc_haze(wc_dim(WCP.near,0.22),depth),0.85);ctx.lineWidth=2.2*s;ctx.lineCap="round";ctx.beginPath();
  for(const a of [-0.5,-0.15,0.2,0.55]){ctx.moveTo(x,y);ctx.quadraticCurveTo(x+a*10*s,y-12*s,x+a*22*s,y-(18+R()*10)*s);}ctx.stroke();ctx.restore();}}
// a soft shadow where something meets the ground
function wc_contact(ctx,x0,x1,y,depth,a){ctx.save();const cx=(x0+x1)/2,rx=(x1-x0)/2*1.08,g=ctx.createRadialGradient(cx,y,1,cx,y,rx);g.addColorStop(0,rgba([110,100,90],(a||0.28)*(0.4+0.6*depth)));
  g.addColorStop(1,rgba([110,100,90],0));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,y,rx,Math.max(6,rx*0.09),0,0,TAU);ctx.fill();ctx.restore();}

/* ---------- trees ---------- */
function wc_spruce(ctx,x,y,h,depth,col){col=col||WCP.pine;const w=h*0.44,tiers=5,L=[],R=[];
  for(let i=0;i<tiers;i++){const t=i/tiers,yy=y-h*0.08-t*h*0.86,hw=w*(1-t)*0.5+2,nx=y-h*0.08-(i+1)/tiers*h*0.86+h*0.06;L.push([x-hw,yy],[x-hw*0.42,nx]);R.unshift([x+hw*0.42,nx],[x+hw,yy]);}
  wc_wash(ctx,wc_rect(x-h*0.03,y-h*0.1,h*0.06,h*0.1),WCP.trunk,{depth,kind:"trunk",line:false});
  wc_wash(ctx,[[x-w*0.08,y-h*0.08]].concat(L,[[x,y-h]],R,[[x+w*0.08,y-h*0.08]]),col,{depth,kind:"tree"});}
function wc_birch(ctx,x,y,h,depth,lean){lean=lean||0;const top=[x+lean*h,y-h*0.82];
  wc_wash(ctx,[[x-h*0.026,y],[top[0]-h*0.01,top[1]],[top[0]+h*0.01,top[1]],[x+h*0.026,y]],WCP.bark,{depth,kind:"trunk",lw:1.5});
  const R=wc_rng(Math.round(x));for(let i=0;i<7;i++){const t=0.1+R()*0.75,cx=lerp(x,top[0],t),cy=lerp(y,top[1],t),ww=h*0.02*(1-t*0.5);
    wc_wash(ctx,[[cx-ww,cy],[cx+ww*0.6,cy-2],[cx+ww,cy+3],[cx-ww*0.4,cy+4]],WCP.barkMark,{depth,kind:"mark",line:false,flat:true});}
  const Q=wc_rng(Math.round(x*3+y)),parts=[];for(let i=0;i<9;i++){const a=Q()*TAU,r=Q()*h*0.17;parts.push(wc_ell(top[0]+Math.cos(a)*r*1.1,top[1]+h*0.12+Math.sin(a)*r*1.3,h*(0.1+Q()*0.06),h*(0.13+Q()*0.07),20));}
  wc_wash(ctx,parts,WCP.birchLeaf,{depth,kind:"tree"});}
function wc_roundTree(ctx,x,y,h,depth,col){col=col||WCP.leaf;wc_wash(ctx,[[x-h*0.04,y],[x-h*0.025,y-h*0.5],[x+h*0.025,y-h*0.5],[x+h*0.04,y]],WCP.trunk,{depth,kind:"trunk"});
  const R=wc_rng(Math.round(x*7+h)),parts=[wc_ell(x,y-h*0.62,h*0.3,h*0.26,30)];for(let i=0;i<6;i++){const a=R()*TAU;parts.push(wc_ell(x+Math.cos(a)*h*0.17,y-h*0.64+Math.sin(a)*h*0.15,h*(0.15+R()*0.07),h*(0.14+R()*0.06),24));}
  wc_wash(ctx,parts,col,{depth,kind:"tree"});}
function wc_treeRow(ctx,f,x0,x1,step,h,depth,seed,col){const R=wc_rng(seed||5);for(let x=x0;x<x1;x+=step*(0.6+R()*0.8)){const hh=h*(0.7+R()*0.5);if(R()<0.35)wc_spruce(ctx,x,f(x)+3,hh*1.3,depth);else wc_roundTree(ctx,x,f(x)+3,hh,depth,col);}}

/* ---------- buildings ---------- */
function wc_part(ctx,pts,col,depth,o){wc_wash(ctx,pts,col,Object.assign({depth,kind:"build"},o||{}));}
function wc_flat(ctx,pts,col,depth,kind){wc_wash(ctx,pts,col,{depth,kind:kind||"trim",line:false,flat:true});}
function wc_bars(ctx,x,y,w,h,col,lw,depth){ctx.save();ctx.strokeStyle=rgba(wc_haze(col,depth),0.95);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2,y+h);ctx.moveTo(x,y+h/2);ctx.lineTo(x+w,y+h/2);ctx.stroke();ctx.restore();}
// a Swedish country church: west tower and spire, steep nave roof, a lower chancel
function wc_church(ctx,x,y,k,depth){const P=WCP,tw=66*k,nw=196*k,cw=58*k;
  wc_part(ctx,wc_rect(x+tw+nw,y-64*k,cw,64*k),P.wall,depth);wc_part(ctx,[[x+tw+nw-4*k,y-64*k],[x+tw+nw+cw+8*k,y-64*k],[x+tw+nw+cw-10*k,y-108*k],[x+tw+nw+6*k,y-108*k]],P.roofDark,depth);
  wc_part(ctx,wc_rect(x+tw,y-82*k,nw,82*k),P.wall,depth);wc_part(ctx,[[x+tw-6*k,y-82*k],[x+tw+nw+10*k,y-82*k],[x+tw+nw-22*k,y-152*k],[x+tw+12*k,y-152*k]],P.roofDark,depth);
  for(let i=0;i<3;i++)wc_flat(ctx,wc_arched(x+tw+40*k+i*56*k,y-66*k,18*k,40*k),P.pane,depth,"window");
  wc_part(ctx,wc_rect(x,y-150*k,tw,150*k),P.wall,depth);wc_part(ctx,[[x-5*k,y-150*k],[x+tw+5*k,y-150*k],[x+tw/2+4*k,y-272*k],[x+tw/2-4*k,y-272*k]],P.spire,depth);
  wc_wash(ctx,wc_arched(x+tw/2-14*k,y-50*k,28*k,50*k),P.door,{depth,kind:"door",lw:1.5});wc_flat(ctx,wc_arched(x+tw/2-7*k,y-126*k,14*k,24*k),P.pane,depth,"window");
  wc_flat(ctx,wc_rect(x+tw/2-1.8*k,y-298*k,3.6*k,30*k),P.spire,depth,"cross");wc_flat(ctx,wc_rect(x+tw/2-9*k,y-290*k,18*k,3.4*k),P.spire,depth,"cross");}
// a falu-red farmhouse, long side to us, white corners and window frames
function wc_farmhouse(ctx,x,y,k,depth){const P=WCP,w=200*k,hw=78*k;
  wc_part(ctx,wc_rect(x+138*k,y-114*k,16*k,40*k),P.trim,depth);wc_part(ctx,[[x-10*k,y-hw],[x+w+10*k,y-hw],[x+w-28*k,y-hw-64*k],[x+28*k,y-hw-64*k]],P.roof,depth);
  wc_part(ctx,wc_rect(x,y-hw,w,hw),P.falu,depth);wc_flat(ctx,wc_rect(x,y-hw,7*k,hw),P.trim,depth);wc_flat(ctx,wc_rect(x+w-7*k,y-hw,7*k,hw),P.trim,depth);
  for(const wx of [24,66,152]){wc_flat(ctx,wc_rect(x+wx*k,y-62*k,28*k,32*k),P.trim,depth);wc_flat(ctx,wc_rect(x+wx*k+4*k,y-58*k,20*k,24*k),P.pane,depth,"window");wc_bars(ctx,x+wx*k+4*k,y-58*k,20*k,24*k,P.trim,2*k,depth);}
  wc_flat(ctx,wc_rect(x+104*k,y-56*k,32*k,56*k),P.trim,depth);wc_wash(ctx,wc_rect(x+108*k,y-52*k,24*k,52*k),P.farmDoor,{depth,kind:"door",line:false});
  wc_flat(ctx,wc_rect(x-2*k,y-6*k,w+4*k,8*k),P.stoneGrey,depth,"base");}
// Uppsala's cathedral, far off: two west towers with tall copper spires
function wc_cathedral(ctx,x,y,k,depth){const P=WCP;wc_part(ctx,wc_rect(x+70*k,y-60*k,150*k,60*k),P.brick,depth);wc_part(ctx,[[x+66*k,y-60*k],[x+224*k,y-60*k],[x+210*k,y-92*k],[x+80*k,y-92*k]],P.copper,depth);
  for(const tx of [0,44]){wc_part(ctx,wc_rect(x+tx*k,y-118*k,30*k,118*k),P.brick,depth);wc_part(ctx,[[x+tx*k-2*k,y-118*k],[x+tx*k+32*k,y-118*k],[x+tx*k+16*k,y-210*k]],P.copper,depth);}
  wc_part(ctx,wc_rect(x+30*k,y-96*k,14*k,96*k),P.brick,depth);}
// the university's old building: a sandstone front, two rows of arched windows, and a clock tower
function wc_quad(ctx,x,y,depth,k){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const P=WCP,w=980,top=-300;
  wc_part(ctx,[[30,top-8],[w-30,top-8],[w-90,top-46],[90,top-46]],P.slate,depth);wc_part(ctx,wc_rect(0,top,w,300),P.stone,depth);
  wc_wash(ctx,wc_rect(-10,top-12,w+20,20),wc_lit(P.stone,0.12),{depth,kind:"trim",lw:2});wc_flat(ctx,wc_rect(-6,-150,w+12,10),wc_dim(P.stone,0.06),depth);
  for(const row of [0,1])for(let i=0;i<8;i++){const wx=44+i*120+(i>=4?40:0),wy=top+48+row*150;if(wx>380&&wx<600)continue;wc_wash(ctx,wc_arched(wx,wy,48,84),P.pane,{depth,kind:"window",lw:2});}
  const tx=410,tw=160;wc_part(ctx,wc_rect(tx,-440,tw,440),wc_lit(P.stone,0.04),depth);wc_part(ctx,[[tx-12,-440],[tx+tw+12,-440],[tx+tw/2+8,-560],[tx+tw/2-8,-560]],P.slate,depth);
  wc_flat(ctx,wc_rect(tx+tw/2-3,-596,6,40),P.slate,depth,"cross");wc_wash(ctx,wc_ell(tx+tw/2,-372,40,40,40),P.clock,{depth,kind:"clock",lw:2.5});
  ctx.strokeStyle=rgba(WC_INK,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(tx+tw/2,-372);ctx.lineTo(tx+tw/2,-400);ctx.moveTo(tx+tw/2,-372);ctx.lineTo(tx+tw/2+20,-366);ctx.stroke();
  wc_wash(ctx,wc_arched(tx+tw/2-44,-150,88,150),P.door,{depth,kind:"door",lw:2});wc_flat(ctx,wc_rect(tx-14,-10,tw+28,12),wc_lit(P.stone,0.1),depth);ctx.restore();}
function wc_glassWing(ctx,x,y,w,h,depth){const P=WCP;wc_part(ctx,wc_rect(x,y-h,w,h),P.glass,depth,{kind:"glass"});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.glass,0.35),0.7);ctx.lineWidth=3;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(x+i*w/5,y-h);ctx.lineTo(x+i*w/5,y);ctx.stroke();}
  for(let j=1;j<4;j++){ctx.beginPath();ctx.moveTo(x,y-h+j*h/4);ctx.lineTo(x+w,y-h+j*h/4);ctx.stroke();}ctx.restore();wc_wash(ctx,wc_rect(x-8,y-h-14,w+16,16),P.concrete,{depth,kind:"trim",lw:2});}
// a terraced house, long side to the street
function wc_terrace(ctx,x,y,w,col,depth,o){o=o||{};const k=o.k||1,P=WCP,top=-230;ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  wc_part(ctx,wc_rect(w*0.68,top-112,22,60),P.chimney,depth);wc_part(ctx,[[-6,top],[w+6,top],[w-40,top-80],[40,top-80]],P.tile,depth);wc_part(ctx,wc_rect(0,top,w,230),col,depth);
  for(const [wx,wy] of [[28,40],[w-80,40],[28,140]]){wc_flat(ctx,wc_rect(wx-5,top+wy-5,62,74),P.trim,depth);wc_wash(ctx,wc_rect(wx,top+wy,52,64),P.pane,{depth,kind:"window",line:false});wc_bars(ctx,wx,top+wy,52,64,P.trim,3,depth);}
  wc_wash(ctx,wc_rect(w-86,top+124,62,106),o.door||P.door,{depth,kind:"door",lw:2});wc_flat(ctx,wc_rect(w-64,top+170,20,5),P.trim,depth,"slot");ctx.restore();}
function wc_skyline(ctx,base,col,depth,seed){const R=wc_rng(seed),pts=[[-60,base]];let x=-60;while(x<W+60){const w=60+R()*120,h=50+R()*150;pts.push([x,base-h],[x+w,base-h]);x+=w;
  if(R()<0.3){pts.push([x,base-h-30-R()*40],[x+14,base-h-30-R()*40]);x+=14;}}pts.push([W+60,base],[W+60,H+60],[-60,H+60]);wc_wash(ctx,pts,col,{depth,kind:"skyline",line:false});}
function wc_lamp(ctx,x,y,h,depth){const P=WCP;wc_wash(ctx,wc_rect(x-5,y-h,10,h),P.iron,{depth,kind:"iron",lw:1.5});wc_wash(ctx,[[x-24,y-h-6],[x+24,y-h-6],[x+16,y-h-44],[x-16,y-h-44]],P.iron,{depth,kind:"iron",lw:1.5});
  wc_flat(ctx,wc_rect(x-14,y-h-38,28,28),P.lampGlow,depth,"lampglass");}
// a letterbox, on a post
function wc_mailbox(ctx,x,y,depth){const P=WCP;wc_wash(ctx,wc_rect(x-7,y-150,14,150),P.iron,{depth,kind:"iron",lw:2});
  wc_part(ctx,[[x-48,y-150],[x+48,y-150],[x+48,y-206],[x+36,y-222],[x-36,y-222],[x-48,y-206]],P.mailbox,depth);wc_flat(ctx,wc_rect(x-30,y-196,60,8),wc_dim(P.mailbox,0.4),depth,"slot");}
// a Swedish roundpole fence: pairs of posts, and thin poles laid on the slant
function wc_fence(ctx,f,x0,x1,depth){const P=WCP;for(let x=x0;x<x1;x+=120){const y=f(x);for(const dx of [-4,4])wc_wash(ctx,wc_rect(x+dx-2.5,y-56,5,62),wc_dim(P.wood,0.15),{depth,kind:"post",lw:1.2});}
  for(let x=x0;x<x1;x+=19){const y=f(x);wc_wash(ctx,[[x-2,y-46],[x+3,y-48],[x+46,y-6],[x+41,y-4]],(Math.round(x/19)%3)?P.wood:wc_lit(P.wood,0.12),{depth,kind:"pole",lw:1});}}
// a small figure, for the past: a walker in a coat and hat, carrying a paper in the household ribbon's teal
function wc_walker(ctx,x,y,h,cloth,depth,o){o=o||{};const k=h/100,P=WCP;
  wc_wash(ctx,[[x-6*k,y-46*k],[x-14*k,y],[x-8*k,y],[x+1*k,y-36*k]],wc_dim(cloth,0.35),{depth,kind:"limb",lw:1.2});wc_wash(ctx,[[x+4*k,y-46*k],[x+16*k,y-2*k],[x+10*k,y],[x-3*k,y-38*k]],wc_dim(cloth,0.3),{depth,kind:"limb",lw:1.2});
  wc_wash(ctx,[[x-14*k,y-80*k],[x+12*k,y-80*k],[x+16*k,y-40*k],[x-16*k,y-40*k]],cloth,{depth,kind:"coat",lw:1.4});wc_wash(ctx,wc_ell(x,y-90*k,9*k,10*k,18),P.skinTiny,{depth,kind:"head",lw:1.2});
  wc_wash(ctx,[[x-13*k,y-96*k],[x+13*k,y-96*k],[x+9*k,y-104*k],[x-9*k,y-104*k]],P.hat,{depth,kind:"hat",lw:1.2});
  if(o.paper){wc_wash(ctx,[[x+12*k,y-70*k],[x+34*k,y-74*k],[x+36*k,y-58*k],[x+14*k,y-54*k]],P.parchment,{depth,kind:"paper",lw:1.2,flat:true});wc_flat(ctx,wc_rect(x+22*k,y-73*k,4*k,18*k),WC_ROLE.student,1,"ribbon");}
  wc_wash(ctx,[[x+8*k,y-78*k],[x+20*k,y-60*k],[x+15*k,y-56*k],[x+4*k,y-70*k]],cloth,{depth,kind:"arm",lw:1.2});}

/* ---------- what is kept ---------- */
// a picture painted once, by paint(ctx) on a w×h canvas (default the frame), and kept: every background, and anything still
function wc_kept(key,w,h,paint){let c=WC.bg[key];if(c)return c;wc_prep();c=WC.bg[key]=mkCanvas(w||W,h||H);const x=c.getContext("2d");paint(x);return c;}
// the paper's tooth, and a soft darkening at the corners, over the whole frame: the last thing every scene draws, in the frame's own space
function wc_paperOver(ctx,S){setScreen(ctx,S);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation="multiply";ctx.drawImage(WC.paper,0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}
// the film opens out of the paper, and each chapter's first moment
function wc_fadeIn(ctx,S,t,d){d=d||1.2;if(t<d){setScreen(ctx,S);ctx.fillStyle=rgba(WC_PAPER,1-ease(t/d));ctx.fillRect(0,0,W,H);}}
// a veil of paper over the scene, for the title and end cards
function wc_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle=rgba(WC_PAPER,clamp(a,0,1));ctx.fillRect(0,0,W,H);}

/* ---------- text ---------- */
// text in ink; size at least 28, as everywhere in the films
function wc_T(ctx,s,x,y,o){o=Object.assign({},o||{});if(!o.color)o.color=rgba(o.col||WC_INK,o.a==null?1:o.a);T(ctx,s,x,y,o);}
// handwriting: the same face, leaning, as a pen writes; p reveals it letter by letter
function wc_hand(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;const n=Math.ceil(s.length*clamp(p,0,1)),sub=s.slice(0,n);ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.2,1,0,0);
  wc_T(ctx,sub,0,0,{size:o.size||32,w:o.w||600,col:o.col||WCP.parchInk,align:o.align,a:o.a});ctx.restore();}

/* ---------- cards, chips, tags: paper, painted once, with the text drawn every frame ---------- */
// the paper of a card, a chip, a tag, a badge or an envelope: a pale card with a pencil edge; a chip is washed in its role's colour, a
// card wears its role's colour as a brushstroke behind its title (o.sw wide), and a role that hasn't started yet is dashed in its colour
function wc_panelPaint(x,w,h,o){const r=o.kind==="card"||o.kind==="sheet"?12:o.kind==="envelope"?4:h/2,pad=8;
  x.translate(pad,pad);wc_tr(x,wc_rrPts(0,0,w,h,r));x.fillStyle=rgba(o.fill||WC_CARD,o.dashed?0.92:0.95);x.fill();
  if(o.kind==="chip"&&!o.dashed&&o.role)wc_wash(x,wc_resample(wc_rect(4,4,w-8,h-8),10),mix(o.role,[255,255,255],0.2),{kind:"chipwash",line:false,a:0.74,seed:o.seed});
  if(o.kind==="card"&&o.role&&!o.dashed&&o.sw)wc_wash(x,wc_resample(wc_rect(16,o.sy||14,Math.min(w-30,o.sw),o.sh||46),10),o.role,{kind:"swatch",line:false,a:0.58,seed:o.seed});
  if(o.kind==="badge")wc_wash(x,wc_resample(wc_rect(2,2,w-4,h-4),8),o.role||WC_BADGE,{kind:"swatch",line:false,a:0.6,seed:o.seed});
  if(o.wash)wc_wash(x,wc_resample(wc_rect(6,6,w-12,h-12),10),o.wash,{kind:"chipwash",line:false,a:o.washA||0.3,seed:o.seed});
  if(o.dashed){x.save();wc_tr(x,wc_rrPts(2,2,w-4,h-4,r));x.setLineDash([10,9]);x.lineWidth=2.5;x.strokeStyle=rgba(o.role||WC_PENCIL,0.95);x.stroke();x.restore();}
  else wc_ink(x,wc_rrPts(0,0,w,h,Math.min(r,6)),true,o.kind==="tag"||o.kind==="badge"?1.5:2,WC_PENCIL,0.85,o.seed||Math.round(w+h),0.9);}
const WC_SC=2; // cards are kept at twice the frame's resolution, so they stay sharp when the camera moves in
function wc_panel(ctx,x,y,w,h,o){o=o||{};w=Math.round(w);h=Math.round(h);const key=[o.kind,w,h,o.role,o.dashed?1:0,o.sw|0,o.sy|0,o.sh|0,o.wash,o.washA,o.fill,o.seed|0].join("|");let c=WC.card[key];
  if(!c){wc_prep();c=WC.card[key]=mkCanvas((w+16)*WC_SC,(h+16)*WC_SC);const cx=c.getContext("2d");cx.scale(WC_SC,WC_SC);wc_panelPaint(cx,w,h,o);}
  ctx.drawImage(c,x-8,y-8,w+16,h+16);}
// a label: the paper tag, its text at 28 px or more; y is its middle; returns its width
function wc_tag(ctx,x,y,s,o){o=o||{};const size=o.size||30,wt=o.w||700,w=Math.round(tw(ctx,s,size,wt,o.f)+40),h=Math.round(size+22),x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  wc_panel(ctx,x0,y-h/2,w,h,{kind:"tag",role:o.role,wash:o.wash,washA:o.washA,seed:o.seed});wc_T(ctx,s,x0+20,y+size*0.36,{w:wt,size,f:o.f,col:o.col||WC_INK});return w;}
// the year and the place, in the top corner
function wc_year(ctx,x,y,s,a){if(a==null)a=1;if(a<=0.01)return;withA(ctx,a,()=>{const w=Math.round(tw(ctx,s,30,500,"mono")+76),h=56;wc_panel(ctx,x,y-h/2,w,h,{kind:"pill"});
  ctx.fillStyle=rgba([226,150,10],1);ctx.beginPath();ctx.arc(x+30,y,6.5,0,TAU);ctx.fill();wc_T(ctx,s,x+50,y+11,{w:500,size:30,f:"mono"});});}
// a badge: a short word on a yellow wash, such as "old" or "shared"
function wc_badge(ctx,x,y,s,o){o=o||{};const size=o.size||28,w=Math.round(tw(ctx,s,size,700)+28),h=42;wc_panel(ctx,x,y-h/2,w,h,{kind:"badge",role:o.role,seed:o.seed});
  wc_T(ctx,s,x+w/2,y+size*0.36,{w:700,size,align:"center",col:WC_DARK});return w;}
// a record as one system holds it: the role, the system's own key, and the contact it has on file: ticked once it's up to date (o.fresh), or
// with a badge (o.badge) while it's out of date
function wc_roleCard(ctx,x,y,w,h,role,title,id,contact,o){o=o||{};const col=WC_ROLE[role],tW=tw(ctx,title,30,800);
  wc_panel(ctx,x,y,w,h,{kind:"card",role:col,dashed:o.dashed,sw:tW+36,seed:o.seed});const lx=x+32;
  wc_T(ctx,title,lx,y+48,{w:800,size:30,col:o.dashed?WC_INK:WC_DARK});if(id)wc_T(ctx,id,x+w-24,y+48,{w:500,size:28,f:"mono",align:"right"});
  if(contact){const ok=o.fresh,s=(ok?"✓ ":"")+contact;wc_T(ctx,s,lx,y+96,{w:500,size:28,f:"mono",col:ok?WC_ROLEINK.student:WC_MUTED,a:o.ea==null?1:o.ea});
    if(!ok&&o.badge){const bw=tw(ctx,s,28,500,"mono");withA(ctx,o.ba==null?1:o.ba,()=>wc_badge(ctx,lx+bw+12,y+87,o.badge));}}
  else if(o.note)wc_T(ctx,o.note,lx,y+96,{w:600,size:28,col:WC_MUTED});}
// a role, dated: a chip in the role's wash, with its name and its dates
function wc_chip(ctx,x,y,w,h,role,label,sub,o){o=o||{};const col=WC_ROLE[role]||role;wc_panel(ctx,x,y,w,h,{kind:"chip",role:col,dashed:o.dashed,seed:o.seed});
  const lw=tw(ctx,label,30,800);wc_T(ctx,label,x+28,y+h/2+11,{w:800,size:30,col:WC_DARK});if(sub)wc_T(ctx," · "+sub,x+28+lw,y+h/2+10,{w:600,size:28,col:WC_DARK,a:0.88});}
// a contact point or an identifier: a big line, mono, and what it is under it
function wc_info(ctx,x,y,w,h,big,small,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"card",seed:o.seed,wash:o.wash,washA:o.washA});const lx=x+30;
  wc_T(ctx,big,lx,y+50,{w:o.mono===false?700:500,size:o.bigSize||30,f:o.mono===false?"sans":"mono",col:WC_DARK});wc_T(ctx,small,lx,y+96,{w:600,size:28,col:WC_MUTED});
  if(o.badge){const bw=tw(ctx,small,28,600);withA(ctx,o.ba==null?1:o.ba,()=>wc_badge(ctx,lx+bw+14,y+87,o.badge));}}
// a lane's name, and what it holds
function wc_laneHead(ctx,x,y,t,sub,o){o=o||{};const w=tw(ctx,t,36,800);wc_T(ctx,t,x,y,{w:800,size:36,col:WC_DARK});if(sub)wc_T(ctx,sub,x+w+20,y,{w:600,size:28,col:WC_MUTED});}
// an envelope; with o.label, a tag under it
function wc_envelope(ctx,x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);const w=Math.round(120*s),h=Math.round(80*s);wc_panel(ctx,-w/2,-h/2,w,h,{kind:"envelope"});
  ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-w/2+6,-h/2+6);ctx.lineTo(0,h*0.08);ctx.lineTo(w/2-6,-h/2+6);ctx.stroke();ctx.restore();}
// a dotted pencil line from one thing to another, leaving and arriving level (o.vertical: upright), drawn on as p goes from 0 to 1; returns its tip
function wc_link(ctx,x0,y0,x1,y1,col,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return null;const c1=o.vertical?[x0,(y0+y1)/2]:[(x0+x1)/2,y0],c2=o.vertical?[x1,(y0+y1)/2]:[(x0+x1)/2,y1],pts=[];
  for(let i=0;i<=24;i++){const t=i/24,u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,d=t*t*t;pts.push([a*x0+b*c1[0]+c*c2[0]+d*x1,a*y0+b*c1[1]+c*c2[1]+d*y1]);}
  const n=Math.max(2,Math.round(pts.length*clamp(p,0,1)));ctx.save();ctx.strokeStyle=rgba(col||WC_PENCIL,o.a==null?0.7:o.a);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.setLineDash(o.dash||[2,11]);
  ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();ctx.restore();return pts[n-1];}
// a tick, drawn in pencil as p goes from 0 to 1
function wc_tick(ctx,x,y,s,col,p,lw){p=p==null?1:p;if(p<=0)return;const a=[x-s*0.42,y],b=[x-s*0.1,y+s*0.32],c=[x+s*0.46,y-s*0.38],l1=Math.hypot(b[0]-a[0],b[1]-a[1]),l2=Math.hypot(c[0]-b[0],c[1]-b[1]),L=(l1+l2)*clamp(p,0,1);
  ctx.save();ctx.strokeStyle=rgba(col||WC_ROLEINK.alumna,1);ctx.lineWidth=lw||Math.max(3,s*0.15);ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);
  if(L<=l1)ctx.lineTo(lerp(a[0],b[0],L/l1),lerp(a[1],b[1],L/l1));else{ctx.lineTo(b[0],b[1]);ctx.lineTo(lerp(b[0],c[0],(L-l1)/l2),lerp(b[1],c[1],(L-l1)/l2));}ctx.stroke();ctx.restore();}
// a cross, the same way
function wc_cross(ctx,x,y,s,col,p){p=p==null?1:p;if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(col||WC_NO,1);ctx.lineWidth=Math.max(3,s*0.15);ctx.lineCap="round";
  const q=clamp(p*2,0,1),r=clamp(p*2-1,0,1);ctx.beginPath();ctx.moveTo(x-s*0.35,y-s*0.35);ctx.lineTo(lerp(x-s*0.35,x+s*0.35,q),lerp(y-s*0.35,y+s*0.35,q));
  if(r>0){ctx.moveTo(x+s*0.35,y-s*0.35);ctx.lineTo(lerp(x+s*0.35,x-s*0.35,r),lerp(y-s*0.35,y+s*0.35,r));}ctx.stroke();ctx.restore();}
// a pencil circle round something, drawn on: a loop that overshoots its start, as a hand draws one
function wc_ring(ctx,cx,cy,rx,ry,p,o){o=o||{};if(p<=0)return;const pts=[];for(let i=0;i<=60;i++){const u=i/60,a=-2.2+u*TAU*1.08,r=1+0.05*Math.sin(u*9)+0.04*u;pts.push([cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r]);}
  wc_pencil(ctx,pts,p,{col:o.col||WC_PENCIL,lw:o.lw||3.4,a:o.a==null?0.92:o.a,seed:o.seed||9,amp:1.4});}

/* ---------- the person, as the master record ---------- */
// the person cleared to white paper in a pencil line, gathering her roles' colours as bands; kept once per person and size. bands: [{col,
// dashed, a}] from the shoulders down; each band's a (0..1) lets it arrive, and o.a fades the whole figure
function wc_whiteFig(id,s){const key=id+"|"+s;if(WC.fig[key])return WC.fig[key];const P=PEOPLE[id],k=s*P.build.h,pad=44,w=Math.ceil(500*k+pad*2),h=Math.ceil(660*k+pad*2),fy=pad+650*k;
  const fig=mkCanvas(w,h),fx=fig.getContext("2d");WC_RAW=true;try{person(fx,id,w/2,fy,s,{pose:"ease",t:1.2});}finally{WC_RAW=false;}
  const M=mkCanvas(w,h),mx=M.getContext("2d");mx.drawImage(fig,0,0);mx.globalCompositeOperation="source-in";mx.fillStyle="#fff";mx.fillRect(0,0,w,h);
  const G=mkCanvas(w,h),gx=G.getContext("2d");gx.fillStyle="rgba(255,255,255,0.72)";gx.fillRect(0,0,w,h);gx.globalAlpha=0.2;gx.drawImage(fig,0,0);gx.globalAlpha=1;
  gx.globalCompositeOperation="destination-in";gx.drawImage(M,0,0);
  // the pencil line: the silhouette grown a little in pencil, less the silhouette
  const D=mkCanvas(w,h),dx=D.getContext("2d"),Tn=mkCanvas(w,h),tx=Tn.getContext("2d");tx.drawImage(M,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(WC_PENCIL,1);tx.fillRect(0,0,w,h);
  for(let i=0;i<24;i++){const a=i/24*TAU;dx.drawImage(Tn,Math.cos(a)*1.8,Math.sin(a)*1.8);}dx.drawImage(Tn,0,0);dx.globalCompositeOperation="destination-out";dx.drawImage(M,0,0);
  return WC.fig[key]={w,h,fy,k,M,G,D};}
function wc_white(ctx,id,x,y,s,bands,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const F=wc_whiteFig(id,s),ox=x-F.w/2,oy=y-F.fy;
  withA(ctx,a,()=>{if(o.shadow!==false){ctx.save();const tg=ctx.createRadialGradient(x,y-4,4,x,y-4,110*F.k);tg.addColorStop(0,rgba([90,80,96],0.14));tg.addColorStop(1,rgba([90,80,96],0));ctx.fillStyle=tg;
      ctx.beginPath();ctx.ellipse(x,y-4,110*F.k,18*F.k,0,0,TAU);ctx.fill();ctx.restore();}
    ctx.save();ctx.globalAlpha*=0.85;ctx.drawImage(F.D,ox,oy);ctx.restore();ctx.drawImage(F.G,ox,oy);
    if(bands&&bands.length){const [bc,bx]=wc_buf("bands",F.w,F.h),by0=F.fy-436*F.k;bands.forEach((b,i)=>{const ba=(b.a==null?1:b.a);if(ba<=0.01)return;
        bx.fillStyle=rgba(b.col,(b.dashed?0.4:1)*0.72*ba);const yy=by0+(b.i==null?i:b.i)*64*F.k;bx.fillRect(0,yy,F.w,42*F.k);});
      bx.globalCompositeOperation="destination-in";bx.drawImage(F.M,0,0);ctx.drawImage(bc,ox,oy);}});}
// the middle of band i on the figure, for lines that run to it
function wc_bandY(id,s,y,i){const k=s*PEOPLE[id].build.h;return y-650*k+(650-436)*k+i*64*k+21*k;}

/* ---------- title and end cards ---------- */
const WC_SERIES="The same one, everywhere";
// five strokes of the role colours, the series' mark
function wc_mark(ctx,cx,cy,w,p,a){if(a<=0.01)return;const cols=["student","applicant","researcher","tutor","alumna"],n=cols.length,sw=w/n;withA(ctx,a,()=>{cols.forEach((r,i)=>{const q=clamp(p*n*0.8-i*0.6,0,1);if(q<=0)return;
  const x=cx-w/2+i*sw,c=wc_kept("mark"+i,Math.round(sw+24),40,x2=>{wc_prep();wc_wash(x2,wc_resample(wc_rect(6,6,sw+10,26),8),WC_ROLE[r],{kind:"swatch",line:false,a:0.85,seed:31+i*7});});
  ctx.save();ctx.beginPath();ctx.rect(x-4,cy-30,(sw+30)*ease(q),60);ctx.clip();ctx.drawImage(c,x-6,cy-20);ctx.restore();});});}
function wc_title(ctx,S,t,t0,title,sub,line){const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{wc_T(ctx,WC_SERIES.toUpperCase(),960,400,{w:800,size:30,align:"center",col:WC_MUTED});wc_T(ctx,title,960,510,{w:800,size:92,align:"center",col:WC_DARK});
    wc_mark(ctx,960,572,520,(t-t0-0.6)/1.2,1);if(sub)wc_T(ctx,sub,960,664,{w:600,size:36,align:"center",col:WC_MUTED});
    withA(ctx,fin(t,t0+1.2,0.8),()=>wc_tag(ctx,960,750,line,{align:"center",size:28,w:600}));});}
function wc_end(ctx,S,t,t0,title,line,n){const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)wc_T(ctx,line,960,420,{w:700,size:48,align:"center",col:WC_DARK});wc_mark(ctx,960,520,400,(t-t0-0.7)/1.0,1);wc_T(ctx,title,960,622,{w:800,size:44,align:"center",col:WC_DARK});
    wc_T(ctx,WC_SERIES+(n?" · "+n:"")+" · Learning Data",960,680,{w:600,size:28,align:"center",col:WC_MUTED});});}

/* ===== The same one, everywhere: the series' people, in pencil and wash =====
   The films' people (When things go wrong's character sheet), drawn the watercolour way: a fine pencil line, paint that runs a little
   past it, pigment in the paper's tooth, and behind them a loose wash of their side's colour: cyan for the technical side (Noor), gold
   for the business side (Mei, Minh). Linh, the person the data is about, has no side: a neutral edge, so she can wear her roles'
   colours. Minh, her brother, shares his home with her. These replace how the character sheet shades and outlines
   people, for this series only. */

PEOPLE.linh={name:"Linh Nguyen",role:"Student",side:"Person",does:"uses",edge:[236,232,226],seed:21,
  skin:[230,192,156],hair:{style:"bob",c:[30,24,26],streak:[86,72,74]},earrings:[226,230,240],
  top:{kind:"overshirt",c:[88,124,168],inner:[246,242,234]},bottom:{c:[52,56,70]},shoe:[240,240,244],build:{sh:64,hip:58,h:0.93}};
PEOPLE.minh={name:"Minh Nguyen",role:"Student",side:"Business",does:"uses",edge:BIZ,seed:22,
  skin:[218,176,138],hair:{style:"cropped",c:[24,22,24]},glasses:[44,42,50],
  top:{kind:"sweater",c:[178,100,74]},bottom:{c:[62,82,114]},shoe:[46,46,52],build:{sh:70,hip:58,h:0.97}};
// reading a letter in the right hand; standing at ease, hands loose
POSE.letter={L:[0.12,-0.04],R:[0.06,Math.PI+0.95],hold:"envelope",feet:24,shift:-2,tilt:0.06,turn:0.06,gaze:[-0.2,1],look:1};
POSE.ease={L:[0.16,-0.18],R:[0.14,-0.16],feet:26,shift:2,tilt:-0.015,turn:-0.04,gaze:[0,0],look:0};

// softer shading than the glass films: watercolour has little modelling
const WC_SHADE=0.75,WC_SEAM=0.8;
function litFill(ctx,c,x0,y0,x1,y1,k){k=(k||1)*WC_SHADE;const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,rgba(lighten(c,0.16*k),1));g.addColorStop(0.55,rgba(c,1));
  g.addColorStop(1,rgba(darken(c,0.3*k),1));ctx.fillStyle=g;ctx.fill();}
function seam(ctx,c,a,w){ctx.strokeStyle=rgba(darken(c,0.55),(a==null?0.45:a)*WC_SEAM);ctx.lineWidth=w||1.6;ctx.stroke();}
function limb(ctx,pts,w0,w1,c,box){const g=ctx.createLinearGradient(box[0],box[1],box[2],box[3]);g.addColorStop(0,rgba(lighten(c,0.14*WC_SHADE),1));g.addColorStop(1,rgba(darken(c,0.28*WC_SHADE),1));
  ctx.lineCap="round";ctx.lineJoin="round";
  for(let i=0;i<pts.length-1;i++){const w=lerp(w0,w1,i/Math.max(1,pts.length-2));ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);
    ctx.strokeStyle=rgba(darken(c,0.55),0.5*WC_SEAM);ctx.lineWidth=w+2.4;ctx.stroke();}
  for(let i=0;i<pts.length-1;i++){const w=lerp(w0,w1,i/Math.max(1,pts.length-2));ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);ctx.strokeStyle=g;ctx.lineWidth=w;ctx.stroke();}}

// a person, as the character sheet draws one, with a soft shadow on the paper rather than a dark one; WC_RAW draws the figure alone (no
// shadow, no edge), for the white figure (wash.js) to be cut from
let WC_RAW=false;
function person(ctx,id,x,y,s,o){o=o||{};const P=PEOPLE[id],po=blendPose(POSE[o.pose||"stand"],POSE[o.pose2],o.mix),E=EXPR[o.expr||"calm"],t=o.t||0,k=s*P.build.h;
  const br=Math.sin(t*1.7+P.seed)*1.4;
  if(!WC_RAW){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,100);g.addColorStop(0,rgba([90,80,96],0.2));g.addColorStop(1,rgba([90,80,96],0));ctx.fillStyle=g;ell(ctx,0,-4,100,16);ctx.fill();ctx.restore();}
  const front=a=>a[1]>Math.PI*0.8;
  outlined(ctx,cx=>{
    if(!front(po.L))arm(cx,P,-1,po.L,br,po);if(!front(po.R))arm(cx,P,1,po.R,br,po);
    legs(cx,P,po);
    limb(cx,[[0,-470+br],[0,-440+br]],30,30,darken(P.skin,0.12),[-20,-470,20,-440]);
    torso(cx,P,br,po.shift);
    cx.save();cx.translate(po.shift*0.2,-452+br);cx.rotate(po.tilt);cx.translate(0,-50+po.look*2);head(cx,P,E,po,t);cx.restore();
    if(front(po.L))arm(cx,P,-1,po.L,br,po);if(front(po.R))arm(cx,P,1,po.R,br,po);
  },x,y,k,P.edge,[-250,-650,250,10],o.glow);}

// the pencil and wash: the figure, drawn into a spare canvas, then a loose wash of its side's colour behind it, the paint bleeding a little
// past the line, pigment in the paper's tooth, and a fine pencil line round it. Blurs are made by shrinking and growing, which is cheap.
const wc_aura=e=>e[0]>200&&e[1]>200&&e[2]>200?WC_SIDE.none:e===TECH?WC_SIDE.tech:e===BIZ?WC_SIDE.biz:e;
function outlined(ctx,draw,x,y,s,edge,box,glowA){const [x0,y0,x1,y1]=box,pad=40,w=Math.ceil((x1-x0)*s+pad*2),h=Math.ceil((y1-y0)*s+pad*2);
  const [c,cx]=pcanvas("p",w,h);cx.translate(pad-x0*s,pad-y0*s);cx.scale(s,s);draw(cx);const ox=x+x0*s-pad,oy=y+y0*s-pad;
  if(WC_RAW){ctx.drawImage(c,ox,oy);return;}
  wc_prep();const q=8,sw=Math.max(2,Math.ceil(w/q)),sh=Math.max(2,Math.ceil(h/q)),col=wc_aura(edge);
  // the silhouette in the side's colour, shrunk: grown again, it is a soft blur
  const [sc,sx]=wc_buf("figS"+sw+"x"+sh,sw,sh);sx.drawImage(c,0,0,sw,sh);sx.globalCompositeOperation="source-in";sx.fillStyle=rgba(col,1);sx.fillRect(0,0,sw,sh);
  ctx.save();ctx.globalAlpha*=0.3;ctx.globalCompositeOperation="multiply";ctx.imageSmoothingEnabled=true;ctx.drawImage(sc,ox-10*s-q,oy+6*s-q,w+2*q,h+2*q);ctx.restore();
  // the paint, with the paper's grain and an uneven dry
  const [fc,fx]=wc_wpaint(c,w,h);
  const [bc,bx]=wc_buf("figB"+w+"x"+h,Math.ceil(w/4),Math.ceil(h/4));bx.drawImage(fc,0,0,bc.width,bc.height);
  ctx.save();ctx.globalAlpha*=0.4;ctx.drawImage(bc,ox+2*s,oy+1*s,w,h);ctx.restore();
  // the pencil line: the silhouette in pencil, a little off in four directions, under the paint
  const [tc,tx]=wc_buf("figT"+w+"x"+h,w,h);tx.drawImage(c,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(WC_PENCIL,1);tx.fillRect(0,0,w,h);
  ctx.save();ctx.globalAlpha*=0.8;for(const [dx,dy] of [[1.5*s,0.4*s],[-1.2*s,1.1*s],[0.3*s,-1.4*s],[-0.6*s,-0.9*s]])ctx.drawImage(tc,ox+dx,oy+dy);ctx.restore();
  ctx.drawImage(fc,ox,oy);}
function wc_wpaint(c,w,h){const [fc,fx]=wc_buf("figP"+w+"x"+h,w,h);fx.drawImage(c,0,0);fx.globalCompositeOperation="multiply";fx.globalAlpha=0.5;fx.drawImage(WC.gran,0,0);
  fx.globalAlpha=0.4;fx.drawImage(wc_tint(WC.blotch,[206,196,186]),0,0,W,H);fx.globalAlpha=1;fx.globalCompositeOperation="destination-in";fx.drawImage(c,0,0);
  fx.globalCompositeOperation="source-over";return[fc,fx];}

// an envelope in the hand, for the person who opens someone else's post: the letter half out, the fingers over its edge
function envelopeInHand(ctx,P,h,ang){ctx.save();ctx.translate(h[0]-2,h[1]+4);ctx.rotate(-0.08);const line=[110,100,96];
  ctx.save();ctx.rotate(0.16);ctx.beginPath();rr(ctx,-30,-44,76,60,3);ctx.fillStyle="#ffffff";ctx.fill();ctx.strokeStyle=rgba(line,0.6);ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle=rgba(line,0.5);for(let i=0;i<2;i++)ctx.fillRect(-20,-34+i*10,44-i*12,3.4);ctx.fillStyle=rgba([238,96,78],0.95);ctx.beginPath();ctx.arc(30,-30,6,0,TAU);ctx.fill();ctx.restore();
  ctx.beginPath();rr(ctx,-52,-8,104,66,5);ctx.fillStyle=rgba([250,247,240],1);ctx.fill();ctx.strokeStyle=rgba(line,0.7);ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.moveTo(-50,-4);ctx.lineTo(0,26);ctx.lineTo(50,-4);ctx.strokeStyle=rgba(line,0.45);ctx.stroke();
  ell(ctx,-30,-4,13,14);litFill(ctx,P.skin,-43,-18,-17,10);ell(ctx,-12,-10,6,10,0.3);litFill(ctx,P.skin,-18,-20,-6,0);
  ctx.restore();}
// the character sheet's hands hold a phone; this lets one hold an envelope too, drawn where the phone would be
const wc_arm0=arm;
arm=function(ctx,P,s,a,br,po){if(po.hold!=="envelope")return wc_arm0(ctx,P,s,a,br,po);const keep=phoneInHand;phoneInHand=envelopeInHand;
  try{return wc_arm0(ctx,P,s,a,br,Object.assign({},po,{hold:"phone"}));}finally{phoneInHand=keep;}};

/* ===== The data governance series: its people =====
   The cast of When things go wrong and In the weeds of data crafting (Mei, Sam, David, Jun), and four more: Yusuf Demir, the
   university's new data governance lead, Clara Jensen, in Planning, Anil Kurian, an analyst in the Faculty of Health, and Marta
   Nowak, who leads the wallet app team. They're drawn the way the master and reference data series draws people (its
   shared/src/people.js, bundled as it is): a pencil line, paint in the paper's grain, and behind each person a soft wash of their
   side's colour, gold for the business side and cyan for the technical side. The people of the past get a warm umber wash, and wear
   their own time: tunics and gowns of wool in 1215, a furred gown in 1497, a frock coat and a top hat, or a waistcoat and an apron,
   in the 1880s. People can hold things (a charter, a jug, a binder, a notebook, a hammer) and face either way. */

// the wash behind people of the past, and the colours of what people hold
const GV_PAST=[184,146,104],GV_HOLD={teal:[64,150,146],walnut:[156,110,74],navy:[66,86,128],gold:[232,176,52]};

PEOPLE.yusuf={name:"Yusuf Demir",role:"Data governance lead",side:"Business",does:"uses",edge:BIZ,seed:15,
  skin:[204,160,124],hair:{style:"side",c:[38,30,28]},beard:[44,34,30],
  top:{kind:"blazer",c:[150,84,62],inner:[236,232,222]},bottom:{c:[52,56,70]},shoe:[70,48,36],build:{sh:74,hip:60,h:1.0}};
PEOPLE.clara={name:"Clara Jensen",role:"Planning",side:"Business",does:"uses",edge:BIZ,seed:16,
  skin:[238,204,180],hair:{style:"bob",c:[170,120,70],streak:[214,176,120]},earrings:[255,214,140],
  top:{kind:"sweater",c:[226,160,70]},bottom:{c:[60,64,84]},shoe:[60,46,40],build:{sh:66,hip:60,h:0.96}};
PEOPLE.anil={name:"Anil Kurian",role:"Faculty of Health",side:"Business",does:"uses",edge:BIZ,seed:17,
  skin:[156,106,78],hair:{style:"cropped",c:[30,26,26]},
  top:{kind:"cardigan",c:[128,74,96],inner:[232,234,238]},bottom:{c:[112,100,82]},shoe:[58,42,34],build:{sh:72,hip:60,h:0.99}};
PEOPLE.marta={name:"Marta Nowak",role:"Wallet app team",side:"Technical",does:"uses",edge:TECH,seed:18,
  skin:[242,214,198],hair:{style:"long",c:[122,64,44]},glasses:[44,40,40],lanyard:TECH,
  top:{kind:"sweater",c:[214,198,170]},bottom:{c:[48,52,62]},shoe:[40,34,32],build:{sh:68,hip:60,h:0.97}};

// ---- clothes of other times: the shared engine stays as it is; these wrap its torso and head for their own kinds only ----
const _govTorso=torso,_govHead=head;
torso=function(ctx,P,br,sh){const T_=P.top;if(T_.kind==="frock")return frockCoat(ctx,P,br,sh);if(T_.kind==="vest")return shirtVest(ctx,P,br,sh);
  if(T_.kind!=="tunic"&&T_.kind!=="gown")return _govTorso(ctx,P,br,sh);
  const c=T_.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br,gown=T_.kind==="gown",hem=gown?-30:-150,fl=gown?40:22;
  const path=()=>{ctx.beginPath();ctx.moveTo(-16,y0);ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-2,y0+28,-sw-2,y0+50);
    ctx.bezierCurveTo(-sw-2,y0+84,-hw-2,-352,-hw+2,-322);ctx.quadraticCurveTo(-hw-fl*0.5+sh*0.4,-230,-hw-fl+sh*0.5,hem);
    ctx.quadraticCurveTo(sh*0.5,hem+12,hw+fl+sh*0.5,hem);ctx.quadraticCurveTo(hw+fl*0.5+sh*0.4,-230,hw-2,-322);
    ctx.bezierCurveTo(hw+2,-352,sw+2,y0+84,sw+2,y0+50);ctx.quadraticCurveTo(sw+2,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,16,y0);ctx.closePath();};
  path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);
  ctx.save();path();ctx.clip();
  // folds of the cloth, falling from the belt
  ctx.strokeStyle=rgba(darken(c,0.38),0.32);ctx.lineWidth=2.4;ctx.lineCap="round";
  for(const k of [-0.62,-0.2,0.24,0.66]){ctx.beginPath();ctx.moveTo(k*hw*0.8+sh*0.3,-306);ctx.quadraticCurveTo(k*hw*1.05+sh*0.4,-220,k*(hw+fl)*0.95+sh*0.5,hem+6);ctx.stroke();}
  ctx.strokeStyle=rgba(lighten(c,0.2),0.22);ctx.lineWidth=5;for(const k of [-0.4,0.45]){ctx.beginPath();ctx.moveTo(k*hw*0.8+sh*0.3,-300);ctx.quadraticCurveTo(k*hw+sh*0.4,-220,k*(hw+fl)*0.9+sh*0.5,hem+6);ctx.stroke();}
  // a furred gown hangs open at the front over a doublet, with broad fur facings
  if(T_.fur){ctx.fillStyle=rgba(T_.inner||lighten(c,0.4),1);ctx.beginPath();ctx.moveTo(-20,y0);ctx.lineTo(20,y0);ctx.lineTo(26+sh*0.5,hem+8);ctx.lineTo(-26+sh*0.5,hem+8);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(darken(T_.inner,0.4),0.5);ctx.lineWidth=1.6;for(let i=0;i<5;i++){ell(ctx,sh*0.3,-420+i*26,2.6,2.6);ctx.fillStyle=rgba(darken(T_.inner,0.45),0.9);ctx.fill();}
    for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*12,y0-2);ctx.quadraticCurveTo(s*(sw-4),y0+2,s*(sw+2),y0+30);ctx.lineTo(s*(sw-14),y0+44);ctx.quadraticCurveTo(s*44,y0+40,s*34+sh*0.4,-330);ctx.lineTo(s*36+sh*0.5,hem+8);ctx.lineTo(s*20+sh*0.5,hem+8);ctx.lineTo(s*18,y0+20);ctx.closePath();
      litFill(ctx,T_.fur,-sw,y0,sw,hem);ctx.strokeStyle=rgba(lighten(T_.fur,0.25),0.4);ctx.lineWidth=1.2;for(let i=0;i<26;i++){const yy=lerp(y0+10,hem,i/26),xx=s*(24+6*hash(i,s+3))+sh*0.4;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+s*4,yy+6);ctx.stroke();}}}
  else{// a round neckline, an undertunic showing at it, and the hem band
    ctx.fillStyle=rgba(T_.inner||lighten(c,0.5),1);ctx.beginPath();ctx.moveTo(-17,y0-2);ctx.quadraticCurveTo(0,y0+20,17,y0-2);ctx.closePath();ctx.fill();}
  if(T_.band){ctx.strokeStyle=rgba(T_.band,0.9);ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-hw-fl-10,hem-6);ctx.quadraticCurveTo(sh*0.5,hem+6,hw+fl+10,hem-6);ctx.stroke();}
  if(T_.cape){ctx.fillStyle=rgba(T_.cape,1);ctx.beginPath();ctx.moveTo(-18,y0-2);ctx.bezierCurveTo(-sw-6,y0+6,-sw-14,y0+40,-sw-12,y0+96);ctx.quadraticCurveTo(0,y0+128,sw+12,y0+96);ctx.bezierCurveTo(sw+14,y0+40,sw+6,y0+6,18,y0-2);ctx.closePath();
    litFill(ctx,T_.cape,-sw-14,y0,sw+14,y0+128);seam(ctx,T_.cape,0.45);ctx.fillStyle=rgba(darken(T_.cape,0.25),1);ctx.beginPath();ctx.ellipse(sh*0.2,y0+8,26,12,0,0,TAU);ctx.fill();}
  if(T_.apron){ctx.fillStyle=rgba(T_.apron,0.96);ctx.beginPath();ctx.moveTo(-hw+6,-318);ctx.lineTo(hw-6,-318);ctx.lineTo(hw+4+sh*0.5,gown?-70:-170);ctx.quadraticCurveTo(sh*0.5,(gown?-62:-162),-hw-4+sh*0.5,gown?-70:-170);ctx.closePath();ctx.fill();seam(ctx,T_.apron,0.3);}
  // a leather belt with a buckle, a purse on it for some
  if(T_.belt){ctx.fillStyle=rgba(T_.belt,1);ctx.beginPath();ctx.moveTo(-hw-4,-330);ctx.lineTo(hw+4,-330);ctx.lineTo(hw+4,-316);ctx.lineTo(-hw-4,-316);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(214,182,110,1)";ctx.fillRect(sh*0.3-7,-332,14,18);
    if(T_.purse){ctx.fillStyle=rgba(darken(T_.belt,0.1),1);ell(ctx,hw+2,-296,12,17);ctx.fill();seam(ctx,T_.belt,0.4);}}
  ctx.restore();};
// the 1880s: a frock coat to the knee over a waistcoat, a white shirt and a dark tie, a watch chain
function frockCoat(ctx,P,br,sh){const T_=P.top,c=T_.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br,hem=-150;
  const path=()=>{ctx.beginPath();ctx.moveTo(-15,y0);ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-2,y0+28,-sw-2,y0+50);
    ctx.bezierCurveTo(-sw-2,y0+84,-hw-2,-352,-hw+1,-326);ctx.quadraticCurveTo(-hw-12+sh*0.4,-240,-hw-16+sh*0.5,hem);ctx.lineTo(hw+16+sh*0.5,hem);ctx.quadraticCurveTo(hw+12+sh*0.4,-240,hw-1,-326);
    ctx.bezierCurveTo(hw+2,-352,sw+2,y0+84,sw+2,y0+50);ctx.quadraticCurveTo(sw+2,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,15,y0);ctx.closePath();};
  path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);ctx.save();path();ctx.clip();
  // the V: shirt and tie at the collar, the waistcoat below, the coat's lapels on each side
  ctx.fillStyle=rgba(T_.vest,1);ctx.beginPath();ctx.moveTo(-22,y0);ctx.lineTo(22,y0);ctx.lineTo(16+sh*0.3,-322);ctx.lineTo(-16+sh*0.3,-322);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(T_.inner,1);ctx.beginPath();ctx.moveTo(-14,y0-2);ctx.lineTo(14,y0-2);ctx.lineTo(sh*0.2,y0+44);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(T_.tie||[40,36,44],1);ctx.beginPath();ctx.moveTo(-7,y0+6);ctx.lineTo(7,y0+6);ctx.lineTo(4+sh*0.2,y0+34);ctx.lineTo(sh*0.2,y0+40);ctx.lineTo(-4+sh*0.2,y0+34);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(darken(T_.vest,0.4),0.9);for(let i=0;i<4;i++){ell(ctx,sh*0.25,y0+56+i*18,2.4,2.4);ctx.fill();}
  // the watch chain, from a pocket to a button
  ctx.strokeStyle="rgba(232,196,96,0.95)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-16+sh*0.2,y0+86);ctx.quadraticCurveTo(-4,y0+100,sh*0.25,y0+92);ctx.stroke();
  for(const s of [-1,1]){ctx.fillStyle=rgba(darken(c,0.18),1);ctx.beginPath();ctx.moveTo(s*14,y0-4);ctx.lineTo(s*30,y0+2);ctx.lineTo(s*36,y0+30);ctx.lineTo(s*20,y0+40);ctx.lineTo(s*18+sh*0.3,-322);ctx.lineTo(s*8+sh*0.3,-322);ctx.lineTo(s*22,y0+26);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(lighten(c,0.2),0.35);ctx.lineWidth=1.4;ctx.stroke();}
  // the waist seam, the skirt's front edges and its buttons
  ctx.strokeStyle=rgba(darken(c,0.5),0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-hw-2,-322);ctx.quadraticCurveTo(sh*0.4,-316,hw+2,-322);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-8+sh*0.3,-322);ctx.lineTo(-12+sh*0.5,hem);ctx.moveTo(8+sh*0.3,-322);ctx.lineTo(12+sh*0.5,hem);ctx.stroke();
  ctx.fillStyle=rgba(darken(c,0.55),0.7);ctx.fillRect(-8+sh*0.4,-310,16,hem+310);
  ctx.fillStyle=rgba(darken(c,0.45),0.9);for(const s of [-1,1]){ell(ctx,s*24+sh*0.3,-330,3.2,3.2);ctx.fill();}
  ctx.restore();}
// the 1880s shop: a white shirt with the sleeves rolled, a waistcoat, a long apron
function shirtVest(ctx,P,br,sh){const T_=P.top,c=T_.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br;
  torsoPath(ctx,P,br,sh);litFill(ctx,c,-sw,y0,sw,-250);seam(ctx,c,0.45);ctx.save();torsoPath(ctx,P,br,sh);ctx.clip();
  const v=T_.vest;ctx.beginPath();ctx.moveTo(-sw+16,y0+22);ctx.quadraticCurveTo(-30,y0+10,-16,y0+4);ctx.lineTo(sh*0.3,y0+58);ctx.lineTo(16,y0+4);ctx.quadraticCurveTo(30,y0+10,sw-16,y0+22);
  ctx.lineTo(hw+2,-300);ctx.lineTo(sh*0.4+10,-288);ctx.lineTo(sh*0.4,-300);ctx.lineTo(sh*0.4-10,-288);ctx.lineTo(-hw-2,-300);ctx.closePath();litFill(ctx,v,-sw,y0,sw,-288);seam(ctx,v,0.5);
  ctx.fillStyle=rgba(lighten(v,0.35),0.9);for(let i=0;i<4;i++){ell(ctx,sh*0.3+1,y0+70+i*20,2.4,2.4);ctx.fill();}
  ctx.fillStyle=rgba(T_.tie||[60,40,40],1);ctx.beginPath();ctx.moveTo(-12,y0+4);ctx.lineTo(0,y0+10);ctx.lineTo(12,y0+4);ctx.lineTo(12,y0+16);ctx.lineTo(0,y0+12);ctx.lineTo(-12,y0+16);ctx.closePath();ctx.fill();
  ctx.restore();
  // the apron: tied at the waist, to below the knee
  if(T_.apron){ctx.beginPath();ctx.moveTo(-hw-6,-300);ctx.lineTo(hw+6+sh*0.4,-300);ctx.quadraticCurveTo(hw+16+sh*0.5,-200,hw+18+sh*0.5,-104);ctx.quadraticCurveTo(sh*0.5,-96,-hw-18+sh*0.5,-104);ctx.quadraticCurveTo(-hw-16,-200,-hw-6,-300);ctx.closePath();
    litFill(ctx,T_.apron,-hw,-300,hw,-100);seam(ctx,T_.apron,0.3);ctx.strokeStyle=rgba(darken(T_.apron,0.25),0.35);ctx.lineWidth=2;for(const k of [-0.5,0.1,0.6]){ctx.beginPath();ctx.moveTo(k*hw,-290);ctx.quadraticCurveTo(k*hw*1.1,-200,k*(hw+14),-108);ctx.stroke();}
    ctx.fillStyle=rgba(darken(T_.apron,0.12),1);ctx.fillRect(-hw-8,-306,hw*2+16+sh*0.4,10);}}
// headwear: a linen coif, a hood with a shoulder cape, a veil with a wimple, a straw hat, a Tudor bonnet, a top hat
head=function(ctx,P,E,po,t){const h=P.hat,hc=P.hatC||[238,232,218];
  if(h==="veil"){ctx.beginPath();ctx.moveTo(-50,-30);ctx.bezierCurveTo(-58,-86,58,-86,50,-30);ctx.bezierCurveTo(56,20,66,60,70,104);ctx.quadraticCurveTo(0,118,-70,104);ctx.bezierCurveTo(-66,60,-56,20,-50,-30);ctx.closePath();litFill(ctx,hc,-70,-86,70,110);seam(ctx,hc,0.3);}
  if(h==="hood"){ctx.beginPath();ctx.moveTo(-54,-20);ctx.bezierCurveTo(-60,-92,60,-92,54,-20);ctx.bezierCurveTo(58,30,70,70,96,112);ctx.quadraticCurveTo(0,134,-96,112);ctx.bezierCurveTo(-70,70,-58,30,-54,-20);ctx.closePath();litFill(ctx,hc,-96,-92,96,130);seam(ctx,hc,0.4);}
  _govHead(ctx,P,E,po,t);
  if(h==="coif"){ctx.beginPath();ctx.moveTo(-46,6);ctx.bezierCurveTo(-52,-82,52,-82,46,6);ctx.lineTo(40,10);ctx.quadraticCurveTo(38,-30,22,-42);ctx.quadraticCurveTo(0,-48,-22,-42);ctx.quadraticCurveTo(-38,-30,-40,10);ctx.closePath();litFill(ctx,hc,-52,-80,52,10);seam(ctx,hc,0.35);
    ctx.strokeStyle=rgba(darken(hc,0.2),0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-42,8);ctx.quadraticCurveTo(-30,48,0,56);ctx.quadraticCurveTo(30,48,42,8);ctx.stroke();}
  if(h==="hood"){ctx.beginPath();ctx.moveTo(-46,-6);ctx.bezierCurveTo(-50,-80,50,-80,46,-6);ctx.quadraticCurveTo(44,30,30,46);ctx.lineTo(36,52);ctx.quadraticCurveTo(52,30,54,-10);ctx.bezierCurveTo(56,-92,-56,-92,-54,-10);ctx.quadraticCurveTo(-52,30,-36,52);ctx.lineTo(-30,46);ctx.quadraticCurveTo(-44,30,-46,-6);ctx.closePath();litFill(ctx,hc,-56,-92,56,52);
    ctx.beginPath();ctx.moveTo(-36,50);ctx.quadraticCurveTo(0,72,36,50);ctx.lineTo(44,62);ctx.quadraticCurveTo(0,90,-44,62);ctx.closePath();litFill(ctx,hc,-44,50,44,90);
    ctx.strokeStyle=rgba(lighten(hc,0.25),0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-44,-10);ctx.bezierCurveTo(-46,-72,46,-72,44,-10);ctx.stroke();}
  if(h==="veil"){ctx.beginPath();ctx.moveTo(-44,-14);ctx.bezierCurveTo(-48,-78,48,-78,44,-14);ctx.quadraticCurveTo(40,-36,24,-44);ctx.quadraticCurveTo(0,-50,-24,-44);ctx.quadraticCurveTo(-40,-36,-44,-14);ctx.closePath();litFill(ctx,hc,-48,-78,48,-14);
    // the wimple: linen under the chin and round the neck
    ctx.beginPath();ctx.moveTo(-44,-8);ctx.quadraticCurveTo(-40,40,-18,52);ctx.quadraticCurveTo(0,58,18,52);ctx.quadraticCurveTo(40,40,44,-8);ctx.lineTo(50,-6);ctx.quadraticCurveTo(52,60,36,96);ctx.quadraticCurveTo(0,108,-36,96);ctx.quadraticCurveTo(-52,60,-50,-6);ctx.closePath();
    const wc=P.wimpleC||[248,246,240];litFill(ctx,wc,-52,-8,52,108);seam(ctx,wc,0.3);}
  if(h==="straw"){ctx.beginPath();ctx.ellipse(0,-34,88,20,0,0,TAU);litFill(ctx,hc,-88,-54,88,-14);seam(ctx,hc,0.4);
    ctx.beginPath();ctx.moveTo(-44,-36);ctx.bezierCurveTo(-46,-96,46,-96,44,-36);ctx.quadraticCurveTo(0,-26,-44,-36);ctx.closePath();litFill(ctx,hc,-46,-96,46,-30);
    ctx.fillStyle=rgba(darken(hc,0.35),0.9);ctx.beginPath();ctx.moveTo(-44,-44);ctx.quadraticCurveTo(0,-34,44,-44);ctx.lineTo(44,-36);ctx.quadraticCurveTo(0,-26,-44,-36);ctx.closePath();ctx.fill();
    ctx.save();ctx.beginPath();ctx.moveTo(-44,-36);ctx.bezierCurveTo(-46,-96,46,-96,44,-36);ctx.closePath();ctx.clip();ctx.strokeStyle=rgba(darken(hc,0.25),0.35);ctx.lineWidth=1.4;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*12,-90);ctx.quadraticCurveTo(i*14,-60,i*13,-40);ctx.stroke();}ctx.restore();}
  if(h==="tudor"){ctx.beginPath();ctx.ellipse(-4,-50,66,15,-0.06,0,TAU);litFill(ctx,hc,-70,-66,62,-34);seam(ctx,hc,0.5);
    ctx.beginPath();ctx.moveTo(-46,-54);ctx.bezierCurveTo(-50,-92,44,-96,44,-56);ctx.quadraticCurveTo(0,-46,-46,-54);ctx.closePath();litFill(ctx,hc,-50,-94,46,-48);
    ctx.fillStyle=rgba(lighten(hc,0.3),0.5);ctx.beginPath();ctx.ellipse(-22,-74,10,5,-0.4,0,TAU);ctx.fill();}
  if(h==="top"){const k=hc;ctx.beginPath();ctx.ellipse(0,-46,66,13,0,0,TAU);litFill(ctx,k,-66,-60,66,-32);seam(ctx,k,0.5);
    ctx.beginPath();ctx.moveTo(-40,-48);ctx.lineTo(-44,-152);ctx.quadraticCurveTo(0,-160,44,-152);ctx.lineTo(40,-48);ctx.quadraticCurveTo(0,-40,-40,-48);ctx.closePath();litFill(ctx,k,-44,-160,44,-44);seam(ctx,k,0.5);
    ctx.fillStyle=rgba(lighten(k,0.08),1);ctx.beginPath();ctx.ellipse(0,-153,44,8,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(P.hatBand||darken(k,0.3),1);ctx.beginPath();ctx.moveTo(-41,-60);ctx.lineTo(41,-60);ctx.lineTo(40,-50);ctx.quadraticCurveTo(0,-43,-40,-50);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.22)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-26,-140);ctx.lineTo(-24,-64);ctx.stroke();}};

// ---- the people of the past: invented townsfolk ----
Object.assign(PEOPLE,{
  // 1215: in wool dyed with madder, woad and weld, or undyed
  crier:{name:"",role:"the sheriff's crier",side:"",edge:GV_PAST,seed:31,skin:[226,184,154],hair:{style:"side",c:[120,84,52]},beard:[116,80,50],
    top:{kind:"gown",c:[60,84,140],inner:[226,214,190],belt:[96,64,40],band:[214,170,80],cape:[170,52,44]},bottom:{c:[60,60,70]},shoe:[60,42,30],build:{sh:74,hip:62,h:1.02}},
  vintner:{name:"",role:"wine seller",side:"",edge:GV_PAST,seed:32,skin:[232,190,160],hair:{style:"cropped",c:[60,44,34]},hat:"coif",hatC:[240,234,220],
    top:{kind:"tunic",c:[150,62,58],inner:[230,220,200],belt:[88,60,40],purse:true,apron:[236,226,206]},bottom:{c:[96,104,70]},shoe:[70,50,36],build:{sh:76,hip:64,h:1.0}},
  alewife:{name:"",role:"brewer",side:"",edge:GV_PAST,seed:33,skin:[236,196,170],hair:{style:"cropped",c:[150,96,56]},hat:"veil",hatC:[232,226,206],
    top:{kind:"gown",c:[184,150,72],inner:[236,228,210],belt:[110,74,44],apron:[240,234,220]},bottom:{c:[90,80,70]},shoe:[70,52,40],build:{sh:66,hip:62,h:0.95}},
  miller:{name:"",role:"corn seller",side:"",edge:GV_PAST,seed:34,skin:[214,170,136],hair:{style:"side",c:[52,40,32]},beard:[60,46,36],hat:"straw",hatC:[224,190,120],
    top:{kind:"tunic",c:[176,160,128],inner:[226,218,200],belt:[100,70,46]},bottom:{c:[88,72,60]},shoe:[66,48,34],build:{sh:78,hip:64,h:1.03}},
  buyer:{name:"",role:"townswoman",side:"",edge:GV_PAST,seed:35,skin:[200,150,118],hair:{style:"cropped",c:[40,30,26]},hat:"veil",hatC:[214,222,236],wimpleC:[246,244,238],
    top:{kind:"gown",c:[70,108,150],inner:[230,226,214],belt:[90,62,44],purse:true},bottom:{c:[70,70,80]},shoe:[60,44,34],build:{sh:64,hip:60,h:0.94}},
  // 1497: a clerk of the market in a furred gown and a bonnet; a trader in a hood
  clerk:{name:"",role:"clerk of the market",side:"",edge:GV_PAST,seed:36,skin:[230,190,160],hair:{style:"cropped",c:[90,64,44]},hat:"tudor",hatC:[44,40,46],
    top:{kind:"gown",c:[96,40,44],inner:[60,58,70],fur:[120,86,60]},bottom:{c:[50,46,56]},shoe:[40,32,28],build:{sh:74,hip:62,h:1.0}},
  trader:{name:"",role:"trader",side:"",edge:GV_PAST,seed:37,skin:[210,164,128],hair:{style:"side",c:[70,50,36]},beard:[80,58,40],hat:"hood",hatC:[120,130,90],
    top:{kind:"tunic",c:[150,120,84],inner:[220,210,190],belt:[96,66,44],purse:true},bottom:{c:[96,84,70]},shoe:[66,48,34],build:{sh:76,hip:64,h:1.0}},
  // the 1880s: an inspector of weights and measures, and a grocer
  inspector:{name:"",role:"inspector of weights and measures",side:"",edge:GV_PAST,seed:38,skin:[226,186,156],hair:{style:"side",c:[96,80,70]},beard:[110,92,80],hat:"top",hatC:[36,36,42],hatBand:[24,24,28],
    top:{kind:"frock",c:[48,52,66],vest:[110,96,80],inner:[246,244,238],tie:[30,28,34]},bottom:{c:[70,70,78]},shoe:[24,22,24],build:{sh:76,hip:62,h:1.02}},
  grocer:{name:"",role:"grocer",side:"",edge:GV_PAST,seed:39,skin:[232,196,168],hair:{style:"cropped",c:[60,46,36]},beard:[70,52,40],
    top:{kind:"vest",c:[246,242,232],rolled:true,vest:[96,74,58],apron:[250,248,242],tie:[110,40,40]},bottom:{c:[88,84,96]},shoe:[46,36,30],build:{sh:76,hip:64,h:0.98}}
});

// ---- poses for situations ----
Object.assign(POSE,{
  hold:{L:[0.16,-2.05],R:[0.16,-2.05],feet:24,shift:0,tilt:0.0,turn:0,gaze:[0.2,1],look:1},
  holdUp:{L:[0.3,-2.5],R:[0.3,-2.5],feet:24,shift:0,tilt:0.0,turn:0,gaze:[0,-0.2],look:0},
  listen:{L:[0.14,-0.08],R:[0.1,0.05],feet:26,shift:4,tilt:0.06,turn:0.12,gaze:[0.5,0],look:0},
  point:{L:[0.12,-0.06],R:[1.25,1.75],hand:"open",feet:34,shift:6,tilt:-0.04,turn:0.3,gaze:[0.6,-0.2],look:0},
  reach:{L:[0.12,-0.08],R:[0.7,2.6],feet:30,shift:5,tilt:-0.03,turn:0.2,gaze:[0.4,-0.5],look:0},
  write:{L:[0.16,-2.0],R:[0.3,-1.6],feet:24,shift:0,tilt:0.04,turn:0.05,gaze:[0.1,1],look:1},
  stampUp:{L:[0.16,-1.9],R:[0.5,2.7],feet:30,shift:4,tilt:0.0,turn:0.15,gaze:[0.2,1],look:1},
  stampDown:{L:[0.16,-1.9],R:[0.32,-1.2],feet:30,shift:4,tilt:0.06,turn:0.15,gaze:[0.2,1],look:1},
  wave:{L:[0.12,-0.08],R:[0.9,2.9],hand:"open",feet:28,shift:5,tilt:-0.03,turn:0.15,gaze:[0.3,0],look:0},
  shrug:{L:[0.5,1.3],R:[0.5,1.3],hand:"open",feet:30,shift:0,tilt:0.08,turn:0,gaze:[0,0],look:0},
  // a step: the arms swing opposite ways, the stance narrows (people in these films face us, so a walk is a sway and a bob)
  walkA:{L:[0.34,0.3],R:[-0.26,-0.32],feet:14,shift:-5,tilt:0.03,turn:0.06,gaze:[0.3,0],look:0},
  walkB:{L:[-0.26,-0.32],R:[0.34,0.3],feet:14,shift:5,tilt:-0.03,turn:0.06,gaze:[0.3,0],look:0}
});
// where a hand is, in the figure's own units (it's 560 tall), for things it holds
function handAt(P_,s,a,br){const sw=P_.build.sh,sx=s*(sw-12),sy=-416+br,e=[sx+s*Math.sin(a[0])*108,sy+Math.cos(a[0])*108],d=[s*Math.sin(a[1]),Math.cos(a[1])],w=[e[0]+d[0]*100,e[1]+d[1]*100];return[w[0]+d[0]*13,w[1]+d[1]*13];}

// a person, drawn in pencil and wash by the master data series' outlined(), with what the toy figures could do: face the other way
// (o.flip), nod, hold something (o.carry, drawn in the figure's units at its hands, o.carryBehind to put it behind the arms), and room
// for an arm held out (o.wide) or a tall hat. A soft shadow on the paper, except while the white figure is cut from it (WC_RAW).
person=function(ctx,id,x,y,s,o){o=o||{};const P_=PEOPLE[id],po=blendPose(POSE[o.pose||"stand"],POSE[o.pose2],o.mix),E=o.E||EXPR[o.expr||"calm"],t=o.t||0,k=s*P_.build.h;
  const br=Math.sin(t*1.7+P_.seed)*1.4,front=a=>Math.abs(a[1])>Math.PI*0.55;
  if(!WC_RAW&&o.shadow!==false){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,110);g.addColorStop(0,rgba([90,80,96],0.22));g.addColorStop(1,rgba([90,80,96],0));
    ctx.fillStyle=g;ell(ctx,0,-4,110,17);ctx.fill();ctx.restore();}
  outlined(ctx,cx=>{if(o.flip){cx.scale(-1,1);}
    if(!front(po.L))arm(cx,P_,-1,po.L,br,po);if(!front(po.R))arm(cx,P_,1,po.R,br,po);legs(cx,P_,po);
    limb(cx,[[0,-470+br],[0,-440+br]],30,30,darken(P_.skin,0.12),[-20,-470,20,-440]);torso(cx,P_,br,po.shift);
    cx.save();cx.translate(po.shift*0.2,-452+br);cx.rotate(po.tilt+(o.nod||0));cx.translate(0,-50+po.look*2);head(cx,P_,E,po,t);cx.restore();
    const hands=()=>[handAt(P_,-1,po.L,br),handAt(P_,1,po.R,br)];
    if(o.carry&&o.carryBehind){if(o.flip)cx.scale(-1,1);o.carry(cx,P_,o.flip?hands().map(h=>[-h[0],h[1]]):hands());if(o.flip)cx.scale(-1,1);}
    if(front(po.L))arm(cx,P_,-1,po.L,br,po);if(front(po.R))arm(cx,P_,1,po.R,br,po);
    if(o.carry&&!o.carryBehind){if(o.flip)cx.scale(-1,1);o.carry(cx,P_,o.flip?hands().map(h=>[-h[0],h[1]]):hands());if(o.flip)cx.scale(-1,1);}},
    x,y,k,P_.edge,[o.wide?-400:-250,P_.hat?-720:-650,o.wide?400:250,10],o.glow);};
// expressions in between: a little relief, a little worry
EXPR.worried={bi:-5,bo:3,arch:-0.5,knit:2.5,eye:0.95,smile:-0.6,open:0,mw:13};
EXPR.smile={bi:-1,bo:-2,arch:-3.5,eye:0.9,smile:0.8,open:0,mw:22};

// ---- things people hold, drawn in the figure's units ----
function fingers(cx,P_,pts){for(const [hx,hy] of pts){cx.save();cx.translate(hx,hy);ell(cx,0,0,12,15);litFill(cx,P_.skin,-12,-15,12,15);cx.restore();}}
// a ring binder with a policy number on its cover
function heldBinder(num,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);
  const w=168,h=214;cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<7;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+20,-h/2+26,w-40,112,10);cx.fill();
  cx.fillStyle=rgba(mix(col,[0,0,0],0.45),1);cx.textAlign="center";cx.font=font(700,30);cx.fillText("policy",0,-h/2+60);cx.font=font(800,64);cx.fillText(num,0,-h/2+124);cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+30],[mx+w/2-2,my+24]]);};}
// a notebook, open, with a pen
function heldNotebook(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+6);cx.rotate(-0.08);
  cx.fillStyle=rgba(GV_HOLD.teal,1);rr(cx,-86,-58,172,116,8);cx.fill();cx.fillStyle="#fffdf6";rr(cx,-80,-52,78,104,4);cx.fill();rr(cx,2,-52,78,104,4);cx.fill();
  cx.strokeStyle="rgba(120,130,160,0.5)";cx.lineWidth=2;for(let i=0;i<5;i++){cx.beginPath();cx.moveTo(-72,-36+i*18);cx.lineTo(-10,-36+i*18);cx.moveTo(10,-36+i*18);cx.lineTo(72-(i===4?30:0),-36+i*18);cx.stroke();}cx.restore();
  fingers(cx,P_,[[mx-84,my+12],[mx+84,my+8]]);}
// a clipboard held up, facing out: fn draws on its paper (in the figure's units, 200 x 250)
function heldBoard(fn){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-30);
  cx.fillStyle=rgba(GV_HOLD.walnut,1);rr(cx,-110,-140,220,280,12);cx.fill();cx.fillStyle="#fffdf6";rr(cx,-98,-120,196,250,6);cx.fill();cx.fillStyle="rgba(170,176,190,1)";rr(cx,-34,-152,68,26,6);cx.fill();
  if(fn)fn(cx);cx.restore();fingers(cx,P_,[[mx-108,my+10],[mx+108,my+6]]);};}
// a box of gold pins
function heldPins(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+10);
  cx.fillStyle=rgba(GV_HOLD.navy,1);rr(cx,-70,-24,140,52,8);cx.fill();cx.fillStyle=rgba(mix(GV_HOLD.navy,[255,255,255],0.2),1);rr(cx,-70,-24,140,14,6);cx.fill();
  for(let i=0;i<9;i++){const x=-56+i*14,y=-30-6*hash(i,4);cx.strokeStyle="rgba(120,110,90,1)";cx.lineWidth=2;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x,y+18);cx.stroke();cx.fillStyle=rgba(GV_HOLD.gold,1);cx.beginPath();cx.arc(x,y,6,0,TAU);cx.fill();cx.fillStyle="rgba(255,250,220,0.8)";cx.beginPath();cx.arc(x-2,y-2,2,0,TAU);cx.fill();}
  cx.restore();fingers(cx,P_,[[mx-70,my+16],[mx+70,my+14]]);}
// an open charter with a seal, a jug of ale
function heldScroll(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-6);
  const w=196,h=130;cx.fillStyle="rgba(60,40,20,0.18)";cx.fillRect(-w/2+6,-h/2+8,w,h);
  const g=cx.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,"#fbf3dc");g.addColorStop(1,"#ead9b0");cx.fillStyle=g;cx.fillRect(-w/2,-h/2,w,h);
  for(const s of [-1,1]){const gx=cx.createLinearGradient(0,s*h/2-10,0,s*h/2+10);gx.addColorStop(0,"#e8d4a2");gx.addColorStop(0.5,"#fff6dc");gx.addColorStop(1,"#c9b07a");cx.fillStyle=gx;rr(cx,-w/2-8,s*h/2-10,w+16,20,10);cx.fill();}
  cx.strokeStyle="rgba(90,70,50,0.45)";cx.lineWidth=3;for(let i=0;i<5;i++){cx.beginPath();cx.moveTo(-w/2+18,-h/2+22+i*20);cx.lineTo(w/2-18-(i===4?60:0),-h/2+22+i*20);cx.stroke();}
  cx.strokeStyle="rgba(160,40,40,0.9)";cx.lineWidth=3;cx.beginPath();cx.moveTo(0,h/2+8);cx.lineTo(-4,h/2+40);cx.stroke();cx.fillStyle="#b8322c";cx.beginPath();cx.arc(-4,h/2+50,13,0,TAU);cx.fill();cx.restore();
  fingers(cx,P_,[[mx-w/2+2,my-4],[mx+w/2-2,my-4]]);}
function heldJug(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+10);const c=[176,120,84];
  cx.beginPath();cx.moveTo(-22,-56);cx.lineTo(22,-56);cx.quadraticCurveTo(46,-10,36,40);cx.quadraticCurveTo(0,52,-36,40);cx.quadraticCurveTo(-46,-10,-22,-56);cx.closePath();litFill(cx,c,-46,-56,46,52);seam(cx,c,0.5);
  cx.fillStyle=rgba(darken(c,0.3),1);cx.beginPath();cx.ellipse(0,-56,23,7,0,0,TAU);cx.fill();cx.strokeStyle=rgba(darken(c,0.1),1);cx.lineWidth=9;cx.beginPath();cx.arc(42,-8,18,-1.2,1.3);cx.stroke();cx.restore();
  fingers(cx,P_,[[mx-30,my+8],[mx+30,my+8]]);}
// a brass weight held up in one hand; a hammer and a punch
function heldWeight(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0],r[1]-26);const g=cx.createLinearGradient(-26,0,26,0);g.addColorStop(0,"#fbe6a8");g.addColorStop(0.5,"#d8a850");g.addColorStop(1,"#8c6424");
  cx.fillStyle=g;cx.beginPath();cx.moveTo(-24,0);cx.lineTo(24,0);cx.lineTo(18,-34);cx.lineTo(-18,-34);cx.closePath();cx.fill();cx.beginPath();cx.ellipse(0,-38,10,7,0,0,TAU);cx.fill();cx.restore();fingers(cx,P_,[r]);}
function heldHammer(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0],r[1]);cx.rotate(-0.4);cx.fillStyle="#8a6040";cx.fillRect(-4,-70,8,80);cx.fillStyle="#9aa0aa";rr(cx,-20,-84,40,20,4);cx.fill();cx.restore();fingers(cx,P_,[r]);}
function heldBook(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+8);cx.rotate(-0.06);cx.fillStyle="#6a3a2a";rr(cx,-70,-50,140,100,6);cx.fill();cx.fillStyle="#fbf3dc";rr(cx,-64,-44,62,88,3);cx.fill();rr(cx,2,-44,62,88,3);cx.fill();
  cx.strokeStyle="rgba(90,70,60,0.5)";cx.lineWidth=2;for(let i=0;i<6;i++){cx.beginPath();cx.moveTo(-58,-30+i*13);cx.lineTo(-8,-30+i*13);cx.moveTo(8,-30+i*13);cx.lineTo(58,-30+i*13);cx.stroke();}cx.restore();fingers(cx,P_,[[mx-68,my+10],[mx+68,my+8]]);}

/* ===== The data governance series: the university's rooms, in watercolour =====
   The series paints with the master and reference data series' watercolour (its shared/src/wash.js and people.js, bundled as they
   are), so the two series look like one university. This file adds what the governance films need, all of it the university's own:
   the campus, Yusuf's office, the floor of offices behind glass where the work is done (Planning, the registrar's office, data
   governance, the data team, the platform team), the rooms where the numbers are made, and a desk seen from above for the papers;
   the places the later films share (the stewards' meeting room, the registrar's, the platform team's and a faculty analyst's desks
   close up, and Noor's room with her architecture map); then the things on their walls and desks (binders, papers, screens, cards,
   pins, stamps, speech bubbles), a camera that cuts between shots, and the series' title and end cards. The places are painted
   once and kept (finish.js); only what moves is drawn every frame.
   Every name starts with gv_ or GV, because every file of the film shares one script. */

/* ---------- colours ---------- */
// what the colours mean: gold is governance's decisions (and, behind a person, the business side, as in the master data series); cyan
// the technical side; green what runs in the work; grey what can go; red what nobody owns yet; amber a warning, something to look at
// that hasn't failed (an orange, so it reads apart from gold beside it)
const GV={gold:[236,170,34],goldInk:[146,96,0],green:[40,160,96],greenInk:[22,120,68],grey:[148,156,170],greyInk:[88,94,108],red:[204,62,50],redInk:[176,40,34],amber:[236,136,44],amberInk:[150,66,0],
  cyanInk:[24,104,168],wood:[198,152,106],woodDark:[146,104,72],oak:[222,186,138],cork:[208,166,114],metal:[166,172,184],bezel:[60,64,78],glass:[198,222,238],
  floor:[214,196,170],corridor:[230,224,212],ceiling:[246,242,234],chair:[84,92,112],paper:[253,252,248],screen:[248,250,252]};
// each room's walls: governance warm cream, Planning sage, the registrar's office blue, the data team lilac, the platform team pale teal;
// the meeting room a quiet stone, Noor's room a pale rose, a faculty's office in the old building warm plaster over dark panelling,
// and the learning team's office (Tom's) a soft apricot
const GV_ROOM={gov:[244,230,204],plan:[218,230,206],reg:[212,222,238],data:[226,218,238],plat:[206,230,226],meet:[228,224,214],noor:[238,222,224],fac:[242,228,204],learn:[248,218,192]};
// colours several films share, each with an ink for words on it: the three meanings of award (Who decides, One word, one home):
// violet the glossary's words, rose the words before Monday, olive degrees only; and the classes of personal data (Who may see it):
// plum for direct, a paler plum for pseudonymous (still personal, so the same family), plain paper for none
const GV_MEAN={violet:[110,92,190],rose:[214,96,140],olive:[150,156,56]},GV_MEANINK={violet:[78,58,160],rose:[168,50,98],olive:[94,100,22]};
const GV_CLASS={direct:[146,52,112],pseudonymous:[214,160,198],none:[250,248,242]},GV_CLASSINK={direct:[112,30,84],pseudonymous:[150,84,130]};

/* ---------- timing ---------- */
// when a word of a line is said: the line's start, plus the word's share of the line (a whole word: shared/tools/cues.py checks)
function wAt(sc,id,word,off){const ln=sc.vo.find(v=>v.id===id);if(!ln)return 0;const s=ln.say||ln.text,i=s.indexOf(word),d=sc.ends[id]-sc.cues[id];return sc.cues[id]+(i<0?0:d*i/s.length)+(off||0);}
// 0 to 1 from t0 over d seconds, and back to 0 from t1
const gv_io=(t,t0,t1,d)=>fin(t,t0,d||0.4)*(1-fin(t,t1,d||0.4));

/* ---------- the camera ---------- */
// keys are [time, x, y, zoom], each move eased over d seconds (1.4 at least); push closes in a little more, slowly; kept inside the frame
function gv_focus(ctx,t,keys,d,push){d=Math.max(1.4,d||1.6);let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z*(1+(push||0)));x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// one shot: its place under the camera, then what it draws on top, in the place's coordinates; the shot closes in slowly until the next
function gv_shot(ctx,S,t,sh,till){setScreen(ctx,S);ctx.save();const len=Math.max(1.5,till-sh.at),push=(sh.push==null?0.025:sh.push)*easeCam(clamp((t-sh.at)/len,0,1));
  const cam=gv_focus(ctx,t,sh.keys,sh.d,push);if(sh.place)ctx.drawImage(gv_place(sh.place),0,0,W,H);if(sh.draw)sh.draw(ctx,t,cam);ctx.restore();setScreen(ctx,S);}
// a chapter cut into shots, [{at, place, keys, draw, push, d}]: each dissolves in from the one before over dis seconds; returns the shot
function gv_shots(ctx,S,t,end,shots,dis){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;dis=dis==null?0.5:dis;const u=i>0?clamp((t-shots[i].at)/dis,0,1):1,
    till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){gv_shot(ctx,S,t,shots[i-1],shots[i].at);const [bc,bx]=wc_buf("cut",ctx.canvas.width,ctx.canvas.height);gv_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else gv_shot(ctx,S,t,shots[i],till(i));return i;}
// a place, painted once by the film's painter (WC_PLACES), and kept
function gv_place(key){return wc_kept("place:"+key,W,H,WC_PLACES[key]);}

/* ---------- rooms ---------- */
// a room's back wall to fy, its floor boards running away from us, and a skirting board
function gv_wallFloor(ctx,wall,fy,o){o=o||{};const fl=o.floor||GV.floor;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,fy+40),wall,{kind:"plaster",line:false,seed:o.seed||3});
  wc_wash(ctx,wc_rect(-40,fy,W+80,H-fy+40),fl,{kind:"ground",line:false,seed:(o.seed||3)+5});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(fl,0.2),0.3);ctx.lineWidth=2;const vx=o.vx||960;for(let i=-16;i<=16;i++){ctx.beginPath();ctx.moveTo(vx+i*64,fy);ctx.lineTo(vx+i*210,H+40);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_rect(-40,fy-18,W+80,20),wc_dim(wall,0.16),{kind:"trim",line:false,flat:true});}
// a window onto the campus: the sky, the old building's clock tower among trees, the lawn; then its frame, a bar each way, and the sill
function gv_window(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const hz=y+h*0.72;
  wc_sky(ctx,hz,o.seed||4,{clouds:2,cx:x+10,cw:Math.max(40,w-120),cy:y+24,ch:h*0.22});
  wc_land(ctx,xx=>hz+6*Math.sin(xx/80+x),WCP.far,0.3,{line:false});
  if(o.tower!==false){const tx=x+w*(o.tx||0.64),th=h*0.46;wc_part(ctx,wc_rect(tx-24,hz-th,48,th+12),WCP.stone,0.42);wc_part(ctx,[[tx-30,hz-th],[tx+30,hz-th],[tx,hz-th-h*0.14]],WCP.slate,0.42);
    wc_wash(ctx,wc_ell(tx,hz-th+30,11,11,20),WCP.clock,{depth:0.42,kind:"clock",lw:1.2});wc_part(ctx,wc_rect(x+w*0.08,hz-h*0.16,w*0.4,h*0.16+12),WCP.stone,0.36);}
  wc_land(ctx,xx=>hz+34+6*Math.sin(xx/120),WCP.lawn,0.5,{line:false});
  wc_roundTree(ctx,x+w*0.16,hz+44,h*0.36,0.5);wc_roundTree(ctx,x+w*0.9,hz+56,h*0.3,0.5,WCP.leaf2);ctx.restore();
  const f=16;for(const r of [wc_rect(x-f,y-f,w+2*f,f),wc_rect(x-f,y-f,f,h+2*f),wc_rect(x+w,y-f,f,h+2*f),wc_rect(x+w/2-6,y,12,h),wc_rect(x,y+h*0.42-6,w,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(x-30,y+h,w+60,24),wc_dim(o.wall||GV_ROOM.gov,0.1),{kind:"trim",lw:1.5});}
// a door to the corridor: its frame, the door, a narrow pane of glass and a handle; fy is the floor
function gv_door(ctx,x,fy,w,h,col){wc_wash(ctx,wc_rect(x-16,fy-h-16,w+32,h+16),WC_PAPER,{kind:"trim",lw:1.5});wc_wash(ctx,wc_rect(x,fy-h,w,h),col,{kind:"door",lw:1.6});
  wc_flat(ctx,wc_rect(x+w*0.3,fy-h+h*0.1,w*0.4,h*0.36),GV.glass,1,"window");wc_wash(ctx,wc_rect(x+w-36,fy-h*0.5,22,10),GV.metal,{kind:"thing",lw:1.2});}
// a desk from the front: its top at y, on the floor at fy; legs, a panel, and a pedestal of drawers
function gv_desk(ctx,x,y,w,fy,o){o=o||{};const col=o.col||GV.oak;wc_contact(ctx,x-20,x+w+20,fy+2,0.9,0.3);
  wc_part(ctx,wc_rect(x+26,y+20,w-52,(fy-y)*0.62),wc_dim(col,0.14),1);for(const lx of [x+8,x+w-34])wc_part(ctx,wc_rect(lx,y+18,26,fy-y-18),wc_dim(col,0.22),1);
  if(o.drawers!==false){const dx=o.left?x+30:x+w-206;wc_part(ctx,wc_rect(dx,y+18,176,fy-y-18),col,1);for(let i=0;i<3;i++){const dy=y+40+i*(fy-y-40)/3;wc_flat(ctx,wc_rect(dx+60,dy+18,56,8),wc_dim(col,0.4),1,"handle");}}
  wc_part(ctx,wc_rect(x-8,y,w+16,24),wc_lit(col,0.12),1);}
// an office chair's back, seen over a desk
function gv_chair(ctx,cx,y,o){o=o||{};wc_part(ctx,wc_rrPts(cx-74,y,148,o.h||150,26),o.col||GV.chair,1);}
// a bookcase on the floor at fy: its back, shelves at the given heights, sides and plinth
function gv_bookcase(ctx,x,fy,w,h,shelves,o){o=o||{};const col=o.col||GV.wood,top=fy-h;wc_contact(ctx,x-10,x+w+10,fy+2,0.9,0.25);
  wc_part(ctx,wc_rect(x,top,w,h),wc_dim(col,0.3),1,{lw:1.2});for(const sy of shelves)wc_part(ctx,wc_rect(x+14,sy,w-28,16),wc_lit(col,0.06),1);
  wc_part(ctx,wc_rect(x-10,top-16,w+20,20),col,1);wc_part(ctx,wc_rect(x-6,top,22,h),col,1);wc_part(ctx,wc_rect(x+w-16,top,22,h),col,1);wc_part(ctx,wc_rect(x-6,fy-26,w+12,26),wc_dim(col,0.06),1);}
// a screen's frame and its stand; what it shows is drawn every frame (gv_screen)
function gv_monitor(ctx,x,y,w,h,o){o=o||{};if(o.stand!==false){wc_part(ctx,[[x+w/2-16,y+h+8],[x+w/2+16,y+h+8],[x+w/2+22,y+h+56],[x+w/2-22,y+h+56]],GV.metal,1);
    wc_part(ctx,wc_rect(x+w/2-78,y+h+52,156,14),GV.metal,1);}wc_part(ctx,wc_rect(x-12,y-12,w+24,h+24),GV.bezel,1,{kind:"thing"});wc_flat(ctx,wc_rect(x,y,w,h),[230,234,240],1,"screen");}
// a cork board in a wooden frame, speckled
function gv_cork(ctx,x,y,w,h,fw){fw=fw||14;const k=fw/14;wc_part(ctx,wc_rect(x-fw,y-fw,w+2*fw,h+2*fw),GV.woodDark,1);wc_wash(ctx,wc_rect(x,y,w,h),GV.cork,{kind:"build",lw:1.1,seed:x|0});
  const R=wc_rng(x|0);ctx.save();for(let i=0;i<w*h/(260*k*k);i++){ctx.fillStyle=rgba(wc_dim(GV.cork,0.25+R()*0.2),0.35);ctx.beginPath();ctx.arc(x+R()*w,y+R()*h,(0.8+R()*1.6)*k,0,TAU);ctx.fill();}ctx.restore();}
// a plant in a pot, on the floor at fy
function gv_plant(ctx,x,fy,s){s=s||1;wc_contact(ctx,x-50*s,x+50*s,fy+2,0.9,0.25);const R=wc_rng(Math.round(x)),parts=[];for(let i=0;i<9;i++){const a=-Math.PI*0.5+(R()-0.5)*2.2,r=60*s+R()*70*s;
    parts.push(wc_ell(x+Math.cos(a)*r*0.7,fy-150*s+Math.sin(a)*r*0.9,(18+R()*14)*s,(42+R()*20)*s,18));}
  wc_wash(ctx,parts,WCP.leaf,{kind:"tree",seed:Math.round(x)});wc_part(ctx,[[x-46*s,fy-110*s],[x+46*s,fy-110*s],[x+36*s,fy],[x-36*s,fy]],[200,126,96],1);}
// a frame on the wall, with a paper mount; what's in it is drawn every frame
function gv_frame(ctx,x,y,w,h){wc_part(ctx,wc_rect(x-14,y-14,w+28,h+28),GV.woodDark,1);wc_flat(ctx,wc_rect(x,y,w,h),WC_CARD,1,"mount");}
// a ceiling light's glow on the wall
function gv_lightGlow(ctx,x,y,r){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,r,[255,246,222],0.5);ctx.restore();}

/* ---------- the university's places ---------- */
// The campus: the old sandstone building with its clock tower and glass wing, the newer building where the offices are, lawns, a
// path to its door. Nothing but the university's own.
const GV_CP={fy:742,door:[1462,742],path:[[700,1090],[900,980],[1160,880],[1380,800],[1462,750]]};
function gv_paintCampus(ctx){const P=WCP;wc_sky(ctx,700,8,{sun:[1640,160],cx:120,cw:1500});
  wc_forest(ctx,x=>620+12*Math.sin(x/230)+6*Math.sin(x/70),P.farForest,0.08,5,{h:34,w:22});wc_treeRow(ctx,()=>640,-40,1980,62,74,0.22,21,P.leaf2);
  wc_land(ctx,x=>660+5*Math.sin(x/300),P.lawn,0.42);
  wc_contact(ctx,30,640,668,0.46,0.22);wc_quad(ctx,40,668,0.46,0.6);wc_glassWing(ctx,628,668,140,160,0.48);
  // the newer building: a frame of pale concrete, bands of glass, a canopy over the door
  const bx=1040,bw=780,top=300,by=GV_CP.fy;wc_contact(ctx,bx-20,bx+bw+20,by+4,0.6,0.3);wc_part(ctx,wc_rect(bx,top,bw,by-top),P.concrete,0.6);
  for(let r=0;r<4;r++){const ry=top+40+r*100;wc_part(ctx,wc_rect(bx+30,ry,bw-60,64),P.glass,0.6,{kind:"glass"});
    ctx.save();ctx.strokeStyle=rgba(wc_dim(P.glass,0.35),0.6);ctx.lineWidth=3;for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(bx+30+i*(bw-60)/10,ry);ctx.lineTo(bx+30+i*(bw-60)/10,ry+64);ctx.stroke();}ctx.restore();}
  wc_part(ctx,wc_rect(bx-14,top-20,bw+28,24),wc_lit(P.concrete,0.1),0.6);
  const [dx]=GV_CP.door;wc_part(ctx,wc_rect(dx-70,by-150,140,150),P.glass,0.62,{kind:"glass"});wc_part(ctx,wc_rect(dx-110,by-176,220,22),P.slate,0.62);
  wc_roundTree(ctx,980,700,230,0.5);wc_roundTree(ctx,1870,712,210,0.5,P.leaf2);
  wc_wash(ctx,[[-60,766],[W+60,754],[W+60,H+60],[-60,H+60]],P.lawn,{depth:0.7,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth(GV_CP.path,8),260,46),P.paving,{depth:0.66,kind:"path",line:false});
  wc_lamp(ctx,860,960,320,0.8);wc_lamp(ctx,1690,820,240,0.66);wc_tufts(ctx,x=>760,0,620,40,0.9,6);}

// Yusuf's office: a door to the corridor, a window onto the campus, the chart pinned to a board, the framed score, his desk and chair,
// the shelf of binders. GV_OFF says where each is, for the scenes.
const GV_OFF={fy:850,door:[50,250,520],win:[318,150,330,430],board:[690,150,410,410],score:[1150,200,176,136],
  shelf:{x:1366,w:510,h:690,rows:[372,542,712]},desk:[700,664,600],chair:1000,plant:1318};
function gv_paintOffice(ctx){const O=GV_OFF,wall=GV_ROOM.gov;gv_wallFloor(ctx,wall,O.fy,{seed:11,vx:900});gv_lightGlow(ctx,960,0,520);
  gv_door(ctx,O.door[0],O.fy,O.door[1]-O.door[0],O.door[2],[176,140,108]);gv_window(ctx,O.win[0],O.win[1],O.win[2],O.win[3],{wall,seed:6});
  gv_cork(ctx,O.board[0],O.board[1],O.board[2],O.board[3]);gv_frame(ctx,O.score[0],O.score[1],O.score[2],O.score[3]);
  const S=O.shelf;gv_bookcase(ctx,S.x,O.fy,S.w,S.h,S.rows.concat([O.fy-40]),{});
  // the top shelf's books and boxes, which never move
  const R=wc_rng(9);let bx=S.x+30;while(bx<S.x+S.w-60){const bw=26+R()*22,bh=110+R()*40;wc_part(ctx,wc_rect(bx,S.rows[0]-bh,bw,bh),[[150,90,80],[96,118,150],[120,140,104],[196,170,120]][Math.floor(R()*4)],1,{lw:1.2});bx+=bw+4;
    if(R()<0.15){wc_part(ctx,wc_rect(bx+6,S.rows[0]-80,120,80),[214,196,160],1);bx+=130;}}
  // under the shelves, a cupboard: two doors and their knobs
  for(const j of [0,1]){const dx=S.x+22+j*(S.w/2-18);wc_part(ctx,wc_rect(dx,S.rows[2]+20,S.w/2-26,O.fy-62-S.rows[2]),wc_lit(GV.wood,0.05),1);
    wc_wash(ctx,wc_ell(dx+(j?22:S.w/2-48),S.rows[2]+62,6,6,12),GV.metal,{kind:"thing",lw:1});}
  gv_plant(ctx,O.plant,O.fy,0.9);gv_chair(ctx,O.chair,O.desk[1]-130);gv_desk(ctx,O.desk[0],O.desk[1],O.desk[2],O.fy+6,{left:true});
  // on the desk: a tray of papers and a pot of pens
  const dx=O.desk[0]+O.desk[2];wc_part(ctx,wc_rect(dx-210,O.desk[1]-30,120,30),[226,218,204],1);wc_flat(ctx,wc_rect(dx-200,O.desk[1]-38,100,10),WC_CARD,1,"papers");
  wc_part(ctx,[[dx-70,O.desk[1]],[dx-30,O.desk[1]],[dx-34,O.desk[1]-58],[dx-66,O.desk[1]-58]],[96,118,150],1);
  for(const [px,a,c] of [[-58,-0.2,[60,60,70]],[-48,0.1,[204,62,50]],[-40,0.25,[60,60,70]]]){ctx.save();ctx.translate(dx+px,O.desk[1]-56);ctx.rotate(a);wc_flat(ctx,wc_rect(-2,-40,5,42),c,1,"pen");ctx.restore();}}

// The newest DMBOK (the second edition, revised, 2024), standing on Yusuf's desk against the tray of papers, where the prologue sets
// it down before his first day; every film that shows his office draws it there (not from above: it stands at the desk's end, beside
// the tray, out of the close-ups' frame). A navy cover, its rules and words, the pages' edge: the cover kept, drawn small, so its
// words are decoration. The prologue draws its own copy, the same, as two hands bring it in.
const GV_DMB={x:1034,k:0.34,w:320,h:440,col:[46,58,88]};
function gv_deskBookC(){const D=GV_DMB,w=D.w,h=D.h;return wc_kept("gvDeskBook",w+80,h+80,q=>{q.translate(40,40);
  q.save();q.filter="blur(12px)";q.fillStyle="rgba(40,22,12,0.45)";q.fillRect(-18,16,w,h);q.restore();
  wc_flat(q,wc_rect(8,-8,w,h),[236,228,206],1,"pages");q.strokeStyle="rgba(150,136,112,0.5)";q.lineWidth=1.2;
  for(let i=1;i<4;i++){q.beginPath();q.moveTo(10,-8+i*2);q.lineTo(w+6,-8+i*2);q.stroke();q.beginPath();q.moveTo(w+8-i*2,-6);q.lineTo(w+8-i*2,h-10);q.stroke();}
  wc_wash(q,wc_rrPts(0,0,w,h,8),D.col,{kind:"cover",lw:1.5,seed:443});wc_flat(q,wc_rect(0,4,22,h-8),wc_dim(D.col,0.25),1,"spine");
  for(const ry of [86,318])wc_flat(q,wc_rect(48,ry,w-80,4),[226,214,180],0.9,"rule");});}
function gv_deskBook(ctx){const D=GV_DMB,h=D.h,T=(s,y,w,size,col)=>wc_T(ctx,s,11,y-h,{w,size,align:"center",col,deco:true});
  ctx.save();ctx.translate(D.x,GV_OFF.desk[1]);ctx.rotate(0.05);ctx.scale(D.k,D.k);ctx.drawImage(gv_deskBookC(),-D.w/2-40,-h-40);
  T("DAMA-DMBOK",160,800,40,[246,238,214]);T("Data Management",226,600,28,[226,232,226]);T("Body of Knowledge",266,600,28,[226,232,226]);
  T("Second Edition",364,600,28,[236,226,200]);T("Revised",402,600,28,[236,226,200]);ctx.restore();}

// The floor where the work is done, from the corridor: five offices behind glass, each with its name on the glass. GV_FL gives each
// office's left edge and its person's spot; the people are drawn every frame, then the glass over them (gv_floorGlass), then the names.
const GV_FL={fy:830,top:140,inner:700,rooms:[["plan","Planning"],["reg","Registrar's office"],["gov","Data governance"],["data","Data team"],["plat","Platform team"]],
  x:i=>i*384+16,w:352,spot:i=>i*384+16+(i%2?120:236),walk:905};
function gv_paintFloor(ctx){const F=GV_FL;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,F.top+40),GV.ceiling,{kind:"plaster",line:false,seed:3});
  F.rooms.forEach(([k],i)=>{const x=F.x(i),w=F.w,wall=GV_ROOM[k],odd=i%2;
    // inside: the room's back wall and floor, a window, a desk and a screen, and what each office has of its own
    wc_wash(ctx,wc_rect(x,F.top,w,F.inner-F.top),wall,{kind:"plaster",line:false,seed:7+i*5});wc_wash(ctx,wc_rect(x,F.inner,w,F.fy-F.inner),wc_lit(GV.floor,0.12),{kind:"ground",line:false,seed:9+i});
    wc_flat(ctx,wc_rect(x,F.inner-10,w,12),wc_dim(wall,0.16),1,"skirting");
    const wx=odd?x+w-170:x+34;gv_window(ctx,wx,F.top+130,136,190,{wall,seed:20+i,tx:0.5,tower:i===2});
    const ox=odd?x+20:x+w-176,oy=F.top+140;
    // Planning: a chart of this year's numbers; the registrar's office: archive boxes on a shelf; data governance: two shelves of
    // binders; the data team: a whiteboard, written on; the platform team: a rack of servers under the window
    if(k==="plan"){wc_part(ctx,wc_rect(ox+6,oy,150,120),WC_CARD,0.9,{lw:1.2});[0.5,0.7,0.45,0.85,0.62].forEach((v,j)=>wc_flat(ctx,wc_rect(ox+26+j*24,oy+104-v*80,16,v*80),j===4?GV.gold:[140,176,210],0.9,"bar"));}
    if(k==="reg"){wc_part(ctx,wc_rect(ox,oy+96,160,10),GV.wood,0.9);for(let j=0;j<3;j++){wc_part(ctx,wc_rect(ox+8+j*50,oy+34,44,62),[214,200,170],0.9,{lw:1.1});wc_flat(ctx,wc_rect(ox+18+j*50,oy+48,24,12),WC_CARD,0.9,"label");}}
    if(k==="gov")for(const sy of [oy+60,oy+150]){wc_part(ctx,wc_rect(ox,sy,160,10),GV.wood,0.9);for(let j=0;j<9;j++)wc_part(ctx,wc_rect(ox+6+j*17,sy-64,14,64),[[96,118,150],[150,90,80],[120,140,104],[186,160,110]][j%4],0.9,{lw:1});}
    if(k==="data"){wc_part(ctx,wc_rect(ox,oy,160,116),[248,248,246],0.9,{lw:1.2});ctx.save();ctx.lineWidth=3;ctx.lineCap="round";
      [[[24,30],[70,30]],[[24,52],[110,52]],[[24,74],[90,74]],[[118,40],[140,60]],[[140,60],[118,88]]].forEach(([a,b],j)=>{ctx.strokeStyle=rgba(j>2?[204,62,50]:[60,110,170],0.7);ctx.beginPath();ctx.moveTo(ox+a[0],oy+a[1]);ctx.lineTo(ox+b[0],oy+b[1]);ctx.stroke();});ctx.restore();}
    if(k==="plat"){const rx=x+44,ry=F.inner-236;wc_part(ctx,wc_rect(rx,ry,74,236),[70,76,90],0.9);for(let j=0;j<6;j++){wc_flat(ctx,wc_rect(rx+8,ry+12+j*36,58,26),[96,104,120],0.9,"unit");
      [[120,220,160],[120,200,255]].forEach((c,l)=>{ctx.fillStyle=rgba(c,0.85);ctx.beginPath();ctx.arc(rx+18+l*12,ry+25+j*36,3,0,TAU);ctx.fill();});}}
    const dx=odd?x+20:x+w-190;wc_part(ctx,wc_rect(dx,F.inner-120,170,16),wc_lit(GV.oak,0.1),0.9);wc_part(ctx,wc_rect(dx+10,F.inner-104,14,104),wc_dim(GV.oak,0.2),0.9);wc_part(ctx,wc_rect(dx+146,F.inner-104,14,104),wc_dim(GV.oak,0.2),0.9);
    wc_part(ctx,wc_rect(dx+50,F.inner-212,92,62),GV.bezel,0.9,{kind:"thing"});wc_flat(ctx,wc_rect(dx+56,F.inner-206,80,50),[226,232,240],0.9,"screen");wc_part(ctx,wc_rect(dx+90,F.inner-150,12,30),GV.metal,0.9);});
  // the walls between the offices
  for(let i=0;i<=5;i++){const x=i*384-4;wc_part(ctx,wc_rect(x,F.top-6,24,F.fy-F.top+6),GV.ceiling,1,{lw:1.3});}
  // the corridor's floor, and a long rug where people walk
  wc_wash(ctx,wc_rect(-40,F.fy,W+80,H-F.fy+40),GV.corridor,{kind:"ground",line:false,seed:31});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(GV.corridor,0.18),0.32);ctx.lineWidth=2;for(let i=-16;i<=16;i++){ctx.beginPath();ctx.moveTo(960+i*64,F.fy);ctx.lineTo(960+i*190,H+40);ctx.stroke();}ctx.restore();
  wc_wash(ctx,[[-60,F.fy+28],[W+60,F.fy+28],[W+60,F.fy+100],[-60,F.fy+100]],[176,190,206],{kind:"ground",line:false,seed:33,a:0.75});
  for(let i=0;i<5;i++)gv_lightGlow(ctx,192+i*384,F.top-10,300);}
// the glass in front of the offices, over the people inside: a pale wash, light across it, the door's edge and handle, a bottom rail
function gv_floorGlass(ctx){const F=GV_FL;ctx.drawImage(wc_kept("floorGlass",W,H,c=>{F.rooms.forEach(([k],i)=>{const x=F.x(i),w=F.w,h=F.fy-F.top;
    c.save();c.globalAlpha=0.16;c.fillStyle=rgba(GV.glass,1);c.fillRect(x,F.top,w,h);c.restore();
    c.save();c.beginPath();c.rect(x,F.top,w,h);c.clip();c.globalCompositeOperation="screen";for(const [o,ww] of [[0.16,70],[0.34,24],[0.72,46]]){const g=c.createLinearGradient(x+w*o,0,x+w*o+ww,0);
      g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(255,255,255,0.16)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.beginPath();c.moveTo(x+w*o,F.top);c.lineTo(x+w*o+ww,F.top);c.lineTo(x+w*o+ww-160,F.fy);c.lineTo(x+w*o-160,F.fy);c.closePath();c.fill();}c.restore();
    const dx=i%2?x+w-96:x+96;c.save();c.strokeStyle=rgba(GV.metal,0.9);c.lineWidth=3;c.beginPath();c.moveTo(dx,F.top);c.lineTo(dx,F.fy);c.stroke();c.lineWidth=6;c.lineCap="round";c.beginPath();c.moveTo(dx+(i%2?14:-14),F.top+330);c.lineTo(dx+(i%2?14:-14),F.top+420);c.stroke();c.restore();});
  wc_wash(c,wc_rect(-20,F.fy-14,W+40,16),GV.metal,{kind:"trim",lw:1.2});wc_wash(c,wc_rect(-20,F.top-8,W+40,14),GV.metal,{kind:"trim",lw:1.2});}),0,0);}
// an office's name on its glass, on a frosted band
function gv_floorName(ctx,i,a){if(a<=0.01)return;const F=GV_FL,x=F.x(i),name=F.rooms[i][1];withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(255,255,255,0.62)";ctx.fillRect(x+12,F.top+28,F.w-24,56);ctx.restore();
  wc_T(ctx,name,x+F.w/2,F.top+67,{w:800,size:30,align:"center",col:WC_DARK});});}

// The data team's room: a window, the cork board where the reports go, the poster of the loop they build in, Jun's desk and two
// screens.
const GV_DT={fy:856,win:[70,150,330,440],board:[450,150,430,380],poster:[920,130,560,360],desk:[1470,668,430],mon:[[1490,474,180,126],[1690,474,180,126]]};
function gv_paintData(ctx,o){const D=GV_DT,wall=GV_ROOM.data;gv_wallFloor(ctx,wall,D.fy,{seed:21,vx:1000});gv_lightGlow(ctx,980,0,560);
  gv_window(ctx,D.win[0],D.win[1],D.win[2],D.win[3],{wall,seed:12,tx:0.4});gv_cork(ctx,D.board[0],D.board[1],D.board[2],D.board[3]);
  gv_poster(ctx,D.poster[0],D.poster[1],D.poster[2],D.poster[3],o);
  gv_chair(ctx,1690,D.desk[1]-128,{col:[96,84,120]});gv_desk(ctx,D.desk[0],D.desk[1],D.desk[2],D.fy+6,{});D.mon.forEach(m=>gv_monitor(ctx,m[0],m[1],m[2],m[3]));
  gv_plant(ctx,428,D.fy,0.6);}
// the data team's poster: how they build, in ten steps round a loop (In the weeds of data crafting's loop, as they'd pin it up), from
// a question to a new version. Drawn for a poster 1260 wide (the close-up) and scaled to any other size; gv_loopPos says where step i is.
// The series' first two parts show no technical words, and a step's name ("review · ship") or mark ("PR") is one: so by default each
// name is a grey bar for each word, as text reads from across a room, and each step shows its number. A film of the third part, which
// builds it in the tools, passes {words:true} for the names and marks (to gv_paintData, gv_paintPosterClose or gv_poster).
const GV_LOOPC=[96,160,176];
// a name too far off to read: a rounded grey bar as long as each word, a dot for a "·", on the line where the words would sit
function gv_wordBars(ctx,s,x,y,size,align){ctx.save();ctx.font=font(700,size);const sp=ctx.measureText(" ").width,ws=s.split(" "),
  wd=ws.map(t=>t==="·"?size*0.24:ctx.measureText(t).width),tot=wd.reduce((p,q)=>p+q,0)+sp*(ws.length-1),hh=size*0.42,cy=y-size*0.34;
  let bx=align==="center"?x-tot/2:align==="right"?x-tot:x;ctx.fillStyle=ctx.strokeStyle=rgba(WC_MUTED,0.46);ctx.lineWidth=hh;ctx.lineCap="round";
  ws.forEach((t,i)=>{ctx.beginPath();if(t==="·"){ctx.arc(bx+wd[i]/2,cy,size*0.1,0,TAU);ctx.fill();}
    else{ctx.moveTo(bx+hh/2,cy);ctx.lineTo(bx+Math.max(hh/2,wd[i]-hh/2),cy);ctx.stroke();}bx+=wd[i]+sp;});ctx.restore();}
function gv_loopPos(i,x,y,w,h){const k=w/1260,an=-Math.PI/2+i/10*TAU;return[x+w/2+Math.cos(an)*330*k,y+h*450/810+Math.sin(an)*270*k];}
function gv_loopArt(ctx,x,y,w,h,o){const k=w/1260,cx=x+w/2,cy=y+h*450/810,words=!!(o&&o.words);
  wc_T(ctx,"How we build",cx,y+86*k,{w:800,size:50*k,align:"center",col:WC_DARK});
  // the loop: a pencil line round it, a chevron between each two steps, going round clockwise
  ctx.save();ctx.strokeStyle=rgba(wc_dim(GV_LOOPC,0.2),0.6);ctx.lineWidth=3.2*k;ctx.setLineDash([3*k,11*k]);ctx.lineCap="round";ctx.beginPath();ctx.ellipse(cx,cy,330*k,270*k,0,0,TAU);ctx.stroke();ctx.restore();
  for(let i=0;i<10;i++){const an=-Math.PI/2+(i+0.5)/10*TAU,px=cx+Math.cos(an)*330*k,py=cy+Math.sin(an)*270*k,d=Math.atan2(Math.cos(an)*270,-Math.sin(an)*330);
    ctx.save();ctx.translate(px,py);ctx.rotate(d);ctx.strokeStyle=rgba(wc_dim(GV_LOOPC,0.3),0.8);ctx.lineWidth=3.4*k;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-7*k,-9*k);ctx.lineTo(4*k,0);ctx.lineTo(-7*k,9*k);ctx.stroke();ctx.restore();}
  // each step: a chip with its mark (or its number), and its name (or its bars) outside the loop
  STEPS10.forEach(([nm,sym],i)=>{const [sx,sy]=gv_loopPos(i,x,y,w,h),an=-Math.PI/2+i/10*TAU,c=Math.cos(an),s=Math.sin(an),r=30*k,mk=words?sym:String(i+1);
    wc_wash(ctx,wc_ell(sx,sy,r,r,28),wc_lit(GV_LOOPC,0.5),{kind:"thing",lw:1.4*Math.max(0.6,k),seed:40+i});
    wc_T(ctx,mk,sx,sy+(mk.length>1?8:10)*k,{w:800,size:(mk.length>2?21:mk.length>1?24:28)*k,align:"center",col:wc_dim(GV_LOOPC,0.55)});
    const top=i===0,bot=i===5,al=top||bot?"center":c>0?"left":"right",nx=top||bot?sx:sx+(c>0?1:-1)*(r+16*k),ny=top?sy-r-16*k:bot?sy+r+40*k:sy+10*k;
    if(words)wc_T(ctx,nm,nx,ny,{w:700,size:29*k,align:al,col:WC_INK});else gv_wordBars(ctx,nm,nx,ny,29*k,al);});}
// the poster on the wall: paper, a pin in each top corner, the loop
function gv_poster(ctx,x,y,w,h,o){const k=w/1260;ctx.save();ctx.filter="blur("+Math.max(2,8*k)+"px)";ctx.fillStyle="rgba(70,60,50,0.18)";ctx.fillRect(x+8*k,y+12*k,w,h);ctx.restore();
  wc_wash(ctx,wc_rect(x,y,w,h),[251,250,245],{kind:"paper",lw:Math.max(1,1.6*k),seed:5});gv_loopArt(ctx,x,y,w,h,o);for(const px of [x+30*k,x+w-30*k])gv_pin(ctx,px,y+28*k,GV.red,Math.max(0.5,1.5*k));}

// The platform team's room: two racks of servers, a whiteboard of what's connected to what, a desk and two screens, a window.
const GV_PF={fy:856,win:[1500,150,330,430],rack:[[80,250,170,606],[262,250,170,606]],board:[540,190,420,300],desk:[1000,668,520],mon:[[1060,470,190,130],[1290,470,190,130]]};
// a rack of servers: a dark cabinet, its units, a green and a blue light on each
function gv_rack(ctx,x,y,w,h,seed){wc_contact(ctx,x-10,x+w+10,y+h+2,0.9,0.3);wc_part(ctx,wc_rect(x,y,w,h),[70,76,90],1,{seed});const n=Math.floor((h-40)/52);
  for(let j=0;j<n;j++){const uy=y+22+j*52;wc_flat(ctx,wc_rect(x+14,uy,w-28,40),[96,104,120],1,"unit");ctx.save();ctx.strokeStyle="rgba(40,44,54,0.5)";ctx.lineWidth=2;for(let v=0;v<5;v++){ctx.beginPath();ctx.moveTo(x+70+v*12,uy+10);ctx.lineTo(x+70+v*12,uy+30);ctx.stroke();}ctx.restore();
    [[120,220,160],[120,200,255]].forEach((c,l)=>{ctx.fillStyle=rgba(c,0.9);ctx.beginPath();ctx.arc(x+30+l*18,uy+20,4.5,0,TAU);ctx.fill();});}}
// a whiteboard, written on in marker: boxes and the arrows between them
function gv_whiteboard(ctx,x,y,w,h){wc_part(ctx,wc_rect(x-10,y-10,w+20,h+20),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(x,y,w,h),[250,251,250],1,"board");
  ctx.save();ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";const k=w/420,box=(bx,by,bw,bh,c)=>{ctx.strokeStyle=rgba(c,0.75);ctx.beginPath();ctx.rect(x+bx*k,y+by*k,bw*k,bh*k);ctx.stroke();};
  box(30,40,110,64,[60,110,170]);box(250,30,130,70,[60,110,170]);box(150,180,130,70,[40,140,90]);
  ctx.strokeStyle=rgba([204,62,50],0.75);[[[140,72],[250,64]],[[86,104],[180,180]],[[316,100],[250,180]]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(x+a[0]*k,y+a[1]*k);ctx.lineTo(x+b[0]*k,y+b[1]*k);ctx.stroke();});
  ctx.strokeStyle=rgba([60,60,70],0.5);ctx.lineWidth=3;for(const [bx,by,bw] of [[44,66,70],[264,58,90],[166,208,90]]){ctx.beginPath();ctx.moveTo(x+bx*k,y+by*k);ctx.lineTo(x+(bx+bw)*k,y+by*k);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(x+w*0.3,y+h+10,w*0.4,12),GV.metal,1);}
function gv_paintPlatform(ctx){const P=GV_PF,wall=GV_ROOM.plat;gv_wallFloor(ctx,wall,P.fy,{seed:61,vx:960});gv_lightGlow(ctx,960,0,540);
  gv_window(ctx,P.win[0],P.win[1],P.win[2],P.win[3],{wall,seed:18,tx:0.5});P.rack.forEach((r,i)=>gv_rack(ctx,r[0],r[1],r[2],r[3],7+i));
  gv_whiteboard(ctx,P.board[0],P.board[1],P.board[2],P.board[3]);
  gv_chair(ctx,1260,P.desk[1]-128,{col:[70,96,110]});gv_desk(ctx,P.desk[0],P.desk[1],P.desk[2],P.fy+6,{});P.mon.forEach(m=>gv_monitor(ctx,m[0],m[1],m[2],m[3]));
  gv_plant(ctx,1884,P.fy,0.7);}

// Close-ups: a cork board filling the frame, on its room's wall; a screen on a desk; the data team's poster
const GV_BC=[210,50,1500,820],GV_SC=[330,70,1260,690],GV_PC=[330,40,1260,810];
function gv_paintBoardClose(ctx,wall){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:71});
  gv_lightGlow(ctx,960,-80,900);const [x,y,w,h]=GV_BC;gv_cork(ctx,x,y,w,h,34);}
function gv_paintScreenDesk(ctx,wall){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,960),wall,{kind:"plaster",line:false,seed:73});
  wc_wash(ctx,wc_rect(-40,900,W+80,220),GV.oak,{kind:"plaster",line:false,seed:74});wc_wash(ctx,wc_rect(-40,894,W+80,14),wc_dim(GV.oak,0.25),{kind:"trim",line:false,flat:true});
  const [x,y,w,h]=GV_SC;wc_part(ctx,[[x+w/2-40,y+h+12],[x+w/2+40,y+h+12],[x+w/2+52,912],[x+w/2-52,912]],GV.metal,1);wc_wash(ctx,wc_ell(x+w/2,918,190,22,30),GV.metal,{kind:"thing",lw:1.4});
  gv_monitor(ctx,x,y,w,h,{stand:false});
  wc_part(ctx,wc_rect(1660,960,420,160),[226,228,234],1);wc_wash(ctx,wc_ell(160,990,70,40,30),[236,240,244],{kind:"thing",lw:1.4});}
function gv_paintPosterClose(ctx,o){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.data,{kind:"plaster",line:false,seed:75});
  gv_lightGlow(ctx,960,-60,900);const [x,y,w,h]=GV_PC;gv_poster(ctx,x,y,w,h,o);}

// Planning's office: a big screen on the wall, a desk, a window.
const GV_PL={fy:856,screen:[560,172,700,390],win:[1500,150,320,430],desk:[90,668,470]};
function gv_paintPlanning(ctx){const P=GV_PL,wall=GV_ROOM.plan;gv_wallFloor(ctx,wall,P.fy,{seed:31,vx:900});gv_lightGlow(ctx,900,0,520);
  gv_window(ctx,P.win[0],P.win[1],P.win[2],P.win[3],{wall,seed:14,tx:0.3});gv_monitor(ctx,P.screen[0],P.screen[1],P.screen[2],P.screen[3],{stand:false});
  gv_chair(ctx,330,P.desk[1]-128,{col:[90,110,96]});gv_desk(ctx,P.desk[0],P.desk[1],P.desk[2],P.fy+6,{});gv_monitor(ctx,250,476,180,124);gv_plant(ctx,1400,P.fy,0.9);}

// The registrar's office: shelves of archive boxes, a desk, a window.
const GV_RG={fy:856,shelf:[70,520],desk:[700,664,640],win:[1530,150,300,430]};
function gv_paintRegistrar(ctx){const G=GV_RG,wall=GV_ROOM.reg;gv_wallFloor(ctx,wall,G.fy,{seed:41,vx:1000});gv_lightGlow(ctx,1000,0,520);
  gv_window(ctx,G.win[0],G.win[1],G.win[2],G.win[3],{wall,seed:16,tx:0.55});
  gv_bookcase(ctx,G.shelf[0],G.fy,G.shelf[1],680,[350,520,690],{col:[176,150,120]});
  const R=wc_rng(4);for(const sy of [350,520,690])for(let i=0;i<4;i++){const bx=G.shelf[0]+34+i*118;wc_part(ctx,wc_rect(bx,sy-118,104,118),[[214,200,170],[196,186,160],[222,210,184]][i%3],1);
    wc_flat(ctx,wc_rect(bx+28,sy-90,48,28),WC_CARD,1,"label");if(R()<0.5)wc_flat(ctx,wc_rect(bx+40,sy-40,24,10),wc_dim([196,186,160],0.4),1,"hole");}
  gv_chair(ctx,1020,G.desk[1]-128,{col:[70,84,120]});gv_desk(ctx,G.desk[0],G.desk[1],G.desk[2],G.fy+6,{});gv_plant(ctx,1440,G.fy,0.85);}

// Yusuf's desk from above, for the papers on it: oak with its grain, a mug, a pencil, the edge of a keyboard
function gv_paintDesk(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV.oak,{kind:"plaster",line:false,seed:51});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(3);for(let i=0;i<70;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(GV.oak,0.2+R()*0.12),0.18+R()*0.14);ctx.lineWidth=1+R()*2.4;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+6*Math.sin(x/300+i)+3*Math.sin(x/90+i*2));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(1500,-40,460,120),[226,228,234],1);for(let i=0;i<9;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(1516+i*48,-24+j*44,40,36),[244,245,248],1,"key");
  wc_wash(ctx,wc_ell(150,140,82,82,40),[236,240,244],{kind:"thing",lw:1.6});wc_wash(ctx,wc_ell(150,140,62,62,40),[150,104,70],{kind:"thing",line:false});
  wc_part(ctx,[[1640,980],[1900,900],[1906,912],[1646,994]],[244,196,80],1);wc_flat(ctx,[[1900,900],[1930,892],[1906,912]],[60,54,58],1,"tip");}

/* ---------- people at a table or a desk ---------- */
// a person behind a table or a desk, cut off at its top (cutY), which the place's front layer then draws over them: sitting, the
// top 230·s px of them shows above it (head, shoulders, chest); standing (o.standing), the top 330·s px, from the hips up
const GV_SIT=335,GV_STAND=235;
function gv_behind(ctx,id,x,cutY,s,o){o=o||{};ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cutY+H);ctx.clip();person(ctx,id,x,cutY+(o.standing?GV_STAND:GV_SIT)*s,s,o);ctx.restore();}

/* ---------- the places the later films share ---------- */
// painted once for every film after the first, so no film changes them for itself
// sticky notes, in four colours
const GV_NOTE=[[252,224,118],[246,178,190],[170,208,240],[184,224,168]];
// a sticky note, square, with two scribbled lines on it (nobody needs to read them)
function gv_note(ctx,x,y,s,col,rot,seed){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.fillStyle="rgba(70,60,50,0.16)";ctx.fillRect(-s/2+3,-s/2+5,s,s);
  wc_wash(ctx,wc_rect(-s/2,-s/2,s,s),col,{kind:"swatch",seed:seed||(x|0)});ctx.strokeStyle=rgba(wc_dim(col,0.55),0.55);ctx.lineWidth=Math.max(1.4,s/26);ctx.lineCap="round";
  const R=wc_rng(seed||(x|0));for(let i=0;i<2;i++){const ly=-s*0.16+i*s*0.24;ctx.beginPath();ctx.moveTo(-s*0.32,ly);for(let k=1;k<=6;k++)ctx.lineTo(-s*0.32+k*s*(0.1+R()*0.012)*(i?0.8:1),ly+(R()-0.5)*s*0.05);ctx.stroke();}ctx.restore();}
// a pendant lamp hanging from the ceiling: its cord, a shade, and the light under it
function gv_pendant(ctx,x,y,s){s=s||1;ctx.save();ctx.strokeStyle=rgba([70,66,64],0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x,y);ctx.stroke();ctx.restore();
  wc_part(ctx,[[x-12*s,y],[x+12*s,y],[x+60*s,y+46*s],[x-60*s,y+46*s]],[60,82,74],1,{lw:1.4});ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y+56*s,150*s,[255,240,200],0.42);ctx.restore();}
// a mug on a desk or table, its handle to one side
function gv_mug(ctx,x,y,col,flip){const k=flip?-1:1;wc_wash(ctx,[[x+k*22,y-44],[x+k*38,y-40],[x+k*38,y-18],[x+k*22,y-14]],col,{kind:"thing",lw:1.2,bare:true});
  wc_part(ctx,wc_rect(x-24,y-54,48,54),col,1,{lw:1.3});wc_flat(ctx,wc_ell(x,y-54,24,6,16),wc_dim(col,0.3),1,"rim");}
// a closed notebook lying on a table, seen from the front: a thin block, its cover, an elastic band
function gv_book(ctx,x,y,w,col){wc_part(ctx,wc_rect(x,y-14,w,14),col,1,{lw:1.2});wc_flat(ctx,wc_rect(x+w*0.8,y-14,6,14),wc_dim(col,0.4),1,"band");}

// The meeting room where the stewards meet: a whiteboard of sticky notes, a screen for those who join from elsewhere, two lamps over
// a long table, a window. People sit behind the table (gv_behind at GV_MT.top), and the table is the place's front layer
// (gv_paintMeetingTable, kept like a place: list both in the film's WC_PLACES and draw the table after the people). GV_MT says where
// everything is: the five seats along the table, and a spot to stand at the board, for people at scale s.
const GV_MT={fy:856,board:[110,148,660,388],screen:[934,170,540,304],win:[1610,150,260,420],top:752,table:[290,1340],seats:[480,720,960,1200,1440],stand:[190,905],s:0.8};
function gv_paintMeeting(ctx){const M=GV_MT,wall=GV_ROOM.meet;gv_wallFloor(ctx,wall,M.fy,{seed:81,vx:960});gv_lightGlow(ctx,660,0,560);gv_lightGlow(ctx,1260,0,560);
  gv_window(ctx,M.win[0],M.win[1],M.win[2],M.win[3],{wall,seed:24,tx:0.42});
  // the whiteboard: three groups of notes, and room on its left for what a film adds
  const [bx,by,bw,bh]=M.board;wc_part(ctx,wc_rect(bx-10,by-10,bw+20,bh+20),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(bx,by,bw,bh),[250,251,250],1,"board");
  const R=wc_rng(14);[[bx+300,by+40],[bx+420,by+40],[bx+540,by+40]].forEach(([gx,gy],g)=>{for(let i=0;i<5-(g%2);i++){const nx=gx+(i%2)*56+(R()-0.5)*8,ny=gy+30+Math.floor(i/2)*64+(R()-0.5)*6;
    gv_note(ctx,nx,ny,50,GV_NOTE[(g+i)%4],(R()-0.5)*0.12,30+g*7+i);}});
  ctx.save();ctx.strokeStyle=rgba([60,110,170],0.6);ctx.lineWidth=3.4;ctx.lineCap="round";for(const [lx,ly,lw] of [[bx+290,by+22,84],[bx+410,by+22,70],[bx+530,by+22,90]]){ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+lw,ly+2);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(bx+bw*0.3,by+bh+10,bw*0.4,12),GV.metal,1);for(const [mx,c] of [[bx+bw*0.36,[204,62,50]],[bx+bw*0.42,[60,110,170]],[bx+bw*0.48,[40,140,90]]])wc_flat(ctx,wc_rect(mx,by+bh+2,34,10),c,1,"marker");
  // the screen on the wall, and the lamps over the table
  const [sx,sy,sw,sh]=M.screen;wc_part(ctx,wc_rect(sx-12,sy-12,sw+24,sh+24),GV.bezel,1,{kind:"thing"});wc_flat(ctx,wc_rect(sx,sy,sw,sh),[230,234,240],1,"screen");
  gv_pendant(ctx,720,96,1);gv_pendant(ctx,1200,96,1);
  // the chairs' backs along the far side of the table
  M.seats.forEach((x,i)=>{wc_part(ctx,wc_rrPts(x-70,M.top-150,140,170,30),[74,84,104],1,{seed:90+i});wc_flat(ctx,wc_rect(x-50,M.top-128,100,8),wc_lit([74,84,104],0.18),1,"seam");});
  gv_plant(ctx,1896,M.fy,0.95);}
// the table, over the people sitting at it: its top, its edge, the panel under it to the floor, and what's on it (a jug of water and
// glasses, notebooks, a plate of biscuits, a box of markers), each between two seats
function gv_paintMeetingTable(ctx){const M=GV_MT,[x0,w]=M.table,top=M.top,col=GV.oak;
  wc_contact(ctx,x0-30,x0+w+30,976,0.9,0.34);
  wc_part(ctx,wc_rect(x0+44,top+56,w-88,920-top-56),wc_dim(col,0.26),1);for(const lx of [x0+16,x0+w-58])wc_part(ctx,wc_rect(lx,top+56,42,976-top-56),wc_dim(col,0.32),1);
  wc_part(ctx,wc_rect(x0,top,w,40),wc_lit(col,0.12),1);wc_part(ctx,wc_rect(x0-6,top+38,w+12,20),wc_dim(col,0.06),1);
  // between the seats: the jug and two glasses, notebooks, biscuits, markers
  const S=M.seats,mid=i=>(S[i]+S[i+1])/2,ty=top+26;
  wc_part(ctx,[[mid(0)-30,ty],[mid(0)+30,ty],[mid(0)+34,ty-96],[mid(0)+20,ty-110],[mid(0)-26,ty-110],[mid(0)-34,ty-96]],[214,230,236],1,{kind:"thing",lw:1.3});
  wc_flat(ctx,[[mid(0)-30,ty-4],[mid(0)+30,ty-4],[mid(0)+32,ty-62],[mid(0)-32,ty-62]],[176,208,222],1,"water");
  for(const gx of [mid(0)+60,mid(1)-60]){wc_part(ctx,wc_rect(gx-16,ty-52,32,52),[226,236,240],1,{kind:"thing",lw:1.1});wc_flat(ctx,wc_rect(gx-14,ty-28,28,24),[186,214,226],1,"water");}
  gv_book(ctx,mid(1)-10,ty+6,96,[96,118,150]);gv_book(ctx,mid(1)-2,ty-8,84,[176,96,80]);
  wc_flat(ctx,wc_ell(mid(2),ty+2,74,12,24),[236,236,232],1,"plate");for(const [dx,dy] of [[-34,-8],[0,-12],[30,-8],[-14,-20],[16,-22]])wc_wash(ctx,wc_ell(mid(2)+dx,ty+dy,22,9,16),[212,164,104],{kind:"thing",lw:1});
  wc_part(ctx,wc_rect(mid(3)-46,ty-24,92,30),[226,218,204],1,{lw:1.2});[[204,62,50],[60,110,170],[40,140,90],[40,40,48]].forEach((c,i)=>wc_flat(ctx,wc_rect(mid(3)-38+i*20,ty-46,14,24),c,1,"marker"));}

// A desk close up, the camera at the height of someone sitting: the room's wall behind, the desk's top across the frame, and its
// front below. Shared by the registrar's office, the platform team's room and the faculty office: each paints its own wall and
// what's on it, then the desk (its front layer, drawn over whoever sits there with gv_behind at the place's top).
function gv_deskFront(ctx,top,col,drawers){wc_part(ctx,wc_rect(-40,top+44,W+80,H-top),wc_dim(col,0.2),1,{seed:top});
  wc_part(ctx,wc_rect(-40,top,W+80,52),wc_lit(col,0.1),1,{seed:top+3});wc_flat(ctx,wc_rect(-40,top+46,W+80,10),wc_dim(col,0.3),1,"edge");
  for(const [dx,dw] of drawers||[]){wc_part(ctx,wc_rect(dx,top+76,dw,H-top-60),wc_dim(col,0.12),1,{seed:dx|0});for(const hy of [top+150,top+250])wc_flat(ctx,wc_rect(dx+dw/2-40,hy,80,12),wc_dim(col,0.45),1,"handle");}}
// a screen standing on a desk whose top is at y: bezel, the screen itself, a neck and a foot
function gv_deskScreen(ctx,x,y,w,h,top){wc_part(ctx,[[x+w/2-26,y+h+10],[x+w/2+26,y+h+10],[x+w/2+34,top+12],[x+w/2-34,top+12]],GV.metal,1);
  wc_wash(ctx,wc_ell(x+w/2,top+16,130,14,30),wc_dim(GV.metal,0.06),{kind:"thing",lw:1.3});gv_monitor(ctx,x,y,w,h,{stand:false});}
// a keyboard and a mouse, flat on a desk whose top is at y
function gv_keys(ctx,x,top,w,mx){wc_part(ctx,[[x,top+40],[x+w,top+40],[x+w-10,top+18],[x+10,top+18]],[226,228,234],1,{lw:1.2});
  ctx.save();ctx.fillStyle=rgba([180,184,192],0.6);for(let i=0;i<14;i++)for(let j=0;j<2;j++)ctx.fillRect(x+18+i*(w-36)/14,top+22+j*8,(w-36)/14-4,5);ctx.restore();
  if(mx!=null)wc_wash(ctx,wc_ell(mx,top+30,22,13,20),[232,234,238],{kind:"thing",lw:1.2});}

// The registrar's office, close: Mei's desk. Behind it, the shelves of archive boxes, a framed degree with the university's seal, and
// the year's calendar with its dates marked; on the desk, a tray of certificates, the office's stamp, a screen and a mug. GV_RX: the
// desk's top, a seat for scale s, the screen (what it shows is drawn every frame), the frame and the calendar.
const GV_RX={top:792,seat:[560,1.7],screen:[1140,330,560,350],cert:[420,96,280,200],cal:[820,92,224,240]};
function gv_paintRegistrarClose(ctx){const X=GV_RX,wall=GV_ROOM.reg;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:43});gv_lightGlow(ctx,700,-60,760);
  // the shelves, at the left edge
  gv_bookcase(ctx,-60,X.top+40,400,X.top+120,[250,520,X.top-10],{col:[176,150,120]});
  for(const sy of [250,520,782])for(let i=0;i<3;i++){const bx=-22+i*112;wc_part(ctx,wc_rect(bx,sy-150,100,150),[[214,200,170],[196,186,160],[222,210,184]][(i+sy)%3],1);
    wc_flat(ctx,wc_rect(bx+26,sy-118,48,32),WC_CARD,1,"label");wc_flat(ctx,wc_rect(bx+38,sy-52,24,10),wc_dim([196,186,160],0.4),1,"hole");}
  // a degree in its frame: cream paper, a heading, lines of copperplate, the seal in red wax with its ribbon
  const [cx,cy,cw,ch]=X.cert;gv_frame(ctx,cx,cy,cw,ch);wc_flat(ctx,wc_rect(cx+18,cy+16,cw-36,ch-32),[248,240,220],1,"parchment");
  ctx.save();ctx.strokeStyle=rgba([90,70,50],0.55);ctx.lineCap="round";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx+cw*0.3,cy+50);ctx.lineTo(cx+cw*0.7,cy+50);ctx.stroke();ctx.lineWidth=1.8;
  for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(cx+48,cy+84+i*22);for(let k=0;k<=10;k++)ctx.lineTo(cx+48+k*(cw-96)/10*(i===3?0.6:1),cy+84+i*22+Math.sin(k*1.7+i)*2.2);ctx.stroke();}ctx.restore();
  wc_wash(ctx,[[cx+cw-82,cy+ch-40],[cx+cw-70,cy+ch+6],[cx+cw-62,cy+ch-28],[cx+cw-54,cy+ch+6],[cx+cw-42,cy+ch-40]],[176,40,34],{kind:"ribbon"});
  wc_wash(ctx,wc_ell(cx+cw-62,cy+ch-52,22,22,22),[186,52,44],{kind:"thing",lw:1.2});
  // the calendar: the month's grid, a few days ringed in red
  const [kx,ky,kw,kh]=X.cal;gv_pin(ctx,kx+kw/2,ky-4,GV.red,1.1);wc_flat(ctx,wc_rect(kx,ky,kw,kh),GV.paper,1,"page");wc_flat(ctx,wc_rect(kx,ky,kw,54),[96,118,150],1,"band");
  ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.35);for(let r=0;r<5;r++)for(let c=0;c<7;c++)ctx.fillRect(kx+16+c*30,ky+76+r*32,16,8);ctx.restore();
  for(const [c,r] of [[2,1],[4,3]]){ctx.save();ctx.strokeStyle=rgba([204,62,50],0.8);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(kx+24+c*30,ky+80+r*32,19,15,0.1,0,TAU);ctx.stroke();ctx.restore();}
  // a cabinet of drawers at the right, under the calendar
  wc_part(ctx,wc_rect(1740,560,260,X.top-560+20),[150,160,176],1);for(const dy of [588,668])wc_flat(ctx,wc_rect(1800,dy,80,12),[110,118,134],1,"handle");}
function gv_paintRegistrarDesk(ctx){const X=GV_RX,top=X.top;gv_deskFront(ctx,top,GV.oak,[[110,360],[1520,360]]);
  // the tray of certificates, each in its folder
  wc_part(ctx,wc_rect(120,top-34,260,44),[150,156,168],1,{lw:1.3});for(let i=0;i<4;i++)wc_flat(ctx,wc_rect(132+i*6,top-58+i*6,236,12),[[248,240,220],[176,40,34],[248,240,220],[96,118,150]][i],1,"folder");
  // the office's stamp, on its pad of red ink
  wc_part(ctx,wc_rect(850,top-14,150,26),[70,72,80],1);wc_flat(ctx,wc_rect(862,top-16,126,10),[176,40,34],1,"ink");
  wc_part(ctx,wc_rect(1020,top-20,90,22),[60,52,48],1);wc_part(ctx,[[1046,top-20],[1084,top-20],[1078,top-64],[1052,top-64]],[150,104,70],1);wc_wash(ctx,wc_ell(1065,top-78,24,20,20),[150,104,70],{kind:"thing",lw:1.2});
  // the screen, its keyboard, a pot of pens, a mug
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+70,top,sw-140,sx+sw+30);
  wc_part(ctx,[[1744,top+8],[1784,top+8],[1780,top-50],[1748,top-50]],[96,118,150],1);for(const [px,a,c] of [[-14,-0.2,[60,60,70]],[-4,0.1,[204,62,50]],[6,0.25,[60,60,70]]]){ctx.save();ctx.translate(1764+px,top-48);ctx.rotate(a);wc_flat(ctx,wc_rect(-2,-40,5,42),c,1,"pen");ctx.restore();}
  gv_mug(ctx,1880,top+10,[226,214,190]);}

// The platform team's room, close: Sam's desk. The racks' edge at the left, the whiteboard behind him, two screens side by side
// (what each shows is drawn every frame), a mug, headphones. GV_PX: the desk's top, a seat for scale s, the two screens.
const GV_PX={top:792,seat:[1570,1.7],screens:[[250,344,500,320],[800,344,500,320]],board:[1330,66,546,390]};
function gv_paintPlatformClose(ctx){const X=GV_PX,wall=GV_ROOM.plat;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:63});gv_lightGlow(ctx,1100,-60,760);
  gv_rack(ctx,-50,60,230,X.top+20,9);gv_whiteboard(ctx,X.board[0],X.board[1],X.board[2],X.board[3]);
  // a printed sheet taped to the wall: the on-call rota (nobody needs to read it)
  gv_sheet(ctx,1080,110,150,196,{rot:0.03});gv_lines(ctx,1100,150,110,6,24,0.9);}
function gv_paintPlatformDesk(ctx){const X=GV_PX,top=X.top;gv_deskFront(ctx,top,[206,190,166],[[60,340],[1500,340]]);
  X.screens.forEach(([sx,sy,sw,sh])=>gv_deskScreen(ctx,sx,sy,sw,sh,top));gv_keys(ctx,600,top,440,1110);
  // headphones lying on the desk, and a mug
  ctx.save();ctx.strokeStyle=rgba([50,54,64],0.9);ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.ellipse(1270,top+14,64,40,0,Math.PI*1.05,Math.PI*1.95);ctx.stroke();ctx.restore();
  for(const hx of [1210,1330])wc_wash(ctx,wc_ell(hx,top+16,24,18,18),[60,64,74],{kind:"thing",lw:1.2});
  gv_mug(ctx,160,top+10,[64,150,146],true);}

// A faculty's office in the old building, close: an analyst's desk beside a tall window. Warm plaster over dark panelling, journals on
// the shelves, a lamp for the early hours; on the desk, a screen (what it shows is drawn every frame), printouts under a closed
// laptop, a mug. GV_FX: the desk's top, a seat for scale s, the screen, the window, the lamp.
const GV_FX={top:800,seat:[1330,1.7],screen:[560,300,540,330],win:[60,40,420,600],lamp:[1690,800]};
function gv_paintFaculty(ctx){const X=GV_FX,wall=GV_ROOM.fac;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:91});
  // the panelling, from the dado rail down
  wc_part(ctx,wc_rect(-40,560,W+80,H-520),[128,94,66],1,{seed:92});wc_part(ctx,wc_rect(-40,548,W+80,22),[150,112,80],1);
  for(let i=0;i<7;i++)wc_flat(ctx,wc_rect(-20+i*290+30,600,230,180),[116,84,58],1,"panel");
  // the tall window, arched, onto the lawn and the newer building
  const [wx,wy,ww,wh]=X.win;ctx.save();wc_tr(ctx,wc_arched(wx,wy,ww,wh));ctx.clip();const hz=wy+wh*0.66;wc_sky(ctx,hz,9,{clouds:2,cx:wx+10,cw:ww-60,cy:wy+60,ch:wh*0.2});
  wc_land(ctx,xx=>hz+4*Math.sin(xx/90),WCP.far,0.3,{line:false});wc_part(ctx,wc_rect(wx+ww*0.46,hz-wh*0.24,ww*0.5,wh*0.24+8),WCP.concrete,0.4);
  for(let r=0;r<2;r++)wc_part(ctx,wc_rect(wx+ww*0.5,hz-wh*0.2+r*wh*0.1,ww*0.42,wh*0.05),WCP.glass,0.4,{kind:"glass"});
  wc_land(ctx,xx=>hz+30+5*Math.sin(xx/110),WCP.lawn,0.5,{line:false});wc_roundTree(ctx,wx+ww*0.22,hz+40,wh*0.4,0.5);ctx.restore();
  const A=wc_arched(wx,wy,ww,wh);wc_ink(ctx,A,true,3,WC_INK,0.6,93,1.2);for(const r of [wc_rect(wx+ww/2-7,wy,14,wh),wc_rect(wx,wy+wh*0.5-7,ww,14),wc_rect(wx,wy+wh*0.26-6,ww,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.3});
  wc_wash(ctx,wc_rect(wx-30,wy+wh,ww+60,26),[226,212,190],{kind:"trim",lw:1.5});
  // shelves of journals at the right
  gv_bookcase(ctx,1500,X.top+40,480,X.top+80,[270,540],{col:GV.woodDark});const R=wc_rng(17);for(const sy of [270,540]){let bx=1530;while(bx<1960){const bw=24+R()*20,bh=120+R()*60;
    wc_part(ctx,wc_rect(bx,sy-bh,bw,bh),[[150,90,80],[96,118,150],[120,140,104],[196,170,120],[118,96,140]][Math.floor(R()*5)],1,{lw:1.1});bx+=bw+3;}}
  // a pinboard: the faculty's timetable and two notices
  gv_cork(ctx,640,110,420,150,12);gv_sheet(ctx,660,124,180,120,{rot:-0.02});gv_lines(ctx,676,148,148,4,22,0.9);gv_note(ctx,900,170,64,GV_NOTE[0],0.05,71);gv_note(ctx,990,180,64,GV_NOTE[2],-0.06,72);}
function gv_paintFacultyDesk(ctx){const X=GV_FX,top=X.top;gv_deskFront(ctx,top,[176,128,88],[[1460,380]]);
  // a stack of printouts, a closed laptop on them, a plant on the sill
  for(let i=0;i<5;i++)wc_flat(ctx,wc_rect(150+i*3,top-8-i*7,250,9),i%2?[244,242,236]:[250,250,246],1,"paper");wc_part(ctx,wc_rect(170,top-60,220,16),GV.metal,1,{lw:1.2});
  gv_plant(ctx,420,X.win[1]+X.win[3]+2,0.45);
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+60,top,sw-120,sx+sw+30);
  gv_mug(ctx,470,top+10,[204,86,70]);
  // the lamp: a weighted base, two arms, the shade turned down onto the desk, and its pool of light
  const [ax,ay]=X.lamp;ctx.save();ctx.beginPath();ctx.rect(ax-420,top,640,46);ctx.clip();ctx.globalCompositeOperation="screen";ctx.translate(ax-170,top+22);ctx.scale(1,0.22);wc_glowAt(ctx,0,0,260,[255,236,190],0.55);ctx.restore();
  wc_part(ctx,wc_ell(ax,ay+4,56,14,24),[60,64,72],1);ctx.save();ctx.strokeStyle=rgba([60,64,72],0.95);ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+30,ay-200);ctx.lineTo(ax-90,ay-300);ctx.stroke();ctx.restore();
  wc_part(ctx,[[ax-90,ay-320],[ax-60,ay-300],[ax-130,ay-220],[ax-200,ay-250]],[60,64,72],1,{lw:1.3});}

// Noor's room: the architecture map that fills its wall, her desk and screens, a shelf. GV_NR says where each is. gv_map paints the
// map at any size: one band for each of its layers, in the colours The map before the data gives them, and in each a few of the
// cards already on it. A film pins its own cards in a band's free part (gv_mapFree), here or on the map close up (GV_MC).
const GV_LAYERS=[["Motivation",[200,186,255]],["Strategy",[245,206,140]],["Business",[255,234,130]],["Information",[255,186,150]],["Application",[140,214,255]],["Technology",[160,224,140]]];
const GV_NR={fy:856,board:[100,104,1220,640],desk:[1430,668,440],mon:[[1460,476,180,124],[1666,476,180,124]],shelf:[1440,150,420]};
// band i of a map drawn at [x, y, w, h], and the part of it that's still free, right of the cards already there
function gv_mapBand(x,y,w,h,i){const g=h*0.016,bh=(h-g*7)/6;return[x+g,y+g+i*(bh+g),w-2*g,bh];}
function gv_mapFree(x,y,w,h,i){const [bx,by,bw,bh]=gv_mapBand(x,y,w,h,i);return[bx+bw*0.58,by,bw*0.42,bh];}
function gv_map(ctx,x,y,w,h,o){o=o||{};const k=w/1600;wc_part(ctx,wc_rect(x-12*k,y-12*k,w+24*k,h+24*k),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(x,y,w,h),[250,250,247],1,"board");
  const R=wc_rng(23);GV_LAYERS.forEach(([nm,col],i)=>{const [bx,by,bw,bh]=gv_mapBand(x,y,w,h,i);wc_wash(ctx,wc_rect(bx,by,bw,bh),wc_lit(col,0.66),{kind:"swatch",seed:40+i,a:0.8});
    if(o.labels!==false)wc_hand(ctx,nm,bx+18*k,by+bh*0.5+12*k,{size:34*k,w:700,col:wc_dim(col,0.66)});
    const n=2+(i%2),cw=bw*0.1,ch=bh*0.58;for(let j=0;j<n;j++){const cx=bx+bw*0.17+j*(cw+bw*0.035),cy=by+(bh-ch)/2+(R()-0.5)*bh*0.08;
      wc_panel(ctx,cx,cy,cw,ch,{kind:"card",wash:col,washA:0.4,seed:60+i*5+j});
      ctx.save();ctx.strokeStyle=rgba(wc_dim(col,0.62),0.55);ctx.lineWidth=Math.max(1.2,2.4*k);ctx.lineCap="round";for(let l=0;l<2;l++){ctx.beginPath();ctx.moveTo(cx+cw*0.16,cy+ch*(0.42+l*0.24));ctx.lineTo(cx+cw*(l?0.62:0.84),cy+ch*(0.42+l*0.24));ctx.stroke();}ctx.restore();
      gv_pin(ctx,cx+cw/2,cy+6*k,wc_dim(col,0.3),Math.max(0.45,0.9*k));}});}
function gv_paintNoor(ctx){const N=GV_NR,wall=GV_ROOM.noor;gv_wallFloor(ctx,wall,N.fy,{seed:101,vx:900});gv_lightGlow(ctx,700,0,620);
  gv_map(ctx,N.board[0],N.board[1],N.board[2],N.board[3],{labels:false});
  // her shelf: books and two box files
  const [hx,hy,hw]=N.shelf;wc_part(ctx,wc_rect(hx,hy,hw,14),GV.wood,1);const R=wc_rng(31);let bx=hx+12;while(bx<hx+hw-120){const bw=22+R()*18,bh=90+R()*44;wc_part(ctx,wc_rect(bx,hy-bh,bw,bh),[[118,96,140],[96,118,150],[150,90,80],[120,140,104]][Math.floor(R()*4)],1,{lw:1.1});bx+=bw+3;}
  wc_part(ctx,wc_rect(hx+hw-110,hy-110,46,110),[176,150,120],1);wc_part(ctx,wc_rect(hx+hw-60,hy-110,46,110),[176,150,120],1);
  gv_chair(ctx,1670,N.desk[1]-128,{col:[110,84,100]});gv_desk(ctx,N.desk[0],N.desk[1],N.desk[2],N.fy+6,{});N.mon.forEach(m=>gv_monitor(ctx,m[0],m[1],m[2],m[3]));gv_plant(ctx,1386,N.fy,0.8);}
// the map close: the board filling the frame, each band with its name
const GV_MC=[150,56,1620,830];
function gv_paintMapClose(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.noor,{kind:"plaster",line:false,seed:105});
  gv_lightGlow(ctx,960,-80,900);const [x,y,w,h]=GV_MC;gv_map(ctx,x,y,w,h);}

/* ---------- things: paper painted once and kept, the words drawn every frame ---------- */
// a ring binder's spine, standing: its colour, a label near the top, a finger hole; kept per size and colour
function gv_binder(ctx,x,y,w,h,col,o){o=o||{};const c=wc_kept("binder|"+[w,h,col].join(","),w+24,h+24,q=>{q.translate(12,12);wc_wash(q,wc_rect(0,0,w,h),col,{kind:"cover",lw:1.4,seed:w+h});
    wc_flat(q,wc_rect(w*0.18,h*0.1,w*0.64,h*0.26),WC_CARD,1,"label");wc_wash(q,wc_ell(w/2,h*0.8,w*0.17,w*0.17,16),wc_dim(col,0.45),{kind:"thing",line:false,flat:true});});
  ctx.drawImage(c,x-12,y-12);}
// a sheet of paper, white, with a soft shadow; kept per size; o.rot turns it about its centre
function gv_sheetPaper(w,h,o){o=o||{};return wc_kept("sheet|"+w+"x"+h+"|"+(o.col||"w"),w+40,h+40,q=>{q.translate(20,20);q.save();q.filter="blur(6px)";q.fillStyle="rgba(70,60,50,0.22)";q.fillRect(6,10,w,h);q.restore();
  wc_wash(q,wc_rect(0,0,w,h),o.col||GV.paper,{kind:"page",lw:1.4,seed:w*3+h});});}
function gv_sheet(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.translate(x+w/2,y+h/2);if(o.rot)ctx.rotate(o.rot);ctx.drawImage(gv_sheetPaper(w,h,o),-w/2-20,-h/2-20);ctx.restore();}
// a typed line on paper: a grey bar, for the lines no one needs to read
function gv_lines(ctx,x,y,w,n,gap,a){ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.32*(a==null?1:a));for(let i=0;i<n;i++)ctx.fillRect(x,y+i*gap,w*(i===n-1?0.6:0.92+0.08*Math.sin(i*7)),5);ctx.restore();}
// what a screen shows: a light panel with a title bar; fn draws the rest
function gv_screen(ctx,x,y,w,h,title,fn,o){o=o||{};ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.fillStyle=rgba(o.bar||[70,96,140],1);ctx.fillRect(x,y,w,o.barH||40);
  if(title)wc_T(ctx,title,x+18,y+(o.barH||40)*0.72,{w:700,size:o.titleSize||28,col:[255,255,255]});if(fn)fn(ctx);ctx.restore();}
// a speech bubble: a paper card with a pencil edge and a tail towards (tx,ty); k springs it in
function gv_say(ctx,x,y,lines,tx,ty,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||32,lh=Math.round(sz*1.3),w=Math.round(Math.max(...lines.map(l=>tw(ctx,l,sz,o.w||700)))+sz*1.5),
    h=Math.round(lines.length*lh+sz*0.9),k=o.k==null?1:o.k,bx=clamp(tx,x+40,x+w-40),by=ty<y?y:y+h;
  withA(ctx,a,()=>{ctx.save();ctx.translate(tx,ty);ctx.scale(k,k);ctx.translate(-tx,-ty);
    ctx.beginPath();ctx.moveTo(bx-20,by);ctx.lineTo(tx,ty);ctx.lineTo(bx+20,by);ctx.closePath();ctx.fillStyle=rgba(WC_CARD,1);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2;ctx.stroke();
    wc_panel(ctx,x,y,w,h,{kind:"card",wash:o.wash,washA:o.washA||0.22,seed:o.seed||(w+h)});ctx.fillStyle=rgba(WC_CARD,1);ctx.fillRect(bx-17,by-(ty<y?-1:3),34,4);
    lines.forEach((l,i)=>wc_T(ctx,l,x+sz*0.75,y+sz*0.5+lh*(i+0.74),{w:o.w||700,size:sz,col:WC_DARK}));ctx.restore();});return w;}
// a push pin, seen from the front
function gv_pin(ctx,x,y,col,s){s=s||1;ctx.save();ctx.fillStyle="rgba(60,50,40,0.25)";ctx.beginPath();ctx.ellipse(x+3*s,y+5*s,9*s,5*s,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,9*s,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(wc_dim(col,0.35),0.8);ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle="rgba(255,255,255,0.65)";ctx.beginPath();ctx.arc(x-3*s,y-3*s,3*s,0,TAU);ctx.fill();ctx.restore();}
// a card pinned to a board: paper, a pin at the top, lines of text; o.wash tints it
function gv_card(ctx,x,y,w,h,lines,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"card",wash:o.wash,washA:o.washA||0.3,seed:o.seed||(x|0)});const sz=o.size||28;
  lines.forEach((l,i)=>{const big=i===0&&o.head!==false;wc_T(ctx,l,x+(o.align==="center"?w/2:22),y+(o.y0||46)+i*(sz+12),{w:big?800:600,size:big?(o.headSize||sz+2):sz,col:big?WC_DARK:WC_INK,align:o.align});});
  if(o.pin!==false)gv_pin(ctx,x+w/2,y+12,o.pinCol||GV.red);}
// a rubber stamp's impression: the word in ink inside a double rule, landing a little large and settling (p 0 to 1), uneven where it
// pressed less
function gv_stampRule(w,h,col){return wc_kept("stamp|"+[w,h,col].join(","),w*2+20,h*2+20,q=>{q.scale(2,2);q.translate(5,5);
  wc_ink(q,wc_rrPts(0,0,w,h,8),true,3.6,col,0.9,41,0.6);wc_ink(q,wc_rrPts(7,7,w-14,h-14,5),true,1.8,col,0.85,43,0.6);q.globalCompositeOperation="destination-out";q.globalAlpha=0.45;q.drawImage(WC.blotch,-40,-30,w+120,h+90);});}
function gv_stamp(ctx,x,y,s,p,o){o=o||{};if(p<=0)return;const size=o.size||40,col=o.col||GV.redInk,w=Math.round(tw(ctx,s,size,800)+56),h=Math.round(size+36),k=lerp(1.35,1,1-Math.pow(1-clamp(p,0,1),3));
  ctx.save();ctx.translate(x,y);ctx.rotate(o.rot==null?-0.06:o.rot);ctx.scale(k,k);withA(ctx,clamp(p*1.4,0,1)*(o.a==null?1:o.a),()=>{ctx.drawImage(gv_stampRule(w,h,col),-w/2-5,-h/2-5,w+10,h+10);
    wc_T(ctx,s,0,size*0.36,{w:800,size,align:"center",col,a:0.88});});ctx.restore();}
// a question mark in gold, settling with a spring
function gv_qmark(ctx,x,y,s,p){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>{wc_glowAt(ctx,0,-s*0.3,s*0.9,[255,226,140],0.5);
  wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:GV.goldInk});});ctx.restore();}
// a glow round something that lights up: a soft halo in a colour
function gv_halo(ctx,x,y,w,h,col,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;const r=Math.max(w,h)*0.7,g=ctx.createRadialGradient(x+w/2,y+h/2,Math.min(w,h)*0.2,x+w/2,y+h/2,r);
  g.addColorStop(0,rgba(wc_lit(col,0.35),0.9));g.addColorStop(1,rgba(wc_lit(col,0.35),0));ctx.fillStyle=g;ctx.fillRect(x+w/2-r,y+h/2-r,r*2,r*2);ctx.restore();}
// a soft wash of colour over a shape, as something lights up (multiplied, so what's under it still shows)
function gv_tint(ctx,x,y,w,h,col,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;ctx.fillStyle=rgba(wc_lit(col,0.45),1);ctx.fillRect(x,y,w,h);ctx.restore();}
// a column's class of personal data, as a chip with its word, beside the column (as Who may see it draws it): GV_CLASS's plum, paler
// plum or plain paper; returns its width. gv_classChipAt brings one in at t0, landing a little large and settling
function gv_classChip(ctx,x,y,cls,o){o=o||{};const s=o.size||28,w=Math.round(tw(ctx,cls,s,700)+44),h=s+22;
  wc_panel(ctx,x,y-h/2,w,h,{kind:"chip",fill:GV_CLASS[cls],seed:cls.length+3});wc_T(ctx,cls,x+22,y+s*0.36,{w:700,size:s,col:cls==="direct"?[255,255,255]:WC_DARK});return w;}
function gv_classChipAt(ctx,t,t0,x,y,cls,o){const u=fin(t,t0,0.4);if(u<=0)return;const k=lerp(1.25,1,spring(fin(t,t0,0.55)));ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  withA(ctx,clamp(u*2,0,1),()=>gv_classChip(ctx,0,0,cls,o));ctx.restore();}
// a mask over a value: a plum band with *** in white, sliding in from the left as u goes 0 to 1. The band is laid on solid plum first,
// so nothing of the value shows through it
function gv_mask(ctx,x,y,w,h,u,o){if(u<=0)return;o=o||{};const e=easeCam(clamp(u,0,1)),s=o.size||28;ctx.save();ctx.beginPath();ctx.rect(x-10,y-10,(w+20)*e,h+20);ctx.clip();
  ctx.fillStyle=rgba(GV_CLASS.direct,1);wc_tr(ctx,wc_rrPts(x+2,y+2,w-4,h-4,10));ctx.fill();wc_panel(ctx,x,y,w,h,{kind:"card",fill:GV_CLASS.direct,seed:(w+h)|0});wc_T(ctx,"***",x+18,y+h/2+s*0.5,{w:800,size:s+4,f:"mono",col:[255,255,255]});ctx.restore();}

/* ---------- papers several films share ---------- */
// a sign-off sheet: a change comes back on paper with what's missing in plain words (Who decides, Who may see it, Rules that run and
// Teachers of data share it). Drawn at (x,y), w wide: at 1000, in a close-up, its words are 30 px or more. o.title is the change;
// o.rows its lines, [label, value], with null for a value that's missing; o.ask[i], the question written in red under row i; o.how,
// a line to the guide that says how to fix it; o.stamp, "sent back" (red) or "signed" (green), landing as o.stampP goes 0 to 1;
// o.signer, the name written on the signature line as o.signP goes 0 to 1 ("" leaves the line empty). o.p (0 to 1) brings the rows
// in one by one; o.missA (0 to 1) lights what's missing red; o.askP (0 to 1) writes the questions, wrapped to the value's column.
// gv_signoffH(ctx,rows,o) is its height at 1000 wide. Returns the sheet's height and each row's middle, so a film can point at one.
const GV_SIGN={ink:[34,44,92]};
// where the values start: after the longest label (at 30 px), at 36% of the sheet or more
function gv_signoffVX(ctx,rows,o){return Math.round(Math.min(560,Math.max(1000*((o||{}).split||0.36),48+Math.max(0,...rows.map(r=>tw(ctx,r[0],30,600)))+40)));}
// the question under a row, in lines that fit the value's column (written at 30 px in the sheet's units), as even as they can be;
// a question with line breaks keeps them
function gv_askLines(ctx,s,vx){if(s.includes("\n"))return s.split("\n");const room=952-vx-24,wrap=r=>{const out=[];let cur="";
    s.split(" ").forEach(wd=>{const t=cur?cur+" "+wd:wd;if(cur&&tw(ctx,t,30,700)>r){out.push(cur);cur=wd;}else cur=t;});if(cur)out.push(cur);return out;};
  const L=wrap(room);if(L.length<2)return L;for(let r=tw(ctx,s,30,700)/L.length;r<room;r+=12){const E=wrap(r);if(E.length===L.length)return E;}return L;}
function gv_signoffH(ctx,rows,o){o=o||{};const ask=o.ask||{},vx=gv_signoffVX(ctx,rows,o);return 214+rows.reduce((s,r,i)=>s+66+(ask[i]?8+42*gv_askLines(ctx,ask[i],vx).length:0),0)+
  (o.how?72:0)+(o.signer!=null?92:0)+(o.stamp&&!o.how&&o.signer==null?96:0)+40;}
function gv_signoff(ctx,x,y,w,o){o=o||{};const k=w/1000,rows=o.rows||[],ask=o.ask||{},n=rows.length,p=o.p==null?1:o.p,mA=o.missA==null?1:o.missA,
    vx=gv_signoffVX(ctx,rows,o),h=gv_signoffH(ctx,rows,o),R=[],line=(x0,x1,ly,col,a,lw)=>{ctx.strokeStyle=rgba(col,a);ctx.lineWidth=lw||2;ctx.beginPath();ctx.moveTo(x0,ly);ctx.lineTo(x1,ly);ctx.stroke();};
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);gv_sheet(ctx,0,0,1000,h,{rot:o.rot});ctx.lineCap="round";
  wc_T(ctx,o.kicker||"Sign-off",48,66,{w:800,size:28,col:WC_MUTED});wc_T(ctx,o.title||"",48,124,{w:800,size:42,col:WC_DARK});line(48,952,156,WC_MUTED,0.45,2);
  let ry=172;
  rows.forEach(([lab,val],i)=>{const a=clamp(p*n-i,0,1),miss=val==null;R.push(y+(ry+33)*k);
    if(a>0.01)withA(ctx,a,()=>{
      if(miss&&mA>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.red,0.72),mA);wc_tr(ctx,wc_rrPts(vx-14,ry+8,952-vx+14,52,8));ctx.fill();ctx.restore();}
      wc_T(ctx,lab,48,ry+44,{w:600,size:30,col:WC_MUTED});
      if(!miss){const s=clamp(32*(952-vx)/Math.max(1,tw(ctx,val,32,600)),28,32);wc_T(ctx,val,vx,ry+44,{w:600,size:s,col:WC_DARK});}
      line(vx,952,ry+58,miss?GV.redInk:WC_MUTED,miss?0.55+0.35*mA:0.3,miss?2.6:1.6);
      if(ask[i]){const L=gv_askLines(ctx,ask[i],vx),q=o.askP==null?1:o.askP;L.forEach((l,j)=>wc_hand(ctx,l,vx+4,ry+102+42*j,{size:30,w:700,col:GV.redInk,p:clamp(q*L.length-j,0,1)}));}});
    ry+=66+(ask[i]?8+42*gv_askLines(ctx,ask[i],vx).length:0);});
  line(48,952,ry+14,WC_MUTED,0.45,2);ry+=14;
  if(o.how){const hy=ry+50;ctx.save();ctx.strokeStyle=rgba(GV.cyanInk,0.9);ctx.lineWidth=2.4;ctx.lineJoin="round";
      ctx.beginPath();ctx.moveTo(48,hy-22);ctx.lineTo(66,hy-26);ctx.lineTo(84,hy-22);ctx.lineTo(84,hy+2);ctx.lineTo(66,hy-2);ctx.lineTo(48,hy+2);ctx.closePath();ctx.moveTo(66,hy-26);ctx.lineTo(66,hy-2);ctx.stroke();ctx.restore();
    wc_T(ctx,o.how,102,hy,{w:700,size:30,col:GV.cyanInk});line(102,102+tw(ctx,o.how,30,700),hy+8,GV.cyanInk,0.7,2);ry+=72;}
  if(o.signer!=null){const sy=ry+58;wc_T(ctx,"Signed",48,sy,{w:600,size:30,col:WC_MUTED});line(vx,vx+340,sy+10,WC_MUTED,0.5,1.6);
    if(o.signer)wc_hand(ctx,o.signer,vx+12,sy,{size:38,w:600,col:GV_SIGN.ink,p:o.signP==null?1:o.signP});ry+=92;}
  if(o.stamp){const ok=o.stamp==="signed";gv_stamp(ctx,952-150,h-66,o.stamp.toUpperCase(),o.stampP==null?1:o.stampP,{size:38,col:ok?GV.greenInk:GV.redInk,rot:ok?-0.05:-0.08});}
  ctx.restore();return{h:h*k,rows:R,x:x+vx*k};}
// a register: a page of the university's own ledger, ruled in columns, kept by whoever owns what it lists (Who decides' owners and
// stewards, Who may see it's classes, Rules that run's rules, Teachers of data's sign-offs). Drawn at (x,y), w wide: at 1000, in a
// close-up, its words are 28 px or more. o.kicker, the register's name, above o.title, the page's; o.cols, the headings, each
// [heading, share of the width]; o.rows, each an array of cells. A cell is words, null for a gap (lit red as o.missA goes 0 to 1),
// or {t, mono, red, hand, strike} (a code, a "TBC" in red, words written by hand as p goes 0 to 1, struck through as strike goes
// 0 to 1), or {chip:"direct", p} for a class chip (popping in as p goes 0 to 1). o.p (0 to 1) brings the rows in one by one; o.hi,
// a row's index or several, washed gold as o.hiA goes 0 to 1; o.foot, a line written by hand at the foot as o.footP goes 0 to 1
// ("classed by Mei Tanaka"). o.turn (0 to 1) turns the page over: it folds from its right edge towards the binding, its blank back
// over its front, so the page a film draws under it shows; o.h, the page's height at 1000 wide, so two pages of one book match (the
// taller one's gv_registerH). A chip is 28 px, so "pseudonymous" needs a column of 0.3 of the width or more. gv_registerH(o) is its
// height at 1000 wide. Returns the page's height, each row's middle and each column's left edge, so a film can point at a cell
const GV_REG={top:172,head:206,row:66,pad:16};
function gv_registerH(o){return GV_REG.head+22+GV_REG.row*(o.rows||[]).length+(o.foot?96:28)+20;}
function gv_register(ctx,x,y,w,o){o=o||{};const k=w/1000,rows=o.rows||[],cols=o.cols||[],n=rows.length,p=o.p==null?1:o.p,mA=o.missA==null?1:o.missA,h=Math.max(gv_registerH(o),o.h||0),
    turn=clamp(o.turn||0,0,1),hi=[].concat(o.hi==null?[]:o.hi),line=(x0,x1,ly,col,a,lw)=>{ctx.strokeStyle=rgba(col,a);ctx.lineWidth=lw||2;ctx.beginPath();ctx.moveTo(x0,ly);ctx.lineTo(x1,ly);ctx.stroke();};
  const cx=[48];cols.forEach(([,s],i)=>cx.push(cx[i]+904*s));const R=rows.map((_,i)=>y+(GV_REG.head+22+GV_REG.row*i+33)*k),C=cx.slice(0,-1).map(c=>x+c*k);
  if(turn>=1)return{h:h*k,rows:R,cols:C};
  const fold=1000*(1-easeCam(turn));ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  if(turn>0){ctx.beginPath();ctx.rect(-30,-30,fold+30,h+60);ctx.clip();}gv_sheet(ctx,0,0,1000,h,{rot:o.rot});ctx.lineCap="round";
  // the binding: the page's left edge sinks into the book
  const gut=ctx.createLinearGradient(0,0,70,0);gut.addColorStop(0,"rgba(70,60,50,0.24)");gut.addColorStop(1,"rgba(70,60,50,0)");ctx.fillStyle=gut;ctx.fillRect(0,0,70,h);
  if(o.kicker)wc_T(ctx,o.kicker,48,66,{w:700,size:28,col:WC_MUTED});wc_T(ctx,o.title||"",48,124,{w:800,size:42,col:WC_DARK});line(48,952,GV_REG.top-16,WC_MUTED,0.45,2);
  cols.forEach(([hd],i)=>wc_T(ctx,hd,i?cx[i]+GV_REG.pad:48,GV_REG.head-12,{w:700,size:28,col:WC_MUTED}));
  line(48,952,GV_REG.head+4,WC_MUTED,0.5,2);line(48,952,GV_REG.head+11,WC_MUTED,0.5,2);
  const bottom=GV_REG.head+22+GV_REG.row*n;ctx.strokeStyle=rgba(WC_MUTED,0.18);ctx.lineWidth=1.6;
  for(let i=1;i<cols.length;i++){ctx.beginPath();ctx.moveTo(cx[i],GV_REG.top);ctx.lineTo(cx[i],bottom);ctx.stroke();}
  rows.forEach((cells,r)=>{const a=clamp(p*n-r,0,1),ry=GV_REG.head+22+GV_REG.row*r,hA=hi.includes(r)?(o.hiA==null?1:o.hiA):0;if(a<=0.01)return;
    withA(ctx,a,()=>{
      if(hA>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.gold,0.6),hA);wc_tr(ctx,wc_rrPts(40,ry+4,920,GV_REG.row-8,8));ctx.fill();ctx.restore();}
      cells.forEach((c,i)=>{const x0=i?cx[i]+GV_REG.pad:48,room=cx[i+1]-x0-GV_REG.pad,ty=ry+44;
        if(c==null){if(mA>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.red,0.72),mA);wc_tr(ctx,wc_rrPts(x0-8,ry+8,room+16,GV_REG.row-14,8));ctx.fill();ctx.restore();}
          line(x0,x0+room,ry+GV_REG.row-6,GV.redInk,0.3+0.5*mA,2.6);return;}
        if(c.chip){const q=c.p==null?1:c.p;if(q>0.01){const s=lerp(1.25,1,spring(q));ctx.save();ctx.translate(x0,ry+33);ctx.scale(s,s);withA(ctx,clamp(q*2,0,1),()=>gv_classChip(ctx,0,0,c.chip,{size:28}));ctx.restore();}return;}
        const t=typeof c==="string"?c:c.t,f=c.mono?"mono":undefined,wt=c.mono?500:c.red?700:600,col=c.red?GV.redInk:c.hand?GV_SIGN.ink:WC_DARK,
          s=clamp(30*room/Math.max(1,tw(ctx,t,30,wt,f)),28,30);
        if(c.hand)wc_hand(ctx,t,x0+4,ty,{size:s+2,w:600,col,p:c.p==null?1:c.p});else wc_T(ctx,t,x0,ty,{w:wt,size:s,col,f});
        if(c.strike){const e=easeCam(clamp(c.strike,0,1));line(x0-4,x0-4+(Math.min(room,tw(ctx,t,s,wt,f))+8)*e,ty-s*0.32,GV.redInk,0.85,3);}});
      line(48,952,ry+GV_REG.row,WC_MUTED,0.22,1.6);});});
  if(o.foot)wc_hand(ctx,o.foot,56,bottom+64,{size:32,w:600,col:GV_SIGN.ink,p:o.footP==null?1:o.footP});
  if(turn>0){// the page's back, the same paper folded over at the fold: shaded where it lifts off the front, light where it bends; its
    // shadow on the front beside its edge, and on the page beneath beside the fold
    const x0=Math.max(0,2*fold-1000);if(x0>0){const e=ctx.createLinearGradient(x0-24,0,x0,0);e.addColorStop(0,"rgba(50,40,30,0)");e.addColorStop(1,"rgba(50,40,30,0.2)");ctx.fillStyle=e;ctx.fillRect(x0-24,0,24,h);}
    ctx.save();ctx.beginPath();ctx.rect(x0,-30,fold-x0,h+60);ctx.clip();ctx.translate(2*fold,0);ctx.scale(-1,1);ctx.drawImage(gv_sheetPaper(1000,h),-20,-20);ctx.restore();
    const bk=ctx.createLinearGradient(x0,0,fold,0);bk.addColorStop(0,"rgba(60,50,40,0.16)");bk.addColorStop(0.75,"rgba(60,50,40,0.04)");bk.addColorStop(1,"rgba(255,255,255,0.18)");
    ctx.fillStyle=bk;ctx.fillRect(x0,0,fold-x0,h);ctx.restore();ctx.save();ctx.translate(x,y);ctx.scale(k,k);
    const sh=ctx.createLinearGradient(fold,0,fold+46,0);sh.addColorStop(0,"rgba(50,40,30,0.3)");sh.addColorStop(1,"rgba(50,40,30,0)");ctx.fillStyle=sh;ctx.fillRect(fold,0,46,h);}
  ctx.restore();return{h:h*k,rows:R,cols:C};}
// a register's cover, closed, lying flat: cloth boards in o.col (a deep blue by default), a darker spine and corners, and a paper
// label with its name and whose it is ("Classification register", "registrar's office"); at 700 wide its words are 30 px or more.
// Kept per size and colour, the words drawn every frame
function gv_registerCover(ctx,x,y,w,h,title,sub,o){o=o||{};const col=o.col||[58,82,118],k=w/700,
    c=wc_kept("regcover|"+[w,h,col].join(","),w+40,h+40,q=>{q.translate(20,20);q.save();q.filter="blur(6px)";q.fillStyle="rgba(50,40,30,0.3)";q.fillRect(6,10,w,h);q.restore();
      wc_wash(q,wc_rect(0,0,w,h),col,{kind:"cover",lw:1.4,seed:w+h});const dk=wc_dim(col,0.35),cc=w*0.13;wc_flat(q,wc_rect(0,0,w*0.1,h),dk,1,"spine");
      wc_flat(q,[[w-cc,0],[w,0],[w,cc]],dk,1,"corner");wc_flat(q,[[w,h-cc],[w,h],[w-cc,h]],dk,1,"corner");
      wc_flat(q,wc_rect(w*0.2,h*0.2,w*0.68,Math.max(150*k,h*0.24)),WC_CARD,1,"label");});
  ctx.drawImage(c,x-20,y-20);const lx=x+w*0.2,ly=y+h*0.2,lw=w*0.68;
  wc_T(ctx,title,lx+lw/2,ly+64*k,{w:800,size:Math.max(30,40*k),col:WC_DARK,align:"center"});if(sub)wc_T(ctx,sub,lx+lw/2,ly+114*k,{w:600,size:Math.max(28,30*k),col:WC_MUTED,align:"center"});}

/* ---------- the data quality scorecard several films share ---------- */
// the data quality scorecard on a screen, in plain words, as Rules that run and Fixed where it starts draw it: "last night's checks",
// the areas down the side and the five dimensions across, and in each cell how many checks passed, of how many, on its wash: green,
// passed; amber, with warnings; red, with a failure; grey and hatched, not checked; bare paper, no check of that kind. The words always
// say it too. Under it, what didn't pass and whose it is, in sections ("Failed", "Warnings", "Not checked"), each only when it has
// lines. Each column is as wide as its words; when they don't all fit across the page, a cell breaks after its count. The camera shows
// it in turns (GV_SKV): the whole page (too small to read, on purpose; the washes carry it), then close on a row and the lines under it.
// A cell is "passed/total", then w (warnings), f (failed) or n (not checked), each with how many: "7/7w2", "6/7f1w2", "1/3n2"; ""
// is no check of that kind. Each film keeps its own nights (a row for each area, then a last row for all of them) and sections.
const GV_SKD=["Completeness","Uniqueness","Validity","Consistency","Accuracy","All"];
// where the table is on the screen (GV_SC): its left, its width, its headings' line, a row's height and a second line's, the words'
// size, the room each side of a cell's words, and a section's headings; each state's wash, how pale it is, and its ink
const GV_SK={x:380,w:1160,y:200,rh:31,lh:24,sz:19,pad:12,heads:[["Check",0],["Owner",0.62],["Rows",0.9]]};
const GV_SKST={pass:[GV.green,0.62,WC_INK],warn:[GV.amber,0.3,GV.amberInk],fail:[GV.red,0.36,GV.redInk],skip:[GV.grey,0.55,GV.greyInk]};
function gv_skCell(s){const m=s?/^(\d+)\/(\d+)(.*)$/.exec(s):null;if(!m)return null;const n={};(m[3].match(/[wfn]\d+/g)||[]).forEach(k=>n[k[0]]=+k.slice(1));
  const notes=[];if(n.f)notes.push(n.f+" failed");if(n.w)notes.push(n.w+(n.w>1?" warnings":" warning"));if(n.n)notes.push(n.n+" not checked");
  return{main:m[1]+" of "+m[2],notes,state:n.f?"fail":n.n?"skip":n.w?"warn":"pass"};}
// where everything goes, for the nights drawn (one, or two when one turns into the next): each column's left and width, each row's
// top, height and words' line, the table's foot. Kept for each set of nights, as it's measured once
const GV_SKL=new Map();
function gv_skLay(ctx,nights){const key=JSON.stringify(nights);if(GV_SKL.has(key))return GV_SKL.get(key);const K=GV_SK,cells=nights.map(rows=>rows.map(r=>r.slice(1).map(gv_skCell))),
    last=nights[0].length-1,wt=i=>i===last?800:600,one=c=>c?[[c.main,...c.notes].join(" · ")]:[],two=c=>c?[c.main,c.notes.join(" · ")]:[],
    widths=f=>[Math.max(tw(ctx,"Area",K.sz,700),...nights[0].map((r,i)=>tw(ctx,r[0],K.sz,wt(i)))),
      ...GV_SKD.map((d,j)=>Math.max(tw(ctx,d,K.sz,700),...cells.flatMap(rows=>rows.map((r,i)=>Math.max(0,...f(r[j]).map(s=>tw(ctx,s,K.sz,wt(i))))))))].map(v=>v+2*K.pad);
  let cw=widths(one),wrap=false;if(cw.reduce((a,b)=>a+b,0)>K.w){cw=widths(two);wrap=true;}
  const spare=Math.max(0,K.w-cw.reduce((a,b)=>a+b,0))/cw.length,cx=[K.x];cw=cw.map(v=>v+spare);cw.forEach((v,i)=>cx.push(cx[i]+v));
  let top=K.y+K.rh*0.28;const rows=nights[0].map((_,i)=>{const h=K.rh+(wrap&&cells.some(r=>r[i].some(c=>c&&c.notes.length))?K.lh:0),r={top,h,base:top+K.rh*0.72};top+=h;return r;});
  const L={cx,cw,rows,wrap,bottom:top};GV_SKL.set(key,L);return L;}
// grey hatching over a cell that wasn't checked
function gv_hatch(ctx,x,y,w,h,a){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.strokeStyle=rgba(GV.greyInk,0.34*a);ctx.lineWidth=2;ctx.beginPath();
  for(let k=-h;k<w;k+=10){ctx.moveTo(x+k,y+h);ctx.lineTo(x+k+h,y);}ctx.stroke();ctx.restore();}
// the scorecard: o.rows the night, o.date beside "last night's checks"; o.after, the next night, which it turns into as o.mx goes 0 to
// 1 (the washes change all the way; the old words go in the first half and the new come in the second); o.p (0 to 1) fills it in, the
// headings first, then a wash in each cell as its count arrives; o.hi, a row lit gold as o.hiA goes 0 to 1; o.sections under it (and
// o.afterSections, the next night's): each a title, a state ("fail", "warn" or "skip", for its swatches), its lines (each check in
// plain words, its owner, its rows) and its headings (heads: [heading, where it starts along the table], or false for none); and
// o.clear, said when there are none ("Every check passed."). o.scroll moves the page up by that much, under the screen's title bar,
// so a scene can go from the table down to the lines under it (0, by default). Returns where everything is on the page (gv_skLay's,
// L.sec: each section's title and lines, and its columns, and L.scroll: on the screen, everything is that much higher), so a scene
// can light a cell or an owner
function gv_scorecard(ctx,cam,o){o=o||{};const [x,y,w,h]=GV_SC,K=GV_SK,z=cam&&cam.z?cam.z:1,dz=s=>z*s<27?1:0,deco=dz(K.sz),rows=o.rows||[],after=o.after,
    e=after?easeCam(clamp(o.mx||0,0,1)):0,eo=1-clamp(e*2,0,1),en=clamp(e*2-1,0,1),p=o.p==null?1:clamp(o.p,0,1),secA=o.sections||[],
    secB=after?(o.afterSections||[]):secA,sc=o.scroll||0,barH=54;let L;
  gv_screen(ctx,x,y,w,h,"Data quality scorecard",q=>{if(sc){q.save();q.beginPath();q.rect(x,y+barH,w,h-barH);q.clip();q.translate(0,-sc);}
    L=gv_skLay(q,after?[rows,after]:[rows]);const nd=GV_SKD.length,N=rows.length*nd,hd=clamp(p*8,0,1);
    withA(q,hd,()=>wc_T(q,"last night's checks"+(o.date?" · "+o.date:""),K.x+K.pad,K.y-46,{w:600,size:K.sz+3,col:WC_MUTED,deco:dz(K.sz+3)}));
    if(o.hi!=null&&o.hiA>0.01){const r=L.rows[o.hi];gv_tint(q,K.x,r.top,K.w,r.h,GV.gold,0.55*o.hiA);}
    withA(q,hd,()=>["Area",...GV_SKD].forEach((s,j)=>wc_T(q,s,j?L.cx[j]+L.cw[j]/2:K.x+K.pad,K.y,{w:700,size:K.sz,align:j?"center":"left",col:WC_MUTED,deco})));
    // a cell's words, on one line or broken after its count
    const words=(c,j,r,wt,a,col)=>{if(!c||a<=0.01)return;(L.wrap&&c.notes.length?[c.main,c.notes.join(" · ")]:[[c.main,...c.notes].join(" · ")]).forEach((s,k)=>
      wc_T(q,s,L.cx[j]+L.cw[j]/2,r.base+k*K.lh,{w:wt,size:K.sz,align:"center",col,a,deco}));};
    rows.forEach((row,i)=>{const r=L.rows[i],wt=i===rows.length-1?800:600;withA(q,hd,()=>wc_T(q,row[0],K.x+K.pad,r.base,{w:wt,size:K.sz,col:WC_DARK,deco}));
      for(let j=1;j<=nd;j++){const A=gv_skCell(row[j]),B=after?gv_skCell(after[i][j]):A,u=clamp((p-0.12)/0.88*N-(i*nd+j-1),0,1);if(u<=0||(!A&&!B))continue;
        const SA=A&&GV_SKST[A.state],SB=B&&GV_SKST[B.state],col=SA&&SB?mix(SA[0],SB[0],e):(SA||SB)[0],pale=SA&&SB?lerp(SA[1],SB[1],e):(SA||SB)[1],
          wa=u*(SA&&SB?1:SA?1-e:e),bx=L.cx[j]+6,by=r.top+2,bw=L.cw[j]-12,bh=r.h-5;
        withA(q,wa,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(col,pale),1);q.fillRect(bx,by,bw,bh);q.restore();});
        const ha=u*((A&&A.state==="skip"?1-e:0)+(B&&B.state==="skip"?e:0));if(ha>0.01)gv_hatch(q,bx,by,bw,bh,ha);
        if(!after||row[j]===after[i][j])words(A,j,r,wt,u,SA[2]);else{words(A,j,r,wt,u*eo,SA&&SA[2]);words(B,j,r,wt,u*en,SB&&SB[2]);}}});
    // under the table: each section, its title and headings, and a line for each check with a swatch of its colour
    const sections=(S,a)=>{const out=[];let ty=L.bottom+32;S.forEach(s=>{const st=GV_SKST[s.state],heads=s.heads===false?null:s.heads||K.heads,
        hx=(heads||[[null,0]]).map(([,f],k)=>k?K.x+f*K.w:K.x+K.pad+32);let ry=ty;
      withA(q,a,()=>{wc_T(q,s.title,K.x+K.pad,ty,{w:800,size:K.sz+3,col:WC_DARK,deco:dz(K.sz+3)});if(heads){ry+=30;heads.forEach(([hs],k)=>wc_T(q,hs,hx[k],ry,{w:700,size:K.sz,col:WC_MUTED,deco}));}});
      const ys=s.rows.map((cells,k)=>{const yy=ry+K.rh*(k+1);withA(q,a,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(st[0],st[1]),1);
          q.fillRect(K.x+K.pad,yy-K.sz*0.8,20,20);q.restore();cells.forEach((c,m)=>wc_T(q,c,hx[m]==null?hx[0]:hx[m],yy,{w:600,size:K.sz,col:m?WC_INK:WC_DARK,deco}));});return yy;});
      out.push({title:ty,rows:ys,cols:hx});ty=(ys.length?ys[ys.length-1]:ry)+50;});return out;};
    const same=secA===secB;L.sec=sections(secA,same?1:eo);L.secB=same?null:sections(secB,en);L.scroll=sc;
    const clr=same?(secA.length?0:1):(secA.length?0:eo)+(secB.length?0:en);
    if(clr>0.01)wc_T(q,o.clear||"Every check passed.",K.x+K.pad,L.bottom+46,{w:700,size:K.sz+3,col:GV.greenInk,a:clr,deco:dz(K.sz+3)});
    if(sc)q.restore();},{titleSize:32,barH});
  return L;}
// where the camera looks for each turn: the whole page; then the learning row (the fifth), near the top of the frame, with the lines
// under it, above the captions
const GV_SKV={all:[960,415,1.02],row:[960,GV_SK.y+5*GV_SK.rh+156,1.55]};

/* ---------- people moving ---------- */
// someone walking from x0 to x1 from t0 at v px a second: where they are, the step's bob and swing, when they arrive, which way they face
function gv_walk(t,t0,x0,x1,v){const L=Math.abs(x1-x0),T_=Math.max(0.3,L/(v||300)),u=clamp((t-t0)/T_,0,1),e=u<0.5?2*u*u:1-2*(1-u)*(1-u),moving=u>0&&u<1,ph=(t-t0)*Math.PI*3.4;
  return{x:lerp(x0,x1,e),moving,bob:moving?Math.abs(Math.sin(ph))*7*Math.sin(u*Math.PI):0,swing:moving?Math.sin(ph)*Math.sin(u*Math.PI):0,end:t0+T_,flip:x1<x0};}
// a person walking: the arms swing and the body bobs while they move
function gv_walker(ctx,id,w,y,s,o){o=o||{};const sw=w.swing;person(ctx,id,w.x,y-w.bob,s,Object.assign({pose:o.pose||"stand",pose2:w.moving&&!o.pose?(sw>0?"walkA":"walkB"):o.pose2,mix:w.moving&&!o.pose?Math.abs(sw):o.mix,flip:w.moving?w.flip:o.flip},o));}

/* ---------- title and end cards ---------- */
// the series' mark: three strokes, the colours of where a line of the binder can end up: green, it runs in the work; gold, a decision
// someone owns; grey, it can go
const GV_MARK=[GV.green,GV.gold,GV.grey];
function gv_mark(ctx,cx,cy,w,p,a){if(a<=0.01)return;const n=GV_MARK.length,sw=w/n;withA(ctx,a,()=>{GV_MARK.forEach((col,i)=>{const q=clamp(p*n*0.8-i*0.6,0,1);if(q<=0)return;
  const x=cx-w/2+i*sw,c=wc_kept("gvmark"+i+"|"+Math.round(sw),Math.round(sw+24),40,x2=>{wc_prep();wc_wash(x2,wc_resample(wc_rect(6,6,sw+10,26),8),col,{kind:"swatch",line:false,a:0.85,seed:31+i*7});});
  ctx.save();ctx.beginPath();ctx.rect(x-4,cy-30,(sw+30)*ease(q),60);ctx.clip();ctx.drawImage(c,x-6,cy-20);ctx.restore();});});}
function gv_title(ctx,S,t,t0,title,sub,line){const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{wc_T(ctx,title,960,500,{w:800,size:92,align:"center",col:WC_DARK});gv_mark(ctx,960,566,420,(t-t0-0.6)/1.2,1);
    if(sub)wc_T(ctx,sub,960,660,{w:600,size:36,align:"center",col:WC_MUTED});withA(ctx,fin(t,t0+1.2,0.8),()=>wc_tag(ctx,960,748,line,{align:"center",size:28,w:600}));});}
function gv_end(ctx,S,t,t0,title,line,n){const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)wc_T(ctx,line,960,420,{w:700,size:48,align:"center",col:WC_DARK});gv_mark(ctx,960,520,360,(t-t0-0.7)/1.0,1);wc_T(ctx,title,960,622,{w:800,size:44,align:"center",col:WC_DARK});
    wc_T(ctx,(n?n+" · ":"")+"data governance · Learning Data",960,680,{w:600,size:28,align:"center",col:WC_MUTED});});}

/* ===== Governance you can use: the series' own pictures =====
   Painted once for the series' six films, which bundle this file (each film.json's src) beside data governance's shared rooms
   (rooms.js), which stay as they are. Files as paper sheets, copied from the example project; a pull request's checks as a strip of
   lights; a tool's page drawn as a form, in no product's colours; a report written in Markdown; the data team's board with the series'
   six cards; the team's poster with Yusuf's gold pins; the agent's star; name cards and tags. Every name starts with gu_ or GU_. */

/* ---------- words ---------- */
// code is IBM Plex Mono, at 28 px or more; its weight is always 500
const GU_MONO=28;
const gu_mw=(ctx,s,size)=>tw(ctx,s,size||GU_MONO,500,"mono");
// a line of code, coloured as the series reads it: in YAML, a key (to its colon) in dark ink and its value in ink; a comment (# or --)
// muted; a "…" in pencil. Returns its width
function gu_code(ctx,s,x,y,o){o=o||{};const size=o.size||GU_MONO,a=o.a==null?1:o.a,col=o.col;
  const T_=(t,x_,c)=>{wc_T(ctx,t,x_,y,{w:500,size,f:"mono",col:col||c,a,deco:o.deco});return gu_mw(ctx,t,size);};
  if(s==="…")return T_(s,x,WC_PENCIL);
  const cm=/(^|\s)(#|--)\s/.exec(s),code=cm?s.slice(0,cm.index+cm[1].length):s,rest=cm?s.slice(cm.index+cm[1].length):"";let w=0;
  const m=o.lang==="yaml"?/^(\s*(?:- )?)([\w.+\-"'$]+:)(?=\s|$)/.exec(code):null;
  if(m){w+=T_(m[1]+m[2],x,WC_DARK);w+=T_(code.slice(m[0].length),x+w,WC_INK);}else w+=T_(code,x,WC_INK);
  if(rest)w+=T_(rest,x+w,WC_MUTED);return w;}
// a line of Markdown as a page shows it: `code` in the typeface, **bold** heavier, the rest in the page's words. Returns its width
function gu_md(ctx,s,x,y,o){o=o||{};const size=o.size||28;let w=0;
  s.split(/(`[^`]*`|\*\*[^*]+\*\*)/).forEach(p=>{if(!p)return;const code=p[0]==="`",bold=p.startsWith("**"),t=code?p.slice(1,-1):bold?p.slice(2,-2):p,
    wt=code?500:bold?800:(o.w||600);wc_T(ctx,t,x+w,y,{w:wt,size,f:code?"mono":undefined,col:o.col||(bold?WC_DARK:WC_INK),a:o.a,deco:o.deco});w+=tw(ctx,t,size,wt,code?"mono":undefined);});
  return w;}
// a name card: a person's name and what they do
function gu_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:5});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// a tag that springs in at t0 and goes at t1 (or stays); o.wash colours it
function gu_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// a film this one builds on, by its title: a tag with a small frame of film drawn in pencil before it (a, 0 to 1); y is its middle
function gu_filmTag(ctx,x,y,title,a,o){if(a<=0.01)return;o=o||{};const size=30,w=Math.round(tw(ctx,title,size,700)+92),h=size+24,x0=o.align==="right"?x-w:o.align==="center"?x-w/2:x,
    k=0.9+0.1*spring(clamp(a,0,1));
  ctx.save();ctx.translate(x0+w/2,y);ctx.scale(k,k);ctx.translate(-x0-w/2,-y);withA(ctx,clamp(a*1.6,0,1),()=>{wc_panel(ctx,x0,y-h/2,w,h,{kind:"tag",seed:title.length+11});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2.4;ctx.lineJoin="round";const fx=x0+18,fy=y-13;ctx.strokeRect(fx,fy,34,26);
    for(let i=0;i<3;i++){ctx.fillStyle=rgba(WC_PENCIL,0.85);ctx.fillRect(fx+4+i*11,fy+3,5,4);ctx.fillRect(fx+4+i*11,fy+19,5,4);}ctx.restore();
    wc_T(ctx,title,x0+68,y+size*0.36,{w:700,size,col:WC_INK});});ctx.restore();return w;}
// the agent's sign: a small four-pointed star that turns a little, back and forth, as the series draws an agent: software, never a person
const GU_CYAN=[26,100,156];
function gu_star(ctx,x,y,s,t,a){if(a==null)a=1;if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*0.8)*0.15);ctx.scale(s,s);withA(ctx,a,()=>{
  ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,0,34,[170,214,246],0.55);ctx.restore();ctx.beginPath();
  for(let i=0;i<8;i++){const r=i%2?6:18,an=i*Math.PI/4-Math.PI/2;ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r);}ctx.closePath();ctx.fillStyle=rgba(GU_CYAN,1);ctx.fill();});ctx.restore();}

/* ---------- a file, as a sheet of paper ---------- */
// A file from the example project on a sheet: its path at the top, a narrow gutter of line numbers, its lines in the typeface at 28 px
// (fewer lines rather than smaller ones). o.lines: each a string, or {s, n (its line number), fold (a pencil "…" for the lines left
// out), add / del (a line added or removed, washed green or red, with + or − in the gutter), lit (0 to 1, a wash in o.lit's colour,
// gold by default, as a governance line is named), col (its ink), p (0 to 1, typed in, with a caret)}. o.lang "yaml" colours keys.
// Drawn at (x,y), w wide, turned by o.rot about its centre; its height is gu_fileH(o). Returns where each line's middle is, and where
// its text starts, so a scene can point at one.
const GU_F={top:118,lh:46,gut:96};
const gu_fileH=o=>GU_F.top+(o.lines.length-1)*(o.lh||GU_F.lh)+40;
function gu_file(ctx,x,y,w,o){o=o||{};const lh=o.lh||GU_F.lh,h=o.h||gu_fileH(o),a=o.a==null?1:o.a,tx=x+GU_F.gut+(o.gutW||0),rows=[];if(a<=0.01)return{rows,tx,h};
  withA(ctx,a,()=>{ctx.save();if(o.rot){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot);ctx.translate(-x-w/2,-y-h/2);}
    gv_sheet(ctx,x,y,w,h,{col:o.paper});
    wc_T(ctx,o.path,x+30,y+54,{w:500,size:28,f:"mono",col:WC_MUTED});
    ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+24,y+76);ctx.lineTo(x+w-24,y+76);ctx.stroke();
    o.lines.forEach((L,i)=>{if(typeof L==="string")L={s:L};const by=y+GU_F.top+i*lh,cy=by-10;rows.push(cy);
      if(L.fold){wc_T(ctx,"…",tx,by,{w:500,size:28,f:"mono",col:WC_PENCIL});return;}
      if(L.add||L.del)gv_tint(ctx,x+14,cy-lh/2+3,w-28,lh-6,L.add?GV.green:GV.red,0.5*(L.dA==null?1:L.dA));
      const ind=gu_mw(ctx,L.s.match(/^\s*/)[0]);
      if(L.lit>0.01)gv_tint(ctx,tx+ind-12,cy-lh/2+4,Math.min(w-(tx+ind-x)-10,gu_mw(ctx,L.s.trim())+24),lh-8,L.litCol||o.litCol||GV.gold,0.9*L.lit);
      const g=L.add?"+":L.del?"−":L.n==null?"":String(L.n);
      if(g)wc_T(ctx,g,tx-26,by,{w:500,size:28,f:"mono",col:L.add?GV.greenInk:L.del?GV.redInk:WC_MUTED,align:"right"});
      const p=L.p==null?1:clamp(L.p,0,1),s=p<1?L.s.slice(0,Math.ceil(L.s.length*p)):L.s,lw=gu_code(ctx,s,tx,by,{lang:o.lang,col:L.col,a:L.del?0.7:1});
      if(L.del){ctx.strokeStyle=rgba(GV.redInk,0.7);ctx.lineWidth=2.5;const sx=tx+gu_mw(ctx,s.match(/^\s*/)[0]);ctx.beginPath();ctx.moveTo(sx,cy);ctx.lineTo(tx+lw,cy);ctx.stroke();}
      if(p<1&&p>0){ctx.fillStyle=rgba(WC_DARK,0.8);ctx.fillRect(tx+lw+3,by-26,3,32);}});
    ctx.restore();});
  return{rows,tx,h};}

/* ---------- a pull request's checks ---------- */
// The checks a pull request runs, as a strip of lights on a card: each a pill with its light and its name, grey while it waits or runs
// (the light turning), red when it fails, amber when it warns, green when it passes. Over them, "Checks" and how it stands; under them,
// what a check said, a line at a time in its colour (o.msg: [{s, col, p}], p 0 to 1 writing it). o.items: [{name, st}], st one of wait,
// run, fail, warn, pass; o.pop[i] (0 to 1) as an item changes, a soft halo. Drawn at (x,y), w wide, o.h high. Returns each pill's
// place and where the messages start.
const GU_CK={wait:[GV.grey,GV.greyInk],run:[GV.grey,GV.greyInk],fail:[GV.red,GV.redInk],warn:[GV.amber,GV.amberInk],pass:[GV.green,GV.greenInk]};
function gu_ckSummary(items){const n=k=>items.filter(i=>i.st===k).length,f=n("fail"),w=n("warn"),p=n("pass"),r=n("run")+n("wait");
  if(r)return[r+" running",GV.greyInk];if(f)return[f+" failed · "+(p+w)+" passed",GV.redInk];if(w)return["all passed · "+w+" with a warning",GV.amberInk];return["all checks passed",GV.greenInk];}
function gu_light(ctx,x,y,st,t,a){const [col,ink]=GU_CK[st]||GU_CK.wait;ctx.save();ctx.globalAlpha*=a==null?1:a;
  if(st==="run"){ctx.strokeStyle=rgba(ink,0.9);ctx.lineWidth=4;ctx.lineCap="round";const r0=t*5;ctx.beginPath();ctx.arc(x,y,11,r0,r0+TAU*0.7);ctx.stroke();}
  else if(st==="wait"){ctx.strokeStyle=rgba(ink,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,10,0,TAU);ctx.stroke();}
  else{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,12,0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.95)";ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    if(st==="pass"){ctx.moveTo(x-5.5,y+0.5);ctx.lineTo(x-1.5,y+4.5);ctx.lineTo(x+6,y-4.5);}else if(st==="fail"){ctx.moveTo(x-4.5,y-4.5);ctx.lineTo(x+4.5,y+4.5);ctx.moveTo(x+4.5,y-4.5);ctx.lineTo(x-4.5,y+4.5);}
    else{ctx.moveTo(x,y-6);ctx.lineTo(x,y+1.5);ctx.moveTo(x,y+5.5);ctx.lineTo(x,y+6);}ctx.stroke();}ctx.restore();}
function gu_checks(ctx,x,y,w,o){o=o||{};const h=o.h||250,items=o.items||[],t=o.t||0,pills=[];
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:o.seed||61});wc_T(ctx,o.title||"Checks",x+32,y+52,{w:800,size:32,col:WC_DARK});
  const [sum,sink]=gu_ckSummary(items);if(items.length&&o.summary!==false)wc_T(ctx,sum,x+w-32,y+52,{w:700,size:28,col:sink,align:"right"});
  let px=x+32;const py=y+112;
  items.forEach((it,i)=>{const nw=gu_mw(ctx,it.name),pw=Math.round(nw+76),[col]=GU_CK[it.st]||GU_CK.wait,pop=(o.pop||[])[i]||0;
    if(pop>0.01)gv_halo(ctx,px-10,py-36,pw+20,72,col,0.8*pop);
    wc_panel(ctx,px,py-27,pw,54,{kind:"pill",wash:it.st==="wait"||it.st==="run"?null:col,washA:0.22,seed:30+i});
    gu_light(ctx,px+30,py,it.st,t);wc_T(ctx,it.name,px+54,py+10,{w:500,size:28,f:"mono",col:WC_DARK});pills.push({x:px,y:py,w:pw});px+=pw+16;});
  const my=py+(o.msgGap||78);(o.msg||[]).forEach((m,i)=>{const p=m.p==null?1:clamp(m.p,0,1);if(p<=0)return;const s=m.s.slice(0,Math.ceil(m.s.length*p));
    (m.md?gu_md:gu_code)(ctx,s,x+32+(m.dx||0),my+i*(o.msgLh||42),{col:m.col||WC_INK,size:28});});
  return{pills,my};}

/* ---------- a tool's page ---------- */
// A tool's page on a screen, drawn as a form: the screen's bar with the tool's name and what the page is ("GitHub · pull request"),
// a title, a pill for its state, a line under the title, and tabs, the open one underlined. o.state: [word, colour] or null. Returns
// where the page's body starts.
function gu_page(ctx,x,y,w,h,o){o=o||{};const bh=o.barH||52;let top=y+bh;
  gv_screen(ctx,x,y,w,h,o.bar,null,{barH:bh,titleSize:30});
  if(o.title){const ty=y+bh+72;wc_T(ctx,o.title,x+48,ty,{w:800,size:o.titleSize||44,col:WC_DARK});
    if(o.state){const [s,col]=o.state,sx=x+48+tw(ctx,o.title,o.titleSize||44,800)+28,sw=Math.round(tw(ctx,s,28,700)+44);
      withA(ctx,o.stateA==null?1:o.stateA,()=>{wc_panel(ctx,sx,ty-38,sw,48,{kind:"pill",wash:col,washA:0.45,seed:s.length+40});wc_T(ctx,s,sx+22,ty-4,{w:700,size:28,col:WC_DARK});});}
    if(o.sub)wc_T(ctx,o.sub,x+48,ty+44,{w:600,size:28,col:WC_MUTED});top=ty+(o.sub?64:24);}
  if(o.tabs){const ty=top+50;let tx=x+48;o.tabs.forEach((s,i)=>{const tw_=tw(ctx,s,28,700);wc_T(ctx,s,tx,ty,{w:700,size:28,col:i===o.tab?WC_DARK:WC_MUTED});
      if(i===o.tab){ctx.fillStyle=rgba(WC_DARK,0.85);ctx.fillRect(tx,ty+14,tw_,4);}tx+=tw_+56;});
    ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(x+30,ty+18,w-60,2);top=ty+24;}
  return top;}
// a section of a page: a card with a heading, and what fn draws in it
function gu_box(ctx,x,y,w,h,head,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"card",wash:o.wash,washA:o.washA,seed:o.seed||(x+y)|0});
  if(head)wc_T(ctx,head,x+30,y+48,{w:800,size:30,col:WC_DARK});}

/* ---------- the series' screens and places ---------- */
// a big screen on a desk, the wall behind it in a room's colour: for pages too full for the series' screen close-up (GV_SC)
const GU_BIG=[110,56,1700,812];
function gu_paintScreenBig(c,wall){c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,970),wall,{kind:"plaster",line:false,seed:73});
  wc_wash(c,wc_rect(-40,930,W+80,190),GV.oak,{kind:"plaster",line:false,seed:74});wc_wash(c,wc_rect(-40,924,W+80,14),wc_dim(GV.oak,0.25),{kind:"trim",line:false,flat:true});
  const [x,y,w,h]=GU_BIG;wc_part(c,[[x+w/2-50,y+h+12],[x+w/2+50,y+h+12],[x+w/2+62,936],[x+w/2-62,936]],GV.metal,1);gv_monitor(c,x,y,w,h,{stand:false});}
// the data team's desk from above, for the files laid on it: pale ash, its grain, a notebook and a mug at its edges
function gu_paintFilesDesk(c){const wood=[214,196,168];c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,H+80),wood,{kind:"plaster",line:false,seed:57});
  c.save();c.globalCompositeOperation="multiply";const R=wc_rng(7);for(let i=0;i<60;i++){const y=R()*H;c.strokeStyle=rgba(wc_dim(wood,0.18+R()*0.1),0.16+R()*0.12);c.lineWidth=1+R()*2;c.beginPath();c.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)c.lineTo(x,y+5*Math.sin(x/280+i)+3*Math.sin(x/70+i*2));c.stroke();}c.restore();
  wc_wash(c,wc_ell(1830,120,80,80,40),[232,236,240],{kind:"thing",lw:1.6});wc_wash(c,wc_ell(1830,120,60,60,40),[96,70,60],{kind:"thing",line:false});
  wc_part(c,wc_rect(-60,820,300,330),[96,84,120],1,{seed:3});wc_flat(c,wc_rect(170,820,18,330),[236,226,200],1,"band");}

/* ---------- the data team's board: the series and its six films ---------- */
// The series' name on a card, and its six films, a card each, as Off the shelf first pinned them on the data team's board (close, GV_BC):
// each with its number, the tools' logos and its title. o.lit[i] (0 to 1) washes a card gold, as its film begins; o.lift[i] lifts it
// towards us.
const GU_SERIES="Governance you can use";
const GU_FILMS=[["Governed in dbt",["dbt"]],["Governed in Unity Catalog",["databricks"]],["Meaning on the platform",["databricks"]],
  ["Quality on the platform",["dbt","databricks"]],["Products in open formats",["databricks"]],["The marketplace",["databricks"]]];
const GU_TC={w:410,h:236,x:[505,960,1415],y:[440,712],rot:[-0.018,0.012,-0.008,0.016,-0.012,0.008]};
function gu_wrap(ctx,s,size,mw){if(tw(ctx,s,size,800)<=mw)return[s];const ws=s.split(" ");for(let i=ws.length-1;i>0;i--){const a=ws.slice(0,i).join(" ");
  if(tw(ctx,a,size,800)<=mw)return[a,ws.slice(i).join(" ")];}return[s];}
function gu_seriesHead(ctx,a){if(a<=0.01)return;const s=GU_SERIES,hw=Math.max(250,tw(ctx,s,52,700)/2+60);ctx.save();ctx.translate(960,192);ctx.rotate(0.01);
  withA(ctx,a,()=>{wc_panel(ctx,-hw,-60,hw*2,120,{kind:"card",seed:63});gv_pin(ctx,0,-46,GV.red,1.2);wc_hand(ctx,s,0,20,{size:52,w:700,align:"center",col:WC_INK});});ctx.restore();}
function gu_filmCard(ctx,k,o){o=o||{};const T_=GU_TC,[s,tools]=GU_FILMS[k],w=T_.w,h=T_.h,lift=easeCam(clamp(o.lift||0,0,1)),lit=clamp(o.lit||0,0,1),sc=1+0.08*lift;
  ctx.save();ctx.translate(T_.x[k%3],T_.y[Math.floor(k/3)]-16*lift);ctx.rotate(T_.rot[k]*(1-lift));ctx.scale(sc,sc);
  if(lift>0.01){ctx.save();ctx.filter="blur(10px)";ctx.fillStyle=rgba([70,60,50],0.22*lift);ctx.fillRect(-w/2+10,-h/2+18,w,h);ctx.restore();}
  if(lit>0.01)gv_halo(ctx,-w/2-30,-h/2-30,w+60,h+60,GV.gold,0.9*lit);
  wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:110+k});if(lit>0.01)gv_tint(ctx,-w/2+8,-h/2+8,w-16,h-16,GV.gold,0.55*lit);gv_pin(ctx,0,-h/2+18,GV.red,1.1);
  wc_wash(ctx,wc_ell(-w/2+56,-h/2+72,28,28,24),wc_lit(GV.cyanInk,0.25),{kind:"thing",lw:1.2,seed:120+k});
  wc_T(ctx,String(k+1),-w/2+56,-h/2+83,{w:800,size:28,align:"center",col:[255,255,255]});
  let lx=-w/2+104;tools.forEach(id=>{lx+=logo(ctx,id,lx,-h/2+48,48)+18;});
  gu_wrap(ctx,s,36,w-64).forEach((l,i,a)=>wc_T(ctx,l,-w/2+32,-h/2+(a.length>1?160:178)+i*46,{w:800,size:36,col:WC_DARK}));ctx.restore();}
function gu_board(ctx,o){o=o||{};gu_seriesHead(ctx,1);for(let k=0;k<6;k++)gu_filmCard(ctx,k,{lit:(o.lit||[])[k],lift:(o.lift||[])[k]});}
// the same board seen across the data team's room, on its cork board (GV_DT.board): kept as a picture, too small to read, on purpose
function gu_boardSmall(ctx,lit){const [bx,by,bw,bh]=GV_DT.board,k=bw/GV_BC[2],c=wc_kept("guBoard|"+(lit||0),GV_BC[2],GV_BC[3],q=>{q.translate(-GV_BC[0],-GV_BC[1]);
    gu_board(q,{lit:[lit||0]});});
  ctx.drawImage(c,bx,by+(bh-GV_BC[3]*k)/2,bw,GV_BC[3]*k);}

/* ---------- the team's poster, and Yusuf's gold pins ---------- */
// where a decision enters the team's loop: the step, and what Yusuf writes there (Off the shelf first pinned them; "a class" is Who may
// see it's word)
const GU_PINS=[[0,["a term"]],[1,["a class"]],[3,["an owner","a contract"]],[4,["a rule"]],[7,["an approval"]],[9,["a version"]]];
// the loop going round on the poster (x,y,w,h), from the first step (u 0) back to the first (u 1): a firmer line along it, and each
// step darkening, with a little lift, as the line reaches it
function gu_loopRun(ctx,x,y,w,h,u){if(u<=0)return;const k=w/1260,cx=x+w/2,cy=y+h*450/810,a0=-Math.PI/2,gap=0.13;
  ctx.save();ctx.strokeStyle=rgba(wc_dim(GV_LOOPC,0.15),0.8);ctx.lineWidth=6*k;ctx.lineCap="round";
  for(let i=0;i<10;i++){const s=a0+i/10*TAU+gap,e=Math.min(a0+(i+1)/10*TAU-gap,a0+u*TAU);if(e<=s)break;ctx.beginPath();ctx.ellipse(cx,cy,330*k,270*k,0,s,e);ctx.stroke();}
  ctx.restore();
  for(let i=0;i<10;i++){const v=clamp((u-i/10)*12,0,1);if(v<=0)break;const [sx,sy]=gv_loopPos(i,x,y,w,h),r=30*k*(1+0.14*Math.sin(Math.PI*clamp(v*1.4,0,1)));
    ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV_LOOPC,0.25),0.6*v);ctx.beginPath();ctx.arc(sx,sy,r,0,TAU);ctx.fill();ctx.restore();}}
// at step i of the poster: a gold pin pushed in at its edge (u), a gold ring drawn round it (ring), and Yusuf's words there, a line at a
// time (lab, 0 to 1 for each): under the step's name or, for the first step, inside the loop
function gu_goldPin(ctx,i,x,y,w,h,u,ring,lines,lab){const k=w/1260,[sx,sy]=gv_loopPos(i,x,y,w,h),c=Math.cos(-Math.PI/2+i/10*TAU);
  if(ring>0){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=Math.max(2,5*k);ctx.lineCap="round";ctx.beginPath();
    ctx.arc(sx,sy,38*k,-Math.PI/2,-Math.PI/2+TAU*easeCam(clamp(ring,0,1)));ctx.stroke();ctx.restore();}
  if(u>0){const d=easeCam(clamp(u,0,1));withA(ctx,clamp(u*3,0,1),()=>gv_pin(ctx,sx+26*k,sy-30*k-(1-d)*40*k,GV.gold,lerp(2.4,1.6,d)*k));}
  if(!lab)return;const top=i===0,al=top?"center":c>0?"left":"right",nx=top?sx:sx+(c>0?1:-1)*(i===1||i===9?100:46)*k,ny=top?sy+80*k:sy+56*k;
  lines.forEach((s,j)=>{const p=lab[j]==null?1:lab[j];if(p>0)wc_hand(ctx,s,nx,ny+j*38*k,{size:32*k,w:700,align:al,col:GV.goldInk,p});});}
// every pin on the poster at once: o.pin[j], o.ring[j] and o.lab[j] (0 to 1) for the j-th of GU_PINS
function gu_pins(ctx,x,y,w,h,o){o=o||{};GU_PINS.forEach(([i,lines],j)=>{const v=k=>((o[k]||[])[j]);
  gu_goldPin(ctx,i,x,y,w,h,v("pin")==null?1:v("pin"),v("ring")==null?1:v("ring"),lines,lines.map(()=>v("lab")==null?1:v("lab")));});}
// where step i's pin sits on the poster, for a line drawn from it
function gu_pinAt(i,x,y,w,h){const k=w/1260,[sx,sy]=gv_loopPos(i,x,y,w,h);return[sx+26*k,sy-30*k];}

/* ===== Governed in dbt: the places and the pictures =====
   The places are painted once and kept (data governance's shared/src/finish.js): the data team's room, its poster and its board close
   up, a big screen on a desk, the data team's desk from above for the files on it, Yusuf's desk and his board, Noor's map close up, and
   the Faculty of Health's office. The pictures are the film's own things, drawn with the series' pieces (shared/src/tools.js): Jun's
   pull request and its checks, the files the film opens (each the example project's own lines, or a worked example's), the rule and
   the council's minutes, census day, the site plan of who may build on what, two versions side by side, Tuesday's change and its
   impact report, the reviewers file, the check's pages and its warnings, the agent's review, and the map. Every name starts with gd_
   or GD_. */

// made once per chapter, the first time it draws: its cues are known by then
const gd_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// shots in a row in the same place share one camera, so a dissolve between them never lays the place over itself at another size or
// framing: if each holds still, one slow push over the whole run; if one moves, all follow the same keys. hold: no push on the last
// run, when the next chapter opens in the same place
function gd_run(shots,end,hold){const out=shots.map(s=>Object.assign({},s));
  for(let i=0;i<out.length;){let j=i;while(j+1<out.length&&out[j+1].place===out[i].place)j++;const R=out.slice(i,j+1),last=j===out.length-1;
    if(j>i||(hold&&last)){const t1=last?end:out[j+1].at,keys=[].concat(...R.map(s=>s.keys)).sort((a,b)=>a[0]-b[0]),k0=keys[0],
        still=keys.every(k=>k[1]===k0[1]&&k[2]===k0[2]&&k[3]===k0[3]),push=hold&&last?0:R[0].push==null?0.025:R[0].push;
      const cam=still?{keys:[k0,[k0[0]+0.01,k0[1],k0[2],k0[3]*(1+push)]],d:Math.max(1.4,t1-k0[0]),push:0}:{keys,d:Math.max(...R.map(s=>s.d||1.6)),push:0};
      R.forEach(s=>Object.assign(s,cam));}
    i=j+1;}
  return out;}
// 0 to 1 as something comes, and back as it goes, each over d seconds
const gd_in=(t,t0,d)=>clamp((t-t0)/(d||0.6),0,1);
// a red question mark, settling with a spring
function gd_redQ(ctx,x,y,s,p){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:GV.redInk}));ctx.restore();}
// a pencil line under words, drawn on as p goes 0 to 1
function gd_under(ctx,x,y,w,p,col){if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(col||WC_PENCIL,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);
  const n=16,e=easeCam(clamp(p,0,1));for(let i=1;i<=n;i++){const u=i/n*e;ctx.lineTo(x+w*u,y+2*Math.sin(u*9));}ctx.stroke();ctx.restore();}
// a pencil arrow along a curve from a to b, bowed by bend (px, up when negative; o.bx bows it sideways), drawn on as p goes 0 to 1
function gd_arrow(ctx,a,b,bend,p,o){o=o||{};if(p<=0)return;const c=[(a[0]+b[0])/2+(o.bx||0),(a[1]+b[1])/2+bend],n=28,m=Math.max(2,Math.round(n*clamp(p,0,1))),pt=u=>{const v=1-u;
    return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];};
  ctx.save();ctx.strokeStyle=rgba(o.col||WC_PENCIL,o.a==null?0.9:o.a);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();
  for(let i=0;i<=m;i++){const [x,y]=pt(i/n);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);
  if(p>=1&&o.head!==false){const [x1,y1]=pt(1),[x0,y0]=pt(0.93),an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-16*Math.cos(an-0.5),y1-16*Math.sin(an-0.5));
    ctx.lineTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an+0.5),y1-16*Math.sin(an+0.5));ctx.stroke();}ctx.restore();}
// a gold pin and Yusuf's word, flown from the poster to a line that keeps it (u, 0 to 1), then resting beside it
function gd_flyPin(ctx,from,to,u,word){if(u<=0)return;const e=easeCam(clamp(u,0,1)),x=lerp(from[0],to[0],e),y=lerp(from[1],to[1],e)-Math.sin(e*Math.PI)*60;
  withA(ctx,clamp(u*3,0,1),()=>gv_pin(ctx,x,y,GV.gold,1.6));if(u>0.8)withA(ctx,clamp((u-0.8)*5,0,1),()=>wc_hand(ctx,word,x+26,y+12,{size:32,w:700,col:GV.goldInk}));}

/* ---------- the data team's room ---------- */
// Jun, standing at his desk, his screens to his right; the board across the room shows the series' six cards
const GD_JUN=[1330,905,0.8];
function gd_room(ctx,t,o){o=o||{};gu_boardSmall(ctx,o.lit?1:0);const [x,y,s]=GD_JUN;person(ctx,"jun",x,y,s,Object.assign({pose:"listen",t},o.jun||{}));}
// his line from Off the shelf, beside him: the old words, and, as mix goes 0 to 1, the new
function gd_bubble(ctx,a,k,lines,mix,lines2){if(a<=0.01)return;const tx=1290,ty=520,m=clamp(mix||0,0,1);
  if(!lines2||m<0.5)gv_say(ctx,700,300,lines,tx,ty,{a,k,size:40});
  else gv_say(ctx,700,300,lines2,tx,ty,{a,k:k*(0.94+0.06*spring(m*2-1)),size:40,wash:GV.gold,washA:0.25});}

/* ---------- Jun's pull request ---------- */
// his pull request on a big screen, drawn as a form: what it adds, who reviews it, and its checks. o.state, the pill; o.items, the
// checks (gu_checks); o.msg, what a check said; o.how (0 to 1), the message's link lifting, gold; o.rev and o.appr, its reviewers (gd_reviewers);
// o.tab 1, the files changed instead. Words are 28 px or more at the screen's own size.
const GD_PR={title:"Completions for Planning",sub:"Jun Park wants to merge into main",desc:"The awards conferred this year, by faculty.",
  files:["models/marts/planning/mart_planning__completions.sql","models/marts/planning/_planning__models.yml","governance/4-data-products/completions.yml"],
  more:"and 8 more, written by the project's scripts",ck:["build","governance","products","reviewers","impact"],
  m1:"owner: models/marts/planning/_planning__models.yml: mart_planning__completions has no",m2a:"meta.owner or meta.domain ",m2b:"(how to: docs/how-to/add-an-owner.md)",
  g1:"Governance's rules are met: every owner, glossary term, column class, test and",g2:"description is in place."};
const GD_LB=[150,336,1000,256],GD_RB=[1190,336,580,256],GD_CK=[150,612,1620,240];
function gd_prHead(ctx,o){const [x,y,w,h]=GU_BIG;return gu_page(ctx,x,y,w,h,{bar:"GitHub · pull request",title:o.title||GD_PR.title,titleSize:o.titleSize,
  state:o.state||["Open",GV.green],sub:o.sub||GD_PR.sub,tabs:o.tabs||["Conversation","Files changed · 11","Checks · 5"],tab:o.tab||0});}
// who reviews it: the code owners of the files it changes, asked by themselves as it opens (o.rev, 0 to 1): Planning, gold, for its
// table, and the owners of the product and of governance's files; o.appr (0 to 1), Planning's yes
const GD_REV=[["Planning",1],["Clara Jensen"],["data governance"],["Noor"]];
function gd_reviewers(ctx,o){const [x,y,w,h]=GD_RB,r=clamp(o.rev||0,0,1),ap=clamp(o.appr||0,0,1);gu_box(ctx,x,y,w,h,"Reviewers",{seed:72});
  if(r<0.25)withA(ctx,1-r*4,()=>wc_T(ctx,"none yet",x+30,y+112,{w:600,size:28,col:WC_MUTED}));
  if(r<=0.25)return;let px=x+30,py=y+100;
  GD_REV.forEach(([s,gold],i)=>{const v=clamp((r-0.25)*2.2-i*0.2,0,1),pw=Math.round(tw(ctx,s,28,700)+44);if(px+pw>x+w-24){px=x+30;py+=62;}
    if(v>0.01){const k=0.92+0.08*spring(v);ctx.save();ctx.translate(px+pw/2,py);ctx.scale(k,k);ctx.translate(-px-pw/2,-py);withA(ctx,clamp(v*2,0,1),()=>{
      if(gold)gv_halo(ctx,px-20,py-46,pw+40,92,GV.gold,0.7*(o.glow==null?1:o.glow));
      wc_panel(ctx,px,py-26,pw,52,{kind:"pill",wash:gold?GV.gold:null,washA:0.5,seed:44+i});wc_T(ctx,s,px+22,py+10,{w:700,size:28,col:WC_DARK});});ctx.restore();}
    px+=pw+16;});
  const ly=y+h-34;withA(ctx,clamp(r*2.4-1.2,0,1)*(1-ap),()=>wc_T(ctx,"review requested",x+30,ly,{w:600,size:28,col:WC_MUTED}));
  if(ap>0.01)withA(ctx,ap,()=>{wc_tick(ctx,x+46,ly-10,30,GV.greenInk,ap);wc_T(ctx,"Planning approved",x+76,ly,{w:700,size:28,col:GV.greenInk});});}
function gd_pr(ctx,t,o){o=o||{};gd_prHead(ctx,o);
  if(o.tab===1){gd_prFiles(ctx,o);return;}
  const [lx,ly,lw,lh]=GD_LB;gu_box(ctx,lx,ly,lw,lh,null,{seed:71});
  if(o.hiD)gv_tint(ctx,lx+18,ly+52-32,tw(ctx,GD_PR.desc,30,600)+24,44,GV.gold,0.8*o.hiD);if(o.hiF)gv_tint(ctx,lx+18,ly+104-30,gu_mw(ctx,GD_PR.files[0])+24,42,GV.gold,0.8*o.hiF);
  wc_T(ctx,GD_PR.desc,lx+30,ly+52,{w:600,size:30,col:WC_DARK});
  GD_PR.files.forEach((f,i)=>wc_T(ctx,f,lx+30,ly+104+i*42,{w:500,size:28,f:"mono"}));wc_T(ctx,GD_PR.more,lx+30,ly+104+3*42,{w:600,size:28,col:WC_MUTED});
  gd_reviewers(ctx,o);
  const hw=clamp(o.how||0,0,1),msg=o.msg&&hw>0.01?o.msg.map((m,i)=>i===1?Object.assign({},m,{s:GD_PR.m2a}):m):o.msg;
  const [cx,cy,cw,ch]=GD_CK,its=o.items||GD_PR.ck.map(n=>({name:n,st:"wait"})),
    r=gu_checks(ctx,cx,cy,cw,{h:ch,items:its,t,msg,pop:o.pop,msgGap:74,summary:its.some(i=>i.st!=="wait")});if(hw>0.01){const mx=cx+32+gu_mw(ctx,GD_PR.m2a),my=r.my+42,ww=gu_mw(ctx,GD_PR.m2b);
    gv_tint(ctx,mx-8,my-34,ww+16,46,GV.gold,0.9*hw);ctx.save();ctx.translate(0,-5*easeCam(hw));gu_code(ctx,GD_PR.m2b,mx,my,{col:GV.goldInk});
    gd_under(ctx,mx,my+10,ww,hw,GV.goldInk);ctx.restore();}}
// the checks and what they said, at time t: each check's state from the times in T (run, then pass or fail; governance can pass later)
function gd_items(t,T){return GD_PR.ck.map((n,i)=>{const s=T[n]||{};let st="wait";if(s.run!=null&&t>=s.run)st="run";if(s.fail!=null&&t>=s.fail)st="fail";
  if(s.pass!=null&&t>=s.pass)st="pass";return{name:n,st};});}
// the files changed: the new model's first lines, and the governance lines in its YAML, lit as they're named (o.lit, 0 to 1)
function gd_prFiles(ctx,o){const L=o.lit||0;
  gu_file(ctx,150,330,1620,{path:"models/marts/planning/mart_planning__completions.sql",lines:[{s:"credentials as (",add:1},{s:"    select * from {{ ref('core_credential', v=2) }}",add:1}]});
  gu_file(ctx,150,552,1620,{path:"models/marts/planning/_planning__models.yml",lang:"yaml",lines:[{s:"        owner: Planning",add:1,lit:L},{s:"        domain: planning",add:1,lit:L},
    {fold:1},{s:"        config: {meta: {personal_data: none}}",add:1,lit:L}]});}
// the two lines Jun adds, in the model's YAML (typed as typ goes 0 to 1), on a sheet over the pull request's top
const GD_OWN=[{n:131,s:"  - name: mart_planning__completions"},{fold:1},{n:135,s:"    config:"},{n:136,s:"      meta:"},{n:137,s:"        grain: One row per faculty per award type"},
  {n:138,s:"        owner: Planning"},{n:139,s:"        domain: planning"},{n:140,s:"    data_tests:"}];
function gd_ownSheet(ctx,u,typ,lit){if(u<=0.01)return;const e=easeCam(clamp(u,0,1)),y=lerp(-560,84,e),
    lines=GD_OWN.map((L,i)=>i===5||i===6?Object.assign({},L,{p:clamp(typ*2-(i-5),0,1),lit}):L);
  gu_file(ctx,150,y,1000,{path:"models/marts/planning/_planning__models.yml",lang:"yaml",lines,rot:-0.008});}

/* ---------- the rule, and the council's minutes, on Yusuf's desk ---------- */
// the rule, on a card: "owner" underlined as it's said (u), and, as q goes 0 to 1, a red question mark beside it
const GD_RULE=["Every table other teams use","has an owner: someone who","answers for what it means."];
function gd_rule(ctx,o){o=o||{};const x=190,y=250,w=740,h=330;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(-0.02);ctx.translate(-x-w/2,-y-h/2);
  wc_panel(ctx,x,y,w,h,{kind:"card",wash:GV.gold,washA:0.18,seed:81});wc_T(ctx,"Data governance · a rule",x+40,y+62,{w:600,size:28,col:WC_MUTED});
  GD_RULE.forEach((s,i)=>wc_T(ctx,s,x+40,y+142+i*58,{w:700,size:40,col:WC_DARK}));
  const ox=x+40+tw(ctx,"has an ",40,700),ow=tw(ctx,"owner",40,700);gd_under(ctx,ox,y+142+58+12,ow,o.u||0,GV.goldInk);gd_redQ(ctx,x+w-80,y+104,96,o.q||0);ctx.restore();}
// the council's minutes, a sheet a month, June to September: the same action on each, in pencil. o.at[i] (0 to 1) brings sheet i in;
// o.pile (0 to 1) slides them together into one stack
const GD_MIN=[["June 2026","Action:","name the data owners"],["July 2026","name the data owners","carried forward"],["August 2026","name the data owners","carried forward"],
  ["September 2026","name the data owners","carried forward"]],GD_MINP=[[975,110,-0.04],[1430,150,0.03],[995,450,0.02],[1445,490,-0.03]];
function gd_minutes(ctx,o){o=o||{};const pile=easeCam(clamp(o.pile||0,0,1));GD_MIN.forEach(([m,a1,a2],i)=>{const u=(o.at||[])[i]==null?1:o.at[i];if(u<=0.01)return;
  const [px,py,pr]=GD_MINP[i],x=lerp(px,720+i*8,pile),y=lerp(py,300+i*6,pile)+(1-easeCam(clamp(u,0,1)))*-60,r=lerp(pr,-0.03+i*0.012,pile),
    wa=i===GD_MIN.length-1?1:1-clamp(pile*2.5,0,1);
  ctx.save();ctx.translate(x+215,y+150);ctx.rotate(r);ctx.translate(-215,-150);withA(ctx,clamp(u*2,0,1),()=>{ctx.drawImage(gv_sheetPaper(430,300),-20,-20);
    if(wa>0.01)withA(ctx,wa,()=>{wc_T(ctx,"Council · minutes",28,48,{w:600,size:28,col:WC_MUTED});wc_T(ctx,m,28,98,{w:800,size:34,col:WC_DARK});gv_lines(ctx,28,128,370,2,22,0.9);
      wc_hand(ctx,a1,28,206,{size:30,w:700,col:WC_PENCIL});if(a2)wc_hand(ctx,a2,28,248,{size:30,w:700,col:WC_PENCIL});});});ctx.restore();});}
// the check that does it now: a card with its green light, its name and how long it takes
function gd_badge(ctx,x,y,a){if(a<=0.01)return;const k=lerp(1.25,1,spring(clamp(a,0,1)));ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(a*2,0,1),()=>{
  wc_panel(ctx,-200,-48,400,96,{kind:"card",wash:GV.green,washA:0.25,seed:85});gu_light(ctx,-150,0,"pass",0);wc_T(ctx,"governance",-120,10,{w:500,size:30,f:"mono",col:WC_DARK});
  wc_T(ctx,"1 min",170,10,{w:700,size:30,col:GV.greenInk,align:"right"});});ctx.restore();}

/* ---------- census day, on Yusuf's board ---------- */
// what a table with no owner cost, as A product with an owner told it: the census card, Anil's question, and his path from Jun to Noor
// to Planning and back to Jun, an arrow at a time (o.path[i], 0 to 1); o.dim (0 to 1) fades the arrows when something had to change
const GD_PATH=[["Jun Park","analytics engineer"],["Noor Rahman","data architect"],["Planning","asked for it"],["Jun Park","analytics engineer"]],GD_PX=[300,700,1100,1500];
function gd_census(ctx,o){o=o||{};const a=o.a==null?1:o.a,dm=1-0.75*clamp(o.dim||0,0,1);
  withA(ctx,clamp(o.card||0,0,1),()=>{ctx.save();ctx.translate(560,200);ctx.rotate(-0.012);wc_panel(ctx,-290,-90,580,180,{kind:"card",seed:91});gv_pin(ctx,0,-74,GV.red,1.2);
    wc_hand(ctx,"Census day",0,-6,{size:48,w:700,align:"center",col:WC_DARK});ctx.restore();wc_year(ctx,360,250,"31 March 2026 · 7:00",1);});
  withA(ctx,clamp(o.anil||0,0,1),()=>{gu_nameCard(ctx,1150,120,"Anil Kurian","Faculty of Health",1);gv_pin(ctx,1290,132,GV.red,1.1);
    wc_hand(ctx,"next semester's places?",1150,300,{size:34,w:700,col:GV.redInk,p:clamp(o.places||0,0,1)});});
  GD_PATH.forEach(([n,r],i)=>{const u=(o.path||[])[i];if(!(u>0))return;withA(ctx,clamp(u*2,0,1),()=>{gu_nameCard(ctx,GD_PX[i]-150,620,n,r,1);
    gv_pin(ctx,GD_PX[i],632,GV.red,1.1);});});
  for(let i=0;i<3;i++){const p=(o.path||[])[i+1];if(!(p>0))continue;withA(ctx,dm,()=>gd_arrow(ctx,[GD_PX[i]+40,600],[GD_PX[i+1]-60,600],-90,p,{col:GV.redInk}));}}

/* ---------- a pin at each step: the lines that keep them ---------- */
// The learner table's YAML, as the example project writes it: its owner and its domain, then the term it holds, lit as they're named
// (lit: [owner and domain, term], 0 to 1). The sheet comes up from the desk's edge as u goes 0 to 1; returns where its rows are
const GD_LRN=[{n:3,s:"  - name: core_learner"},{fold:1},{n:8,s:"    config:"},{n:9,s:"      meta:"},{n:10,s:"        grain: One row per learner per version"},
  {n:11,s:"        owner: Mei Tanaka, registrar's office"},{n:12,s:"        domain: student"},{n:13,s:"        glossary_term: learner"},{fold:1}];
const GD_LRNX=[110,120,1000];
function gd_learner(ctx,u,lit){if(u<=0.01)return null;const L=lit||[],[x,y,w]=GD_LRNX,e=easeCam(clamp(u,0,1)),b=0.4*(L[2]||0),
    lines=GD_LRN.map((r,i)=>i>=2&&i<=7?Object.assign({},r,{lit:Math.max(b,i===5||i===6?L[0]||0:i===7?L[1]||0:0)}):r);
  return gu_file(ctx,x,lerp(H+60,y,e),w,{path:"models/core/student/_core_student__models.yml",lang:"yaml",lines});}
// three of its columns, each saying whether it identifies a person (lit[k], 0 to 1), with its class's chip beside it from at[k]
const GD_COLS=[{n:44,s:"      - name: learner_key"},{n:49,s:"          meta: {glossary_term: learner, personal_data: pseudonymous}",cls:"pseudonymous"},{fold:1},
  {n:79,s:"      - name: email"},{n:83,s:"          meta: {personal_data: direct}",cls:"direct"},{n:84,s:"      - name: status"},{fold:1},
  {n:91,s:"        config: {meta: {personal_data: none}}",cls:"none"}];
const GD_COLX=[80,150,1720];
function gd_columns(ctx,t,u,lit,at){if(u<=0.01)return null;const [x,y,w]=GD_COLX,e=easeCam(clamp(u,0,1)),yy=lerp(H+60,y,e);let k=0;
  const ks=GD_COLS.map(r=>r.cls?k++:-1),lines=GD_COLS.map((r,i)=>ks[i]>=0?Object.assign({},r,{lit:(lit||[])[ks[i]]||0}):r),R=gu_file(ctx,x,yy,w,{path:"models/core/student/_core_student__models.yml",lang:"yaml",lines});
  GD_COLS.forEach((r,i)=>{if(ks[i]<0||at==null)return;gv_classChipAt(ctx,t,at[ks[i]],R.tx+gu_mw(ctx,r.s)+30,R.rows[i],r.cls);});return R;}
// who owns each test, in dbt_project.yml, and the quality dimension a kind of test names where it's defined (lit, lit2: 0 to 1)
const GD_TST=[{n:105,s:"data_tests:"},{n:106,s:"  credentials:"},{fold:1},{n:119,s:"    core:"},{n:120,s:"      +meta: {owner: \"Mei Tanaka, registrar's office\"}"}],
  GD_BIN=[{n:10,s:"{% test not_null(model, column_name) %}"},{n:11,s:"    {{ config(meta={'dimension': 'completeness'}) }}"}];
function gd_tests(ctx,u,lit,u2,lit2){let R=null;if(u>0.01)R=gu_file(ctx,90,lerp(H+60,80,easeCam(clamp(u,0,1))),1180,{path:"dbt_project.yml",lang:"yaml",
    lines:GD_TST.map((r,i)=>i===4?Object.assign({},r,{lit}):r)});
  if(u2>0.01)gu_file(ctx,800,lerp(H+60,520,easeCam(clamp(u2,0,1))),1040,{path:"tests/generic/builtin.sql",lines:GD_BIN.map((r,i)=>i===1?Object.assign({},r,{lit:lit2}):r),rot:0.008});
  return R;}

/* ---------- who may build on what ---------- */
// the two files that say it: the groups, each with its owner (o.g, 0 to 1, lights them), and each layer's access in dbt_project.yml
// (o.priv, o.pub, o.prot light its lines)
const GD_GRP=[{n:1,s:"groups:"},{n:2,s:"  - name: credential_model"},{fold:1},{n:6,s:"    owner:"},{n:7,s:"      name: Noor, data architect"},{fold:1},
  {n:10,s:"  - name: planning"},{fold:1},{n:12,s:"    owner:"},{n:13,s:"      name: Planning"}];
const GD_ACC=[{n:32,s:"    staging:"},{fold:1},{n:36,s:"      +access: private"},{n:38,s:"    intermediate:"},{fold:1},{n:42,s:"      +access: private"},
  {n:46,s:"    core:"},{fold:1},{n:50,s:"      +access: public"},{n:54,s:"    marts:"},{fold:1},{n:57,s:"      +access: protected"}];
function gd_accessFiles(ctx,o){const g=o.g||0,L=i=>i===2||i===5?o.priv:i===8?o.pub:i===11?o.prot:0;
  gu_file(ctx,100,110,720,{path:"models/_groups.yml",lang:"yaml",lines:GD_GRP.map((r,i)=>[1,4,6,9].includes(i)?Object.assign({},r,{lit:g}):r),rot:-0.008});
  gu_file(ctx,1000,90,800,{path:"dbt_project.yml",lang:"yaml",lines:GD_ACC.map((r,i)=>Object.assign({},r,{lit:L(i)||0})),rot:0.006});}
// The project's folders as a small site plan on the board: the first layers inside a low fence, private to the data team's group; the
// core tables in the open, public; the marts each in a yard of its own, protected. Each part comes as it's named (o.priv, o.pub, o.prot);
// o.try, a sketch in Planning's yard reaching for a private step, stopped at the fence (o.stop, the cross); o.err, dbt's error unrolling;
// o.jun, Jun's new table, and o.refs, its two refs reaching the core, its lines below lighting green (o.sql); o.key, a key coming to read
// the core, and stopping, with o.next its tag
const GD_YD={priv:[250,130,460,430],pub:[760,130,350,430],prot:[1140,130,560,430]};
function gd_fence(ctx,x,y,w,h,p,o){if(p<=0)return;o=o||{};const col=o.col||WC_PENCIL,pts=[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]],L=2*(w+h),d=L*easeCam(clamp(p,0,1));
  ctx.save();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x,y);let s=0;
  for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i],l=Math.hypot(bx-ax,by-ay);if(s+l<=d){ctx.lineTo(bx,by);s+=l;}else{const f=(d-s)/l;ctx.lineTo(lerp(ax,bx,f),lerp(ay,by,f));break;}}ctx.stroke();
  // the posts: short strokes every 46 px along the part drawn
  ctx.lineWidth=(o.lw||4)*1.3;s=0;for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i],l=Math.hypot(bx-ax,by-ay),n=Math.floor(l/46);
    for(let j=0;j<n;j++){const at=s+j*46;if(at>d)break;const f=j*46/l,px=lerp(ax,bx,f),py=lerp(ay,by,f);ctx.beginPath();ctx.moveTo(px,py-9);ctx.lineTo(px,py+9);ctx.stroke();}s+=l;}
  ctx.restore();}
// a table (or a sketch of one) on the plan: its name in the typeface on a small card, centred at (cx,cy); returns its width
function gd_block(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a,hand=!!o.hand,w=Math.round((hand?tw(ctx,s,30,700):gu_mw(ctx,s))+48),h=58;if(a<=0.01)return w;
  const k=0.9+0.1*spring(clamp(a,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);withA(ctx,clamp(a*1.6,0,1),()=>{
    wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",dashed:!!o.dashed,wash:o.wash,washA:o.washA||0.3,seed:s.length+7});
    if(hand)wc_hand(ctx,s,0,10,{size:30,w:700,align:"center",col:o.col||WC_PENCIL});else wc_T(ctx,s,-w/2+24,10,{w:500,size:28,f:"mono",col:o.col||WC_DARK});});ctx.restore();return w;}
// a key, drawn in gold ink, pointing left, its tip at (x,y)
function gd_key(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(GV.goldInk,0.95);ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+110,y);ctx.moveTo(x+14,y);ctx.lineTo(x+14,y+20);ctx.moveTo(x+36,y);ctx.lineTo(x+36,y+14);ctx.stroke();
  ctx.beginPath();ctx.arc(x+134,y,24,0,TAU);ctx.stroke();ctx.restore();});}
function gd_site(ctx,t,o){o=o||{};const P=GD_YD.priv,U=GD_YD.pub,R=GD_YD.prot;
  // the private yard: a low fence, its tag, the first layers' folders and one of their steps
  const pv=o.priv||0;if(pv>0.01){wc_wash(ctx,wc_rect(P[0],P[1],P[2],P[3]),wc_lit([150,170,200],0.55),{kind:"swatch",a:0.55*clamp(pv*2,0,1),seed:131,line:false});
    gd_fence(ctx,P[0],P[1],P[2],P[3],pv);withA(ctx,fin(pv,0.3,0.5),()=>{wc_tag(ctx,P[0]+P[2]/2,P[1]+50,"private · credential_model",{size:28,align:"center"});
      wc_hand(ctx,"staging",P[0]+40,P[1]+140,{size:32,w:700,col:WC_INK});wc_hand(ctx,"intermediate",P[0]+40,P[1]+200,{size:32,w:700,col:WC_INK});
      gd_block(ctx,P[0]+P[2]/2,P[1]+310,"int_credentials_unioned");wc_tag(ctx,P[0]+P[2]/2,P[1]+P[3]+32,"+access: private",{size:28,align:"center",f:"mono"});});}
  // the core, in the open
  const pb=o.pub||0;if(pb>0.01){withA(ctx,clamp(pb*1.5,0,1),()=>{wc_wash(ctx,wc_rect(U[0],U[1],U[2],U[3]),wc_lit(GV.green,0.7),{kind:"swatch",a:0.35,seed:133,line:false});
      wc_tag(ctx,U[0]+U[2]/2,U[1]+50,"public",{size:28,align:"center"});["core_learner","core_credential","core_award"].forEach((s,i)=>gd_block(ctx,U[0]+U[2]/2,U[1]+130+i*90,s,{a:fin(pb,0.2+0.15*i,0.5)}));
      wc_tag(ctx,U[0]+U[2]/2,U[1]+U[3]+32,"+access: public",{size:28,align:"center",f:"mono"});});}
  // the marts: a yard each
  const pr=o.prot||0;if(pr>0.01){withA(ctx,clamp(pr*1.5,0,1),()=>{wc_tag(ctx,R[0]+R[2]/2,R[1]+50,"protected",{size:28,align:"center"});
      [["planning",86,150],["wallet",244,90],["finance",330,90]].forEach(([s,dy,h],i)=>{const v=fin(pr,0.15*i,0.6);if(v<=0)return;const yy=R[1]+dy;
        wc_wash(ctx,wc_rect(R[0]+12,yy,R[2]-24,h-14),wc_lit([214,186,150],0.6),{kind:"swatch",a:0.4*v,seed:140+i,line:false});gd_fence(ctx,R[0]+12,yy,R[2]-24,h-14,v,{lw:3});
        withA(ctx,v,()=>wc_hand(ctx,s,R[0]+36,yy+42,{size:30,w:700,col:WC_INK}));});
      wc_tag(ctx,R[0]+R[2]/2,R[1]+R[3]+32,"+access: protected",{size:28,align:"center",f:"mono"});});}
  // a sketch in Planning's yard, its ref reaching for the private step, and stopped at the fence
  const tr=o.try||0,jn=o.jun||0;if(tr>0.01){withA(ctx,1-jn,()=>{gd_block(ctx,R[0]+R[2]-150,R[1]+176,"a sketch",{hand:1,dashed:1,a:tr});
      gd_arrow(ctx,[R[0]+R[2]-262,R[1]+175],[P[0]+P[2]+14,P[1]+175],0,clamp((tr-0.3)/0.7,0,1),{col:WC_PENCIL,dash:[10,10],head:false});
      wc_cross(ctx,P[0]+P[2]+14,P[1]+175,46,GV.redInk,o.stop||0);});}
  // dbt's error, unrolling under the plan
  const er=o.err||0;if(er>0.01){const x=P[0],y=620,w=R[0]+R[2]-P[0],L=GD_PE;withA(ctx,clamp(er*3,0,1)*(1-jn),()=>{wc_panel(ctx,x,y,w,236,{kind:"card",wash:GV.red,washA:0.18,seed:151});
      L.forEach((s,i)=>{const p=clamp(er*L.length-i,0,1);if(p>0)wc_T(ctx,s.slice(0,Math.ceil(s.length*p)),x+30,y+48+i*42,{w:500,size:28,f:"mono",col:GV.redInk});});});}
  // Jun's new table, reading only public tables: its two refs, and the lines that say them
  if(jn>0.01){gd_block(ctx,R[0]+R[2]/2,R[1]+176,"mart_planning__completions",{a:jn,wash:GV.green,washA:0.2});const rf=o.refs||0;
    gd_arrow(ctx,[R[0]+30,R[1]+164],[U[0]+U[2]-28,U[1]+226],-30,clamp(rf*1.6,0,1),{col:GV.greenInk});
    gd_arrow(ctx,[R[0]+30,R[1]+188],[U[0]+U[2]-62,U[1]+302],40,clamp(rf*1.6-0.5,0,1),{col:GV.greenInk});
    const sq=o.sql||0;gu_file(ctx,P[0],620,R[0]+R[2]-P[0],{path:"models/marts/planning/mart_planning__completions.sql",lh:42,a:clamp(jn*2,0,1)*(1-clamp(o.key||0,0,1)),
      lines:[{n:7,s:"    select * from {{ ref('core_credential', v=2) }}",lit:clamp(sq*2,0,1),litCol:GV.green},{fold:1},{n:13,s:"    select * from {{ ref('core_award') }}",lit:clamp(sq*2-1,0,1),litCol:GV.green}]});}
  // who may read it: a key comes for Jun's table, and stops at the fence
  const ky=o.key||0;if(ky>0.01){const e=easeCam(clamp(ky,0,1)),kx=lerp(2000,R[0]+R[2]+24,e)+Math.sin(clamp((ky-1)*2,0,1)*Math.PI*3)*6;gd_key(ctx,kx,R[1]+176,clamp(ky*3,0,1));
    gu_tagAt(ctx,t,o.nextAt==null?1e9:o.nextAt,null,1380,700,"who may read it: the platform's · next film",{size:28});}}
const GD_PE=["Parsing Error","  Node model.credentials.mart_planning__try_private attempted to","  reference node model.credentials.int_credentials_unioned, which",
  "  is not allowed because the referenced node is private to the","  'credential_model' group."];

/* ---------- a promise the build keeps ---------- */
// the near-award table's contract: its columns and their types (o.cols, o.types light them), and, behind it, the marts' setting that
// enforces it (o.on)
const GD_NEAR=[{n:3,s:"  - name: mart_planning__near_award"},{fold:1},{n:35,s:"    columns:"},{n:36,s:"      - name: learner_award_key"},{n:38,s:"        data_type: string"},{fold:1},
  {n:48,s:"      - name: learner_key"},{n:50,s:"        data_type: string"},{fold:1},{n:86,s:"      - name: faculty_name"},{n:88,s:"        data_type: string"},{fold:1}],
  GD_MART=[{n:54,s:"    marts:"},{fold:1},{n:57,s:"      +access: protected"},{n:58,s:"      +contract:"},{n:59,s:"        enforced: true"}];
function gd_contract(ctx,o){o=o||{};const C=[3,6,9],T_=[4,7,10];
  gu_file(ctx,1180,lerp(H+60,110,easeCam(clamp(o.mart==null?1:o.mart,0,1))),640,{path:"dbt_project.yml",lang:"yaml",lines:GD_MART.map((r,i)=>i>=3?Object.assign({},r,{lit:o.on||0}):r),rot:0.01});
  gu_file(ctx,90,50,1000,{path:"models/marts/planning/_planning__models.yml",lang:"yaml",lines:GD_NEAR.map((r,i)=>C.includes(i)?Object.assign({},r,{lit:o.cols||0}):T_.includes(i)?Object.assign({},r,{lit:o.types||0}):r)});}
// one line of the near-award SQL changed, faculty_name to faculty, typed as o.ch goes 0 to 1; and dbt's answer: the contract failed, and the two rows that don't line up
// (o.err, 0 to 1, unrolls it; o.rows, 0 to 1, lights them); o.stays, a tag: the table isn't replaced
const GD_SQL=[{n:95,s:"    award_type,"},{n:96,s:"    faculty_code,"},{n:97,s:"    faculty_name,"},{n:98,s:"    learner_status,"}],
  GD_CE=["Compilation Error in model mart_planning__near_award (…)","  This model has an enforced contract that failed.","  …",
    "  | column_name  | definition_type | contract_type | mismatch_reason       |","  | ------------ | --------------- | ------------- | --------------------- |",
    "  | faculty      | VARCHAR         |               | missing in contract   |","  | faculty_name |                 | VARCHAR       | missing in definition |"];
function gd_mismatch(ctx,t,o){o=o||{};const ch=clamp(o.ch||0,0,1),tail=" as faculty,",
    lines=GD_SQL.map((r,i)=>i===2&&ch>0?Object.assign({},r,{s:"    faculty_name"+tail.slice(0,Math.max(1,Math.ceil(tail.length*ch))),lit:ch,litCol:GV.red}):r);
  gu_file(ctx,90,40,1000,{path:"models/marts/planning/mart_planning__near_award.sql",lines});
  const er=o.err||0;if(er>0.01){const x=90,y=430,w=1740,h=56+GD_CE.length*44;withA(ctx,clamp(er*3,0,1),()=>{wc_panel(ctx,x,y,w,h,{kind:"card",wash:GV.red,washA:0.16,seed:161});
    GD_CE.forEach((s,i)=>{const p=clamp(er*GD_CE.length-i,0,1);if(p<=0)return;const by=y+56+i*44;if(i>=5)gv_tint(ctx,x+20,by-32,w-40,42,GV.red,0.8*clamp(o.rows||0,0,1));
      wc_T(ctx,s.slice(0,Math.ceil(s.length*p)),x+30,by,{w:500,size:28,f:"mono",col:i>=5||i<2?GV.redInk:WC_INK});});});}
  gu_tagAt(ctx,t,o.staysAt==null?1e9:o.staysAt,null,1370,230,"the table isn't replaced",{size:30});}
// two versions of the credentials table, side by side on the board: version 2 (o.v2) and version 1 with its date to go (o.v1, o.date
// lights it, o.ring circles it); two of version 2's readers (o.rd) and their refs, pointing at it
function gd_versions(ctx,t,o){o=o||{};const v2=o.v2||0,v1=o.v1||0,rd=o.rd||0;
  if(v2>0.01){const k=0.92+0.08*spring(clamp(v2,0,1));ctx.save();ctx.translate(580,245);ctx.scale(k,k);ctx.translate(-580,-245);withA(ctx,clamp(v2*2,0,1),()=>{
    wc_panel(ctx,260,120,640,250,{kind:"card",wash:GV.green,washA:0.18,seed:171});gv_pin(ctx,580,138,GV.red,1.1);wc_hand(ctx,"version 2 · latest",300,214,{size:40,w:700,col:WC_DARK});
    wc_T(ctx,"core_credential_v2",300,290,{w:500,size:28,f:"mono",col:WC_INK});});ctx.restore();}
  if(v1>0.01){const k=0.92+0.08*spring(clamp(v1,0,1));ctx.save();ctx.translate(1330,245);ctx.scale(k,k);ctx.translate(-1330,-245);withA(ctx,clamp(v1*2,0,1),()=>{
    wc_panel(ctx,990,120,680,250,{kind:"card",wash:GV.amber,washA:0.14,seed:172});gv_pin(ctx,1330,138,GV.red,1.1);wc_hand(ctx,"version 1 · until 31 March 2027",1030,210,{size:36,w:700,col:WC_DARK});
    wc_T(ctx,"core_credential_v1",1030,268,{w:500,size:28,f:"mono",col:WC_INK});const dl="deprecation_date: 2027-03-31",dw=gu_mw(ctx,dl);
    gv_tint(ctx,1018,300,dw+24,44,GV.gold,0.9*clamp(o.date||0,0,1));gu_code(ctx,dl,1030,332,{lang:"yaml"});
    const rx=1030+gu_mw(ctx,"deprecation_date: ")+gu_mw(ctx,"2027-03-31")/2;wc_ring(ctx,rx,320,gu_mw(ctx,"2027-03-31")/2+12,34,clamp(o.ring||0,0,1),{col:GV.goldInk,seed:13});});ctx.restore();}
  if(rd>0.01)[["mart_wallet__credentials",520],["mart_wallet__learners",650]].forEach(([s,y],i)=>{const v=clamp(rd*2-i*0.5,0,1);if(v<=0)return;
    withA(ctx,v,()=>{wc_panel(ctx,260,y,490,74,{kind:"card",seed:175+i});wc_T(ctx,s,284,y+48,{w:500,size:28,f:"mono",col:WC_DARK});
      wc_T(ctx,"ref('core_credential', v=2)",790,y+48,{w:500,size:28,f:"mono",col:GV.greenInk});});
    gd_arrow(ctx,i?[262,y+30]:[400,y-4],i?[300,382]:[420,382],0,Math.min(clamp((v-0.4)/0.6,0,1),clamp(v2*1.5,0,1)),{col:GV.greenInk,bx:i?-110:0});});}
// exposures: who uses each table, and who answers for each use; three files, one per consumer, each coming in (o.at[i]); o.use lights
// each's name and kind, o.own its owner
const GD_EXP=[["exposures/planning/_planning__exposures.yml",[{n:3,s:"  - name: census_dashboard"},{n:5,s:"    type: dashboard"},{fold:1},{n:10,s:"    owner:"},{n:11,s:"      name: Planning"}],[80,40,-0.012]],
  ["exposures/finance/_finance__exposures.yml",[{n:3,s:"  - name: revenue_forecast"},{n:5,s:"    type: analysis"},{fold:1},{n:12,s:"    owner:"},{n:13,s:"      name: Finance"}],[1060,150,0.01]],
  ["exposures/wallet/_wallet__exposures.yml",[{n:3,s:"  - name: wallet_app"},{n:5,s:"    type: application"},{fold:1},{n:10,s:"    owner:"},{n:11,s:"      name: Wallet app team"}],[560,480,-0.006]]];
function gd_exposures(ctx,o){o=o||{};GD_EXP.forEach(([path,rows,[x,y,r]],i)=>{const u=(o.at||[])[i]||0;if(u<=0.01)return;const e=easeCam(clamp(u,0,1));
  gu_file(ctx,x,y+(1-e)*60,790,{path,lang:"yaml",a:clamp(u*2,0,1),rot:r,lines:rows.map((L,j)=>j<2?Object.assign({},L,{lit:o.use||0}):j===4?Object.assign({},L,{lit:o.own||0}):L)});});}

/* ---------- what this change touches ---------- */
// Tuesday's pull request on the big screen: its title, and the tab that's open (0, the description; 1, the files changed, nf of them)
const GD_TUE={title:"Count microcredentials of 6 credit points or more as awards",sub:"Tuesday · Jun Park wants to merge into main"};
function gd_tues(ctx,tab,nf){gd_prHead(ctx,{title:GD_TUE.title,titleSize:36,sub:GD_TUE.sub,tabs:["Conversation","Files changed · "+nf,"Checks · 5"],tab});}
// the first draft's change, in int_credentials_unioned.sql: a kind of credential becomes "award" from 6 credit points (o.lit)
const GD_REL=[{n:59,s:"        'LMS' as key_set,"},{s:"        case when latest_badges.credit_points > 0 then 'microcredential' …",del:1},{s:"        case",add:1},
  {s:"            when latest_badges.credit_points >= 6 then 'award'",add:1},{s:"            when latest_badges.credit_points > 0 then 'microcredential'",add:1},
  {s:"            else 'badge'",add:1},{s:"        end as credential_kind,",add:1},{n:65,s:"        latest_badges.badge_code as credential_code,"}];
function gd_relabel(ctx,lit){gu_file(ctx,150,330,1620,{path:"models/intermediate/student/int_credentials_unioned.sql",lh:44,lines:GD_REL.map((r,i)=>i===3?Object.assign({},r,{lit}):r)});}
// the second draft: the relabel gone, and a column added to version 2 of the credentials table, its SQL and its YAML; the column lit
// in the glossary's violet (o.lit), its class (o.cls)
function gd_column(ctx,o){o=o||{};const V=GV_MEAN.violet;
  gu_file(ctx,150,330,1620,{path:"models/core/student/core_credential_v2.sql",lh:44,lines:[{s:"    credential_kind = 'award'",add:1},
    {s:"        or (credential_kind = 'microcredential' and credit_points >= …",add:1},{s:"        as counts_as_award,",add:1,lit:o.lit||0,litCol:V}]});
  gu_file(ctx,150,590,1620,{path:"models/core/student/_core_student__models.yml",lang:"yaml",lh:44,a:o.y==null?1:o.y,lines:[{s:"      - name: counts_as_award",add:1,lit:o.lit||0,litCol:V},{fold:1},
    {s:"        data_type: boolean",add:1},{s:"        config: {meta: {personal_data: none}}",add:1,lit:o.cls||0}]});}
// The impact check's report, as the pull request's description shows it: its Markdown rendered, folded to what the film reads. Items:
// {h:1 or 2, s} a heading; {li:s} a bullet (cont: a bullet's next line); {s} a line; {fold:1}; each with p (0 to 1, shown), lit (a
// wash in col), col (its ink). Drawn in a box at (x,y), w wide; returns where it ends
function gd_md(ctx,x,y,w,items,o){o=o||{};let by=y+54;const out=[];items.forEach(it=>{const p=it.p==null?1:clamp(it.p,0,1),sz=it.h===1?36:it.h===2?30:28,lh=it.h===1?56:it.h===2?50:it.fold?36:40;
    if(p>0.01){const tx=x+30+(it.li!=null||it.cont?32:0),s=it.li!=null?it.li:it.s;
      if(it.lit>0.01)gv_tint(ctx,x+16,by-32,w-32,lh-2,it.litCol||GV.gold,0.8*clamp(it.lit,0,1));
      withA(ctx,p,()=>{if(it.fold)wc_T(ctx,"…",x+30,by,{w:500,size:28,f:"mono",col:WC_PENCIL});
        else if(it.h)wc_T(ctx,s,x+30,by,{w:800,size:sz,col:WC_DARK});
        else{if(it.li!=null)wc_T(ctx,"•",x+34,by,{w:800,size:28,col:it.col||WC_INK});gu_md(ctx,s,tx,by,{size:28,col:it.col});}});}
    out.push(by);by+=lh;});return{rows:out,end:by};}
const GD_R0=[{h:1,s:"What this change touches"},{fold:1},{h:2,s:"Contracts"},{li:"`mart_planning__completions`: new"},{h:2,s:"Who to ask"},{s:"Planning"}],
  GD_R1=[{h:1,s:"What this change touches"},{fold:1},{h:2,s:"Who uses it"},{li:"`census_dashboard`, owned by Planning"},{li:"`census_report`, owned by Planning"},
    {li:"`draft_submission`, owned by Mei Tanaka, registrar's office"},{li:"`revenue_forecast`, owned by Finance"},{li:"`wallet_app`, owned by Wallet app team"},
    {h:2,s:"Who to ask"},{s:"Finance; Mei Tanaka, registrar's office; Planning; Wallet app team"}],
  GD_R2=[{h:1,s:"What this change touches"},{fold:1},{h:2,s:"Contracts"},{li:"`core_credential v2`: additive: added counts_as_award",col:GV.greenInk,litCol:GV.green},{h:2,s:"Who uses it"},
    {li:"`census_report`, owned by Planning"},{li:"`draft_submission`, owned by Mei Tanaka, registrar's office"},{li:"`wallet_app`, owned by Wallet app team"},
    {h:2,s:"Who to ask"},{s:"Mei Tanaka, registrar's office; Planning; Wallet app team"}],
  GD_R3=[{h:1,s:"What this change touches"},{fold:1},{h:2,s:"Contracts"},{li:"`core_credential v2`: **breaking**: removed counts_as_award, added is_award. Needs a new",col:GV.redInk,litCol:GV.red},
    {cont:1,s:"version, with a deprecation date for this one",col:GV.redInk,litCol:GV.red}];
// a report, its items shown as the times in at[] come (each 0 to 1 from its time); lit[] for a wash on an item
function gd_report(ctx,t,items,at,o){o=o||{};const R=GD_LB[0],y=330;gu_box(ctx,R,y,1620,o.h||460,null,{seed:181});
  return gd_md(ctx,R,y,1620,items.map((it,i)=>Object.assign({},it,{p:at&&at[i]!=null?fin(t,at[i],0.35):1,lit:o.lit&&o.lit[i]!=null?o.lit[i]:it.lit})));}

/* ---------- reviews go to the owners ---------- */
// the reviewers file, generated: its header, and the three lines the film names, each lit as it's said (o.lit[k]); a person's card under
// it for each (o.card[k]), joined to the sheet by a pencil thread
const GD_CO=[{n:1,s:"# Generated by scripts/generate/codeowners.py from the owners in the project's …"},{n:2,s:"# governance/2-owners/owners.yml. Don't edit it: change the metadata, then run …"},{fold:1},
  {n:26,s:"/models/core/student/_core_student__models.yml           mei.tanaka@uni.example …"},{fold:1},
  {n:35,s:"/models/marts/planning/_planning__models.yml             planning@uni.example …"},{fold:1},
  {n:60,s:"/governance/4-data-products/learners_near_an_award.yml   clara.jensen@uni.example"}],
  GD_COP=[["Mei Tanaka","registrar's office",250],["Planning","Planning's tables",850],["Clara Jensen","Planning",1390]];
function gd_codeowners(ctx,o){o=o||{};const L=o.lit||[],R=gu_file(ctx,100,40,1720,{path:"CODEOWNERS",lines:GD_CO.map((r,i)=>i<2?Object.assign({},r,{lit:o.head||0}):
    i===3?Object.assign({},r,{lit:L[0]||0}):i===5?Object.assign({},r,{lit:L[1]||0}):i===7?Object.assign({},r,{lit:L[2]||0}):r)});
  GD_COP.forEach(([n,r,x],k)=>{const u=(o.card||[])[k]||0;if(u<=0.01)return;const ex=R.tx+gu_mw(ctx,"/models/core/student/_core_student__models.yml           ")+180;
    wc_link(ctx,ex,522,x+130,640,WC_PENCIL,{p:clamp(u*1.6,0,1),vertical:true,a:0.8,lw:3});gu_nameCard(ctx,x,640,n,r,clamp((u-0.35)*2,0,1));});}
// a project decision, as a file beside what it's about: who decided, when and why light in turn (o.lit: [who, when, why])
const GD_DEC=[{n:143,s:"  - id: DEC-PRJ-12"},{n:145,s:"    title: Governance's rules run as a check on every pull request"},{fold:1},
  {n:152,s:"    why: A policy that lives only in a document isn't followed. …"},{n:154,s:"    decided_by: Yusuf Demir, data governance lead, with Noor, data architect"},{n:155,s:"    decided_on: 2026-10-20"}];
function gd_decision(ctx,u,lit){if(u<=0.01)return null;const L=lit||[],e=easeCam(clamp(u,0,1));
  return gu_file(ctx,120,lerp(H+60,200,e),1480,{path:"models/_shared/_shared__decisions.yml",lang:"yaml",rot:-0.006,
    lines:GD_DEC.map((r,i)=>i===4?Object.assign({},r,{lit:L[0]||0}):i===5?Object.assign({},r,{lit:L[1]||0}):i===3?Object.assign({},r,{lit:L[2]||0}):r)});}

/* ---------- a check that teaches ---------- */
// part of a line, washed in a colour as it's named (a, 0 to 1): the sub-string sub of line s, drawn at tx on baseline row r's middle
function gd_mark(ctx,tx,cy,s,sub,a,col){if(a<=0.01)return;const i=s.indexOf(sub);if(i<0)return;gv_tint(ctx,tx+gu_mw(ctx,s.slice(0,i))-6,cy-21,gu_mw(ctx,sub)+12,42,col||GV.gold,0.9*clamp(a,0,1));}
// what the check printed for Jun: what to add (o.what), where (o.where), and the page on how (o.link)
const GD_MSG=["owner: models/marts/planning/_planning__models.yml: mart_planning__completions has no","meta.owner or meta.domain (how to: docs/how-to/add-an-owner.md)"];
function gd_message(ctx,o){o=o||{};const R=gu_file(ctx,100,50,1720,{path:"$ python scripts/check/governance.py",lines:GD_MSG.map(s=>({s,col:GV.redInk}))});
  gd_mark(ctx,R.tx,R.rows[0],GD_MSG[0],"models/marts/planning/_planning__models.yml: mart_planning__completions",o.where);
  gd_mark(ctx,R.tx,R.rows[1],GD_MSG[1],"meta.owner or meta.domain",o.what);gd_mark(ctx,R.tx,R.rows[1],GD_MSG[1],"(how to: docs/how-to/add-an-owner.md)",o.link);return R;}
// the page it links, as the project's docs show it: what the check asks, why, how, and who to ask (o.who lights the last); u brings it
const GD_HOW=[{h:1,s:"Add an owner"},{s:"**What the check asks.** Everything other teams read has an owner: each domain, each"},{s:"entity in a conceptual model, and each shared model."},
  {s:"**Why.** When a number is wrong or a meaning changes, someone has to decide. The owner"},{s:"is that person, and changes reach them for review."},{s:"**How.**"},{fold:1},
  {s:"**Who to ask.** Data governance's office hours, Thursdays from 2 to 3 pm, or"},{s:"data.governance@uni.example. If you don't know who owns it, that's the question to bring."}];
function gd_howto(ctx,u,who){if(u<=0.01)return;const e=easeCam(clamp(u,0,1)),y=lerp(H+60,320,e),x=100,w=1720;
  gv_sheet(ctx,x,y,w,520,{rot:0.004});wc_T(ctx,"docs/how-to/add-an-owner.md",x+30,y+54,{w:500,size:28,f:"mono",col:WC_MUTED});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+24,y+76);ctx.lineTo(x+w-24,y+76);ctx.stroke();ctx.restore();
  gd_md(ctx,x,y+70,w,GD_HOW.map((it,i)=>i>=7?Object.assign({},it,{lit:who}):it));}
// a new rule's warning, as the check prints it until its date: what's missing (o.holds lights it), and the day it becomes an error
// (o.date lights it, o.err underlines it in red)
const GD_WARN=["warning: described: … has no description: say what it holds, in a sentence its readers","know (how to: docs/how-to/describe-a-column.md) (an error from 1 December 2026)"];
function gd_warning(ctx,u,o){if(u<=0.01)return;o=o||{};const e=easeCam(clamp(u,0,1)),R=gu_file(ctx,100,lerp(H+60,200,e),1720,{path:"$ python scripts/check/governance.py",
    lines:GD_WARN.map(s=>({s,col:GV.amberInk})),rot:-0.004});
  gd_mark(ctx,R.tx,R.rows[0],GD_WARN[0],"say what it holds",o.holds,GV.amber);const d="(an error from 1 December 2026)";gd_mark(ctx,R.tx,R.rows[1],GD_WARN[1],d,o.date);
  gd_under(ctx,R.tx+gu_mw(ctx,GD_WARN[1].slice(0,GD_WARN[1].indexOf(d))),R.rows[1]+24,gu_mw(ctx,d),o.err||0,GV.redInk);return R;}
// the rule's days in a line: amber while it warns (o.a), the day it changes (o.date), and red from then, an error (o.err)
function gd_timeline(ctx,o){o=o||{};const a=clamp(o.a||0,0,1);if(a<=0.01)return;const y=650,x0=260,xd=1000,x1=1500,d=clamp(o.date||0,0,1),r=clamp(o.err||0,0,1);
  withA(ctx,clamp(a*2,0,1),()=>{ctx.save();ctx.lineCap="round";ctx.lineWidth=14;ctx.strokeStyle=rgba(GV.amber,0.9);ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,xd,easeCam(a)),y);ctx.stroke();
    if(r>0.01){ctx.strokeStyle=rgba(GV.red,0.9);ctx.beginPath();ctx.moveTo(xd,y);ctx.lineTo(lerp(xd,x1,easeCam(r)),y);ctx.stroke();}ctx.restore();
    wc_hand(ctx,"a warning",x0,y-34,{size:36,w:700,col:GV.amberInk,p:a});});
  if(d>0.01)withA(ctx,d,()=>{ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.8);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(xd,y-40);ctx.lineTo(xd,y+40);ctx.stroke();ctx.restore();
    wc_tag(ctx,xd,y+86,"1 December 2026",{size:30,align:"center"});});
  if(r>0.01)wc_hand(ctx,"an error",xd+40,y-34,{size:36,w:700,col:GV.redInk,p:r});}
// the warnings, week by week, as a chart in pencil and wash on a sheet pinned to Yusuf's board: each week's bar grows (o.at[i]), and
// when they reach none, a green tick (o.tick)
const GD_WK=[["20 Oct",41],["27 Oct",23],["3 Nov",9],["10 Nov",2],["17 Nov",0]],GD_CH={x:360,y:110,w:1200,h:720,base:700,bw:130,k:9.4};
function gd_barC(i){const C=GD_CH,h=Math.round(41*C.k)+20;return wc_kept("gdBar"+i,C.bw+20,h,q=>wc_wash(q,wc_rect(10,10,C.bw,h-20),GV.amber,{kind:"swatch",a:0.85,seed:191+i}));}
function gd_chart(ctx,t,o){o=o||{};const C=GD_CH;gv_sheet(ctx,C.x,C.y,C.w,C.h,{rot:-0.006});gv_pin(ctx,C.x+C.w/2,C.y+22,GV.red,1.2);
  wc_hand(ctx,"Warnings, week by week",C.x+60,C.y+100,{size:40,w:700,col:WC_DARK});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(C.x+60,C.base);ctx.lineTo(C.x+C.w-60,C.base);ctx.stroke();ctx.restore();
  GD_WK.forEach(([d,n],i)=>{const cx=C.x+160+i*220,u=clamp((o.at||[])[i]||0,0,1);if(u<=0.01)return;const e=easeCam(u),bh=n*C.k*e;
    if(bh>1){const c=gd_barC(i),full=c.height-20;ctx.save();ctx.beginPath();ctx.rect(cx-C.bw/2-10,C.base-bh,C.bw+20,bh);ctx.clip();ctx.drawImage(c,cx-C.bw/2-10,C.base-full-10);ctx.restore();}
    withA(ctx,clamp(u*2,0,1),()=>{wc_hand(ctx,String(n),cx,C.base-bh-18,{size:40,w:700,align:"center",col:n?GV.amberInk:GV.greenInk});wc_T(ctx,d,cx,C.base+44,{w:600,size:28,align:"center",col:WC_INK});});});
  wc_tick(ctx,C.x+160+4*220,C.base-110,70,GV.greenInk,clamp(o.tick||0,0,1),7);}
// the faculty's office: Anil at his desk, the desk in front of him, kept once
function gd_facDesk(ctx){ctx.drawImage(wc_kept("gdFacDesk",W,H,c=>gv_paintFacultyDesk(c)),0,0);}
// Anil's pull request: a column added to his call list, and the check's message for it, then his line and the check passing
const GD_ANC={title:"School on the call list",sub:"Anil Kurian wants to merge into main"},
  GD_ANM=["columns: models/marts/health/_health__models.yml: mart_health__learner_progress:","school_name has no meta.personal_data: say whether it identifies a person, with",
    "direct, pseudonymous or none (how to: docs/how-to/classify-a-column.md)"];
function gd_anilPR(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"GitHub · pull request",title:GD_ANC.title,state:["Open",GV.green],sub:GD_ANC.sub,
    tabs:["Conversation","Files changed · 1","Checks · 5"],tab:0});
  const ok=clamp(o.ok||0,0,1),items=GD_PR.ck.map(n=>({name:n,st:n==="governance"?(ok>0.5?"pass":o.fail?"fail":"run"):"pass"})),
    msg=ok>0.5?[{s:GD_PR.g1,col:GV.greenInk},{s:GD_PR.g2,col:GV.greenInk}]:GD_ANM.map((s,i)=>({s,col:GV.redInk,p:clamp((o.msg||0)*3-i,0,1)}));
  const R=gu_checks(ctx,150,330,1620,{h:300,items,t,msg,pop:[0,o.pop||0,0,0,0],msgGap:74});
  if(ok<0.5)gd_mark(ctx,182,R.my+42-10,GD_ANM[1],"school_name has no meta.personal_data",o.lit,GV.red);
  const u=o.sheet||0;if(u>0.01){const e=easeCam(clamp(u,0,1));gu_file(ctx,150,lerp(H+60,654,e),1620,{path:"models/marts/health/_health__models.yml",lang:"yaml",lh:44,rot:0.004,
    lines:[{s:"      - name: school_name"},{s:"        data_type: string"},{s:"        config: {meta: {personal_data: none}}",add:1,p:o.typ||0,lit:o.typ>=1?1:0}]});}}

/* ---------- an agent on every pull request ---------- */
// the skill the team wrote, as a file: the steps lit as they're named (o.lit: [run the checks, read what they can't, draft what's missing])
const GD_SK=[{n:6,s:"# Review a pull request for governance",col:WC_DARK},{fold:1},{n:9,s:"… Most of it is checked by scripts; the rest needs reading. You"},
  {n:10,s:"find, draft and flag. People decide: you never approve, …"},{fold:1},{n:15,s:"1. **Build what changed, and run the checks.**"},{fold:1},{n:28,s:"2. **An owner.** …"},
  {fold:1},{n:40,s:"4. **Classified columns.** …"},{fold:1},{n:49,s:"5. **A test, or a tracking model, for each stated rule.** …"},{fold:1},{n:60,s:"7. **Report.** One comment on the pull request: …"}];
function gd_skill(ctx,t,u,lit){if(u<=0.01)return null;const L=lit||[],e=easeCam(clamp(u,0,1)),y=lerp(H+60,40,e),
    R=gu_file(ctx,120,y,1500,{path:"skills/review-for-governance/SKILL.md",lines:GD_SK.map((r,i)=>i===5?Object.assign({},r,{lit:L[0]||0}):i===2?Object.assign({},r,{lit:L[1]||0}):i===3?Object.assign({},r,{lit:L[2]||0}):
      i===0?Object.assign({},r,{lit:L[3]||0,litCol:wc_lit(GU_CYAN,0.5)}):r)});
  gu_star(ctx,1560,y+46,1.3,t,clamp(u*2,0,1));return R;}
// Anil's first pull request, and the agent's comment on it: a dashed cyan card under its star. o.view: 0, its three findings (o.f[k]
// lights each); 1, the second finding's classes, drafted with counts (o.rows), and who decides each (o.who[k]); 2, the approvals: the
// agent's own line, with no tick, and each person's yes (o.yes[k])
const GD_AP={title:"Faculty of Health call list",sub:"Anil Kurian wants to merge into main"},
  GD_FIND=["1. Nobody answers for it","2. Ten columns don't say whether they identify a person","3. A stated rule has no test"],
  GD_CLS=[["email","direct","7 rows, 6 distinct; 7 look like an email"],["learner_key","pseudonymous","7 rows, 7 distinct; 7 look like a hash"],
    ["award_key","pseudonymous","7 rows, only 2 distinct; … please confirm",1]],
  GD_WHO=["**Who decides:** data governance, for a new owner and the owner register.","**Who decides:** the Faculty of Health, as the mart's owner.",
    "**Who decides:** the Faculty of Health, for the rule; Jun, for the code."],
  GD_YES=[["the Faculty of Health","for the classes and the rule"],["Yusuf Demir, data governance","for the faculty as a new owner"],["Jun Park","for the code"]];
function gd_agentCard(ctx,t,x,y,w,h){wc_panel(ctx,x,y,w,h,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:201});gu_star(ctx,x+44,y+46,1.1,t);
  wc_T(ctx,"Governance review",x+84,y+58,{w:800,size:34,col:WC_DARK});wc_T(ctx,"the agent",x+w-36,y+56,{w:600,size:28,col:GU_CYAN,align:"right"});}
function gd_agentPR(ctx,t,o){o=o||{};const [X,Y,Wd,Hd]=GU_BIG;gu_page(ctx,X,Y,Wd,Hd,{bar:"GitHub · pull request",title:GD_AP.title,state:["Open",GV.green],sub:GD_AP.sub,
    tabs:["Conversation","Files changed · 6","Checks · 5"],tab:0});
  const x=150,y=330,w=1620,v=o.view||0;
  if(v===0){gd_agentCard(ctx,t,x,y,w,500);gu_md(ctx,"It's a comment, not an approval: each finding says who decides.",x+40,y+118,{size:28,col:WC_INK});
    GD_FIND.forEach((s,k)=>{const by=y+214+k*84,a=clamp((o.f||[])[k]||0,0,1);if(a>0.01)gv_tint(ctx,x+24,by-40,w-48,58,GV.gold,0.8*a);
      wc_T(ctx,s,x+40,by,{w:800,size:32,col:WC_DARK,a:0.55+0.45*a});wc_T(ctx,"…",x+40,by+34,{w:500,size:28,f:"mono",col:WC_PENCIL});});}
  else if(v===1){gd_agentCard(ctx,t,x,y,w,520);wc_T(ctx,GD_FIND[1],x+40,y+120,{w:800,size:30,col:WC_DARK});
    [["Column",x+40],["Drafted class",x+380],["Evidence",x+780]].forEach(([s,cx])=>wc_T(ctx,s,cx,y+172,{w:700,size:28,col:WC_MUTED}));
    GD_CLS.forEach(([c,cls,ev,unsure],k)=>{const by=y+228+k*56,a=clamp((o.rows||[])[k]||0,0,1);if(a<=0.01)return;withA(ctx,a,()=>{
      wc_T(ctx,c,x+40,by,{w:500,size:28,f:"mono",col:WC_DARK});const cw=gv_classChip(ctx,x+380,by-10,cls);if(unsure)wc_hand(ctx,"not sure",x+380+cw+14,by,{size:28,w:700,col:GV.amberInk});
      wc_T(ctx,ev,x+780,by,{w:600,size:28,col:WC_INK});});});
    GD_WHO.forEach((s,k)=>{const by=y+420+k*40,a=clamp((o.who||[])[k]||0,0,1);if(a<=0.01)return;gv_tint(ctx,x+24,by-30,w-48,40,GV.gold,0.7*a);
      withA(ctx,clamp(a*2,0,1),()=>{wc_T(ctx,String(k+1),x+44,by,{w:700,size:28,col:WC_MUTED});gu_md(ctx,s,x+80,by,{size:28});});});}
  else{gu_box(ctx,x,y,w,520,"Approvals",{seed:205});const ag=clamp(o.ag||0,0,1);
    withA(ctx,ag,()=>{wc_panel(ctx,x+24,y+82,w-48,92,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:206});gu_star(ctx,x+66,y+128,1,t);
      wc_T(ctx,"Governance review",x+104,y+140,{w:800,size:30,col:WC_DARK});wc_T(ctx,"It's a comment, not an approval",x+440,y+140,{w:600,size:28,col:WC_MUTED});
      ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+w-80,y+128,20,0,TAU);ctx.stroke();ctx.restore();});
    GD_YES.forEach(([n,f],k)=>{const by=y+250+k*86,a=clamp((o.yes||[])[k]||0,0,1);if(a<=0.01)return;withA(ctx,clamp(a*2,0,1),()=>{
      wc_hand(ctx,n,x+50,by,{size:36,w:700,col:GV.goldInk,p:clamp(a*1.4,0,1)});wc_T(ctx,f,x+620,by,{w:600,size:28,col:WC_INK});});
      wc_tick(ctx,x+w-80,by-10,44,GV.greenInk,clamp(a*1.5-0.4,0,1),6);});}}

/* ---------- carried with the code ---------- */
// Jun's speech bubble, as at the start, with its old line struck through (o.strike) before its new words come (o.mix)
function gd_bubbleStrike(ctx,a,k,strike){if(a<=0.01||strike<=0.01)return;const sz=40,lh=52,y=300+sz*0.5+lh*1.74-14,w=tw(ctx,"after I've built it.",sz,700);
  withA(ctx,a,()=>{ctx.save();ctx.translate(1290,520);ctx.scale(k,k);ctx.translate(-1290,-520);ctx.strokeStyle=rgba(GV.redInk,0.85);ctx.lineWidth=5;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(730,y);ctx.lineTo(730+w*easeCam(clamp(strike,0,1)),y-3);ctx.stroke();ctx.restore();});}
// Noor's map, close: a sheet pinned over it for where each piece lives. The dbt project is the home of five things (o.home[i] brings
// each), and their copies flow one way, to the platform and the catalogue (o.flow[j]), each with a drift check (o.drift[j])
const GD_HOME=["owners","column classes","contracts","tests","decisions"],GD_MAPS={x:500,y:250,w:1270,h:600};
function gd_homeMap(ctx,t,o){o=o||{};const S=GD_MAPS,a=clamp(o.a==null?1:o.a,0,1);if(a<=0.01)return;const e=easeCam(a);
  ctx.save();ctx.translate(0,(1-e)*40);withA(ctx,clamp(a*2,0,1),()=>{gv_sheet(ctx,S.x,S.y,S.w,S.h,{rot:-0.006});gv_pin(ctx,S.x+S.w/2,S.y+22,GV.red,1.3);
    gu_filmTag(ctx,S.x+40,S.y+70,"Where each piece lives",1);
    const bx=S.x+40,by=S.y+120;wc_panel(ctx,bx,by,520,450,{kind:"card",role:WC_SIDE.tech,seed:211});const lw=logo(ctx,"dbt",bx+28,by+20,44);wc_T(ctx,"project",bx+40+lw,by+56,{w:800,size:34,col:WC_DARK});
    GD_HOME.forEach((s,i)=>{const u=clamp((o.home||[])[i]||0,0,1);if(u<=0.01)return;const k=0.9+0.1*spring(u),cy=by+120+i*64;ctx.save();ctx.translate(bx+260,cy);ctx.scale(k,k);
      withA(ctx,clamp(u*2,0,1),()=>{wc_panel(ctx,-220,-26,440,52,{kind:"card",wash:GV.gold,washA:0.3,seed:215+i});wc_T(ctx,s,-192,10,{w:700,size:30,col:WC_DARK});});ctx.restore();});
    [["data platform",by+40],["product catalogue",by+270]].forEach(([s,ty],j)=>{const u=clamp((o.flow||[])[j]||0,0,1);if(u<=0.01)return;const tx=S.x+S.w-460;
      withA(ctx,clamp(u*2,0,1),()=>{wc_panel(ctx,tx,ty,420,130,{kind:"card",seed:221+j});wc_T(ctx,s,tx+30,ty+76,{w:800,size:34,col:WC_DARK});});
      gd_arrow(ctx,[bx+526,ty+50],[tx-14,ty+60],-30,clamp(u*1.4-0.2,0,1),{col:GU_CYAN,lw:5});
      const d=clamp((o.drift||[])[j]||0,0,1);if(d>0.01)withA(ctx,d,()=>{wc_tick(ctx,bx+548,ty+108,30,GV.greenInk,d,5);wc_T(ctx,"drift check",bx+574,ty+118,{w:600,size:28,col:WC_INK});});});});
  ctx.restore();}
// the six pins on the poster, each one's words giving way, in turn, to the line that keeps it in the project, in the typeface, where
// the words were (u, 0 to 1)
const GD_PINC=[["glossary_term:"],["personal_data:"],["owner:","contract:"],["data_tests:"],["CODEOWNERS"],["deprecation_date:"]];
function gd_pinCodes(ctx,u){const [x,y,w,h]=GV_PC,k=w/1260;GU_PINS.forEach(([i,lines],j)=>{const v=clamp(u*6-j,0,1),[sx,sy]=gv_loopPos(i,x,y,w,h),
    c=Math.cos(-Math.PI/2+i/10*TAU),top=i===0,al=top?"center":c>0?"left":"right",nx=top?sx:sx+(c>0?1:-1)*(i===1||i===9?100:46)*k,ny=top?sy+80*k:sy+56*k;
  gu_goldPin(ctx,i,x,y,w,h,1,1,lines,null);
  lines.forEach((s,m)=>{const ly=ny+m*38*k,cs=GD_PINC[j][m],cw=gu_mw(ctx,cs),x0=al==="center"?nx-cw/2:al==="right"?nx-cw:nx;
    if(v<0.5)withA(ctx,1-clamp(v*2,0,1),()=>wc_hand(ctx,s,nx,ly,{size:32*k,w:700,align:al,col:GV.goldInk}));
    else withA(ctx,clamp(v*2-1,0,1),()=>{gv_tint(ctx,x0-8,ly-28,cw+16,40,GV.gold,0.55);gu_code(ctx,cs,x0,ly,{col:WC_DARK});});});});}

const WC_PLACES={data:c=>gv_paintData(c,{words:true}),poster:c=>gv_paintPosterClose(c,{words:true}),board:c=>gv_paintBoardClose(c,GV_ROOM.data),
  boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),big:c=>gu_paintScreenBig(c,GV_ROOM.data),bigFac:c=>gu_paintScreenBig(c,GV_ROOM.fac),desk:gu_paintFilesDesk,
  deskGov:gv_paintDesk,mapClose:gv_paintMapClose,faculty:gv_paintFaculty};

/* ===== Governed in dbt: the nine chapters =====
   Each chapter is a few shots in the places of plan.js and data governance's rooms.js, cut together with short dissolves (gv_shots).
   Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the
   voice if it's recorded again. Words on screen are on screens, papers, cards, boards and tags, at least 28 px as seen, and above the
   captions. */

// ---- 1 · The rules arrive first: today, Jun's pull request; the rule that waited four months; census day; the check that answers
// in a minute; and the title ----
scene("rules",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({jun:wAt(sc,"loop","Jun Park"),ten:wAt(sc,"loop","ten steps"),q:wAt(sc,"loop","from a question"),
    ver:wAt(sc,"loop","new version"),pr:c.opens-0.3,table:wAt(sc,"opens","a new table"),awards:wAt(sc,"opens","the awards conferred"),slow:c.slowed-0.4,rules:wAt(sc,"slowed","the rules arrive"),
    rule:c.owner-0.4,has:wAt(sc,"owner","has an owner"),months:wAt(sc,"months","four months"),nobody:wAt(sc,"nobody","nobody answers"),
    census:c.census-0.4,fac:wAt(sc,"census","Faculty of Health"),places:wAt(sc,"census","plan its places"),fromJ:wAt(sc,"census","from Jun"),
    toN:wAt(sc,"census","to Noor"),toP:wAt(sc,"census","to Planning"),back:wAt(sc,"census","back to Jun"),change:c.change,
    live:c.live-0.4,runs:wAt(sc,"live","a check runs"),noOwner:wAt(sc,"answers","no owner"),how:wAt(sc,"answers","how to add one"),
    adds:c.adds,two:wAt(sc,"adds","two lines"),green:wAt(sc,"adds","turns green"),itself:c.itself,plan:wAt(sc,"itself","Planning"),by:wAt(sc,"itself","by itself"),
    min:c.minute-0.4,four:wAt(sc,"minute","four months"),check:wAt(sc,"minute","a check that takes"),first:c.first-0.4,arrive:wAt(sc,"first","arrive first"),
    board:c.breath-0.3,title:c.breath+1.2})),
    // the checks on Jun's pull request: each runs, then passes; governance fails first, and passes once the owner is in
    T7=gd_once(sc,"T7",()=>({build:{run:P.runs,pass:P.noOwner-1.2},governance:{run:P.runs+0.15,fail:P.noOwner-0.2,pass:P.green},
      products:{run:P.runs+0.3,pass:P.runs+1.3},reviewers:{run:P.runs+0.45,pass:P.runs+1.6},impact:{run:P.runs+0.6,pass:P.runs+1.9}}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the data team's room, today: Jun at his desk, the board across the room with the series' six cards
    {at:0,place:"data",keys:[[0,1040,520,1.12],[0.4,1100,540,1.22]],d:4.2,draw:(x,tt)=>gd_room(x,tt,{jun:{flip:true}})},
    // the team's poster, close: the loop going round once, from a question to a new version
    {at:P.ten-0.3,place:"poster",keys:[[P.ten-0.3,960,470,1.04]],push:0.03,draw:(x,tt)=>{const [px,py,pw,ph]=GV_PC;
      gu_loopRun(x,px,py,pw,ph,clamp((tt-P.q)/(P.ver+0.6-P.q),0,1));}},
    // his pull request, opened as a draft: what it adds, no reviewers yet, its checks waiting
    {at:P.pr,place:"big",keys:[[P.pr,960,520,1.02],[P.table,960,500,1.05]],d:2.2,draw:(x,tt)=>gd_pr(x,tt,{state:["Draft",GV.grey],hiF:fin(tt,P.table,0.5),
      hiD:fin(tt,P.awards,0.5)})},
    // the room again, closer: his line from Off the shelf
    {at:P.slow,place:"data",keys:[[P.slow,1180,560,1.45]],push:0.02,draw:(x,tt)=>{gd_room(x,tt,{jun:{flip:true,expr:"concerned"}});
      gd_bubble(x,fin(tt,P.rules-0.2,0.35),0.92+0.08*spring(fin(tt,P.rules-0.2,0.5)),["The rules arrive","after I've built it."],0);}},
    // Yusuf's desk: the rule on a card, "owner" underlined; the council's minutes, four months of the same action; then the question
    {at:P.rule,place:"deskGov",keys:[[P.rule,600,415,1.6],[P.months-0.3,960,540,1]],d:1.8,draw:(x,tt)=>{
      gd_rule(x,{u:clamp((tt-P.has)/0.8,0,1),q:fin(tt,P.nobody,0.5)});gd_minutes(x,{at:[0,1,2,3].map(i=>fin(tt,P.months+0.35*i,0.6))});}},
    // census day, on Yusuf's board: Anil's question, and the path he was sent round; the arrows fade when something has to change
    {at:P.census,place:"boardGov",keys:[[P.census,960,500,1.04]],push:0.02,draw:(x,tt)=>gd_census(x,{card:fin(tt,P.census+0.2,0.6),anil:fin(tt,P.fac-0.1,0.5),
      places:clamp((tt-P.places)/1.0,0,1),path:[P.fromJ,P.toN,P.toP,P.back].map(s=>fin(tt,s-0.1,0.5)),dim:fin(tt,P.change,0.8)})},
    // the pull request: the checks run; governance fails, and says what's missing and how to add it; two lines, and it passes; it's
    // ready, and its owners are asked to review, Planning first, by themselves
    {at:P.live,place:"big",keys:[[P.live,960,540,1],[P.runs-0.2,960,640,1.12],[P.adds-0.4,960,540,1],[P.itself,980,480,1.1]],d:1.6,push:0,draw:(x,tt)=>{
      const items=gd_items(tt,T7),fl=fin(tt,P.noOwner-0.2,0.2),ok=fin(tt,P.green,0.3),
        msg=ok>0?[{s:GD_PR.g1,col:GV.greenInk,p:ok},{s:GD_PR.g2,col:GV.greenInk,p:ok}]:fl>0?[{s:GD_PR.m1,col:GV.redInk,p:clamp((tt-P.noOwner)/0.9,0,1)},
          {s:GD_PR.m2a+GD_PR.m2b,col:GV.redInk,p:clamp((tt-P.noOwner-0.6)/0.9,0,1)}]:null;
      gd_pr(x,tt,{state:tt<P.itself?["Draft",GV.grey]:["Open",GV.green],items,msg,how:clamp((tt-Math.max(P.how,P.noOwner+1.6))/0.6,0,1)*(1-fin(tt,P.adds-0.3,0.3)),
        pop:[0,fin(tt,P.green,0.3)*(1-fin(tt,P.green+1.0,0.6)),0,0,0],rev:clamp((tt-P.plan+0.3)/0.9,0,1),glow:1-fin(tt,P.by+0.6,0.8)*0.6});
      gd_ownSheet(x,clamp((tt-P.adds+0.1)/0.8,0,1)*(1-clamp((tt-P.green-0.9)/0.7,0,1)),clamp((tt-P.two)/1.0,0,1),fin(tt,P.two+1.0,0.4));}},
    // Yusuf's desk: four months of minutes in one small pile, beside the check that does it in a minute
    {at:P.min,place:"deskGov",keys:[[P.min,960,540,1],[P.four,1060,460,1.18]],d:1.6,draw:(x,tt)=>{gd_minutes(x,{pile:clamp((tt-P.four)/1.0,0,1)});
      gd_badge(x,1500,380,fin(tt,P.check,0.6));}},
    // the room: Jun's line again, and its words change
    {at:P.first,place:"data",keys:[[P.first,1180,560,1.45]],push:0.02,draw:(x,tt)=>{gd_room(x,tt,{jun:{flip:true,expr:tt>P.arrive?"smile":"calm"}});
      gd_bubble(x,1,1,["The rules arrive","after I've built it."],fin(tt,P.arrive,0.8),["The rules arrive first."]);}},
    // the board, close: the series' six cards; the first lights and lifts, and becomes the title
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>gu_board(x,{lit:[fin(tt,P.board+0.3,0.8)],lift:[fin(tt,P.board+1.0,1.0)]})}],sc.dur));
  wc_year(ctx,56,72,"Today",gv_io(t,0.3,P.ten-0.3,0.4));
  gu_nameCard(ctx,80,760,"Jun Park","analytics engineer",gv_io(t,c.today+1.0,P.ten-0.5,0.4));
  gv_title(ctx,S,t,P.title,"Governed in dbt","owners, contracts and checks in the project","Film 1 of 6 · data governance");});

// ---- 2 · A pin at each step: Yusuf's pins on the poster, and each as a line beside the model's code ----
// the six pins going into the poster as each is named, each with its ring and Yusuf's words
function gd_pinsAt(ctx,tt,P){const [x,y,w,h]=GV_PC;GU_PINS.forEach(([i,lines],j)=>{const t0=P.p[j];gu_goldPin(ctx,i,x,y,w,h,fin(tt,t0-0.25,0.5),clamp((tt-t0)/0.8,0,1),lines,
  lines.map((_,k)=>clamp((tt-(k?P.contract:t0)-0.1)/0.7,0,1)));});}
scene("pins",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({p:[wAt(sc,"pins1","a term"),wAt(sc,"pins1","a class"),wAt(sc,"pins1","an owner"),
    wAt(sc,"pins2","a rule"),wAt(sc,"pins2","an approval"),wAt(sc,"pins2","a version")],contract:wAt(sc,"pins1","a contract"),
    line:c.line-0.4,beside:wAt(sc,"line","a line"),owner:wAt(sc,"learner","its owner"),term:wAt(sc,"learner","the term it holds"),
    cols:c.columns-0.4,ident:wAt(sc,"columns","identifies a person"),test:wAt(sc,"columns","each test"),tOwner:wAt(sc,"columns","has an owner"),
    rev:c.reviewed-0.4,with:wAt(sc,"reviewed","with the code")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the poster, close: a gold pin at each step where a decision enters the loop
    {at:0,place:"poster",keys:[[0,960,470,1.04]],push:0.03,draw:(x,tt)=>gd_pinsAt(x,tt,P)},
    // the desk: the learner table's YAML comes up; its owner and domain light, with Yusuf's pin and the film that decided it; then its term
    {at:P.line,place:"desk",keys:[[P.line,800,440,1.25]],push:0.02,draw:(x,tt)=>{const R=gd_learner(x,clamp((tt-P.line-0.2)/0.9,0,1),[fin(tt,P.owner,0.5),fin(tt,P.term,0.5),fin(tt,P.beside,0.6)]);
      if(!R)return;const ow=R.rows[5],tm=R.rows[7],oe=R.tx+gu_mw(x,GD_LRN[5].s)+30,te=R.tx+gu_mw(x,GD_LRN[7].s)+30;
      gd_flyPin(x,[960,-60],[oe,ow],clamp((tt-P.owner+0.2)/0.9,0,1),"an owner");gu_filmTag(x,oe+200,ow,"Who decides",fin(tt,P.owner+0.6,0.5));
      gd_flyPin(x,[960,-60],[te,tm],clamp((tt-P.term+0.2)/0.9,0,1),"a term");gu_filmTag(x,te+170,tm,"One word, one home",fin(tt,P.term+0.6,0.5));}},
    // three of its columns, each saying whether it identifies a person, its class beside it, and the film that set the classes
    {at:P.cols,place:"desk",keys:[[P.cols,960,520,1]],push:0.02,draw:(x,tt)=>{const R=gd_columns(x,tt,clamp((tt-P.cols)/0.8,0,1),[0,1,2].map(k=>fin(tt,P.ident-0.2+0.25*k,0.5)),
        [0,1,2].map(k=>P.ident+0.2+0.25*k));if(!R)return;const cx=R.tx+gu_mw(x,GD_COLS[1].s)+30+tw(x,"pseudonymous",28,700)+64;
      gd_flyPin(x,[960,-60],[cx,R.rows[1]],clamp((tt-P.ident+0.1)/0.9,0,1),"a class");gu_filmTag(x,1760,690,"Who may see it",fin(tt,P.ident+0.7,0.5),{align:"right"});}},
    // the tests: who owns each, in dbt_project.yml, and the dimension each kind names where it's defined
    {at:P.test-0.3,place:"desk",keys:[[P.test-0.3,960,520,1]],push:0.02,draw:(x,tt)=>{const R=gd_tests(x,clamp((tt-P.test+0.3)/0.8,0,1),fin(tt,P.tOwner,0.5),
        clamp((tt-P.tOwner)/0.8,0,1),fin(tt,P.tOwner+0.6,0.5));
      if(R)gd_flyPin(x,[960,-60],[R.tx+gu_mw(x,GD_TST[4].s)+26,R.rows[4]],clamp((tt-P.tOwner+0.1)/0.9,0,1),"a rule");
      gu_filmTag(x,1840,470,"Rules that run",fin(tt,P.tOwner+0.9,0.5),{align:"right"});}},
    // the pull request's files: the governance lines in the same change as the code
    {at:P.rev,place:"big",keys:[[P.rev,960,540,1]],push:0.02,draw:(x,tt)=>gd_pr(x,tt,{tab:1,lit:fin(tt,P.with,0.6)})}],sc.dur));});

// ---- 3 · Who may build on what: groups and access, a site plan of the project, a ref stopped at the fence, Jun's table that builds ----
scene("access",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({grp:wAt(sc,"groups","Groups"),acc:wAt(sc,"groups","access"),plan:c.private-0.4,
    privS:c.private,pub:wAt(sc,"public","public"),prot:wAt(sc,"public","protected"),priv2:wAt(sc,"stops","a private one"),dbt:wAt(sc,"stops","dbt stops"),
    jun:wAt(sc,"builds","new table"),only:wAt(sc,"builds","only public"),read:wAt(sc,"read","who may read"),next:wAt(sc,"read","the next film")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the desk: the groups, each with its owner, and each layer's access
    {at:0,place:"desk",keys:[[0,960,520,1]],push:0.02,draw:(x,tt)=>gd_accessFiles(x,{g:fin(tt,P.grp,0.5),priv:fin(tt,P.acc,0.5),pub:fin(tt,P.acc+0.3,0.5),prot:fin(tt,P.acc+0.6,0.5)})},
    // the board: the project as a site plan; a sketch reaching for a private step, stopped; Jun's table, built on the core; a key, stopped
    {at:P.plan,place:"board",keys:[[P.plan,960,490,1.02],[P.read-0.3,1100,500,1.1]],d:1.6,draw:(x,tt)=>gd_site(x,tt,{priv:clamp((tt-P.privS-0.1)/1.4,0,1),
      pub:clamp((tt-P.pub+0.1)/0.9,0,1),prot:clamp((tt-P.prot+0.1)/1.0,0,1),try:clamp((tt-P.priv2+0.2)/1.2,0,1),stop:clamp((tt-P.dbt)/0.5,0,1),
      err:clamp((tt-P.dbt-0.1)/1.6,0,1),jun:fin(tt,P.jun-0.3,0.6),refs:clamp((tt-P.only+0.1)/0.9,0,1),sql:clamp((tt-P.only)/1.0,0,1),
      key:clamp((tt-P.read+0.2)/1.4,0,1.5),nextAt:P.next})}],sc.dur));});

// ---- 4 · A promise the build keeps: a contract, a mismatch that stops a build, two versions side by side, and exposures ----
scene("contract",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({con:wAt(sc,"contract","a contract"),cols:wAt(sc,"contract","these columns"),
    types:wAt(sc,"contract","these types"),mis:c.mismatch-0.4,checks:wAt(sc,"mismatch","checks it"),mism:wAt(sc,"mismatch","a mismatch"),stops:wAt(sc,"mismatch","stops the table"),
    ver:c.version-0.4,verS:c.version,newv:wAt(sc,"version","a new version"),old:wAt(sc,"version","the old one"),dateTo:wAt(sc,"version","a date to go"),
    date:wAt(sc,"date","goes on",0.3),exp:c.exposures-0.4,uses:wAt(sc,"exposures","who uses"),answers:wAt(sc,"exposures","who answers")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the desk: the near-award table's columns and types, and the setting that enforces its contract, with Yusuf's pin
    {at:0,place:"desk",keys:[[0,960,520,1]],push:0.02,draw:(x,tt)=>{gd_contract(x,{mart:clamp((tt-0.3)/0.9,0,1),on:fin(tt,P.con,0.5),cols:fin(tt,P.cols,0.5),types:fin(tt,P.types,0.5)});
      gd_flyPin(x,[960,-60],[1180+GU_F.gut+gu_mw(x,"      +contract:")+26,110+GU_F.top+3*GU_F.lh-10],clamp((tt-P.con+0.1)/0.9,0,1),"a contract");}},
    // one line of its SQL changes, and dbt's answer: the contract failed; the table isn't replaced
    {at:P.mis,place:"desk",keys:[[P.mis,960,520,1]],push:0.02,draw:(x,tt)=>gd_mismatch(x,tt,{ch:clamp((tt-P.checks)/0.8,0,1),err:clamp((tt-P.mism)/1.4,0,1),
      rows:fin(tt,P.mism+1.4,0.5),staysAt:P.stops+0.3})},
    // the board: version 2 and its readers, version 1 beside it with its date to go, and Yusuf's pin
    {at:P.ver,place:"board",keys:[[P.ver,960,500,1.02]],push:0.02,draw:(x,tt)=>{gd_versions(x,tt,{rd:clamp((tt-P.verS-0.1)/1.0,0,1),v2:fin(tt,P.newv-0.1,0.6),
      v1:fin(tt,P.old-0.1,0.6),date:fin(tt,P.dateTo,0.5),ring:clamp((tt-P.date)/0.9,0,1)});
      gd_flyPin(x,[960,-60],[1030+gu_mw(x,"core_credential_v1")+40,258],clamp((tt-P.dateTo)/0.9,0,1),"a version");}},
    // the desk: three exposures, who uses each table and who answers for each use
    {at:P.exp,place:"desk",keys:[[P.exp,960,480,1]],push:0.02,draw:(x,tt)=>gd_exposures(x,{at:[0,1,2].map(i=>clamp((tt-P.exp-0.1-0.35*i)/0.7,0,1)),
      use:fin(tt,P.uses,0.5),own:fin(tt,P.answers,0.5)})}],sc.dur));});

// ---- 5 · What this change touches: the impact report on Jun's pull request; Tuesday's relabel, Mei's "breaks", the column instead,
// and a rename that fails ----
scene("impact",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({tch:c.touches,tue:c.tuesday-0.3,six:wAt(sc,"tuesday","or more as awards"),
    rep:c.report-0.4,wrote:wAt(sc,"report","wrote it"),five:wAt(sc,"report","five reports"),four:wAt(sc,"report","four owners"),mei:wAt(sc,"mei","Mei"),
    breaks:wAt(sc,"mei","breaks"),col:c.column-0.4,counts:wAt(sc,"column","counts as an award"),add:c.additive-0.4,addv:wAt(sc,"additive","additive"),
    three:wAt(sc,"additive","three owners"),ren:c.renamed-0.4,fail:wAt(sc,"renamed","would fail")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // Jun's pull request: its description, written by the impact check
    {at:0,place:"big",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{gd_prHead(x,{});gd_report(x,tt,GD_R0,GD_R0.map((_,i)=>P.tch+0.3+0.15*i),{h:330});}},
    // Tuesday: the first draft's change, in the files
    {at:P.tue,place:"big",keys:[[P.tue,960,548,1.04]],push:0.02,draw:(x,tt)=>{gd_tues(x,1,1);gd_relabel(x,fin(tt,P.six,0.5));}},
    // its description: the report fills in, five who use it and four owners to ask; Mei's stamp beside it
    {at:P.rep,place:"big",keys:[[P.rep,960,540,1]],push:0.02,draw:(x,tt)=>{gd_tues(x,0,1);
      // the check writes its report as it's said; then the five who use it light in turn, and the four owners to ask
      gd_report(x,tt,GD_R1,[P.rep+0.5,P.rep+0.65,P.wrote+0.2,P.wrote+0.45,P.wrote+0.7,P.wrote+0.95,P.wrote+1.2,P.wrote+1.45,P.wrote+1.7,P.wrote+1.9],
        {h:484,lit:[0,0,0,...[0,1,2,3,4].map(k=>0.45*fin(tt,P.five+0.18*k,0.35)),0,fin(tt,P.four,0.4)]});
      gv_stamp(x,1500,520,"breaks",fin(tt,P.breaks-0.1,0.45),{col:GV.goldInk,size:52,rot:-0.08});gu_nameCard(x,1320,640,"Mei Tanaka","registrar's office",fin(tt,P.mei-0.1,0.5));}},
    // the second draft: a column added to version 2, its SQL and its YAML
    {at:P.col,place:"big",keys:[[P.col,960,548,1.04]],push:0.02,draw:(x,tt)=>{gd_tues(x,1,5);gd_column(x,{lit:fin(tt,P.counts,0.5),cls:fin(tt,P.counts+0.6,0.5)});}},
    // the report again: additive, and three owners to tell
    {at:P.add,place:"big",keys:[[P.add,960,540,1]],push:0.02,draw:(x,tt)=>{gd_tues(x,0,5);
      gd_report(x,tt,GD_R2,null,{h:470,lit:[0,0,0,fin(tt,P.addv,0.5),0,0,0,0,0,fin(tt,P.three,0.4)]});}},
    // a sketch: the column renamed; the report calls it breaking, and the impact check fails
    {at:P.ren,place:"big",keys:[[P.ren,960,540,1]],push:0.02,draw:(x,tt)=>{gd_tues(x,0,5);const f=fin(tt,P.fail,0.3);
      gd_report(x,tt,GD_R3,null,{h:290,lit:[0,0,0,f,f]});
      gu_checks(x,150,640,1620,{h:200,items:[{name:"impact",st:f>0.5?"fail":"run"}],t:tt,summary:false,msgGap:70,
        msg:[{s:"breaking change to core_credential v2 with no new version",col:GV.redInk,p:clamp((tt-P.fail)/1.0,0,1)}],pop:[f*(1-fin(tt,P.fail+1.2,0.6))]});}}],sc.dur));});

// ---- 6 · Reviews go to the owners: the reviewers file, made from the owners; GitHub asking them; a decision kept as a file ----
scene("owners",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({same:wAt(sc,"made","the same owners"),co:c.script-0.4,writes:wAt(sc,"script","writes"),
    reg:wAt(sc,"script","the registrar's office"),plan:wAt(sc,"script","Planning"),clara:wAt(sc,"script","Clara"),asks:c.asks-0.4,gh:wAt(sc,"asks","asks them"),
    fails:wAt(sc,"asks","a check fails"),behind:wAt(sc,"asks","falls behind"),dec:c.decisions-0.4,files:wAt(sc,"decisions","files too"),
    who:wAt(sc,"decisions","who decided"),when:wAt(sc,"decisions","when"),why:wAt(sc,"decisions","why")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the poster: Yusuf's pins, and the one at review, where an approval enters
    {at:0,place:"poster",keys:[[0,960,470,1.04],[0.2,860,491,1.1]],d:2.6,push:0.01,draw:(x,tt)=>{const [px,py,pw,ph]=GV_PC,[ax,ay]=gu_pinAt(7,px,py,pw,ph);
      gv_halo(x,ax-150,ay-90,300,200,GV.gold,0.9*fin(tt,P.same-0.3,0.6));gu_pins(x,px,py,pw,ph,{});}},
    // the desk: the reviewers file, generated; each line names who reviews a file, joined to the person
    {at:P.co,place:"desk",keys:[[P.co,960,520,1]],push:0.02,draw:(x,tt)=>gd_codeowners(x,{head:fin(tt,P.writes,0.5)*(1-0.6*fin(tt,P.reg,0.5)),
      lit:[fin(tt,P.reg,0.5),fin(tt,P.plan,0.5),fin(tt,P.clara,0.5)],card:[clamp((tt-P.reg)/1.0,0,1),clamp((tt-P.plan)/1.0,0,1),clamp((tt-P.clara)/1.0,0,1)]})},
    // the pull request: its owners asked; the reviewers check fails while the file is behind, then passes
    {at:P.asks,place:"big",keys:[[P.asks,960,540,1],[P.fails-0.3,960,640,1.12]],d:1.6,push:0,draw:(x,tt)=>{const fl=fin(tt,P.fails,0.2),ok=fin(tt,P.behind+1.0,0.3);
      gd_pr(x,tt,{rev:clamp((tt-P.gh+0.2)/0.9,0,1),items:GD_PR.ck.map(n=>({name:n,st:n==="reviewers"&&fl>0.5&&ok<0.5?"fail":"pass"})),
        msg:fl>0&&ok<0.5?[{s:"CODEOWNERS is out of date: run python scripts/generate/codeowners.py",col:GV.redInk,p:clamp((tt-P.fails)/0.9,0,1)}]:null,
        pop:[0,0,0,fl*(1-fin(tt,P.fails+1.2,0.6))+ok*(1-fin(tt,P.behind+2.0,0.6)),0]});}},
    // the desk: a decision as a file, who decided, when and why
    {at:P.dec,place:"desk",keys:[[P.dec,960,480,1]],push:0.02,draw:(x,tt)=>{gd_decision(x,clamp((tt-P.dec-0.2)/0.9,0,1),[fin(tt,P.who,0.5),fin(tt,P.when,0.5),fin(tt,P.why,0.5)]);
      gu_filmTag(x,1600,660,"Who decides",fin(tt,P.who+0.4,0.5),{align:"right"});}}],sc.dur,1));});

// ---- 7 · A check that teaches: what to add and where, the page on how, a rule that warns first, the warnings falling, Anil's column ----
scene("teach",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({what:wAt(sc,"says","what to add"),where:wAt(sc,"says","where"),page:wAt(sc,"says","links a page"),
    who:wAt(sc,"says","who to ask"),warn:c.warns-0.4,warns:wAt(sc,"warns","warns first"),holds:wAt(sc,"holds","what it holds"),dec:wAt(sc,"holds","the first of December"),
    err:wAt(sc,"holds","then an error"),fell:c.fell-0.4,week:wAt(sc,"fell","Week by week"),none:wAt(sc,"fell","to none"),anil:c.anil-0.4,
    showed:wAt(sc,"anil","the check showed"),classify:wAt(sc,"anil","classify it")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the desk: the check's message to Jun, what to add and where, and the page it links, with who to ask
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>{gd_message(x,{what:fin(tt,P.what,0.4),where:fin(tt,P.where,0.4),link:fin(tt,P.page,0.4)});
      gd_howto(x,clamp((tt-P.page)/0.9,0,1),fin(tt,P.who,0.5));}},
    // a new rule's warning, with the day it becomes an error
    {at:P.warn,place:"desk",keys:[[P.warn,960,500,1]],push:0.02,draw:(x,tt)=>{gd_warning(x,clamp((tt-P.warns+0.4)/0.8,0,1),{holds:fin(tt,P.holds,0.4),date:fin(tt,P.dec,0.4),
      err:clamp((tt-P.err)/0.6,0,1)});gd_timeline(x,{a:clamp((tt-P.dec+0.2)/1.0,0,1),date:fin(tt,P.dec+0.3,0.5),err:clamp((tt-P.err)/0.8,0,1)});
      gu_filmTag(x,1820,560,"Teachers of data",fin(tt,P.warns+0.4,0.5),{align:"right"});}},
    // Yusuf's board: the warnings, week by week, down to none
    {at:P.fell,place:"boardGov",keys:[[P.fell,960,470,1.04]],push:0.02,draw:(x,tt)=>gd_chart(x,tt,{at:[0,1,2,3,4].map(i=>clamp((tt-P.week-0.3*i)/0.7,0,1)),
      tick:clamp((tt-P.none)/0.6,0,1)})},
    // the faculty's office: Anil at his desk
    {at:P.anil,place:"faculty",keys:[[P.anil,1000,520,1.2]],push:0.02,draw:(x,tt)=>{gv_behind(x,"anil",GV_FX.seat[0],GV_FX.top,GV_FX.seat[1],{pose:"listen",flip:true,t:tt});
      gd_facDesk(x);}},
    // his screen: the check's message for his new column, his one line, and the check passing
    {at:P.showed-0.3,place:"bigFac",keys:[[P.showed-0.3,960,540,1]],push:0.02,draw:(x,tt)=>gd_anilPR(x,tt,{fail:tt>P.showed,msg:clamp((tt-P.showed)/1.0,0,1),
      lit:fin(tt,P.showed+0.8,0.4),sheet:clamp((tt-P.classify+0.2)/0.7,0,1),typ:clamp((tt-P.classify-0.3)/0.9,0,1),ok:fin(tt,P.classify+1.4,0.3),
      pop:fin(tt,P.classify+1.4,0.3)*(1-fin(tt,P.classify+2.4,0.6))})}],sc.dur));});

// ---- 8 · An agent on every pull request: the skill it follows, its review of Anil's first pull request, the classes it drafted with
// counts, who decides, and the approvals that are people's ----
scene("agent",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({rev:wAt(sc,"reviews","an agent"),skill:wAt(sc,"skill","a skill"),run:wAt(sc,"skill","run the checks"),
    read:wAt(sc,"skill","read what they"),draft:wAt(sc,"skill","draft what's missing"),pr:c.found-0.4,owner:wAt(sc,"found","no owner"),ten:wAt(sc,"found","ten columns"),
    rule:wAt(sc,"found","a rule with no test"),dr:c.drafted-0.4,drS:c.drafted,who:wAt(sc,"drafted","who decides"),
    nv:c.never-0.4,ppl:wAt(sc,"never","People decide")}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // the desk: the skill the team wrote, its steps lit as they're named
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>{gd_skill(x,tt,clamp((tt-0.6)/0.9,0,1),[fin(tt,P.run,0.4),fin(tt,P.read,0.4),fin(tt,P.draft,0.4),0.5*fin(tt,P.rev,0.5)+0.5*fin(tt,P.skill,0.5)]);
      gu_filmTag(x,1840,846,"An agent that checks",fin(tt,P.rev,0.5),{align:"right"});}},
    // Anil's first pull request: the agent's comment, its three findings
    {at:P.pr,place:"big",keys:[[P.pr,960,540,1]],push:0.02,draw:(x,tt)=>gd_agentPR(x,tt,{view:0,f:[fin(tt,P.owner,0.4),fin(tt,P.ten,0.4),fin(tt,P.rule,0.4)]})},
    // the classes it drafted, with counts, never values; and who decides each finding
    {at:P.dr,place:"big",keys:[[P.dr,960,540,1]],push:0.02,draw:(x,tt)=>gd_agentPR(x,tt,{view:1,rows:[0,1,2].map(k=>fin(tt,P.drS+0.1+0.35*k,0.4)),
      who:[0,1,2].map(k=>fin(tt,P.who+0.25*k,0.4))})},
    // the approvals: the agent's comment, with no tick; each person's yes
    {at:P.nv,place:"big",keys:[[P.nv,960,540,1]],push:0.02,draw:(x,tt)=>gd_agentPR(x,tt,{view:2,ag:fin(tt,P.nv+0.1,0.5),
      yes:[0,1,2].map(k=>clamp((tt-P.ppl-0.1-0.35*k)/0.8,0,1))})}],sc.dur,1));});

// ---- 9 · Carried with the code: Jun's table goes in; the project as a home on Noor's map; his line, changed; the pins and their lines;
// the next film; the end card ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=gd_once(sc,"P",()=>({yes:wAt(sc,"goes","Planning's yes"),map:c.home-0.4,
    home:wAt(sc,"home","the home"),h:[wAt(sc,"home","owners"),wAt(sc,"home","classes"),wAt(sc,"home","contracts"),wAt(sc,"home","tests"),wAt(sc,"home","decisions")],
    plat:wAt(sc,"flow","the platform"),cat:wAt(sc,"flow","the catalogue"),room:c.after-0.4,built:wAt(sc,"after","after he's built it"),
    every:wAt(sc,"every","every change"),poster:c.last-0.4,carries:wAt(sc,"last","carries governance"),board:c.breath-0.3,end:c.breath+1.6}));
  gv_shots(ctx,S,t,sc.dur,gd_run([
    // Jun's pull request: every check green, Planning's yes, and then it's merged
    {at:0,place:"big",keys:[[0,960,540,1],[P.yes-0.6,980,480,1.1]],d:1.6,draw:(x,tt)=>gd_pr(x,tt,{state:tt<P.yes+0.7?["Open",GV.green]:["Merged",GV.green],stateA:tt<P.yes+0.7?1:fin(tt,P.yes+0.7,0.35),
      items:GD_PR.ck.map(n=>({name:n,st:"pass"})),rev:1,glow:0.4,appr:fin(tt,P.yes,0.5)})},
    // Noor's map: the project, the home of five things, and their copies flowing one way
    {at:P.map,place:"mapClose",keys:[[P.map,960,470,1],[P.home,1140,560,1.04]],d:1.6,draw:(x,tt)=>gd_homeMap(x,tt,{a:clamp((tt-P.home+0.4)/0.8,0,1),
      home:P.h.map(s=>fin(tt,s-0.1,0.5)),flow:[clamp((tt-P.plat+0.3)/0.9,0,1),clamp((tt-P.cat+0.3)/0.9,0,1)],drift:[fin(tt,P.plat+0.8,0.5),fin(tt,P.cat+0.8,0.5)]})},
    // the room: Jun's line from the start, struck through, and its new words
    {at:P.room,place:"data",keys:[[P.room,1180,560,1.45]],push:0.02,draw:(x,tt)=>{gd_room(x,tt,{jun:{flip:true,expr:"smile"}});const mix=fin(tt,P.every-0.2,0.8);
      gd_bubble(x,1,1,["The rules arrive","after I've built it."],mix,["The rules arrive","with every change."]);gd_bubbleStrike(x,1-mix,1,clamp((tt-P.built)/0.8,0,1));}},
    // the poster: the six pins, and under each, the line that keeps it in the project
    {at:P.poster,place:"poster",keys:[[P.poster,960,470,1.04]],push:0.03,draw:(x,tt)=>{gd_pinCodes(x,clamp((tt-P.carries+0.6)/3.0,0,1));}},
    // the board: the next film's card lifts
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.end+0.8)gu_board(x,{lit:[1],lift:[0,fin(tt,P.board+0.5,1.0)]});}}],sc.dur));
  gv_end(ctx,S,t,P.end,"Governed in dbt","The project carries governance with the code.","Film 1 of 6");});

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

/* ===== The data governance series: what the films need before they start, and the video's finishing pass =====
   Loaded after the engine, so its prepAssets is the one the engine calls: the fonts and the tools' logos, then the paper and the
   pigment's grain of the master data series' watercolour (its wash.js), then each place the film paints (WC_PLACES, in the film's own
   pictures). The rendered video and the checks paint every place before they start; the site's player paints the first, then the
   others one by one while the film plays, so it starts quickly. The same as the master data series' post.js, with the logos, but
   each of the others waits until the page is idle (or a second has passed): back to back, the prologue's 38 places held the
   page for seconds at a time on a slow machine, so a click on "Watch again" landed late and the film had run on.
   Then, for the video only (tools/render.py calls renderAt), motion blur: each video frame is the average of MB moments across a third
   of a frame (a 126-degree shutter), so movement reads as filmed. No glow: it would wash out the paper. No film grain: the paper is
   the grain. */
async function prepAssets(){await fontsReady3();await loadLogos();wc_prep();const ks=typeof WC_PLACES!=="undefined"?Object.keys(WC_PLACES):[];
  if(window.__RENDER__){ks.forEach(gv_place);return;}
  if(ks.length)gv_place(ks[0]);let i=1;const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:1000}):setTimeout(f,60);
  const next=()=>{if(i>=ks.length)return;gv_place(ks[i++]);idle(next);};setTimeout(()=>idle(next),200);}
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
