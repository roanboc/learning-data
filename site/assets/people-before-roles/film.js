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

// People before roles, the opening film of People first, the series that opens Leading data people. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years and dates in words, a standard's number,
// and words said aloud without their quotation marks). The few longer stops are in breath.js.
const NARR={
"bridge":{"name":"The bridge they went back to","lead":3.0,"tail":1.0,"vo":[
 {"id":"where","gap":0.8,"text":"High in the Andes of Peru, the Apurímac river runs through a deep gorge."},
 {"id":"rope","gap":0.8,"text":"Across it hangs a bridge made of grass, twisted by hand into cord: the keshwa chaca."},
 {"id":"incas","gap":0.8,"text":"By their own account, the people there have crossed on rope since the time of the Incas."},
 {"id":"only","gap":0.8,"text":"It was once the only way between the communities around it."},
 {"id":"wear","gap":0.8,"text":"Grass wears out, so the bridge has to be made new, by many hands."},
 {"id":"steel","gap":0.8,"text":"In 1968, a steel bridge is built, almost a hundred metres away.","say":"In nineteen sixty-eight, a steel bridge is built, almost a hundred metres away."},
 {"id":"need","gap":0.8,"text":"Now cars can cross the gorge with their loads, and few people need the rope."},
 {"id":"left","gap":0.8,"text":"A geographer who visits in 1970 finds it decaying: not raised, he writes, for a few years.","say":"A geographer who visits in nineteen seventy finds it decaying: not raised, he writes, for a few years."},
 {"id":"skill","gap":0.8,"text":"He expects the skill of making it to die with that generation."},
 {"id":"keeper","gap":0.8,"text":"In October 1972, one of the bridge's keepers tells two visitors what his people have decided.","say":"In October nineteen seventy-two, one of the bridge's keepers tells two visitors what his people have decided."},
 {"id":"sad","gap":0.8,"text":"\"My people feel sad about abandoning the keshwa chaca for a new steel bridge upstream.\"","say":"My people feel sad about abandoning the keshwa chaca, for a new steel bridge upstream."},
 {"id":"rebuild","gap":0.8,"text":"\"So we're going to rebuild it when the New Year comes.\"","say":"So we're going to rebuild it when the New Year comes."},
 {"id":"did","gap":0.8,"text":"When the new year came, they did. Asked years later, the people there name nobody from outside who pushed them to."},
 {"id":"all","gap":0.8,"text":"Before, one elder says, few came to help. \"Only now does everyone come.\"","say":"Before, one elder says, few came to help. Only now does everyone come."},
 {"id":"today","gap":0.8,"text":"Today, four communities make it new each June: about a thousand people, each family bringing its own cord."},
 {"id":"minka","gap":0.8,"text":"They do it as minka: unpaid work, shared for everyone's benefit."},
 {"id":"unesco","gap":0.8,"text":"The communities, UNESCO says, see it as strengthening their ties, and not simply as a way across."},
 {"id":"died","gap":0.8,"text":"One of the builders says it more plainly: \"If we stop preserving it, it would be like if we died.\"","say":"One of the builders says it more plainly: If we stop preserving it, it would be like if we died."},
 {"id":"turn","gap":0.8,"text":"A steel bridge could carry them across. It couldn't bring them together."},
 {"id":"data","gap":0.8,"text":"A data team can be read both ways too: as roles on a chart, or as the people in them."},
 {"id":"plan","gap":0.8,"text":"Plan from the chart alone, and you plan for boxes. Know the people first, and the plan can fit them."}
]},
"chart":{"name":"A chart and a list","lead":1.0,"tail":1.0,"vo":[
 {"id":"mon","gap":0.8,"text":"Monday 1 February 2027, a year from now, at the university.","say":"Monday the first of February, twenty twenty-seven, a year from now, at the university."},
 {"id":"helena","gap":0.8,"text":"Helena Novak starts as its data manager. Two sheets wait on her desk."},
 {"id":"two","gap":0.8,"text":"A chart of her team: seven boxes, with a role in each. And a list of forty-six open requests."},
 {"id":"tempt","gap":0.8,"text":"From those two sheets, she could plan everyone's work by lunch."},
 {"id":"sort","gap":0.8,"text":"She does sort the list that day, as Every area, one job shows. But she changes nobody's work."},
 {"id":"boxes","gap":0.8,"text":"A chart shows who reports to whom. It doesn't show who is in the boxes."},
 {"id":"iso","gap":0.8,"text":"There's even a standard for putting people first, ISO 27500: value your people, and count their differences as a strength.","say":"There's even a standard for putting people first, eye-so twenty-seven five hundred: value your people, and count their differences as a strength."},
 {"id":"before","gap":0.8,"text":"So before she plans anyone's work, she sits down with each of the seven."}
]},
"seven":{"name":"Four questions, seven people","lead":1.0,"tail":1.0,"vo":[
 {"id":"hour","gap":0.8,"text":"One at a time, from Monday to Thursday, where each of them works, for about an hour."},
 {"id":"four","gap":0.8,"text":"She asks each the same four questions, about them at work."},
 {"id":"q12","gap":0.8,"text":"What are you proud of here? What would you like more of?"},
 {"id":"q34","gap":0.8,"text":"What gets in your way? And what should I know, to work well with you?"},
 {"id":"never","gap":0.8,"text":"She never asks about health, family, or anything a person doesn't offer."},
 {"id":"noor","gap":0.8,"text":"Noor Rahman, the data architect, is proud of her map of the university's data. She'd like more people to argue with it."},
 {"id":"sam","gap":0.8,"text":"Sam Okafor runs the data platform. He's proud of each morning the data is simply there, and nobody has to ask."},
 {"id":"jun","gap":0.8,"text":"Jun Park, the analytics engineer, is proudest when someone stops asking him, because now they know."},
 {"id":"yusuf","gap":0.8,"text":"Yusuf Demir leads data governance. Ask me at the start, he says, and I can say yes more often."},
 {"id":"marta","gap":0.8,"text":"Marta Silva, the analyst, would like to hear what became of a number after she sends it."},
 {"id":"erin","gap":0.8,"text":"Erin Walsh, the platform engineer, started the same week as Marta. They still have lunch on Thursdays."},
 {"id":"tomas","gap":0.8,"text":"Tomás Ortega, the report developer, can tell you who reads each report, and what they do with it."},
 {"id":"none","gap":0.8,"text":"None of it is on the chart."}
]},
"turn":{"name":"Who they turn to","lead":1.0,"tail":1.0,"vo":[
 {"id":"hears","gap":0.8,"text":"In those hours, Helena hears one name again and again."},
 {"id":"ask","gap":0.8,"text":"Stuck on a number, Marta asks Jun. So does Erin, about a model."},
 {"id":"show","gap":0.8,"text":"Noor shows him her map before anyone else. Sam shows him a load that looks odd."},
 {"id":"box","gap":0.8,"text":"On the chart, Jun is one box of seven. Its one line goes up, to Helena."},
 {"id":"shows","gap":0.8,"text":"A chart shows who manages. It doesn't show who people turn to."},
 {"id":"ubuntu","gap":0.8,"text":"Ubuntu, the idea behind The team comes first, says a person is a person through other people."},
 {"id":"shared","gap":0.8,"text":"Researchers call it shared leadership: people in a team leading one another, whoever holds the title."},
 {"id":"review","gap":0.8,"text":"Across forty-two samples, teams that share the leading do better, most of all in how they work together."},
 {"id":"title","gap":0.8,"text":"Leading doesn't need a title. Anyone can lead from where they are."},
 {"id":"room","gap":0.8,"text":"Helena doesn't move Jun's box. She asks if he wants this, and makes room: in March, he'll be the one beside a newcomer."}
]},
"friday":{"name":"What won't change yet","lead":1.0,"tail":1.0,"vo":[
 {"id":"fri","gap":0.8,"text":"On Friday 5 February, Helena brings all seven together in the team's room.","say":"On Friday the fifth of February, Helena brings all seven together in the team's room."},
 {"id":"fear","gap":0.8,"text":"A new manager is a change, and people fear the changes they can't see."},
 {"id":"stays","gap":0.8,"text":"So she says what she can promise: who does what stays as it is this month."},
 {"id":"notall","gap":0.8,"text":"She doesn't promise that nothing will change: only what stays, and for how long."},
 {"id":"keeper","gap":0.8,"text":"At the gorge, four years after the steel bridge came, a keeper said what his people would keep."},
 {"id":"week","gap":0.8,"text":"Helena says it in her first week."},
 {"id":"knows","gap":0.8,"text":"She has planned nobody's work yet. But she knows seven people, and they know what to expect from her."}
]},
"monday":{"name":"On Monday","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"At the gorge, steel could do the carrying. What people went back for was each other, and the work they share."},
 {"id":"same","gap":0.8,"text":"A chart and a list can carry a team's work. They can't tell you who is here."},
 {"id":"m1","gap":0.8,"text":"On Monday, before you plan anyone's work, sit down with each person."},
 {"id":"m2","gap":0.8,"text":"Ask about them at work: what they're proud of, and what gets in their way."},
 {"id":"m3","gap":0.8,"text":"Notice who people turn to, whatever the chart says, and make room for it."},
 {"id":"m4","gap":0.8,"text":"And say early what won't change yet."},
 {"id":"next","gap":0.8,"text":"Wellbeing is in the work, the next film, asks the next question: what do they need?"},
 {"id":"take","gap":0.8,"text":"Know the people before you plan the work."}
]}
};

const VODUR={"bridge/where": 4.351, "bridge/rope": 5.27, "bridge/incas": 4.466, "bridge/only": 3.101, "bridge/wear": 3.751, "bridge/steel": 4.607, "bridge/need": 4.034, "bridge/left": 6.471, "bridge/skill": 3.261, "bridge/keeper": 6.361, "bridge/sad": 4.895, "bridge/rebuild": 2.455, "bridge/did": 6.512, "bridge/all": 4.347, "bridge/today": 6.371, "bridge/minka": 3.927, "bridge/unesco": 5.765, "bridge/died": 5.259, "bridge/turn": 3.615, "bridge/data": 5.297, "bridge/plan": 5.872, "chart/mon": 5.163, "chart/helena": 4.557, "chart/two": 6.023, "chart/tempt": 3.326, "chart/sort": 5.686, "chart/boxes": 4.184, "chart/iso": 8.277, "chart/before": 3.894, "seven/hour": 4.293, "seven/four": 3.24, "seven/q12": 2.365, "seven/q34": 3.168, "seven/never": 4.202, "seven/noor": 7.279, "seven/sam": 7.37, "seven/jun": 6.071, "seven/yusuf": 6.102, "seven/marta": 5.056, "seven/erin": 6.075, "seven/tomas": 5.811, "seven/none": 1.398, "turn/hears": 3.029, "turn/ask": 3.862, "turn/show": 4.651, "turn/box": 4.826, "turn/shows": 3.681, "turn/ubuntu": 5.59, "turn/shared": 5.59, "turn/review": 5.939, "turn/title": 3.503, "turn/room": 7.298, "friday/fri": 4.654, "friday/fear": 4.135, "friday/stays": 3.955, "friday/notall": 4.511, "friday/keeper": 5.068, "friday/week": 1.817, "friday/knows": 5.593, "monday/back": 5.874, "monday/same": 4.096, "monday/m1": 3.933, "monday/m2": 3.68, "monday/m3": 4.164, "monday/m4": 1.859, "monday/next": 4.577, "monday/take": 1.872};

const BREATH={
"bridge":{"hold":{"where":1.0,"rope":0.8,"incas":0.6,"only":0.8,"wear":1.0,"steel":1.0,"need":0.8,"left":1.0,"skill":1.4,"keeper":0.6,"sad":0.8,"rebuild":1.4,"did":1.0,"all":1.2,"today":1.0,"minka":0.8,"unesco":0.8,"died":1.6,"turn":1.4,"data":0.8},"breathe":5.4},
"chart":{"hold":{"mon":0.8,"helena":1.0,"two":1.2,"tempt":1.0,"sort":1.0,"boxes":1.4,"iso":1.2}},
"seven":{"hold":{"hour":1.2,"four":0.8,"q12":0.8,"q34":1.0,"never":1.6,"noor":1.6,"sam":1.6,"jun":1.6,"yusuf":1.6,"marta":1.6,"erin":1.6,"tomas":1.6},"breathe":1.6},
"turn":{"hold":{"hears":0.8,"ask":1.0,"show":1.2,"box":1.2,"shows":1.6,"ubuntu":1.2,"shared":1.0,"review":1.2,"title":1.4}},
"friday":{"hold":{"fri":1.0,"fear":1.0,"stays":1.4,"notall":1.2,"keeper":1.4,"week":1.0},"breathe":4.8},
"monday":{"hold":{"back":1.4,"same":1.2,"m1":0.8,"m2":0.8,"m3":0.8,"m4":1.2,"next":1.0},"breathe":5.0}
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

/* ===== The rope bridge of Q'eswachaka: the gorge, the bridge and the people, drawn once for the films of People first that show it =====
   This film's copy (prefix pb_) of the drawing the series' films share, in the module's matte, sunlit language, lit from the right
   as its rooms are. Each film that shows the bridge keeps its own copy in its own source, every name under its own prefix; nothing
   here goes into the kit. It is a drawing, not a likeness:
   the gorge is narrower and shallower than the real one, and nobody drawn is a real person. Nothing is borrowed from the communities'
   own patterns or crafts: the clothes are plain cloth in colours that mean nothing in these films, and nothing sacred is drawn.

   The wide view (1920 x 1080): we look along the gorge from a little above the bridge. The river runs towards us; the bridge crosses
   from the left bank to the right; behind its middle the gorge bends away, so the far wall is dark behind the straw-coloured rope.
     AG_PLACES.pbGorge, pbGorgeGrey      the gorge with no bridge at all: both banks, a stone base on each, flat ground beside each base
                                          where a line of people can stand (PB_BANK), the river and the foot of both walls low in the
                                          frame, above the caption band; by a dry June sun, or under a grey sky (one room: AG_ROOMS)
     AG_PLACES.pbBank, pbBankGrey        the left bank at people's height, for half-figures: flat ground, the gorge's far rim behind
   See pb_bridge.js for the bridge (drawn live, so it can be built, wear, sag and fall) and pb_people.js for the people. */

const PB_K={sky0:[112,152,198],sky1:[220,228,226],cloud:[252,252,248],peak:[156,168,186],peakSh:[130,142,164],snow:[242,244,244],
  hill:[206,182,124],hillSh:[166,142,100],hillFar:[200,190,158],ichu:[230,208,146],ichuMid:[198,170,108],ichuDk:[136,112,72],
  earth:[186,160,126],earthDk:[144,118,90],path:[212,192,158],
  rock:[112,106,106],rockLit:[164,154,144],rockSh:[72,70,80],rockDeep:[36,36,46],rose:[162,124,106],lichen:[150,150,124],
  river:[60,96,98],riverFar:[112,142,142],riverDk:[34,60,68],foam:[232,238,234],
  stone:[184,174,158],stoneLit:[212,202,184],stoneSh:[120,112,106],joint:[66,58,56],
  straw:[226,200,128],strawOld:[158,144,122],strawDead:[124,116,106],stick:[122,98,72],
  steel:[126,134,142],shade:[32,38,62]};
// the place's light: the sky, how warm the sun is, how dark the shadow the right bank throws into the gorge, a veil of grey over all
const PB_LIGHT={sun:{sky0:PB_K.sky0,sky1:PB_K.sky1,glow:0.42,cast:0.46,warm:1,veil:0},
                grey:{sky0:[158,166,176],sky1:[208,212,214],glow:0,cast:0.14,warm:0,veil:0.2}};

/* ---------------------------------------------------------------- the gorge's lines
   One vanishing point; s is how near a thing is (1 at the bridge, larger towards us, PB_G.s0 at the bend). The rim of each bank and
   the foot of each wall run towards it; side is -1 for the left bank, 1 for the right. Each wall is a row of ribs of rock: at each
   step along it (V) the rock stands out towards the river a little more or less (B), and its rim sits a little higher or lower (T).
   Near the bridge the rim keeps still, so the stone bases stand where the ropes start. */
const PB_G={vp:[960,150],rim:296,foot:700,half:460,halfFoot:318,s0:0.56,s1:2.8};
const pb_wob=(v,k)=>Math.sin(v*9.1+k*2.3)*0.55+Math.sin(v*23.7+k*5.1)*0.3+Math.sin(v*51+k)*0.15;
const pb_calm=s=>1-Math.exp(-Math.pow((s-1)/0.1,2));
const pb_meander=s=>52*Math.sin(s*3.6+0.9)*clamp((s-0.5)*1.4,0,1);
const PB_WALLS={};
function pb_wall(side){if(PB_WALLS[side])return PB_WALLS[side];const G=PB_G,R=ag_rnd(side<0?377:811),V=[G.s0];let s=G.s0;
  while(s<G.s1){s*=1.03+0.07*R();if(Math.abs(s-1)<0.035)s=1;V.push(Math.min(s,G.s1));}
  const B=[],T=[],rim=[],foot=[];let b=20;
  V.forEach((v,i)=>{b=b*0.55+(R()-0.5)*44;if(R()<0.34)b+=(R()<0.5?-1:1)*(28+R()*44);const k=pb_calm(v),bend=clamp(1-(v-G.s0)/0.2,0,1);B.push(clamp(b,-64,84)*k+(side<0?10-70*bend:-6+150*bend*bend));T.push((R()-0.5)*20*k);
    rim.push([G.vp[0]+side*(G.half-B[i]*0.4*k)*v,G.vp[1]+(G.rim+T[i])*v]);foot.push([G.vp[0]+side*(G.halfFoot-B[i])*v+pb_meander(v)*v,G.vp[1]+G.foot*v]);});
  return PB_WALLS[side]={V,B,T,rim,foot};}
function pb_along(side,s,key){const Wl=pb_wall(side),V=Wl.V;let i=1;while(i<V.length-1&&s>V[i])i++;const u=clamp((s-V[i-1])/((V[i]-V[i-1])||1),0,1),a=Wl[key][i-1],b=Wl[key][i];return[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];}
const pb_rimPt=(side,s)=>pb_along(side,s,"rim"),pb_footPt=(side,s)=>pb_along(side,s,"foot");
function pb_wallPt(side,s,f){const a=pb_rimPt(side,s),b=pb_footPt(side,s);return[lerp(a[0],b[0],f),lerp(a[1],b[1],f)];}
function pb_farPt(u,f){const G=PB_G,a=pb_rimPt(-1,G.s0),b=pb_rimPt(1,G.s0),c=pb_footPt(-1,G.s0),d=pb_footPt(1,G.s0);
  const far=Math.sin(Math.PI*clamp(u,0,1));
  return[lerp(lerp(a[0],b[0],u),lerp(c[0],d[0],u),f)+7*pb_wob(u*1.3+f,5)*f*(1-f)*4,lerp(lerp(a[1],b[1],u)+6*pb_wob(u*0.9,3)-16*far,lerp(c[1],d[1],u)+4*Math.sin(u*7)-34*far,f)];}
// the skyline: the left hill, the land beyond the bend, the right hill; and a nearer shoulder of each hill, behind each end of the bridge
const PB_SKYLINE=[[0,112],[150,100],[320,126],[480,170],[640,208],[780,232],[900,244],[1040,242],[1180,226],[1340,198],[1500,160],[1680,120],[1800,104],[1920,92]];
function pb_line(P,x){let i=1;while(i<P.length-1&&x>P[i][0])i++;const a=P[i-1],b=P[i],u=clamp((x-a[0])/(b[0]-a[0]),0,1);return lerp(a[1],b[1],u*u*(3-2*u));}
const pb_skyline=x=>pb_line(PB_SKYLINE,x)+3*Math.sin(x/37)+2*Math.sin(x/71+1);
// flat ground beside each stone base, along the line of the bridge: where a line of people stands (their feet at y, from x0 to x1)
const PB_BANK={L:{y:457,x0:40,x1:400},R:{y:461,x0:1520,x1:1880}};
// how big a thing on the land is drawn, by how far down the frame it stands (1 at the bridge)
const pb_near=y=>y>446?(y-150)/296:lerp(1,0.42,clamp((446-y)/330,0,1));

/* ---------------------------------------------------------------- small things */
function pb_blob(c,x,y,rx,ry,col,a){if(a<=0.004||rx<=0)return;c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);
  g.addColorStop(0,rgba(col,a));g.addColorStop(0.6,rgba(col,a*0.45));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(-rx,-rx,2*rx,2*rx);c.restore();}
function pb_poly(c,P){c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();}
// a tussock of ichu, the tough grass of the puna: a few blades fanning up from a dark foot, the ones towards the sun lighter
function pb_tuft(c,x,y,s,R,o){o=o||{};const n=o.n||4,h=(o.h||9)*s;c.fillStyle=rgba(PB_K.ichuDk,0.3);c.beginPath();c.ellipse(x,y+0.6*s,3.6*s,1.3*s,0,0,TAU);c.fill();
  c.lineCap="round";for(let b=0;b<n;b++){const an=-Math.PI/2+(b-(n-1)/2)*0.34+(R()-0.5)*0.3,l=h*(0.7+R()*0.5),ex=x+Math.cos(an)*l+(o.droop?0:0),ey=y+Math.sin(an)*l;
    c.strokeStyle=rgba(b>=n/2?(R()<0.6?PB_K.ichu:PB_K.ichuMid):(R()<0.5?PB_K.ichuMid:PB_K.ichuDk),o.a==null?0.9:o.a);c.lineWidth=Math.max(0.8,1.3*s);
    c.beginPath();c.moveTo(x+(b-(n-1)/2)*1.1*s,y);c.quadraticCurveTo(x+Math.cos(an)*l*0.5,y+Math.sin(an)*l*0.7,ex+(o.droop?Math.sign(Math.cos(an))*l*0.25:0),ey+(o.droop?l*0.35:0));c.stroke();}}
// a boulder: a rounded mass, lit from the right, its shadow to the left
function pb_boulder(c,x,y,r,R,o){o=o||{};const col=o.col||PB_K.rock,k=[];for(let i=0;i<9;i++){const an=i/9*TAU,d=r*(0.78+R()*0.34);k.push([x+Math.cos(an)*d*1.25,y+Math.sin(an)*d*0.74]);}
  c.fillStyle=rgba(PB_K.rockDeep,0.28);c.beginPath();c.ellipse(x-r*0.5,y+r*0.62,r*1.3,r*0.26,0,0,TAU);c.fill();
  const shape=cc=>{cc.moveTo((k[0][0]+k[8][0])/2,(k[0][1]+k[8][1])/2);for(let i=0;i<9;i++){const a=k[i],b=k[(i+1)%9];cc.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}cc.closePath();};
  ag_shape(c,shape);c.fillStyle=rgba(mix(col,PB_K.rockSh,0.35),1);c.fill();c.save();ag_shape(c,shape);c.clip();
  pb_blob(c,x+r*0.4,y-r*0.36,r*1.1,r*0.8,o.lit||PB_K.rockLit,o.litA==null?0.85:o.litA);c.restore();}

/* ---------------------------------------------------------------- the sky and the far land */
function pb_paintSky(c,L){const g=c.createLinearGradient(0,0,0,300);g.addColorStop(0,rgba(L.sky0,1));g.addColorStop(0.75,rgba(mix(L.sky0,L.sky1,0.85),1));g.addColorStop(1,rgba(L.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,360);
  if(L.glow>0)pb_blob(c,1500,-40,900,420,[255,238,200],L.glow);
  // thin clouds over the far range; a low lid of them under a grey sky
  const cl=L.warm?[[720,120,120],[840,96,90],[1160,70,110],[1290,92,80]]:[[300,60,360],[700,90,420],[1100,60,440],[1500,40,400],[900,150,360]];
  for(const [x,y,r] of cl){pb_blob(c,x,y,r,r*0.3,PB_K.cloud,L.warm?0.55:0.4);if(L.warm)pb_blob(c,x-r*0.2,y+r*0.12,r*0.8,r*0.16,[190,200,214],0.14);}
  // the far range: rock and a little snow, pale in the thin air
  const pk=[[540,250],[660,206],[760,180],[830,190],[900,158],[968,132],[1010,146],[1052,128],[1100,156],[1170,170],[1240,152],[1320,180],[1420,204],[1540,236]];
  const shape=cc=>{cc.moveTo(500,270);for(const p of pk)cc.lineTo(p[0],p[1]);cc.lineTo(1580,270);cc.closePath();};
  c.save();c.globalAlpha=L.warm?0.72:0.5;ag_shape(c,shape);c.fillStyle=rgba(PB_K.peak,1);c.fill();ag_shape(c,shape);c.clip();
  c.fillStyle=rgba(PB_K.peakSh,0.28);for(let i=0;i<pk.length-1;i+=2){c.beginPath();c.moveTo(pk[i][0],pk[i][1]+90);c.lineTo(pk[i+1][0],pk[i+1][1]);c.lineTo(pk[i+1][0]-56,pk[i+1][1]+110);c.closePath();c.fill();}
  c.fillStyle=rgba(PB_K.snow,0.85);for(const [x,y,w] of [[968,132,20],[1052,128,24],[900,158,12]]){c.beginPath();c.moveTo(x,y-1);c.lineTo(x+w,y+w*0.72);c.lineTo(x+w*0.3,y+w*0.5);c.lineTo(x-w*0.2,y+w*0.8);c.lineTo(x-w*0.8,y+w*0.6);c.closePath();c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- the land: the hills above the gorge and the top of each bank */
function pb_landPath(c){c.moveTo(-40,pb_skyline(0));for(let x=0;x<=W;x+=16)c.lineTo(x,pb_skyline(x));c.lineTo(W+40,pb_skyline(W));
  const A=pb_wall(-1).rim,B=pb_wall(1).rim;c.lineTo(W+40,B[B.length-1][1]);for(let i=B.length-1;i>=0;i--)c.lineTo(B[i][0],B[i][1]);
  for(let u=1;u>=-1e-6;u-=0.04){const p=pb_farPt(u,0);c.lineTo(p[0],p[1]);}A.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(-40,A[A.length-1][1]);c.closePath();}
function pb_paintLand(c,L){const R=ag_rnd(4127),K=PB_K;
  let g=c.createLinearGradient(0,90,0,780);g.addColorStop(0,rgba(mix(K.hillFar,K.hill,0.2),1));g.addColorStop(0.45,rgba(K.hill,1));g.addColorStop(1,rgba(mix(K.hill,K.earth,0.45),1));
  ag_shape(c,pb_landPath);c.fillStyle=g;c.fill();c.save();ag_shape(c,pb_landPath);c.clip();
  // the light: the left hill faces the sun, the right hill's slope turns from it a little
  if(L.warm){g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(255,240,196,0.16)");g.addColorStop(0.5,"rgba(255,240,196,0.04)");g.addColorStop(0.62,"rgba(64,54,70,0.08)");g.addColorStop(1,"rgba(64,54,70,0.22)");c.fillStyle=g;c.fillRect(0,0,W,H);}
  // the lie of the hills: broad soft shade in their hollows, light on their shoulders
  for(const [x,y,rx,ry,dark] of [[150,300,260,120,1],[420,250,200,90,0],[560,330,220,80,1],[90,180,200,70,0],[300,400,300,50,1],[760,290,200,46,1],[1160,286,200,44,0],[1380,330,240,80,1],[1560,250,220,90,0],[1760,330,280,120,1],[1840,170,200,70,0],[1620,410,300,50,1]]){
    if(dark)pb_blob(c,x,y,rx,ry,K.hillSh,0.34);else if(L.warm)pb_blob(c,x,y,rx,ry,[255,244,206],0.3);}
  // a nearer shoulder of each hill, behind each end of the bridge
  for(const [P,lx] of [[[[-40,330],[120,318],[260,340],[380,378],[470,412],[540,436],[540,470],[-40,470]],300],[[[1960,318],[1800,306],[1650,330],[1520,372],[1440,410],[1385,438],[1385,474],[1960,474]],1700]]){
    c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]+(i<6?3*Math.sin(p[0]/23):0)):c.moveTo(p[0],p[1]));c.closePath();g=c.createLinearGradient(0,300,0,470);g.addColorStop(0,rgba(mix(K.hill,K.ichu,0.35),1));g.addColorStop(1,rgba(mix(K.hill,K.earth,0.3),1));c.fillStyle=g;c.fill();
    c.strokeStyle=rgba(K.hillSh,0.3);c.lineWidth=2;c.beginPath();P.slice(0,6).forEach((p,i)=>i?c.lineTo(p[0],p[1]+3*Math.sin(p[0]/23)+2):c.moveTo(p[0],p[1]+2));c.stroke();}
  // the far land beyond the bend, paler
  pb_blob(c,960,270,330,60,K.hillFar,0.5);
  // ichu: a fine speckle far away, tussocks where the land is near enough to see them
  for(let k=0;k<2600;k++){const x=R()*W,y=lerp(pb_skyline(x)+3,400,R());c.fillStyle=rgba(R()<0.5?K.ichuDk:K.ichu,0.22+R()*0.2);c.fillRect(x,y,1.6,1.2+R()*1.8);}
  for(let k=0;k<3600;k++){const x=R()*W,y=lerp(330,800,Math.pow(R(),0.9)),s=pb_near(y);if(R()>clamp((y-300)/120,0.1,1))continue;if(Math.sin(x/61+y/37)+Math.sin(x/139-y/53)<-0.9)continue;pb_tuft(c,x,y,s*0.92,R,{n:s>0.9?4:3,h:8,a:lerp(0.5,0.92,clamp(s,0,1))});}
  // paths worn pale in the grass: one down each hill to its end of the bridge
  c.lineCap="round";c.lineJoin="round";
  for(const P of [[[200,330],[236,356],[214,384],[262,410],[250,432],[300,448]],[[1716,318],[1680,346],[1704,374],[1650,402],[1664,430],[1610,452]]]){
    for(const [col,w,a] of [[K.earthDk,5,0.22],[K.path,3,0.7]]){c.strokeStyle=rgba(col,a);c.lineWidth=w*0.8;c.beginPath();c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length-1;i++)c.quadraticCurveTo(P[i][0],P[i][1],(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2);c.lineTo(P[P.length-1][0],P[P.length-1][1]);c.stroke();}}
  // the flat ground beside each stone base, along the line of the bridge: packed earth, swept by many feet
  for(const [x0,x1,y] of [[-20,436,451],[1484,W+20,455]]){g=c.createLinearGradient(0,y-12,0,y+14);g.addColorStop(0,rgba(K.path,0));g.addColorStop(0.3,rgba(K.path,0.92));g.addColorStop(0.75,rgba(mix(K.path,K.earth,0.5),0.92));g.addColorStop(1,rgba(K.earth,0));
    c.fillStyle=g;c.fillRect(x0,y-12,x1-x0,26);c.fillStyle=rgba(K.earthDk,0.14);c.fillRect(x0,y-10,x1-x0,2);
    for(let k=0;k<70;k++){const x=lerp(x0,x1,R()),yy=y-8+R()*18;c.fillStyle=rgba(R()<0.5?K.earthDk:K.stoneLit,0.4);c.beginPath();c.ellipse(x,yy,1+R()*1.6,0.7+R(),0,0,TAU);c.fill();}
    for(let k=0;k<26;k++){const x=lerp(x0,x1,R());pb_tuft(c,x,y+15+R()*3,1.05,R,{n:4,h:9});pb_tuft(c,lerp(x0,x1,R()),y-10-R()*2,0.96,R,{n:3,h:7});}}
  // a few boulders in the grass
  for(let k=0;k<22;k++){const x=R()*W,y=lerp(pb_skyline(x)+20,740,R()),s=pb_near(y);if(Math.abs(y-453)<22)continue;pb_boulder(c,x,y,(5+R()*8)*s,R);pb_tuft(c,x-8*s,y+5*s,s,R);}
  c.restore();}

/* ---------------------------------------------------------------- the walls of the gorge and the river */
function pb_wallPath(c,side){const Wl=pb_wall(side);Wl.rim.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));for(let i=Wl.foot.length-1;i>=0;i--)c.lineTo(Wl.foot[i][0],Wl.foot[i][1]);c.closePath();}
function pb_farPath(c){for(let u=0;u<=1+1e-6;u+=0.04){const p=pb_farPt(u,0);u?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}for(let u=1;u>=-1e-6;u-=0.04){const p=pb_farPt(u,1);c.lineTo(p[0],p[1]);}c.closePath();}
function pb_riverPath(c){const A=pb_wall(-1).foot,B=pb_wall(1).foot;c.moveTo(A[0][0]-60,A[0][1]-50);A.forEach(p=>c.lineTo(p[0]-60,p[1]));for(let i=B.length-1;i>=0;i--)c.lineTo(B[i][0]+60,B[i][1]);c.lineTo(B[0][0]+60,B[0][1]-50);
  for(let u=1;u>=-1e-6;u-=0.05){const p=pb_farPt(u,1);c.lineTo(p[0],p[1]-6);}c.closePath();}
// a face of rock in ribs. N[i][j] is the point at step i along it and layer j down it; tone[i] how much light rib i takes (0 to 1);
// k[i] how big things are there. Dark volcanic rock: each rib a facet, lighter where it turns to the sun; broken ledges, each with a
// lit lip and a dark underside; shallow hollows under the overhangs; cracks; pale lichen and a rose-brown stain; ichu on the ledges
function pb_ribs(c,N,tone,k,seed,o){const R=ag_rnd(seed),K=PB_K,ni=N.length,nj=N[0].length,lit=o.lit,dark=o.dark,hi=o.hi;c.lineCap="round";c.lineJoin="round";
  for(let i=0;i<ni-1;i++){const t=tone[i],kk=k[i];
    for(let j=0;j<nj-1;j++){const f=j/(nj-1),col=mix(mix(dark,lit,clamp(t*(1-f*0.45)+(R()-0.5)*0.16,0,1)),K.rockDeep,f*0.16);
      pb_poly(c,[N[i][j],N[i+1][j],N[i+1][j+1],N[i][j+1]]);c.fillStyle=rgba(col,1);c.fill();c.strokeStyle=rgba(col,1);c.lineWidth=1;c.stroke();}}
  for(let i=0;i<ni-1;i++){const kk=k[i];
    // the edge between two ribs: dark where the nearer one stands out
    if(i>0){const d=tone[i]-tone[i-1],a=clamp(Math.abs(d)*1.5,0.08,0.6);if(R()<0.85)for(let j=0;j<nj-1;j++){if(R()<0.25)continue;const p=N[i][j],q=N[i][j+1];c.strokeStyle=rgba(K.rockDeep,a*(0.5+R()*0.5));c.lineWidth=(0.8+R()*2)*kk;
        c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo((p[0]+q[0])/2+(R()-0.5)*7*kk,(p[1]+q[1])/2,q[0],q[1]);c.stroke();
        if(hi>0){c.strokeStyle=rgba(K.rockLit,hi*0.5);c.lineWidth=Math.max(0.8,1.1*kk);c.beginPath();c.moveTo(p[0]+(d>0?1.8:-1.8)*kk,p[1]);c.lineTo(q[0]+(d>0?1.8:-1.8)*kk,q[1]);c.stroke();}}}
    // ledges, broken: never one line right along the wall
    for(let j=1;j<nj-1;j++){if(R()<0.42)continue;const p=N[i][j],q=N[i+1][j],w=(1.2+R()*2.6)*kk,u0=R()*0.3,u1=1-R()*0.3,a=[lerp(p[0],q[0],u0),lerp(p[1],q[1],u0)],b=[lerp(p[0],q[0],u1),lerp(p[1],q[1],u1)];
      c.strokeStyle=rgba(K.rockDeep,0.5);c.lineWidth=w;c.beginPath();c.moveTo(a[0],a[1]+w*0.7);c.lineTo(b[0],b[1]+w*0.7);c.stroke();
      c.strokeStyle=rgba(K.rockLit,hi);c.lineWidth=Math.max(0.8,1.1*kk);c.beginPath();c.moveTo(a[0],a[1]-0.6*kk);c.lineTo(b[0],b[1]-0.6*kk);c.stroke();
      if(R()<0.4)pb_tuft(c,lerp(a[0],b[0],R()),lerp(a[1],b[1],R())-kk,kk*0.8,R,{n:3,h:7,droop:true,a:0.8});}
    // fine cracks inside a rib
    for(let n=0;n<2;n++){if(R()<0.4)continue;const j=(R()*(nj-1))|0,u=0.2+R()*0.6,p=[lerp(N[i][j][0],N[i+1][j][0],u),lerp(N[i][j][1],N[i+1][j][1],u)],q=[lerp(N[i][j+1][0],N[i+1][j+1][0],u),lerp(N[i][j+1][1],N[i+1][j+1][1],u)];
      c.strokeStyle=rgba(K.rockDeep,0.22);c.lineWidth=Math.max(0.7,kk);c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(lerp(p[0],q[0],0.5)+(R()-0.5)*6*kk,lerp(p[1],q[1],0.5));c.lineTo(q[0],q[1]);c.stroke();}}
  // stains and lichen, soft and low in contrast, and the rock's own unevenness
  for(let n=0;n<26;n++){const i=(R()*(ni-1))|0,j=(R()*(nj-1))|0,p=N[i][j],r=(16+R()*34)*k[i],col=n%3===0?K.rose:n%3===1?K.lichen:(R()<0.5?K.rockDeep:K.rockLit);
    for(let q=0;q<4;q++)pb_blob(c,p[0]+(R()-0.5)*r*2,p[1]+R()*r*1.4,r*(0.5+R()*0.6),r*(0.4+R()*0.5),col,n%3===2?0.16:0.2);}}
function pb_paintFar(c,L){const G=PB_G,K=PB_K,R=ag_rnd(53),U=[0];let u=0;while(u<1){u+=0.05+R()*0.07;U.push(Math.min(1,u));}
  const F=[0,0.1,0.24,0.4,0.57,0.76,1],N=U.map((u,i)=>F.map((f,j)=>{const p=pb_farPt(u,f);return[p[0]+(j>0&&j<6?(R()-0.5)*8:0),p[1]+(j>0&&j<6?(R()-0.5)*6:0)];}));
  // the far wall turns away to the right, where the gorge bends: lit on the left, dark towards the cleft
  const tone=U.map((u,i)=>clamp(0.78-u*0.9+(R()-0.5)*0.34,0,1));
  c.save();ag_shape(c,pb_farPath);c.clip();pb_ribs(c,N,tone,U.map(()=>G.s0),53,{lit:mix(K.rock,K.rockLit,0.5),dark:mix(K.rockSh,K.rockDeep,0.2),hi:0.3});
  const a=pb_farPt(0.62,0),b=pb_farPt(1,0),g=c.createLinearGradient(a[0],0,b[0],0);g.addColorStop(0,rgba(K.rockDeep,0));g.addColorStop(1,rgba(K.rockDeep,0.7));c.fillStyle=g;c.fillRect(a[0],0,b[0]-a[0]+60,H);c.restore();}
function pb_paintRiver(c,L){const G=PB_G,K=PB_K,R=ag_rnd(977),mid=s=>G.vp[0]+pb_meander(s)*s,at=(m,s)=>[mid(s)+m*G.halfFoot*s,G.vp[1]+G.foot*s];
  // pale and far at the bend, dark and green near us
  ag_shape(c,pb_riverPath);let g=c.createLinearGradient(0,150+G.foot*G.s0-40,0,1080);g.addColorStop(0,rgba(K.riverFar,1));g.addColorStop(0.22,rgba(K.river,1));g.addColorStop(1,rgba(K.riverDk,1));c.fillStyle=g;c.fill();
  c.save();ag_shape(c,pb_riverPath);c.clip();c.lineCap="round";
  // deep water under the right wall, where its shadow lies; a paler shallow along the left
  for(let s=G.s0;s<1.6;s+=0.05){const p=at(0.7,s),q=at(-0.6,s);pb_blob(c,p[0],p[1],150*s,26*s,K.riverDk,0.4);pb_blob(c,q[0],q[1],120*s,18*s,K.riverFar,0.2);}
  // the flow: short soft streaks that follow the stream
  for(let n=0;n<70;n++){const m=(R()-0.5)*1.7,s0=lerp(G.s0,1.5,R()),s1=s0*(1.03+R()*0.07);c.strokeStyle=rgba(R()<0.7?K.riverFar:K.foam,0.1+R()*0.16);c.lineWidth=(1+R()*1.6)*s0;
    c.beginPath();for(let i=0;i<=4;i++){const p=at(m*(1+0.03*i),lerp(s0,s1,i/4));i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();}
  // rapids: the water white where it drops over a sill of rock, and round the boulders
  for(const [sr,m0,m1] of [[0.69,-0.5,0.3],[0.86,-0.1,0.72],[1.07,-0.7,0.1],[1.3,0.0,0.8]])for(let n=0;n<34;n++){const m=lerp(m0,m1,R()),p=at(m,sr*(1+R()*0.07));c.fillStyle=rgba(K.foam,0.25+R()*0.5);
      c.beginPath();c.ellipse(p[0],p[1],(4+R()*12)*sr,(1+R()*1.5)*sr,0,0,TAU);c.fill();}
  for(const [m,s,r] of [[-0.42,0.67,7],[0.3,0.84,9],[-0.12,0.88,8],[0.52,0.93,11],[-0.6,1.05,12],[0.1,1.1,9],[0.64,1.28,13],[-0.3,1.31,12],[0.36,1.4,14]]){const p=at(m,s);
    for(let q=0;q<6;q++){c.fillStyle=rgba(K.foam,0.36+R()*0.3);c.beginPath();c.ellipse(p[0]+(R()-0.5)*r*3.2*s,p[1]+r*s*(0.4+R()*1.4),(5+R()*9)*s,(1.2+R()*1.5)*s,0,0,TAU);c.fill();}
    pb_boulder(c,p[0],p[1],r*s,R,{litA:0.35});}
  c.restore();}
function pb_paintWalls(c,L){const G=PB_G,K=PB_K,F=[0,0.07,0.17,0.3,0.44,0.59,0.75,0.9,1];
  for(const side of [-1,1]){const R=ag_rnd(side<0?19:71),Wl=pb_wall(side),V=Wl.V;
    const N=V.map((v,i)=>F.map((f,j)=>{const a=Wl.rim[i],b=Wl.foot[i],in0=j>0&&j<F.length-1,ff=f+(in0?(R()-0.5)*0.05:0);
      // the wall leans out a little half-way down, more on some ribs than others
      return[lerp(a[0],b[0],ff)-side*(in0?Math.sin(Math.PI*f)*(8+R()*22)*v:0),lerp(a[1],b[1],ff)];}));
    // a rib is lit when it turns towards us and the sun: the left wall takes the sun, the right wall only the sky's light
    const tone=V.map((v,i)=>i<V.length-1?clamp((side<0?0.62:0.3)+(Wl.B[i]-Wl.B[i+1])/(side<0?70:150)+(R()-0.5)*0.2,0,1):0.5);
    c.save();ag_shape(c,cc=>pb_wallPath(cc,side));c.clip();
    pb_ribs(c,N,tone,V,side<0?19:71,side<0?{lit:mix(K.rockLit,[196,180,160],L.warm*0.3),dark:mix(K.rock,K.rockSh,0.4),hi:0.5}:{lit:mix(K.rock,K.rockLit,0.25),dark:mix(K.rockSh,K.rockDeep,0.25),hi:0.2});
    c.restore();
    // fans of fallen rock against the wall's foot
    for(const [s0,w,h] of side<0?[[0.78,0.1,0.2],[1.12,0.16,0.26],[1.56,0.2,0.22]]:[[0.72,0.08,0.16],[0.96,0.12,0.24],[1.34,0.2,0.3]]){const top=pb_wallPt(side,s0+w*0.45,1-h),a=pb_footPt(side,s0),b=pb_footPt(side,s0+w),col=side<0?mix(K.rockLit,K.rose,0.25):mix(K.rock,K.rockSh,0.5);
      c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(top[0],top[1]);c.quadraticCurveTo(lerp(top[0],a[0],0.6)+side*8*s0,lerp(top[1],a[1],0.5),a[0]-side*24*s0,a[1]+6*s0);c.lineTo(b[0]-side*30*s0,b[1]+8*s0);c.quadraticCurveTo(lerp(top[0],b[0],0.5),lerp(top[1],b[1],0.45),top[0],top[1]);c.fill();
      for(let n=0;n<46;n++){const u=R(),v2=Math.pow(R(),0.6),x=lerp(top[0],lerp(a[0],b[0],u)-side*20*s0,v2),y=lerp(top[1],lerp(a[1],b[1],u)+4*s0,v2);c.fillStyle=rgba(R()<0.5?K.rockDeep:K.rockLit,0.2+R()*0.25);c.beginPath();c.ellipse(x,y,(1.5+R()*3.5)*s0,(1+R()*2)*s0,0,0,TAU);c.fill();}}
    // broken rock at the wall's foot, in the water's edge
    for(let n=0;n<90;n++){const s=lerp(G.s0,1.7,R()),p=pb_footPt(side,s);pb_boulder(c,p[0]-side*(R()*30-6)*s,p[1]+(R()-0.3)*16*s,(3+R()*8)*s,R,{litA:side<0?0.5:0.25});}
    // ichu along the rim, some of it hanging over the edge
    for(let n=0;n<170;n++){const s=lerp(G.s0,G.s1,Math.pow(R(),0.8));if(Math.abs(s-1)<0.06)continue;const p=pb_rimPt(side,s);pb_tuft(c,p[0]+side*R()*8*s,p[1]+2*s,s*0.95,R,{n:4,h:9,droop:R()<0.5});}}}
// the shadow the right bank throws into the gorge: the right wall, the river, the far wall's lower part and the left wall below the line
// the sun reaches; then a little haze at the bend, so the far wall sits back
function pb_paintCast(c,L){const G=PB_G,K=PB_K;if(L.cast>0)for(const [df,a] of [[0,0.62],[0.03,0.38]]){c.beginPath();let i=0;
    for(let s=G.s1;s>=G.s0-1e-6;s-=0.02,i++){const p=pb_wallPt(-1,s,clamp(0.34+df+0.07*pb_wob(s*1.4,3)+0.12*(s-1),0.1,0.9));i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}
    for(let u=0;u<=1+1e-6;u+=0.05){const p=pb_farPt(u,0.42+df+0.05*Math.sin(u*9));c.lineTo(p[0],p[1]);}
    const Rm=pb_wall(1).rim;Rm.forEach(p=>c.lineTo(p[0],p[1]+1));c.lineTo(W+60,H+60);c.lineTo(-60,H+60);c.closePath();c.fillStyle=rgba(K.shade,L.cast*a);c.fill();}
  c.save();c.beginPath();pb_farPath(c);pb_riverPath(c);pb_wallPath(c,-1);pb_wallPath(c,1);c.clip();const p=pb_farPt(0.5,0.6);pb_blob(c,p[0],p[1],430,300,[190,204,218],L.warm?0.32:0.38);c.restore();}

/* ---------------------------------------------------------------- the stone bases, one on each bank
   Old dry stone: a platform at the rim with its wall running down the rock, and two short pillars at its edge. The four floor cables
   leave the platform between the pillars; each handrail leaves from a pillar; all are tied off behind (pb_bridge.js draws the ropes).
   Drawn for the left bank and mirrored for the right, whose face to the gorge is in shade. */
function pb_stones(c,P,col,R,rows,o){o=o||{};pb_poly(c,P);c.fillStyle=rgba(col,1);c.fill();c.save();pb_poly(c,P);c.clip();
  const x0=Math.min(...P.map(p=>p[0])),x1=Math.max(...P.map(p=>p[0])),y0=Math.min(...P.map(p=>p[1])),y1=Math.max(...P.map(p=>p[1])),rh=(y1-y0)/rows,sk=o.skew||0;
  for(let r=0;r<rows;r++){let x=x0-R()*10;while(x<x1){const w=9+R()*12,yy=y0+r*rh+sk*(x-x0);c.fillStyle=rgba(R()<0.5?PB_K.stoneLit:PB_K.stoneSh,0.1+R()*0.2);c.fillRect(x,yy-1,w,rh+2);
      c.fillStyle=rgba(PB_K.joint,0.34);c.fillRect(x+w-0.6,yy,1.2,rh);x+=w;}
    c.strokeStyle=rgba(PB_K.joint,0.38);c.lineWidth=1.1;c.beginPath();c.moveTo(x0,y0+(r+1)*rh);c.lineTo(x1,y0+(r+1)*rh+sk*(x1-x0));c.stroke();}
  c.restore();}
// the left base's shapes: a platform [top, front, the wall down the rock], and its two pillars [front, side, top]
const PB_BASE={top:[[404,446],[500,446],[516,430],[428,430]],front:[[404,446],[500,446],[500,466],[404,466]],down:[[500,446],[516,430],[516,506],[500,530]],
  near:[[[474,396],[500,396],[500,446],[474,446]],[[500,396],[508,388],[508,438],[500,446]],[[474,396],[500,396],[508,388],[482,388]]],
  far:[[[484,386],[508,386],[508,432],[484,432]],[[508,386],[516,378],[516,424],[508,432]],[[484,386],[508,386],[516,378],[492,378]]]};
function pb_paintBase(c,side,L){const K=PB_K,R=ag_rnd(side<0?61:67),lit=side<0&&L.warm,face=lit?K.stoneLit:mix(K.stoneSh,K.stone,L.warm?0.12:0.5),front=mix(K.stone,K.stoneSh,L.warm?0.22:0.2),B=PB_BASE;
  c.save();if(side>0){c.translate(W,4);c.scale(-1,1);}
  // its shadow on the ground, away from the sun
  pb_blob(c,side<0?410:500,468,70,9,K.rockDeep,0.3);
  const pillar=P=>{pb_stones(c,P[0],front,R,6);pb_stones(c,P[1],face,R,6);pb_poly(c,P[2]);c.fillStyle=rgba(K.stoneLit,1);c.fill();};
  pillar(B.far);
  pb_stones(c,B.down,face,R,9);pb_poly(c,B.top);c.fillStyle=rgba(mix(K.stoneLit,K.path,0.3),1);c.fill();pb_stones(c,B.front,front,R,3);
  c.strokeStyle=rgba(K.joint,0.3);c.lineWidth=1;c.beginPath();c.moveTo(404,446);c.lineTo(500,446);c.lineTo(516,430);c.stroke();
  pillar(B.near);
  c.restore();}

/* ---------------------------------------------------------------- the whole place */
function pb_paintGorge(c,o){o=o||{};const L=PB_LIGHT[o.light||"sun"];
  pb_paintSky(c,L);pb_paintLand(c,L);pb_paintRiver(c,L);pb_paintFar(c,L);pb_paintWalls(c,L);pb_paintCast(c,L);pb_paintBase(c,-1,L);pb_paintBase(c,1,L);
  if(L.veil>0){c.fillStyle=rgba([150,156,168],L.veil);c.fillRect(0,0,W,H);c.fillStyle=rgba([52,56,70],0.1);c.fillRect(0,0,W,H);}
  const g=c.createRadialGradient(W*0.5,H*0.44,H*0.42,W*0.5,H*0.44,W*0.8);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.24));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.pbGorge=c=>pb_paintGorge(c,{light:"sun"});
AG_PLACES.pbGorgeGrey=c=>pb_paintGorge(c,{light:"grey"});
AG_ROOMS.pbGorgeGrey="pbGorge";

/* ---------------------------------------------------------------- the left bank at people's height
   For half-figures: we stand on the flat ground by the bridge's left end and look across the gorge. The sky is behind their hats, the
   other bank's hill behind their faces, then the dark lip of the far wall, and the bank's own ground at the foot of the frame.
   People stand with the place's light, from the right: lp_person(..., {light: {wall: 0}}). */
function pb_paintBank(c,o){o=o||{};const L=PB_LIGHT[o.light||"sun"],K=PB_K,R=ag_rnd(2203);
  let g=c.createLinearGradient(0,0,0,520);g.addColorStop(0,rgba(L.sky0,1));g.addColorStop(0.8,rgba(mix(L.sky0,L.sky1,0.85),1));g.addColorStop(1,rgba(L.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,560);
  if(L.glow>0)pb_blob(c,1640,-60,1100,520,[255,238,200],L.glow);
  for(const [x,y,r] of L.warm?[[380,150,220],[620,110,150],[1240,190,200]]:[[300,100,460],[900,160,520],[1500,90,480]]){pb_blob(c,x,y,r,r*0.28,K.cloud,L.warm?0.5:0.4);}
  // the far range, low over the other bank
  const pk=[[-20,470],[120,410],[230,372],[310,388],[400,340],[470,310],[520,332],[590,300],[650,338],[760,372],[900,352],[1010,392],[1150,420],[1300,452],[1420,470]];
  c.save();c.globalAlpha=L.warm?0.7:0.5;c.fillStyle=rgba(K.peak,1);c.beginPath();c.moveTo(-20,520);for(const p of pk)c.lineTo(p[0],p[1]);c.lineTo(1420,520);c.closePath();c.fill();
  c.fillStyle=rgba(K.snow,0.85);for(const [x,y,w] of [[470,310,26],[590,300,30],[400,340,16]]){c.beginPath();c.moveTo(x,y-1);c.lineTo(x+w,y+w*0.7);c.lineTo(x+w*0.3,y+w*0.5);c.lineTo(x-w*0.2,y+w*0.8);c.lineTo(x-w*0.8,y+w*0.6);c.closePath();c.fill();}c.restore();
  // the other bank: its hill, pale with the distance across the gorge, and paths worn in it
  const top=x=>468+34*Math.sin(x/410+0.6)+12*Math.sin(x/173+2)-(x-960)*0.04;
  c.beginPath();c.moveTo(-20,720);for(let x=-20;x<=W+20;x+=20)c.lineTo(x,top(x));c.lineTo(W+20,720);c.closePath();g=c.createLinearGradient(0,440,0,700);g.addColorStop(0,rgba(mix(K.hill,K.hillFar,0.55),1));g.addColorStop(1,rgba(K.hill,1));c.fillStyle=g;c.fill();
  for(const [x,y,rx,ry,d] of [[260,560,320,70,1],[760,540,260,60,0],[1220,570,300,70,1],[1700,540,300,70,0]])pb_blob(c,x,y,rx,ry,d?K.hillSh:[255,244,206],d?0.3:(L.warm?0.26:0));
  for(let k=0;k<1500;k++){const x=R()*W,y=lerp(top(x)+4,668,R());c.fillStyle=rgba(R()<0.5?K.ichuDk:K.ichu,0.2+R()*0.2);c.fillRect(x,y,2,1.4+R()*2.4);}
  // the far wall's lip: dark rock in the right bank's own shade, ichu hanging over it
  const lip=x=>664+7*Math.sin(x/97)+5*Math.sin(x/41+1);
  c.beginPath();c.moveTo(-20,lip(-20));for(let x=-20;x<=W+20;x+=16)c.lineTo(x,lip(x));c.lineTo(W+20,790);c.lineTo(-20,790);c.closePath();g=c.createLinearGradient(0,660,0,790);g.addColorStop(0,rgba(mix(K.rock,K.rockSh,0.5),1));g.addColorStop(1,rgba(K.rockDeep,1));c.fillStyle=g;c.fill();
  for(let k=0;k<70;k++){const x=R()*W,y=lip(x)+6+R()*90;c.strokeStyle=rgba(K.rockDeep,0.3+R()*0.3);c.lineWidth=1.5+R()*3;c.beginPath();c.moveTo(x,y);c.lineTo(x+(R()-0.5)*14,y+20+R()*50);c.stroke();
    if(k%3===0){c.strokeStyle=rgba(K.rockLit,0.22);c.lineWidth=2;c.beginPath();c.moveTo(x-30,y);c.lineTo(x+30+R()*40,y+(R()-0.5)*6);c.stroke();}}
  for(let k=0;k<150;k++){const x=R()*W;pb_tuft(c,x,lip(x)+3,1.5,R,{n:4,h:9,droop:R()<0.5});}
  // our bank: flat ground, packed earth where people stand, tall ichu at its edge and in the corners of the frame
  const edge=x=>772+8*Math.sin(x/143+2)+4*Math.sin(x/57);
  c.beginPath();c.moveTo(-20,edge(-20));for(let x=-20;x<=W+20;x+=16)c.lineTo(x,edge(x));c.lineTo(W+20,H);c.lineTo(-20,H);c.closePath();g=c.createLinearGradient(0,770,0,H);g.addColorStop(0,rgba(mix(K.path,K.hill,0.4),1));g.addColorStop(1,rgba(mix(K.earth,K.earthDk,0.4),1));c.fillStyle=g;c.fill();
  if(L.warm){g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(64,54,70,0.14)");g.addColorStop(1,"rgba(255,236,196,0.14)");c.fillStyle=g;c.fillRect(0,770,W,H-770);}
  for(let k=0;k<420;k++){const x=R()*W,y=edge(x)+8+R()*(H-edge(x));c.fillStyle=rgba(R()<0.5?K.earthDk:K.stoneLit,0.3+R()*0.3);c.beginPath();c.ellipse(x,y,1.5+R()*3,1+R()*2,0,0,TAU);c.fill();}
  for(let k=0;k<260;k++){const x=R()*W,y=edge(x)+2+Math.pow(R(),2.2)*300,near=(y-770)/310,side=Math.abs(x-960)/960;if(near>0.25&&side<0.62&&R()<0.85)continue;pb_tuft(c,x,y,2.4+near*3.4,R,{n:5,h:10});}
  if(L.veil>0){c.fillStyle=rgba([150,156,168],L.veil);c.fillRect(0,0,W,H);c.fillStyle=rgba([52,56,70],0.1);c.fillRect(0,0,W,H);}
  g=c.createRadialGradient(W*0.5,H*0.44,H*0.42,W*0.5,H*0.44,W*0.8);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.24));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.pbBank=c=>pb_paintBank(c,{light:"sun"});
AG_PLACES.pbBankGrey=c=>pb_paintBank(c,{light:"grey"});
AG_ROOMS.pbBankGrey="pbBank";

/* ===== The rope bridge itself, drawn live over the gorge (pb_place.js), so it can be built, wear, sag and fall =====
   Six cables, as the sources have them: four for the floor, each a braid of three ropes, and two handrails, each of two ropes twisted;
   the sides, cords that tie each handrail to the floor; rods laid across the floor cables and a mat unrolled on top. Each part is
   drawn on its own, by how far it has come (0 to 1).
     PB_A, pb_anchor(id, side)     where each cable leaves each stone base: id "f0" to "f3" (the floor, f0 nearest us) or "r0", "r1" (the
                                   handrails, r0 nearest us); side 0 the left bank, 1 the right
     pb_sag(age)                   how far the bridge hangs at its middle, in px: about 52 new, about 94 a year on
     pb_at(id, u, o)               the point on a cable, u from 0 (left base) to 1 (right base); o.age, o.sag (px, or {id: px}), o.extra
                                   ({id: px} more, so one handrail can hang lower than the other)
     pb_deck(u, o), pb_tilt(u, o)  where feet stand on the floor at u, and the floor's slope there (radians)
     pb_hang(a, b, sag, n)         the points of any rope hanging between two points
     pb_rope(ctx, P, w, o)         a grass rope along the points P, w px thick, its twist showing: o.age (0 new, straw; 1 a year on,
                                   grey-brown; more, past its year), o.braid (a braid's chevrons, for a cable), o.col, o.a.
                                   The same look at every size: a cord (w 2 to 4 in the wide view, 9 or so held in a hand), a rope, a cable
     pb_cable(ctx, id, o)          one cable: o.p how far it has been carried across (0 to 1), o.from the bank it starts on (0 or 1),
                                   o.end where its free end is now (else it lies along its own curve) with o.slack its sag on the way,
                                   o.age, o.sag, o.tied false to leave off the turns round the stone
     pb_bridge(ctx, o)             the bridge: o.f [four] and o.r [two] how far each cable has come (or one number for all), o.from,
                                   o.ties [from the left, from the right] how far the sides are tied on from each bank (the two meet
                                   when they add up to 1), o.floor the same for the rods and o.mat for the mat, o.age, o.sag, o.extra,
                                   o.wear (0 to 1: rods gone from the floor, the mat in holes), o.a; o.part "back" or "front" to draw
                                   what is behind or in front of someone on the floor, or o.mid(ctx) to draw them in between
     pb_fallen(ctx, o)             last year's bridge, cut loose, lying in the river below
     pb_steel(ctx, o)              the steel bridge upstream, small and far, for the film that needs it */

const PB_A={f0:[[504,442],[1416,446]],f3:[[512,434],[1408,438]],r0:[[504,410],[1416,414]],r1:[[512,402],[1408,406]]};
PB_A.f1=[0,1].map(i=>[lerp(PB_A.f0[i][0],PB_A.f3[i][0],1/3),lerp(PB_A.f0[i][1],PB_A.f3[i][1],1/3)]);
PB_A.f2=[0,1].map(i=>[lerp(PB_A.f0[i][0],PB_A.f3[i][0],2/3),lerp(PB_A.f0[i][1],PB_A.f3[i][1],2/3)]);
const PB_CABLES=["f0","f1","f2","f3","r0","r1"];
const pb_anchor=(id,side)=>PB_A[id][side];
const pb_sag=age=>52+46*(1-Math.exp(-3*Math.max(0,age||0)))+10*Math.max(0,(age||0)-1);
// new rope is the colour of straw; a year of sun and rain turns it grey-brown, though less than it loosens it
function pb_straw(age){age=age||0;return age<=1?mix(PB_K.straw,PB_K.strawOld,clamp(age,0,1)):mix(PB_K.strawOld,PB_K.strawDead,clamp(age-1,0,1));}
function pb_sagOf(id,o){o=o||{};const s=o.sag==null?pb_sag(o.age):typeof o.sag==="number"?o.sag:(o.sag[id]==null?pb_sag(o.age):o.sag[id]);return s+((o.extra&&o.extra[id])||0);}
function pb_at(id,u,o){const a=PB_A[id][0],b=PB_A[id][1];return[lerp(a[0],b[0],u),lerp(a[1],b[1],u)+4*pb_sagOf(id,o)*u*(1-u)];}
function pb_deck(u,o){const a=pb_at("f1",u,o),b=pb_at("f2",u,o);return[(a[0]+b[0])/2,(a[1]+b[1])/2];}
function pb_tilt(u,o){const a=pb_deck(Math.max(0,u-0.01),o),b=pb_deck(Math.min(1,u+0.01),o);return Math.atan2(b[1]-a[1],b[0]-a[0]);}
function pb_hang(a,b,sag,n){n=n||24;const P=[];for(let i=0;i<=n;i++){const u=i/n;P.push([lerp(a[0],b[0],u),lerp(a[1],b[1],u)+4*sag*u*(1-u)]);}return P;}
function pb_span(id,u0,u1,o,n){n=n||Math.max(4,Math.round(Math.abs(u1-u0)*48));const P=[];for(let i=0;i<=n;i++)P.push(pb_at(id,lerp(u0,u1,i/n),o));return P;}
const pb_hash=(i,k)=>{const v=Math.sin(i*127.1+(k||0)*311.7)*43758.5453;return v-Math.floor(v);};

/* ---------------------------------------------------------------- a rope of twisted grass */
function pb_rope(ctx,P,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||P.length<2||w<=0)return;const col=o.col||pb_straw(o.age),dk=ag_dk(col,0.42),lt=ag_lt(col,0.42),
    m=ctx.getTransform(),k=Math.hypot(m.a,m.b)||1,px=w*k;
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap=o.cap||"round";ctx.lineJoin="round";
  const path=(dx,dy)=>{ctx.beginPath();ctx.moveTo(P[0][0]+dx,P[0][1]+dy);for(let i=1;i<P.length;i++)ctx.lineTo(P[i][0]+dx,P[i][1]+dy);};
  if(px>=9){// seen close: the strands themselves, each a lobe of twisted grass lying over the last (two rows of them in a braid)
    path(0,0);ctx.strokeStyle=rgba(dk,1);ctx.lineWidth=w*0.8;ctx.stroke();
    const sp=w*(o.braid?0.4:0.56),stray=[];let acc=0,n=0;
    for(let i=1;i<P.length;i++){const ax=P[i-1][0],ay=P[i-1][1],dx=P[i][0]-ax,dy=P[i][1]-ay,d=Math.hypot(dx,dy)||1,tx=dx/d,ty=dy/d,nx=-ty,ny=tx,an=Math.atan2(dy,dx);
      while(acc<=d){const sd=o.braid?(n%2?1:-1):0,x=ax+tx*acc+nx*sd*w*0.17,y=ay+ty*acc+ny*sd*w*0.17,rot=an+(o.braid?sd*-0.62:0.95),rx=w*(o.braid?0.5:0.56),ry=w*(o.braid?0.27:0.27);
        ctx.fillStyle=rgba(dk,0.9);ctx.beginPath();ctx.ellipse(x+w*0.03,y+w*0.05,rx,ry,rot,0,TAU);ctx.fill();
        ctx.fillStyle=rgba(mix(col,dk,pb_hash(n,2)*0.18),1);ctx.beginPath();ctx.ellipse(x,y,rx*0.94,ry*0.84,rot,0,TAU);ctx.fill();
        ctx.fillStyle=rgba(lt,0.5);ctx.beginPath();ctx.ellipse(x+w*0.04,y-w*0.07,rx*0.6,ry*0.3,rot,0,TAU);ctx.fill();
        // the grass's own lines along the strand, and a loose end now and then
        ctx.strokeStyle=rgba(dk,0.3);ctx.lineWidth=Math.max(0.7/k,w*0.022);ctx.beginPath();ctx.moveTo(x-Math.cos(rot)*rx*0.7,y-Math.sin(rot)*rx*0.7);ctx.lineTo(x+Math.cos(rot)*rx*0.7,y+Math.sin(rot)*rx*0.7);ctx.stroke();
        if(pb_hash(n,3)<0.3){const s2=pb_hash(n,5)<0.5?-1:1,l=w*(0.2+pb_hash(n,7)*0.3);stray.push([x+nx*w*0.42*s2,y+ny*w*0.42*s2,x+nx*(w*0.42+l*0.7)*s2+tx*l,y+ny*(w*0.42+l*0.7)*s2+ty*l]);}
        acc+=sp;n++;}
      acc-=d;}
    ctx.strokeStyle=rgba(lt,0.85);ctx.lineWidth=Math.max(1/k,w*0.045);ctx.beginPath();for(const q of stray){ctx.moveTo(q[0],q[1]);ctx.lineTo(q[2],q[3]);}ctx.stroke();ctx.restore();return;}
  // its shaded side, its body, the light along its top
  path(0,0);ctx.strokeStyle=rgba(dk,1);ctx.lineWidth=w;ctx.stroke();
  path(w*0.05,-w*0.11);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=w*0.74;ctx.stroke();
  if(px>=2.2){path(w*0.1,-w*0.25);ctx.strokeStyle=rgba(lt,0.75);ctx.lineWidth=w*0.2;ctx.stroke();}
  // the twist: slanted grooves across it (a braid's chevrons for a cable)
  if(px>=3){const sp=Math.max(w*(o.braid?0.92:0.78),3/k),h=w*0.42,sl=w*0.34;let acc=sp*0.5;ctx.strokeStyle=rgba(dk,o.braid?0.62:0.55);ctx.lineWidth=Math.max(0.8/k,w*0.1);ctx.beginPath();
    for(let i=1;i<P.length;i++){const ax=P[i-1][0],ay=P[i-1][1],dx=P[i][0]-ax,dy=P[i][1]-ay,d=Math.hypot(dx,dy)||1,tx=dx/d,ty=dy/d,nx=-ty,ny=tx;
      while(acc<=d){const x=ax+tx*acc,y=ay+ty*acc;
        if(o.braid){ctx.moveTo(x-tx*sl+nx*h,y-ty*sl+ny*h);ctx.lineTo(x+tx*sl,y+ty*sl);ctx.lineTo(x-tx*sl-nx*h,y-ty*sl-ny*h);}
        else{ctx.moveTo(x-tx*sl+nx*h,y-ty*sl+ny*h);ctx.lineTo(x+tx*sl-nx*h,y+ty*sl-ny*h);}
        acc+=sp;}
      acc-=d;}
    ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the cables, tied off behind the stone bases */
// a point of the left base, or its mirror on the right bank
const pb_bp=(side,x,y)=>side?[W-x,y+4]:[x,y];
function pb_tie(ctx,id,side,o,w){const A=PB_A[id][side],rail=id[0]==="r",dir=side?1:-1,q={age:o.age,a:o.a};
  if(rail){// turns round its pillar, and the end made fast
    const far=id==="r1",x0=far?500:474,x1=far?508:500;for(let n=0;n<3;n++){const y=(far?398:404)+n*5.2;pb_rope(ctx,[pb_bp(side,x0,y+0.6),pb_bp(side,x1,y),pb_bp(side,x1+8,y-8)],w*0.86,q);}}
  else{// across the top of the platform to the stone beam it is tied round
    const k=+id[1],ex=A[0]+dir*(62+k*4),ey=A[1]+2.5;pb_rope(ctx,[A,[A[0]+dir*30,A[1]+1],[ex,ey]],w,Object.assign({braid:true},q));
    for(let n=0;n<3;n++)pb_rope(ctx,[[ex+dir*n*3.6,ey-4.6],[ex+dir*n*3.6+dir,ey+4.4]],w*0.8,q);}}
function pb_cable(ctx,id,o){o=o||{};const p=o.p==null?1:clamp(o.p,0,1);if(p<=0.002)return null;const from=o.from?1:0,rail=id[0]==="r",w=o.w||(rail?4.6:5.6);let P;
  if(o.end)P=pb_hang(PB_A[id][from],o.end,o.slack==null?30:o.slack,28);else P=from?pb_span(id,1,1-p,o):pb_span(id,0,p,o);
  pb_rope(ctx,P,w,{age:o.age,a:o.a,braid:!rail});
  if(o.tied!==false){pb_tie(ctx,id,from,o,w);if(p>=0.999&&!o.end)pb_tie(ctx,id,1-from,o,w);}
  return P[P.length-1];}

/* ---------------------------------------------------------------- the sides, the floor */
// what is covered when work has come a from the left bank and b from the right: [[u0, u1], ...]
function pb_cover(ab){const a=clamp(ab[0],0,1),b=clamp(ab[1],0,1);if(a+b>=1)return[[0,1]];const out=[];if(a>0)out.push([0,a]);if(b>0)out.push([1-b,1]);return out;}
const pb_in=(cv,u)=>cv.some(r=>u>=r[0]-1e-6&&u<=r[1]+1e-6);
function pb_ties(ctx,rail,fl,ties,o){const cv=pb_cover(ties);if(!cv.length)return;const N=66,col=pb_straw(o.age),near=rail==="r0";ctx.save();ctx.lineCap="round";
  for(const [c2,lw,dx] of [[ag_dk(col,0.4),1.7,0],[near?ag_lt(col,0.1):ag_dk(col,0.12),0.9,0.4]]){ctx.strokeStyle=rgba(c2,near?1:0.85);ctx.lineWidth=lw;ctx.beginPath();
    for(let i=1;i<N;i++){const u=i/N;if(!pb_in(cv,u))continue;const a=pb_at(rail,u,o),b=pb_at(fl,u,o);ctx.moveTo(a[0]+dx,a[1]);ctx.lineTo(b[0]+dx,b[1]);
      // every other cord crosses to the next: the sides are a net, not a fence
      if(i%2&&pb_in(cv,(i+1)/N)){const b2=pb_at(fl,(i+1)/N,o);ctx.moveTo(a[0]+dx,a[1]);ctx.lineTo(b2[0]+dx,b2[1]);}}
    ctx.stroke();}
  ctx.restore();}
function pb_floor(ctx,o){const col=pb_straw(o.age),wear=clamp(o.wear||0,0,1),N=38,rods=pb_cover(o.floor==null?[1,1]:o.floor),mat=pb_cover(o.mat==null?(o.floor==null?[1,1]:o.floor):o.mat);ctx.save();ctx.lineCap="round";
  // rods of wood across the four cables, their ends standing out a little at each side
  ctx.strokeStyle=rgba(mix(PB_K.stick,PB_K.strawDead,clamp((o.age||0)*0.4,0,0.6)),1);ctx.lineWidth=1.7;ctx.beginPath();
  for(let i=1;i<N;i++){const u=i/N;if(!pb_in(rods,u)||pb_hash(i,11)<wear)continue;const a=pb_at("f0",u,o),b=pb_at("f3",u,o);ctx.moveTo(a[0]-2.4,a[1]+2.4);ctx.lineTo(b[0]+2.4,b[1]-2.4);}ctx.stroke();
  // the mat on top, in lengths; where it has worn through, the cables show
  const mc=mix(mix(col,[168,150,98],0.4),PB_K.strawDead,clamp((o.age||0)-0.6,0,0.6));
  for(let i=0;i<N;i++){const u0=i/N,u1=(i+1)/N;if(!pb_in(mat,u0)||!pb_in(mat,u1)||pb_hash(i,17)<wear*0.85)continue;const P=[pb_at("f0",u0,o),pb_at("f0",u1,o),pb_at("f3",u1,o),pb_at("f3",u0,o)];
    ctx.fillStyle=rgba(i%2?mc:ag_lt(mc,0.07),1);ctx.beginPath();ctx.moveTo(P[0][0]+1,P[0][1]-0.6);ctx.lineTo(P[1][0]+1.6,P[1][1]-0.6);ctx.lineTo(P[2][0]-0.4,P[2][1]+0.6);ctx.lineTo(P[3][0]-1,P[3][1]+0.6);ctx.closePath();ctx.fill();}
  ctx.restore();}
// the cords' loose ends, hanging under the near side of the floor
function pb_fringe(ctx,ties,o){const cv=pb_cover(ties);if(!cv.length)return;const N=132,col=pb_straw(o.age);ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba(ag_dk(col,0.2),0.9);ctx.lineWidth=1;ctx.beginPath();
  for(let i=1;i<N;i++){const u=i/N;if(!pb_in(cv,u)||pb_hash(i,23)<0.25)continue;const a=pb_at("f0",u,o),l=3+pb_hash(i,29)*8;ctx.moveTo(a[0],a[1]+2);ctx.lineTo(a[0]+(pb_hash(i,31)-0.5)*3,a[1]+2+l);}ctx.stroke();ctx.restore();}
function pb_bridge(ctx,o){o=o||{};const part=o.part||"all",a=o.a==null?1:o.a;if(a<=0.004)return;const fP=k=>o.f==null?1:typeof o.f==="number"?o.f:o.f[k],rP=k=>o.r==null?1:typeof o.r==="number"?o.r:o.r[k],
    ties=o.ties==null?[1,1]:o.ties,C=(id,p)=>pb_cable(ctx,id,Object.assign({},o,{p,end:null,a:1,w:null}));
  ctx.save();ctx.globalAlpha*=a;
  if(part!=="front"){C("r1",rP(1));pb_ties(ctx,"r1","f3",ties,o);C("f3",fP(3));C("f2",fP(2));C("f1",fP(1));pb_floor(ctx,o);}
  if(part==="all"&&o.mid)o.mid(ctx);
  if(part!=="back"){C("f0",fP(0));pb_fringe(ctx,ties,o);pb_ties(ctx,"r0","f0",ties,o);C("r0",rP(0));}
  ctx.restore();}

/* ---------------------------------------------------------------- last year's bridge in the river; the steel bridge upstream */
// cut loose once the new cables are tied, the old bridge falls and the river takes it: o.age its colour, o.k how far it has gone under
// and downstream (0 just fallen, 1 gone), o.a
function pb_fallen(ctx,o){o=o||{};const a=(o.a==null?1:o.a)*(1-clamp(o.k||0,0,1));if(a<=0.004)return;const age=o.age==null?1:o.age,k=clamp(o.k||0,0,1),dy=k*70,q={age,a:1};
  ctx.save();ctx.globalAlpha*=a;
  const A=[[668,806+dy],[760,842+dy],[880,826+dy],[1000,858+dy],[1120,836+dy],[1236,862+dy]];
  for(const [off,w,br] of [[0,5.4,true],[5,5,true],[-5,4.4,false],[9,4,false]]){const P=[];for(let i=0;i<A.length-1;i++)for(let j=0;j<8;j++){const u=j/8;P.push([lerp(A[i][0],A[i+1][0],u),lerp(A[i][1],A[i+1][1],u)+off+3*Math.sin((i*8+j)*0.9+off)]);}pb_rope(ctx,P,w,Object.assign({braid:br},q));}
  // the water breaking white over it
  for(let n=0;n<26;n++){ctx.fillStyle=rgba(PB_K.foam,0.3+pb_hash(n,41)*0.4);ctx.beginPath();ctx.ellipse(lerp(690,1220,pb_hash(n,43)),836+dy+pb_hash(n,47)*34,6+pb_hash(n,53)*12,1.6+pb_hash(n,59)*1.6,0,0,TAU);ctx.fill();}
  ctx.restore();}
// a plain truss of steel, far up the gorge at the bend: o.a
function pb_steel(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const x0=742,x1=1150,y=338,h=17;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="butt";
  ctx.strokeStyle=rgba(mix(PB_K.steel,[190,204,218],0.25),1);ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x0+12,y-h);ctx.lineTo(x1-12,y-h);ctx.stroke();
  ctx.lineWidth=1.6;ctx.beginPath();const n=12,dx=(x1-x0)/n;for(let i=0;i<n;i++){const xa=x0+i*dx,xb=xa+dx;ctx.moveTo(xa,y);ctx.lineTo(xa+dx/2,y-h);ctx.lineTo(xb,y);}ctx.stroke();
  ctx.fillStyle=rgba(mix(PB_K.stoneSh,[190,204,218],0.25),1);ctx.fillRect(x0-10,y,16,20);ctx.fillRect(x1-6,y,16,20);ctx.restore();}

/* ===== The people of the four communities =====
   Dressed from the sources' photographs and words, in plain colours that mean nothing in these films: men in a felt hat or a knitted
   cap with ear flaps, a wool jacket and dark trousers; women in a felt hat, a jacket, a full skirt and two long braids. No pattern is
   invented and none is copied; nobody drawn is a likeness of a real person.
     pb_fig(ctx, x, y, h, o)     a small whole person for the wide view, seen from the side: (x, y) where the feet stand (or where they
                                 sit), h their height in px (about 50 at the bridge). o.who a number (one of PB_FOLK, round and round)
                                 or a spec like those; o.pose "stand", "walk", "haul" (leaning back on a rope), "sit" (on the ground,
                                 hands at work in the lap), "astride" (sitting on the floor cables, a leg down each side), "carry"
                                 (walking with a load on the shoulder), "bend" (stooping to tie); o.t for the walk's step; o.flip to
                                 face left; o.shadow (0.3; 0 for none); o.a. Returns {hand, hand2, head, sh} in the picture's own
                                 px: where the hands, the head and the shoulder are, to tie a rope or a load to
     PB_PEOPLE                   half-figures for lp_person: two bridge builders, two more men, three women
     pb_hat(col, band), pb_cap(col), pb_capHat(cap, hat, band)   what they wear on their heads, inside the head's picture
     pb_braid(col)               a woman's near braid, over her shoulder (painted with her body, so it never parts from her head)
     pb_coil(ctx, x, y, r, o)    a coil of thin grass cord, for a hand to hold */

const PB_FOLK=[
  {k:"man",hat:"felt",hatC:[226,212,184],band:[112,84,66],top:[228,218,196],legs:[62,58,62],skin:[172,120,88]},
  {k:"woman",hat:"felt",hatC:[212,196,166],band:[96,62,54],top:[156,64,56],skirt:[96,74,84],legs:[70,58,54],skin:[178,126,94]},
  {k:"man",hat:"cap",hatC:[150,66,56],top:[128,100,78],legs:[70,66,70],skin:[160,110,80]},
  {k:"woman",hat:"felt",hatC:[136,104,80],band:[226,214,190],top:[72,68,74],skirt:[142,60,54],legs:[70,58,54],skin:[168,116,86]},
  {k:"man",hat:"felt",hatC:[146,116,90],band:[70,56,50],top:[196,184,164],legs:[86,74,64],skin:[182,130,96]},
  {k:"woman",hat:"felt",hatC:[228,216,190],band:[146,62,56],top:[226,214,190],skirt:[104,70,76],legs:[70,58,54],skin:[174,122,90]},
  {k:"man",hat:"cap",hatC:[112,70,62],top:[226,216,196],legs:[58,56,62],skin:[166,114,84]},
  {k:"woman",hat:"felt",hatC:[196,176,146],band:[70,58,54],top:[128,82,72],skirt:[112,88,76],legs:[70,58,54],skin:[184,132,98]}];
// a limb: from a to b, w0 wide at a and w1 at b, its ends round
function pb_limb(c,a,b,w0,w1,col){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,an=Math.atan2(dy,dx);
  c.fillStyle=col;c.beginPath();c.moveTo(a[0]+nx*w0/2,a[1]+ny*w0/2);c.lineTo(b[0]+nx*w1/2,b[1]+ny*w1/2);c.arc(b[0],b[1],w1/2,an+Math.PI/2,an-Math.PI/2,true);
  c.lineTo(a[0]-nx*w0/2,a[1]-ny*w0/2);c.arc(a[0],a[1],w0/2,an-Math.PI/2,an-Math.PI*1.5,true);c.closePath();c.fill();}
// the poses, as angles in degrees from straight down, towards the way they face: lean (the body), near and far leg [thigh, shin],
// near and far arm [upper, fore]; hip where the hips are above the feet (or the seat)
function pb_pose(name,t,woman){const s=Math.sin(t*5.4),c=Math.cos(t*5.4);
  if(name==="walk"||name==="carry")return{lean:4,hip:48-1.2*Math.abs(c),near:[24*s,24*s-13*Math.max(0,c)-6],far:[-24*s,-24*s-13*Math.max(0,-c)-6],
    armN:name==="carry"?[24,158]:[-18*s,-18*s+12],armF:[18*s,18*s+12]};
  if(name==="haul")return{lean:-17,hip:44,near:[34,20],far:[-6,-34],armN:[58,84],armF:[50,80]};
  if(name==="sit")return woman?{lean:5,hip:8,seat:true,near:null,far:null,armN:[30,84],armF:[24,80]}:{lean:8,hip:5,near:[112,50],far:[104,44],armN:[36,88],armF:[28,84]};
  if(name==="astride")return{lean:14,hip:1,near:[12,-4],far:null,armN:[44,74],armF:[36,70]};
  if(name==="bend")return{lean:52,hip:40,near:[30,-22],far:[14,-34],armN:[20,26],armF:[8,18]};
  return{lean:0,hip:49.5,near:[3,2],far:[-4,-2],armN:[3,8],armF:[-3,5]};}
function pb_fig(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;
  const F=typeof o.who==="object"&&o.who?o.who:PB_FOLK[((((o.who||0)%PB_FOLK.length)+PB_FOLK.length)%PB_FOLK.length)],woman=F.k==="woman",u=h/100,fl=o.flip?-1:1,
    P=pb_pose(o.pose||"stand",o.t||0,woman),rad=d=>d*Math.PI/180,dir=d=>[Math.sin(rad(d)),Math.cos(rad(d))],up=[Math.sin(rad(P.lean)),-Math.cos(rad(P.lean))],
    hip=[0,-P.hip],sh=[hip[0]+up[0]*29,hip[1]+up[1]*29],hd=[sh[0]+up[0]*9.6+1.2,sh[1]+up[1]*9.6],sun=fl,
    leg=A=>{if(!A)return null;const k=[hip[0]+dir(A[0])[0]*24,hip[1]+dir(A[0])[1]*24];return[k,[k[0]+dir(A[1])[0]*24,k[1]+dir(A[1])[1]*24]];},
    arm=A=>{const e=[sh[0]+dir(A[0])[0]*15,sh[1]+2+dir(A[0])[1]*15];return[e,[e[0]+dir(A[1])[0]*14,e[1]+dir(A[1])[1]*14]];},
    LN=leg(P.near),LF=leg(P.far),AN=arm(P.armN),AF=arm(P.armF),topC=F.top,topD=ag_dk(topC,0.22),lg=F.legs,lgD=ag_dk(lg,0.25),skin=F.skin;
  ctx.save();ctx.globalAlpha*=a;
  if(o.shadow!==0)ag_floorShadow(ctx,x-h*0.16,y+(P.seat||o.pose==="sit"?0:1),h*(o.pose==="sit"?0.34:0.26),h*0.05,o.shadow==null?0.3:o.shadow);
  ctx.translate(x,y);ctx.scale(fl*u,u);
  const shoe=q=>{ctx.fillStyle=rgba([52,44,40],1);ctx.beginPath();ctx.ellipse(q[0]+2,q[1]+1.2,4.4,2.1,0,0,TAU);ctx.fill();};
  // the far arm and the far leg
  pb_limb(ctx,[sh[0],sh[1]+2],AF[0],5.4,4.6,rgba(topD,1));pb_limb(ctx,AF[0],AF[1],4.6,3.8,rgba(topD,1));ctx.fillStyle=rgba(ag_dk(skin,0.12),1);ctx.beginPath();ctx.arc(AF[1][0]+dir(P.armF[1])[0]*1.6,AF[1][1]+dir(P.armF[1])[1]*1.6,2.3,0,TAU);ctx.fill();
  if(LF){pb_limb(ctx,hip,LF[0],7.6,6,rgba(lgD,1));pb_limb(ctx,LF[0],LF[1],6,4.4,rgba(lgD,1));shoe(LF[1]);}
  if(LN){pb_limb(ctx,hip,LN[0],8,6.2,rgba(lg,1));pb_limb(ctx,LN[0],LN[1],6.2,4.6,rgba(lg,1));shoe(LN[1]);}
  // a woman's full skirt, to below the knee; sitting, it spreads on the ground round her
  if(woman){const sk=F.skirt,skL=ag_lt(sk,0.16);
    if(P.seat){ctx.fillStyle=rgba(sk,1);ctx.beginPath();ctx.moveTo(-17,0);ctx.bezierCurveTo(-17,-15,-6,-19,4,-18);ctx.bezierCurveTo(16,-17,29,-10,31,0);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba(skL,0.6);ctx.beginPath();ctx.moveTo(6,-17);ctx.bezierCurveTo(16,-16,27,-9,29,0);ctx.lineTo(14,0);ctx.bezierCurveTo(13,-7,10,-13,6,-17);ctx.fill();}
    else if(LN){const sw=o.pose==="walk"||o.pose==="carry"?3*Math.sin((o.t||0)*5.4):0,hy=-19,wx=[hip[0]-7,hip[0]+7],lean=up[0]*-8;
      ctx.fillStyle=rgba(sk,1);ctx.beginPath();ctx.moveTo(wx[0],hip[1]-4);ctx.bezierCurveTo(wx[0]-5,hip[1]+10,-15+lean+sw,hy-10,-16+lean+sw,hy);ctx.quadraticCurveTo(lean+sw,hy+3.4,16+lean+sw,hy);
      ctx.bezierCurveTo(15+lean+sw,hy-10,wx[1]+5,hip[1]+10,wx[1],hip[1]-4);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba(skL,0.55);ctx.beginPath();ctx.moveTo(wx[1]-2,hip[1]-3);ctx.bezierCurveTo(wx[1]+4,hip[1]+10,14+lean+sw,hy-10,15+lean+sw,hy);ctx.lineTo(6+lean+sw,hy+1.6);ctx.bezierCurveTo(6+lean,hy-12,wx[1]-1,hip[1]+8,wx[1]-2,hip[1]-3);ctx.fill();}}
  // the body, lighter on the side towards the sun
  pb_limb(ctx,[hip[0],hip[1]+1],sh,13,15,rgba(topC,1));pb_limb(ctx,[hip[0]+2.4*sun*fl,hip[1]],[sh[0]+2.6*sun*fl,sh[1]+1],6,7,rgba(ag_lt(topC,0.22),0.7));
  // the neck and the head
  pb_limb(ctx,sh,[hd[0]-0.6,hd[1]+2],4.6,4.2,rgba(ag_dk(skin,0.1),1));
  ctx.fillStyle=rgba([34,26,24],1);ctx.beginPath();ctx.ellipse(hd[0]-1.3,hd[1]-0.4,5.9,6.7,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(hd[0]+1.5,hd[1]+0.7,4.7,5.9,0,0,TAU);ctx.fill();
  // a woman's braids, down her back
  if(woman){const b0=[hd[0]-5.4,hd[1]+3],b1=[sh[0]-8.4-up[0]*9,sh[1]+17];for(const dx of [0,1.9]){ctx.strokeStyle=rgba([30,24,22],1);ctx.lineWidth=1.7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(b0[0]+dx,b0[1]);ctx.quadraticCurveTo(sh[0]-9.4+dx,sh[1]+3,b1[0]+dx,b1[1]+dx*0.6);ctx.stroke();}}
  // the hat: felt with a brim and a plain band, or a knitted cap with ear flaps and a point
  if(F.hat==="cap"){const hc=F.hatC;ctx.fillStyle=rgba(hc,1);ctx.beginPath();ctx.moveTo(hd[0]-6.6,hd[1]-0.6);ctx.bezierCurveTo(hd[0]-7,hd[1]-8.6,hd[0]-2,hd[1]-10.4,hd[0]+0.4,hd[1]-13);ctx.bezierCurveTo(hd[0]+3,hd[1]-10,hd[0]+6.8,hd[1]-8,hd[0]+6.6,hd[1]-2.2);
    ctx.quadraticCurveTo(hd[0]+1,hd[1]-3.4,hd[0]-2.2,hd[1]-1.4);ctx.lineTo(hd[0]-3,hd[1]+6.4);ctx.quadraticCurveTo(hd[0]-6.4,hd[1]+4.4,hd[0]-6.6,hd[1]-0.6);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(ag_lt(hc,0.22),0.6);ctx.beginPath();ctx.ellipse(hd[0]+2.4*sun*fl,hd[1]-6.4,2.6,3.4,0,0,TAU);ctx.fill();}
  else{const hc=F.hatC,by=hd[1]-4.6;ctx.fillStyle=rgba(ag_dk(hc,0.16),1);ctx.beginPath();ctx.ellipse(hd[0]+0.5,by,10.2,2.4,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(hc,1);ctx.beginPath();ctx.moveTo(hd[0]-5.6,by-0.4);ctx.bezierCurveTo(hd[0]-5.8,by-7.6,hd[0]-3,by-8.6,hd[0]+0.4,by-8.6);ctx.bezierCurveTo(hd[0]+4,by-8.6,hd[0]+6.6,by-7.4,hd[0]+6.4,by-0.4);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(ag_lt(hc,0.25),0.7);ctx.beginPath();ctx.ellipse(hd[0]+0.5+2.6*sun*fl,by-0.5,5,1.2,0,0,TAU);ctx.fill();
    if(F.band){ctx.strokeStyle=rgba(F.band,1);ctx.lineWidth=1.5;ctx.lineCap="butt";ctx.beginPath();ctx.moveTo(hd[0]-5.6,by-1.5);ctx.lineTo(hd[0]+6.4,by-1.5);ctx.stroke();}}
  // the near arm, over the body
  pb_limb(ctx,[sh[0],sh[1]+2],AN[0],5.8,4.8,rgba(ag_dk(topC,0.08),1));pb_limb(ctx,AN[0],AN[1],4.8,4,rgba(ag_dk(topC,0.08),1));
  const hN=[AN[1][0]+dir(P.armN[1])[0]*1.8,AN[1][1]+dir(P.armN[1])[1]*1.8],hF=[AF[1][0]+dir(P.armF[1])[0]*1.6,AF[1][1]+dir(P.armF[1])[1]*1.6];
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.arc(hN[0],hN[1],2.4,0,TAU);ctx.fill();
  ctx.restore();
  const out=q=>[x+fl*u*q[0],y+u*q[1]];return{hand:out(hN),hand2:out(hF),head:out(hd),sh:out(sh),top:y+u*(hd[1]-14)};}

/* ---------------------------------------------------------------- half-figures, for lp_person
   Hats inside the head's picture (figure x 160 to 440, y 250 to 560). */
// a felt hat: a low rounded crown, a brim all round, a plain band
function pb_hat(col,band){return(c,P)=>{const crown=cc=>{cc.moveTo(208,352);cc.bezierCurveTo(200,296,238,262,300,262);cc.bezierCurveTo(360,262,396,296,390,350);cc.bezierCurveTo(350,366,250,368,208,352);cc.closePath();};
  // the brim's shade on the brow
  const g=c.createLinearGradient(0,356,0,392);g.addColorStop(0,"rgba(40,26,20,0.28)");g.addColorStop(1,"rgba(40,26,20,0)");c.fillStyle=g;c.beginPath();c.ellipse(318,372,82,22,0,0,TAU);c.fill();
  ag_soft(c,cc=>cc.ellipse(299,356,137,21,-0.035,0,TAU),ag_dk(col,0.12),ag_lt(col,0.3),372,348,120,rgba(ag_dk(col,0.7),0.4),10);
  ag_soft(c,crown,col,ag_lt(col,0.34),352,292,130,rgba(ag_dk(col,0.7),0.45),16);
  if(band){c.save();ag_shape(c,crown);c.clip();c.strokeStyle=rgba(band,1);c.lineWidth=15;c.beginPath();c.moveTo(200,346);c.bezierCurveTo(250,362,350,360,396,343);c.stroke();
    c.strokeStyle=rgba(ag_lt(band,0.3),0.5);c.lineWidth=2;c.beginPath();c.moveTo(300,345);c.quadraticCurveTo(350,343,392,335);c.stroke();c.restore();}
  // the brim's near edge, over the crown's foot
  c.strokeStyle=rgba(ag_lt(col,0.3),0.6);c.lineWidth=3;c.beginPath();c.ellipse(299,356,135,19,-0.035,0.25,Math.PI-0.25);c.stroke();};}
// a knitted cap with ear flaps, a point at its crown and a tie hanging from the flap: plain wool
function pb_cap(col){return(c,P)=>{const cap=cc=>{cc.moveTo(394,360);cc.bezierCurveTo(398,308,360,280,304,274);cc.bezierCurveTo(300,264,294,258,290,256);cc.bezierCurveTo(288,264,286,270,282,274);
      cc.bezierCurveTo(226,282,190,318,194,372);cc.bezierCurveTo(196,420,208,470,236,512);cc.bezierCurveTo(244,520,254,514,256,502);cc.bezierCurveTo(262,470,272,420,292,392);cc.bezierCurveTo(320,376,360,366,394,360);cc.closePath();};
  ag_soft(c,cap,col,ag_lt(col,0.3),346,300,130,rgba(ag_dk(col,0.7),0.5),14);
  // the knit's ribs, from the point down; the hem along the brow
  c.save();ag_shape(c,cap);c.clip();c.strokeStyle=rgba(ag_dk(col,0.5),0.26);c.lineWidth=2.4;c.lineCap="round";
  for(const [x1,y1] of [[214,400],[240,470],[250,350],[300,372],[340,360],[376,352],[392,340]]){c.beginPath();c.moveTo(290,262);c.quadraticCurveTo((290+x1)/2+(x1<290?-14:14),(262+y1)/2-20,x1,y1);c.stroke();}c.restore();
  c.strokeStyle=rgba(ag_dk(col,0.4),0.6);c.lineWidth=3;c.beginPath();c.moveTo(394,361);c.bezierCurveTo(360,367,320,377,292,393);c.stroke();
  // the tie
  ag_taper(c,[244,512],[242,526],[246,538],[242,552],4,2.4,rgba(ag_dk(col,0.2),1));};}
// the cap under the hat, as many of the men wear them
function pb_capHat(cap,hat,band){const a=pb_cap(cap),b=pb_hat(hat,band);return(c,P)=>{a(c,P);b(c,P);};}
// a woman's braid over her near shoulder: painted with her body, from behind her ear down her front (the head is drawn over its top)
function pb_braid(col){return(c,P)=>{const pts=[];for(let i=0;i<=22;i++){const u=i/22;pts.push([236-10*Math.sin(u*2.2)+4*u,470+u*330]);}
  c.save();c.lineCap="round";
  for(let i=0;i<pts.length-1;i++){const p=pts[i],q=pts[i+1],w=17-7*(i/pts.length);ag_soft(c,cc=>cc.ellipse((p[0]+q[0])/2+(i%2?3:-3),(p[1]+q[1])/2,w*0.56,10.5,i%2?0.5:-0.5,0,TAU),col,ag_lt(col,0.4),(p[0]+q[0])/2+5,(p[1]+q[1])/2-4,12,null);}
  const e=pts[pts.length-1];c.strokeStyle=rgba([150,62,54],1);c.lineWidth=5;c.beginPath();c.moveTo(e[0]-6,e[1]-2);c.lineTo(e[0]+6,e[1]-1);c.stroke();ag_taper(c,[e[0],e[1]],[e[0]-1,e[1]+10],[e[0]+2,e[1]+18],[e[0],e[1]+28],7,2,rgba(col,1));c.restore();};}
const PB_PEOPLE={
  builder:{name:"A bridge builder",key:"pb-builder1",skin:[160,108,78],hair:{style:"cropped",c:[30,24,22]},top:{kind:"overshirt",c:[226,216,194],inner:[148,118,92]},hat:{paint:pb_capHat([146,64,56],[222,208,180],[104,80,64])},breath:0.26},
  builder2:{name:"A bridge builder",key:"pb-builder2",skin:[172,120,88],hair:{style:"cropped",c:[60,54,52]},top:{kind:"sweater",c:[122,98,78]},hat:{paint:pb_cap([116,72,62])},breath:0.29},
  man:{name:"A man of Quehue",key:"pb-man1",skin:[166,114,84],hair:{style:"cropped",c:[28,22,20]},top:{kind:"overshirt",c:[196,184,164],inner:[92,84,80]},hat:{paint:pb_hat([150,120,92],[72,58,52])},breath:0.31},
  man2:{name:"A man of Quehue",key:"pb-man2",skin:[178,126,92],hair:{style:"cropped",c:[34,26,24]},top:{kind:"sweater",c:[86,80,84]},hat:{paint:pb_capHat([122,76,66],[226,214,190],[96,74,62])},breath:0.27},
  woman:{name:"A woman of Quehue",key:"pb-woman1",skin:[174,122,90],hair:{style:"cropped",c:[30,24,22]},earrings:[214,196,160],top:{kind:"cardigan",c:[154,64,56],inner:[232,224,208],paint:pb_braid([30,24,22])},hat:{paint:pb_hat([214,198,168],[98,64,56])},breath:0.3},
  woman2:{name:"A woman of Quehue",key:"pb-woman2",skin:[164,112,82],hair:{style:"cropped",c:[58,52,50]},top:{kind:"cardigan",c:[76,70,76],inner:[214,204,188],paint:pb_braid([58,52,50])},hat:{paint:pb_hat([140,108,84],[226,214,190])},breath:0.25},
  woman3:{name:"A woman of Quehue",key:"pb-woman3",skin:[184,132,98],hair:{style:"cropped",c:[26,22,20]},earrings:[214,196,160],top:{kind:"cardigan",c:[226,214,190],inner:[150,70,62],paint:pb_braid([26,22,20])},hat:{paint:pb_hat([230,218,192],[148,64,58])},breath:0.33}};

/* ---------------------------------------------------------------- a coil of cord, for a hand to hold */
// at (x, y), r across: turns of thin grass cord, one end hanging; o.age, o.n (turns), o.a
function pb_coil(ctx,x,y,r,o){o=o||{};const n=o.n||5,w=o.w||r*0.17;for(let i=0;i<n;i++){const rx=r*(1-i*0.05),ry=r*0.62*(1-i*0.04),P=[],ph=i*0.7;
    for(let k=0;k<=30;k++){const an=k/30*TAU+ph;P.push([x+Math.cos(an)*rx+i*r*0.03,y+Math.sin(an)*ry-i*r*0.07]);}pb_rope(ctx,P,w,{age:o.age,a:o.a});}
  pb_rope(ctx,pb_hang([x+r*0.7,y+r*0.3],[x+r*0.5,y+r*1.5],-r*0.1,8),w,{age:o.age,a:o.a});}

/* ===== People before roles: the university, February 2027 =====
   The film's own pictures for Helena's first week (prefix pb_). The module's kit draws the rooms, the people, the sheets and the things
   in them, and is never changed for this film; what is here is this film's alone:
     pbHelena, pbOffice, pbOfficeLate   Helena's room on her first morning; the team's office, where each of the seven works, by day
                                        and late in the afternoon (one room)
     pbTeam, pbTeamFri                  the team's room, by day and on Friday afternoon (one room)
     pbDesk                             Helena's desk seen from above, the window's light across it
     PB_MARTA, PB_ERIN, PB_TOMAS        the three of the seven the kit doesn't hold, as the module's numbers set them
     PB_SEVEN, PB_X7                    the seven, in the order of the chart's boxes, and where each stands in a row
     pb_chart(ctx, y, o)                the chart of seven boxes, a role in each, one line up from each: on the desk, or pinned to a wall
     pb_list(ctx, o)                    the list of 46 open requests, on the desk: unsorted, then sorted
     pb_week(ctx, x, y, w, o)           Helena's first week: five days, a dot for each conversation, a tick on Friday
     pb_arc(ctx, a, b, dip, u, o)       a pencil line from one point to another, with an arrow's head: who turns to whom
     pb_pencil(ctx, x, y, len, an)      the pencil on the desk
     pb_row(ctx, t, P, o)               people standing side by side, a first name over each
     pb_slivers(ctx)                    the two sheets lying on Helena's desk, seen from the front
     pb_truck(ctx, u)                   a small truck crossing the steel bridge
   Colour keeps the module's meaning: blue plans (the chart, its boxes and its lines), orange data (the list of requests, a count from
   a source), green what is done or kept, amber a risk or something waiting. A person is never a colour: the lines that say who
   turns to whom are pencil, and the dots of the week are ink. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.pbHelena=c=>lp_paintRoom(c,{light:"morning",seed:7});
AG_PLACES.pbOffice=c=>lp_paintRoom(c,{light:"day",seed:23});
AG_PLACES.pbOfficeLate=c=>lp_paintRoom(c,{light:"late",seed:23});
AG_ROOMS.pbOfficeLate="pbOffice";
AG_PLACES.pbTeam=c=>lp_paintRoom(c,{light:"day",seed:31,base:[222,206,190]});
AG_PLACES.pbTeamFri=c=>lp_paintRoom(c,{light:"late",seed:31,base:[222,206,190]});
AG_ROOMS.pbTeamFri="pbTeam";
// the desk from above: four boards of warm timber running across, the window's panes of light falling over them from the right
const PB_DESKSUN={x:560,w:1180,top:-60,h:860,slant:280,seed:9},PB_DESKCOL=[255,232,196];
AG_PLACES.pbDesk=c=>{const k=0.5,w=Math.ceil(W*k),h=Math.ceil(H*k),img=c.createImageData(w,h),d=img.data,B=LP.timber,bw=270;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const X=i/k,Y=j/k,pl=Math.floor(Y/bw),ly=Y-pl*bw;
    const gr=LP_NZ.fbm(X*0.0026+pl*9.1,Y*0.05+pl*3.7,4)-0.5,fig=LP_NZ.fbm(X*0.0011+pl*5.3,Y*0.011+pl*1.9,3)-0.5;
    let L=(pl%2?5:-4)+gr*20+fig*16;if(ly<2.6)L-=24;else if(ly<5)L-=7;
    const q=(j*w+i)*4;d[q]=B[0]+L;d[q+1]=B[1]+L*0.93;d[q+2]=B[2]+L*0.84;d[q+3]=255;}
  const cv=mkCanvas(w,h);cv.getContext("2d").putImageData(img,0,0);c.save();c.imageSmoothingQuality="high";c.drawImage(cv,0,0,w,h,0,0,W,H);c.restore();
  lp_grain(c,0,0,W,H,2,43);
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.3));g.addColorStop(0.45,rgba(LP.shade,0.1));g.addColorStop(1,rgba(LP.shade,0.02));c.fillStyle=g;c.fillRect(0,0,W,H);
  lp_sun(c,PB_DESKSUN,{a:0.8,col:PB_DESKCOL});
  g=c.createRadialGradient(W*0.55,H*0.45,H*0.4,W*0.55,H*0.45,W*0.8);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.3));c.fillStyle=g;c.fillRect(0,0,W,H);};
// a sheet lying on the desk: no pin, and the same sun on it as on the timber round it
function pb_paper(ctx,x,y,w,h,col){lp_sheet(ctx,x,y,w,h,{col,light:null,pin:false});
  lp_sun(ctx,PB_DESKSUN,{a:0.62,col:PB_DESKCOL,clip:c=>{c.beginPath();c.rect(x,y,w,h);c.clip();}});}

/* ---------------------------------------------------------------- the seven
   Marta, Erin and Tomás as the module's numbers set them (/mnt/project-files/leading-data-people/numbers.md), with keys of this
   film's own; Noor, Sam, Jun and Yusuf are the agent films' (AG_CAST), Helena the kit's. */
const PB_MARTA={name:"Marta Silva",role:"Data analyst",key:"pb-marta",skin:[156,108,80],hair:{style:"coily",c:[40,30,26]},earrings:[214,180,120],top:{kind:"cardigan",c:[168,150,126],inner:[70,66,70]},breath:0.3};
const PB_ERIN={name:"Erin Walsh",role:"Platform engineer",key:"pb-erin",skin:[232,196,170],hair:{style:"bun",c:[132,76,48]},earrings:[214,200,170],top:{kind:"sweater",c:[126,106,96]},breath:0.28};
const PB_TOMAS={name:"Tomás Ortega",role:"Report developer",key:"pb-tomas",skin:[198,150,114],hair:{style:"side",c:[46,36,30],streak:[120,108,100]},beard:[58,46,40],
  top:{kind:"cardigan",c:[112,100,88],inner:[226,222,214]},breath:0.27};
// in the order of the chart's boxes: Jun in the middle, the four who turn to him on either side, and Yusuf and Tomás, who read alike
// at this size, at the two ends
const PB_SEVEN=[
  {id:"yusuf",who:"yusuf",name:"Yusuf",box:["Data","governance","lead"]},
  {id:"noor",who:"noor",name:"Noor",box:["Data","architect"]},
  {id:"marta",who:PB_MARTA,name:"Marta",box:["Data","analyst"]},
  {id:"jun",who:"jun",name:"Jun",box:["Analytics","engineer"]},
  {id:"erin",who:PB_ERIN,name:"Erin",box:["Platform","engineer"]},
  {id:"sam",who:"sam",name:"Sam",box:["Data","platform"]},
  {id:"tomas",who:PB_TOMAS,name:"Tomás",box:["Report","developer"]}];
const PB_X7=[240,480,720,960,1200,1440,1680],PB_JUN=3,PB_TURN=[1,2,4,5];
PB_SEVEN.forEach((p,i)=>{p.ph=i*1.7;});const PB_HELENA_PH=11.9;
// people standing side by side: P [{who, x, flip, a, name, ph (their own moment in a breath, so a person breathes the same from shot
// to shot), lift (0 to 1: the name a little larger and higher, as the score plays it)}], drawn from the right so each one's shadow falls on the wall and not on a neighbour; o.s, o.y (where the neck meets the shoulders), o.light, o.names (0 to 1: the first names over their heads)
function pb_row(ctx,t,P,o){o=o||{};const s=o.s||0.5,y=o.y||830,lt=o.light||{light:"day"},na=o.names==null?1:o.names;
  for(let i=P.length-1;i>=0;i--){const p=P[i],a=p.a==null?1:p.a;if(a<=0.004)continue;lp_person(ctx,p.who,p.x,y,s,{t:t+(p.ph==null?i*1.7:p.ph),flip:!!p.flip,light:lt,a});}
  if(na>0.004)for(const p of P){const a=(p.a==null?1:p.a)*na,l=p.lift||0;if(a>0.004&&p.name)lp_T(ctx,p.name,p.x,y-s*310-22-5*l,{w:800,size:30*(1+0.18*l),align:"center",a});}}

/* ---------------------------------------------------------------- the chart of seven boxes
   A sheet 1720 wide from x 100, its top at y: "Data manager" at the top, a line down to a bar, a line from the bar down to each of
   seven boxes, a role in each. o.wall: pinned to a wall in o.light (else it lies on the desk); o.boxes (0 to 7: how many have come);
   o.roles (0 to 1: the words in them); o.lines (0 to 1: every line up lit); o.hi (a box's number) with o.hiA (0 to 1: that box lit);
   o.up (0 to 1: the lit box's one line up); o.all (0 to 1: every box lit); o.arcs ([0 to 1] x 4: the pencil lines from Noor's, Marta's, Erin's and Sam's boxes to
   Jun's); o.a, o.k. */
const PB_CHART={x:100,w:1720,h:380,bw:210,bh:132};
function pb_chart(ctx,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const G=PB_CHART,x=G.x,nb=o.boxes==null?7:o.boxes,ra=o.roles==null?1:o.roles,by=y+150,bar=y+124,B=LP.blue;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+G.w/2,y+G.h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  if(o.wall)lp_sheet(ctx,x,y,G.w,G.h,{col:B,light:o.light||"day"});else pb_paper(ctx,x,y,G.w,G.h,B);
  lp_T(ctx,"THE DATA TEAM",x+LP_PAD,y+82,{w:800,size:28,ls:3,col:B});
  const top=clamp(nb,0,1);
  if(top>0.004){ctx.save();ctx.globalAlpha*=top;lp_T(ctx,"Data manager",960,y+90,{w:800,size:30,align:"center"});
    ctx.strokeStyle=rgba(B,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(960,y+102);ctx.lineTo(960,bar);ctx.stroke();ctx.restore();}
  // the bar grows out from the middle as the boxes come, and each box hangs from it
  const reach=i=>clamp(nb-[3,2,4,1,5,0,6].indexOf(i),0,1);
  ctx.strokeStyle=rgba(B,1);ctx.lineWidth=3;ctx.lineCap="round";
  for(let i=0;i<7;i++){const r=ag_sine(reach(i)),bx=PB_X7[i];if(r<=0.004)continue;
    ctx.save();ctx.globalAlpha*=r;ctx.beginPath();ctx.moveTo(960,bar);ctx.lineTo(bx,bar);ctx.lineTo(bx,by);ctx.stroke();
    const k=lerp(0.7,1,ag_spr(reach(i),0,0.9));ag_about(ctx,bx,by+G.bh/2,k);
    rr(ctx,bx-G.bw/2,by,G.bw,G.bh,10);ctx.fillStyle="rgba(255,255,255,0.62)";ctx.fill();ctx.strokeStyle=rgba(B,1);ctx.lineWidth=3;ctx.stroke();
    if(ra>0.004){const L=PB_SEVEN[i].box,y0=by+G.bh/2-(L.length*36)/2+28;L.forEach((s,n)=>lp_T(ctx,s,bx,y0+n*36,{w:700,size:28,align:"center",a:ra}));}
    ctx.restore();}
  // every line up lit, where the film says what a chart shows
  const la=o.lines||0;if(la>0.004){ctx.save();ctx.globalAlpha*=la;ctx.strokeStyle=rgba(B,1);ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(960,y+102);ctx.lineTo(960,bar);
    ctx.moveTo(PB_X7[0],by);ctx.lineTo(PB_X7[0],bar);ctx.lineTo(PB_X7[6],bar);ctx.lineTo(PB_X7[6],by);for(let i=1;i<6;i++){ctx.moveTo(PB_X7[i],bar);ctx.lineTo(PB_X7[i],by);}ctx.stroke();ctx.restore();}
  // every box lit at once (o.all), where the film says what a plan made from the chart is for
  if((o.all||0)>0.004){ctx.save();ctx.globalAlpha*=o.all;ctx.strokeStyle=rgba(B,1);ctx.lineWidth=7;for(let i=0;i<7;i++){rr(ctx,PB_X7[i]-G.bw/2-5,by-5,G.bw+10,G.bh+10,14);ctx.stroke();}ctx.restore();}
  // one box lit, and its one line up
  if(o.hi!=null&&(o.hiA||0)>0.004){const bx=PB_X7[o.hi];ctx.save();ctx.globalAlpha*=o.hiA;ctx.strokeStyle=rgba(B,1);ctx.lineWidth=7;rr(ctx,bx-G.bw/2-5,by-5,G.bw+10,G.bh+10,14);ctx.stroke();ctx.restore();}
  if(o.hi!=null&&(o.up||0)>0.004){const bx=PB_X7[o.hi];ctx.save();ctx.globalAlpha*=o.up;ctx.strokeStyle=rgba(B,1);ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx,bar);ctx.lineTo(960,bar);ctx.lineTo(960,y+102);ctx.stroke();ctx.restore();}
  // who turns to whom: pencil, under the boxes
  if(o.arcs)PB_TURN.forEach((i,n)=>{const u=o.arcs[n]||0;if(u<=0.004)return;const left=i<PB_JUN,far=Math.abs(i-PB_JUN)>1;
    pb_arc(ctx,[PB_X7[i]+(left?30:-30),by+G.bh+8],[PB_X7[PB_JUN]+(left?-1:1)*(far?28:70),by+G.bh+10],far?64:38,u,{seed:n});});
  ctx.restore();}
// a pencil line from a to b that dips (or, with a negative dip, rises) on the way, drawn as far as u, an arrow's head at its end
function pb_arc(ctx,a,b,dip,u,o){o=o||{};u=clamp(u,0,1);if(u<=0.004)return;const al=o.a==null?1:o.a,N=44,m=[(a[0]+b[0])/2,(a[1]+b[1])/2+dip*2],P=[],sd=(o.seed||0)*2.1,
    at=v=>{const w=1-v;return[w*w*a[0]+2*w*v*m[0]+v*v*b[0],w*w*a[1]+2*w*v*m[1]+v*v*b[1]];};
  for(let i=0;i<=N;i++){const v=i/N*ag_sine(u),p=at(v);P.push([p[0]+Math.sin(i*1.3+sd)*0.9,p[1]+Math.cos(i*1.9+sd)*0.9]);}
  ctx.save();ctx.globalAlpha*=al;ctx.lineCap="round";ctx.lineJoin="round";
  for(const [dx,lw,aa] of [[0,o.w||3.6,0.9],[0.9,1.4,0.4]]){ctx.strokeStyle=rgba(LP.graphite,aa);ctx.lineWidth=lw;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0]+dx,p[1]+dx):ctx.moveTo(p[0]+dx,p[1]+dx));ctx.stroke();}
  if(u>0.9){const e=at(1),f=at(0.94),an=Math.atan2(e[1]-f[1],e[0]-f[0]),k=clamp((u-0.9)/0.1,0,1),l=15*k;ctx.strokeStyle=rgba(LP.graphite,0.9);ctx.lineWidth=o.w||3.6;ctx.beginPath();
    ctx.moveTo(e[0]-Math.cos(an-0.5)*l,e[1]-Math.sin(an-0.5)*l);ctx.lineTo(e[0],e[1]);ctx.lineTo(e[0]-Math.cos(an+0.5)*l,e[1]-Math.sin(an+0.5)*l);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the list of 46 open requests, and the pencil
   A sheet on the desk, under the chart's right end: the count, and a line for each request, 46 of them. o.num (0 to 1: the count),
   o.u (0 to 1: the lines come), o.sorted (0 to 1: each line goes to its place, longest first), o.a. */
const PB_LIST={x:1160,y:580,w:660,h:290};
const PB_REQ=(()=>{const R=ag_rnd(2027),L=[];for(let i=0;i<46;i++)L.push(34+Math.round(R()*62));const idx=L.map((v,i)=>i).sort((p,q)=>L[q]-L[p]),rank=[];idx.forEach((i,r)=>rank[i]=r);return{L,rank};})();
function pb_list(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const G=PB_LIST,O=LP.orange,nu=o.num==null?1:o.num,u=o.u==null?1:o.u,sd=ag_sine(o.sorted||0);
  ctx.save();ctx.globalAlpha*=a;pb_paper(ctx,G.x,G.y,G.w,G.h,O);
  if(nu>0.004){lp_T(ctx,"46",G.x+LP_PAD,G.y+152,{w:800,size:96,col:O,a:nu});lp_T(ctx,"open requests",G.x+LP_PAD,G.y+200,{w:600,size:28,a:nu});}
  const slot=k=>[G.x+410+(k%2)*112,G.y+40+Math.floor(k/2)*10.4];
  ctx.lineCap="round";ctx.lineWidth=4.6;
  for(let i=0;i<46;i++){const la=clamp(u*46-i,0,1);if(la<=0.004)continue;const p=slot(i),q=slot(PB_REQ.rank[i]),x=lerp(p[0],q[0],sd),y=lerp(p[1],q[1],sd);
    ctx.strokeStyle=rgba(O,0.82*la);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+PB_REQ.L[i],y);ctx.stroke();}
  ctx.restore();}
// a plain pencil lying on the desk, its point towards (x, y): len long, at an angle an (radians)
function pb_pencil(ctx,x,y,len,an,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const wd=15,body=[84,80,86],wood=[222,194,160];ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(an);
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.35)";ctx.shadowBlur=8;ctx.shadowOffsetX=LP.sdx*0.5;ctx.shadowOffsetY=7;ctx.fillStyle=rgba(body,1);ctx.fillRect(30,-wd/2,len-30,wd);ctx.restore();
  ctx.fillStyle=rgba(ag_lt(body,0.16),1);ctx.fillRect(30,-wd/2,len-30,wd*0.34);ctx.fillStyle=rgba(ag_dk(body,0.25),1);ctx.fillRect(30,wd/2-wd*0.26,len-30,wd*0.26);
  ctx.fillStyle=rgba(wood,1);ctx.beginPath();ctx.moveTo(30,-wd/2);ctx.lineTo(4,-1.6);ctx.lineTo(4,1.6);ctx.lineTo(30,wd/2);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.moveTo(8,-2.4);ctx.lineTo(0,0);ctx.lineTo(8,2.4);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([196,192,186],1);ctx.fillRect(len-26,-wd/2,14,wd);ctx.fillStyle=rgba([150,140,134],1);ctx.fillRect(len-12,-wd/2,12,wd);ctx.restore();}

/* ---------------------------------------------------------------- Helena's first week
   A sheet with the five days: a dot for each of the seven conversations (two a day from Monday, the seventh on Thursday), and a tick
   on Friday. o.dots (0 to 7), o.fri (0 to 1), o.light, o.a, o.k. */
function pb_week(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=206,bb={x,y,w,h};if(a<=0.004)return bb;const nd=o.dots==null?7:o.dots,D=["Mon","Tue","Wed","Thu","Fri"],cw=(w-LP_PAD*2)/5;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light||"day"});lp_T(ctx,"HELENA'S FIRST WEEK",x+LP_PAD,y+82,{w:800,size:28,ls:3,col:LP.mut});
  let n=0;D.forEach((d,i)=>{const cx=x+LP_PAD+cw*(i+0.5);lp_T(ctx,d,cx,y+130,{w:700,size:28,align:"center",col:LP.mut});
    const k=i<3?2:i===3?1:0;for(let j=0;j<k;j++,n++){const f=ag_spr(clamp(nd-n,0,1),0,0.9);if(f<=0.004)continue;ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(cx+(k===2?(j?16:-16):0),y+164,10*f,0,TAU);ctx.fill();}
    if(i===4&&(o.fri||0)>0.004){ctx.save();ctx.globalAlpha*=o.fri;lp_icon(ctx,"tick",cx,y+164,40,LP.green);ctx.restore();}});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- small things */
// the two sheets on Helena's desk, seen from the front: two pale slips lying on the table's top (lp_table at 150, 814, 840 wide)
function pb_slivers(ctx){for(const [x0,w,col] of [[300,330,LP.blue],[672,190,LP.orange]]){const y0=800,y1=768,sk=20;
    ctx.fillStyle="rgba(52,36,30,0.18)";ctx.beginPath();ctx.moveTo(x0-5,y0+3);ctx.lineTo(x0+w-3,y0+3);ctx.lineTo(x0+w+sk-3,y1+3);ctx.lineTo(x0+sk-5,y1+3);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+w,y0);ctx.lineTo(x0+w+sk,y1);ctx.lineTo(x0+sk,y1);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0+sk,y1+1);ctx.lineTo(x0+w+sk,y1+1);ctx.stroke();}}
// a small truck on the steel bridge, far up the gorge: u from 0 (the left end) to 1
function pb_truck(ctx,u,o){o=o||{};if(u<=0||u>=1)return;const a=(o.a==null?1:o.a)*clamp(u/0.05,0,1)*clamp((1-u)/0.05,0,1),x=lerp(748,1136,u),y=336.4;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgb(176,166,152)";ctx.fillRect(x-9,y-8.2,12,7);ctx.fillStyle="rgb(112,104,100)";ctx.fillRect(x+3.6,y-6.4,5,5.2);
  ctx.fillStyle="rgb(46,42,44)";for(const dx of [-6,5.4]){ctx.beginPath();ctx.arc(x+dx,y-0.8,1.5,0,TAU);ctx.fill();}ctx.restore();}

/* ===== People before roles: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Over the gorge the camera moves, so the words
   there are laid on the frame itself, not in the place. Sizes in the 1920 x 1080 frame. */

const PB_TITLE="People before roles",PB_LAST="Know the people before you plan the work.";
// the film's number and title at the top left, from the second chapter on
function pb_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1",PB_TITLE,Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function pb_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const pb_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function pb_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 (and goes at t1)
function pb_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}

/* ---------------------------------------------------------------- the gorge's people, small, in the wide view */
// someone walking the bridge from one bank to the other: from t0, over dur seconds; dir 1 from the left bank, -1 from the right.
// They come along the bank, cross on the floor and go on along the other bank. Drawn between the bridge's far side and its near side
function pb_walk(cc,tt,t0,dur,dir,who,o){const s=lerp(-0.2,1.2,(tt-t0)/dur);if(s<=-0.2||s>=1.2)return;const u=dir>0?s:1-s,a=clamp((s+0.2)/0.05,0,1)*clamp((1.2-s)/0.05,0,1);let p;
  if(u<0){const k=(u+0.2)/0.2,d=pb_deck(0,o);p=[lerp(d[0]-196,d[0],k),lerp(PB_BANK.L.y-2,d[1],k)];}
  else if(u>1){const k=(u-1)/0.2,d=pb_deck(1,o);p=[lerp(d[0],d[0]+196,k),lerp(d[1],PB_BANK.R.y-2,k)];}
  else p=pb_deck(u,o);
  pb_fig(cc,p[0],p[1],50,{who,pose:"walk",t:s*26,shadow:u<0||u>1?0.3:0,flip:dir<0,a});}
// a few people by the stone bases on an ordinary day: nL on the left bank, nR on the right, a(i) each one's opacity
function pb_few(ctx,nL,nR,a){a=a==null?1:a;const L=PB_BANK.L,R=PB_BANK.R;
  for(let i=0;i<nL;i++)pb_fig(ctx,L.x0+250+i*38,L.y+2+(i%2)*4,50,{who:[4,1,6][i%3],pose:i===1?"sit":"stand",flip:i%2===0,a});
  for(let i=0;i<nR;i++)pb_fig(ctx,R.x0+60+i*44,R.y+3+(i%2)*4,50,{who:[3,0,5][i%3],pose:i===2?"sit":"stand",flip:i!==1,a});}
// the days of the renewal: both banks full, families sitting at their cord, men standing by the bases; a(i) each one's opacity
const PB_CROWD=(()=>{const R=ag_rnd(1973),P=[];
  for(let n=0;n<64;n++){const y=372+R()*88,x=24+R()*(y>436?372:446);P.push({x,y,side:0,who:(R()*8)|0,sit:R()<0.38,flip:R()<0.4});}
  for(let n=0;n<54;n++){const y=376+R()*88,x=1896-R()*(y>440?372:440);P.push({x,y,side:1,who:(R()*8)|0,sit:R()<0.3,flip:R()<0.6});}
  return P.sort((p,q)=>p.y-q.y);})();
function pb_crowd(ctx,a){PB_CROWD.forEach((p,i)=>{const al=a(i,p);if(al>0.004)pb_fig(ctx,p.x,p.y,50*pb_near(p.y),{who:p.who,pose:p.sit?"sit":"stand",flip:p.flip,a:al});});}

/* ---------------------------------------------------------------- 1. The bridge they went back to: the Apurímac, 1968 to today */
scene("bridge",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),sun={wall:0},gr={light:"grey",wall:0};
  const steelT=w("steel","steel",-0.3),truckT=w("need","cars",-0.5),wornT=c.left+1.4,rebT=c.rebuild,gatherT=c.today-0.1;
  // the gorge from 1968 to 1970: the steel bridge comes, a truck crosses it, the last walker leaves the rope, and the rope sags and frays
  const years=(x,tt)=>{const wo=ag_sine((tt-wornT)/3.2),o={age:lerp(0.5,1.3,wo),wear:0.55*wo,extra:{r1:12*wo}},su=ag_in(tt,steelT,2.4);
    pb_few(x,2,3,1-ag_in(tt,c.need+0.4,1.6));
    if(su>0.004){x.save();x.beginPath();x.rect(726,300,lerp(0,440,su),70);x.clip();pb_steel(x,{});x.restore();}
    pb_truck(x,(tt-truckT)/5.2);pb_truck(x,(tt-truckT-7.5)/5.2);
    pb_bridge(x,Object.assign({mid:cc=>pb_walk(cc,tt,c.steel-9,15,-1,3,o)},o));};
  ag_shots(ctx,S,t,sc.dur,[
    // the gorge and the river; closer, the bridge of grass and people crossing it; wide again, both banks
    {at:0,place:"pbGorge",keys:[[0,960,540,1.0],[c.rope-0.6,960,468,1.6],[c.only-0.5,960,540,1.0]],d:3.2,push:0,draw:(x,tt)=>{const o={age:0.3};
      pb_few(x,2,3);
      pb_bridge(x,Object.assign({mid:cc=>{pb_walk(cc,tt,c.rope-2.5,17,1,0,o);pb_walk(cc,tt,c.incas-1,17,-1,1,o);pb_walk(cc,tt,c.incas+3.5,17,1,6,o);pb_walk(cc,tt,c.only+0.5,17,-1,3,o);}},o));}},
    // the bank: the cord a family brings, and the hands that make it new
    {at:c.wear-0.3,place:"pbBank",keys:[[c.wear-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lp_person(x,PB_PEOPLE.woman,420,650,0.9,{t:tt,pose:"hold",hold:(cc,h)=>pb_coil(cc,h.near[0]+34,h.near[1]+58,92,{}),light:sun});
      lp_person(x,PB_PEOPLE.builder,960,650,0.9,{t:tt+1.3,flip:true,light:sun});
      lp_person(x,PB_PEOPLE.woman3,1500,650,0.9,{t:tt+2.1,flip:true,light:sun});}},
    // 1968: the steel bridge, almost a hundred metres away, and a truck on it
    {at:c.steel-0.4,place:"pbGorge",keys:[[c.steel-0.4,960,520,1.0],[c.steel+0.3,946,402,1.85]],d:3.0,dis:1.0,push:0,draw:years},
    // 1970: under a grey sky, the rope bridge left to wear
    {at:c.left-0.3,place:"pbGorgeGrey",keys:[[c.left-0.3,946,402,1.85],[c.left+0.5,958,452,1.72]],d:3.4,dis:1.6,push:0.02,draw:years},
    // October 1972: the bank with nobody on it, last year's rope in the grass, and what the keeper said
    {at:c.keeper-0.3,place:"pbBankGrey",keys:[[c.keeper-0.3,960,540,1.0]],dis:1.2,push:0,draw:(x,tt)=>{
      pb_rope(x,pb_hang([-30,812],[720,838],16),20,{age:1.5,braid:true});
      pb_pill(x,tt,w("keeper","October",-0.1),null,250,176,"October 1972",{col:LP.ink});
      pb_sheet(x,tt,w("sad","My",-0.3),380,236,1160,{kick:"Luis Choqueneira, a keeper of the bridge",title:"“My people feel sad about abandoning the keshwa chaca for a new steel bridge upstream.”"},{light:null,pin:false});
      pb_sheet(x,tt,rebT-0.2,380,496,1160,{title:"“So we're going to rebuild it when the New Year comes.”"},{col:LP.green,light:null,pin:false});}},
    // the new year: the same bank in the sun, and the families back on it with their cord
    {at:c.did-0.4,place:"pbBank",later:true,dis:0.8,keys:[[c.did-0.4,960,540,1.0]],push:0,draw:(x,tt)=>{
      lp_person(x,PB_PEOPLE.woman,420,650,0.9,{t:tt,pose:"hold",hold:(cc,h)=>pb_coil(cc,h.near[0]+34,h.near[1]+58,92,{}),light:sun,a:ag_in(tt,c.did+0.1,0.6)});
      lp_person(x,PB_PEOPLE.builder2,960,650,0.9,{t:tt+1.3,flip:true,light:sun,a:ag_in(tt,c.did+0.7,0.6)});
      lp_person(x,PB_PEOPLE.woman2,1500,650,0.9,{t:tt+2.1,flip:true,light:sun,a:ag_in(tt,w("all","few",-0.2),0.6)});
      pb_sheet(x,tt,w("all","Only",-0.3),560,150,800,{kick:"An elder of Huinchiri, asked in 2012",title:"“Only now does everyone come.”"},{col:LP.green,light:null,pin:false});}},
    // today: each June, four communities, about a thousand people; and both bridges, side by side
    {at:c.today-0.3,place:"pbGorge",keys:[[c.today-0.3,960,540,1.0],[c.unesco-0.4,960,476,1.45],[c.turn-0.5,950,452,1.3]],d:3.2,dis:1.2,push:0,draw:(x,tt)=>{const o={age:0};
      pb_crowd(x,i=>ag_in(tt,gatherT+i*0.022,0.6));pb_steel(x,{});pb_truck(x,(tt-c.turn+0.6)/5.2);
      pb_bridge(x,Object.assign({mid:cc=>{pb_walk(cc,tt,c.minka-1,18,1,0,o);pb_walk(cc,tt,c.minka+2,18,-1,5,o);pb_walk(cc,tt,c.unesco+1,18,1,2,o);pb_walk(cc,tt,c.unesco+4,18,-1,7,o);
        pb_walk(cc,tt,c.died+2,18,1,4,o);pb_walk(cc,tt,c.died+5,18,-1,1,o);pb_walk(cc,tt,c.turn,18,1,3,o);}},o));}},
    // and a data team: seven boxes with a role in each, or the seven people in them
    {at:c.data-0.3,place:"pbTeam",keys:[[c.data-0.3,960,540,1.0]],dis:1.2,push:0,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8),pT=w("data","people",-0.5),kT=w("plan","Know",-0.3);
      x.save();x.globalAlpha*=ga;
      pb_chart(x,130,{wall:true,light:"day",a:ag_in(tt,c.data+0.1,0.4)*lerp(1,0.42,ag_in(tt,kT,0.8)),k:tt-c.data-0.1,boxes:7*clamp((tt-w("data","roles",-0.6))/1.0,0,1),
        all:ag_io(tt,w("plan","boxes",-0.3),kT,0.5)});
      pb_row(x,tt,PB_SEVEN.map((p,i)=>({who:p.who,ph:p.ph,x:PB_X7[i],flip:i>3,a:ag_in(tt,pT+i*0.2,0.6)})),{names:0});
      x.restore();}}
  ]);
  setScreen(ctx,S);
  pb_tag(ctx,t,w("where","Apurímac",-0.3),c.rope-0.7,110,176,"The Apurímac river · Quehue, Cusco, Peru",{col:LP.ink});
  pb_tag(ctx,t,w("rope","keshwa",-0.3),c.only-0.7,960,826,"Q'eswachaka: a bridge of twisted grass",{align:"center",col:LP.ink});
  pb_pill(ctx,t,steelT,c.left-0.5,960,166,"1968",{col:LP.ink});
  pb_tag(ctx,t,w("steel","almost",-0.2),c.left-0.5,960,240,"A steel bridge, almost 100 metres away",{align:"center",col:LP.ink});
  pb_pill(ctx,t,c.left+0.2,c.keeper-0.6,960,166,"1970",{col:LP.ink});
  pb_tag(ctx,t,w("left","decaying",-0.2),c.keeper-0.6,960,240,"Found decaying: not raised for a few years",{align:"center",col:LP.amber});
  const fa=ag_io(t,w("today","thousand",-0.4),c.unesco-0.6,0.4);
  if(fa>0.004)lp_figure(ctx,700,110,520,{kick:"Each June",num:"≈ 1,000",label:"people of four communities, each family with its own cord"},{col:LP.orange,light:null,pin:false,a:fa,k:t-w("today","thousand",-0.4)});
  pb_sheet(ctx,t,w("minka","minka",-0.2),1290,110,520,{kick:"Minka",title:"Unpaid work, shared for everyone's benefit"},{light:null,pin:false,out:c.unesco-0.6});
  pb_sheet(ctx,t,w("unesco","strengthening",-0.5),410,140,1100,{kick:"UNESCO, 2013",title:"“…a means of strengthening their social links and not simply as a transport route”"},{light:null,pin:false,out:c.died-0.5});
  pb_sheet(ctx,t,w("died","If",-0.4),410,140,1100,{kick:"Victoriano Arizapana, a bridge builder",title:"“If we stop preserving it, it would be like if we died.”",sub:"Interview, October 2014"},{light:null,pin:false,out:c.turn-0.5});
  pb_tag(ctx,t,w("turn","carry",-0.3),c.data-0.6,948,296,"Steel: a way across",{align:"center",col:LP.ink});
  pb_tag(ctx,t,w("turn","together",-0.4),c.data-0.6,960,716,"Rope: a way to be together",{align:"center",col:LP.green});
  lp_title(ctx,S,t,c.breath+0.2,PB_TITLE,"The first question: who is here?","Leading data people · People first");
});

/* ---------------------------------------------------------------- 2. A chart and a list */
// Helena at her desk, the two sheets lying on it
function pb_helena(x,tt,light){lp_person(x,"helena",570,676,1.0,{t:tt,cut:806,light});lp_table(x,150,814,840);pb_slivers(x);}
// her desk from above: the pencil, the list and the chart; ch and li as pb_chart and pb_list take them
function pb_desk(x,ch,li){pb_pencil(x,236,818,330,-0.17);pb_list(x,li);pb_chart(x,160,ch);}
// the plan she could make by lunch: a dashed line from the list to each box, drawn as far as u
function pb_fan(x,u,a){if(a<=0.004||u<=0.004)return;x.save();x.globalAlpha*=a;x.strokeStyle=rgba(LP.amber,1);x.lineWidth=3.4;x.lineCap="round";x.setLineDash([12,11]);
  for(let i=0;i<7;i++){const k=ag_sine(clamp(u*1.6-(6-i)*0.1,0,1));if(k<=0.004)continue;const a0=[1200+i*88,586],b=[PB_X7[i],456],m=[(a0[0]+b[0])/2,548];x.beginPath();
    for(let n=0;n<=30;n++){const v=n/30*k,q=1-v,px=q*q*a0[0]+2*q*v*m[0]+v*v*b[0],py=q*q*a0[1]+2*q*v*m[1]+v*v*b[1];n?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();}
  x.restore();}
scene("chart",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},deskT=w("helena","Two",-0.4);
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 1 February: Helena at her desk, two sheets lying on it
    {at:0,place:"pbHelena",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      pb_helena(x,tt,mo);
      pb_sheet(x,tt,c.mon+0.4,1040,170,720,{kick:"Monday 1 February 2027",title:"Helena Novak",lines:["Starts as the university's data manager"]},{light:"morning",u:ag_in(tt,w("helena","starts",-0.1),0.5)});}},
    // the two sheets from above: the chart of seven boxes, and the list of 46 open requests
    {at:deskT,place:"pbDesk",keys:[[deskT,960,540,1.0]],dis:0.9,push:0,draw:(x,tt)=>{const fT=w("tempt","plan",-0.3),sT=w("sort","sort",-0.2),nT=w("sort","changes",-0.3),bT=w("boxes","boxes",-0.3);
      pb_desk(x,{boxes:7*clamp((tt-w("two","seven",-0.3))/1.1,0,1),roles:ag_in(tt,w("two","role",-0.3),0.6),lines:ag_io(tt,w("boxes","reports",-0.3),w("boxes","doesn't",-0.2),0.5),
        hi:clamp(Math.floor((tt-bT)/0.22),0,6),hiA:ag_io(tt,bT,bT+7*0.22,0.2)},
        {num:ag_in(tt,w("two","forty-six",-0.3),0.4),u:ag_in(tt,w("two","forty-six",-0.1),1.4),sorted:(tt-sT)/1.8});
      pb_fan(x,(tt-fT)/1.6,1-ag_in(tt,nT,0.7));
      pb_tag(x,tt,w("tempt","lunch",-0.3),nT,470,650,"A plan for everyone, by lunch?",{align:"center",col:LP.amber});
      pb_pill(x,tt,sT+1.2,null,900,650,"Sorted that day",{col:LP.green,icon:"tick",size:28});
      pb_tag(x,tt,w("sort","Every",-0.2),null,900,728,"As Every area, one job shows",{align:"center",col:LP.ink});
      pb_tag(x,tt,nT+0.3,null,470,650,"Nobody's work changed",{align:"center",col:LP.ink});}},
    // back in her room: the standard on putting people first
    {at:c.iso-0.3,place:"pbHelena",keys:[[c.iso-0.3,960,540,1.0]],dis:1.0,push:0,draw:(x,tt)=>{
      pb_helena(x,tt,mo);
      pb_sheet(x,tt,w("iso","standard",-0.3),1040,170,760,{kick:"ISO 27500:2016",title:"The human-centred organization",lines:["Value people, and make their work meaningful","Individual differences: a strength"]},
        {light:"morning",u:pb_u(tt,[w("iso","value",-0.2),w("iso","differences",-0.3)]),out:c.before-0.3});
      const k0=w("before","sits",-0.3),ka=ag_in(tt,k0,0.35);if(ka>0.004)pb_week(x,1040,150,760,{light:"morning",a:ka,k:tt-k0,dots:0});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,deskT-0.4,0.5)});
  pb_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Four questions, seven people */
// each of the seven where they work: on which side of the frame, the cue for their sheet, and what it says
const PB_HOURS=[
  {id:"noor",who:"noor",cue:"proud",words:{kick:"Proud of",title:"Her map of the university's data",lines:["She'd like more people to argue with it"]},line:"She'd"},
  {id:"sam",who:"sam",cue:"proud",words:{kick:"Proud of",title:"Each morning the data is simply there",lines:["And nobody has to ask"]},line:"nobody"},
  {id:"jun",who:"jun",cue:"proudest",words:{kick:"Proudest",title:"When someone stops asking him",lines:["Because now they know"]},line:"because"},
  {id:"yusuf",who:"yusuf",cue:"Ask",words:{kick:"To work well with him",title:"“Ask me at the start, and I can say yes more often.”"}},
  {id:"marta",who:PB_MARTA,cue:"would",words:{kick:"Would like more of",title:"Hearing what became of a number",lines:["After she sends it"]},line:"after"},
  {id:"erin",who:PB_ERIN,cue:"started",words:{kick:"What she offers",title:"Started the same week as Marta",lines:["They still have lunch on Thursdays"]},line:"They"},
  {id:"tomas",who:PB_TOMAS,cue:"can tell",words:{kick:"Can tell you",title:"Who reads each report",lines:["And what they do with it"]},line:"what"}];
const PB_AHEAD=1.55;
scene("seven",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const shots=[
    // Helena's week, and the four questions she asks each of the seven
    {at:0,place:"pbHelena",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      pb_helena(x,tt,mo);
      pb_week(x,1040,150,760,{light:"morning",dots:2*ag_in(tt,w("hour","Monday",-0.1),0.5)+5*clamp((tt-w("hour","Thursday",-0.6))/1.2,0,1)});
      pb_sheet(x,tt,c.four+0.1,1040,392,760,{kick:"The same four questions",lines:["What are you proud of here?","What would you like more of?","What gets in your way?","What should I know, to work well with you?"]},
        {light:"morning",u:pb_u(tt,[w("q12","proud",-0.4),w("q12","more",-0.5),w("q34","way",-0.5),w("q34","know",-0.5)])});
      pb_tag(x,tt,w("never","never",-0.2),null,1420,780,"Never: health, family, or what isn't offered",{align:"center",col:LP.ink});}}];
  // one at a time, where each of them works: the afternoon turning late as the week goes on. Each comes in PB_AHEAD seconds before
  // their line, in the pause after the line before, as the score plays the figure of their name
  PB_HOURS.forEach((p,i)=>{const left=i%2===0,late=i>=4,lt={light:late?"late":"day"},at=c[p.id]-PB_AHEAD,sx=left?980:140,sT=at+(i?0.6:1.0);
    shots.push({at,place:late?"pbOfficeLate":"pbOffice",later:i>0,dis:i?0.45:1.0,keys:[[at,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      lp_person(x,p.who,left?540:1380,640,1.0,{t:tt+i*2.3,flip:!left,light:lt});
      lp_nameTag(x,sx,196,p.who);
      pb_sheet(x,tt,sT,sx,278,840,p.words,{light:lt.light,u:p.line?ag_in(tt,w(p.id,p.line,-0.3),0.5):1});}});});
  // none of it is on the chart
  shots.push({at:c.none-0.3,place:"pbDesk",keys:[[c.none-0.3,960,540,1.0]],dis:1.0,push:0.03,draw:(x,tt)=>pb_desk(x,{},{sorted:1})});
  ag_shots(ctx,S,t,sc.dur,shots);
  pb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Who they turn to */
// five of the seven in the team's room, Jun in the middle; the pencil lines from the four who turn to him, each with what they bring
const PB_ASK=[{i:1,what:"her map"},{i:2,what:"a number"},{i:4,what:"a model"},{i:5,what:"an odd load"}],PB_X5=[280,620,960,1300,1640],PB_FIVE={s:0.62,y:820,light:{light:"day"}};
function pb_five(x,tt,T){
  pb_row(x,tt,[1,2,3,4,5].map(i=>({who:PB_SEVEN[i].who,ph:PB_SEVEN[i].ph,name:PB_SEVEN[i].name,x:PB_X5[i-1],flip:i>3,a:ag_in(tt,T.in[i],0.6)})),PB_FIVE);
  PB_ASK.forEach((q,n)=>{const bx=PB_X5[q.i-1],left=q.i<3,far=Math.abs(q.i-3)>1,ta=ag_in(tt,T.arc[n]-0.2,0.4);
    if(ta>0.004)lp_tag(x,bx,540,q.what,{align:"center",col:LP.ink,a:ta});
    pb_arc(x,[bx+(left?34:-34),508],[960+(left?-1:1)*(far?26:84),572],far?-74:-46,(tt-T.arc[n])/0.9,{seed:n+3,w:4});});}
scene("turn",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const T={in:{1:w("show","Noor",-0.4),2:w("ask","Marta",-0.4),3:w("ask","Jun",-0.5),4:w("ask","Erin",-0.4),5:w("show","Sam",-0.4)},
      arc:[w("show","shows",-0.1),w("ask","asks",-0.1),w("ask","So does",0.1),w("show","load",-0.3)]},hT=w("hears","one name",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // one name, again and again; then who says it, and to whom they turn
    {at:0,place:"pbTeam",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      PB_ASK.forEach((q,n)=>pb_tag(x,tt,hT+[0.9,0,0.45,1.35][n],c.ask-0.5,PB_X5[q.i-1],540,"“Ask Jun.”",{align:"center",col:LP.ink}));
      pb_five(x,tt,T);}},
    // the chart: Jun is one box of seven, with one line, up; then the lines it doesn't have
    {at:c.box-0.3,place:"pbDesk",keys:[[c.box-0.3,960,540,1.0]],dis:1.0,push:0.03,draw:(x,tt)=>{const aT=w("shows","turn",-0.5);
      pb_desk(x,{hi:PB_JUN,hiA:ag_in(tt,w("box","one box",-0.3),0.5),up:ag_io(tt,w("box","line",-0.3),c.shows-0.2,0.5),lines:ag_io(tt,w("shows","manages",-0.4),aT,0.5),
        arcs:[0,1,2,3].map(n=>(tt-aT-[0.5,0,0.25,0.75][n])/0.8)},{sorted:1});}},
    // the team's room again: an idea from Southern Africa, and what researchers found
    {at:c.ubuntu-0.3,place:"pbTeam",keys:[[c.ubuntu-0.3,960,540,1.0]],dis:1.0,push:0,draw:(x,tt)=>{
      pb_five(x,tt,T);
      pb_sheet(x,tt,w("ubuntu","Ubuntu",-0.1),410,130,1100,{kick:"Ubuntu",title:"“A person is a person through other people”",sub:"A saying in isiZulu · The team comes first"},{light:"day",out:c.shared-0.4});
      pb_sheet(x,tt,w("shared","shared",-0.3),200,130,900,{kick:"Shared leadership",title:"People in a team leading one another",sub:"Whoever holds the title"},{light:"day",out:c.title-0.4});
      const f0=w("review","forty-two",-0.4),fa=ag_io(tt,f0,c.title-0.4,0.4);
      if(fa>0.004)lp_figure(x,1140,130,580,{kick:"Wang and others, 2014",num:"42",label:"samples: teams that share the leading do better"},{col:LP.orange,light:"day",a:fa,k:tt-f0});
      pb_pill(x,tt,w("title","Anyone",-0.3),c.room-0.4,960,300,"Anyone can lead from where they are",{col:LP.ink,size:36});}},
    // Helena makes room for it: Jun stays where he is, and she asks him
    {at:c.room-0.3,place:"pbTeam",keys:[[c.room-0.3,960,540,1.0],[c.room+0.4,1130,640,1.24]],d:2.6,dis:0.8,push:0,draw:(x,tt)=>{
      pb_row(x,tt,[{who:"jun",ph:PB_SEVEN[PB_JUN].ph,name:"Jun",x:960},{who:"helena",ph:PB_HELENA_PH,name:"Helena",x:1300,flip:true,a:ag_in(tt,w("room","She asks",-0.4),0.7)}],PB_FIVE);
      pb_tag(x,tt,w("room","March",-0.3),null,1130,516,"From March: beside a newcomer",{align:"center",col:LP.green});}}
  ]);
  pb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. What won't change yet */
// all eight in the team's room: Helena at the left, the seven turned to her
const PB_X8=[162,390,618,846,1074,1302,1530,1758];
// The score plays the seven first names as one phrase, in the row's order (tools/score.py: SING, the same numbers): sing is how long
// ago it began, and each name lifts a little as it is played; where the two instruments end together (PB_SING_ALL), all eight do
const PB_SING=[0,0.62,1.10,1.72,2.20,2.82,3.30],PB_SING_ALL=4.0,pb_lift=u=>u<0?0:ag_in(u,0,0.12)*(1-ag_in(u,0.26,0.5));
function pb_eight(x,tt,a,light,names,sing){const L=i=>sing==null?0:Math.max(i<0?0:pb_lift(sing-PB_SING[i]),pb_lift(sing-PB_SING_ALL));
  pb_row(x,tt,[{who:"helena",ph:PB_HELENA_PH,name:"Helena",x:PB_X8[0],a:a(0),lift:L(-1)}].concat(PB_SEVEN.map((p,i)=>({who:p.who,ph:p.ph,name:p.name,x:PB_X8[i+1],flip:true,a:a(i+1),lift:L(i)}))),
    {s:0.46,y:850,light,names});}
scene("friday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"},inT=Math.max(w("fri","brings",-0.4),2.2);
  ag_shots(ctx,S,t,sc.dur,[
    // Friday 5 February: all seven in the team's room, and what Helena can promise
    {at:0,place:"pbTeamFri",later:true,dis:0.6,keys:[[0,1130,640,1.24],[0.2,960,540,1.0]],d:2.2,push:0,draw:(x,tt)=>{
      pb_eight(x,tt,i=>ag_in(tt,inT+i*0.14,0.6),lt);
      pb_sheet(x,tt,Math.max(c.fri+0.3,2.5),560,130,800,{kick:"Friday 5 February",title:"All seven, in the team's room"},{light:"late",out:c.fear-0.4});
      pb_sheet(x,tt,w("fear","change",-0.4),410,130,1100,{kick:"A hazard of work",title:"Poor organisational change management",sub:"Safe Work Australia, psychosocial hazards"},{col:LP.amber,light:"late",out:c.stays-0.4});
      pb_sheet(x,tt,w("stays","promise",-0.4),410,130,1100,{kick:"What Helena can promise",title:"Who does what stays as it is, this month",lines:["Not promised: that nothing will change","Said: what stays, and for how long"]},
        {col:LP.green,light:"late",u:pb_u(tt,[w("notall","nothing",-0.3),w("notall","only",-0.3)])});}},
    // the gorge, October 1972: four years after the steel bridge came
    {at:c.keeper-0.3,place:"pbGorgeGrey",keys:[[c.keeper-0.3,952,430,1.5]],dis:1.0,push:0.03,draw:(x,tt)=>{pb_steel(x,{});pb_bridge(x,{age:1.3,wear:0.55,extra:{r1:12}});}},
    // her first week, and what she knows at the end of it
    {at:c.week-0.3,place:"pbTeamFri",keys:[[c.week-0.3,960,540,1.0]],dis:1.0,push:0,draw:(x,tt)=>{
      pb_eight(x,tt,()=>1,lt,1,tt-(c.breath-0.5));
      const k0=c.week,ka=ag_in(tt,k0,0.35);if(ka>0.004)pb_week(x,580,130,760,{light:"late",a:ka,k:tt-k0,fri:ag_in(tt,w("week","first",-0.2),0.5)});
      pb_pill(x,tt,w("knows","planned",-0.3),null,960,420,"Nobody's work planned yet",{col:LP.ink,size:30});
      pb_pill(x,tt,w("knows","seven",-0.3),null,960,510,"Seven people, known",{col:LP.green,icon:"tick",size:30});}}
  ]);
  setScreen(ctx,S);
  pb_pill(ctx,t,w("keeper","steel",-0.3),c.week-0.6,952,338,"1968 · the steel bridge",{col:LP.ink,size:28});
  pb_pill(ctx,t,w("keeper","keeper",-0.3),c.week-0.6,960,770,"1972 · “We're going to rebuild it”",{col:LP.green,size:28});
  pb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},e0=c.breath+0.6,goT=w("back","went",-0.6);
  ag_shots(ctx,S,t,sc.dur,[
    // the gorge today: steel does the carrying, and people on both banks at the rope
    {at:0,place:"pbGorge",keys:[[0,946,396,1.8],[goT,960,492,1.32]],d:3.4,push:0,draw:(x,tt)=>{const o={age:0};
      pb_crowd(x,()=>1);pb_steel(x,{});pb_truck(x,(tt-0.4)/5.2);
      pb_bridge(x,Object.assign({mid:cc=>{pb_walk(cc,tt,-6,18,1,0,o);pb_walk(cc,tt,-1,18,-1,5,o);pb_walk(cc,tt,3,18,1,2,o);}},o));}},
    // the two sheets, with the pencil's lines on the chart
    {at:c.same-0.3,place:"pbDesk",keys:[[c.same-0.3,960,540,1.0]],dis:1.0,push:0.03,draw:(x,tt)=>{
      pb_desk(x,{arcs:[1,1,1,1]},{sorted:1});
      pb_pill(x,tt,w("same","who",-0.3),null,620,660,"Who is here?",{col:LP.ink,size:36});}},
    // the eight of them, and what to do on Monday
    {at:c.m1-0.3,place:"pbTeam",keys:[[c.m1-0.3,960,540,1.0]],dis:1.0,push:0,draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      pb_eight(x,tt,()=>1,dy,1-ag_in(tt,e0-0.2,0.6),tt-(c.take+0.3));
      if(g>0.004){x.save();x.globalAlpha*=g;
        pb_sheet(x,tt,c.m1+0.2,450,130,1020,{kick:"On Monday",lines:["Before you plan anyone's work, sit down with each person","Ask about them at work: proud of what, held up by what",
          "Notice who people turn to, and make room for it","Say early what won't change yet"]},{light:"day",u:pb_u(tt,[w("m1","sit",-0.3),w("m2","Ask",-0.2),w("m3","Notice",-0.2),w("m4","say",-0.3)])});
        x.restore();}
      pb_tag(x,tt,w("next","Wellbeing",-0.2),c.take-0.4,960,520,"Next: Wellbeing is in the work · What do they need?",{align:"center",col:LP.ink});
      pb_pill(x,tt,c.take,e0,960,330,"Know the people before you plan the work",{col:LP.ink,size:38});}}
  ]);
  setScreen(ctx,S);
  pb_tag(ctx,t,0.9,goT,948,250,"Steel does the carrying",{align:"center",col:LP.ink});
  pb_tag(ctx,t,w("back","each other",-0.3),c.same-0.6,960,790,"What they went back for: each other",{align:"center",col:LP.green});
  lp_end(ctx,S,t,e0,PB_TITLE,PB_LAST,"Film 1 of 4","People first");
  pb_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["seven","friday"]);

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
