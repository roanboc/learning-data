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
const LOGO_SRC={databricks:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXEAAAGQCAYAAABYn1CDAACLz0lEQVR42u2deZhcVbX2f2vv6pBgUBARmdJdlQiaq0ydHhKUOM+oF404gAoCchGZh8xJZ2QeFJDBAecheq96na7DB1GBruq0TIqCSVV3AAGZZMzQdfb6/jinqk9VBwzQ3ae6z17Pc5/n8z7fNafr7PPutd611vuCDx/jKBREZ5Op/ufp0ydX/99zsP4X8uHDh49GBe8YSGtHdn/tyP5YO7N3a3v2mAqw6xysgvG/mI/xEuJ/Ah9jHsDnYGUNAYDOzL0S5xaBHI8xE1AFYyBwPShdUij+vJqVr8EJqP8FfXgQ9+EjmezbACqg2rrHjmQmnQx6MsbsQeBACRAMisMaCwqqPyZglawr9Xgw9+FB3IePpMB7NkbWUgbQGbnDsbocY6bjFJwrI2JrzrfiEARrBOcGULkWDZZLT/8D9dm8Dx8exH34GBnwFmZjq+DdmW1HWY2Yt4BCoGHm/VznOszOLdaA6oMol1De9EXpvf8ZBWEOxoO5Dw/iPnwMN4DHee+O5hYw56AcizUZys5FJ3l7G5aKqsMYixEI9K+ILpJ86UeVf4s1qIDzv7wPD+I+fLxI8K5w1rr/7i9h0qTTwZyCNbtSDgYz6xea3CsOKxYRCNwNqC6Rnr7fA+hsMqwl8Hy5Dw/iPnw8b3TFMAepZt9tLZ/CmHkY2S/Ge2eG6Z9zKErGWJwCfBWn50lP6e4KmFcoHB8+PIj78PHc4F3Le8/Ivg3LMoyZiSoE22haDt8/HnLqGSME7gmUy8hMuEBuuuvJSlXg+XIfHsR9+Hg2DI1lvNq2z39gMmch8ilEoOwCBGE0FnVUA0QsGQvlYD3CJeRLVwk4XYKhCzxf7sODuA8fFcyMNy3b9twVM/EMVE/FmkkETlE0mjoZ3aJANcCaDCLg3DqcWyQ9/b+qPLOfL/fhQdxHusE7yqoFnIKlPXsCImdjzZSwaRllxMlGyJdXloUc/4voQsmXbq9UD7756cODuI+0gXfNPLZ25N4NLMVKO8GzLOsk/9C1y0LI5cjWi6T73vvqqwkfPjyI+xi/4F2zrDP1YJxbjpH3gEAQBIiMDu/9wv+IcKQxYyBwDwOrkYEvSfe9mzxf7sODuI/xC+Bx3vugffakKXMOwn9hTFOCvPcLh3JVhxGLtVB2t4Mul0Lph5W/1S8L+fAg7mPcgDfTUenChSJVOxyHynyseWVMpGqs6nwPNj8RUP01gXTJug03xcDcNz99eBD3MRbRrY73bs9+GJHFWHl9yHtvh87J2Pljw4w7YwyBC4BvQdAlhY0l8MtCPjyI+xhr4B3nvduzbwTmYsx7tlukauz+8TG+XB8DLqHMF6S3+HglM/fNTx8exH00LobVi1SpLEfMkRiBsnPRiRvvrjqD4lpWIHAbUO2iue87sobA8+U+PIj7aEjwropUtU97KeJOBM7ByM5R09IlxHtr9D8mkX87rpTo3M3AEsmXfgN+vtyHB3EfDZFy1olUdeQ+jbKEjLQQOHAJNi1VA4yxCBUKJ6nRxdplIeUHoCury0K++enDg7iPBMC7jvdueQdiFmDk0EhhMEAkGd47LmJVDh5BpZ+MOfhZHX9G77lizU/dDO4KTHmVdN/7aAXMPV/uw4O4j5EH7/jESes+U7GZlRhzBACBS7Jp6dAIJJ0C+nWCYBnZjf30txyLyDlYmyUIwOlwyti+kEsmFNcKgnuAS3ly0uVy551bNfzdxPPlPjyI+xh+7Ik3LTv3fjnaNBf4LNa8lAHnAE2M944LVQXul+CWSaG/u3LxCKh27v1yXNMJCGdizS6UE+bqQ7onEzkL3Q66QgqlNTGKxTc/fXgQ9zEs2fegSFVraxP20aMQurBm75D3TkykahAIrUBZ78DqfLm59LN6IKyRuJ0xJYfNnIbqiVhjXoC123D/DS7kywVc8BvUzJee4jrwzU8fHsR9vFjqpIb3zr0XYSVGDkieX47rfbsHQS9jkrtE1vZvVhCWINJVm8UO+Xtas+1kZDlG3hGaTSQ4vx7ny506lKtw5Ytk3cZifRXkw4cHcR/PE7xbDsCYRYh8qKHALtBNCF/FDqySm+75x/aC3ZCJmvbshzGyCJH9G6D5GePL3eOons8Wd6Xc1v+vZ7ucfPjwIO5jEEPivHfrlD1osueg8lmMTEx4WScyNDY2ysRrx/ReAO0Q0UQqoBFNdBIiZ2HNHolrmWvUeA2bnxtQVkuh9JV6msifWB8exH2EmBFKqIaANrt5IpvsCQhnDwJaYvPeIXgbGVyYUVkpheLPXyh4/9uLy9pzEDkOIzsSOBepKybfsFV3A4EukZ6+38fA3M+X+/AgnnLqpG5Zp/mjYBZizH8kTC2EDT8RizUQuPuAJRRKXxsJn8uhJhXZ/UHOAT4eSQYkvyyUMTYanVxDoItkXd9dHsx9eBBPL3jX8d7NnYhZgTFvbQDeO8z6rQHnnkL1GrZmzpVb1z9UnzmP+O/SkX07yMLBJabEfxcTOQs9jfJlrKySm4v/HOnfxYcHcR+NBOBDx+0WAMdURaqSG7cbzDgD5xD5HrBU8sW/jzZIbaP5eQwiSzAyJbaRmhBfXuMs9ADIMiYWr5W1lBUMS8A3Pz2I+xiP4B0XqZq+22R22uk04AysvKyhFl+cWwt6juT78knTBTW/2ezmndliT0E5NRL2SrhXEFdK1AK4lZLv+2nsuX3z04O4j3FCndRkZ9qe/Uw4hSH7UXZJTmHUWpwF7i6E1dJd/HqjAVGttVxLMxPMQtCjMVHVoCQ8tSM2XNbX/8WUz5WbN3pnIQ/iPsYBeNfx3lPfjLgVGDMr5L0bYR7aQNk9hHAuar8shfVPNKp+yJDmZ+eUg1G7EpF3hSbPrlGWhRT0WsqyUnqLG+svIR8exH2MBQCP897tU6aDXY7I4YlPWoSUDVhjwkuEL6N2pRTW3ztWwGYb8ruHg87DmBkNsiwUKjgG7mGcXIjb9EXpvf+Z+kvIhwdxH40IMHEOd2bulQRyEqJnRDPPSTrKK0qAlYqh8M8IgsWyrv+WyqUz1jRCajRl5mDpa/kcIueQMXuGNFWiWurlwR6D3gW6QvKlb9U/t/9iPIj7aERAAaEt91mMLsDavZNf1omJVAXuT6guk0LfT+ovnbF8cVaz8rbmV2HtWah+HmOaGuDijPHl7mbULJDChuvH6sXpw4P4eATvuiWVlveDzMOYzsbSAQnuwXEp7uVflN7egfGYDdZSWC0HIDIfkY/E+PIkl4XAion+07dwbkV1WciDuQdxH40A3tn9UVmO4f0N0WSr8N7ObUW4hIGmC6X37ofrM9dx/17ap74ZdBlW3hA1k5N0PHIIgjVC4J7CcCkZ+wX548gvUfnwIO7j2cr3GVP3wbrTQU7AyMSEx90iL0mpiFT9GNWlUui7rT5TTcElWx3rVBDacx9FdDnWTCWoVkgN4Czk+hF3EQ9nrpH167cMt5yBDw/iPuqBoaK617n3JLTpRFQWYGWXhlg8sabCvXajbr4U+lPPvdZcuLP224nywOkIp2Bll4Sbn3W9Cr0VlS4pbPhx5bn9fLkHcR/DCd61K+BzQBaRkddHzjrJmjMYU1EY3ADmPPIbvhI1WP0UxLbAvH1KFuwi4JNYYxMW14qUEm1YFTj9GaILqhK/Hsw9iPt4UeBdy6/OmDoLq0sGnWgawFE+5FcfBa7g8ScukLseebIetHw82/ucMgtrF2HMuxqELx/sY6h8BbN1pXTfe59/nx7EfbzYzK1z72m4pvkNkrnVyaLyVQJZKus23OM/9hdYWYXLQouw5sAYX57sRFGoIPkIyIVMfPJyWfvQU35ZyIO4j+dddk97KRKcAXIyVnZOnkONzRwH+lskWCn5/hvAj6m9YDAnmu2f3TyRLeZYHPPI2D0bxogj5Mv/Bm6p5Pu+H6NYvLiWB3EfQz7o+DTDzNxHcboSY7Kxee9MMh90TC2v7P4MdEmh9MPYB+050+G6uNuaX4Wxn0c5DSuTGmtZSH+LyqrqspB/9x7EfWxDpKot91aMLseYmcmbM0TqhmFp/U/gfGTgSum+d5MvrUf4HMxsfg2BWYqRI4DKOWgUZ6Fv4Mz50rPhLx7MPYj7DKzKe+dej9P5GPlo4ht+tYp4m0Gvw7ku6el/oP65fYzKpb6sgZQnI3EtfQb0Sja7lXJb/7/8ufAgnl7wbs29DKvzEE7FmB0SdpQfzLgUUPc/qHZVl3V8xjWaYF6rAd+R+zQwD2v2DcdKkwRzDam9jAGnfThdwaTS16vOQvixUg/i4/nDJK56lzsOyzkYaWmAxY+YS4zrBl1d5xLjwTuhC7+qStmaexlNnIrq57Fm1wYw9Bh0YwqFzeZLT9//+TPjQXx8lsg1ehot70BkJcbMaChzhsAVEbmA7uI11YvGTyE0XvU2s6UZx5kgn8WYpoao3qpSC/wcZInkN/SCn1ryID4ewDvOb3ZOPRinSzEc1gC8d8w5XZ8BvQIZOFe6733UNy3HynnKtqPMQ8wHIekmeJ3ZB1xBEJwnvRvvr7+EfHgQH4OZU+6VOBaDnhB5MiY5NhYKZGWMQRVUv0ugXXFZ0rSIVI1hMK9bFmp5PypLyZiDwmWhRME8VtnpA6i7mEn6RVnbv1lBWIJUeH4fHsQb9wOLi1Qx4fOonow1ezXUso5z12PMQrl5gzfUHctnrbJbMH36BCZvOh5hLsbshXPgGsBZKOyx/BnVC6TQ943YWfM0nQfxRs+OcoeDdmHt66JpgqQaULUiVYH+FdFV3qprnFZ9bXvuikw8E9GTMGZyVPW5RJUSrcmEW77uBlywQNZt9ImDB/GGAu/apmVr7hCsrsDIm4AGmut1D6FcwiR3iS9tU3AOO6dOQ90ykI81hDk2lWUhpyBfQ7aulu5714NvfnoQb5QMaNY+UylnFiLy6eijcdEvm/SyjoJey1ZdJbf09dc/t49xDuZtubdidSFi3tQwk1DhBvBTKJcSbL5Meu9/2J9LD+KjDt7V2d3XT9mFHe0pwOkYs1Py5gw1Whc/B7dc8n15n/GkDsxr6b3Olk/hZAEZ++pQXEsTpPdiYB64+xCzjCkbviJrCDxf7kF8dD+MjtynUZ1Pxry6YVxaQnOGXoQu6S79b+zS8R9G2hOOA5p3ZqL9PHAGRl7WEG5QgwtmN+Hccunp/1X9c/u36EF8BErUlndizAKMvDFSGExQzF+DUDLUQKD3gV5CufQF6WXA894+4mA+mHw0t6DmHESOx4hJ2Jc1qh6NBQXlh7hgpfT03+rB3IP48IP3zObX4OwyhDlI4s2i8N/OGEPZPYnwFbbYVXKrdy738RznuVZcawaGJYi8D0hedK26LKSbga+CWS2F9ff68+xB/MVnLuGyzlzgeIy8JOGxrZhIlYLyHZx2SU/pbp+5+NhOMK/zbI3JQDiNPFtJzrNVpCID8RBwnpc/9iD+/A84kUhVuEBxHCILsfKqhljWMVIxJb4eYZV0l37rwdvHiz7rs8mwOXs8yJlYyTZUjydwf0FlkfQU/yd21n2Px4P4v6FO2ls+EIK3mdEQq8xVqyxXQs1SKWzw228+hr/qPKB5Z3YwcxFOwpqXUHYukohohC3j32HM4uqWsZ+28iC+TfAOecLFGDkseWed+FytPg56GWW5WHqLj/vS0seIfgcdza8FuxDh44mLtVX0fmyk94N+HceqOIWY9u8gtSBeZ84whSbmovoZjJlA2QWAJNKxr9lwU4fq1yFYLoWNpUoG4kWqfIwYmMebnx3Zt6OyACuzG8ZZyBrBuSdwXMITT1wkdz3yZNqTmtSBeK3Q/h470rTDZ1BZhDW7NQQXWNGacO53IEslX/xj/XN7uPExwmBevxPxUaBr0FkoYe/Xylht2f0dw/nSXfpy9blJnxaQpPZgtmfnICzHmP1ijvJJZBmDTUsr4PR2As6TnuJ3YuDteW8fySY8s3bdieClxwFzMWa3BlgWiic83ThWSk/pZ2lMeMY9iG9jWedQjMzDmHc1Fu/tHgFWM9Fd4UWqfDQamA+u8O+9FzphHujxGNOU8LJQ5CxUWRbSH+PMQunZ8BdIT/NTUnP4WveZSqZpPnBMQ4hUVZYbnNuKyuVgLvHLDT4aOhmqXxYS7cLIe8LmZ5Dg5nLN97QF+ALl4JK0OAuNSxCvVRjcbyeCLaeCORVrXk45SH5Zp+JJ6PQHGFkh3cU70pQ5+BhHlW1n9jCUJVjTGo7jNohnbNn9E6MreGbTV+X2B58ez3y5jLMDNuh2AkJ79miE+RgzNaZzkuwCQzjvvQ7VFVLo+0nl0vFNSx9j7luLQFFbW5sw/zoBo2dizZSElRJj4loGguAvOF0mPX0/GK/fmoyTA1U3GtX8JtSsxJpZyfPeNavERZSLKZSuEgi8s46PcVX1hhIVp6D6eTJmJ8pJOwvFloUC90tEu6rSzOMIzMc0iA/l6ab+B+IWY+QjDeAo7yKRKiFwT4NcxubgArmt/1/1h9+Hj3H1HYZicWchHJO4WFxcbyicc/86xi2Xm8ePScqYBfGaDOCgffZkQuZUlJOwZlJDOMpbCf9t574NbpUUNt4JflnHR4rAvK3lUES6sBVnoQaYBMsYKOtjCF+izPnSW3x8rIO5jMGDUsvF2cc+h3DOoEhVklxcjdbD73G6SHr6fl8Bb9+09JESMK9bFsoeibIYa16d/E5GrDdVdn2ILCNfvE5AlVBezoP4SN7yNSJVufciuhxrDkq+Kx5zlHd6N+hy7yjvI/VgHl8W2n/3lzDxJScielbDbEcPKiXeiMoS6Sn+zmfio1GidU49GOdWYOTdQCPpOfwT5BI2Pf1Fuf3Bp8d6iebDx3CCeTX5mjF1H6xbCByNMU2UnYuQKNllIQHKwVdxu55Ab285AscxUTXLmHr5RueCHo81mUR571qRKlC9CnVd0tP/gAdvHz62o5Juy81AWITh/bEhhKT48jJGLOqehsxeUlj/hIJ4EH8xv+kSDF1x3vuR08Ccg5WXN5yjvLBauos31peP/rP14WM7wLwzexgqczEyK0G+3CFicO4+mp58rdwUKiN6EH9hL7iuIdJyBMg5g7x3Yt3tOndu7SHgXFlX/G8P3j58vMBvnShRA6EjdwKwOCEXrRDE1T1A5sl9xxqImwZ5oaJzQg0/WUOgbc0ztT37W4z9HiIHMeDKqGoi3n9KqC2esRblfgI9kfIuh8i64n8rmAp14gHch4/nlT06AadzQqCWfPFLbDH7Uw5WIjxDxtio8vW0ZKNn4vG5aZ21z1SCzBLgExhjEjZniDctnwG5jC3mEu8o78PHCHxu8f5XW3ZfDAtBjoq2LUdarE4REVQfALuf58RfyEt7/ZRd2NGeApyOMTslzHvXOcq7H+JkgXeU9+Fj5CvyWpu4lg6QVRjzlhFeFhrTdIok8KKqvLeCpSP3SdAFWDM1dA1JdHbUheNGAk7XQnCe5Pt/6cHbh49RxohIyC7MzHMfx+h8jPmPWPMzMwIg/g8yT77Gg/h237LZtwNLMWZWTGEw+ZXcQP+G6oVSKH0Faidl/Oflw8cofpbht6cCqtOm7cCu7lTQ07H2laFS4jAlfOGIocG5p5DMPp5O+ffgvT/CfFSOiMwZkhSpijvrPA1cxKZnzo/0h72jvA8fjQDmQ5aF9BxU/wtrzItaFqqYSRhjECAI/odg1yPo7S2PpYpbRu3Hb933FdjyPOC/yMikSKYyyWUdyBhTdZRXzq3y3l6kyoePRqNYapPB1mw7GeZhzAdRnq9iacycRUDdWgIuknWl/638W6kH8ZplndnNE9lkT0A4CyN7hk3LBhGpCtyvcCyWdaWeyqXjeW8fPsYQmHfk3gO6EGtmbscuySB4m2jfQ+mSQvHnYxG8RwTEh4pUtXwAzDKs7J88763lquCNc7eCLJd8zbKOd5T34WPsgPngstAcLP0tH49kb7PhgERNohgKXlmTiRRG/4xyCcHLvym9vQNjnTqVYfpB65x1WjpQMx8r728oHeFA/4FyAUHxCullwCsM+vAxxsE8Ttke0LwzO5gzEE7Bmp0iaeowebMGysF64Fxebr8lv1q/pf7/fqyGDOuPGCqUzUc5vtp0aAxH+QGUKxkony+33POP8fLyfPjwsQ0c6si9GlgK+lGsNQTBvSBX8Ez5arlj42Ox6jvd9mw14z+te+yInXQWop/D2t2GdfznhcB3hfcOaZQ1YM6T/IZeD94+fIxrimUbY8xyME3la+SP4w+8XzCIDxGpasv9J0ZXYO30kIsa9kH85wPeAUYqrh1/wpgF0r3hV+P15fnw4eNZMCq2LDTev395Hj9MLe89Y+osjFuGNW8Nee+EnXVEonlv3YhzF7Jj35dkLWXPe/vwkVIwX4LhhtmGtWvHtUDddgFuDd8UOlmfCXwmWtZJkvcOG6YZI5TdUyCXsyU4zzvK+/DhYwxXEsLs2Za1a932JJ/y78C76pF34LTdmBCcDJxCxuwULeu4xEWqnILodYg7T27u/9t4L518+PAxjgG8LvHcHiyTZ7kJagXb25o/hbFdWDMlbFomvKxjomF95/6PQFfLur61Hrx9+PAxlsG7mjBP320yL518HE7/nxT6boNwi5y12/YtkCFpfK110ttQlmNMZ4LWSdsC7w04WSw9xe/EfgC/rOPDh4+xRp3U9Oy0veWTiFmANftSdptBLwN7uRTW3/tsYC6DHEy8aZl7HUYXYeQjoQu0Js17h03LQB9FuADbdIXcdNeT9ZMyPnz48DFGwLsWcztbZqNmOUbeGBsUyYRLiu4RkGsoZy6W3rsfrqddJK4XoB3Z3YEzgJMxZofGcZR3W0GvRZpWS/ff76v/I3z48OFjLFEng7Psza8FuxDh49tImEO5gOrGqevDuIsxT14nNz3yZOUyCDPx2c0T2Ww/i+pZZMxeCRiV1lEnkTkDAs79AucWyrr+W2LUiee9ffjwMXbBe2bulThOAT0FY17ybxLmQTCv0MmqXRT6vi3gRNunZMH+iEzFUT4xkaraWycI1qGcL4XSGg/ePnz4GMPUSXxQxNLRcgzIIqzd53lutw+qMIpAEPSAO0K0Y+qbMHo95UYRqXL/QFnFU5OulTvv3OqXdXz48DFGwbtO1TX3Xox2Iab1RQ6KOBTIiMHJmzOIDuA0mXnvcM5cyBhLoJtxehFGviA3F/9ZX3748OHDx5gB70rTcg2BduZej9OlGA6HqpuZeRHyJJETkToMAxk0EWu0SKTKWFAIgm+BWy3dG++E2BiNB3AfPnyMJQCvJJ5rKWv7tL0hODOykptA4MIMergSZsGgJCJUBUYEI5ZAu3FBl/T0/6oGvL01mg8fPsZW9h3SvmsItJUmMrkTIZiLta+iHFSybzsSZPXoZ+AiiuqdBMFHyRcPkZ7+X+kSjIKRtZR949KHDx9jCbx1DlbACThta/kImWwBK5eCvIqBchDi3sjR1ZnR/5sRlC2g/dVm5Q0Y8NSJDx8+xgx4x3lvtDPbjrIMY96JKgxUee8R7zWOdiZuUBWMHITN3Kzt2e9re8sBlQxc52A1iekYHz58+NheAA8zb5W1lHVmS7O2Z69D5SaMeSdl5wiqgyKjgmUmkV/BqSNwDms+gkiPtmcv04P22VPWhJoAOieRJSMfPnz4eE7wVkKZD33DlF20o2UhTm7Hmk+hagenTkYXVw2CMvoz2AYwlF2A0kTGnsyEpnXakT1dp0+fIGsIlJAn90fHhw8fiYJ3hfce9PA8mq2ZW7F2OfBSyi6kgpPZcMeg0oSIQTUk4Eczwj9aGSiXgT0w5iImb+7RjuyHqo0CT7H48OEjGfCWatNyDYG25d5KR+4GjHwVYQoDQTlalU+UOTCg9+G0j6ZMyOHoqDcYBZEMqkrZBRj2x5gfakf2f3RG80FVimU2GQ/mPnz4GEXwVllDoO1Tpmt79nsYfouRQ0MGQTVa1kkck0IBrNY9XoGddAaiJ2HM5EiMJUnXHsgYE8kxXkWZC6S3uBH8FqcPHz5GEMDjtEnrvq/AluciekJMpMolnXnXore8sVaKtnPqtGg99BMgELgASWSjM6anYqHsHgR3EY9mviDr129REJYgcTdrHz58+HgR2bdhCUhXSOHSnz0Bw1yM2TtUdU3Mzezfg3ilfKgVaml5B8hirDkkFGpJUhxLy1UJxkDvAFkshQ0/rtya3tHHhw8fL4Y6qTXEyR6GZR7GzIxEqpJSdX1+IF5zG0VOOQqGjtynUJ2HNa/GOXBJaozjsBJqjKu7HucWSE//zfDc/nM+fPjwsU3wjieuHVNbwS1A5D9jLERjgvdzgXj1D4zzQgc078xE+TzImRjzUoJEDSMG+XKniuiXccFqKWws1T+3Dx8+fPxbfDtonz2Z0DQf5TNkZCIDzkUA2fjjzc8F4tv8Y2dMyWEyXYh+AmMkGmxPki83ZIwQuEdQ/QKBuUx6i497vtyHDx/bhI0lGLrQcNqteSKbzedAzsTKqxJ2Mxs5EN9m2dHWPBNjlmPMW2OGnqO2Ylr7cBpgTGiiXA7+jupC6en7QeUC8ny5Dx8+6g3VtX3qBxC3AmteF7mZJYdhowHiz/pDdGSPRGUBGXlNzNYtKU/OAGsyIV8e/AEx86S7eCN4vtyHjxSDd13TcuosTLAUa98eJqDa+Lz3cIJ4XUkS+sXN2m8nyltOQOQsrNkt4ZIkzpeD6tcwZpV0b1hfycw9X+7DR0oAPE4Fd06dhrozgOMxxlB2cUf5BO6WYbo0XiiIb/NHmjF1HzI6D+WzGAl/pPAfSZgv18dBL8Nt+YL0/OORemrIhw8f4w+8K4bqOmu/nQi2ngFyClZ2TjjJVEI/BYMOEynwYkF8m+VKa+4QMixCeCeQMF8eWxYKXAnkXPIbrhVQb77sw8e4o05qvmntaDkelbPImGkx3juTyKNV6V7A6SPArg0D4jVgXrMslJ0DspCM7B/jy5PgnjRqfobLQs7djLoFUui/vv7W9p+BDx9jErzrsKf5zYhZiTEzkx+8qCSSBpzeT8CZ4F5Ck72GgeDFXyoRiA8L3VEViqnYrBVKazBbOwncmaCPkLFJi2u5UFzLzMTY/6ft2Z/ojNzr4uJa/nPw4WNsgbfOJlPFnrap/xGKVNn/h5iZlF2AU5eISJXiAEfGWIRnKLvzwLZJT/E7iAx79T8if1wNX96+197IhIXA0Zgax+fk+HJrBOe2oFzKpuA8uWPjY/XP7cOHjwYF8Di+zMy9EtXTcXIKViY2gHifYo0FBdUfEMhyWVf8c7Xy789+moz58nBm4iN2Qw3hy9tbDgCWY8xhAARaHk0Lo2ctcwJXBC4iX7pKwHm+3IePhs2+B0WqpjOBydnjEc7G2n0oB8k2LVUd1lhEoBz8AdElVdp2NhmeahXp7R3Q9uxnhhvERywbrnrQVbR5C323SaHv/aj7AMotNJkMIpKsGUUQIJLDmCvoyN6o7S3v8GYUPnw0IHVSMWfowmlbyzvZKXsT1nwRZJ/RcJR/9ofTMoLQZC2qG3B6ND19s6XQf33FnUzWUmby5BHDuBGnNKqcVeUPyvf9lInBLAI9BdhIU6J8ucVFfLmYToz5P23P/VA7svt7MwofPhoAvGt47+YDtSP3M6z5FWJaKbtyZM4w+hV9iFdKxmaApyjrUuyEgyRfvK7iE1xJCEf6UUaNl45nuLK2f7Pki1+gycygrOcibCFjbMQpjb7fp2AJnMOpYuVDQI+2Zy/Vzr33krWUvXmzDx+jDOBxR/kZU/fR9uylGFPAyHtxqgTOISThrONQgrBpKUKg1xLoDCkUu+Smu56s4MRo9tZGvbkYZeXhDfvH9Q9JoTgP5zoJ3E8xYrDGoFpOgGIJRyBD8+YJWHMK2tSj7dnTdDYZb97sw8cogPcSjC4JRwZ1/91fou0tZ2LcrWTMKShNkSmxJDAYoSgBRgwZY3HuelQPlULxeFnXd1eFfk1iMCIRQBrCl/f03yqF0gdQ3otqgSZb4cuTAPOQLy8HAcgeWHMxm7MFbWv5iOfLffgYMeokdJTvinjv9uwcJr7kZjKZCxB5OQMuQd6bABEJwVv/inMflnzpLVIo/SHCAlOhX5P47RLNKmv48iUYyRd/wZTiLMruJFTvoykTlktJ8eUV82aRg7D2+9qe/aXOyLZ5vtyHj2ED71pH+fbsG7Uj+0us+QGG1zNQjnhvkuK9CalefQin8wg2z5B86UfV5w6xINFJtoagBqpd58qPUihdQRC0UdYVIJsjvlyTAXMsgToC57DmXVhu0vbcFdqam+L5ch8+XjR4Vxzls9qe/RoiN2DMuyg7R5Dgso5WlnXE4YLLKQcHSL54rvTe/0z8uRvht2wofrc6wD+bjPRuvF8KGxYhwcEEugYTlTMhkI/uzScYBBPx5RkyciIZ7dX2ljN1dvPEKs+/xPPlPnz8W4yMg/cBzTtre3YZkrkFaz6NqokMZ0xivLc1JlRDDf6XModKvu/z0rvx/iR57zED4lXMjPPl+f6/SqH4EVTfgXM3kTEWIyZRvnwgCEBeQcZewCab1/bsHAGtVBO++enDxzazb1OptnU2GW1v+SQTTS8Zswj0ZVHTkgR4b63y3k3GotpDUP5Pyfe9X3qLN8bBuxF1lhoWbIbOl5d+I/nSIag7DuXuhuDLB4Iyhv0x5gfakf2dzpg6q8KReb7ch48h1EnIe3c2v4vNuRvJ2K+D5BhwAZrYsk447RLy3v8g4LOUi4dIof/H8UmZRhbJa/iMsX4iRLpLX2Zz0EHgFiM8kSxfLhkCdTjnMOYtWP2Dtme/qu1Tsp4v9+HBewjvPV07s98D+0tE2kPwVpdQ09IRLutYhKfRYCVwsOQ3XCO9DMQnZRr9dx4zZX91ImQOVm7r/5fki8tBZhC4H1THf5Liy6nw5Wqw5mgkc4t2ZBdo594vr/LlHsx9pAnA4+Ddkd1d27OXgc1jzBHVQYEQvEcbgyrLOgYRwekaRGZKd99CyZcebFTee1yAeBzMq8tC+eLfpVA6AtVDcW5tA/DlhPPl+jKsWYE2FbQz+4l6ash/4j7GcfZtKnPTOn36BG3Pfg6ll4w5GZgc6hUl1bTUcFmnyVicuwl175R88SPSXbyj0XnvcQXiEcVSWRYKOatC6Q+SL70JVz4G1Q00ZTIIFXGtUX44sSgaqZRNBfMtbc9erx3Nb6pSQ54v9zEeqZNQ5yQ84+3NH2Ty5h6suRyRvRgIwsQqCTP1sEIPRaqcbiAIjmdK6VAp9P26EZZ1UgniMTB3sYkQkXz/13gmaCMIFqLyWCSuRWJ8uavOl78J7PXakf2Gtk6bWuXLvRmFj/ED3mFi1TG1VTtyP8Bk/gfD/hHNqAnNe0ciVcYiPElZl7IpaJN837WyhqBRlnVSDeJxiqXKl9+x8THJl1YiwcGU3bWIuIgvT0pcy1QPsjFHYYNbtT23WA9o3jk+SunhwMeYA/C4SNVB++ypHS2Xg7sZI3MIKss6iXgGxJd1hMBdiwYHSKHYJXdsfCwJkSoP4s8DzAf58v4+KZSOxwVvwLnfkTEGK6Z6O49uXh4e5HAOdjIZ08UOpkc7Wo6PPbefL/cxNsA7tGGUcFxw70nanp1PU9OfsPZzVZGq5HjvciRSZXDud2jwFimUjpfCxtJYbFqmDsQjimWQLw/FtW6WfOltlN2RKLfRFN3OyYG5MlAuIzINY6+mI/uHyIwi8OJaPhqcOhkUqQLVtpZPQVMvGbMSYfdB3juJZR2NlnVsBtU7KbsjJV96mxT6rx8PvHeqQDwG5i42ESLSU/o2T05sp6xnA/+K5ssbwbz5kNCMIvsDndGynxfX8tGA4D3YtFxDoJ25Q7Q992sy9jqQ1zJQNWdIivcWMtai+hAuOJuJT3VIT+nb8Q3R8Wy3OO7L96hbHvLld965VQrFCyA4CKdfBcqJm1GErtyKNXOw5k/a3nKhtu25q18W8tEQAB7nvVv3mart2a+i/BEjbx90lCdZR3ko4/QKApkh3X0XyNqHnopviI73d5QaDnYIX54vfgYxnQTuV5gKX57YfHlkRqE7krFnYCb2aFvuhKoZxRI/X+5j9MG7ynu/Ycou2pFbhG3qwZqjUVUCFyS0rBOJVEUGMs79BOvaJV88SXqLGysVbBrAO3UgHmXltfPl+Q29Uii9G+c+gupfYmYUCcyXV/hyFwBZMvIlNuX+qB3N7444SM+X+xgN6sTE+WNtzx7DQKaANcsQdok56yTBe5cHt7P1VgL3EcmXPig3999S5b2jCjZN7yyV2V11vrxyYAulNZQ3txO4M0HvT3a+HBvy5UGAlQ7E/kLbs/+tbVP/w/PlPkYQvCVu7qsduXdrR/ZGrPkKMK3OnGG0Hy5a1slkgPsJ9DTKpXYplNbUXTouje8u1SV6jXlz7/3PSL50EbY8g8BdijCQLF8ulnLFvNn8J0bXaUfLF7Wt+VWeL/cxrOAdd5TvaH6ttud+iPALjJkV0XzJmTNUeW/ZTBBcgB2YIYXipVWRqlFylPcg3uhgHufLb7rnH5IvnYZqG0Hws0Hz5kRGEmPmzToRY09CzG3akTtFO/eeVH1u/x59vBCMjDctZ+2zp3Zkz0dtL1Y+hKtYEyYoUmXFYMQQuB+gMkPypbPlpnv+kUbe+0WBeFpAYoh5c6HvNin0HYaTD6LaU93+CvnyhMybXYDIK7FyKdp0k3ZMPUJAPV/u43lm34MiVdOm7aAduZMpZ27BmrNAJyXOe1cd5fVGAt4mhdIR0rPhL1XwTiHv/YJAvEYLmPQ41gwxoyhs+An5YifOfQ54IOLLJUG+PGx+ihyI4Xvakf2ldrR0xKUHPJj7+DffdCRSlf0wLw9uxspliLwydKxK0JxBJOS9VTfg9EQKpUOlp/i76rfowXv7QbxGC7hz75drW/OBaXOsqeHLwUm+dCXl8sEhX15j3uxG/dEq5s3hstC7QP6g7dlLtXPvveJg7o+3jyEJWajvvb+25/4Xa9Zg5CAGgopIVVKO8kqTtag+RjlYQVlaJV/8Us33l3Lee7tBvGY2dDoTtL3lKFxTN8b+STtzV2pH7tVpa6rFTR2kd+P9ki+dhpMZBO5/MCIxvjwJ82YbmTc3Yc0paNNt2pE9Q1v32LFaTXjz5nQDeG1Ctpd25q4EerDyvpijfHIiVTaiKZ27jqDcJoXSIuktPj7eRKpGHMSrq+mDs6EfZnKuB2u/gcirUQUj/wX0aHtuic7ab6c0OdbEKJYQzHs2/EUKpcNR3ovTfMSXJ2veXHYByK5YcyF2Urd2tBxRJ9XrwTxN4B1d3qEt2rSXakf2DLTpVoz8F8qExB3lB0Wq1iLuTdJdOlp679ngm5YvEMSrq+nhbOjvMGZNTAvYAcJAUEb1ZWRkKcHWP2lb86er4JaSjcKh5s3FX1AozsLpiaDFZM2bY3y54fUY8z3tyP6ftrUcWqXCPF+eBuqkKlKlINqZ/QTierDmQpBXRMtkmvyyDndT1k9IofQm6e5bm+ZlnRcN4jp7dkZnZNu0I/tjjPwCMW/B1WgBh+AczolWHGumkcl8TTuyf9TO7NvStlE4lC8vfommYAZB0AU8nax5MxanjrI6jHkHxlyvHdnrtKO5xfPl4xq8ax3l27NvpDO3FjHfQtg3MiXWhEyJK846GdCHCIJz2PT0wdJT/E71udOyrKPD/9uLdmbbUboxRgicQ7frlnYoYI0BBaffh2CZFDbeCaCzychayqn5gGJ/r7Zl98XIEuDjiBAZwlarnlH/eASLNeD0Xzi9kK3uCrmt/18Q8aW+bB3z4M2ccFwQQDunTkPdQpCjMGIi2kQSOn8hKIe0yVbgOnTrcincd2/azp9Onz6B/7gzoC93FE3ytSgZfnHOXgIgbzQ4dmDQsMBsZ5kVcmlBdaPwCMj0akf2fH39lF2qgJaW5mdlvnw2Gekp3S354idQPRTV30eu2gmbN7sA2JmMWcEOpldntBxVbWB7vnzsAkO8aXlA887ake1CtYA1n0LVJLisUytSpfpTnBwi+dJnpXDfvePVnOFZK6TZZOTOO7fKGgKEnYc/E+/IvQH09y8qza9kfBkDgSuCXEi+eLUQ6pNUKIiUZEY1f6+2T/0kokuxkqXsKvOwNpFHUxxWLCLg9A8EukzWlX5bvXDXhL0RD49j4IwtgYr+Dx0tn0FlPta04BScS/aMGbFYgbIWQFZLYcOP03jG4pWGtjW/CjHzgKOByfFc+sVm4hUQ/8Mw/Kyhu4Y1mQgkunFuqfT0/V9aX2Dl79XWPV5BZuJJKKdjzU4ELjzskkilElJm4UYcKN9iYGuX3HLveg/mY4A6mY2tVrod2bcDXRgzMwRvDapSDaP/cLFETh8AvZDyy78gvb0DaU7ktHWPHbETjwFZiJXdcW74vqwRAPGhIKEKjh/hWCrrin+GkD9m7fi0Sfr3t3F2X4R5iHwaIyTMV4YfvDWC08dBL+WZ4DK5Y+Nj9c/to8HAu635QIxdgMiHASJt7+R4b0GwRgh0E+g1CKslX3owbedoSH+iPfthhCUY87oRuWRHEMSHvlzntgDXsLV8rtxyzz9S+XLjH2Fn7hBUV2HMoahCoOWEXMFDeseYsPkZBBvArSDf/00h5MtZE8oueChtgCTgwGm7sUMwH5UTsDKRsnPRx5xET6O+ovsRuOVS6LstbRXdEPCekW0jw1LEvCf6vkemQhpxEN9WmVXWBxFWU950rfTe/0wqy6w5gw0d7ch9GvQsjJmePJepLgRzgcB14zS1VFgDleQqoDp9+gQmP3MyyKlk7F6Ug8HvKqmzYo3FCATuRpwuTzNtOph5T9sbCRahHIM1mZiQ2MhcsqMG4tsGiT+DLpB8309T+eKXYOiKPtDWPXbETDwN4XQy5uVh8zOxDzTMrqyx1dFR65bKzf1/SyMV1hgXfcv7UbMCK6+PLvpyQmvydQmZ2wCsplC6Lo1VWw14z9pvJ4KtJwOnY8zLCUbpGx5lEI+Dedj8BHD6i5AvL/WkESRqDsKMKTmsPQfk2EhDufIxJMVzhnsAgXsSkS+zxayWW9c/lDYqbFRL8pqmZUsHmGWIvANGsCTffvCO+ifuSYQr2eTOTeO+QfySVRDacx9F3FKM3TdWTY/Oe0oIxLcFEmWQa8GsksL6e1N4KGo/3hnZNizLEPOu6ONNli8XqYyO3gO6gid3vE7uvHOr58tH6DI/qKWZCZwZ8t4m01C8N/pdxCyW7g3rK0lXWpb6hl6yU9+EuiVY86YR5b0bFsTryzNrwLmHgHOZOOkaWXvnU/VlZfrK6NzhqK4gY15L0FB8+TpUlkqh+PM0UmHDDd7VMdTOvSehE05G9XQy5pUJ02p148LuelRWSKH4/9L2zoc0LVunTaUpWIg2wIQZBBiZnSyIVw9MzYLA31CWS0/xO7EDoymbMQ358tm7TWbTTieCntEYH3a0LBTmaKmdRhj2C7u95ShE5sYa3C9+JfvFVF+VC7vs/oqyUnpK34ZqL4dU8t5vmLILWzNnAyeQkZ0pJ7zrAaGcQcCbGwHEazO+UF8YAv0NlM+Vwsb/l0aQqDlArbkpZNzZqHwWazKRxk0yJXacCnO6CfRqjKyWm4v/TBsV9qKzurbcWzEsQeSNDcJ7V5qWD6FyEU2PXyk3PfJk/XOn6ZLV2WR4puVojFmAlebkq+LY1nUQ/IIm81+NBOKDt0zN/Kl+DReskHUbi5Cu5ufQ+fIpB+PsCoy8OyymGuCjD8W1HgC9ABn4knTfuym+Fu6hexvvsbX5NVhzDkY+jSS+9BXL6lwZkW9Qpkt6ixvTdilvY6nqXYhZhTUHJTwZVEtplvUOkMUVOYNGBPE4SFQ64k+gXMaE4BL5Y/o2CrfBl78H1eVYc/Cod8Sfmwq7HWWp9BT/x1Msz1aS29MQzsCYHROWX4jRYwLqfg1mvuQ39KYyWaqpkJoPRMxcjBwRS5aS3KwelDNQXYkZ+Eo1WQJtXBCP/xEmyvgCV0K0i336vlVR4EshX07F65RNuZNAzyRj9mowvvynGM6X7uKNaQXzISX5ppbPIHIW1kxtgKZlmNUZAeduwem50tP3gzS+q1ract9XYLfOBTkJa3ZoGNoycFsQvoRz50lP/wP1z934IF6f8YUH70agS/Kl36T+4B20z55MaDoT9CSMaYqyO03s4FVKc6cO5SqC8grp3Xh/Wqqnofreze9CzeLGEqmyEAT3o3I+QfEK6WUgMnORVA4QtLY2YR89CZFTsWZK8huxsYRI9ccQrJD8xt5nw7qxAuKVGNwoVAWt2yhM9cpvywEoC7EmEkXScgQWyZpRqD6I42I2P32F3P7g0+N1dHQbCoP7A10gH2wAsbO6vQyuIFM+X25KpY7R0I1YpAtjDmwY3jtMVG9FZeH2jPKONRCPH8pIOc09hci1ad0oHMrntbwTkdVkzEFRJz3BNe3YuFrg7kRZKoXSmtihHBdUWM1l2pHdHZgLcgJGJiZaGVWTngrNpf+NuuXS038rpH5ZpxXV1RjeHiU9DSLj6+4FXc4jma/L+vVbtkdfamyC+Lb++LK7D5GVPDnxK3LnnVtTN9Ma58unT5/A5M0nAqeSkeaG4ctDu7pfonqu9PT9fqxXT/GLSKfvNpmdJn8yqob2GDX9jGfP6gKMyURZ3TqcLvQiVdFGbJOchnBiRD8myXvHhzeewnElbDlfev7xyPNJRsc2iG/7wPbiWCo9pZ+l/sC27vsK7MCZIKdgGyQrHBwdvS7ky+/ZMNaqp23oRs9BWIq10wlc8rx3zSAAq+gufU0gSJ1qaFxobtq0HdjVnQp6BtbuljDvvQ05g4HF0n1vVc7g+UwGjQcQH5rxhT/TjxBZXR2ZStuqcI0eS+51WJYgfBgkaROBEOAyRgj0UXCXUjZfkN7i440O5tsA7zcCc7EjrBu9fQ8XpxgfA7maCeXzUzuSG7ustCN7JMjZmBolyEwyGBVbaHS6FsNyubn4uxeDUSMB4knOvm7DYVuuZevAKm9GAdrR/CYwqzGmMwSdBuDLQ03q9ShL6Sl9V8A1Il9eU+EckptCmSXAMQ2gnxHSAdYYUFC+gx1YLDeNvQpn2C/ZztwhOF0RE6lKUEwuPhnkSqCLJV/6Vj0t90L+q4cfxEWIDnaS6mtDzSjQ83jUXhk1C4QlSFo2Cmv4chDasp/ByDysyYVlpSZvrFsdHZW5ki/+sVGqpxrwnr7bZCZP/jwiZ2Bk14ZY1qn+dvp7kCWS33DDCynJx/wZr2ku514N2gXyUYxIolhUK/L3BMgFPLn1Srnz3keHS85gOEHchTrYehnKFCaY/8QlnO0N4cv1NtQtkULfT9JGsQw56K+fsgsvMWegcirGvKSBzJsV9Bs4VklP6e6k3lOdo7zQkTsC1SVk7GtC3jtRVcl4D2g90EW+9G0BTR3vHVeCfMOUXRiwp6CcgTWTE20u1+5MKOi3CDJLZd3fi8NdIQ0fiKuWabIZBvQT0lP8jrblPo7RM7H2oMSbPfUTEs79isAsl3Ubbko9mM9sfg3Ongl8pkHmmU2kx/I4uCvYrBeMpvnAUP2MKW9F7CKsmd1YjvLuYZSLwV4hhfVPpJA6qeW9O7PH4phLpiE2YiPjGwF1/w+nXSM5jTUCIB4cT0/fVwScTpu2Ay93/wU6rwGkVAf5w8Hb8VoCs0LWbbgnlfxhHKzap7wFscsw5pCG4ctDOdQ+0MU0931H1hCM1OjoUD516jTULUPkY1Ez2EW/RMKTPW4L8DXKsjq1IlX1exHGLMDIGxM+tzEdIQNB8GdUVkmh+N0YeI9In2f4QbzsjpVC6Ss6u3mirO3fHH4Qe++Fy8xH5LjEV8OHZjQPAV/iyacukDsfeiqVGU18g60teyyGM7DmNYMVVAPw5YH2gFsohb5fD3dGM0Skaoudi5HPYuRlCZ/VugpSfw0y309cgXY0vxY1KzByeAMoQdaKVKEXsumZq6obyiOs6DmCf3BLWUF0Nhnpvvc+KfR9DtU2nPsJRgRrDEpAEtxdpRIYCMogu2HNYnbaqVfbch9XItGiOVgloUtmVH8KXOzvFekpfZmJT7VR1qUgj5OxNgKTYNQfTbCoOsouwEgbxvyftme/pzNyr5M1YdOu8twv9AJTwqxO52C1I3c0A5lbaDJng75sxN3K/11JLiJkjEX1zzj3YckX3yn5Db3Vd7UmJSqDc7ACKmspa1vzq7Q9eylqe7HmcJxqBOB21AE85L0dGWOBMoG7GjvQKvnSRXL7g09Hz+1GeoDCjDBAhD88iM7BSqHvNsmXPojjfTiXJ2MsRgxKmSQOo0gGVWUgKCPsS0a+TUf2Ju2Y+qboA3E6m4wmw+OP7k8RA0VZ+9BTUih2AW2ou24QTKJDO7phECyBczh1WHMERm/Wjuwl2pHdPf7czyerq35g4LQj9x42Zrsx8lWEZgaCcpR9J9EQCy+OjLUoD+LcmZQ3d0i+9CMFqVw6Kcm+jS6JLtnW1iZtz56EsbdgzSmgk2KXrB31R1MCrJjI1PyXGNMh+dIJctM9/6hgxmhV8yNIp8zOyNq15SGlO7FRt/bc8Yg2gjznIO9YEdeCrxK482Vd312p5B3jpevMqbMI3DKseWvjzNtWpRYuYErx8sh9/DknM4b+Xc0HEZiFGHM4kCzvHV/WcW4LylUIqyVfejCV5y/Oe8/IHY5hLhlpC/WAEmsu108G3QKslHzpR0nSW6N6WKuZT5Q1SaF4NXbCQQwEq4BNUVmSROlem/GpKlaOwUpB27PLtTX3suqBmpPYJTOa76lSQRkFKzdvuEkKpbfhyh/DcRcZk0FEUC0n8HDhGRkIyojshZFL2Zj9g3Y0v7t6vrZRPdWU5Afts6d25C7GmXxYkjsXAXgSqo9RVmcMIoJzPyZwM6VQOlXypQfj1EkawFtnkxFQWUOgM7Jt2p77KRn5EYY2BlyAqiaSQFQqpCabQfU+XHAK5VKlQjJJVkiJcL7VEng2Gbnprielp28BBDNw7huYREt3qjf8QBAALyVjF5LRXu3IfbrKn0YvLQVg7oQYX57v/x7BpoMpu4WoPkpTJhM74KP7aBUqrOwCxMzEZH6h7bkfakd2f1lLucqXL8FU+xytrU3akT2dCZl1WDkNpSkqyU0yvDdx3vsWnHuX5Ev/Kev6b0k17z1j6j7akfsyhj9i5TAC5wjUJQTeDqLJIGErgbsQdTMk3/cF6WUgTssl9p2OJp2yXSVuW8uhGFmMqZbuCc+X16nBwXxvRgE6Y0oOmzkd1ROwxjaOXrZuAr7E1mfOlVsfeKj6/6Wz5SNg5iNyQMK60bVbfIG7D9EuJuo3ZW3/5jQ6yleXdabvNpnJOx2L6AKMeUXCSpCD9CoKqt8FzpV86fZGo7cSB/EYmNeLtR8Bpgsj+yX+0Q3VZf4BwsrqC02zeXN7cyeY1TF9ikZZhvkH6Hk47UHM8kE+PzE/0nrp0aeBKylvPl9673+40YBhFM5R3Whry0cwZjlW9k1YB79+y7sH0eXSXfrfRk3cGgbEt3kz77/7S5g06TTUnERGdk+8+VnbfNqKyOUEm1c9X/3fcfkRdmY/gTIXY14XM29Odi1diBbRDYnqRm9LejSUS7479UlAKMo2D2PekXwSoEG4rGPDJTPlPHqK10SDGA0rZ9BwvG7NqNvtDz4t+b4VZAYOpqxfAgmi5qerahOM6sNFh6vsApQJGDkdmdirbdnTdTaZ1PHl0Qalgkh36dtMdG0EwdkoD9JkbTX7HO1Hq/DlgYbgmSjvrQFGTATgv4fgzZIvfVx6SndXee+Iw08FHVfhvVv3maod2a+DvR5j3kHZBbjEeO8A0PDMyuOUg+VsNe3SU7yqMoiRNO89pkA8DubVed6b7vmHFIonQvCGaFnIxJaFEpgvr05IBBiayZiL2JTNa0fuPfEJnFTMl3dFVdMcrKzt3yyFvgvAzCDQK4AkL12pXrpJzXsLQpO1qP6NwH2GfPFNku+/Ibr4TJqaltVvujX3Mu3IrcRmerDmk4PN6QSWdcJzGWCNxYgQ6Ddx2i6F0mK5df1D8edu5N+3oTPG6qhRdVmov1vypQ+i7gM4l6fJ2HDULREwF0QsrrJRaA5G+Ll2ZH+sM5sPik/gpGVZaPA9rb9X8sWTENOBcz8OL11JbkN39LM6wokTeZwBtxC1HVIofbWajXY1blY33JRbhWIMN2KzR2K1FyvzEdklmgBLaFlHy7EK6bdo8GbJFz8pPaW7R3tZZ1yD+BAwr2Qw+b6fEpTeSBCcAjwQZXuS+Hy5U8WYD+BMQTuyX9D2aXvHx91SQLHUXrr5Db2SL/0ngR6G4/bBDV1NZkN3ZGFhcAVbCAj0S1A+SHpKK6Ww/on4/HMKwLsy7x1Sbp3Zt7ExuxZjvomRqeFGrGoiPRPVMiLRvDd34/RoKRTfLvn+GypSG2ON3hpT3G0lg9E5WOllQPJ9X2ATB+DchQhPJbosVMuXZ7Dm80jQo+0tZ+msXXdKGV+u8b9Xeko/46mJbTg9FUdfNF+e1KU7Alkd5XAF2xic+zVlZkmheKIUNpaqWV0KXOVjcgYVnZMDtSP7HZDfIOaQQd5bwvc/+hWSRss6jxIEi3lyYqvki9dVnzuS2hhrv/uYBJSabO/24j8lXzqLsj2QwH0vpvORpLhWyJcjryJjz6f80rzOyB1ex5enZVkovHTvvHOr5IuXYba2EgQXIDwdu3TdmMSsikhVk8mg3IELPij50jult1QYq1ndC/4xKuC9hkAPnLabtrdciNibMeZjOK1sxCbFe0cVkghl/TIEMyTft1zuvPOp+HOP1d/ejGGAqC3de9dvkELpYwT6dgK9IVa6J8eXV8S1jLyWDD/SjuzvtK15ZlVcKy3Nz/h76r73UcmXziaQTtT9NFS0lOSa1C88q5NoAucBAncmsrVDCn0/qVvBTgfvXdlknj59gra3nMkOwZ/IZM4AnUg5SHYjtjIE4fTnGDlECsXjaiqkcUBvjflssKZ0X4KRdaXfSqH4Zsr6aZS7acpEfLkGiTyeSAanoQKfMW/B2D9qe/YanTEl90IU+MbFpTubjKwr/lm6Sx9A9R2orqtmSo3Ml8dXsKFM2V2G2BmSL10k3fduavRRtGEH7wrvDU47s4ex0+YC1l4AsjcD5fA9jj7vrVXeO5QzuBP0cMkX3yc3b7hpPFZIZhyBhJOuwexWeopfp0w7gVuM8ESki01izU8wIV+uBmuOw9pbtCO7QA9o3jmeqaYCzAfFtYzkS79hYmkmgTsJ9B4yNpPgpfvcWZ01JhpF+xHWtUuhdKp0//2+8ZTVbQd4DzYt11LWzikHa0f2x2B+inBAdMY1Qd67IlL1TwI9DRmYId3F/4nL2o63S3bc8bI1y0K9xcclX1xOkDkI565GorllTWxZKATpsPn5UqxZwUTJa1vLp6qZahr58rWUpVC6gnLTwTh3PsjmmBmFSxSz4lmdc39Cea8Uih+Wm2MiValc1slN0Y7sJai9OZzISlikSqvmDAMEwRUE0iaF4qU1FVLX+KyQxi1Y1Jbufy9KvnQCTjpx+jMypjK3XCbp5qeYfcnY67Qze712Zt+WRr68ChC9dz8s+dI5GNoJ9NuJOkDVS4+W3XE0l9olX/xF0tKjow7ecSXIadN20Pbc2VhdhzWnokxIXAnSiol8c3+CyizJ950kvcWNaZHxHdcZX03pPgcrPcV1ki8ehit/DOXWSBc7qbnl2mUhMW9C5Tfamf2ezmjZbzjsx8bkpTsHK93FO6RQPBIN3oy6m2MOUCPf/KzlvZ8mcBegbob0lL5cqZRSxXsPLieptrccxa7BOqych8huob1hIg5IgxVSk7GorgN3mOSLH5Se4rq0yfiO+7K9WrrH55bz/d+jvEs7zp0Beg9NNsm55XBZqMolmiOwplfbs8u1bc9dU9r8DPnLfP8N5EuHUHbHobo+1vwciffkanlv9z2cdEq+dLb09D8wVlawhwm8a5d12qbO1I7sbzH2G4i8jrIrJ8p7C0KmUiHpCZRLs+Tm0s/SViGlCsRrwLy6LNQ7IPnSxZQ3H0xZLwa2JCyuFXKJIZi/hIxZiOywTjtajtdWmuIbq6l4T11V4SGVntKXUduKc10oj0Z8uRumS7dizjAoUuXkLVIofUzWFf+cpqYlhIqK1Qq2I/dq7ch9BaM3YsxbY+YMSYB33JT4CZy7kK32ICkUr24UcwYP4kmU7rPJSO/9D0uheAbqOgnc9zDGJMbDDoJ5xJdLC8ZeTSZ3o87IHhbfWE0dX15Y/4TkS0sJBtpx+p1o/vfFOUDFHeXRIkHwSSkUZ0thw/VViYcUNS0rTVo9oHln7ch2odqLkWNQlUikKkHe20QbsfoDkBmSL51VEalK0yXrQby+dA/58hDMe/pvlULpYzh9H+puGVUedluPFy4LRXy5tJGRn2p79kfaPmV6qsW1eu/ZIPniJ8C9Ced+T8aY6D1tf1+jksGHyzqPU3YLsRMOlELfN6uXRgpFqgDRjpbj2MH0YO1ihJ2ipiWJOcoPTgbdhOp7JF88QvLFv6eN9/Ygvn1gHvKwheLPKZc6cHwWR18kaJTU3HJcXMthzeFIpkc7sudrR3b3lIprhRlyd99aKZRm49xROP37dpo3hxRMyK0rgX6FwHVIT2ml3HTXk6njvSsUxBoCbWs5lI7sHzD2GkSmMVAO0MSalvEK6R4CdyyF0qGSL/4ybTK+HsSfH0gM8rC9DEh+wzUEHEjgVoA8HptbTkpcq7IstCPGnIXKbdqePUmnTdshdXx5jFKSfOlbZJ6I+HJ9OBLXqn9PgyvYGWMJ9LcIb5R88VhZ13dXuh3lW/bTjpY1GLMWMbOiM+YSsUarjHVmogop0KXIwIFSKH2lYtidogpJokr7337THsSfs3QvPi6F0iKgDee+iWkQca2Qn9ydjPkiLw9u1vbmD6aRL68udd30yJOSLy1lQGcQBFcjwuBSV3wFmztw+iEpFN8u3cUbqyvYaXSUb52yR2jOYP6EsR8e9B9N0JwhrHodgX4HLR8khWKXdN/7aNp47/h7EnD/LkFrOI/NRrsNmRN+5ADalnsrhrkYeVvifoCVbUYrNvzn3U9xbrUU+rsrB6HRDF1H9D3FfRvbmmdizFKMeUf40+iDOHchpnyFdN+7qf69puD3qfpD6vTpE5i86TiEhVjzqoR9axVVhzUWEVB3A+VggazbeFPazvC239MzR+Dkb7Ku1APP7sXqM/HnLt0HedhwWeh3ki++HRd8FOWuwbnlpJqfWAJ1OOcQ837E/F7bsldp+7S9UzdfXrPU1X+z5EvvRN2RlPUiVA+QQt+FsRVsTR3vDU47sh9ip003kbGXg7yKARee2ySblk3W4vRvqH5CuktvlnUbb0pdhTTkPbW8n8nP9GDtNzDcpB3Zq/SgluZqD6xuoMFn4s+zzKlkBjp7t8k8M/l4DPMw5hUEiWY0g/+2NeD0EeAyypsukt77n1EQliDjVTviud7Tc/3vxnVlEq8gZ+Reh2U1Rt43SJtIQo7yNef0X8B5/OvxK+SuR56MgEnSMus9pIKckW3DsgBjPhCr9MPfKtDHEL2WcnCp9G68v0q7rCHwIP5COavKB9K59164prMwnIiYJgLnUEhgnnaQYjFisQJl92dUl0tP3w9SWZ5WqpCU/c3Vs3nQPnsywc5DzWewMikaF5REzmZlgS5jDM5tBfkWW90yuaWvv/65U/eeWnNTyHA2qidgjaXsXFRimtpv2kA5uA/hEsryZektPj4ymfhAcLz09F07nkF8m9lOR0sHmIUI7wOpNImS58tFiKYxuiRf/GMawTxt1Yfuv/tLmPiS4xCdjzG7JVwl1vZunPslKoulp7gulYnFEgxdqIBq596TcBM+D5xOxuxOOXiu9xSOXhqTwQio9uF0OZPcd0bgRpZnAJh037jmYoeaAvflJV88jCA4HKeFOp2PZPjyiriWlbeBrtX27Fd1Zktz2sS1xnlJbmL+kKrt2TlM3HEdGbkEZLco+06Y9zYW1V7UfVgKpffERKrSxHuHeygVMbHO7CfQpkhMjN0jE43nWqoKDWZUlbIrAy1Y+QrPcNBwZuIBGWsp6yXSUzw9dstqWjbfInB3OgdLX+54jM7Hmr0TngCo5SED9yhwBdgLpbD+iTSWsuOyEmxrORQj8zDmXYlPTtXw3u4RlJVMKn2x0nyufCepeU9x3nvm1FkEbhXWzH6R78khgPKm4QPxyjMbEZzegLr50tN/Mzz7aMy457pm5l5JwGkIn8fISwhcWFomBuYaYIzFCDhXRHUpzX3fqUispuXCHVdnrHXaVGywAJGjMUK0QyCQEO8tCNYIzm1B5XLM1kuk+9770pgs6GwyVfBubX4NGbsI+HhIcToXwfYLf08CIG8cbhAPX6U1glNQvRblQukp3Z22l1jzAme07Icxi5FhfIEvqsyNzeYG2oPR+dJd+m2sevJ8ecODd+5lZPR0kM9jZRfKiSYIEe9tLKqA/hjVpVLouy2NZ6qmP1F9T5yBMcObyI0giFfKKYM1QuCeBLkIzCVSWP9EmhYttr0spMsQMwsSXxZyKDr44fFtAs6VdcU/ezBvuHNkmBM564DQnvsooiswJodTcK4caXsnkRAMNtuc60Z1iRT6fp1K8I5TqiB0tByLytlkzLQRoVRHFMTrubGMgUDvxrlV0tP3dah2aUkbXw6g7S1HYcw8RF6Lc+A0qY9wsATOGKHsngK5nE3l8+WOjY+lsQRuuCSgZhM191aEpVh5Q8Pw3hkLQXAPyGryxasjAEsf7x1P1tpb3oHIYow5JJrLL4+IFs2ogHj8trYmE47xuxsRllbL95Tx5YNl1h47YieeAswjY3ZKuByuaGuHF25Z+0GXM6n09TQ2oxqQOnk9lrMxHBkbX02K945X2U8DF7NZLpfbi/9MoZxB7SXbmXs9qstAPjgq/YlRBPGh5TsKTr+PuC7J9/81bRlfzQfakXs16Bkgx2NEKDcAX15pfgbuT4gslHzxl2m7cBvibLTtuStmh3NAPoeRHRNeJAu/39D9CFT/G+sWyM39f0tjxVb7nppfhchZiDkRIxNHbYAhARAfepM79wyqlyDyRcmXHkzTYRhyi7c3dyJ2PkYOawBxrejCjRY0VH9IEKySdf23eDAfsfMQ51Mt7bljEV2ANfuEfGpUKSVzsddW0uoWSaH/+jSeBZ2DZToqXTjt3HsS2nQ0KgvJyB6jPkqcGIgP4dQMlN19iHZJvu/a+gOdio93zqDMprZP/QDiujDmgFjTavS1ncOHG1yVDlwZ4XLKm1dK7/0PpzH7GpXLvKPl/agswZqDk3//GlTXvQP3NxwXSU/py2n7RqvvqVaP5nAsi7FyAIGCSyDpqgFx1Rui8l1G/beJd7cDzeN0pawr/W/11kuLaFF8Hbe1tQnz2Gcwughj9gzXphPLxLZx4XIJT076otx559a0iRaNGHh3TjkYZ5dgzPuBRuC9o4EE9y/gQiY+dZmsfeipVPLeNfIauTcAcxHeG76nBCvmKoi3tRxKk11L4KLbRJKdM0VB9ceILJbu4h1pK9lquLYDp+3GhGAhcBwZM4ly0uJaNRfuHYhbKPm+n8YuXL8s9HzfcUd2d5R5CCdiTFOd+FESNFpFpEpRuYpg4CLpvWdDGiuvmvc0Y+o+2GApyKcxxiT8nupAvDX3Mqw7C5HPY8xLI1JeE1M6q2x8BW4LwheRgUvTtvG1jZGlAzAyD+SIhhLXQkDdr0EXS74vn7YL90VVW7ObJ7JJTgY5mYzZK3lzBgJsNOaqupayLJDe4o1pfKc1U2Tt016KuBNBz8SaXROX0NgWiFcffGbza3B2PnBU4luFteX7PxFZxSPmKlm/fkvK+PJ6fYx3YmQJ1sxMjIervXDBGkPgHMhVSHCB5Pv70pi1/Zv3WNv36MgdDizFyOsbg/euTiP9NepNfT+N1dWQ99SZ/QSOLjJmaux7axxhvziI16yIdzS/CTWrsGbmiA6qb1/5Ho672WjcTd1yKfT/OG0HrGZjbw6We7JHo7III1PCZSGSXvowZIwQuIdBL0MzX6hu56bIjOLfV1TNnYhZgchbAQi0HIFCgss6BgL3MMrFmIFLq/Z1aTIRGTIpNvXNiFuIMW8JL9lEJ8WeRyY+NFv4KOgKrJma/IhTpdSL9IgDlkpvqZC2Uq+Go3vDlF3YYk/BcFpEgyWvlDg4yXAX6lZKoe+baczohryrzqnTcHo2wmcQMThX+R2SoiwrFVSA6JdQd7EUNpbSVkENuWRDNmJRVeMoSTGxFwLi2+SDWnMvw+qZwKlYMzlRFb7aw1dG+BK4i9NWvg85eJ1Tp+GCpSAfrbqCJLssNDhTHLi1GFkg3RG3moJpo6HmDJPOADkTa3ZqKHMG1Z/h6KqaM6SQ965JiLZmzgb9XLQ97aK+YGN7IjwbiG/zj5zRsh/WnAkcG62TNgpf/ijIuQSbroi8JA1LIA1l4NC51amzMLoUI2+PxLWSK9UrUw7WGFRB9WsE7nzpHb/bfUP1cbLHIJyBNdMbwFE+nCoKaclekEXVLdw08t7Re9LZZNiU/SwiZ2GlOeEJveEH8W1zRdk3IrIcI7MT3iqs5cvLegfqVtR5SWoql4XaWj6CMcsxsm8DLAvVbedyEROCS+SPGx8bL/PG2zRnELOysUSqDATuXuDS2Hy/F6kSswIjbdF3kpx59EiC+LMCRUf2SJQFWPOa5KUw43y5/gZhWdVLMk18eTzDmLXfTpS3fBaRuQ0xFhUX1wpcEWWVFEpf2VYGO2ZL8rbsvhhWgMxpEHOGsBJybgvIlRjOlZuL/xyvldB2J6KdUw9GdVndsk7j8t7DBeLbPLQVFT7hdKx5RaIqfDVO2upQ/TpWu+Tm9Dlp17qdtzQzQU4FPocxTQkLKNXz5TeiOl96+n4fq57GBF9ey3vnXskkdwrIKcMu+v/CkpqI9wacfg9150lP/61j7Tce9m+hdcoeZDJngZ7UAN9CciC+zR+no7kFzNwaFT4S+nFqvST/BZxPIFdKb/HxNI1NDaXBWg5AzMqGWBUeYkbhfojRRVU1vAaunoaI/rc1fxZjFmHNng3Ae8fVJ/Ogi6vmDGlrWsa8CvRd03bg0fLJIKeQsXv9G0f50Tj7w4eNLwbEt8kxdeYOwbEEK29vCC7QSGW+vBRZRX2j/gWngmKpocFa3g+yBNMI4ko1utSbELmULc9cIrc+8FCjVU9Dm8jZw7AyDyMzE+dTK1RVaEp8D05WsWPxy7KWcuqXdTpyh4N2Yc3rwmWdhHderKlUSMln4s/5w7W3fADMMjKyf+yHS4ovdxipGAOvBVlY5cvTJK5VL3Pakf0syDlYMyXMTBpEXCvQflQv5KlJ1zRC820bicrrUV2OyAdic8SNsGRV0zRutEtw1CvPztwh4Xsybw4ntRLeiBUJHZAGyusR/oaY96GqL/p5hgvE60qYQV2IzfZU0DMivjzpEqYiZq+g36NsF0nv+g1pKzVrZ2On7UbZnYLTk2POQpogXz44beRcL06XS6HvJ0lduDW/1ax99qScWYRwNMbskKi+0BA6Sr+BM+dLz4a/pC05GfKe2qdkkcwC4GiMmISp3UHbw8A9jchVmKYugs3vxWa+y0Dw4pPb4Qbxbf6oM1uacXIGcELizYQ4X+7cE6hcxJbgC3Jb/79Sl7nUAFTLfpTlHESOjhqOSXbra8tO5ec4lo7mQkoNnzp9+mR22nwM6AKMeWXDLOuIgNM/oCyVQvH/pRW8q83lN0zZhYHMZ1E9G2t2Sfg91TogiX6fsqyoGpB3tByPtVc3NIhvs7xpy83AsBQj722o2dmy24BhNTtEXpLpmi+vdxZ6M2JWIaYzWhZqDHEt57aiejkMXCKF++4dqQt3m/P2Il1kzGsiWjBB3jve49G7UZZSKH5fwKV5WScExdzRoIuwJhsu6zRIc9m5G1FdVm0uv2vaDvxq/Vbas8eQMV8eThAfkWxLQCsGuzoHKz3FdZIvvo+A/8RxBxljERFUy4x25hC+YGUgCBCZipgvszm7Vtua3yVrCCofho6lof/heEeF/uvJlw4BdyTo3xN+RwYwlF2AMgFrT4cJf9L27Gna3DxR1hAoGB2GakFBdE5I4sgaAm1v7tSO7C/J2O9j5DUMuABVTYRTVQKIsjr0EQK3EDVtUih+t3JOK2c2DUlH9T2B07bmd2lHbi1GvgqSZcCVE1uVVwJEhCZrUV2P02PIl2ZLoe/XEZYYNu01YhWkjNILMBDx5dOnT2DypuMwzEXM3gm71tSaN6v+gEAXy7q+u0arfG9IimX2bpPZvNNJDdLTGGxQh9NGt6GskELph7Gy+gVlorXSElNy2Mx8VD8dadAkSSvVluToNcjAsrTp6lcrxpqN2Oy+iC7CmCMTF6mq2UjWx8FdxGb94rYoWp09OyNr15a1PfuZ4c7EJTGgCF1rFiDy2cghOkm+fNCMIlwPv5Zg84o0eknWLkjkpmDdIkQ+iTETGkBcK8aX669Q2yWF9d0xMN8uTriGT52922Q2v+Q0MKdhzS4JzxHX8t6B+yWq547FhahhP4v7517JJE4FPQVjdkx4qar2klW9FnGrnkuMb9yA+LZv1uYDMfZM4BOJN9Zq+HLdiMhKntzhOrnzzq0pmy+v8xWc2gpuEcZ8oAF6GjE1Sw0Qvs5Wt0xu+ffbuUNF/3Mfx2kX1kxLeG6+vtr4M06X12kBpQe84yOxlcpdWIA1ezSEmJg1mUgJ8tcQrJZ8/w3/7j2NJIiPOlAKaMRphhxXT/+tki8eCfoO1HVHXKxJni9nCpar2WnTTToje5h0RVxcWvjy+DvKb+iVfOmDqB6O6p9pqvDlEWc7ug83yJejFiPH0GRu0fbcEp21307x545fSnW895u1I/v/EPk2RqaF3Ltq9FElwXtLxHv/k8CdSXlzh/T0/aDar1iTGv2fOt4795/stOlGMuZykD0YcOF5G30A10HeO5NB9S8oH5V88Z2S77+hwnsn9Z6kAV5crWvNxtxJwOlYmdIAZhS15s1lWSy9kXlzWpeFQs2coxHmY8yeDTF2N5jB/gU4V/Klb1Xf0T+RwSmp7L4YWQgc1VAiVYFuRvRaysFq6d14f+oovG0uVbESI4c1zDRbKOXxT9ALyOxwtdx015P1ld1z/teMJzplu/ivzr1fjms6G+GkSFQoab48GnfTzShfRYPl0tP/QOo+tpodgNwrcZyCchpWJjWM8JMIOPc7nC6rcslte+6K2eEc4LNY89KERf/rRKr4KRos8SJVkUiVzSwEjsbKpMSXdSAU1Qs3Pq9GzblSWP+CxlxTAeLbvJHbpv4H4hZhalzek+XLrYFAH0RYxQPBNdLfvzmiVySVfHl7ywEYWYzK4Ylnt/UNJ6dfA70VMWeQSVxioM4zVm/D6ULpKf0sleAd3/Bu3WNHMpNOBj2t4ZaqAq29ZF/gxNq44sT/zTMNcrGzyUjPhr9IofRRVN+Bag8ZYzFiEuJiQ748BKndsXIZrzI3a0f2QxKOT6aTLy/03SbdpQ/h5N04/cPgO0qgpwEGwUYcN2TM0WTsZQhTGChHfKokM0cMlTnifxDoiUwMOqWn9DNdEs67p4j3Dnn+rmg6qD37YezEXqysBnll2OtIivfWMiJhf0L1TwRujhSKH5Ce/lsr37aspdxo70ka/YVHDxlupt2TOxLVJYPbWUnz5dXy/Veo65JC//MedxsPH2XcEk/bsscinEPGTmuIcb3wACU/RxzoJuBKRC+QfOnB1FFx9RvCM6bOwuqqBnAJi02lWQjc/SjnExSvkF4GhkuELTWZ+Dae0dVspnUXv47aAykHK4EnaLKWSud4tB9NsDh1lF2AMe8C8wftyF6tM6buU8mq4hMS4zgzd9I1WIVIT+nLbHFtlIMFwGM0mWTfUXiBjPY5dyhBdes1cN8nCA6WQvFMyZce1NlklO1riI0H8I4mTsIN4dZ9pmpH7ssYtxYjsyk7h1OXiB9seMmH9JvwDC44j3K5VQrFS6WXgfikTIN/g2PoJo9zsa3NryFj5oJ8qgEmDeJeho+AXMjEJy+XtQ899Xw62OPio60R15o2lXKwApEjMCLjwk3l+VRogf4Ro13SXfpt2iq0IWchFKk6E+VEMrJzQyibVibPHD8ioKs6eTabTKViGLbfIq2ZeN3z1nKxvf1/k3zp0zg3G6e/bQi+fCAIQHbFymo2Te7RjpYjqrPJFQ2F8Z6Zx3saN63fIIXSxyjzRpz7fxgxWDEoSfDlI3+Rg9BkLMrdlN1xFIqHSnfpt6nlvcOzYLUteyxbM3/CmvkIO4ffSYK8txFDk7E4dyOOt0qh+GHpLd5RrZCGGcB9Jv4cB6XOxeNo0PmYmu275Mwo4ny56LnS3bc2bdnYUMW57IeApRjzuoTf0fBXYaHE8ZOIfoEBc0HVEjBWPaaBOqmzBRx0lNdGMWcwELgNIBeRL14dGaWMuPmIz8S3/fzxDFckX/wadsLBBLoEeIyMzdAofLmaG7Qje512NLekji8HV81E86UfMdG14XQu6MM0ZTKxLHashUNxEe+tOPdNxBws3X0Lpbf4uM4mU6keUwHglb93LWWdkXudtrd8E2P+D5E2yi4Iee/ENmKVjLUIT+OClWx2MyRf/FK13zYGeO9xmYk/J//Wus9UbGYBIkdHfHlywk01Nlr6GLhLKJsvpDJTG2IYYk5B9fNYkxlDfHmtfgZ6A2W3VNalr9Ia8k47994LbToV5SQyZmLCblHhecoYE4lUfQ1xF0i+/6/1zz06l1xKln2GpZyrMbRtmR0a2pp3Jj/GpGWMyUSC8bXmzWk2o+iccjDOLsHK+1GSfUfbU5IPWsj9FSfLpVD8btreYT1VprPJsDn3OVTPJmP3TH6pKkZnqruBsg5esgnJS3s6Zfv/Jq0aBszByrq+tZIvvQvnPozTvw4KNyUhriUZVMNlISSLtV/XjuxvtTP7tpSaUYTNz+6Nf5JC6QM43oPSk6gZxXOX5EQjrQ8Q6DyeeaZNCsXvVhvt6TFnMDUiVR0tR7A524ORSxHZk4Fy+N5GH8AHl3XC5vLfUHekdJfeLOv61lZFqhpwWefFhhmnQFHHl5d+RLB5BmU3H/QhmmzIzSXFl2uVL38rKr/Rjty3tS27b5wvT5WzEBjJF3/JxOIsnB4NbKQpk0EQVIMEEctBlfcOCPQrqGmTfPFcuf3Bp6vzz2mZ9w557/Dbmtl8kHbkfoqx30PkwIZQgmyyGdCHCXQu5U2t0l36dhou2XE98hYHRem9/xkplFYTmFYCdxWwJVyvjT7U0f7dB9fDHUY+jqFH27PLtXPvl6ey+TknpFgkX7yOcqaVILgA5cmEFrrCrM6KwRiDc78m0JmSLx4rhfX3pmlZp0IVVS/djuYWbc9dgTN5jBxG2TmCBJd1qs1ltlB2VxGYgyVfPE96738mLZeskJIYypdn2zCyECPvT94YWEMjXGPAuXtAVzCx76tpM2+uAkZVXGvKdMjMQzhy1Ba6Kr2LikhVwDJZV/zvyrOl0JwhFKmatetOuJd+HpWzMLJzw4hUhaz8T3G6QtaVehr1PXlOfLjK9/iy0LpSjxSKH8C5j6B6Z7LGwGJRKnz5Phh7NZuyf9S2lnemiS+vVE/V0r2w8U4pFI9Cg7fg3PUxw5DhX+ga5L0zqN5HOTibR0yHrCv+t4KkclmHikhVy1GUX5rH2JXAzpSDBjBnMBalBw0+IIXiB2RdqadKn6bkPaWCTvk3YG4URAqlNUx0rTh3BsKDg3y5JsWXh2BupANrfqXt2e/pjOaDUsuXz8FKof96yZfegnNHgZZospUL98WDeZz3hjKBu5QgaJNC3wWyfv2WakmeNkf50AGpUzuz12PtNzDyWgbK5Yj3ToA60ZgDEg9QdqczsThL8n0/rfZVUgbeqQXxGFC4Kl++tn+z5EsXM1A+iLJeiTBAxtoq55YEmAcaCgNZcwTWdGtH9nxt23PX1PHlFccnQPKlb7HZHUyg84BHI778hTaoQ5EqawxGDE5/iJhOyZdOk96N96dWpGoNgc6YktP2lm+CvRExb2qcZR3ZjHOXgh4ohdIlFbpxrC/reBAfrvJ9DlZ6N94vheLnCDgEdf+NNRWtjwS9JIMAZQLWnIXZ4TbtbPm8Tpu2Q7WaWJIOPRaI+PLb+v8l+eK5BHIgQfBlhK1RdqbbeeFWRtFMpBvdQ6CHSb44R/IbehtZN3pEMDIO3p17v1w7sudh7S1YeySoifoQyStBOl2DuvCSzZcejFMnqccwfNRkJLUu77n3gC7DmNaGcUMPl4X+hMpiKRR/XvkQU6THUvuOZjYfhLPLEd4LPHeDuqqfYSFwG3Gspqd4rRBeiJXsPyVnfdDbtrW1CfvoUYgswcgUnAOXqKN86G0rAoG7EXSZFPp+PZbPemKNzUqGmhoFvjhfvgQj+eIvKJdm4vREVO9rGL5c5GCM/Ezbcz/UjpaO1PHl8erp5v5bJF98H473ody6zYWuKu9tLSKPU3bnUt7UKj3Fq4SQrklLST6E925rfheZR28iY74CTAnHXhPyH63w3k0Zi9P1OD2GQulQKfT9OmlH+TFJp8TLrNRNSMSMDqSXAckXv0TQdCCBuxR4qiH48sA5rHwIlRu1M3eFdu69V8r48toLt1D8ORODmbjgZFTvr1noGuS9v0ngOqRQnCe99z9c5drTyHt3ZPfXjtwarP0lYmYwUFnWSWTeOy5S9QQuOI8JQbvki1+j0rdKyUbssNAp8blkBaEz+3GczKKJ8+TG4sYqwKdJXrOGYml+LWJWgDk8LN9dA9hKGQj0AZxewI7uSlmbLvPm+jMZuaafDHoK1kwKS3K3SAr914elbTL6GQ3z22TMApCjMWbHhIXHao2tlW/jyotl3cZi5T2NNW3vJOgUqeHI4l6JM7KHkZEFiHQgQKCPoXoFmQnny013PZl6reSO3LtBV2LMQRFfHiDSCOJad+K0S3r6fpA2wBryjtqaD8Ta6dJd/E59gpKKMxs6ykciVc0T2WT+C+QcMrJ76KyTpEhVpAQZau7/DnUrq5fsOOzxjCiID8k021oORTgTYw4DCTNNVKtbbGX9G0ZXSHfp26n8MOLqba00kWn5NMgirNmnocybA/0NynzpKa5LJZjXJRgpqx5rDVPasx9GpAsj05Nv0KsLlSANlN3fEF0p+dK3xjuWjE4m3pl7ParzEPlY1BWu1wKud6xZi7DC+wdW/APtfOAErJkc6Si7BP0DIx1ltxX4KhlZnVIqzDAHSdXkTr2jvNFzGkNaIkb9ld0/MXIRzlwlhfVPpMGHdmQz8Zm5V1J2qzFyJMZMiMD7uQColscSvk8gy6Vnw1/SBuZDqpj2adORYC7IUQ1m3vwwyiUEmy+V3vufSRsVlrqkoiP3atAzgeMwRhI2RQmz6jCpGAD5BmqWSmH9vWlKKnT27Axr1wa0tRxLk71meEcM1b2WJnsMyoRQuyOagHj2iCvwKUaOwGhe21suTOFGYe24W2H9nZIvfTLU+tC1DWLeXAZ5BRmzksykW7St5SMQLTmlZHR0vIN3ZelFZ+82WdtzS0DXYc3xKJVEwiQA4IoSKkFaY3Du/8KN2PQpQUZDBhkBRcxTw/6pa2fuEJyujV7y8y+zag1I7wFdzpM7fl3uvHNrKvnyGi6y5Sgwy8hIC4FGfDnJ8+XO/R7RxVXz5pRNa4ybsxYfROjMHovKmVjZL+rNJGgUrkGs0X4LymoplNakrVIfUiG17vsKbPkqDB+KqK0XhwVVOqUj9wbQP7xoGaH6jULnFkhP/6/8i8u9DOvOAjkRa3bZRq9hNCPky60xqILodWBWSveG9Wkqbcd8VjfUgnAJxrw5eUf5CoVnIQj+AXI+E4tXVJycSNPIa1zGd/r0CUx+5mRETsGYvQmcDsv7GWYQH5rxhf9pDegKyZduTz2Yz2xpJmAFxhxZnfpJli+vmDc/juoX2RRcLHdsfMzz5Q0M3vGm5czm1+DsfISjgErTMqnzFHLu1hgCtxXhMmTgMum+9760JQcKhtmhDVxUIR2Gk5VYeX04GaRu2BK4EQLx2peaMYaybkL0ajbJarm9+M8UvtS6Ec7cWxHtwppDopea7MSAwWItlIMNIIsoFL9X7WmkiAobUyV5pnw6cApGdtyOQYSRruw0lrT9EHR5NWlL9Y5CbgbCKoy8fcQmg0YUxIeUVwYC/QfqLsGUr5DuezcpCEuQCqeXihu6Iji0BMMvc0eAdpExrw758kRnd+Mc5k2oW5jW7cYGLMnDnYTp0yfw0k3H4+RMMqY5dJRPVKQqfmbW4XSh9PT9XxrPTJ0bVRYxZ6DyWazJjOhG7KiAeP0LtwKB+zOqC6XQ95MYxZJO+7FZ++1EeeB0hFOxsnO4RZfYhznIlxOtQKtZJYX1d6atemq86q3lnRhZiTWtCV/4UfUm4bJO4IqorqRQui6S6UiXEmS4ERvy3p17T8I1nYZwGta8YlS+5VEE8RiYxyck9OcEskrWbbgpBuYuvbd3ZiHoURjTlPB8uUOQkC93TwNXsMVeKLeuf8iD+SiX5O0tByBmZSizKxAESYJ3jPfWx4Ar2RJcKLf1/ytt52IbU2ifBJlLxrx2VC/ZBEC8NuPLGINTBb0Go6vl5r7+FB6G2oyrM9sOLEXMu8NJg4TNm+Pa2+h5TCldXVEOTFPGNfqX+rS9keAM4HMY09QAE02KNTaq0L5DUF5UFalK8/c6Y8osrF2NMYdG32t5VFUgEwTxwbKsOiHhHka5mGDzZWncKBxys3fkDkd1FRmzX/Lz5c/BfaasehrBkjzkvdunvRQJjgXmjVpJvv2V8+8J3GJZl87dgriios5o2Q9jFiF8HBEhSGgjtgri7dk3ItyAIxk5yhAkwvnywP0NYaHkSz+KgUQ6xbX23/0l7Ljj8SjzMeYVBInz5fFs7Ge4YJH09N+axg96RLK69uwcYCXWvDphVcz6i3s9TlbQU/yGgKaO944lKnpA885MNKcCZ0Uyvsl9k4rDICizRTtaOjCmG2X0y4Fnu/UDtxaRhZIv/jGVt368tO7cey/chPkIJ2DEUHYuuoWT48utEZwbQOSLBMEF0tP/QNpK6+EryafOwupihHcCjSNSVdHbmfTUF2TtQ0+lsjqOb8S2Z49BmIc105KvkCIZXwB1naKzybAp+58Ic7Hm4IiYTyoLiPPlAF/BBBfKzf1/Sz3/1t7cidi5iHygoRTpAncfyAWUd7lSensHPF++nZfzQS3NNMkSRD6FEUPgKr9XwuYMbivK1wlkhfR6ExjtyL0bYR4ib0x4IzYm4ysQ6B0EbiHa90uJcz5syn4emEvGvDLR2ybOl5fdU8AlbHEXy239/0qlGUXNoWp5P2qWk5H9G2y+/FaExdJd+t/6MtSD95CS/DSQUzDysoRpsnpNnf8Ds0DyG3rT9g6HTgZNmQ6ZZRg+hDSQImnZ/RPDuQxsvlp673+Gyoc/tHxvOgvhv2LStJoYXz4orlVCWEV36Stp3CiMl3c6bdoO7Oo+C8zDyquSd2mpSC0IqPsxZVZLb6mQRipsyDuLN6zbWo7DmIWho3yi27q1WkeB3g5ucd3uhkuvfZ2dB3IsRiYluhFbT1/CFai9qF7GV579Jmo5AGQxRipekslmfINWTjeDmy/5/hvSCBLP6ZeYPF9OJDvqQK5EzXlp041+lm/pHWDmYeVNDSG1MEiF3Y9yAWbgquoWdfpEqiKXrtYmzCMnILIwcSaimhhFgwRO/xt1y59tkEC2ixOCVVhzYChxmRiYD05IqILyLQznS3fxjsofNl5MVZ8/xZLdH5XFGD4UE9dqDAcX5EIeNV+Q9eu3jHe+fJsiVYFZgpGPNkBJHl/WCfWMtthVaVzi2uZkkHBObCO2QSaDtAdYIvniL5+rQpLtuqVmN09ki/kvHGeSMXsmzJcPlhiB2wJcSrD5Qum9/+HUH8a27PswLMGaGbH58mTNm60B527HBedKof+7scM4rqiwOkry5QQTFiJ6LNbsFOlnaOK8dxg/wrnlUui7LW3UyTZFqgxLBzdiXQMs1xkI3L2orqDQ92Xh3y/XyfM6nB3Z3YEzgVMS3ySLaxeX3UbEXcTEvisj7eJ0zbLGxbVCoaRPoizGmn0ay9Vcf47RLrm51DNeqLAhJXnm0ZOBU7Fm7wb47V11B8PpLcCCf5fVjdtvpFbjfwoZFoF+EmMmNNDY7jMgl7GJS5+P4qts50GtvcE6svsDXYh8MGFt7HpxrXWoLpBC369Tf1Db9twVs8PZICdjZOKIqqltHxU2KLWg+mXErZJ8f99YrZ6G6EZ35N4NunywJE9s5yImMRxldUIXT0z6RirdtuKTQbP224ny1mOBhWTMyxtLcE6/izMr417F2/tNyPM8uHVcUu69iC7AmJnRllmSfLkLB+AVlJ/jgoVp3CgcWjI2H4gxZ4N8LFqkSp4vD8HlUeDCGqmFMSBNPDShmdoaLs/LYcnr3USjuWFW9yTKleiWC6TnH4+M1ctyOKrT8D01fxTsEqy8piFGc+ODGuFo7m9fKFbJC/6B4ttMHS3HoTKfjGlpAL68MiExAHI5Ljg/jRuFzyJnuhhrZjUAXx7ElhbuBC6QfPG6WObUkJniEKcmZ84CPS7xkrxmWSeSEQ4GlkjvPRvSVpFuI9F8CzAXK29vCFG5yrkvu/UIXZIvfQtqNXSe73+tvNhDXS1V2vbcFTPxDFRPxZpJjcGXGyi7+xAu5gF3pfT3b041Xz4Hy8apx4BbhDH74By4BlgfFoFA/4hhrnQXb2w04KnRjQ5L8pNC3Wi7W0OYMwxmddfjZKX0FH+XejqxdZ+pZJqWAEdhGmJZpyL29wjKl+DxC6Tw6BPDsbw4LLdRjcJXR/NrwZyDyKcahy83ELjbIuuoH6X+gL9+yi7saE9BOA0xL20Miy9jUVVUv47IKskX/15/tpIvyXOHg67C2v0SHretm2bQuyIv2xed1Y3Vs11NJltzL8PqPEROwMrLKCd+tgeNydGvg1s63L0gGcYDX8fFthyKkdUYMythvrxOMIZfo8ESKfR3v1AOatyUmp1Tp+G0C8PHG2a1OBxJfBq4iCefukDuHH3xpW30FWYiZhXWvKlxHOUNBO4J4HzUflEK65+ov3RSVWWC0NF8BGpWkDFTY/PejSBn8DuULimU/jASmCMj/MMa2nPHIXo21uYSLT01ykoyxhC4MnAlVi/2ZhSgndm3hctC8sYG2yj8G+jFku+7tnq2RpgKqx2pzb0aOAf4TNQUTkY3upLVEWV1TgPQa9HgfClsLKXy/NZOy70dlcVYeUNDJIyVZR11f8fJEikUR3Q/QkbyY9iGDu8ZGDM5YT2CGF+ujyGcx5NPXpFExtdgmYyhveVIxMzHyn7RjHMZkUwymYyGa8eVDr6RRXJzxPWOQPVUc17fMG03BoKTgNMTP69hVhdgo/fg+C2BLqhq06R5Wacjuz/IOZE5Q+OIVAXun6heyOZNV8rtDz490rgy4jdVDV/e2vwaMnYh8Imo2ZBUZhOTdTRQdn/FcJ50F7+eVk6x1rx560kIczENxJeHs7Q/QIMuKWy8s/5svaiLLJbda2f2M8BSjN2bIEi68RuTHnV/Bl0g+b6fjmRWNybOaNueuyIT5wGfIyMTI947Ofu6aoXkAlSuAbNqNDWDZHROY70gUHMnYlZhzJsbQKO3truvbrkU+q9PW5Yz5MLtyL0adAHKUVhjGqK7b40Q6CbQixAul3zpwRf6oQwdwWx+V6gwaA5JuCSv20YuPwhyHpufuSbK6tI3XRX9vTp9+gR22vR54BSs3SekZxtIvVNYLd2jXyHJqL+Qmvny7JEgC7DmNWHWk9gLGTpna2SpdG9YP1wZ35gqWWvnyw/FyBKMeUvj8OUWguBelPN4d+lK6cJtL7gN+fvC6nA5wodjJXlSf1+dcxJfwm29QAr3eSXIjtx7QJdhbWvCk0G1vHfg/oqwKMmpN0noBRmI5m6n7zaZnSafAnJWNBKUvBlFdeNNriDgXOktPp568+b23MdAu8iYVye8LPTcSm/PwZfXluTNr8KYc0BOiGQJkua9B0WqnP436LKqSFWaN45bpxyMzSzFcBiQ/LKOSDRBpfcD5/JAcE3S+yeS6AurGc6fNhXrzkD0BIyRxmlS6N3AueSLXxdwqdaeaJ/2UnCfBZ2LNS9vDFeaqnnzz0HnS750ez3w1RhqzCbDptxJoPOw5pXJ/w01Wd2fEFkk+eIvUknnDRGp0tOAz0Vie8lp/ygBIKH2j3sG9KsgK14MnTduQHybN29n7hCUVRg5NHm+vGbW80agS/Kl36T+A2uftjfilqL6KazJUHbhIU/ejGILKpegwWXbklrQtlzoJZuR9uSlB+K8d3AfhqV0l762PdKj4+5sxTdip0+fwOTNpyJ6ZmNsxOLIGIsCqj8koEvWFf/cSBggDfMih2zHZY9E5Wwy8vqYYE0S424OVcXa0IwC1hCwrNFe5KhduLV+nx0gSzHmXQ0i/hTx5e4BRFcyULpaehnQttwMLIsQeX8DPGec934alS8iemmjZHWJf/NwDta8rgFEquIyvn8Azm3UCkka8sVW+PJ3TduBx8qnhny52TXRFdqaj083AVexiXOfj+7vuAXz9uyHERYMuj9p8k0na2AgyAN3IXw8qhiSFqmCjJgoq/sualdIYf2dqTw/9dW305VYMzv5jdgY7x24+0CWS6F4daxiaLgKSRr2RQ/lx+aBHI8Rk+B8eb241v0IK5CBr0n3vZtSN18eH/9617Qd+Jc7BdUzsWa3xvAojKiwoKGe5QaMLpXuvrWQco/Ytuy+GDkHOKYqUpUcLRcbY3VPInI5bvNF0vOPRxp9qEEaHCRqb+wZ2TasLEbkfZD4fPngslAQ3Aq6pG4RI518eeer98KVlyB8KpJoTZYvp7oEkpBFnWQwBpxbj8iK6kJZmnnvA5p3ZqL9PKpnkzGTG0CkanC8GP0ugXbJur67xkqFJGPiAAwZd2v5AJhlZGT/huDOrLFRPvpTTLlLujf+KW1gPnS+vOJfKO8NL9wEeeiksrpMlNWpXMikJy+WtSmVdohdVtqePQZhPtZObQgZ38HJoLWgq8aiK5iM1QOh06btwK7BScDZWPvKhhHXcm4rylWoW+3NKCp8uSzGVhrU4xrM67I6vooJLpCb+/+W+nPQ1nIoxqzAyBsbgvcerKKLOLdcevqvi4H3mBohHpMf0jbG3U4H/VwDmJ7G5VT/iciF7BB8Udb2b05lBladzW6eyDP20xhdjDV7JMyXj1BWVyc9iiyVfPGPqazIamR8s/tiWAEyp0HMGSr7H48D57I5uEpu6//XWP4+ZdwclpnNBxGYFRh5T8yMIqGNQhxGKsJFfwFZLPnif4/Vm37YLtyO7O6g56DmBKxMSnhaZLhK8tgomvszsLRuBTulIlXNr8LYzwOnYmTHhJVLw95IxtgIF75NEHTJuo3F8VAhjfmSdhsaC4eDLsSYg5LXFq7Lzpwuk56+36c+O+vMvR7VLsT8J5CsefNwVF2qDxDoBezorkxt1UVEc7a2NmEfPR6RBVjZI/kppbiksf4WDRaNN0MYGZcHaTYZNmU/i3AO1uyT8EGq50m/gpZXplbMv9bE9r3R+nvyyoHPL6uLm4tcgZVVcrPfF9CO7IdAzsFKW/L6OpVq2EA5+BOi50u+7/vjsUIad82lmpLuwGm7McGdg+jnMWZC4voL1YkFfRSnF/P0U5fJnQ89lcKPv9aMoiN7ArAAa/aMzCiSUrPcjsrKhM+l7ieUWeXNGUDb9vkPTNNKjHwATbiyqu1LPYyyikftlbJ+/ZbxOtY5bse9arWxs/ujzMOYj8bK94SaK1qOKfDdDW4x+b4fCGiqOdQDp+3GhGAhwrEYs2OiF+62SvLqNIO7Gdy5ficAtHPvvXBNCxGOxpgdEh4qiE+IlVG5FmNXSvff7xvvSdK4ntndppekYwXWdDQWX65/gGCx5PtvqFxAqd3im9n8GpxdhjAn4QZ1veXW/YgsY5/itbKGIKWO8irgdP/dX8KkSceisoiM2bUBeO9BY5fA/RR1S6Sn/9a0fEuSigMY58tB6MidAMzFmikJLxwM2o+pAvp1cOdJvv+vKaRY6i7cqe9C3WKsmTnq/GqNrrxuCv0S5XKvkwPanp0DdJExr20YXflwCuwWnJ4rPX0/SFuFlAoQr8smQm3s1n1fQaZcmS9/aeIjUIJEG37PoHoJgblAeouPpxA0BvnysEH9SYSFWJMdBb68vgldKz2aNnOGmqZl85vAzMWYdzacYiWcy5MTvyR33rk1bXIGqQPxbZbvM1r2w8pykDlROZYkXx53DimCO5d831fSakZRfUevn7ILO9pTgVOjC3e4q6f6UbTf41gmPcXfpS2rG/Lbt0/bG8pLEHNsAyzrDCqJBroZuJSg/AXp3Xh/2pKd1IN4NdOoMW/OvhFkFVbe0BBmFEbCBZJA84guqppRpNmqa8aUHNauAPkoRobH/UkJMNE0w6CL03WpbzSHLk6nIXoKxuySsH3dIO2IguNHSLCoSjumrIfkQXxb5Xus/NKO3NGgC7BmasLjbtHBjf5t1e+iel5qfRdredk3IiwdNG92ASLPr7QfIj2q56OZL0hh/RNp9lNVMLTlPoroMjJmaiQwl6CjfIz3Lrs84uZWBwBSViF5EN+OLKTKlx/QvDMTzWnAGVjzkgYwowjtxwK3FeEyyk3nS+/dD6ethNy2+xMryJjm0IxiuyiWyJzBGJwq6DWUyxdI7z0bKpdjJfNPXzXa/Gawywar0UbhvYMNiFxYnQxKIe/tQfyFlpQzWvbDmDPD2WWhMcwoLATBPTguxZW+KL0MpFSbOpw2esOUXRhoOhHc2f+mQV07iubc/wO33I91grZN/Q9E5yIc2VC8t3NPAxfRFFwqf9z4WNqSFg/iw5mhdOTegOqKQfuohhmr6kV1fp0Gcko53ClZxHaBHDmEL49Lj5aDv6KyQnqK30n9b9a598vRpnnAiVizY1RxaqL2ddaYkPfW7xG4LumNZHxTVCF5EB/J8r0z+wmQBYi8NuRiNUnLrwArGRBQ/TmOpdJTXJe2rHLbutWyBGPegmq4GZAxUNYHES7hX01Xyl13PVn/blNxlolpCz2TOxbDXKw0J9z7qV98WwssrMr4prxp6UF8GLOXKl/eufckdMLJoGdgzG4NMF9e4csDhC9Slkukt7gxbaXnUL68+aNgFoK8BvRKdOv5Urjv3hT+LnU6Jy3vRMwyrLQnLjoWt69T/SuqqyRf+lY9ZeYRyIP4yJSiM6bug3FdiBwdzZc3Cl/+CMrFBJsvld77n9HwHUvK1sPDC7d92kuxborcnNJlnRrwzs3A6ELEfCBxu7yajVj3BMq5THKXpFHG14N4I3wcM6fMIjBLsfbtEV9ejrLyhDKbKl/+l0i/PL6GnE7uN83LOh3Z3YG5wOcwpilhI474ZBCg1yDmAunesD5tFZIH8UYB83pNCWEJ1vxHzLw5k8ijVaYwEFD3e5ybKz39N6cyG01TFRJWgaGj/PTpE5j8zMmInIo1eyUvUhXjvQP9DQSLx5s5gwfxsfrhhNydVvly13QqwulY+4oGENeqZD0unIe2F0rv+g0+6xmH4B3vB7Tl/hNhKRnZP5ZQJLR9HF/W0TsQt7BOxlc97+1BvAFL2OYWkDNQOQFrMo0xXx4zh9309Bfl9gef9vzjOKg0amQJsm1YViPmrQ3Ce4d9GucexLkLeWrHL0QiVamqkDyIj+WPqmNKK2SWYOSw5DfgNAjtqmw4Kw0XSqH01VgZ7icBxmrSMGNKDmPnIvIZjJiEHaxi5gy6GdFr2FI+T2655x++AvQgPrbK29mYwXXmqR9EdBlGXp+8GUV8a1F/j5jF0r1+bay8dZ6bbOCzFafvWvfYkcyk01E9h4yZ3DC8NwLO/QLnFsq6/lvA894exMcymFcaTa2tTWQePQ6Y3wCNpkHdbNVQXEvM4uqUgN+Oa8yztASkKxJqa285CpG5WDudIIgWzyQ5R3ljQtVN524FWSD54i88eHsQH5+l78zcK3FuEch/YYxtCPPmcF73KZAvUt50sfTe/7DnyxsGvOscj3KH4HTloAREoss64cUR2tfdi3AeT0y6Jq3mDB7E0/YxVpYvjPlAgzml9OOCc6Wn/6rouW1UTfiPMcnLvyP3alRXIPKRhhOpUr0K3bpaev7xSP1z+/AgPv7BvCP3HlRXYs2BDcCXx8vim1FdWieu5fnyUQLvGhtBG5yC6KkYmZywOUPEe0fmDKrfxZVXSs89f/FnxIN4GsF8UJCotbUJ+9jnEE7FmuZwvjxhM4pBvvx/CGRx1WfSf6ijciZC6iR7LE6WYmWvEbCkexEXvBYIdIGsK/3WnwkP4v7DjZfMBzTvzA72HERPxpgdE12RHuL4zpcYGLjIj4qNQnXWnnsvovMw5pAX7Fw0bA8XE6ly2g+6kCml78oaAr+s40Hcx7N9xK2515NhEcIcSNq8Ocr+rAHnHkZZhRm4Srrv3eSbV8Pw3muWdXKvw+hKjLwfqfLeyfZJrCG0r5PL2RycL7f1/8tf4h7EfWzvR92WeyuiK7GmI3m+PDJvDtenb0foknzxv305PQwVWFvzqzBmPirHYWViNLGkiY+fBs5h+AYBq6WndLcHbw/iPrYfzAf5cjC0txyJyFKszSbMl9cL+P8vLlgsPf23ejB/Ae92+m6TmTz5U6CLyNjdG0qkyulvcW659PT93r9bD+I+hiVb23NXZOKZwKmxbK0BVqvdVtBrkfJq6b73Pp+tPUeVVetA9BHEdJGR14QiVY0gyWAgcHeiskIKxe/GwNvz3h7EfQwfmE/9D4w7B5GjGowvfwTkwhpxLS9ytI1lnWw7sAQx72mY/QBrwOlj4C6hvOWiqpmIX/byIO5jJDO53FsxrMBIZ7S5l9QEQy1fHrg7QZdJvu/7aS/Da02JX70XWl4MHB2ZMyS7rFOppMJL5DoC6ZJ1G+7xlZQHcR8jD+ZV7WgFQ0fuU6DzMWZarPmZlBlFuAgiAuquR3We5PvyaQPzmmWdWfvtxMDWkzGchjG7Jj/vHROpwv0C55ZXzRk87+1B3EdCWd703SYzeaczgFPIyC6UE93qi083lIFvIa5L8v194z3LG2rWPPUI1C0nY15N4MCRFHUSLetUee9bEFku3cX/8eDtQdxHI4F5+5QsklkAfKZhzJtDvvVfKJeAuVQK658Yb2A+ZDS0PfcWhHkYeVtD6MgPilQ9grKSR+2Vsn79Fu8o70HcR8OCSPaNwPIGULqrs+dyf0dYRr70HQE3HiYfannvqdNQXYTwydiyTpIiVWCNwbktiFyB23KJFO67d7xXRB7EfYyfcr49+2GQFWTMfpHmdIJ8ec0M8h9Qlkqh+P/Gajk/RC5hoj0b5QSs7JK8SJU6rK2IVP0EMcuke8OfwOt7exD3MWYAptpYC/ny00PzZnlZQ/DlFRU8x7dQOVd6NowZFbwhjeXO7DEgCzDSEvLeiZozDFY9gfagdEmh+POxelH68CDuwXxIqe/OAjkOI5KweXO81H8auIhngkvljo2PNWqpvw2dk3djdQXGHJywJEK9GfZGVM9nUulqWUvZL+t4EPcx9imWOj2W5pmI7cLK2xum6RYuC90Dupx831caiS/fxu93IMaehfDxBli2GjRnCHQTcBlbn7lYbn3goUa9DH14EPcxDDQAgLZn52CkC5HXNoy4VmhG0Y3qkkYwo6ipZA581W5M2HEu6OewZodEZQ+Gar5/HceqqkiV90j1IO5jHIN53C29c+9JaNOJiJyFkQYRYDLRv63fJ+BC6SmuqwDTaDXkagyup03bgV2Dk4BTsXbv5AXINMCaTNggdjfizHLp2fB/SV94PjyI+0gyy5y1z54Edj4qn8WaTMJmFHG+fCvKl9gsq+T24j9HmiIYuqzT8n6QZVhzQChSlbApsRGLtVAO1gOrpVD6auxi9vPeHsR9pJBiqTOjyLZjOQdjDoeGWlL5B3AxT0764kg4qW9Dx30GwiqMvD36HcpRdZJU09KQMULZPYroJWzWy+W2/n95kSofHsR9bBvMO3LvAe3CmhkJZ6B1Y3PuVpAFki/+IkaxuBcD5jUVyUEtzTTJ6cCJ1YokqQmekPeO5H5Vga8SlFfJuo3Fka5IfHgQ9zF2wbzOvPmRUxBzKlb2aijDAtWforJM8ht6Y2D+vPjyGt57dvNENttTQM/C2l1D3jtRU+I4770WdXOrIlV+WceHB3Efzys7bd33FdiBhQgnRhKqDZKdugGQayC48PmIaw2d0mk5CpGzseZ1saojk8wPrwHGVESq7kJ1oRRKP6z8bX7e24cHcR/Pj2KJ88SdUw9G3SKM+WDDmBlkLATBIygXYQYujcybt8kTD6GMZkyZhbErseZNCevL1P89DwGXYSd8QW6660kFYQkiXR68fXgQ9zEcYN6eey+iKzDmwOQ3FbUcE9f6K8IiyZd+VJ+5xuemddY+UwmaloF+DGMkUZGqWt7bIVzNFnee3NLXv72VhQ8fHsR9bC+Yxwx+p09gp2c+BbIIa/YJ+fIGmJ2mYkbBEimU/lB5bgGnb5iyCwP2FOB0jNmpYcwZRCDQ/8XpcllX6gHPe/vwIO5jJNFnqHnzPOBEMjKJcuJbjGFWW9liLNvl0rt+g7Znj0FkIdZkQzXHxMB7sHowAoHeAbJICht+Eqse/LKODw/iPkaBYqnhl3OvwzIX4RMxHe0k+fJwrnrAPYroBqxtayje2wX3olw6UnPvPjyI+/DxwsC8veUdiFmIlTc2zIZjSFc0hjlD4MoIl1PevFJ673+4vrLx4cODuI+kwDyusS105j6LMg8rU5LX2EYTFakanG3/UWhK3HcbeN7bhwdxH40I5nEzigOad2YHew6in8OanRI2oxjli6NmWecWxM2X7v5f1f9G/sT48CDuo2HBfJAvb9kPK/MRSd53cuThO8BE5tBl7QNdTlD6pvQy4HlvHx7EfYwxPGtgB/jh/2Njyov6OE6vZnNwbiM7FfnwIO7Dx/aCeZ28a/ZIYAnWTEt8zf3FR605g9PvYcwi6d6wvgLenjrx4UHcx/gA83rz5p0mnwVySmTenOTizQu7m1QdxkRuRPoHRJdJd+m34JuWPjyI+xjnYB6TvH01ovNxHIU1dkzw5fFlHeeKqHZR6PumgHre24cHcR/pAPJtiVFZuxhj3hnqsTQgX15ZIrJGcPoouEuwT14mNz3yZP3l5MOHB3EfaQHzWr68reVT0Xr8tJi4VtJ8+SDv7RRUr2NAl3qRKh8exH34qIB53Lx5+m6T2eklp4KcijG7EiQ2X14rUuX0/3BulfT0/b4C3r5p6cODuA8fcdSst0qbIPNBjsOIjKIZxaAlXNi0vBtlqRSK3/Xg7cODuA8f/xZB682bc4eQYS5G3jfi8+VVkSoDgXsEWM2mZ66S2x98up768eHDg7gPH88N5nXz5bnDQZdjzPRhN6PQaJqkYvvm5BuIWSqF9ffWVwg+fHgQ9+Hj+eBr3KGndY8dyUz8L+BsrHnlMMyXR7y3Cf/vVf8XkaXSveFPsX/bUyc+PIj78DEcYD5IsUzZg4xdjMqnsDLpBcyX1y7rqOYJOE96iv/jwduHB3EfPkYKyOv58s7c61FWY+S9282Xx3nvsvsHIivIF68RCLyjvA8P4j58jBaYx8W1OnKHo7oCa177rHx5zbKO24LyNYSlki89WJ/p+/DhQdyHj9EB80Hz5tY9dsROOh7RszFmj5gRstSIVKn+DyJLpLt4B4Q6J5XLwIcPD+I+fCQB5nG+fGbulTi3COR4jJkQKpoYCIIbQVZJvviLyv+N5719+PDho3GyctE5g1Mq2pHdX9uzP9KO3N+0I3d09X+/BKPj0ZDChw8fPsYNmM+mqreirXvsGM/Y/S/kY7zF/weR4WyJ1HehywAAAABJRU5ErkJggg==",dbt:"data:image/png;base64,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"};

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

// Read by an agent, Film 3 of 4 of Quality as a habit, the second series of the module Data quality. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years and dates in words). The few longer stops are in breath.js.
const NARR={
"cupertino":{"name":"A Cupertino","lead":3.0,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"Around the year 2000, people writing for the United Nations, the European Union and NATO used spell checkers.","say":"Around the year two thousand, people writing for the United Nations, the European Union and NATO used spell checkers."},
 {"id":"checker","gap":0.8,"text":"A spell checker marks a word it doesn't know, and offers one it does."},
 {"id":"lists","gap":0.8,"text":"Some checkers' word lists had co-operation, with a hyphen, but not cooperation, without one."},
 {"id":"typed","gap":0.8,"text":"So when a writer typed cooperation, the checker marked it wrong, and the first word it offered was Cupertino, a city in California."},
 {"id":"took","gap":0.8,"text":"Writers in a hurry took it."},
 {"id":"nato","gap":0.8,"text":"A NATO report of 1999 named the Organization for Security and Cupertino in Europe, and readers had to guess what was meant.","say":"A NATO report of nineteen ninety-nine named the Organization for Security and Cupertino in Europe, and readers had to guess what was meant."},
 {"id":"hundreds","gap":0.8,"text":"By 2006, hundreds could be found on these organisations' websites.","say":"By two thousand and six, hundreds could be found on these organisations' websites."},
 {"id":"gap","gap":0.8,"text":"A confident machine, a gap in what it read, and nobody reading after it."},
 {"id":"change","gap":0.8,"text":"Translators had to start checking what the machine was sure of."},
 {"id":"wrote","gap":0.8,"text":"In 2000, the European Commission's English translators wrote about it in their magazine.","say":"In two thousand, the European Commission's English translators wrote about it in their magazine."},
 {"id":"named","gap":0.8,"text":"Among the European Union's writers and translators, the fault got a name: the Cupertino effect."},
 {"id":"warning","gap":0.8,"text":"The name was a warning: read what the checker offers before you take it."},
 {"id":"makers","gap":0.8,"text":"And the checkers' makers added to their word lists, so cooperation was a word they knew."},
 {"id":"benefit","gap":0.8,"text":"By 2007, checkers no longer routinely offered Cupertino for cooperation, and readers got the word the writer meant.","say":"By two thousand and seven, checkers no longer routinely offered Cupertino for cooperation, and readers got the word the writer meant."},
 {"id":"data","gap":0.8,"text":"At the university, in October 2026, an agent read an empty column, and answered 412, with confidence.","say":"At the university, in October twenty twenty-six, an agent read an empty column, and answered 412, with confidence."},
 {"id":"fixed","gap":0.8,"text":"Once the data said what empty means, it answered 38, and 374 graduates weren't asked again for a name they had given."}
]},
"answer":{"name":"412, with confidence","lead":1.0,"tail":1.0,"vo":[
 {"id":"day","gap":0.8,"text":"Thursday 22 October 2026.","say":"Thursday the twenty-second of October, twenty twenty-six."},
 {"id":"weeks","gap":0.8,"text":"In three weeks, the list for December's ceremonies goes to the printer."},
 {"id":"asks","gap":0.8,"text":"Malia, who runs the ceremonies, asks the graduations team's agent which December graduates haven't confirmed their name."},
 {"id":"answers","gap":0.8,"text":"It reads the list, and answers at once: 412."},
 {"id":"sure","gap":0.8,"text":"No doubt, and no question back."},
 {"id":"draft","gap":0.8,"text":"Malia drafts an email to all 412: please confirm your name before it's printed."},
 {"id":"again","gap":0.8,"text":"Then, before she sends it, she reads the answer again."},
 {"id":"fifth","gap":0.8,"text":"412 is a fifth of the list."},
 {"id":"march","gap":0.8,"text":"In March, 95 graduates in every 100 answered within the portal's two weeks."},
 {"id":"fit","gap":0.8,"text":"A fifth still silent, ten days in, doesn't fit what she knows."},
 {"id":"mei","gap":0.8,"text":"So before she writes to anyone, she asks Mei, who answers for the list."}
]},
"empty":{"name":"Empty meant two things","lead":1.0,"tail":1.0,"vo":[
 {"id":"counted","gap":0.8,"text":"The agent had counted the graduates whose confirmation date was empty."},
 {"id":"two","gap":0.8,"text":"Mei knows that empty means two things there."},
 {"id":"yet","gap":0.8,"text":"38 graduates haven't confirmed their name yet."},
 {"id":"paper","gap":0.8,"text":"374 confirmed it on the paper form, before the portal opened in February, and the paper form has no date in the list."},
 {"id":"said","gap":0.8,"text":"The column's description said only: date the graduate confirmed their name."},
 {"id":"nobody","gap":0.8,"text":"Nobody had written down what empty means."},
 {"id":"desk","gap":0.8,"text":"Mei could have told anyone who asked, but the agent can't walk over to her desk."},
 {"id":"reads","gap":0.8,"text":"It reads what's written, and answers as if that were all there is."},
 {"id":"cupertino","gap":0.8,"text":"Its 412 was a Cupertino."},
 {"id":"part","gap":0.8,"text":"So a column's description is part of the data's quality."},
 {"id":"iso","gap":0.8,"text":"One international standard for data quality calls this understandability: data its users can read and interpret."},
 {"id":"fault","gap":0.8,"text":"Empty meaning two things is a fault in the data, and so is a description that doesn't say so."}
]},
"written":{"name":"What empty means, written down","lead":1.0,"tail":1.6,"vo":[
 {"id":"first","gap":0.8,"text":"So the team fixes the data first."},
 {"id":"noor","gap":0.8,"text":"Noor, the data architect, finds where the paper form is recorded, in the student system."},
 {"id":"how","gap":0.8,"text":"From it, Jun adds a column that says how each name was confirmed: portal or paper, and empty means not yet."},
 {"id":"words","gap":0.8,"text":"Then he writes the description in Mei's words, for a reader who can't ask."},
 {"id":"means","gap":0.8,"text":"What it means: the day of the graduate's answer in the portal, for that ceremony, once it's accepted."},
 {"id":"emptyis","gap":0.8,"text":"What empty means: not confirmed in the portal; the new column says if it was on paper."},
 {"id":"owner","gap":0.8,"text":"And who answers for it: Mei, in the registrar's office."},
 {"id":"dbt","gap":0.8,"text":"dbt writes it into Unity Catalog on every run, where the agent reads it."},
 {"id":"lists","gap":0.8,"text":"So the team wrote down what the agent needed to read, as the checkers' makers added to their word lists."},
 {"id":"again","gap":0.8,"text":"Asked again, the agent answers 38, and shows what it counted: graduates with no confirmation of either kind."},
 {"id":"writes","gap":0.8,"text":"Malia writes to the 38."},
 {"id":"check","gap":0.8,"text":"Jun's check from Report, fix, tell had read empty the same way; pointed at the new column, its 76 names become 7."}
]},
"proposes":{"name":"The agent proposes, people decide","lead":1.0,"tail":1.6,"vo":[
 {"id":"asks","gap":0.8,"text":"Jun asks his own agent, Genie Code, to read the list and the checks it already runs."},
 {"id":"does","gap":0.8,"text":"It profiles every column, drafts descriptions for the rest, and proposes three new checks."},
 {"id":"draft","gap":0.8,"text":"Each draft is a start: it can say what a column's name suggests, not what only its owner knows."},
 {"id":"review","gap":0.8,"text":"So Jun reviews each one, and Mei sets the levels."},
 {"id":"first","gap":0.8,"text":"The first finds a name on the list that isn't the name its graduate gave in the portal."},
 {"id":"stop","gap":0.8,"text":"Mei makes it stop the printer's file until a person settles each name."},
 {"id":"three","gap":0.8,"text":"It finds three: names changed since enrolment, still waiting for a document."},
 {"id":"second","gap":0.8,"text":"The second checks that the two confirmation columns agree, and holds for Jun if they don't."},
 {"id":"third","gap":0.8,"text":"The third would fail every night a graduate hadn't confirmed yet."},
 {"id":"no","gap":0.8,"text":"Jun says no: that's about what people do, not whether the data is right."},
 {"id":"count","gap":0.8,"text":"It becomes a count Malia follows each week, and the agent's trusted answer to her question."},
 {"id":"decide","gap":0.8,"text":"The agent proposes; people decide."}
]},
"before":{"name":"Read it before you act","lead":1.4,"tail":1.6,"vo":[
 {"id":"spared","gap":0.8,"text":"What spared 374 graduates an email they didn't need was Malia reading the answer before she acted."},
 {"id":"read","gap":0.8,"text":"Read an agent's answer as you'd read a new colleague's: what did it count, and does that fit what you know?"},
 {"id":"ask","gap":0.8,"text":"Ask it to show its working, and when the answer doesn't fit, ask the person who answers for the data."},
 {"id":"films","gap":0.8,"text":"Context engineering showed that what an agent reads decides what it writes, and Context and memory, governed, how to keep that right."},
 {"id":"step","gap":0.8,"text":"This film's step comes first: a column's description is part of the data, and its quality is the data's quality."}
]},
"monday":{"name":"For a reader who can't ask","lead":1.0,"tail":1.0,"vo":[
 {"id":"monday","gap":0.8,"text":"On Monday, pick the table your agent reads most."},
 {"id":"each","gap":0.8,"text":"For each column, write what it means, what empty means, its unit, and who answers for it."},
 {"id":"fix","gap":0.8,"text":"Where empty means two things, fix the data, not only the words."},
 {"id":"let","gap":0.8,"text":"Let agents draft and propose; let people review and decide."},
 {"id":"halves","gap":0.8,"text":"The Cupertino's cure had two halves: complete what the machine reads, and read what it offers before you take it."},
 {"id":"takeaway","gap":0.8,"text":"Describe your data for a reader who can't ask."}
]}
};

const VODUR={"cupertino/when": 7.238, "cupertino/checker": 3.603, "cupertino/lists": 5.71, "cupertino/typed": 8.297, "cupertino/took": 1.457, "cupertino/nato": 8.681, "cupertino/hundreds": 4.788, "cupertino/gap": 4.234, "cupertino/change": 3.233, "cupertino/wrote": 5.404, "cupertino/named": 5.894, "cupertino/warning": 4.013, "cupertino/makers": 4.758, "cupertino/benefit": 8.191, "cupertino/data": 8.409, "cupertino/fixed": 8.416, "answer/day": 3.142, "answer/weeks": 3.609, "answer/asks": 7.582, "answer/answers": 3.385, "answer/sure": 1.849, "answer/draft": 5.733, "answer/again": 2.93, "answer/fifth": 2.289, "answer/march": 5.243, "answer/fit": 3.415, "answer/mei": 4.083, "empty/counted": 4.127, "empty/two": 2.242, "empty/yet": 2.829, "empty/paper": 7.776, "empty/said": 4.245, "empty/nobody": 2.263, "empty/desk": 4.365, "empty/reads": 3.436, "empty/cupertino": 2.225, "empty/part": 3.274, "empty/iso": 7.374, "empty/fault": 5.236, "written/first": 1.873, "written/noor": 5.249, "written/how": 7.021, "written/words": 4.123, "written/means": 5.549, "written/emptyis": 5.108, "written/owner": 3.336, "written/dbt": 5.025, "written/lists": 5.849, "written/again": 7.074, "written/writes": 1.782, "written/check": 8.007, "proposes/asks": 5.027, "proposes/does": 5.489, "proposes/draft": 5.746, "proposes/review": 2.806, "proposes/first": 4.88, "proposes/stop": 3.766, "proposes/three": 4.712, "proposes/second": 5.044, "proposes/third": 3.621, "proposes/no": 4.141, "proposes/count": 5.481, "proposes/decide": 2.24, "before/spared": 7.155, "before/read": 5.536, "before/ask": 5.755, "before/films": 8.123, "before/step": 6.702, "monday/monday": 2.888, "monday/each": 4.968, "monday/fix": 3.551, "monday/let": 3.659, "monday/halves": 6.401, "monday/takeaway": 2.458};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card, once the opening has come back to the data story; and the end card. */
const BREATH={
"cupertino":{"hold":{"when":0.6,"checker":0.6,"lists":0.8,"typed":0.8,"took":1.0,"nato":1.0,"hundreds":0.8,"gap":1.2,"change":0.8,"named":0.6,"warning":1.0,"makers":0.6,"benefit":1.2,"data":0.8},"breathe":5.6},
"answer":{"hold":{"day":0.4,"answers":0.8,"sure":0.8,"draft":0.6,"again":0.8,"fifth":0.6,"fit":1.0}},
"empty":{"hold":{"two":0.6,"paper":0.8,"said":0.6,"nobody":1.0,"reads":0.6,"cupertino":1.2,"iso":0.6}},
"written":{"hold":{"first":0.6,"noor":0.8,"how":0.6,"words":0.6,"means":0.6,"emptyis":0.8,"owner":0.8,"dbt":0.8,"lists":0.8,"again":1.0,"writes":0.8}},
"proposes":{"hold":{"asks":0.6,"does":0.8,"draft":0.8,"review":0.8,"first":0.6,"stop":0.8,"three":0.8,"second":0.8,"third":0.6,"no":0.8,"count":0.8}},
"before":{"hold":{"spared":1.4,"read":1.4,"ask":1.2,"films":1.0}},
"monday":{"hold":{"each":0.8,"fix":0.6,"let":0.8,"halves":1.2},"breathe":5.0}
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

/* ===== Data quality: the module's look =====
   The films of Data quality (Fit for use, Quality as a habit) share one look, assumed on 5 November 2026 for the author to review
   (films/fit-for-use/decided.md): the quality bench. The data team's workroom at the university: a wall of warm limestone lit from
   a window on the right, and a long bench of dark speckled granite, the flat stone inspectors measure on. Records are cream index
   cards, each field typed in the mono face; checks are the inspector's tools, a dial gauge and a tolerance band; results are tags
   tied on with string. The Great Hall, in warm oak, is where the ceremonies happen. People are the agent films', unchanged. No film
   grain, no watercolour.
   The module's files, bundled in this order after The Inner Life of Data's helpers (core.js, style2.js, ui3.js, and its logos.js
   for a film that names its tools), A Sharper Sketch's scene() (sketch3.js) and the agent films' kit, people and agent
   (films/what-an-agent-is/shared/src/kit.js, people.js, agent.js: the camera, the shots, pictures painted once, the people):
     look.js   the palette and what each colour means, words, the places (the bench, the bench from above, the Great Hall), props
               and icons
     people.js the cast this module adds, dq_person and dq_nameTag
     cards.js  paper cards, records, tags, chips, the tolerance band, the dial gauge, figures, the kicker, the module's mark, and
               the title and end cards
     tools.js  the tools' pages, each with a small bar naming the product and its logo, and what goes in them: rows and code
   Every top-level name starts with dq_ or DQ_. A film's own pictures and helpers go in its own source with a prefix of its own;
   never change these files for one film.
   Sizes are in the 1920 x 1080 frame. Every word is at least 28 px as seen, and nothing but the captions goes below y 890. */

/* ---------------------------------------------------------------- colours, and what each means in every film of the module
   Six colours carry meaning, and only these: the four verdicts (pass, hold, stop, not checked), brass for the requirement or the
   reference (what good means for this use), and steel blue for a measure taken. Everything else is paper, stone, granite, oak and
   ink, which mean nothing. Each meaning has three tones (DQ_TONE): col for tags, fills and lines; word for its words on paper or the
   wall (4.5:1 or more on paper); dark for lines and words drawn straight on the granite or the hall's oak. */
const DQ={
  ink:[40,34,28],          // words on paper and on the wall
  soft:[92,82,72],         // quieter words, 6.7:1 on paper
  dim:[150,138,124],       // rules and frames that only hold things together; never words
  paper:[247,241,228],     // a record's card, a page, a tag's reinforcing ring: cream
  chalk:[242,235,220],     // words on the granite or the hall's oak
  chalkSoft:[200,190,172], // quieter words there, 8:1 on the granite
  stone:[214,202,184],     // the wall: warm limestone
  granite:[38,36,36],      // the bench: dark speckled granite
  graphite:[58,58,62],     // a gauge's bezel, a lamp: enamel and steel that mean nothing
  string:[222,204,166],    // the string a tag is tied on with
  oak:[112,72,44],         // the Great Hall's panelling
  // the verdicts
  pass:[52,122,78],        // a check passes
  hold:[196,132,26],       // a check holds the data for a person to look at
  stop:[178,58,46],        // a check stops it
  none:[112,110,106],      // not checked
  // what good means, and what was found
  brass:[178,138,62],      // the requirement or the reference: what good means for this use
  steel:[62,104,136]       // a measure taken
};
const DQ_TONE={
  pass:{col:DQ.pass,word:[44,108,68],dark:[124,200,144]},
  hold:{col:DQ.hold,word:[146,94,12],dark:[236,184,78]},
  stop:{col:DQ.stop,word:[166,50,40],dark:[234,118,102]},
  none:{col:DQ.none,word:[98,96,92],dark:[178,174,168]},
  brass:{col:DQ.brass,word:[122,90,36],dark:[230,196,118]},
  steel:{col:DQ.steel,word:[54,94,124],dark:[134,176,212]}
};
// the verdicts as tags say them: the tag's colour, its words and their colour (white, or ink on amber), and its icon
const DQ_VERDICT={
  pass:{col:DQ.pass,text:"PASS",ink:[255,255,255],icon:"tick"},
  hold:{col:DQ.hold,text:"HOLD",ink:DQ.ink,icon:"pause"},
  stop:{col:DQ.stop,text:"STOP",ink:[255,255,255],icon:"cross"},
  none:{col:DQ.none,text:"NOT CHECKED",ink:[255,255,255],icon:"dash"}
};
// a meaning's tone: dq_tone("hold").word; a colour ([r, g, b]) passes through as all three
const dq_tone=m=>typeof m==="string"?DQ_TONE[m]:{col:m,word:m,dark:m};

/* ---------------------------------------------------------------- words
   dq_T draws with The Inner Life of Data's T (so the legibility check measures it; {deco:1} marks decoration on purpose), in ink
   unless o.col (a colour, or a meaning's name such as "steel", in its word tone, or its dark tone with o.dark) or o.color (a CSS
   colour) says otherwise; o.ls spaces the letters, in px; o.f "mono" for what is typed (records, code, values). Size 28 by default.
   dq_tw and dq_wrap measure and wrap as the agent films' ag_tw and ag_wrap do. dq_label writes a heading in capitals. */
function dq_col(c,dark){return typeof c==="string"?(dark?DQ_TONE[c].dark:DQ_TONE[c].word):c;}
function dq_T(ctx,s,x,y,o){o=o||{};const a=o.a==null?1:o.a,col=o.color||rgba(o.col?dq_col(o.col,o.dark):(o.dark?DQ.chalk:DQ.ink),a),ls=o.ls||0,q=Object.assign({},o,{color:col,size:o.size||28});
  if(!ls){T(ctx,s,x,y,q);return;}
  const dx=o.align==="center"?ls/2:(o.align==="right"||o.align==="end")?ls:0;ctx.save();ctx.letterSpacing=ls+"px";T(ctx,s,x+dx,y,q);ctx.restore();}
const dq_tw=(ctx,s,o)=>ag_tw(ctx,s,o),dq_wrap=(ctx,s,maxW,o)=>ag_wrap(ctx,s,maxW,o);
function dq_label(ctx,x,y,text,o){o=o||{};dq_T(ctx,String(text).toUpperCase(),x,y,{w:800,size:o.size||28,ls:o.ls==null?4:o.ls,align:o.align||"left",col:o.col||(o.dark?DQ.chalkSoft:DQ.soft),dark:o.dark,a:o.a});}

/* ---------------------------------------------------------------- noise, for the stone, the granite and the oak
   dq_noise(seed) is smooth value noise, n(x, y, octaves) from 0 to 1; dq_field paints a rectangle at a lower resolution, pixel by
   pixel, then scales it up smoothly (what is soft anyway, such as stone's tone); dq_specks scatters the granite's crystals at full
   resolution, light, white and black, in a few paths so they paint at once. */
function dq_noise(seed){const N=256,v=new Float32Array(N*N),r=ag_rnd(seed||7);for(let i=0;i<N*N;i++)v[i]=r();
  const f=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),u=x-xi,w=y-yi,x0=xi&255,y0=yi&255,x1=(x0+1)&255,y1=(y0+1)&255,su=u*u*(3-2*u),sw=w*w*(3-2*w),
      a=v[y0*N+x0],b=v[y0*N+x1],c=v[y1*N+x0],d=v[y1*N+x1];return a+(b-a)*su+(c-a)*sw+(a-b-c+d)*su*sw;};
  return(x,y,oct)=>{let s=0,amp=1,fr=1,n=0;for(let o=0;o<(oct||4);o++){s+=amp*f(x*fr+o*17.3,y*fr+o*9.1);n+=amp;amp*=0.5;fr*=2.03;}return s/n;};}
function dq_field(c,x,y,w,h,k,fn){const ww=Math.max(1,Math.ceil(w/k)),hh=Math.max(1,Math.ceil(h/k)),cv=mkCanvas(ww,hh),cx=cv.getContext("2d"),im=cx.createImageData(ww,hh),d=im.data,out=[0,0,0];
  for(let j=0;j<hh;j++){const py=y+(j+0.5)*k;for(let i=0;i<ww;i++){fn(x+(i+0.5)*k,py,out);const p=(j*ww+i)*4;d[p]=out[0];d[p+1]=out[1];d[p+2]=out[2];d[p+3]=255;}}
  cx.putImageData(im,0,0);c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";c.drawImage(cv,0,0,ww,hh,x,y,w,h);c.restore();}
function dq_specks(c,x,y,w,h,o){o=o||{};const r=ag_rnd(o.seed||5),sq=o.squash==null?1:o.squash,n=Math.round(w*h*(o.density||0.016)),
    kinds=o.kinds||[[0.44,[110,106,102],1.0,1.7],[0.28,[152,148,142],1.0,2.6],[0.09,[208,204,196],0.9,1.6],[0.19,[10,9,9],1.4,3.4]],paths=kinds.map(()=>[new Path2D(),new Path2D(),new Path2D()]);
  for(let i=0;i<n;i++){let q=r(),k=0;while(k<kinds.length-1&&q>kinds[k][0]){q-=kinds[k][0];k++;}const K=kinds[k],s=K[2]+r()*(K[3]-K[2]);
    paths[k][(r()*3)|0].rect(x+r()*w,y+r()*h,Math.max(0.7,s*(0.55+r()*0.9)),Math.max(0.5,s*sq*(0.55+r()*0.9)));}
  const A=o.a==null?1:o.a;c.save();kinds.forEach((K,k)=>paths[k].forEach((p,j)=>{c.fillStyle=rgba(K[1],[0.34,0.58,0.85][j]*A);c.fill(p);}));c.restore();}
// light laid on a place: a soft pool of colour col at (x, y), radius r, strength a, added to what is there
function dq_pool(c,x,y,r,col,a,sy){c.save();c.globalCompositeOperation="lighter";c.translate(x,y);c.scale(1,sy||1);const g=c.createRadialGradient(0,0,0,0,0,r);
  g.addColorStop(0,rgba(col,a));g.addColorStop(0.45,rgba(col,a*0.45));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(-r,-r,2*r,2*r);c.restore();}

/* ---------------------------------------------------------------- granite
   dq_granite(c, x, y, w, h, o) paints dark speckled granite: its tone mottled, then its crystals. o.squash (1: seen from above; less:
   seen at a low angle, the crystals flattened), o.base (its colour), o.seed, o.density (crystals per square pixel, 0.016). */
function dq_granite(c,x,y,w,h,o){o=o||{};const sq=o.squash==null?1:o.squash,b=o.base||DQ.granite,nz=dq_noise(o.seed||11);
  dq_field(c,x,y,w,h,o.k||3,(px,py,out)=>{const u=px/300,v=(py-y)/(300*sq)+y/300,m=nz(u,v,4),f=nz(u*6.2,v*6.2,2),kk=0.84+0.3*m+0.14*(f-0.5);out[0]=b[0]*kk;out[1]=b[1]*kk;out[2]=b[2]*kk;});
  dq_specks(c,x,y,w,h,{seed:(o.seed||11)+1,squash:sq,density:o.density,a:o.speckA});}

/* ---------------------------------------------------------------- the places
   Three places, each painted once (AG_PLACES; check.py times it, and each paints in well under 2 s):
     "bench"     the workroom: the wall of warm limestone, lit from a window on the right (the sun lies on the wall in a soft patch,
                 crossed by the window's bars), and the granite bench along the bottom of the frame. People stand behind it, cut
                 at its back edge (o.cut = DQ_BENCH.back); its front, under the captions, is dark and calm. Cards and gauges stand
                 in front of the wall, which takes their shadow.
     "benchTop"  the bench seen from above: the granite plate filling the frame, a warm pool of lamp light and the window's daylight
                 from the right. Records, tags and gauges lie on it, in the frame's own coordinates.
     "hall"      the Great Hall, at the height of the stage: tall windows above, oak panelling with pilasters, and the stage's plum
                 backcloth in the middle, warmly lit. A person on the stage is seen from the waist up (y + 504 s at least 1080),
                 or stands behind the lectern (dq_lectern, cut at its top).
   A film paints a variant of one as a place of its own, under its own prefix: AG_PLACES.hf_dusk=c=>dq_paintBench(c,{sun:0}).
   dq_paintBench's o: sun (0 to 1, the patch of sun on the wall, 1), blocks (false: plain limewashed stone, no joints), seed.
   DQ_BENCH holds the bench's lines: back (its back edge, where people are cut), front (its front edge), face (the foot of its
   front face). DQ_HALL holds the hall's: the windows' sill, the cornice, the backcloth's edges. */
const DQ_BENCH={back:800,front:906,face:972};
const DQ_HALL={sill:270,cornice:318,cloth:[700,1220]};
// the wall's courses of limestone, each a row of blocks of their own lengths and tones, the lowest resting on the bench
function dq_courses(seed){const r=ag_rnd(seed||29),rows=[];for(let y1=DQ_BENCH.back;y1>-300;y1-=262){const y0=y1-262,xs=[];let x=-r()*520;while(x<W+40){xs.push(x);x+=500+r()*300;}
  rows.push({y0,y1,xs,tone:xs.map(()=>[r()-0.5,r()-0.5,r()*1000])});}return rows;}
function dq_paintWall(c,o){o=o||{};const nz=dq_noise(o.seed||23),b=o.base||[226,212,188],blocks=o.blocks!==false,rows=dq_courses((o.seed||23)+6),sun=o.sun==null?1:o.sun;
  const block=(px,py)=>{for(const r of rows)if(py>=r.y0&&py<r.y1){let k=0;while(k+1<r.xs.length&&r.xs[k+1]<=px)k++;return r.tone[k];}return null;};
  // the sun through the window on the right, lying on the wall: a soft parallelogram, lower further from the window, with the
  // window's two mullions and its transom across it
  const sunAt=(px,py)=>{if(sun<=0)return 0;const sl=0.2,top=86+(1980-px)*sl,bot=700+(1980-px)*sl,u=(py-top)/(bot-top);if(px<1180||u<-0.1||u>1.1)return 0;
    let e=sstep(1180,1270,px)*sstep(-0.07,0.05,u)*(1-sstep(0.95,1.07,u));for(const mx of [1468,1730])e*=1-0.85*(1-sstep(0,30,Math.abs(px-mx)-9));e*=1-0.8*(1-sstep(0,0.05,Math.abs(u-0.36)-0.011));return e*sun;};
  dq_field(c,0,0,W,H,2,(px,py,out)=>{const bt=blocks?block(px,py):null,ox=bt?bt[2]:0,
      // the stone's own tone: broad clouds, finer mottling inside each block, and faint beds of the limestone running level
      m=nz(px/620,py/620,3),f=nz((px+ox)/110,(py+ox)/110,3),bed=nz((px+ox)/520,(py+ox*0.3)/16,2),g=nz(px/26,py/26,2),
      tn=bt?bt[0]*0.055:0,hue=bt?bt[1]:0,
      lit=0.93+0.08*sstep(-200,W+200,px)-0.06*(1-sstep(0,460,py)),s=sunAt(px,py),k=lit*(0.94+0.06*m+0.06*(f-0.5)+0.035*(bed-0.5)+0.03*(g-0.5)+tn)+0.1*s;
    out[0]=Math.min(255,b[0]*k+10*s+hue*3);out[1]=Math.min(255,b[1]*k+6*s);out[2]=Math.min(255,b[2]*k-hue*4);});
  // the stone's pores: a few fine dark and light flecks
  dq_specks(c,0,0,W,DQ_BENCH.back,{seed:(o.seed||23)+2,density:0.0035,a:0.35,kinds:[[0.7,[150,130,104],0.8,1.8],[0.3,[246,240,228],0.8,1.6]]});
  if(!blocks)return;
  // the joints: thin lines of lime mortar, a little lighter than the stone, shadowed along the edge of the block above (the light
  // falls from above) and on the side away from the window
  c.save();for(const r of rows){const hy=r.y1;if(hy>0&&hy<DQ_BENCH.back-2){c.fillStyle="rgba(236,226,206,0.55)";c.fillRect(0,hy-1.5,W,3.5);c.fillStyle="rgba(104,86,64,0.5)";c.fillRect(0,hy-2.5,W,1.6);c.fillStyle="rgba(255,250,240,0.4)";c.fillRect(0,hy+2,W,1.2);}
    for(const x of r.xs){if(x<0||x>W)continue;const y0=Math.max(0,r.y0+2),hh=Math.min(DQ_BENCH.back,r.y1)-y0-2;if(hh<=0)continue;
      c.fillStyle="rgba(236,226,206,0.55)";c.fillRect(x-1.5,y0,3.5,hh);c.fillStyle="rgba(104,86,64,0.42)";c.fillRect(x+2,y0,1.4,hh);c.fillStyle="rgba(255,250,240,0.32)";c.fillRect(x-2.6,y0,1.1,hh);}}
  c.restore();}
function dq_paintBench(c,o){o=o||{};const B=DQ_BENCH;dq_paintWall(c,o);
  // the shadow the bench and the cards along it cast on the wall, just above its back edge
  let g=c.createLinearGradient(0,B.back-90,0,B.back);g.addColorStop(0,"rgba(70,52,34,0)");g.addColorStop(1,"rgba(70,52,34,0.3)");c.fillStyle=g;c.fillRect(0,B.back-90,W,90);
  // the top, seen at a low angle: the crystals flattened, a sheen where it takes the wall's light at the back and the window's on the right
  dq_granite(c,0,B.back,W,B.front-B.back,{squash:0.28,seed:31,density:0.022});
  g=c.createLinearGradient(0,B.back,0,B.front);g.addColorStop(0,"rgba(214,200,180,0.2)");g.addColorStop(0.35,"rgba(214,200,180,0.06)");g.addColorStop(1,"rgba(214,200,180,0)");c.fillStyle=g;c.fillRect(0,B.back,W,B.front-B.back);
  c.save();c.beginPath();c.rect(0,B.back,W,B.front-B.back);c.clip();dq_pool(c,1560,B.back+40,620,[255,236,206],0.13,0.16);c.restore();
  c.fillStyle="rgba(24,20,18,0.8)";c.fillRect(0,B.back-1,W,2.5);
  // the front edge catches the light; the front face below it, darker, its crystals round; then the shadow under the bench
  dq_granite(c,0,B.front,W,B.face-B.front,{squash:1,seed:37,base:[30,28,28],density:0.018});
  g=c.createLinearGradient(0,B.front,0,B.face);g.addColorStop(0,"rgba(255,248,236,0.1)");g.addColorStop(0.3,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.3)");c.fillStyle=g;c.fillRect(0,B.front,W,B.face-B.front);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(236,226,210,0.3)");g.addColorStop(0.7,"rgba(236,226,210,0.55)");g.addColorStop(1,"rgba(255,246,230,0.75)");c.fillStyle=g;c.fillRect(0,B.front-1,W,2);
  g=c.createLinearGradient(0,B.face,0,H);g.addColorStop(0,"#0c0a09");g.addColorStop(0.25,"#16130f");g.addColorStop(1,"#1d1914");c.fillStyle=g;c.fillRect(0,B.face,W,H-B.face);
  c.fillStyle="rgba(255,240,220,0.06)";c.fillRect(0,B.face+30,W,1.5);}
function dq_paintTop(c,o){o=o||{};dq_granite(c,0,0,W,H,{squash:1,seed:o.seed||41,density:0.017});
  // the lamp's warm pool, the window's daylight from the right, and the plate's edges falling into shadow
  dq_pool(c,o.lamp?o.lamp[0]:760,o.lamp?o.lamp[1]:420,1150,[255,214,164],0.11);
  const g=c.createLinearGradient(W,0,W*0.45,0);g.addColorStop(0,"rgba(226,232,240,0.09)");g.addColorStop(1,"rgba(226,232,240,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const v=c.createRadialGradient(W*0.47,H*0.45,H*0.4,W/2,H/2,W*0.72);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.42)");c.fillStyle=v;c.fillRect(0,0,W,H);}
// the Great Hall: tall leaded windows above, a moulded cornice, oak panelling in bays between fluted pilasters, and the stage's plum
// velvet backcloth in the middle, under a pelmet, warmly lit from the front
function dq_paintHall(c,o){o=o||{};const D=DQ_HALL,nz=dq_noise(o.seed||53),oak=DQ.oak,plaster=[214,196,166],velvet=[78,42,70],c0=D.cloth[0],c1=D.cloth[1],top=D.cornice+30,pel=top+64;
  // the plaster, the oak's grain and the velvet's folds, painted at once
  dq_field(c,0,0,W,H,2,(px,py,out)=>{let col;
    if(py<D.sill+10){const m=nz(px/380,py/380,3),f=nz(px/40,py/40,2);col=plaster.map(v=>v*(0.88+0.1*m+0.04*(f-0.5)));}
    else if(px>c0&&px<c1&&py>pel){const u=(px-c0)/(c1-c0),wob=nz(px/90,py/520,2),ph=(px-c0)/68*Math.PI+wob*2.2,fold=0.5+0.5*Math.sin(ph),crest=Math.pow(fold,6),
        k=0.6+0.42*fold+0.06*(nz(px/30,py/30,2)-0.5);col=velvet.map((v,i)=>v*k+crest*[46,30,46][i]);col=col.map(v=>v*(0.92+0.08*Math.sin(u*Math.PI)));}
    else{const gr=nz(px/18,py/420,3),ry=nz(px/160,py/60,2),m=nz(px/300,py/300,2);col=oak.map((v,i)=>v*(0.78+0.3*gr+0.08*ry+0.08*m)+[6,2,0][i]);}
    const lit=0.7+0.4*(1-Math.min(1,Math.hypot((px-960)/1150,(py-600)/760)));out[0]=Math.min(255,col[0]*lit);out[1]=Math.min(255,col[1]*lit);out[2]=Math.min(255,col[2]*lit);});
  // the windows: stone jambs and a deep reveal, leaded panes of slightly different glass, a stone mullion, bright with the day
  const r=ag_rnd(57);for(const wx of [120,1430]){const ww=370,wt=-30,wb=D.sill;
    c.fillStyle="rgba(176,156,124,1)";c.fillRect(wx-30,wt,ww+60,wb-wt+16);c.fillStyle="rgba(120,100,76,0.55)";c.fillRect(wx-30,wt,14,wb-wt+16);c.fillStyle="rgba(232,218,194,0.5)";c.fillRect(wx+ww+16,wt,14,wb-wt+16);
    const pw=ww/2-10;for(const side of [0,1]){const x0=wx+side*(pw+20),g=c.createLinearGradient(0,wt,0,wb);g.addColorStop(0,"#eef1f2");g.addColorStop(0.6,"#fbf5e6");g.addColorStop(1,"#f4e6c6");c.fillStyle=g;c.fillRect(x0,wt,pw,wb-wt);
      // diamond quarries of old glass, each a little different, held in lead
      c.save();c.beginPath();c.rect(x0,wt,pw,wb-wt);c.clip();const q=38;for(let i=-8;i<14;i++)for(let j=-2;j<12;j++){const cx=x0+i*q+(j%2)*q/2,cy=wb-j*q*0.85;
        c.fillStyle="rgba("+(r()<0.5?"214,196,160":"200,206,212")+","+(r()*0.2)+")";c.beginPath();c.moveTo(cx,cy-q*0.85/2);c.lineTo(cx+q/2,cy);c.lineTo(cx,cy+q*0.85/2);c.lineTo(cx-q/2,cy);c.closePath();c.fill();}
      c.strokeStyle="rgba(70,62,56,0.7)";c.lineWidth=2;for(let k=-20;k<30;k++){const bx=x0+k*q/2;c.beginPath();c.moveTo(bx,wb);c.lineTo(bx+(wb-wt)/0.85*0.5*1.0,wt);c.stroke();c.beginPath();c.moveTo(bx,wb);c.lineTo(bx-(wb-wt)/0.85*0.5*1.0,wt);c.stroke();}
      c.restore();c.fillStyle="rgba(90,80,70,0.85)";c.fillRect(x0,wb-110,pw,5);}
    let g=c.createLinearGradient(wx+ww/2-10,0,wx+ww/2+10,0);g.addColorStop(0,"#8c7656");g.addColorStop(0.5,"#c8b08a");g.addColorStop(1,"#9a8462");c.fillStyle=g;c.fillRect(wx+pw,wt,20,wb-wt);
    g=c.createLinearGradient(0,wb,0,wb+18);g.addColorStop(0,"#d8c6a4");g.addColorStop(1,"#8a7454");c.fillStyle=g;c.fillRect(wx-40,wb,ww+80,18);
    dq_pool(c,wx+ww/2,wb-90,460,[255,240,214],0.16,0.75);}
  // the cornice: fillets, a bold curved moulding and dentils, lit from above, its shadow on the panels below
  let g=c.createLinearGradient(0,D.sill+14,0,top);g.addColorStop(0,"#5a3a22");g.addColorStop(0.12,"#c89c6c");g.addColorStop(0.22,"#7a5030");g.addColorStop(0.42,"#b4865a");g.addColorStop(0.62,"#6e4628");g.addColorStop(0.7,"#3a2414");g.addColorStop(1,"#5a3a22");
  c.fillStyle=g;c.fillRect(0,D.sill+14,W,top-D.sill-14);for(let x=6;x<W;x+=26){c.fillStyle="rgba(206,164,116,0.5)";c.fillRect(x,top-18,14,3);c.fillStyle="rgba(28,16,8,0.45)";c.fillRect(x,top-15,14,11);}
  g=c.createLinearGradient(0,top,0,top+40);g.addColorStop(0,"rgba(24,12,4,0.55)");g.addColorStop(1,"rgba(24,12,4,0)");c.fillStyle=g;c.fillRect(0,top,W,40);
  // the panels: raised and fielded, the bevels lit from above and in front; two tiers in each bay
  const bays=[[0,c0-40],[c1+40,W]],tiers=[[top+52,650],[700,1040]];
  for(const [b0,b1] of bays){const n=Math.max(1,Math.round((b1-b0)/320)),pw=(b1-b0-40)/n;for(let i=0;i<n;i++)for(const [t0,t1] of tiers){const x0=b0+20+i*pw+22,x1=x0+pw-44,bv=22;
      c.fillStyle="rgba(24,12,4,0.42)";c.fillRect(x0-6,t0-6,x1-x0+12,5);c.fillRect(x0-6,t0-6,5,t1-t0+12);c.fillStyle="rgba(255,222,176,0.16)";c.fillRect(x0-6,t1+1,x1-x0+12,4);c.fillRect(x1+1,t0-6,4,t1-t0+12);
      const bev=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach((q,j)=>j?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fill();};
      bev([[x0,t0],[x1,t0],[x1-bv,t0+bv],[x0+bv,t0+bv]],"rgba(255,222,176,0.17)");bev([[x0,t1],[x1,t1],[x1-bv,t1-bv],[x0+bv,t1-bv]],"rgba(24,12,4,0.3)");
      bev([[x0,t0],[x0+bv,t0+bv],[x0+bv,t1-bv],[x0,t1]],"rgba(24,12,4,0.14)");bev([[x1,t0],[x1-bv,t0+bv],[x1-bv,t1-bv],[x1,t1]],"rgba(255,222,176,0.08)");
      c.fillStyle="rgba(255,226,180,0.05)";c.fillRect(x0+bv,t0+bv,x1-x0-2*bv,t1-t0-2*bv);}}
  // the pilasters beside the backcloth: fluted, with a moulded capital under the cornice
  for(const px of [c0-20,c1+20]){g=c.createLinearGradient(px-38,0,px+38,0);g.addColorStop(0,"#4a2c16");g.addColorStop(0.25,"#9c6c42");g.addColorStop(0.55,"#7a4e2c");g.addColorStop(0.85,"#a87a4c");g.addColorStop(1,"#3a2210");
    c.fillStyle=g;c.fillRect(px-38,top,76,H-top);for(const fx of [-20,-7,7,20]){c.fillStyle="rgba(28,14,6,0.32)";c.fillRect(px+fx-3,top+70,6,H);c.fillStyle="rgba(255,220,170,0.12)";c.fillRect(px+fx+3,top+70,1.5,H);}
    g=c.createLinearGradient(0,top,0,top+56);g.addColorStop(0,"#c89a68");g.addColorStop(0.4,"#7a4e2c");g.addColorStop(0.7,"#b4865a");g.addColorStop(1,"#4a2c16");c.fillStyle=g;c.fillRect(px-50,top,100,56);}
  // the pelmet over the backcloth, and the backcloth's edges deepening into its folds
  g=c.createLinearGradient(0,top,0,pel);g.addColorStop(0,"#3e2032");g.addColorStop(0.5,"#6a3a5c");g.addColorStop(1,"#2c1424");c.fillStyle=g;c.fillRect(c0+18,top,c1-c0-36,pel-top);
  c.fillStyle="rgba(230,196,214,0.16)";c.fillRect(c0+18,top+6,c1-c0-36,2);c.fillStyle="rgba(14,6,12,0.55)";c.fillRect(c0+18,pel,c1-c0-36,10);
  g=c.createLinearGradient(c0,0,c1,0);g.addColorStop(0,"rgba(14,6,12,0.6)");g.addColorStop(0.1,"rgba(14,6,12,0)");g.addColorStop(0.9,"rgba(14,6,12,0)");g.addColorStop(1,"rgba(14,6,12,0.6)");c.fillStyle=g;c.fillRect(c0+18,pel,c1-c0-36,H-pel);
  // the stage lights' warm pool where people stand, and the room falling into shadow at its edges
  dq_pool(c,960,600,820,[255,212,156],0.13,0.72);
  const v=c.createRadialGradient(W/2,H*0.52,H*0.36,W/2,H/2,W*0.7);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(14,6,2,0.46)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.bench=c=>dq_paintBench(c);
AG_PLACES.benchTop=c=>dq_paintTop(c);
AG_PLACES.hall=c=>dq_paintHall(c);

/* ---------------------------------------------------------------- props, drawn live in a place's coordinates
   dq_lectern(ctx, x, y, s)   the hall's oak lectern, its top at (x, y), 500 px wide at s 1: draw it, then the person behind it,
                              cut at its top (o.cut = y - 28 s), no wider than it (s 0.95 or less at the lectern's s 1)
   dq_clock(ctx, x, y, r, h, m, o)  a plain wall clock showing h:m (o.a); for the bench's wall
   dq_lamp(ctx, x, y, s, o)   a pendant lamp in graphite enamel, hanging from the top of the frame to (x, y), its light on (o.on 0 to 1);
                              a film hangs it where no card goes over it */
function dq_lectern(ctx,x,y,s,o){o=o||{};s=s||1;const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  let g=ctx.createLinearGradient(-230,0,230,0);g.addColorStop(0,"#4c2e18");g.addColorStop(0.55,"#8a5a34");g.addColorStop(1,"#5e3a20");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-214,10);ctx.lineTo(214,10);ctx.lineTo(186,600);ctx.lineTo(-186,600);ctx.closePath();ctx.fill();
  // a raised panel on its front, and the shadow of the reading slope under the top
  ctx.fillStyle="rgba(255,226,180,0.12)";ctx.fillRect(-150,96,300,3);ctx.fillRect(147,96,3,300);ctx.fillStyle="rgba(20,10,4,0.3)";ctx.fillRect(-150,396,300,3);ctx.fillRect(-150,96,3,300);
  g=ctx.createLinearGradient(0,10,0,60);g.addColorStop(0,"rgba(20,10,4,0.45)");g.addColorStop(1,"rgba(20,10,4,0)");ctx.fillStyle=g;ctx.fillRect(-214,10,428,50);
  g=ctx.createLinearGradient(0,-28,0,18);g.addColorStop(0,"#c08a58");g.addColorStop(0.45,"#9a6a3e");g.addColorStop(1,"#5a3820");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-250,-28);ctx.lineTo(250,-28);ctx.lineTo(236,18);ctx.lineTo(-236,18);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,236,206,0.42)";ctx.fillRect(-250,-29,500,2);ctx.restore();}
function dq_clock(ctx,x,y,r,h,m,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ctx.shadowColor="rgba(60,44,28,0.3)";ctx.shadowBlur=r*0.25;ctx.shadowOffsetX=-r*0.06;ctx.shadowOffsetY=r*0.08;ctx.fillStyle=rgba(DQ.graphite,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.shadowColor="transparent";
  const g=ctx.createRadialGradient(x+r*0.2,y-r*0.3,0,x,y,r*0.9);g.addColorStop(0,"#fbf7ee");g.addColorStop(1,"#ebe3d2");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*0.88,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(DQ.ink,0.85);ctx.lineCap="round";for(let i=0;i<60;i++){const an=i/60*TAU,big=i%5===0,r0=r*(big?0.7:0.78);ctx.lineWidth=big?r*0.045:r*0.015;ctx.beginPath();ctx.moveTo(x+Math.sin(an)*r0,y-Math.cos(an)*r0);ctx.lineTo(x+Math.sin(an)*r*0.83,y-Math.cos(an)*r*0.83);ctx.stroke();}
  const hand=(an,len,wd)=>{ctx.lineWidth=wd;ctx.beginPath();ctx.moveTo(x-Math.sin(an)*len*0.18,y+Math.cos(an)*len*0.18);ctx.lineTo(x+Math.sin(an)*len,y-Math.cos(an)*len);ctx.stroke();};
  ctx.strokeStyle=rgba(DQ.ink,1);hand(((h%12)+m/60)/12*TAU,r*0.46,r*0.07);hand(m/60*TAU,r*0.68,r*0.045);ctx.fillStyle=rgba(DQ.ink,1);ctx.beginPath();ctx.arc(x,y,r*0.06,0,TAU);ctx.fill();ctx.restore();}
function dq_lamp(ctx,x,y,s,o){o=o||{};s=s||1;const a=o.a==null?1:o.a,on=o.on==null?1:o.on;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle="rgba(40,38,38,0.9)";ctx.lineWidth=2.5*s;ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x,y-70*s);ctx.stroke();ctx.translate(x,y);ctx.scale(s,s);
  if(on>0){ctx.save();ctx.globalCompositeOperation="lighter";const cg=ctx.createLinearGradient(0,0,0,700);cg.addColorStop(0,"rgba(255,226,180,"+(0.1*on)+")");cg.addColorStop(1,"rgba(255,226,180,0)");ctx.fillStyle=cg;
    ctx.beginPath();ctx.moveTo(-96,0);ctx.lineTo(96,0);ctx.lineTo(360,700);ctx.lineTo(-360,700);ctx.closePath();ctx.fill();ctx.restore();}
  ctx.fillStyle="#2c2c30";rr(ctx,-14,-82,28,22,6);ctx.fill();
  let g=ctx.createLinearGradient(-110,0,110,0);g.addColorStop(0,"#2a2a2e");g.addColorStop(0.62,"#4c4c52");g.addColorStop(0.8,"#8a8a90");g.addColorStop(1,"#3a3a3e");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-22,-62);ctx.bezierCurveTo(-60,-58,-104,-30,-110,0);ctx.lineTo(110,0);ctx.bezierCurveTo(104,-30,60,-58,22,-62);ctx.closePath();ctx.fill();
  ctx.fillStyle=on>0?rgba(mix([60,52,44],[255,236,200],on),1):"#1a1a1c";ctx.beginPath();ctx.ellipse(0,0,110,14,0,0,TAU);ctx.fill();
  if(on>0)glow(ctx,0,4,120,[255,214,160],0.5*on);ctx.restore();}

/* ---------------------------------------------------------------- icons
   dq_icon(ctx, kind, x, y, s, col, o) draws an icon centred on (x, y), s px across, in a colour ([r, g, b] or a meaning's name, in its
   word tone, or dark tone with o.dark), with lines that keep their weight at any size. Kinds: "tick" (pass), "pause" (hold), "cross" (stop),
   "dash" (not checked), "warn", "clock", "calendar", "person", "people", "form" (a form someone fills in), "card" (a record), "table", "lens" (looking
   closely, a profile), "list", "printer", "certificate", "cap" (a graduation), "seat", "programme" (the printed booklet), "count" (a
   tally), "building" (the government), "link" (lineage), "why" (a question), "flag" (a report), "mail" (telling someone), "chat",
   "gauge", "band", "tag", "lock", "refresh", "hourglass", "sheet" (a spreadsheet), "tools" (the platform). */
function dq_icon(ctx,kind,x,y,s,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const c=rgba(dq_col(col,o.dark),1),u=s/48;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(u,u);
  ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=o.lw||3.6;ctx.lineCap="round";ctx.lineJoin="round";const L=pts=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();},
    O=(cx,cy,r)=>{ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();},F=(cx,cy,r)=>{ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();},R=(x0,y0,w,h,r)=>{rr(ctx,x0,y0,w,h,r);ctx.stroke();};
  switch(kind){
    case"tick":ctx.lineWidth=o.lw||5;L([[-15,1],[-4,12],[16,-12]]);break;
    case"cross":ctx.lineWidth=o.lw||5;L([[-12,-12],[12,12]]);L([[12,-12],[-12,12]]);break;
    case"warn":ctx.beginPath();ctx.moveTo(0,-19);ctx.lineTo(20,16);ctx.lineTo(-20,16);ctx.closePath();ctx.stroke();L([[0,-6],[0,5]]);F(0,11,2.6);break;
    case"dash":ctx.lineWidth=o.lw||5;L([[-13,0],[13,0]]);break;
    case"pause":ctx.lineWidth=o.lw||5.4;L([[-6,-12],[-6,12]]);L([[6,-12],[6,12]]);break;
    case"clock":O(0,0,18);L([[0,-10],[0,0],[8,6]]);break;
    case"calendar":R(-18,-14,36,32,4);L([[-18,-4],[18,-4]]);L([[-9,-20],[-9,-10]]);L([[9,-20],[9,-10]]);F(-7,6,2.6);F(2,6,2.6);F(11,6,2.6);break;
    case"person":O(0,-9,8);ctx.beginPath();ctx.moveTo(-15,18);ctx.quadraticCurveTo(-14,3,0,3);ctx.quadraticCurveTo(14,3,15,18);ctx.stroke();break;
    case"people":O(-8,-9,7);O(10,-6,6);ctx.beginPath();ctx.moveTo(-21,18);ctx.quadraticCurveTo(-20,4,-8,4);ctx.quadraticCurveTo(4,4,5,18);ctx.stroke();ctx.beginPath();ctx.moveTo(9,5);ctx.quadraticCurveTo(20,5,21,16);ctx.stroke();break;
    case"form":ctx.beginPath();ctx.moveTo(-14,-20);ctx.lineTo(7,-20);ctx.lineTo(14,-13);ctx.lineTo(14,20);ctx.lineTo(-14,20);ctx.closePath();ctx.stroke();R(-8,-10,16,7,1.5);L([[-8,4],[8,4]]);L([[-8,12],[3,12]]);break;
    case"card":R(-20,-14,40,28,3);L([[-13,-5],[13,-5]]);L([[-13,3],[13,3]]);L([[-13,10],[3,10]]);break;
    case"table":R(-18,-15,36,30,4);L([[-18,-5],[18,-5]]);L([[-18,5],[18,5]]);L([[-4,-15],[-4,15]]);break;
    case"lens":O(-4,-4,12);L([[5,5],[17,17]]);break;
    case"list":for(const yy of [-11,0,11]){F(-14,yy,2.6);L([[-6,yy],[16,yy]]);}break;
    case"printer":R(-12,-20,24,12,2);R(-20,-8,40,18,4);ctx.beginPath();ctx.rect(-12,4,24,16);ctx.save();ctx.fillStyle="rgba(255,255,255,0)";ctx.restore();ctx.stroke();L([[-7,11],[7,11]]);L([[-7,16],[4,16]]);break;
    case"certificate":R(-20,-15,40,26,2);L([[-12,-6],[12,-6]]);L([[-12,1],[6,1]]);O(10,13,6);L([[6,18],[4,24]]);L([[14,18],[16,24]]);break;
    case"cap":ctx.beginPath();ctx.moveTo(-22,-6);ctx.lineTo(0,-16);ctx.lineTo(22,-6);ctx.lineTo(0,4);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(-12,10);ctx.quadraticCurveTo(0,18,12,10);ctx.lineTo(12,0);ctx.stroke();L([[18,-4],[18,10]]);break;
    case"seat":L([[-10,-18],[-10,4],[12,4]]);L([[-10,4],[-12,18]]);L([[12,4],[14,18]]);L([[-10,-18],[-4,-18]]);break;
    case"programme":ctx.beginPath();ctx.moveTo(0,-14);ctx.quadraticCurveTo(-10,-20,-20,-16);ctx.lineTo(-20,16);ctx.quadraticCurveTo(-10,12,0,18);ctx.quadraticCurveTo(10,12,20,16);ctx.lineTo(20,-16);ctx.quadraticCurveTo(10,-20,0,-14);ctx.closePath();ctx.stroke();L([[0,-14],[0,18]]);break;
    case"count":for(const xx of [-14,-6,2,10])L([[xx,-14],[xx,14]]);L([[-19,10],[16,-10]]);break;
    case"building":L([[-20,18],[20,18]]);ctx.beginPath();ctx.moveTo(-20,-8);ctx.lineTo(0,-20);ctx.lineTo(20,-8);ctx.closePath();ctx.stroke();for(const xx of [-13,-4,4,13])L([[xx,-3],[xx,12]]);break;
    case"link":ctx.save();ctx.rotate(-Math.PI/4);R(-20,-7,22,14,7);R(-2,-7,22,14,7);ctx.restore();break;
    case"why":ctx.lineWidth=o.lw||4.4;ctx.beginPath();ctx.arc(0,-6,10,Math.PI*1.05,Math.PI*2.25);ctx.quadraticCurveTo(0,0,0,7);ctx.stroke();F(0,15,2.8);break;
    case"flag":L([[-14,20],[-14,-18]]);ctx.beginPath();ctx.moveTo(-14,-18);ctx.quadraticCurveTo(0,-24,16,-16);ctx.lineTo(16,2);ctx.quadraticCurveTo(0,-6,-14,0);ctx.stroke();break;
    case"mail":R(-20,-14,40,28,3);L([[-19,-12],[0,3],[19,-12]]);break;
    case"chat":ctx.beginPath();ctx.moveTo(-18,-14);ctx.lineTo(18,-14);ctx.quadraticCurveTo(22,-14,22,-10);ctx.lineTo(22,6);ctx.quadraticCurveTo(22,10,18,10);ctx.lineTo(-2,10);ctx.lineTo(-12,19);ctx.lineTo(-11,10);ctx.lineTo(-18,10);ctx.quadraticCurveTo(-22,10,-22,6);ctx.lineTo(-22,-10);ctx.quadraticCurveTo(-22,-14,-18,-14);ctx.closePath();ctx.stroke();break;
    case"gauge":ctx.beginPath();ctx.arc(0,6,19,Math.PI,0);ctx.stroke();L([[0,6],[10,-8]]);F(0,6,3);break;
    case"band":L([[-21,6],[21,6]]);for(const xx of [-21,-7,7,21])L([[xx,2],[xx,10]]);ctx.lineWidth=7;ctx.globalAlpha*=0.45;L([[-9,-6],[9,-6]]);ctx.globalAlpha/=0.45;ctx.lineWidth=o.lw||3.6;L([[3,-14],[3,0]]);break;
    case"tag":ctx.beginPath();ctx.moveTo(-20,0);ctx.lineTo(-10,-11);ctx.lineTo(20,-11);ctx.lineTo(20,11);ctx.lineTo(-10,11);ctx.closePath();ctx.stroke();O(-9,0,3.5);break;
    case"lock":ctx.beginPath();ctx.arc(0,-7,10,Math.PI,0);ctx.stroke();rr(ctx,-15,-6,30,24,5);ctx.fill();break;
    case"refresh":ctx.beginPath();ctx.arc(0,0,15,-0.6,Math.PI*1.45);ctx.stroke();ctx.beginPath();ctx.moveTo(15,-16);ctx.lineTo(14,-4);ctx.lineTo(3,-8);ctx.closePath();ctx.fill();break;
    case"hourglass":L([[-13,-19],[13,-19]]);L([[-13,19],[13,19]]);ctx.beginPath();ctx.moveTo(-10,-19);ctx.quadraticCurveTo(-10,-4,0,0);ctx.quadraticCurveTo(10,4,10,19);ctx.moveTo(10,-19);ctx.quadraticCurveTo(10,-4,0,0);ctx.quadraticCurveTo(-10,4,-10,19);ctx.stroke();break;
    case"sheet":R(-20,-16,40,32,3);L([[-20,-6],[20,-6]]);L([[-20,4],[20,4]]);L([[-6,-16],[-6,16]]);L([[7,-16],[7,16]]);break;
    case"tools":R(-20,-16,40,32,4);L([[-20,-6],[20,-6]]);F(-14,-11,1.8);F(-8,-11,1.8);L([[-12,4],[-4,10],[-12,16]].map(p=>[p[0],p[1]-3]));L([[2,13],[12,13]]);break;
  }
  ctx.restore();}

/* ===== Data quality: the people =====
   The people are the agent films' (films/what-an-agent-is/shared/src/people.js, bundled as it is): an adult's proportions, one
   three-quarter head (AG_FACE), arms down, a hand only on the thing the story is about (pose "hold"), a person who fades drawn whole
   first, then faded as one picture. The quality bench is lit as the agent films' lab is, from a window on the right, so they stand in
   it as they are; behind the bench, a person is cut at its back edge (o.cut = DQ_BENCH.back), and the bench hides the hanging arms.

   dq_person(ctx, who, x, y, s, o) draws a person as ag_person does (the same x, y, s and o: t, flip, pose, hold, front, nod, gaze,
   talk, smile, cut, covered), and returns the hands as it does. who is a name in DQ_CAST (this module's people) or in the agent films'
   cast ("mei", "jun", "sam", "noor", "yusuf" and the others), or a spec of someone else (see people.js there; who.over(c, P) paints
   something worn over the whole person in figure space, as the gown's hood is). o.warm (0 to 1) lays
   the hall's warm light over them, for the Great Hall: the side away from the stage lights a little darker, the face a little warmer.
   dq_nameTag(ctx, x, y, who, o) writes a person's name and the line under it (their role): o.align, o.role, o.name, o.col (a colour
   that means something, for the small bar beside it; none by default), o.dark (on the granite or the hall's oak), o.a. */

/* ---------------------------------------------------------------- the cast this module adds
   As the module's plan sets them: Malia Fonoti, the graduations officer, who runs the ceremonies and sends the list to the printer,
   its main user; Andrés Peñaloza, a graduate, Master of Data Analytics, the person the data is about, and, at the ceremony, Andrés in
   his gown ("andresGown": a plain black academic gown, its hood lined in his award's colour, no cap). Mei Tanaka (the registrar's
   office), Jun Park, Sam Okafor, Noor Rahman and Yusuf Demir are the agent films' (AG_CAST). Their clothes wear none of the module's
   six colours. Each was looked at full size, facing both ways, on 5 November 2026. The voice says them as film.json's say has it:
   ["\\bMalia\\b", "Mah-lee-ah"], ["\\bFonoti\\b", "Fo-no-tee"], ["\\bAndr(é|e)s\\b", "Ahn-dress"], ["\\bPe(ñ|n)aloza\\b",
   "Pen-yah-lo-sah"], with the agent films' ["\\bMei\\b", "May"] and ["\\bJun\\b", "Joon"]. Andrés's student number may appear in
   the data, never next to his face. */
const DQ_HOOD=[112,74,150];   // the hood's lining for the Master of Data Analytics: amethyst, which means nothing else in these films
// the hood, worn over the gown: its neckband turned out to show its lining, lying along the gown's opening on both sides and meeting in a
// point on the chest; drawn over the person in figure space (the body's own neckline would paint over anything painted with it), and
// faded with them as one picture
function dq_hood(c,P){const col=P.top.hood||DQ_HOOD,gown=P.top.c;c.save();ag_shape(c,AG_F.torso);c.clip();
  // the gown's facings: darker bands along both edges of its opening, below the hood
  c.fillStyle=rgba(ag_dk(gown,0.45),0.9);c.beginPath();c.moveTo(286,760);c.bezierCurveTo(296,860,304,980,308,1100);c.lineTo(282,1100);c.bezierCurveTo(278,990,272,880,262,780);c.closePath();c.fill();
  c.beginPath();c.moveTo(336,770);c.bezierCurveTo(330,870,322,990,318,1100);c.lineTo(344,1100);c.bezierCurveTo(350,990,356,880,360,780);c.closePath();c.fill();
  // the hood's lining, turned out over both shoulders, broad, framing the neck and meeting in a point on the chest
  ag_soft(c,cc=>{cc.moveTo(170,604);cc.bezierCurveTo(196,586,214,574,230,566);cc.bezierCurveTo(244,626,270,700,312,792);cc.lineTo(311,812);cc.bezierCurveTo(264,742,214,672,170,604);cc.closePath();},
    col,ag_lt(col,0.36),300,640,150,rgba(ag_dk(col,0.6),0.45),10);
  ag_soft(c,cc=>{cc.moveTo(362,600);cc.bezierCurveTo(384,606,404,616,420,628);cc.bezierCurveTo(380,690,342,756,311,812);cc.lineTo(312,792);cc.bezierCurveTo(334,736,350,670,362,600);cc.closePath();},
    ag_dk(col,0.12),ag_lt(col,0.22),330,640,130,rgba(ag_dk(col,0.65),0.45),10);
  // the hood's black edge along the lining's outer side, where it turns over the shoulders
  c.strokeStyle=rgba(ag_dk(gown,0.3),0.8);c.lineWidth=4.5;c.lineCap="round";c.beginPath();c.moveTo(172,606);c.bezierCurveTo(214,672,264,742,310,810);c.stroke();
  c.beginPath();c.moveTo(418,630);c.bezierCurveTo(380,690,342,756,312,810);c.stroke();
  c.restore();}
const DQ_CAST={
  malia:{name:"Malia Fonoti",role:"Graduations officer",skin:[166,112,80],hair:{style:"long",c:[30,22,20]},glasses:[92,62,52],earrings:[232,224,210],
    top:{kind:"blazer",c:[104,70,92],inner:[240,234,226]},breath:0.28},
  andres:{name:"Andrés Peñaloza",role:"Graduate, Master of Data Analytics",skin:[206,156,118],hair:{style:"side",c:[34,26,22]},top:{kind:"sweater",c:[50,54,70]},breath:0.3},
  andresGown:{key:"andresGown",name:"Andrés Peñaloza",role:"Graduate, Master of Data Analytics",skin:[206,156,118],hair:{style:"side",c:[34,26,22]},
    top:{kind:"suit",c:[30,29,33],inner:[238,238,240],tie:[58,62,80],hood:DQ_HOOD},over:dq_hood,breath:0.3}
};
const dq_who=who=>typeof who==="string"&&DQ_CAST[who]?DQ_CAST[who]:who;

/* ---------------------------------------------------------------- a person in the room */
function dq_person(ctx,who,x,y,s,o){o=o||{};const P=dq_who(who),w=o.warm||0;if(!(w>0)&&!P.over)return ag_person(ctx,P,x,y,s,o);
  const a=ctx.globalAlpha;if(a<0.004)return null;const A=AG_FIG.anchor,m=ctx.getTransform(),M=m.translate(x,y).scale(o.flip?-s:s,s).translate(-A[0],-A[1]),cw=ctx.canvas.width,ch=ctx.canvas.height;
  const pt=(fx,fy)=>[M.a*fx+M.c*fy+M.e,M.b*fx+M.d*fy+M.f];let L=1e9,R=-1e9,T0=1e9,B=-1e9;for(const [fx,fy] of [[-260,120],[820,120],[-260,1160],[820,1160]]){const q=pt(fx,fy);L=Math.min(L,q[0]);R=Math.max(R,q[0]);T0=Math.min(T0,q[1]);B=Math.max(B,q[1]);}
  L=Math.max(0,Math.floor(L));T0=Math.max(0,Math.floor(T0));R=Math.min(cw,Math.ceil(R));B=Math.min(ch,Math.ceil(B));if(R<=L||B<=T0)return null;const ww=R-L,hh=B-T0;
  const [pc,px]=ag_buf("dqPerson",cw,ch);px.setTransform(m);let hands;try{hands=ag_person(px,P,x,y,s,Object.assign({},o,{warm:undefined}));
    // what this module wears over a person (the gown's hood), in figure space, breathing with the body and cut where the body is
    if(P.over){const br=Math.sin((o.t||0)*TAU/(P.breath?1/P.breath:3.6))*2.2;px.save();px.translate(x,y);px.scale(o.flip?-s:s,s);px.translate(-A[0],-A[1]);px.translate(0,br);
      if(o.cut!=null){px.beginPath();px.rect(-4000,-4000,9000,4000+A[1]+(o.cut-y)/s-br);px.clip();}P.over(px,P);px.restore();}}
  finally{px.setTransform(1,0,0,1,0,0);px.globalAlpha=1;}
  // the hall's light: from the stage lights in front, a little above; the far side and the body below the chest a little darker
  const K=pt(520,380),rad=820*Math.hypot(M.a,M.b);px.globalCompositeOperation="source-atop";if(w>0){
  let g=px.createRadialGradient(K[0],K[1],0,K[0],K[1],rad);g.addColorStop(0,"rgba(255,214,168,"+(0.1*w)+")");g.addColorStop(0.5,"rgba(60,30,16,"+(0.16*w)+")");g.addColorStop(1,"rgba(40,20,10,"+(0.34*w)+")");px.fillStyle=g;px.fillRect(L,T0,ww,hh);
  const c0=pt(300,720),c1=pt(300,1100);g=px.createLinearGradient(c0[0],c0[1],c1[0],c1[1]);g.addColorStop(0,"rgba(30,14,6,0)");g.addColorStop(1,"rgba(30,14,6,"+(0.3*w)+")");px.fillStyle=g;px.fillRect(L,T0,ww,hh);}
  px.globalCompositeOperation="source-over";ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(pc,L,T0,ww,hh,L,T0,ww,hh);ctx.restore();return hands;}

// a person's name and the line under it (their role); o.col, a small bar in a colour that means something
function dq_nameTag(ctx,x,y,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const P_=typeof who==="string"?(DQ_CAST[who]||AG_CAST[who]):who,
    name=o.name||(P_&&P_.name)||String(who),role=o.role!=null?o.role:(P_&&P_.role)||"",al=o.align||"left",dk=!!o.dark;
  ctx.save();ctx.globalAlpha*=a;const nw=dq_tw(ctx,name,{w:800,size:32}),rw2=role?dq_tw(ctx,role,{w:600,size:28}):0,ww=Math.max(nw,rw2),x0=al==="center"?x-ww/2:al==="right"?x-ww:x;
  if(o.col){ctx.fillStyle=rgba(dq_col(o.col,dk),1);rr(ctx,x0-20,y-28,6,role?70:34,3);ctx.fill();}
  dq_T(ctx,name,x0,y,{w:800,size:32,dark:dk});if(role)dq_T(ctx,role,x0,y+38,{w:600,size:28,col:dk?DQ.chalkSoft:DQ.soft});ctx.restore();}

/* ===== Data quality: paper cards, records, tags, gauges, the kicker, the mark, and the title and end cards =====
   Everything on the bench is paper or an instrument. Cards are cream card stock with a soft shadow (falling a little to the left and
   down: the window is on the right), opaque, so words on them read at 6:1 or more; an edge in a colour only when the colour means
   something (look.js: a verdict, brass for the requirement, steel for a measure). o.on says what they lie on or stand before: "wall"
   (the default, a soft warm shadow) or "granite" (a deeper one). Words on cards: a kicker in capitals, 28 px, letter-spaced; a title,
   36 px; a line under it, 28 px, soft; what is typed (a record's values, code) in the mono face.
     dq_card(ctx, x, y, w, h, o)        a card: o.edge (a meaning's name or a colour), o.r (corner, 8), o.a, o.on, o.ruled (an index card's
                                        faint rules, every o.ruled px), o.dash (an outline only: a card that isn't there yet, or is missing)
     dq_textCard(ctx, x, y, w, words, o) words {kick, title, sub}: a card that fits them; o.edge, o.kickCol, o.icon (a dq_icon kind, at the
                                        top right), o.mono (the title typed), o.a, o.k (springs from its centre, 0 to 1), o.measure; returns
                                        {x, y, w, h}
     dq_record(ctx, x, y, w, rec, o)    a record, typed on an index card: rec {head, id, rows: [{k, v, mark, was, note}]}: each row a field's
                                        name and its value (typed), mark a verdict ("pass", "hold", "stop", "none") in a small round stamp at
                                        its right, was an old value struck through before the new one; o.lit (a row's index, or several: a
                                        pale band behind it, and o.litCol a bar in a colour that means something), o.rowA(row, i) (rows coming
                                        in one by one), o.labW, o.k, o.a, o.on; it grows to fit its
                                        longest value unless o.fixed; returns {x, y, w, h, rows: [{y, cy}]} (w as drawn), for a tag's string
     dq_tag(ctx, x, y, verdict, o)      a result: a tag in the verdict's colour, hanging from its eyelet at (x, y), tied on with string to
                                        o.to ([x, y]); verdict may also be "brass" (a requirement, such as a due date) or "steel" (a
                                        measure), with o.text, its words in ink or white, whichever reads; o.text (its words, the
                                        verdict's by default), o.icon (false for none), o.size (30), o.angle (its tilt, radians), o.flip
                                        (hangs to the left), o.k (springs from the eyelet), o.a; returns {x, y, w, h}
     dq_chip(ctx, x, y, text, o)        a small outlined label: a use, a dimension, a column, an owner; o.col (a meaning, for the words and
                                        the edge), o.icon, o.align ("left" or "center"), o.size (28), o.fill, o.a; returns {x, y, w, h}
     dq_band(ctx, x, y, w, o)           the tolerance band, the inspector's scale, on a card of its own from (x, y), w wide: o.min, o.max
                                        (the scale), o.lo, o.hi (the allowed range, brass: what good means for this use), o.v (the measure,
                                        a steel pointer), o.u (0 to 1, the brass draws on), o.vu (0 to 1, the pointer travels from o.min to
                                        o.v), o.ticks (the scale's steps), o.numEvery, o.nums (false: none), o.fmt (a value as words),
                                        o.label (the card's heading), o.vText (over the pointer), o.loText, o.hiText (under the band's
                                        ends), o.edge, o.on, o.k, o.a; returns {x, y, w, h, px} (px: the pointer's x)
     dq_dial(ctx, cx, cy, r, o)         a dial gauge: o.min, o.max, o.lo, o.hi (the brass arc), o.v and o.vu (the steel needle), o.ticks,
                                        o.nums (the numbers round the face, at r 170 or more), o.read (the reading, under the hub), o.label
                                        (under the gauge), o.sweep (its arc, 240 degrees), o.a, o.k
     dq_figure(ctx, x, y, value, label, o) a big number and its line: o.col (a meaning), o.size (120), o.align, o.dark, o.a
     dq_kicker(ctx, num, title, o)      the film's chapter number and title at the top left (o.dark on the granite or in the hall)
     dq_mark(ctx, cx, cy, r, p, a)      the module's mark: a small dial whose brass range draws itself, then its steel needle swings and
                                        settles inside it: a measure that meets what good means for its use
     dq_veil(ctx, S, a)                 the granite's dark laid over the frame, for the title and end cards
     dq_title(ctx, S, t, t0, title, sub, line)          the title card from t0
     dq_end(ctx, S, t, t0, title, line, n, series)     the end card from t0: the film's line, the mark, the title,
                                        "Film 1 of 4 · Fit for use · Learning Data" */

const DQ_PAD=28;
function dq_shadow(ctx,on,k){k=k==null?1:k;if(on==="granite"){ctx.shadowColor="rgba(0,0,0,"+(0.55*k)+")";ctx.shadowBlur=26;ctx.shadowOffsetX=-7;ctx.shadowOffsetY=10;}
  else{ctx.shadowColor="rgba(64,46,28,"+(0.3*k)+")";ctx.shadowBlur=24;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;}}
function dq_card(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const r=o.r==null?8:o.r,e=o.edge?dq_tone(o.edge).col:null;ctx.save();ctx.globalAlpha*=a;
  if(o.dash){ctx.lineWidth=o.lw||2.6;ctx.setLineDash(o.dash===true?[12,10]:o.dash);ctx.strokeStyle=e?rgba(e,0.95):o.on==="granite"?rgba(DQ.chalkSoft,0.8):rgba(DQ.soft,0.7);rr(ctx,x,y,w,h,r);ctx.stroke();ctx.restore();return;}
  dq_shadow(ctx,o.on);rr(ctx,x,y,w,h,r);ctx.fillStyle=o.fill||rgba(DQ.paper,1);ctx.fill();ctx.shadowColor="transparent";ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
  // card stock: a touch lighter at the top, where the window's light falls, and a fine darker edge
  const g=ctx.createLinearGradient(x,y,x+w*0.3,y+h);g.addColorStop(0,"rgba(255,255,255,0.32)");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(120,96,64,0.06)");ctx.fillStyle=g;rr(ctx,x,y,w,h,r);ctx.fill();
  if(o.ruled){ctx.save();rr(ctx,x,y,w,h,r);ctx.clip();ctx.fillStyle="rgba(120,104,84,0.16)";for(let yy=y+(o.ruleTop||o.ruled);yy<y+h-6;yy+=o.ruled)ctx.fillRect(x+16,yy,w-32,1.5);ctx.restore();}
  ctx.lineWidth=e?3:1.2;ctx.strokeStyle=e?rgba(e,0.95):"rgba(110,90,66,0.28)";rr(ctx,x+(e?1.5:0.5),y+(e?1.5:0.5),w-(e?3:1),h-(e?3:1),r);ctx.stroke();ctx.restore();}
function dq_textCard(ctx,x,y,w,words,o){o=o||{};const inner=w-DQ_PAD*2-(o.icon?56:0),tf={w:700,size:36,f:o.mono?"mono":undefined},tl=words.title?dq_wrap(ctx,words.title,inner,tf):[],sl=words.sub?dq_wrap(ctx,words.sub,w-DQ_PAD*2,{w:500,size:28}):[];
  const h=DQ_PAD+(words.kick?40:0)+tl.length*46+sl.length*38+DQ_PAD-(words.kick?0:6)+(tl.length||sl.length?0:-10),bb={x,y,w,h};if(o.measure)return bb;
  const a=o.a==null?1:o.a;if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:o.edge,on:o.on,dash:o.dash});const kc=o.kickCol||(o.edge?dq_tone(o.edge).word:DQ.soft);let yy=y+DQ_PAD+24;
  if(words.kick){dq_T(ctx,String(words.kick).toUpperCase(),x+DQ_PAD,yy,{w:800,size:28,ls:4,col:kc});yy+=18;}else yy-=24;
  for(const l of tl){yy+=46;dq_T(ctx,l,x+DQ_PAD,yy,Object.assign({col:DQ.ink},tf));}
  for(const l of sl){yy+=38;dq_T(ctx,l,x+DQ_PAD,yy,{w:500,size:28,col:DQ.soft});}
  if(o.icon)dq_icon(ctx,o.icon,x+w-DQ_PAD-20,y+DQ_PAD+20,42,o.edge?dq_tone(o.edge).word:DQ.ink);
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- a record, typed on an index card */
function dq_stampMark(ctx,cx,cy,m,r){const V=DQ_VERDICT[m];if(!V)return;ctx.save();if(m==="none"){ctx.strokeStyle=rgba(DQ_TONE.none.word,1);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(cx,cy,r-1.2,0,TAU);ctx.stroke();dq_icon(ctx,"dash",cx,cy,r*1.1,DQ_TONE.none.word,{lw:4.4});ctx.restore();return;}
  ctx.fillStyle=rgba(V.col,1);ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();dq_icon(ctx,V.icon,cx,cy,r*1.15,V.ink,{lw:5.6});ctx.restore();}
function dq_record(ctx,x,y,w,rec,o){o=o||{};const rows=rec.rows||[],rh=o.rh||58,head=rec.head||rec.id?70:20,h=head+rows.length*rh+22,
    labW=o.labW||Math.max(0,...rows.map(r=>dq_tw(ctx,r.k||"",{w:600,size:28})))+30,vf={w:500,size:30,f:"mono"},
    // the card grows to fit its longest value (a long value never runs out of its card), unless o.fixed
    need=DQ_PAD*2+labW+Math.max(0,...rows.map(r=>dq_tw(ctx,r.v==null?"":String(r.v),vf)+(r.was!=null?dq_tw(ctx,r.was,vf)+60:0)+(r.mark?56:0))),
    hd=rec.head||rec.id?dq_tw(ctx,String(rec.head||"").toUpperCase(),{w:800,size:28,ls:3.5})+dq_tw(ctx,rec.id||"",{w:500,size:28,f:"mono"})+DQ_PAD*2+40:0;
  if(!o.fixed)w=Math.max(w,need,hd);const bb={x,y,w,h,rows:[]};
  rows.forEach((r,i)=>bb.rows.push({y:y+head+i*rh,cy:y+head+i*rh+rh/2}));const a=o.a==null?1:o.a;if(a<=0.004)return bb;
  const lits=o.lit==null?[]:[].concat(o.lit);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:o.edge,on:o.on});
  if(rec.head)dq_T(ctx,String(rec.head).toUpperCase(),x+DQ_PAD,y+46,{w:800,size:28,ls:3.5,col:DQ.soft});
  if(rec.id)dq_T(ctx,rec.id,x+w-DQ_PAD,y+46,{w:500,size:28,f:"mono",col:DQ.soft,align:"right"});
  if(head>20){ctx.fillStyle="rgba(120,96,70,0.5)";ctx.fillRect(x+16,y+head-4,w-32,2.2);}
  rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(r,i):1;if(ra<=0.004)return;const ry=y+head+i*rh,cy=ry+rh/2;ctx.save();ctx.globalAlpha*=ra;
    if(lits.includes(i)){ctx.fillStyle="rgba(196,172,128,0.22)";ctx.fillRect(x+10,ry+4,w-20,rh-8);if(o.litCol){ctx.fillStyle=rgba(dq_tone(o.litCol).col,1);ctx.fillRect(x+10,ry+4,6,rh-8);}}
    ctx.fillStyle="rgba(120,104,84,0.2)";ctx.fillRect(x+16,ry+rh-1,w-32,1.4);
    dq_T(ctx,r.k||"",x+DQ_PAD,cy+10,{w:600,size:28,col:DQ.soft});let vx=x+DQ_PAD+labW;
    if(r.was!=null){const ww=dq_tw(ctx,r.was,{w:500,size:30,f:"mono"});dq_T(ctx,r.was,vx,cy+10,{w:500,size:30,f:"mono",col:DQ.soft});ctx.fillStyle=rgba(DQ.stop,0.9);ctx.fillRect(vx-4,cy-1,ww+8,3);vx+=ww+22;
      ctx.strokeStyle=rgba(DQ.soft,1);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(vx,cy);ctx.lineTo(vx+22,cy);ctx.moveTo(vx+14,cy-7);ctx.lineTo(vx+22,cy);ctx.lineTo(vx+14,cy+7);ctx.stroke();vx+=38;}
    dq_T(ctx,r.v==null?"":String(r.v),vx,cy+10,{w:500,size:30,f:"mono",col:r.col?dq_col(r.col):DQ.ink});
    if(r.mark)dq_stampMark(ctx,x+w-DQ_PAD-14,cy,r.mark,17);
    ctx.restore();});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- a result: a tag tied on with string */
function dq_tagShape(ctx,L,T0,w,h){const c=h*0.3;ctx.beginPath();ctx.moveTo(L,T0+c);ctx.lineTo(L+c,T0);ctx.lineTo(L+w,T0);ctx.lineTo(L+w,T0+h);ctx.lineTo(L+c,T0+h);ctx.lineTo(L,T0+h-c);ctx.closePath();}
// the words on a tag of another colour (brass, a requirement such as a due date; steel, a measure): ink on a light colour, white on a dark one
const dq_inkOn=c=>{const L=v=>Math.pow(v/255,2.2);return 0.2126*L(c[0])+0.7152*L(c[1])+0.0722*L(c[2])>0.2?DQ.ink:[255,255,255];};
function dq_tag(ctx,x,y,verdict,o){o=o||{};const V=DQ_VERDICT[verdict]||{col:dq_tone(verdict).col,text:"",ink:dq_inkOn(dq_tone(verdict).col),icon:null},size=o.size||30,h=Math.round(size*1.9),text=o.text!=null?o.text:V.text,
    icon=o.icon===false?null:(o.icon||V.icon),tx0=h*0.84+(icon?size*1.3:0),w=Math.round(tx0+dq_tw(ctx,text,{w:800,size,ls:3})+h*0.42),e=h*0.42,a=o.a==null?1:o.a,bb={x:o.flip?x-w+e:x-e,y:y-h/2,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  // the string, from where it's tied to the eyelet, sagging a little
  if(o.to){const [tx,ty]=o.to,d=Math.hypot(tx-x,ty-y),mx=(tx+x)/2,my=(ty+y)/2+Math.min(60,d*0.14+8),su=o.k==null?1:sstep(0,0.5,o.k);
    ctx.lineCap="round";for(const [lw,col] of [[4.6,"rgba(96,74,44,0.5)"],[2.6,rgba(DQ.string,1)]]){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(tx,ty);ctx.quadraticCurveTo(lerp(tx,mx,su),lerp(ty,my,su),lerp(tx,x,su),lerp(ty,y,su));ctx.stroke();}
    if(su<1){ctx.restore();return bb;}}
  ctx.translate(x,y);if(o.k!=null){const k=lerp(0.4,1,ag_spr(o.k,0.25,0.7));ctx.scale(k,k);}ctx.rotate((o.angle==null?0.06:o.angle)*(o.flip?-1:1));if(o.flip)ctx.scale(-1,1);
  const L=-e,T0=-h/2;ctx.save();dq_shadow(ctx,o.on,0.8);ctx.shadowBlur=12;dq_tagShape(ctx,L,T0,w,h);ctx.fillStyle=rgba(V.col,1);ctx.fill();ctx.restore();
  let g=ctx.createLinearGradient(0,T0,0,T0+h);g.addColorStop(0,"rgba(255,255,255,0.16)");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(0,0,0,0.08)");dq_tagShape(ctx,L,T0,w,h);ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle=rgba(ag_dk(V.col,0.35),0.7);ctx.lineWidth=1.4;dq_tagShape(ctx,L,T0,w,h);ctx.stroke();
  // the eyelet: a ring of cream card, and its hole
  ctx.fillStyle=rgba(DQ.paper,1);ctx.beginPath();ctx.arc(0,0,h*0.2,0,TAU);ctx.fill();ctx.strokeStyle="rgba(110,90,66,0.4)";ctx.lineWidth=1.2;ctx.stroke();
  ctx.fillStyle="rgba(34,26,20,0.85)";ctx.beginPath();ctx.arc(0,0,h*0.095,0,TAU);ctx.fill();
  if(o.to){ctx.strokeStyle=rgba(DQ.string,1);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-h*0.36,-h*0.1,L+h*0.06,-h*0.02);ctx.stroke();}
  if(o.flip)ctx.scale(-1,1);const tx=o.flip?-(L+w)+h*0.42:L+tx0;
  if(icon)dq_icon(ctx,icon,(o.flip?tx:L+h*0.84)+size*0.5,0,size*1.05,V.ink,{lw:icon==="tick"||icon==="cross"||icon==="dash"||icon==="pause"?5.6:4.2});
  dq_T(ctx,text,o.flip?tx+(icon?size*1.3:0):tx,size*0.36,{w:800,size,ls:3,col:V.ink});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- a small label */
function dq_chip(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||28,col=o.col?dq_tone(o.col):null,icon=o.icon,w=dq_tw(ctx,text,{w:700,size})+(icon?84:44),h=size+26,bx=o.align==="center"?x-w/2:x,by=y-h/2;
  if(a<=0.004)return{x:bx,y:by,w,h};ctx.save();ctx.globalAlpha*=a;
  ctx.save();dq_shadow(ctx,o.on,0.45);ctx.shadowBlur=10;rr(ctx,bx,by,w,h,h/2);ctx.fillStyle=o.fill||rgba(DQ.paper,1);ctx.fill();ctx.restore();
  ctx.lineWidth=col?2.4:1.4;ctx.strokeStyle=col?rgba(col.col,1):"rgba(110,90,66,0.45)";rr(ctx,bx+1,by+1,w-2,h-2,h/2);ctx.stroke();
  if(icon)dq_icon(ctx,icon,bx+36,y,30,col?col.word:DQ.ink);dq_T(ctx,text,bx+(icon?62:22),y+size*0.36,{w:700,size,col:col?col.word:DQ.ink});ctx.restore();return{x:bx,y:by,w,h};}

/* ---------------------------------------------------------------- the tolerance band
   A card of its own, so it reads on the wall and on the granite: its label, then the measure's value over a steel pointer, the scale
   (a strip inlaid in the card, its ticks along the bottom), its numbers, and the allowed range in brass across the scale, with its
   limits' words under it. */
function dq_band(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,mn=o.min==null?0:o.min,mx=o.max==null?100:o.max,x0s=x+DQ_PAD+18,ws=w-2*DQ_PAD-36,X=v=>x0s+clamp((v-mn)/(mx-mn),0,1)*ws,
    fmt=o.fmt||(v=>String(v)),sy=y+(o.vText?132:96),sh=52,ny=sy+sh+40,ly=ny+44,h=(o.loText||o.hiText?ly:ny)+30-y,bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on,edge:o.edge});if(o.label)dq_label(ctx,x+DQ_PAD,y+50,o.label,{size:28});
  // the scale: a strip inlaid in the card, its ticks, its numbers
  ctx.fillStyle="rgba(120,96,64,0.1)";rr(ctx,x0s-18,sy,ws+36,sh,8);ctx.fill();ctx.strokeStyle="rgba(110,90,66,0.3)";ctx.lineWidth=1.2;rr(ctx,x0s-18,sy,ws+36,sh,8);ctx.stroke();
  const steps=o.ticks||10;ctx.fillStyle=rgba(DQ.ink,0.85);for(let i=0;i<=steps*5;i++){const tx=x0s+ws*i/(steps*5),big=i%5===0;ctx.fillRect(tx-(big?1.3:0.7),sy+sh-(big?22:11),big?2.6:1.4,big?22:11);}
  if(o.nums!==false)for(let i=0;i<=steps;i+=o.numEvery||Math.max(1,Math.round(steps/5)))dq_T(ctx,fmt(lerp(mn,mx,i/steps)),x0s+ws*i/steps,ny,{w:600,size:28,align:"center",col:DQ.soft});
  // the allowed range, in brass: what good means for this use
  if(o.lo!=null&&o.hi!=null){const u=o.u==null?1:clamp(o.u,0,1),b0=X(o.lo),b1=X(o.hi),bm=(b0+b1)/2,l0=lerp(bm,b0,ag_sine(u)),l1=lerp(bm,b1,ag_sine(u));if(u>0){
    ctx.fillStyle=rgba(DQ.brass,0.32);ctx.fillRect(l0,sy+3,l1-l0,sh-6);ctx.fillStyle=rgba(DQ.brass,1);for(const lx of [l0,l1])ctx.fillRect(lx-2.5,sy-8,5,sh+16);ctx.fillRect(l0,sy+3,l1-l0,4);
    // the limits' words under the band's ends, or, where the band is narrow, once under its middle ("95 to 100"); always inside the card
    const ta=sstep(0.6,1,u),tf={w:700,size:28},inside=(s_,cx)=>{const tw_=dq_tw(ctx,s_,tf);dq_T(ctx,s_,clamp(cx,x+DQ_PAD+tw_/2,x+w-DQ_PAD-tw_/2),ly,Object.assign({align:"center",col:"brass",a:ta},tf));};
    if(o.loText&&o.hiText&&b1-b0<dq_tw(ctx,o.loText+o.hiText,tf)+80)inside(o.loText+" to "+o.hiText,bm);else{if(o.loText)inside(o.loText,b0);if(o.hiText)inside(o.hiText,b1);}}}
  // the measure: a steel pointer from above, its point on the value, and the value over it
  let px=null;if(o.v!=null){const vu=o.vu==null?1:clamp(o.vu,0,1),v=lerp(mn,o.v,ag_sine(vu));px=X(v);ctx.fillStyle=rgba(DQ.steel,1);
    ctx.beginPath();ctx.moveTo(px,sy+sh*0.55);ctx.lineTo(px-14,sy-6);ctx.lineTo(px+14,sy-6);ctx.closePath();ctx.fill();ctx.fillRect(px-2,sy-26,4,22);ctx.beginPath();ctx.arc(px,sy-28,6.5,0,TAU);ctx.fill();
    if(o.vText){const tw_=dq_tw(ctx,o.vText,{w:800,size:30}),tx=clamp(px,x+DQ_PAD+tw_/2,x+w-DQ_PAD-tw_/2);dq_T(ctx,o.vText,tx,sy-48,{w:800,size:30,align:"center",col:"steel",a:sstep(0.85,1,vu)});}}
  ctx.restore();return Object.assign(bb,{px});}

/* ---------------------------------------------------------------- the dial gauge */
function dq_dial(ctx,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const mn=o.min==null?0:o.min,mx=o.max==null?100:o.max,sw=(o.sweep||240)*Math.PI/180,a0=-Math.PI/2-sw/2,
    A=v=>a0+clamp((v-mn)/(mx-mn),0,1)*sw,steps=o.ticks||10;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,cx,cy,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  // the bezel, graphite and steel; the face, cream
  ctx.save();dq_shadow(ctx,o.on);ctx.fillStyle=rgba(DQ.graphite,1);ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();ctx.restore();
  let g=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);g.addColorStop(0,"#6c6c72");g.addColorStop(0.45,"#3a3a3f");g.addColorStop(0.8,"#8e8e94");g.addColorStop(1,"#4a4a50");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();
  g=ctx.createRadialGradient(cx+r*0.25,cy-r*0.35,0,cx,cy,r*0.9);g.addColorStop(0,"#fdf9f0");g.addColorStop(1,"#ece4d2");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*0.88,0,TAU);ctx.fill();
  // the allowed range, a brass arc inside the ticks
  if(o.lo!=null&&o.hi!=null){const u=o.u==null?1:clamp(o.u,0,1),b0=A(o.lo),b1=A(o.hi),bm=(b0+b1)/2;if(u>0){ctx.strokeStyle=rgba(DQ.brass,1);ctx.lineWidth=r*0.085;ctx.lineCap="butt";ctx.beginPath();ctx.arc(cx,cy,r*0.64,lerp(bm,b0,ag_sine(u)),lerp(bm,b1,ag_sine(u)));ctx.stroke();}}
  ctx.strokeStyle=rgba(DQ.ink,0.88);ctx.lineCap="round";for(let i=0;i<=steps*5;i++){const an=a0+sw*i/(steps*5),big=i%5===0,r0=r*(big?0.71:0.77);ctx.lineWidth=big?Math.max(2,r*0.022):Math.max(1,r*0.01);
    ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);ctx.lineTo(cx+Math.cos(an)*r*0.82,cy+Math.sin(an)*r*0.82);ctx.stroke();}
  if(o.nums&&r>=170){const fmt=o.fmt||(v=>String(v));for(let i=0;i<=steps;i+=o.numEvery||2){const an=a0+sw*i/steps;dq_T(ctx,fmt(lerp(mn,mx,i/steps)),cx+Math.cos(an)*r*0.5,cy+Math.sin(an)*r*0.5+10,{w:600,size:28,align:"center",col:DQ.soft});}}
  if(o.read!=null)dq_T(ctx,String(o.read),cx,cy+r*0.5,{w:800,size:Math.max(30,r*0.2),align:"center",col:o.readCol||"steel"});
  // the needle, steel, with its counterweight, and the hub
  if(o.v!=null){const vu=o.vu==null?1:o.vu,an=lerp(a0,A(o.v),vu),L=r*0.8;ctx.save();ctx.translate(cx,cy);ctx.rotate(an);ctx.shadowColor="rgba(40,30,20,0.3)";ctx.shadowBlur=6;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;
    ctx.fillStyle=rgba(DQ.steel,1);ctx.beginPath();ctx.moveTo(L,0);ctx.lineTo(-r*0.06,-r*0.035);ctx.lineTo(-r*0.2,-r*0.05);ctx.lineTo(-r*0.2,r*0.05);ctx.lineTo(-r*0.06,r*0.035);ctx.closePath();ctx.fill();ctx.restore();}
  g=ctx.createRadialGradient(cx-r*0.02,cy-r*0.03,0,cx,cy,r*0.08);g.addColorStop(0,"#9a9aa0");g.addColorStop(1,"#2e2e33");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*0.075,0,TAU);ctx.fill();
  // the glass: a faint reflection of the window
  g=ctx.createLinearGradient(cx+r*0.2,cy-r*0.9,cx-r*0.3,cy+r*0.2);g.addColorStop(0,"rgba(255,255,255,0.22)");g.addColorStop(0.4,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*0.88,0,TAU);ctx.fill();
  if(o.label)dq_T(ctx,o.label,cx,cy+r+48,{w:700,size:28,align:"center",col:o.dark?DQ.chalk:DQ.ink});
  ctx.restore();}

/* ---------------------------------------------------------------- a big number */
function dq_figure(ctx,x,y,value,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const size=o.size||120,al=o.align||"left",dk=!!o.dark,col=o.col?dq_col(o.col,dk):(dk?DQ.chalk:DQ.ink);
  ctx.save();ctx.globalAlpha*=a;dq_T(ctx,String(value),x,y,{w:800,size,align:al,col});if(label)dq_T(ctx,label,x,y+Math.round(size*0.42)+10,{w:600,size:o.labelSize||30,align:al,col:dk?DQ.chalkSoft:DQ.soft});ctx.restore();}

/* ---------------------------------------------------------------- the kicker, the mark, the title and end cards */
function dq_kicker(ctx,num,title,o){o=o||{};const x=o.x||96,y=o.y||100,a=o.a==null?1:o.a,dk=!!o.dark;if(a<=0.004)return;
  dq_T(ctx,num,x,y,{w:500,size:28,f:"mono",col:dk?DQ.chalk:DQ.ink,a});dq_T(ctx,String(title).toUpperCase(),x+dq_tw(ctx,num,{w:500,size:28,f:"mono"})+24,y,{w:800,size:28,ls:3.5,col:dk?DQ.chalkSoft:DQ.soft,a});}
// the module's mark: a dial; its brass range draws itself, then its steel needle swings up from rest and settles inside it
function dq_mark(ctx,cx,cy,r,p,a){if(a<=0.01)return;p=clamp(p,0,1);const u=ag_sine(p/0.45),n=p<0.35?0:1-Math.exp(-6*(p-0.35)/0.65)*Math.cos(9*(p-0.35)/0.65);
  dq_dial(ctx,cx,cy,r,{min:0,max:10,lo:6,hi:8.6,v:7.3,vu:clamp(n,0,1.08),u,ticks:10,a,on:"granite"});}
function dq_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle="rgba(26,23,21,"+clamp(a,0,1)+")";ctx.fillRect(0,0,W,H);}
function dq_title(ctx,S,t,t0,title,sub,line){const oA=ag_in(t,t0,0.8),tA=ag_in(t,t0+0.5,0.8);if(oA<=0)return;dq_veil(ctx,S,oA*0.92);setScreen(ctx,S);
  withA(ctx,tA,()=>{dq_mark(ctx,960,318,70,(t-t0-0.4)/2.0,1);dq_T(ctx,title,960,528,{w:800,size:84,align:"center",dark:true});
    if(sub)dq_T(ctx,sub,960,606,{w:600,size:36,align:"center",col:DQ.chalkSoft});withA(ctx,ag_in(t,t0+1.2,0.8),()=>{if(line)dq_T(ctx,String(line).toUpperCase(),960,704,{w:800,size:28,ls:3.5,align:"center",col:DQ.chalkSoft});});});}
// n: "Film 1 of 4"; series: the series' name
function dq_end(ctx,S,t,t0,title,line,n,series){const oA=ag_in(t,t0,1.0),tA=ag_in(t,t0+0.6,0.9);if(oA<=0)return;dq_veil(ctx,S,oA*0.93);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)dq_T(ctx,line,960,340,{w:700,size:48,align:"center",dark:true});dq_mark(ctx,960,500,62,(t-t0-0.7)/1.8,1);dq_T(ctx,title,960,660,{w:800,size:44,align:"center",dark:true});
    dq_T(ctx,(n?n+" · ":"")+(series||"Data quality")+" · Learning Data",960,718,{w:600,size:28,align:"center",col:DQ.chalkSoft});});}

/* ===== Data quality: the tools' pages =====
   Tools look like their pages, drawn for the film, never a click-by-click tour and never a screenshot: a light page with a small bar
   along its top naming the product, with its official logo where the film's film.json says "logos": true (The Inner Life of Data's
   Databricks and dbt marks, logos.js there), and no release status anywhere on it. The page stands before the wall or lies on the
   granite like the cards (o.on), with the same soft shadow. What it shows is drawn by the film in its body, often with the rows and
   the code below. Every word is at least 28 px as seen: a page drawn small is a picture, and its words are marked as decoration
   ({deco: 1}). The student system, the portal and the printer are the university's own and named by what they do, never by a maker.
     dq_window(ctx, x, y, w, h, o)     a tool's page: o.logo (a logo's key: "databricks", "dbt"), o.product ("Databricks"), o.title (what
                                       the page is, at the right of the bar: "Catalog Explorer"), o.edge (a colour that means something),
                                       o.on, o.a, o.k; o.draw(ctx, body) draws in the body {x, y, w, h}; returns the body
     dq_rows(ctx, x, y, cols, rows, o) a table of words: cols [{h: "NAME", w: 300, f: "mono"}, ...] (each column's heading, width and
                                       font), rows [[cell, ...], ...], a cell a string or {s, col (a meaning or a colour), icon, f, mark
                                       (a verdict's round stamp after the words)}; o.rh (row height, 54), o.lit (a row's index, or
                                       several: a pale band, and o.litCol a bar in a colour that means something), o.rowA(row, i) (rows
                                       coming in one by one), o.a; returns the height drawn
     dq_code(ctx, x, y, lines, o)      code or a file, typed: lines, each a string or [[text, col], ...] (runs, col a meaning or a
                                       colour); o.lh (line height, 44), o.lit (a line's index, or several: a pale band), o.lineA(line, i),
                                       o.size (28), o.a; returns the height drawn */

function dq_window(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,bar=68,body={x:x+24,y:y+bar+18,w:w-48,h:h-bar-40};if(a<=0.004)return body;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:o.edge,on:o.on,r:12,fill:"rgb(252,250,245)"});
  ctx.save();rr(ctx,x+1.5,y+1.5,w-3,bar,11);ctx.clip();ctx.fillStyle="rgba(120,100,76,0.08)";ctx.fillRect(x,y,w,bar);ctx.restore();
  ctx.fillStyle="rgba(110,90,66,0.22)";ctx.fillRect(x+12,y+bar,w-24,1.5);
  let tx=x+26;if(o.logo&&typeof LOGO!=="undefined"&&LOGO[o.logo])tx+=logo(ctx,o.logo,x+24,y+bar/2-19,38)+14;
  if(o.product)dq_T(ctx,o.product,tx,y+bar/2+10,{w:800,size:28});if(o.title)dq_T(ctx,o.title,x+w-26,y+bar/2+10,{w:600,size:28,align:"right",col:DQ.soft});
  if(o.draw){ctx.save();rr(ctx,x+3,y+bar+2,w-6,h-bar-5,10);ctx.clip();o.draw(ctx,body);ctx.restore();}
  ctx.restore();return body;}
function dq_rows(ctx,x,y,cols,rows,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||54,lits=o.lit==null?[]:[].concat(o.lit),W_=cols.reduce((s,c)=>s+c.w,0);if(a<=0.004)return rh*(rows.length+1);ctx.save();ctx.globalAlpha*=a;
  let cx=x;for(const c of cols){if(c.h)dq_T(ctx,String(c.h).toUpperCase(),cx+14,y+36,{w:800,size:28,ls:3,col:DQ.soft});cx+=c.w;}
  ctx.fillStyle="rgba(110,90,66,0.3)";ctx.fillRect(x,y+rh-1,W_,1.6);
  rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(r,i):1;if(ra<=0.004)return;const ry=y+rh*(i+1);ctx.save();ctx.globalAlpha*=ra;
    if(lits.includes(i)){ctx.fillStyle="rgba(196,172,128,0.22)";rr(ctx,x-6,ry+4,W_+12,rh-8,8);ctx.fill();if(o.litCol){ctx.fillStyle=rgba(dq_tone(o.litCol).col,1);rr(ctx,x-6,ry+4,6,rh-8,3);ctx.fill();}}
    ctx.fillStyle="rgba(110,90,66,0.14)";ctx.fillRect(x,ry+rh-1,W_,1.2);
    let xx=x;r.forEach((cell,j)=>{const c=cols[j]||{w:200},q=typeof cell==="object"&&cell?cell:{s:String(cell==null?"":cell)},f=q.f||c.f;let tx=xx+14;
      if(q.icon){dq_icon(ctx,q.icon,tx+16,ry+rh/2,30,q.col||DQ.ink);tx+=42;}
      dq_T(ctx,q.s,tx,ry+rh/2+10,{w:f==="mono"?500:600,size:28,f,col:q.col||DQ.ink});
      if(q.mark)dq_stampMark(ctx,tx+dq_tw(ctx,q.s,{w:f==="mono"?500:600,size:28,f})+26,ry+rh/2,q.mark,15);xx+=c.w;});
    ctx.restore();});
  ctx.restore();return rh*(rows.length+1);}
function dq_code(ctx,x,y,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=o.lh||44,size=o.size||28,lits=o.lit==null?[]:[].concat(o.lit);if(a<=0.004)return lh*lines.length;ctx.save();ctx.globalAlpha*=a;
  lines.forEach((ln,i)=>{const la=o.lineA?o.lineA(ln,i):1;if(la<=0.004)return;const ly=y+i*lh;ctx.save();ctx.globalAlpha*=la;
    if(lits.includes(i)){ctx.fillStyle="rgba(196,172,128,0.24)";ctx.fillRect(x-12,ly+4,(o.w||900)+24,lh-6);}
    let xx=x;for(const [s,col] of typeof ln==="string"?[[ln,null]]:ln){dq_T(ctx,s,xx,ly+lh*0.7,{w:500,size,f:"mono",col:col||DQ.ink});xx+=dq_tw(ctx,s,{w:500,size,f:"mono"});}
    ctx.restore();});
  ctx.restore();return lh*lines.length;}

/* ===== Read by an agent: the opening's places =====
   The opening happens around 2000, in the offices where people wrote for the United Nations, the European Union and NATO. Two places
   of its own, painted once in the module's way (soft, matte, lit from a window on the right), in the tones of an office of the time:
     ra_office   a writer's desk: a pale plaster wall, a window with a venetian blind on the right, its light lying on the wall in
                 slats; a beige monitor of the time on a light beech desk, its keyboard and mouse, a stack of paper and a mug. No
                 maker's name or mark anywhere: the film names no software maker. The page on the screen is drawn live (ra_props.js),
                 in RA_SCREEN's frame.
     ra_desk     the same desk seen from above: beech veneer, the window's daylight from the right, where the opening's papers lie.
   The university's places are the module's: the bench, the bench from above, the hall. */

// the monitor's glass and the page inside it, in the office's coordinates; the page's words are drawn live by ra_screen
const RA_SCREEN={x:486,y:162,w:708,h:508,r:26,page:{x:556,y:236,w:596},bar:204};

// a soft vertical or horizontal gradient band, used for the office's few solid things
function ra_grad(c,x0,y0,x1,y1,stops){const g=c.createLinearGradient(x0,y0,x1,y1);for(const [u,col] of stops)g.addColorStop(u,col);return g;}

function ra_paintOffice(c){const nz=dq_noise(61),DY=772;
  // the wall: pale plaster, a little cooler and darker away from the window, lit from the right, and a soft glow round the window
  // where its light bounces off the desk; the sun comes in through the blind and falls on the desk, not on this wall
  dq_field(c,0,0,W,DY+8,2,(px,py,out)=>{const m=nz(px/700,py/700,3),f=nz(px/90,py/90,2),lit=0.86+0.12*sstep(0,W,px)-0.07*(1-sstep(0,520,py)),
      gl=Math.exp(-Math.pow((px-1650)/420,2)-Math.pow((py-420)/420,2));
    const k=lit*(0.95+0.05*m+0.035*(f-0.5))+0.06*gl;out[0]=Math.min(255,206*k+4*gl);out[1]=Math.min(255,198*k+2*gl);out[2]=Math.min(255,184*k);});
  // the skirting along the desk's back edge, and the window
  c.fillStyle="rgba(120,108,92,0.35)";c.fillRect(0,DY-14,W,14);
  const WX=1418,WY=58,WW=470,WH=622;
  c.fillStyle=ra_grad(c,WX,0,WX+WW,0,[[0,"#d9d6cf"],[1,"#ecebe6"]]);rr(c,WX-22,WY-22,WW+44,WH+44,6);c.fill();
  c.fillStyle="rgba(80,70,58,0.25)";c.fillRect(WX-22,WY+WH+22,WW+44,6);
  // daylight behind the blind, brightest at the top, and the slats: each a soft band, lit on its upper edge, its gap glowing
  c.save();c.beginPath();c.rect(WX,WY,WW,WH);c.clip();c.fillStyle=ra_grad(c,0,WY,0,WY+WH,[[0,"#fbfbf6"],[1,"#eef0ea"]]);c.fillRect(WX,WY,WW,WH);
  for(let y=WY+6;y<WY+WH;y+=26){c.fillStyle=ra_grad(c,0,y,0,y+19,[[0,"#f4f2ec"],[0.35,"#dcd8cf"],[1,"#bdb7ab"]]);c.fillRect(WX,y,WW,19);
    c.fillStyle="rgba(255,255,250,0.75)";c.fillRect(WX,y,WW,1.6);c.fillStyle="rgba(90,80,66,0.22)";c.fillRect(WX,y+18,WW,1.4);}
  // the blind's two cords, and its head rail
  c.fillStyle="rgba(150,140,124,0.8)";for(const x of [WX+150,WX+WW-150])c.fillRect(x-1.2,WY,2.4,WH);
  c.fillStyle=ra_grad(c,0,WY,0,WY+26,[[0,"#e8e5dd"],[1,"#c9c3b6"]]);c.fillRect(WX-6,WY-4,WW+12,28);c.restore();
  // the frame's inner edge, in shadow at the top and left
  c.strokeStyle="rgba(96,86,70,0.35)";c.lineWidth=3;c.strokeRect(WX-1.5,WY-1.5,WW+3,WH+3);
  // the desk: light beech veneer, its grain running across, the window's light along its back on the right
  dq_field(c,0,DY,W,H-DY,2,(px,py,out)=>{const v=(py-DY)/(H-DY),gr=nz(px/520,(py-DY)/9+40,3),fine=nz(px/60,(py-DY)/3+80,2),lit=0.84+0.14*sstep(200,W,px)-0.1*v;
    const k=lit*(0.93+0.09*gr+0.04*(fine-0.5));out[0]=Math.min(255,214*k);out[1]=Math.min(255,184*k);out[2]=Math.min(255,146*k);});
  c.fillStyle="rgba(255,250,240,0.35)";c.fillRect(0,DY,W,2);
  // the sun through the blind, lying on the desk in front of the window in soft slats that open out towards us
  c.save();c.globalCompositeOperation="lighter";for(let i=0;i<9;i++){const y0=DY+10+i*i*3.4+i*10,h=4+i*1.6,x0=1300-i*26,x1=1960+i*10;
    const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"rgba(255,236,200,0)");g.addColorStop(0.3,"rgba(255,236,200,"+(0.13-i*0.008)+")");g.addColorStop(1,"rgba(255,236,200,"+(0.08-i*0.005)+")");
    c.fillStyle=g;c.filter="blur("+(2+i*0.6)+"px)";c.fillRect(x0,y0,x1-x0,h);}c.restore();
  c.fillStyle=ra_grad(c,0,DY,0,DY+40,[[0,"rgba(60,46,30,0.28)"],[1,"rgba(60,46,30,0)"]]);c.fillRect(0,DY,W,40);
  // the monitor's shadow on the desk and the wall, falling to the left
  c.save();c.filter="blur(26px)";c.fillStyle="rgba(50,40,28,0.32)";c.beginPath();c.ellipse(760,DY+30,420,46,0,0,TAU);c.fill();
  c.fillStyle="rgba(60,50,38,0.2)";rr(c,360,128,820,640,40);c.fill();c.restore();
  // the monitor: a deep beige case, seen almost from the front, a little of its left side showing; its glass, and the page on it
  // (the words are drawn live)
  const MX=430,MY=104,MW=820,MH=650;
  // the case behind the front: its left side in shade, narrowing back towards the wall, and its top catching the light
  c.fillStyle=ra_grad(c,MX-70,0,MX+10,0,[[0,"#8f8573"],[0.7,"#b3a993"],[1,"#c4bba6"]]);c.beginPath();c.moveTo(MX+14,MY+12);c.lineTo(MX-60,MY+86);c.quadraticCurveTo(MX-66,MY+MH/2,MX-60,MY+MH-110);c.lineTo(MX+14,MY+MH-20);c.closePath();c.fill();
  c.fillStyle=ra_grad(c,0,MY-34,0,MY+10,[[0,"#d8d1c0"],[1,"#e9e3d4"]]);c.beginPath();c.moveTo(MX+30,MY+4);c.lineTo(MX-40,MY+80);c.lineTo(MX+60,MY-28);c.lineTo(MX+MW-70,MY-28);c.lineTo(MX+MW-20,MY+4);c.closePath();c.fill();
  c.strokeStyle="rgba(120,106,84,0.3)";c.lineWidth=1.5;c.beginPath();c.moveTo(MX-40,MY+80);c.lineTo(MX+60,MY-28);c.lineTo(MX+MW-70,MY-28);c.stroke();
  c.fillStyle=ra_grad(c,0,MY,0,MY+MH,[[0,"#e6dfcf"],[0.55,"#ddd5c3"],[1,"#cfc6b2"]]);rr(c,MX,MY,MW,MH,30);c.fill();
  c.fillStyle=ra_grad(c,MX,0,MX+MW,0,[[0,"rgba(120,104,80,0.16)"],[0.6,"rgba(255,255,255,0)"],[1,"rgba(255,252,240,0.22)"]]);rr(c,MX,MY,MW,MH,30);c.fill();
  c.strokeStyle="rgba(120,106,84,0.45)";c.lineWidth=2;rr(c,MX+1,MY+1,MW-2,MH-2,30);c.stroke();
  // the bezel's recess round the glass, then the glass: dark at its rim, the page's workspace inside
  const S=RA_SCREEN;c.fillStyle="#8f8676";rr(c,S.x-20,S.y-20,S.w+40,S.h+40,S.r+14);c.fill();
  c.fillStyle=ra_grad(c,0,S.y-20,0,S.y+S.h+20,[[0,"#7a7264"],[1,"#b4ab99"]]);rr(c,S.x-14,S.y-14,S.w+28,S.h+28,S.r+10);c.fill();
  c.fillStyle="#3a3d3b";rr(c,S.x-4,S.y-4,S.w+8,S.h+8,S.r+3);c.fill();
  c.save();rr(c,S.x,S.y,S.w,S.h,S.r);c.clip();
  // the word processor of the time: a grey workspace, a plain toolbar (blank buttons: no maker's marks), and a white page
  c.fillStyle="#c3c5c2";c.fillRect(S.x,S.y,S.w,S.h);
  c.fillStyle=ra_grad(c,0,S.y,0,S.bar,[[0,"#e3e3df"],[1,"#cfd0cc"]]);c.fillRect(S.x,S.y,S.w,S.bar-S.y);c.fillStyle="rgba(80,80,80,0.4)";c.fillRect(S.x,S.bar-1,S.w,1.5);
  for(let i=0;i<12;i++){const bx=S.x+40+i*46+(i>4?18:0)+(i>8?18:0);c.fillStyle="#d9dad6";rr(c,bx,S.y+10,34,30,4);c.fill();c.strokeStyle="rgba(90,90,90,0.35)";c.lineWidth=1.2;rr(c,bx,S.y+10,34,30,4);c.stroke();
    c.fillStyle="rgba(70,72,74,0.5)";c.fillRect(bx+9,S.y+18,16,3);c.fillRect(bx+9,S.y+25,12,3);}
  const P=S.page;c.fillStyle="rgba(40,40,40,0.25)";c.fillRect(P.x+6,P.y+6,P.w,S.y+S.h-P.y);c.fillStyle="#fbfbf8";c.fillRect(P.x,P.y,P.w,S.y+S.h-P.y+40);
  // the glass: a faint curve of the window's light across it, and its darker corners
  c.fillStyle=ra_grad(c,S.x+S.w,S.y,S.x+S.w*0.35,S.y+S.h*0.6,[[0,"rgba(255,255,255,0.13)"],[0.5,"rgba(255,255,255,0.03)"],[1,"rgba(255,255,255,0)"]]);c.fillRect(S.x,S.y,S.w,S.h);
  const v=c.createRadialGradient(S.x+S.w/2,S.y+S.h/2,S.h*0.42,S.x+S.w/2,S.y+S.h/2,S.w*0.66);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(20,22,20,0.22)");c.fillStyle=v;c.fillRect(S.x,S.y,S.w,S.h);c.restore();
  // the chin under the glass: a round power button and a small grey lamp; then the swivel stand on the desk
  c.fillStyle="#bdb4a1";c.beginPath();c.arc(MX+MW-80,MY+MH-40,11,0,TAU);c.fill();c.strokeStyle="rgba(110,96,76,0.6)";c.lineWidth=1.5;c.stroke();
  c.fillStyle="#9b958a";c.beginPath();c.arc(MX+MW-120,MY+MH-40,4,0,TAU);c.fill();
  c.fillStyle=ra_grad(c,0,MY+MH-6,0,DY+26,[[0,"#b9b09c"],[1,"#d7cfbd"]]);c.beginPath();c.moveTo(MX+250,MY+MH-8);c.lineTo(MX+MW-250,MY+MH-8);c.lineTo(MX+MW-190,DY+24);c.lineTo(MX+190,DY+24);c.closePath();c.fill();
  c.fillStyle="rgba(90,76,58,0.3)";c.fillRect(MX+190,DY+22,MW-380,4);
  // the keyboard: beige, its keys in rows, lit from the right; and the mouse beside it, its cable running back
  const KX=470,KY=884,KW=740,KH=176;c.save();c.filter="blur(10px)";c.fillStyle="rgba(50,40,28,0.35)";rr(c,KX-14,KY+14,KW,KH,18);c.fill();c.restore();
  c.fillStyle=ra_grad(c,0,KY,0,KY+KH,[[0,"#e2dbcb"],[1,"#cbc2ae"]]);rr(c,KX,KY,KW,KH,16);c.fill();c.strokeStyle="rgba(120,106,84,0.5)";c.lineWidth=1.6;rr(c,KX,KY,KW,KH,16);c.stroke();
  for(let r=0;r<4;r++)for(let i=0;i<15;i++){const kw=r===3&&i>3&&i<10?0:40;if(!kw)continue;const kx=KX+24+i*46+r*10,ky=KY+18+r*38;if(kx+40>KX+KW-20)continue;
    c.fillStyle="rgba(90,78,60,0.3)";rr(c,kx-1,ky+2,40,32,5);c.fill();c.fillStyle=ra_grad(c,0,ky,0,ky+30,[[0,"#f0eadc"],[1,"#d9d1bf"]]);rr(c,kx,ky,38,30,5);c.fill();}
  c.fillStyle="rgba(90,78,60,0.3)";rr(c,KX+218,KY+134,280,32,5);c.fill();c.fillStyle=ra_grad(c,0,KY+132,0,KY+162,[[0,"#f0eadc"],[1,"#d9d1bf"]]);rr(c,KX+220,KY+132,276,30,5);c.fill();
  c.strokeStyle="rgba(150,140,124,0.9)";c.lineWidth=3;c.beginPath();c.moveTo(1316,930);c.bezierCurveTo(1300,860,1260,820,1150,DY+30);c.stroke();
  c.save();c.filter="blur(8px)";c.fillStyle="rgba(50,40,28,0.35)";c.beginPath();c.ellipse(1316,986,46,60,0,0,TAU);c.fill();c.restore();
  c.fillStyle=ra_grad(c,1290,0,1360,0,[[0,"#d6cebc"],[1,"#ece6d8"]]);c.beginPath();c.ellipse(1326,974,42,58,0,0,TAU);c.fill();c.strokeStyle="rgba(120,106,84,0.5)";c.lineWidth=1.5;c.stroke();
  c.strokeStyle="rgba(120,106,84,0.4)";c.beginPath();c.moveTo(1326,918);c.lineTo(1326,958);c.stroke();
  // a stack of paper on the right, and a mug on the left: plain, no words
  c.save();c.filter="blur(10px)";c.fillStyle="rgba(50,40,28,0.3)";rr(c,1452,834,330,74,6);c.fill();c.restore();
  for(let i=0;i<7;i++){const yy=846-i*5;c.fillStyle=i===6?"#fbfaf5":"#efece3";c.beginPath();c.moveTo(1480+i*1.5,yy);c.lineTo(1770-i,yy-2);c.lineTo(1786-i,yy+44);c.lineTo(1466+i*1.5,yy+46);c.closePath();c.fill();
    c.strokeStyle="rgba(120,106,84,0.25)";c.lineWidth=1;c.stroke();}
  c.save();c.filter="blur(9px)";c.fillStyle="rgba(50,40,28,0.35)";c.beginPath();c.ellipse(212,930,74,20,0,0,TAU);c.fill();c.restore();
  c.fillStyle=ra_grad(c,170,0,290,0,[[0,"#cfc9bd"],[0.6,"#ece8df"],[1,"#f6f3ec"]]);c.beginPath();c.moveTo(166,826);c.lineTo(286,826);c.lineTo(282,920);c.quadraticCurveTo(226,940,170,920);c.closePath();c.fill();
  c.fillStyle="#d8d2c4";c.beginPath();c.ellipse(226,826,60,12,0,0,TAU);c.fill();c.fillStyle="#5d4a38";c.beginPath();c.ellipse(226,828,52,9,0,0,TAU);c.fill();
  c.strokeStyle="#e4dfd4";c.lineWidth=11;c.beginPath();c.arc(292,866,26,-1.2,1.2);c.stroke();}

function ra_paintDesk(c){const nz=dq_noise(67);
  // beech veneer from above: long fibres running across, a few broader bands, the window's daylight from the right
  dq_field(c,0,0,W,H,2,(px,py,out)=>{const band=nz(px/1400,py/90+7,3),gr=nz(px/700,py/7+30,3),fine=nz(px/90,py/2.6+90,2),
      lit=0.82+0.16*sstep(0,W,px)+0.05*(1-sstep(0,H,py));const k=lit*(0.9+0.08*band+0.07*gr+0.035*(fine-0.5));
    out[0]=Math.min(255,218*k);out[1]=Math.min(255,186*k);out[2]=Math.min(255,146*k);});
  // a few darker fibres where the grain's figure closes up, as on sliced veneer
  const r=ag_rnd(71);c.save();c.lineCap="round";for(let i=0;i<70;i++){const y=r()*H,x0=-100+r()*W,len=300+r()*900,a=0.05+r()*0.07,amp=4+r()*10;
    c.strokeStyle="rgba(120,84,48,"+a+")";c.lineWidth=0.8+r()*1.6;c.beginPath();c.moveTo(x0,y);c.bezierCurveTo(x0+len*0.33,y+amp,x0+len*0.66,y-amp,x0+len,y+amp*0.4);c.stroke();}c.restore();
  dq_pool(c,1500,300,1100,[255,250,236],0.1);
  const v=c.createRadialGradient(W*0.52,H*0.46,H*0.42,W/2,H/2,W*0.7);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(40,26,12,0.32)");c.fillStyle=v;c.fillRect(0,0,W,H);}

AG_PLACES.ra_office=c=>ra_paintOffice(c);
AG_PLACES.ra_desk=c=>ra_paintDesk(c);

/* ===== Read by an agent: the film's own pictures =====
   Drawn in the module's way (paper, cards and tags; ink on cream; colour only where it means something), with the opening's things
   of about 2000 and the agent's chat. Every word is at least 28 px as seen; nothing but the captions goes below y 890.
     ra_screen(ctx, o)                 the page on the office's monitor (RA_SCREEN): o.lines (strings), o.typed {line, n} (letters typed
                                       so far), o.mark {line, word, u (the wavy line drawn on), a}, o.popup {line, word, items, a, k, hi},
                                       o.swap {line, from, to, u}, o.pointer [x, y, a], o.caret {line, a}
     ra_printout(ctx, x, y, o)         the checker's word list, printed on continuous paper: o.words [{w, gap, fill}], o.lit, o.a, o.k
     ra_page(ctx, x, y, w, h, o)       a printed page: grey lines of words too small to read, and one real line (o.line, o.word lit)
     ra_screens(ctx, x, y, o)          many small web pages, each with its Cupertino lit: o.n (how many show), o.cols, o.a
     ra_chat(ctx, x, y, w, h, o)       the graduations team's agent: its page, Malia's question, and its answer in violet
     ra_descCard(ctx, x, y, w, rows, o) a column's description, row by row: [{k, v, dash}], wrapped
   The agent's words are violet (AG.violet), as the agent films colour a model's words; nothing else in the film is violet. */

const RA_VIOLET=[88,78,196];
const RA_PAGE_SIZE=30,RA_LH=52;
// where a line of the monitor's page sits, and where a word starts in it
const ra_lineY=i=>RA_SCREEN.page.y+70+i*RA_LH,ra_lineX=()=>RA_SCREEN.page.x+44;
function ra_wordX(ctx,line,word){const i=line.indexOf(word),f={w:500,size:RA_PAGE_SIZE};return i<0?null:[ra_lineX()+dq_tw(ctx,line.slice(0,i),f),dq_tw(ctx,word,f)];}
// a wavy line under a word, drawn on from the left (u 0 to 1): the checker's mark
function ra_wavy(ctx,x0,x1,y,col,u,a){if(u<=0||a<=0)return;const xe=lerp(x0,x1,clamp(u,0,1));ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.6;ctx.lineJoin="round";ctx.beginPath();
  for(let x=x0;x<=xe;x+=2){const y_=y+Math.sin((x-x0)/4.2)*2.6;x===x0?ctx.moveTo(x,y_):ctx.lineTo(x,y_);}ctx.stroke();ctx.restore();}
// the mouse pointer of the time: a white arrow with a dark edge
function ra_arrow(ctx,x,y,a,s){if(a<=0)return;s=s||1;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.shadowColor="rgba(0,0,0,0.25)";ctx.shadowBlur=4;ctx.shadowOffsetX=-2;ctx.shadowOffsetY=3;
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,30);ctx.lineTo(7.5,23);ctx.lineTo(13,35);ctx.lineTo(18,33);ctx.lineTo(12.5,21.5);ctx.lineTo(22,21.5);ctx.closePath();
  ctx.fillStyle="#fff";ctx.fill();ctx.shadowColor="transparent";ctx.strokeStyle="#111";ctx.lineWidth=1.6;ctx.lineJoin="round";ctx.stroke();ctx.restore();}
// the checker's menu under a word: its first offer in bold, then the rest; hi (0 to 1) lights the first, as the pointer rests on it
function ra_menu(ctx,x,y,items,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const f0={w:800,size:RA_PAGE_SIZE},f1={w:500,size:RA_PAGE_SIZE},
    w=Math.max(...items.map((s,i)=>dq_tw(ctx,s,i?f1:f0)))+64,ih=48,h=items.length*ih+(items.length>1?14:0)+12,bb={x,y,w,h,first:[x+8,y+6,w-16,ih]};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null){const k=lerp(0.85,1,ag_spr(o.k,0,0.4));ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);}
  ctx.shadowColor="rgba(0,0,0,0.28)";ctx.shadowBlur=14;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=6;ctx.fillStyle="#f1f1ee";ctx.fillRect(x,y,w,h);ctx.shadowColor="transparent";
  ctx.strokeStyle="rgba(70,70,70,0.55)";ctx.lineWidth=1.4;ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);
  const hi=o.hi||0;if(hi>0){ctx.fillStyle="rgba(96,96,92,"+(0.22*hi)+")";ctx.fillRect(x+6,y+6,w-12,ih);}
  items.forEach((s,i)=>{const yy=y+6+i*ih+(i?14:0);if(i===1){ctx.fillStyle="rgba(90,90,90,0.4)";ctx.fillRect(x+12,yy-8,w-24,1.4);}
    dq_T(ctx,s,x+30,yy+ih/2+10,Object.assign({col:i?DQ.soft:DQ.ink},i?f1:f0));});
  ctx.restore();return bb;}
function ra_screen(ctx,o){o=o||{};const S=RA_SCREEN,f={w:500,size:RA_PAGE_SIZE},lines=o.lines||[],shown=[];ctx.save();rr(ctx,S.x,S.y,S.w,S.h,S.r);ctx.clip();
  // each line as far as it's typed; a word being swapped for another (the writer taking the checker's offer) fades into it in place
  lines.forEach((ln,i)=>{if(o.typed&&i>o.typed.line)return;const s=o.typed&&o.typed.line===i?ln.slice(0,Math.max(0,Math.floor(o.typed.n))):ln,x0=ra_lineX(),y=ra_lineY(i);shown[i]=s;
    if(o.swap&&o.swap.line===i){const sw=o.swap,u=clamp(sw.u,0,1),k=s.indexOf(sw.from);if(k>=0&&u>0){const pre=s.slice(0,k),post=s.slice(k+sw.from.length);
        dq_T(ctx,pre,x0,y,Object.assign({col:DQ.ink},f));const px=x0+dq_tw(ctx,pre,f),wf=dq_tw(ctx,sw.from,f),wt=dq_tw(ctx,sw.to,f),ww=lerp(wf,wt,ag_sine(u));
        if(u<1)dq_T(ctx,sw.from,px,y,Object.assign({col:DQ.ink,a:1-ag_in(u,0,0.5)},f));dq_T(ctx,sw.to,px,y,Object.assign({col:DQ.ink,a:ag_in(u,0.4,0.5)},f));
        if(post)dq_T(ctx,post,px+ww,y,Object.assign({col:DQ.ink},f));shown[i]=u>=0.5?pre+sw.to+post:s;return;}}
    if(s)dq_T(ctx,s,x0,y,Object.assign({col:DQ.ink},f));});
  // the caret: a thin bar where the next letter goes, blinking
  if(o.caret&&o.caret.a>0&&shown[o.caret.line]!=null){const i=o.caret.line,cx=ra_lineX()+dq_tw(ctx,shown[i],f)+3,on=o.caret.blink===false||Math.floor((o.caret.t||0)*1.9)%2===0;
    if(on){ctx.fillStyle=rgba(DQ.ink,o.caret.a);ctx.fillRect(cx,ra_lineY(i)-28,2.4,36);}}
  if(o.mark){const m=o.mark,q=ra_wordX(ctx,lines[m.line],m.word);if(q)ra_wavy(ctx,q[0],q[0]+q[1],ra_lineY(m.line)+9,DQ.stop,m.u,m.a==null?1:m.a);}
  if(o.stamp){const m=o.stamp,q=ra_wordX(ctx,lines[m.line],m.word);if(q&&m.a>0){ctx.save();ctx.globalAlpha*=m.a;dq_stampMark(ctx,q[0]+q[1]/2,ra_lineY(m.line)-62,"pass",17);ctx.restore();}}
  let menu=null;if(o.popup){const p=o.popup,q=ra_wordX(ctx,lines[p.line],p.word);if(q)menu=ra_menu(ctx,q[0]-10,ra_lineY(p.line)+20,p.items,{a:p.a,k:p.k,hi:p.hi});}
  ctx.restore();if(o.pointer&&o.pointer[2]>0)ra_arrow(ctx,o.pointer[0],o.pointer[1],o.pointer[2]);return menu;}
// where the checker's menu will sit under a word, and the middle of its first offer: for the pointer to go to
function ra_menuAt(ctx,line,word,i){const q=ra_wordX(ctx,line,word);return q?{x:q[0]-10,y:ra_lineY(i)+20,first:[q[0]+70,ra_lineY(i)+20+6+24]}:null;}

/* ---------------------------------------------------------------- the checker's word list, printed */
// continuous paper of the time, its sprocket holes down both edges, the words typed one to a line; a word that isn't there is a
// dashed box with the word in grey (it fills in, solid, as fill goes from 0 to 1)
function ra_printout(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const words=o.words||[],lh=o.lh||64,w=o.w||620,h=o.h||(words.length*lh+70),f={w:500,size:32,f:"mono"};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  ctx.save();ctx.shadowColor="rgba(60,40,20,0.35)";ctx.shadowBlur=26;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;ctx.fillStyle="#f6f4ec";ctx.fillRect(x,y-40,w,h+80);ctx.restore();
  // faint green-grey bands of the old paper, and the tear lines at each fold
  for(let yy=y-40,i=0;yy<y+h+40;yy+=lh*2,i++){ctx.fillStyle="rgba(150,170,150,0.1)";ctx.fillRect(x+54,yy,w-108,lh);}
  ctx.fillStyle="rgba(120,110,90,0.25)";for(let xx=x;xx<x+w;xx+=10)ctx.fillRect(xx,y-40,5,1.2);
  for(const sx of [x+24,x+w-24])for(let yy=y-26;yy<y+h+40;yy+=32){ctx.fillStyle="#cdbf9f";ctx.beginPath();ctx.arc(sx,yy,7.5,0,TAU);ctx.fill();ctx.fillStyle="rgba(80,60,40,0.4)";ctx.beginPath();ctx.arc(sx-1,yy+1,7.5,0,TAU);ctx.fill();}
  for(const lx of [x+48,x+w-48]){ctx.fillStyle="rgba(120,110,90,0.3)";for(let yy=y-40;yy<y+h+40;yy+=8)ctx.fillRect(lx,yy,1.2,4);}
  words.forEach((wd,i)=>{const yy=y+30+i*lh,tx=x+90;
    if(wd.gap){const fu=clamp(wd.fill||0,0,1),bw=dq_tw(ctx,wd.w,f)+44;
      if(fu<1){ctx.save();ctx.globalAlpha*=1-ag_in(fu,0.3,0.5);dq_card(ctx,tx-22,yy-6,bw,lh-8,{dash:true,r:6});dq_T(ctx,wd.w,tx,yy+lh/2+6,Object.assign({col:DQ.dim},f));ctx.restore();}
      if(fu>0){ctx.save();ctx.globalAlpha*=ag_in(fu,0,0.6);dq_T(ctx,wd.w,tx,yy+lh/2+6,Object.assign({col:DQ.ink},f));if(wd.mark)dq_stampMark(ctx,tx+bw+10,yy+lh/2-4,wd.mark,17);ctx.restore();}
      return;}
    if(o.lit===i||(o.lit&&o.lit.includes&&o.lit.includes(i))){ctx.fillStyle="rgba(196,172,128,0.3)";ctx.fillRect(tx-14,yy+2,dq_tw(ctx,wd.w,f)+28,lh-14);}
    if(wd.dots){dq_T(ctx,"…",tx,yy+lh/2+6,Object.assign({col:DQ.soft},f));return;}
    dq_T(ctx,wd.w,tx,yy+lh/2+6,Object.assign({col:DQ.ink},f));});
  ctx.restore();}

/* ---------------------------------------------------------------- a printed page */
// a page of a report or a magazine: its heading and paragraphs as grey lines too small to read (drawn, not written), and one line
// written out, with its word lit; o.head (a masthead band, for the magazine), o.cols (2 for the magazine), o.lineAt (the real line's row)
function ra_page(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const r=ag_rnd(o.seed||5),pad=70,cols=o.cols||1,gut=40,cw=(w-2*pad-(cols-1)*gut)/cols;let bb=null;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));if(o.angle){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.angle);ctx.translate(-x-w/2,-y-h/2);}
  ctx.save();ctx.shadowColor="rgba(60,40,20,0.35)";ctx.shadowBlur=28;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;ctx.fillStyle="#fbfaf6";ctx.fillRect(x,y,w,h);ctx.restore();
  let top=y+pad;if(o.head){ctx.fillStyle="rgba(70,72,78,0.85)";ctx.fillRect(x,y,w,96);ctx.fillStyle="rgba(240,240,236,0.55)";ctx.fillRect(x+pad,y+38,w*0.32,16);ctx.fillRect(x+w-pad-w*0.16,y+42,w*0.16,10);top=y+96+50;}
  else{ctx.fillStyle="rgba(60,60,64,0.55)";ctx.fillRect(x+pad,top,w*0.46,15);ctx.fillRect(x+pad,top+30,w*0.3,10);top+=80;}
  const lh=26,real=o.lineAt==null?6:o.lineAt;
  for(let cI=0;cI<cols;cI++){const cx=x+pad+cI*(cw+gut);let yy=top;let row=0;
    while(yy<y+h-pad){if(cI===0&&row===real&&o.line){const f={w:600,size:o.size||30};yy+=18;const lineY=yy+22;dq_T(ctx,o.line,cx,lineY,Object.assign({col:DQ.ink},f));
        if(o.word){const i=o.line.indexOf(o.word),wx=cx+dq_tw(ctx,o.line.slice(0,i),f),ww=dq_tw(ctx,o.word,f);bb={x:wx,y:lineY-28,w:ww,h:38};
          if(o.lit>0){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle="rgba(232,206,150,"+(0.85*o.lit)+")";ctx.fillRect(wx-6,lineY-30,(ww+12)*clamp(o.lit*1.4,0,1),42);ctx.restore();}}
        yy+=58;row++;continue;}
      const para=row%7===6,len=para?0.35+r()*0.3:0.9+r()*0.1;if(!(para&&row%2)){ctx.fillStyle="rgba(96,92,86,0.38)";ctx.fillRect(cx,yy,cw*len,9);}yy+=para?lh*1.6:lh;row++;}}
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- many web pages */
// small pages of the organisations' websites, each with a grey title bar, grey lines and one word lit; they come in one by one
function ra_screens(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const cols=o.cols||8,rows=o.rows||4,pw=o.pw||170,ph=o.ph||124,gx=o.gx||22,gy=o.gy||22,n=o.n==null?cols*rows:o.n,r=ag_rnd(o.seed||9);
  ctx.save();ctx.globalAlpha*=a;for(let i=0;i<cols*rows;i++){const ri=Math.floor(i/cols),ci=i%cols,px=x+ci*(pw+gx)+(r()-0.5)*8,py=y+ri*(ph+gy)+(r()-0.5)*8,on=clamp(n-i,0,1),lr=r(),lc=r();if(on<=0)continue;
    ctx.save();ctx.globalAlpha*=on;ctx.shadowColor="rgba(60,40,20,0.3)";ctx.shadowBlur=12;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=6;ctx.fillStyle="#fbfaf6";ctx.fillRect(px,py,pw,ph);ctx.shadowColor="transparent";
    ctx.fillStyle="rgba(110,112,118,0.6)";ctx.fillRect(px,py,pw,16);ctx.fillStyle="rgba(96,92,86,0.32)";for(let k=0;k<6;k++)ctx.fillRect(px+12,py+28+k*15,(pw-24)*(k===5?0.5:0.9),5);
    const lk=1+Math.floor(lr*4),lx=px+12+lc*(pw-90);ctx.fillStyle="rgba(214,170,90,0.85)";ctx.fillRect(lx,py+25+lk*15,62,11);ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the graduations team's agent */
// its page, with Databricks' mark: Malia's question on a pale card at the right, then the agent's answer at the left, its words violet.
// o.q (the question), o.qA, o.ans (the answer's words), o.ansA, o.sub (a second line under the answer: what it counted), o.subA, o.big
// (the answer's number, set large), o.k, o.a
function ra_chat(ctx,x,y,w,h,o){o=o||{};return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:o.title||"Genie Agent",a:o.a,k:o.k,on:o.on,draw:(c,b)=>{
    const qf={w:600,size:30},ql=o.q?dq_wrap(c,o.q,b.w*0.7,qf):[],qh=ql.length*42+40,qw=Math.max(...ql.map(l=>dq_tw(c,l,qf)),0)+52;
    if(o.q&&(o.qA==null||o.qA>0)){c.save();c.globalAlpha*=o.qA==null?1:o.qA;const qx=b.x+b.w-qw-10,qy=b.y+20;c.fillStyle="rgba(232,226,212,1)";rr(c,qx,qy,qw,qh,18);c.fill();
      ql.forEach((l,i)=>dq_T(c,l,qx+26,qy+52+i*42,qf));if(o.who)dq_T(c,o.who,qx+qw,qy+qh+40,{w:600,size:28,col:DQ.soft,align:"right"});c.restore();}
    const ay=b.y+20+qh+(o.who?62:30);if(o.ans&&(o.ansA==null||o.ansA>0)){c.save();c.globalAlpha*=o.ansA==null?1:o.ansA;
      // a violet bar beside the agent's answer (the sphere itself is drawn once, in the room, never in its page too)
      c.fillStyle=rgba(RA_VIOLET,0.9);rr(c,b.x+36,ay+14,7,o.sub?(o.big!=null?150:120):(o.big!=null?90:60),3.5);c.fill();
      let yy=ay+56;if(o.big!=null){dq_T(c,String(o.big),b.x+100,ay+80,{w:800,size:84,color:rgba(RA_VIOLET,1)});yy=ay+80;dq_T(c,o.ans,b.x+100+dq_tw(c,String(o.big),{w:800,size:84})+22,yy,{w:600,size:32,color:rgba(RA_VIOLET,1)});}
      else dq_T(c,o.ans,b.x+100,yy,{w:600,size:32,color:rgba(RA_VIOLET,1)});
      if(o.sub&&(o.subA==null||o.subA>0)){const sl=dq_wrap(c,o.sub,b.w-130,{w:500,size:28});sl.forEach((l,i)=>dq_T(c,l,b.x+100,yy+50+i*38,{w:500,size:28,color:rgba(RA_VIOLET,o.subA==null?1:o.subA)}));}
      c.restore();}}});}

/* ---------------------------------------------------------------- a column's description */
// a card holding a column's name (typed), and its description row by row: each row's heading on the left, its words wrapped on the
// right; a row with dash:true is an empty space in a dashed box (nobody wrote it); rowA(i) brings rows in; o.edge, o.k, o.a, o.head
function ra_descCard(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,labW=o.labW||230,vf={w:600,size:30},vw=w-2*DQ_PAD-labW,rh=rows.map(r=>r.dash?62:Math.max(1,dq_wrap(ctx,r.v,vw,vf).length)*42+20),
    head=o.head?92:24,h=head+rh.reduce((s,v)=>s+v,0)+16,bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:o.edge,on:o.on});if(o.head){dq_T(ctx,o.head,x+DQ_PAD,y+56,{w:500,size:32,f:"mono"});if(o.type)dq_T(ctx,o.type,x+w-DQ_PAD,y+56,{w:500,size:28,f:"mono",col:DQ.soft,align:"right"});
    ctx.fillStyle="rgba(120,96,70,0.45)";ctx.fillRect(x+16,y+head-8,w-32,2);}
  let yy=y+head;rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(i):1;if(ra>0.004){ctx.save();ctx.globalAlpha*=ra;dq_T(ctx,r.k,x+DQ_PAD,yy+40,{w:700,size:28,col:DQ.soft});
      if(r.dash)dq_card(ctx,x+DQ_PAD+labW,yy+10,vw,44,{dash:true,r:6});else dq_wrap(ctx,r.v,vw,vf).forEach((l,j)=>dq_T(ctx,l,x+DQ_PAD+labW,yy+40+j*42,Object.assign({col:r.col||DQ.ink},vf)));
      ctx.restore();}yy+=rh[i];});
  ctx.restore();return bb;}

/* ===== Read by an agent: the seven chapters =====
   Each chapter is a few shots, cut together with the agent films' ag_shots: in one room the camera glides on from shot to shot, and
   between rooms a shot comes in on a cut. Times inside a chapter come from its cues (when each line starts) and the words of its
   lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on cards, tags, chips and pages, at
   least 28 px as seen, and above the captions. The agent is one ceramic sphere, drawn in one place at a time; its words are violet.
   Colours mean what they mean in every film of the module: green passes, amber holds for a person, red stops, grey wasn't checked;
   brass is what good means (a requirement, a reference), steel a measure taken. */

// made once per chapter, the first time it draws: its cues are known by then
const ra_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a card that springs in at t0 and goes at t1 (or stays): its k and a
const ra_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// letters typed by t, from t0, at cps a second, at most n
const ra_typed=(t,t0,n,cps)=>clamp((t-t0)*(cps||11),0,n);
// the chapter's number and title at the top left, for its first seconds
function ra_kick(ctx,S,t,num,title,t1,o){const a=ag_io(t,0.3,t1||6,0.6);if(a<=0.01)return;setScreen(ctx,S);dq_kicker(ctx,num,title,Object.assign({a},o||{}));}
// the agent: the sphere, its violet light on the wall, and its soft shadow on the bench below it
function ra_agent(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null){const k=lerp(0.5,1,ag_spr(o.k,0,0.6));ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);}
  ag_modelLight(ctx,x,y,r,1);ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(0,0,0,0.32)";ctx.beginPath();ctx.ellipse(x-12,DQ_BENCH.back+34,r*0.95,r*0.2,0,0,TAU);ctx.fill();ctx.restore();
  ag_model(ctx,x,y,r,{t:o.t||0,core:o.core==null?0.7:o.core,think:o.think||0,label:o.label});ctx.restore();}
// a person behind the bench, faded as one picture
function ra_person(ctx,who,x,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;ctx.save();ctx.globalAlpha*=a;
  const h=dq_person(ctx,who,x,o.y||592,s,Object.assign({cut:DQ_BENCH.back},o,{a:undefined}));ctx.restore();return h;}
const RA_TITLE="Read by an agent";
// the writer's page on the monitor: the line with the misspelt word, then the lines that follow
const RA_LINES=["We thank the delegations for their","support, and look forward to working","with the Organization for Security","and Cooperation in Europe."];
const RA_SLIP="We thank the delegatoins for their";
const RA_ZOOM=[846,432,1.26];
// where the graduations team's agent floats over the bench, in every chapter it's in: one place, so it never shows in two
const RA_AG=[1180,520,74];

// ---- 1 · A Cupertino: around 2000, spell checkers at the UN, the EU and NATO; a gap in a word list; the Cupertino effect; the data story ----
scene("cupertino",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({
    type0:c.when+0.9,spell:wAt(sc,"when","spell"),marks:wAt(sc,"checker","marks"),offers:wAt(sc,"checker","offers"),does:wAt(sc,"checker","one it does",0.5),
    lists:c.lists,hyphen:wAt(sc,"lists","hyphen"),not:wAt(sc,"lists","not"),
    typed:c.typed,typedW:wAt(sc,"typed","typed"),marked:wAt(sc,"typed","marked"),first:wAt(sc,"typed","first"),cup:wAt(sc,"typed","Cupertino"),cal:wAt(sc,"typed","city"),
    took:c.took,tookW:wAt(sc,"took","took"),
    nato:c.nato,report:wAt(sc,"nato","report"),named:wAt(sc,"nato","Cupertino"),guess:wAt(sc,"nato","guess"),
    hundreds:c.hundreds,hund:wAt(sc,"hundreds","hundreds"),sites:wAt(sc,"hundreds","websites"),
    gap:c.gap,conf:wAt(sc,"gap","confident"),gapW:wAt(sc,"gap","gap"),nobody:wAt(sc,"gap","nobody"),change:c.change,
    wrote:c.wrote,mag:wAt(sc,"wrote","magazine"),eff:c.named,effW:wAt(sc,"named","Cupertino effect"),
    warning:c.warning,readW:wAt(sc,"warning","read"),makers:c.makers,added:wAt(sc,"makers","added"),knew:wAt(sc,"makers","knew"),
    benefit:c.benefit,longer:wAt(sc,"benefit","no longer"),readers:wAt(sc,"benefit","readers"),
    data:c.data,read:wAt(sc,"data","empty"),answered:wAt(sc,"data","412"),fixed:c.fixed,said:wAt(sc,"fixed","said"),a38:wAt(sc,"fixed","38"),n374:wAt(sc,"fixed","374"),
    title:c.breath+0.3}));
  ag_shots(ctx,S,t,sc.dur,[
    // the office, about 2000: the camera glides in to the screen as the writer types; the checker marks a slip and offers the word it knows
    {at:0,place:"ra_office",keys:[[0,960,540,1],[c.when+2.2,...RA_ZOOM]],d:3.4,push:0.006,draw:(x,tt)=>{
      const fix=ag_in(tt,P.does+0.25,0.5),n=tt<P.does+0.8?ra_typed(tt,P.type0,24,9):24+ra_typed(tt,P.does+0.9,10,10),m=ra_menuAt(x,RA_SLIP,"delegatoins",0);
      const pa=ag_io(tt,P.offers+0.3,P.does+0.6,0.3),pu=ag_sine((tt-P.offers-0.3)/0.8),from=[1100,640];
      ra_screen(x,{lines:[RA_SLIP],typed:{line:0,n},caret:{line:0,a:ag_in(tt,P.type0-0.4,0.3),t:tt},mark:{line:0,word:"delegatoins",u:(tt-P.marks)/0.5,a:1-fix},
        popup:{line:0,word:"delegatoins",items:["delegations","Ignore"],a:ag_io(tt,P.offers,P.does+0.25,0.25),k:tt-P.offers,hi:ag_in(tt,P.offers+1.0,0.2)},
        swap:{line:0,from:"delegatoins",to:"delegations",u:(tt-P.does-0.25)/0.5},pointer:m?[lerp(from[0],m.first[0],pu),lerp(from[1],m.first[1],pu),pa]:null});
      const ch=ra_pop(tt,P.spell-0.2,P.marks-0.2);dq_chip(x,170,90,"About 2000 · the UN, the EU and NATO",{icon:"calendar",a:ch.a*(1-ag_in(tt,c.when+2.0,0.5))});}},
    // the checker's word list: co-operation, with a hyphen, but not cooperation
    {at:P.lists-0.25,place:"ra_desk",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      ra_printout(x,200,120,{w:640,words:[{w:"cooking"},{w:"cool"},{w:"co-operate"},{w:"co-operation"},{w:"cooperation",gap:true,fill:0},{w:"co-ordinate"},{w:"cop"},{dots:true},{w:"cupboard"},{w:"Cupertino"}],
        lit:tt>P.hyphen-0.3?[3]:[]});
      const k=ra_pop(tt,P.lists+0.3,null);dq_textCard(x,980,250,620,{kick:"A checker's word list",title:"co-operation, but not cooperation"},{k:k.k,a:k.a});}},
    // the screen again: the writer types Cooperation; the checker marks it, and offers Cupertino first; the writer takes it
    {at:P.typed-0.25,place:"ra_office",keys:[[0,...RA_ZOOM]],push:0.008,cut:true,draw:(x,tt)=>{
      const L=RA_LINES,m=ra_menuAt(x,L[3],"Cooperation",3),took=P.tookW+0.15,sw=(tt-took-0.25)/0.5,n=tt<took+0.8?ra_typed(tt,P.typed-0.2,15,8):15+ra_typed(tt,took+0.9,11,10);
      const pu=ag_sine((tt-P.took+0.5)/0.9),pa=ag_io(tt,P.took-0.6,took+0.6,0.3),from=[1110,640];
      ra_screen(x,{lines:L,typed:{line:3,n},caret:{line:3,a:1,t:tt},mark:{line:3,word:"Cooperation",u:(tt-P.marked)/0.5,a:1-ag_in(tt,took+0.25,0.4)},
        popup:{line:3,word:"Cooperation",items:["Cupertino","Ignore"],a:ag_io(tt,P.first-0.1,took+0.25,0.25),k:tt-P.first+0.1,hi:ag_in(tt,took-0.25,0.2)},
        swap:{line:3,from:"Cooperation",to:"Cupertino",u:sw},pointer:m?[lerp(from[0],m.first[0],pu),lerp(from[1],m.first[1],pu),pa]:null});
      const cp=ra_pop(tt,P.cal-0.1,took);if(m)dq_chip(x,m.x+330,m.y+70,"Cupertino, a city in California",{a:cp.a});}},
    // on the desk: the NATO report of 1999; hundreds on the organisations' websites by 2006; the three things that made it; the
    // translators' magazine, 2000; the fault's name
    {at:P.nato-0.25,place:"ra_desk",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      const out1=P.hundreds-0.4,ra=ag_in(tt,P.nato-0.25,0.3)*(1-ag_in(tt,out1,0.4));
      if(ra>0){ra_page(x,200,190,1060,640,{line:"Organization for Security and Cupertino in Europe",word:"Cupertino",lit:ag_in(tt,P.named-0.1,0.5),lineAt:5,size:32,angle:-0.015,a:ra});
        const ch=ra_pop(tt,P.report-0.2,out1);dq_chip(x,1390,240,"1999 · a NATO report",{icon:"calendar",a:ch.a});
        const g=ra_pop(tt,P.guess-0.2,out1);dq_textCard(x,1360,520,440,{title:"Readers had to guess"},{icon:"why",k:g.k,a:g.a});}
      const out2=P.gap-0.4,pa=ag_in(tt,P.hundreds,0.3)*(1-ag_in(tt,out2,0.4));
      if(pa>0){ra_screens(x,180,170,{cols:6,rows:4,pw:178,ph:128,n:(tt-P.hundreds)*12,a:pa});
        const ch=ra_pop(tt,P.hundreds+0.2,out2);dq_chip(x,1390,240,"By 2006",{icon:"calendar",a:ch.a});
        const h=ra_pop(tt,P.hund-0.1,out2);dq_textCard(x,1360,330,440,{title:"Hundreds",sub:"on the organisations' websites"},{k:h.k,a:h.a});}
      const out3=P.wrote-0.4,C3=[["A confident machine","It marks, and offers a word",P.conf,null,"chat"],["A gap in what it read","No cooperation in its list",P.gapW,true,"list"],["Nobody reading after it","The word goes out as offered",P.nobody,null,"person"]];
      C3.forEach(([s,sub,t0,dash,ic],i)=>{const p=ra_pop(tt,t0-0.15,out3);dq_textCard(x,150+i*560,370,520,{title:s,sub},{k:p.k,a:p.a,dash:dash||undefined,icon:ic});});
      const ma=ag_in(tt,P.wrote,0.3);if(ma>0){ra_page(x,300,160,820,720,{head:true,cols:2,line:"Cupertino",word:"Cupertino",lit:ag_in(tt,P.mag-0.2,0.5),lineAt:3,size:32,angle:0.02,a:ma,seed:13});
        const ch=ra_pop(tt,P.wrote+0.3,null);dq_chip(x,1250,230,"2000 · the translators' magazine",{icon:"calendar",a:ch.a});
        const e=ra_pop(tt,P.effW-0.4,null);dq_textCard(x,1240,420,560,{kick:"A name for the fault",title:"The Cupertino effect"},{k:e.k,a:e.a});}}},
    // the warning: read what the checker offers before you take it (a person looks before it goes on: amber, hold)
    {at:P.warning-0.25,place:"ra_office",keys:[[0,...RA_ZOOM]],push:0.008,cut:true,draw:(x,tt)=>{
      const m=ra_screen(x,{lines:RA_LINES,mark:{line:3,word:"Cooperation",u:1},popup:{line:3,word:"Cooperation",items:["Cupertino","Ignore"],a:1}});
      if(m)dq_tag(x,m.x+m.w+150,m.y+64,"hold",{to:[m.x+m.w-6,m.y+28],text:"READ IT FIRST",k:tt-P.readW+0.3,a:ag_in(tt,P.readW-0.3,0.2)});}},
    // the makers' fix: cooperation added to the word list, a word the checker knows
    {at:P.makers-0.25,place:"ra_desk",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      ra_printout(x,200,120,{w:640,words:[{w:"cooking"},{w:"cool"},{w:"co-operate"},{w:"co-operation"},{w:"cooperation",gap:true,fill:ag_in(tt,P.added,0.8),mark:tt>P.knew-0.2?"pass":null},{w:"co-ordinate"},{w:"cop"},{dots:true},{w:"cupboard"},{w:"Cupertino"}],lit:[]});
      const k=ra_pop(tt,P.makers+0.4,null);dq_textCard(x,980,250,620,{kick:"The makers' word lists",title:"cooperation added"},{k:k.k,a:k.a});}},
    // by 2007: cooperation typed, and left as it is
    {at:P.benefit-0.25,place:"ra_office",keys:[[0,...RA_ZOOM]],push:0.008,cut:true,draw:(x,tt)=>{
      ra_screen(x,{lines:RA_LINES,typed:{line:3,n:ra_typed(tt,P.benefit-0.25,26,9)},caret:{line:3,a:1,t:tt},stamp:{line:3,word:"Cooperation",a:ag_in(tt,P.readers-0.3,0.4)}});
      const ch=ra_pop(tt,P.benefit+0.2,null);dq_chip(x,170,90,"By 2007",{icon:"calendar",a:ch.a});}},
    // the university, October 2026: the agent read an empty column and answered 412; once the data said what empty means, 38
    {at:P.data-0.25,place:"bench",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      const fx=ag_in(tt,P.said,0.5);
      ra_chat(x,110,150,940,520,{q:"Which December graduates haven't confirmed their name?",who:"Malia",qA:1,ans:"graduates",big:fx<0.5?412:38,ansA:ag_in(tt,P.answered-0.4,0.3)*(1-0.9*ag_io(tt,P.said-0.3,P.said+0.3,0.3)),t:tt,
        sub:fx>=0.5?"No confirmation of either kind":null,subA:ag_in(tt,P.a38,0.4)});
      ra_agent(x,RA_AG[0],RA_AG[1],RA_AG[2],{t:tt,core:0.8,think:ag_io(tt,P.read-0.6,P.answered-0.3,0.3),label:"Genie Agent"});
      const ch=ra_pop(tt,P.data,null);dq_chip(x,1180,170,"October 2026 · the university",{icon:"calendar",a:ch.a});
      const n=ra_pop(tt,P.n374-0.3,null);dq_figure(x,1440,420,"374",null,{col:"steel",a:n.a,size:110});if(n.a>0)dq_T(x,"graduates not asked again",1440,490,{w:600,size:30,col:DQ.soft,a:n.a});}}
  ]);
  dq_title(ctx,S,t,P.title,RA_TITLE,"Quality as a habit · Film 3 of 4","Data quality");});

// the list's rows, as the Catalog Explorer's sample shows them: an empty date is an empty cell, outlined so it shows; how (from chapter 4)
const RA_ROWS=[["S-20311","DEC26-2","2026-10-14","portal"],["S-17790","DEC26-1","","paper"],["S-20457","DEC26-5","2026-10-12","portal"],["S-19032","DEC26-4","",""],["S-20518","DEC26-3","2026-10-19","portal"],["S-18206","DEC26-6","","paper"]];
// the list in its page: o.how adds the new column (0 to 1), o.lit lights the empty dates, o.mark the paper ones
function ra_list(ctx,x,y,w,h,o){o=o||{};return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"graduation_list",a:o.a,k:o.k,draw:(c,b)=>{
    const how=o.how||0,cols=[{h:"Student",w:190,f:"mono"},{h:"Ceremony",w:200,f:"mono"},{h:"name_confirmed_on",w:400,f:"mono"}].concat(how>0?[{h:"how",w:150,f:"mono"}]:[]);
    const lit=o.lit>0?RA_ROWS.map((r,i)=>r[2]?-1:i).filter(i=>i>=0):[];
    c.save();dq_rows(c,b.x+10,b.y+6,cols,RA_ROWS.map(r=>[r[0],r[1],r[2]||" "].concat(how>0?[{s:r[3]||" ",col:r[3]==="paper"&&o.paper?"steel":null}]:[])),{rh:52,lit:o.lit>0?lit:null,litCol:o.litCol});c.restore();
    // the empty dates: a dashed outline where nothing is written
    RA_ROWS.forEach((r,i)=>{const ry=b.y+6+52*(i+1);if(!r[2])dq_card(c,b.x+10+390+10,ry+8,170,36,{dash:[8,7],r:5,a:1});if(how>0&&!r[3])dq_card(c,b.x+10+790+10,ry+8,110,36,{dash:[8,7],r:5,a:how});});
    if(how>0&&how<1){c.save();c.globalAlpha*=1-how;c.fillStyle="rgb(252,250,245)";c.fillRect(b.x+10+790,b.y,170,b.h);c.restore();}}});}
// a person's name and role, faded as one
const ra_tag=(ctx,x,y,who,a,o)=>dq_nameTag(ctx,x,y,who,Object.assign({a},o||{}));

// ---- 2 · 412, with confidence: Malia asks the graduations team's agent; it answers 412 at once; she drafts, then reads it again ----
scene("answer",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({day:c.day,printer:wAt(sc,"weeks","printer"),weeks:c.weeks,asks:c.asks,malia:wAt(sc,"asks","Malia"),agent:wAt(sc,"asks","agent"),
    which:wAt(sc,"asks","which"),reads:wAt(sc,"answers","reads"),n412:wAt(sc,"answers","412"),sure:c.sure,draft:c.draft,drafts:wAt(sc,"draft","drafts"),
    again:c.again,before:wAt(sc,"again","before"),readsA:wAt(sc,"again","reads"),fifth:c.fifth,fifthW:wAt(sc,"fifth","fifth"),march:c.march,m95:wAt(sc,"march","95"),
    fit:c.fit,fitW:wAt(sc,"fit","fit"),mei:c.mei,meiW:wAt(sc,"mei","Mei")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1]],push:0.015,draw:(x,tt)=>{
    // Malia behind the bench, on the right; she moves a little left when Mei comes
    const mx=lerp(1560,1500,ag_sine((tt-P.meiW+0.6)/1.4)),meiX=lerp(2180,1810,ag_sine((tt-P.meiW+0.8)/1.6));
    if(tt>P.meiW-0.8)ra_person(x,"mei",meiX,0.96,{t:tt,flip:true,a:ag_in(tt,P.meiW-0.8,0.5)});
    ra_person(x,"malia",mx,0.98,{t:tt,flip:true,gaze:[tt>P.readsA-0.3&&tt<P.fit+1?-1:2,tt>P.readsA-0.3&&tt<P.fit+1?1:0],talk:ag_io(tt,P.which,P.which+1.6,0.2)*(0.5+0.5*Math.sin(tt*9))});
    ra_tag(x,1250,214,"malia",ag_io(tt,P.malia-0.2,P.n412,0.4));
    ra_tag(x,1590,214,"mei",ag_in(tt,P.meiW,0.4),{role:"Answers for the list"});
    // the day, and the date the list goes to the printer: a requirement, brass
    const d0=ra_pop(tt,P.day-0.2,P.asks-0.4);dq_chip(x,110,210,"Thursday 22 October 2026",{icon:"calendar",a:d0.a});
    const pr=ra_pop(tt,P.weeks+0.3,P.asks-0.4);dq_textCard(x,110,290,820,{kick:"December's ceremonies",title:"The list goes to the printer",sub:"Thursday 12 November, 5 pm"},{edge:"brass",icon:"printer",k:pr.k,a:pr.a});
    // the agent's page: her question, and its answer at once, 412, in violet
    const ca=ag_in(tt,P.asks-0.1,0.4);ra_chat(x,100,130,900,410,{q:"Which December graduates haven't confirmed their name?",qA:ag_in(tt,P.which-0.2,0.3),who:"Malia",
      ans:"graduates",big:412,ansA:ag_in(tt,P.n412-0.2,0.3),t:tt,a:ca*(1-ag_in(tt,P.fifth-0.3,0.4))});
    ra_agent(x,RA_AG[0],RA_AG[1],RA_AG[2],{t:tt,a:ag_in(tt,P.agent-0.3,0.4),k:tt-P.agent+0.3,core:0.8,think:ag_io(tt,P.which,P.n412-0.1,0.3),label:"Genie Agent"});
    // her email to all 412, drafted; then held while she reads the answer again (amber: a person looks before it goes on)
    const em=ra_pop(tt,P.drafts-0.1,P.fifth-0.2),eb=dq_textCard(x,100,570,900,{kick:"Draft · to 412 graduates",title:"Please confirm your name before it's printed"},{icon:"mail",k:em.k,a:em.a});
    if(em.a>0)dq_tag(x,760,eb.y+eb.h+46,"hold",{to:[812,eb.y+eb.h-8],k:tt-P.before+0.2,a:em.a*ag_in(tt,P.before-0.2,0.2),size:28});
    // a fifth of the list, ten days in, against March's 95 in 100 in two weeks: the measure (steel) far outside what she knows (brass)
    const bd=ra_pop(tt,P.fifthW+0.2,null);if(bd.a>0)dq_band(x,100,170,900,{label:"Not confirmed, ten days in",min:0,max:25,ticks:5,fmt:v=>Math.round(v)+"%",lo:0,hi:5,u:ag_in(tt,P.m95-0.3,1.0),hiText:"March: 5 in 100",
      v:19.3,vu:ag_in(tt,P.fifthW+0.4,1.2),vText:"412: a fifth",k:bd.k,a:bd.a});
    const mc=ra_pop(tt,P.march-0.1,null);dq_textCard(x,100,500,900,{kick:"In March",title:"95 in 100 answered within the portal's two weeks"},{edge:"brass",icon:"calendar",k:mc.k,a:mc.a});
    const fc=ra_pop(tt,P.fitW-0.3,null);dq_chip(x,100,720,"Doesn't fit what she knows",{icon:"why",a:fc.a});
  }}]);
  ra_kick(ctx,S,t,"2","412, with confidence",P.day+3.6);});

// ---- 3 · Empty meant two things: 38 not yet, 374 on paper; the description said only a date; the agent can't ask; a Cupertino ----
scene("empty",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({counted:wAt(sc,"counted","counted"),emptyC:wAt(sc,"counted","empty"),two:wAt(sc,"two","two things"),
    yet:c.yet,n374:wAt(sc,"paper","374"),pform:wAt(sc,"paper","paper form"),said:c.said,desc:wAt(sc,"said","description"),nobody:c.nobody,emptyN:wAt(sc,"nobody","empty"),
    desk:c.desk,deskW:wAt(sc,"desk","desk"),reads:c.reads,readsW:wAt(sc,"reads","reads"),cup:c.cupertino,c412:wAt(sc,"cupertino","412"),cupW:wAt(sc,"cupertino","Cupertino"),
    part:c.part,partW:wAt(sc,"part","part"),iso:c.iso,und:wAt(sc,"iso","understandability"),fault:c.fault,faultW:wAt(sc,"fault","fault"),descF:wAt(sc,"fault","description")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the bench: Malia and Mei where chapter 2 left them; the list's empty dates, then what they mean
    {at:0,place:"bench",keys:[[0,960,540,1]],push:0.015,draw:(x,tt)=>{
      ra_person(x,"mei",1810,0.96,{t:tt,flip:true,talk:ag_io(tt,P.two,P.two+5,0.3)*(0.4+0.4*Math.sin(tt*8.3))});
      ra_person(x,"malia",1500,0.98,{t:tt,flip:true});
      ra_tag(x,1590,214,"mei",1-ag_in(tt,2.2,0.5),{role:"Answers for the list"});
      ra_agent(x,RA_AG[0],RA_AG[1],RA_AG[2],{t:tt,core:0.7,think:ag_io(tt,P.readsW-0.2,P.readsW+2.4,0.3),label:"Genie Agent"});
      const out=P.said-0.5,la=ag_in(tt,0.4,0.4)*(1-ag_in(tt,out,0.4));
      if(la>0)ra_list(x,90,110,880,500,{a:la,lit:ag_in(tt,P.emptyC-0.2,0.3)});
      const yc=ra_pop(tt,P.yet-0.1,out),pc=ra_pop(tt,P.n374-0.1,out);
      dq_textCard(x,90,640,420,{title:"38",sub:"haven't confirmed yet"},{icon:"hourglass",k:yc.k,a:yc.a});
      dq_textCard(x,540,640,430,{title:"374",sub:"confirmed on the paper form"},{icon:"form",k:pc.k,a:pc.a});
      // the column's description in Catalog Explorer: a date, and nothing on what empty means
      const da=ag_in(tt,out+0.5,0.4);if(da>0)dq_window(x,90,150,900,420,{logo:"databricks",product:"Databricks",title:"Catalog Explorer",a:da,draw:(cc,b)=>{
        ra_descCard(cc,b.x+10,b.y+8,b.w-20,[{k:"Description",v:"Date the graduate confirmed their name."},{k:"Empty means",dash:true}],{head:"name_confirmed_on",type:"date",rowA:i=>i?ag_in(tt,P.emptyN-0.2,0.4):1});}});
      // the agent reads what's written: a soft violet thread from the page to the sphere
      const ra_=ag_io(tt,P.readsW-0.3,P.cup-0.6,0.4);if(ra_>0){x.save();x.globalAlpha*=ra_;x.setLineDash([3,12]);x.lineCap="round";x.strokeStyle=rgba(RA_VIOLET,0.8);x.lineWidth=4;
        x.beginPath();x.moveTo(990,330);x.quadraticCurveTo(1080,300,RA_AG[0]-RA_AG[2]-8,RA_AG[1]-10);x.lineDashOffset=-tt*30;x.stroke();x.restore();}
      const dk=ra_pop(tt,P.deskW-0.6,P.cup-0.4);dq_textCard(x,1250,96,520,{title:"Mei knows",sub:"The agent can't walk over and ask"},{icon:"person",k:dk.k,a:dk.a});}},
    // on the bench from above: the agent's 412 beside the checker's Cupertino; a description is part of the data; the standard's word; two faults
    {at:P.cup-0.25,place:"benchTop",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      const o1=P.part-0.4,a1=1-ag_in(tt,o1,0.4);
      if(a1>0){dq_T(x,"A checker, about 2000",300,300,{w:700,size:32,dark:true,a:a1});x.save();x.translate(300,350);x.scale(1.5,1.5);ra_menu(x,0,0,["Cupertino","Ignore"],{a:a1});x.restore();
        const aa=a1*ag_in(tt,P.c412-0.6,0.3);dq_T(x,"An agent, 2026",1000,300,{w:700,size:32,dark:true,a:aa});
        x.save();x.globalAlpha*=aa;dq_card(x,1000,350,620,210,{on:"granite"});x.fillStyle=rgba(RA_VIOLET,0.9);rr(x,1032,380,7,150,3.5);x.fill();
        dq_T(x,"412",1068,490,{w:800,size:110,color:rgba(RA_VIOLET,1)});dq_T(x,"graduates",1068+dq_tw(x,"412",{w:800,size:110})+24,490,{w:600,size:36,color:rgba(RA_VIOLET,1)});x.restore();
        const cw=ra_pop(tt,P.cupW-0.2,o1);dq_chip(x,960,680,"Both confident, and both read a gap",{align:"center",a:cw.a});}
      const pa=ra_pop(tt,P.part+0.15,null);ra_descCard(x,120,150,860,[{k:"Means",v:"The day of the graduate's answer in the portal"},{k:"Empty means",v:"Not confirmed in the portal"},{k:"Owner",v:"Mei Tanaka"}],{head:"name_confirmed_on",type:"date",on:"granite",k:pa.k,a:pa.a});
      if(pa.a>0)dq_label(x,120,120,"Part of the data",{dark:true,a:pa.a});
      const io=ra_pop(tt,P.und-0.6,null);dq_textCard(x,1080,150,700,{kick:"ISO/IEC 25012",title:"Understandability",sub:"Data its users can read and interpret"},{edge:"brass",icon:"lens",on:"granite",k:io.k,a:io.a});
      const f1=ra_pop(tt,P.faultW-0.5,null),f2=ra_pop(tt,P.descF-0.3,null);
      dq_textCard(x,120,640,820,{kick:"A fault in the data",title:"Empty means two things"},{icon:"warn",on:"granite",k:f1.k,a:f1.a});
      dq_textCard(x,980,640,800,{kick:"A fault in the data",title:"A description that doesn't say so"},{icon:"warn",on:"granite",k:f2.k,a:f2.a});}}
  ]);
  ra_kick(ctx,S,t,"3","Empty meant two things",5.4);});

// ---- 4 · What empty means, written down: Noor finds the paper form; Jun adds how; the description in Mei's words; 38 ----
scene("written",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({first:c.first,noor:wAt(sc,"noor","Noor"),pform:wAt(sc,"noor","paper form"),how:c.how,jun:wAt(sc,"how","Jun"),
    column:wAt(sc,"how","column"),portal:wAt(sc,"how","portal"),emptyH:wAt(sc,"how","empty"),words:c.words,writes:wAt(sc,"words","writes"),means:c.means,emptyis:c.emptyis,owner:c.owner,
    dbt:c.dbt,uc:wAt(sc,"dbt","Unity Catalog"),agentD:wAt(sc,"dbt","agent"),lists:c.lists,makers:wAt(sc,"lists","makers"),again:c.again,a38:wAt(sc,"again","38"),shows:wAt(sc,"again","shows"),
    writesM:c.writes,check:c.check,pointed:wAt(sc,"check","pointed"),n76:wAt(sc,"check","76"),become:wAt(sc,"check","become")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the bench: Noor finds the paper form in the student system; Jun adds a column that says how each name was confirmed
    {at:0,place:"bench",keys:[[0,960,540,1]],push:0.015,draw:(x,tt)=>{
      ra_person(x,"noor",1800,0.96,{t:tt,flip:true});ra_person(x,"jun",1450,0.98,{t:tt,flip:true});
      ra_tag(x,1590,214,"noor",ag_io(tt,P.noor-0.2,P.how+1.5,0.4));ra_tag(x,1190,214,"jun",ag_io(tt,P.jun-0.2,P.words-0.5,0.4));
      const fi=ra_pop(tt,c.first+0.3,P.noor-0.5);dq_textCard(x,90,170,700,{kick:"First",title:"Fix the data",sub:"Then write down what it means"},{icon:"tools",k:fi.k,a:fi.a});
      const sa=ag_in(tt,P.noor-0.3,0.4)*(1-ag_in(tt,P.how+0.2,0.4));
      if(sa>0)dq_window(x,90,150,900,420,{product:"Student system",title:"Graduation application",a:sa,draw:(cc,b)=>{
        dq_record(cc,b.x+10,b.y+8,b.w-20,{head:"Application",id:"S-17790",rows:[{k:"Ceremony",v:"DEC26-1"},{k:"Form",v:"paper"},{k:"Received",v:"2025-11-18"}]},{lit:tt>P.pform-0.2?1:null,fixed:true});}});
      const la=ag_in(tt,P.how+0.6,0.4);if(la>0)ra_list(x,90,150,1000,500,{a:la,how:ag_in(tt,P.column,0.6),paper:tt>P.portal});}},
    // a later moment: Jun writes the description in Mei's words, row by row, with Mei
    {at:P.words-0.4,place:"bench",keys:[[0,960,540,1]],later:true,dis:0.45,push:0.015,draw:(x,tt)=>{
      ra_person(x,"mei",1800,0.96,{t:tt,flip:true,talk:ag_io(tt,P.means,P.owner+2,0.3)*(0.3+0.3*Math.sin(tt*7.7))});ra_person(x,"jun",1450,0.98,{t:tt,flip:true});
      const R=[{k:"Means",v:"The day of the graduate's answer in the portal, for this ceremony, once accepted"},{k:"Empty means",v:"Not confirmed in the portal: name_confirmed_how says if it was on paper"},{k:"Owner",v:"Mei Tanaka, registrar's office"}],T0=[P.means,P.emptyis,P.owner];
      ra_descCard(x,90,150,1040,R,{head:"name_confirmed_on",type:"date",rowA:i=>ag_in(tt,T0[i]-0.2,0.4)});
      const w=ra_pop(tt,P.words+0.3,null);dq_chip(x,90,110,"In Mei's words, for a reader who can't ask",{icon:"person",a:w.a});}},
    // on the bench from above: dbt writes it into Unity Catalog on every run; and the word list's fix, beside it
    {at:P.dbt-0.25,place:"benchTop",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      const o1=P.lists-0.4,a1=1-ag_in(tt,o1,0.4);
      if(a1>0){dq_window(x,90,170,800,430,{logo:"dbt",product:"dbt",title:"_graduations__models.yml",on:"granite",a:a1,draw:(cc,b)=>{
          dq_code(cc,b.x+14,b.y+10,["- name: name_confirmed_on","  description: >",[["    The day of the graduate's",DQ.soft]],[["    answer in the portal…",DQ.soft]],"  meta:",[["    owner: Mei Tanaka",DQ.soft]]],{size:28,lh:46});}});
        const ua=ag_in(tt,P.uc-0.4,0.4)*a1;x.save();x.globalAlpha*=ua;x.strokeStyle=rgba(DQ.chalkSoft,0.9);x.lineWidth=4;x.lineCap="round";x.beginPath();x.moveTo(910,385);x.lineTo(1010,385);x.moveTo(992,368);x.lineTo(1010,385);x.lineTo(992,402);x.stroke();
        dq_T(x,"every run",960,350,{w:700,size:28,align:"center",dark:true});x.restore();
        dq_window(x,1030,170,800,430,{logo:"databricks",product:"Databricks",title:"Unity Catalog",on:"granite",a:ua,draw:(cc,b)=>{
          ra_descCard(cc,b.x+10,b.y+8,b.w-20,[{k:"Means",v:"The day of the graduate's answer in the portal…"},{k:"Owner",v:"Mei Tanaka"}],{head:"name_confirmed_on",labW:150});}});
        const rd=ra_pop(tt,P.agentD-0.3,o1);dq_chip(x,1430,680,"Where the agent reads it",{align:"center",a:rd.a,icon:"lens"});}
      const pa=ag_in(tt,P.lists-0.1,0.4);if(pa>0){ra_printout(x,240,140,{w:560,lh:60,words:[{w:"co-operate"},{w:"co-operation"},{w:"cooperation",gap:true,fill:1,mark:"pass"},{w:"co-ordinate"}],a:pa});
        ra_descCard(x,960,170,820,[{k:"Means",v:"The day of the graduate's answer in the portal"},{k:"Empty means",v:"Not confirmed in the portal"},{k:"Owner",v:"Mei Tanaka"}],{head:"name_confirmed_on",on:"granite",k:tt-P.makers+0.6,a:ag_in(tt,P.makers-0.6,0.4)});
        dq_T(x,"What the checker read",240,640,{w:700,size:30,dark:true,a:pa});dq_T(x,"What the agent reads",960,640,{w:700,size:30,dark:true,a:ag_in(tt,P.makers-0.6,0.4)});}}},
    // the bench: asked again, the agent answers 38 and shows what it counted; Malia writes to the 38
    {at:P.again-0.25,place:"bench",keys:[[0,960,540,1]],push:0.015,cut:true,draw:(x,tt)=>{
      ra_person(x,"malia",1560,0.98,{t:tt,flip:true});
      ra_chat(x,100,130,900,440,{q:"Which December graduates haven't confirmed their name?",who:"Malia",ans:"graduates",big:38,ansA:ag_in(tt,P.a38-0.2,0.3),t:tt,
        sub:"Counted: no confirmation in the portal or on paper",subA:ag_in(tt,P.shows,0.4)});
      ra_agent(x,RA_AG[0],RA_AG[1],RA_AG[2],{t:tt,core:0.8,think:ag_io(tt,P.again,P.a38-0.1,0.3),label:"Genie Agent"});
      const em=ra_pop(tt,P.writesM-0.1,null);dq_textCard(x,100,600,900,{kick:"Sent · to 38 graduates",title:"Please confirm your name before it's printed"},{icon:"mail",k:em.k,a:em.a});}},
    // a later moment: Jun's check from Report, fix, tell, pointed at the new column: 76 held names become 7
    {at:P.check-0.4,place:"bench",keys:[[0,960,540,1]],later:true,dis:0.45,push:0.015,draw:(x,tt)=>{
      ra_person(x,"jun",1450,0.98,{t:tt,flip:true});
      const r=ra_pop(tt,P.check+0.3,null);dq_record(x,100,190,900,{head:"Check · Report, fix, tell",rows:[{k:"Holds",v:"a name the old form made, not confirmed"},
        {k:"Reads",was:tt>P.pointed?"name_confirmed_on":null,v:tt>P.pointed?"name_confirmed_how":"name_confirmed_on"},{k:"Held",was:tt>P.become-0.1?"76":null,v:tt>P.become-0.1?"7":"76",mark:"hold"}]},{k:r.k,a:r.a,lit:tt>P.become-0.1?2:null,litCol:"hold"});}}
  ]);
  ra_kick(ctx,S,t,"4","What empty means, written down",4.6);});

// ---- 5 · The agent proposes, people decide: Genie Code profiles, drafts and proposes three checks; Jun and Mei decide each ----
// a proposal: a card of fixed size with its number, its words and a line under them (sa: that line's alpha), and its tags: each [verdict,
// alpha], amber while it waits for a person, then what people decided, the new one coming in where the old one was
function ra_proposal(ctx,x,y,w,h,n,title,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:o.edge});dq_T(ctx,(o.kick||"Proposed check "+n).toUpperCase(),x+DQ_PAD,y+48,{w:800,size:28,ls:4,col:o.edge?dq_tone(o.edge).word:DQ.soft});
  dq_T(ctx,title,x+DQ_PAD,y+94,{w:700,size:34});if(o.strike>0){ctx.fillStyle=rgba(DQ.ink,0.85);ctx.fillRect(x+DQ_PAD-6,y+82,(dq_tw(ctx,title,{w:700,size:34})+12)*clamp(o.strike,0,1),3.5);}
  if(sub&&o.sa>0)dq_T(ctx,sub,x+DQ_PAD,y+134,{w:500,size:28,col:DQ.soft,a:o.sa});
  if(o.icon)dq_icon(ctx,o.icon,x+w-DQ_PAD-20,y+DQ_PAD+20,42,o.edge?dq_tone(o.edge).word:DQ.ink);
  for(const [v,ta] of o.tags||[])if(ta>0.004)dq_tag(ctx,x+w+44,y+h/2,v,{to:[x+w-6,y+h/2-16],a:ta,k:o.tk,size:28});
  ctx.restore();}
scene("proposes",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({asks:c.asks,gc:wAt(sc,"asks","Genie Code"),readA:wAt(sc,"asks","read"),does:c.does,profiles:wAt(sc,"does","profiles"),
    drafts:wAt(sc,"does","drafts"),proposes:wAt(sc,"does","proposes"),draft:c.draft,suggests:wAt(sc,"draft","name suggests"),owner:wAt(sc,"draft","owner"),review:c.review,meiR:wAt(sc,"review","Mei"),
    first:c.first,stop:wAt(sc,"stop","stop"),person:wAt(sc,"stop","person"),three:c.three,doc:wAt(sc,"three","document"),second:c.second,holds:wAt(sc,"second","holds"),
    third:c.third,fail:wAt(sc,"third","fail"),no:c.no,people:wAt(sc,"no","people"),count:c.count,countW:wAt(sc,"count","count"),trusted:wAt(sc,"count","trusted"),decide:c.decide,decideW:wAt(sc,"decide","decide")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1]],push:0.012,draw:(x,tt)=>{
    // Jun, and his own agent, Genie Code; Mei comes when the levels are hers to set
    const meiA=ag_in(tt,P.meiR-0.8,0.5),meiX=lerp(2140,1800,ag_sine((tt-P.meiR+0.8)/1.5));if(meiA>0)ra_person(x,"mei",meiX,0.96,{t:tt,flip:true,a:meiA});
    ra_person(x,"jun",1450,0.98,{t:tt,flip:true,talk:ag_io(tt,P.no,P.no+2.4,0.3)*(0.4+0.4*Math.sin(tt*8.9))});
    ra_tag(x,1590,214,"mei",ag_io(tt,P.meiR,P.first+2,0.4),{role:"Sets the levels"});
    const gA=ag_in(tt,P.gc-0.3,0.4);ra_agent(x,1130,330,62,{t:tt,a:gA,k:tt-P.gc+0.3,core:0.7,think:ag_io(tt,P.readA,P.draft,0.4),label:"Genie Code"});
    // its page: Jun's ask, what it did, and a draft, waiting for a person
    const wa=ag_in(tt,P.asks-0.1,0.4)*(1-ag_in(tt,P.review-0.4,0.4));
    if(wa>0)dq_window(x,80,130,900,620,{logo:"databricks",product:"Databricks",title:"Genie Code",a:wa,draw:(cc,b)=>{
      const qa=ag_in(tt,P.asks+0.2,0.3)*(1-ag_in(tt,P.does-0.2,0.3));if(qa>0){cc.save();cc.globalAlpha*=qa;const q="Read the list and the checks it runs",qw=dq_tw(cc,q,{w:600,size:30})+52,qx=b.x+b.w-qw-10;
        cc.fillStyle="rgba(232,226,212,1)";rr(cc,qx,b.y+20,qw,76,18);cc.fill();dq_T(cc,q,qx+26,b.y+70,{w:600,size:30});dq_T(cc,"Jun",b.x+b.w-10,b.y+134,{w:600,size:28,col:DQ.soft,align:"right"});cc.restore();}
      const L=[["Profiled every column of the list",P.profiles],["Drafted 9 descriptions",P.drafts],["Proposed 3 new checks",P.proposes]];
      L.forEach(([s_,t0],i)=>{const a=ag_in(tt,t0-0.2,0.4);if(a<=0)return;cc.save();cc.globalAlpha*=a;cc.fillStyle=rgba(RA_VIOLET,0.9);rr(cc,b.x+16,b.y+26+i*58,7,40,3.5);cc.fill();
        dq_T(cc,s_,b.x+42,b.y+56+i*58,{w:600,size:30,color:rgba(RA_VIOLET,1)});cc.restore();});
      const da=ag_in(tt,P.draft-0.2,0.4);if(da>0){const db=ra_descCard(cc,b.x+12,b.y+214,b.w-230,[{k:"Means",v:"How the graduate's name was confirmed"},{k:"Empty means",dash:true}],
          {head:"name_confirmed_how",labW:210,a:da,rowA:i=>i?ag_in(tt,P.owner-0.4,0.4):1});
        dq_tag(cc,b.x+b.w-170,b.y+214+db.h/2,"hold",{to:[b.x+b.w-222,b.y+214+db.h/2-16],k:tt-P.draft,a:da,size:28});}}});
    // the three proposals, each held for a person; then what Mei and Jun decided
    const y1=140,y2=330,y3=520,W_=740,H_=160,pr=i=>ra_pop(tt,P.review+0.1+i*0.25,null),k1=pr(0),k2=pr(1),k3=pr(2);
    const st=ag_in(tt,P.stop-0.1,0.4),no=ag_in(tt,P.no-0.1,0.5),cnt=ag_in(tt,P.countW-0.3,0.5);
    ra_proposal(x,80,y1,W_,H_,1,"A name not as its graduate gave it","Finds 3: changed names, waiting for a document",{a:k1.a,k:k1.k,sa:ag_in(tt,P.three,0.4),tags:[["hold",1-st],["stop",st]],tk:1});
    ra_proposal(x,80,y2,W_,H_,2,"The two confirmation columns agree","Holds for Jun if they don't",{a:k2.a,k:k2.k,sa:ag_in(tt,P.holds-0.2,0.4),tags:[["hold",1]],tk:1});
    if(cnt<1)ra_proposal(x,80,y3,W_,H_,3,"Every graduate has confirmed",no>0?"About what people do: not a check":"Would fail every night someone hasn't",{a:k3.a*(1-cnt),k:k3.k,sa:ag_in(tt,P.fail-0.2,0.4),strike:no,tags:[["hold",1-no]],tk:1});
    if(cnt>0)ra_proposal(x,80,y3,W_,H_,3,"38 not confirmed yet","The agent's answer to her question",{kick:"Malia's weekly count",edge:"steel",icon:"count",a:cnt,k:tt-P.countW+0.3,sa:ag_in(tt,P.trusted-0.3,0.4)});
    const dc=ra_pop(tt,P.decideW-0.8,null);dq_chip(x,450,770,"The agent proposes; people decide",{align:"center",a:dc.a,icon:"people"});
  }}]);
  ra_kick(ctx,S,t,"5","The agent proposes, people decide",4.8);});

// ---- 6 · Read it before you act: what spared the 374; read an agent's answer as a new colleague's; ask; the films before ----
scene("before",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({spared:c.spared,n374:wAt(sc,"spared","374"),reading:wAt(sc,"spared","reading"),read:c.read,col:wAt(sc,"read","colleague's"),
    countR:wAt(sc,"read","count"),fitR:wAt(sc,"read","fit"),ask:c.ask,show:wAt(sc,"ask","show"),person:wAt(sc,"ask","person"),films:c.films,ce:wAt(sc,"films","Context engineering"),
    cm:wAt(sc,"films","Context and memory"),step:c.step,descS:wAt(sc,"step","description"),qual:wAt(sc,"step","quality is")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"benchTop",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
    // the email to all 412, held while Malia read the answer: it never went
    const o1=P.read-0.4,a1=1-ag_in(tt,o1,0.4),e=ra_pop(tt,0.6,o1);
    if(a1>0){const eb=dq_textCard(x,140,200,880,{kick:"Draft · to 412 graduates",title:"Please confirm your name before it's printed"},{icon:"mail",on:"granite",k:e.k,a:e.a});
      dq_tag(x,1100,eb.y+60,"hold",{to:[eb.x+eb.w-8,eb.y+40],text:"READ FIRST",on:"granite",a:e.a*ag_in(tt,P.reading-0.4,0.3),k:tt-P.reading+0.4});
      const f=ra_pop(tt,P.n374-0.2,o1);dq_figure(x,1100,560,"374",null,{size:110,dark:true,a:f.a});if(f.a>0)dq_T(x,"graduates spared an email they didn't need",1100,630,{w:600,size:32,col:DQ.chalkSoft,a:f.a});}
    // read it as a new colleague's answer; ask it to show its working; ask the person who answers for the data
    const o2=P.films-0.4,Q=[["What did it count?",Math.min(P.countR,P.read+0.7),"lens",120,200],["Does it fit what you know?",P.fitR,"why",1000,200],["Show your working",P.show,"list",120,500],["Ask who answers for the data",P.person,"person",1000,500]];
    const kc=ra_pop(tt,P.read+0.1,o2);if(kc.a>0)dq_label(x,120,150,"Read it as a new colleague's answer",{dark:true,a:kc.a});
    Q.forEach(([s,t0,ic,qx,qy])=>{const p=ra_pop(tt,t0-0.3,o2);dq_textCard(x,qx,qy,800,{title:s},{icon:ic,on:"granite",k:p.k,a:p.a});});
    // the films before this one, and this film's step
    const o3=P.step-0.4,f1=ra_pop(tt,P.ce-0.3,o3),f2=ra_pop(tt,P.cm-0.3,o3);
    dq_textCard(x,120,260,800,{kick:"Agents at work on data",title:"Context engineering",sub:"What an agent reads decides what it writes"},{on:"granite",k:f1.k,a:f1.a});
    dq_textCard(x,1000,260,800,{kick:"Agents at work on data",title:"Context and memory, governed",sub:"How to keep what it reads right"},{on:"granite",k:f2.k,a:f2.a});
    const sp=ra_pop(tt,P.step+0.2,null);ra_descCard(x,300,190,1320,[{k:"Means",v:"The day of the graduate's answer in the portal, for this ceremony, once accepted"},{k:"Empty means",v:"Not confirmed in the portal: name_confirmed_how says if it was on paper"},{k:"Owner",v:"Mei Tanaka, registrar's office"}],
      {head:"name_confirmed_on",type:"date",on:"granite",k:sp.k,a:sp.a});
    const sq=ra_pop(tt,P.qual-0.3,null);dq_chip(x,960,720,"Its quality is the data's quality",{align:"center",a:sq.a});
  }}]);
  ra_kick(ctx,S,t,"6","Read it before you act",4.4,{dark:true});});

// ---- 7 · For a reader who can't ask: Monday's advice, the Cupertino's two halves, and the end ----
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({monday:wAt(sc,"monday","Monday"),table:wAt(sc,"monday","table"),each:c.each,wM:wAt(sc,"each","what it means"),
    wE:wAt(sc,"each","what empty"),unit:wAt(sc,"each","unit"),who:wAt(sc,"each","who answers"),fix:c.fix,fixW:wAt(sc,"fix","fix the data"),let:c.let,agents:wAt(sc,"let","agents"),people:wAt(sc,"let","people"),
    halves:c.halves,complete:wAt(sc,"halves","complete"),readW:wAt(sc,"halves","read what"),take:c.takeaway,end:c.breath+0.2}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"benchTop",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
    const o1=P.halves-0.4,m=ra_pop(tt,P.monday-0.3,o1);dq_chip(x,120,190,"On Monday",{icon:"calendar",a:m.a});
    const tb=ra_pop(tt,P.table-0.3,o1);dq_textCard(x,120,250,680,{title:"The table your agent reads most"},{icon:"table",on:"granite",k:tb.k,a:tb.a});
    // for each column: what it means, what empty means, its unit, who answers for it
    const ec=ra_pop(tt,P.each-0.2,o1),T0=[P.wM,P.wE,P.unit,P.who];
    ra_descCard(x,840,150,960,[{k:"Means",v:"What the column means"},{k:"Empty means",v:"What it means when it's empty"},{k:"Unit",v:"Its unit or format"},{k:"Owner",v:"Who answers for it"}],
      {head:"each column",on:"granite",k:ec.k,a:ec.a,rowA:i=>ag_in(tt,T0[i]-0.25,0.35)});
    const fx=ra_pop(tt,P.fixW-0.4,o1);dq_textCard(x,120,370,680,{title:"Fix the data, not only the words",sub:"Where empty means two things"},{on:"granite",k:fx.k,a:fx.a});
    const ag=ra_pop(tt,P.agents-0.3,o1),pp=ra_pop(tt,P.people-0.3,o1);
    const ab=dq_textCard(x,120,534,680,{title:"Agents draft and propose"},{on:"granite",k:ag.k,a:ag.a});if(ag.a>0)dq_tag(x,ab.x+ab.w+40,ab.y+ab.h/2,"hold",{to:[ab.x+ab.w-6,ab.y+ab.h/2-14],text:"WAITS",on:"granite",size:28,a:ag.a,k:tt-P.agents+0.3});
    dq_textCard(x,120,654,680,{title:"People review and decide"},{icon:"people",on:"granite",k:pp.k,a:pp.a});
    // the Cupertino's cure, two halves: complete what the machine reads; read what it offers before you take it
    const h1=ra_pop(tt,Math.min(P.complete-0.4,P.halves+0.3),P.take-0.3),h2=ra_pop(tt,P.readW-0.4,P.take-0.3);
    if(h1.a>0){ra_printout(x,200,200,{w:560,lh:60,words:[{w:"co-operate"},{w:"co-operation"},{w:"cooperation",gap:true,fill:1,mark:"pass"},{w:"co-ordinate"}],a:h1.a,k:h1.k});
      dq_T(x,"Complete what the machine reads",200,620,{w:700,size:32,dark:true,a:h1.a});}
    if(h2.a>0){x.save();x.globalAlpha*=h2.a;const mb=ra_menu(x,1060,260,["Cupertino","Ignore"],{k:h2.k});dq_tag(x,mb.x+mb.w+150,mb.y+64,"hold",{to:[mb.x+mb.w-6,mb.y+28],text:"READ IT FIRST",on:"granite",k:tt-P.readW+0.4});
      dq_T(x,"Read what it offers before you take it",1060,620,{w:700,size:32,dark:true});x.restore();}
  }}]);
  ra_kick(ctx,S,t,"7","For a reader who can't ask",4.2,{dark:true});
  dq_end(ctx,S,t,P.end,RA_TITLE,"Describe your data for a reader who can't ask.","Film 3 of 4","Quality as a habit");
  // the last line, where the end card writes it, over its veil: it stays as the veil comes, and the end card's own takes over in place
  const tk=ag_in(t,P.take-0.2,0.4)*(1-ag_in(t,P.end+0.6,0.9));if(tk>0){setScreen(ctx,S);dq_T(ctx,"Describe your data for a reader who can't ask.",960,340,{w:700,size:48,align:"center",dark:true,a:tk});}});

// chapters that open in the room the one before ends in: the camera glides on and only what changes fades; else it's a cut
ag_cutInto(["answer","empty","written","proposes","before","monday"]);

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
