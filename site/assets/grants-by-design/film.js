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

/* ===== Data protection and privacy: the tools' logos, for the films that show the tools =====
   Added to The Inner Life of Data's logos (logos.js: Databricks and dbt), which a film bundles with this file when its film.json says
   "logos": true; drawn unaltered (never cropped, turned, flipped or recoloured), each with the tool's or service's full name beside it
   (dp_page). GitHub's mark is drawn in white, one of the two colours GitHub's logo guidelines give it; the Azure and Microsoft Entra
   icons are Microsoft's architecture icons, which Microsoft permits in training materials and documentation, from the Azure
   architecture icons (V21) and the Microsoft Entra architecture icons (October 2023), fetched 5 November 2026. NOTICE.md credits
   them: they are trademarks of their owners, not covered by this repository's licences. Only their width and height attributes
   were raised (to 180 or 240 px), so they draw sharp at any size; their drawing is as published. */
Object.assign(LOGO_SRC,{
  // GitHub's mark (the Invertocat), from GitHub's Primer Octicons (mark-github), in white, as GitHub's logo guidelines allow on a dark ground
  github:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0xMC4yMjYgMTcuMjg0Yy0yLjk2NS0uMzYtNS4wNTQtMi40OTMtNS4wNTQtNS4yNTYgMC0xLjEyMy40MDQtMi4zMzYgMS4wNzgtMy4xNDQtLjI5Mi0uNzQxLS4yNDctMi4zMTQuMDktMi45NjUuODk4LS4xMTIgMi4xMTEuMzYgMi44MyAxLjAxLjg1My0uMjY5IDEuNzUyLS40MDQgMi44NTMtLjQwNCAxLjEgMCAxLjk5OS4xMzUgMi44MDcuMzgyLjY5Ni0uNjI5IDEuOTMyLTEuMSAyLjgzLS45ODguMzE1LjYwNi4zNiAyLjE3OS4wNjcgMi45NDIuNzIuODU0IDEuMTAxIDIgMS4xMDEgMy4xNjcgMCAyLjc2My0yLjA4OSA0Ljg1Mi01LjA5OCA1LjIzNC43NjMuNDk0IDEuMjggMS41NzIgMS4yOCAyLjgwN3YyLjMzNmMwIC42NzQuNTYxIDEuMDU2IDEuMjM1Ljc4NiA0LjA2Ni0xLjU1IDcuMjU1LTUuNjE1IDcuMjU1LTEwLjY0NkMyMy41IDYuMTg4IDE4LjMzNCAxIDExLjk3OCAxIDUuNjIgMSAuNSA2LjE4OC41IDEyLjU0NWMwIDQuOTg2IDMuMTY3IDkuMTIgNy40MzUgMTAuNjY5LjYwNi4yMjUgMS4xOS0uMTggMS4xOS0uNzg2VjIwLjYzYTIuOSAyLjkgMCAwIDEtMS4wNzguMjI0Yy0xLjQ4MyAwLTIuMzU5LS44MDgtMi45ODctMi4zMTMtLjI0Ny0uNjA3LS41MTctLjk2Ni0xLjAzNC0xLjAzMy0uMjctLjAyMy0uMzU5LS4xMzUtLjM1OS0uMjcgMC0uMjcuNDUtLjQ3MS44OTgtLjQ3MS42NTIgMCAxLjIxMy40MDQgMS43OTcgMS4yMzUuNDUuNjUxLjkyMS45NDMgMS40ODMuOTQzLjU2MSAwIC45Mi0uMjAyIDEuNDM3LS43MTkuMzgyLS4zODEuNjc0LS43MTguOTQ0LS45NDMiLz48L3N2Zz4=",
  // Microsoft Azure
  azure:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4IDE4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik01LjMzNDkyIDEuMzc0OTFDNS40NDcxNyAxLjA0MjI5IDUuNzU5MDkgMC44MTgzNTkgNi4xMTAxNCAwLjgxODM1OUgxMS4yNUw1LjkxNTEzIDE2LjYyNTVDNS44MDI4NyAxNi45NTgxIDUuNDkwOTUgMTcuMTgyIDUuMTM5OTEgMTcuMTgySDEuMTM5NjhDMC41Nzk5MzYgMTcuMTgyIDAuMTg1NDY2IDE2LjYzMjUgMC4zNjQ0NjEgMTYuMTAyMkw1LjMzNDkyIDEuMzc0OTFaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfNjEwMl8xMzQ0NjkpIiAvPjxwYXRoIGQ9Ik0xMy41NTE3IDExLjQ1NDZINS40NTEyNkM1LjExMDkgMTEuNDU0NiA0Ljk0NjU3IDExLjg3MTUgNS4xOTUzOSAxMi4xMDM3TDEwLjQwMDUgMTYuOTYxOEMxMC41NTIgMTcuMTAzMiAxMC43NTE1IDE3LjE4MTkgMTAuOTU4NyAxNy4xODE5SDE1LjU0NTNMMTMuNTUxNyAxMS40NTQ2WiIgZmlsbD0iIzAwNzhENCIgLz48cGF0aCBkPSJNNi4xMTAxNCAwLjgxODM1OUM1Ljc1OTA5IDAuODE4MzU5IDUuNDQ3MTcgMS4wNDIyOSA1LjMzNDkyIDEuMzc0OTFMMC4zNjQ0NjEgMTYuMTAyMkMwLjE4NTQ2NiAxNi42MzI1IDAuNTc5OTM2IDE3LjE4MiAxLjEzOTY4IDE3LjE4Mkg1LjEzOTkxQzUuNDkwOTUgMTcuMTgyIDUuODAyODcgMTYuOTU4MSA1LjkxNTEzIDE2LjYyNTVMNi45MDMyNyAxMy42OTc2TDEwLjQwMDUgMTYuOTYxN0MxMC41NTIgMTcuMTAzMiAxMC43NTE1IDE3LjE4MTggMTAuOTU4OCAxNy4xODE4SDE1LjU0NTRMMTMuNTUxNyAxMS40NTQ1SDcuNjYwMzJMMTEuMjUgMC44MTgzNTlINi4xMTAxNFoiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl82MTAyXzEzNDQ2OSkiIC8+PHBhdGggZD0iTTEyLjY2NSAxLjM3NDc4QzEyLjU1MjggMS4wNDIxNyAxMi4yNDA5IDAuODE4MjM3IDExLjg4OTggMC44MTgyMzdINi4xMzYyOUg2LjE2MjU0QzYuNTEzNTggMC44MTgyMzcgNi44MjU1MSAxLjA0MjE3IDYuOTM3NzYgMS4zNzQ3OEwxMS45MDgyIDE2LjEwMjFDMTIuMDg3MiAxNi42MzI0IDExLjY5MjcgMTcuMTgxOSAxMS4xMzMgMTcuMTgxOUgxMS4wNDU0SDE2Ljg2MDNDMTcuNDIgMTcuMTgxOSAxNy44MTQ1IDE2LjYzMjQgMTcuNjM1NSAxNi4xMDIxTDEyLjY2NSAxLjM3NDc4WiIgZmlsbD0idXJsKCNwYWludDJfbGluZWFyXzYxMDJfMTM0NDY5KSIgLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNjEwMl8xMzQ0NjkiIHgxPSI2LjA3NTEyIiB5MT0iMS4zODQ3NiIgeDI9IjAuNzM4MTc4IiB5Mj0iMTcuMTUxNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMxMTRBOEIiIC8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDY2OUJDIiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzYxMDJfMTM0NDY5IiB4MT0iMTAuMzQwMiIgeTE9IjExLjQ1NjQiIHgyPSI5LjEwNyIgeTI9IjExLjg3MzQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLW9wYWNpdHk9IjAuMyIgLz48c3RvcCBvZmZzZXQ9IjAuMDcxMTc2OCIgc3RvcC1vcGFjaXR5PSIwLjIiIC8+PHN0b3Agb2Zmc2V0PSIwLjMyMTAzMSIgc3RvcC1vcGFjaXR5PSIwLjEiIC8+PHN0b3Agb2Zmc2V0PSIwLjYyMzA1MyIgc3RvcC1vcGFjaXR5PSIwLjA1IiAvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1vcGFjaXR5PSIwIiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDJfbGluZWFyXzYxMDJfMTM0NDY5IiB4MT0iOS40NTg1OCIgeTE9IjEuMzg0NjciIHgyPSIxNS4zMTY4IiB5Mj0iMTYuOTkyNiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMzQ0NCRjQiIC8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMjg5MkRGIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==",
  // Microsoft Entra ID
  entra:"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0idXVpZC1mOGQ0ZDM5Mi03YzEyLTRiZDktYmFmZi02NmZiZjc4MTRiOTEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICA8cGF0aCBkPSJtMy44MDIsMTQuMDMyYy4zODguMjQyLDEuMDMzLjUxMSwxLjcxNS41MTEuNjIxLDAsMS4xOTgtLjE4LDEuNjc2LS40ODcsMCwwLC4wMDEsMCwuMDAyLS4wMDFsMS44MDUtMS4xMjh2NC4wNzNjLS4yODYsMC0uNTc0LS4wNzgtLjgyNC0uMjM0bC00LjM3NC0yLjczNFoiIGZpbGw9IiMyMjUwODYiLz4KICA8cGF0aCBkPSJtNy44NTMsMS41MDdMLjM1Myw5Ljk2N2MtLjU3OS42NTQtLjQyOCwxLjY0Mi4zMjMsMi4xMTEsMCwwLDIuNzc2LDEuNzM1LDMuMTI2LDEuOTU0LjM4OC4yNDIsMS4wMzMuNTExLDEuNzE1LjUxMS42MjEsMCwxLjE5OC0uMTgsMS42NzYtLjQ4NywwLDAsLjAwMSwwLC4wMDItLjAwMWwxLjgwNS0xLjEyOC00LjM2NC0yLjcyOCw0LjM2NS00LjkyNFYxczAsMCwwLDBjLS40MjQsMC0uODQ3LjE2OS0xLjE0Ny41MDdaIiBmaWxsPSIjNmRmIi8+CiAgPHBvbHlnb24gcG9pbnRzPSI0LjYzNiAxMC4xOTkgNC42ODggMTAuMjMxIDkgMTIuOTI3IDkuMDAxIDEyLjkyNyA5LjAwMSAxMi45MjcgOS4wMDEgNS4yNzYgOSA1LjI3NSA0LjYzNiAxMC4xOTkiIGZpbGw9IiNjYmY4ZmYiLz4KICA8cGF0aCBkPSJtMTcuMzI0LDEyLjA3OGMuNzUxLS40NjkuOTAyLTEuNDU3LjMyMy0yLjExMWwtNC45MjEtNS41NTFjLS4zOTctLjE4NS0uODQyLS4yOTEtMS4zMTMtLjI5MS0uOTI1LDAtMS43NTIuMzk5LTIuMzAyLDEuMDI2bC0uMTA5LjEyM2gwczQuMzY0LDQuOTI0LDQuMzY0LDQuOTI0aDBzMCwwLDAsMGwtNC4zNjUsMi43Mjh2NC4wNzNjLjI4NywwLC41NzMtLjA3OC44MjMtLjIzNGw3LjUtNC42ODhaIiBmaWxsPSIjMDc0NzkzIi8+CiAgPHBhdGggZD0ibTkuMDAxLDF2NC4yNzVzLjEwOS0uMTIzLjEwOS0uMTIzYy41NS0uNjI3LDEuMzc3LTEuMDI2LDIuMzAyLTEuMDI2LjQ3MiwwLC45MTYuMTA3LDEuMzEzLjI5MWwtMi41NzktMi45MDljLS4yOTktLjMzOC0uNzIzLS41MDctMS4xNDYtLjUwN1oiIGZpbGw9IiMwMjk0ZTQiLz4KICA8cG9seWdvbiBwb2ludHM9IjEzLjM2NSAxMC4xOTkgMTMuMzY1IDEwLjE5OSAxMy4zNjUgMTAuMTk5IDkuMDAxIDUuMjc2IDkuMDAxIDEyLjkyNiAxMy4zNjUgMTAuMTk5IiBmaWxsPSIjOTZiY2MyIi8+Cjwvc3ZnPg==",
  // Microsoft Entra Privileged Identity Management
  pim:"data:image/svg+xml;base64,PHN2ZyBpZD0idXVpZC0yNmM4NmU4Yy02YWZkLTQ2OWMtOGViYS1jMDk5ZWRkOGZhNmIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiIHZpZXdCb3g9IjAgMCAxOCAxOCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJ1dWlkLWE5NWY1NDZjLTFiYWItNDVlMy1hOTkyLTMyZTFjY2RmMzIwNyIgeDE9Ii04NSIgeTE9Ijc3Ny41MTYiIHgyPSItODUiIHkyPSI3OTUuNTE2IiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDk0IDc5NS41MTYpIHNjYWxlKDEgLTEpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNzczYWRjIiAvPjxzdG9wIG9mZnNldD0iLjgyIiBzdG9wLWNvbG9yPSIjYTY3YWY0IiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJ1dWlkLWQ0ZmYxOGI0LTVkMTktNGFmZi1hZWQzLTkzNjEwOGE2ZmM5MyIgeDE9IjcuOTk2IiB5MT0iNzc5Ljk2OSIgeDI9IjEyLjkxMSIgeTI9Ijc4NS43MTQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCA3OTEuNTE2KSBzY2FsZSgxIC0xKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzIyNTA4NiIgLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDU1YzUiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9InV1aWQtZmQzYzRlZDAtYTVmZi00M2M0LWIwN2UtYTQzYWE3NzFjY2NiIiB4MT0iOSIgeTE9Ijc3Ny40OTciIHgyPSI5IiB5Mj0iNzkyLjAzNiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDc5MS41MTYpIHNjYWxlKDEgLTEpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNDRkYmY5IiAvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2NiZjhmZiIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0idXVpZC0xYjg2YjYxOC1mZTUyLTRhMWUtYmE1MC1hMWFhZDYwMTQyYzMiIHgxPSI2Ljk3IiB5MT0iNzc5LjE5NiIgeDI9IjYuOTciIHkyPSI3OTEuNzAzIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgNzkxLjUxNikgc2NhbGUoMSAtMSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2ZGYiIC8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDI5NGU0IiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJ1dWlkLWI1MWVmODBkLTJjZmMtNDc4YS1hMzhmLTQ2Yzc0M2JmYjkxZCIgeDE9IjEyLjQ2MyIgeTE9Ijc3Ni41NDYiIHgyPSIxMi40NjMiIHkyPSI3ODguOTA5IiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgNzkxLjUxNikgc2NhbGUoMSAtMSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwNDE2NDIiIC8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDQxNjQyIiBzdG9wLW9wYWNpdHk9Ii4yNSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iOSIgZmlsbD0idXJsKCN1dWlkLWE5NWY1NDZjLTFiYWItNDVlMy1hOTkyLTMyZTFjY2RmMzIwNykiIHN0cm9rZS13aWR0aD0iMCIgLz48Zz48cGF0aCBkPSJtMTUuNjU1LDkuNjY3bC01Ljc3My02LjUxMmMtLjQ2MS0uNTItMS4zMDQtLjUyLTEuNzY2LDBsLTUuNzczLDYuNTEyYy0uNDQ2LjUwMy0uMzI5LDEuMjYzLjI0OSwxLjYyNWw1Ljc3MywzLjYwOWMuMzg1LjI0MS44ODQuMjQxLDEuMjY5LDBsNS43NzMtMy42MDljLjU3OC0uMzYxLjY5NC0xLjEyMi4yNDktMS42MjVoMFoiIGZpbGw9InVybCgjdXVpZC1kNGZmMThiNC01ZDE5LTRhZmYtYWVkMy05MzYxMDhhNmZjOTMpIiBzdHJva2Utd2lkdGg9IjAiIC8+PHBvbHlnb24gcG9pbnRzPSI1LjY0IDkuODQ1IDUuNjggOS44NyA5IDExLjk0NSA5IDExLjk0NSAxMi4zNTkgOS44NDUgMTIuMzYgOS44NDUgMTIuMzU5IDkuODQ1IDkgNi4wNTUgNS42NCA5Ljg0NSIgZmlsbD0idXJsKCN1dWlkLWZkM2M0ZWQwLWE1ZmYtNDNjNC1iMDdlLWE0M2FhNzcxY2NjYikiIHN0cm9rZS13aWR0aD0iMCIgLz48Zz48cGF0aCBkPSJtOS44ODMsMy4xNTRjLS40NjEtLjUyLTEuMzA0LS41Mi0xLjc2NiwwbC01Ljc3Myw2LjUxMmMtLjQ0Ni41MDMtLjMyOSwxLjI2My4yNDksMS42MjUsMCwwLDIuMTM3LDEuMzM2LDIuNDA2LDEuNTA0LjI5OS4xODYuNzk1LjM5MywxLjMyLjM5My40NzgsMCwuOTIxLS4xMzksMS4yOS0uMzc1LDAsMCwwLDAsLjAwMiwwbDEuMzg5LS44NjgtMy4zNTktMi4xLDMuNDQ0LTMuODg1Yy40MjMtLjQ4MywxLjA2LS43OSwxLjc3Mi0uNzkuMzYzLDAsLjcwNi4wODIsMS4wMTIuMjI1bC0xLjk4NS0yLjIzOXYtLjAwMloiIGZpbGw9InVybCgjdXVpZC0xYjg2YjYxOC1mZTUyLTRhMWUtYmE1MC1hMWFhZDYwMTQyYzMpIiBzdHJva2Utd2lkdGg9IjAiIC8+PHBhdGggZD0ibTksMTUuMDgxYy4yMjEsMCwuNDQyLS4wNi42MzQtLjE4bDUuNzczLTMuNjA5Yy41NzgtLjM2MS42OTQtMS4xMjIuMjQ5LTEuNjI1bC01Ljc3My02LjUxMmMtLjIzMS0uMjYtLjU1Ny0uMzktLjg4My0uMzl2MTIuMzE3WiIgZmlsbD0idXJsKCN1dWlkLWI1MWVmODBkLTJjZmMtNDc4YS1hMzhmLTQ2Yzc0M2JmYjkxZCkiIGZpbGwtb3BhY2l0eT0iLjUiIGlzb2xhdGlvbj0iaXNvbGF0ZSIgb3BhY2l0eT0iLjUiIHN0cm9rZS13aWR0aD0iMCIgLz48L2c+PC9nPjwvc3ZnPg==",
  // Managed identities
  managedIdentity:"data:image/svg+xml;base64,PHN2ZyBpZD0idXVpZC1mZGQ3NjgwZS04YWNlLTQ0MWEtOGEzYS03MzQxMGMzYjFmMjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiIHZpZXdCb3g9IjAgMCAxOCAxOCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJ1dWlkLTM4YzA3OTc3LWFiOWEtNDhlYi1hNjY4LWNkYTMxMDJiYmQ4NSIgeDE9IjcuNjk3IiB5MT0iNzc5LjE2OCIgeDI9IjE0LjA4MiIgeTI9Ijc4Ni42MzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCA3OTEuNTE2KSBzY2FsZSgxIC0xKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzIyNTA4NiIgLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDU1YzUiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9InV1aWQtYWVkNGE3YmMtYjM4MC00YzM0LWI4NDEtMmQwZjM0ZDI0ZjE3IiB4MT0iNi4zNjQiIHkxPSI3NzguMTY0IiB4Mj0iNi4zNjQiIHkyPSI3OTQuNDEyIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgNzkxLjUxNikgc2NhbGUoMSAtMSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2ZGYiIC8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDI5NGU0IiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJ1dWlkLWUyYTdiN2YyLWJmMTYtNGE3Ni1iYTI3LTdkMTQ5YWI4YTE5NCIgeDE9IjkuMDAxIiB5MT0iNzc1Ljk1NiIgeDI9IjkuMDAxIiB5Mj0iNzk0Ljg0NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDc5MS41MTYpIHNjYWxlKDEgLTEpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNDRkYmY5IiAvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2NiZjhmZiIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0idXVpZC1jNjdmMzM2NC0wNzFjLTQxZjktYTE3NS1kM2RlMWY4MzdlMGEiIHgxPSIxMy41IiB5MT0iNzc0LjcyMSIgeDI9IjEzLjUiIHkyPSI3OTAuNzgyIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgNzkxLjUxNikgc2NhbGUoMSAtMSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwNDE2NDIiIC8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDQxNjQyIiBzdG9wLW9wYWNpdHk9Ii4yNSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Zz48cGF0aCBkPSJtMTcuNjQ3LDkuOTA2TDEwLjE0NywxLjQ0NWMtLjU5OS0uNjc2LTEuNjk0LS42NzYtMi4yOTQsMEwuMzUzLDkuOTA2Yy0uNTc5LjY1NC0uNDI4LDEuNjQxLjMyMywyLjExMWw3LjQ5OSw0LjY4OGMuNS4zMTMsMS4xNDguMzEzLDEuNjQ4LDBsNy40OTktNC42ODhjLjc1MS0uNDY5LjkwMi0xLjQ1Ny4zMjMtMi4xMTFoMFoiIGZpbGw9InVybCgjdXVpZC0zOGMwNzk3Ny1hYjlhLTQ4ZWItYTY2OC1jZGEzMTAyYmJkODUpIiBzdHJva2Utd2lkdGg9IjAiIC8+PHBhdGggZD0ibTEwLjE0OCwxLjQ0NWMtLjU5OS0uNjc2LTEuNjk0LS42NzYtMi4yOTQsMEwuMzU0LDkuOTA2Yy0uNTc5LjY1NC0uNDI4LDEuNjQxLjMyMywyLjExMSwwLDAsMi43NzYsMS43MzUsMy4xMjYsMS45NTQuMzg4LjI0MiwxLjAzMy41MTEsMS43MTUuNTExLjYyMSwwLDEuMTk3LS4xOCwxLjY3Ni0uNDg3LDAsMCwwLDAsLjAwMi0uMDAxbDEuODA0LTEuMTI4LTQuMzY0LTIuNzI4LDQuNDc0LTUuMDQ3Yy41NS0uNjI3LDEuMzc3LTEuMDI2LDIuMzAyLTEuMDI2LjQ3MiwwLC45MTcuMTA3LDEuMzE0LjI5MmwtMi41NzktMi45MDl2LS4wMDJaIiBmaWxsPSJ1cmwoI3V1aWQtYWVkNGE3YmMtYjM4MC00YzM0LWI4NDEtMmQwZjM0ZDI0ZjE3KSIgc3Ryb2tlLXdpZHRoPSIwIiAvPjxwb2x5Z29uIHBvaW50cz0iNC42MzYgMTAuMTM4IDQuNjg4IDEwLjE3IDkuMDAxIDEyLjg2NiA5LjAwMSAxMi44NjYgMTMuMzY1IDEwLjEzOCAxMy4zNjYgMTAuMTM4IDEzLjM2NSAxMC4xMzggOS4wMDEgNS4yMTQgNC42MzYgMTAuMTM4IiBmaWxsPSJ1cmwoI3V1aWQtZTJhN2I3ZjItYmYxNi00YTc2LWJhMjctN2QxNDlhYjhhMTk0KSIgc3Ryb2tlLXdpZHRoPSIwIiAvPjxwYXRoIGQ9Im05LjAwMSwxNi45MzljLjI4NywwLC41NzQtLjA3OC44MjQtLjIzNGw3LjQ5OS00LjY4OGMuNzUxLS40NjkuOTAyLTEuNDU3LjMyMy0yLjExMUwxMC4xNDgsMS40NDVjLS4zLS4zMzgtLjcyMy0uNTA3LTEuMTQ3LS41MDd2MTYuMDAxWiIgZmlsbD0idXJsKCN1dWlkLWM2N2YzMzY0LTA3MWMtNDFmOS1hMTc1LWQzZGUxZjgzN2UwYSkiIGZpbGwtb3BhY2l0eT0iLjUiIGlzb2xhdGlvbj0iaXNvbGF0ZSIgb3BhY2l0eT0iLjUiIHN0cm9rZS13aWR0aD0iMCIgLz48L2c+PGc+PHBhdGggaWQ9InV1aWQtZjY2NDhkODYtMDQ4YS00ZjQwLWE2ZGYtN2NlMTIwMTE2YTk4IiBkPSJtMTYuNTEyLDEwLjgzMWMuNDY0LS40NTguNDY4LTEuMjA2LjAxLTEuNjctLjAwMy0uMDAzLS4wMDYtLjAwNi0uMDEtLjAxaDBsLTIuMDM1LTIuMDM1Yy0uNDYxLS40NjEtMS4yMDgtLjQ2MS0xLjY2OSwwaDBsLTIuMDM1LDIuMDM1Yy0uNDU2LjQ2Ny0uNDU2LDEuMjEzLDAsMS42NzlsMS43LDEuN2MuMDYxLjA2My4wOTQuMTQ3LjA5Mi4yMzR2My4xNTVjLS4wMDMuMTA4LjA0MS4yMTMuMTIyLjI4NWwuNzczLjc3M2MuMDk1LjEwNC4yNTUuMTEyLjM1OS4wMTcuMDA2LS4wMDUuMDEyLS4wMTEuMDE3LS4wMTdsLjc0My0uNzQzaDBsLjQ0OC0uNDQ4Yy4wNTgtLjA1OS4wNTgtLjE1NCwwLS4yMTRsLS4zMTYtLjMxNWMtLjA2Ny0uMDU5LS4wNzQtLjE2Mi0uMDE0LS4yMy4wMDUtLjAwNS4wMDktLjAxLjAxNC0uMDE0bC4zMTYtLjMxNmMuMDU5LS4wNjMuMDU5LS4xNjEsMC0uMjI0bC0uMzE2LS4zMTZjLS4wNjUtLjA1NC0uMDczLS4xNS0uMDE5LS4yMTUuMDA2LS4wMDcuMDEyLS4wMTMuMDE5LS4wMTlsLjMxNi0uMzI2Yy4wNTgtLjA1OS4wNTgtLjE1NCwwLS4yMTRsLS40NDgtLjQ0OHYtLjE2M2wxLjkzNC0xLjk0NFptLTIuODctMy4yMjZjLjM3MSwwLC42NzIuMzAxLjY3Mi42NzJzLS4zMDEuNjcyLS42NzIuNjcyLS42NzItLjMwMS0uNjcyLS42NzJoMGMwLS4zNzEuMzAxLS42NzIuNjcyLS42NzJaIiBmaWxsPSIjZmZjYTAwIiBzdHJva2Utd2lkdGg9IjAiIC8+PHBhdGggaWQ9InV1aWQtZTE2OTdiZjQtOGU1ZC00ZDYyLTkwYzktNjU2OWQ3OWQ0OTQ0IiBkPSJtMTMuMTMzLDE2LjA0MmgwYy4wNTUuMDU3LjE0NS4wNTguMjAxLjAwMy4wMzEtLjAzLjA0Ny0uMDcyLjA0My0uMTE1di0yLjYwNWMuMDAyLS4wNTEtLjAyMS0uMS0uMDYxLS4xMzJoMGMtLjA2NC0uMDQ1LS4xNTMtLjAzLS4xOTkuMDM0LS4wMi4wMjktLjAyOS4wNjQtLjAyNS4wOTh2Mi41NTVjLS4wMi4wNTgtLjAwNC4xMjIuMDQxLjE2M1oiIGZpbGw9IiNmZjkzMDAiIGlzb2xhdGlvbj0iaXNvbGF0ZSIgb3BhY2l0eT0iLjc1IiBzdHJva2Utd2lkdGg9IjAiIC8+PHJlY3QgaWQ9InV1aWQtYzkzMGQ0YzItOWY0MS00OGM3LWFkZjctYWNiZDczYWY2ZmJmIiB4PSIxMi4wMTQiIHk9IjkuODM0IiB3aWR0aD0iMy4zNDgiIGhlaWdodD0iLjM5NyIgcng9Ii4xODMiIHJ5PSIuMTgzIiBmaWxsPSIjZmY5MzAwIiBpc29sYXRpb249Imlzb2xhdGUiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlLXdpZHRoPSIwIiAvPjxyZWN0IGlkPSJ1dWlkLTc1NWFhYTQ2LThiODktNDVmNS05ZGEwLThhNDI3ODJjNWRkZCIgeD0iMTIuMDE0IiB5PSIxMC40NzUiIHdpZHRoPSIzLjM0OCIgaGVpZ2h0PSIuMzk3IiByeD0iLjE4MyIgcnk9Ii4xODMiIGZpbGw9IiNmZjkzMDAiIGlzb2xhdGlvbj0iaXNvbGF0ZSIgb3BhY2l0eT0iLjc1IiBzdHJva2Utd2lkdGg9IjAiIC8+PC9nPjwvc3ZnPg==",
  // Azure Key Vault
  keyVault:"data:image/svg+xml;base64,PHN2ZyBpZD0iYmM5MzE2OWEtMjRjNC00Njg2LTlmMzctYzdlNGY1M2IzZDM0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMTggMTgiPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iZmIxMTRjOTMtN2MxNi00NTQwLTg5OWEtMDc5NjA0MTYyOWU2IiBjeD0iOSIgY3k9IjkiIHI9IjguNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMC4xOCIgc3RvcC1jb2xvcj0iIzVlYTBlZiIgLz48c3RvcCBvZmZzZXQ9IjAuNTYiIHN0b3AtY29sb3I9IiM1YzlmZWUiIC8+PHN0b3Agb2Zmc2V0PSIwLjY5IiBzdG9wLWNvbG9yPSIjNTU5Y2VkIiAvPjxzdG9wIG9mZnNldD0iMC43OCIgc3RvcC1jb2xvcj0iIzRhOTdlOSIgLz48c3RvcCBvZmZzZXQ9IjAuODYiIHN0b3AtY29sb3I9IiMzOTkwZTQiIC8+PHN0b3Agb2Zmc2V0PSIwLjkzIiBzdG9wLWNvbG9yPSIjMjM4N2RlIiAvPjxzdG9wIG9mZnNldD0iMC45OSIgc3RvcC1jb2xvcj0iIzA4N2JkNiIgLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDc4ZDQiIC8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImVjNDc4YmQzLTViMzgtNGU3Zi1iNjYxLTExZjM1NTU3OGJmZiIgY3g9IjM4Ljk1IiBjeT0iMTgyLjA3IiByPSI5Ljg4IiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKC0yOC43MSAtMTYzLjI0KSBzY2FsZSgwLjk0IDAuOTQpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwLjI3IiBzdG9wLWNvbG9yPSIjZmZkNzBmIiAvPjxzdG9wIG9mZnNldD0iMC40OSIgc3RvcC1jb2xvcj0iI2ZmY2IxMiIgLz48c3RvcCBvZmZzZXQ9IjAuODgiIHN0b3AtY29sb3I9IiNmZWFjMTkiIC8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmVhMTFiIiAvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjx0aXRsZT5JY29uLXNlY3VyaXR5LTI0NTwvdGl0bGU+PHBhdGggaWQ9ImFhY2Y4MzExLWEzMTctNDAwZi1iNjEzLTc0YmQwMGRhNWNlMyIgZD0iTTksLjVBOC41LDguNSwwLDEsMCwxNy41LDksOC41MSw4LjUxLDAsMCwwLDksLjVaTTksMTYuMzRBNy4zNCw3LjM0LDAsMSwxLDE2LjM0LDksNy4zNCw3LjM0LDAsMCwxLDksMTYuMzRaIiBmaWxsPSJ1cmwoI2ZiMTE0YzkzLTdjMTYtNDU0MC04OTlhLTA3OTYwNDE2MjllNikiIC8+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjcuMzQiIGZpbGw9IiNmZmYiIC8+PGc+PHBhdGggaWQ9ImJkOTgzYzQxLWRiNzMtNDBlYy1hNGY0LWRhMTIxM2ZjOTkyNCIgZD0iTTEzLjQ0LDcuMzNhMS44NCwxLjg0LDAsMCwwLDAtMi41OWgwTDEwLjI5LDEuNThhMS44MywxLjgzLDAsMCwwLTIuNTgsMGgwTDQuNTYsNC43NGExLjg0LDEuODQsMCwwLDAsMCwyLjU5TDcuMTgsMTBhLjUxLjUxLDAsMCwxLC4xNS4zNnY0Ljg4YS42My42MywwLDAsMCwuMTguNDRsMS4yLDEuMmEuNDEuNDEsMCwwLDAsLjU4LDBsMS4xNi0xLjE2aDBsLjY4LS42OGEuMjUuMjUsMCwwLDAsMC0uMzRsLS40OS0uNDlhLjI3LjI3LDAsMCwxLDAtLjM3bC40OS0uNDlhLjI1LjI1LDAsMCwwLDAtLjM0bC0uNDktLjQ5YS4yNy4yNywwLDAsMSwwLS4zN2wuNDktLjQ5YS4yNS4yNSwwLDAsMCwwLS4zNGwtLjY4LS42OXYtLjI1Wk05LDIuMzVBMSwxLDAsMCwxLDksNC40MiwxLDEsMCwxLDEsOSwyLjM1WiIgZmlsbD0idXJsKCNlYzQ3OGJkMy01YjM4LTRlN2YtYjY2MS0xMWYzNTU1NzhiZmYpIiAvPjxwYXRoIGlkPSJhZDJlN2U0NC05YmZkLTQ3NzUtOGJmNC04ZWYyNmE1NDQ5MjEiIGQ9Ik04LjE4LDE1LjNoMGEuMjMuMjMsMCwwLDAsLjM4LS4xN3YtNGEuMjQuMjQsMCwwLDAtLjExLS4yaDBhLjIyLjIyLDAsMCwwLS4zNC4ydjRBLjI4LjI4LDAsMCwwLDguMTgsMTUuM1oiIGZpbGw9IiNmZjkzMDAiIG9wYWNpdHk9IjAuNzUiIC8+PHJlY3QgaWQ9ImE5OTZmYmZmLTM5MzYtNGIyNC1iNDA3LTM2OTMzNmMxNDNiYSIgeD0iNi40OCIgeT0iNS43OSIgd2lkdGg9IjUuMTciIGhlaWdodD0iMC42MSIgcng9IjAuMjgiIGZpbGw9IiNmZjkzMDAiIG9wYWNpdHk9IjAuNzUiIC8+PHJlY3QgaWQ9ImJiMTJkMzFjLTMzNTItNGExOC04N2RkLWExNjlhNGE4NzIxZCIgeD0iNi40OCIgeT0iNi43OCIgd2lkdGg9IjUuMTciIGhlaWdodD0iMC42MSIgcng9IjAuMjgiIGZpbGw9IiNmZjkzMDAiIG9wYWNpdHk9IjAuNzUiIC8+PC9nPjwvc3ZnPg==",
  // Storage accounts
  storage:"data:image/svg+xml;base64,PHN2ZyBpZD0iZjJmMDQzNDktOGFlZS00NDEzLTg0YzktYTkwNTM2MTFiMzE5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMTggMTgiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYWQ0YzRmOTYtMDlhYS00ZjkxLWJhMTAtNWNiOGFkNTMwZjc0IiB4MT0iOSIgeTE9IjE1LjgzIiB4Mj0iOSIgeTI9IjUuNzkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiM2IzYjMiIC8+PHN0b3Agb2Zmc2V0PSIwLjI2IiBzdG9wLWNvbG9yPSIjYzFjMWMxIiAvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2U2ZTZlNiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48dGl0bGU+SWNvbi1zdG9yYWdlLTg2PC90aXRsZT48cGF0aCBkPSJNLjUsNS43OWgxN2EwLDAsMCwwLDEsMCwwdjkuNDhhLjU3LjU3LDAsMCwxLS41Ny41N0gxLjA3YS41Ny41NywwLDAsMS0uNTctLjU3VjUuNzlBMCwwLDAsMCwxLC41LDUuNzlaIiBmaWxsPSJ1cmwoI2FkNGM0Zjk2LTA5YWEtNGY5MS1iYTEwLTVjYjhhZDUzMGY3NCkiIC8+PHBhdGggZD0iTTEuMDcsMi4xN0gxNi45M2EuNTcuNTcsMCwwLDEsLjU3LjU3VjUuNzlhMCwwLDAsMCwxLDAsMEguNWEwLDAsMCwwLDEsMCwwVjIuNzNBLjU3LjU3LDAsMCwxLDEuMDcsMi4xN1oiIGZpbGw9IiMzN2MyYjEiIC8+PHBhdGggZD0iTTIuODEsNi44OUgxNS4xOGEuMjcuMjcsMCwwLDEsLjI2LjI3djEuNGEuMjcuMjcsMCwwLDEtLjI2LjI3SDIuODFhLjI3LjI3LDAsMCwxLS4yNi0uMjdWNy4xNkEuMjcuMjcsMCwwLDEsMi44MSw2Ljg5WiIgZmlsbD0iI2ZmZiIgLz48cGF0aCBkPSJNMi44Miw5LjY4SDE1LjE5YS4yNy4yNywwLDAsMSwuMjYuMjd2MS40MWEuMjcuMjcsMCwwLDEtLjI2LjI3SDIuODJhLjI3LjI3LDAsMCwxLS4yNi0uMjdWMTBBLjI3LjI3LDAsMCwxLDIuODIsOS42OFoiIGZpbGw9IiMzN2MyYjEiIC8+PHBhdGggZD0iTTIuODIsMTIuNUgxNS4xOWEuMjcuMjcsMCwwLDEsLjI2LjI3djEuNDFhLjI3LjI3LDAsMCwxLS4yNi4yN0gyLjgyYS4yNy4yNywwLDAsMS0uMjYtLjI3VjEyLjc3QS4yNy4yNywwLDAsMSwyLjgyLDEyLjVaIiBmaWxsPSIjMjU4Mjc3IiAvPjwvc3ZnPg==",
  // Private endpoints
  privateEndpoint:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMTggMTgiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZjM4NmJiN2EtYmNiMi00YjY3LWI1YjItMDY4MTk2MThmZjUxIiB4MT0iOS4wODQiIHkxPSI3OTAuOTY3IiB4Mj0iOS4wODQiIHkyPSI3ODcuNDkyIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIC0xLCAwLCA3OTEuNTE2KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzUwZTZmZiIgLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzMmJlZGQiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImE2MmE5Y2FkLWIxNzMtNDc4NS1iYTgxLThlZTMwZDRkYzZlYiIgeDE9IjkuMDY1IiB5MT0iMTMuODQzIiB4Mj0iOS4wNjUiIHkyPSIxMC4zNjgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1ZTk2MjQiIC8+PHN0b3Agb2Zmc2V0PSIwLjE4MyIgc3RvcC1jb2xvcj0iIzYyOWMyNSIgLz48c3RvcCBvZmZzZXQ9IjAuNDM1IiBzdG9wLWNvbG9yPSIjNmRhZTJhIiAvPjxzdG9wIG9mZnNldD0iMC43MjYiIHN0b3AtY29sb3I9IiM3ZmNiMzAiIC8+PHN0b3Agb2Zmc2V0PSIwLjgyMiIgc3RvcC1jb2xvcj0iIzg2ZDYzMyIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBpZD0iYmRjZDcyNjgtMzFmYy00MTYzLTk1NDQtNjUxZDYxZjE0OThlIj48Zz48cGF0aCBkPSJNNy44NSwxMy4zNDJhMS43MzgsMS43MzgsMCwxLDAsMi40MzYtMi40NzksMS43MTUsMS43MTUsMCwwLDAtLjYyNi0uMzg5VjMuMDA5SDguNTQ4djcuNDQ0YTEuNzI5LDEuNzI5LDAsMCwwLS43LDIuODkxWiIgZmlsbD0iI2IzYjNiMyIgLz48Y2lyY2xlIGN4PSI5LjA4NCIgY3k9IjIuMjA5IiByPSIxLjczOCIgZmlsbD0idXJsKCNmMzg2YmI3YS1iY2IyLTRiNjctYjViMi0wNjgxOTYxOGZmNTEpIiAvPjxnPjxwYXRoIGQ9Ik0yLjYzMiwxMC40NDloLjkzN2EuMy4zLDAsMCwxLC4zLjN2Ni45MDlhLjYuNiwwLDAsMS0uNi42SDIuMzMyYTAsMCwwLDAsMSwwLDBWMTAuNzQ5QS4zLjMsMCwwLDEsMi42MzIsMTAuNDQ5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUuNDUyIDIyLjI5Mikgcm90YXRlKDEzNC45MTkpIiBmaWxsPSIjNTBlNmZmIiAvPjxwYXRoIGQ9Ik0yLjU4MSw2LjA5M2guOTM3YS4zLjMsMCwwLDEsLjMuM3Y3LjRhMCwwLDAsMCwxLDAsMEgyLjg4YS42LjYsMCwwLDEtLjYtLjZ2LTYuOEEuMy4zLDAsMCwxLDIuNTgxLDYuMDkzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy45MSAwLjc0OSkgcm90YXRlKDQ0LjkxOSkiIGZpbGw9IiMxNDkwZGYiIC8+PHBhdGggZD0iTTE0LjEzMiwxMC40NDloLjkzN2EuNi42LDAsMCwxLC42LjZ2Ni45MDlhLjMuMywwLDAsMS0uMy4zaC0uOTM3YS4zLjMsMCwwLDEtLjMtLjNWMTAuNDQ5YTAsMCwwLDAsMSwwLDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNC41NDIgLTYuMzMzKSByb3RhdGUoNDUuMDgxKSIgZmlsbD0iIzUwZTZmZiIgLz48cGF0aCBkPSJNMTQuNzgyLDYuMDkzaC45MzdhMCwwLDAsMCwxLDAsMHY3LjRhLjMuMywwLDAsMS0uMy4zaC0uOTM3YS4zLjMsMCwwLDEtLjMtLjN2LTYuOEEuNi42LDAsMCwxLDE0Ljc4Miw2LjA5M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyLjU1OCA2LjQyNCkgcm90YXRlKDEzNS4wODEpIiBmaWxsPSIjMTQ5MGRmIiAvPjwvZz48Y2lyY2xlIGN4PSI5LjA2NSIgY3k9IjEyLjEwNiIgcj0iMS43MzgiIGZpbGw9InVybCgjYTYyYTljYWQtYjE3My00Nzg1LWJhODEtOGVlMzBkNGRjNmViKSIgLz48L2c+PC9nPjwvc3ZnPg==",
  // Groups (Microsoft Entra ID)
  groups:"data:image/svg+xml;base64,PHN2ZyBpZD0iYTVjMmMzNGEtYTVmOS00MDQzLWEwODQtZTUxYjc0NDk3ODk1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMTggMTgiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZjk3MzYwZmEtZmQxMy00MjBiLTliNDMtNzRiOGRkZTgzYTExIiB4MT0iNi43IiB5MT0iNy4yNiIgeDI9IjYuNyIgeTI9IjE4LjM2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwLjIyIiBzdG9wLWNvbG9yPSIjMzJkNGY1IiAvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzE5OGFiMyIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYjJhYjQwNzEtNTI5ZC00NDUwLTk0NDMtZTZkYzA5MzljYzRlIiB4MT0iNi40MiIgeTE9IjEuMzIiIHgyPSI3LjIzIiB5Mj0iMTEuMzkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAuMjIiIHN0b3AtY29sb3I9IiMzMmQ0ZjUiIC8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMTk4YWIzIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjx0aXRsZT5JY29uLWlkZW50aXR5LTIyMzwvdGl0bGU+PHBhdGggZD0iTTE3LjIyLDEzLjkyYS43OS43OSwwLDAsMCwuOC0uNzlBLjI4LjI4LDAsMCwwLDE4LDEzYy0uMzEtMi41LTEuNzQtNC41NC00LjQ2LTQuNTRTOS4zNSwxMC4yMiw5LjA3LDEzYS44MS44MSwwLDAsMCwuNzIuODhoNy40M1oiIGZpbGw9IiMwMDc4ZDQiIC8+PHBhdGggZD0iTTEzLjU1LDkuMDlhMi40NCwyLjQ0LDAsMCwxLTEuMzYtLjRsMS4zNSwzLjUyLDEuMzMtMy40OUEyLjU0LDIuNTQsMCwwLDEsMTMuNTUsOS4wOVoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuOCIgLz48Y2lyY2xlIGN4PSIxMy41NSIgY3k9IjYuNTgiIHI9IjIuNTEiIGZpbGw9IiMwMDc4ZDQiIC8+PHBhdGggZD0iTTEyLjE5LDE2LjM2YTEuMTksMS4xOSwwLDAsMCwxLjE5LTEuMTkuNjYuNjYsMCwwLDAsMC0uMTRjLS40Ny0zLjc0LTIuNi02Ljc4LTYuNjYtNi43OFMuNDQsMTAuODMsMCwxNWExLjIsMS4yLDAsMCwwLDEuMDcsMS4zMWgxMS4xWiIgZmlsbD0idXJsKCNmOTczNjBmYS1mZDEzLTQyMGItOWI0My03NGI4ZGRlODNhMTEpIiAvPjxwYXRoIGQ9Ik02Ljc3LDkuMTRhMy43MiwzLjcyLDAsMCwxLTItLjZsMiw1LjI1LDItNS4yMUEzLjgxLDMuODEsMCwwLDEsNi43Nyw5LjE0WiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44IiAvPjxjaXJjbGUgY3g9IjYuNzQiIGN5PSI1LjM5IiByPSIzLjc1IiBmaWxsPSJ1cmwoI2IyYWI0MDcxLTUyOWQtNDQ1MC05NDQzLWU2ZGMwOTM5Y2M0ZSkiIC8+PC9zdmc+",
  // Users (Microsoft Entra ID)
  users:"data:image/svg+xml;base64,PHN2ZyBpZD0iZTI0NjcxZjYtZjUwMS00OTUyLWEyZGItOGIwYjFkMzI5YzE3IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMTggMTgiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYmU5MjkwMWItZWMzMy00YzY1LWFkZjEtOWIwZWVkMDZkNjc3IiB4MT0iOSIgeTE9IjYuODgiIHgyPSI5IiB5Mj0iMjAuNDUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAuMjIiIHN0b3AtY29sb3I9IiMzMmQ0ZjUiIC8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMTk4YWIzIiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiNDZmYzI0Ni0yNWQ4LTQzOTgtODc3OS0xMDQyZThjYWNhZTciIHgxPSI4LjYxIiB5MT0iLTAuNCIgeDI9IjkuNiIgeTI9IjExLjkyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwLjIyIiBzdG9wLWNvbG9yPSIjMzJkNGY1IiAvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzE5OGFiMyIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48dGl0bGU+SWNvbi1pZGVudGl0eS0yMzA8L3RpdGxlPjxwYXRoIGQ9Ik0xNS43MiwxOGExLjQ1LDEuNDUsMCwwLDAsMS40NS0xLjQ1LjQ3LjQ3LDAsMCwwLDAtLjE3QzE2LjU5LDExLjgxLDE0LDguMDksOSw4LjA5UzEuMzQsMTEuMjQuODMsMTYuMzlBMS40NiwxLjQ2LDAsMCwwLDIuMTQsMThIMTUuNzJaIiBmaWxsPSJ1cmwoI2JlOTI5MDFiLWVjMzMtNGM2NS1hZGYxLTliMGVlZDA2ZDY3NykiIC8+PHBhdGggZD0iTTksOS4xN2E0LjU5LDQuNTksMCwwLDEtMi40OC0uNzNMOSwxNC44NmwyLjQ0LTYuMzhBNC41Myw0LjUzLDAsMCwxLDksOS4xN1oiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuOCIgLz48Y2lyY2xlIGN4PSI5LjAxIiBjeT0iNC41OCIgcj0iNC41OCIgZmlsbD0idXJsKCNiNDZmYzI0Ni0yNWQ4LTQzOTgtODc3OS0xMDQyZThjYWNhZTcpIiAvPjwvc3ZnPg=="
});

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

// Grants by design, the fourth film of Only what you may see, the second series of Data protection and privacy. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers, dates and the platform's words). The few longer stops are in breath.js.
const NARR={
"islands":{"name":"The plan for the islands","lead":1.6,"tail":1.0,"vo":[
 {"id":"place","gap":0.8,"text":"The Galápagos, in the late 1960s.","say":"The Galápagos, in the late nineteen sixties."},
 {"id":"far","gap":0.8,"text":"Volcanic islands, about a thousand kilometres west of Ecuador, whose animals don't fear people."},
 {"id":"boats","gap":0.8,"text":"Now boats bring visitors, more each year."},
 {"id":"fear","gap":0.8,"text":"Scientists and guides fear what all those feet will do."},
 {"id":"anywhere","gap":0.8,"text":"Visitors could walk anywhere, a step from nesting birds, iguanas and sea lions."},
 {"id":"harm","gap":0.8,"text":"Nests could be trampled and the lava worn down, and coral is already being carried off."},
 {"id":"lost","gap":0.8,"text":"Birds could leave for good, and many of the islands' animals live nowhere else."},
 {"id":"change","gap":0.8,"text":"Something has to change, before visitors come in thousands."},
 {"id":"plan","gap":0.8,"text":"So the national park, on the Darwin Research Station's advice, plans the visits once, for the whole park."},
 {"id":"most","gap":0.8,"text":"Most of the park gets no visitors at all."},
 {"id":"sites","gap":0.8,"text":"A few sites near the coast are open, each along its own marked trail."},
 {"id":"guide","gap":0.8,"text":"Every group walks with a trained guide."},
 {"id":"rules","gap":0.8,"text":"And the rules are the same for everyone: keep to the trail; touch nothing, feed nothing, take nothing."},
 {"id":"fits","gap":0.8,"text":"A new boat, a new guide, a new visitor: each fits the plan the day they arrive."},
 {"id":"held","gap":0.8,"text":"In 1982, twenty-five thousand people visit, and the sites they walk are near pristine.","say":"In nineteen eighty-two, twenty-five thousand people visit, and the sites they walk are near pristine."},
 {"id":"flamingos","gap":0.8,"text":"Flamingos have nested again beside a visited lagoon, for the first time in fourteen years."},
 {"id":"now","gap":0.8,"text":"In 2025, 290,404 people came, still on the trails, still with a guide.","say":"In twenty twenty-five, two hundred and ninety thousand, four hundred and four people came, still on the trails, still with a guide."},
 {"id":"too","gap":0.8,"text":"A university's data has visitors too."},
 {"id":"opened","gap":0.8,"text":"Opened one table at a time, some wait for what they need, and some reach what they shouldn't."},
 {"id":"so","gap":0.8,"text":"So, as on the islands, its grants are designed once, by area and role."},
 {"id":"fitsdata","gap":0.8,"text":"Every person and every new table fits the plan from its first day."}
]},
"one":{"name":"One table at a time","lead":0.8,"tail":1.0,"vo":[
 {"id":"platform","gap":0.8,"text":"At the university, the data platform keeps each area's records in Unity Catalog."},
 {"id":"giuc","gap":0.8,"text":"In Governed in Unity Catalog, every table sat in one catalog, and its readers were groups."},
 {"id":"hand","gap":0.8,"text":"But each grant was made by hand, on one table, when someone asked."},
 {"id":"count","gap":0.8,"text":"Fifty-eight tables, a hundred and sixty-three grants, each made on its own."},
 {"id":"wait","gap":0.8,"text":"A new table waited six days, on average, for its first reader."},
 {"id":"owned","gap":0.8,"text":"And whoever made a table owned it: nine belonged to a person, and two of those people had left."},
 {"id":"say","gap":0.8,"text":"To say who could read what, someone had to read every grant."},
 {"id":"move","gap":0.8,"text":"Now each area has a catalog of its own, and the registrar's tables are moving into theirs."},
 {"id":"mei","gap":0.8,"text":"Mei Tanaka owns them, for the registrar's office, and asks for a plan before a single grant."}
]},
"doors":{"name":"Three doors to a table","lead":0.8,"tail":1.0,"vo":[
 {"id":"levels","gap":0.8,"text":"In Unity Catalog, a table sits in a schema, and a schema in a catalog."},
 {"id":"room","gap":0.8,"text":"Think of the catalog as a room, and each schema as a shelf in it."},
 {"id":"three","gap":0.8,"text":"To read a table, a group needs three rights: into the room, onto the shelf, and into the table."},
 {"id":"names","gap":0.8,"text":"USE CATALOG, USE SCHEMA and SELECT.","say":"Use catalog, use schema, and select."},
 {"id":"trail","gap":0.8,"text":"Like a landing, a trail and a site: all three, or none."},
 {"id":"alone","gap":0.8,"text":"SELECT on a table, without the first two, opens nothing.","say":"Select on a table, without the first two, opens nothing."},
 {"id":"browse","gap":0.8,"text":"One more right lets everyone look without reading: BROWSE.","say":"One more right lets everyone look without reading: browse."},
 {"id":"find","gap":0.8,"text":"With it, anyone can find a table, see what it holds and who owns it, and ask for it."}
]},
"shelves":{"name":"Shelves by who reads them","lead":0.8,"tail":1.0,"vo":[
 {"id":"start","gap":0.8,"text":"So the plan starts from who reads what, as the islands' plan started from where people may walk."},
 {"id":"same","gap":0.8,"text":"Every area's catalog gets the same shelves, one for each set of readers."},
 {"id":"build","gap":0.8,"text":"Staging and intermediate hold the build's own steps, and nobody reads them."},
 {"id":"core","gap":0.8,"text":"Core holds the area's records; reference, the lists they use; published, totals for everyone."},
 {"id":"support","gap":0.8,"text":"And the registrar's catalog has one more: support, for the exam support only a few may see."},
 {"id":"groups","gap":0.8,"text":"Then each shelf gets its readers, always a group, never a person."},
 {"id":"office","gap":0.8,"text":"The registrar's office reads core and reference; the few who arrange exam support read support."},
 {"id":"desk","gap":0.8,"text":"The help desk and Planning read core, and the policies decide what each of them sees."},
 {"id":"team","gap":0.8,"text":"The data team builds in development, on made-up records, so here it holds nothing of its own."},
 {"id":"rule","gap":0.8,"text":"A grant goes on a catalog or a shelf, never on one table."},
 {"id":"another","gap":0.8,"text":"A table that needs other readers belongs on another shelf."}
]},
"tomorrow":{"name":"A table built tomorrow","lead":0.8,"tail":1.0,"vo":[
 {"id":"reach","gap":0.8,"text":"A grant on a shelf reaches every table on it: those there today, and every one made later."},
 {"id":"version","gap":0.8,"text":"When a new version of the credential table arrives, the readers of core read it from its first minute."},
 {"id":"asks","gap":0.8,"text":"Nobody asks, and nobody grants."},
 {"id":"exam","gap":0.8,"text":"When the exam support table arrives, it goes on its own shelf, and only those who arrange exam support can read it."},
 {"id":"never","gap":0.8,"text":"The help desk, Planning and the study read core, so none of them ever sees it."},
 {"id":"boat","gap":0.8,"text":"Like a new boat at the islands, it keeps the plan from the day it arrives."}
]},
"owners":{"name":"Owners who don't leave","lead":0.8,"tail":1.0,"vo":[
 {"id":"any","gap":0.8,"text":"Every catalog, shelf and table has an owner, and the owner can do anything with it, even let anyone read it."},
 {"id":"first","gap":0.8,"text":"Whoever makes it is its first owner."},
 {"id":"group","gap":0.8,"text":"So the registrar's catalog, and everything in it, is handed to a group: registrar owners."},
 {"id":"member","gap":0.8,"text":"No person is in it, only registrar-loader, the identity that builds the tables and deploys the plan.","say":"No person is in it, only registrar loader, the identity that builds the tables and deploys the plan."},
 {"id":"leaves","gap":0.8,"text":"When someone leaves, no table is left without its owner, and no one person can open one up."},
 {"id":"decides","gap":0.8,"text":"Mei still decides who may see the records: she owns them, for the registrar's office."},
 {"id":"kinds","gap":0.8,"text":"Two kinds of owner: Mei says who may see them, and the group is who may change them."}
]},
"where":{"name":"Where it can be read from","lead":0.8,"tail":1.0,"vo":[
 {"id":"bound","gap":0.8,"text":"In Network, storage and keys, each catalog was bound to its own workspace, so a grant isn't enough from anywhere else."},
 {"id":"study","gap":0.8,"text":"Anil Kurian's study works in a workspace of its own, studies, where nothing can be downloaded or copied out."},
 {"id":"readonly","gap":0.8,"text":"The registrar's catalog is bound there too, but read only."},
 {"id":"write","gap":0.8,"text":"From there, the study reads the learner table, as far as its grants allow, and can never write to it, whatever a grant says."},
 {"id":"space","gap":0.8,"text":"What it makes goes in its own space, health progress, made for its agreement and deleted when the agreement ends."},
 {"id":"look","gap":0.8,"text":"Look, don't touch, as on the islands' trails."}
]},
"code":{"name":"Written once, kept as code","lead":0.8,"tail":1.0,"vo":[
 {"id":"files","gap":0.8,"text":"The plan is written once, as two files beside the job's code in GitHub."},
 {"id":"lines","gap":0.8,"text":"Each shelf and its readers take a few lines."},
 {"id":"yes","gap":0.8,"text":"The data team reviews each change to those files, and Mei is told what it touches."},
 {"id":"contract","gap":0.8,"text":"A study's grant is made from its agreement's contract, and names it: 2026-14, until 30 June 2027.","say":"A study's grant is made from its agreement's contract, and names it: agreement twenty twenty-six fourteen, until the thirtieth of June, twenty twenty-seven."},
 {"id":"after","gap":0.8,"text":"The study's policies go in first, and its grant after them, so it never reads the table unmasked."},
 {"id":"path","gap":0.8,"text":"Then the path of From a branch to production: test first, then production, once a release approver says yes."},
 {"id":"byhand","gap":0.8,"text":"And nobody can grant by hand: only the owners' group can, and its one member deploys only from main."},
 {"id":"admin","gap":0.8,"text":"Anything else takes an admin account, switched on, approved and recorded."}
]},
"back":{"name":"Back to the islands","lead":0.8,"tail":1.0,"vo":[
 {"id":"islands","gap":0.8,"text":"On the islands, the plan came first, and every visitor since has walked inside it."},
 {"id":"here","gap":0.8,"text":"At the university, the plan comes first too."},
 {"id":"who","gap":0.8,"text":"The registrar's office reads its records; the study, only what its agreement allows; everyone else can find what exists, and ask."},
 {"id":"every","gap":0.8,"text":"Every new table, and every new person, fits the plan from its first day."},
 {"id":"idea","gap":0.8,"text":"Design the grants once, by area and role."}
]}
};

const VODUR={"islands/place": 2.588, "islands/far": 6.032, "islands/boats": 2.304, "islands/fear": 2.957, "islands/anywhere": 4.956, "islands/harm": 4.865, "islands/lost": 4.309, "islands/change": 3.254, "islands/plan": 6.236, "islands/most": 2.442, "islands/sites": 3.843, "islands/guide": 1.935, "islands/rules": 5.679, "islands/fits": 4.861, "islands/held": 5.898, "islands/flamingos": 5.315, "islands/now": 7.39, "islands/too": 2.327, "islands/opened": 5.219, "islands/so": 4.45, "islands/fitsdata": 3.913, "one/platform": 5.256, "one/giuc": 5.82, "one/hand": 3.905, "one/count": 4.258, "one/wait": 3.518, "one/owned": 5.44, "one/say": 3.156, "one/move": 5.516, "one/mei": 5.646, "doors/levels": 4.468, "doors/room": 3.57, "doors/three": 5.28, "doors/names": 2.235, "doors/trail": 3.306, "doors/alone": 3.157, "doors/browse": 3.273, "doors/find": 4.574, "shelves/start": 5.406, "shelves/same": 4.331, "shelves/build": 4.302, "shelves/core": 5.636, "shelves/support": 5.839, "shelves/groups": 3.75, "shelves/office": 6.032, "shelves/desk": 4.865, "shelves/team": 5.461, "shelves/rule": 3.539, "shelves/another": 3.381, "tomorrow/reach": 5.282, "tomorrow/version": 5.531, "tomorrow/asks": 2.108, "tomorrow/exam": 7.032, "tomorrow/never": 4.242, "tomorrow/boat": 3.921, "owners/any": 6.414, "owners/first": 1.837, "owners/group": 5.611, "owners/member": 6.476, "owners/leaves": 5.285, "owners/decides": 4.98, "owners/kinds": 4.622, "where/bound": 7.155, "where/study": 6.696, "where/readonly": 3.395, "where/write": 7.139, "where/space": 6.221, "where/look": 2.424, "code/files": 4.336, "code/lines": 2.351, "code/yes": 4.752, "code/contract": 9.56, "code/after": 5.887, "code/path": 6.468, "code/byhand": 6.211, "code/admin": 4.283, "back/islands": 4.807, "back/here": 2.575, "back/who": 8.105, "back/every": 4.201, "back/idea": 2.381};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card after the opening, and the end card. */
const BREATH={
"islands":{"hold":{"place":0.8,"far":0.8,"boats":0.8,"fear":0.4,"anywhere":0.8,"harm":1.0,"lost":0.8,"change":1.2,"plan":0.8,"most":0.8,"sites":0.6,"guide":0.6,"rules":1.0,"fits":1.0,"held":0.8,"flamingos":1.0,"now":1.0,"too":0.4,"opened":0.8,"so":0.6,"fitsdata":0.4},"breathe":4.4},
"one":{"hold":{"platform":0.4,"giuc":0.6,"hand":1.0,"count":1.0,"wait":1.2,"owned":1.0,"say":1.4,"move":0.6,"mei":0.8}},
"doors":{"hold":{"levels":0.6,"room":0.6,"three":1.2,"names":1.6,"trail":1.4,"alone":1.6,"browse":0.8,"find":1.4}},
"shelves":{"hold":{"start":0.6,"same":0.6,"build":0.8,"core":0.8,"support":1.0,"groups":0.6,"office":1.0,"desk":1.0,"team":1.0,"rule":0.6,"another":1.0}},
"tomorrow":{"hold":{"reach":1.4,"version":1.4,"asks":1.2,"exam":1.8,"never":1.6,"boat":1.6}},
"owners":{"hold":{"any":1.2,"first":1.0,"group":1.2,"member":1.4,"leaves":1.4,"decides":0.6,"kinds":1.6}},
"where":{"hold":{"bound":1.2,"study":1.2,"readonly":1.0,"write":1.4,"space":1.0,"look":1.0}},
"code":{"hold":{"files":0.6,"lines":0.8,"yes":1.0,"contract":1.0,"after":1.0,"path":1.0,"byhand":0.8,"admin":1.0}},
"back":{"hold":{"islands":1.0,"here":0.4,"who":1.0,"every":0.8,"idea":0.6},"breathe":5.0}
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

/* ===== Grants by design: the film's own helpers =====
   Small things the chapters share, with the prefix gd_ (the module's kit is never changed for one film): a chapter's moments, made
   once; a value that fades in at a word and out at another; the kicker; a person drawn whole and then faded as one picture; a line of
   code on a dark strip; and a group, a table and a lock as this film draws them. Sizes are in the 1920 x 1080 frame; every word at
   least 28 px as seen, and nothing but the captions below y 890. */

// made once per chapter, the first time it draws: its cues are known by then
const gd_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// in at t0, out at t1 (or never), over d seconds
const gd_io=(t,t0,t1,d)=>t1==null?ag_in(t,t0,d||0.5):ag_io(t,t0,t1,d||0.5);
// a card's spring and fade: in at t0, out at t1 (or never)
const gd_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:gd_io(t,t0,t1,0.35)});
// the chapter's kicker, top left, over the shots in the frame's own space
function gd_kick(ctx,S,t,top,title,t0,t1){const a=gd_io(t,t0,t1,0.6);if(a<=0)return;setScreen(ctx,S);dp_kicker(ctx,top,title,{a});}
// a person drawn whole, then laid on the picture at a: a person fading in or out never shows through themselves
function gd_whole(ctx,a,fn){if(a<=0.004)return;if(a>=0.996){fn(ctx);return;}
  const cv=ctx.canvas,[bc,bx]=ag_buf("gdwhole",cv.width,cv.height);bx.setTransform(1,0,0,1,0,0);bx.clearRect(0,0,cv.width,cv.height);
  bx.setTransform(ctx.getTransform());fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}

// one line of code on a dark strip, in the code font: o.size (28), o.col (a meaning), o.rim (a meaning: a rim and a glow), o.w (width)
function gd_code(ctx,x,y,s,o){o=o||{};const size=o.size||28,a=o.a==null?1:o.a;if(a<=0)return 0;const w=o.w||dp_tw(ctx,s,{w:500,size,f:"mono"})+40,h=size+22;
  ctx.save();ctx.globalAlpha*=a;
  if(o.rim){const c=dp_f(o.rim);ctx.save();ctx.shadowColor=rgba(c,0.6);ctx.shadowBlur=16;rr(ctx,x-8,y-h+13,w+16,h,10);ctx.strokeStyle=rgba(c,o.rimA==null?1:o.rimA);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();}
  if(o.strip!==false){rr(ctx,x-8,y-h+13,w+16,h,10);ctx.fillStyle="rgba(2,12,16,0.6)";ctx.fill();}
  dp_T(ctx,s,x+12,y,{w:500,size,f:"mono",col:o.col||"ink"});ctx.restore();return w;}

/* a group, as this film draws it: a pill of glass with a ring of three small heads (a group, never a person) and its name in the code
   font, as the directory and the platform write it. gd_group(ctx, x, y, name, {a, lit, col, size, w}) puts its left end at x and its
   middle at y; lit (0 to 1) brightens its rim and fills its heads in its colour; returns {x, y, w, h, r: [x of its right end, y]} */
function gd_group(ctx,x,y,name,o){o=o||{};const size=o.size||28,col=o.col||"cyan",c=dp_f(col),L=clamp(o.lit||0,0,1),a=o.a==null?1:o.a,
    tw=dp_tw(ctx,name,{w:500,size,f:"mono"}),w=o.w||tw+108,h=size+30,bb={x,y:y-h/2,w,h,r:[x+w,y],l:[x,y]};if(a<=0||o.measure)return bb;
  ctx.save();ctx.globalAlpha*=a;
  if(L>0)dp_halo(ctx,x+w/2,y,w*0.7,col,0.16*L);
  dp_panel(ctx,x,y-h/2,w,h,{col,r:h/2,glowR:20+20*L,glowA:0.5+0.5*L,behind:o.behind});
  // three small heads and shoulders in a row, the middle one in front: a group
  const hx=x+38,hy=y+2;for(const [dx,dy,k] of [[-12,-3,0.82],[12,-3,0.82],[0,1,1]]){const px=hx+dx,py=hy+dy;ctx.save();
    ctx.fillStyle=rgba(mix([30,60,66],c,0.25+0.6*L),1);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),0.55+0.45*L);ctx.lineWidth=1.6;
    ctx.beginPath();ctx.arc(px,py-7*k,6.2*k,0,TAU);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(px-11*k,py+12*k);ctx.quadraticCurveTo(px-10*k,py+1*k,px,py+1*k);ctx.quadraticCurveTo(px+10*k,py+1*k,px+11*k,py+12*k);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
  dp_T(ctx,name,x+76,y+size*0.36,{w:500,size,f:"mono",col:L>0.5?"ink":"ink"});
  ctx.restore();return bb;}

/* a table, as this film draws it: a small slab of glass with rows of light inside, in the colour of what it holds (violet: personal
   data; grey: nothing that needs hiding); o.name writes its name over it in the code font; o.rows (0 to 1) lights its rows (read);
   o.dark dims it (no one can read it yet) */
function gd_table(ctx,x,y,w,h,o){o=o||{};const col=o.col||"violet",c=dp_f(col),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const lit=clamp(o.rows||0,0,1),dk=o.dark||0;
  ctx.save();ctx.shadowColor=rgba(c,0.35+0.35*lit);ctx.shadowBlur=10+12*lit;rr(ctx,x,y,w,h,8);ctx.fillStyle=rgba(mix([8,26,30],c,0.16*(1-dk)),0.92);ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,8);ctx.clip();const n=Math.max(2,Math.round((h-14)/11));
  for(let i=0;i<n;i++){const ry=y+8+i*((h-16)/Math.max(1,n-1)),rw=(w-24)*(0.55+0.4*((i*37+Math.round(x))%7)/7);
    ctx.fillStyle=rgba(mix(c,[255,255,255],0.2),(0.18+0.6*lit)*(1-0.8*dk));ctx.fillRect(x+12,ry-1.6,rw,3.2);}
  const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgba(220,250,250,0.12)");g.addColorStop(1,"rgba(220,250,250,0)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h*0.5);ctx.restore();
  rr(ctx,x+0.8,y+0.8,w-1.6,h-1.6,8);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),(0.55+0.45*lit)*(1-0.6*dk));ctx.lineWidth=1.8;ctx.stroke();
  if(o.name)dp_T(ctx,o.name,x+w/2,y-14,{w:500,size:o.size||28,f:"mono",align:"center",col:o.nameCol||"ink"});
  ctx.restore();}

/* a card as the kit draws one (dp_card's sizes and places), for a kicker, a title of one line and one line under it that can change:
   subs [[text, a], ...] are drawn in the same place, each at its own opacity, one leaving before the next comes in. o.mono writes the
   title in the code font, as the platform writes a name; o.col, o.a, o.k (springs it in). 180 tall; returns its box */
function gd_card(ctx,x,y,w,kick,title,subs,o){o=o||{};const a=o.a==null?1:o.a,h=180,bb={x,y,w,h},col=o.col||"cyan";if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  dp_panel(ctx,x,y,w,h,{col,r:20,glowR:36});
  dp_T(ctx,String(kick).toUpperCase(),x+30,y+50,{w:800,size:28,ls:4,col});
  dp_T(ctx,title,x+30,y+100,o.mono?{w:500,size:32,f:"mono"}:{w:700,size:36});
  for(const [s,sa] of subs||[])if(sa>0)dp_T(ctx,s,x+30,y+142,{w:500,size:28,col:"mut",a:sa});
  ctx.restore();return bb;}

// a name over the room's glass, on a small dark backing, so the shelves' edges never run through its letters: o.align, o.a, o.mono
// (true: the code font, as the platform writes a name), o.col, o.rim (the backing's fine edge)
function gd_label(ctx,s,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const f=o.mono===false?{w:700,size:28}:{w:500,size:28,f:"mono"},w=dp_tw(ctx,s,f),
    x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x;ctx.save();ctx.globalAlpha*=a;rr(ctx,x0-12,y-30,w+24,40,10);ctx.fillStyle="rgba(4,15,19,0.9)";ctx.fill();
  ctx.strokeStyle=rgba(dp_f(o.rim||"cyan"),0.4);ctx.lineWidth=1.2;ctx.stroke();dp_T(ctx,s,x0,y,Object.assign({},f,{col:o.col||"ink"}));ctx.restore();}

/* a card of steps or facts, one to a row: a mark on the left (a tick drawn on by its p, over a faint ring where it will be; or a dot in
   its colour) and its words; its kicker over them. rows [[text, {p, col, a}], ...]; o.a, o.k (springs it in), o.col. Returns its box */
function gd_steps(ctx,x,y,w,kick,rows,o){o=o||{};const a=o.a==null?1:o.a,h=78+rows.length*58+18,bb={x,y,w,h},col=o.col||"cyan";if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  dp_panel(ctx,x,y,w,h,{col,r:20,glowR:36});
  dp_T(ctx,String(kick).toUpperCase(),x+30,y+50,{w:800,size:28,ls:4,col});
  rows.forEach(([s,r],i)=>{r=r||{};const ry=y+78+i*58+34,ra=r.a==null?1:r.a;if(ra<=0)return;ctx.save();ctx.globalAlpha*=ra;
    if(r.p!=null){ctx.save();ctx.strokeStyle=rgba(dp_f("green"),0.4);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+52,ry-10,18,0,TAU);ctx.stroke();ctx.restore();dp_tick(ctx,x+52,ry-10,"green",r.p);}
    else{const c=dp_f(r.col||col);ctx.save();ctx.fillStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x+52,ry-10,8,0,TAU);ctx.fill();ctx.restore();}
    dp_T(ctx,s,x+88,ry,{w:600,size:30,col:"ink"});ctx.restore();});
  ctx.restore();return bb;}

/* ===== Grants by design: the islands =====
   The opening's world, painted in the module's night light: a shore of the Galápagos at dusk in the 1970s, as seen from the sea's
   edge. The sky is the hall's petrol, with the last warm light low on the right; far islands of old volcanoes on the horizon; the sea;
   and, in front, black lava with a flat rock where boats land, saltbush and the pale, bare palo santo trees of the dry coast, and a
   small lagoon on the right. Painted once as the place gdShore; what moves is drawn live: boats with a lamp, the visitors and their
   guide (small, far off, in the clothes of the time: shorts, shirts, hats, a pack), the animals (sea lions on the landing rock, boobies
   on their nests, a marine iguana on a boulder, flamingos at the lagoon), the trail and its stakes, and the zones of frosted glass
   that keep most of the land from visitors. No one's likeness is drawn. Sizes in the 1920 x 1080 frame. */

const GD_HZ=556;   // the horizon
// where the lava meets the sea, x to y
const GD_EDGE=x=>742+Math.sin(x*0.011)*10+Math.sin(x*0.037+1.3)*6-(x<600?Math.max(0,1-Math.abs(x-360)/260)*26:0)+(x>1400?-34*Math.min(1,(x-1400)/300):0);
// where the trail runs, from the landing rock inland and along to the lagoon: points the stakes stand on
const GD_TRAIL=[[402,812],[520,800],[640,782],[760,770],[880,772],[1000,782],[1120,786],[1240,776],[1360,758],[1470,742],[1570,736]];
// the nests beside the trail, and the one a visitor would walk through
const GD_NESTS=[[700,838,0.95],[930,826,1.0],[1190,836,0.95],[1420,800,0.85],[1050,734,0.8]];
// a point along the trail, u from 0 (the landing) to 1 (the lagoon)
function gd_along(u){u=clamp(u,0,1)*(GD_TRAIL.length-1);const i=Math.min(GD_TRAIL.length-2,Math.floor(u)),f=u-i,a=GD_TRAIL[i],b=GD_TRAIL[i+1];
  return[lerp(a[0],b[0],f),lerp(a[1],b[1],f)];}

AG_PLACES.gdShore=c=>{const w=W,h=H,R=ag_rnd(1969),hz=GD_HZ;
  // the sky: the hall's petrol, lighter and warmer low on the right where the sun has set
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(6,17,22)");g.addColorStop(0.55,"rgb(11,31,38)");g.addColorStop(0.86,"rgb(24,50,56)");g.addColorStop(1,"rgb(46,62,62)");
  c.fillStyle=g;c.fillRect(0,0,w,hz);
  const glow=(x,y,r,col,a)=>{const gg=c.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,rgba(col,a));gg.addColorStop(1,rgba(col,0));c.fillStyle=gg;c.fillRect(x-r,y-r,2*r,2*r);};
  c.save();c.beginPath();c.rect(0,0,w,hz+4);c.clip();glow(1560,hz+10,620,[196,132,86],0.30);glow(1560,hz,260,[236,170,110],0.22);glow(420,hz-40,700,[70,150,160],0.10);c.restore();
  for(let i=0;i<70;i++){const x=R()*w,y=R()*hz*0.62,r=0.6+R()*1.5;c.fillStyle="rgba(200,240,240,"+(0.06+R()*0.22*(1-y/hz)).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  // thin clouds caught by the last light
  for(let i=0;i<4;i++){const y=hz-70-R()*140,x=1000+R()*800,cw=160+R()*260;c.save();c.globalAlpha=0.06+R()*0.05;c.filter="blur(2px)";const cg=c.createLinearGradient(x-cw,0,x+cw,0);
    cg.addColorStop(0,"rgba(220,170,130,0)");cg.addColorStop(0.5,"rgba(220,170,130,1)");cg.addColorStop(1,"rgba(220,170,130,0)");c.fillStyle=cg;c.fillRect(x-cw,y,2*cw,2+R()*4);c.restore();}
  // far islands: old shield volcanoes and a cone, dark against the sky, lit along the right of each slope
  const island=(pts,col,rim)=>{c.save();c.beginPath();c.moveTo(pts[0][0],hz+2);for(const p of pts)c.lineTo(p[0],p[1]);c.lineTo(pts[pts.length-1][0],hz+2);c.closePath();
    c.fillStyle=col;c.fill();c.clip();const rg=c.createLinearGradient(0,hz-140,0,hz);rg.addColorStop(0,rgba(rim,0.16));rg.addColorStop(1,rgba(rim,0.02));c.fillStyle=rg;c.fillRect(0,hz-200,w,200);c.restore();
    c.save();c.strokeStyle=rgba(rim,0.34);c.lineWidth=1.6;c.beginPath();for(let i=0;i<pts.length;i++){const p=pts[i];i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.restore();};
  const dome=(x0,x1,top,n)=>{const P=[];for(let i=0;i<=n;i++){const u=i/n,s=Math.sin(Math.PI*u);P.push([lerp(x0,x1,u),hz-(top)*Math.pow(s,0.7)-R()*3*s]);}return P;};
  island(dome(-80,760,96,24),"rgb(12,28,34)",[150,190,186]);
  island(dome(560,980,46,14),"rgb(14,31,37)",[170,190,180]);
  island([[1040,hz],[1100,hz-28],[1150,hz-64],[1176,hz-92],[1196,hz-96],[1220,hz-70],[1266,hz-36],[1330,hz-12],[1380,hz]],"rgb(16,32,36)",[230,180,130]);
  island(dome(1640,2000,30,10),"rgb(18,34,38)",[230,176,128]);
  // the sea: the sky's light laid on it in long glints, warmest under the glow
  g=c.createLinearGradient(0,hz,0,800);g.addColorStop(0,"rgb(26,46,50)");g.addColorStop(0.3,"rgb(13,32,38)");g.addColorStop(1,"rgb(7,20,25)");c.fillStyle=g;c.fillRect(0,hz,w,800-hz);
  for(let i=0;i<260;i++){const y=hz+4+Math.pow(R(),1.7)*230,x=R()*w,len=20+R()*120*(1-(y-hz)/260),d=Math.abs(x-1560)/900,warm=Math.max(0,1-d);
    const a=(0.05+0.16*warm)*(1-(y-hz)/300);c.fillStyle=rgba(mix([120,190,196],[236,178,120],warm),Math.max(0,a));c.fillRect(x,y,len,1.2+R()*1.2);}
  // the shore: black lava from the water's edge to the front, its edge uneven, with a flat rock where boats land on the left
  const edge=GD_EDGE;
  c.save();c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=12)c.lineTo(x,edge(x));c.lineTo(w,h);c.closePath();
  g=c.createLinearGradient(0,700,0,h);g.addColorStop(0,"rgb(20,30,32)");g.addColorStop(0.35,"rgb(12,20,22)");g.addColorStop(1,"rgb(6,11,13)");c.fillStyle=g;c.fill();c.clip();
  // the lava's ropes and cracks, faint, and the cool sheen of the sky on its tops
  for(let i=0;i<180;i++){const x=R()*w,y=730+Math.pow(R(),0.8)*350,r=10+R()*40*(y/h);c.strokeStyle="rgba(120,170,170,"+(0.03+R()*0.05).toFixed(3)+")";c.lineWidth=1+R()*1.4;
    c.beginPath();c.ellipse(x,y,r*1.8,r*0.5,-0.1+R()*0.2,Math.PI*1.05,Math.PI*1.95);c.stroke();}
  for(let i=0;i<70;i++){let x=R()*w,y=760+R()*320;c.strokeStyle="rgba(0,0,0,"+(0.25+R()*0.3).toFixed(3)+")";c.lineWidth=1+R()*1.6;c.beginPath();c.moveTo(x,y);
    for(let k=0;k<4;k++){x+=(R()-0.5)*60;y+=(R()-0.3)*24;c.lineTo(x,y);}c.stroke();}
  // the landing rock: a flat ledge at the water, its top catching the sky
  c.fillStyle="rgb(24,34,36)";c.beginPath();c.moveTo(150,760);c.bezierCurveTo(220,736,420,730,560,748);c.lineTo(580,790);c.bezierCurveTo(430,800,250,806,140,796);c.closePath();c.fill();
  c.fillStyle="rgba(170,210,206,0.16)";c.fillRect(170,744,380,2);
  // a small lagoon on the right, behind the shore, holding the glow
  c.save();c.beginPath();c.ellipse(1660,724,250,30,0,0,TAU);const lg=c.createLinearGradient(0,694,0,754);lg.addColorStop(0,"rgb(70,72,68)");lg.addColorStop(1,"rgb(28,40,42)");c.fillStyle=lg;c.fill();
  c.clip();for(let i=0;i<30;i++){c.fillStyle="rgba(240,190,140,"+(0.08+R()*0.14).toFixed(3)+")";c.fillRect(1430+R()*460,700+R()*46,30+R()*80,1.2);}c.restore();
  c.restore();
  // the water's edge: a fine line of foam where the sea meets the lava
  c.save();c.strokeStyle="rgba(200,236,236,0.22)";c.lineWidth=1.6;c.beginPath();for(let x=0;x<=w;x+=10){const y=edge(x)-2;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();c.restore();
  // saltbush, low and rounded, and palo santo trees, bare and pale, along the back of the shore
  const bush=(x,y,r)=>{for(let k=0;k<7;k++){const bx=x+(R()-0.5)*r*1.6,by=y-R()*r*0.5,br=r*(0.35+R()*0.4);const bg=c.createRadialGradient(bx-br*0.3,by-br*0.4,1,bx,by,br);
      bg.addColorStop(0,"rgb(30,44,40)");bg.addColorStop(1,"rgb(12,20,20)");c.fillStyle=bg;c.beginPath();c.ellipse(bx,by,br*1.2,br*0.8,0,0,TAU);c.fill();}};
  for(const [x,y,r] of [[90,760,40],[640,744,34],[820,736,30],[1290,730,38],[1080,724,26],[1860,742,30],[560,880,46],[1540,900,52],[260,940,58]])bush(x,y,r);
  const tree=(x,y,s)=>{const br=(x0,y0,ang,len,wd,d)=>{if(d>4||len<6)return;const x1=x0+Math.sin(ang)*len,y1=y0-Math.cos(ang)*len;
      c.strokeStyle="rgba(140,152,150,"+(0.36-d*0.05).toFixed(3)+")";c.lineWidth=wd;c.lineCap="round";c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+x1)/2+(R()-0.5)*8,(y0+y1)/2,x1,y1);c.stroke();
      const n=2+(R()<0.4?1:0);for(let k=0;k<n;k++)br(x1,y1,ang+(R()-0.5)*1.3,len*(0.62+R()*0.18),wd*0.66,d+1);};
    br(x,y,(R()-0.5)*0.2,54*s,7*s,0);};
  for(const [x,y,s] of [[700,740,1.0],[880,734,0.8],[1330,726,1.1],[1120,720,0.7],[1900,740,0.9],[40,756,0.9]])tree(x,y,s);
  // the dark at the front, so the eye goes to the shore
  g=c.createLinearGradient(0,900,0,h);g.addColorStop(0,"rgba(4,10,12,0)");g.addColorStop(1,"rgba(4,10,12,0.7)");c.fillStyle=g;c.fillRect(0,900,w,h-900);};

/* ---------------------------------------------------------------- what moves on the islands */
// a boat of the time, a small motor schooner, far out on the sea: its hull and cabin dark, its mast, and a warm lamp; s its size
function gd_boat(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="rgb(8,16,20)";ctx.beginPath();ctx.moveTo(-60,-6);ctx.lineTo(56,-6);ctx.quadraticCurveTo(64,-6,70,-14);ctx.lineTo(64,4);ctx.quadraticCurveTo(10,10,-52,6);ctx.closePath();ctx.fill();
  ctx.fillRect(-30,-22,46,16);ctx.fillRect(-4,-30,22,9);ctx.strokeStyle="rgb(8,16,20)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(4,-30);ctx.lineTo(4,-74);ctx.moveTo(4,-70);ctx.lineTo(-40,-8);ctx.stroke();
  ctx.strokeStyle="rgba(170,210,206,0.35)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-60,-6);ctx.lineTo(56,-6);ctx.stroke();
  const L=o.lamp==null?1:o.lamp;if(L>0){dp_halo(ctx,-8,-16,46,[255,200,130],0.5*L);ctx.fillStyle=rgba([255,214,150],L);ctx.fillRect(-24,-18,6,5);ctx.fillRect(-12,-18,6,5);ctx.fillRect(0,-18,6,5);
    // its lamp on the water
    ctx.fillStyle=rgba([255,200,130],0.25*L);ctx.fillRect(-20,10,28,1.6);ctx.fillRect(-14,16,16,1.4);}
  ctx.restore();}

/* a visitor of the time, small and far off, walking: a hat (some), a shirt, shorts, a pack (some); lit warm from the glow on the right
   and cool from the sky. ph is the walk's phase (it moves the legs), dir 1 to the right, -1 to the left; o.guide gives the guide's
   wide hat and a slow, steady step; o.still stands. Arms hang: no one points. Drawn whole; fade a group through gd_whole. */
const GD_FOLK=[{shirt:[150,128,96],hat:"cap",pack:[90,80,64]},{shirt:[98,120,132],hat:null,pack:null},{shirt:[176,150,120],hat:"sun",pack:[70,84,70]},
  {shirt:[120,96,110],hat:null,pack:[84,74,60]},{shirt:[200,186,150],hat:"sun",pack:null},{shirt:[110,130,104],hat:"cap",pack:[96,80,70]},
  {shirt:[160,110,90],hat:null,pack:null},{shirt:[136,146,150],hat:"sun",pack:[80,70,58]}];
function gd_walker(ctx,x,y,s,ph,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const P=o.guide?{shirt:[178,164,118],hat:"guide",pack:[76,70,56]}:GD_FOLK[(o.k||0)%GD_FOLK.length];
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);
  const sw=o.still?0:Math.sin(ph)*0.42,lift=o.still?0:Math.abs(Math.cos(ph))*1.6,skin=[150,112,90],dark=[14,20,22];
  const shade=(col,k)=>rgba(mix(col,[10,16,20],k),1);
  // its shadow on the lava
  ctx.fillStyle="rgba(0,0,0,0.35)";ctx.beginPath();ctx.ellipse(0,0,15,3.4,0,0,TAU);ctx.fill();
  // legs, from the hips, swinging in turn; shorts over them, then boots
  const leg=(sgn)=>{const an=sgn*sw;ctx.save();ctx.translate(0,-30);ctx.rotate(an);ctx.strokeStyle=shade(skin,0.55);ctx.lineWidth=4.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,27);ctx.stroke();
    ctx.fillStyle=shade([40,40,38],0.2);ctx.fillRect(-3,25,8,4);ctx.restore();};
  leg(-1);leg(1);ctx.translate(0,-lift);
  ctx.fillStyle=shade(o.guide?[96,92,70]:[84,80,72],0.25);ctx.beginPath();ctx.moveTo(-7,-38);ctx.lineTo(7,-38);ctx.lineTo(8,-26);ctx.lineTo(-8,-26);ctx.closePath();ctx.fill();
  // the body and a pack behind it
  if(P.pack){ctx.fillStyle=shade(P.pack,0.4);rr(ctx,-13,-60,8,20,3);ctx.fill();}
  ctx.fillStyle=shade(P.shirt,0.45);ctx.beginPath();ctx.moveTo(-8,-60);ctx.quadraticCurveTo(0,-64,8,-60);ctx.lineTo(8,-37);ctx.lineTo(-8,-37);ctx.closePath();ctx.fill();
  // the warm light from the glow on the leading edge, the cool sky on the top
  ctx.fillStyle="rgba(240,180,120,0.30)";ctx.fillRect(5,-59,3,21);
  // arms hang at the sides
  ctx.strokeStyle=shade(P.shirt,0.5);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(6,-57);ctx.lineTo(7+sw*3,-40);ctx.moveTo(-6,-57);ctx.lineTo(-7-sw*3,-40);ctx.stroke();
  // the head, and a hat of the time
  ctx.fillStyle=shade(skin,0.42);ctx.beginPath();ctx.arc(0,-68,5.4,0,TAU);ctx.fill();ctx.fillStyle="rgba(240,180,120,0.35)";ctx.beginPath();ctx.arc(1.6,-68,4,-0.9,0.9);ctx.fill();
  if(P.hat==="cap"){ctx.fillStyle=shade([170,160,130],0.4);ctx.beginPath();ctx.arc(0,-70,5.6,Math.PI,0);ctx.fill();ctx.fillRect(1,-71,7,2);}
  if(P.hat==="sun"){ctx.fillStyle=shade([196,180,140],0.35);ctx.beginPath();ctx.ellipse(0,-71,9,2.2,0,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(0,-71,5,Math.PI,0);ctx.fill();}
  if(P.hat==="guide"){ctx.fillStyle=shade([150,130,92],0.3);ctx.beginPath();ctx.ellipse(0,-71,11,2.6,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-5.6,-71);ctx.quadraticCurveTo(-5,-78,0,-78);ctx.quadraticCurveTo(5,-78,5.6,-71);ctx.closePath();ctx.fill();}
  ctx.restore();}

// a blue-footed booby sitting on its nest, small, seen side on: a white breast, brown back, a long pale bill; up (0 to 1) raises its head
function gd_booby(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);const up=o.up||0;
  // the nest: a ring of guano and twigs on the lava
  ctx.fillStyle="rgba(150,150,140,0.35)";ctx.beginPath();ctx.ellipse(0,1,24,5,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(56,46,40)";ctx.beginPath();ctx.moveTo(-22,0);ctx.bezierCurveTo(-24,-18,-8,-26,8,-22);ctx.bezierCurveTo(18,-18,22,-8,20,0);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(196,196,188)";ctx.beginPath();ctx.moveTo(8,-22);ctx.bezierCurveTo(18,-18,22,-8,20,0);ctx.lineTo(4,0);ctx.bezierCurveTo(6,-8,4,-16,8,-22);ctx.closePath();ctx.fill();
  // the head and neck, rising as it looks up
  const hx=14,hy=-30-up*8;ctx.strokeStyle="rgb(170,166,156)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(10,-20);ctx.quadraticCurveTo(14,-26,hx,hy);ctx.stroke();
  ctx.fillStyle="rgb(176,170,160)";ctx.beginPath();ctx.arc(hx,hy,5.6,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(120,140,150)";ctx.beginPath();ctx.moveTo(hx+4,hy-2);ctx.lineTo(hx+17,hy+2-up*2);ctx.lineTo(hx+4,hy+3);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(20,22,24)";ctx.beginPath();ctx.arc(hx+1.6,hy-1,1.3,0,TAU);ctx.fill();
  // the warm rim of the glow on its breast, the cool sky on its back
  ctx.strokeStyle="rgba(240,186,130,0.45)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(20,-2);ctx.bezierCurveTo(22,-10,18,-18,10,-22);ctx.stroke();
  ctx.strokeStyle="rgba(150,210,210,0.25)";ctx.beginPath();ctx.moveTo(-20,-6);ctx.bezierCurveTo(-18,-20,-4,-26,8,-23);ctx.stroke();
  ctx.restore();}

// a sea lion resting on the landing rock, its head raised a little (lift 0 to 1), seen side on; s its size
function gd_sealion(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);const L=o.lift||0;
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(0,2,70,6,0,0,TAU);ctx.fill();
  const g=ctx.createLinearGradient(0,-40,0,2);g.addColorStop(0,"rgb(70,64,56)");g.addColorStop(1,"rgb(30,28,26)");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-70,0);ctx.bezierCurveTo(-74,-8,-60,-14,-40,-16);ctx.bezierCurveTo(-10,-20,18,-24,34,-30-L*8);ctx.bezierCurveTo(44,-36-L*10,56,-40-L*12,64,-36-L*12);
  ctx.bezierCurveTo(72,-32-L*12,72,-24-L*8,62,-20-L*6);ctx.bezierCurveTo(54,-16,46,-8,44,0);ctx.closePath();ctx.fill();
  // a fore flipper, and the eye
  ctx.fillStyle="rgb(36,32,30)";ctx.beginPath();ctx.moveTo(26,-6);ctx.quadraticCurveTo(36,2,44,4);ctx.lineTo(30,4);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(14,14,14)";ctx.beginPath();ctx.arc(60,-32-L*12,1.8,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(240,186,130,0.40)";ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(-40,-16);ctx.bezierCurveTo(-10,-20,18,-24,34,-30-L*8);ctx.bezierCurveTo(44,-36-L*10,56,-40-L*12,64,-36-L*12);ctx.stroke();
  ctx.restore();}

// a marine iguana on a boulder, dark, its crest of spines along its back; s its size
function gd_iguana(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);
  ctx.fillStyle="rgb(20,26,26)";ctx.beginPath();ctx.ellipse(0,6,62,20,0,Math.PI,TAU);ctx.fill();
  ctx.fillStyle="rgb(36,38,36)";ctx.beginPath();ctx.moveTo(-60,-6);ctx.bezierCurveTo(-30,-12,-10,-18,14,-18);ctx.bezierCurveTo(26,-18,36,-22,44,-22);ctx.bezierCurveTo(52,-22,56,-16,52,-12);
  ctx.bezierCurveTo(40,-8,20,-4,0,-4);ctx.bezierCurveTo(-24,-4,-44,-2,-60,-6);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgb(46,46,42)";ctx.lineWidth=1.4;for(let i=0;i<9;i++){const px=-30+i*7,py=-14-Math.sin(i/8*Math.PI)*4;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+1,py-5);ctx.stroke();}
  ctx.strokeStyle="rgba(150,210,210,0.30)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-50,-8);ctx.bezierCurveTo(-20,-14,10,-18,44,-22);ctx.stroke();
  ctx.restore();}

// a flamingo standing in the lagoon, seen side on: thin legs, its body, an S of a neck, the bent bill; tinted by the glow; s its size
function gd_flamingo(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);const pk=[214,140,128],dk=[150,92,86],dip=o.dip||0;
  ctx.strokeStyle=rgba(dk,1);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-2,0);ctx.lineTo(0,-46);ctx.lineTo(2,-86);ctx.moveTo(6,0);ctx.lineTo(6,-40);ctx.lineTo(4,-86);ctx.stroke();
  const g=ctx.createLinearGradient(-24,-110,24,-80);g.addColorStop(0,rgba(pk,1));g.addColorStop(1,rgba(dk,1));ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(-2,-96,26,13,-0.16,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(pk,1);ctx.lineWidth=4.2;ctx.beginPath();ctx.moveTo(18,-102);ctx.bezierCurveTo(30,-118,10,-132,14,-148+dip*30);ctx.bezierCurveTo(18,-162+dip*30,30,-160+dip*30,30,-150+dip*30);ctx.stroke();
  ctx.fillStyle=rgba(pk,1);ctx.beginPath();ctx.arc(30,-151+dip*30,4.4,0,TAU);ctx.fill();ctx.fillStyle="rgb(30,26,26)";ctx.beginPath();ctx.moveTo(32,-150+dip*30);ctx.quadraticCurveTo(40,-148+dip*30,38,-140+dip*30);ctx.lineTo(33,-146+dip*30);ctx.closePath();ctx.fill();
  // its reflection, faint, in the still water
  ctx.save();ctx.globalAlpha*=0.18;ctx.scale(1,-0.45);ctx.strokeStyle=rgba(pk,1);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(2,-86);ctx.stroke();ctx.fillStyle=rgba(pk,1);ctx.beginPath();ctx.ellipse(-2,-96,26,13,-0.16,0,TAU);ctx.fill();ctx.restore();
  ctx.restore();}

/* the trail and its stakes: a band of paler crushed lava from the landing to the lagoon, laid as far as u (0 to 1), with a stake at
   each point, lit (0 to 1) one after another as it's marked: a short post with a white tip, as the park's trails are marked */
function gd_trail(ctx,u,lit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;const n=48;
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";for(const [wd,col] of [[30,"rgba(60,66,64,0.55)"],[18,"rgba(96,100,94,0.55)"],[3,"rgba(190,220,214,0.22)"]]){
    ctx.strokeStyle=col;ctx.lineWidth=wd;ctx.beginPath();for(let i=0;i<=n;i++){const v=i/n;if(v>u)break;const p=gd_along(v),q=[p[0],p[1]+4];i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();}ctx.restore();
  GD_TRAIL.forEach((p,i)=>{const v=i/(GD_TRAIL.length-1);if(v>u+1e-6)return;const L=clamp(lit*GD_TRAIL.length*1.3-i,0,1),side=i%2?14:-14,sx=p[0],sy=p[1]+side*0.5-4;
    ctx.fillStyle="rgb(40,36,30)";ctx.fillRect(sx-2,sy-26,4,26);ctx.fillStyle=rgba(mix([150,150,140],[236,240,232],L),1);ctx.fillRect(sx-2.4,sy-28,4.8,8);
    if(L>0)dp_halo(ctx,sx,sy-24,26,[230,240,230],0.25*L);});
  ctx.restore();}

/* the zones: frost laid over the land itself, on both sides of the trail, keeping most of the shore from visitors (u 0 to 1 lays it
   on); what lives there is drawn over it, still there, only out of reach; the trail's corridor, the landing rock and the lagoon's edge
   stay clear, their edges lit like the edges of a pane */
function gd_open(c){const up=[],dn=[];for(let i=0;i<=44;i++){const p=gd_along(i/44);up.push([p[0],p[1]-26]);dn.push([p[0],p[1]+30]);}
  c.moveTo(up[0][0],up[0][1]);for(const p of up)c.lineTo(p[0],p[1]);for(let i=dn.length-1;i>=0;i--)c.lineTo(dn[i][0],dn[i][1]);c.closePath();
  c.moveTo(600,776);c.ellipse(372,774,228,40,0,0,TAU);c.moveTo(1930,730);c.ellipse(1680,730,250,42,0,0,TAU);}
function gd_zones(ctx,u,o){o=o||{};const a=(o.a==null?1:o.a)*ag_sine(clamp(u,0,1));if(a<=0.004)return;
  const cv=ctx.canvas,[bc,bx]=ag_buf("gdzones",cv.width,cv.height);bx.setTransform(ctx.getTransform());
  bx.save();bx.beginPath();bx.moveTo(0,H);for(let x=0;x<=W;x+=16)bx.lineTo(x,GD_EDGE(x)+6);bx.lineTo(W,H);bx.closePath();bx.clip();
  dp_behind(bx,"gdShore");bx.fillStyle="rgba(10,24,30,0.34)";bx.fillRect(0,0,W,H);const g=bx.createLinearGradient(0,740,0,H);g.addColorStop(0,"rgba(170,200,204,0.16)");g.addColorStop(1,"rgba(170,200,204,0.05)");bx.fillStyle=g;bx.fillRect(0,700,W,H-700);
  bx.globalCompositeOperation="destination-out";bx.fillStyle="#000";bx.beginPath();gd_open(bx);bx.fill();bx.restore();
  // the edges of what stays open, in the light of a pane's edge
  bx.save();bx.strokeStyle=rgba(DP.ice,0.55);bx.shadowColor=rgba(DP.ice,0.8);bx.shadowBlur=8;bx.lineWidth=1.8;bx.beginPath();gd_open(bx);bx.stroke();bx.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}

/* ---------------------------------------------------------------- more of the islands: a bird leaving, flamingos on their nests, the map */
// a booby in flight, seen from the side, its wings beating (ph); s its size
function gd_flyer(ctx,x,y,s,ph,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);const f=Math.sin(ph);
  ctx.fillStyle="rgb(196,196,188)";ctx.beginPath();ctx.ellipse(0,0,20,6.4,-0.1,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(120,140,150)";ctx.beginPath();ctx.moveTo(18,-3);ctx.lineTo(32,0);ctx.lineTo(18,2);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(70,58,50)";for(const k of [1,-1]){ctx.beginPath();ctx.moveTo(-6,-1);ctx.quadraticCurveTo(-2,-24*f*k-4,-24,-34*f*k);ctx.quadraticCurveTo(-12,-10*f*k,6,-1);ctx.closePath();ctx.fill();}
  ctx.strokeStyle="rgba(240,186,130,0.4)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-18,2);ctx.quadraticCurveTo(0,7,18,2);ctx.stroke();ctx.restore();}
// a flamingo sitting on its nest, a cone of mud at the lagoon's edge; s its size
function gd_sitter(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);const pk=[214,140,128],dk=[150,92,86];
  ctx.fillStyle="rgb(58,52,46)";ctx.beginPath();ctx.moveTo(-34,0);ctx.lineTo(-24,-22);ctx.lineTo(24,-22);ctx.lineTo(34,0);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(240,190,140,0.18)";ctx.fillRect(-24,-23,48,2);
  const g=ctx.createLinearGradient(-24,-50,24,-24);g.addColorStop(0,rgba(pk,1));g.addColorStop(1,rgba(dk,1));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(-2,-36,28,14,-0.1,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(pk,1);ctx.lineWidth=4.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(18,-42);ctx.bezierCurveTo(30,-60,8,-74,14,-88);ctx.bezierCurveTo(18,-100,30,-98,30,-90);ctx.stroke();
  ctx.fillStyle=rgba(pk,1);ctx.beginPath();ctx.arc(30,-91,4.4,0,TAU);ctx.fill();ctx.fillStyle="rgb(30,26,26)";ctx.beginPath();ctx.moveTo(32,-90);ctx.quadraticCurveTo(40,-88,38,-80);ctx.lineTo(33,-86);ctx.closePath();ctx.fill();
  ctx.restore();}
// a piece of coral, pale and branched, as a visitor carries it off; s its size
function gd_coral(ctx,x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="rgb(232,206,196)";ctx.lineCap="round";
  const br=(x0,y0,an,len,wd,d)=>{if(d>3)return;const x1=x0+Math.sin(an)*len,y1=y0-Math.cos(an)*len;ctx.lineWidth=wd;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();br(x1,y1,an-0.5,len*0.7,wd*0.7,d+1);br(x1,y1,an+0.45,len*0.66,wd*0.7,d+1);};
  br(0,0,0,9,3.4,0);ctx.restore();}
/* the map: a card of glass with the coast of Ecuador on its right, the islands on its left, and the sea between, about 1,000 km
   (o.p draws the line between them on) */
function gd_map(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,glowR:30,behind:o.behind});
  ctx.save();rr(ctx,x,y,w,h,20);ctx.clip();
  // the land of South America on the right: a coast running down from the top, bulging west at Ecuador
  const cx=x+w*0.74;ctx.beginPath();ctx.moveTo(cx+20,y);ctx.bezierCurveTo(cx-6,y+h*0.2,cx-34,y+h*0.42,cx-26,y+h*0.55);ctx.bezierCurveTo(cx-18,y+h*0.68,cx+10,y+h*0.8,cx+30,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y);ctx.closePath();
  ctx.fillStyle="rgba(92,120,112,0.42)";ctx.fill();ctx.strokeStyle=rgba(mix(dp_f("cyan"),[255,255,255],0.4),0.8);ctx.lineWidth=2;ctx.stroke();ctx.restore();
  // the islands, a cluster on the left
  const ix=x+w*0.17,iy=y+h*0.52;for(const [dx,dy,r] of [[0,0,9],[-16,10,6],[14,14,5],[6,-14,5],[-10,-10,4],[22,-4,4],[-22,-2,3.5]]){ctx.fillStyle="rgba(150,190,180,0.9)";ctx.beginPath();ctx.arc(ix+dx,iy+dy,r,0,TAU);ctx.fill();}
  const p=o.p==null?1:clamp(o.p,0,1),ex=lerp(ix+34,cx-40,p);ctx.save();ctx.strokeStyle=rgba(DP.T.ink,0.9);ctx.lineWidth=2.4;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(ix+34,iy);ctx.lineTo(ex,iy);ctx.stroke();ctx.restore();
  dp_T(ctx,"Galápagos",ix-12,iy+66,{w:700,size:28,align:"center"});dp_T(ctx,"Ecuador",cx+44,y+h*0.42,{w:700,size:28,align:"center"});
  if(p>0.5)dp_T(ctx,"about 1,000 km",lerp(ix,cx,0.5),iy-26,{w:600,size:28,align:"center",col:"mut",a:clamp((p-0.5)*2,0,1)});
  ctx.restore();}
/* a walk across the lava, before the plan: from the landing rock out to points anywhere on the shore (a seeded polyline per visitor),
   and the point u (0 to 1) along it; worn (0 to 1) lays the paleness of many feet along it */
const GD_WANDER=(()=>{const R=ag_rnd(1971),L=[];for(let i=0;i<8;i++){const P=[[300+R()*240,790+R()*14]];let x=P[0][0],y=P[0][1];
    for(let k=0;k<4;k++){x=clamp(x+(R()*2-0.6)*360,150,1760);y=clamp(y+(R()-0.5)*90+18,770,960);P.push([x,y]);}L.push(P);}return L;})();
function gd_walkAt(P,u){u=clamp(u,0,1);let tot=0;const seg=[];for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(d);tot+=d;}
  let r=u*tot;for(let i=0;i<seg.length;i++){if(r<=seg[i]||i===seg.length-1){const f=clamp(r/seg[i],0,1);return{x:lerp(P[i][0],P[i+1][0],f),y:lerp(P[i][1],P[i+1][1],f),dir:P[i+1][0]>=P[i][0]?1:-1,dist:u*tot};}r-=seg[i];}
  return{x:P[0][0],y:P[0][1],dir:1,dist:0};}
function gd_worn(ctx,P,u,a){if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(150,160,150,0.20)";ctx.lineWidth=12;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();const n=30;for(let i=0;i<=n;i++){const q=gd_walkAt(P,u*i/n);i?ctx.lineTo(q.x,q.y+2):ctx.moveTo(q.x,q.y+2);}ctx.stroke();ctx.restore();}
// a walker's size at a depth on the shore: further (higher up the frame) is smaller
const gd_depth=y=>lerp(0.95,1.55,clamp((y-740)/260,0,1));

/* ===== Grants by design: the catalog room =====
   The university's side of the film, in the module's hall. A catalog is a room of clear glass on the right of the hall, its name on a
   plate at the top; each schema is a shelf in it, a long pane with the shelf's name in the code font and its tables on it, small slabs
   of glass whose rows of light are lit when they're read (violet: personal data; grey: nothing that needs hiding). A shelf nobody reads
   is frosted. Groups stand on the left as pills of glass with three small heads (a group, never a person); a grant is a line of light
   from a group to a shelf, green; a right that only lets you look is dashed. The three rights a table needs are three doors on the way
   in: the room's door in its left wall, the shelf's gate at its left end, and the table itself. Painted once: the hall (gdHall); every
   room, shelf, table, group and line is drawn live over it. Sizes in the 1920 x 1080 frame. */

AG_PLACES.gdHall=c=>dp_paintHall(c,{seed:41,horizon:730,vx:1240,panes:7,lights:16,pools:[[430,980,560,0.10],[1420,900,820,0.06]]});

/* ---------------------------------------------------------------- the registrar's catalog: a room of glass, its shelves */
const GD_R={x:1000,y:150,w:840,h:712};                       // the room: x 1000 to 1840, y 150 to 862
const GD_SH={x:1024,w:792,h:84,y0:252,dy:100};               // its shelves: from y 252, 100 apart
const GD_SHELF=["staging","intermediate","reference","core","published","support"];
const GD_SHCOL={staging:"grey",intermediate:"grey",core:"violet",reference:"grey",published:"grey",support:"violet"};
const GD_NT={staging:5,intermediate:4,core:4,reference:4,published:3,support:0};
const GD_TW=88,GD_TH=52,GD_TX=1290,GD_TDX=104;              // a table on a shelf: its size, where the first stands, how far apart
const gd_shelfY=k=>GD_SH.y0+GD_SHELF.indexOf(k)*GD_SH.dy;     // a shelf's top
const gd_shelfMid=k=>gd_shelfY(k)+GD_SH.h/2;
const gd_tableXY=(k,j)=>[GD_TX+j*GD_TDX,gd_shelfY(k)+16];    // the j-th table on shelf k: its top left
// where a line of light reaches a shelf: its left end, a little up or down for each line that reaches it (n lines, this the i-th)
const gd_gate=(k,i,n)=>[GD_SH.x-2,gd_shelfMid(k)+(n>1?lerp(-22,22,i/(n-1)):0)];

/* the room: clear glass with a dark film inside, so its words read; its plate (kicker CATALOG and its name in the code font).
   o: a, name ("registrar"), plate (0 to 1, the plate's words), x, y, w, h (another room), col (its rim), small (a far room: thinner
   rim, its name only), lit (0 to 1, the room lit as a whole) */
function gd_roomBox(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const x=o.x==null?GD_R.x:o.x,y=o.y==null?GD_R.y:o.y,w=o.w||GD_R.w,h=o.h||GD_R.h,
    col=o.col||"cyan",c=dp_f(col),L=clamp(o.lit||0,0,1);
  ctx.save();ctx.globalAlpha*=a;
  if(L>0)dp_halo(ctx,x+w/2,y+h/2,Math.max(w,h)*0.6,col,0.10*L);
  ctx.save();rr(ctx,x,y,w,h,o.small?16:26);ctx.clip();ctx.fillStyle="rgba(4,15,19,0.56)";ctx.fillRect(x,y,w,h);
  const sg=ctx.createLinearGradient(x,y,x+w*0.6,y+h);sg.addColorStop(0,"rgba(200,245,245,0.07)");sg.addColorStop(0.4,"rgba(200,245,245,0.015)");sg.addColorStop(0.55,"rgba(200,245,245,0.05)");sg.addColorStop(1,"rgba(200,245,245,0)");
  ctx.fillStyle=sg;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.save();ctx.shadowColor=rgba(c,0.7+0.3*L);ctx.shadowBlur=(o.small?10:16)+10*L;rr(ctx,x+1,y+1,w-2,h-2,o.small?16:26);
  const eg=ctx.createLinearGradient(x,y,x+w,y+h);eg.addColorStop(0,rgba(mix(c,[255,255,255],0.45),0.95));eg.addColorStop(1,rgba(c,0.75+0.25*L));ctx.strokeStyle=eg;ctx.lineWidth=o.small?1.8:2.4;ctx.stroke();ctx.restore();
  // its gloss on the floor
  const rg=ctx.createLinearGradient(0,y+h,0,y+h+90);rg.addColorStop(0,rgba(c,0.08));rg.addColorStop(1,rgba(c,0));ctx.fillStyle=rg;ctx.fillRect(x+20,y+h+4,w-40,90);
  const pa=o.plate==null?1:o.plate;
  if(pa>0&&o.name){ctx.save();ctx.globalAlpha*=pa;
    if(o.small){dp_T(ctx,o.name,x+24,y+46,{w:500,size:28,f:"mono"});}
    else{dp_T(ctx,"CATALOG",x+32,y+60,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,o.name,x+218,y+62,{w:500,size:36,f:"mono"});
      ctx.fillStyle=rgba(c,0.45);ctx.fillRect(x+24,y+90,w-48,1.4);}
    ctx.restore();}
  ctx.restore();}

/* one shelf of the room, k its name: o.a, o.label (0 to 1, its name), o.col (what it holds; GD_SHCOL by default), o.frost (nobody
   reads it), o.lit (0 to 1, its tables' rows lit: read), o.n (how many tables), o.tables (each table's own {a, lit, name, col, dark,
   dx, dy}), o.rim (0 to 1, its rim lit in its colour), o.gate (the gate at its left end: {p, open}) */
function gd_shelf(ctx,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const x=GD_SH.x,y=gd_shelfY(k),w=GD_SH.w,h=GD_SH.h,col=o.col||GD_SHCOL[k],c=dp_f(col),
    n=o.n==null?GD_NT[k]:o.n,lit=clamp(o.lit||0,0,1),rim=clamp(o.rim||0,0,1);
  ctx.save();ctx.globalAlpha*=a;
  const tables=c2=>{for(let j=0;j<n;j++){const T=(o.tables&&o.tables[j])||{},[tx,ty]=gd_tableXY(k,j);
      gd_table(c2,tx+(T.dx||0),ty+(T.dy||0),GD_TW,GD_TH,{col:T.col||col,a:T.a,rows:T.lit==null?lit:T.lit,dark:T.dark});}};
  if(o.frost){dp_frost(ctx,x,y,w,h,tables,{col:"grey",r:14});}
  else{ctx.save();rr(ctx,x,y,w,h,14);ctx.fillStyle="rgba(8,24,30,0.62)";ctx.fill();ctx.restore();
    ctx.save();if(rim>0){ctx.shadowColor=rgba(c,0.7*rim);ctx.shadowBlur=18*rim;}rr(ctx,x+0.8,y+0.8,w-1.6,h-1.6,14);
    ctx.strokeStyle=rgba(mix([120,170,176],c,0.35+0.65*rim),0.55+0.45*rim);ctx.lineWidth=1.8+0.8*rim;ctx.stroke();ctx.restore();
    // the shelf's edge, a line of light along its foot
    ctx.fillStyle=rgba(mix(DP.ice,c,0.5*rim),0.20+0.3*rim);ctx.fillRect(x+16,y+h-8,w-32,1.6);
    tables(ctx);}
  if(o.label!==0){ctx.save();ctx.globalAlpha*=o.label==null?1:o.label;dp_T(ctx,k,x+26,y+h/2+10,{w:500,size:28,f:"mono",col:o.frost?"ink":"ink"});ctx.restore();}
  ctx.restore();}

/* the three doors on the way to a table, as one group sees them: the room's door in its left wall (at the height of shelf k), the
   shelf's gate at its left end, and the table itself; each from shut (0) to open (1), coral while shut and lit, green once open.
   o: d1, d2, d3 ({p: how far it's drawn, open}), table j */
function gd_door(ctx,x,y,h,p,open,o){o=o||{};if(p<=0)return;const u=clamp(open||0,0,1),c=mix(dp_f("coral"),dp_f("green"),u),a=clamp(p,0,1);
  ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor=rgba(c,0.85);ctx.shadowBlur=14;ctx.fillStyle=rgba(c,1);
  // a door of light: two posts, and a leaf that swings open (it narrows as it turns)
  ctx.fillRect(x-4,y,8,6);ctx.fillRect(x-4,y+h-6,8,6);const lw=lerp(10,3,u);rr(ctx,x-lw/2+u*12,y+6,lw,h-12,3);ctx.fill();ctx.restore();
  ctx.restore();}

/* ---------------------------------------------------------------- groups and their grants */
// the groups, each at its place on the left (the pills' left end at x 80, their middle at y)
const GD_GX=80;
const GD_G={registrar_office:262,help_desk:346,planning_learner_readers:430,health_progress_study:514,"account users":598,registrar_exam_support:682,data_team:766};
const gd_gpos=k=>[GD_GX,GD_G[k]];
// a group at its place; returns its box (r: its right end)
function gd_g(ctx,k,o){const [x,y]=gd_gpos(k);return gd_group(ctx,x,y,k,o);}
const gd_gR=(ctx,k)=>gd_g(ctx,k,{measure:true}).r;
/* a grant: a line of light from a group's right end to a shelf's gate, drawn on (p 0 to 1); o.col (green), o.dash (a right to look
   only), o.a, o.bend (how far it curves) */
function gd_grant(ctx,from,to,p,o){o=o||{};p=clamp(p,0,1);if(p<=0)return;const a=o.a==null?1:o.a;if(a<=0)return;const col=o.col||"green",c=dp_f(col);
  const mx=lerp(from[0],to[0],0.55),P=[from,[mx,from[1]],[mx,to[1]],to],n=40;
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=o.lw||2.6;ctx.lineCap="round";ctx.lineJoin="round";ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=9;if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();let last=from;for(let i=0;i<=n;i++){const u=i/n;if(u>p)break;const q=gd_bez(P,u);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);last=q;}ctx.stroke();ctx.setLineDash([]);
  if(p>=1&&o.dot!==false){ctx.fillStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.beginPath();ctx.arc(to[0],to[1],6,0,TAU);ctx.fill();}
  else if(p<1){dp_halo(ctx,last[0],last[1],22,col,0.5);}
  ctx.restore();}
function gd_bez(P,u){const v=1-u;return[v*v*v*P[0][0]+3*v*v*u*P[1][0]+3*v*u*u*P[2][0]+u*u*u*P[3][0],v*v*v*P[0][1]+3*v*v*u*P[1][1]+3*v*u*u*P[2][1]+u*u*u*P[3][1]];}

/* ---------------------------------------------------------------- the old catalog, university, with every table in it
   Governed in Unity Catalog's one catalog: two shelves, prod_core and prod_marts, 58 small tables in all; each grant made on one
   table. GD_OLD lists each table's top left, its shelf and whether a person owns it (9) and has left (2) */
const GD_U={x:600,y:160,w:1240,h:690};
const GD_OLD=(()=>{const L=[],R=ag_rnd(58);let j=0;
  for(const [shelf,y0,rows,cols] of [["prod_core",290,3,13],["prod_marts",620,2,10]])for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){if(L.length>=58)break;
    if(shelf==="prod_marts"&&r===1&&q>8)continue;
    L.push({x:880+q*72,y:y0+r*56,shelf,i:L.length,lit:R()});}
  // the 58th is the new table that waits; nine owned by a person, two of whom have left
  [3,9,14,21,27,33,40,47,52].forEach((i,n)=>{L[i].person=true;L[i].left=n===2||n===6;});return L;})();
const GD_NEW=GD_OLD.length-1;
function gd_oldCatalog(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  gd_roomBox(ctx,{x:GD_U.x,y:GD_U.y,w:GD_U.w,h:GD_U.h,name:"university",plate:o.plate});
  for(const [k,y,h] of [["prod_core",264,190],["prod_marts",594,134]]){ctx.save();rr(ctx,640,y,1160,h,14);ctx.fillStyle="rgba(8,24,30,0.6)";ctx.fill();
    ctx.strokeStyle="rgba(140,186,190,0.5)";ctx.lineWidth=1.6;ctx.stroke();ctx.restore();dp_T(ctx,k,664,y+44,{w:500,size:28,f:"mono"});}
  ctx.restore();}
// one of the old catalog's tables, as a small slab: o.a, o.lit (read), o.dark (no reader yet), o.fly ([x, y, k]: where it is on its way)
function gd_oldTable(ctx,T,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const x=o.at?o.at[0]:T.x,y=o.at?o.at[1]:T.y,s=o.at?o.at[2]:1;
  gd_table(ctx,x,y,56*s,38*s,{col:o.col||(T.shelf==="prod_core"?"violet":"grey"),a,rows:o.lit==null?0.35:o.lit,dark:o.dark});}
// a person who owns a table: a small head and shoulders of light over its corner; left (0 to 1) greys it and crosses it out
function gd_owner(ctx,x,y,a,left){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const col=left>0.5?"grey":"cyan";ctx.translate(x,y);ctx.scale(0.3,0.3);dp_personPic(ctx,0,0,col);ctx.restore();
  if(left>0){ctx.save();ctx.globalAlpha*=a*clamp(left,0,1);const c=dp_f("coral");ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(x-14,y+12);ctx.lineTo(x+14,y-16);ctx.stroke();ctx.restore();}}

/* ---------------------------------------------------------------- the other areas' catalogs, small, on the left: the same shelves in each */
const GD_AREAS=[["learning",90,150],["planning",510,150],["hr",90,360],["finance",510,360]];
function gd_areaRooms(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;
  GD_AREAS.forEach(([k,x,y],i)=>{const q=a*(o.each?clamp(o.each-i*0.25,0,1):1);if(q<=0)return;ctx.save();ctx.globalAlpha*=q;
    gd_roomBox(ctx,{x,y,w:380,h:190,name:k,small:true});
    // the same shelves, as thin panes: two frosted, the others clear
    for(let s=0;s<5;s++){const sy=y+66+s*23;ctx.save();rr(ctx,x+24,sy,332,16,5);ctx.fillStyle=s<2?"rgba(110,130,134,0.35)":"rgba(8,24,30,0.7)";ctx.fill();
      ctx.strokeStyle=s===2?rgba(dp_f("violet"),0.7):"rgba(140,186,190,0.45)";ctx.lineWidth=1.2;ctx.stroke();ctx.restore();}
    ctx.restore();});}

/* ---------------------------------------------------------------- the islands on a card: a picture of the opening, small, framed in glass,
   to say "as on the islands" in the hall without leaving it. gd_postcard(ctx, x, y, w, {a, k, draw, label}): the shore painted at
   w x 9/16 w, draw(c) adds what moves, in the shore's own coordinates; label under it */
function gd_postcard(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*9/16,s=w/W;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor="rgba(120,220,230,0.35)";ctx.shadowBlur=30;rr(ctx,x-10,y-10,w+20,h+20+(o.label?64:0),20);ctx.fillStyle="rgba(6,20,26,0.8)";ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,12);ctx.clip();ctx.drawImage(dp_place0("gdShore"),x,y,w,h);if(o.draw){ctx.translate(x,y);ctx.scale(s,s);o.draw(ctx);}ctx.restore();
  rr(ctx,x-10+1,y-10+1,w+18,h+18+(o.label?64:0),20);ctx.strokeStyle=rgba(mix(dp_f("cyan"),[255,255,255],0.4),0.8);ctx.lineWidth=2;ctx.stroke();
  if(o.label)dp_T(ctx,o.label,x+w/2,y+h+44,{w:700,size:28,align:"center"});
  ctx.restore();}

/* ---------------------------------------------------------------- workspaces: where the platform is worked from
   A workspace is a room of its own on the left of the hall: its name, and inside, what it lets you do. A catalog is bound to a
   workspace by a bridge of light (read and write: green, both ways; read only: green one way, and a coral bar on the way back). */
function gd_workspace(ctx,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  gd_roomBox(ctx,{x,y,w,h,col:o.col||"cyan",lit:o.lit,plate:0});
  dp_T(ctx,"WORKSPACE",x+28,y+52,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,name,x+28,y+96,{w:500,size:34,f:"mono"});
  ctx.restore();}
// a bridge from a (a workspace's edge) to b (the catalog's wall): p draws it on; o.ro marks it read only; o.cut (0 to 1) crosses it out
function gd_bridge(ctx,a,b,p,o){o=o||{};if(p<=0)return;const al=o.a==null?1:o.a;if(al<=0)return;ctx.save();ctx.globalAlpha*=al;const c=dp_f(o.col||"green");
  const ex=lerp(a[0],b[0],p),ey=lerp(a[1],b[1],p);
  ctx.save();ctx.strokeStyle=rgba(c,0.3);ctx.lineWidth=14;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(ex,ey);ctx.stroke();
  ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=12;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(a[0],a[1]-5);ctx.lineTo(ex,ey-5);ctx.stroke();if(!o.ro){ctx.beginPath();ctx.moveTo(a[0],a[1]+5);ctx.lineTo(ex,ey+5);ctx.stroke();}ctx.restore();
  // its arrows: towards the workspace (read), and back to the catalog (write) unless read only
  if(p>=1){const ang=Math.atan2(b[1]-a[1],b[0]-a[0]),arrow=(x,y,th,col)=>{ctx.save();ctx.translate(x,y);ctx.rotate(th);ctx.fillStyle=rgba(dp_f(col),1);ctx.shadowColor=rgba(dp_f(col),0.8);ctx.shadowBlur=8;
      ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-8,-9);ctx.lineTo(-8,9);ctx.closePath();ctx.fill();ctx.restore();};
    const m=[lerp(a[0],b[0],0.35),lerp(a[1],b[1],0.35)],n=[lerp(a[0],b[0],0.65),lerp(a[1],b[1],0.65)];
    arrow(m[0]+Math.sin(ang)*5,m[1]-Math.cos(ang)*5,ang+Math.PI,o.col||"green");if(!o.ro)arrow(n[0]-Math.sin(ang)*5,n[1]+Math.cos(ang)*5,ang,o.col||"green");}
  if(o.cut>0)dp_cross(ctx,lerp(a[0],b[0],0.5),lerp(a[1],b[1],0.5),"coral",o.cut);
  ctx.restore();}

/* ---------------------------------------------------------------- the room and its readers, as one state
   gd_world(ctx, st) draws the registrar's room, its shelves, its groups and their grants as st says, so each chapter says only what
   differs and two chapters that meet draw the same picture. st.room {a, plate, lit}; st.sh[k] (gd_shelf's options, and dim: a factor
   on its opacity); st.g[k] {a, lit, dy, name} for each group shown; st.grants [{g, to, p, a, col, dash}], to a shelf's name, "browse"
   (the room's wall: a right on the catalog) or a point [x, y]; lines to one shelf share out its gate. */
const GD_BROWSE=[GD_R.x-2,644];
function gd_world(x,st){const R=st.room||{},ra=R.a==null?1:R.a;if(ra<=0)return;
  gd_roomBox(x,{name:"registrar",a:ra,plate:R.plate,lit:R.lit});
  for(const k of GD_SHELF){const o=(st.sh&&st.sh[k])||{},a=(o.a==null?1:o.a)*ra*(o.dim==null?1:o.dim);if(a<=0)continue;
    gd_shelf(x,k,Object.assign({frost:k==="staging"||k==="intermediate"},o,{a}));}
  const G=st.grants||[],cnt={},idx=[];G.forEach(g=>{const k=typeof g.to==="string"?g.to:"pt";idx.push(cnt[k]||0);cnt[k]=(cnt[k]||0)+1;});
  G.forEach((g,i)=>{const go=st.g&&st.g[g.g];if(!go)return;const from=gd_group(x,GD_GX,GD_G[g.g]+(go.dy||0),go.name||g.g,{measure:true}).r,
      to=g.to==="browse"?GD_BROWSE:typeof g.to==="string"?gd_gate(g.to,idx[i],cnt[g.to]):g.to;
    gd_grant(x,from,to,g.p==null?1:g.p,{a:(g.a==null?1:g.a)*Math.min(1,go.a==null?1:go.a),col:g.col,dash:g.dash||(g.to==="browse"?[10,9]:null)});});
  // support, the registrar's own shelf, locked to all but a few
  const so=(st.sh&&st.sh.support)||{},sa=(so.a==null?1:so.a)*ra*(so.dim==null?1:so.dim);if(sa>0&&so.lock!==0){x.save();x.globalAlpha*=sa;dp_lock(x,1770,gd_shelfMid("support")-6,40,"violet",0);x.restore();}
  for(const k of Object.keys(GD_G)){const o=st.g&&st.g[k];if(!o||!(o.a>0))continue;gd_group(x,GD_GX,GD_G[k]+(o.dy||0),o.name||k,{a:o.a,lit:o.lit});}}
// the plan's grants, as chapter 4 makes them: [group, shelf]
const GD_PLAN=[["registrar_office","reference"],["registrar_office","core"],["help_desk","core"],["planning_learner_readers","core"],["health_progress_study","core"],
  ["account users","published"],["account users","browse"],["registrar_exam_support","support"]];
// the plan as it stands from chapter 5 on: every group, every grant, every shelf named (a reference table has moved to published)
function gd_planState(o){o=o||{};const g={};for(const k of Object.keys(GD_G))g[k]={a:1};
  const sh={};for(const k of GD_SHELF)sh[k]={label:1};sh.reference.n=3;sh.published.n=4;sh.core.lit=0.85;sh.support.n=0;
  return{room:{a:1},sh,g,grants:GD_PLAN.map(([gg,to])=>({g:gg,to}))};}

// and as chapter 5 leaves it: core's new version, and the exam support table on its own shelf, both read
function gd_laterState(){const st=gd_planState();st.sh.core.n=5;st.sh.core.tables=[{},{},{},{},{lit:1}];st.sh.support.n=1;st.sh.support.tables=[{lit:1}];return st;}

/* ---------------------------------------------------------------- owners
   Who owns a thing, on a small disc of glass at its corner: what made it (a gear: the identity that runs the job), or, once it's handed
   over, a group (three small heads). GD_CHIPS: where each sits, [x, y, r]: on the catalog's plate, at each shelf's top right corner, and
   on the learner table's. gd_chip(ctx, x, y, r, u (0 the gear, 1 the group), {a, ring (0 to 1: a ring of light going out), ringCol}) */
const GD_CHIPS=[[1792,198,20]].concat(GD_SHELF.map(k=>[GD_SH.x+GD_SH.w,gd_shelfY(k),17]),[[gd_tableXY("core",1)[0]+GD_TW,gd_tableXY("core",1)[1],15]]);
function gd_chip(ctx,x,y,r,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const c=dp_f("cyan");u=clamp(u,0,1);ctx.save();ctx.globalAlpha*=a;
  if(o.ring>0&&o.ring<1){const rc=dp_f(o.ringCol||"cyan");ctx.save();ctx.globalAlpha*=1-o.ring;ctx.strokeStyle=rgba(rc,1);ctx.lineWidth=2.6;ctx.shadowColor=rgba(rc,0.8);ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(x,y,r*(1+1.3*ag_eo(o.ring)),0,TAU);ctx.stroke();ctx.restore();}
  ctx.save();ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=12;ctx.fillStyle="rgba(6,22,28,0.94)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),0.95);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r-1,0,TAU);ctx.stroke();
  const k=r/20,ink=rgba(mix(c,[255,255,255],0.3),0.95);
  if(u<1){ctx.save();ctx.globalAlpha*=1-u;ctx.translate(x,y);ctx.scale(k,k);dp_gear(ctx,0,0,11.5);ctx.fillStyle=ink;ctx.fill("evenodd");ctx.restore();}
  if(u>0){ctx.save();ctx.globalAlpha*=u;ctx.translate(x,y);ctx.scale(k,k);ctx.fillStyle=ink;ctx.strokeStyle="rgba(6,22,28,0.95)";ctx.lineWidth=1.4;
    for(const [dx,dy,s] of [[-6.6,-1.5,0.82],[6.6,-1.5,0.82],[0,1.5,1]]){ctx.beginPath();ctx.arc(dx,dy-5.6*s,3.8*s,0,TAU);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(dx-6.8*s,dy+8.5*s);ctx.quadraticCurveTo(dx-6.2*s,dy-0.4*s,dx,dy-0.4*s);ctx.quadraticCurveTo(dx+6.2*s,dy-0.4*s,dx+6.8*s,dy+8.5*s);ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.restore();}
  ctx.restore();}

/* the three doors on the way to the learner table, as one group sees them: the room's door in its left wall, the shelf's gate after its
   name, the table's own door; each numbered. d: [[p, open], [p, open], [p, open]] (drawn on, open 0 to 1); n: the numbers' opacity */
const GD_DOORS=[[GD_R.x,556,80],[1214,560,72],[1384,562,68]];
function gd_doors(ctx,d,n){d.forEach(([p,open],i)=>{if(!(p>0))return;const [x,y,h]=GD_DOORS[i];gd_door(ctx,x,y,h,p,open);
    if(n>0){ctx.save();ctx.globalAlpha*=n*clamp(p,0,1);const c=mix(dp_f("coral"),dp_f("green"),clamp(open,0,1));ctx.fillStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=10;
      ctx.beginPath();ctx.arc(x,y+h+30,18,0,TAU);ctx.fill();ctx.restore();dp_T(ctx,String(i+1),x,y+h+40,{w:800,size:28,align:"center",col:DP.on,a:n*clamp(p,0,1)});}});}

/* ===== Grants by design: the tools' pages =====
   GitHub and Databricks as the film shows them, drawn with the kit's pages (pages.js): a file tree, lines of code in the code font, each
   word in the colour of what it is (a group's name cyan, an identity; its rights green, allowed; a comment quieter), a review, and a
   catalog's permissions. Sizes in the 1920 x 1080 frame; every word 28 px or more. */

// a folder or a file, drawn in light: a folder's tab, or a page with its corner turned
function gd_fileIcon(ctx,x,y,folder,col){const c=dp_f(col||"grey");ctx.save();ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),0.95);ctx.fillStyle=rgba(c,0.22);ctx.lineWidth=2;
  if(folder){ctx.beginPath();ctx.moveTo(x,y-18);ctx.lineTo(x+10,y-18);ctx.lineTo(x+14,y-14);ctx.lineTo(x+30,y-14);ctx.lineTo(x+30,y+4);ctx.lineTo(x,y+4);ctx.closePath();ctx.fill();ctx.stroke();}
  else{ctx.beginPath();ctx.moveTo(x+4,y-20);ctx.lineTo(x+18,y-20);ctx.lineTo(x+26,y-12);ctx.lineTo(x+26,y+6);ctx.lineTo(x+4,y+6);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.restore();}
/* a file tree from (x, y), 50 apart: rows [depth, name, folder, hi (0 to 1: lit in cyan)]; o.a */
function gd_tree(ctx,x,y,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  rows.forEach(([d,name,folder,hi],i)=>{const rx=x+d*44,ry=y+i*52,h=clamp(hi||0,0,1);
    if(h>0){ctx.save();ctx.globalAlpha*=h;rr(ctx,rx-14,ry-36,dp_tw(ctx,name,{w:500,size:28,f:"mono"})+76,50,10);ctx.fillStyle=rgba(dp_f("cyan"),0.14);ctx.fill();
      ctx.strokeStyle=rgba(dp_f("cyan"),0.9);ctx.lineWidth=2;ctx.shadowColor=rgba(dp_f("cyan"),0.7);ctx.shadowBlur=10;ctx.stroke();ctx.restore();}
    gd_fileIcon(ctx,rx,ry-2,folder,h>0.5?"cyan":"grey");dp_T(ctx,name,rx+44,ry,{w:500,size:28,f:"mono",col:h>0.5?"ink":"mut"});});
  ctx.restore();}
/* lines of code from (x, y), lh apart (42): each line a list of [text, colour] pieces, drawn on in the code font; o.a, o.hi {from, to,
   a, col} lights a block of lines; o.clip [y0, y1] keeps them inside a page; returns where each line's baseline is */
function gd_code_lines(ctx,x,y,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=o.lh||42,ys=[];if(a<=0)return ys;ctx.save();ctx.globalAlpha*=a;
  if(o.clip){ctx.beginPath();ctx.rect(x-30,o.clip[0],2000,o.clip[1]-o.clip[0]);ctx.clip();}
  if(o.hi&&o.hi.a>0){const h=o.hi,c=dp_f(h.col||"cyan");ctx.save();ctx.globalAlpha*=h.a;rr(ctx,x-18,y+h.from*lh-34,h.w||800,(h.to-h.from+1)*lh+6,10);ctx.fillStyle=rgba(c,0.12);ctx.fill();
    ctx.strokeStyle=rgba(c,0.85);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
  lines.forEach((L,i)=>{const ly=y+i*lh;ys.push(ly);if(o.clip&&(ly<o.clip[0]+20||ly>o.clip[1]+6))return;let cx=x;
    for(const [s,col] of L){dp_T(ctx,s,cx,ly,{w:500,size:28,f:"mono",col:col||"ink"});cx+=dp_tw(ctx,s,{w:500,size:28,f:"mono"});}});
  ctx.restore();return ys;}
// a key: value line of the plan's YAML, its pieces coloured: indent, the key (quieter), and the value in its colour
const gd_y=(ind,key,val,col)=>[[" ".repeat(ind)+key,"mut"]].concat(val==null?[]:[[" "+val,col||"ink"]]);
const gd_yc=(ind,s)=>[[" ".repeat(ind)+s,"mut"]];
// a grant in the YAML: two lines, the group in cyan, its rights in green
const gd_yg=(ind,who)=>[[[" ".repeat(ind)+"- principal:","mut"],[" "+who,"cyan"]],[[" ".repeat(ind+2)+"privileges:","mut"],[" [USE_SCHEMA, SELECT]","green"]]];
// the registrar's schemas.yml, as far as the film reads it: the core shelf, its readers, and the study's grant made from its contract
const GD_YAML=[gd_y(0,"resources:"),gd_y(2,"schemas:"),gd_y(4,"core:"),gd_y(6,"catalog_name:","registrar"),gd_y(6,"name:","core"),gd_y(6,"grants:")]
  .concat(gd_yg(8,"registrar_office"),gd_yg(8,"help_desk"),gd_yg(8,"planning_learner_readers"),[gd_yc(8,"# Data sharing agreement 2026-14,"),gd_yc(8,"# until 30 June 2027")],gd_yg(8,"health_progress_study"));

/* ===== Grants by design: the chapters =====
   Nine chapters. The opening story on a shore of the Galápagos (gdShore), from the late 1960s to 2025; then the university's side in
   the module's hall (gdHall), where the registrar's catalog is a room of glass on the right and the groups stand on the left; the end
   comes back to the islands. In the hall the camera never cuts: each chapter glides on from where the last one left it (ag_cutInto),
   what stays stays put and only what changes fades. Words that explain sit in the frame's own space (setScreen), never below y 890. */
DP_PEOPLE.push("mei","anil");

/* ---------------------------------------------------------------- 1. The plan for the islands */
// the chapter first, so the checks find which chapter each word belongs to; its pictures follow (functions are known before they run)
scene("islands",(ctx,S,t,sc)=>{const c=id=>sc.cues[id],B=sc.cues.breath;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"gdShore",keys:[[0,980,600,1.06],[c("fear")-0.4,860,650,1.2],[c("lost")+0.2,1000,630,1.14],[c("change")+0.2,960,600,1.03]],push:0.02,d:2.0,draw:(x,tt)=>gd_islandsBefore(x,tt,sc)},
    {at:c("plan")-0.5,place:"gdShore",later:true,dis:0.6,keys:[[0,960,590,1.02],[c("guide")-0.6,900,640,1.12],[c("held")-0.2,960,600,1.03],[c("flamingos")-0.6,1560,690,1.62],[c("now")-0.4,960,600,1.03]],d:2.2,push:0.015,
      draw:(x,tt)=>{gd_islandsAfter(x,tt,sc);const nv=0.28*ag_in(tt,c("held"),14);if(nv>0){x.fillStyle=rgba([2,8,16],nv);x.fillRect(0,0,W,H);}}},
    {at:c("too")-0.5,place:"gdHall",dis:1.0,keys:[[0,1010,500,1.1]],push:0.02,draw:(x,tt)=>gd_preHall(x,tt,sc)}
  ]);
  gd_islandsCards(ctx,S,t,sc);
  if(t>B-0.2)dp_title(ctx,S,t,B,"Grants by design","Design the grants once, by area and role.","FILM 4 OF 8 · ONLY WHAT YOU MAY SEE");});

// the boats of the late 1960s, coming in one after another; then the ones that wait at anchor once the plan is made
const GD_BOATS=[[1480,604,0.5],[1700,630,0.62],[1180,616,0.55],[880,600,0.44],[1360,650,0.72]];
function gd_islandsBefore(x,tt,sc){const c=id=>sc.cues[id];
  // the boats: one far off, then more each year
  GD_BOATS.forEach(([bx,by,s],i)=>{const t0=i?c("boats")+0.2+i*0.6:-1,u=ag_eo(clamp((tt-t0)/4,0,1)),a=i?ag_in(tt,t0,0.8):1;gd_boat(x,lerp(bx+420,bx,u),by,s,{a,lamp:0.9});});
  // more boats to come, far off on the horizon, faint: thousands of visitors
  const fa=ag_io(tt,c("change")+0.2,c("plan")-1.0,0.8);if(fa>0){const R=ag_rnd(77);for(let i=0;i<12;i++){const bx=200+R()*1600,by=574+R()*22,s=0.22+R()*0.14;gd_boat(x,bx,by,s,{a:fa*ag_in(tt,c("change")+0.2+i*0.12,0.5)*0.75,lamp:0.6});}}
  // the animals, at home: sea lions on the landing rock, boobies on their nests, an iguana on a boulder
  gd_sealion(x,300,772,0.9,{lift:0.25+0.15*Math.sin(tt*0.7)});gd_sealion(x,470,784,0.72,{dir:-1});
  const gone=ag_in(tt,c("lost")+0.3,0.4);
  GD_NESTS.forEach(([nx,ny,s],i)=>{if(i===1){gd_booby(x,nx,ny,s,{a:1-gone,up:0.3});if(gone>0)gd_booby(x,nx,ny,s,{a:0,up:0});return;}gd_booby(x,nx,ny,s,{dir:nx>1000?-1:1,up:0.2+0.2*Math.sin(tt*0.5+i)});});
  if(gone>0){// the nest left empty, and the bird going for good
    x.save();x.fillStyle="rgba(150,150,140,0.35)";x.beginPath();x.ellipse(GD_NESTS[1][0],GD_NESTS[1][1]+1,24,5,0,0,TAU);x.fill();x.restore();
    const u=clamp((tt-c("lost")-0.3)/4.2,0,1);gd_flyer(x,lerp(930,1500,u),lerp(800,380,ag_eo(u)),lerp(1.0,0.5,u),tt*9,{a:1-ag_in(tt,c("lost")+3.4,1.0)});}
  gd_iguana(x,1320,830,0.8,{});
  for(let i=0;i<4;i++)gd_flamingo(x,1560+i*72,736-(i%2)*6,0.55,{dir:i%2?-1:1,dip:0.5+0.5*Math.sin(tt*0.6+i*1.7)});
  // visitors, from the boats: anywhere on the shore, a step from the nests, wearing it down; one carries off coral
  const v0=c("fear")+0.4,ws=38,wa=ag_in(tt,v0,0.8)*(1-ag_in(tt,c("plan")-1.2,0.8));
  if(wa>0){const worn=ag_in(tt,c("harm")+0.3,2.4);
    GD_WANDER.forEach((P,i)=>{const t0=v0+i*0.9,d=Math.max(0,tt-t0)*ws;if(tt<t0)return;let tot=0;for(let k=1;k<P.length;k++)tot+=Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]);
      const u=Math.min(1,d/tot);gd_worn(x,P,u,worn*wa);const q=gd_walkAt(P,u);
      gd_walker(x,q.x,q.y,gd_depth(q.y),q.dist/11,{k:i,dir:q.dir,still:u>=1,a:wa*ag_in(tt,t0,0.5)});});
    // the coral: carried back to the landing from the water's edge
    const ct=wAt(sc,"harm","coral",-0.2),cu=clamp((tt-ct)/4.2,0,1),ca=wa*ag_in(tt,ct,0.5);
    if(ca>0){const cx=lerp(1000,600,cu),cy=lerp(786,792,cu),s=gd_depth(cy);gd_walker(x,cx,cy,s,(1000-cx)/11,{k:6,dir:-1,a:ca});gd_coral(x,cx-8*s,cy-40*s,1.5*s,ca);}}
}
// the trail's groups: each a guide in front and visitors behind, walking from the landing at t0
function gd_group_walk(x,tt,t0,n,o){o=o||{};if(tt<t0)return;const sp=0.026,u0=Math.min(0.96,(tt-t0)*sp+(o.u||0));
  for(let i=n;i>=0;i--){const u=u0-i*0.024;if(u<0)continue;const p=gd_along(u),s=gd_depth(p[1]);
    gd_walker(x,p[0]+(i%2?6:-6),p[1]+(i%2?5:-2),s,u*160,{guide:i===0,k:(i+(o.k||0))%8,dir:1,a:(o.a==null?1:o.a)*ag_in(tt,t0+i*0.35,0.6)});}}
function gd_islandsAfter(x,tt,sc){const c=id=>sc.cues[id];
  // night comes on over the years: the 1970s at dusk, 2025 by night
  // the boats at anchor, lamps lit; a new boat comes in to the landing
  for(const [bx,by,s] of [[1480,604,0.5],[1180,616,0.55],[880,600,0.44]])gd_boat(x,bx,by,s,{lamp:0.9});
  const nb=c("fits")-0.2,nu=ag_eo(clamp((tt-nb)/3.6,0,1));if(tt>nb-1)gd_boat(x,lerp(1100,700,nu),lerp(650,716,nu),lerp(0.6,0.9,nu),{a:ag_in(tt,nb-1,0.8),lamp:1});
  // most of the park closed, a few sites open along their trails
  gd_zones(x,clamp((tt-c("most")-0.2)/2.4,0,1));
  // the animals, all of them where they were
  gd_sealion(x,300,772,0.9,{lift:0.25+0.15*Math.sin(tt*0.7)});gd_sealion(x,470,784,0.72,{dir:-1});
  GD_NESTS.forEach(([nx,ny,s],i)=>gd_booby(x,nx,ny,s,{dir:nx>1000?-1:1,up:0.2+0.2*Math.sin(tt*0.5+i)}));gd_iguana(x,1320,830,0.8,{});
  // flamingos at the lagoon, and from 1982 nesting beside it
  for(let i=0;i<4;i++)gd_flamingo(x,1560+i*72,736-(i%2)*6,0.55,{dir:i%2?-1:1,dip:0.5+0.5*Math.sin(tt*0.6+i*1.7)});
  const na=ag_in(tt,c("flamingos")+0.4,1.0);for(let i=0;i<3;i++)gd_sitter(x,1500+i*120,768+(i%2)*8,0.6,{dir:i===1?-1:1,a:na*ag_in(tt,c("flamingos")+0.4+i*0.5,0.8)});
  gd_trail(x,ag_sine(clamp((tt-c("sites")-0.3)/3.0,0,1)),clamp((tt-c("sites")-0.3)/3.0,0,1));
  // every group with its guide, on the trail: the first, a new one off the new boat, and in 2025 more of them
  gd_group_walk(x,tt,c("guide")-0.3,5,{});
  gd_group_walk(x,tt,c("fits")+2.6,4,{k:3});
  gd_group_walk(x,tt,c("now")+0.2,5,{k:5,u:0.16});
}
// cards over the opening, in the frame's own space: where and when, the map, the plan, its rules, and what it gave
function gd_islandsCards(ctx,S,t,sc){const c=id=>sc.cues[id];setScreen(ctx,S);
  const ka=ag_io(t,0.6,c("anywhere")-0.4,0.6);if(ka>0)dp_kicker(ctx,"Opening story","The Galápagos, late 1960s",{a:ka});
  const mp=gd_pop(t,c("far")+0.3,c("boats")+1.6);if(mp.a>0)gd_map(ctx,1240,96,600,330,{a:mp.a,k:mp.k,p:clamp((t-wAt(sc,"far","thousand",-0.3))/1.2,0,1)});
  const pc=gd_pop(t,c("plan")+0.4,c("sites")-0.4);if(pc.a>0)dp_card(ctx,72,96,900,{kick:"The plan",title:"The visits planned once, for the whole park",sub:"Galápagos National Park, on the Charles Darwin Research Station's advice"},{a:pc.a,k:pc.k});
  const R=[["Keep to the trail","keep"],["Touch nothing","touch"],["Feed nothing","feed"],["Take nothing","take"]];
  R.forEach(([s,wd],i)=>{const a=ag_io(t,wAt(sc,"rules",wd,-0.15),c("held")-0.5,0.4);if(a>0)dp_slip(ctx,72,96+i*92,s,"cyan",{a,ink:true});});
  const yc=(t0,t1,kick,title,sub)=>{const p=gd_pop(t,t0,t1);if(p.a>0)dp_card(ctx,72,96,640,{kick,title,sub},{a:p.a,k:p.k});};
  yc(c("held")+0.3,c("flamingos")-0.5,"1982","25,000 visitors","The sites they walk near pristine");
  const fl=ag_io(t,c("flamingos")+1.2,c("now")-0.6,0.5);if(fl>0)dp_slip(ctx,72,96,"Flamingos nesting again, after 14 years","cyan",{a:fl,ink:true});
  yc(c("now")+0.3,c("too")-0.6,"2025","290,404 visitors","Still on the trails, still with a guide");
}
/* the university's data, in the hall, before its plan: visitors (groups, unnamed: three small heads on glass) and tables, each
   table opened on its own: one group given one table, one waiting, one reaching a table it shouldn't; then the plan, a shelf for each
   set of readers, the tables on them and a grant on each shelf; then a new person and a new table, which fit at once */
const GD_PT=[[860,300,"violet",0,0],[1040,300,"grey",1,0],[1220,300,"violet",0,1],[860,460,"grey",1,1],[1040,460,"violet",0,2],[1220,460,"grey",2,0]];
const GD_PS=[[800,250,"violet"],[800,410,"grey"],[800,570,"grey"]],GD_PG=[340,480,620];
function gd_preHall(x,tt,sc){const c=id=>sc.cues[id],so=c("so")+0.3,lay=ag_sine(clamp((tt-so)/1.8,0,1)),tf=c("fitsdata")+0.5,in0=c("too")+0.2;
  // the shelves of the plan: records, lists, and one nobody reads
  GD_PS.forEach(([sx,sy,col],i)=>{const a=ag_in(tt,so+i*0.2,0.6);if(a<=0)return;x.save();x.globalAlpha*=a;
    if(i===2)dp_frost(x,sx,sy,760,124,null,{col:"grey",r:16});else{rr(x,sx,sy,760,124,16);x.fillStyle="rgba(8,24,30,0.62)";x.fill();x.strokeStyle=rgba(mix([120,170,176],dp_f(col),0.75),0.95);x.lineWidth=2.2;x.stroke();}x.restore();});
  // the tables: where each stood, opened on its own, and where the plan puts it
  GD_PT.forEach(([tx,ty,col,sh,k],i)=>{const dx=840+k*170,dy=GD_PS[sh][1]+25,px=lerp(tx,dx,lay),py=lerp(ty,dy,lay),
      one=i===1?ag_in(tt,wAt(sc,"opened","one",0.5),0.4):0,bad=i===4?ag_in(tt,wAt(sc,"opened","shouldn't",0.2),0.4):0,read=sh<2?ag_in(tt,so+2.2,0.6):0;
    gd_table(x,px,py,140,74,{col,a:ag_in(tt,in0+i*0.12,0.5),rows:Math.max(lerp(Math.max(one,bad),0,lay),read),dark:sh===2?0.6*lay:0});});
  // a new table on the shelf of records, read from its first minute
  const nt=ag_in(tt,tf,0.5);if(nt>0)gd_table(x,1350,lerp(215,275,ag_eo(clamp((tt-tf)/0.8,0,1))),140,74,{col:"violet",a:nt,rows:ag_in(tt,tf+0.7,0.4)});
  // the visitors
  GD_PG.forEach((y,i)=>gd_group(x,420,y,"",{a:ag_in(tt,in0+0.3+i*0.2,0.5),lit:i===0?ag_in(tt,wAt(sc,"opened","one",0.3),0.4):0}));
  // a new person joins a group, and reads what it reads at once
  const np=clamp((tt-tf-0.2)/1.0,0,1);if(np>0&&np<1){x.save();x.globalAlpha*=1-ag_in(np,0.75,0.25);x.translate(lerp(300,470,ag_sine(np)),lerp(760,620,ag_sine(np)));x.scale(0.34,0.34);dp_personPic(x,0,0,"cyan");x.restore();}
  // one table at a time: a grant to one table; a group that waits; one that reaches a table it shouldn't
  const pre=1-ag_in(tt,so,0.5),R0=[528,340],R1=[528,480],R2=[528,620];
  if(pre>0){gd_grant(x,R0,[1040,337],clamp((tt-wAt(sc,"opened","one",0.3))/0.9,0,1),{a:pre});
    const wt=ag_in(tt,wAt(sc,"opened","wait",-0.2),0.4)*pre;if(wt>0){x.save();x.globalAlpha*=wt;x.strokeStyle=rgba(DP.T.mut,0.95);x.lineWidth=3;x.lineCap="round";
      const cx=576,cy=480;x.beginPath();x.arc(cx,cy,18,0,TAU);x.stroke();const an=tt*1.4;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-11);x.moveTo(cx,cy);x.lineTo(cx+Math.cos(an)*13,cy+Math.sin(an)*13);x.stroke();x.restore();}
    gd_grant(x,R2,[1040,497],clamp((tt-wAt(sc,"opened","shouldn't",0.0))/0.9,0,1),{a:pre,col:"coral"});}
  // the plan: a grant on each shelf, never on one table
  const g=(from,to,t0)=>gd_grant(x,from,to,clamp((tt-t0)/0.9,0,1));
  if(tt>so+1.2){g(R0,[798,300],so+1.2);g(R1,[798,326],so+1.5);g(R1,[798,460],so+1.8);g(R2,[798,486],so+2.1);}
}


/* ---------------------------------------------------------------- 2. One table at a time */
scene("one",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={g:wAt(sc,"giuc","groups",-0.3),hand:c("hand")+0.4,count:c("count")+0.2,n58:wAt(sc,"count","Fifty-eight",-0.1),n163:wAt(sc,"count","hundred",-0.2),
    wait:wAt(sc,"wait","new",-0.2),own:wAt(sc,"owned","nine",-0.2),left:wAt(sc,"owned","left",-0.3),say:c("say")-0.2,move:c("move")+0.3,mei:c("mei")-0.2};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",later:true,keys:[[0,1000,520,1.0]],push:0.015,draw:(x,tt)=>gd_one(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","One table at a time",0.7,5.6);
  const uc=ag_io(t,0.9,T.say,0.5);if(uc>0)dp_page(ctx,72,214,470,76,{tool:"databricks",name:"Unity Catalog",a:uc});
  const n1=ag_io(t,T.n58,T.say+0.4,0.4),n2=ag_io(t,T.n163,T.say+0.4,0.4);if(n1>0)dp_tag(ctx,1180,64,"58 tables","grey",{a:n1});if(n2>0)dp_tag(ctx,1440,64,"163 grants","green",{a:n2});});
// the old catalog's moments: its tables, the groups, a grant at a time, the owners, the list of grants, and the move into the area catalogs
const GD_OG=[["registrar_office",380],["data_team",490],["planning_learner_readers",600]];
// the grants made by hand: [group, table], the first few slowly, then the rest
const GD_HAND=(()=>{const R=ag_rnd(163),L=[[0,4],[2,30],[0,11],[1,45],[0,19],[2,8],[1,26],[0,40],[2,52],[1,14]];while(L.length<64)L.push([Math.floor(R()*3),Math.floor(R()*57)]);return L;})();
function gd_one(x,tt,sc,T){const c=id=>sc.cues[id],out=ag_in(tt,T.move,0.6),ua=ag_in(tt,0.6,1.0)*(1-out);
  gd_oldCatalog(x,{a:ua});
  // the registrar's own catalog and the other areas', as the tables move in
  const ra=ag_in(tt,T.move+0.5,0.8);
  const land=(j)=>T.move+0.7+j*0.07+1.5,dest=[];for(const k of ["staging","intermediate","reference","core","published"])for(let j=0;j<GD_NT[k];j++)dest.push([k,j]);
  if(ra>0){const sh={};for(const k of GD_SHELF){sh[k]={label:0,tables:[]};}sh.support.a=0;
    dest.forEach(([k,j],n)=>{sh[k].tables[j]={a:ag_in(tt,land(n),0.25)};});
    gd_world(x,{room:{a:ra},sh});}
  const aa=ag_io(tt,T.move+0.8,T.mei,0.7);if(aa>0)gd_areaRooms(x,{a:aa,each:clamp((tt-T.move-0.8)*2.2,0,4)});
  // the grants, one table at a time: lines of light from a group to one table
  const la=1-ag_in(tt,T.move-0.4,0.6);
  if(la>0&&tt>T.hand)GD_HAND.forEach(([g,i],n)=>{const t0=n<10?T.hand+n*0.36:T.count+(n-10)*0.05,p=clamp((tt-t0)/(n<10?0.7:0.4),0,1);if(p<=0)return;const Tb=GD_OLD[i];
    gd_grant(x,[GD_GX+gd_group(x,0,0,GD_OG[g][0],{measure:true}).w,GD_OG[g][1]],[Tb.x,Tb.y+19],p,{a:la*(n<10?1:0.42),lw:n<10?2.6:1.6,dot:n<10});});
  // the tables: 57 at first, the 58th new and dark, waiting for its first reader; then, from the move, flying to their catalogs
  GD_OLD.forEach((Tb,i)=>{const a0=i===GD_NEW?ag_in(tt,T.wait,0.5):ag_in(tt,0.9+i*0.018,0.4);if(a0<=0)return;
    const lit=i===GD_NEW?0:0.3+0.4*(GD_HAND.some(h=>h[1]===i)&&tt>T.hand?1:0);
    const di=dest.findIndex((d,n)=>n===i),ft=T.move+0.7+(di>=0?di*0.07:(i-20)*0.03),u=clamp((tt-ft)/1.5,0,1);
    if(u<=0){gd_oldTable(x,Tb,{a:a0,lit,dark:i===GD_NEW?1:0});return;}
    if(di>=0){if(u>=1)return;const [k,j]=dest[di],[dx,dy]=gd_tableXY(k,j),e=ag_sine(u);gd_oldTable(x,Tb,{a:a0,lit,at:[lerp(Tb.x,dx,e),lerp(Tb.y,dy,e)-Math.sin(Math.PI*e)*40,lerp(1,GD_TW/56,e)]});return;}
    const A=GD_AREAS[i%4],e=ag_sine(u);gd_oldTable(x,Tb,{a:a0*(1-ag_in(u,0.7,0.3)),lit,at:[lerp(Tb.x,A[1]+160,e),lerp(Tb.y,A[2]+90,e)-Math.sin(Math.PI*e)*60,lerp(1,0.5,e)]});});
  // its owners: nine tables owned by the person who made them, two of whom have left
  const oa=ag_in(tt,T.own,0.4)*(1-out);if(oa>0)GD_OLD.forEach((Tb,i)=>{if(!Tb.person)return;const k=[3,9,14,21,27,33,40,47,52].indexOf(i);gd_owner(x,Tb.x+50,Tb.y-4,oa*ag_in(tt,T.own+k*0.14,0.3),Tb.left?ag_in(tt,T.left,0.5):0);});
  // the groups that read it
  const ga=ag_in(tt,T.g,0.5)*(1-ag_in(tt,T.say-0.5,0.4));GD_OG.forEach(([k,y],i)=>gd_group(x,GD_GX,y,k,{a:ga*ag_in(tt,T.g+i*0.2,0.4),lit:0}));
  // the new table's wait: a clock beside it, and how long
  const wa=ag_io(tt,T.wait+0.4,T.say,0.4);if(wa>0){const Tb=GD_OLD[GD_NEW];x.save();x.globalAlpha*=wa;x.strokeStyle=rgba(DP.T.mut,0.95);x.lineWidth=3;x.lineCap="round";const cx=Tb.x+86,cy=Tb.y+19,an=tt*1.3;
    x.beginPath();x.arc(cx,cy,18,0,TAU);x.stroke();x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-11);x.moveTo(cx,cy);x.lineTo(cx+Math.cos(an)*13,cy+Math.sin(an)*13);x.stroke();x.restore();
    dp_slip(x,Tb.x-200,Tb.y+62,"6 days, on average, to its first reader","grey",{a:wa,ink:true});}
  // to say who could read what: every grant read, one after another
  const pa=ag_io(tt,T.say,T.move,0.5);if(pa>0){x.save();x.globalAlpha*=pa;dp_panel(x,72,330,520,500,{col:"cyan",r:18});
    dp_T(x,"Every grant, one by one",104,386,{w:700,size:30});x.save();rr(x,96,410,472,396,10);x.clip();const off=((tt-T.say)*46)%46;
    for(let r=0;r<10;r++){const ry=420+r*46-off,R=ag_rnd(r+Math.floor((tt-T.say)*46/46)*10);x.fillStyle=rgba(DP.T.mut,0.32);x.fillRect(112,ry+12,140+R()*90,8);x.fillStyle=rgba(dp_f("green"),0.5);x.fillRect(290,ry+12,70,8);x.fillStyle=rgba(DP.T.mut,0.22);x.fillRect(380,ry+12,120+R()*50,8);}
    x.fillStyle=rgba(dp_f("cyan"),0.18);x.fillRect(96,560,472,40);x.restore();x.restore();}
  // Mei, who owns the registrar's records, and asks for a plan first
  const ma=ag_in(tt,T.mei,0.8);if(ma>0){gd_whole(x,ma,c2=>dp_person(c2,"mei",360,700,0.95,{t:tt}));
    const k=gd_pop(tt,T.mei+0.5,null);dp_card(x,600,300,380,{kick:"Data owner",title:"Mei Tanaka",sub:"Registrar's office"},{a:k.a,k:k.k});
    const pl=ag_in(tt,wAt(sc,"mei","a plan",-0.1),0.5);if(pl>0)dp_slip(x,600,520,"A plan before any grant","cyan",{a:pl,ink:true});}
}

/* ---------------------------------------------------------------- 3. Three doors to a table */
scene("doors",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={tab:wAt(sc,"levels","a table",-0.2),sch:wAt(sc,"levels","a schema",-0.2),cat:wAt(sc,"levels","a catalog",-0.2),room:wAt(sc,"room","a room",-0.2),shelf:wAt(sc,"room","a shelf",-0.2),
    g:c("three")-0.2,d1:wAt(sc,"three","into the room",-0.2),d2:wAt(sc,"three","onto the shelf",-0.2),d3:wAt(sc,"three","into the table",-0.2),
    n1:wAt(sc,"names","Use catalog",-0.1),n2:wAt(sc,"names","use schema",-0.1),n3:wAt(sc,"names","select",-0.1),trail:c("trail")-0.2,
    alone:c("alone"),none:wAt(sc,"alone","opens nothing",-0.2),browse:c("browse")-0.3,bw:wAt(sc,"browse","browse",-0.3),find:c("find")-0.2};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,1000,520,1.0],[T.tab-0.1,1290,590,1.45],[T.cat-0.2,980,540,1.0]],d:1.5,push:0.015,draw:(x,tt)=>gd_doorsDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Three doors to a table",T.room+0.2,c("three")-0.6);
  // as on the islands: a landing, a trail and a site, numbered as the doors are
  const pc=gd_pop(t,T.trail,T.alone-0.3);if(pc.a>0){gd_postcard(ctx,80,130,560,{a:pc.a,k:pc.k,label:"A landing, a trail, a site",draw:c2=>{gd_zones(c2,1,{});gd_trail(c2,1,1);gd_group_walk(c2,sc.dur,0,4,{u:0.4});}});
    [[370,764],[1000,768],[1660,724]].forEach(([px,py],i)=>{const q=ag_in(t,T.trail+0.5+i*0.5,0.4)*pc.a;if(q<=0)return;const sx=80+px*560/W,sy=130+py*560/W-34;ctx.save();ctx.globalAlpha*=q;ctx.fillStyle=rgba(dp_f("green"),1);
      ctx.shadowColor=rgba(dp_f("green"),0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(sx,sy,18,0,TAU);ctx.fill();ctx.restore();dp_T(ctx,String(i+1),sx,sy+10,{w:800,size:28,align:"center",col:DP.on,a:q});});}
  // the table, found by anyone who may browse: what it holds and who owns it, and a way to ask; its rows stay frosted
  const fc=gd_pop(t,T.find,null);if(fc.a>0){ctx.save();ctx.globalAlpha*=fc.a;ag_about(ctx,390,330,lerp(0.6,1,fc.k));dp_panel(ctx,80,120,620,420,{col:"cyan",r:20});
    dp_T(ctx,"TABLE",112,170,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,"core_learner_v1",112,218,{w:500,size:34,f:"mono"});
    dp_T(ctx,"What it holds",112,276,{w:600,size:28,col:"mut"});dp_T(ctx,"The registrar's learner records",112,314,{w:700,size:28});
    dp_T(ctx,"Owner",112,370,{w:600,size:28,col:"mut"});dp_T(ctx,"registrar_owners",112,408,{w:500,size:28,f:"mono"});
    dp_pill(ctx,112,488,"Request access","cyan",{a:ag_in(t,wAt(sc,"find","ask for it",-0.2),0.4)});ctx.restore();}});
function gd_doorsDraw(x,tt,sc,T){const c=id=>sc.cues[id];
  // the room as the last chapter left it, its shelves dimmed while one group finds its way to one table
  const dim=1-0.62*ag_in(tt,T.g,0.6)*(1-ag_in(tt,c("find")+2.8,1.0)),st={room:{a:1,lit:ag_io(tt,T.room,T.shelf+1.2,0.5)},sh:{},g:{},grants:[]};
  for(const k of GD_SHELF)st.sh[k]={label:k==="core"?1:0,dim:k==="core"?1:dim,rim:k==="core"?ag_in(tt,T.sch,0.5)*(1-ag_in(tt,T.cat,0.5))+ag_io(tt,T.shelf,T.shelf+1.5,0.4):ag_io(tt,T.shelf+0.1*GD_SHELF.indexOf(k),T.shelf+1.5,0.4)};
  st.sh.support.a=0;
  // the learner table: lit as the group reaches it, frosted again for those who may only look
  const open=ag_in(tt,T.n3+0.3,0.4)*(1-ag_in(tt,T.alone,0.4));st.sh.core.tables=[{},{lit:Math.max(open,0.15)},{},{}];
  gd_world(x,st);
  const tx=gd_tableXY("core",1);
  if(tt>T.tab-0.2){const la=ag_in(tt,T.tab,0.4);gd_label(x,"core_learner_v1",tx[0]+GD_TW/2,tx[1]-12,{align:"center",a:la});
    const tt1=ag_io(tt,T.tab+0.2,T.cat+0.6,0.4);if(tt1>0)dp_tag(x,tx[0]+GD_TW+26,tx[1]-8,"table","cyan",{a:tt1,size:28});
    const ts=ag_io(tt,T.sch,T.cat+0.6,0.4);if(ts>0)dp_tag(x,1130,gd_shelfY("core")+12,"schema","cyan",{a:ts,size:28});}
  // the demo's group: the registrar's office, then everyone in the account
  const g1=ag_in(tt,T.g,0.5)*(1-ag_in(tt,T.browse,0.4)),g2=ag_in(tt,T.browse+0.5,0.5),gy=GD_G["account users"];
  if(g1>0)gd_group(x,GD_GX,gy,"registrar_office",{a:g1,lit:open});
  if(g2>0)gd_group(x,GD_GX,gy,"account users",{a:g2});
  // the path in: through each door as it opens; with SELECT alone, it stops at the first
  const from=[GD_GX+gd_group(x,0,0,"registrar_office",{measure:true}).w,gy],P=[[GD_R.x-2,gy],[1214,gy],[1384,gy]];
  const reach=tt<T.alone?(tt<T.n1?0:tt<T.n2?1:tt<T.n3?2:3):(tt<T.none?0:0);
  const pp=clamp((tt-T.n1+0.1)/0.6,0,1)*(1-ag_in(tt,T.alone,0.3)),p2=clamp((tt-T.n2)/0.6,0,1),p3=clamp((tt-T.n3)/0.6,0,1);
  if(pp>0&&g1>0){gd_grant(x,from,P[0],pp,{a:g1,dot:false});if(p2>0)gd_grant(x,P[0],P[1],p2,{a:g1*(1-ag_in(tt,T.alone,0.3)),dot:false});if(p3>0)gd_grant(x,P[1],[tx[0],gy],p3,{a:g1*(1-ag_in(tt,T.alone,0.3))});}
  // SELECT alone: the line stops at the room's shut door
  const sa=clamp((tt-T.none+0.4)/0.7,0,1)*(1-ag_in(tt,T.browse,0.4));if(sa>0){gd_grant(x,from,[GD_R.x-30,gy],sa,{a:g1,col:"coral",dot:false});if(sa>=1)dp_cross(x,GD_R.x-56,gy-46,"coral",clamp((tt-T.none-0.3)/0.5,0,1));}
  // the doors, each opened by its right
  const dA=ag_in(tt,T.d1,0.4)*(1-ag_in(tt,c("find")+2.6,0.8));
  const o1=ag_in(tt,T.n1+0.4,0.3)*(1-ag_in(tt,T.alone,0.3)),o2=ag_in(tt,T.n2+0.4,0.3)*(1-ag_in(tt,T.alone,0.3)),o3=ag_in(tt,T.n3+0.4,0.3)*(1-ag_in(tt,T.alone,0.3));
  gd_doors(x,[[dA,o1],[ag_in(tt,T.d2,0.4)*dA,o2],[ag_in(tt,T.d3,0.4)*dA,o3]],ag_in(tt,T.d1,0.4)*(1-ag_in(tt,T.browse,0.4)));
  // the three rights, over the doors they open: USE CATALOG, USE SCHEMA, SELECT; SELECT stays without the other two
  const pY=gd_shelfY("core")-58,fade=1-ag_in(tt,T.alone,0.4),selA=ag_in(tt,T.n3,0.3)*(1-ag_in(tt,T.browse,0.4));
  dp_pill(x,GD_R.x-100,pY,"USE CATALOG","green",{a:ag_in(tt,T.n1,0.3)*fade,align:"center"});
  dp_pill(x,1214,pY,"USE SCHEMA","green",{a:ag_in(tt,T.n2,0.3)*fade,align:"center"});
  dp_pill(x,1438,pY,"SELECT","green",{a:selA,align:"center"});
  // BROWSE: on the catalog, a right to look; a dashed line to the room, the doors still shut
  const ba=ag_in(tt,T.bw,0.4)*(1-ag_in(tt,c("find")+2.6,0.8));if(ba>0){dp_pill(x,GD_R.x-100,pY,"BROWSE","green",{a:ba,align:"center"});
    gd_grant(x,[GD_GX+gd_group(x,0,0,"account users",{measure:true}).w,gy],GD_BROWSE,clamp((tt-T.bw-0.2)/0.7,0,1),{a:ba,dash:[10,9]});}
}

/* ---------------------------------------------------------------- 4. Shelves by who reads them */
scene("shelves",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={pc:c("start")+0.2,same:c("same")-0.1,stg:wAt(sc,"build","Staging",-0.1),int:wAt(sc,"build","intermediate",-0.1),core:wAt(sc,"core","Core",-0.1),ref:wAt(sc,"core","reference",-0.1),
    pub:wAt(sc,"core","published",-0.1),sup:wAt(sc,"support","support",-0.1),g:c("groups"),never:wAt(sc,"groups","never",-0.2),
    oc:wAt(sc,"office","core",-0.2),orf:wAt(sc,"office","reference",-0.2),oes:wAt(sc,"office","arrange",-0.2),hd:wAt(sc,"desk","help desk",-0.2),pl:wAt(sc,"desk","Planning",-0.2),
    pol:wAt(sc,"desk","policies",-0.2),team:c("team"),rule:wAt(sc,"rule","never",-0.3),mv:c("another")+0.3};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_shelvesDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Shelves by who reads them",0.6,T.pc+0.2);
  const pc=gd_pop(t,T.pc+0.4,T.same);if(pc.a>0)gd_postcard(ctx,80,130,560,{a:pc.a,k:pc.k,label:"Where people may walk",draw:c2=>{gd_zones(c2,1,{});gd_trail(c2,1,1);}});});
function gd_shelvesDraw(x,tt,sc,T){const c=id=>sc.cues[id];
  // the room: its shelves named as the plan names them; support, the registrar's own, comes last
  const st={room:{a:1},sh:{},g:{},grants:[]},lab={staging:T.stg,intermediate:T.int,core:-1,reference:T.ref,published:T.pub,support:T.sup};
  for(const k of GD_SHELF)st.sh[k]={label:lab[k]<0?1:ag_in(tt,lab[k],0.4),rim:k==="core"?ag_io(tt,T.core,T.core+2.6,0.5):0};
  st.sh.support.a=ag_in(tt,T.sup,0.6);st.sh.core.lit=0.3;
  // a table that needs other readers: from reference to published
  const mv=clamp((tt-T.mv)/1.8,0,1),e=ag_sine(mv);if(mv>=1){st.sh.reference.n=3;st.sh.published.n=4;}
  else{st.sh.reference.tables=[{},{},{},{a:mv>0?0:1}];}
  // the groups, and the grants the plan gives them, each as it's said
  for(const k of Object.keys(GD_G))st.g[k]={a:k==="account users"?1:ag_in(tt,T.g+0.2+Object.keys(GD_G).indexOf(k)*0.15,0.5),lit:k==="data_team"?ag_io(tt,T.team,c("rule"),0.4):0};
  const add=(g,to,t0)=>{if(tt>t0)st.grants.push({g,to,p:clamp((tt-t0)/0.8,0,1)});};
  add("account users","published",T.pub+0.3);add("account users","browse",T.pub+0.6);
  add("registrar_office","reference",T.orf);add("registrar_office","core",T.oc);add("help_desk","core",T.hd);add("planning_learner_readers","core",T.pl);add("health_progress_study","core",T.pl+1.6);
  add("registrar_exam_support","support",T.oes);
  gd_world(x,st);
  if(mv>0&&mv<1){const [ax,ay]=gd_tableXY("reference",3),[bx,by]=gd_tableXY("published",3);gd_table(x,lerp(ax,bx,e)+Math.sin(Math.PI*e)*60,lerp(ay,by,e),GD_TW,GD_TH,{col:"grey",rows:0.3});}
  // the other areas: the same shelves in every catalog
  const aa=ag_io(tt,T.same,T.sup-0.4,0.6);if(aa>0)gd_areaRooms(x,{a:aa,each:clamp((tt-T.same)*2.4,0,4)});
  // never a person: a grant to one person, struck out
  const pa=ag_io(tt,T.never,T.never+2.2,0.3);if(pa>0){x.save();x.globalAlpha*=pa;x.translate(760,470);x.scale(0.55,0.55);dp_personPic(x,0,0,"cyan");x.restore();dp_cross(x,800,440,"coral",clamp((tt-T.never-0.2)/0.5,0,1)*pa);}
  // the policies decide what each reader of core sees
  const po=ag_io(tt,T.pol,c("team")+0.6,0.4);if(po>0)dp_tag(x,1520,gd_shelfY("core")+10,"policies","violet",{a:po,size:28});
  // the data team builds in development, so here it has nothing of its own
  const ta=ag_io(tt,T.team+0.4,c("rule")+0.2,0.4);if(ta>0)dp_slip(x,370,GD_G.data_team-35,"Builds in development, on made-up records","grey",{a:ta,ink:true,size:28});
  // never on one table: a grant made straight to a table is struck out
  const ra=ag_io(tt,T.rule,T.rule+2.4,0.3);if(ra>0){const [qx,qy]=gd_tableXY("core",2);gd_grant(x,gd_group(x,GD_GX,GD_G.health_progress_study,"health_progress_study",{measure:true}).r,[qx-4,qy+26],clamp((tt-T.rule)/0.8,0,1),{a:ra,col:"coral",dot:false});
    dp_cross(x,qx+GD_TW/2,qy-6,"coral",clamp((tt-T.rule-0.7)/0.5,0,1)*ra);}
}

/* ---------------------------------------------------------------- 5. A table built tomorrow */
scene("tomorrow",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={today:wAt(sc,"reach","today",-0.2),later:wAt(sc,"reach","made later",-0.2),v:c("version")+0.3,first:wAt(sc,"version","first minute",-0.3),asks:c("asks")-0.2,
    ex:c("exam")+0.3,only:wAt(sc,"exam","only those",-0.2),nd:wAt(sc,"never","help desk",-0.2),np:wAt(sc,"never","Planning",-0.2),ns:wAt(sc,"never","the study",-0.2),
    none:wAt(sc,"never","none of them",-0.2),boat:c("boat")-0.2};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_tomorrowDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","A table built tomorrow",0.6,T.v-0.4);
  const s1=ag_io(t,T.first,T.asks,0.4);if(s1>0)dp_slip(ctx,1040,40,"Read from its first minute","green",{a:s1});
  const s2=ag_io(t,T.asks+0.3,T.ex,0.4);if(s2>0)dp_slip(ctx,1040,40,"No request, no new grant","cyan",{a:s2,ink:true});
  const pc=gd_pop(t,T.boat,null);if(pc.a>0)gd_postcard(ctx,560,96,420,{a:pc.a,k:pc.k,label:"A new boat keeps the plan",draw:c2=>{gd_zones(c2,1,{});gd_trail(c2,1,1);
    const nb=ag_eo(clamp((t-T.boat)/2.6,0,1));gd_boat(c2,lerp(1300,700,nb),lerp(640,716,nb),0.9,{lamp:1});gd_group_walk(c2,t,T.boat+2.0,4,{k:2});}});});
function gd_tomorrowDraw(x,tt,sc,T){
  const st=gd_planState();
  // a grant on a shelf reaches every table on it, today's and tomorrow's
  const flow=k=>clamp((tt-T.today-k*0.3)/0.6,0,1)*(1-ag_in(tt,T.today+2.6,0.6));st.sh.core.tables=[0,1,2,3].map(k=>({lit:0.85+0.15*flow(k)}));
  st.sh.core.n=5;const nu=ag_eo(clamp((tt-T.v)/1.2,0,1));st.sh.core.tables[4]={a:ag_in(tt,T.v,0.4),dy:lerp(-120,0,nu),lit:ag_in(tt,T.first+0.2,0.5)};
  st.sh.support.n=1;const eu=ag_eo(clamp((tt-T.ex)/1.2,0,1));st.sh.support.tables=[{a:ag_in(tt,T.ex,0.4),dy:lerp(-120,0,eu),lit:ag_in(tt,T.only+0.3,0.5)}];
  st.sh.support.rim=ag_io(tt,T.only,T.only+2.4,0.5);
  gd_world(x,st);
  // tomorrow's place on the shelf, waiting
  const sl=ag_io(tt,T.later,T.v,0.4);if(sl>0){const [qx,qy]=gd_tableXY("core",4);x.save();x.globalAlpha*=sl*(0.6+0.4*Math.sin(tt*4));x.setLineDash([8,7]);x.strokeStyle=rgba(dp_f("violet"),0.9);x.lineWidth=2.2;rr(x,qx,qy,GD_TW,GD_TH,8);x.stroke();x.restore();}
  // the new tables' names
  const [vx,vy]=gd_tableXY("core",4);gd_label(x,"core_credential_v2",vx+GD_TW,vy-12,{align:"right",a:ag_in(tt,T.v+0.8,0.4)});
  const [ex,ey]=gd_tableXY("support",0);gd_label(x,"Exam support table",ex,ey-12,{mono:false,a:ag_in(tt,T.ex+0.8,0.4)});
  // the readers of core never reach it: their way to support is shut
  const ns=[["help_desk",T.nd],["planning_learner_readers",T.np],["health_progress_study",T.ns]];
  ns.forEach(([g,t0],i)=>{const a=ag_io(tt,t0,T.none+3.0,0.4);if(a<=0)return;const fr=gd_group(x,GD_GX,GD_G[g],g,{measure:true}).r;
    gd_grant(x,fr,[GD_SH.x-40,gd_shelfMid("support")-10+i*10],clamp((tt-t0)/0.8,0,1),{a:a*0.8,col:"coral",dash:[6,8],dot:false});});
  const nx=ag_io(tt,T.none,T.none+3.0,0.4);if(nx>0)dp_cross(x,GD_SH.x-62,gd_shelfMid("support"),"coral",clamp((tt-T.none)/0.5,0,1)*nx);
}

/* ---------------------------------------------------------------- 6. Owners who don't leave */
scene("owners",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={cat:wAt(sc,"any","catalog",-0.1),shelf:wAt(sc,"any","shelf",-0.1),table:wAt(sc,"any","table",-0.1),can:wAt(sc,"any","the owner",-0.2),even:wAt(sc,"any","even",-0.2),
    first:c("first")-0.1,gcat:wAt(sc,"group","catalog",-0.1),all:wAt(sc,"group","everything",-0.1),grp:wAt(sc,"group","a group",-0.2),ro:wAt(sc,"group","registrar owners",-0.2),
    none:c("member")-0.1,sp:wAt(sc,"member","registrar loader",-0.2),builds:wAt(sc,"member","builds",-0.1),deploys:wAt(sc,"member","deploys",-0.1),
    leaves:wAt(sc,"leaves","leaves",-0.2),ntab:wAt(sc,"leaves","no table",-0.2),nper:wAt(sc,"leaves","no one person",-0.2),
    mei:c("decides")-0.3,says:wAt(sc,"kinds","Mei says",-0.2),them:wAt(sc,"kinds","the group",-0.2)};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_ownersDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Owners who don't leave",0.9,c("group")-0.4);});
function gd_ownersDraw(x,tt,sc,T){const c=id=>sc.cues[id];
  // the room as the plan left it; its readers step back, as this chapter is about who owns it
  const st=gd_laterState(),ga=1-ag_in(tt,0.3,0.6);for(const k in st.g)st.g[k].a=ga;
  gd_world(x,st);
  // who owns each thing: what made it, the job's identity (the gear); then, handed over, the group
  const ring=(t0)=>tt>t0&&tt<t0+0.9?(tt-t0)/0.9:0,grR=gd_group(x,GD_GX,300,"registrar_owners",{measure:true}).r;
  GD_CHIPS.forEach(([cx,cy,r],i)=>{const t0=i===0?T.cat:i===GD_CHIPS.length-1?T.table:T.shelf+(i-1)*0.08,a=ag_in(tt,t0,0.4);if(a<=0)return;
    // the handing over: a light from the group to each chip, which turns to the group's sign as it arrives
    const d0=T.grp+0.3+i*0.09,du=clamp((tt-d0)/0.9,0,1),u=ag_in(tt,d0+0.85,0.4);
    if(du>0&&du<1){const e=ag_sine(du),px=lerp(grR[0],cx,e),py=lerp(grR[1],cy,e)-Math.sin(Math.PI*e)*40;dp_halo(x,px,py,22,"cyan",0.6);x.save();x.fillStyle=rgba(mix(dp_f("cyan"),[255,255,255],0.5),1);x.beginPath();x.arc(px,py,4.5,0,TAU);x.fill();x.restore();}
    const rg=Math.max(ring(T.first+0.1),ring(i===0?T.gcat:T.all),ring(T.them+0.2)),rgG=ring(T.ntab+0.2);
    gd_chip(x,cx,cy,r,u,{a,ring:rgG||rg,ringCol:rgG?"green":"cyan"});});
  // the owner can do anything with it; whoever makes it owns it first
  const s1=ag_io(tt,T.can,c("group")-0.3,0.4),k1=gd_pop(tt,T.can,null).k;if(s1>0)dp_card(x,80,240,620,{kick:"Owner",title:"Can do anything with it"},{a:s1,k:k1});
  const s2=ag_io(tt,T.even,c("group")-0.3,0.4);if(s2>0)dp_slip(x,80,402,"Even let anyone read it","coral",{a:s2,ink:true});
  const s3=ag_io(tt,T.first,c("group")-0.3,0.4);if(s3>0)dp_slip(x,80,496,"Its first owner: whoever makes it","cyan",{a:s3,ink:true});
  // the group that owns it all, with no person in it: only registrar-loader
  const ga2=ag_io(tt,T.grp,T.mei-0.5,0.5);if(ga2>0)gd_group(x,GD_GX,300,"registrar_owners",{a:ga2,lit:ag_in(tt,T.ro,0.5)*(1-ag_in(tt,T.leaves,0.6))+ag_io(tt,T.ntab,T.ntab+1.6,0.4)});
  const np=ag_io(tt,T.none,T.leaves-0.6,0.4);if(np>0)dp_slip(x,grR[0]+28,265,"No person in it","cyan",{a:np,ink:true});
  const ba=ag_io(tt,T.sp,T.leaves-0.6,0.4),bk=gd_pop(tt,T.sp,null).k;if(ba>0){x.save();x.globalAlpha*=ba;ag_about(x,380,558,lerp(0.6,1,bk));
    dp_badge(x,80,372,600,372,{kind:"Service principal",pic:dp_gearPic,title:"registrar-loader",t:tt});
    dp_T(x,"Builds the tables",286,600,{w:600,size:28,col:"mut",a:ag_in(tt,T.builds,0.4)});dp_T(x,"Deploys the plan",286,644,{w:600,size:28,col:"mut",a:ag_in(tt,T.deploys,0.4)});x.restore();}
  // when someone leaves, every table keeps its owner, and no one person can open one up
  const pa=ag_in(tt,T.leaves,0.4)*(1-ag_in(tt,T.ntab+0.2,0.5));if(pa>0){const gone=ag_in(tt,T.leaves+0.5,0.5),dx=-60*ag_sine(clamp((tt-T.leaves-0.9)/1.2,0,1));
    x.save();x.globalAlpha*=pa;x.translate(260+dx,560);x.scale(0.9,0.9);dp_personPic(x,0,0,gone>0.5?"grey":"cyan");x.restore();
    if(gone>0){const cc=dp_f("coral");x.save();x.globalAlpha*=pa*gone;x.strokeStyle=rgba(cc,1);x.lineWidth=4;x.lineCap="round";x.shadowColor=rgba(cc,0.8);x.shadowBlur=8;
      x.beginPath();x.moveTo(214+dx,604);x.lineTo(214+dx+92*ag_sine(gone),604-110*ag_sine(gone));x.stroke();x.restore();}}
  const t1=ag_io(tt,T.ntab,T.mei-0.5,0.4);if(t1>0){x.save();x.globalAlpha*=t1;dp_tick(x,104,435,"green",clamp((tt-T.ntab-0.2)/0.5,0,1));x.restore();dp_slip(x,140,400,"No table left without its owner","green",{a:t1,ink:true});}
  const t2=ag_io(tt,T.nper,T.mei-0.5,0.4);if(t2>0){x.save();x.globalAlpha*=t2;dp_cross(x,104,529,"coral",clamp((tt-T.nper-0.2)/0.5,0,1));x.restore();dp_slip(x,140,494,"No one person can open one up","coral",{a:t2,ink:true});}
  // Mei decides who may see the records; the group is who may change them: two kinds of owner
  const ma=ag_in(tt,T.mei,0.8);if(ma>0){gd_whole(x,ma,c2=>dp_person(c2,"mei",360,700,0.95,{t:tt}));
    const k=gd_pop(tt,T.mei+0.5,null);gd_card(x,600,300,390,"Data owner","Mei Tanaka",[["Registrar's office",1-ag_in(tt,T.says,0.3)],["Says who may see them",ag_in(tt,T.says+0.35,0.4)]],{a:k.a,k:k.k});
    const k2=gd_pop(tt,T.them,null);if(k2.a>0)gd_card(x,600,520,390,"Catalog owner","registrar_owners",[["Who may change them",1]],{mono:true,a:k2.a,k:k2.k});}
}

/* ---------------------------------------------------------------- 7. Where it can be read from */
scene("where",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={own:wAt(sc,"bound","its own workspace",-0.2),grant:wAt(sc,"bound","a grant",-0.2),els:wAt(sc,"bound","anywhere else",-0.2),
    anil:c("study")-0.3,ws:wAt(sc,"study","a workspace",-0.2),dl:wAt(sc,"study","downloaded",-0.1),cp:wAt(sc,"study","copied out",-0.1),
    ro:c("readonly")+0.2,rd:wAt(sc,"readonly","read only",-0.2),
    reads:wAt(sc,"write","reads",-0.2),allow:wAt(sc,"write","grants allow",-0.3),never:wAt(sc,"write","never write",-0.2),what:wAt(sc,"write","whatever",-0.2),
    space:c("space")-0.1,hp:wAt(sc,"space","health progress",-0.2),made:wAt(sc,"space","made for",-0.2),del:wAt(sc,"space","deleted",-0.2),look:c("look")-0.2};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_whereDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Where it can be read from",0.9,c("study")-0.8);
  // look, don't touch: the islands' trail, on a card over the shelves nobody reads
  const pc=gd_pop(t,T.look,null);if(pc.a>0)gd_postcard(ctx,1420,270,380,{a:pc.a,k:pc.k,label:"Look, don't touch",draw:c2=>{gd_zones(c2,1,{});gd_trail(c2,1,1);gd_group_walk(c2,t,T.look-4,4,{u:0.3});}});});
function gd_whereDraw(x,tt,sc,T){const c=id=>sc.cues[id];
  // the room as the last chapter left it; the learner table lit while the study reads it
  const st=gd_laterState();for(const k in st.g)st.g[k].a=0;
  const rd=ag_io(tt,T.reads,T.space,0.4);st.sh.core.tables[1]={lit:Math.max(0.85,rd)};st.sh.core.rim=ag_io(tt,T.allow,T.space,0.4);
  gd_world(x,st);
  if(rd>0){const [qx,qy]=gd_tableXY("core",1);dp_halo(x,qx+GD_TW/2,qy+GD_TH/2,90,"violet",0.35*rd);}
  // as far as its grants allow: support stays shut to it
  const lk=ag_io(tt,T.allow,T.allow+1.6,0.4);if(lk>0)dp_halo(x,1770,gd_shelfMid("support")-6,70,"violet",0.5*lk);
  // each catalog bound to its own workspace: production reads and writes; from test, a grant opens nothing
  const out=1-ag_in(tt,c("study")-0.7,0.5);
  const pw=ag_in(tt,T.own,0.5)*out;if(pw>0){gd_workspace(x,80,230,560,220,"production",{a:pw});gd_bridge(x,[640,340],[998,340],clamp((tt-T.own-0.3)/0.8,0,1),{a:pw});}
  const tw=ag_in(tt,T.grant-0.3,0.5)*out;if(tw>0){gd_workspace(x,80,490,560,220,"test",{a:tw});dp_pill(x,108,676,"SELECT","green",{a:tw*ag_in(tt,T.grant,0.4)});
    const p=clamp((tt-T.els)/0.8,0,1);if(p>0){gd_bridge(x,[640,600],[998,600],Math.min(p,0.62),{a:tw,col:"coral",ro:true});if(p>=0.62)dp_cross(x,862,600,"coral",clamp((tt-T.els-0.55)/0.5,0,1)*tw);}}
  // Anil's study works in a workspace of its own, studies: nothing downloaded or copied out
  const aa=ag_in(tt,T.anil,0.8);if(aa>0)gd_whole(x,aa,c2=>dp_person(c2,"anil",260,860,0.72,{t:tt}));
  const sw=gd_pop(tt,T.ws,null);if(sw.a>0){x.save();x.globalAlpha*=sw.a;ag_about(x,380,255,lerp(0.7,1,sw.k));gd_workspace(x,80,100,600,310,"studies",{});
    [["Downloads",T.dl],["Exports",T.cp],["Clipboard",T.cp+0.3]].forEach(([s,t0],i)=>dp_switch(x,108,236+i*60,1-ag_in(tt,t0,0.4),{label:s}));x.restore();}
  // the registrar's catalog, bound there too, read only: read from there, never written, whatever a grant says
  const ba=ag_in(tt,T.ro,0.4);if(ba>0){const p=clamp((tt-T.ro)/0.9,0,1),wr=clamp((tt-T.never)/0.8,0,1);
    gd_bridge(x,[680,265],[998,265],p,{a:ba,ro:true,cut:wr>=0.5?clamp((tt-T.never-0.4)/0.5,0,1):0});
    dp_pill(x,839,232,"Read only","green",{a:ba*ag_in(tt,T.rd,0.4),align:"center"});
    // what's read goes to the workspace; a write is stopped on the way
    const rp=clamp((tt-T.reads-0.3)/1.1,0,1);if(rp>0&&rp<1){const px=lerp(998,680,ag_sine(rp));dp_halo(x,px,260,26,"green",0.8);}
    if(wr>0&&wr<1){const px=lerp(680,839,ag_sine(Math.min(1,wr*1.25)));dp_halo(x,px,270,26,"coral",0.8*(1-ag_in(wr,0.8,0.2)));}
    const ma=ag_in(tt,T.what,0.4);if(ma>0){const w=dp_pill(x,839,352,"MODIFY","green",{a:ma*(1-0.45*ag_in(tt,T.what+0.6,0.4)),align:"center"});dp_cross(x,839+w/2+30,340,"coral",clamp((tt-T.what-0.6)/0.5,0,1)*ma);}}
  // what it makes goes in its own space, health progress: made for its agreement, deleted when it ends
  const ca=gd_pop(tt,T.space,null);if(ca.a>0){x.save();x.globalAlpha*=ca.a;ag_about(x,720,670,lerp(0.7,1,ca.k));
    gd_roomBox(x,{x:480,y:500,w:480,h:340,name:"studies"});
    const sy=610;x.save();rr(x,504,sy,432,84,14);x.fillStyle="rgba(8,24,30,0.62)";x.fill();const hl=ag_in(tt,T.hp,0.4);x.strokeStyle=rgba(mix([120,170,176],dp_f("violet"),0.35+0.65*hl),0.6+0.4*hl);x.lineWidth=1.8+0.8*hl;x.stroke();x.restore();
    dp_T(x,"health_progress",530,sy+52,{w:500,size:28,f:"mono"});
    const nu=ag_eo(clamp((tt-T.hp-0.3)/1.0,0,1));gd_table(x,840,sy+16+lerp(-90,0,nu),GD_TW,GD_TH,{col:"violet",a:ag_in(tt,T.hp+0.3,0.4),rows:ag_in(tt,T.hp+1.2,0.5)});
    dp_T(x,"Made for agreement 2026-14",508,746,{w:600,size:28,col:"mut",a:ag_in(tt,T.made,0.4)});
    dp_T(x,"Deleted when it ends",508,790,{w:600,size:28,col:"mut",a:ag_in(tt,T.del,0.4)});x.restore();
    gd_bridge(x,[600,412],[600,498],clamp((tt-T.space-0.4)/0.7,0,1),{a:ca.a});}
}

/* ---------------------------------------------------------------- 8. Written once, kept as code */
scene("code",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={files:wAt(sc,"files","two files",-0.2),job:wAt(sc,"files","the job's code",-0.2),lines:c("lines")-0.3,few:wAt(sc,"lines","a few lines",-0.2),
    team:wAt(sc,"yes","reviews",-0.3),yes:wAt(sc,"yes","change",-0.1),told:wAt(sc,"yes","told",-0.2),con:c("contract"),agr:wAt(sc,"contract","agreement's contract",-0.2),names:wAt(sc,"contract","names it",-0.2),
    pol:wAt(sc,"after","policies",-0.2),first:wAt(sc,"after","go in first",-0.2),grant:wAt(sc,"after","its grant",-0.2),unm:wAt(sc,"after","unmasked",-0.3),
    path:c("path"),test:wAt(sc,"path","test first",-0.2),ok:wAt(sc,"path","says yes",-0.2),
    hand:c("byhand")-0.2,nob:wAt(sc,"byhand","nobody",-0.2),only:wAt(sc,"byhand","only",-0.2),main:wAt(sc,"byhand","one member",-0.2),adm:c("admin")-0.1,sw:wAt(sc,"admin","switched on",-0.2)};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_codeDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Written once, kept as code",0.6,1.8);});
// the plan's two files in GitHub, the registrar's folder of the platform's repository: [depth, name, folder]
const GD_TREE=[[0,"registrar",true],[1,"databricks.yml",false],[1,"resources",true],[2,"catalog.yml",false],[2,"schemas.yml",false],[2,"registrar_job.yml",false],[1,"src",true]];
function gd_codeDraw(x,tt,sc,T){const c=id=>sc.cues[id];
  // the room, its readers in the files now; the learner table masked by the study's policies before its grant reaches it
  const st=gd_laterState();for(const k in st.g)st.g[k].a=0;
  // the two shelves under the cards on the right let their names go as the first card comes, so no word shows through a card
  const ov=1-ag_in(tt,T.team+0.3,0.4);st.sh.staging.label=ov;st.sh.intermediate.label=ov;
  st.sh.core.rim=ag_io(tt,T.few+0.3,T.con,0.4);
  const ms=ag_io(tt,T.pol+0.4,T.path,0.5),rd=ag_io(tt,T.grant+0.6,T.path,0.4);st.sh.core.tables[1]={lit:Math.max(0.85,rd)};
  gd_world(x,st);
  if(ms>0){const [qx,qy]=gd_tableXY("core",1);dp_frost(x,qx+GD_TW*0.45,qy,GD_TW*0.55,GD_TH,null,{col:"violet",r:8,a:ms});dp_halo(x,qx+GD_TW/2,qy+GD_TH/2,80,"violet",0.3*ms*(1+ag_io(tt,T.unm,T.unm+1.2,0.3)));}
  // GitHub: the registrar's folder, then the file that names each shelf's readers
  const ga=gd_pop(tt,2.4,null).a*(1-ag_in(tt,T.hand-0.5,0.4));
  if(ga>0){x.save();x.globalAlpha*=ga;dp_page(x,60,100,900,772,{tool:"github",name:"GitHub",where:"uni-example/data-platform"});
    const ta=1-ag_in(tt,T.lines-0.3,0.3);if(ta>0){x.save();x.globalAlpha*=ta;dp_T(x,"registrar",92,234,{w:700,size:36});
      const hi=ag_in(tt,T.files,0.4),hj=0.45*ag_in(tt,T.job,0.4);gd_tree(x,100,320,GD_TREE.map((r,i)=>r.concat([i===3||i===4?hi:i===5||i===6?hj:0])),{});x.restore();}
    const fa=ag_in(tt,T.lines+0.1,0.4);if(fa>0){x.save();x.globalAlpha*=fa;dp_T(x,"resources/schemas.yml",92,234,{w:500,size:32,f:"mono"});
      // the files' code owner: the data team, who review the code (owners never review a pull request)
      const oa=ag_in(tt,T.team,0.4);if(oa>0){x.save();x.globalAlpha*=oa;dp_T(x,"Code owner",92,294,{w:600,size:28,col:"mut"});dp_T(x,"@uni-example/data-team",262,294,{w:500,size:28,f:"mono",col:"cyan"});x.restore();}
      x.fillStyle=rgba(DP.T.mut,0.35);x.fillRect(92,318,836,1.4);
      const sc4=ag_sine(clamp((tt-T.con-0.1)/1.2,0,1))*4*42,h1=ag_io(tt,T.few,T.con,0.4),h2=ag_io(tt,T.agr,T.path,0.4),h3=ag_io(tt,T.grant,T.path,0.4);
      gd_code_lines(x,104,370-sc4,GD_YAML,{lh:42,clip:[330,852],hi:h1>0?{from:2,to:11,a:h1,col:"cyan",w:820}:h2>0?{from:12,to:13+(h3>0.5?2:0),a:h2,col:"amber",w:820}:null});
      x.restore();
      // a few lines for each shelf: these are core's readers
      const lk=ag_io(tt,T.few+0.3,T.con,0.4);if(lk>0)dp_link(x,[904,606],[GD_SH.x-4,gd_shelfMid("core")],"cyan",clamp((tt-T.few-0.3)/0.6,0,1),{alpha:lk});}
    x.restore();}
  // the data team reviews each change; Mei, who decides who may see her records, is told what it touches
  const rv=gd_pop(tt,T.team+0.6,T.con-0.4);if(rv.a>0){gd_card(x,1040,236,780,"Review","Approved by the data team",[["Mei Tanaka is told what it touches",ag_in(tt,T.told,0.4)]],{a:rv.a,k:rv.k});x.save();x.globalAlpha*=rv.a;dp_tick(x,1764,290,"green",clamp((tt-T.yes-0.1)/0.6,0,1));x.restore();}
  // the study's grant, made from its agreement's contract, names it
  const cc=gd_pop(tt,T.agr,T.pol-0.6);if(cc.a>0){dp_card(x,1040,236,780,{kick:"Contract",title:"Data sharing agreement 2026-14",sub:"Until 30 June 2027"},{a:cc.a,k:cc.k,col:"amber"});
    const p=clamp((tt-T.names)/0.7,0,1);if(p>0)dp_link(x,[908,717],[1036,330],"amber",p,{alpha:cc.a});}
  // its policies first, then its grant: it never reads the table unmasked
  const s1=gd_pop(tt,T.pol,T.path-0.4);if(s1.a>0)gd_steps(x,1040,236,780,"In this order",[["The study's policies",{p:clamp((tt-T.first-0.1)/0.6,0,1)}],["Its grant",{p:clamp((tt-T.grant-0.6)/0.6,0,1),a:ag_in(tt,T.grant,0.4)}]],{a:s1.a,k:s1.k});
  // the path of From a branch to production
  const pa=gd_pop(tt,T.path+0.3,T.hand-0.4);if(pa.a>0)gd_steps(x,1040,236,780,"From a branch to production",[["Test",{p:clamp((tt-T.test-0.4)/0.6,0,1)}],["A release approver says yes",{p:clamp((tt-T.ok-0.2)/0.6,0,1)}],["Production",{p:clamp((tt-T.ok-0.9)/0.6,0,1)}]],{a:pa.a,k:pa.k});
  // nobody grants by hand: in Catalog Explorer, only the owners' group may, and its one member deploys only from main
  const da=gd_pop(tt,T.hand+0.1,null);if(da.a>0){x.save();x.globalAlpha*=da.a;ag_about(x,510,486,lerp(0.85,1,da.k));
    dp_page(x,60,100,900,772,{tool:"databricks",name:"Catalog Explorer",where:"registrar",title:"Permissions"});
    const gw=dp_pill(x,928,234,"Grant","grey",{a:0.55,align:"right"});dp_cross(x,928-gw-34,222,"coral",clamp((tt-T.nob-0.2)/0.5,0,1));
    dp_T(x,"Owner",92,302,{w:600,size:28,col:"mut"});gd_group(x,200,292,"registrar_owners",{});
    const m=s=>({mono:true,t:s});
    dp_rows(x,92,350,[{t:"Principal",w:470},{t:"Privilege",w:340}],[[m("account users"),"BROWSE"],[m("account users"),"USE CATALOG"],[m("registrar_office"),"USE CATALOG"],
      [m("registrar_exam_support"),"USE CATALOG"],[m("help_desk"),"USE CATALOG"],[m("planning_learner_readers"),"USE CATALOG"],[m("health_progress_study"),"USE CATALOG"]],{lh:58});x.restore();}
  const ob=gd_pop(tt,T.only,null);if(ob.a>0)gd_steps(x,1040,236,780,"Grants by hand",[["Only the owners' group can grant",{col:"cyan"}],["Its one member deploys only from main",{col:"cyan",a:ag_in(tt,T.main,0.4)}]],{a:ob.a,k:ob.k});
  // anything else: an admin account, switched on, approved and recorded
  const ad=gd_pop(tt,T.adm,null);if(ad.a>0){dp_card(x,1040,476,780,{kick:"Admin account",title:"Switched on, approved, recorded"},{a:ad.a,k:ad.k,col:"amber"});
    x.save();x.globalAlpha*=ad.a;dp_switch(x,1720,500,ag_in(tt,T.sw,0.5),{});x.restore();}
}

/* ---------------------------------------------------------------- 9. Back to the islands */
scene("back",(ctx,S,t,sc)=>{const c=id=>sc.cues[id],B=sc.cues.breath;
  const T={here:c("here")-0.6,ro:wAt(sc,"who","registrar's office",-0.2),st:wAt(sc,"who","the study",-0.2),agr:wAt(sc,"who","its agreement",-0.2),
    els:wAt(sc,"who","everyone else",-0.2),find:wAt(sc,"who","find",-0.2),ask:wAt(sc,"who","ask",-0.2),
    nt:wAt(sc,"every","new table",-0.2),np:wAt(sc,"every","new person",-0.2),fits:wAt(sc,"every","fits",-0.2),idea:c("idea")-0.2};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"gdShore",keys:[[0,960,600,1.03],[3.2,900,640,1.1]],d:3.0,push:0.01,draw:(x,tt)=>gd_backShore(x,tt)},
    {at:T.here,place:"gdHall",dis:1.0,keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_backHall(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Back to the islands",0.9,T.here-0.8);
  // the idea, once more, before the end card says it
  const ic=gd_pop(t,T.idea,B-0.6);if(ic.a>0)dp_card(ctx,480,40,960,{title:"Design the grants once, by area and role."},{a:ic.a,k:ic.k});
  if(t>B-0.2)dp_end(ctx,S,t,B,"Grants by design","Design the grants once, by area and role.","Film 4 of 8","Only what you may see");});
// the islands today, by night: the boats at anchor, the closed land under frost, the open trail, and every group on it with its guide
function gd_backShore(x,tt){
  for(const [bx,by,s] of [[1480,604,0.5],[1180,616,0.55],[880,600,0.44],[700,716,0.9]])gd_boat(x,bx,by,s,{lamp:1});
  gd_zones(x,1,{});
  gd_sealion(x,300,772,0.9,{lift:0.25+0.15*Math.sin(tt*0.7)});gd_sealion(x,470,784,0.72,{dir:-1});
  GD_NESTS.forEach(([nx,ny,s],i)=>gd_booby(x,nx,ny,s,{dir:nx>1000?-1:1,up:0.2+0.2*Math.sin(tt*0.5+i)}));gd_iguana(x,1320,830,0.8,{});
  for(let i=0;i<4;i++)gd_flamingo(x,1560+i*72,736-(i%2)*6,0.55,{dir:i%2?-1:1,dip:0.5+0.5*Math.sin(tt*0.6+i*1.7)});
  for(let i=0;i<3;i++)gd_sitter(x,1500+i*120,768+(i%2)*8,0.6,{dir:i===1?-1:1});
  gd_trail(x,1,1);
  gd_group_walk(x,tt,-6,5,{k:5,u:0.1});gd_group_walk(x,tt,-6,4,{k:2,u:0.5});
  x.fillStyle=rgba([2,8,16],0.28);x.fillRect(0,0,W,H);}
// the university's plan, the same: who reads what, said once more; a new table and a new person fit it from their first day
function gd_backHall(x,tt,sc,T){
  // under the end card, the room's words and panes fade, so none shows through it
  const end=1-ag_in(tt,sc.cues.breath-0.1,0.9);if(end<=0)return;x.save();x.globalAlpha*=end;
  const st=gd_laterState(),L={registrar_office:ag_io(tt,T.ro,T.st,0.4),health_progress_study:ag_io(tt,T.st,T.els,0.4),"account users":ag_io(tt,T.els,T.nt-0.3,0.4)},
    any=Math.max(...Object.values(L));
  for(const k in st.g){const l=L[k]||0;st.g[k]={a:lerp(1,0.5,any*(1-l)),lit:l};}
  st.grants.forEach(g=>{const l=L[g.g]||0;g.a=lerp(1,0.3,any*(1-l));});
  // a new table on published: everyone reads it at once
  st.sh.published.n=5;const nu=ag_eo(clamp((tt-T.nt)/1.2,0,1));st.sh.published.tables=[{},{},{},{},{a:ag_in(tt,T.nt,0.4),dy:lerp(-120,0,nu),lit:ag_in(tt,T.nt+1.0,0.5)}];
  st.sh.published.rim=ag_io(tt,T.nt+1.0,T.idea,0.5);
  // a new person in the registrar's office: reads what the office reads at once
  const pj=clamp((tt-T.np)/1.3,0,1),joined=ag_io(tt,T.np+1.2,T.idea,0.4);st.g.registrar_office.lit=Math.max(st.g.registrar_office.lit,joined);
  gd_world(x,st);
  // the study: only what its agreement allows; its policies hide the rest of the learner table
  const fr=ag_io(tt,T.agr,T.els+0.6,0.4);if(fr>0){const [qx,qy]=gd_tableXY("core",1);dp_frost(x,qx+GD_TW*0.45,qy,GD_TW*0.55,GD_TH,null,{col:"violet",r:8,a:fr});}
  if(pj>0&&pj<1){x.save();x.globalAlpha*=1-ag_in(pj,0.75,0.25);x.translate(lerp(40,112,ag_sine(pj)),lerp(380,GD_G.registrar_office+4,ag_sine(pj)));x.scale(0.34,0.34);dp_personPic(x,0,0,"cyan");x.restore();}
  x.restore();
}
ag_cutInto(["one","doors","shelves","tomorrow","owners","where","code"]);

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
