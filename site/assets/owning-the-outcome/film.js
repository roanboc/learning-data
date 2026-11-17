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

// Owning the outcome, film 1 of Ownership and performance, the last series of Leading data people. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years and dates in words). The few longer stops are in breath.js.
const NARR={
"trees":{"name":"Trees still standing","lead":3.0,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"Kenya, in the 1970s.","say":"Kenya, in the nineteen seventies."},
 {"id":"women","gap":0.8,"text":"In the hills of the central highlands, rural women tell Wangari Maathai, a biologist, what's going wrong."},
 {"id":"streams","gap":0.8,"text":"Their streams are drying up. Their food is less sure. Each year, they walk further for firewood."},
 {"id":"cleared","gap":0.8,"text":"The forests had been cleared, for farms, for tea and coffee to sell, and for plantations of timber."},
 {"id":"sense","gap":0.8,"text":"Each choice made sense to the people who made it."},
 {"id":"soil","gap":0.8,"text":"But without trees, the soil washed off the hills, and the springs ran dry."},
 {"id":"harm","gap":0.8,"text":"The women fetched the water, gathered the firewood and grew the food. So the harm fell first on them, and on their children."},
 {"id":"change","gap":0.8,"text":"Someone had to bring the trees back, and it would be the women."},
 {"id":"start","gap":0.8,"text":"In 1977, Maathai started the Green Belt Movement, with the National Council of Women of Kenya.","say":"In nineteen seventy-seven, Maathai started the Green Belt Movement, with the National Council of Women of Kenya."},
 {"id":"nursery","gap":0.8,"text":"Groups of women grew seedlings in their own nurseries, from the seeds of local trees, and planted them out."},
 {"id":"paid","gap":0.8,"text":"They were paid a small sum for each tree still alive months later, not for each seedling put in the ground."},
 {"id":"answer","gap":0.8,"text":"So they answered for living trees, not for the planting."},
 {"id":"fifty","gap":0.8,"text":"Since then, more than fifty million trees have been planted in Kenya."},
 {"id":"give","gap":0.8,"text":"They give fuel, food and shelter, and thousands of women earned an income from them."},
 {"id":"nobel","gap":0.8,"text":"In 2004, Wangari Maathai became the first African woman to win the Nobel Peace Prize.","say":"In two thousand and four, Wangari Maathai became the first African woman to win the Nobel Peace Prize."},
 {"id":"data","gap":0.8,"text":"Data work has its seedlings too: a job that ran, a report that was sent."},
 {"id":"own","gap":0.8,"text":"Owning the outcome means answering for what they're for."}
]},
"owns":{"name":"What she owns","lead":1.0,"tail":1.0,"vo":[
 {"id":"owner","gap":0.8,"text":"At the university, a year from now, Ivy Reyes becomes the owner of her first data product, on Thursday 1 July.","say":"At the university, a year from now, Ivy Reyes becomes the owner of her first data product, on Thursday the first of July."},
 {"id":"what","gap":0.8,"text":"Teaching space use: for every teaching room and every hour, what was booked, and how many people came. Counts, never people."},
 {"id":"mesh","gap":0.8,"text":"Zhamak Dehghani's data mesh calls her the data product owner: she answers for what the product does for its readers."},
 {"id":"film","gap":0.8,"text":"A product with an owner shows how a product gets one. This film is about the owning."},
 {"id":"promise","gap":0.8,"text":"Its promise: refreshed every Monday by seven, with the week before."},
 {"id":"readers","gap":0.8,"text":"Ivy knows its readers by name: Graham Ellis at Facilities, and Mei Tanaka at the registrar's office, with their teams."},
 {"id":"for","gap":0.8,"text":"And she knows what it's for: next year's timetable will move about one peak class in six, and release rooms nobody uses."},
 {"id":"which","gap":0.8,"text":"Which ones, they'll choose from her counts."},
 {"id":"truly","gap":0.8,"text":"So what Ivy owns isn't Monday's job. It's that the timetable change is judged on true counts."},
 {"id":"many","gap":0.8,"text":"Many people do part of the work. Facilities keeps the sensors, Sam the platform, and Jun reviews her changes."},
 {"id":"one","gap":0.8,"text":"One person answers for the outcome. In a RACI chart, that's the A, for accountable, and there's only one.","say":"One person answers for the outcome. In a Ray-see chart, that's the A, for accountable, and there's only one."},
 {"id":"helena","gap":0.8,"text":"Helena gives her the authority to match."},
 {"id":"can","gap":0.8,"text":"Ivy can hold a refresh, change the model with a review, and tell the readers, without asking first."}
]},
"monday":{"name":"A Monday that looked fine","lead":1.0,"tail":1.0,"vo":[
 {"id":"ran","gap":0.8,"text":"On Monday 23 August, the refresh runs at seven, as promised. Every check passes.","say":"On Monday the twenty-third of August, the refresh runs at seven, as promised. Every check passes."},
 {"id":"seedling","gap":0.8,"text":"At the Green Belt, a seedling in the ground earned nothing until it lived."},
 {"id":"reads","gap":0.8,"text":"So Ivy reads the numbers, not only the tick."},
 {"id":"drop","gap":0.8,"text":"In forty rooms, the counts have dropped to about a quarter."},
 {"id":"release","gap":0.8,"text":"If nobody noticed, the timetable team would release rooms that classes really use."},
 {"id":"wait","gap":0.8,"text":"Ivy doesn't wait to be sure, or to be asked."},
 {"id":"tell","gap":0.8,"text":"She walks over and tells Graham and Mei herself: forty rooms look wrong. Don't use them yet. The right counts come tomorrow."},
 {"id":"first","gap":0.8,"text":"Saying it first, before the fix, is part of owning it."}
]},
"fix":{"name":"Fix it, or raise it","lead":1.0,"tail":1.0,"vo":[
 {"id":"sam","gap":0.8,"text":"With Sam, she finds the cause."},
 {"id":"four","gap":0.8,"text":"Facilities had upgraded the sensors: they now send four counts an hour, and her model kept only the first."},
 {"id":"fix","gap":0.8,"text":"That part is hers to fix. Jun reviews her change, and by Tuesday morning the readers have the right counts."},
 {"id":"mine","gap":0.8,"text":"Some of it isn't hers to fix. The sensors are Facilities'."},
 {"id":"raise","gap":0.8,"text":"So she raises it with Graham. From now on, Facilities tells the data team before a sensor changes."},
 {"id":"check","gap":0.8,"text":"And she adds a check of her own: a drop like this one now holds the refresh, before anyone reads it."}
]},
"blame":{"name":"Nobody to blame","lead":1.0,"tail":1.0,"vo":[
 {"id":"nobody","gap":0.8,"text":"Nobody here did anything wrong."},
 {"id":"each","gap":0.8,"text":"Facilities made the sensors better. Sam's platform loaded every count. The step was right for the data it was built for."},
 {"id":"fit","gap":0.8,"text":"Each was right about what they saw. What failed was the way the parts fit together."},
 {"id":"dekker","gap":0.8,"text":"Sidney Dekker calls it a just culture: when something goes wrong, ask what happened and what must change, not who to blame."},
 {"id":"helena","gap":0.8,"text":"Helena's first question isn't who. It's what happened, and what Ivy needs."},
 {"id":"safe","gap":0.8,"text":"That's why Ivy could say it first: where nobody is blamed, saying it early is safe."},
 {"id":"account","gap":0.8,"text":"Being accountable means giving an account: what happened, and how the next time goes better."}
]},
"close":{"name":"On Monday","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"The women of the Green Belt answered for trees still standing months later, not for the planting."},
 {"id":"ivy","gap":0.8,"text":"Ivy answers for true counts, not for a job that ran. In June 2029, the timetable change will be judged on them.","say":"Ivy answers for true counts, not for a job that ran. In June twenty twenty-nine, the timetable change will be judged on them."},
 {"id":"know","gap":0.8,"text":"On Monday, know who uses your work, and for which decision."},
 {"id":"watch","gap":0.8,"text":"Watch what it's for, not only whether it ran."},
 {"id":"say","gap":0.8,"text":"When something's wrong, say so first, even before the fix."},
 {"id":"mend","gap":0.8,"text":"Fix what's yours, raise what isn't, and mend how the parts fit together, never blaming a person."},
 {"id":"next","gap":0.8,"text":"Measure the work, not the people, the next film, asks how a team can tell its work is getting better."},
 {"id":"take","gap":0.8,"text":"Own what it's for, not only what you did."}
]}
};

const VODUR={"trees/when": 1.936, "trees/women": 6.423, "trees/streams": 5.15, "trees/cleared": 5.743, "trees/sense": 2.246, "trees/soil": 4.246, "trees/harm": 6.768, "trees/change": 3.023, "trees/start": 6.874, "trees/nursery": 6.01, "trees/paid": 5.883, "trees/answer": 2.917, "trees/fifty": 3.737, "trees/give": 4.755, "trees/nobel": 6.313, "trees/data": 4.521, "trees/own": 2.83, "owns/owner": 7.999, "owns/what": 7.312, "owns/mesh": 7.12, "owns/film": 4.713, "owns/promise": 3.903, "owns/readers": 7.564, "owns/for": 7.511, "owns/which": 1.943, "owns/truly": 6.122, "owns/many": 6.908, "owns/one": 6.514, "owns/helena": 2.237, "owns/can": 5.931, "monday/ran": 5.819, "monday/seedling": 3.775, "monday/reads": 2.63, "monday/drop": 2.943, "monday/release": 4.879, "monday/wait": 2.392, "monday/tell": 7.328, "monday/first": 2.766, "fix/sam": 1.66, "fix/four": 6.401, "fix/fix": 6.393, "fix/mine": 3.397, "fix/raise": 6.181, "fix/check": 6.007, "blame/nobody": 1.667, "blame/each": 7.211, "blame/fit": 4.526, "blame/dekker": 7.159, "blame/helena": 4.436, "blame/safe": 4.826, "blame/account": 5.032, "close/back": 5.339, "close/ivy": 8.166, "close/know": 3.092, "close/watch": 2.407, "close/say": 3.194, "close/mend": 5.662, "close/next": 5.375, "close/take": 2.216};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: Ivy looks up from her screen, and the title card comes over the room; and Ivy, back at her desk, puts a hand to
   her seedling, and the end card comes with the last line. */
const BREATH={
"trees":{"hold":{"when":1.2,"streams":1.2,"cleared":0.8,"sense":1.0,"soil":1.0,"harm":1.2,"change":1.4,"start":1.0,"nursery":1.2,"paid":1.2,"answer":1.4,"fifty":1.0,"give":0.8,"nobel":1.4,"data":0.8},"breathe":5.4},
"owns":{"hold":{"owner":0.8,"what":1.2,"mesh":1.0,"film":1.0,"promise":1.0,"readers":1.0,"which":1.0,"truly":1.4,"many":0.8,"one":1.2,"helena":0.4}},
"monday":{"hold":{"ran":1.2,"seedling":1.2,"reads":1.0,"drop":1.4,"release":1.4,"wait":1.0,"tell":1.4}},
"fix":{"hold":{"sam":1.0,"four":1.4,"fix":1.4,"mine":1.0,"raise":1.4}},
"blame":{"hold":{"nobody":0.8,"each":1.2,"fit":1.4,"dekker":1.4,"helena":1.0,"safe":1.0}},
"close":{"hold":{"back":1.2,"ivy":1.4,"know":0.8,"watch":0.8,"say":0.8,"mend":1.0,"next":1.0},"breathe":5.0}
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

/* ===== The people kit: Leading data people's own look =====
   The films of Leading data people are about people, so they draw people first: whole, in a place where they act, meet or move,
   with faces that react and hands that rest on things, in flat colour with one even ink line (the author asked for "a more cartoon
   or soft style", easy to design people in and quick to draw, and chose the ink line among four looks, 17 November 2026). Everything is drawn with the plain canvas, in the
   1920 x 1080 frame: nothing is painted per pixel, blurred or filtered, so a frame takes about a fifth of what the module's first
   look took, and a place is painted once and kept as a picture (the agent films' kit, AG_PLACES).
   The kit's files, bundled in this order after The Inner Life of Data's engine and helpers (core.js, style2.js, ui3.js),
   A Sharper Sketch's scene() (sketch3.js) and the agent films' camera and shots (kit.js):
     core.js    the helpers, and the looks: how a shape, a line of detail and a shadow are painted
     people.js  the cast, the poses, the faces, the rig, and a person drawn whole; a walk, a turn, a reach
     things.js  what people sit at, hold and work with: chairs, tables, desks, screens, mugs, plants, a seedling, a tree
     words.js   words on the frame: a card, a tag, a name, something said, the kicker, the title and end cards
     places.js  the university's places, painted once: the team's room, Helena's corner, the campus, a teaching room
   Each file is closed in a function of its own, so the only name the kit adds to a film is PK; a film's own helpers go in its own
   source with a prefix of its own. Never change these files for one film.
   The look is one word: PK.use("line") (ink line, the default and the module's look), "tint" (soft line), "soft" (soft shapes) or
   "paper" (cut paper). Every film is staged once, for any of them. */
const PK=(()=>{
const TAU=Math.PI*2,rad=d=>d*Math.PI/180;
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const sine=t=>0.5-0.5*Math.cos(Math.PI*clamp(t,0,1));
const pin=(t,t0,d)=>sine((t-t0)/(d||0.5));                       // 0 before t0, 1 after t0 + d, eased
const pio=(t,t0,t1,d)=>pin(t,t0,d)*(1-pin(t,t1,d));              // in at t0, out at t1
const spring=(t,t0,d)=>{const x=(t-t0)/(d||0.6);if(x<=0)return 0;if(x>=1.6)return 1;return 1-Math.exp(-5.2*x)*Math.cos(7.5*x);};
const mix=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const dk=(c,k)=>mix(c,[38,26,30],k),lt=(c,k)=>mix(c,[255,250,240],k);
const css=(c,a)=>a==null||a>=0.999?"rgb("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+")":"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")";
function rnd(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
const hash=(a,b)=>{let h=(a*374761393+(b||0)*668265263)>>>0;h=((h^(h>>>13))*1274126177)>>>0;return((h^(h>>>16))>>>0)/4294967296;};
// deg is from straight down, positive the way the person faces
const polar=(p,deg,len)=>[p[0]+Math.sin(rad(deg))*len,p[1]+Math.cos(rad(deg))*len];

/* a smooth closed (or open) curve through points; a point's third value is how sharp a corner it is: 1 a corner, 0 or none a curve */
const area=pts=>{let a=0;for(let i=0;i<pts.length;i++){const q=pts[(i+1)%pts.length];a+=pts[i][0]*q[1]-q[0]*pts[i][1];}return a/2;};
const cw=pts=>area(pts)<0?pts.slice().reverse():pts;      // every closed shape runs the same way round, so shapes in one path join
function pg(ctx,pts){pts=cw(pts);ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();}
function spline(ctx,pts,closed,ten){const n=pts.length;if(n<2)return;closed=closed!==false;ten=ten==null?1:ten;if(closed)pts=cw(pts);
  const P=i=>pts[closed?(i%n+n)%n:clamp(i,0,n-1)];ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=0,m=closed?n:n-1;i<m;i++){const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2),t1=ten/6*(1-(p1[2]||0)),t2=ten/6*(1-(p2[2]||0));
    ctx.bezierCurveTo(p1[0]+(p2[0]-p0[0])*t1,p1[1]+(p2[1]-p0[1])*t1,p2[0]-(p3[0]-p1[0])*t2,p2[1]-(p3[1]-p1[1])*t2,p2[0],p2[1]);}
  if(closed)ctx.closePath();}
/* a tapering capsule from A (radius ra) to B (radius rb): a limb's segment */
function capsule(ctx,A,B,ra,rb){const g=Math.atan2(B[1]-A[1],B[0]-A[0]),h=Math.PI/2;
  ctx.moveTo(A[0]+Math.cos(g+h)*ra,A[1]+Math.sin(g+h)*ra);ctx.arc(A[0],A[1],ra,g+h,g+3*h);
  ctx.lineTo(B[0]+Math.cos(g-h)*rb,B[1]+Math.sin(g-h)*rb);ctx.arc(B[0],B[1],rb,g-h,g+h);ctx.closePath();}
function rrect(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
const ell=(ctx,x,y,rx,ry,r)=>{ctx.moveTo(x+rx*Math.cos(r||0),y+rx*Math.sin(r||0));ctx.ellipse(x,y,rx,ry,r||0,0,TAU);ctx.closePath();};

/* ---------------------------------------------------------------- the looks
   A look paints a shape (S.fill), a line of detail (S.line) and a flat shadow, and holds how a person is proportioned. A shape is
   a function that adds its outline to the path; the look decides what an outline is.
     line   ink line (the default): one even dark line round every form, flat colour
     tint   soft line: each form lined in a darker tone of its own colour, a soft shade on big forms, a blush
     soft   soft shapes: rounded flat shapes, no outlines, one soft shade, a blush
     paper  cut paper: every piece casts a small hard shadow on the piece below, its edges a little uneven */
const INK=[52,40,44];
const SKINS={
  tint:{id:"line",key:"tint",name:"Soft line",ink:[112,76,80],self:0.4,lw:1,shade:true,blush:0.3,
    prop:{head:184,neck:20,torso:300,thigh:218,shin:210,ankle:40,uarm:150,farm:138,hand:48,shW:94,hipW:43,arm:[58,50,40],leg:[84,66,49],tor:[230,188,208],foot:127},
    tone:c=>c},
  soft:{id:"soft",key:"soft",name:"Soft shapes",ink:[70,56,62],lw:0,shade:true,blush:0.34,
    prop:{head:190,neck:18,torso:300,thigh:212,shin:204,ankle:40,uarm:148,farm:136,hand:50,shW:96,hipW:44,arm:[60,52,42],leg:[88,70,52],tor:[236,196,214],foot:128},
    tone:c=>c},
  line:{id:"line",key:"line",name:"Ink line",ink:INK,lw:1,blush:0,
    prop:{head:172,neck:24,torso:304,thigh:226,shin:218,ankle:40,uarm:152,farm:140,hand:46,shW:92,hipW:42,arm:[54,46,36],leg:[80,62,46],tor:[222,180,200],foot:126},
    tone:c=>c},
  paper:{id:"paper",key:"paper",name:"Cut paper",ink:[84,64,60],lw:0,blush:0.62,
    prop:{head:204,neck:14,torso:292,thigh:204,shin:196,ankle:38,uarm:144,farm:130,hand:52,shW:98,hipW:46,arm:[64,56,46],leg:[92,76,58],tor:[244,208,226],foot:132},
    tone:c=>mix(c,[214,196,176],0.13)}
};
// a person's parts as shares of their height: head + neck + torso + thigh + shin + ankle is 1000
const norm=p=>{const t=p.head+p.neck+p.torso+p.thigh+p.shin+p.ankle,f=1000/t,o={};for(const j in p)o[j]=Array.isArray(p[j])?p[j].map(v=>v*f):p[j]*f;return o;};
for(const k in SKINS)SKINS[k].prop=norm(SKINS[k].prop);

/* S.begin(ctx, o): start drawing a thing. o.lw: the line's width here, o.sh: how far a piece's shadow falls (paper), in frame px;
   both follow the thing's size. o.far (0 to 1): how far off it is: its line fades towards its own colour. The paper shadow always
   falls down and to the right of the frame, however the thing is turned or mirrored. */
function skinBegin(S,ctx,o){o=o||{};S._lw=o.lw==null?3:o.lw;S._far=o.far||0;
  if(S.id==="paper"){const m=ctx.getTransform(),det=m.a*m.d-m.b*m.c,k=o.sh==null?4:o.sh,z=Math.sqrt(Math.abs(det))||1,sx=k*0.55*z,sy=k*z;
    S._sx=(m.d*sx-m.c*sy)/det;S._sy=(-m.b*sx+m.a*sy)/det;S._k=k;}}
/* S.fill(ctx, fn, col, o): a closed shape. o.line false: no outline; o.grad [x0, y0, x1, y1, k]: a soft shade towards (x1, y1);
   o.flat: no shadow (paper); o.w: the outline's width, as a share of the thing's line; o.ink: the outline's own colour */
function skinFill(S,ctx,fn,col,o){o=o||{};const c=css(col);ctx.beginPath();fn(ctx);
  if(S.id==="line"){if(o.line!==false&&S._lw>0){const ink=o.ink||(S.self?dk(col,S.self):S.ink);ctx.lineJoin="round";ctx.lineCap="round";ctx.lineWidth=2*S._lw*(o.w||1);ctx.strokeStyle=css(S._far?mix(ink,col,S._far):ink);ctx.stroke();}
    if(S.shade&&o.grad){const g=ctx.createLinearGradient(o.grad[0],o.grad[1],o.grad[2],o.grad[3]);g.addColorStop(0,c);g.addColorStop(1,css(dk(col,o.grad[4]==null?0.16:o.grad[4])));ctx.fillStyle=g;}else ctx.fillStyle=c;
    ctx.fill();return;}
  if(S.id==="paper"){if(!o.flat&&S._k>0){ctx.save();ctx.translate(S._sx,S._sy);ctx.beginPath();fn(ctx);ctx.fillStyle="rgba(58,36,30,"+(o.sa||0.3)+")";ctx.fill();ctx.restore();ctx.beginPath();fn(ctx);}
    ctx.fillStyle=c;ctx.fill();return;}
  if(o.grad){const g=ctx.createLinearGradient(o.grad[0],o.grad[1],o.grad[2],o.grad[3]);g.addColorStop(0,c);g.addColorStop(1,css(dk(col,o.grad[4]==null?0.16:o.grad[4])));ctx.fillStyle=g;}
  else ctx.fillStyle=c;
  ctx.fill();}
/* S.line(ctx, fn, col, w, o): a line of detail, drawn only by the looks named in o.on ("line" by default: detail is the line's job) */
function skinLine(S,ctx,fn,col,w,o){o=o||{};if((o.on||"line").indexOf(S.id)<0)return;ctx.beginPath();fn(ctx);ctx.lineCap="round";ctx.lineJoin="round";
  ctx.lineWidth=S.id==="line"?S._lw*(w||0.7):(w||1)*(o.px||2);ctx.strokeStyle=css(col||(S.id==="line"?(S._far?mix(S.ink,o.over||[200,190,170],S._far):S.ink):S.ink),o.a==null?1:o.a);ctx.stroke();}
/* paper: scissors don't follow a curve exactly: nudge each point a little, the same way every time */
function cut(pts,seed,k){let d=0;for(let i=0;i<pts.length;i++){const q=pts[(i+1)%pts.length];d+=Math.hypot(q[0]-pts[i][0],q[1]-pts[i][1]);}
  const j=Math.min(3.2,d/pts.length*0.035)*k;return pts.map((p,i)=>p[2]?p:[p[0]+(hash(seed,i*2)-0.5)*2*j,p[1]+(hash(seed,i*2+1)-0.5)*2*j]);}
for(const k in SKINS){const S=SKINS[k];S.begin=(ctx,o)=>skinBegin(S,ctx,o);S.fill=(ctx,fn,col,o)=>skinFill(S,ctx,fn,col,o);S.line=(ctx,fn,col,w,o)=>skinLine(S,ctx,fn,col,w,o);
  S.poly=(ctx,pts,col,o)=>skinFill(S,ctx,c=>spline(c,S.id==="paper"&&!(o&&o.exact)?cut(pts,(o&&o.seed)||pts.length,(o&&o.cut)||1):pts,true,(o&&o.ten)!=null?o.ten:(S.id==="paper"?0.82:1)),col,o);}

/* ---------------------------------------------------------------- the kit
   K.S is the look in use; K.use(key) changes it (and forgets the places painted in the look before). K.u holds the helpers the
   kit's other files and a film's own pictures draw with. */
const K={SKINS,S:SKINS.line,norm,
  u:{TAU,rad,lerp,clamp,sine,pin,pio,spring,mix,dk,lt,css,rnd,hash,polar,area,cw,pg,spline,capsule,rrect,ell},
  use(key){if(!SKINS[key])throw new Error("PK.use: no look "+key);if(K.S!==SKINS[key]&&typeof AG_KEPT!=="undefined")for(const q of Object.keys(AG_KEPT))if(q.indexOf("place:")===0||q.indexOf("pk:")===0)delete AG_KEPT[q];
    K.S=SKINS[key];return K.S;}};
/* the colours that mean something in every film of the module, as in its first look: blue is plans and rules, green something done
   or of value, amber a risk or a cost, orange data, violet only an agent. They are for words and marks. People's clothes are soft,
   muted colours and never one of the five at this strength. */
K.C={ink:[52,40,44],mut:[122,106,104],card:[253,249,240],blue:[46,104,162],green:[52,132,92],amber:[186,118,26],orange:[204,104,56],violet:[110,92,196],white:[255,255,255]};
return K;})();

/* ===== The people kit: people =====
   A person is a row in a table (skin, hair, top, bottom, shoes, what they wear on the face); a pose is a row of angles; a face is
   three numbers. PK.person draws any person in any pose, whole, with their feet on the floor, seen three-quarters from the side,
   facing right (or left: flip). Angles are in degrees from straight down, positive the way the person faces.

   PK.person(ctx, who, x, floor, h, pose, o) -> the joints, in the frame's px (J.hc the head's centre, J.hdN and J.hdF the hands,
     J.shN the near shoulder, J.hip, J.kN the near knee, J.nN the near ankle).
     who    a name in PK.CAST, or a row like its rows
     x      under the hips; floor: where the feet stand (for a sitting person the floor under the seat; kneeling, the ground)
     h      how tall they stand, in px. In a place with an eye line, PK.hAt(floor, eye) gives the size at each depth
     pose   a name in PK.POSES, a row like its rows, or PK.poseMix(a, b, t); PK.poseWalk(step) for a stride
     o.flip     faces left (true), or a number from 0 to 1: a turn from right to left, through the front, as a body turns (half way
                the person faces us); take about 0.4 s over it
     o.expr     a face: a name in PK.EXPR or {brow, smile, open}; o.gaze [x, y] moves the eyes; o.nod tilts the head (radians)
     o.reachN, o.reachF   a point of the frame the near or far hand rests on: the arm follows; o.reachNk, o.reachFk (0 to 1) blend it in
     o.hold(ctx, hand, deg, J)   draws what the near hand holds, over the hand; o.under and o.underF the same, under a hand
     o.part     "lower" (the legs, to draw behind a table) or "upper" (the rest, in front of it); both by default
     o.side     how far the body is seen from the side (0 to 1); by default it follows the pose (PK.side): someone who sits, kneels,
                crouches or bends forward is drawn from the side, as their legs are
     o.seat     a seat's height above the floor, px, for a seat that isn't a chair's height (a stool, a log): the feet may hang
     o.t        the time: breath, blinks, and the small life of someone who stays where they are (a settle, a glance: PK.lifeAt;
                o.life 0: none). Always give it: someone drawn without it is a statue
     o.holds    true when the film itself draws what a hand holds (the kit's checks then know the hand isn't empty)
     o.far (0 to 1) fades the line with distance; o.shade 0: no shadow on the ground
     o.a        fades the person, as one picture
   PK.walk(ctx, who, t, w, o) walks a person from w.x0 to w.x1 between w.t0 and w.t1: the stride grows out of w.before (the pose
     they stand in before they set off) and dies into w.then (the pose they stop in), "stand" where none is given; w.floor a number
     or a function of x; w.h a number or a function of the floor; w.arms {aN, aF} keeps arms that carry something. o as PK.person's
     (o.hold and the rest).
   PK.poseMix(a, b, t), PK.exprMix(a, b, t), PK.talk(t, t0, t1) (a mouth that opens and closes while someone speaks).
   PK.face(t, base, events): a face through a shot, in one row: a nod, a look, a smile, a line spoken, each at its moment.
   PK.poseSit(k, stand, sit): sitting down or standing up (k: 0 standing, 1 seated), leaning forward on the way.
   Someone who stands for a while stands as people do: "ease" (the weight on one leg), "clasp" (hands together in front) or "listen";
   "stand" is the plain row the others are blended from. Hands hold, carry, give, take, write, rest or greet: nobody waves one about.
   Every pose a person takes up is blended from the one before (poseMix, or PK.walk), never switched to. */
(K=>{
const {TAU,rad,lerp,clamp,sine,pin,pio,mix,dk,lt,css,hash,polar,pg,spline,capsule,rrect,ell}=K.u;

/* ---------------------------------------------------------------- the cast: the university's people, as the module's films know them */
K.CAST={
  ivy:{name:"Ivy Reyes",role:"Data analyst",skin:[230,188,156],hair:{style:"bob",c:[40,32,38]},top:{kind:"sweater",c:[104,112,130]},bottom:{kind:"trousers",c:[60,64,86]},shoe:[62,50,56]},
  helena:{name:"Helena Novak",role:"Data manager",skin:[242,210,186],hair:{style:"long",c:[132,78,50]},glasses:[70,52,50],top:{kind:"jacket",c:[150,70,88],inner:[246,238,226]},bottom:{kind:"trousers",c:[78,62,74]},shoe:[66,46,48]},
  graham:{name:"Graham Ellis",role:"Facilities",skin:[238,202,178],hair:{style:"short",c:[186,182,180]},glasses:[70,62,60],top:{kind:"jacket",c:[128,114,96],inner:[242,238,230]},bottom:{kind:"trousers",c:[78,84,104]},shoe:[70,54,46]},
  mei:{name:"Mei Tanaka",role:"Registrar's office",skin:[242,208,178],hair:{style:"bun",c:[38,30,36]},top:{kind:"jacket",c:[128,168,148],inner:[246,240,228]},bottom:{kind:"skirt",c:[70,76,98]},shoe:[56,46,52]},
  sam:{name:"Sam Okafor",role:"Data platform",skin:[120,80,58],hair:{style:"coily",c:[34,26,26]},glasses:[40,32,32],top:{kind:"jacket",c:[98,128,160],inner:[238,238,234]},bottom:{kind:"trousers",c:[60,62,80]},shoe:[52,42,42]},
  jun:{name:"Jun Park",role:"Analytics engineer",skin:[238,202,170],hair:{style:"crop",c:[34,28,34]},glasses:[44,36,40],top:{kind:"sweater",c:[66,158,138]},bottom:{kind:"trousers",c:[76,78,96]},shoe:[58,48,48]},
  noor:{name:"Noor Rahman",role:"Data architect",skin:[184,132,100],hair:{style:"long",c:[30,24,26]},earrings:[226,214,190],top:{kind:"jacket",c:[86,104,124],inner:[234,236,240]},bottom:{kind:"trousers",c:[62,60,72]},shoe:[50,42,44]},
  yusuf:{name:"Yusuf Demir",role:"Data governance lead",skin:[212,168,132],hair:{style:"short",c:[44,34,32]},beard:[52,40,36],top:{kind:"jacket",c:[168,104,84],inner:[240,234,224]},bottom:{kind:"trousers",c:[74,70,76]},shoe:[60,46,40]},
  marta:{name:"Marta Silva",role:"Data analyst",skin:[164,114,86],hair:{style:"coily",c:[44,32,28]},earrings:[226,190,128],top:{kind:"jacket",c:[190,168,140],inner:[92,84,88]},bottom:{kind:"trousers",c:[92,76,70]},shoe:[62,48,44]},
  erin:{name:"Erin Walsh",role:"Platform engineer",skin:[240,204,178],hair:{style:"bun",c:[150,88,54]},top:{kind:"sweater",c:[146,122,110]},bottom:{kind:"trousers",c:[66,70,88]},shoe:[58,48,50]},
  tomas:{name:"Tomás Ortega",role:"Report developer",skin:[206,158,122],hair:{style:"short",c:[52,40,34]},beard:[64,50,44],top:{kind:"sweater",c:[150,96,90]},bottom:{kind:"trousers",c:[70,72,84]},shoe:[58,46,42]}
};
/* people nobody names: students, staff, passers-by. PK.extra(i) is the i-th, of many backgrounds, the same every time */
const X_SKIN=[[244,212,186],[226,180,146],[198,150,114],[160,112,84],[118,78,56],[92,60,44],[236,196,160]],X_HAIR=[[40,32,36],[92,60,40],[150,104,62],[30,24,24],[196,150,96],[62,44,40]],
  X_TOP=[[214,170,150],[150,170,160],[226,196,130],[132,140,170],[196,120,110],[120,150,140],[232,220,200],[170,150,190],[110,120,130]],X_BOT=[[70,76,98],[86,78,74],[112,104,96],[60,64,86],[150,128,100]],
  X_STYLE=["short","bob","long","coily","bun","crop"];
const X_MEMO={};
const X_NEAR=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])<110;   // hair the colour of the skin under it hides the face
// hair for a skin: never its own colour, and dark hair with a dark skin (fair hair there reads as a cap)
const X_HAIRFOR=(i,sk)=>{const h=X_HAIR[(i*7+3)%6];return X_NEAR(h,sk)||(sk[0]+sk[1]+sk[2]<400&&h[0]>100)?X_HAIR[i%2?0:3]:h;};
K.extra=i=>X_MEMO[i]||(X_MEMO[i]={key:"extra"+i,name:"",skin:X_SKIN[(i*3+1)%7],hair:{style:X_STYLE[(i*5+2)%6],c:X_HAIRFOR(i,X_SKIN[(i*3+1)%7])},glasses:i%4===1?[60,50,50]:null,
    top:{kind:i%3===0?"jacket":"sweater",c:X_TOP[(i*4+1)%9],inner:[244,238,228]},bottom:{kind:i%5===3?"skirt":"trousers",c:X_BOT[(i*3)%5]},shoe:[64,52,52]});
// a child: a larger head and shorter legs for their height
K.KID={head:1.34,neck:0.8,torso:0.98,thigh:0.84,shin:0.84,uarm:0.92,farm:0.92,hand:1.12,shW:0.9,hipW:0.92,foot:1.1};

/* ---------------------------------------------------------------- poses and faces
   a pose: lean (the back, forwards), head (the head's tilt, added to the lean), aN and aF (near and far arm: [upper arm, forearm,
   hand]; a hand is "rest", "open", "point", "grip" or "flat"), lN and lF (near and far leg: [thigh, shin]), fN and fF (the feet:
   toe down is positive), mode ("stand"; "sit": the hips on a seat; "kneel": the knees on the ground) */
K.POSES={
  stand:{lean:0,head:0,aN:[2,9],aF:[5,12],lN:[-2,-2],lF:[4,3]},
  listen:{lean:5,head:3,aN:[4,22],aF:[6,16],lN:[-2,-2],lF:[5,4]},
  ease:{lean:1,head:2,aN:[-7,12],aF:[-3,16],lN:[-3,-3],lF:[9,3]},                      // at ease: the weight on one leg, the elbows a little back
  clasp:{lean:1,head:2,aN:[4,30],aF:[8,36],lN:[-2,-2],lF:[5,4],clasp:1},              // hands held together in front, as people stand and listen
  wave:{lean:0,head:-3,aN:[150,196,"open"],aF:[5,12],lN:[-2,-2],lF:[4,3]},
  armful:{lean:-4,head:2,aN:[16,84,"grip"],aF:[24,92,"grip"],lN:[-2,-2],lF:[4,3]},
  can:{lean:-2,head:1,aN:[2,4,"grip"],aF:[10,20],lN:[-2,-2],lF:[4,3]},
  bend:{lean:17,head:9,aN:[10,58],aF:[16,66],lN:[-2,-2],lF:[5,4]},
  sit:{mode:"sit",lean:3,head:0,aN:[14,62],aF:[2,52],lN:[86,3],lF:[82,-5]},
  sitBack:{mode:"sit",lean:-6,head:-2,aN:[10,58],aF:[0,50],lN:[86,10],lF:[82,2]},
  sitWork:{mode:"sit",lean:7,head:4,aN:[30,84,"flat"],aF:[34,88,"flat"],lN:[86,4],lF:[82,-4]},
  kneel:{mode:"kneel",lean:26,head:-8,aN:[42,24,"grip"],aF:[4,30],lN:[28,-90],lF:[40,-88],fN:70,fF:70},
  crouch:{mode:"stand",lean:22,head:-10,aN:[40,64],aF:[34,54],lN:[114,-34],lF:[106,-42],fN:0,fF:12}
};
K.HAIRS=()=>HAIR;   // the hair styles' tables, for the kit's checks
K.EXPR={neutral:{brow:0,smile:0.3,open:0},smile:{brow:0.25,smile:0.9,open:0},worry:{brow:-0.9,smile:-0.4,open:0},talk:{brow:0.35,smile:0.25,open:0.7},
  listen:{brow:0.25,smile:0.15,open:0},relief:{brow:0.5,smile:0.7,open:0.1},think:{brow:-0.35,smile:-0.05,open:0},glad:{brow:0.6,smile:1,open:0.35}};
const poseOf=p=>typeof p==="string"?K.POSES[p]:p,exprOf=e=>typeof e==="string"?K.EXPR[e]:(e||K.EXPR.neutral);
K.poseMix=(a,b,t)=>{a=poseOf(a);b=poseOf(b);if(t<=0)return a;if(t>=1)return b;const o={mode:(t<0.5?a:b).mode};
  for(const k of ["lean","head","fN","fF","clasp"])o[k]=lerp(a[k]||0,b[k]||0,t);
  for(const k of ["aN","aF","lN","lF"]){o[k]=[lerp(a[k][0],b[k][0],t),lerp(a[k][1],b[k][1],t)];if(k[0]==="a")o[k][2]=(t<0.5?a:b)[k][2];}return o;};
K.exprMix=(a,b,t)=>{a=exprOf(a);b=exprOf(b);t=clamp(t,0,1);return{brow:lerp(a.brow,b.brow,t),smile:lerp(a.smile,b.smile,t),open:lerp(a.open||0,b.open||0,t)};};
/* sitting down or standing up (k: 0 standing, 1 seated): the back leans forward on the way, as a body does to keep its balance, and
   the feet stay under the hips until the seat takes the weight; only then do the legs come forward. Never poseMix a stand and a sit:
   half way, that is someone falling backwards with stiff legs */
K.poseSit=(k,stand,sit)=>{k=clamp(k,0,1);const p=K.poseMix(stand||"stand",sit||"sit",k),b=Math.sin(Math.PI*k);
  return Object.assign({},p,{lean:(p.lean||0)+20*b,head:(p.head||0)-5*b,lN:[p.lN[0],p.lN[1]-50*b],lF:[p.lF[0],p.lF[1]-50*b]});};
// a mouth that opens and closes while someone speaks, from t0 to t1
K.talk=(t,t0,t1)=>pio(t,t0,t1,0.18)*(0.35+0.65*Math.abs(Math.sin(t*8.2+Math.sin(t*3.1))));
/* ---------------------------------------------------------------- life
   Nobody stands like a statue. Given the time (o.t), someone who stands or sits where they are settles a little now and then: the
   head lifts or dips a degree or two, the back shifts, the eyes go aside and come back. Everyone has a rhythm of their own (from
   their name), so no two move together. It is small on purpose: what people do, and how they take what is said, is the film's to
   stage (a pose, PK.face); this keeps them alive in between. o.life scales it (0: none); a stride has little. */
const seedOf=P=>{if(P._sd!=null)return P._sd;const s=P.key||P.name||"x";let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%9973;return P._sd=h;};
K.lifeAt=(t,P)=>{const sd=seedOf(P),T=4.4+3.2*hash(sd,1),q=t/T+hash(sd,2)+8,n=Math.floor(q),f=(q-n)*T,e=sine(f/0.9),st=i=>[(hash(sd+i*13,3)-0.5)*5.6,(hash(sd+i*13,4)-0.5)*2],a=st(n-1),b=st(n);
  // a glance aside in one settle in three, half way to the next
  const gl=hash(sd+n*13,5)<0.34?pio(f,T*0.45,T*0.45+0.9+hash(sd+n*13,6)*0.6,0.22):0,gd=hash(sd+n*13,7)<0.5?-1:1;
  return{head:lerp(a[0],b[0],e),lean:lerp(a[1],b[1],e),gx:gl*gd*0.7,gy:gl*0.25};};
const alive=(P,pose,o)=>{if(o.t==null||o.life===0)return pose;const L=K.lifeAt(o.t,P),k=o.life==null?1:clamp(o.life,0,1),g=o.gaze||[0,0];
  o.gaze=[clamp(g[0]+L.gx*k,-1.3,1.3),clamp(g[1]+L.gy*k,-1.3,1.3)];return Object.assign({},pose,{lean:(pose.lean||0)+L.lean*k,head:(pose.head||0)+L.head*k});};
/* A face through a shot: what someone's face, eyes and head do while they listen and speak, in one row.
   PK.face(t, base, events) -> {expr, gaze, nod}, to hand on to PK.person with the rest: Object.assign({t, flip: true}, PK.face(...)).
   base: {expr, gaze, nod} as they are at rest. events, each [at, what, d, to]:
     [at, "nod"]              a nod, as someone agrees or takes a thing in ("nods": two)
     [at, "say", d]           they speak for d seconds: the mouth opens and closes
     [at, a face, d]          a face in PK.EXPR (or {brow, smile, open}) for d seconds, blended in and out (2.4 s by default;
                              Infinity: it stays)
     [at, "look", d, [x, y]]  the eyes go there for d seconds and come back (1.6 s by default; Infinity: they stay)
   A listener does one of these every few seconds: tools/people.py lists whoever is seen large and stays as they are for too long. */
K.face=(t,base,ev)=>{base=base||{};let e=K.exprMix(base.expr||"neutral",base.expr||"neutral",0),g=(base.gaze||[0,0]).slice(),nod=base.nod||0,open=0;
  for(const [at,what,d,to] of ev||[]){
    if(what==="nod"||what==="nods"){for(let i=0;i<(what==="nods"?2:1);i++){const s=(t-at-i*0.62)/0.62;if(s>0&&s<1)nod+=0.13*Math.sin(Math.PI*Math.pow(s,0.7));}}   // down fast, up slower
    else if(what==="say")open=Math.max(open,K.talk(t,at,at+(d||2)));
    else if(what==="look"){const k=d===Infinity?pin(t,at,0.3):pio(t,at,at+(d||1.6),0.3);g=[lerp(g[0],to[0],k),lerp(g[1],to[1],k)];}
    else{const k=d===Infinity?pin(t,at,0.4):pio(t,at,at+(d||2.4),0.4);if(k>0)e=K.exprMix(e,what,k);}}
  e.open=Math.max(e.open||0,open*0.75);return{expr:e,gaze:g,nod};};
/* a hand at work among things (seedlings in a bed, papers on a table): it rests on each of pts in turn for dwell seconds, then moves
   on to the next, round and round, from t0. -> [x, y], for o.reachN or o.reachF */
K.among=(t,pts,dwell,t0)=>{dwell=dwell||2.2;const T=dwell+0.6,q=Math.max(0,(t-(t0||0))/T),i=Math.floor(q),a=pts[i%pts.length],b=pts[(i+1)%pts.length],e=sine(((q-i)*T-dwell)/0.6);return[lerp(a[0],b[0],e),lerp(a[1],b[1],e)];};
/* hands at work on a keyboard: they tap in bursts, each hand to its own beat, and rest between two bursts. -> {n, f}: how far the
   near and the far hand are from where they rest, [along the keys, above them], in units of the person's height */
K.typing=(t,P)=>{const sd=seedOf(P),T=3.6+2.2*hash(sd,11),q=t/T+hash(sd,12)+8,n=Math.floor(q),f=(q-n)*T,on=pio(f,0.15,T*(0.5+0.25*hash(sd+n*7,13)),0.25),
    hand=i=>{const s=t*(4.1+1.1*hash(sd,14+i))+i*1.7,j=Math.floor(s),fr=s-j;return[lerp(hash(sd+j*3,16+i)-0.5,hash(sd+(j+1)*3,16+i)-0.5,sine(fr))*0.012*on,Math.abs(Math.sin(Math.PI*fr))*0.005*on];};
  return{n:hand(0),f:hand(1),on};};
/* a stride: where each leg and arm is at this point of it (step: 1 is both feet once), blended in from standing by k.
   PK.strideOf(h): how far one stride carries a person h tall, so the feet don't slide */
K.poseWalk=(step,k,amp)=>{k=k==null?1:k;amp=amp||1;const ph=TAU*step,s=Math.sin(ph),c=Math.cos(ph),g=24*amp,ar=20*(0.4+0.6*amp),bend=x=>(7+32*Math.pow(Math.max(0,x),1.5))*amp;
  const W={lean:4,head:0,aN:[-ar*s,-ar*s+16+6*c],aF:[ar*s,ar*s+16-6*c],lN:[g*s,g*s-bend(c)],lF:[-g*s,-g*s-bend(-c)],fN:(c>0?12*c:-6*s)*amp,fF:(c<0?-12*c:6*s)*amp};
  return k>=1?W:K.poseMix("stand",W,k);};
// amp: how long the steps are (1 by default; a long skirt keeps them shorter, PK.ampOf)
K.strideOf=(h,amp)=>h*0.7*(amp||1);
K.ampOf=P=>P.bottom&&P.bottom.kind==="long"?0.6:P.kid?0.9:1;
K.hAt=(floor,eye)=>(floor-eye)/0.91;           // a standing adult's height where their eyes are on the place's eye line
K.seatOf=h=>{const p=K.S.prop;return(p.shin+p.ankle-p.leg[0]*0.32)*h/1000;};   // a chair's seat, above the floor, for someone h tall

/* where every joint is, in frame px, for a person h px tall with their feet (or seat, or knees) placed by the pose */
const propOf=P=>{const S=K.S;if(!P.build&&!P.kid)return S.prop;const key=S.key+"|"+(P.key||P.name);P._p=P._p||{};if(P._p[key])return P._p[key];
  const b=Object.assign({},P.kid?K.KID:{},P.build||{}),q={};for(const j in S.prop){const v=S.prop[j],f=b[j]||1;q[j]=Array.isArray(v)?v.map(x=>x*(b.thick||1)):v*f;}return P._p[key]=K.norm(q);};
/* A standing person is seen three-quarters on: both shoulders show, and the legs stand side by side. Legs that fold (a seat, a
   kneel, a crouch) and a back that bends forward move in the frame's plane, as seen from the side, so the body turns with them:
   K.side(pose) is how far (0: three-quarters, 1: from the side). The torso is then drawn as deep as a body is from the side, the
   shoulders come to its middle, one behind the other, and the legs lie one behind the other. o.side sets it by hand. */
K.side=pose=>{pose=poseOf(pose);return clamp(Math.max((Math.max(Math.abs(pose.lN[0]-pose.lN[1]),Math.abs(pose.lF[0]-pose.lF[1]))-40)/40,(Math.abs(pose.lean||0)-6)/16),0,1);};
/* A turn (o.flip between 0 and 1) goes through the front, as a body does: k is how far the person is still seen from the side they
   face (1: as drawn, 0: from the front; past the front the picture is mirrored). What reaches forwards (a stride, a seated thigh, an
   arm held out, a lean) is seen shorter by k, while the body and the head keep their width, the shoulders and hips open to their
   full width, and the feet point at us: so nobody is ever seen edge on, as a sheet of paper would be. */
const turnOf=o=>{const fl=o.flip===true?1:(o.flip||0),c=Math.cos(Math.PI*fl);return{c,k:Math.abs(c)>0.999?1:Math.abs(c),sg:c<0?-1:1};};
const scr=(deg,k)=>k>=1?deg:Math.atan2(Math.sin(rad(deg))*k,Math.cos(rad(deg)))*180/Math.PI;   // an angle as it is seen, k of the way round
function rig(P,pose,x,floor,h,o){const p=propOf(P),u=h/1000,M=pose.mode||"stand",{k,sg}=turnOf(o),L=(q,deg,len,kk)=>[q[0]+Math.sin(rad(deg))*len*u*(kk==null?k:kk),q[1]+Math.cos(rad(deg))*len*u],
    pr0=o.side!=null?clamp(o.side,0,1):K.side(pose),pr=pr0*k;
  const hw=p.hipW*u*lerp(1,0.22,pr),hip=[0,0],hN=[-hw,0],hF=[hw,-3*u*k],kN=L(hN,pose.lN[0],p.thigh),kF=L(hF,pose.lF[0],p.thigh),nN=L(kN,pose.lN[1],p.shin),nF=L(kF,pose.lF[1],p.shin);
  // how far the hips are above the floor: on whatever is lowest, the feet or the knees, so a person who sits down, kneels or stands
  // up stays on the ground all the way; on a seat of a given height (o.seat), the hips rest on it and the feet go where the legs put them
  const low=M==="sit"&&o.seat!=null?o.seat+p.leg[0]*u*0.42:Math.max(kN[1]+p.leg[1]*u*0.5,kF[1]+p.leg[1]*u*0.5,nN[1]+p.ankle*u,nF[1]+p.ankle*u);
  // someone who sits facing us: their knees come towards us, so a little down the frame, and their feet with them
  if(M==="sit"&&k<1)for(const [kn,an,deg] of [[kN,nN,pose.lN[0]],[kF,nF,pose.lF[0]]]){const d=(1-k)*0.15*p.thigh*u*Math.abs(Math.sin(rad(deg)));kn[1]+=d;an[1]+=d;}
  const le=rad(scr(pose.lean||0,k)),ax=[Math.cos(le),Math.sin(le)],up=[Math.sin(le),-Math.cos(le)],T=p.torso*u;
  // the shoulders: one before the other from the side, side by side from the front
  const sw=p.shW*u,sn=lerp(sw*1.06,sw*lerp(1,0.06,pr0),k),sf=lerp(sw*1.06,sw*0.8*lerp(1,0.16,pr0),k),dN=lerp(32,34,k)*u,dF=lerp(32,30,k)*u;
  const sc=[up[0]*T,up[1]*T],shN=[sc[0]-ax[0]*sn-up[0]*dN,sc[1]-ax[1]*sn-up[1]*dN],shF=[sc[0]+ax[0]*sf-up[0]*dF,sc[1]+ax[1]*sf-up[1]*dF];
  const ha=rad(scr((pose.lean||0)*0.55+(pose.head||0),k)),hu=[Math.sin(ha),-Math.cos(ha)],nb=[sc[0]+up[0]*4*u,sc[1]+up[1]*4*u],hc=[nb[0]+hu[0]*(p.neck+p.head*0.5)*u,nb[1]+hu[1]*(p.neck+p.head*0.5)*u];
  // hands held together in front of the hips (a pose's clasp): each arm goes there, unless it rests on something else; an arm lets
  // go through a turn, since the hands would meet behind an elbow there
  const cl=(pose.clasp||0)*clamp(k*2-1,0,1),loc=tg=>[(tg[0]-x)*sg,tg[1]-(floor-low)],tN=o.reachN?loc(o.reachN):cl>0?[28*u,12*u]:null,tF=o.reachF?loc(o.reachF):cl>0?[50*u,20*u]:null,
    rN=o.reachN?(o.reachNk==null?1:clamp(o.reachNk,0,1)):cl,rF=o.reachF?(o.reachFk==null?1:clamp(o.reachFk,0,1)):cl;
  const reach=(sh,a,q,rk)=>{if(!q||rk<=0)return a;const g=ik(sh,q,p.uarm*u,(p.farm+p.hand*0.45)*u);return rk>=1?[g[0],g[1],a[2]]:[lerp(a[0],g[0],rk),lerp(a[1],g[1],rk),a[2]];};
  // an arm that rests on something is in the frame's plane already: it is seen whole, however far round the person is
  const aN=reach(shN,pose.aN,tN,rN),aF=reach(shF,pose.aF,tF,rF),kaN=lerp(k,1,rN),kaF=lerp(k,1,rF);
  const eN=L(shN,aN[0],p.uarm,kaN),wN=L(eN,aN[1],p.farm,kaN),eF=L(shF,aF[0],p.uarm,kaF),wF=L(eF,aF[1],p.farm,kaF);
  const J={hip,hN,hF,kN,kF,nN,nF,sc,shN,shF,nb,hc,eN,wN,eF,wF};for(const j in J)J[j]=[x+J[j][0],floor-low+J[j][1]];
  // the arms' angles as they are seen: what a hand, a cuff and a held thing are drawn along
  J.u=u;J.p=p;J.le=le;J.ha=ha;J.mode=M;J.side=pr;J.k=k;J.aN=[scr(aN[0],kaN),scr(aN[1],kaN),aN[2]];J.aF=[scr(aF[0],kaF),scr(aF[1],kaF),aF[2]];
  J.hdN=polar(J.wN,J.aN[1],p.hand*0.45*u);J.hdF=polar(J.wF,J.aF[1],p.hand*0.45*u);return J;}
/* where an arm's two bones go for its hand to rest on a point: [upper arm, forearm], the elbow behind */
function ik(sh,tg,l1,l2){const dx=tg[0]-sh[0],dy=tg[1]-sh[1],d=clamp(Math.hypot(dx,dy),Math.abs(l1-l2)+1,l1+l2-1),base=Math.atan2(dx,dy);
  const a0=base-Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1)),ex=sh[0]+Math.sin(a0)*l1,ey=sh[1]+Math.cos(a0)*l1,k=d/(Math.hypot(dx,dy)||1);
  return[a0*180/Math.PI,Math.atan2(sh[0]+dx*k-ex,sh[1]+dy*k-ey)*180/Math.PI];}

/* ---------------------------------------------------------------- the head: one turn for all of it, from one table of points
   A head is drawn three-quarters on, facing right: HEAD is its outline, FACE where the eyes, the nose, the mouth, the ears and the
   cheeks are, HAIR each style's cap (and a bun, a knot, or the hair down the back). Each has its place seen from the front too
   (HEADF, FACEF, a style's turn: [the cap three-quarters on, with the far side's hair folded away behind the cheek; the same points
   from the front]). As a person turns round, every point moves from one to the other by the same k, and out again on the other
   side, mirrored: one turn for the whole head. A new style needs a cap and a turn, both drawn and looked at, at full size. */
const HEAD=[[0.02,-0.5],[0.3,-0.4],[0.41,-0.12],[0.4,0.12],[0.3,0.36],[0.1,0.5],[-0.14,0.44],[-0.36,0.22],[-0.44,-0.08],[-0.34,-0.36]];
const HEADF=HEAD.map((q,i)=>{const m=HEAD[(10-i)%10];return[(q[0]-m[0])/2,(q[1]+m[1])/2];});
const FACE={eyeN:[0.07,-0.02],eyeF:[0.29,-0.02],nose:[0.24,0.1],mouth:[0.19,0.275],ear:[-0.19,0.04],earF:[0.28,0.04],blushN:[0.0,0.17],blushF:[0.33,0.165]};
const FACEF={eyeN:[-0.115,-0.02],eyeF:[0.115,-0.02],nose:[0,0.1],mouth:[0,0.275],ear:[-0.425,0.04],earF:[0.425,0.04],blushN:[-0.2,0.17],blushF:[0.2,0.17]};
// the nose, a small curve (five points of two curves): three-quarters on, the tip and the nostril; from the front, the nostrils' line
const NOSE=[[-0.012,-0.07],[0.05,0.01],[0.022,0.03],[-0.005,0.04],[-0.02,0.025]],NOSEF=[[-0.026,0.006],[-0.024,0.036],[0,0.037],[0.024,0.036],[0.026,0.006]];
const HAIR={
  short:{cap:[[0.35,-0.28],[0.3,-0.45],[0.03,-0.56],[-0.35,-0.44],[-0.5,-0.1],[-0.45,0.18],[-0.3,0.16],[-0.27,-0.02],[-0.12,-0.1],[0,-0.23],[0.2,-0.3]],ear:1,
    turn:[[[0.405,-0.1],[0.35,-0.28],[0.3,-0.45],[0.03,-0.56],[-0.35,-0.44],[-0.5,-0.1],[-0.45,0.18],[-0.3,0.16],[-0.27,-0.02],[-0.12,-0.1],[0,-0.23],[0.2,-0.3],[0.28,-0.295],[0.345,-0.275],[0.385,-0.19],[0.4,-0.1]],
          [[0.455,0.03],[0.44,-0.25],[0.3,-0.48],[0,-0.565],[-0.3,-0.48],[-0.44,-0.25],[-0.455,0.03],[-0.385,0.04],[-0.37,-0.1],[-0.3,-0.19],[-0.16,-0.28],[0,-0.3],[0.16,-0.28],[0.3,-0.19],[0.37,-0.1],[0.385,0.04]]]},
  crop:{cap:[[0.4,-0.2],[0.37,-0.44],[0.06,-0.58],[-0.35,-0.45],[-0.5,-0.1],[-0.45,0.16],[-0.3,0.14],[-0.27,-0.02],[-0.12,-0.1],[0.02,-0.2],[0.22,-0.24]],ear:1,
    turn:[[[0.41,-0.06],[0.4,-0.2],[0.37,-0.44],[0.06,-0.58],[-0.35,-0.45],[-0.5,-0.1],[-0.45,0.16],[-0.3,0.14],[-0.27,-0.02],[-0.12,-0.1],[0.02,-0.2],[0.22,-0.24],[0.3,-0.225],[0.37,-0.2],[0.405,-0.14],[0.405,-0.07]],
          [[0.455,0.03],[0.45,-0.22],[0.32,-0.49],[0,-0.585],[-0.32,-0.49],[-0.45,-0.22],[-0.455,0.03],[-0.385,0.04],[-0.37,-0.08],[-0.31,-0.16],[-0.17,-0.22],[0,-0.24],[0.17,-0.22],[0.31,-0.16],[0.37,-0.08],[0.385,0.04]]]},
  bob:{cap:[[0.37,-0.2],[0.34,-0.45],[0.02,-0.575],[-0.38,-0.45],[-0.52,-0.08],[-0.51,0.28],[-0.4,0.45],[-0.16,0.46,1],[-0.08,0.22],[-0.05,-0.02],[0.06,-0.17],[0.23,-0.21]],
    turn:[[[0.33,0.31],[0.405,0],[0.37,-0.2],[0.34,-0.45],[0.02,-0.575],[-0.38,-0.45],[-0.52,-0.08],[-0.51,0.28],[-0.4,0.45],[-0.16,0.46,1],[-0.08,0.22],[-0.05,-0.02],[0.06,-0.17],[0.23,-0.21],[0.31,-0.205],[0.365,-0.19],[0.4,0],[0.33,0.3,1]],
          [[0.42,0.46],[0.52,0.22],[0.51,-0.12],[0.36,-0.46],[0,-0.575],[-0.36,-0.46],[-0.51,-0.12],[-0.52,0.22],[-0.42,0.46],[-0.28,0.47,1],[-0.3,0.2],[-0.29,-0.04],[-0.16,-0.2],[0,-0.23],[0.16,-0.2],[0.29,-0.04],[0.3,0.2],[0.28,0.47,1]]]},
  long:{cap:[[0.36,-0.22],[0.33,-0.45],[0.02,-0.58],[-0.39,-0.45],[-0.54,-0.06],[-0.52,0.3],[-0.3,0.46],[-0.1,0.34],[-0.06,0.1],[-0.04,-0.06],[0.07,-0.19],[0.22,-0.24]],
        back:[[-0.5,-0.1],[-0.6,0.5],[-0.58,1.0],[-0.36,1.14],[-0.14,1.0],[-0.08,0.4]],
        backT:[[[-0.5,-0.1],[-0.6,0.5],[-0.58,1.0],[-0.36,1.14],[-0.14,1.0],[-0.08,0.4],[-0.12,0]],[[-0.5,-0.1],[-0.57,0.5],[-0.5,1.0],[0,1.08],[0.5,1.0],[0.57,0.5],[0.5,-0.1]]],
    turn:[[[0.33,0.31],[0.405,0],[0.36,-0.22],[0.33,-0.45],[0.02,-0.58],[-0.39,-0.45],[-0.54,-0.06],[-0.52,0.3],[-0.3,0.46],[-0.1,0.34],[-0.06,0.1],[-0.04,-0.06],[0.07,-0.19],[0.22,-0.24],[0.3,-0.23],[0.355,-0.21],[0.4,0],[0.33,0.3]],
          [[0.36,0.48],[0.53,0.26],[0.53,-0.1],[0.37,-0.46],[0,-0.585],[-0.37,-0.46],[-0.53,-0.1],[-0.53,0.26],[-0.36,0.48],[-0.27,0.4],[-0.31,0.12],[-0.3,-0.06],[-0.17,-0.21],[0,-0.25],[0.17,-0.21],[0.3,-0.06],[0.31,0.12],[0.27,0.4]]]},
  bun:{cap:[[0.35,-0.28],[0.3,-0.45],[0.03,-0.56],[-0.35,-0.44],[-0.5,-0.1],[-0.45,0.2],[-0.3,0.18],[-0.27,-0.02],[-0.12,-0.1],[0,-0.23],[0.2,-0.3]],bun:[-0.43,-0.41,0.175],ear:1,
    turn:[[[0.405,-0.1],[0.35,-0.28],[0.3,-0.45],[0.03,-0.56],[-0.35,-0.44],[-0.5,-0.1],[-0.45,0.2],[-0.3,0.18],[-0.27,-0.02],[-0.12,-0.1],[0,-0.23],[0.2,-0.3],[0.28,-0.295],[0.345,-0.275],[0.385,-0.19],[0.4,-0.1]],
          [[0.455,0.03],[0.44,-0.25],[0.3,-0.48],[0,-0.565],[-0.3,-0.48],[-0.44,-0.25],[-0.455,0.03],[-0.385,0.04],[-0.37,-0.1],[-0.3,-0.19],[-0.16,-0.28],[0,-0.3],[0.16,-0.28],[0.3,-0.19],[0.37,-0.1],[0.385,0.04]]]},
  coily:{cap:null,ear:1},
  scarf:{cap:[[0.39,-0.25],[0.33,-0.47],[0.03,-0.6],[-0.38,-0.47],[-0.55,-0.1],[-0.5,0.22],[-0.3,0.26],[-0.24,0.06],[-0.1,-0.07],[0.06,-0.17],[0.24,-0.21]],
         knot:[[-0.5,0.08],[-0.66,0.2],[-0.74,0.44],[-0.62,0.46],[-0.56,0.3],[-0.5,0.52],[-0.4,0.5],[-0.42,0.24]],
    turn:[[[0.405,-0.08],[0.39,-0.25],[0.33,-0.47],[0.03,-0.6],[-0.38,-0.47],[-0.55,-0.1],[-0.5,0.22],[-0.3,0.26],[-0.24,0.06],[-0.1,-0.07],[0.06,-0.17],[0.24,-0.21],[0.31,-0.215],[0.365,-0.22],[0.4,-0.16],[0.4,-0.09]],
          [[0.48,0.12],[0.5,-0.2],[0.34,-0.5],[0,-0.605],[-0.34,-0.5],[-0.5,-0.2],[-0.48,0.12],[-0.39,0.13],[-0.36,-0.04],[-0.3,-0.15],[-0.16,-0.21],[0,-0.23],[0.16,-0.21],[0.3,-0.15],[0.36,-0.04],[0.39,0.13]]]}
};
// short coily hair: a cap with a softly scalloped edge
HAIR.coily.cap=(()=>{const o=[[0.36,-0.27]];for(let i=0;i<=10;i++){const a=rad(-50-i*15.4),r=0.56+(i%2?0.012:-0.008);o.push([0.01+Math.cos(a)*r*0.86,-0.02+Math.sin(a)*r]);}
  return o.concat([[-0.4,0.2],[-0.29,0.17],[-0.27,-0.01],[-0.15,-0.11],[-0.02,-0.25],[0.18,-0.32]]);})();
HAIR.coily.turn=(()=>{const a=[[0.405,-0.1]].concat(HAIR.coily.cap,[[0.27,-0.3],[0.345,-0.28],[0.39,-0.2],[0.4,-0.1]]),b=[[0.42,0.07],[0.455,0.05]];
  for(let i=0;i<=10;i++){const g=rad(6-i*19.2),r=0.56+(i%2?0.012:-0.008);b.push([Math.cos(g)*r*0.86,-0.02+Math.sin(g)*r]);}
  return[a,b.concat([[-0.42,0.07],[-0.385,0.06],[-0.37,-0.09],[-0.3,-0.2],[-0.16,-0.29],[0,-0.32],[0.16,-0.29],[0.3,-0.2],[0.37,-0.09],[0.385,0.06]])];})();
const BEARD=[[-0.27,0.1],[-0.3,0.3],[-0.16,0.47],[0.08,0.545],[0.26,0.45],[0.35,0.3],[0.32,0.2],[0.25,0.215],[0.2,0.2],[0.1,0.215],[0.04,0.32],[-0.1,0.3],[-0.19,0.12]];
const BEARDF=[[-0.37,0.1],[-0.35,0.3],[-0.2,0.48],[0,0.55],[0.2,0.48],[0.35,0.3],[0.37,0.1],[0.28,0.13],[0.2,0.27],[0.07,0.2],[-0.07,0.2],[-0.2,0.27],[-0.28,0.13]];
function head(ctx,P,J,o){const S=K.S,hh=J.p.head*J.u,H=HAIR[P.hair.style]||HAIR.short,e=Object.assign({},K.EXPR.neutral,o.expr||{}),sk=S.tone(P.skin),hc=S.tone(P.hair.c),small=hh<26,k=J.k==null?1:J.k,tn=k<1;
  // a point, or a row of points, k of the way from its place seen from the front (b) to its place three-quarters on (a)
  const T1=(a,b)=>tn?[lerp(b[0],a[0],k),lerp(b[1],a[1],k)]:a,T2=(a,b)=>tn?a.map((q,i)=>[lerp(b[i][0],q[0],k),lerp(b[i][1],q[1],k),q[2]]):a,far=x=>tn?lerp(1,x,k):x;
  const Kp=(pts)=>pts.map(q=>[q[0]*hh,q[1]*hh,q[2]]),at=q=>[q[0]*hh,q[1]*hh],F={};for(const j in FACE)F[j]=T1(FACE[j],FACEF[j]);
  const HD=Kp(T2(HEAD,HEADF)),la=tn?clamp((k-0.35)/0.45,0,1):1;
  ctx.save();ctx.translate(J.hc[0],J.hc[1]);ctx.rotate(J.ha+(o.nod||0)*k);
  if(H.bun)S.fill(ctx,c=>ell(c,H.bun[0]*k*hh,H.bun[1]*hh,H.bun[2]*hh,H.bun[2]*hh),hc,{});
  if(H.knot&&tn)S.poly(ctx,Kp(H.knot.map(q=>[q[0]+0.57*(1-k),q[1]-0.14*(1-k)])),dk(hc,0.06),{seed:13});   // a knot at the back goes behind the head as it turns
  if(H.ear)for(const q of [at(F.ear),at(F.earF)])S.fill(ctx,c=>ell(c,q[0],q[1],0.065*hh,0.095*hh),dk(sk,0.05),{w:0.8});
  S.poly(ctx,HD,sk,S.shade?{grad:[0.3*hh,-0.3*hh,-0.4*hh,0.5*hh,0.1]}:{seed:7});
  if(P.beard)S.poly(ctx,Kp(T2(BEARD,BEARDF)),S.tone(P.beard),{seed:9,w:0.6,flat:true});
  // the cheeks, the eyes, the brows, the nose, the mouth
  const gz=o.gaze||[0,0],bl=o.blink||0,ey=q=>[q[0]*hh+gz[0]*k*0.02*hh,q[1]*hh+gz[1]*0.02*hh],eN=ey(F.eyeN),eF=ey(F.eyeF),hard=S.id==="line"&&!S.self,ink=hard?S.ink:mix(S.ink,[30,22,26],S.self?0.62:0.4);
  if(S.blush&&!small){ctx.fillStyle=css(mix(sk,[232,96,84],0.5),S.blush);ctx.save();ctx.beginPath();spline(ctx,HD);ctx.clip();ctx.beginPath();for(const q of [F.blushN,F.blushF])ell(ctx,q[0]*hh,q[1]*hh,0.085*hh,0.06*hh);ctx.fill();ctx.restore();}
  const er=(S.id==="line"?0.032:0.037)*hh;ctx.fillStyle=css(ink);
  for(const [q,f] of [[eN,1],[eF,far(0.86)]]){ctx.beginPath();ctx.ellipse(q[0],q[1],er*f,Math.max(er*0.16,er*1.12*(1-bl)),0,0,TAU);ctx.fill();}
  ctx.lineCap="round";ctx.lineJoin="round";
  if(!small){ctx.strokeStyle=css(hard?S.ink:dk(hc,0.25));ctx.lineWidth=(S.id==="line"?0.02:0.024)*hh;
    const bw=0.062*hh,by=-0.118*hh-e.brow*0.012*hh;
    for(const [q,f,sg] of [[eN,1,1],[eF,far(0.8),-1]]){const t=e.brow<0?e.brow*0.04*hh*sg:0;ctx.beginPath();ctx.moveTo(q[0]-bw*f,by+q[1]+0.02*hh-t);ctx.quadraticCurveTo(q[0],by+q[1]-0.004*hh-Math.max(0,e.brow)*0.014*hh,q[0]+bw*f,by+q[1]+0.02*hh+t);ctx.stroke();}
    const n=at(F.nose);
    if(S.id==="line"){const N=T2(NOSE,NOSEF).map(q=>[n[0]+q[0]*hh,n[1]+q[1]*hh]);ctx.strokeStyle=css(hard?S.ink:dk(mix(sk,[190,90,80],0.45),0.25));ctx.lineWidth=0.018*hh;
      ctx.beginPath();ctx.moveTo(N[0][0],N[0][1]);ctx.quadraticCurveTo(N[1][0],N[1][1],N[2][0],N[2][1]);ctx.quadraticCurveTo(N[3][0],N[3][1],N[4][0],N[4][1]);ctx.stroke();}
    else{ctx.fillStyle=css(dk(mix(sk,[214,110,90],0.25),0.1),S.id==="paper"?0.9:0.75);ctx.beginPath();ctx.ellipse(n[0]+0.012*hh*k,n[1],0.03*hh,0.04*hh,-0.3*k,0,TAU);ctx.fill();}
    const m=at(F.mouth),mw=(0.062+0.014*Math.max(0,e.smile))*hh*lerp(1.12,1,k),mr=far(0.9);ctx.strokeStyle=css(hard?S.ink:(P.beard?lt(S.tone(P.beard),0.5):dk(mix(sk,[170,60,60],0.5),0.3)));ctx.lineWidth=(S.id==="line"?0.02:0.024)*hh;
    if(e.open>0.05){const d=(0.02+0.05*e.open)*hh,ly=m[1]-e.smile*0.01*hh;ctx.fillStyle=css([104,46,52]);ctx.beginPath();ctx.moveTo(m[0]-mw*0.86,ly);ctx.quadraticCurveTo(m[0],ly+0.012*hh,m[0]+mw*far(0.8/0.86)*0.86,ly-0.004*hh*k);
      ctx.bezierCurveTo(m[0]+mw*0.7,ly+d*1.25,m[0]-mw*0.7,ly+d*1.3,m[0]-mw*0.86,ly);ctx.closePath();ctx.fill();if(S.id==="line")ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(m[0]-mw,m[1]-e.smile*0.012*hh);ctx.quadraticCurveTo(m[0]+0.006*hh*k,m[1]+e.smile*0.046*hh,m[0]+mw*mr,m[1]-e.smile*lerp(0.012,0.016,k)*hh);ctx.stroke();}}
  // the hair or the scarf, over the head
  if(H.knot&&!tn)S.poly(ctx,Kp(H.knot),dk(hc,0.06),{seed:13});
  S.poly(ctx,Kp(tn&&H.turn?T2(H.turn[0],H.turn[1]):H.cap),hc,S.shade?{grad:[0.2*hh,-0.5*hh,-0.5*hh,0.3*hh,0.12],seed:5}:{seed:5});
  if(!small&&la>0.01){if(P.hair.style==="scarf")S.line(ctx,c=>{c.moveTo(0.3*hh,-0.3*hh);c.quadraticCurveTo(0,-0.42*hh,-0.36*hh,-0.2*hh);c.moveTo(0.16*hh,-0.42*hh);c.quadraticCurveTo(-0.1*hh,-0.46*hh,-0.42*hh,-0.02*hh);},null,0.55,{a:la});
    else if(P.hair.style!=="coily")S.line(ctx,c=>{c.moveTo(0.12*hh,-0.48*hh);c.quadraticCurveTo(-0.1*hh,-0.4*hh,-0.3*hh,-0.16*hh);},null,0.5,{a:la});}
  if(P.earrings&&!small){const q=at(T1([-0.185,0.17],[-0.42,0.2])),f=at(T1([0.39,0.17],[0.42,0.2])),rf=tn?clamp((1-k)*2.5,0,1):0;S.fill(ctx,c=>ell(c,q[0],q[1],0.03*hh,0.03*hh),P.earrings,{w:0.6,flat:true});
    if(rf>0.05)S.fill(ctx,c=>ell(c,f[0],f[1],0.03*hh*rf,0.03*hh*rf),P.earrings,{w:0.6,flat:true});}
  if(P.glasses&&!small){ctx.strokeStyle=css(hard?S.ink:P.glasses);ctx.lineWidth=(S.id==="line"?0.02:0.026)*hh;ctx.fillStyle="rgba(255,255,255,0.22)";const fk=far(0.82);
    for(const [q,f] of [[at(F.eyeN),1],[at(F.eyeF),fk]]){ctx.beginPath();ctx.ellipse(q[0],q[1]+0.005*hh,0.098*hh*f,0.092*hh,0,0,TAU);ctx.fill();ctx.stroke();}
    // the bridge, and the arms back to the ears: the far one comes into view as the head turns
    const a=at(F.eyeN),b=at(F.eyeF),te=H.ear?0.415:0.3,t0=T1([-0.2,-0.04],[-te,-0.03]),t1=T1([0.29+0.098*0.82,-0.03],[te,-0.03]);   // the arms end at the ears, or where the hair covers themctx.beginPath();ctx.moveTo(a[0]+0.098*hh,a[1]);ctx.lineTo(b[0]-0.098*fk*hh,b[1]);ctx.moveTo(a[0]-0.098*hh,a[1]-0.01*hh);ctx.lineTo(t0[0]*hh,t0[1]*hh);
    if(tn){ctx.moveTo(b[0]+0.098*fk*hh,b[1]-0.01*hh);ctx.lineTo(t1[0]*hh,t1[1]*hh);}ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the body */
function hand(ctx,P,J,W,deg,kind,far){const S=K.S,r=J.p.hand*J.u*0.52,c=polar(W,deg,r*0.75),sk=far?dk(S.tone(P.skin),0.07):S.tone(P.skin);
  if(kind==="open"||kind==="flat"){const tip=polar(c,deg,r*1.25),th=polar(polar(c,deg,-r*0.2),deg+62,r*(kind==="flat"?0.9:1.25));S.fill(ctx,cc=>{capsule(cc,polar(c,deg,-r*0.5),tip,r*0.98,r*0.8);capsule(cc,c,th,r*0.46,r*0.3);},sk,{w:0.8});
    if(kind==="open")S.line(ctx,cc=>{for(const k of [-0.34,0,0.34]){const a=polar(polar(c,deg,r*0.95),deg+90,r*k*1.5),b=polar(a,deg,r*0.75);cc.moveTo(a[0],a[1]);cc.lineTo(b[0],b[1]);}},null,0.42);return;}
  // a hand at rest hangs open: a long mitten, the thumb lying along its front (a round hand with the thumb out is a fist)
  if(kind==="rest"){const m=polar(W,deg,r*0.98),t0=polar(polar(m,deg,-r*0.62),deg+90,r*0.5),t1=polar(t0,deg+24,r*0.95);
    S.fill(ctx,cc=>{ell(cc,m[0],m[1],r*0.82,r*1.36,-rad(deg));capsule(cc,t0,t1,r*0.4,r*0.28);},sk,{w:0.8});return;}
  S.fill(ctx,cc=>{ell(cc,c[0],c[1],r*0.92,r*1.16,-rad(deg));
    if(kind==="point"){const tip=polar(c,deg,r*1.9);capsule(cc,c,tip,r*0.42,r*0.3);}
    else{const th=polar(c,deg+95,r*(kind==="grip"?0.7:0.95));capsule(cc,c,th,r*0.5,r*0.34);}},sk,{w:0.8});}
function arm(ctx,P,J,far,o){const S=K.S,p=J.p,u=J.u,sh=far?J.shF:J.shN,e=far?J.eF:J.eN,w=far?J.wF:J.wN,a=far?J.aF:J.aN,top=S.tone(P.top.c),col=far?dk(top,S.id==="line"?0.05:0.1):(S.id==="soft"?lt(top,0.07):top);
  const short=P.top.sleeve==="short",r=[p.arm[0]*u/2,p.arm[1]*u/2,p.arm[2]*u/2],sk=far?dk(S.tone(P.skin),0.07):S.tone(P.skin);
  if(o.under)o.under(ctx,far?J.hdF:J.hdN,a[1],J);
  if(short){S.fill(ctx,c=>{capsule(c,e,w,r[1]*0.9,r[2]*0.92);},sk,{w:0.8});S.fill(ctx,c=>{capsule(c,sh,polar(sh,a[0],p.uarm*u*0.62),r[0],r[1]*1.06);},col,{});}
  else S.fill(ctx,c=>{capsule(c,sh,e,r[0],r[1]);capsule(c,e,w,r[1],r[2]);},col,{});
  hand(ctx,P,J,w,a[1],a[2]||"rest",far);
  if(!short)S.line(ctx,c=>{const q=polar(w,a[1],-4*u),n=[Math.cos(rad(a[1])),-Math.sin(rad(a[1]))];c.moveTo(q[0]-n[0]*r[2],q[1]-n[1]*r[2]);c.lineTo(q[0]+n[0]*r[2],q[1]+n[1]*r[2]);},null,0.6);}
function shoe(ctx,P,J,A,deg,far){const S=K.S,p=J.p,u=J.u,L=p.foot*u,hgt=p.ankle*u,col=far?dk(S.tone(P.shoe),0.1):S.tone(P.shoe);
  // a foot that points at us is seen short: its length shrinks about the ankle as the person turns to the front
  const k=J.k==null?1:J.k,f=lerp(0.46,1,k),X=v=>(v-0.18)*f*L+0.18*L*k;
  ctx.save();ctx.translate(A[0],A[1]);ctx.rotate(rad(scr(deg||0,k)));
  S.poly(ctx,[[X(-0.3),-0.2*hgt],[X(-0.34),hgt*0.62],[X(-0.28),hgt,1],[X(0.62),hgt,1],[X(0.7),hgt*0.66],[X(0.5),hgt*0.14],[X(0.18),-0.3*hgt],[X(-0.04),-0.42*hgt]],col,{seed:3,exact:true});
  ctx.restore();}
function leg(ctx,P,J,far,o){const S=K.S,p=J.p,u=J.u,h=far?J.hF:J.hN,k=far?J.kF:J.kN,n=far?J.nF:J.nN,b=P.bottom||{kind:"trousers",c:[70,70,84]},skirt=b.kind==="skirt"||b.kind==="long";
  const r=[p.leg[0]*u/2,p.leg[1]*u/2,p.leg[2]*u/2],col=far?dk(S.tone(b.c),S.id==="line"?0.06:0.11):S.tone(b.c),sk=far?dk(S.tone(P.skin),0.08):S.tone(P.skin);
  shoe(ctx,P,J,n,far?o.pose.fF:o.pose.fN,far);
  if(skirt)S.fill(ctx,c=>{capsule(c,k,n,r[1]*0.82,r[2]*0.86);},sk,{w:0.8});
  else S.fill(ctx,c=>{capsule(c,h,k,r[0],r[1]);capsule(c,k,n,r[1],r[2]*1.06);},col,{});}
// a skirt: one piece of cloth round both thighs, down to its hem; standing or walking it hangs from the hips and swings with the legs
function skirt(ctx,P,J,o){const S=K.S,p=J.p,u=J.u,b=P.bottom,long=b.kind==="long",t=long?0.86:0.16,col=S.tone(b.c),r0=p.leg[0]*u*0.56,r1=p.leg[1]*u*(long?0.9:0.78),r2=p.leg[1]*u*(long?1.0:0.86);
  const hemN=[lerp(J.kN[0],J.nN[0],t),lerp(J.kN[1],J.nN[1],t)],hemF=[lerp(J.kF[0],J.nF[0],t),lerp(J.kF[1],J.nF[1],t)],w=[J.hip[0],J.hip[1]-p.leg[0]*u*0.3],g=S.shade?{grad:[J.hip[0]+60*u,J.hip[1],J.hip[0]-90*u,hemN[1],0.12],seed:17,exact:true}:{seed:17,exact:true};
  if(J.mode==="stand"&&Math.abs(o.pose.lN[0])<60&&Math.abs(o.pose.lF[0])<60){const hw=p.tor[2]*u/2,y=Math.max(hemN[1],hemF[1])+r2*0.5,kb=Math.min(J.kN[0],J.kF[0]),kf=Math.max(J.kN[0],J.kF[0]),
      xb=Math.min(hemN[0],hemF[0],kb)-r2*(long?0.85:1.2)-8*u,xf=Math.max(hemN[0],hemF[0],kf)+r2*(long?0.85:1.2)+8*u,y0=J.hip[1]-14*u;
    S.poly(ctx,[[J.hip[0]-hw*0.98,y0,1],[lerp(J.hip[0]-hw,xb,0.6)-6*u,lerp(y0,y,0.5)],[xb,y,1],[(xb+xf)/2,y+5*u],[xf,y,1],[lerp(J.hip[0]+hw,xf,0.6)+6*u,lerp(y0,y,0.5)],[J.hip[0]+hw,y0,1]],col,g);
    S.line(ctx,c=>{for(const f of [0.3,0.55,0.78]){const a=[J.hip[0]+lerp(-hw,hw,f),y0+26*u],q=[lerp(xb,xf,f),y-4*u];c.moveTo(a[0],a[1]);c.quadraticCurveTo((a[0]+q[0])/2+5*u,(a[1]+q[1])/2,q[0],q[1]);}},null,0.5);return;}
  S.fill(ctx,c=>{capsule(c,J.hN,J.kN,r0,r1);capsule(c,J.hF,J.kF,r0,r1);capsule(c,J.kN,hemN,r1,r2);capsule(c,J.kF,hemF,r1,r2);
    pg(c,[J.hN,J.kN,[hemN[0],hemN[1]+r2*0.6],[hemF[0],hemF[1]+r2*0.6],J.kF,J.hF]);ell(c,w[0],w[1],p.tor[2]*u*0.5*lerp(1,0.78,J.side||0),p.leg[0]*u*0.5);},col,g);}
function torso(ctx,P,J,o){const S=K.S,p=J.p,u=J.u,T=p.torso*u,pr=J.side||0,sw=p.tor[0]*u/2*lerp(1,0.6,pr),ww=p.tor[1]*u/2*lerp(1,0.72,pr),hw=p.tor[2]*u/2*lerp(1,0.7,pr),nw=p.head*u*0.16,top=S.tone(P.top.c);
  ctx.save();ctx.translate(J.hip[0],J.hip[1]);ctx.rotate(J.le);   // y up the back is -y here
  // from the side the chest comes forward a little (ch) and the back is flatter
  // and the hem's corners are cut off (d), most of all at the back, where someone sits
  const ch=pr*0.12*sw,d=pr*0.14*T,hem=lerp(0.08,0.05,pr)*T,k=1-pr,pts=[[-hw+d*0.9,hem,k],[-hw,hem-d,k],[-ww,-0.42*T],[-sw+ch*0.5,-0.8*T],[-sw*0.88+ch*0.5,-0.95*T],[-sw*0.5,-1.02*T],[-nw,-1.045*T],[nw*1.3,-1.04*T],[sw*0.5+ch,-1.0*T],[sw*0.84+ch,-0.9*T],[sw*0.96+ch*1.5,-0.7*T],[ww*1.06+ch,-0.4*T],[hw*1.02,hem-d*0.6,k],[hw*1.02-d*0.6,hem,k]];
  S.poly(ctx,pts,top,S.shade?{grad:[sw,-T,-sw,0.1*T,0.15],seed:11,exact:true}:{seed:11,exact:true});
  // what is on the front of the top moves to the front edge as the body turns, and stays inside the top
  const tk=J.k==null?1:J.k,cx=lerp(sw*0.2,sw*0.8,pr)*tk;ctx.save();ctx.beginPath();spline(ctx,pts);ctx.clip();
  if(P.top.kind==="jacket"){const inn=S.tone(P.top.inner||[240,236,226]);
    S.fill(ctx,c=>pg(c,[[cx-nw*1.2,-1.04*T],[cx+nw*1.1,-1.04*T],[cx+nw*0.2,-0.66*T]]),inn,{w:0.7,flat:true});
    S.line(ctx,c=>{c.moveTo(cx+nw*0.2,-0.66*T);c.lineTo(cx+nw*0.1,0.07*T);c.moveTo(cx-nw*1.2,-1.04*T);c.lineTo(cx-nw*1.9,-0.84*T);c.lineTo(cx-nw*0.5,-0.8*T);c.moveTo(cx+nw*1.1,-1.04*T);c.lineTo(cx+nw*1.7,-0.86*T);c.lineTo(cx+nw*0.75,-0.82*T);},null,0.55);
    if(u>0.2){ctx.fillStyle=css(S.id==="line"?(S.self?dk(top,0.45):S.ink):dk(top,0.35));for(const f of [-0.42,-0.22]){ctx.beginPath();ctx.arc(cx+nw*lerp(0.75,0.5,pr)*tk,f*T,Math.max(1.2,5*u),0,TAU);ctx.fill();}}}
  else{const band=dk(top,0.12);S.fill(ctx,c=>{c.moveTo(-nw*1.25,-1.035*T);c.quadraticCurveTo(cx*0.6,-0.93*T,nw*1.6,-1.03*T);c.quadraticCurveTo(cx*0.6,-0.985*T,-nw*1.25,-1.035*T);c.closePath();},S.id==="line"?top:band,{w:0.6,flat:true});
    S.line(ctx,c=>{c.moveTo(-hw*0.96,hem-0.06*T);c.lineTo(hw*0.98,hem-0.06*T);},null,0.5);}
  ctx.restore();ctx.restore();}
// where the joints are in the frame, whichever way the person faces
const facing=(J,x,sg)=>{if(sg<0)for(const j in J)if(Array.isArray(J[j])&&J[j].length===2&&typeof J[j][0]==="number")J[j]=[2*x-J[j][0],J[j][1]];J.sgn=sg;return J;};
function draw(ctx,P,x,floor,h,pose,o){const S=K.S,t=o.t||0,id=seedOf(P);
  const br=Math.sin(t*(1.5+0.4*hash(id,9))+id)*0.9;                     // breath: the chest and head rise a little, each to their own time
  if(o.blink==null){const k=(t*(0.24+0.14*hash(id,8))+hash(id,3))%1;o.blink=k>0.965?1:0;}
  const tu=turnOf(o),mir=tu.sg<0;o.sgn=tu.sg;
  ctx.save();if(mir){ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);}
  const J=rig(P,pose,x,floor,h,o),u=J.u,p=J.p;S.begin(ctx,{lw:clamp(h*0.0056,1.4,6.5),sh:clamp(h*0.0078,1.5,8.5),far:o.far||0});
  const lower=o.part!=="upper",upper=o.part!=="lower";
  if(lower&&o.shade!==0&&S.id!=="paper"){const m=J.mode,cx=m==="sit"?J.hip[0]:(J.nN[0]+J.nF[0])/2+(m==="kneel"?-40*u:20*u)*J.k,w=m==="kneel"?230*u:m==="sit"?170*u:150*u;
    ctx.fillStyle=S.id==="line"?"rgba(60,44,70,0.16)":"rgba(70,48,56,0.14)";ctx.beginPath();ctx.ellipse(cx+(o.sun||30)*u,floor+2*u,w,w*0.16,0,0,TAU);ctx.fill();}
  const sk=P.bottom&&(P.bottom.kind==="skirt"||P.bottom.kind==="long");
  J.sc[1]-=br*u;J.shN[1]-=br*u;J.shF[1]-=br*u;J.hc[1]-=br*1.2*u;J.nb[1]-=br*u;
  if(upper&&HAIR[P.hair.style]&&HAIR[P.hair.style].back){const hh=p.head*u,H=HAIR[P.hair.style],bk=J.k<1&&H.backT?H.backT[0].map((q,i)=>[lerp(H.backT[1][i][0],q[0],J.k),lerp(H.backT[1][i][1],q[1],J.k)]):H.back;
    ctx.save();ctx.translate(J.hc[0],J.hc[1]);ctx.rotate(J.ha);S.poly(ctx,bk.map(q=>[q[0]*hh,q[1]*hh]),dk(S.tone(P.hair.c),0.08),{seed:21});ctx.restore();}
  if(upper)arm(ctx,P,J,true,{pose,under:o.underF});
  if(lower){leg(ctx,P,J,true,o);leg(ctx,P,J,false,o);if(sk)skirt(ctx,P,J,o);}
  if(upper){
    // the neck, then the top over it
    const nk=[J.nb[0]-Math.sin(J.le)*12*u,J.nb[1]+Math.cos(J.le)*12*u],nt=[lerp(J.nb[0],J.hc[0],0.62),lerp(J.nb[1],J.hc[1],0.62)];
    S.fill(ctx,c=>capsule(c,nk,nt,p.head*u*0.165,p.head*u*0.15),dk(S.tone(P.skin),0.09),{w:0.8,flat:true});
    torso(ctx,P,J,o);
    // a thigh that rises past the level of the hips (a crouch) lies along the near side of the body: it is drawn over the top
    const ov=lower?(o.legOver!=null?o.legOver:J.side*clamp((pose.lN[0]-92)/14,0,1)):0;
    if(ov>0){ctx.save();ctx.globalAlpha*=ov;if(sk)skirt(ctx,P,J,o);else leg(ctx,P,J,false,o);ctx.restore();}
    head(ctx,P,J,o);arm(ctx,P,J,false,{pose,under:o.under});
    if(o.hold)o.hold(ctx,J.hdN,J.aN[1],J);}
  ctx.restore();
  return facing(J,x,tu.sg);}
K.person=(ctx,who,x,floor,h,pose,o)=>{o=Object.assign({},o||{});const P=typeof who==="string"?K.CAST[who]:who;if(!P)throw new Error("PK.person: nobody called "+who);
  pose=poseOf(pose||"stand");if(typeof o.expr==="string")o.expr=K.EXPR[o.expr];const given=pose,gz=o.gaze||[0,0];pose=alive(P,pose,o);o.pose=pose;
  // what the kit's checks follow about everyone a film draws (tools/people.py sets PK.watch)
  const seen=J=>{if(K.watch)K.watch({who:typeof who==="string"?who:(P.key||P.name||"someone"),kid:!!P.kid,x,floor,h,flip:o.flip===true?1:(o.flip||0),part:o.part||"whole",mode:pose.mode||"stand",
      // the pose, the face and the eyes as the film gives them, before the kit's own life (a settle, a glance): what was staged
      pose:[given.lean||0,given.head||0,given.aN[0],given.aN[1],given.aF[0],given.aF[1],given.lN[0],given.lN[1],given.lF[0],given.lF[1]],
      reach:[o.reachN?(o.reachNk==null?1:o.reachNk):pose.clasp||0,o.reachF?(o.reachFk==null?1:o.reachFk):pose.clasp||0],hold:!!(o.hold||o.under||o.underF||o.holds),
      at:[o.reachN?o.reachN[0]:0,o.reachN?o.reachN[1]:0,o.reachF?o.reachF[0]:0,o.reachF?o.reachF[1]:0],
      expr:o.expr?[o.expr.brow||0,o.expr.smile||0,o.expr.open||0]:[0,0.3,0],gaze:gz,nod:o.nod||0,live:o.t!=null&&o.life!==0,busy:!!o.busy,a:o.a==null?1:o.a,hc:J.hc,hh:J.p.head*J.u,ctx});return J;};
  if(o.a!=null&&o.a<0.999){if(o.a<=0.004)return facing(rig(P,pose,x,floor,h,o),x,turnOf(o).sg);
    const cv=ctx.canvas,[bc,bx]=ag_buf("pkFade",cv.width,cv.height);bx.setTransform(ctx.getTransform());const J=draw(bx,P,x,floor,h,pose,o);
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=o.a;ctx.drawImage(bc,0,0);ctx.restore();return seen(J);}
  return seen(draw(ctx,P,x,floor,h,pose,o));};
K.rig=(who,x,floor,h,pose,o)=>{o=Object.assign({},o||{});const P=typeof who==="string"?K.CAST[who]:who;return facing(rig(P,alive(P,poseOf(pose||"stand"),o),x,floor,h,o),x,turnOf(o).sg);};
/* a walk from w.x0 to w.x1 between w.t0 and w.t1, the stride dying away as they stop; before it w.before, after it w.then */
K.walkAt=(t,w)=>{const u=clamp((t-w.t0)/(w.t1-w.t0),0,1),k=0.16,s=u<k?u*u/(2*k*(1-k)):u>1-k?1-(1-u)*(1-u)/(2*k*(1-k)):(u-k/2)/(1-k),x=lerp(w.x0,w.x1,s),
    fl=typeof w.floor==="function"?w.floor(x):w.floor,h=typeof w.h==="function"?w.h(fl):w.h,go=clamp(Math.min(u/k,(1-u)/k),0,1);
  return{x,floor:fl,h,go:sine(go),step:Math.abs(x-w.x0)/K.strideOf(h,w.amp)+(w.phase||0),left:w.flip!=null?w.flip:w.x1<w.x0,u};};
K.walk=(ctx,who,t,w,o)=>{const P=typeof who==="string"?K.CAST[who]:who,amp=w.amp||K.ampOf(P),q=K.walkAt(t,w.amp?w:Object.assign({},w,{amp})),carry=p=>w.arms?Object.assign({},p,{aN:w.arms.aN||p.aN,aF:w.arms.aF||p.aF},w.arms.lean!=null?{lean:w.arms.lean}:{}):p;
  // the stride grows out of the stance they set off from (w.before) and dies into the one they stop in (w.then): never by way of a
  // plain stand between two stances, and never switched to
  const st=carry(K.POSES.stand),pose=K.poseMix(q.u<0.5?(w.before||st):(w.then||st),carry(K.poseWalk(q.step,1,amp)),q.go);
  const J=K.person(ctx,who,q.x,q.floor,q.h,pose,Object.assign({t,flip:q.left,life:1-0.8*q.go},o||{}));J.at=q;return J;};
})(PK);

/* ===== The people kit: things =====
   What people sit at, hold and work with, drawn by the look in use. Sizes in the frame's px; k scales a thing.
     PK.PAL                          the kit's colours for places and things (PK.col(name, i) is one of them, toned by the look)
     PK.chair(ctx, x, floor, h, flip, o)   a chair for someone h tall whose hips are at x; flip: they face left, or a number from 0
                                     to 1: the chair turns round with them, through the front. o.col; o.swivel: an office chair
                                     on a column and a star of castors, which is the chair that turns
     PK.table(ctx, x, y, rx, floor)  a round table: its top at y, its foot on the floor
     PK.desk(ctx, x, y, w, floor, o) a desk seen from its long side: its top at y, w wide. o.col, o.panel (a modesty panel)
     PK.laptop(ctx, x, y, o)         a laptop on a top at y, seen from the side, open towards o.flip ? left : right; o.k
     PK.monitor(ctx, x, y, w, h, o)  a screen on a stand, facing us; o.draw(ctx, x, y, w, h) draws what it shows
     PK.board(ctx, x, y, w, h, o)    a whiteboard on a wall; o.pin: a pinboard instead
     PK.sheet(ctx, x, y, w, h, o)    a sheet of paper or a note; o.rot, o.col, o.pin
     PK.mug(ctx, x, y, k, col, t, steam), PK.pot(ctx, x, y, w, h), PK.plant(ctx, x, y, k, seed, t)
     PK.clock(ctx, x, y, r, hours)   a wall clock showing a time, such as 7.0 or 8.17 (null: its face, without hands)
     PK.door(ctx, x, y, w, h, o)     a door in a wall, its foot at y; o.open 0 to 1, o.col, o.glass
     PK.seedling(ctx, x, y, k, g)    a seedling in the ground, grown to g (0 to 1); PK.potted(ctx, x, y, k, g) in a small pot
     PK.tree(ctx, x, y, k, seed, o)  a tree with a round crown, its foot at (x, y); o.col, o.far
     PK.cloud(ctx, x, y, k)
     PK.tick(ctx, x, y, r, a, col)   a round mark with a tick: something done, or still alive */
(K=>{
const {TAU,rad,lerp,clamp,mix,dk,lt,css,rnd,hash,polar,pg,spline,capsule,rrect,ell}=K.u;
K.PAL={skyTop:[168,204,226],skyLow:[250,238,212],cloud:[255,251,242],
  wall:[240,226,206],wallCool:[226,228,222],floor:[184,132,98],floorDk:[158,108,80],skirting:[250,244,232],
  wood:[212,166,118],woodDk:[172,128,88],frame:[250,244,232],glass:[200,228,236],
  viewTree:[132,176,132],viewTree2:[108,154,120],viewBld:[230,206,180],viewRoof:[196,118,92],lawn:[170,196,128],path:[236,220,190],trunk:[134,100,78],
  rug:[208,126,100],rug2:[236,200,154],plant:[98,152,112],plant2:[128,180,132],pot:[200,114,84],board:[251,247,238],cork:[214,178,134],
  note:[[246,208,114],[152,198,192],[238,154,124],[192,206,144]],book:[[194,94,84],[74,114,144],[222,184,104],[114,154,124],[154,104,134],[232,222,202]],
  mug:[234,124,92],mug2:[112,162,172],laptop:[126,134,146],lamp:[242,204,124],chair:[86,120,128],chair2:[176,120,104],screen:[58,62,76],screenLit:[244,246,240],
  leaf:[104,160,92],soilDk:[164,74,48],brick:[204,132,104],stone:[226,214,196]};
K.col=(n,i)=>K.S.tone(i==null?K.PAL[n]:K.PAL[n][i]);
const C=K.col;

/* A chair, seen from the side. Turned (flip between 0 and 1), it goes round through the front as the person on it does: c is the
   cosine of the turn (1: facing right, 0: facing us, -1: facing left) and k how far it is still seen from the side. The seat keeps
   its width; the back, behind the sitter, crosses from one side to the other and is seen wide from the front; a plain chair's four
   legs go round with it, an office chair's column and star stay where they are. */
K.chair=(ctx,x,floor,h,flip,o)=>{o=o||{};const S=K.S,u=h/1000,seat=K.seatOf(h),y=floor-seat,col=S.tone(o.col||K.PAL.chair),fl=flip===true?1:(flip||0),c=Math.cos(Math.PI*fl),k=Math.abs(c)>0.999?1:Math.abs(c),
    s=Math.sqrt(Math.max(0,1-c*c)),X=v=>x+v*u*c,dkc=dk(col,0.25);
  if(o.swivel){const bw=lerp(112,19,k)*u,st=lerp(60,7,k)*u;
    // the star and its castors, the column, then the back on its stem, then the seat
    S.fill(ctx,c2=>{for(const q of [-118,0,118])ell(c2,x+q*u,floor-15*u,15*u,15*u);},[70,72,84],{w:0.8});
    S.fill(ctx,c2=>rrect(c2,x-132*u,floor-52*u,264*u,22*u,11*u),dkc,{});S.fill(ctx,c2=>rrect(c2,x-15*u,y+24*u,30*u,seat-24*u-44*u,6*u),[92,96,108],{w:0.8});
    S.fill(ctx,c2=>pg(c2,[[X(-128)-st,y+12*u],[X(-128)+st,y+12*u],[X(-142)+st,y-116*u],[X(-142)-st,y-116*u]]),dkc,{w:0.8});
    S.poly(ctx,[[X(-140)-bw,y-104*u],[X(-141)-bw*1.04,y-220*u],[X(-150)-bw*1.02,y-316*u],[X(-152),y-336*u],[X(-150)+bw*1.02,y-316*u],[X(-141)+bw*1.04,y-220*u],[X(-140)+bw,y-104*u],[X(-140),y-96*u]],col,S.shade?{grad:[x+100*u,0,x-170*u,0,0.14],exact:true}:{exact:true});
    S.fill(ctx,c2=>rrect(c2,X(-9)-lerp(132,141,k)*u,y-4*u,2*lerp(132,141,k)*u,34*u,15*u),lt(col,0.06),{});return;}
  if(k>=1){ctx.save();if(c<0){ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);}
    S.fill(ctx,c2=>{rrect(c2,x-128*u,y+6*u,22*u,seat-6*u,8*u);rrect(c2,x+92*u,y+6*u,22*u,seat-6*u,8*u);},dkc,{});
    S.fill(ctx,c2=>{c2.moveTo(x-140*u,y-330*u);c2.quadraticCurveTo(x-166*u,y-336*u,x-170*u,y-300*u);c2.lineTo(x-140*u,y+8*u);c2.lineTo(x-104*u,y+8*u);c2.lineTo(x-122*u,y-310*u);c2.quadraticCurveTo(x-124*u,y-330*u,x-140*u,y-330*u);c2.closePath();},col,S.shade?{grad:[x-100*u,0,x-170*u,0,0.14]}:{});
    S.fill(ctx,c2=>rrect(c2,x-150*u,y-4*u,282*u,34*u,15*u),lt(col,0.06),{});ctx.restore();return;}
  // turning: the four legs, the far pair first; the back, wide as it faces us; the seat
  const legs=[[-117,-1],[103,-1],[-117,1],[103,1]].map(([d,e])=>x+d*u*c+e*104*u*s),bb=lerp(118,18,k)*u,bt=lerp(124,24,k)*u,sw=lerp(128,141,k)*u;
  S.fill(ctx,c2=>{for(const q of legs)rrect(c2,q-11*u,y+6*u,22*u,seat-6*u,8*u);},dkc,{});
  S.poly(ctx,[[X(-122)-bb,y+8*u,1],[X(-140)-bt,y-300*u],[X(-146)-bt*0.86,y-328*u],[X(-146)+bt*0.86,y-328*u],[X(-140)+bt,y-300*u],[X(-122)+bb,y+8*u,1]],col,S.shade?{grad:[x+100*u,0,x-170*u,0,0.14],exact:true}:{exact:true});
  S.fill(ctx,c2=>rrect(c2,X(-9)-sw,y-4*u,2*sw,34*u,15*u),lt(col,0.06),{});};
K.table=(ctx,x,y,rx,floor)=>{const S=K.S,col=C("wood");S.fill(ctx,c=>ell(c,x,floor-24,150,22),dk(col,0.2),{});S.fill(ctx,c=>rrect(c,x-22,y+10,44,floor-y-34,8),dk(col,0.14),S.shade?{grad:[x+22,0,x-22,0,0.14]}:{});
  S.fill(ctx,c=>{ell(c,x,y+16,rx,34);rrect(c,x-rx,y,rx*2,16,0);},dk(col,0.1),{});S.fill(ctx,c=>ell(c,x,y,rx,34),col,S.shade?{grad:[x-rx,y-20,x+rx,y+30,0.08]}:{flat:true});};
K.desk=(ctx,x,y,w,floor,o)=>{o=o||{};const S=K.S,col=S.tone(o.col||K.PAL.wood),k=o.k||1,th=18*k,lg=20*k;
  if(o.panel)S.fill(ctx,c=>rrect(c,x-w/2+34*k,y+th,w-68*k,(floor-y)*0.5,4*k),dk(col,0.2),{flat:true});
  S.fill(ctx,c=>{rrect(c,x-w/2+16*k,y+th-2,lg,floor-y-th+2,5*k);rrect(c,x+w/2-16*k-lg,y+th-2,lg,floor-y-th+2,5*k);},dk(col,0.16),S.shade?{grad:[x+w/2,0,x-w/2,0,0.1]}:{});
  S.fill(ctx,c=>rrect(c,x-w/2,y,w,th,7*k),col,S.shade?{grad:[0,y,0,y+th,0.1]}:{});};
K.laptop=(ctx,x,y,o)=>{o=o||{};const S=K.S,k=o.k||1,c0=C("laptop"),f=o.flip?-1:1;
  S.fill(ctx,c=>pg(c,[[x-70*k*f,y],[x+62*k*f,y],[x+62*k*f,y-9*k],[x-70*k*f,y-9*k]]),c0,{});
  S.fill(ctx,c=>pg(c,[[x+56*k*f,y-8*k],[x+66*k*f,y-8*k],[x+104*k*f,y-98*k],[x+94*k*f,y-98*k]]),lt(c0,0.2),{});
  if(o.glow)S.fill(ctx,c=>pg(c,[[x+52*k*f,y-12*k],[x+56*k*f,y-10*k],[x+92*k*f,y-94*k],[x+88*k*f,y-96*k]]),C("screenLit"),{line:false,flat:true});};
K.monitor=(ctx,x,y,w,h,o)=>{o=o||{};const S=K.S,c0=C("screen");S.fill(ctx,c=>{rrect(c,x-w*0.16,y-10,w*0.32,10,4);rrect(c,x-9,y-h*0.34,18,h*0.34,3);},dk(c0,0.1),{});
  S.fill(ctx,c=>rrect(c,x-w/2,y-h-h*0.2,w,h,10),c0,{});S.fill(ctx,c=>rrect(c,x-w/2+9,y-h-h*0.2+9,w-18,h-18,5),o.lit===false?lt(c0,0.12):C("screenLit"),{line:false,flat:true});
  if(o.draw){ctx.save();ctx.beginPath();ctx.rect(x-w/2+9,y-h-h*0.2+9,w-18,h-18);ctx.clip();o.draw(ctx,x-w/2+9,y-h-h*0.2+9,w-18,h-18);ctx.restore();}};
K.board=(ctx,x,y,w,h,o)=>{o=o||{};const S=K.S;S.fill(ctx,c=>rrect(c,x-10,y-10,w+20,h+20,8),o.pin?dk(C("wood"),0.05):C("frame"),{});
  S.fill(ctx,c=>rrect(c,x,y,w,h,3),o.pin?C("cork"):C("board"),{line:false,flat:true});if(!o.pin)S.fill(ctx,c=>rrect(c,x+w*0.3,y+h+6,w*0.4,12,4),dk(C("frame"),0.12),{w:0.6});};
K.sheet=(ctx,x,y,w,h,o)=>{o=o||{};const S=K.S;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);S.fill(ctx,c=>rrect(c,-w/2,-h/2,w,h,o.r==null?3:o.r),o.col||C("board"),{w:0.6,sa:0.2});
  if(o.pin){ctx.fillStyle=css(o.pin);ctx.beginPath();ctx.arc(0,-h/2+10,5,0,TAU);ctx.fill();}ctx.restore();};
K.mug=(ctx,x,y,k,col,t,steam)=>{const S=K.S;S.fill(ctx,c=>{c.moveTo(x+26*k,y-40*k);c.arc(x+30*k,y-28*k,16*k,-1.3,1.3);c.arc(x+30*k,y-28*k,8*k,1.3,-1.3,true);c.closePath();},col,{w:0.7});
  S.fill(ctx,c=>rrect(c,x-26*k,y-56*k,54*k,56*k,9*k),col,S.shade?{grad:[x+28*k,0,x-26*k,0,0.16]}:{});
  if(steam){ctx.save();ctx.strokeStyle="rgba(255,255,255,0.75)";ctx.lineWidth=4*k;ctx.lineCap="round";for(let i=0;i<2;i++){const ph=((t||0)*0.45+i*0.5)%1,xx=x+(i-0.5)*16*k,yy=y-62*k-ph*54*k;ctx.globalAlpha=Math.sin(ph*Math.PI)*0.8;ctx.beginPath();ctx.moveTo(xx,yy);ctx.bezierCurveTo(xx+9*k,yy-10*k,xx-9*k,yy-20*k,xx+2*k,yy-32*k);ctx.stroke();}ctx.restore();}};
K.pot=(ctx,x,y,w,h,col)=>{const S=K.S,c0=col||C("pot");S.poly(ctx,[[x-w/2,y-h,1],[x+w/2,y-h,1],[x+w*0.36,y,1],[x-w*0.36,y,1]],c0,S.shade?{grad:[x+w/2,0,x-w/2,0,0.18],exact:true}:{exact:true});
  S.fill(ctx,c=>rrect(c,x-w*0.56,y-h-w*0.11,w*1.12,w*0.2,w*0.06),lt(c0,0.1),{});};
K.plant=(ctx,x,y,k,seed,t)=>{const S=K.S,R=rnd(seed),sw=Math.sin((t||0)*0.9+seed)*0.02;
  for(let i=0;i<9;i++){const a=-1.25+i*0.31+(R()-0.5)*0.16+sw*(i-4),l=(120+R()*90)*k,bx=x+(i-4)*3*k,ex=bx+Math.sin(a)*l,ey=y-Math.cos(a)*l*(0.9+0.2*R()),w=(15+R()*9)*k,nx=Math.cos(a)*w,ny=Math.sin(a)*w;
    S.fill(ctx,c=>{c.moveTo(bx,y);c.quadraticCurveTo((bx+ex)/2-nx,(y+ey)/2-ny,ex,ey);c.quadraticCurveTo((bx+ex)/2+nx,(y+ey)/2+ny,bx,y);c.closePath();},i%2?C("plant"):C("plant2"),{w:0.6,sa:0.16});
    S.line(ctx,c=>{c.moveTo(bx,y);c.quadraticCurveTo((bx+ex)/2,(y+ey)/2,ex,ey);},null,0.35);}};
K.clock=(ctx,x,y,r,hours)=>{const S=K.S;S.fill(ctx,c=>ell(c,x,y,r,r),C("frame"),{});S.fill(ctx,c=>ell(c,x,y,r*0.84,r*0.84),lt(C("board"),0.3),{line:false,flat:true});
  ctx.save();ctx.strokeStyle=css(dk(C("frame"),0.45));ctx.lineCap="round";ctx.lineWidth=Math.max(1.5,r*0.05);ctx.beginPath();for(let i=0;i<12;i++){const a=i*TAU/12;ctx.moveTo(x+Math.sin(a)*r*0.7,y-Math.cos(a)*r*0.7);ctx.lineTo(x+Math.sin(a)*r*0.78,y-Math.cos(a)*r*0.78);}ctx.stroke();
  if(hours==null||hours!==hours){ctx.restore();return;}
  const hh=hours%12,ah=hh/12*TAU,am=(hours%1)*TAU;ctx.strokeStyle=css(K.C.ink);ctx.lineWidth=Math.max(2,r*0.09);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(ah)*r*0.42,y-Math.cos(ah)*r*0.42);ctx.stroke();
  ctx.lineWidth=Math.max(1.6,r*0.06);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(am)*r*0.64,y-Math.cos(am)*r*0.64);ctx.stroke();ctx.restore();};
K.door=(ctx,x,y,w,h,o)=>{o=o||{};const S=K.S,col=S.tone(o.col||K.PAL.wood),op=clamp(o.open||0,0,1);
  S.fill(ctx,c=>rrect(c,x-w/2-12,y-h-12,w+24,h+12,4),C("frame"),{});
  S.fill(ctx,c=>rrect(c,x-w/2,y-h,w,h,2),o.beyond||dk(C("wall"),0.3),{line:false,flat:true});
  const dw=w*(1-0.72*op);S.fill(ctx,c=>pg(c,[[x-w/2,y-h],[x-w/2+dw,y-h+op*16],[x-w/2+dw,y-op*10],[x-w/2,y]]),col,S.shade?{grad:[x-w/2,0,x-w/2+dw,0,0.1]}:{});
  if(o.glass)S.fill(ctx,c=>pg(c,[[x-w/2+dw*0.2,y-h*0.86],[x-w/2+dw*0.8,y-h*0.86+op*10],[x-w/2+dw*0.8,y-h*0.5+op*4],[x-w/2+dw*0.2,y-h*0.5]]),C("glass"),{w:0.6,flat:true});
  ctx.fillStyle=css(dk(col,0.5));ctx.beginPath();ctx.arc(x-w/2+dw*0.86,y-h*0.46,Math.max(3,w*0.035),0,TAU);ctx.fill();};
K.seedling=(ctx,x,y,k,g,o)=>{o=o||{};g=g==null?1:g;const S=K.S,lf=o.col||C("leaf");
  S.fill(ctx,c=>{pg(c,[[x-3*k,y],[x+3*k,y],[x+2*k,y-46*k*g],[x-1*k,y-46*k*g]]);},dk(lf,0.2),{w:0.5,flat:true});
  for(const [dy,a,l] of [[-14,-1,22],[-22,1,24],[-32,-1,20],[-40,1,18],[-46,0,16]]){const bx=x+0.5*k,by=y+dy*k*g,ex=bx+a*l*k*g,ey=by-(a?10:18)*k*g;
    S.fill(ctx,c=>{c.moveTo(bx,by);c.quadraticCurveTo((bx+ex)/2+a*2*k,by-12*k*g,ex,ey);c.quadraticCurveTo((bx+ex)/2-a*2*k,by+3*k*g,bx,by);c.closePath();},a>0?lf:lt(lf,0.12),{w:0.5,flat:true});}
  if(!o.bare)S.fill(ctx,c=>ell(c,x,y+2*k,16*k,5*k),o.soil||C("soilDk"),{w:0.5,flat:true});};
K.potted=(ctx,x,y,k,g,col)=>{K.seedling(ctx,x,y-30*k,k*0.9,g,{bare:true});K.pot(ctx,x,y,40*k,30*k,col);};
/* a tree: a trunk and a crown of a few rounds; g (0 to 1) is how grown it is */
K.tree=(ctx,x,y,k,seed,o)=>{o=o||{};const S=K.S,R=rnd(seed||1),g=o.g==null?1:o.g,col=o.col||C(R()<0.5?"viewTree":"viewTree2"),th=(150+R()*50)*k*g,r=(84+R()*26)*k*g,tw=Math.max(2,13*k*Math.sqrt(g));
  S.fill(ctx,c=>pg(c,[[x-tw*0.75,y],[x+tw*0.75,y],[x+tw*0.45,y-th],[x-tw*0.45,y-th]]),o.trunk||C("trunk"),{w:0.7,flat:true});
  const cy=y-th-r*0.42;S.fill(ctx,c=>{ell(c,x,cy,r,r*0.84);ell(c,x-r*0.56,cy+r*0.3,r*0.62,r*0.5);ell(c,x+r*0.58,cy+r*0.26,r*0.58,r*0.48);ell(c,x+r*0.1,cy-r*0.46,r*0.6,r*0.46);},col,S.shade?{grad:[x+r,cy-r,x-r,cy+r,0.16],sa:0.14}:{sa:0.14});
  if(!o.far)S.line(ctx,c=>{c.moveTo(x-r*0.5,cy+r*0.1);c.quadraticCurveTo(x-r*0.3,cy+r*0.34,x-r*0.04,cy+r*0.22);c.moveTo(x+r*0.2,cy-r*0.2);c.quadraticCurveTo(x+r*0.42,cy+r*0.02,x+r*0.66,cy-r*0.08);},dk(col,0.3),0.5);};
K.cloud=(ctx,x,y,k)=>{K.S.fill(ctx,c=>{ell(c,x,y,70*k,26*k);ell(c,x+52*k,y+6*k,54*k,20*k);ell(c,x-56*k,y+8*k,48*k,17*k);ell(c,x+6*k,y-16*k,40*k,22*k);},C("cloud"),{sa:0.12});};
K.tick=(ctx,x,y,r,a,col)=>{if(a<=0.004)return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.fillStyle=css(col||K.C.green);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle="#fff";ctx.lineWidth=r*0.26;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-r*0.44,y+r*0.02);ctx.lineTo(x-r*0.12,y+r*0.36);ctx.lineTo(x+r*0.46,y-r*0.32);ctx.stroke();ctx.restore();};
})(PK);

/* ===== The people kit: words on the frame =====
   People carry these films; words hold a place, a name, something said, or one line to keep. Every piece of text is drawn with the
   agent films' ag_T (The Inner Life of Data's T), at 28 px or more, and every box is made from its words as they are drawn, so
   the words can't leave it (site-tools/fits.py). Nothing goes below y 890, where the captions are. a (0 to 1) brings a thing in.
     PK.card(ctx, x, y, d, a, o)        where and when, or a number: d {kick, title, sub, col (the kick's colour)}; its width
                                        comes from its words (o.w sets a wider one); o.align "center" or "right" places it by x
     PK.tag(ctx, x, y, text, a, o)      a few words in a pill, centred on (x, y); o.col its words' colour, o.fill its own
     PK.nameTag(ctx, x, y, name, role, a)   a person's name and role, centred on (x, y): put it over their head
     PK.bubble(ctx, x, y, lines, tail, a, o)  something said: lines of words centred on (x, y), a tail towards tail [x, y] (the
                                        speaker's mouth or head); o.size (34), o.weight, o.ink, o.col, o.strike (a line through it:
                                        what isn't said), o.think (no tail: three small rounds, for a thought), o.la (how far
                                        each line has come in, 0 to 1: lines that come one by one in a box that doesn't change)
     PK.say(ctx, J, lines, a, o)        the same, placed over the head of whoever PK.person returned as J; o.dx, o.dy move it;
                                        o.cam (the shot's camera, draw's third argument) keeps it inside what the camera sees
     PK.kicker(ctx, num, title, a)      the film's number and title, top left, from the second chapter on
     PK.sceneTag(ctx, text, a)          where and when an imagined scene is set, top right ("The university, 2027 · imagined")
     PK.mark(ctx, cx, cy, r, p, a)      the module's mark: five people in a ring, which draws itself as p goes from 0 to 1
     PK.title(ctx, S, t, t0, title, sub, line, o)   the title card, over the picture from t0: the picture's right side stays
                                        clear, so whoever is there stays in view (o.side "right" puts the words there instead)
     PK.end(ctx, S, t, t0, title, line, n, series, o)   the end card, the same way: the film ends on a person, with its last line */
(K=>{
const {TAU,lerp,clamp,sine,pin,mix,dk,lt,css,pg,rrect}=K.u;
const INKC=()=>K.C.ink,tw=(ctx,s,w,size,ls)=>ag_tw(ctx,s,{w,size,ls});
const tx=(ctx,s,x,y,o)=>ag_T(ctx,s,x,y,Object.assign({},o,{color:css(o.col||K.C.ink)}));
// a card's body, by the look in use: a soft shadow, a hard one under an ink line, or a cut sheet
K.box=(ctx,x,y,w,h,r,col,a)=>{const S=K.S;if(K.watch)K.watch({box:[x,y,w,h],a:a==null?1:a,ctx});ctx.save();ctx.globalAlpha*=a==null?1:a;
  if(S.id==="line"){ctx.fillStyle=css(S.self?dk(S.ink,0.1):S.ink,S.self?0.34:0.9);ctx.beginPath();rrect(ctx,x+4,y+6,w,h,r);ctx.fill();ctx.beginPath();rrect(ctx,x,y,w,h,r);ctx.fillStyle=css(col);ctx.fill();ctx.lineWidth=S.self?2.5:3;ctx.strokeStyle=css(S.ink);ctx.stroke();}
  else if(S.id==="paper"){ctx.fillStyle="rgba(58,36,30,0.26)";ctx.beginPath();rrect(ctx,x+4,y+6,w,h,r*0.5);ctx.fill();ctx.beginPath();rrect(ctx,x,y,w,h,r*0.5);ctx.fillStyle=css(col);ctx.fill();}
  else{for(let i=3;i>=1;i--){ctx.fillStyle="rgba(70,44,40,0.05)";ctx.beginPath();rrect(ctx,x-i*2,y+4+i*3,w+i*4,h,r+i*2);ctx.fill();}ctx.beginPath();rrect(ctx,x,y,w,h,r);ctx.fillStyle=css(col);ctx.fill();}
  ctx.restore();};
const settle=(ctx,x,y,a)=>{const k=0.94+0.06*a;ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);};
K.card=(ctx,x,y,d,a,o)=>{o=o||{};a=a==null?1:a;const kick=d.kick?String(d.kick).toUpperCase():"",wk=kick?tw(ctx,kick,800,28,3):0,wt=d.title?tw(ctx,d.title,800,d.size||40):0,ws=d.sub?tw(ctx,d.sub,600,30):0,
    w=Math.max(o.w||0,Math.max(wk,wt,ws)+64),h=28+(kick?44:0)+(d.title?52:0)+(d.sub?44:0)+12,bx=o.align==="center"?x-w/2:o.align==="right"?x-w:x,bb={x:bx,y,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;settle(ctx,bx+w/2,y+h/2,a);K.box(ctx,bx,y,w,h,K.S.id==="soft"?22:16,K.col("board"),1);
  let ty=y+28;if(kick){ty+=24;tx(ctx,kick,bx+32,ty,{w:800,size:28,ls:3,col:d.col||K.C.amber});ty+=20;}
  if(d.title){ty+=38;tx(ctx,d.title,bx+32,ty,{w:800,size:d.size||40});ty+=14;}
  if(d.sub){ty+=32;tx(ctx,d.sub,bx+32,ty,{w:600,size:30,col:K.C.mut});}
  ctx.restore();return bb;};
K.tag=(ctx,x,y,text,a,o)=>{o=o||{};a=a==null?1:a;const size=o.size||28,w=tw(ctx,text,o.weight||700,size)+48,h=size+26,bx=o.align==="left"?x:o.align==="right"?x-w:x-w/2,bb={x:bx,y:y-h/2,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;settle(ctx,bx+w/2,y,a);K.box(ctx,bx,y-h/2,w,h,h/2,o.fill||K.col("board"),1);
  tx(ctx,text,bx+w/2,y+size*0.35,{w:o.weight||700,size,align:"center",col:o.col||K.C.ink});ctx.restore();return bb;};
K.nameTag=(ctx,x,y,name,role,a)=>{a=a==null?1:a;const w=Math.max(tw(ctx,name,800,30),role?tw(ctx,role,600,28):0)+52,h=role?96:58,bb={x:x-w/2,y:y-h/2,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;settle(ctx,x,y,a);K.box(ctx,x-w/2,y-h/2,w,h,K.S.id==="soft"?20:14,K.col("board"),1);
  tx(ctx,name,x,role?y-8:y+11,{w:800,size:30,align:"center"});if(role)tx(ctx,role,x,y+29,{w:600,size:28,align:"center",col:dk(K.C.mut,0.2)});ctx.restore();return bb;};
/* something said. The bubble's body is a box of its own, made from its lines; its tail is drawn first, under it */
K.bubble=(ctx,x,y,lines,tail,a,o)=>{o=o||{};a=a==null?1:a;const S=K.S,size=o.size||34,wt=o.weight||700,lh=size*1.3,w=Math.max(...lines.map(l=>tw(ctx,l,wt,size)))+56,h=lines.length*lh+32,bx=x-w/2,by=y-h/2,bb={x:bx,y:by,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;settle(ctx,tail?tail[0]:x,tail?tail[1]:y,a);
  const col=o.col||[255,253,247],ink=S.id==="line"?S.ink:null;
  if(tail){const below=tail[1]>y,base=below?by+h:by,dir=below?1:-1,tcx=clamp(tail[0],bx+44,bx+w-44),tip=[lerp(tcx,tail[0],0.85),lerp(base,tail[1],0.72)];
    if(o.think){for(const [f,r] of [[0.3,11],[0.62,8],[0.9,5]]){ctx.beginPath();ctx.arc(lerp(tcx,tip[0],f),lerp(base+dir*8,tip[1],f),r,0,TAU);ctx.fillStyle=css(col);ctx.fill();if(ink){ctx.lineWidth=2.5;ctx.strokeStyle=css(ink);ctx.stroke();}}}
    else{ctx.beginPath();pg(ctx,[[tcx-18,base-dir*6],[tcx+18,base-dir*6],tip]);ctx.lineJoin="round";if(ink){ctx.lineWidth=5;ctx.strokeStyle=css(ink);ctx.stroke();}
      else if(S.id==="paper"){ctx.save();ctx.translate(4,6);ctx.fillStyle="rgba(58,36,30,0.26)";ctx.fill();ctx.restore();ctx.beginPath();pg(ctx,[[tcx-18,base-dir*6],[tcx+18,base-dir*6],tip]);}
      ctx.fillStyle=css(col);ctx.fill();}
    K.box(ctx,bx,by,w,h,26,col,1);
    // the join: the body's line doesn't cross the tail's mouth
    if(!o.think){ctx.fillStyle=css(col);ctx.beginPath();pg(ctx,[[tcx-15,base-dir*5],[tcx+15,base-dir*5],[tcx+13,base+dir*3],[tcx-13,base+dir*3]]);ctx.fill();}}
  else K.box(ctx,bx,by,w,h,26,col,1);
  lines.forEach((l,i)=>{const la=o.la?clamp(o.la[i]==null?1:o.la[i],0,1):1;if(la<=0.004)return;ctx.save();ctx.globalAlpha*=la;tx(ctx,l,x,by+16+lh*(i+0.5)+size*0.35,{w:wt,size,align:"center",col:o.ink||K.C.ink});ctx.restore();});
  if(o.strike){ctx.strokeStyle=css(K.C.amber);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx+22,y+3);ctx.lineTo(bx+22+(w-44)*clamp(o.strike===true?1:o.strike,0,1),y-3);ctx.stroke();}
  ctx.restore();return bb;};
// over the head of the person who says it (J: what PK.person returned); it leans the way they face, and stays in the frame
K.say=(ctx,J,lines,a,o)=>{o=o||{};const size=o.size||34,hh=J.p.head*J.u,sg=J.sgn||1,tail=[J.hc[0]+sg*hh*0.42,J.hc[1]-hh*0.56],w=Math.max(...lines.map(l=>tw(ctx,l,o.weight||700,size)))+56,h=lines.length*size*1.3+32;
  // what the camera sees, when the shot gives it (o.cam): the bubble stays inside that
  const cm=o.cam,m=cm?40/cm.z:40,vx0=cm?cm.x-960/cm.z:0,vx1=cm?cm.x+960/cm.z:1920,vy0=cm?cm.y-540/cm.z:0;
  const x=clamp(tail[0]+sg*(o.lean==null?w*0.22:o.lean)+(o.dx||0),vx0+w/2+m,vx1-w/2-m),y=Math.max(vy0+h/2+m,tail[1]-h/2-(o.rise==null?54:o.rise)+(o.dy||0));return K.bubble(ctx,x,y,lines,tail,a,o);};
K.kicker=(ctx,num,title,a)=>{if(a<=0.004)return;const s=String(title).toUpperCase(),w=tw(ctx,s,800,28,3)+tw(ctx,String(num),800,28)+84,h=56,x=72,y=64;
  ctx.save();ctx.globalAlpha*=a;K.box(ctx,x,y,w,h,h/2,K.col("board"),1);tx(ctx,String(num),x+28,y+38,{w:800,size:28,col:K.C.amber});tx(ctx,s,x+28+tw(ctx,String(num),800,28)+22,y+38,{w:800,size:28,ls:3,col:K.C.mut});ctx.restore();};
K.sceneTag=(ctx,text,a)=>K.tag(ctx,1848,92,text||"The university, 2027 · imagined",a,{align:"right",col:K.C.mut});
// the module's mark: five people in a ring; the ring that joins them draws itself, from the top, clockwise
K.mark=(ctx,cx,cy,r,p,a)=>{if(a<=0.01)return;p=clamp(p,0,1);ctx.save();ctx.globalAlpha*=a;const ring=sine(p/0.75);ctx.lineCap="round";
  ctx.strokeStyle=css(K.C.ink);ctx.lineWidth=Math.max(2,r*0.07);ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*ring);ctx.stroke();
  const cols=[[150,70,88],[98,128,160],[226,190,112],[66,158,138],[204,124,112]];
  for(let i=0;i<5;i++){const an=-Math.PI/2+i*TAU/5,f=clamp(p*5-i*0.6,0,1);if(f<=0)continue;const px=cx+Math.cos(an)*r,py=cy+Math.sin(an)*r,r2=r*0.22*sine(f);
    ctx.fillStyle=css(K.col("board"));ctx.beginPath();ctx.arc(px,py,r2+r*0.07,0,TAU);ctx.fill();ctx.fillStyle=css(cols[i]);ctx.beginPath();ctx.arc(px,py,r2,0,TAU);ctx.fill();ctx.lineWidth=Math.max(1.5,r*0.045);ctx.strokeStyle=css(K.C.ink);ctx.stroke();}
  ctx.restore();};
// a sheet of the card's colour over the picture, clear on one side, where the person the film follows stays in view
const veil=(ctx,S,a,side)=>{if(a<=0)return;setScreen(ctx,S);const c=K.col("board"),g=ctx.createLinearGradient(0,0,1920,0),st=side==="right"?[[0,0],[0.3,0],[0.56,0.94],[1,0.97]]:[[0,0.97],[0.46,0.94],[0.72,0],[1,0]];
  for(const [o,v] of st)g.addColorStop(o,css(c,v*clamp(a,0,1)));ctx.fillStyle=g;ctx.fillRect(0,0,1920,1080);};
K.title=(ctx,S,t,t0,title,sub,line,o)=>{o=o||{};const oA=pin(t,t0,0.8),tA=pin(t,t0+0.5,0.8);if(oA<=0)return;veil(ctx,S,oA,o.side);setScreen(ctx,S);const x=o.side==="right"?1060:150;
  ctx.save();ctx.globalAlpha*=tA;K.mark(ctx,x+64,300,64,(t-t0-0.4)/1.8,1);tx(ctx,title,x,500,{w:800,size:o.size||76});if(sub)tx(ctx,sub,x,572,{w:600,size:36,col:K.C.mut});
  // the module and the series, in capitals: on one line where it fits the frame, else a line for each part
  const cap=String(line).toUpperCase(),parts=tw(ctx,cap,800,28,3)<=1920-80-x?[cap]:cap.split(" · ");
  ctx.globalAlpha*=pin(t,t0+1.2,0.8);parts.forEach((p,i)=>tx(ctx,p,x,660+i*44,{w:800,size:28,ls:3,col:K.C.mut}));ctx.restore();};
K.end=(ctx,S,t,t0,title,line,n,series,o)=>{o=o||{};const oA=pin(t,t0,1.0),tA=pin(t,t0+0.6,0.9);if(oA<=0)return;veil(ctx,S,oA,o.side);setScreen(ctx,S);const x=o.side==="right"?1060:150;
  ctx.save();ctx.globalAlpha*=tA;if(line){const ls=ag_wrap(ctx,line,760,{w:700,size:46});ls.forEach((l,i)=>tx(ctx,l,x,330+i*62-(ls.length-1)*31,{w:700,size:46}));}
  K.mark(ctx,x+56,490,56,(t-t0-0.7)/1.6,1);tx(ctx,title,x,640,{w:800,size:44});tx(ctx,(n?n+" · ":"")+(series||"Leading data people")+" · Learning Data",x,698,{w:600,size:28,col:K.C.mut});ctx.restore();};
})(PK);

/* ===== The people kit: places =====
   Where the university's people work and meet, each painted once and kept as a picture (the agent films' AG_PLACES). A film lists
   the ones it uses, its opening place first: AG_PLACES.team=PK.place.team. A place paints only what is behind everyone; what people
   sit at or stand behind is drawn every frame with them, by the sets below, so a person's legs go under a desk and their hands on it.
   Each place has an eye line (PK.ROOMS.<place>.eye): a standing adult's eyes are on it wherever they stand, so PK.hAt(floor, eye)
   gives everyone's size, near and far. Never draw two people of one picture at sizes the eye line doesn't give: a large half-figure
   beside small whole people reads as two pictures pasted together. A camera closes in to about 1.3 at most on a kept picture; for
   faces, cut to a place painted closer, such as the corner.
     PK.place.team     the data team's room: a window on the campus, a whiteboard, shelves (PK.ROOMS.team: eye, board, clock, the
                       floor lines back, mid and front, win, and sill: a place on the window's sill for something small)
     PK.place.corner   the manager's corner: a round table by a window, close enough for faces (PK.ROOMS.corner: F the floor, H a
                       person's height there, hx and ix where two people sit, tx, ty, rx the table)
     PK.place.campus   the campus: the teaching building and its entrance, a lawn, two paths, trees (PK.ROOMS.campus: near, the near
                       path's floor; way(x), the floor along the path from the entrance, x from 1470 down to 900)
     PK.place.lecture  a teaching room: a door with the sensor that counts who comes in, windows, a board; its seats are drawn with
                       the people, so it can be full or empty (PK.ROOMS.lecture: door, sensor, board, rows)
   Sets, drawn every frame:
     PK.window(ctx, x, y, w, h, view, o), PK.windowFrame(...)   a window: draw the frame again over people who pass outside
     PK.atDesk(ctx, who, x, floor, h, o)       someone working at a desk, seen from the side
     PK.seated(ctx, who, x, floor, h, pose, o) someone on a chair
     PK.audience(ctx, t, n, o)                 the teaching room's seats, n of them taken
     PK.atBoard(ctx, who, t, lines, o)         someone writing on a wall board, line by line, stepping along as the words come */
(K=>{
const {TAU,lerp,clamp,pin,mix,dk,lt,css,rnd,hash,polar,capsule,pg,rrect,ell}=K.u,C=K.col;
Object.assign(K.PAL,{carpet:[156,170,176],carpetDk:[140,148,152],doorCool:[146,170,174],sensor:[248,246,240],lawnLt:[188,208,140],stoneBand:[236,226,208],hedge:[112,160,116]});
const grad=(ctx,x0,y0,x1,y1,a,b,aa,ab)=>{const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,css(a,aa));g.addColorStop(1,css(b,ab));return g;};
function wall(ctx,col,y1){ctx.fillStyle=K.S.shade?grad(ctx,0,0,0,y1,lt(col,0.25),dk(col,0.07)):css(col);ctx.fillRect(0,0,1920,1080);}
function floorAt(ctx,y0,col,planks){ctx.fillStyle=K.S.shade?grad(ctx,0,y0,0,1080,col,dk(col,0.14)):css(col);ctx.fillRect(0,y0,1920,1080-y0);
  ctx.save();ctx.strokeStyle=css(dk(col,0.2),0.5);ctx.lineWidth=2.5;ctx.lineCap="round";ctx.beginPath();
  for(let i=1;i<6;i++){const y=y0+i*i*9+i*14;ctx.moveTo(0,y);ctx.lineTo(1920,y);}
  if(planks)for(let i=0;i<14;i++){const x=i*150+((i*53)%60),r=(i%3)*3+1;ctx.moveTo(x,y0+r*23);ctx.lineTo(x-(960-x)*0.03,y0+(r+1)*23+12);}
  ctx.stroke();ctx.restore();}
const skirting=(ctx,y)=>K.S.fill(ctx,c=>rrect(c,-10,y,1940,24,0),C("skirting"),{});
function rug(ctx,x,y,rx,ry){const S=K.S;S.fill(ctx,c=>ell(c,x,y,rx,ry),C("rug"),{sa:0.16});S.fill(ctx,c=>ell(c,x,y,rx*0.875,ry*0.81),C("rug2"),{w:0.5,flat:true});S.fill(ctx,c=>ell(c,x,y,rx*0.73,ry*0.65),C("rug"),{w:0.5,flat:true});}
// a plank on a wall with books standing on it; o.free: px left clear at its end
function shelf(ctx,x,y,w,seed,o){o=o||{};const S=K.S,R=rnd(seed);S.fill(ctx,c=>{rrect(c,x+30,y+12,10,26,2);rrect(c,x+w-40,y+12,10,26,2);},dk(C("wood"),0.2),{w:0.6,flat:true});S.fill(ctx,c=>rrect(c,x,y,w,14,4),C("wood"),{});
  let bx=x+14;const end=x+w-(o.free||0)-34;while(bx<end){const bw=16+R()*18,bh=52+R()*30,ci=(R()*6)|0,tilt=R()<0.12;ctx.save();if(tilt){ctx.translate(bx+bw,y);ctx.rotate(0.22);ctx.translate(-(bx+bw),-y);}
    S.fill(ctx,c=>rrect(c,bx,y-bh,bw,bh,2),C("book",ci),{w:0.6,sa:0.16});ctx.restore();bx+=bw+(tilt?14:3);if(R()<0.1)bx+=30;}}
// what is outside a window: the campus, a building (o.bld: where across the window, 0 to 1) and trees
function campusView(ctx,x,y,w,h,o){o=o||{};const S=K.S,k=w/640;ctx.fillStyle=S.shade?grad(ctx,0,y,0,y+h,C("skyTop"),lt(C("skyLow"),0.2)):css(mix(C("skyTop"),C("skyLow"),0.35));ctx.fillRect(x,y,w,h);
  S.begin(ctx,{lw:2,far:0.6,sh:3});K.cloud(ctx,x+w*0.24,y+h*0.18,0.8*k);K.cloud(ctx,x+w*0.78,y+h*0.29,0.6*k);
  const bx=x+w*(o.bld==null?0.52:o.bld),by=y+h*0.47;
  S.fill(ctx,c=>rrect(c,bx,by,330*k,h,4),C("viewBld"),{flat:true});S.fill(ctx,c=>pg(c,[[bx-20*k,by+4*k],[bx+165*k,by-60*k],[bx+350*k,by+4*k]]),C("viewRoof"),{flat:true});
  for(let i=0;i<4;i++)for(let j=0;j<2;j++)S.fill(ctx,c=>rrect(c,bx+32*k+i*68*k,by+40*k+j*84*k,36*k,52*k,4),mix(C("glass"),C("viewBld"),0.3),{w:0.5,flat:true});
  for(const [fx,fy,r,i] of o.trees||[[0.14,0.73,96,0],[0.36,0.8,78,1],[0.94,0.83,70,0],[0.02,0.89,70,1]]){const tx=x+w*fx,ty=y+h*fy,rr=r*k;S.fill(ctx,c=>rrect(c,tx-7*k,ty,14*k,160*k,4),C("trunk"),{w:0.6,flat:true});
    S.fill(ctx,c=>{ell(c,tx,ty,rr,rr*0.82);ell(c,tx-rr*0.5,ty+rr*0.34,rr*0.6,rr*0.5);ell(c,tx+rr*0.52,ty+rr*0.3,rr*0.56,rr*0.48);},C(i?"viewTree2":"viewTree"),{sa:0.14});}
  S.fill(ctx,c=>rrect(c,x-10,y+h-60*k,w+20,80*k,0),C("lawn"),{flat:true,line:false});}
K.view={campus:campusView};
K.windowFrame=(ctx,x,y,w,h,o)=>{o=o||{};const S=K.S,fr=C("frame");S.begin(ctx,{lw:3,far:0.1,sh:5});
  S.fill(ctx,c=>{rrect(c,x-18,y-18,w+36,18,4);rrect(c,x-18,y+h,w+36,18,4);rrect(c,x-18,y-18,18,h+36,4);rrect(c,x+w,y-18,18,h+36,4);if(o.bar!==false)rrect(c,x+w/2-7,y,14,h,2);},fr,{});
  S.fill(ctx,c=>rrect(c,x-40,y+h+16,w+80,22,6),lt(fr,0.2),{});};
K.window=(ctx,x,y,w,h,view,o)=>{o=o||{};ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();(view||campusView)(ctx,x,y,w,h,o);ctx.restore();K.windowFrame(ctx,x,y,w,h,o);
  if(K.S.shade&&o.light!==false){const fy=o.floor||800;ctx.fillStyle=grad(ctx,x,y+h,x-200,fy+200,[255,246,214],[255,246,214],0.5,0);ctx.beginPath();pg(ctx,[[x,y+h+38],[x+w,y+h+38],[x+w-120,fy],[x-260,fy]]);ctx.fill();}};

K.ROOMS={
  team:{eye:360,wall:790,win:[150,152,470,450],board:{x:726,y:170,w:470,h:330},clock:[1700,182,42],sill:[352,618],back:838,mid:884,front:930},
  corner:{eye:198,F:944,H:820,hx:628,ix:1292,tx:960,rx:282,ty:638,win:[640,120,640,450]},
  campus:{eye:430,near:930,door:[1470,600],way:x=>lerp(600,884,clamp((1470-x)/570,0,1))},
  lecture:{eye:400,wall:800,door:{x:260,y:290,w:220,h:510},sensor:[260,238],board:{x:1340,y:250,w:460,h:300},rows:[[826,468],[868,514],[912,562]]}
};
K.place={};
/* the data team's room */
K.place.team=ctx=>{const S=K.S,R=K.ROOMS.team,[wx,wy,ww,wh]=R.win;wall(ctx,C("wall"),800);
  K.window(ctx,wx,wy,ww,wh,campusView,{bld:0.44});
  S.begin(ctx,{lw:3,far:0.1,sh:5});K.board(ctx,R.board.x,R.board.y,R.board.w,R.board.h);
  // the wall behind where people stand is left plain, from their shoulders up: a head reads best against nothing. The shelf is in
  // the corner, over a desk, where nobody stands
  shelf(ctx,1730,330,170,41,{free:76});K.pot(ctx,1846,330,60,46);K.plant(ctx,1846,284,0.46,5,0);
  floorAt(ctx,800,C("floor"),true);skirting(ctx,780);rug(ctx,900,952,600,92);
  S.begin(ctx,{lw:3,far:0.1,sh:5});K.pot(ctx,672,802,92,80);K.plant(ctx,672,722,1.0,8,0);};
/* the manager's corner: a round table by the window */
K.place.corner=ctx=>{const S=K.S,R=K.ROOMS.corner,[wx,wy,ww,wh]=R.win;wall(ctx,C("wall"),800);K.window(ctx,wx,wy,ww,wh,campusView,{});
  S.begin(ctx,{lw:3,far:0.1,sh:5});const bx=150,by=200,bw=380,bh=270;K.board(ctx,bx,by,bw,bh,{pin:true});
  [[40,34,0],[112,44,1],[44,112,2],[250,34,3],[312,48,1],[254,116,2],[320,128,0],[150,170,3],[212,96,0]].forEach(([x,y,i],j)=>{ctx.save();ctx.translate(bx+x+26,by+y+26);ctx.rotate((hash(j,5)-0.5)*0.14);S.fill(ctx,c=>rrect(c,-26,-26,52,52,3),C("note",i),{w:0.6,sa:0.2});ctx.restore();});
  // books, a lamp and a picture on the right
  const sx=1440,sy=470,sw=380,sh=330;S.fill(ctx,c=>rrect(c,sx,sy,sw,sh,8),C("wood"),S.shade?{grad:[sx,0,sx+sw,0,0.1]}:{});
  for(let r=0;r<3;r++){const y0=sy+16+r*104;S.fill(ctx,c=>rrect(c,sx+14,y0,sw-28,88,4),dk(C("woodDk"),0.12),{w:0.6,flat:true});
    const Rn=rnd(40+r);let x=sx+22;while(x<sx+sw-70){const w=16+Rn()*18,h=52+Rn()*30,ci=(Rn()*6)|0,tilt=Rn()<0.12;ctx.save();if(tilt){ctx.translate(x+w,y0+88);ctx.rotate(0.22);ctx.translate(-(x+w),-(y0+88));}S.fill(ctx,c=>rrect(c,x,y0+88-h,w,h,2),C("book",ci),{w:0.6,sa:0.16});ctx.restore();x+=w+(tilt?14:3);if(Rn()<0.1)x+=30;}}
  K.pot(ctx,sx+70,sy,70,56);K.plant(ctx,sx+70,sy-56,0.62,3,0);
  S.fill(ctx,c=>{rrect(c,sx+288,sy-14,60,14,4);rrect(c,sx+312,sy-110,12,100,3);},dk(C("lamp"),0.3),{});S.poly(ctx,[[sx+270,sy-96,1],[sx+366,sy-96,1],[sx+346,sy-166,1],[sx+290,sy-166,1]],C("lamp"),{exact:true});
  S.fill(ctx,c=>rrect(c,1444,166,250,180,6),C("frame"),{});ctx.save();ctx.beginPath();ctx.rect(1460,182,218,148);ctx.clip();ctx.fillStyle=css(C("skyTop"));ctx.fillRect(1460,182,218,148);
  S.begin(ctx,{lw:1.4,far:0.5,sh:2});S.poly(ctx,[[1444,276],[1514,246],[1594,268],[1684,238],[1704,356,1],[1444,356,1]],C("lawn"),{flat:true,exact:true});S.poly(ctx,[[1444,306],[1534,288],[1624,310],[1704,294],[1704,356,1],[1444,356,1]],C("viewTree2"),{flat:true,exact:true});ctx.restore();
  S.begin(ctx,{lw:3,far:0.1,sh:5});floorAt(ctx,800,C("floor"),true);skirting(ctx,780);rug(ctx,960,946,640,96);
  K.pot(ctx,360,800,110,96);K.plant(ctx,360,704,1.25,8,0);};
/* the campus: the teaching building on the right, the library far off, a lawn, a path from the entrance and one across the front */
K.place.campus=ctx=>{const S=K.S;ctx.fillStyle=S.shade?grad(ctx,0,0,0,480,C("skyTop"),C("skyLow")):css(mix(C("skyTop"),C("skyLow"),0.3));ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:1.5,far:0.8,sh:3});K.cloud(ctx,330,150,1.2);K.cloud(ctx,860,86,0.8);
  // far trees, the library
  S.begin(ctx,{lw:1.6,far:0.7,sh:3});const Rn=rnd(12),far=mix(C("viewTree2"),C("skyLow"),0.34);
  S.fill(ctx,c=>{for(let x=-40;x<1180;x+=58+Rn()*30)ell(c,x,470+Rn()*16,52+Rn()*26,40+Rn()*22);c.rect(-40,480,1260,60);},far,{sa:0.1});
  S.begin(ctx,{lw:2,far:0.5,sh:3});const lb=mix(C("viewBld"),C("skyLow"),0.2);
  S.fill(ctx,c=>rrect(c,170,318,400,200,3),lb,S.shade?{grad:[170,0,570,0,0.08]}:{});S.fill(ctx,c=>rrect(c,156,300,428,24,4),mix(C("viewRoof"),C("skyLow"),0.2),{});
  for(let i=0;i<5;i++)for(let j=0;j<2;j++)S.fill(ctx,c=>rrect(c,200+i*72,346+j*78,40,50,3),mix(C("glass"),lb,0.3),{w:0.5,flat:true});
  S.fill(ctx,c=>rrect(c,344,446,52,72,3),dk(lb,0.3),{w:0.6,flat:true});
  // the lawn, mown in stripes, and trees across it
  S.begin(ctx,{lw:2.4,far:0.3,sh:4});const lawn=[[-40,512],[400,506],[900,514],[1300,508],[1960,520],[1960,1100,1],[-40,1100,1]];
  S.poly(ctx,lawn,C("lawn"),S.shade?{grad:[0,500,0,1080,0.12],exact:true}:{flat:true,exact:true});
  ctx.save();ctx.beginPath();K.u.spline(ctx,lawn);ctx.clip();ctx.fillStyle=css(C("lawnLt"),0.5);for(let i=-9;i<12;i+=2){ctx.beginPath();pg(ctx,[[960,410],[960+i*330,1100],[960+(i+1)*330,1100]]);ctx.fill();}ctx.restore();
  S.begin(ctx,{lw:2.2,far:0.35,sh:4});K.tree(ctx,84,532,1.05,3,{far:1});K.tree(ctx,650,526,0.95,7,{far:1});K.tree(ctx,872,534,1.1,11,{far:1});
  // the paths: one from the entrance, one across the front
  S.begin(ctx,{lw:2.4,far:0.2,sh:4});const pth=C("path");
  S.poly(ctx,[[1404,600,1],[1548,600,1],[1270,884,1],[742,884,1]],pth,{exact:true,flat:true});
  S.poly(ctx,[[-40,872,1],[1960,872,1],[1960,1004,1],[-40,1004,1]],pth,S.shade?{grad:[0,872,0,1004,0.07],exact:true}:{exact:true,flat:true});
  // the teaching building: its ground floor and the floor above, the entrance under a canopy
  S.begin(ctx,{lw:3,far:0.12,sh:5});const bk=C("brick"),sb=C("stoneBand"),gl=mix(C("glass"),[150,190,206],0.3);
  S.fill(ctx,c=>rrect(c,1040,-30,940,600,0),bk,S.shade?{grad:[1040,0,1960,0,0.1]}:{});
  S.fill(ctx,c=>{rrect(c,1028,262,960,22,3);rrect(c,1028,538,960,34,3);},sb,{});
  const win=(x,y,w,h)=>{S.fill(ctx,c=>rrect(c,x-9,y-9,w+18,h+18,5),sb,{w:0.8});S.fill(ctx,c=>rrect(c,x,y,w,h,2),gl,S.shade?{grad:[x,y,x+w,y+h,0.16],line:false}:{line:false,flat:true});
    S.line(ctx,c=>{c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h*0.4);c.lineTo(x+w,y+h*0.4);},dk(sb,0.3),0.7,{on:"line soft paper",px:3});};
  for(const x of [1090,1236,1656,1802]){win(x,326,96,176);win(x,44,96,176);}win(1422,44,96,176);
  S.fill(ctx,c=>{rrect(c,1362,360,16,212,3);rrect(c,1562,360,16,212,3);},dk(sb,0.14),{});S.fill(ctx,c=>rrect(c,1334,330,272,30,6),sb,{});
  S.fill(ctx,c=>rrect(c,1392,384,156,188,3),dk(bk,0.42),{});S.fill(ctx,c=>{rrect(c,1400,392,66,180,2);rrect(c,1474,392,66,180,2);},gl,S.shade?{grad:[1400,392,1540,572,0.2],w:0.6}:{w:0.6,flat:true});
  S.fill(ctx,c=>{rrect(c,1372,572,196,14,2);rrect(c,1360,586,220,14,2);},lt(sb,0.1),{});
  S.begin(ctx,{lw:2.4,far:0.2,sh:4});S.fill(ctx,c=>{for(let x=1052;x<1350;x+=44)ell(c,x+22,566,30,20);},C("hedge"),{sa:0.14});S.fill(ctx,c=>{for(let x=1600;x<1960;x+=44)ell(c,x+22,566,30,20);},C("hedge"),{sa:0.14});
};
/* a teaching room: the door and its sensor on the left, windows, the board on the right; its seats come with the people */
K.place.lecture=ctx=>{const S=K.S,R=K.ROOMS.lecture,d=R.door;wall(ctx,C("wallCool"),800);
  K.window(ctx,560,170,300,400,campusView,{bld:0.3,light:false});K.window(ctx,960,170,300,400,campusView,{bld:-0.3,light:false,trees:[[0.3,0.74,90,0],[0.72,0.8,78,1]]});
  S.begin(ctx,{lw:3,far:0.1,sh:5});K.board(ctx,R.board.x,R.board.y,R.board.w,R.board.h);
  floorAt(ctx,800,C("carpet"),false);skirting(ctx,780);
  K.door(ctx,d.x,800,d.w,d.h,{col:C("doorCool"),glass:true});K.sensor(ctx,R.sensor[0],R.sensor[1],0);};
// the sensor over a door, which counts who comes in; on (0 to 1): it has just seen someone
K.sensor=(ctx,x,y,on)=>{const S=K.S;S.begin(ctx,{lw:2.4,far:0,sh:3});S.fill(ctx,c=>rrect(c,x-40,y-20,80,40,12),C("sensor"),{});
  ctx.fillStyle=css([60,66,78]);ctx.beginPath();ctx.arc(x-14,y,10,0,TAU);ctx.fill();ctx.fillStyle=css(mix([150,156,164],K.C.orange,clamp(on||0,0,1)));ctx.beginPath();ctx.arc(x+18,y,6+2*clamp(on||0,0,1),0,TAU);ctx.fill();};

/* ---------------------------------------------------------------- sets: people with what they sit at
   PK.atDesk: someone at a desk, seen from the side: the chair, their legs, the desk and what is on it, then the rest of them, their
   hands on the keys. o.flip: they face left. o.w: the desk's length along the frame (0.62 h by default). o.work (0 to 1, 1 by
   default): how far their hands are on the keys; o.pose: their pose when they aren't ("sit"), o.workPose when they are; o.reachN,
   o.reachF: what their hands rest on instead of the keys. o.turn (0 to 1): turned round on the chair, away from the desk. o.screen: "laptop" (the default), "monitor" (it faces us: o.show(ctx, x, y, w, h) draws what it shows;
   o.sx where it stands, o.sw and o.sh its size) or null. o.on(ctx, D) draws what else is on the desk. The rest as PK.person's.
   Returns the person's joints, with J.desk = D: {x0, x1 (its near and far end), cx, top, floor, dir, w, k}. who null: the desk
   and its chair stand empty. */
K.atDesk=(ctx,who,x,floor,h,o)=>{o=Object.assign({},o||{});const S=K.S,dir=o.flip?-1:1,w=o.w||0.62*h,top=floor-0.43*h,x0=x+dir*0.1*h,x1=x0+dir*w,k=h/660,
    D={x0,x1,cx:(x0+x1)/2,top,floor,dir,w,k},turn=clamp(o.turn||0,0,1),work=(o.work==null?1:o.work)*(1-pin(turn,0,0.3)),pose=K.poseMix(o.pose||"sit",o.workPose||"sitWork",work),
    fl=dir<0?1-turn:turn,lw={lw:clamp(h*0.0056,1.4,6.5),sh:clamp(h*0.0078,1.5,8.5)},po=Object.assign({},o,{flip:fl});
  S.begin(ctx,lw);K.chair(ctx,x-Math.cos(Math.PI*fl)*0.012*h,floor,h,fl,{col:o.chair,swivel:o.swivel!==false});
  if(who)K.person(ctx,who,x,floor,h,pose,Object.assign({},po,{part:"lower",busy:work>=0.5}));
  S.begin(ctx,lw);K.desk(ctx,D.cx,top,w,floor,{col:o.deskCol,k:h/600});
  if(o.screen==="monitor"){K.monitor(ctx,o.sx==null?x0+dir*w*0.6:o.sx,top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    S.begin(ctx,lw);S.fill(ctx,c=>rrect(c,Math.min(x0+dir*0.1*h,x0+dir*0.27*h),top-0.012*h,0.17*h,0.012*h,3),lt(C("laptop"),0.25),{w:0.7});}
  else if(o.screen!==null)K.laptop(ctx,x0+dir*0.21*h,top,{k,flip:dir<0,glow:o.glow});
  if(o.on)o.on(ctx,D);
  if(!who)return{desk:D};
  // hands on the keys tap in bursts and rest between them (given the time, o.t; o.life 0: they lie still)
  const ty=o.t==null||o.life===0?{n:[0,0],f:[0,0]}:K.typing(o.t,typeof who==="string"?K.CAST[who]:who);
  const J=K.person(ctx,who,x,floor,h,pose,Object.assign({},po,{part:"upper",busy:work>=0.5},o.reachN?{}:{reachN:[x+dir*(0.25+ty.n[0])*h,top-(0.012+ty.n[1])*h],reachNk:work},
    o.reachF?{}:{reachF:[x+dir*(0.31+ty.f[0])*h,top-(0.018+ty.f[1])*h],reachFk:work}));J.desk=D;return J;};
// someone on a chair
K.seated=(ctx,who,x,floor,h,pose,o)=>{o=o||{};const fl=o.flip===true?1:(o.flip||0);K.S.begin(ctx,{lw:clamp(h*0.0056,1.4,6.5),sh:clamp(h*0.0078,1.5,8.5)});
  K.chair(ctx,x-Math.cos(Math.PI*fl)*0.012*h,floor,h,fl,{col:o.chair,swivel:o.swivel});return K.person(ctx,who,x,floor,h,pose||"sit",o);};
/* the teaching room's seats, in three rows that face the board: n of the eleven are taken, by people nobody names (PK.extra), in
   the order o.order gives (seats 0 to 3 are the back row, 4 to 7 the middle, 8 to 10 the front); the others stand empty.
   o.a (0 to 1) fades the people, so the empty chairs show through; o.who(i) another person for seat i; o.look where they look
   (0: at their notes, 1: up at the board); o.between(ctx, row) draws what comes after a row, such as someone walking to a seat.
   PK.seats() gives the seats: {r (the row), x, fl, h}. */
K.seats=o=>{o=o||{};const R=K.ROOMS.lecture,x0=o.x0==null?470:o.x0,x1=o.x1==null?1180:o.x1,seats=[];
  R.rows.forEach(([fl,h],r)=>{const m=r===2?3:4;for(let i=0;i<m;i++)seats.push({r,x:lerp(x0,x1,(i+(r%2?0.5:0.12)+(r===2?0.3:0))/m)+r*14,fl,h});});return seats;};
K.audience=(ctx,t,n,o)=>{o=o||{};const seats=K.seats(o),order=o.order||[5,1,9,6,2,8,0,10,4,7,3],taken={};order.slice(0,clamp(Math.round(n),0,11)).forEach((s,i)=>taken[s]=i);
  seats.forEach((s,i)=>{const P=taken[i]!=null?(o.who&&o.who(i))||K.extra(i+3):null,ch=K.PAL[i%2?"chair2":"chair"];
    if(!P||(o.a!=null&&o.a<1)){K.S.begin(ctx,{lw:clamp(s.h*0.0056,1.4,6.5),sh:4});K.chair(ctx,s.x-0.012*s.h,s.fl,s.h,false,{col:ch});}
    if(P)K.seated(ctx,P,s.x,s.fl,s.h,K.poseMix("sit","sitBack",hash(i,2)),{t:t+i*1.7,chair:ch,a:o.a,expr:"listen",gaze:[1,-(o.look==null?0.4:o.look)],nod:Math.sin(t*0.7+i)*0.02,shade:0});
    if(o.between&&(i===3||i===7))o.between(ctx,s.r);});
  return seats;};
/* PK.atBoard: someone writes on a wall board, standing at it, seen from the side, facing right. lines: [{s, t0, t1, col}]: each
   line's words and when they are written (from t0 to t1), one under the other from (o.x, o.y: the first baseline), o.lh apart, in
   o.size px. An arm is only so long, so the writer stands o.back px behind the pen and steps along as the words come; when the
   next line comes more than o.aside seconds later, and after the last, they step back to o.rest (an x clear of the words), so
   the words show: keep o.rest within a stride of the lines' ends, so that it is one step back, still facing the board, and
   a head's width clear of the words' start. o.stand: how they stand when they aren't writing ("ease"). o.floor, o.h: where they stand and how tall; o.a fades the words (not the writer); o.expr, o.gaze as PK.person's.
   o.down: when they put the marker down on the board's tray, at o.tray [x, y] (within an arm of o.rest): it lies there from then
   on. who null: only the words, and the marker on the tray: the writer has left. Returns the joints, with J.writing (0 to 1). */
K.atBoard=(ctx,who,t,lines,o)=>{o=Object.assign({size:30,weight:700,lh:56,back:74,aside:2.2,a:1},o||{});const u=o.h/1000,down=o.down==null||!o.tray?1e9:o.down;
  const W=lines.map(l=>ag_tw(ctx,l.s,{w:o.weight,size:o.size})),pOf=(i,tt)=>clamp((tt-lines[i].t0)/(lines[i].t1-lines[i].t0),0,1),pen=(i,p)=>[o.x+W[i]*p,o.y+i*o.lh-o.size*0.32];
  // the words, as far as they are written
  lines.forEach((l,i)=>{const p=pOf(i,t);if(p<=0||o.a<=0.004)return;ctx.save();ctx.globalAlpha*=clamp(o.a,0,1);ctx.beginPath();ctx.rect(o.x-4,o.y+i*o.lh-o.size-6,(W[i]+10)*p,o.size+24);ctx.clip();
    ag_T(ctx,l.s,o.x,o.y+i*o.lh,{w:o.weight,size:o.size,color:css(l.col||K.C.ink)});ctx.restore();});
  const P=typeof who==="string"?K.CAST[who]:who,inkOf=l=>(l&&l.col)||K.C.ink,lw={lw:clamp(o.h*0.0056,1.4,6.5),sh:clamp(o.h*0.0078,1.5,8.5)};
  const marker=(c,a,b,col)=>{const S=K.S;S.fill(c,cc=>capsule(cc,a,b,9*u,8*u),[70,74,90],{w:0.6});S.fill(c,cc=>capsule(cc,[lerp(a[0],b[0],0.82),lerp(a[1],b[1],0.82)],b,8*u,6*u),col,{w:0.6,flat:true});};
  // the marker on the tray: from the hand that puts it there, it comes to lie flat
  if(t>=down){const J0=K.rig(P||{},o.rest,o.floor,o.h,"stand",{reachN:[o.tray[0],o.tray[1]-10*u]}),h0=J0.hdN,d0=J0.aN[1],e=pin(t,down,0.3),
      a=[lerp(polar(h0,d0,-6*u)[0],o.tray[0]-34*u,e),lerp(polar(h0,d0,-6*u)[1],o.tray[1]-9*u,e)],b=[lerp(polar(h0,d0,62*u)[0],o.tray[0]+34*u,e),lerp(polar(h0,d0,62*u)[1],o.tray[1]-9*u,e)];
    K.S.begin(ctx,lw);marker(ctx,a,b,inkOf(lines[lines.length-1]));}
  if(!P)return null;
  const amp=K.ampOf(P),stride=K.strideOf(o.h,amp);
  // where the writer stands: moves [t0, t1, x0, x1, eased], held between them
  const mv=[];let px=o.rest,pt=-1e9;const move=(t1,x1)=>{const d=clamp(Math.abs(x1-px)/340,0.45,1.6),t0=Math.max(pt,t1-d);if(Math.abs(x1-px)>0.5)mv.push([t0,Math.max(t1,t0+0.3),px,x1,1]);px=x1;pt=Math.max(t1,t0+0.3);};
  lines.forEach((l,i)=>{const sx=o.x-o.back,ex=sx+W[i];move(l.t0-0.1,sx);mv.push([l.t0,l.t1,sx,ex,0]);px=ex;pt=l.t1+0.25;
    if(i===lines.length-1||lines[i+1].t0-l.t1>o.aside)move(pt+clamp(Math.abs(o.rest-ex)/340,0.5,1.6),o.rest);});
  const xAt=tt=>{let x=o.rest;for(const [t0,t1,x0,x1,e] of mv){if(tt<=t0)break;const k=clamp((tt-t0)/(t1-t0),0,1);x=lerp(x0,x1,e?K.u.sine(k):k);}return x;};
  // a step or so back from the words is taken as people take it, still facing the board; only to walk back a long way do they turn
  // round, and face the board's free side again when they stop
  let turn=0;for(const [t0,t1,x0,x1,e] of mv)if(e&&x0-x1>stride*0.9)turn=Math.max(turn,pin(t,t0-0.1,0.3)*(1-pin(t,t1-0.25,0.3)));
  let wi=0,wk=0;lines.forEach((l,i)=>{const k=pin(t,l.t0-0.3,0.3)*(1-pin(t,l.t1+0.1,0.3));if(k>wk){wk=k;wi=i;}});
  const x=xAt(t),v=Math.abs(xAt(t+0.04)-xAt(t-0.04))/0.08,walk=K.poseMix(o.stand||"ease",K.poseWalk(Math.abs(x-o.rest)/stride,1,amp),clamp(v/180,0,1)*0.85),q=pen(wi,pOf(wi,t)),held=t<down;
  // the hand: on the pen's place while a line is written; to the tray and back as the marker is put down
  const tr=down<1e8?pin(t,down-0.45,0.4)*(1-pin(t,down+0.15,0.45)):0,rk=tr>0?tr:wk*(1-turn),tg=tr>0?[o.tray[0],o.tray[1]-10*u]:[q[0]+2,q[1]+Math.sin(t*23)*2.5*wk];
  const pose=Object.assign({},walk,{aN:[walk.aN[0],walk.aN[1],held?"grip":"rest"]}),mk=held?(c,h,deg,J)=>marker(c,polar(h,deg,-6*J.u),polar(h,deg,62*J.u),inkOf(lines[wi])):null;
  const J=K.person(ctx,who,x,o.floor,o.h,pose,{t:o.t==null?t:o.t,flip:turn,expr:o.expr,gaze:o.gaze||[1,-0.3*wk],nod:o.nod,reachN:tg,reachNk:rk,hold:mk});J.writing=wk;return J;};
})(PK);

/* ===== Owning the outcome: Kenya's central highlands, from the 1970s =====
   The opening's places and people, drawn with the people kit (films/people-first/shared/): the hills with their forests cleared,
   a group's nursery under a shade of poles, and the same hills years later, with trees. The women wear plain clothes of the 1970s
   and headscarves in plain colours; Wangari Maathai is a composite, never a likeness; nothing is taken from a culture's own patterns
   or crafts. Everyone stands on the near slope, sized by one eye line (OO_K.eye), so near and far people belong to one picture. */
const OO_K={eye:455};
const oo_h=fl=>PK.hAt(fl,OO_K.eye);
const OO_CAST={
  maathai:{key:"maathai",name:"Wangari Maathai",role:"A biologist",skin:[118,76,54],hair:{style:"coily",c:[30,24,22]},earrings:[230,204,150],top:{kind:"jacket",c:[158,122,94],inner:[240,232,216]},bottom:{kind:"long",c:[110,86,70]},shoe:[62,48,42]},
  elder:{key:"maathai",name:"Wangari Maathai",skin:[118,76,54],hair:{style:"scarf",c:[226,196,120]},earrings:[230,204,150],top:{kind:"jacket",c:[96,128,112],inner:[240,232,216]},bottom:{kind:"long",c:[84,74,96]},shoe:[62,48,42]},
  wan:{key:"wan",skin:[104,66,48],hair:{style:"scarf",c:[204,124,112]},top:{kind:"sweater",c:[120,110,106]},bottom:{kind:"skirt",c:[154,118,80]},shoe:[74,56,44]},
  nya:{key:"nya",skin:[128,86,60],hair:{style:"scarf",c:[236,222,198]},top:{kind:"jacket",c:[150,74,70],inner:[228,214,190]},bottom:{kind:"long",c:[82,80,108]},shoe:[56,46,42]},
  mum:{key:"mum",skin:[94,60,44],hair:{style:"scarf",c:[112,94,88]},top:{kind:"jacket",c:[158,146,118],inner:[216,204,186]},bottom:{kind:"skirt",c:[118,114,80]},shoe:[68,52,42]},
  boy:{key:"boy",kid:true,skin:[110,70,50],hair:{style:"coily",c:[30,24,22]},top:{kind:"sweater",c:[206,180,126],sleeve:"short"},bottom:{kind:"trousers",c:[112,98,86]},shoe:[96,70,52]},
  girl:{key:"girl",kid:true,skin:[98,62,46],hair:{style:"coily",c:[28,22,22]},top:{kind:"sweater",c:[178,136,150],sleeve:"short"},bottom:{kind:"skirt",c:[104,116,140]},shoe:[96,70,52]}
};
const OO_PAL={mount:[160,172,196],snow:[252,252,252],ridge:[150,174,166],ridge2:[170,188,152],fields:[[218,190,124],[192,204,130],[152,180,112],[208,132,92],[230,210,154],[124,156,106],[180,154,100]],tea:[98,142,96],
  soil:[194,96,60],soilDk:[164,74,48],soilLt:[214,122,80],gully:[132,54,40],gullyLt:[226,146,100],stone:[230,212,186],straw:[226,192,116],stump:[126,88,62],stumpTop:[228,200,154],leaf:[104,160,92],
  grass:[150,176,104],grassDk:[122,152,92],water:[124,176,204],thatch:[206,176,122],pole:[150,112,80],sleeve:[70,66,70],can:[226,190,112],wood:[[142,104,74],[118,86,62],[160,122,88]]};
const oo_c=(n,i)=>PK.S.tone(i==null?OO_PAL[n]:OO_PAL[n][i]);
const OO_HILL=[x=>372+16*Math.sin(x/310+1.2)+10*Math.sin(x/130),x=>446+22*Math.sin(x/380+2.4)+9*Math.sin(x/150+1),x=>536+26*Math.sin(x/430+0.3)+12*Math.sin(x/170+2)];
const oo_slope=x=>690-46*Math.sin((x+260)/640)-14*Math.sin(x/210+1.3);
function oo_ridge(f,yb,x0,x1,step){const p=[];for(let x=x0;x<=x1;x+=step||60)p.push([x,f(x)]);p.push([x1+40,yb,1],[x0-40,yb,1]);return p;}
// small farms on a fold of the hills: strips of fields, some of them tea; green: the years after, with more of it grown over
function oo_fields(ctx,f,yb,seed,far,green){const S=PK.S,U=PK.u,R=U.rnd(seed),bh=(yb-f(900))/2.2;ctx.save();ctx.beginPath();U.spline(ctx,oo_ridge(f,yb,-60,1980));ctx.clip();
  for(let j=0;j<3;j++){let x=-80-R()*120;while(x<1990){const w=130+R()*190,sl=24+R()*30,d0=j*bh-2,d1=(j+1)*bh+2,ci=(R()*OO_PAL.fields.length)|0,tea=R()<0.22,
        col=U.mix(tea?oo_c("tea"):U.mix(oo_c("fields",ci),oo_c("ridge2"),far*0.5),oo_c("grassDk"),green?0.45:0);
      const top=[],bot=[];for(let i=0;i<=3;i++){const xx=x+w*i/3;top.push([xx,f(xx)+d0]);bot.push([xx-sl,f(xx-sl)+d1]);}
      const pts=top.concat(bot.reverse());top[0][2]=1;top[3][2]=1;pts[4][2]=1;pts[7][2]=1;S.poly(ctx,pts,col,{w:0.5,flat:true,exact:true});
      if(tea||R()<0.35){ctx.strokeStyle=U.css(U.dk(col,tea?0.22:0.1),0.9);ctx.lineWidth=1.2;ctx.beginPath();const n=Math.round(w/(tea?11:17));
        for(let i=1;i<n;i++){const xx=x+w*i/n;ctx.moveTo(xx,f(xx)+d0+3);ctx.lineTo(xx-sl,f(xx-sl)+d1-3);}ctx.stroke();}
      x+=w+3;}}
  ctx.restore();}
function oo_tuft(ctx,x,y,k,seed,col){const U=PK.u,R=U.rnd(seed);ctx.fillStyle=U.css(col||U.mix(oo_c("straw"),oo_c("soilLt"),R()*0.3));ctx.beginPath();
  for(let i=0;i<4;i++){const a=-0.6+i*0.4+R()*0.2,l=(14+R()*12)*k;ctx.moveTo(x-2.5*k,y);ctx.quadraticCurveTo(x+Math.sin(a)*l*0.5,y-l*0.6,x+Math.sin(a)*l,y-Math.cos(a)*l);ctx.quadraticCurveTo(x+Math.sin(a)*l*0.4+2*k,y-l*0.5,x+2.5*k,y);}ctx.fill();}
function oo_stump(ctx,x,y,k){const S=PK.S,U=PK.u;S.fill(ctx,c=>{U.rrect(c,x-22*k,y-20*k,44*k,26*k,6*k);U.ell(c,x,y+4*k,22*k,7*k);},oo_c("stump"),{});S.fill(ctx,c=>U.ell(c,x,y-20*k,22*k,7*k),oo_c("stumpTop"),{flat:true});
  S.line(ctx,c=>{c.moveTo(x+8*k,y-20*k);c.arc(x,y-20*k,8*k,0,U.TAU);},U.dk(oo_c("stumpTop"),0.3),0.4);}
const OO_GULLY=[[[330,668,3],[322,720,6],[300,790,9],[262,880,13],[210,980,18],[160,1090,22]],[[1262,690,3],[1280,740,6],[1300,820,9],[1304,900,12],[1330,990,16],[1350,1090,20]],[[1700,676,3],[1716,740,5],[1750,820,8],[1800,930,12],[1850,1090,16]]];
function oo_gully(ctx,pts,k){const S=PK.S,U=PK.u,L=[],Rr=[];pts.forEach(([x,y,w],i)=>{const q=pts[Math.min(i+1,pts.length-1)],p=pts[Math.max(i-1,0)],a=Math.atan2(q[1]-p[1],q[0]-p[0]),n=[-Math.sin(a),Math.cos(a)];w*=k||1;L.push([x+n[0]*w,y+n[1]*w]);Rr.push([x-n[0]*w,y-n[1]*w]);});
  const all=L.concat(Rr.reverse());all[0][2]=1;S.poly(ctx,all,oo_c("gully"),{w:0.6,flat:true,exact:true});
  ctx.save();ctx.beginPath();U.spline(ctx,all);ctx.clip();ctx.strokeStyle=U.css(oo_c("gullyLt"),0.85);ctx.lineWidth=5;ctx.beginPath();U.spline(ctx,Rr.reverse().map(q=>[q[0]+2,q[1]]),false);ctx.stroke();ctx.restore();}
// a plant that did not take: a dry stalk with hanging leaves
function oo_wilted(ctx,x,y,k,seed){const S=PK.S,U=PK.u,R=U.rnd(seed),st=U.mix(oo_c("straw"),oo_c("leaf"),0.35),lf=U.mix(oo_c("straw"),oo_c("leaf"),0.2),bend=(R()-0.3)*14*k,top=[x+bend,y-(58+R()*18)*k];
  S.fill(ctx,c=>{c.moveTo(x-3*k,y);c.quadraticCurveTo(x-2*k,y-30*k,top[0]-1.5*k,top[1]);c.lineTo(top[0]+1.5*k,top[1]);c.quadraticCurveTo(x+3*k,y-30*k,x+3*k,y);c.closePath();},U.dk(st,0.12),{w:0.5,flat:true});
  for(const [f,a,l] of [[0.42,-1,30],[0.6,1,34],[0.82,-1,28],[1,1,30]]){const bx=U.lerp(x,top[0],f),by=U.lerp(y,top[1],f),ex=bx+a*l*k*(0.8+R()*0.3),ey=by+(10+R()*16)*k;
    S.fill(ctx,c=>{c.moveTo(bx,by);c.quadraticCurveTo(bx+a*l*k*0.55,by-16*k,ex,ey);c.quadraticCurveTo(bx+a*l*k*0.5,by-4*k,bx,by+5*k);c.closePath();},a>0?lf:U.lt(lf,0.1),{w:0.5,flat:true});}
  S.fill(ctx,c=>U.ell(c,x,y+2*k,15*k,4.5*k),oo_c("soilDk"),{w:0.5,flat:true});}
// the sky, Mount Kenya far off, a ridge and three folds of farmed hills; green: years later, with trees along them
function oo_far(ctx,green){const S=PK.S,U=PK.u;const g=ctx.createLinearGradient(0,0,0,430);g.addColorStop(0,U.css(PK.col("skyTop")));g.addColorStop(1,U.css(PK.col("skyLow")));ctx.fillStyle=g;ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:1.6,far:0.72,sh:3});
  S.poly(ctx,[[1010,372,1],[1180,318],[1330,236],[1418,168],[1452,132,1],[1476,156],[1500,140,1],[1540,186],[1640,250],[1790,318],[1960,372,1]],oo_c("mount"),{exact:true,flat:true});
  S.poly(ctx,[[1418,168],[1452,132,1],[1476,156],[1500,140,1],[1530,176],[1508,186],[1484,172],[1462,192],[1440,176],[1424,188]],oo_c("snow"),{w:0.6,flat:true,exact:true});
  S.line(ctx,c=>{c.moveTo(1452,150);c.lineTo(1380,250);c.moveTo(1500,160);c.lineTo(1580,262);c.moveTo(1470,190);c.lineTo(1450,300);},null,0.5);
  S.poly(ctx,oo_ridge(x=>338+10*Math.sin(x/260)+6*Math.sin(x/90+1),1080,-60,1980),U.mix(oo_c("ridge"),oo_c("grassDk"),green?0.3:0),{flat:true,exact:true});
  OO_HILL.forEach((f,i)=>{S.begin(ctx,{lw:1.6+i*0.4,far:0.62-i*0.2,sh:3});S.poly(ctx,oo_ridge(f,1080,-60,1980),U.mix(U.mix(oo_c("ridge2"),oo_c("fields",1),0.3+i*0.2),oo_c("grassDk"),green?0.4:0),{flat:true,exact:true});
    oo_fields(ctx,f,i<2?OO_HILL[i+1](900)+40:720,31+i*7,0.5-i*0.22,green);S.line(ctx,c=>U.spline(c,oo_ridge(f,1080,-60,1980).slice(0,-2),false),null,0.8);
    if(green){const R=U.rnd(60+i),col=U.mix(PK.col(i%2?"viewTree":"viewTree2"),oo_c("ridge"),0.3-i*0.1),k=0.5+i*0.28;
      for(let x=-20;x<1960;x+=(54+R()*90)*k){const y=f(x)+6+R()*(i<2?50:80)*k,r=(15+R()*9)*k;S.fill(ctx,c=>{U.rrect(c,x-2*k,y,4*k,18*k,1);U.ell(c,x,y-2*k,r,r*0.84);U.ell(c,x+r*0.7,y+r*0.2,r*0.6,r*0.5);},col,{w:0.5,flat:true});}}});}
// the bed of the stream down the last hill: dry stones, or water again
function oo_bed(ctx,water){const S=PK.S,U=PK.u,bed=[[1560,556,7],[1500,580,9],[1430,592,11],[1380,612,13],[1300,628,15],[1240,654,18],[1150,676,22]],L=[],Rr=[];S.begin(ctx,{lw:2,far:0.3,sh:3});
  bed.forEach(([x,y,w])=>{L.push([x,y-w*0.6]);Rr.push([x+w*0.5,y+w*0.6]);});S.poly(ctx,L.concat(Rr.reverse()),water?oo_c("water"):U.mix(oo_c("stone"),oo_c("straw"),0.35),{w:0.6,flat:true,exact:true});
  const R=U.rnd(9);for(let i=0;i<(water?9:26);i++){const b=bed[1+((R()*5)|0)],x=b[0]+(R()-0.5)*60,y=b[1]+(R()-0.5)*b[2];S.fill(ctx,c=>U.ell(c,x,y,3+R()*5,2+R()*3),U.mix(oo_c("stone"),[150,140,130],R()*0.4),{w:0.4,flat:true});}}
/* the hills of the central highlands in the 1970s, their forests cleared: red soil, gullies where the rain ran, stumps */
function oo_hillsPlace(ctx){const S=PK.S,U=PK.u;oo_far(ctx,false);oo_bed(ctx,false);S.begin(ctx,{lw:2.6,far:0.12,sh:5});const sl=oo_ridge(oo_slope,1100,-60,1980,80);
  S.poly(ctx,sl,oo_c("soil"),{grad:[0,640,0,1080,0.2],exact:true});
  ctx.save();ctx.beginPath();U.spline(ctx,sl);ctx.clip();ctx.strokeStyle=U.css(oo_c("soilDk"),0.55);ctx.lineWidth=1.6;
  for(let j=0;j<7;j++){ctx.beginPath();for(let x=-40;x<=1960;x+=80){const y=oo_slope(x)+44+j*56+8*Math.sin(x/190+j);x<0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}ctx.restore();
  OO_GULLY.forEach(g=>oo_gully(ctx,g));for(const [x,y,k] of [[190,760,1.1],[1480,770,1.1],[1640,870,1.3],[820,720,0.8],[1120,742,0.9]])oo_stump(ctx,x,y,k);
  const Rt=U.rnd(5);for(let i=0;i<70;i++){const x=Rt()*1920,y=oo_slope(x)+30+Rt()*360;oo_tuft(ctx,x,y,0.7+(y-650)/420,i+3);}
  for(let i=0;i<60;i++){const x=Rt()*1920,y=oo_slope(x)+24+Rt()*380;ctx.fillStyle=U.css(Rt()<0.5?oo_c("soilDk"):oo_c("soilLt"),0.7);ctx.beginPath();ctx.ellipse(x,y,2+Rt()*4,1.4+Rt()*2,0,0,U.TAU);ctx.fill();}}
/* the same hills, years later: grass on the slope, the gullies closed, water in the stream, trees along the crest */
const OO_TREES=[[150,742,1.9,3],[520,720,1.55,8],[1010,716,1.75,5],[1420,734,1.6,12],[1800,756,2.0,9]];
function oo_greenPlace(ctx){const S=PK.S,U=PK.u;oo_far(ctx,true);oo_bed(ctx,true);S.begin(ctx,{lw:2.6,far:0.12,sh:5});const sl=oo_ridge(oo_slope,1100,-60,1980,80),gr=U.mix(oo_c("grass"),oo_c("soil"),0.12);
  S.poly(ctx,sl,gr,{grad:[0,640,0,1080,0.18],exact:true});
  ctx.save();ctx.beginPath();U.spline(ctx,sl);ctx.clip();ctx.strokeStyle=U.css(oo_c("grassDk"),0.5);ctx.lineWidth=1.6;
  for(let j=0;j<7;j++){ctx.beginPath();for(let x=-40;x<=1960;x+=80){const y=oo_slope(x)+44+j*56+8*Math.sin(x/190+j);x<0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}
  ctx.fillStyle=U.css(oo_c("soil"),0.5);for(const [x,y,rx,ry] of [[420,930,150,26],[1240,880,120,20],[1640,1000,170,28]]){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,U.TAU);ctx.fill();}ctx.restore();
  const Rt=U.rnd(5);for(let i=0;i<90;i++){const x=Rt()*1920,y=oo_slope(x)+30+Rt()*360;oo_tuft(ctx,x,y,0.7+(y-650)/420,i+3,U.mix(oo_c("grassDk"),oo_c("straw"),Rt()*0.4));}
  S.begin(ctx,{lw:3,far:0.1,sh:5});OO_TREES.forEach(([x,y,k,sd])=>PK.tree(ctx,x,y,k,sd,{}));}
/* a group's nursery: beds of seedlings in their sleeves, under a shade of poles */
const OO_BEDS=[[250,760,560,0],[900,744,520,1],[560,880,640,2],[1300,872,500,3]];
function oo_nurseryPlace(ctx){const S=PK.S,U=PK.u;oo_far(ctx,false);S.begin(ctx,{lw:2.6,far:0.12,sh:5});const yard=[[-40,650],[500,640],[1100,646],[1960,652],[1960,1100,1],[-40,1100,1]];
  S.poly(ctx,yard,U.mix(oo_c("soil"),oo_c("straw"),0.25),{grad:[0,640,0,1080,0.16],exact:true});
  const Rt=U.rnd(15);for(let i=0;i<50;i++){const x=Rt()*1920,y=670+Rt()*380;ctx.fillStyle=U.css(Rt()<0.5?oo_c("soilDk"):oo_c("soilLt"),0.6);ctx.beginPath();ctx.ellipse(x,y,2+Rt()*4,1.4+Rt()*2,0,0,U.TAU);ctx.fill();}
  // the shade: poles at the back, a roof of sticks, its soft shadow on the yard
  ctx.fillStyle="rgba(90,50,40,0.1)";ctx.beginPath();PK.u.pg(ctx,[[300,700],[1640,700],[1760,1000],[160,1000]]);ctx.fill();
  S.fill(ctx,c=>{for(const x of [356,960,1560])U.rrect(c,x-9,250,18,440,5);},U.dk(oo_c("pole"),0.1),{});
  S.poly(ctx,[[250,246,1],[1680,246,1],[1740,206,1],[320,206,1]],oo_c("thatch"),{grad:[0,206,0,246,0.14],exact:true});
  S.line(ctx,c=>{for(let x=300;x<1700;x+=46){c.moveTo(x,246);c.lineTo(x+52,206);}},U.dk(oo_c("thatch"),0.3),0.5);
  // the beds: rows of seedlings in dark sleeves
  S.begin(ctx,{lw:2.4,far:0.1,sh:4});OO_BEDS.forEach(([x,y,w,sd])=>oo_seedBed(ctx,x,y,w,sd));
  // a drum of water by the last pole
  S.fill(ctx,c=>U.rrect(c,1660,560,120,150,14),[112,128,138],{grad:[1780,0,1660,0,0.2]});S.fill(ctx,c=>U.ell(c,1720,562,60,14),oo_c("water"),{});
  S.begin(ctx,{lw:2.8,far:0,sh:5});S.fill(ctx,c=>{for(const x of [300,1620])U.rrect(c,x-12,230,24,620,6);},oo_c("pole"),{grad:[0,230,0,850,0.1]});}
// a bed of seedlings: three rows of them in their sleeves, on a low frame; g: how grown they are
function oo_seedBed(ctx,x,y,w,seed,g){const S=PK.S,U=PK.u,R=U.rnd(seed+20);S.fill(ctx,c=>PK.u.pg(c,[[x,y],[x+w,y],[x+w+30,y+58],[x-30,y+58]]),U.dk(oo_c("soilDk"),0.15),{});
  for(let r=0;r<3;r++){const n=Math.round(w/34),yy=y+10+r*18;for(let i=0;i<n;i++){const xx=x-r*10+10+i*((w+r*20-20)/(n-1)),k=0.62+r*0.07,h=(g==null?0.55+R()*0.45:g);
      PK.seedling(ctx,xx,yy-9*k,k,h,{bare:true});S.fill(ctx,c=>U.rrect(c,xx-7*k,yy-9*k,14*k,17*k,2),oo_c("sleeve"),{w:0.5,flat:true});}}}

/* ---------------------------------------------------------------- what the women carry, drawn in a hand (PK.person's hold) */
const oo_firewood=(ctx,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u,x=h[0]-18*u,y=h[1]-34*u;ctx.save();ctx.translate(x,y);ctx.rotate(-0.1);
  for(let i=0;i<6;i++){const yy=(i-2.5)*17*u+(i%2?3:-2)*u,x0=-150*u+(i*37%40)*u,x1=150*u-(i*23%44)*u;S.fill(ctx,c=>U.capsule(c,[x0,yy],[x1,yy+(i%2?5:-4)*u],11*u,9*u),oo_c("wood",i%3),{w:0.7});}
  S.fill(ctx,c=>{U.rrect(c,-70*u,-56*u,12*u,112*u,4*u);U.rrect(c,56*u,-54*u,12*u,108*u,4*u);},S.tone([206,176,128]),{w:0.6,flat:true});ctx.restore();};
const oo_can=(ctx,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u,x=h[0],y=h[1]+6*u,col=oo_c("can");
  S.fill(ctx,c=>{U.rrect(c,x-62*u,y+30*u,124*u,150*u,22*u);U.rrect(c,x+34*u,y+12*u,26*u,22*u,5*u);},col,{grad:[x+50*u,0,x-70*u,0,0.2]});
  S.line(ctx,c=>{c.moveTo(x-30*u,y+34*u);c.quadraticCurveTo(x,y-22*u,x+30*u,y+34*u);},null,1);};
// a seedling in its sleeve, held up in a hand; g how grown
const oo_inHand=g=>(ctx,h,deg,J)=>{const S=PK.S,U=PK.u,k=J.u*2.2,x=h[0]+8*J.u,y=h[1]-6*J.u;PK.seedling(ctx,x,y-16*k,k,g==null?0.8:g,{bare:true});S.fill(ctx,c=>U.rrect(c,x-7*k,y-17*k,14*k,22*k,3*k),oo_c("sleeve"),{w:0.6,flat:true});};
// a tray of seedlings carried in both arms
const oo_tray=(ctx,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u,x=h[0]+10*u,y=h[1]-10*u;for(let i=0;i<5;i++)PK.seedling(ctx,x-88*u+i*44*u,y-18*u,u*1.5,0.7+0.3*((i*7)%3)/2,{bare:true});
  S.fill(ctx,c=>U.rrect(c,x-116*u,y-22*u,232*u,40*u,8*u),S.tone([176,136,96]),{grad:[0,y-22*u,0,y+18*u,0.14]});};
// a few coins in an open hand; a (0 to 1): how far they are there, so they pass from one hand to the other over a few frames
const oo_coins=a=>(ctx,h,deg,J)=>{if(!(a>0.004))return;const u=J.u;ctx.save();ctx.globalAlpha*=Math.min(1,a);for(const [dx,dy] of [[-10,-22],[8,-26],[0,-34]]){ctx.fillStyle=PK.u.css([232,196,104]);ctx.strokeStyle=PK.u.css([150,112,40]);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(h[0]+dx*u,h[1]+dy*u,13*u,7*u,0,0,PK.u.TAU);ctx.fill();ctx.stroke();}ctx.restore();};

/* ---------------------------------------------------------------- the row of young trees on the slope, planted out: five of seven live */
const OO_ROW={x:[620,760,900,1040,1180,1320,1460],alive:[1,1,0,1,1,0,1],y:x=>oo_slope(x)+150+0.04*(x-620)};
// g: how grown the living ones are (0 to 1); dry: how far the others have died; ticks: when the first living one is counted (a
// time; the others follow), or a function of a tree's place in the row that gives its own time; fresh {i, g}: a new seedling,
// grown to g, planted where the i-th one died
function oo_row(ctx,tt,g,dry,ticks,fresh){OO_ROW.x.forEach((x,i)=>{const y=OO_ROW.y(x);PK.S.begin(ctx,{lw:2.4,far:0,sh:4});
    if(OO_ROW.alive[i])PK.seedling(ctx,x,y,2.2+1.6*g,0.6+0.4*g,{});else if(fresh&&fresh.i===i){if(fresh.g>0.02)PK.seedling(ctx,x,y,2.2,fresh.g,{});}
    else if(dry>0.5)oo_wilted(ctx,x,y,1.3,i+3);else PK.seedling(ctx,x,y,2.2,0.6,{col:PK.u.mix(oo_c("leaf"),oo_c("straw"),dry*1.6)});
    if(ticks!=null&&OO_ROW.alive[i]){const n=OO_ROW.alive.slice(0,i).filter(Boolean).length;PK.tick(ctx,x,y-(150+70*g),26,ag_spr(tt,typeof ticks==="function"?ticks(i):ticks+n*0.45,0.5),null);}});}
// soil sliding down the gullies after rain: a (0 to 1) how much
function oo_run(ctx,tt,a){if(a<=0.004)return;const U=PK.u;ctx.save();ctx.globalAlpha*=a;OO_GULLY.forEach((g,gi)=>{for(let i=0;i<9;i++){const ph=((tt*0.22+i/9+gi*0.37)%1),f=ph*(g.length-1),j=Math.min(g.length-2,f|0),u=f-j,x=U.lerp(g[j][0],g[j+1][0],u),y=U.lerp(g[j][1],g[j+1][1],u),w=U.lerp(g[j][2],g[j+1][2],u);
      ctx.fillStyle=U.css(i%2?oo_c("gullyLt"):oo_c("soilLt"),Math.sin(ph*Math.PI));ctx.beginPath();ctx.ellipse(x+Math.sin(i*2.1)*w*0.5,y,w*0.5,w*0.24,0.3,0,U.TAU);ctx.fill();}});ctx.restore();}
// what every shot of the hills draws over them: the clouds, which drift, and the plot where the food did not take
const oo_sky=(x,tt)=>{PK.S.begin(x,{lw:1.5,far:0.8,sh:3});PK.cloud(x,380+tt*3,150,1.2);PK.cloud(x,1100+tt*2,96,0.9);};
const oo_plot=x=>{PK.S.begin(x,{lw:2.4,far:0,sh:4});[[992,892,1.25,3],[1058,902,1.3,5],[930,884,1.15,8],[1124,908,1.3,11]].forEach(([px,py,k,sd])=>oo_wilted(x,px,py,k,sd));};
AG_PLACES.ooHills=oo_hillsPlace;AG_PLACES.ooNursery=oo_nurseryPlace;AG_PLACES.ooGreen=oo_greenPlace;
// the hills with nobody on them: what a later moment there passes through
AG_BARE.ooHills=(x,tt)=>{oo_sky(x,tt);oo_plot(x);};AG_BARE.ooGreen=(x,tt)=>oo_sky(x,tt);AG_BARE.ooNursery=(x,tt)=>oo_sky(x,tt);

/* ===== Owning the outcome: the university, 2027 and after (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room. This file holds what is this film's own in them: who sits where, the seedling Helena gives Ivy on her first day
   as owner (it grows on the window's sill behind her desk through the film), what Ivy's screen shows and the small cards that come
   out of it, the sensor's count by a teaching room's door, someone who passes on the campus, and the letters of a RACI chart worn
   by the people they belong to. */
AG_PLACES.ooTeam=PK.place.team;AG_PLACES.ooCorner=PK.place.corner;AG_PLACES.ooCampus=PK.place.campus;AG_PLACES.ooRoom=PK.place.lecture;
const OO_T=PK.ROOMS.team,OO_L=PK.ROOMS.lecture,OO_CA=PK.ROOMS.campus,OO_CO=PK.ROOMS.corner;
const OO_HI=PK.hAt(OO_T.mid,OO_T.eye),OO_HB=PK.hAt(OO_T.back,OO_T.eye),OO_HC=PK.hAt(OO_CA.near,OO_CA.eye),OO_IVY={x:560,floor:OO_T.mid};
const oo_hT=fl=>PK.hAt(fl,OO_T.eye),oo_hL=fl=>PK.hAt(fl,OO_L.eye);
const OO_TEACHER=PK.extra(21),OO_ORDER=[5,9,6,8,10,4,7,1,0,2,3];
// a face that speaks from t0 to t1, on a base expression
const oo_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};

/* ---------------------------------------------------------------- the team's room
   o.clock: the time on the wall (null: no hands); o.sam, o.jun, o.ivy: what PK.atDesk takes for each (null: the desk stands empty);
   o.pot: how grown the seedling on the sill is (null: none yet); o.show: what her screen shows; o.behind(x): what stands between
   the back desks and hers (someone at the board); o.away: Ivy has got up, and her chair stands as o.ivy left it (turned); o.bare:
   the room with nobody in it and nothing going on (a blank screen, no steam). Returns {ivy, sam, jun}: their joints. */
function oo_team(x,tt,o){o=o||{};const r={};PK.clock(x,OO_T.clock[0],OO_T.clock[1],OO_T.clock[2],o.clock===undefined?9:o.clock);
  if(o.pot!=null){PK.S.begin(x,{lw:2.6,sh:3});PK.potted(x,OO_T.sill[0],OO_T.sill[1],1.3+0.5*o.pot,0.6+0.4*o.pot);}
  r.sam=PK.atDesk(x,o.sam===null?null:"sam",1230,OO_T.back,OO_HB,Object.assign({t:tt,w:0.45*OO_HB},o.sam||{}));
  r.jun=PK.atDesk(x,o.jun===null?null:"jun",1808,OO_T.back,OO_HB,Object.assign({t:tt+3,flip:true,w:0.45*OO_HB},o.jun||{}));
  if(o.behind)o.behind(x);
  r.ivy=PK.atDesk(x,o.ivy===null||o.away?null:"ivy",OO_IVY.x,OO_IVY.floor,OO_HI,Object.assign({t:tt+1,flip:true,w:0.84*OO_HI,sx:205,screen:"monitor",show:o.bare?null:o.show||oo_scrTicks(1),
    on:(c,D)=>{PK.S.begin(c,{lw:2.6,sh:3});PK.mug(c,D.x1+34,D.top,0.7,PK.col("mug"),tt,!o.bare&&o.steam!==false);}},o.ivy||{}));return r;}
// the room with nobody in it: what a later moment in it passes through (the agent films' AG_BARE)
AG_BARE.ooTeam=(x,tt)=>oo_team(x,tt,{sam:null,jun:null,ivy:null,clock:null,bare:true});
// the seedling in its pot, carried in a hand (PK.person's hold); g how grown
const oo_potHold=g=>(c,h,deg,J)=>{PK.S.begin(c,{lw:2.6,sh:3});PK.potted(c,h[0]+14*J.u,h[1]+34*J.u,1.3+0.5*g,0.6+0.4*g);};
/* what Ivy's screen shows: the refresh's checks, one row each, with its tick; k: how many are ticked (0 to 1); warn: the rows turn
   amber (0 to 1), as when she holds the refresh; no words: the screen is too small for them */
const oo_scrTicks=(k,warn)=>(c,x,y,w,h)=>{const U=PK.u,n=4,rh=h/(n+0.6);warn=warn||0;for(let i=0;i<n;i++){const yy=y+rh*(i+0.55),on=U.clamp(k*n-i,0,1),col=U.mix(PK.C.green,PK.C.amber,warn);
    c.fillStyle=U.css([206,208,204]);c.beginPath();U.rrect(c,x+w*0.1,yy-rh*0.16,w*(0.44+0.1*((i*3)%3)),rh*0.32,4);c.fill();
    c.fillStyle=U.css(U.mix([206,208,204],col,on));c.beginPath();c.arc(x+w*0.84,yy,rh*0.3,0,U.TAU);c.fill();
    // the mark on each round: a tick, which gives way to two bars (a pause) as the row turns amber
    c.strokeStyle="#fff";c.lineWidth=2.4;c.lineCap="round";c.lineJoin="round";
    if(on>0.5&&warn<0.999){c.save();c.globalAlpha*=1-warn;c.beginPath();c.moveTo(x+w*0.84-5,yy);c.lineTo(x+w*0.84-1.5,yy+4);c.lineTo(x+w*0.84+5.5,yy-4);c.stroke();c.restore();}
    if(on>0.5&&warn>0.001){c.save();c.globalAlpha*=warn;c.beginPath();c.moveTo(x+w*0.84-3,yy-5);c.lineTo(x+w*0.84-3,yy+5);c.moveTo(x+w*0.84+3,yy-5);c.lineTo(x+w*0.84+3,yy+5);c.stroke();c.restore();}}};
/* a small card that comes out of Ivy's screen: a box w by h at (bx, by), with a tail to the screen at (tx, ty); draw(c, x, y, w, h)
   fills it. The chart stays small: it is something Ivy looks at, not the picture. */
function oo_callout(c,bx,by,w,h,tx,ty,a,draw){if(a<=0.004)return;const U=PK.u,S=PK.S,col=PK.col("board");c.save();c.globalAlpha*=a;const k=0.94+0.06*a;c.translate(tx,ty);c.scale(k,k);c.translate(-tx,-ty);
  const mx=U.clamp(tx,bx+50,bx+w-50);c.beginPath();U.pg(c,[[mx-20,by+h-6],[mx+20,by+h-6],[U.lerp(mx,tx,0.8),U.lerp(by+h,ty,0.8)]]);c.lineJoin="round";c.lineWidth=5;c.strokeStyle=U.css(S.ink);c.stroke();c.fillStyle=U.css(col);c.fill();
  PK.box(c,bx,by,w,h,18,col,1);c.fillStyle=U.css(col);c.beginPath();U.pg(c,[[mx-17,by+h-6],[mx+17,by+h-6],[mx+15,by+h+3],[mx-15,by+h+3]]);c.fill();draw(c,bx,by,w,h);c.restore();}
// the forty rooms' counts, week by week: level, then down to about a quarter; p: how far the line is drawn
function oo_dropChart(c,x,y,w,h,p){const U=PK.u,v=[1,0.96,1.03,1,0.97,1.02,0.27,0.24,0.25],x0=x+38,x1=x+w-38,y0=y+h-84,y1=y+76,px=i=>U.lerp(x0,x1,i/(v.length-1)),py=q=>U.lerp(y0,y1,q/1.1);
  ag_T(c,"FORTY ROOMS",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});
  c.save();c.lineCap="round";c.lineJoin="round";c.strokeStyle=U.css(PK.C.mut,0.5);c.lineWidth=3;c.beginPath();c.moveTo(x0,y0+6);c.lineTo(x1,y0+6);c.stroke();
  c.setLineDash([6,8]);c.beginPath();c.moveTo(x0,py(1));c.lineTo(x1,py(1));c.stroke();c.setLineDash([]);
  const n=U.clamp(p,0,1)*(v.length-1);c.lineWidth=6;
  for(let i=0;i<v.length-1&&i<n;i++){const u=Math.min(1,n-i);c.strokeStyle=U.css(i>=5?PK.C.amber:PK.C.orange);c.beginPath();c.moveTo(px(i),py(v[i]));c.lineTo(U.lerp(px(i),px(i+1),u),U.lerp(py(v[i]),py(v[i+1]),u));c.stroke();}
  c.restore();ag_T(c,"Down to about a quarter",x+30,y+h-28,{w:700,size:28,col:PK.C.amber,a:U.pin(p,0.8,0.2)});}
// one room, one hour: four counts now arrive, and the model kept only the first; p: how far the card has filled
function oo_hourCard(c,x,y,w,h,p){const U=PK.u,n=["9","31","34","33"],tm=[":00",":15",":30",":45"],cx=i=>x+68+i*((w-136)/3);
  ag_T(c,"ONE ROOM, ONE HOUR",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});
  n.forEach((s,i)=>{const a=U.pin(p,0.1+i*0.12,0.15);ag_T(c,s,cx(i),y+124,{w:800,size:44,align:"center",col:i?PK.C.orange:PK.C.amber,a:i?a*(1-0.55*U.pin(p,0.75,0.2)):a});ag_T(c,tm[i],cx(i),y+166,{w:600,size:28,align:"center",col:PK.C.mut,a});});
  const k=U.pin(p,0.62,0.2);if(k>0){c.save();c.globalAlpha*=k;c.strokeStyle=U.css(PK.C.amber);c.lineWidth=5;c.beginPath();c.ellipse(cx(0),y+110,44,36,0,0,U.TAU);c.stroke();c.restore();}
  ag_T(c,"kept",cx(0),y+h-26,{w:700,size:28,align:"center",col:PK.C.amber,a:k});ag_T(c,"dropped",(cx(1)+cx(3))/2,y+h-26,{w:700,size:28,align:"center",col:PK.C.mut,a:U.pin(p,0.78,0.2)});}

/* ---------------------------------------------------------------- a teaching room
   o.n: how many seats are taken (11: full); o.a fades the class, all of it as one picture, as the counts would have it; o.open: the
   door (0 to 1); o.seen: the sensor has just seen someone (0 to 1); o.teacher: false, nobody at the board; o.between: PK.audience's,
   for someone on the way to a seat. oo_count writes what the sensor counts beside it. */
const OO_NOTES={lean:2,head:3,aN:[24,74,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]},OO_NOTES2={lean:3,head:-4,aN:[28,86,"grip"],aF:[8,18],lN:[-2,-2],lF:[5,4]};
// the teacher's notes, a sheet in her hand
const oo_notes=(c,h,deg,J)=>{const u=J.u;PK.S.begin(c,{lw:2.2,sh:3});PK.S.poly(c,[[h[0]-14*u,h[1]-104*u,1],[h[0]+62*u,h[1]-112*u,1],[h[0]+70*u,h[1]-8*u,1],[h[0]-6*u,h[1],1]],PK.col("board"),{exact:true});
  PK.S.line(c,cc=>{for(let i=0;i<4;i++){cc.moveTo(h[0]+2*u,h[1]-(88-i*20)*u);cc.lineTo(h[0]+52*u,h[1]-(93-i*20)*u);}},PK.C.mut,0.5);};
function oo_class(x,tt,o){o=o||{};const d=OO_L.door,n=o.n==null?11:o.n,a=o.a==null?1:o.a,A={order:OO_ORDER,look:o.look==null?0.6:o.look};
  if(o.open)PK.door(x,d.x,800,d.w,d.h,{col:PK.col("doorCool"),glass:true,open:o.open,beyond:[196,190,180]});
  PK.sensor(x,OO_L.sensor[0],OO_L.sensor[1],o.seen||0);
  const who=c=>{PK.audience(c,tt,n,Object.assign({between:o.between},A));
    if(o.teacher!==false)PK.person(c,OO_TEACHER,1560,856,oo_hL(856),PK.poseMix(OO_NOTES,OO_NOTES2,0.5+0.5*Math.sin(tt*0.7)),{t:tt,flip:true,hold:oo_notes,expr:{brow:0.3,smile:0.45,open:PK.talk(tt,0,1e9)*0.5}});};
  if(a>=0.999){who(x);return;}
  // the empty chairs, then everyone over them as one picture, so nobody shows through anybody
  PK.audience(x,tt,0,A);if(a<=0.004)return;
  const cv=x.canvas,[bc,bx]=ag_buf("ooClass",cv.width,cv.height);bx.setTransform(x.getTransform());who(bx);
  x.save();x.setTransform(1,0,0,1,0,0);x.globalAlpha*=a;x.drawImage(bc,0,0);x.restore();}
AG_BARE.ooRoom=(x,tt)=>oo_class(x,tt,{n:0,teacher:false});
const oo_count=(x,text,a,col)=>PK.tag(x,OO_L.sensor[0]+62,OO_L.sensor[1],text,a==null?1:a,{align:"left",col:col||PK.C.orange,weight:800});
// someone who comes in at the door and walks to a seat in the back row, then sits: from t0, over d seconds
function oo_toSeat(x,tt,who,seat,t0,d){if(tt<t0)return 0;const x0=OO_L.door.x+24,o={expr:"neutral",shade:0,a:PK.u.pin(tt,t0,0.4)};
  if(tt<t0+d)PK.walk(x,who,tt,{x0,x1:seat.x,t0,t1:t0+d,floor:xx=>PK.u.lerp(812,seat.fl,PK.u.clamp((xx-x0)/(seat.x-x0),0,1)),h:oo_hL},o);
  else PK.person(x,who,seat.x,seat.fl,oo_hL(seat.fl),PK.poseSit(PK.u.pin(tt,t0+d,0.7)),Object.assign(o,{t:tt}));
  return PK.u.pio(tt,t0+0.1,t0+0.9,0.25);}

/* ---------------------------------------------------------------- the campus
   Someone who passes, away from the people the film follows: in from the right along the front path, then up the path to the
   entrance, where they go in (o.out: the other way: out of the entrance, down the path and off to the right). t0: when they set
   off. They keep one pace in the picture's depth too (t2 seconds and n2 strides up the path), so their feet don't slide. */
const OO_WAY={a:[2040,884],b:[1300,884],d:[1478,606],v:190,n2:5,t2:7};
function oo_passer(x,tt,who,t0,o){o=o||{};const U=PK.u,W=OO_WAY,e=OO_CA.eye,d1=(W.a[0]-W.b[0])/W.v,T=d1+W.t2,amp=PK.ampOf(who);let u=tt-t0;if(u<0||u>T)return null;if(o.out)u=T-u;
  const n1=(W.a[0]-W.b[0])/PK.strideOf(PK.hAt(W.a[1],e),amp);let px,fl,step,k=0;
  if(u<d1){px=U.lerp(W.a[0],W.b[0],u/d1);fl=W.a[1];step=n1*u/d1;}
  else{k=(u-d1)/W.t2;fl=e+1/U.lerp(1/(W.b[1]-e),1/(W.d[1]-e),k);px=U.lerp(W.b[0],W.d[0],(W.b[1]-fl)/(W.b[1]-W.d[1]));step=n1+W.n2*k;}
  const turn=U.pin(u,d1-0.25,0.5);
  return PK.person(x,who,px,fl,PK.hAt(fl,e),PK.poseWalk(o.out?n1+W.n2-step:step,1,amp),{t:tt,flip:o.out?turn:1-turn,far:0.1+0.3*k,a:1-U.pin(u,T-0.7,0.7),expr:"neutral"});}

/* ---------------------------------------------------------------- Helena's corner: Helena and Ivy at the round table
   o.lean (0 to 1): Helena leans in to ask; o.up (0 to 1): Ivy looks up, and sits up; o.he, o.ie: their faces; o.ask (0 to 1):
   Helena's open hand; o.t0: when the shot starts (two people cross the lawn outside once, from then). Returns {helena, ivy}. */
const OO_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},OO_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const OO_SITI={mode:"sit",lean:9,head:17,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]},OO_SITI2={mode:"sit",lean:1,head:-3,aN:[24,74,"grip"],aF:[28,78,"grip"],lN:[86,6],lF:[82,-3]};
// a closed notebook lying on the table
const oo_pad=(c,x,y)=>{const S=PK.S,c0=PK.col("laptop");S.poly(c,[[x-86,y-6,1],[x+70,y-12,1],[x+92,y+6,1],[x-70,y+14,1]],c0,{exact:true});S.poly(c,[[x-84,y-12,1],[x+68,y-18,1],[x+70,y-12,1],[x-86,y-6,1]],PK.u.lt(c0,0.25),{w:0.6,flat:true,exact:true});};
function oo_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=OO_CO,lean=o.lean||0,up=o.up||0,ask=o.ask||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5};
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[7,t0+1,22,false,34,92],[12,t0+7,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(OO_SITH,OO_SITH2,lean),ip=PK.poseMix(OO_SITI,OO_SITI2,up);
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"lower"});PK.person(x,"ivy",ix,F,H,ip,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);oo_pad(x,tx+52,ty-8);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx-60,ty+10,0.9,PK.col("mug2"),tt,true);
  // Ivy's mug, in both her hands: drawn under them, in her own mirrored picture
  const mx=1140,my=ty+8-8*up,mug=(c,h,deg,J)=>{S.begin(c,{lw:2.6,far:0,sh:3});PK.mug(c,2*ix-mx,my,0.9,PK.col("mug"),tt,true);S.begin(c,{lw:U.clamp(H*0.0056,1.4,6.5),sh:U.clamp(H*0.0078,1.5,8.5)});};
  const helena=PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"upper",expr:o.he,gaze:[1,0.2],reachN:[U.lerp(790,838,ask),ty-4-40*ask],reachF:[806,ty-12]});
  const ivy=PK.person(x,"ivy",ix,F,H,ip,{t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:[1,U.lerp(1,-0.2,up)],under:mug,reachN:[mx+20,my-30],reachF:[mx-22,my-28]});
  return{helena,ivy};}

/* ---------------------------------------------------------------- words this film puts in the picture */
// a letter of the RACI chart, worn over the head of the person it belongs to: a round badge; big: the one A
function oo_letter(x,J,s,a,big){if(a<=0.004)return;const U=PK.u,r=big?40:30,cx=J.hc[0],cy=J.hc[1]-J.p.head*J.u*0.62-r-14,k=0.6+0.4*U.clamp(a,0,1);x.save();x.globalAlpha*=U.clamp(a,0,1);
  x.fillStyle=U.css(big?PK.C.blue:PK.col("board"));x.beginPath();x.arc(cx,cy,r*k,0,U.TAU);x.fill();x.lineWidth=3;x.strokeStyle=U.css(big?U.dk(PK.C.blue,0.3):PK.S.ink);x.stroke();
  ag_T(x,s,cx,cy+(big?15:12),{w:800,size:big?44:34,align:"center",col:big?PK.C.white:PK.C.ink});x.restore();}
// where a mark worn over someone's head goes: [x, y]
const oo_over=(J,r)=>[J.hc[0],J.hc[1]-J.p.head*J.u*0.62-r-14];
// a line between two marks worn over two heads, bowed upwards: what joins two people's parts of the work; p: how far it is drawn
function oo_link(x,A,B,p,col,a){if(a<=0.004||p<=0)return;const U=PK.u,mx=(A[0]+B[0])/2,my=Math.min(A[1],B[1])-70,n=24;x.save();x.globalAlpha*=U.clamp(a,0,1);x.strokeStyle=U.css(col||PK.C.amber);x.lineWidth=5;x.lineCap="round";x.setLineDash([14,13]);x.beginPath();
  for(let i=0;i<=n*U.clamp(p,0,1);i++){const u=i/n,q=[(1-u)*(1-u)*A[0]+2*u*(1-u)*mx+u*u*B[0],(1-u)*(1-u)*A[1]+2*u*(1-u)*my+u*u*B[1]];i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();x.restore();}
// a round mark with two bars: something held, not stopped for good
function oo_pause(c,x,y,r,a,col){if(a<=0.004)return;const U=PK.u;c.save();c.globalAlpha*=U.clamp(a,0,1);c.fillStyle=U.css(col||PK.C.amber);c.beginPath();c.arc(x,y,r,0,U.TAU);c.fill();
  c.strokeStyle="#fff";c.lineWidth=r*0.26;c.lineCap="round";c.beginPath();c.moveTo(x-r*0.26,y-r*0.38);c.lineTo(x-r*0.26,y+r*0.38);c.moveTo(x+r*0.26,y-r*0.38);c.lineTo(x+r*0.26,y+r*0.38);c.stroke();c.restore();}
// the check Ivy adds, as a card from her screen: its three lines come one by one (la: how far each has come in)
function oo_checkCard(c,x,y,w,h,la){const U=PK.u;ag_T(c,"IVY'S NEW CHECK",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.blue});
  ag_T(c,"A drop like this one",x+30,y+104,{w:700,size:30,a:U.clamp(la[0],0,1)});oo_pause(c,x+48,y+138,18,la[1]);ag_T(c,"holds the refresh",x+80,y+148,{w:800,size:30,col:PK.C.amber,a:U.clamp(la[1],0,1)});
  ag_T(c,"before anyone reads it",x+30,y+192,{w:700,size:30,a:U.clamp(la[2],0,1)});}
// a sheet pinned to the whiteboard, with a kick and a line of words; a: how far it has come in
function oo_pinned(x,bx,by,kick,title,a,col){if(a<=0.004)return;const U=PK.u,w=Math.max(ag_tw(x,kick.toUpperCase(),{w:800,size:28,ls:3}),ag_tw(x,title,{w:800,size:32}))+52,h=112;x.save();x.globalAlpha*=U.clamp(a,0,1);const k=0.94+0.06*a;x.translate(bx+w/2,by);x.scale(k,k);x.translate(-bx-w/2,-by);
  PK.S.begin(x,{lw:2.4,sh:4});PK.sheet(x,bx,by,w,h,{col:PK.col("board"),pin:col||PK.C.blue,r:6});ag_T(x,kick.toUpperCase(),bx+26,by+50,{w:800,size:28,ls:3,col:col||PK.C.blue});ag_T(x,title,bx+26,by+92,{w:800,size:32});x.restore();}

/* ===== Owning the outcome: the chapters, shot by shot =====
   Every picture has people in it, whole, doing what the line says: the words on screen are where and when, a name, or what someone
   says. Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's
   recorded again; the score (tools/score.py) takes the same words. A shot is one stay in a place: the camera glides between its
   keys, and everyone in it moves as one function of time, so nothing jumps; between places the film cuts, or dissolves where the
   whole picture changes (Kenya and the university). Sizes are in the 1920 x 1080 frame; people's sizes come from each place's eye
   line (oo_h on the hills, oo_hT in the team's room, oo_hL in a teaching room, OO_HC on the campus). */
const OO_LAST="Own what it's for, not only what you did.";
const oo_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,1,"Owning the outcome",a);}};
// a card in the frame's own space, so it stays put while the camera glides: in at t0, out at t1; o.right: at the top right
function oo_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.right?"right":"left"});}
const oo_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const oo_tag=(x,tt,t0,t1,px,py,text,o)=>PK.tag(x,px,py,text,ag_io(tt,t0,t1==null?1e9:t1,0.4),o);
const oo_say=(x,J,tt,t0,t1,lines,cam,o)=>PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));
const OO_KNEEL={mode:"kneel",lean:30,head:-6,aN:[52,22,"grip"],aF:[20,34],lN:[28,-90],lF:[40,-88],fN:70,fF:70},OO_KNEEL2={mode:"kneel",lean:22,head:-30,aN:[44,30,"grip"],aF:[18,36],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
const OO_BEND={lean:17,head:9,aN:[10,58],aF:[16,66],lN:[-2,-2],lF:[5,4]},OO_POUR={lean:22,head:11,aN:[26,80,"grip"],aF:[14,60],lN:[-2,-2],lF:[5,4]},OO_CARRY={lean:0,head:0,aN:[28,74,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]},OO_SHOW={lean:2,head:-2,aN:[36,100,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};

/* ---------------------------------------------------------------- 1. Trees still standing: Kenya, the 1970s to 2004 */
scene("trees",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=OO_CAST;
  const tP=c.paid-0.4,tGr=c.fifty-0.6,tN=c.nobel-0.5,tU=c.data-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // the hills, their forests cleared: the women tell Maathai what is going wrong
    {at:0,place:"ooHills",keys:[[0,960,520,1.0],[c.women-0.4,810,630,1.2],[c.cleared-0.6,960,520,1.0],[c.soil-0.5,1080,610,1.14]],d:2.6,draw:(x,tt,cam)=>{
      oo_sky(x,tt);oo_run(x,tt,ag_io(tt,c.soil-0.2,c.harm-0.5,0.8));oo_plot(x);
      const sp=[w("streams","streams",-0.2),w("streams","food",-0.2),w("streams","walk",-0.3),c.cleared-0.6],up=ag_io(tt,c.cleared-0.4,c.soil-0.6,0.8),dn=ag_in(tt,c.soil-0.3,0.8);
      // each takes in what the others say, with a look or a nod; the one at the seedlings looks up to speak, and goes back to them
      const Jn=PK.person(x,K.nya,560,846,oo_h(846),"armful",Object.assign({t:tt,hold:oo_firewood},PK.face(tt,{expr:"worry",gaze:[1,-0.7*up]},
        [[c.when+1.2,"look",2.4,[1,0.7]],[c.women+1.6,"look",2.2,[-1,0]],[sp[0]+1.2,"nod"],[sp[1]+1.3,"nod"],[sp[2],"say",sp[3]-sp[2]],[c.sense+0.6,"look",2.6,[0.3,0.8]]])));
      const Jm=PK.walk(x,K.mum,tt,{x0:60,x1:330,t0:1.0,t1:c.women+2.2,floor:xx=>U.lerp(770,916,U.clamp((xx-60)/270,0,1)),h:oo_h,phase:0.7*Math.max(0,tt-1.0),arms:{aN:[3,5,"grip"]},then:"can"},
        Object.assign({hold:oo_can},PK.face(tt,{expr:"worry",gaze:[1,-0.6*up]},[[sp[0],"say",sp[1]-sp[0]],[sp[1]+1.6,"nod"],[sp[2]+2.4,"nod"],[c.sense+1.4,"look",2.4,[1,0.7]]])));
      const lk=ag_io(tt,c.women+3.4,sp[2]+1.0,0.9),bd=ag_io(tt,c.women+2.6,c.cleared-0.8,1),at=PK.among(tt,[[984,852],[1028,850],[954,858]],2.4,sp[2]+1.6);
      const Jw=PK.person(x,K.wan,826,900,oo_h(900),PK.poseMix(OO_KNEEL,OO_KNEEL2,lk),{t:tt,expr:oo_says("worry",tt,sp[1],sp[2]),gaze:[1,0.5-1.1*lk],reachN:[U.lerp(at[0],972,lk),U.lerp(at[1],846,lk)],reachF:[880,838]});
      const Ja=PK.person(x,K.maathai,1262,872,oo_h(872),PK.poseMix("listen",OO_BEND,bd),Object.assign({t:tt,flip:true,reachN:[1242,744],reachNk:bd,reachF:[1224,738],reachFk:bd},
        PK.face(tt,{expr:"listen",gaze:[1,0.5*bd-0.6*up+0.4*dn]},[[sp[0]+1.4,"nod"],[sp[1]+1.2,"nod"],[sp[2]+1.6,"nods"],[c.sense+1.0,"think",3.2]])));
      oo_tag(x,tt,w("women","rural",-0.1),sp[0]-0.3,470,348,"Rural women");PK.nameTag(x,1262,338,"Wangari Maathai","A biologist",ag_io(tt,w("women","Maathai",-0.2),sp[0]-0.3,0.4));
      oo_say(x,Jm,tt,sp[0],sp[1],["The stream is drying up."],cam);oo_say(x,Jw,tt,sp[1],sp[2],["Our food is less sure."],cam,{rise:70,dx:-110});oo_say(x,Jn,tt,sp[2],sp[3],["Each year, we walk further","for firewood."],cam);
      oo_tag(x,tt,w("cleared","farms",-0.1),c.soil-0.7,330,300,"Farms");oo_tag(x,tt,w("cleared","tea",-0.1),c.soil-0.7,900,330,"Tea and coffee, to sell");oo_tag(x,tt,w("cleared","plantations",-0.1),c.soil-0.7,1560,300,"Timber");
      oo_tag(x,tt,c.sense-0.1,c.soil-0.7,960,232,"Each choice made sense to those who made it",{weight:800});
      oo_tag(x,tt,w("soil","soil",-0.1),c.harm-0.7,1560,790,"The soil washed away",{col:PK.C.amber});oo_tag(x,tt,w("soil","springs",-0.1),c.harm-0.7,1470,470,"The springs ran dry",{col:PK.C.amber});}},
    // who carried it: the women, at their work, and their children; then Maathai comes with a seedling
    {at:c.harm-0.4,place:"ooHills",later:true,keys:[[c.harm-0.4,960,590,1.06],[c.change-0.5,1000,610,1.14]],d:2.4,draw:(x,tt,cam)=>{
      oo_sky(x,tt);oo_plot(x);const t0=c.harm-0.4,look=ag_in(tt,c.change-0.2,0.8);
      PK.person(x,K.nya,1590,862,oo_h(862),"armful",{t:tt,flip:true,hold:oo_firewood,expr:"neutral",gaze:[1,-0.4*look]});
      const mw={x0:640,x1:300,t0:t0+0.5,t1:c.harm+5.2,floor:916,h:oo_h(916),arms:{aN:[3,5,"grip"]},then:"can"};
      PK.person(x,K.boy,1170,902,oo_h(902)*0.74,"stand",{t:tt,flip:true,expr:"neutral",gaze:[1,0.5-0.9*look]});
      PK.person(x,K.wan,826,900,oo_h(900),OO_KNEEL,{t:tt,expr:"worry",gaze:[1,0.5-1.1*look],reachN:PK.among(Math.min(tt,c.change-0.6),[[984,852],[1028,850],[954,858]],2.2,t0+0.8),reachF:[880,838]});
      PK.walk(x,K.mum,tt,mw,{hold:oo_can,expr:"neutral"});PK.walk(x,K.girl,tt,Object.assign({},mw,{x0:724,x1:384,floor:924,h:oo_h(924)*0.7,arms:null,then:"stand",phase:0.3}),{expr:"neutral"});
      const Ja=PK.walk(x,K.maathai,tt,{x0:2010,x1:1370,t0:c.change-1.4,t1:c.change+1.6,floor:880,h:oo_h(880),arms:{aN:OO_SHOW.aN},then:OO_SHOW},{hold:oo_inHand(0.8),expr:"smile"});
      oo_tag(x,tt,w("harm","fetched",-0.1),c.change-0.6,420,372,"Water");oo_tag(x,tt,w("harm","gathered",-0.1),c.change-0.6,1590,372,"Firewood");oo_tag(x,tt,w("harm","grew",-0.1),c.change-0.6,880,496,"Food");
      oo_tag(x,tt,w("harm","harm",-0.2),c.change-0.6,960,262,"The harm fell first on them, and on their children",{col:PK.C.amber,weight:800});
      oo_tag(x,tt,w("change","women",-0.4),c.start-0.8,Ja.hc[0]-40,Ja.hc[1]-170,"Bring the trees back",{col:PK.C.green,weight:800});}},
    // 1977: a group's nursery
    {at:c.start-0.4,cut:true,place:"ooNursery",keys:[[c.start-0.4,960,560,1.0],[c.nursery-0.4,900,630,1.16]],d:3,draw:(x,tt,cam)=>{
      oo_sky(x,tt);const t0=c.start-0.4;
      // she waters the bed: the can goes out over the seedlings and comes back, again and again
      PK.person(x,K.nya,846,806,oo_h(806),PK.poseMix(OO_BEND,OO_POUR,ag_io((tt-t0)%4.6,0.3,2.9,0.7)),{t:tt,hold:oo_can,expr:"neutral",gaze:[1,0.8]});
      PK.person(x,K.maathai,1500,850,oo_h(850),PK.poseMix(OO_SHOW,"listen",ag_in(tt,c.nursery-0.2,0.8)),{t:tt,flip:true,hold:oo_inHand(0.9),expr:oo_says("smile",tt,c.start+0.4,c.nursery-0.8)});
      PK.walk(x,K.mum,tt,{x0:2010,x1:1720,t0:t0+0.2,t1:t0+3.2,floor:868,h:oo_h(868),arms:{aN:[16,84,"grip"],aF:[24,92,"grip"],lean:-4},then:"armful"},
        Object.assign({hold:oo_tray},PK.face(tt,{expr:"smile",gaze:[1,0]},[[t0+4.6,"look",2.6,[1,0.7]],[c.nursery+0.9,"nod"]])));
      // the girl lifts her seedling to look at it; the woman beside her sets hers in the bed, one after another, and looks up as Maathai speaks
      const lift=Math.max(ag_io(tt,t0+2.2,t0+5.6,0.8),ag_io(tt,c.nursery+1.4,c.nursery+4.4,0.8));
      PK.person(x,K.girl,372,938,oo_h(938)*0.7,PK.poseMix(OO_CARRY,OO_SHOW,0.3+0.7*lift),{t:tt,hold:oo_inHand(0.6),expr:PK.exprMix("smile","glad",lift),gaze:[1,0.5-0.7*lift]});
      PK.person(x,K.wan,500,930,oo_h(930),OO_KNEEL,Object.assign({t:tt,reachN:PK.among(tt,[[612,866],[652,864],[588,870]],2.3,t0+0.6),reachF:[586,862]},
        PK.face(tt,{expr:"neutral",gaze:[1,0.6]},[[c.start+2.6,"look",2.2,[1,-0.7]],[c.nursery+0.4,"smile",3.4]])));
      oo_tag(x,tt,w("nursery","nurseries",-0.3),c.paid-0.9,960,300,"Their own nurseries");oo_tag(x,tt,w("nursery","seeds",-0.2),c.paid-0.9,1180,700,"From the seeds of local trees");}},
    // months later: paid for each tree still alive; they answer for living trees
    {at:tP,cut:true,place:"ooHills",keys:[[tP,1040,610,1.12],[c.answer-0.4,1180,640,1.22]],d:2.6,draw:(x,tt,cam)=>{
      oo_sky(x,tt);const t1=w("paid","not",0.2),tE=c.answer-1.6,wk={x0:520,x1:1626,t0:tP+0.3,t1,floor:xx=>OO_ROW.y(xx)+44,h:oo_h,then:"stand"};
      // she walks the row and each living tree is counted as she passes; Maathai pays her; then she turns back to the last tree
      const pay=ag_io(tt,t1+0.3,tE,0.5),take=ag_io(tt,t1+0.5,tE,0.5),got=ag_in(tt,t1+0.9,0.25),turn=ag_in(tt,c.answer-0.9,0.4),kn=ag_in(tt,c.answer-0.3,0.9);
      oo_row(x,tt,0.5,1,i=>tP+0.3+(t1-tP-0.3)*(0.1+0.86*(OO_ROW.x[i]-520)/1106));
      const q=PK.walkAt(tt,wk),fm=OO_ROW.y(1790)+50,hy=q.floor-oo_h(q.floor)*0.56,ry=OO_ROW.y(1460),face=PK.exprMix(PK.exprMix("neutral","glad",got),"smile",kn);
      PK.person(x,K.maathai,1790,fm,oo_h(fm),"stand",{t:tt,flip:true,expr:"smile",gaze:[1,0.5*kn],reachN:[1712,hy],reachNk:pay,hold:oo_coins(pay*(1-got))});
      if(kn<=0)PK.walk(x,K.wan,tt,wk,{flip:turn,expr:face,gaze:[1,0.6*(1-ag_in(tt,t1,0.4))],reachN:[1716,hy],reachNk:take,hold:oo_coins(take*got)});
      else PK.person(x,K.wan,q.x,q.floor,q.h,PK.poseMix("stand",OO_KNEEL,kn),{t:tt,flip:turn,expr:face,gaze:[1,0.5*kn],reachN:[1482,ry-74],reachNk:kn,reachF:[1494,ry-44],reachFk:kn});
      oo_tag(x,tt,w("paid","not",-0.1),c.answer-0.5,1040,470,"Not for each seedling planted",{col:PK.C.mut});
      oo_tag(x,tt,w("answer","living",-0.3),tGr+0.2,1190,520,"Living trees, not the planting",{col:PK.C.green,weight:800});}},
    // the same hills, years later: more than fifty million trees; then 2004
    {at:tGr,place:"ooGreen",dis:1.2,keys:[[tGr,1085,630,1.22],[tGr+0.3,960,540,1.0]],d:3.4,draw:(x,tt,cam)=>{
      oo_sky(x,tt);const a=ag_in(tt,tGr+1.3,0.6);
      PK.walk(x,K.nya,tt,{x0:150,x1:640,t0:tGr+1.3,t1:c.give+3.6,floor:866,h:oo_h(866),arms:{aN:[16,84,"grip"],aF:[24,92,"grip"],lean:-4},then:"armful"},{hold:oo_firewood,expr:"smile",a});
      PK.person(x,K.wan,1150,884,oo_h(884),"stand",{t:tt,flip:true,expr:"smile",a,gaze:[1,0.3]});
      PK.person(x,K.boy,1010,894,oo_h(894)*0.74,"stand",{t:tt,expr:"glad",a});PK.person(x,K.girl,900,900,oo_h(900)*0.7,PK.poseMix("stand","wave",ag_io(tt,c.fifty+1,c.fifty+3,0.5)),{t:tt,expr:"glad",a});
      oo_tag(x,tt,w("give","fuel",-0.1),tN-0.3,520,356,"Fuel");oo_tag(x,tt,w("give","food",-0.1),tN-0.3,955,468,"Food");oo_tag(x,tt,w("give","shelter",-0.1),tN-0.3,1420,330,"Shelter");
      oo_tag(x,tt,w("give","thousands",-0.2),tN-0.3,960,216,"An income for thousands of women",{col:PK.C.green,weight:800});}},
    {at:tN,place:"ooGreen",later:true,keys:[[tN,960,540,1.0],[tN+0.2,940,610,1.15]],d:2.6,draw:(x,tt,cam)=>{
      oo_sky(x,tt);PK.person(x,K.nya,620,872,oo_h(872),"stand",{t:tt,expr:"smile",gaze:[1,0.5]});
      PK.person(x,K.wan,1250,880,oo_h(880),"stand",{t:tt,flip:true,expr:"smile",gaze:[1,0.5]});PK.person(x,K.girl,1360,892,oo_h(892)*0.7,"stand",{t:tt,flip:true,expr:"glad"});
      PK.S.begin(x,{lw:2.6,far:0,sh:4});PK.seedling(x,1010,892,3.4,1,{});
      const Je=PK.person(x,K.elder,890,896,oo_h(896),OO_KNEEL,{t:tt,expr:"smile",gaze:[1,0.5],reachN:[992,880],reachF:[966,872]});
      PK.nameTag(x,Je.hc[0]-20,Je.hc[1]-150,"Wangari Maathai","",ag_io(tt,w("nobel","Wangari",-0.2),tU-0.3,0.4));}},
    // the same in data work: Ivy at her desk, a job that ran, a report that was sent
    {at:tU,place:"ooTeam",dis:1.0,keys:[[tU,835,590,1.15],[c.own+0.6,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      const up=ag_in(tt,c.own+0.2,1.0),k=ag_in(tt,w("data","job",-0.2),0.6)*0.5+ag_in(tt,w("data","report",-0.2),0.6)*0.5;
      oo_team(x,tt,{clock:9.1,show:oo_scrTicks(k),ivy:{work:1-0.8*up,expr:PK.exprMix("neutral","think",up),gaze:[1,-0.8*up],nod:-0.1*up}});
      const a1=ag_io(tt,w("data","job",-0.2),c.breath-0.2,0.4),a2=ag_io(tt,w("data","report",-0.2),c.breath-0.2,0.4);
      PK.tag(x,330,286,"A job that ran",a1,{align:"left"});PK.tick(x,300,286,22,a1);PK.tag(x,330,350,"A report that was sent",a2,{align:"left"});PK.tick(x,300,350,22,a2);}}
  ]);
  oo_card(ctx,S,t,c.when-0.2,w("women","rural",-0.6),{kick:"Kenya",title:"The 1970s",sub:"The central highlands"},{y:84});
  oo_card(ctx,S,t,c.start+0.1,c.nursery-0.4,{kick:"1977",title:"The Green Belt Movement",sub:"With the National Council of Women of Kenya",col:PK.C.green},{y:84});
  oo_card(ctx,S,t,c.paid+0.1,c.answer-0.5,{kick:"Months later",title:"Paid for each tree still alive",col:PK.C.green},{y:84});
  oo_card(ctx,S,t,c.fifty+0.1,c.give-0.3,{kick:"Kenya, since 1977",title:"More than 50 million trees",col:PK.C.green},{y:84});
  oo_card(ctx,S,t,c.nobel+0.2,tU-0.3,{kick:"2004",title:"The Nobel Peace Prize",sub:"The first African woman to win it"},{y:84});
  oo_imagined(ctx,S,t,tU+0.8,c.breath-0.2);
  PK.title(ctx,S,t,c.breath+0.2,"Owning the outcome","Answer for what it's for","Leading data people · Ownership and performance",{side:"right"});
});

/* ---------------------------------------------------------------- 2. What she owns: Thursday 1 July */
// the two sheets Ivy pins to the team's board on her first day as owner: the product, and its promise (a1, a2: how far each is up)
const oo_sheets=(cx,a1,a2)=>{oo_pinned(cx,806,226,"Data product","Teaching space use",a1,PK.C.orange);oo_pinned(cx,806,352,"Its promise","Every Monday by 7:00",a2,PK.C.blue);};
scene("owns",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tB=w("owner","becomes"),tR=c.what-0.4,tM=c.mesh-0.4,tC=c.readers-0.5,tL=c.truly-0.5,tD=w("many","Sam",-0.5);
  ag_shots(ctx,S,t,sc.dur,[
    // her first day as owner: Helena brings her a seedling in a pot. The shot opens as the chapter before ends (Ivy looking up from
    // her screen), so only the title card fades
    {at:0,place:"ooTeam",keys:[[0,960,540,1.0],[tB-1.6,780,590,1.18]],d:2.6,draw:(x,tt,cam)=>{
      const st=ag_in(tt,0.9,1.2),turn=ag_in(tt,tB-1.2,0.5),up=ag_in(tt,tB-0.8,0.8),th=tB+1.0,rk=ag_in(tt,tB+0.3,0.7),pull=ag_in(tt,th+0.2,0.9),hand=[U.lerp(676,628,pull),U.lerp(588,604,pull)],seen=ag_in(tt,tB+0.6,0.6);
      const R=oo_team(x,tt,{clock:9.1,sam:{work:1-0.8*seen,expr:PK.exprMix("neutral","smile",seen),gaze:[1,-0.3*seen],turn:seen},jun:{work:1-0.8*seen,expr:PK.exprMix("neutral","smile",seen)},
        ivy:Object.assign({turn,work:U.lerp(0.2,1,st),pose:PK.poseSit(1-up),expr:PK.exprMix(PK.exprMix("think","neutral",st),"glad",ag_in(tt,tB+0.6,0.6)),gaze:[1,U.lerp(-0.8,0.2,st)],nod:-0.1*(1-st),hold:tt>=th?oo_potHold(0.3):null},
          tt<tB-0.2?{}:{reachN:hand,reachNk:rk,reachF:[hand[0]+22,hand[1]+8],reachFk:rk})});
      const Jh=PK.walk(x,"helena",tt,{x0:2030,x1:806,t0:0.4,t1:tB-0.2,floor:904,h:oo_hT(904),arms:{aN:OO_CARRY.aN},then:PK.poseMix(OO_CARRY,"clasp",ag_in(tt,th+0.35,0.7))},{hold:tt<th?oo_potHold(0.3):null,expr:oo_says("smile",tt,tB+0.3,tB+1.6),reachN:[690,590],reachNk:ag_io(tt,tB+0.2,th+0.5,0.6)});
      PK.nameTag(x,R.ivy.hc[0],R.ivy.hc[1]-150,"Ivy Reyes","Data analyst",ag_io(tt,w("owner","Ivy",-0.2),tB+0.1,0.4));
      oo_say(x,Jh,tt,tB+0.3,tR-0.4,["It's yours now."],cam);}},
    // what she owns: for every teaching room and every hour, how many people came
    {at:tR,cut:true,place:"ooRoom",keys:[[tR,900,560,1.05]],d:2,draw:(x,tt,cam)=>{
      const seats=PK.seats(),ts=[c.what+0.3,c.what+1.7,c.what+3.1],n=31+ts.filter(q=>tt>q+0.5).length;let seen=0;
      oo_class(x,tt,{n:8,open:ag_io(tt,tR+0.1,c.what+6.4,0.5),look:0.2,teacher:false,between:(cx,row)=>{if(row===0)[0,2,3].forEach((s,i)=>{seen=Math.max(seen,oo_toSeat(cx,tt,PK.extra(30+i*3),seats[s],ts[i],2.8+i*0.5));});}});
      PK.sensor(x,OO_L.sensor[0],OO_L.sensor[1],seen);oo_count(x,n+" people");
      PK.person(x,OO_TEACHER,1560,856,oo_hL(856),"stand",{t:tt,flip:true,expr:"smile"});
      oo_tag(x,tt,w("what","Counts",-0.2),tM-0.4,322,306,"Counts, never people",{align:"left",weight:800});}},
    // the data product owner: she pins the product to the board, and its promise; Sam, who keeps the platform, looks round at it
    {at:tM,cut:true,place:"ooTeam",keys:[[tM,900,500,1.18]],d:2,draw:(x,tt,cam)=>{
      const tq=w("promise","refreshed"),p1=ag_io(tt,tM+0.2,c.mesh+1.4,0.5),p2=ag_io(tt,tq-0.7,tq+0.9,0.5),back=ag_io(tt,c.mesh+2.2,tq-1.2,0.7),look=ag_io(tt,tq+0.5,tC-0.2,0.5);let Ji;
      oo_team(x,tt,{clock:9.5,ivy:null,pot:0.3,sam:{turn:look,work:1,expr:PK.exprMix("neutral","smile",look),gaze:[1,-0.4*look]},behind:cx=>{
        oo_sheets(cx,ag_in(tt,tM+0.5,0.35),ag_in(tt,tq-0.35,0.35));
        Ji=PK.person(cx,"ivy",716,842,oo_hT(842),PK.poseMix("stand","listen",back),{t:tt,expr:PK.exprMix("neutral","smile",Math.max(back,ag_in(tt,tq+0.6,0.6))),gaze:[1,-0.5+0.5*back],reachN:[822,p2>p1?366:240],reachNk:Math.max(p1,p2)});}});
      PK.nameTag(x,Ji.hc[0]-170,Ji.hc[1]-150,"Ivy Reyes","Data product owner",ag_io(tt,w("mesh","owner",-0.3),c.film-0.4,0.4));
      PK.nameTag(x,975,590,"Zhamak Dehghani","Data mesh",ag_io(tt,w("mesh","Zhamak",0.3),c.film-0.4,0.4));}},
    // its readers, by name, and what it is for; others come and go on the campus
    {at:tC,cut:true,place:"ooCampus",keys:[[tC,960,560,1.0],[c.readers+2.6,830,585,1.1]],d:3,draw:(x,tt,cam)=>{
      oo_passer(x,tt,PK.extra(4),tC+0.2,{});oo_passer(x,tt,PK.extra(11),tC+10.4,{out:true});
      const show=ag_io(tt,c.for-0.2,c.truly-1,0.8),nod=Math.sin(tt*2.4)*0.04*ag_io(tt,c.which+0.2,c.truly-0.8,0.5);
      const Ji=PK.walk(x,"ivy",tt,{x0:-120,x1:560,t0:tC+0.1,t1:c.readers+3.2,floor:OO_CA.near,h:OO_HC,then:PK.poseMix("ease","wave",ag_io(tt,c.readers+3.0,c.readers+4.4,0.4))},{expr:PK.exprMix("smile","listen",show),nod});
      // Mei a step behind Graham, half hidden by his shoulder: two who came together, not three in a row
      const Jm=PK.person(x,"mei",1016,OO_CA.near-30,PK.hAt(OO_CA.near-30,OO_CA.eye),"clasp",Object.assign({t:tt,flip:true},
        PK.face(tt,{expr:"smile",gaze:[1,0]},[[c.readers+3.5,"nod"],[c.for+0.9,"look",2.6,[0.5,0.8]],[c.for+3.8,"nod"],[c.which,"say",1.8]])));
      const Jg=PK.person(x,"graham",880,OO_CA.near,OO_HC,PK.poseMix("ease",OO_SHOW,show),Object.assign({t:tt,flip:true,hold:oo_plan},
        PK.face(tt,{expr:"smile",gaze:[1,0.6*show]},[[c.readers+3.3,"nod"],[c.for,"say",3],[c.which+0.8,"nod"]])));
      PK.nameTag(x,Jg.hc[0]-40,Jg.hc[1]-150,"Graham Ellis","Facilities",ag_io(tt,w("readers","Graham",-0.2),c.for-0.4,0.4));PK.nameTag(x,Jm.hc[0]+110,Jm.hc[1]-150,"Mei Tanaka","Registrar's office",ag_io(tt,w("readers","Mei",-0.2),c.for-0.4,0.4));
      oo_say(x,Jm,tt,c.which-0.1,tL-0.3,["Which ones?","Your counts will tell us."],cam,{dx:60});}},
    // what she answers for: a room in use; Graham comes to look at his sensor
    {at:tL,cut:true,place:"ooRoom",keys:[[tL,960,560,1.0],[c.many-0.2,760,560,1.14]],d:2.6,draw:(x,tt,cam)=>{
      oo_class(x,tt,{});oo_count(x,"34 people");const gz=ag_in(tt,c.many+0.6,0.6),tg=c.many+2.0;
      PK.person(x,"ivy",150,892,oo_hL(892),"clasp",{t:tt,expr:"smile",gaze:[1,-0.2-0.5*gz]});
      PK.walk(x,"graham",tt,{x0:-140,x1:372,t0:c.many-0.6,t1:tg,floor:902,h:oo_hL(902),then:"ease"},{flip:ag_in(tt,tg-0.1,0.4),expr:"neutral",gaze:[1,-0.9*ag_in(tt,tg+0.2,0.5)],nod:-0.12*ag_in(tt,tg+0.3,0.5)});
      PK.bubble(x,960,112,["Monday's job"],null,ag_io(tt,w("truly","Monday's",-0.2),c.many-0.5,0.4),{size:30,weight:700,ink:PK.C.mut,strike:U.clamp((tt-w("truly","job",0.2))/0.5,0,1)||0});
      oo_tag(x,tt,w("truly","true",-0.6),c.many-0.5,960,196,"True counts, for the timetable change",{col:PK.C.green,weight:800});
      oo_tag(x,tt,w("many","Facilities",-0.1),tD-0.2,330,306,"Facilities keeps the sensors",{align:"left"});}},
    // the team: Sam keeps the platform, Jun reviews her changes; one person answers; Helena gives her the authority to match
    {at:tD,cut:true,place:"ooTeam",keys:[[tD,1100,570,1.15],[c.one-0.4,960,550,1.06],[c.helena-0.6,960,540,1.0]],d:2.6,draw:(x,tt,cam)=>{
      const up=ag_in(tt,c.one-0.2,0.8),turn=ag_in(tt,c.one-0.5,0.5),ok=ag_in(tt,w("can","without",-0.2),0.6);
      const jr=ag_io(tt,w("can","review",-0.5),w("can","tell",0.6),0.5);
      const R=oo_team(x,tt,{clock:10.2,pot:0.3,sam:{expr:"neutral"},jun:Object.assign({work:1-0.8*jr},PK.face(tt,{expr:"neutral",gaze:[1,-0.3*jr]},[[w("can","review",-0.2),"smile",2.6],[w("can","review",0.3),"nod"]])),behind:cx=>oo_sheets(cx,1,1),
        ivy:Object.assign({turn,work:1,pose:PK.poseSit(1-up,"ease")},PK.face(tt,{expr:PK.exprMix("neutral","glad",ok),gaze:[1,0.1]},
          [[w("one","Ray-see",0.7),"look",2.4,[1,-0.25]],[c.helena-0.4,"look",Infinity,[1,-0.05]],[w("can","hold",0.9),"nod"],[w("can","change",1.7),"nod"]]))});
      PK.nameTag(x,R.sam.hc[0]+130,R.sam.hc[1]-150,"Sam Okafor","Keeps the platform",ag_io(tt,w("many","Sam",-0.1),c.one-0.5,0.4));PK.nameTag(x,R.jun.hc[0]-60,R.jun.hc[1]-150,"Jun Park","Reviews her changes",ag_io(tt,w("many","Jun",-0.1),c.one-0.5,0.4));
      oo_letter(x,R.sam,"R",ag_io(tt,w("one","Ray-see",-0.1),c.helena-0.5,0.4));oo_letter(x,R.jun,"R",ag_io(tt,w("one","Ray-see",0.2),c.helena-0.5,0.4));oo_letter(x,R.ivy,"A",ag_io(tt,w("one","A,",-0.2),c.helena-0.5,0.4),true);
      oo_tag(x,tt,w("one","accountable",-0.2),c.helena-0.5,R.ivy.hc[0]+70,R.ivy.hc[1]-250,"Accountable: only one",{col:PK.C.blue,weight:800,align:"left"});
      const Jh=PK.walk(x,"helena",tt,{x0:2030,x1:770,t0:c.helena-1.2,t1:c.helena+1.6,floor:904,h:oo_hT(904),then:"listen"},{expr:oo_says("smile",tt,c.can,c.can+5.4)});
      PK.say(x,Jh,["Hold a refresh.","Change the model, with a review.","Tell the readers. No need to ask me."],ag_in(tt,c.can-0.1,0.3),{cam,dx:350,dy:-41,la:[ag_in(tt,w("can","hold",-0.1),0.3),ag_in(tt,w("can","change",-0.1),0.3),ag_in(tt,w("can","tell",-0.1),0.3)]});}}
  ]);
  oo_card(ctx,S,t,w("owner","Thursday",-0.3),tR-0.3,{kick:"Thursday 1 July",title:"Ivy's first data product",col:PK.C.blue});
  oo_card(ctx,S,t,c.what+0.1,tM-0.4,{kick:"The data product",title:"Teaching space use",sub:"Each room, each hour: booked, and how many came",col:PK.C.orange},{right:true,y:76});
  oo_card(ctx,S,t,c.film+0.1,c.promise-0.5,{kick:"An earlier film",title:"A product with an owner",sub:"How a product gets one"});
  oo_card(ctx,S,t,w("for","timetable",-0.4),c.which-0.5,{kick:"Next year's timetable",title:"Move about one peak class in six",sub:"and release rooms nobody uses",col:PK.C.blue},{right:true,y:76});
  oo_imagined(ctx,S,t,0.2,7.5);oo_kick(ctx,S,ag_in(t,1.0,0.6));
});
// the timetable plan Graham holds: a board with a grid, in his hand
function oo_plan(c,h,deg,J){const U=PK.u,u=J.u,x=h[0]-40*u,y=h[1]-150*u,w=170*u,hh=210*u;PK.S.begin(c,{lw:2.4,sh:3});PK.S.fill(c,cc=>U.rrect(cc,x,y,w,hh,8*u),PK.col("board"),{});
  for(let i=0;i<4;i++)for(let j=0;j<3;j++){c.fillStyle=U.css((i*3+j)%6===1?PK.C.blue:[214,208,196],(i*3+j)%6===1?0.8:1);c.beginPath();U.rrect(c,x+16*u+j*48*u,y+22*u+i*44*u,40*u,34*u,5*u);c.fill();}}

/* ---------------------------------------------------------------- 3. A Monday that looked fine: Monday 23 August */
const OO_LEANIN={mode:"sit",lean:16,head:-2,aN:[30,84,"flat"],aF:[34,88,"flat"],lN:[86,4],lF:[82,-4]};
const OO_PLANT={mode:"kneel",lean:48,head:-18,aN:[20,10,"grip"],aF:[10,20],lN:[28,-90],lF:[40,-88],fN:70,fF:70},OO_PLANT2={mode:"kneel",lean:32,head:-8,aN:[30,20,"grip"],aF:[14,28],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=OO_CAST;
  const tEv=w("ran","Every"),tS=c.seedling-0.5,tR=c.reads-0.5,tC=c.release-0.5,tW=c.wait-0.5,tT=c.tell-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // seven weeks on, before the others are in: Ivy comes in and sits down to the refresh, which ran at seven
    {at:0,place:"ooTeam",later:true,keys:[[0,960,540,1.0],[tEv-0.6,835,590,1.15]],d:2.6,draw:(x,tt,cam)=>{
      const tA=4.4,here=tt>=tA+0.3,sit=ag_in(tt,tA+0.3,0.9),ok=ag_in(tt,tEv+0.3,0.6);
      oo_team(x,tt,{clock:8.0,pot:0.55,sam:null,jun:null,away:!here,ivy:{pose:PK.poseSit(sit),work:ag_in(tt,tA+1.0,0.8),expr:PK.exprMix("neutral","smile",0.6*ok),gaze:[1,0.3*sit]}});
      if(!here)PK.walk(x,"ivy",tt,{x0:2040,x1:OO_IVY.x,t0:0.4,t1:tA,floor:OO_IVY.floor,h:OO_HI,then:"stand"},{t:tt+1,expr:"neutral"});
      const a=ag_io(tt,tEv-0.2,tS-0.2,0.4);PK.tag(x,136,432,"Every check passes",a,{align:"left",col:PK.C.green,weight:800});PK.tick(x,104,432,22,a);}},
    // Kenya: where one died, a seedling goes back in the ground. It earns nothing yet
    {at:tS,cut:true,place:"ooHills",keys:[[tS,1100,640,1.18],[tS+0.6,1182,650,1.3]],d:3,draw:(x,tt,cam)=>{
      oo_sky(x,tt);oo_row(x,tt,0.5,1,null,{i:5,g:0.5});
      const ry=OO_ROW.y(1320),fw=OO_ROW.y(1196)+44,up=ag_in(tt,w("seedling","nothing",-0.3),0.9),pat=Math.sin(tt*5.2)*(1-up);
      PK.person(x,K.wan,1196,fw,oo_h(fw),PK.poseMix(OO_PLANT,OO_PLANT2,up),{t:tt,expr:PK.exprMix("neutral","smile",up),gaze:[1,0.6],reachN:[1292,ry-6+5*pat],reachNk:1-0.4*up,reachF:[1280,ry+14-5*pat],reachFk:1-0.4*up});
      PK.walk(x,K.girl,tt,{x0:2010,x1:1560,t0:tS-0.6,t1:tS+2.8,floor:xx=>OO_ROW.y(xx)+50,h:fl=>oo_h(fl)*0.7,arms:{aN:[3,5,"grip"]},then:"can"},{hold:oo_can,expr:"smile"});
      oo_tag(x,tt,w("seedling","nothing",-0.2),tR-0.3,1330,486,"Nothing, until it lives",{col:PK.C.mut,weight:800});}},
    // she reads the numbers themselves; Sam comes in behind her
    {at:tR,cut:true,place:"ooTeam",keys:[[tR,835,590,1.15],[c.drop-0.3,800,560,1.2]],d:2.4,draw:(x,tt,cam)=>{
      const lk=ag_in(tt,c.reads+0.2,0.8),bad=ag_in(tt,c.drop+0.6,0.8),bk=ag_in(tt,c.drop+2.0,0.9),tA=tR+3.4,in1=tt>=tA+0.3,sit=ag_in(tt,tA+0.3,0.9);
      oo_team(x,tt,{clock:8.2,pot:0.55,jun:null,sam:in1?{pose:PK.poseSit(sit),work:ag_in(tt,tA+1.1,0.8),expr:"neutral"}:null,
        behind:cx=>{if(!in1)PK.walk(cx,"sam",tt,{x0:2010,x1:1230,t0:tR+0.2,t1:tA,floor:xx=>U.lerp(838,872,U.clamp((xx-1230)/160,0,1)),h:oo_hT,then:"stand"},{flip:1-ag_in(tt,tA-0.3,0.4),expr:"neutral"});},
        ivy:{work:1-0.6*bk,workPose:PK.poseMix("sitWork",OO_LEANIN,lk*(1-bk)),expr:PK.exprMix(PK.exprMix("neutral","think",lk),"worry",bad),gaze:[1,0.2]}});
      const p=0.62*ag_in(tt,c.reads+0.9,1.2)+0.38*ag_in(tt,c.drop-0.2,1.4);
      oo_callout(x,40,150,520,256,205,474,ag_io(tt,c.reads+0.5,tC-0.3,0.4),(cc,bx,by,bw,bh)=>oo_dropChart(cc,bx,by,bw,bh,p));}},
    // what the counts would do: a full room, counted at nine, would be released
    {at:tC,cut:true,place:"ooRoom",keys:[[tC,960,560,1.0],[tC+0.4,900,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const gone=ag_io(tt,w("release","release",-0.4),w("release","really",-0.2),0.6);
      oo_class(x,tt,{a:1-0.78*gone});oo_count(x,"9 people",1,PK.C.amber);
      oo_tag(x,tt,w("release","release",-0.1),w("release","really",0.3),900,196,"Release this room?",{col:PK.C.amber,weight:800});}},
    // she doesn't wait: she gets up and goes
    {at:tW,cut:true,place:"ooTeam",keys:[[tW,835,590,1.15],[c.wait+0.6,960,560,1.04]],d:2.4,draw:(x,tt,cam)=>{
      const turn=ag_in(tt,c.wait-0.1,0.5),up=ag_in(tt,c.wait+0.2,0.7),tG=c.wait+0.9,gone=tt>=tG,look=ag_in(tt,tG+1.2,0.6);
      oo_team(x,tt,{clock:8.4,pot:0.55,jun:null,sam:{work:1-0.7*look,expr:PK.exprMix("neutral","think",look),gaze:[1,-0.3*look],nod:-0.06*look},away:gone,
        ivy:{turn:gone?1:turn,work:0.3,pose:PK.poseSit(1-up),expr:"worry",gaze:[1,0]}});
      if(gone)PK.walk(x,"ivy",tt,{x0:OO_IVY.x,x1:1900,t0:tG,t1:tG+3.2,floor:OO_IVY.floor,h:OO_HI},{t:tt+1,expr:"worry"});}},
    // she tells the readers herself, before the fix: Graham and Mei, on their way across the campus
    {at:tT,cut:true,place:"ooCampus",keys:[[tT,960,560,1.0],[c.tell+2.2,830,585,1.1]],d:3,draw:(x,tt,cam)=>{
      oo_passer(x,tt,PK.extra(16),tT+0.4,{out:true});
      const tM=c.tell+1.5,tg=c.first-1.9,said=ag_in(tt,tg+0.4,0.8),f1=w("tell","forty",-0.1),f2=w("tell","Don't",-0.1),f3=w("tell","The right",-0.1),hear=ag_in(tt,tM,0.5);
      PK.walk(x,"mei",tt,{x0:1700,x1:1036,t0:tT-1.4,t1:tM+0.2,floor:OO_CA.near-30,h:PK.hAt(OO_CA.near-30,OO_CA.eye),then:"clasp"},{expr:PK.exprMix("neutral","listen",hear),nod:Math.sin(tt*2.6+1)*0.04*ag_io(tt,f2,c.first+2,0.5)});
      const Jg=PK.walk(x,"graham",tt,{x0:1560,x1:900,t0:tT-1.4,t1:tM,floor:OO_CA.near,h:OO_HC,arms:{aN:[2,9,"grip"]},then:"stand"},{hold:oo_plan,expr:oo_says(PK.exprMix("neutral","listen",hear),tt,tg,tg+1.8),nod:Math.sin(tt*2.2)*0.03*ag_io(tt,f1,tg,0.5)});
      const Ji=PK.walk(x,"ivy",tt,{x0:-140,x1:600,t0:tT+0.1,t1:c.tell+1.6,floor:OO_CA.near,h:OO_HC,then:"clasp"},{expr:oo_says(PK.exprMix("worry","relief",said),tt,f1,tg-0.4)});
      PK.say(x,Ji,["Forty rooms look wrong to me.","Please don't use them yet.","Right counts by tomorrow."],ag_io(tt,f1,tg-0.2,0.3),{cam,dx:40,la:[ag_in(tt,f1,0.3),ag_in(tt,f2,0.3),ag_in(tt,f3,0.3)]});
      oo_say(x,Jg,tt,tg,c.first+2.9,["Thanks. We'll hold off."],cam,{dx:-40});}}
  ]);
  oo_card(ctx,S,t,1.2,tS-0.3,{kick:"Monday 23 August",title:"Refreshed at 7:00",col:PK.C.blue});
  oo_kick(ctx,S,1-ag_io(t,c.reads+0.5,tC-0.3,0.4));
});

/* ---------------------------------------------------------------- 4. Fix it, or raise it */
const OO_OVER={lean:12,head:4,aN:[40,60],aF:[6,14],lN:[-2,-2],lF:[5,4]};
scene("fix",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tF=c.four+0.4,tX=sc.ends.four,tJ=w("fix","Jun",-0.3),tM=c.mine-0.5,tK=c.check-0.5,ti=w("raise","raises",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // Monday, half past nine: Sam comes over, and they find it together on her screen
    {at:0,place:"ooTeam",keys:[[0,800,560,1.2],[tX-0.2,960,540,1.0]],d:2.6,draw:(x,tt,cam)=>{
      const tB=tX-0.4,turn=ag_in(tt,tX+0.1,0.5),found=ag_in(tt,w("four","model",0.8),0.8),mine=tX+0.8,up=ag_in(tt,tB-0.4,0.6);
      const R=oo_team(x,tt,{clock:9.5,pot:0.55,sam:null,jun:{expr:"neutral"},ivy:{turn,work:1-0.5*found,expr:oo_says(PK.exprMix(PK.exprMix("worry","think",ag_in(tt,2,1)),"relief",found),tt,mine,mine+1.3),gaze:[1,0.2*(1-turn)-0.5*turn],nod:-0.06*turn}});
      // he leans in with a hand on her chair's back; as she turns round to him he lets go, straightens and steps back
      const so={expr:PK.exprMix("think","smile",up),gaze:[1,0.5],nod:0.05*up+Math.sin(tt*2.3)*0.03*up,reachN:[656,562]};
      if(tt<tB-0.4)PK.walk(x,"sam",tt,{x0:1230,x1:790,t0:-0.6,t1:2.0,floor:xx=>U.lerp(900,838,U.clamp((xx-790)/440,0,1)),h:oo_hT,then:OO_OVER},Object.assign(so,{reachNk:ag_in(tt,1.8,0.6)}));
      else PK.walk(x,"sam",tt,{x0:790,x1:905,t0:tB,t1:tB+1.0,floor:900,h:oo_hT(900),flip:true,before:OO_OVER,then:"listen"},Object.assign(so,{reachNk:1-ag_in(tt,tB-0.4,0.4)}));
      const p=0.62*ag_in(tt,w("four","four",-0.3),1.6)+0.38*ag_in(tt,w("four","model",-0.1),1.2);
      oo_callout(x,40,150,520,250,205,474,ag_io(tt,tF,tX-0.3,0.4),(cc,bx,by,bw,bh)=>oo_hourCard(cc,bx,by,bw,bh,p));
      oo_say(x,R.ivy,tt,mine,tJ-0.6,["That one's mine."],cam,{lean:0,dx:-50});}},
    // that afternoon: Jun reviews her change
    {at:tJ,place:"ooTeam",later:true,keys:[[tJ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const tq=w("fix","reviews",0.9),ok=ag_in(tt,tq-0.2,0.6);
      const R=oo_team(x,tt,{clock:15.2,pot:0.55,sam:{expr:"neutral"},jun:{work:1-0.9*ok,expr:oo_says(PK.exprMix("think","smile",ok),tt,tq,tq+1.4),gaze:[1,0]},
        ivy:{turn:ag_in(tt,tq+0.2,0.5),work:1,expr:PK.exprMix("think","glad",ag_in(tt,tq+0.6,0.6)),gaze:[1,0]}});
      oo_say(x,R.jun,tt,tq,tq+3.4,["Looks right to me."],cam);}},
    // what isn't hers: the sensors are Facilities'. She finds Graham under one, in a teaching room between classes
    {at:tM,cut:true,place:"ooRoom",keys:[[tM,900,560,1.05],[c.mine+1.6,740,530,1.28]],d:2.6,draw:(x,tt,cam)=>{
      const tg=c.mine+1.2,ta=w("raise","From",1.2),look=1-ag_in(tt,tg+1.2,0.6);
      oo_class(x,tt,{n:0,teacher:false,open:ag_io(tt,tg-0.3,tg+2.4,0.5),seen:U.pio(tt,tg+0.2,tg+1.0,0.25)});
      const Jg=PK.person(x,"graham",470,902,oo_hL(902),"listen",{t:tt,flip:true,expr:oo_says(PK.exprMix("neutral","smile",ag_in(tt,ta-0.4,0.6)),tt,ta,ta+1.6),gaze:[1,-0.9*look],nod:-0.12*look+Math.sin(tt*2.2)*0.03*ag_io(tt,ti+0.4,ta,0.5)});
      if(tt>=tg){const x0=OO_L.door.x+24,Ji=PK.walk(x,"ivy",tt,{x0,x1:210,t0:tg,t1:tg+2.0,phase:0.9*(tt-tg),floor:xx=>U.lerp(812,896,U.clamp((x0-xx)/74,0,1)),h:oo_hL,flip:false,then:"ease"},{t:tt+1,a:U.pin(tt,tg,0.4),expr:oo_says(PK.exprMix("think","neutral",ag_in(tt,ta,0.6)),tt,ti,ti+2.4)});
        oo_say(x,Ji,tt,ti,ta-0.2,["Can you warn us","before the next upgrade?"],cam,{dx:200});}
      oo_tag(x,tt,w("mine","sensors",-0.1),c.raise-0.6,OO_L.sensor[0]+62,OO_L.sensor[1],"Facilities' sensors",{align:"left",weight:800});
      oo_say(x,Jg,tt,ta,tK-0.4,["We will. Every time."],cam,{dx:250});}},
    // her own check: a drop like this one now holds the refresh
    {at:tK,cut:true,place:"ooTeam",keys:[[tK,835,590,1.15],[c.check+4.6,900,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const done=ag_in(tt,w("check","before",0.8),0.8);
      oo_team(x,tt,{clock:14.3,pot:0.62,ivy:{work:1-0.7*done,expr:PK.exprMix("think","smile",done),gaze:[1,0.2*(1-done)]}});
      oo_callout(x,60,170,440,236,205,474,ag_io(tt,c.check+0.5,sc.dur-0.9,0.4),(cc,bx,by,bw,bh)=>oo_checkCard(cc,bx,by,bw,bh,[ag_in(tt,w("check","a drop",-0.1),0.3),ag_in(tt,w("check","holds",-0.1),0.3),ag_in(tt,w("check","before",-0.1),0.3)]));}}
  ]);
  oo_card(ctx,S,t,w("fix","Tuesday",-0.2),c.mine-0.8,{kick:"Tuesday morning",title:"The right counts",sub:"for Graham's and Mei's teams",col:PK.C.green});
  oo_kick(ctx,S,1-Math.max(ag_io(t,tF,tX-0.3,0.4),ag_io(t,ti-0.3,tK-0.2,0.4),ag_io(t,c.check+0.5,sc.dur-0.9,0.4)));
});

/* ---------------------------------------------------------------- 5. Nobody to blame */
scene("blame",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tD=c.dekker-0.5,tA=c.account-0.5,tF=w("fit","What failed");
  ag_shots(ctx,S,t,sc.dur,[
    // the week after, in the team's room: everyone who had a part in it says what they saw, and Helena listens
    {at:0,place:"ooTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const s=[w("each","Facilities",-0.1),w("each","Sam's",-0.1),w("each","The step",-0.1),c.each+7.5],ok=i=>ag_in(tt,s[i+1]-0.1,0.5),face=i=>PK.exprMix("worry","relief",ok(i));
      // nobody sits by: each looks at whoever speaks, and nods at what they hear
      const R=oo_team(x,tt,{clock:11.0,pot:0.75,away:true,ivy:{turn:1},
        jun:Object.assign({work:0,pose:"sit"},PK.face(tt,{expr:"listen",gaze:[1,0]},[[s[0]+0.5,"look",2.2,[1,-0.3]],[s[1]+1.3,"nod"],[s[2]+0.4,"look",2.4,[0.4,-0.2]],[s[2]+1.2,"worry",2.6],[tF+0.8,"nod"]])),
        sam:Object.assign({turn:1,work:0},PK.face(tt,{expr:face(1),gaze:[1,0]},[[s[0]+1.0,"nod"],[s[1],"say",s[2]-0.2-s[1]],[s[2]+0.5,"look",2.4,[1,-0.2]],[s[2]+1.9,"nod"],[tF+1.4,"think",3]]))});
      PK.person(x,"helena",OO_IVY.x,OO_IVY.floor,OO_HI,PK.poseMix("sit","sitBack",0.5),Object.assign({t:tt+2},
        PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[s[0]+1.5,"nod"],[s[1]+0.4,"look",2.4,[1,0.1]],[s[1]+1.6,"nod"],[s[2]+0.4,"look",2.6,[1,-0.35]],[s[2]+1.7,"nod"],[tF+0.5,"think",3.4]])));
      const Jg=PK.person(x,"graham",810,930,oo_hT(930),"ease",Object.assign({t:tt},PK.face(tt,{expr:face(0),gaze:[1,0]},[[s[0],"say",s[1]-0.2-s[0]],[s[1]+0.5,"look",2.2,[1,-0.1]],[s[2]+1.3,"nod"],[tF+1.0,"think",3]])));
      const Ji=PK.person(x,"ivy",1490,944,oo_hT(944),"clasp",Object.assign({t:tt+1,flip:true},PK.face(tt,{expr:face(2),gaze:[1,0]},[[s[0]+0.6,"look",2.2,[1,0.1]],[s[1]+1.1,"nod"],[s[2],"say",s[3]-0.2-s[2]],[tF+0.6,"nod"]])));
      // each was right about what they saw: a tick over each of the three; what failed lies between them
      const M=[oo_over(Jg,24),oo_over(R.sam,24),oo_over(Ji,24)],lk=ag_in(tt,tF,1.2),la=ag_io(tt,tF,tD-0.4,0.4);
      oo_link(x,M[0],M[1],U.clamp(lk*2,0,1),PK.C.amber,la);oo_link(x,M[1],M[2],U.clamp(lk*2-1,0,1),PK.C.amber,la);
      M.forEach((q,i)=>PK.tick(x,q[0],q[1],24,ag_io(tt,s[i+1]-0.1,tD-0.4,0.4)));
      oo_say(x,Jg,tt,s[0],s[1]-0.2,["We upgraded them in August."],cam);oo_say(x,R.sam,tt,s[1],s[2]-0.2,["The platform took all four."],cam,{dx:70});oo_say(x,Ji,tt,s[2],s[3]-0.2,["My step kept the first one."],cam,{dx:-110});
      oo_tag(x,tt,tF-0.1,tD-0.4,1000,120,"The gap was between the parts",{col:PK.C.amber,weight:800});}},
    // Helena's corner: her first question isn't who
    {at:tD,cut:true,place:"ooCorner",keys:[[tD,960,540,1.0],[c.helena-0.6,960,556,1.06]],d:3,draw:(x,tt,cam)=>{
      const q0=w("helena","isn't who",-0.1),q1=w("helena","what happened",-0.1),q2=w("helena","what Ivy",-0.1),ti=c.safe-0.2,lean=ag_in(tt,c.helena-0.4,0.9),up=ag_in(tt,q1+0.4,0.9);
      const R=oo_corner(x,tt,{t0:tD,lean,up,he:oo_says(PK.exprMix("listen","smile",0.5*lean),tt,q1,c.safe-1.0),ie:oo_says(PK.exprMix("worry","relief",ag_in(tt,q2+0.6,1.0)),tt,ti,ti+3.2)});
      // the question she doesn't ask, struck out; then the two she does
      PK.bubble(x,R.helena.hc[0]+170,R.helena.hc[1]-170,["Who did this?"],null,ag_io(tt,c.helena-0.5,q1-0.15,0.3),{ink:PK.C.mut,strike:U.clamp((tt-q0)/0.4,0,1)});
      PK.say(x,R.helena,["What happened?","What do you need?"],ag_io(tt,q1+0.1,c.safe-0.5,0.3),{cam,la:[ag_in(tt,q1+0.1,0.3),ag_in(tt,q2,0.3)]});
      oo_say(x,R.ivy,tt,ti,tA-0.4,["The sensors changed,","and my step missed it."],cam);
      oo_tag(x,tt,w("safe","early",-0.2),tA-0.4,700,214,"Safe to say it early",{col:PK.C.green,weight:800});}},
    // giving an account: Ivy writes it up for the team, and for the two who read her counts
    {at:tA,cut:true,place:"ooTeam",keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      oo_team(x,tt,{clock:11.6,pot:0.75,ivy:null,sam:Object.assign({turn:1,work:0},PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tA+3.2,"nod"]])),jun:Object.assign({work:0,pose:"sit"},PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tA+4.4,"smile",2.4]])),behind:cx=>{
        PK.atBoard(cx,"ivy",tt,[{s:"What happened",t0:tA-4,t1:tA-2.4},{s:"What changes",t0:tA+0.5,t1:tA+2.3}],{x:836,y:330,lh:62,rest:745,floor:842,h:oo_hT(842),t:tt+1,expr:oo_says("neutral",tt,tA+3.6,sc.dur)});}});
      PK.person(x,"graham",1384,930,oo_hT(930),"clasp",Object.assign({t:tt,flip:true},PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tA+2.6,"nods"]])));
      PK.seated(x,"mei",1664,946,oo_hT(946),PK.poseMix("sit","sitBack",0.4),Object.assign({t:tt+2,flip:true},PK.face(tt,{expr:"listen",gaze:[1,-0.3]},[[tA+3.8,"nod"],[tA+4.6,"smile",2.2]])));}}
  ]);
  const ca=ag_io(t,w("dekker","just",-0.3),c.helena-0.7,0.4);if(ca>0.004){setScreen(ctx,S);PK.card(ctx,960,64,{kick:"Sidney Dekker",title:"A just culture",sub:"Ask what happened, not who to blame",col:PK.C.blue},ca,{align:"center"});}
  oo_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=OO_CAST;
  const tI=c.ivy-0.5,tK=c.know-0.5,tJ=w("ivy","In June",-0.3),tN=c.next-0.3,tE=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // Kenya, years on: a young tree, still standing
    {at:0,place:"ooGreen",keys:[[0,960,560,1.0],[0.6,1040,600,1.12]],d:3,draw:(x,tt,cam)=>{
      oo_sky(x,tt);
      PK.walk(x,K.nya,tt,{x0:1990,x1:1560,t0:-1.5,t1:6.5,floor:866,h:oo_h(866),arms:{aN:[16,84,"grip"],aF:[24,92,"grip"],lean:-4},then:"armful"},{hold:oo_firewood,expr:"smile"});
      PK.S.begin(x,{lw:2.6,far:0,sh:4});PK.tree(x,1215,888,1.0,7,{});
      const tch=ag_in(tt,1.4,0.9),kw={t0:0.2,t1:4.6,floor:900,h:oo_h(900)*0.74,then:"stand"};
      PK.person(x,K.wan,1105,890,oo_h(890),"stand",{t:tt,expr:"smile",gaze:[1,-0.3*tch],reachN:[1162,612],reachNk:tch});
      PK.walk(x,K.boy,tt,Object.assign({x0:420,x1:930},kw),{expr:"glad"});PK.walk(x,K.girl,tt,Object.assign({x0:300,x1:836,phase:0.4},kw,{floor:908,h:oo_h(908)*0.7}),{expr:"glad"});}},
    // the university, two years on: the timetable has changed, and it is judged on her counts
    {at:tI,place:"ooRoom",dis:1.0,keys:[[tI,960,540,1.0],[c.ivy+3.4,860,536,1.1]],d:3,draw:(x,tt,cam)=>{
      oo_class(x,tt,{});oo_count(x,"34 people");const show=ag_in(tt,tJ,0.8);
      PK.person(x,"ivy",150,892,oo_hL(892),"ease",{t:tt+1,expr:PK.exprMix("neutral","smile",show),gaze:[1,0.1]});
      PK.person(x,"graham",372,902,oo_hL(902),PK.poseMix("stand",OO_SHOW,show),{t:tt,flip:true,expr:oo_says("smile",tt,tJ+0.4,tJ+2.6),hold:oo_plan});}},
    // on Monday: the four things, written up for the team; then everyone goes back to work, and Ivy to her desk, by the seedling
    {at:tK,cut:true,place:"ooTeam",keys:[[tK,960,500,1.04],[c.next+1.4,900,560,1.08],[c.take-1.0,880,600,1.15]],d:3,draw:(x,tt,cam)=>{
      const L=[["Know who uses it",w("know","know",-0.2),1.6],["Watch what it's for",w("watch","Watch",-0.1),1.7],["Say so first",w("say","say so",-0.2),1.2],["Fix, raise, mend",w("mend","Fix",-0.1),w("mend","mend",0.6)-w("mend","Fix",-0.1)]].map(([s,t0,d])=>({s,t0,t1:t0+d}));
      const tB=tN+0.9,tS=tB+1.7,board=tt<tB,seated=tt>=tS,sit=ag_in(tt,tS,0.9),look=ag_in(tt,tS+0.8,0.8),touch=ag_in(tt,c.take-0.4,0.9),back=ag_in(tt,tN+0.2,0.5);
      oo_team(x,tt,{clock:9.2,pot:1,away:!seated,
        sam:Object.assign({turn:1-ag_in(tt,tN+0.8,0.5),work:ag_in(tt,tN+1.5,0.8)},PK.face(tt,{expr:"listen",gaze:[1,-0.2*(1-back)]},[[L[0].t1+0.3,"nod"],[L[2].t0+0.4,"smile",2.6],[L[3].t1+0.2,"nod"]])),
        jun:Object.assign({work:ag_in(tt,tN+1.1,0.8),pose:"sit"},PK.face(tt,{expr:"listen",gaze:[1,-0.2*(1-back)]},[[L[1].t1+0.2,"nod"],[L[3].t0+1.6,"look",2.2,[0.5,0.1]],[L[3].t1+0.9,"smile",2.4]])),
        behind:cx=>{PK.atBoard(cx,board?"ivy":null,tt,L,{x:836,y:280,lh:56,rest:745,floor:842,h:oo_hT(842),t:tt+1,down:tN+0.3,tray:[886,506],a:1-ag_in(tt,tE-0.3,0.9),expr:"neutral"});},
        ivy:{pose:PK.poseMix(PK.poseSit(sit),OO_LEANIN,0.5*touch),work:0,expr:PK.exprMix("neutral","smile",look),gaze:[1,0.4*look*(1-touch)],reachN:[385,512],reachNk:touch,reachF:[462,630],reachFk:touch}});
      PK.walk(x,"helena",tt,{x0:1480,x1:2040,t0:tN-0.1,t1:tN+2.7,floor:926,h:oo_hT(926),before:"clasp"},Object.assign({t:tt+2,flip:1-ag_in(tt,tN-0.1,0.4)},
        PK.face(tt,{expr:PK.exprMix("listen","smile",back),gaze:[1,-0.2*(1-back)]},[[L[0].t1+0.9,"nod"],[L[1].t0+0.8,"look",2,[1,0.1]],[L[2].t1+0.4,"nods"],[L[3].t0+2.2,"smile",2.6]])));
      if(!board&&!seated)PK.walk(x,"ivy",tt,{x0:745,x1:OO_IVY.x,t0:tB,t1:tB+1.4,floor:xx=>U.lerp(OO_IVY.floor,842,U.clamp((xx-OO_IVY.x)/185,0,1)),h:oo_hT,before:"ease",then:"stand"},{t:tt+1,flip:ag_in(tt,tB,0.4),expr:"neutral"});}}
  ]);
  oo_card(ctx,S,t,1.0,c.ivy-1.4,{kick:"Kenya",title:"Trees still standing",col:PK.C.green});
  oo_card(ctx,S,t,tJ,tK-0.3,{kick:"June 2029",title:"The timetable change",sub:"Judged on true counts",col:PK.C.blue},{right:true,y:124});
  oo_imagined(ctx,S,t,tJ,tK-0.3,"The university, 2029 · imagined");
  oo_card(ctx,S,t,c.next+0.2,c.take-0.6,{kick:"The next film",title:"Measure the work,",sub:"not the people"});
  oo_kick(ctx,S,1-ag_in(t,tE-0.2,0.6));
  PK.end(ctx,S,t,tE,"Owning the outcome",OO_LAST,"Film 1 of 4","Ownership and performance",{side:"right"});
});
ag_cutInto(["owns","monday","fix","blame"]);

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
