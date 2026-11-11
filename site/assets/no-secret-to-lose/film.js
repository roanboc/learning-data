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

// No secret to lose, the film after Who is it, really? in Locks before the data, the first series of Data protection and privacy. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years and numbers in words). The few longer stops are in breath.js.
const NARR={
"city":{"name":"Bearer paper","lead":1.6,"tail":0.6,"vo":[
 {"id":"london","gap":0.8,"text":"London, 2 May 1990.","say":"London, the second of May, nineteen ninety."},
 {"id":"paper","gap":0.8,"text":"In the City, the money markets still run on paper."},
 {"id":"promise","gap":0.8,"text":"Treasury bills and certificates of deposit are promises to pay a set sum on a set day: the government's, and the banks'."},
 {"id":"walks","gap":0.8,"text":"When a bank sells one to another, a messenger walks it across the City, and comes back with the payment."},
 {"id":"bearer","gap":0.8,"text":"Much of that paper is made out to the bearer: whoever holds it can cash it."},
 {"id":"morning","gap":0.8,"text":"That morning, in a quiet street near the Bank of England, a man with a knife takes one messenger's case."},
 {"id":"inside","gap":0.8,"text":"Inside are 301 bills and certificates, worth 292 million pounds.","say":"Inside are three hundred and one bills and certificates, worth two hundred and ninety-two million pounds."},
 {"id":"cash","gap":0.8,"text":"To whoever holds them now, they're as good as cash."},
 {"id":"gone","gap":0.8,"text":"If they're cashed before word of the theft gets round, the money is gone."},
 {"id":"every","gap":0.8,"text":"And every messenger in the City carries that risk, every day."},
 {"id":"change","gap":0.8,"text":"The paper itself has to stop being worth stealing."}]},
"bank":{"name":"Kept in the Bank's records","lead":0.8,"tail":1.0,"vo":[
 {"id":"since","gap":0.8,"text":"The Bank of England has been building an answer since 1988.","say":"The Bank of England has been building an answer since nineteen eighty-eight."},
 {"id":"opens","gap":0.8,"text":"On 1 October 1990, it opens the Central Moneymarkets Office.","say":"On the first of October, nineteen ninety, it opens the Central Money Markets Office."},
 {"id":"vault","gap":0.8,"text":"The paper goes into a vault at the Bank, and stays there."},
 {"id":"records","gap":0.8,"text":"Who owns each one is kept in the Bank's records."},
 {"id":"sale","gap":0.8,"text":"A sale changes the record, once both sides have approved it."},
 {"id":"first","gap":0.8,"text":"Forty-four banks and firms are in it from the first day."},
 {"id":"why","gap":0.8,"text":"The Bank says why: to avoid the risk and the cost of moving paper around the City, as the theft in May had shown."},
 {"id":"streets","gap":0.8,"text":"Paper kept at the Bank stays off the streets, and no messenger carries it."},
 {"id":"too","gap":0.8,"text":"A password, a token or a key is bearer paper too: to whatever it opens, whoever holds it is you."},
 {"id":"job","gap":0.8,"text":"At the university, a nightly job still carries one."},
 {"id":"nobody","gap":0.8,"text":"Like the Bank's records, the platform can know who the job is, so that nobody has to carry a secret at all."}]},
"token":{"name":"Jun's token","lead":0.8,"tail":0.6,"vo":[
 {"id":"two","gap":0.8,"text":"Every night at two, a job loads the registrar's records onto the university's data platform."},
 {"id":"own","gap":0.8,"text":"Sam Okafor, who runs the platform, has given it an identity of its own: registrar-loader.","say":"Sam Okafor, who runs the platform, has given it an identity of its own: registrar loader."},
 {"id":"still","gap":0.8,"text":"But it still signs in the old way, with Jun Park's personal token."},
 {"id":"made","gap":0.8,"text":"Jun made it on 14 March 2024, to get the job running, and it has no end date.","say":"Jun made it on the fourteenth of March, twenty twenty-four, to get the job running, and it has no end date."},
 {"id":"whoever","gap":0.8,"text":"To the platform, whoever holds that token is Jun."},
 {"id":"reads","gap":0.8,"text":"They can read what Jun can read, from anywhere, at any hour, for as long as nobody notices."},
 {"id":"place","gap":0.8,"text":"And it isn't in one place."},
 {"id":"finds","gap":0.8,"text":"Sam finds it in the job's settings, in an old notebook, and in a file on Jun's laptop."},
 {"id":"copy","gap":0.8,"text":"Every copy works as well as the first, and nobody can say how many there are."},
 {"id":"moves","gap":0.8,"text":"When Jun moves to another team, the job will stop, or go on with whatever Jun may do there."},
 {"id":"wrong","gap":0.8,"text":"Nobody did anything wrong: it was the quickest way to start, and it has worked for more than two and a half years."},
 {"id":"streets","gap":0.8,"text":"But every night, the job carries bearer paper through the streets."}]},
"ladder":{"name":"Who holds a secret?","lead":0.8,"tail":0.6,"vo":[
 {"id":"prove","gap":0.8,"text":"To sign in, the job has to prove it's the job."},
 {"id":"ways","gap":0.8,"text":"Sam lays out the ways it can, from worst to best, with one question: who holds a secret, and for how long?"},
 {"id":"person","gap":0.8,"text":"At the bottom, a person's token, or a shared account's password."},
 {"id":"someone","gap":0.8,"text":"The job runs as someone else, with everything they may do."},
 {"id":"own","gap":0.8,"text":"One up, a token of the job's own."},
 {"id":"rights","gap":0.8,"text":"Only its own rights now, but still bearer paper, often with no end date."},
 {"id":"vault","gap":0.8,"text":"Then a secret in a vault, which the job reads as it starts, and a machine changes every month."},
 {"id":"types","gap":0.8,"text":"Nobody types it, but while it's valid, a copy still works."},
 {"id":"cert","gap":0.8,"text":"Then a certificate: a key the job keeps, and never sends."},
 {"id":"signing","gap":0.8,"text":"It proves who it is by signing, so the key itself never crosses the wire."},
 {"id":"renewed","gap":0.8,"text":"But the key is still kept somewhere, and must be renewed before it ends."},
 {"id":"note","gap":0.8,"text":"Near the top, a note from where the job runs."},
 {"id":"signs","gap":0.8,"text":"That place signs a short note, this job, from here, now, and the platform, which trusts the signer, lets it in for that run."},
 {"id":"top","gap":0.8,"text":"At the top, an identity the platform gives the job."},
 {"id":"knows","gap":0.8,"text":"The job runs on the platform's own machines, so the platform knows which job it is, and vouches for it."},
 {"id":"passes","gap":0.8,"text":"On these two rungs there are still passes, but the platform makes a new one for each run, nobody sees it, and it ends within the hour."},
 {"id":"goal","gap":0.8,"text":"That's the goal: nobody makes, keeps, copies or changes a secret."}]},
"climb":{"name":"Up the ladder","lead":0.8,"tail":0.6,"vo":[
 {"id":"up","gap":0.8,"text":"Sam moves the nightly job up."},
 {"id":"vouches","gap":0.8,"text":"On the platform, it now runs as registrar-loader, and the platform vouches for it.","say":"On the platform, it now runs as registrar loader, and the platform vouches for it."},
 {"id":"role","gap":0.8,"text":"Its rights are the loader role's, decided when it got its name, before it ever signed in."},
 {"id":"build","gap":0.8,"text":"Its code reaches the platform from the build service, which signs a note for each run, so no secret is stored there either."},
 {"id":"ends","gap":0.8,"text":"Then Jun ends his token."},
 {"id":"worthless","gap":0.8,"text":"The copies in the settings, the notebook and the laptop are worthless paper now."},
 {"id":"thief","gap":0.8,"text":"Sam asks what a thief would find tonight."},
 {"id":"before","gap":0.8,"text":"Before: Jun's token, everything Jun can read, from anywhere, with no end date."},
 {"id":"now","gap":0.8,"text":"Now: a pass with one job's rights, that nobody stored, and that ends within the hour."},
 {"id":"never","gap":0.8,"text":"And when Jun moves team, nothing breaks: the job was never his."},
 {"id":"cant","gap":0.8,"text":"Where a system can't climb yet, such as one that only takes a password, the password goes in a vault."},
 {"id":"owner","gap":0.8,"text":"A machine changes it, and the exception is written down, with its owner."},
 {"id":"starts","gap":0.8,"text":"Every new job starts at the top."}]},
"people":{"name":"A ladder for people","lead":0.8,"tail":0.6,"vo":[
 {"id":"too","gap":0.8,"text":"People sign in too, and their ladder is much the same."},
 {"id":"shared","gap":0.8,"text":"At the bottom, a shared account: nobody can tell who did what, and nobody can leave without changing it for everyone."},
 {"id":"password","gap":0.8,"text":"A password alone can be guessed, used again on other sites, or typed into a fake page."},
 {"id":"text","gap":0.8,"text":"A code by text message is better, but a phone number can be moved to a thief's phone, and the code typed into a fake page too."},
 {"id":"app","gap":0.8,"text":"An app on your own phone is harder to steal, but a convincing fake page can still pass on your code, or get your yes."},
 {"id":"passkey","gap":0.8,"text":"At the top, a passkey, or a security key you plug in."},
 {"id":"stays","gap":0.8,"text":"It's a key that stays on your device."},
 {"id":"unlock","gap":0.8,"text":"You unlock it with your face, your fingerprint or a PIN, and those never leave it either."},
 {"id":"real","gap":0.8,"text":"It answers only the real site, so a fake page gets nothing."},
 {"id":"half","gap":0.8,"text":"And the platform keeps only the matching half, which opens nothing on its own."},
 {"id":"type","gap":0.8,"text":"Nothing to remember, and nothing to type."},
 {"id":"once","gap":0.8,"text":"At the university, everyone signs in once, with a passkey: Sam, Jun, and Mei Tanaka, who owns the registrar's data."},
 {"id":"agents","gap":0.8,"text":"Agents climb the job's ladder too: each signs in as itself, never on a person's token."}]},
"close":{"name":"Nothing to carry","lead":0.8,"tail":1.0,"vo":[
 {"id":"city","gap":0.8,"text":"In 1990, the City's paper stopped travelling, because the Bank kept the record of who owned what.","say":"In nineteen ninety, the City's paper stopped travelling, because the Bank kept the record of who owned what."},
 {"id":"job","gap":0.8,"text":"The nightly job stopped carrying a secret, because the platform knows who it is."},
 {"id":"nothing","gap":0.8,"text":"There's nothing to leak, nothing to change on a schedule, and nothing that breaks when someone moves on."},
 {"id":"best","gap":0.8,"text":"The best secret is the one nobody holds."}]}
};

const VODUR={"city/london": 2.51, "city/paper": 2.692, "city/promise": 7.126, "city/walks": 5.768, "city/bearer": 4.059, "city/morning": 5.771, "city/inside": 5.955, "city/cash": 2.713, "city/gone": 3.889, "city/every": 3.311, "city/change": 2.813, "bank/since": 4.174, "bank/opens": 5.066, "bank/vault": 3.052, "bank/records": 2.605, "bank/sale": 3.387, "bank/first": 2.883, "bank/why": 6.814, "bank/streets": 3.939, "bank/too": 6.164, "bank/job": 3.164, "bank/nobody": 6.143, "token/two": 5.98, "token/own": 6.022, "token/still": 3.829, "token/made": 6.322, "token/whoever": 2.916, "token/reads": 5.52, "token/place": 1.532, "token/finds": 5.479, "token/copy": 4.222, "token/moves": 5.499, "token/wrong": 6.215, "token/streets": 3.434, "ladder/prove": 2.837, "ladder/ways": 6.407, "ladder/person": 3.695, "ladder/someone": 3.201, "ladder/own": 2.031, "ladder/rights": 4.27, "ladder/vault": 5.755, "ladder/types": 3.41, "ladder/cert": 3.152, "ladder/signing": 4.215, "ladder/renewed": 3.785, "ladder/note": 2.53, "ladder/signs": 6.901, "ladder/top": 2.955, "ladder/knows": 6.331, "ladder/passes": 7.709, "ladder/goal": 3.949, "climb/up": 1.713, "climb/vouches": 5.091, "climb/role": 4.934, "climb/build": 6.971, "climb/ends": 1.548, "climb/worthless": 4.261, "climb/thief": 2.133, "climb/before": 4.952, "climb/now": 5.108, "climb/never": 3.899, "climb/cant": 5.755, "climb/owner": 4.001, "climb/starts": 1.737, "people/too": 3.015, "people/shared": 6.998, "people/password": 5.134, "people/text": 7.419, "people/app": 6.969, "people/passkey": 3.141, "people/stays": 1.826, "people/unlock": 5.161, "people/real": 3.536, "people/half": 4.233, "people/type": 2.261, "people/once": 7.882, "people/agents": 5.647, "close/city": 5.97, "close/job": 4.487, "close/nothing": 5.43, "close/best": 2.408};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card after the opening story; and the end card. */
const BREATH={
"city":{"hold":{"london":0.6,"paper":0.6,"promise":0.8,"walks":0.8,"bearer":1.0,"morning":1.2,"inside":1.0,"cash":0.6,"gone":0.6,"every":1.0}},
"bank":{"hold":{"since":0.4,"opens":0.8,"vault":1.0,"records":0.8,"sale":1.2,"first":0.8,"why":1.0,"streets":1.0,"too":1.0,"job":0.6,"nobody":0.4},"breathe":4.4},
"token":{"hold":{"two":1.0,"own":1.0,"still":0.8,"made":1.2,"whoever":1.0,"reads":1.4,"place":0.4,"finds":1.6,"copy":1.4,"moves":1.4,"wrong":1.4,"streets":1.0}},
"ladder":{"hold":{"prove":0.8,"ways":1.4,"person":1.2,"someone":1.4,"own":1.2,"rights":1.4,"vault":1.2,"types":1.4,"cert":1.2,"signing":1.4,"renewed":1.4,"note":1.2,"signs":1.6,"top":1.2,"knows":1.4,"passes":1.6},"breathe":2.0},
"climb":{"hold":{"up":0.8,"vouches":1.2,"role":1.0,"build":1.4,"ends":1.0,"worthless":1.4,"thief":0.8,"before":1.4,"now":1.4,"never":1.2,"cant":1.0,"owner":1.2}},
"people":{"hold":{"too":1.0,"shared":1.4,"password":1.4,"text":1.4,"app":1.4,"passkey":1.2,"stays":1.0,"unlock":1.2,"real":1.4,"half":1.2,"type":1.0,"once":1.4},"breathe":2.0},
"close":{"hold":{"city":1.0,"job":1.0,"nothing":1.2},"breathe":5.0}
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

/* ===== No secret to lose: the City of London, 1990 =====
   The opening's places, painted once each, in the module's night glass light: a petrol sky going pale at the horizon, stone cool,
   windows and doorways warm. Plain shapes and soft gradients, as the module's look paints the past; no texture that would crawl
   under a slow camera. Everything here is the film's own (prefix ns_); the hall, the people, the cards and the words are the kit's. */

/* ---------------------------------------------------------------- a street in perspective */
// A street seen from the middle of the road: x = vx + f*X/Z, y = vy + f*(eye - up)/Z, metres in, pixels out.
function ns_cam(vx,vy,f,eye){return{vx,vy,f,eye,p:(X,up,Z)=>[vx+f*X/Z,vy+f*(eye-up)/Z]};}
// a quad on a facade (the plane X), from depth z0 to z1 and height u0 to u1
function ns_wallQuad(c,K,X,z0,z1,u0,u1){const a=K.p(X,u0,z0),b=K.p(X,u0,z1),d=K.p(X,u1,z1),e=K.p(X,u1,z0);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();}
// a quad facing us (the plane Z), from x0 to x1 and height u0 to u1
function ns_frontQuad(c,K,Z,x0,x1,u0,u1){const a=K.p(x0,u0,Z),b=K.p(x1,u1,Z);c.beginPath();c.rect(a[0],b[1],b[0]-a[0],a[1]-b[1]);}
const NS_SKY=[[0,[5,13,19]],[0.55,[16,36,45]],[0.86,[38,66,74]],[1,[70,92,94]]];
function ns_sky(c,w,y1,o){o=o||{};const g=c.createLinearGradient(0,0,0,y1);for(const [s,col] of (o.stops||NS_SKY))g.addColorStop(s,`rgb(${col})`);c.fillStyle=g;c.fillRect(0,0,w,y1);
  // the first light, low behind the buildings: warm, faint
  if(o.dawn){const [x,y,r]=o.dawn,d=c.createRadialGradient(x,y,10,x,y,r);d.addColorStop(0,"rgba(255,200,150,0.30)");d.addColorStop(0.45,"rgba(240,170,130,0.10)");d.addColorStop(1,"rgba(240,170,130,0)");c.fillStyle=d;c.fillRect(0,0,w,y1);}}
const NS_STONE={lit:[44,70,78],mid:[30,52,60],dark:[17,32,38],deep:[10,21,26],edge:"rgba(190,225,232,0.34)",edgeSoft:"rgba(170,210,220,0.18)",glass:[9,19,23]};
const NS_WARM={glow:"rgba(255,196,120,0.9)",win:[255,206,140],door:[255,214,150]};
// a window on a facade, dark or lit, with its stone surround and a sill
function ns_sideWindow(c,K,X,z0,z1,u0,u1,lit,R){ns_wallQuad(c,K,X,z0-0.12,z1+0.12,u0-0.22,u1+0.18);c.fillStyle=`rgb(${NS_STONE.lit})`;c.globalAlpha=0.35;c.fill();c.globalAlpha=1;
  ns_wallQuad(c,K,X,z0,z1,u0,u1);if(lit){c.save();c.shadowColor=NS_WARM.glow;c.shadowBlur=10;c.fillStyle=`rgba(${NS_WARM.win},${0.55+0.35*R()})`;c.fill();c.restore();}
  else{c.fillStyle=`rgb(${NS_STONE.glass})`;c.fill();}
  // the glazing bar down the middle
  const m=(z0+z1)/2,a=K.p(X,u0,m),b=K.p(X,u1,m);c.strokeStyle=lit?"rgba(120,80,40,0.55)":"rgba(150,190,200,0.16)";c.lineWidth=1.2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
// one building on one side of the street: X its facade's plane, from depth z0 to z1, H tall, its style from s
function ns_building(c,K,X,z0,z1,H,s,R){const side=X<0?-1:1,base=s.base||5.2,top=H;
  // the facade, lit from the sky: the right side a little brighter (the light comes down the street from beyond the Bank)
  ns_wallQuad(c,K,X,z0,z1,0,top);const a=K.p(X,0,z0),b=K.p(X,0,z1),g=c.createLinearGradient(a[0],0,b[0],0),L=side>0?NS_STONE.lit:NS_STONE.mid,D=side>0?NS_STONE.mid:NS_STONE.dark;
  g.addColorStop(0,`rgb(${D})`);g.addColorStop(1,`rgb(${L})`);c.fillStyle=g;c.fill();
  // the ground floor's rusticated stone: its joints
  c.strokeStyle="rgba(150,190,200,0.10)";c.lineWidth=1;for(let u=0.9;u<base;u+=0.9){const p0=K.p(X,u,z0),p1=K.p(X,u,z1);c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  // a string course over the ground floor and a cornice at the top, each catching the light on its upper edge
  for(const [u,d] of [[base,0.35],[top-0.6,0.6]]){ns_wallQuad(c,K,X,z0,z1,u,u+d);c.fillStyle=`rgb(${NS_STONE.deep})`;c.fill();
    const p0=K.p(X,u+d,z0),p1=K.p(X,u+d,z1);c.strokeStyle=NS_STONE.edge;c.lineWidth=1.4;c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  // the floors above: tall windows, some lit
  const bays=Math.max(1,Math.round((z1-z0)/(s.bay||3.2))),fh=s.floor||3.6;
  for(let u=base+1.0;u+fh*0.62<top-1.2;u+=fh)for(let i=0;i<bays;i++){const zz0=z0+(i+0.28)*(z1-z0)/bays,zz1=z0+(i+0.72)*(z1-z0)/bays;ns_sideWindow(c,K,X,zz0,zz1,u,u+fh*0.62,R()<(s.lit||0.22),R);}
  // the ground floor: a doorway with its warm light, or tall dark windows
  for(let i=0;i<bays;i++){const zz0=z0+(i+0.25)*(z1-z0)/bays,zz1=z0+(i+0.75)*(z1-z0)/bays;
    if(s.door===i){const zm=(zz0+zz1)/2,dz=Math.min(0.9,(zz1-zz0)/2),dh=3.4;
      // the stone surround, then the opening with a round head, lit from inside, and one leaf of the door swung in
      ns_wallQuad(c,K,X,zm-dz-0.35,zm+dz+0.35,0,dh+0.9);c.fillStyle=`rgb(${NS_STONE.deep})`;c.fill();
      const A=K.p(X,0,zm-dz),B=K.p(X,0,zm+dz),T=K.p(X,dh-0.6,zm-dz),U=K.p(X,dh-0.6,zm+dz),M=K.p(X,dh+0.3,zm);
      c.save();c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(T[0],T[1]);c.quadraticCurveTo(M[0],M[1]-(T[1]-M[1])*0.15,U[0],U[1]);c.lineTo(B[0],B[1]);c.closePath();
      const q=K.p(X,1.4,zm),r=Math.abs(A[0]-B[0])*1.6+Math.abs(A[1]-T[1])*0.5,gg=c.createRadialGradient(q[0],q[1],2,q[0],q[1],r);gg.addColorStop(0,`rgb(${NS_WARM.door})`);gg.addColorStop(0.45,"rgb(196,132,72)");gg.addColorStop(1,"rgb(72,44,28)");
      c.fillStyle=gg;c.shadowColor=NS_WARM.glow;c.shadowBlur=14;c.fill();c.clip();
      const D0=K.p(X,0,zm-dz),D1=K.p(X,0,zm-dz+dz*0.7),D2=K.p(X,dh-0.8,zm-dz+dz*0.7),D3=K.p(X,dh-0.8,zm-dz);c.fillStyle="rgb(48,30,20)";c.beginPath();c.moveTo(D0[0],D0[1]);c.lineTo(D1[0]+(side>0?-1:1)*Math.abs(D1[0]-D0[0])*0.5,D1[1]);c.lineTo(D2[0]+(side>0?-1:1)*Math.abs(D1[0]-D0[0])*0.5,D2[1]);c.lineTo(D3[0],D3[1]);c.closePath();c.fill();c.restore();
      // a step, catching the light
      ns_wallQuad(c,K,X,zm-dz-0.2,zm+dz+0.2,0,0.25);c.fillStyle="rgba(255,214,150,0.25)";c.fill();
      // the light thrown on the pavement
      const P=K.p(X-side*1.6,0,zm),pr=Math.abs(A[0]-B[0])*1.3+18;c.save();c.translate(P[0],P[1]);c.scale(1.6,0.45);const pg=c.createRadialGradient(0,0,0,0,0,pr);pg.addColorStop(0,"rgba(255,206,140,0.20)");pg.addColorStop(1,"rgba(255,206,140,0)");c.fillStyle=pg;c.fillRect(-pr,-pr,pr*2,pr*2);c.restore();}
    else{ns_wallQuad(c,K,X,zz0,zz1,0.8,base-1.0);c.fillStyle=`rgb(${NS_STONE.glass})`;c.fill();}}
  // the facade's near edge, lit
  const e0=K.p(X,0,z0),e1=K.p(X,top,z0);c.strokeStyle=NS_STONE.edgeSoft;c.lineWidth=1.4;c.beginPath();c.moveTo(e0[0],e0[1]);c.lineTo(e1[0],e1[1]);c.stroke();
  // the roof's edge against the sky
  const r0=K.p(X,top,z0),r1=K.p(X,top,z1);c.strokeStyle=NS_STONE.edge;c.lineWidth=1.6;c.beginPath();c.moveTo(r0[0],r0[1]);c.lineTo(r1[0],r1[1]);c.stroke();}
// the Bank of England's outer wall, face on at depth Z: rusticated, windowless, with columns in pairs and a cornice; its upper storeys set back
function ns_bankWall(c,K,Z,x0,x1,o){o=o||{};const H=o.h||10.5,R=ns_rnd(o.seed||7);
  // the upper storeys behind, set back: a long block with rows of windows, a few lit
  const Zb=Z+(o.back||7),Hb=o.hb||22,X0=x0*1.2,X1=x1*1.2;ns_frontQuad(c,K,Zb,X0,X1,0,Hb);const ug=c.createLinearGradient(0,K.p(0,Hb,Zb)[1],0,K.p(0,H,Zb)[1]);ug.addColorStop(0,"rgb(40,64,70)");ug.addColorStop(1,`rgb(${NS_STONE.mid})`);c.fillStyle=ug;c.fill();
  // its bays: tall windows in pairs between stone piers, two floors and an attic, a few lit
  for(let x=X0+1.0;x<X1-3;x+=4.6){const pa=K.p(x-0.5,H,Zb),pb=K.p(x-0.1,Hb-1.6,Zb);c.fillStyle="rgba(70,96,100,0.55)";c.fillRect(pa[0],pb[1],pb[0]-pa[0],pa[1]-pb[1]);
    const rows=[];for(let u=H+1.5;u+2.6<=Hb-1.4;u+=3.5)rows.push([u,2.6]);for(const [u,hh] of rows)for(const dx of [0.9,2.6]){ns_frontQuad(c,K,Zb,x+dx,x+dx+1.15,u,u+hh);const lit=R()<0.2;
      if(lit){c.save();c.shadowColor=NS_WARM.glow;c.shadowBlur=8;c.fillStyle=`rgba(${NS_WARM.win},0.82)`;c.fill();c.restore();}else{c.fillStyle=`rgb(${NS_STONE.glass})`;c.fill();}}}
  ns_frontQuad(c,K,Zb,X0,X1,Hb-1.0,Hb);c.fillStyle="rgb(22,40,46)";c.fill();
  const t0=K.p(X0,Hb,Zb),t1=K.p(X1,Hb,Zb);c.strokeStyle=NS_STONE.edge;c.lineWidth=1.6;c.beginPath();c.moveTo(t0[0],t0[1]);c.lineTo(t1[0],t1[1]);c.stroke();
  // the wall: warm-grey stone, a little lighter than the streets', in the first light
  ns_frontQuad(c,K,Z,x0,x1,0,H);const a=K.p(x0,0,Z),b=K.p(x1,H,Z),g=c.createLinearGradient(0,b[1],0,a[1]);g.addColorStop(0,"rgb(58,80,84)");g.addColorStop(1,"rgb(34,54,60)");c.fillStyle=g;c.fill();
  // its rustication: long courses
  c.strokeStyle="rgba(150,190,200,0.14)";c.lineWidth=1;for(let u=0.7;u<H-2.2;u+=0.7){const p0=K.p(x0,u,Z),p1=K.p(x1,u,Z);c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  // columns in pairs, each on its plinth, with a blind niche between the pairs
  const step=o.step||7.2;for(let x=x0+step/2;x<x1;x+=step){
    for(const dx of [-0.9,0.9]){const cx=x+dx,p=K.p(cx-0.42,1.1,Z),q=K.p(cx+0.42,H-1.9,Z),w=q[0]-p[0];
      const cg=c.createLinearGradient(p[0],0,q[0],0);cg.addColorStop(0,"rgb(40,62,68)");cg.addColorStop(0.45,"rgb(96,122,124)");cg.addColorStop(1,"rgb(36,56,62)");c.fillStyle=cg;c.fillRect(p[0],q[1],w,p[1]-q[1]);
      // its flutes, faint
      c.strokeStyle="rgba(10,22,26,0.35)";c.lineWidth=1;for(let k=1;k<5;k++){c.beginPath();c.moveTo(p[0]+w*k/5,q[1]+4);c.lineTo(p[0]+w*k/5,p[1]-4);c.stroke();}
      // the capital and the base
      const cp=K.p(cx-0.6,H-1.9,Z),cq=K.p(cx+0.6,H-1.4,Z);c.fillStyle="rgb(110,134,134)";c.fillRect(cp[0],cq[1],cq[0]-cp[0],cp[1]-cq[1]);
      const bp=K.p(cx-0.6,0,Z),bq=K.p(cx+0.6,1.1,Z);c.fillStyle="rgb(46,68,72)";c.fillRect(bp[0],bq[1],bq[0]-bp[0],bp[1]-bq[1]);}
    if(x+step/2<x1){const nx=x+step/2,n0=K.p(nx-0.8,1.6,Z),n1=K.p(nx+0.8,H-3.6,Z),nw=n1[0]-n0[0];c.fillStyle="rgba(10,22,26,0.55)";c.beginPath();c.moveTo(n0[0],n0[1]);c.lineTo(n0[0],n1[1]+nw/2);c.arc(n0[0]+nw/2,n1[1]+nw/2,nw/2,Math.PI,0);c.lineTo(n1[0],n0[1]);c.closePath();c.fill();}}
  // the entablature, the cornice and the balustrade on top
  ns_frontQuad(c,K,Z,x0,x1,H-1.4,H-0.4);c.fillStyle="rgb(62,86,90)";c.fill();ns_frontQuad(c,K,Z,x0,x1,H-0.4,H);c.fillStyle="rgb(24,42,48)";c.fill();
  const k0=K.p(x0,H-0.4,Z),k1=K.p(x1,H-0.4,Z);c.strokeStyle="rgba(210,236,236,0.5)";c.lineWidth=1.6;c.beginPath();c.moveTo(k0[0],k0[1]);c.lineTo(k1[0],k1[1]);c.stroke();
  for(let x=x0+0.3;x<x1;x+=0.5){const p=K.p(x,H,Z),q=K.p(x+0.22,H+0.9,Z);c.fillStyle="rgb(46,68,72)";c.fillRect(p[0],q[1],Math.max(1,q[0]-p[0]),p[1]-q[1]);}
  const r0=K.p(x0,H+0.9,Z),r1=K.p(x1,H+1.1,Z);c.fillStyle="rgb(52,76,80)";c.fillRect(r0[0],r1[1],r1[0]-r0[0],Math.max(2,r0[1]-r1[1]));}
// a seeded random, the module's way (the prototype's DP.rnd), kept here so these places paint the same every time
function ns_rnd(s){let x=s>>>0||1;return()=>{x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return(x%100000)/100000;};}
// a City bollard and an old street lamp, on the pavement's edge
function ns_bollard(c,K,X,Z){const p=K.p(X,0,Z),q=K.p(X,1.0,Z),w=Math.max(3,(K.f*0.24)/Z);c.fillStyle="rgb(8,14,16)";rr(c,p[0]-w/2,q[1],w,p[1]-q[1],w/3);c.fill();
  c.fillStyle="rgba(190,225,232,0.35)";c.fillRect(p[0]-w/2+1,q[1]+(p[1]-q[1])*0.2,1.4,(p[1]-q[1])*0.6);c.fillStyle="rgb(8,14,16)";c.beginPath();c.ellipse(p[0],q[1],w*0.62,w*0.3,0,0,TAU);c.fill();}
function ns_lamp(c,K,X,Z,lit){const p=K.p(X,0,Z),q=K.p(X,4.0,Z),w=Math.max(2,(K.f*0.13)/Z),s=Math.max(4,K.f*0.42/Z),ink="rgb(8,14,16)";
  // the post, a little wider at its foot, and the lantern on top: a glazed box, narrower below, under a pointed cap
  c.fillStyle=ink;c.beginPath();c.moveTo(p[0]-w*0.9,p[1]);c.lineTo(p[0]-w*0.45,q[1]);c.lineTo(p[0]+w*0.45,q[1]);c.lineTo(p[0]+w*0.9,p[1]);c.closePath();c.fill();c.fillRect(p[0]-w*1.2,p[1]-s*0.5,w*2.4,s*0.5);
  const L=[p[0],q[1]-s*0.9];c.beginPath();c.moveTo(L[0]-s*0.36,L[1]+s*0.85);c.lineTo(L[0]-s*0.55,L[1]-s*0.5);c.lineTo(L[0]+s*0.55,L[1]-s*0.5);c.lineTo(L[0]+s*0.36,L[1]+s*0.85);c.closePath();
  if(lit){c.save();c.shadowColor=NS_WARM.glow;c.shadowBlur=s*1.4;c.fillStyle="rgb(255,226,170)";c.fill();c.restore();const g=c.createRadialGradient(L[0],L[1],2,L[0],L[1],s*8);g.addColorStop(0,"rgba(255,214,150,0.20)");g.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=g;c.fillRect(L[0]-s*8,L[1]-s*8,s*16,s*16);}
  else{c.fillStyle="rgb(20,34,38)";c.fill();}
  c.strokeStyle=ink;c.lineWidth=Math.max(1,s*0.07);c.beginPath();c.moveTo(L[0],L[1]-s*0.5);c.lineTo(L[0],L[1]+s*0.85);c.stroke();
  c.fillStyle=ink;c.beginPath();c.moveTo(L[0]-s*0.7,L[1]-s*0.5);c.lineTo(L[0],L[1]-s*1.05);c.lineTo(L[0]+s*0.7,L[1]-s*0.5);c.closePath();c.fill();c.fillRect(L[0]-s*0.08,L[1]-s*1.3,s*0.16,s*0.3);}

/* ---------------------------------------------------------------- the City street, with the Bank at its end */
// o.quiet: the quieter street of the theft, narrower, with no Bank at its end, fewer windows lit
const NS_STREET={vx:960,vy:560,f:820,eye:1.65,half:10};
function ns_paintStreet(c,w,h,o){o=o||{};const S=NS_STREET,K=ns_cam(S.vx,S.vy,S.f,S.eye),R=ns_rnd(o.quiet?53:29),half=o.quiet?7.5:S.half,zEnd=o.quiet?60:34;
  ns_sky(c,w,o.quiet?S.vy+60:330,{dawn:o.quiet?null:[S.vx,300,560]});if(!o.quiet){c.fillStyle="rgb(70,92,94)";c.fillRect(0,330,w,S.vy+60-330);}
  // a few stars still out at the top
  for(let i=0;i<70;i++){const x=R()*w,y=R()*300;c.fillStyle=`rgba(210,235,240,${0.08+R()*0.25})`;c.beginPath();c.arc(x,y,R()*1.1+0.3,0,TAU);c.fill();}
  // the far end: the Bank's wall across it, or, in the quiet street, a bend and more buildings
  if(!o.quiet){const g=K.p(0,0,44);c.fillStyle="rgb(20,36,42)";c.fillRect(0,g[1],w,h-g[1]);ns_bankWall(c,K,46,-32,32,{h:10.5,back:9,hb:21,seed:11});}
  else{for(let i=0;i<6;i++){const x0=-14+i*5.2,hb=14+R()*9;ns_frontQuad(c,K,zEnd+4,x0,x0+5,0,hb);c.fillStyle=`rgb(${i%2?NS_STONE.mid:NS_STONE.dark})`;c.fill();
      for(let u=4;u<hb-2;u+=3.4)for(let x=x0+0.8;x<x0+4.4;x+=1.9){ns_frontQuad(c,K,zEnd+4,x,x+1,u,u+2);const lit=R()<0.12;c.fillStyle=lit?`rgba(${NS_WARM.win},0.75)`:`rgb(${NS_STONE.glass})`;c.fill();}
      const t=K.p(x0,hb,zEnd+4),t1=K.p(x0+5,hb,zEnd+4);c.strokeStyle=NS_STONE.edgeSoft;c.lineWidth=1.2;c.beginPath();c.moveTo(t[0],t[1]);c.lineTo(t1[0],t1[1]);c.stroke();}}
  // the road and its pavements
  const gl=K.p(-half,0,zEnd),gr=K.p(half,0,zEnd),nl=K.p(-half,0,0.6),nr=K.p(half,0,0.6);c.beginPath();c.moveTo(gl[0],gl[1]);c.lineTo(gr[0],gr[1]);c.lineTo(nr[0],nr[1]);c.lineTo(nl[0],nl[1]);c.closePath();
  let g=c.createLinearGradient(0,gl[1],0,h);g.addColorStop(0,"rgb(26,44,50)");g.addColorStop(1,"rgb(8,16,19)");c.fillStyle=g;c.fill();
  for(const sx of [-1,1]){const k0=K.p(sx*(half-2.4),0,zEnd),k1=K.p(sx*(half-2.4),0,0.6);c.strokeStyle="rgba(170,210,220,0.22)";c.lineWidth=2;c.beginPath();c.moveTo(k0[0],k0[1]);c.lineTo(k1[0],k1[1]);c.stroke();
    // the pavement, a shade lighter than the road
    const a=K.p(sx*half,0,zEnd),b=K.p(sx*half,0,0.6);c.beginPath();c.moveTo(k0[0],k0[1]);c.lineTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(k1[0],k1[1]);c.closePath();c.fillStyle="rgba(48,76,84,0.30)";c.fill();}
  // the first light on the road, down its middle
  if(!o.quiet){const m=K.p(0,0,40);g=c.createRadialGradient(m[0],m[1],4,m[0],m[1]+80,420);g.addColorStop(0,"rgba(255,200,150,0.14)");g.addColorStop(1,"rgba(255,200,150,0)");c.fillStyle=g;c.fillRect(0,m[1]-60,w,h-m[1]+60);}
  // the buildings, far ones first
  const L=o.quiet?[[0.6,15,19,{lit:0.08}],[15,27,22,{lit:0.1,bay:3.0}],[27,40,17,{lit:0.06}],[40,60,20,{lit:0.1}]]:[[0.6,12,24,{lit:0.24}],[12,21,21,{lit:0.3,bay:3.0,door:1}],[21,34,23,{lit:0.22,door:2}]];
  const Rr=o.quiet?[[0.6,13,18,{lit:0.08}],[13,26,21,{lit:0.1,door:2}],[26,42,18,{lit:0.08}],[42,60,22,{lit:0.06}]]:[[0.6,11,22,{lit:0.3}],[11,23,25,{lit:0.24,door:1}],[23,34,20,{lit:0.3,door:0}]];
  for(const [z0,z1,H,s] of L.slice().reverse())ns_building(c,K,-half,z0,z1,H,s,R);
  for(const [z0,z1,H,s] of Rr.slice().reverse())ns_building(c,K,half,z0,z1,H,s,R);
  // bollards and lamps along the kerbs
  for(const z of (o.quiet?[6,14,24,36]:[5,9,15,22,30]))for(const sx of [-1,1])ns_bollard(c,K,sx*(half-2.6),z);
  for(const [sx,z,lit] of (o.quiet?[[-1,9,true],[1,22,false]]:[[-1,7,true],[1,13,true],[-1,24,false]]))ns_lamp(c,K,sx*(half-2.2),z,lit);
  // the lamps' and the doorways' light, reflected on the road in soft streaks
  const streak=(x,y,wd,hgt,al)=>{c.save();c.translate(x,y);c.scale(wd/100,hgt/100);const rg=c.createRadialGradient(0,0,0,0,0,100);rg.addColorStop(0,`rgba(255,214,150,${al})`);rg.addColorStop(0.5,`rgba(255,214,150,${al*0.35})`);rg.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=rg;c.fillRect(-100,-100,200,200);c.restore();};
  for(const [sx,z] of (o.quiet?[[-1,9]]:[[-1,7],[1,13]])){const q=K.p(sx*(half-2.6),0,z-1.2);streak(q[0],q[1]+Math.min(260,K.f*1.6/z),Math.max(16,K.f*0.55/z),Math.min(300,K.f*2.0/z),0.22);}
  // a low haze where the street meets the far end
  const hz=K.p(0,0,zEnd);g=c.createLinearGradient(0,hz[1]-160,0,hz[1]+40);g.addColorStop(0,"rgba(120,150,156,0)");g.addColorStop(0.8,"rgba(120,150,156,0.05)");g.addColorStop(1,"rgba(120,150,156,0)");c.fillStyle=g;c.fillRect(0,hz[1]-160,w,200);}
// a doorway's middle on the street, in screen space: for messengers to walk from and to (side -1 left, 1 right; which building; z along it)
function ns_streetPoint(X,up,Z){const S=NS_STREET;return ns_cam(S.vx,S.vy,S.f,S.eye).p(X,up,Z);}

/* ---------------------------------------------------------------- a messenger, far off: a dark coat, a case, walking */
// x, y: where the feet meet the ground; s: height in px; ph: the step's phase (0..1); o.case: 0..1, the case in hand; o.dir: 1 walking right, -1 left;
// o.rim: the warm light's side (1 the side he walks towards, -1 behind)
function ns_walker(ctx,x,y,s,ph,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;
  // fading, he is drawn whole first, then faded as one picture, so his arm and coat don't show through each other
  if(a<1){const m=ctx.getTransform(),P=[[x-0.3*s,y-1.08*s],[x+0.3*s,y-1.08*s],[x-0.3*s,y+0.06*s],[x+0.3*s,y+0.06*s]].map(([px,py])=>[m.a*px+m.c*py+m.e,m.b*px+m.d*py+m.f]),
      bx=Math.floor(Math.min(...P.map(p=>p[0])))-2,by=Math.floor(Math.min(...P.map(p=>p[1])))-2,bw=Math.ceil(Math.max(...P.map(p=>p[0])))-bx+4,bh=Math.ceil(Math.max(...P.map(p=>p[1])))-by+4;
    if(bw<2||bh<2)return;const [bc,bk]=ag_buf("nswalk",bw,bh);bk.setTransform(m.a,m.b,m.c,m.d,m.e-bx,m.f-by);ns_walker(bk,x,y,s,ph,Object.assign({},o,{a:1}));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0,bw,bh,bx,by,bw,bh);ctx.restore();return;}
  ctx.save();ctx.translate(x,y);const k=s/100,dir=o.dir||1;ctx.scale(k*dir,k);
  const sw=Math.sin(ph*TAU),st=sw*7,lift=Math.max(0,-sw)*2.5,lift2=Math.max(0,sw)*2.5,ink="rgb(11,13,15)";ctx.fillStyle=ink;
  // the legs, tapering to the shoes, one forward and one back
  const leg=(hx,fx,l)=>{ctx.beginPath();ctx.moveTo(hx-4.2,-44);ctx.lineTo(fx-2.6,-l-1);ctx.lineTo(fx+5.5,-l-1);ctx.lineTo(fx+5.5,-l+0.4);ctx.lineTo(fx-3.4,-l+0.4);ctx.lineTo(hx+4.2,-44);ctx.closePath();ctx.fill();};
  leg(-1.5,-st-1,lift);leg(1.5,st+1,lift2);
  // the overcoat: shoulders, a little flare to below the knee, the collar up
  ctx.beginPath();ctx.moveTo(-4.5,-85.5);ctx.bezierCurveTo(-9,-85,-13.5,-83.5,-14,-79);ctx.lineTo(-15.5,-50);ctx.lineTo(-16.5,-31);ctx.quadraticCurveTo(0,-29,16.5,-31);ctx.lineTo(15.5,-50);ctx.lineTo(14,-79);ctx.bezierCurveTo(13.5,-83.5,9,-85,4.5,-85.5);ctx.closePath();ctx.fill();
  // the head on its neck, a short haircut
  ctx.fillRect(-2.6,-89,5.2,5);ctx.beginPath();ctx.ellipse(0.8,-93.5,5.6,6.8,0,0,TAU);ctx.fill();
  // the near arm down the coat, the case under the hand, swinging a little with the step
  const cs=o.case==null?1:o.case,sway=-sw*0.05;ctx.save();ctx.translate(11.5,-80);ctx.rotate(sway);ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(3.4,0);ctx.lineTo(4.4,32);ctx.lineTo(-1.6,32);ctx.closePath();ctx.fill();
  if(cs>0){ctx.save();ctx.globalAlpha*=cs;ctx.translate(1.4,34);ctx.fillStyle="rgb(40,27,20)";rr(ctx,-11,1.5,24,18,1.6);ctx.fill();ctx.fillStyle=ink;ctx.fillRect(-4,-1.5,9,3.5);
    ctx.strokeStyle="rgba(255,214,150,0.5)";ctx.lineWidth=1.1/k;ctx.beginPath();ctx.moveTo(-11,2.5);ctx.lineTo(13,2.5);ctx.stroke();ctx.restore();}
  ctx.restore();
  // the warm light of the doorways along one edge of him
  const r=o.rim==null?1:o.rim;ctx.strokeStyle="rgba(255,214,150,0.55)";ctx.lineWidth=1.3/k;ctx.beginPath();
  if(r>0){ctx.moveTo(14,-79);ctx.lineTo(15.5,-50);ctx.moveTo(4.6,-90);ctx.ellipse(0.8,-93.5,5.6,6.8,0,-0.6,1.1);}else{ctx.moveTo(-14,-79);ctx.lineTo(-15.5,-50);ctx.moveTo(-3,-99);ctx.ellipse(0.8,-93.5,5.6,6.8,0,Math.PI-0.9,Math.PI+0.6);}ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- the City from above, at first light */
// The streets round the Bank, drawn as a plan (not to scale): each a line of points; the Bank's block north of the junction.
const NS_MAP={junction:[980,600],
  streets:[{n:"Poultry",w:34,P:[[980,600],[620,630],[260,640],[-60,628]]},{n:"Princes",w:30,P:[[980,600],[930,420],[900,230],[884,-40]]},
    {n:"Threadneedle",w:28,P:[[980,600],[1120,470],[1268,356],[1520,250],[1990,160]]},{n:"Cornhill",w:32,P:[[980,600],[1240,575],[1520,560],[1990,520]]},
    {n:"Lombard",w:28,P:[[980,600],[1180,690],[1420,770],[1990,905]]},{n:"King William",w:34,P:[[980,600],[1080,760],[1180,905],[1300,1120]]},
    {n:"Queen Victoria",w:34,P:[[980,600],[820,760],[690,900],[420,1120]]},{n:"Lothbury",w:22,P:[[900,262],[1100,250],[1290,248],[1600,232]]},
    {n:"Nicholas",w:18,P:[[1360,750],[1384,880],[1404,1000],[1420,1120]]},{n:"Moorgate",w:28,P:[[1100,250],[1110,60],[1120,-40]]},
    {n:"Cheapside lane",w:18,P:[[620,630],[600,820],[560,1120]]},{n:"Old Broad",w:22,P:[[1268,356],[1300,120],[1320,-40]]},
    {n:"Gracechurch",w:28,P:[[1520,560],[1560,800],[1600,1120]]},{n:"Coleman",w:20,P:[[700,622],[690,300],[680,-40]]}],
  bank:[[1000,572],[918,282],[1262,262],[1266,350]]};
// a point along a street's line, u from 0 to 1, and the direction there
function ns_mapAt(st,u){const P=st.P;let L=0;const seg=[];for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(d);L+=d;}
  let r=Math.max(0,Math.min(1,u))*L;for(let i=0;i<seg.length;i++){if(r<=seg[i]||i===seg.length-1){const k=seg[i]?r/seg[i]:0,a=P[i],b=P[i+1];return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,Math.atan2(b[1]-a[1],b[0]-a[0])];}r-=seg[i];}return P[0].concat([0]);}
function ns_paintMap(c,w,h){const M=NS_MAP,R=ns_rnd(131);
  // roofs: the whole City a dark slate, broken into blocks by a fine grid of lighter roof edges
  let g=c.createRadialGradient(M.junction[0],M.junction[1],60,M.junction[0],M.junction[1],1300);g.addColorStop(0,"rgb(24,42,48)");g.addColorStop(1,"rgb(9,18,22)");c.fillStyle=g;c.fillRect(0,0,w,h);
  for(let i=0;i<520;i++){const x=R()*w,y=R()*h,bw=30+R()*70,bh=24+R()*60,sh=14+R()*14|0;c.fillStyle=`rgba(${sh+8},${sh+24},${sh+30},0.55)`;c.fillRect(x,y,bw,bh);
    c.strokeStyle="rgba(170,210,220,0.10)";c.lineWidth=1;c.strokeRect(x+0.5,y+0.5,bw,bh);if(R()<0.05){c.save();c.shadowColor=NS_WARM.glow;c.shadowBlur=6;c.fillStyle="rgba(255,206,140,0.8)";c.fillRect(x+bw*0.3,y+bh*0.4,4,4);c.restore();}}
  // the streets: a darker channel, its edges catching the light, a few lamps along it
  for(const st of M.streets){c.lineJoin="round";c.lineCap="round";c.strokeStyle="rgb(8,15,18)";c.lineWidth=st.w+10;c.beginPath();st.P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();}
  for(const st of M.streets){c.strokeStyle="rgb(20,36,42)";c.lineWidth=st.w;c.beginPath();st.P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    for(let u=0.06;u<1;u+=0.11){const q=ns_mapAt(st,u),nx=-Math.sin(q[2]),ny=Math.cos(q[2]),sd=(Math.round(u*100)%2?1:-1)*st.w*0.42;const lx=q[0]+nx*sd,ly=q[1]+ny*sd;
      const lg=c.createRadialGradient(lx,ly,0,lx,ly,22);lg.addColorStop(0,"rgba(255,214,150,0.30)");lg.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=lg;c.fillRect(lx-22,ly-22,44,44);c.fillStyle="rgba(255,226,170,0.9)";c.beginPath();c.arc(lx,ly,1.8,0,TAU);c.fill();}}
  // the Bank: one great block of pale stone, its courtyards, its long wall lit along the top
  c.beginPath();M.bank.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();g=c.createLinearGradient(918,262,1266,572);g.addColorStop(0,"rgb(70,94,98)");g.addColorStop(1,"rgb(52,76,82)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(210,236,236,0.55)";c.lineWidth=2.4;c.stroke();
  for(const [x,y,ww,hh] of [[1010,320,90,60],[1130,310,80,70],[1040,410,70,50]]){c.fillStyle="rgb(26,44,50)";c.fillRect(x,y,ww,hh);c.strokeStyle="rgba(210,236,236,0.25)";c.lineWidth=1.2;c.strokeRect(x,y,ww,hh);}
  // first light, from the east
  g=c.createLinearGradient(w,0,0,h);g.addColorStop(0,"rgba(255,200,150,0.10)");g.addColorStop(0.5,"rgba(255,200,150,0.03)");g.addColorStop(1,"rgba(255,200,150,0)");c.fillStyle=g;c.fillRect(0,0,w,h);}
// a messenger's case on the map, drawn live: a small dark case with a soft coral ring round it (the risk it carries)
function ns_mapCase(ctx,x,y,a,risk){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(risk>0){const g=ctx.createRadialGradient(x,y,4,x,y,30);g.addColorStop(0,`rgba(255,122,106,${0.45*risk})`);g.addColorStop(1,"rgba(255,122,106,0)");ctx.fillStyle=g;ctx.fillRect(x-30,y-30,60,60);
    ctx.strokeStyle=`rgba(255,140,124,${0.8*risk})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,13,0,TAU);ctx.stroke();}
  ctx.fillStyle="rgb(52,36,26)";rr(ctx,x-8,y-6,16,12,2);ctx.fill();ctx.strokeStyle="rgba(255,214,150,0.7)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-8,y-5);ctx.lineTo(x+8,y-5);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the bearer papers: security paper, a guilloche border, a gold seal, no words */
function ns_paper(c,x,y,w,h,rot,seed){const R=ns_rnd(seed||5);c.save();c.translate(x,y);c.rotate(rot||0);
  c.shadowColor="rgba(0,0,0,0.45)";c.shadowBlur=18;c.shadowOffsetY=6;c.fillStyle="rgb(238,232,214)";rr(c,-w/2,-h/2,w,h,4);c.fill();c.shadowColor="transparent";
  // an underprint, faint: a wash from rose to sage
  let g=c.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,"rgba(220,180,180,0.25)");g.addColorStop(0.5,"rgba(200,214,190,0.18)");g.addColorStop(1,"rgba(180,200,214,0.25)");c.fillStyle=g;rr(c,-w/2,-h/2,w,h,4);c.fill();
  // the border: two bands of fine interlaced waves
  c.save();rr(c,-w/2,-h/2,w,h,4);c.clip();const band=(inset,amp,n,col)=>{c.strokeStyle=col;c.lineWidth=0.9;for(let k=0;k<3;k++){c.beginPath();const ph=k*TAU/3;
      const L=2*(w+h-4*inset),N=Math.ceil(L/2.5);for(let i=0;i<=N;i++){const s=i/N*L;let px,py,nx,ny;const W=w-2*inset,H=h-2*inset;
        if(s<W){px=-w/2+inset+s;py=-h/2+inset;nx=0;ny=1;}else if(s<W+H){px=w/2-inset;py=-h/2+inset+(s-W);nx=-1;ny=0;}else if(s<2*W+H){px=w/2-inset-(s-W-H);py=h/2-inset;nx=0;ny=-1;}else{px=-w/2+inset;py=h/2-inset-(s-2*W-H);nx=1;ny=0;}
        const o=amp*Math.sin(s/L*n*TAU+ph);i?c.lineTo(px+nx*o,py+ny*o):c.moveTo(px+nx*o,py+ny*o);}c.stroke();}};
  band(12,5,90,"rgba(120,90,110,0.55)");band(22,4,120,"rgba(90,120,110,0.45)");c.restore();
  // a rosette, off centre, of fine curves; and the gold seal
  const rx=-w*0.18,ry=0;c.strokeStyle="rgba(110,100,130,0.4)";c.lineWidth=0.8;for(let k=0;k<12;k++){c.beginPath();for(let i=0;i<=120;i++){const t=i/120*TAU,r=h*0.28*(0.62+0.38*Math.cos(6*t+k*TAU/12));i?c.lineTo(rx+r*Math.cos(t),ry+r*Math.sin(t)):c.moveTo(rx+r*Math.cos(t),ry+r*Math.sin(t));}c.stroke();}
  const sx=w*0.3,sy=h*0.12,sr=h*0.16;g=c.createRadialGradient(sx-sr*0.3,sy-sr*0.3,2,sx,sy,sr);g.addColorStop(0,"rgb(255,226,140)");g.addColorStop(0.6,"rgb(214,160,52)");g.addColorStop(1,"rgb(150,104,30)");
  c.fillStyle=g;c.beginPath();for(let i=0;i<=40;i++){const a=i/40*TAU,r=sr*(1+0.06*Math.cos(i*2.6));c.lineTo(sx+r*Math.cos(a),sy+r*Math.sin(a));}c.closePath();c.fill();
  c.strokeStyle="rgba(120,80,20,0.6)";c.lineWidth=1.2;c.beginPath();c.arc(sx,sy,sr*0.62,0,TAU);c.stroke();c.beginPath();c.arc(sx,sy,sr*0.3,0,TAU);c.stroke();
  // lines where words would be, too faint to read: a paper's look, never its words
  c.strokeStyle="rgba(90,80,70,0.25)";c.lineWidth=1.4;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-w*0.02,-h*0.2+i*h*0.14);c.lineTo(w*0.16,-h*0.2+i*h*0.14);c.stroke();}
  c.restore();}
// one paper, painted once and kept (its shadow inside the picture), drawn rotated wherever it lies
function ns_paperPic(i,w){const h=Math.round(w*0.56);return ag_kept("ns:paper:"+i+":"+w,w+90,h+90,c=>ns_paper(c,(w+90)/2,(h+90)/2,w,h,0,7+i*13));}
// the papers fanned: n of them, spread by u (0 a neat stack, 1 a full fan)
function ns_papers(c,x,y,w,u,n){n=n||5;for(let i=0;i<n;i++){const k=i-(n-1)/2,rot=k*0.12*u,dx=k*w*0.16*u,dy=Math.abs(k)*8*u,P=ns_paperPic(i,w);
  c.save();c.translate(x+dx,y+dy);c.rotate(rot);c.drawImage(P,-P.width/2,-P.height/2);c.restore();}}

/* ===== No secret to lose: the Bank of England, 1990 =====
   The Bank's long wall from the street, its vault behind a round door, and a back office with a screen of 1990: painted once each,
   in the same light as the City (ns_city.js). What moves or changes (the vault's door, the screen's lines) is drawn live, here too. */

/* ---------------------------------------------------------------- the Bank's wall, face on */
function ns_paintBankFront(c,w,h){const K=ns_cam(960,660,820,1.65),R=ns_rnd(71);
  ns_sky(c,w,690,{dawn:[1240,560,760],stops:[[0,[5,13,19]],[0.5,[18,38,47]],[0.85,[44,72,78]],[1,[74,96,96]]]});
  for(let i=0;i<60;i++){const x=R()*w,y=R()*240;c.fillStyle=`rgba(210,235,240,${0.06+R()*0.2})`;c.beginPath();c.arc(x,y,R()*1.1+0.3,0,TAU);c.fill();}
  // the street in front: the road, the far pavement under the wall, the near kerb
  let g=c.createLinearGradient(0,660,0,h);g.addColorStop(0,"rgb(30,50,56)");g.addColorStop(1,"rgb(8,16,19)");c.fillStyle=g;c.fillRect(0,650,w,h-650);
  const pv=K.p(0,0,32.5),pk=K.p(0,0,29.5);c.fillStyle="rgba(60,90,98,0.35)";c.fillRect(0,pv[1],w,pk[1]-pv[1]);c.fillStyle="rgba(170,210,220,0.25)";c.fillRect(0,pk[1],w,1.6);
  // the wall, long and windowless, with its columns; the upper storeys set back behind it
  ns_bankWall(c,K,34,-60,60,{h:10.5,back:8,hb:20,seed:13,step:7.2});
  // a soft first light along the wall's top
  g=c.createLinearGradient(0,400,0,560);g.addColorStop(0,"rgba(255,200,150,0.10)");g.addColorStop(1,"rgba(255,200,150,0)");c.fillStyle=g;c.fillRect(0,400,w,160);
  // bollards and a lamp on the near kerb
  for(const x of [-12,-4,4,12])ns_bollard(c,K,x,29.3);ns_lamp(c,K,-18,29.6,true);ns_lamp(c,K,18,29.6,true);
  // the near road, darker, with the lamps' light on it
  for(const x of [-18,18]){const q=K.p(x,0,29.6);c.save();c.translate(q[0],q[1]+120);c.scale(0.35,1.2);const rg=c.createRadialGradient(0,0,0,0,0,140);rg.addColorStop(0,"rgba(255,214,150,0.16)");rg.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=rg;c.fillRect(-140,-140,280,280);c.restore();}}

/* ---------------------------------------------------------------- the vault: a round doorway, the shelves behind it */
const NS_VAULT={cx:960,cy:500,r:300};
function ns_paintVault(c,w,h){const V=NS_VAULT,R=ns_rnd(83);
  // the antechamber: steel plates on the wall, riveted, in a cool overhead light
  let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgb(14,26,31)");g.addColorStop(0.6,"rgb(24,42,48)");g.addColorStop(1,"rgb(10,19,23)");c.fillStyle=g;c.fillRect(0,0,w,h);
  c.strokeStyle="rgba(150,190,200,0.10)";c.lineWidth=1.2;for(let x=0;x<w;x+=240){c.beginPath();c.moveTo(x,0);c.lineTo(x,860);c.stroke();}for(let y=120;y<860;y+=240){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
  c.fillStyle="rgba(190,225,232,0.16)";for(let x=0;x<w;x+=240)for(let y=120;y<860;y+=240)for(const [dx,dy] of [[12,12],[-12,12],[12,-12],[-12,-12]]){c.beginPath();c.arc(x+dx,y+dy,2.2,0,TAU);c.fill();}
  // the floor
  g=c.createLinearGradient(0,860,0,h);g.addColorStop(0,"rgb(26,42,46)");g.addColorStop(1,"rgb(8,15,18)");c.fillStyle=g;c.fillRect(0,860,w,h-860);c.fillStyle="rgba(170,210,220,0.18)";c.fillRect(0,860,w,1.4);
  // a lamp's pool of light on the wall above the door
  g=c.createRadialGradient(V.cx,120,10,V.cx,260,640);g.addColorStop(0,"rgba(200,232,236,0.20)");g.addColorStop(1,"rgba(200,232,236,0)");c.fillStyle=g;c.fillRect(0,0,w,860);
  // the doorway's heavy frame, a ring of steel
  c.save();c.beginPath();c.arc(V.cx,V.cy,V.r+56,0,TAU);g=c.createRadialGradient(V.cx-60,V.cy-80,40,V.cx,V.cy,V.r+60);g.addColorStop(0,"rgb(92,118,122)");g.addColorStop(1,"rgb(40,60,66)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(210,236,236,0.45)";c.lineWidth=2;c.beginPath();c.arc(V.cx,V.cy,V.r+56,Math.PI*1.05,Math.PI*1.75);c.stroke();c.restore();
  // inside: the vault, lit cool and even: shelves on both sides running back, each holding papers in sealed sleeves
  c.save();c.beginPath();c.arc(V.cx,V.cy,V.r,0,TAU);c.clip();
  g=c.createLinearGradient(0,V.cy-V.r,0,V.cy+V.r);g.addColorStop(0,"rgb(44,66,70)");g.addColorStop(1,"rgb(22,36,40)");c.fillStyle=g;c.fillRect(V.cx-V.r,V.cy-V.r,V.r*2,V.r*2);
  const K=ns_cam(V.cx,V.cy-30,520,1.6);
  // the back wall and the floor
  ns_frontQuad(c,K,22,-3.2,3.2,0,3.4);c.fillStyle="rgb(36,56,60)";c.fill();
  const f0=K.p(-3.2,0,22),f1=K.p(3.2,0,22),f2=K.p(3.2,0,1.6),f3=K.p(-3.2,0,1.6);c.beginPath();c.moveTo(f0[0],f0[1]);c.lineTo(f1[0],f1[1]);c.lineTo(f2[0],f2[1]);c.lineTo(f3[0],f3[1]);c.closePath();c.fillStyle="rgb(30,46,50)";c.fill();
  // the shelves: uprights and five shelves a side, the sleeves on them, pale, each with a small gold seal
  for(const X of [-3.2,3.2]){ns_wallQuad(c,K,X,1.6,22,0,3.4);c.fillStyle="rgb(28,44,48)";c.fill();
    for(let z=2;z<22;z+=2.2){const a=K.p(X,0,z),b=K.p(X,3.2,z);c.strokeStyle="rgba(150,180,186,0.55)";c.lineWidth=Math.max(1,6/z*3);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
    for(let u=0.35;u<3.2;u+=0.62){const a=K.p(X,u,1.6),b=K.p(X,u,22);c.strokeStyle="rgba(170,200,206,0.6)";c.lineWidth=2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();
      for(let z=2.1;z<21.5;z+=0.36){if(R()<0.12)continue;const hh=0.32+R()*0.14;ns_wallQuad(c,K,X,z,z+0.26,u+0.02,u+hh);c.fillStyle=`rgb(${196+R()*24|0},${200+R()*20|0},${190+R()*16|0})`;c.globalAlpha=0.78;c.fill();c.globalAlpha=1;
        if(z<8&&R()<0.6){const s=K.p(X,u+hh*0.5,z+0.13);c.fillStyle="rgb(230,180,60)";c.beginPath();c.arc(s[0],s[1],Math.max(1.2,5/z),0,TAU);c.fill();}}}}
  // the lights overhead, a line of them going back
  for(let z=4;z<22;z+=4.5){const p=K.p(0,3.35,z),s2=Math.max(8,140/z);c.fillStyle="rgb(18,30,34)";c.fillRect(p[0]-s2,p[1]-s2*0.18-2,s2*2,s2*0.18+2);const lg=c.createRadialGradient(p[0],p[1]+s2*0.4,1,p[0],p[1]+s2*0.4,s2*3);lg.addColorStop(0,"rgba(230,246,246,0.35)");lg.addColorStop(1,"rgba(230,246,246,0)");c.fillStyle=lg;c.fillRect(p[0]-s2*3,p[1]-s2*3,s2*6,s2*6);c.fillStyle="rgba(236,248,248,0.95)";c.fillRect(p[0]-s2*0.9,p[1]-1,s2*1.8,Math.max(2,s2*0.12));}
  c.restore();
  // the ring's inner lip, catching the light
  c.strokeStyle="rgba(210,236,236,0.35)";c.lineWidth=3;c.beginPath();c.arc(V.cx,V.cy,V.r+2,Math.PI*1.1,Math.PI*1.9);c.stroke();}
// the vault's door, drawn live: u 0 wide open (swung towards us on its hinge at the right), 1 shut
function ns_vaultDoor(ctx,u){const V=NS_VAULT,a=(1-ns_easeIO(u))*1.45,hx=V.cx+V.r+30,cw=Math.cos(a),fx=hx-(V.r+30)*cw,rx=Math.max(6,(V.r+18)*cw),th=78*Math.sin(a)+18*cw;
  ctx.save();
  // its shadow on the wall beside the doorway, while it's open
  if(a>0.2){ctx.save();ctx.filter="blur(18px)";ctx.fillStyle=`rgba(4,10,12,${0.30*Math.sin(a)})`;ctx.beginPath();ctx.ellipse(hx+th*0.9,V.cy+30,th*0.8,V.r*0.8,0,0,TAU);ctx.fill();ctx.restore();}
  // the door's thickness: a band from its face to its back edge, towards the hinge
  ctx.fillStyle="rgb(58,80,84)";ctx.beginPath();ctx.ellipse(fx+th,V.cy,rx,V.r+18,0,-Math.PI/2,Math.PI/2);ctx.lineTo(fx,V.cy+V.r+18);ctx.ellipse(fx,V.cy,rx,V.r+18,0,Math.PI/2,-Math.PI/2,true);ctx.closePath();ctx.fill();
  ctx.save();ctx.clip();ctx.strokeStyle="rgba(20,34,38,0.5)";ctx.lineWidth=2;for(const k of [0.3,0.55,0.8]){ctx.beginPath();ctx.ellipse(fx+th*k,V.cy,rx,V.r+18,0,-Math.PI/2,Math.PI/2);ctx.stroke();}ctx.restore();
  // the face: brushed steel in rings, a wheel and its spokes, the bolts round the edge
  const g=ctx.createLinearGradient(fx-rx,0,fx+rx,0);g.addColorStop(0,"rgb(70,94,98)");g.addColorStop(0.45,"rgb(132,156,156)");g.addColorStop(1,"rgb(62,84,88)");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(fx,V.cy,rx,V.r+18,0,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(20,34,38,0.45)";ctx.lineWidth=2;for(const k of [0.82,0.6,0.22]){ctx.beginPath();ctx.ellipse(fx,V.cy,rx*k,(V.r+18)*k,0,0,TAU);ctx.stroke();}
  // the wheel that throws the bolts: a rim and three spokes with knobs, turning as the door shuts
  const spin=-Math.PI/2+u*2.4,wr=0.4;ctx.strokeStyle="rgb(40,58,62)";ctx.lineWidth=Math.max(2,12*cw);ctx.beginPath();ctx.ellipse(fx,V.cy,rx*wr,(V.r+18)*wr,0,0,TAU);ctx.stroke();ctx.lineWidth=Math.max(2,10*cw);
  for(let i=0;i<3;i++){const an=spin+i*TAU/3,ex=fx+Math.cos(an)*rx*(wr+0.1),ey=V.cy+Math.sin(an)*(V.r+18)*(wr+0.1);ctx.beginPath();ctx.moveTo(fx,V.cy);ctx.lineTo(ex,ey);ctx.stroke();ctx.fillStyle="rgb(150,172,172)";ctx.beginPath();ctx.ellipse(ex,ey,Math.max(3,14*cw),14,0,0,TAU);ctx.fill();}
  ctx.fillStyle="rgb(40,58,62)";ctx.beginPath();ctx.ellipse(fx,V.cy,Math.max(3,rx*0.1),34,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(210,236,236,0.55)";for(let i=0;i<16;i++){const an=i/16*TAU;ctx.beginPath();ctx.ellipse(fx+Math.cos(an)*rx*0.92,V.cy+Math.sin(an)*(V.r+18)*0.92,Math.max(1.5,7*cw),7,0,0,TAU);ctx.fill();}
  ctx.strokeStyle="rgba(220,240,240,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(fx,V.cy,rx,V.r+18,0,Math.PI*1.1,Math.PI*1.7);ctx.stroke();
  ctx.restore();}
function ns_easeIO(u){u=Math.max(0,Math.min(1,u));return u<0.5?2*u*u:1-Math.pow(-2*u+2,2)/2;}

/* ---------------------------------------------------------------- a back office of 1990: a screen on a desk */
// The screen's glass is drawn live (its lines change); the room around it is painted once. NS_SCREEN is the glass, in the frame.
const NS_SCREEN={x:520,y:170,w:1000,h:560};
function ns_paintOffice(c,w,h){const S=NS_SCREEN,R=ns_rnd(97);
  // the room: a dark wall, a window with its blind half down, the morning outside it faint
  let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgb(14,26,31)");g.addColorStop(1,"rgb(20,36,42)");c.fillStyle=g;c.fillRect(0,0,w,h);
  const wx=1620,wy=90,ww=240,wh=420;g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgb(40,64,72)");g.addColorStop(1,"rgb(70,92,94)");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.fillStyle="rgb(24,40,46)";for(let y=wy;y<wy+wh*0.55;y+=14)c.fillRect(wx,y,ww,9);c.strokeStyle="rgba(190,225,232,0.3)";c.lineWidth=3;c.strokeRect(wx,wy,ww,wh);
  // the desk's top and its front edge
  g=c.createLinearGradient(0,800,0,h);g.addColorStop(0,"rgb(52,40,32)");g.addColorStop(1,"rgb(24,18,15)");c.fillStyle=g;c.fillRect(0,800,w,h-800);c.fillStyle="rgba(255,214,150,0.18)";c.fillRect(0,800,w,2);
  // the terminal: a beige case round the glass, a deep back, a base; a keyboard in front
  const bx=S.x-70,by=S.y-60,bw=S.w+140,bh=S.h+150;g=c.createLinearGradient(bx,by,bx,by+bh);g.addColorStop(0,"rgb(150,146,128)");g.addColorStop(1,"rgb(104,100,88)");
  c.fillStyle=g;rr(c,bx,by,bw,bh,26);c.fill();c.strokeStyle="rgba(230,226,206,0.5)";c.lineWidth=2;rr(c,bx+2,by+2,bw-4,bh-4,24);c.stroke();
  c.fillStyle="rgb(18,20,18)";rr(c,S.x-18,S.y-18,S.w+36,S.h+36,30);c.fill();
  // its name plate and a power light
  c.fillStyle="rgba(60,58,50,0.9)";rr(c,bx+bw/2-80,by+bh-56,160,22,6);c.fill();c.fillStyle="rgb(236,226,200)";c.beginPath();c.arc(bx+bw-70,by+bh-45,6,0,TAU);c.fill();
  c.fillStyle="rgb(96,92,80)";c.beginPath();c.moveTo(bx+bw/2-220,by+bh);c.lineTo(bx+bw/2+220,by+bh);c.lineTo(bx+bw/2+260,808);c.lineTo(bx+bw/2-260,808);c.closePath();c.fill();
  // the room's light: the screen's glow on the wall round it, and a lamp's warm pool at the left
  g=c.createRadialGradient(S.x+S.w/2,S.y+S.h/2,S.w*0.3,S.x+S.w/2,S.y+S.h/2,S.w*0.95);g.addColorStop(0,"rgba(200,228,224,0.08)");g.addColorStop(1,"rgba(200,228,224,0)");c.fillStyle=g;c.fillRect(0,0,w,800);
  g=c.createRadialGradient(140,760,10,140,760,420);g.addColorStop(0,"rgba(255,206,140,0.26)");g.addColorStop(1,"rgba(255,206,140,0)");c.fillStyle=g;c.fillRect(0,340,600,740);
  c.fillStyle="rgb(18,26,26)";c.beginPath();c.moveTo(80,800);c.lineTo(200,800);c.lineTo(170,780);c.lineTo(110,780);c.closePath();c.fill();c.fillRect(136,560,8,220);
  c.save();c.translate(140,560);c.rotate(-0.25);c.beginPath();c.moveTo(-70,40);c.lineTo(-40,-20);c.lineTo(40,-20);c.lineTo(70,40);c.closePath();c.fillStyle="rgb(58,44,26)";c.fill();c.restore();}
// the screen's glass, drawn live under its lines: dark, a faint glow, curved at its edges (its letters are white: green means allowed in this module)
function ns_screenGlass(ctx,a){const S=NS_SCREEN;a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;rr(ctx,S.x,S.y,S.w,S.h,22);ctx.clip();
  const g=ctx.createRadialGradient(S.x+S.w/2,S.y+S.h/2,40,S.x+S.w/2,S.y+S.h/2,S.w*0.62);g.addColorStop(0,"rgb(16,24,24)");g.addColorStop(1,"rgb(5,8,9)");ctx.fillStyle=g;ctx.fillRect(S.x,S.y,S.w,S.h);
  const r=ctx.createLinearGradient(S.x,S.y,S.x+S.w*0.4,S.y+S.h*0.5);r.addColorStop(0,"rgba(200,240,220,0.06)");r.addColorStop(1,"rgba(200,240,220,0)");ctx.fillStyle=r;ctx.fillRect(S.x,S.y,S.w,S.h);ctx.restore();}
const NS_PHOSPHOR=[226,236,230];

/* ===== No secret to lose: the film's own pictures, on the module's kit =====
   The places of 1990 are in ns_city.js (the City's streets, the City from above, the bearer papers) and ns_bank.js (the Bank's wall, its
   vault, a back office's screen); the ladders are in ns_ladder.js. Here: the places, as the kit paints them once (AG_PLACES); the hall
   with the university's data platform, a tall block of clear glass with one lit door; the nightly job's badge and the sealed card
   clipped to it; and the small things the chapters show (a clock, a note with a seal, a pass, a vault, a key, a phone, a fake page).
   Colours mean what the module says they mean: cyan an identity, green allowed, coral denied or closed, violet a secret; gold is only a
   badge's chip. A secret is only ever a sealed card (dp_sealed), never a character of it. Every word is drawn with dp_T, at least
   28 px as seen. */

const NS_TITLE="No secret to lose",NS_LINE="FILM 2 OF 9 · LOCKS BEFORE THE DATA";
const NS_ICE=[214,232,234];   // a label with no meaning of its own ("Pay the bearer"): ice, not a meaning's colour
DP_PEOPLE.push("sam","jun","mei");

/* ---------------------------------------------------------------- the places, painted once */
AG_PLACES.nsStreet=c=>ns_paintStreet(c,W,H,{});
AG_PLACES.nsQuiet=c=>ns_paintStreet(c,W,H,{quiet:true});
AG_PLACES.nsMap=c=>ns_paintMap(c,W,H);
AG_PLACES.nsFront=c=>ns_paintBankFront(c,W,H);
AG_PLACES.nsVault=c=>ns_paintVault(c,W,H);
AG_PLACES.nsOffice=c=>ns_paintOffice(c,W,H);
// the hall with the platform: Sam's pool of light at the left, Jun's at the right, the platform's door lighting the floor
AG_PLACES.nsHall=c=>dp_paintHall(c,{seed:23,horizon:690,vx:1040,panes:8,pools:[[300,980,520,0.12],[1700,960,480,0.08],[NS_DOOR.x+NS_DOOR.w/2,NS_DOOR.y+NS_DOOR.h+30,330,0.10]],after:ns_paintPlatform});
// the ladders' rooms: the workload ladder's, and the people's, in the same hall seen from elsewhere
AG_PLACES.nsLadder=c=>dp_paintHall(c,{seed:41,horizon:720,vx:760,panes:7,lights:16,pools:[[440,960,560,0.09],[1340,900,700,0.06]]});
AG_PLACES.nsPeople=c=>dp_paintHall(c,{seed:59,horizon:700,vx:1240,panes:7,lights:16,pools:[[420,960,560,0.10],[1360,900,700,0.06]]});

/* ---------------------------------------------------------------- the university's data platform
   A tall block of clear glass (what is inside may be seen), lit from within by rows of soft light, with one lit door at its foot.
   Painted into the hall once; its door's light and what passes through it are drawn live (ns_door). */
// text on its way somewhere, too small to read for a moment, is decoration on purpose: PH_OFF is the phone check's hook, as From words
// to data's legible.py names it (a card turned edge-on)
let PH_OFF=0;
const NS_PLAT={x:1290,y:96,w:430,h:766},NS_DOOR={x:1435,y:654,w:140,h:208};
function ns_paintPlatform(c){const P=NS_PLAT,D=NS_DOOR,ice=DP.ice,cy=DP.F.cyan,yb=P.y+P.h;
  // its glow on the hall, and the floor's gloss under it
  let g=c.createRadialGradient(P.x+P.w/2,P.y+P.h*0.55,40,P.x+P.w/2,P.y+P.h*0.55,P.w*1.25);g.addColorStop(0,rgba(cy,0.09));g.addColorStop(1,rgba(cy,0));c.fillStyle=g;c.fillRect(P.x-P.w,P.y-80,P.w*3,P.h+200);
  // the glass: dark, clear, the hall's lights seen softly through it
  c.save();rr(c,P.x,P.y,P.w,P.h,10);c.clip();
  g=c.createLinearGradient(P.x,0,P.x+P.w,0);g.addColorStop(0,"rgba(16,46,52,0.62)");g.addColorStop(0.5,"rgba(10,32,38,0.5)");g.addColorStop(1,"rgba(18,50,56,0.66)");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);
  // rows of soft light inside, floor by floor: what the platform holds, seen through clear glass
  const R=ag_rnd(311);for(let f=0;f<11;f++){const yy=P.y+44+f*58;if(yy>D.y-30)break;for(let k=0;k<6;k++){const x0=P.x+26+k*66+R()*8,on=R();
    c.fillStyle=rgba(on<0.18?[150,200,255]:cy,0.10+0.16*R());rr(c,x0,yy,48,10,5);c.fill();}}
  // mullions: the block's panes, and a sheen across them
  c.strokeStyle="rgba(190,245,245,0.10)";c.lineWidth=1.4;for(let k=1;k<4;k++){c.beginPath();c.moveTo(P.x+k*P.w/4,P.y);c.lineTo(P.x+k*P.w/4,yb);c.stroke();}
  for(let f=1;f<4;f++){c.beginPath();c.moveTo(P.x,P.y+f*P.h/4);c.lineTo(P.x+P.w,P.y+f*P.h/4);c.stroke();}
  g=c.createLinearGradient(P.x,P.y,P.x+P.w,P.y+P.h);g.addColorStop(0,"rgba(220,250,250,0.10)");g.addColorStop(0.3,"rgba(220,250,250,0.02)");g.addColorStop(0.42,"rgba(220,250,250,0.08)");g.addColorStop(0.55,"rgba(220,250,250,0)");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);
  c.restore();
  // its edges catch the light
  c.save();c.shadowColor=rgba(ice,0.8);c.shadowBlur=12;c.strokeStyle=rgba(ice,0.75);c.lineWidth=2.2;rr(c,P.x+1,P.y+1,P.w-2,P.h-2,10);c.stroke();c.restore();
  c.fillStyle=rgba(ice,0.5);c.fillRect(P.x+12,P.y+1,P.w-24,2);
  // the door: a recess of light
  c.save();rr(c,D.x,D.y,D.w,D.h,8);c.clip();g=c.createLinearGradient(0,D.y,0,D.y+D.h);g.addColorStop(0,"rgba(150,232,242,0.30)");g.addColorStop(1,"rgba(200,250,250,0.55)");c.fillStyle=g;c.fillRect(D.x,D.y,D.w,D.h);c.restore();
  c.strokeStyle=rgba(cy,0.9);c.lineWidth=2.4;rr(c,D.x,D.y,D.w,D.h,8);c.stroke();
  // the light it throws on the floor, and the block's reflection
  g=c.createRadialGradient(D.x+D.w/2,yb+10,4,D.x+D.w/2,yb+10,260);g.addColorStop(0,"rgba(150,232,242,0.22)");g.addColorStop(1,"rgba(150,232,242,0)");c.save();c.translate(D.x+D.w/2,yb+10);c.scale(1,0.3);c.translate(-D.x-D.w/2,-yb-10);c.fillStyle=g;c.fillRect(D.x-300,yb-290,D.w+600,600);c.restore();
  g=c.createLinearGradient(0,yb,0,yb+170);g.addColorStop(0,"rgba(120,210,220,0.10)");g.addColorStop(1,"rgba(120,210,220,0)");c.fillStyle=g;c.fillRect(P.x,yb,P.w,170);}
// the platform's name over it, and its door lit brighter (k 0 to 1) as something it vouches for passes
function ns_platformLabel(ctx,a){if(a>0)dp_T(ctx,"The data platform",NS_PLAT.x+NS_PLAT.w/2,NS_PLAT.y-24,{w:700,size:30,align:"center",col:"cyan",a});}
function ns_door(ctx,k,col){if(!(k>0))return;const D=NS_DOOR,c=dp_f(col||"cyan");dp_halo(ctx,D.x+D.w/2,D.y+D.h*0.55,220,c,0.22*k);
  ctx.save();ctx.globalCompositeOperation="lighter";rr(ctx,D.x,D.y,D.w,D.h,8);ctx.fillStyle=rgba(c,0.22*k);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the nightly job, and what it carries
   ns_badge: the job's badge from Who is it, really? (600 x 372 at s 1): a workload, cyan, owned by Sam, with the loader role.
   ns_badgeMini: the same badge far off, too small to read, so it has no words at all. ns_clip: the clip that holds a sealed card to the
   badge. ns_secret: the sealed card itself (dp_sealed), with o.bearer laying "Pay the bearer" across it. */
const NS_BW=600,NS_BH=372;
function ns_badge(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0))return;dp_badge(ctx,x,y,NS_BW,NS_BH,{kind:"Workload",col:"cyan",title:"registrar-loader",
  lines:[["Owned by Sam Okafor"],["Loader role","cyan"]],pic:dp_gearPic,mrz:"WKL<REGISTRAR<LOADER<<<<<<<<<<<<<<<",t:o.t,scan:o.scan,a,behind:o.behind});
  if(o.glow>0)ns_glow(ctx,x,y,NS_BW,NS_BH,o.glow*a);}
function ns_badgeMini(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  dp_badge(ctx,0,0,NS_BW,NS_BH,{kind:"",col:"cyan",pic:dp_gearPic,t:o.t,behind:o.behind});if(o.glow>0)ns_glow(ctx,0,0,NS_BW,NS_BH,o.glow);
  if(o.card>0){ns_clipLine(ctx,NS_BW/2,NS_BH,o.card);ctx.save();ctx.globalAlpha*=o.card;dp_frost(ctx,40,NS_BH+44,NS_BW-80,110,null,{r:18,behind:o.behind});dp_lock(ctx,100,NS_BH+96,60,"violet",0);ctx.restore();}
  ctx.restore();}
// the cyan glow round a badge where the platform vouches for it (k 0 to 1)
function ns_glow(ctx,x,y,w,h,k){if(!(k>0))return;const c=DP.F.cyan;dp_halo(ctx,x+w/2,y+h/2,Math.max(w,h)*0.85,"cyan",0.16*k);
  ctx.save();ctx.globalCompositeOperation="lighter";ctx.shadowColor=rgba(c,1);ctx.shadowBlur=34*k;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.4),0.9*k);ctx.lineWidth=4;rr(ctx,x-8,y-8,w+16,h+16,30);ctx.stroke();ctx.restore();}
// a clip from a badge's foot (x, y) down to the card under it
function ns_clipLine(ctx,x,y,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(200,236,240,0.85)";ctx.lineWidth=5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x-16,y-6);ctx.lineTo(x-16,y+40);ctx.moveTo(x+16,y-6);ctx.lineTo(x+16,y+40);ctx.stroke();rr(ctx,x-30,y+30,60,16,6);ctx.fillStyle="rgba(170,215,222,0.95)";ctx.fill();ctx.restore();}
// a sealed card (the secret), with "Pay the bearer" across it when o.bearer > 0; returns its box
function ns_secret(ctx,x,y,w,label,o){o=o||{};const bb=dp_sealed(ctx,x,y,w,label,o);if(o.bearer>0)ns_bearer(ctx,x+w-18,y-26,o.bearer*(o.a==null?1:o.a),{align:"right"});return bb;}
// "Pay the bearer": a slip of ice with dark-ink words, laid across bearer paper and, later, across a secret
function ns_bearer(ctx,x,y,a,o){o=o||{};if(!(a>0))return;const w=dp_tw(ctx,"Pay the bearer",{w:800,size:30})+56,h=62,x0=o.align==="right"?x-w:o.align==="center"?x-w/2:x;
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x0+w/2,y+h/2,lerp(0.8,1,ag_eo(a)));ctx.translate(x0+w/2,y+h/2);ctx.rotate(-0.035);ctx.translate(-x0-w/2,-y-h/2);
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=14;ctx.shadowOffsetY=4;rr(ctx,x0,y,w,h,10);ctx.fillStyle=rgba(NS_ICE,1);ctx.fill();ctx.restore();
  rr(ctx,x0+5,y+5,w-10,h-10,7);ctx.strokeStyle=rgba(mix(NS_ICE,[20,40,46],0.45),1);ctx.lineWidth=1.6;ctx.setLineDash([6,5]);ctx.stroke();ctx.setLineDash([]);
  dp_T(ctx,"Pay the bearer",x0+28,y+42,{w:800,size:30,col:DP.on});ctx.restore();}

/* ---------------------------------------------------------------- words on the frame */
// a chapter's kicker, top left, for its first seconds (from 1 s, once the chapter before has gone: its title card names the film too)
function ns_kick(ctx,S,t,name,t0,t1){const a=ag_in(t,t0==null?1.0:t0,0.6)*(1-ag_in(t,t1==null?6:t1,0.7));if(a>0)ns_scr(ctx,S,()=>dp_kicker(ctx,NS_TITLE,name,{a}));}
// a place and its year, top left, held in screen space while the camera moves
function ns_where(ctx,S,s,a){if(a>0)ns_scr(ctx,S,()=>dp_tag(ctx,64,52,s,NS_ICE,{a,size:30}));}
// draws fn in screen space from inside a shot (so it stays put while the camera moves, and dissolves with its shot)
function ns_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a card that springs in at t0 and leaves at t1 (null: stays)
function ns_card(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.45)*(t1==null?1:1-ag_in(t,t1,0.45));if(a<=0)return null;
  return dp_card(ctx,x,y,w,words,Object.assign({},o,{a,k:ag_spr(t,t0,0.7)}));}
function ns_pillAt(ctx,x,y,text,col,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a<=0)return;
  ctx.save();const k=lerp(0.6,1,ag_spr(t,t0,0.6)),w=dp_tw(ctx,text,{w:700,size:o.size||28})+36;const cx=o.align==="center"?x:o.align==="right"?x-w/2:x+w/2;
  ag_about(ctx,cx,y-12,k);dp_pill(ctx,x,y,text,col,Object.assign({},o,{a}));ctx.restore();}

/* ---------------------------------------------------------------- small things the chapters show */
// the clock on a pane: "02:00"
function ns_clock(ctx,x,y,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,250,112,{col:NS_ICE,r:18,glowR:30});
  dp_T(ctx,"02:00",x+125,y+78,{w:500,size:58,f:"mono",align:"center",ls:2});ctx.restore();}
// a short note with a seal, from where the job runs: whose it is (o.title), where from (o.from), and now (the federation rung); 470 x 176
function ns_note(ctx,x,y,a,t,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,470,176,{col:"green",r:16,glowR:30,behind:o.behind});
  dp_T(ctx,o.title||"registrar-loader",x+26,y+50,{w:700,size:30});dp_T(ctx,o.from||"from the build service",x+26,y+94,{w:600,size:28,col:"mut"});dp_T(ctx,"now",x+26,y+138,{w:700,size:28,col:"green"});
  dp_seal(ctx,x+408,y+112,46,t||1,1);dp_lock(ctx,x+408,y+116,34,"green",0);ctx.restore();}
// a pass the platform makes for one run: small, with no secret anyone keeps; its two facts tick on
function ns_pass(ctx,x,y,a,p1,p2){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,330,160,{col:"cyan",r:16,glowR:30});
  dp_T(ctx,"A pass",x+24,y+46,{w:800,size:30,col:"cyan"});dp_tick(ctx,x+44,y+90,"green",p1);dp_T(ctx,"One run",x+76,y+100,{w:700,size:28,a:ag_in(p1,0.3,0.4)});
  dp_tick(ctx,x+44,y+132,"green",p2);dp_T(ctx,"Under an hour",x+76,y+142,{w:700,size:28,a:ag_in(p2,0.3,0.4)});ctx.restore();}
// a vault for one secret: a pane with a lock, the sealed card inside it (o.label), turned over once as a machine changes it (turn 0 to 1)
// into a new one (o.label2)
function ns_vault(ctx,x,y,w,h,a,turn,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col:"violet",r:20,glowR:36,behind:o.behind});
  dp_T(ctx,o.title||"A vault",x+30,y+56,{w:800,size:30});dp_lock(ctx,x+w-56,y+50,46,"violet",o.open||0);
  const cx=x+w/2,cy=y+h*0.62,k=Math.cos(Math.PI*clamp(turn||0,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(Math.max(0.04,Math.abs(k)),1);ctx.translate(-cx,-cy);
  // turned edge-on, the card's words can't be read, and aren't meant to be: decoration for that moment (PH_OFF, the phone check's hook)
  const edge=Math.abs(k)<0.8;if(edge)PH_OFF++;try{dp_sealed(ctx,cx-(w-80)/2,cy-48,w-80,(turn||0)>0.5?(o.label2||"A new secret"):(o.label||"The job's secret"),{behind:o.behind});}finally{if(edge)PH_OFF--;}
  ctx.restore();ctx.restore();}
// a key that stays with the job (the certificate rung), and the signature it sends instead (sig 0 to 1, along the line to (bx, by))
function ns_key(ctx,x,y,s,col,a){if(!(a>0))return;const c=dp_f(col||"violet");ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.shadowColor=rgba(c,0.85);ctx.shadowBlur=12;
  ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.arc(-34,0,20,0,TAU);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(44,0);ctx.moveTo(30,0);ctx.lineTo(30,14);ctx.moveTo(42,0);ctx.lineTo(42,10);ctx.stroke();ctx.restore();}
function ns_signature(ctx,a,b,u,a0){if(!(u>0)||!(a0>0))return;ctx.save();ctx.globalAlpha*=a0;dp_link(ctx,a,b,"cyan",u,{dash:[10,8],dot:true});
  const p=[lerp(a[0],b[0],Math.min(1,u)),lerp(a[1],b[1],Math.min(1,u))];if(u<1){ctx.save();ctx.shadowColor=rgba(DP.F.cyan,1);ctx.shadowBlur=16;ctx.strokeStyle=rgba(mix(DP.F.cyan,[255,255,255],0.4),1);ctx.lineWidth=3.4;ctx.lineCap="round";
    ctx.beginPath();for(let i=0;i<=16;i++){const q=i/16,X=p[0]-34+q*44,Y=p[1]-6+Math.sin(q*TAU*1.5)*8*(1-q*0.4);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.stroke();ctx.restore();}ctx.restore();}
// a stamp that ends a secret: coral, "Ended", landing at k (0 to 1)
function ns_ended(ctx,x,y,k,a){if(!(k>0)||!(a>0))return;const s=lerp(1.7,1,ag_eo(Math.min(1,k*1.6))),al=Math.min(1,k*2.5)*a;ctx.save();ctx.globalAlpha*=al;ctx.translate(x,y);ctx.rotate(-0.12);ctx.scale(s,s);
  const w=dp_tw(ctx,"Ended",{w:800,size:36})+48;ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=14;rr(ctx,-w/2,-32,w,64,10);ctx.fillStyle=rgba(DP.F.coral,1);ctx.fill();ctx.shadowBlur=0;
  rr(ctx,-w/2+5,-27,w-10,54,7);ctx.strokeStyle=rgba(DP.on,0.55);ctx.lineWidth=2;ctx.stroke();dp_T(ctx,"Ended",0,13,{w:800,size:36,align:"center",col:DP.on});ctx.restore();}
// paper that's worth nothing now: a sealed card greyed, as old paper is
// an ended secret loses its colour: the card goes grey where it is (its light kept, so its words still stand out), and a little darker
function ns_grey(ctx,x,y,w,h,k){if(!(k>0))return;ctx.save();rr(ctx,x,y,w,h,18);ctx.globalCompositeOperation="saturation";ctx.fillStyle=`rgba(128,128,128,${clamp(k,0,1).toFixed(3)})`;ctx.fill();
  ctx.globalCompositeOperation="source-over";ctx.fillStyle=`rgba(4,10,14,${(0.22*clamp(k,0,1)).toFixed(3)})`;ctx.fill();ctx.restore();}
// a small pane holding a copy of the secret: where it was found, and the sealed card in it; 470 x 190
const NS_CPW=470,NS_CPH=190;
function ns_copyPane(ctx,x,y,title,a,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,NS_CPW,NS_CPH,{col:NS_ICE,r:18,glowR:28,behind:o.behind});
  dp_T(ctx,title,x+26,y+46,{w:700,size:30});const k=o.card==null?1:o.card;if(k>0){ctx.save();ctx.globalAlpha*=k;dp_sealed(ctx,x+20,y+70,NS_CPW-40,"Jun Park's token",{behind:o.behind});ctx.restore();}
  if(o.ended>0){ns_grey(ctx,x+20,y+70,NS_CPW-40,96,o.ended);ns_ended(ctx,x+NS_CPW-92,y+38,o.ended,1);}ctx.restore();}

/* ===== No secret to lose: the two ladders =====
   The ways a job proves who it is, from worst to best, by who holds a secret and for how long (Who holds a secret?, Up the ladder), and
   the same for people (A ladder for people). Each ladder stands at the right of its room, rungs of frosted glass between two rails of
   light, worst at the bottom; what each rung means is drawn at the left, one picture at a time. A lower rung carries a sealed card at its
   right end, smaller as the ladder climbs; the top two of the job's ladder carry none. Rung k is 0 at the bottom. */

const NS_RAIL=[868,1832];
// the job's ladder: six rungs; the people's: five
const NS_WL={x:884,w:932,h:108,step:126,y0:764,rungs:[
  {name:"A person's token, or a shared password",pill:"A person · no end date",col:"coral",card:212},
  {name:"A token of the job's own",pill:"The job · often no end date",col:NS_ICE,card:178},
  {name:"A secret in a vault, changed by a machine",pill:"A vault · a month",col:NS_ICE,card:146},
  {name:"A certificate",pill:"The job · a year",col:NS_ICE,card:116},
  {name:"A note from where it runs",pill:"Nobody · one run",col:"green"},
  {name:"An identity the platform gives it",pill:"Nobody · one run",col:"green"}]};
const NS_PL={x:884,w:932,h:118,step:146,y0:752,rungs:[
  {name:"A shared account",col:"coral",card:212},
  {name:"A password alone",col:NS_ICE,card:178},
  {name:"A code by text",col:NS_ICE,card:146},
  {name:"An app on your phone",col:NS_ICE,card:116},
  {name:"A passkey or a security key",col:"green"}]};
const ns_rungY=(L,k)=>L.y0-k*L.step;
// the rails, drawn on from the floor up (u 0 to 1)
function ns_rails(ctx,L,u,a){if(!(u>0)||!(a>0))return;const top=ns_rungY(L,L.rungs.length-1)-28,bot=L.y0+L.h+24,y=lerp(bot,top,ag_sine(u));ctx.save();ctx.globalAlpha*=a;
  for(const x of NS_RAIL){const g=ctx.createLinearGradient(0,y,0,bot);g.addColorStop(0,rgba(DP.ice,0.9));g.addColorStop(1,rgba(DP.ice,0.35));ctx.save();ctx.shadowColor=rgba(DP.ice,0.7);ctx.shadowBlur=14;
    ctx.fillStyle=g;rr(ctx,x-5,y,10,bot-y,5);ctx.fill();ctx.restore();}ctx.restore();}
/* one rung: in (0 to 1, springs it in), its words (0 to 1), its sealed card (0 to 1), lit (0 to 1, a glow in its colour), dim (0 to 1) */
function ns_rung(ctx,L,k,o){o=o||{};const R=L.rungs[k],y=ns_rungY(L,k),a=(o.in==null?1:o.in)*(1-0.7*(o.dim||0));if(!(a>0))return;const col=R.col;
  ctx.save();ctx.globalAlpha*=a;const s=lerp(0.92,1,ag_eo(o.in==null?1:o.in));ag_about(ctx,L.x+L.w/2,y+L.h/2,s);
  if(o.lit>0)dp_halo(ctx,L.x+L.w/2,y+L.h/2,L.w*0.6,col,0.18*o.lit);
  dp_panel(ctx,L.x,y,L.w,L.h,{col,r:18,glowR:o.lit>0?50:28,glowA:1+(o.lit||0)});
  const wa=o.words==null?1:o.words;if(wa>0){const one=!R.pill;dp_T(ctx,R.name,L.x+30,y+(one?L.h/2+12:46),{w:700,size:one?34:32,a:wa});
    if(R.pill)dp_pill(ctx,L.x+30,y+92,R.pill,col===NS_ICE?"violet":col==="coral"?"violet":"green",{a:wa,glow:10});}
  const ca=o.card==null?1:o.card;if(R.card&&ca>0)ns_cardIcon(ctx,L.x+L.w-26-R.card,y+L.h/2-R.card*0.24,R.card,ca);
  ctx.restore();}
// a sealed card too small to read: a secret, shown by its frost and lock alone (no words, so the checks don't count it)
function ns_cardIcon(ctx,x,y,w,a){if(!(a>0))return;const h=w*0.48;ctx.save();ctx.globalAlpha*=a;dp_frost(ctx,x,y,w,h,null,{r:12});dp_lock(ctx,x+h*0.52,y+h*0.5,h*0.56,"violet",0);
  ctx.fillStyle="rgba(225,238,245,0.55)";rr(ctx,x+h*0.98,y+h*0.36,w-h*1.3,7,3.5);ctx.fill();rr(ctx,x+h*0.98,y+h*0.58,(w-h*1.3)*0.66,7,3.5);ctx.fill();ctx.restore();}
// the whole ladder: rails, then each rung as o.rung(k) says ({in, words, card, lit, dim}), bottom first
function ns_ladder(ctx,L,o){o=o||{};ns_rails(ctx,L,o.rails==null?1:o.rails,o.a==null?1:o.a);for(let k=0;k<L.rungs.length;k++){const r=o.rung?o.rung(k):{};if(r)ns_rung(ctx,L,k,Object.assign({},r,{in:(r.in==null?1:r.in)*(o.a==null?1:o.a)}));}}
// the green band beside the top two rungs: "Nobody holds a secret"
function ns_goal(ctx,L,a){if(!(a>0))return;const y1=ns_rungY(L,5),y0=ns_rungY(L,4)+L.h,cy=(y1+y0)/2;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.strokeStyle=rgba(DP.F.green,1);ctx.shadowColor=rgba(DP.F.green,0.8);ctx.shadowBlur=10;ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();
  ctx.moveTo(L.x-26,y1+8);ctx.lineTo(L.x-46,y1+8);ctx.lineTo(L.x-46,y0-8);ctx.lineTo(L.x-26,y0-8);ctx.moveTo(L.x-46,cy);ctx.lineTo(L.x-70,cy);ctx.stroke();ctx.restore();
  const w=dp_tw(ctx,"Nobody holds a secret",{w:700,size:30})+36;ag_about(ctx,L.x-80-w/2,cy,lerp(0.7,1,ag_eo(a)));dp_pill(ctx,L.x-80,cy+12,"Nobody holds a secret","green",{size:30,align:"right"});ctx.restore();}

/* ---------------------------------------------------------------- what each rung means, drawn at the left (x 150 to 800) */
// a small platform: a block of clear glass with a lit door, at the right of the pictures (the door lights brighter by k)
const NS_MP={x:590,y:236,w:200,h:420};
function ns_miniPlatform(ctx,a,k,o){o=o||{};if(!(a>0))return;const P=NS_MP,D={x:P.x+60,y:P.y+P.h-150,w:80,h:150};ctx.save();ctx.globalAlpha*=a;
  dp_halo(ctx,P.x+P.w/2,P.y+P.h/2,P.w*1.1,"cyan",0.07);ctx.save();rr(ctx,P.x,P.y,P.w,P.h,8);ctx.fillStyle="rgba(10,34,40,0.72)";ctx.fill();ctx.clip();
  const R=ag_rnd(77);for(let f=0;f<6;f++)for(let j=0;j<3;j++){ctx.fillStyle=rgba(DP.F.cyan,0.10+0.14*R());rr(ctx,P.x+20+j*58,P.y+34+f*40,40,8,4);ctx.fill();}
  const g=ctx.createLinearGradient(0,D.y,0,D.y+D.h);g.addColorStop(0,"rgba(150,232,242,0.28)");g.addColorStop(1,"rgba(200,250,250,0.5)");ctx.fillStyle=g;ctx.fillRect(D.x,D.y,D.w,D.h);ctx.restore();
  ctx.save();ctx.shadowColor=rgba(DP.ice,0.8);ctx.shadowBlur=10;ctx.strokeStyle=rgba(DP.ice,0.8);ctx.lineWidth=2;rr(ctx,P.x+1,P.y+1,P.w-2,P.h-2,8);ctx.stroke();ctx.restore();
  ctx.strokeStyle=rgba(DP.F.cyan,0.9);ctx.lineWidth=2;ctx.strokeRect(D.x,D.y,D.w,D.h);
  if(k>0){dp_halo(ctx,D.x+D.w/2,D.y+D.h/2,150,"cyan",0.25*k);ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=rgba(DP.F.cyan,0.25*k);ctx.fillRect(D.x,D.y,D.w,D.h);ctx.restore();}
  if(o.label!==false)dp_T(ctx,"The platform",P.x+P.w/2,P.y-22,{w:700,size:28,align:"center",col:"cyan"});ctx.restore();}
const NS_MPDOOR=[NS_MP.x+100,NS_MP.y+NS_MP.h-75];
// the job's badge, small (no words), where the pictures put it
function ns_jobSmall(ctx,x,y,s,a,t,o){ns_badgeMini(ctx,x,y,s,Object.assign({t,a},o||{}));}
// a person's outline, large, behind the job (the bottom rung: the job runs as someone else)
function ns_ghost(ctx,x,y,s,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a*0.85;ctx.translate(x,y);ctx.scale(s,s);dp_personPic(ctx,0,0,"coral");ctx.restore();}

/* ===== No secret to lose: what the ladders' pictures and the people's chapter show =====
   Drawn live, in the module's colours: a phone of glass and what its screen shows, a fake page (coral: what a thief set up) and the
   real one (cyan), the face and the fingerprint that unlock a passkey, the half of a key the platform keeps, the build service, the
   faces behind a shared account, a number moved to a thief's phone, and the streets' walkers. A secret is only ever a sealed card,
   or, too small to read, its frost and lock; no character of one is ever drawn. Every word is drawn with dp_T, at least 28 px. */

/* ---------------------------------------------------------------- the City's walkers, crossing the street from door to door */
// w: {Z depth in metres, X0 and X1 where he steps out and in (metres from the street's middle), t0 when he steps out, v metres a second,
// ph his step's phase, case 0 or 1}; he fades in and out at the doors
function ns_cross(ctx,t,w,o){o=o||{};const dir=Math.sign(w.X1-w.X0),L=Math.abs(w.X1-w.X0),d=(t-w.t0)*(w.v||1.4);if(d<0||d>L)return;
  const X=w.X0+dir*d,p=ns_streetPoint(X,0,w.Z),s=820*1.75/w.Z,a=Math.min(1,d/0.9,(L-d)/0.9)*(o.a==null?1:o.a);
  ns_walker(ctx,p[0],p[1],s,d/1.5+(w.ph||0),{a,case:w.case==null?(o.case==null?1:o.case):w.case,dir,rim:dir});}
// the morning's messengers, crossing one after another; o.case 0 when they carry nothing
const NS_WALKERS=[{Z:16,X0:-9.4,X1:9.4,t0:0,v:1.45,ph:0.1},{Z:11,X0:9.4,X1:-9.4,t0:2.6,v:1.35,ph:0.6},{Z:24,X0:-9.4,X1:9.4,t0:4.4,v:1.5,ph:0.3},
  {Z:19,X0:9.4,X1:-9.4,t0:9.0,v:1.4,ph:0.8},{Z:28,X0:9.4,X1:-9.4,t0:12.5,v:1.5,ph:0.45},{Z:14,X0:-9.4,X1:9.4,t0:15.0,v:1.4,ph:0.2}];
function ns_walkers(ctx,t,t0,o){o=o||{};for(const w of NS_WALKERS){if(o.far&&w.Z<o.far)continue;ns_cross(ctx,t,Object.assign({},w,{t0:t0+w.t0}),o);}}

/* ---------------------------------------------------------------- a phone of glass */
// a phone, w x h, its screen drawn by draw(ctx, x, y, w, h) inside it; o.col its rim (cyan, or coral for a thief's)
function ns_phone(ctx,x,y,w,h,a,draw,o){o=o||{};if(!(a>0))return;const col=dp_f(o.col||NS_ICE);ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(col,0.4);ctx.shadowBlur=30;rr(ctx,x,y,w,h,34);ctx.fillStyle="rgb(8,22,28)";ctx.fill();ctx.restore();
  rr(ctx,x+1,y+1,w-2,h-2,34);ctx.strokeStyle=rgba(mix(col,[255,255,255],0.35),0.95);ctx.lineWidth=2.4;ctx.stroke();
  const sx=x+14,sy=y+40,sw=w-28,sh=h-70;ctx.save();rr(ctx,sx,sy,sw,sh,18);ctx.clip();const g=ctx.createLinearGradient(sx,sy,sx,sy+sh);g.addColorStop(0,"rgb(16,40,48)");g.addColorStop(1,"rgb(10,28,34)");ctx.fillStyle=g;ctx.fillRect(sx,sy,sw,sh);
  const hg=ctx.createLinearGradient(sx,sy,sx+sw,sy+sh);hg.addColorStop(0,"rgba(220,250,250,0.10)");hg.addColorStop(0.4,"rgba(220,250,250,0)");ctx.fillStyle=hg;ctx.fillRect(sx,sy,sw,sh);
  if(draw)draw(ctx,sx,sy,sw,sh);ctx.restore();
  ctx.fillStyle=rgba(mix(col,[255,255,255],0.3),0.6);rr(ctx,x+w/2-34,y+18,68,8,4);ctx.fill();ctx.restore();}
// the phone in Mei's hand, small and with no words (figure space, over her near hand): its screen lit cyan
function ns_heldPhone(c,h){const [x,y]=h.near;c.save();c.translate(x+6,y-118);c.rotate(-0.08);c.save();c.shadowColor="rgba(72,222,244,0.5)";c.shadowBlur=24;rr(c,-34,-6,92,170,16);c.fillStyle="rgb(10,24,30)";c.fill();c.restore();
  rr(c,-34,-6,92,170,16);c.strokeStyle="rgba(200,240,244,0.9)";c.lineWidth=2.4;c.stroke();rr(c,-26,6,76,140,10);const g=c.createLinearGradient(0,6,0,146);g.addColorStop(0,"rgba(72,222,244,0.55)");g.addColorStop(1,"rgba(72,222,244,0.2)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(230,255,255,0.85)";c.lineWidth=3;c.beginPath();c.arc(12,60,14,0,TAU);c.stroke();c.beginPath();c.moveTo(26,60);c.lineTo(42,60);c.moveTo(36,60);c.lineTo(36,68);c.stroke();c.restore();}

/* ---------------------------------------------------------------- the face and the fingerprint that unlock a passkey */
function ns_faceIcon(ctx,x,y,r,col,a){if(!(a>0))return;const c=dp_f(col||"cyan");ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.lineWidth=3.4;ctx.lineCap="round";
  const k=r*0.42;for(const [sx,sy] of [[-1,-1],[1,-1],[1,1],[-1,1]]){ctx.beginPath();ctx.moveTo(x+sx*r,y+sy*(r-k));ctx.lineTo(x+sx*r,y+sy*r);ctx.lineTo(x+sx*(r-k),y+sy*r);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(x-r*0.32,y-r*0.3);ctx.lineTo(x-r*0.32,y-r*0.14);ctx.moveTo(x+r*0.32,y-r*0.3);ctx.lineTo(x+r*0.32,y-r*0.14);ctx.moveTo(x+r*0.02,y-r*0.22);ctx.lineTo(x+r*0.02,y+r*0.08);ctx.lineTo(x-r*0.1,y+r*0.08);ctx.stroke();
  ctx.beginPath();ctx.arc(x,y+r*0.12,r*0.36,0.35,Math.PI-0.35);ctx.stroke();ctx.restore();}
function ns_fingerIcon(ctx,x,y,r,col,a){if(!(a>0))return;const c=dp_f(col||"cyan");ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.lineWidth=3;ctx.lineCap="round";
  for(let i=0;i<5;i++){const rr2=r*(0.22+i*0.19);ctx.beginPath();ctx.ellipse(x,y+r*0.12,rr2*0.82,rr2,0,Math.PI*(1.05+i*0.02),Math.PI*(1.95-i*0.06)+(i%2?0.5:0.9));ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- pages: the real site, and a fake one */
// a page of glass: its name (coral for a fake), and a field where a sign-in would go; o.draw(x, y, w, h) draws what arrives in the field
function ns_page(ctx,x,y,w,h,title,col,a,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col,r:18,glowR:34,behind:o.behind});
  dp_T(ctx,title,x+26,y+48,{w:700,size:30});const fy=y+70,fh=h-96;ctx.save();rr(ctx,x+24,fy,w-48,fh,12);ctx.fillStyle="rgba(4,14,18,0.55)";ctx.fill();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(dp_f(col),0.55);ctx.lineWidth=2;ctx.stroke();ctx.restore();
  if(o.draw)o.draw(x+24,fy,w-48,fh);ctx.restore();}

/* ---------------------------------------------------------------- the half of a key the platform keeps */
// the bow and half the blade of a key, drawn in outline: it opens nothing on its own
function ns_halfKey(ctx,x,y,s,a){if(!(a>0))return;const c=DP.F.cyan;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=12;
  ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.arc(-40,0,22,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(16,0);ctx.stroke();
  ctx.setLineDash([7,9]);ctx.globalAlpha*=0.5;ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(54,0);ctx.moveTo(40,0);ctx.lineTo(40,14);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the build service: a block of glass with a gear, where the job's code is built (or, label, where a job runs) */
function ns_builder(ctx,x,y,a,t,label){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,330,150,{col:NS_ICE,r:18,glowR:30});
  ctx.save();ctx.translate(x+70,y+82);ctx.rotate((t||0)*0.6);dp_gear(ctx,0,0,30);ctx.fillStyle=rgba(DP.F.cyan,0.3);ctx.fill("evenodd");ctx.lineWidth=2;ctx.strokeStyle=rgba(mix(DP.F.cyan,[255,255,255],0.4),1);ctx.stroke();ctx.restore();
  dp_T(ctx,label||"Build service",x+124,y+92,{w:700,size:label?28:30});ctx.restore();}

/* ---------------------------------------------------------------- people's pictures for the people's ladder */
// a shared account: one card, three people behind it, and nobody can tell which of them did what
function ns_shared(ctx,x,y,a,k){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<3;i++){const px=x+90+i*150,py=y+70;ctx.save();ctx.globalAlpha*=0.9;ctx.translate(px,py);ctx.scale(1.25,1.25);dp_personPic(ctx,0,0,"coral");ctx.restore();}
  dp_panel(ctx,x+30,y+140,500,120,{col:"coral",r:18,glowR:30});dp_T(ctx,"One account",x+60,y+190,{w:700,size:30});dp_T(ctx,"three people",x+60,y+234,{w:600,size:28,col:"mut"});
  ctx.restore();}
// a number that moves to a thief's phone: a pill that leaves one phone for the other (u 0 to 1)
function ns_numberMove(ctx,a0,b0,u,a){if(!(a>0)||!(u>0))return;const e=ag_sine(u),x=lerp(a0[0],b0[0],e),y=lerp(a0[1],b0[1],e)-Math.sin(Math.PI*e)*60;
  ctx.save();ctx.globalAlpha*=a;dp_pill(ctx,x,y,"Your number",u<0.5?"violet":"coral",{align:"center"});ctx.restore();}
// a card that arrives and holds nothing: a dashed outline
function ns_emptyCard(ctx,x,y,w,h,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(DP.F.coral,0.9);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,14);ctx.stroke();ctx.restore();}
// a dashed line along which something passes on (a fake page relaying), drawn on by p
function ns_relay(ctx,a,b,p,col,al){if(!(al>0))return;ctx.save();ctx.globalAlpha*=al;dp_link(ctx,a,b,col||"coral",p,{dash:[10,9],dot:false});ctx.restore();}

/* ===== No secret to lose: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (ns_kit.js); what moves is drawn live in the shots of ag_shots. In one room the camera glides and only what changes fades: the hall
   at the end of Kept in the Bank's records glides on into Jun's token, and the ladder's room into Up the ladder (ag_cutInto, at the
   end). Between rooms the picture dissolves, since the whole picture changes there and nothing in it shows twice. The places and years
   of 1990 and the kickers are drawn in the frame, outside the shots, so they stay put and keep their size whatever the camera does; so
   are the cards over a shot whose camera is close in. Nothing is drawn under y 890, where the captions go. */

// the job's badge far off, at the platform's door; close, at the middle of the hall; and the sealed card clipped under it
const NS_MINI={x:1433,y:690,s:0.24},NS_B={x:640,y:250},NS_SC={x:670,y:662,w:540};
// shown from t0 (over d), put away from t1 (over d2)
const ns_on=(t,t0,t1,d,d2)=>ag_in(t,t0,d||0.5)*(t1==null?1:1-ag_in(t,t1,d2||d||0.5));
// the job's badge on its way from the door (u 0) to the middle of the hall (u 1), with no words; its words (w) come in once it's there
function ns_job(ctx,t,u,w,o){o=o||{};const e=ag_sine(u),x=lerp(NS_MINI.x,NS_B.x,e),y=lerp(NS_MINI.y,NS_B.y,e),s=lerp(NS_MINI.s,1,e),a=o.a==null?1:o.a;if(!(a>0))return;
  if(!(u>=1&&w>=1))ns_badgeMini(ctx,x,y,s,{t,a,glow:o.glow,card:o.card});
  if(u>=1&&w>0)ns_badge(ctx,NS_B.x,NS_B.y,{t,a:a*w,glow:o.glow});}
// the sealed card under the job's badge: clipped to it (clip), Jun's token, with "Pay the bearer" beside it (bearer)
function ns_junsCard(ctx,a,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;if(o.clip>0)ns_clipLine(ctx,NS_B.x+NS_BW/2,NS_B.y+NS_BH,o.clip);
  if(o.glow>0)dp_halo(ctx,NS_SC.x+NS_SC.w/2,NS_SC.y+60,420,"violet",0.22*o.glow);
  dp_sealed(ctx,NS_SC.x,NS_SC.y,NS_SC.w,"Jun Park's token",{sub:"Personal · Jun's rights",revoked:o.revoked});
  if(o.grey>0)ns_grey(ctx,NS_SC.x,NS_SC.y,NS_SC.w,120,o.grey);
  if(o.ended>0)ns_ended(ctx,NS_SC.x+NS_SC.w+96,NS_SC.y+60,o.ended,1);
  if(o.bearer>0)ns_bearer(ctx,NS_SC.x+NS_SC.w+22,NS_SC.y+28,o.bearer);ctx.restore();}
// the papers on a pane of glass, top right of the street: fanned (fan), "Pay the bearer" across them (bearer), carried off one by one (gone)
const NS_PP={x:1230,y:96,w:600,h:330};
function ns_papersPane(ctx,a,o){o=o||{};if(!(a>0))return;const P=NS_PP,u=o.fan==null?1:o.fan,g=o.gone||0;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,P.x,P.y,P.w,P.h,{col:o.col||NS_ICE,r:20,glowR:36,glowA:o.col==="coral"?1.6:1});
  ctx.save();rr(ctx,P.x+4,P.y+4,P.w-8,P.h-8,17);ctx.clip();const n=5,cx=P.x+P.w/2,cy=P.y+P.h/2+8,w=250;
  for(let i=0;i<n;i++){const k=i-(n-1)/2,q=clamp(g*1.8-(n-1-i)*0.2,0,1),e=ag_sine(q),rot=k*0.12*u+e*0.5,dx=k*w*0.16*u+e*(160+i*40),dy=Math.abs(k)*8*u-e*(220+i*30),P2=ns_paperPic(i,w);
    if(q>=1)continue;ctx.save();ctx.globalAlpha*=1-q;ctx.translate(cx+dx,cy+dy);ctx.rotate(rot);ctx.drawImage(P2,-P2.width/2,-P2.height/2);ctx.restore();}
  ctx.restore();if(o.bearer>0)ns_bearer(ctx,P.x+P.w-26,P.y+P.h-86,o.bearer,{align:"right"});ctx.restore();}
// a few places far off in the hall, lighting one after another, from which a copy of the token could be used (k: how many are lit)
const NS_FAR=[[96,236],[388,206],[1010,118],[560,132],[150,330],[1170,180]];
function ns_anywhere(ctx,k,a){if(!(a>0))return;NS_FAR.forEach(([x,y],i)=>{const q=clamp(k-i,0,1);if(q<=0)return;ctx.save();ctx.globalAlpha*=a*ag_eo(q);
  dp_halo(ctx,x+60,y+28,110,"violet",0.22);ns_cardIcon(ctx,x,y,120,1);ctx.restore();});}
// three panes, each with a copy of the token, as Sam finds them (k[i] 0 to 1), stamped "Ended" and greyed (ended[i])
const NS_COPIES=[["The job's settings",1370,104],["An old notebook",1370,312],["Jun's laptop",1370,520]];
function ns_copies(ctx,k,ended,a){NS_COPIES.forEach(([s,x,y],i)=>{const q=k[i];if(!(q>0))return;ctx.save();ag_about(ctx,x+NS_CPW/2,y+NS_CPH/2,lerp(0.9,1,ag_spr(q,0,0.7)));
  ns_copyPane(ctx,x+(1-ag_eo(q))*60,y,s,ag_in(q,0,0.6)*(a==null?1:a),{ended:ended?ended[i]:0});ctx.restore();});}
// the platform, its name and its door
function ns_platform(ctx,la,door){ns_platformLabel(ctx,la);ns_door(ctx,door);}

/* ---------------------------------------------------------------- 1 · Bearer paper */
scene("city",(ctx,S,t,sc)=>{const C=sc.cues,
  tPaper=wAt(sc,"paper","money markets"),tPromise=wAt(sc,"promise","promises"),tMsg=wAt(sc,"walks","a messenger"),tBack=wAt(sc,"walks","comes back"),
  tBearer=wAt(sc,"bearer","bearer"),tHolds=wAt(sc,"bearer","whoever"),tMan=wAt(sc,"morning","a man"),tTakes=wAt(sc,"morning","takes"),
  t301=wAt(sc,"inside","three hundred"),tWorth=wAt(sc,"inside","worth"),tCash=wAt(sc,"cash","as good as cash"),tGone=wAt(sc,"gone","the money is gone"),
  tEvery=wAt(sc,"every","every messenger"),tChange=wAt(sc,"change","stop being");
  const tQ=C.morning-0.3,tW0=tQ,tStop=tTakes-0.25,tMap=C.every-0.3;
  // the messenger of the quiet street walks left at the pulse's pace (a step every 0.6 s), out of the frame before the camera reaches
  // the wall, and stops there; the case is gone when the camera comes back
  const walkX=tt=>2.0-1.25*(Math.min(tt,tStop)-tW0);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsStreet",keys:[[0,960,505,1.14],[C.london+1.0,960,540,1.0]],d:3.4,push:0.02,draw:(c,tt)=>{
      ns_walkers(c,tt,tPaper-2.2,{});
      // the messenger who walks a sale across, the route ahead of him, and the payment coming back along it
      const A=ns_streetPoint(-9.4,1.0,10),B=ns_streetPoint(9.4,1.0,10),ra=ns_on(tt,tMsg+0.3,tBearer-0.2,0.5,0.6);
      if(ra>0){c.save();c.globalAlpha*=ra;dp_link(c,A,B,NS_ICE,ag_sine(clamp((tt-tMsg-0.3)/1.6,0,1)),{dash:[10,10],alpha:0.85});c.restore();}
      const pu=clamp((tt-tBack)/2.4,0,1);if(pu>0&&ra>0){const e=ag_sine(pu);dp_slip(c,lerp(B[0]-40,A[0]+120,e),A[1]-86,"Payment",NS_ICE,{size:28,align:"center",ink:true,a:ra*ag_in(pu,0,0.15)});}
      ns_cross(c,tt,{Z:10,X0:-9.4,X1:9.4,t0:tMsg,v:1.5,ph:0.15});
      // the papers, their promise, and who may cash them
      ns_papersPane(c,ns_on(tt,tPromise,C.morning-1.0,0.6,0.6),{fan:ag_sine(clamp((tt-tPromise-0.2)/1.4,0,1)),bearer:ag_in(tt,tBearer,0.4)});
      ns_card(c,620,110,560,{title:"A promise to pay",sub:"A set sum, on a set day"},tt,tPromise+0.6,tMsg-0.2);
      ns_card(c,620,110,560,{title:"Whoever holds it",sub:"can cash it"},tt,tHolds,C.morning-1.0);}},
    {at:tQ,place:"nsQuiet",dis:0.8,keys:[[0,960,540,1.0],[tMan-0.7,1320,430,1.6],[tTakes+1.4,760,560,1.3]],d:2.0,push:0,draw:(c,tt)=>{
      const X=walkX(tt),p=ns_streetPoint(X,0,10),ph=(Math.min(tt,tStop)-tW0)/1.2+0.25;
      ns_walker(c,p[0],p[1],143.5,ph,{case:1-ag_in(tt,tTakes+0.1,0.2),dir:-1,rim:-1});
      // a shadow crosses the wall, thrown by the lamp behind someone who comes up to him
      const su=clamp((tt-tTakes+0.6)/2.0,0,1);if(su>0&&su<1)ns_shadow(c,lerp(15,10.8,ag_sine(su)),Math.min(1,Math.sin(Math.PI*su)*1.6));
      ns_pillAt(c,p[0]+34,p[1]-46,"Taken","coral",tt,tTakes+2.4,tMap-0.6,{size:30});
      // what was in the case, in the frame (the camera is close in)
      ns_scr(c,S,()=>{const pa=ns_on(tt,t301-0.1,tMap-0.7,0.6,0.6);ns_papersPane(c,pa,{col:"coral",bearer:ag_in(tt,tCash,0.4),gone:clamp((tt-tGone-0.3)/2.2,0,1)});
        ns_card(c,NS_PP.x,NS_PP.y+NS_PP.h+22,NS_PP.w,{title:"301 bills and certificates",sub:"Worth £292 million"},tt,tWorth,tMap-0.7,{col:"coral"});});}},
    {at:tMap,place:"nsMap",dis:0.8,keys:[[0,990,600,1.3],[tMap+0.2,960,540,1.0]],d:3.6,push:0.02,draw:(c,tt)=>{
      // every messenger's case, moving along the City's streets, until they slow and stop
      const R=ag_rnd(9),slow=tChange+0.3,dt=tt-tMap,go=dt<slow-tMap?dt:(slow-tMap)+1.2*ag_eo(clamp((tt-slow)/2.4,0,1))*1.0;
      for(let i=0;i<30;i++){const st=NS_MAP.streets[i%NS_MAP.streets.length],u0=R(),v=(0.022+R()*0.03)*(R()<0.5?1:-1),u=((u0+v*go)%1+1)%1,q=ns_mapAt(st,u);ns_mapCase(c,q[0],q[1],1,0.9);}}}],0.8);
  ns_where(ctx,S,"The City of London · 1990",ns_on(t,0.6,sc.dur-1.6,0.6,0.6));});

// the shadow of someone who isn't shown, thrown up the quiet street's right-hand wall by the lamp behind him: long, and growing as he
// comes nearer (Z his depth along the street; a its strength)
function ns_shadow(ctx,Z,a){if(!(a>0))return;const X=7.5,base=ns_streetPoint(X,0,Z),top=ns_streetPoint(X,4.6,Z+1.2),w=820*0.5/Z,h=base[1]-top[1],x=base[0];ctx.save();ctx.globalAlpha*=a*0.8;
  ctx.filter="blur(5px)";ctx.fillStyle="rgb(3,8,10)";
  ctx.beginPath();ctx.ellipse(top[0]+w*0.1,top[1]+h*0.07,w*0.4,h*0.07,-0.12,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(top[0]-w*0.75,top[1]+h*0.17);ctx.quadraticCurveTo(top[0],top[1]+h*0.11,top[0]+w*0.8,top[1]+h*0.18);ctx.lineTo(x+w*0.55,base[1]-h*0.01);ctx.lineTo(x-w*0.5,base[1]);ctx.closePath();ctx.fill();
  ctx.filter="none";ctx.restore();}

/* ---------------------------------------------------------------- 2 · Kept in the Bank's records */
scene("bank",(ctx,S,t,sc)=>{const C=sc.cues,
  tCmo=wAt(sc,"opens","Central Money Markets Office"),tStays=wAt(sc,"vault","stays there"),tKept=wAt(sc,"records","kept"),
  tSale=wAt(sc,"sale","changes the record"),tBoth=wAt(sc,"sale","both sides"),tFirst=wAt(sc,"first","Forty-four"),tWhy=wAt(sc,"why","why"),
  tEmpty=wAt(sc,"streets","off the streets"),tToo=wAt(sc,"too","bearer paper"),tYou=wAt(sc,"too","whoever holds it"),tJob=wAt(sc,"job","a nightly job"),
  tCarry=wAt(sc,"nobody","carry a secret");
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsFront",keys:[[0,960,560,1.06]],push:0.03,draw:(c,tt)=>{
      ns_scr(c,S,()=>ns_card(c,520,118,880,{kick:"1 October 1990",title:"The Central Moneymarkets Office",sub:"Opened by the Bank of England"},tt,tCmo,C.vault-1.0));}},
    {at:C.vault-0.3,place:"nsVault",dis:0.8,keys:[[0,960,520,1.0],[tStays,960,500,1.1]],d:2.6,push:0,draw:(c,tt)=>{
      ns_vaultDoor(c,clamp((tt-tStays)/1.8,0,1));
      ns_scr(c,S,()=>dp_slip(c,960,64,"The paper stays at the Bank",NS_ICE,{align:"center",ink:true,a:ns_on(tt,tStays+1.4,C.records-1.0,0.5,0.5)}));}},
    {at:C.records-0.3,place:"nsOffice",dis:0.8,keys:[[0,1020,470,1.08]],push:0.02,draw:(c,tt)=>{
      ns_screen(c,tt,{rows:tKept,sale:tSale,both:tBoth,done:tBoth+4.4});
      ns_scr(c,S,()=>{ns_card(c,1552,186,340,{title:"44 firms",sub:"from the first day"},tt,tFirst,tWhy-0.4);
        ns_card(c,420,596,1080,{kick:"The Bank of England, 1990",title:"“…avoiding the risks and expense of moving paper physically around the City.”"},tt,tWhy+0.3,C.streets-1.0,{col:NS_ICE});});}},
    {at:C.streets-0.3,place:"nsStreet",dis:0.8,keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      ns_walkers(c,tt,C.streets-6.0,{case:0});
      ns_scr(c,S,()=>dp_slip(c,960,160,"No paper in their hands",NS_ICE,{align:"center",ink:true,a:ns_on(tt,tEmpty,C.too-0.9,0.5,0.5)}));}},
    {at:C.too-0.4,place:"nsHall",dis:0.8,keys:[[0,900,540,1.0],[tJob-0.1,1182,600,1.3],[C.breath-0.6,960,540,1.0]],d:2.4,push:0,draw:(c,tt)=>{
      // a sign-in secret is bearer paper too
      const ka=ns_on(tt,tToo-0.5,tJob-0.5,0.6,0.6);if(ka>0){c.save();c.globalAlpha*=ka;ag_about(c,640,410,lerp(0.9,1,ag_spr(tt,tToo-0.5,0.7)));
        dp_sealed(c,320,362,640,"A password, a token or a key",{});ns_bearer(c,960-24,330,ag_in(tt,tToo+0.3,0.4),{align:"right"});
        dp_pill(c,640,560,"Whoever holds it, is you","cyan",{align:"center",size:30,a:ag_in(tt,tYou,0.4)});c.restore();}
      // and the nightly job still carries one, to the platform's door; until nobody has to carry a secret at all
      ns_door(c,0.5*ag_in(tt,tJob,0.8)+0.5*ag_in(tt,tCarry,0.8));
      ns_badgeMini(c,NS_MINI.x,NS_MINI.y,NS_MINI.s,{t:tt,a:ag_in(tt,tJob,0.6),card:1-ag_in(tt,tCarry+0.2,0.9)});}}],0.8);
  // the place and its year, in the frame: the Bank's, then the City's
  ns_where(ctx,S,"The Bank of England · 1990",ns_on(t,0.6,C.streets-0.9,0.6,0.5));
  ns_where(ctx,S,"The City of London · 1990",ns_on(t,C.streets+0.2,C.too-0.9,0.5,0.5));
  dp_title(ctx,S,t,C.breath,NS_TITLE,null,NS_LINE);});

// the back office's screen: the papers, each with its owner; a sale; both sides' acceptance; the owner changing; nothing leaves the vault
const NS_ROWS=[["TREASURY BILL  0412","MEMBER A"],["TREASURY BILL  0413","MEMBER A"],["TREASURY BILL  0414","MEMBER C"],["CERT OF DEPOSIT  1187","MEMBER D"]];
function ns_screen(ctx,t,o){const X=NS_SCREEN.x+60,Y=NS_SCREEN.y+70,ink=NS_PHOSPHOR,f={w:500,size:30,f:"mono",col:ink};ns_screenGlass(ctx,1);
  dp_T(ctx,"CENTRAL MONEYMARKETS OFFICE",X,Y,Object.assign({},f,{a:ag_in(t,o.rows-0.6,0.4),col:"mut"}));
  const sold=ag_in(t,o.both+2.0,0.3);
  NS_ROWS.forEach(([p,own],i)=>{const a=ag_in(t,o.rows+i*0.3,0.25);if(a<=0)return;const y=Y+70+i*52;dp_T(ctx,p,X,y,Object.assign({},f,{a}));
    const nw=i<2&&sold>0;dp_T(ctx,nw&&sold>=1?"MEMBER B":own,X+560,y,Object.assign({},f,{a:a*(nw&&sold<1?1-sold:1)}));if(nw&&sold<1)dp_T(ctx,"MEMBER B",X+560,y,Object.assign({},f,{a:a*sold}));
    if(i<2){const h=ns_on(t,o.both+2.0,o.both+4.2,0.3,0.8);if(h>0){ctx.save();ctx.globalAlpha*=h*0.35;ctx.fillStyle=rgba(ink,1);rr(ctx,X+548,y-30,190,40,6);ctx.fill();ctx.restore();}}});
  // the sale and both acceptances clear once the owners have changed (o.done), so the screen holds the record alone before the
  // Bank's own words are laid over its lower half: nothing shows through the card as it comes in
  const s=ag_in(t,o.sale,0.3)*(o.done==null?1:1-ag_in(t,o.done,0.6));if(s<=0)return;ctx.save();ctx.globalAlpha*=s;const y0=Y+300;
  dp_T(ctx,"SALE  50 BILLS  MEMBER A TO MEMBER B",X,y0,f);
  [["ACCEPTED BY A",o.both],["ACCEPTED BY B",o.both+0.8]].forEach(([w,tk],i)=>{const a=ag_in(t,tk,0.25);if(a<=0)return;const y=y0+56+i*50;dp_tick(ctx,X+18,y-10,"green",clamp((t-tk)/0.5,0,1));dp_T(ctx,w,X+56,y,Object.assign({},f,{a}));});
  ctx.restore();}

/* ---------------------------------------------------------------- 3 · Jun's token */
scene("token",(ctx,S,t,sc)=>{const C=sc.cues,
  tTwo=wAt(sc,"two","at two"),tJob=wAt(sc,"two","a job"),tPlat=wAt(sc,"two","data platform"),tSam=wAt(sc,"own","Sam Okafor"),tId=wAt(sc,"own","an identity"),tName=wAt(sc,"own","registrar loader"),
  tJuns=wAt(sc,"still","Jun Park's"),tMade=wAt(sc,"made","Jun made it"),tDate=wAt(sc,"made","fourteenth"),tNoEnd=wAt(sc,"made","no end date"),
  tIs=wAt(sc,"whoever","is Jun"),tAny=wAt(sc,"reads","from anywhere"),tHour=wAt(sc,"reads","at any hour"),tLong=wAt(sc,"reads","for as long as"),
  tSet=wAt(sc,"finds","the job's settings"),tNote=wAt(sc,"finds","an old notebook"),tLap=wAt(sc,"finds","a file"),tMany=wAt(sc,"copy","how many"),
  tMoves=wAt(sc,"moves","moves"),tWrong=wAt(sc,"wrong","quickest"),tBearer=wAt(sc,"streets","bearer paper");
  const tGrow=tId-0.2,tWords=Math.max(tGrow+1.8,tName-0.3);
  // Jun: in when he's named, out to the side while Sam looks for copies, back in, then off to another team
  const junX=tt=>tt<C.place?1720:tt<tMoves?1720+180*ag_sine((tt-C.place)/1.0):lerp(1900,1830,ag_sine((tt-tMoves+0.2)/1.4)),
        junA=tt=>ag_in(tt,tMade,0.6)*(tt<tMoves-0.2?1-ag_in(tt,C.place,0.8):ag_in(tt,tMoves-0.2,0.6));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsHall",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      ns_platform(c,ag_in(tt,tPlat,0.6),0.5+0.4*ns_on(tt,tJob,tJob+2.4,0.5,0.8));
      ns_clock(c,700,100,ag_in(tt,tTwo-0.2,0.5));
      dp_person(c,"sam",250,640,0.9,{t:tt,a:ag_in(tt,tSam,0.6),gaze:[3,0]});
      const ja=junA(tt);if(ja>0)dp_person(c,"jun",junX(tt),640,0.9,{t:tt+1.3,flip:true,a:ja,gaze:[-3,0]});
      // the job: at the door, then close, with its name; Jun's token clipped under it
      const u=clamp((tt-tGrow)/1.7,0,1);ns_job(c,tt,u,ag_in(tt,tWords,0.5));
      const ca=ag_in(tt,tJuns-0.2,0.5);ns_junsCard(c,ca,{clip:ag_in(tt,tJuns-0.4,0.4),glow:ns_on(tt,tIs-0.2,C.reads+1.0,0.5,0.8),bearer:ag_in(tt,tBearer,0.4)});
      if(ca>0){const pa=ns_on(tt,tDate,C.place,0.4,0.6);if(pa>0){const w1=dp_tw(c,"Made 14 March 2024",{w:700,size:28})+36;
        ns_pillAt(c,NS_SC.x,846,"Made 14 March 2024","violet",tt,tDate,C.place);ns_pillAt(c,NS_SC.x+w1+18,846,"No end date","violet",tt,tNoEnd,C.place);}}
      // to the platform, whoever holds it is Jun: from anywhere, at any hour
      const la=ns_on(tt,tIs,C.place-0.4,0.5,0.6);if(la>0){dp_link(c,[NS_SC.x+NS_SC.w,NS_SC.y+60],[junX(tt)-110,770],"cyan",ag_sine(clamp((tt-tIs)/0.9,0,1)),{alpha:la});
        dp_tag(c,1300,250,"To the platform: Jun","cyan",{a:la});}
      ns_anywhere(c,ag_in(tt,tAny,0.3)*2+ag_in(tt,tHour,0.3)*2+ag_in(tt,tLong,0.3)*2,ns_on(tt,tAny,C.place-0.4,0.3,0.6));
      // the copies Sam finds, and nobody can say how many more
      ns_copies(c,[ag_in(tt,tSet,0.6),ag_in(tt,tNote,0.6),ag_in(tt,tLap,0.6)],null,1-ag_in(tt,C.moves-0.4,0.6));
      ns_pillAt(c,1605,846,"How many more?","coral",tt,tMany,C.moves-0.4,{align:"center",size:30});
      // when Jun moves to another team, the job's line to him stretches
      const ma=ns_on(tt,tMoves,C.streets-0.4,0.5,0.6);if(ma>0){dp_link(c,[NS_SC.x+NS_SC.w,NS_SC.y+60],[junX(tt)-110,770],"cyan",1,{alpha:ma*0.9,dash:[12,10]});
        dp_tag(c,1560,282,"Another team",NS_ICE,{a:ma});}
      ns_card(c,1250,96,560,{title:"The quickest way to start",sub:"It has worked since March 2024"},tt,tWrong,C.streets-0.4);}}],0.8);
  ns_kick(ctx,S,t,"Jun's token");});

/* ---------------------------------------------------------------- 4 · Who holds a secret? */
scene("ladder",(ctx,S,t,sc)=>{const C=sc.cues,
  tProve=wAt(sc,"prove","prove"),tQ=wAt(sc,"ways","one question"),tSomeone=wAt(sc,"someone","someone else"),tBear=wAt(sc,"rights","bearer paper"),
  tReads=wAt(sc,"vault","reads"),tMach=wAt(sc,"vault","a machine changes"),tCopy=wAt(sc,"types","a copy"),tNever=wAt(sc,"cert","never sends"),
  tSign=wAt(sc,"signing","by signing"),tWire=wAt(sc,"signing","never crosses"),tRenew=wAt(sc,"renewed","renewed"),
  tShort=wAt(sc,"signs","a short note"),tLets=wAt(sc,"signs","lets it in"),tVouch=wAt(sc,"knows","vouches"),tNew=wAt(sc,"passes","a new one"),tHour=wAt(sc,"passes","within the hour");
  const tIn=[C.person,C.own,C.vault,C.cert,C.note,C.top],tOut=[C.own,C.vault,C.cert,C.note,C.top,C.goal],L=NS_WL;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsLadder",keys:[[0,960,571,1.06],[C.own,960,560,1.06],[C.vault,960,549,1.06],[C.cert,960,538,1.06],[C.note,960,527,1.06],[C.top,960,516,1.06],[C.goal,960,540,1.0]],d:2.0,push:0,draw:(c,tt)=>{
      const goal=ag_in(tt,C.goal,0.8);
      ns_ladder(c,L,{rails:clamp((tt-tProve+0.4)/2.2,0,1),rung:k=>({in:ag_in(tt,tIn[k],0.6),words:ag_in(tt,tIn[k]+0.15,0.5),card:ag_in(tt,tIn[k]+0.7,0.5),
        lit:Math.max(ns_on(tt,tIn[k],tOut[k],0.5,0.6),k>=4?goal:0),dim:0.45*ag_in(tt,tOut[k],0.6)*(1-goal)})});
      ns_goal(c,L,ag_in(tt,C.goal+0.6,0.7));
      // the one question; then what each rung means, one picture at a time
      ns_card(c,120,236,640,{kick:"One question",title:"Who holds a secret, and for how long?"},tt,tQ,C.person-0.4);
      ns_rungPics(c,tt,{tIn,tOut,tSomeone,tBear,tReads,tMach,tCopy,tNever,tSign,tWire,tRenew,tShort,tLets,tVouch,tNew,tHour});
      ns_card(c,120,430,640,{kick:"The goal",title:"Nobody makes, keeps, copies or changes a secret"},tt,C.goal+1.2,null,{col:"green"});}}],0.8);
  ns_kick(ctx,S,t,"Who holds a secret?");});

// what each rung of the job's ladder means, drawn at the left while it's named (T: the times of its words)
function ns_rungPics(c,tt,T){const A=k=>ns_on(tt,T.tIn[k]+0.2,T.tOut[k]-0.5,0.6,0.5),mp=Math.max(A(3),A(4),A(5));
  // the platform the job signs in to, at the right of the pictures, for the rungs that sign or are vouched for
  ns_miniPlatform(c,mp,Math.max(ns_on(tt,T.tWire,T.tOut[3]-0.5,0.4,0.5),ns_on(tt,T.tLets,T.tOut[4]-0.5,0.4,0.5),ns_on(tt,T.tVouch,T.tOut[5]-0.5,0.5,0.5)));
  // 0: the job runs as a person, with everything they may do; a person's token clipped to it
  let a=A(0);if(a>0){const g=0.55+0.45*ag_in(tt,T.tSomeone,0.8);ns_ghost(c,330,300,2.4,a*g);ns_jobSmall(c,250,338,0.5,a,tt);
    c.save();c.globalAlpha*=a;ns_clipLine(c,400,524,1);dp_sealed(c,190,566,420,"A person's token",{});c.restore();}
  // 1: a token of its own: its own rights, still bearer paper
  a=A(1);if(a>0){ns_jobSmall(c,250,338,0.5,a,tt);c.save();c.globalAlpha*=a;ns_clipLine(c,400,524,1);dp_sealed(c,190,566,420,"The job's own token",{});
    ns_bearer(c,610,520,ag_in(tt,T.tBear,0.4),{align:"right"});c.restore();}
  // 2: a secret in a vault, read as the job starts, changed by a machine; a copy still works while it's valid
  a=A(2);if(a>0){ns_vault(c,160,250,480,290,a,clamp((tt-T.tMach)/1.0,0,1),{title:"A vault"});ns_jobSmall(c,200,600,0.42,a,tt);
    const ra=a*ag_in(tt,T.tReads,0.5);if(ra>0){c.save();c.globalAlpha*=ra;dp_link(c,[326,600],[326,542],"violet",ag_sine(clamp((tt-T.tReads)/0.6,0,1)),{dash:[8,8]});c.restore();}
    const cp=clamp((tt-T.tCopy)/1.0,0,1);if(cp>0){c.save();c.globalAlpha*=a;const e=ag_eo(cp);dp_halo(c,lerp(400,560,e),lerp(430,680,e),110,"coral",0.25*cp);ns_cardIcon(c,lerp(320,470,e),lerp(400,640,e),190,1);c.restore();}}
  // 3: a certificate: a key the job keeps, and a signature that crosses instead; renewed before it ends
  a=A(3);if(a>0){ns_jobSmall(c,170,330,0.5,a,tt);ns_key(c,248,580,1.4,"violet",a*(0.8+0.2*ns_on(tt,T.tRenew,T.tOut[3],0.4,0.4)));
    ns_signature(c,[472,420],NS_MPDOOR,clamp((tt-T.tSign)/1.4,0,1),a);ns_pillAt(c,170,700,"Renewed before it ends","violet",tt,T.tRenew,T.tOut[3]-0.5);}
  // 4: a note from where the job runs, signed there, used once at the door, then gone
  a=A(4);if(a>0){ns_builder(c,150,296,a,tt,"Where it runs");
    const nu=clamp((tt-T.tShort)/1.0,0,1),go=clamp((tt-T.tLets)/1.2,0,1);if(nu>0){c.save();const e=ag_sine(go);c.translate(lerp(0,240,e),lerp(0,-30,e));
      ns_note(c,110,480,a*ag_in(nu,0,0.6)*(1-ag_in(go,0.55,0.45)),tt,{title:"This job",from:"from here"});c.restore();}}
  // 5: an identity the platform gives it: vouched for, and a pass made for each run that ends within the hour
  a=A(5);if(a>0){ns_jobSmall(c,170,330,0.5,a,tt,{glow:ag_in(tt,T.tVouch,0.6)});
    c.save();c.globalAlpha*=a;dp_link(c,[470,423],[NS_MPDOOR[0]-40,NS_MPDOOR[1]],"cyan",ag_sine(clamp((tt-T.tVouch)/0.8,0,1)),{alpha:0.9});c.restore();
    dp_slip(c,100,234,"Vouched for by the platform","cyan",{size:28,a:a*ag_in(tt,T.tVouch,0.5)});
    ns_pass(c,170,580,a*ns_on(tt,T.tNew,T.tOut[5]-0.4,0.5,0.4),clamp((tt-T.tNew-0.4)/0.6,0,1),clamp((tt-T.tHour)/0.6,0,1));}}

/* ---------------------------------------------------------------- 5 · Up the ladder */
scene("climb",(ctx,S,t,sc)=>{const C=sc.cues,
  tVouch=wAt(sc,"vouches","vouches"),tRole=wAt(sc,"role","the loader role's"),tBuild=wAt(sc,"build","the build service"),tSigns=wAt(sc,"build","signs a note"),
  tNo=wAt(sc,"build","no secret"),tEnds=wAt(sc,"ends","ends"),tSet=wAt(sc,"worthless","the settings"),tNote=wAt(sc,"worthless","the notebook"),tLap=wAt(sc,"worthless","the laptop"),
  tThief=wAt(sc,"thief","a thief"),tB=wAt(sc,"before","Before"),tN=wAt(sc,"now","Now"),tTeam=wAt(sc,"never","moves team"),tNever=wAt(sc,"never","never his"),
  tCant=wAt(sc,"cant","can't climb"),tPw=wAt(sc,"cant","the password goes"),tMach=wAt(sc,"owner","A machine"),tDown=wAt(sc,"owner","written down"),tTop=wAt(sc,"starts","at the top");
  const L=NS_WL,tHall=tVouch-0.6,tBack=C.starts-0.4,clU=tt=>5*ag_sine(clamp((tt-C.up-0.2)/(tHall-C.up-0.9),0,1));
  const junX=tt=>lerp(1720,1840,ag_sine((tt-tTeam)/1.6)),junA=tt=>ns_on(tt,C.never-0.2,C.cant-0.2,0.6,0.7);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsLadder",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      // the job climbs, each rung lit as it passes
      const p=clU(tt);ns_ladder(c,L,{rung:k=>({lit:Math.max(0,1-Math.abs(p-k)*1.4)})});ns_goal(c,L,1-ag_in(tt,0.2,0.8));
      ns_jobSmall(c,690,ns_rungY(L,0)+6-(ns_rungY(L,0)-ns_rungY(L,5))*p/5,0.27,ag_in(tt,0.2,0.6),tt,{glow:clamp(p-4,0,1)});}},
    {at:tHall,place:"nsHall",dis:0.8,keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      ns_platform(c,1,0.6+0.4*ag_in(tt,tVouch,0.6));
      dp_person(c,"sam",250,640,0.9,{t:tt,gaze:[3,0]});
      const ja=junA(tt);if(ja>0)dp_person(c,"jun",junX(tt),640,0.9,{t:tt+1.3,flip:true,a:ja,gaze:[-3,0]});
      // vouched for: the job's badge, lit, with nothing clipped to it (away while the two cards compare what a thief would find)
      const ba=1-ns_on(tt,tThief-0.2,C.never-0.4,0.6,0.6);ns_badge(c,NS_B.x,NS_B.y,{t:tt,a:ba,glow:ag_in(tt,tVouch,0.8)});
      dp_slip(c,NS_B.x,166,"Vouched for by the platform","cyan",{a:ba*ag_in(tt,tVouch+0.2,0.5)});
      dp_tag(c,1290,440,"Decided when it got its name","cyan",{a:ns_on(tt,tRole,C.build+0.6,0.5,0.6),to:[NS_B.x+NS_BW-60,NS_B.y+262],p:ag_sine(clamp((tt-tRole-0.2)/0.6,0,1))});
      // the build service signs a note for each run: it takes the token's place, is used once, and goes; no secret stored there
      ns_builder(c,84,176,ns_on(tt,tBuild,C.ends-0.3,0.5,0.6),tt);
      const na=ns_on(tt,tSigns,tNo+1.2,0.5,0.6);if(na>0){c.save();c.globalAlpha*=na;dp_link(c,[414,252],[NS_SC.x,NS_SC.y+88],"cyan",ag_sine(clamp((tt-tSigns)/0.8,0,1)),{dash:[10,9]});
        ns_clipLine(c,NS_B.x+NS_BW/2,NS_B.y+NS_BH,1);c.restore();ns_note(c,NS_SC.x,NS_SC.y,na,tt);}
      ns_pillAt(c,84,364,"No secret stored","green",tt,tNo+0.4,C.ends-0.3);
      // Jun's token ended: the card stamped and greyed, as its copies are
      const ea=ns_on(tt,tEnds-0.3,tThief-0.3,0.5,0.6),ek=clamp((tt-tEnds-0.3)/0.7,0,1);
      ns_junsCard(c,ea,{ended:ek,grey:clamp((tt-tEnds-1.0)/1.2,0,1)});
      const ck=[ag_in(tt,tSet-0.3,0.5),ag_in(tt,tNote-0.3,0.5),ag_in(tt,tLap-0.3,0.5)];
      ns_copies(c,ck,[clamp((tt-tSet-0.1)/0.7,0,1),clamp((tt-tNote-0.1)/0.7,0,1),clamp((tt-tLap-0.1)/0.7,0,1)],1-ag_in(tt,tThief-0.3,0.6));
      // what a thief would find tonight, before and now
      ns_card(c,384,190,560,{kick:"Before",title:"Jun's token",sub:"Everything Jun can read, from anywhere, with no end date"},tt,tB,C.never-0.5,{col:"coral"});
      ns_card(c,984,190,560,{kick:"Now",title:"A pass for one run",sub:"One job's rights, stored by nobody, ends within the hour"},tt,tN,C.never-0.5,{col:"green"});
      // Jun moves team, and nothing breaks
      dp_tag(c,1560,282,"Another team",NS_ICE,{a:ns_on(tt,tTeam,C.cant-0.3,0.5,0.6)});dp_tick(c,NS_B.x+NS_BW-6,NS_B.y-2,"green",clamp((tt-tNever)/0.6,0,1)*(1-ag_in(tt,C.cant-0.3,0.6)));
      // a system that can't climb yet: its password in a vault, changed by a machine, the exception written down
      const va=ns_on(tt,tCant,tBack-0.2,0.6,0.5);if(va>0){dp_slip(c,1300,118,"Only takes a password",NS_ICE,{ink:true,a:va});
        ns_vault(c,1300,214,540,290,va,clamp((tt-tMach)/1.0,0,1),{title:"A vault",label:"The password",label2:"A new password",open:ns_on(tt,tPw+0.4,tPw+2.2,0.4,0.5)});
        c.save();c.globalAlpha*=va*ag_in(tt,tPw,0.5);dp_link(c,[NS_B.x+NS_BW,NS_B.y+200],[1300,360],"cyan",ag_sine(clamp((tt-tPw)/0.7,0,1)),{dash:[10,9]});c.restore();
        ns_card(c,1300,530,540,{kick:"The exception",title:"Written down",sub:"Why, and who owns it"},tt,tDown,tBack-0.2);}}},
    {at:tBack,place:"nsLadder",dis:0.8,keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      // every new job starts at the top
      ns_ladder(c,L,{rung:k=>({lit:k===5?ag_in(tt,tTop-0.2,0.6):0,dim:k<4?0.45:0})});
      [0,1,2].forEach(i=>{const q=clamp((tt-tTop+0.3-i*0.35)/1.0,0,1);if(q<=0)return;const e=ag_sine(q);ns_jobSmall(c,lerp(380,690-i*186,e),ns_rungY(L,5)+6,0.27,ag_in(q,0,0.5),tt+i,{glow:e});});}}],0.8);
  ns_kick(ctx,S,t,"Up the ladder");});

/* ---------------------------------------------------------------- 6 · A ladder for people */
scene("people",(ctx,S,t,sc)=>{const C=sc.cues,
  tWho=wAt(sc,"shared","who did what"),tFake=wAt(sc,"password","a fake page"),tMoved=wAt(sc,"text","moved"),tCode=wAt(sc,"text","the code typed"),
  tPassOn=wAt(sc,"app","pass on"),tYes=wAt(sc,"app","your yes"),tKey=wAt(sc,"passkey","a passkey"),tStays=wAt(sc,"stays","stays"),
  tFace=wAt(sc,"unlock","your face"),tFinger=wAt(sc,"unlock","your fingerprint"),tReal=wAt(sc,"real","the real site"),tNothing=wAt(sc,"real","gets nothing"),
  tHalf=wAt(sc,"half","the matching half"),tSam=wAt(sc,"once","Sam"),tJun=wAt(sc,"once","Jun"),tMei=wAt(sc,"once","Mei"),tItself=wAt(sc,"agents","as itself"),tToken=wAt(sc,"agents","a person's token");
  const tIn=[C.shared,C.password,C.text,C.app,C.passkey],tOut=[C.password,C.text,C.app,C.passkey,C.once],L=NS_PL,tRow=C.once-0.3,tAg=C.agents-0.4;
  const P={x:430,y:150,w:360,h:600};   // Mei's phone, large, at the left of the ladder
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsPeople",keys:[[0,960,540,1.0]],push:0.025,draw:(c,tt)=>{
      const la=1-ag_in(tt,tRow,0.8);
      ns_ladder(c,L,{a:la,rails:clamp((tt-C.too-0.2)/2.0,0,1),rung:k=>({in:ag_in(tt,tIn[k],0.6),words:ag_in(tt,tIn[k]+0.15,0.5),card:ag_in(tt,tIn[k]+0.7,0.5),
        lit:ns_on(tt,tIn[k],k===4?tRow:tOut[k],0.5,0.6),dim:k<4?0.6*ag_in(tt,tOut[k],0.6):0})});
      ns_peoplePics(c,tt,{tIn,tOut,tWho,tFake,tMoved,tCode,tPassOn,tYes,tKey,tStays,tFace,tFinger,tReal,tNothing,tHalf,tRow,P});
      // everyone at the university signs in once, with a passkey
      [["sam",430,tSam,"Sam"],["jun",960,tJun,"Jun"],["mei",1490,tMei,"Mei"]].forEach(([w,x,tn,nm],i)=>{const a=ns_on(tt,tRow+0.5+i*0.25,tAg-0.4,0.8,0.5);if(a<=0)return;
        dp_person(c,w,x,664,0.85,{t:tt+i*0.7,a,gaze:[i===2?-3:3,0],flip:i===2});
        const na=a*ag_in(tt,tn-0.2,0.4);if(na>0){c.save();c.globalAlpha*=na;const pw=dp_pill(c,x,352,nm,"cyan",{align:"center",size:30});dp_tick(c,x+pw/2+30,340,"green",clamp((tt-tn)/0.6,0,1));c.restore();}});}},
    {at:tAg,place:"nsLadder",dis:0.8,keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      // agents climb the job's ladder too: each signs in as itself, never on a person's token
      ns_ladder(c,NS_WL,{rung:k=>({lit:k===5?ag_in(tt,tItself-0.3,0.6):0,dim:k<4?0.45:0})});
      ag_model(c,786,ns_rungY(NS_WL,5)+54,46,{t:tt,a:ag_in(tt,tAg+0.5,0.6),col:"cyan"});
      dp_slip(c,150,300,"Signs in as itself","cyan",{a:ag_in(tt,tItself,0.5)});
      c.save();c.globalAlpha*=ag_in(tt,tToken-0.2,0.5);dp_sealed(c,150,420,460,"A person's token",{revoked:clamp((tt-tToken)/0.8,0,1)});c.restore();}}],0.8);
  ns_kick(ctx,S,t,"A ladder for people");});

// what each rung of the people's ladder means, drawn at the left while it's named
function ns_peoplePics(c,tt,T){const A=k=>ns_on(tt,T.tIn[k]+0.2,T.tOut[k]-0.5,0.6,0.5),P=T.P;
  // 0: one account, three people: who did what?
  let a=A(0);if(a>0){ns_shared(c,150,250,a);ns_pillAt(c,180,660,"Who did what?","coral",tt,T.tWho,T.tOut[0]-0.5,{size:30});}
  // 1: a password alone, typed into a fake page
  // typed in, the page gets a copy of it: the copy lands in the page's field, under its name, and the password stays where it was
  a=A(1);if(a>0){const u=clamp((tt-T.tFake)/1.1,0,1);c.save();c.globalAlpha*=a;dp_sealed(c,160,260,460,"Your password",{});
    if(u>0)ns_relay(c,[430,356],[430,474],ag_sine(Math.min(1,u*1.6)),"coral",1);ns_page(c,150,470,560,250,"A fake page","coral",1);
    if(u>0){c.save();c.globalAlpha*=ag_in(u,0.4,0.5);ag_about(c,430,614,lerp(0.92,1,ag_spr(u,0.4,0.6)));dp_sealed(c,190,566,480,"Your password",{});c.restore();}c.restore();}
  // 2: a code by text; the number moved to a thief's phone
  a=A(2);if(a>0){ns_phone(c,160,250,240,440,a,(x,sx,sy,sw)=>{c.save();dp_panel(c,sx+14,sy+60,sw-28,150,{col:NS_ICE,r:14,glowR:20});dp_T(c,"A text",sx+34,sy+110,{w:700,size:30});ns_cardIcon(c,sx+34,sy+130,140,1);c.restore();});
    ns_phone(c,560,250,240,440,a*ag_in(tt,T.tMoved-0.6,0.5),null,{col:"coral"});ns_numberMove(c,[280,470],[680,470],clamp((tt-T.tMoved)/1.4,0,1),a);}
  // 3: an app asks "Is this you?", and a fake page passes on your yes
  a=A(3);if(a>0){ns_phone(c,160,250,260,460,a,(x,sx,sy,sw)=>{dp_T(c,"Is this you?",sx+20,sy+90,{w:700,size:30});
      dp_pill(c,sx+20,sy+170,"Yes","green",{size:30,glow:10+14*ns_on(tt,T.tYes,T.tOut[3],0.3,0.4)});});
    ns_page(c,500,300,330,230,"A fake page","coral",a);ns_relay(c,[500,420],[420,420],ag_sine(clamp((tt-T.tPassOn)/0.8,0,1)),"coral",a);}
  // 4: a passkey: a key that stays on the phone, unlocked with a face or a fingerprint; it answers only the real site
  a=ns_on(tt,T.tIn[4]+0.2,T.tRow,0.6,0.6);if(a>0){const mei=1-ag_in(tt,T.tReal-0.6,0.8);
    if(mei>0)dp_person(c,"mei",210,640,0.9,{t:tt,a:a*mei,pose:"hold",hold:ns_heldPhone,gaze:[3,-1]});
    const px=lerp(P.x,P.x+50,ag_sine(clamp((tt-T.tReal+0.6)/1.2,0,1)));
    ns_phone(c,px,P.y,P.w,P.h,a,(x,sx,sy,sw,sh)=>{dp_T(c,"Sign in to",sx+22,sy+60,{w:700,size:30});dp_T(c,"the university",sx+22,sy+100,{w:700,size:30});
      dp_pill(c,sx+22,sy+170,"Use your passkey","cyan",{size:28});
      const kg=0.6+0.4*ns_on(tt,T.tStays,T.tStays+2.4,0.4,0.8);dp_halo(c,sx+sw/2,sy+290,120,"violet",0.25*kg);ns_key(c,sx+sw/2+6,sy+290,1.3,"violet",1);
      ns_faceIcon(c,sx+sw/2-60,sy+430,32,"cyan",0.45+0.55*ag_in(tt,T.tFace,0.4));ns_fingerIcon(c,sx+sw/2+60,sy+430,32,"cyan",0.45+0.55*ag_in(tt,T.tFinger,0.4));});
    // only the real site gets an answer; a fake page gets nothing
    const ra=ns_on(tt,T.tReal+0.3,T.tHalf-0.4,0.5,0.6);if(ra>0){ns_page(c,110,170,330,220,"The university","cyan",ra,{draw:(x,y,w,h)=>dp_tick(c,x+w/2,y+h/2,"green",clamp((tt-T.tReal)/0.6,0,1))});
      ns_page(c,110,430,330,220,"A fake page","coral",ra,{draw:(x,y,w,h)=>ns_emptyCard(c,x+20,y+16,w-40,h-32,ag_in(tt,T.tNothing,0.5))});}
    // the platform keeps only the matching half
    const ha=ns_on(tt,T.tHalf-0.2,T.tRow,0.5,0.6);if(ha>0){ns_card(c,110,190,330,{kick:"The platform",title:"The matching half",sub:"It opens nothing on its own"},tt,T.tHalf-0.2,T.tRow);ns_halfKey(c,280,560,1.3,ha);}}}

/* ---------------------------------------------------------------- 7 · Nothing to carry */
scene("close",(ctx,S,t,sc)=>{const C=sc.cues,
  tStop=wAt(sc,"city","stopped travelling"),tKnows=wAt(sc,"job","knows"),tLeak=wAt(sc,"nothing","nothing to leak"),tSched=wAt(sc,"nothing","nothing to change"),tBreaks=wAt(sc,"nothing","nothing that breaks");
  const tHall=C.job-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsStreet",keys:[[0,960,560,1.0],[tStop,960,432,1.25]],d:3.0,push:0,draw:(c,tt)=>{ns_walkers(c,tt,-7.0,{case:0});}},
    {at:tHall,place:"nsHall",dis:0.8,keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      ns_platform(c,1,0.6+0.4*ag_in(tt,tKnows,0.6));ns_badge(c,NS_B.x,NS_B.y,{t:tt,glow:0.6+0.4*ag_in(tt,tKnows,0.8)});
      [["Nothing to leak",tLeak],["Nothing to change on a schedule",tSched],["Nothing breaks when someone moves on",tBreaks]].forEach(([s,tw],i)=>ns_pillAt(c,NS_SC.x,712+i*70,s,"green",tt,tw,C.breath-0.3,{size:30}));}}],0.8);
  ns_kick(ctx,S,t,"Nothing to carry");
  dp_end(ctx,S,t,C.breath,NS_TITLE,"The best secret is the one nobody holds.","Film 2 of 9","Locks before the data");});

// the hall glides on from the title card into Jun's token; the ladder's room into Up the ladder
ag_cutInto(["token","climb"]);

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
