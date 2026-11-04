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

// Many agents, and what emerges, the ninth film of What an agent is, the first series on agentic data engineering. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years in words). The few longer stops are in breath.js.
const NARR={
"breathes":{"name":"A building that breathes","lead":1.6,"tail":1.0,"vo":[
 {"id":"place","gap":0.8,"text":"Harare, Zimbabwe, 1992. A property company asked the architect Mick Pearce for offices and shops in the heart of the city.","say":"Harare, Zimbabwe, nineteen ninety-two. A property company asked the architect Mick Pearce for offices and shops in the heart of the city."},
 {"id":"cooled","gap":0.8,"text":"Buildings that size were usually cooled by air conditioning: imported, expensive, and running all day."},
 {"id":"bills","gap":0.8,"text":"That meant high bills, and high rents for the shops and offices inside."},
 {"id":"change","gap":0.8,"text":"Something had to change. The owners asked for a building that would cool itself."},
 {"id":"mounds","gap":0.3,"text":"Pearce looked to termite mounds, which were thought then to breathe like chimneys,"},
 {"id":"rising","gap":0.8,"text":"warm air rising out of the top and drawing fresh air in below."},
 {"id":"built","gap":0.8,"text":"So he built Eastgate to breathe that way, with many simple parts instead of one big machine."},
 {"id":"nights","gap":0.8,"text":"On Harare's cool nights, fans pull air in, and concrete under the floors stores the cool."},
 {"id":"day","gap":0.8,"text":"By day, warm air rises out through forty-eight brick chimneys."},
 {"id":"opened","gap":0.8,"text":"Eastgate opened in 1996, with no air conditioning.","say":"Eastgate opened in nineteen ninety-six, with no air conditioning."},
 {"id":"cost","gap":0.8,"text":"It cost about a tenth less to build, and used far less energy."},
 {"id":"rents","gap":0.8,"text":"Rents could be lower, and its shops and offices were let before it was finished."},
 {"id":"council","gap":0.8,"text":"At the university, after each census day, the council asks why each faculty's count changed."},
 {"id":"weeks","gap":0.8,"text":"The reasons sit in four faculties' notes and emails. Last year, gathering them took two weeks, and the budgets were set before they came."},
 {"id":"shared","gap":0.8,"text":"This year, many small agents shared the work: drafts by the afternoon, and a mistake no one had asked them to find."}]},
"little":{"name":"Much from little","lead":1.0,"tail":1.0,"vo":[
 {"id":"plan","gap":0.8,"text":"No termite holds the plan of a mound."},
 {"id":"mud","gap":0.8,"text":"Each drops its mud where its nestmates' scent is strongest, so pillars rise, then arches. The work itself tells the next worker what to do."},
 {"id":"ants","gap":0.3,"text":"Ants leave scent too. Given two bridges to food, most soon take the shorter,"},
 {"id":"trails","gap":0.8,"text":"where scent builds up faster, and their trails become the colony's shared memory."},
 {"id":"starlings","gap":0.8,"text":"Starlings over Rome turn together in flocks of thousands, each bird watching only six or seven neighbours. No bird leads."},
 {"id":"emergence","gap":0.8,"text":"This is emergence: the whole does what no part planned. As John Holland, who studied it for decades, put it: more comes out than was put in."}]},
"trace":{"name":"Where nobody can trace why","lead":1.0,"tail":1.0,"vo":[
 {"id":"neurons","gap":0.8,"text":"Emergence is in us, too: no neuron thinks alone, and no one can yet trace how thought comes from eighty-six billion of them."},
 {"id":"markets","gap":0.8,"text":"In markets, too. On the sixth of May 2010, trading programs in America did something no one planned.","say":"In markets, too. On the sixth of May, twenty ten, trading programs in America did something no one planned."},
 {"id":"potato","gap":0.8,"text":"One sold a huge order, whatever the price, and fast programs passed contracts back and forth like a hot potato."},
 {"id":"minutes","gap":0.8,"text":"In minutes, share prices fell another five to six percent, then came back. Some shares traded for a penny."},
 {"id":"argue","gap":0.8,"text":"Regulators took five months to explain it, and people still argue about why."}]},
"many":{"name":"Many agents","lead":1.0,"tail":1.0,"vo":[
 {"id":"crowds","gap":0.8,"text":"Now we are building crowds of a new kind, many AI agents working together, and they are coming fast."},
 {"id":"lead","gap":0.8,"text":"Often, a lead agent splits the job among helpers, each with its own instructions, and another agent checks what they find."},
 {"id":"beat","gap":0.8,"text":"Such teams can beat one agent on hard research, at many times the computing."},
 {"id":"study","gap":0.8,"text":"Yet a 2025 study of seven such systems found them failing on forty-one to eighty-seven percent of tasks.","say":"Yet a twenty twenty-five study of seven such systems found them failing on forty-one to eighty-seven percent of tasks."},
 {"id":"together","gap":0.8,"text":"And together, they do things no one planned."},
 {"id":"name","gap":0.8,"text":"In 2025, researchers paired agents at random, again and again, to agree on a name. With no one in charge, the whole group settled on one.","say":"In twenty twenty-five, researchers paired agents at random, again and again, to agree on a name. With no one in charge, the whole group settled on one."},
 {"id":"leaned","gap":0.8,"text":"And the group leaned towards some names, though no agent did alone."},
 {"id":"group","gap":0.8,"text":"So testing each agent alone isn't enough: test the group."}]},
"board":{"name":"Agents on one board","lead":1.0,"tail":1.0,"vo":[
 {"id":"platform","gap":0.8,"text":"At the university, the counts come from the platform, the same way every time. The reasons are in words: work for agents."},
 {"id":"helper","gap":0.8,"text":"A lead agent gives each faculty to one helper, which can read but not change, in a sandbox."},
 {"id":"pins","gap":0.8,"text":"Each pins what it finds, with its source, to one shared board, and reads what the others pin."},
 {"id":"checking","gap":0.8,"text":"A checking agent compares each reason with the numbers."},
 {"id":"pattern","gap":0.8,"text":"Two things appeared that no one had asked for. First, a pattern: three faculties each had a small drop that no note explained."},
 {"id":"side","gap":0.8,"text":"Side by side on the board, they were the same thirty-one students, who had moved to a new joint degree that the count put in no faculty."},
 {"id":"word","gap":0.8,"text":"Second, a word. One helper called the thirty-one dropouts. The others read it and copied it, until every draft said it.","say":"Second, a word. One helper called the thirty-one dropouts. The others red it and copied it, until every draft said it."},
 {"id":"left","gap":0.8,"text":"None had left: the checking agent flagged that all thirty-one were still studying."},
 {"id":"decided","gap":0.8,"text":"The agents drafted; a person decided. Clara, in Planning, fixed the word and approved the reasons."},
 {"id":"faculty","gap":0.8,"text":"The joint degree got its faculty, and a new test now catches the next one without an agent."}]},
"alive":{"name":"Is it alive?","lead":1.0,"tail":1.0,"vo":[
 {"id":"seem","gap":0.8,"text":"Crowds of agents can seem alive. Are they?"},
 {"id":"chile","gap":0.8,"text":"In Chile, in 1972, Humberto Maturana and Francisco Varela said a living thing makes itself: a cell keeps making the parts that make it.","say":"In Chile, in nineteen seventy-two, Humberto Maturana and Francisco Varela said a living thing makes itself: a cell keeps making the parts that make it."},
 {"id":"tortoise","gap":0.8,"text":"Around 1950, near Bristol, Grey Walter built a robot tortoise that kept itself going: when its battery ran low, it went home to recharge.","say":"Around nineteen fifty, near Bristol, Grey Walter built a robot tortoise that kept itself going: when its battery ran low, it went home to recharge."},
 {"id":"frog","gap":0.8,"text":"In 2020, American scientists shaped frog cells, to a computer's design, into tiny bodies that swim and heal.","say":"In twenty twenty, American scientists shaped frog cells, to a computer's design, into tiny bodies that swim and heal."},
 {"id":"later","gap":0.8,"text":"A year later, some gathered loose cells into new ones."},
 {"id":"none","gap":0.8,"text":"Today's agents do none of this: they don't make themselves, and they run only because we run them."}]},
"close":{"name":"What we don't know","lead":1.0,"tail":1.0,"vo":[
 {"id":"imagine","gap":0.8,"text":"Imagine, and this is only imagined, agents that start other agents, mend each other's work, and keep systems running through the night."},
 {"id":"might","gap":0.8,"text":"They might find what no person could, or settle on habits no person chose. We don't know."},
 {"id":"neither","gap":0.8,"text":"Neither did Eastgate's builders."},
 {"id":"lung","gap":0.3,"text":"Years later, sensors in real mounds showed the air moves less like a chimney than a lung,"},
 {"id":"pushed","gap":0.8,"text":"pushed by the day's warmth and the night's cool."},
 {"id":"wrong","gap":0.3,"text":"Eastgate was built on the wrong idea, a scientist said, and still, it works:"},
 {"id":"measuring","gap":0.8,"text":"people kept measuring it, and tuned its controls when the offices ran warm."},
 {"id":"same","gap":0.8,"text":"Jun's team keeps its agents the same way: measured, read-only, with a person deciding, so together they find what one of us would miss."},
 {"id":"takeaway","gap":0.8,"text":"When many work together, something new appears, and we don't yet know what."},
 {"id":"next","gap":0.8,"text":"Next: agents at work on data."}]}
};

const VODUR={"breathes/place": 8.995, "breathes/cooled": 6.515, "breathes/bills": 3.813, "breathes/change": 4.11, "breathes/mounds": 4.016, "breathes/rising": 3.676, "breathes/built": 5.239, "breathes/nights": 5.214, "breathes/day": 3.566, "breathes/opened": 3.869, "breathes/cost": 3.646, "breathes/rents": 4.172, "breathes/council": 5.764, "breathes/weeks": 8.236, "breathes/shared": 6.965, "little/plan": 2.132, "little/mud": 8.639, "little/ants": 4.37, "little/trails": 4.263, "little/starlings": 7.769, "little/emergence": 8.656, "trace/neurons": 7.741, "trace/markets": 6.659, "trace/potato": 7.058, "trace/minutes": 6.347, "trace/argue": 4.547, "many/crowds": 6.311, "many/lead": 7.635, "many/beat": 4.839, "many/study": 7.418, "many/together": 2.209, "many/name": 9.06, "many/leaned": 3.358, "many/group": 3.467, "board/platform": 7.838, "board/helper": 5.825, "board/pins": 5.052, "board/checking": 3.034, "board/pattern": 7.824, "board/side": 8.196, "board/word": 7.327, "board/left": 4.714, "board/decided": 6.243, "board/faculty": 5.241, "alive/seem": 2.541, "alive/chile": 9.941, "alive/tortoise": 9.628, "alive/frog": 7.764, "alive/later": 2.883, "alive/none": 5.366, "close/imagine": 8.182, "close/might": 5.223, "close/neither": 1.688, "close/lung": 5.263, "close/pushed": 2.243, "close/wrong": 4.519, "close/measuring": 4.243, "close/same": 8.345, "close/takeaway": 3.627, "close/next": 2.008};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the board of small agents becoming the title card; and the end card. */
const BREATH={
"breathes":{"hold":{"place":0.6,"cooled":0.4,"bills":0.6,"change":0.8,"rising":0.6,"built":0.4,"nights":0.6,"day":1.0,"opened":0.4,"cost":0.2,"rents":1.0,"council":0.2,"weeks":0.6},"breathe":4.4},
"little":{"hold":{"plan":0.8,"mud":1.0,"trails":1.0,"starlings":1.2,"emergence":0.8}},
"trace":{"hold":{"neurons":1.0,"markets":0.4,"potato":0.6,"minutes":1.0,"argue":0.8}},
"many":{"hold":{"crowds":0.6,"lead":0.8,"beat":0.2,"study":0.6,"together":0.2,"name":0.6,"leaned":0.4,"group":0.6}},
"board":{"hold":{"platform":0.8,"helper":1.0,"pins":1.2,"checking":0.8,"pattern":1.2,"side":1.4,"word":1.2,"left":1.0,"decided":1.2,"faculty":0.8}},
"alive":{"hold":{"seem":0.8,"chile":0.8,"tortoise":0.8,"frog":0.2,"later":0.6,"none":0.6}},
"close":{"hold":{"imagine":0.8,"might":1.0,"neither":0.2,"pushed":0.8,"measuring":0.8,"same":0.8,"takeaway":1.2},"breathe":4.6}
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
  // the near side of the nose, turned a little from the light: a soft shade down from between the eyes to the nostril
  c.filter="blur(3px)";c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.45),0.12);c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(364,428);c.quadraticCurveTo(369,444,374,454);c.stroke();c.filter="none";
  c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.4),0.2);c.lineWidth=2.4;c.beginPath();c.moveTo(274,490);c.quadraticCurveTo(296,510,322,519);c.stroke();c.restore();
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
  // the nose: its tip on the outline; inside, the curve of the nostril under it, and the near nostril's wing
  c.strokeStyle=C.line;c.lineWidth=2.6;c.beginPath();c.moveTo(384,449);c.quadraticCurveTo(392,459,381,463);c.stroke();
  c.lineWidth=2.2;c.beginPath();c.moveTo(368,458);c.quadraticCurveTo(367,465,375,465);c.stroke();
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

/* ===== Many agents, and what emerges: the places of the opening and the close =====
   Painted full-frame in the module's matte style (no outlines, muted colours, daylight from the right, soft contact shadows),
   dressed for their time. Each is a place painted once (AG_PLACES.ma*); what moves in it is drawn live by the helpers below it.
   Every name here starts with ma_ or MA_. Air is never one of the module's meaning colours: warm air is a pale terracotta
   (MA_WARM), cool air a pale mist grey (MA_COOL), and the termites' scent a faint pale gold (MA_GOLD).
     ma_tag(ctx, text, a, o)        the place and year, on a small card at the top left (o.dashed for "Imagined")
     ma_air(ctx, pts, col, t, o)    a soft ribbon of air flowing along pts: o.u how much of it shows, o.w its width, o.speed
     ma_sketch(ctx, strokes, t, t0) pencil strokes drawing themselves; ma_pencil(ctx, strokes, u) a pencil drawing, lifting between
                                    strokes, and ma_pencilBody(ctx, x, y, lift) the pencil itself
   The places: maHarare (the street, 1992), maDesk (the drawing board), maMound (a mound on the savanna), maMoundCut (the same mound
   cut down the middle: its chimney, the channels under its skin, the nest below), maSection and maSectionNight (Eastgate cut
   through, by day and by night), maEastgate (Eastgate in 1996) and maPlant (its plant room, where a chart records the offices'
   warmth). The drawing board's other things (the crate, the price tag, the sun, the dial, the title block) and Eastgate's "let"
   signs are drawn live by the helpers beside their places. */

const MA_WARM=[214,140,104],MA_COOL=[170,188,200],MA_GOLD=[226,190,104];
const MA_COOLD=[128,152,176];   // the same mist, a little deeper, where it crosses the pale savanna
const MA_SKIN=[[94,62,44],[124,84,60],[168,120,88],[206,160,124]];

/* ---------------------------------------------------------------- small helpers */
const ma_shade=(c,k)=>[c[0]*k,c[1]*k,c[2]*k];
// a Catmull-Rom spline through the points, n steps between each
function ma_smooth(pts,n){const out=[],P=[pts[0]].concat(pts,[pts[pts.length-1]]);
  for(let i=1;i<P.length-2;i++)for(let k=0;k<n;k++){const u=k/n,u2=u*u,u3=u2*u,f=(a,b,c,d)=>0.5*(2*b+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3);
    out.push([f(P[i-1][0],P[i][0],P[i+1][0],P[i+2][0]),f(P[i-1][1],P[i][1],P[i+1][1],P[i+2][1])]);}out.push(pts[pts.length-1]);return out;}
function ma_poly(c,P){c.beginPath();ma_path(c,P);}
function ma_path(c,P){c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)c.lineTo(P[i][0],P[i][1]);c.closePath();}
// an irregular soft blob: an ellipse whose edge wanders (amp), for crowns of trees, clouds, cells
function ma_blobPts(cx,cy,rx,ry,seed,amp,n){n=n||56;const pts=[];for(let i=0;i<n;i++){const a=i/n*TAU,k=1+amp*(AG_NZ.fbm(Math.cos(a)*1.6+seed*3.1,Math.sin(a)*1.6+seed*1.7,3)-0.5)*2;
  pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}return pts;}
function ma_blob(c,cx,cy,rx,ry,seed,amp,fill){ma_poly(c,ma_blobPts(cx,cy,rx,ry,seed,amp));c.fillStyle=fill;c.fill();}
// a sky: top to low, with a soft glow of the sun at sun [x, y, r, a]
function ma_sky(c,top,low,hz,sun,mid){const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(top,1));if(mid)g.addColorStop(mid[1],rgba(mid[0],1));g.addColorStop(1,rgba(low,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+2);
  if(sun){const r=c.createRadialGradient(sun[0],sun[1],8,sun[0],sun[1],sun[2]);r.addColorStop(0,"rgba(255,244,222,"+(sun[3]||0.5)+")");r.addColorStop(1,"rgba(255,244,222,0)");c.fillStyle=r;c.fillRect(0,0,W,hz+2);}}
// a faint grain of the place's own, so large flat areas don't look printed (painted once, it never moves)
function ma_grain(c,x,y,w,h,amp,seed){ag_grain(c,x,y,w,h,amp||1.4,seed||5);}
// the soft shadow of a shape without the shape, for places painted once: the shape is drawn far outside the frame and only its
// blurred shadow falls in it
function ma_shadowOf(c,fn,col,blur,dx,dy){c.save();c.shadowColor=col;c.shadowBlur=blur;c.shadowOffsetX=dx+6000;c.shadowOffsetY=dy;c.translate(-6000,0);
  c.beginPath();fn(c);c.fillStyle="#000";c.fill();c.restore();}

/* the place and year, on a small card at the top left, in screen space; o.dashed: a dashed edge (for "Imagined") */
function ma_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.2)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(243,241,237,0.95)";ctx.fill();ctx.restore();
  if(o.dashed){ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.2;rr(ctx,x+5,y+5,w-10,h-10,9);ctx.stroke();ctx.setLineDash([]);}
  else{ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,12);ctx.stroke();}
  ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}

/* ---------------------------------------------------------------- air: a soft ribbon that flows along a path
   pts: the path's points; col: MA_WARM or MA_COOL; t: time, for the flow; o.u: how much shows, from the start; o.w: width;
   o.speed: px a second; o.head: false for no chevron; o.a. The body is one path, so it never doubles where it bends. */
function ma_air(ctx,pts,col,t,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u,w=o.w||12,sp=o.speed||60;if(a<=0.01||u<=0.01)return;
  const S=ma_smooth(pts,12),L=[0];for(let i=1;i<S.length;i++)L.push(L[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));const tot=L[L.length-1]||1,show=tot*clamp(u,0,1);
  const vis=[S[0]];for(let i=1;i<S.length;i++){if(L[i]<=show){vis.push(S[i]);continue;}const k=(show-L[i-1])/((L[i]-L[i-1])||1);vis.push([lerp(S[i-1][0],S[i][0],k),lerp(S[i-1][1],S[i][1],k)]);break;}
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(vis[0][0],vis[0][1]);for(let i=1;i<vis.length;i++)ctx.lineTo(vis[i][0],vis[i][1]);
  ctx.strokeStyle=rgba(col,0.13*a);ctx.lineWidth=w*2.3;ctx.stroke();ctx.strokeStyle=rgba(col,0.2*a);ctx.lineWidth=w*1.15;ctx.stroke();
  // the flow: short dashes moving along it, fading in from where the air starts
  const dash=o.dash||46,gap=o.gap||62,off=((t*sp)%(dash+gap)+dash+gap)%(dash+gap);ctx.lineWidth=w*0.42;
  for(let d=-dash-gap+off;d<show;d+=dash+gap){const d0=Math.max(0,d),d1=Math.min(show,d+dash);if(d1-d0<2)continue;ctx.beginPath();let st=false;
    for(let i=0;i<S.length;i++){if(L[i]<d0)continue;if(L[i]>d1)break;if(!st){ctx.moveTo(S[i][0],S[i][1]);st=true;}else ctx.lineTo(S[i][0],S[i][1]);}
    const f=(d0+d1)/2/tot,env=sstep(0,0.12,f)*(1-0.5*sstep(0.9,1,f));ctx.strokeStyle=rgba(col,0.85*a*env);ctx.stroke();}
  if(u>0.85&&o.head!==false){const i=Math.max(1,vis.length-1),p=vis[i],q=vis[Math.max(0,i-3)],an=Math.atan2(p[1]-q[1],p[0]-q[0]),k=w*1.1;
    ctx.strokeStyle=rgba(col,0.92*a*sstep(0.85,1,u));ctx.lineWidth=w*0.46;ctx.beginPath();ctx.moveTo(p[0]-Math.cos(an-0.62)*k,p[1]-Math.sin(an-0.62)*k);ctx.lineTo(p[0],p[1]);
    ctx.lineTo(p[0]-Math.cos(an+0.62)*k,p[1]-Math.sin(an+0.62)*k);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the street's things
   ma_tree(c, x, y, s, seed, o): a shade tree standing at (x, y): a tapering trunk that forks, and a crown of soft clusters, lighter
   up and to the right where the sun falls, darker underneath; o.leaf its green */
function ma_tree(c,x,y,s,seed,o){o=o||{};const R=ag_rnd(seed),leaf=o.leaf||[116,132,100],trunk=o.trunk||[102,90,78];c.save();c.translate(x,y);c.scale(s,s);
  ag_floorShadow(c,-90,8,190,22,0.26);
  c.fillStyle=rgba(trunk,1);c.beginPath();c.moveTo(-13,0);c.bezierCurveTo(-11,-60,-9,-110,-34,-178);c.lineTo(-24,-184);c.bezierCurveTo(-6,-146,-2,-132,4,-142);
  c.bezierCurveTo(14,-170,30,-190,50,-206);c.lineTo(56,-198);c.bezierCurveTo(30,-170,17,-118,15,0);c.closePath();c.fill();
  c.fillStyle="rgba(255,240,220,0.16)";c.beginPath();c.moveTo(6,0);c.bezierCurveTo(8,-60,9,-100,12,-130);c.lineTo(15,-120);c.lineTo(15,0);c.closePath();c.fill();
  // the crown: a dark mass, then lit clusters over it, the lightest up and to the right
  const cy=-250,base=[[0,cy,170,92,0.2]];for(let i=0;i<9;i++){const a=R()*TAU,r=R();base.push([Math.cos(a)*120*r+10,cy+Math.sin(a)*56*r-10,70+R()*50,46+R()*28,0.25]);}
  base.forEach((b,i)=>ma_blob(c,b[0],b[1],b[2],b[3],seed+i*0.37,b[4],rgba(ma_shade(leaf,0.72),1)));
  const lit=base.slice(1).sort((p,q)=>(p[0]-p[1])-(q[0]-q[1]));
  lit.forEach((b,i)=>{const k=clamp(0.5+(b[0]/220)-(b[1]-cy)/160,0,1);ma_blob(c,b[0]+10,b[1]-12,b[2]*0.78,b[3]*0.72,seed+i*1.3,0.3,rgba(mix(leaf,ma_shade(leaf,1.22),k),1));});
  for(let i=0;i<12;i++){const a=R()*TAU,r=R(),bx=Math.cos(a)*100*r+50,by=cy-34+Math.sin(a)*44*r;ma_blob(c,bx,by,24+R()*14,16+R()*9,seed+i*2.1,0.3,rgba(ma_shade(leaf,1.3),0.5));}
  c.restore();}
/* a building seen from the street: its front w x h from (x, y), lit from the right; o.side a sliver of its right side; o.floors and
   o.cols of windows, or bands of windows in rows; o.fins vertical sunshades; o.ledge a ledge at each floor; o.base its colour */
function ma_bldg(c,x,y,w,h,o){o=o||{};const base=o.base||[206,200,190],dark=ma_shade(base,0.8);
  if(o.side){c.fillStyle=rgba(ma_shade(base,1.1),1);c.beginPath();c.moveTo(x+w,y);c.lineTo(x+w+o.side,y+o.side*0.18);c.lineTo(x+w+o.side,y+h);c.lineTo(x+w,y+h);c.closePath();c.fill();}
  c.fillStyle=rgba(base,1);c.fillRect(x,y,w,h);
  const fl=o.floors||0,pitch=fl?(h-(o.top||20)-(o.ground||0))/fl:0;
  for(let f=0;f<fl;f++){const yy=y+(o.top||20)+f*pitch;
    if(o.cols){const cw=(w-2*(o.inset||12))/o.cols;for(let k=0;k<o.cols;k++){const wx=x+(o.inset||12)+k*cw+cw*0.16,ww=cw*0.68,wh=pitch*0.52;
        c.fillStyle=rgba(o.win||[92,100,110],0.7);c.fillRect(wx,yy+pitch*0.18,ww,wh);c.fillStyle="rgba(40,34,28,0.12)";c.fillRect(wx,yy+pitch*0.18,ww,3);
        c.fillStyle="rgba(255,252,244,0.16)";c.fillRect(wx+ww-3,yy+pitch*0.18,3,wh);}}
    else{c.fillStyle=rgba(o.win||[92,100,110],0.6);c.fillRect(x+(o.inset||12),yy+pitch*0.22,w-2*(o.inset||12),pitch*0.42);
      c.fillStyle="rgba(255,252,244,0.14)";c.fillRect(x+(o.inset||12),yy+pitch*0.22,w-2*(o.inset||12),2);}
    if(o.ledge){c.fillStyle=rgba(ma_shade(base,1.08),1);c.fillRect(x-4,yy+pitch-6,w+8,6);c.fillStyle="rgba(40,34,28,0.16)";c.fillRect(x-4,yy+pitch,w+8,3);}}
  if(o.fins){for(let k=0;k<=o.fins;k++){const fx=x+k*(w-6)/o.fins;c.fillStyle=rgba(ma_shade(base,1.06),1);c.fillRect(fx,y+(o.top||20)-6,6,h-(o.top||20)-(o.ground||0)+6);
    c.fillStyle="rgba(40,34,28,0.1)";c.fillRect(fx-4,y+(o.top||20),4,h-(o.top||20)-(o.ground||0));}}
  if(o.ground){c.fillStyle=rgba(ma_shade(base,0.92),1);c.fillRect(x,y+h-o.ground,w,o.ground);c.fillStyle=rgba([70,74,82],0.5);c.fillRect(x+10,y+h-o.ground+14,w-20,o.ground-20);}
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(40,34,28,0.12)");g.addColorStop(1,"rgba(255,248,236,0.08)");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.fillStyle=rgba(dark,0.6);c.fillRect(x-2,y,w+4,5);}
/* a person far off, walking or standing: no face; s 1 is about 120 px tall; o.top and o.bot the clothes, o.skin, o.ph the step's
   phase, o.walk 0 to stand */
function ma_walker(ctx,x,y,s,o){o=o||{};const t=o.t||0,ph=o.ph||0,walk=o.walk==null?1:o.walk,sw=Math.sin(t*5.2+ph)*7*walk,top=o.top||[86,98,120],bot=o.bot||[62,62,66],skin=o.skin||MA_SKIN[1];
  ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ag_floorShadow(ctx,-14,2,26,5,0.24);
  ctx.strokeStyle=rgba(bot,1);ctx.lineCap="round";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-3,-50);ctx.lineTo(-3+sw,-2);ctx.moveTo(4,-50);ctx.lineTo(4-sw,-2);ctx.stroke();
  if(o.skirt){ctx.fillStyle=rgba(bot,1);ctx.beginPath();ctx.moveTo(-12,-60);ctx.lineTo(12,-60);ctx.lineTo(16,-28);ctx.lineTo(-16,-28);ctx.closePath();ctx.fill();}
  ctx.strokeStyle=rgba(ma_shade(top,0.9),1);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-11,-94);ctx.lineTo(-13-sw*0.5,-60);ctx.moveTo(11,-94);ctx.lineTo(13+sw*0.5,-60);ctx.stroke();
  ctx.fillStyle=rgba(top,1);ctx.beginPath();ctx.moveTo(-13,-100);ctx.quadraticCurveTo(-16,-76,-12,-52);ctx.lineTo(12,-52);ctx.quadraticCurveTo(16,-76,13,-100);ctx.quadraticCurveTo(0,-106,-13,-100);ctx.fill();
  ctx.fillStyle="rgba(255,250,240,0.18)";ctx.fillRect(6,-98,7,46);
  ctx.fillStyle=rgba(skin,1);ctx.fillRect(-3,-110,6,8);ctx.beginPath();ctx.ellipse(0,-118,9,10.5,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(o.hair||[40,32,28],1);ctx.beginPath();ctx.ellipse(-1,-123,9.5,6,0,Math.PI,TAU);ctx.fill();
  if(o.bag){ctx.fillStyle=rgba([70,56,46],1);ctx.fillRect(12,-66,12,16);}
  ctx.restore();}
/* a car of the time, from the side, facing right (o.flip: left): a rounded saloon, or o.kind "van", a minibus */
function ma_car(c,x,y,s,col,o){o=o||{};c.save();c.translate(x,y);c.scale(o.flip?-s:s,s);ag_floorShadow(c,-6,4,160,13,0.32);const van=o.kind==="van";
  const body=van?(k)=>{k.moveTo(-130,-16);k.lineTo(-131,-100);k.quadraticCurveTo(-130,-114,-114,-114);k.lineTo(92,-114);k.quadraticCurveTo(120,-112,130,-72);k.lineTo(136,-30);k.quadraticCurveTo(136,-16,124,-16);k.closePath();}
    :(k)=>{k.moveTo(-138,-18);k.quadraticCurveTo(-144,-46,-128,-52);k.lineTo(-96,-56);k.quadraticCurveTo(-74,-90,-52,-92);k.lineTo(42,-92);k.quadraticCurveTo(62,-90,86,-58);
      k.lineTo(130,-52);k.quadraticCurveTo(146,-48,142,-18);k.closePath();};
  ag_soft(c,body,col,mix(col,[255,250,240],0.3),60,-80,180,"rgba(30,26,22,0.25)",14,0.5);
  c.fillStyle="rgba(255,250,240,0.2)";c.fillRect(-128,-55,262,4);
  c.fillStyle=rgba([70,80,92],0.88);if(van){c.fillRect(-116,-102,60,36);c.fillRect(-48,-102,60,36);c.fillRect(20,-102,56,36);c.beginPath();c.moveTo(84,-102);c.lineTo(102,-102);c.lineTo(118,-70);c.lineTo(84,-66);c.closePath();c.fill();}
  else{c.beginPath();c.moveTo(-86,-58);c.lineTo(-56,-86);c.lineTo(-6,-86);c.lineTo(-6,-58);c.closePath();c.fill();c.beginPath();c.moveTo(2,-58);c.lineTo(2,-86);c.lineTo(40,-86);c.lineTo(70,-58);c.closePath();c.fill();}
  c.fillStyle="rgba(255,255,255,0.18)";c.fillRect(van?-110:-60,van?-100:-84,18,4);
  c.fillStyle="rgba(30,26,22,0.3)";c.fillRect(-138,-24,280,5);c.fillStyle=rgba([196,196,194],1);c.fillRect(132,-34,10,10);
  for(const wx of [-88,90]){c.fillStyle=rgba(ma_shade(col,0.55),1);c.beginPath();c.arc(wx,-14,28,Math.PI,TAU);c.fill();c.fillStyle="#2B2C30";c.beginPath();c.arc(wx,-12,22,0,TAU);c.fill();
    c.fillStyle="#9A9A98";c.beginPath();c.arc(wx,-12,9,0,TAU);c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- Harare, 1992: a wide street in the city centre, a fenced plot
   between office blocks, late afternoon */
const MA_HZ=700;
AG_PLACES.maHarare=c=>{const HZ=MA_HZ;
  ma_sky(c,[164,186,204],[238,226,208],HZ,[1840,330,860,0.55],[[204,212,216],0.55]);
  for(const cl of [[420,170,260,34,1],[1120,120,340,40,2],[1540,232,220,26,3]]){ma_blob(c,cl[0],cl[1],cl[2],cl[3],cl[4],0.4,"rgba(250,244,234,0.5)");ma_blob(c,cl[0]+30,cl[1]-8,cl[2]*0.6,cl[3]*0.6,cl[4]+9,0.4,"rgba(255,250,242,0.5)");}
  c.fillStyle=rgba([214,208,198],1);c.fillRect(0,HZ-4,W,750-HZ+4);
  // the city behind: towers in the haze
  const far=[[30,360,170,[196,198,200]],[210,300,140,[204,204,204]],[1250,280,150,[198,200,202]],[1420,340,180,[206,204,202]],[1640,250,150,[200,200,202]],[1800,380,160,[196,196,198]]];
  for(const b of far)ma_bldg(c,b[0],b[1],b[2],HZ-b[1],{base:b[3],floors:Math.round((HZ-b[1])/30),cols:0,win:[150,158,166],inset:10,top:14,side:10});
  let g=c.createLinearGradient(0,180,0,HZ);g.addColorStop(0,"rgba(236,228,214,0)");g.addColorStop(0.5,"rgba(236,228,214,0.42)");g.addColorStop(1,"rgba(236,228,214,0.18)");c.fillStyle=g;c.fillRect(0,180,W,HZ-180);
  // the nearer blocks: sixties and seventies offices, with sunshades and ledges
  ma_bldg(c,40,380,420,360,{base:[214,206,192],floors:8,cols:7,ground:56,win:[96,104,114],ledge:1,side:24});
  ma_bldg(c,1460,330,400,410,{base:[204,198,190],floors:9,cols:0,ground:56,fins:10,win:[88,96,108],side:20});
  ma_bldg(c,1860,420,140,320,{base:[196,190,182],floors:7,cols:2,ground:56,win:[96,104,114]});
  // the plot between them: bare earth behind a hoarding, a few weeds, and the backs of the next street
  ma_bldg(c,470,520,300,220,{base:[200,196,188],floors:4,cols:5,win:[110,116,124]});ma_bldg(c,1180,560,280,180,{base:[208,202,192],floors:3,cols:4,win:[110,116,124]});
  g=c.createLinearGradient(0,560,0,740);g.addColorStop(0,"rgba(236,228,214,0.25)");g.addColorStop(1,"rgba(236,228,214,0)");c.fillStyle=g;c.fillRect(470,520,990,220);
  c.fillStyle=rgba([196,168,136],1);c.fillRect(470,664,990,80);ma_grain(c,470,664,990,80,2.2,9);
  const R=ag_rnd(41);for(let i=0;i<34;i++){const x=490+R()*950,y=672+R()*60;c.fillStyle=rgba(mix([132,140,104],[160,164,120],R()),0.8);c.beginPath();c.ellipse(x,y,8+R()*14,4+R()*5,0,0,TAU);c.fill();}
  // the hoarding: plain boards, a little uneven, lit from the right, and the shadow at its foot
  for(let i=0;i<25;i++){const x=470+i*39.6,hh=88+((i*37)%9);c.fillStyle=rgba(mix([170,162,150],[188,180,168],(i%3)/2),1);c.fillRect(x,742-hh,38.6,hh);
    c.fillStyle="rgba(255,250,240,0.13)";c.fillRect(x+31,742-hh,7.6,hh);c.fillStyle="rgba(40,34,28,0.12)";c.fillRect(x,742-hh,2,hh);}
  // the pavement, the kerb and the street
  c.fillStyle=rgba([206,200,190],1);c.fillRect(0,740,W,66);ma_grain(c,0,740,W,66,1.6,3);
  for(let x=0;x<W;x+=128){c.fillStyle="rgba(40,34,28,0.08)";c.fillRect(x,740,2,66);}
  g=c.createLinearGradient(0,740,0,760);g.addColorStop(0,"rgba(40,34,28,0.14)");g.addColorStop(1,"rgba(40,34,28,0)");c.fillStyle=g;c.fillRect(0,740,W,20);
  c.fillStyle=rgba([176,172,166],1);c.fillRect(0,804,W,8);c.fillStyle="rgba(40,34,28,0.22)";c.fillRect(0,812,W,4);
  g=c.createLinearGradient(0,816,0,H);g.addColorStop(0,rgba([150,148,146],1));g.addColorStop(1,rgba([118,116,116],1));c.fillStyle=g;c.fillRect(0,816,W,H-816);ma_grain(c,0,816,W,H-816,2.4,7);
  c.strokeStyle="rgba(60,58,58,0.08)";c.lineWidth=26;for(const y of [872,1010]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}   // where the tyres run
  c.fillStyle="rgba(244,240,230,0.55)";for(let x=40;x<W;x+=240)c.fillRect(x,944,130,9);
  // shade trees on the pavement
  ma_tree(c,330,770,1.08,11,{leaf:[112,130,96]});ma_tree(c,1000,768,0.9,23,{leaf:[120,136,102]});ma_tree(c,1690,776,1.18,37,{leaf:[108,126,94]});
  // parked: a saloon and a white minibus, the city's commuter taxis of the time
  ma_car(c,640,870,0.9,[180,72,56]);ma_car(c,1340,876,0.95,[232,230,222],{kind:"van"});
  // light from the right over everything, and the street's near edge a little darker
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.1)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,244,226,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,960,0,H);g.addColorStop(0,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(40,34,28,0.12)");c.fillStyle=g;c.fillRect(0,960,W,H-960);};
// the people on the pavement and a car passing, live: early-1990s office clothes, small and far off; car: when it starts, or null
const MA_PEOPLE=[[540,790,0.92,{top:[70,86,112],bot:[48,50,56],skin:MA_SKIN[0],ph:0}],[600,792,0.9,{top:[226,222,210],bot:[70,72,80],skin:MA_SKIN[1],ph:1.4,skirt:1,hair:[30,24,22]}],
  [1196,794,0.94,{top:[150,74,64],bot:[70,58,52],skin:MA_SKIN[0],ph:2.2,skirt:1}],[1250,790,0.9,{top:[214,208,196],bot:[60,64,72],skin:MA_SKIN[1],ph:0.7,bag:1}],
  [840,786,0.86,{top:[96,110,90],bot:[54,54,58],skin:MA_SKIN[0],ph:3.1}],[1560,796,0.96,{top:[60,66,84],bot:[44,46,52],skin:MA_SKIN[1],ph:1.9}]];
function ma_harareLife(ctx,t,car){MA_PEOPLE.forEach((p,i)=>{const dir=i%2?-1:1;ma_walker(ctx,p[0]+dir*t*15,p[1],p[2],Object.assign({t,flip:dir<0},p[3]));});
  if(car!=null&&t>car){const x=2200-(t-car)*230;if(x>-300)ma_car(ctx,x,1000,1.02,[92,104,118],{flip:true});}}

/* ---------------------------------------------------------------- the drawing board: a drafting table seen from above */
const MA_SHEET={x:250,y:110,w:1300,h:760};
AG_PLACES.maDesk=c=>{let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba([150,130,104],1));g.addColorStop(1,rgba([176,154,124],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // the table's wood: long boards, the grain along them
  const R=ag_rnd(17);for(let y=0;y<H;y+=180){c.fillStyle=rgba(mix([160,138,110],[178,156,126],R()),0.6);c.fillRect(0,y,W,178);c.fillStyle="rgba(40,30,20,0.18)";c.fillRect(0,y+178,W,2);}
  c.strokeStyle="rgba(90,66,44,0.08)";c.lineWidth=2;for(let i=0;i<70;i++){const y=R()*H,x=R()*W,l=200+R()*500;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+l*0.3,y+(R()-0.5)*8,x+l*0.7,y+(R()-0.5)*8,x+l,y+(R()-0.5)*6);c.stroke();}
  ma_grain(c,0,0,W,H,2.6,13);
  // the drawing board, pale, with a dark edge, and the sheet taped to it
  const B={x:180,y:60,w:1460,h:880};ma_shadowOf(c,k=>k.rect(B.x,B.y,B.w,B.h),"rgba(40,30,20,0.4)",44,AG.sdx*2.4,22);c.fillStyle=rgba([228,222,210],1);c.fillRect(B.x,B.y,B.w,B.h);
  c.fillStyle=rgba([206,198,184],1);c.fillRect(B.x,B.y+B.h-14,B.w,14);c.fillStyle="rgba(255,250,240,0.3)";c.fillRect(B.x+B.w-6,B.y,6,B.h);
  const S=MA_SHEET;ma_shadowOf(c,k=>k.rect(S.x,S.y,S.w,S.h),"rgba(40,30,20,0.18)",10,-2,3);c.fillStyle=rgba([246,243,236],1);c.fillRect(S.x,S.y,S.w,S.h);
  c.strokeStyle="rgba(120,140,160,0.11)";c.lineWidth=1;for(let x=S.x+40;x<S.x+S.w;x+=40){c.beginPath();c.moveTo(x,S.y);c.lineTo(x,S.y+S.h);c.stroke();}
  for(let y=S.y+40;y<S.y+S.h;y+=40){c.beginPath();c.moveTo(S.x,y);c.lineTo(S.x+S.w,y);c.stroke();}
  for(const [x,y,r] of [[S.x-18,S.y-12,-0.12],[S.x+S.w-48,S.y-14,0.1],[S.x-16,S.y+S.h-24,0.08],[S.x+S.w-50,S.y+S.h-22,-0.1]]){c.save();c.translate(x+32,y+18);c.rotate(r);c.fillStyle="rgba(232,224,196,0.85)";c.fillRect(-32,-18,64,36);c.restore();}
  // the parallel rule across the board, near the bottom, and a set square
  ma_shadowOf(c,k=>k.rect(B.x,880,B.w,34),"rgba(40,30,20,0.3)",12,-4,6);c.fillStyle=rgba([226,230,232],0.96);c.fillRect(B.x,880,B.w,34);c.fillStyle="rgba(255,255,255,0.5)";c.fillRect(B.x,880,B.w,3);
  c.fillStyle="rgba(60,70,80,0.3)";for(let x=B.x+10;x<B.x+B.w;x+=20)c.fillRect(x,880,1.5,x%100<20?14:8);
  const sq=k=>{k.moveTo(1662,190);k.lineTo(1880,190);k.lineTo(1662,540);k.closePath();k.moveTo(1700,250);k.lineTo(1700,420);k.lineTo(1806,250);k.closePath();};
  ma_shadowOf(c,sq,"rgba(40,30,20,0.25)",10,-6,6);c.save();c.beginPath();sq(c);c.fillStyle="rgba(206,218,212,0.7)";c.fill("evenodd");c.restore();
  // an eraser and a scale rule on the table
  ma_shadowOf(c,k=>k.rect(1700,700,120,46),"rgba(40,30,20,0.3)",10,-5,5);c.fillStyle=rgba([234,228,216],1);c.fillRect(1700,700,120,46);c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(1700,700,120,4);
  ma_shadowOf(c,k=>k.rect(1690,820,200,30),"rgba(40,30,20,0.3)",10,-5,5);c.fillStyle=rgba([200,190,170],1);c.fillRect(1690,820,200,30);
  c.fillStyle="rgba(60,50,40,0.35)";for(let x=1696;x<1886;x+=10)c.fillRect(x,820,1.2,x%50<10?12:7);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,20,0.16)");g.addColorStop(1,"rgba(255,246,230,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);};
/* the sketch on the sheet: two blocks of offices over shops, an atrium between them, the street. Each straight stroke overshoots its
   ends a little and wavers a hair, as an architect draws; strokes are [points, alpha] */
const MA_SK={y0:300,gr:720,fl:8,blocks:[[440,360],[1000,360]]};
function ma_stroke(P,seed,over){const R=ag_rnd(seed),o=over==null?10:over,n0=P.length,a=P[0],b=P[1],y=P[n0-1],z=P[n0-2],ea=Math.hypot(b[0]-a[0],b[1]-a[1])||1,ez=Math.hypot(y[0]-z[0],y[1]-z[1])||1;
  const Q=[[a[0]-(b[0]-a[0])/ea*o,a[1]-(b[1]-a[1])/ea*o]].concat(P.slice(1,n0-1),[[y[0]+(y[0]-z[0])/ez*o,y[1]+(y[1]-z[1])/ez*o]]);if(n0===2)Q.splice(1,0);
  const out=[];for(let i=1;i<Q.length;i++){const p=Q[i-1],q=Q[i],d=Math.hypot(q[0]-p[0],q[1]-p[1])||1,n=Math.max(1,Math.round(d/34)),nx=-(q[1]-p[1])/d,ny=(q[0]-p[0])/d;
    for(let k=i===1?0:1;k<=n;k++){const u=k/n,wb=k===0||k===n?0:(R()-0.5)*1.5;out.push([lerp(p[0],q[0],u)+nx*wb,lerp(p[1],q[1],u)+ny*wb]);}}
  return [out,0.62+R()*0.24];}
function ma_sketchStrokes(){const L=[],K=MA_SK,fh=(K.gr-80-K.y0)/K.fl;let s=1;const add=(P,o)=>L.push(ma_stroke(P,s++,o));
  for(const [bx,bw] of K.blocks){add([[bx,K.gr],[bx,K.y0]]);add([[bx,K.y0],[bx+bw,K.y0]]);add([[bx+bw,K.y0],[bx+bw,K.gr]]);}
  for(const [bx,bw] of K.blocks)for(let f=1;f<=K.fl;f++)add([[bx,K.y0+f*fh],[bx+bw,K.y0+f*fh]],6);
  for(const [bx,bw] of K.blocks)for(let k=1;k<6;k++)add([[bx+k*bw/6,K.y0+4],[bx+k*bw/6,K.y0+K.fl*fh-4]],3);
  add([[800,K.y0+40],[1000,K.y0+40]]);add([[800,K.y0+40],[900,K.y0-6]],4);add([[900,K.y0-6],[1000,K.y0+40]],4);
  add([[340,K.gr],[1460,K.gr]],14);
  for(let k=0;k<7;k++){const x=460+k*150;add([[x,K.gr-66],[x+110,K.gr-66],[x+110,K.gr],[x,K.gr],[x,K.gr-66]],0);}
  return L;}
const MA_SKL=ma_sketchStrokes();
// the strokes drawing themselves from t0, one after another but overlapping, over about dur seconds
function ma_sketch(ctx,strokes,t,t0,dur,o){o=o||{};const n=strokes.length,a=o.a==null?1:o.a;if(a<=0||t<t0)return;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=o.lw||2.6;
  if(o.dash)ctx.setLineDash(o.dash);
  strokes.forEach((s,i)=>{const st=t0+i/n*dur*0.8,u=ag_sine(clamp((t-st)/(dur*0.2+0.25),0,1));if(u<=0)return;const P=s[0];let L=0;const D=[0];for(let k=1;k<P.length;k++){L+=Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]);D.push(L);}
    const show=L*u;ctx.strokeStyle=rgba(o.col||[58,60,66],s[1]*a);ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);
    for(let k=1;k<P.length;k++){if(D[k]<=show)ctx.lineTo(P[k][0],P[k][1]);else{const f=(show-D[k-1])/((D[k]-D[k-1])||1);ctx.lineTo(lerp(P[k-1][0],P[k][0],f),lerp(P[k-1][1],P[k][1],f));break;}}ctx.stroke();});
  ctx.restore();}
// a pencil drawing strokes in order: u 0..1 runs along their length and the lifted moves between them (faster); draws what is done,
// and returns {x, y, lift} for the pencil's point
function ma_pencil(ctx,strokes,u,o){o=o||{};const legs=[];let tot=0,prev=null;
  for(const s of strokes){const P=s[0];if(prev){const d=Math.hypot(P[0][0]-prev[0],P[0][1]-prev[1])*0.4;legs.push({move:[prev,P[0]],len:d});tot+=d;}
    let L=0;for(let k=1;k<P.length;k++)L+=Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]);legs.push({s,len:L});tot+=L;prev=P[P.length-1];}
  let left=tot*clamp(u,0,1),tip={x:strokes[0][0][0][0],y:strokes[0][0][0][1],lift:1};ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=o.lw||2.6;if(o.dash)ctx.setLineDash(o.dash);
  for(const g of legs){if(left<=0)break;const k=Math.min(1,left/(g.len||1));
    if(g.move){const p=g.move[0],q=g.move[1];tip={x:lerp(p[0],q[0],ag_sine(k)),y:lerp(p[1],q[1],ag_sine(k)),lift:Math.sin(Math.PI*k)};}
    else{const P=g.s[0],show=g.len*k;let L=0;ctx.strokeStyle=rgba(o.col||[58,60,66],g.s[1]*(o.a==null?1:o.a));ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);tip={x:P[0][0],y:P[0][1],lift:0};
      for(let j=1;j<P.length;j++){const d=Math.hypot(P[j][0]-P[j-1][0],P[j][1]-P[j-1][1]);if(L+d<=show){ctx.lineTo(P[j][0],P[j][1]);tip={x:P[j][0],y:P[j][1],lift:0};L+=d;}
        else{const f=(show-L)/(d||1);tip={x:lerp(P[j-1][0],P[j][0],f),y:lerp(P[j-1][1],P[j][1],f),lift:0};ctx.lineTo(tip.x,tip.y);break;}}ctx.stroke();}
    left-=g.len;}
  ctx.restore();return tip;}
/* the pencil: graphite point at (x, y), leaning back down and to the right; lift 0..1 raises it off the paper, so its shadow parts
   from it. A draughtsman's pencil, charcoal grey, with no brand */
function ma_pencilBody(ctx,x,y,lift,a){a=a==null?1:a;if(a<=0)return;const L=290,ang=0.62,hx=Math.cos(ang),hy=Math.sin(ang),lf=lift||0;ctx.save();ctx.globalAlpha*=a;
  // the shadow on the paper: it meets the point when the pencil touches, and falls away to the left of its far end
  const sx=-26-lf*14,sy=10+lf*8;ctx.fillStyle="rgba(40,30,20,0.1)";for(const k of [1,0.6]){ctx.beginPath();ctx.moveTo(x+lf*-10,y+lf*8);
    ctx.lineTo(x+hx*L+sx-hy*9*k,y+hy*L+sy+hx*9*k);ctx.lineTo(x+hx*L+sx+hy*9*k,y+hy*L+sy-hx*9*k);ctx.closePath();ctx.fill();}
  ctx.translate(x,y-lf*16);ctx.rotate(ang);
  ctx.fillStyle="#34353A";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(10,-2.4);ctx.lineTo(10,2.4);ctx.closePath();ctx.fill();
  ctx.fillStyle="#E4CFA8";ctx.beginPath();ctx.moveTo(9,-2.6);ctx.lineTo(40,-8);ctx.quadraticCurveTo(42,-4,40,-2);ctx.quadraticCurveTo(43,2,40,4);ctx.quadraticCurveTo(42,6,40,8);ctx.lineTo(9,2.6);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(120,90,60,0.25)";ctx.beginPath();ctx.moveTo(9,1);ctx.lineTo(40,3);ctx.lineTo(40,8);ctx.lineTo(9,2.6);ctx.closePath();ctx.fill();
  ctx.fillStyle="#4A4C53";ctx.beginPath();ctx.moveTo(40,-8);ctx.lineTo(L,-8);ctx.lineTo(L,8);ctx.lineTo(40,8);ctx.quadraticCurveTo(42,6,40,4);ctx.quadraticCurveTo(43,2,40,-2);ctx.quadraticCurveTo(42,-4,40,-8);ctx.fill();
  ctx.fillStyle="#62656D";ctx.fillRect(41,-8,L-41,5);ctx.fillStyle="rgba(255,255,255,0.22)";ctx.fillRect(41,-6.5,L-41,1.6);ctx.fillStyle="#3A3B40";ctx.fillRect(41,3,L-41,5);
  ctx.fillStyle="#2E2F33";ctx.fillRect(L-2,-8,2,16);ctx.restore();}
// the air-conditioning plant the usual way, pencilled onto the left block's roof: a box with two fans, and ducts down into the building
function ma_plantStrokes(){const x=470,y=MA_SK.y0-130;let s=60;const P=(pts,o)=>ma_stroke(pts,s++,o==null?6:o);
  return [P([[x,y+130],[x,y]]),P([[x,y],[x+300,y]]),P([[x+300,y],[x+300,y+130]]),P([[x+40,y+30],[x+130,y+30],[x+130,y+100],[x+40,y+100],[x+40,y+30]],0),
    P([[x+170,y+30],[x+260,y+30],[x+260,y+100],[x+170,y+100],[x+170,y+30]],0),P([[x+300,y+60],[x+330,y+60],[x+330,y+130]],0),P([[x+300,y+90],[x+316,y+90],[x+316,y+130]],0),
    P([[x+323,y+130],[x+323,MA_SK.gr-80]],4)];}
const MA_PLANT=ma_plantStrokes();
// the plant's two fans, turning (a, from 0, as the plant's lines are drawn)
function ma_plantFans(ctx,t,a,col){if(a<=0)return;const x=470,y=MA_SK.y0-130;for(const cx of [x+85,x+215])ma_fan(ctx,cx,y+65,26,t*3,col||"rgba(58,60,66,0.75)",a,true);}
/* a fan seen face on: three broad curved blades round a hub, inside a ring (never four bent arms) */
function ma_fan(ctx,x,y,r,ang,col,a,ring){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=Math.max(1.6,r*0.09);
  if(ring){ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();}ctx.rotate(ang);
  for(let k=0;k<3;k++){ctx.rotate(TAU/3);ctx.beginPath();ctx.moveTo(r*0.16,-r*0.05);ctx.bezierCurveTo(r*0.4,-r*0.42,r*0.82,-r*0.44,r*0.84,-r*0.08);ctx.bezierCurveTo(r*0.7,r*0.02,r*0.42,r*0.06,r*0.16,r*0.08);ctx.closePath();ctx.globalAlpha*=0.55;ctx.fill();ctx.globalAlpha/=0.55;ctx.stroke();}
  ctx.beginPath();ctx.arc(0,0,r*0.17,0,TAU);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the drawing board's other things, live
   The usual way, pencilled onto the sketch: a crate delivered to the site (stamped "imported"), a paper price tag on the plant,
   a sun crossing the sheet while a dial on the plant runs from morning to night; then the bills, the rents, and the architect's
   title block in the sheet's corner, as on any architect's drawing. */
const MA_CRATE=(()=>{const x=268,y=598,w=150,h=118;let s=120;const P=(pts,o)=>ma_stroke(pts,s++,o==null?5:o);
  return [P([[x,y+h],[x,y]]),P([[x,y],[x+w,y]]),P([[x+w,y],[x+w,y+h]]),P([[x,y+h],[x+w,y+h]]),P([[x,y+h/3],[x+w,y+h/3]],2),P([[x,y+h*2/3],[x+w,y+h*2/3]],2),
    P([[x+8,y+h-8],[x+w-8,y+8]],2)];})();
// a paper tag on a string from (sx, sy), its words on it; k springs it in, swing a little sway
function ma_paperTag(ctx,sx,sy,x,y,text,a,o){o=o||{};if(a<=0)return;const f={w:700,size:28},tw=ag_tw(ctx,text,f),w=tw+(o.arrow?62:44),h=46,rot=o.rot||0;ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle="rgba(70,62,52,0.7)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo((sx+x)/2,Math.max(sy,y)+10,x+8,y+h/2);ctx.stroke();
  ctx.translate(x,y+h/2);ctx.rotate(rot);ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=3;
  ctx.fillStyle="#EFE6CF";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(14,-h/2);ctx.lineTo(w,-h/2);ctx.lineTo(w,h/2);ctx.lineTo(14,h/2);ctx.closePath();ctx.fill();ctx.restore();
  ctx.fillStyle="rgba(120,104,80,0.5)";ctx.beginPath();ctx.arc(12,0,4,0,TAU);ctx.fill();ag_T(ctx,text,26,10,{w:700,size:28,col:[70,62,52]});
  if(o.arrow){const ax=26+tw+18,k=o.arrow;ctx.fillStyle="rgba(70,62,52,0.85)";ctx.beginPath();ctx.moveTo(ax,-12-4*k);ctx.lineTo(ax+9,0-4*k);ctx.lineTo(ax-9,0-4*k);ctx.closePath();ctx.fill();ctx.fillRect(ax-2.5,-2-4*k,5,12);}
  ctx.restore();}
// a pencilled sun on its arc across the sheet's sky, u 0..1 from morning to night; and the plant's dial, its hand on the same day
function ma_sunArc(ctx,u,a){if(a<=0)return;const x=lerp(1000,1500,u),y=250-Math.sin(Math.PI*u)*110;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(58,60,66,0.75)";ctx.lineWidth=2.6;ctx.lineCap="round";
  ctx.setLineDash([3,9]);ctx.beginPath();for(let k=0;k<=40;k++){const v=k/40;ctx.lineTo(lerp(1000,1500,v),250-Math.sin(Math.PI*v)*110);}ctx.globalAlpha*=0.5;ctx.stroke();ctx.globalAlpha/=0.5;ctx.setLineDash([]);
  ctx.beginPath();ctx.arc(x,y,20,0,TAU);ctx.stroke();for(let k=0;k<8;k++){const r=k/8*TAU;ctx.beginPath();ctx.moveTo(x+Math.cos(r)*28,y+Math.sin(r)*28);ctx.lineTo(x+Math.cos(r)*38,y+Math.sin(r)*38);ctx.stroke();}ctx.restore();}
function ma_plantDial(ctx,u,a){if(a<=0)return;const x=880,y=232;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(58,60,66,0.8)";ctx.lineWidth=2.6;ctx.lineCap="round";
  ctx.beginPath();ctx.arc(x,y,34,0,TAU);ctx.stroke();for(let k=0;k<12;k++){const r=k/12*TAU;ctx.beginPath();ctx.moveTo(x+Math.cos(r)*26,y+Math.sin(r)*26);ctx.lineTo(x+Math.cos(r)*31,y+Math.sin(r)*31);ctx.stroke();}
  const r=-Math.PI/2+u*TAU*0.92;ctx.lineWidth=3.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(r)*24,y+Math.sin(r)*24);ctx.stroke();ctx.beginPath();ctx.moveTo(800,232);ctx.lineTo(846,232);ctx.stroke();ctx.restore();}
// the title block in the sheet's corner: a ruled box with the architect's name, pencilled
const MA_TB=(()=>{const x=1180,y=760,w=350,h=96;let s=140;const P=(pts,o)=>ma_stroke(pts,s++,o==null?4:o);
  return [P([[x,y],[x+w,y]]),P([[x,y],[x,y+h]]),P([[x,y+h],[x+w,y+h]]),P([[x+w,y],[x+w,y+h]])];})();
function ma_titleBlock(ctx,t,t0,a){if(a<=0||t<t0)return;ma_sketch(ctx,MA_TB,t,t0,0.8,{a});const k=ag_in(t,t0+0.5,0.6)*a;
  ag_T(ctx,"Mick Pearce",1204,806,{w:800,size:36,col:[52,54,60],a:k});ag_T(ctx,"architect",1204,842,{w:500,size:28,col:[84,86,92],a:k});}
// a "let" sign in a shop window of Eastgate (block 0 or 1, window k 0..4), k springs it in
function ma_letSign(ctx,b,k,u){if(u<=0)return;const bx=MA_EGX.blocks[b][0],bw=MA_EGX.blocks[b][1],x=bx+20+k*(bw-40)/5+10+48,y=MA_EGX.HZ-58,s=lerp(0.6,1,ag_spr(u,0,0.4)),a=clamp(u*4,0,1);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="rgba(60,60,64,0.6)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-20,-34);ctx.lineTo(-14,-22);ctx.moveTo(20,-34);ctx.lineTo(14,-22);ctx.stroke();
  ctx.fillStyle="#F6F2E8";rr(ctx,-40,-22,80,44,6);ctx.fill();ctx.strokeStyle="rgba(150,96,78,0.9)";ctx.lineWidth=3;rr(ctx,-36,-18,72,36,4);ctx.stroke();
  ag_T(ctx,"LET",0,10,{w:800,size:28,ls:2,align:"center",col:[150,80,60]});ctx.restore();}

/* ---------------------------------------------------------------- termite mounds, southern Africa: the savanna */
const MA_EARTH=[186,140,104];
function ma_savanna(c,HZ,o){o=o||{};ma_sky(c,o.top||[164,176,198],o.low||[242,220,190],HZ,o.sun||[1700,HZ-60,760,0.5],o.mid||[[216,204,204],0.6]);
  for(const cl of (o.clouds||[[300,140,280,24,3],[1180,90,360,30,5]])){ma_blob(c,cl[0],cl[1],cl[2],cl[3],cl[4],0.45,"rgba(252,240,228,0.42)");}
  c.fillStyle=rgba(o.hills||[172,164,158],1);c.beginPath();c.moveTo(0,HZ);for(let x=0;x<=W;x+=24)c.lineTo(x,HZ-16-28*AG_NZ.fbm(x*0.0025,3.3,3));c.lineTo(W,HZ+2);c.lineTo(0,HZ+2);c.fill();
  const bot=o.bottom||H,g=c.createLinearGradient(0,HZ,0,bot);g.addColorStop(0,rgba(o.grass||[210,190,148],1));g.addColorStop(1,rgba(o.grass2||[180,158,116],1));c.fillStyle=g;c.fillRect(0,HZ,W,bot-HZ);ma_grain(c,0,HZ,W,bot-HZ,2.4,21);
  const R=ag_rnd(31);for(let i=0;i<190;i++){const y=HZ+8+Math.pow(R(),1.4)*(bot-HZ-10),x=R()*W,k=0.3+(y-HZ)/(H-HZ)*1.6;
    c.strokeStyle=rgba(mix([150,132,94],[186,168,122],R()),0.62);c.lineWidth=1.6*k;c.beginPath();for(let j=0;j<5;j++){c.moveTo(x+j*3*k,y);c.quadraticCurveTo(x+j*3*k+4*k,y-10*k,x+j*3*k+(j-2)*4*k,y-18*k-R()*8*k);}c.stroke();}
  for(const a of (o.acacias||[[240,HZ+12,0.62],[1580,HZ+8,0.48],[1800,HZ+14,0.4]]))ma_acacia(c,a[0],a[1],a[2]);}
function ma_acacia(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);ag_floorShadow(c,-40,4,180,14,0.2);
  c.strokeStyle=rgba([94,82,72],1);c.lineCap="round";c.lineWidth=14;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(8,-80,-12,-150);c.moveTo(3,-66);c.quadraticCurveTo(44,-110,74,-160);c.stroke();
  c.lineWidth=6;c.beginPath();c.moveTo(-12,-150);c.lineTo(-64,-178);c.moveTo(74,-160);c.lineTo(124,-180);c.moveTo(-12,-150);c.lineTo(10,-196);c.stroke();
  ma_blob(c,30,-196,180,30,7,0.25,rgba([104,116,90],1));ma_blob(c,46,-206,140,22,8,0.3,rgba([124,136,106],1));ma_blob(c,70,-214,90,14,9,0.3,rgba([146,156,122],1));c.restore();}
/* the mound: a tall spire leaning a little, a turret on its right shoulder, buttresses at its foot; its base on the ground at MA_MD.base */
const MA_MD={cx:900,base:820,h:640,w:300};
function ma_moundPts(){const M=MA_MD,cx=M.cx,base=M.base,h=M.h,w=M.w;return ma_smooth([[cx-w,base],[cx-w*0.84,base-h*0.07],[cx-w*0.62,base-h*0.15],[cx-w*0.5,base-h*0.3],
  [cx-w*0.37,base-h*0.45],[cx-w*0.29,base-h*0.6],[cx-w*0.2,base-h*0.76],[cx-w*0.12,base-h*0.9],[cx-w*0.04,base-h],[cx+w*0.05,base-h*0.99],[cx+w*0.1,base-h*0.9],
  [cx+w*0.15,base-h*0.76],[cx+w*0.2,base-h*0.64],[cx+w*0.3,base-h*0.6],[cx+w*0.36,base-h*0.66],[cx+w*0.42,base-h*0.62],[cx+w*0.46,base-h*0.46],[cx+w*0.58,base-h*0.3],
  [cx+w*0.72,base-h*0.16],[cx+w*0.88,base-h*0.07],[cx+w,base]],8);}
const MA_MP=ma_moundPts();
// where the mound's outline crosses height y, on the left (side -1) or the right (side 1)
function ma_moundX(y,side){const P=MA_MP,top=P.reduce((m,p,i)=>p[1]<P[m][1]?i:m,0),S=side<0?P.slice(0,top+1):P.slice(top).reverse();
  for(let i=1;i<S.length;i++){const a=S[i-1],b=S[i];if((a[1]-y)*(b[1]-y)<=0){const k=(y-a[1])/((b[1]-a[1])||1);return lerp(a[0],b[0],k);}}return MA_MD.cx;}
function ma_earthTex(){return ag_kept("ma:earth",600,700,(c,tw,th)=>{const img=c.createImageData(tw,th),d=img.data;
  for(let y=0;y<th;y++)for(let x=0;x<tw;x++){const m=AG_NZ.fbm(x*0.012,y*0.004,4)-0.5,f=AG_NZ.n2(x*0.3,y*0.3)-0.5,gr=AG_NZ.fbm(x*0.06,y*0.006,2)-0.5,L=m*18+f*6+gr*10,i=(y*tw+x)*4;
    d[i]=d[i+1]=d[i+2]=128+L;d[i+3]=255;}c.putImageData(img,0,0);});}
function ma_overlayTex(c,x,y,w,h,a){c.save();c.globalCompositeOperation="overlay";c.globalAlpha=a;c.drawImage(ma_earthTex(),x,y,w,h);c.restore();}
AG_PLACES.maMound=c=>{const M=MA_MD,HZ=560;ma_savanna(c,HZ);
  // the mound, whole: earth lit from the right, rain-worn streaks, the openings at its foot, its shadow falling left
  ma_shadowOf(c,k=>{k.ellipse(M.cx-150,M.base+6,M.w*1.5,26,0,0,TAU);},"rgba(60,40,26,0.45)",30,0,0);
  c.save();ma_poly(c,MA_MP);c.clip();c.fillStyle=rgba(MA_EARTH,1);c.fillRect(M.cx-M.w-20,M.base-M.h-20,2*M.w+40,M.h+40);ma_overlayTex(c,M.cx-M.w,M.base-M.h-10,2*M.w,M.h+20,0.6);
  let g=c.createLinearGradient(M.cx-M.w,0,M.cx+M.w,0);g.addColorStop(0,"rgba(60,40,28,0.42)");g.addColorStop(0.5,"rgba(60,40,28,0.06)");g.addColorStop(0.8,"rgba(255,236,210,0.2)");g.addColorStop(1,"rgba(255,236,210,0.06)");
  c.fillStyle=g;c.fillRect(M.cx-M.w-20,M.base-M.h-20,2*M.w+40,M.h+40);g=c.createLinearGradient(0,M.base-M.h,0,M.base);g.addColorStop(0,"rgba(255,236,210,0.1)");g.addColorStop(1,"rgba(60,40,28,0.22)");c.fillStyle=g;c.fillRect(M.cx-M.w-20,M.base-M.h-20,2*M.w+40,M.h+40);
  const R=ag_rnd(4);c.lineCap="round";for(let i=0;i<30;i++){const y=M.base-M.h*(0.05+R()*0.85),side=R()<0.5?-1:1,x0=ma_moundX(y,side),x=lerp(x0,M.cx,0.1+R()*0.6);
    c.strokeStyle=side>0?"rgba(255,236,210,0.12)":"rgba(70,48,34,0.18)";c.lineWidth=2+R()*3;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(R()-0.5)*14,y+50,x+(R()-0.5)*10,y+90+R()*80);c.stroke();}
  c.restore();
  for(const [x,y,s] of [[M.cx-M.w*0.66,M.base-14,1],[M.cx+M.w*0.62,M.base-12,0.9],[M.cx-M.w*0.2,M.base-8,0.7]]){c.fillStyle="rgba(60,40,30,0.75)";c.beginPath();c.ellipse(x,y,16*s,12*s,0,Math.PI,TAU);c.lineTo(x+16*s,y+4);c.lineTo(x-16*s,y+4);c.fill();}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,24,0.1)");g.addColorStop(1,"rgba(255,240,220,0.06)");c.fillStyle=g;c.fillRect(0,0,W,H);};
/* the mound cut down the middle, as a diorama: the ground cut away in front too, showing the soil. Inside: a central chimney, open at
   the top; channels just under the skin on each side; a few passages between; openings at the foot; and below the ground the nest,
   its fungus gardens. Channels are cut into the face: the light from the right falls on their left wall. */
const MA_GY=820;
function ma_cutChannel(c,pts,w0,w1){const S=ma_smooth(pts,10),n=S.length,L=[],R=[];for(let i=0;i<n;i++){const p=S[i],q=S[Math.min(n-1,i+1)],o=S[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],d=Math.hypot(dx,dy)||1,w=lerp(w0,w1,i/(n-1))/2;
    L.push([p[0]-dy/d*w,p[1]+dx/d*w]);R.push([p[0]+dy/d*w,p[1]-dx/d*w]);}
  const shape=k=>{k.moveTo(L[0][0],L[0][1]);for(const p of L)k.lineTo(p[0],p[1]);for(let i=n-1;i>=0;i--)k.lineTo(R[i][0],R[i][1]);k.closePath();};
  c.beginPath();shape(c);c.fillStyle=rgba([88,60,46],1);c.fill();
  c.save();c.beginPath();shape(c);c.clip();c.strokeStyle="rgba(214,170,128,0.55)";c.lineWidth=Math.max(3,w0*0.22);c.beginPath();
  const side=S[n-1][1]<S[0][1]?L:R;c.moveTo(side[0][0],side[0][1]);for(const p of side)c.lineTo(p[0],p[1]);c.stroke();c.restore();}
const MA_CH={chim:[[MA_MD.cx-4,MA_GY-40],[MA_MD.cx-10,MA_GY-220],[MA_MD.cx-2,MA_MD.base-MA_MD.h*0.62],[MA_MD.cx+2,MA_MD.base-MA_MD.h*0.86],[MA_MD.cx+4,MA_MD.base-MA_MD.h+6]]};
function ma_conduit(side){const out=[];for(let y=MA_GY-16;y>=MA_MD.base-MA_MD.h*0.66;y-=36)out.push([ma_moundX(y,side)-side*40,y]);return out;}
AG_PLACES.maMoundCut=c=>{const M=MA_MD,HZ=560,gy=MA_GY;ma_savanna(c,HZ,{bottom:gy});
  // the soil, cut: topsoil, then paler subsoil with stones, roots from the grass
  let g=c.createLinearGradient(0,gy,0,H);g.addColorStop(0,rgba([132,98,72],1));g.addColorStop(0.16,rgba([138,104,78],1));g.addColorStop(0.22,rgba([160,124,94],1));g.addColorStop(1,rgba([146,110,84],1));c.fillStyle=g;c.fillRect(0,gy,W,H-gy);
  ma_overlayTex(c,0,gy,W,H-gy,0.4);const R=ag_rnd(12);
  for(let i=0;i<46;i++){const x=R()*W,y=gy+70+R()*(H-gy-70),r=4+R()*12;c.fillStyle=rgba(mix([120,104,92],[176,160,140],R()),0.85);c.beginPath();c.ellipse(x,y,r*1.3,r,R()*3,0,TAU);c.fill();
    c.fillStyle="rgba(255,240,220,0.25)";c.beginPath();c.ellipse(x+r*0.3,y-r*0.3,r*0.5,r*0.35,0,0,TAU);c.fill();}
  c.strokeStyle="rgba(84,62,46,0.45)";c.lineCap="round";for(let i=0;i<26;i++){const x=R()*W;if(Math.abs(x-M.cx)<M.w+30)continue;c.lineWidth=1.5+R()*2;c.beginPath();c.moveTo(x,gy+2);
    c.bezierCurveTo(x+(R()-0.5)*40,gy+40,x+(R()-0.5)*60,gy+80,x+(R()-0.5)*70,gy+110+R()*70);c.stroke();}
  c.fillStyle=rgba([196,176,132],1);c.fillRect(0,gy-5,W,8);c.fillStyle="rgba(255,244,220,0.45)";c.fillRect(0,gy-5,W,2);
  // a sliver of the mound's outside, lit, beyond the cut on the right; then the cut face, flat, the same earth a little paler, with
  // faint layers where the termites built it up
  ma_shadowOf(c,k=>{k.ellipse(M.cx-120,M.base+4,M.w*1.3,20,0,0,TAU);},"rgba(60,40,26,0.4)",26,0,0);
  c.save();c.translate(M.cx+10,M.base);c.scale(1.035,1.012);c.translate(-M.cx,-M.base);ma_poly(c,MA_MP);c.fillStyle=rgba([206,160,118],1);c.fill();
  const og=c.createLinearGradient(M.cx,0,M.cx+M.w,0);og.addColorStop(0,"rgba(120,80,56,0.3)");og.addColorStop(1,"rgba(255,236,210,0.2)");c.fillStyle=og;c.fill();c.restore();
  c.save();ma_poly(c,MA_MP);c.clip();c.fillStyle=rgba([194,150,112],1);c.fillRect(M.cx-M.w-20,M.base-M.h-20,2*M.w+40,M.h+40);ma_overlayTex(c,M.cx-M.w,M.base-M.h,2*M.w,M.h,0.5);
  c.strokeStyle="rgba(120,84,60,0.12)";c.lineWidth=2;for(let i=1;i<16;i++){const y=M.base-i*M.h/16;c.beginPath();c.moveTo(ma_moundX(y,-1)+4,y+6);c.quadraticCurveTo(M.cx,y-14,ma_moundX(y,1)-4,y+6);c.stroke();}
  g=c.createLinearGradient(0,M.base-M.h,0,M.base);g.addColorStop(0,"rgba(255,240,220,0.1)");g.addColorStop(1,"rgba(80,54,38,0.12)");c.fillStyle=g;c.fillRect(M.cx-M.w-20,M.base-M.h-20,2*M.w+40,M.h+40);
  // the channels: under the skin on both sides, the chimney, passages between them, openings at the foot
  for(const s of [-1,1]){ma_cutChannel(c,ma_conduit(s),16,12);const top=ma_conduit(s).pop();
    ma_cutChannel(c,[top,[lerp(top[0],M.cx,0.5),top[1]-60],[M.cx+s*8,M.base-M.h*0.8]],13,11);
    for(const f of [0.26,0.46]){const y=M.base-M.h*f;ma_cutChannel(c,[[M.cx+s*14,y],[lerp(M.cx,ma_moundX(y,s),0.5),y-24],[ma_moundX(y-30,s)-s*40,y-34]],10,10);}
    ma_cutChannel(c,[[ma_moundX(gy-22,s)+s*2,gy-22],[ma_moundX(gy-22,s)-s*44,gy-20]],13,13);}
  ma_cutChannel(c,MA_CH.chim,50,20);
  // the vent at the top: the chimney opening to the sky
  c.restore();
  // below the ground: the nest, a hollow of chambers whose fungus gardens look like pale sponges, ridged and uneven
  c.save();const nest=k=>{for(const p of ma_blobPts(M.cx,gy+40,200,96,8,0.14,64))k.lineTo(p[0],p[1]);k.closePath();};c.beginPath();nest(c);c.fillStyle=rgba([84,58,46],1);c.fill();c.clip();
  const NR=ag_rnd(19);for(let r=0;r<3;r++)for(let k=0;k<5;k++){const x=M.cx-160+k*76+(r%2)*34+(NR()-0.5)*16,y=gy-16+r*50+(NR()-0.5)*8,rx=26+NR()*12,ry=18+NR()*6;
    const comb=q=>{const P=ma_blobPts(x,y,rx,ry,r*7+k,0.3,40);q.moveTo(P[0][0],P[0][1]);for(const p of P)q.lineTo(p[0],p[1]);q.closePath();};
    ag_soft(c,comb,[206,190,162],[232,222,200],x+8,y-8,30,"rgba(70,50,36,0.35)",8,0.7);c.save();c.beginPath();comb(c);c.clip();c.strokeStyle="rgba(140,116,90,0.55)";c.lineWidth=1.8;
    for(let j=-3;j<=3;j++){c.beginPath();c.moveTo(x+j*9-6,y-ry);c.bezierCurveTo(x+j*9+6,y-ry*0.3,x+j*9-6,y+ry*0.3,x+j*9+4,y+ry);c.stroke();}c.restore();}
  c.restore();
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,24,0.1)");g.addColorStop(1,"rgba(255,240,220,0.05)");c.fillStyle=g;c.fillRect(0,0,W,H);};
/* the idea, then: fresh air drawn in at the foot on both sides, down into the nest; warm air up the chimney and out of the top */
function ma_moundIdea(ctx,t,cool,warm){const M=MA_MD,gy=MA_GY;
  for(const s of [-1,1]){const xf=ma_moundX(gy-22,s);ma_air(ctx,[[M.cx+s*(M.w+300),gy-46],[xf+s*120,gy-30],[xf-s*30,gy-21],[M.cx+s*170,gy+2],[M.cx+s*60,gy+18]],MA_COOLD,t+(s>0?0.7:0),{u:cool,w:17,speed:54});}
  ma_air(ctx,[[M.cx-4,gy+10],[M.cx-8,gy-150],[M.cx-6,gy-330],[M.cx+2,M.base-M.h*0.86],[M.cx+6,M.base-M.h-30],[M.cx+40,M.base-M.h-130]],MA_WARM,t,{u:warm,w:16,speed:70});}
/* what sensors found, years later: the air moves like a lung. By day (night 0) the walls warm in the sun, air rises in the channels
   under the skin and sinks down the chimney; by night (night 1) it turns round. n 0..1 how far the night has come */
function ma_moundLung(ctx,t,n,a){const M=MA_MD,gy=MA_GY,day=n<0.5,k=day?1-n*2:(n-0.5)*2;if(a<=0)return;
  for(const s of [-1,1]){const C=ma_conduit(s),top=C[C.length-1],loopTop=[[top[0],top[1]],[lerp(top[0],M.cx,0.5),top[1]-60],[M.cx+s*8,M.base-M.h*0.8]];
    const up=C.concat(loopTop.slice(1)),down=[[M.cx+s*4,M.base-M.h*0.78],[M.cx+s*6,M.base-M.h*0.5],[M.cx+s*4,gy-60],[M.cx+s*40,gy-20],[C[0][0]-s*0,C[0][1]+6]];
    if(day){ma_air(ctx,up,MA_WARM,t,{u:1,w:13,speed:46,a:a*k});ma_air(ctx,down,MA_COOL,t,{u:1,w:13,speed:46,a:a*k});}
    else{ma_air(ctx,up.slice().reverse(),MA_COOL,t,{u:1,w:13,speed:46,a:a*k});ma_air(ctx,down.slice().reverse(),MA_WARM,t,{u:1,w:13,speed:46,a:a*k});}}}
// a sensor pushed into the mound: a slim probe with a cable running out to the ground
function ma_sensor(ctx,x,y,ang,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(60,62,68,0.9)";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);
  ctx.bezierCurveTo(x+Math.cos(ang)*120,y+Math.sin(ang)*120,x+Math.cos(ang)*200,MA_GY-40,x+Math.cos(ang)*260,MA_GY-6);ctx.stroke();
  ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle="#C9CCD0";rr(ctx,-6,-7,46,14,6);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(0,-5,36,3);ctx.fillStyle="#7C8088";ctx.beginPath();ctx.arc(-4,0,6,0,TAU);ctx.fill();ctx.restore();}
// night over the savanna: a deep blue veil over the sky and the land, the cut a little less (it is lit for us to see)
function ma_moundNight(ctx,n){if(n<=0)return;ctx.save();ctx.fillStyle="rgba(26,30,58,"+(0.5*n).toFixed(3)+")";ctx.fillRect(0,0,W,MA_GY);ctx.fillStyle="rgba(26,30,58,"+(0.22*n).toFixed(3)+")";ctx.fillRect(0,MA_GY,W,H-MA_GY);
  ctx.globalAlpha=n;const R=ag_rnd(77);for(let i=0;i<60;i++){ctx.fillStyle="rgba(255,250,236,"+(0.5*R()).toFixed(3)+")";ctx.fillRect(R()*W,R()*420,2,2);}ctx.restore();}

/* ---------------------------------------------------------------- Eastgate cut through: two blocks of offices over shops, an atrium
   between them under a glass roof, hollow floors with concrete teeth, fans low down, ducts up the outer walls, and brick chimneys
   along the roofs; by day (people at their desks) and by night (empty, the fans running) */
const MA_EG={gr:868,y0:300,fl:8,fh:60,blocks:[[230,580],[1110,580]],atr:[810,1110]};
function ma_section(c,night){const E=MA_EG,n=night?1:0,M=(a,b)=>mix(a,b,n);
  ma_sky(c,M([186,200,210],[38,46,72]),M([240,232,216],[84,90,116]),E.gr,n?null:[1760,150,700,0.5]);
  if(n){const R=ag_rnd(5);for(let i=0;i<110;i++){c.fillStyle="rgba(255,250,236,"+(0.6*R()).toFixed(3)+")";c.fillRect(R()*W,R()*560,2,2);}
    const m=c.createRadialGradient(1660,150,6,1660,150,90);m.addColorStop(0,"rgba(250,246,232,0.95)");m.addColorStop(0.25,"rgba(250,246,232,0.3)");m.addColorStop(1,"rgba(250,246,232,0)");c.fillStyle=m;c.fillRect(1560,50,200,200);}
  // the ground cut through: the street's paving, then soil
  let g=c.createLinearGradient(0,E.gr,0,H);g.addColorStop(0,rgba(M([168,160,150],[60,62,74]),1));g.addColorStop(0.1,rgba(M([168,160,150],[60,62,74]),1));g.addColorStop(0.12,rgba(M([150,124,100],[56,52,60]),1));g.addColorStop(1,rgba(M([136,110,88],[48,46,54]),1));
  c.fillStyle=g;c.fillRect(0,E.gr,W,H-E.gr);ma_overlayTex(c,0,E.gr+24,W,H-E.gr-24,0.3);c.fillStyle=rgba(M([200,194,184],[80,82,94]),1);c.fillRect(0,E.gr,W,4);
  const top=E.y0,bot=E.y0+E.fl*E.fh;
  for(const [bx,bw] of E.blocks){ag_floorShadow(c,bx+bw/2-50,E.gr+4,bw*0.62,14,0.3);
    c.fillStyle=rgba(M([222,214,200],[108,108,118]),1);c.fillRect(bx,bot,bw,E.gr-bot);   // the shops, taller
    for(let k=0;k<5;k++){c.fillStyle=rgba(M([120,132,140],[70,74,90]),0.6);c.fillRect(bx+20+k*(bw-40)/5,bot+26,(bw-40)/5-16,E.gr-bot-36);}
    for(let f=0;f<E.fl;f++){const y=top+f*E.fh;c.fillStyle=rgba(M([234,228,216],[124,124,134]),1);c.fillRect(bx,y,bw,E.fh-16);
      c.fillStyle=rgba(M([200,192,180],[100,100,110]),1);for(let k=50;k<bw-60;k+=92)c.fillRect(bx+k,y+E.fh-36,48,5);   // desks
      const fy=y+E.fh-16;c.fillStyle=rgba(M([168,162,152],[74,76,86]),1);c.fillRect(bx,fy,bw,16);
      c.fillStyle=rgba(M([146,140,132],[62,64,74]),1);for(let k=6;k<bw;k+=16)c.fillRect(bx+k,fy+4,7,8);}   // the hollow floor and its teeth
    for(let f=0;f<=E.fl;f++){c.fillStyle=rgba(M([198,190,178],[92,92,102]),1);c.fillRect(bx-20,top+f*E.fh-4,20,8);c.fillRect(bx+bw,top+f*E.fh-4,20,8);}
    // the ducts: one up the outer wall from the fans, and shafts up to the chimneys
    const out=bx<800?bx+14:bx+bw-30;c.fillStyle=rgba(M([210,202,190],[100,102,112]),1);c.fillRect(out,top,16,bot-top+40);c.fillStyle=rgba(M([186,178,166],[86,88,98]),1);c.fillRect(out+12,top,4,bot-top+40);
    for(let k=0;k<8;k+=2){const cx=bx+40+k*(bw-80)/7;c.fillStyle=rgba(M([214,206,194],[106,106,116]),0.75);c.fillRect(cx-9,top,18,bot-top-16);}
    // the chimneys along the roof, brick, with caps
    for(let k=0;k<8;k++){const cx=bx+40+k*(bw-80)/7;c.fillStyle=rgba(M([176,126,100],[96,78,74]),1);c.fillRect(cx-15,top-100,30,102);
      c.fillStyle=rgba(M([148,106,86],[80,64,62]),1);c.fillRect(cx-20,top-108,40,10);c.fillStyle="rgba(255,240,220,0.14)";c.fillRect(cx+8,top-100,7,102);}
    g=c.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,"rgba(40,34,28,0.12)");g.addColorStop(1,"rgba(255,248,236,0.06)");c.fillStyle=g;c.fillRect(bx,top,bw,E.gr-top);
    // the fans: round housings low on the outer side
    const fx=bx<800?bx+64:bx+bw-64,fy=bot+44;c.fillStyle=rgba(M([150,150,150],[80,82,92]),1);c.beginPath();c.arc(fx,fy,27,0,TAU);c.fill();c.fillStyle=rgba(M([120,120,122],[66,68,78]),1);c.beginPath();c.arc(fx,fy,8,0,TAU);c.fill();
    // by day, people at their desks: small, seated, no faces
    if(!n){const R=ag_rnd(bx|0);for(let f=0;f<E.fl;f++)for(let k=50;k<bw-60;k+=92){if(R()<0.42)continue;const px=bx+k+24+(R()-0.5)*10,py=top+f*E.fh+E.fh-38;
      c.fillStyle=rgba(mix([90,100,120],[150,96,84],R()),1);rr(c,px-7,py-14,14,16,4);c.fill();c.fillStyle=rgba(MA_SKIN[(R()*2)|0],1);c.beginPath();c.arc(px,py-20,5.5,0,TAU);c.fill();}}}
  // the atrium: open to the sky under a glass roof, its floor the shops' street
  const [a0,a1]=E.atr;c.fillStyle=rgba(M([210,220,224],[90,100,122]),0.8);c.beginPath();c.moveTo(a0,top-30);c.lineTo((a0+a1)/2,top-62);c.lineTo(a1,top-30);c.lineTo(a1,top-20);c.lineTo((a0+a1)/2,top-52);c.lineTo(a0,top-20);c.closePath();c.fill();
  c.strokeStyle=rgba(M([150,160,168],[70,78,96]),1);c.lineWidth=3;for(let k=0;k<=6;k++){const x=a0+k*(a1-a0)/6;c.beginPath();c.moveTo(x,top-26-Math.min(x-a0,a1-x)/((a1-a0)/2)*30);c.lineTo(x,E.gr);c.globalAlpha=0.25;c.stroke();c.globalAlpha=1;}
  for(let f=2;f<E.fl;f+=3){const y=top+f*E.fh+E.fh-12;c.fillStyle=rgba(M([200,196,188],[96,98,110]),0.9);c.fillRect(a0,y,a1-a0,8);}   // bridges across the atrium
  if(n){c.fillStyle="rgba(20,24,40,0.16)";c.fillRect(0,0,W,H);}}
AG_PLACES.maSection=c=>ma_section(c,false);
AG_PLACES.maSectionNight=c=>ma_section(c,true);
/* the parts lighting one by one (lit: [fans, floors, chimneys], each 0..1), the fans turning, and the air: o.cool by night (fans pull
   cool air in, up the ducts and through the hollow floors, whose concrete stores the cool); o.warm by day (warm air rises from the
   offices up the shafts and out of the chimneys) */
function ma_sectionLive(ctx,t,o){o=o||{};const E=MA_EG,top=E.y0,bot=E.y0+E.fl*E.fh,lit=o.lit||[0,0,0],n=o.night||0;
  for(const [bx,bw] of E.blocks){const L0=lit[0],fx=bx<800?bx+64:bx+bw-64,fy=bot+44;
    if(L0>0){ctx.save();ctx.globalAlpha=L0;ctx.fillStyle=rgba(n>0.5?[196,208,220]:[236,224,206],0.6);ctx.beginPath();ctx.arc(fx,fy,30,0,TAU);ctx.fill();
      ctx.restore();ma_fan(ctx,fx,fy,23,t*(o.spin==null?4:o.spin),rgba(n>0.5?[70,84,104]:[96,96,100],1),L0,false);}
    for(let f=0;f<E.fl;f++){const L=clamp(lit[1]*E.fl-f,0,1);if(L<=0)continue;const y=top+f*E.fh+E.fh-16;ctx.fillStyle=rgba(n>0.5||o.cool?[206,220,232]:[240,224,204],0.5*L*(o.glow==null?1:o.glow));ctx.fillRect(bx,y,bw,16);}
    for(let k=0;k<8;k++){const L=clamp(lit[2]*8-k,0,1);if(L<=0)continue;const cx=bx+40+k*(bw-80)/7;ctx.fillStyle=rgba([236,196,170],0.5*L);ctx.fillRect(cx-15,top-100,30,102);}}
  if(o.cool>0){for(const [bx,bw] of E.blocks){const left=bx<800,dir=left?1:-1,duct=left?bx+22:bx+bw-22,fx=left?bx+64:bx+bw-64,fy=bot+44;
      for(let f=1;f<E.fl;f+=2){const y=top+f*E.fh+E.fh-8,far=left?bx+bw-30:bx+30;
        ma_air(ctx,[[duct-dir*190,E.gr-12],[duct-dir*70,E.gr-16],[fx,fy+6],[duct,bot-10],[duct,y+20],[duct+dir*30,y],[lerp(duct,far,0.5),y],[far,y]],MA_COOL,t+f*0.37,{u:o.cool,w:10,speed:58});}}}
  if(o.warm>0){for(const [bx,bw] of E.blocks)for(let k=0;k<8;k+=2){const cx=bx+40+k*(bw-80)/7;
      ma_air(ctx,[[cx,bot-24],[cx+2,(bot+top)/2],[cx,top-40],[cx+4,top-150],[cx+26,top-240]],MA_WARM,t+k*0.2,{u:o.warm,w:12,speed:72});}}}

/* ---------------------------------------------------------------- Eastgate in 1996, from the street: two long blocks of rough
   granite-grey concrete, small windows set deep behind sunshades, rows of brick chimneys on the roof, a glass-roofed atrium between,
   and shops at street level */
const MA_EGX={HZ:800,top:300,blocks:[[120,690],[1110,690]]};
AG_PLACES.maEastgate=c=>{const X=MA_EGX,HZ=X.HZ;ma_sky(c,[166,190,210],[236,232,222],HZ,[1820,160,760,0.55]);
  for(const cl of [[360,140,240,30,4],[1300,96,300,36,6]])ma_blob(c,cl[0],cl[1],cl[2],cl[3],cl[4],0.4,"rgba(252,248,240,0.55)");
  ma_bldg(c,-20,440,140,HZ-440,{base:[200,200,198],floors:9,cols:2,win:[140,150,160]});ma_bldg(c,1800,400,140,HZ-400,{base:[204,200,196],floors:10,cols:2,win:[140,150,160]});
  // the atrium between the blocks: a high glass roof on a steel frame, its far end open to the street behind
  c.fillStyle="rgba(206,218,226,0.75)";c.beginPath();c.moveTo(810,X.top+50);c.lineTo(960,X.top-16);c.lineTo(1110,X.top+50);c.lineTo(1110,HZ);c.lineTo(810,HZ);c.closePath();c.fill();
  c.strokeStyle="rgba(110,120,130,0.5)";c.lineWidth=4;for(let k=0;k<=8;k++){const x=810+k*37.5;c.beginPath();c.moveTo(x,X.top+50-Math.min(x-810,1110-x)/150*66);c.lineTo(x,HZ);c.stroke();}
  for(let y=X.top+100;y<HZ;y+=76){c.beginPath();c.moveTo(810,y);c.lineTo(1110,y);c.stroke();}
  for(const [bx,bw] of X.blocks){const by=X.top;c.fillStyle=rgba([188,182,172],1);c.fillRect(bx,by,bw,HZ-by);ma_grain(c,bx,by,bw,HZ-by,3.8,bx|0);
    // the face: piers between bays, each floor's windows small and deep, a sunshade over each
    const bays=8,bwid=(bw-40)/bays;for(let f=0;f<8;f++){const y=by+26+f*44;for(let k=0;k<bays;k++){const x=bx+20+k*bwid;
        c.fillStyle=rgba([70,76,86],0.85);c.fillRect(x+14,y+10,bwid-28,22);c.fillStyle="rgba(40,34,28,0.35)";c.fillRect(x+14,y+10,bwid-28,6);
        c.fillStyle="rgba(255,248,236,0.16)";c.fillRect(x+bwid-18,y+12,4,20);c.fillStyle=rgba([210,204,194],1);c.fillRect(x+8,y+4,bwid-16,7);c.fillStyle="rgba(40,34,28,0.2)";c.fillRect(x+8,y+11,bwid-16,3);}}
    for(let k=0;k<=bays;k++){const x=bx+14+k*bwid;c.fillStyle=rgba([198,192,182],1);c.fillRect(x,by+18,12,HZ-by-150);c.fillStyle="rgba(255,250,240,0.16)";c.fillRect(x+8,by+18,4,HZ-by-150);c.fillStyle="rgba(40,34,28,0.12)";c.fillRect(x-4,by+18,4,HZ-by-150);}
    // the chimneys on the roof: brick stacks with caps, in two rows, the far row smaller
    for(let row=1;row>=0;row--)for(let k=0;k<9;k++){const cx=bx+40+k*(bw-80)/8+(row?22:0),h=row?66:96,cy=by-h+(row?-8:0);c.fillStyle=rgba(row?[160,118,96]:[176,128,102],1);c.fillRect(cx-16,cy,32,h);
      c.fillStyle=rgba(row?[136,100,82]:[146,104,84],1);c.fillRect(cx-21,cy-8,42,10);c.fillStyle="rgba(255,240,220,0.16)";c.fillRect(cx+8,cy,8,h);c.fillStyle="rgba(40,30,24,0.12)";c.fillRect(cx-16,cy,5,h);}
    const g=c.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,"rgba(40,34,28,0.16)");g.addColorStop(1,"rgba(255,248,236,0.08)");c.fillStyle=g;c.fillRect(bx,by,bw,HZ-by);
    // the shops at street level: awnings and windows
    for(let k=0;k<5;k++){const x=bx+20+k*(bw-40)/5,w=(bw-40)/5-14;c.fillStyle=rgba([238,232,220],1);c.fillRect(x,HZ-120,w,112);
      c.fillStyle=rgba([96,108,118],0.72);c.fillRect(x+10,HZ-96,w-20,80);c.fillStyle="rgba(255,252,244,0.2)";c.fillRect(x+w-18,HZ-94,4,76);
      c.fillStyle=rgba(k%2?[150,96,78]:[118,110,96],1);c.beginPath();c.moveTo(x-6,HZ-130);c.lineTo(x+w+6,HZ-130);c.lineTo(x+w+16,HZ-102);c.lineTo(x-16,HZ-102);c.closePath();c.fill();
      c.fillStyle="rgba(40,34,28,0.16)";c.fillRect(x-14,HZ-102,w+28,6);}}
  c.fillStyle=rgba([204,198,188],1);c.fillRect(0,HZ,W,64);ma_grain(c,0,HZ,W,64,1.6,8);for(let x=0;x<W;x+=128){c.fillStyle="rgba(40,34,28,0.07)";c.fillRect(x,HZ,2,64);}
  c.fillStyle="rgba(40,34,28,0.2)";c.fillRect(0,HZ+64,W,4);
  let g=c.createLinearGradient(0,HZ+68,0,H);g.addColorStop(0,rgba([150,148,146],1));g.addColorStop(1,rgba([124,122,120],1));c.fillStyle=g;c.fillRect(0,HZ+68,W,H-HZ-68);ma_grain(c,0,HZ+68,W,H-HZ-68,2.2,9);
  c.fillStyle="rgba(244,240,230,0.5)";for(let x=60;x<W;x+=240)c.fillRect(x,1000,130,8);
  ma_tree(c,70,HZ+44,0.82,51,{leaf:[112,130,96]});ma_tree(c,1880,HZ+50,0.88,57,{leaf:[106,126,92]});
  ma_car(c,520,HZ+150,0.86,[206,204,198]);ma_car(c,1460,HZ+154,0.88,[120,70,62],{flip:true});
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.1)");g.addColorStop(1,"rgba(255,244,226,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// people at the shops, live
function ma_eastgateLife(ctx,t){const HZ=MA_EGX.HZ,P=[[300,HZ+46,0.84,{top:[170,80,70],skirt:1,skin:MA_SKIN[0]}],[420,HZ+50,0.86,{top:[230,226,214],skin:MA_SKIN[1]}],[880,HZ+44,0.8,{top:[90,104,130],skin:MA_SKIN[0]}],
  [1000,HZ+48,0.84,{top:[214,180,96],skirt:1,skin:MA_SKIN[1]}],[1300,HZ+50,0.86,{top:[96,112,96],skin:MA_SKIN[0],bag:1}],[1520,HZ+46,0.82,{top:[236,232,224],skin:MA_SKIN[1]}],[1660,HZ+48,0.86,{top:[120,72,84],skirt:1,skin:MA_SKIN[0]}]];
  P.forEach((p,i)=>{const dir=i%2?-1:1;ma_walker(ctx,p[0]+dir*t*13,p[1],p[2],Object.assign({t,ph:i*1.1,flip:dir<0},p[3]));});}

/* ---------------------------------------------------------------- the plant room, later: a painted concrete wall, the big ducts
   under the ceiling, and the control cabinet: a chart recorder whose pen draws the offices' warmth, and the fans' dials below it */
const MA_PL={x:900,y:120,w:860,h:900,chart:{x:980,y:200,w:700,h:330},dials:[[1040,680],[1240,680],[1440,680],[1640,680]]};
AG_PLACES.maPlant=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([200,196,188],1));g.addColorStop(1,rgba([184,178,170],1));c.fillStyle=g;c.fillRect(0,0,W,H);ma_grain(c,0,0,W,H,2.4,31);
  c.fillStyle=rgba([170,164,156],1);c.fillRect(0,640,W,H-640);c.fillStyle="rgba(255,250,240,0.25)";c.fillRect(0,640,W,3);
  // the ducts under the ceiling, round, with bands
  for(const [y,r] of [[54,46],[150,30]]){c.fillStyle=rgba([196,198,198],1);c.fillRect(0,y-r,W,r*2);g=c.createLinearGradient(0,y-r,0,y+r);g.addColorStop(0,"rgba(255,255,255,0.25)");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(40,34,28,0.25)");
    c.fillStyle=g;c.fillRect(0,y-r,W,r*2);for(let x=60;x<W;x+=240){c.fillStyle="rgba(40,34,28,0.18)";c.fillRect(x,y-r,8,r*2);}}
  // the cabinet
  const P=MA_PL;ma_shadowOf(c,k=>k.rect(P.x,P.y,P.w,P.h),"rgba(40,34,28,0.4)",40,AG.sdx*2.6,16);c.fillStyle=rgba([176,182,184],1);c.fillRect(P.x,P.y,P.w,P.h);
  g=c.createLinearGradient(P.x,0,P.x+P.w,0);g.addColorStop(0,"rgba(40,34,28,0.12)");g.addColorStop(1,"rgba(255,250,240,0.14)");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);
  c.fillStyle="rgba(255,255,255,0.3)";c.fillRect(P.x,P.y,P.w,3);c.fillStyle="rgba(40,34,28,0.2)";c.fillRect(P.x,P.y+P.h-3,P.w,3);
  // the chart recorder's window: paper with a grid; the comfort line is drawn live
  const C=P.chart;c.fillStyle=rgba([70,74,80],1);rr(c,C.x-16,C.y-16,C.w+32,C.h+32,10);c.fill();c.fillStyle=rgba([244,240,230],1);c.fillRect(C.x,C.y,C.w,C.h);
  c.strokeStyle="rgba(120,130,140,0.25)";c.lineWidth=1.2;for(let x=C.x+35;x<C.x+C.w;x+=35){c.beginPath();c.moveTo(x,C.y);c.lineTo(x,C.y+C.h);c.stroke();}for(let y=C.y+33;y<C.y+C.h;y+=33){c.beginPath();c.moveTo(C.x,y);c.lineTo(C.x+C.w,y);c.stroke();}
  g=c.createLinearGradient(0,C.y,0,C.y+C.h);g.addColorStop(0,"rgba(255,255,255,0.25)");g.addColorStop(0.3,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(C.x,C.y,C.w,C.h);
  // the dials: knobs on round plates, with ticks
  for(const [x,y] of P.dials){c.fillStyle=rgba([226,226,220],1);c.beginPath();c.arc(x,y,70,0,TAU);c.fill();c.strokeStyle="rgba(60,64,70,0.5)";c.lineWidth=2;
    for(let i=0;i<=10;i++){const a=Math.PI*0.75+i/10*Math.PI*1.5;c.beginPath();c.moveTo(x+Math.cos(a)*56,y+Math.sin(a)*56);c.lineTo(x+Math.cos(a)*64,y+Math.sin(a)*64);c.stroke();}
    c.fillStyle="rgba(40,34,28,0.22)";c.beginPath();c.arc(x-3,y+6,32,0,TAU);c.fill();c.fillStyle=rgba([66,68,74],1);c.beginPath();c.arc(x,y,30,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.16)";c.beginPath();c.arc(x+8,y-10,12,0,TAU);c.fill();}
  for(let k=0;k<6;k++){const x=980+k*120;c.fillStyle=rgba([62,64,70],1);rr(c,x,860,44,64,6);c.fill();c.fillStyle="rgba(255,255,255,0.2)";c.fillRect(x+4,862,36,5);}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.12)");g.addColorStop(1,"rgba(255,246,230,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);};
/* the chart, live: the comfort line (dashed), and the pen's trace of the offices' warmth up to u (0..1): it climbs over the line as
   the offices run warm, and settles back under it after fix (the u at which the controls were tuned), or never if fix is null;
   hot (0..1) shades in amber where the trace runs over the line */
function ma_chart(ctx,u,fix,a,hot){const C=MA_PL.chart,lim=C.y+C.h*0.42;a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.setLineDash([12,10]);ctx.strokeStyle="rgba(70,80,90,0.7)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(C.x,lim);ctx.lineTo(C.x+C.w,lim);ctx.stroke();ctx.setLineDash([]);
  const v=x=>{const day=Math.sin(x*TAU*3-1.2)*0.13,warm=fix==null?sstep(0.25,0.7,x)*0.3:sstep(0.25,0.5,x)*0.3*(1-sstep(fix,fix+0.2,x));return C.y+C.h*(0.62-day-warm);};
  const n=Math.max(1,Math.floor(140*clamp(u,0,1)));
  if(hot>0){ctx.fillStyle=rgba(AG.amber,0.36*hot);ctx.beginPath();ctx.moveTo(C.x,lim);for(let i=0;i<=n;i++){const x=i/140;ctx.lineTo(C.x+C.w*x,Math.min(lim,v(x)));}ctx.lineTo(C.x+C.w*n/140,lim);ctx.closePath();ctx.fill();}
  ctx.strokeStyle="#33363C";ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();for(let i=0;i<=n;i++){const x=i/140;ctx.lineTo(C.x+C.w*x,v(x));}ctx.stroke();
  const px=C.x+C.w*n/140,py=v(n/140);ctx.fillStyle="#33363C";ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();ctx.restore();return [px,py];}
// a dial's pointer (k: which dial, v 0..1 its setting)
function ma_dial(ctx,k,v){const [x,y]=MA_PL.dials[k],a=Math.PI*0.75+clamp(v,0,1)*Math.PI*1.5;ctx.save();ctx.strokeStyle="#E8E4DA";ctx.lineWidth=6;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*24,y+Math.sin(a)*24);ctx.stroke();ctx.restore();}
// the engineer who looks after the building, a person of the story (not a real one): a short-sleeved work shirt
const MA_ENGINEER={name:"",role:"",skin:[98,64,46],hair:{style:"cropped",c:[26,22,22]},top:{kind:"shirt",c:[196,206,214]},breath:0.26};

/* ===== Many agents, and what emerges: much from little (termites, ants, starlings) and the brain =====
   The same matte style as places.js. The places: maMoundIn (inside a mound, where termites build), maAnts (two bridges to food,
   in a laboratory, 1989), maRome (the sky over Rome at dusk) and maNeurons (a field of neurons). What moves is drawn live:
     ma_along(P, u)                  the point and heading at u (0..1) along a path
     ma_termite(ctx, x, y, ang, s, o) a worker termite, o.t for its legs, o.carry a pellet of mud
     ma_pillars(ctx, u, t)           the two pillars rising, pellet on pellet, then leaning in to an arch (u 0..1); ma_builders
                                     the termites at work on them
     ma_ant(ctx, x, y, ang, s, t)    an ant from above; ma_antsLive(ctx, t, share, scent) the ants on the bridges
     ma_flock(ctx, t, o)             a murmuration of starlings; o.mark rings one bird and its seven nearest neighbours
     ma_signals(ctx, t, a)           signals running along the neurons' fibres */

/* ---------------------------------------------------------------- moving along a path */
function ma_along(P,u){let tot=0;const L=[0];for(let i=1;i<P.length;i++){tot+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);L.push(tot);}
  const d=clamp(u,0,1)*tot;for(let i=1;i<P.length;i++)if(d<=L[i]){const k=(d-L[i-1])/((L[i]-L[i-1])||1),a=P[i-1],b=P[i];return [lerp(a[0],b[0],k),lerp(a[1],b[1],k),Math.atan2(b[1]-a[1],b[0]-a[0]),tot];}
  const a=P[P.length-2],b=P[P.length-1];return [b[0],b[1],Math.atan2(b[1]-a[1],b[0]-a[0]),tot];}

/* ---------------------------------------------------------------- inside the mound: a chamber of earth, where workers build */
const MA_IN={floor:840,pil:[[640,0],[1290,1]]};
AG_PLACES.maMoundIn=c=>{const F=MA_IN.floor;let g=c.createRadialGradient(1500,180,60,1100,420,1300);g.addColorStop(0,rgba([196,150,110],1));g.addColorStop(0.45,rgba([150,108,80],1));g.addColorStop(1,rgba([92,64,48],1));
  c.fillStyle=g;c.fillRect(0,0,W,H);ma_overlayTex(c,0,0,W,H,0.55);
  // the chamber's far wall: older pillars and arches, built long ago, softer in the dim
  const R=ag_rnd(7);for(const [x,w,h] of [[180,70,560],[360,60,500],[1560,80,600],[1780,64,520]]){c.fillStyle=rgba([122,86,64],0.75);c.beginPath();c.moveTo(x-w/2,F-20);
    c.bezierCurveTo(x-w*0.44,F-h*0.5,x-w*0.3,F-h*0.9,x-w*0.1,F-h);c.lineTo(x+w*0.12,F-h);c.bezierCurveTo(x+w*0.32,F-h*0.9,x+w*0.44,F-h*0.5,x+w/2,F-20);c.closePath();c.fill();}
  c.strokeStyle=rgba([122,86,64],0.75);c.lineWidth=60;c.lineCap="round";c.beginPath();c.moveTo(180,F-560);c.quadraticCurveTo(270,F-680,360,F-500);c.stroke();
  c.beginPath();c.moveTo(1560,F-600);c.quadraticCurveTo(1670,F-720,1780,F-520);c.stroke();
  // pores and tunnels in the wall: dark mouths, lit on their lower lip
  for(let i=0;i<7;i++){const x=R()*W,y=120+R()*520,r=10+R()*18;if(Math.abs(x-960)<300)continue;c.fillStyle="rgba(50,34,26,0.55)";c.beginPath();c.ellipse(x,y,r*1.3,r,0,0,TAU);c.fill();c.fillStyle="rgba(230,190,150,0.18)";c.beginPath();c.ellipse(x,y+r*0.7,r*1.1,r*0.35,0,0,Math.PI);c.fill();}
  // the floor: packed earth, catching the light, with pellets dropped here and there
  g=c.createLinearGradient(0,F-30,0,H);g.addColorStop(0,rgba([168,124,92],1));g.addColorStop(0.25,rgba([150,110,82],1));g.addColorStop(1,rgba([110,78,58],1));c.fillStyle=g;
  c.beginPath();c.moveTo(0,F-10);for(let x=0;x<=W;x+=40)c.lineTo(x,F-10+Math.sin(x*0.01)*6+AG_NZ.n2(x*0.02,1)*10);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  ma_overlayTex(c,0,F-20,W,H-F+20,0.4);for(let i=0;i<40;i++){const x=R()*W,y=F+20+R()*(H-F-30),r=6+R()*6;ag_floorShadow(c,x-3,y+r*0.6,r*1.4,r*0.5,0.3);c.fillStyle=rgba(mix([118,86,62],[150,112,84],R()),1);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
    c.fillStyle="rgba(255,236,210,0.2)";c.beginPath();c.arc(x+r*0.3,y-r*0.3,r*0.45,0,TAU);c.fill();}
  // a soft light from a vent, up to the right
  g=c.createRadialGradient(1560,120,10,1560,120,700);g.addColorStop(0,"rgba(255,236,206,0.32)");g.addColorStop(1,"rgba(255,236,206,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(960,540,500,960,540,1200);g.addColorStop(0,"rgba(40,26,18,0)");g.addColorStop(1,"rgba(40,26,18,0.35)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// a pellet of mud, lit from the right
function ma_pellet(ctx,x,y,r,col){ctx.fillStyle=rgba(col||[132,96,70],1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,232,204,0.22)";ctx.beginPath();ctx.arc(x+r*0.3,y-r*0.32,r*0.5,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(40,26,18,0.18)";ctx.beginPath();ctx.arc(x-r*0.25,y+r*0.3,r*0.6,0,TAU);ctx.fill();}
/* the pillars, live: u 0..0.62 they rise, row on row of pellets; then their tops lean in and meet in a round arch (u 1). Each is a
   thick column of mud, three pellets across at the foot, two at the top; the newest pellets are darker, still wet. ma_pillarLine(u)
   gives each pillar's centre line from the floor up, and its tops */
const MA_PIL={x:[760,1160],h:500,r:200};
function ma_pillarLine(u){const F=MA_IN.floor,rise=clamp(u/0.62,0,1),lean=sstep(0.62,1,u),out=[];
  for(let s=0;s<2;s++){const x0=MA_PIL.x[s],dir=s?-1:1,hgt=40+rise*(MA_PIL.h-40),pts=[];for(let y=0;y<=hgt;y+=17)pts.push([x0+Math.sin(y*0.05+s*2)*3,F-12-y]);
    if(lean>0){const top=F-12-MA_PIL.h,cx=960,th=lean*Math.PI/2;for(let a=0.08;a<=th;a+=0.085)pts.push([cx-dir*MA_PIL.r*Math.cos(a),top-MA_PIL.r*Math.sin(a)]);}out.push(pts);}
  return out;}
function ma_pillars(ctx,u,t,scent){const P=ma_pillarLine(u),tops=P.map(p=>p[p.length-1]);
  if(scent>0)for(const p of tops){const r=170+Math.sin(t*1.7+p[0])*12,g=ctx.createRadialGradient(p[0],p[1],4,p[0],p[1],r);g.addColorStop(0,rgba(MA_GOLD,0.4*scent));g.addColorStop(1,rgba(MA_GOLD,0));ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,r*2,r*2);}
  P.forEach((pts,s)=>{ag_floorShadow(ctx,pts[0][0]-40,MA_IN.floor-4,90,14,0.4);const n=pts.length;
    for(let i=0;i<n;i++){const p=pts[i],q=pts[Math.min(n-1,i+1)],o=pts[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,k=i/(n-1||1),wide=lerp(96,62,Math.min(1,i/30)),
      m=wide>80?3:2,fresh=n-i<=3,wet=fresh?1-ag_in((t*0.6+i*0.37)%1,0,0.5)*0:0;
      for(let j=0;j<m;j++){const off=(j-(m-1)/2)*wide/m,jit=((i*7+j*13)%5-2)*1.2,col=fresh?[110,78,56]:mix([132,96,70],[150,112,84],((i*5+j*3)%7)/7);
        ma_pellet(ctx,p[0]+nx*(off+jit),p[1]+ny*(off+jit),wide/m*0.62+((i+j)%3),col);}}});
  return tops;}
/* a worker termite seen from the side, heading ang (0: right); s 1 is about 70 px long. Pale body, tan head, six legs that step */
function ma_termite(ctx,x,y,ang,s,o){o=o||{};const t=o.t||0,ph=o.ph||0;ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);
  const st=Math.sin(t*14+ph);ctx.strokeStyle=rgba([196,176,150],1);ctx.lineWidth=2.4;ctx.lineCap="round";
  for(let i=0;i<3;i++){const lx=-6+i*9,sw=(i%2?st:-st)*5;ctx.beginPath();ctx.moveTo(lx,2);ctx.lineTo(lx-4+sw,10);ctx.lineTo(lx-8+sw*1.4,16);ctx.stroke();}
  ctx.fillStyle=rgba([234,222,202],1);ctx.beginPath();ctx.ellipse(-24,0,22,12.5,0.04,0,TAU);ctx.fill();   // the abdomen
  ctx.strokeStyle="rgba(150,126,100,0.35)";ctx.lineWidth=1.4;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-36+i*8,-10);ctx.quadraticCurveTo(-34+i*8,0,-36+i*8,10);ctx.stroke();}
  ctx.fillStyle="rgba(255,250,240,0.35)";ctx.beginPath();ctx.ellipse(-20,-5,12,4,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([222,206,182],1);for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(-2+i*6,0,5,7,0,0,TAU);ctx.fill();}
  ctx.fillStyle=rgba([174,136,98],1);ctx.beginPath();ctx.ellipse(20,-1,10,8.5,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,240,220,0.3)";ctx.beginPath();ctx.ellipse(22,-4,5,3,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba([92,64,44],1);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(28,2);ctx.quadraticCurveTo(34,4,32,8);ctx.stroke();
  ctx.strokeStyle=rgba([170,140,108],1);ctx.lineWidth=1.6;const aw=Math.sin(t*6+ph)*3;ctx.beginPath();ctx.moveTo(24,-6);ctx.quadraticCurveTo(32,-16+aw,42,-14+aw);ctx.moveTo(22,-7);ctx.quadraticCurveTo(28,-20-aw,36,-22-aw);ctx.stroke();
  if(o.carry)ma_pellet(ctx,36,6,8);ctx.restore();}
/* the builders, live: workers walk in along the floor carrying pellets, climb a pillar's face, leave their pellet at the top and
   climb back down. a 0..1 how many are about */
function ma_builders(ctx,t,u,a){if(a<=0)return;const F=MA_IN.floor,P=ma_pillarLine(u);ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<10;i++){const s=i%2,pts=P[s],dir=s?1:-1,period=8+(i%3)*1.3,ph=(t/period+i*0.173)%1,x0=pts[0][0];
    const climb=pts.filter((p,k)=>k%3===0).map(p=>[p[0]+dir*6,p[1]]);const path=[[x0+dir*(1180+i*36),F+26+(i%4)*12],[x0+dir*70,F+8]].concat(climb);
    const up=ph<0.66,k=up?ph/0.66:1-(ph-0.66)/0.34,q=ma_along(path,ag_sine(k));ma_termite(ctx,q[0],q[1]-(q[1]>F-10?12:0),q[2]+(up?0:Math.PI),1.25,{t,ph:i,carry:up});}
  ctx.restore();}

/* ---------------------------------------------------------------- a laboratory, 1989: a nest, two bridges to food, seen from above */
const MA_ANT={nest:[290,560,170],food:[1650,560,130],fork:[560,560],join:[1380,560],short:[[560,560],[1380,560]],
  long:[[560,560],[650,186],[1290,186],[1380,560]]};
AG_PLACES.maAnts=c=>{const A=MA_ANT;let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba([226,224,218],1));g.addColorStop(1,rgba([236,234,228],1));c.fillStyle=g;c.fillRect(0,0,W,H);ma_grain(c,0,0,W,H,1.6,44);
  // the bridges: pale card, a little raised, with their soft shadow to the left
  const bridge=(P,w)=>{const S=ma_smooth(P,10);c.lineCap="round";c.lineJoin="round";c.beginPath();c.moveTo(S[0][0],S[0][1]);for(const p of S)c.lineTo(p[0],p[1]);c.lineWidth=w;c.stroke();};
  c.save();c.strokeStyle="rgba(60,50,40,0.16)";c.translate(-10,10);bridge([[A.nest[0]+150,A.nest[1]],A.fork],58);bridge(A.short,58);bridge(A.long,58);bridge([A.join,[A.food[0]-110,A.food[1]]],58);c.restore();
  c.strokeStyle=rgba([214,208,198],1);bridge([[A.nest[0]+150,A.nest[1]],A.fork],50);bridge(A.short,50);bridge(A.long,50);bridge([A.join,[A.food[0]-110,A.food[1]]],50);
  c.strokeStyle="rgba(255,255,255,0.35)";c.save();c.translate(3,-4);bridge(A.short,10);bridge(A.long,10);c.restore();
  // the nest: a round arena of soil; the food: a dish with a drop of sugar water
  const dish=(x,y,r,fill)=>{ma_shadowOf(c,k=>k.arc(x,y,r,0,TAU),"rgba(60,50,40,0.3)",24,-10,12);c.fillStyle=rgba([226,230,232],1);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
    c.fillStyle=rgba(fill,1);c.beginPath();c.arc(x,y,r-14,0,TAU);c.fill();c.strokeStyle="rgba(255,255,255,0.6)";c.lineWidth=3;c.beginPath();c.arc(x,y,r-4,-1.2,0.2);c.stroke();};
  dish(A.nest[0],A.nest[1],A.nest[2],[150,118,92]);ma_overlayTex(c,A.nest[0]-156,A.nest[1]-156,312,312,0.5);
  c.save();c.beginPath();c.arc(A.nest[0],A.nest[1],156,0,TAU);c.clip();const R=ag_rnd(3);for(let i=0;i<30;i++){const x=A.nest[0]+(R()-0.5)*280,y=A.nest[1]+(R()-0.5)*280;c.fillStyle=rgba([120,92,70],0.6);c.beginPath();c.arc(x,y,3+R()*5,0,TAU);c.fill();}
  c.fillStyle="rgba(60,40,28,0.7)";c.beginPath();c.ellipse(A.nest[0]+20,A.nest[1]+10,26,18,0,0,TAU);c.fill();c.restore();
  dish(A.food[0],A.food[1],A.food[2],[238,236,230]);g=c.createRadialGradient(A.food[0]+8,A.food[1]-8,4,A.food[0],A.food[1],60);g.addColorStop(0,"rgba(255,255,255,0.9)");g.addColorStop(0.5,"rgba(236,228,206,0.7)");g.addColorStop(1,"rgba(220,210,186,0.6)");
  c.fillStyle=g;c.beginPath();c.ellipse(A.food[0],A.food[1],62,52,0,0,TAU);c.fill();
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.08)");g.addColorStop(1,"rgba(255,248,236,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);};
/* an ant from above, heading ang; s 1 is about 34 px long; legs step with t */
function ma_ant(ctx,x,y,ang,s,t,ph){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);const st=Math.sin(t*16+(ph||0))*3;ctx.strokeStyle="rgba(58,42,34,0.9)";ctx.lineWidth=1.6;ctx.lineCap="round";
  for(let i=-1;i<=1;i++)for(const sd of [-1,1]){const sw=(i===0?-st:st)*sd;ctx.beginPath();ctx.moveTo(i*4,0);ctx.lineTo(i*5+sw,sd*8);ctx.lineTo(i*7+sw,sd*13);ctx.stroke();}
  ctx.fillStyle="rgba(62,44,36,1)";ctx.beginPath();ctx.ellipse(-10,0,8,5.5,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(0,0,5,3,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(9,0,4.5,4,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(12,-2);ctx.quadraticCurveTo(17,-6,20,-5);ctx.moveTo(12,2);ctx.quadraticCurveTo(17,6,20,5);ctx.stroke();ctx.fillStyle="rgba(255,240,220,0.3)";ctx.beginPath();ctx.ellipse(-8,-2,3.5,1.6,0,0,TAU);ctx.fill();ctx.restore();}
/* the ants, live: going out to the food and back, on both bridges at first, then most on the shorter (share: 0.5 even, 0.9 most on
   the short one); scent [short, long] 0..1: the faint gold trail each bridge has built up */
function ma_antsLive(ctx,t,share,scent){const A=MA_ANT,stem=[[A.nest[0]+120,A.nest[1]],A.fork],tail=[A.join,[A.food[0]-96,A.food[1]]];
  if(scent){[[A.short,scent[0]],[A.long,scent[1]]].forEach(([P,k])=>{if(k<=0)return;const S=ma_smooth(P,10);ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(S[0][0],S[0][1]);for(const p of S)ctx.lineTo(p[0],p[1]);
    ctx.strokeStyle=rgba(MA_GOLD,0.35*k);ctx.lineWidth=34;ctx.stroke();ctx.strokeStyle=rgba(MA_GOLD,0.4*k);ctx.lineWidth=12;ctx.stroke();ctx.restore();});}
  const R=ag_rnd(9);for(let i=0;i<44;i++){const r1=((i*0.618)%1),r2=i/44+R()*0.01,r3=i%2?0.7:0.2,onShort=r1<share,P=onShort?A.short:A.long,route=stem.concat(P.slice(1),tail.slice(1));
    const period=onShort?9:13,ph=(t/period+r2)%1,back=r3<0.5,u=back?1-ph:ph,p=ma_along(route,u),off=(R()-0.5)*18,nx=-Math.sin(p[2]),ny=Math.cos(p[2]);
    ma_ant(ctx,p[0]+nx*off,p[1]+ny*off,p[2]+(back?Math.PI:0),1,t,i);}}

/* ---------------------------------------------------------------- the sky over Rome at dusk: domes, towers and stone pines */
AG_PLACES.maRome=c=>{ma_sky(c,[128,146,172],[240,206,170],H,[1500,820,900,0.45],[[202,184,186],0.55]);
  for(const cl of [[400,300,360,22,2],[1300,220,420,26,8]])ma_blob(c,cl[0],cl[1],cl[2],cl[3],cl[4],0.5,"rgba(246,226,214,0.35)");
  const HZ=900,far=[150,140,160],near=[112,104,118];
  // far: low roofs and a dome in the haze
  c.fillStyle=rgba(far,1);c.beginPath();c.moveTo(0,H);c.lineTo(0,HZ-30);for(let x=0;x<=W;x+=60)c.lineTo(x,HZ-30-((x*7)%5)*8-(x%180<60?14:0));c.lineTo(W,H);c.closePath();c.fill();
  c.beginPath();c.ellipse(1460,HZ-60,90,74,0,Math.PI,TAU);c.fill();c.fillRect(1440,HZ-160,40,30);c.beginPath();c.moveTo(1452,HZ-160);c.lineTo(1460,HZ-196);c.lineTo(1468,HZ-160);c.fill();
  // near: rooftops, a dome with its drum and lantern, bell towers with small pyramid roofs, and the umbrella crowns of stone pines
  c.fillStyle=rgba(near,1);c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=40)c.lineTo(x,HZ+10-((x*13)%7)*6-(x%240<80?20:0));c.lineTo(W,H);c.closePath();c.fill();
  c.fillRect(470,HZ-110,180,120);c.beginPath();c.ellipse(560,HZ-110,110,100,0,Math.PI,TAU);c.fill();c.fillRect(538,HZ-236,44,32);c.beginPath();c.moveTo(534,HZ-236);c.lineTo(560,HZ-268);c.lineTo(586,HZ-236);c.fill();
  c.fillStyle="rgba(150,140,156,0.6)";for(let k=0;k<7;k++){c.beginPath();c.ellipse(490+k*23,HZ-104,6,12,0,Math.PI,TAU);c.fill();}c.fillStyle=rgba(near,1);
  for(const [x,h] of [[300,250],[1160,214]]){c.fillRect(x,HZ-h,48,h);c.beginPath();c.moveTo(x-5,HZ-h);c.lineTo(x+24,HZ-h-34);c.lineTo(x+53,HZ-h);c.fill();
    c.fillStyle="rgba(232,196,160,0.35)";for(const yy of [HZ-h+20,HZ-h+70]){c.beginPath();c.moveTo(x+12,yy+26);c.lineTo(x+12,yy+8);c.quadraticCurveTo(x+24,yy-4,x+36,yy+8);c.lineTo(x+36,yy+26);c.fill();}c.fillStyle=rgba(near,1);}
  for(const [x,y,s] of [[110,HZ-40,1],[820,HZ-30,1.2],[990,HZ-14,0.9],[1720,HZ-30,1.1],[1880,HZ-20,0.8]]){c.strokeStyle=rgba(near,1);c.lineWidth=7*s;c.beginPath();c.moveTo(x,y+70);c.quadraticCurveTo(x+6*s,y+20,x,y-16*s);c.stroke();
    ma_blob(c,x,y-26*s,104*s,26*s,x*0.01,0.28,rgba(near,1));ma_blob(c,x+10*s,y-34*s,74*s,16*s,x*0.02,0.3,rgba(ma_shade(near,1.06),1));}
  const RW=ag_rnd(55);for(let i=0;i<26;i++){const x=RW()*W,y=HZ+30+RW()*120;c.fillStyle="rgba(250,214,160,"+(0.3+RW()*0.4).toFixed(2)+")";c.fillRect(x,y,5,7);}
  const g=c.createLinearGradient(0,HZ-260,0,H);g.addColorStop(0,"rgba(240,206,170,0)");g.addColorStop(1,"rgba(80,74,92,0.25)");c.fillStyle=g;c.fillRect(0,HZ-260,W,H-HZ+260);};
/* the murmuration, live: thousands of starlings in one soft body that stretches, turns and folds; nobody leads it. o.n how many,
   o.cx, o.cy where it is, o.mark 0..1 rings one bird and draws lines to its seven nearest neighbours, o.a */
const MA_FLOCK=(()=>{const R=ag_rnd(2006),n=2600,P=[];for(let i=0;i<n;i++){const a=R()*TAU,r=Math.sqrt(R());P.push([Math.cos(a)*r,Math.sin(a)*r*0.6,R()*TAU]);}
  P[0]=[0.04,0.02,0];const d=P.map((p,i)=>[Math.hypot(p[0]-P[0][0],p[1]-P[0][1]),i]).sort((a,b)=>a[0]-b[0]).slice(1,8).map(x=>x[1]);return {P,near:d};})();
function ma_flockPos(p,t,o){const cx=o.cx||960,cy=o.cy||420,sc=o.scale||1,turn=Math.sin(t*0.23)*0.9+t*0.05,sx=430*sc*(1+0.25*Math.sin(t*0.31)),sy=190*sc*(1+0.35*Math.sin(t*0.43+1)),
  fold=0.55*Math.sin(t*0.37+0.6),u=p[0],v=p[1]+fold*u*u-0.18*Math.sin(t*0.5+u*2.4),ca=Math.cos(turn),sa=Math.sin(turn),x=u*sx,y=v*sy;
  return [cx+x*ca-y*sa*0.6+Math.sin(t*0.9+p[2])*3,cy+x*sa*0.4+y*ca+Math.cos(t*1.1+p[2])*3];}
function ma_flock(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const F=MA_FLOCK,n=Math.min(F.P.length,o.n||F.P.length);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgba(46,42,50,0.85)";
  // waves of darkness pass through the flock as birds bank together: each bird's shade follows a slow wave across it
  const B=[[],[],[],[],[]];for(let i=1;i<n;i++){const p=F.P[i],w=0.5+0.5*Math.sin(p[0]*6.5+p[1]*3.4-t*2.2)*Math.sin(p[0]*2.1-p[1]*5+t*0.9+1);B[Math.min(4,Math.floor(w*5))].push(i);}
  B.forEach((L,k)=>{ctx.fillStyle="rgba(46,42,50,"+(0.42+k*0.13).toFixed(2)+")";ctx.beginPath();for(const i of L){const q=ma_flockPos(F.P[i],t,o),fl=(Math.sin(t*18+F.P[i][2]*7)>0)?1:0.6,s=0.85+k*0.1;ctx.rect(q[0]-1.7*s,q[1]-1.1*fl*s,3.4*s,2.2*fl*s);}ctx.fill();});
  const m=o.mark||0,b=ma_flockPos(F.P[0],t,o);if(m>0){ctx.strokeStyle="rgba(250,246,238,"+(0.85*m)+")";ctx.lineWidth=2;for(const j of F.near){const q=ma_flockPos(F.P[j],t,o);ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();
    ctx.fillStyle="rgba(250,246,238,"+m+")";ctx.beginPath();ctx.arc(q[0],q[1],4,0,TAU);ctx.fill();}
    ctx.strokeStyle="rgba(250,246,238,"+m+")";ctx.lineWidth=3;ctx.beginPath();ctx.arc(b[0],b[1],14,0,TAU);ctx.stroke();}
  ctx.fillStyle="rgba(46,42,50,0.95)";ctx.fillRect(b[0]-2,b[1]-1.5,4.4,3);ctx.restore();return b;}

/* the lens, live: one bird of the flock, magnified in a round lens at (lx, ly), with the birds around it and lines to its seven
   nearest neighbours; a fine line runs from the lens to the bird in the flock. a 0..1 */
function ma_flockLens(ctx,t,o,a){if(a<=0)return;const F=MA_FLOCK,b=ma_flockPos(F.P[0],t,o),lx=o.lx||1500,ly=o.ly||330,R=o.lr||190,far=ma_flockPos(F.P[F.near[6]],t,o),
  k=R*0.62/Math.max(6,Math.hypot(far[0]-b[0],far[1]-b[1])),pop=ag_spr(a,0,0.6);ctx.save();ctx.globalAlpha*=clamp(a*1.4,0,1);
  ctx.strokeStyle="rgba(250,246,238,0.8)";ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(lx-(lx-b[0])*R/Math.hypot(lx-b[0],ly-b[1]),ly-(ly-b[1])*R/Math.hypot(lx-b[0],ly-b[1]));ctx.stroke();ctx.setLineDash([]);
  ctx.translate(lx,ly);ctx.scale(pop,pop);ctx.save();ctx.shadowColor="rgba(40,32,40,0.3)";ctx.shadowBlur=24;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=8;ctx.fillStyle="rgba(236,226,222,0.97)";ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(250,248,244,1)";ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();ctx.save();ctx.beginPath();ctx.arc(0,0,R-3,0,TAU);ctx.clip();
  const bird=(x,y,ang,dark)=>{ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=dark?"rgba(40,36,44,1)":"rgba(80,74,86,0.55)";ctx.beginPath();ctx.ellipse(0,0,8,3.4,0,0,TAU);ctx.fill();
    ctx.beginPath();ctx.moveTo(-1,0);ctx.lineTo(-6,-10);ctx.lineTo(3,-1);ctx.moveTo(-1,0);ctx.lineTo(-6,10);ctx.lineTo(3,1);ctx.fill();ctx.restore();};
  const head=Math.atan2(ma_flockPos(F.P[0],t+0.1,o)[1]-b[1],ma_flockPos(F.P[0],t+0.1,o)[0]-b[0]);
  for(let i=1;i<F.P.length;i++){const q=ma_flockPos(F.P[i],t,o),x=(q[0]-b[0])*k,y=(q[1]-b[1])*k;if(x*x+y*y>R*R||F.near.includes(i))continue;bird(x,y,head,false);}
  const m=sstep(0.3,1,a);for(const j of F.near){const q=ma_flockPos(F.P[j],t,o),x=(q[0]-b[0])*k,y=(q[1]-b[1])*k;ctx.strokeStyle="rgba(60,56,68,"+(0.7*m)+")";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(x,y);ctx.stroke();bird(x,y,head,true);}
  ctx.strokeStyle="rgba(60,56,68,0.9)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,20,0,TAU);ctx.stroke();bird(0,0,head,true);ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- neurons: a field of nerve cells, pale on a deep slate, their
   fibres running between them */
const MA_NEU=(()=>{const R=ag_rnd(86),N=[];for(let r=0;r<4;r++)for(let k=0;k<5;k++)N.push([200+k*380+(r%2)*150+(R()-0.5)*160,150+r*250+(R()-0.5)*90,20+R()*10,R()*TAU]);const L=[];
  N.forEach((p,i)=>{const d=N.map((q,j)=>[Math.hypot(q[0]-p[0],q[1]-p[1]),j]).filter(x=>x[1]!==i).sort((a,b)=>a[0]-b[0]);for(let k=0;k<2;k++){const j=d[k][1];if(!L.some(l=>(l[0]===j&&l[1]===i)))L.push([i,j,R()]);}});
  return {N,L};})();
function ma_fibre(i,j,bend){const p=MA_NEU.N[i],q=MA_NEU.N[j],mx=(p[0]+q[0])/2+(q[1]-p[1])*0.25*(bend-0.5),my=(p[1]+q[1])/2-(q[0]-p[0])*0.25*(bend-0.5);return ma_smooth([[p[0],p[1]],[mx,my],[q[0],q[1]]],14);}
AG_PLACES.maNeurons=c=>{let g=c.createRadialGradient(1100,420,100,960,540,1200);g.addColorStop(0,rgba([92,100,118],1));g.addColorStop(1,rgba([52,58,74],1));c.fillStyle=g;c.fillRect(0,0,W,H);ma_grain(c,0,0,W,H,2,61);
  const R=ag_rnd(5);
  // depth: fainter cells far behind
  for(let i=0;i<60;i++){const x=R()*W,y=R()*H,r=6+R()*10;c.fillStyle="rgba(170,184,204,0.08)";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.strokeStyle="rgba(170,184,204,0.06)";c.lineWidth=2;
    c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(R()-0.5)*160,y+(R()-0.5)*160,x+(R()-0.5)*260,y+(R()-0.5)*260);c.stroke();}
  // the fibres between cells, then each cell's branches, tapering, then the cell bodies, lit from the right
  c.lineCap="round";for(const [i,j,b] of MA_NEU.L){const S=ma_fibre(i,j,b);c.strokeStyle="rgba(196,206,222,0.32)";c.lineWidth=3.2;c.beginPath();c.moveTo(S[0][0],S[0][1]);for(const p of S)c.lineTo(p[0],p[1]);c.stroke();}
  for(const [x,y,r,a0] of MA_NEU.N){for(let k=0;k<6;k++){let a=a0+k*TAU/6+(R()-0.5)*0.6;const l=r*2.6+R()*r*2.4;let px=x,py=y,w=r*0.42;for(let s=0;s<6;s++){a+=(R()-0.5)*0.35;const nx=px+Math.cos(a)*l/6,ny=py+Math.sin(a)*l/6;
      c.strokeStyle="rgba(204,214,230,0.55)";c.lineWidth=w;c.beginPath();c.moveTo(px,py);c.lineTo(nx,ny);c.stroke();if(s===2){const b=a+(R()<0.5?0.7:-0.7);c.lineWidth=w*0.55;c.beginPath();c.moveTo(nx,ny);c.quadraticCurveTo(nx+Math.cos(b)*l/8,ny+Math.sin(b)*l/8,nx+Math.cos(b+0.2)*l/4,ny+Math.sin(b+0.2)*l/4);c.stroke();}px=nx;py=ny;w*=0.74;}}
    ag_soft(c,k=>{const B=ma_blobPts(x,y,r,r*0.86,a0,0.22,30);k.moveTo(B[0][0],B[0][1]);for(const p of B)k.lineTo(p[0],p[1]);k.closePath();},[196,206,222],[236,240,246],x+r*0.4,y-r*0.4,r*1.2,"rgba(30,36,52,0.35)",8,0.8);
    c.fillStyle="rgba(120,130,150,0.55)";c.beginPath();c.arc(x-r*0.1,y+r*0.05,r*0.32,0,TAU);c.fill();}
  g=c.createRadialGradient(960,540,520,960,540,1150);g.addColorStop(0,"rgba(20,24,36,0)");g.addColorStop(1,"rgba(20,24,36,0.4)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// signals, live: small bright pulses running along the fibres, each cell glowing a moment as one arrives
function ma_signals(ctx,t,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;MA_NEU.L.forEach(([i,j,b],k)=>{const S=ma_fibre(i,j,b),per=2.2+(k%5)*0.5,ph=((t+k*0.61)/per)%1,dirF=k%2===0;
  const idx=Math.floor((dirF?ph:1-ph)*(S.length-1)),p=S[idx];const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],20);g.addColorStop(0,"rgba(255,250,236,0.95)");g.addColorStop(1,"rgba(255,250,236,0)");
  ctx.fillStyle=g;ctx.fillRect(p[0]-20,p[1]-20,40,40);if(ph>0.9){const q=MA_NEU.N[dirF?j:i],gl=(ph-0.9)/0.1;const h=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],q[2]*2.4);h.addColorStop(0,"rgba(255,250,236,"+(0.5*(1-gl))+")");h.addColorStop(1,"rgba(255,250,236,0)");
    ctx.fillStyle=h;ctx.fillRect(q[0]-q[2]*2.4,q[1]-q[2]*2.4,q[2]*4.8,q[2]*4.8);}});ctx.restore();}

/* ===== Many agents, and what emerges: markets, and is it alive? =====
   The same matte style as places.js. The places: maTrading (a trading room, 6 May 2010, the day's index on the wall), maCell (a cell,
   drawn as a biology book would), maBristol (a floor near Bristol about 1950, with a robot tortoise's hutch) and maScope (a microscope's
   view). Live:
     ma_index(ctx, u, a)              the day's index drawn up to u (0..1 of the trading day), with the fall and the rebound
     ma_programs(ctx, t, o)           trading programs on the desks: a big seller, and fast programs passing contracts back and forth
     ma_cellLive(ctx, t, o)           the cell at work: parts made inside, worn parts of its skin replaced, food coming in
     ma_tortoise(ctx, x, y, ang, o)   the tortoise, a clear shell over its works, a light sensor on top; ma_tortoisePath its trip home
     ma_battery(ctx, x, y, level, o)  a small gauge, centred at (x, y): a battery filled to level (0..1) and the word "battery"
     ma_xeno(ctx, x, y, r, ang, o)    a tiny body of frog cells (o.c: C-shaped); ma_scopeLive the view at work */

/* ---------------------------------------------------------------- a trading room, 6 May 2010: the wall's big screen shows the day */
const MA_TR={chart:{x:560,y:70,w:1180,h:400},lo:-10,hi:1,desk:740};
AG_PLACES.maTrading=c=>{const C=MA_TR.chart;let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([150,156,166],1));g.addColorStop(1,rgba([126,130,140],1));c.fillStyle=g;c.fillRect(0,0,W,H);ma_grain(c,0,0,W,H,2,71);
  // the wall's panels, and the big screen on it
  c.strokeStyle="rgba(40,44,54,0.18)";c.lineWidth=3;for(let x=0;x<W;x+=320){c.beginPath();c.moveTo(x,0);c.lineTo(x,MA_TR.desk);c.stroke();}
  ma_shadowOf(c,k=>k.rect(C.x-24,C.y-24,C.w+48,C.h+48),"rgba(20,24,34,0.45)",36,AG.sdx*2,14);c.fillStyle=rgba([46,50,58],1);c.fillRect(C.x-24,C.y-24,C.w+48,C.h+48);
  c.fillStyle=rgba([236,236,232],1);c.fillRect(C.x,C.y,C.w,C.h);c.strokeStyle="rgba(110,120,134,0.2)";c.lineWidth=1.4;
  for(let v=MA_TR.lo;v<=MA_TR.hi;v++){const y=ma_indexY(v);c.beginPath();c.moveTo(C.x,y);c.lineTo(C.x+C.w,y);c.stroke();}
  for(let k=1;k<13;k++){const x=C.x+C.w*k/13;c.beginPath();c.moveTo(x,C.y);c.lineTo(x,C.y+C.h);c.stroke();}
  c.strokeStyle="rgba(60,66,78,0.55)";c.lineWidth=2;c.setLineDash([8,8]);c.beginPath();c.moveTo(C.x,ma_indexY(0));c.lineTo(C.x+C.w,ma_indexY(0));c.stroke();c.setLineDash([]);
  g=c.createLinearGradient(0,C.y,0,C.y+C.h);g.addColorStop(0,"rgba(255,255,255,0.22)");g.addColorStop(0.35,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(C.x,C.y,C.w,C.h);
  // the desks in front: a long row of monitors seen from behind, their stands, the desk's edge
  const D=MA_TR.desk;g=c.createLinearGradient(0,D,0,H);g.addColorStop(0,rgba([96,92,90],1));g.addColorStop(1,rgba([70,68,68],1));c.fillStyle=g;c.fillRect(0,D+150,W,H-D-150);
  c.fillStyle=rgba([150,144,136],1);c.fillRect(0,D+136,W,24);c.fillStyle="rgba(255,250,240,0.25)";c.fillRect(0,D+136,W,3);
  for(let k=0;k<8;k++){const x=40+k*240,w=200,h=130;c.fillStyle=rgba([58,60,66],1);rr(c,x,D,w,h,8);c.fill();c.fillStyle="rgba(255,255,255,0.08)";c.fillRect(x+w-14,D+6,8,h-12);
    c.fillStyle=rgba([70,72,78],1);c.fillRect(x+w/2-12,D+h,24,10);c.fillRect(x+w/2-40,D+h+6,80,6);}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,30,40,0.12)");g.addColorStop(1,"rgba(255,248,236,0.06)");c.fillStyle=g;c.fillRect(0,0,W,H);};
function ma_indexY(v){const C=MA_TR.chart;return C.y+C.h*(MA_TR.hi-v)/(MA_TR.hi-MA_TR.lo);}
// the day's index against the day before's close, in percent, at x (0: the opening bell, 1: the close): a slide, a fall of another
// five to six percent in minutes, a rebound almost as fast
function ma_indexV(x){const n=Math.sin(x*61)*0.18+Math.sin(x*23+1)*0.25,base=-4.2*sstep(0,0.8,x)*(0.55+0.45*x)+n*(1-sstep(0.78,0.8,x));
  if(x<0.8)return base;if(x<0.815)return lerp(base,-9.4,sstep(0.8,0.815,x));if(x<0.86)return lerp(-9.4,-5.2,sstep(0.815,0.86,x));return lerp(-5.2,-3.3,sstep(0.86,1,x))+Math.sin(x*80)*0.15;}
function ma_index(ctx,u,a){a=a==null?1:a;if(a<=0||u<=0)return;const C=MA_TR.chart,n=Math.floor(clamp(u,0,1)*400);ctx.save();ctx.globalAlpha*=a;ctx.lineJoin="round";ctx.lineCap="round";
  ctx.strokeStyle="#2F3238";ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<=n;i++){const x=i/400;ctx.lineTo(C.x+C.w*x,ma_indexY(ma_indexV(x)));}ctx.stroke();
  const x=n/400,px=C.x+C.w*x,py=ma_indexY(ma_indexV(x));ctx.fillStyle="#2F3238";ctx.beginPath();ctx.arc(px,py,7,0,TAU);ctx.fill();ctx.restore();return [px,py];}
/* the programs on the desks, live: the big seller on the left, selling whatever the price; six fast programs passing contracts back
   and forth like a hot potato (heat 0..1: how fast). o.seller, o.fast: 0..1 how much each shows */
function ma_programs(ctx,t,o){o=o||{};const D=MA_TR.desk,y=D-150,sa=o.seller||0,fa=o.fast||0,heat=o.heat||0;
  const box=(x,w,label,a,glow)=>{if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(20,24,34,0.35)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=8;
    ctx.fillStyle="rgba(236,236,232,0.97)";rr(ctx,x,y,w,88,14);ctx.fill();ctx.restore();ctx.strokeStyle=rgba([86,92,104],0.5+0.5*glow);ctx.lineWidth=2+glow*2;rr(ctx,x,y,w,88,14);ctx.stroke();
    ag_T(ctx,label,x+w/2,y+57,{w:700,size:30,align:"center",col:AG.ink});ctx.restore();};
  box(56,388,"sell, whatever the price",sa,0.4+0.4*Math.sin(t*6));
  const X=[480,700,920,1140,1360,1580];X.forEach((x,i)=>box(x,180,"program",fa*ag_in(fa,i*0.08,0.3),heat*0.5*(1+Math.sin(t*9+i))));
  if(fa>0.6&&heat>0){const n=Math.floor(4+heat*10);for(let k=0;k<n;k++){const sp=0.9+heat*2.6,ph=(t*sp+k*0.37)%1,i=(k*3+Math.floor(t*sp+k*0.37))%5,a=X[i]+90,b=X[i+1]+90,
      x=lerp(a,b,ph),yy=y-22-Math.sin(Math.PI*ph)*44;ctx.fillStyle=rgba([226,222,214],1);ctx.strokeStyle=rgba([70,76,88],0.9);ctx.lineWidth=2;rr(ctx,x-22,yy-14,44,28,6);ctx.fill();ctx.stroke();
      ctx.fillStyle=rgba([70,76,88],0.8);ctx.fillRect(x-12,yy-4,24,3);ctx.fillRect(x-12,yy+3,16,3);}}
  if(sa>0.5){const n=3;for(let k=0;k<n;k++){const ph=(t*0.7+k/n)%1,x=lerp(410,560,ph),yy=y-16-Math.sin(Math.PI*ph)*54;ctx.save();ctx.globalAlpha*=sa*(1-ph*0.3);ctx.fillStyle=rgba([226,222,214],1);ctx.strokeStyle=rgba([70,76,88],0.9);
    ctx.lineWidth=2;rr(ctx,x-22,yy-14,44,28,6);ctx.fill();ctx.stroke();ctx.restore();}}}

/* ---------------------------------------------------------------- a cell, as a biology book draws it: a skin of small parts round
   a soft inside, where more parts are made */
const MA_CELL={cx:960,cy:560,r:370,n:76};
AG_PLACES.maCell=c=>{let g=c.createRadialGradient(1300,260,80,960,540,1200);g.addColorStop(0,rgba([238,234,226],1));g.addColorStop(1,rgba([214,210,204],1));c.fillStyle=g;c.fillRect(0,0,W,H);ma_grain(c,0,0,W,H,1.8,23);
  const R=ag_rnd(72);for(let i=0;i<40;i++){const x=R()*W,y=R()*H;if(Math.hypot(x-MA_CELL.cx,y-MA_CELL.cy)<MA_CELL.r+60)continue;c.fillStyle="rgba(150,140,128,0.25)";c.beginPath();c.arc(x,y,3+R()*4,0,TAU);c.fill();}
  const C=MA_CELL;ma_shadowOf(c,k=>k.arc(C.cx,C.cy,C.r+16,0,TAU),"rgba(90,76,64,0.3)",40,AG.sdx*2,16);
  g=c.createRadialGradient(C.cx+90,C.cy-90,20,C.cx,C.cy,C.r+10);g.addColorStop(0,rgba([248,244,236],1));g.addColorStop(1,rgba([230,222,210],1));c.fillStyle=g;c.beginPath();c.arc(C.cx,C.cy,C.r,0,TAU);c.fill();
  // inside: a soft centre where parts are made, and threads of the cell's machinery
  ag_soft(c,k=>{const B=ma_blobPts(C.cx-30,C.cy+20,96,80,4,0.16,40);k.moveTo(B[0][0],B[0][1]);for(const p of B)k.lineTo(p[0],p[1]);k.closePath();},[216,204,190],[236,228,216],C.cx,C.cy-20,90,"rgba(110,90,70,0.25)",12,0.6);
  for(let i=0;i<6;i++){const a=i*1.05+0.3,r0=200+(i%2)*50,x=C.cx+Math.cos(a)*r0,y=C.cy+Math.sin(a)*r0;ag_soft(c,k=>k.ellipse(x,y,40,22,a,0,TAU),[220,206,190],[240,232,220],x+8,y-8,40,"rgba(110,90,70,0.25)",8,0.6);
    c.strokeStyle="rgba(160,136,112,0.35)";c.lineWidth=2;for(let j=-1;j<=1;j++){c.beginPath();c.ellipse(x,y,30,12+j*4,a,0.3,Math.PI-0.3);c.stroke();}}
  c.strokeStyle="rgba(170,150,130,0.3)";c.lineWidth=3;for(let i=0;i<9;i++){const a=R()*TAU,r0=120+R()*60;c.beginPath();c.moveTo(C.cx+Math.cos(a)*r0,C.cy+Math.sin(a)*r0);
    c.quadraticCurveTo(C.cx+Math.cos(a+0.4)*(r0+40),C.cy+Math.sin(a+0.4)*(r0+40),C.cx+Math.cos(a+0.8)*(r0-10),C.cy+Math.sin(a+0.8)*(r0-10));c.stroke();}};
// a part of the cell's skin at angle a: a small rounded bead, lit from the upper right
function ma_bead(ctx,x,y,r,a,k){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=rgba(mix([188,156,128],[236,226,212],k||0),1);ctx.beginPath();ctx.ellipse(0,0,r*0.9,r*1.25,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(255,250,240,0.4)";ctx.beginPath();ctx.ellipse(-r*0.25,-r*0.3,r*0.35,r*0.5,0,0,TAU);ctx.fill();ctx.restore();}
/* the cell at work, live: food comes in through the skin; inside, parts are made; now and then a part of the skin wears and fades,
   and a new one, made inside, travels out and takes its place. a 0..1; work 0..1 how busy */
function ma_cellLive(ctx,t,o){o=o||{};const C=MA_CELL,a=o.a==null?1:o.a,work=o.work==null?1:o.work;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const per=3.2,cyc=Math.floor(t/per),ph=(t%per)/per,slot=(cyc*29)%C.n;
  for(let i=0;i<C.n;i++){const an=i/C.n*TAU,x=C.cx+Math.cos(an)*C.r,y=C.cy+Math.sin(an)*C.r;let k=0,s=1;
    if(i===slot&&work>0){if(ph<0.4){k=sstep(0,0.4,ph);s=1-0.35*sstep(0.2,0.4,ph);}else if(ph<0.5){s=0;}else continue;}ma_bead(ctx,x,y,19*s,an,k);}
  if(work>0){const an=slot/C.n*TAU,tx=C.cx+Math.cos(an)*C.r,ty=C.cy+Math.sin(an)*C.r;if(ph>=0.4){const u=sstep(0.4,1,ph),x=lerp(C.cx-30,tx,u),y=lerp(C.cy+20,ty,u);ma_bead(ctx,x,y,19,an*u,0);}}
  const R=ag_rnd(11);for(let i=0;i<26;i++){const a0=R()*TAU,sp=0.2+R()*0.4,r0=40+R()*200,an=a0+t*sp*(i%2?1:-1),x=C.cx+Math.cos(an)*r0,y=C.cy+Math.sin(an)*r0*0.9;ctx.fillStyle="rgba(150,128,106,0.6)";ctx.beginPath();ctx.arc(x,y,4+(i%3)*1.5,0,TAU);ctx.fill();}
  for(let i=0;i<5;i++){const an=i*1.3+0.4,ph2=((t*0.25+i*0.21)%1),r=lerp(C.r+150,C.r-60,ph2),x=C.cx+Math.cos(an)*r,y=C.cy+Math.sin(an)*r;ctx.fillStyle="rgba(130,120,108,"+(0.7*(1-sstep(0.85,1,ph2)))+")";ctx.beginPath();ctx.arc(x,y,5,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- near Bristol, about 1950: a parquet floor, seen from above at a
   slant, and at the right the tortoise's hutch, a lamp glowing inside it */
const MA_BR={hutch:[1560,520]};
AG_PLACES.maBristol=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([150,116,84],1));g.addColorStop(1,rgba([176,138,102],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // parquet: herringbone blocks in a few tones
  const R=ag_rnd(1950);for(let y=-40;y<H+40;y+=30)for(let x=-60;x<W+60;x+=60){const o=(Math.floor(y/30)%2)*30,tone=mix([162,126,92],[176,140,102],R());c.fillStyle=rgba(tone,1);c.save();c.translate(x+o,y);c.rotate(0.785*((Math.floor(x/60)+Math.floor(y/30))%2?1:-1));c.fillRect(-30,-7.5,60,15);
    c.fillStyle="rgba(60,40,24,0.12)";c.fillRect(-30,6,60,1.5);c.restore();}
  ma_grain(c,0,0,W,H,2.4,52);g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,26,16,0.25)");g.addColorStop(1,"rgba(255,240,214,0.05)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the hutch: a wooden box, open in front, a lamp inside lighting the floor before it
  const [hx,hy]=MA_BR.hutch;g=c.createRadialGradient(hx-120,hy+90,10,hx-120,hy+90,520);g.addColorStop(0,"rgba(255,236,190,0.55)");g.addColorStop(1,"rgba(255,236,190,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  ma_shadowOf(c,k=>k.rect(hx-110,hy-140,330,260),"rgba(40,26,16,0.5)",30,-20,16);
  c.fillStyle=rgba([126,96,70],1);c.beginPath();c.moveTo(hx-110,hy-140);c.lineTo(hx+220,hy-140);c.lineTo(hx+220,hy+120);c.lineTo(hx-110,hy+120);c.closePath();c.fill();
  c.fillStyle=rgba([104,78,58],1);c.beginPath();c.moveTo(hx-110,hy-140);c.lineTo(hx-150,hy-110);c.lineTo(hx-150,hy+150);c.lineTo(hx-110,hy+120);c.closePath();c.fill();
  c.fillStyle=rgba([140,108,80],1);c.beginPath();c.moveTo(hx-150,hy-110);c.lineTo(hx+180,hy-110);c.lineTo(hx+220,hy-140);c.lineTo(hx-110,hy-140);c.closePath();c.fill();
  c.fillStyle=rgba([60,44,34],1);c.fillRect(hx-110,hy-60,230,180);
  g=c.createRadialGradient(hx+10,hy+10,6,hx+10,hy+10,140);g.addColorStop(0,"rgba(255,244,214,1)");g.addColorStop(0.2,"rgba(255,228,170,0.8)");g.addColorStop(1,"rgba(255,228,170,0)");c.fillStyle=g;c.fillRect(hx-110,hy-60,230,180);
  c.fillStyle=rgba([180,170,150],1);c.fillRect(hx-60,hy+96,130,10);c.fillStyle="rgba(255,250,236,0.5)";c.fillRect(hx-60,hy+96,130,3);};
/* the tortoise at (x, y), heading ang (0: right), from above at a slant: a clear shell over its works (two cells of battery, a motor),
   three wheels, and on top a light sensor in a small tube that turns as it looks about. o.t, o.look, o.charge 0..1 (a glow) */
function ma_tortoise(ctx,x,y,ang,o){o=o||{};const t=o.t||0,s=o.s||1.35;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ag_floorShadow(ctx,-16,40,150,44,0.4);
  const fx=Math.cos(ang),fy=Math.sin(ang)*0.5;
  ctx.fillStyle=rgba([40,40,44],1);for(const [wx,wy] of [[fx*90,fy*90+34],[-fy*110-fx*60,fx*50-fy*30+34],[fy*110-fx*60,-fx*50-fy*30+34]]){ctx.beginPath();ctx.ellipse(wx,wy,18,12,0,0,TAU);ctx.fill();}
  ctx.fillStyle=rgba([150,150,146],1);ctx.beginPath();ctx.ellipse(0,26,128,58,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.2)";ctx.beginPath();ctx.ellipse(10,18,120,48,0,Math.PI*1.1,TAU*0.98);ctx.fill();
  // the works under the shell
  ctx.fillStyle=rgba([84,76,70],1);rr(ctx,-62+fx*8,-10+fy*8,48,40,8);ctx.fill();rr(ctx,-6+fx*8,-10+fy*8,48,40,8);ctx.fill();ctx.fillStyle="rgba(255,240,214,0.25)";ctx.fillRect(-54+fx*8,-6+fy*8,8,32);ctx.fillRect(2+fx*8,-6+fy*8,8,32);
  ctx.fillStyle=rgba([120,104,86],1);ctx.beginPath();ctx.arc(60+fx*10,8+fy*10,20,0,TAU);ctx.fill();ctx.strokeStyle=rgba([196,150,96],0.8);ctx.lineWidth=2;for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(60+fx*10,8+fy*10,8+k*3,0,TAU);ctx.stroke();}
  // the clear shell: a dome with a bright rim of light along its top and a soft reflection
  const dome=k=>{k.moveTo(-120,18);k.bezierCurveTo(-122,-78,122,-78,120,18);k.ellipse(0,18,120,52,0,0,Math.PI);k.closePath();};ctx.beginPath();dome(ctx);ctx.fillStyle="rgba(214,226,234,0.32)";ctx.fill();
  const dg=ctx.createLinearGradient(-120,-60,120,30);dg.addColorStop(0,"rgba(255,255,255,0.05)");dg.addColorStop(0.7,"rgba(255,255,255,0.18)");dg.addColorStop(1,"rgba(255,255,255,0.35)");ctx.fillStyle=dg;ctx.fill();
  ctx.strokeStyle="rgba(150,160,170,0.55)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-120,18);ctx.bezierCurveTo(-122,-78,122,-78,120,18);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-104,-6);ctx.bezierCurveTo(-90,-52,40,-62,96,-24);ctx.stroke();ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(30,-44);ctx.quadraticCurveTo(70,-40,92,-18);ctx.stroke();
  ctx.strokeStyle="rgba(120,130,140,0.4)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,18,120,52,0,0,TAU);ctx.stroke();
  // the light sensor: a tube on a post, turning to look about
  const lk=o.look==null?Math.sin(t*2.2)*1.2:o.look;ctx.fillStyle=rgba([70,70,74],1);ctx.fillRect(-5,-86,10,40);ctx.save();ctx.translate(0,-92);ctx.rotate(lk);ctx.fillStyle=rgba([96,96,100],1);rr(ctx,-10,-12,40,24,6);ctx.fill();
  ctx.fillStyle=rgba([236,226,190],0.9);ctx.beginPath();ctx.ellipse(30,0,5,10,0,0,TAU);ctx.fill();ctx.restore();
  if(o.charge>0){const g=ctx.createRadialGradient(-10,10,4,-10,10,120);g.addColorStop(0,"rgba(255,236,190,"+(0.5*o.charge)+")");g.addColorStop(1,"rgba(255,236,190,0)");ctx.fillStyle=g;ctx.fillRect(-130,-110,260,240);}
  ctx.restore();}
// its trip, at time k (0..1): wandering on the floor, then, battery low, it turns to the hutch's light and goes in; returns [x, y, ang]
const MA_TRIP=[[260,820],[520,700],[700,820],[920,640],[860,460],[1060,380],[1280,470],[1420,560]];
function ma_tortoisePath(k){const S=ma_smooth(MA_TRIP,16),p=ma_along(S,clamp(k,0,1));return [p[0],p[1],p[2]];}
// the tortoise's battery: a pale card with a battery filled to level, in o.col (a neutral grey by default), and the word; o.a
function ma_battery(ctx,x,y,level,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const f={w:600,size:28},tw=ag_tw(ctx,"battery",f),w=24+64+16+tw+28,h=56,x0=x-w/2,y0=y-h/2,col=o.col||[92,94,100];
  ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x0,y0,w,h,h/2,{});const bx=x0+24,by=y-15;ctx.strokeStyle=rgba(AG.ink,0.8);ctx.lineWidth=3;rr(ctx,bx,by,58,30,6);ctx.stroke();
  ctx.fillStyle=rgba(AG.ink,0.8);rr(ctx,bx+59,by+9,6,12,2);ctx.fill();const lv=clamp(level,0,1);if(lv>0.01){ctx.fillStyle=rgba(col,1);rr(ctx,bx+5,by+5,48*lv,20,3);ctx.fill();}
  ag_T(ctx,"battery",bx+64+16,y+10,f);ctx.restore();}

/* ---------------------------------------------------------------- a microscope's view: a bright round field in the dark eyepiece */
const MA_SC={cx:960,cy:540,r:470};
AG_PLACES.maScope=c=>{c.fillStyle=rgba([34,34,38],1);c.fillRect(0,0,W,H);const S=MA_SC;
  let g=c.createRadialGradient(S.cx+60,S.cy-60,20,S.cx,S.cy,S.r);g.addColorStop(0,rgba([246,242,232],1));g.addColorStop(0.8,rgba([232,226,212],1));g.addColorStop(1,rgba([206,198,184],1));c.fillStyle=g;c.beginPath();c.arc(S.cx,S.cy,S.r,0,TAU);c.fill();
  c.save();c.beginPath();c.arc(S.cx,S.cy,S.r,0,TAU);c.clip();ma_grain(c,S.cx-S.r,S.cy-S.r,S.r*2,S.r*2,2,88);const R=ag_rnd(21);for(let i=0;i<30;i++){const x=S.cx+(R()-0.5)*2*S.r,y=S.cy+(R()-0.5)*2*S.r;c.fillStyle="rgba(170,160,146,0.25)";c.beginPath();c.arc(x,y,2+R()*5,0,TAU);c.fill();}
  g=c.createRadialGradient(S.cx,S.cy,S.r*0.7,S.cx,S.cy,S.r);g.addColorStop(0,"rgba(30,30,34,0)");g.addColorStop(1,"rgba(30,30,34,0.45)");c.fillStyle=g;c.fillRect(S.cx-S.r,S.cy-S.r,S.r*2,S.r*2);c.restore();
  c.strokeStyle="rgba(20,20,24,0.9)";c.lineWidth=16;c.beginPath();c.arc(S.cx,S.cy,S.r+6,0,TAU);c.stroke();};
/* a xenobot: a tiny body of frog skin and heart cells, a soft rounded lump, lit from the upper right, its cells showing as small
   bumps; o.c: C-shaped, open on its front, as the ones that gathered cells; o.cut 0..1 a notch, healing as it falls to 0 */
function ma_xeno(ctx,x,y,r,ang,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(ang);const sh=k=>{if(o.c){k.moveTo(r*0.9,-r*0.34);k.bezierCurveTo(r*0.4,-r*1.1,-r*1.1,-r*0.9,-r*1.0,0);
      k.bezierCurveTo(-r*1.1,r*0.9,r*0.4,r*1.1,r*0.9,r*0.34);k.bezierCurveTo(r*0.2,r*0.4,r*0.2,-r*0.4,r*0.9,-r*0.34);k.closePath();}
    else{const cut=o.cut||0;k.moveTo(r,0);for(let a=0.1;a<=TAU+0.01;a+=0.1){const notch=cut*Math.exp(-Math.pow((a-1.0)/0.25,2))*r*0.5,rr0=r*(1+0.08*Math.sin(a*3+1))-notch;k.lineTo(Math.cos(a)*rr0,Math.sin(a)*rr0*0.86);}k.closePath();}};
  ag_soft(ctx,sh,[214,176,156],[238,214,198],r*0.3,-r*0.4,r*1.1,"rgba(120,80,60,0.35)",r*0.25,0.7);
  ctx.save();ctx.beginPath();sh(ctx);ctx.clip();ctx.fillStyle="rgba(150,104,86,0.18)";const R=ag_rnd(5);for(let i=0;i<26;i++){ctx.beginPath();ctx.arc((R()-0.5)*2*r,(R()-0.5)*2*r,r*0.12+R()*r*0.06,0,TAU);ctx.fill();}ctx.restore();
  ctx.strokeStyle="rgba(170,130,110,0.5)";ctx.lineWidth=1.4;for(let a=0;a<TAU;a+=0.3){const ex=Math.cos(a)*r*1.02,ey=Math.sin(a)*r*0.88,w=Math.sin((o.t||0)*20+a*5)*4;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex+Math.cos(a)*6+w,ey+Math.sin(a)*6);ctx.stroke();}
  ctx.restore();}
// a loose cell: a small pale sphere
function ma_looseCell(ctx,x,y,r){ctx.fillStyle=rgba([222,194,176],1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,248,240,0.5)";ctx.beginPath();ctx.arc(x+r*0.3,y-r*0.3,r*0.4,0,TAU);ctx.fill();}
/* the bodies swimming, each round its own small loop in its own part of the view: [centre x, centre y, size, loop radius, speed, phase];
   ma_swimAt(i, t) is where body i is and which way it heads */
const MA_SWIM=[[800,470,120,60,0.32,0],[1150,330,92,46,-0.4,1.4],[1130,740,82,52,0.36,3.1]];
function ma_swimAt(i,t){const [cx,cy,r,R,sp,ph]=MA_SWIM[i],a=ph+t*sp;return [cx+Math.cos(a)*R,cy+Math.sin(a)*R*0.7,a+(sp>0?Math.PI/2:-Math.PI/2)];}
/* the view at work, live. mode 0: bodies swimming, one cut (o.cut 0..1, the notch; it heals as cut falls back to 0); mode 1:
   C-shaped bodies sweeping loose cells into piles, one pile rounding into a new body (grow 0..1) */
function ma_scopeLive(ctx,t,o){o=o||{};const S=MA_SC;ctx.save();ctx.beginPath();ctx.arc(S.cx,S.cy,S.r-4,0,TAU);ctx.clip();
  if(!o.mode){MA_SWIM.forEach((b,i)=>{const p=ma_swimAt(i,t);ma_xeno(ctx,p[0],p[1],b[2],p[2],{t,cut:i===0?(o.cut||0):0});});}
  else{const R=ag_rnd(4);for(let i=0;i<90;i++){const x=S.cx+(R()-0.5)*820,y=S.cy+(R()-0.5)*820,swept=R()<0.5&&o.grow>0;if(Math.hypot(x-S.cx,y-S.cy)>S.r-20)continue;
      const tx=S.cx+150+(R()-0.5)*60,ty=S.cy+60+(R()-0.5)*60,k=swept?sstep(0,0.7,o.grow):0;ma_looseCell(ctx,lerp(x,tx,k),lerp(y,ty,k),8);}
    ma_xeno(ctx,S.cx-120+Math.cos(t*0.3)*60,S.cy-80+Math.sin(t*0.4)*40,110,0.4+t*0.08,{t,c:true});ma_xeno(ctx,S.cx+260-Math.sin(t*0.25)*50,S.cy-200,90,2.6-t*0.06,{t,c:true});
    if(o.grow>0.6)ma_xeno(ctx,S.cx+150,S.cy+60,44*sstep(0.6,1,o.grow)+8,0,{t});}
  ctx.restore();}

/* ===== Many agents, and what emerges: the university's pieces =====
   Drawn in the marble-and-oak room with the series' shared pieces (ag_). Colours keep the series' meanings: blue the platform and its
   tools (the table of counts, its gear, the lock, the test), violet the agents' thinking, orange where a finding came from, green a
   check that passes or a person's approval, amber a check that fails. Words are drawn live with ag_T, at least 28 px.
     ma_facCard(ctx, x, y, i, o)     a faculty's card: its name, its census count, its change on last year (MA_FAC[i])
     ma_papers(ctx, x, y, n, t, o)   a pile of notes and emails, n of them, landing one by one
     ma_calendar(ctx, x, y, day, a)  a desk calendar showing day "day" of fourteen
     ma_agent(ctx, x, y, r, t, o)    an agent sphere with a slight delay and settle of its own (o.at, o.from); o.ring a green ring
                                     (the checking agent), o.lock a small blue lock (read only)
     ma_table(ctx, x, y, o)          the platform's table of counts, in blue, with its gear: the same way every time
     ma_board(ctx, x, y, w, h, a)    the shared board on the marble wall; ma_pin(ctx, x, y, w, words, o) a card pinned to it, with an
                                     orange source chip
     ma_status, ma_stamp, ma_strike, ma_test, ma_bars, ma_meter, ma_range, ma_switch, ma_clock, ma_tile: see each */

const MA_FAC=[["Arts and Education",4236,134],["Business",6018,157],["Engineering and IT",5247,181],["Health",2880,-49]];
const ma_n=n=>String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g,",");
const ma_sgn=n=>(n<0?"−":"+")+ma_n(n);

/* a card that springs in from its centre: k 0..1 (ag_spr), a */
function ma_sprung(ctx,x,y,k,a,draw){if(a<=0||k<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.6,1,k));draw();ctx.restore();}
/* a faculty's card: name, count, change; 330 wide by 166 tall from (x, y); o.a, o.k, o.edge, o.hi (a soft lift) */
function ma_facCard(ctx,x,y,i,o){o=o||{};const f=MA_FAC[i],w=o.w||330,h=166,a=o.a==null?1:o.a,k=o.k==null?1:o.k;if(a<=0)return;
  ma_sprung(ctx,x+w/2,y+h/2,k,a,()=>{ag_box(ctx,x,y,w,h,20,{edge:o.edge,edgeA:0.8});ag_T(ctx,f[0],x+24,y+46,{w:700,size:30});
    ag_T(ctx,ma_n(f[1]),x+24,y+102,{w:800,size:44});if(o.change!==false)ag_T(ctx,ma_sgn(f[2])+" on last year",x+24,y+144,{w:500,size:28,col:AG.mut});});}
/* a pile of notes and emails beside a card: n papers land one by one from t0, each tipped a little; o.a; o.take (0..1) carries the
   sheets one after another to o.to ([x, y]), shrinking, as an agent reads them */
function ma_papers(ctx,x,y,n,t,o){o=o||{};const a=o.a==null?1:o.a,t0=o.t0||0,take=o.take||0,to=o.to||[x,y];if(a<=0)return;const R=ag_rnd(o.seed||(x|0));ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){const st=t0+i*(o.gap||0.18),u=ag_spr(t,st,0.45),rot=(R()-0.5)*0.5,dx=(R()-0.5)*40,dy=-i*7,email=i%3===1;if(u<=0)continue;
    const g=ag_sine(clamp(take*1.7-(n-1-i)*0.12,0,1));if(g>=1)continue;
    ctx.save();ctx.globalAlpha*=1-sstep(0.6,1,g);ctx.translate(lerp(x+dx,to[0],g),lerp(y+dy-(1-Math.min(1,u))*40,to[1],g)-Math.sin(Math.PI*g)*60);ctx.rotate(rot*(1-g));ctx.scale(1-0.75*g,1-0.75*g);
    ctx.save();ctx.shadowColor="rgba(46,38,28,0.2)";ctx.shadowBlur=8;ctx.shadowOffsetX=-2;ctx.shadowOffsetY=3;
    ctx.fillStyle=email?"#F4F3F0":"#F1EBDA";ctx.fillRect(-38,-48,76,96);ctx.restore();
    if(email){ctx.fillStyle="rgba(60,70,80,0.18)";ctx.fillRect(-38,-48,76,18);ctx.strokeStyle="rgba(60,70,80,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-30,-44);ctx.lineTo(0,-34);ctx.lineTo(30,-44);ctx.stroke();}
    ctx.strokeStyle="rgba(70,70,76,0.35)";ctx.lineWidth=2.4;for(let l=0;l<5;l++){const ly=-24+l*13,lw=40+((i*7+l*11)%22);ctx.beginPath();ctx.moveTo(-28,ly);ctx.lineTo(-28+lw,ly);ctx.stroke();}ctx.restore();}
  ctx.restore();}
/* a draft an agent wrote: a small card, "DRAFT" in violet over two grey lines of words, w wide and 120 tall; k springs it in */
function ma_draft(ctx,x,y,w,a,k){if(a<=0)return;ma_sprung(ctx,x+w/2,y+60,k==null?1:k,a,()=>{ag_box(ctx,x,y,w,120,16,{edge:AG.violet,edgeA:0.6});ag_T(ctx,"DRAFT",x+24,y+46,{w:700,size:28,ls:4,col:AG.violet});
  ctx.fillStyle=rgba(AG.mut,0.3);rr(ctx,x+24,y+68,w-64,10,5);ctx.fill();rr(ctx,x+24,y+90,w-120,10,5);ctx.fill();});}
/* a desk calendar: a card of 170 by 186 with rings, showing "day" of 14; as day rises, each page lifts over the rings and the next
   shows under it (the lifting page's number is decoration, squashed as it turns) */
function ma_calendar(ctx,x,y,day,a){if(a<=0)return;const d=clamp(Math.floor(day),1,14),f=day-Math.floor(day),flip=d<14?sstep(0.55,1,f):0;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,170,186,16,{});ctx.fillStyle=rgba(AG.mut,0.18);rr(ctx,x,y,170,48,16);ctx.fill();ag_T(ctx,"DAY",x+85,y+36,{w:700,size:28,ls:4,align:"center",col:AG.mut});
  ag_T(ctx,String(flip>0?d+1:d),x+85,y+140,{w:800,size:64,align:"center"});
  if(flip>0){const k=1-flip;ctx.save();ctx.translate(x,y+50);ctx.scale(1,k);ctx.fillStyle="#F1EFEA";rr(ctx,2,0,166,134,14);ctx.fill();ctx.fillStyle="rgba(46,38,28,"+(0.12*flip)+")";rr(ctx,2,0,166,134,14);ctx.fill();
    ag_T(ctx,String(d),85,90,{w:800,size:64,align:"center",deco:1});ctx.restore();
    ctx.fillStyle="rgba(46,38,28,"+(0.18*(1-flip))+")";ctx.fillRect(x+6,y+50+134*k,158,4);}
  for(const rx of [x+44,x+126]){ctx.fillStyle="#7C7A76";ctx.beginPath();ctx.arc(rx,y+6,7,0,TAU);ctx.fill();}ctx.restore();}
/* a card with a word stamped across it in ink: the budget card, "Budgets" and the stamp "set" (k: how far the stamp has come down) */
function ma_stamp(ctx,x,y,text,k,o){o=o||{};if(k<=0)return;const col=o.col||[70,70,76],rot=o.rot==null?-0.12:o.rot,s=lerp(1.6,1,ag_eo(k)),a=sstep(0,0.3,k)*(o.a==null?1:o.a);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);const w=ag_tw(ctx,text.toUpperCase(),{w:800,size:o.size||34,ls:4})+40,h=(o.size||34)+26;
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=4;rr(ctx,-w/2,-h/2,w,h,8);ctx.stroke();ag_T(ctx,text.toUpperCase(),0,(o.size||34)*0.36,{w:800,size:o.size||34,ls:4,align:"center",col:col});ctx.restore();}
/* an agent: the series' sphere, rolling in from o.from ([dx, dy]) at o.at with a settle of its own; o.ring (0..1) a thin green ring
   round it, the checking agent; o.lock (0..1) a small blue lock beside it; o.core, o.think; returns its centre */
function ma_agent(ctx,x,y,r,t,o){o=o||{};const at=o.at==null?-9:o.at,u=ag_spr(t,at,o.d||0.7),a=(o.a==null?1:o.a)*clamp((t-at)/0.25,0,1);if(a<=0)return [x,y];
  const fr=o.from||[0,0],px=x+fr[0]*(1-u),py=y+fr[1]*(1-u)-Math.abs(Math.sin(Math.min(1,(t-at)/0.7)*Math.PI))*(o.hop||0);
  ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,px+AG.sdx*r/40,py+r*0.98,r*1.1,r*0.22,0.3);
  ag_model(ctx,px,py,r,{t:t+(o.ph||0),core:o.core==null?0.6:o.core,think:o.think||0});
  if(o.ring>0){ctx.strokeStyle=rgba(AG.green,0.9*o.ring);ctx.lineWidth=Math.max(2.5,r*0.06);ctx.beginPath();ctx.arc(px,py,r*1.22,-Math.PI/2,-Math.PI/2+TAU*o.ring);ctx.stroke();}
  if(o.lock>0){ctx.save();ctx.globalAlpha*=o.lock;const lx=px+r*0.78,ly=py-r*0.72,s=Math.max(26,r*0.5);ctx.fillStyle="rgba(243,241,237,0.96)";ctx.beginPath();ctx.arc(lx,ly,s*0.62,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(AG.blue,0.5);ctx.lineWidth=1.5;ctx.stroke();ag_lock(ctx,lx,ly+s*0.06,s*0.82,rgba(AG.blue,1));ctx.restore();}
  ctx.restore();return [px,py];}
/* the platform's table of counts: a blue-edged card, one row per faculty with its count and change, the total under them, and a small
   blue gear turning: the same way every time. (x, y) its top left, 640 wide; o.a, o.k, o.spin, o.rows (0..1 how many rows show) */
function ma_table(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,k=o.k==null?1:o.k,w=640,h=440;if(a<=0)return;
  ma_sprung(ctx,x+w/2,y+h/2,k,a,()=>{ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.9});ag_T(ctx,"CENSUS COUNT",x+30,y+50,{w:700,size:28,ls:4,col:AG.blue});
    ma_gear(ctx,x+w-50,y+42,22,(o.t||0)*(o.spin==null?0.8:o.spin),AG.blue);const rows=o.rows==null?1:o.rows;
    MA_FAC.forEach((f,i)=>{const ra=clamp(rows*4-i,0,1);if(ra<=0)return;const yy=y+112+i*62;ctx.save();ctx.globalAlpha*=ra;ag_T(ctx,f[0],x+30,yy,{w:600,size:30});
      ag_T(ctx,ma_n(f[1]),x+440,yy,{w:700,size:30,align:"right"});ag_T(ctx,ma_sgn(f[2]),x+w-30,yy,{w:500,size:30,align:"right",col:AG.mut});ctx.restore();});
    ctx.strokeStyle=rgba(AG.blue,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,y+352);ctx.lineTo(x+w-30,y+352);ctx.stroke();
    if(rows>=1){ag_T(ctx,"Total",x+30,y+404,{w:700,size:32});ag_T(ctx,"18,412",x+440,y+404,{w:800,size:32,align:"right"});ag_T(ctx,"+454",x+w-30,y+404,{w:500,size:30,align:"right",col:AG.mut});}});}
// a gear: teeth round a ring, turning
function ma_gear(ctx,x,y,r,ang,col){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=rgba(col,1);ctx.beginPath();for(let i=0;i<16;i++){const a=i/16*TAU,rr0=i%2?r*0.78:r;ctx.lineTo(Math.cos(a-0.12)*rr0,Math.sin(a-0.12)*rr0);ctx.lineTo(Math.cos(a+0.12)*rr0,Math.sin(a+0.12)*rr0);}
  ctx.closePath();ctx.fill();ctx.fillStyle="#EEECE7";ctx.beginPath();ctx.arc(0,0,r*0.36,0,TAU);ctx.fill();ctx.restore();}
/* the shared board on the marble wall: a pale linen pinboard in an oak frame, its name above it */
function ma_board(ctx,x,y,w,h,a){if(a<=0)return;ag_picture(ctx,x,y,w,h,{a,draw:(c,X,Y,Wd,Hd)=>{c.fillStyle="#ECE8E0";c.fillRect(X,Y,Wd,Hd);ag_grain(c,X,Y,Wd,Hd,2.2,909);
  c.strokeStyle="rgba(120,110,96,0.06)";c.lineWidth=1;for(let i=X;i<X+Wd;i+=6){c.beginPath();c.moveTo(i,Y);c.lineTo(i,Y+Hd);c.stroke();}}});}
/* a card pinned to the board: words {kick, title, sub}, w wide; o.src an orange chip naming where it came from ("notes", "email");
   o.edge (a colour), o.a, o.k; o.word {text, col, strike 0..1} an extra line in a colour (the copied word); returns its box */
function ma_pin(ctx,x,y,w,words,o){o=o||{};const a=o.a==null?1:o.a;const bb=ag_textCard(ctx,x,y,w,words,{measure:true}),extra=(o.src?50:0)+(o.word?44:0),h=bb.h+extra;if(a<=0)return{x,y,w,h};
  ma_sprung(ctx,x+w/2,y,o.k==null?1:o.k,a,()=>{ag_box(ctx,x,y,w,h,18,{edge:o.edge,edgeA:0.9});const inner=ag_textCard(ctx,x,y,w,words,{a:1,edge:null,kickCol:o.kickCol});
    let yy=y+bb.h-6;if(o.word){const W0=o.word;yy+=34;ag_T(ctx,W0.text,x+28,yy,{w:700,size:30,col:W0.col||AG.amber});if(W0.strike>0){const tw0=ag_tw(ctx,W0.text,{w:700,size:30});ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=4;
      ctx.beginPath();ctx.moveTo(x+24,yy-10);ctx.lineTo(x+28+tw0*W0.strike+4,yy-12);ctx.stroke();}yy+=10;}
    if(o.src){const sw=ag_tw(ctx,o.src,{w:600,size:28})+40;ctx.fillStyle=rgba(AG.orange,0.12);rr(ctx,x+24,yy+4,sw,40,20);ctx.fill();ctx.strokeStyle=rgba(AG.orange,0.8);ctx.lineWidth=2;rr(ctx,x+24,yy+4,sw,40,20);ctx.stroke();
      ag_T(ctx,o.src,x+44,yy+34,{w:600,size:28,col:AG.orange});}
    ctx.fillStyle="#8A847A";ctx.beginPath();ctx.arc(x+w/2,y+10,8,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.6)";ctx.beginPath();ctx.arc(x+w/2+2,y+8,3,0,TAU);ctx.fill();});
  return{x,y,w,h};}
/* the checking agent's flag: a card listing a student's statuses, "studying" ticked green beside the 31 */
function ma_status(ctx,x,y,a,k,hi){if(a<=0)return;ma_sprung(ctx,x+200,y+150,k==null?1:k,a,()=>{ag_box(ctx,x,y,400,300,20,{edge:AG.green,edgeA:0.9*(hi||0)});ag_T(ctx,"ALL 31",x+28,y+48,{w:700,size:28,ls:4,col:AG.green});
  ["studying","inactive","withdrawn","completed"].forEach((s,i)=>{const yy=y+104+i*52,on=i===0;ag_T(ctx,s,x+80,yy,{w:on?700:500,size:30,col:on?AG.ink:AG.mut});
    if(on){ag_tick(ctx,x+46,yy-10,26,rgba(AG.green,1),4.5);ag_T(ctx,"31",x+372,yy,{w:800,size:30,align:"right",col:AG.green});}else{ctx.fillStyle=rgba(AG.mut,0.4);ctx.beginPath();ctx.arc(x+46,yy-10,5,0,TAU);ctx.fill();ag_T(ctx,"0",x+372,yy,{w:500,size:30,align:"right",col:AG.mut});}});});}
/* a blue test card: "every degree has a faculty"; pass 0..1 turns its edge green and shows a pass pill */
function ma_test(ctx,x,y,a,pass,k){if(a<=0)return;const col=pass>0.5?AG.green:AG.blue;ma_sprung(ctx,x+230,y+80,k==null?1:k,a,()=>{const b=ag_textCard(ctx,x,y,460,{kick:"Test",title:"every degree has a faculty"},{edge:col,kickCol:AG.blue});
  if(pass>0)ag_pill(ctx,x+b.w-90,y+b.h+14,"passes",{icon:"tick",col:AG.green,a:sstep(0,0.5,pass)});});}
/* bars: values 0..1 over labels, w by h from (x, y) at their foot; o.col, o.a, o.u (0..1 how far they've grown), o.size of the labels */
function ma_bars(ctx,x,y,w,h,vals,labels,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u,n=vals.length,bw=w/n;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(AG.ink,0.3);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x+w+6,y);ctx.stroke();
  vals.forEach((v,i)=>{const bh=h*v*ag_eo(clamp(u*1.4-i*0.08,0,1)),bx=x+i*bw+bw*0.18;ctx.fillStyle=rgba(o.col||AG.violet,o.alpha||0.7);rr(ctx,bx,y-bh,bw*0.64,Math.max(0.1,bh),6);ctx.fill();
    if(labels)ag_T(ctx,labels[i],bx+bw*0.32,y+38,{w:700,size:o.size||28,align:"center",col:AG.mut});});ctx.restore();}
/* computing, one agent beside a team: two bars under the name "computing", w wide from (x, y); as u goes 0..1 the team's bar grows
   to many times the agent's */
function ma_meter(ctx,x,y,w,u,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_T(ctx,"computing",x,y-16,{w:700,size:28,col:AG.mut});
  const lw=170,bw=w-lw,one=bw/8;[["one agent",one],["a team",lerp(one,bw,ag_eo(clamp(u,0,1)))]].forEach(([s,l],i)=>{const yy=y+i*46;ag_T(ctx,s,x,yy+26,{w:600,size:28});
    ctx.fillStyle=rgba(AG.mut,0.12);rr(ctx,x+lw,yy+2,bw,28,14);ctx.fill();ctx.fillStyle=rgba(AG.blue,i?0.85:0.5);rr(ctx,x+lw,yy+2,Math.max(28,l),28,14);ctx.fill();});ctx.restore();}
/* a range from lo% to hi% on a 0 to 100 line, w wide from (x, y); u 0..1 how far it has spread */
function ma_range(ctx,x,y,w,lo,hi,u,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.ink,0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();
  for(const p of [0,50,100]){ctx.beginPath();ctx.moveTo(x+w*p/100,y-10);ctx.lineTo(x+w*p/100,y+10);ctx.stroke();}const m=(lo+hi)/2,l=lerp(m,lo,ag_eo(u)),r=lerp(m,hi,ag_eo(u));
  ctx.fillStyle=rgba(AG.amber,0.5);rr(ctx,x+w*l/100,y-14,w*(r-l)/100,28,14);ctx.fill();if(u>0.8){ag_T(ctx,lo+"%",x+w*lo/100,y+52,{w:700,size:30,align:"center",col:AG.amber});ag_T(ctx,hi+"%",x+w*hi/100,y+52,{w:700,size:30,align:"center",col:AG.amber});}ctx.restore();}
/* a name tile, as the agents in the naming game hold: a small card with one letter */
function ma_tile(ctx,x,y,ch,a,col){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x-30,y-30,60,60,12,{edge:col||null,edgeA:0.9});ag_T(ctx,ch,x,y+14,{w:800,size:36,align:"center",col:col||AG.ink});ctx.restore();}
/* a plain wall switch: a pale plate with a rocker, on (1) or off (0) */
function ma_switch(ctx,x,y,on,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=14;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=6;ctx.fillStyle="#F3F1ED";rr(ctx,x-50,y-70,100,140,14);ctx.fill();ctx.restore();
  const k=clamp(on,0,1);ctx.fillStyle="#E2DED6";rr(ctx,x-26,y-46,52,92,8);ctx.fill();ctx.fillStyle="#F8F6F2";rr(ctx,x-24,y-44+lerp(46,0,k),48,44,7);ctx.fill();ctx.fillStyle="rgba(46,38,28,0.15)";rr(ctx,x-24,y-44+lerp(0,46,k),48,44,7);ctx.fill();ctx.restore();}
/* a wall clock: its hands at "hours" (any real number; it turns as hours rises) */
function ma_clock(ctx,x,y,r,hours,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(20,20,30,0.3)";ctx.shadowBlur=16;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=6;ctx.fillStyle="#EEECE7";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle="#57524C";ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();for(let i=0;i<12;i++){const an=i/12*TAU;ctx.lineWidth=i%3?2:4;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.78,y+Math.sin(an)*r*0.78);ctx.lineTo(x+Math.cos(an)*r*0.9,y+Math.sin(an)*r*0.9);ctx.stroke();}
  const ha=(hours%12)/12*TAU-Math.PI/2,ma=(hours%1)*TAU-Math.PI/2;ctx.lineCap="round";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ha)*r*0.5,y+Math.sin(ha)*r*0.5);ctx.stroke();
  ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ma)*r*0.76,y+Math.sin(ma)*r*0.76);ctx.stroke();ctx.fillStyle="#57524C";ctx.beginPath();ctx.arc(x,y,6,0,TAU);ctx.fill();ctx.restore();}
/* a frame drawing itself round a group: a dashed rounded rectangle, p 0..1 of its length */
function ma_frame(ctx,x,y,w,h,p,col){if(p<=0)return;const L=2*(w+h);ctx.save();ctx.strokeStyle=rgba(col||AG.blue,0.85);ctx.lineWidth=4;ctx.setLineDash([14,10]);ctx.lineDashOffset=0;
  ctx.beginPath();const pts=[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]];let left=L*p;ctx.moveTo(x,y);for(let i=1;i<pts.length&&left>0;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]),k=Math.min(1,left/d);
    ctx.lineTo(lerp(pts[i-1][0],pts[i][0],k),lerp(pts[i-1][1],pts[i][1],k));left-=d;}ctx.stroke();ctx.restore();}
/* the place tag for the university's scenes */
const MA_UNI="The university · April 2026";

/* ---------------------------------------------------------------- many agents: a crowd, a team, a naming game */
// the crowd that gathers at the start: about ninety agents in seven uneven rows, smaller further back, the nearest cut by the frame's
// foot. k is the order each arrives in: the first near the front and the middle, then more and more from everywhere. Drawn back to front
const MA_MOB=(()=>{const R=ag_rnd(318),P=[];
  [680,708,744,790,846,912,990].forEach((g,row)=>{const r0=16.5+(g-676)*0.13,s=r0*4.6;let x=-40+R()*s*0.6;
    while(x<1960){if(R()>0.12){const gy=g+(R()-0.5)*(8+row*3),r=16.5+(gy-676)*0.13;P.push({x:x+(R()-0.5)*s*0.35,y:gy-r,r,ph:R()*6});}x+=s*(0.82+R()*0.36);}});
  P.map((p,i)=>[Math.hypot((p.x-960)/900,(p.y+p.r-930)/260)*0.6+R()*0.7,i]).sort((a,b)=>a[0]-b[0]).forEach(([_,i],k)=>{P[i].k=k;});
  return P.sort((a,b)=>a.y+a.r-(b.y+b.r));})();
// the 24 agents of the naming game in two staggered rows, each with its name tile above it
const MA_ROWS=Array.from({length:24},(_,i)=>{const back=i<12,k=back?i:i-12;return{x:(back?929:985)+(k-5.5)*112,y:back?718:852,r:back?32:38};});
/* the naming game, run once: each agent starts with a name from the pool; each round they meet in random pairs, the speaker says a
   name it knows, and if the listener knows it too both keep only that name; if not, the listener learns it. No agent prefers a name;
   in this run, one name has taken over after eight rounds. st[r][i]: the name agent i shows after round r; pairs[r]: who met */
const MA_NAMES=["K","M","Q","R","T"];
const MA_GAME=(()=>{const R=ag_rnd(472),N=24;let inv=Array.from({length:N},()=>[Math.floor(R()*5)]);const st=[inv.map(v=>v[v.length-1])],pairs=[];
  for(let r=0;r<9;r++){const o=[...Array(N).keys()];for(let i=N-1;i>0;i--){const j=Math.floor(R()*(i+1));[o[i],o[j]]=[o[j],o[i]];}const P=[];
    for(let k=0;k<N;k+=2){const a=o[k],b=o[k+1],w=inv[a][Math.floor(R()*inv[a].length)];P.push([a,b]);if(inv[b].includes(w)){inv[a]=[w];inv[b]=[w];}else inv[b]=inv[b].concat([w]);}
    pairs.push(P);st.push(inv.map(v=>v[v.length-1]));}return{st,pairs};})();
// a small bar chart of five names, w by h from (x, y) at its foot: vals 0..1; o.labels under the bars; o.col
function ma_nameChart(ctx,x,y,w,h,vals,a,o){o=o||{};if(a<=0)return;ma_bars(ctx,x,y,w,h,vals,o.labels?MA_NAMES:null,{a,col:o.col||AG.violet,alpha:o.alpha||0.75,u:o.u});}

/* ===== Many agents, and what emerges: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (places.js, nature.js, world.js, plan.js); what moves is drawn live in the shots of ag_shots, which glide the camera and dissolve
   from one place to the next. A place's tag is drawn in screen space inside its shot, so it dissolves with it. */

// draw in screen space, whatever the camera is doing (a tag, a card that stays put)
function ma_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a pill that springs in at t0 and fades out at t1 (o: the pill's own options)
function ma_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));ag_pill(ctx,x,y,text,o||{});ctx.restore();}
// a card (ag_textCard) that springs in at t0 and fades at t1
function ma_cardAt(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;
  return ag_textCard(ctx,x,y,w,words,Object.assign({},o,{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}

/* ---------------------------------------------------------------- 1 · A building that breathes */
scene("breathes",(ctx,S,t,sc)=>{
  const tPearce=wAt(sc,"place","Mick",-0.5),tShops=wAt(sc,"place","offices and shops");
  const tAC=wAt(sc,"cooled","air conditioning"),tImp=wAt(sc,"cooled","imported"),tExp=wAt(sc,"cooled","expensive"),tAll=wAt(sc,"cooled","running all day");
  const tBills=wAt(sc,"bills","high bills"),tRents=wAt(sc,"bills","high rents"),tChange=wAt(sc,"change","Something"),tOwners=wAt(sc,"change","The owners");
  const tMound=wAt(sc,"mounds","termite",-0.4),tCut=wAt(sc,"mounds","breathe like",-0.4),tWarm=wAt(sc,"rising","warm air"),tFresh=wAt(sc,"rising","fresh air");
  const tEG=wAt(sc,"built","Eastgate",-0.3),tParts=wAt(sc,"built","many simple"),tNight=wAt(sc,"nights","cool nights",-0.8),tFans=wAt(sc,"nights","fans pull"),tConc=wAt(sc,"nights","concrete");
  const tDay=wAt(sc,"day","By day",-0.4),tWarmD=wAt(sc,"day","warm air"),t48=wAt(sc,"day","forty-eight");
  const tOpen=wAt(sc,"opened","Eastgate",-0.4),tTenth=wAt(sc,"cost","tenth"),tEnergy=wAt(sc,"cost","far less"),tRentsL=wAt(sc,"rents","Rents"),tLet=wAt(sc,"rents","let before");
  const tUni=wAt(sc,"council","census",-1.6),tCensus=wAt(sc,"council","census"),tAsks=wAt(sc,"council","council asks"),tFac=wAt(sc,"council","each faculty");
  const tNotes=wAt(sc,"weeks","notes and emails"),tWeeks=wAt(sc,"weeks","two weeks"),tBudget=wAt(sc,"weeks","budgets");
  const tYear=wAt(sc,"shared","This year"),tMany=wAt(sc,"shared","many small"),tWork=wAt(sc,"shared","shared the work"),tDrafts=wAt(sc,"shared","drafts"),tNoon=wAt(sc,"shared","afternoon"),tMistake=wAt(sc,"shared","mistake");
  ag_shots(ctx,S,t,sc.dur,[
    // Harare, 1992: the street in the heart of the city, an empty plot behind a fence
    {at:0,place:"maHarare",keys:[[0,960,540,1],[0.3,1000,556,1.05]],d:5.6,draw:(c,tt)=>{ma_harareLife(c,tt,1.8);
      ma_scr(c,S,()=>ma_tag(c,"Harare, Zimbabwe · 1992",ag_in(tt,0.6,0.6)));}},
    // the drawing board: two blocks of offices over shops; then the usual way, pencilled onto it, and what it costs. The camera
    // stays back far enough that the sheet's foot (the shops, the bills, the title block) sits above the captions
    {at:tPearce,place:"maDesk",keys:[[0,880,560,1.16],[tAC-1.4,900,565,1.12],[tOwners-1.0,920,560,1.1]],d:2.0,draw:(c,tt)=>{
      const gone=ag_in(tt,tChange,1.2),body=MA_SKL.slice(0,-8),shops=MA_SKL.slice(-8);
      ma_sketch(c,body,tt,tPearce+0.1,2.6);
      const ush=clamp((tt-(tPearce+1.2))/2.4,0,1),tip=ma_pencil(c,shops,ush);
      ma_titleBlock(c,tt,tPearce+0.5,1);
      ma_pillAt(c,1180,250,"offices",tt,tShops-0.1,tChange);ma_pillAt(c,900,790,"shops",tt,tShops+0.6,tChange);
      // the plant: pencilled onto the left block's roof, its fans turning; dotted and still once things had to change
      const up=clamp((tt-(tAC-0.3))/1.8,0,1);let tip2=null;
      if(up>0){if(gone<1)tip2=ma_pencil(c,MA_PLANT,up,{a:1-gone});if(gone>0)ma_sketch(c,MA_PLANT,99,0,1,{a:lerp(0,0.55,gone),dash:[4,9]});
        ma_plantFans(c,tt,ag_in(tt,tAC+1.2,0.5)*(1-gone));}
      ma_sketch(c,MA_CRATE,tt,tImp-0.5,0.6,{a:1-gone});ma_stamp(c,343,657,"imported",ag_in(tt,tImp,0.3)*(1-gone),{size:28,col:[70,70,76]});
      ma_paperTag(c,470,250,300,262,"expensive",ag_in(tt,tExp,0.3)*(1-gone),{rot:0.06+Math.sin(tt*2.1)*0.03});
      const day=clamp((tt-tAll)/4.2,0,1);ma_sunArc(c,day,ag_in(tt,tAll-0.2,0.4)*(1-gone));ma_plantDial(c,day,ag_in(tt,tAC+1.0,0.4)*(1-gone));
      ma_papers(c,330,815,6,tt,{t0:tBills-0.1,a:1-gone});ma_pillAt(c,500,812,"bills",tt,tBills+0.2,tChange);
      [1,3,5].forEach((k,i)=>{const t0=tRents+i*0.18,tick=Math.min(3,Math.floor(Math.max(0,tt-t0-0.3)/0.28));
        ma_paperTag(c,460+k*150+55,656,460+k*150+4,668-tick*5,"rent",ag_in(tt,t0,0.3)*(1-gone),{arrow:Math.min(1,tick/3)});});
      ma_cardAt(c,980,130,540,{kick:"The owners asked",title:"A building that cools itself"},tt,tOwners,null,{kickCol:AG.mut});
      // the pencil: drawing the shop fronts, then the plant, then lifting away
      const pa=ag_io(tt,tPearce+0.9,tPearce+3.9,0.4),pb=ag_io(tt,tAC-0.5,tAC+1.8,0.4);
      if(pa>0)ma_pencilBody(c,tip.x,tip.y,tip.lift,pa);if(pb>0&&tip2)ma_pencilBody(c,tip2.x,tip2.y,tip2.lift,pb);}},
    // termite mounds: one on the savanna at dusk, then cut down the middle, with the idea of the time
    {at:tMound,place:"maMound",keys:[[0,900,560,1.0],[tMound+0.2,900,520,1.06]],d:2.6,draw:(c,tt)=>{
      ma_scr(c,S,()=>ma_tag(c,"Termite mounds · southern Africa",ag_in(tt,tMound+0.5,0.6)));}},
    {at:tCut,place:"maMoundCut",keys:[[0,900,520,1.06],[tFresh+1.2,900,500,1.3]],d:2.4,draw:(c,tt)=>{
      ma_moundIdea(c,tt,ag_in(tt,tFresh-0.3,1.6),ag_in(tt,tWarm-0.3,1.6));
      ma_pillAt(c,1080,150,"warm air",tt,tWarm+0.4,null,{col:[176,96,62]});ma_pillAt(c,1360,700,"fresh air",tt,tFresh+0.3,null,{col:[96,112,124]});
      const a=ag_in(tt,tFresh+1.0,0.5);if(a>0)ma_tag(c,"the idea, then",a,{x:1260,y:300,dashed:true});
      ma_scr(c,S,()=>ma_tag(c,"Termite mounds · southern Africa",1));}},
    // Eastgate cut through, carried across from the mound: its many simple parts light one by one
    {at:tEG,place:"maSection",keys:[[0,960,460,1.3],[tEG+0.3,960,540,1.0]],d:2.2,draw:(c,tt)=>{
      const f=ag_in(tt,tParts,0.5),fl=clamp((tt-tParts-0.6)/0.9,0,1),ch=clamp((tt-tParts-1.4)/0.9,0,1);
      ma_sectionLive(c,tt,{lit:[f,fl,ch],spin:ag_in(tt,tParts,0.8)*4});
      ma_pillAt(c,960,160,"Eastgate",tt,tEG+0.6,null,{size:36});
      ma_pillAt(c,450,824,"fans",tt,tParts+0.1);ma_pillAt(c,1800,560,"floors",tt,tParts+0.8);ma_pillAt(c,520,140,"chimneys",tt,tParts+1.5);}},
    // a cool night: the fans pull air in, and the concrete under the floors stores the cool
    {at:tNight,place:"maSectionNight",keys:[[0,960,540,1.0],[tNight+0.2,960,560,1.04]],d:4,draw:(c,tt)=>{
      ma_sectionLive(c,tt,{lit:[1,1,0],night:1,cool:ag_in(tt,tFans,1.4),glow:0.3+0.7*ag_in(tt,tConc,1.4)});
      ma_pillAt(c,450,824,"fans",tt,tFans);ma_pillAt(c,960,560,"concrete",tt,tConc+0.3);}},
    // by day: warm air rises out through the chimneys
    {at:tDay,place:"maSection",keys:[[0,960,560,1.04],[tDay+0.2,960,520,1.0]],d:3,draw:(c,tt)=>{
      ma_sectionLive(c,tt,{lit:[1,0.6,1],warm:ag_in(tt,tWarmD-0.2,1.4)});
      const n=Math.round(48*ag_eo(clamp((tt-tWarmD)/(t48-tWarmD+0.5),0,1)));if(tt>tWarmD)ma_pillAt(c,960,160,n+" chimneys",tt,tWarmD,null,{size:36});}},
    // 1996: the finished building, people at its shops, and what it gave
    {at:tOpen,place:"maEastgate",keys:[[0,960,540,1.0],[tOpen+0.3,980,530,1.04],[tLet-1.2,1320,640,1.32]],d:2.2,draw:(c,tt)=>{
      ma_eastgateLife(c,tt);for(let k=0;k<5;k++)ma_letSign(c,1,k,tt-(tLet+0.1+k*0.14));
      ma_scr(c,S,()=>{ma_tag(c,"Harare, Zimbabwe · 1996",ag_in(tt,tOpen+0.6,0.6));
        const L=[["cost to build: about a tenth less",tTenth],["energy: far less",tEnergy],["rents: lower",tRentsL],["let before it was finished",tLet]];
        const pa=ag_in(tt,tTenth-0.3,0.4),rows=L.reduce((n,l,i)=>n+ag_eo(clamp((tt-l[1]+0.3)/0.5,0,1))*(i?1:0),1);if(pa>0){ag_box(c,64,300,620,60+rows*80,22,{a:pa});
          L.forEach((l,i)=>{const a=ag_in(tt,l[1],0.4),y=372+i*80;if(a<=0)return;c.save();c.globalAlpha*=a;c.translate(-16*(1-ag_eo(clamp((tt-l[1])/0.5,0,1))),0);
            c.fillStyle=rgba(AG.ink,0.5);c.beginPath();c.arc(104,y-10,6,0,TAU);c.fill();ag_T(c,l[0],128,y,{w:700,size:32});c.restore();});}});}},
    // the university, April 2026: census day, the council's question, four faculties' counts
    // (under the title card's veil the scene fades, so only the title's words show)
    {at:tUni,place:"lab",keys:[[0,960,500,1.06],[tYear-0.3,960,540,1.0]],d:2.2,draw:(c,tt)=>{const f=1-ag_in(tt,sc.cues.breath+0.5,0.8);if(f<=0)return;c.save();c.globalAlpha*=f;
      ma_census(c,S,tt,{tUni,tCensus,tAsks,tFac,tNotes,tWeeks,tBudget,tYear,tMany,tWork,tDrafts,tNoon,tMistake});c.restore();}}
  ],0.8);
  ag_title(ctx,S,t,sc.cues.breath,"Many agents, and what emerges",null,"FILM 9 OF 9 · WHAT AN AGENT IS");
});

/* the census scene: the room with four faculties' cards; last year's two weeks; this year's small agents, one to each pile */
const MA_COL=[300,720,1140,1560];
function ma_census(c,S,tt,T){
  const yearOn=ag_in(tt,T.tYear,0.6),noon=ag_in(tt,T.tWork,2.2),AY=796;
  // the agents roll in on the floor first, so the room's light falls on them; each reads its pile, thinks, and a draft comes back
  MA_COL.forEach((x,i)=>{const at=T.tMany+i*0.22;ma_agent(c,x+70,AY,40,tt,{at,from:[-300-i*70,0],d:0.8,ph:i*0.9,think:ag_io(tt,T.tWork+0.3+i*0.12,T.tDrafts+0.4+i*0.15,0.4),core:0.6+0.4*ag_in(tt,T.tDrafts+i*0.15,0.4)});});
  ag_roomLight(c,1);
  // afternoon: the window's light warms and comes in low across the room
  if(noon>0){const g=c.createLinearGradient(W,0,W*0.2,H*0.6);g.addColorStop(0,"rgba(255,206,150,"+(0.16*noon)+")");g.addColorStop(1,"rgba(255,206,150,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}
  ma_scr(c,S,()=>ma_tag(c,MA_UNI,ag_in(tt,T.tUni+0.6,0.6)));
  ma_cardAt(c,96,124,440,{kick:"Census day",title:"31 March 2026"},tt,T.tCensus-0.2,null,{kickCol:AG.mut});
  ma_cardAt(c,600,124,560,{kick:"The council asks",title:"Why did each count change?"},tt,T.tAsks,null,{kickCol:AG.mut});
  MA_COL.forEach((x,i)=>{ma_facCard(c,x-160,330,i,{w:320,a:ag_in(tt,T.tFac+i*0.15,0.4),k:Math.min(1,ag_spr(tt,T.tFac+i*0.15,0.5))});
    // last year: notes and emails pile up, and are read one faculty at a time, over two weeks
    const read=ag_in(tt,T.tWeeks+0.3+i*0.7,0.5);ma_papers(c,x,598,6,tt,{t0:T.tNotes+i*0.2,a:(1-read)*(1-ag_in(tt,T.tYear,0.3)),seed:31+i});
    // this year: the notes come again; each agent reads its own pile, and its draft rises from it
    const take=clamp((tt-(T.tWork+0.1+i*0.12))/1.1,0,1);ma_papers(c,x,598,6,tt,{t0:T.tYear+0.1+i*0.08,gap:0.08,a:yearOn,take,to:[x+70,AY],seed:51+i});
    const k=ag_spr(tt,T.tDrafts+i*0.18,0.55),u=ag_eo(clamp((tt-T.tDrafts-i*0.18)/0.7,0,1));if(u>0){c.save();c.translate(lerp(x+70,x,u),lerp(AY-40,588,u));c.scale(lerp(0.3,1,Math.min(1.05,k)),lerp(0.3,1,Math.min(1.05,k)));
      ma_draft(c,-125,-60,250,clamp(u*3,0,1),1);c.restore();}});
  // two weeks on the calendar, and the budgets set before the last pile was read
  const out=ag_in(tt,T.tYear-0.2,0.5);
  if(tt>T.tWeeks-0.4){const a=ag_in(tt,T.tWeeks-0.4,0.4)*(1-out);ma_calendar(c,1590,104,1+13*ag_sine(clamp((tt-T.tWeeks)/2.6,0,1)),a);
    if(a>0)ag_T(c,"two weeks",1675,326,{w:700,size:28,align:"center",col:AG.mut,a:a*ag_in(tt,T.tWeeks+2.6,0.4)});}
  if(tt>T.tBudget-0.3&&out<1){const a=1-out;c.save();c.globalAlpha*=a;ma_cardAt(c,1220,124,320,{kick:"Budgets",title:"next year"},tt,T.tBudget-0.3,null,{kickCol:AG.mut});
    ma_stamp(c,1492,236,"set",clamp((tt-T.tBudget-0.4)/0.35,0,1),{size:34});c.restore();}
  // and something no one asked them to find
  ma_pillAt(c,1600,200,"a mistake in the count",tt,T.tMistake,null,{icon:"warn",col:AG.amber});}

/* ---------------------------------------------------------------- 2 · Much from little */
scene("little",(ctx,S,t,sc)=>{
  const tPlan=wAt(sc,"plan","plan"),tMud=wAt(sc,"mud","Each drops"),tScent=wAt(sc,"mud","scent is strongest"),tRise=wAt(sc,"mud","pillars rise"),tArch=wAt(sc,"mud","arches"),tWork=wAt(sc,"mud","The work itself");
  const tAnts=wAt(sc,"ants","Ants",-0.5),tBridges=wAt(sc,"ants","two bridges"),tShort=wAt(sc,"ants","shorter"),tBuild=wAt(sc,"trails","scent builds"),tMemory=wAt(sc,"trails","shared memory");
  const tBirds=wAt(sc,"starlings","Starlings",-0.4),tSeven=wAt(sc,"starlings","six or seven"),tLead=wAt(sc,"starlings","No bird");
  const tEm=wAt(sc,"emergence","This is emergence"),tHolland=wAt(sc,"emergence","John Holland");
  ag_shots(ctx,S,t,sc.dur,[
    // inside a mound: each worker drops its pellet where the scent is strongest; pillars rise, then lean into an arch
    {at:0,place:"maMoundIn",keys:[[0,960,640,1.22],[tRise-1.6,960,540,1.0]],d:2.6,draw:(c,tt)=>{
      const u=0.62*ag_sine((tt-1.4)/(tRise-1.2))+0.38*ag_sine((tt-tRise-0.2)/(tWork-tRise+0.6));
      ma_pillars(c,u,tt,ag_in(tt,tScent-0.6,1.0));ma_builders(c,tt,u,ag_in(tt,0.2,0.8));
      ma_cardAt(c,1240,150,580,{title:"the work tells the next worker what to do"},tt,tWork,null);
      ma_scr(c,S,()=>ma_tag(c,"Termite mounds · southern Africa",ag_in(tt,0.8,0.6)));}},
    // ants, two bridges: both at first, then most on the shorter one, where the scent builds up faster
    {at:tAnts,place:"maAnts",keys:[[0,960,520,1.08],[tAnts+0.2,960,540,1.0]],d:2.4,draw:(c,tt)=>{
      const share=lerp(0.5,0.86,sstep(tBridges+0.6,tMemory-0.6,tt)),sh=sstep(tBridges,tMemory,tt),lo=0.35*sstep(tBridges,tShort,tt)*(1-0.5*sstep(tShort,tMemory,tt));
      ma_antsLive(c,tt,share,[sh,lo]);
      ma_pillAt(c,290,780,"nest",tt,tAnts+0.8);ma_pillAt(c,1650,760,"food",tt,tAnts+1.1);
      const ba=ag_in(tt,tShort-0.6,0.5);if(ba>0){ag_box(c,800,650,320,210,20,{a:ba});ma_bars(c,836,800,248,110,[share,1-share],["shorter","longer"],{a:ba,col:MA_GOLD.map(v=>v*0.78),alpha:0.9});}
      ma_scr(c,S,()=>ma_tag(c,"A laboratory · 1989",ag_in(tt,tAnts+0.6,0.6)));}},
    // starlings over Rome: a flock of thousands; one bird, and its seven nearest neighbours; no bird leads
    {at:tBirds,place:"maRome",keys:[[0,960,540,1.0],[tBirds+0.2,960,520,1.04]],d:5,draw:(c,tt)=>{
      const o={cx:820,cy:400,scale:1.25,lx:1480,ly:330};ma_flock(c,tt,o);ma_flockLens(c,tt,o,ag_in(tt,tSeven-0.5,0.9)*(1-ag_in(tt,tEm-0.2,0.6)));
      ma_pillAt(c,1480,570,"6 or 7 neighbours",tt,tSeven+0.2,tEm-0.2);ma_pillAt(c,820,700,"no leader",tt,tLead,tEm-0.2);
      // emergence, in plain words, and in Holland's
      const v=ag_in(tt,tEm-0.2,0.7);if(v>0){c.fillStyle="rgba(240,236,232,"+(0.42*v)+")";c.fillRect(0,0,W,H);}
      ma_cardAt(c,420,300,1080,{kick:"Emergence",title:"the whole does what no part planned"},tt,tEm,null,{kickCol:AG.mut});
      ma_cardAt(c,420,500,1080,{title:"“more comes out than was put in”",sub:"John Holland · Emergence · 1998"},tt,tHolland,null);
      ma_scr(c,S,()=>ma_tag(c,"Rome · winter 2005 to 2006",ag_in(tt,tBirds+0.6,0.6)));}}
  ],0.8);
});

/* ---------------------------------------------------------------- 3 · Where nobody can trace why */
scene("trace",(ctx,S,t,sc)=>{
  const tThought=wAt(sc,"neurons","how thought"),t86=wAt(sc,"neurons","eighty-six"),tMk=wAt(sc,"markets","In markets",-0.4),tNoPlan=wAt(sc,"markets","something no one");
  const tSold=wAt(sc,"potato","One sold"),tFast=wAt(sc,"potato","fast programs"),tPotato=wAt(sc,"potato","back and forth");
  const tMin=wAt(sc,"minutes","In minutes"),tFell=wAt(sc,"minutes","fell"),tSix=wAt(sc,"minutes","five to six"),tBack=wAt(sc,"minutes","came back"),tPenny=wAt(sc,"minutes","penny");
  const tMonths=wAt(sc,"argue","five months"),tArgue=wAt(sc,"argue","people still argue");
  ag_shots(ctx,S,t,sc.dur,[
    // neurons: signals pass from cell to cell; where a thought would form, a glow with no line that leads to it
    {at:0,place:"maNeurons",keys:[[0,960,540,1.12],[0.5,960,540,1.0]],d:8,draw:(c,tt)=>{ma_signals(c,tt,ag_in(tt,0.3,1.0));
      const g=ag_in(tt,tThought-0.3,1.4)*(1-ag_in(tt,tMk+0.2,0.5));if(g>0){const r=150+Math.sin(tt*1.3)*10,G=c.createRadialGradient(1060,470,0,1060,470,r);G.addColorStop(0,"rgba(255,248,226,"+(0.55*g)+")");G.addColorStop(1,"rgba(255,248,226,0)");
        c.fillStyle=G;c.fillRect(1060-r,470-r,r*2,r*2);ag_T(c,"?",1060,494,{w:800,size:64,align:"center",col:[250,246,236],a:g});}
      ma_pillAt(c,960,170,"86 billion",tt,t86,null,{size:36});}},
    // 6 May 2010: a calm line of prices; one program sells a huge order, whatever the price; fast programs pass contracts back and forth
    {at:tMk,place:"maTrading",keys:[[0,960,540,1.0],[tMin-0.8,908,480,1.05],[tMonths-1.2,960,540,1.0]],d:2.0,draw:(c,tt)=>{
      const u=lerp(0.02,0.775,sstep(tMk,tMin,tt))+0.04*ag_sine((tt-tFell+0.4)/1.4)+0.045*ag_sine((tt-tSix)/1.6)+0.14*sstep(tBack+0.4,tMonths,tt);
      ma_index(c,u,1);
      const pa=1-ag_in(tt,tMonths-0.6,0.6);ma_programs(c,tt,{seller:ag_in(tt,tSold,0.5)*pa,fast:ag_in(tt,tFast-0.6,0.8)*pa,heat:sstep(tFast,tPotato+1.2,tt)*(1-sstep(tBack,tBack+1.5,tt))});
      const C=MA_TR.chart,lx=C.x+C.w*0.815,ly=ma_indexY(-9.4);ma_cardAt(c,lx-700,ly-128,680,{title:"minus 5 to 6 percent, in minutes"},tt,tSix,tMonths-0.6,{tail:{side:"right",at:0.8,px:lx-12,py:ly-6}});
      ma_paperTag(c,C.x+C.w-40,C.y+C.h+6,C.x+C.w-210,C.y+C.h+40,"$0.01",ag_in(tt,tPenny-0.1,0.3)*(1-ag_in(tt,tMonths-0.6,0.5)),{rot:-0.05+Math.sin(tt*2)*0.03});
      // five months later, a report; and people still argue about why
      ma_cardAt(c,140,560,420,{kick:"Report",title:"30 September 2010"},tt,tMonths,null,{kickCol:AG.mut});
      [0,1,2].forEach(i=>{const x=660+i*400,a=ag_in(tt,tArgue+i*0.25,0.4);if(a<=0)return;ma_sprung(c,x+170,620,Math.min(1,ag_spr(tt,tArgue+i*0.25,0.5)),a,()=>{ag_box(c,x,560,340,130,20,{});
        c.fillStyle=rgba(AG.mut,0.3);rr(c,x+28,600,190,12,6);c.fill();rr(c,x+28,630,150,12,6);c.fill();ag_T(c,"?",x+290,650,{w:800,size:64,align:"center",col:AG.mut});});});
      ma_scr(c,S,()=>ma_tag(c,"United States · 6 May 2010",ag_in(tt,tMk+0.6,0.6)));}}
  ],0.8);
});

/* ---------------------------------------------------------------- 4 · Many agents */
scene("many",(ctx,S,t,sc)=>{
  const T={tLead:wAt(sc,"lead","a lead agent"),tSplit:wAt(sc,"lead","splits"),tHelp:wAt(sc,"lead","helpers"),tOwn:wAt(sc,"lead","own instructions"),
    tAnother:wAt(sc,"lead","another agent"),tChecks:wAt(sc,"lead","checks"),tBeat:wAt(sc,"beat","Such teams"),tTimes:wAt(sc,"beat","many times"),tStudy:wAt(sc,"study","Yet a"),
    tFail:wAt(sc,"study","failing"),tTog:wAt(sc,"together","together"),tIn:wAt(sc,"name","In"),tPaired:wAt(sc,"name","paired"),tLeaned:wAt(sc,"leaned","the group leaned"),
    tAlone:wAt(sc,"leaned","no agent"),tGroup:wAt(sc,"group","So testing"),tEnough:wAt(sc,"group","enough"),tTest:wAt(sc,"group","test the group")};
  ag_shots(ctx,S,t,sc.dur,[
    // crowds of a new kind, coming fast: more and more agents gather, and the camera draws back as the crowd grows
    {at:0,place:"lab",keys:[[0,960,720,1.5]],push:-0.2,draw:(c,tt)=>ma_mob(c,tt)},
    // a lead agent splits the job among helpers, and a checking agent checks what they find; then back to the whole wall for two findings
    {cut:true,at:T.tLead-0.6,place:"lab",keys:[[0,960,648,1.25],[T.tChecks+1.3,960,540,1]],d:1.6,push:0,draw:(c,tt)=>ma_team(c,tt,T)},
    // together: the naming game, the group's lean, and the test of the group
    {cut:true,at:T.tTog-0.7,place:"lab",keys:[[0,960,640,1.22]],push:0.02,draw:(c,tt)=>ma_game(c,S,tt,T)}],0.8);
});
// the crowd being built: the k-th agent appears at 1.0 + 6.0 (k / n)^0.55 s, growing from the floor where it stands with a small
// bounce, faster and faster; once there, a wave of work passes through the crowd, each band brightening, with a faint violet light
// round it, as the wave goes by
function ma_mob(c,tt){const n=MA_MOB.length-1;
  MA_MOB.forEach(p=>{const at=1.0+6.0*Math.pow(p.k/n,0.55),k=ag_spr(tt,at,0.9);if(k<=0)return;const r=p.r*k,y=p.y+p.r-r,w=Math.pow(Math.max(0,Math.sin(p.x/260+p.y/70-tt*2.6)),6)*ag_in(tt,at+0.6,0.8);
    if(w>0.03){const g=c.createRadialGradient(p.x,y,r*0.6,p.x,y,r*2.4);g.addColorStop(0,rgba(AG.violet,0.16*w));g.addColorStop(1,rgba(AG.violet,0));
      c.fillStyle=g;c.fillRect(p.x-r*2.4,y-r*2.4,r*4.8,r*4.8);}
    ma_agent(c,p.x,y,r,tt,{at:at-0.3,ph:p.ph,core:0.45+0.55*w,think:w*0.8});});}
// the team: where the lead agent, the three helpers and the checking agent stand
const MA_TEAM={lead:[420,782,60],helpers:[[760,806],[960,806],[1160,806]],check:[1500,786,48]};
function ma_team(c,tt,T){const L=MA_TEAM.lead,K=MA_TEAM.check;
  ma_agent(c,L[0],L[1],L[2],tt,{at:T.tLead-0.4,from:[-420,0],d:0.8,ph:0.4,think:ag_io(tt,T.tSplit-0.3,T.tHelp+0.8,0.4)});
  MA_TEAM.helpers.forEach((h,i)=>ma_agent(c,h[0],h[1],44,tt,{at:T.tHelp-0.4+i*0.16,from:[-180,60],d:0.7,ph:1+i,think:ag_io(tt,T.tOwn+0.2,T.tChecks+0.4,0.4)}));
  ma_agent(c,K[0],K[1],K[2],tt,{at:T.tAnother-0.3,from:[300,0],d:0.8,ph:2.2,ring:ag_sine((tt-T.tAnother)/0.9)});
  ma_pillAt(c,L[0],664,"lead agent",tt,T.tLead+0.1);ma_pillAt(c,960,700,"helper",tt,T.tHelp+0.4);ma_pillAt(c,K[0],664,"checking agent",tt,T.tAnother+0.3);
  // the job card, cut in three; each part flies to a helper as its own instructions
  if(tt<T.tSplit+0.2)ma_cardAt(c,280,420,280,{kick:"The job",title:"three parts"},tt,T.tLead+0.2,null,{kickCol:AG.mut});
  else MA_TEAM.helpers.forEach((h,i)=>{const u=ag_sine((tt-T.tSplit-0.2-i*0.18)/1.1),sep=ag_in(tt,T.tSplit,0.25)*(1-u),x=lerp(280+i*90,h[0]-80,u)+sep*(i-1)*10,y=lerp(420,560,u),w=lerp(100,160,u);
    ag_box(c,x,y,w,82,14,{edge:AG.violet,edgeA:0.5*u});c.fillStyle=rgba(AG.mut,0.32);rr(c,x+18,y+26,w-44,9,4.5);c.fill();rr(c,x+18,y+48,w-70,9,4.5);c.fill();});
  // what they find goes to the checking agent: two ticks in green, one in amber
  MA_TEAM.helpers.forEach((h,i)=>{const u=ag_sine((tt-T.tChecks+0.3-i*0.22)/1.0);if(u<=0)return;const x=lerp(h[0],K[0]-90,u),y=lerp(h[1]-70,436+i*66,u)-Math.sin(Math.PI*u)*60;
    ag_box(c,x,y,180,60,14,{});c.fillStyle=rgba(AG.mut,0.32);rr(c,x+18,y+25,96,9,4.5);c.fill();
    const v=ag_in(tt,T.tChecks+0.9+i*0.3,0.3);if(v>0){if(i===1)ag_warn(c,x+146,y+30,30,rgba(AG.amber,v));else ag_tick(c,x+146,y+30,26,rgba(AG.green,v),4.5);}});
  // better on hard research, at many times the computing; yet failing often
  const ca=ag_in(tt,T.tBeat,0.45);if(ca>0){c.save();c.globalAlpha*=ca;ag_box(c,110,120,780,290,22,{});ag_T(c,"TEAMS OF AGENTS",140,172,{w:700,size:28,ls:4,col:AG.mut});
    ag_T(c,"Hard research: better than one agent",140,226,{w:700,size:36});ma_meter(c,140,298,700,ag_sine((tt-T.tTimes+0.1)/1.6),1);c.restore();}
  const cb=ag_in(tt,T.tStudy,0.45);if(cb>0){c.save();c.globalAlpha*=cb;ag_box(c,1000,120,800,290,22,{edge:AG.amber,edgeA:0.7});ag_T(c,"2025 · 7 SYSTEMS",1030,172,{w:700,size:28,ls:4,col:AG.mut});
    ag_T(c,"failed on 41% to 87% of tasks",1030,226,{w:700,size:36});ma_range(c,1040,306,720,41,87,ag_sine((tt-T.tFail)/1.4),1);c.restore();}}
// the naming game: the 24 grow into two rows; each round they meet in random pairs (an arc between partners, a nudge towards each
// other) and a tile turns when an agent's name changes, until the whole group shows one name. Then the group's lean, and the test
function ma_game(c,S,tt,T){const D=0.8,T0=T.tPaired-0.3,rk=Math.floor((tt-T0)/D),inRound=rk>=0&&rk<8,ph=inRound?(tt-T0-rk*D)/D:0,meet=inRound?Math.sin(Math.PI*clamp(ph,0,1)):0,partner={};
  if(inRound)for(const [a,b] of MA_GAME.pairs[rk]){partner[a]=b;partner[b]=a;}
  const pos=i=>{const q=MA_ROWS[i];let x=q.x,y=q.y;if(partner[i]!=null){const o=MA_ROWS[partner[i]],d=Math.hypot(o.x-x,o.y-y)||1;x+=(o.x-x)/d*14*meet;y+=(o.y-y)/d*14*meet;}return[x,y,q.r];};
  if(meet>0){c.save();c.strokeStyle=rgba(AG.violet,0.6*meet);c.lineWidth=3.5;for(const [a,b] of MA_GAME.pairs[rk]){const A=pos(a),B=pos(b),ay=A[1]-A[2]-76,by=B[1]-B[2]-76,mx=(A[0]+B[0])/2,my=Math.min(ay,by)-90-Math.abs(A[0]-B[0])*0.24;
    c.beginPath();c.moveTo(A[0],ay);c.quadraticCurveTo(mx,my,B[0],by);c.stroke();}c.restore();}
  // the agents, back row first, each rolling in from its nearer side
  MA_ROWS.forEach((q,i)=>{const [x,y,r0]=pos(i),k=ag_spr(tt,T.tTog-0.5+Math.abs(q.x-960)/700*0.9+(i<12?0:0.08),0.9);if(k<=0)return;const r=r0*k;
    ma_agent(c,x,y+r0-r,r,tt,{at:T.tTog-1.5,ph:i*0.7,think:partner[i]!=null?meet*0.6:0});});
  // each agent's name tile, turning when its name changes; dimmed while the charts speak
  const ta=ag_in(tt,T.tPaired-1.4,0.6)*(1-0.55*ag_io(tt,T.tLeaned-0.3,T.tGroup-0.2,0.5));if(ta>0)MA_ROWS.forEach((q,i)=>{const [x,y,r]=pos(i),k=clamp(rk,-1,8),sw=T0+k*D+0.55*D;
    let f=1,name=MA_GAME.st[Math.max(0,Math.min(8,tt<sw?k:k+1))][i];if(rk>=8)name=MA_GAME.st[8][i];
    if(rk>=0&&rk<8){const prev=MA_GAME.st[k][i],next=MA_GAME.st[k+1][i];if(prev!==next){f=Math.abs(Math.cos(Math.PI*clamp((tt-sw+0.12)/0.24,0,1)));name=tt<sw?prev:next;}}
    c.save();c.translate(x,y-r-42);c.scale(Math.max(0.05,f),1);ma_tile(c,0,0,MA_NAMES[name],ta,null);c.restore();});
  // so testing each agent alone isn't enough: a frame round one agent, then round the whole group
  const one=MA_ROWS[17],oa=1-ag_in(tt,T.tEnough+0.3,0.5);if(oa>0){c.save();c.globalAlpha*=oa;ma_frame(c,one.x-62,736,124,170,ag_sine((tt-T.tGroup-0.1)/0.9),AG.blue);c.restore();}
  ma_frame(c,250,592,1420,318,ag_sine((tt-T.tEnough-0.4)/1.5),AG.blue);
  ma_scr(c,S,()=>{
    // the study: 24 agents, paired at random to agree on a name
    ma_cardAt(c,560,96,800,{kick:"2025 · 24 agents",title:"paired at random, to agree on a name"},tt,T.tIn,T.tLeaned-0.5,{kickCol:AG.mut});
    // the group leaned towards some names; no agent did alone
    const ga=ag_in(tt,T.tLeaned-0.2,0.5)*(1-ag_in(tt,T.tGroup-0.1,0.5));if(ga>0){c.save();c.globalAlpha*=ga;ag_box(c,150,60,700,380,22,{});ag_T(c,"THE GROUP",182,112,{w:700,size:28,ls:4,col:AG.mut});
      ma_nameChart(c,200,370,600,200,[0.58,0.12,0.9,0.16,0.1],1,{labels:true,u:ag_sine((tt-T.tLeaned)/1.2)});c.restore();}
    const sa=ag_in(tt,T.tAlone-0.4,0.5)*(1-ag_in(tt,T.tGroup-0.1,0.5));if(sa>0){c.save();c.globalAlpha*=sa;ag_box(c,1000,60,780,380,22,{});ag_T(c,"EACH AGENT ALONE",1032,112,{w:700,size:28,ls:4,col:AG.mut});
      for(let k=0;k<6;k++)ma_nameChart(c,1050+(k%3)*240,262+Math.floor(k/3)*140,190,80,[0.5,0.5,0.5,0.5,0.5],1,{alpha:0.45,u:ag_sine((tt-T.tAlone+0.2-k*0.06)/0.8)});c.restore();}
    ma_cardAt(c,660,290,600,{kick:"Test",title:"the whole group"},tt,T.tTest-0.1,null,{edge:AG.blue,kickCol:AG.blue});});}

/* ---------------------------------------------------------------- 5 · Agents on one board */
scene("board",(ctx,S,t,sc)=>{
  const T={tCounts:wAt(sc,"platform","counts come"),tSame:wAt(sc,"platform","the same way"),tReasons:wAt(sc,"platform","The reasons"),tWork:wAt(sc,"platform","work for agents"),
    tLead:wAt(sc,"helper","A lead agent"),tEach:wAt(sc,"helper","each faculty"),tRead:wAt(sc,"helper","read but not"),tBox:wAt(sc,"helper","sandbox"),
    tPins:wAt(sc,"pins","Each pins"),tSrc:wAt(sc,"pins","with its source"),tBoard:wAt(sc,"pins","shared board"),tReads:wAt(sc,"pins","reads what"),
    tCheck:wAt(sc,"checking","A checking"),tComp:wAt(sc,"checking","compares"),tTwo:wAt(sc,"pattern","Two things"),tThree:wAt(sc,"pattern","three faculties"),
    tSide:wAt(sc,"side","Side by side"),tSame31:wAt(sc,"side","the same thirty-one"),tMoved:wAt(sc,"side","moved"),tNoFac:wAt(sc,"side","no faculty"),
    tDrop:wAt(sc,"word","dropouts"),tOthers:wAt(sc,"word","The others"),tEvery:wAt(sc,"word","every draft"),
    tNone:wAt(sc,"left","None had left"),tFlag:wAt(sc,"left","checking agent flagged"),tStill:wAt(sc,"left","still studying"),
    tDrafted:wAt(sc,"decided","The agents drafted"),tClara:wAt(sc,"decided","Clara"),tFixed:wAt(sc,"decided","fixed the word"),tAppr:wAt(sc,"decided","approved"),
    tGot:wAt(sc,"faculty","got its faculty"),tTest:wAt(sc,"faculty","a new test"),tWithout:wAt(sc,"faculty","without an agent")};
  ag_shots(ctx,S,t,sc.dur,[
    // the table, then the room: helpers in their sandboxes, the board; close on the board for what emerged; Clara; the faculty fixed
    {at:0,place:"lab",keys:[[0,960,348,1.55],[T.tWork-0.9,960,540,1],[T.tTwo-0.6,1258,372,1.45],[T.tDrafted-0.5,1110,432,1.25]],d:1.8,push:0,
      draw:(c,tt)=>mb_room(c,S,tt,T)},
    // Jun at his desk: the new test, which needs no agent
    {cut:true,at:T.tTest-0.6,place:"lab",keys:[[0,760,640,1.3]],push:0.03,draw:(c,tt)=>mb_jun(c,S,tt,T)}],0.8);
});
// where things are in the room for this chapter: the table of counts on the left of the wall, the reasons beside it, the board on the
// right; on the floor the lead agent, four helpers in their sandboxes and the checking agent. Slots are the drafts' places on the board
// (Arts and Education, Business, Engineering and IT, Health); c31 and flag the two cards that came from no one's job
const MB={tab:[56,110],tab0:[700,120],board:[660,58,1196,524],slot:[[684,84],[1068,84],[684,336],[1068,336]],c31:[1452,84],flag:[1452,336],
  lead:[260,806,58],help:[[560,812],[800,812],[1040,812],[1280,812]],check:[1660,806,50]};
// each faculty's reason, as its helper drafts it, and where it came from; how many left each faculty with no reason in the notes
const MB_REASON=[["more teacher trainees","notes"],["a new online MBA","email"],["more first-years","notes"],["fewer nursing places","email"]];
const MB_GONE=[0,9,13,9];
const mb_row=i=>MB.tab[1]+100+i*50;
// where the table is: in the middle of the wall at first, then on its left as the room opens
const mb_tab=(tt,T)=>{const u=ag_sine((tt-T.tWork+0.1)/1.4);return[lerp(MB.tab0[0],MB.tab[0],u),lerp(MB.tab0[1],MB.tab[1],u)];};
// the platform's table of counts, compact: 520 by 336 from (x, y), in blue, its gear turning; o.rows (0..1) how many rows show,
// o.hi[i] a soft blue band on row i (the checking agent comparing)
function mb_counts(c,x,y,t,o){o=o||{};const a=o.a==null?1:o.a,w=520;if(a<=0)return;ma_sprung(c,x+w/2,y+168,o.k==null?1:o.k,a,()=>{
  ag_box(c,x,y,w,336,20,{edge:AG.blue,edgeA:0.9});ag_T(c,"CENSUS COUNT",x+24,y+46,{w:700,size:28,ls:4,col:AG.blue});ma_gear(c,x+w-40,y+38,18,t*0.8,AG.blue);
  const rows=o.rows==null?1:o.rows;MA_FAC.forEach((f,i)=>{const ra=clamp(rows*4-i,0,1);if(ra<=0)return;const yy=y+100+i*50;c.save();c.globalAlpha*=ra;
    const hi=o.hi?o.hi[i]:0;if(hi>0){c.fillStyle=rgba(AG.blue,0.12*hi);rr(c,x+10,yy-34,w-20,46,10);c.fill();}
    ag_T(c,f[0],x+24,yy,{w:600,size:28});ag_T(c,ma_n(f[1]),x+404,yy,{w:800,size:28,align:"right"});ag_T(c,ma_sgn(f[2]),x+w-24,yy,{w:500,size:28,align:"right",col:AG.mut});c.restore();});
  c.strokeStyle=rgba(AG.blue,0.4);c.lineWidth=2;c.beginPath();c.moveTo(x+24,y+282);c.lineTo(x+w-24,y+282);c.stroke();
  if(rows>=1){ag_T(c,"Total",x+24,y+318,{w:700,size:28});ag_T(c,"18,412",x+404,y+318,{w:800,size:28,align:"right"});ag_T(c,"+454",x+w-24,y+318,{w:500,size:28,align:"right",col:AG.mut});}});}
// a sheet of notes or an email, small, at (x, y), scale s, turned rot
function mb_sheet(c,x,y,s,email,rot,a){if(a<=0)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(rot);c.scale(s,s);
  c.save();c.shadowColor="rgba(46,38,28,0.2)";c.shadowBlur=8;c.shadowOffsetX=-2;c.shadowOffsetY=3;c.fillStyle=email?"#F4F3F0":"#F1EBDA";c.fillRect(-38,-48,76,96);c.restore();
  if(email){c.fillStyle="rgba(60,70,80,0.18)";c.fillRect(-38,-48,76,18);c.strokeStyle="rgba(60,70,80,0.45)";c.lineWidth=2;c.beginPath();c.moveTo(-30,-44);c.lineTo(0,-34);c.lineTo(30,-44);c.stroke();}
  c.strokeStyle="rgba(70,70,76,0.35)";c.lineWidth=2.4;for(let l=0;l<5;l++){const ly=-24+l*13,lw=40+((l*11)%22);c.beginPath();c.moveTo(-28,ly);c.lineTo(-28+lw,ly);c.stroke();}c.restore();}
// the board: a pale linen panel in a thin oak edge, on the wall
function mb_board(c,a){if(a<=0)return;const [x,y,w,h]=MB.board;c.save();c.globalAlpha*=a;
  c.save();c.shadowColor="rgba(46,38,28,0.24)";c.shadowBlur=26;c.shadowOffsetX=AG.sdx;c.shadowOffsetY=12;c.fillStyle=rgba(AG_OAK.base,1);c.fillRect(x-8,y-8,w+16,h+16);c.restore();
  const g=c.createLinearGradient(x,y-8,x+w,y+h+8);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(1,rgba(AG_OAK.dark,1));c.fillStyle=g;c.fillRect(x-8,y-8,w+16,h+16);
  c.fillStyle="#ECE8E0";c.fillRect(x,y,w,h);ag_grain(c,x,y,w,h,2.2,909);c.restore();}
// a pin at (x, y)
function mb_pin(c,x,y){c.fillStyle="#8A847A";c.beginPath();c.arc(x,y,8,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.6)";c.beginPath();c.arc(x+2,y-2,3,0,TAU);c.fill();}
// a helper's draft on the board, 368 wide from (x, y): its faculty, its reason, an orange chip naming its source. st.src (0..1) the chip;
// st.tick a green tick; st.edge; st.line {text, a, col, dots, dotsA, strike, fix, fixA, warn}: a line under them, with a dot for each
// student, struck through and replaced by st.line.fix; st.deco while it flies to the board, small (its words are decoration until it lands)
function mb_draft(c,x,y,i,st){const a=st.a==null?1:st.a,w=368,L=st.line||{a:0},la=clamp(L.a||0,0,1),h=154+46*sstep(0,0.5,la)+24*(L.dotsA||0),dc=st.deco?1:0;if(a<=0)return;
  ma_sprung(c,x+w/2,y+h/2,st.k==null?1:st.k,a,()=>{ag_box(c,x,y,w,h,18,{edge:st.edge||null,edgeA:st.edgeA==null?0.9:st.edgeA});mb_pin(c,x+w/2,y+12);
    ag_T(c,MA_FAC[i][0],x+24,y+48,{w:700,size:30,deco:dc});ag_T(c,MB_REASON[i][0],x+24,y+86,{w:500,size:28,deco:dc});
    const src=MB_REASON[i][1],sa=st.src==null?1:st.src;if(sa>0){const sw=ag_tw(c,src,{w:600,size:28})+40;c.save();c.globalAlpha*=sa;c.fillStyle=rgba(AG.orange,0.12);rr(c,x+24,y+102,sw,40,20);c.fill();
      c.strokeStyle=rgba(AG.orange,0.8);c.lineWidth=2;rr(c,x+24,y+102,sw,40,20);c.stroke();ag_T(c,src,x+44,y+132,{w:600,size:28,col:AG.orange,deco:dc});c.restore();}
    if(st.tick>0)ag_tick(c,x+w-42,y+122,26,rgba(AG.green,st.tick),4.5);
    if(la>0){const ly=y+184,fa=clamp(L.fixA||0,0,1),u1=sstep(0,0.55,fa),u2=sstep(0.35,1,fa),oy=ly-26*u1;c.save();c.globalAlpha*=sstep(0.3,1,la);
      // the struck line rises out of its place as the fix rises in, one after the other, so they never sit on each other
      c.save();if(fa>0){c.beginPath();c.rect(x+8,ly-38,w-16,52);c.clip();}
      ag_T(c,L.text,x+24,oy,{w:700,size:28,col:L.col||AG.amber,a:1-u1,deco:dc});
      if(L.strike>0){const tw=ag_tw(c,L.text,{w:700,size:28});c.strokeStyle=rgba(AG.ink,0.85*(1-u1));c.lineWidth=4;c.beginPath();c.moveTo(x+20,oy-10);c.lineTo(x+28+tw*clamp(L.strike,0,1),oy-11);c.stroke();}
      if(u2>0)ag_T(c,L.fix,x+24,ly+26*(1-u2),{w:700,size:28,col:AG.green,a:u2,deco:dc});
      if(L.warn>0)ag_warn(c,x+w-42,oy-10,30,rgba(AG.amber,L.warn*(1-u1)));c.restore();c.restore();
      if(L.dotsA>0){c.save();c.globalAlpha*=L.dotsA;c.fillStyle=rgba(AG.amber,0.9);for(let j=0;j<L.dots;j++){if(L.gone&&L.gone(j))continue;c.beginPath();c.arc(x+32+j*18,y+212,6,0,TAU);c.fill();}c.restore();}}});}
const mb_dotAt=(i,j)=>[MB.slot[i][0]+32+j*18,MB.slot[i][1]+212];
const mb_dot31=k=>[MB.c31[0]+32+(k%11)*18,MB.c31[1]+78+Math.floor(k/11)*18];
// the card that rose from the three drops: "31 STUDENTS", their dots, the joint degree, its faculty: none, and then Health
function mb_c31(c,x,y,st){const a=st.a==null?1:st.a;if(a<=0)return;const w=390,h=240,fx=clamp(st.fix||0,0,1),col=mix(AG.amber,AG.green,fx);
  ma_sprung(c,x+w/2,y+h/2,st.k==null?1:st.k,a,()=>{ag_box(c,x,y,w,h,18,{edge:col,edgeA:0.9});mb_pin(c,x+w/2,y+12);ag_T(c,"31 STUDENTS",x+24,y+52,{w:700,size:28,ls:4,col:col});
    if(st.deg>0)ag_T(c,"Health data (joint degree)",x+24,y+170,{w:700,size:28,a:st.deg});
    if(st.fac>0){const f={w:500,size:28},px=x+24+ag_tw(c,"faculty: ",f);ag_T(c,"faculty:",x+24,y+214,{w:500,size:28,col:AG.mut,a:st.fac});
      const u1=sstep(0,0.5,fx),u2=sstep(0.3,0.85,fx);c.save();c.beginPath();c.rect(px-4,y+180,w-(px-x)-10,46);c.clip();
      ag_T(c,"none",px,y+214-26*u1,{w:700,size:28,col:AG.amber,a:st.fac*(1-u1)});ag_T(c,"Health",px,y+214+26*(1-u2),{w:700,size:28,col:AG.green,a:st.fac*u2});c.restore();}});}
// the checking agent's flag: the 31's status, "studying" ticked green beside all of them; 390 wide
function mb_flag(c,x,y,st){const a=st.a==null?1:st.a;if(a<=0)return;const w=390,h=226,hi=st.hi||0;ma_sprung(c,x+w/2,y+h/2,st.k==null?1:st.k,a,()=>{ag_box(c,x,y,w,h,18,{edge:AG.green,edgeA:0.9});mb_pin(c,x+w/2,y+12);
  ag_T(c,"THE 31, NOW",x+24,y+50,{w:700,size:28,ls:4,col:AG.green});
  ["studying","inactive","withdrawn","completed"].forEach((s,i)=>{const yy=y+94+i*38,on=i===0;ag_T(c,s,x+62,yy,{w:on?700:500,size:28,col:on?AG.ink:AG.mut});
    if(on){if(hi>0)ag_tick(c,x+36,yy-9,24,rgba(AG.green,hi),4.5);ag_T(c,"31",x+w-24,yy,{w:800,size:28,align:"right",col:hi>0.5?AG.green:AG.ink});}
    else{c.fillStyle=rgba(AG.mut,0.4);c.beginPath();c.arc(x+36,yy-9,5,0,TAU);c.fill();ag_T(c,"0",x+w-24,yy,{w:500,size:28,align:"right",col:AG.mut});}});});}
// what a draft's line says at time tt: the drop with no reason (three faculties), then the copied word, struck and fixed
function mb_line(i,tt,T){const n=MB_GONE[i],src=3,order=[0,1,2],k=i===src?-1:order.indexOf(i===0?2:i===1?0:1);
  const tGone=T.tThree+[0,0,0.45,0.9][i],tWord=i===src?T.tDrop-0.25:T.tOthers+0.75+k*0.55,tFix=T.tFixed+0.15+[0.22,0.5,0,0.36][i];
  const word=ag_in(tt,tWord,0.35),gA=n?ag_in(tt,tGone,0.5):0,L={a:Math.max(gA,word),text:word>0.5?"31 dropouts":n+" gone, no reason",col:AG.amber,dots:n};
  if(n){const sw=ag_io(tt,tWord-0.35,tWord+0.35,0.35);L.a=Math.max(gA*(1-sw*0.9),word);}
  L.dotsA=n?ag_in(tt,tGone+0.2,0.4)*(1-ag_in(tt,T.tSame31+0.4,0.6)):0;
  L.gone=j=>tt>T.tSame31+mb_dotDelay(i,j);L.warn=ag_in(tt,T.tNone+i*0.12,0.3);L.strike=ag_sine((tt-tFix)/0.4);L.fix="moved to a joint degree";L.fixA=ag_in(tt,tFix+0.45,0.6);
  return{L,tGone,tWord,lit:n?ag_io(tt,tGone,T.tSame31+1.6,0.5):0};}
// when a dot leaves its draft for the 31 card, and which of the 31 it becomes
const mb_dotDelay=(i,j)=>(i===1?0:i===2?9:22)*0.035+j*0.035;
const mb_dotK=(i,j)=>(i===1?0:i===2?9:22)+j;
function mb_room(c,S,tt,T){const H=MB.help;
  // the table of counts, the same way every time; the reasons beside it, in words
  const hi=MA_FAC.map((f,i)=>ag_io(tt,T.tComp+i*0.45,T.tComp+i*0.45+1.0,0.2));
  const [tx,ty0]=mb_tab(tt,T);
  // the board on the wall, empty until the helpers pin their drafts
  mb_board(c,ag_in(tt,T.tWork+0.9,0.8));
  // (the table has done its part once the camera closes on the board, and is gone when it opens again)
  mb_counts(c,tx,ty0,tt,{k:Math.min(1,ag_spr(tt,0.5,0.6)),a:ag_in(tt,0.4,0.4)*(1-ag_in(tt,T.tTwo+0.3,0.7)),rows:ag_sine((tt-T.tCounts+1.0)/1.6),hi});
  ma_pillAt(c,tx+260,ty0+400,"the same way every time",tt,T.tSame,T.tWork-0.6,{col:AG.blue});
  MA_FAC.forEach((f,i)=>{const email=MB_REASON[i][1]==="email",t0=T.tReasons+i*0.22,go=ag_sine((tt-T.tEach-i*0.3)/0.9);if(go>=1)return;const py=ty0+90+i*50;
    for(let k=0;k<3;k++){const u=ag_spr(tt,t0+k*0.12,0.45);if(u<=0)continue;const bx=tx+560+k*8,by=py-k*3-(1-Math.min(1,u))*24,x=lerp(bx,H[i][0]+(k-1)*14,go),y=lerp(by,H[i][1]-80,go)-Math.sin(Math.PI*go)*140;
      mb_sheet(c,x,y,lerp(0.42,0.6,Math.sin(Math.PI*go))*(1-0.4*sstep(0.6,1,go)),k===1?!email:email,(k-1)*0.12*(1-go),1-sstep(0.75,1,go));}});
  ma_pillAt(c,tx+680,ty0+90-2,"notes",tt,T.tReasons+0.5,T.tWork+0.3);ma_pillAt(c,tx+692,ty0+240-2,"emails",tt,T.tReasons+0.9,T.tWork+0.3);
  // the drafts pinned to the board
  const rows=MA_FAC.map((f,i)=>mb_line(i,tt,T));
  MA_FAC.forEach((f,i)=>{const t0=T.tPins+i*0.4,u=ag_sine((tt-t0)/0.9);if(u<=0)return;const [sx,sy]=MB.slot[i],R=rows[i],cmp=hi[i];
    const st={k:u<1?1:Math.min(1,ag_spr(tt,t0+0.9,0.5)*0.15+0.85),src:ag_in(tt,T.tSrc+i*0.15,0.3),tick:ag_in(tt,T.tComp+i*0.45+0.35,0.3),line:R.L,
      edge:R.lit>0?AG.amber:cmp>0?AG.blue:null,edgeA:R.lit>0?0.9*R.lit:0.9*cmp};
    if(u<1){const fx=H[i][0]-184,fy=H[i][1]-120,x=lerp(fx,sx,u),y=lerp(fy,sy,u)-Math.sin(Math.PI*u)*90,k=lerp(0.3,1,u);c.save();ag_about(c,x+184,y+80,k);mb_draft(c,x,y,i,Object.assign(st,{deco:1}));c.restore();}
    else mb_draft(c,sx,sy,i,st);});
  ma_pillAt(c,1258,612,"the board",tt,T.tBoard,T.tTwo-0.6);
  // the dots: each drop's students leave their draft and become the 31
  const c31a=ag_in(tt,T.tSame31-0.4,0.4);mb_c31(c,MB.c31[0],MB.c31[1],{a:c31a,k:Math.min(1,ag_spr(tt,T.tSame31-0.4,0.5)),deg:ag_in(tt,T.tMoved,0.5),fac:ag_in(tt,T.tNoFac,0.5),fix:ag_in(tt,T.tGot-0.1,0.8)});
  for(const i of [1,2,3])for(let j=0;j<MB_GONE[i];j++){const d0=T.tSame31+mb_dotDelay(i,j),u=ag_sine((tt-d0)/0.8);if(u<=0)continue;const A=mb_dotAt(i,j),B=mb_dot31(mb_dotK(i,j)),x=lerp(A[0],B[0],u),y=lerp(A[1],B[1],u)-Math.sin(Math.PI*u)*60;
    c.fillStyle=rgba(mix(AG.amber,AG.green,ag_in(tt,T.tGot-0.1,0.8)),0.9*c31a);c.beginPath();c.arc(x,y,6,0,TAU);c.fill();}
  // the word flying from one draft to the others
  for(const i of [1,2,0]){const R=rows[i],t0=R.tWord-0.75,u=ag_sine((tt-t0)/0.75);if(u<=0||u>=1)continue;const A=[MB.slot[3][0]+24,MB.slot[3][1]+174],B=[MB.slot[i][0]+24,MB.slot[i][1]+174],x=lerp(A[0],B[0],u),y=lerp(A[1],B[1],u)-Math.sin(Math.PI*u)*80;
    c.save();c.globalAlpha*=sstep(0,0.15,u);ag_box(c,x-12,y-34,ag_tw(c,"31 dropouts",{w:700,size:28})+24,48,12,{edge:AG.amber,edgeA:0.8});ag_T(c,"31 dropouts",x,y,{w:700,size:28,col:AG.amber});c.restore();}
  // the checking agent's flag: none of them had left
  mb_flag(c,MB.flag[0],MB.flag[1],{a:ag_in(tt,T.tFlag-0.1,0.4),k:Math.min(1,ag_spr(tt,T.tFlag-0.1,0.5)),hi:ag_in(tt,T.tStill-0.2,0.4)});
  // approved: Clara's stamp across the drafts
  ma_stamp(c,1060,318,"approved",ag_in(tt,T.tAppr-0.05,0.35),{col:AG.green,rot:-0.04,size:32});
  // the floor: the lead agent hands each faculty to one helper; each helper is read-only, in a sandbox; the checking agent compares.
  // They leave the picture as the camera closes on the board, and fade as they go, so no edge of them shows at the frame's foot
  const fl=1-ag_in(tt,T.tTwo+0.3,0.7);if(fl>0){c.save();c.globalAlpha*=fl;
  const L=MB.lead;ma_agent(c,L[0],L[1],L[2],tt,{at:T.tWork-0.3,from:[-420,0],d:0.8,ph:0.4,think:ag_io(tt,T.tLead,T.tEach+1.6,0.4)});
  H.forEach((h,i)=>{const la=ag_io(tt,T.tEach+i*0.3-0.1,T.tEach+i*0.3+1.0,0.3);if(la<=0)return;c.save();c.strokeStyle=rgba(AG.violet,0.5*la);c.lineWidth=3;c.setLineDash([10,9]);
    c.beginPath();c.moveTo(L[0]+40,L[1]-50);c.quadraticCurveTo((L[0]+h[0])/2,Math.min(L[1],h[1])-170,h[0],h[1]-50);c.stroke();c.restore();});
  H.forEach((h,i)=>{const ta=ag_in(tt,T.tBox-0.3+i*0.1,0.4),drop=6*ag_sine((tt-T.tBox-i*0.1)/0.5);ag_sandbox(c,h[0],872,150,{depth:50,label:null,a:ta});
    ma_agent(c,h[0],h[1]+drop,42,tt,{at:T.tLead-0.2+i*0.18,from:[-160,40],d:0.7,ph:1+i,lock:ag_in(tt,T.tRead+i*0.15,0.3),
      think:Math.max(ag_io(tt,T.tEach+i*0.3+0.6,T.tPins+i*0.4,0.4),ag_io(tt,T.tReads+i*0.3,T.tReads+i*0.3+1.6,0.3))});});
  ma_pillAt(c,920,708,"read-only · sandbox",tt,T.tBox+0.1,T.tTwo-0.6,{icon:"lock",col:AG.blue});
  // each helper reads what the others pinned: a thin violet line from a helper to another's draft
  for(let k=0;k<8;k++){const hk=k%4,ck=(hk+1+(k>>2))%4,t0=T.tReads+k*0.3,la=ag_io(tt,t0,t0+1.3,0.25);if(la<=0)continue;const h=H[hk],[sx,sy]=MB.slot[ck];
    c.save();c.strokeStyle=rgba(AG.violet,0.45*la);c.lineWidth=2.5;c.setLineDash([8,8]);c.beginPath();c.moveTo(h[0],h[1]-48);c.lineTo(sx+184,sy+168);c.stroke();c.restore();}
  const K=MB.check;ma_agent(c,K[0],K[1],K[2],tt,{at:T.tCheck-0.3,from:[340,0],d:0.8,ph:2.2,ring:ag_sine((tt-T.tCheck)/0.9),think:ag_io(tt,T.tComp,T.tComp+2.6,0.3)});
  ma_pillAt(c,K[0],K[1]-96,"checking agent",tt,T.tCheck+0.2,T.tTwo-0.6);c.restore();}
  // Clara, in Planning: she reads the drafts; the word is struck and the draft approved on the wall (her arms stay down)
  const ca=ag_in(tt,T.tDrafted+0.2,0.6);if(ca>0){c.save();c.globalAlpha*=ca;
    ag_person(c,"clara",560,510,0.72,{t:tt,gaze:[4,-1]});c.restore();}
  ma_scr(c,S,()=>{ma_tag(c,MA_UNI,ag_in(tt,0.6,0.6)*(1-ag_in(tt,T.tWork-0.6,0.6)));
    ma_cardAt(c,36,96,320,{kick:"Planning",title:"Clara Jensen"},tt,T.tClara-0.1,T.tGot-2.2,{kickCol:AG.mut});});}
// Jun at his desk, as the series draws it (the desk across the bottom left, his screen on it): the new test, "every degree has a
// faculty", typed on his screen and run by the platform, passes; and it runs the same way every time, with no agent
const MB_JUN={card:[880,300],pill:[1110,586]};
function mb_jun(c,S,tt,T){const a=ag_in(tt,T.tTest-0.2,0.4),pass=ag_in(tt,T.tTest+1.2,0.5),[cx,cy]=MB_JUN.card;
  ag_desk(c,-60,1040,720,{depth:150});
  ag_person(c,"jun",250,720,0.76,{t:tt,cut:890,gaze:[5,-2],smile:0.3+0.35*pass,nod:-0.035*ag_io(tt,T.tTest+1.2,T.tTest+2.6,0.4)});
  ag_screen(c,430,770,190,116,{stand:12,draw:(x,X,Y,W,H)=>{
    [0.5,0.72,0.46,0.64,0.38].forEach((l,k)=>{const u=clamp((tt-(T.tTest-0.9)-k*0.16)/0.3,0,1);if(u<=0)return;
      x.fillStyle=k===0?rgba(AG.blue,0.6):rgba(AG.ink,0.26);rr(x,X+14+(k?16:0),Y+16+k*17,(W-48)*l*u,8,4);x.fill();});
    if(pass>0)ag_tick(x,X+W-26,Y+H-24,22,rgba(AG.green,pass),4);}});
  ma_test(c,cx,cy,a,pass,Math.min(1,ag_spr(tt,T.tTest-0.2,0.5)));
  if(a>0){c.save();c.globalAlpha*=a;ma_gear(c,cx+460-40,cy+40,16,tt*0.8,AG.blue);c.restore();}
  ma_pillAt(c,MB_JUN.pill[0],MB_JUN.pill[1],"the same way every time",tt,T.tWithout-0.3,null,{col:AG.blue});}

// the board as Clara left it: every draft fixed, the 31 in Health, their status flagged, the reasons approved
function mb_final(c,a){if(a<=0)return;c.save();c.globalAlpha*=a;mb_board(c,1);
  const L={a:1,text:"31 dropouts",fix:"moved to a joint degree",fixA:1,strike:1,dots:0,dotsA:0,warn:0};
  MA_FAC.forEach((f,i)=>mb_draft(c,MB.slot[i][0],MB.slot[i][1],i,{tick:1,line:L}));
  mb_c31(c,MB.c31[0],MB.c31[1],{deg:1,fac:1,fix:1});c.fillStyle=rgba(AG.green,0.9);for(let k=0;k<31;k++){const [x,y]=mb_dot31(k);c.beginPath();c.arc(x,y,6,0,TAU);c.fill();}
  mb_flag(c,MB.flag[0],MB.flag[1],{hi:1});ma_stamp(c,1060,318,"approved",1,{col:AG.green,rot:-0.04,size:32});c.restore();}

/* ---------------------------------------------------------------- 6 · Is it alive? */
// the crowd of "Many agents", every agent there, breathing: a slow wave runs through them, each band brightening and dimming, each body
// swelling a little and glowing as it passes; off(p) (0..1) stills an agent, its band dark
function ms_crowd(c,tt,off){MA_MOB.forEach(p=>{const o=off?clamp(off(p),0,1):0,b=0.5+0.5*Math.sin(TAU*tt/3.6-p.x/420-p.y/260),w=Math.pow(b,3)*(1-o),r=p.r*(1+0.035*b*(1-o)),y=p.y+p.r-r;
  if(w>0.03){const g=c.createRadialGradient(p.x,y,r*0.6,p.x,y,r*2.4);g.addColorStop(0,rgba(AG.violet,0.14*w));g.addColorStop(1,rgba(AG.violet,0));c.fillStyle=g;c.fillRect(p.x-r*2.4,y-r*2.4,r*4.8,r*4.8);}
  ma_agent(c,p.x,y,r,tt,{ph:p.ph,core:(0.2+0.7*b)*(1-o),think:0.1*(1-o)});ms_dark(c,p.x,y,r,o);});}
// an agent's band gone dark: its light covered by the band's own matte black
function ms_dark(c,x,y,r,o){if(o<=0)return;const bw=r*1.3,bh=r*0.32,by=y-r*0.11,ih=bh-r*0.11;c.fillStyle=rgba(ms_hex(AG.visor),o);rr(c,x-bw/2+r*0.045,by-ih/2,bw-r*0.09,ih,ih/2);c.fill();}
const ms_hex=h=>typeof h==="string"&&h[0]==="#"?[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]:h;
// the cell's part being replaced while the camera watches: ma_cellLive's own cycle (3.2 s), timed so a worn part at the top right starts
// to fade at t0 and the new part, made inside, reaches its place 3.2 s later
function ms_cellPart(tt,t0){const C=MA_CELL,tc=tt-t0+32,cyc=Math.floor(tc/3.2),ph=(tc-cyc*3.2)/3.2,slot=(cyc*29)%C.n,an=slot/C.n*TAU,sx=C.cx+Math.cos(an)*C.r,sy=C.cy+Math.sin(an)*C.r,u=sstep(0.4,1,ph);
  return{tc,cyc,ph,sx,sy,nx:lerp(C.cx-30,sx,u),ny:lerp(C.cy+20,sy,u)};}
// soft arrows turning round the cell's middle, where parts are made: the making never stops
function ms_making(c,tt,a){if(a<=0)return;const C=MA_CELL,cx=C.cx-30,cy=C.cy+20,R=176;c.save();c.globalAlpha*=a;c.strokeStyle="rgba(150,116,86,0.55)";c.fillStyle="rgba(150,116,86,0.55)";c.lineWidth=7;c.lineCap="round";
  for(let k=0;k<3;k++){const a0=tt*0.35+k*TAU/3,a1=a0+1.25;c.beginPath();c.arc(cx,cy,R,a0,a1);c.stroke();const hx=cx+Math.cos(a1)*R,hy=cy+Math.sin(a1)*R,d=a1+Math.PI/2;
    c.beginPath();c.moveTo(hx+Math.cos(d)*20,hy+Math.sin(d)*20);c.lineTo(hx+Math.cos(d+2.4)*16,hy+Math.sin(d+2.4)*16);c.lineTo(hx+Math.cos(d-2.4)*16,hy+Math.sin(d-2.4)*16);c.closePath();c.fill();}c.restore();}
// a ring round a small thing being watched, in the cell's own brown
function ms_ring(c,x,y,r,a){if(a<=0)return;c.save();c.strokeStyle="rgba(120,88,60,"+(0.75*a)+")";c.lineWidth=4;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.restore();}
// the tortoise's trip, timed: it wanders from t0, slowing as its battery falls, until tLow; then it turns to the hutch's light and runs home
// by tHome. Returns [x, y, heading]
function ms_trip(tt,t0,tLow,tHome){const k=tt<tLow?0.747*ag_eo((tt-t0)/(tLow-t0)):lerp(0.747,1,ag_sine((tt-tLow-0.25)/(tHome-tLow-0.25)));return ma_tortoisePath(k);}
// the computer's design, as a small card: a rounded body of cells, skin cells pale and heart cells rose, laid out on a grid
const MS_DESIGN=["...XXXX...",".XXXXXXXX.","XXXXXXXXXX","XXXXXXHHHX",".XXXXHHHH.","...XXHH..."];
function ms_design(c,x,y,a,k){if(a<=0)return;const w=420,h=330;ma_sprung(c,x+w/2,y+h/2,k==null?1:k,a,()=>{ag_box(c,x,y,w,h,22,{});
  ag_T(c,"to a computer's",x+32,y+62,{w:700,size:36});ag_T(c,"design",x+32,y+106,{w:700,size:36});
  const cs=30,gx=x+(w-10*cs)/2,gy=y+142;MS_DESIGN.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch===".")return;c.fillStyle=ch==="H"?"rgb(200,128,116)":"rgb(228,204,186)";
    c.fillRect(gx+i*cs+1.5,gy+j*cs+1.5,cs-3,cs-3);}));});}
// a scale for the microscope's view: "under a millimetre", over a bar a millimetre long at the view's scale
function ms_scale(c,x,y,a,k){if(a<=0)return;const w=420,h=196,L=340;ma_sprung(c,x+w/2,y+h/2,k==null?1:k,a,()=>{ag_box(c,x,y,w,h,22,{});
  ag_T(c,"under a millimetre",x+32,y+62,{w:700,size:36});c.strokeStyle=rgba(AG.ink,0.85);c.lineWidth=4;c.beginPath();c.moveTo(x+40,y+112);c.lineTo(x+40+L,y+112);
  c.moveTo(x+40,y+98);c.lineTo(x+40,y+126);c.moveTo(x+40+L,y+98);c.lineTo(x+40+L,y+126);c.stroke();ag_T(c,"1 mm",x+40+L/2,y+164,{w:600,size:28,align:"center",col:AG.mut});});}

// the plain switch on the wall, where the hand turns the crowd off
const MS_SW=[420,470];
scene("alive",(ctx,S,t,sc)=>{
  const T={tAre:wAt(sc,"seem","Are they"),tChile:wAt(sc,"chile","In Chile"),tSaid:wAt(sc,"chile","said a living"),tKeeps:wAt(sc,"chile","a cell keeps"),
    tAround:wAt(sc,"tortoise","Around"),tKept:wAt(sc,"tortoise","kept itself going"),tLow:wAt(sc,"tortoise","ran low"),tHomeW:wAt(sc,"tortoise","went home"),tRe:wAt(sc,"tortoise","recharge"),
    tFrog:wAt(sc,"frog","In twenty"),tComp:wAt(sc,"frog","a computer"),tTiny:wAt(sc,"frog","tiny bodies"),tSwim:wAt(sc,"frog","swim"),tHeal:wAt(sc,"frog","heal"),
    tYear:wAt(sc,"later","A year later"),tGath:wAt(sc,"later","gathered"),tNew:wAt(sc,"later","new ones"),
    tToday:wAt(sc,"none","Today"),tSelf:wAt(sc,"none","make themselves"),tRun:wAt(sc,"none","run only"),tWe:wAt(sc,"none","we run them")};
  const sCell=T.tChile-0.85,sTort=T.tAround-0.8,sScope=T.tFrog-0.75,sRoom=T.tToday-0.8;
  ag_shots(ctx,S,t,sc.dur,[
    // the room, and a crowd of agents breathing as one
    {at:0,place:"lab",keys:[[0,960,694,1.4]],push:0.04,draw:(c,tt)=>{ma_switch(c,MS_SW[0],MS_SW[1],1,1);ms_crowd(c,tt);}},
    // a cell, as a biology book draws it: it keeps making the parts that make it; the camera closes on one part being replaced
    {at:sCell,place:"maCell",keys:[[0,960,540,1],[T.tKeeps-0.4,1040,415,1.3]],d:1.6,push:0,draw:(c,tt)=>{
      const P=ms_cellPart(tt,T.tKeeps);ma_cellLive(c,P.tc,{});ms_making(c,tt,ag_in(tt,T.tKeeps-0.3,0.6));
      if(P.cyc===10){ms_ring(c,P.sx,P.sy,34,P.ph<0.45?ag_io(P.ph*3.2,0.05,1.3,0.25):0);if(P.ph>=0.4){c.save();const g=c.createRadialGradient(P.nx,P.ny,4,P.nx,P.ny,46);g.addColorStop(0,"rgba(255,246,228,0.9)");g.addColorStop(1,"rgba(255,246,228,0)");
        c.fillStyle=g;c.fillRect(P.nx-50,P.ny-50,100,100);c.restore();ms_ring(c,P.nx,P.ny,32,sstep(0.4,0.5,P.ph));}}
      ma_scr(c,S,()=>{ma_tag(c,"Santiago, Chile · 1972",ag_in(tt,T.tChile-0.2,0.5));
        ma_cardAt(c,1370,300,520,{kick:"Maturana and Varela",title:"a living thing makes itself"},tt,T.tSaid-0.1,null,{kickCol:AG.mut});});}},
    // near Bristol: the robot tortoise wanders, its battery falls, and it runs home to the hutch's light to recharge
    {at:sTort,place:"maBristol",keys:[[0,960,540,1]],push:0.03,draw:(c,tt)=>{
      const [x,y,ang]=ms_trip(tt,sTort,T.tLow,T.tRe-0.1),home=tt>T.tLow,dock=ag_in(tt,T.tRe,0.6),
        look=home?lerp(Math.sin(tt*2.2)*1.2,Math.atan2(MA_BR.hutch[1]-y,MA_BR.hutch[0]-x),ag_in(tt,T.tLow-0.2,0.5)):Math.sin(tt*2.2)*1.2;
      ma_tortoise(c,x,y,ang,{t:tt,look,charge:dock});
      const lv=tt<T.tRe?lerp(1,0.12,clamp((tt-sTort-0.4)/(T.tLow-sTort-0.4),0,1)):0.12+0.88*ag_in(tt,T.tRe+0.2,1.3),amb=1-sstep(0.3,0.45,lv),chg=ag_in(tt,T.tRe+0.2,0.4);
      ma_battery(c,x,y-214,lv,{col:mix(mix([92,94,100],AG.green,chg),AG.amber,chg>0.5?0:amb),a:ag_in(tt,sTort+0.5,0.5)});
      ma_scr(c,S,()=>{ma_tag(c,"Near Bristol · about 1950",ag_in(tt,T.tAround-0.2,0.5));
        ma_cardAt(c,64,140,460,{kick:"Grey Walter",title:"it kept itself going"},tt,T.tKept-0.1,null,{kickCol:AG.mut});});}},
    // a microscope's view: tiny bodies of frog cells, made to a computer's design, swim, and one heals; a year later, some gather
    // loose cells into new bodies
    {at:sScope,place:"maScope",keys:[[0,960,540,1]],push:0.03,draw:(c,tt)=>{
      const m1=ag_in(tt,T.tYear-0.3,0.8),cut=ag_in(tt,T.tSwim-0.1,0.25)*(1-ag_in(tt,T.tHeal,1.3));
      if(m1<1){c.save();c.globalAlpha*=1-m1;ma_scopeLive(c,tt,{cut});c.restore();}
      if(m1>0){c.save();c.globalAlpha*=m1;ma_scopeLive(c,tt,{mode:1,grow:clamp((tt-T.tGath+0.3)/(T.tNew+0.9-T.tGath+0.3),0,1)});c.restore();}
      // a thin line from the design to the body made to it
      const da=ag_in(tt,T.tComp,0.5)*(1-m1);if(da>0){const p=ma_swimAt(1,tt);c.save();c.strokeStyle=rgba(AG.ink,0.5*da);c.lineWidth=2.5;c.setLineDash([10,9]);
        c.beginPath();c.moveTo(1466,470);c.lineTo(p[0]+MA_SWIM[1][2]*0.95,p[1]);c.stroke();c.restore();}
      ma_scr(c,S,()=>{ma_tag(c,"United States · 2020 and 2021",ag_in(tt,T.tFrog-0.2,0.5));
        ms_design(c,1466,300,ag_in(tt,T.tComp-0.2,0.4)*(1-m1),Math.min(1,ag_spr(tt,T.tComp-0.2,0.5)));
        ms_scale(c,40,380,ag_in(tt,T.tTiny-0.1,0.4)*(1-m1),Math.min(1,ag_spr(tt,T.tTiny-0.1,0.5)));});}},
    // back in the room, the crowd breathing; the camera closes on a plain switch, a hand turns it off, and as the camera opens again the
    // crowd goes still, the dark spreading from the switch; the hand stays on it
    {at:sRoom,place:"lab",keys:[[0,960,694,1.4],[T.tSelf,560,470,2.2],[T.tWe+0.4,960,694,1.4]],d:1.4,push:0,draw:(c,tt)=>{
      const reach=ag_in(tt,T.tRun-0.35,0.9),press=ag_io(tt,T.tWe-0.14,T.tWe+0.1,0.12);
      ma_switch(c,MS_SW[0],MS_SW[1],1-ag_in(tt,T.tWe,0.12),1);
      ms_crowd(c,tt,p=>ag_in(tt,T.tWe+0.5+Math.max(0,p.x-MS_SW[0])/1500+(p.y-680)/900,0.3));
      ag_person(c,"jun",-170,432,1.5,{t:tt,pose:"hang",pose2:{near:[88+2*press,96,"point"]},mix:reach});
      ma_scr(c,S,()=>ma_pillAt(c,1100,300,"they run because we run them",tt,T.tWe+0.2,null));}}],0.8);
});

/* ---------------------------------------------------------------- 7 · What we don't know */
// the imagined night: the agent that starts the others, and the three it starts (x, y, r) on the floor; three drafts pinned to the wall
// (the middle one mended); the clock that turns through the night
const MC={par:[880,792,60],kids:[[600,810,48],[1150,804,52],[1400,818,44]],drafts:[[500,340],[810,340],[1120,340]],dw:280,clock:[1556,286,68]};
// the agents' state at tt: where each is, its size, and how its band glows; drawn twice, the body under the night and the light over it
function mc_agents(tt,T){const P=MC.par,out=[{x:P[0],y:P[1],r:P[2],at:-9,from:null,ph:0.3,core:0.7,think:Math.max(0.25,ag_io(tt,T.tAgents-0.3,T.tStart+1.4,0.4))}];
  MC.kids.forEach((k,i)=>{const at=T.tStart+0.15+i*0.32;if(tt<at)return;const g=ag_sine((tt-at)/0.9),r=k[2]*lerp(0.35,1,g);
    out.push({x:k[0],y:k[1]+k[2]-r,r,at,from:[P[0]-k[0],0],ph:1+i*1.3,core:0.65,think:0.3+0.15*Math.sin(tt*0.9+i*2)});});return out;}
// the night room: drafts on the wall, a clock turning through the night, agents starting agents, one mending another's draft
function mc_night(c,S,tt,T){const A=mc_agents(tt,T),mend=ag_in(tt,T.tMend+0.8,0.6);
  MC.drafts.forEach(([x,y],i)=>{ma_draft(c,x,y,MC.dw,1,1);mb_pin(c,x+MC.dw/2,y+12);
    if(i===1){c.fillStyle=rgba(mix(AG.amber,AG.green,mend),0.95);rr(c,x+24,y+90,MC.dw-120,10,5);c.fill();
      if(mend<1)ag_warn(c,x+MC.dw-40,y+94,28,rgba(AG.amber,1-mend));if(mend>0)ag_tick(c,x+MC.dw-40,y+92,26,rgba(AG.green,mend),4.5);}});
  const [cx,cy,cr]=MC.clock;ma_clock(c,cx,cy,cr,23+7*ag_sine((tt-T.tKeep+0.2)/(T.tMight-T.tKeep+0.6)),1);
  const P=A.map(a=>Object.assign(a,{p:ma_agent(c,a.x,a.y,a.r,tt,{at:a.at,from:a.from,d:0.9,ph:a.ph,core:a.core,think:a.think})}));
  ag_roomLight(c,1,{night:true});
  // the bands' light over the night; a violet pulse from the parent as each new agent starts
  P.forEach(a=>ag_model(c,a.p[0],a.p[1],a.r,{t:tt+a.ph,core:a.core,think:a.think,only:"light"}));
  MC.kids.forEach((k,i)=>{const t0=T.tStart+0.05+i*0.32,u=(tt-t0)/0.9;if(u<=0||u>=1)return;const [x,y,r]=MC.par;
    c.save();c.strokeStyle=rgba(AG.violet,0.55*(1-u));c.lineWidth=4;c.beginPath();c.arc(x,y,r*lerp(1.15,2.6,ag_eo(u)),0,TAU);c.stroke();c.restore();});
  // one agent mends another's draft: a thin violet line to it, and the wrong line turns green
  const la=ag_io(tt,T.tMend,T.tMend+2.0,0.35),k=P[2];if(la>0&&k){const [dx,dy]=MC.drafts[1];c.save();c.strokeStyle=rgba(AG.violet,0.7*la);c.lineWidth=3;c.setLineDash([10,9]);
    c.beginPath();c.moveTo(k.p[0]-8,k.p[1]-k.r*1.05);c.quadraticCurveTo(k.p[0]-40,dy+260,dx+MC.dw*0.62,dy+124);c.stroke();c.restore();}
  // what they might do: one good, one not; neither known
  ma_cardAt(c,370,150,480,{kick:"They might find",title:"what no person could"},tt,T.tFind-0.1,T.tKnow+0.2,{edge:AG.green,kickCol:AG.green});
  ma_cardAt(c,920,150,480,{kick:"Or settle on",title:"habits no person chose"},tt,T.tHabits-0.1,T.tKnow+0.2,{edge:AG.amber,kickCol:AG.amber});
  ma_scr(c,S,()=>{const g=c.createRadialGradient(960,540,420,960,540,1180);g.addColorStop(0,"rgba(16,18,32,0)");g.addColorStop(1,"rgba(16,18,32,0.38)");c.fillStyle=g;c.fillRect(0,0,W,H);
    ma_tag(c,"Imagined",ag_in(tt,T.tOnly-0.2,0.5),{dashed:true});});}
// the mound again: the idea then (a chimney), then what sensors showed years later (a lung: the day's warmth and the night's cool push
// the air one way, then the other), the mound swelling a little like a chest
function mc_mound(c,S,tt,T){const idea=ag_in(tt,T.sMound+0.2,1.2)*(1-ag_in(tt,T.tChim,0.9)),lung=ag_in(tt,T.tLungW-0.15,1.0),n=ag_sine((tt-T.tCool+0.1)/1.5),
    br=lung*(0.5-0.5*Math.cos(TAU*Math.max(0,tt-T.tLungW)/4.2)),M=MA_MD;
  const swell=fn=>{c.save();ag_about(c,M.cx,M.base,1+0.012*br);fn();c.restore();};
  if(br>0)swell(()=>{ma_poly(c,MA_MP);c.clip();c.drawImage(ag_place("maMoundCut"),0,0);});
  ma_moundNight(c,n);
  swell(()=>{if(idea>0){c.save();c.globalAlpha*=idea;ma_moundIdea(c,tt,1,1);c.restore();}ma_moundLung(c,tt,n,lung);
    [[898,420,0.3],[806,640,2.75],[1036,630,0.42]].forEach(([x,y,ang],i)=>{const t0=T.tSensors-0.1+i*0.25,u=ag_eo(clamp((tt-t0)/0.6,0,1));if(u<=0)return;
      c.save();c.translate(Math.cos(ang)*60*(1-u),Math.sin(ang)*60*(1-u));ma_sensor(c,x,y,ang,u);
      const bl=ag_in(tt,t0+0.7,0.3)*(0.5+0.5*Math.sin((tt-t0)*4.4+i));c.fillStyle=rgba(AG.blue,0.85*bl);c.beginPath();c.arc(x+Math.cos(ang)*30,y+Math.sin(ang)*30,4.5,0,TAU);c.fill();c.restore();});});
  const ta=ag_in(tt,T.sMound+0.9,0.5)*(1-ag_in(tt,T.tChim+0.2,0.5));if(ta>0)ma_tag(c,"the idea, then",ta,{x:1260,y:300,dashed:true});
  const sa=ag_in(tt,T.tLungW-0.1,0.5);if(sa>0)ma_tag(c,"what sensors showed",sa,{x:1260,y:300});
  ma_pillAt(c,1360,200,"day's warmth",tt,T.tWarmth-0.1,null,{col:[176,96,62]});ma_pillAt(c,1400,700,"night's cool",tt,T.tCool-0.1,null,{col:[96,112,124]});
  ma_scr(c,S,()=>ma_tag(c,"India and Namibia · 2015 and 2017",ag_in(tt,T.tYears-0.2,0.5)));}
// Eastgate late in the afternoon: the idea it was built on, dashed, struck through; and still, it works
function mc_eastgate(c,S,tt,T){ma_eastgateLife(c,tt);
  const g=c.createLinearGradient(W,0,0,H*0.8);g.addColorStop(0,"rgba(255,176,104,0.34)");g.addColorStop(0.55,"rgba(255,176,104,0.1)");g.addColorStop(1,"rgba(70,44,34,0.14)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const ta=ag_in(tt,T.tEGwas+0.2,0.5);if(ta>0){const x=470,y=130;ma_tag(c,"the idea, then",ta,{x,y,dashed:true});const w=ag_tw(c,"the idea, then",{w:500,size:28,f:"mono"})+48,k=ag_sine((tt-T.tWrongI-0.1)/0.5);
    if(k>0){c.save();c.globalAlpha*=ta;c.strokeStyle=rgba(AG.amber,0.95);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(x-10,y+34);c.lineTo(x-10+(w+20)*k,y+24);c.stroke();c.restore();}}
  ma_pillAt(c,1470,170,"it works",tt,T.tWorks-0.05,null,{icon:"tick",col:AG.green});
  ma_scr(c,S,()=>ma_tag(c,"Harare · after 1996",ag_in(tt,T.sEG+0.5,0.5)));}
// the plant room: the pen draws the offices' warmth; it runs over the comfort line, in amber; the engineer turns a dial, and it settles
function mc_plant(c,S,tt,T){const tp=T.tTuned,u=tt<tp?lerp(0.3,0.5,clamp((tt-T.sPlant)/(tp-T.sPlant),0,1)):lerp(0.5,0.98,clamp((tt-tp)/(T.sTeam+0.8-tp),0,1));
  ma_chart(c,u,0.52,1,1);const turn=ag_sine((tt-tp-0.05)/1.0);ma_dial(c,0,lerp(0.3,0.62,turn));ma_dial(c,1,0.46);ma_dial(c,2,0.55);ma_dial(c,3,0.4);
  const reach=ag_in(tt,tp-0.6,0.7);
  ag_person(c,MA_ENGINEER,800,640,0.98,{t:tt,pose:"hang",pose2:{near:[64,113,"hold"]},mix:reach,gaze:[5,-4]});
  ma_pillAt(c,1092,252,"ran warm",tt,T.tRanWarm-0.1,null,{icon:"warn",col:AG.amber});
  ma_scr(c,S,()=>ma_tag(c,"Harare · after 1996",1));}
// a small gauge: an arc with its needle
function mc_gauge(c,x,y,s,col){const cy=y+s*0.2;c.save();c.strokeStyle=col;c.fillStyle=col;c.lineWidth=s*0.12;c.lineCap="round";c.beginPath();c.arc(x,cy,s*0.48,Math.PI*1.08,Math.PI*1.92);c.stroke();
  const a=Math.PI*1.66;c.beginPath();c.moveTo(x,cy);c.lineTo(x+Math.cos(a)*s*0.42,cy+Math.sin(a)*s*0.42);c.stroke();c.beginPath();c.arc(x,cy,s*0.09,0,TAU);c.fill();c.restore();}
// how Jun's team keeps its agents: measured, read-only, a person decides, each row as it is said
function mc_kept(c,tt,T,a){if(a<=0)return;const x=56,y=150,w=520,h=320,R=[["measured",T.tMeasured],["read-only",T.tRead],["a person decides",T.tPerson]];
  ma_sprung(c,x+w/2,y+h/2,Math.min(1,ag_spr(tt,T.tSameWay-0.2,0.5)),a,()=>{ag_box(c,x,y,w,h,22,{});ag_T(c,"JUN'S TEAM",x+32,y+56,{w:700,size:28,ls:4,col:AG.mut});
    R.forEach(([s,t0],i)=>{const ra=ag_in(tt,t0-0.1,0.35);if(ra<=0)return;const yy=y+134+i*68,ix=x+58,iy=yy-12;c.save();c.globalAlpha*=ra;c.translate(-16*(1-ag_eo(clamp((tt-t0+0.1)/0.45,0,1))),0);
      if(i===0)mc_gauge(c,ix,iy,40,rgba(AG.blue,1));else if(i===1)ag_lock(c,ix,iy+6,40,rgba(AG.blue,1));else ag_tick(c,ix,iy,30,rgba(AG.green,1),5);
      ag_T(c,s,x+102,yy,{w:700,size:36});c.restore();});});}
// the university's board as Clara left it, the team on the floor: measured (the checking agent), read-only (the helpers' locks), a person
// decides (the stamp); together, the 31 they found
function mc_board(c,S,tt,T){mb_final(c,1);
  const pr=ag_in(tt,T.tPerson,0.35);if(pr>0)ma_stamp(c,1060,318,"approved",pr,{col:AG.green,rot:-0.04,size:32,a:0.7*(1-ag_in(tt,T.tPerson+0.45,0.6))});
  const gl=ag_in(tt,T.tTogether,1.0);if(gl>0){const [x,y]=MB.c31;c.save();c.shadowColor=rgba(AG.green,0.8*gl);c.shadowBlur=34;c.strokeStyle=rgba(AG.green,0.75*gl);c.lineWidth=5;rr(c,x-6,y-6,402,252,22);c.stroke();c.restore();}
  const L=MB.lead;ma_agent(c,L[0],L[1],L[2],tt,{ph:0.4,core:0.75,think:0.25});
  MB.help.forEach((h,i)=>{ag_sandbox(c,h[0],872,150,{depth:50,label:null});const p=ma_agent(c,h[0],h[1]+6,42,tt,{ph:1+i,lock:1,core:0.75,think:0.2+0.2*Math.sin(tt*0.8+i*1.7)});
    const u=(tt-T.tRead+0.05-i*0.08)/0.8;if(u>0&&u<1){c.save();c.strokeStyle=rgba(AG.blue,0.7*(1-u));c.lineWidth=3;c.beginPath();c.arc(p[0]+42*0.78,p[1]-42*0.72,lerp(18,46,ag_eo(u)),0,TAU);c.stroke();c.restore();}});
  const K=MB.check,ms=ag_io(tt,T.tMeasured-0.1,T.tMeasured+1.3,0.3);ma_agent(c,K[0],K[1],K[2],tt,{ph:2.2,ring:1,think:0.2+0.6*ms,core:0.75+0.25*ms});
  if(ms>0){c.save();c.shadowColor=rgba(AG.green,0.9*ms);c.shadowBlur=24;c.strokeStyle=rgba(AG.green,0.6*ms);c.lineWidth=4;c.beginPath();c.arc(K[0],K[1],K[2]*1.22,0,TAU);c.stroke();c.restore();}
  ag_roomLight(c,1);
  mc_kept(c,tt,T,ag_in(tt,T.tSameWay-0.2,0.4)*(1-ag_in(tt,T.tTogether-0.1,0.6)));
  ma_scr(c,S,()=>ma_tag(c,MA_UNI,ag_in(tt,T.sTeam+0.5,0.5)*(1-ag_in(tt,T.tTogether-0.1,0.6))));}
scene("close",(ctx,S,t,sc)=>{
  const T={tOnly:wAt(sc,"imagine","only imagined"),tAgents:wAt(sc,"imagine","agents that"),tStart:wAt(sc,"imagine","start other"),tMend:wAt(sc,"imagine","mend each"),
    tKeep:wAt(sc,"imagine","keep systems"),tMight:wAt(sc,"might","They might"),tFind:wAt(sc,"might","find what"),tHabits:wAt(sc,"might","or settle"),tKnow:wAt(sc,"might","We don't know"),
    tNeither:wAt(sc,"neither","Neither"),tYears:wAt(sc,"lung","Years later"),tSensors:wAt(sc,"lung","sensors"),tChim:wAt(sc,"lung","chimney"),tLungW:wAt(sc,"lung","a lung"),
    tWarmth:wAt(sc,"pushed","day's warmth"),tCool:wAt(sc,"pushed","night's cool"),tEGwas:wAt(sc,"wrong","Eastgate was"),tWrongI:wAt(sc,"wrong","wrong idea"),tWorks:wAt(sc,"wrong","it works"),
    tMeasuring:wAt(sc,"measuring","measuring"),tTuned:wAt(sc,"measuring","tuned"),tRanWarm:wAt(sc,"measuring","ran warm"),
    tTeam:wAt(sc,"same","Jun's team"),tSameWay:wAt(sc,"same","the same way"),tMeasured:wAt(sc,"same","measured"),tRead:wAt(sc,"same","read-only"),tPerson:wAt(sc,"same","with a person"),tTogether:wAt(sc,"same","so together"),
    tTake:wAt(sc,"takeaway","When many"),tYet:wAt(sc,"takeaway","and we don't"),tNext:wAt(sc,"next","Next")};
  T.sMound=T.tNeither-0.7;T.sEG=T.tEGwas-0.6;T.sPlant=T.tMeasuring-0.1;T.sTeam=T.tTeam-0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // imagined: the room at night, agents starting agents, mending each other's work, a clock turning through the night
    {at:0,place:"labNight",keys:[[0,900,560,1.2],[T.tMight-0.6,900,530,1.26]],d:2.4,push:0,draw:(c,tt)=>mc_night(c,S,tt,T)},
    // the mound: the idea then, then sensors, a lung, the day and the night
    {at:T.sMound,place:"maMoundCut",keys:[[0,900,520,1.06],[T.tLungW-0.4,900,500,1.14]],d:1.8,push:0,draw:(c,tt)=>mc_mound(c,S,tt,T)},
    // Eastgate, later: built on the wrong idea, and still it works
    {at:T.sEG,place:"maEastgate",keys:[[0,960,540,1.0]],push:0.04,draw:(c,tt)=>mc_eastgate(c,S,tt,T)},
    // its plant room: measured, and tuned when the offices ran warm
    {at:T.sPlant,place:"maPlant",keys:[[0,1000,540,1.04]],push:0.04,draw:(c,tt)=>mc_plant(c,S,tt,T)},
    // the university: Jun's team keeps its agents the same way; together they found the 31
    {at:T.sTeam,place:"lab",keys:[[0,960,540,1],[T.tTogether-0.2,1180,430,1.22]],d:1.8,push:0,draw:(c,tt)=>{const f=1-ag_in(tt,T.tTake+0.1,0.8);if(f<=0)return;
      c.save();c.globalAlpha*=f;mc_board(c,S,tt,T);c.restore();}}],0.8);
  // the takeaway, then the end card; the next series named as the voice says it
  const t0=T.tTake-0.4;ag_veil(ctx,S,0.5*ag_in(t,t0,1.0));ag_end(ctx,S,t,t0,"Many agents, and what emerges",null,"Film 9 of 9");
  const a1=ag_in(t,t0+0.6,0.9),a2=ag_in(t,T.tYet-0.3,0.7);if(a1>0){setScreen(ctx,S);ag_T(ctx,"When many work together, something new appears,",960,296,{w:700,size:48,align:"center",a:a1});
    if(a2>0)ag_T(ctx,"and we don't yet know what.",960,364,{w:700,size:48,align:"center",a:a2});}
  const na=ag_in(t,T.tNext-0.1,0.6);if(na>0){setScreen(ctx,S);ag_T(ctx,"Next: Agents at work on data",960,790,{w:600,size:30,align:"center",col:AG.mut,a:na});}
});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["board", "alive"]);

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
