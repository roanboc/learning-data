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

/* ===== Modern data basics: the tools' marks this module adds to The Inner Life of Data's (logos.js there: Databricks and dbt) =====
   Microsoft Fabric's and Power BI's product icons and Fabric's icon for a mirrored catalog, the official SVG files, unaltered, from
   Microsoft's own collection of Fabric icons (the npm package @fabric-msft/svg-icons 12.0.0, which Microsoft's page "Microsoft Fabric
   product, workload, and item icons" points to; files fabric_48_color.svg, power_bi_48_color.svg and mirrored_catalog_48_item.svg).
   Microsoft permits their use in architectural diagrams, training materials and documentation; they are trademarks of Microsoft,
   NOT covered by this repository's licences (MIT or CC BY 4.0), and used only to identify those products (NOTICE.md).
   Bundled only for a film whose film.json says "logos": true, after The Inner Life of Data's logos.js, so loadLogos() loads them too:
   logo(ctx, "fabric", x, y, h), logo(ctx, "powerbi", ...), logo(ctx, "fabricMirror", ...). Never crop, flip, rotate or recolour them. */
Object.assign(LOGO_SRC,{fabric:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsPSJ1cmwoI2k3ZmExYzEtYSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0ibTUuNjQgMzEuNi0uNTg2IDIuMTQ0Yy0uMjE4LjY4NS0uNTI0IDEuNjkzLS42ODkgMi41OWE1LjYzIDUuNjMgMCAwIDAgNC42MzggNy41ODhjLjc5Mi4xMTQgMS42ODguMTA4IDIuNjkyLS4wNGw0LjYxMy0uNjM2YTIuOTIgMi45MiAwIDAgMCAyLjQyMS0yLjEyN2wzLjE3NS0xMS42NjJMNS42NCAzMS41OTlaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSJ1cmwoI2k3ZmExYzEtYikiIGQ9Ik0xMC4xNCAzMi4xNTJjLTQuODYzLjc1My01Ljg2MSA0LjQyMy01Ljg2MSA0LjQyM2w0LjY1Ni0xNy4xMSAyNC4zMzMtMy4yOTItMy4zMTggMTIuMDUyYTEuNzEgMS43MSAwIDAgMS0xLjM4OCAxLjI0NGwtLjEzNi4wMjItMTguNDIzIDIuNjg0eiIvPjxwYXRoIGZpbGw9InVybCgjaTdmYTFjMS1jKSIgZmlsbC1vcGFjaXR5PSIuOCIgZD0iTTEwLjE0IDMyLjE1MmMtNC44NjMuNzUzLTUuODYxIDQuNDIzLTUuODYxIDQuNDIzbDQuNjU2LTE3LjExIDI0LjMzMy0zLjI5Mi0zLjMxOCAxMi4wNTJhMS43MSAxLjcxIDAgMCAxLTEuMzg4IDEuMjQ0bC0uMTM2LjAyMi0xOC40MjMgMi42ODR6Ii8+PHBhdGggZmlsbD0idXJsKCNpN2ZhMWMxLWQpIiBkPSJtMTIuODk5IDIxLjIzNSAyNi45MzgtMy45OGExLjYgMS42IDAgMCAwIDEuMzIzLTEuMTdsMi43OC0xMC4wNmExLjU5NSAxLjU5NSAwIDAgMC0xLjc0LTIuMDEyTDE2LjQ5OCA3LjgxYTcuMTkgNy4xOSAwIDAgMC01Ljc3NyA1LjE5M0w3LjAxMyAyNi40MzhjLjc0NC0yLjcxNyAxLjIwMi00LjM1NSA1Ljg4Ni01LjIwMyIvPjxwYXRoIGZpbGw9InVybCgjaTdmYTFjMS1lKSIgZD0ibTEyLjg5OSAyMS4yMzUgMjYuOTM4LTMuOThhMS42IDEuNiAwIDAgMCAxLjMyMy0xLjE3bDIuNzgtMTAuMDZhMS41OTUgMS41OTUgMCAwIDAtMS43NC0yLjAxMkwxNi40OTggNy44MWE3LjE5IDcuMTkgMCAwIDAtNS43NzcgNS4xOTNMNy4wMTMgMjYuNDM4Yy43NDQtMi43MTcgMS4yMDItNC4zNTUgNS44ODYtNS4yMDMiLz48cGF0aCBmaWxsPSJ1cmwoI2k3ZmExYzEtZikiIGZpbGwtb3BhY2l0eT0iLjQiIGQ9Im0xMi44OTkgMjEuMjM1IDI2LjkzOC0zLjk4YTEuNiAxLjYgMCAwIDAgMS4zMjMtMS4xN2wyLjc4LTEwLjA2YTEuNTk1IDEuNTk1IDAgMCAwLTEuNzQtMi4wMTJMMTYuNDk4IDcuODFhNy4xOSA3LjE5IDAgMCAwLTUuNzc3IDUuMTkzTDcuMDEzIDI2LjQzOGMuNzQ0LTIuNzE3IDEuMjAyLTQuMzU1IDUuODg2LTUuMjAzIi8+PHBhdGggZmlsbD0idXJsKCNpN2ZhMWMxLWcpIiBkPSJNMTIuODk5IDIxLjIzNmMtMy45MDEuNzA2LTQuODcgMS45NjItNS41MTQgMy45MzJMNC4yNzkgMzYuNTc3cy45OTItMy42MzMgNS43OTYtNC40MWwxOC4zNTItMi42NzMuMTM2LS4wMjJhMS43MSAxLjcxIDAgMCAwIDEuMzg4LTEuMjQ0bDIuNzMtOS45MTV6Ii8+PHBhdGggZmlsbD0idXJsKCNpN2ZhMWMxLWgpIiBmaWxsLW9wYWNpdHk9Ii4yIiBkPSJNMTIuODk5IDIxLjIzNmMtMy45MDEuNzA2LTQuODcgMS45NjItNS41MTQgMy45MzJMNC4yNzkgMzYuNTc3cy45OTItMy42MzMgNS43OTYtNC40MWwxOC4zNTItMi42NzMuMTM2LS4wMjJhMS43MSAxLjcxIDAgMCAwIDEuMzg4LTEuMjQ0bDIuNzMtOS45MTV6Ii8+PHBhdGggZmlsbD0idXJsKCNpN2ZhMWMxLWkpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC4wNzUgMzIuMTY3Yy00LjA2LjY1Ny01LjM5MiAzLjM0NS01LjcxIDQuMTY0YTUuNjMgNS42MyAwIDAgMCA0LjYzOCA3LjU5Yy43OTIuMTE0IDEuNjg4LjEwOCAyLjY5Mi0uMDM5bDQuNjEzLS42MzdhMi45MiAyLjkyIDAgMCAwIDIuNDIxLTIuMTI3bDIuODk0LTEwLjYzMy0xMS41NDcgMS42ODN6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imk3ZmExYzEtYSIgeDE9IjEyLjk1MyIgeDI9IjEyLjk1MyIgeTE9IjQ0LjAwMSIgeTI9IjI5LjQ1NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjA1NiIgc3RvcC1jb2xvcj0iIzJBQUM5NCIvPjxzdG9wIG9mZnNldD0iLjE1NSIgc3RvcC1jb2xvcj0iIzIzOUM4NyIvPjxzdG9wIG9mZnNldD0iLjM3MiIgc3RvcC1jb2xvcj0iIzE3N0U3MSIvPjxzdG9wIG9mZnNldD0iLjU4OCIgc3RvcC1jb2xvcj0iIzBFNjk2MSIvPjxzdG9wIG9mZnNldD0iLjc5OSIgc3RvcC1jb2xvcj0iIzA5NUQ1NyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzA4NTk1NCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJpN2ZhMWMxLWIiIHgxPSIzMS4zMzEiIHgyPSIxNy4yODYiIHkxPSIzMy40NDgiIHkyPSIxOC4xNzMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4wNDIiIHN0b3AtY29sb3I9IiNBQkU4OEUiLz48c3RvcCBvZmZzZXQ9Ii41NDkiIHN0b3AtY29sb3I9IiMyQUFBOTIiLz48c3RvcCBvZmZzZXQ9Ii45MDYiIHN0b3AtY29sb3I9IiMxMTc4NjUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iaTdmYTFjMS1jIiB4MT0iLTMuMTgyIiB4Mj0iMTAuMTgzIiB5MT0iMzIuNzA2IiB5Mj0iMjguMTQ4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzZBRDZGOSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzZBRDZGOSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9Imk3ZmExYzEtZCIgeDE9IjcuMDEzIiB4Mj0iNDIuNTg5IiB5MT0iMTUuMjE5IiB5Mj0iMTUuMjE5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMDQzIiBzdG9wLWNvbG9yPSIjMjVGRkQ0Ii8+PHN0b3Agb2Zmc2V0PSIuODc0IiBzdG9wLWNvbG9yPSIjNTVEREI5Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9Imk3ZmExYzEtZSIgeDE9IjcuMDEzIiB4Mj0iMzkuMDYiIHkxPSIxMC4yNDciIHkyPSIyNS4xMjgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjNkFENkY5Ii8+PHN0b3Agb2Zmc2V0PSIuMjMiIHN0b3AtY29sb3I9IiM2MEU5RDAiLz48c3RvcCBvZmZzZXQ9Ii42NTEiIHN0b3AtY29sb3I9IiM2REU5QkIiLz48c3RvcCBvZmZzZXQ9Ii45OTQiIHN0b3AtY29sb3I9IiNBQkU4OEUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iaTdmYTFjMS1mIiB4MT0iOS45NzgiIHgyPSIyNy40MDQiIHkxPSIxMy4wMzEiIHkyPSIxNi44ODUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ii40NTkiIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJpN2ZhMWMxLWciIHgxPSIxNS43NTYiIHgyPSIxNi4xNjgiIHkxPSIyNy45NiIgeTI9IjE1Ljc0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMjA1IiBzdG9wLWNvbG9yPSIjMDYzRDNCIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ii41ODYiIHN0b3AtY29sb3I9IiMwNjNEM0IiIHN0b3Atb3BhY2l0eT0iLjIzNyIvPjxzdG9wIG9mZnNldD0iLjg3MiIgc3RvcC1jb2xvcj0iIzA2M0QzQiIgc3RvcC1vcGFjaXR5PSIuNzUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iaTdmYTFjMS1oIiB4MT0iMi44MSIgeDI9IjE3LjcwMSIgeTE9IjI2Ljc0NCIgeTI9IjI5LjU0NSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iLjQ1OSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9Imk3ZmExYzEtaSIgeDE9IjEzLjU2NyIgeDI9IjEwLjY2MiIgeTE9IjM5Ljk3IiB5Mj0iMjUuNzY0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMDY0IiBzdG9wLWNvbG9yPSIjMDYzRDNCIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ii4xNyIgc3RvcC1jb2xvcj0iIzA2M0QzQiIgc3RvcC1vcGFjaXR5PSIuMTM1Ii8+PHN0b3Agb2Zmc2V0PSIuNTYyIiBzdG9wLWNvbG9yPSIjMDYzRDNCIiBzdG9wLW9wYWNpdHk9Ii41OTkiLz48c3RvcCBvZmZzZXQ9Ii44NSIgc3RvcC1jb2xvcj0iIzA2M0QzQiIgc3RvcC1vcGFjaXR5PSIuOSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzA2M0QzQiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==",powerbi:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0ibm9uZSI+PG1hc2sgaWQ9Imk1ZTUxMTEtbWFzazBfNTYwMTdfNDA4NjIiIHdpZHRoPSIzMCIgaGVpZ2h0PSI0MCIgeD0iOSIgeT0iNCIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI1LjY2NyA1LjY2N2MwLS45Mi43NDYtMS42NjcgMS42NjYtMS42NjdoMTBDMzguMjUzIDQgMzkgNC43NDYgMzkgNS42Njd2MzYuNjY1YzAgLjkyLS43NDYgMS42NjctMS42NjcgMS42NjdIMTAuNjY3Yy0uOTIgMC0xLjY2Ny0uNzQ2LTEuNjY3LTEuNjY3VjI1LjY2NmMwLS45Mi43NDctMS42NjYgMS42NjctMS42NjZoNi42Njd2LTguMzM0YzAtLjkyLjc0Ni0xLjY2NiAxLjY2Ni0xLjY2Nmg2LjY2N3oiLz48L21hc2s+PGcgbWFzaz0idXJsKCNpNWU1MTExLW1hc2swXzU2MDE3XzQwODYyKSI+PHBhdGggZmlsbD0idXJsKCNpNWU1MTExLXBhaW50MF9saW5lYXJfNTYwMTdfNDA4NjIpIiBkPSJNMzkgNHYzOS45OTlIMjUuNjY3VjR6Ii8+PGcgZmlsdGVyPSJ1cmwoI2k1ZTUxMTEtZmlsdGVyMF9kZF81NjAxN180MDg2MikiPjxwYXRoIGZpbGw9InVybCgjaTVlNTExMS1wYWludDFfbGluZWFyXzU2MDE3XzQwODYyKSIgZD0iTTMwLjY2NyAxNS42NjZWNDRIMTcuMzM0di0zMEgyOWMuOTIgMCAxLjY2Ny43NDcgMS42NjcgMS42NjciLz48L2c+PHBhdGggZmlsbD0idXJsKCNpNWU1MTExLXBhaW50Ml9saW5lYXJfNTYwMTdfNDA4NjIpIiBkPSJNOSAyNHYxOS45OTloMTMuMzM0VjI1LjY2NmMwLS45Mi0uNzQ3LTEuNjY2LTEuNjY3LTEuNjY2eiIvPjwvZz48ZGVmcz48ZmlsdGVyIGlkPSJpNWU1MTExLWZpbHRlcjBfZGRfNTYwMTdfNDA4NjIiIHdpZHRoPSIxOS45OTkiIGhlaWdodD0iMzYuNjY2IiB4PSIxNC4wMDEiIHk9IjExLjUiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJoYXJkQWxwaGEiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiLz48ZmVPZmZzZXQgZHk9Ii4xNTgiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIuMTU4Ii8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjIgMCIvPjxmZUJsZW5kIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd181NjAxN180MDg2MiIvPjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJoYXJkQWxwaGEiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiLz48ZmVPZmZzZXQgZHk9Ii44MzMiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxLjY2NyIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4xOCAwIi8+PGZlQmxlbmQgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfNTYwMTdfNDA4NjIiIHJlc3VsdD0iZWZmZWN0Ml9kcm9wU2hhZG93XzU2MDE3XzQwODYyIi8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0Ml9kcm9wU2hhZG93XzU2MDE3XzQwODYyIiByZXN1bHQ9InNoYXBlIi8+PC9maWx0ZXI+PGxpbmVhckdyYWRpZW50IGlkPSJpNWU1MTExLXBhaW50MF9saW5lYXJfNTYwMTdfNDA4NjIiIHgxPSIyMy40NDUiIHgyPSI0MS4wMjciIHkxPSI0IiB5Mj0iNDEuMjY4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0U2QUQxMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0M4N0UwRSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJpNWU1MTExLXBhaW50MV9saW5lYXJfNTYwMTdfNDA4NjIiIHgxPSIxNy4zMzMiIHgyPSIzMi4xMTkiIHkxPSIxNCIgeTI9IjQyLjY3NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNGNkQ3NTEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNFNkFEMTAiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iaTVlNTExMS1wYWludDJfbGluZWFyXzU2MDE3XzQwODYyIiB4MT0iOC45OTkiIHgyPSIxNy4xNyIgeTE9IjI0IiB5Mj0iNDMuMzY1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0Y5RTU4OSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Y2RDc1MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==",fabricMirror:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0idXJsKCNpNmEwYjQyLXBhaW50MF9saW5lYXJfNjc2NjFfMTAzKSIgZD0iTTUgMTBhNSA1IDAgMCAxIDUtNWgyOGE1IDUgMCAwIDEgNSA1djI4YTUgNSAwIDAgMS01IDVIMTBhNSA1IDAgMCAxLTUtNXoiLz48cGF0aCBmaWxsPSJ1cmwoI2k2YTBiNDItcGFpbnQxX3JhZGlhbF82NzY2MV8xMDMpIiBmaWxsLW9wYWNpdHk9Ii4yIiBkPSJNNSAxMGE1IDUgMCAwIDEgNS01aDI4YTUgNSAwIDAgMSA1IDV2MjhhNSA1IDAgMCAxLTUgNUgxMGE1IDUgMCAwIDEtNS01eiIvPjxwYXRoIGZpbGw9InVybCgjaTZhMGI0Mi1wYWludDJfbGluZWFyXzY3NjYxXzEwMykiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTM4IDZIMTBhNCA0IDAgMCAwLTQgNHYyOGE0IDQgMCAwIDAgNCA0aDI4YTQgNCAwIDAgMCA0LTRWMTBhNCA0IDAgMCAwLTQtNE0xMCA1YTUgNSAwIDAgMC01IDV2MjhhNSA1IDAgMCAwIDUgNWgyOGE1IDUgMCAwIDAgNS01VjEwYTUgNSAwIDAgMC01LTV6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSJ1cmwoI2k2YTBiNDItcGFpbnQzX2xpbmVhcl82NzY2MV8xMDMpIiBkPSJNMTguNSAxNGEyLjUgMi41IDAgMCAwLTIuNSAyLjV2MTVhMi41IDIuNSAwIDAgMCAyLjUgMi41aDEyLjc4MWEuNzUuNzUgMCAxIDAgMC0xLjVIMTguNWExIDEgMCAwIDEtMS0xbDEzLjc4MS4wMzFjLjQxNSAwIC43MTktLjMzNS43MTktLjc1di0xNC4yNWMwLTEuMzgtMS4wODgtMi41LTIuNDY5LTIuNXptMS41IDNoOGExIDEgMCAwIDEgMSAxdjFhMSAxIDAgMCAxLTEgMWgtOGExIDEgMCAwIDEtMS0xdi0xYTEgMSAwIDAgMSAxLTEiLz48cGF0aCBmaWxsPSJ1cmwoI2k2YTBiNDItcGFpbnQ0X2xpbmVhcl82NzY2MV8xMDMpIiBkPSJNMzggMzUuNzYxYS44NS44NSAwIDAgMC0xLjQwMy0uNjQ1bC00LjY1NCAzLjk4OWEuODUuODUgMCAwIDAtLjA4NiAxLjIwNWw0LjY1NCA1LjMxOGMuNTE2LjU5MSAxLjQ5LjIyNSAxLjQ5LS41NnoiLz48cGF0aCBmaWxsPSJ1cmwoI2k2YTBiNDItcGFpbnQ1X2xpbmVhcl82NzY2MV8xMDMpIiBkPSJNMzkgMzUuNzYxYS44NS44NSAwIDAgMSAxLjQwMy0uNjQ1bDQuNjU0IDMuOTg5YS44NS44NSAwIDAgMSAuMDg2IDEuMjA1bC00LjY1NCA1LjMxOGMtLjUxNi41OTEtMS40OS4yMjUtMS40OS0uNTZ6Ii8+PHBhdGggZmlsbD0iI0Y1RjVGNSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJtMzUuOTQ2IDM0LjM1Ni00LjY1MyAzLjk5YTEuODUgMS44NSAwIDAgMC0uMTg5IDIuNjIybDQuNjU0IDUuMzE5Yy43ODMuODk0IDIuMDQ2Ljc4MSAyLjc0Mi4wNTQuNjk2LjcyNyAxLjk2Ljg0IDIuNzQyLS4wNTRsNC42NTQtNS4zMTlhMS44NSAxLjg1IDAgMCAwLS4xODgtMi42MjNsLTQuNjU0LTMuOTg5Yy0uODEtLjY5NC0xLjkyLS41My0yLjU1NC4xMzUtLjYzNC0uNjY2LTEuNzQzLS44My0yLjU1NC0uMTM1bS00LjAwMyA0Ljc0OSA0LjY1NC0zLjk5YS44NS44NSAwIDAgMSAxLjQwMy42NDZ2OS4zMzNjLS4wMjEuNzY3LS45NzggMS4xMTgtMS40OS41MzRsLTQuNjUzLTUuMzE4YS44NS44NSAwIDAgMSAuMDg2LTEuMjA1bTguNDYtMy45OWEuODUuODUgMCAwIDAtMS40MDMuNjQ2djkuMzMzYy4wMjEuNzY3Ljk3OCAxLjExOCAxLjQ5LjUzNGw0LjY1My01LjMxOGEuODUuODUgMCAwIDAtLjA4Ni0xLjIwNXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iaTZhMGI0Mi1wYWludDBfbGluZWFyXzY3NjYxXzEwMyIgeDE9IjE1LjU1NiIgeDI9IjIwLjM2MiIgeTE9IjUiIHkyPSI0My40NTUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRUJFQkVCIi8+PC9saW5lYXJHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9Imk2YTBiNDItcGFpbnQxX3JhZGlhbF82NzY2MV8xMDMiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgyMC4wNTU2IDMwLjA4MzMgLTMwLjA4MzMgMTEuMjgxMiAxNy4xMzkgMTQuODk2KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjE3NyIgc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0I4QjhCOCIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJpNmEwYjQyLXBhaW50Ml9saW5lYXJfNjc2NjFfMTAzIiB4MT0iMTcuMjcxIiB4Mj0iMjIuMzg3IiB5MT0iNSIgeTI9IjQzLjM3MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNCQkIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4ODgiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iaTZhMGI0Mi1wYWludDNfbGluZWFyXzY3NjYxXzEwMyIgeDE9IjE2IiB4Mj0iMzUuNTIiIHkxPSIxNCIgeTI9IjI5LjY0NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMwMDhFRTYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDYwOTQiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iaTZhMGI0Mi1wYWludDRfbGluZWFyXzY3NjYxXzEwMyIgeDE9IjMxLjY0NiIgeDI9IjQyLjM5OCIgeTE9IjM0LjkwOSIgeTI9IjQ4LjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMwMDhFRTYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDYwOTQiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iaTZhMGI0Mi1wYWludDVfbGluZWFyXzY3NjYxXzEwMyIgeDE9IjMxLjY0NiIgeDI9IjQyLjM5OCIgeTE9IjM0LjkwOSIgeTI9IjQ4LjI5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMwMDhFRTYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDYwOTQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4="});

/* GitHub's marks, from GitHub's official logo pack (GitHub_Logos.zip, linked from the page "Logo" on brand.github.com, read 5 November
   2026; files GitHub_Invertocat_White.svg and GitHub_Lockup_White.svg), unaltered: the white versions, for the module's dark glass, as
   GitHub's guidelines ask (the logo in white or black, high contrast, no effects, never recoloured, stretched or rearranged). GITHUB, the
   GITHUB logo design and the INVERTOCAT logo design are trademarks of GitHub, Inc.: used only to identify GitHub where a film shows work
   kept in it, less prominently than the film's own words, never as a film's own mark or to suggest GitHub made or endorses the films,
   and NOT covered by this repository's licences (NOTICE.md). Bundled, like the marks above, only for a film whose film.json says
   "logos": true: logo(ctx, "github", x, y, h), the Invertocat; logo(ctx, "githubLockup", x, y, h), the Invertocat with GitHub's
   wordmark. Never crop, flip, rotate or recolour them. */
Object.assign(LOGO_SRC,{github:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTgiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5OCA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzczMF8yNzEzNikiPgo8cGF0aCBkPSJNNDEuNDM5NSA2OS4zODQ4QzI4LjgwNjYgNjcuODUzNSAxOS45MDYyIDU4Ljc2MTcgMTkuOTA2MiA0Ni45OTAyQzE5LjkwNjIgNDIuMjA1MSAyMS42Mjg5IDM3LjAzNzEgMjQuNSAzMy41OTE4QzIzLjI1NTkgMzAuNDMzNiAyMy40NDczIDIzLjczNDQgMjQuODgyOCAyMC45NTlDMjguNzEwOSAyMC40ODA1IDMzLjg3ODkgMjIuNDkwMiAzNi45NDE0IDI1LjI2NTZDNDAuNTc4MSAyNC4xMTcyIDQ0LjQwNjIgMjMuNTQzIDQ5LjA5NTcgMjMuNTQzQzUzLjc4NTIgMjMuNTQzIDU3LjYxMzMgMjQuMTE3MiA2MS4wNTg2IDI1LjE2OTlDNjQuMDI1NCAyMi40OTAyIDY5LjI4OTEgMjAuNDgwNSA3My4xMTcyIDIwLjk1OUM3NC40NTcgMjMuNTQzIDc0LjY0ODQgMzAuMjQyMiA3My40MDQzIDMzLjQ5NjFDNzYuNDY2OCAzNy4xMzI4IDc4LjA5MzcgNDIuMDEzNyA3OC4wOTM3IDQ2Ljk5MDJDNzguMDkzNyA1OC43NjE3IDY5LjE5MzQgNjcuNjYyMSA1Ni4zNjkxIDY5LjI4OTFDNTkuNjIzIDcxLjM5NDUgNjEuODI0MiA3NS45ODgzIDYxLjgyNDIgODEuMjUyTDYxLjgyNDIgOTEuMjA1MUM2MS44MjQyIDk0LjA3NjIgNjQuMjE2OCA5NS43MDMxIDY3LjA4NzkgOTQuNTU0N0M4NC40MTAyIDg3Ljk1MTIgOTggNzAuNjI4OSA5OCA0OS4xOTE0Qzk4IDIyLjEwNzQgNzUuOTg4MyA2LjY5NTM5ZS0wNyA0OC45MDQzIDQuMzA5ZS0wN0MyMS44MjAzIDEuOTIyNjFlLTA3IC0xLjk0NzllLTA3IDIyLjEwNzQgLTQuMzM0M2UtMDcgNDkuMTkxNEMtNi4yMDYzMWUtMDcgNzAuNDM3NSAxMy40OTQxIDg4LjA0NjkgMzEuNjc3NyA5NC42NTA0QzM0LjI2MTcgOTUuNjA3NCAzNi43NSA5My44ODQ4IDM2Ljc1IDkxLjMwMDhMMzYuNzUgODMuNjQ0NUMzNS40MTAyIDg0LjIxODggMzMuNjg3NSA4NC42MDE2IDMyLjE1NjIgODQuNjAxNkMyNS44Mzk4IDg0LjYwMTYgMjIuMTA3NCA4MS4xNTYzIDE5LjQyNzcgNzQuNzQ0MUMxOC4zNzUgNzIuMTYwMiAxNy4yMjY2IDcwLjYyODkgMTUuMDI1NCA3MC4zNDE4QzEzLjg3NyA3MC4yNDYxIDEzLjQ5NDEgNjkuNzY3NiAxMy40OTQxIDY5LjE5MzRDMTMuNDk0MSA2OC4wNDQ5IDE1LjQwODIgNjcuMTgzNiAxNy4zMjIzIDY3LjE4MzZDMjAuMDk3NyA2Ny4xODM2IDIyLjQ5MDIgNjguOTA2MyAyNC45Nzg1IDcyLjQ0NzNDMjYuODkyNiA3NS4yMjI3IDI4LjkwMjMgNzYuNDY2OCAzMS4yOTQ5IDc2LjQ2NjhDMzMuNjg3NSA3Ni40NjY4IDM1LjIxODcgNzUuNjA1NSAzNy40MTk5IDczLjQwNDNDMzkuMDQ2OSA3MS43NzczIDQwLjI5MSA3MC4zNDE4IDQxLjQzOTUgNjkuMzg0OFoiIGZpbGw9IndoaXRlIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfNzMwXzI3MTM2Ij4KPHJlY3Qgd2lkdGg9Ijk4IiBoZWlnaHQ9Ijk2IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=",githubLockup:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDE2IiBoZWlnaHQ9Ijk1IiB2aWV3Qm94PSIwIDAgNDE2IDk1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfNzMxXzI3MTczKSI+CjxwYXRoIGQ9Ik00MS42Mzk0IDY5LjM4NDhDMjkuMDA2NiA2Ny44NTM1IDIwLjEwNjIgNTguNzYxNyAyMC4xMDYyIDQ2Ljk5MDJDMjAuMTA2MiA0Mi4yMDUxIDIxLjgyODkgMzcuMDM3MSAyNC43IDMzLjU5MThDMjMuNDU1OCAzMC40MzM2IDIzLjY0NzIgMjMuNzM0NCAyNS4wODI4IDIwLjk1OUMyOC45MTA5IDIwLjQ4MDUgMzQuMDc4OSAyMi40OTAyIDM3LjE0MTQgMjUuMjY1NkM0MC43NzgxIDI0LjExNzIgNDQuNjA2MiAyMy41NDMgNDkuMjk1NyAyMy41NDNDNTMuOTg1MSAyMy41NDMgNTcuODEzMiAyNC4xMTcyIDYxLjI1ODUgMjUuMTY5OUM2NC4yMjUzIDIyLjQ5MDIgNjkuNDg5IDIwLjQ4MDUgNzMuMzE3MSAyMC45NTlDNzQuNjU3IDIzLjU0MyA3NC44NDg0IDMwLjI0MjIgNzMuNjA0MiAzMy40OTYxQzc2LjY2NjcgMzcuMTMyOCA3OC4yOTM3IDQyLjAxMzcgNzguMjkzNyA0Ni45OTAyQzc4LjI5MzcgNTguNzYxNyA2OS4zOTMzIDY3LjY2MjEgNTYuNTY5MSA2OS4yODkxQzU5LjgyMyA3MS4zOTQ1IDYyLjAyNDIgNzUuOTg4MyA2Mi4wMjQyIDgxLjI1Mkw2Mi4wMjQyIDkxLjIwNTFDNjIuMDI0MiA5NC4wNzYyIDY0LjQxNjcgOTUuNzAzMSA2Ny4yODc4IDk0LjU1NDdDODQuNjEwMSA4Ny45NTEyIDk4LjIgNzAuNjI4OSA5OC4yIDQ5LjE5MTRDOTguMiAyMi4xMDc0IDc2LjE4ODIgNi42OTUzOWUtMDcgNDkuMTA0MiA0LjMwOWUtMDdDMjIuMDIwMyAxLjkyMjYxZS0wNyAwLjE5OTk1MSAyMi4xMDc0IDAuMTk5OTUxIDQ5LjE5MTRDMC4xOTk5NTEgNzAuNDM3NSAxMy42OTQxIDg4LjA0NjkgMzEuODc3NyA5NC42NTA0QzM0LjQ2MTcgOTUuNjA3NCAzNi45NSA5My44ODQ4IDM2Ljk1IDkxLjMwMDhMMzYuOTUgODMuNjQ0NUMzNS42MTAxIDg0LjIxODggMzMuODg3NSA4NC42MDE2IDMyLjM1NjIgODQuNjAxNkMyNi4wMzk4IDg0LjYwMTYgMjIuMzA3NCA4MS4xNTYzIDE5LjYyNzcgNzQuNzQ0MUMxOC41NzUgNzIuMTYwMiAxNy40MjY1IDcwLjYyODkgMTUuMjI1MyA3MC4zNDE4QzE0LjA3NjkgNzAuMjQ2MSAxMy42OTQxIDY5Ljc2NzYgMTMuNjk0MSA2OS4xOTM0QzEzLjY5NDEgNjguMDQ0OSAxNS42MDgyIDY3LjE4MzYgMTcuNTIyMiA2Ny4xODM2QzIwLjI5NzYgNjcuMTgzNiAyMi42OTAyIDY4LjkwNjMgMjUuMTc4NSA3Mi40NDczQzI3LjA5MjUgNzUuMjIyNyAyOS4xMDIzIDc2LjQ2NjggMzEuNDk0OSA3Ni40NjY4QzMzLjg4NzUgNzYuNDY2OCAzNS40MTg3IDc1LjYwNTUgMzcuNjE5OSA3My40MDQzQzM5LjI0NjggNzEuNzc3MyA0MC40OTEgNzAuMzQxOCA0MS42Mzk0IDY5LjM4NDhaIiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfNzMxXzI3MTczKSI+CjxwYXRoIGQ9Ik0xODguOTM3IDgzLjAwNDVMMTg4LjkzNyAzMy4yODI3TDIwMi45MTUgMzMuMjgyN0wyMDIuOTE1IDgzLjAwNDVMMTg4LjkzNyA4My4wMDQ1Wk0yMzAuMDE2IDgzLjAwNDVDMjIwLjcyNyA4My4wMDQ1IDIxNy4wOTkgNzkuMDIzMiAyMTcuMDk5IDcwLjYxODNMMjE3LjA5OSA0NC45NjExTDIwOC4yNTIgNDQuOTYxMUwyMDguMjUyIDMzLjI4MjdMMjE3LjA5OSAzMy4yODI3TDIxNy4wOTkgMjMuMzczN0wyMzEuMDc4IDIwLjEwMDJMMjMxLjA3OCAzMy4yODI3TDI0MS40MjkgMzMuMjgyN0wyNDEuNDI5IDQ0Ljk2MTFMMjMxLjA3OCA0NC45NjExTDIzMS4wNzggNjcuNTIxN0MyMzEuMDc4IDcwLjI2NDQgMjMyLjMxNyA3MS4zMjYxIDIzNS4wNTkgNzEuMzI2MUwyNDEuNDI5IDcxLjMyNjFMMjQxLjQyOSA4My4wMDQ1TDIzMC4wMTYgODMuMDA0NVpNMzI3LjQ3IDgzLjg4OTJDMzE2LjU4OCA4My44ODkyIDMxMC42NiA3Ny44NzMxIDMxMC42NiA2Ni45MDI0TDMxMC42NiAzMy4yODI3TDMyNC43MjggMzMuMjgyN0wzMjQuNzI4IDYzLjE4NjZDMzI0LjcyOCA2OS4yOTEyIDMyNy40NyA3Mi42NTMyIDMzMi42OSA3Mi42NTMyQzMzOC43MDYgNzIuNjUzMiAzNDMuMzA3IDY3LjA3OTQgMzQzLjMwNyA1OS40NzA3TDM0My4zMDcgMzMuMjgyN0wzNTcuMzc0IDMzLjI4MjdMMzU3LjM3NCA4My4wMDQ1TDM0My4zMDcgODMuMDA0NUwzNDMuMzA3IDc0LjU5OTZDMzQwLjY1MyA3OS45OTY0IDMzNC4yODMgODMuODg5MiAzMjcuNDcgODMuODg5MlpNMzk0LjYxMyA4My44ODkyQzM4Ny44MzIgODMuODg5MiAzODEuNjM5IDc5Ljk5NjQgMzc4LjY4NyA3NC40MjI2TDM3OC42ODcgODMuMDA0NUwzNjQuNzA5IDgzLjAwNDVMMzY0LjcwOSAxMy42NDE3TDM3OC43NzYgMTMuNjQxN0wzNzguNzc2IDQyLjM5NTRDMzgxLjYzOSAzNi4zNzkyIDM4OC4wOTggMzIuMTMyNSAzOTQuNjEzIDMyLjEzMjVDNDA4LjE4MSAzMi4xMzI1IDQxNS4zNDggNDEuNTEwNyA0MTQuODczIDU4LjA1NTFDNDE1LjM0OCA3NC40MjI2IDQwNy45MTYgODMuODg5MiAzOTQuNjEzIDgzLjg4OTJaTTM4OS42NTggNzIuMTIyM0MzOTYuOTQ1IDcyLjEyMjMgNDAwLjkyNiA2Ni43MjU1IDQwMC40NTIgNTguMDU1MUM0MDAuOTI2IDQ5LjI5NjMgMzk2Ljk0NSA0My44OTk0IDM4OS42NTggNDMuODk5NEMzODMuODUxIDQzLjg5OTQgMzc5LjI1MSA0OS41NjE3IDM3OC43NzYgNTcuMzQ3M0wzNzguNzc2IDU4LjE0MzZDMzc5LjI1MSA2Ni4xOTQ2IDM4My44NTEgNzIuMTIyMyAzODkuNjU4IDcyLjEyMjNaTTI4OC43MzQgMTMuNjQxN0wyODguNzM0IDQxLjc3NjFMMjYyLjM2OSA0MS43NzYxTDI2Mi4zNjkgMTMuNjQxN0wyNDcuMzI5IDEzLjY0MTdMMjQ3LjMyOSA4My4wMDQ1TDI2Mi4zNjkgODMuMDA0NUwyNjIuMzY5IDU1LjIyNEwyODguNzM0IDU1LjIyNEwyODguNzM0IDgzLjAwNDVMMzAzLjc3NSA4My4wMDQ1TDMwMy43NzUgMTMuNjQxN0wyODguNzM0IDEzLjY0MTdaTTE1MC42MjggODQuMzMxNkMxMzAuMTAyIDg0LjMzMTYgMTE3LjE4NSA3MC4yNjQ0IDExNy4xODUgNDguMjM0NkMxMTcuMTg1IDI2LjIwNDggMTMwLjM2OCAxMi4zMTQ2IDE1MS4yNDcgMTIuMzE0NkMxNjguMjM0IDEyLjMxNDYgMTc4LjQ5NyAxOS41NjkzIDE4MS43NyAzMS43Nzg2TDE2Ni41NTMgMzUuNDA2QzE2NC42OTUgMjguNzcwNSAxNTkuMzg3IDI1LjE0MzEgMTUxLjI0NyAyNS4xNDMxQzEzOS4xMjYgMjUuMTQzMSAxMzIuNTc5IDMzLjEwNTcgMTMyLjU3OSA0OC4yMzQ2QzEzMi41NzkgNjMuMzYzNSAxMzguOTQ5IDcxLjUwMyAxNTAuODkzIDcxLjUwM0MxNjEuODY0IDcxLjUwMyAxNjguNDExIDY0Ljc3OTEgMTY4LjQxMSA1My4zNjZMMTY4LjQxMSA1MC43MTE5TDE3Mi4zMDQgNTYuMTA4N0wxNDkuNjU1IDU2LjEwODdMMTQ5LjY1NSA0My4zNjg2TDE4My42MjggNDMuMzY4NkwxODMuNjI4IDUxLjQxOTZDMTgzLjYyOCA3Mi41NjQ3IDE3MS4zMzEgODQuMzMxNiAxNTAuNjI4IDg0LjMzMTZaTTE5NS45MjYgMjguNTkzNkMyMDAuNjE1IDI4LjU5MzYgMjA0LjI0MyAyNC45NjYyIDIwNC4yNDMgMjAuMjc3MUMyMDQuMjQzIDE1LjU4ODEgMjAwLjYxNSAxMS45NjA3IDE5NS45MjYgMTEuOTYwN0MxOTEuMjM3IDExLjk2MDcgMTg3LjYxIDE1LjU4ODEgMTg3LjYxIDIwLjI3NzFDMTg3LjYxIDI0Ljk2NjIgMTkxLjIzNyAyOC41OTM2IDE5NS45MjYgMjguNTkzNloiIGZpbGw9IndoaXRlIi8+CjwvZz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF83MzFfMjcxNzMiPgo8cmVjdCB3aWR0aD0iNDE2IiBoZWlnaHQ9Ijk1IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8Y2xpcFBhdGggaWQ9ImNsaXAxXzczMV8yNzE3MyI+CjxyZWN0IHdpZHRoPSIyOTguMDY4IiBoZWlnaHQ9Ijc1Ljk0MDgiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTcuMTg1IDkuNDkyNTgpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="});

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

// Reports on demand, the first film of From tables to decisions, the third series of Modern data basics. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"clock":{"name":"The speaking clock","lead":1.6,"tail":1.0,"vo":[
 {"id":"london","gap":0.8,"text":"London, 1936.","say":"London, nineteen thirty-six."},
 {"id":"rang","gap":0.8,"text":"To know the exact time, people rang the telephone exchange, and asked the operator."},
 {"id":"wall","gap":0.8,"text":"She read it from the clock on the exchange wall."},
 {"id":"exact","gap":0.8,"text":"But it was never quite exact to the second."},
 {"id":"late","gap":0.8,"text":"And the exchange couldn't always answer just when a caller asked."},
 {"id":"out","gap":0.8,"text":"So a clock or a watch set by that answer could be out."},
 {"id":"again","gap":0.8,"text":"And the time is a question everyone asks, again and again."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"built","gap":0.8,"text":"So the Post Office's own engineers built a machine to answer it: the speaking clock."},
 {"id":"cain","gap":0.8,"text":"Jane Cain, one of the operators, recorded its words on glass discs."},
 {"id":"played","gap":0.8,"text":"A clock played them at the right moment."},
 {"id":"greenwich","gap":0.8,"text":"And every hour, it was checked against Greenwich, where Britain's time was kept."},
 {"id":"dial","gap":0.8,"text":"From 24 July 1936, anyone in London could dial TIM, for time.","say":"From the twenty-fourth of July, nineteen thirty-six, anyone in London could dial T, I, M, for time."},
 {"id":"heard","gap":0.8,"text":"They heard the time, right to a tenth of a second, at any hour of the day or night."},
 {"id":"calls","gap":0.8,"text":"In less than a year, it answered more than 12 million calls.","say":"In less than a year, it answered more than twelve million calls."},
 {"id":"demand","gap":0.8,"text":"The exact time, on demand, for anyone."},
 {"id":"operator","gap":0.8,"text":"And that question no longer needed an operator."},
 {"id":"report","gap":0.8,"text":"At the university, the questions asked every pay day came in a 40-page report.","say":"At the university, the questions asked every pay day came in a forty-page report."},
 {"id":"week","gap":0.8,"text":"Any other question waited a week, for a report of its own."},
 {"id":"now","gap":0.8,"text":"Now any question is answered when it's asked."},
 {"id":"own","gap":0.8,"text":"And the questions that come back have a dashboard of their own."}]},
"ask":{"name":"Ask for the answer","lead":0.8,"tail":1.0,"vo":[
 {"id":"payday","gap":0.8,"text":"Thursday, 5 November 2026: pay day at the university.","say":"Thursday, the fifth of November, twenty twenty-six: pay day at the university."},
 {"id":"rohan","gap":0.8,"text":"Rohan Desai, in Finance, is setting next year's budget for casual teaching in the Faculty of Health."},
 {"id":"casual","gap":0.8,"text":"Casual teaching is done by staff paid for the hours they work, like Linh Nguyen, who tutors health informatics."},
 {"id":"needs","gap":0.8,"text":"First he needs one number: what casual teaching has cost Health this semester, so far."},
 {"id":"used","gap":0.8,"text":"That used to take a report from the data team, and a week."},
 {"id":"asks","gap":0.8,"text":"Today he asks Genie One, in his own words."},
 {"id":"answer","gap":0.8,"text":"Like the time in 1936, the answer comes when he asks: A$1.84 million, so far.","say":"Like the time in nineteen thirty-six, the answer comes when he asks: one point eight four million dollars, so far."},
 {"id":"counted","gap":0.8,"text":"With it, Genie says what it counted: the claims approved for casual teaching, plus on-costs."},
 {"id":"oncosts","gap":0.8,"text":"On-costs are what the university pays on top of pay."},
 {"id":"query","gap":0.8,"text":"And it shows the query it ran, so anyone can check it."},
 {"id":"next","gap":0.8,"text":"His next question: and Semester 1?","say":"His next question: and Semester one?"},
 {"id":"s1","gap":0.8,"text":"A$2.21 million, with every claim in.","say":"Two point two one million dollars, with every claim in."},
 {"id":"lunch","gap":0.8,"text":"By lunch, Health's casual teaching budget is set, from this year's numbers."}]},
"context":{"name":"What it answers from","lead":0.8,"tail":1.0,"vo":[
 {"id":"agent","gap":0.8,"text":"Genie One answered from a Genie Agent, which Sam and Jun, in the data team, set up for this one subject."},
 {"id":"films","gap":0.8,"text":"Two earlier films show how one is built."},
 {"id":"put","gap":0.8,"text":"Here is what the team put in it."},
 {"id":"data","gap":0.8,"text":"Its data: one measure, casual teaching cost, by faculty, unit and teaching period."},
 {"id":"defined","gap":0.8,"text":"Rohan defined it once, in September, as the next film shows."},
 {"id":"rules","gap":0.8,"text":"Its rules, in their owners' words."},
 {"id":"rohans","gap":0.8,"text":"Rohan's: what cost means, and what this semester means."},
 {"id":"ingrid","gap":0.8,"text":"Ingrid's, in HR: totals only, never one person's pay."},
 {"id":"reads","gap":0.8,"text":"So it reads the measure, never anyone's claims."},
 {"id":"examples","gap":0.8,"text":"Its examples: questions Finance asks, each with the query that answers it."},
 {"id":"tests","gap":0.8,"text":"And its tests: questions with known answers, run after every change."},
 {"id":"asker","gap":0.8,"text":"Each answer runs as the person asking, so they see only what they may read."},
 {"id":"moved","gap":0.8,"text":"So the data team's work has moved."},
 {"id":"models","gap":0.8,"text":"Not a report for each question, but good models and their context, built once, for people and agents to explore."},
 {"id":"small","gap":0.8,"text":"They started small, and Rohan, who knows the subject best, was its first user."}]},
"back":{"name":"The questions that come back","lead":0.8,"tail":1.0,"vo":[
 {"id":"some","gap":0.8,"text":"Some questions come back every pay day, from the same people."},
 {"id":"cost","gap":0.8,"text":"What did the pay run cost?"},
 {"id":"hours","gap":0.8,"text":"How many casual hours, in each faculty?"},
 {"id":"waiting","gap":0.8,"text":"How many claims still wait for approval?"},
 {"id":"machine","gap":0.8,"text":"Like the time in 1936, they get a machine of their own: one dashboard, read at a glance.","say":"Like the time in nineteen thirty-six, they get a machine of their own: one dashboard, read at a glance."},
 {"id":"refresh","gap":0.8,"text":"It refreshes after each pay run, and goes to the people who act on it."},
 {"id":"today","gap":0.8,"text":"Today: A$9.6 million, paid to 2,960 people.","say":"Today: nine point six million dollars, paid to two thousand, nine hundred and sixty people."},
 {"id":"claims","gap":0.8,"text":"And 143 claims still waiting, for the next pay run.","say":"And a hundred and forty-three claims still waiting, for the next pay run."},
 {"id":"genie","gap":0.8,"text":"For a question it doesn't show, its Ask Genie button opens the same Genie Agent."},
 {"id":"replaced","gap":0.8,"text":"It replaced a 40-page report, emailed every pay day.","say":"It replaced a forty-page report, emailed every pay day."},
 {"id":"pageone","gap":0.8,"text":"The three figures people read were on its first page."},
 {"id":"retired","gap":0.8,"text":"Now it's retired."},
 {"id":"rule","gap":0.8,"text":"A rule of thumb: a question deserves a dashboard when it comes back on a schedule, and someone acts on what it shows."},
 {"id":"other","gap":0.8,"text":"Every other question is asked when it's needed."}]},
"close":{"name":"Asked when it's needed","lead":0.8,"tail":1.0,"vo":[
 {"id":"then","gap":0.8,"text":"In 1936, the question everyone asked got a machine of its own, and anyone could ask it, at any hour.","say":"In nineteen thirty-six, the question everyone asked got a machine of its own, and anyone could ask it, at any hour."},
 {"id":"uni","gap":0.8,"text":"At the university, the questions that come back have one dashboard."},
 {"id":"every","gap":0.8,"text":"Every other question is answered when it's asked, from good models and their context, built once."},
 {"id":"budget","gap":0.8,"text":"And Health's casual teaching budget was set from this year's numbers, in a morning, not a week."},
 {"id":"old","gap":0.8,"text":"None of these ideas is new; the tools now make them easier."},
 {"id":"docs","gap":0.8,"text":"So don't reinvent the wheel: investigate, adapt, implement and iterate, starting from the official docs, linked on this page."},
 {"id":"takeaway","gap":0.8,"text":"Ask for the answer; keep dashboards for the questions that come back."},
 {"id":"nextfilm","gap":0.8,"text":"Next: casual teaching cost, defined in the open, so every reader counts it the same way."}]}
};

const VODUR={"clock/london": 1.735, "clock/rang": 4.805, "clock/wall": 2.361, "clock/exact": 2.031, "clock/late": 3.241, "clock/out": 2.875, "clock/again": 3.304, "clock/change": 1.288, "clock/built": 4.897, "clock/cain": 4.104, "clock/played": 1.813, "clock/greenwich": 4.066, "clock/dial": 6.643, "clock/heard": 4.346, "clock/calls": 3.33, "clock/demand": 2.178, "clock/operator": 2.679, "clock/report": 5.113, "clock/week": 3.248, "clock/now": 2.303, "clock/own": 3.078, "ask/payday": 4.776, "ask/rohan": 6.303, "ask/casual": 6.851, "ask/needs": 5.496, "ask/used": 3.237, "ask/asks": 2.477, "ask/answer": 6.91, "ask/counted": 5.637, "ask/oncosts": 3.161, "ask/query": 2.915, "ask/next": 2.213, "ask/s1": 3.211, "ask/lunch": 4.102, "context/agent": 6.691, "context/films": 2.189, "context/put": 1.588, "context/data": 5.44, "context/defined": 3.827, "context/rules": 1.825, "context/rohans": 3.329, "context/ingrid": 3.61, "context/reads": 2.663, "context/examples": 4.538, "context/tests": 4.217, "context/asker": 4.617, "context/moved": 1.811, "context/models": 7.007, "context/small": 4.524, "back/some": 3.428, "back/cost": 1.353, "back/hours": 2.371, "back/waiting": 1.916, "back/machine": 5.831, "back/refresh": 4.075, "back/today": 5.815, "back/claims": 3.687, "back/genie": 4.77, "back/replaced": 3.416, "back/pageone": 3.021, "back/retired": 1.072, "back/rule": 6.731, "back/other": 2.336, "close/then": 6.909, "close/uni": 3.795, "close/every": 5.506, "close/budget": 5.071, "close/old": 3.478, "close/docs": 7.898, "close/takeaway": 3.585, "close/nextfilm": 5.669};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the speaking clock's dial becoming the title card; and the end card. */
const BREATH={
"clock":{"hold":{"london":0.6,"rang":0.6,"wall":0.6,"exact":0.4,"late":0.6,"out":0.8,"again":0.8,"change":1.0,"built":0.6,"cain":0.6,"played":0.4,"greenwich":0.6,"dial":0.8,"heard":0.4,"calls":0.8,"demand":0.4,"operator":0.8,"report":0.4,"week":0.6,"now":0.4,"own":0.4},"breathe":4.6},
"ask":{"hold":{"payday":0.4,"rohan":0.4,"casual":0.4,"needs":0.6,"used":0.2,"asks":0.4,"answer":0.8,"counted":0.2,"oncosts":0.2,"query":0.6,"next":0.2,"s1":0.6,"lunch":0.6}},
"context":{"hold":{"agent":0.6,"films":0.4,"put":0.4,"data":0.6,"defined":0.6,"rules":0.4,"rohans":0.6,"ingrid":0.6,"reads":0.8,"examples":0.6,"tests":0.6,"asker":0.6,"moved":0.6,"models":1.0,"small":0.6}},
"back":{"hold":{"some":0.4,"cost":0.4,"hours":0.4,"waiting":0.6,"machine":0.8,"refresh":0.6,"today":0.6,"claims":0.6,"genie":0.6,"replaced":0.4,"pageone":0.6,"retired":0.8,"rule":1.0,"other":0.6}},
"close":{"hold":{"then":0.4,"uni":0.2,"every":0.4,"budget":0.6,"old":0.2,"docs":0.6,"takeaway":1.0,"nextfilm":0.2},"breathe":4.6}
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

/* ===== Modern data basics: the module's look =====
   The films of Modern data basics (Data that moves, Data as software, From tables to decisions, Documents as data) share one
   look, assumed on 5 November 2026 for the author to review (films/data-that-moves/decided.md): the intro's platform map, drawn
   up close. The dark navy map of The Inner Life of Data, its systems, lanes of light, layers and readers, drawn near enough to work
   in, with people drawn to the agent films' rules (people.js there) and lit for the dark. Glass panels with a coloured edge only
   where the colour means something; words in white or a soft blue-grey; solid pills with dark words where a verdict must read at once.
   No film grain, no watercolour.
   The module's files, bundled in this order after The Inner Life of Data's helpers (core.js, style2.js, ui3.js, and its logos.js
   with this module's for a film that names its tools), A Sharper Sketch's scene() (sketch3.js) and the agent films' kit, people
   and agent (films/what-an-agent-is/shared/src/kit.js, people.js, agent.js: the camera, the shots, pictures painted once, the people):
     look.js   the palette and what each colour means, words, the places, lanes of light and what moves along them, and icons
     people.js the cast and md_person, the agent films' people lit for the dark
     cards.js  glass cards, pills, tags, the kicker, the module's mark, and the title and end cards
     map.js    the platform map's parts drawn near: a system, the platform, a layer, a table, a reader, the ways data moves,
               and the whole map at once
     tools.js  the tools' pages, each with a small bar naming the product and its logo, and what goes in them: rows, a catalog's tree
   Every top-level name starts with md_ or MD_. A film's own pictures and helpers go in its own source with a prefix of its own;
   never change these files for one film.
   Sizes are in the 1920 x 1080 frame. Every word is at least 28 px as seen, and nothing but the captions goes below y 890. */

/* ---------------------------------------------------------------- colours, and what each means in every film of the module */
const MD={
  ink:[236,243,255],       // words
  soft:[166,184,210],      // quieter words, at 8:1 or more on the navy
  dim:[112,128,156],       // lines and frames that only hold things together
  navy:[6,11,24],          // the night itself; dark words on a solid pill
  flow:[120,200,255],      // data moving, and the platform's structure: lanes, connectors, mirrors, the catalog
  agreed:[255,209,102],    // what people agree on: a contract at an interface, a definition, a measure
  pass:[120,240,170],      // a check passes, it works, it arrived
  fail:[255,96,86],        // an error, a failure, something broken
  wait:[255,184,77],       // waiting for a person: a review, an approval, a question
  personal:[204,166,255],  // personal data, which stays where it may be read (always with a lock)
  dbx:[255,54,33],         // Databricks' own bar, as the intro's map draws it
  dbt:[255,105,75],        // dbt's own card
  // the university's systems and its business domains keep the colours the intro's map gives them
  sys:{hr:[255,150,200],fin:[255,226,122],sis:[255,176,64],lms:[126,224,140]},
  dom:{finance:[255,138,92],teaching:[176,123,255],students:[77,163,255],research:[47,211,192]},
  layer:{bronze:[232,162,107],silver:[214,228,255],gold:[255,209,102]}
};
const MD_MEANS={flow:MD.flow,agreed:MD.agreed,pass:MD.pass,fail:MD.fail,wait:MD.wait,personal:MD.personal};

/* ---------------------------------------------------------------- words
   md_T draws with The Inner Life of Data's T (so the legibility check measures it; {deco:1} marks decoration on purpose), in white
   unless o.col (a colour) or o.color (a CSS colour) says otherwise; o.ls spaces the letters, in px; o.f "mono" for code. Size 28 by
   default. md_tw and md_wrap measure and wrap as the agent films' ag_tw and ag_wrap do. */
function md_T(ctx,s,x,y,o){o=o||{};const a=o.a==null?1:o.a,col=o.color||rgba(o.col||MD.ink,a),ls=o.ls||0,q=Object.assign({},o,{color:col,size:o.size||28});
  if(!ls){T(ctx,s,x,y,q);return;}
  const dx=o.align==="center"?ls/2:(o.align==="right"||o.align==="end")?ls:0;ctx.save();ctx.letterSpacing=ls+"px";T(ctx,s,x+dx,y,q);ctx.restore();}
const md_tw=(ctx,s,o)=>ag_tw(ctx,s,o),md_wrap=(ctx,s,maxW,o)=>ag_wrap(ctx,s,maxW,o);
// a heading on the map: capitals, letter-spaced, soft unless o.col
function md_label(ctx,x,y,text,o){o=o||{};md_T(ctx,String(text).toUpperCase(),x,y,{w:800,size:o.size||28,ls:o.ls==null?4:o.ls,align:o.align||"left",col:o.col||MD.soft,a:o.a});}

/* ---------------------------------------------------------------- the places
   "map" is the night the map lives in: the navy of The Inner Life of Data, its faint grid every 48 px, and a vignette; "night" is the
   same without the grid, for title and end cards and for a film's own scenes. Each is painted once (AG_PLACES; check.py times it).
   The map's parts are drawn live over it, in the place's coordinates, so they stay sharp however close the camera comes. */
function md_paintNight(c,o){o=o||{};const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0a1022");g.addColorStop(0.55,"#060a17");g.addColorStop(1,"#03050b");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the light the glass panels throw on the night: two broad, faint pools
  for(const [x,y,r,col,a] of [[560,420,760,MD.flow,0.05],[1500,560,700,[150,120,255],0.035]]){const q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(col,a));q.addColorStop(1,rgba(col,0));c.fillStyle=q;c.fillRect(0,0,W,H);}
  if(o.grid){c.strokeStyle="rgba(120,160,230,0.05)";c.lineWidth=1;for(let x=0;x<=W;x+=48){c.beginPath();c.moveTo(x+0.5,0);c.lineTo(x+0.5,H);c.stroke();}for(let y=0;y<=H;y+=48){c.beginPath();c.moveTo(0,y+0.5);c.lineTo(W,y+0.5);c.stroke();}}
  const v=c.createRadialGradient(W/2,H/2,H*0.32,W/2,H/2,W*0.74);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.55)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.map=c=>md_paintNight(c,{grid:true});
AG_PLACES.night=c=>md_paintNight(c,{grid:false});
// a vignette in the frame itself, over a shot (it stays put while the camera moves); a film calls it after ag_shots
function md_vign(ctx,S,a){setScreen(ctx,S);const v=ctx.createRadialGradient(W/2,H/2,H*0.36,W/2,H/2,W*0.72);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,"+(0.42*(a==null?1:a))+")");ctx.fillStyle=v;ctx.fillRect(0,0,W,H);}

/* ---------------------------------------------------------------- lanes of light, and what moves along them
   md_curve(a, b, o) is a smooth path from point a to point b, leaving and arriving level (o.bend 0 to 1, how far the turn reaches),
   as the points md_lane and md_flow follow; md_path(points) joins straight runs. md_lane(ctx, pts, col, a, o) draws the lane, o.u
   (0 to 1) only as far as that, o.dash for a lane that only points the way (a query in place, a mirror's shortcut: nothing is
   copied along it). md_flow(ctx, pts, t, o) sends data along it: o.kind "events" (one small packet after another, each change as
   it's made), "batch" (a stack of rows now and then: a whole file), "stream" (a steady run), o.col, o.every, o.dur, o.a, o.back
   (from the end to the start). */
function md_curve(a,b,o){o=o||{};const k=o.bend==null?0.5:o.bend,dx=(b[0]-a[0])*k,n=o.n||36;return bez(P(a[0],a[1]),P(a[0]+dx,a[1]),P(b[0]-dx,b[1]),P(b[0],b[1]),n).map(p=>[p.x,p.y]);}
function md_path(pts){const out=[];for(let i=0;i<pts.length;i++){if(i===0){out.push(pts[0]);continue;}const a=pts[i-1],b=pts[i];for(let k=1;k<=12;k++)out.push([lerp(a[0],b[0],k/12),lerp(a[1],b[1],k/12)]);}return out;}
function md_cut(pts,u){if(u>=1)return pts;const p=mk(pts.map(q=>P(q[0],q[1]))),out=[];for(let i=0;i<=40;i++){const q=at(p,u*i/40);out.push([q.x,q.y]);}return out;}
function md_lane(ctx,pts,col,a,o){o=o||{};a=a==null?1:a;if(a<=0.004||pts.length<2)return;const u=o.u==null?1:clamp(o.u,0,1);if(u<=0)return;const q=md_cut(pts,u).map(p=>P(p[0],p[1]));
  if(o.dash){ctx.save();ctx.globalCompositeOperation="lighter";ctx.lineCap="round";ctx.setLineDash(o.dash===true?[10,14]:o.dash);ctx.lineDashOffset=-(o.t||0)*(o.speed||24);
    for(const [w,al] of [[8,0.08],[3,0.4],[1.6,0.9]]){poly(ctx,q);ctx.strokeStyle=rgba(col,al*a);ctx.lineWidth=w;ctx.stroke();}ctx.restore();return;}
  lane(ctx,q,col,a);}
function md_flow(ctx,pts,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||pts.length<2)return;const col=o.col||MD.flow,kind=o.kind||"events",p=mk((o.back?pts.slice().reverse():pts).map(q=>P(q[0],q[1])));
  const every=o.every||(kind==="batch"?3.2:kind==="stream"?0.18:0.9),dur=o.dur||(kind==="batch"?2.4:1.6),k=o.size||1;
  spawn(t,every,dur,o.off||0,(u,i)=>{const q=at(p,ease(u)),f=sstep(0,0.12,u)*(1-sstep(0.88,1,u))*a;if(f<=0.004)return;
    if(kind==="batch"){glow(ctx,q.x,q.y,46*k,col,0.5*f);ctx.save();ctx.globalAlpha*=f;ctx.translate(q.x,q.y);for(let s=2;s>=0;s--){rr(ctx,-22*k+s*5*k,-16*k-s*5*k,44*k,32*k,5*k);ctx.fillStyle=rgba(mix(col,MD.navy,0.55),0.95);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;ctx.stroke();
        ctx.fillStyle=rgba(col,0.7);for(let r=0;r<3;r++)ctx.fillRect(-16*k+s*5*k,-10*k-s*5*k+r*8*k,30*k,3*k);}ctx.restore();}
    else if(kind==="stream"){glow(ctx,q.x,q.y,14*k,col,0.9*f);}
    else{glow(ctx,q.x,q.y,26*k,col,0.55*f);ctx.save();ctx.globalAlpha*=f;rr(ctx,q.x-9*k,q.y-9*k,18*k,18*k,4*k);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.fill();ctx.restore();}});}

/* ---------------------------------------------------------------- icons
   md_icon(ctx, kind, x, y, s, col, o) draws an icon centred on (x, y), s px across, in a colour ([r, g, b]), with lines that keep
   their weight at any size. Kinds: "connector" (a plug: a managed connector brings data in), "query" (a lens: a query in place
   reads it where it lives), "mirror" (a shape and its dashed reflection: the catalog shown in another tool, nothing copied), "share"
   (two linked nodes: shared with a partner where it lives), "api" (braces: served on request), "event" (a spark: one change),
   "batch" (stacked sheets: a whole file), "stream" (waves), "table", "view", "volume" (a folder), "store" (a database), "contract"
   (a page with a seal), "lock", "key", "tick", "cross", "warn", "clock", "refresh", "person", "eye", "doc". */
function md_icon(ctx,kind,x,y,s,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const c=rgba(col,1),u=s/48;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(u,u);
  ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=o.lw||3.6;ctx.lineCap="round";ctx.lineJoin="round";const L=(pts)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();};
  switch(kind){
    case"connector":rr(ctx,-14,-10,22,20,5);ctx.stroke();L([[-14,0],[-22,0]]);L([[8,-5],[18,-5]]);L([[8,5],[18,5]]);break;
    case"query":ctx.beginPath();ctx.arc(-4,-4,13,0,TAU);ctx.stroke();L([[6,6],[18,18]]);break;
    // the mirror: a table, and beyond a line the same table again in dashes, its picture and not a copy
    case"mirror":L([[0,-21],[0,21]]);rr(ctx,-22,-12,16,24,3);ctx.stroke();L([[-22,-2],[-6,-2]]);ctx.save();ctx.setLineDash([3.5,4]);rr(ctx,6,-12,16,24,3);ctx.stroke();L([[6,-2],[22,-2]]);ctx.restore();break;
    case"share":ctx.beginPath();ctx.arc(-12,0,7,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(12,-12,7,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(12,12,7,0,TAU);ctx.stroke();L([[-6,-3],[6,-9]]);L([[-6,3],[6,9]]);break;
    case"api":ctx.lineWidth=(o.lw||3.6);L([[-8,-18],[-14,-18],[-16,-14],[-16,-4],[-20,0],[-16,4],[-16,14],[-14,18],[-8,18]]);L([[8,-18],[14,-18],[16,-14],[16,-4],[20,0],[16,4],[16,14],[14,18],[8,18]]);break;
    case"event":ctx.beginPath();ctx.moveTo(4,-20);ctx.lineTo(-10,3);ctx.lineTo(1,3);ctx.lineTo(-4,20);ctx.lineTo(11,-4);ctx.lineTo(0,-4);ctx.closePath();ctx.fill();break;
    case"batch":for(let i=2;i>=0;i--){rr(ctx,-14+i*4,-12-i*4,24,30,3);ctx.save();ctx.fillStyle="rgba(6,11,24,1)";ctx.fill();ctx.restore();ctx.stroke();}L([[-6,-2],[6,-2]]);L([[-6,6],[6,6]]);break;
    case"stream":for(const dy of[-10,0,10]){ctx.beginPath();ctx.moveTo(-20,dy);ctx.bezierCurveTo(-10,dy-7,-4,dy+7,6,dy);ctx.bezierCurveTo(12,dy-4,16,dy-4,20,dy);ctx.stroke();}break;
    case"table":rr(ctx,-18,-15,36,30,4);ctx.stroke();L([[-18,-5],[18,-5]]);L([[-18,5],[18,5]]);L([[-4,-15],[-4,15]]);break;
    case"view":ctx.beginPath();ctx.moveTo(-20,0);ctx.quadraticCurveTo(0,-18,20,0);ctx.quadraticCurveTo(0,18,-20,0);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();break;
    case"eye":md_icon(ctx,"view",0,0,48,col,{lw:o.lw});break;
    case"volume":ctx.beginPath();ctx.moveTo(-20,-12);ctx.lineTo(-6,-12);ctx.lineTo(-2,-7);ctx.lineTo(20,-7);ctx.lineTo(20,15);ctx.lineTo(-20,15);ctx.closePath();ctx.stroke();break;
    case"store":for(const dy of[-12,0,12]){ctx.beginPath();ctx.ellipse(0,dy-2,17,5,0,0,TAU);ctx.stroke();}L([[-17,-14],[-17,10]]);L([[17,-14],[17,10]]);break;
    case"contract":ctx.beginPath();ctx.moveTo(-15,-20);ctx.lineTo(8,-20);ctx.lineTo(15,-13);ctx.lineTo(15,20);ctx.lineTo(-15,20);ctx.closePath();ctx.stroke();L([[-8,-9],[7,-9]]);L([[-8,-1],[7,-1]]);ctx.beginPath();ctx.arc(5,11,6,0,TAU);ctx.fill();break;
    case"doc":ctx.beginPath();ctx.moveTo(-14,-20);ctx.lineTo(7,-20);ctx.lineTo(14,-13);ctx.lineTo(14,20);ctx.lineTo(-14,20);ctx.closePath();ctx.stroke();L([[-7,-8],[7,-8]]);L([[-7,0],[7,0]]);L([[-7,8],[4,8]]);break;
    case"lock":ctx.beginPath();ctx.arc(0,-7,10,Math.PI,0);ctx.stroke();rr(ctx,-15,-6,30,24,5);ctx.fill();ctx.save();ctx.fillStyle="rgba(6,11,24,1)";ctx.beginPath();ctx.arc(0,4,3.5,0,TAU);ctx.fill();ctx.restore();break;
    case"key":ctx.beginPath();ctx.arc(-9,0,9,0,TAU);ctx.stroke();L([[0,0],[20,0]]);L([[14,0],[14,8]]);L([[20,0],[20,6]]);break;
    case"tick":ctx.lineWidth=(o.lw||4.6);L([[-14,1],[-4,11],[15,-11]]);break;
    case"cross":ctx.lineWidth=(o.lw||4.6);L([[-12,-12],[12,12]]);L([[12,-12],[-12,12]]);break;
    case"warn":ctx.beginPath();ctx.moveTo(0,-19);ctx.lineTo(20,16);ctx.lineTo(-20,16);ctx.closePath();ctx.stroke();L([[0,-6],[0,5]]);ctx.beginPath();ctx.arc(0,11,2.4,0,TAU);ctx.fill();break;
    case"clock":ctx.beginPath();ctx.arc(0,0,18,0,TAU);ctx.stroke();L([[0,-10],[0,0],[8,6]]);break;
    case"refresh":ctx.beginPath();ctx.arc(0,0,15,-0.6,Math.PI*1.45);ctx.stroke();ctx.beginPath();ctx.moveTo(15,-16);ctx.lineTo(14,-4);ctx.lineTo(3,-8);ctx.closePath();ctx.fill();break;
    case"person":ctx.beginPath();ctx.arc(0,-9,8,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(-15,18);ctx.quadraticCurveTo(-14,3,0,3);ctx.quadraticCurveTo(14,3,15,18);ctx.stroke();break;
  }
  ctx.restore();}

/* ===== Modern data basics: the people, lit for the dark =====
   The people are the agent films' (films/what-an-agent-is/shared/src/people.js, bundled as it is): an adult's proportions, one
   three-quarter head (AG_FACE), arms down, a hand only on the thing the story is about (pose "hold"). Here they stand in the night
   of the map, so each is drawn whole, then lit: the side away from the light sinks into the navy, a warm light falls on the face
   from the glass in front of them, and a cool rim of light from the map behind them traces their back and the top of their head.
   Skin keeps its own colour where the light falls.

   md_person(ctx, who, x, y, s, o) draws a person as ag_person does (the same who, x, y, s and o: t, flip, pose, hold, front, nod,
   gaze, talk, smile, cut, covered), and returns the hands as it does. who is a name in MD_CAST (this module's people) or in the agent
   films' cast ("noor", "sam", "jun", "mei", "yusuf", "clara", "anil", "david"), or a spec of someone else (see people.js there). o.light:
     key     where the warm light comes from, in figure space (facing right: [560, 360], in front of the face and a little above)
     reach   how far it reaches, in figure units (780)
     shade   how far the side away from it sinks into the night, 0 to 1 (0.62)
     ground  how far the body sinks into the night below the chest, 0 to 1 (0.4)
     warm    how warm the light on the face is, 0 to 1 (0.14)
     rim     the rim's colour (the map's light, MD.flow), rimA its strength (0.7), rimW its width in figure units (7)
   A person fading in or out is drawn whole first and laid on the picture at that opacity, so they never show through themselves.
   md_nameTag(ctx, x, y, who, o) writes a person's name and role under or beside them: o.align, o.role (the line under the name),
   o.col (the colour of their side, for the small bar), o.a. */

/* ---------------------------------------------------------------- the cast this module adds
   As the module's shared numbers set them (/mnt/project-files/modern-data-basics/numbers.md, confirmed by the opening film): Ingrid
   Holm in HR, who owns the HR system's data, in the plum of HR's side; Rohan Desai, Finance's management accountant, in the warm brown
   of Finance's; and Linh Nguyen, the casual tutor the data is about, who wears no colour of a side. Noor Rahman, Sam Okafor and Jun
   Park are the agent films' (AG_CAST). Say rules for the voice are in numbers.md. */
const MD_CAST={
  ingrid:{name:"Ingrid Holm",role:"HR",skin:[236,204,182],hair:{style:"bun",c:[196,176,140]},glasses:[70,62,58],top:{kind:"blazer",c:[98,74,104],inner:[238,234,228]},breath:0.28},
  rohan:{name:"Rohan Desai",role:"Finance",skin:[182,132,98],hair:{style:"side",c:[30,26,26]},glasses:[52,40,34],top:{kind:"blazer",c:[124,104,82],inner:[234,236,240]},breath:0.26},
  linh:{name:"Linh Nguyen",role:"Casual tutor, HI101",skin:[232,196,166],hair:{style:"bob",c:[24,22,26]},earrings:[214,218,226],top:{kind:"cardigan",c:[132,136,142],inner:[236,234,230]},breath:0.3}
};
const md_who=who=>typeof who==="string"&&MD_CAST[who]?MD_CAST[who]:who;
const MD_ROLE={noor:"Data architect",sam:"Data platform",jun:"Data project"};

/* ---------------------------------------------------------------- a person in the night */
function md_person(ctx,who,x,y,s,o){o=o||{};const a=ctx.globalAlpha;if(a<0.004)return null;const W0=md_who(who),L0=Object.assign({key:[560,360],reach:780,shade:0.62,ground:0.4,warm:0.14,rim:MD.flow,rimA:0.7,rimW:7},o.light||{});
  const A=AG_FIG.anchor,m=ctx.getTransform(),M=m.translate(x,y).scale(o.flip?-s:s,s).translate(-A[0],-A[1]),cw=ctx.canvas.width,ch=ctx.canvas.height;
  const pt=(fx,fy)=>[M.a*fx+M.c*fy+M.e,M.b*fx+M.d*fy+M.f],k=Math.hypot(M.a,M.b);
  // the part of the canvas the person (and what the near hand may hold) can reach
  let L=1e9,R=-1e9,T0=1e9,B=-1e9;for(const [fx,fy] of [[-260,120],[820,120],[-260,1160],[820,1160]]){const q=pt(fx,fy);L=Math.min(L,q[0]);R=Math.max(R,q[0]);T0=Math.min(T0,q[1]);B=Math.max(B,q[1]);}
  L=Math.max(0,Math.floor(L));T0=Math.max(0,Math.floor(T0));R=Math.min(cw,Math.ceil(R));B=Math.min(ch,Math.ceil(B));if(R<=L||B<=T0)return null;const w=R-L,h=B-T0;
  // the person, whole, on a canvas of their own
  const [pc,px]=ag_buf("mdPerson",cw,ch);px.setTransform(m);let hands;try{hands=ag_person(px,W0,x,y,s,Object.assign({},o,{light:undefined}));}finally{px.setTransform(1,0,0,1,0,0);px.globalAlpha=1;}
  // the light: the far side sinks into the navy, the near side keeps its colour, and the face takes a little warmth
  const K=pt(L0.key[0],L0.key[1]),rad=L0.reach*k;px.globalCompositeOperation="source-atop";
  let g=px.createRadialGradient(K[0],K[1],0,K[0],K[1],rad);g.addColorStop(0,rgba(MD.navy,0.04));g.addColorStop(0.45,rgba(MD.navy,L0.shade*0.55));g.addColorStop(1,rgba(MD.navy,L0.shade));px.fillStyle=g;px.fillRect(L,T0,w,h);
  // and the body sinks into the night below the chest, so a person rises out of the dark
  if(L0.ground>0){const c0=pt(300,700),c1=pt(300,1100);g=px.createLinearGradient(c0[0],c0[1],c1[0],c1[1]);g.addColorStop(0,rgba(MD.navy,0));g.addColorStop(1,rgba(MD.navy,L0.ground));px.fillStyle=g;px.fillRect(L,T0,w,h);}
  if(L0.warm>0){g=px.createRadialGradient(K[0],K[1],0,K[0],K[1],rad*0.55);g.addColorStop(0,rgba([255,214,172],L0.warm));g.addColorStop(1,rgba([255,214,172],0));px.fillStyle=g;px.fillRect(L,T0,w,h);}
  px.globalCompositeOperation="source-over";
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(pc,L,T0,w,h,L,T0,w,h);
  // the rim: the silhouette less itself moved towards the light, so only the edge away from it (and the top of the head) is left
  if(L0.rimA>0){const rw=Math.max(1.5,L0.rimW*k),dir=o.flip?-1:1,[rc,rx]=ag_buf("mdRim",cw,ch);rx.drawImage(pc,L,T0,w,h,L,T0,w,h);
    rx.globalCompositeOperation="destination-out";rx.drawImage(pc,L,T0,w,h,L+dir*rw,T0+rw*0.45,w,h);
    rx.globalCompositeOperation="source-in";const fg=rx.createLinearGradient(0,T0,0,B);fg.addColorStop(0,rgba(L0.rim,1));fg.addColorStop(0.5,rgba(L0.rim,0.7));fg.addColorStop(1,rgba(L0.rim,0.05));rx.fillStyle=fg;rx.fillRect(L,T0,w,h);
    rx.globalCompositeOperation="source-over";ctx.globalCompositeOperation="lighter";ctx.globalAlpha=a*L0.rimA;ctx.drawImage(rc,L,T0,w,h,L,T0,w,h);
    // and its glow: the same edge, made small and laid on again larger, so it spreads softly
    const sw=Math.max(2,Math.ceil(w/6)),sh=Math.max(2,Math.ceil(h/6)),[sc,sx]=ag_buf("mdRimSoft",sw,sh);sx.drawImage(rc,L,T0,w,h,0,0,sw,sh);
    ctx.globalAlpha=a*L0.rimA*0.55;ctx.drawImage(sc,0,0,sw,sh,L,T0,w,h);}
  ctx.restore();return hands;}

// a person's name and the line under it (their role), and a small bar in the colour of their side
function md_nameTag(ctx,x,y,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const P_=typeof who==="string"?(MD_CAST[who]||AG_CAST[who]):who,
    name=o.name||(P_&&P_.name)||String(who),role=o.role!=null?o.role:(typeof who==="string"&&MD_ROLE[who])||(P_&&P_.role)||"",al=o.align||"left";
  ctx.save();ctx.globalAlpha*=a;const nw=md_tw(ctx,name,{w:800,size:32}),rw2=role?md_tw(ctx,role,{w:600,size:28}):0,ww=Math.max(nw,rw2),x0=al==="center"?x-ww/2:al==="right"?x-ww:x;
  if(o.col){ctx.save();ctx.shadowColor=rgba(o.col,0.9);ctx.shadowBlur=12;ctx.fillStyle=rgba(o.col,1);rr(ctx,x0-22,y-28,6,role?70:34,3);ctx.fill();ctx.restore();}
  md_T(ctx,name,x0,y,{w:800,size:32});if(role)md_T(ctx,role,x0,y+38,{w:600,size:28,col:MD.soft});ctx.restore();}

/* ===== Modern data basics: glass cards, pills, tags, the kicker, the mark, and the title and end cards =====
   Cards are panes of dark glass, as the intro's map draws them: nearly opaque, so words on them read at 8:1 or more; a faint light
   along the top edge; an edge in a colour only when the colour means something (look.js, MD: flow, agreed, pass, fail, wait,
   personal, a system's or a domain's colour), with a soft glow of it. Words on cards: a kicker in capitals, 28 px, letter-spaced, in
   the edge's colour; a title, 36 px; a line under it, 28 px, soft.
     md_card(ctx, x, y, w, h, o)       a pane: o.edge (a colour), o.glow (its strength, 0 to 1), o.r (corner), o.a, o.dash (an outline only,
                                       dashed: something that is shown but not copied), o.fill (a CSS colour)
     md_textCard(ctx, x, y, w, words, o) words {kick, title, sub}: a card that fits them; o.edge, o.kickCol, o.icon (an md_icon kind, at
                                       the top right, in the edge's colour), o.mono (the title in IBM Plex Mono), o.a, o.k (springs from
                                       its centre, 0 to 1), o.measure (only measure); returns {x, y, w, h}
     md_pill(ctx, x, y, text, o)       a solid pill centred on (x, y), dark words on its colour: o.col (MD.pass by default), o.icon
                                       ("tick", "cross", "warn", "lock", "clock", any md_icon kind), o.size (30), o.a, o.k
     md_tag(ctx, x, y, text, o)        an outlined tag, words in its colour: o.col, o.icon, o.align ("left" or "center"), o.size (28), o.a
     md_kicker(ctx, num, title, o)     the film's number and title at the top left
     md_mark(ctx, cx, cy, r, p, a)     the module's mark: a wheel of light drawing itself, its hub gold (the wheel was invented before)
     md_veil(ctx, S, a)                the night laid over the frame, for the title and end cards
     md_title(ctx, S, t, t0, title, sub, line)          the title card from t0
     md_end(ctx, S, t, t0, title, line, n, series)     the end card from t0: the film's line, the mark, the title, "Film 1 of 3 · Data that moves" */

function md_card(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const r=o.r==null?18:o.r,e=o.edge||null;ctx.save();ctx.globalAlpha*=a;
  if(o.dash){ctx.lineWidth=o.lw||2.4;ctx.setLineDash(o.dash===true?[12,10]:o.dash);ctx.strokeStyle=rgba(e||MD.dim,0.95);rr(ctx,x,y,w,h,r);ctx.fillStyle="rgba(8,14,30,0.42)";ctx.fill();ctx.stroke();ctx.restore();return;}
  if(e){ctx.shadowColor=rgba(e,0.5*(o.glow==null?1:o.glow));ctx.shadowBlur=26;}
  rr(ctx,x,y,w,h,r);ctx.fillStyle=o.fill||"rgba(11,19,38,0.94)";ctx.fill();ctx.shadowBlur=0;ctx.shadowColor="transparent";
  const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,"rgba(255,255,255,0.07)");g.addColorStop(0.4,"rgba(255,255,255,0.012)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;rr(ctx,x,y,w,h,r);ctx.fill();
  ctx.lineWidth=o.lw||(e?2.2:1.4);ctx.strokeStyle=e?rgba(e,o.edgeA==null?0.9:o.edgeA):"rgba(170,200,245,0.3)";rr(ctx,x,y,w,h,r);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.14)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+r,y+1.5);ctx.lineTo(x+w-r,y+1.5);ctx.stroke();ctx.restore();}
const MD_PAD=28;
function md_textCard(ctx,x,y,w,words,o){o=o||{};const inner=w-MD_PAD*2-(o.icon?52:0),tf={w:700,size:36,f:o.mono?"mono":undefined},tl=words.title?md_wrap(ctx,words.title,inner,tf):[],sl=words.sub?md_wrap(ctx,words.sub,w-MD_PAD*2,{w:500,size:28}):[];
  const h=MD_PAD+(words.kick?40:0)+tl.length*46+sl.length*38+MD_PAD-(words.kick?0:6)+(tl.length||sl.length?0:-10),bb={x,y,w,h};if(o.measure)return bb;
  const a=o.a==null?1:o.a;if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,h,{edge:o.edge,glow:o.glow,dash:o.dash});const kc=o.kickCol||o.edge||MD.soft;let yy=y+MD_PAD+24;
  if(words.kick){md_T(ctx,String(words.kick).toUpperCase(),x+MD_PAD,yy,{w:800,size:28,ls:4,col:kc});yy+=18;}else yy-=24;
  for(const l of tl){yy+=46;md_T(ctx,l,x+MD_PAD,yy,Object.assign({col:MD.ink},tf));}
  for(const l of sl){yy+=38;md_T(ctx,l,x+MD_PAD,yy,{w:500,size:28,col:MD.soft});}
  if(o.icon)md_icon(ctx,o.icon,x+w-MD_PAD-18,y+MD_PAD+18,40,o.edge||MD.ink);
  ctx.restore();return bb;}
function md_pill(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||30,col=o.col||MD.pass,icon=o.icon,w=md_tw(ctx,text,{w:800,size})+(icon?100:60),h=size+30,bx=x-w/2,by=y-h/2;
  if(a<=0.004)return{x:bx,y:by,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  ctx.shadowColor=rgba(col,0.55);ctx.shadowBlur=22;rr(ctx,bx,by,w,h,h/2);ctx.fillStyle=rgba(col,1);ctx.fill();ctx.shadowBlur=0;
  const g=ctx.createLinearGradient(0,by,0,by+h);g.addColorStop(0,"rgba(255,255,255,0.28)");g.addColorStop(0.5,"rgba(255,255,255,0)");ctx.fillStyle=g;rr(ctx,bx,by,w,h,h/2);ctx.fill();
  if(icon)md_icon(ctx,icon,bx+44,y,32,MD.navy);md_T(ctx,text,icon?bx+72:x,y+size*0.36,{w:800,size,align:icon?"left":"center",col:MD.navy});ctx.restore();return{x:bx,y:by,w,h};}
function md_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||28,col=o.col||MD.flow,icon=o.icon,w=md_tw(ctx,text,{w:700,size})+(icon?88:44),h=size+24,bx=o.align==="center"?x-w/2:x,by=y-h/2;
  if(a<=0.004)return{x:bx,y:by,w,h};ctx.save();ctx.globalAlpha*=a;md_card(ctx,bx,by,w,h,{edge:col,r:h/2,glow:0.6,fill:"rgba(7,12,26,0.94)"});
  if(icon)md_icon(ctx,icon,bx+36,y,30,col);md_T(ctx,text,bx+(icon?62:22),y+size*0.36,{w:700,size,col});ctx.restore();return{x:bx,y:by,w,h};}

/* ---------------------------------------------------------------- the kicker, the mark, the title and end cards */
function md_kicker(ctx,num,title,o){o=o||{};const x=o.x||96,y=o.y||100,a=o.a==null?1:o.a;if(a<=0.004)return;
  md_T(ctx,num,x,y,{w:500,size:28,f:"mono",col:MD.flow,a});md_T(ctx,String(title).toUpperCase(),x+md_tw(ctx,num,{w:500,size:28,f:"mono"})+24,y,{w:800,size:28,ls:3.5,col:MD.soft,a});}
// the module's mark: a wheel, its rim drawing itself in the map's light, six spokes after it, and a gold hub
function md_mark(ctx,cx,cy,r,p,a){if(a<=0.01)return;p=clamp(p,0,1);ctx.save();ctx.globalAlpha*=a;const rim=ag_sine(p/0.7),sp=clamp((p-0.45)/0.45,0,1);
  ctx.lineCap="round";ctx.shadowColor=rgba(MD.flow,0.9);ctx.shadowBlur=r*0.3;ctx.strokeStyle=rgba(MD.flow,1);ctx.lineWidth=Math.max(2,r*0.09);
  ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*rim);ctx.stroke();
  ctx.lineWidth=Math.max(1.5,r*0.05);for(let i=0;i<6;i++){const f=clamp(sp*6-i,0,1);if(f<=0)continue;const an=-Math.PI/2+i*TAU/6;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*r*0.2,cy+Math.sin(an)*r*0.2);ctx.lineTo(cx+Math.cos(an)*r*lerp(0.2,0.92,f),cy+Math.sin(an)*r*lerp(0.2,0.92,f));ctx.stroke();}
  const hub=ag_sine((p-0.3)/0.5);if(hub>0){ctx.shadowColor=rgba(MD.agreed,0.9);ctx.fillStyle=rgba(MD.agreed,hub);ctx.beginPath();ctx.arc(cx,cy,r*0.17,0,TAU);ctx.fill();}ctx.restore();}
function md_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle="rgba(4,8,18,"+clamp(a,0,1)+")";ctx.fillRect(0,0,W,H);}
function md_title(ctx,S,t,t0,title,sub,line){const oA=ag_in(t,t0,0.8),tA=ag_in(t,t0+0.5,0.8);if(oA<=0)return;md_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{md_mark(ctx,960,320,64,(t-t0-0.4)/1.8,1);md_T(ctx,title,960,520,{w:800,size:84,align:"center"});
    if(sub)md_T(ctx,sub,960,598,{w:600,size:36,align:"center",col:MD.soft});withA(ctx,ag_in(t,t0+1.2,0.8),()=>md_T(ctx,line,960,700,{w:800,size:28,ls:3.5,align:"center",col:MD.flow}));});}
// n: "Film 1 of 3"; series: the series' name
function md_end(ctx,S,t,t0,title,line,n,series){const oA=ag_in(t,t0,1.0),tA=ag_in(t,t0+0.6,0.9);if(oA<=0)return;md_veil(ctx,S,oA*0.92);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)md_T(ctx,line,960,350,{w:700,size:48,align:"center"});md_mark(ctx,960,496,56,(t-t0-0.7)/1.6,1);md_T(ctx,title,960,650,{w:800,size:44,align:"center"});
    md_T(ctx,(n?n+" · ":"")+(series||"Modern data basics")+" · Learning Data",960,708,{w:600,size:28,align:"center",col:MD.soft});});}

/* ===== Modern data basics: the platform map's parts, drawn near =====
   The intro's map (The Inner Life of Data, chapter "The layers together") shows the university's systems on the left, the platform's
   layers in the middle with Databricks under them, and who reads the result on the right. This module works inside that map, so its
   parts are drawn here at the size a film needs, with words of 28 px or more as seen, in the colours the intro gives them.
     md_system(ctx, x, y, w, key, o)  an application, a system of record: key in MD_SYS ("hr", "fin", "sis", "lms") or {n, s, c};
                                      o.sub (the line under its name), o.h (110), o.lit (0 to 1, it glows), o.a; returns its box and
                                      its port, where a lane leaves it ({x, y, w, h, port: [x, y]})
     md_platform(ctx, x, y, w, h, o)  the platform: a large pane with Databricks' mark and name at the top left (o.logos false: the
                                      name only), o.title ("Databricks"), o.sub, o.uc (true: the Unity Catalog bar along its foot,
                                      "Unity Catalog · one place to find and govern it all" or o.ucText), o.lit, o.a; returns its inside
     md_layer(ctx, x, y, w, h, key, o) a layer of the medallion, as the intro's vaults: key "bronze", "silver" or "gold", o.sub (what it
                                      does: "keeps what arrived"), o.lit, o.a, o.cells (false: no cells)
     md_table(ctx, x, y, w, o)        a table, or something like one: o.name (in IBM Plex Mono), o.kind ("table", "streaming table",
                                      "materialized view", "view", "foreign table", "metric view", "volume", or your own words), o.icon
                                      (an md_icon kind; by default the kind's), o.col (its colour: MD.flow), o.ghost (true: drawn dashed,
                                      for what is shown here but lives elsewhere: a foreign table read in place, a mirrored one), o.lit,
                                      o.a, o.k; returns its box and ports {x, y, w, h, l: [x, y], r: [x, y]}
     md_store(ctx, x, y, s, col, o)   a store of data, drawn as the intro's database glyph, s px tall
     md_reader(ctx, x, y, w, o)       who reads it: o.title, o.sub, o.logo (a logo's key: "fabric", "powerbi", "databricks", "dbt"),
                                      o.icon (an md_icon kind when there is no logo), o.col, o.lit, o.a; returns its box and its port (left)
     md_way(ctx, kind, a, b, t, o)    one of the ways data moves, from point a to point b: "connector" (a managed connector: a lane
                                      that brings copies in, with its packets), "events" (each change as it's made), "batch" (a whole
                                      file now and then), "query" (a query in place, federation: a dashed lane, a question out and the
                                      answer back, nothing kept), "mirror" (the catalog shown in another tool: a dashed lane, nothing
                                      copied), "share" (shared with a partner where it lives: a dashed lane), "api" (served on request: a
                                      request out, an answer back); o.col, o.u (how far it's drawn, 0 to 1), o.icon (true: its icon in
                                      the middle, with o.label under it), o.a, o.bend
     md_map(ctx, t, o)                the whole map at once, at the frame's size (z 1): the systems, the platform with its three
                                      layers, and its readers, with the lanes between them; o.a, o.lit (a part's key: "hr", "fin",
                                      "bronze", "fabric", ... it glows), o.dim (keys drawn faint), o.flow (false: no packets), o.parts
                                      (the keys to draw; all by default). MD_MAP holds where each part is, for a film that draws its
                                      own over it or sends the camera there */

const MD_SYS={hr:{n:"HR system",s:"Staff and contracts",c:MD.sys.hr},fin:{n:"Finance system",s:"The general ledger",c:MD.sys.fin},
  sis:{n:"Student system",s:"Students' records",c:MD.sys.sis},lms:{n:"Learning platform",s:"Classes and work",c:MD.sys.lms}};
function md_system(ctx,x,y,w,key,o){o=o||{};const S_=typeof key==="string"?MD_SYS[key]:key,c=S_.c,h=o.h||110,a=o.a==null?1:o.a,lit=o.lit||0,box={x,y,w,h,port:[x+w,y+h/2]};if(a<=0.004)return box;
  ctx.save();ctx.globalAlpha*=a;if(lit>0)glow(ctx,x+w/2,y+h/2,w*0.75,c,0.35*lit);md_card(ctx,x,y,w,h,{edge:c,glow:0.6+0.8*lit,edgeA:0.6+0.4*lit});led(ctx,x+14,y+18,6,h-36,c);
  md_T(ctx,S_.n,x+40,y+(o.sub===false?h/2+11:h/2-6),{w:800,size:32});if(o.sub!==false)md_T(ctx,o.sub||S_.s,x+40,y+h/2+32,{w:500,size:28,col:MD.soft});
  md_icon(ctx,"store",x+w-46,y+h/2,40,c);ctx.restore();return box;}
function md_platform(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,lit=o.lit||0,inner={x:x+24,y:y+96,w:w-48,h:h-96-(o.uc?110:24)};if(a<=0.004)return inner;ctx.save();ctx.globalAlpha*=a;
  md_card(ctx,x,y,w,h,{edge:MD.dbx,glow:0.5+0.8*lit,edgeA:0.55+0.35*lit,r:24,fill:"rgba(9,15,31,0.9)"});let tx=x+30;
  if(o.logos!==false&&typeof LOGO!=="undefined"&&LOGO.databricks){tx+=logo(ctx,"databricks",x+28,y+26,44)+16;}
  md_T(ctx,o.title||"Databricks",tx,y+62,{w:800,size:36});if(o.sub)md_T(ctx,o.sub,tx+md_tw(ctx,o.title||"Databricks",{w:800,size:36})+22,y+62,{w:500,size:28,col:MD.soft});
  if(o.uc){const by=y+h-96;md_card(ctx,x+24,by,w-48,72,{edge:MD.flow,glow:0.5,r:14,fill:"rgba(7,12,26,0.95)"});md_icon(ctx,"table",x+66,by+36,36,MD.flow);
    md_T(ctx,o.ucText||"Unity Catalog · one place to find and govern it all",x+100,by+46,{w:700,size:28});}
  ctx.restore();return inner;}
function md_layer(ctx,x,y,w,h,key,o){o=o||{};const a=o.a==null?1:o.a,c=MD.layer[key]||key,lit=o.lit||0;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(lit>0)glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.7,c,0.3*lit);md_card(ctx,x,y,w,h,{edge:c,glow:0.6+0.8*lit,r:20});led(ctx,x+24,y+14,w-48,4,c);
  const nm=o.name||key[0].toUpperCase()+key.slice(1);md_T(ctx,nm,x+w/2,y+66,{w:800,size:32,align:"center"});
  if(o.cells!==false){const cs=18,gap=8,top=y+96,bot=y+h-(o.sub?36+34*md_wrap(ctx,o.sub,w-28,{w:600,size:28}).length:24),cols=Math.max(1,Math.floor((w-48)/(cs+gap))),rows=Math.max(0,Math.floor((bot-top)/(cs+gap))),ox=x+(w-(cols*(cs+gap)-gap))/2;
    for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){const v=hash(r*37+q,key.length*3+1);ctx.fillStyle=v>0.78?"rgba(150,180,230,0.10)":rgba(c,0.22+0.5*v);rr(ctx,ox+q*(cs+gap),top+r*(cs+gap),cs,cs,4);ctx.fill();}}
  // what the layer does, under its cells, in as many lines as its width needs
  if(o.sub){const ls=md_wrap(ctx,o.sub,w-28,{w:600,size:28});ls.forEach((l,i)=>md_T(ctx,l,x+w/2,y+h-26-(ls.length-1-i)*34,{w:600,size:28,align:"center",col:MD.soft}));}ctx.restore();}
const MD_KIND_ICON={"table":"table","streaming table":"stream","materialized view":"refresh","view":"view","foreign table":"query","metric view":"agreed","volume":"volume","mirrored table":"mirror"};
function md_table(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||MD.flow,h=o.kind?104:72,lit=o.lit||0,box={x,y,w,h,l:[x,y+h/2],r:[x+w,y+h/2]};if(a<=0.004)return box;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(lit>0)glow(ctx,x+w/2,y+h/2,w*0.6,col,0.3*lit);
  md_card(ctx,x,y,w,h,{edge:col,glow:0.5+0.8*lit,dash:o.ghost?[10,9]:false,r:14});const ic=o.icon||MD_KIND_ICON[o.kind]||"table";
  if(ic==="agreed")md_icon(ctx,"contract",x+38,y+h/2,36,col);else md_icon(ctx,ic,x+38,y+h/2,36,col);
  md_T(ctx,o.name||"",x+72,y+(o.kind?46:h/2+10),{w:500,size:28,f:"mono"});if(o.kind)md_T(ctx,o.kind,x+72,y+84,{w:600,size:28,col:o.ghost?col:MD.soft});ctx.restore();return box;}
function md_store(ctx,x,y,s,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=s*0.25;md_icon(ctx,"store",x,y,s*1.2,col,{lw:3.2});ctx.restore();}
function md_reader(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||MD.ink,h=o.h||(o.sub?110:84),lit=o.lit||0,box={x,y,w,h,port:[x,y+h/2]};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  if(lit>0)glow(ctx,x+w/2,y+h/2,w*0.7,col,0.3*lit);md_card(ctx,x,y,w,h,{edge:o.col||null,glow:0.5+0.8*lit});let tx=x+26;
  if(o.logo&&typeof LOGO!=="undefined"&&LOGO[o.logo]){tx+=logo(ctx,o.logo,x+24,y+h/2-24,48)+18;}else if(o.icon){md_icon(ctx,o.icon,x+48,y+h/2,40,col);tx=x+88;}
  md_T(ctx,o.title||"",tx,y+(o.sub?h/2-6:h/2+11),{w:800,size:32});if(o.sub)md_T(ctx,o.sub,tx,y+h/2+32,{w:500,size:28,col:MD.soft});ctx.restore();return box;}

/* ---------------------------------------------------------------- the ways data moves */
const MD_WAY={connector:{icon:"connector",flow:"events",dash:false},events:{icon:"event",flow:"events",dash:false},batch:{icon:"batch",flow:"batch",dash:false},
  stream:{icon:"stream",flow:"stream",dash:false},query:{icon:"query",flow:null,dash:true},mirror:{icon:"mirror",flow:null,dash:true},share:{icon:"share",flow:null,dash:true},api:{icon:"api",flow:null,dash:false}};
function md_way(ctx,kind,a,b,t,o){o=o||{};const al=o.a==null?1:o.a;if(al<=0.004)return;const K=MD_WAY[kind]||MD_WAY.connector,col=o.col||MD.flow,pts=o.pts||md_curve(a,b,{bend:o.bend}),u=o.u==null?1:o.u;
  md_lane(ctx,pts,col,al*(K.dash?0.9:0.85),{u,dash:K.dash,t});
  if(u>=1&&o.flow!==false){if(K.flow)md_flow(ctx,pts,t,{kind:K.flow,col,a:al,every:o.every});
    // a query in place and a request: a question goes out and the answer comes back along the same lane; nothing stays
    else if(kind==="query"||kind==="api"){const p=mk(pts.map(q=>P(q[0],q[1])));spawn(t,3.2,2.6,0,(v)=>{const go=v<0.5,q=at(p,go?ease(v*2):1-ease((v-0.5)*2)),f=sstep(0,0.08,v)*(1-sstep(0.92,1,v))*al;
        glow(ctx,q.x,q.y,go?18:30,go?MD.ink:col,0.8*f);if(!go){ctx.save();ctx.globalAlpha*=f;rr(ctx,q.x-12,q.y-9,24,18,4);ctx.fillStyle=rgba(mix(col,[255,255,255],0.4),1);ctx.fill();ctx.restore();}});}}
  if(o.icon){const q=at(mk(pts.map(p=>P(p[0],p[1]))),0.5),ia=o.iconA==null?1:o.iconA;ctx.save();ctx.globalAlpha*=al*ia;
    ctx.beginPath();ctx.arc(q.x,q.y,34,0,TAU);ctx.fillStyle="rgba(7,12,26,0.96)";ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=18;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4;ctx.stroke();
    md_icon(ctx,K.icon,q.x,q.y,38,col);if(o.label)md_T(ctx,o.label,q.x,q.y+(o.labelBelow==null?78:o.labelBelow),{w:700,size:28,align:"center",col});ctx.restore();}}

/* ---------------------------------------------------------------- the whole map */
const MD_MAP={
  heads:{sys:[70,176,"Where data is born"],plat:[560,176,"The platform"],read:[1440,176,"Who reads it"]},
  hr:[70,214,410],fin:[70,364,410],sis:[70,514,410],lms:[70,664,410],
  platform:[560,214,820,600],bronze:[594,330,236,300],silver:[852,330,236,300],gold:[1110,330,236,300],
  fabric:[1440,214,420,"Microsoft Fabric","Power BI, Finance","fabric"],genie:[1440,364,420,"Genie","Questions in plain words","databricks"],
  dash:[1440,514,420,"Dashboards","For every pay day","databricks"],apps:[1440,664,420,"Apps and agents","The claims app, others","databricks"]
};
function md_map(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const M_=MD_MAP,has=k=>!o.parts||o.parts.includes(k),dim=k=>o.dim&&o.dim.includes(k)?0.3:1,lit=k=>o.lit===k||(Array.isArray(o.lit)&&o.lit.includes(k))?1:0;
  ctx.save();ctx.globalAlpha*=a;
  for(const [k,[x,y,s]] of Object.entries(M_.heads))if(has("heads"))md_label(ctx,x,y,s,{});
  const ports={};for(const k of["hr","fin","sis","lms"])if(has(k)){const [x,y,w]=M_[k];withA(ctx,dim(k),()=>{ports[k]=md_system(ctx,x,y,w,k,{lit:lit(k)}).port;});}
  if(has("platform")){const [x,y,w,h]=M_.platform;withA(ctx,dim("platform"),()=>md_platform(ctx,x,y,w,h,{uc:true,lit:lit("platform")}));}
  const L=[["bronze","keeps what arrived"],["silver","makes it consistent"],["gold","makes it useful"]];
  for(const [k,sub] of L)if(has(k)){const [x,y,w,h]=M_[k];withA(ctx,dim(k),()=>md_layer(ctx,x,y,w,h,k,{sub,lit:lit(k)}));}
  // lanes: each system into bronze, bronze to silver to gold, gold out to each reader
  const B=M_.bronze,G=M_.gold,flow=o.flow!==false;
  for(const k of["hr","fin","sis","lms"])if(ports[k]&&has("bronze")){const c=MD.sys[k];withA(ctx,dim(k),()=>{const pts=md_curve(ports[k],[B[0],B[1]+B[3]/2],{bend:0.55});md_lane(ctx,pts,c,0.8);if(flow)md_flow(ctx,pts,t,{col:c,off:k.length*0.3,every:1.3});});}
  if(has("silver")&&has("bronze")){const pts=[[B[0]+B[2],B[1]+B[3]/2],[M_.silver[0],B[1]+B[3]/2]];md_lane(ctx,pts,MD.flow,0.8);if(flow)md_flow(ctx,pts,t,{off:0.2,dur:0.6,every:0.9});}
  if(has("gold")&&has("silver")){const S_=M_.silver,pts=[[S_[0]+S_[2],B[1]+B[3]/2],[G[0],B[1]+B[3]/2]];md_lane(ctx,pts,MD.flow,0.8);if(flow)md_flow(ctx,pts,t,{off:0.5,dur:0.6,every:0.9});}
  for(const k of["fabric","genie","dash","apps"])if(has(k)){const [x,y,w,title,sub,lg]=M_[k];withA(ctx,dim(k),()=>{const r=md_reader(ctx,x,y,w,{title,sub,logo:lg,col:k==="fabric"?MD.dom.finance:null,lit:lit(k)});
      // Fabric reads through a mirror: the catalog is shown there and the data read where it lives, so its lane is dashed and carries nothing
      if(has("gold")){const pts=md_curve([G[0]+G[2],G[1]+G[3]/2],r.port,{bend:0.6}),mir=k==="fabric";md_lane(ctx,pts,MD.layer.gold,0.75,{dash:mir,t});if(flow&&!mir)md_flow(ctx,pts,t,{col:MD.layer.gold,off:k.length*0.25,every:1.6});}});}
  ctx.restore();}

/* ===== Modern data basics: the tools' pages =====
   Tools look like their pages, drawn for the film at the level of architecture, never a click-by-click tour: a window of dark glass
   with a small bar along its top naming the product, with its official logo where the film's film.json says "logos": true (The
   Inner Life of Data's Databricks and dbt marks, this module's Microsoft Fabric, Power BI and mirrored catalog marks, logos.js), and
   no release status anywhere on it. What the page shows is drawn by the film in the window's body, often with the rows and the tree
   below. Every word is at least 28 px as seen: a page drawn small is a picture, and its words are marked as decoration ({deco: 1}).
     md_window(ctx, x, y, w, h, o)    a tool's page: o.logo (a logo's key), o.product ("Databricks"), o.title (what the page is, at the
                                      right of the bar: "Catalog"), o.edge (a colour that means something), o.lit, o.a, o.k;
                                      o.draw(ctx, body) draws in the body {x, y, w, h}; returns the body
     md_rows(ctx, x, y, cols, rows, o) a table of words: cols [{h: "FIELD", w: 300, f: "mono"}, ...] (each column's heading, width and
                                      font), rows [[cell, ...], ...], a cell a string or {s, col, icon, f}; o.rh (row height, 54), o.lit
                                      (a row's index, or several: they glow), o.rowA (row, i) => its opacity (rows coming in one by one),
                                      o.a; returns the height drawn
     md_tree(ctx, x, y, items, o)     a catalog's tree: items [{name, kind ("catalog", "schema", "table", "view", "volume", "metric view",
                                      "streaming table", "materialized view", "foreign table", "mirrored table"), depth, col, a}], o.rh (52),
                                      o.indent (40), o.a; returns the height drawn */

function md_window(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,bar=68,body={x:x+20,y:y+bar+16,w:w-40,h:h-bar-36};if(a<=0.004)return body;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(o.lit)glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.6,o.edge||MD.flow,0.25*o.lit);
  md_card(ctx,x,y,w,h,{edge:o.edge||[150,175,215],glow:o.edge?0.7:0.25,edgeA:o.edge?0.85:0.45,r:18,fill:"rgba(10,17,35,0.96)"});
  ctx.save();rr(ctx,x+1,y+1,w-2,bar,17);ctx.clip();ctx.fillStyle="rgba(255,255,255,0.045)";ctx.fillRect(x,y,w,bar);ctx.restore();
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+12,y+bar);ctx.lineTo(x+w-12,y+bar);ctx.stroke();
  let tx=x+24;if(o.logo&&typeof LOGO!=="undefined"&&LOGO[o.logo])tx+=logo(ctx,o.logo,x+22,y+bar/2-19,38)+14;
  if(o.product)md_T(ctx,o.product,tx,y+bar/2+10,{w:800,size:28});if(o.title)md_T(ctx,o.title,x+w-24,y+bar/2+10,{w:600,size:28,align:"right",col:MD.soft});
  if(o.draw){ctx.save();rr(ctx,x+2,y+bar+1,w-4,h-bar-3,16);ctx.clip();o.draw(ctx,body);ctx.restore();}
  ctx.restore();return body;}
function md_rows(ctx,x,y,cols,rows,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||54,lits=o.lit==null?[]:[].concat(o.lit),W_=cols.reduce((s,c)=>s+c.w,0);if(a<=0.004)return rh*(rows.length+1);ctx.save();ctx.globalAlpha*=a;
  let cx=x;for(const c of cols){if(c.h)md_T(ctx,String(c.h).toUpperCase(),cx+14,y+36,{w:800,size:28,ls:3,col:MD.soft});cx+=c.w;}
  ctx.strokeStyle="rgba(170,200,245,0.22)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y+rh);ctx.lineTo(x+W_,y+rh);ctx.stroke();
  rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(r,i):1;if(ra<=0.004)return;const ry=y+rh*(i+1);ctx.save();ctx.globalAlpha*=ra;
    if(lits.includes(i)){const lc=o.litCol||MD.flow;ctx.fillStyle=rgba(lc,0.13);rr(ctx,x-6,ry+5,W_+12,rh-8,10);ctx.fill();ctx.strokeStyle=rgba(lc,0.8);ctx.lineWidth=1.8;rr(ctx,x-6,ry+5,W_+12,rh-8,10);ctx.stroke();}
    let xx=x;r.forEach((cell,j)=>{const c=cols[j]||{w:200},q=typeof cell==="object"&&cell?cell:{s:String(cell==null?"":cell)},f=q.f||c.f;let tx=xx+14;
      if(q.icon){md_icon(ctx,q.icon,tx+16,ry+rh/2,30,q.col||MD.ink);tx+=42;}
      md_T(ctx,q.s,tx,ry+rh/2+10,{w:f==="mono"?500:600,size:28,f,col:q.col||MD.ink});xx+=c.w;});
    ctx.restore();});
  ctx.restore();return rh*(rows.length+1);}
const MD_TREE_ICON={catalog:"store",schema:"volume",table:"table",view:"view",volume:"volume","metric view":"contract","streaming table":"stream","materialized view":"refresh","foreign table":"query","mirrored table":"mirror"};
function md_tree(ctx,x,y,items,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||52,ind=o.indent||40;if(a<=0.004)return rh*items.length;ctx.save();ctx.globalAlpha*=a;
  items.forEach((it,i)=>{const ia=it.a==null?1:it.a;if(ia<=0.004)return;const yy=y+i*rh,xx=x+(it.depth||0)*ind,col=it.col||MD.ink;ctx.save();ctx.globalAlpha*=ia;
    if(it.depth){ctx.strokeStyle="rgba(170,200,245,0.25)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(xx-ind+16,yy-rh/2+10);ctx.lineTo(xx-ind+16,yy+rh/2-4);ctx.lineTo(xx-6,yy+rh/2-4);ctx.stroke();}
    md_icon(ctx,MD_TREE_ICON[it.kind]||"table",xx+16,yy+rh/2-4,30,it.col||MD.flow);md_T(ctx,it.name,xx+42,yy+rh/2+6,{w:it.kind==="catalog"||it.kind==="schema"?700:500,size:28,f:it.kind==="catalog"||it.kind==="schema"?undefined:"mono",col});
    ctx.restore();});
  ctx.restore();return rh*items.length;}

/* ===== Reports on demand: the places and people of its own =====
   Drawn in the module's look (films/data-that-moves/shared/: the intro's navy, glass cards, people lit for the dark), with a prefix of
   its own, rd_. London in 1936: a telephone exchange at night, its switchboard of jacks and lamps and its clock on the wall, an
   operator at the board; the speaking clock's machine, its glass discs and its clock; Jane Cain at a microphone; a telephone dial.
   Today: Finance's office at the university, Rohan's desk and its glass screen, painted once as the places are.
   The past wears its own warm lamplight on the navy, so it reads as another time; the university keeps the map's cool light. People
   of 1936 are dressed for their time: an operator's headset, a cardigan over a blouse, hair up or in waves. */

/* ---------------------------------------------------------------- 1936: the warm light of the past */
const RD={lamp:[255,196,120],brass:[214,168,96],wood:[66,44,36],woodHi:[118,82,60],ivory:[246,232,204],jack:[22,16,16]};

// the operator's receiver on its band: a thin steel band over the head from the near ear, a flat black receiver with a brass rim
// (in the head's picture)
function rd_headset(c,P){c.save();c.lineCap="round";c.strokeStyle="rgba(120,124,132,1)";c.lineWidth=5;
  c.beginPath();c.moveTo(250,416);c.bezierCurveTo(230,372,236,322,264,302);c.bezierCurveTo(292,284,330,284,362,300);c.stroke();
  c.strokeStyle="rgba(220,224,232,0.5)";c.lineWidth=1.6;c.beginPath();c.moveTo(244,404);c.bezierCurveTo(230,366,238,326,264,306);c.stroke();
  ag_soft(c,cc=>cc.ellipse(252,430,18,24,0.15,0,TAU),[24,22,24],[90,86,90],246,422,22,"rgba(0,0,0,0.5)",8);
  c.strokeStyle=rgba(RD.brass,0.9);c.lineWidth=2.5;c.beginPath();c.ellipse(252,430,18,24,0.15,0,TAU);c.stroke();
  c.fillStyle="rgba(10,10,12,1)";c.beginPath();c.ellipse(254,431,8,11,0.15,0,TAU);c.fill();c.restore();}
// 1930s finger waves: three broad soft crests over the hair, each a lighter band that catches the lamp (in the head's picture)
function rd_waves(c,P){const hc=P.hair.c;c.save();ag_shape(c,AG_HAIR[P.hair.style]||AG_HAIR.side);c.clip();c.lineCap="round";
  for(const [x0,y0,k] of [[214,318,1],[206,372,0.85],[204,430,0.7]]){
    const path=()=>{c.beginPath();c.moveTo(x0,y0+10);c.bezierCurveTo(x0+46,y0-22,x0+86,y0+26,x0+130,y0+2);c.bezierCurveTo(x0+158,y0-12,x0+176,y0-4,x0+196,y0-18);};
    c.strokeStyle=rgba(ag_lt(hc,0.35),0.16*k);c.lineWidth=16;path();c.stroke();
    c.strokeStyle=rgba(ag_lt(hc,0.6),0.22*k);c.lineWidth=3;c.save();c.translate(0,-4);path();c.stroke();c.restore();}
  c.restore();}
// hair worn up as the 1930s wore it: a soft roll low at the nape, behind the ear (in the head's picture)
function rd_roll(c,P){const hc=P.hair.c;c.save();
  ag_soft(c,cc=>cc.ellipse(222,468,40,30,-0.25,0,TAU),hc,ag_lt(hc,0.35),210,452,44,"rgba(0,0,0,0.35)",6);
  c.strokeStyle=rgba(ag_lt(hc,0.5),0.35);c.lineWidth=2.5;c.lineCap="round";
  for(const k of [-12,0,12]){c.beginPath();c.ellipse(222,468+k*0.4,30-Math.abs(k),18,-0.25,Math.PI*1.1,Math.PI*1.9);c.stroke();}c.restore();}
// the people of 1936: an operator at the exchange, and Jane Cain, the operator whose voice the speaking clock spoke with
const RD_OP={key:"rd_op",name:"An operator",skin:[234,200,172],hair:{style:"side",c:[150,110,70]},earrings:[226,214,190],top:{kind:"cardigan",c:[50,56,72],inner:[234,226,212]},hat:{paint:(c,P)=>{rd_roll(c,P);rd_waves(c,P);rd_headset(c,P);}},breath:0.3};
const RD_CAIN={key:"rd_cain",name:"Jane Cain",skin:[238,206,180],hair:{style:"bob",c:[58,42,34]},earrings:[226,214,190],top:{kind:"suit",c:[92,68,76],inner:[238,232,222]},hat:{paint:rd_waves},breath:0.29};
// how the past is lit: a warm lamp in front of the face, the map's rim behind, a little warmer than today's
const RD_PAST={key:[560,360],reach:820,shade:0.55,ground:0.42,warm:0.24,rim:[150,190,240],rimA:0.45,rimW:6};

/* ---------------------------------------------------------------- the exchange, at night
   The board fills the right of the frame: rows of jacks, each with its lamp, under a brass rail, over the shelf of plugs and cords.
   The clock hangs on the wall above it. RD_BOARD says where; lamps are lit live (rd_lamps). */
const RD_BOARD={x:780,y:330,w:1080,h:520,cols:14,rows:6,clock:[1120,176,100]};
function rd_lampAt(i,j){const B=RD_BOARD,dx=(B.w-120)/(B.cols-1),dy=(B.h-150)/(B.rows-1);return[B.x+60+i*dx,B.y+80+j*dy];}
function rd_paintExchange(c){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0d1220");g.addColorStop(0.6,"#0a0d18");g.addColorStop(1,"#05070c");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the wall: tall panels in the dark, and the warm pools of the hanging lamps
  c.strokeStyle="rgba(150,140,130,0.06)";c.lineWidth=2;for(let x=60;x<W;x+=240){c.beginPath();c.moveTo(x,0);c.lineTo(x,300);c.stroke();}
  c.fillStyle="rgba(120,100,80,0.07)";c.fillRect(0,296,W,6);
  for(const [x,y,r,a] of [[520,120,620,0.10],[1180,90,700,0.12],[1700,140,520,0.07]]){const q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(RD.lamp,a));q.addColorStop(1,rgba(RD.lamp,0));c.fillStyle=q;c.fillRect(0,0,W,H);}
  // the hanging lamps' shades
  for(const x of [520,1180,1700]){c.fillStyle="rgba(30,26,26,1)";c.beginPath();c.moveTo(x-46,58);c.lineTo(x+46,58);c.lineTo(x+22,24);c.lineTo(x-22,24);c.closePath();c.fill();
    c.strokeStyle="rgba(60,52,48,1)";c.lineWidth=3;c.beginPath();c.moveTo(x,24);c.lineTo(x,0);c.stroke();const q=c.createRadialGradient(x,64,0,x,64,60);q.addColorStop(0,rgba(RD.lamp,0.55));q.addColorStop(1,rgba(RD.lamp,0));c.fillStyle=q;c.fillRect(x-70,40,140,80);}
  // the board's cabinet: dark wood with a lit edge, its face of jacks and lamps
  const B=RD_BOARD;c.save();c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=40;c.fillStyle=rgba(RD.wood,1);rr(c,B.x-24,B.y-30,B.w+48,B.h+200,14);c.fill();c.restore();
  let wg=c.createLinearGradient(0,B.y-30,0,B.y+B.h+170);wg.addColorStop(0,rgba(RD.woodHi,0.5));wg.addColorStop(0.3,rgba(RD.wood,0));wg.addColorStop(1,"rgba(0,0,0,0.35)");c.fillStyle=wg;rr(c,B.x-24,B.y-30,B.w+48,B.h+200,14);c.fill();
  c.fillStyle="rgba(18,13,12,1)";rr(c,B.x,B.y,B.w,B.h,8);c.fill();c.strokeStyle=rgba(RD.brass,0.55);c.lineWidth=3;rr(c,B.x,B.y,B.w,B.h,8);c.stroke();
  // each place on the board: a lamp's cap above, a jack below, with a brass ring
  for(let j=0;j<B.rows;j++)for(let i=0;i<B.cols;i++){const [x,y]=rd_lampAt(i,j);
    c.fillStyle="rgba(54,40,30,1)";c.beginPath();c.arc(x,y,10,0,TAU);c.fill();c.strokeStyle="rgba(120,96,70,0.6)";c.lineWidth=1.6;c.stroke();
    c.fillStyle="rgba(8,6,6,1)";c.beginPath();c.arc(x,y+30,8,0,TAU);c.fill();c.strokeStyle=rgba(RD.brass,0.65);c.lineWidth=2.4;c.beginPath();c.arc(x,y+30,10,0,TAU);c.stroke();}
  // the shelf in front, its keys, and the plugs standing in pairs, their cords hanging below
  const sy=B.y+B.h+24;c.fillStyle=rgba(mix(RD.wood,[0,0,0],0.2),1);rr(c,B.x-24,sy,B.w+48,62,8);c.fill();c.fillStyle=rgba(RD.woodHi,0.45);c.fillRect(B.x-24,sy,B.w+48,4);
  for(let i=0;i<16;i++){const x=B.x+40+i*(B.w-80)/15;for(const [dx,h] of [[-9,30],[9,26]]){c.fillStyle="rgba(14,10,10,1)";rr(c,x+dx-5,sy-h,10,h,4);c.fill();c.fillStyle=rgba(RD.brass,0.8);rr(c,x+dx-3,sy-h-10,6,12,3);c.fill();}
    c.fillStyle="rgba(200,190,170,0.5)";c.beginPath();c.arc(x,sy+34,5,0,TAU);c.fill();}
  // the clock's place on the wall: its dark rim; the face and hands are drawn live
  const [cx,cy,cr]=B.clock;c.save();c.shadowColor="rgba(0,0,0,0.7)";c.shadowBlur=30;c.fillStyle="rgba(30,22,18,1)";c.beginPath();c.arc(cx,cy,cr+14,0,TAU);c.fill();c.restore();
  c.strokeStyle=rgba(RD.brass,0.7);c.lineWidth=4;c.beginPath();c.arc(cx,cy,cr+8,0,TAU);c.stroke();
  const v=c.createRadialGradient(W/2,H/2,H*0.35,W/2,H/2,W*0.72);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.rdExchange=rd_paintExchange;
// the board's lamps, lit live: lit [[i, j, a], ...]; a call is a lamp lit amber
function rd_lamps(c,lit,col){for(const [i,j,a] of lit){if(a<=0.004)continue;const [x,y]=rd_lampAt(i,j);glow(c,x,y,30,col||RD.lamp,0.75*a);c.fillStyle=rgba(mix(col||RD.lamp,[255,255,255],0.45),a);c.beginPath();c.arc(x,y,8,0,TAU);c.fill();}}
// the exchange clock's face: ivory, lit by the lamps, its hands at h:m:s (s moves on in whole seconds, as the clock's own hand does)
function rd_clockFace(c,x,y,r,h,m,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  const g=c.createRadialGradient(x-r*0.25,y-r*0.3,0,x,y,r);g.addColorStop(0,rgba(RD.ivory,1));g.addColorStop(1,rgba(mix(RD.ivory,[150,120,90],0.35),1));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
  c.strokeStyle="rgba(40,30,26,0.9)";c.lineCap="round";for(let i=0;i<60;i++){const an=i/60*TAU,l=i%5?r*0.05:r*0.12;c.lineWidth=i%5?1.6:4;c.beginPath();c.moveTo(x+Math.sin(an)*(r*0.92),y-Math.cos(an)*(r*0.92));c.lineTo(x+Math.sin(an)*(r*0.92-l),y-Math.cos(an)*(r*0.92-l));c.stroke();}
  const hand=(an,len,w,col)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x-Math.sin(an)*len*0.16,y+Math.cos(an)*len*0.16);c.lineTo(x+Math.sin(an)*len,y-Math.cos(an)*len);c.stroke();};
  hand(((h%12)+m/60)/12*TAU,r*0.5,r*0.07,"rgba(30,24,22,1)");hand((m+s/60)/60*TAU,r*0.76,r*0.05,"rgba(30,24,22,1)");hand(Math.floor(s)/60*TAU,r*0.84,Math.max(1.6,r*0.018),o.secCol||"rgba(170,40,30,1)");
  c.fillStyle="rgba(30,24,22,1)";c.beginPath();c.arc(x,y,r*0.06,0,TAU);c.fill();
  const sh=c.createRadialGradient(x,y,r*0.7,x,y,r);sh.addColorStop(0,"rgba(0,0,0,0)");sh.addColorStop(1,"rgba(60,40,20,0.35)");c.fillStyle=sh;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();}

/* ---------------------------------------------------------------- the speaking clock
   rd_disc: one glass disc, seen face on, its rings of recorded words lit from behind; u how far it has turned, lit 0 to 1 while read.
   rd_machine: the machine as the Post Office built it, drawn for the film: a tall dark cabinet, a clock dial in its top panel, and
   behind its glass four discs on one shaft, each read by its own beam of light, warm valves glowing below. o.turn (seconds of turning),
   o.read (0 to 1, the beams), o.time [h, m, s] for its dial, o.lit, o.a. */
function rd_disc(c,x,y,r,u,lit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  const g=c.createRadialGradient(x-r*0.3,y-r*0.3,0,x,y,r);g.addColorStop(0,"rgba(190,220,255,0.30)");g.addColorStop(1,"rgba(120,160,220,0.10)");c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
  c.strokeStyle="rgba(200,225,255,0.55)";c.lineWidth=2;c.stroke();
  // the rings: the recorded words, as tracks of light; a few brighter where a word is
  for(let k=0;k<7;k++){const rr_=r*(0.32+k*0.09);c.strokeStyle="rgba(170,205,250,"+(0.16+0.06*(k%2))+")";c.lineWidth=2.2;c.beginPath();c.arc(x,y,rr_,0,TAU);c.stroke();
    const s0=u*(0.9+k*0.07)+k*1.7;c.strokeStyle=rgba(RD.lamp,0.25+0.5*lit);c.lineWidth=3;c.beginPath();c.arc(x,y,rr_,s0,s0+0.5+0.2*(k%3));c.stroke();}
  c.fillStyle="rgba(40,46,60,1)";c.beginPath();c.arc(x,y,r*0.14,0,TAU);c.fill();c.strokeStyle=rgba(RD.brass,0.8);c.lineWidth=3;c.stroke();
  if(lit>0)glow(c,x,y,r*1.1,[170,205,250],0.18*lit);c.restore();}
const RD_MACH={x:600,y:120,w:720,h:760};
function rd_machine(c,tt,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const M=RD_MACH,read=o.read||0;c.save();c.globalAlpha*=a;
  // the cabinet
  c.save();c.shadowColor="rgba(0,0,0,0.7)";c.shadowBlur=50;c.fillStyle="rgba(28,30,36,1)";rr(c,M.x,M.y,M.w,M.h,16);c.fill();c.restore();
  let g=c.createLinearGradient(M.x,0,M.x+M.w,0);g.addColorStop(0,"rgba(255,255,255,0.05)");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(0,0,0,0.25)");c.fillStyle=g;rr(c,M.x,M.y,M.w,M.h,16);c.fill();
  c.strokeStyle="rgba(120,130,150,0.5)";c.lineWidth=2;rr(c,M.x,M.y,M.w,M.h,16);c.stroke();
  // its top panel and dial
  const dx=M.x+M.w/2,dy=M.y+120;c.fillStyle="rgba(18,20,26,1)";rr(c,M.x+30,M.y+26,M.w-60,190,10);c.fill();
  const tm=o.time||[10,47,22];rd_clockFace(c,dx,dy,78,tm[0],tm[1],tm[2]);c.strokeStyle=rgba(RD.brass,0.7);c.lineWidth=4;c.beginPath();c.arc(dx,dy,86,0,TAU);c.stroke();
  // the glass window and its four discs on one shaft
  const wy=M.y+250,wh=330;c.fillStyle="rgba(8,12,22,1)";rr(c,M.x+30,wy,M.w-60,wh,10);c.fill();
  c.strokeStyle="rgba(90,100,120,0.9)";c.lineWidth=5;c.beginPath();c.moveTo(M.x+50,wy+wh/2);c.lineTo(M.x+M.w-50,wy+wh/2);c.stroke();
  const turn=o.turn==null?tt:o.turn;for(let i=0;i<4;i++){const x=M.x+120+i*160,y=wy+wh/2;rd_disc(c,x,y,70,turn*(0.6+i*0.25),read);
    // its beam of light, from a lamp above to a cell below
    if(read>0){c.save();c.globalCompositeOperation="lighter";const bg=c.createLinearGradient(0,wy+20,0,wy+wh-20);bg.addColorStop(0,rgba(RD.lamp,0));bg.addColorStop(0.5,rgba(RD.lamp,0.55*read));bg.addColorStop(1,rgba(RD.lamp,0));
      c.fillStyle=bg;c.fillRect(x+36,wy+20,6,wh-40);c.restore();}
    c.fillStyle="rgba(60,62,70,1)";rr(c,x+28,wy+8,22,16,4);c.fill();rr(c,x+28,wy+wh-24,22,16,4);c.fill();}
  c.strokeStyle="rgba(170,200,240,0.18)";c.lineWidth=2;rr(c,M.x+30,wy,M.w-60,wh,10);c.stroke();
  // the valves below, glowing warm
  for(let i=0;i<6;i++){const x=M.x+90+i*108,y=M.y+M.h-110;c.fillStyle="rgba(40,36,34,1)";rr(c,x-20,y+40,40,22,4);c.fill();
    const vg=c.createRadialGradient(x,y,0,x,y,34);vg.addColorStop(0,rgba(RD.lamp,0.55));vg.addColorStop(1,rgba(RD.lamp,0));c.fillStyle=vg;c.beginPath();c.arc(x,y,34,0,TAU);c.fill();
    c.strokeStyle="rgba(220,200,170,0.4)";c.lineWidth=2;c.beginPath();c.moveTo(x-14,y+40);c.lineTo(x-14,y-10);c.arc(x,y-10,14,Math.PI,0);c.lineTo(x+14,y+40);c.stroke();}
  if(o.lit)glow(c,dx,M.y+M.h/2,M.w*0.7,RD.lamp,0.12*o.lit);c.restore();}
// a microphone of the 1930s on its stand: an oval ribbon head in a ring (x, y the head's middle)
function rd_mic(c,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);
  c.fillStyle="rgba(30,30,34,1)";c.fillRect(-5,60,10,400);rr(c,-60,452,120,18,6);c.fill();
  c.strokeStyle=rgba(RD.brass,0.85);c.lineWidth=6;c.beginPath();c.ellipse(0,0,46,62,0,0,TAU);c.stroke();
  ag_soft(c,cc=>cc.ellipse(0,0,36,52,0,0,TAU),[48,48,54],[120,120,130],-8,-14,50,"rgba(0,0,0,0.4)",8);
  c.strokeStyle="rgba(150,150,160,0.35)";c.lineWidth=1.6;for(let k=-40;k<=40;k+=8){c.beginPath();c.moveTo(-30,k);c.lineTo(30,k);c.stroke();}
  c.strokeStyle=rgba(RD.brass,0.85);c.lineWidth=5;c.beginPath();c.moveTo(-46,0);c.lineTo(-56,0);c.lineTo(-56,62);c.lineTo(0,62);c.lineTo(56,62);c.lineTo(56,0);c.lineTo(46,0);c.stroke();c.restore();}
// a pocket watch, its hands at h:m:s (o.out, seconds it is out by, drawn as a red sliver on its dial)
function rd_watch(c,x,y,r,h,m,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  ag_soft(c,cc=>cc.arc(x,y,r+16,0,TAU),RD.brass,[255,236,190],x-r*0.4,y-r*0.4,r*1.4,"rgba(0,0,0,0.45)",10);ag_soft(c,cc=>ag_rect(cc,x-14,y-r-44,28,30,8),RD.brass,[255,236,190],x,y-r-40,20,null);
  c.strokeStyle=rgba(RD.brass,1);c.lineWidth=6;c.beginPath();c.arc(x,y-r-58,16,0,TAU);c.stroke();
  rd_clockFace(c,x,y,r,h,m,s,{secCol:"rgba(40,30,26,1)"});
  if(o.out){c.fillStyle=rgba(MD.fail,0.45*o.out);c.beginPath();c.moveTo(x,y);c.arc(x,y,r*0.88,(Math.floor(s)/60)*TAU-Math.PI/2,((Math.floor(s)+4)/60)*TAU-Math.PI/2);c.closePath();c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- the dial
   The Post Office's dial of the time: ten finger holes, each over its number and its letters (2 ABC, 3 DEF, 4 GHI, 5 JKL, 6 MN,
   7 PRS, 8 TUV, 9 WXY, 0 O), 1 at two o'clock and on round to 0 at five, the finger stop at four, as a real dial has them.
   o.lit {8: a, 4: a, 6: a} lights a hole and its letters. Numbers and letters are 28 px or more, so they read. */
const RD_DIAL=[["1",""],["2","ABC"],["3","DEF"],["4","GHI"],["5","JKL"],["6","MN"],["7","PRS"],["8","TUV"],["9","WXY"],["0","O"]];
function rd_holeAt(i,x,y,R){const an=(30+i*30)*Math.PI/180;return[x+Math.cos(an)*R*0.72,y-Math.sin(an)*R*0.72];}
function rd_dial(c,x,y,R,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const lit=o.lit||{};c.save();c.globalAlpha*=a;
  // the body of the telephone under the dial: black, with the map's rim of light
  c.save();c.shadowColor="rgba(0,0,0,0.8)";c.shadowBlur=60;c.fillStyle="rgba(16,16,20,1)";c.beginPath();c.arc(x,y,R*1.18,0,TAU);c.fill();c.restore();
  c.strokeStyle=rgba(MD.flow,0.35);c.lineWidth=3;c.beginPath();c.arc(x,y,R*1.18,0,TAU);c.stroke();
  // the ring of numbers and letters under the finger plate
  c.fillStyle="rgba(236,230,214,1)";c.beginPath();c.arc(x,y,R,0,TAU);c.arc(x,y,R*0.44,0,TAU,true);c.fill();
  for(let i=0;i<10;i++){const [hx,hy]=rd_holeAt(i,x,y,R),[n,l]=RD_DIAL[i],L=lit[n]||0;
    if(L>0){c.save();c.globalAlpha*=L;c.fillStyle=rgba(RD.lamp,0.9);c.beginPath();c.arc(hx,hy,R*0.17,0,TAU);c.fill();c.restore();}
    md_T(c,n,hx,hy+(l?-2:10),{w:800,size:34,align:"center",col:[30,26,24]});if(l)md_T(c,l,hx,hy+30,{w:800,size:28,align:"center",col:[30,26,24]});}
  // the finger plate: chrome, with its ten holes
  c.save();c.beginPath();c.arc(x,y,R*0.98,0,TAU);for(let i=0;i<10;i++){const [hx,hy]=rd_holeAt(i,x,y,R);c.moveTo(hx+R*0.15,hy);c.arc(hx,hy,R*0.15,0,TAU,true);}
  c.moveTo(x+R*0.4,y);c.arc(x,y,R*0.4,0,TAU,true);const pg=c.createLinearGradient(x-R,y-R,x+R,y+R);pg.addColorStop(0,"rgba(220,226,236,0.95)");pg.addColorStop(0.5,"rgba(150,158,172,0.95)");pg.addColorStop(1,"rgba(90,96,110,0.95)");
  c.fillStyle=pg;c.fill("evenodd");c.restore();
  // the label in the middle, and the finger stop
  c.fillStyle="rgba(236,230,214,1)";c.beginPath();c.arc(x,y,R*0.36,0,TAU);c.fill();c.strokeStyle="rgba(40,36,34,0.5)";c.lineWidth=2;c.stroke();
  const fs=-30*Math.PI/180;c.strokeStyle="rgba(200,206,216,1)";c.lineWidth=10;c.lineCap="round";c.beginPath();c.moveTo(x+Math.cos(fs)*R*0.86,y-Math.sin(fs)*R*0.86);c.lineTo(x+Math.cos(fs)*R*1.08,y-Math.sin(fs)*R*1.08);c.stroke();
  c.restore();}

/* ===== Reports on demand: today's places, and the tools' pages =====
   Drawn with the module's kit (films/data-that-moves/shared/), with the film's own prefix, rd_. Finance's office and a tutorial room,
   painted once in the map's cool light; Genie One, with Rohan's question in his own words, its answer, what it counted and the query
   it ran; a report request and the week it took; the fortnightly pay report, its 40 pages and the three figures on its first; the
   Genie Agent the data team set up, its data, its owners' rules, its examples and its tests; the dashboard of the fortnightly figures,
   with its Ask Genie button; and a statement over a veil. The tools' pages are drawn at the level of architecture, never a tour of
   clicks. Every word is 28 px or more as seen, drawn live with md_T. */

/* ---------------------------------------------------------------- today's places, painted once */
// Finance's office: the map's night, a tall window at the left with the morning in it, a shelf of files in the dark at the right, and
// the long glass desk along the foot of the frame. Whoever sits at it is cut at its back edge (o.cut: RD_OFF.desk)
const RD_OFF={desk:852};
function rd_paintOffice(c){md_paintNight(c,{grid:false});
  const wx=90,wy=96,ww=480,wh=640;let q=c.createRadialGradient(wx+ww/2,wy+wh*0.4,0,wx+ww/2,wy+wh*0.4,ww*1.3);q.addColorStop(0,rgba(MD.flow,0.09));q.addColorStop(1,rgba(MD.flow,0));c.fillStyle=q;c.fillRect(0,0,W,H);
  for(let i=0;i<3;i++){const x=wx+i*(ww/3)+8,g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgba(150,190,240,0.15)");g.addColorStop(1,"rgba(150,190,240,0.03)");c.fillStyle=g;rr(c,x,wy,ww/3-16,wh,6);c.fill();}
  c.strokeStyle="rgba(170,200,245,0.16)";c.lineWidth=2;rr(c,wx,wy,ww,wh,8);c.stroke();
  for(let r=0;r<3;r++){const y=190+r*180;c.fillStyle="rgba(170,200,245,0.07)";c.fillRect(1370,y+124,480,5);
    for(let k=0;k<12;k++){const x=1392+k*37+((k*7)%5),dh=((k*5)%3)*9;c.fillStyle="rgba(120,140,170,"+(0.05+((k*13)%7)*0.008)+")";rr(c,x,y+22+dh,26,100-dh,3);c.fill();}}
  const d=RD_OFF.desk,g=c.createLinearGradient(0,d,0,H);g.addColorStop(0,"rgba(28,42,72,0.97)");g.addColorStop(1,"rgba(7,11,22,1)");c.fillStyle=g;c.fillRect(0,d,W,H-d);
  c.fillStyle=rgba(MD.flow,0.32);c.fillRect(0,d,W,2);const e=c.createLinearGradient(0,d,0,d+44);e.addColorStop(0,"rgba(170,210,255,0.13)");e.addColorStop(1,"rgba(170,210,255,0)");c.fillStyle=e;c.fillRect(0,d,W,44);}
AG_PLACES.rdOffice=rd_paintOffice;
// a tutorial room: a glass board on the wall with a lesson's diagram on it (boxes and lines, no words), and the room's soft light
function rd_paintTute(c){md_paintNight(c,{grid:false});
  const bx=820,by=120,bw=960,bh=560;let q=c.createRadialGradient(bx+bw/2,by+bh/2,0,bx+bw/2,by+bh/2,bw*0.8);q.addColorStop(0,rgba(MD.flow,0.07));q.addColorStop(1,rgba(MD.flow,0));c.fillStyle=q;c.fillRect(0,0,W,H);
  c.fillStyle="rgba(150,180,230,0.06)";rr(c,bx,by,bw,bh,14);c.fill();c.strokeStyle="rgba(170,200,245,0.2)";c.lineWidth=2;rr(c,bx,by,bw,bh,14);c.stroke();
  c.strokeStyle="rgba(190,215,250,0.16)";c.lineWidth=3;c.lineCap="round";
  for(const [x,y,w,h] of [[900,200,220,110],[900,420,220,110],[1260,310,240,120],[1580,200,140,90],[1580,450,140,90]]){rr(c,x,y,w,h,12);c.stroke();}
  for(const [a,b] of [[[1120,255],[1260,350]],[[1120,475],[1260,390]],[[1500,350],[1580,245]],[[1500,390],[1580,495]]]){c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  c.fillStyle="rgba(170,200,245,0.08)";c.fillRect(bx+20,by+bh+14,bw-40,8);}
AG_PLACES.rdTute=rd_paintTute;

/* ---------------------------------------------------------------- small things */
// a phase that comes in at t0 over d and leaves at t1 over d2
const rd_io=(t,t0,t1,d,d2)=>ag_in(t,t0,d||0.5)*(1-ag_in(t,t1,d2||0.4));
// a spring for a card from t0
const rd_k=(t,t0)=>Math.min(1,ag_spr(t,t0,0.55));
// typed words: the first u of s
const rd_typed=(s,u)=>s.slice(0,Math.round(clamp(u,0,1)*s.length));
// draw in the frame, whatever the camera is doing
function rd_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a statement on its own, in the frame over a veil: its lines centred, each in its colour (o.cols), o.n how many show (fractional
// while the next comes in), o.k its spring
function rd_statement(ctx,S,a,lines,o){o=o||{};if(a<=0.004)return;md_veil(ctx,S,0.72*a);setScreen(ctx,S);const f={w:700,size:42},n=o.n==null?lines.length:o.n;
  const w=Math.max(...lines.map(l=>md_tw(ctx,l,f)))+128,h=72+lines.length*62,x=960-w/2,y=o.y||(470-h/2);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,960,y+h/2,lerp(0.85,1,Math.min(1,ag_spr(o.k,0,0.5))));md_card(ctx,x,y,w,h,{edge:o.edge,r:26});
  lines.forEach((l,i)=>{const la=clamp(n-i,0,1);if(la<=0.004)return;md_T(ctx,l,960,y+36+46+i*62,Object.assign({align:"center",col:(o.cols&&o.cols[i])||MD.ink,a:ag_sine(la)},f));});ctx.restore();}

/* ---------------------------------------------------------------- Genie One: the question, the answer, what it counted, the query
   rd_genie(c, x, y, w, h, o): the window, its bar naming Genie One beside the platform's logo; in it Rohan's question, typed in his own
   words (o.q, 0 to 1), the answer (o.ans), what it counted (o.cnt), on-costs (o.on), the query it ran (o.code); then the conversation
   closes (o.code back to 0) before his next question (o.q2) and its answer (o.ans2) come in under the first. Its bubbles keep their
   size while their words are typed, so nothing below them moves. */
const RD_Q1="What has casual teaching cost Health this semester, so far?",RD_Q2="And Semester 1?";
const RD_SQL=["SELECT faculty_name, MEASURE(casual_teaching_cost)","FROM university.prod_marts.casual_teaching_cost","WHERE faculty_name = 'Faculty of Health'","  AND teaching_period = '2026-S2'","GROUP BY faculty_name"];
// a question in a bubble at the right of the body, its right edge at x; u how much is typed. Returns its height
function rd_bubble(c,x,y,maxW,s,u,a){const f={w:600,size:32},ls=md_wrap(c,s,maxW-56,f),bw=Math.max(...ls.map(l=>md_tw(c,l,f)))+56,bh=ls.length*44+36;if(a<=0.004)return bh;
  c.save();c.globalAlpha*=a;c.fillStyle="rgba(120,200,255,0.13)";rr(c,x-bw,y,bw,bh,24);c.fill();c.strokeStyle=rgba(MD.flow,0.55);c.lineWidth=1.6;rr(c,x-bw,y,bw,bh,24);c.stroke();
  let left=Math.round(clamp(u,0,1)*s.length);ls.forEach((l,i)=>{if(left<=0)return;md_T(c,l.slice(0,left),x-bw+28,y+50+i*44,f);left-=l.length+1;});c.restore();return bh;}
// an answer: its figure in gold, the measure's colour, a line under it, and a gold bar at its left; k its spring. Returns its height
function rd_answer(c,x,y,fig,sub,a,k){if(a<=0.004)return 118;c.save();c.globalAlpha*=a;if(k!=null)ag_about(c,x,y+50,lerp(0.8,1,k));
  c.fillStyle=rgba(MD.agreed,0.9);rr(c,x,y+4,6,104,3);c.fill();md_T(c,fig,x+32,y+62,{w:800,size:60,col:MD.agreed});md_T(c,sub,x+32,y+104,{w:500,size:28,col:MD.soft});c.restore();return 118;}
function rd_genie(c,x,y,w,h,o){o=o||{};return md_window(c,x,y,w,h,{logo:"databricks",product:"Genie One",title:"Ask a question",a:o.a,k:o.k,draw:(cc,b)=>{
  const R=b.x+b.w-24,L=b.x+28;let yy=b.y+28;
  const h1=rd_bubble(cc,R,yy,b.w-48,RD_Q1,o.q||0,ag_in(o.q||0,0,0.06));yy+=h1+34;
  rd_answer(cc,L,yy,"A$1.84 million","so far · Semester 2 2026",ag_in(o.ans||0,0,0.5),o.ans==null?null:rd_k(o.ans,0));yy+=152;
  const cn=ag_in(o.cnt||0,0,0.5);if(cn>0){cc.save();cc.globalAlpha*=cn;md_T(cc,"Counted:",L+32,yy,{w:700,size:28});md_T(cc,"claims approved for casual teaching, plus on-costs",L+32+md_tw(cc,"Counted:",{w:700,size:28})+12,yy,{w:500,size:28,col:MD.soft});cc.restore();}
  yy+=38;md_tag(cc,L+32,yy+20,"on-costs: paid on top of pay",{col:MD.agreed,a:ag_in(o.on||0,0,0.5)});yy+=70;const y2=yy+12;
  // the query it ran, under Show code
  const cd=ag_in(o.code||0,0,0.5);if(cd>0){cc.save();cc.globalAlpha*=cd;md_T(cc,"Show code",L+32,yy+10,{w:700,size:28,col:MD.flow});
    const ph=RD_SQL.length*40+36,py=yy+30;cc.fillStyle="rgba(3,7,16,0.85)";rr(cc,L+20,py,b.w-76,ph,14);cc.fill();cc.strokeStyle="rgba(170,200,245,0.22)";cc.lineWidth=1.2;rr(cc,L+20,py,b.w-76,ph,14);cc.stroke();
    RD_SQL.forEach((l,i)=>{const la=clamp((o.code||0)*RD_SQL.length*1.2-i,0,1);if(la>0)md_T(cc,l,L+44,py+46+i*40,{w:500,size:28,f:"mono",col:i===3||i===4?MD.ink:MD.soft,a:la});});cc.restore();}
  // the next question, and its answer
  yy=y2;
  if((o.q2||0)>0){const h2=rd_bubble(cc,R,yy,b.w*0.6,RD_Q2,o.q2,ag_in(o.q2,0,0.06));yy+=h2+34;
    rd_answer(cc,L,yy,"A$2.21 million","Semester 1 2026 · every claim in",ag_in(o.ans2||0,0,0.5),o.ans2==null?null:rd_k(o.ans2,0));}}});}

/* ---------------------------------------------------------------- a report, and the week it took
   rd_week(c, x, y, u, o): a report request, to the data team, and five working days filling with amber, a wait (u 0 to 1).
   rd_report(c, x, y, s, o): the fortnightly pay report, a stack of 40 pages; on its first page its title and its three figures, lit
   in gold as people read them (o.hl), the other lines dim; o.ret (0 to 1) retires it: the stack greys, and a stamp says retired. */
function rd_week(c,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=620,h=232;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.7,1,o.k));
  md_card(c,x,y,w,h,{edge:MD.wait,glow:0.5});md_icon(c,"doc",x+56,y+60,40,MD.wait);md_T(c,o.title||"A report request",x+96,y+56,{w:700,size:32});md_T(c,o.sub||"to the data team",x+96,y+94,{w:500,size:28,col:MD.soft});
  const days=["Thu","Fri","Mon","Tue","Wed"],bw=96,gap=14,x0=x+32;days.forEach((d,i)=>{const bx=x0+i*(bw+gap),by=y+130,f=clamp(u*5-i,0,1);
    c.fillStyle="rgba(255,255,255,0.04)";rr(c,bx,by,bw,56,10);c.fill();c.strokeStyle=rgba(MD.wait,0.35);c.lineWidth=1.4;rr(c,bx,by,bw,56,10);c.stroke();
    if(f>0){c.save();c.beginPath();rr(c,bx,by,bw*f,56,10);c.clip();c.fillStyle=rgba(MD.wait,0.9);rr(c,bx,by,bw,56,10);c.fill();c.restore();}
    md_T(c,d,bx+bw/2,by+38,{w:700,size:28,align:"center",col:f>0.6?MD.navy:MD.soft});});
  md_T(c,"a week",x+w-32,y+56,{w:700,size:28,align:"right",col:MD.wait,a:ag_in(u,0.7,0.3)});c.restore();}
// the one number he needs, as a card: its question, and under it (o.wk, 0 to 1) the week a report used to take, five working days
// filling with amber, a wait
function rd_need(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||760,q=o.q||RD_Q1,ql=md_wrap(c,q,w-56,{w:700,size:36}),top=62+ql.length*46+58,wk=o.wk||0,h=top+(wk>0?150*ag_sine(ag_in(wk,0,0.3)):0);c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+106,lerp(0.7,1,Math.min(1,ag_spr(o.k,0,0.5))));
  const ec=o.edge===undefined?MD.agreed:o.edge;md_card(c,x,y,w,h,{edge:ec,glow:0.5});md_label(c,x+28,y+52,o.kick||"First, one number",{col:ec||MD.soft});
  ql.forEach((l,i)=>md_T(c,l,x+28,y+108+i*46,{w:700,size:36}));
  if(wk>0){const wa=ag_in(wk,0.15,0.3),yy=y+top;c.save();c.globalAlpha*=wa;c.strokeStyle="rgba(170,200,245,0.18)";c.lineWidth=1.2;c.beginPath();c.moveTo(x+24,yy);c.lineTo(x+w-24,yy);c.stroke();
    md_T(c,o.before||"Before: a report from the data team",x+28,yy+46,{w:600,size:28,col:MD.soft});md_T(c,"a week",x+w-28,yy+46,{w:700,size:28,align:"right",col:MD.wait,a:ag_in(wk,0.8,0.2)});
    ["Thu","Fri","Mon","Tue","Wed"].forEach((d,i)=>{const bw=128,bx=x+28+i*(bw+12),by=yy+70,f=clamp((wk-0.2)*1.25*5-i,0,1);
      c.fillStyle="rgba(255,255,255,0.04)";rr(c,bx,by,bw,52,10);c.fill();c.strokeStyle=rgba(MD.wait,0.35);c.lineWidth=1.4;rr(c,bx,by,bw,52,10);c.stroke();
      if(f>0){c.save();c.beginPath();c.rect(bx,by,bw*f,52);c.clip();c.fillStyle=rgba(MD.wait,0.9);rr(c,bx,by,bw,52,10);c.fill();c.restore();}
      md_T(c,d,bx+bw/2,by+36,{w:700,size:28,align:"center",col:f>0.6?MD.navy:MD.soft});});c.restore();}
  c.restore();}
function rd_report(c,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const pw=500*s,ph=660*s,ret=o.ret||0,fan=o.fan==null?1:o.fan;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+pw/2,y+ph/2,lerp(0.7,1,o.k));
  // the pages under it, fanned a little: forty of them, as a thick stack's edges
  for(let i=7;i>=1;i--){const dx=i*9*fan,dy=i*7*fan;c.fillStyle="rgba("+(205-i*6)+","+(214-i*6)+","+(230-i*6)+","+(0.9-ret*0.4)+")";rr(c,x+dx,y+dy,pw,ph,10);c.fill();c.strokeStyle="rgba(40,50,70,0.5)";c.lineWidth=1;rr(c,x+dx,y+dy,pw,ph,10);c.stroke();}
  c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=24;c.fillStyle=ret>0?rgba(mix([236,240,248],[150,156,170],ret),1):"rgba(236,240,248,1)";rr(c,x,y,pw,ph,10);c.fill();c.restore();
  const ink=[24,30,44],m=40*s;md_T(c,"The fortnightly pay report",x+m,y+m+30,{w:800,size:Math.max(28,32*s),col:ink});md_T(c,"page 1 of 40",x+m,y+m+72,{w:500,size:28,col:[90,98,116]});
  // its three figures, and the other lines, dim (decoration: thin bars, not words)
  const F=["Pay run total","Casual hours, by faculty","Claims waiting"],hl=o.hl||0;F.forEach((f,i)=>{const fy=y+m+130+i*96*s;
    if(hl>0){c.fillStyle=rgba(MD.agreed,0.35*clamp(hl*3-i,0,1));rr(c,x+m-12,fy-6,pw-2*m+24,74,10);c.fill();}
    md_T(c,f,x+m,fy+28,{w:700,size:28,col:ink});c.fillStyle="rgba(24,30,44,0.35)";rr(c,x+m,fy+44,pw*0.42,10,5);c.fill();});
  c.fillStyle="rgba(24,30,44,"+(0.14-0.06*hl)+")";for(let i=0;i<7;i++){const ly=y+m+430*s+i*30*s;if(ly>y+ph-m)break;rr(c,x+m,ly,(pw-2*m)*(0.6+((i*37)%40)/100),10,5);c.fill();}
  if(ret>0){const sc=[64,74,96];c.save();c.globalAlpha*=ag_in(ret,0.2,0.6);c.translate(x+pw/2,y+ph*0.8);c.rotate(-0.12);const sw=330*Math.max(0.8,s),sh=88;c.strokeStyle=rgba(sc,1);c.lineWidth=5;rr(c,-sw/2,-sh/2,sw,sh,12);c.stroke();
    md_T(c,"RETIRED",0,16,{w:800,size:44,ls:8,align:"center",col:sc});c.restore();}
  c.restore();}

/* ---------------------------------------------------------------- the Genie Agent the data team set up
   rd_agent(c, x, y, w, h, o): the window, its bar naming the Genie Agent and its subject; four tabs, Data, Rules, Examples and Tests,
   and one tab's page at a time: o.tab (0 to 3) the tab, lit over o.tabA as o.prev's light goes, o.pg (0 to 1) its page comes in, o.out
   (0 to 1) it leaves, so two pages
   never show at once. What each page shows comes in by o.p: data {m, f, def}, rules {r, i, reads}, examples {n}, tests {n, run}. */
const RD_TABS=["Data","Rules","Examples","Tests"];
function rd_agent(c,x,y,w,h,o){o=o||{};const p=o.p||{};return md_window(c,x,y,w,h,{logo:"databricks",product:"Genie Agent",title:"Casual teaching cost",a:o.a,k:o.k,draw:(cc,b)=>{
  // the tabs: the one open lit
  let tx=b.x+16;RD_TABS.forEach((s,i)=>{const ta=o.tabA==null?1:o.tabA,on=i===o.tab?ta:i===o.prev?1-ta:0,tw=md_tw(cc,s,{w:700,size:28})+44;
    if(on>0){cc.fillStyle=rgba(MD.flow,0.14*on);rr(cc,tx,b.y+6,tw,52,12);cc.fill();cc.fillStyle=rgba(MD.flow,on);cc.fillRect(tx+12,b.y+56,tw-24,3);}
    md_T(cc,s,tx+22,b.y+42,{w:700,size:28,col:on>0.5?MD.ink:MD.soft});tx+=tw+12;});
  cc.strokeStyle="rgba(170,200,245,0.16)";cc.lineWidth=1.2;cc.beginPath();cc.moveTo(b.x,b.y+62);cc.lineTo(b.x+b.w,b.y+62);cc.stroke();
  const pa=ag_sine(o.pg==null?1:o.pg)*(1-ag_sine(o.out||0));if(pa<=0.004)return;cc.save();cc.globalAlpha*=pa;const X=b.x+16,Y=b.y+100,BW=b.w-32;
  if(o.tab===0)rd_pageData(cc,X,Y,BW,p.data||{});else if(o.tab===1)rd_pageRules(cc,X,Y,BW,p.rules||{});else if(o.tab===2)rd_pageExamples(cc,X,Y,BW,p.examples||{});else if(o.tab===3)rd_pageTests(cc,X,Y,BW,p.tests||{});
  cc.restore();}});}
// its data: one metric view, its measure and its fields; then who defined it, and when
function rd_pageData(c,x,y,w,p){const m=ag_in(p.m||0,0,0.5);if(m<=0.004)return;c.save();c.globalAlpha*=m;
  md_card(c,x,y,w,150,{edge:MD.agreed,glow:0.5});md_icon(c,"contract",x+52,y+52,40,MD.agreed);md_T(c,"casual_teaching_cost",x+96,y+62,{w:600,size:32,f:"mono"});
  md_T(c,"metric view · university.prod_marts",x+96,y+108,{w:500,size:28,col:MD.soft});
  md_label(c,x,y+218,"Its one measure, by",{});const fs=["faculty_name","unit_code","teaching_period"];let fx=x;fs.forEach((s,i)=>{const fa=clamp((p.f||0)*3-i,0,1);const r=md_tag(c,fx,y+280,s,{col:MD.flow,a:fa});fx+=r.w+16;});
  const d=ag_in(p.def||0,0,0.5);if(d>0){md_tag(c,x,y+380,"defined once · September 2026 · Rohan Desai",{col:MD.agreed,icon:"contract",a:d});md_T(c,"how: the next film, Defined in the open",x+4,y+460,{w:500,size:28,col:MD.soft,a:ag_in(p.def,0.4,0.5)});}
  c.restore();}
// its rules, in their owners' words: Rohan's, in gold; Ingrid's, personal data, in lilac with a lock; then the claims it never reads
function rd_pageRules(c,x,y,w,p){const cw=(w-24)/2;
  const r=ag_in(p.r||0,0,0.5);if(r>0){c.save();c.globalAlpha*=r;md_card(c,x,y,cw,300,{edge:MD.agreed,glow:0.5});md_label(c,x+28,y+52,"Rohan Desai · Finance",{col:MD.agreed});
    ["Cost: claims approved for","casual teaching, plus on-costs.","This semester: the teaching","period now running."].forEach((l,i)=>md_T(c,l,x+28,y+108+i*42,{w:500,size:28}));c.restore();}
  const i_=ag_in(p.i||0,0,0.5);if(i_>0){const ix=x+cw+24;c.save();c.globalAlpha*=i_;md_card(c,ix,y,cw,300,{edge:MD.personal,glow:0.5});md_label(c,ix+28,y+52,"Ingrid Holm · HR",{col:MD.personal});
    md_icon(c,"lock",ix+cw-44,y+44,34,MD.personal);["Totals only, never","one person's pay."].forEach((l,k)=>md_T(c,l,ix+28,y+108+k*42,{w:500,size:28}));c.restore();}
  const rd=ag_in(p.reads||0,0,0.5);if(rd>0){c.save();c.globalAlpha*=rd;const gy=y+340;md_card(c,x,gy,w,110,{dash:true,edge:MD.personal});md_icon(c,"table",x+52,gy+55,38,MD.personal);
    md_T(c,"casual claims · one row per claim",x+96,gy+64,{w:600,size:28,col:MD.soft});const nw=md_tw(c,"not in its data",{w:700,size:28})+88;md_tag(c,x+w-24-nw,gy+55,"not in its data",{col:MD.personal,icon:"lock"});c.restore();}}
// its examples: questions Finance asks, each with the query that answers it
const RD_EX=[["Casual teaching cost for Health, this semester?",["SELECT MEASURE(casual_teaching_cost)","WHERE faculty_name = 'Faculty of Health' …"]],
  ["Each faculty's casual teaching cost, Semester 1?",["SELECT faculty_name, MEASURE(…)","WHERE teaching_period = '2026-S1' …"]]];
function rd_pageExamples(c,x,y,w,p){RD_EX.forEach(([q,sql],i)=>{const a=clamp((p.n||0)-i,0,1);if(a<=0.004)return;const ey=y+i*226;c.save();c.globalAlpha*=ag_sine(a);
  md_card(c,x,ey,w,204,{});md_icon(c,"query",x+46,ey+48,34,MD.flow);md_T(c,q,x+84,ey+58,{w:700,size:30});
  sql.forEach((l,k)=>md_T(c,l,x+84,ey+112+k*40,{w:500,size:28,f:"mono",col:MD.soft}));c.restore();});}
// its tests: questions with known answers, run after every change, each one Good
const RD_TESTS=[["Health, Semester 1 2026","A$2.21 million"],["Each faculty, Semester 1 2026","four totals, as known"]];
function rd_pageTests(c,x,y,w,p){md_label(c,x,y+28,"Question",{});md_label(c,x+w*0.5,y+28,"Known answer",{});
  RD_TESTS.forEach(([q,k],i)=>{const a=clamp((p.n||0)-i,0,1);if(a<=0.004)return;const ty=y+60+i*96;c.save();c.globalAlpha*=ag_sine(a);
    md_card(c,x,ty,w,80,{});md_T(c,q,x+24,ty+50,{w:600,size:28});md_T(c,k,x+w*0.5,ty+50,{w:600,size:28,col:MD.agreed});
    const g=clamp((p.run||0)*2-i,0,1);if(g>0)md_pill(c,x+w-80,ty+40,"Good",{col:MD.pass,size:28,a:ag_sine(g),k:g});c.restore();});
  const r=ag_in(p.run||0,0,0.4);if(r>0){md_icon(c,"refresh",x+24,y+300,34,MD.pass,{a:r});md_T(c,"run after every change",x+60,y+310,{w:600,size:28,col:MD.pass,a:r});}}

/* ---------------------------------------------------------------- the dashboard of the fortnightly figures
   rd_dash(c, x, y, w, h, o): an AI/BI dashboard; three tiles, one for each question asked every pay day, each titled with its
   question (o.tiles 0 to 3 come in), their figures (o.fig 0 to 3), the Refreshed chip (o.ref), and the Ask Genie button (o.ask, lit
   with o.askLit); the window round them, its bar naming it, comes in on its own (o.frame), once the questions are there. Its figures
   are totals only. */
const RD_FAC=[["Arts",1950],["Business",3120],["Engineering",2380],["Health",2640]];
function rd_dash(c,x,y,w,h,o){o=o||{};const A=o.a==null?1:o.a,b={x:x+20,y:y+84,w:w-40,h:h-104};if(A<=0.004)return b;
  md_window(c,x,y,w,h,{logo:"databricks",product:"AI/BI dashboard",title:"The fortnightly figures",a:A*(o.frame==null?1:o.frame)});
  const cc=c;cc.save();cc.globalAlpha*=A;{
  const tl=o.tiles||0,fig=o.fig||0,gap=20,tw=(b.w-gap*2)/3,th=b.h-110,ty=b.y+90;
  // the chips along the top: refreshed after each pay run; and Ask Genie
  const rf=ag_in(o.ref||0,0,0.5);if(rf>0)md_tag(cc,b.x,b.y+34,"Refreshed after each pay run",{col:MD.flow,icon:"refresh",a:rf});
  const ak=ag_in(o.ask||0,0,0.5);if(ak>0){const bw2=md_tw(cc,"Ask Genie",{w:700,size:28})+96,bx=b.x+b.w-bw2,by=b.y+6,lit=o.askLit||0;cc.save();cc.globalAlpha*=ak;
    if(lit>0)glow(cc,bx+bw2/2,by+28,160,MD.flow,0.35*lit);cc.fillStyle=rgba(mix([20,34,60],MD.flow,0.25+0.5*lit),1);rr(cc,bx,by,bw2,56,28);cc.fill();cc.strokeStyle=rgba(MD.flow,0.9);cc.lineWidth=2;rr(cc,bx,by,bw2,56,28);cc.stroke();
    md_icon(cc,"query",bx+38,by+28,30,lit>0.5?MD.ink:MD.flow);md_T(cc,"Ask Genie",bx+66,by+38,{w:700,size:28});cc.restore();}
  const Q=["What did the pay run cost?","Casual hours, in each faculty?","Claims still waiting?"];
  Q.forEach((q,i)=>{const a=clamp(tl-i,0,1);if(a<=0.004)return;const tx=b.x+i*(tw+gap);cc.save();cc.globalAlpha*=ag_sine(a);ag_about(cc,tx+tw/2,ty+th/2,lerp(0.85,1,ag_sine(a)));
    md_card(cc,tx,ty,tw,th,{r:16});const ql=md_wrap(cc,q,tw-48,{w:700,size:30});ql.forEach((l,k)=>md_T(cc,l,tx+24,ty+48+k*40,{w:700,size:30}));
    const fa=clamp(fig-i,0,1),fy=ty+48+ql.length*40+30;if(fa>0){cc.save();cc.globalAlpha*=ag_sine(fa);
      if(i===0){md_T(cc,"A$9.6 million",tx+24,fy+64,{w:800,size:56,col:MD.agreed});md_T(cc,"paid to 2,960 people",tx+24,fy+108,{w:500,size:28,col:MD.soft});md_T(cc,"pay day · 5 November",tx+24,fy+146,{w:500,size:28,col:MD.soft});}
      else if(i===1){const mx=3120,bwm=tw-48-150;RD_FAC.forEach(([f,n],k)=>{const yy=fy+20+k*58,u=clamp(fa*1.5-k*0.15,0,1);md_T(cc,f,tx+24,yy+20,{w:600,size:28});
          cc.fillStyle=rgba(MD.agreed,0.85);rr(cc,tx+24,yy+30,bwm*n/mx*ag_sine(u),12,6);cc.fill();md_T(cc,n.toLocaleString("en-AU"),tx+tw-24,yy+20,{w:600,size:28,align:"right",col:MD.soft});});
        md_T(cc,"10,090 hours in all",tx+24,fy+20+4*58+30,{w:600,size:28,col:MD.soft});}
      else{md_T(cc,"143",tx+24,fy+64,{w:800,size:56,col:MD.wait});md_T(cc,"claims waiting for approval",tx+24,fy+108,{w:500,size:28,col:MD.soft});md_T(cc,"for the pay run of 19 November",tx+24,fy+146,{w:500,size:28,col:MD.soft});}
      cc.restore();}
    cc.restore();});}
  cc.restore();return b;}
// who it goes to: a row of three tags, each with a person
function rd_subs(c,x,y,a){if(a<=0.004)return;let xx=x;md_T(c,"Sent to",xx,y+10,{w:700,size:28,col:MD.soft,a});xx+=md_tw(c,"Sent to",{w:700,size:28})+20;
  ["payroll","Finance","the four faculties"].forEach((s,i)=>{const r=md_tag(c,xx,y,s,{col:MD.ink,icon:"person",a:a*ag_in(a,i*0.15,0.4)});xx+=r.w+14;});}

/* ===== Reports on demand: the scenes =====
   Five chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (rd_places.js, rd_tools.js and the module's map and night); what moves is drawn live in the shots of ag_shots. 1936's rooms share
   the night (the watch, the machine, Jane Cain's studio, the dial), each named a room of its own, so a shot of one dissolves into the
   next only where the whole picture changes; in one room the camera glides and only what changes fades, and a later moment there
   (later: true) lets what was there leave first. Cards, tags and the tools' pages are drawn in the frame (rd_scr), so their words keep
   their size whatever the camera does. */

/* ---------------------------------------------------------------- 1936: what every shot of it draws */
// the time on the exchange's clock and the machine's dial: 10:47 in the morning, and on, second by second
const rd_hms=tt=>{const s=10*3600+47*60+22+tt;return[Math.floor(s/3600),Math.floor(s/60)%60,s%60];};
// the calls: lamps lit amber across the board, each for a while (n of them, from t0 over span, each lit about dur seconds)
function rd_calls(seed,n,t0,span,dur){const out=[];for(let k=0;k<n;k++){const on=t0+hash(seed+k,1)*span;out.push([Math.floor(hash(seed+k,2)*14),Math.floor(hash(seed+k,3)*6),on,on+dur*(0.7+0.6*hash(seed+k,4))]);}return out;}
const rd_lit=(calls,tt)=>calls.map(([i,j,on,off])=>[i,j,ag_in(tt,on,0.25)*(1-ag_in(tt,off,0.35))]);
// the exchange: its lamps (lit), its clock, and the operator at the board, looking at gz (blended in, never switched)
function rd_exch(c,tt,lit,gz){rd_lamps(c,lit,MD.wait);const [h,m,s]=rd_hms(tt);rd_clockFace(c,RD_BOARD.clock[0],RD_BOARD.clock[1],RD_BOARD.clock[2],h,m,s);
  md_person(c,RD_OP,500,640,0.95,{t:tt,gaze:gz||[6,-2],light:RD_PAST});}
// the warm light of the past, laid live over the night where a 1936 room stands
function rd_pool(c,x,y,r,a){const q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(RD.lamp,a));q.addColorStop(1,rgba(RD.lamp,0));c.fillStyle=q;c.fillRect(0,0,W,H);}
const rd_mix2=(a,b,u)=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];

/* ---------------------------------------------------------------- 1 · The speaking clock */
scene("clock",(ctx,S,t,sc)=>{
  const T={tLondon:wAt(sc,"london","London"),tRang:wAt(sc,"rang","To know"),tAsked:wAt(sc,"rang","asked the operator"),tWall:wAt(sc,"wall","She read"),tClock:wAt(sc,"wall","clock"),
    tExact:wAt(sc,"exact","never quite"),tLate:wAt(sc,"late","And the exchange"),tCaller:wAt(sc,"late","just when"),tOut:wAt(sc,"out","So a clock"),tBeOut:wAt(sc,"out","could be out"),
    tAgain:wAt(sc,"again","And the time"),tAg2:wAt(sc,"again","again and again"),tChange:wAt(sc,"change","Something"),
    tBuilt:wAt(sc,"built","So the Post Office's"),tMachine:wAt(sc,"built","a machine"),tSpeak:wAt(sc,"built","the speaking clock"),
    tCain:wAt(sc,"cain","Jane Cain"),tRec:wAt(sc,"cain","recorded"),tGlass:wAt(sc,"cain","glass discs"),tPlayed:wAt(sc,"played","A clock"),tMoment:wAt(sc,"played","right moment"),
    tGreen:wAt(sc,"greenwich","every hour"),tGw:wAt(sc,"greenwich","Greenwich"),
    tDial:wAt(sc,"dial","From the"),tT:wAt(sc,"dial","T"),tI:wAt(sc,"dial","I"),tM:wAt(sc,"dial","M"),tFor:wAt(sc,"dial","for time"),
    tHeard:wAt(sc,"heard","They heard"),tTenth:wAt(sc,"heard","a tenth"),tHour:wAt(sc,"heard","at any hour"),tCalls:wAt(sc,"calls","In less"),tTwelve:wAt(sc,"calls","twelve million"),
    tDemand:wAt(sc,"demand","The exact"),tOnD:wAt(sc,"demand","on demand"),tOp:wAt(sc,"operator","And that"),tNoOp:wAt(sc,"operator","no longer"),
    tReport:wAt(sc,"report","At the university"),tForty:wAt(sc,"report","forty-page"),tWeek:wAt(sc,"week","Any other"),tWk:wAt(sc,"week","a week"),
    tNow:wAt(sc,"now","Now"),tOwn:wAt(sc,"own","And the questions"),tDash:wAt(sc,"own","a dashboard")};
  const calls1=rd_calls(11,9,T.tRang+0.8,7,4.5).concat(rd_calls(31,14,T.tLate+0.3,4.5,4.5)),calls2=rd_calls(51,30,T.tAgain+0.4,4.2,3.4).concat(rd_calls(71,18,T.tAg2,1.6,3.0));
  ag_shots(ctx,S,t,sc.dur,[
    // London, 1936: the exchange at night, its board, its clock; callers ring and ask the operator, who reads the time from the wall
    {at:0,place:"rdExchange",keys:[[0,960,540,1],[T.tWall-0.3,900,380,1.45],[T.tLate-0.3,960,540,1]],d:1.8,draw:(c,tt)=>{
      const up=ag_in(tt,T.tWall-0.2,0.45)*(1-ag_in(tt,T.tLate-0.2,0.45));rd_exch(c,tt,rd_lit(calls1,tt),rd_mix2([6,-1],[3,-9],up));
      rd_scr(c,S,()=>{md_tag(c,96,96,"London · 1936",{col:RD.lamp,a:rd_io(tt,T.tLondon,T.tWall-0.4)});
        md_tag(c,1290,470,"not exact to the second",{col:MD.fail,icon:"warn",align:"center",a:rd_io(tt,T.tExact+0.3,T.tLate-0.5)});
        const bz=rd_io(tt,T.tCaller,T.tOut-0.4);if(bz>0){const w=md_tw(c,"busy: callers wait",{w:700,size:28})+88;md_tag(c,1824-w,96,"busy: callers wait",{col:MD.wait,icon:"clock",a:bz});}});}},
    // a watch set by that answer, out by a few seconds
    {at:T.tOut-0.25,place:"night",room:"rdWatch",keys:[[0,960,520,1]],draw:(c,tt)=>{rd_pool(c,960,470,700,0.08);const [h,m,s]=rd_hms(tt-4);
      rd_watch(c,960,470,210,h,m,s,{out:ag_in(tt,T.tBeOut,0.6)});
      rd_scr(c,S,()=>md_tag(c,960,810,"set by that answer · out",{col:MD.fail,icon:"warn",align:"center",a:ag_in(tt,T.tBeOut+0.2,0.5)}));}},
    // the time, asked again and again; something had to change
    {at:T.tAgain-0.25,place:"rdExchange",keys:[[0,960,540,1]],push:0.03,draw:(c,tt)=>{rd_exch(c,tt,rd_lit(calls2,tt),[6,-2]);
      rd_scr(c,S,()=>md_veil(c,S,0.55*ag_in(tt,T.tChange-0.1,1.0)));}},
    // the Post Office's engineers built a machine to answer it: the speaking clock
    {at:T.tBuilt-0.3,place:"night",room:"rdMachine",keys:[[0,960,520,1]],push:0.02,draw:(c,tt)=>{rd_pool(c,960,420,900,0.09);
      rd_machine(c,tt,{a:ag_in(tt,T.tBuilt,0.6),time:rd_hms(tt),turn:0.4*tt,read:0,lit:ag_in(tt,T.tMachine,0.8)});
      rd_scr(c,S,()=>md_textCard(c,1380,200,480,{kick:"The Post Office",title:"The speaking clock",sub:"built by its own engineers"},{edge:RD.lamp,a:ag_in(tt,T.tSpeak-0.1,0.4),k:tt-T.tSpeak+0.1}));}},
    // Jane Cain, one of the operators, recorded its words on glass discs
    {at:T.tCain-0.25,place:"night",room:"rdStudio",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{rd_pool(c,600,420,800,0.09);
      md_person(c,RD_CAIN,330,640,0.92,{t:tt,gaze:[8,0],light:RD_PAST});rd_mic(c,700,520,0.92,{});
      const rec=clamp((tt-T.tRec)/1.4,0,1),dl=ag_in(tt,T.tGlass-0.3,0.6);md_lane(c,md_curve([760,520],[1196,470],{bend:0.4}),MD.flow,0.85,{u:ag_sine(rec)});
      rd_disc(c,1420,470,224,0.35*tt,dl,{a:ag_in(tt,T.tRec+0.4,0.6)});
      rd_scr(c,S,()=>{md_nameTag(c,120,190,RD_CAIN,{role:"Operator, the voice of the speaking clock",col:RD.lamp,a:ag_in(tt,T.tCain+0.1,0.5)});
        md_tag(c,1420,790,"glass disc · her recorded words",{col:RD.lamp,align:"center",a:ag_in(tt,T.tGlass,0.5)});});}},
    // a clock played them at the right moment, checked every hour against Greenwich
    {at:T.tPlayed-0.25,place:"night",room:"rdMachine",keys:[[0,960,520,1]],push:0.02,draw:(c,tt)=>{rd_pool(c,960,420,900,0.09);
      rd_machine(c,tt,{time:rd_hms(tt),turn:0.4*tt,read:ag_in(tt,T.tMoment-0.3,0.6),lit:1});
      const g=ag_in(tt,T.tGw-0.6,0.5);if(g>0){md_lane(c,md_curve([1384,620],[1048,240],{bend:0.5}),MD.pass,0.8*g,{dash:true});}
      rd_scr(c,S,()=>{md_textCard(c,1380,200,480,{kick:"The Post Office",title:"The speaking clock",sub:"built by its own engineers"},{edge:RD.lamp});
        md_tag(c,1384,620,"Greenwich · checked every hour",{col:MD.pass,icon:"tick",a:ag_in(tt,T.tGw-0.2,0.5)});});}},
    // anyone in London could dial TIM, for time; to a tenth of a second, at any hour; 12 million calls; on demand, for anyone
    {at:T.tDial-0.25,place:"night",room:"rdDial",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{rd_pool(c,700,480,760,0.06);
      const out=ag_in(tt,T.tDemand-0.3,0.4);rd_dial(c,700,480,300,{lit:{"8":ag_in(tt,T.tT-0.05,0.25),"4":ag_in(tt,T.tI-0.05,0.25),"6":ag_in(tt,T.tM-0.05,0.25)}});
      rd_scr(c,S,()=>{const k=1-out;md_tag(c,1280,150,"From 24 July 1936 · London",{col:RD.lamp,a:ag_in(tt,T.tDial+0.2,0.5)*k});
        const tl=ag_in(tt,T.tT-0.05,0.3);if(tl>0){c.save();c.globalAlpha*=k;md_card(c,1280,220,560,170,{edge:RD.lamp,glow:0.5});
          ["T","I","M"].forEach((s,i)=>md_T(c,s,1320+i*70,330,{w:800,size:72,col:RD.lamp,a:ag_in(tt,[T.tT,T.tI,T.tM][i]-0.05,0.25)}));
          md_T(c,"for time",1560,316,{w:700,size:36,a:ag_in(tt,T.tFor-0.1,0.4)});md_T(c,"8 4 6",1560,360,{w:500,size:28,f:"mono",col:MD.soft,a:ag_in(tt,T.tFor-0.1,0.4)});c.restore();}
        md_textCard(c,1280,420,560,{kick:"Day or night",title:"To a tenth of a second"},{edge:MD.pass,a:ag_in(tt,T.tTenth-0.2,0.4)*k,k:tt-T.tTenth+0.2});
        md_textCard(c,1280,600,560,{kick:"In less than a year",title:"More than 12 million calls",sub:"24 July 1936 to 30 June 1937"},{a:ag_in(tt,T.tTwelve-0.3,0.4)*k,k:tt-T.tTwelve+0.3});
        md_pill(c,1560,470,"The exact time, on demand",{col:MD.pass,icon:"clock",size:34,a:ag_in(tt,T.tOnD-0.2,0.5),k:tt-T.tOnD+0.2});});}},
    // and that question no longer needed an operator: the board, quiet
    {at:T.tOp-0.25,place:"rdExchange",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{rd_exch(c,tt,rd_lit(rd_calls(91,3,T.tOp+0.5,4,2.5),tt),[6,-2]);
      rd_scr(c,S,()=>{const w=md_tw(c,"the time: no operator needed",{w:700,size:28})+88;md_tag(c,1824-w,96,"the time: no operator needed",{col:MD.pass,icon:"tick",a:ag_in(tt,T.tNoOp,0.5)});});}},
    // at the university, the questions asked every pay day came in a 40-page report; any other question waited a week
    {at:T.tReport-0.3,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>rd_scr(c,S,()=>{
      rd_report(c,180,150,0.86,{a:ag_in(tt,T.tReport,0.6),k:Math.min(1,ag_spr(tt,T.tReport,0.6))});
      md_tag(c,180,838,"40 pages · emailed every pay day",{a:ag_in(tt,T.tForty,0.5)});
      rd_need(c,880,250,{kick:"Any other question",q:"Casual hours in Health's second-year units?",w:860,edge:null,before:"A report of its own",a:ag_in(tt,T.tWeek,0.5),k:tt-T.tWeek,wk:clamp((tt-T.tWk+0.6)/1.6,0,1)});})},
    // now any question is answered when it's asked; the questions that come back have a dashboard of their own
    // the map leaves before the title card comes in, so no word of it shows under the title's
    {at:T.tNow-0.3,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{const fo=1-ag_in(tt,sc.cues.breath-0.5,0.6);
      md_map(c,tt,{a:fo,lit:[].concat(tt>T.tNow+0.4?["genie","gold"]:[],tt>T.tDash?["dash"]:[]),dim:["hr","fin","sis","lms","fabric","apps"]});
      rd_scr(c,S,()=>{md_tag(c,1440,860,"any question, when it's asked",{col:MD.flow,a:ag_in(tt,T.tNow+0.4,0.5)*(1-ag_in(tt,T.tDash-0.3,0.4))});
        md_tag(c,1440,860,"the questions that come back",{col:MD.layer.gold,a:ag_in(tt,T.tDash,0.5)*fo});});}}
  ],0.5);
  md_title(ctx,S,t,sc.cues.breath,"Reports on demand","answers when they're asked, dashboards for what comes back","FILM 1 OF 3 · FROM TABLES TO DECISIONS");
});

/* ---------------------------------------------------------------- 2 · Ask for the answer */
// Rohan at his desk, cut at its back edge; he looks at gz, smiles by sm
function rd_rohan(c,tt,gz,sm){md_person(c,"rohan",400,652,0.98,{t:tt,gaze:gz||[8,0],cut:RD_OFF.desk,smile:sm||0});}
const RD_BUDGET={kick:"Budget · 2027",title:"Casual teaching, Faculty of Health",sub:"to set from this year's numbers"};
scene("ask",(ctx,S,t,sc)=>{
  const T={tPay:wAt(sc,"payday","Thursday"),tRohan:wAt(sc,"rohan","Rohan"),tBudget:wAt(sc,"rohan","budget"),tCasual:wAt(sc,"casual","Casual teaching"),tHours:wAt(sc,"casual","paid for the hours"),tLinh:wAt(sc,"casual","like"),
    tNeeds:wAt(sc,"needs","First"),tOne:wAt(sc,"needs","one number"),tUsed:wAt(sc,"used","That used"),tWeek:wAt(sc,"used","and a week"),tAsks:wAt(sc,"asks","Today"),tOwn:wAt(sc,"asks","in his own words"),
    tAnswer:wAt(sc,"answer","Like the time"),tNum:wAt(sc,"answer","one point"),tCounted:wAt(sc,"counted","With it"),tWhat:wAt(sc,"counted","what it counted"),tOn:wAt(sc,"oncosts","On-costs"),
    tQuery:wAt(sc,"query","And it shows"),tRan:wAt(sc,"query","it ran"),tNext:wAt(sc,"next","His next"),tS1q:wAt(sc,"next","and Semester"),tS1:wAt(sc,"s1","Two point"),tLunch:wAt(sc,"lunch","By lunch"),tSet:wAt(sc,"lunch","is set")};
  const win=tt=>ag_in(tt,T.tAsks,0.5)*(1-ag_in(tt,T.tLunch-0.2,0.45));
  ag_shots(ctx,S,t,sc.dur,[
    // pay day in Finance: Rohan, and next year's budget for casual teaching in Health
    {at:0,place:"rdOffice",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{rd_rohan(c,tt,[8,0]);
      rd_scr(c,S,()=>{md_tag(c,96,96,"Finance · Thursday 5 November 2026 · pay day",{col:MD.soft,a:ag_in(tt,T.tPay,0.5)});
        md_nameTag(c,760,186,"rohan",{role:"Management accountant, Finance",col:MD.dom.finance,a:ag_in(tt,T.tRohan+0.2,0.5)});
        md_textCard(c,760,268,760,RD_BUDGET,{edge:MD.dom.finance,a:ag_in(tt,T.tBudget-0.1,0.4),k:tt-T.tBudget+0.1});});}},
    // casual teaching: staff paid for the hours they work, like Linh Nguyen, who tutors health informatics
    {at:T.tCasual-0.2,place:"rdTute",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{md_person(c,"linh",560,660,0.98,{t:tt,gaze:[8,-2],smile:0.3});
      rd_scr(c,S,()=>{md_textCard(c,1000,250,620,{kick:"Casual teaching",title:"Paid for the hours worked",sub:"each claim approved, then paid"},{a:ag_in(tt,T.tHours-0.2,0.4),k:tt-T.tHours+0.2});
        md_nameTag(c,880,770,"linh",{role:"Casual tutor, health informatics",col:MD.dom.teaching,a:ag_in(tt,T.tLinh,0.5)});});}},
    // one number first; it used to take a report and a week. Today he asks Genie One, and the answer comes when he asks
    {at:T.tNeeds-0.2,place:"rdOffice",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{const lk=ag_in(tt,T.tAsks,0.5)*(1-ag_in(tt,T.tLunch-0.2,0.5));
      rd_rohan(c,tt,rd_mix2([8,0],[9,1],lk),ag_in(tt,T.tS1+0.4,0.8)*0.5+ag_in(tt,T.tSet,0.8)*0.3);
      rd_scr(c,S,()=>{const cards=1-ag_in(tt,T.tAsks-0.45,0.4),back=ag_in(tt,T.tLunch+0.3,0.5);
        md_textCard(c,760,268,760,RD_BUDGET,{edge:MD.dom.finance,a:Math.max(cards,back)});
        rd_need(c,760,470,{a:ag_in(tt,T.tOne-0.2,0.4)*cards,k:tt-T.tOne+0.2,wk:clamp((tt-T.tUsed-0.6)/(T.tWeek-T.tUsed+0.6),0,1)});
        rd_genie(c,760,64,1080,800,{a:win(tt),k:tt-T.tAsks,q:clamp((tt-T.tAsks-0.7)/1.5,0,1),ans:clamp((tt-T.tNum+0.15)/0.5,0,1),cnt:clamp((tt-T.tWhat-0.6)/0.5,0,1),on:clamp((tt-T.tOn)/0.5,0,1),
          code:clamp((tt-T.tRan+0.4)/1.0,0,1)*(1-ag_in(tt,T.tNext-0.4,0.4)),q2:clamp((tt-T.tS1q)/0.7,0,1),ans2:clamp((tt-T.tS1+0.1)/0.5,0,1)});
        if(back>0)md_pill(c,1140,520,"set by lunch, from this year's numbers",{col:MD.pass,icon:"tick",a:ag_in(tt,T.tSet-0.2,0.5),k:tt-T.tSet+0.2});});}}
  ],0.5);
});

/* ---------------------------------------------------------------- 3 · What it answers from */
const RD_CW={x:800,y:80,w:1040,h:780};
// Sam and Jun, the data team, at the left of the platform's night
function rd_team(c,tt,a){if(a<=0.004)return;c.save();c.globalAlpha*=a;md_person(c,"sam",300,660,0.94,{t:tt,gaze:[8,0]});md_person(c,"jun",560,690,0.9,{t:tt+0.8,gaze:[8,0]});c.restore();}
scene("context",(ctx,S,t,sc)=>{
  const T={tAgent:wAt(sc,"agent","Genie One"),tGA:wAt(sc,"agent","a Genie Agent"),tSam:wAt(sc,"agent","Sam"),tJun:wAt(sc,"agent","Jun"),tOne:wAt(sc,"agent","this one subject"),
    tFilms:wAt(sc,"films","Two earlier"),tPut:wAt(sc,"put","Here is"),tData:wAt(sc,"data","Its data"),tMeasure:wAt(sc,"data","one measure"),tBy:wAt(sc,"data","by faculty"),
    tDef:wAt(sc,"defined","Rohan defined"),tNextF:wAt(sc,"defined","the next film"),tRules:wAt(sc,"rules","Its rules"),tRohans:wAt(sc,"rohans","Rohan's"),tIngrid:wAt(sc,"ingrid","Ingrid's"),
    tReads:wAt(sc,"reads","So it reads"),tNever:wAt(sc,"reads","never anyone's"),tEx:wAt(sc,"examples","Its examples"),tFin:wAt(sc,"examples","questions Finance"),tQry:wAt(sc,"examples","the query"),
    tTests:wAt(sc,"tests","And its tests"),tKnown:wAt(sc,"tests","known answers"),tRun:wAt(sc,"tests","run after"),tAsker:wAt(sc,"asker","Each answer"),tMay:wAt(sc,"asker","only what"),
    tMoved:wAt(sc,"moved","So the data team's"),tModels:wAt(sc,"models","Not a report"),tGood:wAt(sc,"models","good models"),tPeople:wAt(sc,"models","for people and agents"),
    tSmall:wAt(sc,"small","They started small"),tFirst:wAt(sc,"small","its first user")};
  // the tab open and how its page comes and goes: each page leaves before the next comes in
  const tabs=[T.tPut+0.4,T.tRules-0.1,T.tEx-0.1,T.tTests-0.1];
  const tabAt=tt=>{let k=0;for(let i=1;i<4;i++)if(tt>=tabs[i])k=i;return k;};
  ag_shots(ctx,S,t,sc.dur,[
    // Genie One answered from a Genie Agent, which Sam and Jun set up for this one subject; two earlier films show how; what they put in it
    {at:0,place:"map",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{rd_team(c,tt,1);
      rd_scr(c,S,()=>{const ch=1-ag_in(tt,T.tPut-0.4,0.4);
        md_nameTag(c,120,262,"sam",{role:"Data platform",col:MD.flow,a:ag_in(tt,T.tSam,0.5)});md_nameTag(c,470,330,"jun",{role:"Analytics engineer",col:MD.flow,a:ag_in(tt,T.tJun,0.5)});
        if(ch>0){c.save();c.globalAlpha*=ch;const g1=md_textCard(c,840,160,420,{kick:"Rohan asked",title:"Genie One"},{icon:"query",a:ag_in(tt,T.tAgent,0.5)});
          const ga=ag_in(tt,T.tGA,0.5);md_lane(c,md_curve([1260,g1.y+g1.h/2],[1380,g1.y+g1.h/2],{bend:0.5}),MD.flow,0.85*ga,{u:ga});
          md_textCard(c,1380,160,460,{kick:"It answered from",title:"a Genie Agent",sub:"one subject: casual teaching cost"},{edge:MD.flow,a:ga,k:tt-T.tGA});
          md_textCard(c,840,470,480,{kick:"An earlier film",title:"Meaning on the platform"},{a:ag_in(tt,T.tFilms+0.3,0.5),k:tt-T.tFilms-0.3});
          md_textCard(c,1360,470,480,{kick:"An earlier film",title:"Working with agents on Databricks"},{a:ag_in(tt,T.tFilms+0.7,0.5),k:tt-T.tFilms-0.7});c.restore();}
        const k=tabAt(tt),pg=k===0?clamp((tt-T.tData-0.1)/0.5,0,1):clamp((tt-tabs[k]-0.35)/0.45,0,1),nx=k<3?tabs[k+1]:1e9,out=clamp((tt-(nx-0.4))/0.35,0,1),P={};
        P.data={m:clamp((tt-T.tMeasure+0.2)/0.6,0,1),f:clamp((tt-T.tBy)/1.6,0,1),def:clamp((tt-T.tDef)/0.6,0,1)};P.rules={r:clamp((tt-T.tRohans)/0.6,0,1),i:clamp((tt-T.tIngrid)/0.6,0,1),reads:clamp((tt-T.tNever+0.4)/0.6,0,1)};
        P.examples={n:clamp((tt-T.tFin)/0.6,0,1)+clamp((tt-T.tQry)/0.6,0,1)};P.tests={n:clamp((tt-T.tKnown+0.2)/0.6,0,1)+clamp((tt-T.tKnown-0.4)/0.6,0,1),run:clamp((tt-T.tRun)/0.8,0,1)};
        const wa=ag_in(tt,T.tPut,0.5)*(1-ag_in(tt,T.tMoved-0.5,0.45));
        rd_agent(c,RD_CW.x,RD_CW.y,RD_CW.w,RD_CW.h,{a:wa,k:tt-T.tPut,tab:k,prev:k-1,tabA:k?ag_in(tt,tabs[k],0.3):1,pg,out,p:P});
        md_pill(c,RD_CW.x+RD_CW.w/2,RD_CW.y+RD_CW.h-130,"it runs as the person asking",{col:MD.flow,icon:"person",size:30,a:ag_in(tt,T.tAsker+0.3,0.5)*wa,k:tt-T.tAsker-0.3});
        md_T(c,"they see only what they may read",RD_CW.x+RD_CW.w/2,RD_CW.y+RD_CW.h-60,{w:600,size:28,align:"center",col:MD.soft,a:ag_in(tt,T.tMay,0.5)*wa});});}},
    // so the data team's work has moved: good models and their context, built once, for people and agents to explore; started small
    {at:T.tMoved-0.2,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
      md_map(c,tt,{lit:[].concat(tt>T.tGood?["gold","platform"]:[],tt>T.tPeople?["genie","dash","apps"]:[]),dim:tt<T.tGood?[]:["hr","fin","sis","lms"]});
      rd_scr(c,S,()=>{md_tag(c,960,862,"not a report for each question",{col:MD.soft,align:"center",a:rd_io(tt,T.tModels,T.tGood-0.2,0.4,0.35)});
        md_tag(c,960,862,"good models and their context, built once",{col:MD.layer.gold,icon:"contract",align:"center",a:rd_io(tt,T.tGood+0.1,T.tSmall-0.4,0.4,0.35)});
        md_tag(c,960,862,"started small · its first user: Rohan Desai",{col:MD.dom.finance,icon:"person",align:"center",a:ag_in(tt,T.tFirst-0.4,0.5)});});}}
  ],0.5);
});

/* ---------------------------------------------------------------- 4 · The questions that come back */
const RD_DW={x:80,y:120,w:1760,h:660};
scene("back",(ctx,S,t,sc)=>{
  const T={tSome:wAt(sc,"some","Some questions"),tPay:wAt(sc,"some","every pay day"),tCost:wAt(sc,"cost","What did"),tHours:wAt(sc,"hours","How many"),tWait:wAt(sc,"waiting","How many"),
    tMach:wAt(sc,"machine","Like the time"),tOne:wAt(sc,"machine","one dashboard"),tRef:wAt(sc,"refresh","It refreshes"),tGoes:wAt(sc,"refresh","goes to"),
    tToday:wAt(sc,"today","Today"),tNine:wAt(sc,"today","nine point"),tClaims:wAt(sc,"claims","forty-three"),tGenie:wAt(sc,"genie","For a question"),tAsk:wAt(sc,"genie","Ask Genie"),tSame:wAt(sc,"genie","the same"),
    tRep:wAt(sc,"replaced","It replaced"),tPage:wAt(sc,"pageone","The three"),tFirst:wAt(sc,"pageone","first page"),tRet:wAt(sc,"retired","retired"),
    tRule:wAt(sc,"rule","A rule"),tDes:wAt(sc,"rule","a question deserves"),tSched:wAt(sc,"rule","comes back"),tActs:wAt(sc,"rule","someone acts"),tOther:wAt(sc,"other","Every other")};
  ag_shots(ctx,S,t,sc.dur,[
    // three questions that come back every pay day, from the same people; one dashboard, refreshed after each pay run, sent to them
    {at:0,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>rd_scr(c,S,()=>{
      md_tag(c,96,68,"Every pay day, from the same people",{col:MD.soft,icon:"refresh",a:ag_in(tt,T.tPay-0.2,0.5)*(1-ag_in(tt,T.tMach-0.3,0.4))});
      // the pay days, one after another, before the questions they bring come in
      const pd=1-ag_in(tt,T.tCost-0.5,0.4);if(pd>0)["22 October","5 November","19 November"].forEach((d,i)=>md_tag(c,960+(i-1)*360,470,"pay day · "+d,{col:MD.soft,icon:"clock",align:"center",a:pd*ag_in(tt,T.tSome+0.4+i*0.5,0.4)}));
      const b=rd_dash(c,RD_DW.x,RD_DW.y,RD_DW.w,RD_DW.h,{tiles:clamp((tt-T.tCost)/0.5,0,1)+clamp((tt-T.tHours)/0.5,0,1)+clamp((tt-T.tWait)/0.5,0,1),frame:ag_in(tt,T.tOne-0.1,0.6),
        fig:clamp((tt-T.tNine+0.2)/0.6,0,1)+clamp((tt-T.tNine-1.6)/0.8,0,1)+clamp((tt-T.tClaims+0.3)/0.6,0,1),ref:clamp((tt-T.tRef)/0.5,0,1),ask:clamp((tt-T.tAsk+0.3)/0.5,0,1),askLit:ag_in(tt,T.tAsk+0.4,0.5)});
      rd_subs(c,96,846,ag_in(tt,T.tGoes,0.6));
      const ga=ag_in(tt,T.tSame-0.2,0.5);if(ga>0){const w=md_tw(c,"the same Genie Agent: casual teaching cost",{w:700,size:28})+88;md_tag(c,RD_DW.x+RD_DW.w-w,68,"the same Genie Agent: casual teaching cost",{col:MD.flow,icon:"query",a:ga});}})},
    // it replaced a 40-page report, emailed every pay day: its three figures on page one; now it's retired
    {at:T.tRep-0.25,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>rd_scr(c,S,()=>{
      rd_report(c,240,150,1,{hl:clamp((tt-T.tFirst+0.4)/1.0,0,1),ret:clamp((tt-T.tRet+0.2)/0.8,0,1),fan:1});
      md_textCard(c,1000,200,700,{kick:"Every pay day, by email",title:"The fortnightly pay report",sub:"40 pages · its three figures on page 1"},{a:ag_in(tt,T.tRep+0.2,0.5),k:tt-T.tRep-0.2});
      md_pill(c,1350,520,"replaced by one dashboard",{col:MD.pass,icon:"tick",size:30,a:ag_in(tt,T.tRet,0.5),k:tt-T.tRet});
      rd_statement(c,S,ag_in(tt,T.tRule-0.2,0.6),["A question deserves a dashboard","when it comes back on a schedule,","and someone acts on what it shows.","Every other question: ask it when it's needed."],
        {cols:[MD.ink,MD.ink,MD.ink,MD.flow],n:ag_in(tt,T.tRule,0.5)+ag_in(tt,T.tSched-0.2,0.5)+ag_in(tt,T.tActs-0.2,0.5)+ag_in(tt,T.tOther,0.5),k:tt-T.tRule});})}
  ],0.5);
});

/* ---------------------------------------------------------------- 5 · Asked when it's needed */
scene("close",(ctx,S,t,sc)=>{
  const T={tThen:wAt(sc,"then","In nineteen"),tAny:wAt(sc,"then","anyone could"),tUni:wAt(sc,"uni","At the university"),tOne:wAt(sc,"uni","one dashboard"),tEvery:wAt(sc,"every","Every other"),tGood:wAt(sc,"every","good models"),
    tBudget:wAt(sc,"budget","And Health's"),tMorning:wAt(sc,"budget","in a morning"),tOld:wAt(sc,"old","None"),tEasier:wAt(sc,"old","easier"),tDocs:wAt(sc,"docs","So don't"),tInv:wAt(sc,"docs","investigate"),
    tAdapt:wAt(sc,"docs","adapt"),tImpl:wAt(sc,"docs","implement"),tIter:wAt(sc,"docs","iterate"),tOff:wAt(sc,"docs","the official docs"),tTake:wAt(sc,"takeaway","Ask for"),tKeep:wAt(sc,"takeaway","keep dashboards"),
    tNext:wAt(sc,"nextfilm","Next"),tDefined:wAt(sc,"nextfilm","defined in the open")};
  ag_shots(ctx,S,t,sc.dur,[
    // 1936: the question everyone asked got a machine of its own, and anyone could ask it, at any hour
    {at:0,place:"night",room:"rdMachine",keys:[[0,960,520,1]],push:0.02,draw:(c,tt)=>{rd_pool(c,960,420,900,0.09);rd_machine(c,tt,{time:rd_hms(tt+60),turn:0.4*tt,read:1,lit:1});
      rd_scr(c,S,()=>{md_tag(c,96,96,"London · 1936",{col:RD.lamp,a:ag_in(tt,T.tThen,0.5)});md_pill(c,1600,470,"anyone, at any hour",{col:MD.pass,icon:"clock",size:30,a:ag_in(tt,T.tAny,0.5),k:tt-T.tAny});});}},
    // at the university: one dashboard for the questions that come back; every other question asked when it's needed
    {at:T.tUni-0.25,place:"map",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
      md_map(c,tt,{lit:[].concat(["dash"],tt>T.tGood?["gold","genie"]:[]),dim:["hr","fin","sis","lms","fabric","apps"]});
      rd_scr(c,S,()=>{md_tag(c,960,862,"one dashboard: the questions that come back",{col:MD.layer.gold,align:"center",a:rd_io(tt,T.tOne,T.tEvery-0.2,0.4,0.35)});
        md_tag(c,960,862,"every other question: Genie, from good models and their context",{col:MD.flow,align:"center",a:ag_in(tt,T.tGood,0.5)});});}},
    // and Health's casual teaching budget, set from this year's numbers, in a morning, not a week
    {at:T.tBudget-0.25,place:"rdOffice",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{rd_rohan(c,tt,[8,0],0.5);
      rd_scr(c,S,()=>{md_textCard(c,760,268,760,RD_BUDGET,{edge:MD.dom.finance,a:ag_in(tt,T.tBudget,0.5),k:tt-T.tBudget});
        md_pill(c,1140,520,"set in a morning, not a week",{col:MD.pass,icon:"tick",a:ag_in(tt,T.tMorning-0.2,0.5),k:tt-T.tMorning+0.2});});}},
    // none of these ideas is new: investigate, adapt, implement and iterate, from the official docs, linked on this page
    {at:T.tOld-0.25,place:"night",room:"rdDocs",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>rd_scr(c,S,()=>{
      md_textCard(c,560,150,800,{kick:"None of these ideas is new",title:"The tools now make them easier"},{a:ag_in(tt,T.tOld+0.3,0.5),k:tt-T.tOld-0.3});
      const steps=[["investigate",T.tInv],["adapt",T.tAdapt],["implement",T.tImpl],["iterate",T.tIter]],ws=steps.map(([s])=>md_tw(c,s,{w:700,size:28})+44);let x=960-(ws.reduce((a,b)=>a+b,0)+60*3)/2;
      steps.forEach(([s,ts],i)=>{const a=ag_in(tt,ts-0.1,0.4);md_tag(c,x,420,s,{col:MD.flow,a});if(i<3)md_lane(c,[[x+ws[i]+8,420],[x+ws[i]+52,420]],MD.flow,0.7*ag_in(tt,steps[i+1][1]-0.2,0.3));x+=ws[i]+60;});
      md_textCard(c,500,520,920,{kick:"Start here",title:"The official docs, linked on this page",sub:"Genie One · Genie Agents · AI/BI dashboards · metric views"},{edge:MD.flow,a:ag_in(tt,T.tOff,0.5),k:tt-T.tOff});})},
    // ask for the answer; keep dashboards for the questions that come back. Next: casual teaching cost, defined in the open
    {at:T.tTake-0.4,later:true,dis:0.4,place:"night",room:"rdDocs",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>rd_scr(c,S,()=>{
      const st=1-ag_in(tt,T.tNext-0.4,0.4);
      if(st>0){c.save();c.globalAlpha*=st;md_T(c,"Ask for the answer;",960,450,{w:700,size:52,align:"center",a:ag_in(tt,T.tTake,0.5)});
        md_T(c,"keep dashboards for the questions that come back.",960,530,{w:700,size:44,align:"center",col:MD.layer.gold,a:ag_in(tt,T.tKeep,0.5)});c.restore();}
      md_textCard(c,560,360,800,{kick:"Next · Film 2 of 3",title:"Defined in the open",sub:"casual teaching cost, defined so every reader counts it the same way"},{edge:MD.agreed,a:ag_in(tt,T.tNext,0.5)*(1-ag_in(tt,sc.cues.breath-0.2,0.5)),k:tt-T.tNext});})}
  ],0.5);
  md_end(ctx,S,t,sc.cues.breath,"Reports on demand","Ask for the answer; keep dashboards for the questions that come back.","Film 1 of 3","From tables to decisions");
});

// the questions that come back open on the map the chapter before ends on: the camera glides on from where it was, and what the map
// showed leaves before the dashboard comes in (a later moment)
ag_cutInto(["back"]);

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
