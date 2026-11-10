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

// It feels like understanding, the third film of What an agent is, the first series on agentic data engineering. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years in words). The few longer stops are in breath.js.
const NARR={
"orbiter":{"name":"Two teams, one number","lead":1.6,"tail":1.0,"vo":[
 {"id":"launch","gap":0.8,"text":"In December 1998, NASA launched the Mars Climate Orbiter, to study the weather on Mars.","say":"In December nineteen ninety-eight, NASA launched the Mars Climate Orbiter, to study the weather on Mars."},
 {"id":"thrusters","gap":0.8,"text":"On the way, small thrusters kept it pointing the right way, and each firing pushed it slightly off course."},
 {"id":"builders","gap":0.8,"text":"The builders' software, in Colorado, worked out the size of every push."},
 {"id":"file","gap":0.8,"text":"It sent the numbers in a file to NASA's navigators in California, who steer the craft."},
 {"id":"agreed","gap":0.8,"text":"The teams had agreed on newton-seconds, the metric unit."},
 {"id":"gave","gap":0.8,"text":"But the file gave pound-seconds, each about four and a half times bigger."},
 {"id":"quarter","gap":0.8,"text":"So the navigators counted every push at less than a quarter of its size."},
 {"id":"sure","gap":0.8,"text":"Each team was sure the numbers meant the same to both."},
 {"id":"months","gap":0.8,"text":"For nine months, small errors added up."},
 {"id":"april","gap":0.8,"text":"From April, the navigators saw that something didn't fit; they raised it in emails, but it was never settled."},
 {"id":"routine","gap":0.8,"text":"After thirty years of success, orbiting Mars felt routine."},
 {"id":"burn","gap":0.3,"text":"On the 23rd of September 1999, it fired its engine to enter orbit,","say":"On the twenty-third of September nineteen ninety-nine, it fired its engine to enter orbit,"},
 {"id":"behind","gap":0.8,"text":"and passed behind Mars, 170 kilometres lower than planned.","say":"and passed behind Mars, a hundred and seventy kilometres lower than planned."},
 {"id":"never","gap":0.8,"text":"It was never heard from again."},
 {"id":"lost","gap":0.8,"text":"Years of work, and the first weather satellite at another planet, were lost."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"odyssey","gap":0.3,"text":"So on the next orbiter, Mars Odyssey, the team wrote both units on every hand-off,"},
 {"id":"independent","gap":0.3,"text":"had every critical number checked independently,"},
 {"id":"second","gap":0.8,"text":"and added a second way to find the craft."},
 {"id":"orbit","gap":0.8,"text":"In October 2001, Odyssey went into orbit, and twenty years later it was still at work, the longest-lived spacecraft at Mars.","say":"In October two thousand and one, Odyssey went into orbit, and twenty years later it was still at work, the longest-lived spacecraft at Mars."},
 {"id":"risk","gap":0.8,"text":"Agents bring the same risk to data work: a person and an agent, each sure the other means the same thing."},
 {"id":"rely","gap":0.8,"text":"Say what a number means, check it against something else, and you can rely on it."}]},
"fluent":{"name":"A fluent answer","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university, Anil Kurian plans the Faculty of Health's student advisers."},
 {"id":"calls","gap":0.8,"text":"Each adviser calls 240 students once a term, to see how they're doing.","say":"Each adviser calls two hundred and forty students once a term, to see how they're doing."},
 {"id":"asks","gap":0.8,"text":"So Anil asks Jun, in the data team, how many students the faculty has this term."},
 {"id":"agent","gap":0.8,"text":"Jun asks the agent."},
 {"id":"hands","gap":0.8,"text":"Its hands read the catalog and run a query, and it checks the count against the source."},
 {"id":"answer","gap":0.8,"text":"Seconds later: 2,160 students, 63 more than last year, with its evidence attached.","say":"Seconds later: two thousand, one hundred and sixty students, sixty-three more than last year, with its evidence attached."},
 {"id":"study","gap":0.8,"text":"In a 2025 study, longer explanations made people more confident in an AI's answers, even when the answers were no more accurate.","say":"In a twenty twenty-five study, longer explanations made people more confident in an AI's answers, even when the answers were no more accurate."},
 {"id":"feels","gap":0.8,"text":"It feels like understanding, and it feels safe."}]},
"explain":{"name":"Explain it","lead":1.0,"tail":1.0,"vo":[
 {"id":"try","gap":0.8,"text":"Try this: how well do you understand how a zip works, from one to seven?"},
 {"id":"now","gap":0.8,"text":"Now explain, step by step, how it closes and opens."},
 {"id":"yale","gap":0.8,"text":"In 2002, at Yale, Leonid Rozenblit and Frank Keil asked people to do just that, with everyday things like a zip.","say":"In two thousand and two, at Yale, Leonid Rozenblit and Frank Keil asked people to do just that, with everyday things like a zip."},
 {"id":"lower","gap":0.8,"text":"After trying, they rated themselves lower."},
 {"id":"six","gap":0.8,"text":"Jun would give his understanding of the agent's answer a six."},
 {"id":"table","gap":0.6,"text":"Which table did it read?"},
 {"id":"student","gap":0.6,"text":"What counted as a student?"},
 {"id":"compare","gap":0.8,"text":"What did its check compare?"},
 {"id":"cant","gap":0.8,"text":"He can't say, not even roughly."},
 {"id":"came","gap":0.8,"text":"The feeling came from the answer, not from knowing what happened."}]},
"right":{"name":"Right every time","lead":1.0,"tail":1.0,"vo":[
 {"id":"months","gap":0.8,"text":"For months, the agent had been right, so Jun had stopped opening the evidence."},
 {"id":"chat","gap":0.8,"text":"Early in the term, Anil wrote in a chat that the advisers' lists looked long."},
 {"id":"replied","gap":0.8,"text":"Jun replied that the agent had checked its source, and they both let it go."},
 {"id":"review","gap":0.8,"text":"In 2010, Raja Parasuraman and Dietrich Manzey reviewed the research on automated aids.","say":"In twenty ten, Raja Parasuraman and Dietrich Manzey reviewed the research on automated aids."},
 {"id":"busy","gap":0.8,"text":"When an aid has been right for a long time, people stop checking it, above all when they're busy."},
 {"id":"experts","gap":0.8,"text":"It happens to experts too, and training alone doesn't prevent it."},
 {"id":"routine","gap":0.8,"text":"Like orbiting Mars, the agent's answers had come to feel routine."},
 {"id":"planned","gap":0.8,"text":"The faculty planned nine advisers."},
 {"id":"needed","gap":0.8,"text":"It needed twelve, and 720 students never had their call.","say":"It needed twelve, and seven hundred and twenty students never had their call."}]},
"meanings":{"name":"One word, two meanings","lead":1.0,"tail":1.0,"vo":[
 {"id":"counted","gap":0.8,"text":"At the end of the term, Anil counted the advisers' lists: 2,880 students.","say":"At the end of the term, Anil counted the advisers' lists: two thousand, eight hundred and eighty students."},
 {"id":"load","gap":0.8,"text":"The agent had counted from student load, the table the university reports to the government."},
 {"id":"half","gap":0.8,"text":"There, two half-time students count as one, and half the faculty studies half-time."},
 {"id":"fte","gap":0.8,"text":"So the table said 2,160: full-time equivalents, not people.","say":"So the table said two thousand, one hundred and sixty: full-time equivalents, not people."},
 {"id":"meant","gap":0.8,"text":"Jun meant people; the agent took the table's meaning."},
 {"id":"neither","gap":0.8,"text":"Neither asked."},
 {"id":"people","gap":0.8,"text":"People check they've understood each other: they say it back, or ask."},
 {"id":"study","gap":0.8,"text":"A 2024 study found that language models do this less, and presume we already agree.","say":"A twenty twenty-four study found that language models do this less, and presume we already agree."},
 {"id":"same","gap":0.8,"text":"The agent's check had compared its total with that same table, so it passed."},
 {"id":"record","gap":0.8,"text":"And the record of what its hands did showed it all along: it added up full-time equivalents."}]},
"knowing":{"name":"Knowing, not feeling","lead":1.0,"tail":1.0,"vo":[
 {"id":"board","gap":0.8,"text":"NASA's review board put it plainly: mistakes happen, and checks are there to catch them."},
 {"id":"three","gap":0.8,"text":"So Jun's team changed three things, as Odyssey's team did."},
 {"id":"say","gap":0.8,"text":"Say what you mean, and hear it said back: every count names its unit, and the agent reads the question back before it counts."},
 {"id":"check","gap":0.3,"text":"Check against something the agent didn't make, like the faculty's own list of students,"},
 {"id":"hands","gap":0.8,"text":"and read what its hands did, not only what it says."},
 {"id":"log","gap":0.8,"text":"Write every doubt in the team's log, with an owner, until it's answered."},
 {"id":"decides","gap":0.8,"text":"And a person decides; the agent's tick is only for reference."}]},
"close":{"name":"Feeling sure is not knowing","lead":1.0,"tail":1.0,"vo":[
 {"id":"again","gap":0.8,"text":"This term, Jun asks again, and the agent reads it back: students in the Faculty of Health, each person counted once?"},
 {"id":"yes","gap":0.8,"text":"Jun says yes."},
 {"id":"counts","gap":0.8,"text":"It counts 2,880, and the faculty's own list agrees.","say":"It counts two thousand, eight hundred and eighty, and the faculty's own list agrees."},
 {"id":"twelve","gap":0.8,"text":"So the faculty plans twelve advisers, and every student gets their call."},
 {"id":"fluent","gap":0.8,"text":"A fluent answer, a green tick and a long run of success all make us feel we understand."},
 {"id":"anyway","gap":0.8,"text":"Odyssey's team checked anyway, and their orbiter was still at work twenty years later."},
 {"id":"plan","gap":0.8,"text":"Checked like that, an agent's answer is one you can plan on."},
 {"id":"takeaway","gap":0.8,"text":"Feeling sure is not knowing."}]}
};

const VODUR={"orbiter/launch": 6.082, "orbiter/thrusters": 5.923, "orbiter/builders": 4.176, "orbiter/file": 4.92, "orbiter/agreed": 3.052, "orbiter/gave": 3.814, "orbiter/quarter": 3.95, "orbiter/sure": 2.671, "orbiter/months": 2.182, "orbiter/april": 6.349, "orbiter/routine": 3.488, "orbiter/burn": 4.933, "orbiter/behind": 4.346, "orbiter/never": 1.466, "orbiter/lost": 4.277, "orbiter/change": 1.288, "orbiter/odyssey": 4.933, "orbiter/independent": 2.426, "orbiter/second": 2.213, "orbiter/orbit": 8.706, "orbiter/risk": 6.127, "orbiter/rely": 4.216, "fluent/today": 5.322, "fluent/calls": 4.801, "fluent/asks": 5.019, "fluent/agent": 1.35, "fluent/hands": 4.711, "fluent/answer": 7.175, "fluent/study": 8.759, "fluent/feels": 2.51, "explain/try": 4.088, "explain/now": 3.417, "explain/yale": 8.24, "explain/lower": 2.439, "explain/six": 3.406, "explain/table": 1.281, "explain/student": 1.432, "explain/compare": 1.214, "explain/cant": 1.828, "explain/came": 3.252, "right/months": 4.285, "right/chat": 4.31, "right/replied": 4.175, "right/review": 6.236, "right/busy": 5.021, "right/experts": 3.539, "right/routine": 3.945, "right/planned": 1.919, "right/needed": 4.094, "meanings/counted": 6.218, "meanings/load": 5.289, "meanings/half": 4.717, "meanings/fte": 5.167, "meanings/meant": 2.997, "meanings/neither": 0.914, "meanings/people": 3.709, "meanings/study": 5.81, "meanings/same": 4.165, "meanings/record": 4.995, "knowing/board": 4.96, "knowing/three": 3.494, "knowing/say": 7.33, "knowing/check": 4.505, "knowing/hands": 2.756, "knowing/log": 3.704, "knowing/decides": 3.822, "close/again": 7.096, "close/yes": 1.027, "close/counts": 4.632, "close/twelve": 4.212, "close/fluent": 5.262, "close/anyway": 4.604, "close/plan": 3.168, "close/takeaway": 1.431};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title, over the series' mark, after the opening; and the end card. */
const BREATH={
"orbiter":{"hold":{"launch":0.6,"thrusters":0.6,"file":0.6,"gave":0.8,"quarter":0.8,"sure":1.0,"months":0.8,"april":0.8,"routine":0.8,"behind":0.6,"never":1.6,"lost":0.8,"change":0.6,"second":0.6,"orbit":1.0,"risk":0.6},"breathe":4.4},
"fluent":{"hold":{"today":0.4,"calls":0.6,"asks":0.4,"hands":0.8,"answer":1.0,"study":0.8}},
"explain":{"hold":{"try":1.6,"now":1.4,"lower":0.8,"six":0.6,"compare":0.4,"cant":1.0}},
"right":{"hold":{"months":0.8,"replied":1.0,"busy":0.6,"experts":0.6,"routine":0.8,"planned":0.4}},
"meanings":{"hold":{"counted":0.6,"half":1.0,"fte":0.8,"neither":1.0,"people":0.4,"study":0.6,"same":0.6}},
"knowing":{"hold":{"board":1.2,"three":0.8,"say":1.4,"hands":1.4,"log":1.2,"decides":0.6}},
"close":{"hold":{"yes":0.4,"counts":0.8,"twelve":1.0,"fluent":0.6,"anyway":0.6,"plan":0.8},"breathe":4.6}
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

/* ===== It feels like understanding: the film's own places, people of 1999 and things =====
   Film 3 of What an agent is. Everything here is this film's own, with the prefix fu_ (FU_ for constants); the series' look
   (kit.js, room.js, people.js, agent.js, cards.js) is used as it is, never changed. Sizes are in the 1920 x 1080 frame; every word is
   drawn live with ag_T, at least 28 px as seen, and nothing but the captions goes below y 890.
     plan.js    the places, the colours of this film's things, the people of 1999 and their desks, and the drawing in graphite on the
                wall: Earth, Mars, the paths, the two orbiters
     work.js    today's things: Jun's desk and the agent, Anil's desk and his screen, the advisers and their lists, students as plain
                shapes, the zip and its scale, the gauges, the calendar, the evidence folder, the record of what the agent's hands did,
                the team's log and the faculty's own list
     scenes.js  the seven chapters */

/* ---------------------------------------------------------------- colours of this film's own things (none means a check or data) */
const FU={graphite:[58,60,66],earth:[132,152,168],mars:[184,128,106],beige:[226,219,203],beigeDk:[182,172,150],phosphor:[206,222,212],
  paper:[247,245,240],rule:[196,190,180],dust:[150,146,138]};

/* ---------------------------------------------------------------- places, painted once: the series' lab, with its veins kept quiet where
   this film puts its drawings and words. The marble's own default zones (behind the middle, and the kicker at the top left) stay. */
const FU_KICK=[480,90,420,46,0.3];
AG_PLACES.fuWall=c=>ag_paintLab(c,{quiet:[[980,250,880,190,0.8],[1124,476,250,210,0.4],FU_KICK]});            // 1999: the drawing of space across the upper wall
AG_PLACES.fuWallDim=c=>{ag_paintLab(c,{quiet:[[980,250,880,190,0.8],[1124,476,250,210,0.4],FU_KICK]});            // the same wall, the light lower: the night of the loss
  c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(214,212,214)";c.fillRect(0,0,W,H);c.restore();};
AG_ROOMS.fuWallDim="fuWall";                                // one wall, its light up or down: the camera glides from one to the other
AG_PLACES.fuData=c=>ag_paintLab(c,{seed:2,quiet:[[1180,300,520,250,0.7],[600,330,420,200,0.5],FU_KICK]});          // the data team: the agent, its tools and its cards
AG_PLACES.fuFaculty=c=>ag_paintLab(c,{seed:4,quiet:[[620,330,600,230,0.7],[1300,260,360,160,0.5],FU_KICK]});      // the Faculty of Health: the advisers along the wall
AG_PLACES.fuQuiet=c=>ag_paintLab(c,{seed:6,quiet:[[960,360,860,260,0.8],FU_KICK]});                               // the zip, the study cards, the word in the middle

/* ---------------------------------------------------------------- words in the corner: when and where, on a small card so they read over
   anything drawn behind them; the time in violet, the place in grey capitals */
function fu_when(ctx,when,where,a){if(a<=0.01)return;const x=72,y=52,h=62,w1=ag_tw(ctx,when,{w:800,size:30}),cap=where?String(where).toUpperCase():"",
    w2=cap?ag_tw(ctx,cap,{w:700,size:28,ls:3.5}):0,w=56+w1+(cap?44+w2:0);
  ag_box(ctx,x,y,w,h,h/2,{a});withA(ctx,a,()=>{ag_T(ctx,when,x+28,y+42,{w:800,size:30,col:AG.violet});
    if(cap){ctx.fillStyle=rgba(AG.mut,0.55);ctx.beginPath();ctx.arc(x+28+w1+22,y+h/2,3.2,0,TAU);ctx.fill();ag_T(ctx,cap,x+28+w1+44,y+41,{w:700,size:28,ls:3.5,col:AG.kick});}});}
// a desk's sign on the wall above it: the place, and who works there
// two lines, as a name card: the place, and who works there; narrow, so it keeps clear of the drawing's names on the wall
function fu_sign(ctx,x,y,place,who,a,k){if(a<=0.01)return;const w=Math.max(ag_tw(ctx,place,{w:700,size:30}),ag_tw(ctx,who,{w:500,size:28}))+56,h=96;
  ctx.save();if(k!=null)ag_about(ctx,x,y,lerp(0.6,1,k));ag_box(ctx,x-w/2,y-h/2,w,h,16,{a});
  withA(ctx,a,()=>{ag_T(ctx,place,x-w/2+28,y-h/2+42,{w:700,size:30});ag_T(ctx,who,x-w/2+28,y-h/2+78,{w:500,size:28,col:AG.mut});});ctx.restore();}
// a name card under a person: the name, and a line under it
function fu_nameCard(ctx,x,y,name,line,a){if(a<=0.01)return;const w=Math.max(ag_tw(ctx,name,{w:700,size:32}),ag_tw(ctx,line,{w:500,size:28}))+56;
  ag_box(ctx,x,y,w,96,16,{a});withA(ctx,a,()=>{ag_T(ctx,name,x+28,y+42,{w:700,size:32});ag_T(ctx,line,x+28,y+78,{w:500,size:28,col:AG.mut});});}
// a source card: who, and when
function fu_source(ctx,x,y,who,when,a,o){o=o||{};if(a<=0.01)return;const w=ag_tw(ctx,who,{w:700,size:30})+ag_tw(ctx,when,{w:500,size:30})+92;
  ag_box(ctx,x,y,w,64,32,{a});withA(ctx,a,()=>{ag_T(ctx,who,x+30,y+42,{w:700,size:30});ag_T(ctx,when,x+w-30,y+42,{w:500,size:30,col:AG.mut,align:"right"});
    ctx.fillStyle=rgba(AG.mut,0.5);ctx.beginPath();ctx.arc(x+w-46-ag_tw(ctx,when,{w:500,size:30}),y+32,3,0,TAU);ctx.fill();});return w;}

/* ---------------------------------------------------------------- the people of 1999: composites, never the mission's real people, nobody
   named; dressed for their year, with the series' proportions. At the builders' desk, in Colorado: a cardigan, and a fleece vest over a
   checked shirt; at the navigators' desk, in California: a shirt and tie, and a polo shirt. */
function fu_checks(c,P){c.save();ag_shape(c,AG_F.torso);c.clip();c.strokeStyle=rgba(ag_dk(P.top.c,0.3),0.28);c.lineWidth=5;
  for(let x=60;x<460;x+=34){c.beginPath();c.moveTo(x,560);c.lineTo(x+12,1100);c.stroke();}for(let y=600;y<1100;y+=34){c.beginPath();c.moveTo(60,y);c.lineTo(460,y+8);c.stroke();}c.restore();}
function fu_vest(c,P){const v=P.top.vest;c.save();ag_shape(c,AG_F.torso);c.clip();
  const sh=cc=>{cc.moveTo(60,560);cc.lineTo(236,566);cc.bezierCurveTo(262,640,290,760,312,900);cc.lineTo(330,1100);cc.lineTo(60,1100);cc.closePath();
    cc.moveTo(358,604);cc.bezierCurveTo(350,700,334,800,322,900);cc.lineTo(336,1100);cc.lineTo(470,1100);cc.lineTo(470,600);cc.closePath();};
  ag_soft(c,sh,v,ag_lt(v,0.3),380,700,320,rgba(ag_dk(v,0.7),0.4),24);
  // the zip, and the fleece's soft nap
  c.strokeStyle=rgba(ag_dk(v,0.5),0.7);c.lineWidth=3;c.beginPath();c.moveTo(314,900);c.lineTo(330,1100);c.stroke();
  const R=ag_rnd(9);c.fillStyle=rgba(ag_lt(v,0.25),0.18);for(let i=0;i<400;i++){c.beginPath();c.arc(70+R()*400,600+R()*500,1.6+R()*1.6,0,TAU);c.fill();}c.restore();}
function fu_tie(c,P){ag_soft(c,cc=>{cc.moveTo(300,612);cc.lineTo(322,610);cc.lineTo(330,640);cc.lineTo(338,820);cc.lineTo(318,856);cc.lineTo(300,820);cc.lineTo(306,642);cc.closePath();},
  P.top.tie,ag_lt(P.top.tie,0.3),326,680,90,rgba(ag_dk(P.top.tie,0.7),0.4),8);
  c.fillStyle=rgba(ag_dk(P.top.tie,0.35),0.5);for(let y=660;y<840;y+=26){c.beginPath();c.moveTo(304,y);c.lineTo(336,y-10);c.lineTo(336,y-4);c.lineTo(304,y+6);c.closePath();c.fill();}}
function fu_polo(c,P){c.save();ag_shape(c,AG_F.torso);c.clip();c.strokeStyle=rgba(ag_dk(P.top.c,0.3),0.55);c.lineWidth=2.4;c.beginPath();c.moveTo(304,612);c.lineTo(310,720);c.lineTo(330,720);c.lineTo(326,612);c.stroke();
  for(const y of [650,690]){c.fillStyle=rgba(ag_lt(P.top.c,0.5),1);c.beginPath();c.arc(318,y,4.5,0,TAU);c.fill();}c.restore();}
const FU_PEOPLE={
  builderA:{name:"Builder in a cardigan",key:"fu_bA",skin:[232,196,168],hair:{style:"bob",c:[104,72,50]},earrings:[214,200,170],top:{kind:"cardigan",c:[168,150,124],inner:[236,232,224]},breath:0.3},
  builderB:{name:"Builder in a fleece vest",key:"fu_bB",skin:[226,184,152],hair:{style:"side",c:[128,96,66]},beard:[120,90,64],top:{kind:"shirt",c:[184,170,150],vest:[98,104,108],paint:(c,P)=>{fu_checks(c,P);fu_vest(c,P);}},breath:0.26},
  navA:{name:"Navigator in a shirt and tie",key:"fu_nA",skin:[196,150,116],hair:{style:"cropped",c:[42,34,30]},glasses:[60,56,52],top:{kind:"shirt",c:[230,230,224],tie:[118,70,64],paint:fu_tie},breath:0.27},
  navB:{name:"Navigator in a polo shirt",key:"fu_nB",skin:[130,88,64],hair:{style:"bun",c:[30,24,22]},earrings:[220,206,176],top:{kind:"sweater",c:[176,146,140],paint:fu_polo},breath:0.31}
};

/* ---------------------------------------------------------------- 1999's desks: a beige monitor, a desk phone, ring binders, printed plots */
// a beige monitor standing on a desk, its foot's middle at (x, y), w wide; o.draw(ctx, x, y, w, h) draws its glass; o.on lights it; o.a
function fu_crt(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*0.82,bx=x-w/2,by=y-h-26,d=w*0.22,sw=w*0.78,sh=sw*0.74,sx=x-sw/2-4,sy=by+(h-sh)*0.38;
  ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+AG.sdx*2,y+2,w*0.55,12,0.24);
  // the deep back, seen past the right edge, and the foot
  ctx.fillStyle=rgba(ag_dk(FU.beige,0.2),1);ctx.beginPath();ctx.moveTo(bx+w,by+8);ctx.lineTo(bx+w+d,by+h*0.2);ctx.lineTo(bx+w+d,by+h*0.82);ctx.lineTo(bx+w,by+h-4);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(ag_dk(FU.beige,0.12),1);rr(ctx,x-w*0.26,y-30,w*0.52,30,8);ctx.fill();ctx.fillStyle=rgba(FU.beige,1);rr(ctx,x-w*0.18,by+h-6,w*0.36,14,4);ctx.fill();
  ag_soft(ctx,cc=>ag_rect(cc,bx,by,w,h,14),FU.beige,[255,252,244],bx+w*0.75,by+h*0.2,w*0.9,"rgba(80,70,50,0.3)",14);
  // the glass: a dark rim, the screen bulging a little, a soft sheen
  ctx.fillStyle="#3B3D40";rr(ctx,sx-8,sy-8,sw+16,sh+16,16);ctx.fill();
  ctx.save();rr(ctx,sx,sy,sw,sh,14);ctx.clip();const on=o.on==null?1:o.on;ctx.fillStyle=rgba(mix([60,66,64],FU.phosphor,on),1);ctx.fillRect(sx,sy,sw,sh);
  if(o.draw&&on>0)withA(ctx,on,()=>o.draw(ctx,sx,sy,sw,sh));
  let g=ctx.createRadialGradient(sx+sw*0.3,sy+sh*0.25,4,sx+sw*0.5,sy+sh*0.5,sw*0.8);g.addColorStop(0,"rgba(255,255,255,0.22)");g.addColorStop(1,"rgba(0,0,0,0.12)");ctx.fillStyle=g;ctx.fillRect(sx,sy,sw,sh);ctx.restore();
  // a power light and two small knobs under the glass
  ctx.fillStyle=rgba(ag_dk(FU.beige,0.25),1);for(const k of [0.62,0.7]){ctx.beginPath();ctx.arc(bx+w*k,by+h-18,4,0,TAU);ctx.fill();}
  ctx.fillStyle=o.on===0?"#7d8a80":"#8fd0a0";ctx.beginPath();ctx.arc(bx+w*0.84,by+h-18,4,0,TAU);ctx.fill();
  ctx.restore();return{x:sx,y:sy,w:sw,h:sh};}
// a desk phone of its time, its middle at (x, y), s its size
function fu_phone(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ag_floorShadow(ctx,-4,10,74,12,0.22);
  ag_soft(ctx,cc=>{cc.moveTo(-58,8);cc.lineTo(-44,-26);cc.lineTo(44,-26);cc.lineTo(58,8);cc.closePath();},FU.beige,[255,252,244],20,-20,80,"rgba(80,70,50,0.3)",8);
  // the handset, lifted a little when it rings (o.ring)
  const r=o.ring||0;ctx.save();ctx.translate(0,-30-6*r);ctx.rotate(Math.sin(r*40)*0.04*r);ag_soft(ctx,cc=>{cc.moveTo(-60,-6);cc.quadraticCurveTo(-62,-18,-48,-18);cc.lineTo(48,-18);cc.quadraticCurveTo(62,-18,60,-6);cc.lineTo(46,4);cc.lineTo(-46,4);cc.closePath();},
    ag_dk(FU.beige,0.06),[255,252,244],20,-14,70,"rgba(80,70,50,0.3)",6);ctx.restore();
  ctx.fillStyle=rgba(ag_dk(FU.beige,0.3),0.8);for(let i=0;i<3;i++)for(let j=0;j<3;j++){ctx.beginPath();ctx.arc(-14+j*14,-14+i*7,2.6,0,TAU);ctx.fill();}ctx.restore();}
// ring binders standing on a desk, from (x, y) at their foot, n of them
function fu_binders(ctx,x,y,n,s,cols){s=s||1;cols=cols||[[120,112,104],[164,150,128],[96,100,106],[150,128,118]];for(let i=0;i<n;i++){const bx=x+i*30*s,c=cols[i%cols.length],h=(150+(i%2)*8)*s;
  ag_soft(ctx,cc=>ag_rect(cc,bx,y-h,28*s,h,4*s),c,ag_lt(c,0.3),bx+20*s,y-h+20*s,60*s,rgba(ag_dk(c,0.7),0.35),6);
  ctx.fillStyle=rgba(ag_lt(c,0.55),0.9);ctx.fillRect(bx+5*s,y-h+26*s,18*s,30*s);ctx.fillStyle=rgba(ag_dk(c,0.4),0.8);ctx.beginPath();ctx.arc(bx+14*s,y-26*s,5*s,0,TAU);ctx.fill();}}
// a sheet of paper lying on a desk, seen a little from above: corners [x, y] of its four edges, and what it shows (o.draw, in its own flat frame w by h)
function fu_sheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.2)";ctx.shadowBlur=12;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(FU.paper,1);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  if(o.draw)o.draw(ctx,-w/2,-h/2,w,h);ctx.restore();}
// a printed plot: axes and a curve, as navigators print them
function fu_plotDraw(ctx,x,y,w,h,p,col){ctx.strokeStyle="rgba(60,62,68,0.45)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+w*0.1,y+h*0.12);ctx.lineTo(x+w*0.1,y+h*0.86);ctx.lineTo(x+w*0.92,y+h*0.86);ctx.stroke();
  ctx.strokeStyle="rgba(60,62,68,0.14)";for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(x+w*0.1,y+h*(0.86-i*0.15));ctx.lineTo(x+w*0.92,y+h*(0.86-i*0.15));ctx.stroke();}
  if(p>0){ctx.strokeStyle=col||"rgba(58,60,66,0.85)";ctx.lineWidth=2.4;ctx.beginPath();for(let k=0;k<=40*p;k++){const u=k/40,xx=x+w*(0.1+0.82*u),yy=y+h*(0.8-0.55*Math.sin(u*2.6)*u);k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();}}

/* ---------------------------------------------------------------- the file of numbers handed over, "Small forces": a column of numbers, and a
   tag at its top where the unit goes, blank until Odyssey's team writes both units in it (o.unit 0 to 1); o.rows 0 to 1 fills the column */
const FU_FORCES=["0.0158","0.0161","0.0154","0.0163","0.0159"];
function fu_fileCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=300,h=330;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);if(o.k!=null)ag_about(ctx,w/2,h/2,lerp(0.6,1,o.k));
  ag_box(ctx,0,0,w,h,16,{});ag_T(ctx,"Small forces",26,52,{w:700,size:32});
  // the unit's tag: dashed and empty, then the two units
  const u=o.unit||0,tw2=ag_tw(ctx,"N·s · lbf·s",{w:700,size:28})+40,tx=w-26-tw2,ty=82;ctx.save();ctx.setLineDash(u>0.5?[]:[7,6]);ctx.strokeStyle=u>0.5?rgba(AG.blue,0.9):"rgba(86,92,100,0.55)";ctx.lineWidth=2.2;rr(ctx,tx,ty,tw2,46,10);ctx.stroke();ctx.restore();
  if(u>0)withA(ctx,ag_in(u,0.5,0.5),()=>ag_T(ctx,"N·s · lbf·s",tx+20,ty+33,{w:700,size:28,col:AG.blue}));
  else ag_T(ctx,"unit?",tx+tw2/2,ty+33,{w:500,size:28,col:AG.mut,align:"center",a:0.6*(o.ask||0)});
  const n=FU_FORCES.length,r=o.rows==null?1:o.rows;for(let i=0;i<n;i++){const v=clamp(r*n-i,0,1);if(v<=0)break;ag_T(ctx,FU_FORCES[i],w/2,170+i*38,{w:500,size:28,f:"mono",align:"center",a:v});}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a thought bubble: a card with three small rounds trailing down to (px, py);
   o.k springs it in, o.edge a colour, o.blank shows only a turned-away tag (the meaning unseen); returns its box */
function fu_bubble(ctx,cx,cy,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||32,w=o.w||(ag_tw(ctx,text,{w:700,size})+64),h=size+44,x=cx-w/2,y=cy-h/2;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,o.px==null?cx:o.px,o.py==null?cy:o.py,lerp(0.4,1,o.k));
  if(o.px!=null){const n=3;for(let i=0;i<n;i++){const u=(i+1)/(n+1),bx=lerp(cx,o.px,0.35+u*0.65),by=lerp(cy+h/2,o.py,0.35+u*0.65),r=lerp(13,6,u);
    ag_card(ctx,c=>c.arc(bx,by,r,0,TAU),{x:bx-r,y:by-r,w:2*r,h:2*r},{edge:o.edge,edgeA:0.5});}}
  ag_box(ctx,x,y,w,h,h/2,{edge:o.edge,edgeA:o.edge?0.85:null});
  if(o.blank){ctx.save();ctx.translate(cx,cy);ctx.scale(o.turn==null?0.12:o.turn,1);ctx.fillStyle="rgba(86,92,100,0.28)";rr(ctx,-w*0.32,-14,w*0.64,28,10);ctx.fill();ctx.restore();}
  else if(o.draw)o.draw(ctx,cx,cy);
  else ag_T(ctx,text,cx,cy+size*0.36,{w:700,size,align:"center",col:o.col||AG.ink});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- an envelope, its question mark amber: a doubt sent by email, never answered */
function fu_envelope(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(s,s);
  ag_box(ctx,-60,-38,120,76,6,{});ctx.strokeStyle="rgba(86,92,100,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-58,-34);ctx.lineTo(0,6);ctx.lineTo(58,-34);ctx.stroke();
  ctx.fillStyle=rgba(AG.amber,1);ctx.beginPath();ctx.arc(40,22,15,0,TAU);ctx.fill();ag_T(ctx,"?",40,32,{w:800,size:28,align:"center",col:[255,255,255],deco:1});
  if(o.label)ag_T(ctx,o.label,0,-52,{w:700,size:28,align:"center",col:AG.mut,deco:o.deco?1:0});ctx.restore();}

/* ---------------------------------------------------------------- the drawing in graphite on the wall: Earth, Mars, and the paths between,
   as navigators draw them; o.p draws each part on (0 to 1) */
const FU_SPACE={earth:[700,204,50],mars:[1240,190,42],
  path:[700,204,830,30,1060,24,1154,190],          // the way to Mars, as planned: it meets the planned orbit at its near end
  real:[700,204,834,38,1080,48,1182,190],          // the way it went: a little lower each push, into the lower orbit
  plan:[86,30],low:[58,20],tilt:-0.16};            // the orbits round Mars, planned and real, as ellipses (radii), tilted a little
// a point on an orbit round Mars at angle th (0 at the near end, on the left, going over the far side as th grows): [x, y, behind]
function fu_orbitAt(o,th){const M=FU_SPACE.mars,c=Math.cos(FU_SPACE.tilt),s=Math.sin(FU_SPACE.tilt),ex=-o[0]*Math.cos(th),ey=-o[1]*Math.sin(th);
  return[M[0]+ex*c-ey*s,M[1]+ex*s+ey*c,Math.sin(th)>0];}
// an orbit round Mars, its back half drawn first (behind the planet) or its front half (in front): which "back" or "front"
function fu_orbit(ctx,o,which,a,col,dash){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=2.6;ctx.lineCap="round";if(dash)ctx.setLineDash(dash);
  ctx.beginPath();const k0=which==="back"?0:Math.PI,k1=k0+Math.PI;for(let i=0;i<=48;i++){const q=fu_orbitAt(o,lerp(k0,k1,i/48));i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();ctx.restore();}
// where each desk, person, monitor and sign stands in 1999: the builders' desk on the left, the navigators' on the right
const FU99={deskL:[10,842,580],deskR:[1330,842,580],crtL:[488,800,184],crtR:[1432,800,184],
  bA:[330,566,0.64],bB:[148,548,0.6],nA:[1590,566,0.64],nB:[1772,548,0.6],pillL:[360,262],pillR:[1530,262],bubL:[360,356],bubR:[1530,356]};
// a blue card: one of Odyssey's changes, and later Jun's team's; o.k springs it in, o.size
function fu_blueCard(ctx,cx,cy,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||30,w=ag_tw(ctx,text,{w:700,size})+64,h=size+34;if(a<=0)return{x:cx-w/2,y:cy-h/2,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,cx,cy,lerp(0.5,1,o.k));ag_box(ctx,cx-w/2,cy-h/2,w,h,14,{edge:o.col||AG.blue,edgeA:0.85});
  ag_T(ctx,text,cx,cy+size*0.36,{w:700,size,align:"center",col:o.textCol||AG.ink});ctx.restore();return{x:cx-w/2,y:cy-h/2,w,h};}
// a pencil circle drawn on from the top, with a second, fainter pass a hair off, and a soft fill of its colour hatched in graphite
function fu_pencilDisc(ctx,x,y,r,p,col,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a;ctx.save();ctx.globalAlpha*=a;
  const f=ag_in(p,0.55,0.45);if(f>0){ctx.save();ctx.globalAlpha*=f;const g=ctx.createRadialGradient(x+r*0.35,y-r*0.35,r*0.1,x,y,r);g.addColorStop(0,rgba(ag_lt(col,0.35),0.95));g.addColorStop(1,rgba(col,0.95));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    // graphite hatching on the side away from the window
    ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.strokeStyle="rgba(58,60,66,0.22)";ctx.lineWidth=1.6;for(let k=-r*2;k<r*2;k+=7){ctx.beginPath();ctx.moveTo(x+k-r,y+r);ctx.lineTo(x+k+r*0.2,y-r*1.2);ctx.stroke();}
    const sh=ctx.createRadialGradient(x+r*0.5,y-r*0.5,r*0.5,x+r*0.2,y-r*0.2,r*1.6);sh.addColorStop(0,"rgba(255,255,255,0.35)");sh.addColorStop(1,"rgba(255,255,255,0)");ctx.globalCompositeOperation="destination-out";
    ctx.fillStyle=sh;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();
    if(o.swirl){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.strokeStyle="rgba(250,236,220,"+(0.55*o.swirl)+")";ctx.lineWidth=3;ctx.lineCap="round";
      for(let i=0;i<4;i++){const yy=y-r*0.5+i*r*0.32,ph=(o.t||0)*0.25+i*1.7;ctx.beginPath();for(let k=0;k<=20;k++){const u=k/20,xx=x-r+u*2*r;ctx.lineTo(xx+Math.sin(ph)*8,yy+Math.sin(u*6+ph*2)*4);}ctx.stroke();}ctx.restore();}
    ctx.restore();}
  ctx.lineCap="round";const a0=-Math.PI/2,u=ag_sine(clamp(p/0.6,0,1));ctx.strokeStyle=rgba(FU.graphite,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r,a0,a0+u*TAU);ctx.stroke();
  ctx.strokeStyle=rgba(FU.graphite,0.3);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x+1.5,y-1,r+2.5,a0+0.3,a0+0.3+u*TAU*0.96);ctx.stroke();ctx.restore();}
// a dotted pencil line along a curve (eight numbers, as ag_bz), from u0 to u1, its dots spaced gap apart; col, lw
function fu_dots(ctx,p,u0,u1,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||u1<=u0)return;const n=Math.max(2,Math.round((u1-u0)*(o.n||90)));ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=o.color||rgba(FU.graphite,0.75);
  for(let k=0;k<=n;k++){const q=ag_bz(p,lerp(u0,u1,k/n));ctx.beginPath();ctx.arc(q[0],q[1],o.r||2.8,0,TAU);ctx.fill();}ctx.restore();}
// a solid pencil line along a curve
function fu_line(ctx,p,u0,u1,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||u1<=u0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=o.color||rgba(FU.graphite,0.85);ctx.lineWidth=o.lw||3;ctx.lineCap="round";
  if(o.dash)ctx.setLineDash(o.dash);ag_bzPath(ctx,p,u0,u1,60);ctx.stroke();ctx.restore();}
// a word in pencil on the wall
function fu_pencil(ctx,s,x,y,o){o=o||{};ag_T(ctx,s,x,y,Object.assign({w:600,size:30,col:FU.graphite},o));}
// Earth, Mars and the path between, each drawn on at its own moment (o.earth, o.mars, o.path, o.labels: 0 to 1)
function fu_space(ctx,o){o=o||{};const S=FU_SPACE,E=S.earth,M=S.mars;
  fu_pencilDisc(ctx,E[0],E[1],E[2],o.earth==null?1:o.earth,FU.earth,{a:o.a});
  fu_pencilDisc(ctx,M[0],M[1],M[2],o.mars==null?1:o.mars,FU.mars,{a:o.a,swirl:o.swirl,t:o.t});
  fu_dots(ctx,S.path,0.05,lerp(0.05,0.95,o.path==null?1:o.path),{a:o.a});
  const la=(o.labels==null?1:o.labels)*(o.a==null?1:o.a);if(la>0){fu_pencil(ctx,"Earth",E[0],E[1]+E[2]+46,{align:"center",a:la});fu_pencil(ctx,"Mars",M[0],M[1]+M[2]+46,{align:"center",a:la});}}

/* ---------------------------------------------------------------- the two orbiters, small matte models, plain shapes, no logo
   fu_orbiter: the Mars Climate Orbiter, a box with its dish and its one solar wing on one side (the reason its thrusters fired so
   often); fu_odyssey: Mars Odyssey, a box with a wing of three panels and a dish on a boom. (x, y) its middle, s its size, ang its
   heading; o.puff 0 to 1 a thruster's puff, o.burn 0 to 1 its engine's glow, o.a */
function fu_craftBody(ctx,s){ag_soft(ctx,cc=>ag_rect(cc,-22,-18,44,36,6),[214,206,186],[255,250,236],8,-14,40,"rgba(70,60,40,0.35)",8);
  ctx.strokeStyle="rgba(120,104,76,0.45)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-22,-2);ctx.lineTo(22,-2);ctx.stroke();}
function fu_panel(ctx,x,y,w,h){ctx.fillStyle="#4E5662";ctx.fillRect(x,y,w,h);ctx.strokeStyle="rgba(200,214,226,0.45)";ctx.lineWidth=1;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+w*i/4,y);ctx.lineTo(x+w*i/4,y+h);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(x,y+h/2);ctx.lineTo(x+w,y+h/2);ctx.stroke();ctx.strokeStyle="rgba(30,34,40,0.6)";ctx.lineWidth=1.4;ctx.strokeRect(x,y,w,h);}
function fu_orbiter(ctx,x,y,s,ang,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(ang||0);ctx.scale(s,s);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=AG.sdx*0.5;ctx.shadowOffsetY=6;
  // the one wing, on a short boom, off one side only
  ctx.strokeStyle="#6B6F76";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-6,18);ctx.lineTo(-6,30);ctx.stroke();fu_panel(ctx,-40,30,70,26);
  fu_craftBody(ctx,s);ctx.restore();
  // its dish, and the engine's nozzle behind
  ctx.fillStyle="#E8E2D4";ctx.beginPath();ctx.ellipse(-8,-24,16,6,0,0,TAU);ctx.fill();ctx.strokeStyle="rgba(100,90,70,0.6)";ctx.lineWidth=1.2;ctx.stroke();
  ctx.fillStyle="#5C5F66";ctx.beginPath();ctx.moveTo(-22,-7);ctx.lineTo(-32,-12);ctx.lineTo(-32,8);ctx.lineTo(-22,3);ctx.closePath();ctx.fill();
  const b=o.burn||0;if(b>0){const g=ctx.createRadialGradient(-40,-2,1,-40,-2,30);g.addColorStop(0,"rgba(255,236,200,"+(0.95*b)+")");g.addColorStop(0.4,"rgba(255,190,120,"+(0.6*b)+")");g.addColorStop(1,"rgba(255,170,100,0)");
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(-48,-2,30*(0.8+0.2*Math.sin((o.t||0)*30)),12,0,0,TAU);ctx.fill();}
  const pf=o.puff||0;if(pf>0&&pf<1){const u=ag_eo(pf),al=(1-pf)*0.8;for(let i=0;i<4;i++){ctx.fillStyle="rgba(250,250,248,"+al+")";ctx.beginPath();ctx.arc(10+i*3,-20-u*(14+i*8),4+u*(4+i*2),0,TAU);ctx.fill();}}
  ctx.restore();}
function fu_odyssey(ctx,x,y,s,ang,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(ang||0);ctx.scale(s,s);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=AG.sdx*0.5;ctx.shadowOffsetY=6;
  ctx.strokeStyle="#6B6F76";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(34,0);ctx.stroke();fu_panel(ctx,34,-22,30,44);fu_panel(ctx,64,-22,30,44);fu_panel(ctx,94,-22,30,44);
  ctx.beginPath();ctx.moveTo(-10,-18);ctx.lineTo(-30,-44);ctx.stroke();
  ag_soft(ctx,cc=>ag_rect(cc,-22,-18,44,36,6),[206,200,188],[255,250,236],8,-14,40,"rgba(70,60,40,0.35)",8);ctx.restore();
  ctx.fillStyle="#E8E2D4";ctx.beginPath();ctx.ellipse(-32,-48,14,6,-0.6,0,TAU);ctx.fill();ctx.strokeStyle="rgba(100,90,70,0.6)";ctx.lineWidth=1.2;ctx.stroke();
  ctx.restore();}

/* ===== It feels like understanding: today's things =====
   Jun's desk in the data team's room and the agent on the wall beside it, as the series draws it (the sphere in its oak ring, the
   hands, the three read-only tools, the answer with its evidence: ag_evidence); Anil's desk in the Faculty of Health; the advisers
   and their lists; students as plain shapes; the zip and its scale of seven; the gauges; the calendar; the evidence folder; the
   team's log; the faculty's own list; the table the agent read. */

/* ---------------------------------------------------------------- Jun's desk: the desk first, Jun behind it (cut at its back edge),
   then his screen, its lines decoration only (what's on it is never read there). FU_JUN: where he
   sits, his size, the desk, the screen. o.folder: the evidence folder on the desk's front corner ({dust, open}). His arms stay down,
   out of sight behind the desk: no gestures */
const FU_JUN={x:300,neck:582,s:0.66,desk:[20,850,900],screen:[452,652,240,136]};
function fu_junDesk(ctx,t,o){o=o||{};const J=FU_JUN,[dx,dy,dw]=J.desk;
  ag_desk(ctx,dx,dy,dw,{});
  const ln=o.lean||0;ag_person(ctx,"jun",J.x-ln*16,J.neck+ln*7,J.s,{t,cut:dy-70,gaze:o.gaze||[3,0],nod:(o.nod||0)-ln*0.05,smile:o.smile,talk:o.talk});
  const [sx,sy,sw,sh]=J.screen;ag_screen(ctx,sx,sy,sw,sh,{stand:22,draw:o.screen||((c,x,y,w,h)=>fu_screenLines(c,x,y,w,h,0))});
  if(o.folder)fu_folder(ctx,dx+dw-216,dy-66,Object.assign({w:200,h:56},o.folder));}

/* ---------------------------------------------------------------- the agent, on the wall to Jun's right: its loop, its hands and its three
   read-only tools (A model, reasoning, hands and a loop draws them so). o: core, think, lit, col, pulse (a degree on the ring, or null),
   reach [u, u, u] (each hand out to its tool, 0 to 1), data [d, d, d] (data coming back), touch [k, k, k], a, toolsA, frost (0 to 1: the
   agent behind frosted glass, its ring a blur) */
const FU_AG={x:1150,y:400,R:160,r:76,tools:[["Catalog",1530,190],["Query",1530,350],["Docs",1530,510]],tw:300,th:126};
function fu_reachCurve(i){const A=FU_AG,T=A.tools[i],x0=A.x+A.R*0.96,y0=A.y+(i-1)*36,x1=T[1]-6,y1=T[2]+A.th/2;return[x0,y0,x0+110,y0+(i-1)*10,x1-120,y1,x1,y1];}
function fu_agentDraw(ctx,t,o){const A=FU_AG,ta=o.toolsA==null?1:o.toolsA;
  if(!o.noTools)for(let i=0;i<3;i++){const T=A.tools[i];ag_tool(ctx,T[1],T[2],A.tw,A.th,T[0],{touch:(o.touch||[])[i]||0,a:ta});}if(o.onlyTools)return;
  for(let i=0;i<3;i++){const u=(o.reach||[])[i]||0;if(u>0)ag_reach(ctx,fu_reachCurve(i),u,{data:(o.data||[])[i]||0,k:0.9});}
  ag_loop(ctx,A.x,A.y,{R:A.R,r:A.r,label:null,core:o.core==null?0.6:o.core,think:o.think||0,lit:o.lit,col:o.col,t,pulse:o.pulse==null?null:{deg:o.pulse,a:o.pulseA==null?1:o.pulseA},floor:null});}
function fu_agent(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const fr=o.frost||0;
  if(fr<=0){withA(ctx,a,()=>fu_agentDraw(ctx,t,o));return;}
  // behind frosted glass: the agent drawn into a layer, blurred as glass blurs what's behind it, and the pane over it
  withA(ctx,a,()=>fu_agentDraw(ctx,t,Object.assign({},o,{onlyTools:true})));
  const m=ctx.getTransform(),[bc,bx]=ag_buf("fuFrost",ctx.canvas.width,ctx.canvas.height);bx.setTransform(m);fu_agentDraw(bx,t,Object.assign({},o,{noTools:true}));
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.filter="blur("+(Math.max(0.1,fr*14*Math.hypot(m.a,m.b))).toFixed(1)+"px)";ctx.drawImage(bc,0,0);ctx.restore();
  const gx=FU_AG.x-FU_AG.R-100+(1-ag_sine(fr))*360,gy=FU_AG.y-FU_AG.R-64,gw=FU_AG.R*2+200,gh=FU_AG.R*2+124;
  ctx.save();ctx.globalAlpha*=a*fr;ctx.fillStyle="rgba(244,246,248,0.42)";rr(ctx,gx,gy,gw,gh,18);ctx.fill();
  ctx.save();rr(ctx,gx,gy,gw,gh,18);ctx.clip();ctx.fillStyle="rgba(255,255,255,0.3)";for(const [u,s] of [[0.2,0.1],[0.42,0.04]]){ctx.beginPath();ctx.moveTo(gx+gw*u,gy);ctx.lineTo(gx+gw*(u+s),gy);ctx.lineTo(gx+gw*(u+s)-gh*0.4,gy+gh);ctx.lineTo(gx+gw*u-gh*0.4,gy+gh);ctx.closePath();ctx.fill();}ctx.restore();
  ctx.strokeStyle="rgba(150,160,170,0.7)";ctx.lineWidth=2;rr(ctx,gx,gy,gw,gh,18);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the answer, with its evidence attached (the series' ag_evidence): what its
   hands did, as three cards. o.open fans them out; o.amber washes the two that say "full-time equivalents" amber; o.v the version
   ("fte": 2,160 students, as the agent first answered; "people": 2,880 people, this term) */
const FU_EV={fte:[{kick:"1 · Catalog",title:"Student load: “students” (full-time equivalents)",col:AG.blue},
                  {kick:"2 · Query",title:"Add up “students”, Faculty of Health, this term: 2,160",col:AG.orange},
                  {kick:"3 · Check",title:"The total matches the table ✓",col:AG.green}],
  people:[{kick:"1 · Catalog",title:"Census day: “students” (people, each counted once)",col:AG.blue},{kick:"2 · Query",title:"Count people, Faculty of Health, this term: 2,880",col:AG.orange},
          {kick:"3 · Check",title:"The faculty's own list: 2,880 ✓",col:AG.green}]};
function fu_answer(ctx,x,y,o){o=o||{};const v=o.v||"fte",w=o.w||440,words=v==="fte"?{kick:"Answer",title:"2,160 students",sub:"63 more than last year"}:{kick:"Answer",title:"2,880 people",sub:"Faculty of Health, this term"};
  let items=FU_EV[v];if(o.amber)items=items.map((it,i)=>i<2?Object.assign({},it,{col:mix(it.col,AG.amber,o.amber)}):it);
  return ag_evidence(ctx,x,y,w,words,items,{open:o.open||0,side:o.side||"below",ew:o.ew||330,a:o.a,k:o.k,edge:o.edge,edgeA:o.edgeA});}
// the check's verdict, as a pill: "Matches the source"
function fu_check(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;ag_pill(ctx,x,y,o.text||"Matches the source",{icon:"tick",col:o.col||AG.green,a});}
// a soft glow behind a card: the feeling an answer gives
// an ellipse round the card, fading to nothing 150 px past its edges on every side, so no edge of the glow shows
function fu_glow(ctx,b,a,col){if(a<=0.01)return;col=col||[248,210,140];ctx.save();ctx.globalAlpha*=a;
  const rx=b.w/2+150,ry=b.h/2+150,g=ctx.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,rgba(col,0.55));g.addColorStop(b.w/2/rx,rgba(col,0.4));g.addColorStop(1,rgba(col,0));
  ctx.save();ctx.translate(b.x+b.w/2,b.y+b.h/2);ctx.scale(1,ry/rx);ctx.fillStyle=g;ctx.fillRect(-rx,-rx,2*rx,2*rx);ctx.restore();
  ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=50;ctx.fillStyle=rgba(col,0.6);rr(ctx,b.x+6,b.y+6,b.w-12,b.h-12,22);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- Anil's desk in the Faculty of Health: he faces left, his screen in front of
   him with "Advisers next term" and the number he types in (o.typed, o.value); the advisers' row along the wall is fu_advisers */
const FU_ANIL={x:1530,neck:566,s:0.68,desk:[1180,842,700],screen:[1200,600,300,170]};
function fu_anilDesk(ctx,t,o){o=o||{};const A=FU_ANIL,[dx,dy,dw]=A.desk;ag_desk(ctx,dx,dy,dw,{});
  ag_person(ctx,"anil",A.x,A.neck,A.s,{t,flip:true,cut:dy-70,gaze:o.gaze||[3,0],nod:o.nod,smile:o.smile,talk:o.talk});
  const [sx,sy,sw,sh]=A.screen;ag_screen(ctx,sx,sy,sw,sh,{stand:22,draw:(c,x,y,w,h)=>{if(o.screen)return o.screen(c,x,y,w,h);fu_advisersScreen(c,x,y,w,h,o);}});
  fu_binders(ctx,dx+dw-150,dy-34,3,0.8,[[124,84,98],[170,160,140],[110,112,116]]);}
function fu_advisersScreen(c,x,y,w,h,o){c.fillStyle="rgba(46,52,60,0.06)";c.fillRect(x,y,w,40);
  ag_T(c,"Advisers next term",x+18,y+30,{w:700,size:28,col:AG.mut,a:0.9});
  const v=o.value||"",typed=o.typed==null?1:o.typed,s=v.slice(0,Math.round(v.length*typed));ag_T(c,s,x+18,y+112,{w:700,size:56});
  const cx=x+22+ag_tw(c,s,{w:700,size:56});if(o.caret&&((o.t||0)*1.6%1<0.6)){c.fillStyle=rgba(AG.ink,0.8);c.fillRect(cx,y+66,4,56);}
  if(o.unit)ag_T(c,o.unit,x+18,y+152,{w:600,size:28,col:AG.mut,a:o.unitA==null?1:o.unitA});}
// Anil's request, and Jun's reply, as speech cards with tails
function fu_say(ctx,x,y,w,text,o){o=o||{};return ag_textCard(ctx,x,y,w,{title:o.title?text:null,sub:o.title?null:text},{tail:o.tail,edge:o.edge,a:o.a,k:o.k});}

/* ---------------------------------------------------------------- the advisers: a card each, a plain figure (never a face), a phone and the
   list of the students they call; "240" under it. o.ring 0 to 1 rings its phone; o.list: {n: names, done: ticked, amber: left without a
   call, p: how far the ticks have run}; o.dashed: a place for an adviser the faculty needed and didn't plan */
const FU_ADV={w:100,h:258};
function fu_figure(c,x,y,s,col,half){const sh=cc=>{cc.arc(x,y-30*s,17*s,0,TAU);cc.moveTo(x-34*s,y+34*s);cc.bezierCurveTo(x-34*s,y-2*s,x-16*s,y-8*s,x,y-8*s);cc.bezierCurveTo(x+16*s,y-8*s,x+34*s,y-2*s,x+34*s,y+34*s);cc.closePath();};
  c.save();if(half){c.beginPath();c.rect(x-40*s,y-60*s,40*s,100*s);c.clip();}ag_soft(c,sh,col,ag_lt(col,0.35),x+10*s,y-34*s,40*s,null);c.restore();}
function fu_adviser(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=FU_ADV.w,h=FU_ADV.h;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  if(o.dashed){ctx.save();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(AG.amber,0.85);ctx.lineWidth=2.6;rr(ctx,x,y,w,h,14);ctx.stroke();ctx.restore();
    fu_figure(ctx,x+w/2,y+70,1,mix(AG.amber,[240,236,228],0.7));ctx.restore();return;}
  ag_box(ctx,x,y,w,h,14,{});fu_figure(ctx,x+w/2,y+70,1,[150,142,134]);
  // the phone, a handset, rocking a little when it rings
  const r=o.ring||0;fu_handset(ctx,x+w-30,y+32,1,Math.sin(r*34)*0.16*Math.sin(Math.PI*clamp(r,0,1)));
  if(r>0){ctx.strokeStyle=rgba(AG.ink,0.45*Math.sin(Math.PI*clamp(r,0,1)));ctx.lineWidth=2.4;ctx.lineCap="round";for(const k of [1,2]){ctx.beginPath();ctx.arc(x+w-30,y+32,16+k*8,-1.25,-0.25);ctx.stroke();}}
  // the list: a line for each name, a tick for each call made, amber for those never called
  const L=o.list||{n:6,done:6},lh=16.5,ly=y+118;for(let i=0;i<L.n;i++){const yy=ly+i*lh,am=L.amber&&i>=L.n-L.amber,dn=i<L.done*(L.p==null?1:L.p);
    ctx.fillStyle=am?rgba(AG.amber,0.8):rgba(AG.mut,0.32);rr(ctx,x+16,yy,w-56,7,3.5);ctx.fill();
    if(dn&&!am)ag_tick(ctx,x+w-26,yy+3,13,rgba(AG.green,0.95),2.6);}
  if(o.label!==null)ag_T(ctx,o.label||"240",x+w/2,y+h+40,{w:700,size:30,align:"center",col:AG.mut});
  ctx.restore();}
// a phone's handset, its middle at (x, y), s its size, tipped by rot
function fu_handset(ctx,x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(-0.6+(rot||0));ctx.scale(s,s);const col=[92,96,104];
  ag_soft(ctx,cc=>{cc.moveTo(-17,-6);cc.quadraticCurveTo(0,-15,17,-6);cc.lineTo(17,-1);cc.quadraticCurveTo(0,-9,-17,-1);cc.closePath();ag_rect(cc,-24,-8,12,18,5);ag_rect(cc,12,-8,12,18,5);},
    col,ag_lt(col,0.45),6,-10,30,null);ctx.restore();}
// a row of n advisers from (x, y), gap apart; each gets o(i) for its own options
function fu_advisers(ctx,x,y,n,gap,each){for(let i=0;i<n;i++)fu_adviser(ctx,x+i*(FU_ADV.w+gap),y,each?each(i):{});}

/* ---------------------------------------------------------------- students as plain shapes, head and shoulders in one wash, never a face or a
   name: whole for full-time, half for half-time; fu_students draws a block of them, cols x rows, and closes each pair of halves into one
   (o.close 0 to 1: the right half slides over to meet the left) */
const FU_STU=[150,140,132];
function fu_student(ctx,x,y,s,half,a){if(a<=0.01)return;withA(ctx,a,()=>fu_figure(ctx,x,y,s,FU_STU,half));}
function fu_students(ctx,x,y,cols,rows,o){o=o||{};const s=o.s||0.62,dx=o.dx||52,dy=o.dy||64,a=o.a==null?1:o.a,p=o.p==null?1:o.p,cl=o.close||0;if(a<=0)return;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const k=j*cols+i,ap=clamp(p*cols*rows-k,0,1)*a;if(ap<=0)continue;const cx=x+i*dx,cy=y+j*dy;
    if(!o.half){fu_student(ctx,cx,cy,s,false,ap);continue;}
    // half-time: each pair (columns 0-1, 2-3, ...) closes into one whole shape between them
    const pr=i%2,mid=x+(i-pr)*dx+dx/2,u=ag_sine(cl);
    if(pr===0){ctx.save();ctx.translate(lerp(cx,mid,u),cy);ctx.translate(-cx,-cy);fu_student(ctx,cx,cy,s,true,ap);ctx.restore();}
    else{ctx.save();ctx.translate(lerp(cx,mid,u),cy);ctx.scale(-1,1);ctx.translate(-cx,-cy);fu_student(ctx,cx,cy,s,true,ap);ctx.restore();}}}

/* ---------------------------------------------------------------- the table the agent read: "Student load", reported to the government, its
   column "students", and, small under it, what the column counts (o.note 0 to 1) */
function fu_table(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,18,{edge:o.edge,edgeA:o.edgeA});
  ag_T(ctx,"Student load",x+30,y+54,{w:700,size:36});ag_T(ctx,"reported to the government",x+30,y+94,{w:500,size:28,col:AG.mut});
  ctx.fillStyle="rgba(60,50,40,0.12)";ctx.fillRect(x+24,y+118,w-48,1.5);
  const cx=x+(o.colX||w*0.5);ctx.fillStyle=rgba(AG.blue,0.07+0.08*(o.colLit||0));rr(ctx,cx-120,y+128,240,h-148,12);ctx.fill();
  ag_T(ctx,"students",cx,y+168,{w:700,size:32,align:"center",col:AG.blue});
  if(o.note)ag_T(ctx,"full-time equivalents",cx,y+206,{w:600,size:28,align:"center",col:o.noteCol||AG.mut,a:o.note});
  if(o.alt)ag_T(ctx,o.alt,cx,y+206,{w:600,size:28,align:"center",col:AG.blue,a:o.altA==null?1:o.altA});
  ctx.restore();}

/* ---------------------------------------------------------------- the zip, drawn large: two tapes of teeth meeting under a slider at sl (0 at
   the top, 1 at the bottom of its run); open 0 to 1 parts the teeth above the slider */
function fu_zip(ctx,x0,x1,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const sl=lerp(x0+120,x1-120,o.sl==null?0.12:o.sl),op=o.open||0,tw=74;
  // the tapes: matte fabric, oak-pale, with a soft shadow
  for(const s of [-1,1]){const yy=y+s*(tw/2+6);ctx.save();ctx.translate(0,0);
    ag_soft(ctx,cc=>{cc.moveTo(x0,yy-tw/2);cc.lineTo(x1,yy-tw/2);cc.lineTo(x1,yy+tw/2);cc.lineTo(x0,yy+tw/2);cc.closePath();},[206,198,186],[240,236,226],x1-200,yy-20,600,"rgba(60,50,40,0.25)",12);ctx.restore();}
  // the teeth: interlocked to the right of the slider, parting to its left as it opens
  for(let x=x0+16;x<x1-10;x+=18){const left=x<sl,gap=left?op*Math.min(1,(sl-x)/260)*44:0,up=(Math.round((x-x0)/18)%2)===0;
    const ty=y+(up?-1:1)*(4+gap)-(up?14:-2);ctx.fillStyle="#8D8A84";rr(ctx,x-6,ty-6+(up?0:-4),12,18,3);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(x-4,ty-4+(up?0:-4),8,2);}
  // the slider and its pull
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.3)";ctx.shadowBlur=14;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=8;
  ag_soft(ctx,cc=>{cc.moveTo(sl-56,y-34);cc.lineTo(sl+40,y-24);cc.lineTo(sl+40,y+24);cc.lineTo(sl-56,y+34);cc.closePath();},[160,158,154],[236,234,230],sl,y-20,80,"rgba(40,40,40,0.35)",8);ctx.restore();
  ag_soft(ctx,cc=>{ag_rect(cc,sl-6,y+30,28,92,12);},[150,148,144],[230,228,224],sl+8,y+50,50,"rgba(40,40,40,0.35)",6);
  ctx.restore();}
// a scale of seven, "1" to "7": lit dots filled (n, a whole number or between two), the rest open; o.col, o.a
function fu_scale(ctx,cx,y,lit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const gap=o.gap||104,r=o.r||24,col=o.col||[74,80,92];ctx.save();ctx.globalAlpha*=a;
  if(o.card!==false){const hw=3*gap+r+40;ag_box(ctx,cx-hw,y-r-28,hw*2,r*2+104,22,{});}
  for(let i=0;i<7;i++){const x=cx+(i-3)*gap,f=clamp(lit-i,0,1);ctx.fillStyle="rgba(250,249,246,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=3;ctx.stroke();if(f>0){ctx.fillStyle=rgba(col,0.92);ctx.beginPath();ctx.arc(x,y,r*0.74*ag_eo(f),0,TAU);ctx.fill();}
    ag_T(ctx,String(i+1),x,y+r+42,{w:700,size:30,align:"center",col:AG.mut});}ctx.restore();}

/* ---------------------------------------------------------------- the 2025 study: a gauge, a bar that fills from the bottom; label under it */
function fu_gauge(ctx,x,y,h,v,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=46;
  ag_box(ctx,x-w/2-8,y-8,w+16,h+16,14,{});ctx.fillStyle="rgba(60,50,40,0.08)";rr(ctx,x-w/2,y,w,h,10);ctx.fill();
  const f=clamp(v,0,1);ctx.fillStyle=rgba(o.col||AG.mut,0.85);rr(ctx,x-w/2,y+h*(1-f),w,h*f,10);ctx.fill();
  ag_T(ctx,label,x,y+h+56,{w:700,size:28,align:"center",col:AG.mut});ctx.restore();}

/* ---------------------------------------------------------------- the calendar on the wall: a month a row, a green tick on each month the
   agent was right (o.ticks), the months turning (o.turn) */
const FU_MONTHS=["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"];
function fu_calendar(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||430,n=FU_MONTHS.length,cw=(w-48)/5,h=64+2*92;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,16,{});ctx.fillStyle="rgba(60,50,40,0.07)";ctx.fillRect(x+12,y+12,w-24,30);for(const k of [0.3,0.7]){ctx.fillStyle="#7A7670";ctx.beginPath();ctx.arc(x+w*k,y+8,6,0,TAU);ctx.fill();}
  for(let i=0;i<n;i++){const cx=x+24+(i%5)*cw+cw/2,cy=y+70+Math.floor(i/5)*92,on=clamp((o.ticks||0)-i,0,1);
    ag_T(ctx,FU_MONTHS[i],cx,cy+12,{w:600,size:28,align:"center",col:AG.mut,a:0.5+0.5*clamp((o.turn==null?n:o.turn)-i,0,1)});
    if(on>0){ctx.save();ctx.globalAlpha*=on;ag_tick(ctx,cx,cy+48,26*ag_eo(on),rgba(AG.green,1),4);ctx.restore();}}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the evidence, in a folder with a paperclip, closed on the corner of Jun's
   desk, a fine line of dust along its top edge (o.dust 0 to 1); o.open lifts its cover */
function fu_folder(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||250,h=o.h||64;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2+AG.sdx,y+h+4,w*0.55,10,0.25);
  const col=[214,196,160];ag_soft(ctx,cc=>{cc.moveTo(x,y+12);cc.lineTo(x+w*0.36,y+12);cc.lineTo(x+w*0.4,y);cc.lineTo(x+w*0.62,y);cc.lineTo(x+w*0.66,y+12);cc.lineTo(x+w,y+12);cc.lineTo(x+w,y+h);cc.lineTo(x,y+h);cc.closePath();},col,ag_lt(col,0.4),x+w*0.7,y+10,w*0.6,"rgba(80,60,30,0.3)",8);
  const op=o.open||0;if(op>0){ctx.save();ctx.translate(x,y+h);ctx.transform(1,0,-0.4*op,1-0.9*op,0,0);ag_soft(ctx,cc=>ag_rect(cc,0,-h+12,w,h-12,4),ag_lt(col,0.1),ag_lt(col,0.5),w*0.6,-h,w*0.6,"rgba(80,60,30,0.3)",6);ctx.restore();}
  ag_T(ctx,"Evidence",x+22,y+h-16,{w:700,size:28,col:[110,92,62],a:1-op});
  ag_clip(ctx,x+w-46,y-14,46,"#5E5A55",3.4);
  const d=o.dust||0;if(d>0){const R=ag_rnd(5);ctx.fillStyle=rgba(FU.dust,0.55*d);for(let i=0;i<70;i++){const u=R();ctx.beginPath();ctx.arc(x+6+u*(w-12),y+11+(u>0.36&&u<0.66?-11:0)+R()*3,0.9+R()*1.4,0,TAU);ctx.fill();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the team's log: a row for each doubt, with its owner, until it's answered */
function fu_log(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const h=206;ag_box(ctx,x,y,w,h,18,{});
  ag_T(ctx,"TEAM LOG",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});ctx.fillStyle="rgba(60,50,40,0.12)";ctx.fillRect(x+24,y+74,w-48,1.5);
  const r=o.row||0;if(r>0)withA(ctx,r,()=>{ag_T(ctx,"Advisers' lists look long",x+28,y+120,{w:700,size:32});
    ag_T(ctx,"owner: Jun",x+28,y+174,{w:600,size:28,col:AG.mut});
    const ans=o.answered||0;if(ans>0)ag_pill(ctx,x+w-120,y+164,"answered",{icon:"tick",col:AG.green,a:ans,size:28});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the faculty's own list of students: something the agent didn't make */
function fu_facList(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||330,h=o.h||236;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,18,{});
  ag_T(ctx,"The faculty's own list",x+26,y+50,{w:700,size:30});const nl=o.lines==null?4:o.lines;for(let i=0;i<nl;i++){ctx.fillStyle=rgba(AG.mut,0.3);ctx.fillRect(x+28,y+84+i*24,w*(0.5+0.12*(i%3)),8);}
  ag_T(ctx,"2,880 people",x+26,y+h-30,{w:700,size:36});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a plain blue "=" between two things that agree, by a plain rule */
function fu_equals(ctx,x,y,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(AG.blue,0.95);const w=46*ag_eo(a);rr(ctx,x-w/2,y-16,w,10,5);ctx.fill();rr(ctx,x-w/2,y+6,w,10,5);ctx.fill();ctx.restore();}
// initials in ink, written on (p 0 to 1): a person's decision
function fu_initials(ctx,x,y,p,o){o=o||{};if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(o.col||[36,44,70],0.92);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";
  // "JP", as one quick hand: the J's hook, then the P's stem and bowl
  const pts=[[0,-30],[2,8],[-6,22],[-20,16],null,[22,24],[24,-30],[46,-28],[52,-12],[40,-2],[24,-4]],n=pts.length,k=p*(n-1);ctx.beginPath();let pen=false;
  for(let i=0;i<n;i++){const q=pts[i];if(!q){pen=false;continue;}if(i>k+1)break;const f=clamp(k-i+1,0,1),pr=pts[i-1];const qx=x+q[0]*(o.s||1),qy=y+q[1]*(o.s||1);
    if(!pen||!pr){ctx.moveTo(qx,qy);pen=true;}else{const px=x+pr[0]*(o.s||1),py=y+pr[1]*(o.s||1);ctx.lineTo(lerp(px,qx,f),lerp(py,qy,f));}}ctx.stroke();ctx.restore();}

// a number card: the number, and a tag beside it for what it counts (blank until filled)
function fu_numberCard(ctx,x,y,n,tag,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+170,y+70,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,340,140,18,{});ag_T(ctx,n,x+30,y+92,{w:800,size:56});
  const f=o.fill||0,tx=x+196,ty=y+46;ctx.save();ctx.setLineDash(f>0.5?[]:[7,6]);ctx.strokeStyle=f>0.5?rgba(AG.blue,0.9):"rgba(86,92,100,0.55)";ctx.lineWidth=2.2;rr(ctx,tx,ty,124,48,10);ctx.stroke();ctx.restore();
  if(tag)ag_T(ctx,tag,tx+62,ty+34,{w:700,size:28,align:"center",col:AG.blue,a:ag_in(f,0.5,0.5)});ctx.restore();}
// a screen's lines, as decoration: what's on it isn't read
function fu_screenLines(c,x,y,w,h,seed){const R=ag_rnd(11+seed);for(let i=0;i<5;i++){c.fillStyle="rgba(60,66,76,0.18)";c.fillRect(x+16,y+18+i*24,(w-40)*(0.4+0.5*R()),8);}}

/* ---------------------------------------------------------------- the 2025 study: an answer card of n lines (decoration: what it says
   isn't read), its length its kick ("short", "long"); a bar with its label at the left, filled to v */
function fu_studyCard(ctx,x,y,w,n,kick,o){o=o||{};const a=o.a==null?1:o.a,h=86+(o.shown==null?n:Math.max(1,o.shown))*30;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,20,{});ag_T(ctx,String(kick).toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  const R=ag_rnd(n*7+3),shown=o.shown==null?n:o.shown;for(let i=0;i<n;i++){const u=clamp(shown-i,0,1);if(u<=0)break;ctx.fillStyle=rgba(AG.mut,0.3);rr(ctx,x+28,y+78+i*30,(w-56)*(i===n-1?0.55:0.75+0.25*R())*ag_eo(u),10,5);ctx.fill();}
  ctx.restore();return{x,y,w,h};}
function fu_bar(ctx,x,y,label,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const lw=o.lw||170,bw=o.bw||250,col=o.col||AG.mut;ctx.save();ctx.globalAlpha*=a;
  ag_T(ctx,label,x,y+10,{w:600,size:28,col:AG.mut});ctx.fillStyle="rgba(60,50,40,0.1)";rr(ctx,x+lw,y-12,bw,24,12);ctx.fill();
  ctx.fillStyle=rgba(col,0.88);rr(ctx,x+lw,y-12,Math.max(24,bw*clamp(v,0,1)),24,12);ctx.fill();
  if(o.hi>0){ctx.strokeStyle=rgba(col,0.6*o.hi);ctx.lineWidth=3;rr(ctx,x+lw-6,y-18,bw+12,36,18);ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- the zip's test: a pencil that hovers and doesn't write; three numbered
   blank lines; the everyday things of the 2002 study, small and matte (a lock and its key, a cistern with its lever, piano keys) */
function fu_pencilIcon(ctx,x,y,ang,s){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);ag_floorShadow(ctx,-6,26,90,8,0.16);
  ag_soft(ctx,cc=>{cc.moveTo(0,0);cc.lineTo(26,-9);cc.lineTo(150,-9);cc.lineTo(150,9);cc.lineTo(26,9);cc.closePath();},AG_OAK.base,AG_OAK.hi,90,-6,90,"rgba(80,60,30,0.3)",6);
  ctx.fillStyle="#4A4A4E";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(9,-3.2);ctx.lineTo(9,3.2);ctx.closePath();ctx.fill();
  ctx.fillStyle="#B9B4AC";ctx.fillRect(150,-9,14,18);ctx.fillStyle="#D9C9C2";rr(ctx,163,-9,20,18,6);ctx.fill();ctx.restore();}
function fu_blankLines(ctx,x,y,w,a,o){o=o||{};if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;for(let i=0;i<3;i++){const yy=y+i*96,u=clamp((o.p==null?1:o.p)*3-i,0,1);if(u<=0)break;
  ag_T(ctx,(i+1)+".",x,yy,{w:700,size:36,col:AG.mut,a:u});ctx.strokeStyle=rgba(AG.mut,0.45);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+56,yy+6);ctx.lineTo(x+56+(w-56)*ag_eo(u),yy+6);ctx.stroke();}ctx.restore();}
function fu_lockKey(ctx,x,y,s,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);const m=[150,150,154];ag_floorShadow(ctx,-8,62,70,12,0.2);
  ag_soft(ctx,cc=>{cc.arc(-18,0,44,0,TAU);},m,[236,236,238],-34,-20,60,"rgba(40,40,50,0.35)",10);ctx.fillStyle="#3E3F44";ctx.beginPath();ctx.arc(-18,-8,9,0,TAU);ctx.fill();ctx.fillRect(-22,-4,8,26);
  // the key, lying beside it
  ctx.save();ctx.translate(46,26);ctx.rotate(-0.5);ag_soft(ctx,cc=>{cc.arc(0,0,16,0,TAU);cc.moveTo(14,-5);cc.lineTo(62,-5);cc.lineTo(62,0);cc.lineTo(56,0);cc.lineTo(56,6);cc.lineTo(48,6);cc.lineTo(48,0);cc.lineTo(40,0);cc.lineTo(40,7);cc.lineTo(32,7);cc.lineTo(32,5);cc.lineTo(14,5);cc.closePath();},
    [196,170,110],[246,232,196],-4,-6,40,"rgba(80,60,20,0.3)",6);ctx.fillStyle="rgba(250,248,244,1)";ctx.beginPath();ctx.arc(-3,0,5,0,TAU);ctx.fill();ctx.restore();ctx.restore();}
function fu_cistern(ctx,x,y,s,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ag_floorShadow(ctx,-8,64,76,12,0.2);
  ag_soft(ctx,cc=>ag_rect(cc,-62,-50,124,104,16),[238,236,232],[255,255,255],-20,-30,90,"rgba(60,60,70,0.28)",12);
  ag_soft(ctx,cc=>ag_rect(cc,-70,-62,140,18,9),[226,224,220],[255,255,255],-10,-60,80,"rgba(60,60,70,0.22)",6);
  ctx.fillStyle="#A7A9AE";rr(ctx,-58,-26,30,10,5);ctx.fill();ctx.fillStyle="#8E9095";ctx.beginPath();ctx.arc(-58,-21,8,0,TAU);ctx.fill();ctx.restore();}
function fu_pianoKeys(ctx,x,y,s,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ag_floorShadow(ctx,-6,66,80,12,0.2);
  for(const k of [-1,0,1]){ag_soft(ctx,cc=>ag_rect(cc,k*44-21,-60,42,120,6),[246,244,240],[255,255,255],k*44,-50,50,"rgba(60,60,70,0.25)",6);}
  for(const k of [-0.5,0.5]){ag_soft(ctx,cc=>ag_rect(cc,k*44-13,-60,26,74,4),[48,48,52],[120,120,128],k*44-4,-56,30,null);}ctx.restore();}
// a question card: a pill with a question mark in a circle
function fu_question(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const size=30,w=ag_tw(ctx,text,{w:700,size})+104,h=size+30,bx=x-w/2,by=y-h/2;
  ctx.save();if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,o.k));ag_box(ctx,bx,by,w,h,h/2,{a});withA(ctx,a,()=>{ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(bx+40,y,15,0,TAU);ctx.stroke();
    ag_T(ctx,"?",bx+40,y+10,{w:800,size:28,align:"center",col:AG.mut});ag_T(ctx,text,bx+72,y+size*0.36,{w:700,size});});ctx.restore();}

/* ---------------------------------------------------------------- a chat message: who sent it, in grey capitals, and what it says; o.tick
   adds a green tick after the words (Jun quoting the agent's check) */
function fu_chat(ctx,x,y,w,who,text,o){o=o||{};const a=o.a==null?1:o.a,lines=ag_wrap(ctx,text,w-56-(o.tick?40:0),{w:600,size:30}),h=28+34+lines.length*40+20;if(a<=0.01)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,String(who).toUpperCase(),x+28,y+46,{w:700,size:28,ls:3,col:AG.kick});
  lines.forEach((l,i)=>ag_T(ctx,l,x+28,y+90+i*40,{w:600,size:30}));
  if(o.tick){const l=lines[lines.length-1];ag_tick(ctx,x+28+ag_tw(ctx,l,{w:600,size:30})+26,y+90+(lines.length-1)*40-10,24,rgba(AG.green,1),4);}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the 2010 review: people of today at a desk with an automated aid (a small
   screen with a green tick, its ticks stacking up behind it); tasks that slide onto the desk: a phone and a stack of papers */
const FU_AID_PEOPLE={
  p1:{name:"A person at a desk",key:"fu_p1",skin:[222,182,150],hair:{style:"long",c:[96,64,46]},top:{kind:"sweater",c:[150,162,172]},breath:0.3},
  p2:{name:"An expert at a desk",key:"fu_p2",skin:[124,86,64],hair:{style:"shaved",c:[30,24,22]},glasses:[40,40,46],top:{kind:"overshirt",c:[96,112,100],inner:[226,228,222]},lanyard:true,breath:0.27}
};
function fu_aid(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;const w=150,h=96,n=o.n||0;
  // the ticks it has shown, stacked behind it
  for(let i=0;i<Math.ceil(n);i++){const u=clamp(n-i,0,1),yy=y-18-i*22;ctx.save();ctx.globalAlpha*=u;ag_box(ctx,x+20+(i%2)*6,yy-28,w-40,40,10,{});ag_tick(ctx,x+w/2+(i%2)*6,yy-8,20,rgba(AG.green,0.95),3.4);ctx.restore();}
  ag_screen(ctx,x,y,w,h,{stand:20,draw:(c,sx,sy,sw,sh)=>{ag_tick(c,sx+sw/2,sy+sh/2,52*(o.tick==null?1:o.tick),rgba(AG.green,1),7);}});ctx.restore();}
function fu_mobile(ctx,x,y,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+AG.sdx,y+16,52,7,0.25);ctx.fillStyle="#2E3036";rr(ctx,x-46,y-14,92,28,9);ctx.fill();
  ctx.fillStyle="rgba(150,170,190,0.35)";rr(ctx,x-40,y-10,80,18,6);ctx.fill();ctx.restore();}
function fu_papers(ctx,x,y,n,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+AG.sdx,y+14,84,8,0.22);
  for(let i=0;i<n;i++){const yy=y-i*7,dx=(i%2?4:-3);ctx.fillStyle=i%2?"#F6F4EF":"#FBFAF7";ctx.beginPath();ctx.moveTo(x-78+dx,yy+8);ctx.lineTo(x+70+dx,yy+8);ctx.lineTo(x+60+dx,yy-10);ctx.lineTo(x-66+dx,yy-10);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(60,50,40,0.18)";ctx.lineWidth=1.2;ctx.stroke();}ctx.restore();}
// a tag hanging on a thread: "training"
function fu_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sw=o.sway||0;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);
  ctx.strokeStyle="rgba(90,84,76,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-(o.len||120));ctx.lineTo(0,-6);ctx.stroke();
  const w=ag_tw(ctx,text,{w:700,size:30})+64;ag_box(ctx,-w/2,0,w,58,14,{});ctx.fillStyle="rgba(90,84,76,0.7)";ctx.beginPath();ctx.arc(0,12,4,0,TAU);ctx.fill();
  ag_T(ctx,text,0,42,{w:700,size:30,align:"center"});ctx.restore();}
// a bracket under a row, and its words
function fu_bracket(ctx,x0,x1,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||AG.mut;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=2.5;ctx.lineCap="round";
  const p=ag_eo(o.p==null?1:o.p),m=(x0+x1)/2,hw=(x1-x0)/2*p;ctx.beginPath();ctx.moveTo(m-hw,y-12);ctx.lineTo(m-hw,y);ctx.lineTo(m+hw,y);ctx.lineTo(m+hw,y-12);ctx.stroke();
  ag_T(ctx,text,m,y+44,{w:700,size:30,align:"center",col,a:clamp(p*1.4-0.4,0,1)});ctx.restore();}

/* ---------------------------------------------------------------- one word, two meanings: the counts side by side, the gap between them amber;
   student load drawn large, its students as plain shapes, the half-time pairs closing into one */
function fu_gapBars(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const L=640,bx=x+190;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x-40,y-64,L+400,250,22,{});const p1=ag_eo(o.p1||0),p2=ag_eo(o.p2||0),slate=[74,80,92];
  ag_T(ctx,"2,880",x,y+14,{w:800,size:40,a:clamp((o.p1||0)*3,0,1)});ag_T(ctx,"the lists",x,y+48,{w:500,size:28,col:AG.mut,a:clamp((o.p1||0)*3,0,1)});
  ctx.fillStyle=rgba(slate,0.85);rr(ctx,bx,y-16,Math.max(1,L*p1),32,12);ctx.fill();
  ag_T(ctx,"2,160",x,y+114,{w:800,size:40,a:clamp((o.p2||0)*3,0,1)});ag_T(ctx,"the agent",x,y+148,{w:500,size:28,col:AG.mut,a:clamp((o.p2||0)*3,0,1)});
  ctx.fillStyle=rgba(slate,0.45);rr(ctx,bx,y+84,Math.max(1,L*0.75*p2),32,12);ctx.fill();
  const g=o.gap||0;if(g>0){ctx.save();ctx.globalAlpha*=g;ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=2.6;rr(ctx,bx+L*0.75+4,y+84,L*0.25-4,32,12);ctx.stroke();ctx.restore();
    ag_T(ctx,"720",bx+L+24,y+112,{w:800,size:40,col:AG.amber,a:g});}
  ctx.restore();}
function fu_loadTable(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,"Student load",x+44,y+66,{w:800,size:40});ag_T(ctx,"reported to the government",x+44,y+108,{w:500,size:30,col:AG.mut});
  ctx.fillStyle="rgba(60,50,40,0.12)";ctx.fillRect(x+30,y+136,w-60,1.5);
  const cx=x+w/2,nt=o.note||0;ctx.fillStyle=rgba(AG.blue,0.08);rr(ctx,cx-170,y+150,340,lerp(70,112,nt),14);ctx.fill();
  ag_T(ctx,"students",cx,y+198,{w:700,size:34,align:"center",col:AG.blue});if(nt>0)ag_T(ctx,"full-time equivalents",cx,y+240,{w:600,size:28,align:"center",col:AG.amber,a:nt});
  // the students: full-time on the left, whole; half-time on the right, as halves that close into one
  const sa=o.students||0,gy=y+330;if(sa>0){fu_students(ctx,x+150,gy,8,4,{s:0.62,dx:56,dy:66,a:1,p:sa});fu_students(ctx,x+w-150-7*56,gy,8,4,{s:0.62,dx:56,dy:66,a:1,p:sa,half:true,close:o.close||0});}
  const la=o.labels||0;if(la>0){ag_T(ctx,"1,440 full-time",x+150+3.5*56,gy+300,{w:700,size:32,align:"center",a:la});
    const cl=ag_sine(o.close||0),rx=x+w-150-3.5*56;ag_T(ctx,"1,440 half-time",rx,gy+300,{w:700,size:32,align:"center",a:la*(1-cl)});ag_T(ctx,"720",rx,gy+300,{w:800,size:36,align:"center",a:la*cl});}
  const sm=o.sum||0;if(sm>0)ag_T(ctx,"1,440 + 720 = 2,160",cx,gy+360,{w:800,size:40,align:"center",a:sm});
  ctx.restore();}
// two people of today at a small table, for "they say it back, or ask"
const FU_TALK={
  a:{name:"A person asking",key:"fu_tA",skin:[198,146,112],hair:{style:"coily",c:[44,32,28]},top:{kind:"cardigan",c:[176,124,100],inner:[238,234,226]},breath:0.29},
  b:{name:"A person answering",key:"fu_tB",skin:[236,202,178],hair:{style:"bun",c:[148,108,72]},earrings:[220,206,176],top:{kind:"blazer",c:[72,88,108],inner:[232,236,240]},breath:0.32}
};
// an amber wash over words on an evidence card fanned out to the side (ag_evidence, side "right"): e is the card's place from the
// answer's result, i its number, title its words, phrase the words to wash, ew its width; a 0 to 1
function fu_evHighlight(ctx,e,i,title,phrase,ew,a){if(a<=0.01||!e)return;const lines=ag_wrap(ctx,title,ew-48,{w:600,size:28}).slice(0,3),want=new Set(phrase.split(" "));
  ctx.save();ctx.translate(e.to.x+e.to.w/2,e.to.y+e.to.h/2);ctx.rotate((i%2?1:-1)*0.02);ctx.translate(-e.to.w/2,-e.to.h/2);ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([244,206,140],0.9*a);
  lines.forEach((l,li)=>{const ws=l.split(" ");let j0=-1,j1=-1;ws.forEach((w,j)=>{if(want.has(w)){if(j0<0)j0=j;j1=j;}});if(j0<0)return;
    const pre=ws.slice(0,j0).join(" "),mid=ws.slice(j0,j1+1).join(" "),x0=24+(pre?ag_tw(ctx,pre+" ",{w:600,size:28}):0);rr(ctx,x0-5,62+li*36,ag_tw(ctx,mid,{w:600,size:28})+10,34,6);ctx.fill();});
  ctx.restore();}

/* ---------------------------------------------------------------- knowing, not feeling: the catalog's counts with their units; the agent,
   small, waiting with its question; a sign that two counts differ; the record of what its hands did, small; the answer a person
   decides on, the agent's tick grey beside it */
function fu_unitCard(ctx,x,y,w,name,unit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+52,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,104,18,{});ag_T(ctx,name,x+26,y+44,{w:700,size:30});ag_T(ctx,"students",x+26,y+82,{w:700,size:28,col:AG.blue});
  ag_T(ctx,unit,x+26+ag_tw(ctx,"students ",{w:700,size:28})+10,y+82,{w:600,size:28,col:AG.mut,a:o.unitA==null?1:o.unitA});ctx.restore();}
function fu_miniAgent(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ag_ring(ctx,0,0,100,{p:1,from:-120,pulse:o.pulse==null?null:{deg:o.pulse,a:1}});ag_model(ctx,0,0,46,{t:o.t||0,core:0.8,think:o.think||0.3,label:null});ctx.restore();}
function fu_notEquals(ctx,x,y,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(AG.amber,0.95);rr(ctx,x-23,y-16,46,10,5);ctx.fill();rr(ctx,x-23,y+6,46,10,5);ctx.fill();
  ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+12,y-30);ctx.lineTo(x-12,y+30);ctx.stroke();ctx.restore();}
function fu_recordMini(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;const h=212;ag_box(ctx,x,y,w,h,18,{});
  ag_T(ctx,"What its hands did",x+26,y+46,{w:700,size:30});
  for(let i=0;i<3;i++){const yy=y+82+i*40,am=i<2?(o.amber||0):0;if(am>0){ctx.fillStyle=rgba([244,206,140],0.7*am);rr(ctx,x+20,yy-4,w-40,32,8);ctx.fill();}
    ag_T(ctx,String(i+1),x+30,yy+22,{w:800,size:28,col:i<2&&am>0.5?AG.amber:AG.mut});ctx.fillStyle=rgba(AG.mut,0.32);rr(ctx,x+64,yy+8,(w-110)*(i===1?0.8:i===2?0.6:0.92),12,6);ctx.fill();}
  const f=o.finger;if(f!=null&&f>0&&f<1){const yy=y+82+f*2*40+12;ctx.fillStyle=rgba([74,80,92],0.9);ctx.beginPath();ctx.moveTo(x+w-22,yy);ctx.lineTo(x+w-4,yy-10);ctx.lineTo(x+w-4,yy+10);ctx.closePath();ctx.fill();}
  ctx.restore();return{x,y,w,h};}
function fu_decision(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+75,lerp(0.6,1,o.k));const h=o.h||150;ag_box(ctx,x,y,w,h,22,{});
  const title=o.title||"2,880 people";ag_T(ctx,"ANSWER",x+28,y+50,{w:700,size:28,ls:4,col:AG.violet});ag_T(ctx,title,x+28,y+108,{w:700,size:36});
  // the person's initials beside the answer: their decision. The agent's tick, top right, turns grey "for reference" once they have
  fu_initials(ctx,x+28+ag_tw(ctx,title,{w:700,size:36})+44,y+112,o.initials||0,{s:0.85});
  const g=o.grey||0,rw=ag_tw(ctx,"for reference",{w:600,size:28}),tx=x+w-28-rw-30;ag_tick(ctx,tx,y+40,34,rgba(mix(AG.green,[150,150,150],g),1),5);
  ag_T(ctx,"for reference",x+w-28,y+50,{w:600,size:28,align:"right",col:AG.mut,a:g});ctx.restore();return{x,y,w,h};}
// a change of Jun's team: its words, bold, on a card sized to them, centred at cx
function fu_changeCard(ctx,cx,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=ag_tw(ctx,text,{w:800,size:34})+64,h=74;ctx.save();if(o.k!=null)ag_about(ctx,cx,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,cx-w/2,y,w,h,20,{a,edge:AG.ink,edgeA:0.3});withA(ctx,a,()=>ag_T(ctx,text,cx,y+49,{w:800,size:34,align:"center"}));ctx.restore();}
// a count, small: a heading (o.kick: as a kick, violet), the number, its unit under it
function fu_countMini(ctx,x,y,w,head,n,unit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+73,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,146,18,{});if(o.kick)ag_T(ctx,String(head).toUpperCase(),x+24,y+42,{w:700,size:28,ls:4,col:AG.violet});else ag_T(ctx,head,x+24,y+42,{w:700,size:28});
  ag_T(ctx,n,x+24,y+92,{w:800,size:40});ag_T(ctx,unit,x+24,y+128,{w:600,size:28,col:AG.mut});ctx.restore();}
// a quotation, large, on its card: its words, and who said them
function fu_quote(ctx,cx,cy,text,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=o.w||1100,lines=ag_wrap(ctx,text,w-140,{w:800,size:52}),h=96+lines.length*66+56;
  ctx.save();if(o.k!=null)ag_about(ctx,cx,cy,lerp(0.7,1,o.k));ag_box(ctx,cx-w/2,cy-h/2,w,h,26,{a});
  withA(ctx,a,()=>{lines.forEach((l,i)=>ag_T(ctx,l,cx,cy-h/2+100+i*66,{w:800,size:52,align:"center"}));ag_T(ctx,who,cx,cy+h/2-44,{w:600,size:30,align:"center",col:AG.mut});});ctx.restore();}

/* ===== It feels like understanding: the seven chapters =====
   Each chapter is a few shots in this film's places (plan.js) and the series' lab, cut together with short dissolves (ag_shots). Times
   inside a chapter come from its cues and the words of its lines (wAt, called directly so the cue check sees each word), so the
   pictures stay with the voice if it's recorded again. Words on screen are on cards, signs, screens and the wall, at least 28 px as
   seen, and above the captions. */

const fu_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const fu_fin=(t,a,d)=>ag_in(t,a,d||0.6);
// the tangent of a curve at u, as an angle
function fu_ang(p,u){const a=ag_bz(p,Math.max(0,u-0.01)),b=ag_bz(p,Math.min(1,u+0.01));return Math.atan2(b[1]-a[1],b[0]-a[0]);}
// a small orange arrow: a push off course, at (x, y), pointing along ang, len long; a 0 to 1; o.ghost draws it pale, as it really was
function fu_push(ctx,x,y,ang,len,a,o){o=o||{};if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(ang);const col=o.ghost?rgba(AG.orange,0.28):rgba(AG.orange,0.95);
  ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(len-8,0);ctx.stroke();
  ctx.beginPath();ctx.moveTo(len+2,0);ctx.lineTo(len-12,-8);ctx.lineTo(len-12,8);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- 1999's room: the drawing of space on the wall, then the two desks.
   o: space {earth, mars, path, labels, swirl}, craft {u, on, puff, burn, orbitTh, orb (which orbit), behind}, real (the real path's
   alpha), orbits (the orbits' alpha), radio (the radio line's alpha), odyssey {u, th, a}, second (Odyssey's second line), pushes [[u, a]],
   people {lean, nod}, crt {L, R} (what each monitor shows), dim (the light of the night it was lost) */
function fu_room99(ctx,t,o){const S=FU_SPACE,M=S.mars,E=S.earth,sp=o.space||{};
  // Earth, the way there, the labels
  fu_pencilDisc(ctx,E[0],E[1],E[2],sp.earth==null?1:sp.earth,FU.earth,{});
  fu_dots(ctx,S.path,0.04,lerp(0.04,1,sp.path==null?1:sp.path),{});
  if((o.real||0)>0)fu_line(ctx,S.real,0.04,lerp(0.04,1,o.realP==null?1:o.realP),{color:rgba(AG.amber,0.85),lw:2.6,dash:[10,8],a:o.real});
  const la=sp.labels==null?1:sp.labels;if(la>0){fu_pencil(ctx,"Earth",E[0],E[1]+E[2]+44,{align:"center",a:la});fu_pencil(ctx,"Mars",M[0],M[1]+M[2]+44,{align:"center",a:la});}
  // the orbits' far halves, behind Mars
  const ob=o.orbits||0;fu_orbit(ctx,S.plan,"back",ob,rgba(FU.graphite,0.7),[3,9]);fu_orbit(ctx,S.low,"back",ob*(o.lowA==null?1:o.lowA),rgba(AG.amber,0.85),[10,8]);
  // the craft: where it is, and whether Mars hides it
  const cr=o.craft;let cp=null;if(cr&&cr.on>0){if(cr.orbitTh!=null){const q=fu_orbitAt(cr.orb||S.low,cr.orbitTh);cp=[q[0],q[1],cr.orbitTh+Math.PI/2,q[2]];}
    else{const q=ag_bz(S.real,cr.u);cp=[q[0],q[1],fu_ang(S.real,cr.u),false];}}
  const od=o.odyssey;let opos=null;if(od&&od.a>0){if(od.th!=null){const q=fu_orbitAt(S.plan,od.th);opos=[q[0],q[1],od.th+Math.PI/2,q[2]];}else{const q=ag_bz(S.path,od.u);opos=[q[0],q[1],fu_ang(S.path,od.u),false];}}
  // the radio line home: a soft dotted thread from Earth to the craft
  if(cp&&(o.radio||0)>0)fu_dots(ctx,[E[0]+E[2]*0.7,E[1]-E[2]*0.3,lerp(E[0],cp[0],0.33),lerp(E[1],cp[1],0.33)-40,lerp(E[0],cp[0],0.66),lerp(E[1],cp[1],0.66)-40,cp[0],cp[1]],0,1,{a:o.radio,n:70,r:2.2,color:rgba([96,110,124],0.8)});
  if(opos&&(o.oRadio||0)>0){fu_dots(ctx,[E[0]+E[2]*0.7,E[1]-E[2]*0.3,lerp(E[0],opos[0],0.33),lerp(E[1],opos[1],0.33)-40,lerp(E[0],opos[0],0.66),lerp(E[1],opos[1],0.66)-40,opos[0],opos[1]],0,1,{a:o.oRadio,n:70,r:2.2,color:rgba([96,110,124],0.8)});
    // the second way to find it: another line, from another side of Earth, meeting the first at the craft
    if((o.second||0)>0){const u=ag_sine(o.second);fu_dots(ctx,[E[0]+E[2]*0.3,E[1]+E[2]*0.9,lerp(E[0],opos[0],0.4),E[1]+90,lerp(E[0],opos[0],0.8),lerp(E[1],opos[1],0.8)+60,opos[0],opos[1]],0,u,{n:80,r:2.4,color:rgba(AG.blue,0.85)});}}
  const craft=(front)=>{if(cp&&cp[3]!==front)fu_orbiter(ctx,cp[0],cp[1],cr.s||0.62,cp[2],{a:cr.on,puff:cr.puff,burn:cr.burn,t});
    if(opos&&opos[3]!==front)fu_odyssey(ctx,opos[0],opos[1],od.s||0.5,opos[2],{a:od.a});};
  craft(false);
  fu_pencilDisc(ctx,M[0],M[1],M[2],sp.mars==null?1:sp.mars,FU.mars,{swirl:sp.swirl,t});
  fu_orbit(ctx,S.plan,"front",ob,rgba(FU.graphite,0.7),[3,9]);fu_orbit(ctx,S.low,"front",ob*(o.lowA==null?1:o.lowA),rgba(AG.amber,0.85),[10,8]);
  craft(true);
  // pushes off course: small orange arrows at the craft, each at its moment
  for(const pu of (o.pushes||[])){if(pu[1]<=0.01)continue;const q=ag_bz(S.real,pu[0]),an=fu_ang(S.real,pu[0])+Math.PI/2;fu_push(ctx,q[0],q[1],an,30,pu[1],{lw:3.4});}
  // the desks of 1999, and the people at them (o.empty: the wall alone, for a close-up of the drawing)
  const F=FU99,pe=o.people||{},[lx,ly,lw]=F.deskL,[rx,ry,rw]=F.deskR;if(o.empty){ag_roomLight(ctx,1);return;}
  ag_desk(ctx,lx,ly,lw,{});ag_desk(ctx,rx,ry,rw,{});
  ag_person(ctx,FU_PEOPLE.builderB,F.bB[0],F.bB[1],F.bB[2],{t,cut:ly-70,gaze:[3,1],nod:pe.nodL||0});
  ag_person(ctx,FU_PEOPLE.builderA,F.bA[0],F.bA[1],F.bA[2],{t:t+1.3,cut:ly-70,gaze:[4,1],nod:pe.nodL||0});
  ag_person(ctx,FU_PEOPLE.navA,F.nA[0]+(pe.lean||0)*12,F.nA[1]+(pe.lean||0)*4,F.nA[2],{t:t+2.1,flip:true,cut:ry-70,gaze:[4,1],nod:(pe.nodR||0)-(pe.lean||0)*0.04,smile:0.3+0.2*(pe.lean||0)});
  ag_person(ctx,FU_PEOPLE.navB,F.nB[0]+(pe.lean||0)*8,F.nB[1],F.nB[2],{t:t+0.7,flip:true,cut:ry-70,gaze:[4,1],nod:(pe.nodR||0)-(pe.lean||0)*0.03});
  const crt=o.crt||{};fu_crt(ctx,F.crtL[0],F.crtL[1],F.crtL[2],{on:crt.onL,draw:(c,x,y,w,h)=>fu_screen99(c,x,y,w,h,crt.L||{})});
  fu_crt(ctx,F.crtR[0],F.crtR[1],F.crtR[2],{on:crt.onR,draw:(c,x,y,w,h)=>fu_screen99(c,x,y,w,h,crt.R||{})});
  fu_phone(ctx,96,812,0.7,{ring:0});fu_binders(ctx,1846,808,2,0.74);
  fu_sheet(ctx,1676,816,150,52,{rot:0.04,draw:(c,x,y,w,h)=>fu_plotDraw(c,x,y,w,h,1)});
  ag_roomLight(ctx,1);
  if((o.dim||0)>0){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mix([255,255,255],[150,150,160],o.dim),1);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}}
// what a monitor of 1999 shows: the plotted way to Mars (p), with each push drawn small and, behind it, a pale ghost of its real size
// (ghost), or nothing but a flat line (flat)
function fu_screen99(c,x,y,w,h,o){if(o.flat!=null){c.strokeStyle="rgba(60,80,70,0.7)";c.lineWidth=2;c.beginPath();c.moveTo(x+10,y+h*0.55);c.lineTo(x+w-10,y+h*0.55);c.stroke();return;}
  c.strokeStyle="rgba(60,80,70,0.25)";c.lineWidth=1;for(let i=1;i<4;i++){c.beginPath();c.moveTo(x,y+h*i/4);c.lineTo(x+w,y+h*i/4);c.stroke();}
  const P=[x+10,y+h*0.78,x+w*0.3,y+h*0.12,x+w*0.7,y+h*0.1,x+w-12,y+h*0.6];c.strokeStyle="rgba(50,70,60,0.85)";c.lineWidth=2;ag_bzPath(c,P,0,o.p==null?1:o.p,40);c.stroke();
  if(o.arrows){for(const [u,a] of o.arrows){const q=ag_bz(P,u),an=fu_ang(P,u)+Math.PI/2;if(o.ghost)fu_push(c,q[0],q[1],an,46,a*o.ghost,{ghost:true,lw:3.2});fu_push(c,q[0],q[1],an,11,a,{lw:2.8});}}}

// ---- 1 · Two teams, one number: the Mars Climate Orbiter, two teams, one file of numbers, and the unit nobody wrote ----
scene("orbiter",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    dec:wAt(sc,"launch","December"),launched:wAt(sc,"launch","launched"),mco:wAt(sc,"launch","Mars Climate Orbiter"),weather:wAt(sc,"launch","the weather"),
    thr:c.thrusters,small:wAt(sc,"thrusters","small thrusters"),firing:wAt(sc,"thrusters","each firing"),pushed:wAt(sc,"thrusters","pushed"),course:wAt(sc,"thrusters","off course"),
    bld:c.builders,colo:wAt(sc,"builders","Colorado"),worked:wAt(sc,"builders","worked out"),every:wAt(sc,"builders","every push"),
    file:c.file,sent:wAt(sc,"file","sent"),navs:wAt(sc,"file","navigators"),cal:wAt(sc,"file","California"),steer:wAt(sc,"file","steer"),
    agr:c.agreed,agreed:wAt(sc,"agreed","agreed"),newton:wAt(sc,"agreed","newton-seconds"),gave:wAt(sc,"gave","gave"),pound:wAt(sc,"gave","pound-seconds"),four:wAt(sc,"gave","four and a half"),
    q:c.quarter,counted:wAt(sc,"quarter","counted"),less:wAt(sc,"quarter","less than a quarter"),sure:wAt(sc,"sure","sure"),same:wAt(sc,"sure","the same"),
    mon:c.months,nine:wAt(sc,"months","nine months"),added:wAt(sc,"months","added up"),apr:c.april,april:wAt(sc,"april","April"),fit:wAt(sc,"april","didn't fit"),
    emails:wAt(sc,"april","emails"),settled:wAt(sc,"april","never settled"),rou:c.routine,thirty:wAt(sc,"routine","thirty years"),routine:wAt(sc,"routine","routine"),
    burn:c.burn,third:wAt(sc,"burn","twenty-third"),fired:wAt(sc,"burn","fired"),behind:wAt(sc,"behind","passed behind"),km:wAt(sc,"behind","a hundred and seventy"),
    lower:wAt(sc,"behind","lower than planned"),never:wAt(sc,"never","never"),lost:c.lost,years:wAt(sc,"lost","Years of work"),sat:wAt(sc,"lost","first weather satellite"),
    were:wAt(sc,"lost","were lost"),chg:c.change,ody:c.odyssey,mo:wAt(sc,"odyssey","Mars Odyssey"),units:wAt(sc,"odyssey","both units"),hand:wAt(sc,"odyssey","hand-off"),
    crit:wAt(sc,"independent","critical"),indep:wAt(sc,"independent","independently"),sec:wAt(sc,"second","second way"),orb:c.orbit,into:wAt(sc,"orbit","went into orbit"),
    twenty:wAt(sc,"orbit","twenty years later"),work:wAt(sc,"orbit","still at work"),risk:c.risk,agents:wAt(sc,"risk","Agents"),person:wAt(sc,"risk","a person"),
    eachSure:wAt(sc,"risk","each sure"),say:wAt(sc,"rely","Say what"),check:wAt(sc,"rely","check it"),rely:wAt(sc,"rely","rely"),br:c.breath}));
  const F=FU99,S9=FU_SPACE;
  // the craft's way: from Earth at "launched", a little way by the end of the thrusters' line, on to Mars over the nine months; then
  // its engine, and the lower orbit, behind the planet
  const cu=ag_keys(t,[[P.launched,0.04],[P.thr+6,0.3],[P.mon-0.4,0.34],[P.mon+3.6,0.97],[P.burn,1]]),
    th=t<P.behind-0.2?null:lerp(0,Math.PI*0.62,ag_sine((t-P.behind+0.2)/2.6)),
    fires=[P.firing,P.pushed,P.mon+0.2,P.mon+0.9,P.mon+1.6,P.mon+2.3,P.mon+3.0],
    pushes=fires.map(f=>[ag_keys(f,[[P.launched,0.04],[P.thr+6,0.3],[P.mon-0.4,0.34],[P.mon+3.6,0.97]]),ag_io(t,f,f+1.1,0.2)]);
  const craft={u:cu,on:fu_fin(t,P.launched-0.2,0.4),puff:clamp((t-P.firing)/1.0,0,1)<1&&t>P.firing?(t-P.firing)/1.0:(t>P.pushed&&t<P.pushed+1?(t-P.pushed):0),
    burn:ag_io(t,P.fired,P.behind+0.6,0.3)*(0.75+0.25*Math.sin(t*23)),orbitTh:th,orb:S9.low,s:0.62};
  const space={earth:clamp((t-P.dec+0.6)/1.3,0,1),mars:clamp((t-P.dec-0.2)/1.3,0,1),path:clamp((t-P.launched+0.3)/1.6,0,1),labels:fu_fin(t,P.dec+0.4,0.6)*(1-ag_io(t,P.apr-0.5,P.rou-0.3,0.4)),swirl:ag_io(t,P.weather,P.thr+2,0.6)};
  // the navigators' monitor: the plotted way; each push drawn small, and its real size, pale, behind it
  const crt={L:{p:clamp((t-P.worked)/1.4,0,1)},R:{p:fu_fin(t,P.steer-0.2,1.2),arrows:[[0.2,fu_fin(t,P.counted,0.4)],[0.5,fu_fin(t,P.counted+0.4,0.4)],[0.8,fu_fin(t,P.counted+0.8,0.4)]],ghost:fu_fin(t,P.less,0.5)}};
  const room=(x,tt,o)=>fu_room99(x,tt,Object.assign({space,craft,pushes,crt,real:fu_fin(tt,P.nine,1.2)*1,realP:clamp((tt-P.nine)/2.6,0,1)},o||{}));
  const nav={lean:ag_in(t,P.routine,1.2)*(1-fu_fin(t,P.burn,0.8)),nodL:t>P.same-0.3&&t<P.same+1.2?0.06*Math.sin((t-P.same+0.3)*8)*ag_io(t,P.same-0.3,P.same+1.0,0.2):0};
  nav.nodR=nav.nodL;
  // the file of numbers, the units' bubbles, the bars, the envelopes, the thirty ticks, Odyssey's cards: what's drawn over the room
  const over=(x,tt)=>{
    // the file: its numbers fill at the builders' desk, it slides along the floor to the navigators', into their monitor; back to say its tag stays blank; filled by Odyssey's team
    const fIn=fu_fin(tt,P.worked-0.4,0.5),slide=ag_sine((tt-P.sent)/1.8),into=ag_sine((tt-P.steer-0.2)/1.0),back=fu_fin(tt,P.sure-0.2,0.6)*(1-fu_fin(tt,P.mon-0.3,0.5)),ody=fu_fin(tt,P.units-0.3,0.6);
    if(tt<P.steer+1.2&&fIn>0){const fx=lerp(600,1052,slide),fy=430+Math.sin(slide*Math.PI)*-30,k=1-0.75*into;x.save();ag_about(x,fx+125,fy+125,k);x.translate(lerp(0,1428-(fx+125),into),lerp(0,693-(fy+125),into));
      fu_fileCard(x,fx,fy,{rows:clamp((tt-P.worked)/1.4,0,1),a:fIn*(1-into),ask:0});x.restore();}
    if(back>0)fu_fileCard(x,810,350,{rows:1,a:back,ask:fu_fin(tt,P.same,0.6),k:ag_spr(tt,P.sure-0.2,0.7)});
    if(ody>0&&tt<P.orb)fu_fileCard(x,810,262,{rows:1,a:ody*(1-fu_fin(tt,P.orb-0.6,0.4)),unit:clamp((tt-P.hand+0.2)/0.8,0,1),k:ag_spr(tt,P.units-0.3,0.7)});
    // the desks' signs: who sits where
    const sg=(1-fu_fin(tt,P.burn-0.6,0.6))*(1-ag_io(tt,P.mon-0.6,P.rou+1.2,0.4));fu_sign(x,F.pillL[0],F.pillL[1],"Colorado","the builders",fu_fin(tt,P.colo-0.2,0.5)*sg,ag_spr(tt,P.colo-0.2,0.7));
    fu_sign(x,F.pillR[0],F.pillR[1],"California","NASA's navigators",fu_fin(tt,P.cal-0.2,0.5)*sg,ag_spr(tt,P.cal-0.2,0.7));
    // the two units' agreement, and each team's own meaning
    const ag=fu_fin(tt,P.agreed-0.1,0.5)*(1-fu_fin(tt,P.four-0.2,0.5));if(ag>0)fu_blueCard(x,960,590,"agreed: newton-seconds",{a:ag,k:ag_spr(tt,P.agreed-0.1,0.7),col:AG.mut});
    const bub=fu_fin(tt,P.pound-0.3,0.5)*(1-fu_fin(tt,P.mon-0.3,0.6));
    if(bub>0){const nod=tt>P.same-0.3?Math.sin((tt-P.same+0.3)*7)*6*ag_io(tt,P.same-0.3,P.same+1.0,0.2):0;
      fu_bubble(x,F.bubL[0],F.bubL[1]+nod,"pound-seconds",{a:bub,k:ag_spr(tt,P.pound-0.3,0.7),px:F.bA[0]-20,py:F.bA[1]-150});
      fu_bubble(x,F.bubR[0],F.bubR[1]+nod,"newton-seconds",{a:fu_fin(tt,P.pound+0.1,0.5)*(1-fu_fin(tt,P.mon-0.3,0.6)),k:ag_spr(tt,P.pound+0.1,0.7),px:F.nA[0]+20,py:F.nA[1]-150});}
    // how far apart the units are
    const bars=fu_fin(tt,P.four-0.1,0.5)*(1-fu_fin(tt,P.sure-0.4,0.5));if(bars>0){const g=ag_eo(clamp((tt-P.four+0.1)/1.0,0,1));x.save();x.globalAlpha*=bars;
      const bx=700,bw=445;ag_box(x,bx-30,420,bw+300,206,18,{});x.fillStyle=rgba(AG.ink,0.85);rr(x,bx,470,bw*g,22,8);x.fill();rr(x,bx,550,100*g,22,8);x.fill();
      ag_T(x,"1 pound-second",bx+bw*g+20,489,{w:700,size:30,a:g});ag_T(x,"1 newton-second",bx+120,569,{w:700,size:30,a:g});
      ag_T(x,"4.45 times",bx,456,{w:600,size:28,col:AG.mut,a:fu_fin(tt,P.four+0.5,0.5)});x.restore();}
    // the doubt, raised in emails and never settled: an envelope a month, up from the navigators' desk; none answered; they settle in a pile
    const months=["Apr","May","Jun","Jul"];for(let i=0;i<4;i++){const t0=P.april+i*1.25,u=clamp((tt-t0)/1.3,0,1),fall=clamp((tt-P.settled-0.3-i*0.12)/0.9,0,1);if(u<=0)continue;
      const ex=lerp(1460,1090+i*150,ag_sine(u)),ey=lerp(640,384+(i%2)*34,ag_sine(u)),px=1380+i*16,py=772-i*9,fx=lerp(ex,px,ag_sine(fall)),fy=lerp(ey,py,ag_sine(fall));
      fu_envelope(x,fx,fy,lerp(0.9,0.5,fall),{a:fu_fin(tt,t0,0.3)*(1-fu_fin(tt,P.burn-0.6,0.6)),label:fall<0.3?months[i]:null,rot:lerp(-0.05,0.1*(i%2?1:-1),fall)});}
    // thirty years of success: thirty small green ticks along the skirting
    const tk=fu_fin(tt,P.thirty-0.2,0.4)*(1-fu_fin(tt,P.burn-0.6,0.6));if(tk>0){x.save();x.globalAlpha*=tk;for(let i=0;i<30;i++){const k=clamp((tt-P.thirty-i*0.04)/0.3,0,1);if(k>0)ag_tick(x,120+i*57,645,18*ag_eo(k),rgba(AG.green,1),3.4);}
      ag_pill(x,960,598,"30 years",{col:AG.green,a:fu_fin(tt,P.thirty+0.6,0.5)});x.restore();}};
  // Odyssey's changes, on the hand-off line between the desks
  const odyCards=(x,tt,a)=>{const cards=[["Both units on every hand-off",P.units],["Every critical number checked independently",P.crit],["A second way to find the craft",P.sec]];
    cards.forEach(([s,t0],i)=>fu_blueCard(x,960,656+i*74,s,{a:a*fu_fin(tt,t0-0.2,0.5),k:ag_spr(tt,t0-0.2,0.7),size:28}));
    // a second person's tick beside the first, on the file
    const tk2=fu_fin(tt,P.indep-0.2,0.4)*(1-fu_fin(tt,P.orb-0.6,0.4));if(tk2>0){x.save();x.globalAlpha*=tk2;ag_tick(x,1150,392,30,rgba(AG.green,1),4.5);x.globalAlpha*=fu_fin(tt,P.indep+0.3,0.4);ag_tick(x,1192,392,30,rgba(AG.green,1),4.5);x.restore();}};
  const sh=[
    // the wall: Earth and Mars drawn in graphite; the orbiter leaves; close on it as its thrusters fire; down to the two desks, the
    // builders', the file sliding to the navigators', and back to both
    {at:0,place:"fuWall",d:1.7,push:0,keys:[[0,960,300,1.8],[P.small-0.6,1010,150,2.7],[P.bld-0.3,960,540,1.06],[P.colo,560,560,1.32],[P.sent+0.2,1360,560,1.32],[P.agr-0.4,960,540,1.06]],
      draw:(x,tt)=>{room(x,tt,{people:nav});over(x,tt);}},
    // the navigators' monitor, close: every push counted at less than a quarter of its size, its real size a pale ghost behind it
    {cut:true,at:P.q-0.3,place:"fuWall",keys:[[P.q-0.3,1426,722,3.5]],push:0.03,draw:(x,tt)=>{room(x,tt,{people:nav});}},
    // back to both desks: each team sure; up to the wall for the nine months; the navigators' desk and its emails; thirty years
    {cut:true,at:P.sure-0.4,place:"fuWall",d:1.7,keys:[[P.sure-0.4,960,540,1.06],[P.mon-0.3,960,300,1.8],[P.apr-0.3,1355,540,1.7],[P.rou-0.3,960,560,1.06]],
      draw:(x,tt)=>{room(x,tt,{people:nav,orbits:0});over(x,tt);}},
    // the night of 23 September 1999: the light lower; the engine's glow; behind Mars, on the lower orbit, the radio line ending at
    // the planet's edge; planned, and 170 km lower
    {cut:true,at:P.burn-0.5,place:"fuWallDim",keys:[[P.burn-0.5,1150,240,2.3],[P.behind-0.3,1205,215,2.75]],d:1.8,push:0,draw:(x,tt)=>{
      room(x,tt,{empty:true,orbits:fu_fin(tt,P.km-0.4,0.6),lowA:1,radio:ag_in(tt,P.burn-0.3,0.6)*(1-fu_fin(tt,P.never+0.6,1.4)),dim:0.15});
      const M=S9.mars;fu_pencil(x,"planned",M[0]+S9.plan[0]+14,M[1]-22,{size:28,a:fu_fin(tt,P.km-0.2,0.5)});
      ag_T(x,"170 km lower",M[0]+S9.low[0]+18,M[1]+34,{w:700,size:28,col:AG.amber,a:fu_fin(tt,P.lower-0.3,0.5)});}},
    // the navigators' monitor in the dark: a flat, empty line
    {cut:true,at:P.never+0.5,place:"fuWallDim",keys:[[P.never+0.5,1428,690,2.6],[P.never+0.6,1428,694,2.7]],d:2,draw:(x,tt)=>{room(x,tt,{people:{},crt:{L:{p:1},R:{flat:1}},dim:0.15,craft:null});}},
    // both desks, the light going down: years of work, lost; then the picture steps back under a pale veil
    {cut:true,at:P.lost-0.4,place:"fuWallDim",keys:[[P.lost-0.4,960,540,1.12],[P.lost-0.3,960,540,1.04]],d:4,draw:(x,tt)=>{room(x,tt,{people:{},crt:{L:{p:1},R:{flat:1}},craft:null,dim:0.15+0.35*fu_fin(tt,P.were,1.2)});}},
    // 2001: Odyssey on the same way, and its team's three changes; the file's tag filled; a second person's tick; a second way to find it
    {cut:true,at:P.ody-0.6,place:"fuWall",keys:[[P.ody-0.6,960,500,1.12]],push:0.02,draw:(x,tt)=>{
      room(x,tt,{people:{},craft:null,real:0,odyssey:{u:ag_keys(tt,[[P.mo,0.1],[P.orb,0.85]]),a:fu_fin(tt,P.mo-0.3,0.6),s:0.5},oRadio:fu_fin(tt,P.sec-0.2,0.6),second:clamp((tt-P.sec)/1.6,0,1)});
      over(x,tt);odyCards(x,tt,1);}},
    // Odyssey goes into orbit round Mars, on the orbit planned; twenty years later, still at work
    {cut:true,at:P.orb-0.3,place:"fuWall",keys:[[P.orb-0.3,1180,250,2.2],[P.into,1230,250,2.5]],d:1.8,draw:(x,tt)=>{
      const thO=tt<P.into?null:(tt-P.into)*0.9;room(x,tt,{empty:true,craft:null,real:0,orbits:0,odyssey:{u:ag_keys(tt,[[P.orb-0.3,0.86],[P.into,1]]),th:thO,a:1,s:0.46}});
      if(thO!=null)fu_orbit(x,S9.plan,"front",fu_fin(tt,P.into,0.8),rgba(FU.graphite,0.7),[3,9]);
      const M=S9.mars,yr=tt<P.twenty?"2001":(tt<P.twenty+1.2?String(2001+Math.floor((tt-P.twenty)/1.2*20)):"2021");
      ag_pill(x,M[0],M[1]+M[2]+108,yr,{a:fu_fin(tt,P.into+0.6,0.5),size:30});
      ag_T(x,"still at work",M[0],M[1]+M[2]+168,{w:700,size:28,align:"center",col:AG.green,a:fu_fin(tt,P.work-0.2,0.5)});}},
    // today: the same stage, a person on the left and the agent's sphere in its ring on the right, a number between them; over each,
    // a bubble, its meaning turned away; said, both turn to the same word, and the number is checked against something else
    {at:P.risk-0.4,place:"fuData",keys:[[P.risk-0.4,960,540,1.06],[P.risk-0.3,960,540,1.0]],d:6,draw:(x,tt)=>{
      fu_junDesk(x,tt,{gaze:[4,0],smile:0.3});
      ag_loop(x,1440,400,{R:150,r:72,label:null,core:0.7,think:0.2+0.3*ag_io(tt,P.eachSure-0.6,P.say,0.5),t:tt,a:fu_fin(tt,P.agents-0.2,0.6),floor:null});
      ag_roomLight(x,1);
      const say=fu_fin(tt,P.say,0.8),tag=say>0.5?"people":"",out=1-fu_fin(tt,P.br-0.3,0.7);
      fu_numberCard(x,560,330,"2,880",tag,{a:fu_fin(tt,P.agents,0.6)*out,k:ag_spr(tt,P.agents,0.7),fill:say});
      const turn=lerp(0.12,1,ag_sine((tt-P.say)/0.8));
      fu_bubble(x,330,292,"people",{a:fu_fin(tt,P.person-0.1,0.5)*out,k:ag_spr(tt,P.person-0.1,0.7),px:322,py:378,blank:tt<P.say+0.4,turn,w:230});
      fu_bubble(x,1440,152,"people",{a:fu_fin(tt,P.eachSure-0.6,0.5)*out,k:ag_spr(tt,P.eachSure-0.6,0.7),px:1440,py:238,blank:tt<P.say+0.4,turn,w:230,edge:AG.violet});
      const ck=fu_fin(tt,P.check,0.6)*out;if(ck>0){fu_facList(x,lerp(1300,940,ag_sine((tt-P.check)/1.0)),316,{a:ck,w:300,h:200});
        if(tt>P.check+1.1)ag_tick(x,1206,474,34*ag_eo(clamp((tt-P.check-1.1)/0.4,0,1)),rgba(AG.green,1),5);}}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);
  // when and where, in the corner
  fu_when(ctx,"1998","Mars Climate Orbiter",fu_fin(t,0.4,0.6)*(1-fu_fin(t,P.bld-0.6,0.4)));
  fu_when(ctx,"April 1999","California",fu_fin(t,P.apr-0.2,0.5)*(1-fu_fin(t,P.burn-0.6,0.4)));
  fu_when(ctx,"23 September 1999","at Mars",fu_fin(t,P.burn-0.2,0.5)*(1-fu_fin(t,P.lost+1.0,0.5)));
  fu_when(ctx,"2001","Mars Odyssey",fu_fin(t,P.ody-0.3,0.5)*(1-fu_fin(t,P.risk-0.6,0.4)));
  fu_when(ctx,"Today","the same risk",fu_fin(t,P.risk,0.5)*(1-fu_fin(t,P.br,0.4)));
  // the Odyssey cards and file stay legible over the first wide; "Something had to change": a pale veil
  ag_veil(ctx,S,0.55*ag_io(t,P.chg-0.2,P.ody-0.4,0.5));
  ag_veil(ctx,S,0.65*ag_in(t,P.br,0.8));ag_title(ctx,S,t,P.br,"It feels like understanding",null,"FILM 4 OF 10 · WHAT AN AGENT IS");});

/* ---------------------------------------------------------------- today's agent at work: o {ask (when Jun asks it), read, query, check,
   done (the answer's moment)}, as times; the hands reach to the catalog and the query, data rides back, the ring turns once on the check */
function fu_agentAt(x,tt,T,o){o=o||{};const back=ag_sine((tt-T.check-0.4)/1.2),hold=1-back,
    reach=[ag_sine((tt-T.read+0.3)/0.9)*hold,ag_sine((tt-T.query+0.1)/0.9)*hold,0.3*ag_sine((tt-T.read)/1.4)],
    data=[clamp((tt-T.read-0.6)/1.5,0,1),clamp((tt-T.query-0.5)/1.5,0,1),0],
    touch=[ag_io(tt,T.read+0.4,T.check,0.3),ag_io(tt,T.query+0.5,T.check+0.3,0.3),0],
    think=(o.think==null?0.15:o.think)+0.6*ag_io(tt,T.ask,T.done+0.6,0.6),pulse=tt>T.check-0.1&&tt<T.check+1.5?(tt-T.check+0.1)/1.4*360-90:null,
    lit=tt>T.check&&tt<T.done?2:(tt>T.read-0.3&&tt<T.check?1:(tt>T.ask+0.3&&tt<T.read-0.3?0:null));
  fu_agent(x,tt,{core:0.7+0.3*think,think,lit,col:lit===2?AG.green:AG.violet,pulse,reach,data,touch,a:o.a,frost:o.frost,toolsA:o.toolsA});}
// a card carried across a cut, in the frame's own coordinates: from a to b (each [x, y, scale]) as u runs 0 to 1, with a soft arc
function fu_carry(ctx,S,u,a,b,draw){if(u<=0||u>=1)return;setScreen(ctx,S);const k=ag_sine(u),x=lerp(a[0],b[0],k),y=lerp(a[1],b[1],k)-Math.sin(Math.PI*k)*60,s=lerp(a[2],b[2],k);
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);draw(ctx);ctx.restore();}

// ---- 2 · A fluent answer: Anil plans the advisers; Jun asks the agent; 2,160 students, a passing check and its evidence ----
scene("fluent",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    anil:wAt(sc,"today","Anil Kurian"),plans:wAt(sc,"today","plans"),adv:wAt(sc,"today","student advisers"),
    calls:c.calls,each:wAt(sc,"calls","Each adviser"),n240:wAt(sc,"calls","two hundred and forty"),once:wAt(sc,"calls","once a term"),see:wAt(sc,"calls","to see"),
    asks:c.asks,jun:wAt(sc,"asks","Jun"),team:wAt(sc,"asks","data team"),many:wAt(sc,"asks","how many"),
    agent:c.agent,ag:wAt(sc,"agent","the agent"),hands:c.hands,read:wAt(sc,"hands","read the catalog"),query:wAt(sc,"hands","run a query"),
    checks:wAt(sc,"hands","checks the count"),source:wAt(sc,"hands","the source"),ans:c.answer,two:wAt(sc,"answer","two thousand"),
    sixty:wAt(sc,"answer","sixty-three"),evid:wAt(sc,"answer","evidence attached"),study:c.study,longer:wAt(sc,"study","longer explanations"),
    conf:wAt(sc,"study","more confident"),acc:wAt(sc,"study","no more accurate"),feels:c.feels,safe:wAt(sc,"feels","feels safe")}));
  const T={ask:P.ag,read:P.read,query:P.query,check:P.checks,done:P.ans};
  // the advisers along the faculty's wall: each with a phone and a list, "240"; a soft ring on one phone
  const adv=(x,tt)=>{x.save();ag_about(x,200,170,1.15);fu_advisers(x,200,170,4,36,i=>({a:fu_fin(tt,P.each+0.7+i*0.16,0.4),list:{n:6,done:6,p:clamp((tt-P.once+0.2)/1.4-i*0.12,0,1)},ring:i===1?clamp((tt-P.see+0.5)/1.6,0,1):0}));x.restore();};
  const jun=(x,tt,o)=>fu_junDesk(x,tt,Object.assign({gaze:tt<P.ag-0.3?[4,-1]:(tt<P.ans?[6,-1]:[4,-3]),smile:0.3+0.4*fu_fin(tt,P.two,0.8),nod:-0.03*fu_fin(tt,P.ag-0.2,0.5)*(1-fu_fin(tt,P.ans,0.6))},o||{}));
  const SC={x:960,y:520,z:1.04};
  const sh=[
    // the Faculty of Health: Anil at his desk, his screen, "Advisers next term"; out to the wall and its advisers
    {at:0,place:"fuFaculty",d:1.8,keys:[[0,1152,560,1.25],[P.calls-0.6,960,540,1.0]],draw:(x,tt)=>{
      adv(x,tt);fu_anilDesk(x,tt,{caret:true,t:tt,gaze:tt>P.asks?[2,-2]:[3,0]});ag_roomLight(x,1);
      fu_nameCard(x,1480,180,"Anil Kurian","Faculty of Health",fu_fin(tt,P.anil-0.2,0.5));
      fu_say(x,820,150,440,"How many students does the faculty have this term?",{tail:{side:"right",at:0.75,px:1410,py:400},a:fu_fin(tt,P.asks-0.1,0.4)*(1-fu_fin(tt,P.team-0.2,0.25)),k:ag_spr(tt,P.asks-0.1,0.7)});}},
    // the data team: Jun reads the question and asks the agent; its hands, the data back, the check; the answer, with its evidence
    {at:P.team-0.2,place:"fuData",keys:[[P.team-0.2,SC.x,SC.y,SC.z]],push:0.02,draw:(x,tt)=>{
      fu_agentAt(x,tt,T);jun(x,tt);ag_roomLight(x,1);
      fu_check(x,1150,640,fu_fin(tt,P.source,0.5));
      fu_answer(x,520,150,{a:fu_fin(tt,P.ans-0.1,0.5),k:ag_spr(tt,P.ans-0.1,0.8)});
      fu_say(x,520,150,440,"How many students does the faculty have this term?",{tail:{side:"bottom",at:0.1,px:390,py:400},a:fu_fin(tt,P.team+1.2,0.2)*(1-fu_fin(tt,P.ag-0.1,0.2))});}},
    // the number goes back to Anil, who types it where the caret was
    {at:P.evid+0.5,place:"fuFaculty",keys:[[P.evid+0.5,1371,600,1.75]],push:0.02,draw:(x,tt)=>{
      adv(x,tt);const ty=clamp((tt-P.evid-1.4)/0.7,0,1);fu_anilDesk(x,tt,{value:"2,160",typed:ty,unit:"students",unitA:ag_in(ty,0.9,0.1),caret:ty<1,t:tt,gaze:[2,1]});ag_roomLight(x,1);}},
    // the 2025 study: a short answer and a long one; confidence rises with the long one, accuracy stays where it is
    {at:P.study-0.3,place:"fuQuiet",keys:[[P.study-0.3,960,520,1.0]],push:0.03,draw:(x,tt)=>{
      const sw=ag_tw(x,"Steyvers and colleagues",{w:700,size:30})+ag_tw(x,"2025",{w:500,size:30})+92;fu_source(x,960-sw/2,120,"Steyvers and colleagues","2025",fu_fin(tt,P.study,0.5));
      const ca=fu_fin(tt,P.study+0.4,0.5);fu_studyCard(x,250,260,520,2,"short",{a:ca,k:ag_spr(tt,P.study+0.4,0.7)});
      fu_studyCard(x,1110,260,560,8,"long",{a:ca,k:ag_spr(tt,P.study+0.6,0.7),shown:lerp(2,8,ag_sine((tt-P.longer)/1.6))});
      const ba=fu_fin(tt,P.conf-0.6,0.5),cf=lerp(0.42,0.86,ag_sine((tt-P.conf)/1.3)),hi=ag_io(tt,P.acc,P.feels+2,0.4);
      fu_bar(x,250,654,"confidence",0.42,{a:ba,col:AG_OAK.dark});fu_bar(x,250,722,"accuracy",0.5,{a:ba,hi});
      fu_bar(x,1110,654,"confidence",cf,{a:ba,col:AG_OAK.dark});fu_bar(x,1110,722,"accuracy",0.5,{a:ba,hi});}},
    // back at Jun's desk: the answer glows softly, and Jun leans back
    {at:P.feels-0.5,place:"fuData",keys:[[P.feels-0.5,690,500,1.25],[P.feels-0.4,686,500,1.28]],d:3,draw:(x,tt)=>{
      fu_agentAt(x,tt,T,{think:0,toolsA:0});jun(x,tt,{lean:fu_fin(tt,P.feels,1.4),smile:0.75,gaze:[4,-3]});ag_roomLight(x,1);
      fu_check(x,1150,640,1);const b=fu_answer(x,520,150,{a:0});fu_glow(x,b.card,fu_fin(tt,P.feels-0.2,1.2));fu_answer(x,520,150,{});}},
    // across the campus, Anil nods
    {at:P.safe-0.2,place:"fuFaculty",keys:[[P.safe-0.2,1371,600,1.75],[P.safe-0.1,1371,598,1.78]],d:3,draw:(x,tt)=>{
      adv(x,tt);const nd=Math.sin(clamp((tt-P.safe)/1.2,0,1)*Math.PI*2)*0.06;fu_anilDesk(x,tt,{value:"2,160",unit:"students",t:tt,nod:nd,smile:0.5,gaze:[2,1]});ag_roomLight(x,1);}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);
  // Anil's question, carried across the cut to Jun's desk; Jun passes it to the agent
  const sz=(z,wx,wy)=>[(wx-SC.x)*z+960,(wy-SC.y)*z+540];
  fu_carry(ctx,S,clamp((t-P.team+0.25)/1.45,0,1),[820+220,150+63,1],[...sz(SC.z,520+220,150+63),SC.z],c=>fu_say(c,-220,-63,440,"How many students does the faculty have this term?",{}));
  const into=clamp((t-P.ag+0.1)/0.9,0,1);if(into>0&&into<1){const s0=sz(SC.z,520+220,213),s1=sz(SC.z,1150,400),sc=lerp(SC.z,0.12,ag_sine(into));
    fu_carry(ctx,S,into,[...s0,SC.z],[...s1,0.12],c=>fu_say(c,-220,-63,440,"How many students does the faculty have this term?",{a:Math.pow(clamp((sc-0.12)/(SC.z-0.12),0,1),6)}));}
  // the number, carried back to Anil
  fu_carry(ctx,S,clamp((t-P.evid-0.1)/1.3,0,1),[...sz(SC.z,660,226),1],[(1290-1371)*1.75+960,(690-600)*1.75+540,1.4],c=>ag_pill(c,0,0,"2,160 students",{size:30}));
  fu_when(ctx,"Today","Faculty of Health",fu_fin(t,0.5,0.6)*(1-fu_fin(t,P.team-0.5,0.4)));
  fu_when(ctx,"Today","the data team",fu_fin(t,P.team+0.2,0.5)*(1-fu_fin(t,P.evid+0.2,0.4)));});

// ---- 3 · Explain it: the zip test, the 2002 study at Yale; Jun's six, three questions he can't answer, the agent behind frosted glass ----
scene("explain",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    try:c.try,how:wAt(sc,"try","how well"),zip:wAt(sc,"try","a zip"),one:wAt(sc,"try","from one to seven"),
    now:c.now,explain:wAt(sc,"now","explain"),step:wAt(sc,"now","step by step"),closes:wAt(sc,"now","closes and opens"),
    yale:c.yale,at:wAt(sc,"yale","at Yale"),asked:wAt(sc,"yale","asked people"),every:wAt(sc,"yale","everyday things"),like:wAt(sc,"yale","like a zip"),
    lower:c.lower,rated:wAt(sc,"lower","rated themselves lower"),six:c.six,asix:wAt(sc,"six","a six"),table:c.table,student:c.student,compare:c.compare,
    cant:c.cant,rough:wAt(sc,"cant","not even roughly"),came:c.came,know:wAt(sc,"came","not from knowing")}));
  const sh=[
    // the zip, drawn large, and seven dots under it; then three blank lines beside it, and the pencil that doesn't write
    {at:0,place:"fuQuiet",keys:[[0,960,520,1.04]],push:0.04,draw:(x,tt)=>{
      const mv=ag_sine((tt-P.now+0.4)/1.6),x0=lerp(300,130,mv),x1=lerp(1620,1010,mv),zy=lerp(430,410,mv);
      const sl=lerp(0.18,0.42,ag_sine((tt-P.closes+0.3)/1.4)),op=ag_sine((tt-P.closes)/1.4)*0.9;
      fu_zip(x,x0,x1,zy,{sl,open:op,a:fu_fin(tt,0.3,0.8)});
      // the viewer's own rating: the dots light one by one to five, held; after trying, they slip back to three
      const up=clamp((tt-P.one)/1.6*5,0,5),down=ag_sine((tt-P.rated)/1.2)*2;
      fu_scale(x,lerp(960,570,mv),736,up-down,{a:fu_fin(tt,P.how,0.6),k:null});
      // explain, step by step: three numbered blank lines, the pencil hovering over the first
      const bl=fu_fin(tt,P.explain,0.4)*(1-fu_fin(tt,P.every-0.6,0.4));fu_blankLines(x,1140,330,560,bl,{p:clamp((tt-P.explain)/1.2,0,1)});
      if(bl>0)withA(x,bl,()=>fu_pencilIcon(x,1250,300-8*Math.sin(tt*2.2)-12*ag_spr(tt,P.step,0.6),-0.5,0.9));
      // the study at Yale: its source; everyday things join the zip
      const sw=ag_tw(x,"Rozenblit and Keil, 2002",{w:700,size:30})+ag_tw(x,"Yale",{w:500,size:30})+92;fu_source(x,960-sw/2,110,"Rozenblit and Keil, 2002","Yale",fu_fin(tt,P.yale,0.5));
      const ev=k=>fu_fin(tt,P.every+0.1+k*0.35,0.5);fu_lockKey(x,1230,420,1.1,ev(0));fu_cistern(x,1460,420,1.1,ev(1));fu_pianoKeys(x,1680,420,1.1,ev(2));}},
    // Jun's own rating: six, quickly; three questions; the agent slips behind frosted glass, and the six falls to two
    {at:P.six-0.6,place:"fuData",keys:[[P.six-0.6,960,520,1.04],[P.six-0.5,960,520,1.0]],d:8,draw:(x,tt)=>{
      fu_agent(x,tt,{core:0.75,think:0.15,frost:ag_sine((tt-P.cant)/1.3)});
      fu_junDesk(x,tt,{gaze:tt<P.table?[4,-2]:[6,-1],smile:0.55*(1-fu_fin(tt,P.cant,1.2))+0.15,nod:0.04*fu_fin(tt,P.rough,1)});ag_roomLight(x,1);
      const b=fu_answer(x,520,150,{a:0});fu_glow(x,b.card,1-fu_fin(tt,P.know-0.4,1.6));fu_answer(x,520,150,{});
      const six=clamp((tt-P.asix+0.2)/0.9*6,0,6),fall=clamp((tt-P.rough)/1.6*4,0,4);fu_scale(x,730,476,six-fall,{gap:60,r:18,a:fu_fin(tt,P.six-0.2,0.5)});
      [["Which table did it read?",P.table],["What counted as a student?",P.student],["What did its check compare?",P.compare]].forEach(([q,t0],i)=>
        fu_question(x,1150,656+i*74,q,{a:fu_fin(tt,t0-0.15,0.4),k:ag_spr(tt,t0-0.15,0.7)}));}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);});

// ---- 4 · Right every time: months of right answers; the doubt in the chat, let go; the 2010 review; 9 advisers planned, 12 needed ----
scene("right",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    months:c.months,right:wAt(sc,"months","been right"),stopped:wAt(sc,"months","stopped opening"),chat:c.chat,wrote:wAt(sc,"chat","wrote in a chat"),
    long:wAt(sc,"chat","looked long"),replied:c.replied,checked:wAt(sc,"replied","checked its source"),go:wAt(sc,"replied","let it go"),
    review:c.review,raja:wAt(sc,"review","Raja"),aids:wAt(sc,"review","automated aids"),busy:c.busy,longtime:wAt(sc,"busy","right for a long time"),
    stop:wAt(sc,"busy","stop checking"),above:wAt(sc,"busy","above all"),experts:c.experts,exp:wAt(sc,"experts","experts too"),training:wAt(sc,"experts","training alone"),
    routine:c.routine,mars:wAt(sc,"routine","orbiting Mars"),feel:wAt(sc,"routine","feel routine"),planned:c.planned,nine:wAt(sc,"planned","nine advisers"),
    needed:c.needed,twelve:wAt(sc,"needed","twelve"),seven:wAt(sc,"needed","seven hundred and twenty"),call:wAt(sc,"needed","never had their call")}));
  const cal=(x,tt)=>fu_calendar(x,530,150,{w:400,turn:clamp((tt-0.3)/3.4*10,0,10),ticks:clamp((tt-P.right+0.2)/2.6*10,0,10)});
  const dust=fu_fin(t,P.stopped,2.2);
  const sh=[
    // Jun's desk: the calendar turning, a tick on every month; the evidence folder, closed, gathering dust; the chat, and the doubt let go
    {at:0,place:"fuData",keys:[[0,960,520,1.04]],push:0.03,draw:(x,tt)=>{
      cal(x,tt);fu_agent(x,tt,{core:0.75,think:0.1});const typing=tt<P.chat-0.3||tt>P.go+0.4;
      fu_junDesk(x,tt,{gaze:typing?[3,2]:[5,-2],folder:{dust:fu_fin(tt,P.stopped,2.2)},smile:0.35});ag_roomLight(x,1);
      const up=ag_sine((tt-P.go)/1.6),ca=1-up;
      fu_chat(x,720,630-up*44,440,"Anil Kurian","The advisers' lists look long this term.",{a:fu_fin(tt,P.wrote,0.5)*ca,k:ag_spr(tt,P.wrote,0.7)});
      fu_chat(x,1190,650-up*44,420,"Jun","The agent checked its source",{tick:true,a:fu_fin(tt,P.replied,0.5)*ca,k:ag_spr(tt,P.replied,0.7)});}},
    // the 2010 review: a person at a desk with an aid that's been right a long time; busy, their eyes leave it; an expert does the same;
    // training, hung between them, changes nothing
    {at:P.review-0.4,place:"fuQuiet",keys:[[P.review-0.4,960,540,1.04],[P.review-0.3,960,540,1.0]],d:12,draw:(x,tt)=>{
      const sw=ag_tw(x,"Parasuraman and Manzey",{w:700,size:30})+ag_tw(x,"2010",{w:500,size:30})+92;fu_source(x,960-sw/2,100,"Parasuraman and Manzey","2010",fu_fin(tt,P.review,0.5));
      const busy=ag_sine((tt-P.above)/1.0),busy2=ag_sine((tt-P.exp-0.2)/1.0),n=clamp((tt-P.longtime)/2.2*6,0,6);
      ag_desk(x,150,860,640,{});ag_desk(x,1130,860,640,{});
      ag_person(x,FU_AID_PEOPLE.p1,420,610,0.56,{t:tt,cut:790,gaze:busy>0.5?[2,4]:[5,0],nod:0.05*busy});
      ag_person(x,FU_AID_PEOPLE.p2,1500,610,0.56,{t:tt+1.3,flip:true,cut:790,gaze:busy2>0.5?[2,4]:[5,0],nod:0.05*busy2,a:fu_fin(tt,P.exp-0.6,0.6)});
      fu_aid(x,580,662,{n,a:fu_fin(tt,P.raja,0.6)});fu_aid(x,1190,662,{n:clamp((tt-P.exp)/1.2*6,0,6),a:fu_fin(tt,P.exp-0.4,0.6)});
      ag_roomLight(x,1);
      fu_mobile(x,lerp(80,470,busy),806,busy);fu_papers(x,lerp(60,330,busy),818,4,busy);
      fu_mobile(x,lerp(1840,1450,busy2),806,busy2);fu_papers(x,lerp(1860,1590,busy2),818,4,busy2);
      fu_tag(x,960,330,"training",{a:fu_fin(tt,P.training-0.2,0.5),sway:0.06*Math.sin((tt-P.training)*2.4)*ag_in(tt,P.training,0.4),len:140});}},
    // back at Jun's desk: like the thirty years of the opening, a run of ticks along the skirting, under the calendar's
    {at:P.routine-0.4,place:"fuData",keys:[[P.routine-0.4,960,520,1.04],[P.routine-0.3,960,520,1.0]],d:3,draw:(x,tt)=>{
      cal(x,tt);const tk=fu_fin(tt,P.mars-0.2,0.4)*(1-fu_fin(tt,P.feel+0.8,0.8));if(tk>0)withA(x,tk,()=>{for(let i=0;i<30;i++){const k=clamp((tt-P.mars-i*0.04)/0.3,0,1);if(k>0)ag_tick(x,120+i*57,640,18*ag_eo(k),rgba(AG.green,1),3.4);}});
      fu_agent(x,tt,{core:0.75,think:0.1});fu_junDesk(x,tt,{gaze:[3,2],folder:{dust:1},smile:0.35});ag_roomLight(x,1);}},
    // the end of the term at the Faculty of Health: nine advisers planned; three more needed; 720 students without their call
    {at:P.planned-0.4,place:"fuFaculty",keys:[[P.planned-0.4,960,540,1.04],[P.planned-0.3,960,540,1.0]],d:8,draw:(x,tt)=>{
      const am=fu_fin(tt,P.seven-0.2,0.9);
      for(let i=0;i<12;i++){const ax=70+i*112;if(i<9)fu_adviser(x,ax,150,{a:fu_fin(tt,P.planned-0.4+i*0.08,0.4),label:null,list:{n:8,done:6,amber:am>0.5?2:0}});
        else fu_adviser(x,ax,150,{dashed:true,a:fu_fin(tt,P.twelve-0.1+(i-9)*0.18,0.4)});}
      fu_anilDesk(x,tt,{value:"9",unit:"advisers",t:tt,gaze:[1,-3]});ag_roomLight(x,1);
      fu_bracket(x,70,1066,446,"9 advisers",{a:fu_fin(tt,P.nine-0.2,0.4),p:clamp((tt-P.nine+0.2)/0.8,0,1)});
      fu_bracket(x,1078,1402,446,"12 needed",{a:fu_fin(tt,P.twelve,0.4),p:clamp((tt-P.twelve)/0.8,0,1),col:AG.amber});
      ag_pill(x,736,580,"720 students · no call",{col:AG.amber,a:am});}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);
  fu_when(ctx,"Early in the term",null,fu_fin(t,P.chat-0.2,0.5)*(1-fu_fin(t,P.review-0.6,0.4)));
  fu_when(ctx,"End of term","Faculty of Health",fu_fin(t,P.planned-0.2,0.5)*(1-fu_fin(t,sc.dur-0.6,0.4)));});

// ---- 5 · One word, two meanings: 2,880 people on the lists; the table counted full-time equivalents; neither asked; the check closed its
// own circle; the record of what the agent's hands did said it all along ----
scene("meanings",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    counted:c.counted,anil:wAt(sc,"counted","Anil counted"),lists:wAt(sc,"counted","the advisers' lists"),n2880:wAt(sc,"counted","two thousand"),
    load:c.load,from:wAt(sc,"load","student load"),reports:wAt(sc,"load","reports to the government"),half:c.half,two:wAt(sc,"half","two half-time"),
    one:wAt(sc,"half","count as one"),studies:wAt(sc,"half","half the faculty"),fte:c.fte,said:wAt(sc,"fte","the table said"),ftes:wAt(sc,"fte","full-time equivalents"),
    notp:wAt(sc,"fte","not people"),meant:c.meant,jm:wAt(sc,"meant","Jun meant"),took:wAt(sc,"meant","the agent took"),neither:c.neither,
    people:c.people,say:wAt(sc,"people","say it back"),ask:wAt(sc,"people","or ask"),study:c.study,less:wAt(sc,"study","do this less"),
    presume:wAt(sc,"study","presume"),same:c.same,compared:wAt(sc,"same","compared its total"),passed:wAt(sc,"same","so it passed"),
    record:c.record,hands:wAt(sc,"record","what its hands did"),along:wAt(sc,"record","all along"),added:wAt(sc,"record","full-time equivalents")}));
  const SC={x:960,y:520,z:1.04};
  const sh=[
    // the end of the term: Anil counts the nine lists, 2,880; the agent said 2,160; the gap, 720
    {at:0,place:"fuFaculty",keys:[[0,960,540,1.04]],push:0.03,draw:(x,tt)=>{
      for(let i=0;i<12;i++){const ax=70+i*112,hl=ag_io(tt,P.lists+i*0.18,P.lists+i*0.18+0.5,0.2);
        if(i<9)fu_adviser(x,ax,150,{label:null,list:{n:8,done:6,amber:2}});else fu_adviser(x,ax,150,{dashed:true});
        if(i<9&&hl>0)withA(x,hl*0.6,()=>{x.strokeStyle=rgba([74,80,92],0.9);x.lineWidth=3;rr(x,ax-4,146,108,266,16);x.stroke();});}
      fu_anilDesk(x,tt,{value:"9",unit:"advisers",t:tt,gaze:[1,-3]});ag_roomLight(x,1);
      fu_gapBars(x,140,560,{a:fu_fin(tt,P.n2880-0.5,0.5),p1:clamp((tt-P.n2880+0.3)/1.0,0,1),p2:clamp((tt-P.n2880-0.9)/1.0,0,1),gap:fu_fin(tt,P.n2880+1.9,0.6)});}},
    // student load, the table the agent read: its column, "students"; full-time and half-time students; each half-time pair counts as one
    {at:P.load-0.4,place:"fuQuiet",keys:[[P.load-0.4,960,470,1.04],[P.load-0.3,960,470,1.0]],d:14,draw:(x,tt)=>{
      fu_loadTable(x,300,60,1320,780,{a:fu_fin(tt,P.load-0.2,0.5),note:fu_fin(tt,P.ftes,0.6),students:clamp((tt-P.two+0.4)/1.4,0,1),labels:fu_fin(tt,P.two+0.8,0.5),
        close:clamp((tt-P.one)/1.4,0,1),sum:fu_fin(tt,P.said-0.2,0.6)});}},
    // one word in the middle, two meanings: Jun's bubble holds a person; the agent's, violet, "full-time equivalents"; nothing passes between
    {cut:true,at:P.meant-0.4,place:"fuData",keys:[[P.meant-0.4,SC.x,SC.y,SC.z]],push:0.03,draw:(x,tt)=>{
      fu_agent(x,tt,{core:0.75,think:0.3});fu_junDesk(x,tt,{gaze:[4,-3],folder:{dust:1}});ag_roomLight(x,1);
      ag_T(x,"students",760,560,{w:800,size:64,align:"center",a:fu_fin(tt,P.jm-0.4,0.5)});
      fu_bubble(x,340,292,"",{w:150,a:fu_fin(tt,P.jm,0.5),k:ag_spr(tt,P.jm,0.7),px:322,py:378,draw:(c,bx,by)=>fu_figure(c,bx,by+12,0.62,FU_STU)});
      fu_bubble(x,1150,168,"full-time equivalents",{a:fu_fin(tt,P.took,0.5),k:ag_spr(tt,P.took,0.7),px:1150,py:236,edge:AG.violet,size:30});}},
    // people check they've understood each other: "You mean…?", "Yes.", and a small tick between them
    {at:P.people-0.4,place:"fuQuiet",keys:[[P.people-0.4,960,560,1.1],[P.people-0.3,960,556,1.14]],d:5,draw:(x,tt)=>{
      ag_desk(x,560,880,800,{});ag_person(x,FU_TALK.a,640,640,0.6,{t:tt,cut:810,gaze:[5,-1],talk:ag_io(tt,P.say-0.2,P.say+0.9,0.15)*0.8});
      ag_person(x,FU_TALK.b,1280,640,0.6,{t:tt+1.1,flip:true,cut:810,gaze:[5,-1],nod:0.05*Math.sin(clamp((tt-P.ask+0.2)/0.9,0,1)*Math.PI*2),talk:ag_io(tt,P.ask,P.ask+0.6,0.15)*0.7});ag_roomLight(x,1);
      fu_say(x,690,250,260,"You mean…?",{title:true,tail:{side:"bottom",at:0.2,px:700,py:430},a:fu_fin(tt,P.say-0.3,0.4),k:ag_spr(tt,P.say-0.3,0.7)});
      fu_say(x,1010,330,170,"Yes.",{title:true,tail:{side:"bottom",at:0.8,px:1210,py:470},a:fu_fin(tt,P.ask-0.1,0.4),k:ag_spr(tt,P.ask-0.1,0.7)});
      const tk=clamp((tt-P.ask-0.5)/0.4,0,1);if(tk>0)ag_tick(x,960,520,40*ag_eo(tk),rgba(AG.green,1),6);}},
    // the 2024 study: the agent goes straight to its answer, past the place where its question would have gone
    {at:P.study-0.4,place:"fuData",keys:[[P.study-0.4,SC.x,SC.y,SC.z]],push:0.03,draw:(x,tt)=>{
      const go=clamp((tt-P.less)/1.6,0,1);fu_agent(x,tt,{core:0.8,think:0.3+0.4*ag_io(tt,P.less-0.4,P.presume+1.2,0.5)});fu_junDesk(x,tt,{gaze:[4,-2],folder:{dust:1}});ag_roomLight(x,1);
      const ph=fu_fin(tt,P.study+0.6,0.6);if(ph>0)withA(x,ph,()=>{x.save();x.setLineDash([9,8]);x.strokeStyle=rgba(AG.mut,0.7);x.lineWidth=2.6;rr(x,700,470,170,72,36);x.stroke();x.restore();
        ag_T(x,"?",785,518,{w:800,size:36,align:"center",col:AG.mut,a:0.8});});
      const path=[990,410,880,470,760,560,740,396];if(go>0)fu_dots(x,path,0,ag_sine(go),{n:44,r:3.4,color:rgba(AG.violet,0.8)});
      fu_answer(x,520,150,{a:fu_fin(tt,P.less+1.4,0.4),k:ag_spr(tt,P.less+1.4,0.8)});
      const sw=fu_source(x,72,60,"Shaikh and colleagues","2024",fu_fin(tt,P.study,0.5));}},
    // the check compared the total with the same table: a closed circle, and the pill passed
    {cut:true,at:P.same-0.4,place:"fuQuiet",keys:[[P.same-0.4,960,500,1.04],[P.same-0.3,960,500,1.0]],d:5,draw:(x,tt)=>{
      fu_answer(x,240,300,{a:fu_fin(tt,P.same-0.3,0.5)});fu_table(x,1200,240,480,300,{a:fu_fin(tt,P.same,0.5),note:1,noteCol:AG.mut});
      const lp=clamp((tt-P.compared)/1.8,0,1);if(lp>0){const top=[700,330,860,200,1060,200,1196,300],bot=[1240,560,1080,700,820,700,640,560];
        fu_line(x,top,0,ag_sine(Math.min(1,lp*2)),{color:rgba(AG.ink,0.6),lw:5});if(lp>0.5)fu_line(x,bot,0,ag_sine(lp*2-1),{color:rgba(AG.ink,0.6),lw:5});
        if(lp>0.45){const q=ag_bz(top,1);ag_arrowHead(x,q[0],q[1],0.62,15,rgba(AG.ink,0.65));}if(lp>=1){const q=ag_bz(bot,1);ag_arrowHead(x,q[0],q[1],-2.4,15,rgba(AG.ink,0.65));}}
      fu_check(x,950,450,fu_fin(tt,P.passed-0.2,0.5));}},
    // Jun opens the evidence at last: what the agent's hands did, line by line; "full-time equivalents" washes amber
    {at:P.record-0.4,place:"fuData",keys:[[P.record-0.4,900,500,1.08],[P.record-0.3,900,498,1.1]],d:6,draw:(x,tt)=>{
      const op=ag_sine((tt-P.record+0.1)/0.9);fu_junDesk(x,tt,{gaze:[5,-3],folder:{dust:1-op,open:op},smile:0.2});ag_roomLight(x,1);
      const rise=ag_sine((tt-P.hands+0.3)/1.0),am=fu_fin(tt,P.added-0.2,0.8);
      x.save();x.translate(0,(1-rise)*500);const r=fu_answer(x,520,110,{a:fu_fin(tt,P.hands-0.3,0.4),open:clamp((tt-P.hands-0.6)/1.4,0,1),side:"right",ew:400,amber:am});x.restore();
      ag_label(x,1000,82,"What its hands did",{col:AG.kick,a:fu_fin(tt,P.hands+0.6,0.5)});
      if(am>0){x.save();x.translate(0,(1-rise)*500);fu_evHighlight(x,r.items[0],0,FU_EV.fte[0].title,"(full-time equivalents)",400,am);fu_evHighlight(x,r.items[1],1,FU_EV.fte[1].title,"“students”,",400,am);x.restore();}}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);
  fu_when(ctx,"End of term","Faculty of Health",fu_fin(t,0.4,0.5)*(1-fu_fin(t,P.load-0.6,0.4)));});

// ---- 6 · Knowing, not feeling: the board's lesson; Jun's team's three changes, each beside Odyssey's ----
scene("knowing",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    board:c.board,plainly:wAt(sc,"board","plainly"),happen:wAt(sc,"board","mistakes happen"),catch:wAt(sc,"board","catch them"),
    three:c.three,things:wAt(sc,"three","three things"),ody:wAt(sc,"three","Odyssey's team"),
    say:c.say,said:wAt(sc,"say","hear it said back"),unit:wAt(sc,"say","names its unit"),reads:wAt(sc,"say","reads the question back"),before:wAt(sc,"say","before it counts"),
    check:c.check,didnt:wAt(sc,"check","didn't make"),list:wAt(sc,"check","own list"),hands:c.hands,read:wAt(sc,"hands","read what its hands did"),only:wAt(sc,"hands","not only"),
    log:c.log,write:wAt(sc,"log","Write every doubt"),owner:wAt(sc,"log","with an owner"),answered:wAt(sc,"log","answered"),
    decides:c.decides,person:wAt(sc,"decides","a person decides"),tick:wAt(sc,"decides","the agent's tick"),ref:wAt(sc,"decides","only for reference")}));
  // three columns, 80 px in from each side: Jun's team's three changes, each under the change of Odyssey's it follows
  const COL=[355,975,1580],L=[80,680,1320],win=[P.say-0.3,P.check-0.3,P.log-0.3,P.ref+0.6],CY=[210,252,224],
    CH=["Say it, hear it back","Check against something else","Every doubt has an owner"],AT=[P.say,P.check,P.log];
  // the column being said is lit; the others wait, dimmed, until all three stand together at the end
  const lit=(i,tt)=>{if(tt<win[0])return 1;if(tt>=win[3])return lerp(0.42,1,fu_fin(tt,win[3],0.8));return lerp(0.42,1,fu_fin(tt,win[i],0.5)*(1-fu_fin(tt,win[i+1],0.5)));};
  // "three things": a numbered place for each, waiting, until its change is said into it
  const slot=(x,tt,i)=>{const a=fu_fin(tt,P.things-0.1+i*0.3,0.4)*(1-fu_fin(tt,AT[i]-0.1,0.4));if(a<=0.01)return;const w=ag_tw(x,CH[i],{w:800,size:34})+64;
    x.save();x.globalAlpha*=a;ag_about(x,COL[i],CY[i]+37,lerp(0.7,1,ag_spr(tt,P.things-0.1+i*0.3,0.7)));x.setLineDash([9,8]);x.strokeStyle=rgba(AG.mut,0.55);x.lineWidth=2.4;
    rr(x,COL[i]-w/2,CY[i],w,74,20);x.stroke();x.setLineDash([]);ag_T(x,String(i+1),COL[i],CY[i]+50,{w:800,size:36,align:"center",col:AG.mut});x.restore();};
  const sh=[
    // NASA's review board, on the wall where 1999 was drawn: mistakes happen; checks are there to catch them
    {at:0,place:"fuWall",keys:[[0,960,520,1.04]],push:0.03,draw:(x,tt)=>{
      withA(x,0.35,()=>fu_room99(x,tt,{empty:true,craft:null,real:0,orbits:0}));
      fu_quote(x,960,500,"Mistakes happen; checks are there to catch them.","NASA review board, 1999",{a:fu_fin(tt,P.board+0.2,0.6),k:ag_spr(tt,P.board+0.2,0.8)});}},
    // the board: Odyssey's changes along the top, small; Jun's team's under each, with what it looks like at the university
    {at:P.three-0.5,place:"fuQuiet",keys:[[P.three-0.5,960,540,1.04],[P.three-0.4,960,540,1.0]],d:30,push:0.012,draw:(x,tt)=>{
      const oa=k=>fu_fin(tt,P.ody-0.2+k*0.3,0.5),ok=k=>ag_spr(tt,P.ody-0.2+k*0.3,0.7);for(let i=0;i<3;i++)withA(x,lit(i,tt),()=>slot(x,tt,i));
      // 1 · both units on every hand-off: say it, hear it back. Every count names its unit; the agent reads the question back, and waits
      withA(x,lit(0,tt),()=>{fu_blueCard(x,COL[0],120,"Both units on every hand-off",{a:oa(0),k:ok(0),size:28});
        fu_changeCard(x,COL[0],CY[0],CH[0],{a:fu_fin(tt,P.say-0.1,0.5),k:ag_spr(tt,P.say-0.1,0.7)});
        fu_unitCard(x,L[0],316,550,"Census day","people, each counted once",{a:fu_fin(tt,P.unit-0.6,0.5),unitA:fu_fin(tt,P.unit,0.5)});
        fu_unitCard(x,L[0],434,550,"Student load","full-time equivalents",{a:fu_fin(tt,P.unit-0.3,0.5),unitA:fu_fin(tt,P.unit+0.3,0.5)});
        fu_miniAgent(x,L[0]+70,650,0.6,{a:fu_fin(tt,P.reads-0.4,0.5),t:tt,think:0.5});
        ag_textCard(x,L[0]+156,570,394,{sub:"Students in the Faculty of Health, each person counted once?"},{a:fu_fin(tt,P.reads,0.5),k:ag_spr(tt,P.reads,0.7),edge:AG.violet,tail:{side:"left",at:0.5,px:L[0]+124,py:640}});});
      // 2 · critical numbers checked independently, a second way to find the craft: check against something else. The old answer against
      // the faculty's own list shows the gap at once; and read what its hands did
      withA(x,lit(1,tt),()=>{fu_blueCard(x,COL[1],120,"Every critical number checked independently",{a:oa(1),k:ok(1),size:28});
        fu_blueCard(x,COL[1],178,"A second way to find the craft",{a:oa(1),k:ok(1),size:28});
        fu_changeCard(x,COL[1],CY[1],CH[1],{a:fu_fin(tt,P.check-0.1,0.5),k:ag_spr(tt,P.check-0.1,0.7)});
        fu_countMini(x,L[1],352,206,"Answer","2,160","students",{kick:true,a:fu_fin(tt,P.didnt-0.4,0.5)});
        fu_countMini(x,L[1]+256,352,334,"The faculty's own list","2,880","people",{a:fu_fin(tt,P.list-0.3,0.5),k:ag_spr(tt,P.list-0.3,0.7)});
        fu_notEquals(x,L[1]+231,425,fu_fin(tt,P.list+0.6,0.4));ag_T(x,"720",L[1]+231,536,{w:800,size:32,align:"center",col:AG.amber,a:fu_fin(tt,P.list+0.9,0.4)});
        fu_recordMini(x,COL[1]-280,560,560,{a:fu_fin(tt,P.read-0.3,0.5),amber:fu_fin(tt,P.read+0.4,0.6),finger:clamp((tt-P.read)/2.2,0,1)});});
      // 3 · the emails of 1999, gathered at last into one page: every doubt has an owner. The team's log; a person decides
      withA(x,lit(2,tt),()=>{const gather=ag_sine((tt-P.write)/1.2);for(let i=0;i<4;i++){const ex=lerp(COL[2]-195+i*130,COL[2],gather);fu_envelope(x,ex,150,0.62,{a:oa(2)*(1-gather),rot:(i%2?0.05:-0.05),label:["Apr","May","Jun","Jul"][i],deco:true});}
        if(gather>0)fu_sheet(x,COL[2]-70,104,140,92,{a:gather,draw:(c,sx,sy,sw,sh)=>{for(let k=0;k<4;k++){c.fillStyle=rgba(AG.mut,0.35);c.fillRect(sx+16,sy+16+k*17,(sw-32)*(k===3?0.5:0.9),6);}}});
        fu_changeCard(x,COL[2],CY[2],CH[2],{a:fu_fin(tt,P.log-0.1,0.5),k:ag_spr(tt,P.log-0.1,0.7)});
        fu_log(x,L[2],330,520,{a:fu_fin(tt,P.write-0.2,0.5),row:fu_fin(tt,P.owner-0.5,0.5),answered:fu_fin(tt,P.answered,0.5)});
        fu_decision(x,L[2],566,520,{a:fu_fin(tt,P.person-0.4,0.5),k:ag_spr(tt,P.person-0.4,0.7),initials:clamp((tt-P.person)/0.9,0,1),grey:fu_fin(tt,P.tick+0.2,0.8)});});}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);});

// ---- 7 · Feeling sure is not knowing: this term the agent reads the question back, counts 2,880, the faculty's list agrees; twelve
// advisers; what makes us feel we understand; Odyssey, still at work; an answer you can plan on ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    again:c.again,asks:wAt(sc,"again","asks again"),reads:wAt(sc,"again","reads it back"),q:wAt(sc,"again","students in the Faculty"),
    yes:c.yes,counts:c.counts,n2880:wAt(sc,"counts","two thousand"),agrees:wAt(sc,"counts","own list agrees"),twelve:c.twelve,plans:wAt(sc,"twelve","twelve advisers"),
    every:wAt(sc,"twelve","every student"),fluent:c.fluent,fa:wAt(sc,"fluent","A fluent answer"),tick:wAt(sc,"fluent","a green tick"),run:wAt(sc,"fluent","a long run"),
    feel:wAt(sc,"fluent","make us feel"),anyway:c.anyway,still:wAt(sc,"anyway","still at work"),years:wAt(sc,"anyway","twenty years later"),
    plan:c.plan,on:wAt(sc,"plan","plan on"),take:c.takeaway,br:c.breath}));
  const T={ask:P.asks,read:P.yes+0.5,query:P.yes+1.3,check:P.counts-0.2,done:P.counts+0.4};
  const sh=[
    // this term: Jun asks again; the agent reads the question back, and waits; "Yes."; its hands, the data back, the check. The agent
    // comes in once the board has gone (as the chapters crossed, it showed both here and on the board)
    {at:0,place:"fuData",keys:[[0,960,520,1.04]],push:0.03,draw:(x,tt)=>{
      fu_agentAt(x,tt,T,{think:0.15,a:ag_in(tt,0.8,0.5)});fu_junDesk(x,tt,{gaze:tt<P.reads?[4,-1]:[6,-2],smile:0.4,talk:ag_talk(sc,"yes",tt)*0,folder:{dust:0}});ag_roomLight(x,1);
      ag_textCard(x,500,92,560,{sub:"Students in the Faculty of Health, each person counted once?"},{a:fu_fin(tt,P.reads,0.5)*(1-fu_fin(tt,P.counts-0.6,0.4)),k:ag_spr(tt,P.reads,0.7),edge:AG.violet,tail:{side:"right",at:0.85,px:1000,py:330}});
      fu_bubble(x,330,292,"Yes.",{a:fu_fin(tt,P.yes,0.4)*(1-fu_fin(tt,P.counts-0.6,0.4)),k:ag_spr(tt,P.yes,0.7),px:322,py:378,w:150});}},
    // 2,880 people, and the faculty's own list beside it: the same; a green tick; Jun's initials
    {cut:true,at:P.counts-0.3,place:"fuData",keys:[[P.counts-0.3,632,380,1.52],[P.counts-0.2,632,378,1.55]],d:5,draw:(x,tt)=>{
      // the frame's edge cuts the ring before its Act step; the agent steps back as the faculty's list comes in
      fu_agentAt(x,tt,T,{think:0.15,a:1-0.45*fu_fin(tt,P.agrees-0.5,0.8)});fu_junDesk(x,tt,{gaze:[5,-3],smile:0.5,folder:{dust:0}});ag_roomLight(x,1);
      const r=fu_answer(x,330,130,{v:"people",a:fu_fin(tt,P.n2880-0.2,0.5),k:ag_spr(tt,P.n2880-0.2,0.8)});
      fu_facList(x,860,140,{w:330,h:200,lines:2,a:fu_fin(tt,P.agrees-0.5,0.5),k:ag_spr(tt,P.agrees-0.5,0.7)});
      fu_equals(x,815,250,fu_fin(tt,P.agrees+0.1,0.4));const tk=clamp((tt-P.agrees-0.4)/0.4,0,1);if(tk>0)ag_tick(x,1140,296,34*ag_eo(tk),rgba(AG.green,1),5);
      fu_initials(x,r.card.x+r.card.w-96,r.card.y+96,clamp((tt-P.agrees-1.0)/0.9,0,1),{s:0.8});}},
    // twelve advisers, a list of 240 each; every name ticked, list by list
    {at:P.twelve-0.5,place:"fuFaculty",keys:[[P.twelve-0.5,960,540,1.04],[P.twelve-0.4,960,540,1.0]],d:6,draw:(x,tt)=>{
      for(let i=0;i<12;i++)fu_adviser(x,70+i*112,150,{a:fu_fin(tt,P.twelve-0.4+i*0.06,0.4),list:{n:6,done:6,p:clamp((tt-P.every)/0.5-i*0.22,0,1)}});
      fu_anilDesk(x,tt,{value:"12",unit:"advisers",t:tt,gaze:[1,-3],smile:0.5});ag_roomLight(x,1);
      fu_bracket(x,70,1402,500,"12 advisers",{a:fu_fin(tt,P.plans-0.2,0.4),p:clamp((tt-P.plans+0.2)/0.8,0,1)});}},
    // what makes us feel we understand: a fluent answer, a green tick, a long run of success; a soft glow round them
    {at:P.fluent-0.5,place:"fuQuiet",keys:[[P.fluent-0.5,960,500,1.04],[P.fluent-0.4,960,500,1.0]],d:5,draw:(x,tt)=>{
      const up=(t0)=>[fu_fin(tt,t0-0.2,0.6),(1-ag_eo(clamp((tt-t0+0.2)/1.0,0,1)))*70];const gl=fu_fin(tt,P.feel,1.2);ag_about(x,960,420,1.18);
      let [a1,d1]=up(P.fa);x.save();x.translate(0,d1);const b=fu_answer(x,236,300,{a:0});fu_glow(x,b.card,gl*a1);fu_answer(x,236,300,{a:a1});x.restore();
      let [a2,d2]=up(P.tick);x.save();x.translate(0,d2);if(a2>0)withA(x,a2,()=>{fu_glow(x,{x:790,y:390,w:340,h:76},gl);fu_check(x,960,428,1);});x.restore();
      let [a3,d3]=up(P.run);x.save();x.translate(0,d3);if(a3>0)withA(x,a3,()=>{const cb=fu_calendar(x,1290,290,{w:400,ticks:10,a:0});fu_glow(x,cb,gl);fu_calendar(x,1290,290,{w:400,ticks:10});});x.restore();}},
    // Odyssey's team checked anyway: Odyssey in its ring round Mars, 2001 turning to 2021
    {at:P.anyway-0.5,place:"fuWall",keys:[[P.anyway-0.5,1200,230,2.2],[P.anyway-0.4,1210,228,2.3]],d:5,draw:(x,tt)=>{
      const th=(tt-P.anyway)*0.9;fu_room99(x,tt,{empty:true,craft:null,real:0,orbits:0,odyssey:{th,a:1,s:0.46}});fu_orbit(x,FU_SPACE.plan,"front",1,rgba(FU.graphite,0.7),[3,9]);
      const M=FU_SPACE.mars,yr=tt<P.years?"2001":(tt<P.years+1.2?String(2001+Math.floor((tt-P.years)/1.2*20)):"2021");
      ag_pill(x,M[0],M[1]+M[2]+108,yr,{size:30,a:fu_fin(tt,P.anyway,0.5)});ag_T(x,"still at work",M[0],M[1]+M[2]+168,{w:700,size:28,align:"center",col:AG.green,a:fu_fin(tt,P.still-0.2,0.5)});}},
    // an answer you can plan on: "Advisers next term: 12", and Anil nods
    {at:P.plan-0.5,place:"fuFaculty",keys:[[P.plan-0.5,1371,600,1.75],[P.plan-0.4,1371,598,1.78]],d:4,draw:(x,tt)=>{
      for(let i=0;i<12;i++)fu_adviser(x,70+i*112,150,{list:{n:6,done:6}});const nd=Math.sin(clamp((tt-P.on)/1.2,0,1)*Math.PI*2)*0.06;
      fu_anilDesk(x,tt,{value:"12",unit:"advisers",t:tt,nod:nd,smile:0.6,gaze:[2,1]});ag_roomLight(x,1);}},
    // the frame clears to the marble wall
    {at:P.take-0.6,place:"fuQuiet",keys:[[P.take-0.6,960,540,1.0]],push:0,draw:()=>{}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);
  fu_when(ctx,"This term",null,fu_fin(t,0.4,0.5)*(1-fu_fin(t,P.counts-0.6,0.4)));
  ag_end(ctx,S,t,P.take-0.4,"It feels like understanding","Feeling sure is not knowing.","Film 4 of 10");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["right", "meanings"]);

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
