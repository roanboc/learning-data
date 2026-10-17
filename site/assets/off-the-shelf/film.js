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
const LOGO_SRC={databricks:"data:image/png;base64,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",dbt:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AABJsElEQVR42u2deZxcRbn+v2/VOadnJgFJQhLihjsScCMuuMCwhqyA6KAsXpDgZAFUENx/Nn0Vd8F7A1lGQFEWLyMikB2uMC6IS1xQ4n5VEIEkLEKSmT7nVL2/P7pnSCDLzGSW7kk9f/Dh0zM5c7rqraee5623qiAgICAgICAgICAgICAgoPagIFosGm1psapIaJGAgEEYZ4poS4vVYtEotT3OaubltKXFsn69cEg5Jp/wYtLyyxFehTFvRMWC/zWOezDJnzCFBxm/vguO8FIq+RByAQG9HGfNzRFHAJvGjqUzewU+fwWGA1DzKtDHgHvB/4VN8S9ofOghHn+JZ/JkrZVxNqyEpS0tlr3KTTS441F/HMr+CC/H2kl47aH/yptWX9UIOOdA7kX1J3h7A5Oeuoe7QDo68hCSAQHPciqGM5oTRo16I55WhNeBvhxj457xtf1x9gjIT1H9K8Yup7DxbvY+rjyc5DXkhKWKMHdKhB33arydg8hUrHkp3mv1fRTd5s3k6Xbv+W/lUyOC0zKidwK3ENsVjJnyz6C6AgJAi0XDhp+/APXHgfkP0DdjjKmKge2NM92a5ao/q/w3MpD7X6F6G3n0DZ735ANSGnqBMGSEpSDMn7kPzp2ONScSR0eR5d0/1G0ap0+PBRQhtpC5J1BdguTXMfEt6wJxBex5akqFlpMN4544EI1OQ2Qesd2HzOlWI0z6McaqIsEI3j0C3InIrTDqNlnUvmlEEZa2tDSy76Z3o1xMZF5IroB6RGSA3kF7mjW2htz9G5Gv0FW+iqvveEi2njkCAkasosLw4HEHktjTQOdhozFkzgOCDNhY7/aQQmQhy3+AjT9D9q+7pG1tVteEpc3NEQfv9WrUF7H2eHKXo9h+qqneU5eoJ44tafYA6Idp9GvksjWPhZAOGLFE9dCs52Pd24GPEUUTyZ1DMQNIVNsZaaqIGJQc9Fr8loto63h0MAXCoBGWntG8D01NHwHmIDIeVQdih64X1WOMoCqI3onKp5kw6seUbswECYorYGSQ1QdO2Ie0691gPk0c7UuWO1QGk6i2JxEc1kR4/xuQS3kqvUmuvX1zXRCWNjdHHLDXURj3cWLbTO4ciGH4ViQdIhbvHXAzYr+Ie+jXtK3Ng1UMqEuSUoQzmws0jJ6F+BKRnUzutfITMcPzUlVnE8UWl90G7gJZtOYvNU1Yevqxo9grej/KZ0GGtwGfLV89kbU43wlchcuvYNKb/xQS8wF1AwH9YEsjnVsOx3Ah6DGVD/3QupddjTNjLF4fQJjPxlGrpL3d1Rxh6ZypY0nspcTRGWR5BhJRa1WzioI6kjgiyx5G5XPE/ruycNU/w2gIqGlV1dKSsO9Tb0bMp1COQnqIylB71ekKeFQNyidQ+1/StmxLzRCWnjft+eR8GxO9FedyRKIa19SVFUprhNzdBxTxdiVtyzqDTQyoqVAtYnh06ivw8QLUz8GYJlyVqKTWt6tpRhTHpNk15O4CuWr3F752+wvr+bNfRpf7NUoTor5GpGkvZwH1iKm8r+j/4v2n2dL5U67pKAfiChj2AJ3/tjEwugW1JQp2P8pZDmJrn6i2EQc51ka4/McY805ZtOLhYSMsnT/zJYwq/JVNnSkiMdTlBuXKKkdkIpx7Ci/tIEt57G+/lvZ1aRg2AUM8iwrntzRQfmoKXi4ljt5A7jyq1Eg+uD+kVVn4QtbhpFnalm0ccsLS1uZ9MaPuAj2g7lh/+42qgCOJItJ8I8jXMPY6xh/y+5CYDxga+9ccsX70a1C9CNF3IsbiNUewdSoGtiUtay3efYMtW+bLNR1d/XlMvxhbz29pxDR9CSsHAabuyQpARBCJSHMPsg8N8cfQ/HY2/uwsbW3eNwyngEEdz3NnPo+Hmy4CXUNs3wV4vCpC7S1e9W98WZzPSeIzaWo6s7/H2PT5H2nrlBgz4SKS6BJSl1cbdCSGkAMRImvIs9+CfArZcocs6tgUhlfAgEXZgubRuNHHIq5EFL0K512l2LlO7d+uv3FGQyGm7E6URbfdMqiEpcWiYf3P30sSXUmaZSDxiE8pKA4rEU7LGF2D85fS1XVPt6TVyoEcIUEf0ItgejpW9IzmBppGHwT+/2HMCdUTFHIYAfZvl81AjupmrJ8hV6z+yeAR1tzpx2LkBlT3qc4AsodEWqV+K7IRud+M4Upys4RJy/4kJXwgroBeE1WxaHho7SuI/DyU92FNE85lqEQjIrXS6xGlisg6nDmyL0n4XjeQfuCEfSin30PM4ZUViz3wyGJVj+AoJDHl7J8YLeHyW2XJ7evDsAzYZfjMmTqWxLwdTIlC/DzKaVY5DGCk2r9dpFyMsTj9OhNHzZNSe69W5HtFOhUr+LNLsPaj1dM+7Z4deeoQEWJrSN1vQS4itXfL1bc+FdRWwLNU1enHjmJv+zow/w90KhjFqxu5+d9eN5Krnig/UxavWjNwhPX+mVPIdCXo2BrdCjBcRjHHSIzXHKQdK18me+i33ecCBeLaw4mqdUqMHf9a1M5F9J1Y+xxcvqfZv100F4ryQzrjE+WaW57Y1T/YpRTV8w9tJNNPVY6ICWS1DdkLMd57RD2JPQXvVmPHX6BnnvCC6mwQyGqPC4oqWZ15wguw4y8As5yCnQPaRJ57kDiQ1VbNpQqRaaYp/agWi6YX7bsLwpo37Szi+CryPFjBnSNHMUTG4NyvUHMxsbtLFq56MjTNHqSqzpu2N+XoUIz7IpF9Dbn3gN/j7d/OUywe4VFw02XxmrX9Jqxqov3XCM8PVrDXNjHDmgTvM5B24FK2bLovlEHsAfaPCa/BmvNRPblaCpMixGHc9KIpRQT0Nl7zyDtk7o6PWjY76ww6y+/Bmv3RATt7fU+wiQnOeVAlsaeCv41Roz6lC2YfpLpVgIf2rGui2sb+zT3uRcT7XYBlOYk9FVGP8x4hCeOml+PGe0cUzebeSa/a2djY4Q8qCcOJq0CPqF5WFhq+71LXIUBDwdKV/h2j/0lhy21yacfGoLZGgKo65+hxpA1vJdLP0ZRMZkuaoWoqG30D+uxNDB6nV8nSlXP7RFiVK7mmHkLU8AuyzO+ZdSIDGeOaP70rQFfh7CXAL7sPNQvEVW/2b1YTcAjWfQIj0yprXVqbh1bWnTXUDcTJAfJf218xNDtgMcXbOeR591VcAbsjd5EYxVcONLPTMH45Vj+jc6dN3sZahGCvA/s3bTJWP4Pxy4nsNJymePXVCSn03242NmImkKZn9U1hnfWWvSjs80vgZaEVB7xXHOBpKMR0lv+G5bNs2rJMrul4OKitGlZVZzTvx+imWTg+TmPhxXSVs8qEH+zfABtDMPJrxm86XErPPmhg+0utDWOOx8jLyL2GmpEBF1wWMJWAlxcRR19jVNOdOu+4Ip0Nv+0ungvENfxEJaB6xgn70Nj1KowpEcdH4nKt9l2wf4PiRlCsvI4No08ArtulwtKWFsvYTV/HcPrTajhgcEaGKpiUSAo45xBzA8pXcQ/fG6rlh1lRtU6Jsfu9GuGDqD8Fay25lsEnIU0y2N2gisq1PDrqrGfeuPPsHNbkyYqwf3VlMGBQ5xMRRCtkBY7Yno73y5AJ5+vc417UnTvRyp1poT8Gkai2Iau5x70ImXA+3i8jtqcDrjKhaCGQ1ZAMDIPw8u1dD/ZshVVsbmB9019BnhsabsiRoUTEVsjyn4G5BOGHsnj540FtDRJZFTE9RwTNnzkG5TDwnyCO3kjmFCEH4tBSQzyHqKaImdQd+zsmrPOOn4z6+0L+avi6CqRqE30Z0XZy/os/bvm1dHTkgbgGwf61tCSMeXIKxixAOBlrk4r90ySMgWHqHhFB9R2yeMV3d24J0/zlONXQTcOlhtnKJqohSU7HcAuv2utCnT/zJcEmDrD9O2f6K9h380exZg2F+HQU87T9C+07vHAHPDPGzTM7E3GvCh1VE8xlQWK6shyYSCH5HF6/o/NnnagLZuzXs4oVSKvPRCWgumDGfnrO9PfiWE5jUkKlgXKeV6+jCqUKw95hCshhFIs7JiyKRUHkTZVfDqgRxRUhYtjcmRLJ6xB/M+iVOm/mYXr6saOePnqXsBthR7FfxPQQ1enHjtJ5Mw8DvRLP1RjzMraUUwQ7Ym6oGQlRDyByCHfdZZ79g+6ObWmx7Lv5VmBGaLOaHHqVotM4ikndEwjfQOUqWbL8d1tNTCIS8ls9jqHbQheLhg33HIjas1HOJLH7kOV78BHFddB9RoTs4aS7xOfZhKUqzJ9+CcZ8rFpzGmab2uzKHFGhsWDpTP8I/lK8rpGlq//eTVqVCWrPJK5nbaeZM/VlNNjjcZxNU+FAOssOFQ1nVNV4N6pfz8TO50upstgEz6h0FxHV1mk/wVQKTgNq2CYiSmc5BXMASbKUruwenTf9y3h/t8jqh7Y3cPeQ1EePwtQ5U8cS2SkY+U+sPRTvqbRZOPWzLqLcyDrWTdgmdp89w5jkTxgPeUjn1r7PlwT1nlRzYnsoXr+DyDKdP20hTn8rbVXi2qrWaKQTlQhaSW10HgJ6HqrvwtqE1JfBx4gkIXTqQF0J4PUebrzRb13Dvp2yBv6F9+XQZvVCW2KABOccqjmRnYWxq7G2TedNOxRASpVLz0fiFKQgWiyaHlXVOu2ljNt8EepvohC9B1HB5d1V6iFXVS+wVkB+KCLbKKxnd+C0wha8/jFI5rpjLgtYMpfjfEoSzQLTrudMP1vPOua5ItVVsmLRjATiUq0SFaiUSl5bZ+2r86e1YOSbJPZziLyAclrdpBzKFOptFsK5R2myP9+OrXjG7xaLhkd+9mWsOR+vIfFev8gQifFeMbKMnEsY9di9ctk9nfVsExWEYlGkVHp6Ow16ILAAw2mIAeczVMPqX93aQRG8/hdLVpz/zPzr9s/DWjD7IMT/AheqfetchlRubCkkEeX0byA3I/4aWbzq3p7J6eKS1uNqYjWhfiBizgadTUM8rqKowhlVI4CwHJ6jWLL8R70iLACdN+NWDLPDYuEICAClcstwYwE6y/cBi8j8rXLlqn/2EFeppLW+mqggtB7zAkgmYzgZ0dkUkn3pShUk3KQ8cgzh3bJ4xdu298PtSmYtFg3Wf726IB4oq74hCBGqni1dGSIHkURXEJulOn/mMfqeo8dJqeR7iitrGcWioPa1GL2OpuS9KGMqW5dCTdUIgSeyAv6bWmyOth/MO6K5c04chyv/FJEXQ9j2MbJsouQkNiHNUzA3oixkv9f/QkolX+s2Uc84o4GmDe9D5GKMjCX3eSCrEROcDswTiE6RRSv+0TfCAmHB9Auw8ZfDzTkjUnhXquUbEktn+g+gDc3aZekdf64Hm6hzp5+LlY+SxM+jK60sMATUczx6YmPI3Rdk8cqP7ujXdk5CtuF/8P7hsFA4Io1iBGLoSjOM2Z8kugSTfF1bZ0zT95xYszZRQbSlxcrSlZejbi7e301jIa5csxVQz4yF08fQ/Np+XaTa85j5MxZgzRXk3iPBGo5YmyjiiGxM7rpQ+Q64K2TJqnsqagsDRbpLCWrilYvNkZQ6cn3P0eMYN+o7iDmCznJQWvWqriIx5HqxLFlR2vk8u4vZjI+07M2/n7oHsa/sPqQmtPCIJS6HCBRiS1f6N8R8E891snR5xSa2tFja232t2MQe0jr00EbevN/tqL412MN6lFYiqP89vuFoJt38yM7qA3etsCga5v7iJKxej8cGlbUnBJDmiMQ0FWBz+cd4dwVEP5Clyx+sEEXR1Ira6n4XPaV5XybuswL0DZSz7OmbtgNqHA4BcjlF2pa37zqT0Qv6o6UlZt9NP0DMm6rFiIG09gSbiGTEtoBzALfh5FKamn4ql7V3due2aoG4uqv2teXYFzOp8RbQV5HmOSJh9bC24bHG4NxduBdMZWlbvqvV6V0Sj4Cyfr3H6xdAPeHcmT0DIgahQO5yVB1xNBujN1Le/CWdO/U1Uip5KZW8trTY4b4BQEp4LRaNtN/+NzZtOQuV+4lMhKoLHVnTk6Li/RMYX2LSJNebUpo+BZrOm34X1jbjfVBZe5pNVBxGIhpi2FK+F9Ev4e2dPTZxmPNbVSdgpL3d6byp7yBOriLXvVBPKMmpUQUfR4Ys/4YsWfneXk9OvX5+65QYO/FtICvxPsaEINgjg0xwWBvjPCi3EelXeWrL3XJNR9czNyYPC2kVES5WZcGM8xHzpcrt2hjCYlGtBZPDmMfJdBbHjPqFnNzeKzXc507UudO+Qxy9AxdU1h4dbAgkkSXNNwDfQWiTRSt+DZXVO+jww3EahELFWJyMYd8ZS7DmbLLcYUzYEF07E5+rrkQXZemq/+yT/e/T37mxxXJn5yGI3oF3o5AQBMEmVm1iZ/k34L+JMcvkipV/Gk6b2FN4+P6jJpAl7cTJYWSZC6c41EjcAFjzL7ryQ3nem/7VF0XeL5msrdOvoCFaQJqHLTthtnzaJhqBLP8BypfI3N1y1ZrHVBEuHnqb2H0Hoc477jCS5Hvkbm8UG6xhTahzQVjA+BVf66sKN32PTwTsQpy7n8rxpWHVcE+GiAGJcc6Rupw4Ohy4kdheru+b8RaR6omgxeZoqO9O1GLREMvPKJcvxZoIJawaDi88xlrEd5Cn36bUd+7o92yjc6d/gMh+tXJedrCGAVvZRCGiEENX9leEJRi9dThsYo/Kev/siWTZHdj4YFwerOHwRUeOEYcwjSuWd/QnBvo146kiOL2JPP89xtqgsgJ6JkAhQvGUs4zIvJTYfgnPlTp3xgk6Z+pYaa+sBmlLy5CQhirCmL8+jpjPAl2ohFgdrtRBbCOcWyZXLL+r/wG2O+8wf8ZMkJtQHyFh1grYbr5CiaOILNuCl1tBL5elK38M1VKZSWvdYK4mdl//pee3NLJl8/U0xidWL6cIW3eGUluBw8gGMn88j4/+VffENXSWsCepOb2dOHonWUjAB+zEJhoikhjK6V9RczNabnv67K3miFKHGyyb2LNqOH/GEUTmBrwfiyciJOCHSl05ComlXP6iLFn1kd15VL8JRqheWOn5As49AhK27QTs2Cb6qk209qU0xRci0ZV6zvRTdf7bxlSvIpfBtIkCysZRPybLvoWN4pCAH8IJy4ji3D+Ik2t2dxvXgMwwOm/6/6Mx+U8607DhNKAXNhFPHMdkmeLlRsR9XZasXv20TZzlBroMoscRzJ/1BvDLQMaCGkLx82Crq5zYRqTZPFm6eunuPs7s/vsgNJqrSfM/IMZUN0gHBOxojrQgMWmegwiN8buQ6Bs6b8ZXdMGM10rb2qynDGKALZuCsOWp36L6NRJbWRwIGEy28hgTkbl1NO3dPhD9uduEJYLKZcsfpOw+jgAqIQgCeqPtI0ArNlH2oym5AOUqnT9jjp5/1POk1JH3pB0GyhICck1HFyLXkeZ/Q5BAWoNqBhXoAi5k78lPDESOcmAsIQjnH9pA1z7LsNFR5C4k4AP6ItO3OqI59yAr8LKYf7j/lVWryrp0Ssy/dt8m9szw501LSLmQ0Y2fYXO5jFAInTAI1j+KLHneLotXnjxw89xAvV4LljEz3kokt+D96GqZQ1iFCehbkItY4ghS9zDql2Pk8p5N1a1TYtrW5rs1U0uFuXT+tDeQJMtJ8zEQtuwMuLZCc4zZTOqm8sRev+xvGcOgEVbPm86dcTmN0Tl05eG+uID+2ghHZCIiC+Xsl3iupdF9W766+iFFheYjrHR05P0Tc9W6rDlTxxKZJSTxO8lzB2GxaAD7MKchiujMr5ClK84dyEebgX1PhDi/nMz9DUPYZxjQnym0UgaRO09XlhNHh1Cwl9JlrtS5M06m9fWRdHTk2jol7s8VZCKogvDkc/6NYTWRCXmsgaYrEcjdX4jzywd64WRQZLDOPW4uDckSyuFc7YABsIkgJImhnD0J/iZMdLUsWvajSipickL7uqwvNrFHZZ193EEU7Eo8zxuMCXzP7K5qGUOWny9LVn11oB8/4B2kIDRpO135PUTWVi+tCAjo75xqQYRylmPN3jQW3ov6q3TBjE/qnKkvk/Z1KcWiaHNz7yfG7mk62fsf5LqMJDJVYgzYvdHvMcaQunuRwk06CIJo4HNY3c9cMO2tiL0d56OgsgIGaPb2IJVNtCjk7ofA19k4+pvS3u60ZXLC5Ja8V6uJ3cn3BTNOoRBfT1eagiShkXdr8OdYicg5SZYuv3kw/sSgSGAB5b7Oe8j9bSRRuL0kYIACS0wlv5U7Mu9J4sNAFjNu05W6YNrbpH1dWr3JJ9nVFhD9VDX/lZs/kmb/RiWqXhQc0F/rHtuI3N9KU9OqwforA05YQjWpecQRnsh+Hu//hQn7DAMG2CYKQpo5RAo0JGeCvVLnT/+inj37xdLenoqglbPld4CnL0TfSK73Yo0Jyffd0FaKovo4xvwnl7V36SDlxwcn6V7dtwWgrdM/TiG6hCwk4AMGxSYqiCOJIoxAOf0B6HU8ybflulVPamtrzKRJzyo67dlb2DqrCeM+TyE+lzTLw7Ez/UJGIYrpyi9n4hs+IKWS35oDap6wtgmMs6c9n0iWYcyrKtsMQwV8wCBZEoAktqR5iuoyjF4li1atANDzphVYuCrdehCpqoiI6rzp76Ax+U41jxUTikj7pk9EcgwbyOyxLL31991Oqy4s4bNw5aoHEXsxqIR9hgGDahMRW7WJCQ3xSYhdqvNnLNSzZuwvC1eVAdnGJl58cYWYLH8izbvzWKEp+6ZwHUZisvxy9rv1D4N99PWQzCS6oGU0uulmbHRMOFM7YEgyKkIlCSwCWf5D1N/KU26xXHv7Zm1pSQDHje1eBNUFM/bH+28SRYeTOxdOz+01WXmsEby/lwYzUy6r3AJe14TVcxvvhllvQfRWnN8LoVJbExAw2ANKUAqJJcvB+e9izFWyaHnFJhabG+CIlMd+OprcfJ4kmk+aheOTe92+3mFshroTWLzq9sG0gkOqsHq+37xpC2ksnEtXOFM7YEgVV46RiNhC7h7A+RVgLpcly38HoK2zmhD3MRqTT1BOQ+K9t1YwiS1d6Y08vupUaR+aE1zN0MQLoiCIWUTm/lTJu4cK+IAhghChqqR5jjEvoBDPxeg3dd70j+ucqWOlbdkWRDYQGQEJNYO9YCuM8Tj/INZ+kclF1SESP0Nuy3T+tFaieClZniFhJgsYJpuYxJbcgdfb8X4xyCZiuwznLYpBwkrhTtowJ7ER5ezjsnT154byTw9ZiUEPA8fxLWT5bzAmCvu3AoZebYnpWU1UIImOJbJXYGQuWf4rImtDxftOR7LDGkvZ/QrX9K1txvZIIqyeCvgxh2zA64eBcvXsoxAcAcPBXHYrmzgJY96BkRfgPUhYENqh7lAUtBOkxJU3P9g9tkccYXV/MSmVPJM6v493t5DEEZCHOAgYLtYCIrLc4z1Y+1y8DkuqpE6Qk8QRXm+ladQaGQaxMeRV5xX5eIRH/Jdw7gF69s0HBAynTQScD3G406ELlTHrviyXtXfqMBD7sM4kOn/GJ2hMPsOWcoqEoz0CAmqXrnzKqMaEzeX/J0tWfGa4XmNY9vX1MHOh4Qay/I9YY0OZQ0BAzbKVw0aGrmwthiFPtA87YfV43+e86u/k+ZdQlWoCPiAgoPbMoK+eQ3YJi1bcP1gnMdQsYXUztJRKHtPwPVRvJ44sGhLwAQE1RlY5hTgmy7+L3et2AZVhzDkPbw6r+0yiBbPeBvo9vN+nmgANqzQBAcMPj+AQ+SdZ/k5pW/3L4VRXw6qwtrGGG5b9BO+vpzGxoEFlBQTUhLryOY2FGOdu5vHVv9lmzO6JhNWjstpxiF5Jmt+PEUICPiBg2EemI7KWcvpzouhr0o7TGnA+w05YPYw94U2/w+lirI1RwpadgIBhNYOiKIYu9zm5fNkfhtsK1gxh9aisUsmTmOtJ858R2XBPXEDA8A3InCSK8H41sb2rll6tJgirZ5/hfy97AC9fALV4CWUOAQHDoh8A5x5F7CVMWP5v1dpQVzVDWNvYw+dEt5P5dgpRBGQhfgIChpKuNKMxifB6A0c0/kRKeJHaqZGsGcKSyoVNIl+69SlUvkLuHkW7xVdAQMAQkJXHGkuarcPYJXJye00k2mtWYT3dNM//ZbXMIaisgIChtINeBe8uZdFt63pcTyCsnagsEGlryzB+KWl2H8ZIKHMICBh0ZMSxBb+aiFt78so1hpq71LSH0RetXof3lxOFMoeAgEG2gpWL0Xy+EYk+KwtXbdAiRmrw2KeavIW5p+ZD5Htk2RriyAZrGBAwiOqqMYlw/tsc8R8/AaBUm4cR1CRhCagWi0YWrXgY5z+H82VUTTjRISBgwNVVd6L9Pky8RE4+2dVSGUNdEFaF4UuVBts8/ud49z0KsUXCPsOAgAE3NJVE+2U9iXapXWFQs4RVUVkYrr12C1YuJXN/qzrFkIAPCBgoK9idaFd3W60m2utDYVV9tIBy+cq1qH6DUYUIH1RWQMAAWEEFNTi3AbWfkyW3r9di0UiN369Q04TVU+YgKMi1bEl/UknAh32GAQG7ObgyGgsW7/4H/7x7KgKhpLX/2nVhsqsH/c2b/g6MfAdHjiEKURcQ0K8R5THGo/oHfHaKLLn9d6rdwqC2YeqqnctP/QDVFTSEfYYBAbuhAByRjXB+MUtuvw9qO9Fed4TVXebA13+0ETWfJ8s3gpqKDw8ICOgDMpLIkuYr2ct8tx4S7fWpsEqlSgLeP3wPnm/T2GCRoLICAvqgrBSvlsxnOP8V+fKKh+sh0V6XhNVd5iBtazMSWUo5vRdjLBrKHAICejeINKOpYMBfzf38qFsI1NNXqKsclpSokNN/L7+P3F9XuYA17DMMCNi1ulKPGEs5+xvGXymrVpXrTV3VHWFV2r26bUD1JtL8biIbhfsMAwJ2ZQbFE1mL91ey76G/rgiAUt25k7q8/08VQYAFs49H/XWobwKh+mlAQMC2dJUTGyF3d4M5UxYv/796KWOoe4W1FdMqndndqP8+SQwSVFZAwPbVFWCNReQ6Fi//G9RPGcOIICyR7jKHVRsR899keReqNpzmEBDwLLpyxMZQzn6Iydb07NGtX6FSr/1QrX4/b9reZGYRDfFplNMMJA5RGhBQHSYeR0MUkZbns3j10npLso8oS6jFopGFq57E+yWk2SMgUSgmDQh4lrr6AUR1r67qmrCAp2tICo/di9M1FGIJuawaGCaqvlofFyaPYTUhgLUG4Yae3FV3aVAgrOFUWT97EjFfI83XV1VWKCYdnjHiUBRjDMZUT4gNJ2sMT1eoJzaWNLsLzIhQV/WvsLZWWfE+v8H5lRRikFBMOvSzuTqstYg+iver8H4Voo9ibfdxQEFtDe10npPEgueObnVVq+e071GE1bNlZ+F1T2LkVtIUEBMGyBBbD0VxroSzk0njk0njk3F2Ms6Vtlq9DX0yVOpKJGFL+RHUfL/HiRAIq0ZQ7HYk96H8EiM2HKU8lGSlj+DtNNwLLpG2ZRvl6lufkqtvfUralm3EveASvJ2G6iOBtIZqFhdHbATVH2PivwJwcWlEtLuMkFHTXeJQIJPP0Vg4n65yCpKE6B1kskIfATlVFq+4c6e/PH/GkaDXg0wcSbFXoz1TZnShwJbyB1i0YmG3ExkJX21EKCwB1ZYWKwtXlclZRle2GSRGCSprUMnK94qsACq/I6dW/k1QWoNuBzvTh7H+ZwJKS4sZKV9vxHwRJk+uDIBE/gr6UyIjEAhrEG3gepzpFVltQ1rOnIrq+kBag2gHEys4/xOSxv8D4Mb2ETMORg5hda8WXrHiftTcSRIT8liDxlmPIHKKtPWerHrGU9uKOxE5pWIlAwZpMgHVm/jKzRu0WDT1um9wRBNWjy0UFMl/RmcZIAqz+EAPCH0EJ31SVttXWnJqlbRC/wxc7ygQk7rNqHlAQFm3bkTlCs2I6rBuW+j9Iyh/xFoTVNaAzdwKfj24U/ujrLartHCnVp7Z/fyA3WtUVawBWEeje2SbMREIq4ZhoydQ/oEVUAkDYSBsBn49mFNk8Zo7B2x8LV5zJ5hTqqRFIK3dblGPNSD6NyL/eDVXMqK+4cgirO481oa/P4TyW6wFCQpr98lKH8GZU3bHBu7cHpqtc1qBtPrdW6pEFrzcy1du31Dlq6CwanZ+6c5jta9LEVmHNUFh7bYN1Ecw5pSBsIE7tYemh7SCPexvf4kIzoHR+wRUm5sjIRBWfSB2/2RLF6BxGAD9JCvVDXhzilyx/K5Bn2yuWH4X3pyC6oZAWv1UVyIx5fwhVB8GYMKEEdeGI4+wupOMZX8/np8ThcR7/2ygX48175alg09WPaS1dPldWPPukNPqV+t5IgP439FZJawRlnAf2QorjzoRfQwTEu/9IKtHMHZIlNV2lZaxp4SK+D7nQ6r3SZnHaPRbKh+WRtzXHIGEVe2kJOtE5QlEKp0Z0DuyUl2PHx6y2tYe2lNCRXxfG05AeYrYdgFwMUFh1Ty6O6nSaU8iYY9t75WVPjLUNnDX9jCsHvayCysKS/QJyi/srKquoLDqQBpXUH5hJ+i/K4QVznnfRbB70BxnTx9OZbVdpeXs6aB5yEMGjFBLWA32trYMzOMYCXPzzsmqclIofBYe+kHtvd9DPwA+u9XJpQE70shGAPN4JfYDYdWLwFLt0Vm6qfppoKwdhbmK4NwGnL1c2tbWXKBL29oMZy/HuQ1oRS6HbttuS+nWMd99RlwgrHpAz/k/sinksHZGV6oYMShryU25Zt8zN2WUtZV3DfZ+BzO1YgwglYWKYrMNCqteMHl9N0ttCauEAXuIVpZqqrYJgHUTRmTMj0zCKnVUcx06Ae8rnRmwnVlZBK8eYQqRL9Tse0a+gDCl8q5BMu9EMQM6GoD29hG5SDHiCGtb7y6jq5+GIN+RkRBVrB2Pdedq65S45vqzdUqMdedi7XhElXAW/I5aSraO+W1zuYGwar/7Wltj8GPwGkJ855xlcc4BH4dJh9fe+006HPh45R3Fhv7a4dQDXgE/phL7IxMm9HRA5R5HibDuWj1n5hE1M+mcM/MIrLsWJKreNRmwE39fsYTyHAr3N3bbjUBYdeAJASjc34jKPtVODBpr1/MzIBNx/ts6d/hJS+fOPALnvx2uBetLoynA3mSuAYCLgyWsfXR3UuYaEPYKRe59JC2RCRh3w3AqLT1n5hEYdwMiEwJZ9Xqirigs0X1I44rC6r5gOBBWLaPaSZ2mCfFjKzeIhIDvm9IyE/HDQ1p6zswj8O4GMEFZ9annVPAKnrFEeeNI/Zojj7C6bwlplP3AHEzuAQ35j76T1oShtodP20ATlFWfG08E50FkMrHst81YCIRVw1hfLRo1OpFCNAnVLNTu9Iu0BJHxGD8kSqtiA/0NiIzv+fsBfekxU7mivmEULnpJUFj1go5q0aiaF2Et1evqQ/D3l7SQiXh/g7bOOHLQyKp1xpF4f0M1wR7IandsofOAP1BbJifS3u5GWlHPiCKs6olAqi3HPAfk4IpEDqUbu28PZSLW36DzB560dP6MI7E9ZBVs4O51l+A9CPszab8xABQDYdUuLi5WOmesHYOyf9iWM5CkZSaAv0HnTx0w0qo8y98QclYD1qKmkrOVV1OOKnmsEbZSOLIIqzvJqHYioq8KCfeBtodmAtjrB8IeVp5hr6+SVbCBA8JXVYWlPB/iMduMiUBYtTy8/HMpJPuFhPtgEJdMxOr1u2MPKzZQr98qZxUwML1jUE0ZVRiFcJgqMtLyWCOGsJRq57S2PAeR43s+DQNiMEbGRFT7lYjX1hlHorp1zipgYPvGkGagegTnzHhhxRUWA2HVHLo7xTz1EoS3krqRqyCH3x5WKuKt75PSqibYrw8V7IM8pnOvGHkTqb50pNnCkTOgS6XKcRoibyKOX473edgwO8ikhZkI29rDre3HNv8/f8aRoNeHCvYhsIVoRkM8iohZet60wkiyhSNiQHeXMzDv7eNRjqW6syoMiqEgLZmI6vXaOutobW2Ntz5HXEC1tTXW1llHoz05q0BWgw9LmoFwOJm+aCTZwmhEdM/FRYGS4rOXYs1byHJQteGQhiEhLUVkIsatQh64ROfMXoyt3m7jxGIfmI/yCaTnLKvQKYPfLQavDuEQsAcBfxwpt0DXffB0nzCqIMyd8XFGFz7D5nIZoRACdyi7QT3WWnKnCBurn+5LZKV6+J4JZDWkXZJRSCI602+SjH2/LLzuyZFwk079W8LuSt75M1+M4RjSTEGjELBDPfFVTy4VcaiMQ2UcIm6rk0IDWQ3tFGIpZ2DNdLInXjNSbKGMjL5BmD99LkmymHKWI4QBMuxdEuxfjaismM70WySPnisLf1b3KquuFZYWq+8/f+aLUU7BOR8GSs1MhKEPhn/aiChnipWplMe+eiSorBGRw2L+cXNJCovpynNMUFcBAc9SWV3ZdcR+gSxcVdcqq24VVo+6OvfYF4E5Fed9d0ljCNKAgO6BIhFdqUc4idy+UUHqWWXV9eBWEBbMaCWJltAZ1FVAwA6QEUcRabaMss6Rr6/aoIpIHd6IXpcKS7uPjGmd9hJUT8N5F9RVQMAOZ/aoUkhqjqIxfks9V73XJWFVb2ATrH0ncXwYqdfqymBAQMCzfZSAOKw04fMPM3/mi0VQrcOz4uqOsHpyV/NmHoTh1Ertj4aixICAnZNWRO5ykugtOP/uYAmHRNkiUsLrtGkFcOdQSF6N9w4Jm5wDAnoBS+4dkTmbBbNeXxEAxboaO/U10LtXN17I2xD7XrZ0OVTiEIcBAb1RWWJQ70miF+P9B3VBy2gplXw95bTqhrAq6qrk9cIZ+2HNh4hNjIiv+POAgIDeDSSJ6Ew9Rk5CN79hGyEQCGsgLXg10f6UP4kkmk6aOyCoq4CAvg0kwYgjNgnoh3XBjP3qSWXVBWH1rGbMO/YgrJlP7vKwKhgQ0G/EpLkjiafh/En1VPle84SlVFYztLU1BjuXhuRgvPfhNNGAgN1SWpbc5URmPgtmT95GGATC2g0Ui6KKYB48FGPeTWfZocEKBgTsJmMZvPcUkoPxbp62Tol76hsDYe2GuiqVPOcePRbcx7HRviA+XN0VEDAgAyyms+wwvBuz76GqSK3fFF0XlhDXcCzGTCPLc0KiPSBggESWCIgnivZF7Mc49+ixUqKmE/A1S1hPXywx8yAsn0LEhVucAwIGHDHlPMfIdFJ7RLCE/bWCguqNLRb8WSTxgZUNziHRHhAw8CyggogjSS7k3Nkv6ikhCoTVe8YC4M4tr8WaE+hKc0bKDT8BAbXnDS1Z7miMD8Xnp9dymUPNEVaPujpt2t7gP0IUvYTKVVJBXQUEDBoTmIjN5RwxZ9E6fYqC1GKZQ81aQvaSYzGmhXKWERLtAQFDwQVKZF+E0QtoObShWuZgau0la0tdgXLWjBcCFyHSfXRMQEDA4A/AiHLmEPN2xo55W+U45aCwduyku5N9sZ5KHL2J3PnqnXYBAQGDPwAFEcWaBJFLWDDjhbVW5lAzhNXjmVunTyGSeTgf9gsGBAw9InLniM0b8P4ULRZNLSXga4Kweqzgmc0FRD5EFL0QVQ37BQMChkVpWbzPsNE81v/y4O4xGghrK8ZSEAqNh2PlRMqZI5QxBAQMF2MZvCqJ3R+fn60t2FpRWcNOWN1lDMw9bn+sfBYjCSJKOKM9IGA4SSumM3VYOZXx096sILWgsoadsITq7R3KScTRFJwL6iogoBaMIaJYOw7PJ7igeVwtVMAPK2H1fPnzZh1AEp+F8xkaEu0BATVCWRFZ7hAzlc7GE2qhAt4Mb3ug2jolJnPnE0cH4T2hoj0goKZISzCiGHshc6cduI3Q2JMI6+kv/bw3E8mZbCnnIMEKBgTUFmMZnPck8StB5mmxORpOlTUshNUtLfW8aeOxWQkxEUaqoisgIKC2OEsiOtOc2J7Kv/Z63XCqrGEhrB6GTvUkkvgI8pBoDwiocWMIxozD+I/ogpbRw6WyhpywuplZ5884kCg+n9xloaJ9V00WEDDsiEjzjEjegTx17B6jsHqWRtUvIIkOwHtCRfvOeqjilSuV/wEBwxmLahAcTj7JmSc8fzis4ZAShYJoEcOCaW/F2lPpDIn2nTaXCHi3HiMQWUHJQ7MEDF9EiiX3ShwdQiE9vVuAjFjCElA2NDeh5lOIGVt1xiHRvv3o8FgDwq9x+j1UUxrjCMWj6kP7BAwLBItzGZFZoGfPnKJFzFCqrKG3Ym7UbIRjyF0ejo7Zub7CeVB9GT77PFl+Eam7m8QaksiAOjTktwKGnLEErwZrn0+kF3FX85Ce5mCGZuxV9iHpgtkHEcmnK3cLhoP5dhEXBu9z4vglxNHe0rb6v3my6xRydwXOP0ASW6wIBJsYMOSxaUlTh+EEDmg8aihV1pCQRg8Du/wMkuilaLhqvpct54gjxfNSbW2N5Vt33C+LVpxL7uaR5jej2kUSRRW1FWxiwBArLZECIl/i8aPGD5XKGnTS6GHeedNeS2TeRVcWbsDpdUyoIXeCyivhX7EWi0aLLYksXbUCGfUfwAdJsx9SiC2F2AB5IK6AIXUAhejVZMkJzxrvgyd+hsASts5qwuTXkyQnkGYOCbmrXrJ9TmQjXH4Hne4s+caaB7SIgWYDHV5KeD3ryP1JCu/H2pnE0QHkDpzPAUtY0AgYXHhEHEb+jvMnsHjFH7ZxVHWrsESPw9oTSLMskFUfFZb3oPoKRiejKh8WkVJHTgnVlpZErr7zH7Jk1YfI3NmU02/h/BMUoqi6+8mFRgwYVIemHmL7ctQvENDBPoJm0GdgbZ31Qoy7BWtehfcScld9bsGMOIrJ3FGyeMWdqipSOeCw8tNi0cC6SErtqRaLhofveRfGvgcj07EWssyhSDgFI2DQNImqw9qnUI5n/JS7KZV0sFTW4AexyU8ijl6L8+GM9n6Fg3jiSDHyGm1psVuTFYCUSl5K7ak2N0esWyeydPUNPJWdieafInO/Joktka3kt8I2n4DBED2V23bGoK7Iprsb69ISKoieO+uV2GgBzmdhhu93S1oyJzg9gDGPj+6x2c+Mmo6OnPZ2r61TYrn29vWyaPWnUXcWXfnVeP9EZTURgk0MGATOsuQuR+QotkTHDq4HHQSiqnpNJfPnEtuX41Wo0Vum6yAYKgWkXqfgo70AKBZlB/5epW1tpsWi0dbWWJas+hV/2DwXL/MpZyuIjBDHFg2riQEDHaZqqqP+Yp1/wgsGK4814A9VEFpaDOM3vxUx38O7vaoV7WHFqt9Nqp7IKnl+kixeddsz81g7/IctLZbJk1VKJa/vnz2RLHsPmFMoxIfgHGQ+B7WIhL4JGIBI1Zw4isiy82XJqq/WBWEB6PktjWzZ1E4SzSTPXdiCs9stmlFIYsppGzL6Q7KofVNvz9dWEFqnRNK2NgPQuTNfg/FnYeQdxPHzSPNKoIXauIDdhwc81vydNJ0tbWv+UPuWsAXL5k3HYeVIskBWA5YjSDOHkemkT+7fzUS9nJGqNhGjLS2JLF3+G1m88gM4fR9d2XdAM5IoqpwEEfJbAbvJJwpE9mWIOXcwbOGAPrAym88ah3V3YszBOO9Dsn3A5HZKY5JQ7nov4w/9Zn+Xjis2cb1IqSPX1mOeg8QnI5xOQ3I43kPqgk0M2N0URo4xm/EylY2Nv5T29gGbCAeUTAQUyd5BHB2M83kgqwFtXEPmFSfv5LGfVu6IK/a9/6S93UmpI9dicyRtd/xblq78GsbNoZx9ldz9mYY4wphw9lbA7ogggzH7oO7CgSSrAVVYVXV1AAVdQa4vIGwNGfiZS3EkUYqmR8vCVfeoVm/N7u8Di0XDQ8tsT36rdcbhWOYDJ5NEhjTPQE2w9QH9cAQOazJU3874N6yRUmlAVqUHTAFV7Ik7D2NfXB1CgawGfOZST2SbcHKsts5q2h2ygmrRadvaTFtarLZgpW3FD0AWoP4sylkHjUlMFFkgQwllEAF9iVYBGvD6FTb+aMxA5bMG5CHa0mLZ96lDMHYNzo+u7hcMhDXwqGwcz/295Nl0ufqOf2kRI6XdJxMFobnZSkdHDqBnHvNyGuIzEGmhIX4F5Ry85tULQ0LfBvRGZeXENiL182TpiqU1o7AqPlUuwph9EEwI6EGDQb2jYA+ksfAmbW4esFIEAZWOjlwV0dYpsXzjjj/LkpWfxOtZdGVXorqZQhyB+rCaGNC7oBKL05zYfFTnHj9Zdfd5YbcJS4tFowumzUDM7GoZQ0i0D6bQVlGQGOc/yKsbm6SE70/yfccxtlW1fHNzJEtX/pgJfz8H+A/SbBlRZJ+2iaFaPmAX8eoVrH0Rmp6xuymM3baEqggXTB3DFvMjrD2wehVVUFeDL7Ud1hq8zsM9/HUmrXWUGJQd8trSYrtXevScY56Lj08HeTcN8etIc3DBJgbsKtuAQ2QDuT+ex0f/andWDndrZhZB2SItxNGBeJ+HoB0yqV29p9B/Ctlv8kDksHZm9yvXszVHcsUd/5LFK7+I+jl0Zl/D6yMUogjFBZsYsGNXoAZrJmH4SHc8DbnC0iKGB487kEK0AvXPQyXkroZ24qqck1XOlqDRh2hb1lnt0EE72kOLRcO6dSLt7U7Pm1Ygj5oRfy6RnY0CeZ6h2FB/F7AdnZVjJMfl01myuqO/9nD3LGHrtC/QWPgw5TQcezwcISCaEUVdZO5EWbzizt7uLxxQmzh35vPAnYCR99FQeC3lDFQzKnsTwwQW0A2PNQbnv8/e6Ul84Y4n+xOr0t+AZUL5deBuw+u+hCLR4UJFZaXZGtL4nVx96ya0atUHm7QU4eJmK6VqGcS8aa8DOxfRt1OIJ9CVVXMXYVN1QE/UOETAuXNYsrqtP3HaZ5LpnsV17ozvkNh3kOVhv+Cwzluak0QRWX4aE9/4bSgxWAn4HdrEu+4y0tGRV2yiPQz1ZyFyCrGFLE8rE1pQ4AHVmDTmQRI9lL1f/1BfK+D7p7DmTz0S4pWoj4IVHHY4rIDXv+PdTFmy+o9DZQ13aBPnTB1LHM1E9H00NhxGOQPvq/mtcJDjnk1Z6igklnL6KVmy8tODqrAUhPOnjqHTfAcbHYn3nnCSaC3MW5WK4iy/mUdHn8aN7V3I4Cbgd2gTj9iqWv6c6a9A5UxU30UheUklv0UebGKwhhjzGJmfwTGjfyUn977MoU9kI6CU5TiMORzvXCCrGoFgyVyONW9n3OYviqAUER3ivKJItVq+cvaWlStW/kkWrfg4zp9OV3YdqluIbYRqGopO9+gJVjBmPKIf7QtZ9UlhabFo2Pir/RDXgdeXhg3ONZkfUIwYnLtYlqwqaREzlPms7cVMd45C50wdSxQfhfgPMKrhbXSlVZsoUXWjbMCeZg3F5KDT2TjqB70tJu2bJZw3rUhD4WK6QhlDjQaBx4iApHj3URav+i8uRoaVtKpn/Pfkt86e/goK5j14f2rVJlaOzQk2cU+DxxiDc3fx6OjjuLE9682qYa8IS1taLOOeegNilqG6TyCrWictYxB5kix7r7St/u5wK62K2qqkD7qr8nXetEMRcy7wDiLbQO7C2Vt7HhwGyNzJ0rb6u735B73KQVVPY5iLteOCfK9xiBi8d8DeFJLL9OypUyihO7oabMheq4SvbNQuVohryap7SPP3o3oSaf4jYhtjrUU1nL2158DgscTRl/Wc45/bm038uwziyllXmw9H5GZ8z1lXATWvtKorh1Z+y18ePFSWrd2ydenB8L7admxixDsxnExD4TV0pmE1cU9yBIXYkKZFWbzqP3eLsLqviMJOWIO1R1Sumw8Kq46CIaMhiYE72fLEydLWsVGbm6PusoNhf70ihnUt0kNc5858DU7PRvXdFOJ9KecpoqHodMTDO8Q+gephbBz1p51NqmYXbKbY/U5E5DBy7wNZ1Z09jOlKM4wcSdNzbtHWWS+Ujo5cW1pqggCkhJf2dtdjEy9f/huc+QjqW8jcMpIowQSbuAc4Q8HIOLyetysHIDtVV3NnPhfxt2PMgaiGdq1npdVYiHFuLZvcBXL1ih9osTmi1OGGMxH/rHgrFqWnDOK8ac8n5+0grTQWDqazrKi4cPbWSBVZ6rGyGZWTmLD8+zs6MmnnhDVv+gVY++VQ0T5CSKsQxzj9P/L8A7Jk5bKafM1nEtfcma8h8mfhOI1CPI5yniMqwSaOvAjFGMG55bJk5ay+K6xzThyHK/8UkZeEGW3EhEQlEe/1//D+q2wZ/zW55pqumnzVrYtOW2c1EfnX47kQYRZGBKdl0DhsvB9R8ekxlPHyRpYsv2976t/sKFig63CMeSnBCY6UYFBElcx5mgovAfkQTRuO7s4f1RqkVPKVk06LRtqWbZFFK36ATech/my8X8eohkKFrDRDQ5SOCAhgpBHxp+8oU7FjhTVvxq0YZodQGCHKCjU0Nhi6uv4OchPeLSORv7Bw1YO1ksfqtU2cd+zBmMKJqDubhsL+dJY9Io5waOBIUVlPUMhfLpeteaxXhKULZh+E+F/gtBAKReu69x3gSZKYNH0ckWsQ9y2SvX8vl7V31t232eoORgXhnOlTUDkN1TNIkjGkaXWFKeS36hieyBrK+Vk8Pvqbz1w1NNu1gz6fAzQEqqpXnlIPZFhrMRJTzq7DM5vcfEKuWP1Luay9U4tFo3WmRnrIqlg0AipXrPwFufkETo8nTb+FSk4UWZRwGkT9wpA7xfC+7ZU4yLMJqznikaa1iLw6tF0dCmo0BxMTG0jzuxH9Ki66U9qWbeyZkEolrXUb2Geb+J6jxzE6OQzlIuLoLTgP3qeIxMEm1mP34hDeIItW/HrnhFVZkXkMTxLsYB3av0IS05U9ACzC+3ZpW/XXkURUuySuOVNfRhKdiPJempLJdJYdKhq2+dRZtxojZO5DtK28bOuYfTZhnT37UAr6E3zYhlM/9s9kRKZA7lJE/gdkIRsbf9mz5UWRobiYYriJqzuwtVg0PPKLyRidg+oZxNEYsjyrpEBCfquOcBMT3nDy1ue+R8+araL8YDSUttSJ/csQkxCbApm7B9VPkeVr5arK6ko3UY10sqrOvPr0dy554Hd6+rGfZHTyXTL3YYzMAlOxiapRqN+qixB/JXfdZYDtExbForD+p68g1DLUOlVVqr0bCwlbyr/H+StJ3a1y1Zq/9Ew8DM11XzVHXIJWbCIipds3Az/U1uP+AvbN4C8itoeSOkBTCPmt2p6QmcgRQMfTH247y6xbJ4hMDscf17L904zERqg8RWf6VYxvYd83flWuWvMXpXKOu8CIy1X1VW1JCd/THm2rH5LFK74LchqZ/yjov2goJIBD1YXAqtmAb3rmJ9sS1uTJiopuxXABtWP/UowxQEyeLwc5nqeyT8qi1fdJqeS1iNnTiWq7xAWqWlWci5f/HxM2fQUjM+nKLgPdRBJZ0Ky6aBFQU91n1rFugj7jw21GhTDvuE9gok+jGpLuNWP/gIYkoqv8Zwyfw0Yr5L9ve2Qb+xeIatdNuXXh6enHjmK0OQRjPgIys3IjcSiDqJmoFxG8XsqSFRduHdvRM2ckVfvbsDerJvrMoTgKcUI5f5Ku7CrUXC1XLP9dIKp+TtlVmwgg11bzWwtm/Bn80Ti5gNENh7CpnCOqIGGbz/BSluL9H58Z38+uTUmiP6NeyLuFdMCQd5SQYUwCWNL826hcxqb0vuogYzhudh5JNnHrNpRFKx4GrtP5M3/Cluxk4P00JJPoynJUJRwJPjwJECIRiO/ZTv89UzY3N7C+6a8gzw0tN+TIUCISK6T5z1DzefKso6dMIRDVYIyNp+u3mpsjXjn6IIyeCbyX2D6HNE+BUAYx5PAPE/EiWbiqvPWn2+mEI1KUv2zFdQFDYf/QlCSKUX2Ecv4R1L9Lli6/Wa5a89jWq3+hrQZRcXV05LJ0+W94Kvsk4meRuZVYSbDGQNifOIT6ClR+ydg3Zc/84bMt4bp1wlj+gaivjJGAwesaVTApkSngHGTuWoz5Ku7he6VtbRZU1dASl4JUGvz2zcCPdN6xZ5Inb0Xcx0mS15PlVFYUQ35rcDtDFNV7KJXYpSUE0AUzT8PKtWRew37CwZpFNEcloiES0uxOvC/S2fBbueaWJwJR1Y5NBNBzZ7+Y3J+A+HNpKLyUrnL3Nh8TiGsQml81xcihz9z4vANLCIzfdAtOfxVs4aDZv5yGQgz6d7LsfWzecqosWf1DueaWJ8LqX23ZRAC5/La/8WjTQjJ/AuX0q6h0VY6xURds4oBP5CD6Y/Ln37eDvtnBv5w//QKM+QpOg8oaoHkD0YzIJmT+SUSuwrsrZemqdTua2QNqT3H1nC8PH8JzXGXTuZZBw+kmu9/QnsgYnH+PLF5x7fZ+ZccrH0lyNerXhy4YkFkjQxBEEnK3Cm9m4uST3WQVVFX9KK6e8+UL+XtBTibzvyIxheo4yYIj2Y1xIhic/wvl6Jad9MVOnjB3+lKszMFjwuzRny5Qh4jSmERsKT+AcBEmvUOu+N9Hg6Kqf7UFoB88bhKpmYXyCRoK+9NVzlBMqN/qjwPB4/0SWbrq3D4TVuXM7Fmvw5q1pJkLHdAnovIIOUmckGbrMeZSMved7sP0AlmNMJsIwtxpB2JNK8rZxHYUWZ6h2FC/1YfJPYktqR4tS277/o5+zexUBr/6od+S57dhjA1St9fzRIo1BhVD6q7HMZPs4Ut7Tv4M9m/k2URQWbpqHbn5OF6OIvU3oFisNShpGDu9GDXGWNL8m8TZj3fR7rt41vypU8CuRBkXZoudNnoOGCJjyN1v8PbDFPJ7ZOGqJ4Oi2sMU13nT9sZFr0b954mjt5LlleOrwzVkO6ArVYR/4P1RsnT133f2y7smoAlv/hVwNZE1YQl3B/YPzShEEaKP4fKP0pXMlrZla7rJKiiqPUdxAcjCVU/KomU/IvJvJ89aQR+mIYmBPJy/9azxo0SRwcniXZFVrxQWgJ5xwj40Zt9DOKz6b8IsUSFvT2wjMr8Jw1Wk7muYjX8KVepBbW19ZDPnzX4Rzr8b9R+iEI+jnOWVRaw9Pi+sgOL1x2zSWXLd0xP8bhFWxRpOm4rKchBBsHt0Iys5VmKclkHXIPoVGvb6WT1eThowRMTVOiUmeu4rQN+HuvcR2SZyt2cn5lVzRAySvUUW3f7T3vyT3jfUhL3uAvkWVuweaw0rcl6JbYz3v0F5F7GeLotXdQSyCtipTWxbm8mi2+5jQ+PH8OZIcv9twFQWaPbA+i1VRxRFqF7Khn1+0Yc27cPfaJ21L5H/X1QP2qP2UVXKFFz1zr9/Al/Cm+9J27L7w7AM6FdILWgejR/9Oox+kcgeSup89c6fPcG9VMqkVJfxpD+tN1awX4QFoPNmTUf8iuqu9XjEmz/RnMjG5G4LmCuxsphHGv/cc+dfyFMF7E6IXTBrX8r5STgp0ZDsRzkd6fcnarVI9A+k9ii5qnLU9+ARFghzZ7RSiJaQZSOVtBTFYSTCaw7chPivsKXzt3JNR1cYZgG7H2BbX/yKYcNJL8CXT0P8hcTxGNKsUiYzsvJblXElbID8TbJ4zQP9sNn9+KutrTHRg5/FmgvJXD6yrgFXByJE1pDl9wEX4W2HtC3bEoZZwKBGXndiXt08lDlEphHnM1RHRmJetUxsC+T6Ulm8/P/684h+56AqxXHmWkRm47T+SauykKAUEks5fRjDp5D0u937/gIChiwUz5tWIPWvwdgLgZMw1uJ9DljqMW+sVHLAoxpiNndNlsUrft/fR+3Wl9d5b5+AlO9EZDLe1+d+Q0VBHXEUkecbEfka2OsYf9vvu6+ECggYHsU1qwmbvgmJPglyVCVava+v/JY6xFi8fxjjDpNFa/6yO0/bbbbW98+eSOq+Rmxnk+U5IvWitBTUY4zFeYdwE44vwfrfdBd+BgTURKCec/Q48sJURD9HQ7I/5aw+bKJqTmQjnF+GK7RK280P7e4jB0Re6oKW0ejmD5DEnyFN6yARrw6MqVwM7L+PsZ9m06Z7uKajHFb8Amp0dhXOnvY8InMmohcSR88hzXMQW5tHP2lGHMWk2TcR+0FZvPzxgXjqgH1RnTatwP7mQhrjz5Bmleuqas1vV26z9iSRJcs3gH6SpHCj/FflHPWAgJonrubmiFc2vgJjFgBzsKaB3Lmq2qqF8VZZCUyiiDS/FDOqKIvaNw3Uwwf0C2pra4y9/z9Q+QIi46orbrZGGtETW0vunkD5Cjrq6+w3+SEplUKeKqD+iKulJWHslteCfhjREzHGot4Nb0F3NV+l+ij4L+E2LJS2tQO6ui4DzwwY5s88CvGfxNpmcjecjVghKisW5zeD3Ai+jUf3+nl34WdAQP3aRBXOm55Qjt5G5D4JckT1wjIHQ7jft1IIWtlq47LbiFyJh57z68EYY4NGInpG8z40NX0EmIPI+EojylA2oseIqdw2p3eSy6fh+T9i0iQXVFXAiCOv86eOpcvMAPMxrEwmV62OcBnUUdYtCLzej0oJL98ezJrFQVU92twccfBer0Z9EWuPJ3d5ZXf6IP7tCtuDEcHrOrwUSdxt/PfKVERCQj1gBCsuhLOOmUQhORvlQ8R2b1LnKxegDNh4U5TuQ6YET47qdSSjL2Jh+8bBXrQaEpumLS2N7Lvp3SgXE5kXkiugHpGBO1tLq2frxNaQu38j8hXy/EppW/1QCOWAPYq4WlosY586ADHnIZyJNQ04/zTR9G/MVU8GFYM14Nx6xHSgtBG5H8rCVeWh+G5DlldSEObP3AfnTseaE4mjoypXf2+livr+PtrD57EVMvcEqkuQ/DomvmVdsH4Bey4EbT484pWFg5BoNugZWPMyfPdR9DvlAGXr36qoM62MsfwuVG4my6/FPvrUUNcsDnkiXBVh7pQIO+7VeDsHkalY81K87+Z/7cX7VX7HGME7D/IT8N9EzGrGv+GBQFQBAVsNlmLR8NDasVh/OMKZeJ2OtRHqtx5t29ITUhl9TruA+xH9X5zexKgn7ubSe7pEhqdecVjrNrSlxbJXuYkGdzxepwIvBz8FY5NudtumIbthLbj8CZxcg5GbmLjpJ9wF0tGRh/AMCNgJcXGXYcOog8k5FqOTwbwC0XHgx6EyGuS3wO9A/4LIT5BRPycfU+bxx30trKzXTGGntrRYJq8X1o/eC/IjgQPAvA3h9YiZgPcPAg8C/0D5H2x6F/u+7fGgpgIC+pmiKRYF7qps73lok8AUmPRHhSM8F5d0uFRUXRDWdhu0pcUweb3w0CZh0mhl3QRl8mQNJBUQEBAQEBAQEBAQEBAQEBCwR+H/A0I3z/JJHoKNAAAAAElFTkSuQmCC"};

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

// Off the shelf, the opening film of the data governance series. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"measure":{"name":"One measure","lead":1.4,"tail":1.0,"vo":[
 {"id":"m1215","gap":0.8,"text":"In 1215, Magna Carta made a promise.","say":"In twelve fifteen, Magna Carta made a promise."},
 {"id":"quote","gap":0.8,"text":"“There is to be one measure of wine throughout our kingdom, and one measure of ale, and one measure of corn.”"},
 {"id":"repeat","gap":0.8,"text":"For six hundred years, the promise was repeated, and measures still differed from town to town."},
 {"id":"kings","gap":0.8,"text":"Kings sent standards to the towns. Officers checked them now and then."},
 {"id":"county","gap":0.8,"text":"It wasn't enough. In 1871, a member of Parliament said that in his county alone, a bushel meant thirty-two different measures.","say":"It wasn't enough. In eighteen seventy-one, a member of Parliament said that in his county alone, a bushel meant thirty-two different measures."},
 {"id":"worked","gap":0.3,"text":"What finally worked was all of it together:"},
 {"id":"three","gap":0.8,"text":"one definition in law, a copy in every county, and an inspector who checked against it, again and again, with the law behind him."}]},
"shelf":{"name":"The shelf","lead":1.0,"tail":1.0,"vo":[
 {"id":"starts","gap":0.8,"text":"Today, Yusuf Demir starts as the university's data governance lead."},
 {"id":"shelf","gap":0.8,"text":"He inherits a shelf of thirty-four policies, and a maturity score: 2.1 out of 5.","say":"He inherits a shelf of thirty-four policies, and a maturity score: two point one out of five."},
 {"id":"chart","gap":0.8,"text":"A chart of who's responsible for what, with half its names still to be confirmed."},
 {"id":"council","gap":0.8,"text":"And the minutes of a council that meets once a month."},
 {"id":"brief","gap":0.8,"text":"His brief: fix governance before the next submission to the government."}]},
"numbers":{"name":"Two numbers","lead":1.0,"tail":1.0,"vo":[
 {"id":"week","gap":0.8,"text":"The same week, two reports disagree."},
 {"id":"census","gap":0.8,"text":"Planning's census report says 4,812 awards were conferred this year.","say":"Planning's census report says four thousand, eight hundred and twelve awards were conferred this year."},
 {"id":"draft","gap":0.8,"text":"The draft submission to the government says 4,867.","say":"The draft submission to the government says four thousand, eight hundred and sixty-seven."},
 {"id":"which","gap":0.8,"text":"Which number is right?"}]},
"decides":{"name":"Who decides?","lead":1.0,"tail":1.0,"vo":[
 {"id":"follow","gap":0.8,"text":"Yusuf follows the numbers back."},
 {"id":"both","gap":0.8,"text":"Both are right, each by its own meaning of award."},
 {"id":"monday","gap":0.8,"text":"On Monday, the word changed: microcredentials of at least six credit points now count."},
 {"id":"before","gap":0.8,"text":"One report ran before the change, the other after."},
 {"id":"gov","gap":0.8,"text":"But the government counts awards by its own definition. Who decides how ours maps to it?"},
 {"id":"answers","gap":0.8,"text":"Mei owns what award means here. Jun builds what the model says. Planning reports what it's given."},
 {"id":"tbc","gap":0.8,"text":"And the chart says: to be confirmed."}]},
"for":{"name":"What governance is for","lead":1.0,"tail":1.0,"vo":[
 {"id":"policy","gap":0.8,"text":"Policy 12 says that business terms are defined consistently.","say":"Policy twelve says that business terms are defined consistently."},
 {"id":"doesnt","gap":0.8,"text":"It doesn't say who decides, or how a decision reaches the work."},
 {"id":"for","gap":0.8,"text":"That's what governance is for: deciding who decides, and making sure each decision reaches the work."},
 {"id":"like","gap":0.8,"text":"Like the inspector at the market: a rule, a copy where the work happens, and someone who checks."},
 {"id":"mgmt","gap":0.8,"text":"Governance sets the rules and checks they're kept. Management does the work."}]},
"wheel":{"name":"Governance at the centre","lead":1.0,"tail":1.0,"vo":[
 {"id":"body","gap":0.8,"text":"Data management has a body of knowledge: DAMA's.","say":"Data management has a body of knowledge: Dahma's."},
 {"id":"wheel","gap":0.8,"text":"It draws eleven areas as a wheel, with governance at the centre, where the others meet."},
 {"id":"others","gap":0.8,"text":"Others cover the same ground, or part of it: DCAM, ISO 8000 for data quality, and ISO/IEC 38505 for governing data.","say":"Others cover the same ground, or part of it: Dee-cam, eye-so eight thousand for data quality, and eye-so, I E C, thirty-eight five oh five, for governing data."},
 {"id":"takes","gap":0.8,"text":"This series takes what they agree on, and shows where it runs."}]},
"listen":{"name":"Listen first","lead":1.0,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"Yusuf doesn't write a thirty-fifth policy. He asks everyone the same question: what slows you down?"},
 {"id":"jun","gap":0.8,"text":"For Jun, the rules arrive after the work is built."},
 {"id":"mei","gap":0.8,"text":"Mei approves the words, then never sees where they're used."},
 {"id":"sam","gap":0.8,"text":"Sam could protect a column in minutes, if anyone said which."},
 {"id":"plan","gap":0.8,"text":"Planning doesn't know which number to trust."},
 {"id":"binder","gap":0.8,"text":"The people who wrote the binder weren't the problem. They wrote what they were asked for."},
 {"id":"tools","gap":0.8,"text":"Governance is people's work. Tools can carry out what people agree, but they can't make them agree."}]},
"runs":{"name":"Where does it run?","lead":1.4,"tail":1.0,"vo":[
 {"id":"takes","gap":0.8,"text":"So he opens the binder, with one question for every line: where does it run?"},
 {"id":"runs","gap":0.8,"text":"Some lines can run in the work itself, as a required field, a check, a tag or a test."},
 {"id":"owned","gap":0.8,"text":"Some are decisions: someone owns each one, and writes it down where the work can find it."},
 {"id":"go","gap":0.8,"text":"And some can go."}]},
"enter":{"name":"Where decisions enter","lead":1.3,"tail":1.0,"vo":[
 {"id":"places","gap":0.8,"text":"And the work already has places for them."},
 {"id":"loop","gap":0.8,"text":"The data team builds in a loop of ten steps, from a question to a new version."},
 {"id":"pin","gap":0.8,"text":"Governance doesn't need another meeting. It needs a pin at the right steps:"},
 {"id":"pins","gap":0.8,"text":"a term when the question is asked, a classification at the source, an owner and a contract, a rule as a test, an approval at review, and a version when it changes."}]},
"series":{"name":"The series","lead":1.0,"tail":1.0,"vo":[
 {"id":"next","gap":0.8,"text":"Over nine more films, Yusuf takes the binder off the shelf, one kind of policy at a time."},
 {"id":"tools","gap":0.8,"text":"Then six more show how to build them, with dbt and Databricks."},
 {"id":"wish","gap":0.8,"text":"A policy that doesn't run anywhere is a wish."}]}
};

const VODUR={"measure/m1215": 2.845, "measure/quote": 5.828, "measure/repeat": 5.352, "measure/kings": 3.939, "measure/county": 8.459, "measure/worked": 2.012, "measure/three": 7.933, "shelf/starts": 4.229, "shelf/shelf": 5.754, "shelf/chart": 4.527, "shelf/council": 2.693, "shelf/brief": 3.754, "numbers/week": 2.214, "numbers/census": 5.46, "numbers/draft": 4.87, "numbers/which": 1.196, "decides/follow": 1.755, "decides/both": 2.801, "decides/monday": 5.217, "decides/before": 2.803, "decides/gov": 5.083, "decides/answers": 5.801, "decides/tbc": 1.953, "for/policy": 3.939, "for/doesnt": 3.568, "for/for": 5.76, "for/like": 5.484, "for/mgmt": 4.16, "wheel/body": 3.146, "wheel/wheel": 4.994, "wheel/others": 10.588, "wheel/takes": 3.181, "listen/ask": 6.231, "listen/jun": 2.899, "listen/mei": 3.051, "listen/sam": 3.332, "listen/plan": 2.006, "listen/binder": 4.132, "listen/tools": 5.806, "runs/takes": 4.424, "runs/runs": 5.647, "runs/owned": 4.831, "runs/go": 1.014, "enter/places": 1.837, "enter/loop": 4.584, "enter/pin": 4.036, "enter/pins": 10.025, "series/next": 5.633, "series/tools": 4.071, "series/wish": 2.455};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the inspector's stamp, then the title; and the ending. */
const BREATH={
"measure":{"hold":{"quote":0.6,"repeat":0.6,"kings":0.4,"county":0.8},"breathe":4.6},
"shelf":{"hold":{"starts":0.4,"shelf":0.6,"chart":0.5}},
"numbers":{"hold":{"census":0.4,"draft":0.5,"which":0.8}},
"decides":{"hold":{"both":0.4,"before":0.6,"gov":0.6,"answers":0.4}},
"for":{"hold":{"doesnt":0.6,"for":0.9,"like":0.5}},
"wheel":{"hold":{"wheel":0.6}},
"listen":{"hold":{"ask":0.6,"jun":0.5,"mei":0.5,"sam":0.6,"plan":0.5,"binder":0.6,"tools":1.0}},
"runs":{"hold":{"takes":0.6,"runs":0.9,"owned":0.9,"go":1.0}},
"enter":{"hold":{"places":0.5,"loop":1.0,"pin":0.6,"pins":0.8},"breathe":2.2},
"series":{"hold":{"next":0.5,"tools":0.6},"breathe":5.0}
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

/* ===== The data governance series: the toy town =====
   The university is a model town on a table, drawn in 3D with Canvas 2D: a camera, painted boxes lit by one sun, rooms open at
   the front like dollhouses, people as painted figures on small bases, and a tilt-shift blur that makes it look small and close.
   Words wait in a queue and are drawn after the blur, so they stay sharp. The town's coordinates: x east, y up, z north, in
   metres of the model's own world (a person is about 1.7 tall). Buildings stand at an angle: mxSet turns their own coordinates
   (x across the front, z from the front to the back) into the town's. */

// ---- vectors ----
const v3=(x,y,z)=>({x,y,z}),vadd=(a,b)=>v3(a.x+b.x,a.y+b.y,a.z+b.z),vsub=(a,b)=>v3(a.x-b.x,a.y-b.y,a.z-b.z),vmul=(a,k)=>v3(a.x*k,a.y*k,a.z*k);
const vdot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z,vcross=(a,b)=>v3(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x),vlen=a=>Math.hypot(a.x,a.y,a.z),vnorm=a=>{const l=vlen(a)||1;return v3(a.x/l,a.y/l,a.z/l);};
const DEG=Math.PI/180;

// ---- a building's own coordinates: front centre at (x,z), turned so its depth runs towards the angle deg (0 north, 90 east) ----
let MX=null;
function mxSet(x,z,deg){const a=deg*DEG;MX={x,z,c:Math.cos(a),s:Math.sin(a),deg};}
function mxOff(){MX=null;}
const mxP=p=>MX?v3(MX.x+p.x*MX.c+p.z*MX.s,p.y,MX.z-p.x*MX.s+p.z*MX.c):p;
const mxN=n=>MX?v3(n.x*MX.c+n.z*MX.s,n.y,-n.x*MX.s+n.z*MX.c):n;
// and back: where a point of the town is, in the building's coordinates (where the camera stands, seen from a room)
const mxL=p=>{if(!MX)return p;const dx=p.x-MX.x,dz=p.z-MX.z;return v3(dx*MX.c-dz*MX.s,p.y,dx*MX.s+dz*MX.c);};

// ---- the camera: an eye, a target and a focal length in pixels ----
function cam3(eye,tgt,f,o){o=o||{};const fwd=vnorm(vsub(tgt,eye));let right=vcross(v3(0,1,0),fwd);if(vlen(right)<1e-4)right=v3(1,0,0);right=vnorm(right);
  if(o.roll){const c=Math.cos(o.roll),s=Math.sin(o.roll),up0=vcross(fwd,right);right=vnorm(vadd(vmul(right,c),vmul(up0,s)));}
  const up=vcross(fwd,right);return{eye,tgt,fwd,right,up,f,cx:o.cx==null?W/2:o.cx,cy:o.cy==null?H/2:o.cy,dist:vlen(vsub(tgt,eye))};}
// a point in the camera's space (x right, y up, z ahead)
function csp(C,p){let x=p.x,z=p.z;if(MX){x=MX.x+p.x*MX.c+p.z*MX.s;z=MX.z-p.x*MX.s+p.z*MX.c;}const dx=x-C.eye.x,dy=p.y-C.eye.y,dz=z-C.eye.z,F=C.fwd,R=C.right,U=C.up;
  return{x:dx*R.x+dy*R.y+dz*R.z,y:dx*U.x+dy*U.y+dz*U.z,z:dx*F.x+dy*F.y+dz*F.z};}
// a point on the screen, its depth, and how many pixels a metre is there
function pj(C,p){const q=csp(C,p),zz=Math.max(0.05,q.z);return{x:C.cx+C.f*q.x/zz,y:C.cy-C.f*q.y/zz,z:q.z,s:C.f/zz};}
const pjc=(C,q)=>{const zz=Math.max(0.05,q.z);return{x:C.cx+C.f*q.x/zz,y:C.cy-C.f*q.y/zz,z:q.z,s:C.f/zz};};
// camera moves: keys [t, eye, target, focal length], the eye and the target in cylindrical coordinates round a centre
// ([distance, angle in degrees with 0 north and 90 east, height]), so the camera swings round the town rather than cutting across it.
// Each move eases in and out like a sine; a key may hold a blur band too (ts: [top, bottom, amount]).
const cyl=(x,y,z,cx,cz)=>[Math.hypot(x-(cx||0),z-(cz||0)),Math.atan2(x-(cx||0),z-(cz||0))/DEG,y];
const fromCyl=(c,cx,cz)=>v3((cx||0)+c[0]*Math.sin(c[1]*DEG),c[2],(cz||0)+c[0]*Math.cos(c[1]*DEG));
function camK(keys,t,o){o=o||{};let a=keys[0],b=keys[0],u=0;
  if(t>=keys[keys.length-1][0])a=b=keys[keys.length-1];else for(let i=1;i<keys.length;i++)if(t<keys[i][0]){a=keys[i-1];b=keys[i];u=t<=a[0]?0:easeCam((t-a[0])/(b[0]-a[0]));break;}
  const L=(p,q)=>p.map((v,i)=>lerp(v,q[i],u)),e=fromCyl(L(a[1],b[1]),o.cx,o.cz),g=fromCyl(L(a[2],b[2]),o.cx,o.cz);
  // a slow, small drift, like a hand holding the camera still
  if(o.drift!==0){const d=o.drift||0.012;e.x+=Math.sin(t*0.37)*d;e.y+=Math.sin(t*0.29+1)*d*0.7;}
  const C=cam3(e,g,lerp(a[3],b[3],u),o);const ta=a[4]||o.ts,tb=b[4]||o.ts;if(ta&&tb)C.ts=L(ta,tb);return C;}

// ---- light: one sun from the upper left; inside a room, the light comes through the open front ----
const SUN=vnorm(v3(-0.55,0.8,-0.35));
function shadeCol(col,n){n=mxN(n);const d=Math.max(0,vdot(n,SUN)),sky=Math.max(0,n.y)*0.12,i=0.66+0.4*d+sky;return[clamp(col[0]*i,0,255),clamp(col[1]*i,0,255),clamp(col[2]*i,0,255)];}
const ILIT={F:1.0,U:0.98,L:0.9,R:0.86,D:0.84,B:0.72};
const ilit=(col,k)=>[clamp(col[0]*k,0,255),clamp(col[1]*k,0,255),clamp(col[2]*k,0,255)];
// the air: far things fade towards it; how far depends on how far the camera looks
const GV={hzA:0.8};let HAZE=[222,236,248];
function hz(col,z){const d0=GV.hz0||16,d1=GV.hz1||80,k=clamp((z-d0)/d1,0,0.7)*GV.hzA;return k>0?mix(col,HAZE,k):col;}
function hazeFor(C,k){GV.hz0=C.dist*(k||1.6);GV.hz1=Math.max(30,C.dist*5);}

// ---- painter's order: things are collected with their distance, then drawn far to near ----
let DL=[];
function dlAdd(z,fn){DL.push({z,fn});}
function dlDraw(ctx){const L=DL;DL=[];L.sort((a,b)=>b.z-a.z);for(const d of L)d.fn(ctx);}
// a point's distance from the eye, for sorting
const eyeD=(C,p)=>{const q=mxP(p);return Math.hypot(q.x-C.eye.x,q.y-C.eye.y,q.z-C.eye.z);};

// ---- polygons: projected, cut at the camera's near plane, shaded by their normal and hazed by distance ----
const NEAR=0.12;
function clipNear(Q){const out=[];for(let i=0;i<Q.length;i++){const a=Q[i],b=Q[(i+1)%Q.length],ia=a.z>=NEAR,ib=b.z>=NEAR;if(ia)out.push(a);
  if(ia!==ib){const u=(NEAR-a.z)/(b.z-a.z);out.push({x:lerp(a.x,b.x,u),y:lerp(a.y,b.y,u),z:NEAR});}}return out;}
function poly3(ctx,C,pts,col,o){o=o||{};let Q=pts.map(p=>csp(C,p));let mn=1e9,mx=-1e9;for(const q of Q){mn=Math.min(mn,q.z);mx=Math.max(mx,q.z);}if(mx<NEAR)return null;if(mn<NEAR){Q=clipNear(Q);if(Q.length<3)return null;}
  const P_=Q.map(q=>pjc(C,q));ctx.beginPath();ctx.moveTo(P_[0].x,P_[0].y);for(let i=1;i<P_.length;i++)ctx.lineTo(P_[i].x,P_[i].y);ctx.closePath();
  let c=o.n?shadeCol(col,o.n):col;let zc=0;for(const q of P_)zc+=q.z;c=hz(c,zc/P_.length);
  if(o.grad){let y0=1e9,y1=-1e9;for(const q of P_){y0=Math.min(y0,q.y);y1=Math.max(y1,q.y);}if(y1-y0>0.5){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(mix(c,[255,255,255],o.grad[0]),o.a==null?1:o.a));g.addColorStop(1,rgba(mix(c,[0,0,0],o.grad[1]),o.a==null?1:o.a));ctx.fillStyle=g;}else ctx.fillStyle=rgba(c,o.a==null?1:o.a);}
  else ctx.fillStyle=rgba(c,o.a==null?1:o.a);
  ctx.fill();if(o.edge){ctx.lineJoin="round";ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),o.edge);ctx.lineWidth=o.lw||1.4;ctx.stroke();}return P_;}
const NRM={F:v3(0,0,-1),B:v3(0,0,1),L:v3(-1,0,0),R:v3(1,0,0),U:v3(0,1,0),D:v3(0,-1,0)};
// does a face with normal n at p face the camera?
const visible=(C,n,p)=>{const q=mxP(p),m=mxN(n);return m.x*(C.eye.x-q.x)+m.y*(C.eye.y-q.y)+m.z*(C.eye.z-q.z)>0;};
// a box: x,z the front-left corner, w along x, d along z (away from the front), h up from y0. Only the faces towards the camera.
function boxFaces(C,x,y0,z,w,h,d,col,o){o=o||{};const a=v3(x,y0,z),b=v3(x+w,y0,z),c=v3(x+w,y0,z+d),e=v3(x,y0,z+d),A=v3(x,y0+h,z),B=v3(x+w,y0+h,z),Cc=v3(x+w,y0+h,z+d),E=v3(x,y0+h,z+d);
  const F=[];const add=(pts,n,cl,k)=>{const cen=v3((pts[0].x+pts[2].x)/2,(pts[0].y+pts[2].y)/2,(pts[0].z+pts[2].z)/2);if(visible(C,n,cen))F.push({pts,n,col:cl||col,k});};
  if(!o.noFront)add([a,b,B,A],NRM.F,o.front,"F");add([b,c,Cc,B],NRM.R,o.side,"R");add([e,a,A,E],NRM.L,o.side,"L");if(!o.noTop)add([A,B,Cc,E],NRM.U,o.top,"U");if(!o.noBack)add([c,e,E,Cc],NRM.B,o.back,"B");if(o.bottom)add([a,e,c,b],NRM.D,o.bottom,"D");return F;}
function drawBox(ctx,C,x,y0,z,w,h,d,col,o){o=o||{};const F=boxFaces(C,x,y0,z,w,h,d,col,o);for(const f of F)poly3(ctx,C,f.pts,f.col,{n:f.n,grad:o.grad||[0.06,0.06],edge:o.edge==null?0.5:o.edge,lw:o.lw});return F;}
// furniture in a room: pastel faces lit through the open front, a fine light edge like painted wood
function ibox(ctx,C,x,y0,z,w,h,d,col,o){o=o||{};const F=boxFaces(C,x,y0,z,w,h,d,col,o);for(const f of F)poly3(ctx,C,f.pts,ilit(f.col,ILIT[f.k]||0.9),{grad:o.grad||[0.05,0.07],edge:o.edge==null?0.45:o.edge,lw:o.lw||1.3});return F;}
// quads on a plane of constant z (a back wall), constant x (a side wall) or constant y (a floor)
function wq3(ctx,C,x0,y0,x1,y1,z,col,o){return poly3(ctx,C,[v3(x0,y0,z),v3(x1,y0,z),v3(x1,y1,z),v3(x0,y1,z)],col,o||{});}
function sq3(ctx,C,x,z0,y0,z1,y1,col,o){return poly3(ctx,C,[v3(x,y0,z0),v3(x,y0,z1),v3(x,y1,z1),v3(x,y1,z0)],col,o||{});}
function fq3(ctx,C,x0,z0,x1,z1,y,col,o){return poly3(ctx,C,[v3(x0,y,z0),v3(x1,y,z0),v3(x1,y,z1),v3(x0,y,z1)],col,o||{});}
// a gabled roof over a box: the ridge along x, an overhang, a height
function gable(ctx,C,x,y0,z,w,d,rh,col,o){o=o||{};const ov=o.ov==null?0.35:o.ov,X0=x-ov,X1=x+w+ov,Z0=z-ov,Z1=z+d+ov,zm=z+d/2,yt=y0+rh;
  const fr=[v3(X0,y0,Z0),v3(X1,y0,Z0),v3(X1,yt,zm),v3(X0,yt,zm)],bk=[v3(X1,y0,Z1),v3(X0,y0,Z1),v3(X0,yt,zm),v3(X1,yt,zm)];
  const nF=vnorm(v3(0,d/2,-rh)),nB=vnorm(v3(0,d/2,rh)),gl=[v3(x,y0,z),v3(x,y0,z+d),v3(x,yt-0.02,zm)],gr=[v3(x+w,y0,z+d),v3(x+w,y0,z),v3(x+w,yt-0.02,zm)];
  for(const [pts,n,cl] of [[bk,nB,col],[gl,NRM.L,o.wall||col],[gr,NRM.R,o.wall||col],[fr,nF,col]]){const cen=vmul(pts.reduce((s,p)=>vadd(s,p),v3(0,0,0)),1/pts.length);if(visible(C,n,cen))poly3(ctx,C,pts,cl,{n,grad:[0.1,0.08],edge:0.6});}
  // the tiles: soft lines along the slope that faces us
  if(o.tiles!==false){const n=visible(C,nF,v3(x+w/2,y0+rh/2,z))?nF:visible(C,nB,v3(x+w/2,y0+rh/2,z+d))?nB:null;if(n){const front=n===nF,zA=front?Z0:Z1;ctx.save();ctx.strokeStyle=rgba(mix(col,[0,0,0],0.3),0.28);ctx.lineWidth=1.2;
    for(let i=1;i<6;i++){const u=i/6,a=pj(C,v3(X0,lerp(y0,yt,u),lerp(zA,zm,u))),b=pj(C,v3(X1,lerp(y0,yt,u),lerp(zA,zm,u)));if(a.z<NEAR||b.z<NEAR)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();}}}

// ---- shadows on the ground ----
function contactShadow(ctx,C,x,z,w,d,a,y){const P_=pj(C,v3(x+w/2,y||0,z+d/2));if(P_.z<NEAR)return;const r=Math.max(w,d)*P_.s*0.62;ctx.save();ctx.translate(P_.x,P_.y);ctx.scale(1,clamp(Math.abs(C.fwd.y)*0.9+0.12,0.2,1));
  const g=ctx.createRadialGradient(0,0,r*0.3,0,0,r);g.addColorStop(0,"rgba(40,50,70,"+(a||0.28)+")");g.addColorStop(1,"rgba(40,50,70,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();}
function convexHull(P_){const p=P_.slice().sort((a,b)=>a.x-b.x||a.y-b.y),cr=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x),lo=[],up=[];for(const q of p){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q);}for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q);}up.pop();lo.pop();return lo.concat(up);}
// a box's shadow on the ground, along the sun: a soft polygon
function castShadow(ctx,C,x,z,w,d,h,a){const sd=mxN(v3(-SUN.x,0,-SUN.z)),k=h/SUN.y;const base=[[x,z],[x+w,z],[x+w,z+d],[x,z+d]].map(([px,pz])=>mxP(v3(px,0,pz)));
  const all=base.concat(base.map(p=>v3(p.x+(-SUN.x)*k,0,p.z+(-SUN.z)*k)));const M=MX;MX=null;const pr=all.map(p=>csp(C,v3(p.x,0.005,p.z)));if(pr.some(q=>q.z<NEAR)){MX=M;return;}
  // darkest at the foot of the building, fading towards the far end, so the edge is soft
  const hull=convexHull(pr.map(q=>pjc(C,q))),P0=pjc(C,pr.slice(0,4).reduce((s,q)=>({x:s.x+q.x/4,y:s.y+q.y/4,z:s.z+q.z/4}),{x:0,y:0,z:0})),P1=pjc(C,pr.slice(4).reduce((s,q)=>({x:s.x+q.x/4,y:s.y+q.y/4,z:s.z+q.z/4}),{x:0,y:0,z:0}));MX=M;
  const A=a||0.16,g=ctx.createLinearGradient(P0.x,P0.y,P1.x,P1.y);g.addColorStop(0,"rgba(46,56,84,"+A+")");g.addColorStop(0.55,"rgba(46,56,84,"+A*0.7+")");g.addColorStop(1,"rgba(46,56,84,"+A*0.12+")");
  ctx.save();ctx.fillStyle=g;ctx.beginPath();hull.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.fill();ctx.restore();}
// a soft dark band where a wall meets a floor or another wall
function aoStrip(ctx,C,a,b,dir,len,k){const Q=[a,b,vadd(b,vmul(dir,len)),vadd(a,vmul(dir,len))].map(p=>pj(C,p));if(Q.some(q=>q.z<NEAR))return;
  const g=ctx.createLinearGradient((Q[0].x+Q[1].x)/2,(Q[0].y+Q[1].y)/2,(Q[2].x+Q[3].x)/2,(Q[2].y+Q[3].y)/2);g.addColorStop(0,"rgba(50,40,40,"+(k||0.22)+")");g.addColorStop(1,"rgba(50,40,40,0)");
  ctx.fillStyle=g;ctx.beginPath();Q.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.fill();}

// ---- words: a queue drawn after the blur, and words painted on a surface ----
let LBQ=[];
function lbAdd(fn){LBQ.push(fn);}
function lbDraw(ctx,S){const L=LBQ;LBQ=[];for(const f of L){ctx.save();setScreen(ctx,S);f(ctx);ctx.restore();}}
// the screen transform of a small patch of surface at o, with ux to the right and uy up (in metres); 1 unit is a centimetre
// (a surface whose corner is far outside the frame is left out: the flat mapping is only right near its corner, and would
// smear the far side of a big surface, seen at a slant from close by, across the picture)
function surfM(C,o,ux,uy){const A=pj(C,o),B=pj(C,vadd(o,vmul(ux,0.01))),D=pj(C,vsub(o,vmul(uy,0.01)));if(A.z<NEAR||B.z<NEAR||D.z<NEAR)return null;
  if(A.x<-0.75*W||A.x>1.75*W||A.y<-0.75*H||A.y>1.75*H)return null;
  const n=vcross(uy,ux);if(!visible(C,n,o))return null;return[B.x-A.x,B.y-A.y,D.x-A.x,D.y-A.y,A.x,A.y];}
// text painted on a surface: size in centimetres. o.lb queues it after the blur (for words that must stay sharp)
function surfT(ctx,C,o3,ux,uy,s,o){o=o||{};const M=surfM(C,o3,ux,uy);if(!M)return;const draw=c=>{const m=c.getTransform();c.save();c.transform(M[0],M[1],M[2],M[3],M[4],M[5]);
    if(o.a!=null)c.globalAlpha*=o.a;T(c,s,0,0,{w:o.w||700,size:o.size||12,align:o.align||"center",color:o.color||rgba(PAL.ink,1),f:o.f,deco:o.deco});c.restore();};
  if(o.lb)lbAdd(draw);else draw(ctx);}
// a frame of drawing on a surface: fn draws in centimetres, with (0,0) at o3, x right, y down
function surfDraw(ctx,C,o3,ux,uy,fn,o){o=o||{};const M=surfM(C,o3,ux,uy);if(!M)return false;const draw=c=>{c.save();c.transform(M[0],M[1],M[2],M[3],M[4],M[5]);fn(c);c.restore();};if(o.lb)lbAdd(draw);else draw(ctx);return true;}
// the same at a point x centimetres along ux and y down uy from o3, with the slant the surface has there: a big surface seen
// close and at an angle changes scale across it, so each word on it is placed with its own transform
function surfAt(ctx,C,o3,ux,uy,x,y,fn,o){return surfDraw(ctx,C,vadd(o3,vadd(vmul(ux,x/100),vmul(uy,-y/100))),ux,uy,fn,o);}
// a painted sign, on a post or a wall: words big enough to read on a phone
function signBoard(ctx,x,y,text,o){o=o||{};const sz=o.size||30,a=o.a==null?1:o.a;if(a<=0.01)return null;ctx.save();ctx.globalAlpha*=a;ctx.font=font(o.w||800,sz);
  const lines=Array.isArray(text)?text:[text],tw_=Math.max(...lines.map(l=>ctx.measureText(l).width)),lh=sz*1.22,pw=tw_+sz*1.3+(o.dot?sz*0.55:0),ph=sz*0.75+lh*lines.length,X=o.align==="left"?x:o.align==="right"?x-pw:x-pw/2,Y=y-ph;
  const bg=o.bg||[255,251,240],ink=o.ink||PAL.ink,rim=o.rim||[214,170,90];
  if(o.post){ctx.fillStyle=rgba(mix(rim,[0,0,0],0.3),1);ctx.fillRect(x-3,Y+ph-2,6,o.post);}
  ctx.save();ctx.shadowColor="rgba(40,50,80,0.28)";ctx.shadowBlur=14;ctx.shadowOffsetY=6;rr(ctx,X,Y,pw,ph,Math.min(16,ph*0.22));ctx.fillStyle=rgba(rim,1);ctx.fill();ctx.restore();
  rr(ctx,X,Y-3,pw,ph,Math.min(16,ph*0.22));const g=ctx.createLinearGradient(0,Y,0,Y+ph);g.addColorStop(0,rgba(mix(bg,[255,255,255],0.4),1));g.addColorStop(1,rgba(bg,1));ctx.fillStyle=g;ctx.fill();
  if(o.dot){ctx.fillStyle=rgba(o.dot,1);ctx.beginPath();ctx.arc(X+sz*0.62,Y-3+ph/2,sz*0.2,0,TAU);ctx.fill();}
  lines.forEach((l,i)=>T(ctx,l,X+pw/2+(o.dot?sz*0.27:0),Y-3+sz*0.38+lh*(i+0.78),{w:o.w||800,size:sz,align:"center",color:rgba(ink,1),deco:o.deco}));ctx.restore();return{X,Y,w:pw,h:ph};}
// the scene's place and time, top left (deco: while it turns over, its words aren't there to be read)
function marker(ctx,text,a,deco){signBoard(ctx,64,116,text,{size:30,align:"left",dot:PAL.band,w:700,a:a==null?1:a,deco});}
// a speech bubble with its tail towards (tx,ty)
function tSpeech(ctx,x,y,w,lines,tx,ty,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||32,lh=sz*1.3,h=lines.length*lh+sz*0.9,r=sz*0.8,k=o.k==null?1:o.k;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(tx,ty);ctx.scale(k,k);ctx.translate(-tx,-ty);
  ctx.save();ctx.shadowColor="rgba(40,50,80,0.25)";ctx.shadowBlur=18;ctx.shadowOffsetY=8;ctx.fillStyle=rgba(o.bg||[255,255,255],1);
  rr(ctx,x,y,w,h,r);ctx.fill();const bx=clamp(tx,x+r+10,x+w-r-10),by=ty<y?y:y+h;ctx.beginPath();ctx.moveTo(bx-18,by);ctx.lineTo(tx,ty);ctx.lineTo(bx+18,by);ctx.closePath();ctx.fill();ctx.restore();
  lines.forEach((l,i)=>T(ctx,l,x+sz*0.75,y+sz*0.5+lh*(i+0.74),{w:o.w||700,size:sz,color:rgba(o.ink||[40,46,66],1)}));ctx.restore();}
// how wide a bubble needs to be for its lines
const speechW=(ctx,lines,sz,w)=>Math.max(...lines.map(l=>tw(ctx,l,sz||32,w||700)))+(sz||32)*1.5;

// ---- the palette: bright pastels, like painted wood ----
const PAL={lawn:[126,198,112],path:[240,222,186],sky0:[120,188,246],sky1:[216,236,250],cream:[250,240,216],band:[238,186,74],roof:[228,120,98],
  paper:[253,241,206],stripe:[244,222,170],dado:[164,204,178],rail:[255,252,244],side:[250,216,186],ceil:[248,240,226],floor:[226,180,124],
  rug:[84,166,166],rugB:[246,232,200],walnut:[156,104,66],oak:[210,164,110],navy:[58,82,132],coral:[226,112,96],teal:[64,160,156],mustard:[232,178,64],
  lilac:[150,130,206],sage:[118,170,128],peach:[248,186,150],ink:[44,52,74],gold:[240,184,60],green:[96,178,112],grey:[160,166,178],red:[214,84,72],wood:[196,150,100],table:[186,138,96]};
// what the colours mean: gold is governance's decisions, and the business side; blue the technical side; walnut people of the past
const RIM={biz:[232,178,64],tech:[86,164,222],past:[176,140,104]};

// ---- the sky and the table ----
function tSky(ctx,o){o=o||{};const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(o.top||PAL.sky0,1));g.addColorStop(1,rgba(o.bottom||PAL.sky1,1));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const sg=ctx.createRadialGradient(260,60,10,260,60,760);sg.addColorStop(0,"rgba(255,248,220,0.6)");sg.addColorStop(1,"rgba(255,248,220,0)");ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);}
// the ground far away: a band from the horizon down, under everything else
function tHorizon(ctx,C,col){const hp=pj(C,vadd(C.eye,v3(C.fwd.x*4000,-C.eye.y,C.fwd.z*4000)));const hy=clamp(hp.y,-50,H+50);if(hy>=H)return;
  const g=ctx.createLinearGradient(0,hy,0,H);g.addColorStop(0,rgba(mix(col,HAZE,0.75),1));g.addColorStop(0.25,rgba(mix(col,HAZE,0.35),1));g.addColorStop(1,rgba(col,1));ctx.fillStyle=g;ctx.fillRect(0,hy,W,H-hy+2);}
// a flat disc or ring on the ground, as a polygon
function discPts(cx,cz,r,n,y,a0,a1){const pts=[],A0=a0==null?0:a0,A1=a1==null?360:a1;for(let i=0;i<=n;i++){const a=lerp(A0,A1,i/n)*DEG;pts.push(v3(cx+r*Math.sin(a),y||0,cz+r*Math.cos(a)));}if(A1-A0>=360)pts.pop();return pts;}
// grass flock, like a model's lawn mat: dots fixed to the ground, only where the camera sees them
function tFlock(ctx,C,cx,cz,R,o){o=o||{};const step=o.step||0.55,col=o.col||[40,80,40],lite=o.lite||[255,255,220];const g=C.tgt,rr_=Math.min(R,Math.max(8,C.dist*2.6));
  const x0=Math.floor((g.x-rr_)/step),x1=Math.ceil((g.x+rr_)/step),z0=Math.floor((g.z-rr_)/step),z1=Math.ceil((g.z+rr_)/step);ctx.save();
  for(let i=x0;i<=x1;i++)for(let j=z0;j<=z1;j++){const x=(i+hash(i*7+j,61))*step,z=(j+hash(i*3+j*11,62))*step;if((x-cx)**2+(z-cz)**2>R*R)continue;if(o.skip&&o.skip(x,z))continue;
    const p=pj(C,v3(x,0.003,z));if(p.z<NEAR||p.x<-4||p.x>W+4||p.y<-4||p.y>H+4)continue;const s=0.028*p.s;if(s<0.6)continue;const a=clamp((s-0.6)*0.6,0,1)*(o.a||0.2);
    ctx.globalAlpha=a;ctx.fillStyle=hash(i,j)>0.5?rgba(lite,1):rgba(col,1);ctx.fillRect(p.x,p.y,s*1.4,s*0.7);}ctx.restore();}

// ---- trees and shrubs: a trunk and soft clay canopies ----
function tTree(ctx,C,x,z,h,col,o){o=o||{};const B=pj(C,v3(x,o.y||0,z)),Tp=pj(C,v3(x,(o.y||0)+h*0.55,z)),r=h*0.34*B.s;if(B.z<NEAR+0.5||B.x<-r*2||B.x>W+r*2||Tp.y-r*2>H||B.y<-r*3)return;const c=hz(col,B.z),tc=hz([150,112,82],B.z);
  ctx.save();ctx.translate(B.x,B.y);ctx.scale(1,clamp(Math.abs(C.fwd.y)+0.2,0.3,1));const sg=ctx.createRadialGradient(r*0.3,0,1,r*0.3,0,r*1.2);sg.addColorStop(0,"rgba(40,56,70,0.3)");sg.addColorStop(1,"rgba(40,56,70,0)");ctx.fillStyle=sg;ctx.beginPath();ctx.arc(r*0.3,0,r*1.2,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(tc,1);ctx.lineCap="round";ctx.lineWidth=Math.max(2,h*0.07*B.s);ctx.beginPath();ctx.moveTo(B.x,B.y);ctx.lineTo(Tp.x,Tp.y);ctx.stroke();
  const cy=Tp.y-r*0.6,blob=(dx,dy,rr_,k)=>{const g=ctx.createRadialGradient(Tp.x+dx-rr_*0.35,cy+dy-rr_*0.4,rr_*0.1,Tp.x+dx,cy+dy,rr_);g.addColorStop(0,rgba(mix(c,[255,250,220],0.32*k),1));g.addColorStop(0.6,rgba(c,1));g.addColorStop(1,rgba(mix(c,[20,40,40],0.22),1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(Tp.x+dx,cy+dy,rr_,0,TAU);ctx.fill();};
  if(o.round)blob(0,0,r,1);else{blob(-r*0.38,r*0.12,r*0.72,0.8);blob(r*0.4,r*0.1,r*0.7,0.9);blob(0,-r*0.32,r*0.8,1);}
  ctx.fillStyle="rgba(255,255,255,0.3)";ctx.beginPath();ctx.ellipse(Tp.x-r*0.3,cy-r*0.55,r*0.18,r*0.1,-0.5,0,TAU);ctx.fill();}
function tShrub(ctx,C,x,z,r,col,o){o=o||{};const P_=pj(C,v3(x,(o.y||0)+r*0.6,z)),R=r*P_.s;if(P_.z<NEAR+0.3||P_.x<-R*2||P_.x>W+R*2)return;const c=hz(col,P_.z);
  for(let i=0;i<3;i++){const dx=(i-1)*R*0.7,g=ctx.createRadialGradient(P_.x+dx-R*0.3,P_.y-R*0.4,R*0.1,P_.x+dx,P_.y,R);g.addColorStop(0,rgba(mix(c,[255,250,220],0.3),1));g.addColorStop(1,rgba(mix(c,[20,40,40],0.2),1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(P_.x+dx,P_.y-(i===1?R*0.25:0),R*(i===1?1:0.8),0,TAU);ctx.fill();}}

// ---- rooms: the inner faces of a building open at the front, seen only from where the camera is ----
// R: {X0,X1,Z0,Z1,FY,HY} in the building's coordinates, the front at Z0. o.win: a window in the back wall [x0,y0,x1,y1].
// o.paper, o.stripe, o.dado, o.side, o.floor: the room's colours
function tRoom(ctx,C,R,o){o=o||{};const t=0.2,xl=R.X0+t,xr=R.X1-t,bz=R.Z1-t,FY=R.FY,HY=R.HY,Z0=R.Z0,DH=FY+(o.dh||0.92),E=mxL(C.eye);
  const paper=o.paper||PAL.paper,stripe=o.stripe||PAL.stripe,dado=o.dado||PAL.dado,side=o.side||PAL.side,floor=o.floor||PAL.floor;
  const quad=(pts)=>{const q=pts.map(p=>pj(C,p));ctx.moveTo(q[0].x,q[0].y);for(let i=1;i<q.length;i++)ctx.lineTo(q[i].x,q[i].y);ctx.closePath();};
  if(E.z<bz){ctx.save();ctx.beginPath();quad([v3(xl,FY,bz),v3(xr,FY,bz),v3(xr,HY,bz),v3(xl,HY,bz)]);if(o.win){const [a,b,c,d]=o.win;quad([v3(a,b,bz),v3(a,d,bz),v3(c,d,bz),v3(c,b,bz)]);}
    ctx.fillStyle=rgba(ilit(paper,ILIT.F),1);ctx.fill("evenodd");ctx.clip("evenodd");
    // wallpaper: soft stripes and a tiny sprig between them
    if(o.plain!==true&&!o.lod){for(let x=xl+0.06;x<xr;x+=0.26)wq3(ctx,C,x,DH,x+0.09,HY,bz-0.002,ilit(stripe,ILIT.F),{a:0.55});
      const sp=o.sprig||[226,150,120];ctx.fillStyle=rgba(ilit(sp,ILIT.F),0.55);for(let x=xl+0.19;x<xr;x+=0.26)for(let y=DH+0.18;y<HY-0.05;y+=0.32){const p=pj(C,v3(x,y,bz-0.003));ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.2,0.022*p.s),0,TAU);ctx.fill();}}
    // the dado and its rail
    wq3(ctx,C,xl,FY,xr,DH,bz-0.004,ilit(dado,ILIT.F),{grad:[0.04,0.08]});
    for(let x=xl+0.18;x<xr-0.1;x+=0.36)wq3(ctx,C,x,FY+0.16,x+0.26,DH-0.14,bz-0.005,ilit(mix(dado,[255,255,255],0.12),ILIT.F),{edge:0.35});
    wq3(ctx,C,xl,DH-0.02,xr,DH+0.05,bz-0.006,ilit(PAL.rail,ILIT.F),{edge:0.4});ctx.restore();
    if(o.win){const [a,b,c,d]=o.win,fr=ilit([255,253,246],ILIT.F);
      wq3(ctx,C,a-0.06,b-0.06,c+0.06,b,bz-0.01,fr);wq3(ctx,C,a-0.06,d,c+0.06,d+0.06,bz-0.01,fr);wq3(ctx,C,a-0.06,b,a,d,bz-0.01,fr);wq3(ctx,C,c,b,c+0.06,d,bz-0.01,fr);
      wq3(ctx,C,(a+c)/2-0.025,b,(a+c)/2+0.025,d,bz-0.01,fr);wq3(ctx,C,a,(b+d)/2+0.12,c,(b+d)/2+0.16,bz-0.01,fr);
      ibox(ctx,C,a-0.12,b-0.12,bz-0.16,c-a+0.24,0.07,0.16,[255,252,244],{edge:0.5});}}
  // the ceiling, the side walls with the dado carried round, the floor: each only from the side it can be seen
  if(E.y<HY)poly3(ctx,C,[v3(xl,HY,Z0),v3(xr,HY,Z0),v3(xr,HY,bz),v3(xl,HY,bz)],ilit(PAL.ceil,ILIT.D),{grad:[0,0.1]});
  for(const [x,k,s] of [[xl,ILIT.L,1],[xr,ILIT.R,-1]]){if((E.x-x)*s<=0)continue;sq3(ctx,C,x,Z0,FY,bz,HY,ilit(side,k),{grad:[0.03,0.08]});sq3(ctx,C,x,Z0,FY,bz,DH,ilit(dado,k),{grad:[0.02,0.06]});sq3(ctx,C,x,Z0,DH-0.02,bz,DH+0.05,ilit(PAL.rail,k));}
  if(E.y>FY){fq3(ctx,C,xl,Z0,xr,bz,FY,ilit(floor,ILIT.U),{grad:[0.02,0.1]});
    // o.flags: a floor of stone flags instead of boards
    if(o.flags&&!o.lod){ctx.save();ctx.strokeStyle="rgba(90,80,70,0.22)";ctx.lineWidth=1.5;for(let z=Z0+0.45;z<bz;z+=0.45){const a=pj(C,v3(xl,FY,z)),b=pj(C,v3(xr,FY,z));if(a.z<NEAR||b.z<NEAR)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
      let r=0;for(let z=Z0;z<bz-0.01;z+=0.45,r++)for(let x=xl+(r%2?0.3:0.6);x<xr;x+=0.6){const a=pj(C,v3(x,FY,z)),b=pj(C,v3(x,FY,Math.min(bz,z+0.45)));if(a.z<NEAR||b.z<NEAR)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();}
    else if(!o.lod){ctx.save();ctx.strokeStyle="rgba(120,74,40,0.2)";ctx.lineWidth=1.5;for(let x=xl+0.32;x<xr;x+=0.32){const a=pj(C,v3(x,FY,Z0)),b=pj(C,v3(x,FY,bz));if(a.z<NEAR||b.z<NEAR)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    for(let i=0;i<40;i++){const x=xl+0.32*Math.floor(hash(i,7)*(xr-xl)/0.32),z=lerp(Z0,bz,hash(i,8)),a=pj(C,v3(x,FY,z)),b=pj(C,v3(Math.min(xr,x+0.32),FY,z));if(a.z<NEAR||b.z<NEAR)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();}
    // skirting, and soft shadow where the walls meet
    if(E.z<bz)wq3(ctx,C,xl,FY,xr,FY+0.09,bz-0.02,ilit([255,252,244],ILIT.F),{edge:0.3});if(E.x>xl)sq3(ctx,C,xl+0.01,Z0,FY,bz,FY+0.09,ilit([255,252,244],ILIT.L));if(E.x<xr)sq3(ctx,C,xr-0.01,Z0,FY,bz,FY+0.09,ilit([255,252,244],ILIT.R));
    aoStrip(ctx,C,v3(xl,FY+0.001,bz),v3(xr,FY+0.001,bz),v3(0,0,-1),0.55,0.16);aoStrip(ctx,C,v3(xl,FY+0.001,Z0),v3(xl,FY+0.001,bz),v3(1,0,0),0.45,0.13);aoStrip(ctx,C,v3(xr,FY+0.001,Z0),v3(xr,FY+0.001,bz),v3(-1,0,0),0.45,0.13);}
  if(E.z<bz){aoStrip(ctx,C,v3(xl,FY,bz-0.002),v3(xl,HY,bz-0.002),v3(1,0,0),0.3,0.1);aoStrip(ctx,C,v3(xr,FY,bz-0.002),v3(xr,HY,bz-0.002),v3(-1,0,0),0.3,0.1);aoStrip(ctx,C,v3(xl,HY,bz-0.002),v3(xr,HY,bz-0.002),v3(0,-1,0),0.28,0.1);}
  return{xl,xr,bz,FY,HY,Z0,E};}
// the open front's cut edges (white, like card), the outer walls the camera can see, a coloured band and the roof
function tShell(ctx,C,R,o){o=o||{};const t=0.2,cut=[255,253,248],w=R.X1-R.X0,d=R.Z1-R.Z0,HY=R.HY,wc=o.wall||PAL.cream,E=mxL(C.eye);
  if(E.x<R.X0)poly3(ctx,C,[v3(R.X0,0,R.Z1),v3(R.X0,0,R.Z0),v3(R.X0,HY+0.18,R.Z0),v3(R.X0,HY+0.18,R.Z1)],wc,{n:NRM.L,grad:[0.05,0.08],edge:0.4});
  if(E.x>R.X1)poly3(ctx,C,[v3(R.X1,0,R.Z0),v3(R.X1,0,R.Z1),v3(R.X1,HY+0.18,R.Z1),v3(R.X1,HY+0.18,R.Z0)],wc,{n:NRM.R,grad:[0.05,0.08],edge:0.4});
  if(E.x<R.X0||E.x>R.X1)sideWins(ctx,C,R,E.x<R.X0?R.X0-0.01:R.X1+0.01,E.x<R.X0?NRM.L:NRM.R,o);
  if(E.z<R.Z0){wq3(ctx,C,R.X0,0,R.X0+t,HY+0.18,R.Z0,cut,{edge:0.5});wq3(ctx,C,R.X1-t,0,R.X1,HY+0.18,R.Z0,cut,{edge:0.5});wq3(ctx,C,R.X0,HY,R.X1,HY+0.18,R.Z0,cut,{edge:0.5});
    wq3(ctx,C,R.X0,0,R.X1,R.FY,R.Z0-0.001,o.plinth||[244,234,212],{edge:0.4});wq3(ctx,C,R.X0,R.FY-0.05,R.X1,R.FY,R.Z0-0.002,cut);}
  drawBox(ctx,C,R.X0-0.06,HY+0.18,R.Z0-0.06,w+0.12,0.2,d+0.12,o.band||PAL.band,{grad:[0.12,0.08],edge:0.6});
  if(o.flat)drawBox(ctx,C,R.X0-0.16,HY+0.38,R.Z0-0.16,w+0.32,0.22,d+0.32,o.roof||[214,208,198],{grad:[0.05,0.06],edge:0.5});
  else gable(ctx,C,R.X0,HY+0.38,R.Z0,w,d,o.rh||1.5,o.roof||PAL.roof,{wall:o.gableWall||wc,ov:0.26});}
// the same building seen from behind or from far away: closed, with windows
function tClosed(ctx,C,R,o){o=o||{};const w=R.X1-R.X0,d=R.Z1-R.Z0,HY=R.HY,wc=o.wall||PAL.cream;
  drawBox(ctx,C,R.X0,0,R.Z0,w,HY+0.18,d,wc,{grad:[0.05,0.08],edge:0.4,noTop:true,front:o.front||wc});
  const E=mxL(C.eye);if(E.z>R.Z1)backWins(ctx,C,R,o);if(E.x<R.X0||E.x>R.X1)sideWins(ctx,C,R,E.x<R.X0?R.X0-0.01:R.X1+0.01,E.x<R.X0?NRM.L:NRM.R,o);if(E.z<R.Z0&&o.frontWins)o.frontWins(ctx,C,R);
  drawBox(ctx,C,R.X0-0.06,HY+0.18,R.Z0-0.06,w+0.12,0.2,d+0.12,o.band||PAL.band,{grad:[0.12,0.08],edge:0.6});
  if(o.flat)drawBox(ctx,C,R.X0-0.16,HY+0.38,R.Z0-0.16,w+0.32,0.22,d+0.32,o.roof||[214,208,198],{grad:[0.05,0.06],edge:0.5});
  else gable(ctx,C,R.X0,HY+0.38,R.Z0,w,d,o.rh||1.5,o.roof||PAL.roof,{wall:o.gableWall||wc,ov:0.26});}
// windows: glass with a white frame, on the outer side and back walls
function winQ(ctx,C,pts,n,o){poly3(ctx,C,pts,[255,253,246],{n,edge:0.4});const c=pts.reduce((s,p)=>vadd(s,p),v3(0,0,0));const m=vmul(c,0.25);const k=0.8,inn=pts.map(p=>vadd(m,vmul(vsub(p,m),k)));
  poly3(ctx,C,inn,o.glass||[170,210,240],{n,grad:[0.35,0.1]});}
function sideWins(ctx,C,R,x,n,o){const d=R.Z1-R.Z0,cols=Math.max(1,Math.round(d/1.4)),y0=R.FY+0.75,y1=R.FY+1.95;for(let i=0;i<cols;i++){const zc=R.Z0+(i+0.5)*d/cols;winQ(ctx,C,[v3(x,y0,zc-0.35),v3(x,y0,zc+0.35),v3(x,y1,zc+0.35),v3(x,y1,zc-0.35)],n,o);}}
function backWins(ctx,C,R,o){const w=R.X1-R.X0,cols=Math.max(2,Math.round(w/1.5)),y0=R.FY+0.75,y1=R.FY+1.95,z=R.Z1+0.01;for(let i=0;i<cols;i++){const xc=R.X0+(i+0.5)*w/cols;winQ(ctx,C,[v3(xc+0.35,y0,z),v3(xc-0.35,y0,z),v3(xc-0.35,y1,z),v3(xc+0.35,y1,z)],NRM.B,o);}}

// ---- furniture: drawn flat at a point and scaled with distance, or built of boxes ----
function tShelf(ctx,C,x0,z0,w,h,d,o){o=o||{};const FY=o.FY||0,cols=o.cols||[PAL.navy,PAL.coral,PAL.teal,PAL.mustard,PAL.lilac,PAL.sage,[96,120,170],[200,96,86]];let n=0;
  ibox(ctx,C,x0,FY,z0,w,h,d,PAL.walnut,{grad:[0.08,0.1],edge:0.35});wq3(ctx,C,x0+0.05,FY+0.05,x0+w-0.05,FY+h-0.05,z0-0.002,ilit(mix(PAL.walnut,[40,24,14],0.42),1));
  const rows=o.rows||4,rh=(h-0.1)/rows,out=o.out||(()=>0),skip=o.skip||(()=>false);
  for(let r=0;r<rows;r++){const yy=FY+0.05+r*rh;ibox(ctx,C,x0+0.05,yy,z0-0.01,w-0.1,0.045,d-0.04,mix(PAL.walnut,[255,230,190],0.18),{edge:0.3});if(r===0&&!o.bottomRow)continue;
    let bx=x0+0.09;for(let j=0;j<20;j++){const bw=0.12+0.03*hash(r*31+j,3),bh=Math.min(rh-0.1,0.4+0.05*hash(r*17+j,5));if(bx+bw>x0+w-0.08)break;
      if(skip(r,j)){bx+=bw+0.012;continue;}const c=cols[(r*5+j*3)%cols.length],dz=-out(r,j);
      ibox(ctx,C,bx,yy+0.045,z0-0.005+dz,bw,bh,0.28,c,{grad:[0.14,0.12],edge:0.3,lw:1});wq3(ctx,C,bx+bw*0.2,yy+0.045+bh*0.55,bx+bw*0.8,yy+0.045+bh*0.82,z0-0.007+dz,[250,246,234]);
      const hp=pj(C,v3(bx+bw/2,yy+0.045+bh*0.3,z0-0.007+dz));ctx.fillStyle=rgba(mix(c,[0,0,0],0.45),0.8);ctx.beginPath();ctx.arc(hp.x,hp.y,Math.max(1.5,0.018*hp.s),0,TAU);ctx.fill();
      bx+=bw+0.012;n++;}}
  return n;}
function tPlant(ctx,C,x,y,z,h){const B=pj(C,v3(x,y,z)),k=B.s*h;if(B.z<NEAR)return;const pot=[214,122,86];
  ctx.save();ctx.translate(B.x,B.y);ctx.fillStyle="rgba(60,40,30,0.22)";ctx.beginPath();ctx.ellipse(0,0,k*0.26,k*0.06,0,0,TAU);ctx.fill();
  const lv=[[-0.62,0.9],[-0.35,1.0],[-0.1,1.05],[0.15,1.0],[0.42,0.94],[0.66,0.8],[-0.8,0.7],[0.85,0.62]];
  lv.forEach(([a,l],i)=>{ctx.save();ctx.translate(0,-k*0.28);ctx.rotate(a*0.9);const g=ctx.createLinearGradient(-k*0.08,0,k*0.08,0);const c=i%2?[92,164,104]:[70,142,92];g.addColorStop(0,rgba(mix(c,[255,255,220],0.25),1));g.addColorStop(1,rgba(c,1));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-k*0.11,-k*0.25*l,-k*0.06,-k*0.55*l,0,-k*0.66*l);ctx.bezierCurveTo(k*0.07,-k*0.55*l,k*0.1,-k*0.25*l,0,0);ctx.fill();
    ctx.strokeStyle="rgba(255,255,230,0.35)";ctx.lineWidth=Math.max(1,k*0.006);ctx.beginPath();ctx.moveTo(0,-k*0.04);ctx.lineTo(0,-k*0.6*l);ctx.stroke();ctx.restore();});
  ctx.beginPath();ctx.moveTo(-k*0.17,-k*0.3);ctx.lineTo(k*0.17,-k*0.3);ctx.lineTo(k*0.13,0);ctx.lineTo(-k*0.13,0);ctx.closePath();const g=ctx.createLinearGradient(-k*0.17,0,k*0.17,0);g.addColorStop(0,rgba(mix(pot,[255,240,220],0.25),1));g.addColorStop(1,rgba(mix(pot,[0,0,0],0.18),1));ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle=rgba(mix(pot,[255,240,220],0.35),1);rr(ctx,-k*0.19,-k*0.33,k*0.38,k*0.06,k*0.02);ctx.fill();ctx.restore();}
function tDeskLamp(ctx,C,x,y,z,h,on){const B=pj(C,v3(x,y,z)),k=B.s*h,c=[64,92,140];if(B.z<NEAR)return;ctx.save();ctx.translate(B.x,B.y);
  if(on){const g=ctx.createRadialGradient(k*0.3,-k*0.62,1,k*0.3,-k*0.5,k*1.2);g.addColorStop(0,"rgba(255,236,180,"+(0.5*on)+")");g.addColorStop(1,"rgba(255,236,180,0)");ctx.fillStyle=g;ctx.fillRect(-k*1.2,-k*1.8,k*2.8,k*2.4);}
  ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.ellipse(0,0,k*0.2,k*0.06,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=Math.max(2,k*0.04);ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(0,-k*0.03);ctx.lineTo(-k*0.12,-k*0.58);ctx.lineTo(k*0.22,-k*0.86);ctx.stroke();
  ctx.save();ctx.translate(k*0.25,-k*0.86);ctx.rotate(0.5);ctx.beginPath();ctx.moveTo(-k*0.1,-k*0.05);ctx.lineTo(k*0.1,-k*0.05);ctx.lineTo(k*0.2,k*0.18);ctx.lineTo(-k*0.2,k*0.18);ctx.closePath();
  const g=ctx.createLinearGradient(-k*0.2,0,k*0.2,0);g.addColorStop(0,rgba(mix(c,[255,255,255],0.3),1));g.addColorStop(1,rgba(c,1));ctx.fillStyle=g;ctx.fill();
  if(on){ctx.fillStyle="rgba(255,244,210,0.95)";ctx.beginPath();ctx.ellipse(0,k*0.18,k*0.19,k*0.04,0,0,TAU);ctx.fill();}ctx.restore();ctx.restore();}
function tClock(ctx,C,x,y,z,r,hh,mm){const P_=pj(C,v3(x,y,z)),R=r*P_.s;if(P_.z<NEAR)return;ctx.save();ctx.translate(P_.x,P_.y);ctx.fillStyle="rgba(60,40,30,0.18)";ctx.beginPath();ctx.arc(R*0.08,R*0.1,R*1.05,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(PAL.navy,1);ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();ctx.fillStyle="#fffaf0";ctx.beginPath();ctx.arc(0,0,R*0.84,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(PAL.ink,1);ctx.lineCap="round";for(let i=0;i<12;i++){const a=i*TAU/12;ctx.lineWidth=Math.max(1,R*0.05);ctx.beginPath();ctx.moveTo(Math.sin(a)*R*0.68,-Math.cos(a)*R*0.68);ctx.lineTo(Math.sin(a)*R*0.76,-Math.cos(a)*R*0.76);ctx.stroke();}
  const ha=(hh%12+mm/60)*TAU/12,ma=mm*TAU/60;ctx.lineWidth=Math.max(1.5,R*0.09);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.sin(ha)*R*0.42,-Math.cos(ha)*R*0.42);ctx.stroke();ctx.lineWidth=Math.max(1,R*0.06);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.sin(ma)*R*0.62,-Math.cos(ma)*R*0.62);ctx.stroke();ctx.restore();}
// a desk with drawers on two sides; returns the height of its top
function tDesk(ctx,C,x,z,w,d,FY,col){col=col||PAL.oak;const h=0.7,pw=0.46;ibox(ctx,C,x,FY,z,pw,h,d-0.04,col,{grad:[0.08,0.12]});ibox(ctx,C,x+w-pw,FY,z,pw,h,d-0.04,col,{grad:[0.08,0.12]});
  for(const xx of [x,x+w-pw])for(let i=0;i<3;i++){wq3(ctx,C,xx+0.05,FY+0.06+i*0.22,xx+pw-0.05,FY+0.24+i*0.22,z-0.005,ilit(mix(col,[255,255,255],0.1),ILIT.F),{edge:0.4});const p=pj(C,v3(xx+pw/2,FY+0.15+i*0.22,z-0.01));if(p.z>NEAR){ctx.fillStyle="rgba(90,60,40,0.7)";ctx.fillRect(p.x-0.06*p.s,p.y-0.012*p.s,0.12*p.s,0.024*p.s);}}
  ibox(ctx,C,x-0.05,FY+h,z-0.05,w+0.1,0.06,d+0.06,mix(col,[255,240,210],0.15),{edge:0.6});return FY+h+0.06;}
// a painted wooden chair, its back to the wall: four legs, a seat, two posts and a rail
function tChair(ctx,C,x,z,FY,col){col=col||[78,128,170];const lg=mix(col,[40,30,30],0.35);
  for(const [lx,lz] of [[0.03,0.39],[0.39,0.39],[0.03,0.03],[0.39,0.03]])ibox(ctx,C,x+lx,FY,z+lz,0.04,0.42,0.04,lg,{edge:0.2});
  ibox(ctx,C,x,FY+0.42,z,0.46,0.05,0.46,col);for(const lx of [0.03,0.39])ibox(ctx,C,x+lx,FY+0.47,z+0.39,0.04,0.46,0.04,lg,{edge:0.2});
  ibox(ctx,C,x-0.01,FY+0.72,z+0.38,0.48,0.2,0.05,col);}
// a monitor on a stand, facing the front: fn(c) draws the screen in centimetres (w x h)
function tMonitor(ctx,C,x,y,z,w,h,fn,o){o=o||{};ibox(ctx,C,x+w/2-0.04,y,z+0.06,0.08,0.18,0.06,[70,74,88]);ibox(ctx,C,x+w/2-0.16,y,z,0.32,0.02,0.2,[70,74,88]);
  ibox(ctx,C,x-0.03,y+0.16,z-0.02,w+0.06,h+0.06,0.05,[56,62,78],{edge:0.5});const sc=wq3(ctx,C,x,y+0.19,x+w,y+0.19+h,z-0.025,o.bg||[236,244,250]);
  if(fn)surfDraw(ctx,C,v3(x,y+0.19+h,z-0.027),v3(1,0,0),v3(0,1,0),fn,{lb:o.lb});return sc;}
// a pinboard on a back wall (z) with cards on it; o.cards: [[u,v,du,dv,colour]] in the board's fractions
function tPinboard(ctx,C,x0,y0,x1,y1,z,o){o=o||{};wq3(ctx,C,x0-0.04,y0-0.04,x1+0.04,y1+0.04,z,ilit(PAL.walnut,1),{edge:0.4});wq3(ctx,C,x0,y0,x1,y1,z-0.004,ilit([222,176,124],1),{grad:[0.04,0.06]});
  for(const [u,v,du,dv,c] of (o.cards||[])){const xx=lerp(x0,x1,u),yy=lerp(y0,y1,v),dx=(x1-x0)*du,dy=(y1-y0)*dv;wq3(ctx,C,xx,yy,xx+dx,yy+dy,z-0.008,ilit(c,1),{edge:0.3});
    for(let i=1;i<4;i++)wq3(ctx,C,xx+dx*0.12,yy+dy*(i/4.5),xx+dx*0.85,yy+dy*(i/4.5)+0.012,z-0.01,[150,150,170],{a:0.6});const p=pj(C,v3(xx+dx/2,yy+dy*0.9,z-0.012));if(p.z>NEAR){ctx.fillStyle="#d8574a";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.5,0.02*p.s),0,TAU);ctx.fill();}}}
// a rug on the floor, with stripes
function tRug(ctx,C,x0,z0,x1,z1,y,col,o){o=o||{};fq3(ctx,C,x0-0.13,z0-0.11,x1+0.13,z1+0.11,y+0.006,ilit(o.border||PAL.rugB,ILIT.U));fq3(ctx,C,x0,z0,x1,z1,y+0.008,ilit(col,ILIT.U),{grad:[0.04,0.06]});
  for(let z=z0+0.2;z<z1-0.1;z+=0.42)fq3(ctx,C,x0+0.12,z,x1-0.12,z+0.04,y+0.009,ilit(mix(col,[255,255,255],0.25),ILIT.U));}

// ---- the finishing touches: a tilt-shift blur, fast (blurred at a quarter of the size), and a soft vignette ----
const PC2={};function pcanvas2(k,w,h){const c=PC2[k]||(PC2[k]=document.createElement("canvas"));if(c.width!==w||c.height!==h){c.width=w;c.height=h;}return c;}
function tiltShift(ctx,y0,y1,amt,soft){if(!(amt>0.2))return;const cv=ctx.canvas,w=cv.width,h=cv.height,q=4,bw=Math.max(2,Math.round(w/q)),bh=Math.max(2,Math.round(h/q)),sc=w/W;soft=soft||220;
  const b=pcanvas2("ts",bw,bh),bx=b.getContext("2d");bx.setTransform(1,0,0,1,0,0);bx.globalCompositeOperation="copy";bx.imageSmoothingQuality="high";bx.filter="blur("+(amt*sc/q).toFixed(2)+"px)";bx.drawImage(cv,0,0,bw,bh);bx.filter="none";
  bx.globalCompositeOperation="destination-in";const g=bx.createLinearGradient(0,0,0,bh),f=v=>clamp(v/H,0,1);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(f(y0-soft),"rgba(0,0,0,1)");g.addColorStop(f(y0),"rgba(0,0,0,0)");g.addColorStop(f(y1),"rgba(0,0,0,0)");g.addColorStop(f(y1+soft),"rgba(0,0,0,1)");g.addColorStop(1,"rgba(0,0,0,1)");
  bx.fillStyle=g;bx.fillRect(0,0,bw,bh);bx.globalCompositeOperation="source-over";ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingQuality="high";ctx.drawImage(b,0,0,w,h);ctx.restore();}
function vignetteSoft(ctx,col,a){ctx.save();ctx.setTransform(1,0,0,1,0,0);const cv=ctx.canvas,g=ctx.createRadialGradient(cv.width/2,cv.height*0.45,cv.height*0.42,cv.width/2,cv.height*0.5,cv.height*1.05);g.addColorStop(0,rgba(col,0));g.addColorStop(1,rgba(col,a));ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();}
// blur the whole picture behind a card
function blurAll(ctx,amt,dim){const cv=ctx.canvas,w=cv.width,h=cv.height,q=4,bw=Math.max(2,Math.round(w/q)),bh=Math.max(2,Math.round(h/q)),sc=w/W;const b=pcanvas2("ba",bw,bh),bx=b.getContext("2d");
  bx.setTransform(1,0,0,1,0,0);bx.globalCompositeOperation="copy";bx.filter="blur("+(amt*sc/q).toFixed(2)+"px)";bx.drawImage(cv,0,0,bw,bh);bx.filter="none";bx.globalCompositeOperation="source-over";
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(b,0,0,w,h);if(dim){ctx.fillStyle=rgba(dim[0],dim[1]);ctx.fillRect(0,0,w,h);}ctx.restore();}

// ---- timing: when a word of a line is spoken (an estimate, by its place in the spoken words) ----
function wAt(sc,id,word,off){const ln=sc.vo.find(v=>v.id===id);if(!ln)return 0;const s=ln.say||ln.text,i=s.indexOf(word),d=sc.ends[id]-sc.cues[id];return sc.cues[id]+(i<0?0:d*i/s.length)+(off||0);}
// a value that springs in at t0 (0 to 1, overshooting a little), and one that rises smoothly
const pop=(t,t0,d)=>spring((t-t0)/(d||0.7));
const rise=(t,t0,d)=>sstep(t0,t0+(d||0.6),t);

/* ===== The data governance series: its people =====
   The cast of When things go wrong and In the weeds of data crafting (Mei, Sam, David, Jun), and two more: Yusuf Demir, the
   university's new data governance lead, and Clara Jensen, in Planning. In the toy town they're painted figures on small round
   bases: the base's rim carries the side, gold for the business side and blue for the technical side, plain walnut for people
   of the past. The people of the past wear their own time: tunics and gowns of wool in 1215, a furred gown in 1497, a frock
   coat and a top hat, or a waistcoat and an apron, in the 1880s. */

PEOPLE.yusuf={name:"Yusuf Demir",role:"Data governance lead",side:"Business",does:"uses",edge:BIZ,seed:15,
  skin:[204,160,124],hair:{style:"side",c:[38,30,28]},beard:[44,34,30],
  top:{kind:"blazer",c:[150,84,62],inner:[236,232,222]},bottom:{c:[52,56,70]},shoe:[70,48,36],build:{sh:74,hip:60,h:1.0}};
PEOPLE.clara={name:"Clara Jensen",role:"Planning",side:"Business",does:"uses",edge:BIZ,seed:16,
  skin:[238,204,180],hair:{style:"bob",c:[170,120,70],streak:[214,176,120]},earrings:[255,214,140],
  top:{kind:"sweater",c:[226,160,70]},bottom:{c:[60,64,84]},shoe:[60,46,40],build:{sh:66,hip:60,h:0.96}};

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
  crier:{name:"",role:"the sheriff's crier",side:"",edge:null,seed:31,skin:[226,184,154],hair:{style:"side",c:[120,84,52]},beard:[116,80,50],
    top:{kind:"gown",c:[60,84,140],inner:[226,214,190],belt:[96,64,40],band:[214,170,80],cape:[170,52,44]},bottom:{c:[60,60,70]},shoe:[60,42,30],build:{sh:74,hip:62,h:1.02}},
  vintner:{name:"",role:"wine seller",side:"",edge:null,seed:32,skin:[232,190,160],hair:{style:"cropped",c:[60,44,34]},hat:"coif",hatC:[240,234,220],
    top:{kind:"tunic",c:[150,62,58],inner:[230,220,200],belt:[88,60,40],purse:true,apron:[236,226,206]},bottom:{c:[96,104,70]},shoe:[70,50,36],build:{sh:76,hip:64,h:1.0}},
  alewife:{name:"",role:"brewer",side:"",edge:null,seed:33,skin:[236,196,170],hair:{style:"cropped",c:[150,96,56]},hat:"veil",hatC:[232,226,206],
    top:{kind:"gown",c:[184,150,72],inner:[236,228,210],belt:[110,74,44],apron:[240,234,220]},bottom:{c:[90,80,70]},shoe:[70,52,40],build:{sh:66,hip:62,h:0.95}},
  miller:{name:"",role:"corn seller",side:"",edge:null,seed:34,skin:[214,170,136],hair:{style:"side",c:[52,40,32]},beard:[60,46,36],hat:"straw",hatC:[224,190,120],
    top:{kind:"tunic",c:[176,160,128],inner:[226,218,200],belt:[100,70,46]},bottom:{c:[88,72,60]},shoe:[66,48,34],build:{sh:78,hip:64,h:1.03}},
  buyer:{name:"",role:"townswoman",side:"",edge:null,seed:35,skin:[200,150,118],hair:{style:"cropped",c:[40,30,26]},hat:"veil",hatC:[214,222,236],wimpleC:[246,244,238],
    top:{kind:"gown",c:[70,108,150],inner:[230,226,214],belt:[90,62,44],purse:true},bottom:{c:[70,70,80]},shoe:[60,44,34],build:{sh:64,hip:60,h:0.94}},
  // 1497: a clerk of the market in a furred gown and a bonnet; a trader in a hood
  clerk:{name:"",role:"clerk of the market",side:"",edge:null,seed:36,skin:[230,190,160],hair:{style:"cropped",c:[90,64,44]},hat:"tudor",hatC:[44,40,46],
    top:{kind:"gown",c:[96,40,44],inner:[60,58,70],fur:[120,86,60]},bottom:{c:[50,46,56]},shoe:[40,32,28],build:{sh:74,hip:62,h:1.0}},
  trader:{name:"",role:"trader",side:"",edge:null,seed:37,skin:[210,164,128],hair:{style:"side",c:[70,50,36]},beard:[80,58,40],hat:"hood",hatC:[120,130,90],
    top:{kind:"tunic",c:[150,120,84],inner:[220,210,190],belt:[96,66,44],purse:true},bottom:{c:[96,84,70]},shoe:[66,48,34],build:{sh:76,hip:64,h:1.0}},
  // the 1880s: an inspector of weights and measures, and a grocer
  inspector:{name:"",role:"inspector of weights and measures",side:"",edge:null,seed:38,skin:[226,186,156],hair:{style:"side",c:[96,80,70]},beard:[110,92,80],hat:"top",hatC:[36,36,42],hatBand:[24,24,28],
    top:{kind:"frock",c:[48,52,66],vest:[110,96,80],inner:[246,244,238],tie:[30,28,34]},bottom:{c:[70,70,78]},shoe:[24,22,24],build:{sh:76,hip:62,h:1.02}},
  grocer:{name:"",role:"grocer",side:"",edge:null,seed:39,skin:[232,196,168],hair:{style:"cropped",c:[60,46,36]},beard:[70,52,40],
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
  shrug:{L:[0.5,1.3],R:[0.5,1.3],hand:"open",feet:30,shift:0,tilt:0.08,turn:0,gaze:[0,0],look:0}
});
// where a hand is, in the figure's own units (it's 560 tall), for things it holds
function handAt(P_,s,a,br){const sw=P_.build.sh,sx=s*(sw-12),sy=-416+br,e=[sx+s*Math.sin(a[0])*108,sy+Math.cos(a[0])*108],d=[s*Math.sin(a[1]),Math.cos(a[1])],w=[e[0]+d[0]*100,e[1]+d[1]*100];return[w[0]+d[0]*13,w[1]+d[1]*13];}

// ---- people as painted figurines: no glow, a soft rim of light from the upper left and a darker edge below ----
outlined=function(ctx,draw,x,y,s,edge,box,glowA){const [x0,y0,x1,y1]=box,pad=12,w=Math.ceil((x1-x0)*s+pad*2),h=Math.ceil((y1-y0)*s+pad*2);if(w<4||h<4)return;
  const [c,cx]=pcanvas("p",w,h);cx.translate(pad-x0*s,pad-y0*s);cx.scale(s,s);draw(cx);
  const [tc,tx]=pcanvas("t",w,h);tx.drawImage(c,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle="rgba(28,34,52,1)";tx.fillRect(0,0,w,h);tx.globalCompositeOperation="source-over";
  const ox=x+x0*s-pad,oy=y+y0*s-pad,r=Math.max(0.8,1.6*s);
  ctx.save();ctx.globalAlpha*=0.55;ctx.drawImage(tc,ox+r*0.6,oy+r);ctx.restore();ctx.drawImage(c,ox,oy);
  const [hc,hx]=pcanvas("h",w,h);hx.drawImage(c,0,0);hx.globalCompositeOperation="source-in";hx.fillStyle="rgba(255,250,236,1)";hx.fillRect(0,0,w,h);hx.globalCompositeOperation="destination-out";hx.drawImage(c,-r*1.6,-r*1.2);hx.globalCompositeOperation="source-over";
  ctx.save();ctx.globalAlpha*=0.35;ctx.drawImage(hc,ox,oy);ctx.restore();};
person=function(ctx,id,x,y,s,o){o=o||{};const P_=PEOPLE[id],po=blendPose(POSE[o.pose||"stand"],POSE[o.pose2],o.mix),E=o.E||EXPR[o.expr||"calm"],t=o.t||0,k=s*P_.build.h;
  const br=Math.sin(t*1.7+P_.seed)*1.4,front=a=>Math.abs(a[1])>Math.PI*0.55;
  outlined(ctx,cx=>{if(o.flip){cx.scale(-1,1);}
    if(!front(po.L))arm(cx,P_,-1,po.L,br,po);if(!front(po.R))arm(cx,P_,1,po.R,br,po);legs(cx,P_,po);
    limb(cx,[[0,-470+br],[0,-440+br]],30,30,darken(P_.skin,0.12),[-20,-470,20,-440]);torso(cx,P_,br,po.shift);
    cx.save();cx.translate(po.shift*0.2,-452+br);cx.rotate(po.tilt+(o.nod||0));cx.translate(0,-50+po.look*2);head(cx,P_,E,po,t);cx.restore();
    const hands=()=>[handAt(P_,-1,po.L,br),handAt(P_,1,po.R,br)];
    if(o.carry&&o.carryBehind){if(o.flip)cx.scale(-1,1);o.carry(cx,P_,o.flip?hands().map(h=>[-h[0],h[1]]):hands());if(o.flip)cx.scale(-1,1);}
    if(front(po.L))arm(cx,P_,-1,po.L,br,po);if(front(po.R))arm(cx,P_,1,po.R,br,po);
    if(o.carry&&!o.carryBehind){if(o.flip)cx.scale(-1,1);o.carry(cx,P_,o.flip?hands().map(h=>[-h[0],h[1]]):hands());if(o.flip)cx.scale(-1,1);}},x,y,k,P_.edge,[o.wide?-400:-250,o.hat?-720:-650,o.wide?400:250,10],o.glow);};
// expressions in between: a little relief, a little worry
EXPR.worried={bi:-5,bo:3,arch:-0.5,knit:2.5,eye:0.95,smile:-0.6,open:0,mw:13};
EXPR.smile={bi:-1,bo:-2,arch:-3.5,eye:0.9,smile:0.8,open:0,mw:22};

// ---- a figure on its base, standing at a point of the town (or of a room, inside mxSet) ----
// o: pose, pose2, mix, expr, t, carry, y (the floor), hop (lifts it a little while it moves), a (opacity), flip, nod, wide (room for an arm held out)
function tFig(ctx,C,id,x,z,o){o=o||{};const y=(o.y||0),B=pj(C,v3(x,y,z));if(B.z<NEAR+0.2)return B;const P_=PEOPLE[id],s=B.s*1.72/560;if(B.x<-600*s||B.x>W+600*s||B.y<-80||B.y-720*s>H+60)return B;
  const rim=P_.edge===BIZ?RIM.biz:P_.edge===TECH?RIM.tech:RIM.past,rx=0.36*B.s,ry=rx*clamp(Math.abs(C.fwd.y)*0.9+0.1,0.22,1),th=0.05*B.s,hop=(o.hop||0)*B.s;
  ctx.save();if(o.a!=null)ctx.globalAlpha*=o.a;
  ctx.fillStyle="rgba(40,50,70,"+(0.25*(1-clamp(hop/(0.2*B.s),0,0.6)))+")";ctx.beginPath();ctx.ellipse(B.x+rx*0.12,B.y+th*0.8,rx*1.12,ry*1.2,0,0,TAU);ctx.fill();
  ctx.translate(0,-hop);ctx.fillStyle=rgba(mix(rim,[0,0,0],0.25),1);ctx.fillRect(B.x-rx,B.y-th,rx*2,th);ctx.beginPath();ctx.ellipse(B.x,B.y,rx,ry,0,0,Math.PI);ctx.fill();
  const g=ctx.createLinearGradient(B.x-rx,0,B.x+rx,0);g.addColorStop(0,rgba(mix(rim,[255,255,255],0.35),1));g.addColorStop(1,rgba(rim,1));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(B.x,B.y-th,rx,ry,0,0,TAU);ctx.fill();
  if(o.ring){ctx.strokeStyle=rgba(o.ring,0.9);ctx.lineWidth=Math.max(2,0.03*B.s);ctx.beginPath();ctx.ellipse(B.x,B.y-th,rx*1.25,ry*1.25,0,0,TAU);ctx.stroke();}
  person(ctx,id,B.x,B.y-th,s,{pose:o.pose,expr:o.expr,E:o.E,t:o.t||0,pose2:o.pose2,mix:o.mix,glow:0,carry:o.carry,carryBehind:o.carryBehind,flip:o.flip,nod:o.nod,hat:!!P_.hat,wide:o.wide});ctx.restore();
  B.top=B.y-th-hop-1.72*P_.build.h*B.s;return B;}
// a figure moving along a path of [x,z] points at v metres a second from t0: where it is, and a small hop while it moves
function along(pts,t,t0,v){v=v||1.1;let L=0;const seg_=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg_.push(d);L+=d;}
  const T_=L/v,u=clamp((t-t0)/T_,0,1),e=u<=0?0:u>=1?1:(u<0.5?2*u*u:1-2*(1-u)*(1-u)),dd=e*L;let acc=0,i=0;while(i<seg_.length-1&&acc+seg_[i]<dd){acc+=seg_[i];i++;}
  const f=seg_[i]?(dd-acc)/seg_[i]:0,x=lerp(pts[i][0],pts[i+1][0],f),z=lerp(pts[i][1],pts[i+1][1],f),moving=u>0&&u<1;
  return{x,z,moving,done:u>=1,hop:moving?0.07*Math.abs(Math.sin(dd*Math.PI/0.42)):0,end:t0+T_};}

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
  cx.fillStyle=rgba(PAL.teal,1);rr(cx,-86,-58,172,116,8);cx.fill();cx.fillStyle="#fffdf6";rr(cx,-80,-52,78,104,4);cx.fill();rr(cx,2,-52,78,104,4);cx.fill();
  cx.strokeStyle="rgba(120,130,160,0.5)";cx.lineWidth=2;for(let i=0;i<5;i++){cx.beginPath();cx.moveTo(-72,-36+i*18);cx.lineTo(-10,-36+i*18);cx.moveTo(10,-36+i*18);cx.lineTo(72-(i===4?30:0),-36+i*18);cx.stroke();}cx.restore();
  fingers(cx,P_,[[mx-84,my+12],[mx+84,my+8]]);}
// a clipboard held up, facing out: fn draws on its paper (in the figure's units, 200 x 250)
function heldBoard(fn){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-30);
  cx.fillStyle=rgba(PAL.walnut,1);rr(cx,-110,-140,220,280,12);cx.fill();cx.fillStyle="#fffdf6";rr(cx,-98,-120,196,250,6);cx.fill();cx.fillStyle="rgba(170,176,190,1)";rr(cx,-34,-152,68,26,6);cx.fill();
  if(fn)fn(cx);cx.restore();fingers(cx,P_,[[mx-108,my+10],[mx+108,my+6]]);};}
// a box of gold pins
function heldPins(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+10);
  cx.fillStyle=rgba(PAL.navy,1);rr(cx,-70,-24,140,52,8);cx.fill();cx.fillStyle=rgba(mix(PAL.navy,[255,255,255],0.2),1);rr(cx,-70,-24,140,14,6);cx.fill();
  for(let i=0;i<9;i++){const x=-56+i*14,y=-30-6*hash(i,4);cx.strokeStyle="rgba(120,110,90,1)";cx.lineWidth=2;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x,y+18);cx.stroke();cx.fillStyle=rgba(PAL.gold,1);cx.beginPath();cx.arc(x,y,6,0,TAU);cx.fill();cx.fillStyle="rgba(255,250,220,0.8)";cx.beginPath();cx.arc(x-2,y-2,2,0,TAU);cx.fill();}
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

/* ===== The data governance series: the university as a toy town =====
   The data governance office stands on the green in the middle, open at the front (south). The other offices stand round it in a
   ring, each open at the front towards it, with ten paths between them: from above, it's DAMA's wheel, governance in the middle
   where the others meet. Five offices are open, with people at work in them: the Data platform (north), the Registrar's office,
   the Data team, Planning; the others are closed. A film adds its own things to a room through st.hooks, and its people
   through st.figs. drawCampus(ctx,S,C,st) draws one picture of the town from the camera C. */

const RINGF=10.6;
// a building: its front centre (x,z), the angle its depth runs towards, its size, its colours, and its room's colours
const BLD=[
  {id:"office",name:"Data governance",x:0,z:-1.9,ang:0,w:5,d:3.8,open:true,wall:[250,240,216],roof:PAL.roof,band:PAL.band,room:{win:[0.95,1.12,2.15,2.38]}},
  {id:"platform",name:"Data platform",ang:0,w:5.2,d:4,open:true,wall:[236,242,250],roof:[110,146,204],band:[120,180,226],
    room:{paper:[234,242,252],stripe:[214,228,246],dado:[150,172,206],side:[222,232,248],floor:[206,174,142],sprig:[140,170,220]}},
  {id:"registrar",name:"Registrar's office",ang:36,w:5.2,d:4,open:true,wall:[252,236,222],roof:[200,112,112],band:[232,156,124],
    room:{paper:[252,238,228],stripe:[242,216,206],dado:[204,164,172],side:[250,224,208],floor:[216,172,122],sprig:[220,140,140],win:[-2.05,1.12,-0.95,2.38]}},
  {id:"data",name:"Data team",ang:72,w:5.6,d:4,open:true,wall:[234,248,238],roof:[92,160,140],band:[122,194,164],
    room:{paper:[238,250,240],stripe:[216,240,224],dado:[142,192,172],side:[228,244,228],floor:[220,178,128],sprig:[120,180,150]}},
  {id:"library",name:"Library",ang:108,w:5.4,d:4.2,wall:[246,232,206],roof:[146,124,186],band:[204,176,124]},
  {id:"health",name:"School of Health",ang:144,w:5.2,d:4,wall:[252,226,214],roof:[120,170,150],band:[240,170,140]},
  {id:"eng",name:"School of Engineering",ang:-144,w:5.2,d:4,wall:[232,236,246],roof:[200,120,90],band:[150,170,214]},
  {id:"finance",name:"Finance",ang:-108,w:5.2,d:4,wall:[248,246,232],roof:[110,130,170],band:[200,190,130]},
  {id:"students",name:"Student services",ang:-72,w:5.2,d:4,wall:[250,236,246],roof:[224,140,120],band:[220,170,210]},
  {id:"planning",name:"Planning",ang:-36,w:5.2,d:4,open:true,wall:[252,246,224],roof:[214,164,84],band:[238,204,112],
    room:{paper:[252,248,228],stripe:[246,234,198],dado:[216,198,152],side:[252,238,208],floor:[222,178,130],sprig:[220,180,110],win:[1.05,1.12,2.15,2.38]}}];
const BLDI={};BLD.forEach(b=>{if(b.id!=="office"){b.x=RINGF*Math.sin(b.ang*DEG);b.z=RINGF*Math.cos(b.ang*DEG);}b.R={X0:-b.w/2,X1:b.w/2,Z0:0,Z1:b.d,FY:0.3,HY:2.95};BLDI[b.id]=b;});
// a point in a building's own coordinates, in the town's; and where its front centre is
function bldP(id,x,y,z){const b=BLDI[id],M=MX;mxSet(b.x,b.z,b.ang);const p=mxP(v3(x,y,z));MX=M;return p;}
const SPOKES=[...Array(10).keys()].map(k=>18+36*k);

// ---- what grows and stands on the green: fixed for the whole series ----
const NATURE=(()=>{const trees=[],shrubs=[],lamps=[],benches=[];
  // outside the ring, and between the buildings
  for(let i=0;i<46;i++){const a=hash(i,301)*360,r=16.2+hash(i,302)*8;if(SPOKES.some(s=>Math.abs(((a-s+540)%360)-180)<5))continue;trees.push([r*Math.sin(a*DEG),r*Math.cos(a*DEG),3.6+hash(i,303)*2.2,hash(i,304)]);}
  for(const s of SPOKES){for(const k of [-1,1]){const a=s+k*5.2,r=12.9;trees.push([r*Math.sin(a*DEG),r*Math.cos(a*DEG),3.0+hash(s+k,305)*0.9,hash(s,306)]);}}
  // on the green: a few trees and benches, and shrubs along the fronts
  // (away from the open offices' fronts, so the camera can look into them from the middle)
  for(const [a,r,h] of [[118,6.6,3.0],[-120,6.8,3.1],[154,6.5,2.8],[-156,6.4,2.9],[98,7.4,2.6],[-98,7.2,2.7]])trees.push([r*Math.sin(a*DEG),r*Math.cos(a*DEG),h,0.5]);
  for(const b of BLD){if(b.id==="office")continue;for(const k of [-1,1]){const p=bldP(b.id,k*(b.w/2+0.5),0,0.3);shrubs.push([p.x,p.z,0.42+0.1*hash(b.ang+k,307)]);}}
  for(const s of SPOKES){const r=9.2;lamps.push([r*Math.sin((s+3.6)*DEG),r*Math.cos((s+3.6)*DEG)]);}
  for(const [a,r] of [[54,6.4],[-54,6.4],[126,6.2],[-162,6.2]])benches.push([r*Math.sin(a*DEG),r*Math.cos(a*DEG),a]);
  return{trees,shrubs,lamps,benches};})();

// ---- the ground: the lawn, the plaza round the office, the paths, and the light along them ----
function pathQuad(a0,r0,r1,w,y){const a=a0*DEG,s=Math.sin(a),c=Math.cos(a),nx=c*w/2,nz=-s*w/2;return[v3(r0*s-nx,y,r0*c-nz),v3(r1*s-nx,y,r1*c-nz),v3(r1*s+nx,y,r1*c+nz),v3(r0*s+nx,y,r0*c+nz)];}
function ringQuads(r0,r1,y,n){const q=[];for(let i=0;i<n;i++){const a0=i*360/n*DEG,a1=(i+1)*360/n*DEG;q.push([v3(r0*Math.sin(a0),y,r0*Math.cos(a0)),v3(r1*Math.sin(a0),y,r1*Math.cos(a0)),v3(r1*Math.sin(a1),y,r1*Math.cos(a1)),v3(r0*Math.sin(a1),y,r0*Math.cos(a1))]);}return q;}
const RINGQ=ringQuads(9.55,10.3,0.004,72);
function campusGround(ctx,C,st){tHorizon(ctx,C,PAL.lawn);
  // the plaza round the office, the ten paths, the ring path in front of the offices
  poly3(ctx,C,discPts(0,0,3.95,48,0.003),mix(PAL.path,[255,255,255],0.15),{});poly3(ctx,C,discPts(0,0,3.75,48,0.0035),PAL.path,{});
  for(const s of SPOKES)poly3(ctx,C,pathQuad(s,3.6,21,0.86,0.004),PAL.path,{});
  for(const q of RINGQ)poly3(ctx,C,q,PAL.path,{});
  // a forecourt in front of the office
  poly3(ctx,C,[v3(-1.6,0.0045,-1.95),v3(1.6,0.0045,-1.95),v3(1.6,0.0045,-3.7),v3(-1.6,0.0045,-3.7)],mix(PAL.path,[255,255,255],0.1),{});
  tFlock(ctx,C,0,0,40,{a:0.18});
  // shadows of the buildings and trees, along the sun
  for(const b of BLD){mxSet(b.x,b.z,b.ang);const R=b.R;contactShadow(ctx,C,R.X0,R.Z0,b.w,b.d,0.22);castShadow(ctx,C,R.X0,R.Z0,b.w,b.d,R.HY+1.2,0.13);}mxOff();
  if(st.gold)goldPaths(ctx,C,st.gold);}
// governance's decisions reaching the work: gold light from the office along the paths to every office round it
function goldPaths(ctx,C,u){if(u<=0)return;const segs=[];
  for(const s of SPOKES){const r0=3.7,r1=9.92,ur=clamp(u/0.6,0,1);if(ur>0){const pts=[];for(let r=r0;r<=r0+(r1-r0)*ur+1e-6;r+=0.3)pts.push([r,s]);pts.push([r0+(r1-r0)*ur,s]);segs.push(pts);}
    const ua=clamp((u-0.6)/0.4,0,1);if(ua>0)for(const k of [-1,1]){const pts=[];for(let i=0;i<=12;i++)pts.push([r1,s+k*18*ua*i/12]);segs.push(pts);}}
  ctx.save();ctx.globalCompositeOperation="lighter";ctx.lineCap="round";ctx.lineJoin="round";
  for(const [w,a] of [[0.55,0.16],[0.26,0.3],[0.1,0.85]])for(const pts of segs){for(let i=1;i<pts.length;i++){const A=fromCyl([pts[i-1][0],pts[i-1][1],0.02]),B=fromCyl([pts[i][0],pts[i][1],0.02]),p=pj(C,A),q=pj(C,B);if(p.z<NEAR||q.z<NEAR)continue;
    ctx.strokeStyle=rgba(a>0.5?[255,236,170]:PAL.gold,a);ctx.lineWidth=Math.max(1,w*(p.s+q.s)/2);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
  ctx.restore();}

// ---- small things of the green ----
function tLamp(ctx,C,x,z,on){drawBox(ctx,C,x-0.04,0,z-0.04,0.08,1.9,0.08,[70,80,100],{edge:0.3});const P_=pj(C,v3(x,2.0,z));if(P_.z<NEAR)return;const r=0.14*P_.s;
  if(on){const g=ctx.createRadialGradient(P_.x,P_.y,1,P_.x,P_.y,r*5);g.addColorStop(0,"rgba(255,236,180,"+0.45*on+")");g.addColorStop(1,"rgba(255,236,180,0)");ctx.fillStyle=g;ctx.fillRect(P_.x-r*5,P_.y-r*5,r*10,r*10);}
  const g=ctx.createRadialGradient(P_.x-r*0.3,P_.y-r*0.3,1,P_.x,P_.y,r);g.addColorStop(0,"#fffbe8");g.addColorStop(1,"#f0d890");ctx.fillStyle=g;ctx.beginPath();ctx.arc(P_.x,P_.y,r,0,TAU);ctx.fill();}
function tBench(ctx,C,x,z,a){const M=MX;mxSet(x,z,a+180);drawBox(ctx,C,-0.6,0.36,-0.2,1.2,0.06,0.4,PAL.wood,{edge:0.4});drawBox(ctx,C,-0.6,0.5,0.14,1.2,0.34,0.06,PAL.wood,{edge:0.4});
  for(const k of [-0.5,0.46])drawBox(ctx,C,k,0,-0.18,0.06,0.36,0.36,[90,96,110],{edge:0.3});MX=M;}
// a signpost on a path: a post, and a board the scene writes on (drawn with the words, after the blur)
function tPost(ctx,C,x,z,h){drawBox(ctx,C,x-0.05,0,z-0.05,0.1,h,0.1,[150,104,66],{edge:0.3});}

// ---- the rooms: what's in each office (in the building's own coordinates) ----
// add(x,y,z,fn) puts a thing in the room's painter's order; lod 1 leaves out the small things, when the room is far
const FURNISH={
  office(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz,o=st.office||{};
    poly3(ctx,C,[v3(0.95,FY+0.004,bz-0.05),v3(2.15,FY+0.004,bz-0.05),v3(1.75,FY+0.004,bz-1.6),v3(0.55,FY+0.004,bz-1.6)],[255,240,196],{a:0.28});
    // the framed assessment, the clock
    wq3(ctx,C,-0.32,1.5,0.62,2.4,bz-0.03,ilit([196,150,96],1),{edge:0.5});wq3(ctx,C,-0.25,1.57,0.55,2.33,bz-0.035,[255,251,240]);
    surfDraw(ctx,C,v3(0.15,2.33,bz-0.04),v3(1,0,0),v3(0,1,0),c=>{Tw(c,"maturity",0,22,{w:700,size:12,align:"center",color:rgba([100,104,124],1)});Tw(c,"2.1 / 5",0,52,{w:800,size:20,align:"center",color:rgba([196,78,62],1)});});
    if(o.maturity>0)glowQuad(ctx,C,[v3(-0.36,1.46,bz-0.05),v3(0.66,1.46,bz-0.05),v3(0.66,2.44,bz-0.05),v3(-0.36,2.44,bz-0.05)],o.maturity);
    if(!lod)tClock(ctx,C,1.55,2.66,bz-0.03,0.16,9,10);
    // the pinboard on the left wall: the chart of who's responsible for what, with names still to be confirmed
    officePinboard(ctx,C,Q.xl+0.012,o,lod);
    tRug(ctx,C,-1.62,0.66,0.82,2.64,FY,PAL.rug);
    const SX=Q.xl+0.08,SZ=bz-0.42;
    add(SX+0.9,1,SZ+0.2,ctx=>{const n=tShelf(ctx,C,SX,SZ,1.85,2.22,0.42,{FY,skip:o.shelfSkip||((r,j)=>r===2&&j===4),out:o.shelfOut});
      if(o.shelfSign>0){const P_=pj(C,v3(SX+0.92,FY+2.26,SZ));lbAdd(c=>signBoard(c,P_.x,P_.y-4,"34 data policies",{size:32,bg:[255,226,150],rim:[200,150,60],ink:[74,52,20],a:o.shelfSign}));}});
    if(!lod)add(2.05,1,bz-0.3,ctx=>tPlant(ctx,C,2.02,FY,bz-0.3,1.25));
    add(1.45,1,2.95,ctx=>tChair(ctx,C,1.2,2.75,FY));
    add(1.45,1,2.1,ctx=>{const top=tDesk(ctx,C,0.55,1.75,1.8,0.78,FY);
      // the council's minutes in a red folder, a laptop, a lamp (o.bare clears the desk for the film's own things)
      if(!o.bare){ibox(ctx,C,0.7,top,1.85,0.48,0.08,0.36,[250,246,236],{edge:0.5});ibox(ctx,C,0.69,top+0.08,1.84,0.5,0.025,0.38,[214,84,72],{edge:0.4});
        ibox(ctx,C,1.38,top,1.9,0.52,0.025,0.36,[176,184,200],{edge:0.5});poly3(ctx,C,[v3(1.4,top+0.025,2.25),v3(1.88,top+0.025,2.25),v3(1.88,top+0.34,2.34),v3(1.4,top+0.34,2.34)],[70,80,104],{edge:0.5});}
      if(!lod)tDeskLamp(ctx,C,2.15,top,2.3,0.62,1);
      if(st.hooks&&st.hooks.officeDesk)st.hooks.officeDesk(ctx,C,top);});},
  platform(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz;
    // a big screen of a table's columns, two racks with their lights, a desk
    wq3(ctx,C,-1.9,1.25,0.3,2.5,bz-0.03,[56,62,78],{edge:0.5});wq3(ctx,C,-1.84,1.31,0.24,2.44,bz-0.035,[230,240,250]);
    surfDraw(ctx,C,v3(-1.84,2.44,bz-0.04),v3(1,0,0),v3(0,1,0),c=>{Tw(c,"students",8,12,{w:800,size:9,color:rgba(PAL.ink,1)});
      ["student_id","name","date_of_birth","award_code","email"].forEach((s,i)=>{c.fillStyle=i%2?"rgba(214,226,242,1)":"rgba(240,246,252,1)";c.fillRect(6,18+i*19,196,18);Tw(c,s,12,31+i*19,{w:600,size:9,f:"mono",color:rgba([60,70,100],1)});});});
    for(const x of [1.0,1.62])add(x+0.28,1,bz-0.5,ctx=>{ibox(ctx,C,x,FY,bz-0.75,0.56,1.95,0.6,[70,78,98],{edge:0.4});
      if(!lod)for(let i=0;i<9;i++){const yy=FY+0.2+i*0.19;wq3(ctx,C,x+0.06,yy,x+0.5,yy+0.13,bz-0.755,[90,100,124],{edge:0.25});
        const p=pj(C,v3(x+0.44,yy+0.065,bz-0.76)),on=0.5+0.5*Math.sin((st.t||0)*3+i*1.7+x*5);if(p.z>NEAR){ctx.fillStyle=rgba(i%3?[120,230,160]:[120,200,255],0.5+0.5*on);ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.2,0.025*p.s),0,TAU);ctx.fill();}}});
    add(-1.0,1,1.9,ctx=>{const top=tDesk(ctx,C,-1.9,1.55,1.7,0.72,FY,[200,206,220]);ibox(ctx,C,-1.5,top,1.65,0.5,0.025,0.34,[176,184,200],{edge:0.5});poly3(ctx,C,[v3(-1.48,top+0.025,1.98),v3(-1.02,top+0.025,1.98),v3(-1.02,top+0.32,2.07),v3(-1.48,top+0.32,2.07)],[60,70,96],{edge:0.5});
      if(st.hooks&&st.hooks.platformDesk)st.hooks.platformDesk(ctx,C,top);});
    if(!lod)add(-2.15,1,bz-0.3,ctx=>tPlant(ctx,C,-2.15,FY,bz-0.3,1.1));},
  registrar(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz;
    // framed certificates on the wall: the awards the office confers
    for(let i=0;i<3;i++){const x=-0.35+i*0.78;wq3(ctx,C,x,1.62,x+0.56,2.3,bz-0.03,ilit([196,160,96],1),{edge:0.5});wq3(ctx,C,x+0.06,1.68,x+0.5,2.24,bz-0.035,[255,252,240]);
      if(!lod){const p=pj(C,v3(x+0.28,1.82,bz-0.04));if(p.z>NEAR){ctx.fillStyle="#c8463a";ctx.beginPath();ctx.arc(p.x,p.y,0.05*p.s,0,TAU);ctx.fill();}
        for(let k=0;k<3;k++)wq3(ctx,C,x+0.12,2.12-k*0.08,x+0.44-(k===2?0.1:0),2.135-k*0.08,bz-0.04,[150,140,130],{a:0.7});}}
    // filing cabinets, and the counter across the room
    for(const x of [1.45,1.95])add(x+0.22,0.6,bz-0.35,ctx=>{ibox(ctx,C,x,FY,bz-0.62,0.46,1.3,0.58,[176,186,200],{edge:0.4});for(let i=0;i<3;i++){wq3(ctx,C,x+0.05,FY+0.1+i*0.4,x+0.41,FY+0.44+i*0.4,bz-0.625,ilit([196,204,216],1),{edge:0.3});}});
    add(0,0.6,1.5,ctx=>{ibox(ctx,C,-1.75,FY,1.3,3.1,0.95,0.42,[226,206,180],{edge:0.45});for(let i=0;i<4;i++)wq3(ctx,C,-1.68+i*0.76,FY+0.1,-1.02+i*0.76,FY+0.84,1.295,ilit([236,220,198],1),{edge:0.35});
      ibox(ctx,C,-1.82,FY+0.95,1.25,3.24,0.06,0.52,[204,150,104],{edge:0.6});const top=FY+1.01;
      // the draft submission, in a neat stack
      ibox(ctx,C,-0.95,top,1.32,0.42,0.1,0.3,[250,248,240],{edge:0.5});ibox(ctx,C,-0.96,top+0.1,1.31,0.44,0.02,0.32,[100,150,200],{edge:0.4});
      if(st.hooks&&st.hooks.registrarCounter)st.hooks.registrarCounter(ctx,C,top);});
    if(!lod)add(-2.15,1,bz-0.3,ctx=>tPlant(ctx,C,-2.15,FY,bz-0.3,1.15));},
  data(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz;
    // the team's poster of its loop of ten steps and a cork board for reports share the back wall; a desk with a big screen
    // stands well forward, so a camera close in looks over it at both
    loopPoster(ctx,C,-2.45,0.98,-0.2,2.72,bz-0.03,st,lod);
    wq3(ctx,C,0.01,1.18,2.49,2.72,bz-0.03,ilit(PAL.walnut,1),{edge:0.4});wq3(ctx,C,0.05,1.22,2.45,2.68,bz-0.034,ilit([222,176,124],1));
    if(st.hooks&&st.hooks.dataBoard)st.hooks.dataBoard(ctx,C,bz-0.04);
    add(0.85,1,1.4,ctx=>{const top=tDesk(ctx,C,-0.2,1.05,2.1,0.75,FY,[214,170,118]);
      tMonitor(ctx,C,0.4,top,1.25,1.02,0.62,st.hooks&&st.hooks.dataScreen?(c=>st.hooks.dataScreen(c,top)):(c=>{for(let i=0;i<6;i++){c.fillStyle=rgba(i%2?[120,170,220]:[160,200,140],0.8);c.fillRect(8,10+i*9,30+40*hash(i,5),4);}}),{bg:[246,250,252]});
      ibox(ctx,C,0.0,top,1.15,0.34,0.02,0.24,[190,196,210],{edge:0.4});});
    add(0.85,1,2.05,ctx=>tChair(ctx,C,0.66,1.95,FY,[96,160,140]));
    if(!lod)add(-2.3,1,0.6,ctx=>tPlant(ctx,C,-2.3,FY,0.6,1.2));},
  planning(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz;
    // a dashboard on the wall: bars and a line, and the number of awards
    wq3(ctx,C,-2.05,1.15,0.6,2.6,bz-0.03,[56,62,78],{edge:0.5});wq3(ctx,C,-1.99,1.21,0.54,2.54,bz-0.035,[244,248,252]);
    surfDraw(ctx,C,v3(-1.99,2.54,bz-0.04),v3(1,0,0),v3(0,1,0),c=>{for(let i=0;i<7;i++){const h=24+40*hash(i,41);c.fillStyle=rgba(i===6?PAL.gold:[140,180,220],1);c.fillRect(14+i*20,124-h,13,h);}
      c.strokeStyle=rgba(PAL.coral,1);c.lineWidth=2.4;c.beginPath();for(let i=0;i<8;i++){const x=160+i*12,y=96-26*hash(i,43)-i*3;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
      if(st.hooks&&st.hooks.planningScreen)st.hooks.planningScreen(c);});
    add(0.9,1,1.9,ctx=>{const top=tDesk(ctx,C,0.1,1.55,1.9,0.74,FY,[220,186,130]);ibox(ctx,C,0.4,top,1.7,0.5,0.025,0.34,[176,184,200],{edge:0.5});poly3(ctx,C,[v3(0.42,top+0.025,2.03),v3(0.88,top+0.025,2.03),v3(0.88,top+0.32,2.12),v3(0.42,top+0.32,2.12)],[60,70,96],{edge:0.5});
      for(let i=0;i<3;i++)ibox(ctx,C,1.2,top+i*0.03,1.7,0.36,0.03,0.26,[250,248,240],{edge:0.4});});
    add(1.0,1,2.6,ctx=>tChair(ctx,C,0.8,2.45,FY,[200,150,80]));
    if(!lod)add(2.2,1,bz-0.3,ctx=>tPlant(ctx,C,2.2,FY,bz-0.3,1.2));}};
// text in the world: decoration when it's drawn too small to read, words to read when it's big enough. The line is the one
// tools/legible.py draws: 28 px, less the 5% it allows for things still settling
function Tw(ctx,s,x,y,o){o=o||{};const m=ctx.getTransform(),k=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))/(ctx.canvas.width/W);T(ctx,s,x,y,Object.assign({},o,{deco:o.deco||(o.size||24)*k<26.6?1:0}));}
// a soft gold light on a quad, for what's being named
function glowQuad(ctx,C,pts,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="lighter";poly3(ctx,C,pts,[255,214,120],{a:0.22*a});ctx.restore();
  const Q=pts.map(p=>pj(C,p));if(Q.some(q=>q.z<NEAR))return;ctx.save();ctx.strokeStyle=rgba(PAL.gold,0.9*a);ctx.lineWidth=4;ctx.lineJoin="round";ctx.shadowColor=rgba(PAL.gold,0.8*a);ctx.shadowBlur=16;ctx.beginPath();Q.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.stroke();ctx.restore();}
// the office's pinboard, on the left wall (facing east, into the room): the chart, notes, and later the answers Yusuf pins up
const RACI={rows:["census report","award term","government submission","data access"],
  cells:[["Clara","TBC","Jun","TBC"],["Mei","TBC","TBC","Jun"],["Mei","TBC","TBC","Clara"],["Sam","TBC","Jun","TBC"]]};
function officePinboard(ctx,C,x,o,lod){const z0=0.5,z1=2.2,y0=1.28,y1=2.34,k=ILIT.L,n=v3(1,0,0);
  sq3(ctx,C,x,z0-0.04,y0-0.04,z1+0.04,y1+0.04,ilit(PAL.walnut,k),{edge:0.4});sq3(ctx,C,x+0.004,z0,y0,z1,y1,ilit([222,176,124],k),{grad:[0.04,0.06]});
  // notes round the chart
  for(const [za,ya,dz,dy,c] of [[1.62,1.95,0.3,0.3,[255,226,140]],[1.95,1.62,0.2,0.36,[196,226,240]],[1.66,1.38,0.26,0.24,[250,200,190]]]){sq3(ctx,C,x+0.008,za,ya,za+dz,ya+dy,ilit(c,k),{edge:0.3});const p=pj(C,v3(x+0.012,ya+dy*0.85,za+dz/2));if(p.z>NEAR){ctx.fillStyle="#d8574a";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.5,0.02*p.s),0,TAU);ctx.fill();}}
  // the chart: who's responsible, accountable, consulted and informed, for four things; half its names to be confirmed.
  // o.tbc (0..1) writes the TBCs in, one by one; o.raciHi lights the government submission's row; o.stamp (0..1) stamps its A
  sq3(ctx,C,x+0.008,0.56,1.32,1.58,2.28,ilit([255,253,246],k),{edge:0.4});
  {const O=v3(x+0.012,2.28,0.56),UX=v3(0,0,1),UY=v3(0,1,0),at=(X_,Y_,fn)=>surfAt(ctx,C,O,UX,UY,X_,Y_,fn),tbc=o.tbc==null?1:o.tbc,hi=o.raciHi||0,X=[60,70.5,81,91.5];
    // a line or a band across the chart, from y0 to y1 centimetres down
    const band=(y0,y1,col,a)=>sq3(ctx,C,x+0.01,0.57,2.28-y1/100,1.57,2.28-y0/100,col,{a});
    if(hi>0)band(57,72,[255,222,140],0.75*hi);
    at(5,12,c=>Tw(c,"RACI",0,0,{w:800,size:9,color:rgba(PAL.ink,1)}));["R","A","C","I"].forEach((s,j)=>at(X[j],24,c=>Tw(c,s,0,0,{w:800,size:6.2,align:"center",color:rgba([90,96,120],1)})));
    let n=0;RACI.rows.forEach((s,i)=>{const y=34+i*15;band(y-6.3,y-5.7,[200,204,220],0.9);at(4,y+4,c=>Tw(c,s,0,0,{w:700,size:4.2,color:rgba([70,76,100],1)}));
      RACI.cells[i].forEach((v,j)=>{if(v==="TBC"){const u=clamp(tbc*8-n,0,1);n++;if(u>0)at(X[j],y+4,c=>Tw(c,"TBC",0,0,{w:800,size:3.7*(0.6+0.4*spring(u)),align:"center",color:rgba(PAL.red,u)}));}
        else at(X[j],y+4,c=>Tw(c,v,0,0,{w:600,size:3.3,align:"center",color:rgba([70,76,100],1)}));});});
    const st=o.stamp||0;if(st>0)at(X[1],64,c=>{const k_=1.15*(1+1.3*(1-spring(st))),a=clamp(st*3,0,1);c.rotate(-0.14);c.scale(k_,k_);c.globalAlpha*=a;
      c.strokeStyle=rgba([200,52,44],0.9);c.lineWidth=1.1;rr(c,-9.5,-5.6,19,9.2,1.6);c.stroke();Tw(c,"TBC",0,1.7,{w:800,size:5.6,align:"center",color:rgba([200,52,44],0.95)});});}
  // the four answers, pinned over the chart one by one
  const cards=o.cards||0;[[0.66,1.86,[255,226,140]],[1.08,1.9,[250,200,190]],[0.7,1.44,[196,226,240]],[1.12,1.46,[214,236,214]]].forEach(([za,ya,c],i)=>{const u=clamp(cards-i,0,1);if(u<=0)return;const dz=0.36,dy=0.34,lift=(1-spring(u))*0.3;
    sq3(ctx,C,x+0.016+lift,za,ya,za+dz,ya+dy,ilit(c,k),{edge:0.4});for(let j=1;j<4;j++)sq3(ctx,C,x+0.018+lift,za+0.04,ya+dy*(j/4.5),za+dz-0.06,ya+dy*(j/4.5)+0.014,[120,120,150],{a:0.7});
    const p=pj(C,v3(x+0.02+lift,ya+dy*0.86,za+dz/2));if(p.z>NEAR){ctx.fillStyle=rgba(PAL.gold,1);ctx.beginPath();ctx.arc(p.x,p.y,Math.max(2,0.025*p.s),0,TAU);ctx.fill();}});}
// the data team's poster: the loop of ten steps it builds in, as drawn in In the weeds of data crafting
const LOOPP={cx:0.5,cy:0.53,rx:0.38,ry:0.36};
function loopPos(i,x0,y0,x1,y1,z){const an=-Math.PI/2+i/10*TAU,u=LOOPP.cx+Math.cos(an)*LOOPP.rx,v=LOOPP.cy+Math.sin(an)*LOOPP.ry;return v3(lerp(x0,x1,u),lerp(y1,y0,v),z);}
function loopPoster(ctx,C,x0,y0,x1,y1,z,st,lod){wq3(ctx,C,x0-0.04,y0-0.04,x1+0.04,y1+0.04,z,ilit([60,84,132],1),{edge:0.5});wq3(ctx,C,x0,y0,x1,y1,z-0.004,[252,250,244]);
  const w=(x1-x0)*100,h=(y1-y0)*100,hi=(st.data&&st.data.loopHi)||0;
  surfDraw(ctx,C,v3(x0,y1,z-0.006),v3(1,0,0),v3(0,1,0),c=>{const cx=w*LOOPP.cx,cy=h*LOOPP.cy,rx=w*LOOPP.rx,ry=h*LOOPP.ry;
    c.strokeStyle=rgba([150,170,210],1);c.lineWidth=4;c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,TAU);c.stroke();
    // arrows round the loop, clockwise
    for(let i=0;i<10;i++){const an=-Math.PI/2+(i+0.5)/10*TAU,px=cx+Math.cos(an)*rx,py=cy+Math.sin(an)*ry,ta=an+Math.PI/2;c.save();c.translate(px,py);c.rotate(Math.atan2(Math.sin(ta)*ry,Math.cos(ta)*rx));c.fillStyle=rgba([150,170,210],1);c.beginPath();c.moveTo(6,0);c.lineTo(-4,-5);c.lineTo(-4,5);c.closePath();c.fill();c.restore();}
    STEPS10.forEach(([nm,sg],i)=>{const an=-Math.PI/2+i/10*TAU,px=cx+Math.cos(an)*rx,py=cy+Math.sin(an)*ry,ph=phaseOf(i),col=[[120,170,240],[240,170,90],[130,200,150],[190,150,230]][ph];
      c.fillStyle=rgba(mix(col,[255,255,255],0.75),1);c.beginPath();c.arc(px,py,15,0,TAU);c.fill();c.strokeStyle=rgba(col,1);c.lineWidth=3;c.stroke();
      Tw(c,sg,px,py+5.5,{w:800,size:sg.length>2?11:14,align:"center",color:rgba(mix(col,[0,0,0],0.45),1)});});
    Tw(c,"build",cx,cy+4,{w:800,size:16,align:"center",color:rgba([90,110,150],1)});});
  if(hi>0)glowQuad(ctx,C,[v3(x0-0.05,y0-0.05,z-0.01),v3(x1+0.05,y0-0.05,z-0.01),v3(x1+0.05,y1+0.05,z-0.01),v3(x0-0.05,y1+0.05,z-0.01)],hi);}

// ---- one building: open and furnished when the camera is in front of it, closed otherwise ----
function drawBuilding(ctx,C,b,st,figs){mxSet(b.x,b.z,b.ang);const R=b.R,E=mxL(C.eye);
  if(b.open&&(E.z<R.Z0+0.05||st.inside===b.id)){const fs=pj(C,v3(0,1.5,0)),lod=fs.z>NEAR&&b.w*fs.s<380?1:0;
    const Q=tRoom(ctx,C,R,Object.assign({lod},b.room||{}));const items=[];const add=(x,y,z,fn)=>items.push({z:eyeD(C,v3(x,y,z)),fn});
    FURNISH[b.id](ctx,C,b,R,Q,add,st,lod);if(st.hooks&&st.hooks[b.id])st.hooks[b.id](ctx,C,R,Q,add,lod);
    for(const f of figs)add(f.x,1,f.z+(f.dz||0),ctx=>{const B=tFig(ctx,C,f.id,f.x,f.z,Object.assign({y:R.FY},f));if(f.onDraw)f.onDraw(ctx,B);});
    items.sort((a,b)=>b.z-a.z);for(const it of items)it.fn(ctx);
    tShell(ctx,C,R,{wall:b.wall,roof:b.roof,band:b.band,plinth:mix(b.wall,[0,0,0],0.04)});}
  else tClosed(ctx,C,R,{wall:b.wall,roof:b.roof,band:b.band,frontWins:b.open?null:(ctx,C,R)=>frontDoor(ctx,C,R,b)});
  if(st.glowFront&&st.glowFront[b.id]>0){const a=st.glowFront[b.id];glowQuad(ctx,C,[v3(R.X0,0.02,R.Z0-0.02),v3(R.X1,0.02,R.Z0-0.02),v3(R.X1,R.HY+0.2,R.Z0-0.02),v3(R.X0,R.HY+0.2,R.Z0-0.02)],a);}
  // a name over the front, when the picture asks for it: drawn after the blur, so it stays sharp
  const nm=st.names&&st.names[b.id];if(nm>0){const P_=pj(C,v3(0,R.HY+0.32,R.Z0-0.1));if(P_.z>NEAR)lbAdd(c=>signBoard(c,clamp(P_.x,260,W-260),Math.max(P_.y+20,108),b.name,{size:32,dot:b.band,bg:[255,252,244],rim:mix(b.band,[120,90,40],0.25),a:nm}));}
  mxOff();}
// the front of a closed building: a door and windows
function frontDoor(ctx,C,R,b){const z=R.Z0-0.01,w=R.X1-R.X0;winQ(ctx,C,[v3(-0.45,R.FY-0.3,z),v3(0.45,R.FY-0.3,z),v3(0.45,R.FY+1.75,z),v3(-0.45,R.FY+1.75,z)],NRM.F,{glass:mix(b.band,[60,50,40],0.35)});
  for(const k of [-1,1])for(const yy of [[R.FY+0.75,R.FY+1.95]]){const xc=k*w*0.3;winQ(ctx,C,[v3(xc-0.4,yy[0],z),v3(xc+0.4,yy[0],z),v3(xc+0.4,yy[1],z),v3(xc-0.4,yy[1],z)],NRM.F,{});}}

// ---- the whole picture ----
// st: t, figs [{id,x,z,at?,dz?,onDraw?,...tFig options}], hooks, office/data states, names {id:alpha}, gold, glowFront, inside (a room the camera
// stands in), posts(C,add) and extra(C,add) (things in the painter's order), over(ctx,C) (on top, before the blur), ts (blur band), after(ctx)
function drawCampus(ctx,S,C,st){setScreen(ctx,S);LBQ=[];DL=[];hazeFor(C,1.8);tSky(ctx);campusGround(ctx,C,st);
  // people in a room are drawn with the room; everyone else stands on the green
  const inB={},out=[];BLD.forEach(b=>inB[b.id]=[]);
  for(const f of (st.figs||[])){if(f.at){inB[f.at].push(f);continue;}let placed=false;for(const b of BLD){if(!b.open)continue;mxSet(b.x,b.z,b.ang);const L=mxL(v3(f.x,0,f.z));mxOff();
      if(L.x>b.R.X0&&L.x<b.R.X1&&L.z>b.R.Z0-0.05&&L.z<b.R.Z1){inB[b.id].push(Object.assign({},f,{x:L.x,z:L.z}));placed=true;break;}}if(!placed)out.push(f);}
  for(const b of BLD){const c=bldP(b.id,0,1.5,b.d/2);const vis=csp(C,c);if(vis.z<-6)continue;const P_=pjc(C,vis);if(vis.z>NEAR&&(P_.x<-P_.s*8||P_.x>W+P_.s*8||P_.y<-P_.s*7||P_.y>H+P_.s*6))continue;
    dlAdd(Math.hypot(c.x-C.eye.x,c.y-C.eye.y,c.z-C.eye.z),ctx=>drawBuilding(ctx,C,b,st,inB[b.id]));}
  for(const [x,z,h,k] of NATURE.trees)dlAdd(eyeD(C,v3(x,h*0.4,z)),ctx=>tTree(ctx,C,x,z,h,mix([104,178,104],[150,190,96],k*0.4),{round:k>0.7}));
  for(const [x,z,r] of NATURE.shrubs)dlAdd(eyeD(C,v3(x,r,z)),ctx=>tShrub(ctx,C,x,z,r,[84,160,96]));
  for(const [x,z] of NATURE.lamps)dlAdd(eyeD(C,v3(x,1,z)),ctx=>tLamp(ctx,C,x,z,st.lamps||0));
  for(const [x,z,a] of NATURE.benches)dlAdd(eyeD(C,v3(x,0.4,z)),ctx=>tBench(ctx,C,x,z,a));
  const addAt=(p,fn)=>dlAdd(eyeD(C,p),fn);if(st.posts)st.posts(C,addAt);
  for(const f of out)dlAdd(eyeD(C,v3(f.x,0.8,f.z))-0.3,ctx=>{const B=tFig(ctx,C,f.id,f.x,f.z,f);if(f.onDraw)f.onDraw(ctx,B);});
  if(st.extra)st.extra(C,addAt);
  dlDraw(ctx);
  if(st.over)st.over(ctx,C);
  const ts=st.ts||C.ts||[250,860,7];tiltShift(ctx,ts[0],ts[1],ts[2],ts[3]);vignetteSoft(ctx,[60,70,110],0.14);
  lbDraw(ctx,S);setScreen(ctx,S);if(st.after)st.after(ctx);}

/* ===== Off the shelf: the film's own pictures (prefixed os_) =====
   A market town on the same table, in its own time: a square of packed earth with a stone cross, stalls and timber-framed
   houses in 1215; its market hall in 1497, with the king's bronze standards in a cupboard behind a grille; the corn stall in
   1871, lined with bushels that don't agree; a grocer's shop in the 1880s, where the inspector checks a weight against his
   copy of the standard. Then what the chapters share: cameras that move between keys, dissolves between shots, labels and
   speech bubbles drawn after the blur, the place-and-year sign, and the title and end cards. */

// ---- the market town's buildings: timber-framed houses, a church, a stone cross ----
// a beam on a wall: from (x0,y0) to (x1,y1) on the plane z (a front) or x (a side), as a thin quad
function os_beamZ(ctx,C,x0,y0,x1,y1,z,wd,col){const dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy)||1,nx=-dy/l*wd/2,ny=dx/l*wd/2;poly3(ctx,C,[v3(x0+nx,y0+ny,z),v3(x1+nx,y1+ny,z),v3(x1-nx,y1-ny,z),v3(x0-nx,y0-ny,z)],col,{n:NRM.F});}
function os_beamX(ctx,C,z0,y0,z1,y1,x,wd,col){const dz=z1-z0,dy=y1-y0,l=Math.hypot(dz,dy)||1,nz=-dy/l*wd/2,ny=dz/l*wd/2;poly3(ctx,C,[v3(x,y0+ny,z0+nz),v3(x,y1+ny,z1+nz),v3(x,y1-ny,z1-nz),v3(x,y0-ny,z0-nz)],col,{n:NRM.R});}
// a house: plaster between oak beams, the upper floor jutting out over the street, a steep roof
function os_timber(ctx,C,x,z,w,d,o){o=o||{};const h1=o.h1||2.1,h2=o.h2||1.9,jut=0.3,pl=o.plaster||[240,228,200],tb=[92,64,44],roof=o.roof||[204,166,100];
  drawBox(ctx,C,x,0,z,w,h1,d,pl,{grad:[0.04,0.08],edge:0.3});drawBox(ctx,C,x-0.05,h1,z-jut,w+0.1,h2,d+jut,pl,{grad:[0.04,0.08],edge:0.3});
  const fz=z-0.012,uz=z-jut-0.012,seeF=visible(C,NRM.F,v3(x+w/2,1,z)),seeR=visible(C,NRM.R,v3(x+w,1,z+d/2)),seeL=visible(C,NRM.L,v3(x,1,z+d/2));
  if(seeF){const n=Math.max(2,Math.round(w/0.9));for(let i=0;i<=n;i++){const xx=x+i*w/n;os_beamZ(ctx,C,xx,0,xx,h1,fz,0.12,tb);os_beamZ(ctx,C,xx,h1,xx,h1+h2,uz,0.12,tb);}
    os_beamZ(ctx,C,x,h1-0.06,x+w,h1-0.06,fz,0.14,tb);os_beamZ(ctx,C,x-0.05,h1+0.06,x+w+0.05,h1+0.06,uz,0.16,tb);os_beamZ(ctx,C,x-0.05,h1+h2-0.06,x+w+0.05,h1+h2-0.06,uz,0.14,tb);
    for(let i=0;i<n;i+=2){const a=x+i*w/n,b=x+(i+1)*w/n;os_beamZ(ctx,C,a,h1+0.12,b,h1+h2-0.12,uz,0.1,tb);}
    // a door and a shuttered window below, small windows above
    const dx=x+w*(o.door==null?0.3:o.door);poly3(ctx,C,[v3(dx,0,fz-0.002),v3(dx+0.8,0,fz-0.002),v3(dx+0.8,1.75,fz-0.002),v3(dx,1.75,fz-0.002)],[110,76,52],{n:NRM.F,grad:[0.1,0.2]});
    const wx=x+w*0.65;poly3(ctx,C,[v3(wx,0.95,fz-0.002),v3(wx+0.7,0.95,fz-0.002),v3(wx+0.7,1.6,fz-0.002),v3(wx,1.6,fz-0.002)],[60,52,58],{n:NRM.F});
    for(const k of [0.25,0.7]){const ux=x+w*k-0.3;poly3(ctx,C,[v3(ux,h1+0.7,uz-0.002),v3(ux+0.6,h1+0.7,uz-0.002),v3(ux+0.6,h1+1.35,uz-0.002),v3(ux,h1+1.35,uz-0.002)],[70,62,70],{n:NRM.F});}}
  if(seeR||seeL){const X=seeR?x+w+0.012:x-0.012,XU=seeR?x+w+0.062:x-0.062,n=Math.max(2,Math.round(d/1.0));for(let i=0;i<=n;i++){const zz=z+i*d/n;os_beamX(ctx,C,zz,0,zz,h1,X,0.12,tb);}
    for(let i=0;i<=n;i++){const zz=z-jut+i*(d+jut)/n;os_beamX(ctx,C,zz,h1,zz,h1+h2,XU,0.12,tb);}os_beamX(ctx,C,z-jut,h1+0.06,z+d,h1+0.06,XU,0.16,tb);}
  gable(ctx,C,x-0.05,h1+h2,z-jut,w+0.1,d+jut,o.rh||2.4,roof,{wall:pl,ov:0.3});}
// a stone market cross on three steps
function os_cross(ctx,C,x,z){const st=[214,206,190];for(let i=0;i<3;i++){const r=1.1-i*0.3;drawBox(ctx,C,x-r,i*0.22,z-r,r*2,0.22,r*2,st,{grad:[0.08,0.1],edge:0.5});}
  drawBox(ctx,C,x-0.12,0.66,z-0.12,0.24,2.4,0.24,st,{grad:[0.1,0.1],edge:0.5});drawBox(ctx,C,x-0.42,2.7,z-0.08,0.84,0.18,0.16,st,{edge:0.5});drawBox(ctx,C,x-0.08,2.5,z-0.08,0.16,0.7,0.16,st,{edge:0.5});}
// a stone church, its tower, far off
function os_church(ctx,C,x,z){const st=[206,200,186];drawBox(ctx,C,x+2.6,0,z+0.5,6,4.2,4,st,{grad:[0.05,0.1],edge:0.3});gable(ctx,C,x+2.6,4.2,z+0.5,6,4,2.4,[150,140,150],{wall:st});
  drawBox(ctx,C,x,0,z,2.8,8.6,2.8,st,{grad:[0.06,0.12],edge:0.3});for(let i=0;i<4;i++)drawBox(ctx,C,x+i*0.75,8.6,z,0.4,0.45,0.4,st,{edge:0.3});
  for(const yy of [5.6,7.2])poly3(ctx,C,[v3(x+1.15,yy,z-0.01),v3(x+1.65,yy,z-0.01),v3(x+1.65,yy+0.9,z-0.01),v3(x+1.15,yy+0.9,z-0.01)],[70,66,80],{n:NRM.F});}

// ---- stalls and what's sold on them: drawn flat at a point and scaled with distance, like the figures ----
// a stall: a trestle table and a striped awning on four posts
function os_stall(ctx,C,x,z,w,d,col){const wood=[160,112,72];for(const [px,pz] of [[x,z+d],[x+w,z+d],[x,z],[x+w,z]])drawBox(ctx,C,px-0.05,0,pz-0.05,0.1,pz===z?1.9:2.3,0.1,wood,{edge:0.3});
  drawBox(ctx,C,x+0.1,0.78,z+0.05,w-0.2,0.08,d-0.1,[196,150,100],{grad:[0.1,0.1],edge:0.4});for(const [lx,lz] of [[x+0.2,z+d-0.23],[x+w-0.28,z+d-0.23],[x+0.2,z+0.15],[x+w-0.28,z+0.15]])drawBox(ctx,C,lx,0,lz,0.08,0.78,0.08,wood,{edge:0.3});
  const n=6;for(let i=0;i<n;i++){const a=x-0.1+i*(w+0.2)/n,b=a+(w+0.2)/n,c=i%2?[250,244,228]:col;poly3(ctx,C,[v3(a,1.9,z-0.25),v3(b,1.9,z-0.25),v3(b,2.32,z+d+0.1),v3(a,2.32,z+d+0.1)],c,{n:vnorm(v3(0,1,-0.35)),grad:[0.08,0.06],edge:0.3});
    poly3(ctx,C,[v3(a,1.9,z-0.25),v3(b,1.9,z-0.25),v3(b,1.72,z-0.27),v3(a,1.72,z-0.27)],c,{n:NRM.F});}}
const os_fill=(ctx,c,x0,x1,k)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(mix(c,[255,240,210],0.3*(k||1)),1));g.addColorStop(1,rgba(mix(c,[0,0,0],0.25*(k||1)),1));ctx.fillStyle=g;ctx.fill();};
function os_barrel(ctx,C,x,z,h,y){const B=pj(C,v3(x,y||0,z));if(B.z<NEAR)return;const k=B.s*h,w=k*0.66,c=[170,118,72];ctx.save();ctx.translate(B.x,B.y);ctx.fillStyle="rgba(50,40,30,0.25)";ctx.beginPath();ctx.ellipse(0,0,w*0.62,w*0.16,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(-w*0.46,0);ctx.quadraticCurveTo(-w*0.6,-k*0.5,-w*0.46,-k);ctx.lineTo(w*0.46,-k);ctx.quadraticCurveTo(w*0.6,-k*0.5,w*0.46,0);ctx.closePath();os_fill(ctx,c,-w*0.55,w*0.55);
  ctx.strokeStyle="rgba(70,60,56,0.85)";ctx.lineWidth=Math.max(1.5,k*0.05);for(const v of [0.18,0.82]){ctx.beginPath();ctx.moveTo(-w*0.52,-k*v);ctx.quadraticCurveTo(0,-k*v+k*0.04,w*0.52,-k*v);ctx.stroke();}
  ctx.fillStyle=rgba(mix(c,[255,230,200],0.2),1);ctx.beginPath();ctx.ellipse(0,-k,w*0.46,w*0.12,0,0,TAU);ctx.fill();ctx.restore();}
function os_sack(ctx,C,x,z,h){const B=pj(C,v3(x,0,z));if(B.z<NEAR)return;const k=B.s*h,c=[214,196,150];ctx.save();ctx.translate(B.x,B.y);ctx.fillStyle="rgba(50,40,30,0.22)";ctx.beginPath();ctx.ellipse(0,0,k*0.42,k*0.1,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(-k*0.36,0);ctx.bezierCurveTo(-k*0.5,-k*0.5,-k*0.24,-k*0.86,-k*0.1,-k*0.9);ctx.lineTo(k*0.1,-k*0.9);ctx.bezierCurveTo(k*0.24,-k*0.86,k*0.5,-k*0.5,k*0.36,0);ctx.closePath();os_fill(ctx,c,-k*0.4,k*0.4,0.8);
  ctx.strokeStyle="rgba(120,96,60,0.8)";ctx.lineWidth=Math.max(1.5,k*0.04);ctx.beginPath();ctx.moveTo(-k*0.13,-k*0.8);ctx.lineTo(k*0.13,-k*0.8);ctx.stroke();ctx.fillStyle="rgba(232,206,120,1)";ctx.beginPath();ctx.ellipse(0,-k*0.92,k*0.12,k*0.05,0,0,TAU);ctx.fill();ctx.restore();}
// a wooden measure of corn, heaped: w is how much wider than tall it is
function os_bushel(ctx,C,x,y,z,h,w){const B=pj(C,v3(x,y,z));if(B.z<NEAR)return null;const k=B.s*h,r=k*(w||1)*0.6,c=[180,128,80];ctx.save();ctx.translate(B.x,B.y);
  ctx.fillStyle="rgba(50,40,30,0.22)";ctx.beginPath();ctx.ellipse(r*0.1,0,r*1.08,r*0.2,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(-r*1.03,-k);ctx.lineTo(r*1.03,-k);ctx.lineTo(r,0);ctx.closePath();os_fill(ctx,c,-r,r);ctx.strokeStyle="rgba(70,60,56,0.8)";ctx.lineWidth=Math.max(1.5,k*0.05);for(const v of [0.18,0.62]){ctx.beginPath();ctx.moveTo(-r*1.01,-k*v);ctx.lineTo(r*1.01,-k*v);ctx.stroke();}
  ctx.fillStyle="rgba(232,200,110,1)";ctx.beginPath();ctx.ellipse(0,-k,r*1.03,Math.max(2,r*0.22),0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(0,-k-r*0.06,r*0.8,r*0.16,0,Math.PI,TAU);ctx.fill();
  ctx.fillStyle="rgba(200,160,80,0.7)";for(let i=0;i<24;i++){ctx.beginPath();ctx.arc((hash(i,4)-0.5)*r*1.6,-k+(hash(i,5)-0.5)*r*0.26,Math.max(1,k*0.03),0,TAU);ctx.fill();}ctx.restore();return B;}
// a handcart of apples: its bed, sides, a wheel on the side towards us, two handles and a leg
function os_cart(ctx,C,x,z){const wood=[170,124,80],dk=[150,104,66];
  for(const k of [0.25,0.65])drawBox(ctx,C,x-1.1,0.5,z+k,1.2,0.05,0.05,dk,{edge:0.3});drawBox(ctx,C,x+1.25,0,z+0.12,0.06,0.44,0.06,dk,{edge:0.3});drawBox(ctx,C,x+1.25,0,z+0.72,0.06,0.44,0.06,dk,{edge:0.3});
  drawBox(ctx,C,x,0.42,z,1.5,0.1,0.9,wood,{grad:[0.1,0.1],edge:0.4});drawBox(ctx,C,x,0.52,z,1.5,0.3,0.06,dk);drawBox(ctx,C,x,0.52,z+0.84,1.5,0.3,0.06,dk);drawBox(ctx,C,x+1.44,0.52,z,0.06,0.3,0.9,dk);
  for(let i=0;i<11;i++){const p=pj(C,v3(x+0.2+(i%5)*0.26,0.86,z+0.25+Math.floor(i/5)*0.24));if(p.z<NEAR)continue;ctx.fillStyle=i%3?"#c8463a":"#d9a640";ctx.beginPath();ctx.arc(p.x,p.y,0.12*p.s,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,240,220,0.4)";ctx.beginPath();ctx.arc(p.x-0.04*p.s,p.y-0.04*p.s,0.04*p.s,0,TAU);ctx.fill();}
  // the wheel, round in the plane of the cart's side, with its spokes
  const wc=v3(x+0.7,0.34,z-0.06),ring=[];for(let i=0;i<=24;i++){const a=i/24*TAU;ring.push(pj(C,v3(wc.x+Math.cos(a)*0.34,wc.y+Math.sin(a)*0.34,wc.z)));}if(ring.some(q=>q.z<NEAR))return;
  const c=pj(C,wc);ctx.save();ctx.strokeStyle="rgba(96,66,44,1)";ctx.lineCap="round";ctx.lineWidth=Math.max(2,0.05*c.s);ctx.beginPath();ring.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke();
  ctx.lineWidth=Math.max(1.5,0.025*c.s);for(let i=0;i<6;i++){const q=ring[i*4];ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(q.x,q.y);ctx.stroke();}ctx.fillStyle="rgba(96,66,44,1)";ctx.beginPath();ctx.arc(c.x,c.y,Math.max(2,0.05*c.s),0,TAU);ctx.fill();ctx.restore();}
// a glazed jug: a round belly, a narrow neck, a lip, a handle from the neck to the shoulder
function os_jug(ctx,C,x,y,z,h,c){const B=pj(C,v3(x,y,z));if(B.z<NEAR)return;const k=B.s*h;c=c||[176,120,84];ctx.save();ctx.translate(B.x,B.y);ctx.fillStyle="rgba(50,40,30,0.2)";ctx.beginPath();ctx.ellipse(k*0.05,0,k*0.3,k*0.06,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(mix(c,[0,0,0],0.2),1);ctx.lineWidth=Math.max(1.5,k*0.07);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(k*0.12,-k*0.86);ctx.bezierCurveTo(k*0.42,-k*0.86,k*0.44,-k*0.5,k*0.26,-k*0.46);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-k*0.2,0);ctx.bezierCurveTo(-k*0.34,-k*0.1,-k*0.36,-k*0.44,-k*0.24,-k*0.6);ctx.quadraticCurveTo(-k*0.12,-k*0.74,-k*0.13,-k*0.88);ctx.lineTo(-k*0.17,-k);ctx.lineTo(k*0.17,-k);ctx.lineTo(k*0.13,-k*0.88);
  ctx.quadraticCurveTo(k*0.12,-k*0.74,k*0.24,-k*0.6);ctx.bezierCurveTo(k*0.36,-k*0.44,k*0.34,-k*0.1,k*0.2,0);ctx.closePath();os_fill(ctx,c,-k*0.34,k*0.34);
  ctx.fillStyle=rgba(mix(c,[0,0,0],0.35),1);ctx.beginPath();ctx.ellipse(0,-k,k*0.17,k*0.045,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,250,230,0.35)";ctx.beginPath();ctx.ellipse(-k*0.14,-k*0.4,k*0.04,k*0.12,0.2,0,TAU);ctx.fill();ctx.restore();}
// the king's bronze gallon, held in both hands, in the figure's units
function os_heldGallon(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+30);const w=96,h=84;
  for(const s of [-1,1]){cx.strokeStyle="rgba(150,104,44,1)";cx.lineWidth=9;cx.beginPath();cx.arc(s*w*0.54,-h*0.6,15,s>0?-1.4:Math.PI-1.7,s>0?1.4:Math.PI+1.7,s<0);cx.stroke();}
  cx.beginPath();cx.moveTo(-w/2,0);cx.lineTo(-w/2-2,-h);cx.lineTo(w/2+2,-h);cx.lineTo(w/2,0);cx.closePath();const g=cx.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,"#fbe2a0");g.addColorStop(0.35,"#d8a850");g.addColorStop(1,"#8c6424");cx.fillStyle=g;cx.fill();
  cx.strokeStyle="rgba(110,76,30,0.8)";cx.lineWidth=3;for(const v of [0.12,0.88]){cx.beginPath();cx.moveTo(-w/2,-h*v);cx.lineTo(w/2,-h*v);cx.stroke();}cx.fillStyle="#6a4a20";cx.beginPath();cx.ellipse(0,-h,w/2+2,10,0,0,TAU);cx.fill();cx.restore();
  fingers(cx,P_,[[mx-w/2-6,my+4],[mx+w/2+6,my+4]]);}
// a bronze standard: a drum with two handles (the bushel, the gallon), drawn like the measures, in metal
function os_bronze(ctx,C,x,y,z,h,w){const B=pj(C,v3(x,y,z));if(B.z<NEAR)return;const k=B.s*h,r=k*w*0.5;ctx.save();ctx.translate(B.x,B.y);
  for(const s of [-1,1]){ctx.strokeStyle="rgba(150,104,44,1)";ctx.lineWidth=Math.max(2,k*0.09);ctx.beginPath();ctx.arc(s*r*1.04,-k*0.62,k*0.17,s>0?-1.4:Math.PI-1.7,s>0?1.4:Math.PI+1.7,s<0);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(-r*1.02,-k);ctx.lineTo(r*1.02,-k);ctx.lineTo(r,0);ctx.closePath();const g=ctx.createLinearGradient(-r,0,r,0);g.addColorStop(0,"#fbe2a0");g.addColorStop(0.35,"#d8a850");g.addColorStop(1,"#8c6424");ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle="rgba(110,76,30,0.8)";ctx.lineWidth=Math.max(1.2,k*0.04);for(const v of [0.12,0.88]){ctx.beginPath();ctx.moveTo(-r*1.01,-k*v);ctx.lineTo(r*1.01,-k*v);ctx.stroke();}
  ctx.fillStyle="#6a4a20";ctx.beginPath();ctx.ellipse(0,-k,r*1.02,Math.max(2,r*0.2),0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,240,200,0.5)";ctx.fillRect(-r*0.7,-k*0.8,r*0.12,k*0.6);ctx.restore();}

// ---- the market hall, 1497: open at the front like the offices of the university, with the king's standards in a cupboard ----
const OS_HALL={id:"os_hall",name:"market hall",x:6.6,z:13.4,ang:0,w:6.4,d:3.8,open:true,wall:[244,232,206],roof:[178,98,74],band:[120,84,56],
  room:{paper:[242,232,210],stripe:[236,224,200],dado:[150,110,76],side:[236,224,200],floor:[200,190,172],plain:true,flags:true,win:[-2.5,1.25,-1.6,2.3]}};
const OS_SHOP={id:"os_shop",name:"grocer's shop",x:-4.4,z:13.4,ang:0,w:6.4,d:3.8,open:true,wall:[236,228,214],roof:[150,96,80],band:[70,96,84],
  room:{paper:[236,226,196],stripe:[222,206,170],dado:[76,108,92],side:[232,220,190],floor:[196,150,104],sprig:[170,120,90]}};
for(const b of [OS_HALL,OS_SHOP])b.R={X0:-b.w/2,X1:b.w/2,Z0:0,Z1:b.d,FY:0.3,HY:2.95};
// the cupboard: oak, a dark inside behind an iron grille, the bushel and the gallon on its floor, a quart and the yard on its shelf
function os_cupboard(ctx,C,cx,FY,bz,a){const w=1.7,h=2.05,d=0.5,x0=cx-w/2,z0=bz-d,oak=[122,84,54];
  ibox(ctx,C,x0,FY,z0,w,h,d,oak,{edge:0.4});const ox0=x0+0.12,ox1=x0+w-0.12,oy0=FY+0.56,oy1=FY+h-0.14,fz=z0-0.004;
  wq3(ctx,C,ox0,oy0,ox1,oy1,fz,ilit([50,38,32],1));wq3(ctx,C,ox0,FY+1.22,ox1,FY+1.27,fz-0.003,ilit([140,100,66],1));
  os_bronze(ctx,C,cx-0.32,oy0+0.02,fz-0.01,0.5,1.45);os_bronze(ctx,C,cx+0.42,oy0+0.02,fz-0.01,0.34,1.1);os_bronze(ctx,C,cx-0.42,FY+1.28,fz-0.01,0.22,1.0);
  ibox(ctx,C,cx-0.2,FY+1.3,fz-0.06,0.62,0.035,0.035,[210,160,80],{edge:0.5});ibox(ctx,C,cx-0.2,FY+1.33,fz-0.06,0.02,0.05,0.035,[180,130,60]);ibox(ctx,C,cx+0.4,FY+1.33,fz-0.06,0.02,0.05,0.035,[180,130,60]);
  // the grille, and a drawer with a lock below
  for(let x=ox0+0.06;x<ox1;x+=0.115)wq3(ctx,C,x-0.012,oy0,x+0.012,oy1,fz-0.05,[64,66,76],{edge:0.25});for(const y of [oy0+0.3,oy1-0.25])wq3(ctx,C,ox0,y-0.014,ox1,y+0.014,fz-0.052,[64,66,76]);
  wq3(ctx,C,x0+0.1,FY+0.1,x0+w-0.1,FY+0.48,fz,ilit(mix(oak,[255,255,255],0.1),1),{edge:0.4});const p=pj(C,v3(cx,FY+0.29,fz-0.01));if(p.z>NEAR){ctx.fillStyle="#3a2c22";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.5,0.03*p.s),0,TAU);ctx.fill();}
  if(a>0)glowQuad(ctx,C,[v3(x0-0.05,FY-0.02,z0-0.06),v3(x0+w+0.05,FY-0.02,z0-0.06),v3(x0+w+0.05,FY+h+0.05,z0-0.06),v3(x0-0.05,FY+h+0.05,z0-0.06)],a);}
FURNISH.os_hall=function(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz,oak=[110,76,50],h=st.hall||{};
  // oak posts and a rail on the plaster
  for(const x of [-1.25,1.25,2.75])wq3(ctx,C,x-0.07,FY,x+0.07,R.HY,bz-0.012,ilit(oak,ILIT.F),{edge:0.3});wq3(ctx,C,Q.xl,2.36,Q.xr,2.48,bz-0.013,ilit(oak,ILIT.F),{edge:0.3});
  add(0,1,bz-0.3,ctx=>os_cupboard(ctx,C,0,FY,bz,h.glow||0));
  // a trestle table with the clerk's roll, and a bench
  add(2.0,0.6,1.9,ctx=>{ibox(ctx,C,1.3,FY,1.75,0.08,0.7,0.6,oak);ibox(ctx,C,2.62,FY,1.75,0.08,0.7,0.6,oak);ibox(ctx,C,1.2,FY+0.7,1.7,1.6,0.06,0.7,[170,124,82],{edge:0.5});
    ibox(ctx,C,1.5,FY+0.76,1.85,0.5,0.03,0.34,[246,236,206],{edge:0.4});});
  if(!lod)add(-2.4,0.4,2.9,ctx=>{ibox(ctx,C,-2.9,FY,2.75,1.0,0.42,0.36,oak,{edge:0.3});});};
// the grocer's shop, the 1880s: shelves of jars and tins, a counter with a scale, the Act pinned to a post, the inspector's case
function os_scale(ctx,C,x,y,z,tilt,o){const P=(dx,dy)=>pj(C,v3(x+dx,y+dy,z));const b0=P(0,0);if(b0.z<NEAR)return;const s=b0.s;
  ctx.save();ctx.lineCap="round";ctx.strokeStyle="#5c4a3a";ctx.lineWidth=Math.max(2,0.03*s);const top=P(0,0.5);ctx.beginPath();ctx.moveTo(b0.x,b0.y);ctx.lineTo(top.x,top.y);ctx.stroke();
  ctx.fillStyle="#6a5444";ctx.beginPath();ctx.ellipse(b0.x,b0.y,0.13*s,0.03*s,0,0,TAU);ctx.fill();
  const L=0.34,c=Math.cos(tilt),sn=Math.sin(tilt),ends=[P(-L*c,0.5+L*sn),P(L*c,0.5-L*sn)];ctx.strokeStyle="#c8a058";ctx.lineWidth=Math.max(2,0.022*s);ctx.beginPath();ctx.moveTo(ends[0].x,ends[0].y);ctx.lineTo(ends[1].x,ends[1].y);ctx.stroke();
  ctx.fillStyle="#d8b064";ctx.beginPath();ctx.arc(top.x,top.y,Math.max(2,0.025*s),0,TAU);ctx.fill();
  ends.forEach((e,i)=>{const py=e.y+0.27*s;ctx.strokeStyle="rgba(120,100,70,0.9)";ctx.lineWidth=Math.max(1,0.006*s);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x-0.1*s,py);ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+0.1*s,py);ctx.stroke();
    // a weight in each pan: the grocer's iron one on the right, by the inspector; his brass copy on the left, once it's set down
    if(i===1)os_weight(ctx,e.x,py-0.005*s,0.07*s,[70,72,80],o.crown);else if(o.brass)os_weight(ctx,e.x,py-0.005*s,0.07*s,null,0);
    const g=ctx.createLinearGradient(e.x-0.12*s,0,e.x+0.12*s,0);g.addColorStop(0,"#f6dc9a");g.addColorStop(1,"#a87c34");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(e.x,py,0.13*s,0.028*s,0,0,Math.PI);ctx.fill();ctx.beginPath();ctx.ellipse(e.x,py,0.13*s,0.022*s,0,0,TAU);ctx.fill();});
  ctx.restore();}
// a weight standing at (x,y) on screen, h tall: iron, or brass when col is null; crown (0..1) is the inspector's stamp on it
function os_weight(ctx,x,y,h,col,crown){ctx.save();ctx.translate(x,y);const w=h*1.15;ctx.beginPath();ctx.moveTo(-w*0.5,0);ctx.lineTo(w*0.5,0);ctx.lineTo(w*0.38,-h*0.8);ctx.lineTo(-w*0.38,-h*0.8);ctx.closePath();
  const g=ctx.createLinearGradient(-w*0.5,0,w*0.5,0);if(col){g.addColorStop(0,rgba(mix(col,[255,255,255],0.3),1));g.addColorStop(1,rgba(mix(col,[0,0,0],0.3),1));}else{g.addColorStop(0,"#fbe6a8");g.addColorStop(0.5,"#d8a850");g.addColorStop(1,"#8c6424");}ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();ctx.ellipse(0,-h*0.86,w*0.16,h*0.12,0,0,TAU);ctx.fill();
  if(crown>0){ctx.globalAlpha*=clamp(crown*2,0,1);const k=h*0.26*(1+0.5*(1-spring(crown)));ctx.fillStyle="#f4c84a";ctx.beginPath();ctx.moveTo(-k,-h*0.3);ctx.lineTo(-k,-h*0.3-k*1.1);ctx.lineTo(-k*0.5,-h*0.3-k*0.6);ctx.lineTo(0,-h*0.3-k*1.3);ctx.lineTo(k*0.5,-h*0.3-k*0.6);ctx.lineTo(k,-h*0.3-k*1.1);ctx.lineTo(k,-h*0.3);ctx.closePath();ctx.fill();}
  ctx.restore();}
// the inspector's stamp: a hammer swung from above the shoulder down onto the weight in the pan beside him; os_hammer draws the
// hammer in the hand, its handle at angle th (0 points straight out from the body, larger turns it up), its face striking downwards
Object.assign(POSE,{os_hitUp:{L:[0.16,-0.08],R:[2.15,2.9],feet:30,shift:4,tilt:0,turn:0.15,gaze:[0.5,0.3],look:1},
  os_hitDown:{L:[0.16,-0.08],R:[1.08,1.9],feet:30,shift:4,tilt:0.04,turn:0.15,gaze:[0.6,0.5],look:1}});
function os_hammer(th,flip){return(cx,P_,hands)=>{const r=hands[1],s=flip?-1:1;cx.save();cx.translate(r[0],r[1]);cx.scale(s,1);cx.rotate(-th);
  cx.fillStyle="#8a6040";rr(cx,-6,-4.5,92,9,4);cx.fill();const g=cx.createLinearGradient(0,-24,0,24);g.addColorStop(0,"#c8ccd4");g.addColorStop(1,"#7a808c");cx.fillStyle=g;rr(cx,72,-14,24,40,4);cx.fill();
  cx.fillStyle="rgba(255,255,255,0.35)";cx.fillRect(75,-11,5,34);cx.restore();fingers(cx,P_,[r]);};}
function os_case(ctx,C,x,FY,z,glow){const wood=[110,70,44];ibox(ctx,C,x-0.22,FY,z-0.2,0.44,0.46,0.4,[150,110,74],{edge:0.3});
  const y=FY+0.46;ibox(ctx,C,x-0.3,y,z-0.22,0.6,0.1,0.42,wood,{edge:0.4});ibox(ctx,C,x-0.27,y+0.1,z-0.19,0.54,0.012,0.36,[120,40,46]);
  poly3(ctx,C,[v3(x-0.3,y+0.1,z+0.2),v3(x+0.3,y+0.1,z+0.2),v3(x+0.3,y+0.48,z+0.27),v3(x-0.3,y+0.48,z+0.27)],wood,{n:NRM.F,edge:0.4});poly3(ctx,C,[v3(x-0.27,y+0.12,z+0.19),v3(x+0.27,y+0.12,z+0.19),v3(x+0.27,y+0.45,z+0.255),v3(x-0.27,y+0.45,z+0.255)],[130,46,52],{n:NRM.F});
  // brass copies of the standard weights, largest first
  for(let i=0;i<6;i++){const p=pj(C,v3(x-0.21+i*0.085,y+0.11,z-0.02));if(p.z>NEAR)os_weight(ctx,p.x,p.y,(0.1-i*0.012)*p.s,null,0);}
  if(glow>0)glowQuad(ctx,C,[v3(x-0.34,FY-0.02,z-0.26),v3(x+0.34,FY-0.02,z-0.26),v3(x+0.34,y+0.55,z-0.26),v3(x-0.34,y+0.55,z-0.26)],glow);}
function os_act(ctx,C,x,FY,z,glow){ibox(ctx,C,x-0.08,0,z-0.08,0.16,2.95,0.16,[96,70,52],{edge:0.35});const y0=FY+0.92,y1=FY+1.56,zz=z-0.085;
  wq3(ctx,C,x-0.24,y0,x+0.24,y1,zz,[250,244,226],{edge:0.5});surfAt(ctx,C,v3(x-0.24,y1,zz-0.002),v3(1,0,0),v3(0,1,0),24,8,c=>{Tw(c,"WEIGHTS AND",0,0,{w:800,size:4.4,align:"center",color:rgba([60,52,48],1)});Tw(c,"MEASURES ACT",0,6,{w:800,size:4.4,align:"center",color:rgba([60,52,48],1)});});
  for(let i=0;i<7;i++)wq3(ctx,C,x-0.19,y1-0.2-i*0.05,x+0.19-(i===6?0.12:0),y1-0.188-i*0.05,zz-0.003,[150,140,130],{a:0.7});const p=pj(C,v3(x,y1-0.03,zz-0.01));if(p.z>NEAR){ctx.fillStyle="#d8574a";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.5,0.02*p.s),0,TAU);ctx.fill();}
  if(glow>0)glowQuad(ctx,C,[v3(x-0.29,y0-0.05,zz-0.01),v3(x+0.29,y0-0.05,zz-0.01),v3(x+0.29,y1+0.05,zz-0.01),v3(x-0.29,y1+0.05,zz-0.01)],glow);}
FURNISH.os_shop=function(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz,s=st.shop||{};
  // shelves along the back wall, full of jars and tins
  for(let r=0;r<3;r++){const y=FY+1.05+r*0.55;ibox(ctx,C,Q.xl+0.05,y,bz-0.32,Q.xr-Q.xl-0.1,0.04,0.3,[150,104,66],{edge:0.3});
    if(!lod)for(let i=0;i<22;i++){const x=Q.xl+0.2+i*0.27;if(x>Q.xr-0.2)break;const tall=0.18+0.14*hash(i,r+7),c=[[196,72,60],[70,110,150],[220,180,90],[110,150,110],[236,226,200]][Math.floor(hash(i*3,r)*5)];
      ibox(ctx,C,x,y+0.04,bz-0.26,0.17,tall,0.16,c,{edge:0.3,grad:[0.16,0.12]});wq3(ctx,C,x+0.03,y+0.04+tall*0.35,x+0.14,y+0.04+tall*0.7,bz-0.262,[250,244,226]);}}
  add(-2.55,1,0.45,ctx=>os_act(ctx,C,-2.55,FY,0.45,s.act||0));
  // the counter, and on it the scale, a few parcels and the grocer's ledger
  add(-0.6,0.6,1.95,ctx=>{ibox(ctx,C,-2.3,FY,1.75,3.4,0.9,0.5,[160,112,74],{edge:0.4});for(let i=0;i<4;i++)wq3(ctx,C,-2.22+i*0.84,FY+0.1,-1.5+i*0.84,FY+0.8,1.745,ilit([176,128,86],1),{edge:0.35});
    ibox(ctx,C,-2.36,FY+0.9,1.7,3.52,0.05,0.6,[196,150,104],{edge:0.6});const top=FY+0.95;
    os_scale(ctx,C,-0.55,top,1.98,s.tilt||0,{brass:s.brass,crown:s.crown||0});
    ibox(ctx,C,-1.9,top,1.86,0.3,0.16,0.22,[214,190,150],{edge:0.4});ibox(ctx,C,-1.55,top,1.9,0.22,0.12,0.18,[226,206,170],{edge:0.4});ibox(ctx,C,0.35,top,1.86,0.4,0.03,0.28,[120,60,50],{edge:0.4});});
  add(1.75,0.5,1.05,ctx=>os_case(ctx,C,1.75,FY,1.05,s.caseGlow||0));
  if(!lod)add(2.6,0.5,2.9,ctx=>{for(let i=0;i<2;i++)os_barrel(ctx,C,2.45+i*0.4,2.95-i*0.1,0.7,FY);os_sack(ctx,C,2.1,3.1,0.6);});};

// ---- the market square: everything in one picture, dressed for its year ----
// st: t, era (1215, 1497, 1871 or 1880), figs [{id,x,z,y?,at?,...}] (at "hall" or "shop": in that building's own coordinates),
// jugs [h,h,h] (the wine stall's), charter (the seal's pop), bushels (0..1 their tags), hall, shop, ts (blur band), after(ctx)
const OS_HOUSES=[{x:-11.4,z:14.6,w:3.4,d:3.2,roof:[206,170,104]},{x:-7.6,z:15,w:3.2,d:3,roof:[178,98,74],plaster:[248,236,210],shop:1},{x:-4.0,z:14.8,w:3.4,d:3.2,roof:[206,170,104],plaster:[244,230,200],shop:1},
  {x:3.2,z:15,w:3.2,d:3,roof:[178,98,74],hall:1},{x:6.8,z:14.6,w:3.6,d:3.2,roof:[206,170,104],plaster:[246,232,204],hall:1},{x:10.8,z:14.8,w:3.2,d:3.2,roof:[178,98,74]},
  {x:-15.2,z:8.6,w:3.2,d:3.4,roof:[178,98,74],plaster:[246,234,206]},{x:13.6,z:8.2,w:3.2,d:3.4,roof:[206,170,104]}];
const OS_TREES=[[-12,22,6],[9,24,6.5],[14,18,5],[-16,16,6],[0.9,17.5,5.4],[12.6,11.4,4.4],[-10.2,11.0,4.2],[-17,4,5],[17,3,5.2]];
const OS_STALL={wine:[-5.6,5.4,2.6,1.3,[178,62,56]],corn:[3.0,5.4,2.6,1.3,[64,98,160]]};
function os_market(ctx,S,C,st){setScreen(ctx,S);LBQ=[];DL=[];MX=null;const era=st.era||1215,t=st.t||0;
  GV.hz0=14;GV.hz1=70;GV.hzA=0.85;HAZE=[226,236,246];
  tSky(ctx);tHorizon(ctx,C,[132,190,106]);tFlock(ctx,C,0,8,30,{a:0.14,skip:(x,z)=>x>-12.2&&x<13.2&&z>-16.2&&z<14.6});
  // the square: packed earth with stones in it, from the houses at the back to well behind the camera, and a lane out between the houses
  poly3(ctx,C,[v3(-12,0.005,-16),v3(13,0.005,-16),v3(13,0.005,14.4),v3(-12,0.005,14.4)],[222,198,156],{n:NRM.U,grad:[0.02,0.04]});
  poly3(ctx,C,[v3(-0.9,0.006,14.4),v3(2.9,0.006,14.4),v3(2.9,0.006,24),v3(-0.9,0.006,24)],[214,192,152],{n:NRM.U});
  ctx.save();ctx.fillStyle="rgba(150,120,90,0.25)";for(let i=0;i<1500;i++){const x=-11.6+hash(i,11)*24.2,z=-6+hash(i,12)*20,p=pj(C,v3(x,0.006,z));if(p.z<NEAR||p.x<-20||p.x>W+20||p.y<-20||p.y>H+20)continue;ctx.beginPath();ctx.ellipse(p.x,p.y,0.07*p.s,0.03*p.s,0,0,TAU);ctx.fill();}ctx.restore();
  // shadows first, on the ground under everything
  const houses=OS_HOUSES.filter(h=>!(era>=1497&&h.hall)&&!(era>=1880&&h.shop)),bld=[];if(era>=1497)bld.push(OS_HALL);if(era>=1880)bld.push(OS_SHOP);
  for(const h of houses){contactShadow(ctx,C,h.x,h.z,h.w,h.d,0.22);castShadow(ctx,C,h.x,h.z,h.w,h.d,5.4,0.13);}
  for(const b of bld){mxSet(b.x,b.z,b.ang);contactShadow(ctx,C,b.R.X0,0,b.w,b.d,0.22);castShadow(ctx,C,b.R.X0,0,b.w,b.d,4.3,0.13);mxOff();}
  for(const [k,s] of Object.entries(OS_STALL))contactShadow(ctx,C,s[0],s[1],s[2],s[3],0.18);contactShadow(ctx,C,-1.5,5.3,2.2,2.2,0.2);
  // the buildings, the cross, the stalls and the people, far to near
  const add=(p,fn)=>dlAdd(eyeD(C,p),fn);
  for(const h of houses)add(v3(h.x+h.w/2,2,h.z+h.d/2),ctx=>os_timber(ctx,C,h.x,h.z,h.w,h.d,h));
  add(v3(1.7,4,26),ctx=>os_church(ctx,C,-1.2,24));for(const [x,z,h] of OS_TREES)add(v3(x,h*0.4,z),ctx=>tTree(ctx,C,x,z,h,[104,170,100]));
  const inB={os_hall:[],os_shop:[]},out=[];for(const f of (st.figs||[])){if(f.at==="hall")inB.os_hall.push(f);else if(f.at==="shop")inB.os_shop.push(f);else out.push(f);}
  for(const b of bld)add(v3(b.x,1.5,b.z+b.d/2),ctx=>drawBuilding(ctx,C,b,st,inB[b.id]));
  add(v3(-0.4,1.2,6.4),ctx=>os_cross(ctx,C,-0.4,6.4));
  const w=OS_STALL.wine,cn=OS_STALL.corn,jugs=st.jugs||[0.32,0.24,0.4];
  add(v3(w[0]+w[2]/2,1,w[1]+w[3]/2),ctx=>{os_stall(ctx,C,...w);[[-5.1,5.9],[-4.5,5.85],[-3.7,5.95]].forEach(([x,z],i)=>os_jug(ctx,C,x,0.86,z,jugs[i],[[176,120,84],[160,108,80],[186,130,90]][i]));
    if(st.charter){const ch=st.charter,P_=pj(C,v3(-5.6,1.34,5.33));if(P_.z>NEAR)os_charter(ctx,P_.x,P_.y,P_.s,ch);}});
  for(const [x,z] of [[-5.3,7.4],[-4.6,7.5],[-3.9,7.35]])add(v3(x,0.5,z),ctx=>os_barrel(ctx,C,x,z,0.95));
  add(v3(cn[0]+cn[2]/2,1,cn[1]+cn[3]/2),ctx=>{os_stall(ctx,C,...cn);if(era===1871)os_bushels(ctx,C,st.bushels||0);});
  for(const [x,z,h] of [[3.4,7.3,0.9],[4.1,7.4,0.95],[4.8,7.3,0.85],[5.4,7.5,0.8]])add(v3(x,0.45,z),ctx=>os_sack(ctx,C,x,z,h));
  if(era===1215){add(v3(5.3,0.3,5.0),ctx=>os_sack(ctx,C,5.3,5.0,0.7));add(v3(3.55,0.3,4.3),ctx=>os_bushel(ctx,C,3.55,0,4.3,0.38,1.3));
    // close to us, out of focus: a handcart of apples, a barrel and a sack
    add(v3(-3.15,0.5,1.4),ctx=>os_cart(ctx,C,-3.9,1.0));
    add(v3(4.6,0.5,1.4),ctx=>os_barrel(ctx,C,4.6,1.4,1.0));add(v3(5.4,0.4,1.6),ctx=>os_sack(ctx,C,5.4,1.6,0.8));}
  for(const f of out)add(v3(f.x,0.8,f.z),ctx=>{const B=tFig(ctx,C,f.id,f.x,f.z,f);if(f.onDraw)f.onDraw(ctx,B);});
  if(st.extra)st.extra(C,add);
  dlDraw(ctx);if(st.over)st.over(ctx,C);
  const ts=st.ts||C.ts||[300,860,8];tiltShift(ctx,ts[0],ts[1],ts[2],ts[3]);vignetteSoft(ctx,[60,70,110],0.14);
  lbDraw(ctx,S);setScreen(ctx,S);if(st.after)st.after(ctx);GV.hzA=0.8;HAZE=[222,236,248];}
// the charter pinned to the stall's post, with its seal; flip (0..1) turns it over, as each new year reads it again
function os_charter(ctx,x,y,s,ch){const k=Math.abs(Math.cos(Math.PI*(ch.flip||0))),w=0.34*s,h=0.42*s;ctx.save();ctx.translate(x,y);ctx.scale(Math.max(0.04,k),1);
  ctx.fillStyle="rgba(60,40,20,0.2)";ctx.fillRect(-w/2+0.012*s,-h/2+0.016*s,w,h);const g=ctx.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,"#fbf3dc");g.addColorStop(1,"#e6d2a4");ctx.fillStyle=g;ctx.fillRect(-w/2,-h/2,w,h);
  ctx.strokeStyle="rgba(90,70,50,0.45)";ctx.lineWidth=Math.max(1,0.008*s);for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(-w/2+0.04*s,-h/2+0.06*s+i*0.042*s);ctx.lineTo(w/2-0.04*s-(i===6?0.1*s:0),-h/2+0.06*s+i*0.042*s);ctx.stroke();}
  ctx.strokeStyle="rgba(160,40,40,0.9)";ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(-0.01*s,h/2+0.06*s);ctx.stroke();const r=0.035*s*(1+0.4*(1-spring(clamp(ch.seal==null?1:ch.seal,0,1))));ctx.fillStyle="#b8322c";ctx.beginPath();ctx.arc(-0.01*s,h/2+0.08*s,r,0,TAU);ctx.fill();
  ctx.fillStyle="#d8574a";ctx.beginPath();ctx.arc(0,-h/2+0.015*s,Math.max(1.5,0.012*s),0,TAU);ctx.fill();ctx.restore();}
// 1871: the corn stall lined with measures, every one of them called a bushel; tags (0..1) puts a tag on each, one by one
const OS_BUSHELS=[[3.3,0.86,5.95,0.22,1.2],[3.7,0.86,5.92,0.3,1.0],[4.1,0.86,5.96,0.18,1.35],[4.5,0.86,5.92,0.34,0.95],[4.9,0.86,5.94,0.26,1.15],[5.3,0.86,5.98,0.2,1.3],
  [3.5,0,5.0,0.36,1.0],[4.35,0,4.9,0.28,1.25],[5.2,0,5.05,0.4,0.9]];
function os_bushels(ctx,C,tags){OS_BUSHELS.forEach(([x,y,z,h,w],i)=>{const B=os_bushel(ctx,C,x,y,z,h,w);if(!B||i>5)return;const u=clamp(tags*7-i,0,1);if(u<=0)return;
  // the tags take turns, high and low, so each has room
  const top=B.y-h*B.s-0.1*B.s,st_=i%2?104:24;lbAdd(c=>{c.save();c.translate(B.x,top);const k=0.6+0.4*spring(u);c.scale(k,k);c.globalAlpha*=clamp(u*2,0,1);
    c.strokeStyle="rgba(120,96,60,0.9)";c.lineWidth=2;c.beginPath();c.moveTo(0,0);c.lineTo(0,-st_);c.stroke();signBoard(c,0,-st_+2,"a bushel",{size:28,w:800,bg:[255,250,236],rim:[200,170,110]});c.restore();});});}

// ---- cameras: keys [t, eye, target, focal length, blur band?], eased like a sine between them ----
// A key's sixth item says how the move into it goes: "orbit" swings eye and target round the town's middle (so a move from one
// office to the next goes round the green, not across it), "line" goes straight (inside a room, or in the market).
function os_keys(list,o){o=o||{};const cx=o.cx||0,cz=o.cz||0;let pe=null,pg=null;
  return{cx,cz,keys:list.map(k=>{const e=cyl(k[1].x,k[1].y,k[1].z,cx,cz),g=cyl(k[2].x,k[2].y,k[2].z,cx,cz);
    if(pe)e[1]=pe[1]+(((e[1]-pe[1])%360+540)%360-180);if(pg)g[1]=pg[1]+(((g[1]-pg[1])%360+540)%360-180);pe=e;pg=g;
    return{t:k[0],e,g,E:k[1],G:k[2],f:k[3],ts:k[4],mode:k[5]||o.mode||"line"};})};}
function os_cam(K,t,o){o=o||{};const ks=K.keys;let a=ks[0],b=ks[0],u=0;
  if(t>=ks[ks.length-1].t)a=b=ks[ks.length-1];else for(let i=1;i<ks.length;i++)if(t<ks[i].t){a=ks[i-1];b=ks[i];u=t<=a.t?0:easeCam((t-a.t)/(b.t-a.t));break;}
  let e,g;if(b.mode==="orbit"){const L=(p,q)=>p.map((v,i)=>lerp(v,q[i],u));e=fromCyl(L(a.e,b.e),K.cx,K.cz);g=fromCyl(L(a.g,b.g),K.cx,K.cz);}
  else{e=vadd(a.E,vmul(vsub(b.E,a.E),u));g=vadd(a.G,vmul(vsub(b.G,a.G),u));}
  if(o.drift!==0){const d=o.drift||0.01;e=v3(e.x+Math.sin(t*0.37)*d,e.y+Math.sin(t*0.29+1)*d*0.7,e.z);}
  const C=cam3(e,g,lerp(a.f,b.f,u));if(a.ts&&b.ts)C.ts=a.ts.map((v,i)=>lerp(v,b.ts[i],u));else if(a.ts||b.ts)C.ts=a.ts||b.ts;return C;}
// a point in an office's own coordinates (x across its front, z from the front to the back), in the town's
const os_in=(id,x,y,z)=>bldP(id,x,y,z);

// ---- shots: a chapter can cut between pictures, with a short dissolve ----
// list: [[start, draw(ctx,S,t)], ...] in order; each draw paints the whole frame. From its start, a shot fades in over xf seconds.
function os_shots(ctx,S,t,list,xf){xf=xf==null?0.7:xf;let i=0;for(let k=0;k<list.length;k++)if(t>=list[k][0])i=k;
  list[i][1](ctx,S,t);const u=i>0?(t-list[i][0])/xf:1;if(u>=1)return;
  const cv=ctx.canvas,off=pcanvas2("os_x",cv.width,cv.height),o=off.getContext("2d");o.save();o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.globalCompositeOperation="source-over";list[i-1][1](o,S,t);o.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1-easeCam(u);ctx.drawImage(off,0,0);ctx.restore();}

// ---- words: labels and speech bubbles, drawn after the blur, kept inside the frame and clear of the captions ----
const OS_SAFE={x0:40,x1:W-40,y0:40,y1:868};
// a sign whose bottom centre is at (x,y), nudged inside the frame; k scales it from its foot (for a pop)
function os_board(c,x,y,text,o){o=o||{};const sz=o.size||30,lines=Array.isArray(text)?text:[text];c.save();c.font=font(o.w||800,sz);
  const pw=Math.max(...lines.map(l=>c.measureText(l).width))+sz*1.3+(o.dot?sz*0.55:0),ph=sz*0.75+sz*1.22*lines.length;
  const X=clamp(x,OS_SAFE.x0+pw/2,OS_SAFE.x1-pw/2),Y=clamp(y,OS_SAFE.y0+ph,OS_SAFE.y1);c.restore();
  const k=o.k==null?1:o.k;c.save();c.translate(X,Y);c.scale(k,k);signBoard(c,0,0,lines,{size:sz,w:o.w||800,dot:o.dot,bg:o.bg,ink:o.ink,rim:o.rim,a:o.a});c.restore();return{X,Y,w:pw,h:ph};}
// a label at a point of the world, lifted dy pixels above it; it pops in as a goes from 0 to 1
function os_tag(C,p,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const P_=pj(C,p);if(P_.z<NEAR)return;
  lbAdd(c=>os_board(c,P_.x+(o.dx||0),P_.y-(o.dy==null?16:o.dy),text,Object.assign({},o,{a:clamp(a*1.6,0,1),k:o.pop===false?1:0.7+0.3*spring(clamp(a,0,1))})));}
// a label over a figure (B is what tFig returned)
function os_figTag(B,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||!B||!B.top)return;
  lbAdd(c=>os_board(c,B.x+(o.dx||0),B.top-(o.dy==null?14:o.dy),text,Object.assign({},o,{a:clamp(a*1.6,0,1),k:0.7+0.3*spring(clamp(a,0,1))})));}
// a speech bubble from a figure's head; o.left puts it on the figure's left
function os_say(B,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||!B||!B.top)return;
  lbAdd(c=>{const sz=o.size||32,w=speechW(c,lines,sz,o.w||700),h=lines.length*sz*1.3+sz*0.9,tx=B.x+(o.tdx||0),ty=B.top+(o.tdy==null?18:o.tdy);
    const x=clamp(o.left?tx-w+90:tx-90,OS_SAFE.x0,OS_SAFE.x1-w),y=clamp(ty-h-(o.gap||64),OS_SAFE.y0,OS_SAFE.y1-h);
    tSpeech(c,x,y,w,lines,tx,ty,{size:sz,a:clamp(a*1.6,0,1),k:0.85+0.15*spring(clamp(a,0,1)),w:o.w||700});});}
// the place and the year, top left; list [[t, text], ...]: the sign turns over to show the next
function os_marker(ctx,t,list,a){let i=0;for(let k=0;k<list.length;k++)if(t>=list[k][0])i=k;const u=i>0?clamp((t-list[i][0])/0.4,0,1):1;
  let txt=list[i][1],sy=1;if(u<1){sy=Math.abs(Math.cos(Math.PI*u));if(u<0.5)txt=list[i-1][1];}
  ctx.save();ctx.translate(0,96);ctx.scale(1,Math.max(0.03,sy));ctx.translate(0,-96);marker(ctx,txt,a==null?1:a,u<1);ctx.restore();}
// how far a moment is into a fade: 0 before t0, 1 after t0+d
const os_in01=(t,t0,d)=>clamp((t-t0)/(d||0.5),0,1);
// in and out: up from t0, down from t1
const os_io=(t,t0,t1,d)=>Math.min(os_in01(t,t0,d||0.4),1-os_in01(t,t1,d||0.4));

// ---- the title and the end: a painted board over the town, blurred behind it ----
function os_card(ctx,a,big,small,foot){if(a<=0.01)return;blurAll(ctx,10*a,[[44,52,80],0.18*a]);ctx.save();ctx.globalAlpha*=clamp(a*1.4,0,1);const k=0.94+0.06*easeCam(a);
  ctx.translate(W/2,450);ctx.scale(k,k);ctx.translate(-W/2,-450);ctx.font=font(800,big[1]);const bw=Math.max(ctx.measureText(big[0]).width+160,tw(ctx,small,40,700)+160,980),bh=small?320:240,bx=W/2-bw/2,by=450-bh/2-30;
  ctx.save();ctx.shadowColor="rgba(30,36,60,0.35)";ctx.shadowBlur=40;ctx.shadowOffsetY=16;rr(ctx,bx,by+8,bw,bh,28);ctx.fillStyle=rgba([206,160,72],1);ctx.fill();ctx.restore();
  const g=ctx.createLinearGradient(0,by,0,by+bh);g.addColorStop(0,"#fffaf0");g.addColorStop(1,"#f6ecd4");rr(ctx,bx,by,bw,bh,28);ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle="rgba(214,170,90,0.6)";ctx.lineWidth=3;rr(ctx,bx+16,by+16,bw-32,bh-32,18);ctx.stroke();
  T(ctx,big[0],W/2,by+(small?150:150),{w:800,size:big[1],align:"center",color:rgba(PAL.ink,1)});if(small)T(ctx,small,W/2,by+232,{w:700,size:40,align:"center",color:rgba([110,90,60],1)});
  if(foot)signBoard(ctx,W/2,by+bh+110,foot,{size:30,w:700,dot:PAL.band,bg:[255,252,244]});ctx.restore();}

// ---- things on Yusuf's desk, in the office's own coordinates (the desk top is at y; x across, z from the front) ----
// a sheet of paper lying flat, its top edge away from us; fn(c) writes on it in centimetres from its top left corner
function os_paper(ctx,C,x0,z0,x1,z1,y,fn,o){o=o||{};fq3(ctx,C,x0+0.01,z0-0.008,x1+0.01,z1-0.008,y+0.001,[120,100,80],{a:0.18});fq3(ctx,C,x0,z0,x1,z1,y+0.003,o.col||[255,252,244],{edge:0.4});
  if(fn)surfDraw(ctx,C,v3(x0,y+0.004,z1),v3(1,0,0),v3(0,0,1),fn);}
// an open ring binder lying on the desk: its cover, two pages and the rings; left(c), right(c) write on the pages
function os_binderOpen(ctx,C,cx,cz,y,o){o=o||{};const pw=o.pw||0.3,pd=o.pd||0.4,col=o.col||PAL.navy;
  fq3(ctx,C,cx-pw-0.04,cz-pd/2-0.03,cx+pw+0.04,cz+pd/2+0.03,y+0.002,mix(col,[0,0,0],0.15),{edge:0.4});
  os_paper(ctx,C,cx-pw,cz-pd/2,cx-0.01,cz+pd/2,y+0.008,o.left);os_paper(ctx,C,cx+0.01,cz-pd/2,cx+pw,cz+pd/2,y+0.008,o.right);
  for(let i=0;i<3;i++){const p=pj(C,v3(cx,y+0.02,cz-pd/2+0.08+i*pd*0.4));if(p.z<NEAR)continue;ctx.save();ctx.strokeStyle="rgba(170,176,190,1)";ctx.lineWidth=Math.max(1.5,0.008*p.s);ctx.beginPath();ctx.ellipse(p.x,p.y,0.012*p.s,0.02*p.s,0,0,TAU);ctx.stroke();ctx.restore();}}
// the three trays Yusuf sorts the binder into: runs, owned decision, retire
const OS_TRAYS=[{x:0.8,col:[96,176,120],name:"runs in the work"},{x:1.32,col:[226,178,64],name:"owned decisions"},{x:1.84,col:[160,164,176],name:"can go"}];
function os_tray(ctx,C,x,z,y,col,n){const w=0.44,d=0.32,h=0.06;ibox(ctx,C,x-w/2,y,z-d/2,w,0.012,d,mix(col,[0,0,0],0.1));for(const [a,b,c_,e] of [[x-w/2,z-d/2,w,0.012],[x-w/2,z+d/2-0.012,w,0.012]])ibox(ctx,C,a,y,b,c_,h,e,col,{edge:0.4});
  for(const xx of [x-w/2,x+w/2-0.012])ibox(ctx,C,xx,y,z-d/2,0.012,h,d,col,{edge:0.4});for(let i=0;i<(n||0);i++)fq3(ctx,C,x-w/2+0.03+i*0.004,z-d/2+0.03,x+w/2-0.03,z+d/2-0.03,y+0.014+i*0.006,[255,252,244],{edge:0.3});}
// a page flying from one place to another along an arc, turning a little as it goes (u: 0 to 1)
function os_flyPage(ctx,C,a,b,u,lift){if(u<=0||u>=1)return;const e=easeCam(u),p=v3(lerp(a.x,b.x,e),lerp(a.y,b.y,e)+Math.sin(Math.PI*e)*(lift||0.35),lerp(a.z,b.z,e)),w=0.13,d=0.17,r=Math.sin(Math.PI*e)*0.5;
  const cs=Math.cos(r),sn=Math.sin(r),q=[[-w,-d],[w,-d],[w,d],[-w,d]].map(([x,z])=>v3(p.x+x*cs-z*sn*0.3,p.y+x*sn*0.4,p.z+z*cs+x*sn*0.3));poly3(ctx,C,q,[255,252,244],{edge:0.5});}

// ---- the registrar's counter: the government's reporting manual, thick, and the university's own term on a card ----
function os_manual(ctx,C,x,z,y){ibox(ctx,C,x,y,z,0.44,0.16,0.34,[46,72,120],{edge:0.5});ibox(ctx,C,x+0.02,y+0.02,z-0.006,0.4,0.12,0.02,[246,242,230],{edge:0.3});
  wq3(ctx,C,x+0.08,y+0.05,x+0.36,y+0.11,z-0.008,[250,248,240]);}
function os_tent(ctx,C,x,z,y,fn){const h=0.2,w=0.3;poly3(ctx,C,[v3(x,y,z),v3(x+w,y,z),v3(x+w,y+h,z+0.07),v3(x,y+h,z+0.07)],[255,252,244],{n:vnorm(v3(0,0.33,-1)),edge:0.5});
  if(fn)surfDraw(ctx,C,v3(x,y+h,z+0.07),v3(1,0,0),vnorm(v3(0,h,0.07)),fn);}

// ---- the data team's cork board: the two reports, when each ran, and the day the term changed ----
function os_reportCard(ctx,C,x0,y0,x1,y1,z,col,lines,a){if(a<=0.01)return;const lift=(1-spring(a))*0.25;wq3(ctx,C,x0,y0,x1,y1,z-0.006-lift,ilit(col,1),{edge:0.4});
  surfDraw(ctx,C,v3(x0,y1,z-0.008-lift),v3(1,0,0),v3(0,1,0),c=>lines.forEach(([s,sz,w,cl],i)=>Tw(c,s,(x1-x0)*50,lines.slice(0,i+1).reduce((m,l)=>m+l[1]*1.3,0)+2,{w:w||700,size:sz,align:"center",color:rgba(cl||PAL.ink,1)})));
  const p=pj(C,v3((x0+x1)/2,y1-0.04,z-0.01-lift));if(p.z>NEAR){ctx.fillStyle="#d8574a";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(2,0.02*p.s),0,TAU);ctx.fill();}}

// ---- the wheel: a signpost on each of the ten paths, its board one of DAMA's ten other knowledge areas ----
const OS_AREAS=[["data","architecture"],["data modelling","& design"],["data storage","& operations"],["data security"],["data integration","& interoperability"],["documents","& content"],["reference","& master data"],["data warehousing","& BI"],["metadata"],["data quality"]];
// the loop's pins: the steps where a governance decision enters the work, and what's pinned there
const OS_PINS=[[0,["a term"]],[1,["a classification"]],[3,["an owner","a contract"]],[4,["a rule"]],[7,["an approval"]],[9,["a version"]]];
function os_pin(ctx,C,p,a,big){if(a<=0.01)return;const P_=pj(C,p);if(P_.z<NEAR)return;const k=(0.6+0.4*spring(a))*(big||1),r=0.03*P_.s*k,lift=(1-spring(a))*40;ctx.save();ctx.globalAlpha*=clamp(a*2,0,1);
  ctx.fillStyle="rgba(60,40,20,0.3)";ctx.beginPath();ctx.ellipse(P_.x+r*0.4,P_.y+r*0.5,r,r*0.6,0,0,TAU);ctx.fill();const g=ctx.createRadialGradient(P_.x-r*0.3,P_.y-r*0.4-lift,1,P_.x,P_.y-lift,r);g.addColorStop(0,"#fff6c8");g.addColorStop(1,rgba(PAL.gold,1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(P_.x,P_.y-lift,r,0,TAU);ctx.fill();ctx.restore();}

// ---- a document held out in front at chest height, below the face; fn writes on its page (figure units, 200 x 250 round its middle) ----
function os_heldDoc(fn,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+112);
  cx.fillStyle="rgba(40,40,60,0.18)";rr(cx,-104,-122,216,262,8);cx.fill();cx.fillStyle=rgba(col||[250,248,240],1);rr(cx,-110,-130,220,262,8);cx.fill();
  cx.fillStyle="#fffdf6";rr(cx,-100,-122,200,246,5);cx.fill();if(fn)fn(cx);cx.restore();fingers(cx,P_,[[mx-104,my-6],[mx+104,my-8]]);};}

// ---- the data team's cork board, Jun's screen, the registrar's counter (chapter 4) ----
// a round green tick, pinned to a card's corner (u: 0 to 1, for a pop)
function os_tick(ctx,C,p,u){if(u<=0.01)return;const P_=pj(C,p);if(P_.z<NEAR)return;const r=0.045*P_.s*(0.6+0.4*spring(u));ctx.save();ctx.globalAlpha*=clamp(u*2,0,1);
  ctx.fillStyle=rgba([70,160,100],1);ctx.beginPath();ctx.arc(P_.x,P_.y,r,0,TAU);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=r*0.28;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(P_.x-r*0.45,P_.y+r*0.02);ctx.lineTo(P_.x-r*0.1,P_.y+r*0.36);ctx.lineTo(P_.x+r*0.48,P_.y-r*0.34);ctx.stroke();ctx.restore();}
// the glossary's entry for award, on Jun's screen (102 x 62 cm): n brings in Monday's new line, m the note that it changed
function os_term(c,n,m){c.fillStyle="#f6f9fc";c.fillRect(0,0,102,62);c.fillStyle=rgba([226,236,246],1);c.fillRect(0,0,102,10);
  Tw(c,"glossary",4,7,{w:700,size:4,color:rgba([96,104,128],1)});Tw(c,"award",4,21,{w:800,size:7.5,color:rgba(PAL.ink,1)});
  const tick=(x,y)=>{c.strokeStyle=rgba([70,160,100],1);c.lineWidth=0.9;c.lineCap="round";c.beginPath();c.moveTo(x,y-1.2);c.lineTo(x+1.2,y);c.lineTo(x+3.2,y-2.8);c.stroke();};
  Tw(c,"what counts:",4,29.5,{w:600,size:4,color:rgba([96,104,128],1)});["graduate certificates","masters and doctorates"].forEach((s,i)=>{tick(5,36.2+i*6.6);Tw(c,s,10.5,37+i*6.6,{w:600,size:4.2,color:rgba([60,70,100],1)});});
  if(n>0){c.save();c.globalAlpha*=clamp(n*2,0,1);c.fillStyle=rgba([255,226,150],0.9);rr(c,2.5,45.5-4*(1-spring(n)),97,14.5,1.6);c.fill();tick(5,51.2);
    Tw(c,"microcredentials,",10.5,52,{w:800,size:4.2,color:rgba([120,80,20],1)});Tw(c,"6 credit points or more",10.5,57.6,{w:700,size:4.2,color:rgba([120,80,20],1)});c.restore();}
  if(m>0){c.save();c.globalAlpha*=clamp(m*2,0,1);c.fillStyle=rgba(PAL.gold,1);rr(c,62,14.5,36,8.6,4.3);c.fill();Tw(c,"changed Monday",80,20.4,{w:800,size:3.6,align:"center",color:rgba([74,52,20],1)});c.restore();}}
// a book standing on the counter, its cover to us; fn writes on the cover in centimetres from its top left
function os_bookUp(ctx,C,x,z,y,w,h,col,fn){ibox(ctx,C,x+0.012,y,z+0.004,w,h,0.08,mix(col,[255,255,255],0.75),{edge:0.4});ibox(ctx,C,x,y,z,w,h,0.012,col,{edge:0.5});
  if(fn)surfDraw(ctx,C,v3(x,y+h,z-0.002),v3(1,0,0),v3(0,1,0),fn);}
// a dashed gold arc between two points of the world, drawn with the words (u: how much of it is drawn); o.label sits on its top
function os_arc(C,a,b,u,o){o=o||{};if(u<=0.01)return;lbAdd(c=>{const A=pj(C,a),B=pj(C,b);if(A.z<NEAR||B.z<NEAR)return;const mx=(A.x+B.x)/2,my=Math.min(A.y,B.y)-(o.lift||90);c.save();
  c.strokeStyle=rgba(PAL.gold,0.95);c.lineWidth=5;c.lineCap="round";c.setLineDash([14,12]);c.beginPath();const n=24;for(let i=0;i<=n*u;i++){const s=i/n,x=(1-s)*(1-s)*A.x+2*s*(1-s)*mx+s*s*B.x,y=(1-s)*(1-s)*A.y+2*s*(1-s)*my+s*s*B.y;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();c.restore();
  const la=o.la==null?1:o.la;if(o.label&&la>0.01)os_board(c,mx,(A.y+B.y)/4+my/2+(o.size||56)*0.9,o.label,Object.assign({},o,{a:clamp(la*1.6,0,1),k:0.7+0.3*spring(clamp(la,0,1))}));});}

// ---- the wheel (chapter 6): a signpost on each path, its board drawn with the words; a ring traced round the green ----
const OS_POSTR=7.6;
const os_postP=(k,y)=>{const a=(18+36*k)*DEG;return v3(OS_POSTR*Math.sin(a),y||0,OS_POSTR*Math.cos(a));};
function os_signpost(ctx,C,k,u,lab){if(u<=0.01)return;const p=os_postP(k),h=1.7*spring(u);tPost(ctx,C,p.x,p.z,h);if(!lab)return;const P_=pj(C,v3(p.x,h+0.12,p.z));if(P_.z<NEAR)return;
  lbAdd(c=>{c.save();c.translate(P_.x,P_.y);const s=0.7+0.3*spring(u);c.scale(s,s);signBoard(c,0,0,OS_AREAS[k],{size:28,w:800,bg:[255,252,244],rim:[150,104,66],a:clamp(u*2,0,1)*lab});c.restore();});}
// a dashed gold ring round the green at radius r (u: how much of it is drawn), with the words
function os_ring(C,r,u,y){if(u<=0.01)return;lbAdd(c=>{c.save();c.strokeStyle=rgba(PAL.gold,0.95);c.lineWidth=5;c.setLineDash([16,12]);c.lineCap="round";c.beginPath();let on=false;
  for(let i=0;i<=96*u;i++){const a=i/96*TAU,P_=pj(C,v3(r*Math.sin(a),y||0.05,r*Math.cos(a)));if(P_.z<NEAR){on=false;continue;}on?c.lineTo(P_.x,P_.y):c.moveTo(P_.x,P_.y);on=true;}c.stroke();c.restore();});}

// ---- a sheet turned over where it lies, about its left edge (th: 0 to PI); fn writes on its face while it can be seen ----
function os_pageFlip(ctx,C,x0,z0,x1,z1,y,th,fn){const w=x1-x0,cs=Math.cos(th),sn=Math.sin(th),P=(u,z)=>v3(x0+u*cs,y+0.004+u*sn,z);
  fq3(ctx,C,x0-(th>1.2?w:0)+0.01,z0-0.008,x0+(th>1.2?0:w)+0.01,z1-0.008,y+0.001,[120,100,80],{a:0.18*(Math.abs(cs)*0.6+0.4)});
  poly3(ctx,C,[P(0,z0),P(w,z0),P(w,z1),P(0,z1)],th<Math.PI/2?[255,252,244]:[244,240,230],{edge:0.4});
  if(fn&&th<1.35)surfDraw(ctx,C,v3(x0,y+0.005,z1),v3(cs,sn,0),v3(0,0,1),fn);}
// a pen lying on the desk
function os_pen(ctx,C,x,z,y){ibox(ctx,C,x,y,z,0.15,0.012,0.012,[44,56,92],{edge:0.3});ibox(ctx,C,x+0.15,y,z,0.025,0.012,0.012,[200,170,90],{edge:0.3});}
// Jun's screen once the agreement runs: a test that passes
function os_testScreen(c,u){c.fillStyle="#f6f9fc";c.fillRect(0,0,102,62);if(u<=0)return;c.save();c.globalAlpha*=clamp(u*2,0,1);const k=0.7+0.3*spring(u);
  c.translate(51,26);c.scale(k,k);c.fillStyle=rgba([70,160,100],1);c.beginPath();c.arc(0,0,12,0,TAU);c.fill();c.strokeStyle="#fff";c.lineWidth=3;c.lineCap="round";c.lineJoin="round";
  c.beginPath();c.moveTo(-5.5,0.5);c.lineTo(-1.5,4.5);c.lineTo(6,-4.5);c.stroke();c.restore();
  Tw(c,"test passed",51,52,{w:800,size:9,align:"center",color:rgba([50,120,76],clamp(u*2,0,1))});}
// a pin, drawn with the words so it sits on top of the poster
const os_pinQ=(C,p,u)=>lbAdd(c=>os_pin(c,C,p,u,1.75));
// a gold ring round a step of the loop poster, once it's pinned (r: the ring's radius in metres)
const os_stepRing=(C,p,r,u)=>lbAdd(c=>{const P_=pj(C,p);if(P_.z<NEAR||u<=0)return;c.save();c.globalAlpha*=clamp(u*1.5,0,1);c.strokeStyle=rgba(PAL.gold,0.95);c.lineWidth=Math.max(3,0.02*P_.s);
  c.beginPath();c.arc(P_.x,P_.y,r*P_.s*(1.12-0.12*spring(u)),0,TAU);c.stroke();c.restore();});

// ---- 10 · the series: nine binders for the policy films, six cards for the films on the tools ----
const OS_NEEDS=["Who decides","One word, one home","Who may see it","Rules that run","Fixed where it starts","Change without surprises","A product with an owner","An agent that checks","Teachers of data"];
const OS_TOOLS=[["Governed in dbt",["dbt"]],["Governed in Unity Catalog",["databricks"]],["Meaning on the platform",["databricks"]],["Quality on the platform",["dbt","databricks"]],["Products in open formats",["databricks"]],["The marketplace",["databricks"]]];
// which of the shelf's binders (row, place) stands for each policy film; the first is the one Yusuf takes
const OS_SHELF9=[[2,7],[3,2],[1,5],[2,1],[3,6],[1,1],[3,4],[1,7],[2,5]];
// each binder on the shelf, as tShelf lays them out (rows 1 to 3, places 0 to 10): its left edge, width and height, across the office
const OS_SHELFB=[0,1,2,3].map(r=>{if(!r)return null;const SX=-2.22,rh=(2.22-0.1)/4,bs=[];let bx=SX+0.09;for(let j=0;j<20;j++){const bw=0.12+0.03*hash(r*31+j,3),bh=Math.min(rh-0.1,0.4+0.05*hash(r*17+j,5));
  if(bx+bw>SX+1.85-0.08)break;bs.push([bx,bw,bh]);bx+=bw+0.012;}return bs;});
// a gold label on a binder that has come forward by out metres, with the number of its film
function os_binderTag(ctx,C,r,j,out,num,a){const [x0,w,h]=OS_SHELFB[r][j],y0=0.3+0.05+r*(2.22-0.1)/4+0.045,z=3.18-0.009-out;
  wq3(ctx,C,x0+w*0.14,y0+h*0.5,x0+w*0.86,y0+h*0.86,z,mix([250,246,234],[244,190,70],a));
  if(a>0.3)surfDraw(ctx,C,v3(x0+w*0.14,y0+h*0.86,z-0.001),v3(1,0,0),v3(0,1,0),c=>Tw(c,String(num),w*36,h*24,{w:800,size:6,align:"center",color:rgba([110,70,20],clamp(a*2-0.6,0,1))}));}
// the list of the policy films, its rows showing as their binders come forward (u[k]: 0 to 1); hi lights the first
function os_needsList(c,x,y,u,hi,a){if(a<=0.01)return;const rw=486,rh=52,top=86,h=top+u.reduce((s_,v)=>s_+easeCam(v),0)*rh+18;c.save();c.globalAlpha*=a;
  c.fillStyle="rgba(40,44,70,0.22)";rr(c,x+6,y+10,rw,h,22);c.fill();c.fillStyle="#fffaf0";rr(c,x,y,rw,h,22);c.fill();c.strokeStyle=rgba([214,170,90],0.9);c.lineWidth=3;rr(c,x+10,y+10,rw-20,h-20,16);c.stroke();
  T(c,"What governance needs",x+rw/2,y+58,{w:800,size:32,align:"center",color:rgba([120,88,40],1)});
  // the list unrolls: rows still below the board's edge are cut off by it
  c.beginPath();c.rect(x,y,rw,h-12);c.clip();
  OS_NEEDS.forEach((s,k)=>{const v=u[k];if(v<=0.01)return;const ry=y+top+k*rh,dx=(1-easeCam(v))*30;c.save();c.globalAlpha*=clamp(v*2,0,1);
    if(k===0&&hi>0){c.fillStyle=rgba([255,226,150],hi);rr(c,x+18,ry+2,rw-36,rh-6,12);c.fill();}
    c.fillStyle=rgba(PAL.gold,1);c.beginPath();c.arc(x+52+dx,ry+rh/2,20,0,TAU);c.fill();Tw(c,String(k+2),x+52+dx,ry+rh/2+8.5,{w:800,size:k===8?21:24,align:"center",color:"#fff"});
    T(c,s,x+86+dx,ry+rh/2+11,{w:700,size:30,color:rgba(PAL.ink,1)});c.restore();});c.restore();}
// a binder held out in front, its title on the label (lines in the figure's units)
function os_heldTitled(lines,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);
  const w=168,h=214;cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<7;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+16,-h/2+26,w-32,112,10);cx.fill();
  cx.fillStyle=rgba(mix(col,[0,0,0],0.5),1);cx.textAlign="center";cx.font=font(800,34);lines.forEach((s,i)=>cx.fillText(s,0,-h/2+72+i*40-(lines.length-1)*8));cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+30],[mx+w/2-2,my+24]]);};}
// a card on the data team's cork board for one of the films on the tools (in centimetres: 70 x 54, from its top left)
function os_toolCard(c,k,u){const [s,tools]=OS_TOOLS[k];c.save();c.globalAlpha*=clamp(u*2,0,1);
  c.fillStyle="rgba(60,40,20,0.28)";c.fillRect(1.2,1.6,70,54);c.fillStyle=k%2?"#f3f8ff":"#fffaf0";c.fillRect(0,0,70,54);
  c.fillStyle=rgba([90,130,200],1);c.fillRect(0,0,70,3);
  c.fillStyle=rgba([60,90,150],1);c.beginPath();c.arc(9,13,5.6,0,TAU);c.fill();Tw(c,String(k+11),9,15.2,{w:800,size:5.4,align:"center",color:"#fff"});
  let lx=19;tools.forEach(id=>{lx+=logo(c,id,lx,8.6,8.4)+3;});
  const words=s.split(" "),lines=[];let cur="";c.font=font(800,6.4);words.forEach(w=>{const tr=cur?cur+" "+w:w;if(c.measureText(tr).width>60&&cur){lines.push(cur);cur=w;}else cur=tr;});lines.push(cur);
  lines.forEach((l,i)=>Tw(c,l,35,34+i*8.6-(lines.length-1)*4,{w:800,size:6.4,align:"center",color:rgba(PAL.ink,1)}));c.restore();}

/* ===== Off the shelf: the ten chapters =====
   Each chapter is a few shots in the toy town, cut together with short dissolves. Times inside a chapter come from its cues
   (when each line starts), so the pictures stay with the voice if it's recorded again. Words on screen are signs, tags and
   speech bubbles, drawn after the blur, at least 28 px, and kept above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const os_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a hammer's strike: 0 (raised) to 1 (down) and back, over d seconds from t0
const os_strike=(t,t0,d)=>{const u=(t-t0)/(d||0.6);return u<=0||u>=1?0:u<0.35?easeCam(u/0.35):1-easeCam((u-0.35)/0.65);};
// the shop's own coordinates in the town's (it faces the square, so only a shift)
const os_shopP=(x,y,z)=>v3(OS_SHOP.x+x,y,OS_SHOP.z+z),os_hallP=(x,y,z)=>v3(OS_HALL.x+x,y,OS_HALL.z+z);

// ---- 1 · One measure: the market town, from 1215 to the 1880s ----
// the jugs on the wine stall, year by year: none of them the same
const OS_JUGS=[[0.32,0.24,0.4],[0.26,0.38,0.3],[0.4,0.28,0.22],[0.3,0.34,0.26],[0.24,0.42,0.33]];
scene("measure",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{
    const years=[c.repeat+0.2,c.repeat+1.5,c.repeat+2.8,c.repeat+4.1],hall=c.kings-0.4,y1871=wAt(sc,"county","In eighteen")-0.5,shop=c.worked-0.4,close=c.breath-1.8,title=c.breath+0.7;
    return{years,hall,y1871,shop,close,title,
      // where each shot's camera goes
      kA:os_keys([[0,v3(0,9.5,-12),v3(0,1.2,7),1450],[4.6,v3(0.5,4.4,-3.2),v3(0,1.25,6.0),1400],[c.repeat-0.6,v3(0.1,2.6,1.3),v3(-0.3,1.6,6.0),1400]]),
      kB:os_keys([[years[0]-0.3,v3(-4.4,2.0,1.6),v3(-4.4,1.0,6.0),1400],[hall+0.7,v3(-4.6,1.8,2.4),v3(-4.5,1.05,6.0),1400]]),
      kC:os_keys([[hall,v3(3.4,3.0,6.2),v3(6.2,1.5,14.0),1400],[hall+4.2,v3(4.6,2.7,7.6),v3(6.9,1.5,15.6),1400]]),
      kD:os_keys([[y1871,v3(4.3,2.3,1.2),v3(4.3,1.0,6.0),1400],[shop+0.7,v3(4.3,1.95,2.3),v3(4.3,1.05,6.0),1400]]),
      kE:os_keys([[shop,os_shopP(0.2,2.8,-6.0),os_shopP(0,1.4,2.0),1400],[shop+3.4,os_shopP(0.2,2.35,-4.4),os_shopP(0,1.4,2.0),1400],[close+0.7,os_shopP(0.15,2.25,-3.8),os_shopP(-0.05,1.4,2.0),1400]]),
      kF:os_keys([[close,os_shopP(-1.0,1.95,-0.6),os_shopP(-0.45,1.5,2.0),1450],[title+0.7,os_shopP(-0.85,1.9,-0.25),os_shopP(-0.45,1.5,2.0),1450]]),
      kG:os_keys([[title,v3(0,8.6,-10.4),v3(0,1.0,7.0),1500],[sc.dur+1,v3(0.6,9.2,-11.4),v3(0,1.0,7.0),1500]])};});
  const years=["England · 1225","England · 1297","England · 1640","England · 1824"];
  const mk=[[0,"England · 1215"],...P.years.map((y,i)=>[y,years[i]]),[P.hall,"England · 1497"],[P.y1871,"England · 1871"],[P.shop,"England · 1880s"]];
  const marker_=c_=>os_marker(c_,t,mk,os_in01(t,0.8,0.5)*(1-os_in01(t,P.close,0.5)));
  // the crier, his listeners: 1215
  const shotA=(ctx,S,t)=>{const C=os_cam(P.kA,t),say=os_io(t,c.quote-0.1,c.repeat-0.2,0.35);
    os_market(ctx,S,C,{t,era:1215,figs:[{id:"crier",x:-0.4,z:5.72,y:0.44,pose:"hold",t,carry:heldScroll,nod:0.05*Math.sin(t*2.2)*say,onDraw:(c_,B)=>os_say(B,["One measure of wine","throughout our kingdom."],{size:34,a:say})},
      {id:"vintner",x:-3.9,z:4.7,pose:"listen",t,flip:true},{id:"alewife",x:-2.4,z:4.2,pose:"hold",t,carry:heldJug},{id:"miller",x:3.3,z:4.6,pose:"listen",t},{id:"buyer",x:1.5,z:4.0,pose:"listen",t}],after:marker_});};
  // the years turn over at the wine stall: the charter read again, the jugs still all different
  const shotB=(ctx,S,t)=>{const C=os_cam(P.kB,t);let k=0;P.years.forEach((y,i)=>{if(t>=y)k=i+1;});const y0=k?P.years[k-1]:-9,u=clamp((t-y0)/0.45,0,1),g=spring(clamp((t-y0-0.2)/0.6,0,1));
    const jugs=OS_JUGS[k].map((h,i)=>k?lerp(OS_JUGS[k-1][i],h,g):h);
    os_market(ctx,S,C,{t,era:1215,jugs,charter:{flip:k?u:0,seal:k?clamp((t-y0-0.25)/0.5,0,1):1},after:marker_});};
  // 1497: the king's standards in a cupboard in the market hall; the clerk of the market checks a trader's jug now and then
  const shotC=(ctx,S,t)=>{const C=os_cam(P.kC,t),off=wAt(sc,"kings","Officers"),cl=along([[-1.4,2.3],[-0.9,0.8]],t,off-0.6,0.9),tr=along([[9.8,12.1],[7.5,12.6]],t,off-1.4,1.4);
    os_market(ctx,S,C,{t,era:1497,hall:{glow:os_io(t,wAt(sc,"kings","standards")-0.3,P.y1871+0.5,0.5)},
      figs:[{id:"clerk",at:"hall",x:cl.x,z:cl.z,hop:cl.hop,pose:"hold",t,carry:os_heldGallon},{id:"trader",x:tr.x,z:tr.z,hop:tr.hop,pose:"hold",t,carry:heldJug,flip:true}],
      extra:(C_,add)=>os_tag(C_,os_hallP(0,2.5,3.1),"the king's standard",{a:os_io(t,wAt(sc,"kings","standards"),P.y1871+0.3,0.4),size:30}),after:marker_});};
  // 1871: the corn stall, every measure on it called a bushel
  const shotD=(ctx,S,t)=>{const C=os_cam(P.kD,t),n32=wAt(sc,"county","thirty");
    os_market(ctx,S,C,{t,era:1871,figs:[{id:"grocer",x:4.7,z:7.1,pose:"listen",t}],bushels:clamp((t-wAt(sc,"county","bushel")+0.3)/2.2,0,1),after:c_=>{marker_(c_);const a=os_io(t,n32,P.shop+0.6,0.4);if(a>0)os_board(c_,W/2,214,"32 measures in one county",{size:36,a:clamp(a*1.6,0,1),k:0.8+0.2*spring(a),bg:[255,236,200],rim:[214,150,80]});}});};
  // the 1880s: what worked, all of it together: the Act, a copy of the standard, an inspector who checks, and stamps
  const law=c.three,copy=wAt(sc,"three","a copy"),insp=wAt(sc,"three","an inspector"),chk=wAt(sc,"three","checked"),again=wAt(sc,"three","again and"),behind=wAt(sc,"three","with the law");
  const shopState=(t,o)=>{const set=os_in01(t,chk+0.2,0.3),s1=os_strike(t,again,0.55),s2=os_strike(t,again+0.6,0.55);
    return Object.assign({tilt:0.2*(1-spring(clamp((t-chk-0.3)/0.9,0,1))),brass:set>=1,crown:clamp((t-again-0.2)/0.4,0,1),act:Math.max(os_io(t,law-0.1,copy,0.4),os_io(t,behind-0.1,P.close+0.4,0.4)),caseGlow:os_io(t,copy-0.1,insp+0.6,0.4),strike:Math.max(s1,s2)},o||{});};
  // he walks in to the counter beside the scale, shows a brass copy, sets it in the pan, and stamps the grocer's weight
  const inspector=(t,s,o)=>{const w=along([[-1.9,0.25],[0.75,1.4]],t,P.shop+0.1,1.0),hammer=t>=again-0.5,hold=t>=insp&&t<chk+0.2;
    return Object.assign({id:"inspector",at:"shop",x:w.x,z:w.z,hop:w.hop,t,flip:true,pose:hammer?"os_hitUp":hold?"hold":"stand",pose2:hammer?"os_hitDown":null,mix:s.strike,
      carry:hammer?os_hammer(lerp(1.35,0,s.strike),true):hold?heldWeight:null,wide:hammer},o||{});};
  const shotE=(ctx,S,t)=>{const C=os_cam(P.kE,t),s=shopState(t);
    os_market(ctx,S,C,{t,era:1880,shop:s,figs:[inspector(t,s,{onDraw:(c_,B)=>os_figTag(B,"an inspector who checks",{a:os_io(t,insp,P.close+0.3,0.4),size:30,dy:20,dx:130})}),{id:"grocer",at:"shop",x:-1.4,z:2.6,pose:"listen",t}],
      extra:(C_,add)=>{os_tag(C_,os_shopP(-2.55,2.0,0.36),"one definition, in law",{a:os_io(t,law,P.close+0.3,0.4),size:30});os_tag(C_,os_shopP(1.75,1.42,1.05),"a copy in every county",{a:os_io(t,copy,P.close+0.3,0.4),size:30});
        os_tag(C_,os_shopP(-0.55,1.32,1.75),"again and again",{a:os_io(t,again,P.close+0.3,0.4),size:30,dy:-70});},after:marker_});};
  // the stamp, close; then the title over the square
  const shotF=(ctx,S,t)=>{const C=os_cam(P.kF,t),hit=c.breath-0.6,s=shopState(t,{tilt:0,brass:true,act:0,caseGlow:0,crown:clamp((t-hit-0.18)/0.4,0,1),strike:os_strike(t,hit-0.2,0.7)});
    os_market(ctx,S,C,{t,era:1880,inside:"os_shop",shop:s,figs:[inspector(t,s,{x:0.75,z:1.4,hop:0}),{id:"grocer",at:"shop",x:-1.4,z:2.6,pose:"listen",t}],ts:[150,950,5]});};
  const shotG=(ctx,S,t)=>{const C=os_cam(P.kG,t);os_market(ctx,S,C,{t,era:1880,after:c_=>os_card(c_,os_in01(t,P.title+0.2,0.8),["Off the shelf",110],"where a policy meets the work","Film 1 of 16 · data governance")});};
  os_shots(ctx,S,t,[[0,shotA],[P.years[0]-0.3,shotB],[P.hall,shotC],[P.y1871,shotD],[P.shop,shotE],[P.close,shotF],[P.title,shotG]]);});

// ---- the people at work round the green, where they stand in their rooms ----
const OS_AT={jun:{id:"jun",at:"data",x:1.85,z:2.25,pose:"stand"},mei:{id:"mei",at:"registrar",x:0.35,z:2.2,pose:"stand"},sam:{id:"sam",at:"platform",x:0.55,z:2.5,pose:"stand"},clara:{id:"clara",at:"planning",x:-0.75,z:2.05,pose:"explain"}};
const os_at=(id,t,o)=>Object.assign({},OS_AT[id],{t},o||{});
// a camera in a room, in the room's own coordinates: [t, eye, target, f]
const os_rk=(id,t,e,g,f,mode)=>[t,bldP(id,...e),bldP(id,...g),f||1400,null,mode];
// Yusuf's way in, along a path from the south to his office's front, and up onto its floor
const OS_IN=[[-0.3,-7.4],[-0.4,-3.0],[-0.5,-0.9]];
const os_floor=z=>clamp((z+2.12)/0.3,0,1)*0.3;

// ---- 2 · The shelf: Yusuf's first day, and what he inherits ----
scene("shelf",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b=c.shelf-0.6,ch=c.chart-0.5,co=c.council-0.6,br=c.brief-0.5;
    return{b,ch,co,br,kA:os_keys([[0,v3(-4,9,-21),v3(-0.8,0.9,-4),1500],[c.starts+3.6,v3(0.2,2.7,-8.8),v3(-0.3,1.3,-1.2),1450]]),
      kB:os_keys([[b,v3(0.55,2.62,-6.45),v3(-0.12,1.36,0.3),1360],[ch+0.7,v3(-0.6,2.3,-4.2),v3(-0.95,1.6,1.0),1400]]),
      kC:os_keys([os_rk("office",ch,[-0.72,1.8,1.12],[-2.29,1.8,1.07],1400),os_rk("office",co+0.7,[-0.8,1.8,1.05],[-2.29,1.8,1.07],1400)]),
      kD:os_keys([os_rk("office",co,[0.95,2.05,1.2],[0.95,1.06,2.05],1450),os_rk("office",br+0.7,[0.98,1.95,1.32],[0.95,1.06,2.05],1450)]),
      kE:os_keys([[br,v3(0.6,2.45,-6.2),v3(0,1.4,0.2),1360],[sc.dur+1,v3(0.45,2.35,-5.5),v3(0,1.45,0.2),1360]])};});
  const yu=(t,o)=>{const w=along(OS_IN,t,0.5,1.25);return Object.assign({id:"yusuf",x:w.x,z:w.z,y:os_floor(w.z),hop:w.hop,pose:"stand",t},o||{});};
  const shotA=(ctx,S,t)=>{const C=os_cam(P.kA,t);drawCampus(ctx,S,C,{t,figs:[Object.assign(yu(t),{onDraw:(c_,B)=>os_figTag(B,["Yusuf Demir","data governance lead"],{a:os_io(t,c.starts+0.3,P.b+0.6,0.4),size:30})})]});};
  const shotB=(ctx,S,t)=>{const C=os_cam(P.kB,t);drawCampus(ctx,S,C,{t,figs:[yu(t,{x:-0.45,z:-0.75,y:0.3,hop:0,pose:"listen"})],
    office:{shelfSign:os_in01(t,wAt(sc,"shelf","thirty")-0.2,0.5),maturity:os_io(t,wAt(sc,"shelf","maturity"),P.ch+0.6,0.4),tbc:0},
    extra:(C_,add)=>os_tag(C_,bldP("office",0.15,2.5,3.55),"maturity · 2.1 / 5",{a:os_io(t,wAt(sc,"shelf","maturity"),P.ch+0.6,0.4),size:32})});};
  const shotC=(ctx,S,t)=>{const C=os_cam(P.kC,t);drawCampus(ctx,S,C,{t,inside:"office",office:{tbc:clamp((t-wAt(sc,"chart","half")+0.2)/2.2,0,1)},ts:[120,960,5]});};
  // the council's minutes, open on the desk: the same action, carried forward again
  const shotD=(ctx,S,t)=>{const C=os_cam(P.kD,t),st=pop(t,wAt(sc,"council","once")-0.1,0.6);
    drawCampus(ctx,S,C,{t,inside:"office",office:{bare:1,tbc:1},ts:[110,980,5],hooks:{officeDesk:(ctx,C_,top)=>{fq3(ctx,C_,0.5,1.8,1.42,2.36,top+0.002,[200,70,60],{edge:0.4});
      os_paper(ctx,C_,0.56,1.84,0.96,2.32,top+0.006,c_=>{Tw(c_,"Council minutes",20,6,{w:800,size:3.6,align:"center",color:rgba(PAL.ink,1)});[0,1,2].forEach(i=>{c_.fillStyle="rgba(150,150,170,0.6)";c_.fillRect(4,12+i*3,32-(i===2?10:0),0.6);});
        Tw(c_,"Action: name",20,27.3,{w:700,size:3.5,align:"center",color:rgba([70,76,100],1)});Tw(c_,"the data owners",20,32.2,{w:700,size:3.5,align:"center",color:rgba([70,76,100],1)});
        if(st>0){c_.save();c_.translate(20,40.5);c_.rotate(-0.12);const k=1+1.2*(1-st);c_.scale(k,k);c_.globalAlpha*=clamp(st*3,0,1);c_.strokeStyle=rgba([200,52,44],0.9);c_.lineWidth=0.5;rr(c_,-17,-4.2,34,7,1);c_.stroke();
          Tw(c_,"CARRIED FORWARD",0,1.3,{w:800,size:3.3,align:"center",color:rgba([200,52,44],0.95)});c_.restore();}});
      os_paper(ctx,C_,0.98,1.84,1.38,2.32,top+0.006,c_=>{[0,1,2,3,4,5].forEach(i=>{c_.fillStyle="rgba(150,150,170,0.55)";c_.fillRect(4,8+i*5,32-(i%3===2?12:0),0.6);});});}}});};
  const shotE=(ctx,S,t)=>{const C=os_cam(P.kE,t),say=os_in01(t,c.brief+0.1,0.4);
    drawCampus(ctx,S,C,{t,office:{tbc:1},figs:[yu(t,{x:-0.5,z:-0.7,y:0.3,hop:0,pose:"hold",expr:"worried",carry:heldBinder("12",PAL.navy)}),
      {id:"david",x:1.75,z:-2.6,pose:"explain",t,flip:true,onDraw:(c_,B)=>os_say(B,["Can you fix governance","before the submission?"],{size:32,a:say,left:true})}]});};
  os_shots(ctx,S,t,[[0,shotA],[P.b,shotB],[P.ch,shotC],[P.co,shotD],[P.br,shotE]]);});

// ---- 3 · Two numbers: two reports across the green that don't agree ----
// Planning's census report, on the wall screen in its office (in centimetres from the screen's top left, 253 x 133)
function os_census(c,n){c.fillStyle="#f4f8fc";c.fillRect(0,0,253,133);Tw(c,"Census report",14,24,{w:800,size:15,color:rgba(PAL.ink,1)});Tw(c,"awards conferred this year",14,44,{w:600,size:12,color:rgba([96,104,128],1)});
  for(let i=0;i<6;i++){const h=22+46*hash(i,41);c.fillStyle=rgba(i===5?PAL.gold:[150,186,222],1);c.fillRect(16+i*19,122-h,13,h);}
  if(n>0){c.save();c.translate(190,96);const k=0.7+0.3*spring(n);c.scale(k,k);c.globalAlpha*=clamp(n*2,0,1);Tw(c,"4,812",0,0,{w:800,size:44,align:"center",color:rgba([40,96,150],1)});c.restore();}}
// the registrar's draft submission, held out (in the figure's units, the page 200 x 246 round its middle)
const os_draft=n=>c=>{c.fillStyle="rgba(100,150,200,1)";c.fillRect(-100,-122,200,86);c.fillStyle="#fff";c.textAlign="center";c.font=font(800,34);c.fillText("Draft",0,-86);c.fillText("submission",0,-50);
  for(let i=0;i<2;i++){c.fillStyle="rgba(150,150,170,0.6)";c.fillRect(-74,-16+i*16,148-(i===1?50:0),6);}
  if(n>0){c.save();c.translate(0,72);const k=0.7+0.3*spring(n);c.scale(k,k);c.globalAlpha*=clamp(n*2,0,1);c.fillStyle=rgba([40,96,150],1);c.font=font(800,70);c.fillText("4,867",0,0);c.restore();}
  c.fillStyle=rgba([96,104,128],1);c.font=font(700,30);c.fillText("awards",0,110);};
scene("numbers",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const pl=c.census-0.6,rg=c.draft-0.6,wh=c.which-0.6;
    return{pl,rg,wh,kA:os_keys([[0,v3(0.2,11,-6.5),v3(0,0.8,9.5),950],[pl+0.7,v3(0.05,9.0,0.6),v3(0,0.8,9.5),950]]),
      kB:os_keys([os_rk("planning",pl,[-0.2,1.95,-0.6],[-0.4,1.7,3.8],1400),os_rk("planning",rg+0.7,[-0.3,1.9,-0.1],[-0.45,1.7,3.8],1400)]),
      kC:os_keys([os_rk("registrar",rg,[0.75,1.75,-2.3],[0.75,1.42,2.5],1250),os_rk("registrar",wh+0.7,[0.75,1.7,-1.8],[0.78,1.45,2.5],1250)]),
      kD:os_keys([[wh,v3(0,8.6,1.8),v3(0,0.8,9.5),950],[sc.dur+1,v3(0.25,8.2,2.4),v3(0,0.8,9.5),950]])};});
  const cen=wAt(sc,"census","four"),dr=wAt(sc,"draft","four");
  // Yusuf crosses the green from his office, and stops in the middle of it
  const yu=t=>{const w=along([[-1.4,2.4],[-0.6,4.2],[0,5.9]],t,0.6,1.1);return{id:"yusuf",x:w.x,z:w.z,hop:w.hop,pose:w.done?"listen":"stand",t,expr:t>c.which?"concerned":"calm"};};
  const shotA=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kA,t),{t,office:{tbc:1},figs:[yu(t),os_at("clara",t),os_at("mei",t)]});
  const shotB=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB,t),{t,inside:"planning",ts:[110,980,5],hooks:{planningScreen:c_=>os_census(c_,os_in01(t,cen-0.1,0.5))},
    figs:[os_at("clara",t,{x:1.3,z:3.05,pose:"point",flip:true})]});
  const shotC=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kC,t),{t,inside:"registrar",ts:[110,980,5],figs:[os_at("mei",t,{x:0.75,z:0.85,pose:"hold",carry:os_heldDoc(os_draft(os_in01(t,dr-0.1,0.5)))})]});
  const shotD=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kD,t),{t,office:{tbc:1},names:{planning:1,registrar:1},
    figs:[Object.assign(yu(t),{onDraw:(c_,B)=>os_figTag(B,"?",{a:os_in01(t,c.which,0.5),size:64,bg:[255,226,150],rim:[214,160,60],ink:[120,80,20],dy:24})}),os_at("clara",t),os_at("mei",t)],
    extra:(C_,add)=>{os_tag(C_,bldP("planning",0.8,0.3,-0.15),["census report","4,812 awards"],{size:34,pop:false});os_tag(C_,bldP("registrar",-0.95,0.3,-0.15),["draft submission","4,867 awards"],{size:34,pop:false});}});
  os_shots(ctx,S,t,[[0,shotA],[P.pl,shotB],[P.rg,shotC],[P.wh,shotD]]);});

// ---- 4 · Who decides? Yusuf follows the numbers back to the data team, the registrar, and his own chart ----
scene("decides",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b1=c.both-0.5,b2=c.monday-0.6,b3=c.before-0.6,cc=c.gov-0.6,d=c.answers-0.6,e=c.tbc-0.6;
    return{b1,b2,b3,cc,d,e,kA:os_keys([[0,v3(0.25,8.2,2.4),v3(0,0.8,9.5),950],[b1+0.7,v3(-1.4,4.4,7.0),v3(9.6,1.2,3.1),1150]]),
      kB:os_keys([os_rk("data",b1,[1.25,2.04,1.3],[1.25,1.93,3.8],1400),os_rk("data",b2+0.7,[1.25,2.03,1.55],[1.25,1.93,3.8],1400)]),
      kS:os_keys([os_rk("data",b2,[0.8,1.6,0.05],[0.95,1.55,1.25],1400),os_rk("data",b3+0.7,[0.84,1.6,0.25],[0.95,1.55,1.25],1400)]),
      kB3:os_keys([os_rk("data",b3,[1.25,2.03,1.55],[1.25,1.93,3.8],1400),os_rk("data",cc+0.7,[1.25,2.02,1.75],[1.25,1.93,3.8],1400)]),
      kC:os_keys([os_rk("registrar",cc,[0.1,1.85,-0.75],[0.1,1.45,1.5],1400),os_rk("registrar",d+0.7,[0.1,1.8,-0.4],[0.1,1.45,1.5],1400)]),
      kD:os_keys([[d,v3(0.5,13,0.8),v3(2.2,0,8.6),900],[e+0.7,v3(0.75,12.6,1.4),v3(2.2,0,8.6),900]]),
      kE:os_keys([[e,v3(-0.9,1.95,-1.95),v3(-2.28,1.8,-0.84),1360],[sc.dur+1,v3(-1.05,1.93,-1.72),v3(-2.28,1.8,-0.84),1360]])};});
  const right=wAt(sc,"both","right"),mon=wAt(sc,"monday","microcredentials"),chg=wAt(sc,"monday","the word"),bef=wAt(sc,"before","before"),aft=wAt(sc,"before","after");
  // the cork board: the two reports and when each ran; later, Monday's change between them
  const board=(ctx,C,z,o)=>{const card=(x0,x1,lines,a)=>os_reportCard(ctx,C,x0,1.62,x1,2.22,z,[255,252,244],lines,a);
    card(0.1,1.02,[["census report",8.5,800],["ran Friday",7.5,600],["4,812",18,800,[40,96,150]]],1);card(1.48,2.4,[["draft submission",8.5,800],["ran Wednesday",7.5,600],["4,867",18,800,[40,96,150]]],1);
    os_tick(ctx,C,v3(0.97,2.17,z-0.012),o.tick);os_tick(ctx,C,v3(2.35,2.17,z-0.012),o.tick);
    if(o.mon>0)os_reportCard(ctx,C,1.06,1.74,1.44,2.12,z,[255,226,150],[["Monday",8.5,800],["award",7,700],["changed",7,700]],o.mon);
    surfDraw(ctx,C,v3(0.1,1.6,z-0.006),v3(1,0,0),v3(0,1,0),c_=>{if(o.bef>0)Tw(c_,"before",46,6,{w:800,size:7.5,align:"center",color:rgba([40,96,150],clamp(o.bef*2,0,1))});if(o.aft>0)Tw(c_,"after",184,6,{w:800,size:7.5,align:"center",color:rgba([40,96,150],clamp(o.aft*2,0,1))});});};
  const yu=t=>{const w=along([[0,5.9],[4.4,4.5]],t,0.3,1.25);return{id:"yusuf",x:w.x,z:w.z,hop:w.hop,pose:"stand",t,expr:"concerned"};};
  const shotA=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kA,t),{t,office:{tbc:1},figs:[yu(t),os_at("jun",t),os_at("mei",t),os_at("clara",t)]});
  const shotB=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB,t),{t,inside:"data",ts:[100,990,4],hooks:{dataBoard:(ctx,C,z)=>board(ctx,C,z,{tick:os_in01(t,right-0.1,0.5)})}});
  const shotS=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kS,t),{t,inside:"data",ts:[100,990,4],hooks:{dataScreen:c_=>os_term(c_,os_in01(t,mon-0.1,0.6),os_in01(t,chg,0.5))},figs:[os_at("jun",t,{x:1.95,z:2.0,pose:"point"})]});
  const shotB3=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB3,t),{t,inside:"data",ts:[100,990,4],hooks:{dataBoard:(ctx,C,z)=>board(ctx,C,z,{tick:1,mon:os_in01(t,P.b3+0.5,0.6),bef:os_in01(t,bef,0.4),aft:os_in01(t,aft,0.4)})}});
  // the registrar's counter: the government's reporting manual, the university's own term, and no one who maps one to the other
  const who=wAt(sc,"gov","Who");
  const shotC=(ctx,S,t)=>{const top=1.31;drawCampus(ctx,S,os_cam(P.kC,t),{t,inside:"registrar",ts:[100,990,4],
    figs:[os_at("mei",t,{x:1.05,z:2.3,pose:t>who?"shrug":"listen",expr:"concerned"})],
    hooks:{registrarCounter:(ctx,C,top_)=>{os_bookUp(ctx,C,-0.46,1.38,top_,0.36,0.46,[46,72,120],c_=>{Tw(c_,"Reporting",18,13,{w:800,size:5,align:"center",color:"#fff"});Tw(c_,"manual",18,20,{w:800,size:5,align:"center",color:"#fff"});
        c_.fillStyle="rgba(255,255,255,0.5)";c_.fillRect(8,26,20,0.6);Tw(c_,"awards",18,33,{w:700,size:4,align:"center",color:"rgba(255,255,255,0.85)"});});
      os_tent(ctx,C,0.42,1.4,top_,c_=>{Tw(c_,"award",15,9,{w:800,size:5.4,align:"center",color:rgba(PAL.ink,1)});Tw(c_,"our term",15,16.4,{w:600,size:4.0,align:"center",color:rgba([96,104,128],1)});});}},
    extra:(C_,add)=>{const g=c.gov;os_tag(C_,bldP("registrar",-0.28,top+0.5,1.38),"the government's definition",{a:os_in01(t,g+0.2,0.5),size:30,dy:20});os_tag(C_,bldP("registrar",0.57,top+0.24,1.42),"ours",{a:os_in01(t,wAt(sc,"gov","ours"),0.4),size:30,dy:20});
      os_arc(C_,bldP("registrar",0.5,top+0.26,1.42),bldP("registrar",-0.12,top+0.42,1.38),os_in01(t,who,0.9),{lift:150,label:"?",la:os_in01(t,who+0.6,0.4),size:56,bg:[255,226,150],rim:[214,160,60],ink:[120,80,20]});}});};
  // three people, three answers, and nobody's is the mapping
  const ans=[wAt(sc,"answers","Mei"),wAt(sc,"answers","Jun"),wAt(sc,"answers","Planning")];
  const shotD=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kD,t),{t,office:{tbc:1},
    figs:[os_at("mei",t,{onDraw:(c_,B)=>os_figTag(B,["Mei","owns the meaning"],{a:os_in01(t,ans[0]-0.1,0.4),size:30})}),os_at("jun",t,{onDraw:(c_,B)=>os_figTag(B,["Jun","builds the model"],{a:os_in01(t,ans[1]-0.1,0.4),size:30})}),
      os_at("clara",t,{onDraw:(c_,B)=>os_figTag(B,["Planning","reports what it's given"],{a:os_in01(t,ans[2]-0.1,0.4),size:30})}),{id:"yusuf",x:4.4,z:4.5,pose:"listen",t,expr:"concerned"}]});
  // back in his office: the chart, the government submission's row, and its answer
  const shotE=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kE,t),{t,inside:"office",ts:[150,950,5],office:{tbc:1,raciHi:os_in01(t,P.e+0.5,0.6),stamp:os_in01(t,wAt(sc,"tbc","to be")-0.15,0.5)}});
  os_shots(ctx,S,t,[[0,shotA],[P.b1,shotB],[P.b2,shotS],[P.b3,shotB3],[P.cc,shotC],[P.d,shotD],[P.e,shotE]]);});

// ---- 5 · What governance is for: policy 12, open on the desk, and the market's answer ----
scene("for",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b=c.for-0.6,cc=c.like-0.6,d=c.mgmt-0.6;
    return{b,cc,d,kA:os_keys([os_rk("office",0,[1.2,1.82,1.6],[1.2,1.06,2.1],1450),os_rk("office",b+0.7,[1.2,1.74,1.68],[1.2,1.06,2.1],1450)]),
      kB:os_keys([[b,v3(0.4,2.6,-7.2),v3(0,1.4,0),1400],[b+4.2,v3(0,14,-11.5),v3(0,0,3.2),1300],[cc+0.7,v3(0.3,14.4,-11.8),v3(0,0,3.2),1300]]),
      kC:os_keys([[cc,os_shopP(0.2,2.6,-5.2),os_shopP(0,1.4,2.0),1400],[d+0.7,os_shopP(0.15,2.35,-4.2),os_shopP(-0.05,1.4,2.0),1400]]),
      kD:os_keys([[d,v3(0,13,-13),v3(0,0.5,2.5),1350],[sc.dur+1,v3(0.4,12.6,-12.4),v3(0,0.5,2.5),1350]])};});
  // the open binder: what policy 12 says, and the two things it leaves out
  const who=wAt(sc,"doesnt","who"),how=wAt(sc,"doesnt","how");
  const shotA=(ctx,S,t)=>{const g1=os_in01(t,who-0.1,0.5),g2=os_in01(t,how-0.1,0.5);drawCampus(ctx,S,os_cam(P.kA,t),{t,inside:"office",office:{bare:1,tbc:1},ts:[90,990,4],hooks:{officeDesk:(ctx,C_,top)=>{
    os_binderOpen(ctx,C_,1.2,2.1,top,{pw:0.3,pd:0.4,col:PAL.navy,left:c_=>{Tw(c_,"Policy 12",14.5,7,{w:800,size:3.6,align:"center",color:rgba(PAL.navy,1)});c_.fillStyle=rgba(PAL.navy,0.5);c_.fillRect(5,9.6,19,0.3);
        ["Business terms","are defined","consistently","across the","organisation."].forEach((s,i)=>Tw(c_,s,14.5,15.5+i*4.4,{w:600,size:2.7,align:"center",color:rgba([60,70,100],1)}));},
      right:c_=>{const box=(y0,y1,u,lines)=>{if(u<=0)return;c_.save();c_.globalAlpha*=clamp(u*2,0,1);c_.strokeStyle=rgba(PAL.red,0.8);c_.lineWidth=0.35;c_.setLineDash([1.4,1]);rr(c_,1.8,y0,25.4,y1-y0,1.2);c_.stroke();c_.setLineDash([]);
          lines.forEach((s,i)=>Tw(c_,s,14.5,y0+5.2+i*4.2,{w:800,size:2.6,align:"center",color:rgba(PAL.red,1)}));c_.restore();};
        box(5,14,g1,["who decides?"]);box(18,30,g2,["how does it","reach the work?"]);}});}}});};
  // what governance is for: from the office, gold along every path to the work round the green
  const shotB=(ctx,S,t)=>{const dd=wAt(sc,"for","deciding"),mk=wAt(sc,"for","making");drawCampus(ctx,S,os_cam(P.kB,t),{t,office:{tbc:1},gold:clamp((t-mk+0.2)/3.2,0,1),
    figs:[os_at("jun",t),os_at("mei",t),os_at("sam",t),os_at("clara",t),{id:"yusuf",x:-0.5,z:-2.35,pose:"stand",t}],
    extra:(C_,add)=>{os_tag(C_,v3(0,4.7,0),"deciding who decides",{a:os_io(t,dd-0.1,P.cc+0.2,0.4),size:34});os_tag(C_,v3(0,3.2,9.9),"each decision reaches the work",{a:os_io(t,mk+0.6,P.cc+0.2,0.4),size:34});}});};
  // the 1880s shop again: a rule, a copy where the work happens, someone who checks
  const rule=wAt(sc,"like","a rule"),copy=wAt(sc,"like","a copy"),chk=wAt(sc,"like","someone");
  const shotC=(ctx,S,t)=>{const C=os_cam(P.kC,t),out=P.d+0.3;
    os_market(ctx,S,C,{t,era:1880,shop:{tilt:0,brass:true,crown:1,act:os_io(t,rule-0.1,out,0.4),caseGlow:os_io(t,copy-0.1,out,0.4),strike:0},
      figs:[{id:"inspector",at:"shop",x:0.75,z:1.4,t,flip:true,pose:"hold",carry:heldWeight,onDraw:(c_,B)=>os_figTag(B,"someone who checks",{a:os_io(t,chk,out,0.4),size:30,dy:20})},{id:"grocer",at:"shop",x:-1.4,z:2.6,pose:"listen",t}],
      extra:(C_,add)=>{os_tag(C_,os_shopP(-2.55,2.0,0.36),"a rule",{a:os_io(t,rule,out,0.4),size:30});os_tag(C_,os_shopP(1.75,1.42,1.05),["a copy where","the work happens"],{a:os_io(t,copy,out,0.4),size:30,dx:40,dy:40});},
      after:c_=>os_marker(c_,t,[[0,"England · 1880s"]],os_io(t,P.cc+0.3,out,0.5))});};
  // governance and management: the office that sets the rules and checks, the offices that do the work
  const gv=wAt(sc,"mgmt","Governance"),mg=wAt(sc,"mgmt","Management");
  const shotD=(ctx,S,t)=>{const a=os_in01(t,mg-0.2,0.6);drawCampus(ctx,S,os_cam(P.kD,t),{t,office:{tbc:1},gold:1,glowFront:{platform:a,registrar:a,data:a,planning:a,office:os_in01(t,gv-0.2,0.6)},
    figs:[os_at("jun",t),os_at("mei",t),os_at("sam",t),os_at("clara",t),{id:"yusuf",x:-0.5,z:-2.35,pose:"stand",t}],
    extra:(C_,add)=>{os_tag(C_,v3(0,4.7,0),["governance","sets the rules, checks they're kept"],{a:os_in01(t,gv-0.1,0.4),size:32});os_tag(C_,bldP("platform",0,3.9,1.9),["management","does the work"],{a:os_in01(t,mg-0.1,0.4),size:32});}});};
  os_shots(ctx,S,t,[[0,shotA],[P.b,shotB],[P.cc,shotC],[P.d,shotD]]);});

// ---- 6 · Governance at the centre: DAMA's wheel, drawn on the green ----
scene("wheel",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const d=c.takes-0.3;
    return{d,k:os_keys([[0,v3(0.4,12.6,-12.4),v3(0,0.5,2.5),1350],[c.wheel,v3(0,19,-6.5),v3(0,0,-1.0),905],[d,v3(0.12,18.8,-6.35),v3(0,0,-1.0),905],[sc.dur+0.8,v3(0.6,2.9,-8.2),v3(0,1.25,0),1400]])};});
  const C=os_cam(P.k,t),w0=wAt(sc,"wheel","eleven"),gv=wAt(sc,"wheel","governance"),mt=wAt(sc,"wheel","where"),oth=c.others,dc=wAt(sc,"others","Dee"),iso8=wAt(sc,"others","eight thousand"),iso38=wAt(sc,"others","thirty"),out=c.takes;
  // each area's board dims while the others are named, except the one a standard covers
  const lab=k=>{const dim=os_io(t,oth+0.2,out,0.5)*(k===9?1-os_in01(t,iso8-0.3,0.4):1);return(1-0.62*dim)*(1-os_in01(t,out+0.6,0.6));};
  drawCampus(ctx,S,C,{t,office:{tbc:1},gold:os_in01(t,mt-0.2,2.4)*(1-os_in01(t,out+0.6,0.8)),glowFront:{office:os_io(t,gv-0.2,out+0.6,0.5)},
    figs:[os_at("jun",t),os_at("mei",t),os_at("sam",t),os_at("clara",t)],
    posts:(C_,add)=>{for(let k=0;k<10;k++){const p=os_postP(k,0.8);add(p,ctx=>os_signpost(ctx,C_,k,os_in01(t,w0+k*0.24,0.6),lab(k)));}},
    extra:(C_,add)=>{const fade=1-os_in01(t,out+0.6,0.6);
      os_tag(C_,v3(0,4.9,0),"data governance",{a:os_in01(t,gv-0.1,0.5)*fade*(1-0.62*os_io(t,oth+0.2,iso38-0.3,0.5)),size:34,bg:[255,226,150],rim:[214,160,60],ink:[74,52,20]});
      os_ring(C_,9.92,os_in01(t,dc-0.2,1.4)*(1-os_in01(t,out+0.3,0.5)));
      os_tag(C_,os_postP(9,1.7),"ISO 8000 · data quality",{a:os_io(t,iso8-0.1,out+0.4,0.4),size:30,dx:-330,dy:20,bg:[230,244,236],rim:[96,160,120]});
      os_tag(C_,v3(0,4.9,0),"ISO/IEC 38505 · governing data",{a:os_io(t,iso38-0.1,out+0.4,0.4),size:30,dy:-84,bg:[230,244,236],rim:[96,160,120]});},
    after:c_=>{os_board(c_,W/2,150,["DAMA-DMBOK","the Data Management Body of Knowledge"],{size:30,a:os_io(t,wAt(sc,"body","body")-0.2,w0-0.2,0.5)});
      os_board(c_,1660,150,["DCAM","the same ground"],{size:32,a:os_io(t,dc-0.1,out+0.4,0.4),bg:[230,244,236],rim:[96,160,120]});}});});

// ---- 7 · Listen first: no thirty-fifth policy; one question, asked in every office ----
scene("listen",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const a2=wAt(sc,"ask","He asks")-0.3,b=c.jun-0.6,m=c.mei-0.6,s=c.sam-0.6,p=c.plan-0.6,f=c.binder-0.6,g=c.tools-0.6;
    const room=(id,t0,t1,e,g_,f_)=>os_keys([os_rk(id,t0,e,g_,f_||1200),os_rk(id,t1+0.7,[e[0]+0.05,e[1]-0.05,e[2]+0.35],g_,f_||1200)]);
    return{a2,b,m,s,p,f,g,kA:os_keys([os_rk("office",0,[1.16,1.78,1.62],[1.16,1.06,2.12],1450),os_rk("office",a2+0.7,[1.1,1.9,1.45],[1.12,1.06,2.12],1450)]),
      kA2:os_keys([[a2,v3(0.6,2.3,-7.8),v3(0.1,1.3,-1.6),1400],[b+0.7,v3(0.4,2.2,-7.2),v3(0.1,1.3,-1.6),1400]]),
      kB:room("data",b,m,[0.6,1.95,-2.7],[0.7,1.35,2.2]),kC:room("registrar",m,s,[-0.25,1.9,-2.8],[-0.25,1.4,2.2]),kD:room("platform",s,p,[-0.3,1.95,-2.8],[-0.4,1.5,2.4]),
      kE:room("planning",p,f,[0.1,1.9,-2.8],[0,1.4,2.2]),kF:room("office",f,g,[1.0,1.95,-0.7],[-1.45,1.55,2.2],1250),kG:os_keys([os_rk("data",g,[0.3,2.0,-2.6],[0.4,1.3,2.2],1150),os_rk("data",sc.dur+1,[0.35,1.95,-2.1],[0.4,1.3,2.2],1150)])};});
  // a person's answer, in a bubble from their head
  const ans=(lines,t0,t1,o)=>(c_,B)=>os_say(B,lines,Object.assign({size:32,a:os_io(t,t0,t1,0.4)},o||{}));
  const note={pose:"write",carry:heldNotebook,t};
  // the thirty-fifth policy: a blank page he turns over instead of writing
  const flip=wAt(sc,"ask","doesn't")+0.3;
  const shotA=(ctx,S,t)=>{const th=Math.PI*easeCam(clamp((t-flip)/1.1,0,1));drawCampus(ctx,S,os_cam(P.kA,t),{t,inside:"office",office:{bare:1,tbc:1},ts:[90,990,4],hooks:{officeDesk:(ctx,C_,top)=>{
    os_pen(ctx,C_,1.38,1.98,top);os_pageFlip(ctx,C_,1.0,1.9,1.32,2.32,top,th,c_=>{Tw(c_,"Policy 35",16,6.5,{w:800,size:3.4,align:"center",color:rgba(PAL.navy,1)});c_.fillStyle=rgba(PAL.navy,0.45);c_.fillRect(6,9,20,0.3);});}}});};
  // he goes out with a notebook and one question
  const q=wAt(sc,"ask","what slows");
  const shotA2=(ctx,S,t)=>{const w=along([[0.9,-0.9],[0.5,-2.0],[0.2,-3.0]],t,P.a2+0.2,1.0);drawCampus(ctx,S,os_cam(P.kA2,t),{t,office:{tbc:1},
    figs:[{id:"yusuf",x:w.x,z:w.z,y:os_floor(w.z),hop:w.hop,pose:"hold",carry:heldNotebook,t,onDraw:ans(["What slows you down?"],q-0.1,P.b+0.4,{size:34})}]});};
  const visit=(K,id,who,lines,t0,t1,o,yo,extra)=>(ctx,S,t)=>drawCampus(ctx,S,os_cam(K,t),{t,inside:id,ts:[100,990,4],
    figs:[os_at(who,t,Object.assign({onDraw:ans(lines,t0,t1,o.say)},o.fig)),Object.assign({id:"yusuf",at:id},note,yo)],extra});
  const shotB=visit(P.kB,"data","jun",["The rules arrive","after I've built it."],c.jun+0.2,P.m+0.5,{fig:{x:2.25,z:1.5,pose:"explain",flip:true},say:{left:true}},{x:-1.0,z:1.0});
  const shotC=visit(P.kC,"registrar","mei",["I never see where","my words are used."],c.mei+0.2,P.s+0.5,{fig:{pose:"explain"}},{x:-1.2,z:0.9});
  const shotD=visit(P.kD,"platform","sam",["No one says which","columns are personal."],c.sam+0.2,P.p+0.5,{fig:{x:0.75,z:2.55,pose:"point"},say:{left:true}},{x:-1.45,z:1.0});
  const shotE=visit(P.kE,"planning","clara",["Which number","do I trust?"],c.plan+0.1,P.f+0.5,{fig:{pose:"shrug",expr:"concerned"}},{x:1.2,z:1.0,flip:true});
  // back at the office: the four answers pinned up, beside the shelf the binder came from
  const shotF=(ctx,S,t)=>{const lit=os_io(t,wAt(sc,"binder","weren't")-0.3,P.g+0.6,0.6);drawCampus(ctx,S,os_cam(P.kF,t),{t,inside:"office",ts:[110,980,5],office:{tbc:1,cards:clamp((t-P.f-0.4)/1.8*4,0,4)},
    figs:[{id:"yusuf",x:-2.0,z:0.1,y:0.3,pose:t<P.f+2.4?"reach":"stand",carry:t<P.f+2.4?heldPins:null,flip:true,t}],
    over:(ctx,C_)=>{if(lit>0)glowQuad(ctx,C_,[bldP("office",-2.34,0.3,3.36),bldP("office",-0.49,0.3,3.36),bldP("office",-0.49,2.52,3.36),bldP("office",-2.34,2.52,3.36)],lit);}});};
  // people agree; then a tool carries it out
  const run=wAt(sc,"tools","Tools");
  const shotG=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kG,t),{t,inside:"data",ts:[100,990,4],hooks:{dataScreen:c_=>os_testScreen(c_,os_in01(t,run,0.6))},
    figs:[os_at("jun",t,{x:2.25,z:1.5,pose:"listen",nod:0.06*Math.sin(t*3.1)*os_io(t,P.g+0.4,run,0.4)}),{id:"mei",at:"data",x:-0.9,z:1.6,pose:"explain",t},{id:"yusuf",at:"data",x:-1.75,z:0.9,pose:"listen",t,nod:0.05*Math.sin(t*2.7+1)*os_io(t,P.g+0.4,run,0.4)}]});
  os_shots(ctx,S,t,[[0,shotA],[P.a2,shotA2],[P.b,shotB],[P.m,shotC],[P.s,shotD],[P.p,shotE],[P.f,shotF],[P.g,shotG]]);});

// ---- 8 · Where does it run? Every line of the binder, sorted into three trays ----
// the binder's lines, in the order they're sorted: which tray each goes to, and the word it goes on
const OS_SORT=[[0,"runs","required"],[0,"runs","a check"],[0,"runs","a tag"],[0,"runs","a test"],[1,"owned","decisions"],[1,"owned","writes"],[2,"go","go"]];
scene("runs",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b=c.runs-0.6;
    return{b,when:OS_SORT.map(([k,id,w])=>wAt(sc,id,w)-0.5),kA:os_keys([os_rk("office",0,[0.75,2.15,-1.4],[1.05,1.3,2.3],1350),os_rk("office",b+0.7,[0.85,2.05,-0.9],[1.05,1.25,2.3],1350)]),
      kB:os_keys([os_rk("office",b,[1.32,1.98,1.02],[1.32,1.06,2.2],1300),os_rk("office",sc.dur+1,[1.32,1.92,1.2],[1.32,1.06,2.2],1300)])};});
  const y0=1.06,where=wAt(sc,"takes","where");
  // the desk: the open binder, its lines marked as they're sorted, the three trays and the pages flying into them
  const desk=(ctx,C_,top,t)=>{const fly=P.when.map(w=>clamp((t-w)/0.8,0,1)),n=[0,0,0];OS_SORT.forEach(([k],i)=>{if(fly[i]>=1)n[k]++;});
    OS_TRAYS.forEach((tr,k)=>os_tray(ctx,C_,tr.x,2.36,top,tr.col,n[k]));
    os_binderOpen(ctx,C_,1.32,1.97,top,{pw:0.24,pd:0.36,col:PAL.navy,left:c_=>{Tw(c_,"Policy 12",12,6,{w:800,size:3,align:"center",color:rgba(PAL.navy,1)});for(let i=0;i<6;i++){c_.fillStyle="rgba(150,150,170,0.6)";c_.fillRect(3,11+i*3.6,18-(i%3===2?6:0),0.6);}},
      right:c_=>OS_SORT.forEach(([k],i)=>{const y=5+i*4.4,u=clamp((t-P.when[i]+0.2)/0.4,0,1);c_.fillStyle="rgba(150,150,170,0.6)";c_.fillRect(5,y,15-(i%2?4:0),0.7);
        if(u>0){c_.fillStyle=rgba(OS_TRAYS[k].col,u);c_.beginPath();c_.arc(2.6,y+0.35,1.1*(0.6+0.4*spring(u)),0,TAU);c_.fill();}})});
    OS_SORT.forEach(([k],i)=>os_flyPage(ctx,C_,bldP("office",1.44,top+0.02,1.97),bldP("office",OS_TRAYS[k].x,top+0.03,2.36),fly[i],0.3));};
  const shotA=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kA,t),{t,inside:"office",office:{bare:1,tbc:1,cards:4},ts:[110,980,5],
    hooks:{officeDesk:(ctx,C_,top)=>desk(ctx,C_,top,t)},figs:[{id:"yusuf",x:-0.12,z:0.1,y:0.3,pose:"listen",t}],
    after:c_=>os_board(c_,1190,190,"Where does it run?",{size:44,a:os_io(t,where-0.1,P.b+0.9,0.5),bg:[255,236,200],rim:[214,150,80]})});
  // over each tray, its name when the voice says it, and above that what goes in it, a line at a time
  const T8=os_once(sc,"T",()=>[{name:wAt(sc,"runs","run")-0.1,items:[["a required field",wAt(sc,"runs","required")],["a check",wAt(sc,"runs","a check")],["a tag",wAt(sc,"runs","a tag")],["a test",wAt(sc,"runs","a test")]]},
    {name:wAt(sc,"owned","decisions")-0.1,items:[["award mapping",wAt(sc,"owned","owns")],["owner: Mei · 14 Oct",wAt(sc,"owned","writes")]]},{name:wAt(sc,"go","go")-0.2,items:[]}]);
  const shotB=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB,t),{t,inside:"office",office:{bare:1,tbc:1,cards:4},ts:[90,990,4],hooks:{officeDesk:(ctx,C_,top)=>desk(ctx,C_,top,t)},
    extra:(C_,add)=>OS_TRAYS.forEach((tr,k)=>{const q=T8[k],a=os_in01(t,q.name,0.4);if(a<=0)return;const p=bldP("office",tr.x,y0+0.08,2.44),bg=mix(tr.col,[255,255,255],0.84);
      os_tag(C_,p,tr.name,{a,size:30,bg,rim:tr.col,dy:24});const it=q.items.filter(([,w])=>t>=w).map(([s_])=>s_);if(it.length)os_tag(C_,p,it,{size:28,pop:false,bg:[255,252,244],rim:tr.col,dy:24+64});})});
  os_shots(ctx,S,t,[[0,shotA],[P.b,shotB]]);});

// ---- 9 · Where decisions enter: the data team's loop, and a pin at the right steps ----
scene("enter",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b=c.pin-0.6;
    return{b,pins:OS_PINS.map(([i,lab])=>wAt(sc,"pins",lab[0])-0.15),kA:os_keys([[0,bldP("data",-0.2,3.4,-7.6),bldP("data",-0.5,1.2,2.5),1300],[b+0.7,bldP("data",-0.5,2.1,-1.9),bldP("data",-0.8,1.7,3.8),1300]]),
      kB:os_keys([[b,bldP("data",-1.32,1.86,0.45),bldP("data",-1.32,1.86,3.8),1250],[sc.dur+1,bldP("data",-1.32,1.86,0.85),bldP("data",-1.32,1.86,3.8),1250]])};});
  const X0=-2.45,Y0=0.98,X1=-0.2,Y1=2.72,Z=4-0.2-0.03;
  // Yusuf brings a box of pins to the data team; Jun's at his desk, the poster of their loop on the wall
  const shotA=(ctx,S,t)=>{const w=along([[-1.0,-3.6],[-1.7,-1.2],[-2.0,1.0]],t,0.6,1.0),lp=wAt(sc,"loop","loop");
    drawCampus(ctx,S,os_cam(P.kA,t),{t,inside:t>P.b-1.5?"data":null,data:{loopHi:os_io(t,lp-0.2,P.b+0.6,0.5)},
      figs:[Object.assign({id:"yusuf",at:"data",x:w.x,z:w.z,hop:w.hop,pose:"hold",carry:heldPins,t},w.z<0?{at:null,x:bldP("data",w.x,0,w.z).x,z:bldP("data",w.x,0,w.z).z}:{}),os_at("jun",t,{x:0.5,z:0.95,pose:"listen"})],
      extra:(C_,add)=>os_tag(C_,bldP("data",-1.32,2.8,3.75),"a loop of ten steps",{a:os_io(t,lp,P.b+0.4,0.4),size:32})});};
  // the poster, close: a pin at each step where a decision enters, with what's pinned there
  const shotB=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB,t),{t,inside:"data",ts:[80,1000,3],
    extra:(C_,add)=>OS_PINS.forEach(([i,lab],k)=>{const u=os_in01(t,P.pins[k],0.5);if(u<=0)return;const an=-Math.PI/2+i/10*TAU,q=loopPos(i,X0,Y0,X1,Y1,Z-0.01),p=bldP("data",q.x,q.y,q.z),rim=bldP("data",q.x+Math.cos(an)*0.155,q.y-Math.sin(an)*0.155,q.z);
      os_stepRing(C_,p,0.195,u);os_pinQ(C_,rim,u);os_tag(C_,p,lab,{a:u,size:30,dx:Math.cos(an)*190,dy:-Math.sin(an)*96+18,bg:[255,236,190],rim:[214,160,60]});})});
  os_shots(ctx,S,t,[[0,shotA],[P.b,shotB]]);});

// ---- 10 · The series: the binders still on the shelf, the films on the tools, and the policy taken to the work ----
scene("series",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b=c.tools-0.6,w=c.wish-0.6,n0=wAt(sc,"next","nine")-0.1,tk=wAt(sc,"next","takes")-0.2;
    return{b,w,tk,slide:OS_SHELF9.map((_,k)=>n0+k*0.24),cards:OS_TOOLS.map((_,k)=>wAt(sc,"tools","six")-0.1+k*0.3),
      kA:os_keys([os_rk("office",0,[-0.55,1.6,0.0],[-1.95,1.4,3.2],1050),os_rk("office",b+0.7,[-0.6,1.6,0.45],[-1.95,1.4,3.2],1050)]),
      kB:os_keys([os_rk("data",b,[1.25,2.4,0.35],[1.25,1.95,3.77],2050),os_rk("data",w+0.7,[1.25,2.38,0.6],[1.25,1.95,3.77],2050)]),
      kC:os_keys([[w,v3(-3.2,4.6,-10.5),v3(1.6,0.8,-1.4),1050],[sc.dur+1,v3(-2.4,10.5,-14.5),v3(4.2,0.4,1.6),1000]])};});
  // the shelf: nine binders come forward, one for each film on a kind of policy; Yusuf takes the first
  const shotA=(ctx,S,t)=>{const u=P.slide.map(t0=>os_in01(t,t0,0.45)),took=t>P.tk+0.9,hi=os_in01(t,P.tk+0.9,0.4);
    drawCampus(ctx,S,os_cam(P.kA,t),{t,inside:"office",ts:[110,980,5],office:{tbc:1,shelfSkip:(r,j)=>(r===2&&j===4)||(took&&r===2&&j===9),
        shelfOut:(r,j)=>{const k=OS_SHELF9.findIndex(([a,b_])=>a===r&&b_===j);return k<0?0:0.09*easeCam(u[k])+(k===0?0.1*os_in01(t,P.tk+0.3,0.6):0);}},
      figs:[{id:"yusuf",at:"office",x:-0.45,z:2.7,pose:t>P.tk&&!took?"reach":took?"hold":"stand",flip:true,carry:took?os_heldTitled(["Who","decides"],PAL.gold):null,t}],
      over:(ctx,C_)=>{const M_=MX;mxSet(BLDI.office.x,BLDI.office.z,BLDI.office.ang);OS_SHELF9.forEach(([r,j],k)=>{if(u[k]<=0||(k===0&&t>P.tk-0.1))return;os_binderTag(ctx,C_,r,j,0.09*easeCam(u[k]),k+2,u[k]);});MX=M_;},
      after:c_=>os_needsList(c_,74,96,u,hi,os_in01(t,P.slide[0]-0.3,0.5))});};
  // the data team's board: six cards, one for each film on the tools
  const shotB=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB,t),{t,inside:"data",ts:[80,1000,3],hooks:{dataBoard:(ctx,C_,z)=>OS_TOOLS.forEach((_,k)=>{const u=os_in01(t,P.cards[k],0.45);if(u<=0)return;
      const col=k%3,row=(k/3)|0,x0=0.13+col*0.785,y1=2.6-row*0.66,lift=(1-spring(u))*0.05;surfDraw(ctx,C_,v3(x0,y1+lift,z-0.004),v3(1,0,0),v3(0,1,0),c_=>os_toolCard(c_,k,u));
      const p=pj(C_,v3(x0+0.35,y1-0.03+lift,z-0.008));if(p.z>NEAR){ctx.fillStyle=rgba([200,70,60],1);ctx.beginPath();ctx.arc(p.x,p.y,Math.max(3,0.016*p.s),0,TAU);ctx.fill();}})},
    after:c_=>os_board(c_,W/2,128,"With the tools",{size:34,a:os_in01(t,P.cards[0]-0.2,0.5),bg:[236,244,255],rim:[90,130,200],ink:[40,60,110]})});
  // the policy leaves the shelf: Yusuf takes it out across the green, to where the work is done
  const shotC=(ctx,S,t)=>{const wk=along([[0.5,-2.35],[2.4,-2.6],[3.9,0.0],[6.4,2.1]],t,P.w+0.2,1.05);
    drawCampus(ctx,S,os_cam(P.kC,t),{t,office:{tbc:1},figs:[{id:"yusuf",x:wk.x,z:wk.z,y:os_floor(wk.z),hop:wk.hop,pose:"hold",carry:os_heldTitled(["Who","decides"],PAL.gold),t}],
      after:c_=>os_card(c_,os_in01(t,c.breath-0.2,0.8),["Off the shelf",110],"A policy that doesn't run anywhere is a wish.","Film 1 of 16 · data governance")});};
  os_shots(ctx,S,t,[[0,shotA],[P.b,shotB],[P.w,shotC]]);});

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

/* ===== The data governance series: the video's finishing pass =====
   Loaded after the engine. Only the rendered video uses it (tools/render.py calls renderAt); the site's player draws live.
   Motion blur: each video frame is the average of MB moments across a third of a frame (a 126-degree shutter), so movement reads as
   filmed. No glow (it washes out the town's pastels) and no film grain (noise doesn't compress). Stills (tools/stills.py) don't show it. */
if(window.__RENDER__){(function(){const MB=6,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
