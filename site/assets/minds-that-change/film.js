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

// Minds that change, the fifth film of What an agent is, the first series on agentic data engineering. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"kept":{"name":"Kept by heart","lead":1.6,"tail":1.0,"vo":[
 {"id":"place","gap":0.8,"text":"Northern India, about three thousand years ago."},
 {"id":"families","gap":0.8,"text":"Families of poets and priests keep the Rigveda: more than a thousand hymns, their most sacred words."},
 {"id":"written","gap":0.8,"text":"Nothing is written down."},
 {"id":"lives","gap":0.8,"text":"Every hymn lives in memory, passed from teacher to student."},
 {"id":"changes","gap":0.8,"text":"But memory changes."},
 {"id":"rebuild","gap":0.8,"text":"Each time we remember something, we rebuild it, and a word can slip."},
 {"id":"taught","gap":0.8,"text":"Taught to a student, a slip becomes the hymn."},
 {"id":"lose","gap":0.8,"text":"With no page to check against, in a few generations the families could lose their hymns for good."},
 {"id":"exact","gap":0.8,"text":"Something had to keep them exact."},
 {"id":"patterns","gap":0.3,"text":"So, over the centuries, their teachers built several patterns for every hymn:"},
 {"id":"ways","gap":0.8,"text":"as it's recited, word by word, in pairs, and braided, back and forth."},
 {"id":"agree","gap":0.8,"text":"The words had to agree in every pattern, so a word that slipped would show."},
 {"id":"worked","gap":0.8,"text":"It worked."},
 {"id":"later","gap":0.8,"text":"Three thousand years later, reciters still learn the hymns this way, and the words have come down almost unchanged."},
 {"id":"recording","gap":0.8,"text":"Scholars compare them to a recording."},
 {"id":"single","gap":0.8,"text":"No single memory was trusted."},
 {"id":"checked","gap":0.8,"text":"The work was checked."},
 {"id":"data","gap":0.8,"text":"It's the same with data."},
 {"id":"mind","gap":0.8,"text":"Every mind changes, a person's and an agent's."},
 {"id":"ways2","gap":0.8,"text":"Check each answer more than one way, and a change shows before anyone acts on it."}]},
"three":{"name":"Three answers","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university."},
 {"id":"paper","gap":0.8,"text":"Clara, in Planning, is writing the paper on where two new advisers for first-year students should go."},
 {"id":"needs","gap":0.8,"text":"She needs to know which faculty lost the most first-years in the first semester."},
 {"id":"monday","gap":0.8,"text":"On Monday, Jun asks the agent for her."},
 {"id":"science","gap":0.8,"text":"It answers: Engineering and IT, 131.","say":"It answers: Engineering and IT, a hundred and thirty-one."},
 {"id":"tuesday","gap":0.8,"text":"On Tuesday, Clara asks it herself, in a new chat."},
 {"id":"health","gap":0.8,"text":"It answers: Health, 126, as the university's 2025 retention review shows.","say":"It answers: Health, a hundred and twenty-six, as the university's twenty twenty-five retention review shows."},
 {"id":"fits","gap":0.8,"text":"That fits, Clara thinks."},
 {"id":"last","gap":0.8,"text":"Health lost the most last year too."},
 {"id":"but","gap":0.8,"text":"But Jun's answer said Engineering and IT."},
 {"id":"sure","gap":0.8,"text":"So she asks: are you sure?"},
 {"id":"third","gap":0.8,"text":"The agent apologises, and gives a third answer: Business, 140.","say":"The agent apologises, and gives a third answer: Business, a hundred and forty."},
 {"id":"each","gap":0.8,"text":"Three answers, each as sure as the last, and none says where it came from."},
 {"id":"review","gap":0.8,"text":"And there's no 2025 retention review.","say":"And there's no twenty twenty-five retention review."}]},
"ours":{"name":"Ours change too","lead":1.0,"tail":1.0,"vo":[
 {"id":"easy","gap":0.8,"text":"It's easy to say the agent makes things up."},
 {"id":"too","gap":0.8,"text":"Our memories do it too."},
 {"id":"own","gap":0.8,"text":"Clara's own paper from last year says Engineering and IT, not Health."},
 {"id":"before","gap":0.8,"text":"Health was the year before."},
 {"id":"joined","gap":0.8,"text":"Her memory had joined two years into one, and she was sure of it."},
 {"id":"century","gap":0.3,"text":"A century ago, in Cambridge, the psychologist Frederic Bartlett asked people to retell a folk tale"},
 {"id":"far","gap":0.8,"text":"from a culture far from their own, again and again, over years."},
 {"id":"shorter","gap":0.8,"text":"Each retelling grew shorter, and more like their own world: a canoe became a boat."},
 {"id":"added","gap":0.8,"text":"Six and a half years on, one man added a totem and a pilgrimage."},
 {"id":"surest","gap":0.8,"text":"Neither was in the story, and he was surest of exactly those."},
 {"id":"seattle","gap":0.8,"text":"In Seattle in 1974, Elizabeth Loftus and John Palmer showed students films of car crashes.","say":"In Seattle in nineteen seventy-four, Elizabeth Loftus and John Palmer showed students films of car crashes."},
 {"id":"hit","gap":0.8,"text":"Some were asked how fast the cars were going when they hit each other."},
 {"id":"smashed","gap":0.8,"text":"Others, when they smashed into each other."},
 {"id":"faster","gap":0.8,"text":"The second group guessed faster."},
 {"id":"glass","gap":0.8,"text":"A week later, a third of them remembered broken glass."},
 {"id":"none","gap":0.8,"text":"There was none."},
 {"id":"question","gap":0.8,"text":"The question had changed the memory."}]},
"rebuilt":{"name":"Rebuilt, not replayed","lead":1.0,"tail":1.0,"vo":[
 {"id":"recording","gap":0.8,"text":"Our memory doesn't play back a recording."},
 {"id":"details","gap":0.8,"text":"Each time, we rebuild it from a few details, and fill the rest with what seems likely."},
 {"id":"model","gap":0.8,"text":"A model doesn't play one back either."},
 {"id":"writes","gap":0.8,"text":"It writes likely words, one at a time, from what it learned and what it's given."},
 {"id":"again","gap":0.8,"text":"Ask again in a new chat, and it may take another route to another answer."},
 {"id":"gap","gap":0.8,"text":"Where neither knows, something likely fills the gap, and comes out as sure as a fact."},
 {"id":"bend","gap":0.8,"text":"Both bend to the question, too."},
 {"id":"study","gap":0.8,"text":"In a 2023 study, models asked \"are you sure?\" changed their answer almost half the time.","say":"In a twenty twenty-three study, models asked, are you sure, changed their answer almost half the time."},
 {"id":"lying","gap":0.8,"text":"None of this is lying."},
 {"id":"how","gap":0.8,"text":"It's how memory and models work."},
 {"id":"trouble","gap":0.8,"text":"The trouble isn't a mind that changes."},
 {"id":"reason","gap":0.8,"text":"It's a change we can't see the reason for."}]},
"check":{"name":"Check the work","lead":1.0,"tail":1.0,"vo":[
 {"id":"blamed","gap":0.8,"text":"So nobody is blamed."},
 {"id":"instead","gap":0.8,"text":"The team checks the work instead, the same way for people and agents."},
 {"id":"shows","gap":0.8,"text":"Every answer shows where it came from: the query and the rows behind it, or last year's paper."},
 {"id":"second","gap":0.8,"text":"Every number is reached a second way, like the reciters' patterns."},
 {"id":"counts","gap":0.8,"text":"The agent counts from the data platform's enrolments, and from the student system's own report."},
 {"id":"disagree","gap":0.8,"text":"They don't agree: 134 and 131.","say":"They don't agree: a hundred and thirty-four, and a hundred and thirty-one."},
 {"id":"twice","gap":0.8,"text":"Three students were counted twice."},
 {"id":"says","gap":0.8,"text":"The agent says so, rather than picking one."},
 {"id":"fixed","gap":0.8,"text":"Once it's fixed, both say 131, and the agent changes its answer, with the reason.","say":"Once it's fixed, both say a hundred and thirty-one, and the agent changes its answer, with the reason."},
 {"id":"job","gap":0.8,"text":"A mind that changes with the evidence is doing its job."},
 {"id":"monday","gap":0.8,"text":"Monday's answer was right after all, but without its evidence, nobody could tell."},
 {"id":"nightly","gap":0.8,"text":"A plain check now looks for anyone counted twice, every night."},
 {"id":"written","gap":0.8,"text":"What's been checked is written down for the whole team, outside any one chat or any one head, so the next chat starts from it."},
 {"id":"person","gap":0.8,"text":"And a person approves: Clara reads the evidence and signs."},
 {"id":"never","gap":0.8,"text":"The agent never approves."},
 {"id":"next","gap":0.8,"text":"Next semester, the two new advisers start in Engineering and IT, where the most first-years left."}]},
"every":{"name":"Every pattern, every time","lead":1.0,"tail":1.0,"vo":[
 {"id":"asked","gap":0.8,"text":"The reciters never asked whose memory was best."},
 {"id":"hymn","gap":0.8,"text":"Every hymn was checked, in every pattern, every time, and its words have lasted three thousand years."},
 {"id":"data","gap":0.8,"text":"It's the same with data."},
 {"id":"will","gap":0.8,"text":"A mind will change, a person's or an agent's."},
 {"id":"holds","gap":0.8,"text":"Checked against the evidence, more than one way, the work holds."},
 {"id":"trust","gap":0.8,"text":"Trust no mind blindly. Check the work."}]}
};

const VODUR={"kept/place": 2.687, "kept/families": 5.859, "kept/written": 1.305, "kept/lives": 3.209, "kept/changes": 1.283, "kept/rebuild": 3.884, "kept/taught": 2.529, "kept/lose": 5.321, "kept/exact": 1.696, "kept/patterns": 4.392, "kept/ways": 4.221, "kept/agree": 3.919, "kept/worked": 0.678, "kept/later": 6.505, "kept/recording": 1.873, "kept/single": 1.752, "kept/checked": 1.048, "kept/data": 1.274, "kept/mind": 2.931, "kept/ways2": 4.665, "three/today": 1.581, "three/paper": 5.757, "three/needs": 4.109, "three/monday": 2.344, "three/science": 3.59, "three/tuesday": 2.883, "three/health": 6.922, "three/fits": 1.389, "three/last": 1.785, "three/but": 2.535, "three/sure": 1.575, "three/third": 4.826, "three/each": 3.93, "three/review": 2.605, "ours/easy": 2.185, "ours/too": 1.307, "ours/own": 4.203, "ours/before": 1.412, "ours/joined": 3.335, "ours/century": 6.083, "ours/far": 3.635, "ours/shorter": 4.587, "ours/added": 3.871, "ours/surest": 3.49, "ours/seattle": 6.806, "ours/hit": 3.35, "ours/smashed": 1.968, "ours/faster": 1.529, "ours/glass": 2.996, "ours/none": 0.7, "ours/question": 1.876, "rebuilt/recording": 2.331, "rebuilt/details": 4.752, "rebuilt/model": 1.908, "rebuilt/writes": 4.189, "rebuilt/again": 4.103, "rebuilt/gap": 4.394, "rebuilt/bend": 1.661, "rebuilt/study": 5.934, "rebuilt/lying": 1.155, "rebuilt/how": 1.82, "rebuilt/trouble": 2.043, "rebuilt/reason": 2.284, "check/blamed": 1.251, "check/instead": 3.947, "check/shows": 5.559, "check/second": 3.553, "check/counts": 5.539, "check/disagree": 3.663, "check/twice": 1.738, "check/says": 2.404, "check/fixed": 5.746, "check/job": 3.195, "check/monday": 4.654, "check/nightly": 3.513, "check/written": 6.901, "check/person": 3.454, "check/never": 1.541, "check/next": 5.867, "every/asked": 2.8, "every/hymn": 5.949, "every/data": 1.274, "every/will": 2.718, "every/holds": 3.329, "every/trust": 2.382};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the patterns becoming the title card; and the end card. */
const BREATH={
"kept":{"hold":{"place":0.8,"families":0.6,"written":0.4,"lives":0.6,"changes":0.4,"rebuild":0.6,"taught":0.8,"lose":1.0,"exact":0.6,"patterns":0.0,"ways":1.2,"agree":1.2,"worked":0.2,"later":0.8,"recording":0.6,"single":0.2,"checked":0.6,"data":0.2,"mind":0.4,"ways2":0.6},"breathe":4.4},
"three":{"hold":{"today":0.4,"paper":0.6,"needs":0.6,"monday":0.2,"science":0.8,"tuesday":0.2,"health":1.0,"fits":0.2,"last":0.4,"but":0.4,"sure":0.6,"third":1.0,"each":0.6,"review":1.0}},
"ours":{"hold":{"easy":0.2,"too":0.4,"own":0.6,"before":0.2,"joined":1.0,"century":0.0,"far":0.6,"shorter":0.8,"added":0.8,"surest":1.2,"seattle":0.6,"hit":0.4,"smashed":0.6,"faster":0.8,"glass":0.6,"none":0.8,"question":1.2}},
"rebuilt":{"hold":{"recording":0.6,"details":1.0,"model":0.4,"writes":1.0,"again":1.0,"gap":1.0,"bend":0.4,"study":1.2,"lying":0.4,"how":0.6,"trouble":0.4,"reason":1.2}},
"check":{"hold":{"blamed":0.2,"instead":0.6,"shows":0.8,"second":0.6,"counts":0.8,"disagree":0.8,"twice":0.6,"says":0.4,"fixed":0.8,"job":0.8,"monday":0.6,"nightly":0.8,"written":0.8,"person":0.6,"never":0.4,"next":1.0}},
"every":{"hold":{"asked":0.6,"hymn":0.8,"data":0.2,"will":0.4,"holds":0.8,"trust":0.6},"breathe":4.6}
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

/* ===== Minds that change: the film's own places and pictures =====
   Drawn in the module's look (films/what-an-agent-is/shared/src: kit.js, room.js, people.js, agent.js, cards.js), with the film's own
   places and helpers here, each named with mc_ or MC_. Matte shapes lit from the right, soft shadows falling left, no outlines and no
   grain; words at least 28 px as seen, and none under the captions (below y 890).
     the riverbank      AG_PLACES.mcDawn, mcNoon, mcDusk: a broad shallow river in the plains, the far bank and its houses of wood and
                        thatch, the near bank's grass, and a large pipal tree (the Rigveda's asvattha) on the left, at three times of
                        day. mc_leaves() stirs the canopy's edge live, mc_smoke() lifts the hearth's smoke, mc_water() moves the river.
     the reciters       MC_TEACHER, MC_BOY1, MC_BOY2: unstitched white cotton, the hair knotted on the right (RV 7.33.1), bare feet;
                        mc_seated() draws one sitting cross-legged on the mat, the lap's cloth over the waist.
     a verse's words    mc_tile(): a pale oak tile with a letter, a b c d as scholars write a verse's words (Staal); a slip is an
                        amber x. mc_rows() lays out the four patterns; mc_threads() joins each word to itself in every row.
     Cambridge, 1920    AG_PLACES.mcCambridge: a college room, a tall window on the right, panelling, a desk.
     Seattle, 1974      AG_PLACES.mcSeattle: a lecture room, a screen at the front, rows of desks seen from behind, a projector.
     the room's things  answer cards, the evidence slot, bubbles, a memory card, papers, the corner tag, the route cards, bars.
   No writing in the reciters' world, which is the point; nothing on screen is in Sanskrit, and nothing is borrowed from Indian art. */

/* ---------------------------------------------------------------- the riverbank, at three times of day */
const MC_SKY={
  dawn:{top:[150,168,194],mid:[210,206,206],low:[246,216,184],sun:[1580,498],sunC:[255,238,206],glow:[255,214,168],water:[[238,216,194],[176,186,194],[150,162,172]],
    grass:[[170,166,118],[124,126,90]],far:[152,158,160],leaf:[[66,96,70],[92,124,82],[160,176,108]],bark:[[150,134,116],[196,184,166]],light:1,warm:0.22},
  noon:{top:[136,174,212],mid:[200,218,230],low:[232,236,232],sun:[1100,-120],sunC:[255,252,240],glow:[255,250,236],water:[[214,226,232],[176,198,212],[156,178,194]],
    grass:[[176,176,116],[128,136,90]],far:[150,166,164],leaf:[[64,100,66],[96,136,80],[170,190,110]],bark:[[150,138,122],[206,196,180]],light:1.08,warm:0.06},
  dusk:{top:[96,98,134],mid:[176,150,160],low:[236,170,128],sun:[300,500],sunC:[255,214,170],glow:[246,170,122],water:[[226,170,138],[150,138,152],[112,112,132]],
    grass:[[140,128,96],[96,94,74]],far:[118,112,124],leaf:[[50,70,58],[72,90,66],[150,128,90]],bark:[[118,104,96],[170,150,130]],light:0.86,warm:0.3}
};
const MC_BANK={far:494,near:772,mat:[470,846,1300,966]};   // the far bank's top, the near bank's edge; the mat's corners (x0, y0, x1, y1)
const MC_TREE={x:300,y:884};                                 // the pipal: its trunk's foot
const mc_treeK=tod=>tod==="dawn"?1:tod==="noon"?1.07:1.12;  // the tree grows broader as the centuries pass
// the crown: great masses of leaves in two tiers, from a seed, so the place and the live leaves at its edge agree. k: the tree's size
function mc_crown(k){const R=ag_rnd(808),x0=MC_TREE.x,y0=MC_TREE.y,ms=[];
  // [x, y, rx, ry] relative to the trunk's foot, back tier first, then the front
  const M=[[-230,-660,250,130,0],[170,-740,290,140,0],[520,-620,230,120,0],[-30,-800,220,100,0],
           [-380,-500,210,120,1],[-90,-560,260,130,1],[290,-560,270,130,1],[640,-500,190,100,1]];
  for(const m of M){const ph=[R()*TAU,R()*TAU,R()*TAU];ms.push({x:x0+m[0]*k,y:y0+m[1]*k,rx:m[2]*k,ry:m[3]*k,ph,l:R(),front:m[4]});}
  const edge=[];for(const m of ms)for(let i=0;i<8;i++){const a=R()<0.7?-Math.PI*0.95+R()*Math.PI*0.9:Math.PI*0.15+R()*Math.PI*0.7,q=mc_blobR(m,a);
    edge.push({x:m.x+Math.cos(a)*m.rx*q*1.02,y:m.y+Math.sin(a)*m.ry*q*1.02,a:Math.PI/2+(R()-0.5)*1.2,s:(0.85+R()*0.4)*k,ph:R()*TAU});}
  return{ms,edge};}
// a mass's edge, wandering a little: its radius at angle a, as a share of rx and ry
function mc_blobR(m,a){return 1+0.07*Math.sin(3*a+m.ph[0])+0.05*Math.sin(5*a+m.ph[1])+0.03*Math.sin(9*a+m.ph[2]);}
function mc_blobPath(c,m,g){g=g||1;for(let i=0;i<=48;i++){const a=i/48*TAU,q=mc_blobR(m,a)*g,x=m.x+Math.cos(a)*m.rx*q,y=m.y+Math.sin(a)*m.ry*q;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();}
// a pipal leaf: a heart shape with a long tip, hanging from its stalk at (x, y), length L, turned by a (0: pointing right)
function mc_leafPath(c,x,y,L,a){const ca=Math.cos(a),sa=Math.sin(a),P=(u,v)=>[x+(u*ca-v*sa)*L,y+(u*sa+v*ca)*L];let p=P(0,0);c.moveTo(p[0],p[1]);
  const q=[[[0.05,-0.32],[0.42,-0.42],[0.62,-0.18]],[[0.72,-0.06],[0.82,-0.02],[1.0,0]],[[0.82,0.02],[0.72,0.06],[0.62,0.18]],[[0.42,0.42],[0.05,0.32],[0,0]]];
  for(const b of q){const p1=P(...b[0]),p2=P(...b[1]),p3=P(...b[2]);c.bezierCurveTo(p1[0],p1[1],p2[0],p2[1],p3[0],p3[1]);}c.closePath();}
// the tree: a broad pale-grey trunk, fluted, with roots spreading at its foot and limbs into a wide crown; painted at half size
// where it's soft anyway (the masses and the leaves inside them), at full size where it isn't (the trunk's edge, the crown's outline)
function mc_paintTree(c,S,k){const L=S.leaf,B=S.bark,x0=MC_TREE.x,y0=MC_TREE.y,G=mc_crown(k),sunR=S===MC_SKY.dusk?-1:1,R2=ag_rnd(57);
  // the crown's masses, at half size: each dark beneath and lit where the light falls, then its leaves; the back tier darker
  const tier=f=>{const [cv,x]=ag_buf("mc-crown",Math.ceil(W/2),Math.ceil(H/2));x.scale(0.5,0.5);
    for(const m of G.ms){if(m.front!==f)continue;const lit=(sunR>0?clamp((m.x-x0)/(600*k)+0.55,0.15,1):0.35)*(f?1:0.7),base=ag_dk(mix(L[0],L[1],0.3+0.4*m.l),f?0:0.12);
      x.fillStyle=rgba(base,1);x.beginPath();mc_blobPath(x,m);x.fill();
      x.save();x.beginPath();mc_blobPath(x,m);x.clip();
      let g=x.createRadialGradient(m.x+m.rx*0.45*sunR,m.y-m.ry*0.6,0,m.x+m.rx*0.45*sunR,m.y-m.ry*0.6,m.rx*1.3);g.addColorStop(0,rgba(L[2],0.55*lit));g.addColorStop(1,rgba(L[2],0));x.fillStyle=g;x.fillRect(m.x-m.rx*1.2,m.y-m.ry*1.2,m.rx*2.4,m.ry*2.4);
      g=x.createLinearGradient(0,m.y-m.ry*0.2,0,m.y+m.ry);g.addColorStop(0,"rgba(14,24,16,0)");g.addColorStop(1,"rgba(14,24,16,0.55)");x.fillStyle=g;x.fillRect(m.x-m.rx*1.2,m.y-m.ry*0.2,m.rx*2.4,m.ry*1.4);
      for(let i=0;i<170;i++){const a=R2()*TAU,d=Math.sqrt(R2()),lx=m.x+Math.cos(a)*d*m.rx,ly=m.y+Math.sin(a)*d*m.ry,up=clamp(0.5-(ly-m.y)/m.ry*0.7+(lx-m.x)/m.rx*0.3*sunR,0,1);
        x.beginPath();mc_leafPath(x,lx,ly,(24+R2()*12)*k,Math.PI/2+(R2()-0.5)*1.4);x.fillStyle=rgba(ag_dk(mix(mix(L[0],L[1],0.3+0.6*R2()),L[2],up*lit*0.8*R2()),f?0:0.1),0.85);x.fill();}
      x.restore();}
    c.drawImage(cv,0,0,W,H);
    for(const m of G.ms){if(m.front!==f)continue;for(let i=0;i<56;i++){const a=R2()*TAU,q=mc_blobR(m,a)*(0.95+R2()*0.07),lx=m.x+Math.cos(a)*m.rx*q,ly=m.y+Math.sin(a)*m.ry*q,
        lit=(sunR>0?clamp((lx-x0)/(600*k)+0.4,0,1):0.3)*clamp(0.6-(ly-m.y)/m.ry,0.2,1);
      c.beginPath();mc_leafPath(c,lx,ly,(24+R2()*13)*k,Math.PI/2+(R2()-0.5)*1.5);c.fillStyle=rgba(ag_dk(mix(mix(L[0],L[1],0.5+0.4*R2()),L[2],lit*0.6*R2()),f?0:0.12),0.95);c.fill();}}};
  tier(0);
  // the trunk: broad and pale grey, fluted, with roots spreading at its foot and limbs reaching up into the crown
  const trunk=cc=>{cc.moveTo(x0-150*k,y0+10);cc.bezierCurveTo(x0-90*k,y0-6,x0-70*k,y0-40*k,x0-64*k,y0-120*k);cc.bezierCurveTo(x0-58*k,y0-260*k,x0-110*k,y0-400*k,x0-250*k,y0-520*k);
    cc.lineTo(x0-226*k,y0-546*k);cc.bezierCurveTo(x0-110*k,y0-470*k,x0-46*k,y0-460*k,x0-14*k,y0-540*k);cc.bezierCurveTo(x0+4*k,y0-600*k,x0-30*k,y0-660*k,x0-60*k,y0-700*k);
    cc.lineTo(x0-36*k,y0-712*k);cc.bezierCurveTo(x0+20*k,y0-660*k,x0+50*k,y0-600*k,x0+100*k,y0-540*k);cc.bezierCurveTo(x0+190*k,y0-470*k,x0+340*k,y0-470*k,x0+480*k,y0-540*k);
    cc.lineTo(x0+494*k,y0-516*k);cc.bezierCurveTo(x0+340*k,y0-430*k,x0+160*k,y0-420*k,x0+84*k,y0-330*k);cc.bezierCurveTo(x0+56*k,y0-230*k,x0+62*k,y0-100*k,x0+100*k,y0-36*k);
    cc.bezierCurveTo(x0+130*k,y0-6,x0+170*k,y0+4,x0+200*k,y0+12);cc.closePath();};
  c.save();c.translate(AG.sdx*4,0);ag_floorShadow(c,x0+40,y0+14,300*k,32,0.32);c.restore();
  ag_soft(c,trunk,B[0],B[1],x0+90*k*sunR,y0-380*k,320*k,null);
  c.save();ag_shape(c,trunk);c.clip();
  let g=c.createLinearGradient(x0-80*k,0,x0+90*k,0);g.addColorStop(0,"rgba(30,26,22,"+(sunR>0?0.34:0.08)+")");g.addColorStop(0.6,"rgba(30,26,22,0.04)");g.addColorStop(1,"rgba(255,250,240,"+(sunR>0?0.12:0)+")");c.fillStyle=g;c.fillRect(x0-400*k,y0-800*k,1000*k,820*k);
  g=c.createLinearGradient(0,y0-800*k,0,y0-300*k);g.addColorStop(0,"rgba(20,24,18,0.45)");g.addColorStop(1,"rgba(20,24,18,0)");c.fillStyle=g;c.fillRect(x0-400*k,y0-800*k,1000*k,500*k);
  // the trunk's flutes: long soft folds, as a pipal's trunk is made of stems grown together, fading as they rise
  c.lineCap="round";const R=ag_rnd(31);
  for(let i=0;i<8;i++){const u=-46+i*13+R()*8,top=380+R()*120,fl=(x,y)=>[x0+(u*(1.5-0.7*y/top)+(y>200?-(y-200)*0.12:0))*k,y0-y*k];
    const g2=c.createLinearGradient(0,y0,0,y0-top*k);g2.addColorStop(0,rgba(ag_dk(B[0],0.35),0.3));g2.addColorStop(1,rgba(ag_dk(B[0],0.35),0));c.strokeStyle=g2;c.lineWidth=5;
    c.beginPath();for(let y=0;y<=top;y+=20){const p=fl(y,0);y?c.lineTo(...fl(y)):c.moveTo(...fl(y));}c.stroke();
    const g3=c.createLinearGradient(0,y0,0,y0-top*k);g3.addColorStop(0,rgba(ag_lt(B[1],0.2),0.26));g3.addColorStop(1,rgba(ag_lt(B[1],0.2),0));c.strokeStyle=g3;c.lineWidth=2;
    c.beginPath();for(let y=0;y<=top;y+=20){const p=fl(y);y?c.lineTo(p[0]+6,p[1]):c.moveTo(p[0]+6,p[1]);}c.stroke();}
  c.restore();
  tier(1);
  return G;}
function mc_paintRiver(c,tod){const S=MC_SKY[tod],fb=MC_BANK.far,nb=MC_BANK.near;
  // the sky, warm where the sun is, a few long soft clouds (painted small and scaled up, so they're soft)
  let g=c.createLinearGradient(0,0,0,fb+10);g.addColorStop(0,rgba(S.top,1));g.addColorStop(0.62,rgba(S.mid,1));g.addColorStop(1,rgba(S.low,1));c.fillStyle=g;c.fillRect(0,0,W,fb+12);
  const [sx,sy]=S.sun;g=c.createRadialGradient(sx,sy,10,sx,sy,900);g.addColorStop(0,rgba(S.glow,0.75));g.addColorStop(0.35,rgba(S.glow,0.22));g.addColorStop(1,rgba(S.glow,0));
  c.fillStyle=g;c.fillRect(0,0,W,fb+12);
  const R=ag_rnd(tod.length*97);let [sc,sx2]=ag_buf("mc-soft",240,135);
  for(let i=0;i<10;i++){const y=(50+R()*300)/8,x=R()*240,w=(220+R()*480)/8;sx2.fillStyle=rgba(mix(S.mid,S.glow,0.4+0.5*R()),0.3+0.25*R());sx2.beginPath();sx2.ellipse(x,y,w,1.4+R()*1.6,0,0,TAU);sx2.fill();}
  c.drawImage(sc,0,0,W,H);
  if(sy>0){c.save();c.shadowColor=rgba(S.sunC,0.9);c.shadowBlur=60;c.fillStyle=rgba(S.sunC,0.95);c.beginPath();c.arc(sx,sy,30,0,TAU);c.fill();c.restore();}
  // the far bank: low land, a line of trees in the haze, and a few houses of wood and thatch
  const farY=x=>fb+5*Math.sin(x/170)+3*Math.sin(x/53+1);
  [sc,sx2]=ag_buf("mc-soft",480,270);const R3=ag_rnd(5);sx2.fillStyle=rgba(mix(S.far,S.leaf[0],0.18),1);sx2.beginPath();sx2.moveTo(0,(fb+20)/4);
  for(let x=0;x<=480;x+=2){const X=x*4,tree=Math.abs(X-1300)<140?0:Math.max(0,Math.sin(X/37)+Math.sin(X/91+2)*0.8+Math.sin(X/13)*0.3)*7+(Math.sin(X/230)>0.3?6:0);sx2.lineTo(x,(farY(X)-tree*1.6)/4);}
  sx2.lineTo(480,(fb+20)/4);sx2.closePath();sx2.fill();c.drawImage(sc,0,0,W,H);
  c.fillStyle=rgba(S.far,1);c.beginPath();c.moveTo(0,fb+30);for(let x=0;x<=W;x+=20)c.lineTo(x,farY(x)+4);c.lineTo(W,fb+30);c.closePath();c.fill();
  for(const [hx,hw] of [[1230,38],[1292,48],[1360,34]]){const hy=farY(hx)+5,wall=mix(S.bark[0],[118,96,74],0.6),th=mix(mix([176,156,112],S.far,0.3),S.glow,0.2);
    c.fillStyle=rgba(ag_dk(wall,0.08),1);c.fillRect(hx-hw/2,hy-16,hw,17);c.fillStyle=rgba(ag_dk(wall,0.38),1);c.fillRect(hx-4,hy-11,8,12);
    ag_soft(c,cc=>{cc.moveTo(hx-hw/2-7,hy-14);cc.quadraticCurveTo(hx-hw*0.2,hy-33,hx,hy-38);cc.quadraticCurveTo(hx+hw*0.2,hy-33,hx+hw/2+7,hy-14);cc.closePath();},th,ag_lt(th,0.25),hx+hw*0.3,hy-34,34,null);}
  // the river: the sky in it, the far bank's reflection, long soft ripples, and the sun's path
  g=c.createLinearGradient(0,fb+20,0,nb);g.addColorStop(0,rgba(S.water[0],1));g.addColorStop(0.45,rgba(S.water[1],1));g.addColorStop(1,rgba(S.water[2],1));c.fillStyle=g;c.fillRect(0,fb+20,W,nb-fb);
  g=c.createLinearGradient(0,fb+18,0,fb+64);g.addColorStop(0,rgba(ag_dk(S.far,0.1),0.6));g.addColorStop(1,rgba(S.far,0));c.fillStyle=g;c.fillRect(0,fb+18,W,46);
  const R4=ag_rnd(9);c.lineCap="round";
  for(let i=0;i<150;i++){const u=R4(),y=fb+30+u*u*(nb-fb-40),x=R4()*W,w=(30+R4()*140)*(0.4+u);c.strokeStyle=rgba(i%3?[255,255,255]:ag_dk(S.water[2],0.2),0.07+0.08*R4());
    c.lineWidth=1+u*2.5;c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.stroke();}
  if(sy>0&&sy<fb+40){for(let i=0;i<40;i++){const u=i/40,y=fb+24+u*u*(nb-fb-30),w=(14+70*u)*(0.6+R4()*0.8);c.strokeStyle=rgba(S.sunC,0.5*(1-u)+0.08);c.lineWidth=1.5+u*3;
    c.beginPath();c.moveTo(sx-w/2+(R4()-0.5)*20*u,y);c.lineTo(sx+w/2+(R4()-0.5)*20*u,y);c.stroke();}}
  // the near bank: a soft edge of earth, then grass, lit from the sun's side
  const nearY=x=>nb-8+7*Math.sin(x/140+2)+5*Math.sin(x/47);
  g=c.createLinearGradient(0,nb-20,0,nb+20);g.addColorStop(0,rgba(mix(S.grass[1],[150,128,100],0.5),1));g.addColorStop(1,rgba(mix(S.grass[1],[120,100,80],0.4),1));c.fillStyle=g;
  c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=16)c.lineTo(x,nearY(x));c.lineTo(W,H);c.closePath();c.fill();
  g=c.createLinearGradient(0,nb,0,H);g.addColorStop(0,rgba(S.grass[0],1));g.addColorStop(1,rgba(S.grass[1],1));c.fillStyle=g;
  c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=16)c.lineTo(x,nearY(x)+10+3*Math.sin(x/23));c.lineTo(W,H);c.closePath();c.fill();
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,30,20,"+(0.2-S.warm*0.2)+")");g.addColorStop(0.6,"rgba(30,30,20,0)");g.addColorStop(1,rgba(S.glow,S.warm*0.5));c.fillStyle=g;c.fillRect(0,nb,W,H-nb);
  const R5=ag_rnd(21);
  for(let i=0;i<2600;i++){const x=R5()*W,u=R5(),y=nb+12+u*(H-nb),h=(5+12*u)*(0.6+R5()*0.8),lean=(R5()-0.5)*0.6;
    c.strokeStyle=rgba(i%4?ag_dk(S.grass[1],0.16):ag_lt(S.grass[0],0.3),0.25+0.3*R5());c.lineWidth=1+u*1.4;c.beginPath();c.moveTo(x,y);c.lineTo(x+lean*h,y-h);c.stroke();}
  // the tree's shade on the grass, the tree, then the mat: woven grass, in perspective
  ag_floorShadow(c,520,906,560,64,0.18);
  mc_paintTree(c,S,mc_treeK(tod));
  const [m0,my0,m1,my1]=MC_BANK.mat,mat=cc=>{cc.moveTo(m0+60,my0);cc.lineTo(m1-40,my0);cc.lineTo(m1+30,my1);cc.lineTo(m0-30,my1);cc.closePath();};
  ag_floorShadow(c,(m0+m1)/2-10,my1+6,(m1-m0)*0.56,20,0.22);
  ag_soft(c,mat,mix([204,184,136],S.glow,0.12),[236,222,180],m1-120,my0+20,500,null);
  c.save();ag_shape(c,mat);c.clip();c.strokeStyle="rgba(120,96,60,0.2)";c.lineWidth=2;
  for(let y=my0+8;y<my1;y+=9){c.beginPath();c.moveTo(m0-40,y);c.lineTo(m1+40,y);c.stroke();}
  c.strokeStyle="rgba(255,250,236,0.2)";for(let y=my0+12;y<my1;y+=9){c.beginPath();c.moveTo(m0-40,y);c.lineTo(m1+40,y);c.stroke();}
  g=c.createLinearGradient(m0,0,m1,0);g.addColorStop(0,"rgba(40,30,20,0.16)");g.addColorStop(1,"rgba(40,30,20,0)");c.fillStyle=g;c.fillRect(m0-40,my0,m1-m0+80,my1-my0);c.restore();
  c.strokeStyle="rgba(120,96,60,0.45)";c.lineWidth=3;c.beginPath();mat(c);c.stroke();}
AG_PLACES.mcDawn=c=>mc_paintRiver(c,"dawn");
AG_PLACES.mcNoon=c=>mc_paintRiver(c,"noon");
AG_PLACES.mcDusk=c=>mc_paintRiver(c,"dusk");
// live: leaves at the crown's edge stirring in the breeze; the river's ripples drifting; the hearth's smoke rising
function mc_leaves(ctx,t,tod,a){const S=MC_SKY[tod],k=mc_treeK(tod),G=mc_crown(k),L=S.leaf,sunR=tod==="dusk"?-1:1;if(a!=null&&a<=0)return;ctx.save();if(a!=null)ctx.globalAlpha*=a;
  for(const e of G.edge){const sw=Math.sin(t*1.5+e.ph)*0.28+Math.sin(t*0.6+e.ph*2)*0.14,lt=sunR>0?clamp((e.x-MC_TREE.x)/(600*k)+0.45,0,1):0.25;
    ctx.beginPath();mc_leafPath(ctx,e.x,e.y,27*e.s,e.a+sw);ctx.fillStyle=rgba(mix(L[1],L[2],0.2+0.6*lt),1);ctx.fill();}
  ctx.restore();}
function mc_water(ctx,t,tod,a){const fb=MC_BANK.far,nb=MC_BANK.near,R=ag_rnd(77);if(a!=null&&a<=0)return;ctx.save();if(a!=null)ctx.globalAlpha*=a;ctx.lineCap="round";
  for(let i=0;i<46;i++){const u=R(),y=fb+34+u*u*(nb-fb-60),sp=6+18*u,x=((R()*W+t*sp)%(W+300))-150,w=(40+R()*120)*(0.4+u),f=0.5+0.5*Math.sin(t*0.8+i);
    ctx.strokeStyle=rgba([255,255,255],(0.05+0.09*f)*(0.5+u));ctx.lineWidth=1+u*2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();}
  ctx.restore();}
function mc_smoke(ctx,t,tod,a){const x0=1296,y0=MC_BANK.far-30;if(a!=null&&a<=0)return;ctx.save();if(a!=null)ctx.globalAlpha*=a;
  for(let i=0;i<12;i++){const u=((t*0.05+i/12)%1),y=y0-u*200,x=x0+Math.sin(u*4+t*0.25)*10+u*u*90,r=5+u*28,g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,"rgba(238,234,228,"+(0.32*(1-u)*Math.min(1,u*8))+")");g.addColorStop(1,"rgba(238,234,228,0)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}
  ctx.restore();}

/* ---------------------------------------------------------------- the reciters
   Unstitched white cotton: a cloth round the waist (under the lap here) and an upper cloth over the far shoulder, across the chest
   and under the near arm, the near shoulder and both arms bare; the hair long and knotted on the right side of the head, close to the
   skull, as the Rigveda says of the family of poets who made its seventh book (7.33.1: "white-robed", "with hair tied on the right");
   bare feet; no sacred thread, mark or symbol. The teacher is older, with a short grey beard; his two students are younger. They face
   right (east, where the sun rises) unless flipped. Their skin is the colour of their clothes in people.js, so the arms are bare. */
const MC_CLOTH=[240,236,224];
// the upper cloth, painted over the bare torso (top.paint): from the far shoulder across the chest and under the near arm
function mc_drape(c,P){const cl=MC_CLOTH,sk=P.skin;
  c.save();ag_shape(c,AG_F.torso);c.clip();
  // a little modelling on the bare chest: the collarbone's soft shadow, the near side in shade
  c.strokeStyle=rgba(mix(sk,[60,24,14],0.5),0.22);c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(250,622);c.quadraticCurveTo(220,630,176,640);c.stroke();
  const drape=cc=>{cc.moveTo(352,598);cc.bezierCurveTo(372,606,396,614,410,628);cc.bezierCurveTo(430,660,440,700,436,760);cc.lineTo(420,1110);cc.lineTo(100,1110);cc.lineTo(96,900);
    cc.bezierCurveTo(150,872,200,836,246,786);cc.bezierCurveTo(290,738,326,676,352,598);cc.closePath();};
  ag_soft(c,drape,ag_dk(cl,0.03),[255,255,255],400,660,260,rgba(ag_dk(cl,0.62),0.34),26);
  // the cloth's rolled edge across the chest, and its folds, falling from the far shoulder
  c.save();ag_shape(c,drape);c.clip();c.lineCap="round";
  for(const f of [[[344,640],[300,760],[180,880]],[[392,660],[360,800],[300,960]],[[420,760],[400,880],[380,1040]],[[250,880],[300,920],[330,1000]]]){
    c.strokeStyle=rgba(ag_dk(cl,0.5),0.2);c.lineWidth=4;c.beginPath();c.moveTo(f[0][0],f[0][1]);c.quadraticCurveTo(f[1][0],f[1][1],f[2][0],f[2][1]);c.stroke();
    c.strokeStyle="rgba(255,255,255,0.55)";c.lineWidth=2;c.beginPath();c.moveTo(f[0][0]+3,f[0][1]-3);c.quadraticCurveTo(f[1][0]+3,f[1][1]-3,f[2][0]+3,f[2][1]-3);c.stroke();}
  c.restore();
  c.strokeStyle=rgba(ag_dk(cl,0.35),0.5);c.lineWidth=7;c.beginPath();c.moveTo(352,600);c.bezierCurveTo(326,678,290,740,246,788);c.bezierCurveTo(200,838,150,874,96,902);c.stroke();
  c.strokeStyle="rgba(255,255,255,0.8)";c.lineWidth=3;c.beginPath();c.moveTo(356,604);c.bezierCurveTo(330,682,294,744,250,792);c.bezierCurveTo(204,842,154,878,100,906);c.stroke();
  c.restore();}
// the hair, combed back close to the skull and knotted on the right side of the head (the side we see), with the ear over it
function mc_tied(c,P){const C=ag_colours(P),h=P.hair.c;
  ag_soft(c,AG_HAIR.cropped,h,C.hairHi,336,300,110,"rgba(0,0,0,0.5)",18);
  c.save();ag_shape(c,AG_HAIR.cropped);c.clip();c.strokeStyle=rgba(ag_lt(h,0.55),0.2);c.lineWidth=1.8;c.lineCap="round";
  for(const s of [[[384,348],[334,326],[292,334]],[[376,318],[330,300],[290,320]],[[330,296],[300,298],[288,318]],[[226,440],[226,392],[248,352]],[[300,370],[290,356],[280,350]]]){
    c.beginPath();c.moveTo(s[0][0],s[0][1]);c.quadraticCurveTo(s[1][0],s[1][1],s[2][0],s[2][1]);c.stroke();}
  c.restore();
  ag_ear(c,P,C);
  // the knot: a coil sitting on the side of the head above the ear, a soft shadow under it
  c.save();c.shadowColor="rgba(0,0,0,0.35)";c.shadowBlur=8;c.shadowOffsetX=-3;c.shadowOffsetY=5;c.fillStyle=rgba(h,1);c.beginPath();c.ellipse(262,330,33,29,-0.3,0,TAU);c.fill();c.restore();
  ag_soft(c,cc=>cc.ellipse(262,330,33,29,-0.3,0,TAU),h,C.hairHi,276,316,34,"rgba(0,0,0,0.5)",8);
  c.strokeStyle=rgba(ag_lt(h,0.5),0.32);c.lineWidth=2.2;c.lineCap="round";
  c.beginPath();c.ellipse(264,329,21,17,-0.3,-2.6,1.4);c.stroke();c.beginPath();c.ellipse(265,329,10,8,-0.3,-2.2,2.4);c.stroke();}
const mc_reciter=(name,key,skin,hair,beard,breath)=>({name,key,skin,hair:{style:"shaved",c:hair},beard,top:{kind:"bare",c:skin,paint:mc_drape},hat:{paint:mc_tied},breath});
const MC_TEACHER=mc_reciter("the teacher","mc-teacher",[164,114,84],[140,136,132],[156,152,148],0.2);
const MC_BOY1=mc_reciter("the elder student","mc-boy1",[176,124,92],[30,24,24],null,0.3);
const MC_BOY2=mc_reciter("the younger student","mc-boy2",[158,108,80],[26,22,22],null,0.34);
// the lap: legs crossed under the waist cloth, in figure space, over the flat end of the half-figure: low and wide, the knees out
function mc_lapPath(c){c.moveTo(40,1010);c.bezierCurveTo(90,962,200,948,300,950);c.bezierCurveTo(430,950,560,968,628,1004);c.bezierCurveTo(666,1026,664,1074,626,1096);
  c.bezierCurveTo(540,1140,400,1150,290,1146);c.bezierCurveTo(160,1142,50,1124,22,1080);c.bezierCurveTo(10,1056,18,1028,40,1010);c.closePath();}
function mc_lap(ctx,P){const cl=MC_CLOTH;ag_soft(ctx,mc_lapPath,ag_dk(cl,0.05),[255,255,255],500,980,340,rgba(ag_dk(cl,0.62),0.36),24);
  ctx.save();ag_shape(ctx,mc_lapPath);ctx.clip();ctx.lineCap="round";
  for(const f of [[[120,1000],[230,1050],[300,1140]],[[330,966],[440,996],[560,1030]],[[600,1012],[560,1060],[470,1100]],[[60,1050],[140,1086],[200,1140]]]){
    ctx.strokeStyle=rgba(ag_dk(cl,0.55),0.2);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(f[0][0],f[0][1]);ctx.quadraticCurveTo(f[1][0],f[1][1],f[2][0],f[2][1]);ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f[0][0]+3,f[0][1]-4);ctx.quadraticCurveTo(f[1][0]+3,f[1][1]-4,f[2][0]+3,f[2][1]-4);ctx.stroke();}
  ctx.restore();}
// a bare arm: people.js's arm (ag_arm) ends in a sleeve's cuff at the wrist; the reciters' arms are bare, so the near arm is drawn
// again over it, the same shape a little fuller at the wrist (to cover the cuff), and the hand over that
function mc_bareArm(c,P,spec){const C=ag_colours(P),J=AG_FIG.shoulder.near,j=ag_joints(J,spec),col=P.skin,w=[AG_FIG.w[0],AG_FIG.w[1],AG_FIG.w[2]+10],
    hx=lerp(j.J[0],j.E[0],0.3)+30,hy=lerp(j.J[1],j.E[1],0.3)-20,ah=Math.atan2(j.Wr[1]-j.E[1],j.Wr[0]-j.E[0]),u=[Math.cos(ah),Math.sin(ah)],
    a1=Math.atan2(j.E[1]-j.J[1],j.E[0]-j.J[0]),turn=Math.abs(Math.atan2(Math.sin(ah-a1),Math.cos(ah-a1)));
  if(turn<1.25)ag_soft(c,ag_armPath(j.J,j.E,j.Wr,w),ag_dk(col,0.16),ag_lt(col,0.28),hx,hy,240,rgba(ag_dk(col,0.8),0.42),20);
  else{ag_soft(c,cc=>ag_capsule(cc,j.J,j.E,w[0],w[1]),ag_dk(col,0.16),ag_lt(col,0.28),hx,hy,240,rgba(ag_dk(col,0.8),0.42),20);
    ag_soft(c,cc=>ag_capsule(cc,j.E,j.Wr,w[1]*0.96,w[2]),ag_dk(col,0.1),ag_lt(col,0.3),j.E[0]+u[0]*80+20,j.E[1]+u[1]*80-20,200,rgba(ag_dk(col,0.8),0.42),18);}
  ag_hand(c,[j.Wr[0]+u[0]*6,j.Wr[1]+u[1]*6],ah+(spec[2]==="open"?-0.3:0),spec[2]||"rest",P,C,u[0]>=0?1:-1);}
// how a reciter sits: the near hand resting on the near knee, the far one on the far knee. No gestures: hands raised in the air read
// wrong, so the hands stay there
const MC_POSE={sit:{near:[2,72,"rest"],far:[-6,66,"rest"]}};
// one reciter seated cross-legged: the person (o as ag_person's, o.pose one of MC_POSE or angles), the lap drawn over the waist and
// under the near arm. o.k: a slimmer build (1 for an adult)
function mc_seated(ctx,who,x,y,s,o){o=Object.assign({pose:MC_POSE.sit},o||{});const P=ag_spec(who),k=o.k||1,inLap=o.inLap;
  ctx.save();ctx.translate(x,y);ctx.scale(k,1);ctx.translate(-x,-y);
  ag_floorShadow(ctx,x+(o.flip?-1:1)*70*s,y+540*s,320*s,34*s,0.24);
  const near=(typeof o.pose==="string"?MC_POSE[o.pose]:ag_poseOf(o)).near,hold=o.hold;
  const q=Object.assign({},o,{covered:true,holdBack:(c,h)=>{mc_lap(c,P);if(inLap)inLap(c,h);},hold:(c,h)=>{mc_bareArm(c,P,near);if(hold)hold(c,h);}});
  const hands=ag_person(ctx,who,x,y,s,q);ctx.restore();return hands;}
// where a seated reciter's mouth is, in the frame (for a line of light leaving it)
function mc_mouth(x,y,s,flip){return[x+(flip?-1:1)*(AG_FACE.mid[0]-AG_FIG.anchor[0])*s,y+(AG_FACE.mid[1]-AG_FIG.anchor[1])*s];}

/* ---------------------------------------------------------------- a verse's words, and the patterns
   Four words of a verse, written a, b, c and d as scholars write them (Staal): pale oak tiles with a dark letter. A slip is an amber x.
   The four patterns, each with its label at its left: as it's recited (abcd, joined), word by word (a / b / c / d), in pairs
   (ab bc cd) and braided, back and forth (ab ba ab bc cb bc). A thin green thread joins each word to itself in every row. */
const MC_TILE=56;
// a tile centred on (x, y): o.s its size, o.slip 0 to 1 (an amber x), o.grey 0 to 1 (fading from memory), o.lift (px up), o.a, o.k (spring)
function mc_tile(ctx,x,y,ch,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const s=(o.s||1)*(o.k==null?1:lerp(0.4,1,o.k)),h=MC_TILE*s,r=10*s,sl=clamp(o.slip||0,0,1),gr=clamp(o.grey||0,0,1);
  y-=o.lift||0;ctx.save();ctx.globalAlpha*=a;if(o.rot)ag_about(ctx,x,y,1),ctx.translate(x,y),ctx.rotate(o.rot),ctx.translate(-x,-y);
  const base=mix(mix(AG_OAK.base,[236,226,206],0.35),AG.amber,sl*0.85),top=mix(mix(AG_OAK.hi,[250,244,232],0.4),ag_lt(AG.amber,0.35),sl*0.85),gb=mix(base,[206,204,200],gr),gt=mix(top,[226,224,222],gr);
  ctx.save();ctx.shadowColor="rgba(46,38,28,"+(0.26*(1-gr*0.6))+")";ctx.shadowBlur=14*s;ctx.shadowOffsetX=AG.sdx*0.6*s;ctx.shadowOffsetY=7*s;ctx.fillStyle=rgba(gb,1);rr(ctx,x-h/2,y-h/2,h,h,r);ctx.fill();ctx.restore();
  const g=ctx.createLinearGradient(0,y-h/2,0,y+h/2);g.addColorStop(0,rgba(gt,1));g.addColorStop(1,rgba(gb,1));ctx.fillStyle=g;rr(ctx,x-h/2,y-h/2,h,h,r);ctx.fill();
  ctx.strokeStyle=rgba(ag_dk(gb,0.25),0.5);ctx.lineWidth=1.4;ctx.stroke();
  if(o.glow>0){ctx.save();ctx.shadowColor=rgba(AG.green,0.7*o.glow);ctx.shadowBlur=18;ctx.strokeStyle=rgba(AG.green,0.9*o.glow);ctx.lineWidth=3*s;rr(ctx,x-h/2,y-h/2,h,h,r);ctx.stroke();ctx.restore();}
  const ink=mix(mix(AG.ink,[255,255,255],sl),[150,148,146],gr*(1-sl));
  ag_T(ctx,sl>0.5?"x":ch,x,y+12*s,{w:700,size:Math.max(28,34*s),align:"center",color:rgba(ink,1)});
  ctx.restore();}
// the rows: their labels, and each tile's letter and place (x from the row's left, y the row's centre). gap: between tiles in a group
const MC_ROWS=[{label:"as it's recited",groups:["abcd"]},{label:"word by word",groups:["a","b","c","d"],split:1},
  {label:"in pairs",groups:["ab","bc","cd"]},{label:"braided, back and forth",groups:["ab","ba","ab","bc","cb","bc"]}];
function mc_rowTiles(r,cx,y,o){o=o||{};const R=MC_ROWS[r],s=o.s||1,t=MC_TILE*s,inG=4*s,between=(R.split?44:r===3?18:30)*s,out=[];let x=0;
  R.groups.forEach((g,gi)=>{for(let i=0;i<g.length;i++){out.push({ch:g[i],x,y,g:gi,i,r,k:out.length});x+=t+inG;}x+=between-inG;});
  const w=x-(between-inG)-inG;out.forEach(q=>q.x+=cx-w/2+t/2);return out;}
// the patterns: rows centred on cx, opening one at a time (o.open[r] 0 to 1), each label on a pill at its row's left; returns every tile.
// o.slip: the slipped tile, 0 to 1 (row 2's fourth tile: bc said as bx); o.glow 0 to 1 (green when they agree); o.grey (fading)
function mc_rows(ctx,cx,Y,o){o=o||{};const s=o.s||1,dy=(o.dy||104)*s,all=[];const open=o.open||[1,1,1,1];
  for(let r=0;r<4;r++){const y=Y+r*dy,ts=mc_rowTiles(r,cx,y,{s}),op=clamp(open[r],0,1);all.push(ts);if(op<=0)continue;
    const lw=ag_tw(ctx,MC_ROWS[r].label,{w:700,size:30})+56,lx=ts[0].x-MC_TILE*s/2-22*s-lw/2;
    if(o.labelA!==0)ag_pill(ctx,lx,y,MC_ROWS[r].label,{a:op*(o.labelA==null?1:o.labelA)});
    // the recited row is one breath: a soft band of light behind its joined tiles
    if(r===0){const w=ts[3].x-ts[0].x+MC_TILE*s;ctx.save();ctx.globalAlpha*=op;ctx.fillStyle="rgba(255,248,226,0.6)";rr(ctx,ts[0].x-MC_TILE*s/2-8,y-MC_TILE*s/2-8,w*ag_sine(op*1.4)+16,MC_TILE*s+16,16);ctx.fill();ctx.restore();}
    if(r===1)for(let i=1;i<4;i++){ctx.save();ctx.globalAlpha*=op;ctx.strokeStyle=rgba(AG.mut,0.6);ctx.lineWidth=3;ctx.lineCap="round";const mx=(ts[i-1].x+ts[i].x)/2;
      ctx.beginPath();ctx.moveTo(mx+8,y-18);ctx.lineTo(mx-8,y+18);ctx.stroke();ctx.restore();}
    if(o.tiles===false)continue;
    ts.forEach((tl,i)=>{const u=clamp(op*1.6-i/ts.length*0.6,0,1);if(u<=0)return;const slipped=r===2&&i===3?(o.slip||0):0;
      mc_tile(ctx,tl.x,tl.y,tl.ch,{s,a:u,k:ag_spr(u,0,0.35),slip:slipped,glow:(o.glow||0)*(1-slipped),grey:o.grey||0});});}
  return all;}
// the threads: each word joined to itself from row to row (each tile to the nearest of its letter in the row above), drawn under the
// tiles; p 0 to 1 how far down they've run; o.slip breaks the threads through the slipped tile, amber and dashed
function mc_threads(ctx,rows,p,o){o=o||{};if(p<=0)return;const sl=o.slip||0;ctx.save();ctx.lineCap="round";if(o.a!=null)ctx.globalAlpha*=o.a;
  const up=(r,tl)=>{const c=rows[r-1].filter(q=>q.ch===tl.ch);return c.length?c.reduce((m,z)=>Math.abs(z.x-tl.x)<Math.abs(m.x-tl.x)?z:m,c[0]):null;};
  for(let r=1;r<4;r++){const u=clamp(p*3-(r-1),0,1);if(u<=0)break;
    rows[r].forEach((tl,i)=>{const q=up(r,tl);if(!q)return;const bad=sl>0.02&&((r===2&&i===3)||(r===3&&q.r===2&&q.k===3)),half=MC_TILE*(o.s||1)/2,
      y0=q.y+half-6,y1=lerp(y0,tl.y-half+6,u),x1=lerp(q.x,tl.x,u);
      ctx.strokeStyle=bad?rgba(AG.amber,0.95):rgba(AG.green,0.85);ctx.lineWidth=3.2;ctx.setLineDash(bad?[10,9]:[]);
      ctx.beginPath();ctx.moveTo(q.x,y0);ctx.bezierCurveTo(q.x,lerp(y0,y1,0.55),x1,lerp(y0,y1,0.45),x1,y1);ctx.stroke();});}
  ctx.setLineDash([]);ctx.restore();}

/* ---------------------------------------------------------------- light that carries a hymn
   A ribbon of soft light along a curve [x0,y0, x1,y1, x2,y2, x3,y3], drawn from u0 to u1; a hymn rising (mc_rise) as faint ribbons
   that drift up and fade, too many to count */
function mc_ribbon(ctx,p,u0,u1,a,w){if(a<=0||u1<=u0)return;ctx.save();ctx.lineCap="round";ctx.globalCompositeOperation="lighter";
  for(const [lw,al] of [[w*3.2,0.08],[w*1.6,0.16],[w*0.6,0.5]]){ctx.strokeStyle="rgba(255,236,196,"+(al*a)+")";ctx.lineWidth=lw;ag_bzPath(ctx,p,u0,u1);ctx.stroke();}
  const q=ag_bz(p,u1);glow(ctx,q[0],q[1],w*4,[255,240,210],0.5*a);ctx.restore();}
function mc_rise(ctx,t,srcs,a,n){if(a<=0)return;n=n||30;for(let i=0;i<n;i++){const s=srcs[i%srcs.length],ph=hash(i,7),u=((t*0.07+ph)%1),x=s[0]+Math.sin(u*6+i)*30+(hash(i,3)-0.5)*120*u,
    y=s[1]-u*420,len=40+60*hash(i,5),p=[x,y,x+12,y-len*0.3,x-10,y-len*0.7,x+4,y-len];mc_ribbon(ctx,p,0,1,a*Math.sin(u*Math.PI)*0.7,3);}}

/* ---------------------------------------------------------------- tags and corner words
   mc_tag: a pill with words, where the place or the time is said (the riverbank's sky needs a card under its words, the room's
   marble doesn't); mc_corner: the day or the time at the top right of the room, in the kicker's letter-spaced capitals */
function mc_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=ag_tw(ctx,text,{w:700,size:30})+56,cx=o.align==="right"?x-w/2:o.align==="center"?x:x+w/2;
  ctx.save();if(o.k!=null)ag_about(ctx,cx,y,lerp(0.6,1,o.k));ag_pill(ctx,cx,y,text,{a,col:o.col});ctx.restore();return{x:cx-w/2,w};}
function mc_corner(ctx,text,a,o){o=o||{};if(a<=0)return;ag_T(ctx,String(text).toUpperCase(),o.x||1824,o.y||100,{w:700,size:28,ls:3.5,align:"right",col:o.col||AG.violet,a});}

/* ---------------------------------------------------------------- the room's things
   mc_answer: an answer card from the agent, all the same shape and the same type, so each looks as sure as the last: a kicker, the
   answer, and at its foot the evidence slot, grey and empty ("evidence: —") until the answer shows where it came from (o.fill 0 to 1:
   the query, then the rows, in orange, data coming back). o.source: a source it cites (orange, as real as any; o.false 0 to 1 turns it
   amber, struck through; o.srcA its opacity, as it's written in). o.sorry: a line above the answer. o.turn 0 to 1 turns the card over to o.back (another answer's words). */
// text drawn too small to read on purpose (a card turning over, a paper in flight, cards set aside), which the phone check skips: its
// hook is PH_OFF, as From words to data's tools name it
let PH_OFF=0;
function mc_deco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
const MC_ANS_W=520;
function mc_answerW(ctx,o){let w=MC_ANS_W;for(const [t,f] of [[(o.kick||"answer").toUpperCase(),{w:700,size:28,ls:4}],[o.title,{w:800,size:40}],[o.source,{w:600,size:28}],[o.sorry,{w:600,size:28}],[o.why,{w:600,size:28}]])if(t)w=Math.max(w,ag_tw(ctx,t,f)+64);return Math.ceil(w);}
function mc_answerH(o){return 28+38+56+(o.sorry?42:0)+(o.source?42:0)+(o.why?42:0)+18+(o.fill>0?170:62)+28;}
function mc_answer(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return{x,y,w:MC_ANS_W,h:0};const tn=clamp(o.turn||0,0,1);
  if(tn>0&&o.back){const sx=Math.abs(Math.cos(tn*Math.PI)),q=tn<0.5?o:Object.assign({},o,o.back,{turn:0,back:null});
    const cw=Math.max(mc_answerW(ctx,o),mc_answerW(ctx,Object.assign({},o,o.back)));ctx.save();ctx.translate(x+cw/2,y);ctx.scale(Math.max(0.02,sx),1);ctx.translate(-(x+cw/2),-y);const r=mc_deco(sx<0.95,()=>mc_answer(ctx,x,y,Object.assign({},q,{turn:0,back:null})));ctx.restore();return r;}
  const w=o.w||mc_answerW(ctx,o),h=mc_answerH(o);ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,o.kx||x+w/2,o.ky||y+h/2,lerp(0.55,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:o.edgeA,glow:o.glowC||null,glowA:o.glowA});
  let yy=y+28+22;ag_T(ctx,(o.kick||"answer").toUpperCase(),x+30,yy,{w:700,size:28,ls:4,col:AG.violet});
  if(o.sorry){yy+=42;ag_T(ctx,o.sorry,x+30,yy,{w:600,size:28,col:AG.mut});}
  yy+=56;ag_T(ctx,o.title,x+30,yy,{w:800,size:40});
  if(o.source){yy+=42;const f=clamp(o.false||0,0,1),col=mix(AG.orange,AG.amber,f);ag_T(ctx,o.source,x+30,yy,{w:600,size:28,col,a:o.srcA==null?1:o.srcA});
    if(f>0){const tw2=ag_tw(ctx,o.source,{w:600,size:28});ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+28,yy-9);ctx.lineTo(x+30+tw2*ag_sine(f),yy-9);ctx.stroke();}}
  if(o.why){yy+=42;ag_T(ctx,o.why,x+30,yy,{w:600,size:28,col:o.whyCol||AG.green});}
  // the evidence slot
  yy+=18;const sh=o.fill>0?170:62,sy=yy,fl=clamp(o.fill||0,0,1),pulse=o.pulse||0;
  ctx.save();rr(ctx,x+22,sy,w-44,sh,14);ctx.fillStyle=rgba(mix([226,224,220],[244,232,222],fl),1);ctx.fill();
  ctx.strokeStyle=fl>0?rgba(AG.orange,0.75*fl):"rgba(60,50,40,"+(0.16+0.4*pulse)+")";ctx.lineWidth=fl>0?2.4:1.4+2*pulse;ctx.setLineDash(fl>0?[]:[8,7]);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  if(pulse>0){ctx.save();ctx.shadowColor=rgba(AG.amber,0.5*pulse);ctx.shadowBlur=20;ctx.strokeStyle=rgba(AG.amber,0.6*pulse);ctx.lineWidth=2;rr(ctx,x+22,sy,w-44,sh,14);ctx.stroke();ctx.restore();}
  if(fl<=0)ag_T(ctx,"evidence: —",x+46,sy+41,{w:600,size:28,col:AG.mut});
  else{const q=ag_in(fl,0,0.45),r=ag_in(fl,0.45,0.5);
    withA(ctx,q,()=>{ag_T(ctx,"the query",x+46,sy+40,{w:700,size:28,col:AG.orange});for(let i=0;i<3;i++){ctx.fillStyle=rgba(AG.orange,0.28);rr(ctx,x+46,sy+56+i*16,[300,220,260][i]*q,8,4);ctx.fill();}});
    withA(ctx,r,()=>{const tx=x+w-46-150;ag_T(ctx,"the rows",tx,sy+40,{w:700,size:28,col:AG.orange});
      for(let i=0;i<5;i++){ctx.fillStyle=rgba(i%2?[236,226,216]:[228,214,202],1);ctx.fillRect(tx,sy+54+i*20,150*r,18);ctx.fillStyle=rgba(AG.orange,0.3);ctx.fillRect(tx+8,sy+60+i*20,40*r,6);ctx.fillRect(tx+60,sy+60+i*20,70*r,6);}});}
  ctx.restore();return{x,y,w,h};}
// a speech bubble from a person: tail to (px, py); o.k springs it in, o.a
function mc_bubble(ctx,x,y,w,text,px,py,o){o=o||{};return ag_textCard(ctx,x,y,w,{title:text},{tail:{side:o.side||"bottom",at:o.at==null?0.15:o.at,px,py},a:o.a,k:o.k,edge:o.edge});}
// a memory: a soft-edged card, no hard edge, rising from a person's head with three small rounds
function mc_memory(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const w=ag_tw(ctx,text,{w:700,size:32})+64,h=74,soft=o.soft==null?1:o.soft;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor="rgba(250,248,244,"+(0.95*soft)+")";ctx.shadowBlur=26;ctx.fillStyle="rgba(250,248,244,0.93)";rr(ctx,x,y,w,h,h/2);ctx.fill();ctx.fill();ctx.restore();
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.12)";ctx.shadowBlur=30;ctx.shadowOffsetY=12;ctx.fillStyle="rgba(250,248,244,0.6)";rr(ctx,x,y,w,h,h/2);ctx.fill();ctx.restore();
  if(o.tail)for(let i=0;i<3;i++){const u=(i+1)/4,cx=lerp(x+w*0.2,o.tail[0],u),cy=lerp(y+h,o.tail[1],u);ctx.fillStyle="rgba(250,248,244,0.92)";ctx.save();ctx.shadowColor="rgba(46,38,28,0.14)";ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(cx,cy,12-i*3,0,TAU);ctx.fill();ctx.restore();}
  ctx.save();if(o.blur)ctx.filter="blur("+o.blur+"px)";ag_T(ctx,text,x+32,y+h/2+11,{w:700,size:32,col:AG.ink});ctx.restore();
  ctx.restore();return{x,y,w,h};}
// a paper: a white sheet with a kicker, a title and grey lines; o.rot turns it, o.lines how many lines of grey text
function mc_paper(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=22;ctx.shadowOffsetX=AG.sdx*0.8;ctx.shadowOffsetY=10;ctx.fillStyle="#FBFAF7";ctx.fillRect(0,0,w,h);ctx.restore();
  ctx.fillStyle="#FBFAF7";ctx.fillRect(0,0,w,h);ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.2;ctx.strokeRect(0,0,w,h);
  let yy=46;if(o.kick){ag_T(ctx,o.kick.toUpperCase(),28,yy,{w:700,size:28,ls:4,col:o.kickCol||AG.blue});yy+=8;}
  if(o.title){for(const l of ag_wrap(ctx,o.title,w-56,{w:800,size:34})){yy+=42;ag_T(ctx,l,28,yy,{w:800,size:34});}}
  if(o.sub){for(const l of ag_wrap(ctx,o.sub,w-56,{w:600,size:28})){yy+=38;ag_T(ctx,l,28,yy,{w:600,size:28,col:o.subCol||AG.mut});}}
  yy+=26;const R=ag_rnd(o.seed||3),n=o.lines==null?6:o.lines;for(let i=0;i<n&&yy<h-24;i++){ctx.fillStyle="rgba(60,56,52,0.16)";ctx.fillRect(28,yy,(w-56)*(0.55+0.45*R())*(i===n-1?0.6:1),8);yy+=22;}
  if(o.draw)o.draw(ctx,w,h);
  ctx.restore();}
// a speech-free card on the wall or the floor: words on a card, as ag_textCard, with a coloured edge where the colour means something
function mc_card(ctx,x,y,w,words,o){return ag_textCard(ctx,x,y,w,words,o||{});}
// one word the agent writes, at (x, y), taken at T from a small stack of three likely words over its place, the most likely on top
// (violet) and all left-aligned with the word: the stack rises in, the other two fade, and the top one drops into the line, growing
// to the line's size. MC_STK: the top word's height over the line, and the step between the three
const MC_STK={top:150,step:48};
function mc_pick(ctx,x,y,words,t,T,o){o=o||{};const s={w:700,size:28},a=o.a==null?1:o.a;
  const sIn=ag_in(t,T-0.48,0.22);if(sIn<=0||a<=0)return;const rise=1-ag_eo(ag_in(t,T-0.48,0.3)),rest=1-ag_in(t,T-0.14,0.2),e=ag_eo(ag_in(t,T,0.34));
  ctx.save();ctx.globalAlpha*=a;
  if(rest>0)for(let i=words.length-1;i>0;i--){const yy=y-MC_STK.top+i*MC_STK.step+rise*16,pw=ag_tw(ctx,words[i],s)+36;
    withA(ctx,sIn*rest,()=>{ag_box(ctx,x-18,yy-21,pw,42,21,{edgeA:0.3});ag_T(ctx,words[i],x,yy+10,Object.assign({},s,{col:AG.mut,a:0.95-0.15*i}));});}
  const y0=y-MC_STK.top+rise*16,yy=lerp(y0,y-12,e),box=1-ag_in(t,T+0.04,0.26),sz=lerp(28,34,e),pw=ag_tw(ctx,words[0],{w:700,size:sz})+36;
  if(box>0)withA(ctx,sIn*box,()=>ag_box(ctx,x-18,yy-21,pw,42,21,{edge:AG.violet,edgeA:0.9}));
  ag_T(ctx,words[0],x,lerp(y0+10,y,e),{w:700,size:sz,col:o.col||AG.violet,a:sIn});
  ctx.restore();}
// the agent: the sphere in its oak ring, without the steps (this film doesn't follow its loop); o.spin turns the ring's light once
// round (0 to 1) as it answers, the other way round with o.dir -1; o.clear 0 to 1 empties it (a new chat: the band dims and the ring's light goes); o.label
function mc_agent(ctx,x,y,o){o=o||{};const R=o.R||150,r=o.r||74,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const cl=clamp(o.clear||0,0,1);
  ag_modelLight(ctx,x,y,r,(o.core==null?0.8:o.core)*(1-0.6*cl),o.floor);
  const sp=o.spin;ag_ring(ctx,x,y,R,{p:1,from:-90,arrows:[-30,90,210],pulse:sp>0&&sp<1?{deg:-90+(o.dir||1)*360*ag_sine(sp),a:Math.sin(Math.PI*sp)}:null});
  ag_model(ctx,x,y,r,{t:o.t||0,core:(o.core==null?0.8:o.core)*(1-0.7*cl),think:o.think||0,label:o.label===undefined?"Agent":o.label});
  ctx.restore();}

/* ---------------------------------------------------------------- Cambridge, about 1920
   A college room: plaster above dark oak panelling, a tall window on the right, a bookcase, a desk. Bartlett is a man in his thirties
   in a three-piece suit, not a likeness; the people he asks to retell the tale are a woman and a man of the time. The tale itself is
   never drawn: its page is grey lines under its English title. */
const MC_CAM={wall:[226,214,192],panel:[118,86,60],floor:[132,100,72],desk:[110,78,52],hz:700};
function mc_paintCambridge(c){const P=MC_CAM,hz=P.hz;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(ag_dk(P.wall,0.1),1));g.addColorStop(1,rgba(P.wall,1));c.fillStyle=g;c.fillRect(0,0,W,hz);
  // the tall window on the right: its light, its panes, the sky beyond
  const wx=1430,wy=60,ww=330,wh=600;g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"#CFDDE6");g.addColorStop(1,"#EEF0EA");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.fillStyle="rgba(160,170,160,0.5)";c.beginPath();c.moveTo(wx,wy+wh*0.78);c.bezierCurveTo(wx+ww*0.3,wy+wh*0.7,wx+ww*0.6,wy+wh*0.74,wx+ww,wy+wh*0.68);c.lineTo(wx+ww,wy+wh);c.lineTo(wx,wy+wh);c.closePath();c.fill();
  c.strokeStyle="#F4EFE6";c.lineWidth=10;c.strokeRect(wx,wy,ww,wh);c.lineWidth=6;for(const u of [1/3,2/3]){c.beginPath();c.moveTo(wx+ww*u,wy);c.lineTo(wx+ww*u,wy+wh);c.stroke();}
  for(const u of [0.25,0.5,0.75]){c.beginPath();c.moveTo(wx,wy+wh*u);c.lineTo(wx+ww,wy+wh*u);c.stroke();}
  c.fillStyle="rgba(60,40,24,0.25)";c.fillRect(wx-24,wy+wh,ww+48,18);
  g=c.createRadialGradient(wx+ww/2,wy+wh/2,40,wx+ww/2,wy+wh/2,900);g.addColorStop(0,"rgba(255,250,236,0.35)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the panelling: dark oak below the dado rail, in tall panels
  const py=440;g=c.createLinearGradient(0,py,0,hz);g.addColorStop(0,rgba(P.panel,1));g.addColorStop(1,rgba(ag_dk(P.panel,0.2),1));c.fillStyle=g;c.fillRect(0,py,W,hz-py);
  c.fillStyle=rgba(ag_lt(P.panel,0.25),1);c.fillRect(0,py-12,W,14);c.fillStyle=rgba(ag_dk(P.panel,0.35),1);c.fillRect(0,py+2,W,4);
  for(let x=40;x<W;x+=210){ag_soft(c,cc=>ag_rect(cc,x,py+40,170,hz-py-70,6),ag_dk(P.panel,0.06),ag_lt(P.panel,0.18),x+150,py+50,160,"rgba(20,12,6,0.4)",10,0.4);}
  // a bookcase on the left
  const bx=90,by=120,bw=420,bh=py-by;c.fillStyle=rgba(ag_dk(P.panel,0.15),1);c.fillRect(bx-14,by-14,bw+28,bh+14);
  const R=ag_rnd(19);for(let sh=0;sh<3;sh++){const sy=by+sh*(bh/3);c.fillStyle=rgba(ag_dk(P.panel,0.5),1);c.fillRect(bx,sy,bw,bh/3-10);
    let x=bx+6;while(x<bx+bw-20){const w=12+R()*16,h=bh/3-24-R()*26,col=[[120,60,50],[70,80,90],[150,130,90],[90,70,60],[60,70,60]][(R()*5)|0];c.fillStyle=rgba(mix(col,[90,80,70],0.3),1);c.fillRect(x,sy+bh/3-10-h,w,h);
      c.fillStyle="rgba(255,240,210,0.18)";c.fillRect(x+w*0.3,sy+bh/3-10-h+8,2,h-16);x+=w+2;}
    c.fillStyle=rgba(ag_lt(P.panel,0.1),1);c.fillRect(bx-14,sy+bh/3-10,bw+28,10);}
  // the floor: boards in perspective
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(ag_dk(P.floor,0.15),1));g.addColorStop(1,rgba(P.floor,1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  c.strokeStyle="rgba(40,24,12,0.25)";c.lineWidth=1.5;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(960+i*40,hz);c.lineTo(960+i*230,H);c.stroke();}
  c.fillStyle="rgba(20,12,6,0.35)";c.fillRect(0,hz,W,3);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,20,10,0.28)");g.addColorStop(0.5,"rgba(30,20,10,0.04)");g.addColorStop(1,"rgba(255,248,230,0.06)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.mcCambridge=mc_paintCambridge;
// the desk between them: dark oak, its top's front edge at y, from x0 to x1; returns the top's back edge (where people are cut)
function mc_desk1920(ctx,x0,x1,y,o){o=o||{};const d=80,a=o.a==null?1:o.a;if(a<=0)return y-d;ctx.save();ctx.globalAlpha*=a;const P=MC_CAM.desk;
  ag_floorShadow(ctx,(x0+x1)/2-10,y+170,(x1-x0)*0.55,30,0.35);
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,rgba(ag_lt(P,0.12),1));g.addColorStop(1,rgba(P,1));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x0+30,y-d);ctx.lineTo(x1-30,y-d);ctx.lineTo(x1,y);ctx.lineTo(x0,y);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(ag_dk(P,0.25),1);ctx.fillRect(x0,y,x1-x0,26);ctx.fillStyle=rgba(ag_dk(P,0.45),1);ctx.fillRect(x0+20,y+26,30,150);ctx.fillRect(x1-50,y+26,30,150);
  ctx.fillStyle=rgba(ag_dk(P,0.35),1);ctx.fillRect(x0+60,y+26,x1-x0-120,60);ctx.strokeStyle="rgba(255,230,190,0.16)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
  ctx.restore();return y-d;}
const MC_BARTLETT={name:"the psychologist",key:"mc-bartlett",skin:[232,198,176],hair:{style:"side",c:[96,70,50]},top:{kind:"suit",c:[104,96,84],inner:[238,236,228],tie:[104,58,56]},breath:0.24};
const MC_WOMAN={name:"a woman, 1920",key:"mc-woman",skin:[236,206,186],hair:{style:"bob",c:[70,50,40]},earrings:[200,190,170],top:{kind:"cardigan",c:[124,112,104],inner:[236,232,222]},breath:0.3};
const MC_MAN={name:"a man, 1920",key:"mc-man",skin:[226,190,166],hair:{style:"side",c:[58,44,36]},top:{kind:"suit",c:[78,78,86],inner:[236,236,230],tie:[70,72,96]},breath:0.26};
const MC_MAN2=Object.assign({},MC_MAN,{name:"the same man, later",key:"mc-man2",hair:{style:"side",c:[120,110,100]}});

/* ---------------------------------------------------------------- Seattle, 1974
   A lecture room: a screen at the front, a blackboard, rows of seats seen from behind with an aisle down the middle, a projector on a
   cart throwing its beam over the heads. The students are seen from behind, dressed for 1974; the film on the screen is two plain
   cars meeting at a crossing, nobody in them, nothing broken. */
const MC_SEA={wall:[214,204,180],floor:[120,108,96],board:[64,70,66]};
function mc_paintSeattle(c){const P=MC_SEA;let g=c.createLinearGradient(0,0,0,640);g.addColorStop(0,rgba(ag_dk(P.wall,0.18),1));g.addColorStop(1,rgba(P.wall,1));c.fillStyle=g;c.fillRect(0,0,W,640);
  // acoustic tiles on the ceiling's edge, the blackboard, the screen pulled down over it
  c.fillStyle=rgba(ag_lt(P.wall,0.2),1);c.fillRect(0,0,W,46);c.strokeStyle="rgba(60,50,40,0.12)";for(let x=0;x<W;x+=96){c.beginPath();c.moveTo(x,0);c.lineTo(x,46);c.stroke();}
  ag_soft(c,cc=>ag_rect(cc,330,150,1260,400,6),P.board,ag_lt(P.board,0.15),900,200,600,null);c.fillStyle="rgba(150,130,100,0.8)";c.fillRect(320,548,1280,14);
  ag_soft(c,cc=>ag_rect(cc,560,96,800,450,4),[238,238,232],[255,255,252],960,200,700,"rgba(40,40,40,0.25)",12);c.fillStyle="#3A3A3E";c.fillRect(540,84,840,16);
  // the floor and the seats' backs, rising towards us in rows, the aisle down the middle
  g=c.createLinearGradient(0,600,0,H);g.addColorStop(0,rgba(P.floor,1));g.addColorStop(1,rgba(ag_dk(P.floor,0.25),1));c.fillStyle=g;c.fillRect(0,600,W,H-600);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(20,16,12,0.3)");g.addColorStop(0.5,"rgba(20,16,12,0.02)");g.addColorStop(1,"rgba(20,16,12,0.3)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.mcSeattle=mc_paintSeattle;
// a row of seats' backs (r 0, the furthest, to 3, the nearest), drawn live over the students sitting in it, the aisle down the middle;
// the room's side shade is drawn again over them (mc_seaShade), as the place has it
const MC_ROWY=r=>640+r*120,MC_ROWK=r=>1+r*0.25;
function mc_seatRow(ctx,r){const y=MC_ROWY(r),k=MC_ROWK(r);for(const side of [-1,1]){const x0=side<0?-40:960+150*k*0.5,x1=side<0?960-150*k*0.5:W+40;
  ag_soft(ctx,cc=>ag_rect(cc,x0,y,x1-x0,40*k,10),[96,78,60],[140,116,90],side<0?x1-200:x1-300,y,400,"rgba(20,12,6,0.35)",8);}}
function mc_seaShade(ctx){const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(20,16,12,0.3)");g.addColorStop(0.5,"rgba(20,16,12,0.02)");g.addColorStop(1,"rgba(20,16,12,0.3)");ctx.fillStyle=g;ctx.fillRect(0,560,W,H-560);}
// the students, row by row from the back: each row's students (seen from behind, MC_STUDENTS), then that row's seat backs in front
// of them; the aisle down the middle is left clear for the projector's cart
const MC_SEATS=[[0,[300,470,640,1280,1450,1620]],[1,[230,430,630,1290,1490,1690]],[2,[150,390,640,1280,1530,1770]],[3,[260,560,1360,1660]]];
function mc_students(ctx,t,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;let n=0;
  for(const [r,xs] of MC_SEATS){const k=MC_ROWK(r),s=0.36+r*0.1,y=MC_ROWY(r)-104*s;ctx.save();ctx.beginPath();ctx.rect(-50,0,W+100,MC_ROWY(r)+30*k);ctx.clip();
    xs.forEach(x=>{mc_back(ctx,x,y,s,MC_STUDENTS[n%MC_STUDENTS.length],t+n*0.7);n++;});ctx.restore();mc_seatRow(ctx,r);}
  mc_seaShade(ctx);ctx.restore();}
// the projector on its cart in the aisle, its two reels turning while the film runs (run 0 to 1), the beam to the screen
function mc_projector(ctx,x,y,t,run){const r=34;
  // the beam: from the lens to the screen, soft and pale, brighter at the lens
  if(run>0){ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createLinearGradient(x,y-40,960,300);g.addColorStop(0,"rgba(255,250,230,"+(0.32*run)+")");g.addColorStop(1,"rgba(255,250,230,"+(0.04*run)+")");
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-10,y-46);ctx.lineTo(566,104);ctx.lineTo(1354,104);ctx.lineTo(x+10,y-46);ctx.closePath();ctx.fill();ctx.restore();}
  // the cart: a steel frame on castors; the projector's body; two reels on their arms, turning
  ctx.fillStyle="#4A4A4E";ctx.fillRect(x-70,y+40,140,10);ctx.fillRect(x-62,y+50,8,90);ctx.fillRect(x+54,y+50,8,90);ctx.fillRect(x-70,y+120,140,8);
  ag_soft(ctx,cc=>ag_rect(cc,x-66,y-30,132,70,10),[70,72,76],[120,122,126],x+30,y-20,120,"rgba(0,0,0,0.4)",10);
  ctx.fillStyle="#2A2B2E";ctx.beginPath();ctx.arc(x,y-38,12,0,TAU);ctx.fill();
  for(const [dx,dy] of [[-40,-96],[44,-88]]){ctx.strokeStyle="#55565A";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x+dx*0.4,y-30);ctx.lineTo(x+dx,y+dy);ctx.stroke();
    ctx.save();ctx.translate(x+dx,y+dy);ctx.rotate(t*2.4*run);ctx.fillStyle="#3C3D41";ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.fillStyle="#6A6B70";
    for(let i=0;i<3;i++){ctx.rotate(TAU/3);ctx.beginPath();ctx.arc(r*0.5,0,r*0.22,0,TAU);ctx.fill();}ctx.fillStyle="#8A8B90";ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();ctx.restore();}}
// a student seen from behind: head and shoulders at (x, y) (the nape), s the size; spec {hair: [style, colour], top: colour, collar}
function mc_back(ctx,x,y,s,sp,t){const hc=sp.hair[1],tc=sp.top,st=sp.hair[0],br=Math.sin((t||0)*1.6+x*0.01)*1.5;ctx.save();ctx.translate(x,y+br);ctx.scale(s,s);
  // shoulders and back, in the clothes of the time; a wide collar
  ag_soft(ctx,cc=>{cc.moveTo(-60,10);cc.bezierCurveTo(-150,20,-200,60,-210,140);cc.lineTo(-220,320);cc.lineTo(220,320);cc.lineTo(210,140);cc.bezierCurveTo(200,60,150,20,60,10);cc.closePath();},
    tc,ag_lt(tc,0.25),120,60,220,rgba(ag_dk(tc,0.7),0.4),18);
  if(sp.collar)ag_soft(ctx,cc=>{cc.moveTo(-70,4);cc.lineTo(-120,46);cc.lineTo(-40,40);cc.lineTo(0,20);cc.lineTo(40,40);cc.lineTo(120,46);cc.lineTo(70,4);cc.closePath();},sp.collar,ag_lt(sp.collar,0.3),60,20,90,null);
  ag_soft(ctx,cc=>ag_rect(cc,-38,-40,76,60,20),sp.skin||[226,190,166],sp.skin||[236,206,186],20,-30,60,null);
  // the head from behind, and its hair
  const hair=cc=>{if(st==="long"){cc.moveTo(-70,-150);cc.bezierCurveTo(-80,-210,80,-210,70,-150);cc.bezierCurveTo(86,-80,90,0,70,40);cc.lineTo(-70,40);cc.bezierCurveTo(-90,0,-86,-80,-70,-150);cc.closePath();}
    else if(st==="afro"){cc.arc(0,-120,98,0,TAU);}
    else{cc.moveTo(-72,-130);cc.bezierCurveTo(-78,-200,78,-200,72,-130);cc.bezierCurveTo(76,-90,64,-50,46,-34);cc.lineTo(-46,-34);cc.bezierCurveTo(-64,-50,-76,-90,-72,-130);cc.closePath();}};
  ag_soft(ctx,cc=>cc.ellipse(-74,-100,12,22,0,0,TAU),sp.skin||[226,190,166],sp.skin||[236,206,186],-74,-110,20,null);ag_soft(ctx,cc=>cc.ellipse(74,-100,12,22,0,0,TAU),sp.skin||[226,190,166],sp.skin||[236,206,186],74,-110,20,null);
  ag_soft(ctx,hair,hc,ag_lt(hc,0.3),40,-170,140,rgba(ag_dk(hc,0.6),0.5),16);
  ctx.restore();}
const MC_STUDENTS=[{hair:["long",[92,64,42]],top:[120,92,66],collar:[226,214,190]},{hair:["short",[60,44,34]],top:[228,220,200]},{hair:["afro",[38,28,24]],top:[120,60,64],skin:[120,80,58],collar:[230,224,210]},
  {hair:["long",[196,170,120]],top:[176,150,116]},{hair:["short",[150,110,70]],top:[92,104,120],collar:[222,216,204]},{hair:["long",[30,24,22]],top:[120,120,124],skin:[214,178,140]},
  {hair:["short",[40,30,26]],top:[150,118,84],collar:[234,228,214]},{hair:["long",[120,82,52]],top:[100,84,92]}];
// the film on the screen: a crossing seen from above, two plain cars meeting (u 0 to 1), in the greys of a film of the time
function mc_crash(ctx,x,y,w,h,u){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle="#9C9C98";ctx.fillRect(x,y,w,h);
  ctx.fillStyle="#7E7E7A";ctx.fillRect(x,y+h*0.36,w,h*0.28);ctx.fillRect(x+w*0.42,y,w*0.16,h);ctx.fillStyle="#B8B8B2";for(let i=0;i<8;i++){ctx.fillRect(x+i*w/8+10,y+h*0.495,w/16,4);}
  const car=(cx,cy,ang,col)=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);ctx.fillStyle="rgba(0,0,0,0.25)";rr(ctx,-50,-22,104,48,10);ctx.fill();ctx.fillStyle=col;rr(ctx,-52,-24,104,48,12);ctx.fill();
    ctx.fillStyle="rgba(40,40,44,0.7)";rr(ctx,-14,-18,34,36,6);ctx.fill();ctx.restore();};
  const e=ag_eo(clamp(u,0,1));car(lerp(x-60,x+w*0.5-58,e),y+h*0.56,0,"#4A4A4E");car(x+w*0.5+4,lerp(y-60,y+h*0.5-50,e),Math.PI/2,"#D8D8D4");ctx.restore();}

/* ---------------------------------------------------------------- a memory, rebuilt (chapter 4)
   A head drawn in light, in profile, facing right: a few bright points light inside it (the details that are kept), soft lines sketch
   themselves in between them (the rest, filled with what seems likely: here, the riverbank from the opening), a dark patch where
   nothing is kept (o.gap), filled with a soft shape (o.likely) that comes out as bright as the rest (o.sure). s: 1 is about 420 px tall */
function mc_profile(c){c.moveTo(-40,-200);c.bezierCurveTo(60,-214,140,-170,156,-90);c.bezierCurveTo(162,-60,160,-30,166,-10);c.lineTo(196,40);c.bezierCurveTo(200,50,192,56,180,58);
  c.bezierCurveTo(184,70,180,80,176,84);c.bezierCurveTo(182,92,178,100,172,104);c.bezierCurveTo(176,118,170,132,150,138);c.bezierCurveTo(130,142,110,140,96,150);
  c.lineTo(90,210);c.lineTo(-60,210);c.bezierCurveTo(-56,170,-80,130,-110,100);c.bezierCurveTo(-160,40,-170,-60,-140,-130);c.bezierCurveTo(-120,-176,-90,-196,-40,-200);c.closePath();}
const MC_PTS=[[-120,-40],[40,-80],[-58,-10],[-150,60],[160,62],[40,96]];
function mc_head(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  // the head: a faint violet-grey glass, its outline in soft light
  ctx.save();ag_shape(ctx,mc_profile);ctx.fillStyle="rgba(250,248,244,0.42)";ctx.fill();ctx.restore();
  ctx.save();ctx.shadowColor="rgba(255,246,220,0.9)";ctx.shadowBlur=18;ctx.strokeStyle="rgba(150,136,110,0.75)";ctx.lineWidth=4;ag_shape(ctx,mc_profile);ctx.stroke();ctx.restore();
  ctx.save();ag_shape(ctx,mc_profile);ctx.clip();
  const sure=clamp(o.sure||0,0,1),fl=clamp(o.fill||0,0,1),ink=(al)=>"rgba(120,104,80,"+al+")";
  // the rest, filled in: a horizon, a tree, ripples; drawn on by fl, as bright as the points once sure
  const lines=[[[-150,60],[-40,52],[160,62]],[[-60,40],[-58,-10],[-50,-50]],[[-120,-40],[-60,-130],[40,-80]],[[40,-80],[90,-40],[20,-30]],[[-140,92],[-60,86],[40,96]],[[-20,118],[40,114],[120,122]]];
  lines.forEach((l,i)=>{const u=clamp(fl*1.6-i*0.12,0,1);if(u<=0)return;ctx.strokeStyle=ink(0.35+0.4*sure);ctx.lineWidth=5;ctx.lineCap="round";ctx.setLineDash([u*400,1000]);
    ctx.beginPath();ctx.moveTo(l[0][0],l[0][1]);ctx.quadraticCurveTo(l[1][0],l[1][1],l[2][0],l[2][1]);ctx.stroke();});ctx.setLineDash([]);
  // the gap, and what fills it
  const gp=clamp(o.gap||0,0,1),lk=clamp(o.likely||0,0,1);
  if(gp>0){const g=ctx.createRadialGradient(70,10,0,70,10,70);g.addColorStop(0,"rgba(40,36,44,"+(0.55*gp*(1-lk))+")");g.addColorStop(1,"rgba(40,36,44,0)");ctx.fillStyle=g;ctx.fillRect(0,-60,140,140);}
  if(lk>0){ctx.save();ctx.globalAlpha*=lk;ctx.fillStyle="rgba(255,240,206,"+(0.4+0.5*sure)+")";ctx.beginPath();ctx.ellipse(70,10,46*ag_eo(lk),34*ag_eo(lk),0.3,0,TAU);ctx.fill();
    ctx.strokeStyle=ink(0.5+0.3*sure);ctx.lineWidth=5;ctx.stroke();ctx.restore();}
  ctx.restore();
  // the points: the few details that are kept
  const n=o.pts==null?1:o.pts;MC_PTS.forEach((p,i)=>{const u=clamp(n*MC_PTS.length-i,0,1);if(u<=0)return;glow(ctx,p[0],p[1],34,[255,236,190],0.8*u);
    ctx.fillStyle="rgba(255,250,236,"+u+")";ctx.beginPath();ctx.arc(p[0],p[1],7,0,TAU);ctx.fill();});
  ctx.restore();}

/* ---------------------------------------------------------------- checking the work (chapter 5)
   mc_count: a route's number, under its card; mc_rows2: the platform's rows, three pairs lit amber, "counted twice"; mc_nightly: the
   plain check every night; mc_record: what's been checked, on the wall for the whole team; mc_signoff: drafted by the agent, approved
   by a person; mc_screenSearch: Jun's search for the review */
function mc_count(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y-20,lerp(0.5,1,o.k));
  ag_T(ctx,String(n),x,y,{w:800,size:64,align:"center",col:o.col||AG.ink});ctx.restore();}
function mc_rows2(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const n=10,rh=32,hi=clamp(o.hi||0,0,1),fx=clamp(o.fixed||0,0,1),pairs=[[1,2],[4,5],[7,8]];
  ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,n*rh+30,16,{});
  for(let i=0;i<n;i++){const yy=y+15+i*rh,lit=pairs.some(p=>p.includes(i)),u=lit?hi:0,gone=lit&&i===pairs.find(p=>p.includes(i))[1]?fx:0;
    ctx.save();ctx.globalAlpha*=1-gone*0.75;ctx.fillStyle=rgba(mix(i%2?[238,236,232]:[230,228,224],[246,226,196],u),1);ctx.fillRect(x+12,yy,w-24,rh-4);
    ctx.fillStyle=rgba(mix([150,146,140],AG.amber,u),0.55+0.3*u);rr(ctx,x+28,yy+13,90,12,6);ctx.fill();rr(ctx,x+140,yy+13,w-190,12,6);ctx.fill();
    if(gone>0){ctx.strokeStyle=rgba(AG.amber,0.9*gone);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+20,yy+19);ctx.lineTo(x+20+(w-40)*gone,yy+19);ctx.stroke();}ctx.restore();}
  for(const p of pairs){if(hi<=0)continue;const yy=y+15+p[0]*rh;ctx.save();ctx.globalAlpha*=hi;ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=3;rr(ctx,x+6,yy-4,w-12,rh*2+4,10);ctx.stroke();ctx.restore();}
  ctx.restore();}
function mc_moon(ctx,x,y,r,t,col){ctx.save();ctx.translate(x,y);ctx.rotate(t);ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,r,0.6,TAU-0.6+Math.PI*0.0);ctx.arc(r*0.45,-r*0.1,r*0.78,TAU-0.9,0.9,true);ctx.closePath();ctx.fill();ctx.restore();}
function mc_nightly(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||540,b=ag_textCard(ctx,x,y,w,{kick:"every night",title:"nobody counted twice"},{edge:AG.blue,kickCol:AG.blue,a,k:o.k});
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+b.h/2,lerp(0.5,1,o.k));mc_moon(ctx,x+w-56,y+46,16,o.moon||0,rgba(AG.blue,0.85));
  if(o.tick>0)ag_tick(ctx,x+w-54,y+b.h-44,28,rgba(AG.green,o.tick),5);ctx.restore();return b;}
function mc_record(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y,lerp(0.6,1,o.k));
  const lines=["first-years who left · semester 1","Engineering and IT · 131","checked two ways · evidence attached"],h=28+38+lines.length*40+30;
  ag_box(ctx,x,y,w,h,20,{edge:AG.blue,edgeA:0.8});ag_T(ctx,"WHAT WE'VE CHECKED",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});
  ctx.fillStyle=rgba(AG.blue,0.25);ctx.fillRect(x+28,y+70,w-56,2);
  lines.forEach((l,i)=>{const u=clamp((o.row==null?1:o.row)*3-i,0,1);ag_T(ctx,l,x+28,y+112+i*40,{w:i===1?800:600,size:i===1?32:28,col:i===2?AG.green:AG.ink,a:u});});
  ctx.restore();return{x,y,w,h};}
function mc_signoff(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const h=176,sg=clamp(o.sign||0,0,1);
  ag_box(ctx,x,y,w,h,18,{edge:sg>0.95?AG.green:null,edgeA:0.8});
  ag_T(ctx,"drafted by the agent",x+28,y+48,{w:600,size:28,col:AG.violet});
  ctx.strokeStyle="rgba(60,50,40,0.25)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28,y+112);ctx.lineTo(x+w-28,y+112);ctx.stroke();
  // the signature: a quick pen line, drawn as she signs
  if(sg>0){ctx.save();ctx.strokeStyle="rgba(40,44,60,0.9)";ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.setLineDash([sg*900,2000]);ctx.beginPath();
    const sx=x+w-310,sy=y+100;ctx.moveTo(sx,sy);ctx.bezierCurveTo(sx+10,sy-40,sx+30,sy-40,sx+26,sy);ctx.bezierCurveTo(sx+24,sy+10,sx+50,sy-26,sx+70,sy-6);ctx.bezierCurveTo(sx+84,sy+6,sx+96,sy-30,sx+120,sy-10);
    ctx.bezierCurveTo(sx+140,sy+6,sx+150,sy-24,sx+176,sy-8);ctx.bezierCurveTo(sx+200,sy+4,sx+220,sy-14,sx+260,sy-12);ctx.stroke();ctx.restore();}
  withA(ctx,ag_in(sg,0.8,0.2),()=>{ag_tick(ctx,x+44,y+146,24,rgba(AG.green,1),4);ag_T(ctx,"approved · Clara Jensen",x+72,y+156,{w:700,size:28,col:AG.green});});
  ctx.restore();return{x,y,w,h};}
function mc_screenSearch(ctx,x,y,w,h,o){o=o||{};const typed=clamp(o.typed||0,0,1),res=clamp(o.res||0,0,1),q="2025 retention review",n=Math.round(q.length*typed);
  ctx.fillStyle="#F6F5F2";ctx.fillRect(x,y,w,h);ag_T(ctx,"LIBRARY",x+24,y+44,{w:700,size:28,ls:4,col:AG.blue});
  ag_box(ctx,x+20,y+64,w-40,60,12,{edge:AG.blue,edgeA:0.5});ag_T(ctx,q.slice(0,n),x+40,y+104,{w:600,size:28});
  if(typed>0&&typed<1&&Math.sin(o.t*12)>0){ctx.fillStyle=rgba(AG.ink,0.8);ctx.fillRect(x+44+ag_tw(ctx,q.slice(0,n),{w:600,size:28}),y+80,3,30);}
  if(res>0)ag_T(ctx,"no results",x+24,y+176,{w:700,size:32,col:AG.amber,a:res});}

/* ---------------------------------------------------------------- the university's room, and what's in it
   The module's lab, its veins quieter where this film puts the agent (in the middle), the answers (under it) and the day (top right). */
AG_PLACES.mcLab=c=>ag_paintLab(c,{quiet:[[960,330,330,280,0.55],[480,90,420,46,0.3],[1700,92,250,44,0.4],[960,640,560,190,0.3],[1680,250,260,160,0.3]]});
// Clara's draft on the wall: "Planning · draft", its title, and a blank for where the two advisers go: dashed and empty, "which
// faculty?" in grey (o.hint), glowing while it's asked (o.glow); o.fill 0 to 1 writes the faculty in, with a green tick; o.a, o.k
const MC_DRAFT={w:400,h:276};
function mc_draft(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const {w,h}=MC_DRAFT,fl=clamp(o.fill||0,0,1),gl=clamp(o.glow||0,0,1);
  ctx.save();if(o.k!=null)ag_about(ctx,o.kx==null?x+w/2:o.kx,o.ky==null?y+h/2:o.ky,lerp(0.3,1,o.k));
  mc_paper(ctx,x,y,w,h,{a,kick:fl>0.5?"Planning":"Planning · draft",title:"Two new advisers",sub:"for first-year students",lines:0,draw(c){
    ag_T(c,"where they go:",28,174,{w:600,size:28,col:AG.mut});
    const bx=24,by=192,bw=w-48,bh=60;c.save();if(gl>0){c.shadowColor=rgba(AG.blue,0.5*gl);c.shadowBlur=18;}c.fillStyle=rgba(mix([246,245,242],[236,242,246],gl),1);rr(c,bx,by,bw,bh,10);c.fill();c.restore();
    c.save();c.setLineDash(fl>0.5?[]:[8,7]);c.strokeStyle=fl>0.5?rgba(AG.green,0.8):rgba(mix([60,50,40],AG.blue,gl),0.4+0.4*gl);c.lineWidth=2;rr(c,bx,by,bw,bh,10);c.stroke();c.restore();
    if(fl<0.5)ag_T(c,"which faculty?",bx+20,by+40,{w:600,size:28,col:AG.mut,a:(o.hint==null?1:o.hint)*(1-fl*2)});
    else{const u=(fl-0.5)*2;ag_T(c,"Engineering and IT",bx+20,by+41,{w:800,size:30,col:AG.ink,a:u});ag_tick(c,bx+bw-30,by+30,26,rgba(AG.green,u),4);}}});
  ctx.restore();}

/* ---------------------------------------------------------------- Bartlett's retellings (chapter 3)
   mc_strip: one line of a retelling, close: grey bars for the words we don't show, and one word we do ("canoe"), struck through in
   amber as it changes, the new word ("boat") written above it in a pen's ink. mc_list: the man's numbered list, years later, two
   lines in amber words. Neither shows the folk tale itself. */
function mc_strip(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const st=clamp(o.strike||0,0,1),nw=clamp(o.boat||0,0,1),h=200;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=22;ctx.shadowOffsetX=AG.sdx*0.8;ctx.shadowOffsetY=10;ctx.fillStyle="#FBF8F0";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.2;ctx.strokeRect(x,y,w,h);
  // a ruled line: "canoe" in the middle, the words before and after it as grey bars that fill the strip
  const by=y+138,cw=ag_tw(ctx,"canoe",{w:700,size:44}),cx=x+Math.round(w/2-cw/2),bar=(bx,bw)=>{ctx.fillStyle="rgba(60,56,52,0.16)";rr(ctx,x+bx,by-14,bw,14,7);ctx.fill();};
  let bx=40;for(const bw of [120,70,150,90]){const end=cx-x-26;if(bx>=end-40)break;bar(bx,Math.min(bw,end-bx));bx+=bw+16;}
  bx=cx-x+cw+26;for(const bw of [96,140,80]){const end=w-40;if(bx>=end-40)break;bar(bx,Math.min(bw,end-bx));bx+=bw+16;}
  ag_T(ctx,"canoe",cx,by,{w:700,size:44,col:mix(AG.ink,AG.amber,st)});
  if(st>0){ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-6,by-15);ctx.lineTo(cx-6+(cw+12)*ag_sine(st),by-15);ctx.stroke();}
  if(nw>0){ctx.save();ctx.beginPath();ctx.rect(cx-10,y,(cw+40)*ag_sine(nw),by-46-y+8);ctx.clip();ag_T(ctx,"boat",cx+8,by-58,{w:700,size:44,col:[40,52,92]});ctx.restore();
    ctx.strokeStyle="rgba(40,52,92,0.7)";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx+cw/2-14,by-48);ctx.lineTo(cx+cw/2,by-36);ctx.lineTo(cx+cw/2+14,by-48);ctx.stroke();}
  ctx.restore();}
function mc_list(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const n=clamp(o.n==null?1:o.n,0,1),hi=clamp(o.hi||0,0,1),h=470;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=22;ctx.shadowOffsetX=AG.sdx*0.8;ctx.shadowOffsetY=10;ctx.fillStyle="#FBF8F0";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.2;ctx.strokeRect(x,y,w,h);
  const L=[null,null,"a totem",null,"a pilgrimage",null],B=[230,170,0,250,0,150];
  L.forEach((l,i)=>{const u=clamp(n*L.length-i,0,1);if(u<=0)return;const yy=y+70+i*66;ag_T(ctx,String(i+1),x+36,yy,{w:700,size:32,col:[40,52,92],a:u});
    if(l){if(hi>0){ctx.save();ctx.globalAlpha*=u*hi;ctx.fillStyle=rgba(AG.amber,0.16);rr(ctx,x+70,yy-36,ag_tw(ctx,l,{w:700,size:36})+28,50,12);ctx.fill();ctx.restore();}
      ag_T(ctx,l,x+84,yy,{w:700,size:36,col:mix([40,52,92],AG.amber,hi),a:u});}
    else{ctx.fillStyle="rgba(60,56,52,"+(0.16*u)+")";rr(ctx,x+84,yy-16,B[i]*u,14,7);ctx.fill();}});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- Loftus and Palmer's question (chapter 3)
   mc_qcard: the question one half of the room was asked, its verb picked out (o.col: ink for "hit", amber for "smashed"); o.glow
   lights the verb. mc_bar: the half's guess, a bar as long as the speed. */
function mc_qcard(ctx,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a,h=44+lines.length*46+30;if(a<=0.005)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,20,{edge:o.edge||null,edgeA:0.8});
  lines.forEach((l,i)=>{const yy=y+68+i*46,m=l.match(/^(.*)\{(.+)\}(.*)$/);if(!m){ag_T(ctx,l,x+30,yy,{w:600,size:34});return;}
    let xx=x+30;ag_T(ctx,m[1],xx,yy,{w:600,size:34});xx+=ag_tw(ctx,m[1],{w:600,size:34});const vw=ag_tw(ctx,m[2],{w:800,size:34}),col=o.col||AG.ink;
    if(o.glow>0){ctx.save();ctx.globalAlpha*=o.glow;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=24;ctx.fillStyle=rgba(col,0.18);rr(ctx,xx-8,yy-34,vw+16,46,10);ctx.fill();ctx.restore();}
    ag_T(ctx,m[2],xx,yy,{w:800,size:34,col});ctx.fillStyle=rgba(col,0.85);ctx.fillRect(xx,yy+7,vw,3);ag_T(ctx,m[3],xx+vw,yy,{w:600,size:34});});
  ctx.restore();return{x,y,w,h};}
function mc_bar(ctx,x,y,w,label,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const u=clamp(o.u==null?1:o.u,0,1),h=88,col=o.col||AG.ink;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,18,{});ag_T(ctx,label,x+28,y+56,{w:700,size:30,col});const bx=x+28+ag_tw(ctx,label,{w:700,size:30})+22,bw=(w-(bx-x)-150)*v*ag_eo(u);
  ctx.fillStyle=rgba(col,0.35);rr(ctx,bx,y+34,Math.max(1,bw),22,11);ctx.fill();ag_T(ctx,Math.round(lerp(0,o.mph,ag_eo(u)))+" mph",x+w-28,y+56,{w:800,size:30,align:"right",col});
  ctx.restore();}

// a year's record, as a card: o.kickA and o.titleA fade each part, so two cards laid on one another show one's year and the other's
// faculty (a memory joining two years); o.edge, o.a, o.k
function mc_yearCard(ctx,x,y,w,kick,title,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const h=136;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  if(o.box!==false)ag_box(ctx,x,y,w,h,20,{edge:o.edge||AG.blue,edgeA:o.edgeA==null?0.7:o.edgeA});
  ag_T(ctx,kick.toUpperCase(),x+30,y+50,{w:700,size:28,ls:4,col:o.kickCol||AG.blue,a:o.kickA==null?1:o.kickA});
  ag_T(ctx,title,x+30,y+102,{w:800,size:38,col:o.titleCol||AG.ink,a:o.titleA==null?1:o.titleA});ctx.restore();return{x,y,w,h};}

/* ===== Minds that change: the six chapters =====
   Each chapter is cut into shots (ag_shots), each a place under a slow camera; every moment waits for a word of the narration
   (wAt(sc, line, word)), so the pictures stay with the voice if it's recorded again. tools/score.py times its sounds to the same words.
   The opening by the river (Kept by heart) and its return (Every pattern, every time); the university's room for the rest, with
   Cambridge about 1920 and Seattle in 1974 in Ours change too. */

/* ---------------------------------------------------------------- the riverbank's people and what floats over it */
const MC_AT={teacher:[640,600,0.6],boy1:[930,696,0.52],boy2:[1140,716,0.5]};
// the three reciters under the tree: o.pose (the teacher's), o.talk {teacher, boy1, boy2} 0 to 1, o.gaze for the students
function mc_reciters(ctx,t,o){o=o||{};const T=MC_AT,tk=o.talk||{};
  mc_seated(ctx,MC_TEACHER,T.teacher[0],T.teacher[1],T.teacher[2],{t,pose:o.pose||MC_POSE.sit,pose2:o.pose2,mix:o.mix,talk:tk.teacher||0,nod:o.nod||0});
  mc_seated(ctx,MC_BOY1,T.boy1[0],T.boy1[1],T.boy1[2],{t:t+0.7,k:0.94,gaze:o.gaze1||[-3,0],talk:tk.boy1||0,nod:o.nod1||0});
  mc_seated(ctx,MC_BOY2,T.boy2[0],T.boy2[1],T.boy2[2],{t:t+1.9,k:0.94,gaze:o.gaze2||[-3,0],talk:tk.boy2||0,nod:o.nod2||0});}
// a mouth moving while someone recites, from a to b
const mc_recite=(t,a,b)=>t<a||t>b?0:(0.4+0.35*Math.sin(t*15.3)+0.25*Math.sin(t*8.1+1))*sstep(a,a+0.12,t)*(1-sstep(b-0.12,b,t));
// a mouth moving while someone speaks, from a to b
const mc_talkAt=(t,a,b)=>t<a||t>b?0:(0.45+0.3*Math.sin(t*16.1)+0.25*Math.sin(t*9.3+0.5))*sstep(a,a+0.1,t)*(1-sstep(b-0.12,b,t));
// the riverbank at a time of day, and what moves in it
function mc_bank(ctx,t,tod,a){mc_water(ctx,t,tod,a);mc_smoke(ctx,t,tod,a);}
// a line of four tiles, a b c d (or with the slip: a b x d), centred on (x, y): o.slip, o.grey, o.a, o.s, o.lift [per tile], o.k [per tile]
function mc_verse(ctx,x,y,o){o=o||{};const s=o.s||0.8,step=(MC_TILE+6)*s;["a","b","c","d"].forEach((ch,i)=>{const lf=o.lift?o.lift[i]:0,k=o.k?o.k[i]:1;
  mc_tile(ctx,x+(i-1.5)*step,y,ch,{s,a:(o.a==null?1:o.a)*clamp(k*3,0,1),k,slip:i===2?(o.slip||0):0,grey:o.grey||0,lift:lf,rot:i===2?(o.wob||0):0});});}

/* ================================================================ 1 · Kept by heart */
scene("kept",(ctx,S,t,sc)=>{const C=sc.cues,E=sc.ends,br=C.breath,T=MC_AT;
  // when things happen
  const tHymns=wAt(sc,"families","more than a thousand"),tWritten=C.written,tPassed=wAt(sc,"lives","passed"),tStudent=wAt(sc,"lives","student");
  const tChanges=C.changes,tRebuild=wAt(sc,"rebuild","we rebuild it"),tSlip=wAt(sc,"rebuild","a word can slip"),tTaught=C.taught,tGen=wAt(sc,"lose","in a few generations"),tLose=wAt(sc,"lose","lose their hymns");
  const tExact=C.exact,tPat=wAt(sc,"patterns","several patterns"),tW=[wAt(sc,"ways","as it's recited"),wAt(sc,"ways","word by word"),wAt(sc,"ways","in pairs"),wAt(sc,"ways","braided")];
  const tAgree=wAt(sc,"agree","agree"),tSlipped=wAt(sc,"agree","a word that slipped"),tShow=wAt(sc,"agree","would show"),tWorked=C.worked,tLater=C.later,tToday=wAt(sc,"later","Three thousand years later");
  const tUnch=wAt(sc,"later","almost unchanged"),tRec=wAt(sc,"recording","a recording"),tSingle=C.single,tChecked=C.checked,tData=C.data;
  const tFix=E.agree+0.15;
  // where the patterns float, and how they open, slip and agree
  const RX=1350,RY=168,RS=0.84,RDY=92;
  const open=tW.map(w=>ag_in(t,w-0.1,0.7)),slipA=ag_in(t,tSlipped+0.5,0.35)*(1-ag_in(t,tFix,0.45)),thr=ag_in(t,tAgree,2.2);
  const patterns=(ctx,a,o)=>{if(a<=0)return;ctx.save();ctx.globalAlpha*=a;o=o||{};const rows=mc_rows(ctx,RX,RY,{s:RS,dy:RDY,open,tiles:false,labelA:o.labelA});
    mc_threads(ctx,rows,o.thr==null?thr:o.thr,{slip:o.slip==null?slipA:o.slip,s:RS});
    mc_rows(ctx,RX,RY,{s:RS,dy:RDY,open,labelA:0,slip:o.slip==null?slipA:o.slip,glow:o.glow==null?ag_in(t,tAgree+1.8,0.8)*(1-0.6*slipA):o.glow});ctx.restore();return rows;};
  // the teacher's hands stay on his knees: his voice, the line of light and the tiles carry the lesson (hands raised in the air read wrong)
  const pose=MC_POSE.sit;
  const talk={teacher:mc_recite(t,tPassed-0.2,tStudent+0.2)+mc_recite(t,tFix-0.2,tFix+1.2)*0,boy1:mc_recite(t,tStudent+0.3,tStudent+1.6)+mc_recite(t,tSlipped-0.2,tShow+0.4)+mc_recite(t,tFix,tFix+1.4)+mc_recite(t,tLater+3.2,tLater+5),
    boy2:mc_recite(t,tTaught+1.4,tTaught+3.2)+mc_recite(t,tLater+3.2,tLater+5)};
  const people=(ctx,o)=>{o=o||{};mc_reciters(ctx,t,{pose,talk,gaze1:t>tTaught&&t<tGen?[4,0]:[-3,0],nod1:t>tTaught&&t<tGen?0.03:0});};
  const ribbonT=(u,a)=>{const m=mc_mouth(T.teacher[0],T.teacher[1],T.teacher[2]),q=[T.boy1[0]-30,T.boy1[1]-150];mc_ribbon(ctx,[m[0]+10,m[1],m[0]+120,m[1]-90,q[0]-80,q[1]-110,q[0],q[1]-40],0,u,a,4);};

  const shots=[
    // dawn by the river: the place, the Rigveda, its hymns rising through the leaves
    {at:0,place:"mcDawn",keys:[[0,1180,520,1.16],[1.2,1000,540,1.0]],d:6,push:0.02,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");
      mc_rise(ctx,t,[[T.teacher[0]+30,T.teacher[1]-120],[T.boy1[0]+20,T.boy1[1]-110],[T.boy2[0]+20,T.boy2[1]-110]],ag_io(t,tHymns,tWritten+0.6,1.2),34);
      withA(ctx,ag_io(t,wAt(sc,"families","Rigveda"),tWritten+0.4,0.6),()=>mc_tag(ctx,1060,320,"the Rigveda · 1,028 hymns",{k:ag_spr(t,wAt(sc,"families","Rigveda"),0.5)}));}},
    // nothing is written down: a line passed from the teacher to the student, who says it back
    {cut:true,at:tWritten-0.3,place:"mcDawn",keys:[[0,720,600,1.75],[tPassed-0.4,820,600,1.42]],d:2.2,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");
      const u=ag_in(t,tPassed,1.2),back=ag_in(t,tStudent+0.3,1.0);ribbonT(ag_sine(u),ag_io(t,tPassed,tChanges+0.2,0.4));
      if(back>0){const m=mc_mouth(T.boy1[0],T.boy1[1],T.boy1[2]);mc_ribbon(ctx,[m[0]+6,m[1],m[0]+60,m[1]-60,m[0]+40,m[1]-160,m[0]-20,m[1]-210],0,ag_sine(back),0.6*ag_io(t,tStudent+0.3,tChanges+0.3,0.4),3);}
      // memory changes: the line over the student opens into four tiles; they're put back one by one; c slips
      const vx=T.boy1[0]-10,vy=T.boy1[1]-250,op=ag_in(t,tChanges+0.2,0.7);
      if(op>0){const lift=[0,1,2,3].map(i=>Math.sin(Math.PI*ag_in(t,tRebuild+i*0.32,0.5))*26),k=[0,1,2,3].map(i=>ag_spr(t,tChanges+0.2+i*0.12,0.45));
        mc_verse(ctx,vx,vy,{s:0.78,a:op,lift,k,slip:ag_in(t,tSlip+0.25,0.35),wob:Math.sin(t*20)*0.12*ag_io(t,tSlip-0.1,tSlip+0.4,0.15)});}}},
    // taught to a student, the slip becomes the hymn; passed on and on along the bank, while the true verse fades from memory
    {cut:true,at:tTaught-0.2,place:"mcDawn",keys:[[0,1060,560,1.12],[tGen-0.6,1210,520,1.0]],d:2.6,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");
      // the teacher's true verse, fading to grey and gone
      const keepA=1-ag_in(t,tLose+0.2,1.2);mc_verse(ctx,T.teacher[0]+20,T.teacher[1]-250,{s:0.7,a:keepA,grey:ag_in(t,tGen+0.6,2.4)});
      // the slipped verse: over the elder student, then the younger, then the generations along the bank, paler each time
      const gens=[[T.boy1[0]-10,T.boy1[1]-250,0.78],[T.boy2[0],T.boy2[1]-240,0.74],[1440,520,0.56],[1620,500,0.5],[1790,486,0.44]];
      const hop=[tTaught-0.2,tTaught+1.2,tGen+0.2,tGen+1.4,tGen+2.6];let gi=0;for(let i=0;i<gens.length;i++)if(t>=hop[i])gi=i;
      const u=ag_in(t,hop[gi],0.9),A=gens[Math.max(0,gi-1)],B=gens[gi],x=lerp(A[0],B[0],ag_sine(u)),y=lerp(A[1],B[1],ag_sine(u))-Math.sin(Math.PI*u)*60,s=lerp(A[2],B[2],u);
      mc_verse(ctx,x,y,{s,slip:1,a:(1-0.18*gi)*(1-ag_in(t,tLose+0.8,1.0))});
      // the generations: small pairs further along the bank, each a little paler
      [[1420,742,0.3],[1600,730,0.26],[1770,720,0.22]].forEach((p,i)=>{const a=ag_in(t,tGen+i*1.2-0.4,0.8)*(1-ag_in(t,tExact-0.6,0.8))*(0.85-0.18*i);if(a<=0)return;
        withA(ctx,a,()=>{mc_seated(ctx,MC_TEACHER,p[0],p[1],p[2],{t:t+i,talk:mc_recite(t,tGen+i*1.2,tGen+i*1.2+1)});mc_seated(ctx,MC_BOY2,p[0]+110*p[2]/0.3,p[1]+14,p[2]*0.92,{t:t+i+0.5,k:0.94,gaze:[-3,0]});});});}},
    // something had to keep them exact: the patterns, one at a time; the words must agree; a slip shows, and is set right
    {push:0,cut:true,at:tExact-0.3,place:"mcDawn",keys:[[0,960,540,1.0],[tPat-0.6,1010,520,1.06]],d:3,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");patterns(ctx,1);}},
    // it worked: the light moves from dawn to noon to dusk, the tree grows broader, the rows still float over the water
    {at:tWorked-0.1,place:"mcDawn",keys:[[0,1010,520,1.06],[tWorked,960,540,1.0]],d:3.2,push:0,draw(ctx,t){const noon=ag_in(t,tWorked+0.6,3),dusk=ag_in(t,tWorked+4,3.4);
      for(const [k,a] of [["mcNoon",noon*(1-dusk)],["mcDusk",dusk]])if(a>0){ctx.save();ctx.globalAlpha=a;ctx.drawImage(ag_place(k),0,0,W,H);ctx.restore();}
      const tod=dusk>0.5?"dusk":noon>0.5?"noon":"dawn";mc_bank(ctx,t,tod);people(ctx);mc_leaves(ctx,t,tod);
      patterns(ctx,1,{glow:1,slip:0,thr:1});
      withA(ctx,ag_in(t,tUnch,0.8),()=>mc_tag(ctx,RX,RY+3*RDY*RS+92,"the words almost unchanged",{align:"center",col:AG.green,k:ag_spr(t,tUnch,0.5)}));
      // a recording: one steady line of light under the rows
      const rl=ag_in(t,tRec,1.4);if(rl>0){ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle="rgba(255,240,206,"+(0.5*rl)+")";rr(ctx,RX-430*ag_sine(rl),RY+3*RDY*RS+40,860*ag_sine(rl),5,3);ctx.fill();ctx.restore();}}},
    // no single memory was trusted: the teacher, close, and the students listening; the work was checked
    {cut:true,at:tSingle-0.2,place:"mcDusk",keys:[[0,780,560,1.7],[tChecked-0.5,960,540,1.0]],d:2.4,push:0,draw(ctx,t){mc_bank(ctx,t,"dusk");people(ctx);mc_leaves(ctx,t,"dusk");
      withA(ctx,ag_in(t,tChecked+0.4,1.0),()=>patterns(ctx,1,{glow:1,slip:0,thr:1}));}},
    // it's the same with data: dusk, the four rows glowing green over the water; then they fold into one green tick, for the title
    {at:tData-0.2,place:"mcDusk",keys:[[0,960,540,1.0]],d:2,push:0.03,draw(ctx,t){mc_bank(ctx,t,"dusk");people(ctx);mc_leaves(ctx,t,"dusk");
      const fold=ag_in(t,br-0.2,1.0);patterns(ctx,1-fold,{glow:1,slip:0,thr:1});
      if(fold>0){const k=ag_spr(t,br+0.2,0.5);withA(ctx,fold*(1-ag_in(t,br+1.6,0.6)),()=>{glow(ctx,RX,RY+140,120*k,[110,190,140],0.5);ag_tick(ctx,RX,RY+140,90*k,rgba(AG.green,1),12);});}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  // the place and the time, in the corner; "today" once three thousand years have passed
  const tagA=ag_in(t,C.place-0.2,0.8)*(1-ag_in(t,tToday-0.3,0.4))*(1-ag_in(t,br-0.4,0.5));
  withA(ctx,tagA,()=>mc_tag(ctx,96,100,"Northern India · about 3,000 years ago"));
  withA(ctx,ag_in(t,tToday,0.5)*(1-ag_in(t,tSingle-0.4,0.4)),()=>mc_tag(ctx,96,100,"today",{k:ag_spr(t,tToday,0.5)}));
  ag_title(ctx,S,t,br+0.6,"Minds that change","the agent's, and ours","FILM 5 OF 9 · WHAT AN AGENT IS");});

/* ---------------------------------------------------------------- the university's room
   One room for chapters 2 to 6 (mcLab): the agent in its ring in the middle; Jun at his desk on the left, facing it; Clara standing
   on the right, facing it; her draft on the wall at the top right; the answers come out of the agent between them. */
const MC_AG=[960,330],MC_JUN=[250,720,0.76],MC_CL=[1660,700,0.78],MC_PAPER=[1420,130],MC_CUT=890;
// Cambridge: the row of retellings on the desk between Bartlett and the woman: where each page stands (the folk tale first, at s0 of
// its size), how tall each retelling is, its grey lines, and when it comes after "again and again" (the first two) or "over years"
const MC_ROW={x:[600,818,996,1174],base:770,s0:0.76,h:[210,165,120],n:[7,5,3],at:[-0.1,0.5,0.15]};
const MC_JMOUTH=[MC_JUN[0]+70*MC_JUN[2],MC_JUN[1]-112*MC_JUN[2]],MC_CMOUTH=[MC_CL[0]-70*MC_CL[2],MC_CL[1]-112*MC_CL[2]];
// Jun at his desk: the desk, Jun cut at its back edge, his screen (o.screen draws on it); o as ag_person's, o.a, o.dx moves them all
function mc_jun(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const J=MC_JUN;ctx.save();ctx.globalAlpha*=a;if(o.dx)ctx.translate(o.dx,0);
  ag_desk(ctx,-60,1040,720,{depth:150});
  ag_person(ctx,"jun",J[0],J[1],J[2],{t,talk:o.talk||0,gaze:o.gaze,nod:o.nod||0,smile:o.smile||0,cut:MC_CUT});
  ag_screen(ctx,430,770,190,116,{stand:12,draw:o.screen});ctx.restore();}
// Clara standing on the right, facing the agent: o.x where she stands, o.walk (0 to 1) a step's bob as she comes in, o.a; her arms
// stay down
function mc_clara(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const C=MC_CL,x=o.x==null?C[0]:o.x,bob=(o.walk||0)*Math.abs(Math.sin(t*5.4))*7;
  ctx.save();ctx.globalAlpha*=a;ag_person(ctx,"clara",x,C[1]-bob,C[2],{t,flip:true,talk:o.talk||0,gaze:o.gaze,nod:o.nod||0,smile:o.smile||0});ctx.restore();}
// Clara walking in from the right edge, from t0 over d seconds: where she is, and how much she bobs
const mc_walkIn=(t,t0,d)=>{const u=ag_in(t,t0,d||1.5);return{x:lerp(2180,MC_CL[0],ag_eo(u)),walk:u>0&&u<1?1-u:0,a:t<t0?0:1};};
// the agent's three answers, the same shape and the same type
const MC_A1={title:"Engineering and IT · 131"},MC_A2={title:"Health · 126",source:"source: the university's 2025 retention review"},
  MC_A3={sorry:"Sorry, you're right to check.",title:"Business · 140"};
// the three side by side, over the floor: each card's left edge, at y 470
function mc_lineup(ctx){const ws=[MC_A1,MC_A2,MC_A3].map(o=>mc_answerW(ctx,o)),g=40,tot=ws[0]+ws[1]+ws[2]+2*g,x0=960-tot/2;return[x0,x0+ws[0]+g,x0+ws[0]+ws[1]+2*g];}
// a pale veil over the room, so the cards in front stand out
const mc_hush=(ctx,a)=>{if(a<=0)return;ctx.fillStyle="rgba(242,240,236,"+a+")";ctx.fillRect(0,0,W,H);};

/* ================================================================ 2 · Three answers */
scene("three",(ctx,S,t,sc)=>{const C=sc.cues;
  const tWrite=wAt(sc,"paper","is writing"),tAdv=wAt(sc,"paper","two new advisers"),tGo=wAt(sc,"paper","should go"),tLost=wAt(sc,"needs","lost the most");
  const tMon=C.monday,tAsks=wAt(sc,"monday","asks"),tEng=wAt(sc,"science","Engineering"),tTue=C.tuesday,tHerself=wAt(sc,"tuesday","herself"),tNew=wAt(sc,"tuesday","in a new chat");
  const tHealth=wAt(sc,"health","Health"),tRev=wAt(sc,"health","as the university's"),tFits=C.fits,tLast=C.last,tBut=C.but,tJuns=wAt(sc,"but","Jun's answer");
  const tSure=wAt(sc,"sure","are you sure"),tApol=wAt(sc,"third","apologises"),tBus=wAt(sc,"third","Business"),tEach=C.each,tNone=wAt(sc,"each","none says"),tRevw=C.review,tNo=wAt(sc,"review","there's no");
  // the agent: idle until Monday; it turns once as it answers; a new chat on Tuesday clears it
  const agent=ctx=>mc_agent(ctx,MC_AG[0],MC_AG[1],{t,core:t<tMon?0.35:0.8,clear:ag_io(t,tNew-0.1,tNew+1.1,0.4),
    spin:t<tTue?ag_in(t,tAsks+1.0,tEng-tAsks-1.1):t<tSure?ag_in(t,tHerself+1.0,tHealth-tHerself-1.1):ag_in(t,tSure+0.4,tBus-tSure-0.5),
    think:ag_io(t,tAsks+0.8,tEng,0.3)+ag_io(t,tHerself+0.8,tHealth,0.3)+ag_io(t,tSure+0.3,tBus,0.3),label:null});
  // its name, until the second answer moves up over it
  const agentName=ctx=>ag_T(ctx,"Agent",MC_AG[0],MC_AG[1]+118,{w:700,size:28,align:"center",col:AG.label,a:1-ag_in(t,tApol,0.4)});
  // the cards: where each is, and when it comes out
  const L=mc_lineup(ctx),line=ag_in(t,tEach-0.1,1.6),cx=o=>960-mc_answerW(ctx,o)/2,go=(a,b,u)=>[lerp(a[0],b[0],ag_sine(u)),lerp(a[1],b[1],ag_sine(u))];
  let p1=go([cx(MC_A1),540],[280,130],ag_in(t,tTue+0.3,1.4));p1=go(p1,[L[0],470],line);
  // the second answer moves up and back as the third comes, so the third covers none of its words
  let p2=go([cx(MC_A2),540],[cx(MC_A2)-70,440],ag_in(t,tApol,0.9));p2=go(p2,[L[1],470],line);
  const p3=go([cx(MC_A3)+130,612],[L[2],470],line);
  const slot=ag_io(t,tNone-0.1,tNone+1.6,0.5)*Math.sin(Math.PI*clamp((t-tNone)/1.2,0,1));
  const cards=ctx=>{const kx=MC_AG[0],ky=MC_AG[1],jp=ag_io(t,tJuns-0.2,tSure,0.4);
    mc_answer(ctx,p1[0],p1[1],Object.assign({a:ag_in(t,tEng-0.25,0.35)*(1-0.65*ag_io(t,tFits-0.5,tJuns-0.2,1.0)),k:t<tEng+1?ag_spr(t,tEng-0.25,0.5):1+0.06*jp,kx:t<tEng+1?kx:null,ky:t<tEng+1?ky:null,edge:jp>0.05?AG.violet:null,edgeA:jp,pulse:slot},MC_A1));
    mc_answer(ctx,p2[0],p2[1],Object.assign({a:ag_in(t,tHealth-0.2,0.35)*(1-0.25*ag_io(t,tApol,tEach,0.6)),k:ag_spr(t,tHealth-0.2,0.5),kx,ky,srcA:ag_in(t,tRev,0.8),false:ag_in(t,tNo+1.0,0.7),pulse:slot},MC_A2));
    mc_answer(ctx,p3[0],p3[1],Object.assign({a:ag_in(t,tBus-0.35,0.35),k:ag_spr(t,tBus-0.35,0.5),kx,ky,pulse:slot},MC_A3));};
  // Jun asks on Monday; Clara on Tuesday, and then "Are you sure?"; her memory of last year
  const words=ctx=>{
    mc_bubble(ctx,110,330,620,"Which faculty lost the most first-years this semester?",MC_JMOUTH[0]+8,MC_JMOUTH[1]-26,{a:ag_io(t,tAsks-0.1,tEng+0.3,0.35),k:ag_spr(t,tAsks-0.1,0.5),at:0.3});
    mc_bubble(ctx,1080,420,430,"Which faculty lost the most first-years this semester?",MC_CMOUTH[0]-8,MC_CMOUTH[1]-26,{a:ag_io(t,tHerself-0.1,tHealth-0.25,0.3),k:ag_spr(t,tHerself-0.1,0.5),at:0.85});
    mc_memory(ctx,1110,394,"last year: Health",{a:ag_io(t,tFits+0.1,tBut+0.4,0.5),k:ag_spr(t,tFits+0.1,0.6),tail:[MC_CMOUTH[0]-30,MC_CMOUTH[1]-110]});
    mc_bubble(ctx,1150,410,330,"Are you sure?",MC_CMOUTH[0]-8,MC_CMOUTH[1]-26,{a:ag_io(t,tSure-0.15,tBus+0.5,0.3),k:ag_spr(t,tSure-0.15,0.5),at:0.8});};
  // the day, top right
  const day=ctx=>{ag_kicker(ctx,"1.5","Minds that change",{a:ag_in(t,0.2,0.8)});
    mc_corner(ctx,"Today",ag_io(t,C.today-0.3,tMon-0.5,0.5));mc_corner(ctx,"Monday",ag_io(t,tMon-0.1,tTue-0.3,0.4));mc_corner(ctx,"Tuesday",ag_in(t,tTue-0.1,0.4)*(1-ag_in(t,tEach-0.2,0.6)));};
  // Clara's people: Jun at his desk, who asks on Monday; Clara on Tuesday, who nods at her memory
  const jun=ctx=>mc_jun(ctx,t,{talk:mc_talkAt(t,tAsks,tAsks+1.6),gaze:t>tTue+0.3&&t<tJuns?[-2,-3]:null});
  const shots=[
    // today: Clara comes in and pins her draft to the wall: two new advisers, and where they go is still blank
    {at:0,place:"mcLab",keys:[[0,1400,430,1.34]],push:0.03,draw(ctx,t){agent(ctx);agentName(ctx);jun(ctx);
      const w=mc_walkIn(t,C.today-0.6,1.6);mc_clara(ctx,t,{x:w.x,walk:w.walk,a:w.a});
      ag_roomLight(ctx,1);const pu=ag_in(t,tWrite-0.1,0.9),px=lerp(1330,MC_PAPER[0],ag_sine(pu)),py=lerp(560,MC_PAPER[1],ag_sine(pu));
      mc_deco(pu<0.97,()=>mc_draft(ctx,px,py,{a:ag_in(t,tWrite-0.1,0.25),k:lerp(0.35,1,ag_sine(pu)),glow:ag_io(t,tGo-0.2,tMon,0.5)+ag_io(t,tLost-0.1,tMon,0.5)}));}},
    // Monday and Tuesday: Jun asks, then Clara; three answers, the same shape and type; a library search for the review comes back empty
    {cut:true,at:tMon-0.4,place:"mcLab",keys:[[0,960,540,1.0],[tFits-0.6,1300,480,1.26],[tJuns-0.6,960,540,1.0]],d:1.6,push:0.015,draw(ctx,t){agent(ctx);agentName(ctx);jun(ctx);
      const w=mc_walkIn(t,tHerself-1.7,1.5);mc_clara(ctx,t,{x:w.x,walk:w.walk,a:w.a,
        talk:mc_talkAt(t,tHerself,tHerself+1.6)+mc_talkAt(t,tSure,tSure+0.7),nod:Math.sin(clamp((t-tLast)/0.9,0,1)*TAU)*0.05*(t>tLast&&t<tLast+0.9?1:0),gaze:t>tJuns-0.3&&t<tSure-0.2?[-4,-1]:null,smile:ag_io(t,tFits,tBut,0.5)*0.6});
      ag_roomLight(ctx,1);mc_draft(ctx,MC_PAPER[0],MC_PAPER[1],{hint:1});
      mc_hush(ctx,0.66*ag_in(t,tEach-0.2,1.0));cards(ctx);words(ctx);
      // Jun's library search: it comes out of his screen, the words typed, and nothing comes back
      const sa=ag_in(t,tRevw-0.3,0.6);if(sa>0){const k=ag_spr(t,tRevw-0.3,0.6),x=lerp(430,650,k),y=lerp(770,140,k),w2=lerp(190,620,k),h2=lerp(116,230,k);
        ag_screen(ctx,x,y,w2,h2,{a:sa,draw:(c,x0,y0,ww,hh)=>{c.save();c.translate(x0,y0);c.scale(ww/620,hh/230);mc_screenSearch(c,0,0,620,230,{typed:ag_in(t,tRevw+0.2,1.0),res:ag_in(t,tNo+0.5,0.4),t});c.restore();}});}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);day(ctx);});

/* ================================================================ 3 · Ours change too */
scene("ours",(ctx,S,t,sc)=>{const C=sc.cues;
  const tMakes=wAt(sc,"easy","makes things up"),tToo=C.too,tOwn=C.own,tPaperL=wAt(sc,"own","paper from last year"),tNot=wAt(sc,"own","not Health"),tBefore=C.before,tJoined=C.joined,tTwo=wAt(sc,"joined","two years into one"),tSureOf=wAt(sc,"joined","sure of it");
  const tCent=C.century,tBart=wAt(sc,"century","Frederic Bartlett"),tRetell=wAt(sc,"century","retell"),tAgain=wAt(sc,"far","again and again"),tYears=wAt(sc,"far","over years");
  const tShorter=C.shorter,tShortW=wAt(sc,"shorter","shorter"),tWorld=wAt(sc,"shorter","their own world"),tCanoe=wAt(sc,"shorter","a canoe became"),tBoat=wAt(sc,"shorter","a boat"),tAdded=C.added,tTotem=wAt(sc,"added","a totem"),tPilg=wAt(sc,"added","a pilgrimage"),tNeither=wAt(sc,"surest","Neither was in the story"),tSurest=wAt(sc,"surest","surest");
  const tSea=C.seattle,tShowed=wAt(sc,"seattle","showed students"),tHitW=wAt(sc,"hit","hit each other"),tSmW=wAt(sc,"smashed","smashed"),tFaster=C.faster,tWeek=wAt(sc,"glass","A week later"),tBroken=wAt(sc,"glass","broken glass"),tNone=C.none,tQ=C.question;
  // Clara's two years: last year's record and the year before's, laid on one another so her memory's two halves show (amber), then apart
  const join=ag_in(t,tTwo-0.3,0.9)*(1-ag_in(t,tSureOf+0.7,1.0)),laugh=ag_in(t,tSureOf+0.9,0.6);
  const shots=[
    // it's easy to say the agent makes things up: Tuesday's answer, its source struck; our memories do it too: Clara's memory, her papers
    // it opens as Three answers ended (the same camera, Tuesday's answer still in the line), then closes in on it
    {at:0,place:"mcLab",keys:[[0,960,540,1.015],[0.6,960,500,1.2],[tToo-0.2,1300,470,1.3]],d:1.8,push:0.02,draw(ctx,t){
      // no name for the agent here: Three answers ended without it, and last year's record will cover where it goes
      mc_agent(ctx,MC_AG[0],MC_AG[1],{t,core:0.6,label:null});mc_jun(ctx,t,{});
      mc_clara(ctx,t,{smile:laugh,nod:laugh>0?Math.sin((t-tSureOf-0.9)*7)*0.03*(1-ag_in(t,tSureOf+2,0.8)):0,gaze:t>tPaperL&&t<tCent?[-5,1]:null});
      ag_roomLight(ctx,1);mc_draft(ctx,MC_PAPER[0],MC_PAPER[1],{});
      const w2=mc_answerW(ctx,MC_A2),mv=ag_sine(ag_in(t,0.2,1.6));mc_answer(ctx,lerp(mc_lineup(ctx)[1],960-w2/2,mv),lerp(470,540,mv),Object.assign({a:1-ag_in(t,tToo-0.4,0.8),false:1},MC_A2));
      // her memory, rising again; then the two records under it
      mc_memory(ctx,1110,300,"last year: Health",{a:ag_in(t,tToo+0.2,0.6),k:ag_spr(t,tToo+0.2,0.6),tail:[MC_CMOUTH[0]-30,MC_CMOUTH[1]-110]});
      const y1=lerp(430,520,ag_sine(join)),y2=lerp(600,520,ag_sine(join)),a1=ag_in(t,tPaperL-0.1,0.5),a2=ag_in(t,tBefore-0.1,0.5),edge=join>0.3?AG.amber:AG.blue;
      mc_yearCard(ctx,880,y2,480,"the year before","Health",{a:a2,k:ag_spr(t,tBefore-0.1,0.5),kickA:1-join,edge,titleCol:mix(AG.ink,AG.amber,join)});
      mc_yearCard(ctx,880,y1,480,"last year","Engineering and IT",{a:a1,k:ag_spr(t,tPaperL-0.1,0.5),titleA:1-join,box:join<0.5,edge,kickCol:mix(AG.blue,AG.amber,join)});
    }},
    // Cambridge, about 1920: Bartlett hands a page across the desk; she retells it, again and again: her retellings stand in a row
    // between them, each shorter (a dashed amber line falls along their tops); then one line of the last, close: a canoe became a boat
    {at:tCent-0.4,place:"mcCambridge",keys:[[0,960,560,1.14],[tShorter-0.3,960,520,1.2]],d:1.6,push:0.03,draw(ctx,t){
      ag_person(ctx,MC_BARTLETT,430,560,0.8,{t,cut:750,talk:mc_talkAt(t,tRetell-0.3,tRetell+0.9)});
      ag_person(ctx,MC_WOMAN,1490,570,0.78,{t:t+1,flip:true,cut:750,gaze:[0,3]});
      mc_desk1920(ctx,220,1700,830,{});
      const X=MC_ROW.x,B=MC_ROW.base,hand=ag_in(t,tRetell,1.2),row=ag_sine(ag_in(t,tAgain-0.6,1.0)),s0=lerp(1,MC_ROW.s0,row);
      // the folk tale's page: from his side of the desk to hers, then back to the head of the row, smaller
      withA(ctx,ag_in(t,tBart,0.6),()=>{ctx.save();ctx.translate(lerp(lerp(540,1110,ag_sine(hand)),X[0],row),B-330*s0);ctx.scale(s0,s0);
        mc_paper(ctx,0,0,250,330,{title:"The War of the Ghosts",lines:8,rot:lerp(lerp(-0.05,0.04,hand),-0.02,row),seed:5});ctx.restore();});
      // her retellings, each from her side of the desk to its place; the last one's first line ringed once it shows up close
      const ring=ag_in(t,tWorld-0.5,0.4);
      MC_ROW.at.forEach((d,i)=>{const t0=(i<2?tAgain:tYears)+d,a=ag_in(t,t0,0.4);if(a<=0)return;const k=ag_spr(t,t0,0.5),h=MC_ROW.h[i];
        mc_paper(ctx,lerp(1300,X[i+1],ag_sine(ag_in(t,t0,0.7))),B-h,150,h,{lines:MC_ROW.n[i],a,rot:(i%2?0.03:-0.03)*k,seed:11+i,
          draw:i===2&&ring>0?(c,w)=>{c.save();c.globalAlpha*=ring;c.strokeStyle=rgba(AG.amber,0.9);c.lineWidth=3;rr(c,18,62,w-36,28,9);c.stroke();c.restore();}:null});});
      // shorter: a dashed amber line falls along the tops, from the folk tale to the last retelling
      const fall=ag_in(t,tShortW-0.3,0.9);if(fall>0){const x0=X[0]+95,y0=B-330*MC_ROW.s0-24,x1=X[3]+75,y1=B-MC_ROW.h[2]-24,u=ag_sine(fall),xe=lerp(x0,x1,u),ye=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0);
        // drawn twice, a pale halo under the amber, so it shows on the dark panelling
        ctx.save();ctx.globalAlpha*=1-0.45*ag_in(t,tWorld,0.6);ctx.lineCap="round";ctx.lineJoin="round";
        for(const [col,lw,dash] of [["rgba(252,246,234,0.5)",8,[]],[rgba(AG.amber,0.95),3.5,[10,9]]]){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
          if(u>0.12){ctx.save();ctx.globalAlpha*=clamp((u-0.12)/0.15,0,1);ctx.beginPath();ctx.moveTo(xe-16*Math.cos(an-0.5),ye-16*Math.sin(an-0.5));ctx.lineTo(xe,ye);ctx.lineTo(xe-16*Math.cos(an+0.5),ye-16*Math.sin(an+0.5));ctx.stroke();ctx.restore();}}ctx.restore();}
      // the ringed line, close: it rises out of the last retelling to the wall between them, as wide as the row
      const up=ag_in(t,tWorld-0.15,0.7);if(up>0){const u=ag_eo(up),cx=lerp(X[3]+75,962,u),cy=lerp(B-MC_ROW.h[2]+76,290,u),zs=lerp(0.12,1,u);
        mc_deco(up<0.97,()=>{ctx.save();ctx.translate(cx,cy);ctx.scale(zs,zs);ctx.translate(-962,-290);
          mc_strip(ctx,602,190,720,{a:ag_in(t,tWorld-0.15,0.25),strike:ag_in(t,tCanoe+0.5,0.6),boat:ag_in(t,tBoat-0.1,0.9)});ctx.restore();});}
    }},
    // six and a half years on: the man writes his retelling as a numbered list; two lines weren't in the story, and he's surest of them
    {cut:true,at:tAdded-0.4,place:"mcCambridge",keys:[[0,860,520,1.18]],push:0.03,draw(ctx,t){
      ag_person(ctx,MC_MAN2,420,560,0.8,{t,cut:750,gaze:[3,2],smile:ag_in(t,tSurest,0.8)*0.6,nod:ag_in(t,tSurest,0.6)*0.04});
      mc_desk1920(ctx,120,1260,830,{});
      // his list stands on the desk (its foot at the row's base, as the retellings did)
      const LY=MC_ROW.base-470;
      mc_list(ctx,760,LY,380,{n:ag_in(t,tAdded,2.6),hi:ag_in(t,tPilg+0.6,0.6),a:ag_in(t,tAdded-0.2,0.4),k:ag_spr(t,tAdded-0.2,0.5)});
      // a bracket by the two amber lines, and the tags: not in the story; most certain
      const br=ag_in(t,tNeither,0.6);if(br>0){ctx.save();ctx.strokeStyle=rgba(AG.amber,0.9*br);ctx.lineWidth=4;ctx.lineCap="round";const bx=1160,y0=LY+70+2*66-30,y1=LY+70+4*66+10;
        ctx.beginPath();ctx.moveTo(bx,y0);ctx.lineTo(bx+16,y0);ctx.lineTo(bx+16,y1);ctx.lineTo(bx,y1);ctx.moveTo(bx+16,(y0+y1)/2);ctx.lineTo(bx+34,(y0+y1)/2);ctx.stroke();ctx.restore();}
      mc_tag(ctx,1200,LY+70+3*66-40,"not in the story",{a:br,col:AG.amber,k:ag_spr(t,tNeither,0.5)});
      mc_tag(ctx,1200,LY+70+3*66+34,"most certain",{a:ag_in(t,tSurest,0.5),k:ag_spr(t,tSurest,0.5)});
    }},
    // Seattle, 1974: a film of two cars meeting; half the room asked "hit", half "smashed"; their guesses; a week later, broken glass
    {at:tSea-0.4,place:"mcSeattle",keys:[[0,960,520,1.04],[tNone-0.5,960,330,2.0],[tQ+0.2,960,520,1.04]],d:1.5,push:0.02,draw(ctx,t){
      const run=ag_in(t,tShowed-0.6,0.6),u=((t-tShowed)%3.2)/2.2;mc_crash(ctx,566,104,788,436,t<tShowed?0:t>tNone-1?1:clamp(u,0,1));
      mc_projector(ctx,960,742,t,run);mc_students(ctx,t,1);
      const L=ag_in(t,tHitW-0.6,0.5),R=ag_in(t,tSmW-0.4,0.5),ql=1-ag_io(t,tNone-0.7,tQ+1.1,0.5),glass=ag_in(t,tBroken-0.2,0.5);
      mc_qcard(ctx,40,140,500,["About how fast were the","cars going when they","{hit} each other?"],{a:L*ql,k:ag_spr(t,tHitW-0.6,0.5)});
      mc_qcard(ctx,1380,140,500,["... going when they","{smashed} into","each other?"],{a:R*ql,k:ag_spr(t,tSmW-0.4,0.5),col:AG.amber,glow:ag_in(t,tQ+0.6,0.8)});
      mc_bar(ctx,40,410,500,"hit",34/41,{a:ag_in(t,tFaster-0.2,0.4)*ql,u:ag_in(t,tFaster,1.0),mph:34});
      mc_bar(ctx,1380,410,500,"smashed",1,{a:ag_in(t,tFaster-0.2,0.4)*ql,u:ag_in(t,tFaster,1.0),mph:41,col:AG.amber});
      // a week later: did you see any broken glass?
      ag_textCard(ctx,640,170,640,{kick:"a week later",title:"Did you see any broken glass?"},{a:ag_io(t,tWeek-0.2,tNone-0.4,0.4),k:ag_spr(t,tWeek-0.2,0.5)});
      ag_pill(ctx,290,560,"yes · 7 of 50",{a:glass*ql});ag_pill(ctx,1630,560,"yes · 16 of 50",{a:glass*ql,col:AG.amber});
    }}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  // the kicker in the room; the place and the time in the corner elsewhere
  ag_kicker(ctx,"1.5","Minds that change",{a:1-ag_in(t,tCent-0.6,0.5)});
  withA(ctx,ag_in(t,tCent-0.2,0.6)*(1-ag_in(t,tAdded-0.6,0.4)),()=>mc_tag(ctx,96,100,"Cambridge · about 1920"));
  withA(ctx,ag_in(t,tAdded-0.2,0.6)*(1-ag_in(t,tSea-0.6,0.4)),()=>mc_tag(ctx,96,100,"Cambridge · six and a half years later"));
  withA(ctx,ag_in(t,tSea-0.2,0.6)*(1-ag_io(t,tNone-0.7,tQ+0.4,0.5)),()=>mc_tag(ctx,96,100,"Seattle · 1974"));});

/* ================================================================ 4 · Rebuilt, not replayed */
// the agent's two answers to one question, word by word: each word taken from a small stack of likely ones, the top one
const MC_LINE1=[["Health","Business","Engineering"],["lost","had","kept"],["the","its","a"],["most","more","fewest"]],
  MC_LINE2=[["Engineering and IT","Health","Business"],["lost","had","saw"],["the","its","a"],["most","more","fewest"]],
  MC_GAP=[["university's 2025 retention review","data platform's","student system's"]];
const MC_Q="Which faculty lost the most first-years this semester?";
// a line of words at (x, y), each taken from its stack at ts[i]; returns where the line ends
function mc_written(ctx,x,y,line,ts,t,o){o=o||{};let xx=x;line.forEach((st,i)=>{mc_pick(ctx,xx,y,st,t,ts[i],o);xx+=ag_tw(ctx,st[0],{w:700,size:34})+22;});return xx;}
scene("rebuilt",(ctx,S,t,sc)=>{const C=sc.cues;
  const tFew=wAt(sc,"details","a few details"),tFill=wAt(sc,"details","fill the rest"),tModel=C.model,tOne=wAt(sc,"writes","one at a time"),tNewc=wAt(sc,"again","in a new chat"),tRoute=wAt(sc,"again","another route");
  const tNeither=wAt(sc,"gap","Where neither knows"),tLikely=wAt(sc,"gap","something likely"),tSure=wAt(sc,"gap","as sure as a fact"),tBend=C.bend,tStudy=C.study,tAsked=wAt(sc,"study","are you sure"),tHalf=wAt(sc,"study","almost half");
  const tLying=C.lying,tTrouble=C.trouble,tReason=wAt(sc,"reason","the reason");
  // the head on the left; the agent up on the right, and under it the page it writes on: one line, and a second for the gap
  const HX=420,HY=470,AX=1500,AY=226,PX=900,PW=880,LX=PX+56,LY=598,LY2=788,PY=LY-190;
  const ts1=[0,1,2,3].map(i=>tOne-0.1+i*0.75),ts2=[0,1,2,3].map(i=>tRoute-0.2+i*0.75),tsG=[tLikely+0.2];
  // the question, as it's given: a bubble that goes into the ring, once, and again in the new chat
  const qs=[[tModel+0.6,tOne-1.3],[tNewc+0.15,tRoute-0.75]];
  const shots=[{at:0,place:"mcLab",keys:[[0,520,470,1.42],[tModel-0.5,960,500,1.0],[tReason-0.8,960,540,1.0]],d:2.2,push:0.015,draw(ctx,t){
    const page=ag_in(t,tOne-1.0,0.5)*(1-ag_in(t,tBend-0.4,0.6)),grow=ag_sine(ag_in(t,tNeither-0.3,0.6));
    // the agent: answers once; a new chat empties it, and the second time its light goes round the other way
    const home=ag_sine(ag_in(t,tTrouble,1.6));  // as the three answers come back, the agent goes back to its place in the room
    mc_agent(ctx,lerp(AX,MC_AG[0],home),lerp(AY,MC_AG[1],home),{t,a:ag_in(t,tModel-0.4,0.8),core:0.7,clear:ag_io(t,tNewc-0.1,tNewc+0.9,0.3),
      think:ag_io(t,tOne-0.5,ts1[3]+0.4,0.3)+ag_io(t,tRoute-0.4,ts2[3]+0.4,0.3)+ag_io(t,tLikely-0.2,tsG[0]+0.5,0.3),
      spin:t<tNewc?ag_in(t,tOne-0.6,3.2):ag_in(t,tRoute-0.5,2.8),dir:t<tNewc?1:-1});
    ag_roomLight(ctx,1);
    // a head of light: a few details, the rest filled in; a gap, filled with something likely, as bright as the rest; it leans to the question too
    const sure=ag_in(t,tSure,0.8),lean=ag_in(t,tBend+0.5,0.6)*(1-ag_in(t,tLying-0.6,1.0));
    ctx.save();ctx.translate(HX,HY+230);ctx.rotate(0.05*ag_sine(lean));ctx.translate(-HX,-(HY+230));
    mc_head(ctx,HX,HY,0.95,{a:ag_in(t,0.4,1.0)*(1-0.75*ag_in(t,tTrouble-0.4,1.2)),pts:ag_in(t,tFew-0.1,1.4),fill:ag_in(t,tFill,2.4),gap:ag_in(t,tNeither,0.8),likely:ag_in(t,tLikely+0.2,1.0),sure});
    ctx.restore();
    // the page the agent writes on
    if(page>0){withA(ctx,page,()=>{ag_box(ctx,PX,PY,PW,lerp(LY+58,LY2+58,grow)-PY,26,{});
      // the first line; in a new chat it goes, and another comes; then a gap after "as the", filled with something likely
      const l1=1-ag_in(t,tNewc-0.2,0.5);if(l1>0)withA(ctx,l1,()=>mc_written(ctx,LX,LY,MC_LINE1,ts1,t));
      if(t>tNewc){mc_written(ctx,LX,LY,MC_LINE2,ts2,t);
        const g=ag_in(t,tNeither,0.5);if(g>0)withA(ctx,g,()=>{ag_T(ctx,"as the",LX,LY2,{w:700,size:34,col:AG.violet});
          const bx=LX+ag_tw(ctx,"as the",{w:700,size:34})+22,fl=ag_in(t,tsG[0],0.3);
          if(fl<1){ctx.save();ctx.globalAlpha*=1-fl;ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(AG.mut,0.75);ctx.lineWidth=2.4;rr(ctx,bx-14,LY2-33,330,46,12);ctx.stroke();ctx.restore();}
          mc_written(ctx,bx,LY2,MC_GAP,tsG,t,{a:lerp(0.6,1,sure)});});}});}
    // the question goes in
    qs.forEach(([q0,q1])=>{const a=ag_in(t,q0,0.35)*(1-ag_in(t,q1,0.45));if(a<=0)return;const g=ag_sine(ag_in(t,q1,0.45)),px=AX-160,py=AY;
      ctx.save();ag_about(ctx,px,py,1-0.5*g);mc_bubble(ctx,690,AY-70,600,MC_Q,px,py,{a,k:ag_spr(t,q0,0.5),side:"right",at:0.5});ctx.restore();});
    // both bend to the question: "Are you sure?" leans on an answer until it turns over
    const ca=ag_io(t,tBend-0.3,tLying-0.2,0.5),bub=ag_io(t,tBend+0.1,tAsked+0.6,0.4),push=ag_in(t,tBend+0.5,0.6),turn=ag_in(t,tBend+1.0,0.9);
    if(ca>0){const w=Math.max(mc_answerW(ctx,MC_A1),mc_answerW(ctx,MC_A3)),x0=AX-w/2,y0=470;
      ctx.save();ctx.translate(x0,y0+60);ctx.rotate(0.035*push*(1-turn));ctx.translate(-x0,-(y0+60));
      mc_answer(ctx,x0,y0,Object.assign({a:ca,w,turn,back:MC_A3},MC_A1));ctx.restore();
      mc_bubble(ctx,x0-350+24*push*(1-turn),y0+10,320,"Are you sure?",x0+12,y0+60,{a:bub,k:ag_spr(t,tBend+0.1,0.5),side:"right",at:0.5});}
    // the 2023 study
    ag_textCard(ctx,690,110,560,{kick:"2023 study",title:"asked “Are you sure?”",sub:"answers changed 46% of the time"},{a:ag_io(t,tStudy+0.2,tLying,0.5),k:ag_spr(t,tStudy+0.2,0.5),edge:AG.blue,kickCol:AG.blue});
    // a change we can't see the reason for: the three answers again, their slots empty, pulsing once
    const ra=ag_in(t,tTrouble+0.6,0.8),L=mc_lineup(ctx),pl=Math.sin(Math.PI*clamp((t-tReason)/1.4,0,1));
    [MC_A1,MC_A2,MC_A3].forEach((o,i)=>mc_answer(ctx,L[i],600,Object.assign({a:ra,k:ag_spr(t,tTrouble+0.6+i*0.15,0.5),pulse:pl,false:i===1?1:0},o)));}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);ag_kicker(ctx,"1.5","Minds that change",{a:ag_in(t,0.3,0.8)});});

/* ================================================================ 5 · Check the work */
// the two routes to the number, read only, either side of the agent; Jun and Clara a little further out, to leave them room
const MC_R1=[290,530,520],MC_R2=[1110,530,520],MC_JDX=-60,MC_CX=1760,MC_CY=738,MC_VY=595,MC_REC=[120,150,560],MC_ANX=1140,MC_ANY=128;
scene("check",(ctx,S,t,sc)=>{const C=sc.cues;
  const tInstead=C.instead,tCame=wAt(sc,"shows","where it came from"),tQuery=wAt(sc,"shows","the query"),tRows=wAt(sc,"shows","the rows"),tLYP=wAt(sc,"shows","last year's paper");
  const tSecond=wAt(sc,"second","a second way"),tPat=wAt(sc,"second","reciters' patterns"),tPlat=wAt(sc,"counts","data platform"),tSys=wAt(sc,"counts","student system");
  const t134=wAt(sc,"disagree","a hundred and thirty-four"),t131=wAt(sc,"disagree","a hundred and thirty-one"),tTwice=wAt(sc,"twice","counted twice"),tSays=wAt(sc,"says","says so");
  const tFixed=wAt(sc,"fixed","fixed"),tBoth=wAt(sc,"fixed","both say"),tChanges=wAt(sc,"fixed","changes its answer"),tReasonW=wAt(sc,"fixed","with the reason"),tJob=C.job;
  const tMon=C.monday,tWithout=wAt(sc,"monday","without its evidence"),tPlain=wAt(sc,"nightly","A plain check"),tNight=wAt(sc,"nightly","every night");
  const tDown=wAt(sc,"written","written down"),tTeam=wAt(sc,"written","the whole team"),tNext=wAt(sc,"written","the next chat"),tApp=wAt(sc,"person","a person approves"),tReads=wAt(sc,"person","reads the evidence"),tSigns=wAt(sc,"person","signs");
  const tNever=C.never,tSem=C.next,tStart=wAt(sc,"next","start in");
  // the answer as the agent first gives it (from the platform alone), then "the two ways disagree", then the checked answer, with its reason
  const ANS0={kick:"answer",title:"Engineering and IT · 134"},ANSD={kick:"answer",title:"the two ways disagree",why:"3 students counted twice",whyCol:AG.amber},
    ANSF={kick:"checked two ways",title:"Engineering and IT · 131",why:"reason: 3 students counted twice",whyCol:AG.ink};
  const people=(ctx,o)=>{o=o||{};mc_jun(ctx,t,{dx:MC_JDX,talk:0,a:o.ja});
    mc_clara(ctx,t,{x:MC_CX,gaze:o.cg,smile:ag_in(t,tStart,0.8)*0.7,a:o.ca});};
  const agent=(ctx,o)=>{o=o||{};mc_agent(ctx,MC_AG[0],MC_AG[1],{t,core:lerp(0.8,0.4,ag_in(t,tNever,1.0)),think:o.think||0,spin:o.spin,clear:o.clear||0});};
  // the routes, the hands reaching to them, the counts and the verdict
  const routes=(ctx,a)=>{if(a<=0)return;const r1=ag_in(t,tSecond-0.2,0.6),r2=ag_in(t,tSecond+0.3,0.6),u1=ag_in(t,tPlat-0.5,1.0),u2=ag_in(t,tSys-0.5,1.0);
    withA(ctx,a,()=>{
      ag_reach(ctx,[930,380,880,470,840,520,MC_R1[0]+MC_R1[2]-40,MC_R1[1]+6],u1,{data:ag_in(t,tPlat+0.5,1.6)});
      ag_reach(ctx,[990,380,1040,470,1080,520,MC_R2[0]+40,MC_R2[1]+6],u2,{data:ag_in(t,tSys+0.5,1.6)});
      ag_tool(ctx,MC_R1[0],MC_R1[1],MC_R1[2],130,"the data platform's enrolments",{a:r1,touch:ag_in(t,tPlat+0.2,0.4)});
      ag_tool(ctx,MC_R2[0],MC_R2[1],MC_R2[2],130,"the student system's report",{a:r2,touch:ag_in(t,tSys+0.2,0.4)});
      const fx=ag_in(t,tBoth-0.3,0.6),c1=MC_R1[0]+MC_R1[2]/2,c2=MC_R2[0]+MC_R2[2]/2;
      mc_count(ctx,c1,MC_CY,"134",{a:ag_in(t,t134-0.1,0.4)*(1-fx),k:ag_spr(t,t134-0.1,0.5),col:AG.amber});
      mc_count(ctx,c1,MC_CY,"131",{a:fx,k:ag_spr(t,tBoth-0.3,0.5),col:AG.green});
      mc_count(ctx,c2,MC_CY,"131",{a:ag_in(t,t131-0.1,0.4),k:ag_spr(t,t131-0.1,0.5),col:mix(AG.amber,AG.green,fx)});
      ag_verdict(ctx,960,MC_VY,"3 apart","fail",ag_in(t,t131+0.6,0.4)*(1-fx));ag_verdict(ctx,960,MC_VY,"agrees two ways","pass",ag_in(t,tBoth+0.4,0.5));});};
  const shots=[
    // nobody is blamed: the three answers go to the wall; the team checks the work instead; every answer shows where it came from
    {at:0,place:"mcLab",keys:[[0,960,540,1.015]],push:0.02,draw(ctx,t){agent(ctx,{think:ag_io(t,tCame-0.8,tQuery,0.3),spin:ag_in(t,tCame-0.9,1.0)});people(ctx);ag_roomLight(ctx,1);
      const aside=ag_sine(ag_in(t,C.blamed+0.2,1.6)),L=mc_lineup(ctx);
      [MC_A1,MC_A2,MC_A3].forEach((o,i)=>{const x=lerp(L[i],120+i*70,aside),y=lerp(600,150+i*48,aside),k=lerp(1,0.66,aside);ctx.save();ctx.translate(x,y);ctx.scale(k,k);
        mc_deco(aside>0,()=>mc_answer(ctx,0,0,Object.assign({a:lerp(1,0.2,aside)*(1-ag_in(t,tCame-0.6,0.5)),false:i===1?1:0},o)));ctx.restore();});
      const w=mc_answerW(ctx,ANS0);mc_answer(ctx,960-w/2,520,Object.assign({a:ag_in(t,tCame,0.35),k:ag_spr(t,tCame,0.5),kx:MC_AG[0],ky:MC_AG[1],fill:ag_in(t,tQuery-0.2,(tRows-tQuery)+1.0)},ANS0));
      // or last year's paper: Clara's, signed
      mc_paper(ctx,1300,160,440,250,{kick:"Planning · last year",title:"First-years who left",sub:"Engineering and IT · signed",lines:1,a:ag_in(t,tLYP-0.1,0.4),rot:0.02*ag_spr(t,tLYP-0.1,0.5),seed:9});}},
    // a second way: the platform's enrolments and the student system's report, read only; they disagree; three counted twice; fixed
    {cut:true,at:tSecond-0.4,place:"mcLab",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){
      agent(ctx,{think:ag_io(t,tPlat-0.6,t131,0.4)+ag_io(t,tSays-0.4,tSays+0.8,0.3)+ag_io(t,tChanges-0.4,tChanges+0.8,0.3),spin:t<tChanges-1?ag_in(t,tPlat-0.6,1.6):ag_in(t,tChanges-0.6,1.0)});
      people(ctx,{cg:[-3,0]});ag_roomLight(ctx,1);
      // the reciters' patterns, faint, behind the two routes for a moment
      withA(ctx,0.34*ag_io(t,tPat-0.2,tPlat-0.4,0.6),()=>mc_rows(ctx,360,176,{s:0.56,dy:96,glow:1,labelA:0}));
      routes(ctx,1);
      // counted twice: the platform's rows open over its card, three pairs lit; struck out once it's fixed
      const ro=ag_io(t,tTwice-0.5,tMon-0.6,0.6);mc_rows2(ctx,MC_R1[0]+40,150,420,{a:ro,hi:ag_in(t,tTwice,0.6),fixed:ag_in(t,tFixed,0.9)});
      withA(ctx,ro*ag_in(t,tTwice+0.2,0.5)*(1-ag_in(t,tFixed+0.6,0.5)),()=>mc_tag(ctx,MC_R1[0]+40-16,326,"counted twice",{align:"right",col:AG.amber}));
      // the agent says so, rather than picking one; once fixed, its answer changes, with the reason
      const ans=ag_in(t,tSays-0.3,0.4),tn=ag_in(t,tChanges-0.2,0.9),wd=Math.max(mc_answerW(ctx,ANSD),mc_answerW(ctx,ANSF)),fl=ag_in(t,tReasonW,1.2);
      mc_answer(ctx,MC_ANX,MC_ANY,Object.assign({a:ans,k:ag_spr(t,tSays-0.3,0.5),kx:MC_AG[0],ky:MC_AG[1],w:wd,turn:tn,back:Object.assign({fill:fl},ANSF),edge:tn>0.5?AG.green:null,edgeA:ag_in(t,tJob,0.8)},ANSD));}},
    // Monday's answer was right after all, but without its evidence nobody could tell; a plain check, every night
    {cut:true,at:tMon-0.4,place:"mcLab",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){agent(ctx);people(ctx);ag_roomLight(ctx,1);routes(ctx,1-ag_in(t,tDown-0.6,0.6));
      const wd=mc_answerW(ctx,ANSF);mc_answer(ctx,MC_ANX,MC_ANY,Object.assign({w:wd,fill:1,edge:AG.green,edgeA:1,a:1-ag_in(t,tDown-0.6,0.6)},ANSF));
      mc_answer(ctx,lerp(-560,262,ag_eo(ag_in(t,tMon,1.2))),150,Object.assign({a:ag_in(t,tMon,0.3)*(1-ag_in(t,tPlain-0.4,0.5)),pulse:Math.sin(Math.PI*clamp((t-tWithout)/1.4,0,1))},MC_A1));
      mc_nightly(ctx,MC_R1[0]+6,384,{w:470,a:ag_in(t,tPlain,0.4)*(1-ag_in(t,tDown-0.6,0.6)),k:ag_spr(t,tPlain,0.5),moon:clamp((t-tNight)/1.4,0,2)*TAU,tick:ag_in(t,tNight+1.4,0.5)});}},
    // written down for the whole team, outside any one chat or head; Wednesday, a new chat starts from it; a person approves and signs
    {at:tDown-0.4,place:"mcLab",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){const cl=ag_io(t,tNext-0.2,tNext+0.9,0.3);
      agent(ctx,{clear:cl,think:ag_io(t,tNext+0.6,tNext+2.0,0.3)});people(ctx,{cg:t>tReads?[-2,3]:null});ag_roomLight(ctx,1);
      mc_record(ctx,MC_REC[0],MC_REC[1],MC_REC[2],{a:ag_in(t,tDown,0.4),k:ag_spr(t,tDown,0.5),row:ag_in(t,tTeam-0.4,1.4)});
      // the next chat starts from it: a thread of light from the card on the wall into the ring
      const th=ag_in(t,tNext+0.5,1.0);mc_ribbon(ctx,[690,250,740,244,786,272,816,306],0,ag_sine(th),ag_io(t,tNext+0.5,tApp,0.4),4);
      // drafted by the agent; Clara reads the evidence and signs
      const wd=mc_answerW(ctx,ANSF),b=mc_answer(ctx,MC_ANX,MC_ANY,Object.assign({w:wd,fill:1,a:ag_in(t,tApp-0.4,0.5),edge:AG.green,edgeA:0.8},ANSF));
      mc_signoff(ctx,MC_ANX,MC_ANY+mc_answerH(Object.assign({fill:1},ANSF))-20,wd,{a:ag_in(t,tApp,0.5),k:ag_spr(t,tApp,0.5),sign:ag_in(t,tSigns-0.2,1.2)});}},
    // next semester: Clara's draft on the wall, its blank filled at last: the two new advisers start in Engineering and IT
    {cut:true,at:tSem-0.4,place:"mcLab",keys:[[0,960,540,1.0]],push:0.03,draw(ctx,t){agent(ctx);people(ctx,{cg:[2,-4]});ag_roomLight(ctx,1);
      mc_draft(ctx,MC_PAPER[0],MC_PAPER[1],{fill:ag_in(t,tStart+0.2,1.2)});
      mc_record(ctx,MC_REC[0],MC_REC[1],MC_REC[2],{row:1});}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  ag_kicker(ctx,"1.5","Minds that change");
  mc_corner(ctx,"Wednesday",ag_io(t,tNext-0.3,tSem-0.4,0.4));mc_corner(ctx,"Next semester",ag_in(t,tSem-0.2,0.5));});

/* ================================================================ 6 · Every pattern, every time */
scene("every",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath,T=MC_AT;
  const tPat=wAt(sc,"hymn","every pattern"),tTime=wAt(sc,"hymn","every time"),tYears=wAt(sc,"hymn","three thousand years"),tData=C.data,tWay=wAt(sc,"holds","more than one way"),tHolds=wAt(sc,"holds","the work holds"),tTrust=C.trust;
  const RX=1350,RY=168,RS=0.84,RDY=92;
  const shots=[
    // the riverbank at dusk: the teacher and the two students, the four rows green over them, lighting one after another
    {at:0,place:"mcDusk",keys:[[0,1000,520,1.08],[tData-1.5,1150,420,1.18]],d:3,push:0.02,draw(ctx,t){mc_bank(ctx,t,"dusk");
      const talk={teacher:mc_recite(t,C.asked+0.2,C.asked+1.6),boy1:mc_recite(t,tTime-0.3,tTime+1.4),boy2:mc_recite(t,tTime-0.3,tTime+1.4)};
      mc_reciters(ctx,t,{pose:MC_POSE.sit,talk});mc_leaves(ctx,t,"dusk");
      const rows=mc_rows(ctx,RX,RY,{s:RS,dy:RDY,tiles:false,labelA:1});mc_threads(ctx,rows,1,{s:RS});
      const glowR=r=>0.55+0.45*Math.sin(Math.PI*clamp((t-tTime-r*0.35)/0.9,0,1))+0.45*ag_in(t,tYears,1.0);
      for(let r=0;r<4;r++){ctx.save();const op=[0,0,0,0];op[r]=1;mc_rows(ctx,RX,RY,{s:RS,dy:RDY,open:op,labelA:0,glow:Math.min(1,glowR(r))});ctx.restore();}}},
    // the same with data: the room, the two routes agreeing, the team's card on the wall; the camera eases back for the end card
    {at:tData-0.3,place:"mcLab",keys:[[0,955,585,1.06],[tWay-0.4,960,540,1.0]],d:3.2,push:0,draw(ctx,t){
      mc_agent(ctx,MC_AG[0],MC_AG[1],{t,core:0.55});mc_jun(ctx,t,{dx:MC_JDX});mc_clara(ctx,t,{x:MC_CX,smile:0.5});ag_roomLight(ctx,1);
      ag_tool(ctx,MC_R1[0],MC_R1[1],MC_R1[2],130,"the data platform's enrolments",{touch:0.5});ag_tool(ctx,MC_R2[0],MC_R2[1],MC_R2[2],130,"the student system's report",{touch:0.5});
      mc_count(ctx,MC_R1[0]+MC_R1[2]/2,MC_CY,"131",{col:AG.green});mc_count(ctx,MC_R2[0]+MC_R2[2]/2,MC_CY,"131",{col:AG.green});
      ag_verdict(ctx,960,MC_VY,"agrees two ways","pass",1);mc_record(ctx,MC_REC[0],MC_REC[1],MC_REC[2],{row:1});mc_draft(ctx,MC_PAPER[0],MC_PAPER[1],{fill:1});
      const g=ag_io(t,tHolds-0.2,tHolds+1.6,0.5);if(g>0)glow(ctx,960,MC_VY,180,[110,190,140],0.35*g);}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.8);
  ag_end(ctx,S,t,tTrust-0.1,"Minds that change","Trust no mind blindly. Check the work.","Film 5 of 9");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["ours", "check"]);

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
