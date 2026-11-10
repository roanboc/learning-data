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
 {"id":"change","gap":0.8,"text":"Something had to change."},
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
 {"id":"upgrade","gap":0.8,"text":"On Tuesday 17 August, Facilities upgrades the sensors in forty rooms.","say":"On Tuesday the seventeenth of August, Facilities upgrades the sensors in forty rooms."},
 {"id":"quarter","gap":0.8,"text":"The new ones send a count every quarter of an hour, not once an hour. More detail: a real improvement."},
 {"id":"tells","gap":0.8,"text":"Nobody expects it to change the data, so nobody tells the data team."},
 {"id":"ran","gap":0.8,"text":"On Monday 23 August, the refresh runs at seven, as promised. Every check passes.","say":"On Monday the twenty-third of August, the refresh runs at seven, as promised. Every check passes."},
 {"id":"seedling","gap":0.8,"text":"At the Green Belt, a seedling in the ground earned nothing until it lived."},
 {"id":"reads","gap":0.8,"text":"So Ivy reads the numbers, not only the tick."},
 {"id":"drop","gap":0.8,"text":"In forty rooms, from Tuesday the seventeenth, the counts have dropped to about a quarter."},
 {"id":"empty","gap":0.8,"text":"In those rooms, booked hours with nobody in them jump from one in five to more than half."},
 {"id":"release","gap":0.8,"text":"If nobody noticed, the timetable team would release rooms that classes really use."},
 {"id":"wait","gap":0.8,"text":"Ivy doesn't wait to be sure, or to be asked."},
 {"id":"writes","gap":0.8,"text":"At ten past eight, she writes to the readers: the counts for forty rooms look wrong; don't use them yet; the right ones by tomorrow."},
 {"id":"first","gap":0.8,"text":"Saying it first, before the fix, is part of owning it."}
]},
"fix":{"name":"Fix it, or raise it","lead":1.0,"tail":1.0,"vo":[
 {"id":"sam","gap":0.8,"text":"With Sam, she opens the feed for one room."},
 {"id":"four","gap":0.8,"text":"Since Tuesday, four counts arrive each hour. The model was built for one."},
 {"id":"step","gap":0.8,"text":"A step meant to drop the odd repeat kept the first count of each hour, and dropped the other three."},
 {"id":"early","gap":0.8,"text":"The first comes as one class leaves and the next arrives, so the rooms looked nearly empty."},
 {"id":"fix","gap":0.8,"text":"The fix is hers: keep the hour's highest count, as the old sensors sent."},
 {"id":"review","gap":0.8,"text":"Jun reviews her pull request, as someone other than its author reviews every change."},
 {"id":"rerun","gap":0.8,"text":"The days since Tuesday are run again, and on Tuesday morning the readers have the right counts, with a short note."},
 {"id":"note","gap":0.8,"text":"What happened, what it touched, what's fixed, and what changes."},
 {"id":"mine","gap":0.8,"text":"Some of it isn't hers to fix. The sensors are Facilities'."},
 {"id":"raise","gap":0.8,"text":"So she raises it with Graham. From now on, Facilities tells the data team before a sensor changes."},
 {"id":"check","gap":0.8,"text":"And she adds a check of her own: each room's counts against its own last four weeks."},
 {"id":"holds","gap":0.8,"text":"A drop like this one now holds the refresh, and tells her, before anyone reads it."}
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

const VODUR={"trees/when": 1.936, "trees/women": 6.423, "trees/streams": 5.15, "trees/cleared": 5.743, "trees/sense": 2.246, "trees/soil": 4.246, "trees/harm": 6.768, "trees/change": 1.288, "trees/start": 6.874, "trees/nursery": 6.01, "trees/paid": 5.883, "trees/answer": 2.917, "trees/fifty": 3.737, "trees/give": 4.755, "trees/nobel": 6.313, "trees/data": 4.521, "trees/own": 2.83, "owns/owner": 7.999, "owns/what": 7.312, "owns/mesh": 6.818, "owns/film": 4.713, "owns/promise": 3.903, "owns/readers": 7.564, "owns/for": 7.511, "owns/which": 1.943, "owns/truly": 6.122, "owns/many": 6.908, "owns/one": 6.514, "owns/helena": 2.237, "owns/can": 5.931, "monday/upgrade": 5.252, "monday/quarter": 6.286, "monday/tells": 4.29, "monday/ran": 5.819, "monday/seedling": 3.775, "monday/reads": 2.63, "monday/drop": 4.708, "monday/empty": 5.11, "monday/release": 4.879, "monday/wait": 2.392, "monday/writes": 7.869, "monday/first": 2.766, "fix/sam": 2.463, "fix/four": 4.104, "fix/step": 5.389, "fix/early": 5.26, "fix/fix": 4.294, "fix/review": 4.986, "fix/rerun": 6.091, "fix/note": 3.155, "fix/mine": 3.397, "fix/raise": 6.181, "fix/check": 4.619, "fix/holds": 4.889, "blame/nobody": 1.667, "blame/each": 7.211, "blame/fit": 4.526, "blame/dekker": 7.159, "blame/helena": 4.436, "blame/safe": 4.826, "blame/account": 5.032, "close/back": 5.339, "close/ivy": 8.166, "close/know": 3.092, "close/watch": 2.407, "close/say": 3.194, "close/mend": 5.662, "close/next": 5.375, "close/take": 2.216};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the seedling still alive on the hill, and the job's tick beside the counts it ran, as they become the title card;
   and the words of the last line, alone, as they become the end card. */
const BREATH={
"trees":{"hold":{"when":1.2,"streams":1.2,"cleared":0.8,"sense":1.0,"soil":1.0,"harm":1.2,"change":1.4,"start":1.0,"nursery":1.2,"paid":1.2,"answer":1.4,"fifty":1.0,"give":0.8,"nobel":1.4,"data":0.8},"breathe":5.4},
"owns":{"hold":{"owner":0.8,"what":1.2,"mesh":1.0,"film":1.0,"promise":1.0,"readers":1.0,"which":1.0,"truly":1.4,"many":0.8,"one":1.2,"helena":0.4}},
"monday":{"hold":{"upgrade":0.8,"quarter":1.0,"tells":1.2,"ran":1.2,"seedling":1.0,"reads":0.8,"drop":1.2,"empty":1.2,"release":1.2,"wait":0.6,"writes":1.2}},
"fix":{"hold":{"sam":0.9,"four":1.2,"step":1.2,"early":1.4,"fix":1.2,"review":1.3,"rerun":1.0,"note":1.4,"mine":0.9,"raise":1.4,"check":1.1}},
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

/* ===== Leading data people: the module's look =====
   The films of Leading data people (The new skills, Working with people, Leading a data team, Ownership and performance) and of
   Data management share one look, chosen by the setup thread on 5 November 2026 from two looks drawn as style frames (a plaster room
   in daylight; a building cut open), the second kept inside the first as its wide view, for the author to review
   (films/the-new-skills/decided.md): "Sunlit plaster". The data team's rooms in daylight: a warm limewash wall, the sun through a
   tall window on the right falling on it as a slanted patch of panes with the soft shadows of leaves outside; one-page sheets of thick
   paper pinned to the wall, each with a band of colour only when the colour means something; the university's buildings cut open
   like an architect's section, each room a small lit stage, for the story of its rooms. People are the agent films', in the window's
   warm light. Calm and spare: few things in a frame, light doing the work. No film grain, no watercolour.
   The module's files, bundled in this order after The Inner Life of Data's helpers (core.js, style2.js, ui3.js, and its logos.js
   for a film that names its tools), A Sharper Sketch's scene() (sketch3.js) and the agent films' kit, people and agent
   (films/what-an-agent-is/shared/src/kit.js, people.js, agent.js: the camera, the shots, pictures painted once, the people, the agent):
     look.js     the palette and what each colour means, words, the room and its light, and the sun on the wall
     people.js   the cast this module adds and lp_person, the agent films' people in the room's light
     cards.js    sheets on the wall (words, a figure, bars), pills and tags, the kicker, the scene's tag, name tags, the module's mark,
                 and the title and end cards
     things.js   what stands in a room: a table, a screen on the wall, a laptop, a door, a row of chairs
     section.js  a building cut open, room by room, drawn live so the camera can go close: the teaching building, and any other
   Every top-level name starts with lp_ or LP_. A film's own pictures and helpers go in its own source with a prefix of its own; never
   change these files for one film.
   Sizes are in the 1920 x 1080 frame. Every word is at least 28 px as seen, and nothing but the captions goes below y 890. */

/* ---------------------------------------------------------------- colours, and what each means in every film of both modules
   Marks carry meaning (a sheet's band, a pill, a line, a figure); the room, its light and people's clothes carry none, and wear
   none of these five. */
const LP={
  ink:[38,32,30],        // words
  mut:[86,76,70],        // quieter words, at 4.5:1 or more on the wall and 7:1 on paper
  paper:[250,247,240],   // a sheet of thick paper
  blue:[34,94,160],      // design and plans
  green:[34,118,80],     // done, or value
  amber:[172,106,10],    // risk, cost, or waiting
  orange:[204,88,32],    // data
  violet:[98,82,206],    // only an agent
  wall:[224,208,186],    // limewash
  shade:[52,44,52],      // the room's shade: a little cool, against the warm sun
  sun:[255,214,150],     // the afternoon sun
  floor:[132,96,70],     // warm timber
  timber:[196,160,120],  // a table, a door, a frame
  graphite:[52,50,54],   // a screen's frame, a pin, a chair's legs
  sdx:-10                // shadows fall down and to the left: the window is on the right
};
const LP_MEANS={plan:LP.blue,done:LP.green,value:LP.green,risk:LP.amber,cost:LP.amber,wait:LP.amber,data:LP.orange,agent:LP.violet};

/* ---------------------------------------------------------------- words
   lp_T draws with The Inner Life of Data's T (so the legibility check measures it; {deco:1} marks decoration on purpose), in ink
   unless o.col (a colour) or o.color (a CSS colour) says otherwise; o.ls spaces the letters, in px; o.f "mono" for code. Size 28 by
   default. lp_tw and lp_wrap measure and wrap as the agent films' ag_tw and ag_wrap do; lp_label is a heading in capitals. */
function lp_T(ctx,s,x,y,o){o=o||{};const a=o.a==null?1:o.a,col=o.color||rgba(o.col||LP.ink,a),ls=o.ls||0,q=Object.assign({},o,{color:col,size:o.size||28});
  if(!ls){T(ctx,s,x,y,q);return;}
  const dx=o.align==="center"?ls/2:(o.align==="right"||o.align==="end")?ls:0;ctx.save();ctx.letterSpacing=ls+"px";T(ctx,s,x+dx,y,q);ctx.restore();}
const lp_tw=(ctx,s,o)=>ag_tw(ctx,s,o),lp_wrap=(ctx,s,maxW,o)=>ag_wrap(ctx,s,maxW,o);
function lp_label(ctx,x,y,text,o){o=o||{};lp_T(ctx,String(text).toUpperCase(),x,y,{w:800,size:o.size||28,ls:o.ls==null?3.5:o.ls,align:o.align||"left",col:o.col||LP.mut,a:o.a});}

/* ---------------------------------------------------------------- noise, grain and a floor in perspective
   The agent films keep these in room.js, which this module doesn't bundle (its places would be painted in every film): the same
   seeded value noise, a faint grain from a small tile, and a floor drawn row by row from a flat texture. */
const LP_NZ=(()=>{const R=ag_rnd(4321),q=[];for(let i=0;i<256;i++)q.push(i);for(let i=255;i>0;i--){const j=(R()*(i+1))|0;const t=q[i];q[i]=q[j];q[j]=t;}
  const pm=new Uint8Array(512);for(let i=0;i<512;i++)pm[i]=q[i&255];const val=new Float32Array(256);for(let i=0;i<256;i++)val[i]=R();
  function n2(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,X=xi&255,Y=yi&255;
    const a=val[pm[X+pm[Y]]],b=val[pm[X+1+pm[Y]]],c=val[pm[X+pm[Y+1]]],d=val[pm[X+1+pm[Y+1]]];
    const u=xf*xf*xf*(xf*(xf*6-15)+10),v=yf*yf*yf*(yf*(yf*6-15)+10);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
  function fbm(x,y,o){let s=0,a=0.5,fr=1,n=0;for(let i=0;i<o;i++){s+=a*n2(x*fr+i*17.3,y*fr+i*9.1);n+=a;a*=0.5;fr*=2.03;}return s/n;}
  return{n2,fbm};})();
function lp_grain(ctx,x,y,w,h,amp,seed){const tile=ag_kept("lpGrain:"+seed+"|"+amp,256,256,(c)=>{const img=c.createImageData(256,256),d=img.data,R=ag_rnd(seed);
    for(let i=0;i<d.length;i+=4){const v=(R()-0.5)*2*amp*3;d[i]=d[i+1]=d[i+2]=v>0?255:0;d[i+3]=Math.min(255,Math.abs(v)*1.1);}c.putImageData(img,0,0);});
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle=ctx.createPattern(tile,"repeat");ctx.globalAlpha=0.5;ctx.fillRect(x,y,w,h);ctx.restore();}
const LP_EYE={eye:440,vpx:1000,foc:1400};
function lp_floor(c,tex,hz,ppu,ppv,n){const pat=c.createPattern(tex,"repeat");n=n||6;
  for(let y=hz+1;y<H;y++)for(let k=0;k<n;k++){const yy=y+(k+0.5)/n,d=yy-LP_EYE.eye,z=LP_EYE.foc/d;
    pat.setTransform(new DOMMatrix([d/ppu,0,0,1,LP_EYE.vpx,y+0.5-z*ppv]));c.globalAlpha=1/(k+1);c.fillStyle=pat;c.fillRect(0,y,W,1);}
  c.globalAlpha=1;}
function lp_floorTex(){return ag_kept("lpFloor",990,1500,(c,tw,th)=>{const pw=110,n=9,img=c.createImageData(tw,th),d=img.data,R=ag_rnd(51),O=LP.floor;
  const tone=[],joints=[];for(let k=0;k<n;k++){tone.push((R()-0.5)*14);const js=[];let v=R()*700;while(v<th){js.push(v);v+=520+R()*400;}joints.push(js);}
  for(let y=0;y<th;y++)for(let x=0;x<tw;x++){const k=(x/pw)|0,lx=x-k*pw;let pc=0;for(const jv of joints[k])if(y>jv)pc++;
    const gr=LP_NZ.fbm(x*0.05+k*7+pc*3.1,y*0.0026+pc*5.3,4),fig=LP_NZ.fbm(x*0.012+k*3+pc*1.7,y*0.0011+pc*2.9,3);
    let L=tone[k]+(gr-0.5)*16+(fig-0.5)*12;if(lx<1.2)L-=22;else if(lx<2.5)L-=6;for(const jv of joints[k]){if(Math.abs(y-jv)<1.2)L-=18;}
    const i=(y*tw+x)*4;d[i]=O[0]+L;d[i+1]=O[1]+L*0.9;d[i+2]=O[2]+L*0.8;d[i+3]=255;}c.putImageData(img,0,0);});}

/* ---------------------------------------------------------------- the wall
   lp_plaster(c, hz, o) paints limewash from the top of the frame down to hz: big soft clouds of lighter and darker lime, a little
   warmer and cooler in places, trowel marks along a gentle diagonal, and a fine grain; computed at half size (it's soft anyway).
   o.base, the lime's colour (LP.wall); o.seed, another wall. */
function lp_plaster(c,hz,o){o=o||{};const k=0.5,w=Math.ceil(W*k),h=Math.ceil(hz*k),img=c.createImageData(w,h),d=img.data,B=o.base||LP.wall,sd=(o.seed||0)*97;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const X=i/k+sd,Y=j/k;
    const big=LP_NZ.fbm(X*0.0016+1.3,Y*0.0019+4.1,4)-0.5,mid=LP_NZ.fbm(X*0.006+7,Y*0.0065+2,3)-0.5;
    const u=X*0.94+Y*0.34,v=-X*0.34+Y*0.94,tr=LP_NZ.fbm(u*0.0045+11,v*0.03+5,3)-0.5;
    const hue=LP_NZ.fbm(X*0.0011+31,Y*0.0013+17,3)-0.5,L=big*30+mid*12+tr*9,q=(i*4)+(j*w*4);
    d[q]=B[0]+L+hue*10;d[q+1]=B[1]+L*0.96;d[q+2]=B[2]+L*0.9-hue*12;d[q+3]=255;}
  const cv=mkCanvas(w,h);cv.getContext("2d").putImageData(img,0,0);c.save();c.imageSmoothingQuality="high";c.drawImage(cv,0,0,w,h,0,0,W,hz);c.restore();
  lp_grain(c,0,0,W,hz,2.2,41);}

/* ---------------------------------------------------------------- the sun on the wall
   The window is out of the frame on the right; its six panes fall on the wall as a slanted patch, the panes' bars as soft lines, and
   the shadows of two branches outside it as leaves. S: {x, w, top, h, slant, seed}: the patch from x to x + w, its right edge from top
   to top + h, its left edge slant px lower (the sun is high and to the right); seed, other leaves; leaves: false, none.
   lp_sunMask(S) is the patch, white, kept once; lp_sun(ctx, S, o) lays the sun on what is drawn (the wall, or a sheet on it, a
   door, a frame: o.clip(ctx) clips it to that thing), o.a its strength, o.col its colour (LP.sun; LP_LIGHT has others). */
function lp_leaf(c,x,y,l,an,wd){const ca=Math.cos(an),sa=Math.sin(an),px=-sa,py=ca,w=l*(wd||0.32);
  c.moveTo(x,y);c.quadraticCurveTo(x+ca*l*0.5+px*w,y+sa*l*0.5+py*w,x+ca*l,y+sa*l);c.quadraticCurveTo(x+ca*l*0.5-px*w,y+sa*l*0.5-py*w,x,y);c.closePath();}
function lp_sunMask(S){return ag_kept("lpSun:"+[S.x,S.w,S.top,S.h,S.slant,S.seed,S.leaves].join(","),W,H,(big)=>{
  // drawn at a quarter of the size and scaled up: it's soft anyway, and a blur at full size takes seconds
  const k=0.25,sm=mkCanvas(W*k,H*k),c=sm.getContext("2d");c.scale(k,k);
  const P=(u,v)=>[S.x+u*S.w,S.top+v*S.h+(1-u)*S.slant];
  const pane=(u0,u1,v0,v1)=>{const a=P(u0,v0),b=P(u1,v0),d2=P(u1,v1),e=P(u0,v1);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d2[0],d2[1]);c.lineTo(e[0],e[1]);c.closePath();};
  c.filter="blur(1px)";c.fillStyle="#fff";c.beginPath();
  for(const [u0,u1] of [[0,0.488],[0.512,1]])for(const [v0,v1] of [[0,0.322],[0.339,0.661],[0.678,1]])pane(u0,u1,v0,v1);c.fill();
  if(S.leaves!==false){const R=ag_rnd(S.seed||5);c.globalCompositeOperation="destination-out";c.fillStyle="#000";c.strokeStyle="#000";c.lineCap="round";
    // two branches reach in from the top right and one from the top left, leaves along them; nearer leaves sharper, farther softer
    for(const [b0,b1,b2] of [[P(1.06,-0.04),P(0.78,0.10),P(0.52,0.26)],[P(1.04,0.30),P(0.86,0.36),P(0.70,0.50)],[P(0.40,-0.06),P(0.30,0.06),P(0.16,0.16)]]){
      c.filter="blur(1px)";c.globalAlpha=0.7;c.lineWidth=7;c.beginPath();c.moveTo(b0[0],b0[1]);c.quadraticCurveTo(b1[0],b1[1],b2[0],b2[1]);c.stroke();
      for(let n=0;n<22;n++){const u=R(),m=1-u,x=m*m*b0[0]+2*m*u*b1[0]+u*u*b2[0],y=m*m*b0[1]+2*m*u*b1[1]+u*u*b2[1],side=n%2?1:-1,
          an=Math.atan2(b2[1]-b0[1],b2[0]-b0[0])+side*(0.6+R()*0.7),l=34+R()*40;
        c.filter="blur("+((3+R()*6)*k).toFixed(2)+"px)";c.globalAlpha=0.55+R()*0.4;c.beginPath();lp_leaf(c,x,y,l,an,0.3);c.fill();}}}
  big.imageSmoothingQuality="high";big.drawImage(sm,0,0,W,H);});}
// the patch in the sun's colour, kept once per colour
function lp_sunCol(S,col){return ag_kept("lpSunCol:"+[S.x,S.w,S.top,S.h,S.slant,S.seed,S.leaves].join(",")+"|"+col.join(","),W,H,(c)=>{c.drawImage(lp_sunMask(S),0,0);
  c.globalCompositeOperation="source-in";c.fillStyle=rgba(col,1);c.fillRect(0,0,W,H);});}
function lp_sun(ctx,S,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||!S)return;const bc=lp_sunCol(S,o.col||LP.sun);
  ctx.save();if(o.clip)o.clip(ctx);ctx.globalCompositeOperation="soft-light";ctx.globalAlpha=0.95*a;ctx.drawImage(bc,0,0);
  ctx.globalCompositeOperation="screen";ctx.globalAlpha=0.42*a;ctx.drawImage(bc,0,0);ctx.restore();}

/* ---------------------------------------------------------------- the room and its light
   lp_paintRoom(c, o) paints a room of the university on a 1920 x 1080 canvas: the wall down to hz (936: the floor shows only under
   the captions), a slim skirting, warm timber below, the side away from the window in a cool shade, and the sun's patch on the wall.
   o: hz; base (the lime's colour); seed (another wall); sun (where the patch falls, as lp_sun's S; false for none); light, one of
   LP_LIGHT: "day" (the afternoon sun, the default), "morning" (higher, paler, the patch narrower), "late" (low, warm, long), "grey"
   (an overcast day: no patch, the room even and a little cool) and "evening" (the window dark, a warm lamp's pool on the wall at
   o.lamp, [x, y], the lamp's place on the wall). Each place a film uses is painted once (AG_PLACES; check.py times it).
   The module's own place is "lpRoom", the team's room on an afternoon; a film adds others in its own source, with its own prefix:
     AG_PLACES.hmOffice = c => lp_paintRoom(c, {seed: 2, light: "morning"});
   lp_roomLight(ctx, a, o) lays the room's light over what is drawn in it (things, not words): the window's warmth on the right, the
   shade on the left, as o.light says (the place's light). */
const LP_LIGHT={
  day:{sun:{x:820,w:760,top:70,h:640,slant:170,seed:5},col:[255,214,150],a:1,shade:0.30,cool:0},
  morning:{sun:{x:1060,w:560,top:40,h:600,slant:90,seed:8},col:[255,232,196],a:0.85,shade:0.26,cool:0.04},
  late:{sun:{x:520,w:980,top:250,h:560,slant:260,seed:3},col:[255,184,128],a:1,shade:0.36,cool:0},
  grey:{sun:false,col:[236,236,240],a:0,shade:0.22,cool:0.08,dim:0.06},
  evening:{sun:false,col:[255,196,132],a:0,shade:0.5,cool:0,dark:0.42,lamp:[1380,300],dim:0.2}
};
function lp_paintRoom(c,o){o=o||{};const hz=o.hz||936,L=LP_LIGHT[o.light||"day"],S=o.sun===false?false:Object.assign({},L.sun||{},o.sun||{});
  lp_plaster(c,hz,o);
  // the room's light: the side away from the window and the top corners in a cool shade
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,L.shade));g.addColorStop(0.42,rgba(LP.shade,L.shade*0.33));g.addColorStop(1,rgba(LP.shade,L.shade*0.07));c.fillStyle=g;c.fillRect(0,0,W,hz);
  g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(LP.shade,0.16));g.addColorStop(0.3,rgba(LP.shade,0));g.addColorStop(0.8,rgba(LP.shade,0));g.addColorStop(1,rgba(LP.shade,0.14));c.fillStyle=g;c.fillRect(0,0,W,hz);
  if(L.cool){c.fillStyle=rgba([150,164,196],L.cool);c.fillRect(0,0,W,hz);}
  if(L.dark){c.save();c.globalCompositeOperation="multiply";c.fillStyle=rgba(mix([255,255,255],[70,62,72],L.dark),1);c.fillRect(0,0,W,hz);c.restore();}
  lp_floor(c,lp_floorTex(),hz,600,300);
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(LP.shade,0.3));g.addColorStop(0.4,rgba(LP.shade,0.1));g.addColorStop(1,rgba(LP.shade,0.26));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  c.fillStyle=rgba(mix(o.base||LP.wall,LP.shade,0.14),1);c.fillRect(0,hz-22,W,22);c.fillStyle="rgba(255,250,240,0.45)";c.fillRect(0,hz-22,W,1.5);c.fillStyle=rgba(LP.shade,0.4);c.fillRect(0,hz,W,2);
  if(S&&S.w&&L.a>0)lp_sun(c,S,{a:L.a,col:L.col,clip:x=>{x.beginPath();x.rect(0,0,W,hz-22);x.clip();}});
  if(L.lamp){const lm=o.lamp||L.lamp;c.save();c.globalCompositeOperation="screen";g=c.createRadialGradient(lm[0],lm[1],10,lm[0],lm[1]+80,700);
    g.addColorStop(0,"rgba(255,206,150,0.7)");g.addColorStop(0.3,"rgba(255,190,130,0.3)");g.addColorStop(1,"rgba(255,190,130,0)");c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
    if(L.dark){c.save();c.globalCompositeOperation="multiply";c.fillStyle=rgba(mix([255,255,255],[70,62,72],L.dark*0.5),1);c.fillRect(0,hz,W,H-hz);c.restore();}}
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.24));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.lpRoom=c=>lp_paintRoom(c);
function lp_roomLight(ctx,a,o){a=a==null?1:a;if(a<=0)return;o=o||{};const L=LP_LIGHT[o.light||"day"];ctx.save();
  let g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,L.shade*0.4*a));g.addColorStop(0.45,rgba(LP.shade,0));g.addColorStop(1,rgba(L.col,0.05*a));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(L.dark){ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mix([255,255,255],[150,138,140],a*L.dark),1);ctx.fillRect(0,0,W,H);}ctx.restore();}
// a vignette in the frame itself, over a shot (it stays put while the camera moves)
function lp_vign(ctx,S,a){setScreen(ctx,S);const v=ctx.createRadialGradient(W/2,H/2,H*0.36,W/2,H/2,W*0.72);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,rgba(LP.shade,0.3*(a==null?1:a)));ctx.fillStyle=v;ctx.fillRect(0,0,W,H);}

/* ===== Leading data people: the people, in the room's light =====
   The people are the agent films' (films/what-an-agent-is/shared/src/people.js, bundled as it is): an adult's proportions, one
   three-quarter head (AG_FACE), arms down, a hand only on the thing the story is about (pose "hold"). Here they stand in a room whose
   window is on the right of the frame, whichever way they face, so each is drawn whole, then lit: the side towards the window takes a
   little of the sun's warmth, the side away from it a little of the room's cool shade, and a soft shadow of them falls on the wall
   behind, down and to the left. Skin keeps its own colour where the light falls.

   lp_person(ctx, who, x, y, s, o) draws a person as ag_person does (the same who, x, y, s and o: t, flip, pose, hold, front, nod, gaze,
   talk, smile, cut, covered), and returns the hands as it does. who is a name in LP_CAST (this module's people) or in the agent films'
   cast ("noor", "sam", "jun", "mei", "yusuf", "clara", "anil", "david"), or a spec of someone else (see people.js there). o.light:
     light   the place's light, a name in LP_LIGHT ("day" by default), for the warmth and the shade
     warm    how much of the window's warmth the near side takes, 0 to 1 (0.12)
     shade   how far the far side sinks into the room's shade, 0 to 1 (0.2)
     wall    the soft shadow on the wall: its strength, 0 to 1 (0.16; 0 when the person stands far from any wall, or out of doors),
             and wallDx, wallDy where it falls, in figure units ([-90, 40])
   o.a fades them (0 to 1), as the canvas's own opacity does: a person fading in or out is drawn whole first and laid on the picture
   at that opacity, so they never show through themselves.
   LP_CROWD and lp_crowd(i): eight people for a crowd, such as students in a teaching room of the building in section.
   lp_nameTag(ctx, x, y, who, o) writes a person's name and the line under it (their role): o.align, o.role, o.a. */

/* ---------------------------------------------------------------- the cast this module adds
   As the module's numbers set them (/mnt/project-files/leading-data-people/numbers.md): Helena Novak, the data manager, as the data
   management module drew her; Ivy Reyes, a new graduate data analyst; Graham Ellis, the new Director of Facilities. Noor Rahman, Sam
   Okafor, Jun Park, Yusuf Demir and the others are the agent films' (AG_CAST). Each was looked at full size, facing both ways, on 5
   November 2026. Their clothes keep clear of the five colours that mean something. */
const LP_CAST={
  helena:{name:"Helena Novak",role:"Data manager",skin:[230,192,164],hair:{style:"long",c:[102,62,44],streak:[150,128,116]},glasses:[58,46,42],earrings:[214,200,170],top:{kind:"blazer",c:[118,64,72],inner:[240,234,228]},breath:0.26},
  ivy:{name:"Ivy Reyes",role:"Data analyst",skin:[214,170,136],hair:{style:"bob",c:[38,28,26]},earrings:[214,200,170],top:{kind:"sweater",c:[74,72,78]},breath:0.33},
  graham:{name:"Graham Ellis",role:"Facilities",skin:[226,186,158],hair:{style:"cropped",c:[170,166,162]},glasses:[64,56,50],top:{kind:"blazer",c:[104,90,74],inner:[232,230,224]},breath:0.24}
};
/* people in a crowd (students in a teaching room, staff in a corridor), so the cast never stands in for them: eight, of many ages and
   backgrounds, in plain clothes that mean nothing (each with a key of its own: the agent films keep a painted person by key or name); lp_crowd(i) is the i-th, round and round. Drawn small, but each was looked at full
   size, facing both ways, on 5 November 2026. */
const LP_CROWD=[
  {key:"lpCrowd1",name:"",skin:[238,206,180],hair:{style:"bob",c:[196,150,96]},top:{kind:"sweater",c:[150,140,128]},breath:0.31},
  {key:"lpCrowd2",name:"",skin:[120,82,60],hair:{style:"coily",c:[26,22,20]},top:{kind:"overshirt",c:[96,92,90],inner:[226,222,214]},breath:0.27},
  {key:"lpCrowd3",name:"",skin:[214,172,138],hair:{style:"long",c:[30,24,22]},earrings:[214,200,170],top:{kind:"cardigan",c:[176,150,138],inner:[236,232,226]},breath:0.3},
  {key:"lpCrowd4",name:"",skin:[196,150,112],hair:{style:"cropped",c:[34,28,26]},top:{kind:"sweater",c:[110,104,112]},breath:0.26},
  {key:"lpCrowd5",name:"",skin:[230,196,170],hair:{style:"side",c:[132,96,62]},glasses:[60,52,46],top:{kind:"overshirt",c:[136,124,104],inner:[232,230,224]},breath:0.28},
  {key:"lpCrowd6",name:"",skin:[92,62,46],hair:{style:"bun",c:[24,20,20]},top:{kind:"cardigan",c:[164,150,128],inner:[234,230,222]},breath:0.29},
  {key:"lpCrowd7",name:"",skin:[226,190,160],hair:{style:"shaved",c:[60,48,40]},beard:[70,56,46],top:{kind:"sweater",c:[78,80,88]},breath:0.25},
  {key:"lpCrowd8",name:"",skin:[204,164,128],hair:{style:"bob",c:[52,36,30]},glasses:[44,40,40],top:{kind:"sweater",c:[188,176,160]},breath:0.32}];
const lp_crowd=i=>LP_CROWD[((i%LP_CROWD.length)+LP_CROWD.length)%LP_CROWD.length];
const lp_who=who=>typeof who==="string"&&LP_CAST[who]?LP_CAST[who]:who;

/* ---------------------------------------------------------------- a person in the room */
function lp_person(ctx,who,x,y,s,o){o=o||{};const a=ctx.globalAlpha*(o.a==null?1:o.a);if(a<0.004)return null;const W0=lp_who(who),
    L0=Object.assign({light:"day",warm:0.12,shade:0.2,wall:0.16,wallDx:-90,wallDy:40},o.light||{}),Lt=LP_LIGHT[L0.light]||LP_LIGHT.day;
  const A=AG_FIG.anchor,m=ctx.getTransform(),M=m.translate(x,y).scale(o.flip?-s:s,s).translate(-A[0],-A[1]),cw=ctx.canvas.width,ch=ctx.canvas.height;
  const pt=(fx,fy)=>[M.a*fx+M.c*fy+M.e,M.b*fx+M.d*fy+M.f],k=Math.hypot(M.a,M.b);
  // the part of the canvas the person (and what the near hand may hold) can reach
  let L=1e9,R=-1e9,T0=1e9,B=-1e9;for(const [fx,fy] of [[-260,120],[820,120],[-260,1160],[820,1160]]){const q=pt(fx,fy);L=Math.min(L,q[0]);R=Math.max(R,q[0]);T0=Math.min(T0,q[1]);B=Math.max(B,q[1]);}
  L=Math.max(0,Math.floor(L));T0=Math.max(0,Math.floor(T0));R=Math.min(cw,Math.ceil(R));B=Math.min(ch,Math.ceil(B));if(R<=L||B<=T0)return null;const w=R-L,h=B-T0;
  // the person, whole, on a canvas of their own
  const [pc,px]=ag_buf("lpPerson",cw,ch);px.setTransform(m);let hands;try{hands=ag_person(px,W0,x,y,s,Object.assign({},o,{light:undefined,a:undefined}));}finally{px.setTransform(1,0,0,1,0,0);px.globalAlpha=1;}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);
  // the soft shadow on the wall: the silhouette made small and dark, laid back larger, down and to the left
  if(L0.wall>0){const sw=Math.max(2,Math.ceil(w/8)),sh=Math.max(2,Math.ceil(h/8)),[sc,sx]=ag_buf("lpWallShadow",sw,sh);sx.filter="blur(2px)";sx.drawImage(pc,L,T0,w,h,0,0,sw,sh);sx.filter="none";
    sx.globalCompositeOperation="source-in";sx.fillStyle=rgba(LP.shade,1);sx.fillRect(0,0,sw,sh);
    const dx=L0.wallDx*k,dy=L0.wallDy*k;ctx.globalAlpha=a*L0.wall*(Lt.a>0?1:0.6);ctx.imageSmoothingQuality="high";ctx.drawImage(sc,0,0,sw,sh,L+dx-w*0.03,T0+dy,w*1.06,h*1.02);}
  // the light: warm from the window on the right of the frame, the room's shade on the left
  px.globalCompositeOperation="source-atop";let g=px.createLinearGradient(L,0,R,0);
  g.addColorStop(0,rgba(LP.shade,L0.shade));g.addColorStop(0.5,rgba(LP.shade,L0.shade*0.25));g.addColorStop(0.62,rgba(Lt.col,0));g.addColorStop(1,rgba(Lt.col,L0.warm*(Lt.a>0?1:0.5)));
  px.fillStyle=g;px.fillRect(L,T0,w,h);px.globalCompositeOperation="source-over";
  ctx.globalAlpha=a;ctx.drawImage(pc,L,T0,w,h,L,T0,w,h);ctx.restore();
  return hands;}

// a person's name, and the line under it (their role)
function lp_nameTag(ctx,x,y,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const P_=typeof who==="string"?(LP_CAST[who]||AG_CAST[who]):who,
    name=o.name||(P_&&P_.name)||String(who),role=o.role!=null?o.role:(P_&&P_.role)||"",al=o.align||"left";
  ctx.save();ctx.globalAlpha*=a;lp_T(ctx,name,x,y,{w:800,size:32,align:al});if(role)lp_T(ctx,role,x,y+38,{w:600,size:28,col:LP.mut,align:al});ctx.restore();}

/* ===== Leading data people: sheets on the wall, pills, tags, the kicker, the mark, and the title and end cards =====
   Words in these films are on sheets of thick, warm paper pinned to the wall: a soft shadow down and to the left (the window is on the
   right), the sun on them where its patch falls, and a band of colour along the top only when the colour means something (look.js,
   LP: blue design and plans, green done or value, amber risk, cost or waiting, orange data, violet only an agent). On a sheet: a kicker
   in capitals, 28 px, in the band's colour; a title, 40 px; lines of 28 px, each with a dot in the band's colour.
     lp_sheet(ctx, x, y, w, h, o)          a sheet: o.col (the band), o.light (the place's light, so the sun falls on it as on the wall;
                                           null for none), o.pin (false: no pin), o.tilt (degrees, a little askew), o.a, o.k (springs
                                           from its centre, 0 to 1); returns {x, y, w, h}
     lp_textSheet(ctx, x, y, w, words, o)  words {kick, title, lines: [...], sub}: a sheet that fits them; o as lp_sheet, o.measure (only
                                           measure), o.u (0 to 1: its lines come in one by one); returns {x, y, w, h}
     lp_figure(ctx, x, y, w, words, o)     a sheet with one number: words {kick, num, label}; the number 96 px in the band's colour
     lp_bars(ctx, x, y, w, h, bars, o)     bars, drawn on a sheet the film draws first: bars [{v, label (under it), show (its value, over
                                           it), hi}], o.max (the top, 100 by default), o.col (orange: data), o.hiOnly (only the bars with hi
                                           in full colour), o.u (0 to 1: they grow), o.line ({v, label, side}: a dashed level across them,
                                           its label on a slip at the right end, or the left with side "left")
     lp_pill(ctx, x, y, text, o)           a solid verdict centred on (x, y), white words on its colour: o.col, o.icon ("tick", "cross",
                                           "wait", "dot"), o.size (30), o.a, o.k
     lp_tag(ctx, x, y, text, o)            an outlined tag on paper, words in its colour: o.col, o.align ("left", "center", "right"), o.a
     lp_kicker(ctx, num, title, o)         the film's number and title at the top left (o.light "evening": pale words for a dark room)
     lp_sceneTag(ctx, text, o)             where and when, at the top right: "The university, 2027 · imagined"
     lp_mark(ctx, cx, cy, r, p, a)         the module's mark, drawing itself: five people in a ring, joined
     lp_veil(ctx, S, a)                    the room's warm light laid over the frame, for the title and end cards
     lp_title(ctx, S, t, t0, title, sub, line, o)        the title card from t0 (line: "Leading data people · The new skills")
     lp_end(ctx, S, t, t0, title, line, n, series, o)   the end card from t0: the film's last line, the mark, the title, and "Film 1 of
                                           3 · The new skills · Learning Data". Data management passes o.module and o.mark (its own mark,
                                           a function (ctx, cx, cy, r, p, a)) to both. */

function lp_sheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(o.tilt){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.tilt*Math.PI/180);ctx.translate(-x-w/2,-y-h/2);}
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=20;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(x,y,w,h);ctx.restore();
  let g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.3)");g.addColorStop(1,"rgba(120,96,70,0.08)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  if(o.col){ctx.fillStyle=rgba(o.col,1);ctx.fillRect(x,y,w,12);}
  const lt=o.light===undefined?"day":o.light,Lt=lt&&LP_LIGHT[lt];if(Lt&&Lt.sun&&Lt.a>0&&!o.tilt)lp_sun(ctx,Lt.sun,{a:Lt.a*0.8,col:Lt.col,clip:c=>{c.beginPath();c.rect(x,y,w,h);c.clip();}});
  // in low light the paper is dimmer too (the words on it stay dark, so they keep their contrast)
  if(Lt&&Lt.dim){ctx.fillStyle=rgba(LP.shade,Lt.dim);ctx.fillRect(x,y,w,h);}
  if(o.pin!==false){const mx=x+w/2,my=y+(o.col?32:22);ctx.save();ctx.shadowColor="rgba(40,28,20,0.4)";ctx.shadowBlur=6;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=3;
    ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.arc(mx,my,9,0,TAU);ctx.fill();ctx.restore();ctx.fillStyle="rgba(255,255,255,0.35)";ctx.beginPath();ctx.arc(mx+2.5,my-3,3,0,TAU);ctx.fill();}
  ctx.restore();return bb;}
const LP_PAD=36;
function lp_textSheet(ctx,x,y,w,words,o){o=o||{};const inner=w-LP_PAD*2,tl=words.title?lp_wrap(ctx,words.title,inner,{w:800,size:40}):[],sl=words.sub?lp_wrap(ctx,words.sub,inner,{w:600,size:28}):[],
    ls=(words.lines||[]).map(l=>lp_wrap(ctx,l,inner-34,{w:600,size:28}));
  const h=LP_PAD+30+(words.kick?44:0)+tl.length*50+sl.length*38+(tl.length&&(sl.length||ls.length)?10:0)+ls.reduce((s,l)=>s+l.length*38+12,0)+LP_PAD-14,bb={x,y,w,h};
  if(o.measure)return bb;const a=o.a==null?1:o.a;if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(o.tilt){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.tilt*Math.PI/180);ctx.translate(-x-w/2,-y-h/2);}
  lp_sheet(ctx,x,y,w,h,Object.assign({},o,{a:1,k:null,tilt:0}));const col=o.col||LP.mut;let yy=y+LP_PAD+30;
  if(words.kick){lp_T(ctx,String(words.kick).toUpperCase(),x+LP_PAD,yy+14,{w:800,size:28,ls:3,col});yy+=44;}
  for(const l of tl){yy+=42;lp_T(ctx,l,x+LP_PAD,yy,{w:800,size:40});yy+=8;}
  for(const l of sl){yy+=38;lp_T(ctx,l,x+LP_PAD,yy,{w:600,size:28,col:LP.mut});}
  if(tl.length&&(sl.length||ls.length))yy+=10;
  ls.forEach((l,n)=>{const la=o.u==null?1:clamp(o.u*ls.length-n,0,1);ctx.save();ctx.globalAlpha*=ag_sine(la);
    l.forEach((s,i)=>{yy+=38;if(i===0){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x+LP_PAD+8,yy-10,6,0,TAU);ctx.fill();}lp_T(ctx,s,x+LP_PAD+34,yy,{w:600,size:28});});yy+=12;ctx.restore();});
  ctx.restore();return bb;}
function lp_figure(ctx,x,y,w,words,o){o=o||{};const col=o.col||LP.orange,ll=words.label?lp_wrap(ctx,words.label,w-LP_PAD*2,{w:600,size:28}):[],h=LP_PAD+16+(words.kick?44:0)+104+ll.length*38+LP_PAD,bb={x,y,w,h};
  if(o.measure)return bb;const a=o.a==null?1:o.a;if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,Object.assign({},o,{a:1,k:null,col}));let yy=y+LP_PAD+30;
  if(words.kick){lp_T(ctx,String(words.kick).toUpperCase(),x+LP_PAD,yy+14,{w:800,size:28,ls:3,col});yy+=44;}
  lp_T(ctx,words.num,x+LP_PAD,yy+92,{w:800,size:96,col});yy+=104;for(const l of ll){yy+=38;lp_T(ctx,l,x+LP_PAD,yy,{w:600,size:28});}
  ctx.restore();return bb;}
function lp_bars(ctx,x,y,w,h,bars,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=o.col||LP.orange,max=o.max||100,n=bars.length,gap=Math.min(28,w/n*0.3),bw=(w-gap*(n-1))/n,base=y+h-48,top=base-y-40;
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(LP.mut,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,base+1);ctx.lineTo(x+w,base+1);ctx.stroke();
  const ly=o.line?base-top*o.line.v/max:null,B=bars.map((b,i)=>{const u=o.u==null?1:ag_eo(clamp(o.u*n*0.6-i*0.6+0.6,0,1));return{b,u,bh:top*b.v/max*u,bx:x+i*(bw+gap)};});
  for(const {b,u,bh,bx} of B){ctx.fillStyle=rgba(b.hi===false||(o.hiOnly&&!b.hi)?mix(col,LP.paper,0.55):col,1);rr(ctx,bx,base-bh,bw,bh,Math.min(6,bw/4));ctx.fill();
    if(b.label)lp_T(ctx,b.label,bx+bw/2,base+36,{w:600,size:28,align:"center",col:LP.mut});}
  // a level across the bars, dashed, such as "Half the hours"
  if(o.line){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(LP.ink,0.7);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x-8,ly);ctx.lineTo(x+w+8,ly);ctx.stroke();ctx.restore();}
  // each bar's value over it; where the level would cross it, inside the bar's top in white instead (or just over the level, for a
  // bar too short to hold it)
  for(const {b,u,bh,bx} of B){if(!b.show||u<=0.98)continue;let vy=base-bh-12,vc=LP.ink;
    if(ly!=null&&vy-28<ly+6&&vy+6>ly-6){if(bh>=56){vy=base-bh+38;vc=[255,255,255];}else vy=ly-12;}
    lp_T(ctx,b.show,bx+bw/2,vy,{w:800,size:28,align:"center",col:vc});}
  // the level's label on a slip of paper at the line's right end (o.line.side "left": its left end), so it reads over a bar too
  if(o.line&&o.line.label){const tw=lp_tw(ctx,o.line.label,{w:800,size:28}),left=o.line.side==="left",sx=left?x-5:x+w-tw-21;
    ctx.save();ctx.shadowColor="rgba(52,36,30,0.18)";ctx.shadowBlur=6;ctx.shadowOffsetX=LP.sdx*0.3;ctx.shadowOffsetY=2;ctx.fillStyle=rgba(LP.paper,1);rr(ctx,sx,ly-44,tw+26,38,6);ctx.fill();ctx.restore();
    lp_T(ctx,o.line.label,sx+13,ly-15,{w:800,size:28});}
  ctx.restore();}

/* ---------------------------------------------------------------- pills and tags */
function lp_icon(ctx,kind,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s/48,s/48);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.lineJoin="round";
  if(kind==="tick"){ctx.beginPath();ctx.moveTo(-14,1);ctx.lineTo(-4,11);ctx.lineTo(15,-11);ctx.stroke();}
  else if(kind==="cross"){ctx.beginPath();ctx.moveTo(-12,-12);ctx.lineTo(12,12);ctx.moveTo(12,-12);ctx.lineTo(-12,12);ctx.stroke();}
  else if(kind==="wait"){ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,17,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(0,0);ctx.lineTo(7,6);ctx.stroke();}
  else{ctx.beginPath();ctx.arc(0,0,9,0,TAU);ctx.fill();}ctx.restore();}
function lp_pill(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||30,col=o.col||LP.green,icon=o.icon,w=lp_tw(ctx,text,{w:800,size})+(icon?100:60),h=size+30,bx=x-w/2,by=y-h/2;
  if(a<=0.004)return{x:bx,y:by,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.28)";ctx.shadowBlur=14;ctx.shadowOffsetX=LP.sdx*0.5;ctx.shadowOffsetY=6;rr(ctx,bx,by,w,h,h/2);ctx.fillStyle=rgba(col,1);ctx.fill();ctx.restore();
  if(icon)lp_icon(ctx,icon,bx+44,y,30,[255,255,255]);lp_T(ctx,text,icon?bx+72:x,y+size*0.36,{w:800,size,align:icon?"left":"center",color:"#fff"});ctx.restore();return{x:bx,y:by,w,h};}
function lp_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||LP.mut,w=lp_tw(ctx,text,{w:700,size:28})+52,h=54,bx=o.align==="center"?x-w/2:o.align==="right"?x-w:x,by=y-h/2;
  if(a<=0.004)return{x:bx,y:by,w,h};ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(52,36,30,0.22)";ctx.shadowBlur=12;ctx.shadowOffsetX=LP.sdx*0.4;ctx.shadowOffsetY=5;
  rr(ctx,bx,by,w,h,h/2);ctx.fillStyle="rgba(250,247,240,0.97)";ctx.fill();ctx.restore();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;rr(ctx,bx+1,by+1,w-2,h-2,h/2);ctx.stroke();
  lp_T(ctx,text,bx+w/2,y+10,{w:700,size:28,align:"center",col});ctx.restore();return{x:bx,y:by,w,h};}

/* ---------------------------------------------------------------- the kicker, where and when, the mark, the title and end cards */
// o.light: the place's light; in a dark room ("evening") the words are pale
function lp_kicker(ctx,num,title,o){o=o||{};const x=o.x||96,y=o.y||100,a=o.a==null?1:o.a;if(a<=0.004)return;const dk=o.light&&LP_LIGHT[o.light]&&LP_LIGHT[o.light].dark;
  lp_T(ctx,String(num),x,y,{w:800,size:28,col:dk?LP.paper:LP.ink,a});lp_T(ctx,String(title).toUpperCase(),x+lp_tw(ctx,String(num),{w:800,size:28})+22,y,{w:800,size:28,ls:3.5,col:dk?[226,216,206]:LP.mut,a});}
function lp_sceneTag(ctx,text,o){o=o||{};const a=o.a==null?1:o.a;lp_tag(ctx,o.x||1824,o.y||91,text||"The university, 2027 · imagined",{align:"right",col:LP.mut,a});}
// the module's mark: five people in a ring, each a small disc; the ring that joins them draws itself, from the top, clockwise
function lp_mark(ctx,cx,cy,r,p,a){if(a<=0.01)return;p=clamp(p,0,1);ctx.save();ctx.globalAlpha*=a;const ring=ag_sine(p/0.75);ctx.lineCap="round";
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.8);g.addColorStop(0,rgba(LP.sun,0.5*ag_sine(p/0.6)));g.addColorStop(1,rgba(LP.sun,0));ctx.fillStyle=g;ctx.fillRect(cx-r*1.8,cy-r*1.8,r*3.6,r*3.6);
  ctx.strokeStyle=rgba(LP.ink,1);ctx.lineWidth=Math.max(2,r*0.07);ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*ring);ctx.stroke();
  for(let i=0;i<5;i++){const an=-Math.PI/2+i*TAU/5,f=ag_spr(p*5-i*0.6,0,0.5);if(f<=0)continue;const px=cx+Math.cos(an)*r,py=cy+Math.sin(an)*r,rr2=r*0.2*f;
    ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.arc(px,py,rr2+r*0.06,0,TAU);ctx.fill();ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(px,py,rr2,0,TAU);ctx.fill();}
  ctx.restore();}
function lp_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle=rgba(mix(LP.paper,LP.wall,0.35),clamp(a,0,1));ctx.fillRect(0,0,W,H);}
function lp_title(ctx,S,t,t0,title,sub,line,o){o=o||{};const oA=ag_in(t,t0,0.8),tA=ag_in(t,t0+0.5,0.8);if(oA<=0)return;lp_veil(ctx,S,oA*0.88);setScreen(ctx,S);
  withA(ctx,tA,()=>{(o.mark||lp_mark)(ctx,960,320,64,(t-t0-0.4)/1.8,1);lp_T(ctx,title,960,520,{w:800,size:84,align:"center"});
    if(sub)lp_T(ctx,sub,960,598,{w:600,size:36,align:"center",col:LP.mut});withA(ctx,ag_in(t,t0+1.2,0.8),()=>lp_T(ctx,line,960,700,{w:800,size:28,ls:3.5,align:"center",col:LP.mut}));});}
function lp_end(ctx,S,t,t0,title,line,n,series,o){o=o||{};const oA=ag_in(t,t0,1.0),tA=ag_in(t,t0+0.6,0.9);if(oA<=0)return;lp_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)lp_T(ctx,line,960,350,{w:700,size:48,align:"center"});(o.mark||lp_mark)(ctx,960,496,56,(t-t0-0.7)/1.6,1);lp_T(ctx,title,960,650,{w:800,size:44,align:"center"});
    lp_T(ctx,(n?n+" · ":"")+(series||o.module||"Leading data people")+" · Learning Data",960,708,{w:600,size:28,align:"center",col:LP.mut});});}

/* ===== Leading data people: what stands in a room =====
   Matte things in warm timber and graphite, lit from the window on the right, their soft shadows falling down and to the left.
     lp_table(ctx, x, y, w, o)        a long timber table: the top of its front edge at (x, y), w wide, its top receding o.depth (64) up
                                      the frame, its legs down to the floor at o.floor (936, the room's skirting; null for none); o.a. Returns the height to cut people at behind it (y - 6): draw the people first with
                                      that cut, then the table, which hides their hanging arms
     lp_screen(ctx, x, y, w, h, o)    a screen on the wall, its glass from (x, y), w by h: o.draw(ctx, x, y, w, h) draws what it shows,
                                      clipped to the glass, on o.bg (paper white by default); o.a
     lp_laptop(ctx, x, y, w, o)       an open laptop on a table, seen from behind its lid: the middle of the lid's foot at (x, y), w wide;
                                      o.glow 0 to 1 (its screen's light on whoever faces it); o.a
     lp_door(ctx, x, y, w, h, o)      a timber door in the wall, from (x, y), w by h, o.open 0 to 1 (the dark beyond shows); o.a
     lp_chairs(ctx, x, y, n, o)       a row of n chairs seen from the side, as in a teaching room cut open: the first's foot at (x, y),
                                      o.gap (46) apart, o.s (1) their size, o.col; o.a */
function lp_table(ctx,x,y,w,o){o=o||{};const d=o.depth||64,th=o.th||20,a=o.a==null?1:o.a;if(a<=0)return y-6;ctx.save();ctx.globalAlpha*=a;const Tb=LP.timber,fl=o.floor===undefined?936:o.floor;
  // the legs and their shadows on the floor
  if(fl!=null&&fl>y+th){for(const lx of [x+26,x+w-46]){ctx.fillStyle=rgba(mix(Tb,LP.shade,0.42),1);ctx.fillRect(lx,y+th,20,fl-y-th+6);}
    ctx.fillStyle=rgba(LP.shade,0.18);ctx.beginPath();ctx.ellipse(x+w/2+LP.sdx*3,fl+10,w*0.5,14,0,0,TAU);ctx.fill();}
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,rgba(mix(Tb,[255,250,240],0.22),1));g.addColorStop(1,rgba(Tb,1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+d*0.4,y-d);ctx.lineTo(x+w-d*0.4,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  // the sun on the table's far right, and the room's shade on its left
  g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(LP.shade,0.14));g.addColorStop(0.5,rgba(LP.shade,0));g.addColorStop(1,rgba(LP.sun,0.16));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x+d*0.4,y-d);ctx.lineTo(x+w-d*0.4,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,248,236,0.75)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();
  g=ctx.createLinearGradient(0,y,0,y+th);g.addColorStop(0,rgba(mix(Tb,LP.shade,0.12),1));g.addColorStop(1,rgba(mix(Tb,LP.shade,0.38),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,th);
  ctx.fillStyle=rgba(LP.shade,0.16);ctx.fillRect(x,y+th,w,8);ctx.restore();return y-6;}
function lp_screen(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,b=Math.max(10,w*0.022);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.32)";ctx.shadowBlur=26;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=14;ctx.fillStyle=rgba(LP.graphite,1);rr(ctx,x-b,y-b,w+2*b,h+2*b,b*0.8);ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,4);ctx.clip();ctx.fillStyle=o.bg||"#FBF9F4";ctx.fillRect(x,y,w,h);if(o.draw)o.draw(ctx,x,y,w,h);
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.1)");g.addColorStop(0.5,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.restore();}
function lp_laptop(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*0.64;ctx.save();ctx.globalAlpha*=a;
  if(o.glow>0){const g=ctx.createRadialGradient(x,y-h*0.6,0,x,y-h*0.6,w*1.4);g.addColorStop(0,"rgba(236,242,255,"+(0.18*o.glow)+")");g.addColorStop(1,"rgba(236,242,255,0)");ctx.fillStyle=g;ctx.fillRect(x-w*1.4,y-h*2,w*2.8,h*2.6);}
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=14;ctx.shadowOffsetX=LP.sdx*0.6;ctx.shadowOffsetY=6;
  let g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,"#5A585C");g.addColorStop(1,"#86848A");ctx.fillStyle=g;rr(ctx,x-w/2,y-h,w,h,8);ctx.fill();ctx.restore();
  ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(x-w/2+6,y-h+2,w-12,2);ctx.fillStyle="#3E3D42";ctx.fillRect(x-w/2-6,y-4,w+12,8);ctx.restore();}
function lp_door(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const op=clamp(o.open||0,0,1);ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(mix(LP.wall,LP.shade,0.3),1);ctx.fillRect(x-14,y-14,w+28,h+14);ctx.fillStyle="rgba(34,28,30,1)";ctx.fillRect(x,y,w,h);
  const dw=w*(1-op*0.8);let g=ctx.createLinearGradient(x,0,x+dw,0);g.addColorStop(0,rgba(mix(LP.timber,LP.shade,0.2),1));g.addColorStop(1,rgba(LP.timber,1));ctx.fillStyle=g;ctx.fillRect(x,y,dw,h);
  ctx.strokeStyle=rgba(mix(LP.timber,LP.shade,0.45),1);ctx.lineWidth=2;ctx.strokeRect(x+dw*0.12,y+h*0.06,dw*0.76,h*0.4);ctx.strokeRect(x+dw*0.12,y+h*0.52,dw*0.76,h*0.4);
  ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.arc(x+dw*0.88,y+h*0.5,7,0,TAU);ctx.fill();ctx.restore();}
function lp_chairs(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const s=o.s||1,gap=(o.gap||46)*s,col=rgba(o.col||mix(LP.timber,LP.shade,0.2),1);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=col;
  for(let i=0;i<n;i++){const cx=x+i*gap;ctx.fillRect(cx,y-46*s,30*s,6*s);ctx.fillRect(cx+2*s,y-40*s,4*s,40*s);ctx.fillRect(cx+24*s,y-40*s,4*s,40*s);ctx.fillRect(cx+24*s,y-78*s,5*s,34*s);}ctx.restore();}

/* ===== Leading data people: a building cut open =====
   The university's buildings drawn as an architect's section: the walls and floors cut through in a dark warm grey, each room a small
   stage behind them, its back wall in lime with windows on the sky, lit by its own lamp when it's in use. Drawn live, in the place's
   coordinates, so it stays sharp however close the camera comes; the sky and the ground behind it are the place "lpSky", painted once.
   It shows what the story of the rooms is about at a glance: which rooms are booked, which are used, which stand empty.
     LP_TEACHING                        the teaching building: four floors, fourteen rooms (a lecture theatre, a foyer, twelve teaching
                                        rooms), ids "G.01" to "3.03", for the story of Graham's rooms
     lp_section(ctx, plan, o)           draws a building: plan as LP_TEACHING ({x0, ground, slab, wall, floors: [{h, rooms: [{id, w,
                                        kind}]}]}; kinds "teach", "theatre", "foyer", "meet", "office", "team"); o.room(id, box) returns
                                        how a room looks now: {lit (0 to 1: its lamp), dim (0 to 1: in shadow, not part of the story),
                                        edge (a colour: a line round it, when the colour means something)}; o.a
     lp_sectionRooms(plan)              every room's box, {id, kind, x, y, w, h}, the floor at y + h
     lp_roomBox(plan, id)               one room's box
     lp_roomCam(plan, id, pad)          a camera key [x, y, zoom] that frames that room, pad (0.12) of its width around it
     lp_seat(plan, id, u, s)            where a person stands behind the room's table or desk, part u (0 to 1) of the way across:
                                        {x, y, s, cut}, for lp_person(ctx, who, p.x, p.y, p.s, {cut: p.cut, ...}); s (0.17) their size */
const LP_SEC={cut:[72,62,60],room:[230,216,196],shade:[60,48,48],sky0:[188,206,222],sky1:[238,228,210],ground:[122,106,90],seat:[146,114,88]};
const LP_TEACHING={x0:200,ground:900,slab:16,wall:16,floors:[
  {h:200,rooms:[{id:"G.01",w:560,kind:"theatre"},{id:"G.02",w:420,kind:"foyer"},{id:"G.03",w:540,kind:"teach"}]},
  {h:170,rooms:[{id:"1.01",w:380,kind:"teach"},{id:"1.02",w:380,kind:"teach"},{id:"1.03",w:380,kind:"teach"},{id:"1.04",w:380,kind:"teach"}]},
  {h:170,rooms:[{id:"2.01",w:520,kind:"teach"},{id:"2.02",w:500,kind:"teach"},{id:"2.03",w:500,kind:"teach"}]},
  {h:170,rooms:[{id:"3.01",w:500,kind:"teach"},{id:"3.02",w:520,kind:"teach"},{id:"3.03",w:500,kind:"teach"}]}]};
function lp_sectionRooms(plan){const out=[];let y=plan.ground;for(const f of plan.floors){y-=f.h+plan.slab;let x=plan.x0+plan.wall;
  for(const r of f.rooms){out.push({id:r.id,kind:r.kind,x,y:y+plan.slab,w:r.w-plan.wall,h:f.h});x+=r.w;}}return out;}
function lp_roomBox(plan,id){const r=lp_sectionRooms(plan).find(q=>q.id===id);if(!r)throw new Error("lp_roomBox: no room "+id);return r;}
function lp_roomCam(plan,id,pad){const r=lp_roomBox(plan,id),p=pad==null?0.12:pad,w=r.w*(1+2*p),h=r.h*(1+2*p);const z=Math.max(1,Math.min(W/w,H/h));return[r.x+r.w/2,r.y+r.h/2,z];}
function lp_seat(plan,id,u,s){const r=lp_roomBox(plan,id);s=s||0.17;const fy=r.y+r.h,top=fy-(r.kind==="teach"||r.kind==="theatre"?60:66);return{x:r.x+r.w*(0.14+0.72*u),y:top-252*s,s,cut:top+2};}
function lp_paintSky(c){let g=c.createLinearGradient(0,0,0,LP_TEACHING.ground);g.addColorStop(0,rgba(LP_SEC.sky0,1));g.addColorStop(1,rgba(LP_SEC.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.filter="blur(34px)";c.fillStyle="rgba(255,252,246,0.6)";for(const [x,y,rx,ry] of [[240,170,240,42],[1680,120,280,48],[1000,70,320,38]]){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}c.restore();
  const gy=LP_TEACHING.ground;c.fillStyle=rgba(LP_SEC.ground,1);c.fillRect(0,gy,W,H-gy);g=c.createLinearGradient(0,gy,0,H);g.addColorStop(0,"rgba(40,30,24,0.18)");g.addColorStop(1,"rgba(40,30,24,0.42)");c.fillStyle=g;c.fillRect(0,gy,W,H-gy);
  // two trees, in a quiet grey-olive that means nothing
  for(const [x,s] of [[90,1.0],[1840,0.9]]){c.fillStyle="rgb(96,86,74)";c.fillRect(x-7,gy-150*s,14,150*s);c.fillStyle="rgb(138,138,118)";c.beginPath();c.ellipse(x,gy-230*s,90*s,136*s,0,0,TAU);c.fill();
    c.fillStyle="rgba(170,170,148,0.6)";c.beginPath();c.ellipse(x+22*s,gy-270*s,58*s,78*s,0,0,TAU);c.fill();}
  c.fillStyle=rgba(LP_SEC.cut,1);c.fillRect(0,gy,W,10);}
AG_PLACES.lpSky=c=>lp_paintSky(c);
function lp_section(ctx,plan,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const R=lp_sectionRooms(plan),x1=plan.x0+plan.floors[0].rooms.reduce((s,r)=>s+r.w,0)+plan.wall,
    top=R.reduce((m,r)=>Math.min(m,r.y),1e9)-plan.slab;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(LP_SEC.cut,1);ctx.fillRect(plan.x0,top,x1-plan.x0,plan.ground-top);ctx.fillRect(plan.x0-12,top-14,x1-plan.x0+24,16);
  for(const r of R){const st=o.room?o.room(r.id,r)||{}:{};lp_secRoom(ctx,r,st);}
  ctx.restore();}
function lp_secRoom(ctx,r,st){const lit=st.lit==null?0:st.lit;ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();
  let g=ctx.createLinearGradient(0,r.y,0,r.y+r.h);g.addColorStop(0,rgba(mix(LP_SEC.room,LP_SEC.shade,0.12),1));g.addColorStop(1,rgba(LP_SEC.room,1));ctx.fillStyle=g;ctx.fillRect(r.x,r.y,r.w,r.h);
  const nw=Math.max(1,Math.floor(r.w/180)),ww=Math.min(104,r.w/nw-60),wh=r.h*0.44;for(let i=0;i<nw;i++){const wx=r.x+(r.w/nw)*(i+0.5)-ww/2,wy=r.y+r.h*0.16;
    g=ctx.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,rgba(LP_SEC.sky0,1));g.addColorStop(1,rgba(LP_SEC.sky1,1));ctx.fillStyle=g;ctx.fillRect(wx,wy,ww,wh);
    ctx.strokeStyle="rgba(96,82,74,0.6)";ctx.lineWidth=3;ctx.strokeRect(wx,wy,ww,wh);ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.stroke();}
  if(lit>0){g=ctx.createRadialGradient(r.x+r.w/2,r.y,10,r.x+r.w/2,r.y+r.h*0.3,r.w*0.62);g.addColorStop(0,"rgba(255,224,168,"+(0.5*lit)+")");g.addColorStop(1,"rgba(255,224,168,0)");ctx.fillStyle=g;ctx.fillRect(r.x,r.y,r.w,r.h);
    ctx.fillStyle="rgba(255,236,200,"+(0.95*lit)+")";ctx.beginPath();ctx.ellipse(r.x+r.w/2,r.y+6,r.w*0.08,5,0,0,TAU);ctx.fill();}
  const fy=r.y+r.h;ctx.fillStyle=rgba(mix(LP_SEC.ground,[255,255,255],0.28),1);ctx.fillRect(r.x,fy-8,r.w,8);
  // a teaching room: a long desk across it, the chairs' backs just showing behind it (whoever sits there is drawn over them, cut at
  // the desk's top); a lecture theatre the same, its back wall stepped like its tiers
  if(r.kind==="theatre"){for(let k=1;k<4;k++){ctx.fillStyle=rgba(mix(LP_SEC.room,LP_SEC.shade,0.06*k),1);ctx.fillRect(r.x,fy-8-k*26,r.w,26*k>r.h?r.h:4);}}
  if(r.kind==="teach"||r.kind==="theatre"){const x0=r.x+30,x1=r.x+r.w-30;ctx.fillStyle=rgba(LP_SEC.seat,1);
    for(let cx=x0+24;cx<x1-30;cx+=46){rr(ctx,cx,fy-86,30,30,6);ctx.fill();}
    ctx.fillStyle=rgba(LP.timber,1);ctx.fillRect(x0,fy-62,x1-x0,8);ctx.fillStyle=rgba(mix(LP.timber,LP.shade,0.28),1);ctx.fillRect(x0+6,fy-54,x1-x0-12,46);
    ctx.fillStyle="rgba(255,248,236,0.5)";ctx.fillRect(x0,fy-62,x1-x0,1.5);}
  g=ctx.createLinearGradient(r.x,0,r.x+r.w,0);g.addColorStop(0,rgba(LP_SEC.shade,0.2));g.addColorStop(0.3,rgba(LP_SEC.shade,0));g.addColorStop(0.75,rgba(LP_SEC.shade,0));g.addColorStop(1,rgba(LP_SEC.shade,0.14));ctx.fillStyle=g;ctx.fillRect(r.x,r.y,r.w,r.h);
  g=ctx.createLinearGradient(0,r.y,0,r.y+36);g.addColorStop(0,rgba(LP_SEC.shade,0.28));g.addColorStop(1,rgba(LP_SEC.shade,0));ctx.fillStyle=g;ctx.fillRect(r.x,r.y,r.w,36);
  if(st.dim>0){ctx.fillStyle=rgba(LP_SEC.shade,0.45*st.dim);ctx.fillRect(r.x,r.y,r.w,r.h);}
  ctx.restore();
  if(st.edge){ctx.save();ctx.strokeStyle=rgba(st.edge,st.edgeA==null?1:st.edgeA);ctx.lineWidth=6;ctx.strokeRect(r.x+3,r.y+3,r.w-6,r.h-6);ctx.restore();}}

/* ===== Owning the outcome: the opening, Kenya's central highlands, the 1970s to 2004 =====
   The film's own places and pictures for its opening story (prefix oo_), in the module's matte, sunlit language, lit from the right as
   its rooms are, so the light carries across into the university. Nothing here is a likeness of a real place or person, and nothing is
   borrowed from a culture's own patterns or crafts: rolling hills of red soil, small farms, tea, a timber plantation, a dry stream bed;
   a tree nursery of seedlings in plastic sleeves under a shade of poles; people in plain clothes of the 1970s.
     ooHills, ooGreen      the hills of the 1970s, their forests cleared: fields to the ridges, tea, a plantation's straight rows, a few
                           old trees, stumps and gullies on the near slope, the stream bed dry; and the same hills years later, with trees
                           along the fields and on the slope, grass over the gullies, water in the stream (one room: AG_ROOMS)
     ooNursery             a group's tree nursery: a shade of poles and dry grass over packed earth, the hills behind
     oo_beds(ctx, t, o)    the nursery's two beds of seedlings in their sleeves, growing (o.g, 0 to 1)
     oo_seedling(ctx, x, y, s, o)   one seedling: o.g how far it has grown (0 to 1), o.dry how far it has died (0 to 1), o.sleeve in a
                           plastic sleeve, else in the ground with a ring of soil
     oo_tree(c, x, base, s, o)      a broad-leaved tree, its trunk tapering, its crown in clumps lit from the right
     oo_run(ctx, t, a)     rain water running down the near slope's gullies, carrying the red soil into the stream bed
     OO_ROW                where the women plant a row of seedlings on the near slope (and where, years later, trees stand)
     OO_PEOPLE             Wangari Maathai, a biologist, and three women of the hills, dressed for their time, never likenesses
   Colour keeps the module's meaning: amber the harm (the streams, the food, the firewood, the soil), green what got better (the trees
   counted alive, what they give), blue the plan (the movement); the hills, the trees and the people wear none of the five: the leaves
   are olive, never the green that marks a value. */

const OO_K={sky0:[164,190,212],sky1:[238,228,206],mount:[152,164,178],mountSh:[124,134,152],snow:[240,240,238],
  far0:[166,174,166],far1:[146,154,136],far2:[132,138,112],
  soil:[164,96,62],soilDk:[116,64,44],soilHi:[200,138,96],dust:[198,164,116],grass:[160,146,92],grassDk:[118,108,66],
  stub:[202,170,112],tan:[212,186,142],plough:[150,90,62],maize:[146,146,86],tea:[122,144,72],teaDk:[90,110,56],pine:[62,78,60],pineHi:[96,112,82],
  leaf:[88,108,62],leafDk:[56,72,46],leafHi:[146,160,98],turf:[124,132,76],turfDk:[92,102,58],bark:[104,84,68],barkDk:[66,52,44],
  stone:[198,190,176],stoneDk:[150,142,130],sand:[208,192,158],water:[118,148,158],waterHi:[200,216,216],
  sleeve:[44,42,46],sleeveHi:[110,108,114],thatch:[186,162,114],thatchDk:[136,114,78],pole:[122,98,74],poleDk:[84,66,50],earth:[176,138,104],earthDk:[138,102,76]};

/* ---------------------------------------------------------------- small things */
const oo_wob=(u,s)=>Math.sin(u*1.7+s*3.1)*0.6+Math.sin(u*3.9+s*1.3)*0.4;
// a soft blob of light or shade: a radial gradient, cheap to draw
function oo_blob(c,x,y,rx,ry,col,a){if(a<=0.004||rx<=0)return;c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);
  g.addColorStop(0,rgba(col,a));g.addColorStop(0.6,rgba(col,a*0.45));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(-rx,-rx,2*rx,2*rx);c.restore();}
// a line through points, smoothed: quadratic curves through the midpoints
function oo_curve(c,P,move){if(move!==false)c.moveTo(P[0][0],P[0][1]);else c.lineTo(P[0][0],P[0][1]);
  for(let i=1;i<P.length-1;i++){const m=[(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2];c.quadraticCurveTo(P[i][0],P[i][1],m[0],m[1]);}
  const L=P[P.length-1];c.lineTo(L[0],L[1]);}
// a ridge line: its height at x, from a few soft waves (the same seed, the same ridge)
const oo_ridge=(x,y0,amp,s)=>y0-amp*(0.5+0.32*Math.sin(x/330+s)+0.18*Math.sin(x/127+s*2.3));

/* ---------------------------------------------------------------- the hills: sky, the far mountain, far ridges */
function oo_sky(c,hz){let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(OO_K.sky0,1));g.addColorStop(0.7,rgba(mix(OO_K.sky0,OO_K.sky1,0.7),1));g.addColorStop(1,rgba(OO_K.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+60);
  // the sun's warmth from high on the right, and a few soft clouds over the far hills
  oo_blob(c,1780,30,1000,760,[255,236,196],0.45);
  for(const [x,y,r] of [[340,190,190],[520,168,130],[660,200,150],[1080,130,130],[1200,108,100],[1700,230,160]]){oo_blob(c,x,y,r,r*0.38,[255,252,246],0.45);oo_blob(c,x-r*0.2,y+r*0.15,r*0.8,r*0.2,[200,204,214],0.16);}}
// far away to the north-east, low in the haze: a broad mountain, its summit a cluster of rock peaks with a little snow
function oo_mountain(c){const pk=[[980,472],[1120,446],[1240,414],[1320,384],[1372,360],[1404,344],[1426,326],[1438,330],[1450,306],[1462,318],[1472,296],[1484,312],[1494,302],[1506,322],[1522,330],[1546,344],[1590,360],[1660,384],[1760,414],[1880,446],[1990,470]];
  const shape=cc=>{cc.moveTo(960,490);for(const p of pk)cc.lineTo(p[0],p[1]);cc.lineTo(1990,490);cc.closePath();};
  c.save();c.globalAlpha=0.55;ag_shape(c,shape);c.fillStyle=rgba(OO_K.mount,1);c.fill();
  c.save();ag_shape(c,shape);c.clip();c.fillStyle=rgba(OO_K.mountSh,0.5);c.beginPath();c.moveTo(960,490);for(const p of pk.slice(0,11))c.lineTo(p[0],p[1]);c.lineTo(1468,310);c.lineTo(1440,390);c.lineTo(1380,470);c.lineTo(1320,490);c.closePath();c.fill();
  // a few ridges down its sunlit side
  c.strokeStyle="rgba(255,250,240,0.35)";c.lineWidth=2;for(const [x0,y0,x1,y1] of [[1486,312,1560,420],[1506,324,1650,440],[1474,300,1506,410]]){c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+x1)/2+10,(y0+y1)/2-6,x1,y1);c.stroke();}c.restore();
  c.globalAlpha=0.8;c.fillStyle=rgba(OO_K.snow,1);for(const P of [[[1438,330],[1450,306],[1458,320],[1450,330]],[[1466,304],[1472,296],[1482,312],[1474,318]],[[1490,306],[1494,302],[1504,320],[1496,324]]]){c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();}
  c.restore();}
function oo_far(c){for(const [col,y0,amp,s] of [[OO_K.far0,470,34,1.2],[OO_K.far1,492,28,4.1],[OO_K.far2,512,22,2.6]]){c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,H);
    for(let x=0;x<=W;x+=24)c.lineTo(x,oo_ridge(x,y0,amp,s));c.lineTo(W,H);c.closePath();c.fill();
    const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(52,44,52,0.07)");g.addColorStop(1,"rgba(255,236,200,0.08)");c.fillStyle=g;c.fillRect(0,y0-amp,W,amp*2+40);}}

/* ---------------------------------------------------------------- the middle hills, cut into small farms */
// back to front: the hill on the right, then the one on the left; each crest a curve, the hill's plots in bands that follow it down
// the slope, wider as they come nearer; haze (0 to 1) how far the air pales it
const OO_HILLS=[{x0:640,x1:2000,crest:x=>540+Math.pow((x-1560)/620,2)*70+12*Math.sin(x/170),base:700,seed:57,haze:0.22,bands:5,tea:null,pine:[0.56,0.74]},
                {x0:-60,x1:1320,crest:x=>522+Math.pow((x-430)/640,2)*88+10*Math.sin(x/150+1),base:760,seed:31,haze:0.08,bands:5,tea:[0.6,0.86],pine:null}];
// a band's edge, k of n bands down the slope at x (with a little wander of its own)
const oo_band=(h,x,k)=>k<=0?h.crest(x):lerp(h.crest(x),h.base,Math.pow(k/h.bands,1.45))+(k<h.bands?6*oo_wob(x/140,k+h.seed):0);
// the hill's plots, worked out once: [{xs, k, kind, u}], each between band k and k+1, from xs[0] to xs[1]
function oo_plots(h){if(h.plots)return h.plots;const R=ag_rnd(h.seed),out=[];
  for(let k=0;k<h.bands;k++){let x=h.x0-20*R();while(x<h.x1){const w=lerp(110,280,R())*lerp(0.8,1.25,k/h.bands),xa=x,xb=Math.min(h.x1+40,x+w),uu=((xa+xb)/2-h.x0)/(h.x1-h.x0);
      let kind=["stub","tan","plough","maize","pasture","stub","maize","tan","pasture"][(R()*9)|0];
      if(h.tea&&uu>h.tea[0]&&uu<h.tea[1]&&k>=1&&k<4)kind="tea";if(h.pine&&uu>h.pine[0]&&uu<h.pine[1]&&k<2)kind="pine";
      out.push({xs:[xa,xb],k,kind,u:uu,lean:(R()-0.5)*30});x=xb;}}
  return h.plots=out;}
// a plot's outline: along its top band edge, down its far side, back along its lower edge
function oo_plotPath(c,h,p){const [xa,xb]=p.xs,k=p.k,n=6;c.beginPath();for(let i=0;i<=n;i++){const x=lerp(xa,xb,i/n);i?c.lineTo(x,oo_band(h,x,k)):c.moveTo(x,oo_band(h,x,k));}
  for(let i=n;i>=0;i--){const x=lerp(xa,xb,i/n)+p.lean*(i===0||i===n?1:0)*0;c.lineTo(x+(i===n?p.lean:i===0?p.lean:p.lean),oo_band(h,x+p.lean,k+1));}c.closePath();}
const OO_FIELD={stub:[206,178,122],tan:[214,194,152],plough:[164,106,74],maize:[152,150,94],pasture:[178,164,108],tea:[126,146,82],pine:[74,90,68]};
function oo_paintHill(c,h,green){const R=ag_rnd(h.seed+7),plots=oo_plots(h),haze=mix(OO_K.sky1,OO_K.far0,0.3);
  const body=cc=>{cc.moveTo(h.x0,H);for(let x=h.x0;x<=h.x1;x+=20)cc.lineTo(x,h.crest(x));cc.lineTo(h.x1,h.crest(h.x1));cc.lineTo(h.x1,H);cc.closePath();};
  ag_shape(c,body);c.fillStyle=rgba(mix(OO_FIELD.pasture,haze,h.haze),1);c.fill();c.save();ag_shape(c,body);c.clip();
  for(const p of plots){const col=mix(green&&p.kind==="pasture"?mix(OO_FIELD.pasture,OO_K.turf,0.5):OO_FIELD[p.kind],haze,h.haze);c.fillStyle=rgba(col,1);oo_plotPath(c,h,p);c.fill();
    c.save();oo_plotPath(c,h,p);c.clip();const [xa,xb]=p.xs;
    // rows along the slope: tea's close hedges, maize's lines, a ploughed field's furrows; a plantation's trees in their straight rows
    if(p.kind==="tea"||p.kind==="maize"||p.kind==="plough"){const n=p.kind==="tea"?7:p.kind==="maize"?5:4,col2=p.kind==="tea"?mix([96,116,62],haze,h.haze):rgba(ag_dk(col,0.3),1);
      for(let r=1;r<n;r++){const f=p.k+r/n;c.strokeStyle=p.kind==="tea"?rgba(col2,0.8):rgba(ag_dk(col,0.3),0.3);c.lineWidth=p.kind==="tea"?2.6:1.4;c.beginPath();
        for(let i=0;i<=8;i++){const x=lerp(xa-10,xb+40,i/8),y=lerp(oo_band(h,x,Math.floor(f)),oo_band(h,x,Math.floor(f)+1),f-Math.floor(f));i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}}
    else if(p.kind==="pine"){for(let r=0;r<6;r++)for(let q=0;q<14;q++){const x=lerp(xa,xb,(q+0.5)/14),y=lerp(oo_band(h,x,p.k),oo_band(h,x,p.k+1),(r+0.8)/6);
        c.fillStyle=rgba(mix(ag_lt(OO_FIELD.pine,0.2),haze,h.haze),1);c.beginPath();c.moveTo(x,y-9);c.lineTo(x+3.4,y);c.lineTo(x-3.4,y);c.closePath();c.fill();}}
    c.restore();
    // the plot's lower edge: a soft line of shade, a hedge in the later years
    c.strokeStyle="rgba(70,52,40,0.2)";c.lineWidth=1.4;c.beginPath();for(let i=0;i<=6;i++){const x=lerp(xa,xb,i/6)+p.lean;i?c.lineTo(x,oo_band(h,x,p.k+1)):c.moveTo(x,oo_band(h,x,p.k+1));}c.stroke();}
  // the light: the slope towards the sun warmer, the far side in shade, the crest lit
  let g=c.createLinearGradient(h.x0,0,h.x1,0);g.addColorStop(0,"rgba(52,44,52,0.18)");g.addColorStop(0.5,"rgba(52,44,52,0.02)");g.addColorStop(1,"rgba(255,232,190,0.12)");c.fillStyle=g;c.fillRect(h.x0,0,h.x1-h.x0,H);
  g=c.createLinearGradient(0,h.crest((h.x0+h.x1)/2)-30,0,h.base);g.addColorStop(0,"rgba(255,246,226,0.16)");g.addColorStop(0.4,"rgba(255,246,226,0)");g.addColorStop(1,"rgba(52,44,52,0.1)");c.fillStyle=g;c.fillRect(h.x0,0,h.x1-h.x0,H);
  // trees: a few old ones left standing in the 1970s; years later, lines of them along the fields' edges, and small woods
  if(green){for(const p of plots){if(p.kind==="pine"||p.kind==="tea")continue;const [xa,xb]=p.xs,n=Math.round((xb-xa)/34);if(R()<0.4)continue;
      for(let i=0;i<n;i++){if(R()<0.45)continue;const x=lerp(xa,xb,(i+R())/n)+p.lean,y=oo_band(h,x,p.k+1)+1,s=lerp(0.07,0.14,(y-500)/300)*(0.8+R()*0.4);oo_tree(c,x,y,s,{seed:(x*7+y)|0,far:1,haze:h.haze});}
      if(R()<0.07){const cx=(xa+xb)/2,cy=lerp(oo_band(h,cx,p.k),oo_band(h,cx,p.k+1),0.7);for(let i=0;i<14;i++)oo_tree(c,cx+(R()-0.5)*(xb-xa)*0.7,cy+(R()-0.5)*20,lerp(0.08,0.14,(cy-500)/300),{seed:i*31+p.k,far:1,haze:h.haze});}}}
  else for(let i=0;i<9;i++){const p=plots[(R()*plots.length)|0];if(p.kind==="pine")continue;const x=lerp(p.xs[0],p.xs[1],R()),y=oo_band(h,x,p.k+1)+1;oo_tree(c,x,y,lerp(0.08,0.15,(y-500)/300),{seed:i*17+h.seed,far:1,haze:h.haze});}
  c.restore();}

/* ---------------------------------------------------------------- the near slope */
// its top edge; the gullies the rain has cut (each a smooth curve, narrow at the top); the stumps of the trees that were cut; and the
// stream bed in the valley beyond, seen between the hills
const OO_NEAR={top:x=>748+16*Math.sin(x/260+0.8)+9*Math.sin(x/97+2)-(x-960)*0.012,
  gullies:[[[560,772],[500,830],[470,930],[300,1090],5,70],[[1150,756],[1190,840],[1120,950],[1180,1090],4,56],[[1640,748],[1700,820],[1690,930],[1820,1090],4,64]],
  stumps:[[250,858,30],[790,812,22],[1340,826,26],[1800,884,34]],
  stream:[[1300,636],[1318,650],[1306,668],[1334,686],[1378,700],[1394,716],[1450,734]]};
// where the women plant their row of seedlings, along the slope, and which ones are still alive months later
const OO_ROW={pts:[[560,826],[700,820],[840,814],[980,810],[1120,810],[1260,814],[1400,820],[1540,828]],alive:[1,1,0,1,1,0,1,0]};
function oo_stream(c,green){const S=OO_NEAR.stream;c.save();c.lineCap="round";c.lineJoin="round";
  const path=()=>{c.beginPath();oo_curve(c,S);};
  path();c.strokeStyle=rgba(green?[96,108,66]:[150,126,92],0.9);c.lineWidth=20;c.stroke();
  path();c.strokeStyle=rgba(green?OO_K.water:[198,180,146],1);c.lineWidth=11;c.stroke();
  if(green){path();c.strokeStyle=rgba(OO_K.waterHi,0.6);c.lineWidth=3;c.stroke();
    // trees along its banks
    for(let i=0;i<S.length;i++){const [x,y]=S[i];for(const d of [-18,18])oo_tree(c,x+d+((i*13)%7),y+4,0.09+i*0.008,{seed:i*11+d,far:1});}}
  else{const R=ag_rnd(4);for(let k=0;k<40;k++){const i=1+((R()*(S.length-1))|0),f=R(),x=lerp(S[i-1][0],S[i][0],f)+(R()-0.5)*6,y=lerp(S[i-1][1],S[i][1],f)+(R()-0.5)*5;
      c.fillStyle=rgba(R()<0.5?OO_K.stone:OO_K.stoneDk,0.9);c.beginPath();c.ellipse(x,y,2+R()*2.5,1.4+R()*1.6,0,0,TAU);c.fill();}}
  c.restore();}
// a gully: a channel that wanders down the slope, narrow where it starts and wider and deeper below, with small rills joining it. The
// sun is on the right, so the channel's left wall, which faces it, is lit, and its right wall is in shade. Grassed over, years later
function oo_gully(c,G,green,seed){const [p0,p1,p2,p3,w0,w1]=G,R=ag_rnd(60+seed),n=40,Lft=[],Rgt=[],mid=[],bz=[p0[0],p0[1],p1[0],p1[1],p2[0],p2[1],p3[0],p3[1]];
  for(let i=0;i<=n;i++){const u=i/n,[x,y]=ag_bz(bz,u),[x2,y2]=ag_bz(bz,Math.min(1,u+0.01)),[x1,y1]=ag_bz(bz,Math.max(0,u-0.01)),d=Math.hypot(x2-x1,y2-y1)||1,nx=-(y2-y1)/d,ny=(x2-x1)/d,
    w=lerp(w0,w1,Math.pow(u,0.8))*(1+0.28*Math.sin(u*17+seed)+0.12*Math.sin(u*41+seed*2)),mx=x+Math.sin(u*9+seed)*w*0.25;mid.push([mx,y,nx,ny,w]);
    Lft.push([mx-nx*w/2,y-ny*w/2]);Rgt.push([mx+nx*w/2,y+ny*w/2]);}
  const poly=(A,B)=>{c.beginPath();A.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));for(let i=B.length-1;i>=0;i--)c.lineTo(B[i][0],B[i][1]);c.closePath();};
  if(green){poly(Lft,Rgt);c.fillStyle=rgba(ag_dk(OO_K.turf,0.14),0.16);c.fill();return;}
  // the rills that feed it: faint lines in the soil, joining from either side
  for(let k=0;k<4;k++){const i=8+((R()*(n-14))|0),[mx,y,nx,ny,w]=mid[i],sd=k%2?-1:1,l=40+R()*70;
    ag_taper(c,[mx+sd*(w/2+l),y-l*0.5],[mx+sd*(w/2+l*0.6),y-l*0.3],[mx+sd*w*0.7,y-l*0.1],[mx+sd*w*0.35,y],1.5,Math.max(2.5,w*0.12),rgba(ag_dk(OO_K.soil,0.2),0.45));}
  // the channel's rim, the lit left wall, the floor in shade
  poly(Lft.map(q=>[q[0]-3,q[1]]),Rgt.map(q=>[q[0]+3,q[1]]));c.fillStyle=rgba(ag_dk(OO_K.soil,0.12),0.6);c.fill();
  poly(Lft,Rgt);c.fillStyle=rgba(mix(OO_K.soilHi,OO_K.soil,0.3),0.95);c.fill();
  poly(mid.map(([mx,y,nx,ny,w])=>[mx-nx*w*0.1,y-ny*w*0.1]),Rgt);c.fillStyle=rgba(OO_K.soilDk,0.85);c.fill();
  poly(mid.map(([mx,y,nx,ny,w])=>[mx+nx*w*0.18,y+ny*w*0.18]),Rgt);c.fillStyle=rgba(ag_dk(OO_K.soilDk,0.3),0.6);c.fill();
  // stones washed into its floor
  for(let k=0;k<14;k++){const [mx,y,nx,ny,w]=mid[4+((R()*(n-4))|0)];c.fillStyle=rgba(R()<0.5?OO_K.stone:OO_K.stoneDk,0.85);c.beginPath();c.ellipse(mx+nx*w*0.1+(R()-0.5)*w*0.2,y,1.5+w*0.06*R(),1+w*0.04*R(),0,0,TAU);c.fill();}}
function oo_paintNear(c,green){const R=ag_rnd(91),T=OO_NEAR.top;
  const top=[];for(let x=-20;x<=W+20;x+=20)top.push([x,T(x)]);
  const body=cc=>{cc.moveTo(-20,H);for(const p of top)cc.lineTo(p[0],p[1]);cc.lineTo(W+20,H);cc.closePath();};
  const soil=green?mix(OO_K.turf,[150,150,92],0.4):OO_K.soil,soilDk=green?mix(OO_K.turfDk,OO_K.soilDk,0.2):OO_K.soilDk;
  let g=c.createLinearGradient(0,730,0,H);g.addColorStop(0,rgba(mix(soil,OO_K.dust,0.3),1));g.addColorStop(0.4,rgba(soil,1));g.addColorStop(1,rgba(soilDk,1));
  ag_shape(c,body);c.fillStyle=g;c.fill();
  c.save();ag_shape(c,body);c.clip();
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(52,44,52,0.2)");g.addColorStop(0.5,"rgba(52,44,52,0.03)");g.addColorStop(1,"rgba(255,226,180,0.12)");c.fillStyle=g;c.fillRect(0,600,W,H);
  // the slope's lie: soft bands across it; grit and small stones
  for(let k=0;k<8;k++){const y0=790+k*38+R()*10;c.strokeStyle=rgba(k%2?OO_K.soilHi:OO_K.soilDk,green?0.06:0.12);c.lineWidth=4+R()*6;c.beginPath();c.moveTo(-20,y0);for(let x=0;x<=W;x+=80)c.lineTo(x,y0+oo_wob(x/240,k)*7-(x-960)*0.012);c.stroke();}
  if(!green)for(let k=0;k<700;k++){const x=R()*W,y=T(x)+8+R()*(H-T(x));c.fillStyle=rgba(R()<0.5?OO_K.soilHi:ag_dk(OO_K.soilDk,0.2),0.3+R()*0.3);c.beginPath();c.ellipse(x,y,1+R()*2.4,0.8+R()*1.4,R()*3,0,TAU);c.fill();}
  // the gullies: a channel in shade, its sunlit wall on the right, narrow where it starts and deeper as it runs down; years later,
  // grassed over, only a soft dip
  for(const [gi,G] of OO_NEAR.gullies.entries())oo_gully(c,G,green,gi);
  // tufts: a little dry grass in patches on the bare soil; thick turf years later
  const tufts=green?900:520;for(let k=0;k<tufts;k++){let x=R()*W,y=T(x)+6+R()*(H-T(x));if(!green){const cx=[160,640,980,1460,1760][k%5],cy=[800,860,960,840,980][k%5];x=cx+(R()-0.5)*R()*700;y=Math.max(T(x)+6,cy+(R()-0.5)*R()*260);}
    const s=lerp(0.6,1.7,(y-730)/350),col=green?(R()<0.5?OO_K.turfDk:OO_K.leafHi):(R()<0.6?OO_K.grass:OO_K.dust);
    c.strokeStyle=rgba(col,green?0.45:0.8);c.lineWidth=1.5*s;for(let b=0;b<3;b++){const an=-Math.PI/2+(b-1)*0.42+(R()-0.5)*0.3,l=(6+R()*8)*s;c.beginPath();c.moveTo(x+b*2*s,y);c.quadraticCurveTo(x+b*2*s+Math.cos(an)*l*0.4,y+Math.sin(an)*l*0.6,x+b*2*s+Math.cos(an)*l,y+Math.sin(an)*l);c.stroke();}}
  // the stumps of the trees that were cut, the cut face pale with rings
  if(!green)for(const [x,y,r] of OO_NEAR.stumps){ag_floorShadow(c,x-r*0.9,y+4,r*1.6,r*0.34,0.45);
    ag_soft(c,cc=>{cc.moveTo(x-r,y);cc.bezierCurveTo(x-r*0.96,y-r*0.4,x-r*0.94,y-r*0.7,x-r*0.9,y-r*0.9);cc.lineTo(x+r*0.9,y-r*0.9);cc.bezierCurveTo(x+r*0.94,y-r*0.7,x+r*0.98,y-r*0.4,x+r*1.06,y);cc.quadraticCurveTo(x,y+r*0.26,x-r,y);cc.closePath();},
      OO_K.bark,ag_lt(OO_K.bark,0.25),x+r*0.6,y-r*0.6,r*1.4,"rgba(30,20,16,0.5)",8);
    c.fillStyle=rgba(OO_K.stub,1);c.beginPath();c.ellipse(x,y-r*0.9,r*0.92,r*0.3,0,0,TAU);c.fill();c.strokeStyle=rgba(ag_dk(OO_K.stub,0.3),0.55);c.lineWidth=1.2;
    for(const f of [0.3,0.55,0.8]){c.beginPath();c.ellipse(x+r*0.04,y-r*0.9,r*0.92*f,r*0.3*f,0,0,TAU);c.stroke();}}
  // its crest against the hills beyond: a lighter rim where the sun catches it
  c.strokeStyle=rgba(green?OO_K.leafHi:OO_K.soilHi,0.45);c.lineWidth=3;c.beginPath();top.forEach((p,i)=>i?c.lineTo(p[0],p[1]+2):c.moveTo(p[0],p[1]+2));c.stroke();
  c.restore();
  // years later: the row the women planted, grown into trees, and others along the slope
  if(green){for(const [x,y,s] of [[150,800,0.66],[1760,812,0.7]])oo_tree(c,x,y,s,{seed:x});OO_ROW.pts.forEach(([x,y],i)=>{if(OO_ROW.alive[i])oo_tree(c,x,y,0.5+((i*37)%5)*0.03,{seed:200+i});});}}
function oo_paintHills(c,green){oo_sky(c,540);oo_mountain(c);oo_far(c);
  oo_paintHill(c,OO_HILLS[0],green);oo_stream(c,green);oo_paintHill(c,OO_HILLS[1],green);oo_paintNear(c,green);
  const g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.2));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.ooHills=c=>oo_paintHills(c,false);
AG_PLACES.ooGreen=c=>oo_paintHills(c,true);
AG_ROOMS.ooGreen="ooHills";

/* ---------------------------------------------------------------- a tree */
// a broad-leaved tree of the highlands, its crown spreading wider than it is tall: a trunk that forks into limbs, tapering, and clumps of
// leaves at the limbs' ends, dark below and on the left, lit from the right; its shadow on the ground to the left. h = 300 s px tall.
// o.seed; o.far: a small tree far away (a few clumps, no shadow); o.haze: how far the air pales it
function oo_tree(c,x,base,s,o){o=o||{};const R=ag_rnd(o.seed||1),h=300*s,far=!!o.far,hz=o.haze||0,sky=mix(OO_K.sky1,OO_K.far0,0.3),
    L=col=>rgba(mix(col,sky,hz),1);
  if(far){// a far tree: a short trunk and a few soft clumps
    if(h>44){c.fillStyle=L(OO_K.barkDk);c.fillRect(x-h*0.02,base-h*0.36,Math.max(1.4,h*0.04),h*0.36);}
    const cy=base-h*(h>44?0.6:0.36),rw=h*0.36,n=3+((R()*2)|0),cl=[];for(let i=0;i<n;i++)cl.push([x+(i/(n-1)-0.5)*rw*1.1+(R()-0.5)*rw*0.3,cy+(R()-0.5)*h*0.12,h*(0.22+R()*0.08)]);
    for(const [px,py,r] of cl){c.fillStyle=L(OO_K.leafDk);c.beginPath();c.ellipse(px,py+r*0.1,r,r*0.82,0,0,TAU);c.fill();}
    for(const [px,py,r] of cl){c.fillStyle=L(OO_K.leaf);c.beginPath();c.ellipse(px+r*0.18,py-r*0.1,r*0.72,r*0.56,0,0,TAU);c.fill();}
    for(const [px,py,r] of cl){c.fillStyle=L(OO_K.leafHi);c.beginPath();c.ellipse(px+r*0.36,py-r*0.26,r*0.34,r*0.26,0,0,TAU);c.fill();}
    return;}
  ag_floorShadow(c,x-h*0.4,base+3,h*0.5,h*0.07,0.42);
  // the crown's masses: one high in the middle, two lower at the sides, one behind; each a cluster of rounded clumps
  const lean=(R()-0.5)*0.1,fx=x+lean*h*0.3,fy=base-h*0.38,tw=h*0.085,
    M=[[-0.2,0.56,0.17],[0.03,0.74,0.2],[0.22,0.6,0.16],[-0.04,0.6,0.15]].map(([dx,dy,r])=>[fx+(dx+(R()-0.5)*0.04)*h,base-(dy+(R()-0.5)*0.03)*h,r*h*(0.9+R()*0.2)]);
  // the trunk, flaring a little at the root, forking at under half its height; a limb up into each mass, so they show between them
  ag_taper(c,[x,base],[x+lean*h*0.1,base-h*0.14],[fx-lean*h*0.1,fy+h*0.1],[fx,fy],tw,tw*0.66,rgba(OO_K.bark,1));
  c.fillStyle=rgba(OO_K.bark,1);c.beginPath();c.moveTo(x-tw*0.9,base+1);c.quadraticCurveTo(x-tw*0.4,base-tw*0.3,x-tw*0.36,base-tw*1.4);c.lineTo(x+tw*0.36,base-tw*1.4);c.quadraticCurveTo(x+tw*0.45,base-tw*0.3,x+tw*0.95,base+1);c.closePath();c.fill();
  for(const [mx,my,r] of M.slice(0,3)){const ex=mx,ey=my+r*0.3;ag_taper(c,[fx,fy],[lerp(fx,ex,0.2),lerp(fy,ey,0.45)],[lerp(fx,ex,0.7),lerp(fy,ey,0.8)],[ex,ey],tw*0.6,tw*0.22,rgba(OO_K.bark,1));}
  c.fillStyle=rgba(OO_K.barkDk,0.55);c.beginPath();c.moveTo(x-tw*0.5,base);c.bezierCurveTo(x-tw*0.46,base-h*0.14,fx-tw*0.42,fy+h*0.1,fx-tw*0.32,fy);c.lineTo(fx-tw*0.06,fy);c.bezierCurveTo(fx-tw*0.1,fy+h*0.1,x-tw*0.12,base-h*0.14,x-tw*0.1,base);c.closePath();c.fill();
  // each mass: its clumps' dark undersides, then their bodies, lighter towards the sun, then the light on their tops
  const order=[3,0,2,1];for(const mi of order){const [mx,my,r]=M[mi],cl=[];for(let i=0;i<8;i++){const an=i/8*TAU+R()*0.5,d=r*(0.45+R()*0.25);cl.push([mx+Math.cos(an)*d*1.15,my+Math.sin(an)*d*0.75,r*(0.42+R()*0.16)]);}
    cl.push([mx,my,r*0.62]);const back=mi===3?0.18:0;
    c.fillStyle=rgba(mix(OO_K.leafDk,[40,52,36],back),1);c.beginPath();for(const [px,py,rr] of cl){c.moveTo(px+rr*1.06,py+rr*0.12);c.ellipse(px,py+rr*0.12,rr*1.06,rr*0.9,0,0,TAU);}c.fill();
    for(const [px,py,rr] of cl){const lit=clamp(0.45+(px-mx)/r*0.4-(py-my)/r*0.45-back*2,0,1);c.fillStyle=rgba(mix(OO_K.leafDk,OO_K.leaf,0.3+lit*0.7),1);c.beginPath();c.ellipse(px+rr*0.08,py-rr*0.06,rr*0.88,rr*0.68,0,0,TAU);c.fill();}
    for(const [px,py,rr] of cl){const lit=(px-mx)/r*0.7-(py-my)/r*0.8-back*3;if(lit<0.1)continue;c.fillStyle=rgba(OO_K.leafHi,clamp(lit*0.9,0,0.8));c.beginPath();c.ellipse(px+rr*0.26,py-rr*0.28,rr*0.44,rr*0.28,0,0,TAU);c.fill();}}}

/* ---------------------------------------------------------------- a seedling */
// at (x, y), where it meets the soil; s its size (1: about 120 px tall, grown). o.g how far it has grown (0 to 1); o.dry how far it
// has died (0 to 1: the leaves brown, drooping, falling); o.sleeve in a plastic sleeve of soil, as in a nursery; o.a
function oo_seedling(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const g=clamp(o.g==null?1:o.g,0,1),dry=clamp(o.dry||0,0,1),R=ag_rnd(o.seed||7);
  ctx.save();ctx.globalAlpha*=a;
  if(o.sleeve){const sw=22*s,sh=34*s;ctx.fillStyle=rgba(OO_K.sleeve,1);ctx.beginPath();ctx.moveTo(x-sw/2,y);ctx.lineTo(x-sw/2+1*s,y+sh);ctx.quadraticCurveTo(x,y+sh+4*s,x+sw/2-1*s,y+sh);ctx.lineTo(x+sw/2,y);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(OO_K.sleeveHi,0.5);ctx.fillRect(x+sw*0.18,y+3*s,2.4*s,sh-6*s);ctx.fillStyle=rgba(OO_K.soilDk,1);ctx.beginPath();ctx.ellipse(x,y,sw/2,4*s,0,0,TAU);ctx.fill();}
  else{ctx.fillStyle=rgba(ag_dk(OO_K.soil,0.12),1);ctx.beginPath();ctx.ellipse(x,y+2*s,22*s,6*s,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(OO_K.soilHi,0.6);ctx.beginPath();ctx.ellipse(x+4*s,y,14*s,3.4*s,0,0,TAU);ctx.fill();}
  if(g<=0.01){ctx.restore();return;}
  const h=(30+90*g)*s,lean=(R()-0.5)*0.12+dry*0.35,tip=[x+lean*h,y-h*(1-dry*0.3)],stem=mix([96,104,62],[132,104,70],dry),lf=mix(OO_K.leaf,[150,116,76],dry),lh=mix(OO_K.leafHi,[184,150,100],dry);
  ag_taper(ctx,[x,y],[x,y-h*0.4],[x+lean*h*0.5,y-h*0.7],tip,Math.max(1.6,3.4*s*(0.6+g*0.6)),1.2*s,rgba(stem,1));
  // leaves in pairs up the stem, the top ones small; drooping and falling as it dies
  const n=o.lite?1+Math.round(g*2):2+Math.round(g*4);for(let i=0;i<n;i++){const f=0.3+0.7*(i+1)/n,px=lerp(x,tip[0],f),py=lerp(y,tip[1],f),l=(14+16*(1-f*0.5))*s*(0.6+g*0.5);
    for(const sd of [-1,1]){if(dry>0.6&&(i+sd+2)%3===0)continue;const an=-Math.PI/2+sd*(0.9+dry*1.3)+(R()-0.5)*0.3,ex=px+Math.cos(an)*l,ey=py+Math.sin(an)*l,nx=-Math.sin(an),ny=Math.cos(an),w=l*0.32;
      ctx.fillStyle=rgba(sd>0?lh:lf,1);ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo((px+ex)/2+nx*w,(py+ey)/2+ny*w,ex,ey);ctx.quadraticCurveTo((px+ex)/2-nx*w*0.6,(py+ey)/2-ny*w*0.6,px,py);ctx.fill();
      ctx.strokeStyle=rgba(ag_dk(lf,0.3),0.5);ctx.lineWidth=0.9*s;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo((px+ex*1.6)/2.6,(py+ey*1.6)/2.6);ctx.stroke();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the near slope in the rain */
// water running down the gullies, red with the soil it carries, and spreading into the stream bed; a: how much (0 to 1)
function oo_run(ctx,t,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  for(const G of OO_NEAR.gullies){for(let i=1;i<G.length;i++){const w=lerp(3,22,i/G.length);ctx.strokeStyle=rgba([150,90,62],0.7);ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(G[i-1][0],G[i-1][1]);ctx.lineTo(G[i][0],G[i][1]);ctx.stroke();}
    // the flow: light streaks moving down, the water's surface
    ctx.strokeStyle=rgba([222,176,140],0.55);ctx.setLineDash([18,26]);ctx.lineDashOffset=-t*90;ctx.lineWidth=3;ctx.beginPath();oo_curve(ctx,G);ctx.stroke();ctx.setLineDash([]);}
  const S=OO_NEAR.stream;ctx.strokeStyle=rgba([152,96,66],0.55*a);for(let i=1;i<S.length;i++){ctx.lineWidth=lerp(6,30,i/S.length);ctx.beginPath();ctx.moveTo(S[i-1][0],S[i-1][1]);ctx.lineTo(S[i][0],S[i][1]);ctx.stroke();}
  // the rain itself: fine slanted lines, falling from the right, few and soft
  const Rr=ag_rnd(5);ctx.strokeStyle="rgba(230,232,236,0.32)";ctx.lineWidth=1.6;for(let k=0;k<90;k++){const x0=Rr()*2200,y0=((Rr()*H+t*900)%(H+200))-100;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0-14,y0+36);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the nursery */
function oo_paintNursery(c){const R=ag_rnd(77);oo_sky(c,560);oo_far(c);
  // the hill behind, with its farms (the left hill again, set lower)
  c.save();c.translate(240,60);oo_paintHill(c,OO_HILLS[1],false);c.restore();
  // the nursery's ground: packed earth, swept
  let g=c.createLinearGradient(0,700,0,H);g.addColorStop(0,rgba(OO_K.earth,1));g.addColorStop(1,rgba(OO_K.earthDk,1));c.fillStyle=g;c.fillRect(0,700,W,H-700);
  c.fillStyle="rgba(60,44,34,0.18)";c.fillRect(0,700,W,6);
  for(let k=0;k<600;k++){const x=R()*W,y=706+R()*(H-706);c.fillStyle=rgba(R()<0.5?ag_lt(OO_K.earth,0.2):OO_K.earthDk,0.4);c.beginPath();c.ellipse(x,y,1+R()*2.4,0.8+R()*1.2,0,0,TAU);c.fill();}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(52,44,52,0.16)");g.addColorStop(1,"rgba(255,230,190,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the shade over the beds: four poles of rough timber, a beam, and a roof of dry grass laid in bundles; under it, the ground cooler
  g=c.createLinearGradient(0,700,0,900);g.addColorStop(0,"rgba(60,44,34,0.16)");g.addColorStop(1,"rgba(60,44,34,0)");c.fillStyle=g;c.fillRect(80,700,1780,200);
  for(let k=0;k<26;k++)oo_blob(c,120+R()*1700,760+R()*110,30+R()*50,8+R()*8,[255,236,200],0.1);
  for(const x of [150,720,1240,1790]){const w=13+R()*4;ag_soft(c,cc=>{cc.moveTo(x-w,792);cc.bezierCurveTo(x-w+3,600,x-w-2,420,x-w+4,236);cc.lineTo(x+w-3,236);cc.bezierCurveTo(x+w+2,420,x+w-2,600,x+w+1,792);cc.closePath();},OO_K.pole,ag_lt(OO_K.pole,0.32),x+w,400,240,"rgba(40,28,20,0.45)",8);
    ag_floorShadow(c,x-30,794,34,8,0.42);}
  ag_soft(c,cc=>{cc.moveTo(96,226);cc.lineTo(1846,222);cc.lineTo(1846,246);cc.lineTo(96,250);cc.closePath();},OO_K.poleDk,ag_lt(OO_K.pole,0.2),1500,226,600,null);
  // the roof: dry grass laid over thin poles in rows of bundles, its ends hanging a little over the beam; lit along the top, darker below
  const roof=cc=>{cc.moveTo(30,252);for(let x=30;x<=1910;x+=30)cc.lineTo(x,256+oo_wob(x/60,5)*7);cc.lineTo(1910,176);for(let x=1910;x>=30;x-=50)cc.lineTo(x,168+oo_wob(x/160,3)*8);cc.closePath();};
  ag_soft(c,roof,OO_K.thatchDk,OO_K.thatch,1500,176,1000,"rgba(60,40,24,0.35)",12);
  c.save();ag_shape(c,roof);c.clip();
  for(let row=0;row<4;row++){const y0=164+row*22;for(let k=0;k<420;k++){const x=20+R()*1890,y=y0+R()*14,l=22+R()*26,an=Math.PI/2+0.35+(R()-0.5)*0.3;
      c.strokeStyle=rgba(R()<0.45?ag_lt(OO_K.thatch,0.12):R()<0.6?OO_K.thatchDk:OO_K.thatch,0.7);c.lineWidth=1.4+R()*1.4;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);c.stroke();}
    c.fillStyle="rgba(60,40,24,0.12)";c.fillRect(0,y0+16,W,4);}
  c.restore();
  // the grass's ends hanging below its edge
  for(let k=0;k<520;k++){const x=30+R()*1880,y=250+oo_wob(x/60,5)*6,l=6+R()*16,an=Math.PI/2+0.3+(R()-0.5)*0.4;c.strokeStyle=rgba(R()<0.5?OO_K.thatchDk:OO_K.thatch,0.8);c.lineWidth=1.3+R();
    c.beginPath();c.moveTo(x,y-4);c.lineTo(x+Math.cos(an)*l,y-4+Math.sin(an)*l);c.stroke();}
  
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.22));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.ooNursery=c=>oo_paintNursery(c);
// the two beds: low walls of earth with rows of seedlings in their sleeves; o.g (0 to 1) how far they've grown, o.a; o.cut: where people
// stand behind them (the beds' back edge, for lp_person's cut)
const OO_BEDS=[{x0:110,x1:900,y:796},{x0:1020,x1:1810,y:796}];
function oo_beds(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  for(const [bi,B] of OO_BEDS.entries()){const R=ag_rnd(300+bi);
    ag_floorShadow(ctx,(B.x0+B.x1)/2-30,B.y+76,(B.x1-B.x0)*0.56,18,0.4);
    // the bed: a shallow trench edged with a low ridge of earth, the sleeves packed in it, row after row
    ag_soft(ctx,cc=>ag_rect(cc,B.x0-10,B.y-6,B.x1-B.x0+20,78,12),OO_K.earthDk,ag_lt(OO_K.earth,0.1),B.x1-80,B.y,420,"rgba(40,28,20,0.35)",12);
    for(let r=0;r<5;r++){const y=B.y+4+r*13,s=0.62+r*0.04,step=19*s,n=Math.floor((B.x1-B.x0-24)/step),full=r>=3;
      for(let i=0;i<n;i++){const x=B.x0+14+i*step+(r%2)*step/2,g=clamp((o.g==null?1:o.g)*(0.82+R()*0.3),0,1);oo_seedling(ctx,x,y,s,{g,sleeve:r===4,seed:bi*97+r*31+i,lite:!full});}}
    // the ridge along the bed's front
    ag_soft(ctx,cc=>{cc.moveTo(B.x0-14,B.y+60);cc.quadraticCurveTo((B.x0+B.x1)/2,B.y+52,B.x1+14,B.y+60);cc.lineTo(B.x1+14,B.y+76);cc.quadraticCurveTo((B.x0+B.x1)/2,B.y+84,B.x0-14,B.y+76);cc.closePath();},OO_K.earth,ag_lt(OO_K.earth,0.2),B.x1-100,B.y+58,300,"rgba(40,28,20,0.3)",8);}
  ctx.restore();}

/* ---------------------------------------------------------------- the people of the hills, for lp_person
   Wangari Maathai, a biologist at the university in Nairobi in the 1970s, in a plain cardigan, her hair short; three women who farm
   the hills, in a cardigan or a sweater against the highlands' cool mornings, the hair under a plain headscarf tied at the nape. The
   scarves and clothes are plain cloth, in colours that mean nothing in these films; no pattern is drawn from any culture's cloth. */
// a headscarf over the hair, from the brow back over the crown, tied at the nape, the knot's short ends hanging behind the neck: inside
// the head's picture (figure x 160 to 440, y 250 to 560)
function oo_scarf(col){return(c,P)=>{const f=cc=>{cc.moveTo(392,354);cc.bezierCurveTo(396,312,370,276,312,268);cc.bezierCurveTo(258,262,206,290,194,348);
    cc.bezierCurveTo(186,392,196,434,216,458);cc.bezierCurveTo(236,440,248,410,268,394);cc.bezierCurveTo(300,374,348,360,392,354);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.3),344,290,140,rgba(ag_dk(col,0.7),0.5),14);
  // the folds, drawn from the knot over the crown, and the hem along the brow
  c.save();ag_shape(c,f);c.clip();c.strokeStyle=rgba(ag_dk(col,0.45),0.4);c.lineWidth=2.6;c.lineCap="round";
  for(const [x1,y1] of [[290,280],[340,294],[372,322],[384,346]]){c.beginPath();c.moveTo(208,446);c.quadraticCurveTo((208+x1)/2-16,(446+y1)/2-36,x1,y1);c.stroke();}
  c.strokeStyle=rgba(ag_lt(col,0.35),0.38);c.lineWidth=2;c.beginPath();c.moveTo(246,292);c.quadraticCurveTo(300,272,352,290);c.stroke();c.restore();
  c.strokeStyle=rgba(ag_dk(col,0.4),0.65);c.lineWidth=3;c.beginPath();c.moveTo(390,356);c.bezierCurveTo(346,362,300,376,268,396);c.stroke();
  // the knot at the nape, and its two short ends behind the neck
  ag_soft(c,cc=>{cc.moveTo(206,456);cc.bezierCurveTo(200,476,192,494,182,508);cc.lineTo(196,512);cc.bezierCurveTo(206,498,216,480,220,460);cc.closePath();},ag_dk(col,0.14),ag_lt(col,0.2),206,476,36,null);
  ag_soft(c,cc=>{cc.moveTo(214,458);cc.bezierCurveTo(216,478,218,494,216,512);cc.lineTo(230,510);cc.bezierCurveTo(230,492,226,476,222,460);cc.closePath();},col,ag_lt(col,0.25),224,484,36,null);
  ag_soft(c,cc=>cc.ellipse(210,454,17,13,-0.5,0,TAU),col,ag_lt(col,0.3),216,448,22,rgba(ag_dk(col,0.7),0.4),6);}}
const OO_PEOPLE={
  maathai:{name:"Wangari Maathai",role:"A biologist",key:"oo-maathai",skin:[112,72,52],hair:{style:"coily",c:[28,22,20]},earrings:[214,196,160],top:{kind:"cardigan",c:[128,104,86],inner:[232,226,214]},breath:0.27},
  wan:{name:"A farmer",key:"oo-woman1",skin:[100,64,46],hair:{style:"cropped",c:[26,22,20]},top:{kind:"sweater",c:[98,88,80]},hat:{paint:oo_scarf([178,128,118])},breath:0.3},
  nya:{name:"A farmer",key:"oo-woman2",skin:[124,82,58],hair:{style:"cropped",c:[28,24,22]},top:{kind:"cardigan",c:[118,66,60],inner:[218,206,186]},hat:{paint:oo_scarf([222,210,190])},breath:0.32},
  mum:{name:"A farmer",key:"oo-woman3",skin:[90,58,42],hair:{style:"cropped",c:[60,56,54]},top:{kind:"cardigan",c:[132,120,100],inner:[206,196,180]},hat:{paint:oo_scarf([88,74,66])},breath:0.25}
};
const OO_WOMEN=[OO_PEOPLE.wan,OO_PEOPLE.nya,OO_PEOPLE.mum];

/* ===== Owning the outcome: the university, 2027 =====
   The film's own pictures for Ivy's data product and its Monday (prefix oo_). The module's kit draws the rooms, the people, the sheets
   and the things in them, and is never changed for this film; what is here is this film's alone:
     ooMorning, ooWork, ooOne      the team's room on a Monday morning; the small room where Ivy works with Sam and Jun, by day; Helena's
                                   room, where she holds her one-to-ones, in the late afternoon
     oo_rooms(ctx, x, y, o)        the 186 teaching rooms, a square each: the 40 whose sensors were upgraded, marked, then amber where
                                   their counts dropped, and crossed where the timetable team would release them
     oo_hour(ctx, x, y, o)         one hour of a room's counts: the old sensors' one, the new sensors' four
     oo_chart(ctx, x, y, w, h, o)  the people counted each teaching day in those 40 rooms, 2 to 20 August 2027: the drop from Tuesday
                                   17 August, and the days run again
     oo_empty(ctx, x, y, o)        booked hours with nobody in them, in those rooms: one in five before, more than half after
     oo_feed(ctx, x, y, o)         one room's feed for one hour, Monday 23 August: four counts, the one the model kept, the one it keeps now
     oo_raci(ctx, x, y, o)         the product's line in a RACI chart: three who do part of the work, one who answers for it
     oo_check(ctx, x, y, o)        Ivy's new check: a room's counts against its own last four weeks, and a drop that holds the refresh
     oo_status(ctx, x, y, w, h, o) what the screen on the wall shows on a Monday: the refresh, its checks, and the counts it loaded
   Colour keeps the module's meaning: orange the data (the counts), amber the risk (the drop, the rooms that would be lost, the refresh
   held), green what's done or of value (the refresh that ran, the fix reviewed, the right counts), blue plans and rules (the product's
   promise, the timetable change, the new rule with Facilities, the check). People and the rooms' walls wear none of them. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.ooMorning=c=>lp_paintRoom(c,{light:"morning",seed:4});
AG_PLACES.ooWork=c=>lp_paintRoom(c,{light:"day",seed:12,base:[220,206,188]});
AG_PLACES.ooOne=c=>lp_paintRoom(c,{light:"late",seed:9,base:[222,206,190]});

/* ---------------------------------------------------------------- the 186 rooms */
// which 40 of the 186 had their sensors upgraded: spread across the campus, the same in every frame
const OO_UP=(()=>{const R=ag_rnd(1708),s=new Set();while(s.size<40)s.add((R()*186)|0);return s;})();
// o: mark (0 to 1, the 40 marked with a new sensor's dot), amber (0 to 1, the 40 turn amber), lose (0 to 1, a cross on each: rooms the
// timetable team would release), right (0 to 1, back to plain once their counts are right), a, light; a sheet 1240 x 330
function oo_rooms(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+620,y+165,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,1240,330,{light:o.light,pin:false});
  lp_label(ctx,x+40,y+62,"186 teaching rooms",{col:LP.mut});
  const am=clamp(o.amber||0,0,1)*(1-clamp(o.right||0,0,1)),mk=clamp(o.mark||0,0,1),ls=clamp(o.lose||0,0,1)*(1-clamp(o.right||0,0,1));
  for(let i=0;i<186;i++){const cx=x+44+(i%31)*37.4,cy=y+100+Math.floor(i/31)*36,up=OO_UP.has(i);
    ctx.fillStyle=rgba(up&&am>0?mix(mix(LP.wall,LP.paper,0.3),LP.amber,am):mix(LP.wall,LP.paper,0.3),1);ctx.fillRect(cx,cy,30,28);
    ctx.strokeStyle=rgba(LP.mut,0.25);ctx.lineWidth=1.5;ctx.strokeRect(cx,cy,30,28);
    if(up&&mk>0.004){ctx.fillStyle=rgba(am>0.5?[255,255,255]:LP.ink,mk);ctx.beginPath();ctx.arc(cx+15,cy+14,4.5,0,TAU);ctx.fill();}
    if(up&&ls>0.004){ctx.strokeStyle=rgba([255,255,255],ls);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx+7,cy+6);ctx.lineTo(cx+23,cy+22);ctx.moveTo(cx+23,cy+6);ctx.lineTo(cx+7,cy+22);ctx.stroke();}}
  ctx.restore();}

/* ---------------------------------------------------------------- one hour of counts */
// a line for the hour from 09:00 to 10:00, and under it the old sensors' one count (the hour's highest, sent at its end) and the new
// sensors' four, one each quarter of an hour. o: old (0 to 1), nw (0 to 1, the four come in one by one), a, light; a sheet 900 x 330
function oo_hour(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+450,y+165,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,900,330,{light:o.light,pin:false,col:LP.orange});
  lp_label(ctx,x+40,y+66,"One room, one hour",{col:LP.orange});
  const x0=x+310,x1=x+840,X=f=>lerp(x0,x1,f);
  ctx.strokeStyle=rgba(LP.mut,0.5);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y+120);ctx.lineTo(x1,y+120);ctx.stroke();
  for(const [f,s] of [[0,"09:00"],[1,"10:00"]]){ctx.beginPath();ctx.moveTo(X(f),y+110);ctx.lineTo(X(f),y+130);ctx.stroke();lp_T(ctx,s,X(f),y+104,{w:600,size:28,col:LP.mut,align:"center"});}
  const dot=(f,yy,u)=>{if(u<=0.004)return;const r=lerp(4,13,ag_spr(u,0,0.5));ctx.fillStyle=rgba(LP.orange,1);ctx.beginPath();ctx.arc(X(f),yy,r,0,TAU);ctx.fill();};
  const ol=clamp(o.old||0,0,1);if(ol>0.004){ctx.save();ctx.globalAlpha*=ag_sine(ol);lp_T(ctx,"Old sensors",x+40,y+196,{w:700,size:30});ctx.restore();dot(1,y+186,ol);}
  const nw=clamp(o.nw||0,0,1);if(nw>0.004){ctx.save();ctx.globalAlpha*=ag_sine(nw*3);lp_T(ctx,"New sensors",x+40,y+276,{w:700,size:30});ctx.restore();for(let i=0;i<4;i++)dot(i/4,y+266,clamp(nw*4-i,0,1));}
  ctx.restore();}

/* ---------------------------------------------------------------- the people counted each day in the 40 rooms */
// teaching days from Monday 2 August to Friday 20 August 2027 (the weeks the Monday refresh has loaded by the 23rd); from Tuesday 17
// August (day 11) the counts fall to about a quarter. The values are people counted in a day, across the 40 rooms
const OO_DAYS=[9640,9810,9720,9380,8460,9590,9880,9700,9450,8520,9620,2460,2510,2390,2180],OO_FIXED=[9620,9790,9640,8610];
// o: u (0 to 1, the line draws on), drop (0 to 1, the drop's days shaded amber), fixed (0 to 1, the days since Tuesday run again: the
// line back up), vals (show the levels), a, k, light
function oo_chart(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light,pin:false});
  lp_T(ctx,"PEOPLE COUNTED EACH DAY · THE 40 ROOMS",x+40,y+66,{w:800,size:28,ls:3,col:LP.orange});
  const px0=x+150,px1=x+w-60,py0=y+130,py1=y+h-96,n=OO_DAYS.length,X=i=>lerp(px0,px1,i/(n-1)),Y=v=>lerp(py1,py0,v/11000);
  ctx.strokeStyle=rgba(LP.mut,0.3);ctx.lineWidth=2;for(const v of [0,5000,10000]){ctx.beginPath();ctx.moveTo(px0,Y(v));ctx.lineTo(px1,Y(v));ctx.stroke();lp_T(ctx,v?v.toLocaleString("en-GB"):"0",px0-22,Y(v)+10,{w:600,size:28,col:LP.mut,align:"right"});}
  for(const [i,s] of [[0,"2 Aug"],[11,"Tue 17"],[14,"20 Aug"]])lp_T(ctx,s,X(i),py1+48,{w:600,size:28,col:i===11&&(o.drop||0)>0.5?LP.amber:LP.mut,align:"center"});
  // the drop's days, shaded
  const dr=clamp(o.drop||0,0,1)*(1-clamp(o.fixed||0,0,1));if(dr>0.004){ctx.fillStyle=rgba(LP.amber,0.16*dr);ctx.fillRect(X(10.5),py0-10,px1-X(10.5)+20,py1-py0+10);}
  // the line, drawn on day by day; the days since Tuesday rise back as they're run again
  const fx=clamp(o.fixed||0,0,1),vals=OO_DAYS.map((v,i)=>i>=11?lerp(v,OO_FIXED[i-11],ag_sine(clamp(fx*1.6-(i-11)*0.2,0,1))):v),m=clamp(o.u==null?1:o.u,0,1)*(n-1);
  ctx.save();ctx.strokeStyle=rgba(LP.orange,1);ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
  for(let i=0;i<=Math.floor(m);i++){i?ctx.lineTo(X(i),Y(vals[i])):ctx.moveTo(X(i),Y(vals[i]));}
  const f=m-Math.floor(m);if(f>0&&Math.floor(m)<n-1){const i=Math.floor(m);ctx.lineTo(lerp(X(i),X(i+1),f),lerp(Y(vals[i]),Y(vals[i+1]),f));}ctx.stroke();
  for(let i=0;i<=Math.floor(m);i++){ctx.fillStyle=rgba(i>=11&&dr>0.5?LP.amber:LP.orange,1);ctx.beginPath();ctx.arc(X(i),Y(vals[i]),i===10||i===11?9:6,0,TAU);ctx.fill();}ctx.restore();
  // the levels: about 9,600 a day, then about 2,400: a quarter
  const va=clamp(o.vals||0,0,1);if(va>0.004&&m>=n-1){ctx.save();ctx.globalAlpha*=va*(1-fx);lp_T(ctx,"About 9,600",X(4),Y(9700)-26,{w:800,size:30,col:LP.orange,align:"center"});
    lp_T(ctx,"About 2,400",X(12.6),Y(2400)-28,{w:800,size:30,col:LP.amber,align:"center"});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- booked hours with nobody in them */
// two bars on a sheet: in those 40 rooms, before the drop (one in five) and after (more than half). o: u (0 to 1), a, k, light; 620 x 520
function oo_empty(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+310,y+260,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,620,520,{col:LP.amber,light:o.light,pin:false});
  lp_T(ctx,"BOOKED, NOBODY IN",x+40,y+66,{w:800,size:28,ls:3,col:LP.amber});
  const base=y+420,top=y+150,H_=base-top,u=clamp(o.u==null?1:o.u,0,1);
  for(const [i,v,lab,show,col] of [[0,0.21,"Before",(o.u2==null?1:o.u2),LP.orange],[1,0.56,"From the 17th",u,LP.amber]]){const bx=x+110+i*250,bh=H_*v*ag_sine(clamp(show,0,1));
    ctx.fillStyle=rgba(col,1);ctx.fillRect(bx,base-bh,150,bh);lp_T(ctx,lab,bx+75,base+46,{w:600,size:28,col:LP.mut,align:"center"});
    if(show>0.6)lp_T(ctx,i?"More than half":"1 in 5",bx+75,base-bh-20,{w:800,size:30,col:col,align:"center",a:clamp((show-0.6)/0.4,0,1)});}
  ctx.strokeStyle=rgba(LP.mut,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+70,base);ctx.lineTo(x+570,base);ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- one room's feed for an hour */
// Monday 23 August, room 1.02: the four counts that arrived; o.first (0 to 1: the model kept the first, the others struck through),
// o.max (0 to 1: the fix keeps the highest), a, k, light; a sheet 640 x 450
const OO_FEED=[["09:00","4"],["09:15","38"],["09:30","41"],["09:45","40"]];
function oo_feed(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+320,y+225,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,640,450,{col:LP.orange,light:o.light,pin:false});
  lp_T(ctx,"ROOM 1.02 · MONDAY 23 AUGUST",x+40,y+66,{w:800,size:28,ls:3,col:LP.orange});
  lp_T(ctx,"Arrived",x+60,y+126,{w:600,size:28,col:LP.mut});lp_T(ctx,"People",x+400,y+126,{w:600,size:28,col:LP.mut});
  const fi=clamp(o.first||0,0,1),mx=clamp(o.max||0,0,1),u=clamp(o.u==null?1:o.u,0,1);
  OO_FEED.forEach(([tm,n],i)=>{const ry=y+186+i*62,ra=ag_sine(clamp(u*4-i,0,1));if(ra<=0.004)return;ctx.save();ctx.globalAlpha*=ra;
    // the row the model keeps: the first, until the fix; the highest after it
    const keepA=i===0?fi*(1-mx):i===2?mx:0;if(keepA>0.004){ctx.fillStyle=rgba(i===0?LP.amber:LP.green,0.16*keepA);ctx.fillRect(x+36,ry-42,568,58);ctx.fillStyle=rgba(i===0?LP.amber:LP.green,keepA);ctx.fillRect(x+36,ry-42,8,58);}
    const dim=(i>0?fi*(1-mx):0)+(i!==2?mx:0)*(i===0?1:1);const col=mix(LP.ink,mix(LP.mut,LP.paper,0.35),clamp(dim,0,1)*0.75);
    lp_T(ctx,tm,x+60,ry,{w:600,size:32,f:"mono",color:rgba(col,1)});lp_T(ctx,n,x+440,ry,{w:800,size:34,f:"mono",color:rgba(col,1),align:"right"});
    if(dim>0.004){ctx.strokeStyle=rgba(LP.mut,0.7*clamp(dim,0,1));ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+56,ry-12);ctx.lineTo(x+56+lerp(0,400,clamp(dim,0,1)),ry-12);ctx.stroke();}
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the product's line in a RACI chart */
// four people across, one line of work: who's responsible for a part (R) and who's accountable for the outcome (A, only one). o: r (0 to
// 1, the three Rs come in), aa (0 to 1, Ivy's A), a, k, light; a sheet 1120 x 330
function oo_raci(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+560,y+165,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,1120,330,{light:o.light,pin:false,col:LP.blue});
  lp_T(ctx,"RACI · TEACHING SPACE USE",x+40,y+66,{w:800,size:28,ls:3,col:LP.blue});
  const cols=[["Facilities","The sensors"],["Sam","The platform"],["Jun","Reviews"],["Ivy","The outcome"]];
  cols.forEach(([who,what],i)=>{const cx=x+155+i*270;lp_T(ctx,who,cx,y+130,{w:800,size:32,align:"center"});lp_T(ctx,what,cx,y+170,{w:600,size:28,col:LP.mut,align:"center"});
    ctx.strokeStyle=rgba(LP.mut,0.25);ctx.lineWidth=2;if(i)ctx.beginPath(),ctx.moveTo(cx-135,y+100),ctx.lineTo(cx-135,y+300),ctx.stroke();
    const u=i<3?clamp((o.r||0)*3-i,0,1):clamp(o.aa||0,0,1);if(u<=0.004)return;const f=lerp(0.5,1,ag_spr(u,0,0.5));ctx.save();ctx.globalAlpha*=ag_sine(u);ctx.translate(cx,y+248);ctx.scale(f,f);
    if(i<3){lp_T(ctx,"R",0,22,{w:800,size:56,col:LP.ink,align:"center"});}
    else{ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(0,0,44,0,TAU);ctx.fill();lp_T(ctx,"A",0,20,{w:800,size:56,color:"#fff",align:"center"});}ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- Ivy's check */
// one room's people a day over its own last four weeks: its usual range, a band; today's count, and when it falls far below the band, the
// refresh held. o: u (0 to 1, the weeks draw on), today (0 to 1), held (0 to 1), a, k, light; a sheet 760 x 450
const OO_WEEKS=[212,226,198,231,219,204,228,216,190,223,230,208,221,214,201,226,218,233,207,224];
function oo_check(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+380,y+225,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,760,450,{col:LP.blue,light:o.light,pin:false});
  lp_T(ctx,"A NEW CHECK · EACH ROOM",x+40,y+66,{w:800,size:28,ls:3,col:LP.blue});
  lp_T(ctx,"Against its own last four weeks",x+40,y+110,{w:600,size:28,col:LP.mut});
  const px0=x+60,px1=x+520,py0=y+150,py1=y+410,n=OO_WEEKS.length,X=i=>lerp(px0,px1,i/(n-1)),Y=v=>lerp(py1,py0,v/300),u=clamp(o.u==null?1:o.u,0,1),tx=px1+110;
  // the floor of the chart, faint
  ctx.strokeStyle=rgba(LP.mut,0.3*u);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px0,Y(0));ctx.lineTo(tx+60,Y(0));ctx.stroke();
  // the usual range, a band, named
  ctx.fillStyle=rgba(LP.blue,0.14*u);ctx.fillRect(px0,Y(240),tx+60-px0,Y(185)-Y(240));
  ctx.strokeStyle=rgba(LP.blue,0.6*u);ctx.lineWidth=2.5;ctx.setLineDash([10,8]);for(const v of [185,240]){ctx.beginPath();ctx.moveTo(px0,Y(v));ctx.lineTo(tx+60,Y(v));ctx.stroke();}ctx.setLineDash([]);
  if(u>0.004)lp_T(ctx,"Its usual range",px0,Y(240)-16,{w:600,size:28,col:LP.blue,a:u});
  const m=u*(n-1);for(let i=0;i<=Math.floor(m);i++){ctx.fillStyle=rgba(LP.orange,1);ctx.beginPath();ctx.arc(X(i),Y(OO_WEEKS[i]),6,0,TAU);ctx.fill();}
  // today: it falls far below the band, and the fall is drawn
  const td=clamp(o.today||0,0,1);if(td>0.004){const ty=Y(lerp(220,56,ag_sine(td))),dk=td>0.6;
    if(dk){ctx.strokeStyle=rgba(LP.amber,0.8*clamp((td-0.6)/0.4,0,1));ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(tx,Y(185)+8);ctx.lineTo(tx,ty-16);ctx.stroke();ctx.setLineDash([]);}
    ctx.fillStyle=rgba(dk?LP.amber:LP.orange,1);ctx.beginPath();ctx.arc(tx,ty,12,0,TAU);ctx.fill();
    if(td>0.7)lp_T(ctx,"Today",tx-30,ty+10,{w:700,size:28,col:LP.amber,align:"right",a:clamp((td-0.7)/0.3,0,1)});}
  ctx.restore();}

/* ---------------------------------------------------------------- the screen on the wall, on a Monday */
// the refresh's line, its checks, and small bars of the week's counts; o: ran (0 to 1), checks (0 to 1), bars (0 to 1), a
function oo_status(ctx,x,y,w,h,o){o=o||{};lp_screen(ctx,x,y,w,h,{a:o.a,draw:(c,gx,gy,gw,gh)=>{
  lp_T(c,"TEACHING SPACE USE",gx+36,gy+60,{w:800,size:28,ls:3,col:LP.orange});
  lp_T(c,o.when||"Monday 23 August, 07:00",gx+36,gy+108,{w:700,size:30});
  const ra=clamp(o.ran||0,0,1),ch=clamp(o.checks||0,0,1),ba=clamp(o.bars||0,0,1);
  if(ra>0.004)lp_pill(c,gx+36+150,gy+180,"Refreshed",{col:LP.green,icon:"tick",size:28,a:ra,k:o.kRan});
  if(ch>0.004)lp_pill(c,gx+36+170,gy+260,"Every check passed",{col:LP.green,icon:"tick",size:28,a:ch,k:o.kCh});
  if(ba>0.004){const bx=gx+gw-300,by=gy+300,vals=[0.92,0.95,0.9,0.88,0.8];c.save();c.globalAlpha*=ba;vals.forEach((v,i)=>{const bh=170*v*ag_sine(ba);c.fillStyle=rgba(LP.orange,1);c.fillRect(bx+i*52,by-bh,36,bh);});c.restore();}}});}

/* ===== Owning the outcome: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where both show the same people. Sizes in
   the 1920 x 1080 frame. */

const OO_LAST="Own what it's for, not only what you did.";
// the film's number and title at the top left, from the second chapter on
function oo_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1","Owning the outcome",Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function oo_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const oo_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function oo_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 (and goes at t1)
function oo_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// people out of doors: the day's light, no wall behind them
const OO_OUT={light:"day",wall:0};
// the women of the hills and Maathai, where they stand on the near slope; o.a fades them, as one
function oo_hillPeople(x,tt,a,o){o=o||{};if(a<=0.004)return;OO_WOMEN.forEach((P,i)=>lp_person(x,P,[330,640,940][i],[700,720,712][i],0.8,{t:tt,light:OO_OUT,a}));
  if(!o.noMaathai)lp_person(x,OO_PEOPLE.maathai,1480,700,0.82,{t:tt,flip:true,light:OO_OUT,a});}
// the row of seedlings on the near slope: g how far they've grown, dry how far the ones that died have died, at a size s
function oo_row(x,tt,g,dry,s){OO_ROW.pts.forEach(([px,py],i)=>oo_seedling(x,px,py,s,{g:OO_ROW.alive[i]?g:Math.min(g,0.45),dry:OO_ROW.alive[i]?0:dry,seed:40+i}));}
// a tick over each seedling still alive
function oo_ticks(x,tt,t0,s){OO_ROW.pts.forEach(([px,py],i)=>{if(!OO_ROW.alive[i])return;const u=ag_in(tt,t0+i*0.08,0.4);if(u<=0.004)return;const f=lerp(0.5,1,ag_spr(tt,t0+i*0.08,0.5));
  x.save();x.globalAlpha*=u;x.fillStyle=rgba(LP.green,1);x.beginPath();x.arc(px,py-150*s,22*f,0,TAU);x.fill();lp_icon(x,"tick",px,py-150*s,30*f,[255,255,255]);x.restore();});}
// the team's table with a seedling in its sleeve, the end of the opening: g the seedling's growth
function oo_desk(x,tt,o){o=o||{};lp_table(x,420,840,640,{});oo_seedling(x,600,780,2.4,{g:o.g==null?0.7:o.g,sleeve:true,seed:7});}

/* ---------------------------------------------------------------- 1. Trees still standing: Kenya, the 1970s to 2004 */
scene("trees",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const pplA=tt=>ag_in(tt,w("women","rural",-0.4),0.8);
  ag_shots(ctx,S,t,sc.dur,[
    // the hills of the central highlands, their forests cleared; the women tell Maathai what's going wrong
    {at:0,place:"ooHills",keys:[[0,1060,470,1.16],[c.when+0.2,980,520,1.06],[c.women,960,560,1.0]],d:3.4,draw:(x,tt)=>{
      oo_hillPeople(x,tt,pplA(tt));
      oo_tag(x,tt,w("women","rural",-0.1),c.streams-0.6,640,400,"Rural women",{align:"center",col:LP.ink});
      lp_nameTag(x,1480,392,OO_PEOPLE.maathai,{align:"center",a:ag_io(tt,w("women","Maathai",-0.2),c.streams-0.6,0.4)});
      oo_sheet(x,tt,w("streams","streams",-0.3),150,110,780,{kick:"What's going wrong",lines:["Their streams are drying up","Their food is less sure","Further, each year, for firewood"]},
        {col:LP.amber,light:null,pin:false,out:c.cleared-0.7,u:oo_u(tt,[w("streams","streams",-0.2),w("streams","food",-0.2),w("streams","walk",-0.2)])});}},
    // the forests, cleared for farms, for tea and coffee to sell, for timber; each choice made sense
    {at:c.cleared-0.3,place:"ooHills",later:true,keys:[[c.cleared-0.3,980,530,1.04]],d:2.0,draw:(x,tt)=>{
      oo_tag(x,tt,w("cleared","forests",-0.1),c.soil-0.6,960,250,"The forests, cleared",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("cleared","farms",-0.1),c.soil-0.6,300,600,"For farms",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("cleared","tea",-0.1),c.soil-0.6,960,640,"Tea and coffee, to sell",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("cleared","plantations",-0.1),c.soil-0.6,1530,500,"Timber plantations",{align:"center",col:LP.ink});
      oo_pill(x,tt,w("sense","sense",-0.2),c.soil-0.6,960,350,"Each choice made sense to the people who made it",{col:LP.ink});}},
    // without trees, the rain washes the soil off the slope, and the springs run dry: the camera glides in from where it is
    {at:c.soil-0.3,place:"ooHills",keys:[[c.soil-0.3,980,530,1.04],[c.soil-0.3,1040,640,1.24]],d:2.2,draw:(x,tt)=>{
      oo_run(x,tt,ag_io(tt,w("soil","washed",-0.6),c.harm-0.2,0.8));
      oo_tag(x,tt,w("soil","soil",-0.1),c.harm-0.6,700,470,"The soil washed off the hills",{align:"center",col:LP.amber});
      oo_tag(x,tt,w("soil","springs",-0.1),c.harm-0.6,1360,560,"The springs ran dry",{align:"center",col:LP.amber});}},
    // the women carried it: water, firewood, food
    {at:c.harm-0.3,place:"ooHills",later:true,keys:[[c.harm-0.3,1040,640,1.24],[c.harm-0.3,960,560,1.0]],d:2.0,draw:(x,tt)=>{
      oo_hillPeople(x,tt,1,{noMaathai:true});
      oo_sheet(x,tt,w("harm","women",-0.2),1140,110,640,{kick:"The women",lines:["Fetched the water","Gathered the firewood","Grew the food"]},
        {light:null,pin:false,out:c.change-0.5,u:oo_u(tt,[w("harm","fetched",-0.1),w("harm","gathered",-0.1),w("harm","grew",-0.1)])});
      oo_pill(x,tt,w("harm","harm",-0.2),c.change-0.5,1400,500,"The harm fell first on them, and their children",{col:LP.amber,size:28});
      oo_tag(x,tt,w("change","change",-0.3),c.start-0.6,1460,190,"Something had to change",{align:"center",col:LP.ink});}},
    // 1977: the Green Belt Movement
    {at:c.start-0.3,place:"ooNursery",keys:[[c.start-0.3,960,520,1.0]],dis:1.2,draw:(x,tt)=>{const nA=ag_in(tt,w("nursery","Groups",-0.4),0.8);
      if(nA>0.004){lp_person(x,OO_PEOPLE.wan,280,700,0.62,{t:tt,cut:796,light:OO_OUT,a:nA});lp_person(x,OO_PEOPLE.nya,560,690,0.62,{t:tt,cut:796,light:OO_OUT,a:nA});
        lp_person(x,OO_PEOPLE.mum,1320,700,0.62,{t:tt,cut:796,light:OO_OUT,flip:true,a:nA});}
      lp_person(x,OO_PEOPLE.maathai,1640,690,0.62,{t:tt,cut:796,light:OO_OUT,flip:true});
      oo_beds(x,tt,{g:lerp(0.15,1,ag_sine(ag_in(tt,w("nursery","seedlings",-0.2),3.2)))});
      oo_sheet(x,tt,w("start","nineteen",-0.2),660,300,600,{kick:"1977",title:"The Green Belt Movement",lines:["With the National Council of Women of Kenya"]},
        {col:LP.blue,light:null,pin:false,out:c.nursery+0.6,u:ag_in(tt,w("start","National",-0.2),0.5)});
      oo_tag(x,tt,w("nursery","nurseries",-0.2),c.paid-0.6,960,380,"Seedlings in their own nurseries",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("nursery","local",-0.2),c.paid-0.6,960,460,"From the seeds of local trees",{align:"center",col:LP.ink});}},
    // planted out on the slope; months later, paid for each tree still alive
    {at:c.paid-0.3,place:"ooHills",keys:[[c.paid-0.3,1050,640,1.25]],dis:1.2,draw:(x,tt)=>{const m0=w("paid","months",-0.3),g=lerp(0.25,1,ag_sine(ag_in(tt,m0,1.6))),dry=ag_sine(ag_in(tt,m0+0.2,1.4));
      oo_row(x,tt,g,dry,1.0);
      oo_tag(x,tt,m0,c.fifty-0.6,1050,440,"Months later",{align:"center",col:LP.ink});
      oo_ticks(x,tt,w("paid","alive",-0.1),1.0);
      oo_pill(x,tt,w("paid","paid",-0.1),c.answer-0.4,1050,330,"Paid for each tree still alive",{col:LP.green});
      oo_tag(x,tt,w("paid","not",-0.1),c.answer-0.4,1050,520,"Not for each seedling planted",{align:"center",col:LP.mut});
      oo_pill(x,tt,w("answer","living",-0.2),c.fifty-0.6,1050,330,"Living trees, not the planting",{col:LP.green});}},
    // years later: the same hills, with trees
    {at:c.fifty-0.3,place:"ooGreen",later:true,dis:1.0,keys:[[c.fifty-0.3,960,540,1.0]],d:2.6,draw:(x,tt)=>{
      lp_figure(x,150,110,560,{kick:"Since then, in Kenya",num:"50 million",label:"More than that many trees planted"},{col:LP.green,light:null,pin:false,a:ag_io(tt,w("fifty","fifty",-0.2),c.nobel-0.5,0.4),k:tt-w("fifty","fifty",-0.2)});
      oo_tag(x,tt,w("give","fuel",-0.1),c.nobel-0.5,980,300,"Fuel",{align:"center",col:LP.green});
      oo_tag(x,tt,w("give","food",-0.1),c.nobel-0.5,1200,300,"Food",{align:"center",col:LP.green});
      oo_tag(x,tt,w("give","shelter",-0.1),c.nobel-0.5,1440,300,"Shelter",{align:"center",col:LP.green});
      oo_pill(x,tt,w("give","income",-0.2),c.nobel-0.5,1210,390,"An income for thousands of women",{col:LP.green});
      oo_sheet(x,tt,w("nobel","two",-0.2),560,120,800,{kick:"2004",title:"The Nobel Peace Prize",lines:["Wangari Maathai, the first African woman to win it"]},
        {light:null,pin:false,out:c.data-0.5,u:ag_in(tt,w("nobel","first",-0.2),0.5)});}},
    // and data work: a job that ran, a report that was sent; the seedling, on the team's table
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8);x.save();x.globalAlpha*=ga;
      oo_desk(x,tt,{g:lerp(0.55,0.75,ag_sine(ag_in(tt,c.breath-0.4,3.0)))});
      oo_status(x,1040,150,720,420,{when:"Monday, 07:00",ran:ag_in(tt,w("data","job",-0.1),0.4),kRan:tt-w("data","job",-0.1),bars:ag_in(tt,c.breath,1.2),a:1});
      oo_sheet(x,tt,w("data","report",-0.2),180,150,560,{kick:"A report",title:"Sent"},{light:"day"});
      oo_pill(x,tt,w("data","sent",-0.1),null,460,400,"Sent",{col:LP.green,icon:"tick"});
      oo_tag(x,tt,w("own","answering",-0.2),c.breath-0.2,1400,660,"Owning the outcome: answering for what they're for",{align:"center",col:LP.ink});x.restore();}}
  ]);
  // where and when, held still on the screen while the camera glides out over the hills
  setScreen(ctx,S);oo_sheet(ctx,t,w("when","Kenya",-0.2),150,110,560,{kick:"Kenya",title:"The 1970s",sub:"The central highlands"},{light:null,pin:false,out:c.streams-0.6});
  lp_title(ctx,S,t,c.breath+0.2,"Owning the outcome","Answer for what it's for","Leading data people · Ownership and performance");
});

/* ---------------------------------------------------------------- 2. What she owns */
scene("owns",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const ivy=(x,tt)=>lp_person(x,"ivy",1480,650,1.0,{t:tt,flip:true,light:dy});
  ag_shots(ctx,S,t,sc.dur,[
    // Thursday 1 July 2027: Ivy owns her first data product; what it is, who's its owner, and its promise
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{ivy(x,tt);
      oo_sheet(x,tt,w("owner","Ivy",-0.2),180,150,800,{kick:"Thursday 1 July 2027",title:"Ivy Reyes",lines:["Owner of her first data product"]},{light:"day",out:c.what-0.5,u:ag_in(tt,w("owner","owner",-0.1),0.5)});
      oo_sheet(x,tt,w("what","Teaching",-0.2),180,150,800,{kick:"The data product",title:"Teaching space use",lines:["Every teaching room, every hour","What was booked","How many people came"]},
        {col:LP.orange,light:"day",out:c.mesh-0.5,u:oo_u(tt,[w("what","every",-0.1),w("what","booked",-0.1),w("what","many",-0.1)])});
      oo_pill(x,tt,w("what","Counts",-0.1),c.mesh-0.5,580,560,"Counts, never people",{col:LP.blue});
      oo_sheet(x,tt,w("mesh","Zhamak",-0.2),180,150,800,{kick:"Zhamak Dehghani · Data mesh",title:"The data product owner",lines:["Answers for what the product does for its readers"]},
        {col:LP.blue,light:"day",out:c.film-0.5,u:ag_in(tt,w("mesh","answers",-0.1),0.5)});
      oo_sheet(x,tt,w("film","product",-0.2),180,150,800,{kick:"The film before",title:"A product with an owner",sub:"How a product gets one"},{light:"day",out:c.promise-0.5});
      oo_pill(x,tt,w("film","owning",-0.4),c.promise-0.5,580,500,"This film: the owning",{col:LP.ink});
      oo_sheet(x,tt,w("promise","promise",-0.2),180,150,800,{kick:"Its promise",title:"Every Monday by 07:00",lines:["With the week before"]},{col:LP.blue,light:"day",out:c.readers-0.5,u:ag_in(tt,w("promise","week",-0.1),0.5)});}},
    // its readers, by name
    {at:c.readers-0.3,place:"lpRoom",keys:[[c.readers-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);
      lp_person(x,"graham",440,700,0.9,{t:tt,light:dy});lp_person(x,"mei",860,700,0.9,{t:tt,light:dy});
      lp_nameTag(x,440,360,"graham",{align:"center",a:ag_in(tt,w("readers","Graham",-0.1),0.4)});
      lp_nameTag(x,860,360,"mei",{align:"center",a:ag_in(tt,w("readers","Mei",-0.1),0.4)});
      oo_tag(x,tt,w("readers","teams",-0.2),null,650,170,"Its readers, with their teams",{align:"center",col:LP.ink});}},
    // what it's for: next year's timetable; owning that it's judged on true counts
    {at:c.for-0.3,place:"lpRoom",keys:[[c.for-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);
      oo_sheet(x,tt,w("for","knows",-0.1),180,150,820,{kick:"What it's for",title:"Next year's timetable",lines:["Moves about one peak class in six","Releases rooms nobody uses"]},
        {col:LP.blue,light:"day",out:c.truly-0.5,u:oo_u(tt,[w("for","move",-0.1),w("for","release",-0.1)])});
      oo_tag(x,tt,w("which","Which",-0.1),c.truly-0.5,590,560,"Which ones: chosen from her counts",{align:"center",col:LP.orange});
      oo_tag(x,tt,w("truly","isn't",-0.2),c.many-0.5,590,300,"Not only Monday's job",{align:"center",col:LP.mut});
      oo_pill(x,tt,w("truly","judged",-0.4),c.many-0.5,590,400,"The timetable change, judged on true counts",{col:LP.green,size:28});}},
    // many do part of the work; one answers for the outcome
    {at:c.many-0.3,place:"lpRoom",keys:[[c.many-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);
      for(const [who,px,word] of [["graham",300,"Facilities"],["sam",680,"Sam"],["jun",1060,"Jun"]])lp_person(x,who,px,760,0.78,{t:tt,light:dy,a:ag_in(tt,w("many",word,-0.3),0.6)*(1-ag_in(tt,c.helena-1.0,0.5))});
      oo_tag(x,tt,w("many","sensors",-0.1),c.one-0.4,300,450,"The sensors",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("many","platform",-0.1),c.one-0.4,680,450,"The platform",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("many","reviews",-0.1),c.one-0.4,1060,450,"Reviews her changes",{align:"center",col:LP.ink});
      oo_raci(x,120,140,{r:ag_in(tt,c.one,0.9),aa:ag_in(tt,w("one","accountable",-0.5),0.4),a:ag_io(tt,c.one-0.2,c.helena-0.5,0.4),k:tt-c.one+0.2,light:"day"});
      oo_tag(x,tt,w("one","only",-0.1),c.helena-0.5,1085,520,"Only one A",{align:"center",col:LP.blue});}},
    // Helena gives her the authority to match: the three have left, and Ivy stays where she is
    {at:c.helena-0.3,place:"lpRoom",keys:[[c.helena-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);lp_person(x,"helena",480,650,1.0,{t:tt,light:dy,a:ag_in(tt,c.helena-0.2,0.6)});
      oo_tag(x,tt,w("helena","authority",-0.2),c.can-0.3,960,200,"The authority to match",{align:"center",col:LP.blue});
      oo_pill(x,tt,w("can","hold",-0.1),null,960,290,"Hold a refresh",{col:LP.blue});
      oo_pill(x,tt,w("can","change",-0.1),null,960,380,"Change the model, with a review",{col:LP.blue});
      oo_pill(x,tt,w("can","tell",-0.1),null,960,470,"Tell the readers",{col:LP.blue});
      oo_tag(x,tt,w("can","without",-0.1),null,960,560,"Without asking first",{align:"center",col:LP.ink});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,c.mesh-0.4,0.5)});
  oo_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. A Monday that looked fine */
AG_ROOMS.ooMorning="lpRoom";
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const ivy=(x,tt,a)=>lp_person(x,"ivy",1480,650,1.0,{t:tt,flip:true,light:mo,a});
  ag_shots(ctx,S,t,sc.dur,[
    // Tuesday 17 August: Facilities upgrades the sensors in 40 rooms; four counts an hour, not one
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      oo_rooms(x,340,150,{mark:ag_in(tt,w("upgrade","sensors",-0.1),0.8),a:ag_in(tt,0.5,0.5),k:tt-0.5,light:"day"});
      oo_tag(x,tt,w("upgrade","seventeenth",-0.2),c.quarter-0.4,960,560,"Tuesday 17 August: new sensors in 40 rooms",{align:"center",col:LP.ink});
      oo_hour(x,510,530,{old:ag_in(tt,w("quarter","once",-0.2),0.5),nw:ag_in(tt,w("quarter","quarter",-0.3),1.2),a:ag_in(tt,c.quarter,0.4),k:tt-c.quarter,light:"day"});
      oo_pill(x,tt,w("quarter","detail",-0.1),c.tells-0.4,1160,90,"More detail: a real improvement",{col:LP.green});
      oo_tag(x,tt,w("tells","nobody",-0.1),c.ran-0.6,1160,90,"Nobody tells the data team",{align:"center",col:LP.ink});}},
    // Monday 23 August, seven o'clock: the refresh runs, every check passes
    {at:c.ran-0.3,place:"ooMorning",later:true,keys:[[c.ran-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);
      oo_status(x,200,150,860,460,{ran:ag_in(tt,w("ran","runs",-0.1),0.4),kRan:tt-w("ran","runs",-0.1),checks:ag_in(tt,w("ran","check",-0.1),0.4),kCh:tt-w("ran","check",-0.1),bars:ag_in(tt,w("ran","seven",0),1.0)});}},
    // at the Green Belt, a seedling earned nothing until it lived
    {at:c.seedling-0.3,place:"ooHills",keys:[[c.seedling-0.3,980,660,1.4]],dis:1.0,draw:(x,tt)=>{const p=OO_ROW.pts[3];
      oo_seedling(x,p[0],p[1],1.3,{g:lerp(0.3,1,ag_sine(ag_in(tt,w("seedling","until",-0.3),1.4))),seed:43});
      const u=ag_in(tt,w("seedling","lived",-0.1),0.4);if(u>0.004){const f=lerp(0.5,1,ag_spr(tt,w("seedling","lived",-0.1),0.5));x.save();x.globalAlpha*=u;x.fillStyle=rgba(LP.green,1);x.beginPath();x.arc(p[0],p[1]-200,24*f,0,TAU);x.fill();lp_icon(x,"tick",p[0],p[1]-200,32*f,[255,255,255]);x.restore();}
      oo_tag(x,tt,w("seedling","earned",-0.2),null,980,440,"It earned nothing until it lived",{align:"center",col:LP.ink});}},
    // so Ivy reads the numbers, not only the tick
    {at:c.reads-0.3,place:"ooMorning",keys:[[c.reads-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{ivy(x,tt);
      oo_status(x,200,150,860,460,{ran:1,checks:1,bars:1});
      oo_tag(x,tt,w("reads","numbers",-0.1),c.drop-0.4,630,700,"The numbers, not only the tick",{align:"center",col:LP.orange});}},
    // forty rooms: the counts dropped to about a quarter; booked hours with nobody in, from one in five to more than half
    {at:c.drop-0.3,place:"ooMorning",keys:[[c.drop-0.3,960,540,1.0]],draw:(x,tt)=>{const d0=c.drop-0.1;
      oo_chart(x,120,130,1000,610,{u:ag_in(tt,d0,1.8),drop:ag_in(tt,w("drop","dropped",-0.1),0.5),vals:ag_in(tt,w("drop","quarter",-0.2),0.5),a:ag_in(tt,d0-0.2,0.4),k:tt-d0+0.2,light:"morning"});
      oo_empty(x,1200,170,{u:ag_in(tt,w("empty","more",-0.2),0.8),u2:ag_in(tt,w("empty","one",-0.2),0.6),a:ag_in(tt,c.empty,0.4),k:tt-c.empty,light:"morning"});}},
    // if nobody noticed: rooms released that classes really use
    {at:c.release-0.3,place:"ooMorning",later:true,keys:[[c.release-0.3,960,540,1.0]],draw:(x,tt)=>{
      oo_rooms(x,340,150,{mark:1,amber:ag_in(tt,c.release,0.6),lose:ag_in(tt,w("release","release",-0.1),0.5),light:"morning"});
      oo_tag(x,tt,w("release","classes",-0.2),c.wait-0.4,960,560,"Rooms that classes really use",{align:"center",col:LP.amber});}},
    // Ivy doesn't wait: at ten past eight, she writes to the readers
    {at:c.wait-0.3,place:"ooMorning",later:true,keys:[[c.wait-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);
      oo_tag(x,tt,w("wait","wait",-0.2),c.writes-0.3,640,300,"Not waiting to be sure, or to be asked",{align:"center",col:LP.ink});
      oo_sheet(x,tt,w("writes","ten",-0.2),180,150,900,{kick:"08:10 · To the readers",title:"The counts for 40 rooms look wrong",lines:["Don't use them yet","The right ones by tomorrow"]},
        {col:LP.amber,light:"morning",u:oo_u(tt,[w("writes","don't",-0.1),w("writes","right",-0.1)])});
      oo_pill(x,tt,w("first","first",-0.2),null,630,600,"Said first, before the fix",{col:LP.green});}}
  ]);
  oo_kick(ctx,S,1,{light:"morning"});
});

/* ---------------------------------------------------------------- 4. Fix it, or raise it */
scene("fix",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // with Sam, the feed for one room: four counts an hour; the step kept the first; the fix keeps the highest
    {at:0,place:"ooWork",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      const go=1-ag_in(tt,c.review-0.9,0.5);
      lp_person(x,"ivy",1150,690,0.95,{t:tt,cut:812,light:dy});lp_person(x,"sam",1580,690,0.95,{t:tt,flip:true,cut:812,light:dy,a:go});lp_table(x,940,820,860);
      oo_feed(x,200,140,{u:ag_in(tt,w("sam","feed",-0.2),1.2),first:ag_in(tt,w("step","kept",-0.1),0.6),max:ag_in(tt,w("fix","highest",-0.1),0.6),a:ag_in(tt,0.3,0.4)*go,light:"day"});
      oo_tag(x,tt,w("four","four",-0.1),c.step-0.4,520,660,"Since Tuesday: four an hour",{align:"center",col:LP.orange});
      oo_tag(x,tt,w("four","model",-0.1),c.step-0.4,520,740,"The model: built for one",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("step","kept",-0.1),c.early-0.4,520,660,"Kept the first, dropped three",{align:"center",col:LP.amber});
      oo_tag(x,tt,w("early","first",-0.1),c.fix-0.4,520,660,"The first: one class leaving",{align:"center",col:LP.amber});
      oo_tag(x,tt,w("early","nearly",-0.2),c.fix-0.4,520,740,"So the rooms looked nearly empty",{align:"center",col:LP.amber});
      oo_pill(x,tt,w("fix","keep",-0.1),c.review-0.9,520,670,"Keep the hour's highest",{col:LP.green});}},
    // Jun reviews her pull request: Sam has left, and Ivy stays where she is
    {at:c.review-0.3,place:"ooWork",keys:[[c.review-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"ivy",1150,690,0.95,{t:tt,cut:812,light:dy});lp_person(x,"jun",1580,690,0.95,{t:tt,flip:true,cut:812,light:dy,a:ag_in(tt,c.review-0.2,0.6)});lp_table(x,940,820,860);
      oo_sheet(x,tt,w("review","pull",-0.2),180,150,700,{kick:"Pull request · Ivy Reyes",title:"Keep the hour's highest count",lines:["Reviewed by Jun Park"]},{light:"day",u:ag_in(tt,w("review","reviews",-0.1),0.5)});
      oo_pill(x,tt,w("review","every",-0.1),null,530,560,"Every change, reviewed by another",{col:LP.green,icon:"tick",size:28});}},
    // the days since Tuesday run again; on Tuesday morning, the right counts and a short note
    {at:c.rerun-0.3,place:"ooWork",later:true,keys:[[c.rerun-0.3,960,540,1.0]],draw:(x,tt)=>{
      oo_chart(x,120,130,1000,610,{u:1,drop:1,fixed:ag_in(tt,w("rerun","run",-0.1),2.0),a:ag_in(tt,c.rerun,0.4),light:"day"});
      oo_pill(x,tt,w("rerun","right",-0.2),null,620,800,"Tuesday 24 August: the right counts",{col:LP.green,icon:"tick",size:28});
      oo_sheet(x,tt,w("rerun","note",-0.1),1190,150,620,{kick:"Ivy's note to the readers",lines:["What happened","What it touched","What's fixed","What changes"]},
        {light:"day",u:oo_u(tt,[w("note","happened",-0.1),w("note","touched",-0.1),w("note","fixed",-0.1),w("note","changes",-0.1)])});}},
    // the sensors aren't hers: she raises it with Graham
    {at:c.mine-0.3,place:"ooWork",later:true,keys:[[c.mine-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"ivy",1060,680,0.95,{t:tt,light:dy});lp_person(x,"graham",1520,680,0.95,{t:tt,flip:true,light:dy});
      oo_tag(x,tt,w("mine","sensors",-0.1),c.raise+0.4,500,300,"The sensors: Facilities'",{align:"center",col:LP.ink});
      oo_sheet(x,tt,w("raise","From",-0.2),160,150,700,{kick:"From now on",title:"Facilities tells the data team before a sensor changes"},{col:LP.blue,light:"day"});}},
    // and a check of her own, which holds the refresh
    {at:c.check-0.3,place:"ooWork",later:true,keys:[[c.check-0.3,960,540,1.0]],draw:(x,tt)=>{lp_person(x,"ivy",1480,650,1.0,{t:tt,flip:true,light:dy});
      oo_check(x,180,150,{u:ag_in(tt,w("check","check",-0.1),1.4),today:ag_in(tt,w("holds","drop",-0.2),0.8),a:ag_in(tt,c.check,0.4),k:tt-c.check,light:"day"});
      oo_pill(x,tt,w("holds","holds",-0.1),null,560,690,"Refresh held",{col:LP.amber,icon:"wait"});
      oo_tag(x,tt,w("holds","tells",-0.1),null,560,780,"Ivy told, before anyone reads it",{align:"center",col:LP.ink});}}
  ]);
  oo_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Nobody to blame */
scene("blame",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  // the three parts, each right about what it saw, and the joins between them
  const parts=[["Facilities","Made the sensors better","Facilities"],["Sam's platform","Loaded every count","platform"],["The step","Right for the data it was built for","step"]];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ooOne",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      oo_tag(x,tt,w("nobody","Nobody",-0.1),null,1040,110,"Nobody did anything wrong",{align:"center",col:LP.ink});
      parts.forEach(([k,ti,word],i)=>{const t0=w("each",word,-0.2);oo_sheet(x,tt,t0,120+i*570,200,540,{kick:k,title:ti},{light:"late"});
        const u=ag_in(tt,w("fit","right",-0.1)+i*0.15,0.4);if(u>0.004){x.save();x.globalAlpha*=u;x.fillStyle=rgba(LP.green,1);x.beginPath();x.arc(390+i*570,500,24,0,TAU);x.fill();lp_icon(x,"tick",390+i*570,500,32,[255,255,255]);x.restore();}});
      // where the parts meet: each join, dashed and marked, the thing that failed
      const fA=ag_in(tt,w("fit","fit",-0.4),0.6);
      if(fA>0.004){x.save();x.globalAlpha*=fA;x.strokeStyle=rgba(LP.amber,1);x.lineWidth=5;x.setLineDash([14,12]);
        for(const [x0,x1] of [[430,920],[1000,1490]]){x.beginPath();x.moveTo(x0,500);x.lineTo(x1,500);x.stroke();}x.setLineDash([]);
        for(const [i,jx] of [[0,675],[1,1245]]){const f=lerp(0.5,1,ag_spr(tt,w("fit","fit",-0.4)+i*0.12,0.5));x.fillStyle=rgba(LP.amber,1);x.beginPath();x.arc(jx,500,24*f,0,TAU);x.fill();lp_icon(x,"cross",jx,500,28*f,[255,255,255]);}
        x.restore();}
      oo_pill(x,tt,w("fit","failed",-0.1),null,960,640,"What failed: how the parts fit together",{col:LP.amber});}},
    // a just culture
    {at:c.dekker-0.3,place:"ooOne",later:true,keys:[[c.dekker-0.3,960,540,1.0]],draw:(x,tt)=>{
      oo_sheet(x,tt,w("dekker","Sidney",-0.2),560,150,800,{kick:"Sidney Dekker · 2007",title:"A just culture",lines:["Ask what happened","And what must change","Not who to blame"]},
        {col:LP.blue,light:"late",u:oo_u(tt,[w("dekker","happened",-0.1),w("dekker","change",-0.1),w("dekker","blame",-0.2)])});}},
    // Helena's first question; why Ivy could say it first; giving an account
    {at:c.helena-0.3,place:"ooOne",later:true,keys:[[c.helena-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",620,690,0.95,{t:tt,cut:812,light:lt});lp_person(x,"ivy",1300,690,0.95,{t:tt,flip:true,cut:812,light:lt});lp_table(x,520,820,880);
      oo_tag(x,tt,w("helena","who",-0.2),c.safe-0.4,960,200,"Not: who?",{align:"center",col:LP.mut});
      oo_tag(x,tt,w("helena","happened",-0.2),c.safe-0.4,960,280,"What happened? What do you need?",{align:"center",col:LP.ink});
      oo_pill(x,tt,w("safe","blamed",-0.2),c.account-0.5,960,240,"Where nobody is blamed, saying it early is safe",{col:LP.green,size:28});
      oo_sheet(x,tt,w("account","accountable",-0.2),560,90,800,{kick:"Accountable",title:"Giving an account",lines:["What happened, and how the next time goes better"]},
        {light:"late",u:ag_in(tt,w("account","happened",-0.1),0.5)});}}
  ]);
  oo_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back at the Green Belt: trees still standing
    {at:0,place:"ooGreen",keys:[[0,960,560,1.04],[0.2,960,540,1.0]],d:3,draw:(x,tt)=>{
      OO_WOMEN.forEach((P,i)=>lp_person(x,P,[420,760,1100][i],[740,756,748][i],0.75,{t:tt,light:OO_OUT}));
      oo_pill(x,tt,w("back","trees",-0.1),null,960,190,"Trees still standing, months later",{col:LP.green});
      oo_tag(x,tt,w("back","planting",-0.2),null,960,280,"Not the planting",{align:"center",col:LP.mut});}},
    // and Ivy: true counts, judged in June 2029
    {at:c.ivy-0.3,place:"ooMorning",keys:[[c.ivy-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{lp_person(x,"ivy",1480,650,1.0,{t:tt,flip:true,light:mo});
      oo_pill(x,tt,w("ivy","true",-0.2),null,640,300,"True counts, not a job that ran",{col:LP.green});
      oo_tag(x,tt,w("ivy","June",-0.2),null,640,390,"June 2029: the timetable change, judged on them",{align:"center",col:LP.blue});}},
    // what to do on Monday
    {at:c.know-0.3,place:"ooMorning",later:true,keys:[[c.know-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        oo_sheet(x,tt,c.know+0.3,120,120,820,{kick:"One",title:"Know who uses it, and for which decision"},{light:"morning"});
        oo_sheet(x,tt,w("watch","Watch",-0.1),980,120,820,{kick:"Two",title:"Watch what it's for, not only that it ran"},{col:LP.green,light:"morning"});
        oo_sheet(x,tt,w("say","say",-0.1),120,440,820,{kick:"Three",title:"When it's wrong, say so first"},{col:LP.amber,light:"morning"});
        oo_sheet(x,tt,w("mend","Fix",-0.1),980,440,820,{kick:"Four",title:"Fix yours, raise the rest, mend the fit"},{col:LP.blue,light:"morning"});
        x.restore();}
      oo_tag(x,tt,w("next","Measure",-0.1),c.take-0.4,960,780,"Next: Measure the work, not the people",{align:"center",col:LP.ink});
      const ta=ag_in(tt,c.take,0.4)*(1-ag_in(tt,e0,0.8));
      if(ta>0.004){for(const [s,wd,px,col] of [["Own what it's for","Own",960-300,LP.green],["Not only what you did","only",960+300,LP.ink]])
        {const t0=w("take",wd,-0.1);lp_pill(x,px,470,s,{col,size:34,a:ta*ag_in(tt,t0,0.4),k:tt-t0});}}}}
  ]);
  lp_end(ctx,S,t,e0,"Owning the outcome",OO_LAST,"Film 1 of 4","Ownership and performance");
  oo_kick(ctx,S,1-ag_in(t,e0,0.8),{light:"morning"});
});
ag_cutInto(["owns","monday","fix"]);

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
