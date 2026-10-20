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

// Master and reference data · Kept, not cleaned. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"river":{"name":"Kept, every dry season","lead":1.6,"tail":1.0,"vo":[
 {"id":"split","gap":0.8,"text":"Around 256 BC, in what is now Sichuan, the governor Li Bing split the Min River in two, without a dam, to water the Chengdu plain.","say":"Around two fifty-six B C, in what is now Sichuan, the governor Li Bing split the Min River in two, without a dam, to water the Chengdu plain."},
 {"id":"gravel","gap":0.8,"text":"Its shape sends most of the river's gravel down the outer channel."},
 {"id":"dry","gap":0.8,"text":"And every dry season, the inner channel is closed off and dug out, down to a mark buried in its bed."},
 {"id":"mark","gap":0.8,"text":"Stone horses, it's said, at first, and later iron bars."},
 {"id":"rule","gap":0.8,"text":"Its rule is six characters long: dig the riverbed deep, keep the weir low."},
 {"id":"still","gap":0.8,"text":"More than two thousand years later, it still waters the plain."},
 {"id":"kept","gap":0.8,"text":"It wasn't cleaned out once and left. It's kept, every year."}]},
"cleanup":{"name":"The clean-up","lead":1.0,"tail":1.0,"vo":[
 {"id":"merged","gap":0.8,"text":"At the university, in 2024, a clean-up project merged two thousand duplicate records of people.","say":"At the university, in twenty twenty-four, a clean-up project merged two thousand duplicate records of people."},
 {"id":"team","gap":0.8,"text":"It took a team of four, for six months, and it finished on time."},
 {"id":"gone","gap":0.8,"text":"For a while, the duplicates were gone."}]},
"return":{"name":"Back, intake by intake","lead":0.8,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"A year later, there were eleven hundred new ones."},
 {"id":"every","gap":0.8,"text":"Every intake made more."},
 {"id":"why","gap":0.8,"text":"Graduates came back to study, and people applied through two routes, each giving them a new number."},
 {"id":"linh","gap":0.8,"text":"Linh's second number, in July 2025, was one of them.","say":"Linh's second number, in July twenty twenty-five, was one of them."},
 {"id":"fixed","gap":0.8,"text":"The clean-up fixed the records. It didn't change how they were made."}]},
"entry":{"name":"Stopped at the door","lead":0.8,"tail":1.0,"vo":[
 {"id":"search","gap":0.8,"text":"In 2026, the application started searching before it creates a person.","say":"In twenty twenty-six, the application started searching before it creates a person."},
 {"id":"match","gap":0.8,"text":"A clear match adds a role to someone already known. A likely one goes to Mei's queue."},
 {"id":"fell","gap":0.8,"text":"New duplicates fell under fifty an intake, and stayed there."},
 {"id":"shape","gap":0.8,"text":"Like the river's shape, the search keeps most of them out. Mei's queue digs out the rest."}]},
"measures":{"name":"The steward's iron bars","lead":0.8,"tail":1.0,"vo":[
 {"id":"process","gap":0.8,"text":"So keeping the person right isn't a project that ends. It's everyday work."},
 {"id":"bars","gap":0.8,"text":"Mei's office has its own iron bars: five measures, each with a limit."},
 {"id":"dups","gap":0.6,"text":"New duplicates per intake."},
 {"id":"oldest","gap":0.6,"text":"How long the queue's oldest case has waited."},
 {"id":"roles","gap":0.6,"text":"Roles past their end date, like a tutor whose term contract ended, but who's still active."},
 {"id":"source","gap":0.6,"text":"Values with no source."},
 {"id":"requests","gap":0.8,"text":"And requests for what the university holds about someone, answered on time."},
 {"id":"nightly","gap":0.8,"text":"Each has a test for its limit. Every night, the platform works them out, keeps them, and shows them on a dashboard."}]},
"alert":{"name":"Past its limit","lead":0.8,"tail":1.0,"vo":[
 {"id":"monday","gap":0.8,"text":"One Monday, an alert: the oldest case had waited twelve days."},
 {"id":"waiting","gap":0.8,"text":"It was waiting for HR to confirm a birth date, one digit apart."},
 {"id":"rang","gap":0.8,"text":"Mei rang HR, and the case was decided that morning, with its reason."},
 {"id":"blame","gap":0.8,"text":"The alert pointed at a case, not at a person to blame."}]},
"agent":{"name":"Proposed, then decided","lead":0.8,"tail":1.0,"vo":[
 {"id":"list","gap":0.8,"text":"Lists from outside change too. This year, the government's list of visa types added one."},
 {"id":"draft","gap":0.8,"text":"An agent drafted how it maps to the university's fee categories, with its evidence, as a change to the list."},
 {"id":"owner","gap":0.8,"text":"The list's owner, the admissions office, checked it and approved it."},
 {"id":"decides","gap":0.8,"text":"The agent proposes. The owner decides."}]},
"scorecard":{"name":"On the scorecard","lead":0.8,"tail":1.0,"vo":[
 {"id":"yusuf","gap":0.8,"text":"Yusuf, who leads data governance, reads the same measures on his scorecard, beside every other domain's."},
 {"id":"three","gap":0.8,"text":"Owners, limits, and a way to change them: the person now has all three."}]},
"elsewhere":{"name":"Elsewhere","lead":0.8,"tail":1.0,"vo":[
 {"id":"bank","gap":0.8,"text":"Every industry knows this picture. A bank cleans up its customer records every three years, and the duplicates come back every time."},
 {"id":"one","gap":0.8,"text":"One check at entry ends the cycle."}]},
"kept":{"name":"Kept","lead":1.0,"tail":1.0,"vo":[
 {"id":"phd","gap":0.8,"text":"February 2027. Linh starts her PhD: a new role, on the person she already is.","say":"February twenty twenty-seven. Linh starts her PhD: a new role, on the person she already is."},
 {"id":"count","gap":0.8,"text":"That intake made thirty-eight new duplicates. She isn't one of them."},
 {"id":"spring","gap":0.8,"text":"And at Dujiangyan, every spring, when the repairs are done, the water is let back in."},
 {"id":"line","gap":0.8,"text":"Clean it once, and it decays. Keep it, and it lasts."}]}
};

const VODUR={"river/split": 9.482, "river/gravel": 3.417, "river/dry": 5.957, "river/mark": 3.263, "river/rule": 4.498, "river/still": 3.243, "river/kept": 3.289, "cleanup/merged": 6.551, "cleanup/team": 3.368, "cleanup/gone": 2.001, "return/year": 2.527, "return/every": 1.41, "return/why": 5.427, "return/linh": 3.759, "return/fixed": 3.374, "entry/search": 4.788, "entry/match": 4.936, "entry/fell": 3.275, "entry/shape": 5.003, "measures/process": 4.351, "measures/bars": 4.338, "measures/dups": 1.614, "measures/oldest": 2.298, "measures/roles": 5.607, "measures/source": 1.381, "measures/requests": 4.059, "measures/nightly": 6.466, "alert/monday": 3.829, "alert/waiting": 3.91, "alert/rang": 4.21, "alert/blame": 3.042, "agent/list": 5.322, "agent/draft": 6.501, "agent/owner": 3.163, "agent/decides": 2.539, "scorecard/yusuf": 6.392, "scorecard/three": 4.257, "elsewhere/bank": 8.041, "elsewhere/one": 2.01, "kept/phd": 6.246, "kept/count": 3.792, "kept/spring": 4.849, "kept/line": 2.967};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the river in spring, then the title; the steward's five measures, settled; and the end card. */
const BREATH={
"river":{"hold":{"split":0.6,"gravel":0.6,"dry":0.6,"mark":0.8,"rule":0.9,"still":0.4},"breathe":4.6},
"cleanup":{"hold":{"merged":0.5,"team":0.6}},
"return":{"hold":{"year":0.6,"every":0.3,"why":0.6,"linh":0.9}},
"entry":{"hold":{"search":0.5,"match":0.7,"fell":0.8}},
"measures":{"hold":{"process":0.5,"bars":0.6,"dups":0.4,"oldest":0.4,"roles":0.5,"source":0.3,"requests":0.5},"breathe":2.0},
"alert":{"hold":{"monday":0.6,"waiting":0.5,"rang":0.7}},
"agent":{"hold":{"list":0.6,"draft":0.8,"owner":0.5}},
"scorecard":{"hold":{"yusuf":0.8}},
"elsewhere":{"hold":{"bank":0.6}},
"kept":{"hold":{"phd":0.9,"count":0.8,"spring":0.9},"breathe":5.0}
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

/* ===== When things go wrong · Silent change: this episode's components =====
   Drawn with the first film's style (glass, luminous edges, one typeface) and the series' characters (people.js). */
// SCENES, cue(), scene(), the sketch's ink (SK) and the diagram components (entBox, ent, relLine, diagram) come from A Sharper Sketch's sketch3.js
const fout=(t,a,d)=>1-sstep(a,a+(d||0.6),t);
const brief=(t,a,d)=>fin(t,a,0.4)*fout(t,a+(d||3));
const AMBER=[255,190,90],GOLDC=LAYER.gold;
const mixc=(a,b,f)=>a.map((v,i)=>Math.round(v+(b[i]-v)*clamp(f,0,1)));
// packets along a lane: small glowing cells, like the cells in the vaults; those that set off after "until" never start, the rest finish their trip
function packets(ctx,t,pts,every,dur,off,col,size,al,until){const L=mk(pts);spawn(t,every,dur,off,(u,k)=>{if(until!=null&&off+k*every>until)return;const q=at(L,u),a=(al==null?1:al)*sstep(0,0.1,u)*(1-sstep(0.85,1,u));if(a<=0.01)return;
  withA(ctx,a,()=>{glow(ctx,q.x,q.y,size*1.4,col,0.45);ctx.fillStyle=rgba(col,0.95);rr(ctx,q.x-size/2,q.y-size/2,size,size,4);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.35)";rr(ctx,q.x-size/2+3,q.y-size/2+3,size*0.4,size*0.25,2);ctx.fill();});});}
function camKeys(ctx,S,keys,t){const cam=camAt(keys,t);setCam(ctx,S,cam);return cam;}
// the background of the platform world, or of a room at dawn (warm light from a window on the left)
function world(ctx,S){setScreen(ctx,S);bg2(ctx);}
function room(ctx,S,t,o){o=o||{};if(o.cam){const q=o.cam;ctx.setTransform(S*q.z,0,0,S*q.z,S*(W/2-q.x*q.z),S*(H/2-q.y*q.z));}else setScreen(ctx,S);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,o.top||"#0c1428");g.addColorStop(1,"#05080f");ctx.fillStyle=g;ctx.fillRect(-W,-H,3*W,3*H);
  const wx=o.wx==null?90:o.wx,wy=150,ww=380,wh=470;ctx.save();rr(ctx,wx,wy,ww,wh,10);ctx.clip();
  const sky=ctx.createLinearGradient(0,wy,0,wy+wh);sky.addColorStop(0,"#16264c");sky.addColorStop(0.55,"#5b4a78");sky.addColorStop(0.85,"#e0876a");sky.addColorStop(1,"#f6c37e");ctx.fillStyle=sky;ctx.fillRect(wx,wy,ww,wh);
  glow(ctx,wx+ww*0.6,wy+wh*0.95,180+10*Math.sin(t*0.4),[255,190,120],0.5);
  ctx.fillStyle="#0d1020";[[0,110,70],[60,70,120],[170,140,50],[210,90,80],[300,120,80]].forEach(([x,h2,w2])=>ctx.fillRect(wx+x,wy+wh-h2,w2,h2));
  ctx.fillStyle="rgba(255,214,150,0.8)";for(let i=0;i<14;i++){const lx=hash(i,1)*ww;if(hash(i,3)>0.5&&(lx<200||lx>330))ctx.fillRect(wx+lx,wy+wh-hash(i,2)*100,4,5);}
  ctx.restore();ctx.strokeStyle="rgba(20,26,44,0.95)";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.moveTo(wx,wy+wh*0.45);ctx.lineTo(wx+ww,wy+wh*0.45);ctx.stroke();
  glass(ctx,wx,wy,ww,wh,10,[255,200,150],{glow:24,ga:0.2,fill:"rgba(0,0,0,0)",ea:0.4});
  const spill=ctx.createRadialGradient(wx+ww*0.6,wy+wh,40,wx+ww*0.6,wy+wh,900);spill.addColorStop(0,"rgba(255,170,110,0.16)");spill.addColorStop(1,"rgba(255,170,110,0)");ctx.fillStyle=spill;ctx.fillRect(-W,-H,3*W,3*H);}
// a small clock chip, top left
function clockChip(ctx,S,s,sub,a){setScreen(ctx,S);withA(ctx,a==null?1:a,()=>{const w=28+tw(ctx,s,32,800,"mono")+(sub?18+tw(ctx,sub,20,600):0)+28;glass(ctx,64,52,w,64,18,[170,205,255],{glow:10,ea:0.5,fill:"rgba(8,14,28,0.85)"});
  T(ctx,s,92,96,{w:800,size:32,f:"mono"});if(sub)T(ctx,sub,92+tw(ctx,s,32,800,"mono")+18,94,{w:600,size:20,color:rgba(SOFT,0.95)});});}
// a message bubble: who, what, and a colour for the sender's side; typing dots before it appears
function msg(ctx,x,y,w,who,text,c,a,typing){if(a<=0.01&&!typing)return;const lines=[];ctx.save();ctx.font=font(600,26);let cur="";text.split("\n").forEach(par=>{cur="";par.split(" ").forEach(s=>{const tr=cur?cur+" "+s:s;if(ctx.measureText(tr).width>w-48&&cur){lines.push(cur);cur=s;}else cur=tr;});if(cur)lines.push(cur);});ctx.restore();
  const h=52+lines.length*36;withA(ctx,Math.max(a,typing?1:0),()=>{glass(ctx,x,y,w,typing&&a<0.5?84:h,20,c,{glow:12,ea:0.65,fill:"rgba(9,15,30,0.92)"});T(ctx,who,x+24,y+32,{w:800,size:18,color:rgba(c,0.95)});
    if(a<0.5&&typing){for(let i=0;i<3;i++){ctx.fillStyle=rgba(INK,0.4+0.5*Math.max(0,Math.sin(typing*6-i*0.8)));ctx.beginPath();ctx.arc(x+34+i*20,y+60,5,0,TAU);ctx.fill();}}
    else withA(ctx,a,()=>lines.forEach((l,i)=>T(ctx,l,x+24,y+72+i*36,{w:600,size:26})));});return h;}
// Ana's dashboard, in the style of a Databricks AI/BI dashboard: a light canvas, a header with the logo, an alert banner when the data is old,
// a counter (KPI) widget for class fill with its comparison and a capacity bar, and a bar chart of every class. No pie charts.
const DB={canvas:"#f5f6f8",card:"#ffffff",line:"#d8dee4",text:"#11171c",muted:"#5f7281",blue:"#077a9d",green:"#277c43",greenBg:"#e3f4ea",red:"#c82d4c",warn:"#8a5300",warnBg:"#fcefd9",warnLine:"#f0a33a",track:"#e8ecf0"};
function dbCard(ctx,x,y,w,h){ctx.save();ctx.shadowColor="rgba(0,0,0,0.18)";ctx.shadowBlur=10;ctx.shadowOffsetY=2;ctx.fillStyle=DB.card;rr(ctx,x,y,w,h,8);ctx.fill();ctx.restore();ctx.strokeStyle=DB.line;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,8);ctx.stroke();}
// a counter widget: title, source table, the value, a comparison, a 14-day trend, a capacity bar and places; s scales the type for small copies.
// numA fades the value and comparison (so one number can make way for another)
function kpiCard(ctx,x,y,w,h,o){o=o||{};const s=o.s||1,v=o.value==null?94:o.value,pad=20*s,shown=(o.shown||Math.round(v))+"%",nA=o.numA==null?1:o.numA,col=o.ghost?DB.red:DB.blue;
  if(h/s<250){dbCard(ctx,x,y,w,h);const bw=w-2*pad,by=y+h-pad-30*s;T(ctx,o.title||"Data Science 101",x+pad,y+pad+17*s,{w:700,size:18*s,color:DB.text});
    T(ctx,o.sub||"places filled",x+pad,y+pad+38*s,{w:500,size:15*s,color:DB.muted});withA(ctx,nA,()=>T(ctx,shown,x+pad,y+pad+90*s,{w:700,size:48*s,color:o.ghost?DB.red:DB.text}));
    ctx.fillStyle=DB.track;rr(ctx,x+pad,by,bw,10*s,5*s);ctx.fill();ctx.fillStyle=col;rr(ctx,x+pad,by,bw*Math.min(1,v/100),10*s,5*s);ctx.fill();
    T(ctx,Math.round(v*1.2)+" of 120 places",x+pad,y+h-pad,{w:500,size:16*s,color:DB.muted});return;}
  dbCard(ctx,x,y,w,h);
  T(ctx,o.title||"Places filled · Data Science 101",x+pad,y+pad+16*s,{w:700,size:19*s,color:DB.text});T(ctx,o.source||"fct_offering_fill",x+pad,y+pad+40*s,{w:500,size:14*s,f:"mono",color:DB.muted});
  withA(ctx,nA,()=>{T(ctx,shown,x+pad,y+pad+122*s,{w:700,size:78*s,color:o.ghost?DB.red:DB.text});
    if(o.delta)T(ctx,o.delta,x+pad+tw(ctx,shown,78*s,700)+16*s,y+pad+118*s,{w:700,size:17*s,color:o.deltaCol||DB.green});});
  const by=y+h-pad-44*s,bw=w-2*pad,sy0=y+pad+150*s,sy1=by-30*s;
  if(sy1-sy0>40*s){const tr=o.trend||[71,74,76,79,81,83,85,86,88,90,91,92,93,v],lo=60,hi=Math.max(100,...tr)+4,px=i=>x+pad+bw*i/(tr.length-1),py=q=>sy1-(sy1-sy0)*(q-lo)/(hi-lo);
    ctx.beginPath();tr.forEach((q,i)=>i?ctx.lineTo(px(i),py(q)):ctx.moveTo(px(i),py(q)));ctx.lineTo(px(tr.length-1),sy1);ctx.lineTo(px(0),sy1);ctx.closePath();ctx.fillStyle=o.ghost?"rgba(200,45,76,0.10)":"rgba(7,122,157,0.10)";ctx.fill();
    ctx.beginPath();tr.forEach((q,i)=>i?ctx.lineTo(px(i),py(q)):ctx.moveTo(px(i),py(q)));ctx.strokeStyle=col;ctx.lineWidth=2.5*s;ctx.stroke();
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(px(tr.length-1),py(tr[tr.length-1]),4*s,0,TAU);ctx.fill();T(ctx,"last 14 days",x+pad,sy0-4*s,{w:500,size:13*s,color:DB.muted});}
  ctx.fillStyle=DB.track;rr(ctx,x+pad,by,bw,12*s,6*s);ctx.fill();
  ctx.fillStyle=col;rr(ctx,x+pad,by,bw*Math.min(1,v/100),12*s,6*s);ctx.fill();
  if(v>100){ctx.fillStyle=DB.red;rr(ctx,x+pad+bw-4*s,by-6*s,8*s,24*s,3*s);ctx.fill();}
  ctx.strokeStyle=DB.text;ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(x+pad+bw,by-8*s);ctx.lineTo(x+pad+bw,by+20*s);ctx.stroke();
  T(ctx,o.foot||Math.round(v*1.2)+" of 120 places",x+pad,y+h-pad,{w:500,size:15*s,color:DB.muted});T(ctx,"capacity",x+pad+bw,y+h-pad,{w:500,size:13*s,align:"right",color:DB.muted});}
// a small copy of the counter, for the platform views: the data product the dashboard shows, with a gold edge for the gold layer
function kpiMini(ctx,x,y,w,h,v,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.shadowColor=rgba(GOLDC,0.7);ctx.shadowBlur=18;ctx.strokeStyle=rgba(GOLDC,0.9);ctx.lineWidth=2.5;rr(ctx,x-4,y-4,w+8,h+8,11);ctx.stroke();ctx.restore();
  kpiCard(ctx,x,y,w,h,{s:w/300,value:v||94});});}
// o.num: the value (a number, or text such as "96%"); o.banner and o.ok: the amber note and the green all-clear (0 to 1);
// o.ghost (0 to 1): the number it would have shown, had the waitlist counted
function dashboard(ctx,x,y,w,h,o){o=o||{};const num=o.num==null?94:parseFloat(o.num),g=o.ghost||0,gIn=sstep(0.45,1,g);
  // the screen: a dark bezel around a light dashboard
  glass(ctx,x-12,y-12,w+24,h+24,22,[170,205,255],{glow:18,ea:0.45,fill:"rgba(8,14,28,0.95)"});ctx.save();rr(ctx,x,y,w,h,12);ctx.clip();ctx.fillStyle=DB.canvas;ctx.fillRect(x,y,w,h);
  ctx.fillStyle=DB.card;ctx.fillRect(x,y,w,64);ctx.fillStyle=DB.line;ctx.fillRect(x,y+64,w,1.2);const lw=logo(ctx,"databricks",x+20,y+18,28);
  T(ctx,o.title||"Enrolments · census date tomorrow",x+34+lw,y+41,{w:700,size:21,color:DB.text});T(ctx,o.day||"Tuesday",x+w-22,y+40,{w:500,size:16,align:"right",color:DB.muted});
  let cy=y+84;const alert=(bg,line,col,icon,text,a)=>withA(ctx,a,()=>{ctx.fillStyle=bg;rr(ctx,x+20,cy,w-40,52,6);ctx.fill();ctx.fillStyle=line;rr(ctx,x+20,cy,6,52,3);ctx.fill();
    ctx.fillStyle=col;ctx.font=font(800,20);ctx.fillText(icon,x+40,cy+34);T(ctx,text,x+72,cy+33,{w:600,size:19,color:col});});
  // the note makes room for itself: the cards slide down as it fades in
  const room=ease(clamp((o.banner||0)+(o.ok||0),0,1));if(o.banner>0)alert(DB.warnBg,DB.warnLine,DB.warn,"⚠","Last good data: yesterday, 23:02 · a test stopped today's refresh",o.banner*(1-(o.ok||0))*sstep(0.3,1,room));
  if(o.ok>0)alert(DB.greenBg,DB.green,DB.green,"✓",o.okText||"Up to date: today, 08:40",o.ok);
  cy+=72*room;const gh=y+h-cy-20,kw=w*0.46;
  kpiCard(ctx,x+20,cy,kw,gh,{value:num,delta:o.delta||("▲ "+(Math.round(num)-92)+" pts vs last week"),foot:o.foot,numA:1-sstep(0,0.5,g)});
  if(o.flash>0)withA(ctx,o.flash,()=>{ctx.strokeStyle=DB.blue;ctx.lineWidth=3;rr(ctx,x+20,cy,kw,gh,8);ctx.stroke();});
  if(g>0){withA(ctx,g,()=>{ctx.save();ctx.fillStyle="rgba(255,255,255,0.92)";rr(ctx,x+20,cy,kw,gh,8);ctx.fill();ctx.setLineDash([10,8]);ctx.strokeStyle=DB.red;ctx.lineWidth=3;rr(ctx,x+20,cy,kw,gh,8);ctx.stroke();ctx.restore();});
    withA(ctx,gIn,()=>kpiCard(ctx,x+20,cy,kw,gh,{value:108,ghost:1,delta:"incl. waitlist",deltaCol:DB.red,foot:"130 of 120 places",trend:[71,74,76,79,81,83,85,86,88,90,91,92,94,108]}));}
  // a bar chart of every first-year unit: Data Science 101 highlighted
  const bx=x+40+kw,bwid=w-60-kw;dbCard(ctx,bx,cy,bwid,gh);T(ctx,"Places filled by unit",bx+20,cy+36,{w:700,size:19,color:DB.text});T(ctx,"first-year units · semester 2",bx+20,cy+60,{w:500,size:14,color:DB.muted});
  const rows=[["Data Science 101",num],["Statistics 110",88],["Programming 100",76],["Data Ethics 120",64]],lx=bx+20,bw2=bwid-190,rh=Math.min(56,(gh-100)/rows.length);
  const row=(n,v,i,c,vc)=>{const yy=cy+90+i*rh;T(ctx,n,lx,yy+14,{w:i?500:700,size:15,color:DB.text});ctx.fillStyle=DB.track;rr(ctx,lx,yy+22,bw2,14,4);ctx.fill();
    ctx.fillStyle=c;rr(ctx,lx,yy+22,bw2*Math.min(1,v/100),14,4);ctx.fill();if(v>100){ctx.fillStyle=DB.red;rr(ctx,lx+bw2-3,yy+17,6,24,2);ctx.fill();}T(ctx,Math.round(v)+"%",lx+bw2+14,yy+34,{w:700,size:16,color:vc||DB.text});};
  rows.forEach(([n,v],i)=>row(n,v,i,i?"#8bcae7":DB.blue));
  if(gIn>0)withA(ctx,gIn,()=>{ctx.fillStyle=DB.card;ctx.fillRect(lx-4,cy+90,bwid-36,rh-4);row("Data Science 101",108,0,DB.red,DB.red);});
  ctx.strokeStyle=DB.muted;ctx.setLineDash([4,4]);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(lx+bw2,cy+96);ctx.lineTo(lx+bw2,cy+96+rows.length*rh);ctx.stroke();ctx.setLineDash([]);
  ctx.restore();}
// a person in a video-call tile: head and shoulders, name and role
function callTile(ctx,id,x,y,w,h,o){o=o||{};const P=PEOPLE[id];glass(ctx,x,y,w,h,20,P.edge,{glow:o.hi?22:12,ea:o.hi?0.9:0.55,fill:"rgba(14,22,42,0.92)"});
  ctx.save();rr(ctx,x+3,y+3,w-6,h-6,18);ctx.clip();const s=o.s||h/190,k=s*P.build.h;person(ctx,id,x+w/2,y+h*0.52+505*k,s,{pose:"stand",expr:o.expr||"calm",t:o.t||0,glow:0.3});ctx.restore();
  withA(ctx,o.label==null?1:o.label,()=>{glass(ctx,x+12,y+h-50,tw(ctx,P.name.replace("Prof. ",""),18,700)+30,38,12,P.edge,{glow:6,ea:0.5,fill:"rgba(6,10,20,0.85)"});T(ctx,P.name.replace("Prof. ",""),x+27,y+h-25,{w:700,size:18});});}
// the quarantine tray: rows that failed a test, kept aside to be looked at
function tray(ctx,x,y,w,n,t,a){withA(ctx,a,()=>{glass(ctx,x,y,w,86,16,BAD,{glow:12,ea:0.6,fill:"rgba(40,10,14,0.55)"});T(ctx,"kept aside · "+n+" rows",x+18,y+28,{w:700,size:19,color:"rgba(255,180,170,1)"});
  for(let i=0;i<Math.min(n,15);i++){const bx=x+18+i*((w-36)/15),by=y+42+Math.sin(t*1.3+i)*2;ctx.fillStyle=rgba(AMBER,0.75);rr(ctx,bx,by,(w-36)/15-6,26,5);ctx.fill();}});}
// the lineage, as a row of steps: each step can light up as the red thread reaches it
const LIN=[["exposure","dashboard"],["fct_offering_fill","data product"],["int_offering_enrolments","joins enrolments to units"],["stg_enrolments","staging · tested"],["bronze.enrolments","as it arrived"]];
function lineage(ctx,x0,y,dx,o){o=o||{};const pts=LIN.map((_,i)=>[x0-i*dx,y]);
  ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();
  // the red thread, moving back along the lineage one step at a time
  if(o.k>0){const k=Math.min(o.k,pts.length-1),i=Math.floor(k),f=k-i,end=i<pts.length-1?[lerp(pts[i][0],pts[i+1][0],f),y]:pts[i];
    beam(ctx,[{x:pts[0][0],y},{x:end[0],y}],BAD,[[22,0.08],[9,0.22],[3,0.85],[1.5,1]]);glow(ctx,end[0],y,36,BAD,0.7);}
  pts.forEach((p,i)=>{const [n,sub]=LIN[i],bad=i===3&&o.bad,on=o.k>=i-0.05,c=bad?BAD:i===4?LAYER.bronze:i===0?GOLDC:[170,205,255];const w=Math.max(tw(ctx,n,22,700,"mono"),tw(ctx,sub,17,500))+44;
    glass(ctx,p[0]-w/2,y-48,w,96,18,c,{glow:on?22:8,ea:on?0.95:0.45,fill:"rgba(8,14,28,0.92)"});T(ctx,n,p[0],y-6,{w:700,size:22,f:"mono",align:"center"});T(ctx,sub,p[0],y+26,{w:500,size:17,align:"center",color:rgba(SOFT,0.95)});
    if(i===3){const gc=bad?BAD:GOOD;ctx.strokeStyle=rgba(gc,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p[0],y-75);ctx.lineTo(p[0],y-48);ctx.stroke();gate(ctx,p[0],y-110,70,gc,"tests");
      T(ctx,bad?"test failed":"tests pass",p[0]+42,y-104,{w:700,size:18,color:rgba(gc,1)});}});return pts;}
// the sharper conceptual model from A Sharper Sketch, drawn with that film's components: enrolment status is its own entity,
// "Status change", with a date, and it gains the new status. newA reveals "waitlisted"; hi lights the Status change box.
function sharperSketch(ctx,o){o=o||{};const E={};Object.keys(L3).forEach(k=>{E[k]={x:L3[k][0],y:L3[k][1],name:NAME[k],s:1,a:o.a==null?1:o.a};});
  E.Offering.sub="census date";E.Unit.sub="Data Science 101";E.Class.sub="Tue 9 am tutorial";E.Status.sub="status · date";
  E.Status.attrs=[["enrolled",""],["withdrawn",""],["waitlisted",""]];E.Status.attrA=(2+(o.newA||0))/3;E.Status.hi=o.hi||0;E.Status.hiCol=AMBER;
  const B=diagram(ctx,E,L3R.filter(r=>!(r[0]==="Offering"&&r[1]==="Term")).map(r=>r.concat([{}])));
  elbowRel(ctx,B.Offering,B.Term,B.Class);
  const b=B.Status,top=b.y-b.h/2,yy=top+80+28+2*30,lx=b.x-b.w/2;
  withA(ctx,o.newA||0,()=>{ctx.save();rr(ctx,lx+4,yy-26,b.w-8,34,8);ctx.clip();glow(ctx,lx+90,yy-6,70,AMBER,0.45*(o.glowNew||1));ctx.restore();
    tag(ctx,lx+b.w+14,yy-6,"new",AMBER,{size:18});});return B;}
// a one-to-many line drawn with right angles: down from Unit offering, across below it, and down into Teaching period
function elbowRel(ctx,A,B,below){const x0=A.x+A.w/2-44,y0=A.y+A.h/2,ym=(y0+(below.y-below.h/2))/2,x1=B.x,y1=B.y-B.h/2;
  ctx.save();ctx.shadowColor=rgba(SK,0.8);ctx.shadowBlur=10;ctx.strokeStyle=rgba(SK,0.95);ctx.lineWidth=2.4;ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0,ym);ctx.lineTo(x1,ym);ctx.lineTo(x1,y1);ctx.stroke();
  // many offerings (crow's foot at Unit offering), one teaching period (bar at Teaching period)
  ctx.beginPath();ctx.moveTo(x0-13,y0);ctx.lineTo(x0,y0+20);ctx.lineTo(x0+13,y0);ctx.moveTo(x1-11,y1-14);ctx.lineTo(x1+11,y1-14);ctx.stroke();ctx.restore();}
// the data contract for enrolments: what arrives, what's allowed and what it means, how fresh, and an owner in each corner
function contract(ctx,x,y,w,h,o){o=o||{};const ver=o.ver||"1.0",dA=o.deferred||0;glass(ctx,x,y,w,h,24,[236,243,255],{glow:24+10*(o.glow||0),ea:0.9,fill:"rgba(10,16,32,0.95)"});
  T(ctx,"Data contract · enrolments",x+36,y+60,{w:800,size:34});stampV(ctx,x+w-40,y+50,"v"+ver,o.verFlash||0);
  const key=(k,yy)=>T(ctx,k,x+36,yy,{w:700,size:21,color:rgba(SOFT,0.95)}),vx=x+196,base="enrolled · withdrawn · waitlisted";
  const rows=[[136,()=>{key("Fields",y+136);T(ctx,"student, offering, status, date",vx,y+136,{w:600,size:23});}],
    [192,()=>{key("Statuses",y+192);T(ctx,base,vx,y+192,{w:600,size:22,f:"mono"});if(dA>0)withA(ctx,dA,()=>T(ctx," · deferred",vx+tw(ctx,base,22,600,"mono"),y+192,{w:600,size:22,f:"mono",color:rgba(mixc(INK,GOLDC,o.defHi||0),1)}));}],
    [248,()=>{key("Meaning",y+248);T(ctx,"enrolled = holds a place on census date",vx,y+248,{w:600,size:22});T(ctx,"waitlisted = no place yet · withdrawn = left",vx,y+280,{w:600,size:22});
      if(dA>0)withA(ctx,dA,()=>T(ctx,"deferred = starts in a later term",vx,y+312,{w:600,size:22,color:rgba(mixc(INK,GOLDC,o.defHi||0),1)}));}],
    [364,()=>{key("Freshness",y+364);T(ctx,"by 06:00 every day",vx,y+364,{w:600,size:23});}]];
  rows.forEach(([,draw],i)=>withA(ctx,o.rows==null?1:clamp(o.rows*rows.length-i,0,1),draw));
  // the owners: one on each side of the change, technical and business, producing and using the data
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+26,y+398);ctx.lineTo(x+w-26,y+398);ctx.stroke();
  const cx1=x+w*0.44,cx2=x+w*0.7;key("Owners",y+432);T(ctx,"business",cx1,y+432,{w:700,size:18,color:rgba(BIZ,0.95)});T(ctx,"technical",cx2,y+432,{w:700,size:18,color:rgba(TECH,0.95)});
  T(ctx,"produce",vx,y+474,{w:600,size:19,color:rgba(SOFT,0.95)});T(ctx,"use",vx,y+516,{w:600,size:19,color:rgba(SOFT,0.95)});
  [["mei",cx1,y+474],["ben",cx2,y+474],["ana",cx1,y+516],["sam",cx2,y+516]].forEach(([id,cx,cy],i)=>{const P=PEOPLE[id],a=o.sign?clamp(o.sign*4-i,0,1):0,n=o.notice?o.notice:0;
    withA(ctx,0.35+0.65*Math.max(a,n),()=>{led(ctx,cx,cy-15,12,12,P.edge);T(ctx,P.name.split(" ")[0],cx+22,cy,{w:700,size:22,color:rgba(P.edge,0.95)});});});}
function stampV(ctx,x,y,s,flash){const w=tw(ctx,s,22,800,"mono")+26;glass(ctx,x-w,y-22,w,40,12,GOOD,{glow:8+20*flash,ea:0.8,fill:"rgba(10,30,20,0.8)"});T(ctx,s,x-w/2,y+6,{w:800,size:22,f:"mono",align:"center",color:"rgba(200,255,220,1)"});}
// the platform in one row: the student system, the contract at the door, bronze, the dbt test gate, silver, gold and the data product
function platformRow(ctx,t,o){o=o||{};const y=o.y||470;
  sysCard(ctx,70,y-60,290,120,"Student system","events and files",APP.sis.c);
  const lanes=[[360,y],[520,y]],d=o.door||0;
  lane(ctx,[{x:360,y},{x:560,y}],APP.sis.c,0.8);
  if(d>0)withA(ctx,d,()=>{glass(ctx,440,y-92,84,184,16,[236,243,255],{glow:14+8*Math.sin(t*1.5),ea:0.8,fill:"rgba(12,18,34,0.9)"});T(ctx,"contract",482,y+118,{w:700,size:16,align:"center",color:rgba(INK,0.9)});
    for(let i=0;i<4;i++){ctx.fillStyle=rgba(i%2?TECH:BIZ,0.9);ctx.fillRect(452,y-72+i*38,60,6);}});
  const cells=(err)=>(r,c)=>{const k=hash(r*13+c,7);return k<0.08&&err?AMBER:k<0.8?APP.sis.c:null;};
  vault(ctx,560,y-150,240,300,LAYER.bronze,cells(o.err),"Bronze","as it arrived");
  const g=o.gate||GOOD;lane(ctx,[{x:800,y},{x:900,y}],APP.sis.c,0.6);gate(ctx,900,y,150,g,"tests");chip(ctx,900,y-130,"dbt","tests","",{align:"center",edge:g});
  const sk=o.skip||0,lit=o.lit||0,dS=sk*(1-sstep(0.22,0.4,lit)),dG=sk*(1-sstep(0.55,0.72,lit));
  withA(ctx,1-0.65*dS,()=>{lane(ctx,[{x:930,y},{x:1000,y}],[214,228,255],0.6);vault(ctx,1000,y-150,240,300,LAYER.silver,(r,c)=>hash(r*7+c,3)<0.7?[214,228,255]:null,"Silver","consistent");});
  withA(ctx,1-0.65*dG,()=>{lane(ctx,[{x:1240,y},{x:1300,y}],GOLDC,0.6);vault(ctx,1300,y-150,240,300,LAYER.gold,(r,c)=>hash(r*5+c,2)<0.6?GOLDC:null,"Gold","class fill");lane(ctx,[{x:1540,y},{x:1600,y}],GOLDC,0.6);});
  kpiMini(ctx,1590,y-95,270,190,parseInt(o.num||"94"));
  if(dS>0)withA(ctx,dS,()=>tag(ctx,1120,y+182,"skipped",SOFT,{align:"center",size:17}));if(dG>0)withA(ctx,dG,()=>tag(ctx,1420,y+182,"skipped",SOFT,{align:"center",size:17}));
  if(o.banner>0)withA(ctx,o.banner,()=>tag(ctx,1725,y-150,"last good data · yesterday 23:02",AMBER,{align:"center",size:16}));}

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

/* ===== Keeping it true: the film's own pictures =====
   The meaning is written down end to end, then the world changes again. An AI agent watches and drafts, in teal: a geometric orb,
   unlike Genie's round one. A person's approval is gold (TRUST). Drift, the gap between what's written and what's used, is red (EDGE_).
   The past (Johnson's dictionary, the planets, the kilogram) is drawn warm, with the series' histBg; the present is the films' dark glass.
   The labs and the scenarios draw with these too (LV, at the end). */
const KT_AI=[130,230,215],KT_BLUE=[60,110,210],KT_PLAN=[120,190,255];
// the three dashboards that each count completion rate their own way, and the numbers they show
const KT_DASH=[{name:"Short courses",col:OFFICE.short.c,num:"71%",f:"completed ÷ enrolled at census date",v:"their own"},
  {name:"Planning",col:KT_PLAN,num:"64%",f:"completed ÷ all who started",v:"glossary v2"},
  {name:"Learning platform",col:OFFICE.lms.c,num:"58%",f:"finished all modules ÷ logged in",v:"v1, 2019"}];
// the change package the agent drafts: the layer, and one line of what changes in it
const KT_PKG=[["Glossary","completion rate v3","completed ÷ enrolled at census date"],["Ontology","revoked is not completed","a statement"],["Logical model","Enrolment + outcome","an attribute"],
  ["Mapping","outcome → gov. field","MC_OUTCOME"],["Semantic layer","completion_rate","one measure"],["Contract","outcome: 3 values","completed · withdrawn · enrolled"],
  ["Tests","revoked not counted","and 2025 unchanged"],["Change note","why","new field · 3 formulas"]];
// one change, end to end: each layer, and what it says about completion rate
const KT_CHAIN=[["Glossary","one definition"],["Ontology","one statement"],["Logical model","Enrolment.outcome"],["Write · read","both shapes"],["Semantic layer","one measure"],["Contract · test","one test"],["Dashboards · Genie","one number"]];

// when a word of a line is spoken: estimated along the line's voiced length, from the words the voice reads
function kt_w(sc,id,word,off){const ln=sc.vo.find(v=>v.id===id);if(!ln)return 0;const s=ln.say||ln.text,i=s.indexOf(word),d=sc.ends[id]-sc.cues[id];return sc.cues[id]+(i<0?0:d*i/s.length)+(off||0);}
const kt_out=(t,a,d)=>1-sstep(a,a+(d||0.6),t);

/* ---------- the agent: a teal, geometric orb (an icosahedron turning inside a hexagon) ---------- */
const KT_ICO=(()=>{const f=(1+Math.sqrt(5))/2,v=[];for(const a of[1,-1])for(const b of[1,-1])v.push([0,a,b*f],[a,b*f,0],[b*f,0,a]);
  const n=Math.hypot(1,f),V=v.map(p=>p.map(q=>q/n)),E=[];for(let i=0;i<12;i++)for(let j=i+1;j<12;j++){const d=Math.hypot(v[i][0]-v[j][0],v[i][1]-v[j][1],v[i][2]-v[j][2]);if(Math.abs(d-2)<0.01)E.push([i,j]);}return{V,E};})();
function kt_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const busy=o.busy||0;
  withA(ctx,a,()=>{glow(ctx,x,y,r*2.4+Math.sin(t*1.7)*5,KT_AI,0.3+0.2*busy);
    ctx.save();ctx.strokeStyle=rgba(KT_AI,0.4);ctx.lineWidth=1.6;ctx.beginPath();for(let i=0;i<=6;i++){const an=i/6*TAU+t*0.15;ctx.lineTo(x+Math.cos(an)*r*1.45,y+Math.sin(an)*r*1.45);}ctx.stroke();
    for(let i=0;i<6;i++){const an=i/6*TAU+t*0.15;ctx.fillStyle=rgba(KT_AI,0.8);ctx.fillRect(x+Math.cos(an)*r*1.45-3,y+Math.sin(an)*r*1.45-3,6,6);}
    const ay=t*(0.45+busy*1.4)+(o.spin||0),ax=0.5,ca=Math.cos(ay),sa=Math.sin(ay),cb=Math.cos(ax),sb=Math.sin(ax);
    const P=KT_ICO.V.map(([px,py,pz])=>{const X=px*ca+pz*sa,Z0=-px*sa+pz*ca;return[x+X*r,y+(py*cb-Z0*sb)*r,py*sb+Z0*cb];});
    const g=ctx.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r);g.addColorStop(0,rgba(mix(KT_AI,[255,255,255],0.55),0.45));g.addColorStop(1,rgba(KT_AI,0.05));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*0.98,0,TAU);ctx.fill();
    ctx.lineCap="round";ctx.shadowColor=rgba(KT_AI,0.8);ctx.shadowBlur=8;
    KT_ICO.E.map(e=>[e,(P[e[0]][2]+P[e[1]][2])/2]).sort((p,q)=>p[1]-q[1]).forEach(([[i,j],z])=>{const k=(z+1)/2;ctx.strokeStyle=rgba(mix(KT_AI,[255,255,255],0.3*k),0.22+0.72*k);ctx.lineWidth=(1+1.8*k)*Math.max(0.6,r/60);ctx.beginPath();ctx.moveTo(P[i][0],P[i][1]);ctx.lineTo(P[j][0],P[j][1]);ctx.stroke();});
    ctx.shadowBlur=0;P.forEach(p=>{const k=(p[2]+1)/2;ctx.fillStyle=rgba(mix(KT_AI,[255,255,255],0.5),0.3+0.7*k);ctx.beginPath();ctx.arc(p[0],p[1],(1.5+2.5*k)*Math.max(0.6,r/60),0,TAU);ctx.fill();});
    ctx.fillStyle=rgba(mix(KT_AI,[255,255,255],0.75),0.95);ctx.beginPath();ctx.arc(x,y,r*0.14*(1+0.2*Math.sin(t*3.1)),0,TAU);ctx.fill();ctx.restore();
    if(o.label)withA(ctx,o.labelA==null?1:o.labelA,()=>tag(ctx,x,y+r*1.45+34,o.label,KT_AI,{align:"center",size:18}));});}
// the agent reading something: a soft cone of light from the orb to its target, with a line sweeping across it
function kt_scan(ctx,x0,y0,x1,y1,a,t,o){if(a<=0.01)return;o=o||{};const an=Math.atan2(y1-y0,x1-x0),w=o.w||60,nx=Math.cos(an+Math.PI/2),ny=Math.sin(an+Math.PI/2);
  ctx.save();ctx.globalAlpha*=a;const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,rgba(KT_AI,0.28));g.addColorStop(1,rgba(KT_AI,0.05));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1+nx*w,y1+ny*w);ctx.lineTo(x1-nx*w,y1-ny*w);ctx.closePath();ctx.fill();
  const sw=Math.sin(t*2.4+(o.ph||0))*w*0.85;ctx.strokeStyle=rgba(KT_AI,0.85);ctx.lineWidth=2;ctx.shadowColor=rgba(KT_AI,0.9);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1+nx*sw,y1+ny*sw);ctx.stroke();ctx.restore();}
// a small flag: the agent's mark on something that has drifted
function kt_flag(ctx,x,y,s,a){withA(ctx,a,()=>{ctx.strokeStyle=rgba(KT_AI,1);ctx.lineWidth=3*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y+18*s);ctx.lineTo(x,y-20*s);ctx.stroke();
  ctx.fillStyle=rgba(KT_AI,0.95);ctx.shadowColor=rgba(KT_AI,0.9);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x,y-20*s);ctx.lineTo(x+24*s,y-12*s);ctx.lineTo(x,y-3*s);ctx.closePath();ctx.fill();ctx.shadowBlur=0;});}
// a gold tick in a ring: a person's approval
function kt_gtick(ctx,x,y,r,a){withA(ctx,a,()=>{glow(ctx,x,y,r*2.2,TRUST,0.35);ctx.fillStyle="rgba(26,20,8,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,TRUST,1,2.5);tick_(ctx,x,y+1,r*1.25,TRUST,1);});}
function kt_rcross(ctx,x,y,r,a){withA(ctx,a,()=>{glow(ctx,x,y,r*2.2,BAD,0.3);ctx.fillStyle="rgba(30,8,10,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,BAD,1,2.5);cross_(ctx,x,y,r*1.2,BAD,1);});}
// a rubber stamp, pressed at an angle: press (0..1) brings it down from above
function kt_rstamp(ctx,x,y,s,col,a,press,o){if(a<=0.01)return;o=o||{};const sz=o.size||30,w=tw(ctx,s,sz,800)+40,h=sz+30,pr=ease(clamp(press==null?1:press,0,1));
  withA(ctx,a*pr,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot==null?-0.12:o.rot);ctx.scale(1.5-0.5*pr,1.5-0.5*pr);ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;rr(ctx,-w/2,-h/2,w,h,8);ctx.stroke();
    ctx.lineWidth=1.5;rr(ctx,-w/2+6,-h/2+6,w-12,h-12,5);ctx.stroke();ctx.shadowBlur=0;T(ctx,s,0,sz*0.36,{w:800,size:sz,align:"center",color:rgba(col,1)});ctx.restore();});}

/* ---------- the past: drawn organically (soft curves, light and shadow, grain, and always a little motion) ---------- */
// a sheet of paper whose edges aren't quite straight, lit from the upper left, with fibres in it and a corner that lifts and settles
function kt_paper(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sd=o.seed||1,base=o.col||[239,230,210],cu=(o.curl==null?1:o.curl)*(0.55+0.45*Math.sin(t*0.9+sd))*Math.min(w,h)*0.08;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);
    const edge=(x0,y0,x1,y1,k)=>{const n=4,nx=-(y1-y0),ny=x1-x0,L=Math.hypot(nx,ny)||1;for(let i=1;i<=n;i++){const um=(i-0.5)/n,u1=i/n,b=(hash(sd*7+k*5+i,3)-0.5)*3.4;ctx.quadraticCurveTo(lerp(x0,x1,um)+nx/L*b,lerp(y0,y1,um)+ny/L*b,lerp(x0,x1,u1),lerp(y0,y1,u1));}};
    const path=()=>{ctx.beginPath();ctx.moveTo(0,0);edge(0,0,w,0,0);edge(w,0,w,h-cu,1);ctx.quadraticCurveTo(w-cu*0.35,h-cu*0.35,w-cu,h);edge(w-cu,h,0,h,2);edge(0,h,0,0,3);ctx.closePath();};
    ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=28;ctx.shadowOffsetY=10;path();ctx.fillStyle=rgba(base,1);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,252,240,0.5)");g.addColorStop(0.55,"rgba(255,250,235,0)");g.addColorStop(1,"rgba(90,66,36,0.24)");path();ctx.fillStyle=g;ctx.fill();
    ctx.save();path();ctx.clip();const n=Math.min(160,Math.floor(w*h/1700));for(let i=0;i<n;i++){const px=hash(i+sd*31,2)*w,py=hash(i+sd*31,5)*h,l=2+hash(i,7)*7,an=hash(i+sd,9)*Math.PI;ctx.strokeStyle="rgba(120,92,56,"+(0.05+0.08*hash(i,11))+")";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px+Math.cos(an+0.4)*l*0.6,py+Math.sin(an+0.4)*l*0.6,px+Math.cos(an)*l,py+Math.sin(an)*l);ctx.stroke();}
    const r=ctx.createRadialGradient(w*0.45,h*0.4,Math.min(w,h)*0.25,w/2,h/2,Math.max(w,h)*0.75);r.addColorStop(0,"rgba(0,0,0,0)");r.addColorStop(1,"rgba(110,78,40,"+(o.age==null?0.14:o.age)+")");ctx.fillStyle=r;ctx.fillRect(0,0,w,h);ctx.restore();
    if(cu>0.8){ctx.beginPath();ctx.moveTo(w,h-cu);ctx.quadraticCurveTo(w-cu*0.35,h-cu*0.35,w-cu,h);ctx.quadraticCurveTo(w-cu*0.8,h-cu*0.6,w-cu*0.92,h-cu*0.92);ctx.quadraticCurveTo(w-cu*0.6,h-cu*0.8,w,h-cu);ctx.closePath();
      const fg=ctx.createLinearGradient(w,h,w-cu,h-cu);fg.addColorStop(0,rgba(mix(base,[255,255,255],0.35),1));fg.addColorStop(1,rgba(mix(base,[120,90,50],0.2),1));ctx.fillStyle=fg;ctx.fill();ctx.strokeStyle="rgba(110,84,50,0.3)";ctx.lineWidth=1;ctx.stroke();}
    ctx.restore();});}
const KT_WORDS=[[["CREDENTIAL",3],["CREDIT",4]],[["DEAN",3],["DEGREE",4]],[["DIPLOMA",4],["ENROL",3]],[["NICE",5],["STUDENT",3]]];
// a heavy book: closed (a leather cover with a rounded spine, gilt, its page block showing its weight), or open on two curved pages of entries
function kt_book(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a,op=clamp(o.open||0,0,1);if(a<=0.01)return;
  withA(ctx,a,()=>{
    if(op<1)withA(ctx,1-op,()=>{const bw=w*0.5,bx=x+w*0.25,s=w/800;
      // the page block, seen at the fore-edge and the foot: curved, cream, with fine lines
      ctx.save();ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=30*s;ctx.shadowOffsetY=12*s;ctx.fillStyle="#d9c7a0";ctx.beginPath();ctx.moveTo(bx+10*s,y+h);ctx.quadraticCurveTo(bx+bw*0.5,y+h+22*s,bx+bw+14*s,y+h+10*s);ctx.lineTo(bx+bw+16*s,y+12*s);ctx.quadraticCurveTo(bx+bw+6*s,y,bx+bw-8*s,y+6*s);ctx.closePath();ctx.fill();ctx.restore();
      ctx.strokeStyle="rgba(150,120,80,0.45)";ctx.lineWidth=1;for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(bx+20*s,y+h+i*2.6*s);ctx.quadraticCurveTo(bx+bw*0.5,y+h+(4+i*3.4)*s,bx+bw+(4+i*2)*s,y+h+(2+i*1.4)*s);ctx.stroke();ctx.beginPath();ctx.moveTo(bx+bw+(2+i*2.4)*s,y+h);ctx.lineTo(bx+bw+(2+i*2.4)*s,y+14*s);ctx.stroke();}
      // the cover: leather, lit from the upper left, with a rounded spine on the left and a little wear
      const cover=()=>{ctx.beginPath();ctx.moveTo(bx+14*s,y);ctx.lineTo(bx+bw-10*s,y);ctx.quadraticCurveTo(bx+bw,y,bx+bw,y+10*s);ctx.lineTo(bx+bw,y+h-10*s);ctx.quadraticCurveTo(bx+bw,y+h,bx+bw-10*s,y+h);ctx.lineTo(bx+14*s,y+h);ctx.bezierCurveTo(bx-8*s,y+h-4*s,bx-8*s,y+4*s,bx+14*s,y);ctx.closePath();};
      const g=ctx.createLinearGradient(bx,y,bx+bw,y+h);g.addColorStop(0,"#7a4629");g.addColorStop(0.5,"#55301b");g.addColorStop(1,"#2e170c");cover();ctx.fillStyle=g;ctx.fill();
      ctx.save();cover();ctx.clip();for(let i=0;i<120;i++){const px=bx+hash(i,21)*bw,py=y+hash(i,22)*h,r=(0.6+hash(i,23)*1.6)*s;ctx.fillStyle=hash(i,24)>0.5?"rgba(20,8,2,0.25)":"rgba(160,110,70,0.12)";ctx.beginPath();ctx.ellipse(px,py,r*1.6,r,hash(i,25)*3,0,TAU);ctx.fill();}
        const sp=ctx.createLinearGradient(bx-4*s,0,bx+34*s,0);sp.addColorStop(0,"rgba(0,0,0,0.35)");sp.addColorStop(0.45,"rgba(255,210,160,0.16)");sp.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sp;ctx.fillRect(bx-10*s,y,50*s,h);
        const sh=ctx.createRadialGradient(bx+bw*(0.3+0.1*Math.sin(t*0.4)),y+h*0.25,10,bx+bw*0.4,y+h*0.35,bw*0.9);sh.addColorStop(0,"rgba(255,220,170,0.14)");sh.addColorStop(1,"rgba(255,220,170,0)");ctx.fillStyle=sh;ctx.fillRect(bx,y,bw,h);ctx.restore();
      ctx.strokeStyle="rgba(222,178,98,0.85)";ctx.lineWidth=3*s;rr(ctx,bx+30*s,y+18*s,bw-48*s,h-36*s,6*s);ctx.stroke();ctx.lineWidth=1.2*s;rr(ctx,bx+40*s,y+28*s,bw-68*s,h-56*s,4*s);ctx.stroke();
      [0.2,0.8].forEach(fy=>{ctx.strokeStyle="rgba(222,178,98,0.6)";ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(bx+2*s,y+h*fy);ctx.quadraticCurveTo(bx+12*s,y+h*fy-4*s,bx+22*s,y+h*fy);ctx.stroke();});
      const gold="rgba(232,192,112,0.95)";[["A",0.24,22],["DICTIONARY",0.33,30],["OF THE",0.42,18],["ENGLISH",0.5,26],["LANGUAGE",0.58,26],["SAMUEL JOHNSON",0.74,17],["1755",0.82,17]].forEach(([q,fy,sz])=>T(ctx,q,bx+bw/2+6*s,y+h*fy,{w:800,size:sz*s,align:"center",color:gold}));});
    if(op>0)withA(ctx,op,()=>{const gx=x+w/2;
      // the boards under the pages
      ctx.save();ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=34;ctx.shadowOffsetY=12;const bg=ctx.createLinearGradient(x,y,x+w,y+h);bg.addColorStop(0,"#6a3a22");bg.addColorStop(1,"#3a1d0f");ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(x-14,y-4);ctx.quadraticCurveTo(gx,y+10,x+w+14,y-4);ctx.lineTo(x+w+14,y+h+14);ctx.quadraticCurveTo(gx,y+h+26,x-14,y+h+14);ctx.closePath();ctx.fill();ctx.restore();
      // two pages that curve down into the gutter, light at the outer edge and shadowed at the fold; the right page's corner lifts a little
      [0,1].forEach(side=>{const ox=side?x+w:x,dir=side?-1:1,lift=side?(5+4*Math.sin(t*1.1)):0;
        const page=()=>{ctx.beginPath();ctx.moveTo(ox,y+6-lift*0.4);ctx.bezierCurveTo(ox+dir*w*0.2,y-6,gx-dir*w*0.12,y+2,gx,y+18);ctx.lineTo(gx,y+h-4);ctx.bezierCurveTo(gx-dir*w*0.12,y+h+6,ox+dir*w*0.2,y+h+14,ox+dir*2,y+h+6);ctx.quadraticCurveTo(ox-dir*3,y+h/2,ox,y+6-lift*0.4);ctx.closePath();};
        const g=ctx.createLinearGradient(ox,y,gx,y);g.addColorStop(0,"#f3e9d1");g.addColorStop(0.7,"#ead9b6");g.addColorStop(1,"#c2aa7c");page();ctx.fillStyle=g;ctx.fill();
        ctx.save();page();ctx.clip();
        for(let i=0;i<90;i++){const px=Math.min(ox,gx)+hash(i+side*97,2)*w/2,py=y+hash(i+side*97,5)*h,l=2+hash(i,7)*6,an=hash(i+side,9)*Math.PI;ctx.strokeStyle="rgba(120,92,56,"+(0.05+0.07*hash(i,11))+")";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+Math.cos(an)*l,py+Math.sin(an)*l);ctx.stroke();}
        // two columns of entries: a headword, then its definition as lines of type that bend with the page
        const cw=w/4-40;[0,1].forEach(col=>{let yy=y+58;const cx0=Math.min(ox,gx)+(side?44:28)+col*(w/4-10),line=(lx,ly,lw)=>{const bend=(side?1:-1)*0.02;ctx.strokeStyle="rgba(80,64,46,0.32)";ctx.lineWidth=4.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(lx,ly);ctx.quadraticCurveTo(lx+lw/2,ly+lw*bend,lx+lw,ly+lw*bend*1.5);ctx.stroke();};
          KT_WORDS[side*2+col].forEach(([hw,n],k)=>{const hi=o.hi===hw,hwW=tw(ctx,hw,15,800);T(ctx,hw,cx0,yy,{w:800,size:15,color:hi?"rgba(150,70,20,1)":"rgba(52,40,30,0.95)"});
            for(let q=0;q<n*2+2;q++)line(q?cx0:cx0+hwW+8,yy-7+q*15,Math.max(10,(q?cw:cw-hwW-8)*(q===n*2+1?0.5:0.85+0.15*hash(k*9+q+side*31+col*7,3))));yy+=(n*2+2)*15+26;});
          // the column runs on to the foot of the page
          for(let q=0;yy+q*15<y+h-26;q++)line(cx0,yy-7+q*15,cw*(0.8+0.2*hash(q+col*17+side*41,4)));});
        const gs=ctx.createLinearGradient(gx-dir*60,0,gx,0);gs.addColorStop(0,"rgba(80,50,20,0)");gs.addColorStop(1,"rgba(80,50,20,0.35)");ctx.fillStyle=gs;ctx.fillRect(Math.min(gx,gx-dir*60),y-10,60,h+30);ctx.restore();
        ctx.strokeStyle="rgba(120,90,50,0.35)";ctx.lineWidth=1.2;page();ctx.stroke();});
      // letters lifting off the page: a language won't stay pinned down
      const dr=o.drift||0;if(dr>0)for(let i=0;i<34;i++){const u=((t*0.22+hash(i,4))%1),px=x+30+hash(i,2)*(w-60),py=y+60+hash(i,3)*(h-90),ch="aeinorstlcdumphgbfywkv"[i%22],sw=Math.sin(t*1.3+i)*14;
        withA(ctx,dr*Math.sin(Math.PI*u)*0.9,()=>{ctx.save();ctx.translate(px+u*120*(hash(i,5)-0.3)+sw*u,py-u*220);ctx.rotate((hash(i,8)-0.5)*u*2);T(ctx,ch,0,0,{w:700,size:16+hash(i,6)*10,color:"rgba(90,64,40,1)"});ctx.restore();});}});});}
// a padlock over the page: fixing the language in place; open (0..1) lifts its shackle
function kt_lock(ctx,x,y,s,col,a,open){withA(ctx,a,()=>{const u=ease(clamp(open||0,0,1));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const sg=ctx.createLinearGradient(-26,0,26,0);sg.addColorStop(0,rgba(mix(col,[80,50,20],0.4),1));sg.addColorStop(0.4,rgba(mix(col,[255,255,255],0.4),1));sg.addColorStop(1,rgba(mix(col,[80,50,20],0.5),1));
  ctx.strokeStyle=sg;ctx.lineWidth=8;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(-22,-2);ctx.lineTo(-22,-22-u*22);ctx.bezierCurveTo(-22,-54-u*22,22,-54-u*22,22,-22-u*22);ctx.lineTo(22,-22-u*22+(u>0.3?0:18));ctx.stroke();ctx.shadowBlur=0;
  const bg=ctx.createLinearGradient(-34,-6,34,46);bg.addColorStop(0,rgba(mix(col,[255,255,255],0.3),1));bg.addColorStop(0.5,rgba(col,1));bg.addColorStop(1,rgba(mix(col,[60,30,10],0.55),1));ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(-30,-6);ctx.quadraticCurveTo(0,-10,30,-6);ctx.quadraticCurveTo(36,20,30,46);ctx.quadraticCurveTo(0,52,-30,46);ctx.quadraticCurveTo(-36,20,-30,-6);ctx.fill();
  ctx.fillStyle="rgba(40,24,10,0.9)";ctx.beginPath();ctx.arc(0,14,6,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-3,16);ctx.lineTo(3,16);ctx.lineTo(4,32);ctx.lineTo(-4,32);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,255,255,0.3)";ctx.beginPath();ctx.ellipse(-14,4,5,12,0.3,0,TAU);ctx.fill();ctx.restore();});}
// the Oxford English Dictionary: a modern page of entries (paraphrased), with an editor's revisions in blue pencil (p reveals them):
// "on paper" struck out and "digital, too" written in above a caret, "a unit of study" circled, and a new sense added to "curriculum"
function kt_oed(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a,p=o.p||0;if(a<=0.01)return;withA(ctx,a,()=>{
  [2,1].forEach(k=>{ctx.save();ctx.translate(x+w/2+k*7,y+h/2+k*6);ctx.rotate(0.018*k);kt_paper(ctx,-w/2,-h/2,w,h,t,{seed:k+4,col:k===2?[222,215,200]:[232,226,214],curl:0,age:0.1});ctx.restore();});
  kt_paper(ctx,x,y,w,h,t,{seed:3,col:[246,242,233],age:0.08});
  T(ctx,"OXFORD ENGLISH DICTIONARY",x+w/2,y+36,{w:800,size:14,align:"center",color:"rgba(40,50,70,0.7)"});ctx.fillStyle="rgba(40,50,70,0.25)";ctx.fillRect(x+30,y+48,w-60,1.5);
  const ink="rgba(34,36,44,0.95)",gray="rgba(52,56,68,0.82)",blue=rgba(KT_BLUE,1),rev=k=>fin(p,k*0.18,0.2),L=x+34,S=17;
  const pencil=(pts,lw)=>{ctx.strokeStyle=blue;ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++)ctx.quadraticCurveTo(pts[i][0],pts[i][1],(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2);const E=pts[pts.length-1];ctx.lineTo(E[0],E[1]);ctx.stroke();};
  const head=(s,yy)=>T(ctx,s,x+30,yy,{w:800,size:24,color:ink});
  const sense=(s,yy)=>T(ctx,s,L,yy,{w:500,size:S,color:gray});
  const bars=(yy,n,sd)=>{for(let k=0;k<n;k++){ctx.fillStyle="rgba(60,64,76,0.26)";ctx.fillRect(L,yy+k*16-5,(w-68)*(0.6+0.35*hash(sd*5+k,7)),5);}};
  // credential: sense 2 ends "on paper"; the editor strikes it and writes "digital, too" above a caret
  let yy=y+90;head("credential, n.",yy);
  sense("1. a letter or paper that vouches for its bearer",yy+30);
  const s2="2. evidence of what someone has learned, ",s2b="on paper",wA=tw(ctx,s2,S,500),wB=tw(ctx,s2b,S,500),l2=yy+74;
  sense(s2+s2b,l2);
  const r0=rev(0);if(r0>0){const x0=L+wA-3,x1=x0+(wB+6)*r0;pencil([[x0,l2-6],[lerp(x0,x1,0.35),l2-7.5],[lerp(x0,x1,0.7),l2-4.5],[x1,l2-6.5]],3);}
  withA(ctx,rev(1),()=>{const cx=L+wA+wB+10;pencil([[cx-6,l2+6],[cx,l2-4],[cx+6,l2+6]],2.5);T(ctx,"digital, too",cx,l2-26,{w:700,size:21,align:"center",color:blue});});
  bars(l2+22,2,1);
  // credit: the editor circles "a unit of study"
  yy=l2+84;head("credit, n.",yy);
  sense("1. belief in what someone says; trust",yy+30);
  const c1="2.",c2="a unit of study",c3="counted toward a qualification",G=18,wc1=tw(ctx,c1,S,500),wc2=tw(ctx,c2,S,500),l3=yy+58;
  sense(c1,l3);T(ctx,c2,L+wc1+G,l3,{w:500,size:S,color:gray});T(ctx,c3,L+wc1+wc2+2*G,l3,{w:500,size:S,color:gray});
  withA(ctx,rev(2),()=>{const cx=L+wc1+G+wc2/2,cy=l3-5,rx=wc2/2+12,ry=15,q=clamp(rev(2)*1.2,0,1);ctx.strokeStyle=blue;ctx.lineWidth=2.5;ctx.lineCap="round";ctx.beginPath();
    for(let k=0;k<=48*q;k++){const an=-2.4+k/48*TAU*1.04,rr=1+0.03*Math.sin(k*0.9);ctx.lineTo(cx+Math.cos(an)*rx*rr,cy+Math.sin(an)*ry*rr+k*0.04);}ctx.stroke();});
  bars(l3+22,2,2);
  // curriculum: a new sense, written in and highlighted
  yy=l3+84;head("curriculum, n.",yy);
  sense("1. the subjects that make up a course of study",yy+30);
  const l4=yy+56;bars(l4,1,3);const l5=l4+30;
  withA(ctx,rev(3),()=>{ctx.fillStyle=rgba(KT_BLUE,0.1);ctx.beginPath();ctx.moveTo(L-10,l5-24);ctx.quadraticCurveTo(x+w/2,l5-28,x+w-30,l5-23);ctx.quadraticCurveTo(x+w-24,l5-6,x+w-30,l5+11);ctx.quadraticCurveTo(x+w/2,l5+15,L-10,l5+10);ctx.quadraticCurveTo(L-15,l5-7,L-10,l5-24);ctx.fill();
    T(ctx,"3. a pathway of short, stackable courses",L,l5,{w:700,size:S+1,color:blue});T(ctx,"new sense",x+w-38,l5-34,{w:700,size:18,align:"right",color:blue});});
  // in the margin, beside the page's revisions
  withA(ctx,rev(1.5),()=>{ctx.save();ctx.translate(x+w-18,y+150);ctx.rotate(-Math.PI/2);T(ctx,"revised",0,0,{w:700,size:18,align:"center",color:blue});ctx.restore();});});}
// the solar system: a glowing sun, and nine bodies on their orbits, each lit on the side that faces the sun; Pluto's orbit is tilted and off-centre
const KT_PLANETS=[["Mercury",[200,180,160],5],["Venus",[240,210,150],7],["Earth",[110,170,240],7],["Mars",[230,120,80],6],["Jupiter",[230,190,140],14],["Saturn",[235,210,150],12],["Uranus",[160,220,230],10],["Neptune",[100,140,240],10],["Pluto",[210,190,170],4]];
function kt_body(ctx,px,py,r,col,lx,ly,o){o=o||{};const L=Math.hypot(lx,ly)||1,dx=lx/L,dy=ly/L;glow(ctx,px,py,r*2.4,col,0.35);
  if(o.ring){ctx.save();ctx.strokeStyle=rgba(mix(col,[255,255,255],0.3),0.7);ctx.lineWidth=r*0.35;ctx.beginPath();ctx.ellipse(px,py,r*2.1,r*0.6,-0.3,Math.PI,TAU);ctx.stroke();ctx.restore();}
  const g=ctx.createRadialGradient(px+dx*r*0.45,py+dy*r*0.45,r*0.1,px,py,r*1.05);g.addColorStop(0,rgba(mix(col,[255,255,255],0.45),1));g.addColorStop(0.6,rgba(col,1));g.addColorStop(1,rgba(mix(col,[10,10,20],0.7),1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();
  if(o.bands){ctx.save();ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.clip();ctx.strokeStyle=rgba(mix(col,[120,70,40],0.4),0.45);ctx.lineWidth=r*0.14;[-0.4,0.05,0.45].forEach(k=>{ctx.beginPath();ctx.moveTo(px-r,py+k*r);ctx.quadraticCurveTo(px,py+k*r+r*0.12,px+r,py+k*r);ctx.stroke();});ctx.restore();}
  if(o.ring){ctx.save();ctx.strokeStyle=rgba(mix(col,[255,255,255],0.3),0.85);ctx.lineWidth=r*0.35;ctx.beginPath();ctx.ellipse(px,py,r*2.1,r*0.6,-0.3,0,Math.PI);ctx.stroke();ctx.restore();}}
function kt_sky(ctx,cx,cy,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sc=o.s||1;withA(ctx,a,()=>{
  for(let k=0;k<3;k++)glow(ctx,cx,cy,(70+k*40+6*Math.sin(t*1.3+k))*sc,[255,190-k*20,100],0.55-k*0.12);
  const sg=ctx.createRadialGradient(cx-8*sc,cy-8*sc,2,cx,cy,28*sc);sg.addColorStop(0,"#fffbe8");sg.addColorStop(0.6,"#ffe19a");sg.addColorStop(1,"#ffb45a");ctx.fillStyle=sg;ctx.beginPath();for(let q=0;q<=36;q++){const an=q/36*TAU,rr_=26*sc*(1+0.03*Math.sin(an*5+t*2));ctx.lineTo(cx+Math.cos(an)*rr_,cy+Math.sin(an)*rr_);}ctx.fill();
  KT_PLANETS.forEach(([n,col,r],i)=>{const rx=(110+i*108)*sc,ry=rx*0.24,pl=i===8,ox=pl?40*sc:0,rot=pl?0.09:0;ctx.save();ctx.translate(cx+ox,cy);ctx.rotate(rot);ctx.strokeStyle=rgba(pl?[200,190,180]:[230,220,200],pl?0.22:0.16);ctx.lineWidth=1.2;if(pl)ctx.setLineDash([6,6]);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,TAU);ctx.stroke();ctx.setLineDash([]);
    const an=pl?0.32+t*0.01:(o.ang||0.6)+t*0.5/Math.pow(i+1,1.1)+i*1.9,px=Math.cos(an)*rx,py=Math.sin(an)*ry;kt_body(ctx,px,py,r*sc*1.15,col,-px-ox,-py,{ring:i===5,bands:i===4});
    if(pl&&o.dwarf)withA(ctx,o.dwarf,()=>tag(ctx,px,py-40,"dwarf planet",CLAY,{align:"center",size:19}));ctx.restore();});});}
// the kilogram, 1889 to 2019: a metal cylinder under a glass bell jar, on a wooden base; light slides slowly over the metal and the glass
function kt_kilo(ctx,x,y,s,a,t){t=t||0;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const wb=ctx.createLinearGradient(0,66,0,96);wb.addColorStop(0,"#8a5a36");wb.addColorStop(1,"#3e2414");ctx.fillStyle=wb;ctx.beginPath();ctx.moveTo(-112,74);ctx.quadraticCurveTo(0,62,112,74);ctx.quadraticCurveTo(118,86,108,94);ctx.quadraticCurveTo(0,102,-108,94);ctx.quadraticCurveTo(-118,86,-112,74);ctx.fill();
  ctx.strokeStyle="rgba(40,20,8,0.35)";ctx.lineWidth=1;[80,86].forEach(yy=>{ctx.beginPath();ctx.moveTo(-100,yy);ctx.bezierCurveTo(-40,yy-3,30,yy+3,100,yy-1);ctx.stroke();});
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(0,72,52,8,0,0,TAU);ctx.fill();
  const m=ctx.createLinearGradient(-40,0,40,0),gl=0.3+0.25*Math.sin(t*0.6);m.addColorStop(0,"#6e6b66");m.addColorStop(Math.max(0.05,gl-0.12),"#b9b5ad");m.addColorStop(gl,"#fbf9f4");m.addColorStop(Math.min(0.95,gl+0.14),"#c4c0b7");m.addColorStop(1,"#5f5c57");
  ctx.fillStyle=m;ctx.beginPath();ctx.moveTo(-40,-10);ctx.lineTo(-40,68);ctx.bezierCurveTo(-40,80,40,80,40,68);ctx.lineTo(40,-10);ctx.closePath();ctx.fill();
  const tp=ctx.createLinearGradient(-40,-18,40,-2);tp.addColorStop(0,"#d8d4cc");tp.addColorStop(gl,"#ffffff");tp.addColorStop(1,"#b5b1a8");ctx.fillStyle=tp;ctx.beginPath();ctx.ellipse(0,-10,40,9,0,0,TAU);ctx.fill();
  // the glass jar: a soft body of light, its edge brighter where it turns, and a highlight that drifts
  ctx.beginPath();ctx.moveTo(-90,72);ctx.bezierCurveTo(-92,20,-94,-40,-88,-70);ctx.bezierCurveTo(-78,-148,78,-148,88,-70);ctx.bezierCurveTo(94,-40,92,20,90,72);
  ctx.fillStyle="rgba(210,230,255,0.06)";ctx.fill();ctx.strokeStyle="rgba(210,230,255,0.5)";ctx.lineWidth=2.5;ctx.stroke();
  const hx=-66+6*Math.sin(t*0.5);ctx.strokeStyle="rgba(255,255,255,0.42)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(hx,36);ctx.bezierCurveTo(hx-4,-10,hx-2,-60,hx+30,-112);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.18)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(70,30);ctx.bezierCurveTo(76,-10,74,-50,60,-90);ctx.stroke();
  const kb=ctx.createRadialGradient(-3,-136,1,0,-133,10);kb.addColorStop(0,"rgba(255,255,255,0.9)");kb.addColorStop(1,"rgba(170,200,240,0.5)");ctx.fillStyle=kb;ctx.beginPath();ctx.arc(0,-133,9,0,TAU);ctx.fill();ctx.restore();});}
// the Planck constant, written with a raised exponent
function kt_planck(ctx,x,y,sz,col){const a="h = 6.626 070 15 × 10",b="−34",c=" J s",wa=tw(ctx,a,sz,700,"mono"),wb=tw(ctx,b,sz*0.6,700,"mono"),wc=tw(ctx,c,sz,700,"mono"),x0=x-(wa+wb+wc)/2;
  T(ctx,a,x0,y,{f:"mono",w:700,size:sz,color:col});T(ctx,b,x0+wa+2,y-sz*0.45,{f:"mono",w:700,size:sz*0.6,color:col});T(ctx,c,x0+wa+wb+4,y,{f:"mono",w:700,size:sz,color:col});}
// a parchment list of names, some struck through by hand
function kt_list(ctx,x,y,w,title,items,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||50,t=o.t||0;if(a<=0.01)return;withA(ctx,a,()=>{const h=80+items.length*rh+(o.foot||0);kt_paper(ctx,x,y,w,h,t,{seed:9,col:[236,226,202]});
  T(ctx,title,x+30,y+50,{w:800,size:26,color:"rgba(60,44,30,0.95)"});ctx.strokeStyle="rgba(120,90,50,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,y+64);ctx.quadraticCurveTo(x+w/2,y+62,x+w-30,y+65);ctx.stroke();
  items.forEach((s,i)=>{const yy=y+80+i*rh+rh*0.62,st=(o.strike||{})[i]||0;T(ctx,s,x+44,yy,{w:600,size:24,color:st>0.5?"rgba(60,44,30,0.5)":"rgba(52,40,30,0.95)"});
    if(st>0){const sw=(tw(ctx,s,24,600)+14)*st;ctx.strokeStyle=rgba([180,48,36],0.95);ctx.lineCap="round";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+38,yy-7);ctx.bezierCurveTo(x+38+sw*0.3,yy-11,x+38+sw*0.6,yy-5,x+38+sw,yy-10);ctx.stroke();}});});}

/* ---------- the present: the calendar, the government's form, the dashboards ---------- */
function kt_cal(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cw=(w-40)/7,rh=52,h=130+5*rh;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[170,205,255],{glow:12,ea:0.5,fill:"rgba(8,14,28,0.92)"});
  T(ctx,o.month||"October 2026",x+24,y+48,{w:800,size:28});"MTWTFSS".split("").forEach((d,i)=>T(ctx,d,x+20+cw*(i+0.5),y+92,{w:700,size:16,align:"center",color:rgba(SOFT,0.9)}));
  const first=3;for(let d=1;d<=31;d++){const k=first+d-1,cx=x+20+cw*((k%7)+0.5),cy=y+130+Math.floor(k/7)*rh,m=(o.marks||[]).find(q=>q.d===d);
    if(m&&m.a>0)withA(ctx,m.a,()=>{glow(ctx,cx,cy-6,34,m.col,0.35);ctx.fillStyle=rgba(m.col,0.22);ctx.beginPath();ctx.arc(cx,cy-6,21,0,TAU);ctx.fill();ring(ctx,cx,cy-6,21,m.col,1,2.5);});
    T(ctx,String(d),cx,cy,{w:m&&m.a>0.5?800:600,size:18,align:"center",color:m&&m.a>0.5?rgba(m.col,1):rgba(INK,0.75)});}
  if(o.today!=null){const k=first+o.today-1,cx=x+20+cw*((k%7)+0.5),cy=y+130+Math.floor(k/7)*rh;ctx.strokeStyle=rgba(INK,0.5);ctx.lineWidth=1.5;rr(ctx,cx-cw/2+3,cy-30,cw-6,40,8);ctx.stroke();}});return h;}
// the government's reporting form for microcredentials, with a new field
function kt_form(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const F=["Provider code","Microcredential code","Learner ID","Volume of learning (hours)"],rh=52,h=112+(F.length+1)*rh+12;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[200,215,240],{glow:14,ea:0.55,fill:"rgba(8,14,28,0.94)"});ctx.fillStyle="rgba(200,215,240,0.12)";rr(ctx,x+2,y+2,w-4,62,16);ctx.fill();
    T(ctx,"Government",x+24,y+30,{w:700,size:15,color:rgba(SOFT,1)});T(ctx,"Microcredential report · 2027",x+24,y+54,{w:800,size:21});
    F.forEach((f,i)=>{const yy=y+100+i*rh;T(ctx,f,x+24,yy,{w:600,size:16,color:rgba(SOFT,1)});ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=1.5;rr(ctx,x+24,yy+8,w-48,26,6);ctx.stroke();});
    const hi=o.hi||0,yy=y+100+F.length*rh;withA(ctx,0.3+0.7*hi,()=>{ctx.fillStyle=rgba(AMBER,0.14*hi);rr(ctx,x+12,yy-24,w-24,rh+14,10);ctx.fill();ctx.strokeStyle=rgba(AMBER,0.9);ctx.lineWidth=2.5;rr(ctx,x+12,yy-24,w-24,rh+14,10);ctx.stroke();
      T(ctx,"Outcome",x+24,yy,{w:800,size:17,color:rgba(AMBER,1)});T(ctx,"completed · withdrawn · enrolled",x+24,yy+30,{f:"mono",w:500,size:18,color:rgba(INK,0.9)});});
    if(hi>0.5)withA(ctx,fin(hi,0.5,0.5),()=>tag(ctx,x+w-80,yy-6,"new",AMBER,{align:"center",size:16}));});return h;}
// a dashboard, in the style of Silent change's (a light canvas in a dark bezel): one number, its name, and optionally its formula
function kt_dash(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[7,122,157],s=h/230,hi=o.hi||0;
  withA(ctx,a,()=>{if(hi>0)glow(ctx,x+w/2,y+h/2,w*0.7,o.hiCol||col,0.3*hi);glass(ctx,x-8,y-8,w+16,h+16,16,o.edge||[170,205,255],{glow:10+14*hi,ea:0.4+0.5*hi,fill:"rgba(8,14,28,0.95)"});
    ctx.save();rr(ctx,x,y,w,h,10);ctx.clip();ctx.fillStyle=DB.canvas;ctx.fillRect(x,y,w,h);ctx.fillStyle=DB.card;ctx.fillRect(x,y,w,46*s);ctx.fillStyle=rgba(col,1);ctx.fillRect(x,y,7*s,46*s);ctx.fillStyle=DB.line;ctx.fillRect(x,y+46*s,w,1.2);
    T(ctx,o.name||"Dashboard",x+20*s,y+30*s,{w:700,size:18*s,color:DB.text});
    T(ctx,o.title||"Completion rate",x+20*s,y+82*s,{w:600,size:18*s,color:DB.muted});
    T(ctx,o.num||"71%",x+18*s,y+152*s,{w:800,size:62*s,color:o.numCol||DB.text});
    if(o.formula)withA(ctx,o.fA==null?1:o.fA,()=>{T(ctx,o.formula,x+20*s,y+h-22*s,{f:"mono",w:500,size:Math.min(18,(w-40*s)/o.formula.length*1.62),color:o.fCol||DB.muted});});
    else{const v=parseFloat(o.num)||0,bw=w-40*s;ctx.fillStyle=DB.track;rr(ctx,x+20*s,y+h-34*s,bw,12*s,6*s);ctx.fill();ctx.fillStyle=rgba(col,1);rr(ctx,x+20*s,y+h-34*s,bw*v/100,12*s,6*s);ctx.fill();}
    ctx.restore();if(o.flag)kt_flag(ctx,x+w-26,y-4,1,o.flag);});}
// a glossary entry: the term, its version and owner, and its definition (lines given, so a phrase can be highlighted)
function kt_gloss(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const L=o.lines||[],h=o.h||(140+L.length*38);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,o.edge||KIND,{glow:14+10*(o.glow||0),ea:0.75,fill:"rgba(7,12,24,0.94)"});T(ctx,o.kind||"Glossary",x+24,y+34,{w:700,size:16,color:rgba(o.edge||KIND,1)});
    T(ctx,o.term||"completion rate",x+24,y+74,{w:800,size:30});if(o.ver)stamp(ctx,x+w-20,y+38,o.ver,o.verCol||KIND,1,o.flick||0);
    L.forEach((l,i)=>{const yy=y+120+i*38;T(ctx,l,x+24,yy,{w:600,size:22,color:rgba(INK,0.92)});
      if(o.hi&&o.hi[0]===i&&o.hiA>0){const p0=l.indexOf(o.hi[1]),x0=x+24+tw(ctx,l.slice(0,p0),22,600),x1=x0+tw(ctx,o.hi[1],22,600);withA(ctx,o.hiA,()=>{ctx.fillStyle=rgba(o.hiCol||EDGE_,0.2);rr(ctx,x0-4,yy-24,x1-x0+8,32,6);ctx.fill();ctx.strokeStyle=rgba(o.hiCol||EDGE_,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,yy+8);ctx.lineTo(x1,yy+8);ctx.stroke();});}});
    if(o.owner)T(ctx,o.owner,x+24,y+h-20,{w:600,size:16,color:rgba(SOFT,1)});});return h;}
// code that calculates a number: a file name and a few lines of SQL, one phrase of which can be highlighted
function kt_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||(78+lines.length*34);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,o.edge||[170,205,255],{glow:12,ea:0.6,fill:"rgba(6,10,20,0.95)"});T(ctx,name,x+22,y+34,{f:"mono",w:500,size:16,color:rgba(o.edge||SOFT,1)});ctx.fillStyle="rgba(170,200,245,0.15)";ctx.fillRect(x+14,y+48,w-28,1.2);
    const n=o.p==null?lines.length:lines.length*o.p;lines.forEach((l,i)=>{if(i>=n)return;const yy=y+84+i*34,q=clamp(n-i,0,1);T(ctx,typeOn(l,q),x+22,yy,{f:"mono",w:500,size:18,color:rgba(i%2?INK:[190,220,255],0.92)});
      if(o.hi&&o.hi[0]===i&&o.hiA>0){const p0=l.indexOf(o.hi[1]),x0=x+22+tw(ctx,l.slice(0,p0),18,500,"mono"),x1=x0+tw(ctx,o.hi[1],18,500,"mono");withA(ctx,o.hiA,()=>{ctx.fillStyle=rgba(o.hiCol||EDGE_,0.22);rr(ctx,x0-4,yy-22,x1-x0+8,30,6);ctx.fill();ctx.strokeStyle=rgba(o.hiCol||EDGE_,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,yy+8);ctx.lineTo(x1,yy+8);ctx.stroke();});}});});return h;}

/* ---------- the model on its board, and the data under it ---------- */
// the sketch: the credential and its kinds, as the films' glass boxes, on a board with its version stamp
function kt_board(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  glass(ctx,0,0,w,h,20,o.edge||SK,{glow:16,ea:0.5,fill:"rgba(10,18,36,0.72)"});if(o.label)tag(ctx,24,0,o.label,o.edge||SK,{size:17});
  const s=o.s||0.5,ox=w/2-960*s,oy=h/2-445*s;credKinds(ctx,{ox,oy,s,hi:o.hi});
  if(o.stamp)stamp(ctx,w-18,42,o.stamp,o.stampCol||[200,170,120],1,o.flick||0);ctx.restore();});}
// the data as it's used: a table of enrolments
const KT_COLS=["learner","microcredential","status","online","completed"],KT_CW=[130,250,190,140,150];
const KT_ROWS=[["L-2041","Data Visualisation","enrolled","live","yes"],["L-2217","SQL Basics","WAITLISTED","live","—"],["L-1180","Data Ethics","withdrawn","recorded","no"]];
const kt_cellX=(x,i)=>x+KT_CW.slice(0,i).reduce((p,q)=>p+q,0);

/* ---------- the change package, and the chain ---------- */
function kt_pcard(ctx,x,y,w,h,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const [lay,l1,l2]=KT_PKG[k],col=o.col||KT_AI;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,12,col,{glow:10+10*(o.hi||0),ea:0.75,fill:"rgba(6,16,20,0.95)"});ctx.fillStyle=rgba(col,0.9);rr(ctx,x+12,y+14,5,h-28,2);ctx.fill();
    T(ctx,lay,x+30,y+32,{w:700,size:17,color:rgba(col,1)});T(ctx,l1,x+30,y+66,{w:700,size:23});if(h>100&&l2)T(ctx,l2,x+30,y+98,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});
    if(o.tick)kt_gtick(ctx,x+w-22,y+22,13,o.tick);});}
function kt_folder(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||KT_AI;withA(ctx,a,()=>{
  ctx.save();ctx.shadowColor=rgba(col,0.5);ctx.shadowBlur=24;ctx.fillStyle="rgba(8,20,24,0.9)";ctx.beginPath();ctx.moveTo(x,y+24);ctx.lineTo(x,y+h-16);ctx.quadraticCurveTo(x,y+h,x+16,y+h);ctx.lineTo(x+w-16,y+h);ctx.quadraticCurveTo(x+w,y+h,x+w,y+h-16);ctx.lineTo(x+w,y+40);ctx.quadraticCurveTo(x+w,y+24,x+w-16,y+24);ctx.lineTo(x+260,y+24);ctx.lineTo(x+236,y);ctx.lineTo(x+16,y);ctx.quadraticCurveTo(x,y,x,y+16);ctx.closePath();ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2;ctx.stroke();T(ctx,o.title||"change package",x+24,y+17,{w:800,size:o.ts||16,color:rgba(col,1)});
  if(o.stamp)stamp(ctx,x+w-18,y+60,o.stamp,o.stampCol||col,o.stampA==null?1:o.stampA,0);});}
// the stack of versions: v1 at the back, the newest in front
function kt_versions(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{for(let i=0;i<n;i++){const k=clamp((o.p==null?n:o.p)-i,0,1);if(k<=0)continue;const top=i===n-1,xx=x+i*16,yy=y-i*26;
  withA(ctx,k,()=>{glass(ctx,xx,yy,220,110,14,top?(o.col||TRUST):[150,165,190],{glow:top?16:6,ea:top?0.9:0.5,fill:"rgba(8,12,24,0.96)"});T(ctx,"v"+(i+1),xx+22,yy+44,{f:"mono",w:500,size:26,color:top?rgba(o.col||TRUST,1):rgba(SOFT,1)});
    T(ctx,(o.dates||["2019","2025","2026"])[i]||"",xx+198,yy+42,{f:"mono",w:500,size:18,align:"right",color:rgba(SOFT,0.9)});if(top&&o.sub)T(ctx,o.sub,xx+22,yy+86,{w:600,size:18,color:rgba(INK,0.85)});});}});}
// one change, end to end: seven layers in a row, lit up to "lit" (0..7); a light travels along them
function kt_chain(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=KT_CHAIN.length,gap=o.gap||16,bw=(w-gap*(n-1))/n,bh=o.h||110,lit=o.lit||0,sz=o.size||1;
  withA(ctx,a,()=>{const cy=y+bh/2;ctx.strokeStyle="rgba(170,200,245,0.25)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+bw/2,cy);ctx.lineTo(x+w-bw/2,cy);ctx.stroke();
    if(lit>0){const e=x+bw/2+(bw+gap)*Math.min(n-1,lit-0.5);beam(ctx,[{x:x+bw/2,y:cy},{x:Math.max(x+bw/2+1,e),y:cy}],TRUST,[[18,0.06],[7,0.18],[2.6,0.8],[1.2,1]]);}
    KT_CHAIN.forEach(([t1,t2],i)=>{const bx=x+i*(bw+gap),on=clamp(lit-i,0,1),hi=o.hiK===i?1:0,col=mix([150,165,190],TRUST,on);
      glass(ctx,bx,y,bw,bh,14,col,{glow:6+16*on+10*hi,ea:0.35+0.6*on,fill:"rgba(8,12,24,0.95)"});
      T(ctx,t1,bx+bw/2,y+bh*0.44,{w:800,size:Math.min(22*sz,(bw-16)/t1.length*1.9),align:"center",color:on>0.5?rgba(INK,1):rgba(SOFT,0.8)});
      withA(ctx,0.4+0.6*on,()=>T(ctx,(o.sub||[])[i]||t2,bx+bw/2,y+bh*0.74,{w:600,size:Math.min(18*sz,(bw-12)/((o.sub||[])[i]||t2).length*1.75),align:"center",color:on>0.5?rgba(TRUST,1):rgba(SOFT,0.8)}));
      if(o.ticks&&on>0.9)kt_gtick(ctx,bx+bw-14,y+2,11,fin(on,0.9,0.1));});});}
// a report from an earlier year, read with the definitions it was written with
function kt_report(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||300,t=o.t||0;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.015:o.rot);ctx.translate(-w/2,-h/2);
  kt_paper(ctx,0,0,w,h,t,{seed:o.seed||2,col:[240,233,218],curl:o.curl});
  T(ctx,o.title||"Annual report 2025",30,54,{w:800,size:26,color:"rgba(40,36,34,0.95)"});ctx.strokeStyle="rgba(80,76,70,0.3)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(30,70);ctx.quadraticCurveTo(w/2,68,w-30,71);ctx.stroke();
  (o.rows||[["microcredentials issued","2,960"],["completion rate","62%"]]).forEach(([k,v],i)=>{T(ctx,k,30,120+i*52,{w:600,size:21,color:"rgba(60,56,52,0.9)"});T(ctx,v,w-30,120+i*52,{w:800,size:26,align:"right",color:"rgba(40,36,34,0.95)"});});
  if(o.big)T(ctx,o.big,30,120+(o.rows||[0,0]).length*52+24,{w:800,size:48,color:"rgba(40,36,34,0.95)"});
  if(h>220&&!o.big)for(let i=0;i<3;i++){const lw=(w-60)*(0.5+0.4*hash(i,4)),ly=h-86+i*22;ctx.strokeStyle="rgba(80,76,70,0.22)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(30,ly);ctx.quadraticCurveTo(30+lw/2,ly+1.5,30+lw,ly);ctx.stroke();}
  if(o.stamp)stamp(ctx,w-16,h-18,o.stamp,o.stampCol||KIND,o.stampA==null?1:o.stampA,0);ctx.restore();});}
// a clay tablet from Uruk, c. 3300 BCE: a soft pillow of clay, speckled and lit from the upper left, ruled into cases. In each case,
// numbers pressed in with the round end of a stylus (notches and circles) and a sign drawn with its point: a jar, an ear of grain,
// a sheep (a circle with a cross), a bowl. Stylised, not a real text; the wedges of cuneiform came centuries later. p presses them
function kt_signPath(ctx,k,s){const P=(pts)=>{ctx.moveTo(pts[0][0]*s,pts[0][1]*s);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0]*s,pts[i][1]*s);};ctx.beginPath();
  if(k===0){ctx.moveTo(-0.45*s,-0.75*s);ctx.lineTo(0.45*s,-0.75*s);ctx.moveTo(-0.33*s,-0.75*s);ctx.lineTo(-0.33*s,-0.45*s);ctx.quadraticCurveTo(-0.66*s,-0.3*s,-0.56*s,0.2*s);ctx.quadraticCurveTo(-0.4*s,0.75*s,0,0.85*s);ctx.quadraticCurveTo(0.4*s,0.75*s,0.56*s,0.2*s);ctx.quadraticCurveTo(0.66*s,-0.3*s,0.33*s,-0.45*s);ctx.lineTo(0.33*s,-0.75*s);}
  else if(k===1){P([[0,0.85],[0,-0.85]]);for(let q=0;q<3;q++){const y=-0.55+q*0.45;P([[0,y+0.18],[-0.36,y-0.12]]);P([[0,y+0.18],[0.36,y-0.12]]);}}
  else if(k===2){ctx.moveTo(0.6*s,0);ctx.arc(0,0,0.6*s,0,TAU);P([[-0.6,0],[0.6,0]]);P([[0,-0.6],[0,0.6]]);}
  else{P([[-0.66,-0.4],[0.66,-0.4],[0.3,0.6],[-0.3,0.6],[-0.66,-0.4]]);}}
function kt_tablet(ctx,x,y,w,h,p,a,t){t=t||0;withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(x,y);
  const shape=()=>{const n=96,P=[];for(let i=0;i<n;i++){const an=i/n*TAU,c=Math.cos(an),s_=Math.sin(an),e=0.38,wob=1+0.01*Math.sin(an*3+1.3)+0.006*Math.sin(an*7);P.push([w/2+w/2*Math.sign(c)*Math.pow(Math.abs(c),e)*wob,h/2+h/2*Math.sign(s_)*Math.pow(Math.abs(s_),e)*wob]);}
    ctx.beginPath();ctx.moveTo((P[0][0]+P[n-1][0])/2,(P[0][1]+P[n-1][1])/2);for(let i=0;i<n;i++){const q=P[i],r=P[(i+1)%n];ctx.quadraticCurveTo(q[0],q[1],(q[0]+r[0])/2,(q[1]+r[1])/2);}ctx.closePath();};
  ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=30;ctx.shadowOffsetY=12;shape();ctx.fillStyle="#977250";ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,226,180,0.32)");g.addColorStop(0.5,"rgba(255,226,180,0)");g.addColorStop(1,"rgba(40,20,8,0.42)");shape();ctx.fillStyle=g;ctx.fill();
  ctx.save();shape();ctx.clip();const lx=w*(0.35+0.15*Math.sin(t*0.35)),lg=ctx.createRadialGradient(lx,h*0.3,4,lx,h*0.35,w*0.6);lg.addColorStop(0,"rgba(255,230,190,0.16)");lg.addColorStop(1,"rgba(255,230,190,0)");ctx.fillStyle=lg;ctx.fillRect(0,0,w,h);
    for(let i=0;i<Math.floor(w*h/260);i++){const px=hash(i,31)*w,py=hash(i,32)*h,r=0.5+hash(i,33)*1.8;ctx.fillStyle=hash(i,34)>0.55?"rgba(60,36,18,0.22)":"rgba(255,225,185,0.14)";ctx.beginPath();ctx.ellipse(px,py,r*1.4,r,hash(i,35)*3,0,TAU);ctx.fill();}
    ctx.strokeStyle="rgba(60,36,18,0.28)";ctx.lineWidth=1;[[0.1,0.7,0.3,0.95],[0.82,0.05,0.93,0.3]].forEach(([a0,b0,a1,b1])=>{ctx.beginPath();ctx.moveTo(w*a0,h*b0);ctx.bezierCurveTo(w*(a0+0.03),h*(b0+0.08),w*(a1-0.04),h*(b1-0.06),w*a1,h*b1);ctx.stroke();});
    for(let r=1;r<4;r++){const yy=r*h/4;ctx.strokeStyle="rgba(58,34,16,0.4)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(w*0.05,yy);ctx.bezierCurveTo(w*0.35,yy-2,w*0.65,yy+2,w*0.95,yy);ctx.stroke();ctx.strokeStyle="rgba(255,226,180,0.22)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(w*0.05,yy+2);ctx.bezierCurveTo(w*0.35,yy,w*0.65,yy+4,w*0.95,yy+2);ctx.stroke();}
    const sz=Math.min(w/26,h/9),pp=clamp(p,0,1),dark="rgba(56,32,14,0.82)",lite="rgba(255,226,180,0.32)";
    for(let q=0;q<8;q++){const row=q>>1,col=q&1,dv=w*(0.5+0.12*(hash(row,51)-0.5)),x0=col?dv:w*0.05,x1=col?w*0.95:dv,cy=row*h/4+h/8,u=clamp(pp*8-q,0,1);
      if(col){ctx.strokeStyle="rgba(58,34,16,0.4)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(dv,row*h/4+h*0.02);ctx.quadraticCurveTo(dv+2,cy,dv-1,(row+1)*h/4-h*0.02);ctx.stroke();}
      if(u<=0)continue;const nC=hash(q,52)<0.45?1:0,nD=1+Math.floor(hash(q,53)*4),items=nC+nD+1;let px=x0+sz*0.9;
      for(let m=0;m<items;m++){if(u<=m/items)break;const jy=(hash(q*7+m,54)-0.5)*sz*0.12;ctx.save();
        if(m<nC){ctx.translate(px+sz*0.35,cy+jy);ctx.fillStyle=dark;ctx.beginPath();ctx.arc(0,0,sz*0.52,0,TAU);ctx.fill();ctx.strokeStyle=lite;ctx.lineWidth=Math.max(0.8,sz*0.07);ctx.beginPath();ctx.arc(0,0,sz*0.5,-0.15*Math.PI,0.75*Math.PI);ctx.stroke();px+=sz*1.35;}
        else if(m<nC+nD){ctx.translate(px,cy+jy);ctx.rotate((hash(q*5+m,55)-0.5)*0.12);ctx.fillStyle=dark;ctx.beginPath();ctx.moveTo(-sz*0.26,-sz*0.62);ctx.lineTo(-sz*0.26,sz*0.62);ctx.bezierCurveTo(sz*0.46,sz*0.64,sz*0.46,-sz*0.64,-sz*0.26,-sz*0.62);ctx.fill();
          ctx.strokeStyle=lite;ctx.lineWidth=Math.max(0.8,sz*0.07);ctx.beginPath();ctx.moveTo(sz*0.28,-sz*0.1);ctx.bezierCurveTo(sz*0.3,sz*0.3,sz*0.15,sz*0.55,-sz*0.2,sz*0.6);ctx.stroke();px+=sz*0.78;}
        else{const sx=Math.min(x1-sz*1.1,px+sz*1.2);ctx.translate(sx,cy);ctx.lineCap="round";ctx.lineJoin="round";kt_signPath(ctx,[0,3,1,2,3,0,2,1][q],sz);ctx.strokeStyle=dark;ctx.lineWidth=Math.max(1,sz*0.13);ctx.stroke();
          ctx.translate(sz*0.05,sz*0.06);kt_signPath(ctx,[0,3,1,2,3,0,2,1][q],sz);ctx.strokeStyle="rgba(255,226,180,0.22)";ctx.lineWidth=Math.max(0.6,sz*0.05);ctx.stroke();}
        ctx.restore();}}
  ctx.restore();ctx.restore();});}
// a diploma: a sheet with softly rolled ends, a few lines of script, and a ribbon with a wax seal that sways
function kt_diploma(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const rh=Math.max(8,h*0.09);
  kt_paper(ctx,x,y+rh*0.5,w,h-rh,t,{seed:o.seed||5,col:[242,233,212],curl:0,age:0.12});
  [y+rh*0.5,y+h-rh*0.5].forEach((ry,k)=>{const g=ctx.createLinearGradient(0,ry-rh/2,0,ry+rh/2);g.addColorStop(0,"#b99a6c");g.addColorStop(0.45,"#f6ead0");g.addColorStop(1,"#8e7048");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-rh*0.3,ry-rh/2);ctx.bezierCurveTo(x+w/3,ry-rh/2-1.5,x+2*w/3,ry-rh/2+1.5,x+w+rh*0.3,ry-rh/2);ctx.quadraticCurveTo(x+w+rh*0.9,ry,x+w+rh*0.3,ry+rh/2);ctx.bezierCurveTo(x+2*w/3,ry+rh/2+1.5,x+w/3,ry+rh/2-1.5,x-rh*0.3,ry+rh/2);ctx.quadraticCurveTo(x-rh*0.9,ry,x-rh*0.3,ry-rh/2);ctx.fill();});
  if(o.title)T(ctx,o.title,x+w/2,y+rh+h*0.2,{w:800,size:Math.max(12,h*0.13),align:"center",color:"rgba(70,50,30,0.95)"});
  for(let i=0;i<3;i++){const ly=y+rh+h*(0.36+i*0.13),lw=w*(0.62-i*0.12),lx=x+(w-lw)/2;ctx.strokeStyle="rgba(80,60,40,0.4)";ctx.lineWidth=Math.max(1,h*0.018);ctx.beginPath();ctx.moveTo(lx,ly);for(let q=1;q<=6;q++)ctx.quadraticCurveTo(lx+lw*(q-0.5)/6,ly+((q%2)?-1:1)*h*0.015,lx+lw*q/6,ly);ctx.stroke();}
  const sx=x+w*0.72,sy=y+h*0.8,sw=Math.sin(t*1.4)*h*0.03,rw=Math.max(3,h*0.05);ctx.fillStyle="rgba(150,30,36,0.95)";[-1,1].forEach(d=>{ctx.beginPath();ctx.moveTo(sx+d*rw*0.4,sy);ctx.quadraticCurveTo(sx+d*rw+sw,sy+h*0.14,sx+d*rw*1.6+sw*1.4,sy+h*0.26);ctx.lineTo(sx+d*rw*0.6+sw*1.4,sy+h*0.24);ctx.quadraticCurveTo(sx+sw*0.8,sy+h*0.12,sx-d*rw*0.4,sy);ctx.fill();});
  waxSeal(ctx,sx,sy,Math.max(8,h*0.1),WAX,1,1);});}
// a proposal on its way: a small card carried along a path, for the review and the gate
function kt_prop(ctx,x,y,s,col,a,o){o=o||{};withA(ctx,a,()=>{const w=tw(ctx,s,17,700)+36;glass(ctx,x-w/2,y-22,w,44,12,col,{glow:14,ea:0.85,fill:"rgba(8,12,24,0.95)",lw:o.dash?2:1.6});if(o.dash){ctx.save();ctx.setLineDash([6,5]);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;rr(ctx,x-w/2,y-22,w,44,12);ctx.stroke();ctx.restore();}
  T(ctx,s,x,y+6,{w:700,size:17,align:"center",color:rgba(col,1)});});}

/* ---------- pictures for the labs and the scenarios (site/assets/keeping-it-true/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW); any text it draws comes from FW.vis
   or the lab's own words, so the Spanish pages show Spanish. Lab pictures are shown at about half size, so their text is 22 px
   or more; scenario pictures at about 70%, so theirs is 18 px or more. */
// several lines of text, split on "\n"
function kt_lines(c,s,x,y,o){String(s).split("\n").forEach((l,i)=>T(c,l,x,y+i*(o.lh||o.size*1.2),o));}
// a sort lab: its buckets as three trays, with a numbered chip for each item placed (green or red once checked)
function kt_trays(c,w,h,st,L,id,cols,icons){const lab=L.labs.find(x=>x.id===id),B=lab.w.buckets,n=B.length,tw_=(w-40-(n-1)*20)/n,pick=st.pick||{};
  B.forEach(([k,name],i)=>{const x=20+i*(tw_+20),y=20,col=cols[i];glass(c,x,y,tw_,h-40,18,col,{glow:12,ea:0.75,fill:"rgba(7,12,24,0.94)"});icons[i](c,x+36,y+44);
    const nl=wrapT(c,name,x+68,y+52,tw_-84,{w:800,size:24,lh:30,color:rgba(col,1)}).length;
    const inB=lab.w.items.map((it,j)=>[it,j]).filter(([it,j])=>pick[j]===k);inB.forEach(([it,j],q)=>{const cx=x+44+(q%4)*((tw_-60)/4),cy=y+130+Math.max(0,nl-2)*30+Math.floor(q/4)*66,ok=it.b===k,cc=st.checked?(ok?GOOD:BAD):[190,205,230];
      glow(c,cx,cy,34,cc,0.25);c.fillStyle="rgba(10,16,30,0.95)";c.beginPath();c.arc(cx,cy,25,0,TAU);c.fill();ring(c,cx,cy,25,cc,1,3);T(c,String(j+1),cx,cy+9,{w:800,size:26,align:"center",color:rgba(cc,1)});});});}
// the chain for the steps lab: eight steps in two rows, the second running back, lit up to the step you're on
function kt_chain2(c,w,h,step,labels){const bw=206,bh=100,gx=(w-4*bw)/5,P=i=>i<4?[gx+i*(bw+gx),30]:[gx+(7-i)*(bw+gx),30+bh+60];
  c.strokeStyle="rgba(170,200,245,0.25)";c.lineWidth=3;c.beginPath();for(let i=0;i<8;i++){const [x,y]=P(i);i?c.lineTo(x+bw/2,y+bh/2):c.moveTo(x+bw/2,y+bh/2);}c.stroke();
  const lit=Math.min(8,step+1);if(lit>1){const pts=[];for(let i=0;i<lit;i++){const [x,y]=P(i);pts.push({x:x+bw/2,y:y+bh/2});}beam(c,pts,TRUST,[[16,0.06],[6,0.2],[2.6,0.85]]);}
  labels.forEach((s,i)=>{const [x,y]=P(i),on=i<lit,cur=i===step,col=on?TRUST:[150,165,190];if(cur)glow(c,x+bw/2,y+bh/2,140,TRUST,0.25);
    glass(c,x,y,bw,bh,16,col,{glow:on?(cur?26:12):4,ea:on?0.95:0.4,fill:"rgba(8,12,24,0.96)"});const ls=String(s).split("\n");kt_lines(c,s,x+bw/2,y+bh/2+9-(ls.length-1)*13,{w:800,size:22,lh:27,align:"center",color:on?rgba(INK,1):rgba(SOFT,0.75)});
    if(on&&!cur)kt_gtick(c,x+bw-8,y+6,14,1);});}
// a small light dashboard row: its name and its number
function kt_dashRow(c,x,y,w,name,num,col){glass(c,x-6,y-6,w+12,72,14,[170,205,255],{glow:8,ea:0.4,fill:"rgba(8,14,28,0.95)"});c.save();rr(c,x,y,w,60,10);c.clip();c.fillStyle=DB.card;c.fillRect(x,y,w,60);c.fillStyle=rgba(col,1);c.fillRect(x,y,8,60);c.restore();
  T(c,name,x+24,y+38,{w:700,size:22,color:DB.text});T(c,num,x+w-20,y+44,{w:800,size:38,align:"right",color:DB.text});}
const LV={
  // Spot the drift: what each change needs (close the gap, nothing to change, or a new version of the meaning)
  drift:(c,w,h,st,L)=>kt_trays(c,w,h,st,L,"drift",[EDGE_,GOOD,TRUST],[(c,x,y)=>{T(c,"≈",x,y+12,{w:800,size:40,align:"center",color:rgba(EDGE_,1)});},(c,x,y)=>tick_(c,x,y,32,GOOD,1),(c,x,y)=>{glass(c,x-22,y-18,48,36,9,TRUST,{glow:8,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,"v3",x+2,y+8,{f:"mono",w:500,size:22,align:"center",color:rgba(TRUST,1)});}]),
  // Approve or reject: the agent's proposals, sorted by the people who decide
  review:(c,w,h,st,L)=>kt_trays(c,w,h,st,L,"review",[TRUST,BAD,AMBER],[(c,x,y)=>kt_gtick(c,x,y,18,1),(c,x,y)=>kt_rcross(c,x,y,18,1),(c,x,y)=>{ring(c,x,y,18,AMBER,1,3);T(c,"?",x,y+9,{w:800,size:24,align:"center",color:rgba(AMBER,1)});}]),
  // Follow one change: the chain, lit up to the step you're on; the last step is the version note
  chain:(c,w,h,st,L)=>kt_chain2(c,w,h,st.step||0,L.vis.chain),
  // scenarios (600 × 320)
  three:(c,w,h,st,L)=>{const V=L.vis;T(c,V.rateQ,300,44,{w:800,size:26,align:"center",color:rgba(EDGE_,1)});KT_DASH.forEach((d,i)=>kt_dashRow(c,60,80+i*80,480,V.dash[i],d.num,d.col));},
  invent:(c,w,h,st,L)=>{const V=L.vis;kt_agent(c,64,96,34,1);glass(c,120,30,460,190,18,KT_AI,{glow:16,ea:0.85,fill:"rgba(6,16,20,0.95)"});T(c,V.draft,146,70,{w:700,size:20,color:rgba(KT_AI,1)});T(c,V.rateEq,146,118,{w:800,size:26});T(c,V.invented,146,166,{f:"mono",w:500,size:19});
    kt_rstamp(c,360,262,V.nobody,EDGE_,1,1,{size:28,rot:-0.06});},
  skip:(c,w,h,st,L)=>{const V=L.vis;glass(c,180,30,200,70,14,TRUST,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(c,V.review,280,73,{w:800,size:24,align:"center",color:rgba(TRUST,1)});
    c.save();c.setLineDash([12,9]);c.strokeStyle=rgba(BAD,0.9);c.lineWidth=3.5;c.beginPath();c.moveTo(40,170);c.bezierCurveTo(200,170,250,190,420,170);c.stroke();c.restore();
    const cw=tw(c,V.change,20,700)+30;glass(c,40,146,cw,48,12,BAD,{glow:12,ea:0.9,fill:"rgba(20,8,10,0.95)"});T(c,V.change,40+cw/2,177,{w:700,size:20,align:"center",color:rgba(BAD,1)});
    T(c,V.notReviewed,280,236,{w:700,size:20,align:"center",color:rgba(BAD,1)});gate(c,470,165,190,BAD,"tests");kt_rcross(c,430,170,18,1);T(c,V.gate,470,296,{w:700,size:20,align:"center",color:rgba(BAD,1)});},
  lastyear:(c,w,h,st,L)=>{const V=L.vis;kt_report(c,24,30,290,{h:250,title:V.report,rows:[[V.rateL,""]],big:"62%",stamp:V.readV2,rot:-0.02});
    glass(c,340,34,240,262,18,TRUST,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});kt_lines(c,tw(c,V.v3,18,800)>200?V.v3.replace(/ · (\S+)$/,"\n$1"):V.v3,360,70,{w:800,size:18,lh:22,color:rgba(TRUST,1)});T(c,"71%",360,160,{w:800,size:48});wrapT(c,V.v3f,360,200,200,{f:"mono",w:500,size:18,lh:23});},
  spec:(c,w,h,st,L)=>{const V=L.vis;[["2026",0.55],["2027",1]].forEach(([y_,a],i)=>withA(c,a,()=>{const x=50+i*270;glass(c,x,40,230,240,18,[200,215,240],{glow:10,ea:0.6,fill:"rgba(8,14,28,0.94)"});kt_lines(c,V.spec,x+22,80,{w:700,size:19,lh:24,color:rgba(SOFT,1)});T(c,y_,x+22,176,{w:800,size:52});
    if(i)tag(c,x+115,236,V.outcome,AMBER,{align:"center",size:20});}));arrowTo(c,286,160,316,160,SOFT,0.8,{head:10});},
  who:(c,w,h,st,L)=>{const V=L.vis;[["mei",V.meaning,"Mei"],["noor",V.model,"Noor"],["team",V.build,V.teams]].forEach(([id,s,n],i)=>{const x=110+i*190;if(id==="team"){person(c,"sam",x-34,306,0.33,{t:1});person(c,"ben",x+34,306,0.33,{t:2});}else person(c,id,x,306,0.35,{t:1});
    tag(c,x,34,s,TRUST,{align:"center",size:20});T(c,n,x,80,{w:700,size:19,align:"center",color:rgba(SOFT,1)});});},
  ghost:(c,w,h,st,L)=>{const V=L.vis;kt_report(c,20,70,250,{h:210,title:V.report2019,rows:[[V.completion,""]],big:"58%",rot:-0.03,curl:0});
    const wob=Math.sin(1.3)*3;withA(c,0.6,()=>{glass(c,296,30,290,170,18,[200,210,230],{glow:22,ea:0.6,fill:"rgba(10,14,26,0.7)"});T(c,V.v1,316,72,{w:700,size:20,color:rgba(SOFT,1)});wrapT(c,V.v1f,316,118+wob,254,{f:"mono",w:500,size:20,lh:28});});
    kt_agent(c,520,250,34,1);arrowTo(c,270,150,296,120,[200,210,230],0.7,{head:10,dash:[5,5]});},
  order:(c,w,h,st,L)=>{const V=L.vis;kt_folder(c,40,40,520,250,{title:V.pkg,ts:20});[[70,110,-0.06],[250,150,0.05],[360,96,-0.03]].forEach(([x,y,r],i)=>{c.save();c.translate(x,y);c.rotate(r);glass(c,0,0,200,70,12,KT_AI,{glow:10,ea:0.8,fill:"rgba(6,16,20,0.96)"});T(c,V.cards[i],100,44,{w:800,size:21,align:"center",color:rgba(KT_AI,1)});c.restore();});
    T(c,"?",170,262,{w:800,size:50,align:"center",color:rgba(TRUST,1)});},
  // What lasts, what changes: the four answers in one tray, a shape still to come in the other
  remains:(c,w,h,st,L)=>kt_trays(c,w,h,st,L,"remains",[TRUST,[180,195,235]],[(c,x,y)=>[0,1,2,3].forEach(j=>kt_four(c,j,x-10+(j%2)*20,y-10+Math.floor(j/2)*20,9,1)),
    (c,x,y)=>{c.save();c.setLineDash([4,4]);c.strokeStyle=rgba([180,195,235],0.9);c.lineWidth=2;rr(c,x-18,y-18,36,36,7);c.stroke();c.restore();T(c,"?",x,y+8,{w:800,size:22,align:"center",color:rgba([180,195,235],1)});}]),
  // scenarios: a new pattern, pitched, and the four questions to ask it
  pitch:(c,w,h,st,L)=>{const V=L.vis;c.save();c.setLineDash([8,8]);c.strokeStyle=rgba(SOFT,0.8);c.lineWidth=2;rr(c,30,40,230,250,18);c.stroke();c.restore();
    T(c,V.newPat,145,86,{w:800,size:20,align:"center",color:rgba(SOFT,1)});T(c,"?",145,190,{w:800,size:70,align:"center",color:rgba(SOFT,0.55)});wrapT(c,V.pitch,145,250,200,{w:600,size:15,lh:19,align:"center",color:rgba(SOFT,1)});
    T(c,V.ask,300,62,{w:800,size:20,color:rgba(TRUST,1)});KT_FOUR.forEach((f,j)=>{const y=108+j*52;kt_four(c,j,322,y,19,1);T(c,V.four[j],352,y+7,{w:800,size:22,color:rgba(f[2],1)});});},
  // two credentials that look alike, and the question of merging them
  alike:(c,w,h,st,L)=>{const V=L.vis;[["C-88","Aisha K."],["C-91","Aisha R."]].forEach(([id,who],i)=>{const x=24+i*300;glass(c,x,24,252,200,18,TRUST,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});
      T(c,"id "+id,x+22,60,{f:"mono",w:500,size:18,color:rgba(TRUST,1)});c.fillStyle=rgba(TRUST,0.16);rr(c,x+12,74,228,42,8);c.fill();T(c,who,x+22,104,{w:800,size:26});
      wrapT(c,V.micro,x+22,146,210,{w:600,size:18,lh:22,color:rgba(SOFT,1)});T(c,V.date,x+22,204,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});});
    c.save();c.setLineDash([6,6]);c.strokeStyle=rgba(KT_AI,0.85);c.lineWidth=2.5;c.beginPath();c.moveTo(278,124);c.lineTo(322,124);c.stroke();c.restore();
    tag(c,300,258,V.alike,KT_AI,{align:"center",size:19});T(c,V.merge,300,300,{w:700,size:18,align:"center",color:rgba(SOFT,1)});}
};

/* ---------- What remains: the shapes that keep arriving, and the four answers inside each ---------- */
// each pattern as a small crisp glyph, drawn around (0,0) in a box of about 180 × 110; its colour, name and the people who proposed it
const KT_PAT=[["data vault","Linstedt",[180,150,255],"vaults"],["anchor","Rönnbäck and others",[120,205,240],"anchors"],["hook","Foad",[240,175,115],"hooks"],
  ["Puppini bridge","Puppini and Inmon",[140,170,255],"bridges"],["activity stream","Elsamadisi",[250,140,175],"activity"]];
const KT_STAR=[120,215,155];
// the four answers every shape stores: meaning, identity, grain, time
const KT_FOUR=[["meaning","what a credential is",KIND],["identity","what makes it the same one",TRUST],["grain","what one row holds",PARCH],["time","when each thing was true",[200,160,255]]];
function kt_box(ctx,x,y,w,h,col,lab,o){o=o||{};ctx.fillStyle="rgba(8,14,28,0.95)";rr(ctx,x-w/2,y-h/2,w,h,5);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;rr(ctx,x-w/2,y-h/2,w,h,5);ctx.stroke();
  if(lab)T(ctx,lab,x,y+5,{w:700,size:o.size||13,align:"center",color:rgba(col,1)});}
function kt_ln(ctx,pts,col,a){ctx.strokeStyle=rgba(col,a==null?0.8:a);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();}
function kt_glyph(ctx,k,x,y,s,t){const col=k==="star"?KT_STAR:KT_PAT[k][2];ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  if(k===0){// hubs hold the keys, a link joins them, satellites stack the history under each hub
    kt_ln(ctx,[[-50,-22],[50,-22]],col);[-50,50].forEach(hx=>{[0,1,2].forEach(i=>{kt_ln(ctx,[[hx,-10],[hx,4+i*18]],col,0.4);ctx.fillStyle=rgba(col,0.28+0.12*i);rr(ctx,hx-24,6+i*18,48,12,3);ctx.fill();});kt_box(ctx,hx,-22,56,26,col,"HUB",{size:11});});
    ctx.fillStyle="rgba(8,14,28,0.95)";ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU;ctx.lineTo(Math.cos(an)*17,-22+Math.sin(an)*17);}ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.stroke();}
  else if(k===1){// an anchor for the identity, and one small table per attribute, each with its own history
    for(let i=0;i<6;i++){const an=-Math.PI/2+i/6*TAU,ex=Math.cos(an)*66,ey=Math.sin(an)*44;kt_ln(ctx,[[0,0],[ex,ey]],col,0.5);ctx.fillStyle="rgba(8,14,28,0.95)";ctx.beginPath();ctx.arc(ex,ey,9,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.stroke();}
    ctx.fillStyle=rgba(col,0.95);rr(ctx,-22,-16,44,32,6);ctx.fill();T(ctx,"ID",0,6,{w:800,size:16,align:"center",color:"rgba(8,14,28,1)"});}
  else if(k===2){// a hook for each business concept, and the source data hung from it in bags
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-70,-44);ctx.lineTo(70,-44);ctx.stroke();
    [-44,0,44].forEach((hx,i)=>{const sw=Math.sin((t||0)*1.4+i)*3;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx,-44);ctx.lineTo(hx,-26);ctx.arc(hx-7,-26,7,0,Math.PI*0.9);ctx.stroke();
      ctx.fillStyle=rgba(col,0.3);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hx-14+sw,-12);ctx.quadraticCurveTo(hx-22+sw,26,hx-10+sw,40);ctx.lineTo(hx+10+sw,40);ctx.quadraticCurveTo(hx+22+sw,26,hx+14+sw,-12);ctx.closePath();ctx.fill();ctx.stroke();});}
  else if(k===3){// one bridge table in the middle: every table joins through it, so no number is counted twice
    [-1,1].forEach(sd=>[-34,0,34].forEach(yy=>{kt_ln(ctx,[[sd*20,yy*0.6],[sd*62,yy]],col,0.55);kt_box(ctx,sd*70,yy,34,22,col);}));ctx.fillStyle=rgba(col,0.95);rr(ctx,-18,-48,36,96,6);ctx.fill();T(ctx,"bridge",0,4,{w:800,size:11,align:"center",color:"rgba(8,14,28,1)"});}
  else if(k===4){// one row per thing a learner did, in time order
    kt_ln(ctx,[[-80,20],[80,20]],col,0.7);const L=["enrolled","passed","awarded"];for(let i=0;i<7;i++){const px=-68+i*22.5,on=i%3===0;ctx.fillStyle=rgba(col,on?1:0.5);ctx.beginPath();ctx.arc(px,20,on?7:4.5,0,TAU);ctx.fill();}
    L.forEach((l,i)=>T(ctx,l,-68+i*67.5,-2,{w:700,size:12,align:"center",color:rgba(col,1)}));T(ctx,"time →",80,46,{f:"mono",w:500,size:12,align:"right",color:rgba(SOFT,1)});}
  else if(k==="star"){// a fact at the centre, its dimensions around it
    [[-62,-30],[62,-30],[-62,30],[62,30]].forEach(([dx,dy])=>{kt_ln(ctx,[[0,0],[dx,dy]],col,0.6);kt_box(ctx,dx,dy,44,24,col);});ctx.fillStyle=rgba(col,0.95);rr(ctx,-26,-18,52,36,6);ctx.fill();T(ctx,"fact",0,5,{w:800,size:12,align:"center",color:"rgba(8,14,28,1)"});}
  ctx.restore();}
// the four answers as small icons: a definition, a key, one row, a clock
function kt_four(ctx,j,x,y,r,a){if(a<=0.01)return;const col=KT_FOUR[j][2];withA(ctx,a,()=>{glow(ctx,x,y,r*1.6,col,0.25);ctx.fillStyle="rgba(8,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;ctx.stroke();
  const u=r/20;ctx.save();ctx.translate(x,y);ctx.scale(u,u);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.2;ctx.lineCap="round";
  if(j===0){T(ctx,"Aa",0,5,{w:800,size:15,align:"center",color:rgba(col,1)});ctx.beginPath();ctx.moveTo(-9,10);ctx.lineTo(9,10);ctx.stroke();}
  else if(j===1){ctx.beginPath();ctx.arc(-5,0,6,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(1,0);ctx.lineTo(12,0);ctx.moveTo(8,0);ctx.lineTo(8,5);ctx.moveTo(12,0);ctx.lineTo(12,5);ctx.stroke();}
  else if(j===2){for(let i=0;i<3;i++){ctx.globalAlpha=i===1?1:0.4;ctx.fillRect(-10,-9+i*7,20,4.5);}ctx.globalAlpha=1;}
  else{ctx.beginPath();ctx.arc(0,0,10,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(0,0);ctx.lineTo(5,3);ctx.stroke();}
  ctx.restore();});}
// a pattern's card: its name, who proposed it, its glyph, and (four > 0) the four answers inside it
function kt_patCard(ctx,k,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ghost=k<0,col=ghost?SOFT:k==="star"?KT_STAR:KT_PAT[k][2];
  withA(ctx,a,()=>{if(ghost){ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(SOFT,0.7);ctx.lineWidth=2;rr(ctx,x,y,w,h,18);ctx.stroke();ctx.restore();T(ctx,"next",x+w/2,y+44,{w:800,size:22,align:"center",color:rgba(SOFT,0.9)});T(ctx,"?",x+w/2,y+h/2+22,{w:800,size:64,align:"center",color:rgba(SOFT,0.5)});return;}
    glass(ctx,x,y,w,h,18,col,{glow:12+10*(o.hi||0),ea:0.75,fill:"rgba(7,12,24,0.93)"});
    T(ctx,k==="star"?"star":KT_PAT[k][0],x+w/2,y+44,{w:800,size:22,align:"center",color:rgba(col,1)});if(k!=="star")T(ctx,KT_PAT[k][1],x+w/2,y+70,{w:500,size:15,align:"center",color:rgba(SOFT,1)});
    kt_glyph(ctx,k,x+w/2,y+(o.four?152:162),o.gs||1,t);
    if(o.four)KT_FOUR.forEach((f,j)=>kt_four(ctx,j,x+w/2+(j-1.5)*48,y+h-38,17,o.four[j]||0));});}

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
/* The map before the data: the series' people, drawn like the cast of When things go wrong (its character sheet).
   A new organisation, so a new cast: Tomás Herrera, the enterprise architect in his first weeks at the utility (cyan, the
   technical side), and the people who own parts of the business (gold, the business side), starting with Grace Achieng,
   who runs network operations, Farah Siddiqui, the customer advocate, who speaks for the utility's customers, and Ama Owusu, the regulatory lead, who knows
   what the owner, the regulator and the community expect of it. */
PEOPLE.tomas={name:"Tomás Herrera",role:"Enterprise architect",side:"Technical",does:"produces",edge:TECH,seed:11,
  skin:[214,172,136],hair:{style:"side",c:[44,32,26]},beard:[52,38,30],glasses:[36,40,50],
  top:{kind:"overshirt",c:[78,96,128],inner:[228,232,238]},bottom:{c:[46,50,60]},shoe:[70,52,40],build:{sh:76,hip:60,h:1.0}};
PEOPLE.grace={name:"Grace Achieng",role:"Network operations",side:"Business",does:"produces",edge:BIZ,seed:12,
  skin:[118,80,58],hair:{style:"cropped",c:[30,26,24]},earrings:[255,214,140],
  top:{kind:"blazer",c:[38,98,108],inner:[236,230,220]},bottom:{c:[40,42,50]},shoe:[36,30,30],build:{sh:68,hip:60,h:0.96}};
PEOPLE.farah={name:"Farah Siddiqui",role:"Customer advocate",side:"Business",does:"uses",edge:BIZ,seed:13,
  skin:[196,148,112],hair:{style:"long",c:[34,26,24]},earrings:[255,214,140],
  top:{kind:"cardigan",c:[150,86,104],inner:[238,232,222]},bottom:{c:[46,48,60]},shoe:[40,32,32],build:{sh:66,hip:60,h:0.95}};
PEOPLE.ama={name:"Ama Owusu",role:"Regulatory lead",side:"Business",does:"uses",edge:BIZ,seed:14,
  skin:[132,90,64],hair:{style:"bun",c:[28,24,22]},glasses:[60,46,40],
  top:{kind:"blazer",c:[92,74,128],inner:[236,232,226]},bottom:{c:[44,44,54]},shoe:[40,32,32],build:{sh:68,hip:60,h:0.97}};

/* ===== The map before the data: the series' components =====
   A series on enterprise architecture and why it matters for data. It follows Tomás, a new enterprise architect, through his first
   weeks at a publicly owned energy utility, as he builds a map of how it works. Drawn with the films' primitives (glass, T, tag,
   glow, withA, fin), From words to data's (sheet, pencilText, ring, tick_, arrowTo, wrapT) and In the weeds of data crafting's
   motion (spring, arrive, drift, motes). Everything here is shared by the series' films; each film keeps its own pictures.
   Two materials carry the series' idea: Tomás's drafts are paper (canvases and sticky notes on a wall, slightly crooked), and the
   confirmed model is crisp glass in the layers' conventional colours. A note that moves from the wall to the model changes material. */

/* ---------- colours ---------- */
// the series' colour (sea-green, a map's), and the six layers of the map, in the colours architects conventionally give them
const EAC=[150,222,196];
const LAY6=[["motivation",[200,186,255]],["strategy",[245,206,140]],["business",[255,234,130]],["information",[255,186,150]],["application",[140,214,255]],["technology",[160,224,140]]];
// the three questions that hold the layers, and the layers each one covers
const Q3=[["why, and for whom",0,1],["how it works",2,3],["what runs it",4,5]];
// sticky notes: yellow, pink, blue and green paper
const NOTEC=[[255,228,122],[255,176,196],[164,212,255],[188,236,164]];
const INKD=[40,40,48];

/* ---------- titles ---------- */
// a flat diamond: one layer of the map seen from above
function rhomb(ctx,cx,cy,w,h){ctx.beginPath();ctx.moveTo(cx,cy-h/2);ctx.lineTo(cx+w/2,cy);ctx.lineTo(cx,cy+h/2);ctx.lineTo(cx-w/2,cy);ctx.closePath();}
// the series' mark: three layers stacked, drawn from the top as p goes from 0 to 1, in the colours of the three questions
function eaMark(ctx,x,y,s,a,p){if(a<=0.01)return;p=p==null?1:p;withA(ctx,a,()=>{[0,2,4].forEach((li,i)=>{const q=clamp(p*3-i,0,1);if(q<=0)return;const col=LAY6[li][1],cy=y-s*1.1+i*s*0.62+(1-spring(q*1.4))*-s*0.5;
  withA(ctx,clamp(q*2,0,1),()=>{ctx.save();ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=12;rhomb(ctx,x,cy,s*2.6,s*0.95);ctx.fillStyle=rgba(col,0.16);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=s*0.09;ctx.stroke();ctx.restore();});});});}
// the title card, over whatever the chapter is drawing: the series, the film's title, and where it sits in the series
function eaTitle(ctx,S,t,t0,title,sub,col,n){col=col||EAC;const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{glow(ctx,960,470,480,col,0.08);eaMark(ctx,960,392,30,1,(t-t0-0.5)/1.4);T(ctx,"THE MAP BEFORE THE DATA",960,458,{w:800,size:30,align:"center",color:rgba(col,0.95)});
    T(ctx,title,960,560,{w:800,size:92,align:"center"});if(sub)T(ctx,sub,960,632,{w:600,size:36,align:"center",color:rgba(SOFT,0.95)});
    withA(ctx,fin(t,t0+1.2,0.8),()=>tag(ctx,960,712,n||"enterprise architecture, for data",col,{align:"center",size:28}));});}
function eaEnd(ctx,S,t,t0,title,col,line,n){col=col||EAC;const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)T(ctx,line,960,410,{w:700,size:44,align:"center"});eaMark(ctx,960,540,20,0.95,1);T(ctx,title,960,622,{w:800,size:44,align:"center",color:rgba(col,1)});
    T(ctx,"The map before the data"+(n?" · "+n:"")+" · Learning Data",960,680,{w:600,size:28,align:"center",color:rgba(SOFT,0.9)});});}

/* ---------- the map: six layers ---------- */
// one layer: a slab seen slightly from above (a parallelogram), with its name; fill (0..1) says how much of it is known
function slab(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const k=o.sk==null?h*0.7:o.sk,fl=o.fill||0,hi=o.hi||0;
  withA(ctx,a,()=>{ctx.save();if(hi>0){ctx.shadowColor=rgba(col,0.7*hi);ctx.shadowBlur=26*hi;}
    ctx.beginPath();ctx.moveTo(x+k,y);ctx.lineTo(x+w+k,y);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fillStyle="rgba(7,12,24,0.9)";ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle=rgba(col,0.07+0.26*fl+0.08*hi);ctx.fill();ctx.strokeStyle=rgba(col,0.55+0.4*Math.max(fl,hi));ctx.lineWidth=2;ctx.stroke();
    // the slab's front edge, for depth
    ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y+h+7);ctx.lineTo(x,y+h+7);ctx.closePath();ctx.fillStyle=rgba(mix(col,[0,0,0],0.55),0.8);ctx.fill();ctx.restore();
    if(o.label!==false)T(ctx,name,x+k*0.5+26,y+h/2+(o.size||30)*0.36,{w:800,size:o.size||30,color:rgba(mix(col,INK,0.35),1),deco:o.deco});});}
// the map: six layers from motivation down to technology. o.p draws them from the top; o.fill[i], o.hi[i] per layer; o.br (0..1) the
// three brackets of questions on the left, o.bq[k] each one. Returns each layer's box [x, y, w, h].
function layerStack(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,sh=o.sh||66,gap=o.gap||16,p=o.p==null?1:o.p,R=[];
  LAY6.forEach((L,i)=>R.push([x,y+i*(sh+gap),w,sh]));if(a<=0.01)return R;
  withA(ctx,a,()=>{LAY6.forEach(([nm,col],i)=>{const q=clamp(p*6.5-i*1.0,0,1);if(q<=0)return;const yy=R[i][1]-(1-spring(q*1.4))*40;
      slab(ctx,x,yy,w,sh,nm,col,{a:clamp(q*2.2,0,1),fill:o.fill?o.fill[i]||0:0,hi:o.hi?o.hi[i]||0:0,size:o.size,deco:o.deco});});
    const br=o.br||0;if(br>0)Q3.forEach(([q,i0,i1],k)=>{const v=br*(o.bq?o.bq[k]==null?1:o.bq[k]:1);if(v<=0.01)return;const y0=R[i0][1]+4,y1=R[i1][1]+sh-4,bx=x-28,col=mix(LAY6[i0][1],LAY6[i1][1],0.5);
      withA(ctx,v,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx+12,y0);ctx.lineTo(bx,y0);ctx.lineTo(bx,lerp(y0,y1,ease(clamp(v*1.3,0,1))));if(v>0.75){ctx.lineTo(bx+12,y1);}ctx.stroke();ctx.restore();
        T(ctx,q,bx-22,(y0+y1)/2+11,{w:800,size:o.qsize||32,align:"right",color:rgba(col,1)});});});});
  return R;}

/* ---------- paper: the wall, canvases and sticky notes ---------- */
// a wall to pin drafts to: dark, warm, with a little texture
function wallBg(ctx,S,t,o){o=o||{};setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#2b2620");g.addColorStop(1,"#15120f");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){const x=hash(i,31)*W,y=hash(i,32)*H,r=60+hash(i,33)*200,gg=ctx.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,"rgba(255,240,210,"+(0.012+0.02*hash(i,34))+")");gg.addColorStop(1,"rgba(255,240,210,0)");ctx.fillStyle=gg;ctx.fillRect(x-r,y-r,2*r,2*r);}
  const l=ctx.createRadialGradient(W*0.5,H*0.25,40,W*0.5,H*0.4,W*0.7);l.addColorStop(0,"rgba(255,226,180,"+(o.light==null?0.10:o.light)+")");l.addColorStop(1,"rgba(255,226,180,0)");ctx.fillStyle=l;ctx.fillRect(0,0,W,H);}
// how far a note has been validated: hollow (not started), half (a draft), full (confirmed by its owner); v from 0 to 1 fills it round
function statusDot(ctx,x,y,r,v,col,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,r*0.2);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();
  if(v>0.01){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+TAU*clamp(v,0,1));ctx.closePath();ctx.fill();}ctx.restore();});}
// a sticky note, centred at (cx,cy): paper by default, glass as o.glass goes to 1 (confirmed, part of the model).
// o.col: its paper; o.edge: its glass colour; o.rot; o.p: how much of the text is written; o.src: a source tag clipped to it; o.st: its status (0..1), or none
function sticky(ctx,cx,cy,w,h,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||NOTEC[0],gl=clamp(o.glass||0,0,1),edge=o.edge||col,sz=o.size||Math.round(h*0.2),rot=(o.rot==null?(hash(text.length,7)-0.5)*0.08:o.rot)*(1-gl);
  withA(ctx,a,()=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);
    if(gl<1)withA(ctx,1-gl,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=16;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(col,1);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
      const g=ctx.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,"rgba(0,0,0,0.08)");g.addColorStop(0.18,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(255,255,255,0.10)");ctx.fillStyle=g;ctx.fillRect(-w/2,-h/2,w,h);
      // the corner lifts a little
      ctx.fillStyle="rgba(0,0,0,0.10)";ctx.beginPath();ctx.moveTo(w/2,h/2-16);ctx.lineTo(w/2-16,h/2);ctx.lineTo(w/2,h/2);ctx.closePath();ctx.fill();
      const ls=wrapT(ctx,text,0,0,w-28,{size:sz,w:700,measure:true}),lh=sz*1.18,y0=-((ls.length-1)*lh)/2+sz*0.36;let left=text.length*(o.p==null?1:o.p);
      ls.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;T(ctx,s_,0,y0+i*lh,{w:700,size:sz,align:"center",color:rgba(INKD,0.9),deco:o.deco});});});
    if(gl>0)withA(ctx,gl,()=>{glass(ctx,-w/2,-h/2,w,h,12,edge,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(edge,0.12);rr(ctx,-w/2,-h/2,w,h,12);ctx.fill();
      const ls=wrapT(ctx,text,0,0,w-28,{size:sz,w:700,measure:true}),lh=sz*1.18,y0=-((ls.length-1)*lh)/2+sz*0.36;ls.forEach((l,i)=>T(ctx,l,0,y0+i*lh,{w:700,size:sz,align:"center",color:rgba(INK,0.96),deco:o.deco}));});
    if(o.st!=null)statusDot(ctx,w/2-15,-h/2+15,9,o.st,mix(INKD,edge,gl),1);
    if(o.src)withA(ctx,o.srcA==null?1:o.srcA,()=>{const ss=o.srcSize||28,tw_=tw(ctx,o.src,ss,700)+26;ctx.save();ctx.translate(-w/2+6,h/2-8);ctx.rotate(0.04);ctx.fillStyle="rgba(238,232,218,0.97)";ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=6;ctx.fillRect(0,0,tw_,ss+16);ctx.shadowBlur=0;
      ctx.fillStyle="rgba(150,150,150,0.9)";ctx.fillRect(5,ss*0.45,6,10);T(ctx,o.src,18,ss+5,{w:700,size:ss,color:"rgba(48,48,56,0.95)"});ctx.restore();});
    ctx.restore();});}
// marker lines on paper (a canvas drawn by hand): a slightly wobbly stroke, drawn up to p
function marker(ctx,pts,p,o){o=o||{};if(p<=0)return;const segs=[];let L=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);segs.push(d);L+=d;}let left=L*clamp(p,0,1);
  ctx.save();ctx.strokeStyle=o.col||rgba(INKD,0.85);ctx.lineWidth=o.lw||3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length&&left>0;i++){const f=Math.min(1,left/segs[i-1]),wob=(hash(i,o.seed||5)-0.5)*1.6;ctx.lineTo(lerp(pts[i-1][0],pts[i][0],f)+wob,lerp(pts[i-1][1],pts[i][1],f)-wob);left-=segs[i-1];}ctx.stroke();ctx.restore();}
function circlePts(cx,cy,r,n){const P=[];for(let i=0;i<=n;i++){const an=-Math.PI/2+i/n*TAU;P.push([cx+Math.cos(an)*r,cy+Math.sin(an)*r]);}return P;}
// the value proposition canvas, drawn in marker on a sheet: the value map (a square) and the customer profile (a circle)
function vpCanvas(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.01:o.rot});
  const s=Math.min(w*0.36,h*0.62),sx=x+w*0.08,sy=y+(h-s)/2+14,cx=x+w*0.92-s/2,cy=sy+s/2,lab={size:15,w:700,color:"rgba(60,58,62,0.85)"};
  T(ctx,"value proposition canvas",x+22,y+38,{w:800,size:24,color:"rgba(60,58,62,0.9)",deco:1});
  marker(ctx,[[sx,sy],[sx+s,sy],[sx+s,sy+s],[sx,sy+s],[sx,sy]],clamp(p*2,0,1));marker(ctx,[[sx+s/2,sy+s/2],[sx+s/2,sy]],clamp(p*3-1.2,0,1),{lw:2});marker(ctx,[[sx+s/2,sy+s/2],[sx,sy+s]],clamp(p*3-1.3,0,1),{lw:2});marker(ctx,[[sx+s/2,sy+s/2],[sx+s,sy+s]],clamp(p*3-1.4,0,1),{lw:2});
  marker(ctx,circlePts(cx,cy,s/2,40),clamp(p*2-0.4,0,1));marker(ctx,[[cx,cy],[cx,cy-s/2]],clamp(p*3-1.6,0,1),{lw:2});marker(ctx,[[cx,cy],[cx-s*0.43,cy+s*0.25]],clamp(p*3-1.7,0,1),{lw:2});marker(ctx,[[cx,cy],[cx+s*0.43,cy+s*0.25]],clamp(p*3-1.8,0,1),{lw:2});
  withA(ctx,clamp(p*3-2,0,1),()=>{T(ctx,"what we offer",sx+s/2,sy+s+28,{...lab,align:"center",deco:1});T(ctx,"who we serve",cx,sy+s+28,{...lab,align:"center",deco:1});});});}
// the business model canvas: nine blocks, drawn in marker on a sheet
const BMC9=[["key partners",0,0,1,2],["key activities",1,0,1,1],["key resources",1,1,1,1],["value propositions",2,0,1,2],["relationships",3,0,1,1],["channels",3,1,1,1],["customer segments",4,0,1,2],["costs",0,2,2.5,1],["revenue",2.5,2,2.5,1]];
function bmCanvas(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?0.012:o.rot});
  T(ctx,"business model canvas",x+22,y+38,{w:800,size:24,color:"rgba(60,58,62,0.9)",deco:1});const gx=x+20,gy=y+52,cw=(w-40)/5,ch=(h-72)/3;
  BMC9.forEach(([nm,c,r,cs,rs],i)=>{const q=clamp(p*10-i,0,1);if(q<=0)return;const bx=gx+c*cw,by=gy+r*ch,bw=cs*cw,bh=rs*ch;marker(ctx,[[bx,by],[bx+bw,by],[bx+bw,by+bh],[bx,by+bh],[bx,by]],q,{lw:2.4,seed:i+3});
    withA(ctx,q,()=>T(ctx,nm,bx+10,by+22,{w:700,size:13,color:"rgba(60,58,62,0.8)",deco:1}));});});}

/* ---------- glass: the model ---------- */
// an element of the model, in its layer's colour, with a small glyph in the corner for its kind (o.gs: the glyph's size, 13 by default;
// o.deco: its name is texture, as in a map drawn small, and the legibility check skips it)
function archGlyph(ctx,kind,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="capability"){[[0,2],[1,1],[1,2],[2,0],[2,1],[2,2]].forEach(([i,j])=>ctx.strokeRect(x-s*0.75+i*s*0.5,y-s*0.75+j*s*0.5,s*0.5,s*0.5));}
  else if(kind==="process"){ctx.beginPath();ctx.moveTo(x-s*0.8,y-s*0.25);ctx.lineTo(x+s*0.2,y-s*0.25);ctx.lineTo(x+s*0.2,y-s*0.55);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x+s*0.2,y+s*0.55);ctx.lineTo(x+s*0.2,y+s*0.25);ctx.lineTo(x-s*0.8,y+s*0.25);ctx.closePath();ctx.stroke();}
  else if(kind==="stakeholder"||kind==="role"){ctx.beginPath();ctx.ellipse(x+s*0.5,y,s*0.22,s*0.4,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x+s*0.5,y-s*0.4);ctx.lineTo(x-s*0.5,y-s*0.4);ctx.ellipse(x-s*0.5,y,s*0.22,s*0.4,0,-Math.PI/2,Math.PI/2,true);ctx.lineTo(x+s*0.5,y+s*0.4);ctx.stroke();}
  else if(kind==="goal"){[0.8,0.5,0.18].forEach(r=>{ctx.beginPath();ctx.arc(x,y,s*r,0,TAU);ctx.stroke();});}
  else if(kind==="component"){ctx.strokeRect(x-s*0.45,y-s*0.6,s*1.1,s*1.2);ctx.fillStyle="rgba(7,12,24,1)";[-0.3,0.15].forEach(d=>{ctx.fillRect(x-s*0.7,y+d*s,s*0.5,s*0.25);ctx.strokeRect(x-s*0.7,y+d*s,s*0.5,s*0.25);});}
  else if(kind==="node"){ctx.strokeRect(x-s*0.7,y-s*0.4,s*1.1,s*1.0);ctx.beginPath();ctx.moveTo(x-s*0.7,y-s*0.4);ctx.lineTo(x-s*0.4,y-s*0.7);ctx.lineTo(x+s*0.7,y-s*0.7);ctx.lineTo(x+s*0.4,y-s*0.4);ctx.moveTo(x+s*0.7,y-s*0.7);ctx.lineTo(x+s*0.7,y+s*0.3);ctx.lineTo(x+s*0.4,y+s*0.6);ctx.stroke();}
  else if(kind==="object"){ctx.strokeRect(x-s*0.75,y-s*0.55,s*1.5,s*1.1);ctx.beginPath();ctx.moveTo(x-s*0.75,y-s*0.2);ctx.lineTo(x+s*0.75,y-s*0.2);ctx.stroke();}
  else if(kind==="value"){ctx.beginPath();ctx.ellipse(x,y,s*0.8,s*0.45,0,0,TAU);ctx.stroke();}
  // a value stream, as ArchiMate draws it: a chevron
  else if(kind==="stream"){ctx.beginPath();ctx.moveTo(x-s*0.8,y-s*0.45);ctx.lineTo(x+s*0.35,y-s*0.45);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x+s*0.35,y+s*0.45);ctx.lineTo(x-s*0.8,y+s*0.45);ctx.lineTo(x-s*0.35,y);ctx.closePath();ctx.stroke();}
  // the rest of the motivation layer, as ArchiMate draws it: a driver is a wheel, an assessment a magnifying glass, an outcome a target
  // with an arrow in it, a principle an exclamation mark in a box
  else if(kind==="driver"){ctx.beginPath();ctx.arc(x,y,s*0.55,0,TAU);ctx.stroke();ctx.beginPath();for(let i=0;i<8;i++){const an=i*TAU/8;ctx.moveTo(x+Math.cos(an)*s*0.15,y+Math.sin(an)*s*0.15);ctx.lineTo(x+Math.cos(an)*s*0.8,y+Math.sin(an)*s*0.8);}ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.15,0,TAU);ctx.fill();}
  else if(kind==="assessment"){ctx.beginPath();ctx.arc(x+s*0.15,y-s*0.15,s*0.45,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.17,y+s*0.17);ctx.lineTo(x-s*0.75,y+s*0.75);ctx.stroke();}
  else if(kind==="outcome"){[0.75,0.45,0.15].forEach(r=>{ctx.beginPath();ctx.arc(x-s*0.1,y+s*0.1,s*r,0,TAU);ctx.stroke();});ctx.beginPath();ctx.moveTo(x-s*0.1,y+s*0.1);ctx.lineTo(x+s*0.8,y-s*0.8);ctx.moveTo(x+s*0.8,y-s*0.8);ctx.lineTo(x+s*0.45,y-s*0.8);ctx.moveTo(x+s*0.8,y-s*0.8);ctx.lineTo(x+s*0.8,y-s*0.45);ctx.stroke();}
  // who does the work, as ArchiMate draws it: an actor is a stick figure; a contract is a business object with a second line
  else if(kind==="actor"){ctx.beginPath();ctx.arc(x,y-s*0.55,s*0.25,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y-s*0.3);ctx.lineTo(x,y+s*0.3);ctx.moveTo(x-s*0.45,y-s*0.08);ctx.lineTo(x+s*0.45,y-s*0.08);ctx.moveTo(x-s*0.4,y+s*0.8);ctx.lineTo(x,y+s*0.3);ctx.lineTo(x+s*0.4,y+s*0.8);ctx.stroke();}
  else if(kind==="contract"){ctx.strokeRect(x-s*0.75,y-s*0.55,s*1.5,s*1.1);ctx.beginPath();ctx.moveTo(x-s*0.75,y-s*0.2);ctx.lineTo(x+s*0.75,y-s*0.2);ctx.moveTo(x-s*0.75,y+s*0.15);ctx.lineTo(x+s*0.75,y+s*0.15);ctx.stroke();}
  // what it has, and the path to a target, as ArchiMate draws them: a resource is a capsule with bars, like a battery; a plateau is
  // three stepped lines; a gap is an ellipse crossed by two lines
  else if(kind==="resource"){rr(ctx,x-s*0.8,y-s*0.42,s*1.5,s*0.84,s*0.3);ctx.stroke();ctx.fillRect(x+s*0.7,y-s*0.16,s*0.14,s*0.32);[-0.45,-0.15,0.15].forEach(d=>{ctx.beginPath();ctx.moveTo(x+d*s,y-s*0.22);ctx.lineTo(x+d*s,y+s*0.22);ctx.stroke();});}
  else if(kind==="plateau"){ctx.beginPath();[[-0.4,-0.45],[-0.1,0],[0.2,0.45]].forEach(([dx,dy])=>{ctx.moveTo(x+(dx-0.45)*s,y+dy*s);ctx.lineTo(x+(dx+0.45)*s,y+dy*s);});ctx.stroke();}
  else if(kind==="gap"){ctx.beginPath();ctx.ellipse(x,y,s*0.6,s*0.45,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.9,y-s*0.15);ctx.lineTo(x+s*0.9,y-s*0.15);ctx.moveTo(x-s*0.9,y+s*0.15);ctx.lineTo(x+s*0.9,y+s*0.15);ctx.stroke();}
  else if(kind==="principle"){ctx.strokeRect(x-s*0.6,y-s*0.7,s*1.2,s*1.4);ctx.beginPath();ctx.moveTo(x,y-s*0.45);ctx.lineTo(x,y+s*0.15);ctx.stroke();ctx.beginPath();ctx.arc(x,y+s*0.42,s*0.08,0,TAU);ctx.fill();}
  ctx.restore();}
function archEl(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const r=kind==="capability"||kind==="process"||kind==="value"?16:6;
  glass(ctx,x,y,w,h,r,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.16+0.1*(o.hi||0));rr(ctx,x,y,w,h,r);ctx.fill();
  const gs=o.gs||13;archGlyph(ctx,kind,x+w-gs-11,y+gs+9,gs,col);const sz=o.size||28,ls=wrapT(ctx,name,0,0,w-64,{size:sz,w:700,measure:true});wrapT(ctx,name,x+w/2-8,y+h/2+sz*0.36-(ls.length-1)*sz*0.58,w-64,{size:sz,w:700,align:"center",color:rgba(INK,0.96),lh:sz*1.15,deco:o.deco});});}

/* ---------- small things ---------- */
// a data rule, as the data series draw one: a card with a monospaced kicker
function ruleCard(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const col=o.col||[170,205,255],sz=o.size||32,ls=wrapT(ctx,text,0,0,w-48,{size:sz,w:700,measure:true}),h=84+ls.length*sz*1.25;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.95)"});T(ctx,o.kicker||"data rule",x+24,y+42,{f:"mono",w:500,size:28,color:rgba(col,1)});
    ls.forEach((l,i)=>T(ctx,l,x+24,y+88+i*sz*1.25,{w:700,size:sz}));});return h;}
// an owner's tick, in gold: a person who owns that part of the business says it's right
function ownerTick(ctx,x,y,r,a){kt_gtick(ctx,x,y,r,a);}

/* ---------- the canvases, labelled, for notes to be pinned into ---------- */
// The value proposition canvas, at a size to work on: the value map (a square: products and services on the left, gain creators
// top right, pain relievers bottom right) and the customer profile (a circle: gains top left, pains bottom left, jobs on the right).
// Returns where each section is, so notes can be placed in it: VPC.where(x,y,w,h)[section] = [cx, cy].
const VPC={secs:["products and services","gain creators","pain relievers","gains","pains","customer jobs"],
  geo(x,y,w,h){const s=Math.min(w*0.38,h*0.74),sx=x+w*0.05,sy=y+(h-s)/2+18,r=s/2,cx=x+w*0.95-r,cy=sy+r;return{s,sx,sy,r,cx,cy};},
  where(x,y,w,h){const g=VPC.geo(x,y,w,h);return{"products and services":[g.sx+g.s*0.25,g.sy+g.s*0.5],"gain creators":[g.sx+g.s*0.75,g.sy+g.s*0.27],"pain relievers":[g.sx+g.s*0.75,g.sy+g.s*0.73],
    "gains":[g.cx-g.r*0.42,g.cy-g.r*0.45],"pains":[g.cx-g.r*0.42,g.cy+g.r*0.45],"customer jobs":[g.cx+g.r*0.48,g.cy]};}};
// p draws it; o.title names it; o.lab (0..1) shows the section names; o.hi[section] lights one
function vpCanvas2(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.006:o.rot});const g=VPC.geo(x,y,w,h),hi=o.hi||{};
  T(ctx,o.title||"value proposition canvas",x+26,y+42,{w:800,size:o.titleSize||28,color:"rgba(60,58,62,0.9)",deco:o.titleSize<28||o.titleDeco});
  const glowSec=(k,fn)=>{const v=hi[k]||0;if(v>0)withA(ctx,v,()=>{ctx.save();fn();ctx.fillStyle="rgba(255,200,90,0.22)";ctx.fill();ctx.restore();});};
  glowSec("products and services",()=>{ctx.beginPath();ctx.rect(g.sx,g.sy,g.s/2,g.s);});glowSec("gain creators",()=>{ctx.beginPath();ctx.rect(g.sx+g.s/2,g.sy,g.s/2,g.s/2);});glowSec("pain relievers",()=>{ctx.beginPath();ctx.rect(g.sx+g.s/2,g.sy+g.s/2,g.s/2,g.s/2);});
  glowSec("gains",()=>{ctx.beginPath();ctx.moveTo(g.cx,g.cy);ctx.arc(g.cx,g.cy,g.r,Math.PI,Math.PI*1.5);ctx.closePath();});glowSec("pains",()=>{ctx.beginPath();ctx.moveTo(g.cx,g.cy);ctx.arc(g.cx,g.cy,g.r,Math.PI*0.5,Math.PI);ctx.closePath();});
  glowSec("customer jobs",()=>{ctx.beginPath();ctx.moveTo(g.cx,g.cy);ctx.arc(g.cx,g.cy,g.r,-Math.PI/2,Math.PI/2);ctx.closePath();});
  marker(ctx,[[g.sx,g.sy],[g.sx+g.s,g.sy],[g.sx+g.s,g.sy+g.s],[g.sx,g.sy+g.s],[g.sx,g.sy]],clamp(p*2,0,1));marker(ctx,[[g.sx+g.s/2,g.sy],[g.sx+g.s/2,g.sy+g.s]],clamp(p*3-1.2,0,1),{lw:2});marker(ctx,[[g.sx+g.s/2,g.sy+g.s/2],[g.sx+g.s,g.sy+g.s/2]],clamp(p*3-1.3,0,1),{lw:2});
  marker(ctx,circlePts(g.cx,g.cy,g.r,48),clamp(p*2-0.4,0,1));marker(ctx,[[g.cx,g.cy-g.r],[g.cx,g.cy+g.r]],clamp(p*3-1.6,0,1),{lw:2});marker(ctx,[[g.cx-g.r,g.cy],[g.cx,g.cy]],clamp(p*3-1.7,0,1),{lw:2});
  withA(ctx,clamp(p*3-2,0,1)*(o.lab==null?1:o.lab),()=>{const L={size:16,w:800,color:"rgba(70,66,70,0.75)",deco:1};
    T(ctx,"products & services",g.sx+12,g.sy+26,L);T(ctx,"gain creators",g.sx+g.s/2+12,g.sy+26,L);T(ctx,"pain relievers",g.sx+g.s/2+12,g.sy+g.s/2+26,L);
    T(ctx,"gains",g.cx-g.r*0.62,g.cy-g.r*0.78,L);T(ctx,"pains",g.cx-g.r*0.62,g.cy+g.r*0.86,L);T(ctx,"customer jobs",g.cx+14,g.cy-g.r*0.78,L);
    T(ctx,"value map",g.sx+g.s/2,g.sy+g.s+30,{...L,align:"center"});T(ctx,"customer profile",g.cx,g.sy+g.s+30,{...L,align:"center"});});});}
// where each block of the business model canvas is, for bmCanvas(x,y,w,h): BMC_AT(x,y,w,h,i) = [bx, by, bw, bh]
function BMC_AT(x,y,w,h,i){const gx=x+20,gy=y+52,cw=(w-40)/5,ch=(h-72)/3,[,c,r,cs,rs]=BMC9[i];return[gx+c*cw,gy+r*ch,cs*cw,rs*ch];}

/* ---------- legibility: big enough for a phone ---------- */
// The films are drawn at 1920 by 1080. A phone held sideways, full screen, shows that about 850 pixels wide, so the smallest text that
// reads comfortably there is about 28 px in the frame: tools/legible.py checks every piece of text against it. Text marked deco:1
// (a scrolling list of systems, a canvas's printed headings) is texture, not something to read, and the check skips it.
const MINT=28;
// a year and place, in the corner, large enough to read
function eaYear(ctx,x,y,s,col,a){if(a==null)a=1;if(a<=0.01)return;withA(ctx,a,()=>{const c=col||CLAY,w=tw(ctx,s,28,500,"mono")+52;glass(ctx,x,y-30,w,60,30,c,{glow:14,ea:0.8,fill:"rgba(26,16,10,0.9)"});
  ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x+24,y,6,0,TAU);ctx.fill();T(ctx,s,x+40,y+10,{f:"mono",w:500,size:28,color:rgba(c,1)});});}
// the camera, moving in on what the narration is about: keys are [time, x, y, zoom], each move eased over d seconds (default 1.4);
// call after the background, before drawing the scene. Combine with drift for the slow push of every shot.
function focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return z;}
// how far the camera is zoomed in at t, for the same keys: a whole canvas seen from afar is context, and its notes are decoration
function focusZ(t,keys,d){d=d||1.4;let z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;z=lerp(z,keys[i][3],u);}return z;}

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

/* ===== Kept, not cleaned: the places and the pictures =====
   The places are painted once and kept (post.js): Dujiangyan in the flood season and in the dry season, the campus, the paper with a
   little sky and land for the chapters that explain, a second one for the industries, and three offices: Mei's, the admissions
   office and Yusuf's. The pictures are the film's own things: the river's channels, its gravel, the tripods that close the inner
   channel, the diggers, the cut through the riverbed with its stone horse and iron bars, and the rule; the clean-up's board and the
   chart of duplicates waiting; the intakes' new duplicates and the two applications that made them; the search before create; the
   steward's five gauges, each with an iron bar at its limit; the alert and its case; the government's list of visa types and the
   change an agent drafts; the governance scorecard; and a bank's duplicates, cleaned up every three years. Every name starts with
   m9_ (this film) or M9_. */

// Yusuf Demir, the data governance lead, as the series on data governance draws him (its shared people.js)
if(!PEOPLE.yusuf)PEOPLE.yusuf={name:"Yusuf Demir",role:"Data governance lead",side:"Business",does:"uses",edge:BIZ,seed:15,
  skin:[204,160,124],hair:{style:"side",c:[38,30,28]},beard:[44,34,30],
  top:{kind:"blazer",c:[150,84,62],inner:[236,232,222]},bottom:{c:[52,56,70]},shoe:[70,48,36],build:{sh:74,hip:60,h:1.0}};


/* ---------- lines ---------- */
// a line's length, kept on it
function m9_lens(line){if(line._c)return line._c;const c=[0];for(let i=1;i<line.length;i++)c.push(c[i-1]+Math.hypot(line[i][0]-line[i-1][0],line[i][1]-line[i-1][1]));return line._c=c;}
// the point at u (0..1) of a line's length, and the line's heading there
function m9_at(line,u){const c=m9_lens(line),L=c[c.length-1],d=clamp(u,0,1)*L;let i=1;while(i<c.length-1&&c[i]<d)i++;const k=(d-c[i-1])/((c[i]-c[i-1])||1),a=line[i-1],b=line[i];
  return[lerp(a[0],b[0],k),lerp(a[1],b[1],k),Math.atan2(b[1]-a[1],b[0]-a[0])];}
// the part of a line from u0 to u1 of its length
function m9_sub(line,u0,u1){const c=m9_lens(line),L=c[c.length-1],d0=clamp(u0,0,1)*L,d1=clamp(u1,0,1)*L,o=[m9_at(line,u0).slice(0,2)];
  for(let i=1;i<line.length-1;i++)if(c[i]>d0&&c[i]<d1)o.push(line[i]);o.push(m9_at(line,u1).slice(0,2));return o;}

/* ---------- Dujiangyan ---------- */
// from above the plain, looking up the valley: the Min comes out of a gorge and splits at the levee's head, the fish mouth, and runs on
// past the bottom right as the outer channel; the inner channel runs down the levee's other side, round the foot of the hill, through
// the cut in the rock, and fans out into the plain's canals. Each is a centre line with a width (nearer is wider), so the water, the
// gravel and the diggers can follow it
const M9_MAIN=wc_smooth([[1052,322],[1036,360],[1022,396],[1016,430],[1046,478],[1084,528],[1120,580],[1158,636],[1210,692],[1306,750],[1474,810],[1702,864],[2030,914]],8),
  M9_WMAIN=u=>u<0.188?lerp(74,142,u/0.188):u<0.262?lerp(142,108,(u-0.188)/0.074):lerp(108,300,(u-0.262)/0.738),M9_SPLIT=0.21,M9_SEEN=0.05,M9_HEAD=0.088;
const M9_IN=wc_smooth([[998,428],[968,470],[944,520],[922,568],[896,612],[850,644],[782,662],[706,672],[640,676],[590,680]],8),
  M9_WIN=u=>u<0.06?lerp(14,56,u/0.06):lerp(56,38,(u-0.06)/0.94);
// the canals the inner channel fans into on the plain, each leaving another (the first leaves the cut) and dividing again, a little
// uneven, as dug. Each keeps its line (p), its width (w: nearer is wider), its length (L), and how far the water has come from the cut
// when it reaches its head (d0), so the water can fill them in order, and drain them
const M9_CAN=(()=>{const net=[[-1,0,[[624,678],[590,680],[540,688],[470,700],[400,716]]],[0,1,[[320,704],[220,688],[100,676],[-60,668]]],
  [0,1,[[352,754],[292,804],[200,866]]],[2,1,[[110,880],[-60,902]]],[2,1,[[172,940],[134,1020],[96,1100]]],
  [0,0.36,[[512,756],[498,846],[482,960],[468,1100]]],[1,0.42,[[196,648],[100,626],[-60,612]]],[5,0.5,[[440,830],[352,862],[250,908],[150,960],[60,1020]]]],o=[];
  net.forEach(([pa,f,pts],i)=>{const head=pa<0?pts[0]:m9_at(o[pa].p,f).slice(0,2),p=wc_jitter(wc_smooth(pa<0?pts:[head].concat(pts),10),2.4,60+i,0.02);p[0]=head;
    const c={p,L:m9_lens(p)[p.length-1],d0:pa<0?0:o[pa].d0+o[pa].L*f,lv:pa<0?0:o[pa].lv+1};
    c.w=u=>(c.lv?[0,11,8,7][Math.min(3,c.lv)]:u<0.15?37:lerp(37,13,(u-0.15)/0.85))*(1+clamp((m9_at(p,u)[1]-690)/410,0,1)*0.55);o.push(c);});return o;})(),
  M9_CDMAX=Math.max(...M9_CAN.map(c=>c.d0+c.L));
// where the tripods close the inner channel, near its head
const M9_CLOSE=0.12;
// a band along a line, its width wf(u) at u of the way along, times k
function m9_band(line,wf,k){k=k||1;const L=[],R=[],n=line.length;for(let i=0;i<n;i++){const a=line[Math.max(0,i-1)],b=line[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,
  w=(typeof wf==="function"?wf(i/(n-1)):wf)*k/2;L.push([line[i][0]-dy/l*w,line[i][1]+dx/l*w]);R.push([line[i][0]+dy/l*w,line[i][1]-dx/l*w]);}return L.concat(R.reverse());}
// a line's edge, at w/2 to its left (s=1) or right (s=-1), plus pad
function m9_edge(line,wf,s,pad){const n=line.length;return line.map((p,i)=>{const a=line[Math.max(0,i-1)],b=line[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,
  ww=((typeof wf==="function"?wf(i/(n-1)):wf)/2+(pad||0))*s;return[p[0]-dy/l*ww,p[1]+dx/l*ww];});}
// the hill the inner channel runs along, ending at the cut; the separated rock across the cut
const M9_HILLTOP=[[598,636],[584,596],[594,552],[622,512],[668,476],[724,450],[782,434],[836,428],[882,436],[918,450],[948,462]];
// the hill's edge along the inner channel: close to the water, but higher at the cut, where its rock wall stands over the water
function m9_cutPad(x){return lerp(12,30,clamp((722-x)/60,0,1));}
function m9_hillPts(){const n=M9_IN.length;return M9_HILLTOP.concat(M9_IN.map((p,i)=>m9_edge(M9_IN,M9_WIN,1,m9_cutPad(p[0]))[i]).filter(p=>p[1]>468&&p[0]>612));}
const M9_ROCK=wc_smooth([[620,704],[652,692],[704,690],[744,698],[764,714],[740,734],[680,742],[634,734]],4);
// the levee between the channels, from the fish mouth down, where its trees stand
const M9_LEVEE=wc_smooth([[1004,470],[1004,506],[1008,540],[1014,572],[1024,606]],6);
// how far up the valley's floor reaches, below the mountains
const m9_floor=x=>338+0.074*Math.abs(x-1030)+6*Math.sin(x/140);
// the colours of the two seasons
const M9_WET={far:[176,198,210],range:[146,178,172],flank:[124,162,136],forest:[98,140,112],floor:[170,200,136],
  fields:[[156,194,112],[178,204,124],[222,206,104],[146,184,116],[196,206,134],[170,196,150]],tree:[92,142,92],hill:[124,166,110],crown:[[86,138,88],[110,160,98],[140,182,112]],
  bank:[228,216,184],rock:[178,164,146]};
const M9_DRY={far:[192,200,208],range:[172,184,180],flank:[160,172,152],forest:[134,152,128],floor:[208,204,166],
  fields:[[214,206,168],[202,198,154],[186,196,144],[220,208,176],[198,192,162],[180,192,150]],tree:[112,146,104],hill:[152,170,128],crown:[[112,140,100],[134,158,112],[164,180,132]],
  bank:[216,208,188],rock:[184,172,156]};
const M9_GRAVEL=[[176,168,156],[198,188,170],[150,144,138],[214,204,186]];

// the mountains: three ranges, paler as they go back, forest on the nearer slopes, and the gorge the Min comes out of
function m9_mountains(ctx,C){
  wc_land(ctx,x=>222-70*Math.exp(-Math.pow((x-250)/170,2))-98*Math.exp(-Math.pow((x-770)/150,2))-60*Math.exp(-Math.pow((x-1270)/200,2))-94*Math.exp(-Math.pow((x-1690)/150,2))+5*Math.sin(x/37),C.far,0.16,{line:false});
  const rg=x=>268-84*Math.exp(-Math.pow((x-470)/220,2))-56*Math.exp(-Math.pow((x-1010)/110,2))-104*Math.exp(-Math.pow((x-1480)/230,2))+6*Math.sin(x/53+1);
  wc_land(ctx,rg,C.range,0.32,{line:false});wc_forest(ctx,x=>rg(x)+18,C.range,0.36,41,{h:20,w:14});
  const fl=x=>318-150*Math.exp(-Math.pow((x-470)/260,2))-170*Math.exp(-Math.pow((x-1560)/290,2))-30*Math.exp(-Math.pow((x-900)/80,2))-30*Math.exp(-Math.pow((x-1180)/80,2))+7*Math.sin(x/61);
  wc_land(ctx,fl,C.flank,0.5,{line:false});wc_forest(ctx,x=>fl(x)+22,C.forest,0.52,43,{h:26,w:16});}
// M9_SEEN: how far along the Min it comes out from behind the ridges; M9_HEAD: where the inner channel leaves it
// the gorge's two sides: nearer ridges, darker, conifers along their crests and trees down to the water; the right one first, the left
// one over it and over the Min, so the river comes out from behind it. Each is its crest, then its foot from right to left
const M9_GORGE=[[wc_smooth([[1500,352],[1420,318],[1330,282],[1240,262],[1160,266],[1100,290],[1062,322],[1046,348]],5),[[1046,348],[1090,362],[1200,366],[1340,362],[1500,358]]],
  [wc_smooth([[600,356],[690,330],[780,294],[858,266],[930,270],[990,294],[1040,322],[1084,350]],5),[[1084,350],[1060,368],[1010,378],[930,376],[800,370],[680,366],[600,362]]]];
function m9_gorge(ctx,C){M9_GORGE.forEach(([crest,foot],i)=>{const R=wc_rng(81+i),top=[],cr=wc_resampleOpen(crest,9);
  cr.forEach((p,k)=>{top.push(k%2?[p[0],p[1]-(8+R()*12)]:[p[0],p[1]+2]);});
  wc_wash(ctx,top.concat(foot.slice(1)),C.forest,{kind:"forest",line:false,depth:0.66,seed:301+i*40});
  // darker towards the water and the valley, where the trees stand thicker
  ctx.save();wc_tr(ctx,top.concat(foot.slice(1)));ctx.clip();ctx.globalCompositeOperation="multiply";const b=wc_bbox(foot.concat(crest)),g=ctx.createLinearGradient(0,b.y0,0,b.y1+6);
  g.addColorStop(0,rgba(wc_dim(C.forest,0.3),0));g.addColorStop(1,rgba(wc_dim(C.forest,0.3),0.42));ctx.fillStyle=g;ctx.fillRect(b.x0-20,b.y0-30,b.w+40,b.h+60);ctx.restore();
  // broadleaf trees along the foot, thicker by the water
  const ft=wc_smooth(foot,4);m9_canopy(ctx,wc_band(ft,30,12),[wc_dim(C.crown[0],0.08),C.crown[0]],Math.round(m9_lens(ft)[ft.length-1]/16),311+i,0.62,0.7);});}
// the plots of the valley and the plain, in perspective towards the gorge: rows that widen as they come nearer, cut into plots, a few
// of them split again; the nearest show their furrows
function m9_fields(ctx,C,seed){const R=wc_rng(seed),yh=262,vx=1030,yr=800,rows=[];for(let b=0;;b++){const y=yh+64*Math.pow(1.2,b)+(b?R()*10:0);rows.push(y);if(y>H+60)break;}
  const X=(u,y)=>vx+(u-vx)*(y-yh)/(yr-yh);
  for(let r=0;r<rows.length-1;r++){const y0=rows[r],y1=rows[r+1],us=[];for(let u=-3800+R()*200;u<4600;u+=170+R()*260)us.push(u);
    for(let k=0;k<us.length-1;k++){const g=0.8+0.16*r,x00=X(us[k],y0)+g,x01=X(us[k+1],y0)-g,x10=X(us[k],y1)+g,x11=X(us[k+1],y1)-g;
      if(Math.max(x01,x11)<-60||Math.min(x00,x10)>W+60)continue;const dp=0.45+0.55*clamp((y0-340)/560,0,1);
      const plot=(a,b,c,d,col,sd)=>wc_wash(ctx,[a,b,c,d],col,{kind:"field",line:false,depth:dp,a:0.72+R()*0.22,seed:sd});
      const c1=C.fields[Math.floor(R()*C.fields.length)];
      if(r>3&&R()<0.3){const m0=lerp(x00,x01,0.5),m1=lerp(x10,x11,0.5);plot([x00,y0+g],[m0-g,y0+g],[m1-g,y1-g],[x10,y1-g],c1,r*31+k);
        plot([m0+g,y0+g],[x01,y0+g],[x11,y1-g],[m1+g,y1-g],C.fields[Math.floor(R()*C.fields.length)],r*37+k);}
      else plot([x00,y0+g],[x01,y0+g],[x11,y1-g],[x10,y1-g],c1,r*31+k);
      if(y0>640&&R()<0.5){ctx.save();ctx.strokeStyle=rgba(wc_dim(c1,0.25),0.22);ctx.lineWidth=1.2;for(let f=0.15;f<1;f+=0.17){ctx.beginPath();ctx.moveTo(lerp(x00,x01,f),y0+g+2);ctx.lineTo(lerp(x10,x11,f),y1-g-2);ctx.stroke();}ctx.restore();}}}}
// the plain's villages: clumps of trees and bamboo, a low house showing here and there; nearer is larger
const M9_CLUMPS=[[70,470],[250,452],[420,500],[150,560],[330,590],[70,650],[460,610],[240,690],[420,760],[120,800],[300,830],[660,770],[800,820],[960,760],[1120,820],[1180,700],
  [1330,660],[1500,620],[1640,700],[1800,640],[1600,540],[1420,520],[1260,560],[1760,500],[860,380],[1180,400],[1340,440],[560,440],[740,840],[1020,880],[1880,780]];
function m9_clumps(ctx,C){const R=wc_rng(19);M9_CLUMPS.forEach(([x,y],i)=>{const s=0.42+clamp((y-400)/500,0,1)*1.05,dp=0.55+0.4*clamp((y-400)/500,0,1),col=i%3?C.tree:wc_lit(C.tree,0.08);
  m9_clump(ctx,x,y,s,col,dp,200+i*7);
  // a low house showing at the clump's foot: white walls, a grey tiled roof
  if(R()<0.45){const hx=x+(R()-0.5)*36*s,hy=y+2*s;wc_flat(ctx,wc_rect(hx-14*s,hy-11*s,28*s,11*s),[244,240,230],dp,"wall");wc_flat(ctx,[[hx-18*s,hy-10*s],[hx+18*s,hy-10*s],[hx+12*s,hy-19*s],[hx-12*s,hy-19*s]],[112,114,124],dp,"roof");}});}
// a clump of trees: one silhouette whose edge is its crowns, a few crowns' shaded sides, darker underneath, and its shadow on the field
function m9_clump(ctx,x,y,s,col,dp,seed){const R=wc_rng(seed),rx=(34+R()*20)*s,ry=(22+R()*10)*s,hull=[];
  for(let i=0;i<=12;i++){const a=Math.PI+i/12*Math.PI;hull.push([x+Math.cos(a)*rx,y-ry*0.2+Math.sin(a)*ry*(0.82+0.3*Math.sin(i*1.7+seed))]);}hull.push([x+rx*0.9,y+ry*0.06],[x-rx*0.9,y+ry*0.06]);
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_haze(wc_dim(col,0.4),dp),0.26);ctx.beginPath();ctx.ellipse(x+rx*0.28,y+ry*0.16,rx*1.04,ry*0.26,0,0,TAU);ctx.fill();ctx.restore();
  wc_wash(ctx,m9_scallop(hull,10*s+5,seed),col,{kind:"land",line:false,depth:dp,seed});
  const sh=[m9_crescent(x,y-ry*0.42,rx*0.92,ry*0.62)];for(let k=0,n=2+Math.floor(R()*3);k<n;k++)sh.push(m9_crescent(x+(R()-0.5)*rx*1.2,y-ry*(0.45+R()*0.45),rx*0.3,ry*0.36));
  wc_wash(ctx,sh,wc_dim(col,0.24),{kind:"dab",flat:true,depth:dp,a:0.5,seed:seed+3});}
// a shape's edge, resampled every s px, each step bulging outward in an arc: the edge of a wood is its trees' crowns. Turned the way
// wc_ell turns, so it joins with crowns in one wash
function m9_scallop(pts,s,seed){const R=wc_rng(seed),p=wc_resample(pts,s);let A=0;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];A+=a[0]*b[1]-b[0]*a[1];}
  const sg=A>0?1:-1,o=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,h=l*(0.28+R()*0.22);
    for(let k=0;k<6;k++){const t=k/6,bu=Math.sin(Math.PI*t)*h;o.push([a[0]+dx*t+dy/l*sg*bu,a[1]+dy*t-dx/l*sg*bu]);}}return A>0?o:o.reverse();}
// a crown's shaded side, away from the light at the top left: a crescent, thick at the bottom right, thin at the left
function m9_crescent(x,y,rx,ry){const o=[],a0=-0.35,da=Math.PI+0.2;for(let i=0;i<=10;i++){const a=a0+i/10*da;o.push([x+Math.cos(a)*rx,y+Math.sin(a)*ry]);}
  for(let i=10;i>=0;i--){const a=a0+i/10*da;o.push([x-rx*0.18+Math.cos(a)*rx*0.8,y-ry*0.3+Math.sin(a)*ry*0.72]);}return o;}
// a wood over an area: one wash whose edge is the crowns', then each crown's shaded side, the crescents joining where they meet, so the
// trees read as a wood, not as spots. cols: [shade, body]; n crowns of size sz (nearer, lower ones a little larger)
function m9_canopy(ctx,pts,cols,n,seed,sz,dp){dp=dp||0.75;sz=sz||1;const R=wc_rng(seed),b=wc_bbox(pts),sh=[],M=ctx.getTransform();ctx.save();wc_tr(ctx,pts);
  // (the path test is in the canvas's own pixels, so each point goes through the drawing's transform first, for a valley painted larger)
  for(let i=0,tries=0;i<n&&tries<n*20;tries++){const x=b.x0+R()*b.w,y=b.y0+R()*b.h,d=M.transformPoint(new DOMPoint(x,y));if(!ctx.isPointInPath(d.x,d.y))continue;i++;
    const s=sz*(0.75+clamp((y-b.y0)/Math.max(1,b.h),0,1)*0.5)*(0.8+R()*0.4);sh.push(m9_crescent(x,y,17*s,14*s));}ctx.restore();
  wc_wash(ctx,m9_scallop(pts,24*sz,seed),cols[1],{kind:"land",line:false,depth:dp,seed});wc_wash(ctx,sh,cols[0],{kind:"dab",flat:true,depth:dp,a:0.62,seed:seed+1});}
// a thin shape washed flat: cleared to paper and filled along the same edge, so no paper shows round it
function m9_flat(ctx,pts,col,a,seed,gran){const p=wc_jitter(wc_resample(pts,8),0.8,seed||5,0.08);ctx.save();wc_tr(ctx,p);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fill();
  ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(col,a==null?0.85:a);ctx.fill();if(gran){ctx.clip();ctx.globalAlpha*=0.55;ctx.drawImage(WC.gran,0,0,W,H);}ctx.restore();}
// a channel's banks of sand and gravel, then its water (lower in the dry season: k of its width)
function m9_bank(ctx,line,wf,C,pad){wc_wash(ctx,m9_band(line,u=>wf(u)+pad[0]+(pad[1]-pad[0])*u),C.bank,{kind:"ground",line:false,seed:11});}
// a bed of gravel, bare: the dry inner channel, pebbles and all
function m9_bed(ctx,line,wf,seed){const R=wc_rng(seed||23);wc_wash(ctx,m9_band(line,wf),M9_GRAVEL[1],{kind:"ground",line:false,seed:29});
  for(let i=0;i<300;i++){const u=0.04+R()*0.96,p=m9_at(line,u),ww=wf(u)*0.46,o=(R()*2-1)*ww,x=p[0]-Math.sin(p[2])*o,y=p[1]+Math.cos(p[2])*o,r=1.4+R()*2.2;
    wc_wash(ctx,wc_ell(x,y,r*1.3,r,8),M9_GRAVEL[i%4],{kind:"dab",flat:true,a:0.8});}}
// where two segments cross: [how far along the first, along the second, the point], or null
function m9_cross(p,q,a,b){const d=(q[0]-p[0])*(b[1]-a[1])-(q[1]-p[1])*(b[0]-a[0]);if(Math.abs(d)<1e-9)return null;
  const s=((a[0]-p[0])*(b[1]-a[1])-(a[1]-p[1])*(b[0]-a[0]))/d,t=((a[0]-p[0])*(q[1]-p[1])-(a[1]-p[1])*(q[0]-p[0]))/d;return s>=0&&s<1&&t>=0&&t<1?[s,t,[p[0]+(q[0]-p[0])*s,p[1]+(q[1]-p[1])*s]]:null;}
function m9_inside(pts,x,y){let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
// two shapes turned the same way as one outline, when the second's outline leaves the first once and comes back once (a channel leaving
// a river): the second's outline outside the first, then the first's, so the water is one wash with no edge where the channel leaves
function m9_merge(A,B){const X=[],n=A.length,m=B.length;for(let j=0;j<m;j++)for(let i=0;i<n;i++){const h=m9_cross(B[j],B[(j+1)%m],A[i],A[(i+1)%n]);if(h)X.push({j,i,s:h[0],t:h[1],pt:h[2]});}
  if(X.length!==2)return[A,B];X.sort((u,v)=>(u.j+u.s)-(v.j+v.s));const [X0,X1]=X,mid=X0.j<X1.j?B[X0.j+1]:[(X0.pt[0]+X1.pt[0])/2,(X0.pt[1]+X1.pt[1])/2];
  let P,Q,part=[];if(!m9_inside(A,mid[0],mid[1])){P=X0;Q=X1;for(let j=X0.j+1;j<=X1.j;j++)part.push(B[j]);}else{P=X1;Q=X0;for(let j=X1.j+1;j<X1.j+1+((X0.j-X1.j+m)%m);j++)part.push(B[j%m]);}
  const o=[P.pt].concat(part,[Q.pt]);let k=Q.i;do{k=(k+1)%n;o.push(A[k]);}while(k!==P.i);return o;}
// the river's water, the Min on as the outer channel (k: how full it is below the split), and the inner channel's down to u1 of its
// length, as one wash; the inner channel and its canals also on their own, kept, so in the dry season the water can drain and come back
function m9_mainBand(k){return m9_band(M9_MAIN,u=>M9_WMAIN(u)*lerp(1,k,clamp((u-M9_SPLIT)/0.1,0,1)));}
function m9_rivers(ctx,k,u1){const inner=u1>=1?m9_band(M9_IN,M9_WIN):m9_band(m9_sub(M9_IN,0,u1),u=>M9_WIN(u*u1));ctx.save();m9_beforeEnd(ctx);
  wc_wash(ctx,m9_merge(m9_mainBand(k),inner),WCP.water,{kind:"water",line:false,seed:M9_WSEED});ctx.restore();}
const M9_WSEED=33;
// not past the cut's end, where the canals take the water on
function m9_beforeEnd(ctx){ctx.beginPath();ctx.rect(596,-80,W,H+160);ctx.clip();}
// a channel's water: cleared to paper a little inside its edge, then washed, so the edge darkens on the bank instead of showing paper
function m9_water(ctx,line,wf,seed){m9_clear(ctx,m9_band(line,u=>Math.max(0,wf(u)-6)));wc_wash(ctx,m9_band(line,wf),WCP.water,{kind:"water",bare:true,line:false,seed});}
function m9_clear(ctx,pts){ctx.save();wc_tr(ctx,pts);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fill();ctx.restore();}
function m9_innerWaterPaint(ctx){m9_flat(ctx,M9_CAN.map(c=>m9_band(c.p,c.w)),M9_CANW,0.97,35,true);ctx.save();m9_beforeEnd(ctx);m9_water(ctx,M9_IN,M9_WIN,M9_WSEED);ctx.restore();}
// the canals' water, flat, as dark as the washed channels' (whose three layers, blotches and grain darken WCP.water)
const M9_CANW=[124,168,212];
function m9_innerWater(){return wc_kept("innerWater",W,H,m9_innerWaterPaint);}
// the fish mouth: the levee's head, faced with stone, pointing upstream where the river splits
const M9_FISH=[[1003,434],[1018,456],[1018,494],[1008,516],[994,516],[986,494],[986,458]];
// the cut's wall on the hill's side, facing us: rock, between the hill's trees and the water, its top broken, its layers sloping, a few
// cracks down it, and darker where it meets the water
function m9_cutWall(ctx,C){const seg=m9_sub(M9_IN,0.78,1),wf=u=>M9_WIN(0.78+0.22*u),R=wc_rng(9),n=seg.length,lo=m9_edge(seg,wf,1,-3),
  top=seg.map((p,i)=>m9_edge(seg,wf,1,-3+(m9_cutPad(p[0])+6)*clamp((p[0]-590)/22,0,1)*clamp((736-p[0])/26,0,1))[i]).map(([x,y],i)=>[x,y+(i%2?-3:2)*R()]),face=top.concat(lo.slice().reverse()),rk=wc_dim(C.rock,0.08);
  wc_wash(ctx,face,rk,{kind:"ground",line:false,seed:9});
  const at=(i,k)=>[lerp(lo[i][0],top[i][0],k),lerp(lo[i][1],top[i][1],k)],st=[];
  for(const [k0,k1,a] of [[0.22,0.3,0.05],[0.5,0.56,-0.04],[0.74,0.8,0.03]]){let i=Math.floor(R()*4);while(i<n-3){const j=Math.min(n-1,i+3+Math.floor(R()*6)),L=[],U=[];
    for(let q=i;q<=j;q++){const sl=(q-i)/(n-1)*a*8;L.push(at(q,k0+sl));U.push(at(q,k1+sl));}st.push(L.concat(U.reverse()));i=j+2+Math.floor(R()*3);}}
  wc_wash(ctx,st,wc_dim(C.rock,0.3),{kind:"dab",flat:true,a:0.42,seed:10});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(C.rock,0.5),0.55);ctx.lineWidth=1.4;ctx.lineCap="round";
  for(const k of [0.14,0.37,0.55,0.83]){const i=Math.round(k*(n-1)),a=at(i,0.05),b=at(Math.min(n-1,i+1),0.5),c=at(i,0.9);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]+R()*3,b[1]);ctx.lineTo(c[0]-R()*2,c[1]);ctx.stroke();}ctx.restore();
  wc_wash(ctx,m9_band(m9_edge(seg,wf,1,1),5),wc_dim(C.rock,0.4),{kind:"dab",flat:true,a:0.4,seed:12});}
// the stretches of canal lined with trees: which canal, from u0 to u1 of it, a seed, and which side
const M9_CANTREES=[[0,0.3,0.62,1,1],[1,0.18,0.5,2,1],[5,0.12,0.42,3,-1],[2,0.2,0.75,4,-1],[7,0.3,0.6,5,1],[1,0.62,0.86,6,-1]];
const cc0=C=>[C.crown[0],C.crown[1]];
// the valley, in the flood season or the dry one
function m9_valley(ctx,o){o=o||{};const dry=!!o.dry,C=dry?M9_DRY:M9_WET;
  wc_sky(ctx,340,dry?13:9,{clouds:dry?4:3,cx:140,cw:1640,cy:30,ch:110,sun:dry?null:[1660,92]});m9_mountains(ctx,C);
  // the valley's floor, its fields and villages
  wc_land(ctx,m9_floor,C.floor,0.5,{line:false});ctx.save();const fp=[];for(let x=-60;x<=W+60;x+=10)fp.push([x,m9_floor(x)+4]);fp.push([W+60,H+60],[-60,H+60]);wc_tr(ctx,fp);ctx.clip();
  m9_fields(ctx,C,dry?7:5);ctx.restore();m9_clumps(ctx,C);
  // the Min, on as the outer channel, lower in the dry season, then the gorge's sides over where it comes from
  m9_bank(ctx,M9_IN,M9_WIN,C,[14,16]);m9_bank(ctx,M9_MAIN,M9_WMAIN,C,[20,64]);
  // the inner channel: in the flood season, its water and its canals'; in the dry season, its bed and its canals bare, the water held
  // back at the tripods
  if(dry){m9_flat(ctx,M9_CAN.map(c=>m9_band(c.p,c.w)),M9_GRAVEL[1],0.85,50,true);ctx.save();m9_beforeEnd(ctx);m9_bed(ctx,M9_IN,M9_WIN,23);ctx.restore();}
  else m9_flat(ctx,M9_CAN.map(c=>m9_band(c.p,c.w)),M9_CANW,0.97,35,true);
  m9_rivers(ctx,dry?0.62:1,dry?M9_CLOSE:1);m9_gorge(ctx,C);
  M9_CANTREES.forEach(([c,u0,u1,sd,sg])=>{const cn=M9_CAN[c],R=wc_rng(400+sd);for(let u=u0;u<u1;u+=(16+R()*14)/cn.L){const p=m9_at(cn.p,u),w=cn.w(u)/2+8,
    x=p[0]-Math.sin(p[2])*w*sg,y=p[1]+Math.cos(p[2])*w*sg,s=0.24+clamp((y-600)/500,0,1)*0.22;if(R()<0.85)m9_clump(ctx,x,y,s*(0.8+R()*0.4),C.tree,0.6+0.3*clamp((y-600)/500,0,1),500+sd*31+Math.round(u*97));}});
  // the hill, wooded, with the cut at its end; the separated rock across the cut
  const hp=m9_hillPts(),cc=[C.crown[0],C.crown[1]];m9_cutWall(ctx,C);m9_canopy(ctx,hp,cc,170,37,1.0,0.8);
  wc_wash(ctx,M9_ROCK,C.rock,{kind:"build",lw:1.3,seed:17});m9_canopy(ctx,M9_ROCK.map(([x,y])=>[x,y-12]),cc,8,39,0.7,0.8);
  // the levee between the channels, tree-lined, and its head, the fish mouth, faced with courses of stone
  m9_canopy(ctx,wc_band(M9_LEVEE,12,34),cc,16,41,0.72,0.8);wc_wash(ctx,M9_FISH,[208,198,178],{kind:"build",lw:1.4,seed:23});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.2;for(const y of [470,486,502]){ctx.beginPath();ctx.moveTo(990,y);ctx.lineTo(1014,y-2);ctx.stroke();}ctx.restore();
}

/* ---------- the university's places ---------- */
// today: the university's old building and its glass wing, a lawn, terraced houses across the street, a lamp (as in film 1)
const M9_LAWN=x=>664+5*Math.sin(x/300);
function m9_campus(ctx){const P=WCP;wc_sky(ctx,716,2,{sun:[1560,170]});
  wc_skyline(ctx,624,P.city,0.1,5);wc_treeRow(ctx,()=>640,-40,1980,58,70,0.24,21,P.leaf2);wc_land(ctx,M9_LAWN,P.lawn,0.42);
  wc_contact(ctx,140,770,668,0.46,0.22);wc_quad(ctx,150,668,0.46,0.62);wc_glassWing(ctx,762,668,150,170,0.48);
  [[1210,P.plaster],[1410,P.brickHouse,P.blueDoor],[1610,P.blueHouse],[1810,P.plaster]].forEach(([x,c,d])=>wc_terrace(ctx,x,742,232,c,0.56,{k:0.86,door:d}));
  wc_wash(ctx,[[1180,742],[W+60,742],[W+60,770],[1170,770]],P.hedge,{depth:0.6,kind:"hedge",lw:1.5});
  wc_roundTree(ctx,70,700,250,0.5);wc_roundTree(ctx,990,690,226,0.5,P.leaf2);wc_roundTree(ctx,1120,706,196,0.52);
  wc_wash(ctx,[[-60,782],[W+60,770],[W+60,H+60],[-60,H+60]],P.paving,{depth:0.72,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth([[540,668],[560,720],[620,800],[740,900],[880,1090]],8),30,240),wc_lit(P.paving,0.08),{depth:0.62,kind:"path",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.paving,0.14),0.55);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=800+i*i*5;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-10);ctx.stroke();}
  for(let i=-10;i<24;i++){ctx.beginPath();ctx.moveTo(960+i*54,782);ctx.lineTo(960+i*190,1080);ctx.stroke();}ctx.restore();
  wc_lamp(ctx,1186,846,300,0.72);}
// paper, with a little sky and a strip of land, for the chapters that explain; a second, for the industries
function m9_plain(ctx){wc_sky(ctx,836,3,{clouds:3});wc_land(ctx,x=>826+16*Math.sin(x/320+1),WCP.far,0.35,{line:false});wc_land(ctx,x=>882+10*Math.sin(x/240),WCP.near,0.75,{line:false});}
function m9_plainB(ctx){wc_sky(ctx,846,7,{clouds:4,cx:120,cw:1680});wc_land(ctx,x=>842+20*Math.sin(x/380+2),WCP.far,0.35,{line:false});wc_land(ctx,x=>898+12*Math.sin(x/260+1),WCP.near,0.75,{line:false});}
// an office: a wall, a tall window onto the campus at wx, a floor; each office has its own wall
function m9_room(ctx,wall,wx,seed){const P=WCP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,900),wall,{kind:"plaster",line:false,seed});wc_wash(ctx,wc_rect(-40,858,W+80,260),P.floor,{kind:"ground",line:false,seed:seed+1});
  wc_wash(ctx,wc_rect(-40,846,W+80,18),wc_dim(wall,0.14),{kind:"trim",line:false,flat:true});
  ctx.save();ctx.beginPath();ctx.rect(wx+12,112,436,560);ctx.clip();wc_sky(ctx,560,seed+3,{clouds:2,cx:wx+20,cw:380,cy:150,ch:120});
  wc_land(ctx,x=>600+8*Math.sin(x/90),P.lawn,0.42,{line:false});wc_part(ctx,wc_rect(wx+270,330,70,270),WCP.stone,0.4);wc_part(ctx,[[wx+262,330],[wx+348,330],[wx+305,250]],WCP.slate,0.4);
  wc_roundTree(ctx,wx+90,640,220,0.5);wc_roundTree(ctx,wx+400,650,190,0.5,P.leaf2);ctx.restore();
  for(const r of [wc_rect(wx,100,460,16),wc_rect(wx,100,16,584),wc_rect(wx+444,100,16,584),wc_rect(wx+222,100,16,584),wc_rect(wx,384,460,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(wx-20,676,500,22),wc_dim(wall,0.1),{kind:"trim",lw:1.5});}
const WC_PLACES={river:ctx=>m9_valley(ctx,{}),riverDry:ctx=>m9_valley(ctx,{dry:true}),campus:m9_campus,plain:m9_plain,plainB:m9_plainB,
  office:ctx=>m9_room(ctx,WCP.wallIn,1400,4),admissions:ctx=>m9_room(ctx,[232,236,226],1400,8),gov:ctx=>m9_room(ctx,[240,228,222],60,12)};
// a place, under the camera
function m9_place(ctx,key){ctx.drawImage(wc_place(key),0,0,W,H);}
// a veil of paper over the whole frame, so the one thing drawn after it stands out
function m9_hush(ctx,a){if(a<=0.01)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=rgba(WC_PAPER,a);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}
// a person facing the other way when o.flip: someone who points at what's on their left, so the hand stays in the frame
function m9_person(ctx,id,x,y,s,o){if(!o.flip)return person(ctx,id,x,y,s,o);ctx.save();ctx.translate(x,0);ctx.scale(-1,1);person(ctx,id,0,y,s,o);ctx.restore();}

/* ---------- 1. the river at work ---------- */
// the current: light lifted off the water, n streaks moving down a line at speed px a second, within k of its width
function m9_flow(ctx,t,line,w,n,speed,seed,a,k,ua){if(a<=0.01)return;ua=ua||0;const c=m9_lens(line),L=c[c.length-1],R=wc_rng(seed);ctx.save();ctx.lineCap="round";
  for(let i=0;i<n;i++){const u0=R(),off=(R()*2-1)*(k||0.34),len=14+R()*26,sp=speed*(0.8+R()*0.4),u=((u0*L+t*sp)%L)/L;if(u<ua)continue;const p=m9_at(line,u),ww=w(u),
    ox=-Math.sin(p[2])*off*ww,oy=Math.cos(p[2])*off*ww,f=Math.sin(Math.PI*clamp((u-ua)*8,0,1))*Math.sin(Math.PI*clamp((1-u)*8,0,1));
    ctx.strokeStyle=rgba([255,255,255],0.55*a*clamp(f+0.4,0,1));ctx.lineWidth=2+ww/60;ctx.beginPath();ctx.moveTo(p[0]+ox,p[1]+oy);ctx.lineTo(p[0]+ox-Math.cos(p[2])*len*(0.6+ww/300),p[1]+oy-Math.sin(p[2])*len*(0.6+ww/300));ctx.stroke();}
  ctx.restore();}
// the gravel the river carries: grains down the Min, most of them turning down the outer channel; one in five takes the inner (none, when
// the inner channel is closed: outer)
function m9_gravel(ctx,t,t0,a,outer){if(a<=0.01)return;const R=wc_rng(61),n=26;for(let i=0;i<n;i++){const ph=R()*3.6,inner=i%5===2,off=(R()*2-1)*0.3,r=4.5+R()*3,col=M9_GRAVEL[i%3];
  if(outer&&inner)continue;
  const u=((t-t0)+ph)/3.6;if(u<0)continue;const k=u%1,cyc=Math.floor(u);if((t-t0)+ph<3.6*cyc)continue;
  let p,w,of=off;if(k<0.42||!inner){const v=inner?lerp(M9_SEEN,M9_HEAD,k/0.42):lerp(M9_SEEN,0.62,k);p=m9_at(M9_MAIN,v);w=M9_WMAIN(v);if(inner)of=lerp(off,0.17,clamp(k/0.3,0,1));}
  else{const v=(k-0.42)/0.58*0.7;p=m9_at(M9_IN,v);w=M9_WIN(v);of=0;}
  const x=p[0]-Math.sin(p[2])*of*w,y=p[1]+Math.cos(p[2])*of*w,fa=a*clamp(k*12,0,1)*clamp((1-k)*10,0,1);if(fa<=0.01)continue;
  withA(ctx,fa,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.ellipse(x,y,r*1.25,r,p[2],0,TAU);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=1.3;ctx.stroke();});}}
// the inner channel's water, drawn over the dry season's bare bed, from u0 to u1 of its length; its canals' water, from D0 to D1 px
// along them from the cut
function m9_waterIn(ctx,u0,u1,D0,D1){const im=m9_innerWater();
  // each clipped a little inside its edge, so the kept wash's rim doesn't show over the bank: the bed's edge reads as the waterline
  const clip=(line,a,b,wf)=>{if(b-a<0.002)return;ctx.save();wc_tr(ctx,m9_band(m9_sub(line,a,b),u=>wf(lerp(a,b,u))));ctx.clip();ctx.drawImage(im,0,0,W,H);ctx.restore();};
  clip(M9_IN,u0,u1,u=>M9_WIN(u)-3);M9_CAN.forEach(c=>clip(c.p,clamp((D0-c.d0)/c.L,0,1),clamp((D1-c.d0)/c.L,0,1),u=>c.w(u)+2));}
// a tripod of poles lashed at the top, with a long basket of stones against it: a row of them closes the inner channel; kept, at twice the size
function m9_tripodPic(){return wc_kept("tripod",200,200,q=>{q.scale(2,2);q.translate(50,86);const wd=[150,112,74],P=WC_PENCIL;q.lineCap="round";
  wc_wash(q,[[-36,-2],[34,-6],[40,8],[-30,12]],[196,172,110],{kind:"thing",lw:1.2,seed:3});
  q.strokeStyle=rgba(wc_dim([196,172,110],0.35),0.8);q.lineWidth=1;for(let i=-30;i<36;i+=7){q.beginPath();q.moveTo(i,-3);q.lineTo(i+5,10);q.stroke();}
  for(const [x,y] of [[-20,4],[-6,3],[10,2],[24,1]]){q.fillStyle=rgba([150,144,138],0.9);q.beginPath();q.arc(x,y,3,0,TAU);q.fill();}
  for(const [x,y,w] of [[-26,0,4],[22,-2,4],[4,-8,3.2]]){q.strokeStyle=rgba(wc_dim(wd,0.3),1);q.lineWidth=w+1.6;q.beginPath();q.moveTo(0,-62);q.lineTo(x,y);q.stroke();q.strokeStyle=rgba(wd,1);q.lineWidth=w;q.stroke();}
  q.strokeStyle=rgba([220,204,160],1);q.lineWidth=3;q.beginPath();q.moveTo(-5,-56);q.lineTo(5,-58);q.stroke();q.strokeStyle=rgba(P,0.5);q.lineWidth=1;q.stroke();});}
// the row across the inner channel, each tripod arriving at t0 (staggered) and lifted away at t1
function m9_tripods(ctx,t,t0,t1){const p=m9_at(M9_IN,M9_CLOSE),nx=-Math.sin(p[2]),ny=Math.cos(p[2]),im=m9_tripodPic();
  for(let i=0;i<5;i++){const o=(i-2)*26,x=p[0]+nx*o,y=p[1]+ny*o,a=fin(t,t0+i*0.18,0.4)*(1-fin(t,t1+i*0.15,0.5)),up=ease(fin(t,t1+i*0.15,0.6))*30;if(a<=0.01)continue;
    arrive(ctx,x,y,t,t0+i*0.18,()=>withA(ctx,a,()=>ctx.drawImage(im,x-25,y-43-up,50,50)),{dy:-14,d:0.6});}}
// someone digging out the bed in the dry season, in plain hemp, belted, a cloth tied round the head; a wooden spade (dig) or a basket
// of gravel on the shoulder (carry). s: their height over 100; ph: where in the work they are
const M9_HEMP=[206,188,154],M9_HEMPD=[150,128,98],M9_SKIN=[214,170,132],M9_CLOTH=[238,232,216];
function m9_digger(ctx,x,y,s,t,ph,kind,flip){const k=s,cyc=(t*0.62+ph)%1,dig=kind==="dig",b=dig?Math.sin(cyc*TAU):0,lean=dig?0.18+0.16*Math.max(0,b):0.05,step=dig?0:Math.sin(cyc*TAU*2);
  ctx.save();ctx.translate(x,y);ctx.scale(flip?-k:k,k);ctx.lineCap="round";ctx.lineJoin="round";const ink=rgba(WC_PENCIL,0.8);
  ctx.fillStyle=rgba([110,100,90],0.18);ctx.beginPath();ctx.ellipse(0,0,16,4,0,0,TAU);ctx.fill();
  // legs, then the tunic, belted; the head and its cloth
  ctx.strokeStyle=rgba(M9_HEMPD,1);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-3,-42);ctx.lineTo(-7-step*5,-2);ctx.moveTo(3,-42);ctx.lineTo(8+step*5,-2);ctx.stroke();
  ctx.save();ctx.translate(0,-40);ctx.rotate(lean);ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(-8,-36);ctx.quadraticCurveTo(0,-40,8,-36);ctx.lineTo(11,0);ctx.closePath();
  ctx.fillStyle=rgba(M9_HEMP,1);ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle=rgba(M9_HEMPD,1);ctx.fillRect(-10,-16,21,4);
  ctx.beginPath();ctx.arc(1,-45,7,0,TAU);ctx.fillStyle=rgba(M9_SKIN,1);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(1,-47,7.4,Math.PI*1.05,Math.PI*1.95);ctx.lineTo(8,-46);ctx.lineTo(-6,-46);ctx.closePath();ctx.fillStyle=rgba(M9_CLOTH,1);ctx.fill();ctx.stroke();
  if(dig){// the spade: down into the gravel, then up with a load
    const a=-0.5+0.75*Math.max(0,b);ctx.save();ctx.translate(6,-30);ctx.rotate(a);ctx.strokeStyle=rgba([150,112,74],1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(26,34);ctx.stroke();
      ctx.beginPath();ctx.moveTo(22,32);ctx.lineTo(34,30);ctx.lineTo(36,44);ctx.lineTo(26,46);ctx.closePath();ctx.fillStyle=rgba([170,132,92],1);ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.stroke();ctx.restore();
    ctx.strokeStyle=rgba(M9_SKIN,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-6,-30);ctx.lineTo(8,-26+a*6);ctx.stroke();}
  else{// a basket on the shoulder
    wc_wash(ctx,[[4,-48],[24,-46],[22,-30],[6,-32]],[196,172,110],{kind:"dab",flat:true});ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(4,-48);ctx.lineTo(24,-46);ctx.lineTo(22,-30);ctx.lineTo(6,-32);ctx.closePath();ctx.stroke();
    for(const [px,py] of [[10,-48],[16,-49],[21,-47]]){ctx.fillStyle=rgba(M9_GRAVEL[2],1);ctx.beginPath();ctx.arc(px,py,2.6,0,TAU);ctx.fill();}
    ctx.strokeStyle=rgba(M9_SKIN,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(6,-30);ctx.lineTo(12,-44);ctx.stroke();}
  ctx.restore();ctx.restore();}
// the diggers in the bed: where each works along the inner channel (u), across it (o), and what they do; the carriers walk to the bank
const M9_DIG=[[0.22,-0.2,"dig",0],[0.26,0.24,"dig",0.4],[0.33,0,"carry",0.1],[0.4,-0.26,"dig",0.7],[0.46,0.18,"dig",0.2],[0.52,0,"carry",0.6],[0.6,-0.1,"dig",0.5],[0.67,0.24,"dig",0.9]];
function m9_diggers(ctx,t,t0,a){if(a<=0.01)return;M9_DIG.forEach(([u,o,kind,ph],i)=>{const p=m9_at(M9_IN,u),w=M9_WIN(u),c=kind==="carry"?Math.sin(t*0.5+ph*6):0,
    x=p[0]-Math.sin(p[2])*(o+c*0.3)*w,y=p[1]+Math.cos(p[2])*(o+c*0.3)*w;arrive(ctx,x,y,t,t0+i*0.12,()=>withA(ctx,a,()=>m9_digger(ctx,x,y+8,0.46,t,ph,kind,i%2===1)),{dy:-6,d:0.6});});}

/* ---------- 1. the cut through the riverbed ---------- */
// the panel: the riverbed in section, gravel down to the mark, and below it the firm old bed; the trench is dug out from tDig to tDug,
// down to the mark and no deeper; the stone horse lies there, then gives way to the iron bars (tBars)
const M9_SEC={x:1068,y:132,w:772,h:540},M9_SURF=178,M9_MARK=384;
function m9_secPaper(){const S=M9_SEC;return wc_kept("section",(S.w+40)*2,(S.h+40)*2,q=>{q.scale(2,2);q.translate(20,20);const w=S.w,h=S.h,R=wc_rng(71);
  wc_wash(q,wc_rect(0,0,w,h),[250,248,240],{kind:"page",lw:2,seed:4});
  // the firm old bed below the mark, then the gravel above it
  wc_wash(q,[[10,M9_MARK+10],[w-10,M9_MARK+14],[w-10,h-10],[10,h-10]],[188,160,128],{kind:"ground",line:false,seed:5});
  wc_wash(q,[[10,M9_SURF],[w*0.3,M9_SURF-6],[w*0.6,M9_SURF+4],[w-10,M9_SURF-2],[w-10,M9_MARK+14],[10,M9_MARK+10]],M9_GRAVEL[1],{kind:"ground",line:false,seed:7});
  for(let i=0;i<420;i++){const x=16+R()*(w-32),y=M9_SURF+6+R()*(M9_MARK-M9_SURF),r=2+R()*4.5;wc_wash(q,wc_ell(x,y,r*1.3,r,9),M9_GRAVEL[i%4],{kind:"dab",flat:true,a:0.85});}
  wc_ink(q,[[10,M9_SURF],[w*0.3,M9_SURF-6],[w*0.6,M9_SURF+4],[w-10,M9_SURF-2]],false,2.2,WC_PENCIL,0.8,5,1);});}
// the trench, d (0..1) of the way down to the mark: its gravel taken out, back to paper
const M9_TR=[330,214];
function m9_trench(d){const S=M9_SEC,cx=S.x+S.w/2,top=S.y+M9_SURF,bot=top+(M9_MARK-M9_SURF-4)*d,tw=M9_TR[0]/2,bw=lerp(M9_TR[0],M9_TR[1],d)/2;
  return[[cx-tw,top-8],[cx+tw,top-8],[cx+bw,bot],[cx-bw,bot]];}
// a stone horse, lying in the bed with its legs folded under it, its head up; kept, at twice the size (280 by 120)
function m9_horsePic(){return wc_kept("horse",560,240,q=>{q.scale(2,2);q.translate(10,10);const st=[166,164,158],ln={kind:"build",lw:1.5};
  const legs=[[[56,76],[98,86],[100,96],[52,92]],[[148,78],[190,86],[192,96],[146,94]]],body=wc_ell(112,62,72,27,28),
    neck=[[150,44],[190,12],[212,20],[188,66],[156,72]],head=[[192,8],[214,10],[236,28],[238,38],[224,42],[202,30]];
  legs.forEach((p,i)=>wc_wash(q,p,wc_dim(st,0.08),Object.assign({seed:21+i},ln)));[[body,23],[neck,25],[head,27]].forEach(([p,sd])=>wc_wash(q,p,st,Object.assign({seed:sd},ln)));
  q.strokeStyle=rgba(WC_PENCIL,0.7);q.lineWidth=1.5;q.lineCap="round";q.beginPath();q.moveTo(198,9);q.lineTo(202,-2);q.lineTo(208,8);q.moveTo(160,40);q.quadraticCurveTo(176,24,192,10);
  q.moveTo(42,54);q.quadraticCurveTo(30,64,34,84);q.stroke();q.fillStyle=rgba(WC_PENCIL,0.85);q.beginPath();q.arc(214,20,2.2,0,TAU);q.fill();
  wc_wash(q,wc_ell(112,76,62,10,20),wc_dim(st,0.3),{kind:"dab",flat:true,a:0.32,seed:29});});}
// the iron bars, lying end to end at the mark; kept
function m9_barsPic(){return wc_kept("ironBars",700,80,q=>{q.scale(2,2);q.translate(8,8);const ir=[92,94,104];
  [[0,10,150],[158,6,150],[0,24,150],[158,22,150]].forEach(([x,y,l],i)=>{wc_wash(q,wc_rrPts(x,y,l,12,5),i%2?wc_lit(ir,0.08):ir,{kind:"iron",lw:1.2,seed:3+i});});});}
function m9_section(ctx,t,o){const S=M9_SEC,cx=S.x+S.w/2;ctx.drawImage(m9_secPaper(),S.x-20,S.y-20,S.w+40,S.h+40);
  const d=ease(clamp((t-o.tDig)/(o.tDug-o.tDig),0,1)),bars=fin(t,o.tBars,0.7),my=S.y+M9_MARK;
  // the trench, then the mark in it: under the gravel until the trench reaches it
  if(d>0){ctx.save();wc_tr(ctx,m9_trench(d));ctx.fillStyle=rgba([250,248,240],0.94);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
  withA(ctx,1-bars,()=>ctx.drawImage(m9_horsePic(),cx-152,my-74,280,120));withA(ctx,bars,()=>ctx.drawImage(m9_barsPic(),cx-175,my-12,350,40));
  if(d<1){ctx.save();ctx.beginPath();ctx.rect(cx-190,my-72,380,112);ctx.clip();ctx.globalAlpha*=1-clamp((d-0.82)/0.18,0,1);
    ctx.drawImage(m9_secPaper(),(S.x-20),(S.y-20),S.w+40,S.h+40);ctx.restore();}
  // the diggers on the bed, at the trench's edge
  const a=fin(t,o.tDig-0.4,0.5);if(a>0.01){m9_digger(ctx,cx-200,S.y+M9_SURF-6,1.0,t,0.1,"dig",false);m9_digger(ctx,cx+214,S.y+M9_SURF-6,1.0,t,0.6,"carry",true);}
  // how deep: a pencil line down the trench from the bed, its arrow stopping on the mark
  const ln=clamp((t-o.tLine)/0.9,0,1);if(ln>0){const x=cx-34,y0=S.y+M9_SURF+12,ye=lerp(my-36,my-10,bars),y1=lerp(y0,ye,ease(ln));wc_pencil(ctx,[[x,y0],[x,y1]],1,{dash:[8,8],lw:2.6});
    if(ln>=1){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-12,ye-13);ctx.lineTo(x,ye);ctx.lineTo(x+12,ye-13);ctx.stroke();ctx.restore();}}}

/* ---------- 1. the rule ---------- */
// a strip of paper that unrolls from the left as p goes 0 to 1, the rule written along it; kept
const M9_RULE="Dig the riverbed deep, keep the weir low";
function m9_rule(ctx,cx,cy,p){if(p<=0)return;const w=1180,h=96,x0=cx-w/2,vis=w*ease(clamp(p,0,1));
  const c=wc_kept("ruleStrip",(w+40)*2,(h+40)*2,q=>{q.scale(2,2);q.translate(20,20);wc_wash(q,[[0,4],[w,0],[w-2,h-2],[2,h]],[248,240,220],{kind:"paper",lw:1.6,seed:11});
    q.strokeStyle=rgba(WCP.parchInk,0.14);q.lineWidth=1.2;q.beginPath();q.moveTo(24,h-18);q.lineTo(w-24,h-20);q.stroke();});
  ctx.save();ctx.beginPath();ctx.rect(x0-20,cy-h/2-20,vis+20,h+40);ctx.clip();ctx.drawImage(c,x0-20,cy-h/2-20,w+40,h+40);
  wc_hand(ctx,M9_RULE,cx,cy+15,{size:46,w:700,col:WCP.parchInk,align:"center"});ctx.restore();
  // the roll, moving right as it unrolls
  if(p<1){const rx=x0+vis;ctx.save();ctx.fillStyle=rgba([236,226,198],1);ctx.beginPath();ctx.ellipse(rx,cy,13,h/2+4,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=1.6;ctx.stroke();ctx.restore();}}

/* ---------- 2 to 10: things on paper ---------- */
// a pencil arrow from one point to another, drawn on as p goes from 0 to 1
function m9_arrow(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const q=ease(clamp(p,0,1)),ex=lerp(x0,x1,q),ey=lerp(y0,y1,q),an=Math.atan2(y1-y0,x1-x0),c=rgba(o.col||WC_PENCIL,o.a==null?0.85:o.a);
  ctx.save();ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=o.lw||3;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
  if(p>=1){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an-0.45),y1-16*Math.sin(an-0.45));ctx.lineTo(x1-16*Math.cos(an+0.45),y1-16*Math.sin(an+0.45));ctx.closePath();ctx.fill();}ctx.restore();}
// a rubber stamp landing at ts: its words inside a double rule, in the stamp's ink, pressed unevenly; the rule is kept for each size
const M9_STAMP=[46,78,132];
function m9_stampRule(w,h,col){return wc_kept("stamp"+w+"x"+h+"|"+col.join(","),(w+16)*2,(h+16)*2,q=>{q.scale(2,2);q.translate(8,8);
  wc_ink(q,wc_rrPts(0,0,w,h,10),true,3.4,col,0.9,41,0.6);wc_ink(q,wc_rrPts(8,8,w-16,h-16,6),true,1.6,col,0.85,43,0.6);
  q.globalCompositeOperation="destination-out";q.globalAlpha=0.45;q.drawImage(WC.blotch,-30,-20,w+60,h+40);});}
function m9_stamp(ctx,t,cx,cy,ts,s,o){o=o||{};const p=clamp((t-ts)/0.2,0,1);if(p<=0)return;const size=o.size||36,col=o.col||M9_STAMP,
  w=Math.round(tw(ctx,s,size,500,"mono")+52),h=Math.round(size+38),z=lerp(1.3,1,1-Math.pow(1-p,3));
  ctx.save();ctx.translate(cx,cy);ctx.rotate(o.rot==null?-0.04:o.rot);ctx.scale(z,z);withA(ctx,p*(o.a==null?1:o.a),()=>{ctx.drawImage(m9_stampRule(w,h,col),-w/2-8,-h/2-8,w+16,h+16);
    wc_T(ctx,s,0,size*0.36,{f:"mono",w:500,size,col,a:0.9,align:"center"});});ctx.restore();}
// someone's name, and where they work
function m9_name(ctx,x,y,name,role){const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+56);wc_panel(ctx,x-w/2,y,w,108,{kind:"card",seed:name.length});
  wc_T(ctx,name,x-w/2+28,y+46,{w:800,size:32,col:WC_DARK});wc_T(ctx,role,x-w/2+28,y+86,{w:600,size:28,col:WC_MUTED});}
// someone no one has met yet: only ever drawn as a white figure, so only the outline matters
if(!PEOPLE.newcomer)PEOPLE.newcomer={name:"A new person",role:"Applicant",side:"Person",does:"uses",edge:[236,232,226],seed:23,
  skin:[200,160,128],hair:{style:"curly",c:[40,32,30]},top:{kind:"sweater",c:[120,140,120]},bottom:{c:[60,64,80]},shoe:[50,50,56],build:{sh:72,hip:58,h:0.98}};

/* ---------- 2 to 4. the clean-up's board, and the charts of duplicates ---------- */
// the clean-up's board: fifteen pairs of records, each pair sliding together and becoming one white card as o.merge goes 0 to 1, a
// counter running to 2,000 (o.count), its months from June to December filling (o.months)
const M9_BD={x:150,y:130,w:880,h:470},M9_BPAIRS=[["student","applicant"],["alumna","student"],["tutor","student"],["applicant","applicant"],["student","alumna"],
  ["researcher","tutor"],["student","student"],["applicant","alumna"],["tutor","tutor"],["student","applicant"],["alumna","alumna"],["student","researcher"],["applicant","student"],["tutor","alumna"],["student","student"]],
  M9_BORDER=[3,11,7,0,13,5,9,1,14,6,2,10,4,12,8];
function m9_board(ctx,t,o){const B=M9_BD;wc_panel(ctx,B.x,B.y,B.w,B.h,{kind:"sheet",seed:8});
  wc_T(ctx,"Duplicate clean-up · 2024",B.x+36,B.y+60,{w:800,size:34,col:WC_DARK});
  const n=Math.round(2000*clamp(o.count,0,1)/10)*10,mw=tw(ctx," merged",30,700);
  wc_T(ctx,"merged",B.x+B.w-36,B.y+60,{w:700,size:30,align:"right",col:WC_MUTED});wc_T(ctx,n.toLocaleString("en-US"),B.x+B.w-36-mw,B.y+61,{w:500,size:40,f:"mono",align:"right",col:WC_DARK});
  M9_BPAIRS.forEach(([r1,r2],i)=>{const cx=B.x+118+(i%5)*161,cy=B.y+148+Math.floor(i/5)*88,s0=M9_BORDER[i]/15*0.78,k=ease(clamp((o.merge-s0)/0.2,0,1)),sl=30*k,wa=clamp((k-0.55)/0.35,0,1);
    if(wa<1)withA(ctx,1-wa,()=>{wc_panel(ctx,cx-68+sl,cy-20,62,40,{kind:"chip",role:WC_ROLE[r1],seed:i});wc_panel(ctx,cx+6-sl,cy-20,62,40,{kind:"chip",role:WC_ROLE[r2],seed:i+20});});
    if(wa>0)withA(ctx,wa,()=>{wc_panel(ctx,cx-40,cy-24,80,48,{kind:"card",seed:i+40});[r1,r2].forEach((r,j)=>{ctx.fillStyle=rgba(WC_ROLE[r],1);ctx.beginPath();ctx.arc(cx-20+j*16,cy,6,0,TAU);ctx.fill();});});});
  // the six months, as a strip that fills from June to December
  const sy=B.y+B.h-62,sx=B.x+250,sw=330,f=ease(clamp(o.months,0,1));wc_T(ctx,"Jun–Dec 2024",B.x+36,sy+10,{w:700,size:28,col:WC_INK});
  ctx.save();wc_tr(ctx,wc_rrPts(sx,sy-16,sw,32,10));ctx.fillStyle=rgba([244,240,230],1);ctx.fill();ctx.clip();if(f>0){ctx.fillStyle=rgba(wc_lit(WC_ROLE.student,0.35),0.9);ctx.fillRect(sx,sy-16,sw*f,32);}
  ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.5;for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(sx+sw*i/6,sy-16);ctx.lineTo(sx+sw*i/6,sy+16);ctx.stroke();}ctx.restore();
  wc_ink(ctx,wc_rrPts(sx,sy-16,sw,32,10),true,1.8,WC_PENCIL,0.8,17,0.6);}
// the sheet a chart is drawn on: kept when it's still; while it grows, drawn each frame, with a plain pencil edge
function m9_sheet(ctx,b,still){if(still)return wc_panel(ctx,b.x,b.y,b.w,b.h,{kind:"sheet",seed:5});ctx.save();wc_tr(ctx,wc_rrPts(b.x,b.y,b.w,b.h,12));
  ctx.fillStyle=rgba(WC_CARD,0.95);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.stroke();ctx.restore();}
// where things sit on a chart: months from June 2024 (0) to mEnd across, and duplicates from 0 to top up
function m9_plot(b,mEnd,top){const x0=b.x+136,x1=b.x+b.w-48,y0=b.y+108,y1=b.y+b.h-82;return{x0,x1,y0,y1,X:m=>lerp(x0,x1,m/mEnd),Y:n=>lerp(y1,y0,n/top)};}
function m9_axes(ctx,P,grid){ctx.save();if(grid){ctx.strokeStyle=rgba(WC_PENCIL,0.22);ctx.lineWidth=1.5;ctx.setLineDash([6,8]);grid.forEach(n=>{ctx.beginPath();ctx.moveTo(P.x0,P.Y(n));ctx.lineTo(P.x1,P.Y(n));ctx.stroke();});}
  ctx.setLineDash([]);ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(P.x0,P.y0-12);ctx.lineTo(P.x0,P.y1);ctx.lineTo(P.x1,P.y1);ctx.stroke();ctx.restore();}
// duplicates waiting, month by month: the clean-up takes them from 2,000 to none by December 2024; each intake of 2025 brings more
const M9_WAIT=[[0,2000],[1,1720],[2,1390],[3,1020],[4,660],[5,310],[6,0],[8,0],[8.25,640],[13,640],[13.25,1100],[18,1100]];
// a block of new duplicates: small record cards in twos, stacked in the roles' colours; kept, then clipped to each block (cut: it runs
// off the top of the chart, torn)
function m9_pairsTex(){return wc_kept("pairs",112,1200,q=>{q.scale(2,2);const R=wc_rng(83),cols=["student","applicant","alumna","tutor","researcher"];
  for(let r=0;r<50;r++)for(let k=0;k<2;k++){const y=588-r*12,x=3+k*26,c=WC_ROLE[cols[Math.floor(R()*5)]];
    for(const xx of [x,x+12]){q.fillStyle=rgba(wc_lit(c,0.2),0.92);q.fillRect(xx,y,10,9);q.strokeStyle=rgba(WC_PENCIL,0.45);q.lineWidth=0.8;q.strokeRect(xx+0.5,y+0.5,9,8);}}});}
function m9_block(ctx,x,yTop,yBot,w,cut){if(yBot-yTop<1)return;const top=[];if(cut)for(let i=0;i<=6;i++)top.push([x+w*(1-i/6),yTop+(i%2?0:9)]);else top.push([x+w,yTop],[x,yTop]);
  const pts=[[x,yBot],[x+w,yBot]].concat(top);ctx.save();wc_tr(ctx,pts);ctx.fillStyle=rgba(WC_CARD,1);ctx.fill();ctx.clip();ctx.drawImage(m9_pairsTex(),x+(w-56)/2,yBot-600,56,600);ctx.restore();
  ctx.save();wc_tr(ctx,pts);ctx.strokeStyle=rgba(WC_PENCIL,0.75);ctx.lineWidth=2;ctx.lineJoin="round";ctx.stroke();ctx.restore();}
// the chart of duplicates waiting, in box b, months 0 to o.mEnd; its line drawn to month o.mL; the 2025 blocks risen as far as o.rise;
// each label's alpha in o
const M9_BW=48,m9_bx=(P,m)=>P.X(m+0.25)+6;
function m9_waiting(ctx,t,b,o){const P=m9_plot(b,o.mEnd,2000);m9_sheet(ctx,b,o.still);
  wc_T(ctx,"duplicates waiting",b.x+36,b.y+62,{w:800,size:32,col:WC_DARK});m9_axes(ctx,P,[1000,2000]);
  [["2,000",2000],["0",0]].forEach(([s,n])=>wc_T(ctx,s,P.x0-16,P.Y(n)+10,{w:600,size:28,align:"right",col:WC_MUTED}));
  const xl=(s,m,a)=>{if(a>0.01)withA(ctx,a,()=>wc_T(ctx,s,m,P.y1+46,{w:600,size:28,align:"center",col:WC_MUTED}));};
  xl("Jun 2024",P.X(0),1);xl("Dec 2024",P.X(6),o.dec==null?1:o.dec);
  // the blocks of 2025, one for each intake, stacked on what was already waiting
  const r=o.rise||[0,0];[[8,0,640,0],[13,640,460,1]].forEach(([m,n0,dn,i])=>{if(r[i]<=0)return;const x=m9_bx(P,m);m9_block(ctx,x,P.Y(n0+dn*ease(r[i])),P.Y(n0),M9_BW);
    xl(["Feb 2025","Jul 2025"][i],x+M9_BW/2,clamp(r[i]*2,0,1));const la=(o.vals||[0,0])[i];
    if(la>0.01)withA(ctx,la,()=>wc_T(ctx,String(dn),x-14,P.Y(n0+dn/2)+10,{w:800,size:30,align:"right",col:WC_DARK}));});
  // the line, as far as it's been drawn; the months with none waiting, marked while they're the subject
  const mL=clamp(o.mL,0,18);if(o.hi>0.01){ctx.save();ctx.strokeStyle=rgba(WC_BADGE,0.55*o.hi);ctx.lineWidth=18;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(P.X(6),P.y1-2);ctx.lineTo(P.X(Math.min(mL,8)),P.y1-2);ctx.stroke();ctx.restore();}
  if(mL>0){const pts=[];for(let i=0;i<M9_WAIT.length;i++){const [m,n]=M9_WAIT[i];if(m<=mL)pts.push([P.X(m),P.Y(n)]);else{const [m0,n0]=M9_WAIT[i-1];pts.push([P.X(mL),P.Y(lerp(n0,n,(mL-m0)/(m-m0)))]);break;}}
    ctx.save();ctx.strokeStyle=rgba(WC_INK,0.9);ctx.lineWidth=4.5;ctx.lineCap="round";ctx.lineJoin="round";wc_trOpen(ctx,pts);ctx.stroke();ctx.restore();}
  if(o.end>0.01)withA(ctx,o.end,()=>wc_T(ctx,"1,100 new",P.x1,P.Y(1100)-24,{w:800,size:30,align:"right",col:WC_DARK}));
  return P;}
// new duplicates per intake, against the limit of 50: 2025's run off the top; o.rise: how far each of 2026's has risen
const M9_INTAKES=[[8,640,"Feb 2025"],[13,460,"Jul 2025"],[20,44,"Feb 2026"],[25,29,"Jul 2026"]],M9_IRON=[92,96,112];
// (months counted from Jan 2025, so the four intakes spread across the chart)
function m9_intakes(ctx,t,b,o){const P=m9_plot(b,23,100);m9_sheet(ctx,b,true);wc_T(ctx,"new duplicates per intake",b.x+36,b.y+62,{w:800,size:32,col:WC_DARK});m9_axes(ctx,P);
  wc_T(ctx,"0",P.x0-16,P.Y(0)+10,{w:600,size:28,align:"right",col:WC_MUTED});
  M9_INTAKES.forEach(([m,n,s],i)=>{const r=i<2?1:ease(clamp((o.rise||[0,0])[i-2],0,1)),x=P.X(m-5+0.5)-26,cut=n>100,top=cut?P.Y(91):P.Y(n*r);if(r<=0)return;
    m9_block(ctx,x,top,P.y1,52,cut);wc_T(ctx,s,x+26,P.y1+46,{w:600,size:28,align:"center",col:WC_MUTED});
    withA(ctx,clamp(r*3-2,0,1),()=>wc_T(ctx,String(n),x+26,top-(cut?8:14),{w:800,size:30,align:"center",col:WC_DARK}));});
  // the limit, dashed in the iron bars' grey, drawn on, with its name
  const lp=clamp(o.lim||0,0,1);if(lp>0){ctx.save();ctx.strokeStyle=rgba(M9_IRON,0.95);ctx.lineWidth=3.5;ctx.setLineDash([16,10]);ctx.beginPath();ctx.moveTo(P.x0,P.Y(50));ctx.lineTo(lerp(P.x0,P.x1,ease(lp)),P.Y(50));ctx.stroke();ctx.restore();
    withA(ctx,clamp(lp*2-1,0,1),()=>wc_T(ctx,"limit: 50",P.x1,P.Y(50)-16,{w:800,size:30,align:"right",col:M9_IRON}));}
  return P;}
// an application, in amber, and its route
function m9_app(ctx,x,y,w,h,sub,seed){const tW=tw(ctx,"Application",30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_ROLE.applicant,sw:tW+36,seed});
  wc_T(ctx,"Application",x+32,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,sub,x+32,y+96,{w:600,size:28,col:WC_MUTED});}
// the number it gives whoever applies, a new one each beat from t0, stamped in the student's ink
function m9_stamping(ctx,t,cx,cy,t0,base,beat){if(t<t0)return;const k=Math.floor((t-t0)/beat);m9_stamp(ctx,t,cx,cy,t0+k*beat,"S-"+(base+k),{size:30,col:WC_ROLEINK.student,rot:-0.05+0.03*(k%3)});}
// the step the application gains: it looks for the person first, the glass moving over what's already known
function m9_glass(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col||WC_INK,0.9);ctx.lineWidth=4*s;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,15*s,0,TAU);ctx.stroke();
  ctx.lineWidth=6*s;ctx.beginPath();ctx.moveTo(x+11*s,y+11*s);ctx.lineTo(x+24*s,y+24*s);ctx.stroke();ctx.restore();}
function m9_search(ctx,t,x,y,w,h,sweep){wc_panel(ctx,x,y,w,h,{kind:"card",seed:12});const k=Math.sin(t*3.2)*sweep;m9_glass(ctx,x+54+k*8,y+h/2-4+Math.cos(t*3.2)*sweep*4,1.1);
  wc_T(ctx,"search first",x+100,y+h/2+11,{w:800,size:30,col:WC_DARK});}
// Mei's queue: a few cases, each a pair of records waiting for her to decide, stacked
function m9_stack(ctx,x,y,n){for(let i=n-1;i>=0;i--){const ox=i*12,oy=-i*12;wc_panel(ctx,x+ox,y+oy,156,86,{kind:"card",seed:30+i});
  wc_panel(ctx,x+ox+16,y+oy+23,56,40,{kind:"chip",role:WC_ROLE.applicant,seed:i});wc_panel(ctx,x+ox+84,y+oy+23,56,40,{kind:"chip",role:WC_ROLE.student,seed:i+5});}}
// a small picture of the river's split, in the dry season, cut from the valley: the river going down the outer channel, the inner one
// closed and being dug out; returns where a point of the valley lands in it
const M9_INSET={x:600,y:338,w:700,h:394};
// (the valley under it is painted at twice the inset's size, so it stays sharp drawn large)
function m9_insetTex(){const C=M9_INSET;return wc_kept("insetDry",C.w*2,C.h*2,q=>{q.scale(2,2);q.translate(-C.x,-C.y);m9_valley(q,{dry:true});});}
function m9_inset(ctx,t,x,y,w,h){const C=M9_INSET,s=w/C.w;wc_panel(ctx,x-12,y-12,w+24,h+24,{kind:"sheet",seed:19});
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.translate(x,y);ctx.scale(s,s);ctx.translate(-C.x,-C.y);ctx.drawImage(m9_insetTex(),C.x,C.y,C.w,C.h);
  m9_tripods(ctx,t,-9,1e9);m9_diggers(ctx,t,-9,1);m9_flow(ctx,t,M9_MAIN,M9_WMAIN,40,80,3,1,0.34,M9_SEEN);m9_gravel(ctx,t,-9,1,true);ctx.restore();
  wc_ink(ctx,wc_rect(x,y,w,h),true,1.8,WC_PENCIL,0.7,23,0.5);return(px,py)=>[x+(px-C.x)*s,y+(py-C.y)*s];}

/* ---------- 5, 6 and 10. the steward's measures ---------- */
// the dashboard on Mei's wall: six places, five gauges and two cards; each gauge is a column with its level, and an iron bar lying across
// it at its limit, as in the river's bed; beside it, what it measures, its value and limit, what it's read from, and whether it's within
// its limit (a tick in green ink) or past it (a cross in red ink), said in words too
const M9_DB={x:60,y:70,w:1300,h:780};
function m9_cell(i){return[80+(i%3)*424,92+Math.floor(i/3)*364,414,350];}
const M9_G=[{l:["new duplicates","this intake"],v:"29",lim:"limit: 50",src:"from the queue",max:80,n:29,bar:50},
  {l:["oldest case","in the queue"],v:"3 days",lim:"limit: 7 days",src:"from the queue",max:16,n:3,bar:7},
  {l:["roles past","their end date"],v:"0",lim:"limit: 0",src:"from the role table",max:4,n:0,bar:0},
  {l:["values with","no source"],v:"0",lim:"limit: 0",src:"from the tests",max:4,n:0,bar:0},
  {l:["requests","answered on time"],v:"14 of 14",lim:"limit: all of them",src:"from the request log",max:16,n:14,bar:14}];
const M9_LEVEL=[150,172,204];
function m9_levelTex(){return wc_kept("level",160,520,q=>{q.scale(2,2);wc_wash(q,wc_rect(4,4,72,252),M9_LEVEL,{kind:"swatch",line:false,a:0.8,seed:13});});}
function m9_barPic(){return wc_kept("ironBar",248,48,q=>{q.scale(2,2);q.translate(6,6);[[0,0],[58,1]].forEach(([x,y],i)=>wc_wash(q,wc_rrPts(x,y,54,11,5),i?wc_lit(M9_IRON,0.08):M9_IRON,{kind:"iron",lw:1.2,seed:7+i}));});}
function m9_gauge(ctx,t,i,o){o=o||{};const g=Object.assign({},M9_G[i],o.g||{}),[x,y,w,h]=o.box||m9_cell(i),lit=o.lit||0,n=o.n==null?g.n:o.n;
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:40+i});if(lit>0.01)withA(ctx,lit,()=>wc_panel(ctx,x,y,w,h,{kind:"card",wash:WC_BADGE,washA:0.34,seed:40+i}));
  const cx=x+30,cy=y+52,cw=66,ch=250,lv=clamp(n/g.max,0,1),by=cy+ch-ch*g.bar/g.max;
  ctx.save();wc_tr(ctx,wc_rrPts(cx,cy,cw,ch,8));ctx.fillStyle=rgba([246,243,234],1);ctx.fill();ctx.clip();if(lv>0)ctx.drawImage(m9_levelTex(),0,260*(1-lv),80,260*lv,cx-6,cy+ch*(1-lv),80,ch*lv+4);ctx.restore();
  wc_ink(ctx,wc_rrPts(cx,cy,cw,ch,8),true,2,WC_PENCIL,0.8,11+i,0.8);
  // the iron bar, laid across at its limit (o.barIn: as it's laid)
  const bi=o.barIn==null?1:o.barIn;if(bi>0)withA(ctx,clamp(bi*3,0,1),()=>ctx.drawImage(m9_barPic(),cx+cw/2-62,by-12-26*(1-ease(bi)),124,24));
  const tx=x+126;g.l.forEach((s,k)=>wc_T(ctx,s,tx,y+66+k*36,{w:800,size:30,col:WC_DARK}));wc_T(ctx,g.v,tx,y+172,{w:800,size:48,col:WC_DARK});
  wc_T(ctx,g.lim,tx,y+216,{w:600,size:28,col:WC_INK});wc_T(ctx,g.src,tx,y+256,{w:600,size:28,col:WC_MUTED});
  const ok=o.ok==null?1:o.ok,past=o.past||0;
  if(past>0.01){wc_cross(ctx,tx+18,y+298,30,WC_NO,clamp(past/0.4,0,1));withA(ctx,clamp((past-0.3)/0.5,0,1),()=>wc_T(ctx,"past its limit",tx+46,y+308,{w:700,size:28,col:WC_NO}));}
  else if(ok>0){wc_tick(ctx,tx+18,y+296,30,WC_ROLEINK.alumna,clamp(ok/0.4,0,1),4);withA(ctx,clamp((ok-0.3)/0.5,0,1),()=>wc_T(ctx,"within its limit",tx+46,y+308,{w:700,size:28,col:WC_ROLEINK.alumna}));}}
// a small card on the dashboard, its name and two lines: each measure has a test for its limit; the platform works them out every night,
// keeps them and shows them. No tool is named (the series' rule, 20 October 2026)
function m9_tool(ctx,x,y,w,h,k,name,lines){wc_panel(ctx,x,y,w,h,{kind:"card",seed:k.length+50});wc_T(ctx,name,x+24,y+56,{w:800,size:32,col:WC_DARK});
  lines.forEach((s,i)=>wc_T(ctx,s,x+24,y+104+i*36,{w:600,size:28,col:WC_INK}));}
// a tutor's role, its term contract ended, still active: the kind of thing the third measure finds; o.ring draws the pencil round it, o.close
// closes it
function m9_tutor(ctx,t,x,y,o){const cl=o.close||0,a=clamp(1-cl*2,0,1),b=clamp(cl*2-1,0,1);withA(ctx,1-0.45*cl,()=>wc_chip(ctx,x,y,346,58,"tutor","term contract ended",null,{seed:3}));
  // one word, then the other: "still active" goes before "closed" comes, so the two never show at once
  if(a>0.01)withA(ctx,a,()=>wc_badge(ctx,x,y+110,"still active"));if(b>0.01)withA(ctx,b,()=>{wc_tick(ctx,x+22,y+108,30,WC_ROLEINK.alumna,b,4);wc_badge(ctx,x+48,y+110,"closed");});
  wc_ring(ctx,x+173,y+72,236,98,o.ring||0,{seed:5});}
// the alert, as it arrives on Monday at seven: which measure, how far it's gone, and its limit
function m9_bell(ctx,x,y){ctx.save();ctx.strokeStyle=rgba(WC_INK,0.9);ctx.fillStyle=rgba(wc_lit(WC_NO,0.55),1);ctx.lineWidth=2.6;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-13,y+8);
  ctx.quadraticCurveTo(x-12,y-14,x,y-15);ctx.quadraticCurveTo(x+12,y-14,x+13,y+8);ctx.lineTo(x+16,y+11);ctx.lineTo(x-16,y+11);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.arc(x,y+15,4,0,TAU);ctx.stroke();ctx.restore();}
function m9_alert(ctx,x,y){const w=520,h=196,tW=tw(ctx,"alert · Monday 7:00",30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_NO,sw:tW+92,seed:61});m9_bell(ctx,x+50,y+38);
  wc_T(ctx,"alert · Monday 7:00",x+80,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,"the queue's oldest case: 12 days",x+32,y+112,{w:600,size:28,col:WC_INK});
  wc_T(ctx,"its limit: 7",x+32,y+156,{w:600,size:28,col:WC_MUTED});}
// the case: two records the queue couldn't decide alone, their birth dates one digit apart; the note on it, and its stamp
function m9_case(ctx,t,x,y,o){wc_panel(ctx,x,y,900,380,{kind:"sheet",seed:66});
  [["student","Student","S-21388","born 3 June"],["researcher","Researcher","E-5263","born 8 June"]].forEach(([r,title,id,bd],i)=>{const cx=x+30+i*440;
    wc_roleCard(ctx,cx,y+36,400,180,r,title,id,null,{note:"Daniel Okoye",seed:i+3});wc_T(ctx,bd,cx+32,y+180,{w:600,size:28,col:WC_INK});
    wc_ring(ctx,cx+32+tw(ctx,"born ",28,600)+tw(ctx,bd.slice(5),28,600)/2,y+170,62,26,o.ring||0,{seed:7+i,col:WC_NO});});
  // the note: waiting, then what HR said
  const nx=x+30,ny=y+252,nw=360;wc_panel(ctx,nx,ny,nw,92,{kind:"card",wash:WC_BADGE,washA:0.5,seed:68});const hr=o.hr||0;
  withA(ctx,1-hr,()=>wc_hand(ctx,"waiting for HR",nx+26,ny+58,{size:32,w:700,col:WC_INK}));withA(ctx,hr,()=>wc_hand(ctx,"HR: 3 June, a typo",nx+26,ny+58,{size:32,w:700,col:WC_INK,p:clamp(hr*1.4,0,1)}));
  m9_stamp(ctx,t,x+664,y+302,o.ts==null?1e9:o.ts,"linked · reason kept",{size:30});}

/* ---------- 7. a list from outside, and a change to the university's ---------- */
// the government's list of visa types, its title on the public sector's green-blue; its new row, when it's added (o.add)
function m9_govList(ctx,t,x,y,o){wc_panel(ctx,x,y,680,370,{kind:"card",role:WC_IND.public,sw:648,sh:92,seed:73});
  wc_T(ctx,"visa types",x+36,y+54,{w:800,size:32,col:WC_DARK});wc_T(ctx,"the government's list",x+36,y+92,{w:600,size:28,col:WC_DARK});
  ["student visa","graduate visa","visitor visa"].forEach((s,i)=>wc_T(ctx,s,x+40,y+156+i*48,{w:600,size:28,col:WC_INK}));
  const a=o.add||0;if(a>0.01)arrive(ctx,x+200,y+300,t,o.tAdd,()=>{wc_T(ctx,"graduate research visa",x+40,y+310,{w:700,size:28,col:WC_DARK});
    wc_badge(ctx,x+60+tw(ctx,"graduate research visa",28,700),y+300,"new");},{dy:10});}
// the university's own list: each visa type with its fee category; the new row joins it (o.join), carried from the change
const M9_UNIROWS=[["student visa","international fees"],["graduate visa","international fees"],["visitor visa","not eligible"]];
function m9_uniList(ctx,t,x,y,o){wc_panel(ctx,x,y,680,330,{kind:"card",role:WC_IND.uni,sw:648,sh:92,seed:75});
  wc_T(ctx,"visa types",x+36,y+54,{w:800,size:32,col:WC_DARK});wc_T(ctx,"the university's list",x+36,y+92,{w:600,size:28,col:WC_DARK});
  M9_UNIROWS.forEach(([a,b],i)=>{wc_T(ctx,a,x+40,y+156+i*44,{w:600,size:28,col:WC_INK});wc_T(ctx,b,x+640,y+156+i*44,{w:600,size:28,align:"right",col:WC_INK});});}
// the change an agent drafts, typed in as o.type goes 0 to 1: what, its evidence, and whose decision it is; the owner's tick (o.ok)
const M9_CHG=[["Map a new visa type",34,800,WC_DARK],["graduate research visa",30,700,WC_DARK],["→ international fees",30,700,WC_DARK],
  ["the government's notice",28,600,WC_MUTED],["closest value: student visa",28,600,WC_MUTED],["for: the admissions office",28,600,WC_INK]],M9_CHGY=[112,166,206,268,306,358];
function m9_change(ctx,t,x,y,o){wc_panel(ctx,x,y,620,476,{kind:"card",seed:71});wc_badge(ctx,x+32,y+44,"drafted by an agent");
  const n=M9_CHG.length,ty=clamp(o.type||0,0,1)*n;M9_CHG.forEach(([s,size,wt,col],i)=>{const p=clamp(ty-i,0,1);if(p>0)wc_T(ctx,typeOn(s,p),x+32,y+M9_CHGY[i],{w:wt,size,col});});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.3);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+32,y+232);ctx.lineTo(x+588,y+232);ctx.stroke();ctx.restore();
  const ok=o.ok||0;if(ok>0){wc_tick(ctx,x+52,y+418,34,WC_ROLEINK.alumna,clamp(ok/0.4,0,1),4.5);withA(ctx,clamp((ok-0.3)/0.5,0,1),()=>wc_T(ctx,"approved by the admissions office",x+84,y+430,{w:700,size:28,col:WC_ROLEINK.alumna}));}}

/* ---------- 8. the governance scorecard ---------- */
// a row for each domain: its owner, and how many of its measures are within their limits; the person's row arrives (o.row), lit
const M9_SC=[["course","academic registrar","6 of 6"],["fees","finance office","4 of 4"],["research","research office","5 of 6"]],M9_SCX=[40,260,660];
function m9_scorecard(ctx,t,x,y,o){wc_panel(ctx,x,y,1240,560,{kind:"sheet",seed:81});wc_T(ctx,"governance scorecard",x+40,y+66,{w:800,size:36,col:WC_DARK});
  ["domain","owner","within limits"].forEach((s,i)=>wc_T(ctx,s,x+M9_SCX[i],y+132,{w:600,size:28,col:WC_MUTED}));
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+36,y+152);ctx.lineTo(x+1204,y+152);ctx.stroke();ctx.restore();
  M9_SC.forEach((r,i)=>r.forEach((s,k)=>wc_T(ctx,s,x+M9_SCX[k],y+204+i*60,{w:k?600:800,size:30,col:WC_INK})));
  const ra=o.row||0;if(ra>0.01)arrive(ctx,x+620,y+410,t,o.tRow,()=>{wc_panel(ctx,x+20,y+364,1200,76,{kind:"card",wash:WC_BADGE,washA:0.4,seed:83});
    ["person","Mei's office","5 of 5"].forEach((s,k)=>wc_T(ctx,s,x+M9_SCX[k],y+414,{w:800,size:30,col:WC_DARK}));},{dy:14});}

/* ---------- 9. elsewhere ---------- */
// a bank's duplicate customers over twelve years: they climb, and a clean-up every three years takes them back down; after one check at
// entry, they stay down. The line is drawn to year p*12; the chart's title is on the right, clear of the tag over the clean-ups
function m9_bankAt(y){if(y>=9.4)return 0.07+0.02*Math.sin(y*5);const k=y%3;return y<0.02?0.04:lerp(0.06,0.94,Math.pow(k/3,0.8));}
function m9_bankLine(ctx,t,b,p){const x0=b.x+60,x1=b.x+b.w-60,y0=b.y+120,y1=b.y+b.h-60,X=v=>lerp(x0,x1,v/12),Y=v=>lerp(y1,y0,v);wc_panel(ctx,b.x,b.y,b.w,b.h,{kind:"sheet",seed:91});
  wc_T(ctx,"a bank's duplicate customers",b.x+b.w-40,b.y+64,{w:800,size:32,col:wc_dim(WC_IND.bank,0.25),align:"right"});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x0,y0-12);ctx.lineTo(x0,y1);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();
  const yE=clamp(p,0,1)*12;if(yE<=0)return{X,Y};const pts=[];for(let v=0;v<=yE+1e-6;v+=0.05){if(v>0&&Math.abs(v%3)<0.05&&v<9.2){pts.push([X(v-0.001),Y(m9_bankAt(v-0.06))]);}pts.push([X(v),Y(m9_bankAt(v))]);}
  ctx.save();ctx.strokeStyle=rgba(WC_IND.bank,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.lineJoin="round";wc_trOpen(ctx,pts);ctx.stroke();ctx.restore();return{X,Y};}
// another industry with the same picture: a chip in its colour, with the same climb and fall, small, beside its name
function m9_indChip(ctx,x,y,ind,label){const w=Math.round(tw(ctx,label,30,800)+150);wc_chip(ctx,x,y,w,60,WC_IND[ind],label,null,{seed:label.length});
  const sx=x+w-104,sy=y+44;ctx.save();ctx.strokeStyle=rgba(wc_dim(WC_IND[ind],0.3),0.95);ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(sx,sy);
  for(let i=0;i<3;i++){ctx.lineTo(sx+i*26+22,sy-26);ctx.lineTo(sx+i*26+24,sy);}ctx.lineTo(sx+90,sy-2);ctx.stroke();ctx.restore();return w;}

/* ===== Kept, not cleaned: scenes =====
   Ten chapters, as in ../script.md: Dujiangyan, split without a dam, its inner channel dug out every dry season down to a mark in its
   bed; the university's clean-up of 2024; the duplicates coming back, intake by intake; the search before create at the application;
   the steward's five measures, each with a limit; an alert, and the case it points at; a change to a list, drafted by an agent and
   decided by its owner; the governance scorecard; a bank that cleans up every three years; and Linh's PhD, with the water let back
   into the inner channel in spring.
   Drawn in watercolour (shared/src/wash.js), made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The camera
   moves in on whatever the narration is about, and every shot drifts slowly; things arrive with a spring. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera, as The map before the data moves it (keys are [time, x, y, zoom], each move eased over d seconds), kept inside the place
function m9_focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera, and over it all, the paper
function m9_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m9_focus(ctx,t,keys,o.d||1.6);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m9_place(ctx,place);return cam;}
function m9_close(ctx,S){ctx.restore();setScreen(ctx,S);}

/* ---------- 1. Kept, every dry season ---------- */
// the river through a year: o says when the dry season comes (dry), the tripods close the inner channel (close), its water drains
// (drain), the diggers go down into its bed (dig), the tripods come down (open), the water comes back (fill), and the land greens again
// (green)
function m9_seasons(ctx,t,o){const dryA=fin(t,o.dry,1.6)*(1-fin(t,o.green,1.6));m9_place(ctx,"river");if(dryA>0.01)withA(ctx,dryA,()=>m9_place(ctx,"riverDry"));
  const dr=ease(clamp((t-o.drain)/1.8,0,1)),fl=ease(clamp((t-o.fill)/1.8,0,1)),cf=ease(clamp((t-o.fill-1.4)/1.3,0,1));
  // the inner channel's water over the dry bed: it drains from the tripods down, and comes back from the head
  if(dryA>0.01){if(t<o.fill)m9_waterIn(ctx,lerp(M9_CLOSE,1,dr),1,clamp((dr-0.55)/0.45,0,1)*M9_CDMAX,M9_CDMAX);else m9_waterIn(ctx,M9_CLOSE,lerp(M9_CLOSE,1,fl),0,cf*M9_CDMAX);}
  const inA=t<o.drain?1:t<o.fill?1-dr:fl;
  m9_flow(ctx,t,M9_MAIN,M9_WMAIN,40,80,3,1,0.34,M9_SEEN);m9_flow(ctx,t,M9_IN,M9_WIN,12,52,7,inA,0.3);
  M9_CAN.forEach((c,i)=>m9_flow(ctx,t,c.p,c.w,Math.ceil(c.L/160),36,11+i,(t<o.drain?1:t<o.fill?0:cf)*0.7,0.1));
  m9_tripods(ctx,t,o.close,o.open);m9_diggers(ctx,t,o.dig,fin(t,o.dig,0.5)*(1-fin(t,o.open-0.7,0.6)));return dryA;}
scene("river",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tMin=w("split","Min River"),tTwo=w("split","in two"),tPl=w("split","Chengdu plain"),tG=c("gravel"),tOut=w("gravel","outer channel"),
    tD=c("dry"),tEv=w("dry","every dry season"),tCl=w("dry","closed off"),tDug=w("dry","dug out"),tMk=w("dry","a mark"),tM=c("mark"),tIr=w("mark","iron bars"),
    tR=c("rule"),tSix=w("rule","six characters"),tDig=w("rule","dig the riverbed"),tSt=c("still"),tWat=w("still","still waters"),tK=c("kept");
  // the camera: the valley; in on the split as the gravel goes by; down the inner channel in the dry season, as it's dug out; across to
  // the cut through its bed; out for the rule; over the plain as the water comes back; out
  m9_open(ctx,S,t,sc,null,[[0,960,540,1],[tMin-0.6,990,480,1.1],[tG-0.5,1000,470,1.7],[tD-0.3,880,560,1.4],[tM-1.1,1120,450,1.18],[tR-0.6,960,520,1],[tSt-0.3,740,640,1.28],[tK-0.3,960,540,1]]);
  const o={dry:tEv-0.2,close:tCl-0.1,drain:tCl+0.5,dig:tDug,open:tSt-0.1,fill:tSt+0.5,green:tSt+2.4};m9_seasons(ctx,t,o);
  m9_gravel(ctx,t,tG-1.2,fin(t,tG-0.8,0.6)*(1-fin(t,tD,0.8)));
  // the channels, named as the river splits; the plain, as it's watered
  const off=t1=>1-fin(t,t1,0.5);
  arrive(ctx,1150,330,t,tMin,()=>withA(ctx,off(tD-0.2),()=>wc_tag(ctx,1150,330,"Min River",{align:"center"})),{dy:8});
  arrive(ctx,1250,628,t,tTwo+0.1,()=>withA(ctx,off(tMk-0.6),()=>wc_tag(ctx,1250,628,"outer channel",{align:"center"})),{dy:8});
  arrive(ctx,760,600,t,tTwo+0.5,()=>withA(ctx,off(tMk-0.6),()=>wc_tag(ctx,760,600,"inner channel",{align:"center"})),{dy:8});
  arrive(ctx,290,540,t,tPl,()=>withA(ctx,off(tG-0.6),()=>wc_tag(ctx,290,540,"to the Chengdu plain",{align:"center"})),{dy:8});
  arrive(ctx,760,474,t,tEv+0.3,()=>withA(ctx,off(tMk-0.6),()=>wc_tag(ctx,760,474,"every dry season",{align:"center"})),{dy:8});
  // the cut through the riverbed, over a veil of paper, once the line has named the mark: dug out down to it, and no deeper; then the rule
  const hush=fin(t,tM-0.8,0.6)*(1-fin(t,tSt-0.6,0.8));m9_hush(ctx,0.5*hush);
  const pa=1-fin(t,tR-0.6,0.6);if(pa>0.01)withA(ctx,pa,()=>{const S9=M9_SEC,cx=S9.x+S9.w/2,my=S9.y+M9_MARK;
    arrive(ctx,cx,S9.y+S9.h/2,t,tM-0.7,()=>m9_section(ctx,t,{tDig:tM-0.5,tDug:tM+0.5,tBars:tIr-0.1,tLine:tM+1.2}),{dy:24,d:0.9,from:0.96});
    arrive(ctx,cx,my+70,t,tM+0.5,()=>withA(ctx,off(tIr-0.6),()=>wc_tag(ctx,cx,my+70,"stone horses, it's said",{align:"center"})),{dy:8});
    arrive(ctx,cx,my+70,t,tIr+0.1,()=>wc_tag(ctx,cx,my+70,"iron bars",{align:"center"}),{dy:8});
    arrive(ctx,cx,my+122,t,tIr+0.5,()=>wc_tag(ctx,cx,my+122,"the oldest cast in 1576",{align:"center",size:28,w:600}),{dy:8});
    arrive(ctx,cx,S9.y+S9.h+40,t,tM+1.9,()=>wc_tag(ctx,cx,S9.y+S9.h+40,"dig until you see it, and no deeper",{align:"center"}),{dy:8});});
  const ra=1-fin(t,tSt-0.6,0.6);if(ra>0.01)withA(ctx,ra,()=>{m9_rule(ctx,960,196,clamp((t-tDig+0.3)/1.6,0,1));
    arrive(ctx,960,296,t,tSix,()=>wc_tag(ctx,960,296,"the rule, six characters long",{align:"center",size:28,w:600}),{dy:8});});
  m9_close(ctx,S);
  wc_year(ctx,64,80,"about 256 BC · Sichuan",fin(t,0.4,0.6)*(1-fin(t,tSt+0.2,0.4)));wc_year(ctx,64,80,"today",fin(t,tWat,0.5));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"Kept, not cleaned","looking after it every day, and checks at entry","Film 9 of 9 · master and reference data");});

/* ---------- 2. The clean-up ---------- */
// the chart's box at the side here, and where it grows to as it takes the frame in chapter 3
const M9_B2={x:1100,y:150,w:700,h:470},M9_B3={x:90,y:96,w:1180,h:680};
// the team of four, before the board: Mei (the business side, gold), Sam, Ben and Rosa (the technical side, cyan)
const M9_TEAM=[["mei",300],["sam",490],["ben",680],["rosa",870]];
scene("cleanup",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tProj=w("merged","clean-up project"),tMer=w("merged","merged"),tPpl=w("merged","people"),tFour=w("team","a team of four"),tSix=w("team","six months"),
    tFin=w("team","finished on time"),tG=c("gone");
  // the camera: the campus; in on the board as the pairs merge; out for the team; across to the chart as the line reaches none. No drift, so
  // the chart is where chapter 3 takes it from
  m9_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tProj-0.5,738,415,1.3],[tFour-0.5,960,540,1],[tG-0.5,1150,432,1.25]],{z:0});
  m9_hush(ctx,0.42*fin(t,tG-0.4,0.8));
  const mg=clamp((t-tMer)/(tPpl+0.5-tMer),0,1),mo=clamp((t-tSix+0.1)/(tFin-tSix+0.4),0,1),past=1-fin(t,tG-0.3,0.9);
  // the project, and the team who did it, step back as the line reaches none: it's over
  if(past>0.01)withA(ctx,past,()=>{
    arrive(ctx,M9_BD.x+M9_BD.w/2,M9_BD.y+M9_BD.h/2,t,tProj-0.2,()=>m9_board(ctx,t,{merge:mg,count:ease(mg),months:mo}),{dy:20,d:0.9,from:0.95});
    arrive(ctx,M9_BD.x+M9_BD.w-150,M9_BD.y+M9_BD.h-62,t,tFin,()=>{ctx.save();ctx.translate(M9_BD.x+M9_BD.w-150,M9_BD.y+M9_BD.h-62);ctx.rotate(-0.05);
      const bw=tw(ctx,"finished on time",28,700)+28;wc_badge(ctx,-bw/2,0,"finished on time");ctx.restore();},{dy:-18,d:0.6,from:1.25});
    M9_TEAM.forEach(([id,x],i)=>arrive(ctx,x,800,t,tFour-0.35+i*0.12,()=>person(ctx,id,x,1032,0.74,{pose:"stand",expr:t>tFin+0.3?"relieved":"calm",t}),{d:0.8,from:0.97}));
    arrive(ctx,1010,724,t,tFour+0.25,()=>wc_tag(ctx,1010,724,"a team of four"),{dy:8});});
  // the chart begins at the side: the line falls as the months fill, and runs on at none
  arrive(ctx,M9_B2.x+M9_B2.w/2,M9_B2.y+M9_B2.h/2,t,tSix-0.7,()=>m9_waiting(ctx,t,M9_B2,{mEnd:9,still:true,mL:6*mo+1.6*ease(clamp((t-tG)/1.2,0,1)),hi:fin(t,tG+0.2,0.5)}),{dy:16,d:0.9,from:0.96});
  m9_close(ctx,S);wc_year(ctx,64,80,"2024 · the university",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 3. Back, intake by intake ---------- */
// the two applications, and the tags that explain the new duplicates, to the chart's right
const M9_UG=[1320,350],M9_PG=[1600,350],M9_AW=265,M9_AH=210;
scene("return",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tBack=w("why","came back"),tTwo=w("why","two routes"),tSec=w("linh","second number"),tJul=w("linh","July"),tOne=w("linh","one of them"),
    tFix=c("fixed"),tCh=w("fixed","change"),tHow=w("fixed","how they were made"),tL=c("linh");
  // the camera: from where chapter 2 left the chart (still while the chapters cross over), out as it takes the frame; in on the climbs for
  // Linh's two numbers; across to the applications
  m9_open(ctx,S,t,sc,"plain",[[0,1150,432,1.25],[0.8,960,540,1],[tL-0.4,662,545,1.45],[tFix-0.4,1182,470,1.3]],{z:0});
  const g=easeCam(clamp((t-0.8)/1.6,0,1)),b={x:lerp(M9_B2.x,M9_B3.x,g),y:lerp(M9_B2.y,M9_B3.y,g),w:lerp(M9_B2.w,M9_B3.w,g),h:lerp(M9_B2.h,M9_B3.h,g)},
    mL=7.6+10.4*clamp((t-1.0)/2.4,0,1),rise=[clamp((t-1.1)/0.6,0,1),clamp((t-2.25)/0.6,0,1)],ev=c("every");
  const P=m9_waiting(ctx,t,b,{mEnd:lerp(9,18,g),still:g>=1,mL,rise,vals:[fin(t,ev-0.1,0.4),fin(t,ev+0.4,0.4)],end:fin(t,3.3,0.5)});
  // Linh's two numbers, settling beside July's block
  const bx=m9_bx(P,13)+M9_BW+14;[["S-17142",tSec-0.1,P.Y(1100)+10],["S-20436",tJul,P.Y(1100)+68]].forEach(([id,t0,y])=>
    arrive(ctx,bx+88,y+26,t,t0,()=>{wc_panel(ctx,bx,y,176,52,{kind:"chip",role:WC_ROLE.student,seed:id.length});wc_T(ctx,id,bx+88,y+36,{w:600,size:28,f:"mono",align:"center",col:WC_DARK});},{dy:-30,d:0.8}));
  arrive(ctx,bx+88,P.Y(1100)+168,t,tOne-0.2,()=>wc_tag(ctx,bx+88,P.Y(1100)+168,"Linh, July 2025",{align:"center"}),{dy:8});
  // why: graduates back to study, and two ways to apply; they step aside for Linh's numbers, and the applications come back to show
  // where records are made, each stamping a new number on whoever applies
  const off=fin(t,tL-0.5,0.5),back=t>=tFix-0.3;
  arrive(ctx,1592,200,t,tBack,()=>withA(ctx,1-off,()=>wc_tag(ctx,1592,200,"back to study",{align:"center"})),{dy:8});
  arrive(ctx,1592,290,t,tTwo,()=>withA(ctx,1-off,()=>wc_tag(ctx,1592,290,"two ways to apply",{align:"center"})),{dy:8});
  arrive(ctx,1592,290,t,tHow-0.2,()=>wc_tag(ctx,1592,290,"where records are made",{align:"center"}),{dy:8});
  const sa=1-fin(t,23.4,0.6);
  [[M9_UG,"undergraduate",tTwo+0.25,20441,tCh],[M9_PG,"postgraduate",tTwo+0.45,20461,tCh+0.45]].forEach(([[x,y],sub,t0,base,ts],i)=>
    withA(ctx,back?1:1-off,()=>arrive(ctx,x+M9_AW/2,y+M9_AH/2,t,back?tFix-0.2+i*0.12:t0,()=>{m9_app(ctx,x,y,M9_AW,M9_AH,sub,6+i);
      if(t<23.4+0.6)withA(ctx,sa,()=>m9_stamping(ctx,Math.min(t,23.4),x+M9_AW/2,y+M9_AH-54,ts,base,0.9));},{dy:16})));
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 4. Stopped at the door ---------- */
// the application, now one, its new step, and the three ways out of it, across the whole frame; then the chart of new duplicates per
// intake, in the middle; and in its place, a picture of the river in the dry season
const M9_AP={x:185,y:345,w:470,h:210},M9_SR={x:725,y:395,w:286,h:110},M9_TX=1105,
  M9_OUT=[[250,"found: add a role",1585],[450,"maybe: to Mei's queue",1540],[650,"new: a new person",1585]],M9_B4={x:370,y:110,w:1180,h:680},M9_PIC={x:380,y:130,w:1160};
// Linh's roles in 2026, in film 1's order and colours
const M9_LINH=["student","tutor","researcher","alumna"].map(r=>({col:WC_ROLE[r]}));
scene("entry",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tSea=w("search","searching"),tCre=w("search","creates a person"),tM=c("match"),tAdd=w("match","adds a role"),tLik=w("match","A likely one"),tQ=w("match","Mei's queue"),
    tF=c("fell"),tFif=w("fell","under fifty"),tStay=w("fell","stayed there"),tR=c("shape"),tSk=w("shape","the search keeps"),tMq=w("shape","Mei's queue digs");
  // the camera: from the applications as chapter 3 left them (still while the chapters cross over), out to the whole way in; a little in on
  // the chart, and on the river's picture
  m9_open(ctx,S,t,sc,"plain",[[0,1182,470,1.3],[0.8,960,540,1],[tF-0.5,960,520,1.06],[tR-0.4,960,505,1.08]],{z:0});
  const fa=1-fin(t,tF-0.5,0.7);
  if(fa>0.01)withA(ctx,fa,()=>{
    // the two applications come together as one, travelling with the camera
    const mv=easeCam(clamp((t-0.8)/1.6,0,1));if(mv<1)[M9_UG,M9_PG].forEach(([x,y],i)=>withA(ctx,1-clamp((mv-0.7)/0.3,0,1),()=>
      m9_app(ctx,lerp(x,M9_AP.x+(M9_AP.w-M9_AW)/2,mv),lerp(y,M9_AP.y,mv),M9_AW,M9_AH,["undergraduate","postgraduate"][i],6+i)));
    arrive(ctx,M9_AP.x+M9_AP.w/2,M9_AP.y+M9_AP.h/2,t,1.9,()=>m9_app(ctx,M9_AP.x,M9_AP.y,M9_AP.w,M9_AP.h,"undergraduate · postgraduate",14),{d:0.6,from:0.97});
    // it searches first; three ways lead out of it
    const ay=M9_AP.y+M9_AP.h/2;m9_arrow(ctx,M9_AP.x+M9_AP.w+6,ay,M9_SR.x-8,ay,clamp((t-tSea+0.2)/0.5,0,1));
    arrive(ctx,M9_SR.x+M9_SR.w/2,M9_SR.y+M9_SR.h/2,t,tSea,()=>m9_search(ctx,t,M9_SR.x,M9_SR.y,M9_SR.w,M9_SR.h,fin(t,tSea+0.3,0.4)*(1-fin(t,tCre+1.2,0.6))+0.6*fin(t,tM-0.4,0.3)*(1-fin(t,tQ+0.6,0.5))),{d:0.7,from:0.9});
    const ox=M9_SR.x+M9_SR.w+8,oy=M9_SR.y+M9_SR.h/2,ts=[tM-0.1,tLik-0.1,tQ+0.9];
    M9_OUT.forEach(([y,s,ex],i)=>{m9_arrow(ctx,ox,oy,M9_TX-12,y,clamp((t-ts[i])/0.6,0,1));arrive(ctx,M9_TX,y,t,ts[i]+0.4,()=>wc_tag(ctx,M9_TX,y,s),{dy:8});
      const tw0=tw(ctx,s,30,700)+40;m9_arrow(ctx,M9_TX+tw0+10,y,ex,y,clamp((t-ts[i]-0.8)/0.5,0,1));});
    // found: a role added to the person already known; maybe: a case for Mei; new: a new person, who's applying
    arrive(ctx,1635,250,t,tM+0.7,()=>wc_white(ctx,"linh",1635,381,0.42,M9_LINH.concat([{col:WC_ROLE.applicant,a:fin(t,tAdd,0.6)}]),{}),{d:0.8,from:0.96});
    arrive(ctx,1645,450,t,tLik+0.8,()=>m9_stack(ctx,1555,419,3),{dy:12});
    arrive(ctx,1635,650,t,tQ+1.5,()=>wc_white(ctx,"newcomer",1635,781,0.42,[{col:WC_ROLE.applicant}],{}),{d:0.8,from:0.96});});
  // the chart, with 2026's intakes under the limit; it gives way to the river
  const ca=1-fin(t,tR-0.3,0.6);if(t>tF-0.3&&ca>0.01)withA(ctx,ca,()=>arrive(ctx,M9_B4.x+M9_B4.w/2,M9_B4.y+M9_B4.h/2,t,tF-0.3,()=>
    m9_intakes(ctx,t,M9_B4,{rise:[clamp((t-tFif+0.2)/0.7,0,1),clamp((t-tStay+0.2)/0.7,0,1)],lim:clamp((t-tFif)/0.9,0,1)}),{dy:20,d:0.9,from:0.96}));
  // the river's shape keeps most of the gravel out of the inner channel; the diggers take out the rest
  const IW=M9_PIC.w,IH=Math.round(IW*M9_INSET.h/M9_INSET.w);
  arrive(ctx,M9_PIC.x+IW/2,M9_PIC.y+IH/2,t,tR-0.2,()=>{const at=m9_inset(ctx,t,M9_PIC.x,M9_PIC.y,IW,IH),[sx,sy]=at(1010,385),[qx,qy]=at(820,640);
    arrive(ctx,sx,sy,t,tSk,()=>wc_tag(ctx,sx,sy,"the search",{align:"center"}),{dy:8});arrive(ctx,qx,qy,t,tMq,()=>wc_tag(ctx,qx,qy,"Mei's queue",{align:"center"}),{dy:8});},{dy:20,d:0.9,from:0.95});
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 5. The steward's iron bars ---------- */
// Mei, before her window, facing her dashboard: her name, while she's new to the chapter. She stands far enough right that the camera,
// in on the dashboard, leaves her out whole rather than cutting her at the edge
const M9_MEI=[1700,1010,0.92];
function m9_mei(ctx,t,o){const [x,y,s]=M9_MEI;m9_person(ctx,"mei",x,y,s,Object.assign({pose:"stand",expr:"calm",t,flip:true},o));}
function m9_dash(ctx,t,o){wc_panel(ctx,M9_DB.x,M9_DB.y,M9_DB.w,M9_DB.h,{kind:"sheet",seed:44});}
scene("measures",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tPj=w("process","a project"),tEv=w("process","everyday work"),tIron=w("bars","iron bars"),tTut=w("roles","like a tutor"),
    tAct=w("roles","still active"),tT=c("nightly"),tPf=w("nightly","the platform");
  const ts=["dups","oldest","roles","source","requests"].map(c),te=ts.slice(1).concat([tT]);
  // the camera: Mei's office; in on the whole dashboard as the measures are named, each lit in turn (all six places in the frame, so nothing
  // is cut at its edge, and every line above the captions); out, for a moment, on all five
  m9_open(ctx,S,t,sc,"office",[[0,960,540,1],[ts[0]-0.6,800,510,1.22],[B-1.4,960,540,1]],{z:0});
  const [mx]=M9_MEI;arrive(ctx,mx,700,t,0.2,()=>m9_mei(ctx,t,{pose2:"explain",mix:fin(t,tIron-0.3,0.6)*(1-fin(t,ts[0]-0.8,0.6))}),{d:0.9,from:0.97});
  arrive(ctx,mx,350,t,0.7,()=>withA(ctx,1-fin(t,ts[0]-0.6,0.6),()=>m9_name(ctx,mx,296,"Mei Tanaka","registrar's office")),{dy:12});
  // the project that ended: the clean-up's board, pinned on her wall, finished; it gives way to the dashboard, which is everyday work
  if(t<tEv+0.2)arrive(ctx,M9_BD.x+M9_BD.w/2,M9_BD.y+M9_BD.h/2,t,tPj-0.2,()=>withA(ctx,1-fin(t,tEv-0.5,0.5),()=>{m9_board(ctx,t,{merge:1,count:1,months:1});
    ctx.save();ctx.translate(M9_BD.x+M9_BD.w-150,M9_BD.y+M9_BD.h-62);ctx.rotate(-0.05);const bw=tw(ctx,"finished on time",28,700)+28;wc_badge(ctx,-bw/2,0,"finished on time");ctx.restore();}),{dy:16,d:0.8,from:0.96});
  arrive(ctx,M9_DB.x+M9_DB.w/2,M9_DB.y+M9_DB.h/2,t,tEv-0.2,()=>{m9_dash(ctx,t);
    for(let i=0;i<5;i++){const [x,y,gw,gh]=m9_cell(i);arrive(ctx,x+gw/2,y+gh/2,t,tEv+0.4+i*0.15,()=>m9_gauge(ctx,t,i,{lit:fin(t,ts[i]-0.2,0.4)*(1-fin(t,te[i],0.6)),
      barIn:clamp((t-tIron-0.1-i*0.1)/0.5,0,1),ok:clamp((t-ts[i]-0.9)/0.8,0,1)}),{dy:14,d:0.7});}
    // what the third measure finds: a tutor whose contract ended, still active; ringed, then closed
    const [rx,ry]=m9_cell(5);arrive(ctx,rx+190,ry+90,t,tTut-0.2,()=>withA(ctx,1-fin(t,tT-0.9,0.5),()=>m9_tutor(ctx,t,rx+34,ry+40,{ring:clamp((t-tAct)/0.7,0,1),close:clamp((t-te[2]+0.1)/1.0,0,1)})),{dy:12});
    // in the sixth place, two cards: each measure has a test for its limit, and the platform works them out every night
    arrive(ctx,rx+207,ry+90,t,tT,()=>m9_tool(ctx,rx+8,ry+10,398,160,"test","each measure",["has a test","for its limit"]),{dy:12});
    arrive(ctx,rx+207,ry+262,t,tPf,()=>m9_tool(ctx,rx+8,ry+182,398,160,"platform","the platform",["works them out nightly,","keeps them, shows them"]),{dy:12});},{dy:24,d:0.9,from:0.96});
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 6. Past its limit ---------- */
scene("alert",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tAl=w("monday","an alert"),tTw=w("monday","twelve days"),tW=c("waiting"),tBd=w("waiting","birth date"),tR=c("rang"),tDec=w("rang","decided"),tRea=w("rang","with its reason"),
    tB=c("blame"),tNot=w("blame","not at a person");
  // the camera: in on the dashboard and the alert as it comes in; across to the case it points at; out to Mei on the phone, and the gauge
  // back within its limit. The alert goes before the camera turns from it, so it's never cut at the frame's edge
  m9_open(ctx,S,t,sc,"office",[[0,960,540,1],[tAl-0.5,990,510,1.06],[tW-0.5,768,520,1.25],[tR-0.3,960,540,1]],{z:0});
  // the oldest case's wait: past its limit (7 days, as in Who is it?) on Monday, at 0.4807 of its eased rise; back to two days once decided
  const t0=tAl-0.2,D=tTw+0.5-t0,up=ease(clamp((t-t0)/D,0,1)),dn=ease(clamp((t-tB+0.2)/1.0,0,1)),n=lerp(lerp(3,12,up),2,dn),tX=t0+0.4807*D,tBk=tB-0.2+0.3;
  m9_dash(ctx,t);for(let i=0;i<5;i++)m9_gauge(ctx,t,i,i===1?{n,g:{v:Math.round(n)+" days"},past:t<tBk?clamp((t-tX)/0.8,0,1):0,ok:t<tX?1:clamp((t-tBk-0.4)/0.8,0,1),lit:fin(t,tAl-0.3,0.5)*(1-fin(t,tW,0.6))}:{});
  const [rx,ry]=m9_cell(5);m9_tool(ctx,rx+8,ry+10,398,160,"test","each measure",["has a test","for its limit"]);m9_tool(ctx,rx+8,ry+182,398,160,"platform","the platform",["works them out nightly,","keeps them, shows them"]);
  arrive(ctx,1580,198,t,tAl+0.3,()=>withA(ctx,1-fin(t,tW-0.4,0.5),()=>m9_alert(ctx,1320,100)),{dy:-20,d:0.7});
  // the case it points at comes forward over the dashboard, and goes back once it's decided; Mei, after the veil, stays clear on the phone
  const ca=fin(t,tW-0.3,0.5)*(1-fin(t,tB-0.4,0.6));m9_hush(ctx,0.72*ca);
  m9_mei(ctx,t,{pose2:"phone",mix:fin(t,tR-0.2,0.5)*(1-fin(t,tB,0.8)),expr:t>tRea?"relieved":"calm"});
  if(ca>0.01)withA(ctx,ca,()=>arrive(ctx,670,490,t,tW-0.3,()=>m9_case(ctx,t,220,300,{ring:clamp((t-tBd-0.2)/0.7,0,1),hr:clamp((t-tDec+0.3)/0.8,0,1),ts:tRea}),{dy:24,d:0.8,from:0.96}));
  arrive(ctx,1580,198,t,tNot-0.3,()=>wc_tag(ctx,1580,198,"a case, not a person to blame",{align:"center"}),{dy:8});
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 7. Proposed, then decided ---------- */
// the government's list comes in alone, in the middle (M9_GL0), and moves aside (M9_GL) for the university's list and the change the agent
// drafts; Leila comes in once the list's owner is named, far enough right to be whole in the frame by then
const M9_GL0=[620,200],M9_GL=[70,80],M9_UL=[70,480],M9_CG=[790,150],M9_LEI=[1700,1010,0.92];
scene("agent",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tL=c("list"),tAddOne=w("list","added one"),tD=c("draft"),tFee=w("draft","fee categories"),tChg=w("draft","a change to the list"),tO=c("owner"),
    tAdm=Math.max(w("owner","the admissions office"),tO+1.0),tApp=w("owner","approved it"),tDe=c("decides");
  // the camera: in on the government's list; out a little as it moves aside, for the university's list and the change; out to Leila
  m9_open(ctx,S,t,sc,"admissions",[[0,960,540,1],[tL-0.3,960,415,1.3],[tD-0.4,835,530,1.15],[tO-0.3,960,540,1]],{z:0});
  const [lx,ly,ls]=M9_LEI;arrive(ctx,lx,700,t,tO+0.6,()=>m9_person(ctx,"leila",lx,ly,ls,{pose:"stand",pose2:"explain",mix:fin(t,tAdm-0.1,0.6),expr:t>tApp+0.3?"relieved":"calm",t,flip:true}),{d:0.9,from:0.97});
  arrive(ctx,lx,330,t,tO+0.8,()=>withA(ctx,1-fin(t,tDe-0.4,0.6),()=>m9_name(ctx,lx,276,"Leila Haddad","admissions office")),{dy:12});
  const mv=easeCam(clamp((t-tD+0.4)/1.6,0,1)),gx=lerp(M9_GL0[0],M9_GL[0],mv),gy=lerp(M9_GL0[1],M9_GL[1],mv);
  arrive(ctx,gx+340,gy+185,t,tL+0.1,()=>m9_govList(ctx,t,gx,gy,{add:fin(t,tAddOne,0.3),tAdd:tAddOne}),{dy:18,d:0.8});
  arrive(ctx,M9_UL[0]+340,M9_UL[1]+165,t,tFee-0.3,()=>m9_uniList(ctx,t,M9_UL[0],M9_UL[1],{}),{dy:18,d:0.8});
  // the change comes in once the government's list is out of its way
  arrive(ctx,M9_CG[0]+310,M9_CG[1]+238,t,tD+1.0,()=>m9_change(ctx,t,M9_CG[0],M9_CG[1],{type:clamp((t-tD-1.3)/(tChg+0.4-tD-1.3),0,1),ok:clamp((t-tApp)/0.9,0,1)}),{dy:18,d:0.8});
  // once approved, the row joins the university's own list, in its place and lit as the list's newest row
  const yl=M9_UL[1]+156+3*44;arrive(ctx,M9_UL[0]+360,yl-8,t,tApp+0.9,()=>{wc_panel(ctx,M9_UL[0]+20,yl-30,640,44,{kind:"card",wash:WC_BADGE,washA:0.4,seed:77});
    wc_T(ctx,"graduate research visa",M9_UL[0]+40,yl,{w:700,size:28,col:WC_DARK});wc_T(ctx,"international fees",M9_UL[0]+640,yl,{w:700,size:28,align:"right",col:WC_DARK});},{dy:10});
  arrive(ctx,1100,702,t,tDe+0.1,()=>wc_tag(ctx,1100,702,"the agent proposes · the owner decides",{align:"center"}),{dy:8});
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 8. On the scorecard ---------- */
const M9_SCP=[580,110];
scene("scorecard",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tSc=w("yusuf","his scorecard"),tOther=w("yusuf","every other domain"),tTh=c("three"),tLim=w("three","limits"),tWay=w("three","a way to change them");
  // the camera: Yusuf's office; the scorecard, with Yusuf whole beside it; in on the person's row as its three things are named, once
  // he has lowered his hand (the camera leaves him out, rather than cutting him at the edge)
  m9_open(ctx,S,t,sc,"gov",[[0,960,540,1],[tSc-0.4,1000,520,1.1],[tTh-0.3,1200,440,1.4]],{z:0});
  arrive(ctx,300,700,t,0.2,()=>person(ctx,"yusuf",300,1010,0.95,{pose:"stand",pose2:"explain",mix:fin(t,tSc-0.3,0.6)*(1-fin(t,tTh-0.9,0.6)),expr:"calm",t}),{d:0.9,from:0.97});
  arrive(ctx,300,312,t,0.6,()=>withA(ctx,1-fin(t,tSc,0.6),()=>m9_name(ctx,300,258,"Yusuf Demir","data governance lead")),{dy:12});
  const [x,y]=M9_SCP;arrive(ctx,x+620,y+280,t,tSc-0.3,()=>m9_scorecard(ctx,t,x,y,{row:fin(t,tOther,0.3),tRow:tOther}),{dy:20,d:0.9,from:0.96});
  [[x+390,tTh,"an owner"],[x+720,tLim,"a limit"],[x+1030,tWay,"a way to change it"]].forEach(([tx,t0,s])=>arrive(ctx,tx,y+500,t,t0,()=>wc_tag(ctx,tx,y+500,s,{align:"center"}),{dy:8}));
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 9. Elsewhere ---------- */
const M9_BK={x:160,y:240,w:1600,h:580};
scene("elsewhere",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tBank=w("bank","A bank cleans up"),tBackT=w("bank","come back every time"),tO=c("one");
  // the camera: the industries; in on the bank's line; across to where it stays down
  m9_open(ctx,S,t,sc,"plainB",[[0,960,540,1],[tBank-0.3,960,540,1.06],[tO-0.3,1120,560,1.2]]);
  arrive(ctx,730,150,t,c("bank")+0.2,()=>m9_indChip(ctx,505,120,"health","a hospital's patients"),{dy:12});
  arrive(ctx,1200,150,t,c("bank")+0.6,()=>m9_indChip(ctx,995,120,"retail","a shop's suppliers"),{dy:12});
  // the line: three climbs, each ended by a clean-up three years on; then one check at entry, and it stays down
  const t9=tBackT+0.6,p=t<tO?(9.3/12)*clamp((t-tBank)/(t9-tBank),0,1):lerp(9.3/12,1,clamp((t-tO)/1.6,0,1)),tDrop=tBank+(3/9.3)*(t9-tBank);
  arrive(ctx,M9_BK.x+M9_BK.w/2,M9_BK.y+M9_BK.h/2,t,tBank-0.4,()=>{const G=m9_bankLine(ctx,t,M9_BK,p);
    arrive(ctx,G.X(3),M9_BK.y+M9_BK.h-30,t,tDrop,()=>wc_tag(ctx,G.X(3),M9_BK.y+M9_BK.h-30,"clean-up",{align:"center"}),{dy:8});
    const bp=clamp((t-tDrop-1.2)/0.6,0,1);if(bp>0){const yb=M9_BK.y+104,x0=G.X(3),x1=lerp(x0,G.X(6),ease(bp));ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=2.4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(x0,yb+12);ctx.lineTo(x0,yb);ctx.lineTo(x1,yb);if(bp>=1)ctx.lineTo(x1,yb+12);ctx.stroke();ctx.restore();
      withA(ctx,clamp(bp*2-1,0,1),()=>wc_tag(ctx,(G.X(3)+G.X(6))/2,yb-30,"every three years",{align:"center"}));}
    arrive(ctx,G.X(10.7),G.Y(0.3),t,tO+0.2,()=>wc_tag(ctx,G.X(10.7),G.Y(0.3),"one check at entry",{align:"center"}),{dy:8});},{dy:20,d:0.9,from:0.96});
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 10. Kept ---------- */
// Linh, as the person, in February 2027: a tutor and an alumna, and now a student again, for her PhD; then the river in spring
const M9_LX=640,M9_LY=1010;
scene("kept",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tLs=w("phd","Linh starts"),tRole=w("phd","a new role"),tTh=w("count","thirty-eight"),tShe=w("count","She isn't"),tDu=w("spring","at Dujiangyan"),tEs=w("spring","every spring"),
    tRep=w("spring","repairs are done"),tLet=w("spring","let back in"),tLine=c("line");
  const k=fin(t,tDu-0.6,1.2);
  // the river, every spring: the repairs done, the tripods come down and the water is let back into the inner channel and out to the fields
  if(k>0.01){m9_open(ctx,S,t,sc,null,[[0,740,640,1.28],[tLet+0.8,960,540,1]]);m9_seasons(ctx,t,{dry:-20,close:-20,drain:-20,dig:1e9,open:tRep-0.1,fill:tLet-0.3,green:tLet+1.2});m9_close(ctx,S);}
  if(k<0.99)withA(ctx,1-k,()=>{m9_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tLs-0.5,880,560,1.12],[tTh-0.6,1063,500,1.12]]);m9_hush(ctx,0.35);
    const BY=wc_bandY("linh",1.0,M9_LY,2);wc_link(ctx,M9_LX+66,BY,800,BY,WC_ROLE.student,{p:clamp((t-tRole-0.2)/0.4,0,1),a:0.85});
    arrive(ctx,M9_LX,M9_LY-300,t,0.4,()=>wc_white(ctx,"linh",M9_LX,M9_LY,1.0,[{col:WC_ROLE.tutor},{col:WC_ROLE.alumna},{col:WC_ROLE.student,a:fin(t,tRole,0.6)}],{}),{d:0.9,from:0.97});
    arrive(ctx,1035,BY,t,tRole+0.3,()=>wc_chip(ctx,800,BY-29,470,58,"student","Student","PhD, from Feb 2027",{}),{dy:10});
    // that intake's new duplicates, under the limit; Linh isn't one of them
    const bx=[1300,210,414,350];arrive(ctx,bx[0]+bx[2]/2,bx[1]+bx[3]/2,t,tTh-0.6,()=>m9_gauge(ctx,t,0,{box:bx,n:38*ease(clamp((t-tTh+0.4)/1.0,0,1)),
      g:{l:["new duplicates,","Feb 2027"],v:"38"},ok:clamp((t-tTh-0.8)/0.8,0,1)}),{dy:16,d:0.8});
    arrive(ctx,1507,640,t,tShe-0.1,()=>wc_tag(ctx,1507,640,"Linh: not one of them",{align:"center"}),{dy:8});
    m9_close(ctx,S);});
  wc_year(ctx,64,80,"February 2027 · the university",fin(t,0.3,0.6)*(1-fin(t,tDu-0.4,0.5)));wc_year(ctx,64,80,"every spring",fin(t,tEs,0.5));wc_paperOver(ctx,S);
  // the line, then carried down onto the end card, above the veil, landing where the card's own line fades in and takes it over
  const KL="Clean it once, and it decays. Keep it, and it lasts.",kl=fin(t,tLine-0.1,0.6),ky=lerp(128,420,fin(t,B+0.3,1.1)),kg=kl*(1-fin(t,B+0.8,0.9));
  if(kg>0.01){setScreen(ctx,S);withA(ctx,kg,()=>{ctx.save();ctx.translate(960,ky-16);ctx.scale(1,0.2);const g=ctx.createRadialGradient(0,0,10,0,0,700);
    g.addColorStop(0,rgba(WC_PAPER,0.94));g.addColorStop(0.7,rgba(WC_PAPER,0.7));g.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=g;ctx.fillRect(-700,-700,1400,1400);ctx.restore();});}
  wc_end(ctx,S,t,B+0.8,"Kept, not cleaned",KL,"Film 9 of 9");
  if(kl>0.01&&t<B+2.4){setScreen(ctx,S);withA(ctx,kl,()=>wc_T(ctx,KL,960,ky,{w:700,size:48,align:"center",col:WC_DARK}));}});

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

/* ===== The same one, everywhere: what the films need before they start, and the video's finishing pass =====
   Loaded after the engine, so its prepAssets is the one the engine calls: the fonts, then the paper and the pigment's grain, then each
   place the film paints (WC_PLACES, in the film's own pictures). The rendered video and the checks paint every place before they start;
   the site's player paints the first, then the others one by one while the film plays, so it starts quickly.
   Then, for the video only (tools/render.py calls renderAt), motion blur: each video frame is the average of MB moments across a third of
   a frame (a 126-degree shutter), so movement reads as filmed, as in In the weeds of data crafting. No glow: it would wash out the paper.
   No film grain: the paper is the grain. */
async function prepAssets(){await fontsReady3();wc_prep();const ks=typeof WC_PLACES!=="undefined"?Object.keys(WC_PLACES):[];
  if(window.__RENDER__){ks.forEach(wc_place);return;}
  if(ks.length)wc_place(ks[0]);let i=1;const next=()=>{if(i>=ks.length)return;wc_place(ks[i++]);setTimeout(next,60);};setTimeout(next,200);}
// a place, painted once by the film's own painter, and kept
function wc_place(key){return wc_kept("place:"+key,W,H,WC_PLACES[key]);}
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);return out.toDataURL("image/jpeg",q||0.9);};})();}
