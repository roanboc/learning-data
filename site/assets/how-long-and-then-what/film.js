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

// How long, and then what, film 2 of 5 of Kept for a reason, the third series of Data protection and privacy (the module's film 19). One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"flood":{"name":"A flood of paper","lead":1.4,"tail":1.0,"vo":[
 {"id":"dc","gap":0.8,"text":"Washington, 1943.","say":"Washington, nineteen forty-three."},
 {"id":"war","gap":0.8,"text":"The country is at war, and every new office makes papers: orders, contracts, payrolls and letters."},
 {"id":"cabinets","gap":0.8,"text":"They fill steel cabinets, four drawers each, then whole rooms, then floors."},
 {"id":"flood","gap":0.8,"text":"The head of the National Archives calls it a flood: every year, enough to fill a building the size of the Archives."},
 {"id":"eighty","gap":0.8,"text":"And most of it has no lasting value: eighty percent, the Archives reckons."},
 {"id":"list","gap":0.3,"text":"But a paper may be destroyed only if it's on a list that Congress approves,"},
 {"id":"again","gap":0.8,"text":"and a list covers only the papers already there: every new pile needs a new list."},
 {"id":"kept","gap":0.8,"text":"So most papers are simply kept: nobody has time to look, or the job of deciding."},
 {"id":"cost","gap":0.8,"text":"Keeping them all costs millions in rent, staff and steel cabinets."},
 {"id":"close","gap":0.3,"text":"And when the war's offices close, their papers will be shipped away or lost, the valuable with the useless:"},
 {"id":"proof","gap":0.8,"text":"papers someone will need one day, to prove a claim or their service."},
 {"id":"change","gap":0.8,"text":"Someone has to decide what's worth keeping, before it's too late."}
]},
"before":{"name":"Decided once, before","lead":0.9,"tail":1.0,"vo":[
 {"id":"law","gap":0.8,"text":"On 7 July 1943, the President signs a law the National Archives drafted with a committee of Congress.","say":"On the seventh of July, nineteen forty-three, the President signs a law the National Archives drafted with a committee of Congress."},
 {"id":"once","gap":0.3,"text":"Each office now writes a schedule, once:"},
 {"id":"kind","gap":0.8,"text":"for each kind of record, how long it's kept, and what's done with it then."},
 {"id":"approve","gap":0.8,"text":"The Archivist and Congress approve it, and it covers papers not yet written."},
 {"id":"pile","gap":0.8,"text":"So the decision is made before the papers pile up."},
 {"id":"claim","gap":0.8,"text":"One rule: papers about money claimed, by the government or from it, stay until the claim is settled."},
 {"id":"other","gap":0.8,"text":"Another: no paper may be destroyed any other way."},
 {"id":"saved","gap":0.3,"text":"In 1944, in the Army Air Forces alone, the records program saves 927,000 dollars,","say":"In nineteen forty-four, in the Army Air Forces alone, the records program saves nine hundred and twenty-seven thousand dollars,"},
 {"id":"budget","gap":0.8,"text":"about as much as the National Archives' whole budget that year."},
 {"id":"today","gap":0.3,"text":"Today, only 1 to 3 percent of the government's papers are kept for good,","say":"Today, only one to three percent of the government's papers are kept for good,"},
 {"id":"family","gap":0.8,"text":"where families find their history, and veterans prove their service."},
 {"id":"uni","gap":0.8,"text":"Data piles up the same way: at the university, the platform keeps every record with no end date, because nobody has decided."},
 {"id":"end","gap":0.8,"text":"Like the schedules of 1943, each kind of record can have its end date, decided before it's needed.","say":"Like the schedules of nineteen forty-three, each kind of record can have its end date, decided before it's needed."}
]},
"lives":{"name":"Three stages of a record","lead":0.9,"tail":1.0,"vo":[
 {"id":"oct","gap":0.8,"text":"October 2026.","say":"October, twenty twenty-six."},
 {"id":"look","gap":0.8,"text":"Ingrid Holm, who owns HR's records, looks at what the platform holds, with Yusuf Demir from data governance."},
 {"id":"pay","gap":0.8,"text":"Pay records going back to 2016, and applications from people never hired, back to 2017.","say":"Pay records going back to twenty sixteen, and applications from people never hired, back to twenty seventeen."},
 {"id":"never","gap":0.8,"text":"Nothing has ever been deleted: every record is kept as if it were in use, forever."},
 {"id":"three","gap":0.8,"text":"But a record goes through three stages."},
 {"id":"use","gap":0.8,"text":"First, it's live: in use, read and changed often, like Linh Nguyen's pay records this year."},
 {"id":"archived","gap":0.8,"text":"Then it's archived: kept cold, read rarely, by fewer people, like her pay records from past years."},
 {"id":"deleted","gap":0.8,"text":"Then, at its end date, it's deleted."},
 {"id":"good","gap":0.8,"text":"Or, for the few with lasting value, it's kept for good, like her degrees and results."},
 {"id":"year","gap":0.8,"text":"Every year a record is kept past its reason is a year a person's details could leak, or be misused."},
 {"id":"plan","gap":0.8,"text":"But deleting without a plan is no safer: a pay record the law needs could go too."}
]},
"schedule":{"name":"One schedule, by kind of record","lead":0.9,"tail":1.0,"vo":[
 {"id":"lists","gap":0.8,"text":"Deciding record by record would never end, like Washington's lists."},
 {"id":"one","gap":0.8,"text":"So the university writes one schedule, by kind of record."},
 {"id":"row","gap":0.8,"text":"Each row names a kind of record, its owner and its reason, how long, and then what."},
 {"id":"owners","gap":0.8,"text":"Each owner decides their rows, Ingrid for HR's and Mei Tanaka for the registrar's, and Yusuf keeps the schedule."},
 {"id":"payrow","gap":0.8,"text":"Pay records, the contracts, hours and pay: the law asks for them, so 7 years after each contract ends, then deleted.","say":"Pay records, the contracts, hours and pay: the law asks for them, so seven years after each contract ends, then deleted."},
 {"id":"academic","gap":0.8,"text":"Academic records, the degrees and results: kept for good, so a graduate can always prove a degree."},
 {"id":"others","gap":0.8,"text":"The tutors' mailing list and applications from people not hired have their rows too."},
 {"id":"reason","gap":0.8,"text":"Each reason comes from A reason to keep it; each length is what that reason needs, and no longer."},
 {"id":"signed","gap":0.8,"text":"On Wednesday 14 October, the owners sign it.","say":"On Wednesday the fourteenth of October, the owners sign it."},
 {"id":"first","gap":0.3,"text":"Later that month, the first clean-up deletes what's past its date,"},
 {"id":"went","gap":0.8,"text":"pay records from 2016 to 2018, and old applications from people never hired.","say":"pay records from twenty sixteen to twenty eighteen, and old applications from people never hired."}
]},
"clock":{"name":"The clock starts at an event","lead":0.9,"tail":1.0,"vo":[
 {"id":"event","gap":0.8,"text":"How long counts from an event, not from the day a record was made."},
 {"id":"contract","gap":0.8,"text":"For pay records, it's the end of each contract."},
 {"id":"eight","gap":0.8,"text":"Linh has had eight contracts since 2023, one each semester, so her pay records have eight end dates.","say":"Linh has had eight contracts since twenty twenty-three, one each semester, so her pay records have eight end dates."},
 {"id":"firstc","gap":0.8,"text":"Her first contract ended in June 2023: its records are kept until 23 June 2030.","say":"Her first contract ended in June twenty twenty-three: its records are kept until the twenty-third of June, twenty thirty."},
 {"id":"lastc","gap":0.8,"text":"Her last ends on 20 November 2026: its records are kept until 20 November 2033.","say":"Her last ends on the twentieth of November, twenty twenty-six: its records are kept until the twentieth of November, twenty thirty-three."},
 {"id":"others","gap":0.8,"text":"For an application, the event is the decision; for the mailing list, the last contact, or a no."},
 {"id":"follows","gap":0.8,"text":"Once the event is recorded, the end date follows by itself."},
 {"id":"friday","gap":0.8,"text":"On Friday 20 November, Linh's last contract ends.","say":"On Friday the twentieth of November, Linh's last contract ends."},
 {"id":"nobody","gap":0.8,"text":"Nobody meets, and nobody has to decide: her records already know their dates."},
 {"id":"as43","gap":0.8,"text":"Decided before it was needed, as in 1943.","say":"Decided before it was needed, as in nineteen forty-three."}
]},
"hold":{"name":"A hold stops the clock","lead":0.9,"tail":1.0,"vo":[
 {"id":"stay","gap":0.8,"text":"Sometimes a record must stay past its date."},
 {"id":"tutor","gap":0.8,"text":"A former tutor says she wasn't paid for all her hours in 2019, and her claim isn't settled.","say":"A former tutor says she wasn't paid for all her hours in twenty nineteen, and her claim isn't settled."},
 {"id":"due","gap":0.8,"text":"Her pay records from 2019 are due to go in January, with the rest of that year's.","say":"Her pay records from twenty nineteen are due to go in January, with the rest of that year's."},
 {"id":"show","gap":0.8,"text":"If they went, neither she nor the university could show what was paid."},
 {"id":"places","gap":0.8,"text":"So the university's legal office places a hold."},
 {"id":"names","gap":0.8,"text":"A hold names the records it keeps, its reason, who placed it, and who may lift it."},
 {"id":"skips","gap":0.8,"text":"While it's on, the clean-up skips those records, and only those."},
 {"id":"never","gap":0.8,"text":"A hold is for a claim, an audit, or a case in court, never just in case."},
 {"id":"lifts","gap":0.8,"text":"Once the claim is settled, the legal office lifts the hold, and her records go at the next clean-up."},
 {"id":"as43","gap":0.8,"text":"As in 1943: papers about a claim stay until it's settled.","say":"As in nineteen forty-three: papers about a claim stay until it's settled."}
]},
"end":{"name":"An end date for every record","lead":0.9,"tail":1.4,"vo":[
 {"id":"short","gap":0.8,"text":"Deleted too soon, a record breaks a promise: a tutor can't show what she was paid."},
 {"id":"long","gap":0.8,"text":"Kept too long, it's a risk to the person it's about, with nothing in return."},
 {"id":"laws","gap":0.8,"text":"Many privacy laws make it a rule: keep personal data no longer than its reason needs."},
 {"id":"outside","gap":0.8,"text":"So nothing is deleted outside the schedule, and nothing stays past its date, except under a hold."},
 {"id":"copy","gap":0.8,"text":"The date holds for every copy: the platform's tables, the archive, old versions, logs."},
 {"id":"dmd","gap":0.8,"text":"How the last copy goes is Deleted means deleted."},
 {"id":"pile","gap":0.8,"text":"In 1943, Washington stopped deciding pile by pile, and decided once, before the papers piled up.","say":"In nineteen forty-three, Washington stopped deciding pile by pile, and decided once, before the papers piled up."},
 {"id":"few","gap":0.8,"text":"The few worth keeping were kept, and the rest went on time."},
 {"id":"every","gap":0.8,"text":"At the university, every record now has an end date, decided before it's needed."}
]}
};

const VODUR={"flood/dc": 2.016, "flood/war": 5.975, "flood/cabinets": 4.149, "flood/flood": 6.505, "flood/eighty": 4.567, "flood/list": 4.193, "flood/again": 4.825, "flood/kept": 5.202, "flood/cost": 3.793, "flood/close": 5.968, "flood/proof": 3.938, "flood/change": 3.442, "before/law": 7.807, "before/once": 2.057, "before/kind": 3.719, "before/approve": 4.486, "before/pile": 2.783, "before/claim": 5.964, "before/other": 2.739, "before/saved": 7.845, "before/budget": 3.344, "before/today": 4.668, "before/family": 3.668, "before/uni": 8.12, "before/end": 6.583, "lives/oct": 1.792, "lives/look": 6.972, "lives/pay": 6.723, "lives/never": 4.829, "lives/three": 2.078, "lives/use": 5.834, "lives/archived": 6.193, "lives/deleted": 2.119, "lives/good": 5.057, "lives/year": 6.182, "lives/plan": 5.049, "schedule/lists": 4.236, "schedule/one": 3.27, "schedule/row": 5.025, "schedule/owners": 7.191, "schedule/payrow": 7.781, "schedule/academic": 6.132, "schedule/others": 5.048, "schedule/reason": 5.768, "schedule/signed": 3.043, "schedule/first": 3.387, "schedule/went": 5.874, "clock/event": 3.617, "clock/contract": 2.767, "clock/eight": 6.724, "clock/firstc": 6.999, "clock/lastc": 8.013, "clock/others": 5.623, "clock/follows": 3.71, "clock/friday": 3.752, "clock/nobody": 4.754, "clock/as43": 3.497, "hold/stay": 2.608, "hold/tutor": 5.623, "hold/due": 5.068, "hold/show": 3.62, "hold/places": 2.74, "hold/names": 4.601, "hold/skips": 3.347, "hold/never": 4.493, "hold/lifts": 5.619, "hold/as43": 4.274, "end/short": 5.016, "end/long": 4.077, "end/laws": 5.462, "end/outside": 5.813, "end/copy": 5.579, "end/dmd": 3.061, "end/pile": 7.381, "end/few": 3.09, "end/every": 4.965};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the
   chapter's "breath" cue. Two wordless moments: the title card after the opening story, and the end card. The longer holds let a
   picture finish: the office filling floor by floor, the flood of a building's worth, the platform still after "Something has to change",
   the stamps landing, the drawer that fills only after its label, the drawers emptying one note at a time, the papers kept for good,
   the schedule signed and the first clean-up, Linh's eight dates, the day nobody has to decide, the hold's card, the clean-up that skips
   only her records, and the close in 1943 and at the university. */
const BREATH={
"flood":{"hold":{"dc":0.6,"war":0.4,"cabinets":0.8,"flood":1.0,"eighty":0.6,"again":0.6,"kept":0.4,"cost":0.4,"proof":0.8,"change":1.2}},
"before":{"hold":{"law":0.6,"kind":0.6,"approve":0.6,"pile":0.8,"claim":0.6,"other":0.6,"budget":0.8,"family":1.0,"uni":0.8},"breathe":4.4},
"lives":{"hold":{"oct":0.4,"look":0.4,"pay":0.6,"never":0.6,"three":0.4,"use":0.4,"archived":0.6,"deleted":0.6,"good":0.6,"year":0.8,"plan":1.0}},
"schedule":{"hold":{"lists":0.6,"one":0.4,"row":0.8,"owners":0.6,"payrow":0.8,"academic":0.6,"others":0.6,"reason":0.8,"signed":1.0,"went":1.2}},
"clock":{"hold":{"event":0.6,"contract":0.4,"eight":0.8,"firstc":0.6,"lastc":0.8,"others":0.6,"follows":0.8,"friday":0.6,"nobody":1.0,"as43":1.0}},
"hold":{"hold":{"stay":0.8,"tutor":0.8,"due":0.8,"show":0.8,"places":1.2,"names":1.0,"skips":1.0,"never":0.8,"lifts":1.0,"as43":1.0}},
"end":{"hold":{"short":0.6,"long":0.6,"laws":0.8,"outside":0.8,"copy":0.8,"dmd":0.8,"pile":0.8,"few":1.0,"every":1.0},"breathe":5.0}
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

/* ===== How long, and then what: Washington, 1943 =====
   The opening's places, each painted once, in the module's night light (Night glass): a petrol sky, stone cool, windows and lamps
   warm. Plain shapes and soft gradients, as the module's look paints the past; nothing fine enough to crawl under a slow camera.
   Everything here is this film's own (prefix hl_); the hall, the people, the cards and the words are the kit's. Each place paints the
   whole 1920 x 1080 frame and is named in AG_PLACES at the end of this file. */

/* ---------------------------------------------------------------- helpers */
// a seeded random, so a place paints the same every time
function hl_rnd(s){let x=(s>>>0)||1;return()=>{x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return x/4294967296;};}
const hl_rgb=c=>"rgb("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+")";
// a view in perspective: x = vx + f*X/Z, y = vy + f*(eye - U)/Z; metres in, pixels out
function hl_cam(vx,vy,f,eye){return{vx,vy,f,eye,p:(X,U,Z)=>[vx+f*X/Z,vy+f*(eye-U)/Z]};}
// a quad on the plane X (a wall along the view), from depth z0 to z1 and height u0 to u1
function hl_side(c,K,X,z0,z1,u0,u1){const a=K.p(X,u0,z0),b=K.p(X,u0,z1),d=K.p(X,u1,z1),e=K.p(X,u1,z0);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();}
// a quad facing us, on the plane Z
function hl_front(c,K,Z,x0,x1,u0,u1){const a=K.p(x0,u0,Z),b=K.p(x1,u1,Z);c.beginPath();c.rect(a[0],b[1],b[0]-a[0],a[1]-b[1]);}
// a quad level with the ground (or a ceiling) at height U, from x0 to x1 and z0 to z1
function hl_flat(c,K,U,x0,x1,z0,z1){const a=K.p(x0,U,z0),b=K.p(x1,U,z0),d=K.p(x1,U,z1),e=K.p(x0,U,z1);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();}
// a line between two points of the view
function hl_line(c,K,A,B,col,lw){const a=K.p(A[0],A[1],A[2]),b=K.p(B[0],B[1],B[2]);c.strokeStyle=col;c.lineWidth=lw||1;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
// a soft round glow, and one drawn out long (a light's reflection on a wet road or a polished floor)
function hl_glow(c,x,y,r,col,a){if(!(r>0)||!(a>0))return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}
function hl_streak(c,x,y,r,sx,sy,col,a){c.save();c.translate(x,y);c.scale(sx,sy);hl_glow(c,0,0,r,col,a);c.restore();}
// a vertical gradient fill of the current path, from colour a at y0 to b at y1
function hl_vfill(c,y0,y1,a,b){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,hl_rgb(a));g.addColorStop(1,hl_rgb(b));c.fillStyle=g;c.fill();}

const HL_SKY=[[0,[5,13,19]],[0.5,[12,30,38]],[0.84,[26,52,60]],[1,[42,68,72]]];
const HL_STONE={lit:[52,76,82],mid:[36,57,64],dark:[21,37,43],deep:[11,22,27],edge:"rgba(190,225,232,0.34)",soft:"rgba(170,210,220,0.16)",glass:[9,19,23]};
const HL_WARM={glow:"rgba(255,196,120,0.9)",win:[255,206,140],lamp:[255,226,178],pool:[255,200,130]};

// the night sky down to y1: the module's petrol, a few stars, a faint glow of the city low down
function hl_sky(c,w,y1,o){o=o||{};const g=c.createLinearGradient(0,0,0,y1);for(const [s,col] of (o.stops||HL_SKY))g.addColorStop(s,rgba(col,1));c.fillStyle=g;c.fillRect(0,0,w,y1);
  const R=hl_rnd(o.seed||5);for(let i=0;i<(o.stars==null?140:o.stars);i++){const x=R()*w,y=R()*y1*0.7,r=R()*1.1+0.3;c.fillStyle="rgba(210,235,240,"+(0.10+R()*0.34).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  if(o.glow){const [x,y,r]=o.glow;hl_glow(c,x,y,r,[120,168,172],0.16);}}

// a window on a wall along the view: lit (warm, the tops of filing cabinets dark across its lower part) or dark (the sky in its glass)
function hl_sideWindow(c,K,X,z0,z1,u0,u1,lit,R,o){o=o||{};
  hl_side(c,K,X,z0-0.16,z1+0.16,u0-0.24,u1+0.22);c.fillStyle=rgba(HL_STONE.lit,0.32);c.fill();
  hl_side(c,K,X,z0,z1,u0,u1);
  if(lit){const a=K.p(X,u1,z0),b=K.p(X,u0,z0),k=o.k==null?0.62+0.3*R():o.k,g=c.createLinearGradient(0,a[1],0,b[1]);
    g.addColorStop(0,rgba(HL_WARM.win,0.9*k));g.addColorStop(1,rgba([226,160,96],0.8*k));c.save();c.shadowColor=HL_WARM.glow;c.shadowBlur=o.blur||10;c.fillStyle=g;c.fill();c.restore();
    hl_side(c,K,X,z0,z1,u0,u0+(u1-u0)*0.34);c.fillStyle="rgba(46,30,20,0.78)";c.fill();
    const m=K.p(X,u0+(u1-u0)*0.62,(z0+z1)/2),wz=Math.abs(K.p(X,u0,z1)[0]-K.p(X,u0,z0)[0]);hl_glow(c,m[0],m[1],wz*0.9,[255,236,200],0.35*k);}
  else{const a=K.p(X,u1,z0),b=K.p(X,u0,z0);hl_vfill(c,a[1],b[1],[20,40,48],HL_STONE.glass);}
  const ink=lit?"rgba(110,70,36,0.6)":"rgba(150,190,200,0.16)",m=(z0+z1)/2,tu=u0+(u1-u0)*0.7;hl_line(c,K,[X,u0,m],[X,u1,m],ink,1.2);hl_line(c,K,[X,tu,z0],[X,tu,z1],ink,1.2);
  hl_line(c,K,[X-0.05,u0-0.06,z0-0.1],[X-0.05,u0-0.06,z1+0.1],HL_STONE.edge,1.2);}

/* ---------------------------------------------------------------- Washington's avenue at night, 1943 */
// One of the government's office blocks, its long side along the avenue (the plane X), from depth z0 to z1, H high: a rusticated base,
// a giant order of engaged columns over three floors of tall windows, a cornice and an attic, a tiled roof dark against the sky.
// lamps: where the street lamps stand, to light the wall's foot; win: windows asked to be lit, by "bay:floor"
function hl_govBlock(c,K,X,z0,z1,H,o){o=o||{};const R=hl_rnd(o.seed||3),bay=o.bay||4.2,base=7.4,capT=20.2,cor=22.6,n=Math.max(1,Math.round((z1-z0)/bay)),bz=(z1-z0)/n;
  hl_side(c,K,X,z0,z1,0,H);const a=K.p(X,0,z0),b=K.p(X,0,z1),g=c.createLinearGradient(a[0],0,b[0],0);g.addColorStop(0,hl_rgb(HL_STONE.lit));g.addColorStop(0.55,hl_rgb(HL_STONE.mid));g.addColorStop(1,hl_rgb(HL_STONE.dark));c.fillStyle=g;c.fill();
  c.save();hl_side(c,K,X,z0,z1,0,H);c.clip();for(const lz of (o.lamps||[])){const q=K.p(X,3.4,lz),r=K.f*6.5/lz;c.save();c.translate(q[0],q[1]);c.scale(0.7,1);hl_glow(c,0,0,r,HL_WARM.pool,0.20);c.restore();}c.restore();
  c.save();hl_side(c,K,X,z0,z1,0,base);c.clip();for(let u=0.75;u<base;u+=0.75)hl_line(c,K,[X,u,z0],[X,u,z1],"rgba(150,190,200,0.09)",1);c.restore();
  // the columns, one at each bay's edge, standing proud of the wall: lit on their near side, a shadow on the wall beyond
  for(let i=0;i<=n;i++){const zc=z0+i*bz,w2=0.5;
    hl_side(c,K,X-0.02,zc+w2,zc+w2+0.5,base+0.6,capT);c.fillStyle="rgba(8,18,22,0.35)";c.fill();
    hl_side(c,K,X-0.35,zc-w2,zc+w2,base+0.6,capT);const p0=K.p(X,0,zc-w2),p1=K.p(X,0,zc+w2),cg=c.createLinearGradient(p0[0],0,p1[0],0);
    cg.addColorStop(0,hl_rgb([84,110,114]));cg.addColorStop(0.45,hl_rgb([62,86,92]));cg.addColorStop(1,hl_rgb(HL_STONE.dark));c.fillStyle=cg;c.fill();
    hl_side(c,K,X-0.4,zc-w2-0.2,zc+w2+0.2,capT-0.75,capT);c.fillStyle=hl_rgb([72,96,100]);c.fill();hl_line(c,K,[X-0.4,capT,zc-w2-0.2],[X-0.4,capT,zc+w2+0.2],"rgba(210,236,236,0.35)",1.2);
    hl_side(c,K,X-0.4,zc-w2-0.16,zc+w2+0.16,base,base+0.6);c.fillStyle=hl_rgb(HL_STONE.mid);c.fill();}
  const floors=[[1.4,4.6,0],[5.3,6.7,1],[8.5,11.1,2],[12.3,14.9,3],[16.1,18.7,4],[23.4,24.8,5]],win=o.win||{};
  for(let i=0;i<n;i++){const zm=z0+(i+0.5)*bz,hw=Math.min(0.95,bz*0.24);for(const [u0,u1,f] of floors){const want=win[i+":"+f];
      const lit=want!=null?want:R()<(f===0?0.18:f===5?0.3:o.lit||0.55);if(o.door===i&&f===0)continue;hl_sideWindow(c,K,X-0.02,zm-hw,zm+hw,u0,u1,lit,R,{k:want?0.95:null,blur:want?16:10});}}
  if(o.door!=null){const zm=z0+(o.door+0.5)*bz;hl_side(c,K,X-0.02,zm-1.1,zm+1.1,0,5.0);c.save();c.shadowColor=HL_WARM.glow;c.shadowBlur=18;const q=K.p(X,2,zm),dg=c.createRadialGradient(q[0],q[1],2,q[0],q[1],K.f*3/zm);
    dg.addColorStop(0,"rgb(255,214,150)");dg.addColorStop(0.5,"rgb(196,132,72)");dg.addColorStop(1,"rgb(70,44,28)");c.fillStyle=dg;c.fill();c.restore();hl_side(c,K,X-0.2,zm-1.5,zm+1.5,5.0,5.6);c.fillStyle=hl_rgb(HL_STONE.deep);c.fill();}
  hl_side(c,K,X-0.3,z0,z1,capT,cor);c.fillStyle=hl_rgb([40,62,68]);c.fill();hl_line(c,K,[X-0.3,capT+0.5,z0],[X-0.3,capT+0.5,z1],"rgba(150,190,200,0.12)",1);
  hl_side(c,K,X-0.7,z0,z1,cor-0.5,cor);c.fillStyle=hl_rgb(HL_STONE.deep);c.fill();hl_line(c,K,[X-0.7,cor,z0],[X-0.7,cor,z1],HL_STONE.edge,1.6);
  const r0=K.p(X,H,z0),r1=K.p(X,H,z1),r2=K.p(X+4,H+3.2,z1),r3=K.p(X+4,H+3.2,z0);c.beginPath();c.moveTo(r0[0],r0[1]);c.lineTo(r1[0],r1[1]);c.lineTo(r2[0],r2[1]);c.lineTo(r3[0],r3[1]);c.closePath();c.fillStyle="rgb(14,24,28)";c.fill();
  hl_line(c,K,[X,H,z0],[X,H,z1],"rgba(150,190,200,0.24)",1.2);hl_line(c,K,[X+4,H+3.2,z0],[X+4,H+3.2,z1],"rgba(170,210,220,0.20)",1.2);
  hl_line(c,K,[X,0,z1],[X,H,z1],HL_STONE.soft,1.2);}

// The National Archives, closing the far end: a plain block of columns on a podium, its wide steps in the middle, a low pediment over
// the middle columns, the attic above; the doors' warm light between the middle columns, and the avenue's lamps lighting it from below.
function hl_archives(c,K,Z,x0,x1,o){o=o||{};const pod=3.0,colB=pod+0.5,capT=19.6,ent=22.4,H=29.5,xm=(x0+x1)/2;
  hl_front(c,K,Z+3,x0+1.5,x1-1.5,ent,H);let a=K.p(0,H,Z+3),b=K.p(0,ent,Z+3);hl_vfill(c,a[1],b[1],[36,56,62],[46,68,72]);
  hl_line(c,K,[x0+1.5,H,Z+3],[x1-1.5,H,Z+3],"rgba(190,225,232,0.40)",1.4);
  hl_front(c,K,Z+2.6,x0,x1,pod,capT);c.fillStyle="rgb(12,24,28)";c.fill();
  const dq=K.p(xm,pod+5,Z+2.6),dr=K.f*9/Z;hl_glow(c,dq[0],dq[1],dr,[255,200,130],0.55);
  hl_front(c,K,Z+2.6,xm-1.6,xm+1.6,pod,pod+10.5);c.save();c.shadowColor=HL_WARM.glow;c.shadowBlur=14;hl_vfill(c,K.p(0,pod+10.5,Z)[1],K.p(0,pod,Z)[1],[255,214,150],[190,128,70]);c.restore();
  hl_front(c,K,Z,x0-1.5,x1+1.5,0,pod);a=K.p(0,pod,Z);b=K.p(0,0,Z);hl_vfill(c,a[1],b[1],[58,80,84],[36,54,60]);
  for(let u=0.375;u<pod;u+=0.375)hl_line(c,K,[xm-11,u,Z-0.4],[xm+11,u,Z-0.4],u>pod-1.2?"rgba(255,214,150,0.30)":"rgba(190,225,232,0.22)",1);
  hl_line(c,K,[x0-1.5,pod,Z],[x1+1.5,pod,Z],"rgba(190,225,232,0.34)",1.4);
  for(let x=x0+1.2;x<=x1-1.0;x+=3.25){const p0=K.p(x-0.62,colB,Z),p1=K.p(x+0.62,capT,Z),w2=p1[0]-p0[0],cg=c.createLinearGradient(p0[0],0,p1[0],0),near=1-Math.min(1,Math.abs(x-xm)/7);
    cg.addColorStop(0,"rgb(34,52,58)");cg.addColorStop(0.42,near>0?hl_rgb(mix([92,116,118],[150,128,100],near*0.6)):"rgb(92,116,118)");cg.addColorStop(1,"rgb(30,48,54)");c.fillStyle=cg;c.fillRect(p0[0],p1[1],w2,p0[1]-p1[1]);
    const lg=c.createLinearGradient(0,p1[1],0,p0[1]);lg.addColorStop(0,"rgba(255,206,150,0)");lg.addColorStop(1,"rgba(255,206,150,0.22)");c.fillStyle=lg;c.fillRect(p0[0],p1[1],w2,p0[1]-p1[1]);
    const cp=K.p(x-0.95,capT-1.1,Z),cq=K.p(x+0.95,capT,Z);c.fillStyle="rgb(100,124,124)";c.fillRect(cp[0],cq[1],cq[0]-cp[0],cp[1]-cq[1]);
    const bp=K.p(x-0.85,pod,Z),bq=K.p(x+0.85,colB,Z);c.fillStyle="rgb(62,84,88)";c.fillRect(bp[0],bq[1],bq[0]-bp[0],bp[1]-bq[1]);}
  hl_front(c,K,Z,x0,x1,capT,ent);a=K.p(0,ent,Z);b=K.p(0,capT,Z);hl_vfill(c,a[1],b[1],[54,76,80],[70,92,94]);
  hl_line(c,K,[x0,ent,Z],[x1,ent,Z],"rgba(210,236,236,0.5)",1.6);hl_line(c,K,[x0,capT+0.9,Z],[x1,capT+0.9,Z],"rgba(150,190,200,0.16)",1);
  const pw=o.ped||10.5,P0=K.p(xm-pw,ent,Z),P1=K.p(xm+pw,ent,Z),P2=K.p(xm,ent+4.6,Z);c.beginPath();c.moveTo(P0[0],P0[1]);c.lineTo(P2[0],P2[1]);c.lineTo(P1[0],P1[1]);c.closePath();c.fillStyle="rgb(44,66,70)";c.fill();
  c.strokeStyle="rgba(210,236,236,0.5)";c.lineWidth=1.6;c.beginPath();c.moveTo(P0[0],P0[1]);c.lineTo(P2[0],P2[1]);c.lineTo(P1[0],P1[1]);c.stroke();}

// an elm of the Mall: a dark crown of overlapping masses on a dark trunk, its upper edge touched by the city's light
function hl_tree(c,K,X,Z,R,o){o=o||{};const s=K.f/Z,top=o.h||11,cr=o.r||4.6,cu=top-cr;
  const t0=K.p(X,0,Z),t1=K.p(X,cu-0.6,Z);c.fillStyle="rgb(8,16,19)";c.beginPath();c.moveTo(t0[0]-0.26*s,t0[1]);c.quadraticCurveTo(t1[0]-0.12*s,(t0[1]+t1[1])/2,t1[0]-0.5*s,t1[1]);c.lineTo(t1[0]+0.5*s,t1[1]);c.quadraticCurveTo(t1[0]+0.12*s,(t0[1]+t1[1])/2,t0[0]+0.26*s,t0[1]);c.closePath();c.fill();
  const q=K.p(X,cu,Z),blobs=[];for(let i=0;i<14;i++){const an=-Math.PI*(0.08+0.84*R()),d=0.25+R()*0.55;blobs.push([q[0]+Math.cos(an)*d*cr*s*1.15,q[1]+Math.sin(an)*d*cr*s*0.8+cr*s*0.22,cr*s*(0.30+R()*0.22)]);}
  for(let i=0;i<5;i++)blobs.push([q[0]+(R()-0.5)*cr*s*1.4,q[1]+cr*s*(0.25+R()*0.25),cr*s*(0.32+R()*0.15)]);
  for(const [x,y,r] of blobs){c.fillStyle="rgba(44,72,78,0.9)";c.beginPath();c.ellipse(x,y-r*0.08,r,r*0.88,0,0,TAU);c.fill();}
  for(const [x,y,r] of blobs){const gg=c.createLinearGradient(0,y-r,0,y+r);gg.addColorStop(0,"rgb(18,32,36)");gg.addColorStop(1,"rgb(6,14,17)");c.fillStyle=gg;c.beginPath();c.ellipse(x+r*0.02,y+r*0.02,r*0.95,r*0.84,0,0,TAU);c.fill();}}

// one of Washington's street lamps: a dark post and a white globe, lit, its pool on the pavement and its reflection in the wet road
function hl_lamp(c,K,X,Z){const s=K.f/Z,b=K.p(X,0,Z),t=K.p(X,4.2,Z),g=K.p(X,4.5,Z),gr=Math.max(1.5,0.24*s);
  const pl=K.p(X,0,Z);c.save();c.translate(pl[0],pl[1]);c.scale(1.9,0.42);hl_glow(c,0,0,4.2*s,HL_WARM.pool,0.20);c.restore();
  const m=K.p(X,-4.5,Z);hl_streak(c,m[0],m[1],1.6*s,0.32,2.2,HL_WARM.lamp,0.18);
  c.strokeStyle="rgb(6,12,14)";c.lineWidth=Math.max(1,0.16*s);c.beginPath();c.moveTo(b[0],b[1]);c.lineTo(t[0],t[1]);c.stroke();
  c.fillStyle="rgb(6,12,14)";c.fillRect(b[0]-0.22*s,b[1]-0.9*s,0.44*s,0.9*s);
  hl_glow(c,g[0],g[1],gr*8,HL_WARM.lamp,0.26);c.save();c.shadowColor="rgba(255,220,170,1)";c.shadowBlur=Math.min(22,gr*3.5);c.fillStyle="rgb(255,236,206)";c.beginPath();c.arc(g[0],g[1],gr,0,TAU);c.fill();c.restore();}

const HL_STREET_K=hl_cam(800,660,1000,1.6);
// where the camera goes in: a lit window on the first floor of the near block (its middle, in the frame)
const HL_STREET_WINDOW=(()=>{const K=HL_STREET_K,z=9+4*4.2+2.1,a=K.p(16,8.5,z-0.95),b=K.p(16,11.1,z+0.95);return{x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,w:Math.abs(a[0]-b[0]),h:Math.abs(a[1]-b[1])};})();
function hl_paintStreet(c,w,h){const K=HL_STREET_K,R=hl_rnd(1943),hz=K.vy;
  hl_sky(c,w,hz,{glow:[760,hz,640],stars:150});
  let g=c.createLinearGradient(0,hz,0,h);g.addColorStop(0,"rgb(18,32,36)");g.addColorStop(1,"rgb(5,11,13)");c.fillStyle=g;c.fillRect(0,hz,w,h-hz);
  hl_flat(c,K,0,-12,12,2.2,120);g=c.createLinearGradient(0,hz,0,h);g.addColorStop(0,"rgb(30,48,52)");g.addColorStop(0.35,"rgb(16,28,32)");g.addColorStop(1,"rgb(8,15,18)");c.fillStyle=g;c.fill();
  hl_flat(c,K,0,12,16,2.2,104);c.fillStyle="rgb(28,45,50)";c.fill();hl_flat(c,K,0,-16,-12,2.2,112);c.fillStyle="rgb(22,38,43)";c.fill();
  hl_flat(c,K,0,-36,24,104,118);c.fillStyle="rgb(26,42,46)";c.fill();
  hl_line(c,K,[12,0.15,2.5],[12,0.15,104],"rgba(190,225,232,0.22)",1.4);hl_line(c,K,[-12,0.15,2.5],[-12,0.15,112],"rgba(190,225,232,0.14)",1.2);
  // far off across the Mall, low lights
  for(let i=0;i<12;i++){const x=20+R()*420,y=hz-2-R()*10;hl_glow(c,x,y,5+R()*5,HL_WARM.win,0.30);}
  hl_archives(c,K,120,-36,16,{});
  hl_front(c,K,64,16,40,0,24);c.fillStyle=hl_rgb(HL_STONE.dark);c.fill();
  hl_govBlock(c,K,16,64,104,24,{seed:11,lamps:[70,80,90,100],lit:0.5});
  hl_govBlock(c,K,16,9,56,26,{seed:5,lamps:[12,22,32,42,52],door:7,win:{"4:2":true,"3:2":true,"5:2":true}});
  c.save();hl_flat(c,K,0,-12,12,2.2,120);c.clip();for(let z=12;z<60;z+=3.5){const q=K.p(15,-11,z);hl_streak(c,q[0],q[1],K.f*1.4/z,0.5,2.4,HL_WARM.win,0.10);}c.restore();
  // the elms, painted on a layer of their own and softened once, a little out of focus (one blur for the row; one for each leaf is slow)
  const trees=[[-25,64],[-24,57],[-23,50],[-22,43],[-21,36],[-20,29],[-20,22]],tl=mkCanvas(w,h),tc=tl.getContext("2d");for(const [x,z] of trees)hl_tree(tc,K,x,z,R,{h:11.5,r:4.6});
  c.save();c.filter="blur(1.4px)";c.drawImage(tl,0,0);c.restore();
  for(let z=100;z>=12;z-=10){if(z>56&&z<66)continue;hl_lamp(c,K,13.2,z);hl_lamp(c,K,-13.2,z+5);}}

/* ---------------------------------------------------------------- the office of 1943: a long room of steel filing cabinets */
// one point of view down the aisle: the cabinets along both walls, lamps hanging over the aisle, a desk and its lamp at the far end
// under a tall window. HL_OFFICE_K is its camera, so what a scene adds in the room (more cabinets, a drawer) is drawn in it.
const HL_OFFICE_K=hl_cam(1060,470,900,1.6);
const HL_STEEL={face:[74,82,70],hi:[124,128,104],lo:[34,40,36],deep:[18,22,20],brass:[218,180,110],card:[226,214,186]};
const HL_CAB=1.33;   // a cabinet's height, metres; four drawers
// one cabinet's front on a wall along the view (plane X), from depth z0 to z1, lit warm by the lamps (k, 0 to 1)
function hl_cabSide(c,K,X,z0,z1,k){const H=HL_CAB,base=0.07,dh=(H-base)/4,side=X<0?1:-1,warm=mix(HL_STEEL.face,[150,118,82],0.18*k);
  hl_side(c,K,X,z0,z1,0,H);const t=K.p(X,H,z0),b=K.p(X,0,z0);hl_vfill(c,t[1],b[1],mix(warm,HL_STEEL.hi,0.15*k),mix(warm,HL_STEEL.lo,0.55));
  for(let d=0;d<4;d++){const u0=base+d*dh+0.014,u1=base+(d+1)*dh-0.014,zm=(z0+z1)/2;
    hl_line(c,K,[X+side*0.004,u1,z0+0.02],[X+side*0.004,u1,z1-0.02],rgba(mix(HL_STEEL.hi,[255,230,190],0.3*k),0.55),1);
    hl_line(c,K,[X+side*0.004,u0,z0+0.02],[X+side*0.004,u0,z1-0.02],rgba(HL_STEEL.deep,0.7),1);
    // the label holder, a brass frame with a pale card, and under it the handle
    const lu=u0+(u1-u0)*0.70;hl_side(c,K,X+side*0.006,zm-0.05,zm+0.05,lu-0.022,lu+0.022);c.fillStyle=rgba(HL_STEEL.card,0.40+0.25*k);c.fill();
    const hu=u0+(u1-u0)*0.46;hl_side(c,K,X+side*0.012,zm-0.065,zm+0.065,hu-0.012,hu+0.012);c.fillStyle=rgba(HL_STEEL.brass,0.45+0.4*k);c.fill();}
  // the gap to the next cabinet
  hl_line(c,K,[X,0,z1],[X,H,z1],rgba(HL_STEEL.deep,0.85),1.2);}
// a cabinet's top, seen from above the aisle, with what is piled on it: transfer boxes and tied bundles of paper
function hl_cabTop(c,K,X0,X1,z0,z1,R,k){hl_flat(c,K,HL_CAB,X0,X1,z0,z1);c.fillStyle=hl_rgb(mix(HL_STEEL.lo,[90,76,56],0.25*k));c.fill();
  if(R()<0.55){const n=1+Math.floor(R()*2.2);let u=HL_CAB;for(let i=0;i<n;i++){const hh=0.18+R()*0.14,inset=0.04+R()*0.06,xa=X0<0?X1-0.04:X0+0.04,box=R()<0.6;
      const col=box?mix([120,92,62],[60,48,36],0.5-0.3*k):mix([196,186,160],[90,86,76],0.6-0.3*k);
      const xb=X0<0?X0+0.06:X1-0.06;hl_front(c,K,z0+inset,Math.min(xa,xb),Math.max(xa,xb),u,u+hh);c.fillStyle=hl_rgb(mix(col,[10,8,6],0.45));c.fill();
      hl_line(c,K,[Math.min(xa,xb),u+hh,z0+inset],[Math.max(xa,xb),u+hh,z0+inset],rgba(mix(col,[255,236,200],0.4),0.35),1);
      hl_side(c,K,xa,z0+inset,z1-inset,u,u+hh);c.fillStyle=hl_rgb(col);c.fill();
      hl_line(c,K,[xa,u+hh,z0+inset],[xa,u+hh,z1-inset],rgba(mix(col,[255,236,200],0.5),0.6),1);
      if(!box){hl_line(c,K,[xa,u+hh*0.5,z0+inset],[xa,u+hh*0.5,z1-inset],"rgba(120,80,50,0.7)",1);}
      u+=hh;}}}
// a hanging lamp over the aisle: a cord, a glass globe lit warm, its glow on the ceiling and its pool on the floor
function hl_pendant(c,K,X,U,Z,ceil){const s=K.f/Z,top=K.p(X,ceil,Z),g=K.p(X,U,Z),r=Math.max(2,0.17*s);
  c.strokeStyle="rgba(10,10,10,0.9)";c.lineWidth=Math.max(1,0.012*s);c.beginPath();c.moveTo(top[0],top[1]);c.lineTo(g[0],g[1]-r);c.stroke();
  hl_glow(c,g[0],g[1],r*9,[255,214,160],0.22);c.save();c.shadowColor="rgba(255,214,160,1)";c.shadowBlur=Math.min(30,r*2.5);
  const gg=c.createRadialGradient(g[0]-r*0.3,g[1]-r*0.3,r*0.1,g[0],g[1],r);gg.addColorStop(0,"rgb(255,246,226)");gg.addColorStop(1,"rgb(240,206,150)");c.fillStyle=gg;c.beginPath();c.arc(g[0],g[1],r,0,TAU);c.fill();c.restore();}
function hl_paintOffice(c,w,h){const K=HL_OFFICE_K,R=hl_rnd(4317),ceil=3.2,Zf=26,XW=2.5,XC=1.9,lamps=[3,7,11,15,19,23];
  // ceiling, walls above the cabinets, the far wall, the floor
  hl_flat(c,K,ceil,-XW,XW,1.0,Zf);hl_vfill(c,0,K.p(0,ceil,Zf)[1],[12,18,20],[30,34,32]);
  hl_side(c,K,-XW,1.0,Zf,HL_CAB,ceil);let a=K.p(-XW,0,1.2),b=K.p(-XW,0,Zf);let g=c.createLinearGradient(a[0],0,b[0],0);g.addColorStop(0,"rgb(26,32,32)");g.addColorStop(1,"rgb(44,46,42)");c.fillStyle=g;c.fill();
  hl_side(c,K,XW,1.0,Zf,HL_CAB,ceil);a=K.p(XW,0,1.2);b=K.p(XW,0,Zf);g=c.createLinearGradient(a[0],0,b[0],0);g.addColorStop(0,"rgb(24,30,30)");g.addColorStop(1,"rgb(44,46,42)");c.fillStyle=g;c.fill();
  hl_front(c,K,Zf,-XW,XW,0,ceil);a=K.p(0,ceil,Zf);b=K.p(0,0,Zf);hl_vfill(c,a[1],b[1],[40,42,38],[52,50,44]);
  // the tall window at the far end: the night outside, another building's lit windows, the glazing bars
  hl_front(c,K,Zf-0.01,-0.85,0.85,0.95,2.85);a=K.p(0,2.85,Zf);b=K.p(0,0.95,Zf);hl_vfill(c,a[1],b[1],[12,30,38],[30,56,62]);
  for(let i=0;i<9;i++){const X=-0.75+R()*1.5,U=1.0+R()*1.4,p=K.p(X,U,Zf-0.01);c.fillStyle=rgba(HL_WARM.win,0.55+0.3*R());c.fillRect(p[0],p[1],2.4,3.2);}
  c.strokeStyle="rgba(20,16,12,0.9)";c.lineWidth=2;for(const X of [-0.28,0.28]){const p0=K.p(X,0.95,Zf),p1=K.p(X,2.85,Zf);c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  for(const U of [1.6,2.25]){const p0=K.p(-0.85,U,Zf),p1=K.p(0.85,U,Zf);c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  // the floor: brown linoleum, its tiles' joints, and the lamps' light on it
  hl_flat(c,K,0,-XC,XC,1.0,Zf);a=K.p(0,0,Zf);hl_vfill(c,a[1],h,[54,48,40],[22,20,18]);
  c.save();hl_flat(c,K,0,-XC,XC,1.0,Zf);c.clip();for(let x=-XC;x<=XC+0.01;x+=0.475)hl_line(c,K,[x,0,1.0],[x,0,Zf],"rgba(0,0,0,0.16)",1);
  for(let z=1.2;z<Zf;z+=0.475)hl_line(c,K,[-XC,0,z],[XC,0,z],"rgba(0,0,0,0.12)",1);
  for(const z of lamps){const p=K.p(0,0,z),r=K.f*1.3/z;c.save();c.translate(p[0],p[1]);c.scale(1.4,0.36);hl_glow(c,0,0,r,[255,206,140],0.26);c.restore();}c.restore();
  // the ceiling's light round each lamp
  for(const z of lamps){const p=K.p(0,ceil,z),r=K.f*1.5/z;c.save();c.translate(p[0],p[1]);c.scale(1.5,0.4);hl_glow(c,0,0,r,[255,214,160],0.16);c.restore();}
  // the desk at the far end under the window, and its lamp
  hl_front(c,K,Zf-1.2,-0.7,0.7,0.72,0.76);c.fillStyle="rgb(70,48,32)";c.fill();hl_front(c,K,Zf-1.2,-0.66,0.66,0,0.72);c.fillStyle="rgb(40,28,20)";c.fill();
  {const p=K.p(0.42,0.98,Zf-1.3);hl_glow(c,p[0],p[1],K.f*0.9/(Zf-1.3),[255,214,150],0.5);c.fillStyle="rgb(255,226,170)";c.beginPath();c.arc(p[0],p[1],2.2,0,TAU);c.fill();}
  // the cabinets along both walls, far to near, and what is piled on them; the lamps' warmth falls off between them
  const warmth=z=>{let k=0;for(const l of lamps)k=Math.max(k,Math.exp(-Math.pow((z-l)/2.4,2)));return 0.35+0.65*k;};
  for(let z=Zf-1.6;z>=1.0;z-=0.42){const k=warmth(z);hl_cabTop(c,K,-XW,-XC,z,z+0.42,R,k);hl_cabTop(c,K,XC,XW,z,z+0.42,R,k);hl_cabSide(c,K,-XC,z,z+0.42,k);hl_cabSide(c,K,XC,z,z+0.42,k);}
  // the lamps over the aisle, far to near
  for(let i=lamps.length-1;i>=0;i--)hl_pendant(c,K,0,2.65,lamps[i],ceil);
  // a soft dark at the frame's edges, so the light reads as the lamps'
  g=c.createRadialGradient(1060,520,300,1060,520,1250);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,6,8,0.55)");c.fillStyle=g;c.fillRect(0,0,w,h);}

/* ---------------------------------------------------------------- the night, for the opening's diagrams: a building in section */
function hl_paintNight(c,w,h){hl_sky(c,w,h,{stops:[[0,[5,13,19]],[0.62,[12,30,38]],[1,[22,44,50]]],stars:120,seed:9});
  const hz=860;let g=c.createLinearGradient(0,hz,0,h);g.addColorStop(0,"rgb(16,30,34)");g.addColorStop(1,"rgb(6,12,14)");c.fillStyle=g;c.fillRect(0,hz,w,h-hz);
  c.fillStyle="rgba(190,225,232,0.26)";c.fillRect(0,hz,w,1.4);
  // the city low on the horizon, roofs and a few lit windows
  const R=hl_rnd(77);let x=-20;while(x<w){const ww=60+R()*140,hh=24+R()*70;c.fillStyle=hl_rgb(mix([12,24,28],[18,32,36],R()));c.fillRect(x,hz-hh,ww,hh);
    for(let i=0;i<3;i++)if(R()<0.6){c.fillStyle=rgba(HL_WARM.win,0.5+0.3*R());c.fillRect(x+8+R()*(ww-16),hz-hh+8+R()*(hh-16),4,6);}x+=ww+R()*30;}}

/* ---------------------------------------------------------------- a railway platform at night */
// side on: the platform's edge, a freight car on the track behind it with its door slid open, a baggage cart of crates, a lamp,
// the canopy's edge across the top, and the night over the yard
function hl_paintPlatform(c,w,h){const R=hl_rnd(1944);
  hl_sky(c,w,560,{stars:90,seed:21,glow:[300,560,420]});
  // the yard beyond: other tracks, a signal box's lit window, low sheds
  c.fillStyle="rgb(12,22,26)";c.fillRect(0,520,w,260);for(let i=0;i<6;i++){const x=40+i*130+R()*40,hh=40+R()*50;c.fillStyle="rgb(14,26,30)";c.fillRect(x,520-hh,110,hh+20);}
  hl_glow(c,640,470,40,HL_WARM.win,0.5);c.fillStyle="rgba(255,206,140,0.85)";c.fillRect(632,462,16,14);
  // the freight car: plank sides, dark red-brown in the night, its roof's edge lit, its door slid open on a dark inside
  const x0=760,x1=2000,y0=300,y1=780;c.fillStyle="rgb(58,34,28)";c.fillRect(x0,y0,x1-x0,y1-y0);
  hl_carLight(c,x0,y0,x1,y1);
  c.strokeStyle="rgba(0,0,0,0.30)";c.lineWidth=2;for(let x=x0+26;x<x1;x+=26){c.beginPath();c.moveTo(x,y0+12);c.lineTo(x,y1);c.stroke();}
  c.fillStyle="rgb(30,18,16)";c.fillRect(x0,y0-14,x1-x0,16);c.fillStyle="rgba(210,200,190,0.30)";c.fillRect(x0,y0-14,x1-x0,1.6);
  // the door opening, dark, with crates inside, and the door slid aside on its rail
  c.fillStyle="rgb(10,8,8)";c.fillRect(1120,360,330,420);for(let i=0;i<5;i++){c.fillStyle=hl_rgb(mix([40,30,22],[20,14,12],R()));c.fillRect(1130+i*62,620-((i%2)*70),58,160+((i%2)*70));}
  hl_glow(c,1280,600,180,HL_WARM.pool,0.10);
  c.fillStyle="rgb(66,40,32)";c.fillRect(1450,350,340,440);c.strokeStyle="rgba(0,0,0,0.35)";for(let x=1476;x<1790;x+=26){c.beginPath();c.moveTo(x,352);c.lineTo(x,788);c.stroke();}
  c.fillStyle="rgb(24,16,14)";c.fillRect(1100,342,720,10);
  // the platform: its stone edge catching the lamp, and the platform towards us
  c.fillStyle="rgb(30,40,40)";c.fillRect(0,770,w,310);let g=c.createLinearGradient(0,770,0,h);g.addColorStop(0,"rgb(38,48,48)");g.addColorStop(1,"rgb(12,18,18)");c.fillStyle=g;c.fillRect(0,780,w,300);
  c.fillStyle="rgba(220,226,214,0.30)";c.fillRect(0,776,w,4);c.fillStyle="rgb(18,24,24)";c.fillRect(0,770,w,6);
  // the lamp on its post, its pool on the platform
  c.save();c.translate(330,900);c.scale(2.2,0.4);hl_glow(c,0,0,260,HL_WARM.pool,0.22);c.restore();
  c.fillStyle="rgb(8,12,12)";c.fillRect(324,300,10,600);hl_glow(c,330,286,150,HL_WARM.lamp,0.30);c.save();c.shadowColor="rgba(255,220,170,1)";c.shadowBlur=24;c.fillStyle="rgb(255,232,196)";rr(c,312,262,36,46,6);c.fill();c.restore();
  c.fillStyle="rgb(8,12,12)";c.beginPath();c.moveTo(304,264);c.lineTo(330,240);c.lineTo(356,264);c.closePath();c.fill();
  // the canopy's edge across the top
  c.fillStyle="rgb(10,16,18)";c.fillRect(0,0,w,70);c.fillStyle="rgba(190,225,232,0.22)";c.fillRect(0,70,w,1.6);
  for(let x=60;x<w;x+=300){c.fillStyle="rgb(10,16,18)";c.fillRect(x,70,8,26);}
  // the baggage cart: a flat bed on two spoked wheels, its handle, crates of papers on it, one open
  const cx=420,cy=850;c.fillStyle="rgb(40,30,22)";c.fillRect(cx,cy-24,560,24);c.fillStyle="rgba(230,200,150,0.25)";c.fillRect(cx,cy-24,560,2);
  for(const wx of [cx+90,cx+470]){c.strokeStyle="rgb(14,12,10)";c.lineWidth=8;c.beginPath();c.arc(wx,cy+46,52,0,TAU);c.stroke();c.lineWidth=3;for(let k=0;k<8;k++){const an=k*TAU/8;c.beginPath();c.moveTo(wx,cy+46);c.lineTo(wx+Math.cos(an)*50,cy+46+Math.sin(an)*50);c.stroke();}}
  c.strokeStyle="rgb(14,12,10)";c.lineWidth=7;c.beginPath();c.moveTo(cx+560,cy-14);c.lineTo(cx+700,cy-190);c.stroke();
  const crates=[[cx+20,cy-24,170,150],[cx+200,cy-24,160,130],[cx+370,cy-24,170,160],[cx+60,cy-174,150,120],[cx+230,cy-154,150,110]];
  for(const [x,y,ww,hh] of crates){c.fillStyle="rgb(86,60,38)";c.fillRect(x,y-hh,ww,hh);c.fillStyle="rgba(255,220,170,0.16)";c.fillRect(x,y-hh,ww,3);
    c.strokeStyle="rgba(30,18,10,0.55)";c.lineWidth=2;for(let k=1;k<4;k++){c.beginPath();c.moveTo(x,y-hh*k/4);c.lineTo(x+ww,y-hh*k/4);c.stroke();}
    c.beginPath();c.moveTo(x+6,y-6);c.lineTo(x+ww-6,y-hh+6);c.stroke();}
  // papers showing at an open crate's top
  for(let i=0;i<6;i++){c.fillStyle=hl_rgb(mix([150,152,146],[90,92,88],R()));c.save();c.translate(cx+250+i*14,cy-264+R()*6);c.rotate((R()-0.5)*0.3);c.fillRect(-30,-8,60,12);c.restore();}}
// a freight car's light: the lamp's warmth on its near end, the night on its far end
function hl_carLight(c,x0,y0,x1,y1){const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"rgba(255,200,140,0.10)");g.addColorStop(0.5,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.25)");c.fillStyle=g;c.fillRect(x0,y0,x1-x0,y1-y0);}

/* ---------------------------------------------------------------- a desk under a lamp */
// seen from above: a walnut desk of three long boards, an oxblood leather blotter where a page will lie, a lamp's warm pool, a pile of
// manila folders at the left, a stamp and its pad and a pen at the right; the lamp itself is out of the frame. HL_DESK_PAGE is where
// the page lies.
const HL_DESK_PAGE={x:560,y:150,w:800,h:700};
function hl_paintDesk(c,w,h){const R=hl_rnd(707);let g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgb(40,27,20)");g.addColorStop(1,"rgb(30,20,15)");c.fillStyle=g;c.fillRect(0,0,w,h);
  // the boards: long soft grain, a seam between each
  for(const [y0,y1] of [[0,372],[372,724],[724,h]]){for(let i=0;i<22;i++){const y=y0+R()*(y1-y0),a=0.05+R()*0.07;c.strokeStyle=R()<0.5?"rgba(0,0,0,"+a.toFixed(3)+")":"rgba(255,214,170,"+(a*0.5).toFixed(3)+")";c.lineWidth=1+R()*2.5;
      c.beginPath();c.moveTo(-20,y);c.bezierCurveTo(w*0.3,y+(R()-0.5)*26,w*0.65,y+(R()-0.5)*26,w+20,y+(R()-0.5)*20);c.stroke();}
    c.fillStyle="rgba(0,0,0,0.45)";c.fillRect(0,y1-2,w,3);c.fillStyle="rgba(255,220,180,0.06)";c.fillRect(0,y1+1,w,1);}
  // the lamp's pool, warm, from the top right
  hl_glow(c,980,440,980,[255,200,130],0.30);hl_glow(c,960,460,520,[255,222,170],0.22);
  // the blotter: oxblood leather, a tooled line round its edge, darker leather corners
  rr(c,400,86,1120,850,6);c.save();c.shadowColor="rgba(0,0,0,0.55)";c.shadowBlur=24;c.shadowOffsetY=8;c.fillStyle="rgb(70,34,30)";c.fill();c.restore();
  c.save();rr(c,400,86,1120,850,6);c.clip();hl_glow(c,960,470,760,[255,190,130],0.22);c.restore();
  c.strokeStyle="rgba(232,190,130,0.22)";c.lineWidth=2;rr(c,420,106,1080,810,4);c.stroke();
  for(const [x,y,sx,sy] of [[400,86,1,1],[1520,86,-1,1],[400,936,1,-1],[1520,936,-1,-1]]){c.beginPath();c.moveTo(x,y);c.lineTo(x+sx*150,y);c.quadraticCurveTo(x+sx*60,y+sy*60,x,y+sy*150);c.closePath();
    c.fillStyle="rgb(40,18,16)";c.fill();c.strokeStyle="rgba(232,190,130,0.28)";c.lineWidth=1.5;c.beginPath();c.moveTo(x+sx*150,y);c.quadraticCurveTo(x+sx*60,y+sy*60,x,y+sy*150);c.stroke();}
  // a pile of manila folders at the left, part out of the frame, tied with tape
  c.save();c.translate(170,660);c.rotate(-0.08);for(let i=0;i<7;i++){const y=i*-9,col=mix([196,168,118],[150,124,84],R());c.fillStyle=hl_rgb(mix(col,[0,0,0],0.15+0.06*(6-i)));c.fillRect(-300,y-200,560,210);
      c.fillStyle="rgba(255,236,200,0.25)";c.fillRect(-300,y-200,560,2);}
  c.fillStyle="rgb(206,180,128)";c.fillRect(-300,-264,560,210);c.fillRect(120,-290,120,30);c.fillStyle="rgba(255,236,200,0.35)";c.fillRect(-300,-264,560,2);c.fillRect(120,-290,120,2);
  c.fillStyle="rgb(150,60,48)";c.fillRect(30,-266,18,276);c.restore();
  // the stamp's pad, a tin, and the stamp, its wooden knob, at the right; a pen
  rr(c,1590,640,200,126,10);c.fillStyle="rgb(22,22,24)";c.fill();rr(c,1604,654,172,98,6);c.fillStyle="rgb(40,36,48)";c.fill();c.fillStyle="rgba(255,236,210,0.18)";c.fillRect(1590,640,200,2);
  c.save();c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=14;c.shadowOffsetY=6;c.fillStyle="rgb(96,62,36)";c.beginPath();c.arc(1700,520,40,0,TAU);c.fill();c.restore();
  g=c.createRadialGradient(1688,506,4,1700,520,40);g.addColorStop(0,"rgb(170,118,70)");g.addColorStop(1,"rgb(90,58,34)");c.fillStyle=g;c.beginPath();c.arc(1700,520,38,0,TAU);c.fill();
  c.save();c.translate(1640,300);c.rotate(0.42);c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=10;c.shadowOffsetY=5;rr(c,-9,-150,18,300,9);c.fillStyle="rgb(18,14,14)";c.fill();c.restore();
  c.save();c.translate(1640,300);c.rotate(0.42);c.fillStyle="rgba(240,206,150,0.55)";c.fillRect(-3,-140,2,230);c.fillStyle="rgb(196,160,96)";c.fillRect(-9,-40,18,8);c.restore();
  // a soft dark at the edges
  g=c.createRadialGradient(960,480,400,960,480,1200);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.62)");c.fillStyle=g;c.fillRect(0,0,w,h);}

/* ---------------------------------------------------------------- the Archives' steps, today */
// close to, face on: the colonnade, its bronze doors open on a warm hall, the wide steps lit from below by two bronze lamps, the night
// over the roof. HL_STEPS_DOOR is the doors' opening, where the few folders go in.
const HL_STEPS_DOOR={x:960,y:520,w:200,h:470};
function hl_column(c,x,y0,y1,wid,inner){const cx=x+wid/2;
  // the shaft: round, lit from the doors on its inner side; its flutes faint
  let g=c.createLinearGradient(x,0,x+wid,0);const st=inner>0?[[0,"rgb(26,40,46)"],[0.55,"rgb(90,106,106)"],[0.85,"rgb(150,128,100)"],[1,"rgb(118,100,80)"]]:[[0,"rgb(118,100,80)"],[0.15,"rgb(150,128,100)"],[0.45,"rgb(90,106,106)"],[1,"rgb(26,40,46)"]];
  for(const [s,col] of st)g.addColorStop(s,col);c.fillStyle=g;c.fillRect(x,y0+60,wid,y1-y0-96);
  for(let k=1;k<8;k++){const fx=x+wid*k/8;c.fillStyle="rgba(0,0,0,0.13)";c.fillRect(fx-1.5,y0+66,3,y1-y0-108);c.fillStyle="rgba(255,236,210,0.05)";c.fillRect(fx+1.5,y0+66,1.5,y1-y0-108);}
  const lg=c.createLinearGradient(0,y0,0,y1);lg.addColorStop(0,"rgba(0,0,0,0.30)");lg.addColorStop(0.7,"rgba(0,0,0,0)");lg.addColorStop(1,"rgba(255,206,150,0.16)");c.fillStyle=lg;c.fillRect(x,y0+60,wid,y1-y0-96);
  // the capital: a bell of leaves under a square abacus
  c.beginPath();c.moveTo(x-2,y0+62);c.lineTo(x-20,y0+14);c.lineTo(x+wid+20,y0+14);c.lineTo(x+wid+2,y0+62);c.closePath();g=c.createLinearGradient(0,y0+14,0,y0+62);g.addColorStop(0,"rgb(92,112,112)");g.addColorStop(1,"rgb(56,74,78)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(0,0,0,0.25)";c.lineWidth=2;for(let k=0;k<5;k++){const lx=x-12+k*(wid+24)/4;c.beginPath();c.moveTo(lx,y0+60);c.quadraticCurveTo(lx+(cx-lx)*0.2,y0+34,lx+(lx<cx?-6:6),y0+20);c.stroke();}
  c.fillStyle="rgb(104,124,122)";c.fillRect(x-28,y0,wid+56,16);c.fillStyle="rgba(220,240,236,0.4)";c.fillRect(x-28,y0,wid+56,2);
  // the base: a round moulding on a square plinth
  c.fillStyle="rgb(70,88,90)";c.beginPath();c.ellipse(cx,y1-30,wid/2+12,10,0,0,TAU);c.fill();c.fillStyle="rgb(58,76,80)";c.fillRect(x-18,y1-24,wid+36,24);c.fillStyle="rgba(255,214,160,0.22)";c.fillRect(x-18,y1-24,wid+36,2);}
function hl_paintSteps(c,w,h){hl_sky(c,w,h,{stars:60,seed:31});
  // the wall behind the columns, warm round the doors
  c.fillStyle="rgb(14,26,30)";c.fillRect(0,150,w,600);hl_glow(c,960,520,620,[255,200,130],0.30);
  // the doors' opening: a warm hall inside, a rotunda's arch far in, and the two bronze leaves swung open against the jambs
  const D=HL_STEPS_DOOR,dx=D.x-D.w/2,dy=D.y-D.h/2;c.save();c.shadowColor=HL_WARM.glow;c.shadowBlur=36;let g=c.createLinearGradient(0,dy,0,dy+D.h);g.addColorStop(0,"rgb(255,214,150)");g.addColorStop(1,"rgb(200,136,74)");c.fillStyle=g;c.fillRect(dx,dy,D.w,D.h);c.restore();
  c.strokeStyle="rgba(140,90,46,0.55)";c.lineWidth=3;c.beginPath();c.moveTo(dx+40,dy+D.h);c.lineTo(dx+40,dy+150);c.arc(D.x,dy+150,D.w/2-40,Math.PI,0);c.lineTo(dx+D.w-40,dy+D.h);c.stroke();
  for(const sx of [-1,1]){const x0=sx<0?dx-46:dx+D.w,g2=c.createLinearGradient(x0,0,x0+46,0);g2.addColorStop(0,sx<0?"rgb(40,30,20)":"rgb(118,84,48)");g2.addColorStop(1,sx<0?"rgb(118,84,48)":"rgb(40,30,20)");c.fillStyle=g2;c.fillRect(x0,dy-6,46,D.h+6);
    c.strokeStyle="rgba(20,12,8,0.6)";c.lineWidth=2;for(let k=1;k<6;k++){c.beginPath();c.moveTo(x0,dy+k*D.h/6);c.lineTo(x0+46,dy+k*D.h/6);c.stroke();}}
  c.fillStyle="rgb(40,58,62)";c.fillRect(dx-60,dy-36,D.w+120,30);c.fillStyle="rgba(220,240,236,0.3)";c.fillRect(dx-60,dy-36,D.w+120,2);
  // the entablature across the top: architrave, a plain frieze, the cornice's lit edge
  g=c.createLinearGradient(0,30,0,150);g.addColorStop(0,"rgb(44,66,70)");g.addColorStop(1,"rgb(70,92,92)");c.fillStyle=g;c.fillRect(0,30,w,120);
  c.fillStyle="rgba(0,0,0,0.22)";c.fillRect(0,112,w,3);c.fillStyle="rgba(0,0,0,0.18)";c.fillRect(0,66,w,3);c.fillStyle="rgba(210,236,236,0.45)";c.fillRect(0,30,w,2);
  // the columns, leaving the doors clear
  for(const x of [96,356,616,1208,1468,1728])hl_column(c,x,150,756,96,Math.sign(960-(x+48)));
  // the steps: each a lit tread and a darker riser, deeper towards us
  let y=756;for(let k=0;k<9;k++){const rh=24+k*2.6,th=10+k*1.4,f=k/9;c.fillStyle=hl_rgb(mix([84,100,98],[44,58,60],f));c.fillRect(0,y,w,th);
    c.fillStyle="rgba(255,214,160,"+(0.30-k*0.025).toFixed(3)+")";c.fillRect(0,y,w,1.6);y+=th;c.fillStyle=hl_rgb(mix([38,54,58],[18,28,30],f));c.fillRect(0,y,w,rh);y+=rh;}
  // the two bronze lamps on the steps' cheeks, and their warmth on the steps
  for(const lx of [150,1770]){hl_glow(c,lx,600,260,[255,206,140],0.26);c.fillStyle="rgb(20,16,12)";c.fillRect(lx-7,604,14,330);c.fillRect(lx-26,920,52,22);
    c.save();c.shadowColor="rgba(255,220,170,1)";c.shadowBlur=26;c.fillStyle="rgb(255,232,196)";rr(c,lx-20,560,40,52,8);c.fill();c.restore();c.fillStyle="rgb(20,16,12)";c.fillRect(lx-24,552,48,10);}
  hl_glow(c,960,1080,760,[255,200,130],0.16);
  // the night's shadow over the portico's top left, where the film's place and time stand
  g=c.createRadialGradient(240,120,40,240,120,600);g.addColorStop(0,"rgba(2,8,10,0.66)");g.addColorStop(1,"rgba(2,8,10,0)");c.fillStyle=g;c.fillRect(0,0,960,760);}

/* ---------------------------------------------------------------- a glass case, read by lamplight */
// in a dark hall of the Archives: a case of glass on a wooden stand under a lamp; in it, a family's page and a service record
// (drawn as pages, no words), the lamp's light on the glass's edges
function hl_paintCase(c,w,h){let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgb(10,18,22)");g.addColorStop(1,"rgb(16,22,24)");c.fillStyle=g;c.fillRect(0,0,w,h);
  // shelves of grey boxes far off in the dark
  const R=hl_rnd(55);for(let row=0;row<6;row++){const y=60+row*130;c.fillStyle="rgb(24,32,34)";c.fillRect(0,y+104,w,8);c.fillStyle="rgba(190,225,232,0.08)";c.fillRect(0,y+104,w,1.5);
    let x=-10;while(x<w){const bw=44+R()*30,bh=74+R()*26;c.fillStyle=hl_rgb(mix([26,34,36],[38,46,46],R()));c.fillRect(x,y+104-bh,bw,bh);c.fillStyle="rgba(190,200,190,0.10)";c.fillRect(x+bw*0.25,y+104-bh*0.7,bw*0.5,12);
      c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(x+bw-2,y+104-bh,2,bh);x+=bw+2;if(R()<0.06)x+=40;}}
  for(let x=0;x<w;x+=320){c.fillStyle="rgb(18,24,26)";c.fillRect(x,40,12,820);}
  g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgba(8,14,16,0.55)");g.addColorStop(1,"rgba(8,14,16,0.85)");c.fillStyle=g;c.fillRect(0,0,w,h);
  // the lamp's cone and its light on the case
  c.save();c.globalCompositeOperation="lighter";const cg=c.createLinearGradient(0,0,0,700);cg.addColorStop(0,"rgba(255,214,160,0.10)");cg.addColorStop(1,"rgba(255,214,160,0.02)");c.fillStyle=cg;
  c.beginPath();c.moveTo(900,0);c.lineTo(1020,0);c.lineTo(1420,700);c.lineTo(500,700);c.closePath();c.fill();c.restore();
  // the stand
  c.fillStyle="rgb(46,30,22)";c.fillRect(520,690,880,40);c.fillStyle="rgb(34,22,16)";c.fillRect(560,730,800,250);c.fillStyle="rgba(255,214,160,0.18)";c.fillRect(520,690,880,2);
  // the pages inside: a family's page (lines and a small photograph's frame) and a service record (a card, a stamp's ring)
  c.save();c.translate(760,560);c.rotate(-0.03);c.fillStyle="rgb(214,200,168)";c.fillRect(-170,-110,340,220);c.fillStyle="rgba(90,70,50,0.5)";for(let k=0;k<7;k++)c.fillRect(-140,-80+k*24,k%3===2?160:240,4);
  c.fillStyle="rgba(60,50,40,0.55)";c.fillRect(70,-90,80,96);c.restore();
  c.save();c.translate(1150,580);c.rotate(0.04);c.fillStyle="rgb(222,212,186)";c.fillRect(-150,-90,300,180);c.fillStyle="rgba(90,70,50,0.5)";for(let k=0;k<5;k++)c.fillRect(-120,-60+k*26,200,4);
  c.strokeStyle="rgba(120,60,50,0.55)";c.lineWidth=3;c.beginPath();c.arc(90,40,30,0,TAU);c.stroke();c.restore();
  hl_glow(c,960,560,520,[255,214,160],0.22);
  // the glass: its front a faint sheen, its edges catching the lamp
  c.fillStyle="rgba(190,240,240,0.04)";c.fillRect(540,420,840,270);c.strokeStyle="rgba(230,250,250,0.45)";c.lineWidth=2;c.strokeRect(540,420,840,270);
  c.fillStyle="rgba(255,240,210,0.5)";c.fillRect(540,420,840,2);
  c.save();c.globalCompositeOperation="lighter";c.fillStyle="rgba(200,240,240,0.05)";c.beginPath();c.moveTo(600,420);c.lineTo(720,420);c.lineTo(640,690);c.lineTo(520+60,690);c.closePath();c.fill();c.restore();}

/* ---------------------------------------------------------------- the clerk's cabinets: a row of them, face on, close */
// A row of four-drawer cabinets against the office's wall, seen face on from where the clerk stands (978 px a metre at their depth):
// their top drawers along the bottom of the frame, the plaster wall above, a clock, a window on the night, a gooseneck lamp on one.
// The top drawers are drawn live (hl_wallDrawer), so they can open, close, fill and empty; the place paints the rest.
const HL_WALL={eye:[960,352],top:600,w:372,gap:12,x0:6,n:5,dTop:620,dH:293};
const hl_wallX=i=>HL_WALL.x0+i*(HL_WALL.w+HL_WALL.gap);
function hl_steelGrad(c,x,y0,y1,k){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,hl_rgb(mix(HL_STEEL.face,[170,140,100],0.22*k)));g.addColorStop(1,hl_rgb(mix(HL_STEEL.lo,[60,50,40],0.2)));return g;}
function hl_paintWall(c,w,h){const R=hl_rnd(4318),T=HL_WALL.top;
  // the wall: plaster, warm where the lamp lights it, a dark wainscot rail behind the cabinets
  let g=c.createLinearGradient(0,0,0,T);g.addColorStop(0,"rgb(30,32,30)");g.addColorStop(1,"rgb(52,50,44)");c.fillStyle=g;c.fillRect(0,0,w,T+40);
  hl_glow(c,1620,300,900,[255,206,140],0.20);hl_glow(c,1600,540,420,[255,222,170],0.14);
  c.fillStyle="rgb(36,30,24)";c.fillRect(0,T-130,w,34);c.fillStyle="rgba(255,220,180,0.10)";c.fillRect(0,T-130,w,2);
  // a window on the night above the second cabinet: the dark sky, lit windows far off, the glazing bars
  {const x=470,y=60,ww=270,hh=370;c.fillStyle="rgb(40,34,28)";c.fillRect(x-16,y-16,ww+32,hh+32);g=c.createLinearGradient(0,y,0,y+hh);g.addColorStop(0,"rgb(8,22,30)");g.addColorStop(1,"rgb(22,46,54)");c.fillStyle=g;c.fillRect(x,y,ww,hh);
    for(let i=0;i<5;i++){c.fillStyle=rgba(HL_WARM.win,0.6);c.fillRect(x+30+R()*210,y+200+R()*140,5,7);}c.fillStyle="rgb(36,30,24)";c.fillRect(x+ww/2-4,y,8,hh);c.fillRect(x,y+hh/2-4,ww,8);}
  // a clock, its hands at twenty to ten
  {const cx=1090,cy=250,r=62;c.fillStyle="rgb(40,32,24)";c.beginPath();c.arc(cx,cy,r+8,0,TAU);c.fill();c.fillStyle="rgb(214,204,180)";c.beginPath();c.arc(cx,cy,r,0,TAU);c.fill();
    c.strokeStyle="rgb(40,34,28)";c.lineCap="round";for(let k=0;k<12;k++){const a=k*TAU/12;c.lineWidth=k%3?2:4;c.beginPath();c.moveTo(cx+Math.cos(a)*(r-12),cy+Math.sin(a)*(r-12));c.lineTo(cx+Math.cos(a)*(r-4),cy+Math.sin(a)*(r-4));c.stroke();}
    const hand=(a,l,lw)=>{c.lineWidth=lw;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.sin(a)*l,cy-Math.cos(a)*l);c.stroke();};hand(TAU*(9.67/12),34,6);hand(TAU*(40/60),50,4);}
  // the cabinets: each its top, its frame, the slots of its top two drawers (the fronts are drawn live), its lower drawers
  for(let i=0;i<HL_WALL.n;i++){const x=hl_wallX(i),W2=HL_WALL.w,k=Math.max(0.25,1-Math.abs(x+W2/2-1600)/1400);
    c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=30;c.fillStyle=hl_steelGrad(c,x,T,h,k);c.fillRect(x,T,W2,h-T+20);c.restore();
    c.fillStyle=hl_rgb(mix(HL_STEEL.hi,[255,226,180],0.25*k));c.fillRect(x,T-16,W2,16);c.fillStyle="rgba(255,236,210,"+(0.25*k+0.08).toFixed(3)+")";c.fillRect(x,T-16,W2,2);
    c.fillStyle="rgba(0,0,0,0.55)";c.fillRect(x+12,HL_WALL.dTop-4,W2-24,HL_WALL.dH+8);
    const y2=HL_WALL.dTop+HL_WALL.dH+12;c.fillStyle=hl_steelGrad(c,x,y2,y2+HL_WALL.dH,k*0.8);c.fillRect(x+14,y2,W2-28,HL_WALL.dH);
    c.fillStyle="rgba(255,236,210,0.16)";c.fillRect(x+14,y2,W2-28,2);rr(c,x+W2/2-85,y2+40,170,50,4);c.fillStyle=rgba(HL_STEEL.brass,0.55*k+0.2);c.fill();
    rr(c,x+W2/2-60,y2+124,120,18,9);c.fillStyle=rgba(HL_STEEL.brass,0.6*k+0.25);c.fill();}
  // the lamp on the last cabinet: a gooseneck and a green-black shade, its light on the wall
  {const bx=1780,by=T-16;c.fillStyle="rgb(24,22,20)";c.beginPath();c.ellipse(bx,by-6,46,12,0,0,TAU);c.fill();c.strokeStyle="rgb(24,22,20)";c.lineWidth=9;c.beginPath();c.moveTo(bx,by-10);c.bezierCurveTo(bx-10,by-160,bx-120,by-230,bx-170,by-200);c.stroke();
    c.save();c.translate(bx-180,by-196);c.rotate(0.5);c.fillStyle="rgb(30,28,26)";c.beginPath();c.moveTo(-50,0);c.lineTo(50,0);c.lineTo(30,-44);c.lineTo(-30,-44);c.closePath();c.fill();c.restore();
    hl_glow(c,bx-196,by-160,260,[255,226,178],0.35);c.save();c.shadowColor="rgba(255,226,178,1)";c.shadowBlur=20;c.fillStyle="rgb(255,236,206)";c.beginPath();c.ellipse(bx-196,by-168,30,9,0.5,0,TAU);c.fill();c.restore();}
  // the floor's dark at the very bottom, and a soft dark round the edges
  g=c.createRadialGradient(1100,520,420,1100,520,1300);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,4,6,0.5)");c.fillStyle=g;c.fillRect(0,0,w,h);}
// a top drawer of cabinet i, drawn live: out (0 shut, 1 pulled 0.25 m towards us), its label card (words, or null), how full (0 to 1),
// o.a its light. Returns its front's box and its handle, for a hand or a folder. Drawn about the eye, as the place's own perspective.
function hl_wallDrawer(c,i,o){o=o||{};const x=hl_wallX(i)+14,w=HL_WALL.w-28,y=HL_WALL.dTop,h=HL_WALL.dH,E=o.eyeX==null?HL_WALL.eye:[o.eyeX,HL_WALL.eye[1]],k=1+0.12*clamp(o.out||0,0,1.6),
    P=(px,py)=>[E[0]+(px-E[0])*k,E[1]+(py-E[1])*k],a=P(x,y),b=P(x+w,y+h),lit=o.lit==null?1:o.lit,warm=Math.max(0.3,1-Math.abs(x+w/2-1600)/1400);
  if(k>1.001){// the drawer's sides and the inside, seen from above
    c.fillStyle="rgb(14,14,12)";c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.lineTo(b[0],a[1]);c.lineTo(a[0],a[1]);c.closePath();c.fill();
    c.fillStyle=hl_rgb(mix(HL_STEEL.lo,[0,0,0],0.3));c.beginPath();c.moveTo(x,y);c.lineTo(a[0],a[1]);c.lineTo(a[0],b[1]);c.lineTo(x,y+h);c.closePath();c.fill();
    c.beginPath();c.moveTo(x+w,y);c.lineTo(b[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(x+w,y+h);c.closePath();c.fill();
    // the folders inside: manila edges, standing, seen from above, as many as it is full
    const n=Math.round(14*clamp(o.full==null?1:o.full,0,1));for(let f=0;f<n;f++){const u=(f+0.5)/14,yy=lerp(y+4,a[1]-4,u),xx0=lerp(x+10,a[0]+10,u),xx1=lerp(x+w-10,b[0]-10,u);
      c.fillStyle=hl_rgb(mix([206,180,128],[120,100,70],0.4+0.4*(1-u)));c.fillRect(xx0,yy-3,xx1-xx0,4);}}
  // the front
  c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=k>1.001?24:0;c.shadowOffsetY=k>1.001?10:0;c.fillStyle=hl_steelGrad(c,a[0],a[1],b[1],warm*lit);c.fillRect(a[0],a[1],b[0]-a[0],b[1]-a[1]);c.restore();
  c.fillStyle="rgba(255,236,210,"+(0.22*lit).toFixed(3)+")";c.fillRect(a[0],a[1],b[0]-a[0],2);c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(a[0],b[1]-3,b[0]-a[0],3);
  const cx=(a[0]+b[0])/2,big=o.big||o.label||o.typeOf,lw=(big?280:150)*k,lh=(big?56:40)*k,ly=a[1]+(big?24:30)*k,hy=a[1]+(0.45*h)*k;
  // the label holder: a brass frame and its card, and on the card its words, typed
  rr(c,cx-lw/2-6*k,ly-6*k,lw+12*k,lh+12*k,4);c.fillStyle=rgba(HL_STEEL.brass,0.5*warm*lit+0.25);c.fill();
  rr(c,cx-lw/2,ly,lw,lh,2);c.fillStyle=hl_rgb(mix(HL_STEEL.card,[120,110,90],1-lit));c.fill();
  // its words; while they're typed (o.typeOf, the whole label), they start where the whole label will, so nothing shifts as they grow
  if(o.label){const la=o.labelA==null?1:o.labelA,sz=Math.round(28*k),q={w:600,size:sz,f:"mono",col:[34,26,18]};
    if(la>0)withA(c,la,()=>o.typeOf?dp_T(c,o.label,cx-dp_tw(c,o.typeOf,q)/2,ly+lh*0.7,q):dp_T(c,o.label,cx,ly+lh*0.7,Object.assign({align:"center"},q)));}
  // the handle, a brass pull
  rr(c,cx-66*k,hy-11*k,132*k,22*k,11*k);c.fillStyle=rgba(HL_STEEL.brass,0.65*warm*lit+0.3);c.fill();c.fillStyle="rgba(255,240,200,0.4)";c.fillRect(cx-56*k,hy-9*k,112*k,2);
  return{x:a[0],y:a[1],w:b[0]-a[0],h:b[1]-a[1],handle:[cx,hy],inside:[(x+a[0])/2,(y+a[1])/2]};}

/* ---------------------------------------------------------------- the clerk of 1943 */
// One of the war offices' clerks, as the agent films draw people (one three-quarter head, arms down, a hand only on a drawer's handle):
// a cream blouse with a pointed collar; her hair to the collar, its ends rolled under, and a roll swept up from the forehead, as women
// wore it in 1943. The rolls are painted with the head, inside its picture.
function hl_rolls(c,P){const h=P.hair.c,hi=ag_lt(h,0.30),sh="rgba(0,0,0,0.40)",line=rgba(ag_dk(h,0.5),0.5);c.lineCap="round";
  // the ends, rolled under along the collar
  ag_soft(c,cc=>{cc.moveTo(214,488);cc.bezierCurveTo(212,520,240,546,276,542);cc.bezierCurveTo(300,540,318,528,318,512);cc.bezierCurveTo(300,520,276,524,252,516);cc.bezierCurveTo(232,510,220,500,214,488);cc.closePath();},
    h,hi,262,520,40,sh,8);
  c.strokeStyle=line;c.lineWidth=2;c.beginPath();c.moveTo(226,508);c.bezierCurveTo(240,526,272,532,306,522);c.stroke();
  // the roll swept up and back from the forehead, its open end towards us
  ag_soft(c,cc=>{cc.moveTo(392,346);cc.bezierCurveTo(400,318,384,286,350,276);cc.bezierCurveTo(316,266,272,272,250,290);cc.bezierCurveTo(262,300,286,304,306,312);
      cc.bezierCurveTo(330,322,352,330,368,342);cc.bezierCurveTo(378,348,386,350,392,346);cc.closePath();},h,hi,330,284,46,sh,12);
  c.strokeStyle=line;c.lineWidth=2.2;c.beginPath();c.moveTo(262,288);c.bezierCurveTo(300,282,346,290,384,326);c.stroke();
  c.strokeStyle=rgba(ag_lt(h,0.5),0.25);c.lineWidth=1.8;c.beginPath();c.moveTo(276,280);c.bezierCurveTo(310,274,348,282,378,306);c.stroke();}
const HL_CLERK={name:"A clerk",key:"hl-clerk",skin:[236,204,178],hair:{style:"bob",c:[96,64,44]},top:{kind:"shirt",c:[206,192,166]},hat:{paint:hl_rolls},breath:0.26};

AG_PLACES.hlStreet=c=>hl_paintStreet(c,W,H);
AG_PLACES.hlWall=c=>hl_paintWall(c,W,H);
AG_PLACES.hlOffice=c=>hl_paintOffice(c,W,H);
AG_PLACES.hlNight=c=>hl_paintNight(c,W,H);
AG_PLACES.hlPlatform=c=>hl_paintPlatform(c,W,H);
AG_PLACES.hlDesk=c=>hl_paintDesk(c,W,H);
AG_PLACES.hlSteps=c=>hl_paintSteps(c,W,H);
AG_PLACES.hlCase=c=>hl_paintCase(c,W,H);

/* ===== How long, and then what: the opening's live pieces =====
   What the opening draws over its places (hl_past.js): transfer boxes piling up, typed sheets and lists, a
   building in section and the Archives in glass filling with drawers, the Act and its schedule on the desk with their stamps, and the
   papers on the platform. Words are typed (IBM Plex Mono) in dark ink on paper, or on the module's cards; every word at least 28 px. */

// how far into its life a thing is at t: in over d from a, out over d from b (0 to 1)
const hl_v=(t,a,b,d)=>ag_in(t,a,d||0.6)*(b==null?1:1-ag_in(t,b,d||0.6));
const HL_INK=[34,28,22],HL_PAPER=[228,218,194];

/* ---------------------------------------------------------------- boxes */
// transfer boxes piled on a cabinet's top, sliding in by u: brown card boxes, a lighter lid edge, a pale label (no words)
function hl_boxes(c,x,y,w,u,seed){if(u<=0)return;const R=hl_rnd(seed||5);let yy=y;c.save();c.globalAlpha*=clamp(u*2,0,1);
  for(let i=0;i<3;i++){const bw=w*(0.78+R()*0.18),bh=74+R()*30,bx=x+(w-bw)/2+(R()-0.5)*20,k=ag_spr(u*1.8,i*0.25,0.8),dy=(1-k)*-90;if(k<=0)break;
    c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=14;c.fillStyle=hl_rgb(mix([126,94,62],[96,72,48],R()));c.fillRect(bx,yy-bh+dy,bw,bh);c.restore();
    c.fillStyle="rgba(255,226,180,0.22)";c.fillRect(bx,yy-bh+dy,bw,3);c.fillStyle="rgba(230,214,180,0.55)";c.fillRect(bx+bw*0.3,yy-bh*0.62+dy,bw*0.4,bh*0.3);yy-=bh;}
  c.restore();}

/* ---------------------------------------------------------------- typed sheets and lists */
// a typed sheet: its title lines in a typewriter's letters, then faint typed lines (decoration); turned by o.rot about its middle
function hl_sheet(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const pad=o.pad||30;c.save();c.globalAlpha*=a;c.translate(x+w/2,y+h/2);c.rotate(o.rot||0);c.translate(-w/2,-h/2);
  c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=22;c.shadowOffsetY=8;c.fillStyle=hl_rgb(o.col||HL_PAPER);c.fillRect(0,0,w,h);c.restore();
  let yy=pad;if(o.title){o.title.forEach((l,i)=>dp_T(c,l,o.center?w/2:pad,yy+30+i*42,{w:700,size:o.size||30,f:"mono",col:HL_INK,align:o.center?"center":"left"}));yy+=30+(o.title.length-1)*42+10;}
  c.fillStyle="rgba(70,58,44,0.32)";const n=o.lines==null?5:o.lines;for(let i=0;i<n;i++){const lw=(i%4===3?0.5:0.86)*(w-2*pad);c.fillRect(pad,yy+22+i*28,lw,5);}
  c.restore();}
// a pile of papers, n sheets, its bottom at y, its middle at x
function hl_pile(c,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||n<=0)return;const R=hl_rnd(o.seed||9),w=o.w||300;c.save();c.globalAlpha*=a;
  for(let i=0;i<n;i++){const yy=y-i*7,dx=(R()-0.5)*18;c.fillStyle=hl_rgb(mix(HL_PAPER,[150,140,120],0.15+0.35*R()));c.fillRect(x-w/2+dx,yy-6,w,6);c.fillStyle="rgba(0,0,0,0.25)";c.fillRect(x-w/2+dx,yy,w,1);}
  c.restore();}

/* ---------------------------------------------------------------- a building in section, and the Archives in glass */
// a tiny steel cabinet, as the diagrams draw them
function hl_cabIcon(c,x,y,w,h,k){c.fillStyle=hl_rgb(mix([96,104,86],[150,128,90],0.3*k));c.fillRect(x,y,w,h);c.fillStyle="rgba(0,0,0,0.35)";for(let d=1;d<4;d++)c.fillRect(x,y+h*d/4,w,1.5);
  c.fillStyle=rgba(HL_STEEL.brass,0.7);for(let d=0;d<4;d++)c.fillRect(x+w*0.35,y+h*(d+0.5)/4,w*0.3,2);}
// a government building cut open, floor by floor: a frame of light, each floor's room warm and filling with cabinets as fill[i] goes 0 to 1
function hl_section(c,x,y,w,h,fill,a){if(a<=0)return;const n=fill.length,fh=h/n,ice=DP.ice;c.save();c.globalAlpha*=a;
  for(let i=0;i<n;i++){const fy=y+h-(i+1)*fh,f=clamp(fill[i],0,1);c.fillStyle="rgba(6,20,26,0.55)";c.fillRect(x,fy,w,fh);
    if(f>0){c.fillStyle=rgba([255,206,140],0.16*f);c.fillRect(x,fy,w,fh);const m=Math.floor(f*16);for(let j=0;j<m;j++)hl_cabIcon(c,x+14+j*((w-28)/16),fy+fh-8-fh*0.62,(w-28)/16-6,fh*0.62,f);}
    c.fillStyle=rgba(ice,0.5);c.fillRect(x,fy+fh-2,w,2);}
  c.strokeStyle=rgba(ice,0.85);c.lineWidth=2.4;c.shadowColor=rgba(DP.F.cyan,0.6);c.shadowBlur=10;c.strokeRect(x,y,w,h);
  c.beginPath();c.moveTo(x-20,y);c.lineTo(x+w/2,y-70);c.lineTo(x+w+20,y);c.closePath();c.stroke();c.restore();}
// the National Archives' building drawn in lines of light (a podium, a row of columns, the attic, a low pediment), filling from the
// bottom with cabinets as u goes 0 to 1
function hl_archGlass(c,x,y,w,h,u,a){if(a<=0)return;const ice=DP.ice,pod=h*0.13,att=h*0.2,colH=h-pod-att;c.save();c.globalAlpha*=a;
  c.fillStyle="rgba(6,20,26,0.55)";c.fillRect(x,y,w,h);
  if(u>0){c.save();c.beginPath();c.rect(x,y+h-(h)*u,w,h*u);c.clip();c.fillStyle=rgba([255,206,140],0.16);c.fillRect(x,y,w,h);
    const rows=8,cols=18,cw=(w-24)/cols,ch=(h-20)/rows;for(let r=0;r<rows;r++)for(let k=0;k<cols;k++)hl_cabIcon(c,x+12+k*cw+2,y+h-10-(r+1)*ch+4,cw-4,ch-8,1);c.restore();}
  c.strokeStyle=rgba(ice,0.85);c.lineWidth=2.4;c.shadowColor=rgba(DP.F.cyan,0.6);c.shadowBlur=10;c.strokeRect(x,y,w,h);
  c.beginPath();c.moveTo(x,y+h-pod);c.lineTo(x+w,y+h-pod);c.moveTo(x,y+att);c.lineTo(x+w,y+att);c.stroke();
  c.lineWidth=1.6;for(let i=0;i<10;i++){const cx=x+w*(i+0.5)/10;c.beginPath();c.moveTo(cx,y+att);c.lineTo(cx,y+h-pod);c.stroke();}
  c.lineWidth=2.4;c.beginPath();c.moveTo(x+w*0.25,y);c.lineTo(x+w/2,y-h*0.12);c.lineTo(x+w*0.75,y);c.stroke();c.restore();}
// a drawer's front, as the diagrams draw them: lit warm, or dimmed to grey (dim 0 to 1)
function hl_drawerIcon(c,x,y,w,h,dim){const col=mix([110,118,98],[56,62,62],dim),warm=1-dim;
  c.save();c.shadowColor=rgba([255,206,140],0.35*warm);c.shadowBlur=18*warm;c.fillStyle=hl_rgb(col);c.fillRect(x,y,w,h);c.restore();
  c.fillStyle=rgba([255,236,210],0.25*warm+0.06);c.fillRect(x,y,w,2);c.fillStyle=hl_rgb(mix(HL_STEEL.card,[80,84,84],dim));c.fillRect(x+w*0.25,y+h*0.18,w*0.5,h*0.2);
  c.fillStyle=hl_rgb(mix(HL_STEEL.brass,[70,74,74],dim));c.fillRect(x+w*0.3,y+h*0.55,w*0.4,h*0.1);}

/* ---------------------------------------------------------------- the desk: the Act, its schedule, the stamps */
// the page of the Act of 7 July 1943, typed; and, as it turns (turn 0 to 1), the page under it: a records disposal schedule, its three
// columns, its rows faint typed lines (decoration); lit 0 to 1 lights each of its columns "How long" and "Then"
function hl_actPage(c,P,o){o=o||{};const turn=clamp(o.turn||0,0,1),k=Math.cos(turn*Math.PI/2),hh=P.h*k;
  // while the Act's page still covers the schedule (its top edge at lim), each of the schedule's words comes in as the edge uncovers it
  const lim=turn>0&&turn<1?P.y+P.h-hh:null,T=(s,x,y,q)=>{const a=lim==null?1:clamp((lim-y-10)/24,0,1);if(a>0)withA(c,a,()=>dp_T(c,s,x,y,q));};
  const sched=()=>{hl_sheet(c,P.x,P.y,P.w,P.h,{lines:0,col:[230,222,200]});
    T("Records disposal schedule",P.x+P.w/2,P.y+84,{w:700,size:34,f:"mono",align:"center",col:HL_INK});
    c.fillStyle="rgba(34,28,22,0.6)";c.fillRect(P.x+40,P.y+112,P.w-80,2);
    const cols=[[P.x+40,"Kind of record",0],[P.x+420,"How long",o.litLong||0],[P.x+640,"Then",o.litThen||0]];
    for(const [x,s,l] of cols){if(l>0){c.save();c.globalAlpha*=l;c.fillStyle="rgba(255,206,110,0.42)";c.fillRect(x-14,P.y+124,dp_tw(c,s,{w:700,size:30,f:"mono"})+28,P.h-150);c.restore();}
      T(s,x,P.y+166,{w:700,size:30,f:"mono",col:HL_INK});}
    c.fillStyle="rgba(34,28,22,0.45)";c.fillRect(P.x+40,P.y+186,P.w-80,1.5);
    c.fillStyle="rgba(70,58,44,0.30)";for(let r=0;r<11;r++){const yy=P.y+226+r*40;c.fillRect(P.x+40,yy,300-(r%3)*50,5);c.fillRect(P.x+420,yy,150-(r%2)*40,5);c.fillRect(P.x+640,yy,100+(r%2)*20,5);}};
  // the Act's words; once its page folds away, read already, they are part of the page's picture (deco), however small the fold makes them
  const act=()=>{hl_sheet(c,P.x,P.y,P.w,P.h,{lines:0});const deco=turn>0?1:0;
    dp_T(c,"AN ACT",P.x+P.w/2,P.y+92,{w:700,size:40,f:"mono",align:"center",col:HL_INK,ls:6,deco});
    ["To provide for the disposal of","certain records of the United","States Government."].forEach((l,i)=>dp_T(c,l,P.x+P.w/2,P.y+170+i*46,{w:600,size:32,f:"mono",align:"center",col:HL_INK,deco}));
    c.fillStyle="rgba(70,58,44,0.30)";for(let r=0;r<9;r++)c.fillRect(P.x+60,P.y+356+r*34,(r%4===3?0.5:0.86)*(P.w-120),5);};
  if(turn<=0){act();return;}
  sched();if(turn>=1)return;
  // the Act's page folding down over its bottom edge, towards us, foreshortened and falling into shadow, until it's gone edge-on
  c.save();c.beginPath();c.rect(P.x-40,P.y+P.h-hh,P.w+80,hh);c.clip();c.translate(0,P.y+P.h);c.scale(1,Math.max(0.001,k));c.translate(0,-(P.y+P.h));act();
  c.fillStyle="rgba(20,14,8,"+(0.3*(1-k)).toFixed(3)+")";c.fillRect(P.x,P.y,P.w,P.h);c.restore();}
// a rubber stamp's mark, landing (u 0 to 1: it drops and presses, then stays): a ring of ink round its words, and a green tick
function hl_stamp(c,x,y,words,u,rot){if(u<=0)return;const k=1+0.5*(1-ag_eo(clamp(u*2.5,0,1))),a=clamp(u*3,0,1),w=dp_tw(c,words,{w:700,size:30})+120,h=76;
  c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(rot||0);c.scale(k,k);
  c.strokeStyle="rgba(24,104,64,0.85)";c.lineWidth=4;rr(c,-w/2,-h/2,w,h,12);c.stroke();rr(c,-w/2+7,-h/2+7,w-14,h-14,8);c.lineWidth=1.5;c.stroke();
  dp_T(c,words,-w/2+92,11,{w:700,size:30,col:[16,84,50]});c.restore();
  if(u>0.35){c.save();c.translate(x,y);c.rotate(rot||0);dp_tick(c,-w/2+48,0,"allowed",clamp((u-0.35)*3,0,1));c.restore();}}

/* ---------------------------------------------------------------- the platform's papers */
// the papers heaped on the cart's open crate: most grey (the useless), a few warm white (the valuable), mixed; lift (0 to 1) raises two
// warm ones, each with its words, and sink (0 to 1) takes them back down among the grey
const HL_HEAP=(()=>{const R=hl_rnd(1945),s=[];for(let i=0;i<22;i++){const warm=[3,9,15,19].includes(i);s.push({x:520+R()*420,y:610+R()*90-i*2,w:150+R()*60,r:(R()-0.5)*0.5,warm});}return s;})();
function hl_heap(c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;
  for(const s of HL_HEAP){c.save();c.translate(s.x,s.y);c.rotate(s.r);c.shadowColor="rgba(0,0,0,0.4)";c.shadowBlur=8;c.fillStyle=s.warm?"rgb(246,236,212)":"rgb(120,124,122)";c.fillRect(-s.w/2,-14,s.w,28);c.restore();
    if(s.warm){c.save();c.globalCompositeOperation="lighter";hl_glow(c,s.x,s.y,70,[255,214,160],0.18*(o.warm==null?1:o.warm));c.restore();}}
  c.restore();}

/* ===== How long, and then what: the university =====
   The module's hall with the film's own lights; the platform as a tall block of clear glass, its shelves of frosted cards becoming
   glass drawers once the schedule labels them; the three stages of a record; the retention schedule; Linh's contracts and their end
   dates; a drawer under a hold; and a record's line through time. Every word at least 28 px, on the kit's cards, slips and pills. */

AG_PLACES.hlHall=c=>dp_paintHall(c,{seed:19,horizon:720,vx:960,pools:[[250,1010,420,0.11],[1670,1010,420,0.11],[960,860,760,0.05]]});

/* ---------------------------------------------------------------- the platform */
// A tall block of clear glass, its shelves top to bottom; each shelf s: {n: frosted cards on it (0 to 8; a fraction fades the last),
// warm: the cards lit (in use), coral: the first card's rim turning coral (0 to 1), drawer: the shelf becoming a glass drawer (0 to 1),
// label: the drawer's words, a: the shelf's light}. o.a the block's own light. Returns the shelves' boxes.
const HL_BLOCK={x:760,y:150,w:400,h:690};
function hl_block(c,shelves,o){o=o||{};const B=HL_BLOCK,a=o.a==null?1:o.a,n=shelves.length,rh=B.h/n,ice=DP.ice,out=[];if(a<=0)return out;c.save();c.globalAlpha*=a;
  // the glass: nearly clear, a light along its edges and a sheen down one side
  c.save();c.shadowColor=rgba(DP.F.cyan,0.30);c.shadowBlur=40;rr(c,B.x,B.y,B.w,B.h,10);c.fillStyle="rgba(10,30,36,0.42)";c.fill();c.restore();
  let g=c.createLinearGradient(B.x,0,B.x+B.w,0);g.addColorStop(0,"rgba(190,245,245,0.10)");g.addColorStop(0.18,"rgba(190,245,245,0.02)");g.addColorStop(1,"rgba(190,245,245,0.06)");rr(c,B.x,B.y,B.w,B.h,10);c.fillStyle=g;c.fill();
  for(let i=0;i<n;i++){const s=shelves[i],y=B.y+i*rh,sa=s.a==null?1:s.a,cards=s.n==null?8:s.n,box={x:B.x+12,y:y+8,w:B.w-24,h:rh-14};out.push(box);
    // the shelf: a plate of glass, its edge lit
    c.fillStyle=rgba(ice,0.42*sa+0.1);c.fillRect(B.x+8,y+rh-6,B.w-16,2.4);
    // its cards: frosted, standing, lit warm while in use, the first one's rim coral as it turns
    for(let k=0;k<8;k++){const ka=clamp(cards-k,0,1)*sa;if(ka<=0)continue;const cx=B.x+22+k*46,cy=y+16,cw=36,ch=rh-26;c.save();c.globalAlpha*=ka;
      c.fillStyle=s.warm?"rgba(255,226,180,0.24)":"rgba(190,240,240,0.15)";rr(c,cx,cy,cw,ch,5);c.fill();
      const rim=k===0&&s.coral?mix(ice,DP.F.coral,s.coral):s.warm?[255,226,180]:ice;c.strokeStyle=rgba(rim,k===0&&s.coral?0.6+0.4*s.coral:0.55);c.lineWidth=k===0&&s.coral?2.4+s.coral:1.6;
      if(k===0&&s.coral){c.shadowColor=rgba(DP.F.coral,0.8*s.coral);c.shadowBlur=14*s.coral;}rr(c,cx,cy,cw,ch,5);c.stroke();c.restore();}
    // the shelf as a drawer: a front of glass across it, its words
    const d=clamp(s.drawer||0,0,1);if(d>0){c.save();c.globalAlpha*=d;dp_panel(c,box.x,box.y,box.w,box.h,{r:8,glowR:24,behind:o.behind});
      if(s.label)dp_T(c,s.label,box.x+box.w/2,box.y+box.h/2+11,{w:700,size:30,align:"center"});c.restore();}}
  // the block's rim, brighter at the top
  g=c.createLinearGradient(0,B.y,0,B.y+B.h);g.addColorStop(0,rgba(ice,0.95));g.addColorStop(1,rgba(ice,0.45));rr(c,B.x+1,B.y+1,B.w-2,B.h-2,10);c.strokeStyle=g;c.lineWidth=2.4;c.stroke();
  c.restore();return out;}
// a shelf's middle on its right edge, for a tag's line
const hl_shelfAt=(i,n)=>[HL_BLOCK.x+HL_BLOCK.w,HL_BLOCK.y+(i+0.5)*HL_BLOCK.h/n];
// a grey tag on a shelf: a grey slip with its words in ice white, like the film's other grey slips (grey's own words are too faint
// over the hall's light), its middle on the shelf's line, and a line of light from its left edge to the shelf (to), drawn on by p
function hl_greyTag(c,x,to,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const size=o.size||28;c.save();c.globalAlpha*=a;
  const bb=dp_slip(c,x,to[1]-(size+40)/2,text,"grey",{ink:true,size,behind:o.behind});dp_link(c,[bb.x,to[1]],to,"grey",o.p==null?1:o.p);c.restore();}

/* ---------------------------------------------------------------- frosted cards and panes */
// a small frosted card standing for a record: its words (one or two lines), its rim; o.warm, o.dim, o.coral (its rim), o.a
function hl_rec(c,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||(lines.length>1?96:64);if(a<=0)return{x,y,w,h};c.save();c.globalAlpha*=a*(1-0.55*(o.dim||0));
  dp_panel(c,x,y,w,h,{col:o.coral?mix(DP.F.cyan,DP.F.coral,o.coral):o.warm?[255,214,160]:"cyan",r:12,glowR:22,glowA:o.coral?1+o.coral:0.8,behind:o.behind});
  lines.forEach((l,i)=>dp_T(c,l,x+w/2,y+(lines.length>1?40+i*38:h/2+11),{w:i?500:700,size:28,align:"center",col:i?"mut":"ink",f:o.mono&&!i?"mono":undefined}));
  c.restore();return{x,y,w,h};}
// a pane of frosted glass with its name at the top
function hl_pane(c,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;dp_panel(c,x,y,w,h,{r:18,behind:o.behind,glowA:o.glow||0.8});
  dp_T(c,name,x+w/2,y+54,{w:700,size:36,align:"center"});c.fillStyle=rgba(DP.ice,0.35);c.fillRect(x+30,y+76,w-60,1.5);c.restore();}
// words struck through with a line of coral, drawn on by p
function hl_strike(c,x,y,w,p){if(p<=0)return;c.save();c.strokeStyle=rgba(DP.F.coral,1);c.lineWidth=5;c.lineCap="round";c.shadowColor=rgba(DP.F.coral,0.8);c.shadowBlur=10;
  c.beginPath();c.moveTo(x,y);c.lineTo(x+w*clamp(p,0,1),y-4*clamp(p,0,1));c.stroke();c.restore();}
// a band of solid colour across something, its words in dark capitals (the kit's band), settling in by u; text a line, or an array of
// lines (each centred, 40 apart, the band as tall as they need); it widens, round its middle, to fit its longest line
function hl_bandAcross(c,x,y,w,h,col,text,u){if(u<=0)return;const L=(Array.isArray(text)?text:[text]).map(s=>String(s).toUpperCase()),q={w:800,size:30,ls:5};
  const tw=Math.max(...L.map(s=>dp_tw(c,s,q)))+64;if(w<tw){x-=(tw-w)/2;w=tw;}h=Math.max(h,24+L.length*40);
  c.save();c.globalAlpha*=clamp(u*2,0,1);const k=ag_spr(u,0,1),yy=y-(1-k)*30;
  c.save();c.shadowColor=rgba(dp_f(col),0.7);c.shadowBlur=20;rr(c,x,yy,w,h,10);c.fillStyle=rgba(dp_f(col),1);c.fill();c.restore();
  const g=c.createLinearGradient(0,yy,0,yy+h);g.addColorStop(0,"rgba(255,255,255,0.28)");g.addColorStop(0.5,"rgba(255,255,255,0)");rr(c,x,yy,w,h,10);c.fillStyle=g;c.fill();
  L.forEach((s,i)=>dp_T(c,s,x+w/2,yy+h/2+10+(i-(L.length-1)/2)*40,Object.assign({align:"center",col:DP.on},q)));c.restore();}

/* ---------------------------------------------------------------- the retention schedule */
// The university's schedule: a frosted table, its five columns, its rows coming in (rows[i] 0 to 1), each row's reason a green pill
// (pills 0 to 1 lights them), the owners' names (cyan, an identity; they may come first), the line saying who keeps it, and the
// owners' signature
const HL_SCHED={x:100,y:118,w:1720,cols:[[34,"Kind of record"],[504,"Owner"],[760,"Why"],[1010,"How long"],[1450,"Then"]],
  rows:[[["Pay records","contracts, hours, pay"],"Ingrid Holm","law",["7 years after","each contract ends"],"Deleted"],
        [["Academic records","degrees, results"],"Mei Tanaka","public task",["For good"],"Kept for good"],
        [["Tutors' mailing list"],"Ingrid Holm","agreed",["Until a no, or 2 years","without contact"],"Deleted"],
        [["Applications","not hired"],"Ingrid Holm","fair interest",["12 months after","the decision"],"Deleted"]]};
function hl_schedule(c,o){o=o||{};const S=HL_SCHED,a=o.a==null?1:o.a;if(a<=0)return;const rows=o.rows||[1,1,1,1],head=o.head||[1,1,1,1,1],rh=104,y0=S.y+150,h=150+rh*4+(o.kept>0||o.signed>0?118:28);
  c.save();c.globalAlpha*=a;dp_panel(c,S.x,S.y,S.w,h,{r:22,behind:o.behind,glowA:1+(o.glow||0)*1.5,glowR:46+40*(o.glow||0)});
  dp_T(c,"Retention schedule",S.x+34,S.y+62,{w:700,size:40});
  // the column heads, each lighting as it's named
  for(let i=0;i<5;i++){const [cx,name]=S.cols[i],l=clamp(head[i],0,1);dp_T(c,name,S.x+cx,S.y+124,{w:700,size:28,col:l>0.5?"cyan":"mut",ls:1});}
  c.fillStyle=rgba(DP.ice,0.4);c.fillRect(S.x+24,S.y+140,S.w-48,1.6);
  for(let r=0;r<4;r++){const u=clamp(rows[r],0,1),R=S.rows[r],y=y0+r*rh;
    // the owner's name, which may come before the rest of the row (o.owners: one value for every row, or one for each)
    if(Array.isArray(o.owners)&&o.owners[r]>0)dp_pill(c,S.x+S.cols[1][0],y+44,R[1],"identity",{a:clamp(o.owners[r],0,1)});
    if(u<=0)continue;const dy=(1-ag_eo(u))*20;c.save();c.globalAlpha*=clamp(u*1.5,0,1);c.translate(0,dy);
    R[0].forEach((l,i)=>dp_T(c,l,S.x+S.cols[0][0],y+38+i*38,{w:i?500:700,size:28,col:i?"mut":"ink"}));
    const owner=Array.isArray(o.owners)?0:clamp(o.owners==null?1:o.owners,0,1);if(owner>0)dp_pill(c,S.x+S.cols[1][0],y+44,R[1],"identity",{a:owner});
    dp_pill(c,S.x+S.cols[2][0],y+44,R[2],"allowed",{a:clamp(o.pills==null?1:o.pills,0,1),glow:12+18*(o.pillGlow||0)});
    R[3].forEach((l,i)=>dp_T(c,l,S.x+S.cols[3][0],y+38+i*38,{w:600,size:28,col:i?"mut":"ink"}));
    dp_T(c,R[4],S.x+S.cols[4][0],y+38,{w:700,size:28});
    c.fillStyle=rgba(DP.ice,0.18);c.fillRect(S.x+24,y+rh-8,S.w-48,1.2);c.restore();}
  const yb=y0+4*rh;
  if(o.kept>0)withA(c,clamp(o.kept,0,1),()=>dp_T(c,"Kept by Yusuf Demir, data governance",S.x+34,yb+50,{w:600,size:28,col:"mut"}));
  if(o.signed>0){const u=clamp(o.signed,0,1);dp_tick(c,S.x+S.w-430,yb+40,"allowed",u);withA(c,clamp(u*1.5,0,1),()=>dp_T(c,"Signed · 14 October 2026",S.x+S.w-390,yb+50,{w:700,size:28,col:"green"}));}
  c.restore();return{x:S.x,y:S.y,w:S.w,h};}

/* ---------------------------------------------------------------- Linh's contracts */
const HL_CONTRACTS=[["T-23014","Semester 1, 2023","23 Jun 2030"],["T-23187","Semester 2, 2023","17 Nov 2030"],["T-24021","Semester 1, 2024","21 Jun 2031"],
  ["T-24166","Semester 2, 2024","15 Nov 2031"],["T-25033","Semester 1, 2025","27 Jun 2032"],["T-25172","Semester 2, 2025","21 Nov 2032"],
  ["T-26041","Semester 1, 2026","27 Jun 2033"],["T-26188","Semester 2, 2026","20 Nov 2033"]];
const HL_CX=540,HL_CY=160,HL_CH=80;
// one contract's card (u 0 to 1 coming in), its end date's slip (p 0 to 1), dimmed by dim, the slip lit by o.lit (0 to 1)
function hl_contract(c,i,u,p,o){o=o||{};if(u<=0)return;const [id,sem,until]=HL_CONTRACTS[i],y=HL_CY+i*HL_CH,dim=o.dim||0;c.save();c.globalAlpha*=clamp(u*1.5,0,1)*(1-0.6*dim);
  c.translate((1-ag_eo(u))*-30,0);dp_panel(c,HL_CX,y,470,64,{r:12,glowR:20,behind:o.behind});
  dp_T(c,id,HL_CX+24,y+43,{w:700,size:28,f:"mono"});dp_T(c,sem,HL_CX+190,y+43,{w:500,size:28,col:"mut"});c.restore();
  if(p>0){c.save();c.globalAlpha*=clamp(p*1.5,0,1)*(1-0.6*dim);const k=ag_spr(p,0,0.9);c.translate(0,(1-k)*-14);const b=dp_slip(c,HL_CX+500,y-3,"Until "+until,"grey",{ink:true,size:28,behind:o.behind});
    if(o.lit>0&&b){c.globalCompositeOperation="lighter";c.shadowColor=rgba(DP.F.cyan,0.9*o.lit);c.shadowBlur=22;rr(c,b.x,b.y,b.w,b.h,b.h/2);c.strokeStyle=rgba(DP.F.cyan,0.55*o.lit);c.lineWidth=2.4;c.stroke();}
    c.restore();}}

/* ---------------------------------------------------------------- a record's line through time */
// a line of light from a record's event to past its end date: the end date marked, and the two coral zones, too soon before it and
// too long after it, each lighting 0 to 1
function hl_lifeline(c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const x0=200,x1=1720,xe=1060,y=470;c.save();c.globalAlpha*=a;
  for(const [za,zb,l,word] of [[x0+120,xe,o.soon||0,"Too soon"],[xe,x1,o.long||0,"Too long"]]){c.save();c.globalAlpha*=0.35+0.65*l;
    rr(c,za+6,y-64,zb-za-12,128,16);c.fillStyle=rgba(DP.F.coral,0.10+0.16*l);c.fill();c.strokeStyle=rgba(DP.F.coral,0.5+0.5*l);c.lineWidth=2;c.stroke();
    dp_T(c,word,(za+zb)/2,y-88,{w:700,size:30,align:"center",col:"coral"});c.restore();}
  c.save();c.strokeStyle=rgba(DP.ice,0.95);c.lineWidth=4;c.shadowColor=rgba(DP.F.cyan,0.8);c.shadowBlur=12;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();c.restore();
  c.fillStyle=rgba(DP.ice,1);c.beginPath();c.arc(x0,y,9,0,TAU);c.fill();
  c.save();c.strokeStyle=rgba(DP.ice,1);c.lineWidth=3;c.beginPath();c.moveTo(xe,y-70);c.lineTo(xe,y+70);c.stroke();c.restore();
  dp_T(c,"Event",x0,y+60,{w:700,size:28,align:"center",col:"mut"});dp_T(c,"End date",xe,y+110,{w:700,size:30,align:"center"});c.restore();}

/* ===== How long, and then what: the chapters =====
   Seven chapters, re-timed to the voice: every moment is a word's time (wAt). The opening (A flood of paper, Decided once, before) is
   Washington in 1943, in its own places (hl_past.js) with its live pieces (hl_open.js); the rest is the university, in the module's hall
   (hl_uni.js). In one room the camera glides and only what changes fades; between rooms, a dissolve where the whole picture changes. */

DP_PEOPLE.push([HL_CLERK,"lamp"],"ingrid","yusuf","linh");

// the clerk at her cabinets, a manila folder of papers held to her chest
const HL_CLERK_AT=[225,591,1.0];
function hl_folder(c,x,y,w,h,rot){c.save();c.translate(x,y);c.rotate(rot||0);
  c.fillStyle="rgb(232,226,208)";c.fillRect(-w/2+12,-h/2-9,w-26,h);c.fillStyle="rgba(70,58,44,0.25)";c.fillRect(-w/2+12,-h/2-9,w-26,1.5);
  const g=c.createLinearGradient(0,-h/2-22,0,h/2);g.addColorStop(0,"rgb(224,198,142)");g.addColorStop(1,"rgb(186,156,102)");
  c.save();c.shadowColor="rgba(0,0,0,0.4)";c.shadowBlur=10;c.shadowOffsetY=4;c.fillStyle=g;c.beginPath();c.moveTo(-w/2,-h/2);c.lineTo(w/2-130,-h/2);
  c.lineTo(w/2-120,-h/2-22);c.lineTo(w/2-30,-h/2-22);c.lineTo(w/2-20,-h/2);c.lineTo(w/2,-h/2);c.lineTo(w/2,h/2);c.lineTo(-w/2,h/2);c.closePath();c.fill();c.restore();
  c.fillStyle="rgba(255,240,210,0.45)";c.fillRect(-w/2,-h/2,w-130,2);c.restore();}
function hl_clerk(c,t,a){if(a<=0)return;const [x,y,s]=HL_CLERK_AT;
  const draw=cc=>dp_person(cc,HL_CLERK,x,y,s,{light:"lamp",t,pose:"hold",gaze:[3,1],hold:(xx,h)=>hl_folder(xx,h.near[0]+60,h.near[1]-60,240,170,-0.1)});
  if(a>=1)draw(c);else{const [bc,bx]=ag_buf("clerk",c.canvas.width,c.canvas.height);bx.setTransform(c.getTransform());bx.clearRect(-4000,-4000,9000,9000);draw(bx);
    c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=a;c.drawImage(bc,0,0);c.restore();}}

/* ---------------------------------------------------------------- 1 · A flood of paper */
scene("flood",(ctx,S,t,sc)=>{
  const tGlide=wAt(sc,"war","country")-0.4,tWall=wAt(sc,"war","office")-0.3,tFour=wAt(sc,"cabinets","four"),tRooms=wAt(sc,"cabinets","rooms"),tFloors=wAt(sc,"cabinets","floors");
  const tCab=sc.cues.cabinets,tFlood=wAt(sc,"flood","flood"),tYear=wAt(sc,"flood","every year"),tWorth=wAt(sc,"flood","building");
  const tMost=wAt(sc,"eighty","most"),tEighty=wAt(sc,"eighty","eighty");
  const tList=wAt(sc,"list","destroyed"),tLift=wAt(sc,"list","list"),tCong=wAt(sc,"list","Congress"),tPile=wAt(sc,"again","every new pile"),tNew=wAt(sc,"again","new list");
  const tKept=wAt(sc,"kept","simply")-1.6,tJob=wAt(sc,"kept","nobody"),tRent=wAt(sc,"cost","rent"),tStaff=wAt(sc,"cost","staff"),tSteel=wAt(sc,"cost","steel");
  const tClose=wAt(sc,"close","close")-0.6,tVal=wAt(sc,"close","valuable"),tClaim=wAt(sc,"proof","prove a claim"),tServ=wAt(sc,"proof","their service"),tLost=sc.ends.proof+0.2;
  const tabs=[["Orders",wAt(sc,"war","orders")],["Contracts",wAt(sc,"war","contracts")],["Payrolls",wAt(sc,"war","payrolls")],["Letters",wAt(sc,"war","letters")]];
  ag_shots(ctx,S,t,sc.dur,[
    // Washington's avenue at night; the camera glides in to a lit window
    {at:0,place:"hlStreet",push:0.02,d:tWall-tGlide,keys:[[0,960,540,1],[tGlide,HL_STREET_WINDOW.x,HL_STREET_WINDOW.y,2.4]]},
    // the clerk at her cabinets: each top drawer's label is typed as its kind of paper is named; as the cabinets fill, the payrolls'
    // drawer slides open, full, and shuts; boxes pile on the cabinets' tops; the camera draws back along the row
    {at:tWall,place:"hlWall",dis:0.9,push:0.015,keys:[[tWall,960,600,1.1],[tFour,960,540,1]],draw:(x,tt)=>{
      hl_boxes(x,hl_wallX(2)+20,HL_WALL.top-16,HL_WALL.w-40,ag_in(tt,tRooms,1.2),3);hl_boxes(x,hl_wallX(3)+20,HL_WALL.top-16,HL_WALL.w-40,ag_in(tt,tRooms+0.3,1.2),7);
      const typed=k=>{const [w,at]=tabs[k];return w.slice(0,Math.floor(w.length*clamp((tt-at+0.1)/0.45,0,1)));};
      const op=ag_eo(clamp((tt-tCab+0.3)/0.8,0,1))*(1-ag_eo(clamp((tt-tRooms+0.3)/0.7,0,1)));
      hl_wallDrawer(x,0,{});[1,2,4].forEach(i=>hl_wallDrawer(x,i,{big:true,label:typed(i-1),typeOf:tabs[i-1][0]}));hl_wallDrawer(x,3,{big:true,label:typed(2),typeOf:tabs[2][0],out:op,full:1});
      hl_clerk(x,tt,1);}},
    // the building in section, its floors filling; the Archives beside it filling too; ten drawers, eight dimmed; the lists
    {at:tFloors,place:"hlNight",dis:0.8,push:0.015,draw:(x,tt)=>{
      const fill=[0,1,2,3,4,5].map(i=>ag_in(tt,tFloors+0.4+i*0.32,0.5)),aS=hl_v(tt,tFloors,tMost,0.6);
      hl_section(x,250,300,560,540,fill,aS);dp_slip(x,250,186,"A war office","grey",{a:aS*ag_in(tt,tFloors+0.3,0.5),ink:true,size:30});
      hl_archGlass(x,1010,330,700,510,ag_in(tt,tYear,2.4),hl_v(tt,tFlood,tMost,0.7));
      dp_card(x,1010,150,700,{title:"Every year: a building's worth"},{a:hl_v(tt,tWorth,tMost,0.6),k:ag_spr(tt,tWorth,0.9)});
      // ten drawers of the year's papers, eight of them dimming: no lasting value
      const aT=hl_v(tt,tMost+0.3,tList-0.4,0.6);if(aT>0){x.save();x.globalAlpha*=aT;for(let i=0;i<10;i++)hl_drawerIcon(x,250+i*146,450,124,120,i<8?ag_in(tt,tEighty+i*0.08,0.6):0);x.restore();}
      dp_card(x,250,240,620,{title:"80% · no lasting value"},{a:hl_v(tt,tEighty+0.4,tList-0.4,0.6),k:ag_spr(tt,tEighty+0.4,0.9)});
      // the lists: a pile, its list lifting and travelling to Congress; a second pile, a second list
      const aL=ag_in(tt,tList,0.7);hl_pile(x,420,820,Math.round(26*ag_in(tt,tList,1.2)),{a:aL,seed:4});
      const lu=ag_eo(clamp((tt-tLift)/1.8,0,1)),sx=lerp(270,1180,lu),sy=lerp(560,330,lu);
      dp_link(x,[600,600],[1220,330],"grey",ag_in(tt,tLift-0.2,1.2),{dash:[4,14],lw:3,dot:false,alpha:0.8});
      dp_card(x,1260,250,420,{title:"Congress"},{a:ag_in(tt,tCong,0.6),k:ag_spr(tt,tCong,0.9)});
      hl_sheet(x,sx,sy,330,230,{title:["List of papers","for disposal"],lines:3,a:aL,rot:lerp(-0.05,0.03,lu)});
      hl_pile(x,420,820-26*7,Math.round(30*ag_in(tt,tPile,1.6)),{a:ag_in(tt,tPile,0.5),seed:12});
      hl_sheet(x,250,330,330,180,{title:["List No. 2"],lines:2,a:ag_in(tt,tNew,0.8),rot:-0.04});}},
    // back in the office: the drawers stay shut, the room dims; nobody's job; what keeping it all costs
    {at:tKept,place:"hlOffice",dis:0.9,push:0.0,keys:[[tKept,1060,520,1],[tKept+0.5,1060,500,1.16]],d:6,draw:(x,tt)=>{
      x.fillStyle=rgba([0,6,8],0.32*ag_in(tt,tKept+1.2,2.5));x.fillRect(0,0,W,H);
      dp_card(x,640,170,840,{title:"No one's job to decide"},{a:ag_in(tt,tJob,0.6),k:ag_spr(tt,tJob,0.9)});
      [["Rent",tRent,700],["Staff",tStaff,900],["Steel cabinets",tSteel,1110]].forEach(([w,at,px])=>{const u=ag_in(tt,at,0.5);if(u>0){x.save();x.translate(0,(1-ag_spr(tt,at,0.9))*-20);dp_slip(x,px,330,w,"grey",{a:u,ink:true});x.restore();}});}},
    // the platform at night: crates of papers for a freight car; the valuable with the useless; two that someone will need, lost
    {at:tClose,place:"hlPlatform",dis:0.9,push:0.02,draw:(x,tt)=>{
      hl_heap(x,{a:ag_in(tt,tVal-0.3,0.8),warm:ag_in(tt,tVal,0.8)});
      dp_card(x,1060,110,760,{title:"The valuable with the useless"},{a:ag_in(tt,tVal+0.2,0.6),k:ag_spr(tt,tVal+0.2,0.9),behind:"hlPlatform"});
      const sink=ag_eo(clamp((tt-tLost)/1.4,0,1));
      [["To prove a claim",tClaim,560],["To prove their service",tServ,880]].forEach(([w,at,px],i)=>{const up=ag_eo(clamp((tt-at)/1.0,0,1))*(1-sink);if(up<=0)return;
        const y=lerp(640,380+i*120,up);x.save();x.globalAlpha*=clamp(up*2,0,1);x.save();x.shadowColor="rgba(255,226,180,0.55)";x.shadowBlur=24;x.fillStyle="rgb(246,236,212)";x.fillRect(px-20,y-46,dp_tw(x,w,{w:700,size:30})+40,70);x.restore();
        dp_T(x,w,px,y+3,{w:700,size:30,col:HL_INK});x.restore();});
      if(tt>tLost){const u=ag_in(tt,tLost+0.6,0.7);dp_pill(x,640,470,"Lost with the rest","closed",{a:u,align:"center"});}}}
  ],0.8);
  dp_kicker(ctx,"Opening story","Washington, 1943",{a:hl_v(t,0.5,tGlide+0.4,0.8)});
});

/* ---------------------------------------------------------------- 2 · Decided once, before */
scene("before",(ctx,S,t,sc)=>{
  const P=HL_DESK_PAGE,tSign=wAt(sc,"law","signs"),tDraft=wAt(sc,"law","drafted"),tComm=wAt(sc,"law","committee");
  const tTurn=wAt(sc,"once","schedule"),tLong=wAt(sc,"kind","how long"),tThen=wAt(sc,"kind","then"),tArch=wAt(sc,"approve","Archivist"),tCong=wAt(sc,"approve","Congress");
  const tWall=wAt(sc,"approve","papers not")-0.5,tLabel=wAt(sc,"approve","written"),tFill=wAt(sc,"pile","pile"),tClaim=wAt(sc,"claim","money"),tBand=wAt(sc,"claim","stay until");
  const tOther=wAt(sc,"other","destroyed"),tOpen=sc.cues.saved,tSaves=wAt(sc,"saved","saves"),tBudget=wAt(sc,"budget","budget");
  const tSteps=sc.cues.today-0.4,tGood=wAt(sc,"today","kept for good"),tCase=sc.cues.family-0.3,tHall=sc.cues.uni-0.3,tNoEnd=wAt(sc,"uni","no end date"),tEnd=wAt(sc,"end","end date");
  // the drawers that empty, one at a time, each with its own note; the one under the band stays full
  const empties=[[1,tOpen+2.0,"Orders · 1943"],[4,tOpen+3.8,"Letters · 1943"]];
  const label="Payrolls · 1944",typed=Math.floor(label.length*clamp((t-tLabel)/1.1,0,1));
  ag_shots(ctx,S,t,sc.dur,[
    // the desk: the Act; who drafted it; the page turns to a schedule; its columns light; two stamps
    {at:0,place:"hlDesk",push:0.02,draw:(x,tt)=>{
      hl_actPage(x,P,{turn:ag_sine(clamp((tt-tTurn)/1.3,0,1)),litLong:hl_v(tt,tLong,tThen,0.4),litThen:ag_in(tt,tThen,0.4)});
      hl_stamp(x,P.x+P.w/2+40,P.y+P.h-210,"Approved · the Archivist",ag_in(tt,tArch,0.5),-0.05);
      hl_stamp(x,P.x+P.w/2-20,P.y+P.h-110,"Approved · Congress",ag_in(tt,tCong,0.5),0.04);
      const aC=hl_v(tt,tDraft,tTurn,0.6);dp_card(x,60,330,440,{title:"The National Archives"},{a:aC,k:ag_spr(tt,tDraft,0.9)});
      dp_card(x,1420,330,440,{title:"A committee of Congress"},{a:hl_v(tt,tComm,tTurn,0.6),k:ag_spr(tt,tComm,0.9)});
      dp_link(x,[500,420],[P.x,420],"grey",aC,{dot:false,alpha:0.7});dp_link(x,[P.x+P.w,420],[1420,420],"grey",hl_v(tt,tComm,tTurn,0.6),{dot:false,alpha:0.7});}},
    // the cabinets after the law, the clerk gone home: next year's payrolls get their drawer and its label before the papers exist; it
    // fills only after; 1943's payrolls, about money claimed, under a band; nothing any other way; the savings: the drawers of 1943's
    // orders and letters are emptied, one after the other, as their schedules say; the payrolls under the band stay
    {at:tWall,place:"hlWall",dis:0.9,push:0.0,keys:[[tWall,1120,560,1.2],[tOpen,960,540,1]],d:1.8,draw:(x,tt)=>{
      const open=ag_eo(clamp((tt-tOpen)/0.8,0,1)),emptied=([i,te,l])=>({i,big:true,label:l,out:open*(1-ag_eo(clamp((tt-te-0.7)/0.6,0,1))),full:1-ag_in(tt,te,0.6),
        eyeX:i===4?hl_wallX(4)+HL_WALL.w/2:null});// the drawer at the frame's right edge comes out straight towards us, so its label stays in the frame
      // the drawers, the most open drawn last (an open drawer stands in front of its shut neighbours)
      const dr=[{i:0},emptied(empties[0]),{i:2,big:true,label:"Payrolls · 1943",full:1},
        {i:3,big:true,label:label.slice(0,typed),typeOf:label,out:ag_eo(clamp((tt-tLabel-1.2)/0.6,0,1))*(1-ag_in(tt,tFill+1.2,0.6)),full:ag_in(tt,tFill,0.9)},emptied(empties[1])];
      const box={};dr.slice().sort((a,b)=>(a.out||0)-(b.out||0)).forEach(o=>box[o.i]=hl_wallDrawer(x,o.i,o));const d2=box[2],d=box[3];
      // the papers not yet written: a folder drawn in dashes, sliding down into the new drawer and out of sight behind its front
      const fu=clamp((tt-tLabel-1.4)/1.6,0,1);if(fu>0&&fu<1){const fx=d.x+d.w/2,fy=lerp(d.y-250,d.y+150,ag_sine(fu));x.save();x.globalAlpha*=Math.min(1,fu*5);
        x.beginPath();x.rect(d.x-40,0,d.w+80,d.y);x.clip();x.setLineDash([12,9]);x.strokeStyle=rgba(DP.ice,0.95);x.lineWidth=3;
        x.beginPath();x.moveTo(fx-120,fy+80);x.lineTo(fx-120,fy-60);x.lineTo(fx+10,fy-60);x.lineTo(fx+22,fy-84);x.lineTo(fx+100,fy-84);x.lineTo(fx+112,fy-60);x.lineTo(fx+120,fy-60);x.lineTo(fx+120,fy+80);x.stroke();x.restore();}
      hl_bandAcross(x,d2.x-40,d2.y+96,d2.w+80,58,"closed",["Until the claim","is settled"],ag_in(tt,tBand,0.8));
      dp_card(x,1100,130,720,{title:"No paper destroyed any other way"},{a:hl_v(tt,tOther,tSaves-0.3,0.6),k:ag_spr(tt,tOther,0.9)});
      const cs=dp_card(x,1160,110,640,{title:"$927,000 saved",sub:"Army Air Forces alone · 1944"},{a:ag_in(tt,tSaves,0.6),k:ag_spr(tt,tSaves,0.9)});
      dp_slip(x,1160,cs.y+cs.h+14,"About the Archives' whole budget","grey",{a:ag_in(tt,tBudget,0.6),ink:true});}},
    // the Archives today: the few folders go up the steps into the light
    {at:tSteps,place:"hlSteps",dis:0.9,push:0.025,draw:(x,tt)=>{
      const D=HL_STEPS_DOOR;dp_link(x,[960,1040],[960,D.y+D.h/2-30],"grey",ag_in(tt,tSteps+0.5,1.4),{dash:[4,14],lw:3,dot:false,alpha:0.7});
      for(let i=0;i<3;i++){const u=clamp((tt-tSteps-0.8-i*0.7)/2.6,0,1);if(u<=0||u>=1)continue;const y=lerp(1000,D.y+D.h/2,ag_sine(u)),a=Math.min(1,u*4,(1-u)*4);
        x.save();x.globalAlpha*=a;x.shadowColor="rgba(255,226,180,0.8)";x.shadowBlur=20;x.fillStyle="rgb(232,204,150)";x.fillRect(930,y-24,60,44);x.restore();}
      dp_card(x,1180,170,600,{title:"Kept for good today: 1 to 3%"},{a:ag_in(tt,tGood,0.6),k:ag_spr(tt,tGood,0.9),behind:"hlSteps"});}},
    // a family's page and a service record in a glass case, read by lamplight
    {at:tCase,place:"hlCase",dis:0.9,push:0.035},
    // the university: its platform keeps every record, with no end date; one shelf becomes a drawer with its end date
    {at:tHall,place:"hlHall",dis:0.9,push:0.02,draw:(x,tt)=>{
      const dr=ag_in(tt,tEnd,0.9),sh=[0,1,2,3,4,5,6].map(i=>({n:8,warm:i===0,drawer:i===2?dr:0,label:"Pay records"}));hl_block(x,sh,{behind:"hlHall"});
      dp_slip(x,HL_BLOCK.x+HL_BLOCK.w+30,hl_shelfAt(2,7)[1]-35,"Until …","grey",{a:ag_in(tt,tEnd+0.4,0.6),ink:true});
      hl_bandAcross(x,HL_BLOCK.x-60,470,HL_BLOCK.w+120,64,"none","No end date",hl_v(tt,tNoEnd,tEnd-0.2,0.7));}}
  ],0.8);
  if(t<tHall)dp_kicker(ctx,"Washington","7 July 1943",{a:hl_v(t,0.4,tWall-0.4,0.8)});
  dp_kicker(ctx,"Washington","Today",{a:hl_v(t,tSteps+0.4,tHall-0.6,0.8)});
  dp_title(ctx,S,t,sc.cues.breath,"How long, and then what","An end date for every record","FILM 2 OF 5 · KEPT FOR A REASON");
});

/* ---------------------------------------------------------------- 3 · Three stages of a record */
// Ingrid and Yusuf at the hall's edges, looking in at the platform; between them, the block, then the three stages
const HL_INGRID=[200,712,0.76],HL_YUSUF=[1720,712,0.76];
function hl_pair(c,t,o){o=o||{};dp_person(c,"ingrid",HL_INGRID[0],HL_INGRID[1],HL_INGRID[2],{t,gaze:[3,0]});dp_person(c,"yusuf",HL_YUSUF[0],HL_YUSUF[1],HL_YUSUF[2],{t,flip:true,gaze:[3,0]});
  if(o.names>0){dp_pill(c,322,566,"Ingrid Holm","identity",{a:o.names*(o.ingrid==null?1:o.ingrid)});dp_pill(c,1598,566,"Yusuf Demir","identity",{a:o.names*(o.yusuf==null?1:o.yusuf),align:"right"});}}
scene("lives",(ctx,S,t,sc)=>{
  const tPay=wAt(sc,"pay","Pay records"),tApps=wAt(sc,"pay","applications"),tNever=wAt(sc,"never","Nothing"),tThree=wAt(sc,"three","three stages");
  const tUse=wAt(sc,"use","live"),tLinh=wAt(sc,"use","Linh"),tArch=wAt(sc,"archived","archived"),tCold=wAt(sc,"archived","read rarely");
  const tDel=wAt(sc,"deleted","deleted"),tGood=wAt(sc,"good","kept for good"),tYear=sc.cues.year-0.3,tLeak=wAt(sc,"year","leak"),tPlan=wAt(sc,"plan","deleting"),tLaw=wAt(sc,"plan","the law");
  const panesA=hl_v(t,tThree,tYear,0.8);
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"hlHall",push:0.012,draw:(x,tt)=>{
    // the platform: full, nothing ever deleted; dimmed while the three stages are shown
    const bA=1-0.82*panesA,yrs=Math.round(lerp(2016,2026,clamp((tt-tLeak+1.5)/2.6,0,1))),coral=ag_in(tt,tLeak,1.2);
    const sh=[0,1,2,3,4,5,6].map(i=>({n:8,warm:i===6,coral:i===0?coral:0}));hl_block(x,sh,{a:bA,behind:"hlHall"});
    hl_greyTag(x,1190,hl_shelfAt(1,7),"Pay records · since 2016",{behind:"hlHall",a:hl_v(tt,tPay,tThree-0.6,0.6)*bA,p:ag_in(tt,tPay+0.2,0.6)});
    hl_greyTag(x,1190,hl_shelfAt(3,7),"Applications · since 2017",{behind:"hlHall",a:hl_v(tt,tApps,tThree-0.6,0.6)*bA,p:ag_in(tt,tApps+0.2,0.6)});
    hl_bandAcross(x,HL_BLOCK.x-80,62,HL_BLOCK.w+160,64,"none","Nothing ever deleted",hl_v(tt,tNever,tThree-0.6,0.7));
    // the oldest card: its years counting up, its rim turning coral
    if(tt>tYear){const a=hl_v(tt,tYear+0.6,tPlan-0.3,0.6);dp_slip(x,HL_BLOCK.x-190,HL_BLOCK.y+4,String(yrs),"grey",{a,ink:true});
      dp_slip(x,1190,HL_BLOCK.y+60,"Could leak · could be misused","coral",{a:hl_v(tt,tLeak+0.3,tPlan-0.3,0.6)});}
    // deleting without a plan: a record the law needs goes too soon
    if(tt>tPlan){const u=ag_in(tt,tLaw,1.6);hl_rec(x,1180,420,410,["Pay record the law needs"],{a:ag_in(tt,tPlan,0.6)*(1-0.75*u),coral:u,behind:"hlHall"});
      dp_pill(x,1180,566,"Gone too soon","closed",{a:ag_in(tt,tLaw+1.0,0.6)});}
    // three stages: live (in use), archived, deleted; kept for good above archived (the author's names, 12 November 2026)
    if(panesA>0){x.save();x.globalAlpha*=panesA;
      hl_pane(x,440,470,330,330,"Live",{behind:"hlHall",glow:0.8+ag_in(tt,tUse,0.6)*hl_v(tt,tUse,tArch,0.5)});
      hl_pane(x,800,470,330,330,"Archived",{behind:"hlHall"});hl_pane(x,1160,470,330,330,"Deleted",{behind:"hlHall"});
      hl_pane(x,800,200,330,240,"Kept for good",{behind:"hlHall",a:ag_in(tt,tGood-0.4,0.6)});
      hl_rec(x,465,575,280,["Pay records","this year"],{a:ag_in(tt,tUse+0.3,0.6),warm:true,behind:"hlHall"});
      dp_pill(x,605,725,"Linh Nguyen","identity",{a:ag_in(tt,tLinh,0.6),align:"center"});
      ["2023","2024","2025"].forEach((y,i)=>hl_rec(x,822+i*98,575,88,[y],{a:ag_in(tt,tArch+0.3+i*0.25,0.6),dim:0.35,behind:"hlHall"}));
      dp_slip(x,965,668,"Read rarely","grey",{a:ag_in(tt,tCold,0.6),ink:true,align:"center"});
      const fade=ag_in(tt,tDel+0.3,1.4);hl_rec(x,1255,575,140,["2016"],{a:ag_in(tt,tDel-0.3,0.4)*(1-fade),dim:0.4,behind:"hlHall"});
      const up=ag_eo(clamp((tt-tGood)/1.4,0,1));hl_rec(x,835,lerp(575,300,up),260,["Degrees","and results"],{a:ag_in(tt,tGood-0.2,0.5),behind:"hlHall"});
      x.restore();}
    // Ingrid, who owns HR's records, and Yusuf, from data governance
    hl_pair(x,tt,{names:hl_v(tt,sc.cues.look,tPay-0.2,0.6),yusuf:ag_in(tt,wAt(sc,"look","Yusuf"),0.6)});}}]);
  dp_kicker(ctx,"The university","October 2026",{a:hl_v(t,0.5,sc.cues.look+3.5,0.8)});
});

/* ---------------------------------------------------------------- 4 · One schedule, by kind of record */
scene("schedule",(ctx,S,t,sc)=>{
  const tLists=wAt(sc,"lists","Washington"),tOne=wAt(sc,"one","one schedule"),tRow=wAt(sc,"row","kind"),tOwner=wAt(sc,"row","owner"),tReason=wAt(sc,"row","reason");
  const tLong=wAt(sc,"row","how long"),tThen=wAt(sc,"row","then what"),tOwners=wAt(sc,"owners","Ingrid"),tMei=wAt(sc,"owners","Mei Tanaka"),tKeeps=wAt(sc,"owners","Yusuf keeps");
  const tPay=sc.cues.payrow,tAcad=sc.cues.academic,tMail=wAt(sc,"others","mailing"),tApps=wAt(sc,"others","applications"),tPills=wAt(sc,"reason","A reason");
  const tSign=wAt(sc,"signed","sign"),tClean=wAt(sc,"first","clean-up"),tGone=sc.cues.went;
  const aT=hl_v(t,tOne,tClean-0.6,0.8);
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"hlHall",push:0.0,keys:[[0,960,540,1],[tClean,960,500,1.1]],d:1.8,draw:(x,tt)=>{
    // record by record, like Washington's lists: one list after another, never ending
    for(let i=0;i<4;i++)hl_sheet(x,520+i*170,210+i*56,380,230,{title:["List No. "+(i+1)],lines:3,a:hl_v(tt,0.3+i*0.7,tOne-0.8,0.6),rot:-0.05+i*0.032});
    hl_schedule(x,{a:aT,behind:"hlHall",head:[ag_in(tt,tRow,0.4),ag_in(tt,tOwner,0.4),ag_in(tt,tReason,0.4),ag_in(tt,tLong,0.4),ag_in(tt,tThen,0.4)],
      rows:[ag_in(tt,tPay,0.8),ag_in(tt,tAcad,0.8),ag_in(tt,tMail,0.8),ag_in(tt,tApps,0.8)],owners:[ag_in(tt,tOwners,0.5),ag_in(tt,tMei,0.5),ag_in(tt,tOwners+0.25,0.5),ag_in(tt,tOwners+0.5,0.5)],pills:1,pillGlow:hl_v(tt,tPills,tSign,0.5),
      kept:ag_in(tt,tKeeps,0.6),signed:ag_in(tt,tSign,0.8)});
    // the first clean-up: the shelves of 2016, 2017 and 2018 empty one after another, and old applications leave together
    const bA=ag_in(tt,tClean-0.4,0.8);if(bA>0){const years=["2016","2017","2018","2019","2020"],sh=years.map((y,i)=>({n:8*(i<3?1-ag_in(tt,tGone+i*0.9,0.7):1),drawer:0}));
      sh.push({n:8*(1-ag_in(tt,tGone+3.0,1.2))});sh.push({n:8,warm:true});hl_block(x,sh,{a:bA,behind:"hlHall"});
      years.forEach((y,i)=>dp_slip(x,HL_BLOCK.x-160,HL_BLOCK.y+i*HL_BLOCK.h/7+14,y,"grey",{a:bA*(i<3?1-0.6*ag_in(tt,tGone+i*0.9+0.6,0.6):1),ink:true,size:28}));
      hl_greyTag(x,1200,hl_shelfAt(5,7),"Applications, not hired",{behind:"hlHall",a:bA});}}}]);
});

/* ---------------------------------------------------------------- 5 · The clock starts at an event */
// a window back to 1943, over the hall: part of the clerk's cabinets, one drawer drawn live in it (sx, sy, sw, sh: the part of the place)
function hl_inset1943(c,X,Y,Wd,Hd,src,drawer,a){if(a<=0)return;const [sx,sy,sw,sh]=src,k=Wd/sw;c.save();c.globalAlpha*=a;dp_panel(c,X-16,Y-16,Wd+32,Hd+32,{r:18,behind:"hlHall"});
  c.save();rr(c,X,Y,Wd,Hd,12);c.clip();c.drawImage(ag_place("hlWall"),sx,sy,sw,sh,X,Y,Wd,Hd);c.translate(X-sx*k,Y-sy*k);c.scale(k,Hd/sh);drawer(c);c.restore();c.restore();}
scene("clock",(ctx,S,t,sc)=>{
  const tEvent=wAt(sc,"event","event"),tNot=wAt(sc,"event","not from"),tEach=wAt(sc,"contract","each contract"),tEight=wAt(sc,"eight","eight end dates");
  const tFirst=wAt(sc,"firstc","kept until"),tLast=wAt(sc,"lastc","kept until"),tApp=wAt(sc,"others","application"),tMail=wAt(sc,"others","mailing");
  const tFollow=wAt(sc,"follows","end date"),tFri=wAt(sc,"friday","Friday"),tEnds=wAt(sc,"friday","ends"),tNobody=sc.cues.nobody,t43=sc.cues.as43;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"hlHall",push:0.015,draw:(x,tt)=>{
    // a record's time: the day it was made at the line's start; the event, later; how long counts from the event to the end date
    const aE=hl_v(tt,0.4,tEach-0.3,0.7);if(aE>0){const y=470,x0=560,xe=1000,x1=1600;x.save();x.globalAlpha*=aE;
      x.save();x.strokeStyle=rgba(DP.ice,0.9);x.lineWidth=3;x.shadowColor=rgba(DP.F.cyan,0.6);x.shadowBlur=10;x.beginPath();x.moveTo(x0,y);x.lineTo(1780,y);x.stroke();x.restore();
      x.fillStyle=rgba(DP.ice,1);x.beginPath();x.arc(x0,y,8,0,TAU);x.fill();hl_rec(x,x0-40,y-170,300,["Pay record"],{behind:"hlHall"});dp_T(x,"Made",x0,y+58,{w:700,size:28,align:"center",col:"mut"});
      const ev=ag_in(tt,tEvent,0.6);if(ev>0){x.save();x.globalAlpha*=ev;x.strokeStyle=rgba(DP.ice,1);x.lineWidth=3;x.beginPath();x.moveTo(xe,y-60);x.lineTo(xe,y+60);x.stroke();x.restore();
        dp_slip(x,xe,y+76,"Event","grey",{a:ev,ink:true,align:"center"});}
      const p=ag_eo(clamp((tt-tNot)/1.4,0,1));if(p>0){const xa=lerp(xe,x1,p);dp_link(x,[xe,y-34],[xa,y-34],"grey",1,{dot:false,lw:4});
        dp_T(x,"How long",(xe+x1)/2,y-58,{w:700,size:30,align:"center",a:clamp(p*2,0,1)});
        if(p>=1){const u=ag_in(tt,tNot+1.4,0.5);x.save();x.globalAlpha*=u;x.strokeStyle=rgba(DP.ice,1);x.lineWidth=3;x.beginPath();x.moveTo(x1,y-60);x.lineTo(x1,y+60);x.stroke();x.restore();
          dp_T(x,"End date",x1,y+108,{w:700,size:30,align:"center",a:u});}}
      x.restore();}
    // Linh's eight contracts, and each one's end date: the first, then the last, picked out in turn
    const d43=0.65*ag_in(tt,t43-0.2,0.7);
    for(let i=0;i<8;i++){const pick=i===0?hl_v(tt,tFirst,tLast-0.2,0.5):i===7?ag_in(tt,tLast,0.5)*(1-ag_in(tt,tApp-0.2,0.5)):0;
      const dim=Math.max(0.55*ag_in(tt,tFirst,0.5)*(1-pick)*(1-ag_in(tt,tApp-0.2,0.6)),d43);
      hl_contract(x,i,ag_in(tt,tEach+i*0.18,0.6),ag_in(tt,tEight+0.3+i*0.15,0.5),{dim,behind:"hlHall",lit:Math.max(pick,hl_v(tt,tNobody+i*0.12,t43-0.2,0.5))});}
    dp_slip(x,1350,HL_CY+7*HL_CH-3,"Ended","grey",{a:hl_v(tt,tEnds,t43-0.3,0.6),ink:true});
    // other kinds, other events
    dp_card(x,1350,190,540,{title:"Application",sub:"from the decision"},{a:hl_v(tt,tApp,tFollow-0.2,0.6),k:ag_spr(tt,tApp,0.9)});
    dp_card(x,1350,400,540,{title:"Mailing list",sub:"from the last contact, or a no"},{a:hl_v(tt,tMail,tFollow-0.2,0.6),k:ag_spr(tt,tMail,0.9)});
    dp_card(x,1350,190,540,{title:"Friday 20 November 2026"},{a:hl_v(tt,tFri,t43-0.3,0.6),k:ag_spr(tt,tFri,0.9)});
    // as in 1943: the drawer labelled before its papers
    hl_inset1943(x,1130,330,700,282,[1100,590,490,197],cc=>hl_wallDrawer(cc,3,{big:true,label:"Payrolls · 1944",full:1}),hl_v(tt,t43,sc.dur,0.7));
    // Linh, the casual tutor whose contracts they are
    dp_person(x,"linh",270,612,0.95,{t:tt,gaze:[3,0]});
    dp_pill(x,270,742,"Linh Nguyen","identity",{a:hl_v(tt,wAt(sc,"eight","Linh"),tFirst,0.6),align:"center"});}}]);
});

/* ---------------------------------------------------------------- 6 · A hold stops the clock */
scene("hold",(ctx,S,t,sc)=>{
  const tTutor=wAt(sc,"tutor","former tutor"),tDue=wAt(sc,"due","due to go"),tShow=wAt(sc,"show","neither"),tPlace=wAt(sc,"places","places a hold");
  const tNames=wAt(sc,"names","names"),tReason=wAt(sc,"names","reason"),tPlaced=wAt(sc,"names","placed"),tLift=wAt(sc,"names","lift");
  const tSkips=wAt(sc,"skips","skips"),tCase=wAt(sc,"never","just in case"),tSettled=wAt(sc,"lifts","settled"),tLifts=wAt(sc,"lifts","lifts"),tNext=wAt(sc,"lifts","next clean-up");
  const t43=sc.cues.as43;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"hlHall",push:0.015,draw:(x,tt)=>{
    // the drawer of 2019's pay records, due to go in January; hers among them
    const aD=ag_in(tt,0.6,0.8),dim=0.35*hl_v(tt,tShow,tPlace,0.6),D={x:150,y:300,w:820,h:300};
    x.save();x.globalAlpha*=aD*(1-dim);dp_panel(x,D.x,D.y,D.w,D.h,{r:18,behind:"hlHall"});dp_T(x,"Pay records · 2019",D.x+30,D.y+56,{w:700,size:34});
    for(let k=0;k<10;k++){const hers=k>=7,leave=hers?ag_in(tt,tNext,1.0):ag_in(tt,tSkips+0.4+k*0.08,0.9),a=1-leave;if(a<=0)continue;x.save();x.globalAlpha*=a;x.translate(0,-30*leave);
      x.fillStyle="rgba(190,240,240,0.16)";rr(x,D.x+40+k*76,D.y+100,56,160,6);x.fill();x.strokeStyle=rgba(DP.ice,0.6);x.lineWidth=1.6;rr(x,D.x+40+k*76,D.y+100,56,160,6);x.stroke();x.restore();}
    x.restore();
    dp_slip(x,D.x+D.w-370,D.y-90,"Due to go: January","grey",{a:aD*hl_v(tt,tDue,tSkips-0.3,0.6),ink:true});
    // the hold, across her records only
    const band=ag_in(tt,tPlace,0.9)*(1-ag_in(tt,tLifts,0.9));hl_bandAcross(x,D.x+40+7*76-14,D.y+150,3*76+12,60,"closed","Hold",band);
    // the claim, and the hold's card
    dp_card(x,1060,150,700,{title:"A former tutor's pay claim",sub:"not settled"},{a:hl_v(tt,tTutor,tNames-0.4,0.6)*(1-dim*0.8),k:ag_spr(tt,tTutor,0.9),behind:"hlHall"});
    const hc=hl_v(tt,tNames,tSettled,0.6);if(hc>0){x.save();x.globalAlpha*=hc;dp_panel(x,1060,150,760,360,{col:"coral",r:20,behind:"hlHall"});
      dp_T(x,"HOLD",1100,214,{w:800,size:28,ls:4,col:"coral"});
      [["Records: her pay records, 2019",tNames],["Reason: her pay claim",tReason],["Placed by: the legal office",tPlaced],["Lifted by: the legal office",tLift]].forEach(([s,at],i)=>
        dp_T(x,s,1100,282+i*58,{w:600,size:30,a:ag_in(tt,at,0.5)}));x.restore();}
    dp_card(x,1060,560,380,{title:"January"},{a:hl_v(tt,tSkips-0.2,tCase-0.2,0.6),k:ag_spr(tt,tSkips-0.2,0.9),behind:"hlHall"});
    // never just in case
    const jc=hl_v(tt,tCase-0.4,tSettled-0.2,0.6);if(jc>0){const bb=dp_slip(x,1060,560,"Just in case","grey",{a:jc,ink:true});hl_strike(x,bb.x+16,bb.y+bb.h/2+2,bb.w-32,ag_in(tt,tCase+0.2,0.6)*jc);}
    dp_card(x,1060,560,420,{title:"Next clean-up"},{a:hl_v(tt,tNext-0.4,t43-0.2,0.6),k:ag_spr(tt,tNext-0.4,0.9),behind:"hlHall"});
    // as in 1943: the drawer kept until the claim is settled, for a moment
    const m=hl_v(tt,t43,sc.dur,0.7);hl_inset1943(x,1100,300,700,282,[715,590,490,197],cc=>hl_wallDrawer(cc,2,{big:true,label:"Payrolls · 1943",full:1}),m);
    hl_bandAcross(x,1090,446,720,58,"closed",["Until the claim","is settled"],ag_in(tt,t43+0.5,0.8)*m);}}]);
});

/* ---------------------------------------------------------------- 7 · An end date for every record */
scene("end",(ctx,S,t,sc)=>{
  const tSoon=wAt(sc,"short","Deleted too soon"),tLong=wAt(sc,"long","Kept too long"),tLaws=wAt(sc,"laws","keep personal"),tOut=wAt(sc,"outside","outside the schedule");
  const tHold=wAt(sc,"outside","except"),tCopy=wAt(sc,"copy","every copy"),tDmd=wAt(sc,"dmd","Deleted means"),t43=sc.cues.pile-0.3,tFew=wAt(sc,"few","rest went"),tUni=sc.cues.every-0.3;
  const panes=["Platform","Archive","Old versions","Logs"];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hlHall",push:0.015,draw:(x,tt)=>{
      hl_lifeline(x,{a:hl_v(tt,0.4,tLaws-0.3,0.8),soon:hl_v(tt,tSoon,tLong,0.5),long:ag_in(tt,tLong,0.5)});
      dp_card(x,360,170,1200,{title:"Keep personal data no longer than its reason needs"},{a:hl_v(tt,tLaws,tCopy-0.4,0.6),k:ag_spr(tt,tLaws,0.9),behind:"hlHall"});
      const sg=hl_v(tt,tOut,tCopy-0.4,0.6);if(sg>0){dp_card(x,560,420,520,{title:"Retention schedule"},{a:sg,behind:"hlHall"});hl_bandAcross(x,1130,436,200,64,"closed","Hold",ag_in(tt,tHold,0.8)*sg);}
      const slide=ag_eo(clamp((tt-tDmd)/1.6,0,1));
      panes.forEach((p,i)=>{const a=ag_in(tt,tCopy+i*0.35,0.6)*(1-ag_in(tt,tDmd+0.8,0.8));if(a<=0)return;const px=240+i*370+(i<2?-1:1)*slide*260;
        hl_pane(x,px,300,330,300,p,{a,behind:"hlHall"});dp_slip(x,px+165,430,"Until 20 Nov 2033","grey",{a,ink:true,align:"center",size:28});});}},
    // 1943: the cabinets labelled; most drawers empty, a few folders on their way to the Archives
    {at:t43,place:"hlWall",dis:0.9,push:0.02,keys:[[t43,960,540,1]],draw:(x,tt)=>{
      [["Orders · 1941",0.1,0],["Contracts · 1942",0.15,0.6],["Payrolls · 1943",1,0.6],["Letters · 1943",0.1,0.35]].forEach(([l,f,o],k)=>hl_wallDrawer(x,k+1,{big:true,label:l,out:o,full:f}));
      hl_wallDrawer(x,0,{});hl_clerk(x,tt,1);
      for(let i=0;i<3;i++){const u=clamp((tt-tFew-i*0.6)/2.4,0,1);if(u<=0||u>=1)continue;const px=lerp(1210,1900,ag_sine(u)),py=lerp(700,420,ag_sine(u))-Math.sin(u*Math.PI)*60;
        x.save();x.globalAlpha*=Math.min(1,u*4,(1-u)*3);x.shadowColor="rgba(255,226,180,0.7)";x.shadowBlur=18;x.fillStyle="rgb(222,196,140)";x.fillRect(px-36,py-26,72,52);x.restore();}}},
    // the university: the platform's shelves now drawers, one for each kind of record, each with how long it's kept
    {at:tUni,place:"hlHall",dis:0.9,push:0.02,draw:(x,tt)=>{
      const rows=[["Pay records","7 years after each contract"],["Academic records","Kept for good"],["Mailing list","Until a no, or 2 years"],["Applications","12 months after the decision"]];
      const sh=rows.map((r,i)=>({n:8,drawer:1,label:r[0],warm:i===0}));hl_block(x,sh,{behind:"hlHall"});
      rows.forEach((r,i)=>dp_slip(x,HL_BLOCK.x+HL_BLOCK.w+24,HL_BLOCK.y+(i+0.5)*HL_BLOCK.h/4-34,r[1],"grey",{ink:true,size:28,a:ag_in(tt,tUni+0.8+i*0.25,0.6)}));}}
  ],0.8);
  dp_end(ctx,S,t,sc.cues.breath,"How long, and then what","Every record has an end date, decided before it's needed.","Film 2 of 5","Kept for a reason");
});

ag_cutInto(["lives","schedule","clock","hold","end"]);

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
