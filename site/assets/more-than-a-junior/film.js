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

// More than a junior, film 4 of 9 of What an agent is, the first series of the module on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"hans":{"name":"Clever Hans","lead":2.2,"tail":1.0,"vo":[
 {"id":"berlin","gap":0.8,"text":"Berlin, 1904.","say":"Berlin, nineteen-oh-four."},
 {"id":"noon","gap":0.8,"text":"Every day at noon, Wilhelm von Osten, a retired maths teacher, showed his horse in a courtyard."},
 {"id":"taught","gap":0.8,"text":"He had taught Hans for four years, the way children are taught at school."},
 {"id":"taps","gap":0.8,"text":"Hans answered by tapping his hoof: sums, fractions, the date."},
 {"id":"papers","gap":0.8,"text":"The papers called him Clever Hans."},
 {"id":"how","gap":0.8,"text":"But how could a horse do sums?"},
 {"id":"fraud","gap":0.8,"text":"Some papers called von Osten a fraud, who gave Hans secret signs."},
 {"id":"stake","gap":0.8,"text":"An old man's good name was at stake."},
 {"id":"thirteen","gap":0.8,"text":"Thirteen experts came to judge, and found no trick."},
 {"id":"think","gap":0.8,"text":"Many took that to mean Hans could think."},
 {"id":"knew","gap":0.8,"text":"But in every test, someone there knew the answer."},
 {"id":"change","gap":0.8,"text":"Something had to change: not the horse, but the way he was tested."},
 {"id":"pfungst","gap":0.8,"text":"That autumn, a young psychologist, Oskar Pfungst, tested Hans as a horse, not as a pupil."},
 {"id":"nobody","gap":0.8,"text":"When nobody there knew the answer, Hans failed."},
 {"id":"blinkers","gap":0.8,"text":"With large blinkers on, so he couldn't see the one asking, he got 6 in every 100 right.","say":"With large blinkers on, so he couldn't see the one asking, he got six in every hundred right."},
 {"id":"sight","gap":0.8,"text":"When he could see them, 89.","say":"When he could see them, eighty-nine."},
 {"id":"watching","gap":0.8,"text":"Hans had been watching the one who asked."},
 {"id":"cheat","gap":0.8,"text":"So von Osten was no cheat, and Hans couldn't count."},
 {"id":"gift","gap":0.8,"text":"But he could see movements too small for any expert to notice."},
 {"id":"since","gap":0.8,"text":"Ever since, careful tests keep the answer from the one who asks."},
 {"id":"jun","gap":0.8,"text":"Jun's data team works with something else that isn't what it looks like: an AI agent."},
 {"id":"safely","gap":0.8,"text":"Supervised for what it is, it gives them more than a junior could, and safely."}]},
"junior":{"name":"A junior who needs supervision","lead":1.4,"tail":1.0,"vo":[
 {"id":"agent","gap":0.8,"text":"An agent is a model that reasons, with hands, in a loop."},
 {"id":"advice","gap":0.8,"text":"Teams starting with one are often told: treat it like a junior who needs supervision."},
 {"id":"knows","gap":0.8,"text":"A junior knows a little, works slowly, and does small jobs that someone checks."},
 {"id":"less","gap":0.8,"text":"They remember what they're told, so month by month, you check them less."},
 {"id":"careful","gap":0.8,"text":"And they're careful, because a mistake would cost them."},
 {"id":"looks","gap":0.8,"text":"But, like Hans, the agent only looks like the picture."},
 {"id":"ways","gap":0.8,"text":"It's more than a junior in two ways, and less than a person in three."}]},
"more":{"name":"More than a junior","lead":1.2,"tail":1.0,"vo":[
 {"id":"asks","gap":0.8,"text":"One morning, Jun asks it how the award count is built, from student records to the government's report."},
 {"id":"reads","gap":0.8,"text":"It reads the whole project, 33 tables and their code, and draws the path in about a minute.","say":"It reads the whole project, thirty-three tables and their code, and draws the path in about a minute."},
 {"id":"week","gap":0.8,"text":"A new junior would need a week for this."},
 {"id":"lifetimes","gap":0.8,"text":"It has read more than any of us could in a thousand lifetimes."},
 {"id":"undersells","gap":0.8,"text":"So the junior picture undersells it, and hides a danger."},
 {"id":"rein","gap":0.8,"text":"Given free rein, it could change every table in a minute: the wrong way, as fast as the right one."},
 {"id":"pace","gap":0.8,"text":"A junior's pace keeps their mistakes small. The agent's pace doesn't, so something else must."}]},
"memory":{"name":"No memory of yesterday","lead":1.2,"tail":1.0,"vo":[
 {"id":"count","gap":0.8,"text":"Later, Jun asks it for this year's count of awards."},
 {"id":"first","gap":0.8,"text":"It counts 4,812, and shows how.","say":"It counts four thousand, eight hundred and twelve, and shows how."},
 {"id":"glossary","gap":0.8,"text":"Jun points it to the glossary: here, microcredentials of six credit points or more count too."},
 {"id":"again","gap":0.8,"text":"It counts again: 4,867.","say":"It counts again: four thousand, eight hundred and sixty-seven."},
 {"id":"next","gap":0.8,"text":"The next morning, Jun starts a new session and asks for awards by faculty."},
 {"id":"out","gap":0.8,"text":"Its faculties add up to 4,812 again: it has left the microcredentials out.","say":"Its faculties add up to four thousand, eight hundred and twelve again: it has left the microcredentials out."},
 {"id":"told","gap":0.8,"text":"A junior, told once, would remember."},
 {"id":"none","gap":0.8,"text":"The agent has no memory of yesterday, unless we give it one."},
 {"id":"notes","gap":0.8,"text":"So Jun adds the lesson to the team's notes for agents, which every session starts by reading."},
 {"id":"lesson","gap":0.8,"text":"Before you count a word, read its meaning in the glossary."},
 {"id":"whoever","gap":0.8,"text":"From then on, it counts the glossary's way, whoever starts the session."}]},
"lose":{"name":"Nothing to lose","lead":1.2,"tail":1.0,"vo":[
 {"id":"faster","gap":0.8,"text":"Another day, Jun asks it to speed up the nightly run."},
 {"id":"three","gap":0.8,"text":"It finds three tables, built every night, that nothing seems to read."},
 {"id":"drafts","gap":0.8,"text":"In seconds, it drafts a change that deletes them."},
 {"id":"junior","gap":0.8,"text":"A junior would have asked around first, with their name on the work and a career ahead."},
 {"id":"agent","gap":0.8,"text":"The agent has no career, and no mistake costs it anything."},
 {"id":"nothing","gap":0.8,"text":"It isn't careless. It has nothing to lose."},
 {"id":"rights","gap":0.8,"text":"So its caution comes from its rights: it reads, and writes only drafts in a sandbox, where they wait for a person."},
 {"id":"yearly","gap":0.8,"text":"Jun asks around: one of the three is read once a year, for the report to the government."},
 {"id":"two","gap":0.8,"text":"So the change goes ahead with two. Jun reviews it, and Noor approves it for production."},
 {"id":"approves","gap":0.8,"text":"A junior grows into the one who approves. The agent never does: its review is for reference."}]},
"asked":{"name":"Asked the way Pfungst asked","lead":1.2,"tail":1.0,"vo":[
 {"id":"berlin","gap":0.8,"text":"Back in Berlin, Pfungst found what Hans was watching."},
 {"id":"lift","gap":0.8,"text":"At the right number, the questioner's head lifted, in von Osten a fifth of a millimetre at most."},
 {"id":"unaware","gap":0.8,"text":"Nobody knew they did it, not even Pfungst."},
 {"id":"name","gap":0.8,"text":"AI researchers still use Hans's name for a model that takes its answer from a hint, not from the problem."},
 {"id":"hint","gap":0.8,"text":"In tests since 2023, a hint like 'I think it's B' pulled models to B, and their reasoning rarely mentioned it.","say":"In tests since twenty twenty-three, a hint like 'I think it's B' pulled models to B, and their reasoning rarely mentioned it."},
 {"id":"jun","gap":0.8,"text":"So Jun asks the way Pfungst asked: without the answer in the question."},
 {"id":"how","gap":0.8,"text":"He looks at how it got there: the query, and the rows it read."},
 {"id":"draft","gap":0.8,"text":"And he checks a count it didn't make: the draft for the government says 4,867 too.","say":"And he checks a count it didn't make: the draft for the government says four thousand, eight hundred and sixty-seven too."}]},
"close":{"name":"For what it is","lead":1.4,"tail":1.0,"vo":[
 {"id":"pupil","gap":0.8,"text":"Hans was never a pupil: he was a horse, with a gift nobody had looked for."},
 {"id":"junior","gap":0.8,"text":"The agent isn't a junior. It knows more, and works faster."},
 {"id":"less","gap":0.8,"text":"And it's less than a person: no career, nothing to lose, no memory of yesterday."},
 {"id":"lives","gap":0.8,"text":"So its caution lives in its rights, its memory in the team's notes, and every yes with a person."},
 {"id":"week","gap":0.8,"text":"This week, that gave Jun's team a path in a minute, a count checked twice, a yearly table kept, and a lesson for every session."},
 {"id":"takeaway","gap":0.8,"text":"Supervise it for what it is, not for what it looks like."}]}
};

const VODUR={"hans/berlin": 1.427, "hans/noon": 6.083, "hans/taught": 3.568, "hans/taps": 3.659, "hans/papers": 1.79, "hans/how": 1.472, "hans/fraud": 4.21, "hans/stake": 1.975, "hans/thirteen": 2.979, "hans/think": 1.752, "hans/knew": 2.507, "hans/change": 3.521, "hans/pfungst": 5.789, "hans/nobody": 2.392, "hans/blinkers": 5.319, "hans/sight": 1.728, "hans/watching": 2.014, "hans/cheat": 2.978, "hans/gift": 3.218, "hans/since": 3.475, "hans/jun": 4.967, "hans/safely": 4.361, "junior/agent": 3.354, "junior/advice": 5.135, "junior/knows": 4.524, "junior/less": 3.709, "junior/careful": 2.582, "junior/looks": 2.952, "junior/ways": 3.732, "more/asks": 6.114, "more/reads": 5.542, "more/week": 2.031, "more/lifetimes": 3.162, "more/undersells": 3.076, "more/rein": 5.729, "more/pace": 5.31, "memory/count": 2.895, "memory/first": 3.486, "memory/glossary": 5.905, "memory/again": 3.665, "memory/next": 4.602, "memory/out": 6.434, "memory/told": 2.001, "memory/none": 3.58, "memory/notes": 5.265, "memory/lesson": 2.893, "memory/whoever": 3.666, "lose/faster": 2.883, "lose/three": 3.805, "lose/drafts": 2.792, "lose/junior": 4.4, "lose/agent": 3.475, "lose/nothing": 2.391, "lose/rights": 6.79, "lose/yearly": 5.168, "lose/two": 5.087, "lose/approves": 5.655, "asked/berlin": 2.928, "asked/lift": 5.735, "asked/unaware": 2.326, "asked/name": 6.485, "asked/hint": 6.898, "asked/jun": 4.138, "asked/how": 3.322, "asked/draft": 6.664, "close/pupil": 4.444, "close/junior": 3.477, "close/less": 4.923, "close/lives": 5.593, "close/week": 7.55, "close/takeaway": 3.011};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card, as Berlin's light carries into the room, and the end card, held long enough for the series' mark to draw itself.
   The longer holds let a picture finish: the courtyard's first shot, Hans's taps and the chalk ticks, the calm eye, the clouds of "5", the turn
   from the horse to the people, the two dot grids, the envelope; the agent at work and the paper junior; the 33 tables read and the path lit, the
   shelf that runs out of the frame, the amber ripple; each count; the lesson in the team's notes; the draft, the tray and the glass, the calendar,
   the two stamps; the lens over the hat's brim and the hand mirror; the draft for the government beside the agent's answer. */
const BREATH={
"hans":{"hold":{"berlin":1.2,"noon":0.8,"taught":0.8,"taps":1.4,"papers":1.0,"how":1.2,"fraud":0.6,"stake":1.2,"thirteen":1.0,"think":1.0,"knew":1.0,"change":1.6,
  "pfungst":0.8,"nobody":1.0,"blinkers":1.4,"sight":1.4,"watching":1.0,"cheat":0.8,"gift":0.8,"since":1.2,"jun":0.8},"breathe":4.5},
"junior":{"hold":{"agent":1.0,"advice":1.2,"knows":1.0,"less":1.0,"careful":1.0,"looks":1.0,"ways":1.2}},
"more":{"hold":{"asks":0.8,"reads":1.6,"week":1.0,"lifetimes":1.4,"undersells":0.8,"rein":1.6,"pace":1.4}},
"memory":{"hold":{"glossary":0.4,"first":0.8,"again":0.8,"out":0.8,"none":0.4,"lesson":1.0}},
"lose":{"hold":{"faster":0.8,"three":1.0,"drafts":1.2,"junior":0.8,"agent":0.8,"nothing":1.4,"rights":1.4,"yearly":1.2,"two":1.4,"approves":1.0}},
"asked":{"hold":{"berlin":0.8,"lift":1.4,"unaware":1.2,"name":0.8,"hint":1.2,"jun":0.8,"how":1.0,"draft":1.2}},
"close":{"hold":{"pupil":1.2,"junior":0.8,"less":0.8,"lives":1.2,"week":1.2},"breathe":5.5}
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

/* ===== More than a junior: the room's own pieces =====
   What this film adds to the module's room: the agent where the series puts it, with its "Junior" badge; the paper junior, a pale
   cut-out of a person that stands for the picture we put on the agent; the two-column card that fills chapter by chapter; the
   project's 33 table cards and the lit path; the shelves; the session cards; the team's notes for agents; the clock and the nightly
   run; the calendar; the ladder; the stamps. Every top-level name starts with mj_ or MJ_, the film's own prefix. Sizes are in the
   1920 x 1080 frame; every word at least 28 px as drawn, and nothing below y 890 but the captions. */

/* ---------------------------------------------------------------- where things are in the room */
const MJ_ROOM={agent:{x:1124,y:476,r:88,R:180},jun:{x:296,y:596,s:1.0}};
// the agent in its ring, where the series has it: o.t, o.core, o.think, o.pulse (the light travelling round the ring while it works),
// o.badge (0 to 1: the "Junior" badge hangs from the ring's foot), o.textA (0 to 1: its words, the label and the steps, fade on their
// own), o.a; and its light on the wall and its shadow on the floor
function mj_agent(ctx,o){o=o||{};const A=MJ_ROOM.agent,x=o.x||A.x,y=o.y||A.y,t=o.t||0,a=o.a==null?1:o.a;if(a<=0)return;
  ctx.save();ctx.globalAlpha*=a;
  const ta=o.textA==null?1:clamp(o.textA,0,1),p0=o.pulse==null?{deg:(t*36)%360-120,a:0.7}:o.pulse,pulse=ta<1&&p0?Object.assign({},p0,{a:(p0.a==null?0.7:p0.a)*ta}):p0,lab=o.label===undefined?"Model":o.label;
  ag_loop(ctx,x,y,{t,core:o.core==null?0.8:o.core,think:o.think||0,pulse,lit:o.lit,col:o.col,steps:o.steps,R:o.R,r:o.r,floor:o.floor===undefined?y+330:o.floor,
    label:ta<1?null:lab,stepA:ta<1?[ta,ta,ta]:undefined});
  if(ta<1&&ta>0&&lab)ag_T(ctx,lab,x,y+(o.r||A.r)*0.6,{w:700,size:28,align:"center",col:AG.label,a:ta});
  if(o.badge>0){const hy=y+(o.R||A.R)+4;ctx.save();if(o.swing){ctx.translate(x,hy);ctx.rotate(o.swing);ctx.translate(-x,-hy);}
    ag_badge(ctx,x,hy,"Junior",{t,drop:lerp(30,86,ag_spr(o.badge,0,0.5)),a:clamp(o.badge*3,0,1)});ctx.restore();}
  ctx.restore();}
// where the agent's badge hangs from
const mj_hook=()=>[MJ_ROOM.agent.x,MJ_ROOM.agent.y+MJ_ROOM.agent.R+4];
// an arm from the sphere out to (tx, ty), u 0 to 1; o.from "left" leaves the sphere on its left; o.data, o.grip, o.a
function mj_arm(ctx,tx,ty,u,o){o=o||{};if(u<=0.002)return;const A=MJ_ROOM.agent,sd=o.from==="left"?-1:1,x0=A.x+sd*58,y0=A.y+44,
    p=[x0,y0,x0+sd*150,y0+70,tx-sd*130,ty+60,tx,ty];ag_reach(ctx,p,u,{data:o.data,grip:o.grip,a:o.a});}

/* ---------------------------------------------------------------- the paper junior and the ladder
   mj_junior(ctx, x, y, h, o): a pale paper cut-out of a person, head and shoulders, on a small oak foot; (x, y) where the foot meets the
   floor, h its height. It stands for the junior picture, an idea rather than a colleague. o: t; badge (0 to 1, the "Junior" badge on a
   lanyard at its neck); nod (radians, about the neck); tip (the whole cut-out tilts, radians, about its foot); cards (how many small
   task cards it holds in front, 0 to 3), ticks (how many of those have a reviewer's green tick), amber (0 to 1: its one card turns
   amber), name (its name signed on its first card); a. Returns where its neck is. */
function mj_juniorPath(c,h){const hr=h*0.12,ny=-h+hr*2.15,sw=h*0.34;
  c.moveTo(-sw,-h*0.06);c.bezierCurveTo(-sw,-h*0.3,-sw*0.96,-h*0.44,-sw*0.74,-h*0.5);c.bezierCurveTo(-sw*0.5,-h*0.56,-h*0.08,-h*0.56,-h*0.07,ny+hr*0.25);
  c.bezierCurveTo(-hr*1.05,ny-hr*0.2,-hr*1.05,-h,0,-h);c.bezierCurveTo(hr*1.05,-h,hr*1.05,ny-hr*0.2,h*0.07,ny+hr*0.25);
  c.bezierCurveTo(h*0.08,-h*0.56,sw*0.5,-h*0.56,sw*0.74,-h*0.5);c.bezierCurveTo(sw*0.96,-h*0.44,sw,-h*0.3,sw,-h*0.06);c.closePath();}
function mj_junior(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const t=o.t||0,sway=Math.sin(t*0.8)*0.006;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx*2,y+4,h*0.34,h*0.035,0.28);
  ctx.translate(x,y);ctx.rotate((o.tip||0)+sway);
  // the oak foot, and a slot the paper stands in
  ag_soft(ctx,c=>ag_rect(c,-h*0.2,-h*0.05,h*0.4,h*0.05,4),AG_OAK.base,AG_OAK.hi,h*0.1,-h*0.05,h*0.3,rgba(AG_OAK.dark,0.4),6,0.6);
  // its shadow on the wall behind, falling left; then the paper, standing on the foot, a little curved (lighter to the right), with a
  // soft fold down the middle
  ctx.save();ctx.translate(-h*0.05,-h*0.02);ctx.filter="blur(10px)";ctx.fillStyle="rgba(46,38,28,0.16)";ag_shape(ctx,c=>{ctx.save();ctx.translate(0,h*0.004);mj_juniorPath(c,h*0.95);ctx.restore();});ctx.fill();ctx.filter="none";ctx.restore();
  ctx.save();ctx.translate(0,h*0.004);if(o.nod){ctx.translate(0,-h*0.62);ctx.rotate(o.nod*0.4);ctx.translate(0,h*0.62);}
  const P=c=>mj_juniorPath(c,h*0.95);ag_shape(ctx,P);const g=ctx.createLinearGradient(-h*0.34,0,h*0.34,0);g.addColorStop(0,"#E4DFD6");g.addColorStop(0.55,"#F3F0EA");g.addColorStop(1,"#FBFAF7");
  ctx.fillStyle=g;ctx.fill();ctx.strokeStyle="rgba(120,110,96,0.35)";ctx.lineWidth=1.5;ctx.stroke();
  ctx.save();ag_shape(ctx,P);ctx.clip();ctx.strokeStyle="rgba(120,110,96,0.16)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-h*0.95);ctx.lineTo(0,0);ctx.stroke();
  // a hint of a face and a collar, pencilled, so it reads as a person and not as anyone in particular
  ctx.strokeStyle="rgba(120,110,96,0.28)";ctx.lineWidth=2.2;ctx.lineCap="round";const hy=-h*0.95+h*0.95*0.12;
  ctx.beginPath();ctx.arc(h*0.02,hy+h*0.02,h*0.05,0.3,Math.PI-0.3);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-h*0.08,-h*0.5);ctx.lineTo(0,-h*0.42);ctx.lineTo(h*0.08,-h*0.5);ctx.stroke();ctx.restore();
  const neck=[0,-h*0.95*0.73];
  // the task cards it holds, each a reviewer's tick
  const n=o.cards||0;for(let i=0;i<n;i++){const m=i-(n-1)/2,cx=m*h*0.215,cy=-h*0.27+Math.abs(m)*h*0.02,cw=h*0.2,ch=h*0.145;ctx.save();ctx.translate(cx,cy);ctx.rotate(m*0.07);
    const amb=i===n-1?clamp(o.amber||0,0,1):0;ag_box(ctx,-cw/2,-ch/2,cw,ch,8,{edge:amb>0?AG.amber:null,edgeA:amb});
    ctx.fillStyle="rgba(86,92,100,0.3)";ctx.fillRect(-cw*0.34,-ch*0.18,cw*0.5,ch*0.1);ctx.fillRect(-cw*0.34,ch*0.04,cw*0.36,ch*0.1);
    if(o.name&&i===0){ctx.strokeStyle=rgba(AG.ink,0.7);ctx.lineWidth=2.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-cw*0.36,ch*0.34);
      for(let k=0;k<=12;k++)ctx.lineTo(-cw*0.36+k*cw*0.045,ch*0.34-Math.sin(k*1.7)*ch*0.07-(k===3?ch*0.1:0));ctx.stroke();}
    if(i<(o.ticks||0))ag_tick(ctx,cw*0.26,0,ch*0.42,rgba(AG.green,1),4);if(amb>0)withA(ctx,amb,()=>ag_warn(ctx,cw*0.26,0,ch*0.5,rgba(AG.amber,1)));ctx.restore();}
  if(o.badge>0)ag_badge(ctx,neck[0],neck[1],"Junior",{t,drop:lerp(30,86,ag_spr(o.badge,0,0.5)),a:clamp(o.badge*3,0,1)});
  ctx.restore();ctx.restore();return{x,y:y+h*0.004+neck[1]};}
// a small oak ladder standing against the wall: its foot's middle at (x, y), h tall, n rungs; o.tip (radians, about its foot), o.a.
// Returns the height of each rung above the foot.
function mj_ladder(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a,n=o.n||5,w=h*0.26;if(a<=0)return[];ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx*2,y+3,w*0.9,8,0.25);ctx.translate(x,y);ctx.rotate(o.tip||0);
  const rail=s=>ag_soft(ctx,c=>{c.moveTo(s*w/2-5,0);c.lineTo(s*w*0.42-4,-h);c.lineTo(s*w*0.42+4,-h);c.lineTo(s*w/2+5,0);c.closePath();},AG_OAK.base,AG_OAK.hi,s*w/2,-h*0.6,h*0.6,rgba(AG_OAK.dark,0.4),6,0.6);
  const rungs=[];for(let i=1;i<=n;i++){const ry=-h*i/(n+1),hw=lerp(w/2,w*0.42,i/(n+1));rungs.push(-ry);ag_soft(ctx,c=>ag_rect(c,-hw,ry-5,hw*2,10,4),AG_OAK.base,AG_OAK.hi,hw*0.5,ry,hw,rgba(AG_OAK.dark,0.35),4,0.5);}
  rail(-1);rail(1);ctx.restore();return rungs;}

/* ---------------------------------------------------------------- the two-column card
   Where the junior picture holds and where it breaks, filled chapter by chapter. (x, y) its top left; o.fill[i] for each row: 0 empty,
   1 the junior's side shown, 2 both; o.lit[i] 0 to 1: the agent's side lit violet (the "more" rows); o.mark[i] 0 to 1: a soft grey band
   while a row is named; o.more, o.less: the brackets beside it; o.k, o.a. 960 wide. */
const MJ_ROWS=[["Knows","a little","more than any of us"],["Pace","a week","a minute"],["Memory","remembers","starts each session fresh"],["Career","ahead","none"],["A mistake costs","them","it nothing"]];
const MJ_TWO={w:960,head:84,row:68,c1:36,c2:300,c3:540};
function mj_two(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const T=MJ_TWO,h=T.head+T.row*5+24,fill=o.fill||[],lit=o.lit||[];
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+T.w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,T.w,h,22,{});
  ag_T(ctx,"A junior",x+T.c2,y+52,{w:700,size:30,col:AG.mut});ag_T(ctx,"The agent",x+T.c3,y+52,{w:700,size:30,col:AG.ink});
  ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+T.head-6);ctx.lineTo(x+T.w-24,y+T.head-6);ctx.stroke();
  MJ_ROWS.forEach((r,i)=>{const ry=y+T.head+i*T.row,f=fill[i]||0,l=clamp(lit[i]||0,0,1);
    if(l>0){ctx.fillStyle=rgba(AG.violet,0.09*l);rr(ctx,x+T.c3-18,ry+6,T.w-T.c3-6,T.row-12,14);ctx.fill();}
    const mk=clamp((o.mark||[])[i]||0,0,1);if(mk>0){ctx.fillStyle=rgba(AG.mut,0.1*mk);rr(ctx,x+12,ry+6,T.w-24,T.row-12,14);ctx.fill();}
    ag_T(ctx,r[0],x+T.c1,ry+44,{w:700,size:30});
    const fa=clamp(f,0,1),fb=clamp(f-1,0,1);
    if(fa>0)ag_T(ctx,r[1],x+T.c2,ry+44,{w:500,size:30,col:AG.mut,a:fa});
    if(fb>0)ag_T(ctx,r[2],x+T.c3,ry+44,{w:700,size:30,col:l>0?mix(AG.ink,AG.violet,l):AG.ink,a:fb});
    if(i<4){ctx.strokeStyle="rgba(60,50,40,0.07)";ctx.beginPath();ctx.moveTo(x+24,ry+T.row);ctx.lineTo(x+T.w-24,ry+T.row);ctx.stroke();}});
  // beside it, two brackets: the agent is more in the first two rows, less in the last three (o.more, o.less 0 to 1)
  const br=(r0,r1,u,col,word)=>{if(u<=0)return;const y0=y+T.head+r0*T.row+10,y1=y+T.head+(r1+1)*T.row-10,bx=x+T.w+22;ctx.save();ctx.globalAlpha*=u;
    ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx,y0);ctx.quadraticCurveTo(bx+14,y0,bx+14,y0+16);ctx.lineTo(bx+14,y1-16);ctx.quadraticCurveTo(bx+14,y1,bx,y1);ctx.stroke();
    ag_T(ctx,word,bx+32,(y0+y1)/2+11,{w:700,size:30,col});ctx.restore();};
  br(0,1,o.more||0,AG.violet,"more");br(2,4,o.less||0,AG.mut,"less");
  ctx.restore();return{x,y,w:T.w,h};}

/* ---------------------------------------------------------------- the project's 33 tables
   Small blue cards on the wall to the right of the agent, rows of five, (x0, y0) the first's top left. o.read 0 to 1: the agent reads
   them in order, row by row,
   each lifting a little as it's read; o.path 0 to 1: six light in a path, with orange data flowing back along it; o.amber 0 to 1: one
   quick ripple of amber across them all (and back as it ends); o.out {index: 0 to 1}: a card lifted out of its place (moved by o.at);
   o.gone {index: 0 to 1}: fades a card; o.dim 0 to 1 dims all but o.keep (indexes); o.a. Returns each card's box. */
const MJ_T={x0:1340,y0:262,cols:5,rows:7,w:86,h:50,gx:18,gy:20,path:[0,6,13,17,23,32]};
function mj_tableBox(i,o){const T=MJ_T,cx=i%T.cols,cy=Math.floor(i/T.cols);return{x:(o&&o.x0||T.x0)+cx*(T.w+T.gx),y:(o&&o.y0||T.y0)+cy*(T.h+T.gy),w:T.w,h:T.h};}
function mj_tables(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const T=MJ_T,n=33,boxes=[];ctx.save();ctx.globalAlpha*=a;
  const pathSet=new Set(T.path),pp=clamp(o.path||0,0,1);
  for(let i=0;i<n;i++){const b=mj_tableBox(i,o),order=i/n,rd=o.read==null?1:o.read,dim=o.dim&&!(o.keep&&o.keep.includes(i))?1-0.6*o.dim:1;
    const lift=Math.sin(clamp((rd*1.15-order)/0.15,0,1)*Math.PI)*6,am=o.amber?Math.sin(clamp((o.amber*1.4-order)/0.4,0,1)*Math.PI):0,
      onPath=pathSet.has(i)&&pp>0,gone=o.gone&&o.gone[i]!=null?1-o.gone[i]:1,out=o.out&&o.out[i]!=null?o.out[i]:0;
    if(gone<=0)continue;let bx=b.x,by=b.y-lift;if(out>0&&o.at&&o.at[i]){bx=lerp(b.x,o.at[i][0],ag_sine(out));by=lerp(b.y,o.at[i][1],ag_sine(out));}
    const edge=am>0.02?AG.amber:onPath?AG.orange:AG.blue,ea=am>0.02?0.5+0.5*am:onPath?0.9:0.55;
    withA(ctx,dim*gone*(rd*1.15>=order?1:0.55),()=>{ag_box(ctx,bx,by,T.w,T.h,12,{edge,edgeA:ea,lw:onPath?3:2});
      ctx.fillStyle=rgba(am>0.02?AG.amber:AG.blue,0.32);ctx.fillRect(bx+16,by+20,T.w*0.5,7);ctx.fillRect(bx+16,by+34,T.w*0.32,7);});
    boxes.push({x:bx,y:by,w:T.w,h:T.h,i});}
  // the path: a line through the six, orange pellets running back along it
  if(pp>0){const pts=T.path.map(i=>{const b=mj_tableBox(i,o);return[b.x+T.w/2,b.y+T.h/2];});ctx.strokeStyle=rgba(AG.orange,0.75);ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";
    const L=pts.length-1,u=pp*L;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let k=1;k<=L;k++){const f=clamp(u-(k-1),0,1);if(f<=0)break;ctx.lineTo(lerp(pts[k-1][0],pts[k][0],f),lerp(pts[k-1][1],pts[k][1],f));}ctx.stroke();
    if(pp>=1&&o.flow!=null)for(let j=0;j<6;j++){const v=((o.flow*0.5+j/6)%1)*L,k=Math.floor(v),f=v-k,q=[lerp(pts[L-k][0],pts[Math.max(0,L-k-1)][0],f),lerp(pts[L-k][1],pts[Math.max(0,L-k-1)][1],f)];ag_pellet(ctx,q[0],q[1],0.9);}}
  ctx.restore();return boxes;}

/* ---------------------------------------------------------------- a clock, a calendar, shelves */
// a small clock on the wall at (x, y), r its radius, showing hh:mm; o.label under it (a pill), o.sweep 0 to 1 (a violet arc round
// the face: the agent's minute), o.a, o.k
function mj_clock(ctx,x,y,r,hh,mm,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.5,1,o.k));
  ag_card(ctx,c=>c.arc(x,y,r,0,TAU),{x:x-r,y:y-r,w:2*r,h:2*r},{});
  ctx.strokeStyle="rgba(60,50,40,0.35)";ctx.lineWidth=2;for(let i=0;i<12;i++){const an=i/12*TAU;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.78,y+Math.sin(an)*r*0.78);ctx.lineTo(x+Math.cos(an)*r*0.88,y+Math.sin(an)*r*0.88);ctx.stroke();}
  const ha=((hh%12)+mm/60)/12*TAU-Math.PI/2,ma=mm/60*TAU-Math.PI/2;ctx.strokeStyle=rgba(AG.ink,0.9);ctx.lineCap="round";
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ha)*r*0.48,y+Math.sin(ha)*r*0.48);ctx.stroke();
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ma)*r*0.72,y+Math.sin(ma)*r*0.72);ctx.stroke();ctx.fillStyle=rgba(AG.ink,1);ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();
  if(o.sweep>0){ctx.strokeStyle=rgba(AG.violet,0.8);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r+10,-Math.PI/2,-Math.PI/2+TAU*clamp(o.sweep,0,1));ctx.stroke();}
  if(o.label)ag_pill(ctx,x,y+r+46,o.label,{col:o.col||null});ctx.restore();}
// a card with a week's days, Monday to Friday filled in turn (o.p 0 to 1); o.label; (x, y) its top left
function mj_week(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=360,h=170;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,18,{});ag_T(ctx,o.label||"a week",x+28,y+48,{w:700,size:30});
  const p=clamp(o.p==null?1:o.p,0,1);for(let i=0;i<5;i++){const bx=x+28+i*62,on=clamp(p*5-i,0,1);ctx.fillStyle=on>0?rgba(AG.mut,0.18+0.3*on):"rgba(86,92,100,0.1)";rr(ctx,bx,y+78,52,64,10);ctx.fill();
    ag_T(ctx,"MTWTF"[i],bx+26,y+122,{w:700,size:28,align:"center",col:AG.mut,deco:1});}
  ctx.restore();}
// an oak shelf of books on the wall from (x, y) (the shelf's top left), w long; the books' spines muted, seeded; o.label (a pill
// over it), o.a
function mj_shelf(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const R=ag_rnd(o.seed||5);
  const cols=[[170,150,128],[120,132,140],[150,120,110],[196,184,160],[110,120,104],[176,160,140],[136,128,150]];
  const end=x+w*clamp(o.p==null?1:o.p,0,1);let bx=x+8;while(bx<end-12){const bw=16+R()*20,bh=90+R()*50,c=cols[Math.floor(R()*cols.length)];
    ag_soft(ctx,cc=>ag_rect(cc,bx,y-bh,bw,bh,3),c,mix(c,[255,255,255],0.4),bx+bw*0.7,y-bh*0.6,bh*0.6,rgba(mix(c,[0,0,0],0.6),0.35),4,0.4);
    ctx.fillStyle=rgba(mix(c,[255,255,255],0.35),0.7);ctx.fillRect(bx+3,y-bh+14,bw-6,4);ctx.fillRect(bx+3,y-24,bw-6,3);bx+=bw+2+(R()<0.08?14:0);}
  ag_floorShadow(ctx,x+w/2,y+18,w*0.5,10,0.18);
  ag_soft(ctx,cc=>ag_rect(cc,x,y,w,20,4),AG_OAK.base,AG_OAK.hi,x+w*0.8,y,w*0.6,rgba(AG_OAK.dark,0.4),6,0.6);
  if(o.label)ag_pill(ctx,o.lx==null?x+w/2:o.lx,y+64,o.label,{});ctx.restore();}

/* ---------------------------------------------------------------- sessions, the glossary, the notes */
// a session: a large pale card with its name at the top ("Session", o.sub such as "next morning"), its contents drawn by o.draw(ctx)
// inside; (x, y) its top left; o.k, o.a; o.blank: nothing inside yet
function mj_session(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,26,{edge:AG.violet,edgeA:0.35});
  ag_label(ctx,x+30,y+50,"Session",{col:AG.violet});if(o.sub)ag_T(ctx,o.sub,x+w-30,y+50,{w:600,size:28,align:"right",col:AG.mut});
  ctx.strokeStyle="rgba(60,50,40,0.1)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+72);ctx.lineTo(x+w-24,y+72);ctx.stroke();
  if(o.draw){ctx.save();ctx.beginPath();ctx.rect(x+4,y+74,w-8,h-78);ctx.clip();o.draw(ctx);ctx.restore();}ctx.restore();}
// the team's notes for agents: a pinned paper, (x, y) its top left, w wide; two older notes, and the new one written in (o.write 0 to 1)
const MJ_LESSON="Before you count a word, read its meaning in the glossary.";
function mj_notes(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const lines=ag_wrap(ctx,MJ_LESSON,w-80,{w:600,size:30}),h=150+lines.length*42+(o.short?0:60);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y,lerp(0.6,1,o.k));ctx.translate(x+w/2,y);ctx.rotate(o.rot==null?-0.015:o.rot);ctx.translate(-x-w/2,-y);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=28;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=14;ctx.fillStyle="#F6F3EA";ctx.fillRect(x,y,w,h);ctx.restore();
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.5)");g.addColorStop(1,"rgba(220,210,190,0.25)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ag_soft(ctx,c=>c.arc(x+w/2,y+14,11,0,TAU),[70,74,82],[200,206,214],x+w/2+3,y+10,10,null);
  ag_T(ctx,"Team notes for agents",x+40,y+66,{w:700,size:32});
  let yy=y+96;if(!o.short){ctx.fillStyle="rgba(86,92,100,0.22)";ctx.fillRect(x+40,yy,w*0.62,9);ctx.fillRect(x+40,yy+24,w*0.46,9);yy+=60;}
  const wr=clamp(o.write==null?1:o.write,0,1);if(wr>0){ctx.save();const tot=lines.reduce((s,l)=>s+ag_tw(ctx,l,{w:600,size:30}),0);let done=wr*tot;
    lines.forEach((l,i)=>{const lw=ag_tw(ctx,l,{w:600,size:30}),show=clamp(done/lw,0,1);done-=lw;if(show<=0)return;ctx.save();ctx.beginPath();ctx.rect(x+36,yy+i*42-34,lw*show+6,48);ctx.clip();
      ag_T(ctx,l,x+40,yy+i*42+6,{w:600,size:30,col:AG.ink});ctx.restore();});ctx.restore();}
  ctx.restore();return{x,y,w,h};}
// a rubber stamp's mark, landing: centred on (x, y), its words in a colour, o.p 0 to 1 (it comes down from above, a little larger)
function mj_stamp(ctx,x,y,text,col,o){o=o||{};const p=clamp(o.p==null?1:o.p,0,1);if(p<=0)return;const s=lerp(1.5,1,ag_eo(p)),w=ag_tw(ctx,text,{w:800,size:34})+56,h=70;
  ctx.save();ctx.globalAlpha*=Math.min(1,p*1.6)*(o.a==null?1:o.a);ctx.translate(x,y);ctx.rotate(o.rot==null?-0.06:o.rot);ctx.scale(s,s);
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=4;rr(ctx,-w/2,-h/2,w,h,12);ctx.stroke();ctx.lineWidth=1.5;rr(ctx,-w/2+7,-h/2+7,w-14,h-14,8);ctx.stroke();
  ag_T(ctx,text,0,12,{w:800,size:34,align:"center",col});ctx.restore();}
// a calendar's month, one day ringed: (x, y) its top left; o.ring 0 to 1 (the ring drawn on), o.label under it
function mj_ringCal(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=300,h=250;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,18,{});ctx.fillStyle=rgba(AG.mut,0.16);rr(ctx,x+8,y+8,w-16,44,12);ctx.fill();
  for(let i=0;i<28;i++){const cx=x+34+(i%7)*39,cy=y+86+Math.floor(i/7)*40;ctx.fillStyle="rgba(86,92,100,0.28)";ctx.beginPath();ctx.arc(cx,cy,5,0,TAU);ctx.fill();}
  const r=clamp(o.ring||0,0,1);if(r>0){const cx=x+34+4*39,cy=y+86+2*40;ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.ellipse(cx,cy,24,20,-0.2,-1.6,-1.6+r*TAU*1.05);ctx.stroke();}
  ctx.restore();if(o.label)ag_pill(ctx,x+w/2,y+h+44,o.label,{a});}

// a small calendar: (x, y) its top left, s its scale (86 x 46 at 1), two binder rings, a header and two weeks of days; o.ring (0 to 1) draws the ring round one day
function mj_cal(ctx,x,y,s,o){o=o||{};const w=86*s,h=46*s;ctx.save();ctx.fillStyle="rgba(86,92,100,0.12)";rr(ctx,x,y,w,h,9*s);ctx.fill();
  ctx.save();rr(ctx,x,y,w,h,9*s);ctx.clip();ctx.fillStyle="rgba(86,92,100,0.28)";ctx.fillRect(x,y,w,11*s);ctx.restore();
  ctx.strokeStyle="rgba(60,64,70,0.7)";ctx.lineWidth=2.6*s;ctx.lineCap="round";for(const bx of [24,62]){ctx.beginPath();ctx.moveTo(x+bx*s,y-4*s);ctx.lineTo(x+bx*s,y+5*s);ctx.stroke();}
  ctx.fillStyle="rgba(86,92,100,0.42)";for(let j=0;j<10;j++){rr(ctx,x+(10.5+(j%5)*14)*s,y+(17+Math.floor(j/5)*13)*s,9*s,8*s,2*s);ctx.fill();}
  const r=clamp(o.ring==null?1:o.ring,0,1);if(r>0){ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=3*s;ctx.beginPath();ctx.ellipse(x+57*s,y+34*s,11*s,9*s,-0.2,-1.6,-1.6+r*TAU*1.05);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- cards of the room's stories */
// a pin, holding a card to the marble
function mj_pin(ctx,x,y){ag_soft(ctx,c=>c.arc(x,y,11,0,TAU),[70,74,82],[200,206,214],x+3,y-4,10,null);}
// Jun's question, a card with a tail towards him; (x, y) its top left, w wide; o.kick ("Jun"), o.k, o.a, o.edge
function mj_q(ctx,x,y,w,text,o){o=o||{};return ag_textCard(ctx,x,y,w,{kick:o.kick||"Jun",title:text,sub:o.sub},{kickCol:AG.kick,k:o.k,a:o.a,edge:o.edge,edgeA:o.edgeA,
  tail:o.tail===false?null:{side:"left",at:0.2,px:x-34,py:y+(o.py||70)}});}
// a line struck through a card's words, drawn on (p 0 to 1)
function mj_strike(ctx,bb,p){if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(AG.ink,0.75);ctx.lineWidth=5;ctx.lineCap="round";const x0=bb.x+20,x1=bb.x+bb.w-20,y0=bb.y+bb.h*0.62,y1=bb.y+bb.h*0.5;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,ag_sine(p)),lerp(y0,y1,ag_sine(p)));ctx.stroke();ctx.restore();}
// a month's page: (x, y) its top left, n the month; o.turn 0 to 1 flips it over to n + 1
function mj_month(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=230,h=112,u=clamp(o.turn||0,0,1),m=u<0.5?n:n+1,sy=Math.abs(Math.cos(u*Math.PI));
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));ctx.translate(0,y);ctx.scale(1,Math.max(0.05,sy));ctx.translate(0,-y);
  ag_box(ctx,x,y,w,h,16,{});ctx.fillStyle=rgba(AG.mut,0.18);rr(ctx,x+8,y+8,w-16,26,10);ctx.fill();
  if(sy>0.92)ag_T(ctx,"Month "+m,x+w/2,y+86,{w:700,size:32,align:"center"});ctx.restore();}
// a small round bubble with a question mark, its tail towards (px, py)
function mj_ask(ctx,x,y,px,py,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.5,1,o.k==null?1:o.k));
  const r=38,an=Math.atan2(py-y,px-x);
  ag_card(ctx,c=>{c.arc(x,y,r,an+0.35,an-0.35+TAU);c.lineTo(x+Math.cos(an)*(r+22),y+Math.sin(an)*(r+22));c.closePath();},{x:x-r,y:y-r,w:2*r,h:2*r},{});
  ag_T(ctx,"?",x,y+15,{w:800,size:44,align:"center"});ctx.restore();}

// the faculties' awards, as bars; (x, y) the top left, w wide; o.p 0 to 1 (the bars grow), o.total 0 to 1 (the sum, in an amber pill),
// o.a. The film's own numbers: they add up to 4,812, the count without the microcredentials.
const MJ_FAC=[["Arts and Education",1108],["Business",1574],["Engineering and IT",1372],["Health",758]];
function mj_bars(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const p=clamp(o.p==null?1:o.p,0,1),max=1574,bw=w-120;ctx.save();ctx.globalAlpha*=a;
  MJ_FAC.forEach(([name,v],i)=>{const yy=y+i*82,u=ag_sine(clamp(p*1.6-i*0.2,0,1));
    ag_T(ctx,name,x,yy+28,{w:600,size:28,col:AG.ink,a:clamp(u*4,0,1)});
    ctx.fillStyle=rgba(AG.orange,0.82);rr(ctx,x,yy+42,Math.max(10,bw*v/max*u),20,10);ctx.fill();
    if(u>0.6)ag_T(ctx,v.toLocaleString("en-GB"),x+bw*v/max+14,yy+62,{w:700,size:28,col:AG.ink,a:clamp((u-0.6)*3,0,1)});});
  const tA=clamp(o.total||0,0,1);if(tA>0)ag_pill(ctx,x+w/2-30,y+4*82+44,"By faculty: 4,812",{icon:o.warn?"warn":null,col:o.warn?AG.amber:null,a:tA});
  ctx.restore();}
// the model's reasoning: a card with a violet edge, its steps appearing in turn (o.p 0 to 1); (x, y) its top left
function mj_reason(ctx,x,y,w,steps,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=AG_PAD*2+38+steps.length*44;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.violet,edgeA:0.6});
  ag_label(ctx,x+AG_PAD,y+AG_PAD+22,"Reasoning",{col:AG.violet});const p=clamp(o.p==null?1:o.p,0,1);
  steps.forEach((s,i)=>{const u=clamp(p*steps.length-i,0,1);if(u>0)ag_T(ctx,s,x+AG_PAD,y+AG_PAD+38+(i+1)*44-6,{w:600,size:30,a:u});});ctx.restore();return{x,y,w,h};}
// a table card with its name, as a larger card lifted from the wall; (x, y) its top left, w wide; o.sub, o.next (the sub it turns to,
// with o.turn 0 to 1), o.edge; o.k, o.a
function mj_tableCard(ctx,x,y,w,name,o){o=o||{};const u=clamp(o.turn||0,0,1),sub=u<0.5?o.sub:o.next||o.sub;
  return ag_textCard(ctx,x,y,w,{kick:"Table",title:name,sub},{kickCol:AG.blue,edge:o.edge||AG.blue,edgeA:o.edgeA==null?0.45:o.edgeA,k:o.k,a:o.a});}
// the agent's draft: a card with a pen, "Draft", and what it would do; (x, y) its top left
function mj_draft(ctx,x,y,w,title,o){o=o||{};const bb=ag_textCard(ctx,x,y,w,{kick:"Draft",title},{kickCol:AG.blue,edge:AG.blue,edgeA:0.5,k:o.k,a:o.a,measure:o.measure});
  if(!o.measure&&(o.a==null||o.a>0))withA(ctx,o.a==null?1:o.a,()=>ag_pen(ctx,x+w-44,y+44,30,rgba(AG.blue,1)));return bb;}
// the agent's own review: a grey card that never approves; (x, y) its top left
function mj_review(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=138;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ctx.fillStyle="rgba(120,124,130,0.12)";rr(ctx,x,y,w,h,22);ctx.fill();
  ag_label(ctx,x+AG_PAD,y+AG_PAD+22,"Agent's review",{col:AG.mut});ag_T(ctx,"For reference",x+AG_PAD,y+AG_PAD+82,{w:700,size:36,col:AG.mut});ctx.restore();}
// a hand mirror standing on a table: (x, y) the middle of its glass, r its radius; o.draw(ctx) paints what it shows, clipped to it
function mj_mirror(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx*1.5,y+r*1.9,r*0.8,8,0.3);
  ag_soft(ctx,c=>ag_rect(c,x-6,y+r*0.9,12,r*0.9,4),[120,92,60],[186,150,110],x+4,y+r,r,null);
  ag_soft(ctx,c=>c.ellipse(x,y+r*1.84,r*0.5,8,0,0,TAU),[120,92,60],[186,150,110],x+10,y+r*1.8,r,null);
  ag_soft(ctx,c=>c.ellipse(x,y,r*0.8+10,r+10,0,0,TAU),[150,116,78],[220,190,150],x+r*0.4,y-r*0.6,r*1.4,"rgba(40,24,10,0.4)",6,0.5);
  ctx.save();ctx.beginPath();ctx.ellipse(x,y,r*0.8,r,0,0,TAU);ctx.clip();const g=ctx.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,"#E4E8E6");g.addColorStop(1,"#B8C0C0");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);
  if(o.draw)o.draw(ctx);ctx.fillStyle="rgba(255,255,255,0.22)";ctx.beginPath();ctx.moveTo(x-r*0.6,y-r);ctx.lineTo(x-r*0.2,y-r);ctx.lineTo(x-r*0.7,y+r);ctx.lineTo(x-r*1.1,y+r);ctx.closePath();ctx.fill();ctx.restore();
  ctx.restore();}
// the nightly run: a bar of 33 small blocks, built one by one (o.p 0 to 1), at (x, y), w wide
function mj_run(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const p=clamp(o.p||0,0,1),bw=(w-32*4)/33;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x-14,y-14,w+28,bw+40,14,{});
  for(let i=0;i<33;i++){const on=clamp(p*33-i,0,1);ctx.fillStyle=on>0?rgba(AG.blue,0.25+0.55*on):"rgba(86,92,100,0.12)";rr(ctx,x+i*(bw+4),y,bw,bw+12,4);ctx.fill();}ctx.restore();}
// one of the close's four cards: a small picture (o.draw(ctx, x, y, w, h) inside the top) over a caption; (x, y) its top left
function mj_win(ctx,x,y,w,h,caption,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,24,{});if(o.draw){ctx.save();ctx.beginPath();ctx.rect(x+8,y+8,w-16,h-120);ctx.clip();o.draw(ctx,x,y+8,w,h-120);ctx.restore();}
  ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+h-112);ctx.lineTo(x+w-24,y+h-112);ctx.stroke();
  const f={w:700,size:o.size||32},ls=ag_wrap(ctx,caption,w-56,f);ls.forEach((l,i)=>ag_T(ctx,l,x+28,y+h-64+i*40-(ls.length-1)*20,f));ctx.restore();}
// the film's last words on a card: lines given (so it breaks where the sense does), centred on x, its top at y; o.k, o.a
function mj_say(ctx,x,y,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const f={w:700,size:40},w=Math.max(...lines.map(l=>ag_tw(ctx,l,f)))+AG_PAD*2+16,h=AG_PAD*2+lines.length*52-4;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y+h/2,lerp(0.5,1,o.k));ag_box(ctx,x-w/2,y,w,h,24,{});
  lines.forEach((l,i)=>ag_T(ctx,l,x,y+AG_PAD+38+i*52,{w:700,size:40,align:"center"}));ctx.restore();}

/* ===== More than a junior: Berlin, 1904 =====
   The opening's pictures, drawn in the module's matte language (soft gradients, matte surfaces, light from the right), not as a diorama:
   the courtyard among tall apartment houses, Hans, the people of 1904, and the things of the story (the blackboard and the slate, the
   newspaper, the reports, the dot grids, the lens, the envelope). Every top-level name starts with mj_ or MJ_, the film's own prefix.

   Hans (mj_horse) is drawn in his own space, facing left so his right side shows (his right forefoot taps; his right hind leg has the
   white sock), standing on the ground at y 760, from the muzzle at x 60 to the tail at x 850; the withers 468 above the ground (a
   Russian trotting horse, about 1.6 m). His shapes are painted once into kept pictures at 1.5 times their size (2 for the head, which
   the camera comes close to), and drawn live: the tapping leg, the eye, the blinkers. */

/* ---------------------------------------------------------------- Hans */
const MJ_H={ground:760,res:1.5,
  coat:[82,44,27],coatHi:[170,104,62],coatDeep:[44,22,12],
  point:[40,33,32],pointHi:[112,100,96],sock:[236,231,222],hoof:[66,60,56],hoofHi:[132,124,116],
  pastern:36};
// the body: neck and barrel and quarters as one shape, the legs' tops inside it
function mj_hBody(c){
  c.moveTo(188,120);                                              // the poll
  c.bezierCurveTo(236,126,288,170,334,226);c.bezierCurveTo(356,254,376,278,402,290);     // the crest of the neck to the withers
  c.bezierCurveTo(432,304,462,314,498,316);c.bezierCurveTo(548,318,588,310,624,302);     // the back, dipping a little
  c.bezierCurveTo(656,294,686,290,712,296);c.bezierCurveTo(732,300,748,310,758,324);     // the croup, round
  c.bezierCurveTo(774,346,782,374,780,402);c.bezierCurveTo(778,434,768,462,752,486);     // the buttock and the back of the thigh
  c.bezierCurveTo(742,506,736,526,736,546);c.bezierCurveTo(736,566,744,584,746,598);     // the back of the gaskin to the point of the hock
  c.bezierCurveTo(748,608,744,616,738,618);c.lineTo(712,620);c.bezierCurveTo(706,612,704,600,704,588);   // under the hock, its front
  c.bezierCurveTo(702,562,696,542,690,528);c.bezierCurveTo(684,500,674,480,660,470);     // the front of the gaskin, the stifle
  c.bezierCurveTo(624,488,580,502,530,506);c.bezierCurveTo(470,510,412,504,372,494);     // the belly, rising to the flank
  c.bezierCurveTo(356,500,350,516,346,536);c.lineTo(300,536);                             // into the forearm
  c.bezierCurveTo(290,506,276,474,260,450);c.bezierCurveTo(244,428,238,404,240,382);     // the chest, the point of the shoulder
  c.bezierCurveTo(242,350,238,316,226,286);c.bezierCurveTo(216,262,206,246,198,236);     // the underside of the neck, the throat
  c.bezierCurveTo(194,200,190,160,188,120);c.closePath();}
// the head, from the poll and the throat to the muzzle (drawn at 0.86 about the poll, so a long face isn't a big one)
function mj_hHead(c){
  c.moveTo(196,124);c.bezierCurveTo(206,152,214,186,216,212);c.bezierCurveTo(218,236,214,258,204,276);   // behind the jaw
  c.bezierCurveTo(192,296,170,306,146,312);c.bezierCurveTo(126,318,110,326,96,330);                      // the lower jaw to the chin
  c.bezierCurveTo(84,334,72,332,66,322);c.bezierCurveTo(58,310,56,296,60,284);                            // the lips, the muzzle
  c.bezierCurveTo(64,268,70,252,80,236);c.bezierCurveTo(98,208,118,178,136,152);                          // the face, up to the eyes
  c.bezierCurveTo(150,132,168,118,186,114);c.bezierCurveTo(192,116,195,119,196,124);c.closePath();}
function mj_hCheek(c){c.moveTo(206,206);c.bezierCurveTo(206,240,196,270,170,284);c.bezierCurveTo(150,294,142,280,150,262);c.bezierCurveTo(160,236,176,214,206,206);}
function mj_hEars(c,near){if(near){c.moveTo(178,126);c.bezierCurveTo(174,104,176,80,188,58);c.bezierCurveTo(196,72,202,96,200,128);c.closePath();}
  else{c.moveTo(194,128);c.bezierCurveTo(196,104,204,84,218,66);c.bezierCurveTo(222,82,220,106,212,132);c.closePath();}}
function mj_hMane(c){c.moveTo(186,116);c.bezierCurveTo(234,120,290,162,338,216);c.bezierCurveTo(360,242,382,268,408,286);
  c.bezierCurveTo(400,300,386,304,372,298);c.bezierCurveTo(358,292,350,282,338,276);c.bezierCurveTo(318,264,306,262,290,250);
  c.bezierCurveTo(268,232,252,210,236,188);c.bezierCurveTo(222,168,208,146,196,130);c.bezierCurveTo(192,124,188,120,186,116);c.closePath();}
function mj_hForelock(c){c.moveTo(186,112);c.bezierCurveTo(172,124,160,140,152,160);c.bezierCurveTo(150,170,156,172,162,164);c.bezierCurveTo(170,150,180,136,192,124);c.closePath();}
function mj_hTail(c){c.moveTo(744,314);c.bezierCurveTo(770,310,790,326,798,358);c.bezierCurveTo(808,404,818,470,822,540);
  c.bezierCurveTo(826,600,820,650,808,690);c.bezierCurveTo(804,704,796,716,786,722);c.bezierCurveTo(782,712,776,700,772,690);
  c.bezierCurveTo(768,640,770,590,768,540);c.bezierCurveTo(766,480,762,420,754,382);c.bezierCurveTo(750,358,742,340,732,328);c.closePath();}
// a leg as a tapered chain of points [x, y, width], drawn as one smooth outline
function mj_legPath(P){const L=[],R=[];for(let i=0;i<P.length;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(P.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
    L.push([P[i][0]+nx*P[i][2]/2,P[i][1]+ny*P[i][2]/2]);R.push([P[i][0]-nx*P[i][2]/2,P[i][1]-ny*P[i][2]/2]);}
  return c=>{c.moveTo(L[0][0],L[0][1]);for(let i=1;i<L.length;i++){const m=[(L[i-1][0]+L[i][0])/2,(L[i-1][1]+L[i][1])/2];c.quadraticCurveTo(L[i-1][0],L[i-1][1],m[0],m[1]);}
    c.lineTo(L[L.length-1][0],L[L.length-1][1]);const e=P[P.length-1],a=P[P.length-2],an=Math.atan2(e[1]-a[1],e[0]-a[0]);c.arc(e[0],e[1],e[2]/2,an-Math.PI/2,an+Math.PI/2);
    for(let i=R.length-2;i>=0;i--){const m=[(R[i+1][0]+R[i][0])/2,(R[i+1][1]+R[i][1])/2];c.quadraticCurveTo(R[i+1][0],R[i+1][1],m[0],m[1]);}c.lineTo(R[0][0],R[0][1]);c.closePath();};}
// a hoof under the coronet C, tilted by r from standing flat (r 0: the sole on the ground); facing left, the toe is towards -x
function mj_hoofPath(C,r){const cs=Math.cos(r),sn=Math.sin(r),p=(x,y)=>[C[0]+x*cs-y*sn,C[1]+x*sn+y*cs];
  const pts=[p(-18,-2),p(-40,24),p(-36,27),p(6,27),p(14,24),p(15,6),p(10,-4)];
  return c=>{c.moveTo(pts[0][0],pts[0][1]);c.lineTo(pts[1][0],pts[1][1]);c.quadraticCurveTo(pts[2][0],pts[2][1],pts[2][0]+2,pts[2][1]);c.lineTo(pts[3][0],pts[3][1]);
    c.quadraticCurveTo(pts[4][0],pts[4][1],pts[4][0],pts[4][1]-2);c.quadraticCurveTo(pts[5][0]+2,pts[5][1],pts[5][0],pts[5][1]);c.quadraticCurveTo(pts[6][0],pts[6][1],pts[0][0],pts[0][1]);c.closePath();};}
// a foreleg from the elbow E: the knee bends forward (towards -x); F the fetlock; pa the pastern's angle from straight down, forward positive
function mj_fore(E,F,pa,L1,L2){const dx=F[0]-E[0],dy=F[1]-E[1],d=Math.min(Math.hypot(dx,dy),L1+L2-0.5),a=Math.atan2(dy,dx),
    k=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),ka=a+k;      // + k: the knee comes forward (to the left, facing left)
  const K=[E[0]+Math.cos(ka)*L1,E[1]+Math.sin(ka)*L1],u=[-Math.sin(pa),Math.cos(pa)],C=[F[0]+u[0]*MJ_H.pastern,F[1]+u[1]*MJ_H.pastern];return{E,K,F,C,u,pa};}
function mj_hind(S,H,F,pa){const u=[-Math.sin(pa),Math.cos(pa)],C=[F[0]+u[0]*MJ_H.pastern,F[1]+u[1]*MJ_H.pastern];return{S,H,F,C,u,pa};}
// paints one leg: the bay forearm or gaskin, fading into the body at its top, over the black lower leg (white where the sock is), and the hoof
function mj_paintLeg(c,J,o){o=o||{};const deep=o.far?0.4:0,coat=mix(MJ_H.coat,[0,0,0],deep),pt=mix(MJ_H.point,[0,0,0],deep),hiA=o.far?0.35:0.6,
    shade=rgba(MJ_H.coatDeep,o.far?0.5:0.4),top=o.hind?J.S:J.E,low=o.hind?J.H:J.K,mid=[(low[0]+J.F[0])/2,(low[1]+J.F[1])/2];
  // the lower leg: the cannon with its tendon behind, the round fetlock, the sloping pastern
  // along the cannon's own line, so a lifted leg keeps its shape: a is the cannon's direction, down it from the knee or the hock
  const cl=Math.hypot(J.F[0]-low[0],J.F[1]-low[1])||1,a=[(J.F[0]-low[0])/cl,(J.F[1]-low[1])/cl],at=(P,d,dx)=>[P[0]+a[0]*d+(dx||0),P[1]+a[1]*d];
  const lower=mj_legPath([[...at(low,-8,o.hind?5:2),o.hind?36:38],[...at(low,12,o.hind?3:1),o.hind?30:34],[...at(mid,0,3),o.hind?28:26],[...at(J.F,-12,2),28],[...at(J.F,2,3),33],[(J.F[0]+J.C[0])/2,(J.F[1]+J.C[1])/2,24],[J.C[0],J.C[1]-4,25]]);
  const lc=o.sock?MJ_H.sock:pt,lh=o.sock?[255,255,255]:mix(MJ_H.pointHi,[0,0,0],deep);
  ag_soft(c,lower,lc,lh,mid[0]+18,mid[1]+20,90,rgba(o.sock?[120,110,96]:[0,0,0],0.5),10,o.sock?0.7:0.3);
  c.save();ag_shape(c,lower);c.clip();
  if(o.sock){const y0=J.F[1]-34,g=c.createLinearGradient(0,y0-10,0,y0+6);g.addColorStop(0,rgba(pt,1));g.addColorStop(1,rgba(pt,0));c.fillStyle=g;c.fillRect(low[0]-60,low[1]-30,120,y0+6-(low[1]-30));}
  c.strokeStyle=rgba(o.sock?[150,140,126]:[150,140,136],0.22);c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(...at(low,20,14));c.quadraticCurveTo(...at(mid,0,14),...at(J.F,-16,12));c.stroke();c.restore();
  if(o.lowerOnly)return mj_hoof(c,J,o,deep);
  // the forearm or the gaskin: wide at the body, tapering into the knee or the hock, drawn apart and faded in at its top
  const upper=o.hind?mj_legPath([[J.S[0]-4,J.S[1]-(o.far?60:18),o.far?58:44],[J.S[0]+2,J.S[1]+8,44],[(J.S[0]+J.H[0])/2+3,(J.S[1]+J.H[1])/2,40],[J.H[0]+5,J.H[1]-4,40],[J.H[0]+6,J.H[1]+8,36]])
                    :mj_legPath([[J.E[0]+2,J.E[1]-(o.far?60:36),80],[J.E[0]+(J.K[0]-J.E[0])*0.5,J.E[1]+(J.K[1]-J.E[1])*0.5,52],[J.K[0],J.K[1]-8,42],[J.K[0]-1,J.K[1]+8,40],[J.K[0]+(J.F[0]-J.K[0])*0.18,J.K[1]+(J.F[1]-J.K[1])*0.18,34]]);
  const bx=[top[0]-120,top[1]-80,240,low[1]-top[1]+130],[bc,bxc]=ag_buf("mjleg",Math.ceil(bx[2]*2),Math.ceil(bx[3]*2));
  bxc.scale(2,2);bxc.translate(-bx[0],-bx[1]);
  ag_soft(bxc,upper,coat,MJ_H.coatHi,top[0]+30,top[1]+40,110,shade,14,hiA*0.7);
  {const g0=bxc.createLinearGradient(0,top[1]-20,0,top[1]+50);g0.addColorStop(0,"rgba(40,18,8,0.34)");g0.addColorStop(1,"rgba(40,18,8,0)");bxc.save();ag_shape(bxc,upper);bxc.clip();bxc.fillStyle=g0;bxc.fillRect(top[0]-80,top[1]-60,160,120);bxc.restore();}
  const ul=Math.hypot(low[0]-top[0],low[1]-top[1])||1,b=[(low[0]-top[0])/ul,(low[1]-top[1])/ul],nf=[b[1],-b[0]];   // down the forearm, and towards its front
  bxc.save();ag_shape(bxc,upper);bxc.clip();let g=bxc.createLinearGradient(low[0]-b[0]*36,low[1]-b[1]*36,low[0]+b[0]*6,low[1]+b[1]*6);g.addColorStop(0,rgba(pt,0));g.addColorStop(1,rgba(pt,1));bxc.fillStyle=g;bxc.fillRect(low[0]-80,low[1]-80,160,160);
  // the knee's flat front, or the point of the hock
  bxc.strokeStyle=rgba(MJ_H.pointHi,0.3);bxc.lineWidth=3;bxc.lineCap="round";bxc.beginPath();if(o.hind){bxc.moveTo(low[0]+20,low[1]-8);bxc.quadraticCurveTo(low[0]+26,low[1]+2,low[0]+18,low[1]+10);}
  else{const f0=[low[0]+nf[0]*19-b[0]*12,low[1]+nf[1]*19-b[1]*12];bxc.moveTo(f0[0],f0[1]);bxc.lineTo(f0[0]+b[0]*18,f0[1]+b[1]*18);}bxc.stroke();bxc.restore();
  bxc.setTransform(1,0,0,1,0,0);if(!o.far){bxc.globalCompositeOperation="destination-in";g=bxc.createLinearGradient(0,(top[1]-bx[1]-30)*2,0,(top[1]-bx[1]+8)*2);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,1)");
  bxc.fillStyle=g;bxc.fillRect(0,0,bc.width,bc.height);bxc.globalCompositeOperation="source-over";}
  c.drawImage(bc,bx[0],bx[1],bx[2],bx[3]);
  mj_hoof(c,J,o,deep);}
// the hoof, flat on the ground when the pastern is at rest, tilting with it when the leg lifts
function mj_hoof(c,J,o,deep){
  const hf=mj_hoofPath(J.C,(o.rest!=null?J.pa-o.rest:0)*0.9);ag_soft(c,hf,o.sock?[178,160,130]:mix(MJ_H.hoof,[0,0,0],deep),o.sock?[236,222,196]:MJ_H.hoofHi,J.C[0]+4,J.C[1]+4,34,"rgba(0,0,0,0.4)",6,0.55);
  c.save();ag_shape(c,hf);c.clip();c.fillStyle=o.sock?"rgba(210,200,184,0.9)":rgba(mix(MJ_H.point,[0,0,0],0.2),0.8);c.beginPath();c.ellipse(J.C[0]-10,J.C[1]-3,28,7,0,0,TAU);c.fill();c.restore();}
// the legs at rest (and the tapping leg's poses come from mj_tap)
const MJ_REST=0.6;
const MJ_LEGS={nearFore:()=>mj_fore([320,470],[318,704],MJ_REST,150,86),farFore:()=>mj_fore([364,464],[366,698],MJ_REST,150,86),
  nearHind:()=>mj_hind([712,520],[724,604],[716,704],MJ_REST),farHind:()=>mj_hind([690,508],[700,596],[690,698],MJ_REST)};
// the tapping leg: u 0..1 through one tap (lift, strike, settle); returns its joints
function mj_tap(u){const E=[320,470],st=[318,704];
  // the fetlock's path: the knee swings forward and up, the cannon hangs from it with the hoof flexed back; then the leg reaches
  // forward and strikes down hard, a small rebound, and still
  const k=[[0,0,0,MJ_REST],[0.3,-84,-57,-0.9],[0.48,-46,-26,0.1],[0.62,-2,0,MJ_REST],[0.71,-2,-5,MJ_REST-0.05],[1,0,0,MJ_REST]];
  let i=1;while(i<k.length-1&&u>k[i][0])i++;const a=k[i-1],b=k[i],v=ag_sine((u-a[0])/((b[0]-a[0])||1));
  const F=[st[0]+lerp(a[1],b[1],v),st[1]+lerp(a[2],b[2],v)],pa=lerp(a[3],b[3],v);return mj_fore(E,F,pa,150,86);}
// the horse's kept pictures
function mj_hLayer(key,box,res,paint){return ag_kept("mjh:"+key,Math.ceil((box[2]-box[0])*res),Math.ceil((box[3]-box[1])*res),(c)=>{c.scale(res,res);c.translate(-box[0],-box[1]);paint(c);});}
const MJ_HBOX={far:[230,380,800,790],body:[150,100,840,640],hind:[540,380,820,790],head:[40,40,240,350],tail:[720,300,840,730]};
function mj_hParts(){
  const far=mj_hLayer("far",MJ_HBOX.far,MJ_H.res,c=>{mj_paintLeg(c,MJ_LEGS.farHind(),{hind:1,far:1,rest:MJ_REST});mj_paintLeg(c,MJ_LEGS.farFore(),{far:1,rest:MJ_REST});});
  const tail=mj_hLayer("tail",MJ_HBOX.tail,MJ_H.res,c=>{ag_soft(c,mj_hTail,MJ_H.point,MJ_H.pointHi,812,440,120,"rgba(0,0,0,0.55)",18,0.5);
    c.save();ag_shape(c,mj_hTail);c.clip();c.filter="blur(2px)";c.lineCap="round";const R=ag_rnd(9);
    for(let i=0;i<9;i++){const x0=752+R()*40,lit=x0>778;c.strokeStyle=lit?"rgba(170,160,156,0.16)":"rgba(10,8,8,0.2)";c.lineWidth=3+R()*3;
      c.beginPath();c.moveTo(x0-6,330);c.bezierCurveTo(x0+22,430,x0+16+R()*10,560,x0+2+R()*12,712);c.stroke();}c.filter="none";c.restore();});
  const body=mj_hLayer("body",MJ_HBOX.body,MJ_H.res,c=>{
    ag_soft(c,mj_hBody,MJ_H.coat,MJ_H.coatHi,620,300,400,rgba(MJ_H.coatDeep,0.55),34,0.55);
    // soft light on the quarters and the shoulder, shade under the barrel and in the flank, a sheen along the back
    c.save();ag_shape(c,mj_hBody);c.clip();
    const glow=(x,y,r,col,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);};
    glow(712,356,118,[240,176,120],0.34);glow(330,336,104,[240,176,120],0.22);glow(276,250,80,[240,176,120],0.14);
    glow(640,452,70,[40,18,8],0.3);glow(380,470,90,[40,18,8],0.28);glow(560,470,140,[40,18,8],0.24);
    c.save();c.translate(480,528);c.scale(1,0.2);let g=c.createRadialGradient(0,0,0,0,0,330);g.addColorStop(0,"rgba(40,18,8,0.4)");g.addColorStop(1,"rgba(40,18,8,0)");c.fillStyle=g;c.fillRect(-340,-340,680,680);c.restore();
    g=c.createLinearGradient(0,560,0,610);g.addColorStop(0,rgba(MJ_H.point,0));g.addColorStop(1,rgba(MJ_H.point,1));c.fillStyle=g;c.fillRect(690,560,80,80);
    glow(742,560,40,[40,18,8],0.3);
    c.lineCap="round";c.filter="blur(6px)";c.strokeStyle="rgba(40,18,8,0.13)";c.lineWidth=10;
    c.beginPath();c.moveTo(396,304);c.bezierCurveTo(356,360,326,420,308,476);c.stroke();                  // behind the shoulder blade
    c.beginPath();c.moveTo(666,470);c.bezierCurveTo(674,424,700,388,744,358);c.stroke();                  // the stifle, up the quarters
    c.strokeStyle="rgba(255,222,186,0.2)";c.lineWidth=7;c.beginPath();c.moveTo(420,306);c.bezierCurveTo(520,318,620,306,712,298);c.stroke();
    c.filter="none";c.restore();
    ag_soft(c,mj_hMane,MJ_H.point,MJ_H.pointHi,300,190,150,"rgba(0,0,0,0.5)",12,0.4);
    c.save();ag_shape(c,mj_hMane);c.clip();c.filter="blur(1.5px)";c.strokeStyle="rgba(150,140,136,0.16)";c.lineWidth=3;c.lineCap="round";
    for(let i=0;i<9;i++){const u=(i+0.5)/9,x=lerp(200,392,u),y=lerp(128,286,u);c.beginPath();c.moveTo(x-4,y-4);c.quadraticCurveTo(x+8,y+18,x-4,y+40);c.stroke();}c.filter="none";c.restore();});
  const hind=mj_hLayer("hind",MJ_HBOX.hind,MJ_H.res,c=>mj_paintLeg(c,MJ_LEGS.nearHind(),{hind:1,sock:1,rest:MJ_REST,lowerOnly:1}));
  const head=mj_hLayer("head",MJ_HBOX.head,3,c=>mj_paintHead(c));
  return{far,tail,body,hind,head};}
function mj_paintHead(c){
  ag_soft(c,c2=>mj_hEars(c2,false),mix(MJ_H.coat,[0,0,0],0.25),MJ_H.coatHi,214,90,40,"rgba(0,0,0,0.4)",8,0.4);
  ag_soft(c,mj_hHead,MJ_H.coat,MJ_H.coatHi,176,170,150,rgba(MJ_H.coatDeep,0.55),22,0.55);
  c.save();ag_shape(c,mj_hHead);c.clip();
  // the muzzle darker and soft, the face's bony ridge in light, the hollow above the eye
  let g=c.createRadialGradient(70,300,0,70,300,74);g.addColorStop(0,"rgba(34,20,16,0.75)");g.addColorStop(1,"rgba(34,20,16,0)");c.fillStyle=g;c.fillRect(0,220,160,140);
  c.filter="blur(3px)";c.strokeStyle="rgba(255,214,170,0.2)";c.lineWidth=7;c.lineCap="round";c.beginPath();c.moveTo(152,138);c.bezierCurveTo(124,178,100,218,80,258);c.stroke();
  c.strokeStyle="rgba(40,18,8,0.28)";c.lineWidth=5;c.beginPath();c.moveTo(150,150);c.quadraticCurveTo(164,150,176,160);c.stroke();c.filter="none";c.restore();
  ag_soft(c,mj_hCheek,mix(MJ_H.coat,[255,255,255],0.03),MJ_H.coatHi,192,230,60,rgba(MJ_H.coatDeep,0.3),16,0.5);
  // the nostril and the lips
  c.fillStyle="rgba(20,12,10,0.7)";c.beginPath();c.moveTo(72,276);c.quadraticCurveTo(84,272,88,288);c.quadraticCurveTo(80,292,74,288);c.closePath();c.fill();
  c.strokeStyle="rgba(20,12,10,0.45)";c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(68,318);c.quadraticCurveTo(84,315,102,320);c.stroke();
  ag_soft(c,c2=>mj_hEars(c2,true),MJ_H.coat,MJ_H.coatHi,192,80,50,rgba(MJ_H.coatDeep,0.5),8,0.5);
  c.fillStyle="rgba(30,16,12,0.5)";c.beginPath();c.moveTo(184,120);c.bezierCurveTo(182,100,184,82,188,68);c.bezierCurveTo(192,82,194,104,194,124);c.closePath();c.fill();
  ag_soft(c,mj_hForelock,MJ_H.point,MJ_H.pointHi,180,130,40,"rgba(0,0,0,0.4)",6,0.4);
  // the bridle: the crownpiece behind the ears, the browband, the cheekpiece to the bit, the noseband, the throatlatch
  const lea="rgb(46,34,28)";c.strokeStyle=lea;c.lineCap="round";c.lineJoin="round";c.lineWidth=6;
  c.beginPath();c.moveTo(198,128);c.bezierCurveTo(186,170,160,226,112,300);c.stroke();
  c.beginPath();c.moveTo(196,132);c.quadraticCurveTo(178,140,160,146);c.stroke();
  c.beginPath();c.moveTo(152,266);c.bezierCurveTo(130,260,106,250,84,238);c.stroke();
  c.beginPath();c.moveTo(196,136);c.bezierCurveTo(208,170,214,200,208,236);c.stroke();
  c.strokeStyle="rgba(255,236,210,0.16)";c.lineWidth=2;c.beginPath();c.moveTo(196,126);c.bezierCurveTo(184,168,158,224,110,298);c.stroke();
  c.fillStyle="rgb(170,160,150)";c.beginPath();c.arc(112,302,6,0,TAU);c.fill();c.strokeStyle="rgba(60,50,44,0.6)";c.lineWidth=1.5;c.stroke();}
// the eye, live: open, blinking; at the eye (146, 173) in the head's space. A dark eye with a brown rim, the window's light in it, the
// upper lid's lashes and a soft hollow above
function mj_hEye(c,blink){c.save();const by=Math.max(0.08,1-blink),x=146,y=173;
  c.fillStyle="rgba(30,16,12,0.45)";c.beginPath();c.ellipse(x,y+1,15.5,12,-0.35,0,TAU);c.fill();
  c.save();c.translate(x,y);c.rotate(-0.35);c.scale(1,by);
  let g=c.createRadialGradient(-2,1,0,0,0,12);g.addColorStop(0,"#0E0806");g.addColorStop(0.62,"#1C0F0A");g.addColorStop(1,"#4A2818");c.fillStyle=g;c.beginPath();c.ellipse(0,0,12,8.6,0,0,TAU);c.fill();
  c.fillStyle="rgba(255,255,255,0.88)";c.beginPath();c.ellipse(4.5,-3.2,3.6,2.3,0.2,0,TAU);c.fill();
  c.fillStyle="rgba(255,255,255,0.35)";c.beginPath();c.arc(-5,3,1.4,0,TAU);c.fill();c.restore();
  // the upper lid, lowering as it blinks, with its lashes; a pale line under the eye
  const ly=lerp(166,180,1-by);c.strokeStyle="rgba(34,16,8,0.75)";c.lineWidth=2.6;c.lineCap="round";c.beginPath();c.moveTo(131,171);c.quadraticCurveTo(146,ly-8,161,166);c.stroke();
  c.lineWidth=1.4;for(const [u,d] of [[0.62,5],[0.74,6],[0.86,5]]){const px=lerp(131,161,u),py=lerp(171,166,u)-8*Math.sin(u*Math.PI)*(1-(1-by)*0.6);c.beginPath();c.moveTo(px,py);c.lineTo(px+d*0.8,py-d*0.7);c.stroke();}
  c.strokeStyle="rgba(255,214,170,0.22)";c.lineWidth=2;c.beginPath();c.moveTo(135,183);c.quadraticCurveTo(147,188,158,180);c.stroke();c.restore();}
// large square leather blinkers, on the cheekpiece at the eye
function mj_hBlinker(c,a){if(a<=0)return;c.save();c.globalAlpha*=a;c.translate(150,176);c.rotate(-0.42);
  const sh=cc=>ag_rect(cc,-36,-30,72,62,10);ag_soft(c,sh,[50,38,32],[120,96,80],14,-20,60,"rgba(0,0,0,0.5)",8,0.5);
  c.strokeStyle="rgba(200,180,160,0.35)";c.lineWidth=2;c.setLineDash([4,5]);ag_shape(c,cc=>ag_rect(cc,-30,-24,60,50,7));c.stroke();c.setLineDash([]);c.restore();}
/* Hans: (x, y) where his near forefoot stands on the ground, s his size (1: as drawn, the withers 468 above the ground); o:
   t the time (breathing, the tail, the ears, a blink now and then); tap 0 to 1 through one tap of the right forefoot (or o.taps,
   a list of times, each starting a tap of 0.6 s); head, a small nod in radians (plus looks down); blink; blinkers 0 to 1; flip to face right */
function mj_horse(ctx,x,y,s,o){o=o||{};const t=o.t||0,P=mj_hParts(),R=MJ_H.res;
  let tap=o.tap==null?0:o.tap;if(o.taps){for(const t0 of o.taps)if(t>=t0&&t<t0+0.6)tap=(t-t0)/0.6;}
  const breath=Math.sin(t*TAU/3.4)*1.2,sway=Math.sin(t*0.9)*0.025+Math.sin(t*2.3)*0.008,nod=(o.head||0)+Math.sin(tap*Math.PI)*0.035,
    blink=o.blink!=null?o.blink:mj_hBlinkAt(t);
  ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.translate(-316,-MJ_H.ground);
  // his shadow on the ground, falling a little to the left
  ag_floorShadow(ctx,470,MJ_H.ground+4,330,20,0.32);ag_floorShadow(ctx,316,MJ_H.ground+2,40,8,0.3);ag_floorShadow(ctx,742,MJ_H.ground+2,40,8,0.3);
  const draw=(L,b)=>ctx.drawImage(L,b[0],b[1],b[2]-b[0],b[3]-b[1]);
  draw(P.far,MJ_HBOX.far);
  ctx.save();ctx.translate(748,322);ctx.rotate(sway);ctx.translate(-748,-322);draw(P.tail,MJ_HBOX.tail);ctx.restore();
  draw(P.hind,MJ_HBOX.hind);
  ctx.save();ctx.translate(0,breath*0.4);draw(P.body,MJ_HBOX.body);ctx.restore();
  ctx.save();mj_paintLeg(ctx,tap>0&&tap<1?mj_tap(tap):MJ_LEGS.nearFore(),{rest:MJ_REST});ctx.restore();
  // the head turns about the throat; the ears follow it
  ctx.save();ctx.translate(200,200);ctx.rotate(nod);ctx.translate(-200,-200);ctx.translate(190,122);ctx.scale(0.8,0.8);ctx.translate(-190,-122);draw(P.head,MJ_HBOX.head);mj_hEye(ctx,blink);mj_hBlinker(ctx,o.blinkers||0);
  if(o.headDraw)o.headDraw(ctx);ctx.restore();
  ctx.restore();}
function mj_hBlinkAt(t){const k=Math.floor(t/5.1+3),ph=t-((k-3)*5.1+2.3+1.9*hash(k,7));return ph>0&&ph<0.18?Math.sin(ph/0.18*Math.PI):0;}
// where a point of Hans's space lands in the frame, for a horse drawn at (x, y, s)
function mj_hAt(x,y,s,p,flip){return[x+(p[0]-316)*s*(flip?-1:1),y+(p[1]-MJ_H.ground)*s];}

/* ---------------------------------------------------------------- the courtyard
   A paved courtyard in the north of Berlin, among apartment houses of five storeys: seen from inside it, at a person's eye height
   (1.6 m), looking at the brick wall at its back with the arched wooden door of the stable, the rear house's windows above it, and the
   side houses' plastered fronts with white-framed windows. Noon light from the right: the left houses' fronts are lit, the right ones
   in shade, and the shadows fall to the left. mj_P(X, Y, Z) puts a point of the courtyard (in metres: X across, Y up, Z away from us)
   in the frame; things that stand in it (Hans, the people, the blackboard) use the same, so they sit on its ground. */
const MJ_CY={back:12,left:-7.5,right:7.5,rear:16};
/* the cameras the courtyard is seen from: wide, at eye height; mid, low and closer, on the slate and Hans's forequarters; head, close
   on his head and the people by it; high, from a first-floor window behind us, so the commission's half circle reads. f the focal
   length in px, eye the camera's height, (cx, cy) where the horizon's middle falls in the frame, X0 where it stands across the
   courtyard, Z0 how far behind the courtyard's front it stands. A shot sets its camera (mj_cam), so what it draws sits on the place painted from the same one. */
const MJ_CAMS={wide:{f:900,eye:1.6,cx:960,cy:470,X0:0},mid:{f:1500,eye:1.0,cx:960,cy:480,X0:-0.86,dof:6.2},head:{f:1900,eye:1.7,cx:960,cy:520,X0:-1.6,dof:5.4},
  high:{f:1100,eye:3.4,cx:960,cy:330,X0:-0.3,Z0:-3.5}};
let MJ_CAM=MJ_CAMS.wide;
const mj_cam=k=>{MJ_CAM=MJ_CAMS[k]||k;return MJ_CAM;};
const mj_P=(X,Y,Z)=>{const d=Z-(MJ_CAM.Z0||0);return[MJ_CAM.cx+MJ_CAM.f*(X-MJ_CAM.X0)/d,MJ_CAM.cy-MJ_CAM.f*(Y-MJ_CAM.eye)/d];};
const mj_k=Z=>MJ_CAM.f/(Z-(MJ_CAM.Z0||0));                                                          // pixels per metre at depth Z
// Hans and the others in the courtyard, in metres: where Hans's near forefoot stands, where von Osten stands, the blackboard
const MJ_AT={hans:[-0.6,4.6],osten:[-2.3,4.1],board:[-3.9,5.4]};
// Hans at a point of the courtyard: his size from the depth (his withers 1.6 m above the ground)
function mj_hansAt(ctx,X,Z,o){const p=mj_P(X,0,Z);mj_horse(ctx,p[0],p[1],mj_k(Z)*1.6/468,o);return{p,s:mj_k(Z)*1.6/468};}
// someone standing at a point of the courtyard, h metres tall
function mj_standAt(ctx,X,Z,h,P,o){const p=mj_P(X,0,Z);return mj_figure(ctx,p[0],p[1],mj_k(Z)*h,P,o);}
function mj_quad(c,a,b,d,e){c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();}
// a window on a plane: corners from a function (u, v) -> frame point, in metres on the plane; white frame, sill, lintel, dark panes
function mj_window(c,F,u0,v0,w,h,o){o=o||{};const q=(u,v)=>F(u,v),fr=0.09;
  c.fillStyle=o.frame||"rgb(238,235,228)";c.beginPath();mj_quad(c,q(u0-fr,v0-fr),q(u0+w+fr,v0-fr),q(u0+w+fr,v0+h+fr),q(u0-fr,v0+h+fr));c.fill();
  const g=c.createLinearGradient(0,q(u0,v0+h)[1],0,q(u0,v0)[1]);g.addColorStop(0,o.glass2||"rgb(132,140,146)");g.addColorStop(1,o.glass||"rgb(96,104,112)");
  c.fillStyle=g;c.beginPath();mj_quad(c,q(u0,v0),q(u0+w,v0),q(u0+w,v0+h),q(u0,v0+h));c.fill();
  // the sky's soft light in the upper panes, the window's cross
  c.fillStyle="rgba(210,220,228,0.18)";c.beginPath();mj_quad(c,q(u0,v0+h*0.62),q(u0+w,v0+h*0.62),q(u0+w,v0+h),q(u0,v0+h));c.fill();
  c.strokeStyle=o.frame||"rgb(238,235,228)";c.lineWidth=Math.max(1.2,o.lw||2);c.beginPath();const m1=q(u0+w/2,v0),m2=q(u0+w/2,v0+h),n1=q(u0,v0+h*0.62),n2=q(u0+w,v0+h*0.62);
  c.moveTo(m1[0],m1[1]);c.lineTo(m2[0],m2[1]);c.moveTo(n1[0],n1[1]);c.lineTo(n2[0],n2[1]);c.stroke();
  // the sill (a little lighter) and the lintel's moulding
  c.fillStyle="rgba(255,252,246,0.75)";c.beginPath();mj_quad(c,q(u0-0.16,v0-0.2),q(u0+w+0.16,v0-0.2),q(u0+w+0.16,v0-0.1),q(u0-0.16,v0-0.1));c.fill();
  c.fillStyle="rgba(255,252,246,0.5)";c.beginPath();mj_quad(c,q(u0-0.2,v0+h+0.16),q(u0+w+0.2,v0+h+0.16),q(u0+w+0.2,v0+h+0.32),q(u0-0.2,v0+h+0.32));c.fill();}
function mj_paintCourtyard(c,o){o=o||{};const C=MJ_CY,au=!!o.autumn,R=ag_rnd(au?71:17);
  const light=au?[236,222,200]:[248,236,212],shadeTint=au?[150,156,170]:[160,160,166];
  // the sky, a strip above the rear house, pale
  let g=c.createLinearGradient(0,0,0,300);g.addColorStop(0,au?"#C9CFD6":"#CFD8DE");g.addColorStop(1,au?"#DCDDDB":"#E6E8E4");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the rear house behind the wall: plaster, its windows in rows
  const rz=C.rear,rearF=(u,v)=>mj_P(u,v,rz);
  c.fillStyle=au?"rgb(204,196,182)":"rgb(214,204,186)";c.beginPath();mj_quad(c,rearF(C.left-2,0),rearF(C.right+2,0),rearF(C.right+2,20),rearF(C.left-2,20));c.fill();
  for(let fl=1;fl<5;fl++)for(let k=-4;k<=4;k++){const u=k*1.9-0.5,v=fl*3.4+0.9;mj_window(c,rearF,u,v,1.0,1.75,{lw:1.5,frame:"rgb(232,228,220)"});}
  c.fillStyle="rgba(230,232,232,0.22)";c.fillRect(0,0,W,mj_P(0,3.2,C.back)[1]);
  // storey lines on the rear house
  c.strokeStyle="rgba(120,110,96,0.18)";c.lineWidth=2;for(let fl=1;fl<6;fl++){const a=rearF(C.left-2,fl*3.4+0.3),b=rearF(C.right+2,fl*3.4+0.3);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  // the side houses' fronts, receding: the left one lit, the right one in shade
  const leftF=(u,v)=>mj_P(C.left,v,u),rightF=(u,v)=>mj_P(C.right,v,u);
  const side=(F,lit)=>{const base=lit?(au?[220,206,182]:[230,216,190]):(au?[168,164,160]:[176,170,162]);
    c.fillStyle=rgba(base,1);c.beginPath();mj_quad(c,F(1.2,0),F(C.back,0),F(C.back,22),F(1.2,22));c.fill();
    // the plinth, a darker band of render at the foot
    c.fillStyle=lit?"rgba(120,100,80,0.22)":"rgba(70,66,64,0.22)";c.beginPath();mj_quad(c,F(1.2,0),F(C.back,0),F(C.back,0.8),F(1.2,0.8));c.fill();
    for(let fl=0;fl<5;fl++)for(let z=2.6;z<C.back-0.8;z+=2.3){const v=fl*3.4+(fl?0.9:1.3);mj_window(c,F,z,v,1.0,1.8,{lw:1.6,glass:lit?"rgb(104,110,118)":"rgb(84,90,98)",glass2:lit?"rgb(140,146,150)":"rgb(112,118,124)",frame:lit?"rgb(236,232,224)":"rgb(190,190,190)"});}
    c.strokeStyle=lit?"rgba(150,130,104,0.22)":"rgba(80,80,84,0.2)";c.lineWidth=3;for(let fl=1;fl<6;fl++){const a=F(1.2,fl*3.4+0.3),b=F(C.back,fl*3.4+0.3);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}};
  side(leftF,true);side(rightF,false);
  // the brick wall across the back, three metres, with a coping
  const bw=(u,v)=>mj_P(u,v,C.back),bTop=3.1,bc=au?[166,102,80]:[176,108,80];
  c.fillStyle=rgba(bc,1);c.beginPath();mj_quad(c,bw(C.left,0),bw(C.right,0),bw(C.right,bTop),bw(C.left,bTop));c.fill();
  {const k=mj_k(C.back),y0=bw(0,0)[1],x0=bw(C.left,0)[0],x1=bw(C.right,0)[0],bh=0.075*k,bl=0.25*k;
    for(let r=0;r*bh<bTop*k;r++){const y=y0-(r+1)*bh,off=(r%2)*bl/2;for(let x=x0-off;x<x1;x+=bl){const t=(R()-0.5)*16;c.fillStyle=rgba(mix(bc,[t>0?220:90,t>0?140:50,t>0?110:36],Math.abs(t)/40),1);
      c.fillRect(Math.max(x0,x+1),y+1,Math.min(bl-2,x1-x-1),bh-1.5);}}
    c.fillStyle="rgba(214,204,188,0.35)";for(let r=0;r*bh<bTop*k;r++)c.fillRect(x0,y0-r*bh-1,x1-x0,1);}
  c.fillStyle="rgb(150,146,140)";c.beginPath();mj_quad(c,bw(C.left-0.05,bTop),bw(C.right+0.05,bTop),bw(C.right+0.05,bTop+0.16),bw(C.left-0.05,bTop+0.16));c.fill();
  c.fillStyle="rgba(255,255,255,0.3)";c.beginPath();mj_quad(c,bw(C.left-0.05,bTop+0.12),bw(C.right+0.05,bTop+0.12),bw(C.right+0.05,bTop+0.16),bw(C.left-0.05,bTop+0.16));c.fill();
  // the stable's arched wooden door, set in the wall
  {const d0=1.6,dw=2.0,dh=2.2,ar=dw/2,k=mj_k(C.back),p0=bw(d0,0),p1=bw(d0+dw,0),top=bw(d0,dh)[1],cx=(p0[0]+p1[0])/2,r=ar*k;
    const door=cc=>{cc.moveTo(p0[0],p0[1]);cc.lineTo(p0[0],top);cc.arc(cx,top,r,Math.PI,0);cc.lineTo(p1[0],p1[1]);cc.closePath();};
    c.fillStyle="rgb(120,84,58)";c.beginPath();c.moveTo(p0[0]-0.18*k,p0[1]);c.lineTo(p0[0]-0.18*k,top);c.arc(cx,top,r+0.18*k,Math.PI,0);c.lineTo(p1[0]+0.18*k,p1[1]);c.closePath();c.fillStyle="rgba(130,74,52,1)";c.fill();
    ag_soft(c,door,[104,72,48],[160,118,80],p1[0]-r*0.4,top-r*0.2,r*2.4,"rgba(30,16,8,0.5)",14,0.5);
    c.save();ag_shape(c,door);c.clip();c.strokeStyle="rgba(40,24,14,0.45)";c.lineWidth=2;for(let x=p0[0]+r/4;x<p1[0];x+=r/4){c.beginPath();c.moveTo(x,top-r);c.lineTo(x,p0[1]);c.stroke();}
    c.beginPath();c.moveTo(cx,top-r);c.lineTo(cx,p0[1]);c.lineWidth=4;c.stroke();
    c.fillStyle="rgb(52,48,46)";for(const y of [top+0.2*k,p0[1]-0.5*k])for(const s of [-1,1]){c.fillRect(s<0?p0[0]:cx+4,y,r*0.8,5);}c.restore();
    // a horseshoe over the door
    c.strokeStyle="rgb(70,66,62)";c.lineWidth=4;c.beginPath();c.arc(cx,top-r-0.32*k,0.1*k,0.2,Math.PI-0.2,true);c.stroke();}
  // the cobbles: granite setts in rows that recede, with sandy patches; painted apart and laid down a touch soft, as the room's floor is
  {const cobC=mkCanvas(W,H),cc0=c;c=cobC.getContext("2d");const z0=MJ_CAM.dof?0.6:1.2,z1=C.back;let z=z0;const rows=[];while(z<z1){const d=0.11*Math.pow(z/3,0.25);rows.push([z,z+d]);z+=d;}
    c.fillStyle=au?"rgb(150,142,130)":"rgb(158,148,134)";c.beginPath();mj_quad(c,mj_P(C.left,0,z0),mj_P(C.right,0,z0),mj_P(C.right,0,z1),mj_P(C.left,0,z1));c.fill();
    for(const [za,zb] of rows){const ya=mj_P(0,0,za)[1],yb=mj_P(0,0,zb)[1],hh=ya-yb;if(hh<0.8)continue;let x=C.left+R()*0.12;
      while(x<C.right){const w=0.13+R()*0.08,a=mj_P(x+0.012,0,za),b=mj_P(x+w-0.012,0,za),d=mj_P(x+w-0.012,0,zb),e=mj_P(x+0.012,0,zb),v=(R()-0.5);
        const sand=AG_NZ.fbm(x*0.3+3,za*0.5+9,3);const base=mix([160+v*12,153+v*11,144+v*10],[196,182,154],clamp((sand-0.55)*2,0,1)*0.6);
        c.fillStyle=rgba(base,1);c.beginPath();const rr2=Math.min(hh*0.3,(b[0]-a[0])*0.25);c.moveTo(a[0]+rr2,a[1]);c.lineTo(b[0]-rr2,b[1]);c.quadraticCurveTo(b[0],b[1],(b[0]+d[0])/2,(b[1]+d[1])/2);
        c.quadraticCurveTo(d[0],d[1],d[0]-rr2*0.6,d[1]);c.lineTo(e[0]+rr2*0.6,e[1]);c.quadraticCurveTo(e[0],e[1],(a[0]+e[0])/2,(a[1]+e[1])/2);c.quadraticCurveTo(a[0],a[1],a[0]+rr2,a[1]);c.fill();
        if(hh>3){c.fillStyle="rgba(255,250,236,0.12)";c.fillRect(e[0]+rr2,e[1]+0.5,(d[0]-e[0])-2*rr2,Math.max(1,hh*0.22));}
        x+=w;}}
    // sand drifted along the walls' feet
    g=c.createLinearGradient(0,mj_P(0,0,C.back)[1],0,mj_P(0,0,C.back)[1]+40);g.addColorStop(0,"rgba(214,198,166,0.7)");g.addColorStop(1,"rgba(214,198,166,0)");c.fillStyle=g;
    c.beginPath();mj_quad(c,mj_P(C.left,0,C.back),mj_P(C.right,0,C.back),mj_P(C.right,0,C.back-1.4),mj_P(C.left,0,C.back-1.4));c.fill();
    c=cc0;c.save();c.filter="blur(0.7px)";c.drawImage(cobC,0,0);c.restore();}
  // the light: the right house's shadow over the right of the courtyard, falling left; the walls' contact shade
  c.save();c.globalCompositeOperation="multiply";const sh=au?"rgb(178,182,196)":"rgb(196,196,204)";
  c.fillStyle=sh;c.beginPath();mj_quad(c,mj_P(C.right,0,1.2),mj_P(C.right-(au?3.6:2.4),0,1.2),mj_P(C.right-(au?3.0:1.8),0,C.back),mj_P(C.right,0,C.back));c.fill();
  c.fillStyle=sh;c.beginPath();mj_quad(c,bw(C.right-(au?3.0:1.8),0),bw(C.right,0),bw(C.right,3.4),bw(C.right-(au?2.6:1.4),3.4));c.fill();
  c.restore();
  g=c.createLinearGradient(0,mj_P(0,0,C.back)[1],0,mj_P(0,0,C.back)[1]+30);g.addColorStop(0,"rgba(40,30,24,0.22)");g.addColorStop(1,"rgba(40,30,24,0)");c.fillStyle=g;c.fillRect(0,mj_P(0,0,C.back)[1],W,30);
  // the sun's warmth from the right, the left side and the near corners in soft shade, as in the room
  g=c.createRadialGradient(1700,-80,40,1500,60,1600);g.addColorStop(0,rgba(light,au?0.2:0.3));g.addColorStop(1,rgba(light,0));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.14)");g.addColorStop(0.35,"rgba(40,34,28,0.02)");g.addColorStop(1,"rgba(40,34,28,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,H-260,0,H);g.addColorStop(0,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(40,34,28,0.16)");c.fillStyle=g;c.fillRect(0,H-260,W,260);
  if(au){c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(232,234,242)";c.fillRect(0,0,W,H);c.restore();
    // a few fallen leaves on the cobbles
    const L=ag_rnd(23);for(let i=0;i<46;i++){const X=C.left+L()*(C.right-C.left),Z=1.6+L()*9,p=mj_P(X,0,Z),k=mj_k(Z),s=0.08*k,a=L()*TAU,col=[[176,112,52],[196,148,64],[150,84,46]][i%3];
      c.save();c.translate(p[0],p[1]);c.scale(1,0.45);c.rotate(a);c.fillStyle=rgba(col,0.9);c.beginPath();c.moveTo(-s,0);c.quadraticCurveTo(0,-s*0.7,s,0);c.quadraticCurveTo(0,s*0.7,-s,0);c.fill();
      c.strokeStyle="rgba(90,50,24,0.5)";c.lineWidth=1;c.beginPath();c.moveTo(-s,0);c.lineTo(s,0);c.stroke();c.restore();}}}
// a place painted from a camera; a close camera blurs what lies beyond its depth of field, as a lens would
function mj_courtyardFrom(cam,o){return c=>{const old=MJ_CAM;MJ_CAM=MJ_CAMS[cam];
  if(MJ_CAM.dof){const cv=mkCanvas(W,H),x=cv.getContext("2d");mj_paintCourtyard(x,o);c.save();c.filter="blur(7px)";c.drawImage(cv,0,0);c.restore();
    // the ground near the camera stays sharp: the courtyard again, clipped below the line where the depth of field ends
    const yd=mj_P(0,0,MJ_CAM.dof)[1];x.globalCompositeOperation="destination-in";const g=x.createLinearGradient(0,yd-40,0,yd+80);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,1)");
    x.fillStyle=g;x.fillRect(0,0,W,H);x.globalCompositeOperation="source-over";c.drawImage(cv,0,0);}
  else mj_paintCourtyard(c,o);
  MJ_CAM=old;};}
AG_PLACES.mjNoon=mj_courtyardFrom("wide",{});
AG_PLACES.mjNoonHead=mj_courtyardFrom("head",{});
AG_PLACES.mjNoonMid=mj_courtyardFrom("mid",{});
AG_PLACES.mjNoonHigh=mj_courtyardFrom("high",{});
AG_PLACES.mjAutumn=mj_courtyardFrom("wide",{autumn:true});
AG_PLACES.mjAutumnHead=mj_courtyardFrom("head",{autumn:true});

/* ---------------------------------------------------------------- the people of 1904, full length
   For the wide shots, where people stand in the courtyard with their feet on its ground: mj_figure(ctx, x, y, h, P, o) draws a person
   standing at (x, y) (where their feet meet the ground), h px from the soles to the crown, in three-quarter view facing right (o.flip
   for left). Drawn in a space 750 units tall (a head is 100), with an adult's proportions (seven and a half heads), matte and lit from
   the right, dressed for 1904: men in dark suits or frock coats with a white high collar, a tie, and a bowler, a top hat or a soft hat;
   women in long skirts, blouses with high collars and full sleeves, and wide hats. P: {skin, hair, beard, moustache, coat, coatLen
   ("frock" to the knee, "sack" to the hip, "long" below the knee), trousers, hat: {kind: "bowler"|"top"|"slouch"|"wide"|"cap", c, trim},
   woman, skirt, blouse}. o: t, nod (the head, in radians; up is negative), arms ("hang", "behind", "hold" (hands together in front),
   "point" (the far arm up and forward), "ask" (an open hand forward), "book" (a notebook in front of the chest), "hat" (the hat held in
   both hands)), arms2 and mix (0 to 1: on the way to a second pose), cloud (a function
   that draws above the head: (ctx, x, y, scale)). Returns where the head is, in the frame. */
const MJ_SH={far:[66,-592,44],near:[-70,-592,48]};
const MJ_ARMS={hang:{far:[MJ_SH.far,[84,-462,34],[80,-356,28]],near:[MJ_SH.near,[-92,-460,38],[-88,-352,30]]},
  hold:{far:[MJ_SH.far,[86,-470,34],[30,-418,28]],near:[MJ_SH.near,[-90,-470,38],[-8,-420,30]]},
  behind:{far:[MJ_SH.far,[82,-470,34],[60,-386,28]],near:[MJ_SH.near,[-88,-470,38],[-52,-392,30]]},
  point:{far:[MJ_SH.far,[128,-542,34],[196,-600,28]],near:[MJ_SH.near,[-92,-460,38],[-88,-352,30]]},
  ask:{far:[MJ_SH.far,[110,-500,34],[150,-520,28]],near:[MJ_SH.near,[-90,-470,38],[-8,-420,30]]},
  book:{far:[MJ_SH.far,[84,-476,34],[40,-480,28]],near:[MJ_SH.near,[-90,-480,38],[-10,-468,30]]},
  hat:{far:[MJ_SH.far,[86,-470,34],[34,-430,28]],near:[MJ_SH.near,[-90,-470,38],[-8,-432,30]]}};
function mj_figure(ctx,x,y,h,P,o){o=o||{};const k=h/750,t=o.t||0,br=Math.sin(t*TAU*0.27+(P.seed||0))*1.5,fl=o.flip?-1:1;
  ctx.save();ctx.translate(x,y);
  ag_floorShadow(ctx,-50*k,4*k,(P.woman?170:110)*k,14*k,0.32);
  ctx.scale(fl*k,k);
  const sk=P.skin||[232,196,170],dark=(c,a)=>mix(c,[0,0,0],a==null?0.35:a),lite=c=>mix(c,[255,255,255],0.35);
  const S=(fn,c,lx,ly,r,a)=>ag_soft(ctx,fn,c,lite(c),lx,ly,r,rgba(mix(c,[20,12,8],0.6),0.42),8,a==null?0.45:a);
  const coat=P.coat||[46,46,52],trou=P.trousers||dark(coat,0.15),hand=(hx,hy,a,far)=>S(c=>{c.save();c.translate(hx,hy);c.rotate(a||0);c.moveTo(-13,-6);c.bezierCurveTo(-16,16,-8,34,4,36);
      c.bezierCurveTo(16,36,18,18,15,-6);c.closePath();c.restore();},far?dark(sk,0.15):sk,hx+6,hy+8,26,0.5);
  // the legs and shoes, or the skirt
  if(P.woman){const sk2=P.skirt||[70,64,70];
    S(c=>{c.moveTo(-48,-452);c.bezierCurveTo(-74,-380,-120,-170,-140,-8);c.quadraticCurveTo(0,8,136,-8);c.bezierCurveTo(118,-170,72,-380,46,-452);c.closePath();},sk2,60,-300,240,0.4);
    ctx.save();ctx.strokeStyle=rgba(dark(sk2,0.4),0.3);ctx.lineWidth=4;ctx.lineCap="round";for(const xx of [-60,-10,40]){ctx.beginPath();ctx.moveTo(xx*0.35,-430);ctx.quadraticCurveTo(xx*0.9,-220,xx*1.9,-12);ctx.stroke();}ctx.restore();
    S(c=>{c.moveTo(40,-8);c.bezierCurveTo(40,-20,80,-22,96,-10);c.quadraticCurveTo(80,0,40,-2);c.closePath();},[38,32,32],70,-14,30);}
  else{for(const [lx,far] of [[22,1],[-24,0]]){const col=far?dark(trou,0.25):trou;
      S(mj_legPath([[lx,-392,58],[lx-2,-210,48],[lx+1,-60,42],[lx+2,-30,44]]),col,lx+18,-300,170,far?0.25:0.4);
      S(c=>{c.moveTo(lx-22,-36);c.bezierCurveTo(lx-26,-10,lx-16,0,lx+6,0);c.bezierCurveTo(lx+36,0,lx+58,-2,lx+58,-14);c.bezierCurveTo(lx+54,-26,lx+30,-34,lx+20,-40);c.closePath();},far?[24,22,24]:[34,30,30],lx+30,-22,40,0.5);}}
  // the body, breathing a little: the far arm behind it, the coat or the blouse, the near arm in front
  ctx.save();ctx.translate(0,br*0.6);
  const m=clamp(o.mix||0,0,1),arms=o.arms2&&m>=0.5?o.arms2:(o.arms||"hang"),sl=P.woman?(P.blouse||[236,232,222]):coat;
  // the arms: a pose, or on the way from o.arms to o.arms2 (o.mix 0 to 1)
  const A1=MJ_ARMS[o.arms||"hang"]||MJ_ARMS.hang,A2=o.arms2?MJ_ARMS[o.arms2]:null,
    armPts=A2&&m>0?{far:A1.far.map((q,i)=>[lerp(q[0],A2.far[i][0],ag_sine(m)),lerp(q[1],A2.far[i][1],ag_sine(m)),q[2]]),near:A1.near.map((q,i)=>[lerp(q[0],A2.near[i][0],ag_sine(m)),lerp(q[1],A2.near[i][1],ag_sine(m)),q[2]])}:A1;
  const drawArm=(pts,far)=>{const col=far?dark(sl,0.25):sl;
    const pp=P.woman?[[pts[0][0],pts[0][1]-4,pts[0][2]*1.3],[lerp(pts[0][0],pts[1][0],0.45),lerp(pts[0][1],pts[1][1],0.45),pts[0][2]*1.25],[pts[1][0],pts[1][1],pts[1][2]*0.75],[pts[2][0],pts[2][1],pts[2][2]*0.8]]:pts;
    S(mj_legPath(pp),col,pts[0][0]+16,pts[0][1]+30,120,far?0.2:0.4);
    const w=pts[2],v=pts[1],an=Math.atan2(w[1]-v[1],w[0]-v[0])-Math.PI/2;
    ctx.fillStyle=rgba(dark(col,0.2),1);ctx.save();ctx.translate(w[0],w[1]);ctx.rotate(an);ctx.fillRect(-w[2]*0.55,-4,w[2]*1.1,8);ctx.restore();
    hand(w[0]+Math.cos(an+Math.PI/2)*8,w[1]+Math.sin(an+Math.PI/2)*8,an,far);};
  drawArm(armPts.far,true);
  if(P.woman){const bl=P.blouse||[236,232,222];
    S(c=>{c.moveTo(-66,-602);c.bezierCurveTo(-74,-560,-60,-500,-46,-452);c.lineTo(46,-452);c.bezierCurveTo(58,-500,70,-560,64,-602);c.bezierCurveTo(30,-618,-34,-618,-66,-602);c.closePath();},bl,36,-570,110);
    ctx.strokeStyle=rgba(dark(bl,0.3),0.35);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(10,-600);ctx.quadraticCurveTo(14,-530,8,-456);ctx.stroke();
    ctx.fillStyle=rgba(P.belt||dark(P.skirt||[70,64,70],0.3),1);ctx.fillRect(-48,-466,94,16);}
  else{const len=P.coatLen==="sack"?-330:P.coatLen==="long"?-150:-226,hem=P.coatLen==="sack"?74:P.coatLen==="long"?98:86;
    const body=c=>{c.moveTo(-74,-604);c.bezierCurveTo(-92,-592,-96,-560,-90,-520);c.bezierCurveTo(-84,-480,-70,-458,-64,-440);c.bezierCurveTo(-74,-380,-hem,-300,-hem-4,len);
      c.quadraticCurveTo(0,len+8,hem+4,len);c.bezierCurveTo(hem,-300,76,-380,64,-440);c.bezierCurveTo(70,-470,84,-500,86,-530);c.bezierCurveTo(88,-566,82,-592,66,-604);
      c.bezierCurveTo(30,-618,-40,-618,-74,-604);c.closePath();};
    S(body,coat,46,-560,240,0.38);
    // the lapels, the waistcoat, the shirt and tie in the opening; below the button, the coat's skirts part
    S(c=>{c.moveTo(-12,-610);c.lineTo(34,-610);c.lineTo(18,-460);c.lineTo(6,-460);c.closePath();},P.waistcoat||mix(coat,[255,255,255],0.07),26,-560,60,0.3);
    ctx.fillStyle="rgb(240,238,232)";ctx.beginPath();ctx.moveTo(-4,-612);ctx.lineTo(24,-612);ctx.lineTo(14,-556);ctx.lineTo(6,-556);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(P.tie||[60,50,56],1);ctx.beginPath();ctx.moveTo(4,-610);ctx.lineTo(16,-610);ctx.lineTo(13,-574);ctx.lineTo(7,-574);ctx.closePath();ctx.fill();
    S(c=>{c.moveTo(-16,-612);c.bezierCurveTo(-30,-580,-22,-520,4,-462);c.lineTo(-4,-540);c.bezierCurveTo(-8,-570,-4,-596,-6,-610);c.closePath();},lite(coat),-10,-560,40,0.2);
    S(c=>{c.moveTo(36,-612);c.bezierCurveTo(46,-580,40,-520,18,-462);c.lineTo(26,-540);c.bezierCurveTo(30,-570,28,-596,28,-610);c.closePath();},mix(coat,[255,255,255],0.12),34,-560,40,0.2);
    ctx.strokeStyle=rgba(dark(coat,0.5),0.5);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(10,-460);ctx.quadraticCurveTo(4,-380,-6,len+4);ctx.stroke();
    ctx.fillStyle=rgba(lite(coat),0.55);for(const yy of [-474,-446])ctx.beginPath(),ctx.arc(12,yy,4,0,TAU),ctx.fill();
    ag_folds(ctx,body,[[[-60,-470],[-40,-456],[-20,-452]],[[30,-300],[40,-260],[44,-232]]],rgba(dark(coat,0.6),0.18),null);}
  if(arms==="hat")mj_hat(ctx,P.hat,12,-424,0.85,true);
  if(arms==="book"){ctx.save();ctx.translate(14,-486);ctx.rotate(-0.1);ag_soft(ctx,c=>ag_rect(c,-34,-44,68,88,4),[70,58,46],[130,112,96],20,-30,60,"rgba(0,0,0,0.4)",6,0.5);
    ctx.fillStyle="rgb(238,232,216)";ctx.fillRect(-28,-38,54,76);ctx.strokeStyle="rgba(90,80,70,0.4)";ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-22,-26+i*14);ctx.lineTo(18,-26+i*14);ctx.stroke();}ctx.restore();}
  drawArm(armPts.near,false);
  ctx.restore();
  // the head: the neck, a high collar, the face in three-quarter view, hair, beard, hat; it nods about the neck
  ctx.save();ctx.translate(0,br);const hx=6;ctx.translate(hx,-630);ctx.rotate(o.nod||0);ctx.translate(-hx,630);
  S(c=>{c.moveTo(-16,-668);c.lineTo(26,-668);c.lineTo(28,-606);c.lineTo(-18,-606);c.closePath();},dark(sk,0.12),20,-640,40,0.3);
  if(!P.woman){ctx.fillStyle="rgb(240,238,232)";ctx.beginPath();ctx.moveTo(-20,-636);ctx.quadraticCurveTo(6,-628,32,-636);ctx.lineTo(34,-610);ctx.quadraticCurveTo(6,-604,-22,-610);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(150,146,140,0.5)";ctx.lineWidth=2;ctx.stroke();}
  else{const bl=P.blouse||[236,232,222];ctx.fillStyle=rgba(bl,1);ctx.beginPath();ctx.moveTo(-20,-644);ctx.quadraticCurveTo(6,-636,32,-644);ctx.lineTo(36,-606);ctx.quadraticCurveTo(6,-600,-26,-606);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(dark(bl,0.3),0.4);ctx.lineWidth=2;ctx.stroke();}
  const head=c=>{c.moveTo(-26,-730);c.bezierCurveTo(-6,-756,36,-756,48,-726);c.bezierCurveTo(52,-714,52,-704,56,-694);c.bezierCurveTo(60,-688,62,-684,58,-680);
    c.bezierCurveTo(56,-676,54,-672,54,-668);c.bezierCurveTo(52,-656,44,-648,30,-646);c.bezierCurveTo(10,-646,-10,-654,-22,-670);c.bezierCurveTo(-36,-688,-38,-714,-26,-730);c.closePath();};
  S(head,sk,36,-714,72,0.6);
  const hair=P.hair||[60,48,40];
  if(P.woman){S(c=>{c.moveTo(-30,-700);c.bezierCurveTo(-36,-746,24,-766,50,-726);c.bezierCurveTo(30,-732,6,-730,-6,-720);c.bezierCurveTo(-14,-706,-22,-694,-30,-690);c.closePath();},hair,16,-740,60,0.4);
    S(c=>{c.ellipse(-26,-726,20,18,0,0,TAU);},hair,-20,-736,24,0.4);}
  else S(c=>{c.moveTo(-30,-700);c.bezierCurveTo(-34,-740,2,-760,40,-746);c.bezierCurveTo(10,-736,-2,-724,-8,-706);c.bezierCurveTo(-14,-692,-22,-680,-28,-676);c.closePath();},hair,0,-740,60,0.4);
  S(c=>{c.ellipse(-6,-694,8,13,0.2,0,TAU);},dark(sk,0.1),-2,-700,14,0.5);
  if(P.beard){S(c=>{c.moveTo(-10,-692);c.bezierCurveTo(-14,-662,-4,-632,16,P.beardLong?-602:-628);c.bezierCurveTo(38,P.beardLong?-606:-630,52,-648,56,-672);
      c.bezierCurveTo(46,-668,36,-670,30,-678);c.bezierCurveTo(20,-674,6,-680,-2,-694);c.closePath();},P.beard,40,-660,60,0.5);}
  if(P.moustache){S(c=>{c.moveTo(28,-678);c.bezierCurveTo(38,-688,52,-688,60,-676);c.bezierCurveTo(50,-678,40,-674,28,-670);c.closePath();},P.moustache,48,-682,20,0.4);}
  ctx.fillStyle="rgba(30,22,20,0.9)";ctx.beginPath();ctx.ellipse(24,-704,3.4,4.4,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(45,-704,2.6,4,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(mix(hair,[60,40,30],0.4),0.8);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(16,-716);ctx.lineTo(32,-718);ctx.moveTo(41,-718);ctx.lineTo(50,-716);ctx.stroke();
  if(P.hat&&arms!=="hat")mj_hat(ctx,P.hat,8,-732,1,false);
  const at=ctx.getTransform().transformPoint(new DOMPoint(14,-770));ctx.restore();
  ctx.restore();
  if(o.cloud){const m=ctx.getTransform().inverse().transformPoint(at);o.cloud(ctx,m.x,m.y,k);}
  return{x:x+fl*14*k,y:y-760*k,k};}
// a hat, centred at (x, y) on the head's top, in the figure's space; held: drawn tilted in the hands
function mj_hat(ctx,H,x,y,s,held){if(!H||!H.kind)return;const c0=H.c||[34,32,34],hi=mix(c0,[255,255,255],0.3),shd=rgba(mix(c0,[0,0,0],0.6),0.5);ctx.save();ctx.translate(x,y);ctx.scale(s,s);if(held)ctx.rotate(-0.25);
  const S=(fn,c,lx,ly,r)=>ag_soft(ctx,fn,c,mix(c,[255,255,255],0.3),lx,ly,r,rgba(mix(c,[0,0,0],0.6),0.45),8,0.45);
  if(H.kind==="bowler"){S(c=>{c.ellipse(0,4,62,12,0,0,TAU);},mix(c0,[0,0,0],0.1),20,0,50);S(c=>{c.moveTo(-40,4);c.bezierCurveTo(-42,-56,42,-56,40,4);c.closePath();},c0,18,-30,50);
    ctx.fillStyle=rgba(mix(c0,[0,0,0],0.3),1);ctx.fillRect(-40,-8,80,9);}
  else if(H.kind==="top"){S(c=>{c.ellipse(0,4,58,11,0,0,TAU);},mix(c0,[0,0,0],0.1),20,0,50);S(c=>{c.moveTo(-34,4);c.lineTo(-38,-84);c.quadraticCurveTo(0,-92,38,-84);c.lineTo(34,4);c.closePath();},c0,18,-50,70);
    ctx.fillStyle=rgba(mix(c0,[0,0,0],0.3),1);ctx.fillRect(-35,-14,70,12);}
  else if(H.kind==="slouch"){S(c=>{c.moveTo(-86,10);c.bezierCurveTo(-60,-6,60,-6,92,12);c.bezierCurveTo(70,24,-60,24,-86,10);c.closePath();},c0,30,0,70);
    S(c=>{c.moveTo(-40,0);c.bezierCurveTo(-44,-40,-24,-60,0,-54);c.bezierCurveTo(10,-48,16,-58,26,-58);c.bezierCurveTo(44,-54,46,-30,42,0);c.closePath();},c0,20,-34,50);
    ctx.fillStyle=rgba(mix(c0,[255,255,255],0.12),1);ctx.fillRect(-41,-12,83,9);}
  else if(H.kind==="wide"){S(c=>{c.ellipse(0,2,110,20,-0.04,0,TAU);},c0,30,-6,90);S(c=>{c.moveTo(-46,0);c.bezierCurveTo(-48,-44,46,-44,46,0);c.closePath();},c0,18,-24,50);
    ctx.fillStyle=rgba(H.trim||[180,150,150],1);ctx.fillRect(-46,-14,92,12);for(const [fx,fc] of [[30,[214,170,170]],[44,[230,210,190]],[18,[190,120,120]]]){ctx.fillStyle=rgba(fc,1);ctx.beginPath();ctx.arc(fx,-22,11,0,TAU);ctx.fill();}}
  else if(H.kind==="cap"){S(c=>{c.moveTo(-42,0);c.bezierCurveTo(-44,-30,40,-36,50,-6);c.lineTo(78,4);c.quadraticCurveTo(40,10,-42,0);c.closePath();},c0,20,-14,50);}
  ctx.restore();}
// a small thought cloud above someone's head, with a word in it (at least 28 px as drawn)
function mj_cloud(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const s=o.s||1,w=Math.max(84,ag_tw(ctx,text,{w:800,size:40})+44)*s,h=72*s;ctx.save();ctx.globalAlpha*=a;
  ag_about(ctx,x,y,lerp(0.6,1,o.k==null?1:o.k));const cy=y-h/2-30*s;
  ag_card(ctx,c=>{c.moveTo(x-w/2+h/2,cy-h/2);c.arc(x-w/2+h/2,cy,h/2,-Math.PI/2,Math.PI/2,true);c.lineTo(x+w/2-h/2,cy+h/2);c.arc(x+w/2-h/2,cy,h/2,Math.PI/2,-Math.PI/2,true);c.closePath();},{x:x-w/2,y:cy-h/2,w,h},{edge:o.col||null});
  for(const [dx,dy,r] of [[-6,h/2+12,9],[-14,h/2+28,6]])ag_box(ctx,x+dx*s-r*s,cy+dy*s-r*s,2*r*s,2*r*s,r*s,{});
  ag_T(ctx,text,x,cy+14*s,{w:800,size:40*s,align:"center",col:o.col||AG.ink});ctx.restore();}

/* ---------------------------------------------------------------- the things of the story
   Drawn flat to the camera, matte, in the same light. In the courtyard they stand at a point (X, Z) and take their size from its
   depth; over a shot they are cards and papers in the frame. */
const MJ_WOOD=[150,112,78],MJ_CHALK=[236,236,228],MJ_SLATE=[52,60,58];
// von Osten's blackboard on its easel, at (X, Z) in the courtyard: 1.5 by 1 m, its foot 0.8 m up, with the grid of numbers and letters
// he taught from (like the one in Pfungst's frontispiece, drawn anew; its letters are decoration). Returns the board's box.
function mj_board(ctx,X,Z,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const k=mj_k(Z),p=mj_P(X,0,Z),bw=1.5*k,bh=1.0*k,x0=p[0]-bw/2,y1=p[1]-0.8*k,y0=y1-bh;
  ctx.save();ctx.globalAlpha*=a;
  const leg=(xa,ya,xb,yb,w,col)=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=w;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(xa,ya);ctx.lineTo(xb,yb);ctx.stroke();};
  ag_floorShadow(ctx,p[0]-0.12*k,p[1]+0.03*k,0.95*k,0.07*k,0.3);
  leg(p[0]+0.06*k,y0-0.12*k,p[0]+0.42*k,p[1]-0.03*k,0.045*k,mix(MJ_WOOD,[0,0,0],0.3));
  leg(x0+0.14*k,y0-0.1*k,x0-0.06*k,p[1],0.05*k,MJ_WOOD);leg(x0+bw-0.14*k,y0-0.1*k,x0+bw+0.06*k,p[1],0.05*k,MJ_WOOD);
  ag_soft(ctx,c=>ag_rect(c,x0-0.045*k,y0-0.045*k,bw+0.09*k,bh+0.09*k,0.02*k),MJ_WOOD,[218,180,136],x0+bw*0.85,y0,bw*0.7,"rgba(40,24,12,0.4)",6,0.5);
  ag_soft(ctx,c=>ag_rect(c,x0,y0,bw,bh,0.01*k),MJ_SLATE,[104,116,112],x0+bw*0.75,y0+bh*0.15,bw*0.8,"rgba(0,0,0,0.35)",8,0.35);
  // the chalk ledge
  ag_soft(ctx,c=>ag_rect(c,x0-0.06*k,y1+0.01*k,bw+0.12*k,0.05*k,0.01*k),MJ_WOOD,[218,180,136],x0+bw*0.8,y1,bw*0.5,null);
  ctx.fillStyle=rgba(MJ_CHALK,0.95);ctx.fillRect(x0+bw*0.7,y1-0.005*k,0.09*k,0.022*k);
  // the grid: numbers along the top and the side, letters in the cells
  const cols=8,rows=5,gx=x0+bw*0.05,gy=y0+bh*0.07,cw=bw*0.9/cols,rh=bh*0.86/rows,sz=Math.max(6,rh*0.6);
  ctx.save();ctx.beginPath();ctx.rect(x0,y0,bw,bh);ctx.clip();
  ctx.fillStyle="rgba(236,236,228,0.05)";ctx.beginPath();ctx.ellipse(x0+bw*0.4,y0+bh*0.55,bw*0.42,bh*0.3,-0.1,0,TAU);ctx.fill();    // an old wiping
  ctx.strokeStyle="rgba(236,236,228,0.4)";ctx.lineWidth=Math.max(0.8,k*0.006);ctx.beginPath();
  for(let i=1;i<cols;i++){ctx.moveTo(gx+cw*i,gy);ctx.lineTo(gx+cw*i+0.004*k,gy+rh*rows);}for(let j=1;j<rows;j++){ctx.moveTo(gx,gy+rh*j);ctx.lineTo(gx+cw*cols,gy+rh*j+0.004*k);}ctx.stroke();
  const L="abcdefghijklmnopqrstuvwxyz";
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let s="";if(j===0&&i>0)s=String(i);else if(i===0&&j>0)s=String(j);else if(i>0&&j>0){const n=(j-1)*(cols-1)+(i-1);s=n<26?L[n]:"";}
    if(s)ag_T(ctx,s,gx+cw*(i+0.5),gy+rh*(j+0.5)+sz*0.36,{w:600,size:sz,align:"center",color:"rgba(236,236,228,0.85)",deco:1});}
  ctx.restore();ctx.restore();return{x:x0,y:y0,w:bw,h:bh,k};}
// a small easel with a slate on it, at (X, Z): the slate 0.8 by 0.59 m, its middle 1.15 m up; returns the slate's box in the frame
function mj_easel(ctx,X,Z,o){o=o||{};const a=o.a==null?1:o.a,k=mj_k(Z),p=mj_P(X,0,Z),w=0.8*k,h=0.59*k,x0=p[0]-w/2,y0=p[1]-1.15*k-h/2;if(a<=0)return{x:x0,y:y0,w,k};
  ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,p[0]-0.06*k,p[1]+0.02*k,0.42*k,0.05*k,0.3);
  ctx.lineCap="round";const leg=(xa,ya,xb,yb,col)=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=0.032*k;ctx.beginPath();ctx.moveTo(xa,ya);ctx.lineTo(xb,yb);ctx.stroke();};
  leg(p[0]+0.02*k,y0,p[0]+0.26*k,p[1]-0.02*k,mix(MJ_WOOD,[0,0,0],0.3));leg(x0+0.08*k,y0+0.05*k,x0-0.12*k,p[1],MJ_WOOD);leg(x0+w-0.08*k,y0+0.05*k,x0+w+0.12*k,p[1],MJ_WOOD);
  ag_soft(ctx,c=>ag_rect(c,x0-0.06*k,y0+h+0.01*k,w+0.12*k,0.04*k,0.01*k),MJ_WOOD,[218,180,136],x0+w*0.8,y0+h,w*0.5,null);
  ctx.restore();return{x:x0,y:y0,w,k};}
/* a slate, flat, its top left at (x, y), w wide and 0.74 w tall, in a wooden frame. o: text (in chalk, "3 + 2"); ticks (how many
   chalk ticks count the taps so far, in fives; tick, 0 to 1, how far the latest is drawn); past (the answer: ticks after it are
   amber); cal ({month, day, year}: a calendar page pinned on it instead); next and turn (0 to 1: it turns over, about its middle, to the
   face o.next, {text, cal}); a. Words at least 28 px as drawn: keep w at least 230. */
function mj_slate(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*0.74,u=clamp(o.turn||0,0,1),face=u<0.5?o:Object.assign({},o,o.next||{},{ticks:0}),sx=Math.abs(Math.cos(u*Math.PI));
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.scale(Math.max(0.02,sx),1);ctx.translate(-w/2,-h/2);
  const fr=w*0.045;ag_soft(ctx,c=>ag_rect(c,0,0,w,h,w*0.02),MJ_WOOD,[226,190,146],w*0.85,0,w*0.8,"rgba(40,24,12,0.45)",8,0.55);
  ag_soft(ctx,c=>ag_rect(c,fr,fr,w-2*fr,h-2*fr,w*0.01),MJ_SLATE,[100,112,108],w*0.7,h*0.2,w*0.8,"rgba(0,0,0,0.4)",10,0.35);
  ctx.save();ctx.beginPath();ctx.rect(fr,fr,w-2*fr,h-2*fr);ctx.clip();ctx.fillStyle="rgba(236,236,228,0.05)";ctx.beginPath();ctx.ellipse(w*0.45,h*0.55,w*0.36,h*0.25,0.1,0,TAU);ctx.fill();
  if(face.cal){const C=face.cal,px=w*0.2,py=h*0.1,pw=w*0.6,ph=h*0.8;
    ctx.save();ctx.shadowColor="rgba(0,0,0,0.35)";ctx.shadowBlur=10;ctx.shadowOffsetY=4;ctx.fillStyle="rgb(240,236,226)";ctx.fillRect(px,py,pw,ph);ctx.restore();
    ctx.fillStyle="rgb(150,64,52)";ctx.fillRect(px,py,pw,ph*0.24);
    ag_T(ctx,C.month,px+pw/2,py+ph*0.17,{w:700,size:Math.max(28,w*0.07),align:"center",color:"rgb(250,244,236)",ls:2});
    ag_T(ctx,String(C.day),px+pw/2,py+ph*0.74,{w:800,size:w*0.24,align:"center",col:[40,34,30]});
    ag_T(ctx,String(C.year),px+pw/2,py+ph*0.93,{w:600,size:Math.max(28,w*0.07),align:"center",col:[90,80,72]});}
  else{if(face.text)ag_T(ctx,face.text,w/2,h*0.42,{w:700,size:w*0.19,align:"center",color:"rgba(240,240,232,0.95)"});
    // the ticks, in fives: four down, the fifth across them
    const n=face.ticks||0,past=o.past==null?1e9:o.past,tw=w*0.042,gw=w*0.25,y0=h*0.6,y1=h*0.82,x0=w*0.16;
    ctx.lineCap="round";ctx.lineWidth=w*0.018;
    for(let i=0;i<n;i++){const g=Math.floor(i/5),j=i%5,p=i===n-1?clamp(o.tick==null?1:o.tick,0,1):1,amb=i>=past,col=amb?rgba(mix(AG.amber,[255,220,150],0.35),0.95):"rgba(240,240,232,0.92)";
      const gx=x0+g*gw,jit=hash(i,3)-0.5;ctx.strokeStyle=col;ctx.beginPath();
      if(j<4){const xa=gx+j*tw+jit*3,ya=y0+jit*4;ctx.moveTo(xa,ya);ctx.lineTo(xa+w*0.01,lerp(ya,y1,p));}
      else{const xa=gx-tw*0.5,ya=y1-h*0.04,xb=gx+tw*3.6,yb=y0+h*0.04;ctx.moveTo(xa,ya);ctx.lineTo(lerp(xa,xb,p),lerp(ya,yb,p));}ctx.stroke();}}
  ctx.restore();ctx.restore();}
/* a newspaper page, flat, its top left at (x, y), w wide: a masthead (decoration), the headline o.head, large, and columns of
   print. o.next and o.turn (0 to 1): the headline changes, the old one sliding up and out as the new one comes in; o.rot; o.k (springs
   in from 0.6 of its size); o.a */
function mj_paper(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*1.3,pad=w*0.07,K=o.k==null?1:lerp(0.6,1,o.k),ink=[38,34,32];
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.scale(K,K);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.32)";ctx.shadowBlur=34;ctx.shadowOffsetX=AG.sdx*1.5;ctx.shadowOffsetY=18;ctx.fillStyle="rgb(234,228,214)";ctx.fillRect(0,0,w,h);ctx.restore();
  let g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,252,244,0.5)");g.addColorStop(1,"rgba(200,190,170,0.25)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  // the masthead, between two rules: the place and the year, as decoration
  ctx.fillStyle=rgba(ink,0.85);ctx.fillRect(pad,pad,w-2*pad,3);ctx.fillRect(pad,pad+w*0.13,w-2*pad,1.5);
  ag_T(ctx,"BERLIN · 1904",w/2,pad+w*0.095,{w:800,size:w*0.06,align:"center",col:ink,ls:w*0.012,deco:1});
  // the headline: the old one leaving, the new one arriving
  const hy=pad+w*0.32,hs=Math.min(w*0.13,72),u=clamp(o.turn||0,0,1);
  ctx.save();ctx.beginPath();ctx.rect(pad,pad+w*0.15,w-2*pad,w*0.24);ctx.clip();
  const head=(s,dy,al)=>{if(al<=0||!s)return;const sz=Math.min(hs,(w-2*pad)/Math.max(1,ag_tw(ctx,s,{w:800,size:hs}))*hs);ag_T(ctx,s,w/2,hy+dy,{w:800,size:sz,align:"center",col:ink,a:al});};
  head(o.head,-ag_sine(u)*w*0.2,1-ag_sine(u));head(o.next,(1-ag_sine(u))*w*0.2,ag_sine(u));ctx.restore();
  ctx.fillStyle=rgba(ink,0.7);ctx.fillRect(pad,pad+w*0.42,w-2*pad,1.5);
  // the print: three columns of grey lines, a small picture in the first
  const cw=(w-2*pad-2*w*0.04)/3,top=pad+w*0.47;ctx.fillStyle=rgba(ink,0.22);
  for(let ci=0;ci<3;ci++){const cx=pad+ci*(cw+w*0.04);let yy=top;if(ci===0){ctx.fillStyle="rgba(120,110,96,0.32)";ctx.fillRect(cx,yy,cw,cw*0.7);ctx.fillStyle=rgba(ink,0.22);yy+=cw*0.7+w*0.03;}
    for(;yy<h-pad;yy+=w*0.026){const lw=hash(ci*97+Math.round(yy),5)<0.12?cw*0.6:cw;ctx.fillRect(cx,yy,lw,w*0.011);}}
  ctx.restore();}
/* a grid of 100 dots, ten by ten, on a card: the answers given, right ones in green; p 0 to 1 how many are in so far; label over it.
   right: the indices of the right ones. (x, y) the card's top left, cell the dots' spacing. */
const MJ_RIGHT={blind:[7,23,41,58,76,92],seen:[]};
{const miss=[4,15,19,33,47,52,61,70,84,88,97];for(let i=0;i<100;i++)if(!miss.includes(i))MJ_RIGHT.seen.push(i);}
function mj_grid(ctx,x,y,cell,right,p,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const pad=30,lh=60,w=cell*10+pad*2,h=cell*10+pad*2+lh;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.6});
  ag_T(ctx,label,x+pad,y+pad+28,{w:700,size:30,col:AG.ink});
  const n=Math.floor(clamp(p,0,1)*100+1e-6),set=new Set(right);
  for(let i=0;i<100;i++){const cx=x+pad+cell*(i%10+0.5),cy=y+pad+lh+cell*(Math.floor(i/10)+0.5),r=cell*0.3;
    if(i>=n){ctx.strokeStyle="rgba(86,92,100,0.22)";ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();continue;}
    const ok=set.has(i),pop=i===n-1?ag_eo((p*100-i)):1;ctx.fillStyle=ok?rgba(AG.green,1):"rgba(150,150,156,0.55)";ctx.beginPath();ctx.arc(cx,cy,r*lerp(0.4,1,pop),0,TAU);ctx.fill();}
  ctx.restore();return{x,y,w,h};}
// a magnifying glass at (x, y), r its glass's radius: o.draw(ctx) draws what it shows, clipped to the glass (the caller magnifies);
// a brass rim, a dark wooden handle down and to the right; o.a
function mj_lens(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const an=0.72,hx=x+Math.cos(an)*r,hy=y+Math.sin(an)*r;
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.35)";ctx.shadowBlur=24;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=12;ctx.strokeStyle="#3A2E26";ctx.lineWidth=r*0.16;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(hx+Math.cos(an)*r*0.12,hy+Math.sin(an)*r*0.12);ctx.lineTo(hx+Math.cos(an)*r*0.95,hy+Math.sin(an)*r*0.95);ctx.stroke();ctx.restore();
  ctx.strokeStyle="rgba(255,255,255,0.18)";ctx.lineWidth=r*0.04;ctx.beginPath();ctx.moveTo(hx+Math.cos(an)*r*0.2-3,hy+Math.sin(an)*r*0.2);ctx.lineTo(hx+Math.cos(an)*r*0.9-3,hy+Math.sin(an)*r*0.9);ctx.stroke();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.fillStyle="#F2F0EA";ctx.fillRect(x-r,y-r,2*r,2*r);if(o.draw)o.draw(ctx);
  const g=ctx.createRadialGradient(x-r*0.35,y-r*0.4,0,x,y,r);g.addColorStop(0,"rgba(255,255,255,0.28)");g.addColorStop(0.5,"rgba(255,255,255,0.04)");g.addColorStop(1,"rgba(80,90,100,0.22)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();
  const rg=ctx.createLinearGradient(x-r,y-r,x+r,y+r);rg.addColorStop(0,"#E2C68E");rg.addColorStop(0.5,"#B08A4E");rg.addColorStop(1,"#7A5A2E");
  ctx.strokeStyle=rg;ctx.lineWidth=r*0.09;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.restore();}
// a sealed envelope centred on (x, y), w wide: the flap's lines, a wax seal, and o.word on its face (at least 28 px); o.rot, o.a
function mj_envelope(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*0.6;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.3)";ctx.shadowBlur=22;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=10;ctx.fillStyle="rgb(232,222,200)";ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  ctx.strokeStyle="rgba(120,100,70,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-w/2,-h/2);ctx.lineTo(0,h*0.08);ctx.lineTo(w/2,-h/2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-w/2,h/2);ctx.lineTo(-w*0.12,-h*0.02);ctx.moveTo(w/2,h/2);ctx.lineTo(w*0.12,-h*0.02);ctx.stroke();
  ag_soft(ctx,c=>{c.arc(0,h*0.06,w*0.07,0,TAU);},[150,44,40],[210,110,96],w*0.02,h*0.02,w*0.08,"rgba(60,10,10,0.5)",4,0.6);
  if(o.word)ag_T(ctx,o.word,0,h*0.38,{w:700,size:Math.max(28,w*0.1),align:"center",col:[70,58,46]});
  ctx.restore();}
// a dashed line of sight from A to B, drawn on to p
function mj_sight(ctx,A,B,p,a){if(a<=0||p<=0)return;const q=ag_sine(p),E=[lerp(A[0],B[0],q),lerp(A[1],B[1],q)];ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(250,248,240,0.95)";
  ctx.lineWidth=5;ctx.lineCap="round";ctx.setLineDash([2,16]);ctx.shadowColor="rgba(0,0,0,0.35)";ctx.shadowBlur=6;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(E[0],E[1]);ctx.stroke();ctx.setLineDash([]);
  ctx.restore();}

/* ---------------------------------------------------------------- the people of 1904
   Full length in the wide shots (mj_figure), and from the waist up, as the series draws its people, in the close ones (ag_person with
   a spec of their own, plus what the shared people don't wear: a long beard, a high collar, a moustache, and hats drawn live, since a
   brim reaches past the head's own picture). */
const MJ_FIG={
  osten:{skin:[236,206,186],hair:[232,230,226],beard:[238,236,232],beardLong:1,coat:[206,196,176],coatLen:"long",trousers:[70,66,62],waistcoat:[192,184,168],tie:[50,46,48],hat:{kind:"slouch",c:[34,32,34]},seed:1},
  pfungst:{skin:[236,204,180],hair:[46,36,30],moustache:[52,40,32],coat:[44,44,52],coatLen:"sack",trousers:[46,46,54],waistcoat:[58,58,66],tie:[30,30,36],hat:{kind:"bowler",c:[30,30,32]},seed:2},
  asker:{skin:[230,196,170],hair:[96,80,66],moustache:[90,72,58],coat:[62,56,52],coatLen:"frock",trousers:[56,52,50],tie:[60,40,40],hat:{kind:"bowler",c:[40,38,38]},seed:3}};
// the thirteen men of the commission, in 1904 dress (the two officers retired, in civilian coats), and the visitors
const MJ_MEN=[
  {skin:[232,198,172],hair:[90,74,60],moustache:[80,64,52],coat:[46,46,52],coatLen:"frock",hat:{kind:"bowler",c:[30,30,32]}},
  {skin:[236,206,186],hair:[150,144,138],beard:[150,144,138],coat:[60,52,48],coatLen:"sack",hat:{kind:"top",c:[28,28,30]}},
  {skin:[228,190,164],hair:[60,48,40],beard:[60,48,40],coat:[38,40,48],coatLen:"frock",hat:{kind:"bowler",c:[36,34,34]}},
  {skin:[234,202,178],hair:[200,196,190],moustache:[204,200,194],coat:[74,66,60],coatLen:"sack",hat:{kind:"slouch",c:[60,54,50]}},
  {skin:[230,196,170],hair:[50,40,34],moustache:[44,34,28],coat:[44,46,56],coatLen:"long",hat:{kind:"top",c:[26,26,30]}},
  {skin:[236,204,182],hair:[170,164,156],beard:[176,170,162],beardLong:1,coat:[52,48,46],coatLen:"long",hat:{kind:"bowler",c:[34,32,32]}},
  {skin:[226,188,160],hair:[90,70,56],moustache:[90,70,56],coat:[36,36,40],coatLen:"frock",hat:{kind:"top",c:[24,24,28]}},
  {skin:[232,200,176],hair:[66,52,42],moustache:[60,46,38],coat:[64,60,70],coatLen:"sack",hat:{kind:"bowler",c:[40,36,36]}},
  {skin:[228,194,168],hair:[96,80,66],beard:[96,80,66],coat:[48,44,40],coatLen:"frock",hat:{kind:"slouch",c:[42,40,42]}},
  {skin:[234,204,180],hair:[180,176,170],moustache:[186,182,176],coat:[40,44,52],coatLen:"long",hat:{kind:"top",c:[26,26,30]}},
  {skin:[230,198,172],hair:[52,42,36],beard:[52,42,36],coat:[58,52,46],coatLen:"sack",hat:{kind:"bowler",c:[30,30,32]}},
  {skin:[236,206,184],hair:[120,100,80],moustache:[120,100,80],coat:[46,40,44],coatLen:"frock",hat:{kind:"bowler",c:[44,40,40]}},
  {skin:[226,190,164],hair:[76,62,52],moustache:[70,56,46],coat:[70,64,58],coatLen:"sack",hat:{kind:"top",c:[30,30,34]}}].map((P,i)=>Object.assign({seed:i*1.7+4},P));
const MJ_VISITORS=[
  {woman:1,skin:[236,206,186],hair:[110,74,50],blouse:[238,232,220],skirt:[64,70,92],hat:{kind:"wide",c:[200,184,160],trim:[150,90,96]},seed:21},
  {skin:[230,196,170],hair:[70,56,46],moustache:[70,56,46],coat:[58,54,52],coatLen:"sack",hat:{kind:"cap",c:[70,64,58]},seed:22},
  {woman:1,skin:[232,200,178],hair:[60,44,36],blouse:[226,220,232],skirt:[92,64,60],hat:{kind:"wide",c:[60,56,60],trim:[200,190,170]},seed:23},
  {skin:[234,204,180],hair:[120,100,80],coat:[44,46,52],coatLen:"frock",moustache:[110,90,70],hat:{kind:"bowler",c:[34,32,32]},seed:24},
  {skin:[228,192,166],hair:[46,38,34],coat:[80,72,62],coatLen:"sack",hat:{kind:"bowler",c:[60,52,46]},seed:25},
  {woman:1,skin:[236,208,190],hair:[150,108,70],blouse:[240,236,226],skirt:[50,60,70],hat:{kind:"wide",c:[226,214,190],trim:[110,130,150]},seed:26}];
// a high stiff collar, painted over the shirt (for the shared people's spec, top.paint)
function mj_highCollar(c){ag_soft(c,cc=>{cc.moveTo(232,540);cc.bezierCurveTo(260,566,318,578,362,560);cc.lineTo(364,604);cc.bezierCurveTo(318,622,258,614,232,584);cc.closePath();},
  [244,242,236],[255,255,255],330,560,80,"rgba(80,70,60,0.3)",8);
  c.strokeStyle="rgba(120,110,100,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(300,574);c.lineTo(304,610);c.stroke();}
// a long white beard from the jaw over the chest, drawn live with the head (mj_headHat); the head's own short beard covers the jaw under it
function mj_longBeard(col){return c=>{const B=cc=>{cc.moveTo(276,462);cc.bezierCurveTo(262,520,270,600,300,650);cc.bezierCurveTo(318,684,340,712,356,716);
    cc.bezierCurveTo(374,712,390,684,400,640);cc.bezierCurveTo(410,590,408,530,398,486);cc.bezierCurveTo(384,516,352,532,320,524);cc.bezierCurveTo(298,516,284,494,276,462);cc.closePath();};
  ag_soft(c,B,col,[255,255,255],366,560,150,"rgba(90,86,80,0.38)",16,0.6);
  c.save();ag_shape(c,B);c.clip();c.strokeStyle="rgba(140,136,130,0.28)";c.lineWidth=2.2;c.lineCap="round";
  for(const [x0,x1] of [[296,318],[314,332],[332,346],[350,358],[368,368],[386,378]]){c.beginPath();c.moveTo(x0,520);c.quadraticCurveTo(x0+4,610,x1,700);c.stroke();}c.restore();};}
function mj_moustache(col){return c=>{ag_soft(c,cc=>{cc.moveTo(348,476);cc.bezierCurveTo(354,462,374,457,393,464);cc.bezierCurveTo(396,470,392,476,385,476);cc.bezierCurveTo(372,471,360,474,348,478);cc.closePath();},
  col,mix(col,[255,255,255],0.3),384,466,24,"rgba(0,0,0,0.3)",4,0.4);};}
const MJ_PERSON={
  osten:{name:"Wilhelm von Osten",key:"mjOsten",skin:[236,206,186],hair:{style:"cropped",c:[234,232,228]},beard:[240,238,234],
    top:{kind:"suit",c:[200,190,170],inner:[242,240,234],tie:[50,46,48]},hat:{paint:mj_moustache([236,234,230])},longBeard:[240,238,234],breath:0.22},
  pfungst:{name:"Oskar Pfungst",key:"mjPfungst",skin:[236,204,180],hair:{style:"side",c:[46,36,30]},
    top:{kind:"suit",c:[44,44,52],inner:[244,242,236],tie:[34,34,42],paint:mj_highCollar},hat:{paint:mj_moustache([54,42,34])},breath:0.28},
  subject:{name:"A student",key:"mjSubject",skin:[232,198,172],hair:{style:"side",c:[110,86,64]},
    top:{kind:"suit",c:[76,68,62],inner:[244,242,236],tie:[90,50,48],paint:mj_highCollar},breath:0.3}};
// a hat on a shared person's head, drawn live in figure space with the head's own movement (ag_person's transform); kind as mj_hat's
// (and a long beard, P.longBeard, which hangs past the head's picture, over the neck and the chest). kind null: the beard alone.
function mj_headHat(ctx,P,x,y,s,o,kind,col){o=o||{};const t=o.t||0,br=Math.sin(t*TAU*(P.breath||0.28))*2.2;ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.translate(-296,-596);
  ctx.translate(282,480+br*0.7);ctx.rotate(o.nod||0);ctx.translate(-282,-480);if(o.lift)ctx.translate(0,-o.lift);
  if(P.longBeard)mj_longBeard(P.longBeard)(ctx);if(kind)mj_hatShape(ctx,kind,col);ctx.restore();}
// the hats, in figure space over a head whose top is at y 300 and runs from x 212 to 392
function mj_hatShape(ctx,kind,col){const S=(fn,c,lx,ly,r)=>ag_soft(ctx,fn,c,mix(c,[255,255,255],0.28),lx,ly,r,rgba(mix(c,[0,0,0],0.6),0.45),10,0.4);
  if(kind==="slouch"){S(c=>{c.moveTo(150,334);c.bezierCurveTo(196,306,404,300,452,326);c.bezierCurveTo(460,336,446,344,430,344);c.bezierCurveTo(360,334,240,338,170,350);c.bezierCurveTo(152,352,142,344,150,334);c.closePath();},col,380,318,140);
    S(c=>{c.moveTo(222,322);c.bezierCurveTo(214,270,240,234,290,230);c.bezierCurveTo(312,230,318,244,334,240);c.bezierCurveTo(372,232,396,262,392,322);c.closePath();},col,350,262,110);
    ctx.fillStyle=rgba(mix(col,[255,255,255],0.12),1);ctx.beginPath();ctx.moveTo(222,312);ctx.bezierCurveTo(280,302,340,302,392,310);ctx.lineTo(392,324);ctx.bezierCurveTo(340,316,280,316,222,326);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(mix(col,[0,0,0],0.5),0.5);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(300,240);ctx.quadraticCurveTo(312,262,306,290);ctx.stroke();}
  else if(kind==="bowler"){S(c=>{c.ellipse(304,334,124,20,-0.03,0,TAU);},mix(col,[0,0,0],0.1),380,330,120);
    S(c=>{c.moveTo(222,330);c.bezierCurveTo(218,250,392,250,388,330);c.closePath();},col,350,272,110);ctx.fillStyle=rgba(mix(col,[0,0,0],0.3),1);ctx.fillRect(222,312,166,16);}}

/* ---------------------------------------------------------------- Pfungst's laboratory, 1904
   A plain room at the university's psychological institute: a pale grey-green wall, dark wooden panelling to the dado, a tall window on
   the right with the day's light, a framed chart on the wall; the table across the front is drawn in the scene, over the people's waists. */
function mj_paintLab04(c){let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"#A9AC9E");g.addColorStop(0.6,"#C3C5B6");g.addColorStop(1,"#D4D4C4");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the window: deep reveal, white frame, bright panes
  const wx=1480,wy=110,ww=330,wh=560;c.fillStyle="#9EA294";c.fillRect(wx-26,wy-22,ww+52,wh+44);
  g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"#F4F6F2");g.addColorStop(1,"#E2E8E6");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.strokeStyle="#ECEAE2";c.lineWidth=14;c.strokeRect(wx,wy,ww,wh);c.lineWidth=8;c.beginPath();c.moveTo(wx+ww/2,wy);c.lineTo(wx+ww/2,wy+wh);c.moveTo(wx,wy+wh*0.36);c.lineTo(wx+ww,wy+wh*0.36);c.stroke();
  // its light falling into the room, and on the wall to its left
  c.save();c.globalCompositeOperation="screen";g=c.createLinearGradient(wx,0,wx-900,0);g.addColorStop(0,"rgba(255,246,226,0.32)");g.addColorStop(1,"rgba(255,246,226,0)");c.fillStyle=g;
  c.beginPath();c.moveTo(wx,wy);c.lineTo(wx,wy+wh);c.lineTo(wx-700,H);c.lineTo(wx-1100,H);c.closePath();c.fill();c.restore();
  // the panelling: a dado rail, dark panels, the skirting
  const py=600;c.fillStyle="#5E4634";c.fillRect(0,py,W,H-py);c.fillStyle="#7A5C44";c.fillRect(0,py-14,W,18);c.fillStyle="rgba(255,236,210,0.25)";c.fillRect(0,py-14,W,3);
  for(let x=40;x<W;x+=300){ag_soft(c,cc=>ag_rect(cc,x,py+30,250,150,6),[104,78,58],[150,116,88],x+200,py+40,200,"rgba(20,10,4,0.45)",10,0.35);}
  // a framed chart on the wall (decoration)
  ag_soft(c,cc=>ag_rect(cc,420,180,360,260,4),[70,52,40],[120,96,76],700,190,300,null);c.fillStyle="#EEEADE";c.fillRect(436,196,328,228);
  c.strokeStyle="rgba(60,50,40,0.35)";c.lineWidth=2;c.beginPath();for(let i=0;i<=12;i++){const x=456+i*24,y=400-Math.abs(Math.sin(i*0.9))*120-i*6;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  // soft shade in the corners
  g=c.createRadialGradient(1100,420,200,960,540,1300);g.addColorStop(0,"rgba(30,26,20,0)");g.addColorStop(1,"rgba(30,26,20,0.3)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.mjLab04=mj_paintLab04;
// the institute's table across the front, its back edge at y: dark oiled wood
function mj_table04(ctx,y){let g=ctx.createLinearGradient(0,y,0,y+70);g.addColorStop(0,"#8A684C");g.addColorStop(1,"#6E5038");ctx.fillStyle=g;ctx.fillRect(0,y,W,70);
  ctx.fillStyle="rgba(255,236,210,0.3)";ctx.fillRect(0,y+68,W,3);g=ctx.createLinearGradient(0,y+70,0,H);g.addColorStop(0,"#5A402C");g.addColorStop(1,"#4A3424");ctx.fillStyle=g;ctx.fillRect(0,y+71,W,H-y-71);}

/* ===== More than a junior: the scenes =====
   Seven chapters, each cut into shots with mj_shots (the series' ag_shots, with cuts, and cameras carried from shot to shot); times
   come from the lines' cues (sc.cues) and their words (wAt), so the pictures stay with the voice if it's recorded again. Berlin's
   pictures are in berlin.js, the room's in plan.js. Every top-level name starts with mj_ or MJ_. */

// draws in the frame's own coordinates, over whatever shot is showing
function mj_screen(ctx,S,fn){setScreen(ctx,S);ctx.save();fn(ctx);ctx.restore();setScreen(ctx,S);}
// where a point of the courtyard lands in the frame from a camera, without changing the one a shot is drawing with
function mj_at(cam,X,Y,Z){const old=MJ_CAM;MJ_CAM=MJ_CAMS[cam];const p=mj_P(X,Y,Z);MJ_CAM=old;return p;}
// Hans's taps: n of them from t0, gap apart; a tap strikes the ground MJ_STRIKE after it starts, and a tick is chalked then
const MJ_STRIKE=0.37;
const mj_taps=(t0,n,gap)=>Array.from({length:n},(_,i)=>t0+i*(gap||0.48));
function mj_count(t,taps){let n=0,last=0;for(const s of taps)if(t>=s+MJ_STRIKE){n++;last=s;}return{n,tick:n?clamp((t-last-MJ_STRIKE)/0.16,0,1):0};}
// a card that springs in at t0 and fades out at t1, as a value 0 to 1 for its k and its a
const mj_card=(t,t0,t1)=>({k:ag_spr(t,t0,0.5),a:ag_in(t,t0,0.25)*(t1==null?1:1-ag_in(t,t1,0.4))});
// The film's own cutting of a chapter into shots: the series' ag_shots, with two changes (PLAYBOOK, "Cut between two framings of one
// moment"). A shot marked cut:true comes in on a cut, not a dissolve: two framings of one moment, or two of Berlin's cameras. And a shot
// in the same place as the one before (the room by day and by night count as one) starts where that one's camera ended and glides from
// there to its own keys; while it dissolves, the shot before is drawn through the same camera, so the dissolve fades in only what
// changed, and nothing shows twice, a little apart.
const mj_placeOf=p=>p&&p.indexOf("lab")===0?"lab":p;
// where a shot's camera is when the next one starts: ag_focus's sums, with the shot's push complete
function mj_camEnd(sh,till){const len=Math.max(1.5,till-sh.at),push=(sh.push==null?0.025:sh.push)*easeCam(clamp((till-sh.at)/len,0,1)),d=Math.max(1.4,sh.d||1.6),keys=sh.keys||[[0,960,540,1]];
  let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((till-keys[i][0])/d,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z*(1+push));return[clamp(x,960/z,W-960/z),clamp(y,540/z,H-540/z),z];}
function mj_shots(ctx,S,t,end,shots,dis){
  for(let k=1;k<shots.length;k++){const a=shots[k-1],b=shots[k];if(b.cut||mj_placeOf(a.place)!==mj_placeOf(b.place))continue;
    const e=mj_camEnd(a,b.at);b.keys=[[b.at,e[0],e[1],e[2]]].concat(b.keys||[[b.at,960,540,1]]);b.carried=true;}
  let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;dis=dis==null?0.5:dis;
  const u=i>0&&!shots[i].cut?clamp((t-shots[i].at)/dis,0,1):1,till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){const a=shots[i-1],b=shots[i];ag_shot(ctx,S,t,b.carried?Object.assign({},a,{at:b.at,keys:b.keys,d:b.d,push:b.push}):a,b.carried?till(i):b.at);const [bc,bx]=ag_buf("cut",ctx.canvas.width,ctx.canvas.height);ag_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else ag_shot(ctx,S,t,shots[i],till(i));return i;}
// the 1904 men of the commission in a half circle behind Hans: [X, Z, which]
const MJ_RING=(()=>{const out=[];for(let i=0;i<13;i++){const u=i/12,an=lerp(-2.8,-0.34,u);out.push([MJ_AT.hans[0]+0.3+Math.cos(an)*3.9,MJ_AT.hans[1]-0.1-Math.sin(an)*3.6,i]);}return out;})();
const MJ_VIS=[[2.1,6.8],[2.9,7.6],[3.7,7.0],[4.6,8.0],[5.4,7.3],[1.4,8.6]];
// more visitors, once the papers have written about him
const MJ_VIS2=[[6.1,8.6],[0.6,9.6],[4.0,9.2],[3.2,5.9],[5.0,6.2],[6.4,7.0]];

/* ---------------------------------------------------------------- 1 · Clever Hans */
scene("hans",(ctx,S,t,sc)=>{const c=sc.cues,H=MJ_AT.hans,O=MJ_AT.osten;
  const tTaps=c.taps-0.5,tPap=c.papers-0.35,tEye=c.how-0.45,tOsten=c.fraud-0.4,tHat=c.stake-0.35,tMen=c.thirteen-0.5,tAut=c.pfungst-0.4,
    tBlind=c.blinkers-0.45,tSeen=c.sight-0.55,tCheat=c.cheat-0.4,tGift=c.gift-0.4,tSince=c.since-0.4,tRoom=c.jun-0.4;
  // the taps: five for 3 + 2, two for the fraction, six for the date; later, past the answer nobody knew, and wrong ones in blinkers
  const t1=mj_taps(c.taps+0.1,5,0.46),t2=mj_taps(wAt(sc,"taps","fractions")+0.55,2,0.46),t3=mj_taps(wAt(sc,"taps","the date")+0.6,6,0.44),
    tNone=mj_taps(c.nobody+0.5,9,0.5),tBl=mj_taps(c.blinkers+1.0,7,0.62),tSn=mj_taps(c.sight+0.3,5,0.46);
  const allTaps=[...t1,...t2,...t3,...tNone,...tBl,...tSn];
  const hans=(x,o)=>mj_hansAt(x,H[0],H[1],Object.assign({t,taps:allTaps},o||{}));
  const osten=(x,X,Z,o)=>mj_standAt(x,X,Z,1.72,MJ_FIG.osten,Object.assign({t},o||{}));
  const fTaught=ag_in(t,c.taught-0.2,0.9);
  // the eye, where Hans watches from, in the courtyard (his head's space through his size)
  const eyeAt=()=>{const p=mj_P(H[0],0,H[1]),s=mj_k(H[1])*1.6/468;return mj_hAt(p[0],p[1],s,[155,163]);};
  // the questioner's head from a camera, over the hat
  const shots=[
    // noon in the courtyard, wide: the stable wall, visitors standing back, von Osten and Hans by the blackboard; the camera drifts in
    {at:0,place:"mjNoon",keys:[[0,960,540,1],[c.noon+0.3,820,430,1.3],[c.taught+0.1,700,440,1.38]],d:4.2,draw:(x,tt)=>{mj_cam("wide");
      MJ_VIS.forEach((v,i)=>mj_standAt(x,v[0],v[1],MJ_VISITORS[i].woman?1.62:1.74,MJ_VISITORS[i],{t:tt+i,arms:i%2?"behind":"hang",flip:true,nod:0.03*Math.sin(tt*0.7+i)}));
      mj_board(x,MJ_AT.board[0],MJ_AT.board[1]);
      hans(x,{head:-0.05*fTaught});
      osten(x,O[0],O[1],{arms:"hold",arms2:"point",mix:fTaught,flip:true,nod:-0.04*fTaught});}},
    // close on the slate and the forefoot: chalk ticks count the taps beside "3 + 2" and stop at five; the slate turns to a fraction,
    // then to a calendar page
    {at:tTaps,cut:true,place:"mjNoonMid",keys:[[tTaps,960,520,1]],push:0.03,draw:(x,tt)=>{mj_cam("mid");const e=mj_easel(x,-2.26,4.0);hans(x,{head:0.04});
      const k1=mj_count(tt,t1),u1=ag_in(tt,wAt(sc,"taps","fractions"),0.5),u2=ag_in(tt,wAt(sc,"taps","the date"),0.5);
      if(u2>0)mj_slate(x,e.x,e.y,e.w,{text:"2/3 + 3/4",turn:u2,next:{cal:{month:"SEPTEMBER",day:6,year:1904}}});
      else mj_slate(x,e.x,e.y,e.w,{text:"3 + 2",ticks:k1.n,tick:k1.tick,turn:u1,next:{text:"2/3 + 3/4"}});}},
    // the papers call him Clever Hans, and more people come
    {at:tPap,cut:true,place:"mjNoon",keys:[[tPap,715,470,1.12]],push:0.03,draw:(x,tt)=>{mj_cam("wide");
      const crowd=MJ_VIS.map((v,i)=>[v,MJ_VISITORS[i],i]).concat(MJ_VIS2.map((v,i)=>[v,i%2?MJ_MEN[(i*3)%13]:MJ_VISITORS[(i+2)%6],i+6])).sort((a,b)=>b[0][1]-a[0][1]);
      crowd.forEach(([v,P,i])=>mj_standAt(x,v[0],v[1],P.woman?1.62:1.74,P,{t:tt+i,arms:i%3?"behind":"hang",flip:true,nod:0.03*Math.sin(tt*0.7+i)}));
      mj_board(x,MJ_AT.board[0],MJ_AT.board[1]);hans(x);osten(x,O[0],O[1],{arms:"hold",flip:false});}},
    // the calm eye: how could a horse do sums?
    {at:tEye,cut:true,place:"mjNoonHead",keys:[[tEye,1140,350,1.8],[tEye+0.1,1132,330,2.6]],d:3.6,push:0.02,draw:(x,tt)=>{mj_cam("head");
      hans(x,{blink:mj_hBlinkAt(tt)+ (tt>c.how+1.3&&tt<c.how+1.62?Math.sin((tt-c.how-1.3)/0.32*Math.PI):0)});}},
    // von Osten, his hat in his hands, his good name at stake: first under the papers' word, then alone, his head bowing as the camera
    // comes in (one shot, so the hat is never seen twice)
    {at:tOsten,cut:true,place:"mjNoonHead",keys:[[tOsten,960,540,1],[tHat,720,570,1.08]],d:4,push:0.03,draw:(x,tt)=>{const P=MJ_PERSON.osten,b=ag_in(tt,tHat,1.0),
        nd=0.04*b+0.08*ag_in(tt,c.stake+0.3,1.4),g=[lerp(3,1,b),lerp(ag_in(tt,c.fraud+0.8,0.6)*2,3,b)];
      ag_person(x,P,560,600,1.05,{t:tt,pose:"hold",nod:nd,gaze:g,hold:(xx,hd)=>{const h=hd.near;xx.save();xx.translate(h[0]+30,h[1]-10);xx.rotate(-0.5);xx.scale(0.9,0.9);xx.translate(-300,-300);mj_hatShape(xx,"slouch",[34,32,34]);xx.restore();}});
      mj_headHat(x,P,560,600,1.05,{t:tt,nod:nd},null);}},
    // the thirteen gather in a half circle; a report: no trick found; over every head, the same answer
    {at:tMen,place:"mjNoonHigh",keys:[[tMen,900,470,1.22],[c.change,mj_at("high",H[0]+0.9,1.0,H[1])[0],mj_at("high",H[0],1.1,H[1])[1],1.55],[wAt(sc,"change","the way"),760,470,1.5]],d:2.2,draw:(x,tt)=>{mj_cam("high");
      const ring=MJ_RING.slice().sort((a,b)=>b[1]-a[1]),order=i=>Math.abs(i-6),hz=H[1];
      const man=m=>{const i=m[2],a0=tMen+0.25+(6-order(i))*0.2,ap=ag_in(tt,a0,0.6);if(ap<=0)return;
        withA(x,ap,()=>mj_standAt(x,m[0],m[1],1.74,MJ_MEN[i],{t:tt+i,arms:["behind","hang","hold"][i%3],flip:m[0]>H[0]+0.3,nod:0.02*Math.sin(tt*0.6+i),
          cloud:(xx,X,Y,k)=>mj_cloud(xx,X,Y,"5",{s:clamp(k*1.7,0.75,1),a:ag_in(tt,c.knew+0.35+i*0.09,0.4)*(1-ag_in(tt,c.change+0.1,0.6)),k:ag_spr(tt,c.knew+0.35+i*0.09,0.45)})}));};
      ring.filter(m=>m[1]>hz).forEach(man);hans(x);osten(x,O[0],O[1],{arms:"hold",flip:true});ring.filter(m=>m[1]<=hz).forEach(man);}},
    // that autumn: leaves on the cobbles, Pfungst with his notebook; nobody there knows the answer, and Hans taps on past it
    {at:tAut,cut:true,place:"mjAutumn",keys:[[tAut,960,540,1],[tAut+0.2,860,500,1.16]],d:5,draw:(x,tt)=>{mj_cam("wide");const q=ag_in(tt,c.nobody+0.1,0.5);
      const cl=(i)=>(xx,X,Y,k)=>mj_cloud(xx,X,Y,"?",{s:clamp(k*1.7,0.75,1),a:ag_in(tt,c.nobody+0.1+i*0.15,0.4),k:ag_spr(tt,c.nobody+0.1+i*0.15,0.45),col:AG.amber});
      mj_standAt(x,-4.6,6.8,1.74,MJ_MEN[3],{t:tt,arms:"behind",cloud:cl(3)});mj_standAt(x,3.0,6.4,1.74,MJ_MEN[7],{t:tt,arms:"hang",flip:true,cloud:cl(2)});
      hans(x);osten(x,O[0],O[1],{arms:"hold",arms2:"ask",mix:ag_in(tt,c.pfungst+1,0.8),flip:false,cloud:cl(0)});
      mj_standAt(x,1.7,3.5,1.74,MJ_FIG.pfungst,{t:tt,arms:"book",flip:true,nod:0.06,cloud:cl(1)});}},
    // large blinkers: the questioner at Hans's right shoulder, out of his sight
    {at:tBlind,place:"mjAutumn",keys:[[tBlind,860,525,1.25]],push:0.02,draw:(x,tt)=>{mj_cam("wide");
      mj_standAt(x,-3.0,6.0,1.74,MJ_FIG.pfungst,{t:tt,arms:"book",flip:false,nod:0.06});
      hans(x,{blinkers:ag_in(tt,c.blinkers+0.2,0.6)});osten(x,H[0]+0.7,3.85,{arms:"hold",flip:true,nod:0.03});}},
    // the questioner in front, in sight; then what Hans had been watching
    {at:tSeen,place:"mjAutumn",keys:[[tSeen,860,525,1.25]],push:0.02,draw:(x,tt)=>{mj_cam("wide");
      mj_standAt(x,-1.6,6.4,1.74,MJ_FIG.pfungst,{t:tt,arms:"book",flip:false,nod:0.06});
      hans(x,{blinkers:1});const head=osten(x,-3.2,4.3,{arms:"ask",flip:false});
      mj_sight(x,eyeAt(),[head.x+4,head.y+10],ag_in(tt,c.watching+0.1,1.2),1);}},
    // no fraud, and no counting: the report of 9 December 1904
    {at:tCheat,place:"mjAutumn",keys:[[tCheat,860,500,1.12]],push:0.02,draw:(x,tt)=>{mj_cam("wide");
      hans(x);osten(x,O[0],O[1],{arms:"hold",flip:false});mj_standAt(x,1.7,3.5,1.74,MJ_FIG.pfungst,{t:tt,arms:"book",flip:true,nod:0.04});}},
    // a movement too small for any expert to notice: a lens over the brim of the questioner's hat
    {at:tGift,cut:true,place:"mjAutumnHead",keys:[[tGift,960,540,1]],push:0.03,draw:(x,tt)=>{const P=MJ_PERSON.osten,X0=700,Y0=640,S0=1.25,lift=1.6*ag_io(tt,c.gift+1.6,c.gift+2.6,0.3);
      const me=(xx,l)=>{ag_person(xx,P,X0,Y0,S0,{t:tt,pose:"hang",gaze:[3,0]});mj_headHat(xx,P,X0,Y0,S0,{t:tt,lift:l},"slouch",[34,32,34]);};me(x,lift*0.1);
      const lx0=X0+(452-296)*S0-10,ly0=Y0+(332-596)*S0,u=ag_sine(clamp((tt-c.gift)/1.4,0,1)),lx=lerp(1500,lx0,u),ly=lerp(560,ly0,u),z=3.2;
      mj_lens(x,lx,ly,170,{a:ag_in(tt,c.gift-0.1,0.4),draw:xx=>{xx.save();xx.translate(lx,ly);xx.scale(z,z);xx.translate(-lx,-ly);xx.drawImage(ag_place("mjAutumnHead"),0,0);me(xx,lift);xx.restore();}});}},
    // ever since: the answer kept from the one who asks, sealed; on a cut, so the two faces never melt into one
    {at:tSince,cut:true,place:"mjAutumnHead",keys:[[tSince,960,540,1]],push:0.03,draw:(x,tt)=>{const P=MJ_PERSON.pfungst,up=ag_spr(tt,c.since+0.2,0.6);
      ag_person(x,P,760,560,1.05,{t:tt,pose:{near:[2,14,"rest"]},pose2:"hold",mix:up,gaze:[3,lerp(0,2,up)],hold:(xx,h)=>{if(up>0.2)mj_envelope(xx,h.near[0]+60,h.near[1]-40,300,{word:"answer",rot:-0.12,a:ag_in(up,0.2,0.3)});}});}},
    // today: the room, Jun and the agent; Berlin's light carries across
    {at:tRoom,place:"lab",keys:[[tRoom,960,540,1]],push:0.025,draw:(x,tt)=>{
      ag_person(x,"jun",296,596,1.0,{t:tt,gaze:[3,0],talk:0,smile:0.3});
      mj_agent(x,{t:tt,core:0.85,think:0.2*ag_in(tt,c.safely,1),textA:1-ag_in(tt,c.breath,0.6)});ag_roomLight(x,1);
      // Berlin, fading out over the room, so the light from the right holds while the courtyard dissolves
      const f=1-ag_in(tt,tRoom,1.5);if(f>0){x.save();x.globalAlpha*=f;x.drawImage(ag_place("mjAutumnHead"),0,0);
        ag_person(x,MJ_PERSON.pfungst,760,560,1.05,{t:tt,pose:"hold",gaze:[3,2],hold:(xx,h)=>mj_envelope(xx,h.near[0]+60,h.near[1]-40,300,{word:"answer",rot:-0.12})});x.restore();}}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.7);
  // over the shots: the place, the slate when nobody knows, the newspaper, the reports, the dot grids
  mj_screen(ctx,S,x=>{
    const tag=ag_io(t,c.berlin-0.1,c.taught-0.6,0.5);if(tag>0)ag_pill(x,236,112,"Berlin, 1904",{a:tag});
    // the newspaper: "Clever Hans" beside von Osten; again over his close-up, turning to "A fraud?"; "He can think!" above the commission's heads
    const p1=mj_card(t,c.papers-0.1,c.how-0.9),p2=mj_card(t,c.fraud-0.1,c.stake-0.4),p3=mj_card(t,c.think-0.1,c.knew-0.3);
    if(p1.a>0)mj_paper(x,lerp(-480,50,ag_eo(ag_in(t,c.papers-0.1,0.7)))-560*ag_in(t,c.how-0.9,0.5),110,400,{head:"Clever Hans",rot:-0.04,a:p1.a});
    if(p2.a>0)mj_paper(x,lerp(1960,1280,ag_eo(ag_in(t,c.fraud-0.1,0.7)))+640*ag_in(t,c.stake-0.4,0.5),120,500,{head:"Clever Hans",next:"A fraud?",turn:ag_in(t,wAt(sc,"fraud","fraud")-0.2,0.6),rot:0.04,a:p2.a});
    if(p3.a>0)mj_paper(x,lerp(-420,96,ag_eo(ag_in(t,c.think-0.1,0.7)))-560*ag_in(t,c.knew-0.3,0.5),36,360,{head:"He can think!",rot:-0.05,a:p3.a});
    const r1=mj_card(t,wAt(sc,"thirteen","found no trick"),tAut);if(r1.a>0)ag_textCard(x,1250,96,520,{kick:"12 September 1904",title:"No trick found"},{kickCol:AG.kick,k:r1.k,a:r1.a});
    // the slate when nobody there knows the answer: the ticks go on past it, amber
    const sl=mj_card(t,c.nobody-0.2,tBlind+0.2);if(sl.a>0){const k=mj_count(t,tNone);x.save();x.globalAlpha*=sl.a;ag_about(x,1180,183,lerp(0.6,1,sl.k));mj_slate(x,1000,50,360,{text:"?",ticks:k.n,tick:k.tick,past:5});x.restore();}
    // the two dot grids: out of sight, then in sight
    const g1=mj_card(t,c.blinkers+0.3,tCheat),g2=mj_card(t,c.sight-0.2,tCheat);
    if(g1.a>0)mj_grid(x,1452,96,26,MJ_RIGHT.blind,ag_in(t,c.blinkers+0.9,3.6),"Out of sight · 6 in 100",{a:g1.a,k:g1.k});
    if(g2.a>0)mj_grid(x,1452,500,26,MJ_RIGHT.seen,ag_in(t,c.sight+0.1,2.4),"In sight · 89 in 100",{a:g2.a,k:g2.k});
    const r2=mj_card(t,c.cheat+0.1,tGift);if(r2.a>0)ag_textCard(x,560,86,800,{kick:"9 December 1904",title:"No fraud. Hans can't count.",sub:"He reads the one who asks."},{kickCol:AG.kick,k:r2.k,a:r2.a});
  });
  ag_title(ctx,S,t,c.breath,"More than a junior","less than a person","FILM 4 OF 9 · WHAT AN AGENT IS");
});

/* ---------------------------------------------------------------- the room's shared moves */
// a veil over the room, so a card in front of it reads; the two-column card's place; the paper junior's and its ladder's
const mj_veil=(x,a)=>{if(a>0){x.fillStyle="rgba(240,238,233,"+(0.66*clamp(a,0,1))+")";x.fillRect(0,0,W,H);}};
const MJ_TWO_AT=[480,130],MJ_JR={x:660,y:860,h:460},MJ_LAD={x:890,y:860,h:360};
// a quick wobble that settles, from t0
const mj_wob=(t,t0,amp)=>{const w=t-t0;return w>0?amp*Math.exp(-2.4*w)*Math.sin(w*6.5):0;};
// a value that steps from 0 to n as times pass, each step eased over d
const mj_steps=(t,times,d)=>times.reduce((s,t0)=>s+clamp((t-t0)/(d||0.5),0,1),0);
// the kicker, over the room's shots
const mj_kick=(ctx,S,a)=>{if(a>0)mj_screen(ctx,S,x=>ag_kicker(x,"1.4","More than a junior",{a}));};
// the morning's light from the window
function mj_morning(x,a){if(a<=0)return;const g=x.createRadialGradient(1900,80,40,1700,200,1300);g.addColorStop(0,"rgba(255,232,188,"+(0.42*a)+")");g.addColorStop(0.6,"rgba(255,236,196,"+(0.12*a)+")");g.addColorStop(1,"rgba(255,236,196,0)");
  x.save();x.globalCompositeOperation="screen";x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();}
// a card flying from a small box to its place: a plain card while it flies, its words once it lands
function mj_fly(x,from,to,u,drawAt){const e=ag_sine(u),bx=lerp(from.x,to.x,e),by=lerp(from.y,to.y,e),bw=lerp(from.w,to.w,e),bh=lerp(from.h,to.h,e);
  if(u<0.92)ag_box(x,bx,by,bw,bh,lerp(12,22,e),{edge:AG.blue,edgeA:0.5,lw:2});withA(x,ag_in(u,0.86,0.14),()=>drawAt(x));}

/* ---------------------------------------------------------------- 2 · A junior who needs supervision */
scene("junior",(ctx,S,t,sc)=>{const c=sc.cues,tB=c.knows-0.5,tC=c.looks-0.5,tD=c.ways-0.3;
  const tReason=wAt(sc,"agent","reasons"),tHands=wAt(sc,"agent","with hands"),tLoop=wAt(sc,"agent","in a loop"),tAdv=wAt(sc,"advice","often told"),tBadge=wAt(sc,"advice","junior who");
  const reach=ag_sine(clamp((t-tHands+0.1)/1.0,0,1))*(1-ag_sine(clamp((t-c.advice-1.8)/1.0,0,1)));
  const lit=t>=tReason&&t<tHands?0:t>=tHands&&t<tLoop?1:t>=tLoop&&t<tLoop+1.8?2:null;
  const agent=(x,tt,o)=>mj_agent(x,Object.assign({t:tt,think:0.25+0.45*ag_in(tt,tReason,0.6)*(1-0.5*ag_in(tt,c.advice+1,1)),badge:clamp((tt-tBadge)/1,0,1),lit},o||{}));
  const jun=(x,tt,g)=>ag_person(x,"jun",296,596,1.0,{t:tt,gaze:g||[3,0],smile:0.3});
  // the paper junior: it steps in, its three small jobs ticked by a reviewer; month by month, fewer ticks; a mistake tips its ladder
  const tStep=c.knows-0.3,tJobs=wAt(sc,"knows","small jobs"),tMonth=wAt(sc,"less","month by month"),tMis=wAt(sc,"careful","a mistake");
  const months=[tMonth,tMonth+0.7,tMonth+1.4],m=mj_steps(t,months,0.5),ticks=Math.round(clamp(mj_steps(t,[tJobs+0.5,tJobs+0.9,tJobs+1.3],0.3),0,3)-clamp(Math.floor(m+0.5),0,2));
  const junior=(x,tt)=>{const st=ag_eo(clamp((tt-tStep)/0.9,0,1));if(st<=0)return;withA(x,st,()=>{
      mj_ladder(x,MJ_LAD.x,MJ_LAD.y,MJ_LAD.h,{tip:mj_wob(tt,tMis+0.2,-0.11)});
      mj_junior(x,MJ_JR.x-60*(1-st),MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:3,ticks,amber:ag_io(tt,tMis,c.looks-0.7,0.3)});});};
  const shots=[
    // the agent at work: it reasons, an arm reaches a tool and data comes back, round its loop; the advice, pinned to the marble; the badge
    {at:0,place:"lab",keys:[[0,960,540,1.025]],push:0.02,draw:(x,tt)=>{jun(x,tt,tt>tAdv?[2,-2]:[3,0]);
      ag_tool(x,1604,422,258,116,"Query",{touch:ag_in(reach,0.9,0.1),a:ag_in(tt,0.3,0.6)*(1-ag_in(tt,c.advice+2.6,0.6))});
      agent(x,tt);mj_arm(x,1604,480,reach,{data:clamp((tt-tLoop)/1.4,0,1)});ag_roomLight(x,1);
      const cd=mj_card(tt,tAdv-0.2,null);if(cd.a>0){ag_textCard(x,440,150,500,{kick:"Often told",title:"Treat it like a junior who needs supervision"},{kickCol:AG.kick,k:cd.k,a:cd.a});withA(x,cd.a,()=>mj_pin(x,690,160));}}},
    // the junior picture beside it: small jobs, checked, then checked less; careful, because a mistake would cost them
    {cut:true,at:tB,place:"lab",keys:[[tB,960,540,1],[tB+0.05,760,532,1.28]],d:2.2,push:0.015,draw:(x,tt)=>{jun(x,tt,[3,1]);agent(x,tt);junior(x,tt);ag_roomLight(x,1);
      const mc=mj_card(tt,c.less-0.1,null);if(mc.a>0)mj_month(x,450,236,1+Math.floor(m),{turn:m%1,k:mc.k,a:mc.a});}},
    // but the agent only looks like the picture: its badge swings, and its shadow on the wall is a sphere's
    {cut:true,at:tC,place:"lab",keys:[[tC,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt,[3,0]);
      const sh=ag_in(tt,wAt(sc,"looks","only looks"),1.2);if(sh>0){x.save();x.filter="blur(14px)";x.fillStyle="rgba(46,38,28,"+(0.2*sh)+")";x.beginPath();x.arc(MJ_ROOM.agent.x-74,MJ_ROOM.agent.y+20,92,0,TAU);x.fill();x.filter="none";x.restore();}
      agent(x,tt,{swing:mj_wob(tt,wAt(sc,"looks","like Hans"),0.22)});junior(x,tt);ag_roomLight(x,1);}},
    // the two-column card, its rows still empty
    {cut:true,at:tD,place:"lab",keys:[[tD,960,540,1]],push:0,draw:(x,tt)=>{jun(x,tt,[3,0]);agent(x,tt,{textA:1-ag_in(tt,tD,0.4)});junior(x,tt);ag_roomLight(x,1);setScreen(x,S);mj_veil(x,ag_in(tt,tD,0.6));
      const k=ag_spr(tt,tD+0.1,0.5);mj_two(x,MJ_TWO_AT[0],MJ_TWO_AT[1],{k,a:ag_in(tt,tD+0.1,0.3),more:ag_in(tt,wAt(sc,"ways","two ways"),0.5),less:ag_in(tt,wAt(sc,"ways","in three"),0.5)});}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.6);mj_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 3 · More than a junior */
scene("more",(ctx,S,t,sc)=>{const c=sc.cues,tB=c.week-0.5,tC=c.undersells-0.5,tD=c.pace-0.5,tE=wAt(sc,"pace","The agent's")-0.4;
  const tRead=wAt(sc,"reads","reads the whole"),tPath=wAt(sc,"reads","draws the path"),tMin=wAt(sc,"reads","about a minute"),tThou=wAt(sc,"lifetimes","a thousand");
  const rd=clamp((t-tRead-0.3)/2.4,0,1),pp=clamp((t-tPath+0.1)/1.6,0,1);
  const tDanger=wAt(sc,"undersells","a danger"),tRein=wAt(sc,"rein","change every table");
  const a1=clamp((t-tDanger+0.1)/1.3,0,1),a2=clamp((t-tRein)/1.5,0,1),amber=a2>0?a2:a1<1?a1:0;
  const tables=(x,tt,o)=>mj_tables(x,Object.assign({read:rd,path:pp,flow:pp>=1?tt:null,amber,a:ag_in(tt,tRead-0.7,0.6)},o||{}));
  // an arm runs along the cards as they're read, then rests on the path's end while the data comes back; and again, quickly, across them all
  const along=u=>{const v=clamp(u,0,1)*32,i=Math.floor(v),f=v-i,b0=mj_tableBox(i),b1=mj_tableBox(Math.min(32,i+1));return[lerp(b0.x,b1.x,f)+12,lerp(b0.y,b1.y,f)+MJ_T.h/2+8];};
  const arm=(x,tt)=>{const u=ag_sine(clamp((tt-tRead)/0.8,0,1))*(1-ag_sine(clamp((tt-tMin-1.6)/1.0,0,1)));const end=mj_tableBox(MJ_T.path[5]);
    if(u>0){const p=pp>0?[end.x+12,end.y+MJ_T.h/2+8]:along(rd);mj_arm(x,p[0],p[1],u,{data:pp>=1?clamp((tt-tPath-1.6)/1.4,0,1):0});}
    const u2=ag_sine(clamp((tt-tRein+0.4)/0.5,0,1))*(1-ag_sine(clamp((tt-tRein-1.6)/0.6,0,1)));if(u2>0){const p=along(a2);mj_arm(x,p[0],p[1],u2);}};
  const jun=(x,tt)=>ag_person(x,"jun",296,596,1.0,{t:tt,gaze:[3,0],smile:0.3});
  const agent=(x,tt,o)=>mj_agent(x,Object.assign({t:tt,badge:1,think:0.25+0.65*ag_io(tt,tRead,tMin+1.2,0.5)+0.5*ag_io(tt,tRein-0.2,tRein+1.6,0.3)},o||{}));
  const clock=(x,tt)=>{const ca=ag_in(tt,tMin-0.3,0.4);if(ca>0)mj_clock(x,640,540,58,9,14,{label:"about a minute",sweep:clamp((tt-tMin+0.2)/1.4,0,1),k:ag_spr(tt,tMin-0.3,0.5),a:ca});};
  const shots=[
    // Jun's question; the agent reads the 33 tables and draws the path, in about a minute
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt);tables(x,tt);agent(x,tt);arm(x,tt);ag_roomLight(x,1);
      const q=mj_card(tt,c.asks+0.3,null);if(q.a>0)mj_q(x,452,212,384,"How is the award count built?",{k:q.k,a:q.a,py:160});
      const n=ag_in(tt,wAt(sc,"reads","thirty-three")-0.1,0.4);if(n>0)ag_pill(x,1760,222,"33 tables",{a:n,col:AG.blue});
      const s1=ag_in(tt,tPath,0.4),s2=ag_in(tt,tPath+1.3,0.4);if(s1>0)ag_pill(x,1383,222,"Student records",{a:s1*(1-n*0)});if(s2>0)ag_pill(x,1591,790,"Government report",{a:s2,col:AG.orange});
      clock(x,tt);}},
    // a new junior would need a week; a lifetime of reading, and the shelf that runs out of the frame
    {cut:true,at:tB,place:"lab",keys:[[tB,960,540,1]],push:0.02,draw:(x,tt)=>{tables(x,tt);agent(x,tt);
      mj_junior(x,360,880,500,{t:tt,badge:1,cards:1});ag_roomLight(x,1);
      const wk=mj_card(tt,c.week-0.2,null);if(wk.a>0)mj_week(x,120,190,{label:"a week",p:clamp((tt-c.week-0.1)/1.6,0,1),k:wk.k,a:wk.a});
      mj_shelf(x,560,200,300,{label:"one lifetime of reading",seed:5,a:ag_in(tt,c.lifetimes-0.1,0.5)});
      mj_shelf(x,980,200,1000,{seed:9,p:clamp((tt-tThou+0.4)/2.8,0,1),a:ag_in(tt,tThou-0.4,0.4)});clock(x,tt);}},
    // the junior picture undersells it, and hides a danger: every table, the wrong way, as fast as the right one. Then the paper junior
    // steps in beside Jun, as in chapter 2: a junior's pace keeps their mistakes small, its one card amber, alone, beside the agent's 33
    {cut:true,at:tC,place:"lab",keys:[[tC,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt);tables(x,tt);agent(x,tt);arm(x,tt);
      const st=ag_eo(clamp((tt-tD)/0.9,0,1));if(st>0)withA(x,st,()=>mj_junior(x,MJ_JR.x-60*(1-st),MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,amber:ag_in(tt,c.pace+0.4,0.5)}));
      ag_roomLight(x,1);const r=ag_io(tt,c.rein-0.1,tD,0.4);if(r>0)ag_pill(x,1600,222,"If it had free rein",{a:r,icon:"warn",col:AG.amber});}},
    // the two-column card: the first two rows
    {cut:true,at:tE,place:"lab",keys:[[tE,960,540,1]],push:0,draw:(x,tt)=>{jun(x,tt);tables(x,tt,{a:1-ag_in(tt,tE+0.2,0.8)});agent(x,tt,{textA:1-ag_in(tt,tE,0.4)});mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,amber:1});ag_roomLight(x,1);
      setScreen(x,S);mj_veil(x,ag_in(tt,tE,0.5));const f0=mj_steps(tt,[tE+0.4,tE+0.9]),f1=mj_steps(tt,[tE+1.4,tE+1.9]),l=ag_in(tt,tE+2.4,0.6);
      mj_two(x,MJ_TWO_AT[0],MJ_TWO_AT[1],{fill:[f0,f1],lit:[l,l],more:l,less:1,k:ag_spr(tt,tE,0.5),a:ag_in(tt,tE,0.3)});}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.6);mj_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 4 · No memory of yesterday */
const MJ_SES={x:1336,y:110,w:540,h:720};
const MJ_AWARD="A qualification the university confers, such as a master or a microcredential, for at least 6 credit points";
scene("memory",(ctx,S,t,sc)=>{const c=sc.cues,tB=c.next-0.5,tC=c.told-0.5,tD=c.none-0.4,tE=c.notes-0.5;
  const tShow=wAt(sc,"first","shows how"),tPoint=wAt(sc,"glossary","points it"),tAgain=c.again+0.2;
  const jun=(x,tt,o)=>ag_person(x,"jun",296,596,1.0,Object.assign({t:tt,gaze:[3,0],smile:0.3},o||{}));
  const agent=(x,tt,ta)=>mj_agent(x,{t:tt,badge:1,textA:ta,think:0.25+0.6*(ag_io(tt,c.count+0.5,tShow,0.4)+ag_io(tt,c.again-0.6,tAgain+0.6,0.3)+ag_io(tt,wAt(sc,"next","asks for"),c.out+0.4,0.4))});
  const answer=(x,X,Y,tt,title,rows,tIn,tOpen,a)=>ag_evidence(x,X,Y,480,{kick:"Agent",title},[{kick:"Query",title:"Count awards",col:AG.blue},{kick:"Rows",title:rows,col:AG.orange}],{ew:228,open:clamp((tt-tOpen)/1.2,0,1),k:ag_spr(tt,tIn,0.5),a:a*ag_in(tt,tIn,0.25)});
  const S1=(x,tt,dx,a)=>mj_session(x,MJ_SES.x+dx,MJ_SES.y,MJ_SES.w,MJ_SES.h,{sub:"today",k:ag_spr(tt,c.count-0.5,0.5),a:a*ag_in(tt,c.count-0.5,0.3),draw:xx=>{const X=MJ_SES.x+dx+30;
      const q=mj_card(tt,c.count+0.2,null);if(q.a>0)mj_q(xx,X,MJ_SES.y+96,420,"Awards this year?",{tail:false,k:q.k,a:q.a});
      if(tt<tAgain+0.3)answer(xx,X,MJ_SES.y+290,tt,"4,812 awards","4,812 rows",c.first-0.3,tShow,1-ag_in(tt,tAgain,0.3));
      if(tt>=tAgain)answer(xx,X,MJ_SES.y+290,tt,"4,867 awards","4,867 rows",tAgain,tAgain+0.5,1);}});
  // the first session slides out to the left at the next morning, drawn the same in both shots so the dissolve never shows it twice;
  // the next morning's session slides in from the right: by faculty, 4,812 again; it fades just before the two-column card comes
  const S1out=(x,tt)=>{const out=ag_sine(clamp((tt-tB)/1.0,0,1));if(out<1)S1(x,tt,-380*out,1-out);};
  const S2=(x,tt)=>{const sx=lerp(1980,MJ_SES.x,ag_eo(clamp((tt-c.next-0.2)/1.0,0,1)));
    mj_session(x,sx,MJ_SES.y,MJ_SES.w,MJ_SES.h,{sub:"next morning",a:1-ag_in(tt,tD-0.45,0.4),draw:xx=>{const q=mj_card(tt,wAt(sc,"next","asks for")-0.1,null);if(q.a>0)mj_q(xx,sx+30,MJ_SES.y+96,420,"Awards by faculty?",{tail:false,k:q.k,a:q.a});
      mj_bars(xx,sx+40,MJ_SES.y+300,460,{p:clamp((tt-c.out+0.3)/1.6,0,1),total:ag_in(tt,wAt(sc,"out","add up"),0.4),warn:tt>wAt(sc,"out","left the")-0.1,a:ag_in(tt,c.out-0.4,0.3)});}});};
  const shots=[
    // a session: Jun's question, the count with its evidence; the glossary's word; the count again
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const pt=ag_io(tt,tPoint-0.2,c.again,0.5);
      jun(x,tt,{pose:{near:[2,14,"rest"]},pose2:{near:[80,112,"point"]},mix:pt,gaze:pt>0.3?[3,-3]:[3,0]});agent(x,tt);
      const reach=ag_sine(clamp((tt-tPoint-0.9)/0.9,0,1))*(1-ag_sine(clamp((tt-tAgain-0.6)/0.8,0,1)));mj_arm(x,880,430,reach,{from:"left",data:clamp((tt-tPoint-1.8)/1.2,0,1)});
      ag_roomLight(x,1);S1out(x,tt);
      const g=mj_card(tt,c.glossary-0.1,tB-0.2);if(g.a>0)ag_textCard(x,452,212,420,{kick:"Glossary",title:"Award",sub:MJ_AWARD},{kickCol:AG.blue,edge:AG.blue,edgeA:0.4,k:g.k,a:g.a});}},
    // the next morning: a new session, which knows nothing of yesterday; by faculty, 4,812 again
    {cut:true,at:tB,place:"lab",keys:[[tB,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt);agent(x,tt);ag_roomLight(x,1);mj_morning(x,ag_in(tt,tB+0.3,1.6));S1out(x,tt);S2(x,tt);}},
    // a junior, told once, would remember: the paper junior steps in beside Jun, as in chapter 2, and nods
    {cut:true,at:tC,place:"lab",keys:[[tC,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt);agent(x,tt);
      const st=ag_eo(clamp((tt-tC)/0.9,0,1));if(st>0)withA(x,st,()=>mj_junior(x,MJ_JR.x-60*(1-st),MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,nod:0.16*Math.sin(clamp((tt-c.told-0.8)/0.9,0,1)*Math.PI)}));
      ag_roomLight(x,1);mj_morning(x,1);S2(x,tt);}},
    // the two-column card: memory
    {cut:true,at:tD,place:"lab",keys:[[tD,960,540,1]],push:0,draw:(x,tt)=>{jun(x,tt);agent(x,tt,1-ag_in(tt,tD,0.4));mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1});ag_roomLight(x,1);mj_morning(x,1);setScreen(x,S);mj_veil(x,ag_in(tt,tD,0.5));
      mj_two(x,MJ_TWO_AT[0],MJ_TWO_AT[1],{fill:[2,2,mj_steps(tt,[tD+0.5,wAt(sc,"none","no memory")])],lit:[1,1],more:1,less:1,k:ag_spr(tt,tD,0.5),a:ag_in(tt,tD,0.3)});}},
    // the team's notes for agents, and every session that reads them
    {at:tE,place:"lab",keys:[[tE,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt,{pose:{near:[2,14,"rest"]},pose2:"explain",mix:ag_io(tt,c.lesson-0.4,c.lesson+3,0.5),gaze:[3,-2]});ag_roomLight(x,1);
      const nb=mj_notes(x,500,130,620,{write:clamp((tt-c.lesson+0.1)/2.6,0,1),k:ag_spr(tt,c.notes-0.2,0.5),a:ag_in(tt,c.notes-0.2,0.3)});
      ["Jun","Mei","Noor"].forEach((who,i)=>{const t0=c.whoever+0.1+i*0.45,sa=ag_in(tt,t0+0.3,0.3);if(sa<=0)return;const X=560+i*440,Y=560;
        const ar=clamp((tt-t0)/0.6,0,1);x.save();x.strokeStyle=rgba(AG.blue,0.7);x.lineWidth=4;x.lineCap="round";const p=[810,nb.y+nb.h+8,810,nb.y+nb.h+60,X+200,Y-70,X+200,Y-10];ag_bzPath(x,p,0,ar);x.stroke();
        if(ar>=1)ag_arrowHead(x,X+200,Y-8,Math.PI/2,13,rgba(AG.blue,0.85));x.restore();
        mj_session(x,X,Y,400,250,{sub:who,k:ag_spr(tt,t0+0.3,0.5),a:sa,draw:xx=>{const v=ag_in(tt,t0+1.0,0.4);if(v>0){ag_T(xx,"4,867 awards",X+30,Y+150,{w:700,size:36,a:v});ag_tick(xx,X+350,Y+138,30,rgba(AG.green,v),5);}}});});}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.6);mj_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 5 · Nothing to lose */
const MJ_UNREAD=[[4,"Old course codes"],[20,"Awards at census day"],[29,"Units by week"]];
scene("lose",(ctx,S,t,sc)=>{const c=sc.cues,tN=wAt(sc,"faster","the nightly run")-0.3,tA2=c.three+1.6,tB1=c.junior-0.5,tB2=c.agent-0.5,tC=c.rights-0.5,tD1=c.yearly-0.5,tD2=c.two-0.5,tD3=c.approves-0.5;
  const tFind=wAt(sc,"three","nothing seems"),tDraft=c.drafts+0.3,tOne=wAt(sc,"yearly","one of the three"),tOnce=wAt(sc,"yearly","once a year"),tBack=c.yearly+4.7,tRev=wAt(sc,"two","Jun reviews"),tApp=wAt(sc,"two","Noor approves");
  const jun=(x,tt,o)=>ag_person(x,"jun",296,596,1.0,Object.assign({t:tt,gaze:[3,0],smile:0.3},o||{}));
  const agent=(x,tt,o)=>mj_agent(x,Object.assign({t:tt,badge:1,think:0.25+0.6*ag_io(tt,c.three-0.3,tDraft+0.8,0.4)},o||{}));
  const cardAt=[[300,130],[300,318],[300,506]],W5=500;
  const draftTitle=tt=>tt<tBack+1.2?"Delete 3 tables":"Delete 2 tables";
  const shots=[
    // another day: Jun asks
    {at:0,place:"lab",keys:[[0,960,540,1.02]],push:0.02,draw:(x,tt)=>{jun(x,tt);mj_tables(x,{});agent(x,tt);ag_roomLight(x,1);
      const q=mj_card(tt,c.faster+0.2,null);if(q.a>0)mj_q(x,452,212,420,"Can you speed up the nightly run?",{k:q.k,a:q.a,py:160});}},
    // the nightly run: two in the morning, the tables built one by one
    {at:tN,place:"labNight",keys:[[tN,960,540,1]],push:0.02,draw:(x,tt)=>{const p=clamp((tt-tN-0.3)/3.2,0,1);mj_tables(x,{read:p});agent(x,tt,{core:0.6,think:0.1});
      ag_roomLight(x,1,{night:true});ag_model(x,MJ_ROOM.agent.x,MJ_ROOM.agent.y,MJ_ROOM.agent.r,{t:tt,core:0.6,only:"light"});
      mj_clock(x,560,220,64,2,0,{label:"02:00 · nightly run",k:ag_spr(tt,tN+0.5,0.5),a:ag_in(tt,tN+0.5,0.4)});mj_run(x,380,420,560,{p});}},
    // three tables nothing seems to read; in seconds, a draft that deletes them
    {at:tA2,place:"lab",keys:[[tA2,960,540,1]],push:0.02,draw:(x,tt)=>{const gone={};MJ_UNREAD.forEach(([i])=>gone[i]=ag_in(tt,tFind,0.2));
      mj_tables(x,{gone,dim:ag_in(tt,tFind,0.6)*0.5});agent(x,tt);
      const u=ag_sine(clamp((tt-c.drafts)/0.7,0,1))*(1-ag_sine(clamp((tt-tDraft-1.4)/0.8,0,1)));mj_arm(x,806,762,u,{from:"left"});ag_roomLight(x,1);
      MJ_UNREAD.forEach(([i,name],k)=>{const u=clamp((tt-tFind-k*0.25)/0.8,0,1);if(u<=0)return;const b=mj_tableBox(i),to={x:cardAt[k][0],y:cardAt[k][1],w:W5,h:138};
        mj_fly(x,b,to,u,xx=>mj_tableCard(xx,to.x,to.y,W5,name,{sub:"no reads in 90 days"}));});
      const d=mj_card(tt,tDraft,null);if(d.a>0)mj_draft(x,300,694,W5,draftTitle(tt),{k:d.k,a:d.a});}},
    // a junior would have asked around first, with their name on the work and a career ahead
    {cut:true,at:tB1,place:"lab",keys:[[tB1,760,532,1.28]],push:0.015,draw:(x,tt)=>{agent(x,tt);
      mj_ladder(x,MJ_LAD.x,MJ_LAD.y,MJ_LAD.h,{a:ag_in(tt,wAt(sc,"junior","a career")-0.2,0.5)});mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,name:true});ag_roomLight(x,1);
      const ta=wAt(sc,"junior","asked around");[[470,330],[560,220],[720,190]].forEach(([bx,by],k)=>{const v=mj_card(tt,ta+k*0.25,tB2-0.35);mj_ask(x,bx,by,MJ_JR.x-20,MJ_JR.y-MJ_JR.h+40,{k:v.k,a:v.a});});}},
    // the two-column card: career, and what a mistake costs
    {cut:true,at:tB2,place:"lab",keys:[[tB2,960,540,1]],push:0,draw:(x,tt)=>{agent(x,tt,{textA:1-ag_in(tt,tB2,0.4)});mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,name:true});ag_roomLight(x,1);setScreen(x,S);mj_veil(x,ag_in(tt,tB2,0.5));
      mj_two(x,MJ_TWO_AT[0],MJ_TWO_AT[1],{fill:[2,2,2,mj_steps(tt,[tB2+0.4,wAt(sc,"agent","no career")]),mj_steps(tt,[wAt(sc,"agent","no mistake")-0.2,wAt(sc,"agent","costs it")])],lit:[1,1],more:1,less:1,k:ag_spr(tt,tB2,0.5),a:ag_in(tt,tB2,0.3)});}},
    // so its caution comes from its rights: it reads production through glass; it writes only drafts, in a sandbox, for a person
    {cut:true,at:tC,place:"lab",keys:[[tC,960,540,1]],push:0.02,draw:(x,tt)=>{const tR=wAt(sc,"rights","it reads"),tW=wAt(sc,"rights","writes only"),tP=wAt(sc,"rights","wait for");
      mj_tables(x,{});agent(x,tt);ag_glass(x,1316,236,580,520,{label:"Production · read only",a:ag_in(tt,tR-0.6,0.6)});
      const dy=lerp(-90,0,ag_spr(tt,tW+0.3,0.6));const d=ag_in(tt,tW+0.2,0.3);if(d>0)mj_draft(x,440,600+dy,400,"Delete 3 tables",{a:d});
      ag_sandbox(x,640,790,520,{a:ag_in(tt,tW-0.4,0.5)});
      mj_arm(x,1312,430,ag_sine(clamp((tt-tR+0.2)/0.8,0,1)),{data:clamp((tt-tR-0.8)/1.2,0,1)});mj_arm(x,846,650,ag_sine(clamp((tt-tW+0.1)/0.8,0,1))*(1-ag_sine(clamp((tt-tP)/0.8,0,1))),{from:"left"});
      ag_roomLight(x,1);const w=ag_in(tt,tP,0.4);if(w>0)ag_pill(x,640,556,"Waiting for a person",{a:w,col:AG.blue});}},
    // Jun asks around: one is read once a year, for the government; it goes back, and the other two will go
    {at:tD1,place:"lab",keys:[[tD1,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt,{gaze:[3,-1]});const gone={};MJ_UNREAD.forEach(([i])=>gone[i]=1);
      const back=clamp((tt-tBack)/0.9,0,1);if(back>0)gone[20]=1-ag_in(back,0.9,0.1);mj_tables(x,{gone});agent(x,tt);ag_roomLight(x,1);
      const at=[[480,110],[480,296],[480,520]];withA(x,ag_in(tt,tD1+0.45,0.4),()=>MJ_UNREAD.forEach(([i,name],k)=>{const yr=k===1,fade=yr?0:ag_in(tt,tBack+1.0,0.6);
        if(yr&&back>0){mj_fly(x,{x:at[k][0],y:at[k][1],w:450,h:176},mj_tableBox(i),back,()=>{});if(back<0.12)mj_tableCard(x,at[k][0],at[k][1],450,name,{sub:"read once a year, for the report to the government",a:1-back/0.12});return;}
        const tu=ag_in(tt,tOnce-0.2,0.5),bb=mj_tableCard(x,at[k][0],at[k][1],450,name,{sub:"no reads in 90 days",next:"read once a year, for the report to the government",turn:yr?tu:0,edge:yr?AG.green:AG.blue,edgeA:yr?0.45+0.45*tu:0.45,a:1-fade});
        // a small calendar in its corner, one day ringed
        if(yr){const ca=ag_in(tt,tOne,0.4),r=clamp((tt-tOne-0.3)/0.9,0,1);if(ca>0)withA(x,ca,()=>{const gx=at[k][0]+450-110,gy=at[k][1]+14;
          mj_cal(x,gx,gy,1,{ring:r});});}}));}},
    // the change goes ahead with two: Jun reviews it, Noor approves it for production
    {at:tD2,place:"lab",keys:[[tD2,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt,{gaze:[3,-1]});agent(x,tt);
      const na=ag_in(tt,tApp-0.9,0.6);if(na>0)withA(x,na,()=>ag_person(x,"noor",1660,690,0.8,{t:tt,flip:true,gaze:[3,0],smile:0.35}));ag_roomLight(x,1);
      mj_draft(x,470,160,440,"Delete 2 tables",{});mj_stamp(x,690,390,"Reviewed · Jun",AG.green,{p:clamp((tt-tRev-0.1)/0.45,0,1),rot:-0.05});
      mj_stamp(x,700,500,"Approved · Noor",AG.green,{p:clamp((tt-tApp-0.2)/0.45,0,1),rot:0.04});}},
    // a junior grows into the one who approves; the agent never does: its review is for reference
    {cut:true,at:tD3,place:"lab",keys:[[tD3,960,540,1]],push:0.02,draw:(x,tt)=>{const up=ag_sine(clamp((tt-wAt(sc,"approves","grows into"))/1.4,0,1));
      agent(x,tt);mj_ladder(x,790,MJ_LAD.y,MJ_LAD.h,{});mj_junior(x,lerp(560,740,up),MJ_JR.y-60*up,MJ_JR.h,{t:tt,badge:1,cards:1,name:true});ag_roomLight(x,1);
      const rv=mj_card(tt,wAt(sc,"approves","its review")-0.2,null);if(rv.a>0)mj_review(x,1336,200,460,{k:rv.k,a:rv.a});}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.6);mj_kick(ctx,S,1-ag_io(t,tN-0.3,tA2,0.4));});

/* ---------------------------------------------------------------- 6 · Asked the way Pfungst asked */
scene("asked",(ctx,S,t,sc)=>{const c=sc.cues,H=MJ_AT.hans,O=MJ_AT.osten,tB=c.lift-0.5,tC=c.unaware-0.5,tD=c.name-0.5,tE=c.jun-0.5;
  const taps=mj_taps(c.berlin+0.4,5,0.5),tRight=wAt(sc,"lift","the right number");
  const shots=[
    // back in Berlin: von Osten asks, Hans taps, Pfungst watches
    {at:0,place:"mjAutumn",keys:[[0,860,500,1.12]],push:0.02,draw:(x,tt)=>{mj_cam("wide");
      mj_hansAt(x,H[0],H[1],{t:tt,taps});const head=mj_standAt(x,O[0],O[1],1.72,MJ_FIG.osten,{t:tt,arms:"ask",flip:false});
      mj_standAt(x,1.7,3.5,1.74,MJ_FIG.pfungst,{t:tt,arms:"book",flip:true,nod:0.05});
      const p=mj_P(H[0],0,H[1]),s=mj_k(H[1])*1.6/468;mj_sight(x,mj_hAt(p[0],p[1],s,[155,163]),[head.x+4,head.y+10],ag_in(tt,c.berlin+1.4,1.2),1);}},
    // at the right number, the questioner's head lifts: in von Osten, a fifth of a millimetre at most
    {at:tB,cut:true,place:"mjAutumnHead",keys:[[tB,960,540,1]],push:0.03,draw:(x,tt)=>{const P=MJ_PERSON.osten,X0=700,Y0=640,S0=1.25,lift=1.6*ag_io(tt,tRight+0.3,tRight+1.6,0.3);
      const me=(xx,l)=>{ag_person(xx,P,X0,Y0,S0,{t:tt,pose:"hang",gaze:[3,0]});mj_headHat(xx,P,X0,Y0,S0,{t:tt,lift:l},"slouch",[34,32,34]);};me(x,lift*0.1);
      const lx0=X0+(452-296)*S0-10,ly0=Y0+(332-596)*S0,u=ag_sine(clamp((tt-c.lift+0.2)/1.4,0,1)),lx=lerp(1500,lx0,u),ly=lerp(560,ly0,u),z=3.2;
      mj_lens(x,lx,ly,170,{a:ag_in(tt,c.lift-0.3,0.4),draw:xx=>{xx.save();xx.translate(lx,ly);xx.scale(z,z);xx.translate(-lx,-ly);xx.drawImage(ag_place("mjAutumnHead"),0,0);me(xx,lift);xx.restore();
        xx.strokeStyle="rgba(250,248,240,0.9)";xx.lineWidth=2.5;for(let k=0;k<=8;k++){const yy=ly-80+k*20;xx.beginPath();xx.moveTo(lx+112,yy);xx.lineTo(lx+(k%4?128:142),yy);xx.stroke();}}});
      const pm=ag_in(tt,wAt(sc,"lift","a fifth")-0.2,0.4);if(pm>0)ag_pill(x,lerp(1500,lx0,1)+300,ly0+40,"at most 0.2 mm",{a:pm});}},
    // Pfungst's laboratory: he taps; the one who thinks of the number lifts their head at it, without knowing; so does he
    {at:tC,place:"mjLab04",keys:[[tC,960,540,1]],push:0.025,draw:(x,tt)=>{const tp=mj_taps(tC+0.5,3,0.55),k=mj_count(tt,tp),hit=k.n>=3?ag_io(tt,tp[2]+MJ_STRIKE,tp[2]+1.6,0.15):0;
      let tap=0;for(const s0 of tp)if(tt>=s0&&tt<s0+0.5)tap=Math.sin((tt-s0)/0.5*Math.PI);
      ag_person(x,MJ_PERSON.pfungst,560,720,1.05,{t:tt,pose:{near:[34-26*tap,70,"rest"],far:[-6,84,"rest"]},gaze:[3,1],nod:-0.03*hit,cut:720});
      ag_person(x,MJ_PERSON.subject,1360,720,1.05,{t:tt,flip:true,pose:"desk",gaze:[3,0],nod:-0.06*hit,cut:720});
      mj_cloud(x,1300,380,"3",{s:1,a:ag_in(tt,tC+0.2,0.4),k:ag_spr(tt,tC+0.2,0.45)});
      mj_table04(x,720);
      mj_mirror(x,860,640,52,{draw:xx=>{xx.save();xx.translate(860,640);xx.scale(-1,1);xx.translate(-860,-640);ag_person(xx,MJ_PERSON.pfungst,870,742,0.36,{t:tt,flip:true,gaze:[3,0],nod:-0.08*hit,covered:true});xx.restore();}});
      const cd=mj_card(tt,tC+0.6,null);if(cd.a>0)ag_textCard(x,560,70,800,{kick:"Pfungst's laboratory, 1904",title:"23 of 25 people gave the same sign, without knowing"},{kickCol:AG.kick,k:cd.k,a:cd.a});}},
    // the name researchers still use; a hint in the question, and reasoning that doesn't mention it
    {at:tD,place:"lab",keys:[[tD,960,540,1]],push:0.02,draw:(x,tt)=>{const tH=wAt(sc,"hint","a hint like"),tB2=wAt(sc,"hint","pulled models"),tR=wAt(sc,"hint","their reasoning");
      mj_agent(x,{t:tt,badge:1,think:0.3+0.5*ag_in(tt,tH+0.6,0.6)});ag_roomLight(x,1);
      const nm=ag_in(tt,wAt(sc,"name","Hans's name")-0.1,0.4);if(nm>0)ag_pill(x,MJ_ROOM.agent.x,250,"Clever Hans",{a:nm,k:ag_spr(tt,wAt(sc,"name","Hans's name")-0.1,0.5)});
      const q=mj_card(tt,tH-0.3,null);if(q.a>0)ag_textCard(x,440,170,460,{kick:"A test",title:"I think it's B. What do you think?"},{kickCol:AG.kick,k:q.k,a:q.a});
      const an=mj_card(tt,tB2+0.2,null);if(an.a>0){x.save();x.translate(1350,330);x.rotate(-0.06*ag_sine(clamp((tt-tB2-0.5)/0.8,0,1)));x.translate(-1350,-330);ag_textCard(x,1350,180,260,{kick:"Answer",title:"B"},{kickCol:AG.violet,k:an.k,a:an.a});x.restore();}
      const rc=mj_card(tt,tR-0.2,null);if(rc.a>0)mj_reason(x,1350,370,500,["1. Read the question","2. Weigh each option","3. B fits best"],{p:clamp((tt-tR)/1.6,0,1),k:rc.k,a:rc.a});}},
    // so Jun asks without the answer in the question, looks at how it got there, and checks a count it didn't make
    {at:tE,place:"lab",keys:[[tE,960,540,1]],push:0.02,draw:(x,tt)=>{const tX=wAt(sc,"jun","without the answer"),tQ=wAt(sc,"jun","in the question"),tG=wAt(sc,"draft","the draft for"),tOk=wAt(sc,"draft","seven too");
      ag_person(x,"jun",296,596,1.0,{t:tt,gaze:[3,-1],smile:0.3});mj_agent(x,{t:tt,badge:1,think:0.25+0.6*ag_io(tt,tQ+0.6,c.how+0.4,0.4)});
      const reach=ag_sine(clamp((tt-tQ-0.6)/0.8,0,1))*(1-ag_sine(clamp((tt-c.how)/0.8,0,1)));mj_arm(x,916,440,reach,{from:"left"});ag_roomLight(x,1);
      const q1=mj_card(tt,c.jun+0.1,null);if(q1.a>0){const bb=mj_q(x,452,140,460,"It's 4,867, isn't it?",{k:q1.k,a:q1.a*(1-0.45*ag_in(tt,tX+0.6,0.5)),py:200});mj_strike(x,bb,clamp((tt-tX-0.1)/0.5,0,1));}
      const q2=mj_card(tt,tQ-0.2,null);if(q2.a>0)mj_q(x,452,330,460,"How many awards this year? Show the query.",{k:q2.k,a:q2.a,py:60});
      const ea=ag_in(tt,c.how-0.5,0.3);if(ea>0){ag_evidence(x,1336,120,540,{kick:"Agent",title:"4,867 awards"},[{kick:"Query",title:"Count awards the glossary's way",col:AG.blue},{kick:"Rows",title:"4,867 rows",col:AG.orange}],{ew:246,open:clamp((tt-c.how-0.2)/1.2,0,1),k:ag_spr(tt,c.how-0.5,0.5),a:ea});
        const ok=ag_in(tt,tOk,0.4);if(ok>0)ag_tick(x,1336+AG_PAD+ag_tw(x,"4,867 awards",{w:700,size:36})+38,206,30,rgba(AG.green,ok),5);}
      const gd=mj_card(tt,tG-0.2,null);if(gd.a>0){const gx=lerp(1960,1336,ag_eo(clamp((tt-tG+0.2)/0.8,0,1)));ag_textCard(x,gx,600,540,{kick:"Government draft",title:"4,867 awards"},{kickCol:AG.kick,edge:AG.green,edgeA:0.6*ag_in(tt,tOk,0.4),a:gd.a});
        const ok=ag_in(tt,tOk,0.4);if(ok>0)ag_tick(x,gx+540-48,646,30,rgba(AG.green,ok),5);}}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.7);mj_kick(ctx,S,ag_in(t,tD,0.6));});

/* ---------------------------------------------------------------- 7 · For what it is */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,H=MJ_AT.hans,O=MJ_AT.osten,tB1=c.junior-0.5,tB2=c.less-0.5,tC=c.week-0.5,tD=c.takeaway-0.5;
  const tMove=wAt(sc,"junior","isn't a junior")-0.2,mv=ag_sine(clamp((t-tMove)/1.6,0,1));
  const jun=(x,tt,o)=>ag_person(x,"jun",296,596,1.0,Object.assign({t:tt,gaze:[3,0],smile:0.35},o||{}));
  const shots=[
    // Hans was never a pupil: the board fades, and a horse stands in the courtyard, looking at the people
    {at:0,place:"mjNoon",keys:[[0,860,470,1.1],[c.pupil+0.6,780,480,1.22]],d:3.2,draw:(x,tt)=>{mj_cam("wide");
      MJ_VIS.forEach((v,i)=>mj_standAt(x,v[0],v[1],MJ_VISITORS[i].woman?1.62:1.74,MJ_VISITORS[i],{t:tt+i,arms:i%2?"behind":"hang",flip:true,nod:0.03*Math.sin(tt*0.7+i)}));
      mj_board(x,MJ_AT.board[0],MJ_AT.board[1],{a:1-ag_in(tt,c.pupil+0.8,1.6)});mj_hansAt(x,H[0],H[1],{t:tt,head:0.05*ag_in(tt,c.pupil+1.6,1.4)});
      mj_standAt(x,O[0],O[1],1.72,MJ_FIG.osten,{t:tt,arms:"hold",flip:true});}},
    // the agent isn't a junior: the badge goes from its stand to the paper junior
    {at:tB1,place:"lab",keys:[[tB1,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt,{gaze:[3,0]});
      mj_agent(x,{t:tt,badge:tt<tMove?1:0,think:0.3});const nk=mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:mv>=1?1:0,cards:1});
      if(mv>0&&mv<1){const h0=mj_hook(),hx=lerp(h0[0],nk.x,mv),hy=lerp(h0[1],nk.y,mv)-150*Math.sin(mv*Math.PI);ag_badge(x,hx,hy,"Junior",{t:tt,drop:86});}
      ag_roomLight(x,1);}},
    // more, and less: the card full; its caution in its rights, its memory in the team's notes, every yes with a person
    {at:tB2,place:"lab",keys:[[tB2,960,540,1]],push:0,draw:(x,tt)=>{jun(x,tt);mj_agent(x,{t:tt,think:0.3,textA:1-ag_in(tt,tB2,0.4)});mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,a:1-ag_in(tt,tB2+0.2,0.8)});ag_roomLight(x,1);
      setScreen(x,S);mj_veil(x,ag_in(tt,tB2,0.5));const mk=[ag_io(tt,wAt(sc,"less","no memory")-0.1,c.lives-0.3,0.3),0,0];
      mj_two(x,MJ_TWO_AT[0],MJ_TWO_AT[1],{fill:[2,2,2,2,2],lit:[1,1],mark:[0,0,mk[0],ag_io(tt,wAt(sc,"less","no career")-0.1,c.lives-0.3,0.3),ag_io(tt,wAt(sc,"less","nothing to lose")-0.1,c.lives-0.3,0.3)],more:1,less:1,k:ag_spr(tt,tB2,0.5),a:ag_in(tt,tB2,0.3)});
      const r1=mj_card(tt,wAt(sc,"lives","its rights")-0.2,null),r2=mj_card(tt,wAt(sc,"lives","the team's notes")-0.2,null),r3=mj_card(tt,wAt(sc,"lives","with a person")-0.2,null);
      const Y0=612,note=(px,py,w,h,rot)=>{x.save();x.translate(px,py);x.rotate(rot);x.fillStyle="#F6F3EA";x.shadowColor="rgba(46,38,28,0.24)";x.shadowBlur=22;x.shadowOffsetY=10;x.fillRect(-w/2,0,w,h);x.restore();};
      if(r1.a>0)withA(x,r1.a,()=>{ag_glass(x,540,Y0,200,150,{label:null});ag_lock(x,640,Y0+84,58,rgba(AG.blue,1));ag_pill(x,640,830,"Rights",{col:AG.blue});});
      if(r2.a>0)withA(x,r2.a,()=>{note(960,Y0+6,220,150,-0.03);
        x.save();x.translate(960,Y0+6);x.rotate(-0.03);x.fillStyle="rgba(86,92,100,0.24)";for(let k=0;k<4;k++)x.fillRect(-80,40+k*26,k===3?90:160,8);x.restore();mj_pin(x,960,Y0+18);ag_pill(x,960,830,"Team notes",{});});
      // a slip of paper with its two stamps, so nothing behind shows through them
      if(r3.a>0)withA(x,r3.a,()=>{note(1280,Y0-8,270,172,0.015);mj_stamp(x,1280,Y0+40,"Reviewed",AG.green,{rot:-0.06});mj_stamp(x,1280,Y0+108,"Approved",AG.green,{rot:0.04});ag_pill(x,1280,830,"A person says yes",{col:AG.green});});}},
    // this week: a path in a minute, a count checked twice, a yearly table kept, a lesson for every session
    {at:tC,place:"lab",keys:[[tC,960,540,1]],push:0.015,draw:(x,tt)=>{jun(x,tt);ag_roomLight(x,1);mj_veil(x,1);
      const ws=["a path in a minute","a count checked twice","a yearly table kept","a lesson for every session"].map(w=>wAt(sc,"week",w)-0.15);
      const pics=[
        (xx,X,Y,w,h)=>{const ox=X+(w-308)/2,oy=Y+(h-162)/2;for(let i=0;i<20;i++)ag_box(xx,ox+(i%5)*64,oy+Math.floor(i/5)*44,52,30,8,{edge:AG.blue,edgeA:0.5,lw:1.5});
          xx.strokeStyle=rgba(AG.orange,0.85);xx.lineWidth=4;xx.lineCap="round";xx.lineJoin="round";xx.beginPath();[[0,0],[1,1],[3,1],[2,2],[4,3]].forEach(([i,j],k)=>{const px=ox+26+i*64,py=oy+15+j*44;k?xx.lineTo(px,py):xx.moveTo(px,py);});xx.stroke();},
        (xx,X,Y,w,h)=>{ag_T(xx,"4,867",X+w/2-50,Y+h/2+24,{w:800,size:64,align:"center"});ag_tick(xx,X+w/2+78,Y+h/2-6,34,rgba(AG.green,1),5);ag_tick(xx,X+w/2+118,Y+h/2-6,34,rgba(AG.green,1),5);},
        // the yearly table, kept: its card edged green, and chapter 5's small calendar in its corner, one day ringed
        (xx,X,Y,w,h)=>{const bw=380,bh=150,bx=X+(w-bw)/2,by=Y+(h-bh)/2,s=1.2,gx=bx+bw-130,gy=by+22;ag_box(xx,bx,by,bw,bh,16,{edge:AG.green,edgeA:0.6,lw:2});
          xx.fillStyle=rgba(AG.blue,0.3);xx.fillRect(bx+26,by+30,150,10);xx.fillRect(bx+26,by+54,96,10);xx.fillRect(bx+26,by+96,200,8);xx.fillRect(bx+26,by+116,140,8);
          mj_cal(xx,gx,gy,s,{});},
        (xx,X,Y,w,h)=>{xx.save();xx.translate(X+w/2,Y+16);xx.rotate(-0.02);xx.fillStyle="#F6F3EA";xx.shadowColor="rgba(46,38,28,0.2)";xx.shadowBlur=16;xx.shadowOffsetY=8;xx.fillRect(-150,0,300,h-34);xx.restore();
          xx.fillStyle="rgba(86,92,100,0.24)";for(let k=0;k<4;k++)xx.fillRect(X+w/2-110,Y+62+k*30,k===3?110:220,8);mj_pin(xx,X+w/2,Y+30);}];
      // two by two, to Jun's right, so no card cuts across a person
      const G=[[540,130],[1216,130],[540,514],[1216,514]];
      ["A path in a minute","A count checked twice","A yearly table kept","A lesson for every session"].forEach((cap,i)=>{const cd=mj_card(tt,ws[i],null);if(cd.a>0)mj_win(x,G[i][0],G[i][1],640,348,cap,{draw:pics[i],k:cd.k,a:cd.a,size:36});});}},
    // supervise it for what it is, not for what it looks like
    {at:tD,place:"lab",keys:[[tD,960,540,1]],push:0.02,draw:(x,tt)=>{const out=1-ag_in(tt,c.breath,0.8);jun(x,tt);mj_agent(x,{t:tt,think:0.3,textA:1-ag_in(tt,c.breath,0.6),a:out});mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1});ag_roomLight(x,1);
      // the card gives its words to the end card, and the agent its place to the end card's mark
      const cd=mj_card(tt,c.takeaway-0.2,null);if(cd.a>0)mj_say(x,960,120,["Supervise it for what it is,","not for what it looks like."],{k:cd.k,a:cd.a*out});}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.7);mj_kick(ctx,S,ag_in(t,tB1,0.6));
  ag_end(ctx,S,t,c.breath,"More than a junior","Supervise it for what it is, not for what it looks like.","Film 4 of 9");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["more", "memory"]);

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
