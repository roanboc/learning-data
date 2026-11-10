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

// Plan, define the check, do, check, the fifth film of Agents at work on data, the second series on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years and numbers in words). The few longer stops are in breath.js.
const NARR={
"water":{"name":"Water people can trust","lead":1.6,"tail":1.0,"vo":[
 {"id":"city","gap":0.8,"text":"Singapore, in the late 1990s: an island city of four million people, with little land to catch the rain.","say":"Singapore, in the late nineteen nineties: an island city of four million people, with little land to catch the rain."},
 {"id":"piped","gap":0.8,"text":"Much of its water is piped in from Malaysia, under two agreements: one ends in 2011, the other in 2061.","say":"Much of its water is piped in from Malaysia, under two agreements: one ends in twenty eleven, the other in twenty sixty-one."},
 {"id":"clean","gap":0.8,"text":"Engineers can clean used water, from the city's sinks and drains, until it's pure enough to drink."},
 {"id":"fear","gap":0.8,"text":"But would anyone drink water that had gone down a drain?"},
 {"id":"trust","gap":0.8,"text":"If people don't trust it, the country can't use it, and stays dependent on water from across the border."},
 {"id":"change","gap":0.8,"text":"Something has to make it trustworthy, before anyone drinks a drop."},
 {"id":"study","gap":0.8,"text":"So, in 1998, the water agency and the environment ministry begin a study.","say":"So, in nineteen ninety-eight, the water agency and the environment ministry begin a study."},
 {"id":"before","gap":0.3,"text":"Before the test plant makes any water, they write down how it will be judged:"},
 {"id":"measures","gap":0.8,"text":"190 measures, physical, chemical and microbiological, from the world's drinking-water standards.","say":"A hundred and ninety measures, physical, chemical and microbiological, from the world's drinking-water standards."},
 {"id":"panel","gap":0.8,"text":"And a panel of experts, from Singapore and abroad, helps set the rules, and checks the results, for two years."},
 {"id":"report","gap":0.8,"text":"In July 2002, the panel reports: the water is well within the standards.","say":"In July, twenty oh two, the panel reports: the water is well within the standards."},
 {"id":"parade","gap":0.8,"text":"That August, at the parade for the country's birthday, about 60,000 people raise a bottle of it, and drink.","say":"That August, at the parade for the country's birthday, about sixty thousand people raise a bottle of it, and drink."},
 {"id":"flows","gap":0.8,"text":"Since 2003, it has flowed into the reservoirs: water the country makes itself.","say":"Since twenty oh three, it has flowed into the reservoirs: water the country makes itself."},
 {"id":"today","gap":0.8,"text":"Today it's tested for about 300 measures, and experts from outside still audit it every year.","say":"Today it's tested for about three hundred measures, and experts from outside still audit it every year."},
 {"id":"data","gap":0.8,"text":"At the university, Jun's agent is about to change the census-day count, the number the university reports to the government."},
 {"id":"unless","gap":0.8,"text":"If nobody decides first how its work will be checked, nobody can trust what it brings back."},
 {"id":"first","gap":0.8,"text":"Decide the check before it starts, and its work is something the team can use."}
]},
"long":{"name":"The long way","lead":1.6,"tail":1.6,"vo":[
 {"id":"once","gap":0.8,"text":"Once, one of the team's agents was given a goal and nothing else: check the count against the census rules."},
 {"id":"knew","gap":0.8,"text":"Its plan didn't say what it could use, so it did what it knew: it searched the web for the census rules."},
 {"id":"pages","gap":0.8,"text":"It read 38 web pages, in 40 minutes.","say":"It red thirty-eight web pages, in forty minutes."},
 {"id":"docs","gap":0.8,"text":"Docs, the tool with the university's own definitions, would have answered in one call."},
 {"id":"other","gap":0.8,"text":"And the rule it brought back was another university's."},
 {"id":"caught","gap":0.8,"text":"Jun caught it in review, and the work began again."},
 {"id":"broken","gap":0.8,"text":"Nothing in the agent was broken: it used what it could find, because nobody had said what was there."},
 {"id":"waste","gap":0.8,"text":"Most of the waste with agents starts here, with a plan that doesn't say what the agent may use."}
]},
"plan":{"name":"Plan","lead":1.0,"tail":1.0,"vo":[
 {"id":"asks","gap":0.8,"text":"Now Clara, in Planning, asks for the census-day count by level of study, for the government's report."},
 {"id":"page","gap":0.8,"text":"Before the agent starts, Jun writes one page."},
 {"id":"goal","gap":0.8,"text":"The goal: students on census day, by level, undergraduate and postgraduate."},
 {"id":"reads","gap":0.8,"text":"What to read: the glossary's words for student, census day and level of study, and the census-day count it builds on."},
 {"id":"tools","gap":0.8,"text":"The tools it may use: Catalog, Query and Docs, read only."},
 {"id":"writes","gap":0.8,"text":"Where it may write: only its own branch, and its sandbox."},
 {"id":"never","gap":0.8,"text":"What it must never do: read names or student IDs, or write to production."},
 {"id":"limit","gap":0.8,"text":"And a limit: ten rounds, then it stops and reports."}
]},
"define":{"name":"Define the check","lead":1.0,"tail":1.4,"vo":[
 {"id":"matters","gap":0.8,"text":"Then the line that matters most: how the result will be checked, decided now, before any work."},
 {"id":"unknown","gap":0.8,"text":"But nobody knows the answer yet: that's why Clara asked."},
 {"id":"must","gap":0.3,"text":"What Jun knows is what must be true of any right answer:"},
 {"id":"adds","gap":0.3,"text":"the levels add up to 18,412, the count already matched to the census report;","say":"the levels add up to eighteen thousand four hundred and twelve, the count already matched to the census report;"},
 {"id":"one","gap":0.8,"text":"and every student has exactly one level, as the glossary defines it."},
 {"id":"neither","gap":0.8,"text":"Neither says how many students are at any level: they check how the parts relate, and what the words mean."},
 {"id":"tests","gap":0.8,"text":"The agent writes the two checks as tests, before any model, and Jun approves them."},
 {"id":"only","gap":0.8,"text":"From then on, only a person can change them, so the agent can't pass by moving the mark."},
 {"id":"wrong","gap":0.8,"text":"And what everyone already uses can be wrong, sometimes for years: if the data disagrees, the agent says so, with its evidence."},
 {"id":"options","gap":0.8,"text":"Where nobody can say what's right, it brings the options, each with its result, for a person to choose."},
 {"id":"like","gap":0.3,"text":"Like Singapore's 190 measures, written before the plant made any water:","say":"Like Singapore's hundred and ninety measures, written before the plant made any water:"},
 {"id":"meet","gap":0.8,"text":"none said what the results would be, only what the water had to meet."}
]},
"do":{"name":"Do","lead":1.0,"tail":1.0,"vo":[
 {"id":"works","gap":0.8,"text":"Now the agent works, in its sandbox, with only the tools the plan gave it."},
 {"id":"builds","gap":0.8,"text":"It reads the three words in Docs, finds the tables in Catalog, and builds the count by level."},
 {"id":"red","gap":0.8,"text":"The first run fails a test: the two levels add up to 18,384.","say":"The first run fails a test: the two levels add up to eighteen thousand three hundred and eighty-four."},
 {"id":"short","gap":0.8,"text":"Twenty-eight students are missing."},
 {"id":"looks","gap":0.8,"text":"It looks, with Query: on census day, 28 students have no level.","say":"It looks, with Query: on census day, twenty-eight students have no level."},
 {"id":"exchange","gap":0.8,"text":"They're exchange students, taking single units, with no degree here."},
 {"id":"since","gap":0.8,"text":"And it isn't new: since 2021, when exchange students moved to a system of their own, none has had a level.","say":"And it isn't new: since twenty twenty-one, when exchange students moved to a system of their own, none has had a level."},
 {"id":"split","gap":0.8,"text":"So every split by level since then was short, and nothing checked that the levels added up."},
 {"id":"doesnt","gap":0.8,"text":"It doesn't drop them, and it doesn't touch the test."},
 {"id":"meaning","gap":0.8,"text":"Which level they belong to is a meaning, and meanings are Mei's to decide."},
 {"id":"asks","gap":0.3,"text":"So it stops, and asks her, with its query, the result, and two options that both add up:"},
 {"id":"options","gap":0.8,"text":"a level of their own, or the level each one studies at home."},
 {"id":"mei","gap":0.8,"text":"Mei checks the government's list: they count as non-award, a level of its own."},
 {"id":"years","gap":0.8,"text":"And the years before go to Planning, with the agent's evidence, for people to look into."},
 {"id":"again","gap":0.8,"text":"The agent adds the third level, and runs the tests again: 13,906, 4,478 and 28 add up to 18,412, and every student has one level.","say":"The agent adds the third level, and runs the tests again: thirteen thousand nine hundred and six, four thousand four hundred and seventy-eight and twenty-eight add up to eighteen thousand four hundred and twelve, and every student has one level."},
 {"id":"pass","gap":0.8,"text":"Both tests pass."},
 {"id":"pr","gap":0.3,"text":"It writes the model's description from the glossary, with its source, and opens a pull request:"},
 {"id":"evidence","gap":0.8,"text":"what it changed, why, and the evidence for every claim."}
]},
"check":{"name":"Check","lead":1.2,"tail":1.2,"vo":[
 {"id":"person","gap":0.8,"text":"Now a person checks the work, against the plan, not against the agent's word."},
 {"id":"jun","gap":0.8,"text":"Jun reads the pull request: the goal met, only the tools it was given, no names, and both tests untouched, and green."},
 {"id":"rounds","gap":0.8,"text":"It took four of its ten rounds."},
 {"id":"his","gap":0.8,"text":"Now the change is his: if the count is wrong, he answers for it, not the agent."},
 {"id":"noor","gap":0.8,"text":"To reach production, a second person must approve it: Noor, the data architect."},
 {"id":"never","gap":0.8,"text":"The agent can review, too, but only for reference: it never approves."},
 {"id":"outside","gap":0.8,"text":"As in Singapore, the work is held to its checks by people who didn't do it."}
]},
"leaves":{"name":"What the loop leaves","lead":1.0,"tail":1.0,"vo":[
 {"id":"next","gap":0.8,"text":"And each loop leaves something for the next one."},
 {"id":"decision","gap":0.8,"text":"A decision, recorded: Mei's rule for exchange students, with her name."},
 {"id":"meta","gap":0.8,"text":"Metadata: level of study, in the glossary and in the model's description, with its source."},
 {"id":"skill","gap":0.8,"text":"A skill, updated: reconcile and diff now checks that every split adds up to its total."},
 {"id":"plan","gap":0.8,"text":"And the plan itself: the next one starts from this page."}
]},
"trust":{"name":"Trust, earned","lead":1.0,"tail":1.0,"vo":[
 {"id":"sg","gap":0.8,"text":"In Singapore, the measures were set before the first drop, and people from outside held the water to them."},
 {"id":"bottle","gap":0.8,"text":"So when 60,000 people raised a bottle, they had good reason to trust it.","say":"So when sixty thousand people raised a bottle, they had good reason to trust it."},
 {"id":"uni","gap":0.8,"text":"At the university, the checks came before the agent's first step, and a person held its work to them."},
 {"id":"send","gap":0.8,"text":"So the count can go to the government, with its evidence."},
 {"id":"take","gap":0.8,"text":"Decide how you'll check before the agent starts."}
]}
};

const VODUR={"water/city": 7.164, "water/piped": 7.271, "water/clean": 5.682, "water/fear": 2.901, "water/trust": 5.796, "water/change": 3.554, "water/study": 5.431, "water/before": 4.023, "water/measures": 6.883, "water/panel": 6.236, "water/report": 5.105, "water/parade": 6.41, "water/flows": 5.187, "water/today": 5.805, "water/data": 7.672, "water/unless": 5.087, "water/first": 4.084, "long/once": 6.17, "long/knew": 5.618, "long/pages": 2.852, "long/docs": 4.774, "long/other": 2.819, "long/caught": 2.747, "long/broken": 5.803, "long/waste": 5.277, "plan/asks": 6.306, "plan/page": 2.678, "plan/goal": 4.908, "plan/reads": 7.256, "plan/tools": 3.526, "plan/writes": 3.028, "plan/never": 4.76, "plan/limit": 2.89, "define/matters": 5.411, "define/unknown": 3.267, "define/must": 3.181, "define/adds": 6.127, "define/one": 4.085, "define/neither": 5.606, "define/tests": 4.67, "define/only": 5.335, "define/wrong": 7.968, "define/options": 6.078, "define/like": 4.597, "define/meet": 3.598, "do/works": 4.204, "do/builds": 5.798, "do/red": 5.703, "do/short": 1.544, "do/looks": 4.247, "do/exchange": 3.705, "do/since": 6.906, "do/split": 5.159, "do/doesnt": 2.62, "do/meaning": 4.086, "do/asks": 5.291, "do/options": 3.282, "do/mei": 4.364, "do/years": 4.815, "do/again": 14.337, "do/pass": 1.159, "do/pr": 5.51, "do/evidence": 3.16, "check/person": 4.44, "check/jun": 7.488, "check/rounds": 1.524, "check/his": 4.495, "check/noor": 4.866, "check/never": 4.113, "check/outside": 4.166, "leaves/next": 2.231, "leaves/decision": 4.052, "leaves/meta": 5.048, "leaves/skill": 5.585, "leaves/plan": 3.112, "trust/sg": 5.947, "trust/bottle": 4.256, "trust/uni": 5.696, "trust/send": 2.994, "trust/take": 2.461};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the answer taking its tick and becoming the title card; and the end card. The parade holds a moment without words. */
const BREATH={
"water":{"hold":{"piped":0.6,"clean":0.4,"fear":0.8,"trust":0.2,"change":0.8,"study":0.2,"measures":1.6,"panel":0.4,"report":0.6,"parade":1.6,"flows":0.6,"today":0.8,"data":0.2,"unless":0.4,"first":0.6},"breathe":4.6},
"long":{"hold":{"once":0.6,"knew":0.8,"pages":1.4,"docs":1.0,"other":1.0,"caught":1.0,"broken":0.8,"waste":1.4}},
"plan":{"hold":{"asks":0.4,"page":0.6,"goal":0.4,"reads":0.4,"tools":0.4,"writes":0.4,"never":0.6,"limit":1.2}},
"define":{"hold":{"matters":0.8,"unknown":1.2,"one":0.8,"neither":1.6,"tests":1.0,"only":1.2,"wrong":1.5,"options":1.6,"meet":1.4}},
"do":{"hold":{"works":0.2,"builds":0.8,"red":0.6,"short":0.4,"looks":0.2,"exchange":0.4,"since":0.8,"split":1.0,"doesnt":1.0,"meaning":0.2,"options":1.0,"mei":0.8,"years":1.0,"again":0.4,"pass":1.0,"evidence":1.2}},
"check":{"hold":{"person":0.8,"jun":1.0,"rounds":1.0,"his":1.0,"noor":1.0,"never":1.0,"outside":1.2}},
"leaves":{"hold":{"next":0.4,"decision":0.6,"meta":0.6,"skill":0.6,"plan":1.4}},
"trust":{"hold":{"sg":0.4,"bottle":1.0,"uni":0.4,"send":0.8},"breathe":4.8}
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
AG_ROOMS.labNight="lab";                                    // the lab by night is the lab: its camera glides on, never jumps
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

/* ===== Plan, define the check, do, check: Singapore, 1998 to 2003 =====
   The opening's places, painted full-frame in the module's matte style (no outlines, muted colours, daylight from the right, soft
   contact shadows), dressed for their time. Each is a place painted once (AG_PLACES.pc*); what moves in it is drawn live by the
   helpers beside it. Every name here starts with pc_ or PC_. Water is a pale sea-glass green (PC_SEA) and the rain a pale grey
   (PC_RAIN): neither is one of the module's meaning colours, and nothing in Singapore wears them.
     pc_scr(ctx, S, fn)             draw in screen space, whatever the camera is doing (a tag)
     pc_tag(ctx, text, a, o)        the place and year, on a small card at the top left
     pc_rain(ctx, t, front, a)      a band of rain moving in from the left, as far as front (x); it falls on the sea as rings
     pc_flow(ctx, pts, col, t, o)   water moving along a pipe: o.u how much has arrived, o.w its width
     pc_bottle(ctx, x, y, h, o)     a plain glass bottle, no label: o.line (the mark on it), o.fill (0 to 1, up to the mark), o.pour
     pc_glass(ctx, x, y, s, o)      a drinking glass, o.fill
     pc_list(ctx, x, y, w, u, o)    "How it will be judged · 190 measures", unrolling as u goes 0 to 1
     pc_year(ctx, x, y, w, roll, o) a small calendar card turning from 2000 to 2002 as roll goes 0 to 2
   The places: pcCity (the island city across the water), pcMap (the island, the strait and the mainland), pcStreet (a sink, its
   drain, the pipe under the road and a plant, cut open), pcKitchen (a kitchen of the late 1990s), pcPlant (the test plant),
   pcPanel (the panel's room; its table is drawn live, over the people: pc_panelTable), pcStadium (the parade at dusk; the raised
   bottles are drawn live: pc_crowd), pcReservoir and pcBench (a laboratory bench, today). */

const PC_SEA=[178,208,196],PC_SEAD=[128,164,154],PC_RAIN=[196,200,204],PC_LEAF=[98,126,94];
const PC_SKIN=[[232,196,164],[214,170,134],[180,128,98],[128,88,66],[238,208,186]];

/* ---------------------------------------------------------------- small helpers */
const pc_shade=(c,k)=>[c[0]*k,c[1]*k,c[2]*k];
// a Catmull-Rom spline through the points, n steps between each
function pc_smooth(pts,n){const out=[],Q=[pts[0]].concat(pts,[pts[pts.length-1]]);
  for(let i=1;i<Q.length-2;i++)for(let k=0;k<n;k++){const u=k/n,u2=u*u,u3=u2*u,f=(a,b,c,d)=>0.5*(2*b+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3);
    out.push([f(Q[i-1][0],Q[i][0],Q[i+1][0],Q[i+2][0]),f(Q[i-1][1],Q[i][1],Q[i+1][1],Q[i+2][1])]);}out.push(pts[pts.length-1]);return out;}
// a closed smooth outline through the points (it wraps round)
function pc_loopPts(pts,n){const k=pts.length,Q=[pts[k-1]].concat(pts,[pts[0],pts[1]]),out=[];
  for(let i=1;i<=k;i++)for(let j=0;j<n;j++){const u=j/n,u2=u*u,u3=u2*u,f=(a,b,c,d)=>0.5*(2*b+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3);
    out.push([f(Q[i-1][0],Q[i][0],Q[i+1][0],Q[i+2][0]),f(Q[i-1][1],Q[i][1],Q[i+1][1],Q[i+2][1])]);}return out;}
function pc_path(c,Q){c.moveTo(Q[0][0],Q[0][1]);for(let i=1;i<Q.length;i++)c.lineTo(Q[i][0],Q[i][1]);c.closePath();}
function pc_poly(c,Q){c.beginPath();pc_path(c,Q);}
// an irregular soft blob: an ellipse whose edge wanders (amp), for crowns of trees and clouds
function pc_blobPts(cx,cy,rx,ry,seed,amp,n){n=n||48;const out=[];for(let i=0;i<n;i++){const a=i/n*TAU,k=1+amp*(AG_NZ.fbm(Math.cos(a)*1.6+seed*3.1,Math.sin(a)*1.6+seed*1.7,3)-0.5)*2;
  out.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}return out;}
function pc_blob(c,cx,cy,rx,ry,seed,amp,fill){pc_poly(c,pc_blobPts(cx,cy,rx,ry,seed,amp));c.fillStyle=fill;c.fill();}
// a sky: top to low, with a soft glow where the sun is, sun [x, y, r, a]
function pc_sky(c,top,low,hz,sun,mid){const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(top,1));if(mid)g.addColorStop(mid[1],rgba(mid[0],1));g.addColorStop(1,rgba(low,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+2);
  if(sun){const r=c.createRadialGradient(sun[0],sun[1],8,sun[0],sun[1],sun[2]);r.addColorStop(0,"rgba(255,246,228,"+(sun[3]||0.5)+")");r.addColorStop(1,"rgba(255,246,228,0)");c.fillStyle=r;c.fillRect(0,0,W,hz+2);}}
// light from the right over a whole place, and its near edge a little darker
function pc_light(c,k){k=k==null?1:k;let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,"+0.12*k+")");g.addColorStop(0.55,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,246,228,"+0.08*k+")");
  c.fillStyle=g;c.fillRect(0,0,W,H);g=c.createLinearGradient(0,900,0,H);g.addColorStop(0,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(40,34,28,"+0.12*k+")");c.fillStyle=g;c.fillRect(0,900,W,H-900);}
function pc_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// the place and year, on a small card at the top left, in screen space
function pc_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.2)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(243,241,237,0.95)";ctx.fill();ctx.restore();
  ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,12);ctx.stroke();ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}
// a tree of the tropics: a short trunk and a wide, layered crown, lit from the right; s 1 is about 300 px tall
function pc_tree(c,x,y,s,seed,o){o=o||{};const R=ag_rnd(seed),leaf=o.leaf||PC_LEAF,trunk=o.trunk||[100,90,80],wide=o.wide||1;c.save();c.translate(x,y);c.scale(s,s);
  if(!o.noShadow)ag_floorShadow(c,-60,6,170*wide,18,0.22);
  c.fillStyle=rgba(trunk,1);c.beginPath();c.moveTo(-14,0);c.bezierCurveTo(-12,-50,-10,-90,-40,-150);c.lineTo(-30,-156);c.bezierCurveTo(-8,-120,0,-118,6,-126);
  c.bezierCurveTo(16,-150,36,-170,60,-180);c.lineTo(64,-172);c.bezierCurveTo(34,-150,18,-100,16,0);c.closePath();c.fill();
  const cy=-220,base=[[0,cy,190*wide,70,0.2]];for(let i=0;i<10;i++){const a=R()*TAU,r=R();base.push([Math.cos(a)*150*wide*r,cy+Math.sin(a)*40*r-8,70+R()*60,36+R()*22,0.25]);}
  base.forEach((b,i)=>pc_blob(c,b[0],b[1],b[2],b[3],seed+i*0.37,b[4],rgba(pc_shade(leaf,0.74),1)));
  base.slice(1).forEach((b,i)=>{const k=clamp(0.5+b[0]/300-(b[1]-cy)/120,0,1);pc_blob(c,b[0]+12,b[1]-12,b[2]*0.74,b[3]*0.66,seed+i*1.3,0.3,rgba(mix(leaf,pc_shade(leaf,1.24),k),1));});
  for(let i=0;i<10;i++){const a=R()*TAU,r=R();pc_blob(c,Math.cos(a)*110*wide*r+60,cy-30+Math.sin(a)*26*r,22+R()*14,12+R()*8,seed+i*2.1,0.3,rgba(pc_shade(leaf,1.32),0.5));}
  c.restore();}
// a block of flats or offices seen from far off: its face w x h from (x, y), lit from the right; o.floors of windows in rows or
// o.cols columns; o.corr the long corridors of a slab block; o.side a sliver of its right side; o.base its colour
function pc_bldg(c,x,y,w,h,o){o=o||{};const base=o.base||[218,212,200];
  if(o.side){c.fillStyle=rgba(pc_shade(base,1.06),1);c.beginPath();c.moveTo(x+w,y);c.lineTo(x+w+o.side,y+o.side*0.16);c.lineTo(x+w+o.side,y+h);c.lineTo(x+w,y+h);c.closePath();c.fill();}
  c.fillStyle=rgba(base,1);c.fillRect(x,y,w,h);
  const fl=o.floors||0,pitch=fl?(h-(o.top||10))/fl:0,win=o.win||[118,126,132];
  for(let f=0;f<fl;f++){const yy=y+(o.top||10)+f*pitch;
    if(o.corr){c.fillStyle=rgba(pc_shade(base,0.78),0.8);c.fillRect(x+2,yy+pitch*0.3,w-4,pitch*0.34);c.fillStyle="rgba(255,252,244,0.22)";c.fillRect(x+2,yy+pitch*0.64,w-4,Math.max(1,pitch*0.12));}
    else if(o.cols){const cw=(w-8)/o.cols;for(let k=0;k<o.cols;k++){c.fillStyle=rgba(win,0.62);c.fillRect(x+4+k*cw+cw*0.2,yy+pitch*0.22,cw*0.6,pitch*0.5);}}
    else{c.fillStyle=rgba(win,0.5);c.fillRect(x+4,yy+pitch*0.24,w-8,pitch*0.4);}}
  if(o.glass){const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(mix(base,[150,164,176],0.5),0.5));g.addColorStop(1,"rgba(255,255,255,0.08)");c.fillStyle=g;c.fillRect(x,y,w,h);}
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(40,34,28,0.1)");g.addColorStop(1,"rgba(255,248,236,0.08)");c.fillStyle=g;c.fillRect(x,y,w,h);
  if(o.roof){c.fillStyle=rgba(pc_shade(base,0.84),1);c.fillRect(x-3,y-6,w+6,6);}}
// a line of green along a shore or a bank, its foot at y: many overlapping crowns, lit from the right; o.top how high it rises, o.amp
// how much that varies, o.dark to shade a nearer line
function pc_greenLine(c,y,seed,o){o=o||{};const R=ag_rnd(seed),top=o.top||40,amp=o.amp||20,dk=o.dark||1,n=o.n||70;
  for(let i=0;i<n;i++){const x=(i+R()*0.8)*W/n*1.04-30,h=top+(R()-0.3)*amp,rx=24+R()*36,ry=14+R()*14,leaf=pc_shade(mix(PC_LEAF,[132,150,118],R()*0.6),dk);
    pc_blob(c,x,y-h*0.55,rx,ry+h*0.25,seed+i*0.7,0.28,rgba(pc_shade(leaf,0.8),1));pc_blob(c,x+8,y-h*0.62,rx*0.7,ry*0.8+h*0.12,seed+i*1.9,0.3,rgba(mix(leaf,pc_shade(leaf,1.25),0.6),1));}
  c.fillStyle=rgba(pc_shade(PC_LEAF,0.66*dk),1);c.fillRect(0,y-10,W,12);}
// low hills along a line: points [x, y], filled down to bottom
function pc_hills(c,pts,bottom,col){const S=pc_smooth(pts,10);c.beginPath();c.moveTo(S[0][0],bottom);for(const p of S)c.lineTo(p[0],p[1]);c.lineTo(S[S.length-1][0],bottom);c.closePath();c.fillStyle=rgba(col,1);c.fill();}

/* ---------------------------------------------------------------- water moving along a pipe, and a band of rain
   pc_flow: pts the pipe's path; col its water; o.u (0 to 1) how much of the path the water has reached; o.w its width; o.speed in
   px a second; o.a. The pipe's bore is drawn by the place; this draws the water in it, its soft body and short dashes moving along. */
function pc_flow(ctx,pts,col,t,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u,w=o.w||10,sp=o.speed||90;if(a<=0.01||u<=0.01)return;
  const S=pc_smooth(pts,10),L=[0];for(let i=1;i<S.length;i++)L.push(L[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));const tot=L[L.length-1]||1,show=tot*clamp(u,0,1);
  const pt=d=>{let i=1;while(i<L.length-1&&L[i]<d)i++;const k=(d-L[i-1])/((L[i]-L[i-1])||1);return[lerp(S[i-1][0],S[i][0],k),lerp(S[i-1][1],S[i][1],k)];};
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(S[0][0],S[0][1]);for(let i=1;i<S.length&&L[i]<=show;i++)ctx.lineTo(S[i][0],S[i][1]);const e=pt(show);ctx.lineTo(e[0],e[1]);
  ctx.strokeStyle=rgba(col,0.55*a);ctx.lineWidth=w;ctx.stroke();
  const dash=o.dash||28,gap=o.gap||34,off=((t*sp)%(dash+gap)+dash+gap)%(dash+gap);ctx.strokeStyle=rgba(mix(col,[255,255,255],0.45),0.8*a);ctx.lineWidth=Math.max(2,w*0.32);
  for(let d=-dash-gap+off;d<show;d+=dash+gap){const d0=Math.max(0,d),d1=Math.min(show,d+dash);if(d1-d0<2)continue;const p0=pt(d0),p1=pt((d0+d1)/2),p2=pt(d1);
    ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.lineTo(p2[0],p2[1]);ctx.stroke();}
  ctx.restore();}
// rain from the left as far as front (x): its cloud's shadow over the sky and the city, streaks falling, and rings on the sea below hz
const PC_DROPS=(()=>{const R=ag_rnd(808),out=[];for(let i=0;i<220;i++)out.push([R()*2200-140,R(),0.6+R()*0.6,R()]);return out;})();
function pc_rain(ctx,t,front,a,hz){if(a<=0.01||front<=-200)return;hz=hz||PC_HZ;ctx.save();ctx.globalAlpha*=a;
  let g=ctx.createLinearGradient(front-700,0,front+120,0);g.addColorStop(0,"rgba(104,112,120,0.34)");g.addColorStop(0.82,"rgba(104,112,120,0.22)");g.addColorStop(1,"rgba(104,112,120,0)");
  ctx.fillStyle=g;ctx.fillRect(-200,0,front+320,hz-60);ctx.globalAlpha=a*0.6;ctx.fillRect(-200,hz-60,front+320,60);ctx.globalAlpha=a*0.25;ctx.fillRect(-200,hz,front+320,50);ctx.globalAlpha=a;
  ctx.strokeStyle=rgba(PC_RAIN,0.5);ctx.lineCap="round";
  for(const d of PC_DROPS){if(d[0]>front)continue;const y=((d[1]*1300+t*820*d[2])%1300)-160,x=d[0]-y*0.18;if(y>hz+60)continue;ctx.lineWidth=1.6+d[3];
    ctx.globalAlpha=a*clamp((front-d[0])/160,0,1)*0.7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-11,y+52);ctx.stroke();}
  ctx.globalAlpha=a;for(let i=0;i<46;i++){const x=hash(i,3)*front,y=hz+30+hash(i,7)*(H-hz-200),ph=(t*1.4+hash(i,11))%1;if(x>front-40)continue;
    ctx.strokeStyle=rgba(PC_RAIN,0.6*(1-ph));ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(x,y,6+ph*26*(0.6+(y-hz)/600),2+ph*7*(0.6+(y-hz)/600),0,0,TAU);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- a bottle, a glass, the list, a calendar */
// a plain glass bottle standing at (x, y), h tall: o.line the mark (0 to 1 up the body), o.fill (0 to 1 of the way to it), o.pour
// (0 to 1, a thin stream into its neck), o.a, o.tilt (radians, about its foot)
function pc_bottle(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=h*0.36,nk=h*0.12,sh=h*0.22,body=h-nk-sh,line=o.line==null?0.78:o.line;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);if(o.tilt)ctx.rotate(o.tilt);
  const P_=c=>{c.moveTo(-w/2+w*0.12,0);c.quadraticCurveTo(-w/2,0,-w/2,-w*0.12);c.lineTo(-w/2,-body);c.bezierCurveTo(-w/2,-body-sh*0.6,-nk*0.9,-body-sh*0.7,-nk*0.62,-body-sh);
    c.lineTo(-nk*0.62,-h+h*0.02);c.lineTo(nk*0.62,-h+h*0.02);c.lineTo(nk*0.62,-body-sh);c.bezierCurveTo(nk*0.9,-body-sh*0.7,w/2,-body-sh*0.6,w/2,-body);c.lineTo(w/2,-w*0.12);c.quadraticCurveTo(w/2,0,w/2-w*0.12,0);c.closePath();};
  if(!o.noShadow)ag_floorShadow(ctx,AG.sdx*h/120,2,w*0.9,h*0.06,0.26);
  // the water inside, up to the mark
  const lvl=body*line*clamp(o.fill==null?1:o.fill,0,1);
  if(lvl>0.5){ctx.save();ctx.beginPath();P_(ctx);ctx.clip();const g=ctx.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,rgba(pc_shade(PC_SEA,0.86),0.85));g.addColorStop(0.7,rgba(PC_SEA,0.75));g.addColorStop(1,rgba(mix(PC_SEA,[255,255,255],0.4),0.7));
    ctx.fillStyle=g;ctx.fillRect(-w,-lvl,2*w,lvl+2);ctx.fillStyle="rgba(255,255,255,0.55)";ctx.fillRect(-w/2,-lvl-1,w,2.2);ctx.restore();}
  // the glass: a faint tint, its edge, a long highlight on the window's side
  ctx.beginPath();P_(ctx);ctx.fillStyle="rgba(226,236,236,0.28)";ctx.fill();ctx.strokeStyle="rgba(112,128,132,0.6)";ctx.lineWidth=Math.max(1.4,h/90);ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,0.6)";ctx.beginPath();ag_rect(ctx,w/2-w*0.2,-body+w*0.1,w*0.09,body*0.78,w*0.05);ctx.fill();
  // the mark: a small line etched on the glass
  const my=-body*line;ctx.strokeStyle="rgba(60,64,70,0.85)";ctx.lineWidth=Math.max(1.6,h/70);ctx.beginPath();ctx.moveTo(-w/2-2,my);ctx.lineTo(-w/2+w*0.32,my);ctx.stroke();
  // o.mark (0 to 1): the mark picked out, a soft light along it and a short line on across the glass, as what the water must reach
  const mk=clamp(o.mark||0,0,1);if(mk>0.01){ctx.save();ctx.lineCap="round";ctx.strokeStyle="rgba(255,255,255,"+0.7*mk+")";ctx.lineWidth=Math.max(6,h/22);
    ctx.beginPath();ctx.moveTo(-w/2-8,my);ctx.lineTo(w/2+8,my);ctx.stroke();ctx.strokeStyle="rgba(60,64,70,"+0.8*mk+")";ctx.lineWidth=Math.max(1.6,h/70);
    ctx.setLineDash([h/40,h/50]);ctx.beginPath();ctx.moveTo(-w/2+w*0.32,my);ctx.lineTo(w/2+8,my);ctx.stroke();ctx.restore();}
  // the cap ring
  ctx.fillStyle="rgba(150,160,162,0.7)";ctx.fillRect(-nk*0.7,-h+h*0.01,nk*1.4,h*0.035);
  if(o.pour>0.01){ctx.strokeStyle=rgba(pc_shade(PC_SEA,0.8),0.9*clamp(o.pour,0,1));ctx.lineWidth=Math.max(3,h/45);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,-h-h*0.7);ctx.lineTo(0,-lvl);ctx.stroke();}
  ctx.restore();}
// a drinking glass standing at (x, y), s 1 about 120 px tall: o.fill (0 to 1)
function pc_glass(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const P_=c=>{c.moveTo(-34,-120);c.lineTo(34,-120);c.lineTo(28,-4);c.quadraticCurveTo(27,0,22,0);c.lineTo(-22,0);c.quadraticCurveTo(-27,0,-28,-4);c.closePath();};
  if(!o.noShadow)ag_floorShadow(ctx,-8,2,40,6,0.24);
  const f=clamp(o.fill==null?0.8:o.fill,0,1)*104;
  if(f>0.5){ctx.save();ctx.beginPath();P_(ctx);ctx.clip();ctx.fillStyle=rgba(PC_SEA,0.62);ctx.fillRect(-40,-f-6,80,f+6);ctx.fillStyle="rgba(255,255,255,0.6)";ctx.fillRect(-40,-f-7,80,2.4);ctx.restore();}
  ctx.beginPath();P_(ctx);ctx.fillStyle="rgba(230,238,238,0.3)";ctx.fill();ctx.strokeStyle="rgba(112,128,132,0.65)";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,0.6)";ctx.fillRect(18,-110,5,92);ctx.restore();}
// the list of measures, unrolling from its top (u 0 to 1): a long sheet with its head and three kinds of measure, then where they
// come from; o.k[0..3] each line's own fade; returns its box
function pc_list(ctx,x,y,w,u,o){o=o||{};const a=o.a==null?1:o.a,H_=392,h=lerp(96,H_,ag_sine(clamp(u,0,1))),b={x,y,w,h:H_};if(a<=0.01||u<=0)return b;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,18,{});ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  ag_T(ctx,"HOW IT WILL BE JUDGED",x+28,y+48,{w:700,size:28,ls:4,col:AG.mut});ag_T(ctx,"190 measures",x+28,y+102,{w:800,size:48});
  const k=o.k||[1,1,1,1],rows=["physical","chemical","microbiological"];
  rows.forEach((s,i)=>{const ka=clamp(k[i],0,1);if(ka<=0)return;const yy=y+170+i*52;ctx.strokeStyle="rgba(60,64,70,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,yy-10);ctx.lineTo(x+48,yy-10);ctx.stroke();
    ag_T(ctx,s,x+62,yy,{w:600,size:32,a:ka});});
  const ka=clamp(k[3],0,1);if(ka>0){ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+28,y+318);ctx.lineTo(x+w-28,y+318);ctx.stroke();
    ag_T(ctx,"from the world's drinking-water standards",x+28,y+360,{w:500,size:28,col:AG.mut,a:ka});}
  ctx.restore();
  // the roll at its foot, while it unrolls
  const ru=1-ag_in(u,0.9,0.1);if(ru>0.01){ctx.save();ctx.globalAlpha*=ru;const ry=y+h;const g=ctx.createLinearGradient(0,ry-14,0,ry+14);g.addColorStop(0,"#E9E6E0");g.addColorStop(0.5,"#F6F4F0");g.addColorStop(1,"#D8D3CA");
    ctx.fillStyle=g;ctx.beginPath();ag_rect(ctx,x-6,ry-14,w+12,28,14);ctx.fill();ctx.restore();}
  ctx.restore();return b;}
// a small calendar card: its year rolls from 2000 to 2002 as roll goes 0 to 2
function pc_year(ctx,x,y,w,roll,o){o=o||{};const a=o.a==null?1:o.a,h=140;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,16,{});
  ctx.save();ctx.beginPath();ag_rect(ctx,x,y,w,h,16);ctx.clip();ctx.fillStyle=rgba(AG_OAK.dark,0.9);ctx.fillRect(x,y,w,40);ctx.restore();
  for(const rx of [x+w*0.28,x+w*0.72]){ctx.fillStyle="#5A564F";ctx.beginPath();ag_rect(ctx,rx-5,y-12,10,26,5);ctx.fill();}
  const r=clamp(roll,0,2),i=Math.min(1,Math.floor(r)),f=ag_sine(r-i);ctx.save();ctx.beginPath();ctx.rect(x,y+42,w,h-42);ctx.clip();
  const ys=["2000","2001","2002"];if(r>=2)ag_T(ctx,ys[2],x+w/2,y+110,{w:800,size:44,align:"center"});
  else{ag_T(ctx,ys[i],x+w/2,y+110-70*f,{w:800,size:44,align:"center",a:1-f});ag_T(ctx,ys[i+1],x+w/2,y+110+70*(1-f),{w:800,size:44,align:"center",a:f});}
  ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- Singapore, the late 1990s: the island city across the water */
const PC_HZ=690;
AG_PLACES.pcCity=c=>{const HZ=PC_HZ;
  pc_sky(c,[166,182,194],[234,232,224],HZ,[1780,300,900,0.45],[[208,214,214],0.55]);
  for(const cl of [[380,170,320,40,1],[1000,118,400,46,2],[1520,214,280,30,3]]){pc_blob(c,cl[0],cl[1],cl[2],cl[3],cl[4],0.4,"rgba(250,248,242,0.5)");pc_blob(c,cl[0]+30,cl[1]-8,cl[2]*0.6,cl[3]*0.6,cl[4]+9,0.4,"rgba(255,252,246,0.5)");}
  // far hills, in the haze
  pc_hills(c,[[0,560],[260,540],[520,566],[760,548],[1080,572],[1340,546],[1620,560],[1920,540]],HZ,[166,180,164]);
  let g=c.createLinearGradient(0,500,0,HZ);g.addColorStop(0,"rgba(232,232,226,0)");g.addColorStop(0.5,"rgba(232,232,226,0.45)");g.addColorStop(1,"rgba(232,232,226,0.1)");c.fillStyle=g;c.fillRect(0,500,W,HZ-500);
  // towers behind, pale in the haze
  const far=[[860,380,90],[960,330,70],[1040,300,96],[1150,352,80],[1240,410,92],[780,436,74]];
  for(const b of far)pc_bldg(c,b[0],b[1],b[2],HZ-b[1],{base:[200,204,206],floors:Math.round((HZ-b[1])/18),win:[164,170,176],glass:1,side:8,roof:1});
  // blocks of flats: long slabs with their corridors, and tall point blocks, in the city's pale creams and greys
  const flats=[[40,470,300,[224,218,204],1],[330,500,210,[214,206,196],0],[560,452,230,[226,220,210],1],[1320,476,260,[222,214,200],1],[1590,446,150,[212,208,200],0],[1750,490,220,[226,222,212],1]];
  for(const f of flats){const hh=HZ-12-f[1];pc_bldg(c,f[0],f[1],f[2],hh,{base:f[3],floors:Math.round(hh/16),corr:f[4],cols:f[4]?0:Math.round(f[2]/26),side:12,roof:1});}
  g=c.createLinearGradient(0,400,0,HZ);g.addColorStop(0,"rgba(236,234,228,0)");g.addColorStop(0.6,"rgba(236,234,228,0.26)");g.addColorStop(1,"rgba(236,234,228,0)");c.fillStyle=g;c.fillRect(0,400,W,HZ-400);
  // the green along the shore: a few rain trees with wide crowns over a dense, uneven line of smaller ones, and the sea wall
  pc_greenLine(c,HZ-8,77,{top:52,amp:34});
  for(const [x,s,k] of [[150,0.42,1],[690,0.36,2],[1420,0.4,3],[1860,0.34,4]])pc_tree(c,x,HZ-6,s,40+k,{noShadow:true,wide:1.4,leaf:mix(PC_LEAF,[120,140,110],0.3)});
  pc_greenLine(c,HZ-2,91,{top:22,amp:16,dark:0.86});
  c.fillStyle=rgba([196,194,186],1);c.fillRect(0,HZ-6,W,10);c.fillStyle="rgba(40,34,28,0.16)";c.fillRect(0,HZ+4,W,3);
  // the sea: pale sea-glass, the city's reflection broken by small waves, glints where the light falls
  g=c.createLinearGradient(0,HZ,0,H);g.addColorStop(0,rgba(mix(PC_SEA,[236,238,232],0.25),1));g.addColorStop(1,rgba(pc_shade(PC_SEA,0.86),1));c.fillStyle=g;c.fillRect(0,HZ+6,W,H-HZ);
  for(const f of flats.concat(far.map(b=>[b[0],b[1],b[2],[200,204,206]]))){const rh=Math.min(260,(HZ-f[1])*0.7);const rg=c.createLinearGradient(0,HZ,0,HZ+rh);rg.addColorStop(0,rgba(pc_shade(f[3],0.92),0.22));rg.addColorStop(1,rgba(f[3],0));
    c.fillStyle=rg;c.fillRect(f[0],HZ+8,f[2],rh);}
  const R=ag_rnd(51);for(let i=0;i<260;i++){const y=HZ+12+Math.pow(R(),1.6)*(H-HZ-12),x=R()*W,l=12+R()*60*(0.4+(y-HZ)/300);c.fillStyle=R()<0.5?"rgba(255,255,255,0.2)":rgba(pc_shade(PC_SEA,0.8),0.22);c.fillRect(x,y,l,1.6+(y-HZ)/260);}
  pc_light(c,0.8);};
function pc_cityLife(ctx,t,front,a){pc_rain(ctx,t,front,a,PC_HZ);}

/* ---------------------------------------------------------------- the map: the island at the bottom, the mainland's tip across a
   narrow strait, the causeway that carries the water pipes, the sea round them */
const PC_ISL=[[560,742],[600,690],[680,640],[780,600],[880,560],[930,548],[1010,556],[1100,566],[1180,556],[1270,560],[1360,590],[1440,620],[1500,660],[1488,700],
  [1420,724],[1320,742],[1220,770],[1140,790],[1060,800],[960,792],[860,786],[760,776],[660,770]];
const PC_MAIN=[[0,500],[260,540],[460,600],[580,628],[680,600],[790,556],[880,522],[930,510],[1010,516],[1100,526],[1180,518],[1270,520],[1360,546],[1440,568],[1540,556],[1700,500],[1920,466]];
const PC_CW=[928,508,932,552];   // the causeway: from the mainland's shore to the island's
AG_PLACES.pcMap=c=>{
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(mix(PC_SEA,[236,238,232],0.3),1));g.addColorStop(1,rgba(mix(PC_SEA,[220,226,222],0.1),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // soft depth: the sea a little deeper away from the shores
  const R=ag_rnd(7);for(let i=0;i<40;i++){const x=R()*W,y=R()*H;g=c.createRadialGradient(x,y,0,x,y,180+R()*160);g.addColorStop(0,rgba(pc_shade(PC_SEA,0.94),0.18));g.addColorStop(1,rgba(PC_SEA,0));c.fillStyle=g;c.fillRect(x-360,y-360,720,720);}
  // the mainland: its shore, then the land up to the frame's top
  const M=pc_smooth(PC_MAIN,8);c.save();c.shadowColor="rgba(60,70,66,0.18)";c.shadowBlur=24;c.shadowOffsetY=8;c.beginPath();c.moveTo(0,0);for(const p of M)c.lineTo(p[0],p[1]);c.lineTo(W,0);c.closePath();
  g=c.createLinearGradient(0,0,0,520);g.addColorStop(0,rgba([200,204,176],1));g.addColorStop(1,rgba([222,218,194],1));c.fillStyle=g;c.fill();c.restore();
  c.strokeStyle="rgba(255,255,248,0.5)";c.lineWidth=3;c.beginPath();M.forEach((p,i)=>i?c.lineTo(p[0],p[1]+2):c.moveTo(p[0],p[1]+2));c.stroke();
  // forest on the mainland, and the river the water is drawn from
  for(let i=0;i<26;i++){const x=R()*W,y=40+R()*380;g=c.createRadialGradient(x,y,0,x,y,120);g.addColorStop(0,"rgba(140,160,120,0.22)");g.addColorStop(1,"rgba(140,160,120,0)");c.fillStyle=g;c.fillRect(x-120,y-120,240,240);}
  const RV=pc_smooth([[1660,0],[1610,90],[1530,170],[1480,240],[1462,310],[1490,420],[1530,548]],8);c.lineCap="round";c.lineJoin="round";
  c.strokeStyle=rgba(mix(PC_SEA,[236,238,232],0.2),1);c.lineWidth=14;c.beginPath();RV.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  c.strokeStyle="rgba(255,255,255,0.35)";c.lineWidth=3;c.stroke();
  // the island, a little warmer, with a soft shore
  const I=pc_loopPts(PC_ISL,8);c.save();c.shadowColor="rgba(60,70,66,0.2)";c.shadowBlur=26;c.shadowOffsetY=10;pc_poly(c,I);g=c.createLinearGradient(0,540,0,800);g.addColorStop(0,rgba([224,220,198],1));g.addColorStop(1,rgba([214,208,186],1));c.fillStyle=g;c.fill();c.restore();
  c.save();pc_poly(c,I);c.clip();for(let i=0;i<14;i++){const x=640+R()*820,y=590+R()*180;g=c.createRadialGradient(x,y,0,x,y,90);g.addColorStop(0,"rgba(150,168,132,0.22)");g.addColorStop(1,"rgba(150,168,132,0)");c.fillStyle=g;c.fillRect(x-90,y-90,180,180);}c.restore();
  c.strokeStyle="rgba(255,255,248,0.55)";c.lineWidth=3;pc_poly(c,I);c.stroke();
  // two small islands off the south coast
  pc_blob(c,1010,842,46,14,3,0.3,rgba([218,212,190],1));pc_blob(c,760,824,30,10,5,0.3,rgba([218,212,190],1));
  // the causeway across the strait: a pale road on its embankment
  c.strokeStyle=rgba([190,186,172],1);c.lineWidth=16;c.lineCap="round";c.beginPath();c.moveTo(PC_CW[0],PC_CW[1]-6);c.lineTo(PC_CW[2],PC_CW[3]+6);c.stroke();
  c.strokeStyle=rgba([236,232,220],1);c.lineWidth=10;c.beginPath();c.moveTo(PC_CW[0],PC_CW[1]-6);c.lineTo(PC_CW[2],PC_CW[3]+6);c.stroke();
  pc_light(c,0.6);};
// the pipes along the causeway, and the water they bring from the mainland into the island (u 0 to 1)
const PC_PIPES=[[[1452,300],[1300,360],[1120,426],[980,474],[923,506],[924,566],[934,640]],[[1460,314],[1308,374],[1128,440],[988,488],[937,512],[940,566],[952,640]]];
function pc_mapLife(ctx,t,u,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  for(const p of PC_PIPES){ctx.strokeStyle="rgba(96,104,108,0.7)";ctx.lineWidth=9;ctx.lineCap="round";ctx.lineJoin="round";const S=pc_smooth(p,10);ctx.beginPath();S.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();
    ctx.strokeStyle="rgba(236,238,236,0.6)";ctx.lineWidth=4;ctx.stroke();pc_flow(ctx,p,pc_shade(PC_SEA,0.7),t,{u,w:6,speed:60,dash:16,gap:20});}
  ctx.restore();}

/* ---------------------------------------------------------------- a sink, its drain, the pipe under the road, and a plant, cut open */
const PC_ST={gr:560,used:[[300,452],[300,600],[330,700],[600,710],[900,712],[1040,700],[1060,600],[1066,520]],clean:[[1430,470],[1500,470],[1560,470],[1640,470],[1700,500]]};
AG_PLACES.pcStreet=c=>{const G=PC_ST.gr;
  pc_sky(c,[184,196,202],[232,230,222],G,[1700,200,700,0.4]);
  // the ground, cut through: soil in soft layers, darker as it goes down
  let g=c.createLinearGradient(0,G,0,H);g.addColorStop(0,rgba([170,150,124],1));g.addColorStop(0.5,rgba([150,130,106],1));g.addColorStop(1,rgba([128,110,90],1));c.fillStyle=g;c.fillRect(0,G,W,H-G);
  ag_grain(c,0,G,W,H-G,2.4,13);for(const [y,k] of [[640,0.08],[780,0.06],[930,0.07]]){c.fillStyle="rgba(255,240,220,"+k+")";c.fillRect(0,y,W,8);}
  // the road and the pavement on top
  c.fillStyle=rgba([150,150,148],1);c.fillRect(0,G-10,W,22);c.fillStyle=rgba([196,192,184],1);c.fillRect(0,G-16,W,8);
  // the flat, cut open: its wall, a window with the day outside, the counter and the sink
  ag_soft(c,k=>k.rect(60,150,520,G-166),[226,220,208],[240,236,228],520,220,400,"rgba(60,50,40,0.18)",22,0.5);
  c.fillStyle=rgba([206,214,214],1);c.fillRect(170,210,250,160);c.fillStyle="rgba(255,255,255,0.35)";c.fillRect(180,220,230,140);
  for(let i=0;i<6;i++){c.fillStyle="rgba(120,126,128,0.35)";c.fillRect(176,222+i*24,238,5);}
  c.fillStyle=rgba([188,178,160],1);c.fillRect(100,440,440,22);c.fillStyle=rgba([164,152,134],1);c.fillRect(110,462,420,G-478);
  c.fillStyle=rgba([210,214,214],1);c.beginPath();c.moveTo(220,440);c.lineTo(380,440);c.lineTo(366,470);c.lineTo(234,470);c.closePath();c.fill();
  c.strokeStyle="rgba(120,124,126,0.8)";c.lineWidth=6;c.beginPath();c.moveTo(352,440);c.lineTo(352,396);c.lineTo(322,396);c.stroke();
  // the pipe from the drain down under the road, and along to the plant
  const S=pc_smooth(PC_ST.used,10);c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba([104,108,110],1);c.lineWidth=26;c.beginPath();S.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  c.strokeStyle=rgba([62,60,58],1);c.lineWidth=16;c.stroke();
  // the plant: a low hall, cut open, its two stages inside
  ag_soft(c,k=>k.rect(1000,250,520,G-266),[222,224,222],[240,242,240],1460,300,420,"rgba(60,50,40,0.2)",22,0.5);
  c.fillStyle=rgba([196,200,198],1);c.fillRect(986,236,548,18);
  // stage one: fine membranes, a bundle of long white tubes
  for(let i=0;i<5;i++){const y=330+i*30;ag_soft(c,k=>ag_rect(k,1050,y,180,22,11),[238,238,236],[252,252,250],1200,y+4,90,"rgba(60,50,40,0.18)",6,0.6);}
  // stage two: a chamber of ultraviolet light, a cool white glow inside
  ag_soft(c,k=>ag_rect(k,1290,320,150,170,24),[210,214,216],[236,238,240],1420,340,140,"rgba(60,50,40,0.2)",10,0.6);
  g=c.createRadialGradient(1365,405,6,1365,405,70);g.addColorStop(0,"rgba(250,252,255,0.95)");g.addColorStop(1,"rgba(232,240,246,0)");c.fillStyle=g;c.fillRect(1290,320,150,170);
  c.strokeStyle=rgba([104,108,110],1);c.lineWidth=14;c.beginPath();c.moveTo(1066,530);c.lineTo(1066,400);c.lineTo(1050,400);c.stroke();
  c.strokeStyle=rgba([150,156,158],1);c.lineWidth=12;c.beginPath();c.moveTo(1230,400);c.lineTo(1290,404);c.stroke();
  // the pipe on to the glass
  const S2=pc_smooth(PC_ST.clean,10);c.strokeStyle=rgba([150,156,158],1);c.lineWidth=16;c.beginPath();S2.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  c.strokeStyle=rgba([214,218,218],1);c.lineWidth=9;c.stroke();
  // a small shelf for the glass
  c.fillStyle=rgba(AG_OAK.base,1);c.fillRect(1640,556,220,14);c.fillStyle=rgba(AG_OAK.dark,1);c.fillRect(1640,570,220,6);
  pc_light(c,0.7);};
function pc_streetLife(ctx,t,o){const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  pc_flow(ctx,PC_ST.used,[150,138,116],t,{u:o.used||0,w:10,speed:70});
  // inside the plant the water runs through the membranes, then past the light, and comes out clear
  const m=o.mem||0;if(m>0.01){for(let i=0;i<5;i++){const y=341+i*30;ctx.fillStyle=rgba(PC_SEA,0.5*m);ctx.fillRect(1056,y-4,lerp(0,168,clamp(m*1.4-i*0.08,0,1)),8);}}
  pc_flow(ctx,PC_ST.clean,PC_SEA,t,{u:o.clean||0,w:7,speed:60});
  pc_glass(ctx,1750,556,1.1,{fill:o.glass||0});ctx.restore();}

/* ---------------------------------------------------------------- a kitchen of the late 1990s: small white tiles, a louvred window,
   the counter with a kettle and a dish rack */
AG_PLACES.pcKitchen=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([224,222,214],1));g.addColorStop(1,rgba([212,208,198],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // tiles: a fine grid of joints, the window's light across them
  c.strokeStyle="rgba(150,146,138,0.28)";c.lineWidth=1.4;for(let x=0;x<=W;x+=38){c.beginPath();c.moveTo(x,0);c.lineTo(x,760);c.stroke();}for(let y=0;y<=760;y+=38){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // the window on the right, its louvres of glass, the day outside
  c.fillStyle=rgba([186,196,196],1);c.fillRect(1380,120,420,380);g=c.createLinearGradient(1380,120,1800,500);g.addColorStop(0,"rgba(255,255,250,0.75)");g.addColorStop(1,"rgba(236,240,236,0.4)");c.fillStyle=g;c.fillRect(1392,132,396,356);
  for(let i=0;i<9;i++){const y=146+i*38;c.fillStyle="rgba(150,160,160,0.35)";c.fillRect(1392,y,396,6);c.fillStyle="rgba(255,255,255,0.5)";c.fillRect(1392,y+6,396,2);}
  c.fillStyle=rgba([170,166,156],1);c.fillRect(1370,500,440,14);
  g=c.createRadialGradient(1500,420,40,1500,420,900);g.addColorStop(0,"rgba(255,250,236,0.35)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the counter behind them: its top, its cupboards, and on it a kettle and a dish rack
  c.fillStyle=rgba([188,182,170],1);c.fillRect(0,756,W,24);c.fillStyle=rgba([206,198,184],1);c.fillRect(0,780,W,300);
  for(let x=0;x<W;x+=240){c.fillStyle="rgba(60,50,40,0.12)";c.fillRect(x,790,3,290);c.fillStyle="rgba(60,50,40,0.25)";c.fillRect(x+200,860,18,5);}
  ag_soft(c,k=>{k.moveTo(240,756);k.bezierCurveTo(236,680,250,650,300,650);k.bezierCurveTo(350,650,364,680,360,756);k.closePath();},[196,200,202],[236,238,240],340,680,90,"rgba(40,34,28,0.25)",10,0.6);
  c.strokeStyle=rgba([90,92,96],1);c.lineWidth=7;c.beginPath();c.arc(300,646,30,Math.PI*1.1,Math.PI*1.9);c.stroke();
  c.strokeStyle="rgba(150,152,150,0.9)";c.lineWidth=3;for(let i=0;i<8;i++){c.beginPath();c.moveTo(1500+i*22,756);c.lineTo(1496+i*22,690);c.stroke();}c.fillStyle="rgba(230,232,232,0.9)";c.fillRect(1490,700,40,56);c.fillRect(1560,690,40,66);
  pc_light(c,0.7);};
// the two neighbours: one holds a glass of the water up and looks at it, the other looks at it too
const PC_W1={name:"A woman in her kitchen",key:"pc-w1",skin:[222,186,152],hair:{style:"bob",c:[30,26,28]},top:{kind:"shirt",c:[160,120,118]},breath:0.3};
const PC_W2={name:"Her neighbour",key:"pc-w2",skin:[176,126,96],hair:{style:"bun",c:[28,24,26]},earrings:[226,196,140],top:{kind:"tunic",c:[176,168,142]},breath:0.27};

/* ---------------------------------------------------------------- the test plant, 1998 to 2000: racks of long white tubes under a
   steel roof, their pipes, trees behind; dry until the list is complete */
const PC_PL={pipes:[[[1880,760],[1700,760],[1640,720],[1640,640]],[[1220,640],[1220,700],[1300,760],[1500,760]]]};
AG_PLACES.pcPlant=c=>{const HZ=640;pc_sky(c,[178,192,200],[234,232,224],HZ,[1760,260,800,0.45]);
  pc_greenLine(c,HZ+4,41,{top:120,amp:60,n:46});for(const [x,s] of [[220,0.6],[760,0.52]])pc_tree(c,x,HZ+6,s,70+x,{noShadow:true,wide:1.4});pc_greenLine(c,HZ+10,43,{top:40,amp:30,dark:0.88,n:60});
  let g=c.createLinearGradient(0,HZ,0,H);g.addColorStop(0,rgba([196,194,188],1));g.addColorStop(1,rgba([168,166,160],1));c.fillStyle=g;c.fillRect(0,HZ,W,H-HZ);ag_grain(c,0,HZ,W,H-HZ,1.8,21);
  // the hall's roof and its columns
  c.fillStyle=rgba([150,156,160],1);c.beginPath();c.moveTo(1040,190);c.lineTo(1900,160);c.lineTo(1900,200);c.lineTo(1040,226);c.closePath();c.fill();
  for(const x of [1070,1330,1600,1870]){c.fillStyle=rgba([136,142,146],1);c.fillRect(x,206,14,HZ+120-206);}
  g=c.createLinearGradient(0,226,0,HZ+80);g.addColorStop(0,"rgba(40,40,44,0.2)");g.addColorStop(1,"rgba(40,40,44,0.05)");c.fillStyle=g;c.fillRect(1070,226,820,HZ+80-226);
  // two racks of pressure tubes, four high
  for(const [x0,x1] of [[1110,1450],[1500,1840]]){c.fillStyle=rgba([120,126,130],1);c.fillRect(x0,300,10,420);c.fillRect(x1-10,300,10,420);
    for(let i=0;i<6;i++){const y=320+i*62;ag_soft(c,k=>ag_rect(k,x0+14,y,x1-x0-28,40,20),[238,238,234],[252,252,248],x1-80,y+6,180,"rgba(60,50,40,0.2)",8,0.6);
      c.fillStyle=rgba([170,174,176],1);c.fillRect(x0+10,y+6,12,28);c.fillRect(x1-22,y+6,12,28);}}
  // the pipes in, and out
  for(const p of PC_PL.pipes){const S=pc_smooth(p,8);c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba([110,116,120],1);c.lineWidth=22;c.beginPath();S.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();
    c.strokeStyle=rgba([198,202,204],1);c.lineWidth=12;c.stroke();}
  ag_floorShadow(c,1480,760,520,30,0.2);pc_light(c,0.7);};
function pc_plantLife(ctx,t,run,a){if(a<=0.01||run<=0.01)return;ctx.save();ctx.globalAlpha*=a;for(const p of PC_PL.pipes)pc_flow(ctx,p,PC_SEA,t,{u:run,w:8,speed:70});
  for(const [x0,x1] of [[1110,1450],[1500,1840]])for(let i=0;i<6;i++){const y=320+i*62,k=clamp(run*1.6-i*0.1,0,1);ctx.fillStyle=rgba(PC_SEA,0.34*k);ctx.beginPath();ag_rect(ctx,x0+16,y+14,(x1-x0-32)*k,12,6);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- the panel's room, 2000 to 2002: a pale wall with a board where
   results are pinned, a window on the right; the long table is drawn live, over the people */
const PC_PANEL={top:760,people:[[330,588,0.7,0],[620,580,0.7,1],[900,592,0.7,2],[1210,584,0.7,3],[1500,590,0.7,4]]};
AG_PLACES.pcPanel=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([226,220,208],1));g.addColorStop(1,rgba([210,204,192],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle=rgba([196,190,178],1);c.fillRect(0,690,W,8);
  // the board
  ag_soft(c,k=>ag_rect(k,240,130,1340,250,10),[214,206,190],[228,222,208],1400,160,600,"rgba(60,50,40,0.18)",14,0.5);
  c.strokeStyle="rgba(150,136,112,0.6)";c.lineWidth=6;c.beginPath();ag_rect(c,240,130,1340,250,10);c.stroke();
  // the window
  c.fillStyle=rgba([188,196,196],1);c.fillRect(1660,110,240,520);g=c.createLinearGradient(1660,110,1900,630);g.addColorStop(0,"rgba(255,255,250,0.8)");g.addColorStop(1,"rgba(232,238,236,0.4)");c.fillStyle=g;c.fillRect(1672,122,216,496);
  c.fillStyle=rgba([170,166,156],1);c.fillRect(1772,122,8,496);
  g=c.createRadialGradient(1700,360,60,1700,360,1100);g.addColorStop(0,"rgba(255,250,236,0.3)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  pc_light(c,0.6);};
// the experts, invented: from Singapore and from abroad, in the jackets of the time
const PC_EX=[
  {name:"An engineer from Singapore",key:"pc-e1",skin:[226,188,154],hair:{style:"side",c:[40,36,38]},glasses:[40,44,54],top:{kind:"suit",c:[64,66,72],inner:[236,236,232],tie:[96,74,70]},breath:0.27},
  {name:"A professor from abroad",key:"pc-e2",skin:[236,206,186],hair:{style:"cropped",c:[176,172,168]},top:{kind:"blazer",c:[120,104,88],inner:[232,230,222]},breath:0.24},
  {name:"A chemist from Singapore",key:"pc-e3",skin:[182,130,100],hair:{style:"bun",c:[30,26,28]},earrings:[226,196,140],top:{kind:"blazer",c:[92,96,104],inner:[236,234,228]},breath:0.3},
  {name:"A doctor from abroad",key:"pc-e4",skin:[120,82,62],hair:{style:"cropped",c:[52,46,44]},glasses:[36,38,44],top:{kind:"suit",c:[78,74,70],inner:[232,234,238],tie:[110,96,80]},breath:0.25},
  {name:"A water scientist from abroad",key:"pc-e5",skin:[232,198,172],hair:{style:"bob",c:[150,120,88]},top:{kind:"blazer",c:[150,136,116],inner:[236,232,226]},breath:0.29}];
function pc_panelPeople(ctx,t,o){o=o||{};PC_PANEL.people.forEach(([x,y,s,i])=>ag_person(ctx,PC_EX[i],x,y,s,{t:t+i*0.7,flip:i>=3,cut:PC_PANEL.top,gaze:o.gaze||[1,-1.4],nod:o.nod?o.nod(i):0}));}
function pc_panelTable(ctx){const y=PC_PANEL.top;let g=ctx.createLinearGradient(0,y,0,y+40);g.addColorStop(0,rgba(mix(AG_OAK.dark,[90,70,50],0.4),1));g.addColorStop(1,rgba(mix(AG_OAK.dark,[70,54,40],0.5),1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(100,y);ctx.lineTo(1820,y);ctx.lineTo(1900,y+70);ctx.lineTo(20,y+70);ctx.closePath();ctx.fill();
  g=ctx.createLinearGradient(0,y+70,0,H);g.addColorStop(0,rgba(mix(AG_OAK.dark,[60,48,36],0.55),1));g.addColorStop(1,rgba(mix(AG_OAK.dark,[44,36,28],0.7),1));ctx.fillStyle=g;ctx.fillRect(20,y+70,1880,H-y-70);
  ctx.fillStyle="rgba(255,240,220,0.18)";ctx.fillRect(100,y,1720,2);ctx.fillStyle="rgba(255,240,220,0.1)";ctx.fillRect(20,y+70,1880,3);
  for(const x of [500,960,1420]){ctx.fillStyle="rgba(30,24,18,0.18)";ctx.fillRect(x,y+90,3,H-y-90);}
  // papers on it, and glasses of water
  for(const x of [300,600,880,1190,1480]){ctx.fillStyle="rgba(244,242,236,0.95)";ctx.beginPath();ctx.moveTo(x-60,y+16);ctx.lineTo(x+50,y+14);ctx.lineTo(x+58,y+50);ctx.lineTo(x-66,y+52);ctx.closePath();ctx.fill();
    pc_glass(ctx,x+110,y+44,0.36,{fill:0.7,noShadow:true});}}

/* ---------------------------------------------------------------- the parade, 9 August 2002, at dusk: the stands full, people from
   behind; their raised hands and bottles are drawn live (pc_crowd) */
const PC_CROWD=(()=>{const R=ag_rnd(2002),out=[];for(let row=0;row<6;row++){const y=660+row*74+row*row*6,s=0.5+row*0.15,n=Math.round(19-row*1.9),dx=W/n;
  for(let i=0;i<n;i++){const x=dx*(i+0.5)+(R()-0.5)*dx*0.55+(row%2)*dx*0.3;if(R()<0.12)continue;out.push({x,y:y+(R()-0.5)*10,s:s*(0.92+R()*0.16),row,ph:R(),up:R()<0.86,top:R()<0.5?[146,74,78]:[226,224,218],skin:PC_SKIN[(R()*PC_SKIN.length)|0],hair:R()<0.85?[30,26,26]:[96,80,66]});}}return out;})();
AG_PLACES.pcStadium=c=>{const HZ=380;pc_sky(c,[118,128,154],[226,196,184],HZ,[960,HZ+40,900,0.35],[[178,170,180],0.6]);
  // the far stands, a band of small heads in red and white under the roof's edge
  c.fillStyle=rgba([84,88,100],1);c.beginPath();c.moveTo(0,HZ-40);c.quadraticCurveTo(960,HZ-120,W,HZ-40);c.lineTo(W,HZ-20);c.quadraticCurveTo(960,HZ-96,0,HZ-20);c.closePath();c.fill();
  let g=c.createLinearGradient(0,HZ-30,0,HZ+130);g.addColorStop(0,rgba([110,104,112],1));g.addColorStop(1,rgba([136,124,126],1));c.fillStyle=g;c.beginPath();c.moveTo(0,HZ-24);c.quadraticCurveTo(960,HZ-100,W,HZ-24);c.lineTo(W,HZ+140);c.quadraticCurveTo(960,HZ+70,0,HZ+140);c.closePath();c.fill();
  const R=ag_rnd(9);for(let i=0;i<2600;i++){const x=R()*W,u=R(),yb=HZ-20+u*150-Math.sin(x/W*Math.PI)*70*(1-u*0.6);c.fillStyle=R()<0.5?"rgba(170,84,86,0.55)":"rgba(236,232,226,0.5)";c.fillRect(x,yb,3+u*2,3+u*2);}
  // the field, with the evening's light on it
  g=c.createLinearGradient(0,HZ+90,0,640);g.addColorStop(0,rgba([132,146,124],1));g.addColorStop(1,rgba([110,124,104],1));c.fillStyle=g;c.beginPath();c.moveTo(0,HZ+128);c.quadraticCurveTo(960,HZ+58,W,HZ+128);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  g=c.createRadialGradient(960,560,40,960,560,700);g.addColorStop(0,"rgba(255,236,214,0.3)");g.addColorStop(1,"rgba(255,236,214,0)");c.fillStyle=g;c.fillRect(0,HZ,W,H-HZ);
  // the floodlights' soft glow at the roof's corners
  for(const [x,y] of [[160,170],[1760,170]]){g=c.createRadialGradient(x,y,4,x,y,240);g.addColorStop(0,"rgba(255,250,236,0.85)");g.addColorStop(0.2,"rgba(255,246,226,0.3)");g.addColorStop(1,"rgba(255,246,226,0)");c.fillStyle=g;c.fillRect(x-240,y-240,480,480);}
  // the near stands: rows of people from behind, heads and shoulders
  g=c.createLinearGradient(0,600,0,H);g.addColorStop(0,rgba([92,86,92],1));g.addColorStop(1,rgba([70,66,72],1));c.fillStyle=g;c.fillRect(0,600,W,H-600);
  for(const p of PC_CROWD){c.save();c.translate(p.x,p.y);c.scale(p.s,p.s);
    c.fillStyle=rgba(pc_shade(p.top,0.86),1);c.beginPath();c.moveTo(-58,90);c.bezierCurveTo(-58,20,-40,0,0,0);c.bezierCurveTo(40,0,58,20,58,90);c.closePath();c.fill();
    c.fillStyle="rgba(255,246,236,0.14)";c.beginPath();c.moveTo(14,6);c.bezierCurveTo(40,8,54,24,56,90);c.lineTo(36,90);c.closePath();c.fill();
    c.fillStyle=rgba(pc_shade(p.skin,0.8),1);c.fillRect(-10,-24,20,28);c.fillStyle=rgba(p.hair,1);c.beginPath();c.ellipse(0,-44,24,28,0,0,TAU);c.fill();
    c.fillStyle="rgba(255,240,226,0.12)";c.beginPath();c.ellipse(8,-52,12,14,0,0,TAU);c.fill();c.restore();}
  pc_light(c,0.5);};
// the raised bottles: the wave from left to right (u 0 to 1) raises a hand and a bottle in each; drink (0 to 1) tips them back
function pc_crowd(ctx,t,u,drink,a){if(a<=0.01||u<=0.001)return;ctx.save();ctx.globalAlpha*=a;
  for(const p of PC_CROWD){if(!p.up)continue;const k=ag_sine(clamp(u*1.6-p.x/W*0.6-p.ph*0.08,0,1));if(k<=0.01)continue;ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.s,p.s);
    const sx=34,sy=16,hx=sx+lerp(6,26,k),hy=lerp(40,-110,k)+Math.sin(t*2+p.ph*6)*3,dr=ag_sine(drink)*(0.5+0.5*p.ph);
    ctx.strokeStyle=rgba(pc_shade(p.top,0.8),1);ctx.lineWidth=14;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo(sx+18,lerp(30,-30,k),hx,hy+14);ctx.stroke();
    ctx.fillStyle=rgba(pc_shade(p.skin,0.85),1);ctx.beginPath();ctx.arc(hx,hy+10,8,0,TAU);ctx.fill();
    pc_bottle(ctx,hx,hy+16,48,{fill:1,line:0.8,tilt:lerp(0.06,-1.0,dr)+Math.sin(t*1.3+p.ph*5)*0.04,noShadow:true});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- since 2003: a reservoir among trees, clear water flowing in */
AG_PLACES.pcReservoir=c=>{const HZ=560;pc_sky(c,[170,186,196],[236,234,226],HZ,[1700,240,800,0.5]);
  pc_hills(c,[[0,470],[340,440],[700,470],[1100,430],[1500,460],[1920,436]],HZ,[150,168,146]);
  pc_greenLine(c,HZ,61,{top:100,amp:50,n:50});for(const [x,s] of [[360,0.55],[1180,0.62],[1650,0.5]])pc_tree(c,x,HZ+2,s,90+x,{noShadow:true,wide:1.5});pc_greenLine(c,HZ+4,63,{top:34,amp:20,dark:0.9,n:64});
  let g=c.createLinearGradient(0,HZ,0,H);g.addColorStop(0,rgba(mix(PC_SEA,[236,238,232],0.3),1));g.addColorStop(1,rgba(pc_shade(PC_SEA,0.88),1));c.fillStyle=g;c.fillRect(0,HZ,W,H-HZ);
  const R=ag_rnd(33);for(let i=0;i<200;i++){const y=HZ+8+Math.pow(R(),1.5)*(H-HZ),x=R()*W,l=14+R()*70*(0.4+(y-HZ)/300);c.fillStyle=R()<0.5?"rgba(255,255,255,0.22)":rgba(pc_shade(PC_SEA,0.82),0.22);c.fillRect(x,y,l,1.6+(y-HZ)/300);}
  g=c.createLinearGradient(0,HZ,0,HZ+100);g.addColorStop(0,"rgba(80,100,80,0.26)");g.addColorStop(1,"rgba(80,100,80,0)");c.fillStyle=g;c.fillRect(0,HZ,W,100);
  // the inflow: a low concrete outfall on the near left bank, its mouth just above the water
  c.fillStyle=rgba([150,160,140],1);c.beginPath();c.moveTo(0,600);c.quadraticCurveTo(260,610,420,700);c.lineTo(420,1080);c.lineTo(0,1080);c.closePath();c.fill();
  ag_soft(c,k=>k.rect(120,600,260,120),[196,194,188],[222,220,214],330,620,200,"rgba(40,34,28,0.3)",12,0.5);
  c.fillStyle=rgba([70,76,78],1);c.beginPath();ag_rect(c,170,640,170,56,10);c.fill();
  pc_light(c,0.6);};
function pc_reservoirLife(ctx,t,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<4;i++)pc_flow(ctx,[[190+i*44,684],[200+i*44,700],[230+i*44,740],[260+i*46,770]],mix(PC_SEA,[255,255,255],0.35),t+i*0.3,{w:9,speed:110,dash:18,gap:16});
  for(let i=0;i<5;i++){const ph=(t*0.5+i/5)%1;ctx.strokeStyle="rgba(255,255,255,"+0.45*(1-ph)+")";ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(330,780,40+ph*260,8+ph*50,0,0,TAU);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- today: a laboratory bench with its row of sample bottles */
AG_PLACES.pcBench=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([226,228,226],1));g.addColorStop(1,rgba([212,214,212],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle=rgba([196,206,208],1);c.fillRect(1320,90,520,420);g=c.createLinearGradient(1320,90,1840,510);g.addColorStop(0,"rgba(255,255,252,0.85)");g.addColorStop(1,"rgba(236,240,240,0.4)");c.fillStyle=g;c.fillRect(1332,102,496,396);
  c.fillStyle=rgba([180,184,184],1);c.fillRect(1576,102,8,396);
  g=c.createRadialGradient(1580,300,60,1580,300,1100);g.addColorStop(0,"rgba(255,252,240,0.35)");g.addColorStop(1,"rgba(255,252,240,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // shelves of the lab behind, and the bench: a pale top, its edge, the cupboards under it
  for(const y of [230,380]){c.fillStyle=rgba([200,202,200],1);c.fillRect(120,y,1060,12);c.fillStyle="rgba(60,50,40,0.12)";c.fillRect(120,y+12,1060,5);
    for(let i=0;i<14;i++){const x=150+i*74,h=60+((i*37)%30);c.fillStyle="rgba(186,196,198,0.7)";c.fillRect(x,y-h,40,h);c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(x+30,y-h+6,5,h-12);}}
  c.fillStyle=rgba([232,232,228],1);c.fillRect(0,690,W,34);c.fillStyle=rgba([196,198,196],1);c.fillRect(0,724,W,12);c.fillStyle=rgba([210,212,210],1);c.fillRect(0,736,W,344);
  for(let x=0;x<W;x+=320){c.fillStyle="rgba(60,50,40,0.1)";c.fillRect(x,746,3,334);}
  pc_light(c,0.6);};
// the row of sample bottles on the bench, each filled to its line, and a numbered tag on each
function pc_benchBottles(ctx,t,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;for(let i=0;i<9;i++){const x=300+i*150;pc_bottle(ctx,x,700,170,{fill:1,line:0.74});
  ctx.fillStyle="rgba(244,242,236,0.95)";ctx.fillRect(x-26,640,52,26);ctx.fillStyle="rgba(90,92,96,0.6)";ctx.fillRect(x-18,650,36,4);ctx.fillRect(x-18,657,24,3);}ctx.restore();}

/* ===== Plan, define the check, do, check: the room's own pieces =====
   Everything this film puts in the series' room (the lab, the agent, the cards) that the shared code doesn't have (prefix pc_):
     PC_ROOM      where things stand: Jun at his desk on the left, the agent's three tools down the right, the steps across the top
     pc_jun       Jun at his desk on the left, cut at its back edge, his arms down out of sight
     pc_steps     the four steps across the top, "Plan", "Define the check", "Do", "Check": the current one dark
     pc_plan      the one-page plan: its title, then a row for each thing it sets, each written in as its line is said; a tick, a
                  warning or a lock by a row; o.empty takes the rows' words away, leaving the plan ready for the next job
     pc_test      a test card, set (blue), failing (amber) or passing (green), with a person's approval and a lock
     pc_count     the count by level the agent builds: its rows, a row that grows in, its total
     pc_unknown   the count as nobody knows it yet: a question mark for each level, and the total everyone knows
     pc_years     the agent's query across the census days since 2021, a mark for each year with no level
     pc_options   the two places the 28 could go, both adding up, for Mei to choose
     pc_tool      a tool on the wall, read only; pc_arm(i) the arm from the agent's ring to tool i
     pc_globe     a pale globe, "the web"; pc_webPage a small page coming back from it
     pc_num       a card with a number that counts up; pc_clock a clock on a card, its hand turning
     pc_shelf     the bench "In the project", where what the loop leaves is kept
     pc_cycle     the four steps on an oak ring, a light going round them
     pc_outbox    the card the count goes into, "To the government"
     pc_whole     draws a person (or anything) into a layer and lays it on the frame at one opacity, so a person comes and goes whole
   Words are drawn live with ag_T, at least 28 px, above y 890. */

const PC_ROOM={jun:[290,612,0.95],desk:{x:-90,y:1004,w:770,depth:150},tx:1540,tw:290,th:134,ty:[300,456,612],tools:["Catalog","Query","Docs"],
  steps:[1250,82]};
const PC_TOOLDO=["tables and columns","counts and samples","the university's words"];

/* ---------------------------------------------------------------- Jun at his desk */
function pc_jun(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [jx,jy,js]=PC_ROOM.jun,D=PC_ROOM.desk;ctx.save();ctx.globalAlpha*=a;
  ag_desk(ctx,D.x,D.y,D.w,{depth:D.depth});
  ag_person(ctx,"jun",jx,jy,js,{t,gaze:o.gaze,nod:o.nod||0,smile:o.smile||0,cut:D.y-D.depth});
  ctx.restore();}

/* ---------------------------------------------------------------- the four steps across the top
   pc_steps(ctx, cur, o): the pills in a row, centred at PC_ROOM.steps; cur the current step (0 to 3), dark with light words, or a
   number between two steps while it moves on; o.a. Returns the pills' boxes. */
const PC_STEPS=["Plan","Define the check","Do","Check"];
function pc_steps(ctx,cur,o){o=o||{};const a=o.a==null?1:o.a,[cx,cy]=o.at||PC_ROOM.steps,h=50,gap=46,f={w:700,size:28};
  const ws=PC_STEPS.map(s=>ag_tw(ctx,s,f)+48),tot=ws.reduce((s,w)=>s+w,0)+gap*3;let x=cx-tot/2;const out=[];
  PC_STEPS.forEach((s,i)=>{const b={x,y:cy-h/2,w:ws[i],h,cx:x+ws[i]/2,cy};out.push(b);x+=ws[i]+gap;});if(a<=0.01)return out;ctx.save();ctx.globalAlpha*=a;
  out.forEach((b,i)=>{const on=clamp(1-Math.abs(i-cur),0,1);
    ag_box(ctx,b.x,b.y,b.w,b.h,h/2,{});if(on>0.01){ctx.save();ctx.globalAlpha*=on;ctx.fillStyle="rgba(52,56,64,0.94)";ctx.beginPath();ag_rect(ctx,b.x,b.y,b.w,b.h,h/2);ctx.fill();ctx.restore();}
    ag_T(ctx,PC_STEPS[i],b.cx,cy+10,{w:700,size:28,align:"center",col:mix(AG.mut,[250,250,248],on)});
    if(i<3){const ax=b.x+b.w+gap/2;ctx.strokeStyle="rgba(87,82,76,0.7)";ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(ax-6,cy-9);ctx.lineTo(ax+4,cy);ctx.lineTo(ax-6,cy+9);ctx.stroke();}});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- the one-page plan
   pc_plan(ctx, x, y, w, rows, o): "PLAN" and its title, then rows [{k: "Goal", v: "words", icon: "lock"}], each row's words typed in
   as o.k[i] goes 0 to 1 (its label comes first); o.title; o.grow[i] (0 to 1) opens a row's room, so a row can be put in between
   two others, the rows under it sliding down (its words come once it's open); o.tick[i] (0 to 1) a green tick at the row's end;
   o.amber[i] the row's words in amber, with a warning; o.hi[i] (0 to 1) a soft light on the row, in o.hiCol (green); o.lab[i] (0 to
   1) the label alone, before its words (o.k[i] then types them from 0.15); o.empty (0 to 1) takes every row's words and the title
   away; o.blank (0 to 1) a faint line where a row with no words would have them, as on a page still to fill in; o.ka springs it in; o.a. Returns its
   box and each row's top (ys). */
const PC_LW=150;
function pc_plan(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,lh=40,inner=w-56-PC_LW-44,f={w:600,size:30},G=i=>ag_sine(clamp((o.grow||[])[i]==null?1:o.grow[i],0,1));
  const L=rows.map(r=>ag_wrap(ctx,r.v||"",inner-(r.icon?40:0),f));let yy=y+(o.title?128:84);
  const ys=L.map((ls,i)=>{const r=yy;yy+=(Math.max(1,ls.length)*lh+16)*G(i);return r;}),h=yy-y+14,out={x,y,w,h,ys};if(a<=0)return out;ctx.save();ctx.globalAlpha*=a;
  if(o.ka!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.ka));
  ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,"PLAN",x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});const em=ag_sine(clamp(o.empty||0,0,1));if(o.title)ag_T(ctx,o.title,x+28,y+96,{w:800,size:36,a:1-em});
  ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+28,ys[0]-14);ctx.lineTo(x+w-28,ys[0]-14);ctx.stroke();
  const bl=clamp(o.blank||0,0,1);
  rows.forEach((r,i)=>{const open=G(i)>0.995?1:0,k=clamp((o.k||[])[i]==null?1:o.k[i],0,1)*open,ka=((o.lab||[])[i]==null?clamp(k*4,0,1):clamp(o.lab[i],0,1))*open;
    if(k<=0&&ka<=0)return;const ry=ys[i],am=o.amber&&o.amber[i],col=am?AG.amber:AG.ink;
    if(bl>0.01&&!L[i].length){ctx.strokeStyle="rgba(60,50,40,"+0.16*bl*ka+")";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28+PC_LW,ry+30);ctx.lineTo(x+w-28,ry+30);ctx.stroke();}
    const hi=(o.hi||[])[i]||0;if(hi>0.01){ctx.save();ctx.globalAlpha*=hi;ctx.fillStyle=rgba(o.hiCol||AG.green,0.09);ctx.beginPath();ag_rect(ctx,x+12,ry-12,w-24,Math.max(1,L[i].length)*lh+12,12);ctx.fill();ctx.restore();}
    ag_T(ctx,String(r.k).toUpperCase(),x+28,ry+22,{w:700,size:28,ls:3,col:am?AG.amber:AG.mut,a:ka});
    const tx=x+28+PC_LW+(r.icon?40:0),full=L[i].join(" "),n=Math.round(clamp((k-0.15)/0.85,0,1)*full.length);let used=0;
    if(r.icon==="lock")ag_lock(ctx,x+28+PC_LW+14,ry+18,28,rgba(AG.blue,ka*(1-em)));
    L[i].forEach((ln,j)=>{const take=clamp(n-used,0,ln.length);used+=ln.length+1;if(take<=0)return;ag_T(ctx,ln.slice(0,take),tx,ry+22+j*lh,{w:600,size:30,col,a:1-em});});
    const tk=(o.tick||[])[i]||0;if(tk>0.01)ag_tick(ctx,x+w-40,ry+12,26,rgba(AG.green,tk),4);
    if(am)ag_warn(ctx,x+w-40,ry+12,28,rgba(AG.amber,ka));});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- a test card
   pc_test(ctx, x, y, w, text, o): "TEST" and its line; o.state "set" (a blue edge: written, not yet run), "fail" (amber) or "pass"
   (green); o.note a line under it in the state's colour (o.noteA); o.ok (0 to 1) a green pill under it, "approved · Jun" (under its
   right end, or its left with o.okLeft); o.lock (0 to
   1) a small blue lock at its top right; o.k springs it in; o.a. Returns its box. */
function pc_test(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a,st=o.state||"set",col=st==="pass"?AG.green:st==="fail"?AG.amber:AG.blue,
    ls=ag_wrap(ctx,text,w-56-(o.lock!=null?40:0),{w:700,size:32}),h=82+ls.length*42+(o.note?44:0),b={x,y,w,h};if(a<=0.01)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,20,{edge:col,edgeA:0.85});
  ag_T(ctx,"TEST",x+28,y+48,{w:700,size:28,ls:4,col});if(st==="pass")ag_tick(ctx,x+142,y+40,22,rgba(AG.green,1),4);else if(st==="fail")ag_warn(ctx,x+144,y+38,28,rgba(AG.amber,1));
  ls.forEach((l,i)=>ag_T(ctx,l,x+28,y+92+i*42,{w:700,size:32}));
  if(o.note)ag_T(ctx,o.note,x+28,y+h-26,{w:700,size:30,col,a:o.noteA==null?1:o.noteA});
  const lk=o.lock||0;if(lk>0.01){ctx.save();ctx.globalAlpha*=clamp(lk,0,1);ag_about(ctx,x+w-40,y+36,lerp(1.6,1,ag_eo(lk)));ag_lock(ctx,x+w-40,y+44,30,rgba(AG.blue,1));ctx.restore();}
  ctx.restore();
  const ok=o.ok||0;if(ok>0.01){const k=clamp(ag_spr(ok,0,0.4),0,1.2),px=o.okLeft?x+150:x+w-130;ctx.save();ctx.globalAlpha*=a*clamp(ok*3,0,1);ag_about(ctx,px,y+h+34,lerp(0.6,1,k));ag_pill(ctx,px,y+h+34,"approved · Jun",{col:AG.green,icon:"tick",size:28});ctx.restore();}
  return b;}

/* ---------------------------------------------------------------- the count by level
   pc_count(ctx, x, y, w, o): "COUNT BY LEVEL", its rows (PC_LEVELS) as o.k[i] (0 to 1) brings each in, the third (non-award) only
   once it's added; a rule, then "Total" and o.total in o.totalCol; o.ka, o.a. The numbers are orange: data the agent brought back. */
const PC_LEVELS=[["Undergraduate","13,906"],["Postgraduate","4,478"],["Non-award","28"]];
function pc_count(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,k=o.k||[1,1,0],grow=ag_sine(clamp(k[2]||0,0,1)),rh=50,h=118+rh*(2+grow)+70,b={x,y,w,h};if(a<=0.01)return b;
  ctx.save();ctx.globalAlpha*=a;if(o.ka!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.ka));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.8});ag_T(ctx,"COUNT BY LEVEL",x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});
  ag_T(ctx,"census day",x+28,y+90,{w:500,size:28,col:AG.mut});
  PC_LEVELS.forEach(([s,n],i)=>{const kk=i<2?clamp(k[i],0,1):clamp((k[2]-0.4)/0.6,0,1);if(kk<=0)return;const yy=y+148+i*rh;
    if(i===2&&o.newA){ctx.save();ctx.globalAlpha*=o.newA;ctx.fillStyle=rgba(AG.green,0.1);ctx.beginPath();ag_rect(ctx,x+14,yy-36,w-28,rh,12);ctx.fill();ctx.restore();}
    ag_T(ctx,s,x+28,yy,{w:600,size:30,a:kk});ag_T(ctx,n,x+w-28,yy,{w:800,size:32,col:AG.orange,align:"right",a:kk});});
  const ty=y+148+rh*(2+grow)-10;ctx.strokeStyle="rgba(60,50,40,0.2)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28,ty-6);ctx.lineTo(x+w-28,ty-6);ctx.stroke();
  const ta=o.totalA==null?1:o.totalA;if(ta>0.01){ag_T(ctx,"Total",x+28,ty+40,{w:700,size:30,a:ta});ag_T(ctx,o.total||"",x+w-28,ty+42,{w:800,size:40,col:o.totalCol||AG.orange,align:"right",a:ta});}
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the count nobody knows yet
   pc_unknown(ctx, x, y, w, o): the count by level as it stands before any work: "COUNT BY LEVEL", each level with a question mark,
   and the total everyone knows, 18,412. o.rel (0 to 1) brings in, in blue, the + and = that say how the levels must relate to it
   (the labels make room for them, and the rule turns blue); o.q (0 to 1, and back) a pulse of the question marks; o.one (0 to 1) a
   blue pill under it, "one level each"; o.relHi and o.oneHi (0 to 1, and back) a pulse of the + and =, and of the pill; o.k springs
   it in; o.a. Returns its box. */
function pc_unknown(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=50,h=118+rh*2+70,b={x,y,w,h};if(a<=0.01)return b;
  const rel=clamp(o.rel||0,0,1),q=clamp(o.q||0,0,1),ind=40*ag_sine(rel);ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,"COUNT BY LEVEL",x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});ag_T(ctx,"census day",x+28,y+90,{w:500,size:28,col:AG.mut});
  ["Undergraduate","Postgraduate"].forEach((s,i)=>{const yy=y+148+i*rh;ag_T(ctx,s,x+28+ind,yy,{w:600,size:30});
    ctx.save();ag_about(ctx,x+w-40,yy-12,1+0.22*q);ag_T(ctx,"?",x+w-28,yy,{w:800,size:36,col:mix(AG.mut,AG.violet,q),align:"right"});ctx.restore();});
  const rh2=clamp(o.relHi||0,0,1),sg=(s,X,Y)=>{ctx.save();ag_about(ctx,X+9,Y-11,1+0.3*rh2);ag_T(ctx,s,X,Y,{w:800,size:32,col:AG.blue,a:rel});ctx.restore();};
  if(rel>0.01)sg("+",x+28,y+148+rh);
  const ty=y+148+rh*2-10;ctx.strokeStyle=rgba(mix([60,50,40],AG.blue,rel),0.2+0.5*rel);ctx.lineWidth=2+rel;ctx.beginPath();ctx.moveTo(x+28,ty-6);ctx.lineTo(x+w-28,ty-6);ctx.stroke();
  if(rel>0.01)sg("=",x+28,ty+40);
  ag_T(ctx,"Total",x+28+ind,ty+40,{w:700,size:30});ag_T(ctx,"18,412",x+w-28,ty+42,{w:800,size:40,align:"right"});
  const one=clamp(o.one||0,0,1);if(one>0.01){ctx.save();ag_about(ctx,x+w/2,y+h+40,1+0.1*clamp(o.oneHi||0,0,1));ag_pill(ctx,x+w/2,y+h+40,"one level each",{col:AG.blue,a:one});ctx.restore();}
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the years since 2021, and the options for Mei
   pc_years(ctx, x, y, w, o): the agent's second query: "QUERY · SINCE 2021", "No level, every year", the census days from 2021 to 2025
   each with an amber mark as o.n (0 to 5) reaches it, and o.split (0 to 1) the amber line "every split by level: short"; o.k, o.a.
   pc_options(ctx, x, y, w, o): "OPTIONS · BOTH ADD UP", the two places the 28 could go, each with what it gives (o.A, o.B, 0 to 1);
   o.pick (0 to 1) the first chosen: a green tick and a soft green light, the second fading back; o.k, o.a. Both return their box. */
const PC_YEARS=["2021","2022","2023","2024","2025"];
function pc_years(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=262,b={x,y,w,h};if(a<=0.01)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.orange,edgeA:0.75});
  ag_T(ctx,"QUERY · SINCE 2021",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"No level, every year",x+28,y+98,{w:700,size:36});
  const f={w:600,size:28},ws=PC_YEARS.map(s=>ag_tw(ctx,s,f)),gap=(w-56-ws.reduce((s,v)=>s+v,0))/(PC_YEARS.length-1);let xx=x+28;
  PC_YEARS.forEach((s,i)=>{const on=clamp((o.n||0)-i,0,1);if(on>0.01){ag_T(ctx,s,xx,y+156,{...f,col:AG.orange,a:on});
      ctx.fillStyle=rgba(AG.amber,0.9*on);ctx.beginPath();ctx.arc(xx+ws[i]/2,y+182,6+3*(1-ag_eo(on)),0,TAU);ctx.fill();}xx+=ws[i]+gap;});
  ag_T(ctx,"every split by level: short",x+28,y+232,{w:700,size:28,col:AG.amber,a:clamp(o.split||0,0,1)});
  ctx.restore();return b;}
function pc_options(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=262,b={x,y,w,h};if(a<=0.01)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.violet,edgeA:0.5});
  ag_T(ctx,"OPTIONS · BOTH ADD UP",x+28,y+50,{w:700,size:28,ls:4,col:AG.violet});const pk=clamp(o.pick||0,0,1);
  [["A level of their own","non-award · 28",o.A],["Their level at home","undergraduate 19 · postgraduate 9",o.B]].forEach(([t,s,v],i)=>{
    const yy=y+104+i*88,va=clamp(v||0,0,1)*(i===1?1-0.45*pk:1);if(va<=0.01)return;
    if(i===0&&pk>0.01){ctx.save();ctx.globalAlpha*=pk;ctx.fillStyle=rgba(AG.green,0.1);ctx.beginPath();ag_rect(ctx,x+14,yy-36,w-28,86,12);ctx.fill();ctx.restore();ag_tick(ctx,x+w-44,yy-10,24,rgba(AG.green,pk),4);}
    ag_T(ctx,t,x+28,yy,{w:600,size:30,a:va});ag_T(ctx,s,x+28,yy+38,{w:500,size:28,col:AG.mut,a:va});});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the tools, and the arms that reach them
   pc_tool(ctx, i, o): tool i of PC_ROOM.tools on the wall, with what it gives and "read only" by a lock; o.touch (0 to 1) its blue
   edge while an arm holds it, o.glow (0 to 1) a soft light (Docs, where the answer was), o.a. pc_arm(i, rx, ry, R): the curve from
   the ring's right side (Act) to the tool's left edge. */
function pc_tool(ctx,i,o){o=o||{};const a=o.a==null?1:o.a,x=PC_ROOM.tx+(o.dx||0),y=PC_ROOM.ty[i],w=PC_ROOM.tw,h=PC_ROOM.th,b={x,y,w,h};if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;const on=Math.max(o.touch||0,o.glow||0);
  ag_box(ctx,x,y,w,h,20,{edge:on>0.1?AG.blue:null,edgeA:0.9*on,glow:on>0.1?AG.blue:null,glowA:on});
  ag_T(ctx,PC_ROOM.tools[i],x+28,y+48,{w:700,size:32});ag_T(ctx,PC_TOOLDO[i],x+28,y+84,{w:500,size:28,col:AG.mut});
  ag_lock(ctx,x+42,y+h-26,26,rgba(AG.blue,1));ag_T(ctx,"read only",x+66,y+h-18,{w:600,size:28,col:AG.blue});
  ctx.restore();return b;}
const pc_arm=(i,rx,ry,R)=>{const y=PC_ROOM.ty[i]+PC_ROOM.th/2,x0=rx+R+30;return[x0,ry,x0+90,ry,PC_ROOM.tx-120,y,PC_ROOM.tx-4,y];};

/* ---------------------------------------------------------------- the web, and what comes back from it */
function pc_globe(ctx,x,y,r,a,o){o=o||{};if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,c=>c.arc(x,y,r,0,TAU),[214,222,228],[250,252,254],x+r*0.35,y-r*0.4,r*1.2,"rgba(46,38,28,0.25)",14,0.9);
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.strokeStyle="rgba(90,110,128,0.45)";ctx.lineWidth=2;
  for(const k of [-0.6,-0.2,0.2,0.6]){ctx.beginPath();ctx.ellipse(x,y+k*r,r*Math.sqrt(1-k*k),r*0.12*Math.sqrt(1-k*k),0,0,TAU);ctx.stroke();}
  for(const k of [0.25,0.6,0.92]){ctx.beginPath();ctx.ellipse(x,y,r*k,r,0,0,TAU);ctx.stroke();}ctx.restore();
  ag_T(ctx,"the web",o.side==="left"?x-r-22:x,o.side==="left"?y+11:y+r+46,{w:700,size:30,align:o.side==="left"?"right":"center",col:AG.mut});ctx.restore();}
// a small page of the web, its lines of words too small to read (decoration), s 1 about 64 px tall
function pc_webPage(ctx,x,y,s,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ag_box(ctx,-24,-32,48,64,6,{});ctx.fillStyle="rgba(90,110,128,0.5)";ctx.fillRect(-16,-24,32,6);ctx.fillStyle="rgba(60,64,70,0.25)";for(let i=0;i<5;i++)ctx.fillRect(-16,-12+i*8,i===4?18:32,3);ctx.restore();}
// a card with a number that counts up: kick, then num (a string), o.col, o.k springs it in, o.a; returns its box
function pc_num(ctx,x,y,w,kick,num,o){o=o||{};const a=o.a==null?1:o.a,h=128,b={x,y,w,h};if(a<=0.01)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));ag_box(ctx,x,y,w,h,20,{edge:o.edge||null,edgeA:0.8});
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+46,{w:700,size:28,ls:4,col:o.kickCol||AG.mut});ag_T(ctx,num,x+28,y+104,{w:800,size:44,col:o.col||AG.ink});ctx.restore();return b;}
// a clock on a card: its minute hand at min minutes, and label beside the face; o.k, o.a
function pc_clock(ctx,x,y,w,min,label,o){o=o||{};const a=o.a==null?1:o.a,h=128;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));ag_box(ctx,x,y,w,h,20,{});
  const cx=x+70,cy=y+h/2,r=40;ctx.fillStyle="#F6F4F0";ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();ctx.strokeStyle="rgba(60,64,70,0.55)";ctx.lineWidth=3;ctx.stroke();
  for(let i=0;i<12;i++){const q=i/12*TAU;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+Math.cos(q)*r*0.8,cy+Math.sin(q)*r*0.8);ctx.lineTo(cx+Math.cos(q)*r*0.92,cy+Math.sin(q)*r*0.92);ctx.stroke();}
  const q=-Math.PI/2+min/60*TAU;ctx.strokeStyle="rgba(40,44,50,0.9)";ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(q)*r*0.78,cy+Math.sin(q)*r*0.78);ctx.stroke();
  ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy-r*0.48);ctx.stroke();
  ag_T(ctx,label,x+130,cy+15,{w:800,size:40});ctx.restore();}

/* ---------------------------------------------------------------- the shelf, the cycle, and the card the count goes into */
// a long low oak bench standing against the wall, the front edge of its top at y: what the loop leaves stands on it; its label,
// "In the project", on its front
function pc_shelf(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,fh=70;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2+AG.sdx*2,y+fh+8,w*0.54,18,0.2);
  let g=ctx.createLinearGradient(0,y-16,0,y);g.addColorStop(0,rgba(mix(AG_OAK.base,[255,255,255],0.25),1));g.addColorStop(1,rgba(AG_OAK.base,1));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+10,y-16);ctx.lineTo(x+w-10,y-16);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  g=ctx.createLinearGradient(0,y,0,y+fh);g.addColorStop(0,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(mix(AG_OAK.base,AG_OAK.dark,0.8),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,fh);
  ctx.fillStyle=rgba(AG_OAK.hi,0.8);ctx.fillRect(x,y,w,2);
  ag_T(ctx,"IN THE PROJECT",x+w/2,y+46,{w:700,size:28,ls:4,align:"center",col:[74,60,44]});ctx.restore();}
// the four steps on an oak ring centred at (cx, cy): Plan at the top, then round clockwise; o.p (0 to 1) how much of the ring is
// drawn, o.pulse {deg, a} a light on it, o.lit (0 to 1 each, the steps the light has reached), o.a. Returns the pills' boxes.
const PC_CYC=[-90,0,90,180];
function pc_cycle(ctx,cx,cy,R,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return[];ctx.save();ctx.globalAlpha*=a;
  ag_ring(ctx,cx,cy,R,{p:o.p==null?1:o.p,from:-90,arrows:[-45,45,135,225],pulse:o.pulse});
  const out=PC_STEPS.map((s,i)=>{const d=PC_CYC[i]*Math.PI/180,x=cx+Math.cos(d)*R,y=cy+Math.sin(d)*R,w=ag_tw(ctx,s,{w:700,size:30})+54,h=52,l=(o.lit||[])[i]||0,b={x:x-w/2,y:y-h/2,w,h};
    ag_box(ctx,b.x,b.y,w,h,h/2,{edge:l>0.05?AG_OAK.dark:null,edgeA:0.9*l});ag_T(ctx,s,x,y+10,{w:700,size:30,align:"center"});return b;});
  ctx.restore();return out;}
// the card the count goes into: "TO THE GOVERNMENT", a slot for the count; o.k, o.a
function pc_outbox(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||300;if(a<=0.01)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,"TO THE GOVERNMENT",x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});ag_T(ctx,"the census report",x+28,y+92,{w:500,size:28,col:AG.mut});
  ctx.fillStyle="rgba(60,50,40,0.08)";ctx.beginPath();ag_rect(ctx,x+24,y+118,w-48,h-142,16);ctx.fill();ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a person laid on the frame whole
   pc_whole(ctx, a, fn): fn(c) draws into a layer under the same camera; the layer goes on at opacity a, so a person fades as one
   picture, never showing their body through their arm. */
function pc_whole(ctx,a,fn){if(a<=0.01)return;if(a>=0.99){fn(ctx);return;}const cv=ctx.canvas,[bc,bx]=ag_buf("pcWhole",cv.width,cv.height);
  bx.setTransform(ctx.getTransform());fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(bc,0,0);ctx.restore();}

/* ===== Plan, define the check, do, check: the eight chapters =====
   Each chapter is a few shots (the shared ag_shots): a place painted once, a slow camera, and what's drawn live over it. Between
   places a shot dissolves in. In the lab the camera never jumps: the next shot, or a chapter that opens there (ag_cutInto), glides
   on from where the camera is, and a later moment there (later:true) lets what was there leave, through the bare lab, before what
   comes next comes in, so nothing appears or vanishes in one frame. Times inside a chapter come from its cues (when each
   line starts) and the words of its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on
   cards, labels and pills, at least 28 px as seen, and above the captions (y 890). */

// made once per chapter, the first time it draws: its cues are known by then
const pc_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the lab, bare for an instant between two moments in it (later:true): its place, and the light every shot of it draws
AG_BARE.lab=c=>ag_roomLight(c,1);
// a card that springs in at t0 and goes at t1 (or stays): its k and a
const pc_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// the place-and-year tag at the top left, in screen space: the latest of [[t, words, dissolve], ...] passed, dissolving from the one
// before over its shot's dissolve (0 for a cut); null words hide it
function pc_tags(ctx,S,t,list,a){a=a==null?1:a;if(a<=0.01)return;let i=0;for(let k=1;k<list.length;k++)if(t>=list[k][0])i=k;
  const d=list[i][2]==null?0.5:list[i][2],u=i>0?(d>0?ag_in(t,list[i][0],d):1):ag_in(t,list[0][0],0.6);setScreen(ctx,S);
  if(u<1&&i>0&&list[i-1][1])pc_tag(ctx,list[i-1][1],a*(1-u));if(list[i][1])pc_tag(ctx,list[i][1],a*u);}
// a card's flight out of the sphere (u 0 to 1) along a curve from (x0, y0) by (x1, y1) to (x2, y2): its middle and its size
function pc_fly(u,x0,y0,x1,y1,x2,y2){const e=ag_eo(u),q=(a0,a1,a2)=>(1-e)*(1-e)*a0+2*(1-e)*e*a1+e*e*a2;return{x:q(x0,x1,x2),y:q(y0,y1,y2),s:lerp(0.3,1,ag_eo(clamp(u/0.55,0,1)))};}
// draw fn (a card at its place, centred on (cx, cy)) as if it were at F: while it's still small, only a blank card of box's size
// ({w, h, a}), as its words would be under 28 px; full size, the card itself, moved
function pc_flown(ctx,F,cx,cy,fn,box){if(!F)return;ctx.save();
  if(F.s<0.999&&box){ctx.translate(F.x,F.y);ctx.scale(F.s,F.s);ag_box(ctx,-box.w/2,-box.h/2,box.w,box.h,22,{a:box.a==null?1:box.a});}
  else{ctx.translate(F.x,F.y);ctx.scale(F.s,F.s);ctx.translate(-cx,-cy);fn();}ctx.restore();}
const PC_TITLE="Plan, define the check, do, check",PC_LINE="AGENTS AT WORK ON DATA · FILM 5 OF 9";
// the agent: its sphere in its oak ring, without the ring's step pills (this film's four steps run across the top instead);
// R the ring, r the sphere; o.core, o.think, o.pulse {deg, a}, o.p (how much ring), o.a
function pc_agent(ctx,t,x,y,R,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_modelLight(ctx,x,y,r,o.core==null?1:o.core);ag_ring(ctx,x,y,R,{p:o.p==null?1:o.p,from:-90,arrows:[-30,90,210],pulse:o.pulse});
  ag_model(ctx,x,y,r,{t,core:o.core,think:o.think,label:null});ctx.restore();}
// a pulse going once round the ring from the top, starting at t0 and taking d seconds: for o.pulse
const pc_round=(t,t0,d)=>{const u=(t-t0)/(d||1.6);return u<=0||u>=1.15?{deg:-90,a:0}:{deg:-90+360*ag_sine(clamp(u,0,1)),a:clamp(Math.min(u*6,(1.15-u)*6),0,1)};};
// a line of words on the wall, centred, in two sizes: the chapter's point
function pc_wall(ctx,lines,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||44,lh=sz*1.3;
  lines.forEach((l,i)=>ag_T(ctx,l,x,y+i*lh,{w:800,size:sz,align:o.align||"center",col:o.col||AG.ink,a:a*(o.k?clamp(o.k[i]==null?1:o.k[i],0,1):1)}));}
// a map label: a place's name, in the map's own grey-green
function pc_mapLabel(ctx,s,x,y,a){if(a<=0.01)return;ag_T(ctx,s.toUpperCase(),x,y,{w:700,size:34,ls:6,align:"center",col:[84,96,86],a});}

/* ---------------------------------------------------------------- 1 · Water people can trust
   Singapore, late 1990s: the city, the map and its pipes, the water a city could clean, a glass in a kitchen; 1998 to 2000: the test
   plant, dry, and the list written first; the panel; the parade; the reservoirs since 2003; the lab today. Then the university: the
   census-day count, what an agent brings back, and the check decided first. */
const PC_TAP=[1070,520,980,546];   // a tap off the hall's column, over the sample bottle
function pc_tap(x){const [tx0,ty0,tx1,ty1]=PC_TAP;x.save();x.lineCap="round";x.strokeStyle=rgba([110,116,120],1);x.lineWidth=16;x.beginPath();x.moveTo(tx0,ty0);x.lineTo(tx1,ty0);x.lineTo(tx1,ty1);x.stroke();
  x.strokeStyle=rgba([198,202,204],1);x.lineWidth=8;x.stroke();x.restore();}
scene("water",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({rain:wAt(sc,"city","little"),island:wAt(sc,"city","island"),
    map:c.piped-0.5,piped:wAt(sc,"piped","piped"),mal:wAt(sc,"piped","Malaysia"),e11:wAt(sc,"piped","eleven"),e61:wAt(sc,"piped","sixty-one"),
    street:c.clean-0.5,used:wAt(sc,"clean","used"),sinks:wAt(sc,"clean","sinks"),until:wAt(sc,"clean","until"),pure:wAt(sc,"clean","pure"),
    kitchen:c.fear-0.6,drink:wAt(sc,"fear","drink"),trust:wAt(sc,"trust","trust"),border:wAt(sc,"trust","border"),worthy:wAt(sc,"change","trustworthy"),
    plant:c.study-0.6,agency:wAt(sc,"study","agency"),write:wAt(sc,"before","write"),judged:wAt(sc,"before","judged"),
    phys:wAt(sc,"measures","physical"),chem:wAt(sc,"measures","chemical"),micro:wAt(sc,"measures","microbiological"),world:wAt(sc,"measures","world's"),
    stds:wAt(sc,"measures","standards"),panel:c.panel-0.6,rules:wAt(sc,"panel","rules"),results:wAt(sc,"panel","results"),years:wAt(sc,"panel","two years"),
    july:wAt(sc,"report","July"),well:wAt(sc,"report","well"),parade:c.parade-0.6,raise:wAt(sc,"parade","raise"),gulp:wAt(sc,"parade","drink"),
    flows:c.flows-0.6,today:c.today-0.6,three:wAt(sc,"today","three hundred"),outside:wAt(sc,"today","outside"),
    uni:c.data-0.6,change:wAt(sc,"data","change"),census:wAt(sc,"data","census-day"),gov:wAt(sc,"data","government"),
    checked:wAt(sc,"unless","checked"),brings:wAt(sc,"unless","brings"),back:c.first-0.2,check:wAt(sc,"first","check"),starts:wAt(sc,"first","starts"),
    work:wAt(sc,"first","work"),use:wAt(sc,"first","use"),title:c.breath+0.2}));
  ag_shots(ctx,S,t,sc.dur,[
    // across calm water, the island city in soft daylight; a band of rain moves in from the left and falls on the city and the sea
    {at:0,place:"pcCity",keys:[[0,960,520,1.07],[0.1,960,540,1.0]],d:8.6,push:0,draw:(x,tt)=>{
      pc_cityLife(x,tt,lerp(-220,2300,ag_sine((tt-P.island+1.2)/7.5)),ag_in(tt,P.island-1.4,1.2));}},
    // the map: the island, the tip of the mainland across a narrow strait; water piped in along the causeway, under two agreements
    {at:P.map,dis:0.8,place:"pcMap",keys:[[P.map,960,560,1.05],[P.map+0.1,960,540,1.0]],d:5,push:0,draw:(x,tt)=>{
      pc_mapLife(x,tt,ag_sine((tt-P.piped+0.2)/2.8),1);
      pc_mapLabel(x,"Singapore",1030,708,ag_in(tt,P.map+0.4,0.6));pc_mapLabel(x,"Malaysia",470,300,ag_in(tt,P.mal-0.1,0.6));
      const a1=pc_pop(tt,P.e11-0.5,null),a2=pc_pop(tt,P.e61-0.5,null);
      ag_textCard(x,1530,590,360,{kick:"Agreement",title:"1961 · ends 2011"},{k:a1.k,a:a1.a,kickCol:AG.mut});
      ag_textCard(x,1530,742,360,{kick:"Agreement",title:"1962 · ends 2061"},{k:a2.k,a:a2.a,kickCol:AG.mut});}},
    // a street cut open: a sink and its drain, the pipe under the road to a plant; membranes, then light; a glass of clear water
    {at:P.street,dis:0.8,place:"pcStreet",keys:[[P.street,960,540,1.0],[P.street+0.1,980,530,1.03]],push:0,draw:(x,tt)=>{
      pc_streetLife(x,tt,{used:ag_sine((tt-P.used+0.3)/2.4),mem:ag_sine((tt-P.until+0.5)/1.4),clean:ag_sine((tt-P.until-0.5)/1.2),glass:ag_sine((tt-P.pure+0.1)/1.4)});
      ag_pill(x,640,800,"used water",{a:ag_in(tt,P.used-0.1,0.5)});
      ag_pill(x,1140,180,"fine membranes",{a:ag_in(tt,P.until-0.4,0.5)});ag_pill(x,1410,104,"ultraviolet light",{a:ag_in(tt,P.until+0.4,0.5)});
      ag_pill(x,1704,640,"pure enough to drink",{a:ag_in(tt,P.pure+0.2,0.5)});}},
    // a kitchen of the time: she holds up a glass of it and looks at it; her neighbour looks too
    {at:P.kitchen,dis:0.7,place:"pcKitchen",keys:[[P.kitchen,960,540,1.02],[P.kitchen+0.1,940,540,1.06]],d:9,push:0,draw:(x,tt)=>pc_kitchen(x,tt,P)},
    // 1998 to 2000: the test plant, dry; the study begins; before any water, the list of how it will be judged; then the plant runs
    {at:P.plant,dis:0.9,place:"pcPlant",keys:[[P.plant,980,540,1.0],[P.plant+0.1,960,540,1.03]],push:0,draw:(x,tt)=>pc_plantShot(x,tt,P)},
    // 2000 to 2002: the panel at its long table; results arrive, one by one, and are ticked; the years turn; their report
    {at:P.panel,dis:0.9,place:"pcPanel",keys:[[P.panel,960,540,1.0],[P.panel+0.1,960,520,1.03]],push:0,draw:(x,tt)=>pc_panelShot(x,tt,P)},
    // the parade, at dusk: a wave of plain bottles rises across the crowd, and they drink; the stadium holds a moment
    {at:P.parade,dis:1.0,place:"pcStadium",keys:[[P.parade,960,560,1.08],[P.parade+0.1,960,540,1.0]],d:7,push:0,draw:(x,tt)=>{
      pc_crowd(x,tt,ag_sine((tt-P.raise+0.4)/2.6),ag_sine((tt-P.gulp+0.1)/1.6),1);}},
    // since 2003: a reservoir among trees, clear water flowing into it
    {at:P.flows,dis:1.0,place:"pcReservoir",keys:[[P.flows,960,540,1.0],[P.flows+0.1,900,560,1.05]],push:0,draw:(x,tt)=>pc_reservoirLife(x,tt,1)},
    // today: a lab bench and its sample bottles; about 300 measures, and experts from outside every year
    {at:P.today,dis:0.8,place:"pcBench",keys:[[P.today,960,540,1.0],[P.today+0.1,960,540,1.03]],push:0,draw:(x,tt)=>{pc_benchBottles(x,tt,1);
      ag_pill(x,1580,200,"about 300 measures",{a:ag_in(tt,P.three-0.2,0.5)});ag_pill(x,1480,296,"audited every year · experts from outside",{a:ag_in(tt,P.outside-0.2,0.5)});}},
    // the university: Jun, the agent, the count it's about to change; what it brings back, and whether to trust it; the check, first
    {at:P.uni,dis:1.0,place:"lab",keys:[[P.uni,960,540,1.0]],push:0,draw:(x,tt)=>pc_trustRoom(x,tt,P)}]);
  pc_tags(ctx,S,t,[[0.6,"Singapore · late 1990s"],[P.plant,"Singapore · 1998 to 2000",0.9],[P.panel,"The panel · 2000 to 2002",0.9],
    [P.parade,"National Day Parade · 9 August 2002",1.0],[P.flows,"Since 2003",1.0],[P.today,"Today",0.8],[P.uni,"The university",1.0],[P.title,null,0.6]]);
  ag_title(ctx,S,t,P.title,PC_TITLE,null,PC_LINE);});

// the kitchen: she holds the glass up before her and looks at it; her neighbour, beside her, looks at it too; the question, then why it matters
function pc_kitchen(x,tt,P){
  ag_person(x,PC_W2,1240,610,1.0,{t:tt+0.8,flip:true,gaze:[3.4,3.4],nod:0.04*ag_io(tt,P.trust,P.trust+1.6,0.5)});
  ag_person(x,PC_W1,720,600,1.02,{t:tt,pose:"hold",gaze:[1.6,3.6],holdBack:(c,h)=>pc_glass(c,h.near[0]+50,h.near[1]-26,1.3,{fill:0.8,noShadow:true})});
  const q1=pc_pop(tt,P.drink-0.3,null),q2=pc_pop(tt,P.trust-0.2,null),q3=pc_pop(tt,P.worthy-0.2,null);
  ag_textCard(x,90,150,470,{title:"Would you drink it?"},{k:q1.k,a:q1.a});
  ag_textCard(x,90,282,470,{title:"No trust, no use"},{k:q2.k,a:q2.a});
  ag_textCard(x,90,414,470,{title:"Trustworthy, first"},{k:q3.k,a:q3.a});}

// the plant: the study's card; the list unrolls before any water; the bottle stands empty, its line already on it; when the list is
// whole, water runs through the plant, and from the tap into the bottle, up to its line
function pc_plantShot(x,tt,P){const run=ag_sine((tt-P.stds+0.6)/1.6),fill=ag_sine((tt-P.stds)/1.8),pour=ag_io(tt,P.stds-0.2,P.stds+1.8,0.3);
  pc_plantLife(x,tt,run,1);
  // the tap off the hall's column, and its stream into the bottle while it fills
  const [,,tx1,ty1]=PC_TAP;pc_tap(x);
  const bh=230,by=790,lvl=bh*0.66*0.78*fill;
  if(pour>0.01){x.save();x.strokeStyle=rgba(pc_shade(PC_SEA,0.8),0.85*pour);x.lineWidth=5;x.lineCap="round";x.beginPath();x.moveTo(tx1,ty1+6);x.lineTo(tx1,by-Math.max(lvl,4));x.stroke();x.restore();}
  pc_bottle(x,tx1,by,bh,{fill,line:0.78});
  const sa=pc_pop(tt,P.plant+0.9,P.write-0.6);ag_textCard(x,120,170,560,{kick:"1998",title:"A study begins",sub:"the water agency and the environment ministry"},{k:sa.k,a:sa.a,kickCol:AG.mut});
  pc_list(x,120,170,620,clamp((tt-P.write+0.1)/2.0,0,1),{k:[ag_in(tt,P.phys-0.2,0.4),ag_in(tt,P.chem-0.2,0.4),ag_in(tt,P.micro-0.2,0.4),ag_in(tt,P.world-0.2,0.5)]});}

// the panel: five experts at the long table, looking up at the board; result sheets pinned one by one, each ticked; the years turn;
// their report, with a green tick
const PC_SHEETS=[[660,166],[830,160],[1000,168],[1170,162],[1340,166]];
function pc_panelShot(x,tt,P){const t0=P.results-0.6,step=(P.july-0.8-t0)/PC_SHEETS.length,rep=pc_pop(tt,P.well-0.5,null),ru=pc_pop(tt,P.rules-0.3,null);
  ag_textCard(x,280,174,320,{kick:"The rules",title:"190 measures"},{k:ru.k,a:ru.a,kickCol:AG.mut});
  PC_SHEETS.forEach(([sx,sy],i)=>{const ti=t0+i*step,a=ag_in(tt,ti,0.4);if(a<=0.01)return;const k=clamp(ag_spr(tt,ti,0.7),0,1.2);x.save();x.globalAlpha*=a;
    ag_about(x,sx+70,sy+90,lerp(0.7,1,k));ag_box(x,sx,sy,140,180,8,{});x.fillStyle="rgba(90,92,96,0.32)";for(let j=0;j<6;j++)x.fillRect(sx+22,sy+30+j*20,j===5?54:96,4);
    ag_tick(x,sx+100,sy+150,26,rgba(AG.green,ag_in(tt,ti+0.5,0.3)),4);x.fillStyle="#7A7268";x.beginPath();x.arc(sx+70,sy+12,6,0,TAU);x.fill();x.restore();});
  pc_year(x,1696,176,170,clamp((tt-P.years+0.3)/2.4,0,1)*2,{a:ag_in(tt,P.years-0.6,0.5)});
  pc_panelPeople(x,tt,{gaze:[1,-1.4],nod:i=>0.05*ag_io(tt,P.well+0.2+i*0.12,P.well+1.4+i*0.12,0.3)});pc_panelTable(x);
  ag_textCard(x,640,196,760,{kick:"July 2002",title:"Well within the standards"},{k:rep.k,a:rep.a,kickCol:AG.mut,edge:AG.green,icon:rep.a>0.6?"tick":null});}

// the university, today: Jun at his desk; the agent, dim; the census-day count; what the agent brings back, and "Trust it?"; then it
// goes back, the check comes first, the agent works, and what it brings back takes a green tick
const PC_R1=[1150,470,170,84];
function pc_trustRoom(x,tt,P){const [rx,ry,R,r]=PC_R1,wake=ag_in(tt,P.starts-0.2,0.8),ans=[1380,250,420],gone=1-ag_in(tt,P.title-0.6,0.5);
  pc_agent(x,tt,rx,ry,R,r,{core:lerp(0.25,1,wake)+0.2*ag_io(tt,P.change-0.2,P.brings+0.6,0.5)*(1-wake),think:0.6*ag_io(tt,P.work-0.6,P.use+0.2,0.4),pulse:pc_round(tt,P.starts,1.5)});
  pc_jun(x,tt,{gaze:tt<P.census+0.4?[2.6,-0.8]:tt<P.brings?[2.2,-1.6]:[3.4,-1.4],nod:0.06*ag_io(tt,P.use-0.1,P.use+0.7,0.3),smile:0.2*ag_in(tt,P.use,0.8)});
  ag_roomLight(x,1);
  const cc=pc_pop(tt,P.census-0.3,null);ag_textCard(x,500,190,460,{kick:"Census-day count",title:"18,412 students",sub:"reported to the government"},{k:cc.k,a:cc.a*gone,kickCol:AG.mut});
  // what it brings back: out of the sphere, with "Trust it?"; at "Decide the check" it goes back in
  const out1=clamp((tt-P.brings+0.2)/1.0,0,1),back=clamp((tt-P.back)/0.8,0,1),out2=clamp((tt-P.work+0.3)/1.0,0,1),h=ag_textCard(x,0,0,ans[2],{kick:"From the agent",title:"A new count"},{measure:1}).h;
  const cx=ans[0]+ans[2]/2,cy=ans[1]+h/2,u=out2>0?out2:out1*(1-back),ok=out2>0;
  if(u>0.01){const F=pc_fly(u,rx,ry,rx+160,ry-220,cx,cy);
    pc_flown(x,F,cx,cy,()=>ag_textCard(x,ans[0],ans[1],ans[2],{kick:"From the agent",title:"A new count"},{a:clamp(u*3,0,1)*gone,edge:ok?AG.green:null,edgeA:ag_in(tt,P.use-0.3,0.4),icon:ok&&tt>P.use-0.3?"tick":null}),{w:ans[2],h,a:clamp(u*3,0,1)});}
  ag_pill(x,cx,ans[1]+h+46,"Trust it?",{col:AG.amber,icon:"warn",a:ag_in(tt,P.brings+0.7,0.4)*(1-ag_in(tt,P.back-0.2,0.4))});
  // the check, decided first: it comes in from Jun's side before the agent starts
  const ck=ag_eo(clamp((tt-P.check+0.3)/0.9,0,1));if(ck>0.01)ag_textCard(x,lerp(380,500,ck),430,460,{kick:"The check",title:"Decided first"},{a:ck*gone,edge:AG.blue,kickCol:AG.blue});}

/* ---------------------------------------------------------------- the lab chapters' shared pieces */
// a chapter's start in the film: people and the agent are drawn on the film's clock, so they breathe and blink on across a cut
const pc_g0=sc=>{let s=0;for(const x of SCENES){if(x.id===sc.id)return s;s+=x.dur;}return s;};
// a row's words typed from t0 to t1, as pc_plan's o.k (0.15 is the label alone); pc_type2 in two parts, the first f of the words
const pc_type=(t,t0,t1)=>0.15+0.85*clamp((t-t0)/(t1-t0),0,1);
const pc_type2=(t,a0,a1,f,b0,b1)=>0.15+0.85*(t<b0?f*clamp((t-a0)/(a1-a0),0,1):f+(1-f)*clamp((t-b0)/(b1-b0),0,1));
// a soft blue ring round a lock, as something tries it
function pc_lockFlash(x,lx,ly,a){if(a<=0.01)return;x.save();x.strokeStyle=rgba(AG.blue,0.7*a);x.lineWidth=3;x.beginPath();x.arc(lx,ly,24+14*a,0,TAU);x.stroke();x.restore();}

/* ---------------------------------------------------------------- 2 · The long way
   Once: Jun at his desk, the agent, and its three tools on the wall. Its plan has a goal and nothing else: the Tools row stays empty,
   in amber. It reaches past the tools to the web, and pages come back for 40 minutes, while Docs would have answered in one call;
   what it brings back is another university's rule. Jun catches it, and the work goes round again. The arm folds away; what was
   missing stays lit, and the point goes on the wall. */
const PC_R2=[1200,650,150,76],PC_WEB=[1730,160,58],PC_LONG=[1380,650,1450,620,1440,250,1660,168];
scene("long",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),goal:wAt(sc,"once","goal"),check:wAt(sc,"once","check"),
    plan:wAt(sc,"knew","plan"),use:wAt(sc,"knew","use"),searched:wAt(sc,"knew","searched"),web:wAt(sc,"knew","web"),pages:c.pages,
    n38:wAt(sc,"pages","thirty-eight"),forty:wAt(sc,"pages","forty"),docs:c.docs,call:wAt(sc,"docs","one call"),other:c.other,
    brought:wAt(sc,"other","brought"),another:wAt(sc,"other","another"),caught:wAt(sc,"caught","caught"),again:wAt(sc,"caught","again"),
    broken:c.broken,nobody:wAt(sc,"broken","nobody"),waste:wAt(sc,"waste","waste")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",later:true,keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_longRoom(x,tt,P)}]);
  pc_tags(ctx,S,t,[[0.4,"Once"]]);});

function pc_longRoom(x,tt,P){const [rx,ry,R,r]=PC_R2,G=P.g0+tt;
  // the arm out to the web: it reaches as "searched" is said, holds while the pages come, and folds away at "broken"
  const reach=ag_sine((tt-P.searched+0.1)/1.3)*(1-ag_sine((tt-P.broken-0.2)/1.5)),flow0=P.searched+1.2,flow1=P.forty+0.4;
  pc_agent(x,G,rx,ry,R,r,{think:0.7*ag_io(tt,P.searched,P.forty+0.6,0.5),pulse:pc_round(tt,P.again,1.6)});
  ag_reach(x,PC_LONG,reach);
  // pages of the web coming back along it, three at a time
  const pf=ag_io(tt,flow0,flow1,0.3)*clamp((reach-0.9)*10,0,1);
  if(pf>0.01)for(let j=0;j<3;j++){const v=(((tt-flow0)/1.4+j/3)%1+1)%1,q=ag_bz(PC_LONG,1-v);pc_webPage(x,q[0],q[1]-20,0.8,pf*clamp(Math.min(v*5,(1-v)*5),0,1));}
  pc_jun(x,G,{gaze:tt<P.searched?[2.6,-1.2]:tt<P.brought?[3.4,-2.2]:tt<P.broken?[2.6,0]:[2.8,-1.2]});
  ag_roomLight(x,1);
  pc_steps(x,0,{a:ag_in(tt,P.plan-0.3,0.6)});
  // the web, top right; the tools on the wall, Docs lit while it's named, all three as "what was there" is said
  pc_globe(x,PC_WEB[0],PC_WEB[1],PC_WEB[2],ag_in(tt,P.web-0.6,0.5)*(1-ag_in(tt,P.broken+0.8,0.6)));
  const there=0.55*ag_io(tt,P.nobody-0.2,P.waste+2.5,0.5),docs=ag_io(tt,P.docs-0.2,P.brought,0.4);
  for(let i=0;i<3;i++)pc_tool(x,i,{glow:i===2?Math.max(docs,there):there});
  // one call: a dotted line from the ring to Docs
  const dc=ag_io(tt,P.call-0.5,P.brought,0.4);if(dc>0.01){const u=ag_sine((tt-P.call+0.5)/0.7);x.save();x.globalAlpha*=dc;x.strokeStyle=rgba(AG.blue,0.85);
    x.lineWidth=4;x.setLineDash([2,12]);x.lineCap="round";x.beginPath();x.moveTo(1352,700);x.lineTo(lerp(1352,1534,u),lerp(700,690,u));x.stroke();x.restore();
    ag_pill(x,1446,758,"1 call",{col:AG.blue,a:dc*ag_in(tt,P.call-0.1,0.4)});}
  // the plan: a goal, and nothing else; the Tools row stays empty, in amber
  const pk=pc_pop(tt,P.goal-0.4,null);
  pc_plan(x,480,150,640,[{k:"Goal",v:"Check the count against the census rules"},{k:"Tools",v:""}],{ka:pk.k,a:pk.a,
    lab:[ag_in(tt,P.goal-0.2,0.4),ag_in(tt,P.use-0.2,0.4)],k:[tt<P.goal-0.2?0:pc_type(tt,P.check-0.1,P.check+2.0),0],amber:[false,true],
    hi:[0,0.9*ag_io(tt,P.nobody-0.3,P.waste+2.5,0.5)],hiCol:AG.amber,blank:1});
  // 38 pages, 40 minutes
  const nA=ag_io(tt,flow0-0.2,P.other-0.7,0.4),n=Math.round(38*clamp((tt-flow0)/(P.n38-flow0),0,1));
  pc_num(x,500,440,330,"The web",n===1?"1 page":n+" pages",{k:clamp(ag_spr(tt,flow0-0.2,0.8),0,1.2),a:nA});
  const mins=40*clamp((tt-flow0)/(P.forty+0.3-flow0),0,1);
  pc_clock(x,500,590,330,mins,Math.round(mins)+" min",{k:clamp(ag_spr(tt,P.pages-0.2,0.8),0,1.2),a:ag_io(tt,P.pages-0.2,P.other-0.7,0.4)});
  // what it brought back, out of the sphere: another university's rule; caught in review, it goes back, and round again
  const CR={kick:"Census rules",title:"Another university’s"},cw=420,chh=ag_textCard(x,0,0,cw,CR,{measure:1}).h,ccx=500+cw/2,ccy=440+chh/2;
  const out=clamp((tt-P.brought+0.2)/1.0,0,1)*(1-clamp((tt-P.again+0.1)/0.8,0,1));
  if(out>0.01){const F=pc_fly(out,rx,ry,rx-240,ry-260,ccx,ccy);
    pc_flown(x,F,ccx,ccy,()=>ag_textCard(x,500,440,cw,CR,{a:clamp(out*3,0,1),kickCol:AG.orange,edge:AG.amber,edgeA:0.85*ag_in(tt,P.another-0.2,0.4)}),{w:cw,h:chh,a:clamp(out*3,0,1)});}
  ag_pill(x,710,640,"Not our rule",{col:AG.amber,icon:"warn",a:ag_io(tt,P.caught-0.1,P.again,0.35)});
  ag_verdict(x,rx,ry-R-46,"Again","loop",ag_io(tt,P.again-0.1,P.broken+0.6,0.4));
  // the point, on the wall
  pc_wall(x,["A plan that doesn’t say","what the agent may use"],500,520,{size:40,align:"left",a:ag_in(tt,P.waste-0.1,0.7)});}

/* ---------------------------------------------------------------- 3 · Plan
   Clara, from Planning, stands by Jun's desk and asks for the count by level; she goes, and her request becomes the page Jun writes
   before the agent starts, a row as each is said: the goal, what to read, the tools, where it may write, what it must never do, a
   limit. Two rows wait, closed, for the checks: the next chapter goes on in the same shot. */
const PC_PAGE=[470,140,900],PC_R3=[1660,760,110,56];
const PC_ROWS=[{k:"Goal",v:"Students on census day, by level"},
  {k:"Read",v:"Glossary: student, census day, level of study; the census-day count it builds on"},
  {k:"Tools",v:"Catalog, Query, Docs, read only",icon:"lock"},{k:"Write",v:"Own branch and sandbox only"},
  {k:"Never",v:"Names, student IDs, writes to production"},
  {k:"Checks",v:"Levels add up to 18,412; every student has one level"},
  {k:"Tests",v:"Written first, approved by Jun; only a person changes them"},{k:"Limit",v:"10 rounds, then report"}];
const pc_page=(x,o)=>pc_plan(x,PC_PAGE[0],PC_PAGE[1],PC_PAGE[2],PC_ROWS,Object.assign({title:"Census-day count by level"},o));
scene("plan",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),asks:wAt(sc,"asks","asks"),page:c.page,one:wAt(sc,"page","one page"),
    goal:c.goal,students:wAt(sc,"goal","students"),reads:c.reads,glossary:wAt(sc,"reads","glossary's"),builds:wAt(sc,"reads","builds"),
    tools:c.tools,catalog:wAt(sc,"tools","Catalog"),ronly:wAt(sc,"tools","read only"),writes:c.writes,only:wAt(sc,"writes","only"),
    never:c.never,names:wAt(sc,"never","names"),prod:wAt(sc,"never","production"),limit:c.limit,ten:wAt(sc,"limit","ten"),reports:wAt(sc,"limit","reports")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_planRoom(x,tt,P)}]);});

function pc_planRoom(x,tt,P){const G=P.g0+tt,[rx,ry,R,r]=PC_R3,cl=1-ag_in(tt,P.page-0.2,0.9);
  // the agent, dim, waiting for the page: it comes once Clara has gone
  pc_agent(x,G,rx,ry,R,r,{core:0.25,a:ag_in(tt,P.page+0.8,0.8)});
  if(cl>0.004)withA(x,cl,()=>ag_person(x,"clara",1480,640,0.92,{t:G+1.3,flip:true,gaze:[3,0.2],smile:0.3}));
  pc_jun(x,G,{gaze:tt<P.page?[3.4,-0.4]:[2.6,-0.6]});
  ag_roomLight(x,1);
  pc_steps(x,0);
  // Clara's request, by her; it goes as the page comes
  const q=pc_pop(tt,P.asks-0.3,P.page+0.1);
  ag_textCard(x,640,210,600,{kick:"Planning",title:"Census-day count by level",sub:"for the government’s report"},{k:q.k,a:q.a,kickCol:AG.mut,tail:{side:"right",at:0.75,px:1350,py:440}});
  // the page: each row's label as its line starts, its words as they're said, the row being written in a soft light
  const pg=pc_pop(tt,P.one-0.2,null),RT=[[P.goal,P.students-0.1,P.students+2.2],[P.reads,P.glossary-0.1,P.builds+0.6],[P.tools,P.catalog-0.1,P.ronly+0.6],
    [P.writes,P.only-0.1,P.only+2.0],[P.never,P.names-0.3,P.prod+0.5],null,null,[P.limit,P.ten-0.1,P.reports+0.3]];
  pc_page(x,{ka:pg.k,a:pg.a,grow:RT.map(T=>T?clamp((tt-T[0]+0.5)/0.7,0,1):0),lab:RT.map(T=>T?ag_in(tt,T[0]-0.1,0.4):0),k:RT.map(T=>T?(tt<T[0]-0.1?0:pc_type(tt,T[1],T[2])):0),
    hi:RT.map(T=>T?0.9*ag_io(tt,T[0]-0.1,T[2]+0.6,0.4):0),hiCol:AG_OAK.dark});}

/* ---------------------------------------------------------------- 4 · Define the check
   The same shot: the step moves on, and the Checks row opens on the page. Nobody knows the answer yet: beside the page, the count
   by level with a question mark for each level and only its total known, 18,412. What must be true of any right answer comes in as
   it's said: the + and = that make the levels add up to the total, one level each, the word as the glossary (the Read row) defines
   it; neither says how many. The count goes, and the agent writes the two checks as tests: they fly up beside the page, Jun approves
   them, and they lock, so only a person changes them; the agent's arm tries for one and stops. The tests go, and two rules for the
   agent come in their place: what everyone uses can be wrong, and it says so, with its evidence; where nobody can say what's right,
   it brings the options, for a person to choose. Then Singapore's list, whole before the plant made any water: none of its measures
   said what the results would be, only what the water had to meet (the bottle's mark). */
const PC_T1=[1410,150,450],PC_T2=[1410,370,450],PC_TT=["Levels add up to 18,412","Every student has exactly one level"];
// the two rules, in the tests' place: what the agent does when the data disagrees, and when nobody can say what's right
const PC_RULES=[{kick:"What everyone uses",title:"Can be wrong",sub:"sometimes for years"},{kick:"If nobody can say",title:"The options",sub:"for a person to choose"}];
scene("define",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),matters:wAt(sc,"matters","matters"),unknown:c.unknown,
    nobody:wAt(sc,"unknown","nobody"),must:c.must,right:wAt(sc,"must","right answer"),levels:wAt(sc,"adds","levels"),add:wAt(sc,"adds","add up"),
    count:wAt(sc,"adds","count already"),every:wAt(sc,"one","every"),exactly:wAt(sc,"one","exactly"),glossary:wAt(sc,"one","glossary"),
    neither:c.neither,many:wAt(sc,"neither","how many"),relate:wAt(sc,"neither","parts relate"),mean:wAt(sc,"neither","words mean"),tests:c.tests,writes:wAt(sc,"tests","writes"),approves:wAt(sc,"tests","approves"),
    onlyw:wAt(sc,"only","only"),person:wAt(sc,"only","person"),moving:wAt(sc,"only","moving"),wrong:c.wrong,years:wAt(sc,"wrong","years"),
    says:wAt(sc,"wrong","says so"),options:c.options,brings:wAt(sc,"options","brings"),choose:wAt(sc,"options","choose"),
    like:c.like,written:wAt(sc,"like","written"),meet:c.meet,had:wAt(sc,"meet","had to meet")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_defineRoom(x,tt,P)},
    {at:P.like-0.3,dis:0.9,place:"pcPlant",keys:[[P.like-0.3,960,540,1.03],[P.like-0.2,980,540,1.0]],push:0,draw:(x,tt)=>pc_plantAgain(x,tt,P)}]);
  pc_tags(ctx,S,t,[[P.like-0.3,"Singapore · 1998 to 2000"]]);});

function pc_defineRoom(x,tt,P){const G=P.g0+tt,[rx,ry,R,r]=PC_R3,wake=ag_in(tt,P.writes-0.4,0.6);
  // the agent: awake as it writes the tests, and thinking again while its two rules are said
  pc_agent(x,G,rx,ry,R,r,{core:lerp(0.25,1,wake),think:Math.max(0.6*ag_io(tt,P.writes-0.2,P.approves,0.4),0.5*ag_io(tt,P.says-0.3,P.like-0.6,0.5))});
  // its arm tries for the second test as "moving the mark" is said, and stops short of it
  const tr=ag_sine((tt-P.moving+0.5)/0.7)*(1-ag_sine((tt-P.moving-0.5)/0.8));if(tr>0.002)ag_reach(x,[1700,650,1712,616,1730,592,1752,552],tr*0.78);
  pc_jun(x,G,{gaze:tt<P.writes?[2.6,-0.8]:tt<P.person?[3.6,-1.6]:[3.2,-1.2],nod:0.06*ag_io(tt,P.approves-0.1,P.approves+0.7,0.3)});
  ag_roomLight(x,1);
  pc_steps(x,ag_sine((tt-P.matters+0.2)/0.9));
  // the page: Checks opens and is written as the two checks are said; the Read row lit as the glossary is named; then Tests, in two parts
  pc_page(x,{grow:[1,1,1,1,1,clamp((tt-P.matters+0.3)/0.9,0,1),clamp((tt-P.tests+0.3)/0.9,0,1),1],
    k:[1,1,1,1,1,pc_type2(tt,P.levels-0.1,P.count-0.2,24/52,P.every-0.1,P.every+1.5),pc_type2(tt,P.writes-0.1,P.approves+0.5,31/58,P.onlyw-0.1,P.person+1.3),1],
    lab:[1,1,1,1,1,ag_in(tt,P.matters,0.4),ag_in(tt,P.tests,0.4),1],
    hi:[0,0.9*Math.max(ag_io(tt,P.glossary-0.3,P.glossary+1.6,0.4),ag_io(tt,P.mean-0.3,P.mean+1.4,0.4)),0,0,0,0.9*ag_io(tt,P.matters,P.tests-0.2,0.4),0.9*ag_io(tt,P.tests,P.wrong-0.4,0.4),0],hiCol:AG.blue});
  // the count nobody knows yet, beside the page: a question mark for each level, its total known; the + and = come in as "add up" is
  // said, "one level each" under it; the question marks pulse as neither check says how many; then the + and = as "how the parts
  // relate" is said, and the Read row, the glossary's words, as "what the words mean"; it goes before the tests come
  const uk=pc_pop(tt,P.nobody-0.3,P.tests-0.45);
  pc_unknown(x,PC_T1[0],PC_T1[1],PC_T1[2],{k:uk.k,a:uk.a,rel:ag_in(tt,P.add-0.2,0.6),one:ag_in(tt,P.exactly-0.1,0.5),
    q:Math.max(ag_io(tt,P.nobody,P.nobody+0.9,0.35),ag_io(tt,P.many-0.2,P.many+1.0,0.35)),relHi:ag_io(tt,P.relate-0.2,P.relate+1.0,0.35),
    oneHi:ag_io(tt,P.mean-0.2,P.mean+1.0,0.35)});
  // the two tests, out of the sphere and up beside the page; approved by Jun; locked; they go as the agent's rules are said
  const tg=1-ag_in(tt,P.wrong-0.3,0.45);
  [PC_T1,PC_T2].forEach(([tx,ty,tw],i)=>{const u=clamp((tt-P.writes-0.35*i+0.1)/1.0,0,1);if(u<=0.01||tg<=0.01)return;const h=pc_test(x,tx,ty,tw,PC_TT[i],{lock:0,a:0}).h,cx=tx+tw/2,cy=ty+h/2;
    const F=pc_fly(u,rx,ry,rx-80,ry-260,cx,cy),lk=clamp((tt-P.person+0.2-0.15*i)/0.6,0,1);
    x.save();x.globalAlpha*=tg;
    pc_flown(x,F,cx,cy,()=>pc_test(x,tx,ty,tw,PC_TT[i],{a:clamp(u*3,0,1),lock:lk,ok:clamp((tt-P.approves+0.1-0.2*i)/1.0,0,1),okLeft:1}),{w:tw,h,a:clamp(u*3,0,1)});
    if(i===1)pc_lockFlash(x,tx+tw-40,ty+36,ag_io(tt,P.moving+0.1,P.moving+0.8,0.25));x.restore();});
  // the agent's two rules, in the tests' place: the first, amber, as what everyone uses can be wrong, its pill as it says so; the
  // second, violet, as it brings the options
  const [rx0,ry0,rw]=PC_T1,h1=ag_textCard(x,0,0,rw,PC_RULES[0],{measure:1}).h,r1=pc_pop(tt,P.wrong+0.15,null),r2=pc_pop(tt,P.options-0.1,null);
  if(r1.a>0.01){ag_textCard(x,rx0,ry0,rw,{kick:PC_RULES[0].kick,title:PC_RULES[0].title,sub:" "},{k:r1.k,a:r1.a,kickCol:AG.amber,edge:AG.amber,edgeA:0.85});
    ag_T(x,PC_RULES[0].sub,rx0+28,ry0+148,{w:500,size:28,col:AG.mut,a:r1.a*ag_in(tt,P.years-0.3,0.5)});}
  ag_pill(x,rx0+rw/2,ry0+h1+42,"Says so, with evidence",{col:AG.amber,icon:"warn",a:ag_in(tt,P.says-0.1,0.4)});
  const y2=ry0+h1+96;
  if(r2.a>0.01){ag_textCard(x,rx0,y2,rw,{kick:PC_RULES[1].kick,title:PC_RULES[1].title,sub:" "},{k:r2.k,a:r2.a,kickCol:AG.violet,edge:AG.violet,edgeA:0.6});
    ag_T(x,PC_RULES[1].sub,rx0+28,y2+148,{w:500,size:28,col:AG.green,a:r2.a*ag_in(tt,P.choose-0.4,0.5)});}}
// Singapore again: the plant still dry, its bottle empty by the tap, the list of how it will be judged already whole; as "had to meet"
// is said, the bottle's mark lights, and its pill: each measure set what the water had to meet, not what it would show
function pc_plantAgain(x,tt,P){pc_tap(x);const m=ag_io(tt,P.had-0.2,P.had+2.4,0.5);pc_bottle(x,PC_TAP[2],790,230,{fill:0,line:0.78,mark:m});pc_list(x,120,170,620,1,{});
  ag_pill(x,430,624,"written before any water",{a:ag_in(tt,P.written-0.1,0.5)});
  ag_pill(x,430,704,"what it had to meet",{a:ag_in(tt,P.had-0.1,0.5)});}

/* ---------------------------------------------------------------- 5 · Do
   The agent at work, in its sandbox, with the three tools the plan gave it: three words from Docs, the tables from Catalog, the count
   by level built in the sandbox. The first run fails the first test, 28 short; Query finds 28 students with no level, exchange
   students, and, asked of every census day since 2021, the same each year: every split by level since was short. It doesn't drop them
   or touch the test: it asks Mei, with its evidence and two options that both add up, and she decides from the government's list; the
   years before go to Planning, for people to look into. Then the third level goes in, both tests pass, the description is written
   from the glossary, and the pull request opens with its evidence. */
const PC_R5=[1230,400,150,76],PC_SB=[780,760,600],PC_CX=[570,740,420],PC_DT=[[90,160,450],[90,420,450]];
const PC_QEV=[{kick:"Query",title:"census day, no level",col:AG.blue},{kick:"Result",title:"28 students",col:AG.orange}];
scene("do",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),words:wAt(sc,"builds","three words"),tables:wAt(sc,"builds","tables"),
    count:wAt(sc,"builds","count by level"),red:c.red,fails:wAt(sc,"red","fails"),n384:wAt(sc,"red","eighteen"),short:c.short,query:wAt(sc,"looks","Query"),
    n28:wAt(sc,"looks","twenty-eight"),exchange:c.exchange,since:c.since,n2021:wAt(sc,"since","twenty twenty-one"),split:c.split,
    shortw:wAt(sc,"split","short"),doesnt:c.doesnt,touch:wAt(sc,"doesnt","touch"),meaning:c.meaning,meis:wAt(sc,"meaning","Mei's"),
    asks:c.asks,two:wAt(sc,"asks","two options"),options:c.options,home:wAt(sc,"options","or the level"),
    mei:c.mei,list:wAt(sc,"mei","government's"),nonaward:wAt(sc,"mei","non-award"),own:wAt(sc,"mei","own"),
    years:c.years,planning:wAt(sc,"years","Planning"),look:wAt(sc,"years","look into"),
    again:c.again,adds:wAt(sc,"again","adds"),runs:wAt(sc,"again","runs"),n412:wAt(sc,"again","eighteen"),every:wAt(sc,"again","every"),pass:c.pass,
    descr:wAt(sc,"pr","description"),opens:wAt(sc,"pr","pull request"),evidence:c.evidence,claim:wAt(sc,"evidence","claim")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_doRoom(x,tt,P,0)},
    {at:P.asks-0.4,later:true,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_meiRoom(x,tt,P)},
    {at:P.again-0.4,later:true,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_doRoom(x,tt,P,1)}]);
  // the steps stay put over the shots, while one moment in the lab gives way to the next
  pc_steps(ctx,2);});

function pc_doRoom(x,tt,P,part){const G=P.g0+tt,[rx,ry,R,r]=PC_R5,[sx,sy,sw]=PC_SB,after=part===1,keep=after?1-ag_in(tt,P.opens-0.5,0.5):1;
  // the agent, at work; its arms out to each tool in turn (Catalog, Query, Docs), data coming back along them
  const RT=after?[null,null,[P.descr-0.4,P.opens-0.3]]:[[P.tables-0.3,P.count+0.4],[P.query-0.4,P.shortw-0.2],[P.words-0.4,P.tables-0.2]],
    U=RT.map(T=>T?ag_sine((tt-T[0])/0.9)*(1-ag_sine((tt-T[1])/0.9)):0);
  pc_agent(x,G,rx,ry,R,r,{think:after?0.6*ag_io(tt,P.adds-0.3,P.pass,0.4):0.6*ag_io(tt,P.words-0.4,P.touch+0.4,0.4)});
  U.forEach((u,i)=>{if(u>0.002)ag_reach(x,pc_arm(i,rx,ry,R),u,{data:RT[i]?clamp((tt-RT[i][0]-0.9)/1.4,0,1):0});});
  ag_sandbox(x,sx,sy,sw,{depth:110,a:keep});
  ag_roomLight(x,1);
  for(let i=0;i<3;i++)pc_tool(x,i,{touch:clamp((U[i]-0.85)/0.15,0,1)});
  if(!after){
    // three words from Docs, in orange: data brought back
    ["student","census day","level of study"].forEach((s,i)=>ag_pill(x,1310,612+i*64,s,{col:AG.orange,a:ag_io(tt,P.words+0.6+0.3*i,P.count+0.6,0.35)}));
    // the query's answer, at the top: 28 students with no level; exchange students
    const qa=ag_io(tt,P.n28-0.3,P.since-0.55,0.35),qk=clamp(ag_spr(tt,P.n28-0.3,0.8),0,1.2);
    if(qa>0.01){ag_textCard(x,560,170,500,{kick:"Query · census day",title:"28 students, no level",sub:" "},{k:qk,a:qa,kickCol:AG.blue,edge:AG.orange});
      ag_T(x,"exchange students, single units",560+28,170+148,{w:500,size:28,col:AG.mut,a:qa*ag_in(tt,P.exchange-0.1,0.5)});}
    // then every census day since 2021, in its place: no level, every year, a mark for each as it's said; every split since, short
    const ya=pc_pop(tt,P.since-0.1,P.meaning-0.6);
    pc_years(x,560,170,500,{k:ya.k,a:ya.a,n:5*clamp((tt-P.n2021+0.1)/1.4,0,1),split:ag_in(tt,P.shortw-0.2,0.5)});
    // the question for Mei, with its query and the result clipped to it; it goes to her
    const qs=pc_pop(tt,P.meaning-0.2,null),off=ag_sine((tt-P.asks+1.3)/0.9);
    ag_evidence(x,560-640*off,160,500,{kick:"For Mei",title:"Which level are these 28?"},PC_QEV,{k:qs.k,a:qs.a*(1-off),kickCol:AG.mut,ew:240});}
  // the tests, on the left, locked; the first fails, 28 short, until the third level goes in; then both pass
  const s1=after?(tt>P.n412+0.3?"pass":"fail"):(tt>P.fails-0.1?"fail":"set"),s2=after&&tt>P.every+0.3?"pass":"set";
  const T1=pc_test(x,PC_DT[0][0],PC_DT[0][1],PC_DT[0][2],PC_TT[0],{state:s1,lock:1,note:s1==="fail"?"18,384 · 28 short":null,noteA:after?1:ag_in(tt,P.short-0.2,0.5),a:keep});
  pc_lockFlash(x,PC_DT[0][0]+PC_DT[0][2]-40,PC_DT[0][1]+36,after?0:ag_io(tt,P.touch-0.1,P.touch+0.7,0.25));
  pc_test(x,PC_DT[1][0],PC_DT[1][1],PC_DT[1][2],PC_TT[1],{state:s2,lock:1,a:keep});
  if(after)ag_verdict(x,PC_DT[1][0]+PC_DT[1][2]/2,660,"Both tests pass","pass",ag_in(tt,P.pass-0.1,0.4)*keep);
  // the count by level, in the sandbox: two levels, then the third; its total, orange, then green once it matches
  const k2=after?ag_sine((tt-P.adds+0.1)/1.0):0,cg=after&&tt>P.n412-0.2,cnt=after?1:ag_in(tt,P.count-0.1,0.5),[cx0,cbot,cw]=PC_CX,ch=288+50*ag_sine(k2);
  pc_count(x,cx0,cbot-ch,cw,{k:[cnt,after?1:ag_in(tt,P.count+0.3,0.5),k2],newA:after?ag_io(tt,P.adds,P.pass+0.6,0.4):0,total:cg?"18,412":"18,384",totalCol:cg?AG.green:AG.orange,
    totalA:after?(cg?ag_in(tt,P.n412-0.2,0.4):1-ag_in(tt,P.runs-0.2,0.4)):ag_in(tt,P.n384-0.2,0.4),edge:cg?AG.green:null,
    a:keep*(after?1:ag_in(tt,P.count-0.5,0.35)),ka:after?null:clamp(ag_spr(tt,P.count-0.5,0.8),0,1.2)});
  // its description, from the glossary; then the pull request, with what changed, why, and the evidence
  if(after){const dk=pc_pop(tt,P.descr-0.2,null);ag_textCard(x,cx0,190,cw,{kick:"Description",title:"Level of study",sub:"source: the glossary"},{k:dk.k,a:dk.a*keep,kickCol:AG.mut});
    const pk=pc_pop(tt,P.opens-0.3,null),op=clamp((tt-P.evidence+0.1)/(P.claim+0.4-P.evidence),0,1);
    ag_evidence(x,140,180,800,{kick:"Pull request",title:"Census-day count by level",sub:"from the agent’s branch"},PC_PREV,{k:pk.k,a:pk.a,open:op,kickCol:AG.mut});}}
const PC_PREV=[{kick:"What",title:"the count by level, with non-award"},{kick:"Why",title:"Clara’s request; Mei’s decision"},
  {kick:"Evidence",title:"both tests pass; the query and its result",col:AG.green}];

// Mei, in the lab: the question has come to her; she checks the government's list, and decides
function pc_govList(x,X,Y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=["Undergraduate","Postgraduate","Non-award"],h=28+38+rows.length*48+20;if(a<=0.01)return;x.save();x.globalAlpha*=a;
  if(o.k!=null)ag_about(x,X+w/2,Y+h/2,lerp(0.5,1,o.k));ag_box(x,X,Y,w,h,22,{});
  ag_T(x,"THE GOVERNMENT’S LIST",X+28,Y+50,{w:700,size:28,ls:4,col:AG.mut});
  rows.forEach((s,i)=>{const yy=Y+104+i*48;if(i===2&&o.hi>0.01){x.save();x.globalAlpha*=o.hi;x.fillStyle=rgba(AG_OAK.dark,0.14);x.beginPath();ag_rect(x,X+14,yy-34,w-28,46,12);x.fill();x.restore();}
    ag_T(x,s,X+28,yy,{w:600,size:32});});
  x.restore();}
function pc_meiRoom(x,tt,P){const G=P.g0+tt;
  ag_person(x,"mei",520,640,0.95,{t:G+0.6,gaze:tt<P.list?[3.2,-1.2]:tt<P.own?[3.8,-0.6]:tt<P.years?[3.4,0.2]:[3.8,0.6],nod:0.05*ag_io(tt,P.own-0.1,P.own+0.8,0.3),smile:0.25*ag_in(tt,P.own,0.8)});
  ag_roomLight(x,1);
  // the question comes to her, with its evidence; the two options under it, both adding up, each as it's said
  const qs=ag_eo(clamp((tt-P.asks+0.4)/0.7,0,1));ag_evidence(x,lerp(680,800,qs),150,560,{kick:"For Mei",title:"Which level are these 28?"},PC_QEV,{a:qs,kickCol:AG.mut,ew:240});
  const op=pc_pop(tt,P.two-0.2,null);pc_options(x,800,376,560,{k:op.k,a:op.a,A:ag_in(tt,P.options-0.1,0.4),B:ag_in(tt,P.home-0.1,0.4),pick:ag_in(tt,P.nonaward-0.1,0.5)});
  // she checks the government's list, and decides: the first
  const lk=pc_pop(tt,P.list-0.3,null);pc_govList(x,1390,376,480,{k:lk.k,a:lk.a,hi:ag_in(tt,P.nonaward-0.1,0.5)});
  const dk=pc_pop(tt,P.own-0.3,null);ag_textCard(x,800,656,560,{kick:"Decided",title:"Non-award: a level of its own",sub:"Mei Tanaka, Registrar’s office"},{k:dk.k,a:dk.a,kickCol:AG.mut});
  // the years before, with the agent's evidence, to Planning: for people to look into
  const pl=pc_pop(tt,P.planning-0.3,null);ag_textCard(x,1390,626,480,{kick:"To Planning",title:"Splits since 2021",sub:"for people to look into"},{k:pl.k,a:pl.a,kickCol:AG.mut,edge:AG.amber,edgeA:0.7});}

/* ---------------------------------------------------------------- 6 · Check
   Jun reads the pull request against his page, not the agent's word: a tick by each row it meets; four of ten rounds; the change is
   his. Noor, the second person, approves it into production; the agent's own review is there for reference, and approves nothing. As
   with the panel in Singapore, the work is held to its checks by people who didn't do it. */
const PC_PR=[1410,150,450];
scene("check",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),plan:wAt(sc,"person","plan"),jun:c.jun,goal:wAt(sc,"jun","goal"),
    tools:wAt(sc,"jun","tools"),names:wAt(sc,"jun","names"),untouched:wAt(sc,"jun","untouched"),green:wAt(sc,"jun","green"),four:wAt(sc,"rounds","four"),
    his:c.his,answers:wAt(sc,"his","answers"),noor:c.noor,prod:wAt(sc,"noor","production"),approve:wAt(sc,"noor","approve"),
    review:wAt(sc,"never","review"),approves:wAt(sc,"never","approves"),outside:c.outside}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",later:true,keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_checkRoom(x,tt,P)},
    {at:P.noor-0.4,later:true,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_noorRoom(x,tt,P)},
    {at:P.outside-0.4,later:true,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_heldRoom(x,tt,P)}]);
  pc_steps(ctx,3);});

function pc_checkRoom(x,tt,P){const G=P.g0+tt,[rx,ry,R,r]=PC_R3,[px,py,pw]=PC_PR;
  pc_agent(x,G,rx,ry,R,r,{core:0.6});
  pc_jun(x,G,{gaze:tt<P.plan?[3.4,-1.6]:tt<P.four?[2.8,-0.8]:[3.4,-1.4],nod:0.06*ag_io(tt,P.answers-0.1,P.answers+0.8,0.3)});
  ag_roomLight(x,1);
  // the page, a tick by each row the pull request meets, as it's said
  pc_page(x,{tick:[P.goal,0,P.tools,0,P.names,P.green,P.untouched,P.four].map(v=>v?ag_in(tt,v+0.1,0.4):0),hi:[0,0,0,0,0,0,0,0]});
  ag_evidence(x,px,py,pw,{kick:"Pull request",title:"Census-day count by level",sub:"from the agent’s branch"},PC_PREV,{kickCol:AG.mut});
  ag_pill(x,px+pw/2,506,"4 of 10 rounds",{a:ag_in(tt,P.four-0.1,0.4)});
  ag_pill(x,px+pw/2,586,"Owner · Jun",{a:ag_in(tt,P.his+0.6,0.4)});}

function pc_noorRoom(x,tt,P){const G=P.g0+tt,into=ag_sine((tt-P.approves-0.5)/1.0);
  ag_person(x,"noor",330,640,0.92,{t:G+0.4,gaze:tt<P.prod?[3.2,-1.4]:[3.6,-1.0],nod:0.05*ag_io(tt,P.approve-0.1,P.approve+0.8,0.3)});
  // the agent, small, below the pull request: its review is for reference only
  pc_agent(x,G,840,760,80,40,{a:ag_in(tt,P.review-0.5,0.6),core:0.8});
  ag_roomLight(x,1);
  // the pull request: Noor approves it, and it goes behind the glass, into production
  pc_flown(x,{x:lerp(840,1540,into),y:lerp(343,470,into),s:1},840,343,()=>{
    ag_evidence(x,560,220,560,{kick:"Pull request",title:"Census-day count by level",sub:"from the agent’s branch"},PC_PREV,{kickCol:AG.mut});
    ag_pill(x,840,520,"Approved · Noor",{col:AG.green,icon:"tick",a:ag_in(tt,P.approve+0.2,0.4)});});
  ag_pill(x,840,610,"Agent’s review · for reference",{col:AG.violet,a:ag_io(tt,P.review-0.2,P.approves+0.6,0.4)});
  ag_glass(x,1230,200,620,620,{label:"Production",a:ag_in(tt,P.prod-0.3,0.6)});}

// the panel, framed on the wall: painted once, with everything it ended with
const pc_panelPic=()=>ag_kept("pcPanelPic",W,H,c=>{c.drawImage(ag_place("pcPanel"),0,0);pc_panelShot(c,60,{results:-20,july:-10,well:-10,rules:-10,years:-10});});
function pc_heldRoom(x,tt,P){const G=P.g0+tt;
  ag_picture(x,560,190,800,450,{img:pc_panelPic()});
  pc_jun(x,G,{gaze:[3.0,-1.6]});
  ag_person(x,"noor",1600,640,0.92,{t:G+0.4,flip:true,gaze:[3.0,-1.4]});
  ag_roomLight(x,1);
  ag_label(x,960,742,"The panel · Singapore, 2000 to 2002",{align:"center",col:AG.mut,a:ag_in(tt,P.outside-0.2,0.5)});}

/* ---------------------------------------------------------------- 7 · What the loop leaves
   The four steps become a ring, and a light goes round it; on the bench, "In the project", the loop leaves a decision, its
   metadata and an updated skill; and the page itself comes back, its rows ready for the next job. */
const PC_CY=[760,310,170];
scene("leaves",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({loop:wAt(sc,"next","loop"),nextOne:wAt(sc,"next","next one"),
    decision:c.decision,meta:c.meta,skill:c.skill,plan:c.plan,starts:wAt(sc,"plan","starts")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",later:true,keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_leavesRoom(x,tt,P)}]);
  // the steps, kept from the chapter before, give way to the ring as it starts
  const t0=P.loop-0.4;if(t<t0+1.6)pc_steps(ctx,3,{a:1-ag_in(t,t0,0.5)});});

function pc_leavesRoom(x,tt,P){const [cx,cy,R]=PC_CY;
  ag_roomLight(x,1);
  pc_shelf(x,110,800,1360);
  // the steps across the top give way to the ring: it draws itself from the top, clockwise, each step coming on as it's reached;
  // then a light goes round it
  const t0=P.loop-0.4,dr=1.6,ring=clamp((tt-t0)/dr,0,1);
  const pu=pc_round(tt,t0+dr+0.3,2.0),lit=PC_CYC.map((d,i)=>{const dd=((pu.deg-d)%360+540)%360-180;return Math.max(clamp(1-Math.abs(dd)/50,0,1)*pu.a,i===0?ag_in(tt,P.starts-0.3,0.5):0);});
  if(ring>0){if(ring<1){ag_ring(x,cx,cy,R,{p:ag_sine(ring),from:-90,arrows:[-45,45,135,225].filter(d=>(d+90)/360<ag_sine(ring))});
      PC_CYC.forEach((d,i)=>{const a=ag_in(tt,t0+dr*(i/4)-0.05,0.35);if(a<=0.01)return;const q=d*Math.PI/180,px=cx+Math.cos(q)*R,py=cy+Math.sin(q)*R,w=ag_tw(x,PC_STEPS[i],{w:700,size:30})+54;
        ag_box(x,px-w/2,py-26,w,52,26,{a});ag_T(x,PC_STEPS[i],px,py+10,{w:700,size:30,align:"center",a});});}
    else pc_cycle(x,cx,cy,R,{pulse:pu,lit});}
  // on the shelf: a decision, metadata, a skill
  [[P.decision,{kick:"Decision",title:"Exchange students count as non-award",sub:"Mei Tanaka, Registrar’s office"}],
   [P.meta,{kick:"Metadata",title:"Level of study",sub:"in the glossary and the model, with its source"}],
   [P.skill,{kick:"Skill, updated",title:"reconcile-and-diff",sub:"every split adds up to its total"}]].forEach(([t0,wd],i)=>{
    const a=ag_in(tt,t0-0.1,0.3);if(a<=0.01)return;const h=ag_textCard(x,0,0,440,wd,{measure:1}).h,dr=ag_eo(clamp((tt-t0+0.1)/0.7,0,1));
    ag_textCard(x,120+i*470,784-h-lerp(90,0,dr),440,wd,{a,kickCol:AG.mut});});
  // the plan itself, its rows ready for the next job
  const pl=ag_eo(clamp((tt-P.plan+0.2)/0.9,0,1));if(pl>0.01)pc_plan(x,lerp(1940,1530,pl),130,350,PC_ROWS.map(r=>({k:r.k,v:""})),{lab:PC_ROWS.map(()=>1),k:PC_ROWS.map(()=>0),blank:1,a:pl});}

/* ---------------------------------------------------------------- 8 · Trust, earned
   Singapore once more: the panel, with its measures and its ticks; then the parade, the bottles raised again. Then the university:
   the count by level, checked, with its evidence, goes into the report to the government. The end card carries the takeaway. */
scene("trust",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),outside:wAt(sc,"sg","outside"),bottle:c.bottle,raised:wAt(sc,"bottle","raised"),
    trust:wAt(sc,"bottle","trust"),uni:c.uni,person:wAt(sc,"uni","person"),gov:wAt(sc,"send","government"),evidence:wAt(sc,"send","evidence"),breath:c.breath}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"pcPanel",keys:[[0,960,520,1.03],[0.1,960,540,1.0]],d:6,push:0,draw:(x,tt)=>pc_panelShot(x,tt,{results:-20,july:-10,well:P.outside-0.2,rules:-10,years:-10})},
    {at:P.bottle-0.5,dis:1.0,place:"pcStadium",keys:[[P.bottle-0.5,960,560,1.08],[P.bottle-0.4,960,540,1.0]],d:7,push:0,draw:(x,tt)=>pc_crowd(x,tt,ag_sine((tt-P.raised+0.4)/2.6),ag_sine((tt-P.trust+0.1)/1.6),1)},
    {at:P.uni-0.4,dis:1.0,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_sendRoom(x,tt,P)}]);
  pc_tags(ctx,S,t,[[0.4,"The panel · 2000 to 2002"],[P.bottle-0.5,"National Day Parade · 9 August 2002",1.0],[P.uni-0.4,"The university",1.0],[P.breath,null,0.6]]);
  ag_end(ctx,S,t,P.breath+0.2,PC_TITLE,"Decide how you’ll check before the agent starts.","Film 5 of 9","Agents at work on data");});

const PC_SENDEV=[{kick:"Tests",title:"2 of 2 pass",col:AG.green},{kick:"Query",title:"the 28, and its result",col:AG.orange},{kick:"Decision",title:"non-award, Mei Tanaka"}];
function pc_sendRoom(x,tt,P){const G=P.g0+tt,[rx,ry,R,r]=PC_R3,go=ag_sine((tt-P.gov+0.2)/1.1);
  pc_agent(x,G,rx,ry,R,r,{core:0.8});
  pc_jun(x,G,{gaze:tt<P.gov?[3.0,-1.2]:[3.6,-1.4],smile:0.25*ag_in(tt,P.evidence,0.8)});
  ag_roomLight(x,1);
  pc_outbox(x,1240,220,620,{h:400,a:ag_in(tt,P.uni+0.6,0.6)});
  // the count, checked, with its evidence; at "government" it goes into the report
  const ck=pc_pop(tt,P.uni-0.2,null);
  pc_flown(x,{x:lerp(800,1550,go),y:lerp(323,467,go),s:1},800,323,()=>ag_evidence(x,520,200,560,{kick:"Census-day count",title:"18,412 students",sub:"by level: 13,906 · 4,478 · 28"},
    PC_SENDEV,{k:ck.k,a:ck.a,kickCol:AG.mut,edge:AG.green,edgeA:0.8*ag_in(tt,P.person,0.5)}));
  ag_tick(x,1820,264,26,rgba(AG.green,ag_in(tt,P.evidence,0.4)),4);}

// the chapters that open on a cut: the title card to the lab, the same shot going on (plan to define), the plant to the sandbox, and
// the lab between people; plan (Jun where he was) and trust (the lab to the panel) keep the engine's dissolve, as nothing shows twice
ag_cutInto(["long","define","do","check","leaves"]);

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
