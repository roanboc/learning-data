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

// From words to data · Meaning machines can read. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"before":{"name":"They tried before","lead":1.6,"tail":1.0,"vo":[
 {"id":"linn","gap":0.8,"text":"In the 1750s, Linnaeus gave each species a two-part name, and a place in a hierarchy. Scientists still use his system.","say":"In the seventeen fifties, Linnaeus gave each species a two-part name, and a place in a hierarchy. Scientists still use his system."},
 {"id":"wilkins","gap":0.8,"text":"A century earlier, John Wilkins designed a language to classify everything in the universe. It never took hold."},
 {"id":"night","gap":0.8,"text":"In 1860, Florence Nightingale asked hospitals to record the same things, in the same way, so that they could be compared.","say":"In eighteen sixty, Florence Nightingale asked hospitals to record the same things, in the same way, so that they could be compared."},
 {"id":"icd","gap":0.8,"text":"An international list of causes of death followed in 1893. Today, it's the International Classification of Diseases.","say":"An international list of causes of death followed in eighteen ninety-three. Today, it's the International Classification of Diseases."},
 {"id":"lesson","gap":0.8,"text":"Shared definitions let strangers compare. The ones that last are made for a purpose, not for everything."}]},
"guesses":{"name":"Genie guesses","lead":1.0,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"At the university, the Head of School asks Genie: which learners are one microcredential away from a graduate certificate?"},
 {"id":"finds","gap":0.8,"text":"Genie finds the tables. It finds a column called is_micro, and another called stack_ok.","say":"Genie finds the tables. It finds a column called is micro, and another called stack okay."},
 {"id":"wrong","gap":0.8,"text":"But the stacking rules live in a policy document that no tool can read. Genie guesses, and it's wrong."},
 {"id":"read","gap":0.8,"text":"An AI assistant answers from what it can read. Meaning kept in documents is invisible to it."}]},
"four":{"name":"Four ways to write meaning down","lead":1.0,"tail":1.0,"vo":[
 {"id":"gloss","gap":0.8,"text":"There are four common ways to write meaning down, and they stack. A glossary: words and their definitions, for people."},
 {"id":"tax","gap":0.8,"text":"A taxonomy: kinds of things in a hierarchy, like Linnaeus's."},
 {"id":"onto","gap":0.8,"text":"An ontology: concepts, the relationships between them, and rules that a machine can check and reason with."},
 {"id":"sem","gap":0.8,"text":"And a semantic layer: how each number is calculated, defined once."},
 {"id":"stack","gap":0.8,"text":"They aren't rivals. Each one answers a different question."}]},
"ontology":{"name":"The ontology","lead":1.0,"tail":1.0,"vo":[
 {"id":"rules","gap":0.8,"text":"In the ontology, the rules are written as statements. A microcredential is a kind of credential. A graduate certificate accepts up to four approved microcredentials towards its credit."},
 {"id":"graph","gap":0.8,"text":"Connect the university's data to these statements, and it becomes a knowledge graph: learners, credentials and courses, linked by what they mean."},
 {"id":"aristotle","gap":0.8,"text":"It's Aristotle's recipe made formal: the kind of thing, and what sets it apart, in a form a machine can use."}]},
"semantic":{"name":"The semantic layer","lead":1.0,"tail":1.0,"vo":[
 {"id":"once","gap":0.8,"text":"In the semantic layer, credentials awarded this year is defined once: what's counted, what's left out, which date, and at what grain."},
 {"id":"tools","gap":0.8,"text":"Dashboards, spreadsheets and Genie all ask it, instead of each writing its own version."},
 {"id":"open","gap":0.8,"text":"Open formats for sharing these definitions between tools are starting to appear."}]},
"standards":{"name":"Standards","lead":1.0,"tail":1.0,"vo":[
 {"id":"blank","gap":0.8,"text":"You don't have to start from a blank page. Finance, health, insurance and retail all publish shared models, and so does education."},
 {"id":"creds","gap":0.8,"text":"Digital credentials have open standards too, with issuer, holder and evidence in them."},
 {"id":"three","gap":0.8,"text":"Even microcredential has official definitions: from Australia, from the European Union, and from UNESCO. They don't quite match."},
 {"id":"choose","gap":0.8,"text":"So choose deliberately. Check, adopt, extend and record, as in A Sharper Sketch, at every layer."}]},
"again":{"name":"Genie, again","lead":1.0,"tail":1.0,"vo":[
 {"id":"asks","gap":0.8,"text":"The Head of School asks again. This time, Genie asks back: approved for stacking, or all microcredentials?"},
 {"id":"answer","gap":0.8,"text":"Then it answers, and shows the definition it used."},
 {"id":"evid","gap":0.8,"text":"Studies have found that grounding an assistant in explicit meaning makes its answers measurably more accurate. The difference is the meaning it can read."}]},
"end":{"name":"Pull back","lead":1.0,"tail":1.0,"vo":[
 {"id":"tri","gap":0.8,"text":"The triangle from the start of the series returns: the word, in English and in Spanish; the idea, now written in the ontology; and the data it points to."},
 {"id":"next","gap":0.8,"text":"Next: keeping all of it true, while everything changes."}]}
};

const VODUR={"before/linn": 8.257, "before/wilkins": 6.827, "before/night": 7.888, "before/icd": 8.168, "before/lesson": 6.433, "guesses/ask": 7.493, "guesses/finds": 5.611, "guesses/wrong": 6.161, "guesses/read": 5.7, "four/gloss": 7.036, "four/tax": 3.827, "four/onto": 6.531, "four/sem": 4.139, "four/stack": 3.102, "ontology/rules": 12.123, "ontology/graph": 8.783, "ontology/aristotle": 6.67, "semantic/once": 8.112, "semantic/tools": 5.074, "semantic/open": 4.877, "standards/blank": 8.015, "standards/creds": 5.131, "standards/three": 8.093, "standards/choose": 6.152, "again/asks": 6.747, "again/answer": 2.743, "again/evid": 8.995, "end/tri": 9.896, "end/next": 3.211};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the title, the four floors of meaning standing together, and the ending. */
const BREATH={
"before":{"hold":{"wilkins":0.5,"icd":0.5,"lesson":0.6},"breathe":3.6},
"guesses":{"hold":{"finds":0.4,"wrong":0.8,"read":0.3}},
"four":{"hold":{"gloss":0.3,"onto":0.4},"breathe":3.0},
"ontology":{"hold":{"rules":0.8,"graph":0.8,"aristotle":0.4}},
"semantic":{"hold":{"once":0.6,"tools":0.4}},
"standards":{"hold":{"blank":0.5,"creds":0.4,"three":0.8}},
"again":{"hold":{"asks":0.4,"answer":0.6}},
"end":{"hold":{"tri":0.8},"breathe":4.2}
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
   Its parts are the series' model: who issued it, who holds it, what it claims, the evidence, the date. */
function credCard(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const era=o.era||"digital",h=o.h||Math.round(w*0.68),hl=o.hl||{};
  const rowsF=[["issuer",o.issuer],["holder",o.holder],["claim",o.claim],["evidence",o.evidence],["date",o.date]].filter(r=>r[1]);
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
    if(era==="digital"||era==="badge"){glass(ctx,0,0,w,h,18,o.col||TRUST,{glow:16,ea:0.8,fill:"rgba(7,12,24,0.94)"});}
    else{const base=era==="tablet"?[150,112,78]:era==="wax"?[222,204,168]:[240,232,214];ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=24;ctx.fillStyle=rgba(base,1);rr(ctx,0,0,w,h,era==="tablet"?22:6);ctx.fill();ctx.shadowBlur=0;
      const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,255,255,0.10)");g.addColorStop(1,"rgba(0,0,0,0.16)");ctx.fillStyle=g;rr(ctx,0,0,w,h,era==="tablet"?22:6);ctx.fill();
      if(era==="paper"){ctx.strokeStyle="rgba(150,120,60,0.5)";ctx.lineWidth=2;rr(ctx,10,10,w-20,h-20,4);ctx.stroke();}}
    const dk=era==="digital"||era==="badge",ink=dk?rgba(INK,0.95):(era==="tablet"?"rgba(60,36,20,0.9)":"rgba(52,40,30,0.92)"),lab=dk?rgba(SOFT,1):(era==="tablet"?"rgba(70,44,26,0.7)":"rgba(110,86,54,0.9)");
    let yy=o.title?58:42;if(o.title)T(ctx,o.title,w/2,40,{w:800,size:o.ts||22,align:"center",color:dk?rgba(o.col||TRUST,1):ink});
    rowsF.forEach(([k,v],i)=>{const on=hl[k]||0,ry=yy+i*(o.rh||34);if(on>0){ctx.fillStyle=dk?rgba(o.col||TRUST,0.16*on):"rgba(200,140,40,"+(0.22*on)+")";rr(ctx,12,ry-24,w-24,32,8);ctx.fill();}
      T(ctx,k,24,ry,{f:"mono",w:500,size:15,color:lab});T(ctx,v,120,ry,{w:700,size:18,color:ink});});
    if(era==="wax"||era==="paper")waxSeal(ctx,w-50,h-46,28,WAX,1,o.press==null?1:o.press);
    if(era==="digital"){const sx=w-46,sy=h-40;ctx.strokeStyle=rgba(o.col||TRUST,0.9);ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU+Math.PI/6;ctx.lineTo(sx+Math.cos(an)*20,sy+Math.sin(an)*20);}ctx.closePath();ctx.stroke();T(ctx,"✓",sx,sy+7,{w:800,size:20,align:"center",color:rgba(o.col||TRUST,1)});T(ctx,"signed",sx,sy+36,{f:"mono",w:500,size:12,align:"center",color:rgba(SOFT,1)});}
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

/* ===== Meaning machines can read: the film's own pictures =====
   Four ways to write meaning down, each with its colour: gold for the glossary, green for the taxonomy, violet for the ontology,
   blue for the semantic layer. They stack like the floors of one building. Genie (the orb and its chip) answers from what it can read.
   The history is drawn warm, on parchment (Linnaeus, Wilkins, Nightingale); the present is the films' dark glass.
   The labs and the scenarios draw with these too (LV, at the end). Film-only helpers start with mm_. */
const MM_GLO=[255,209,102],MM_TAX=[120,225,140],MM_ONT=[186,150,255],MM_SEM=[110,180,255],MM_INK=[176,190,255];
const MM_ASK=[255,166,138],MM_GEN=[228,236,255],MM_SEP="rgba(62,44,28,0.94)",MM_SEP2="rgba(104,78,50,0.9)";
const MM_L=[
 {k:"gloss",n:"Glossary",c:MM_GLO,q:"what does it mean?",s:"words, for people"},
 {k:"tax",n:"Taxonomy",c:MM_TAX,q:"what kind is it?",s:"kinds, in a hierarchy"},
 {k:"onto",n:"Ontology",c:MM_ONT,q:"how does it relate, and what's allowed?",s:"relationships and rules"},
 {k:"sem",n:"Semantic layer",c:MM_SEM,q:"how is it calculated?",s:"each number, defined once"}];
const MM_Q="Which learners are one microcredential away from a graduate certificate?";

/* ---------- the past: organic, warm, alive ----------
   History is drawn like living things and handled paper: flowing curves, strokes that taper, soft light from the upper left,
   and a gentle motion driven by t (branches sway, paper breathes). The systems of today stay crisp glass. */
// a point on a cubic bezier, and its tangent
function mm_bz(p0,p1,p2,p3,u){const v=1-u;return[v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0],v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1]];}
function mm_bzd(p0,p1,p2,p3,u){const v=1-u;return[3*v*v*(p1[0]-p0[0])+6*v*u*(p2[0]-p1[0])+3*u*u*(p3[0]-p2[0]),3*v*v*(p1[1]-p0[1])+6*v*u*(p2[1]-p1[1])+3*u*u*(p3[1]-p2[1])];}
// a limb: a stroke along a bezier that tapers from w0 to w1, drawn up to p, with a lit side and a shadow side
function mm_limb(ctx,p0,p1,p2,p3,w0,w1,p,col,o){o=o||{};if(p<=0.001)return;const n=Math.max(8,Math.round(26*p)),L=[],R=[],a=o.a==null?1:o.a;
  for(let i=0;i<=n;i++){const u=i/n*p,q=mm_bz(p0,p1,p2,p3,u),d=mm_bzd(p0,p1,p2,p3,u),ln=Math.hypot(d[0],d[1])||1,nx=-d[1]/ln,ny=d[0]/ln,w=lerp(w0,w1,Math.pow(u,0.8))/2;L.push([q[0]+nx*w,q[1]+ny*w]);R.push([q[0]-nx*w,q[1]-ny*w]);}
  withA(ctx,a,()=>{ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<L.length;i++)ctx.lineTo(L[i][0],L[i][1]);const e=L[L.length-1],f=R[R.length-1];ctx.quadraticCurveTo((e[0]+f[0])/2+(e[0]-L[L.length-2][0]),(e[1]+f[1])/2+(e[1]-L[L.length-2][1]),f[0],f[1]);
    for(let i=R.length-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);ctx.closePath();ctx.fillStyle=rgba(col,1);ctx.fill();
    if(!o.flat){ctx.strokeStyle=rgba(mix(col,[255,236,200],0.45),0.55);ctx.lineWidth=Math.max(0.8,w0*0.12);ctx.lineCap="round";ctx.beginPath();L.forEach((q,i)=>{const r=R[i],x=lerp(q[0],r[0],0.28),y=lerp(q[1],r[1],0.28);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
      ctx.strokeStyle=rgba(mix(col,[0,0,0],0.5),0.5);ctx.beginPath();R.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}
    if(o.glow>0){ctx.save();ctx.globalCompositeOperation="lighter";ctx.strokeStyle=rgba(o.gcol||[255,200,120],0.55*o.glow);ctx.lineWidth=3;ctx.shadowColor=rgba(o.gcol||[255,200,120],0.9);ctx.shadowBlur=14;ctx.beginPath();for(let i=0;i<=n;i++){const q=mm_bz(p0,p1,p2,p3,i/n*p);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();ctx.restore();}});}
// a leaf, soft, turning gently
function mm_leaf(ctx,x,y,s,an,col,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(an);const g=ctx.createLinearGradient(-s,-s*0.4,s,s*0.4);g.addColorStop(0,rgba(mix(col,[255,255,220],0.3),1));g.addColorStop(1,rgba(mix(col,[0,0,0],0.35),1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(s*0.4,-s*0.45,s*1.1,-s*0.35,s*1.4,0);ctx.bezierCurveTo(s*1.1,s*0.35,s*0.4,s*0.45,0,0);ctx.fill();ctx.strokeStyle=rgba(mix(col,[0,0,0],0.45),0.6);ctx.lineWidth=Math.max(0.6,s*0.06);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(s*0.7,-s*0.05,s*1.3,0);ctx.stroke();ctx.restore();});}
// handled paper: soft uneven edges, a curled corner, light from the upper left, and a slow breath (o.t, o.seed)
function mm_parch(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sd=o.seed||0,tt=o.t||0,br=Math.sin(tt*0.9+sd*1.7);
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2+(o.flat?0:br*1.5));ctx.rotate((o.rot||0)+(o.flat?0.0015:0.004)*br);ctx.translate(-w/2,-h/2);
    const j=(k,m)=>(hash(sd*13+k,5)-0.5)*m,bw=Math.min(w,h)*0.03+1.2,cu=o.flat?0:Math.min(26,Math.min(w,h)*0.14)*(0.85+0.15*br);
    const edge=()=>{ctx.beginPath();ctx.moveTo(3,2+j(1,2));ctx.quadraticCurveTo(w*0.5,j(2,bw*2),w-3,2+j(3,2));ctx.quadraticCurveTo(w+j(4,bw*2),h*0.5,w-2,h-cu-2);ctx.quadraticCurveTo(w-cu*0.35,h-cu*0.3,w-cu-2,h-1);
      ctx.quadraticCurveTo(w*0.5,h+j(5,bw*2),3,h-2+j(6,2));ctx.quadraticCurveTo(j(7,bw*2),h*0.5,3,2+j(1,2));ctx.closePath();};
    ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=o.flat?8:24+4*br;ctx.shadowOffsetY=o.flat?2:8+2*br;edge();ctx.fillStyle=o.fill||"#e7dabe";ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,250,236,0.36)");g.addColorStop(0.55,"rgba(255,240,210,0.04)");g.addColorStop(1,"rgba(96,66,34,0.24)");edge();ctx.fillStyle=g;ctx.fill();
    if(!o.flat){const r=ctx.createRadialGradient(w*0.25,h*0.2,4,w*0.25,h*0.2,Math.max(w,h));r.addColorStop(0,"rgba(255,255,240,0.12)");r.addColorStop(1,"rgba(255,255,240,0)");ctx.fillStyle=r;edge();ctx.fill();
      ctx.fillStyle="rgba(196,176,140,0.95)";ctx.beginPath();ctx.moveTo(w-2,h-cu-2);ctx.quadraticCurveTo(w-cu*0.9,h-cu*0.9,w-cu-2,h-1);ctx.quadraticCurveTo(w-cu*0.35,h-cu*0.3,w-2,h-cu-2);ctx.fill();}
    if(o.hi>0){ctx.strokeStyle="rgba(214,150,50,"+(0.95*o.hi)+")";ctx.lineWidth=3.5;ctx.shadowColor="rgba(255,190,90,0.9)";ctx.shadowBlur=16*o.hi;edge();ctx.stroke();ctx.shadowBlur=0;}
    if(o.draw)o.draw(ctx,w,h);ctx.restore();});}
// the European robin, the bird from What's in a word: one soft body, a breast of orange, breathing and looking about
function mm_robin(ctx,x,y,s,a,t){t=t||0;withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);const br=1+0.018*Math.sin(t*2.6),tilt=0.08*Math.sin(t*0.9)+0.06*Math.sin(t*2.3),flick=Math.max(0,Math.sin(t*1.7))**6*0.25;
  // tail, tapering, with a flick now and then
  ctx.save();ctx.translate(-20,6);ctx.rotate(-0.42-flick);ctx.beginPath();ctx.moveTo(2,-5);ctx.bezierCurveTo(-10,-6,-24,-9,-38,-10);ctx.bezierCurveTo(-45,-9,-47,-2,-45,3);ctx.bezierCurveTo(-42,6,-38,6,-34,5);ctx.bezierCurveTo(-22,5,-10,5,2,5);ctx.closePath();
  let g=ctx.createLinearGradient(0,-10,0,6);g.addColorStop(0,"#8a6c4e");g.addColorStop(1,"#3a2a1c");ctx.fillStyle=g;ctx.fill();ctx.strokeStyle="rgba(250,230,200,0.22)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-6,-1);ctx.quadraticCurveTo(-24,-3,-42,-3);ctx.moveTo(-8,2);ctx.quadraticCurveTo(-26,2,-40,2);ctx.stroke();ctx.restore();
  // legs, thin and tapered, gripping
  ctx.strokeStyle="#4a3526";ctx.lineCap="round";[[2,-1],[12,1]].forEach(([lx,d])=>{ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(lx,22);ctx.quadraticCurveTo(lx+d*2,34,lx+d,43);ctx.stroke();ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(lx+d-6,45);ctx.quadraticCurveTo(lx+d,41,lx+d+7,45);ctx.stroke();});
  // body, one flowing shape from crown to tail, breathing
  ctx.save();ctx.scale(br,br);ctx.beginPath();ctx.moveTo(-26,2);ctx.bezierCurveTo(-24,-18,-2,-24,12,-26);ctx.bezierCurveTo(22,-40,40,-36,42,-22);ctx.bezierCurveTo(44,-10,36,-2,34,6);ctx.bezierCurveTo(30,22,12,30,-4,28);ctx.bezierCurveTo(-18,26,-28,16,-26,2);ctx.closePath();
  g=ctx.createRadialGradient(8,-24,4,4,0,52);g.addColorStop(0,"#b08a64");g.addColorStop(0.55,"#7a5c40");g.addColorStop(1,"#3f2e20");ctx.fillStyle=g;ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;
  ctx.strokeStyle="rgba(40,26,16,0.55)";ctx.lineWidth=1.8;ctx.stroke();
  // the orange face and breast, soft-edged
  ctx.save();ctx.clip();ctx.beginPath();ctx.moveTo(44,-26);ctx.bezierCurveTo(36,-34,24,-30,22,-20);ctx.bezierCurveTo(20,-6,10,6,6,20);ctx.bezierCurveTo(16,26,30,18,36,4);ctx.bezierCurveTo(42,-6,48,-16,44,-26);ctx.closePath();
  g=ctx.createRadialGradient(30,-12,2,26,-8,30);g.addColorStop(0,"#ff9a56");g.addColorStop(0.7,"#e0662e");g.addColorStop(1,"rgba(200,90,40,0.85)");ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle="rgba(244,232,210,0.85)";ctx.beginPath();ctx.ellipse(4,24,16,8,-0.15,0,TAU);ctx.fill();
  // the wing, folded, with feathers
  ctx.beginPath();ctx.moveTo(-20,-4);ctx.bezierCurveTo(-8,-16,10,-14,14,-2);ctx.bezierCurveTo(12,10,-4,18,-24,14);ctx.bezierCurveTo(-28,8,-26,0,-20,-4);ctx.closePath();g=ctx.createLinearGradient(-20,-14,10,16);g.addColorStop(0,"#8a6a4a");g.addColorStop(1,"#4a3524");ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle="rgba(250,230,200,0.28)";ctx.lineWidth=1.1;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-16+i*6,2+i*3);ctx.quadraticCurveTo(-6+i*6,6+i*3,-20+i*4,12+i*1.5);ctx.stroke();}ctx.restore();
  // head: eye with a glint, and a small beak, tilting
  ctx.save();ctx.translate(30,-22);ctx.rotate(tilt);ctx.fillStyle="#1c140e";ctx.beginPath();ctx.ellipse(2,-2,3.2,3.4,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.85)";ctx.beginPath();ctx.arc(3,-3.2,1,0,TAU);ctx.fill();
  ctx.fillStyle="#2e2218";ctx.beginPath();ctx.moveTo(11,-4);ctx.quadraticCurveTo(18,-2,21,0);ctx.quadraticCurveTo(17,1.5,11,2);ctx.closePath();ctx.fill();ctx.restore();ctx.restore();ctx.restore();});}
// one of Nightingale's hospital forms: the same columns on every form, filled in by hand, on breathing paper
const MM_FCOLS=["disease","admitted","recovered","died","days"];
function mm_form(ctx,x,y,w,h,name,seed,o){o=o||{};mm_parch(ctx,x,y,w,h,{a:o.a,rot:o.rot,t:o.t,seed:seed+3,draw:(c,W_,H_)=>{
  T(c,name,24,44,{w:800,size:24,color:MM_SEP});T(c,"return for the year",24,70,{f:"mono",w:500,size:14,color:MM_SEP2});
  const cw=(W_-40)/MM_FCOLS.length,hy=112;if(o.band>0){c.fillStyle="rgba(230,160,50,"+(0.38*o.band)+")";c.beginPath();c.moveTo(12,hy-24);c.quadraticCurveTo(W_/2,hy-27,W_-12,hy-24);c.lineTo(W_-12,hy+10);c.quadraticCurveTo(W_/2,hy+13,12,hy+10);c.closePath();c.fill();}
  MM_FCOLS.forEach((s,i)=>T(c,s,20+i*cw+(i?cw/2:0),hy,{f:"mono",w:500,size:14,align:i?"center":"left",color:MM_SEP}));
  c.strokeStyle="rgba(90,66,40,0.55)";c.lineWidth=1.4;c.beginPath();c.moveTo(16,hy+10);c.quadraticCurveTo(W_/2,hy+12+hash(seed,2)*3,W_-16,hy+10);c.stroke();
  for(let i=1;i<MM_FCOLS.length;i++){c.beginPath();c.moveTo(20+i*cw,hy-22);c.quadraticCurveTo(20+i*cw+(hash(i,seed)-0.5)*5,(hy+H_)/2,20+i*cw,H_-20);c.strokeStyle="rgba(90,66,40,0.22)";c.stroke();}
  const dz=["fever","cholera","wounds","phthisis","dysentery","measles","typhus"];const rows=Math.floor((H_-hy-30)/34),fill=o.fill==null?1:o.fill;
  for(let r=0;r<rows;r++){if(r>=rows*fill)break;const yy=hy+42+r*34;T(c,dz[(r+seed)%dz.length],20,yy,{w:600,size:16,color:"rgba(52,40,30,0.85)"});
    for(let i=1;i<MM_FCOLS.length;i++)T(c,""+(3+Math.floor(hash(r*7+i,seed)*(i===1?90:i===3?9:40))),20+i*cw+cw/2,yy,{w:600,size:16,align:"center",color:"rgba(52,40,30,0.8)"});}}});}
// a tag of paper tied to a branch: a rank, and a name
function mm_ptag(ctx,x,y,rank,name,a,t,sd,hi){const w=Math.max(150,tw(ctx,name,24,800)+40),h=62;withA(ctx,a,()=>{ctx.strokeStyle="rgba(120,90,60,0.8)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,y-26);ctx.quadraticCurveTo(x+3*Math.sin(t+sd),y-14,x,y);ctx.stroke();
  mm_parch(ctx,x-w/2,y,w,h,{t,seed:sd,flat:true,hi,draw:(c)=>{T(c,rank,16,24,{f:"mono",w:500,size:14,color:MM_SEP2});T(c,name,16,50,{w:800,size:24,color:MM_SEP});}});});}
/* Linnaeus's hierarchy, as a living tree: the robin's path from the kingdom to its species, and other branches around it.
   Each node: [x, y, parent, width at the base, width at the tip, on the robin's path, label] */
const MM_TREE=[[330,836,-1,34,24,1],[370,650,0,40,17,1,["KINGDOM","Animalia"]],[610,520,1,16,11,1,["CLASS","Aves"]],[860,470,2,11,8,1,["ORDER","Passeriformes"]],[1100,445,3,8,6,1,["GENUS","Erithacus"]],[1330,425,4,6,3,1],
  [210,470,1,13,4,0,["","Mammalia"]],[430,390,1,11,3,0,["","Amphibia"]],[150,610,1,10,3,0,["","Insecta"]],[680,370,2,8,2,0],[740,610,2,7,2,0],[930,360,3,6,2,0],[980,560,3,5,2,0],[1160,530,4,4,1.5,0],[1180,360,4,4,1.5,0]];
function mm_treePos(i,t){const n=MM_TREE[i];let d=0,k=i;while(MM_TREE[k][2]>=0){d++;k=MM_TREE[k][2];}return[n[0]+Math.sin(t*0.7+i*1.3)*1.6*d,n[1]+Math.cos(t*0.6+i)*1.1*d];}
function mm_tree(ctx,t,grow,path,labA){const P=MM_TREE.map((n,i)=>mm_treePos(i,t)),bark=[108,80,54];
  MM_TREE.forEach((n,i)=>{if(n[2]<0)return;const pp=P[n[2]],q=P[i],dx=q[0]-pp[0],dy=q[1]-pp[1],L=Math.hypot(dx,dy),bend=(hash(i,4)-0.5)*0.35;
    const c1=[pp[0]+dx*0.3-dy*bend,pp[1]+dy*0.3+dx*bend],c2=[pp[0]+dx*0.7-dy*bend*0.6,pp[1]+dy*0.7+dx*bend*0.6];let dep=0,k=i;while(MM_TREE[k][2]>=0){dep++;k=MM_TREE[k][2];}
    const g=clamp(grow*6-dep+1,0,1),on=n[5]?(path[dep-1]||0):0;if(g<=0)return;
    mm_limb(ctx,pp,c1,c2,q,n[3],n[4],g,n[5]?bark:mix(bark,[40,30,24],0.35),{glow:on,a:n[5]?1:0.85});
    if(!n[5]&&g>=1){for(let f=0;f<4;f++)mm_leaf(ctx,q[0],q[1],9+hash(i*4+f,3)*6,-1.2+f*0.8+Math.sin(t*1.1+i+f)*0.12,[112,150,82],0.85);}});
  // the ground, and roots that spread into it
  const gr=clamp(grow*6,0,1),b0=P[0];withA(ctx,gr,()=>{const g=ctx.createRadialGradient(b0[0],b0[1]+6,4,b0[0],b0[1]+6,150);g.addColorStop(0,"rgba(0,0,0,0.45)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(b0[0],b0[1]+6,150,26,0,0,TAU);ctx.fill();});
  [[-70,18],[64,14],[-26,22],[30,24]].forEach(([dx,dy],k)=>mm_limb(ctx,[b0[0]+(k%2?6:-6),b0[1]-14],[b0[0]+dx*0.3,b0[1]-2],[b0[0]+dx*0.7,b0[1]+dy*0.6],[b0[0]+dx,b0[1]+dy],k<2?18:12,1.5,gr,bark,{}));
  return P;}
function mm_treeTags(ctx,t,P,labA,hi){const off={1:[-120,-8],2:[-10,40],3:[40,48],4:[30,40],6:[0,-96],7:[40,-92],8:[-20,-86]};
  MM_TREE.forEach((n,i)=>{if(!n[6])return;const a=labA[i]||0;if(a<=0)return;const o=off[i]||[0,30],x=P[i][0]+o[0],y=P[i][1]+o[1];
    if(n[5])mm_ptag(ctx,x,y,n[6][0],n[6][1],a,t,i,hi&&hi[i]);else withA(ctx,a*0.8,()=>T(ctx,n[6][1],x,y+20,{w:700,size:20,align:"center",color:rgba(PARCH,0.7)}));});}

/* ---------- the stack: four floors of meaning ---------- */
// glossary at the bottom, the semantic layer at the top. o.a, o.hi, o.qa, o.ca: per floor, 0..1 (visible, highlighted, question shown, content shown)
const MM_FL={x:160,w:1600,h:140,y0:650,gap:170};
const mm_fy=(k,g)=>(g||MM_FL).y0-k*(g||MM_FL).gap;
function mm_pill(ctx,x,y,s,col,o){o=o||{};const sz=o.size||18,w=tw(ctx,s,sz,700)+(o.pad||30),h=sz+(o.ph||14);const a=o.a==null?1:o.a;if(a<=0.01)return{x,y,w,h};
  withA(ctx,a,()=>{if(o.hi>0)glow(ctx,x,y,w*0.8,o.hiCol||col,0.4*o.hi);glass(ctx,x-w/2,y-h/2,w,h,o.r==null?h/2:o.r,o.hiCol&&o.hi>0.5?o.hiCol:col,{glow:8+12*(o.hi||0),ea:0.75+0.25*(o.hi||0),fill:o.fill||"rgba(7,12,24,0.95)"});
    if(o.dash){ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=1.6;rr(ctx,x-w/2,y-h/2,w,h,h/2);ctx.stroke();ctx.restore();}
    T(ctx,s,x,y+sz*0.36,{w:700,size:sz,align:"center",color:o.tc||rgba(col,1)});});return{x,y,w,h};}
function mm_glossC(ctx,x,y,h,t,p,hi){const W_=[["credential","a trusted, checkable claim of learning"],["microcredential","a small credential, with its learning assessed"],["stacking","counting credentials towards a bigger one"]];
  W_.forEach(([wd,df],i)=>{const cx=x+i*305,cy=y+16,cw=270,ch=h-32,on=i===1?hi:0;withA(ctx,clamp(p*3-i,0,1),()=>{if(on>0)glow(ctx,cx+cw/2,cy+ch/2,190,MM_GLO,0.35*on);
    glass(ctx,cx,cy,cw,ch,12,MM_GLO,{glow:8+12*on,ea:0.6+0.4*on,fill:"rgba(24,19,8,0.94)"});T(ctx,wd,cx+18,cy+34,{w:800,size:22,color:rgba(MM_GLO,1)});wrapT(ctx,df,cx+18,cy+62,cw-30,{w:600,size:16,lh:20,color:rgba(PARCH,0.85)});});});
  return{x:x+440,top:y+16,bot:y+h-16};}
function mm_taxC(ctx,x,y,h,t,p,hi){const R=[x+110,y+h/2],C=[["Award",y+30,x+330],["Microcredential",y+70,x+440],["Badge",y+110,x+570]],G=[["Degree",y+24],["Graduate certificate",y+56]];
  const q=k=>clamp(p*4-k,0,1),dk="#08121a";
  const root=mm_pill(ctx,R[0],R[1],"Credential",MM_TAX,{size:18,a:q(0)});
  const kids=C.map(([s,yy,cx],i)=>{const b=mm_pill(ctx,cx,yy,s,MM_TAX,{size:17,a:q(1+i*0.3),hi:i===1?hi:0});if(q(1+i*0.3)>0)isa(ctx,b.x-b.w/2-4,yy,R[0]+root.w/2+6,R[1],fin(q(1+i*0.3),0.3,0.7),MM_TAX,{fill:dk,s:12,lw:1.8});return b;});
  G.forEach(([s,yy],i)=>{const b=mm_pill(ctx,x+760,yy,s,MM_TAX,{size:16,a:q(2.2+i*0.4)});if(q(2.2+i*0.4)>0)isa(ctx,b.x-b.w/2-4,yy,kids[0].x+kids[0].w/2+6,kids[0].y,fin(q(2.2+i*0.4),0.3,0.7),MM_TAX,{fill:dk,s:12,lw:1.8});});
  return{x:x+440,top:y+70-kids[1].h/2,bot:y+70+kids[1].h/2};}
// a labelled arrow between two boxes, cut at their edges; o.p draws it, o.dash for a link that doesn't hold
function mm_link(ctx,A,B,label,col,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p;if(a<=0.01||p<=0)return;const dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy);if(L<1)return;const ux=dx/L,uy=dy/L;
  const cut=b=>Math.min(Math.abs(ux)>1e-6?b.w/2/Math.abs(ux):1e9,Math.abs(uy)>1e-6?b.h/2/Math.abs(uy):1e9)+6;const x0=A.x+ux*cut(A),y0=A.y+uy*cut(A),x1=B.x-ux*cut(B),y1=B.y-uy*cut(B);
  arrowTo(ctx,x0,y0,x1,y1,col,a,{p,dash:o.dash,head:o.head||12,lw:o.lw||2.2,nohead:o.nohead});
  if(label&&p>0.6)withA(ctx,a*fin(p,0.6,0.4),()=>{const mx=(x0+x1)/2,my=(y0+y1)/2,off=o.off==null?16:o.off,nx=-uy,ny=ux,s=o.size||16,lx=mx+nx*off*(ny>0?-1:1),ly=my+ny*off*(ny>0?-1:1);
    const w=tw(ctx,label,s,700,o.f)+14;ctx.fillStyle="rgba(7,12,24,0.9)";rr(ctx,lx-w/2,ly-s*0.8,w,s*1.3,6);ctx.fill();T(ctx,label,lx,ly+s*0.3,{w:700,size:s,align:"center",f:o.f,color:rgba(o.lc||col,1)});});}
function mm_ontoC(ctx,x,y,h,t,p,hi){const q=k=>clamp(p*4-k,0,1),yy=y+46;
  const Ln=mm_pill(ctx,x+100,yy,"Learner",MM_ONT,{size:18,a:q(0),r:10}),Mc=mm_pill(ctx,x+440,yy,"Microcredential",MM_ONT,{size:18,a:q(0.5),r:10,hi}),Gc=mm_pill(ctx,x+770,yy,"Graduate certificate",MM_ONT,{size:17,a:q(1),r:10});
  mm_link(ctx,Ln,Mc,"holds",MM_ONT,{p:q(1.4),off:18,size:15});mm_link(ctx,Mc,Gc,"counts towards",MM_ONT,{p:q(1.9),off:18,size:15});
  withA(ctx,q(2.8),()=>{const s="rule: up to 4 · approved only",w=tw(ctx,s,15,500,"mono")+28;glass(ctx,x+605-w/2,y+86,w,34,10,MM_ONT,{glow:10,ea:0.8,fill:"rgba(22,14,40,0.95)"});T(ctx,s,x+605,y+109,{f:"mono",w:500,size:15,align:"center",color:rgba(MM_ONT,1)});});
  return{x:x+440,top:yy-Mc.h/2,bot:yy+Mc.h/2};}
const MM_METRICS=[["credentials awarded","11,890","count · revoked left out"],["near a certificate","132","3 of 4 approved"],["completion rate","71%","completed ÷ enrolled"]];
function mm_semC(ctx,x,y,h,t,p,hi){MM_METRICS.forEach(([n,v,f],i)=>{const cx=x+i*305,cy=y+16,cw=270,ch=h-32,on=i===1?hi:0;withA(ctx,clamp(p*3-i,0,1),()=>{if(on>0)glow(ctx,cx+cw/2,cy+ch/2,190,MM_SEM,0.35*on);
    glass(ctx,cx,cy,cw,ch,12,MM_SEM,{glow:8+12*on,ea:0.6+0.4*on,fill:"rgba(8,16,32,0.95)"});T(ctx,"Σ",cx+18,cy+32,{w:800,size:22,color:rgba(MM_SEM,1)});T(ctx,n,cx+44,cy+31,{w:700,size:17,color:rgba(MM_SEM,1)});
    T(ctx,v,cx+18,cy+70,{w:800,size:30,color:rgba(INK,1)});T(ctx,f,cx+18,cy+94,{f:"mono",w:500,size:13,color:rgba(SOFT,1)});});});
  return{x:x+440,top:y+16,bot:y+h-16};}
const MM_CONTENT=[mm_glossC,mm_taxC,mm_ontoC,mm_semC];
function mm_stack(ctx,t,o){o=o||{};const g=Object.assign({},MM_FL,o.geo||{}),an=[],arr=(v,d)=>v==null?[d,d,d,d]:v;const A=arr(o.a,1),HI=arr(o.hi,0),QA=arr(o.qa,1),CA=arr(o.ca,1),MH=arr(o.mh,0);
  MM_L.forEach((L,k)=>{const a=A[k];if(a<=0.01){an.push(null);return;}const hi=HI[k],x=g.x,y=mm_fy(k,g),w=g.w,h=g.h,c=L.c,lit=o.lit==null?1:o.lit[k];
    withA(ctx,a,()=>{if(hi>0)glow(ctx,x+w/2,y+h/2,w*0.42,c,0.16*hi);
      ctx.save();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+34,y-24);ctx.lineTo(x+w-34,y-24);ctx.lineTo(x+w,y);ctx.closePath();ctx.fillStyle=rgba(c,(0.05+0.07*hi)*(0.4+0.6*lit));ctx.fill();ctx.strokeStyle=rgba(c,(0.3+0.4*hi)*(0.4+0.6*lit));ctx.lineWidth=1.4;ctx.stroke();ctx.restore();
      glass(ctx,x,y,w,h,14,c,{glow:(10+14*hi)*lit,ea:(0.35+0.2*lit)+0.4*hi,fill:"rgba(7,12,24,0.93)"});
      withA(ctx,lit,()=>{led(ctx,x+18,y+24,5,h-48,c,0.9);if(!o.bare){T(ctx,L.n,x+42,y+60,{w:800,size:o.ns||30,color:rgba(c,1)});if(!o.nosub)T(ctx,L.s,x+42,y+92,{w:600,size:18,color:rgba(SOFT,1)});}
        if(o.inner)o.inner(ctx,k,x,y,w,h);
        else{an.push(MM_CONTENT[k](ctx,x+300,y,h,t,CA[k],MH[k]));
          withA(ctx,QA[k],()=>{ctx.strokeStyle=rgba(c,0.25);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+w-400,y+22);ctx.lineTo(x+w-400,y+h-22);ctx.stroke();
            const ls=wrapT(ctx,L.q,0,0,340,{w:700,size:25,measure:true}),y1=y+h/2-(ls.length-1)*17+9;ls.forEach((l,i)=>T(ctx,l,x+w-372,y1+i*34,{w:700,size:25,color:rgba(c,1)}));});}});});
    if(an.length<=k)an.push(null);});
  return an;}
// one idea through every floor: a thread from the glossary's word to the semantic layer's metric
function mm_thread(ctx,an,p,t,col){if(p<=0)return;const pts=an.filter(Boolean);for(let i=0;i+1<pts.length;i++){const a=pts[i],b=pts[i+1],q=clamp(p*(pts.length-1)-i,0,1);if(q<=0)continue;
  const y0=a.top-4,y1=b.bot+4;ctx.save();ctx.globalCompositeOperation="lighter";ctx.strokeStyle=rgba(col||[255,255,255],0.85);ctx.lineWidth=3;ctx.shadowColor=rgba(col||[255,255,255],0.9);ctx.shadowBlur=14;
  ctx.beginPath();ctx.moveTo(a.x,y0);ctx.lineTo(a.x,lerp(y0,y1,q));ctx.stroke();ctx.restore();
  const u=(t*0.6+i*0.3)%1;if(q>=1)glow(ctx,a.x,lerp(y0,y1,u),26,col||[255,255,255],0.7);}}

/* ---------- Genie, tables, documents ---------- */
function mm_genie(ctx,x,y,t,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{orb(ctx,x,y,o.r||34,t);chip(ctx,x,y+118,"databricks","Genie",o.sub||"answers in plain words",{align:"center",edge:MM_GEN});});}
// where each column of a sketch3 table sits, measured the same way table() measures it
function mm_cols(ctx,cols,rows){let x=0;return cols.map((c,i)=>{const w=Math.max(tw(ctx,c,16,500,"mono"),...rows.map(r=>tw(ctx,r[i],16,500,"mono")))+30;const o={x,w};x+=w;return o;});}
// the policy document: the rules are there, but in a file no tool reads
function mm_doc(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,grey=o.grey||0;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;ctx.fillStyle=grey>0.5?"#9aa0aa":"#eef0f4";rr(ctx,x,y,w,h,8);ctx.fill();ctx.restore();
  ctx.fillStyle="rgba(150,158,172,"+(0.55*grey)+")";rr(ctx,x,y,w,h,8);ctx.fill();ctx.fillStyle="#d9453a";rr(ctx,x+w-66,y+16,50,24,5);ctx.fill();T(ctx,"PDF",x+w-41,y+34,{w:800,size:14,align:"center",color:"#fff"});
  const ink=grey>0.5?"rgba(60,64,72,0.75)":"rgba(30,34,44,0.95)";T(ctx,o.title||"Stacking policy",x+24,y+40,{w:800,size:22,color:ink});T(ctx,o.sub||"Academic Board · v4",x+24,y+64,{f:"mono",w:500,size:14,color:ink});
  for(let i=0;i<9;i++){const yy=y+96+i*24;if(i===3||i===4)continue;ctx.fillStyle=grey>0.5?"rgba(70,74,84,0.3)":"rgba(40,44,54,0.25)";ctx.fillRect(x+24,yy,(w-48)*(0.6+0.4*hash(i,4)),9);}
  wrapT(ctx,o.rule||"4.2 A graduate certificate accepts up to four approved microcredentials towards its credit.",x+24,y+176,w-48,{w:700,size:17,lh:22,color:ink});
  for(let i=0;i<5;i++){ctx.fillStyle=grey>0.5?"rgba(70,74,84,0.3)":"rgba(40,44,54,0.25)";ctx.fillRect(x+24,y+h-130+i*24,(w-48)*(0.5+0.5*hash(i,9)),9);}});}
function mm_eyeOff(ctx,x,y,s,col,a){withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-s,y);ctx.quadraticCurveTo(x,y-s*0.8,x+s,y);ctx.quadraticCurveTo(x,y+s*0.8,x-s,y);ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.28,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.9,y+s*0.7);ctx.lineTo(x+s*0.9,y-s*0.7);ctx.stroke();ctx.restore();});}

/* ---------- the semantic layer's metric, and the tools that ask it ---------- */
const MM_MROWS=[["measure","count of credentials"],["left out","revoked credentials"],["date","awarded on · this academic year"],["grain","one row per credential awarded"]];
function mm_metric(ctx,x,y,w,h,o){o=o||{};const p=o.rows||[1,1,1,1];withA(ctx,o.a==null?1:o.a,()=>{if(o.hi>0)glow(ctx,x+w/2,y+h/2,w*0.7,MM_SEM,0.25*o.hi);glass(ctx,x,y,w,h,20,MM_SEM,{glow:18+10*(o.hi||0),ea:0.85,fill:"rgba(6,14,30,0.95)"});
  T(ctx,"Σ",x+30,y+62,{w:800,size:40,color:rgba(MM_SEM,1)});T(ctx,o.title||"credentials awarded this year",x+80,y+56,{w:800,size:o.ts||30,color:rgba(MM_SEM,1)});T(ctx,"semantic layer · defined once",x+80,y+84,{f:"mono",w:500,size:15,color:rgba(SOFT,1)});
  const rh=o.rh||78;MM_MROWS.forEach(([k,v],i)=>withA(ctx,p[i],()=>{const yy=y+118+i*rh;ctx.fillStyle=rgba(MM_SEM,0.07+0.12*(o.rowHi?o.rowHi[i]||0:0));rr(ctx,x+24,yy,w-48,rh-12,10);ctx.fill();led(ctx,x+36,yy+14,4,rh-40,MM_SEM,0.9);
    T(ctx,k.toUpperCase(),x+56,yy+26,{f:"mono",w:500,size:15,color:rgba(SOFT,1)});T(ctx,v,x+56,yy+54,{w:700,size:o.vs||24,color:rgba(INK,1)});}));
  if(o.num)withA(ctx,o.numA==null?1:o.numA,()=>{T(ctx,"= "+o.num,x+w-30,y+h-26,{w:800,size:34,align:"right",color:rgba(GOOD,1)});});});}
// a small dashboard, a spreadsheet: the tools that each used to write their own version
function mm_dash(ctx,x,y,w,h,num,col,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=18;ctx.fillStyle="#f5f6f8";rr(ctx,x,y,w,h,10);ctx.fill();ctx.restore();
  ctx.fillStyle="#1b3139";rr(ctx,x,y,w,34,10);ctx.fill();ctx.fillRect(x,y+20,w,14);T(ctx,"Dean's dashboard",x+16,y+23,{w:700,size:15,color:"#fff"});
  T(ctx,"credentials awarded",x+18,y+64,{w:700,size:15,color:"#5f7281"});T(ctx,num,x+18,y+112,{w:800,size:40,color:rgba(col,1)});
  [0.5,0.7,0.62,0.85,0.78].forEach((v,i)=>{ctx.fillStyle="rgba(7,122,157,0.75)";const bh=(h-150)*v;ctx.fillRect(x+w-150+i*26,y+h-20-bh,16,bh);});
  if(o.old)withA(ctx,o.oldA==null?1:o.oldA,()=>{T(ctx,o.old,x+18,y+h-22,{f:"mono",w:500,size:15,color:"#c82d4c"});ctx.strokeStyle="#c82d4c";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+14,y+h-27);ctx.lineTo(x+18+tw(ctx,o.old,15,500,"mono")+4,y+h-27);ctx.stroke();});});}
function mm_xls(ctx,x,y,w,h,num,col,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=18;ctx.fillStyle="#ffffff";rr(ctx,x,y,w,h,8);ctx.fill();ctx.restore();
  ctx.fillStyle="#1e7145";rr(ctx,x,y,w,30,8);ctx.fill();ctx.fillRect(x,y+18,w,12);T(ctx,"Planning.xlsx",x+14,y+21,{w:700,size:15,color:"#fff"});
  ctx.strokeStyle="#d8dee4";ctx.lineWidth=1;for(let r=0;r<6;r++){ctx.beginPath();ctx.moveTo(x,y+30+r*28);ctx.lineTo(x+w,y+30+r*28);ctx.stroke();}for(let c=1;c<4;c++){ctx.beginPath();ctx.moveTo(x+c*w/4,y+30);ctx.lineTo(x+c*w/4,y+h);ctx.stroke();}
  T(ctx,"credentials awarded",x+10,y+78,{w:700,size:14,color:"#11171c"});ctx.fillStyle="rgba(30,113,69,0.12)";ctx.fillRect(x+w/2+2,y+60,w/2-4,26);T(ctx,num,x+w-12,y+80,{w:800,size:20,align:"right",color:rgba(col,1)});
  for(let r=0;r<3;r++){ctx.fillStyle="rgba(17,23,28,0.2)";ctx.fillRect(x+10,y+104+r*28,70+hash(r,3)*40,8);ctx.fillRect(x+w/2+30,y+104+r*28,60,8);}
  if(o.old)withA(ctx,o.oldA==null?1:o.oldA,()=>{T(ctx,o.old,x+12,y+h-14,{f:"mono",w:500,size:14,color:"#c82d4c"});ctx.strokeStyle="#c82d4c";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+8,y+h-19);ctx.lineTo(x+12+tw(ctx,o.old,14,500,"mono")+4,y+h-19);ctx.stroke();});});}

/* ---------- standards: a shelf of published models, and three definitions ---------- */
const MM_SHELF=[["Finance",[["FIBO","an ontology of finance"],["ISO 20022","payment messages"]]],["Health",[["HL7 FHIR","exchanging records"],["SNOMED CT","clinical terms"],["ICD","diseases"]]],
  ["Insurance",[["ACORD","insurance data"]]],["Retail",[["GS1","product identifiers"]]],["Education",[["CEDS","education data"],["HERM","university models"],["TCSI","student data"]]]];
const MM_REFC=[255,214,160];
function mm_binder(ctx,x,y,w,h,name,sub,col,a,hi){withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);if(hi>0)glow(ctx,w/2,h/2,w,col,0.3*hi);ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=14;ctx.shadowOffsetY=4;
  const g=ctx.createLinearGradient(0,0,w,0);g.addColorStop(0,rgba(mix(col,[30,24,20],0.55),1));g.addColorStop(1,rgba(mix(col,[20,16,14],0.72),1));ctx.fillStyle=g;rr(ctx,0,0,w,h,6);ctx.fill();ctx.restore();ctx.save();ctx.translate(x,y);
  ctx.fillStyle=rgba(col,0.9);ctx.fillRect(0,0,12,h);ctx.strokeStyle=rgba(col,0.85+0.15*(hi||0));ctx.lineWidth=1.6+(hi||0);rr(ctx,0,0,w,h,6);ctx.stroke();
  ctx.fillStyle="rgba(250,244,230,0.92)";rr(ctx,20,28,w-30,64,4);ctx.fill();T(ctx,name,20+(w-30)/2,62,{w:800,size:name.length>7?18:22,align:"center",color:"#231c14"});T(ctx,"STANDARD",20+(w-30)/2,82,{f:"mono",w:500,size:11,align:"center",color:"rgba(60,50,40,0.8)"});
  wrapT(ctx,sub,w/2+6,126,w-30,{w:700,size:16,lh:20,align:"center",color:rgba(mix(col,[255,255,255],0.6),1)});ctx.restore();});}
function mm_shelf(ctx,t,x0,y,o){o=o||{};const bw=o.bw||146,bh=o.bh||196,gap=12,gg=34;let x=x0;const out=[];
  MM_SHELF.forEach(([grp,items],gi)=>{const a=o.ga?o.ga[gi]:1,gx=x;items.forEach(([n,s],i)=>{mm_binder(ctx,x,y+Math.sin(t*0.8+gi+i)*1.2,bw,bh,n,s,gi===4?MM_REFC:[200,190,176],a,o.hi?o.hi[gi]:0);x+=bw+gap;});
    withA(ctx,a,()=>T(ctx,grp,(gx+x-gap)/2,y+bh+42,{w:700,size:20,align:"center",color:rgba(gi===4?MM_REFC:SOFT,1)}));out.push([gx,x-gap]);x+=gg;});
  withA(ctx,o.ga?o.ga[0]:1,()=>{ctx.fillStyle="rgba(120,96,70,0.85)";ctx.fillRect(x0-20,y+bh,x-gg-x0+40-gap,10);ctx.fillStyle="rgba(40,30,22,0.9)";ctx.fillRect(x0-20,y+bh+10,x-gg-x0+40-gap,6);});return out;}
// one official definition of microcredential: shared parts in green, differences in amber
const MM_DEFS=[["Australia","National Microcredentials Framework · 2021",[["certification of assessed learning",0],["at least one hour of learning",1],["smaller than a full award (AQF)",1]]],
  ["European Union","Council Recommendation · 2022",[["record of assessed learning outcomes",0],["after a small volume of learning",1],["owned by the learner, portable",1]]],
  ["UNESCO","Towards a common definition · 2022",[["record of assessed learning achievement",0],["awarded by a trusted provider",1],["has value on its own, and can stack",1]]]];
function mm_def(ctx,x,y,w,h,d,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,h,18,MM_REFC,{glow:14+14*(o.hA==null?0:pulseAt(o.hA,0,1)),ea:0.7,fill:"rgba(12,12,20,0.94)"});withA(ctx,o.hA==null?1:o.hA,()=>{T(ctx,d[0],x+28,y+50,{w:800,size:30,color:rgba(MM_REFC,1)});T(ctx,d[1],x+28,y+80,{w:600,size:16,color:rgba(SOFT,1)});});
  T(ctx,"“microcredential”",x+28,y+128,{w:700,size:20,color:rgba(INK,0.9)});
  d[2].forEach(([s,diff],i)=>withA(ctx,o.p==null?1:clamp(o.p*3-i,0,1),()=>{const yy=y+156+i*(o.rh||84),col=diff?EXT:GOOD,on=diff?(o.diff||0):(o.same||0);
    ctx.fillStyle=rgba(col,0.06+0.16*on);rr(ctx,x+20,yy,w-40,(o.rh||84)-14,12);ctx.fill();ctx.strokeStyle=rgba(col,0.25+0.7*on);ctx.lineWidth=1.6+on;rr(ctx,x+20,yy,w-40,(o.rh||84)-14,12);ctx.stroke();
    wrapT(ctx,s,x+40,yy+30,w-100,{w:700,size:21,lh:26,color:rgba(mix(INK,col,0.5*on),1)});if(!diff&&on>0)tick_(ctx,x+w-46,yy+33,28,GOOD,on);if(diff&&on>0)T(ctx,"≠",x+w-46,yy+42,{w:800,size:30,align:"center",color:rgba(EXT,on)});}));});}

/* ---------- the knowledge graph ---------- */
const MM_KG={learners:[["Aisha K.",410],["Ben O.",540],["Chen W.",670]],micros:[["Data Visualisation",400,1],["SQL for Analysis",490,1],["Data Ethics",580,1],["Python Basics",670,0]],
  holds:[[0,0],[0,1],[0,2],[1,2],[2,1],[2,3],[2,0]]};
// schema (the ontology) above, data below; p: how far each part is drawn
function mm_kg(ctx,t,o){o=o||{};const P=o.p||{},q=k=>P[k]==null?1:P[k],aA=o.aisha||0;
  const sch={cred:mm_pill(ctx,960,128,"Credential",MM_ONT,{size:20,r:10,a:q("schema"),fill:"rgba(34,22,60,0.96)"}),learner:mm_pill(ctx,330,250,"Learner",MM_ONT,{size:20,r:10,a:q("schema"),fill:"rgba(34,22,60,0.96)"}),
    micro:mm_pill(ctx,960,250,"Microcredential",MM_ONT,{size:20,r:10,a:q("schema"),fill:"rgba(34,22,60,0.96)"}),cert:mm_pill(ctx,1560,250,"Graduate certificate",MM_ONT,{size:20,r:10,a:q("schema"),fill:"rgba(34,22,60,0.96)"})};
  mm_link(ctx,sch.micro,sch.cred,"is a kind of",MM_ONT,{p:q("schema")*fin(q("schema"),0.3,0.7),a:q("schema"),off:0,size:15});
  mm_link(ctx,sch.learner,sch.micro,"holds",MM_ONT,{p:fin(q("schema"),0.3,0.7),a:q("schema"),size:15});mm_link(ctx,sch.micro,sch.cert,"counts towards · max 4 · approved",MM_ONT,{p:fin(q("schema"),0.4,0.6),a:q("schema"),size:15});
  withA(ctx,q("schema")*0.9,()=>{T(ctx,"ONTOLOGY",120,200,{f:"mono",w:500,size:16,color:rgba(MM_ONT,1)});T(ctx,"DATA",120,420,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});
    ctx.save();ctx.setLineDash([6,10]);ctx.strokeStyle=rgba(MM_ONT,0.3);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(110,330);ctx.lineTo(1810,330);ctx.stroke();ctx.restore();});
  const L=MM_KG.learners.map(([n,y],i)=>mm_pill(ctx,330,y,n,[255,176,140],{size:18,r:10,a:clamp(q("data")*3-i*0.5,0,1),hi:i===0?aA:0,hiCol:GOOD})),
    M=MM_KG.micros.map(([n,y,ok],i)=>mm_pill(ctx,960,y,n,MM_ONT,{size:17,r:10,a:clamp(q("data")*3-0.3-i*0.3,0,1)})),
    C=mm_pill(ctx,1560,540,"Grad Cert in Data Analytics",[150,215,255],{size:18,r:10,a:clamp(q("data")*3-1.2,0,1)});
  const lk=q("links");MM_KG.holds.forEach(([l,m],i)=>mm_link(ctx,L[l],M[m],i===0?"holds":null,[255,176,140],{p:clamp(lk*3-i*0.25,0,1),a:0.85,lw:1.8,head:9,size:14,off:14}));
  MM_KG.micros.forEach(([n,y,ok],i)=>mm_link(ctx,M[i],C,ok?(i===1?"counts towards":null):"not approved",ok?MM_ONT:[150,150,170],{p:clamp(lk*3-1.2-i*0.2,0,1),a:ok?0.9:0.7,dash:ok?null:[6,7],lw:1.8,head:9,size:14,off:14,lc:ok?MM_ONT:[190,190,205]}));
  // dotted "is a" ties: each instance to its kind
  withA(ctx,q("data")*0.5,()=>{ctx.save();ctx.setLineDash([2,6]);ctx.strokeStyle=rgba(MM_ONT,0.45);ctx.lineWidth=1.2;[[330,sch.learner,L[0]],[960,sch.micro,M[0]],[1560,sch.cert,C]].forEach(([x,A,B])=>{ctx.beginPath();ctx.moveTo(x,A.y+A.h/2+4);ctx.lineTo(x,B.y-B.h/2-4);ctx.stroke();});ctx.restore();});
  if(aA>0)withA(ctx,aA,()=>{tag(ctx,330,364,"3 of 4 approved: one away",GOOD,{align:"center",size:17});});
  return{L,M,C,sch};}

/* ---------- a digital credential, with the parts a standard names ---------- */
const MM_VC=[["issuer","issuer"],["holder","holder"],["claim","claim"],["evidence","evidence"],["status","status"]];
function mm_vc(ctx,x,y,w,o){o=o||{};const rh=o.rh||46,h=70+MM_VC.length*rh+16;withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,h,18,TRUST,{glow:16,ea:0.8,fill:"rgba(7,12,24,0.95)"});
  T(ctx,o.title||"Digital credential",x+24,y+42,{w:800,size:24,color:rgba(TRUST,1)});T(ctx,o.sub||"as a standard describes it",x+w-24,y+42,{w:600,size:15,align:"right",color:rgba(SOFT,1)});
  MM_VC.forEach(([k],i)=>{const yy=y+70+i*rh,on=o.hl?o.hl[k]||0:0;ctx.fillStyle=rgba(TRUST,0.05+0.14*on);rr(ctx,x+16,yy,w-32,rh-8,8);ctx.fill();T(ctx,k,x+30,yy+rh/2+2,{f:"mono",w:500,size:17,color:rgba(TRUST,0.9)});
    const v=o.vals?o.vals[k]:null;if(v)withA(ctx,1,()=>{let xx=x+150;(Array.isArray(v)?v:[v]).forEach(s=>{const col=s.col||INK,txt=s.t||s,w2=tw(ctx,txt,15,700)+20;if(xx+w2>x+w-20)return;glass(ctx,xx,yy+6,w2,rh-20,8,col,{glow:6,ea:0.7,fill:"rgba(7,12,24,0.9)"});T(ctx,txt,xx+10,yy+rh/2+1,{w:700,size:15,color:rgba(col,1)});xx+=w2+8;});});});});return h;}

/* ---------- pictures for the labs and the scenarios (site/assets/meaning-machines-can-read/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW). Every word drawn comes from FW
   (FW.vis, or the lab's own words), so Spanish pages show Spanish. Lab pictures are 960 wide and shown at about 45%, so their
   text is 22 px or more; scenario pictures are 600 wide and shown at about 70%, so theirs is 18 px or more. */
const mm_hex=s=>s.match(/\w\w/g).map(q=>parseInt(q,16));
function mm_numChip(c,x,y,s,n,col){glass(c,x,y,s,s,12,col,{glow:10,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,""+n,x+s/2,y+s/2+s*0.2,{w:800,size:Math.round(s*0.56),align:"center",color:rgba(col,1)});}
const LV={
  // Glossary, taxonomy, ontology or semantic layer? Four floors; each statement's number sits where it was placed
  layers:(c,w,h,st,FW)=>{const lab=FW.labs.find(x=>x.id==="layers"),items=lab.w.items,B=lab.w.buckets,V=FW.vis.layers;
    MM_L.forEach((Lr,k)=>{const x=16,y=h-16-92-k*104,fw=w-32,col=Lr.c,bk=B[k][0],mine=items.map((it,i)=>[it,i]).filter(([it,i])=>st.pick[i]===bk);
      c.save();c.beginPath();c.moveTo(x,y);c.lineTo(x+24,y-12);c.lineTo(x+fw-24,y-12);c.lineTo(x+fw,y);c.closePath();c.fillStyle=rgba(col,0.08);c.fill();c.strokeStyle=rgba(col,0.35);c.lineWidth=1.2;c.stroke();c.restore();
      glass(c,x,y,fw,92,12,col,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.94)"});led(c,x+12,y+16,4,60,col,0.9);
      T(c,B[k][1],x+28,y+40,{w:800,size:26,color:rgba(col,1)});T(c,V.q[k],x+28,y+74,{w:600,size:22,color:rgba(SOFT,1)});
      mine.forEach(([it,i],j)=>{const ok=st.checked?(it.b===bk):null;mm_numChip(c,x+500+j*54,y+23,46,i+1,ok==null?col:ok?GOOD:BAD);});});},
  // Map to the standard: each local term's number, on the part of the credential it was placed on
  standard:(c,w,h,st,FW)=>{const lab=FW.labs.find(x=>x.id==="standard"),items=lab.w.items,B=lab.w.buckets,V=FW.vis.standard;
    glass(c,16,12,w-32,h-24,18,TRUST,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(c,V.title,44,56,{w:800,size:28,color:rgba(TRUST,1)});T(c,V.sub,w-44,56,{w:600,size:22,align:"right",color:rgba(SOFT,1)});
    B.forEach(([bk,name],r)=>{const y=80+r*66,mine=items.map((it,i)=>[it,i]).filter(([it,i])=>st.pick[i]===bk);c.fillStyle=rgba(TRUST,mine.length?0.12:0.05);rr(c,32,y,w-64,56,10);c.fill();
      T(c,name,52,y+37,{f:"mono",w:500,size:24,color:rgba(TRUST,0.95)});mine.forEach(([it,i],j)=>{const ok=st.checked?(it.b===bk):null;mm_numChip(c,300+j*56,y+5,46,i+1,ok==null?INK:ok?GOOD:BAD);});});},
  // Ground the answer: what Genie can read, and the number it gives
  ground:(c,w,h,st,FW)=>{const V=FW.vis.ground,k=st.pick,on={tables:[1,0,0,0],gloss:[1,1,0,0],full:[1,0,1,1]}[k]||[1,0,0,0],cols=[[200,210,230],MM_GLO,MM_ONT,MM_SEM];
    V.sources.forEach((n,i)=>{const y=26+i*100,col=cols[i];withA(c,on[i]?1:0.3,()=>{glass(c,20,y,340,76,14,col,{glow:on[i]?14:0,ea:on[i]?0.9:0.4,fill:"rgba(7,12,24,0.94)"});T(c,n,44,y+47,{w:700,size:26,color:rgba(col,1)});});
      if(on[i])arrowTo(c,370,y+38,510,220,col,0.8,{head:12,lw:2.4});});
    orb(c,560,220,32,1.2);T(c,V.genie,560,300,{w:700,size:24,align:"center",color:rgba(SOFT,1)});
    const ans={tables:["214",BAD],gloss:["171",EXT],full:["132",GOOD]}[k]||["214",BAD];
    glass(c,650,100,290,240,18,ans[1],{glow:18,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,ans[0],795,230,{w:800,size:96,align:"center",color:rgba(ans[1],1)});T(c,V.report,795,300,{w:600,size:22,align:"center",color:rgba(SOFT,1)});},
  // scenarios, 600 × 320
  confident:(c,w,h,st,FW)=>{const V=FW.vis.confident;[[V.genie,"214",V.sub1,BAD,20],[V.reg,"132",V.sub2,GOOD,310]].forEach(([n,v,s,col,x])=>{glass(c,x,40,270,236,18,col,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.95)"});
    T(c,n,x+24,86,{w:700,size:22,color:rgba(SOFT,1)});T(c,v,x+24,184,{w:800,size:80,color:rgba(col,1)});T(c,s,x+24,240,{w:600,size:19,color:rgba(SOFT,1)});});orb(c,258,64,16,1);},
  taxrule:(c,w,h,st,FW)=>{const V=FW.vis.taxrule,r=mm_pill(c,100,150,V.cred,MM_TAX,{size:20});
    const kids=[[V.award,60],[V.micro,150],[V.badge,240]].map(([s,y])=>{const b=mm_pill(c,300,y,s,MM_TAX,{size:20});isa(c,b.x-b.w/2-4,y,r.x+r.w/2+6,r.y,1,MM_TAX,{fill:"#08121a",s:12,lw:2});return b;});
    const b=mm_pill(c,470,290,V.rule,BAD,{size:18,dash:true});isa(c,b.x-40,b.y-b.h/2-2,kids[1].x+40,kids[1].y+kids[1].h/2+4,1,BAD,{fill:"#1a0808",s:12,lw:2});},
  twodash:(c,w,h,st,FW)=>{const V=FW.vis.twodash;[[V.a,V.n1,[110,180,255],20],[V.b,V.n2,BAD,310]].forEach(([n,v,col,x])=>{glass(c,x,40,270,210,16,col,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});
    T(c,n,x+20,82,{w:700,size:19,color:rgba(SOFT,1)});T(c,v,x+22,168,{w:800,size:58,color:rgba(col,1)});T(c,V.own,x+22,222,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});});tag(c,300,286,V.q,EDGE_,{align:"center",size:20});},
  wholesale:(c,w,h,st,FW)=>{const V=FW.vis.wholesale;glass(c,24,40,170,240,14,MM_REFC,{glow:14,ea:0.85,fill:"rgba(30,22,14,0.95)"});c.fillStyle=rgba(MM_REFC,0.9);c.fillRect(24,40,14,240);wrapT(c,V.std,54,100,130,{w:800,size:24,lh:30,color:rgba(MM_REFC,1)});
    V.rows.forEach(([a,b,ok],i)=>{const y=80+i*78;tag(c,230,y,a,ok?ADOPT:EXT,{size:20});T(c,b,w-24,y+8,{w:800,size:24,align:"right",color:rgba(ok?GOOD:EXT,1)});});},
  threedefs:(c,w,h,st,FW)=>{const V=FW.vis.threedefs;[0,1,2].forEach(i=>{const x=12+i*196;glass(c,x,30,184,260,16,MM_REFC,{glow:12,ea:0.75,fill:"rgba(12,12,20,0.95)"});T(c,V.regions[i],x+92,76,{w:800,size:22,align:"center",color:rgba(MM_REFC,1)});
    c.fillStyle=rgba(GOOD,0.16);rr(c,x+12,100,160,58,10);c.fill();T(c,V.same,x+92,136,{w:700,size:19,align:"center",color:rgba(mix(INK,GOOD,0.4),1)});
    c.fillStyle=rgba(EXT,0.18);rr(c,x+12,172,160,100,10);c.fill();wrapT(c,V.diffs[i],x+24,206,140,{w:700,size:19,lh:24,color:rgba(mix(INK,EXT,0.4),1)});});},
  pdfgloss:(c,w,h,st,FW)=>{const V=FW.vis.pdfgloss;c.save();c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=18;c.fillStyle="#eef0f4";rr(c,50,28,240,270,8);c.fill();c.restore();c.fillStyle="#d9453a";rr(c,216,44,58,28,5);c.fill();T(c,"PDF",245,64,{w:800,size:18,align:"center",color:"#fff"});
    T(c,V.title,70,112,{w:800,size:26,color:"#1e222c"});T(c,V.pages,70,142,{w:600,size:18,color:"#4a5160"});for(let i=0;i<5;i++){c.fillStyle="rgba(40,44,54,0.22)";c.fillRect(70,170+i*24,190*(0.6+0.4*hash(i,3)),9);}
    orb(c,450,130,28,1);c.fillStyle="rgba(7,12,24,0.9)";c.beginPath();c.arc(450,238,36,0,TAU);c.fill();mm_eyeOff(c,450,238,24,EDGE_,1);T(c,"?",520,110,{w:800,size:44,color:rgba(EDGE_,1)});},
  noowner:(c,w,h,st,FW)=>{const V=FW.vis.noowner,a=mm_pill(c,170,70,V.cert,MM_ONT,{size:20,r:12}),b=mm_pill(c,440,200,V.micro,MM_ONT,{size:20,r:12});mm_link(c,a,b,V.link,BAD,{size:19,off:30});
    tag(c,40,280,V.owner,BAD,{size:19});tag(c,300,280,V.policy,GOOD,{size:19});},
  steps:(c,w,h,st,FW)=>{const V=FW.vis.steps;glass(c,30,40,380,240,18,MM_SEM,{glow:16,ea:0.85,fill:"rgba(6,14,30,0.95)"});T(c,"Σ",56,96,{w:800,size:40,color:rgba(MM_SEM,1)});wrapT(c,V.title,104,88,290,{w:800,size:22,lh:28,color:rgba(MM_SEM,1)});
    for(let i=0;i<3;i++){c.save();c.setLineDash([6,6]);c.strokeStyle=rgba(MM_SEM,0.5);c.lineWidth=1.6;rr(c,52,150+i*40,336,30,8);c.stroke();c.restore();T(c,"?",220,172+i*40,{w:800,size:20,align:"center",color:rgba(MM_SEM,0.8)});}
    orb(c,520,160,28,1);arrowTo(c,488,160,424,160,MM_GEN,0.7,{head:12,dash:[6,6]});}
};

/* ===== Meaning machines can read: scenes =====
   Eight chapters, as in ../script.md. People tried to write meaning down before (Linnaeus, Wilkins, Nightingale and the ICD).
   Today, Ana asks Genie who is one microcredential away from a graduate certificate, and Genie guesses: the stacking rules are in a
   document no tool can read. Four ways to write meaning down stack like floors: glossary, taxonomy, ontology, semantic layer.
   The ontology holds the rule, the semantic layer holds the calculation, standards save starting from blank, and Genie, grounded,
   asks back and answers right. The triangle from What's in a word returns. */

/* ---------- 1. They tried before ---------- */
const MM_HIER=[["KINGDOM","Animalia"],["CLASS","Aves"],["ORDER","Passeriformes"],["GENUS","Erithacus"],["SPECIES","Erithacus rubecula"]];
const MM_GENERA=["general","mixed relation","relation of action","discourse","God","world","element","stone","metal","herb · leaf","herb · flower","herb · seed","shrub","tree",
  "exanguious","fish","bird","beast","peculiar parts","general parts","magnitude","space","measure","natural power","habit","manners","sensible quality","sickness",
  "spiritual action","corporeal action","motion","operation","economic relation","possessions","provisions","civil relation","judicial relation","military relation","naval relation","church relation"];
const MM_DEATH=["typhoid fever","smallpox","measles","scarlet fever","whooping cough","diphtheria","influenza","cholera"];
const MM_ICD=[["1A00","Cholera"],["BA41","Acute myocardial infarction"],["CA40","Pneumonia"],["2C25","Malignant neoplasms of bronchus or lung"]];
const MM_REV=[1893,1900,1909,1920,1929,1938,1948,1955,1965,1975,1990,2022];
function mm_wilkins(ctx,t,g,g2,g3,dim){const rx=390,ry=535,ink=[214,190,150];
  withA(ctx,1-0.7*dim,()=>{
    // species: fine strokes that run on past the right edge, swaying
    for(let i=0;i<40;i++){const gy=ry+(i-19.5)*32+13,vis=clamp(g*20-Math.abs(i-19.5),0,1);if(vis<=0)continue;
      for(let j=0;j<3;j++){const sw=Math.sin(t*0.8+i*0.7+j)*2.2,dy=gy+(j-1)*10+sw,q=clamp(g2*22-Math.abs(i-19.5)-j*0.3,0,1);if(q<=0)continue;
        mm_limb(ctx,[690,gy],[735,gy],[760,dy],[806,dy],3.2,1,q,ink,{flat:true,a:0.42});if(q>=1){ctx.fillStyle=rgba(ink,0.55);ctx.beginPath();ctx.ellipse(812,dy,5,3,0,0,TAU);ctx.fill();}
        let px=816,py=dy;for(let k=0;k<6;k++){const qq=clamp(g3*24-Math.abs(i-19.5)-j*0.3-k*0.4,0,1);if(qq<=0||hash(i*17+j*5+k,8)<0.3)break;const nx=px+150+hash(i*31+j*7+k,5)*70,ny=dy+(hash(i+j*3+k,6)-0.5)*14+Math.sin(t*0.9+i+k)*2.5;
          ctx.strokeStyle=rgba(ink,0.26*qq);ctx.lineWidth=Math.max(0.6,1.8-k*0.25);ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo((px+nx)/2,py+(ny-py)*0.2+Math.sin(t+k)*3,lerp(px,nx,qq),lerp(py,ny,qq));ctx.stroke();
          if(qq>=1){ctx.fillStyle=rgba(ink,0.35);ctx.beginPath();ctx.arc(nx,ny,2.2,0,TAU);ctx.fill();}px=nx;py=ny;}}}
    // forty kinds, fanned out from everything, on slips of paper
    MM_GENERA.forEach((s,i)=>{const gy=ry+(i-19.5)*32,vis=clamp(g*20-Math.abs(i-19.5),0,1);if(vis<=0)return;const sw=Math.sin(t*0.7+i*0.5)*1.2;
      mm_limb(ctx,[rx,ry],[455,ry+sw],[440,gy+13],[500,gy+13],3.6,1.4,vis,ink,{flat:true,a:0.62});
      mm_parch(ctx,500,gy+sw,190,26,{a:vis,flat:true,t,seed:i,draw:(c)=>T(c,s,10,19,{w:700,size:15,color:MM_SEP})});});
    mm_parch(ctx,150,480,240,110,{a:fin(g,0,0.15),t,seed:77,draw:(c)=>{T(c,"everything",20,50,{w:800,size:30,color:MM_SEP});T(c,"in the universe",20,82,{w:600,size:18,color:MM_SEP2});}});});}
function mm_miniRobinCard(ctx,x,y,w,h,title,year,line,ok,mark,a,draw,t,sd){mm_parch(ctx,x,y,w,h,{a,t,seed:sd,draw:(c)=>{T(c,title,24,44,{w:800,size:26,color:MM_SEP});T(c,year,24,70,{f:"mono",w:500,size:15,color:MM_SEP2});draw(c);T(c,line,24,h-30,{w:700,size:20,color:MM_SEP});
  if(mark>0){if(ok)tick_(c,w-40,44,34,[40,140,70],mark);else cross_(c,w-40,44,34,[170,50,40],mark);}}});}
scene("before",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");histBg(ctx,S,t);
  const cL=c("linn"),cW=c("wilkins"),cN=c("night"),cI=c("icd"),cS=c("lesson");
  const aL=1-fin(t,cW-0.3,0.8),aW=fin(t,cW-0.3,0.8)*(1-fin(t,cN-0.3,0.8)),aN=fin(t,cN-0.3,0.8)*(1-fin(t,cI-0.2,0.8)),aI=fin(t,cI-0.2,0.8)*(1-fin(t,cS-0.3,0.8)),aS=fin(t,cS-0.3,0.8);
  // Linnaeus: a place in a hierarchy, and a two-part name. The hierarchy is a living tree; the robin sits at the tip of its own branch
  if(aL>0)withA(ctx,aL,()=>{yearTag(ctx,120,120,"1750s · Linnaeus",CLAY,fin(t,0.5,0.6));
    const path=[0,1,2,3,4].map(d=>fin(t,cL+4.1+d*0.45,0.5)),grow=clamp((t-0.2)/2.2,0,1),P=mm_tree(ctx,t,grow,path);
    const lab={1:path[0],2:path[1],3:path[2],4:path[3],6:fin(t,cL+3.6,0.6),7:fin(t,cL+3.8,0.6),8:fin(t,cL+4.0,0.6)};mm_treeTags(ctx,t,P,lab,{4:pulseAt(t,cL+6.3,1.6)});
    const s_=2.3;mm_robin(ctx,P[5][0]+8,P[5][1]-44*s_,s_,fin(t,1.7,0.7),t);
    const nA=fin(t,cL+2.8,0.7);withA(ctx,nA,()=>{const s1="Erithacus ",s2="rubecula",w1=tw(ctx,s1,58,700),w2=tw(ctx,s2,58,700),x0=1420-(w1+w2)/2;T(ctx,s1+s2,x0,650,{w:700,size:58,color:rgba(PARCH,1)});
      withA(ctx,fin(t,cL+3.4,0.6),()=>{[[x0,x0+w1-18,"genus"],[x0+w1,x0+w1+w2,"species"]].forEach(([a,b,l])=>{ctx.strokeStyle=rgba(CLAY,0.9);ctx.lineWidth=2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a,670);ctx.quadraticCurveTo(a,682,a+10,682);ctx.lineTo(b-10,682);ctx.quadraticCurveTo(b,682,b,670);ctx.stroke();T(ctx,l,(a+b)/2,712,{f:"mono",w:500,size:18,align:"center",color:rgba(CLAY,1)});});});
      T(ctx,"named by Linnaeus in 1758 as Motacilla rubecula",1420,762,{f:"mono",w:500,size:16,align:"center",color:rgba(PARCH,0.7)});});
    withA(ctx,fin(t,cL+6.6,0.6),()=>tag(ctx,1420,180,"his system: still used today",[150,220,140],{align:"center",size:20}));});
  // Wilkins: a language to classify everything, sprawling off the edges, then fading
  if(aW>0)withA(ctx,aW,()=>{const g=clamp((t-cW-0.4)/3.0,0,1),g2=clamp((t-cW-1.2)/3.2,0,1),g3=clamp((t-cW-2.0)/3.4,0,1),dim=fin(t,cW+5.3,1.2),z=lerp(1.04,0.93,clamp((t-cW)/7,0,1));
    ctx.save();ctx.translate(700,540);ctx.scale(z,z);ctx.translate(-700,-540);mm_wilkins(ctx,t,g,g2,g3,dim);ctx.restore();
    yearTag(ctx,120,120,"1668 · Wilkins",CLAY,fin(t,cW,0.6));withA(ctx,fin(t,cW+0.8,0.6),()=>{ctx.fillStyle="rgba(26,16,10,0.85)";rr(ctx,110,152,380,64,10);ctx.fill();T(ctx,"An Essay towards a Real Character,",124,178,{f:"mono",w:500,size:15,color:rgba(PARCH,0.85)});T(ctx,"and a Philosophical Language",124,202,{f:"mono",w:500,size:15,color:rgba(PARCH,0.85)});});
    withA(ctx,fin(t,cW+2.2,0.6)*(1-dim*0.6),()=>{ctx.fillStyle="rgba(26,16,10,0.85)";rr(ctx,120,630,300,40,20);ctx.fill();T(ctx,"40 kinds, divided again and again",270,657,{w:600,size:16,align:"center",color:rgba(PARCH,0.95)});});
    withA(ctx,dim,()=>tag(ctx,270,700,"never took hold",EDGE_,{align:"center",size:22}));});
  // Nightingale: the same columns on every hospital's form
  if(aN>0)withA(ctx,aN,()=>{yearTag(ctx,120,120,"1860 · Nightingale",CLAY,1);withA(ctx,fin(t,cN+0.6,0.6),()=>T(ctx,"model hospital statistics",120,178,{f:"mono",w:500,size:16,color:rgba(PARCH,0.8)}));
    const band=fin(t,cN+5.3,0.6);[["Hospital A",150,-0.012],["Hospital B",710,0.006],["Hospital C",1270,-0.004]].forEach(([n,x,r],i)=>{const a=fin(t,cN+0.9+i*0.6,0.5);mm_form(ctx,x,210,500,440,n,i*2,{a,rot:r,t,band:band*(0.75+0.25*Math.sin(t*3+i)),fill:clamp((t-cN-1.2-i*0.6)/2.2,0,1)});});
    if(band>0)withA(ctx,band,()=>{ctx.save();ctx.globalCompositeOperation="lighter";ctx.strokeStyle="rgba(255,190,90,0.7)";ctx.lineWidth=3;ctx.shadowColor="rgba(255,190,90,0.9)";ctx.shadowBlur=12;[[650,710],[1210,1270]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(a,316);ctx.lineTo(b,316);ctx.stroke();});ctx.restore();
      tag(ctx,960,730,"same columns, same way: now they compare",[255,196,110],{align:"center",size:22});});});
  // the list of causes of death, 1893, and the classification it became
  if(aI>0)withA(ctx,aI,()=>{yearTag(ctx,120,120,"1893 → today",CLAY,1);
    mm_parch(ctx,180,180,560,520,{a:fin(t,cI+0.3,0.6),rot:-0.008,t,seed:21,draw:(c)=>{wrapT(c,"International List of Causes of Death",28,50,500,{w:800,size:24,lh:30,color:MM_SEP});T(c,"Bertillon · 1893",28,120,{f:"mono",w:500,size:15,color:MM_SEP2});
      MM_DEATH.forEach((s,i)=>{const q=clamp((t-cI-0.8)/2.6*MM_DEATH.length-i,0,1);if(q<=0)return;const yy=172+i*42;c.strokeStyle="rgba(90,66,40,0.25)";c.lineWidth=1;c.beginPath();c.moveTo(28,yy+10);c.lineTo(530,yy+10);c.stroke();T(c,typeOn(s,q),40,yy,{w:600,size:21,color:"rgba(52,40,30,0.9)"});});}});
    const ar=fin(t,cI+4.5,0.6);arrowTo(ctx,770,440,1050,440,CLAY,ar,{p:ar,bend:-0.12,head:14});
    withA(ctx,fin(t,cI+4.8,0.6),()=>{const x=1080,y=190,w=680,h=390;glass(ctx,x,y,w,h,18,[214,226,245],{glow:16,ea:0.8,fill:"rgba(8,12,22,0.95)"});T(ctx,"International Classification of Diseases",x+28,y+52,{w:800,size:28});T(ctx,"ICD-11 · World Health Organization",x+28,y+84,{w:600,size:17,color:rgba(SOFT,1)});
      MM_ICD.forEach(([k,n],i)=>withA(ctx,fin(t,cI+5.2+i*0.3,0.4),()=>{const yy=y+146+i*56;ctx.fillStyle="rgba(214,226,245,0.06)";rr(ctx,x+20,yy-32,w-40,46,8);ctx.fill();T(ctx,k,x+36,yy,{f:"mono",w:500,size:21,color:rgba(MM_INK,1)});T(ctx,n,x+130,yy,{w:600,size:20});}));});
    const tl=clamp((t-cI-5.4)/2.2,0,1),x0=180,x1=1740,ty=790,X=yr=>lerp(x0,x1,(yr-1893)/(2022-1893));withA(ctx,fin(t,cI+5.3,0.4),()=>{ctx.strokeStyle=rgba(CLAY,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,ty);ctx.lineTo(lerp(x0,x1,tl),ty);ctx.stroke();
      MM_REV.forEach(yr=>{const q=clamp((tl-(yr-1893)/129)*12,0,1);if(q<=0)return;ctx.fillStyle=rgba(CLAY,q);ctx.beginPath();ctx.arc(X(yr),ty,6,0,TAU);ctx.fill();});
      [[1893,"list"],[1948,"WHO"],[1990,"ICD-10"],[2022,"ICD-11"]].forEach(([yr,l])=>{const q=clamp((tl-(yr-1893)/129)*10,0,1);if(q>0)withA(ctx,q,()=>{T(ctx,""+yr,X(yr),ty+36,{f:"mono",w:500,size:17,align:"center",color:rgba(CLAY,1)});T(ctx,l,X(yr),ty-18,{w:700,size:17,align:"center",color:rgba(PARCH,0.95)});});});});});
  // the lesson: the ones that last are made for a purpose
  if(aS>0)withA(ctx,aS,()=>{const mk=k=>fin(t,cS+2.3+k*0.35,0.4);
    mm_miniRobinCard(ctx,150,170,480,330,"Linnaeus","1750s","names for every species",true,mk(0),fin(t,cS,0.5),(c)=>mm_robin(c,240,160,1.3,1,t),t,31);
    mm_miniRobinCard(ctx,720,170,480,330,"Wilkins","1668","a place for everything",false,mk(1),fin(t,cS+0.25,0.5),(c)=>{for(let i=0;i<14;i++){const y1=100+i*10,y2=90+i*11+hash(i,2)*8+Math.sin(t+i)*2;mm_limb(c,[60,170],[120,170],[150,y1],[210,y1],2.4,1,1,[110,82,54],{flat:true,a:0.6});mm_limb(c,[210,y1],[300,y1],[340,y2],[440,y2],1.4,0.6,1,[110,82,54],{flat:true,a:0.4});}},t,32);
    mm_miniRobinCard(ctx,1290,170,480,330,"Nightingale → ICD","1860 · 1893","causes of death, compared",true,mk(2),fin(t,cS+0.5,0.5),(c)=>{c.strokeStyle="rgba(96,70,44,0.45)";c.lineWidth=1.2;for(let i=0;i<6;i++){c.beginPath();c.moveTo(40,100+i*24);c.quadraticCurveTo(240,102+i*24+hash(i,3)*3,440,100+i*24);c.stroke();}for(let j=1;j<5;j++){c.beginPath();c.moveTo(40+j*80,100);c.quadraticCurveTo(42+j*80,160,40+j*80,220);c.stroke();}},t,33);
    withA(ctx,fin(t,cS+0.6,0.6),()=>T(ctx,"Shared definitions let strangers compare.",960,590,{w:700,size:36,align:"center",color:rgba(PARCH,1)}));
    withA(ctx,fin(t,cS+3.2,0.7),()=>{const s="made for a purpose, not for everything",w=tw(ctx,s,42,800)+80;glow(ctx,960,690,420,[255,196,110],0.12);glass(ctx,960-w/2,640,w,100,22,[255,196,110],{glow:20,ea:0.9,fill:"rgba(26,16,10,0.94)"});T(ctx,s,960,705,{w:800,size:42,align:"center",color:rgba([255,214,160],1)});});});
  seriesTitle(ctx,S,t,B,"Meaning machines can read","what an AI assistant needs to answer right",MM_INK);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Genie guesses ---------- */
const MM_TL={cols:["learner_id","name"],rows:[["L-1042","Aisha K."],["L-2210","Ben O."],["L-3307","Chen W."]]};
const MM_TC={cols:["learner_id","credential","is_micro","stack_ok"],rows:[["L-1042","DataVis","true","true"],["L-1042","SQL-A","true","true"],["L-3307","PyBasics","true","false"]]};
const MM_TG={cols:["cert_id","name","credit"],rows:[["GC-DA","Grad Cert DA","40"],["GC-AI","Grad Cert AI","40"]]};
function mm_asker(ctx,t,a,qA,o){o=o||{};withA(ctx,a,()=>{person(ctx,"ana",250,900,0.64,{t,pose:o.pose||"stand",expr:o.expr||"calm"});
  withA(ctx,qA,()=>{tag(ctx,90,(o.qy||226)-30,"Ana Ruiz · Head of School",MM_ASK,{size:18});bubble(ctx,90,o.qy||226,640,MM_Q,MM_ASK,{size:28});});});}
scene("guesses",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cA=c("ask"),cF=c("finds"),cW=c("wrong"),cR=c("read");
  tag(ctx,120,110,"The university · today",[236,243,255],{size:20});
  mm_asker(ctx,t,fin(t,0.3,0.6),fin(t,cA+2.6,0.6),{pose:t>cA+2.4&&t<cF+0.5?"explain":"stand",expr:t>cW+5.6?"concerned":"calm"});
  const gx=760,gy=470;mm_genie(ctx,gx,gy,t,{a:fin(t,cA+2.0,0.6)});
  // what Genie can read: tables
  const tA=fin(t,cF-0.2,0.6),L=mm_cols(ctx,MM_TL.cols,MM_TL.rows),Cc=mm_cols(ctx,MM_TC.cols,MM_TC.rows),wL=L[L.length-1].x+L[L.length-1].w,wC=Cc[Cc.length-1].x+Cc[Cc.length-1].w;
  const X1=930,X2=X1+wL+36,Y1=110,Y2=366,DY=400;
  withA(ctx,tA,()=>{table(ctx,X1,Y1,"learners",MM_TL.cols,MM_TL.rows,{col:[150,225,255]});table(ctx,X2,Y1,"credentials",MM_TC.cols,MM_TC.rows,{col:[150,225,255]});table(ctx,X1,Y2,"certificates",MM_TG.cols,MM_TG.rows,{col:[150,225,255]});});
  // Genie looks through them: a beam to each table, and a scan across the columns
  [[X1+wL/2,Y1+100],[X2+wC/2,Y1+100],[X1+160,Y2+80]].forEach(([x,y],i)=>{const a=fin(t,cF+0.3+i*0.35,0.4)*(1-fin(t,cW+0.5,0.8));if(a<=0)return;withA(ctx,a*0.8,()=>{ctx.save();ctx.setLineDash([5,9]);ctx.strokeStyle=rgba(MM_GEN,0.55);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(gx+30,gy);ctx.lineTo(x,y);ctx.stroke();ctx.restore();
    const u=((t-cF)*0.7+i*0.33)%1;glow(ctx,lerp(gx+30,x,u),lerp(gy,y,u),16,MM_GEN,0.7);});});
  const sc_=clamp((t-cF-1.2)/3.8,0,1);if(sc_>0&&sc_<1){const sx=X2+wC*sc_;withA(ctx,0.8,()=>{ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createLinearGradient(sx-40,0,sx,0);g.addColorStop(0,"rgba(120,200,255,0)");g.addColorStop(1,"rgba(120,200,255,0.35)");ctx.fillStyle=g;ctx.fillRect(sx-40,Y1+50,40,166);ctx.restore();});}
  [[2,cF+3.0],[3,cF+4.7]].forEach(([k,t0])=>{const a=fin(t,t0,0.4);if(a<=0)return;const col=Cc[k],x=X2+col.x+2,hi=pulseAt(t,t0,1.4);withA(ctx,a,()=>{glow(ctx,x+col.w/2,Y1+140,90,CYAN,0.25+0.3*hi);ctx.save();ctx.strokeStyle=rgba(CYAN,1);ctx.lineWidth=2.4+2*hi;ctx.shadowColor=rgba(CYAN,0.9);ctx.shadowBlur=14;rr(ctx,x,Y1+50,col.w-4,166,8);ctx.stroke();ctx.restore();});});
  // the rules live in a document no tool can read
  const dA=fin(t,cW+2.0,0.6),grey=fin(t,cW+3.3,0.8),inv=fin(t,cR+2.9,0.6);
  mm_doc(ctx,1330,DY,440,420,{a:dA,grey});
  if(grey>0)withA(ctx,grey,()=>{ctx.fillStyle="rgba(7,12,24,0.9)";ctx.beginPath();ctx.arc(1550,DY+310,40,0,TAU);ctx.fill();mm_eyeOff(ctx,1550,DY+310,26,[255,140,120],0.6+0.4*Math.abs(Math.sin(t*2))*inv+0.4*(1-inv));tag(ctx,1550,DY-30,"no tool can read this",[200,205,215],{align:"center",size:18});});
  if(inv>0)withA(ctx,inv,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(EDGE_,0.9);ctx.lineWidth=2.4;rr(ctx,1318,DY-12,464,444,12);ctx.stroke();ctx.restore();});
  // Genie guesses: a confident number, and the registrar's list
  const gA=fin(t,cW+4.8,0.4),jit=t>cW+4.8&&t<cW+5.5?(hash(Math.floor(t*30),3)-0.5)*10:0;
  withA(ctx,gA,()=>{glow(ctx,690,740,220,BAD,0.18+0.08*Math.sin(t*3));numCard(ctx,500+jit,640,380,"Genie","214","guessed from is_micro and stack_ok",BAD);cross_(ctx,846,672,30,BAD,fin(t,cW+5.9,0.4));});
  withA(ctx,fin(t,cW+5.6,0.5),()=>numCard(ctx,910,640,380,"Registrar's list","132","by the stacking policy",GOOD));
  // what it can read, and what it can't
  const bA=fin(t,cR+0.2,0.7);if(bA>0)withA(ctx,bA,()=>{const xr=X2+wC+18;ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(MM_GEN,0.85);ctx.lineWidth=2.2;ctx.shadowColor=rgba(MM_GEN,0.6);ctx.shadowBlur=10;
    ctx.beginPath();ctx.moveTo(912,92);ctx.lineTo(xr,92);ctx.lineTo(xr,344);ctx.lineTo(1300,344);ctx.lineTo(1300,572);ctx.lineTo(912,572);ctx.closePath();ctx.stroke();ctx.restore();tag(ctx,912,70,"what Genie can read",MM_GEN,{size:18});});
  vign(ctx,S);});

/* ---------- 3. Four ways to write meaning down ---------- */
scene("four",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cG=c("gloss"),cT=c("tax"),cO=c("onto"),cSm=c("sem"),cK=c("stack"),litT=[cG+4.1,cT+0.1,cO+0.1,cSm+0.2],dur=[1.6,1.8,3.9,1.6];
  const br=k=>t>B?pulseAt(t,B+0.2+k*0.65,1.3):0;
  const an=mm_stack(ctx,t,{a:[0,1,2,3].map(k=>fin(t,cG+0.3+k*0.3,0.6)),lit:litT.map(x=>fin(t,x,0.6)),ca:litT.map((x,k)=>clamp((t-x-0.2)/dur[k],0,1)),qa:litT.map(x=>fin(t,x+1.3,0.6)),
    hi:litT.map((x,k)=>Math.max(pulseAt(t,x,2.6),pulseAt(t,cK+1.4,1.6),br(k))),mh:[0,1,2,3].map(k=>fin(t,cK+0.3,0.6))});
  withA(ctx,fin(t,cT+2.4,0.5),()=>T(ctx,"like Linnaeus's",202,mm_fy(1)+124,{w:600,size:16,color:rgba(PARCH,0.9)}));
  mm_thread(ctx,an,clamp((t-cK-0.3)/1.4,0,1),t,[236,243,255]);
  withA(ctx,fin(t,cK+0.1,0.6),()=>tag(ctx,960,64,"a stack, not rivals",[236,243,255],{align:"center",size:22}));
  vign(ctx,S);});

/* ---------- 4. The ontology ---------- */
scene("ontology",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cR=c("rules"),cG=c("graph"),cA=c("aristotle"),out1=fin(t,cG-0.4,0.8),dimG=fin(t,cA-0.2,0.8);
  // statements
  if(out1<1)withA(ctx,1-out1,()=>{tag(ctx,960,96,"Ontology: rules, written as statements",MM_ONT,{align:"center",size:24});
    const a1=fin(t,cR+3.5,0.5),a2=fin(t,cR+6.5,0.5),f1=fin(t,cR+1.4,0.6),f2=fin(t,cR+2.0,0.6);
    withA(ctx,f1*(1-a1),()=>glass(ctx,260,150,1400,210,20,MM_ONT,{glow:8,ea:0.35,fill:"rgba(12,8,26,0.6)"}));withA(ctx,f2*(1-a2),()=>glass(ctx,260,392,1400,290,20,MM_ONT,{glow:8,ea:0.35,fill:"rgba(12,8,26,0.6)"}));
    withA(ctx,f1*(1-a1),()=>{[0,1].forEach(k=>{const y=k?470:222;ctx.fillStyle=rgba(MM_ONT,0.12);for(let i=0;i<3;i++){rr(ctx,300+i*300,y,250-i*40,22,11);ctx.fill();}});});
    withA(ctx,a1,()=>{glass(ctx,260,150,1400,210,20,MM_ONT,{glow:14,ea:0.6,fill:"rgba(12,8,26,0.93)"});T(ctx,"A microcredential is a kind of credential.",300,204,{w:700,size:28});
      const A=mm_pill(ctx,760,296,"Microcredential",MM_ONT,{size:22,r:12,a:fin(t,cR+4.1,0.5),fill:"rgba(34,22,60,0.96)"}),Bb=mm_pill(ctx,1300,296,"Credential",MM_ONT,{size:22,r:12,a:fin(t,cR+4.4,0.5),fill:"rgba(34,22,60,0.96)"});
      mm_link(ctx,A,Bb,"is a kind of",MM_ONT,{p:clamp((t-cR-4.5)/0.7,0,1),size:18,off:22});});
    withA(ctx,a2,()=>{glass(ctx,260,392,1400,290,20,MM_ONT,{glow:14,ea:0.6,fill:"rgba(12,8,26,0.93)"});T(ctx,"A graduate certificate accepts up to four approved microcredentials towards its credit.",300,446,{w:700,size:26});
      const A=mm_pill(ctx,560,540,"Graduate certificate",MM_ONT,{size:22,r:12,a:fin(t,cR+7.1,0.5),fill:"rgba(34,22,60,0.96)"}),Bb=mm_pill(ctx,1300,540,"Microcredential",MM_ONT,{size:22,r:12,a:fin(t,cR+7.4,0.5),fill:"rgba(34,22,60,0.96)"});
      mm_link(ctx,A,Bb,"accepts",MM_ONT,{p:clamp((t-cR-7.5)/0.7,0,1),size:18,off:22});
      [["max 4",8.4],["approved only",9.1],["towards its credit",10.2]].forEach(([s,d],i)=>{const q=fin(t,cR+d,0.4);mm_pill(ctx,760+i*190+(i===2?30:0),628,s,[236,226,255],{size:17,a:q,hi:pulseAt(t,cR+d,1.2),hiCol:MM_ONT,fill:"rgba(34,22,60,0.96)"});});
      withA(ctx,fin(t,cR+10.8,0.5),()=>T(ctx,"a machine can check this",1640,666,{w:600,size:17,align:"right",color:rgba(MM_ONT,1)}));});});
  // the knowledge graph: the university's data, connected to the statements
  if(out1>0)withA(ctx,out1*(1-dimG*0.85),()=>{mm_kg(ctx,t,{p:{schema:clamp((t-cG+0.2)/1.2,0,1),data:clamp((t-cG-3.7)/2.2,0,1),links:clamp((t-cG-5.0)/2.4,0,1)},aisha:fin(t,cG+7.6,0.6)*(1-dimG)});
    withA(ctx,fin(t,cG+3.9,0.6),()=>tag(ctx,1560,430,"a knowledge graph",MM_ONT,{align:"center",size:20}));});
  // Aristotle's recipe, made formal
  if(dimG>0)withA(ctx,dimG,()=>{const br=Math.sin(t*0.9);ctx.save();ctx.translate(520,430);ctx.rotate(0.003*br);ctx.translate(-520,-430+1.6*br);sheet(ctx,160,160,720,540,{rot:-0.01});const pl=[["Aristotle: the kind, then what sets it apart",22,226],["A microcredential is",30,318],["a credential,",30,372],["small, with its learning assessed,",30,448],["that can count towards an award.",30,502]];
    pl.forEach(([s,sz,y],i)=>pencilText(ctx,s,214,y,{size:sz,w:i?600:700,p:clamp((t-cA-0.2-i*0.35)/0.8,0,1)}));
    const u1=fin(t,cA+1.8,0.6),u2=fin(t,cA+3.1,0.6);ctx.save();ctx.lineWidth=4;ctx.strokeStyle="rgba(40,90,200,0.85)";ctx.beginPath();ctx.moveTo(214,382);ctx.lineTo(214+tw(ctx,"a credential",30,600)*u1,382);ctx.stroke();
    ctx.strokeStyle="rgba(200,110,20,0.85)";ctx.beginPath();ctx.moveTo(214,458);ctx.lineTo(214+tw(ctx,"small, with its learning assessed,",30,600)*u2,458);ctx.moveTo(214,512);ctx.lineTo(214+tw(ctx,"that can count towards an award.",30,600)*u2,512);ctx.stroke();ctx.restore();
    withA(ctx,u1,()=>T(ctx,"the kind of thing",620,372,{w:700,size:19,color:"rgba(40,90,200,0.95)"}));withA(ctx,u2,()=>T(ctx,"what sets it apart",214,570,{w:700,size:19,color:"rgba(200,110,20,0.95)"}));ctx.restore();
    const fA=fin(t,cA+2.2,0.6);withA(ctx,fA,()=>{glass(ctx,1030,160,730,540,20,MM_ONT,{glow:18,ea:0.85,fill:"rgba(12,8,26,0.95)"});T(ctx,"in the ontology",1066,214,{w:700,size:22,color:rgba(MM_ONT,1)});
      const fl=[["Microcredential",""],["  subClassOf    ","Credential"],["  assessed      ","true"],["  volume        ","less than an award"],["  countsTowards ","Graduate certificate"],["                ","max 4 · approved only"]];
      fl.forEach(([a,b],i)=>{const q=clamp((t-cA-2.4-i*0.3)/0.5,0,1);if(q<=0)return;withA(ctx,q,()=>{T(ctx,a,1066,290+i*62,{f:"mono",w:500,size:23,color:rgba(i?SOFT:MM_ONT,1)});if(b)T(ctx,b,1066+tw(ctx,a,23,500,"mono"),290+i*62,{f:"mono",w:500,size:23,color:rgba(i===1?[120,170,255]:i>=3?[255,190,120]:INK,1)});});});});
    const ar=fin(t,cA+3.6,0.6);arrowTo(ctx,890,430,1020,430,MM_ONT,ar,{p:ar,head:14});withA(ctx,ar,()=>T(ctx,"made formal",955,408,{w:700,size:17,align:"center",color:rgba(MM_ONT,1)}));
    withA(ctx,fin(t,cA+4.3,0.6),()=>tag(ctx,1395,752,"a form a machine can use",MM_ONT,{align:"center",size:20}));});
  vign(ctx,S);});

/* ---------- 5. The semantic layer ---------- */
scene("semantic",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cO=c("once"),cT=c("tools"),cP=c("open");
  const rows=[4.1,4.8,5.9,6.9].map(d=>fin(t,cO+d,0.5)),rh=[4.1,4.8,5.9,6.9].map(d=>pulseAt(t,cO+d,1.4));
  const mx=620,my=150,mw=680,mh=470;mm_metric(ctx,mx,my,mw,mh,{a:fin(t,cO+0.6,0.7),rows,rowHi:rh,hi:pulseAt(t,cO+3.3,1.8)+pulseAt(t,cT+2.0,1.6)*0.6,num:"11,890",numA:fin(t,cT+2.2,0.5)});
  // the tools: each once wrote its own version; now each asks the one definition
  const ask=k=>fin(t,cT+1.7+k*0.35,0.6),old=k=>fin(t,cT+2.2+k*0.35,0.5);
  mm_dash(ctx,110,170,400,250,ask(0)>0.5?"11,890":"12,140",ask(0)>0.5?[39,124,67]:[200,45,76],{a:fin(t,cT-0.2,0.5),old:"own SQL: 12,140",oldA:old(0)});
  mm_xls(ctx,110,480,400,220,ask(1)>0.5?"11,890":"11,702",ask(1)>0.5?[39,124,67]:[200,45,76],{a:fin(t,cT+0.4,0.5),old:"own formula: 11,702",oldA:old(1)});
  const gA=fin(t,cT+1.1,0.5);mm_genie(ctx,1590,290,t,{a:gA});withA(ctx,gA,()=>{bubble(ctx,1420,470,380,(ask(2)>0.5?"11,890":"12,960")+" credentials",ask(2)>0.5?GOOD:BAD,{size:26});
    withA(ctx,old(2),()=>{const s="own guess: 12,960";T(ctx,s,1446,600,{f:"mono",w:500,size:15,color:rgba(BAD,1)});ctx.strokeStyle=rgba(BAD,1);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1442,595);ctx.lineTo(1450+tw(ctx,s,15,500,"mono"),595);ctx.stroke();});});
  [[510,295,mx,300],[510,590,mx,470],[1440,330,mx+mw,300]].forEach(([x0,y0,x1,y1],k)=>{const p=ask(k);if(p>0)arrowTo(ctx,x0+(k===2?0:10),y0,x1+(k===2?10:-10),y1,MM_SEM,0.9,{p,head:14,bend:k===1?0.1:-0.05});});
  withA(ctx,fin(t,cT+2.6,0.6),()=>T(ctx,"one definition, every tool",960,122,{w:700,size:22,align:"center",color:rgba(MM_SEM,1)}));
  // open formats: the definition itself, shared between tools
  const oA=fin(t,cP+0.2,0.7),dy=lerp(-120,0,ease(oA));withA(ctx,oA,()=>{const x=740,y=654+dy;glass(ctx,x,y,440,186,14,MM_SEM,{glow:14,ea:0.8,fill:"rgba(6,14,30,0.96)"});T(ctx,"credentials_awarded · definition",x+22,y+36,{f:"mono",w:500,size:16,color:rgba(MM_SEM,1)});
    ["measure  count(credential)","exclude  revoked","time     awarded_on · academic year","grain    one credential awarded"].forEach((s,i)=>T(ctx,s,x+22,y+74+i*28,{f:"mono",w:500,size:16,color:rgba(INK,0.9)}));});
  withA(ctx,fin(t,cP+1.6,0.6),()=>tag(ctx,1210,748,"open formats are appearing",MM_SEM,{size:20}));
  vign(ctx,S);});

/* ---------- 6. Standards ---------- */
scene("standards",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cB=c("blank"),cC=c("creds"),cT=c("three"),cH=c("choose"),o3=fin(t,cT-0.3,0.7),oH=fin(t,cH-0.3,0.7);
  // a blank page, then the shelf of published models
  const bp=fin(t,cB+2.6,0.8);if(bp<1)withA(ctx,fin(t,0.2,0.6)*(1-bp),()=>{sheet(ctx,760-bp*300,190,400,520,{plain:true});if(Math.floor(t*2)%2===0){ctx.fillStyle="rgba(40,40,40,0.8)";ctx.fillRect(820-bp*300,250,3,34);}});
  if(o3<1)withA(ctx,1-o3,()=>{mm_shelf(ctx,t,108,190,{ga:[3.2,3.7,4.1,4.5,6.8].map(d=>fin(t,cB+d,0.5)),hi:[0,0,0,0,pulseAt(t,cB+6.9,2.2)+pulseAt(t,cC+0.2,1.8)]});
    // digital credentials: their own open standards
    const dA=fin(t,cC-0.2,0.6);withA(ctx,dA,()=>{T(ctx,"DIGITAL CREDENTIALS",180,520,{f:"mono",w:500,size:16,color:rgba(MM_REFC,1)});
      ["W3C Verifiable Credentials","Open Badges","European Learning Model"].forEach((s,i)=>withA(ctx,fin(t,cC+0.3+i*0.35,0.4),()=>tag(ctx,180,570+i*64,s,MM_REFC,{size:22})));
      const hl={issuer:fin(t,cC+2.7,0.4),holder:fin(t,cC+3.2,0.4),evidence:fin(t,cC+3.8,0.4)};mm_vc(ctx,860,470,760,{a:fin(t,cC+0.6,0.5),hl,rh:50,sub:"what the standards name",vals:{issuer:"the university",holder:"Aisha K.",claim:"Data Visualisation",evidence:"assessed project",status:"valid"}});});});
  // three official definitions of one word
  if(o3>0)withA(ctx,o3*(1-oH),()=>{withA(ctx,fin(t,cT+0.2,0.6),()=>{T(ctx,"“microcredential”: three official definitions",960,112,{w:700,size:26,align:"center",color:rgba(INK,0.95)});});
    MM_DEFS.forEach((d,i)=>mm_def(ctx,130+i*570,150,520,430,d,{a:fin(t,cT+0.5+i*0.25,0.6),hA:fin(t,cT+[2.4,3.6,4.7][i],0.5),p:clamp((t-cT-[2.6,3.8,4.9][i])/1.0,0,1),diff:fin(t,cT+5.8,0.6),same:fin(t,cT+6.6,0.6)}));
    withA(ctx,fin(t,cT+6.2,0.6),()=>tag(ctx,960,640,"same word, different edges",EXT,{align:"center",size:22}));});
  // choose deliberately: check, adopt, extend, record, at every layer
  if(oH>0)withA(ctx,oH,()=>{const steps=[["1  Check",REF,1.1],["2  Adopt",ADOPT,1.7],["3  Extend",EXT,2.2],["4  Record",[236,243,255],2.7]];
    steps.forEach(([s,col,d],i)=>withA(ctx,fin(t,cH+d,0.4),()=>{const x=510+i*300,hi=pulseAt(t,cH+d,1.4);glow(ctx,x,170,80,col,0.25+0.4*hi);tag(ctx,x,170,s,col,{align:"center",size:24});}));
    withA(ctx,fin(t,cH+3.2,0.6),()=>T(ctx,"from A Sharper Sketch",960,232,{w:600,size:18,align:"center",color:rgba(SOFT,1)}));
    ctx.save();ctx.translate(480,300);ctx.scale(0.5,0.5);mm_stack(ctx,t,{a:[0,1,2,3].map(k=>fin(t,cH+0.3+k*0.15,0.5)),bare:true,inner:(cx,k,x,y,w,h)=>{T(cx,MM_L[k].n,x+60,y+88,{w:800,size:50,color:rgba(MM_L[k].c,1)});
      [REF,ADOPT,EXT,[236,243,255]].forEach((col,j)=>{const q=fin(t,cH+5.0+k*0.22+j*0.08,0.35);if(q<=0)return;const px=x+w-420+j*110,py=y+h/2;glow(cx,px,py,60,col,0.5*q);cx.fillStyle=rgba(col,q);cx.beginPath();cx.arc(px,py,20,0,TAU);cx.fill();cx.fillStyle="rgba(255,255,255,"+(0.8*q)+")";cx.beginPath();cx.arc(px-6,py-6,6,0,TAU);cx.fill();});}});ctx.restore();
    withA(ctx,fin(t,cH+5.0,0.6),()=>tag(ctx,960,770,"at every layer",[236,243,255],{align:"center",size:22}));});
  vign(ctx,S);});

/* ---------- 7. Genie, again ---------- */
scene("again",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cA=c("asks"),cN=c("answer"),cE=c("evid");
  mm_asker(ctx,t,fin(t,0.2,0.6),fin(t,0.5,0.6),{qy:150,pose:t<cA+2.0||(t>cA+4.8&&t<cA+6.4)?"explain":"stand",expr:t>cN+0.6?"relieved":"calm"});
  const gx=760,gy=470;mm_genie(ctx,gx,gy,t,{a:fin(t,0.4,0.6),sub:"reads the meaning"});
  withA(ctx,fin(t,cA+2.3,0.5),()=>{tag(ctx,880,112,"Genie asks back",MM_GEN,{size:18});bubble(ctx,860,140,640,"Approved for stacking, or all microcredentials?",MM_GEN,{size:28});});
  withA(ctx,fin(t,cA+4.9,0.5),()=>bubble(ctx,300,352,380,"Approved for stacking.",MM_ASK,{size:26}));
  // the answer, and the definition it used
  const nA=fin(t,cN+0.2,0.5);withA(ctx,nA,()=>{glow(ctx,1060,400,240,GOOD,0.14+0.06*Math.sin(t*2));numCard(ctx,860,300,400,"Genie",fmtNum(countTo(t,cN+0.3,0,132)),"matches the registrar's list",GOOD);});
  withA(ctx,fin(t,cN+1.1,0.6),()=>{glass(ctx,1290,300,560,250,18,MM_GEN,{glow:14,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(ctx,"the definition it used",1316,340,{w:700,size:19,color:rgba(SOFT,1)});
    wrapT(ctx,"one away: holds 3 of the 4 approved microcredentials a graduate certificate accepts",1316,380,510,{w:700,size:22,lh:29});
    tag(ctx,1316,482,"ontology · stacking rule",MM_ONT,{size:16});tag(ctx,1316,524,"semantic layer · near a certificate",MM_SEM,{size:16});});
  // grounded or not: qualitative, not to scale
  const eA=fin(t,cE+0.3,0.6);withA(ctx,eA,()=>{const x=900,y=590,w=950;glass(ctx,x,y,w,210,18,[236,243,255],{glow:10,ea:0.5,fill:"rgba(7,12,24,0.94)"});T(ctx,"how often the answer is right",x+26,y+38,{w:700,size:19,color:rgba(SOFT,1)});
    const b1=ease(clamp((t-cE-1.0)/1.2,0,1)),b2=ease(clamp((t-cE-1.6)/1.8,0,1));
    [["tables only",BAD,0.28,b1,"guesses"],["tables + meaning",GOOD,0.78,b2,"grounded"]].forEach(([l,col,f,p,e],i)=>{const yy=y+84+i*58;T(ctx,l,x+26,yy+8,{w:700,size:22});ctx.fillStyle="rgba(255,255,255,0.05)";rr(ctx,x+260,yy-16,600,32,8);ctx.fill();
      ctx.fillStyle=rgba(col,0.85);rr(ctx,x+260,yy-16,Math.max(8,600*f*p),32,8);ctx.fill();withA(ctx,fin(p,0.8,0.2),()=>T(ctx,e,x+274+600*f*p,yy+8,{w:700,size:19,color:rgba(col,1)}));});
    T(ctx,"illustrative · not to scale",x+w-24,y+194,{f:"mono",w:500,size:14,align:"right",color:rgba(SOFT,0.8)});});
  withA(ctx,fin(t,cE+6.0,0.6),()=>tag(ctx,1375,836,"the difference is the meaning it can read",[236,243,255],{align:"center",size:20}));
  vign(ctx,S);});

/* ---------- 8. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cT=c("tri"),cN=c("next"),cx=960,cy=430,wx=660,wy=600,ix=960,iy=240,hx=1260,hy=600;
  // the triangle from What's in a word, remembered, then filled in
  withA(ctx,fin(t,cT+0.2,0.8)*(1-fin(t,cT+8.4,0.8)),()=>{ctx.save();ctx.setLineDash([8,10]);ctx.strokeStyle=rgba(KIND,0.7);ctx.lineWidth=2.4;ctx.shadowColor=rgba(KIND,0.6);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(ix,iy);ctx.lineTo(hx,hy);ctx.stroke();ctx.restore();
    [[wx,wy,"word",cT+2.9],[ix,iy,"idea",cT+5.0],[hx,hy,"thing",cT+7.9]].forEach(([x,y,l,t1],i)=>withA(ctx,fin(t,cT+0.5+i*0.4,0.5)*(1-fin(t,t1-0.2,0.4)),()=>{glow(ctx,x,y,60,KIND,0.4+0.15*Math.sin(t*2+i));ctx.fillStyle=rgba(KIND,0.9);ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill();T(ctx,l,x,y+(i===1?-26:44),{w:700,size:24,align:"center",color:rgba(KIND,1)});}));
    withA(ctx,fin(t,cT+0.6,0.6)*(1-fin(t,cT+2.7,0.5)),()=>T(ctx,"from What's in a word",960,560,{w:600,size:22,align:"center",color:rgba(SOFT,1)}));});
  const wa=fin(t,cT+2.9,0.5),ia=fin(t,cT+5.0,0.6),ha=fin(t,cT+7.9,0.6);
  trio(ctx,cx,cy,1,{t,col:MM_ONT,word:"credential",wordLab:" ",idea:"Credential",thing:(c2,x,y,s)=>{const L=mm_cols(c2,["id","holder","kind"],[["C-88","Aisha K.","micro"],["C-91","Aisha K.","micro"],["A-12","Ben O.","award"]]),w=L[2].x+L[2].w;table(c2,x-w/2,y-104,"credentials",["id","holder","kind"],[["C-88","Aisha K.","micro"],["C-91","Aisha K.","micro"],["A-12","Ben O.","award"]],{col:[150,225,255]});},
    thingLab:"the data it points to",thingDy:146,e1:clamp((t-cT-5.2)/1.0,0,1),e2:clamp((t-cT-7.5)/1.0,0,1),e3:0,wa,ia,ha});
  withA(ctx,fin(t,cT+4.6,0.5),()=>{const w=tw(ctx,"credencial",26,800)+40;glass(ctx,wx-w/2,wy+44,w,50,12,MM_ONT,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.93)"});T(ctx,"credencial",wx,wy+78,{w:800,size:26,align:"center"});
    T(ctx,"en",wx-tw(ctx,"credential",30,800)/2-50,wy+10,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});T(ctx,"es",wx-w/2-26,wy+76,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});T(ctx,"the word",wx,wy+132,{w:700,size:20,align:"center",color:rgba(SOFT,1)});});
  // the idea, now a node in the ontology
  withA(ctx,ia,()=>{const A=mm_pill(ctx,700,128,"Award",MM_ONT,{size:16,r:10,a:fin(t,cT+5.6,0.5)}),M=mm_pill(ctx,1220,128,"Microcredential",MM_ONT,{size:16,r:10,a:fin(t,cT+5.9,0.5)});
    [A,M].forEach((b,i)=>{const q=fin(t,cT+5.8+i*0.3,0.5);if(q>0)isa(ctx,b.x+(i?-b.w/2-4:b.w/2+4),b.y+6,ix+(i?34:-34),iy-8,q,MM_ONT,{fill:"#0a0a18",s:12,lw:1.8});});
    T(ctx,"now written in the ontology",ix+44,iy+10,{w:600,size:18,color:rgba(SOFT,1)});});
  withA(ctx,fin(t,cN+0.3,0.6)*(1-fin(t,B,0.5)),()=>T(ctx,"Next: keeping it true",960,810,{w:700,size:26,align:"center",color:rgba(SOFT,1)}));
  endCard(ctx,S,t,B+0.3,"Meaning machines can read",MM_INK,"An assistant answers from the meaning it can read.");
  vign(ctx,S);});

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
function drawCaption(ctx,S,t){if(!CAPS_ON)return;let c=null;for(const k of TL.caps){if(t>=k.s-0.06&&t<k.e+0.15){c=k;break;}}if(!c)return;const a=sstep(c.s-0.06,c.s+0.1,t)*(1-sstep(c.e,c.e+0.15,t));if(a<=0)return;
  setScreen(ctx,S);ctx.font=font(600,40);const lines=wrapLines(ctx,c.text,1480),lh=54,h=lines.length*lh+26;let w=0;lines.forEach(l=>{w=Math.max(w,ctx.measureText(l).width);});w+=60;const x=W/2-w/2,y=H-54-h;
  ctx.save();ctx.globalAlpha=a;ctx.fillStyle="rgba(0,0,0,0.66)";rr(ctx,x,y,w,h,14);ctx.fill();lines.forEach((l,i)=>T(ctx,l,W/2,y+13+lh*(i+0.77),{size:40,w:600,align:"center",color:"#ffffff"}));ctx.restore();}
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
